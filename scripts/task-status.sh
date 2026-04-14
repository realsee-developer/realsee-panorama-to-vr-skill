#!/usr/bin/env bash
set -euo pipefail

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
  ./scripts/task-status.sh --workspace <workspace-root> --task-code <task-code>

Prints background poll status plus the current state/result snapshot for the task.
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
state_file="$task_dir/state.json"
result_file="$task_dir/result.json"

if [[ ! -d "$task_dir" ]]; then
  echo "Task directory not found: $task_dir" >&2
  exit 1
fi

echo "task_dir: $task_dir"

if [[ -f "$pid_file" ]]; then
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
    echo "background_poll: running (pid=$pid)"
  else
    rm -f "$pid_file"
    echo "background_poll: finished or exited"
  fi
else
  echo "background_poll: not started"
fi

python3 - "$state_file" "$result_file" <<'PY'
import json
import sys
from pathlib import Path

state_path = Path(sys.argv[1])
result_path = Path(sys.argv[2])

if state_path.exists():
    state = json.loads(state_path.read_text())
    print("state:")
    for key in ["task_code", "project_id", "last_poll_status", "vr_url", "workspace_dir"]:
        print(f"  {key}: {state.get(key)}")
else:
    print("state: missing")

if result_path.exists():
    result = json.loads(result_path.read_text())
    print("result:")
    for key in ["status", "task_code", "project_id", "vr_url", "workspace_dir"]:
        print(f"  {key}: {result.get(key)}")
else:
    print("result: missing")
PY

if [[ -f "$stdout_log" ]]; then
  echo "stdout_log: $stdout_log"
fi

if [[ -f "$stderr_log" ]]; then
  echo "stderr_log: $stderr_log"
fi
