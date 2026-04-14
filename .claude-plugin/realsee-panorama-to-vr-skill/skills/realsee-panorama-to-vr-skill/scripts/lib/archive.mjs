import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { zip } from 'fflate'
import { getWorkspacePaths, writeState } from './state.mjs'

export async function createUploadZip(workspaceDir, manifest) {
  const { imagesDir, zipPath } = getWorkspacePaths(workspaceDir)
  const fileEntries = {
    'manifest.json': new TextEncoder().encode(JSON.stringify(manifest, null, 2)),
  }

  for (const item of manifest.scan_list) {
    fileEntries[`images/${item.id}.jpg`] = new Uint8Array(
      await readFile(join(imagesDir, `${item.id}.jpg`))
    )
  }

  const zipped = await new Promise((resolve, reject) => {
    zip(fileEntries, (error, data) => {
      if (error) {
        reject(error)
        return
      }
      resolve(data)
    })
  })

  await writeFile(zipPath, zipped)
  await writeState(workspaceDir, {
    zip_path: zipPath,
    zip_size_bytes: zipped.byteLength,
  })

  return zipPath
}
