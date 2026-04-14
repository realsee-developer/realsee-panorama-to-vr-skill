#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

workspace_arg=""
task_code=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --workspace)
      workspace_arg="${2:-}"
      shift 2
      ;;
    --task-code)
      task_code="${2:-}"
      shift 2
      ;;
    --help|-h)
      cat <<'EOF'
Usage:
  ./scripts/start-background-poll.sh --workspace <workspace-root> --task-code <task-code>

Starts a detached polling process for an existing Realsee task and writes:
  background-poll.pid
  background-poll.stdout.log
  background-poll.stderr.log
inside <workspace-root>/<task-code>/.
EOF
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$workspace_arg" || -z "$task_code" ]]; then
  echo "Both --workspace and --task-code are required." >&2
  exit 1
fi

workspace_root="$(python3 -c 'import os,sys; print(os.path.abspath(sys.argv[1]))' "$workspace_arg")"
task_dir="$workspace_root/$task_code"
pid_file="$task_dir/background-poll.pid"
stdout_log="$task_dir/background-poll.stdout.log"
stderr_log="$task_dir/background-poll.stderr.log"

mkdir -p "$task_dir"

if [[ -f "$pid_file" ]]; then
  existing_pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -n "$existing_pid" ]] && kill -0 "$existing_pid" 2>/dev/null; then
    echo "Background poll already running with pid $existing_pid" >&2
    exit 1
  fi
  rm -f "$pid_file"
fi

(
  cd "$ROOT_DIR"
  npm run run -- --workspace "$workspace_root" --task-code "$task_code" --json
) >>"$stdout_log" 2>>"$stderr_log" < /dev/null &

pid=$!
echo "$pid" > "$pid_file"

echo "Started background poll"
echo "  pid: $pid"
echo "  task_code: $task_code"
echo "  workspace: $workspace_root"
echo "  stdout: $stdout_log"
echo "  stderr: $stderr_log"
