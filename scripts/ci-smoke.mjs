#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, realpath, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createUploadZip } from '../.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/archive.mjs'
import { prepareInput } from '../.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/input.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runtimeEntry = resolve(rootDir, '.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs')
const exampleManifest = resolve(rootDir, 'examples/manifest-input/manifest.json')
const exampleImages = resolve(rootDir, 'examples/manifest-input/images')

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf-8'))
}

function runRuntime(args, { cwd, env }) {
  const result = spawnSync(process.execPath, [runtimeEntry, ...args], {
    cwd,
    env: { ...process.env, ...env },
    encoding: 'utf-8',
  })

  if (result.status === 0) {
    throw new Error(`Expected runtime failure but command succeeded: ${args.join(' ')}`)
  }

  return result
}

async function listMatchingDirectories(parentDir, predicate) {
  const entries = await readdir(parentDir, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory() && predicate(entry.name))
    .map((entry) => join(parentDir, entry.name))
    .sort()
}

async function assertFailureArtifacts(workspaceDir, expectedTaskCode = null) {
  const state = await readJson(join(workspaceDir, 'state.json'))
  const result = await readJson(join(workspaceDir, 'result.json'))
  const expectedWorkspaceDir = await realpath(workspaceDir)
  const stateWorkspaceDir = await realpath(state.workspace_dir)
  const resultWorkspaceDir = await realpath(result.workspace_dir)

  assert.equal(stateWorkspaceDir, expectedWorkspaceDir, 'state.json workspace_dir mismatch')
  assert.equal(resultWorkspaceDir, expectedWorkspaceDir, 'result.json workspace_dir mismatch')
  assert.equal(state.last_poll_status, 'error', 'state.json last_poll_status mismatch')
  assert.equal(result.status, 'error', 'result.json status mismatch')
  assert.equal(state.task_code ?? null, expectedTaskCode, 'state.json task_code mismatch')
  assert.equal(result.task_code ?? null, expectedTaskCode, 'result.json task_code mismatch')
}

async function runPublicExampleSmoke(tempRoot) {
  const workspaceDir = join(tempRoot, 'public-example')
  const prepared = await prepareInput({
    manifestPath: exampleManifest,
    imagesDir: exampleImages,
    workspaceDir,
  })

  // This mirrors the local packaging path without needing live credentials or network access.
  await createUploadZip(workspaceDir, prepared.manifest)
  const state = await readJson(join(workspaceDir, 'state.json'))

  assert.equal(prepared.inputMode, 'manifest', 'example input mode should be manifest')
  assert.equal(prepared.manifest.scan_list.length, 5, 'example manifest should contain 5 scans')
  assert.equal(state.scan_count, 5, 'state scan_count should be 5')
}

async function runDefaultWorkspaceFailureSmoke(tempRoot) {
  // This path intentionally omits --workspace so the runtime falls back to ./workspace under cwd.
  const cwd = tempRoot
  runRuntime(['--images-dir', exampleImages, '--json'], {
    cwd,
    env: {
      REALSEE_APP_KEY: 'dummy-app-key',
      REALSEE_APP_SECRET: 'dummy-app-secret',
      REALSEE_REGION: 'invalid',
    },
  })

  const workspaceRoot = join(cwd, 'workspace')
  const failedRuns = await listMatchingDirectories(workspaceRoot, (name) => name.startsWith('run-failed-'))
  assert.equal(failedRuns.length, 1, 'default workspace failure should create one run-failed-* directory')
  await assertFailureArtifacts(failedRuns[0], null)
}

async function runCreatedRunFailureSmoke(tempRoot) {
  const workspaceRoot = join(tempRoot, 'created-run-failure')
  // A missing image directory fails after the temporary run directory already exists.
  runRuntime(['--workspace', workspaceRoot, '--images-dir', join(tempRoot, 'missing-images'), '--json'], {
    cwd: tempRoot,
    env: {
      REALSEE_APP_KEY: 'dummy-app-key',
      REALSEE_APP_SECRET: 'dummy-app-secret',
      REALSEE_REGION: 'global',
    },
  })

  const runDirs = await listMatchingDirectories(workspaceRoot, (name) => name.startsWith('run-') && !name.startsWith('run-failed-'))
  const failedRuns = await listMatchingDirectories(workspaceRoot, (name) => name.startsWith('run-failed-'))
  assert.equal(runDirs.length, 1, 'pre-submit failure should reuse the existing run-* directory')
  assert.equal(failedRuns.length, 0, 'pre-submit failure should not create run-failed-*')
  await assertFailureArtifacts(runDirs[0], null)
}

async function runResumeFailureSmoke(tempRoot) {
  const workspaceRoot = join(tempRoot, 'resume-failure')
  // Resume mode should write artifacts directly into <workspace>/<task_code>.
  runRuntime(['--workspace', workspaceRoot, '--task-code', 'abc123', '--json'], {
    cwd: tempRoot,
    env: {
      REALSEE_APP_KEY: 'dummy-app-key',
      REALSEE_APP_SECRET: 'dummy-app-secret',
      REALSEE_REGION: 'invalid',
    },
  })

  await assertFailureArtifacts(join(workspaceRoot, 'abc123'), 'abc123')
}

const tempRoot = await mkdtemp(join(tmpdir(), 'realsee-panorama-to-vr-skill-'))

try {
  await runPublicExampleSmoke(tempRoot)
  await runDefaultWorkspaceFailureSmoke(tempRoot)
  await runCreatedRunFailureSmoke(tempRoot)
  await runResumeFailureSmoke(tempRoot)
  process.stdout.write('CI smoke checks passed.\n')
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}
