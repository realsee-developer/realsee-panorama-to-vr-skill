# Panorama Image to VR Skillkit

[English](./README.md) | [简体中文](./README.zh-CN.md)

[![CI](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml)
[![CodeQL](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml)
[![Latest Release](https://img.shields.io/github/v/release/realsee-developer/realsee-panorama-to-vr-skill?display_name=tag)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/releases)
[![License](https://img.shields.io/badge/License-Private-red)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/realsee-developer/realsee-panorama-to-vr-skill?style=social)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/stargazers)

`realsee-panorama-to-vr-skill` is the GitHub-distributed skill repository for the official `全景图生成 VR` workflow. It packages the Node.js runtime, public example data, and installation assets needed to generate Realsee VR spaces from local panorama image sets.

Supported AI hosts:

- Codex
- Claude Code
- Gemini CLI

## Recommended Install

For the fastest public install path, start with:

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

Use GitHub release tags when you need a pinned, reproducible revision.

## Start Here

| I want to... | Read this |
| --- | --- |
| Run the workflow locally right away | [Quick Start](#quick-start) |
| Install the skill into an AI host | [docs/install-guides.md](./docs/install-guides.md) |
| Contribute to the repository | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Understand the repository layout and runtime flow | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Give an AI coding tool repo-specific instructions | [AGENTS.md](./AGENTS.md) |

## What This Repository Includes

- `.agents/skills/realsee-panorama-to-vr-skill/`
  Canonical skill source, runtime entrypoint, and AI-facing reference docs.
- `.claude-plugin/realsee-panorama-to-vr-skill/`
  Claude Code plugin wrapper generated from the canonical skill.
- `examples/manifest-input/`
  Publicly distributable panorama images and a sample `manifest.json`.
- `scripts/`
  Bootstrap, validation, installation, CI, and release helper scripts.
- `docs/`
  Host-specific install guides and maintainer documentation.

## Quick Start

### 1. Prepare credentials

You need:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION=global|cn`

Registration entry points:

- `REALSEE_REGION=cn`: [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`: [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- Region unknown: do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer it. That page is for downloading the Realsee app. Confirm the account region with the account owner or Realsee support first.

After account setup, email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama%20Image%20to%20VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `全景图生成 VR` API capability. Include your account region, `UserID`, and `IdentityID`.

### 2. Bootstrap the local workspace

```bash
npm run setup:local
```

This command:

- installs repository dependencies
- creates `.env` from `.env.example` when needed
- syncs the Claude plugin copy
- validates the canonical skill structure

Then fill in the credentials in `.env`.

### 3. Verify the environment

```bash
npm run doctor:local
```

The doctor script checks Node/npm, required files, Claude plugin validation, Gemini discovery conflicts, and canonical skill validation.

### 4. Run the public example

```bash
npm run run -- \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

The bundled example data is public CC0 sample content from Wikimedia Commons, not customer data. See [examples/SOURCES.md](./examples/SOURCES.md).

## Supported Workflow Modes

### Image-only mode

Provide only `--images-dir`. The runtime normalizes images, generates a manifest automatically, packages the ZIP, submits the task, and writes structured results.

```bash
npm run run -- \
  --images-dir /absolute/path/to/panoramas \
  --workspace ./workspace \
  --json
```

### Manifest mode

Provide both `--manifest` and `--images-dir` when you need exact ordering, naming, or floor mapping.

### Resume polling

Use an existing `task_code` to resume the remote task without re-uploading:

```bash
npm run run -- \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

For long-running jobs you do not want to keep in the foreground:

```bash
npm run poll:bg -- --workspace ./workspace --task-code your_task_code
npm run poll:status -- --workspace ./workspace --task-code your_task_code
```

## Output Contract

Each run gets its own working directory under `--workspace` and writes:

- `state.json`
- `result.json`

`result.json` always includes:

- `status`
- `project_name`
- `task_code`
- `project_id`
- `vr_url`
- `workspace_dir`

## Install Into AI Hosts

- Codex: [docs/codex.md](./docs/codex.md)
- Claude Code plugin: [docs/claude-plugin.md](./docs/claude-plugin.md)
- Gemini CLI: [docs/gemini-cli.md](./docs/gemini-cli.md)
- Host selection overview: [docs/install-guides.md](./docs/install-guides.md)

## Contributor Docs

- Contributing workflow: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Architecture and source-of-truth map: [ARCHITECTURE.md](./ARCHITECTURE.md)
- Repo instructions for AI coding tools: [AGENTS.md](./AGENTS.md)
- Public distribution checklist: [docs/public-distribution.md](./docs/public-distribution.md)
- Release flow: [docs/releases.md](./docs/releases.md)
- Support policy: [SUPPORT.md](./SUPPORT.md)
- Security policy: [SECURITY.md](./SECURITY.md)

## Release and Distribution

- `main` is the integration branch.
- Stable installs should use Git tags and GitHub Releases such as `v1.0.2`.
- `skills.sh` is a discovery surface. GitHub Releases remain the reproducible install source.

Recommended public install:

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

Use release tags when you need pinned installs. Use `skills.sh` when you want a discoverable one-command entry point.

## Notes

- This repository does not ship an MCP server.
- This repository does not publish a standalone CLI package.
- Human-facing wording should use `全景图生成 VR`; repository and skill IDs stay as `realsee-panorama-to-vr-skill`.
- The canonical skill lives under `.agents/skills/realsee-panorama-to-vr-skill/`. Do not treat the Claude plugin copy as the source of truth.

## Repository Trends

[![Star History Chart](https://api.star-history.com/image?repos=realsee-developer/realsee-panorama-to-vr-skill&type=Date)](https://www.star-history.com/#realsee-developer/realsee-panorama-to-vr-skill&Date)
