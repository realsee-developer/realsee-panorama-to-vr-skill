# Release Process

This repository uses Git tags and GitHub Releases as the stable distribution channel.

## Policy

- `main` is the integration branch for ongoing development.
- Stable versions are immutable tags such as `v1.0.0`.
- External installs use a release tag instead of following `main`.

## Maintainer flow

1. Merge validated changes into `main`.
2. Confirm the repository is clean and CI passes:

```bash
npm run ci
git status --short
```

3. Create an annotated tag:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
```

4. Push the tag:

```bash
git push origin v1.0.0
```

5. GitHub Actions will re-run validation and create the GitHub Release automatically.

## Consumer flow

Clone a specific release tag:

```bash
VERSION=v1.0.0
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

Then follow the host-specific docs:

- `docs/codex.md`
- `docs/claude-plugin.md`
- `docs/gemini-cli.md`

## Notes

- Do not retag an existing published version.
- Use semantic versioning for public releases.
- Keep release notes user-facing; GitHub Release Notes are generated from merged PRs and `.github/release.yml`.
