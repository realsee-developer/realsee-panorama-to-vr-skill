# Host Differences

## Codex

- Install via a local symlink into `$CODEX_HOME/skills`
- Prefer `$realsee-panorama-to-vr-skill`
- Credentials usually come from shell env or `.env`

## Claude Code

- Use the bundled plugin under `.claude-plugin/realsee-panorama-to-vr-skill`
- Plugin `userConfig` provides credentials
- Claude exposes those values to subprocesses as `CLAUDE_PLUGIN_OPTION_*`

## Gemini CLI

- Gemini can discover the canonical skill directly from `.agents/skills`
- Use exactly one Gemini path at a time:
- Run inside the repository and rely on workspace discovery from `.agents/skills`
- Or install/link a global skill with `gemini skills link ./.agents/skills/realsee-panorama-to-vr-skill` or `gemini skills install <repo>`
- Avoid keeping both the workspace skill and a same-name global skill enabled simultaneously
- Credentials still come from shell env or `.env`
