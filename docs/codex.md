# Codex Integration

This guide is designed to work in two ways:

1. Share the GitHub URL of this file with Codex and ask it to follow the guide on your machine.
2. Run the commands yourself from a shell.

Prefer a release-tagged GitHub URL for reproducible installs. Use the `main` branch URL only for development.

## Share This File With Codex

Recommended handoff prompt:

```text
Open this GitHub guide and install the Panorama-to-VR skill into my local Codex setup.
Use a release tag unless I explicitly ask for main.
Run the documented install steps, verify the skill link under $CODEX_HOME or ~/.codex,
and report the installed path plus any missing credentials.
```

After installation, Codex should be able to use the canonical skill at:

- `.agents/skills/realsee-panorama-to-vr-skill`
- `${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill`

## Manual Install

Stable production install:

```bash
VERSION=v1.0.1
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run install:codex-skill
```

Default-branch development install:

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run install:codex-skill
```

If you want to install runtime dependencies inside the skill directory itself:

```bash
npm install --prefix ./.agents/skills/realsee-panorama-to-vr-skill
```

The install script creates this link:

- source: `.agents/skills/realsee-panorama-to-vr-skill`
- target: `${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill`

## Verify The Install

Confirm the skill files exist:

```bash
ls -la "${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill"
node ./scripts/validate-skill.mjs
```

Then ask Codex to use the skill:

- `Use $realsee-panorama-to-vr-skill to turn ./examples/manifest-input into a VR space.`
- `Use $realsee-panorama-to-vr-skill to process /data/panos with automatic manifest generation.`
- `Use $realsee-panorama-to-vr-skill to resume polling task_code abc123 in ./workspace.`

## Credentials

Codex can use:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

Provide them through your shell environment or a local `.env` file in the repository root.

If you do not have credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- If the account region is still unknown, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app. Confirm the account region through your Realsee account owner or Realsee support first.

After that, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `Panorama-to-VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Direct Runtime Examples

```bash
node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

For a long-running task that you do not want to keep in the foreground:

```bash
npm run poll:bg -- \
  --workspace ./workspace \
  --task-code your_task_code
```

## Release Policy

- `main` is the integration branch.
- Stable Codex installations use a GitHub Release tag such as `v1.0.1`.
