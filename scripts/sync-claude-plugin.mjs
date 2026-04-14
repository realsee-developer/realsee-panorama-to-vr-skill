import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = resolve(rootDir, '.agents/skills/realsee-panorama-to-vr-skill')
const targetDir = resolve(rootDir, '.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill')

await mkdir(resolve(targetDir, '..'), { recursive: true })
await rm(targetDir, { recursive: true, force: true })
await cp(sourceDir, targetDir, { recursive: true, force: true })

console.log(`Synced Claude plugin skill from ${sourceDir} to ${targetDir}`)
