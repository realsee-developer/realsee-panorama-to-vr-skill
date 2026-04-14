#!/usr/bin/env node
import { getRepoRoot, runCommand } from './lib/node-cli.mjs'

const rootDir = getRepoRoot(import.meta.url)

runCommand(process.execPath, ['./scripts/validate-skill.mjs', './.agents/skills/realsee-pano-to-vr'], {
  cwd: rootDir,
  stdio: 'inherit',
})

runCommand(process.execPath, ['./scripts/check-claude-sync.mjs'], {
  cwd: rootDir,
  stdio: 'inherit',
})

runCommand(process.execPath, ['./scripts/ci-smoke.mjs'], {
  cwd: rootDir,
  stdio: 'inherit',
})
