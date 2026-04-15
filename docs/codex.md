# Codex Integration

Use this guide when you want Codex to discover the skill locally through `$CODEX_HOME/skills`.

This file works in two modes:

1. Share the GitHub URL to Codex and ask it to follow the guide on your machine.
2. Run the commands yourself in a shell.

Prefer a release-tagged GitHub URL for reproducible installs. Use `main` only for development.

## What Codex Installs

Codex discovers the canonical skill through a symlink:

- source: `.agents/skills/realsee-panorama-to-vr-skill`
- target: `${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill`

## Share This File With Codex

Recommended handoff prompt:

```text
Open this GitHub guide and install the realsee-panorama-to-vr-skill skill into my local Codex setup.
Use a release tag unless I explicitly ask for main.
Run the documented install steps, verify the final path under $CODEX_HOME or ~/.codex,
and report any missing credentials.
```

## Manual Install

### Stable release install

```bash
VERSION=v1.0.2
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run install:codex-skill
```

### Development install from `main`

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run install:codex-skill
```

If you want runtime dependencies inside the skill directory itself:

```bash
npm install --prefix ./.agents/skills/realsee-panorama-to-vr-skill
```

## Verify The Install

```bash
ls -la "${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill"
node ./scripts/validate-skill.mjs
```

Optional full environment check:

```bash
npm run doctor:local
```

## First Prompts To Try

- `Use $realsee-panorama-to-vr-skill on ./examples/manifest-input and return task_code and vr_url.`
- `Use $realsee-panorama-to-vr-skill on /data/panos and generate the manifest automatically.`
- `Use $realsee-panorama-to-vr-skill to resume polling task_code abc123 in ./workspace.`

## Credentials

Codex can read:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

Provide them through your shell environment or a local `.env` file in the repository root.

If you do not have credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- If the account region is unknown, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app.

After account setup, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama%20Image%20to%20VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `全景图生成 VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Direct Runtime Example

```bash
node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

For long-running tasks you do not want to keep in the foreground:

```bash
npm run poll:bg -- --workspace ./workspace --task-code your_task_code
```

## Release Policy

- `main` is the integration branch.
- Stable Codex installs should use a GitHub Release tag such as `v1.0.2`.
