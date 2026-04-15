# AGENTS.md

This file gives AI coding tools the minimum repo context they need before editing anything.

## Repository Identity

- Repository id: `realsee-panorama-to-vr-skill`
- Human-facing capability name: `全景图生成 VR`
- Supported AI hosts: Codex, Claude Code, Gemini CLI
- Canonical skill root: `./.agents/skills/realsee-panorama-to-vr-skill/`

## Non-Negotiable Rules

- Treat `./.agents/skills/realsee-panorama-to-vr-skill/` as the source of truth.
- Do not hand-edit the Claude plugin skill copy under `./.claude-plugin/.../skills/...` unless you are changing the sync script itself.
- After changing canonical skill files, run `npm run sync:claude-plugin`.
- Never commit customer panoramas, real credentials, or private task artifacts.
- Use the human-facing phrase `全景图生成 VR` in docs. Do not rename repository, directory, package, or skill identifiers.

## Useful Commands

```bash
npm run setup:local
npm run doctor:local
npm run validate:skill
npm run sync:claude-plugin
npm run ci
```

Direct runtime example:

```bash
npm run run -- \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

## Docs That Must Stay In Sync

If install or usage behavior changes, update all relevant docs in the same change:

- `README.md`
- `README.zh-CN.md`
- `docs/install-guides.md`
- `docs/codex.md`
- `docs/claude-plugin.md`
- `docs/gemini-cli.md`
- `./.agents/skills/realsee-panorama-to-vr-skill/SKILL.md`

If contributor workflow changes, also update:

- `CONTRIBUTING.md`
- `ARCHITECTURE.md`
- `SUPPORT.md`
- `SECURITY.md`

## Validation Expectations

Before claiming the work is complete, run the narrowest relevant checks and then the full repository check when the change affects shipping behavior:

```bash
npm run ci
```

If you changed only documentation, still check for obvious repo consistency issues such as broken terminology, stale paths, and missing sync steps.
