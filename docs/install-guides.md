# AI Host Install Guide Overview

Use this page to choose the right install path for Codex, Claude Code, or Gemini CLI.

## Recommended Install Entry

For the fastest public install flow, start with:

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

Then follow the host-specific guide if you need a pinned release, local development workflow, or manual verification.

## Host Matrix

| Host | Install target | Fastest setup path | Verification | Guide |
| --- | --- | --- | --- | --- |
| Codex | `${CODEX_HOME:-$HOME/.codex}/skills/realsee-panorama-to-vr-skill` symlink | `npm install && npm run install:codex-skill` | `ls -la "$CODEX_HOME/skills/..."` and `node ./scripts/validate-skill.mjs` | [docs/codex.md](./codex.md) |
| Claude Code | `.claude-plugin/realsee-panorama-to-vr-skill` | `npm install && npm run sync:claude-plugin` then `claude --plugin-dir ...` | `claude plugin validate ...` | [docs/claude-plugin.md](./claude-plugin.md) |
| Gemini CLI | repository-local `.agents/skills/realsee-panorama-to-vr-skill/SKILL.md` | `npm install` then point Gemini at the canonical skill | `node ./scripts/validate-skill.mjs` and `ls -la ./.agents/...` | [docs/gemini-cli.md](./gemini-cli.md) |

## Recommended Way To Share With Another Agent

Each host guide is designed for two usage modes:

1. Follow the commands manually in a shell.
2. Share the GitHub file URL to an AI agent and ask it to perform the installation.

For reproducible installs:

1. Open the guide on a tagged GitHub release such as `v1.0.2`.
2. Copy the GitHub URL of that file.
3. Paste it to the target agent with a request such as:

```text
Open this GitHub guide and follow it on my machine.
Use the tagged revision in the URL, verify the install, and report any missing credentials.
```

For development installs:

- Share the `main` branch URL instead.
- Expect file layout and behavior to change while development is ongoing.

## Which Guide To Share

- Share [docs/codex.md](./codex.md) when the target is Codex.
- Share [docs/claude-plugin.md](./claude-plugin.md) when the target is Claude Code.
- Share [docs/gemini-cli.md](./gemini-cli.md) when the target is Gemini CLI.
- Share [docs/public-distribution.md](./public-distribution.md) when the task is public listing, GitHub distribution, or `skills.sh` readiness.

## Common Prerequisites

All three hosts use the same Realsee credentials:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION=global|cn`

Registration entry points:

- `cn`: [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `global`: [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- Region unknown: do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app.

After account setup, request the official `全景图生成 VR` API capability via [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama%20Image%20to%20VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A). Include your account region, `UserID`, and `IdentityID`.
