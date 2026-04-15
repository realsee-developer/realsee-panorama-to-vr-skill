# Claude Code Integration

Use this guide when you want Claude Code to load the bundled plugin directory with `--plugin-dir`.

This file works in two modes:

1. Share the GitHub URL to Claude Code and ask it to follow the guide on your machine.
2. Run the commands yourself from a shell.

Prefer a release-tagged GitHub URL for reproducible installs. Use `main` only for development.

## What Claude Code Installs

- Plugin root: `.claude-plugin/realsee-panorama-to-vr-skill`
- Namespaced skill: `/realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill`

The skill copy inside the plugin is generated from the canonical skill source under `.agents/skills/realsee-panorama-to-vr-skill/`.

## Share This File With Claude Code

Recommended handoff prompt:

```text
Open this GitHub guide and install the realsee-panorama-to-vr-skill Claude plugin on my machine.
Use a release tag unless I explicitly ask for main.
Clone the repository, sync the plugin copy, launch Claude Code with --plugin-dir,
and report the final plugin path plus any missing credentials.
```

## Manual Install

### Stable release install

```bash
VERSION=v1.0.3
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run sync:claude-plugin
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

### Development install from `main`

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run sync:claude-plugin
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

This uses Claude Code's `--plugin-dir` development flow.

Keep exactly one active `claude` installation on your machine. If both a native install and a package-manager install are on `PATH`, `claude doctor` may warn about duplicate installations.

## Verify The Install

```bash
claude plugin validate ./.claude-plugin/realsee-panorama-to-vr-skill
ls -la ./.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill
```

Optional broader environment check:

```bash
npm run doctor:local
```

## First Prompts To Try

- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill on ./examples/manifest-input and show task_code and vr_url.`
- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill on /data/panos and auto-generate the manifest.`
- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill to resume task_code abc123 in ./workspace.`

## Plugin Credential Behavior

- Credentials can be entered through `userConfig`.
- Plugin subprocesses also receive:
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_KEY`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_SECRET`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_REGION`
- The runtime falls back to those values when `REALSEE_*` is not already set in the environment.

## Credentials

If you do not have Realsee credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- If the account region is unknown, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app.

After account setup, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama%20Image%20to%20VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `全景图生成 VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Fallback For Older Claude Code Builds

If `claude plugin validate` does not recognize `userConfig`, keep using the same plugin directory and export credentials manually before launch:

```bash
export REALSEE_APP_KEY=...
export REALSEE_APP_SECRET=...
export REALSEE_REGION=global
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

For manual shell recovery outside Claude:

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
- Stable Claude plugin installs should use a GitHub Release tag such as `v1.0.3`.
