# Public Distribution

Use this guide when you want the repository to be installable from GitHub, shareable with agents via GitHub file links, and listable on public discovery pages such as `skills.sh`.

## Canonical Distribution Model

This repository uses GitHub as the source of truth:

- `main` is the integration branch for ongoing changes.
- Immutable Git tags and GitHub Releases are the stable install target.
- Host-specific install guides live in `docs/` and can be shared as GitHub file URLs.
- The canonical skill source lives under `.agents/skills/realsee-panorama-to-vr-skill/`.
- The Claude plugin copy lives under `.claude-plugin/realsee-panorama-to-vr-skill/` and must be kept in sync from the canonical skill.

## Shareable GitHub Entry Points

These are the files you can link directly when handing the install to an agent:

- `docs/codex.md`
- `docs/claude-plugin.md`
- `docs/gemini-cli.md`
- `docs/install-guides.md`

Prefer tagged GitHub URLs such as `.../blob/v1.0.1/docs/codex.md` instead of `.../blob/main/docs/codex.md` for production installs.

## Public Listing Readiness

Before trying to list the repository on discovery pages:

1. Keep the repository public and cloneable from GitHub.
2. Keep the install guides self-contained so an agent can execute them from the shared file URL.
3. Publish immutable release tags such as `v1.0.1`.
4. Keep `README.md`, `README.zh-CN.md`, and the host guides aligned.
5. Run `npm run ci` before tagging a release.
6. Sync the Claude plugin copy with `npm run sync:claude-plugin` after canonical skill changes.

## `skills.sh`

`skills.sh` is a discovery page, not the reproducible install source. The repository should therefore keep these pieces healthy:

- a public GitHub repository
- a canonical `SKILL.md`
- a stable tagged release flow
- direct GitHub guide links for human or agent-driven installation

Pinned installs should still use Git tags and GitHub Releases.

## Claude Plugin Distribution

For Claude Code, the public install surface is the plugin directory:

- `.claude-plugin/realsee-panorama-to-vr-skill/.claude-plugin/plugin.json`
- `.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill/`

Use [claude-plugin.md](./claude-plugin.md) as the shareable GitHub file for plugin installation guidance.

## Release Checklist

Run these steps from the repository root:

```bash
npm install
npm run ci
git status --short
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

Do not retag an existing published version.
