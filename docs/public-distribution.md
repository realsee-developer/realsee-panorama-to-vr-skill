# Public Distribution

Use this guide when the repository needs to be:

- installable directly from GitHub
- shareable with humans or AI agents through GitHub file URLs
- listable on public discovery pages such as `skills.sh`

## Recommended Public Install

The recommended public install command is:

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

## Canonical Distribution Model

GitHub is the source of truth:

- `main` is the integration branch.
- Immutable Git tags and GitHub Releases are the stable install targets.
- Host-specific install guides live in `docs/`.
- The canonical skill source lives under `.agents/skills/realsee-panorama-to-vr-skill/`.
- The Claude plugin copy lives under `.claude-plugin/realsee-panorama-to-vr-skill/` and must be regenerated from the canonical skill.

## Public Entry Points To Keep Healthy

These are the main files that external users and agents rely on:

- `README.md`
- `README.zh-CN.md`
- `docs/install-guides.md`
- `docs/codex.md`
- `docs/claude-plugin.md`
- `docs/gemini-cli.md`

For production installs, prefer tagged GitHub URLs such as `.../blob/v1.0.2/docs/codex.md` instead of `.../blob/main/docs/codex.md`.

## Public Listing Readiness Checklist

Before listing the repository on discovery surfaces:

1. Keep the repository public and cloneable from GitHub.
2. Keep install guides self-contained enough for an agent to execute from the shared URL alone.
3. Publish immutable release tags such as `v1.0.2`.
4. Keep root docs, host guides, and canonical skill docs aligned.
5. Run `npm run ci` before tagging a release.
6. Run `npm run sync:claude-plugin` after canonical skill changes.

## `skills.sh`

`skills.sh` is a discovery surface, not the reproducible install source. Keep these artifacts healthy:

- a public GitHub repository
- a canonical `SKILL.md`
- stable tagged releases
- direct GitHub guide links for agent-driven installs

Recommended public install command:

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

Pinned installs should still use Git tags and GitHub Releases.

## Claude Plugin Distribution

For Claude Code, the public install surface is the plugin directory:

- `.claude-plugin/realsee-panorama-to-vr-skill/.claude-plugin/plugin.json`
- `.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill/`

Use [docs/claude-plugin.md](./claude-plugin.md) as the shareable GitHub guide for Claude installs.

## Maintainer Release Checklist

Run these steps from the repository root:

```bash
npm install
npm run sync:claude-plugin
npm run ci
git status --short
git tag -a v1.0.2 -m "Release v1.0.2"
git push origin v1.0.2
```

Do not retag an existing published version.
