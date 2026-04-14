# Contributing

## Scope

This repository is a GitHub-distributed skillkit for the official `全景图生成VR` capability.

Keep these boundaries intact:

- The canonical skill source is `.agents/skills/realsee-panorama-to-vr-skill/`
- The Claude plugin copy is generated from the canonical skill
- Public example data only; do not commit customer panoramas, customer manifests, or live credentials

## Local setup

```bash
npm ci
npm run ci
```

## Required checks before opening a pull request

Run these from the repository root:

```bash
npm run ci
```

This validates:

- canonical skill structure
- Claude plugin copy sync
- public example packaging smoke test
- failure artifact contract for `state.json` and `result.json`

## Source of truth rules

- Edit the canonical skill under `.agents/skills/realsee-panorama-to-vr-skill/`
- Do not hand-edit the Claude plugin skill copy unless you are also changing the sync process itself
- After canonical skill changes, run `npm run sync:claude-plugin`

## Example data policy

- `examples/` must contain publicly distributable sample data only
- If sample data changes, update `examples/SOURCES.md`
- Never commit private user panoramas or customer exports

## Pull request expectations

- Keep changes focused
- Explain host-facing behavior changes in the PR description
- Mention any changes to credentials, region handling, or output contracts
