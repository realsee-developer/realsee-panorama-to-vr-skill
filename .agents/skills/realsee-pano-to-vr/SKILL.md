---
name: realsee-pano-to-vr
description: Turn a local panorama set into a Realsee VR space through the Realsee Open Platform workflow. Use when the user wants to submit equirectangular panorama images, validate or generate a manifest, upload a ZIP package, poll the Realsee task, resume polling with a known task_code, or retrieve the final VR URL from local files.
---

# 全景图生成VR

Official capability names: `全景图生成VR` / `Panorama-to-VR`

Developer-facing skill id: `realsee-pano-to-vr`

Use this skill to run the bundled Realsee panorama-to-VR workflow from local files.

## Core behavior

1. Confirm the user wants to upload local panorama data to Realsee.
2. Check credentials before running:
   - `REALSEE_APP_KEY`
   - `REALSEE_APP_SECRET`
   - `REALSEE_REGION=global|cn`
   - If `REALSEE_APP_KEY` or `REALSEE_APP_SECRET` is missing, guide by region: `REALSEE_REGION=cn` -> `my.realsee.cn`; `REALSEE_REGION=global` -> `my.realsee.ai`; if region is not known yet, give both plus `https://h5.realsee.com/vrapplink`
   - Tell the user to email `developer@realsee.com` to request the panorama-to-VR API capability with their account region, `UserID`, and `IdentityID`
3. Check runtime dependencies:
   - The skill ships its own `package.json`
   - Install dependencies in the skill root or repository root before first use
   - If the repo was cloned normally, `npm install` at the repository root is enough
3. Detect the input mode:
   - `--images-dir <dir>` only: generate a manifest automatically
   - `--manifest <path> --images-dir <dir>`: validate the provided manifest against local images
4. Resolve the installed skill root first. Use the directory that contains this `SKILL.md`, not the caller's current working directory.
5. Run the bundled Node entrypoint from that installed skill path:

```bash
node /absolute/path/to/realsee-pano-to-vr/scripts/run-pano-to-vr.mjs ...
```

6. Read `result.json` from the emitted `workspace_dir`.
7. Return the most important fields:
   - `task_code`
   - `project_id`
   - `vr_url`
   - `workspace_dir`

## Invocation patterns

- Manifest mode:

```bash
node /absolute/path/to/realsee-pano-to-vr/scripts/run-pano-to-vr.mjs \
  --manifest /abs/path/to/manifest.json \
  --images-dir /abs/path/to/images \
  --workspace ./workspace \
  --json
```

- Image-only mode:

```bash
node /absolute/path/to/realsee-pano-to-vr/scripts/run-pano-to-vr.mjs \
  --images-dir /abs/path/to/panos \
  --workspace ./workspace \
  --json
```

- Resume polling:

```bash
node /absolute/path/to/realsee-pano-to-vr/scripts/run-pano-to-vr.mjs \
  --workspace ./workspace \
  --task-code abc123 \
  --json
```

## References

- Input formats and modes: `references/input-modes.md`
- Realsee API workflow details: `references/api-workflow.md`
- Host differences for Codex, Claude, and Gemini: `references/host-differences.md`
- Common failures and recovery: `references/troubleshooting.md`

## Rules

- Do not ask the user to paste secrets into chat when environment or plugin configuration can provide them.
- Treat this workflow as side-effectful because it uploads images and creates a remote task.
- Never assume the caller is in the repository root. Resolve the runtime path from the installed skill directory.
- Prefer `--json` so the final structured output can be parsed reliably.
- If the user provides `task_code`, skip packaging and upload, then resume polling from the workspace root they gave.
