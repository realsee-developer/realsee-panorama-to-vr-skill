# Panorama-to-VR SkillKit

Official capability names: `全景图生成VR` / `Panorama-to-VR`

Turn a local panorama set into a Realsee VR space through a shared Agent Skill runtime.

This repository is designed for **GitHub distribution** under a company organization, not as a standalone `realsee-cli` product. The public repository identity is `realsee-vr-skillkit`, while the canonical skill invocation name remains `realsee-pano-to-vr`.

It provides one canonical skill plus host adapters for:

- Codex
- Claude Code
- Gemini CLI

The runtime is a bundled Node.js workflow that handles manifest validation or generation, ZIP packaging, upload token retrieval, object upload, task submission, polling, and structured result output.

The repository toolchain is intentionally converged on Node.js:

- runtime entrypoints are Node.js
- maintenance scripts are Node.js
- CI validation runs on Node.js only

## Repository layout

- `.agents/skills/realsee-pano-to-vr/`
  The canonical skill source. Gemini CLI can discover it directly through the `.agents/skills` alias.
- `.claude-plugin/realsee-vr-skillkit/`
  Claude Code plugin wrapper that bundles the same skill for `--plugin-dir` usage.
- `examples/manifest-input/`
  Public indoor panoramas plus a sample `manifest.json`.
- `examples/SOURCES.md`
  Source pages and license notes for the public example dataset.
- `scripts/install-codex-skill.mjs`
  Node.js installer for Codex local skill discovery.
- `docs/capability-naming.md`
  Naming rules for the official capability name versus developer-facing identifiers.

## Prerequisites

- Node.js 20+
- npm 10+
- Realsee Open Platform credentials:
  - `REALSEE_APP_KEY`
  - `REALSEE_APP_SECRET`
  - `REALSEE_REGION=global|cn`

If you do not have `REALSEE_APP_KEY` / `REALSEE_APP_SECRET` yet, guide by region:

- `REALSEE_REGION=cn`: register at `my.realsee.cn` or use `https://h5.realsee.com/vrapplink`
- `REALSEE_REGION=global`: register at `my.realsee.ai` or use `https://h5.realsee.com/vrapplink`
- Region not decided yet: use the unified link, then confirm whether the account should be `cn` or `global`

After registration, email `developer@realsee.com` to request access to the official `全景图生成VR` API capability. Include your account region, `UserID`, and `IdentityID` in the request.

Install dependencies from the repository root:

```bash
npm install
```

The canonical skill also includes its own [`package.json`](./.agents/skills/realsee-pano-to-vr/package.json) so hosts that consume the skill directory directly can install dependencies there if needed.

Copy the environment template if you want local `.env` loading:

```bash
cp .env.example .env
```

## Quick start

Run against the included example manifest and images:

```bash
npm run run -- \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

The bundled example data is a public CC0 interior panorama set from Wikimedia Commons, not customer data. See [examples/SOURCES.md](./examples/SOURCES.md).

Run against an image directory only and let the runtime generate a manifest:

```bash
npm run run -- \
  --images-dir /absolute/path/to/panoramas \
  --workspace ./workspace \
  --json
```

Resume polling for an existing task:

```bash
npm run run -- \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

For long-running tasks, start polling in the background and inspect it later:

```bash
npm run poll:bg -- \
  --workspace ./workspace \
  --task-code your_task_code

npm run poll:status -- \
  --workspace ./workspace \
  --task-code your_task_code
```

The runtime writes one isolated working directory per task and always produces:

- `state.json`
- `result.json`

`result.json` includes `status`, `project_name`, `task_code`, `project_id`, `vr_url`, and `workspace_dir`.

## Host integration

- Codex: [docs/codex.md](./docs/codex.md)
- Claude Code: [docs/claude-plugin.md](./docs/claude-plugin.md)
- Gemini CLI: [docs/gemini-cli.md](./docs/gemini-cli.md)

The canonical skill name stays `realsee-pano-to-vr` across Codex and Gemini. Claude Code uses the plugin namespace `realsee-vr-skillkit` with the same underlying skill. See [docs/capability-naming.md](./docs/capability-naming.md) for the naming split.

## Notes

- This repository does **not** ship an MCP server.
- This repository does **not** publish a standalone CLI package.
- Claude users should prefer the bundled plugin wrapper.
- Gemini CLI users can consume the canonical skill directly from `.agents/skills`.
- For Gemini CLI, use either workspace discovery or a global `skills link/install`, but not both at the same time.
