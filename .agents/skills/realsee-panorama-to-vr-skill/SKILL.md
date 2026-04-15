---
name: realsee-panorama-to-vr-skill
description: Generate a Realsee VR space from a local panorama image set through the Realsee Open Platform workflow. Use when the user wants to submit equirectangular panorama images, validate or generate a manifest, upload a ZIP package, poll the Realsee task, resume polling with a known task_code, or retrieve the final VR URL from local files.
---

# Panorama Image to VR

Skill id: `realsee-panorama-to-vr-skill`

Human-facing capability name: `全景图生成 VR`

Use this skill to run the bundled Realsee panorama-image-to-VR workflow from local files.

## Core behavior

1. Confirm the user wants to upload local panorama data to Realsee.
2. Check credentials before running:
   - `REALSEE_APP_KEY`
   - `REALSEE_APP_SECRET`
   - `REALSEE_REGION=global|cn`
   - If `REALSEE_APP_KEY` or `REALSEE_APP_SECRET` is missing, guide by region: `REALSEE_REGION=cn` -> [my.realsee.cn](https://my.realsee.cn/?utm_source=github); `REALSEE_REGION=global` -> [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
   - If the account region is not known yet, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app. Tell the user to confirm their account region with the account owner or Realsee support first.
   - Tell the user to email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama%20Image%20to%20VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `全景图生成 VR` API capability with their account region, `UserID`, and `IdentityID`
3. Check runtime dependencies:
   - The skill ships its own `package.json`
   - Install dependencies in the skill root or repository root before first use
   - If the repo was cloned normally, `npm install` at the repository root is enough
4. Detect the input mode:
   - `--images-dir <dir>` only: generate a manifest automatically
   - `--manifest <path> --images-dir <dir>`: validate the provided manifest against local images
5. Resolve the installed skill root first. Use the directory that contains this `SKILL.md`, not the caller's current working directory.
6. Run the bundled Node entrypoint from that installed skill path:

```bash
node /absolute/path/to/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs ...
```

7. Read `result.json` from the emitted `workspace_dir`.
8. Return the most important fields:
   - `task_code`
   - `project_id`
   - `vr_url`
   - `workspace_dir`
   - `status`

## Invocation patterns

- Manifest mode:

```bash
node /absolute/path/to/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \
  --manifest /abs/path/to/manifest.json \
  --images-dir /abs/path/to/images \
  --workspace ./workspace \
  --json
```

- Image-only mode:

```bash
node /absolute/path/to/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \
  --images-dir /abs/path/to/panos \
  --workspace ./workspace \
  --json
```

- Resume polling:

```bash
node /absolute/path/to/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \
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
- Keep human-facing wording aligned with `全景图生成 VR`, while preserving the repository and skill id `realsee-panorama-to-vr-skill`.
- Prefer `--json` so the final structured output can be parsed reliably.
- If the user provides `task_code`, skip packaging and upload, then resume polling from the workspace root they gave.
