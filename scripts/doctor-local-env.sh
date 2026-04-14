#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
SKILL_DIR="$ROOT_DIR/.agents/skills/realsee-pano-to-vr"
PLUGIN_DIR="$ROOT_DIR/.claude-plugin/realsee-pano-to-vr-agent-plugin"

failures=0
warnings=0

print_status() {
  local level="$1"
  local message="$2"
  printf '[%s] %s\n' "$level" "$message"
}

check_cmd() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    print_status OK "$name: $("$name" --version 2>/dev/null | head -n 1)"
  else
    print_status WARN "$name: not installed"
    warnings=$((warnings + 1))
  fi
}

cd "$ROOT_DIR"

if [[ -f "$ROOT_DIR/package.json" ]]; then
  print_status OK "package.json present"
else
  print_status FAIL "package.json missing"
  failures=$((failures + 1))
fi

if [[ -d "$ROOT_DIR/node_modules" ]]; then
  print_status OK "root node_modules present"
else
  print_status FAIL "root node_modules missing; run npm install"
  failures=$((failures + 1))
fi

if [[ -f "$ENV_FILE" ]]; then
  print_status OK ".env present"
  if grep -q 'your_app_key_here' "$ENV_FILE" || grep -q 'your_app_secret_here' "$ENV_FILE"; then
    print_status WARN ".env still contains placeholder Realsee credentials"
    warnings=$((warnings + 1))
  fi
else
  print_status WARN ".env missing; run npm run setup:local"
  warnings=$((warnings + 1))
fi

if [[ -f "$SKILL_DIR/package.json" && -f "$SKILL_DIR/SKILL.md" ]]; then
  print_status OK "canonical skill files present"
else
  print_status FAIL "canonical skill files incomplete"
  failures=$((failures + 1))
fi

if [[ -f "$PLUGIN_DIR/.claude-plugin/plugin.json" ]]; then
  print_status OK "Claude plugin manifest present"
else
  print_status FAIL "Claude plugin manifest missing"
  failures=$((failures + 1))
fi

check_cmd node
check_cmd npm
check_cmd python3

if command -v claude >/dev/null 2>&1; then
  mapfile -t claude_bins < <(type -a -p claude 2>/dev/null | awk 'NF && !seen[$0]++')
  if (( ${#claude_bins[@]} > 1 )); then
    print_status WARN "multiple Claude Code binaries detected in PATH; keep either native or Homebrew, not both"
    warnings=$((warnings + 1))
  fi
fi

if [[ -e "$HOME/.gemini/skills/realsee-pano-to-vr" && -f "$SKILL_DIR/SKILL.md" ]]; then
  print_status WARN "Gemini global skill and workspace skill both exist; use only one discovery path"
  warnings=$((warnings + 1))
fi

if command -v claude >/dev/null 2>&1; then
  claude_output="$(claude plugin validate "$PLUGIN_DIR" 2>&1 || true)"
  if grep -q 'Unrecognized key: "userConfig"' <<<"$claude_output"; then
    print_status WARN "Claude Code validator on this machine does not recognize userConfig yet"
    warnings=$((warnings + 1))
  elif grep -q 'Validation failed' <<<"$claude_output"; then
    print_status FAIL "Claude plugin validate failed"
    printf '%s\n' "$claude_output"
    failures=$((failures + 1))
  else
    print_status OK "Claude plugin validate passed"
  fi
else
  print_status WARN "claude: not installed"
  warnings=$((warnings + 1))
fi

if command -v gemini >/dev/null 2>&1; then
  if gemini skills --help >/dev/null 2>&1; then
    print_status OK "gemini skills command available"
  else
    print_status WARN "gemini installed but skills subcommand unavailable"
    warnings=$((warnings + 1))
  fi
else
  print_status WARN "gemini: not installed"
  warnings=$((warnings + 1))
fi

if npm run validate:skill >/dev/null 2>&1; then
  print_status OK "skill validation passed"
else
  print_status FAIL "skill validation failed"
  failures=$((failures + 1))
fi

print_status INFO "warnings=$warnings failures=$failures"

if (( failures > 0 )); then
  exit 1
fi
