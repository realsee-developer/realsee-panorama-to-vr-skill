# Contributing

This repository supports three audiences at once: end users, contributors, and AI host integrations. Keep the docs and runtime aligned for all three.

## Before You Change Anything

Read these first:

- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [AGENTS.md](./AGENTS.md)

Core boundaries:

- The canonical skill source is `.agents/skills/realsee-panorama-to-vr-skill/`.
- The Claude plugin copy is generated from the canonical skill.
- Public sample data only. Never commit customer panoramas, customer manifests, private workspaces, or live credentials.
- Human-facing terminology should use `全景图生成 VR`. Do not rename the repository or skill identifiers such as `realsee-panorama-to-vr-skill`.

## Local Contributor Setup

From the repository root:

```bash
npm run setup:local
npm run doctor:local
```

`setup:local` installs dependencies, creates `.env` from `.env.example` when needed, syncs the Claude plugin copy, and validates the canonical skill.

## Daily Workflow

1. Make changes in the canonical files.
2. If you changed anything under `.agents/skills/realsee-panorama-to-vr-skill/`, run `npm run sync:claude-plugin`.
3. Run targeted checks while you work, then run the full CI suite before opening a PR.
4. Update documentation whenever install flow, credentials, output shape, or supported hosts change.

## Source-of-Truth Rules

- Edit canonical skill files in `.agents/skills/realsee-panorama-to-vr-skill/`.
- Do not hand-edit `.claude-plugin/realsee-panorama-to-vr-skill/skills/realsee-panorama-to-vr-skill/` unless you are changing the sync mechanism itself.
- Update both `README.md` and `README.zh-CN.md` when user-facing behavior changes.
- Update host guides in `docs/` when Codex, Claude Code, or Gemini install/use flows change.
- Update [examples/SOURCES.md](./examples/SOURCES.md) whenever sample data changes.

## Required Checks Before Opening a PR

Run these from the repository root:

```bash
npm run ci
```

This validates:

- canonical skill structure
- Claude plugin sync
- public example packaging smoke tests
- failure artifact contracts for `state.json` and `result.json`

Useful additional checks during development:

```bash
npm run doctor:local
npm run validate:skill
```

## Docs Update Expectations

If your change affects any of the following, update the corresponding docs in the same PR:

- install commands or bootstrap flow
- credential requirements
- region handling
- output fields in `result.json` or `state.json`
- AI host behavior differences
- release or public distribution process

## Data and Secrets Policy

- `examples/` must remain publicly distributable.
- Never commit `.env`, private task artifacts, or real customer exports.
- Never paste live `REALSEE_APP_KEY`, `REALSEE_APP_SECRET`, access tokens, or private workspace output into issues or pull requests.

## Pull Request Checklist

- Keep the change focused.
- Describe any host-facing behavior changes in the PR description.
- Call out docs changes explicitly when they affect users or AI hosts.
- Mention any changes to credentials, region handling, artifact locations, or output contracts.
