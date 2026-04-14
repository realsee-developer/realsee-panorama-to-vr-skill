export function parseArgs(argv) {
  const args = {}

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) {
      continue
    }

    const stripped = token.slice(2)
    if (stripped.includes('=')) {
      const [key, ...rest] = stripped.split('=')
      args[key] = rest.join('=')
      continue
    }

    const next = argv[i + 1]
    if (!next || next.startsWith('--')) {
      args[stripped] = true
      continue
    }

    args[stripped] = next
    i += 1
  }

  return args
}

function assertPositiveIntegerFlag(args, flag) {
  if (args[flag] === undefined) {
    return
  }
  if (args[flag] === true) {
    throw new Error(`\`--${flag}\` requires a value.`)
  }
  const parsed = Number(args[flag])
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`\`--${flag}\` must be a positive integer; got "${args[flag]}".`)
  }
}

export function assertValidArgs(args) {
  if (args.help) {
    return
  }

  assertPositiveIntegerFlag(args, 'poll-interval-ms')
  assertPositiveIntegerFlag(args, 'poll-max-attempts')

  if (args['task-code']) {
    if (!args.workspace) {
      throw new Error('`--task-code` requires `--workspace <workspace-root>`.')
    }
    if (args['images-dir'] || args.manifest) {
      throw new Error('`--task-code` cannot be combined with `--images-dir` or `--manifest`.')
    }
    return
  }

  if (!args['images-dir']) {
    throw new Error('Provide `--images-dir <dir>` for a new run.')
  }
}

export function usage() {
  return `
Usage:
  node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs [options]

New run:
  --images-dir <dir>           Panorama input directory
  --manifest <path>            Optional manifest.json path
  --workspace <dir>            Workspace root (default: ./workspace)
  --project-name <name>        Optional project name override
  --json                       Emit final result JSON to stdout

Resume an existing task:
  --workspace <dir>            Existing workspace root
  --task-code <code>           Existing Realsee task code
  --json                       Emit final result JSON to stdout

Examples:
  node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \\
    --manifest ./examples/manifest-input/manifest.json \\
    --images-dir ./examples/manifest-input/images \\
    --workspace ./workspace \\
    --json

  node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \\
    --images-dir /absolute/path/to/panos \\
    --workspace ./workspace \\
    --json

  node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \\
    --workspace ./workspace \\
    --task-code abc123 \\
    --json
`.trim()
}
