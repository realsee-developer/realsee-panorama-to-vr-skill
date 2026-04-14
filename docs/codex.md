# Codex Integration

## Install

Clone this repository, install dependencies, then link the canonical skill into your Codex skills directory:

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run install:codex-skill
```

If you prefer to install dependencies inside the skill itself instead of at the repository root:

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

- `REALSEE_REGION=cn`: register at `my.realsee.cn` or use `https://h5.realsee.com/vrapplink`
- `REALSEE_REGION=global`: register at `my.realsee.ai` or use `https://h5.realsee.com/vrapplink`
- Unknown region: use the unified link first, then confirm whether the account should be `cn` or `global`

After that, email `developer@realsee.com` to request the official `全景图生成VR` API capability. Include your account region, `UserID`, and `IdentityID`.

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
