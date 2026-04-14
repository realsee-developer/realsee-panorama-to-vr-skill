# Claude Code Integration

## Development usage

Clone the repository, install dependencies, sync the bundled plugin skill, then start Claude Code with the local plugin directory:

```bash
git clone <repo-url>
cd realsee-pano-to-vr
npm install
npm run sync:claude-plugin
claude --plugin-dir ./.claude-plugin/realsee-pano-to-vr-agent-plugin
```

This uses Claude Code's documented `--plugin-dir` development flow.

Keep exactly one active `claude` installation on your machine. Do not keep both a native install and a package-manager install on the PATH at the same time, or Claude Code may report a duplicate-installation warning in `claude doctor`.

## Plugin behavior

- Plugin root: `.claude-plugin/realsee-pano-to-vr-agent-plugin`
- Namespaced skill: `/realsee-pano-to-vr:realsee-pano-to-vr`
- Credentials come from `userConfig`
- Plugin subprocesses also receive:
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_KEY`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_APP_SECRET`
  - `CLAUDE_PLUGIN_OPTION_REALSEE_REGION`

The runtime resolves those values automatically when the standard `REALSEE_*` variables are not already set.

If you do not have Realsee credentials yet:

- `REALSEE_REGION=cn`: register at `my.realsee.cn` or use `https://h5.realsee.com/vrapplink`
- `REALSEE_REGION=global`: register at `my.realsee.ai` or use `https://h5.realsee.com/vrapplink`
- Unknown region: use the unified link first, then confirm whether the account should be `cn` or `global`

After that, email `developer@realsee.com` to request the panorama-to-VR API capability. Include your account region, `UserID`, and `IdentityID`.

## Fallback for older Claude Code builds

If your local `claude plugin validate` build does not yet recognize `userConfig`, keep using the same plugin directory and export these variables manually before launching Claude Code:

```bash
export REALSEE_APP_KEY=...
export REALSEE_APP_SECRET=...
export REALSEE_REGION=global
claude --plugin-dir ./.claude-plugin/realsee-pano-to-vr-agent-plugin
```

## Typical prompts

- `Use /realsee-pano-to-vr:realsee-pano-to-vr on ./examples/manifest-input and show the task_code and vr_url.`
- `Use /realsee-pano-to-vr:realsee-pano-to-vr on /data/panos and auto-generate the manifest.`
- `Use /realsee-pano-to-vr:realsee-pano-to-vr to resume task_code abc123 in ./workspace.`

For manual shell recovery outside Claude, the repository also includes:

```bash
./scripts/start-background-poll.sh --workspace ./workspace --task-code abc123
./scripts/task-status.sh --workspace ./workspace --task-code abc123
```
