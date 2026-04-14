#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { join, resolve } from 'node:path'

function fail(message) {
  process.stderr.write(`${message}\n`)
  process.exit(1)
}

async function assertExists(path, label) {
  try {
    await access(path, constants.F_OK)
  } catch {
    fail(`${label} not found: ${path}`)
  }
}

const skillDir = resolve(process.argv[2] ?? './.agents/skills/realsee-panorama-to-vr-skill')
const skillPath = join(skillDir, 'SKILL.md')
await assertExists(skillPath, 'SKILL.md')
await assertExists(join(skillDir, 'agents/openai.yaml'), 'agents/openai.yaml')
await assertExists(join(skillDir, 'package.json'), 'package.json')
await assertExists(join(skillDir, 'references'), 'references directory')
await assertExists(join(skillDir, 'scripts/run-panorama-to-vr.mjs'), 'scripts/run-panorama-to-vr.mjs')

const raw = await readFile(skillPath, 'utf-8')
const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n/)
if (!frontmatterMatch) {
  fail(`Frontmatter missing in ${skillPath}`)
}

const frontmatter = frontmatterMatch[1]
const nameMatch = frontmatter.match(/^name:\s*(.+)$/m)
const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m)

if (!nameMatch?.[1]?.trim()) {
  fail(`Frontmatter "name" missing in ${skillPath}`)
}

if (!descriptionMatch?.[1]?.trim()) {
  fail(`Frontmatter "description" missing in ${skillPath}`)
}

process.stdout.write('Skill is valid!\n')
