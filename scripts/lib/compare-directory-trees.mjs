import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

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

function describeFileListMismatch(leftFiles, rightFiles, { leftName, rightName }) {
  const leftOnly = leftFiles.filter((file) => !rightFiles.includes(file))
  const rightOnly = rightFiles.filter((file) => !leftFiles.includes(file))
  const lines = [`Directory tree file list differs between ${leftName} and ${rightName}`]

  if (leftOnly.length > 0) {
    lines.push(`Missing in ${rightName}: ${leftOnly.join(', ')}`)
  }
  if (rightOnly.length > 0) {
    lines.push(`Unexpected in ${rightName}: ${rightOnly.join(', ')}`)
  }

  return lines.join('\n')
}

export async function compareDirectoryTrees(leftDir, rightDir, {
  leftName = 'left directory',
  rightName = 'right directory',
} = {}) {
  const leftFiles = (await listFiles(leftDir)).map((file) => relative(leftDir, file))
  const rightFiles = (await listFiles(rightDir)).map((file) => relative(rightDir, file))

  if (JSON.stringify(leftFiles) !== JSON.stringify(rightFiles)) {
    throw new Error(describeFileListMismatch(leftFiles, rightFiles, { leftName, rightName }))
  }

  for (const relativePath of leftFiles) {
    const [leftContents, rightContents] = await Promise.all([
      readFile(join(leftDir, relativePath)),
      readFile(join(rightDir, relativePath)),
    ])

    if (!leftContents.equals(rightContents)) {
      throw new Error(`Directory tree content differs for ${relativePath} between ${leftName} and ${rightName}`)
    }
  }
}
