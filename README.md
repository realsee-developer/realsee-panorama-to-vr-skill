# Panorama-to-VR

[English](./README.md) | [简体中文](./README.zh-CN.md)

[![CI](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml)
[![CodeQL](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml)
[![Latest Release](https://img.shields.io/github/v/release/realsee-developer/realsee-panorama-to-vr-skill?display_name=tag)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/releases)
[![License](https://img.shields.io/badge/License-Private-red)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/realsee-developer/realsee-panorama-to-vr-skill?style=social)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/stargazers)

`Panorama-to-VR` converts a local panorama set into a Realsee VR space through the Realsee Open Platform workflow.

This repository contains the Node.js runtime, example data, and host integration assets used by Codex, Claude Code, and Gemini CLI.

Included host integrations:

- Codex
- Claude Code
- Gemini CLI

The runtime handles manifest validation or generation, ZIP packaging, upload token retrieval, object upload, task submission, polling, and structured result output.

The repository toolchain uses Node.js in all three places:

- runtime entrypoints are Node.js
- maintenance scripts are Node.js
- CI validation runs on Node.js only

## Releases

- `main` is the integration branch for ongoing development.
- Stable distribution happens through Git tags and GitHub Releases such as `v1.0.1`.
- Production installs use a release tag instead of moving `main`.
- When this repository is listed on `skills.sh`, that page is a discovery entry. GitHub Releases provide reproducible pinned installs.

## Repository Layout

- `.agents/skills/realsee-panorama-to-vr-skill/`
  Skill source directory. Gemini CLI can discover it directly through the `.agents/skills` alias.
- `.claude-plugin/realsee-panorama-to-vr-skill/`
  Claude Code plugin directory for `--plugin-dir` usage.
- `examples/manifest-input/`
  Public indoor panoramas plus a sample `manifest.json`.
- `examples/SOURCES.md`
  Source pages and license notes for the public example dataset.
- `scripts/install-codex-skill.mjs`
  Node.js installer for Codex local skill discovery.

## Prerequisites

- Node.js 22+
- npm 10+
- Realsee Open Platform credentials:
  - `REALSEE_APP_KEY`
  - `REALSEE_APP_SECRET`
  - `REALSEE_REGION=global|cn`

Credential registration entry points:

- `REALSEE_REGION=cn`: register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- Region not decided yet: do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app. Confirm the account region through your Realsee account owner or Realsee support first.

API capability activation uses [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A). The request includes account region, `UserID`, and `IdentityID`.

Install dependencies from the repository root:

```bash
npm install
```

Pinned release install:

```bash
VERSION=v1.0.1
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

The skill directory also includes its own [`package.json`](./.agents/skills/realsee-panorama-to-vr-skill/package.json).

Local `.env` loading uses:

```bash
cp .env.example .env
```

## Quick Start

Run against the included example manifest and images:

```bash
npm run run -- \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

The bundled example data is a public CC0 interior panorama set from Wikimedia Commons, not customer data. See [examples/SOURCES.md](./examples/SOURCES.md).

Run against an image directory only:

```bash
npm run run -- \
  --images-dir /absolute/path/to/panoramas \
  --workspace ./workspace \
  --json
```

Resume polling for an existing task:

```bash
npm run run -- \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

Background polling:

```bash
npm run poll:bg -- \
  --workspace ./workspace \
  --task-code your_task_code

npm run poll:status -- \
  --workspace ./workspace \
  --task-code your_task_code
```

The runtime writes one isolated working directory per task and always produces:

- `state.json`
- `result.json`

`result.json` includes `status`, `project_name`, `task_code`, `project_id`, `vr_url`, and `workspace_dir`.

## Host Integration

- Codex: [docs/codex.md](./docs/codex.md)
- Claude Code: [docs/claude-plugin.md](./docs/claude-plugin.md)
- Gemini CLI: [docs/gemini-cli.md](./docs/gemini-cli.md)
- Install Guide Overview: [docs/install-guides.md](./docs/install-guides.md)
- Public Distribution: [docs/public-distribution.md](./docs/public-distribution.md)
- Release flow: [docs/releases.md](./docs/releases.md)

## Notes

- This repository does **not** ship an MCP server.
- This repository does **not** publish a standalone CLI package.
- Claude integration in this repository uses the bundled plugin wrapper.
- Gemini CLI can load the skill directly from `.agents/skills`.
- Gemini CLI can use the repository-local skill files directly. Some environments also expose a `gemini skills` flow. Avoid enabling both the repository-local copy and a same-name global skill at the same time.

## Repository Trends

[![Star History Chart](https://api.star-history.com/image?repos=realsee-developer/realsee-panorama-to-vr-skill&type=Date)](https://www.star-history.com/#realsee-developer/realsee-panorama-to-vr-skill&Date)
