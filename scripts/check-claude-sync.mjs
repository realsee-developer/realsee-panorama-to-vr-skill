#!/usr/bin/env node
import { join } from 'node:path'
import { compareDirectoryTrees } from './lib/compare-directory-trees.mjs'
import { getRepoRoot } from './lib/node-cli.mjs'

const rootDir = getRepoRoot(import.meta.url)
const canonicalSkillDir = join(rootDir, '.agents/skills/realsee-panorama-to-vr-skill')
const pluginSkillDir = join(rootDir, '.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill')

await compareDirectoryTrees(canonicalSkillDir, pluginSkillDir, {
  leftName: 'canonical skill',
  rightName: 'Claude plugin skill copy',
})
