import { spawnSync } from 'node:child_process'
import { constants } from 'node:fs'
import { access, readFile } from 'node:fs/promises'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getRepoRoot(metaUrl) {
  return resolve(dirname(fileURLToPath(metaUrl)), '..')
}

export function logStep(step, message) {
  process.stdout.write(`[${step}] ${message}\n`)
}

export function fail(message, exitCode = 1) {
  process.stderr.write(`${message}\n`)
  process.exit(exitCode)
}

export async function pathExists(path) {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function readJsonIfExists(path, fallback = null) {
  if (!(await pathExists(path))) {
    return fallback
  }
  return JSON.parse(await readFile(path, 'utf-8'))
}

export function runCommand(command, args, { cwd, env, stdio = 'pipe', check = true } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio,
    encoding: 'utf-8',
  })

  if (result.error) {
    throw result.error
  }

  if (check && result.status !== 0) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(`Command failed: ${command} ${args.join(' ')}${details ? `\n${details}` : ''}`)
  }

  return result
}

export function findExecutablesInPath(command) {
  const pathValue = process.env.PATH ?? ''
  const pathEntries = pathValue.split(delimiter).filter(Boolean)
  const pathExtEntries = process.platform === 'win32'
    ? (process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM').split(';').filter(Boolean)
    : ['']

  const seen = new Set()
  const matches = []

  for (const entry of pathEntries) {
    for (const ext of pathExtEntries) {
      const candidate = join(entry, process.platform === 'win32' ? `${command}${ext}` : command)
      if (seen.has(candidate)) {
        continue
      }
      seen.add(candidate)
      matches.push(candidate)
    }
  }

  return matches
}

export function isPidRunning(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}
