# Architecture

This repository is organized around one canonical skill that is repackaged for multiple AI hosts.

## System Overview

### Canonical skill

`./.agents/skills/realsee-panorama-to-vr-skill/` is the source of truth for:

- `SKILL.md`
- the Node.js runtime entrypoint
- AI-facing reference docs
- runtime dependencies declared in the skill-local `package.json`

### Claude plugin wrapper

`./.claude-plugin/realsee-panorama-to-vr-skill/` is a generated packaging layer for Claude Code:

- `.claude-plugin/plugin.json` defines the plugin metadata and `userConfig`
- `skills/realsee-panorama-to-vr-skill/` is copied from the canonical skill
- regenerate it with `npm run sync:claude-plugin`

### Repository-level scripts

`./scripts/` contains helper commands for local setup, validation, release preparation, and host-specific installation:

- `bootstrap-local-env.mjs`
- `doctor-local-env.mjs`
- `install-codex-skill.mjs`
- `sync-claude-plugin.mjs`
- `validate-skill.mjs`
- `ci-verify.mjs`

### Public sample data

`./examples/manifest-input/` contains publicly distributable panorama images and a sample `manifest.json`. It exists for demos, validation, and CI smoke tests. It must never contain customer data.

## Runtime Flow

The canonical runtime entrypoint is:

```bash
node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs
```

High-level flow:

1. Parse arguments and resolve runtime config.
2. Prepare input in one of two modes:
   - image-only mode
   - manifest + images mode
3. Normalize images and build the upload workspace.
4. Create `upload.zip`.
5. Authenticate with Realsee Open Platform.
6. Request upload credentials.
7. Upload the ZIP package.
8. Submit the remote processing task.
9. Poll task status until completion.
10. Write `state.json` and `result.json`.

Resume mode skips packaging and upload, then continues polling from an existing `task_code`.

## File Ownership Map

### Runtime entrypoint

- `.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs`
  Orchestrates the full workflow and failure artifact handling.

### Runtime libraries

- `scripts/lib/args.mjs`
  CLI parsing and usage help.
- `scripts/lib/config.mjs`
  Environment and runtime config resolution.
- `scripts/lib/input.mjs`
  Manifest generation, validation, and image normalization.
- `scripts/lib/archive.mjs`
  ZIP packaging.
- `scripts/lib/api.mjs`
  Access token, upload token, upload, submit, and poll calls.
- `scripts/lib/state.mjs`
  Workspace persistence for `state.json` and `result.json`.
- `scripts/lib/logger.mjs`
  Structured stderr logging.

### Host packaging

- `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`
  Canonical AI-facing instructions.
- `.agents/skills/realsee-panorama-to-vr-skill/references/*.md`
  Supporting docs used by AI hosts.
- `.agents/skills/realsee-panorama-to-vr-skill/agents/openai.yaml`
  Host-specific metadata for OpenAI-compatible agents.
- `.claude-plugin/realsee-panorama-to-vr-skill/.claude-plugin/plugin.json`
  Claude plugin manifest and credential UI metadata.

## Output Contract

Every run writes artifacts into a workspace subdirectory:

- `state.json`
- `result.json`

`result.json` must always preserve the documented contract:

- `status`
- `project_name`
- `task_code`
- `project_id`
- `vr_url`
- `workspace_dir`

If the workflow fails, the runtime still attempts to write a minimal `result.json` and `state.json` snapshot.

## Source-of-Truth Rules

- Edit the canonical skill, not the Claude plugin copy.
- Sync the Claude plugin copy after canonical skill changes.
- Update both English and Chinese root READMEs when user-facing behavior changes.
- Keep human-facing terminology aligned to `全景图生成 VR`.
- Preserve repository and skill identifiers such as `realsee-panorama-to-vr-skill`.

## Change Guide

If you need to...

- change runtime behavior: edit `.agents/skills/.../scripts/` and update docs
- change AI instructions: edit `.agents/skills/.../SKILL.md` and matching references
- change Claude plugin config: edit `.claude-plugin/.../.claude-plugin/plugin.json`
- change Codex install flow: edit `scripts/install-codex-skill.mjs` and [docs/codex.md](./docs/codex.md)
- change contributor guidance: update [CONTRIBUTING.md](./CONTRIBUTING.md), [AGENTS.md](./AGENTS.md), and root README links
