#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { findExecutablesInPath, getRepoRoot, pathExists, runCommand } from './lib/node-cli.mjs'

const rootDir = getRepoRoot(import.meta.url)
const envFile = join(rootDir, '.env')
const skillDir = join(rootDir, '.agents/skills/realsee-pano-to-vr')
const pluginDir = join(rootDir, '.claude-plugin/realsee-vr-skillkit')

let failures = 0
let warnings = 0

function printStatus(level, message) {
  process.stdout.write(`[${level}] ${message}\n`)
}

function markFailure(message) {
  printStatus('FAIL', message)
  failures += 1
}

function markWarning(message) {
  printStatus('WARN', message)
  warnings += 1
}

function markOk(message) {
  printStatus('OK', message)
}

function checkCommand(name) {
  const matches = findExecutablesInPath(name).filter((candidate) => {
    try {
      return runCommand(candidate, ['--version'], { check: false }).status === 0
    } catch {
      return false
    }
  })

  if (matches.length === 0) {
    markWarning(`${name}: not installed`)
    return false
  }

  const versionResult = runCommand(matches[0], ['--version'], { check: false })
  const version = `${versionResult.stdout || versionResult.stderr}`.trim().split('\n')[0]
  markOk(`${name}: ${version}`)
  return true
}

if (await pathExists(join(rootDir, 'package.json'))) {
  markOk('package.json present')
} else {
  markFailure('package.json missing')
}

if (await pathExists(join(rootDir, 'node_modules'))) {
  markOk('root node_modules present')
} else {
  markFailure('root node_modules missing; run npm install')
}

if (await pathExists(envFile)) {
  markOk('.env present')
  const envText = await readFile(envFile, 'utf-8')
  if (envText.includes('your_app_key_here') || envText.includes('your_app_secret_here')) {
    markWarning('.env still contains placeholder Realsee credentials')
  }
} else {
  markWarning('.env missing; run npm run setup:local')
}

if (await pathExists(join(skillDir, 'package.json')) && await pathExists(join(skillDir, 'SKILL.md'))) {
  markOk('canonical skill files present')
} else {
  markFailure('canonical skill files incomplete')
}

if (await pathExists(join(pluginDir, '.claude-plugin/plugin.json'))) {
  markOk('Claude plugin manifest present')
} else {
  markFailure('Claude plugin manifest missing')
}

checkCommand('node')
checkCommand('npm')

const claudeMatches = findExecutablesInPath('claude').filter((candidate) => {
  try {
    return runCommand(candidate, ['--version'], { check: false }).status === 0
  } catch {
    return false
  }
})

if (claudeMatches.length > 1) {
  markWarning('multiple Claude Code binaries detected in PATH; keep either native or Homebrew, not both')
}

if (await pathExists(join(process.env.HOME ?? '.', '.gemini/skills/realsee-pano-to-vr')) && await pathExists(join(skillDir, 'SKILL.md'))) {
  markWarning('Gemini global skill and workspace skill both exist; use only one discovery path')
}

if (claudeMatches.length > 0) {
  const claudeOutput = runCommand(claudeMatches[0], ['plugin', 'validate', pluginDir], { check: false })
  const combinedOutput = `${claudeOutput.stdout}${claudeOutput.stderr}`
  if (combinedOutput.includes('Unrecognized key: "userConfig"')) {
    markWarning('Claude Code validator on this machine does not recognize userConfig yet')
  } else if (claudeOutput.status !== 0) {
    markFailure('Claude plugin validate failed')
    process.stdout.write(combinedOutput)
  } else {
    markOk('Claude plugin validate passed')
  }
} else {
  markWarning('claude: not installed')
}

const geminiMatches = findExecutablesInPath('gemini').filter((candidate) => {
  try {
    return runCommand(candidate, ['--version'], { check: false }).status === 0
  } catch {
    return false
  }
})

if (geminiMatches.length > 0) {
  const geminiHelp = runCommand(geminiMatches[0], ['skills', '--help'], { check: false })
  if (geminiHelp.status === 0) {
    markOk('gemini skills command available')
  } else {
    markWarning('gemini installed but skills subcommand unavailable')
  }
} else {
  markWarning('gemini: not installed')
}

const skillValidation = runCommand(process.execPath, ['./scripts/validate-skill.mjs', './.agents/skills/realsee-pano-to-vr'], {
  cwd: rootDir,
  check: false,
})

if (skillValidation.status === 0) {
  markOk('skill validation passed')
} else {
  markFailure('skill validation failed')
}

printStatus('INFO', `warnings=${warnings} failures=${failures}`)

if (failures > 0) {
  process.exit(1)
}
