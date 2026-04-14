# Claude Code Integration

This guide is designed to work in two ways:

1. Share the GitHub URL of this file with Claude Code and ask it to follow the guide on your machine.
2. Run the commands yourself from a shell.

Prefer a release-tagged GitHub URL for reproducible installs. Use the `main` branch URL only for development.

## Share This File With Claude Code

Recommended handoff prompt:

```text
Open this GitHub guide and install the Panorama-to-VR Claude plugin on my machine.
Use a release tag unless I explicitly ask for main.
Clone the repository, sync the plugin copy, launch Claude Code with --plugin-dir,
and tell me the plugin path plus any missing credentials.
```

The plugin root is:

- `.claude-plugin/realsee-panorama-to-vr-skill`

The namespaced skill is:

- `/realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill`

## Manual Install

Stable production install:

```bash
VERSION=v1.0.1
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run sync:claude-plugin
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

Default-branch development install:

```bash
git clone https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
npm run sync:claude-plugin
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

This uses Claude Code's `--plugin-dir` development flow.

Keep exactly one active `claude` installation on your machine. Do not keep both a native install and a package-manager install on the PATH at the same time, or Claude Code may report a duplicate-installation warning in `claude doctor`.

## Verify The Install

Validate the plugin and confirm the synced skill copy exists:

```bash
claude plugin validate ./.claude-plugin/realsee-panorama-to-vr-skill
ls -la ./.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill
```

Then test with a prompt such as:

- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill on ./examples/manifest-input and show the task_code and vr_url.`
- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill on /data/panos and auto-generate the manifest.`
- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill to resume task_code abc123 in ./workspace.`

## Plugin Behavior

- Plugin root: `.claude-plugin/realsee-panorama-to-vr-skill`
- Namespaced skill: `/realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill`
- Credentials come from `userConfig`
- Plugin subprocesses also receive:
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_KEY`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_SECRET`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_REGION`

The runtime resolves those values automatically when the standard `REALSEE_*` variables are not already set.

## Credentials

If you do not have Realsee credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- If the account region is still unknown, do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app. Confirm the account region through your Realsee account owner or Realsee support first.

After that, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `Panorama-to-VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Fallback For Older Claude Code Builds

If your local `claude plugin validate` build does not yet recognize `userConfig`, keep using the same plugin directory and export these variables manually before launching Claude Code:

```bash
export REALSEE_APP_KEY=...
export REALSEE_APP_SECRET=...
export REALSEE_REGION=global
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

For manual shell recovery outside Claude, the repository also includes:

```bash
npm run poll:bg -- --workspace ./workspace --task-code abc123
npm run poll:status -- --workspace ./workspace --task-code abc123
```

## Release Policy

- `main` is the integration branch.
- Stable Claude plugin installations use a GitHub Release tag such as `v1.0.1`.
