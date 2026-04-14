# Claude Code Integration

## Development usage

Stable production install:

```bash
VERSION=v1.0.0
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

This uses Claude Code's documented `--plugin-dir` development flow.

Keep exactly one active `claude` installation on your machine. Do not keep both a native install and a package-manager install on the PATH at the same time, or Claude Code may report a duplicate-installation warning in `claude doctor`.

## Plugin behavior

- Plugin root: `.claude-plugin/realsee-panorama-to-vr-skill`
- Namespaced skill: `/realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill`
- Credentials come from `userConfig`
- Plugin subprocesses also receive:
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_KEY`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_SECRET`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_REGION`

The runtime resolves those values automatically when the standard `REALSEE_*` variables are not already set.

If you do not have Realsee credentials yet:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github) or use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github) or use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- Unknown region: use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github) first, then confirm whether the account is `cn` or `global`

After that, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `Panorama-to-VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Fallback for older Claude Code builds

If your local `claude plugin validate` build does not yet recognize `userConfig`, keep using the same plugin directory and export these variables manually before launching Claude Code:

```bash
export REALSEE_APP_KEY=...
export REALSEE_APP_SECRET=...
export REALSEE_REGION=global
claude --plugin-dir ./.claude-plugin/realsee-panorama-to-vr-skill
```

## Typical prompts

- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill on ./examples/manifest-input and show the task_code and vr_url.`
- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill on /data/panos and auto-generate the manifest.`
- `Use /realsee-panorama-to-vr-skill:realsee-panorama-to-vr-skill to resume task_code abc123 in ./workspace.`

For manual shell recovery outside Claude, the repository also includes:

```bash
npm run poll:bg -- --workspace ./workspace --task-code abc123
npm run poll:status -- --workspace ./workspace --task-code abc123
```

## Release policy

- `main` is the integration branch.
- Stable Claude plugin installations use a GitHub Release tag such as `v1.0.0`.
