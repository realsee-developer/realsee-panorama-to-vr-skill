#!/usr/bin/env node
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { unzipSync } from 'fflate'
import { getAccessToken } from '../.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/api.mjs'
import { createUploadZip } from '../.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/archive.mjs'
import { assertValidArgs, parseArgs } from '../.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/args.mjs'
import { prepareInput } from '../.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/input.mjs'
import { compareDirectoryTrees } from '../scripts/lib/compare-directory-trees.mjs'

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
  const archiveEntries = unzipSync(new Uint8Array(await readFile(join(workspaceDir, 'upload.zip'))))

  assert.equal(prepared.inputMode, 'manifest', 'example input mode should be manifest')
  assert.equal(prepared.manifest.scan_list.length, 5, 'example manifest should contain 5 scans')
  assert.equal(state.scan_count, 5, 'state scan_count should be 5')
  assert.equal(state.zip_size_bytes, (await readFile(join(workspaceDir, 'upload.zip'))).byteLength, 'state zip_size_bytes should match archive size')
  assert.ok(archiveEntries['manifest.json'], 'archive should include manifest.json')
  for (const item of prepared.manifest.scan_list) {
    assert.ok(archiveEntries[`images/${item.id}.jpg`], `archive should include images/${item.id}.jpg`)
  }
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

function runMissingPollValueValidationSmoke() {
  assert.throws(
    () => assertValidArgs(parseArgs(['--images-dir', exampleImages, '--poll-interval-ms'])),
    /`--poll-interval-ms` requires a value\./,
    'missing --poll-interval-ms value should be rejected',
  )

  assert.throws(
    () => assertValidArgs(parseArgs(['--images-dir', exampleImages, '--poll-max-attempts'])),
    /`--poll-max-attempts` requires a value\./,
    'missing --poll-max-attempts value should be rejected',
  )

  assert.throws(
    () => assertValidArgs(parseArgs(['--images-dir', exampleImages, '--workspce', '/tmp/typo'])),
    /Unknown argument: --workspce/,
    'unknown long flags should be rejected',
  )

  assert.throws(
    () => assertValidArgs(parseArgs(['--images-dir', exampleImages, 'extra-positional'])),
    /Unexpected positional argument: extra-positional/,
    'unexpected positional arguments should be rejected',
  )
}

async function runCompareDirectoryTreesSmoke(tempRoot) {
  const leftDir = join(tempRoot, 'compare-left')
  const rightDir = join(tempRoot, 'compare-right')
  await mkdir(join(leftDir, 'nested'), { recursive: true })
  await mkdir(join(rightDir, 'nested'), { recursive: true })

  await writeFile(join(leftDir, 'same.txt'), 'same\n', 'utf-8')
  await writeFile(join(rightDir, 'same.txt'), 'same\n', 'utf-8')
  await writeFile(join(leftDir, 'nested', 'file.txt'), 'nested\n', 'utf-8')
  await writeFile(join(rightDir, 'nested', 'file.txt'), 'nested\n', 'utf-8')

  await compareDirectoryTrees(leftDir, rightDir)

  await writeFile(join(rightDir, 'nested', 'file.txt'), 'drift\n', 'utf-8')
  await assert.rejects(
    () => compareDirectoryTrees(leftDir, rightDir),
    /differs for nested\/file.txt/,
    'directory compare should reject content drift',
  )

  await writeFile(join(rightDir, 'nested', 'file.txt'), 'nested\n', 'utf-8')
  await writeFile(join(rightDir, 'extra.txt'), 'extra\n', 'utf-8')
  await assert.rejects(
    () => compareDirectoryTrees(leftDir, rightDir),
    /file list differs/,
    'directory compare should reject file list drift',
  )
}

async function runLargeArchiveSmoke(tempRoot) {
  const workspaceDir = join(tempRoot, 'large-archive')
  const imagesDir = join(tempRoot, 'large-images')
  await mkdir(imagesDir, { recursive: true })

  const scanList = []
  for (let index = 0; index < 4; index += 1) {
    const id = `IMG_SYNTH_${index}`
    scanList.push({ id, floor: 0 })
    await writeFile(join(imagesDir, `${id}.jpg`), Buffer.alloc(512 * 1024, index), 'binary')
  }

  const manifest = {
    version: '1.0',
    project_name: 'synthetic-large-archive',
    floor_map: { '0': 0 },
    scan_list: scanList,
  }

  await mkdir(join(workspaceDir, 'images'), { recursive: true })
  for (const item of scanList) {
    await writeFile(
      join(workspaceDir, 'images', `${item.id}.jpg`),
      await readFile(join(imagesDir, `${item.id}.jpg`)),
    )
  }

  await createUploadZip(workspaceDir, manifest)

  const archiveEntries = unzipSync(new Uint8Array(await readFile(join(workspaceDir, 'upload.zip'))))
  assert.ok(archiveEntries['manifest.json'], 'synthetic archive should include manifest.json')
  assert.equal(Object.keys(archiveEntries).filter((key) => key.startsWith('images/')).length, scanList.length, 'synthetic archive should include every image')

  const archiveSource = await readFile(resolve(rootDir, '.agents/skills/realsee-panorama-to-vr-skill/scripts/lib/archive.mjs'), 'utf-8')
  assert.match(archiveSource, /\bnew Zip\b/, 'archive implementation should use fflate Zip streaming API')
  assert.match(archiveSource, /\bcreateReadStream\b/, 'archive implementation should stream image reads from disk')
}

async function runIssueTemplateSmoke() {
  const configText = await readFile(resolve(rootDir, '.github/ISSUE_TEMPLATE/config.yml'), 'utf-8')
  assert.doesNotMatch(configText, /h5\.realsee\.com\/vrapplink/, 'issue template should not link to the app download page')
  assert.match(configText, /mailto:developer@realsee\.com/, 'issue template should point to the capability request email')
}

async function runHttpErrorRedactionSmoke(tempRoot) {
  const originalFetch = globalThis.fetch

  globalThis.fetch = async () => new Response(JSON.stringify({
    code: -1,
    status: 'illegal app',
    access_token: 'secret-access-token',
    request_id: 'request-123',
  }), {
    status: 401,
    statusText: 'Unauthorized',
    headers: { 'Content-Type': 'application/json' },
  })

  try {
    await assert.rejects(
      () => getAccessToken({
        baseUrl: 'https://example.invalid',
        appKey: 'dummy-app-key',
        appSecret: 'dummy-app-secret',
      }, join(tempRoot, 'redaction-smoke')),
      (error) => {
        assert.match(error.message, /HTTP 401 Unauthorized/)
        assert.match(error.message, /request-123/)
        assert.doesNotMatch(error.message, /secret-access-token/)
        return true
      },
      'HTTP error messages must not leak sensitive fields',
    )
  } finally {
    globalThis.fetch = originalFetch
  }
}

const tempRoot = await mkdtemp(join(tmpdir(), 'realsee-panorama-to-vr-skill-'))

try {
  runMissingPollValueValidationSmoke()
  await runPublicExampleSmoke(tempRoot)
  await runCompareDirectoryTreesSmoke(tempRoot)
  await runLargeArchiveSmoke(tempRoot)
  await runIssueTemplateSmoke()
  await runHttpErrorRedactionSmoke(tempRoot)
  await runDefaultWorkspaceFailureSmoke(tempRoot)
  await runCreatedRunFailureSmoke(tempRoot)
  await runResumeFailureSmoke(tempRoot)
  process.stdout.write('CI smoke checks passed.\n')
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}
