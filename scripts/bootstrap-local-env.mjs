#!/usr/bin/env node
import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getRepoRoot, logStep, pathExists, runCommand } from './lib/node-cli.mjs'

const rootDir = getRepoRoot(import.meta.url)
const envFile = join(rootDir, '.env')
const envExampleFile = join(rootDir, '.env.example')

logStep('bootstrap', `repo root: ${rootDir}`)
logStep('bootstrap', `node: ${process.version}`)
logStep('bootstrap', `npm: ${runCommand('npm', ['--version']).stdout.trim()}`)

logStep('bootstrap', 'Installing root dependencies')
runCommand('npm', ['install'], { cwd: rootDir, stdio: 'inherit' })

if (!(await pathExists(envFile))) {
  await copyFile(envExampleFile, envFile)
  logStep('bootstrap', 'Created .env from .env.example')
} else {
  logStep('bootstrap', '.env already exists')
}

logStep('bootstrap', 'Syncing Claude plugin skill copy')
runCommand('npm', ['run', 'sync:claude-plugin'], { cwd: rootDir, stdio: 'inherit' })

logStep('bootstrap', 'Validating canonical skill')
runCommand('npm', ['run', 'validate:skill'], { cwd: rootDir, stdio: 'inherit' })

logStep('bootstrap', 'Local environment prepared')
logStep('bootstrap', 'Next steps:')
process.stdout.write('  1. Fill REALSEE_APP_KEY / REALSEE_APP_SECRET in .env\n')
process.stdout.write('  2. Run: npm run doctor:local\n')
process.stdout.write('  3. Run: npm run run -- --manifest ./examples/manifest-input/manifest.json --images-dir ./examples/manifest-input/images --workspace ./workspace --json\n')
