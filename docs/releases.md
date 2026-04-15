# Release Process

This repository uses Git tags and GitHub Releases as the stable distribution channel.

## Policy

- `main` is the integration branch for ongoing development.
- Stable versions are immutable tags such as `v1.0.3`.
- External installs should use a release tag instead of following `main`.
- Public docs must remain aligned with the tagged artifact.

## Maintainer Flow

1. Merge validated changes into `main`.
2. Sync generated artifacts and rerun checks:

```bash
npm run sync:claude-plugin
npm run ci
git status --short
```

3. Confirm user-facing docs still match the shipped behavior:

- `README.md`
- `README.zh-CN.md`
- `docs/codex.md`
- `docs/claude-plugin.md`
- `docs/gemini-cli.md`

4. Create an annotated tag:

```bash
git tag -a v1.0.3 -m "Release v1.0.3"
```

5. Push the tag:

```bash
git push origin v1.0.3
```

6. GitHub Actions re-run validation and create the GitHub Release automatically.

## Consumer Flow

Clone a specific release tag:

```bash
VERSION=v1.0.3
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

Then follow the host-specific guide you need:

- [docs/codex.md](./codex.md)
- [docs/claude-plugin.md](./claude-plugin.md)
- [docs/gemini-cli.md](./gemini-cli.md)

## Release Notes Guidance

- Do not retag an existing published version.
- Use semantic versioning for public releases.
- Keep release notes user-facing and installation-oriented.
- GitHub Release Notes are generated from merged PRs and `.github/release.yml`.
