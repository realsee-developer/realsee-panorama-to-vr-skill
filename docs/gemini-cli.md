# Gemini CLI Integration

Use this guide when you want Gemini CLI to consume the canonical skill directly from the repository.

This file works in two modes:

1. Share the GitHub URL to Gemini and ask it to follow the guide on your machine.
2. Run the commands yourself from a shell.

Prefer a release-tagged GitHub URL for reproducible installs. Use `main` only for development.

## What Gemini Uses

The most portable Gemini path is the repository-local canonical skill:

- `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`

Some Gemini builds also expose a `gemini skills` command for explicit linking, but repository-local usage is the safest default.

## Share This File With Gemini

Recommended handoff prompt:

```text
Open this GitHub guide and set up the realsee-panorama-to-vr-skill repository for Gemini on my machine.
Use a release tag unless I explicitly ask for main.
Clone the repository, install dependencies, point Gemini at the canonical SKILL.md,
and report the final path plus any missing credentials.
```

## Manual Install

### Stable release install

```bash
VERSION=v1.0.3
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

### Development install from `main`

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

If you want runtime dependencies inside the skill directory itself:

```bash
npm install --prefix ./.agents/skills/realsee-panorama-to-vr-skill
```

## Recommended Runtime Flow

1. Start `gemini` inside the cloned repository.
2. Point Gemini at `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`.
3. Ask Gemini to follow the skill instructions for upload, polling, or resume mode.

If your Gemini build supports explicit linking:

```bash
gemini skills link ./.agents/skills/realsee-panorama-to-vr-skill
```

Do not keep both the repository-local copy and a same-name global skill link enabled at the same time.

## Verify The Install

```bash
node ./scripts/validate-skill.mjs
ls -la ./.agents/skills/realsee-panorama-to-vr-skill
```

Optional broader environment check:

```bash
npm run doctor:local
```

## First Prompts To Try

- `Use realsee-panorama-to-vr-skill on ./examples/manifest-input and return task_code and vr_url.`
- `Use realsee-panorama-to-vr-skill on /data/panos and generate the manifest automatically.`
- `Use realsee-panorama-to-vr-skill to resume polling task_code abc123 in ./workspace.`

## Credentials

Gemini CLI uses:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

You can provide them via shell environment or a local `.env` file if you run the bundled Node runtime from the repository root.

If you do not have credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- If the account region is unknown, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app.

After account setup, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama%20Image%20to%20VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `全景图生成 VR` API capability. Include your account region, `UserID`, and `IdentityID`.

For shell-level background polling after a task is already submitted:

```bash
npm run poll:bg -- --workspace ./workspace --task-code abc123
npm run poll:status -- --workspace ./workspace --task-code abc123
```

Optional direct-runtime polling controls:

- `--poll-interval-ms <ms>`
- `--poll-max-attempts <count>`

Unknown flags and unexpected positional arguments are rejected immediately.

## Release Policy

- `main` is the integration branch.
- Stable Gemini setups should use a GitHub Release tag such as `v1.0.3`.
