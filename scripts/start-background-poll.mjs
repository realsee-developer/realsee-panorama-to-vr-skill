#!/usr/bin/env node
import { openSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { join, resolve } from 'node:path'
import { getRepoRoot, isPidRunning, pathExists } from './lib/node-cli.mjs'

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

const args = parseArgs(process.argv.slice(2))
if (args.help) {
  process.stdout.write('Usage:\n')
  process.stdout.write('  node ./scripts/start-background-poll.mjs --workspace <workspace-root> --task-code <task-code>\n')
  process.exit(0)
}

if (!args.workspace || !args['task-code']) {
  throw new Error('Both --workspace and --task-code are required.')
}

const rootDir = getRepoRoot(import.meta.url)
const workspaceRoot = resolve(args.workspace)
const taskCode = String(args['task-code'])
const taskDir = join(workspaceRoot, taskCode)
const pidFile = join(taskDir, 'background-poll.pid')
const stdoutLog = join(taskDir, 'background-poll.stdout.log')
const stderrLog = join(taskDir, 'background-poll.stderr.log')
const runtimeEntry = join(rootDir, '.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs')

await mkdir(taskDir, { recursive: true })

// Reuse the pid file only when the previous process is gone.
if (await pathExists(pidFile)) {
  const existingPid = Number((await readFile(pidFile, 'utf-8')).trim())
  if (existingPid && isPidRunning(existingPid)) {
    throw new Error(`Background poll already running with pid ${existingPid}`)
  }
  await rm(pidFile, { force: true })
}

// The detached child keeps polling after the current terminal command exits.
const child = spawn(process.execPath, [runtimeEntry, '--workspace', workspaceRoot, '--task-code', taskCode, '--json'], {
  cwd: rootDir,
  detached: true,
  stdio: [
    'ignore',
    openSync(stdoutLog, 'a'),
    openSync(stderrLog, 'a'),
  ],
  env: process.env,
})

child.unref()
await writeFile(pidFile, `${child.pid}\n`, 'utf-8')

process.stdout.write('Started background poll\n')
process.stdout.write(`  pid: ${child.pid}\n`)
process.stdout.write(`  task_code: ${taskCode}\n`)
process.stdout.write(`  workspace: ${workspaceRoot}\n`)
process.stdout.write(`  stdout: ${stdoutLog}\n`)
process.stdout.write(`  stderr: ${stderrLog}\n`)
