#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "node is required but not installed" >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required but not installed" >&2
  exit 1
fi

echo "[bootstrap] repo root: $ROOT_DIR"
echo "[bootstrap] node: $(node --version)"
echo "[bootstrap] npm: $(npm --version)"

echo "[bootstrap] installing root dependencies"
npm install

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
  echo "[bootstrap] created .env from .env.example"
else
  echo "[bootstrap] .env already exists"
fi

chmod +x \
  "$ROOT_DIR/scripts/install-codex-skill.sh" \
  "$ROOT_DIR/scripts/validate-skill.sh" \
  "$ROOT_DIR/scripts/bootstrap-local-env.sh" \
  "$ROOT_DIR/scripts/doctor-local-env.sh" \
  "$ROOT_DIR/scripts/start-background-poll.sh" \
  "$ROOT_DIR/scripts/task-status.sh" \
  "$ROOT_DIR/.agents/skills/realsee-pano-to-vr/scripts/run-pano-to-vr.mjs"

echo "[bootstrap] syncing Claude plugin skill copy"
npm run sync:claude-plugin

echo "[bootstrap] validating canonical skill"
npm run validate:skill

echo "[bootstrap] local environment prepared"
echo "[bootstrap] next steps:"
echo "  1. Fill REALSEE_APP_KEY / REALSEE_APP_SECRET in .env"
echo "  2. Run: npm run doctor:local"
echo "  3. Run: npm run run -- --manifest ./examples/manifest-input/manifest.json --images-dir ./examples/manifest-input/images --workspace ./workspace --json"
