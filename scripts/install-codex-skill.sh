#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/.agents/skills/realsee-pano-to-vr"
TARGET_ROOT="${CODEX_HOME:-$HOME/.codex}/skills"
TARGET_DIR="$TARGET_ROOT/realsee-pano-to-vr"

mkdir -p "$TARGET_ROOT"
rm -rf "$TARGET_DIR"
ln -s "$SOURCE_DIR" "$TARGET_DIR"

echo "Linked Codex skill:"
echo "  source: $SOURCE_DIR"
echo "  target: $TARGET_DIR"
