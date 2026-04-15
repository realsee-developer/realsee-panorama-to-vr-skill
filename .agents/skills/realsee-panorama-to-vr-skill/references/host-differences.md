# Host Differences

## Codex

- Install via a local symlink into `$CODEX_HOME/skills`
- Prefer `$realsee-panorama-to-vr-skill`
- Credentials usually come from shell env or `.env`
- Best verification commands: `ls -la "$CODEX_HOME/skills/realsee-panorama-to-vr-skill"` and `node ./scripts/validate-skill.mjs`

## Claude Code

- Use the bundled plugin under `.claude-plugin/realsee-panorama-to-vr-skill`
- Plugin `userConfig` provides credentials
- Claude exposes those values to subprocesses as `CLAUDE_PLUGIN_OPTION_*`
- Verify with `claude plugin validate ./.claude-plugin/realsee-panorama-to-vr-skill`

## Gemini CLI

- Gemini can use the canonical skill directly from `.agents/skills`
- The most portable path is to run Gemini inside the repository and point it at `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`
- Some Gemini environments also expose a `gemini skills` flow for linking the same directory explicitly
- Avoid keeping both the repository-local skill and a same-name global skill enabled simultaneously
- Credentials still come from shell env or `.env`
- Verify with `node ./scripts/validate-skill.mjs`
