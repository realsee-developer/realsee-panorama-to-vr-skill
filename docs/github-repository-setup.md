# GitHub Repository Setup

This document describes the recommended GitHub-side configuration for the public repository:

- Repository: `realsee-developer/realsee-panorama-to-vr-skill`
- Official capability names: `全景图生成VR` / `Panorama-to-VR`

## Current snapshot

This snapshot matched the repository state when this document was added:

- Repository visibility: `private`
- Default branch: `main`
- Description: empty
- Homepage: empty
- Topics: none
- Issues: enabled
- Projects: enabled
- Wiki: disabled
- Auto-merge: disabled
- Delete branch on merge: disabled
- Vulnerability alerts: disabled

## Recommended target state

### About section

- Description:
  `Panorama-to-VR skill for Codex, Claude Code, and Gemini CLI powered by the Realsee Open Platform.`
- Homepage:
  Leave empty unless you publish a dedicated product or docs site later.
- Topics:
  - `realsee`
  - `panorama`
  - `vr`
  - `agent-skill`
  - `codex`
  - `claude-code`
  - `gemini-cli`
  - `openapi`
  - `nodejs`

### General repository settings

- Default branch: `main`
- Issues: enabled
- Projects: disable if you do not plan to use GitHub Projects for this repository
- Wiki: disabled
- Auto-merge: enabled
- Delete branch on merge: enabled

### Merge strategy

Recommended for a small public skill repository:

- Squash merge: enabled
- Merge commit: disabled
- Rebase merge: disabled

This keeps the `main` branch history clean and makes release notes easier to read.

### Security

- Enable vulnerability alerts
- Keep Dependabot version updates enabled
- Enable secret scanning if your organization plan supports it
- Enable secret scanning push protection if your organization plan supports it

### Release model

- `main` is the integration branch
- Stable distribution happens through annotated tags such as `v0.1.0`
- GitHub Releases are generated from pushed `v*` tags
- Public consumers should pin a release tag instead of following moving `main`

### Branch protection / rulesets

Recommended once the repository is public, or once your plan supports it:

- Prevent force pushes
- Prevent branch deletion
- Require pull request before merging if you want a stricter maintainer workflow
- Require passing checks for:
  - `CI`
  - `CodeQL`

Note: when this document was generated, branch protection for this repository returned a GitHub 403 stating that the feature requires a public repository or an upgraded plan.

## Recommended `gh` commands

### 1. Set description, topics, and baseline settings

```bash
gh repo edit realsee-developer/realsee-panorama-to-vr-skill \
  --description "Panorama-to-VR skill for Codex, Claude Code, and Gemini CLI powered by the Realsee Open Platform." \
  --add-topic realsee \
  --add-topic panorama \
  --add-topic vr \
  --add-topic agent-skill \
  --add-topic codex \
  --add-topic claude-code \
  --add-topic gemini-cli \
  --add-topic openapi \
  --add-topic nodejs \
  --enable-issues \
  --enable-projects=false \
  --enable-wiki=false \
  --enable-auto-merge \
  --delete-branch-on-merge \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false \
  --squash-merge-commit-message pr-title
```

### 2. Make the repository public

Run this only after you have reviewed the repository contents, README, license, and release flow:

```bash
gh repo edit realsee-developer/realsee-panorama-to-vr-skill \
  --visibility public \
  --accept-visibility-change-consequences
```

### 3. Enable vulnerability alerts

```bash
gh api \
  -X PUT \
  repos/realsee-developer/realsee-panorama-to-vr-skill/vulnerability-alerts \
  -H "Accept: application/vnd.github+json"
```

### 4. Enable secret scanning if your plan supports it

```bash
gh repo edit realsee-developer/realsee-panorama-to-vr-skill \
  --enable-secret-scanning \
  --enable-secret-scanning-push-protection
```

## First public release

After the configuration above is in place and `main` is clean:

```bash
npm run ci
git status --short
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

The repository already includes a GitHub Actions workflow that will validate the repository and create a GitHub Release from pushed `v*` tags.

## Notes for `skills.sh`

- A single public repository is a valid publishing model
- The repository does not need to be converted into a monorepo first
- The `skills.sh` listing can be the discovery surface, while GitHub Releases remain the stable installation source

## Manual UI path

If you prefer the GitHub web UI instead of `gh`:

1. Open the repository homepage.
2. Click the gear icon in the `About` box and set description, homepage, and topics.
3. Open `Settings`:
   - `General`: review merge options and delete-branch-on-merge
   - `Security`: enable vulnerability alerts and secret scanning where available
   - `Rules` or `Branches`: configure branch protection or rulesets when available
4. Open `Releases` after pushing the first `v*` tag and confirm the generated release notes are correct.
