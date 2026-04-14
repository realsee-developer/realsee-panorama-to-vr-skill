# Gemini CLI Integration

This guide is designed to work in two ways:

1. Share the GitHub URL of this file with Gemini and ask it to follow the guide on your machine.
2. Run the commands yourself from a shell.

Prefer a release-tagged GitHub URL for reproducible installs. Use the `main` branch URL only for development.

## Share This File With Gemini

Recommended handoff prompt:

```text
Open this GitHub guide and set up the Panorama-to-VR repository for Gemini on my machine.
Use a release tag unless I explicitly ask for main.
Clone the repository, install dependencies, and use the canonical SKILL.md from the repo.
If this Gemini build supports a skills manager, wire that up too. Report the final path and any missing credentials.
```

The canonical skill lives at:

- `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`

## Manual Install

Stable production install:

```bash
VERSION=v1.0.1
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

Default-branch development install:

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

If you want runtime dependencies inside the skill directory itself:

```bash
npm install --prefix ./.agents/skills/realsee-panorama-to-vr-skill
```

The most portable Gemini flow is repository-local usage:

1. Start `gemini` inside the cloned repository.
2. Point Gemini at `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`.
3. Ask it to follow the skill instructions for upload, polling, or resume mode.

If your local Gemini build exposes a `skills` subcommand, you can also link the skill explicitly:

```bash
gemini skills link ./.agents/skills/realsee-panorama-to-vr-skill
```

Do not keep both the repository-local copy and a same-name global skill link enabled at the same time.

## Verify The Install

Validate the canonical skill files:

```bash
node ./scripts/validate-skill.mjs
ls -la ./.agents/skills/realsee-panorama-to-vr-skill
```

Then test with a prompt such as:

- `Use realsee-panorama-to-vr-skill on ./examples/manifest-input.`
- `Use realsee-panorama-to-vr-skill on /data/panos and generate the manifest automatically.`
- `Use realsee-panorama-to-vr-skill to resume polling task_code abc123 in ./workspace.`

## Credentials

Gemini CLI uses:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

You can also keep them in a local `.env` file if you run the bundled Node runtime from the repository root.

If you do not have credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- If the account region is still unknown, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app. Confirm the account region through your Realsee account owner or Realsee support first.

After that, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `Panorama-to-VR` API capability. Include your account region, `UserID`, and `IdentityID`.

For shell-level background polling after a task is already submitted:

```bash
npm run poll:bg -- --workspace ./workspace --task-code abc123
npm run poll:status -- --workspace ./workspace --task-code abc123
```

## Release Policy

- `main` is the integration branch.
- Stable Gemini setups use a GitHub Release tag such as `v1.0.1`.
