#!/usr/bin/env node
import { readFile, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { isPidRunning, pathExists, readJsonIfExists } from './lib/node-cli.mjs'

function parseArgs(argv) {
  const parsed = {}

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--help' || value === '-h') {
      parsed.help = true
      continue
    }
    if (value === '--workspace' || value === '--task-code') {
      parsed[value.slice(2)] = argv[index + 1]
      index += 1
      continue
    }
    throw new Error(`Unknown argument: ${value}`)
  }

  return parsed
}

function printRecord(label, record, keys) {
  if (!record) {
    process.stdout.write(`${label}: missing\n`)
    return
  }

  process.stdout.write(`${label}:\n`)
  for (const key of keys) {
    process.stdout.write(`  ${key}: ${record[key] ?? null}\n`)
  }
}

const args = parseArgs(process.argv.slice(2))
if (args.help) {
  process.stdout.write('Usage:\n')
  process.stdout.write('  node ./scripts/task-status.mjs --workspace <workspace-root> --task-code <task-code>\n')
  process.exit(0)
}

if (!args.workspace || !args['task-code']) {
  throw new Error('Both --workspace and --task-code are required.')
}

const workspaceRoot = resolve(args.workspace)
const taskCode = String(args['task-code'])
const taskDir = join(workspaceRoot, taskCode)
const pidFile = join(taskDir, 'background-poll.pid')
const stdoutLog = join(taskDir, 'background-poll.stdout.log')
const stderrLog = join(taskDir, 'background-poll.stderr.log')
const stateFile = join(taskDir, 'state.json')
const resultFile = join(taskDir, 'result.json')

if (!(await pathExists(taskDir))) {
  throw new Error(`Task directory not found: ${taskDir}`)
}

process.stdout.write(`task_dir: ${taskDir}\n`)

if (await pathExists(pidFile)) {
  const pid = Number((await readFile(pidFile, 'utf-8')).trim())
  if (pid && isPidRunning(pid)) {
    process.stdout.write(`background_poll: running (pid=${pid})\n`)
  } else {
    await rm(pidFile, { force: true })
    process.stdout.write('background_poll: finished or exited\n')
  }
} else {
  process.stdout.write('background_poll: not started\n')
}

printRecord('state', await readJsonIfExists(stateFile), [
  'task_code',
  'project_id',
  'last_poll_status',
  'vr_url',
  'workspace_dir',
])

printRecord('result', await readJsonIfExists(resultFile), [
  'status',
  'task_code',
  'project_id',
  'vr_url',
  'workspace_dir',
])

if (await pathExists(stdoutLog)) {
  process.stdout.write(`stdout_log: ${stdoutLog}\n`)
}

if (await pathExists(stderrLog)) {
  process.stdout.write(`stderr_log: ${stderrLog}\n`)
}
