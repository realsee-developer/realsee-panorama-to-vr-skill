#!/usr/bin/env node
import { mkdir, rm, symlink } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getRepoRoot, logStep } from './lib/node-cli.mjs'

const rootDir = getRepoRoot(import.meta.url)
const sourceDir = resolve(rootDir, '.agents/skills/realsee-pano-to-vr')
const codexHome = process.env.CODEX_HOME
  ? resolve(process.env.CODEX_HOME)
  : resolve(process.env.HOME ?? '.', '.codex')
const targetRoot = join(codexHome, 'skills')
const targetDir = join(targetRoot, 'realsee-pano-to-vr')

await mkdir(targetRoot, { recursive: true })
await rm(targetDir, { recursive: true, force: true })
await symlink(sourceDir, targetDir, 'dir')

logStep('install', 'Linked Codex skill')
logStep('install', `source: ${sourceDir}`)
logStep('install', `target: ${targetDir}`)
