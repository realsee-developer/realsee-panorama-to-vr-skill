#!/usr/bin/env bash
set -euo pipefail

CODEX_HOME_DIR="${CODEX_HOME:-$HOME/.codex}"
VALIDATOR="$CODEX_HOME_DIR/skills/.system/skill-creator/scripts/quick_validate.py"

if [[ ! -f "$VALIDATOR" ]]; then
  echo "quick_validate.py not found at $VALIDATOR" >&2
  exit 1
fi

python3 "$VALIDATOR" ./.agents/skills/realsee-pano-to-vr
