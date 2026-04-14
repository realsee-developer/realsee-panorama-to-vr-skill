# Codex Integration

## Install

Stable production install:

```bash
VERSION=v1.0.0
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

Skill-local dependency install:

```bash
npm install --prefix ./.agents/skills/realsee-panorama-to-vr-skill
```

The script links:

- source: `.agents/skills/realsee-panorama-to-vr-skill`
- target: `${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill`

## Credentials

Codex can use:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

Provide them through your shell environment or a local `.env` file in the repository root.

If you do not have credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github) or use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github) or use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- Unknown region: use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github) first, then confirm whether the account is `cn` or `global`

After that, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `Panorama-to-VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Typical prompts

- `Use $realsee-panorama-to-vr-skill to turn ./examples/manifest-input into a VR space.`
- `Use $realsee-panorama-to-vr-skill to process /data/panos with automatic manifest generation.`
- `Use $realsee-panorama-to-vr-skill to resume polling task_code abc123 in ./workspace.`

## Direct runtime examples

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

## Release policy

- `main` is the integration branch.
- Stable Codex installations use a GitHub Release tag such as `v1.0.0`.
