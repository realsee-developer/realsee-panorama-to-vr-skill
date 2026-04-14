#!/usr/bin/env node
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { getRepoRoot, runCommand } from './lib/node-cli.mjs'

const rootDir = getRepoRoot(import.meta.url)
const canonicalSkillDir = join(rootDir, '.agents/skills/realsee-pano-to-vr')
const pluginSkillDir = join(rootDir, '.claude-plugin/realsee-vr-skillkit/skills/realsee-pano-to-vr')

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      return listFiles(entryPath)
    }
    return [entryPath]
  }))
  return files.flat().sort()
}

runCommand('npm', ['run', 'sync:claude-plugin'], { cwd: rootDir, stdio: 'inherit' })

const canonicalFiles = await listFiles(canonicalSkillDir)
const pluginFiles = await listFiles(pluginSkillDir)

assert.deepEqual(
  canonicalFiles.map((file) => relative(canonicalSkillDir, file)),
  pluginFiles.map((file) => relative(pluginSkillDir, file)),
  'Claude plugin skill copy file list differs from canonical skill'
)

for (const canonicalFile of canonicalFiles) {
  const relativePath = relative(canonicalSkillDir, canonicalFile)
  const pluginFile = join(pluginSkillDir, relativePath)
  const [canonicalContents, pluginContents] = await Promise.all([
    readFile(canonicalFile),
    readFile(pluginFile),
  ])
  assert.equal(
    canonicalContents.equals(pluginContents),
    true,
    `Claude plugin skill copy differs for ${relativePath}`
  )
}
