# Install Guide Overview

This repository ships shareable install guides for each supported host:

- [Codex](./codex.md)
- [Claude Code plugin](./claude-plugin.md)
- [Gemini CLI](./gemini-cli.md)
- [Public distribution and listing](./public-distribution.md)

Each guide is self-contained so you can use it in two ways:

1. Open the file locally and follow the shell commands yourself.
2. Share the GitHub URL of the file with the target agent and ask it to perform the installation for you.

## Recommended Sharing Pattern

For reproducible installs:

1. Open the guide on a tagged GitHub release such as `v1.0.1`.
2. Copy that GitHub file URL.
3. Paste it to the target agent with a short instruction like:

```text
Open this GitHub guide and follow it on my machine.
Use the tagged revision in the URL, verify the install, and report any missing credentials.
```

For development installs:

- Share the `main` branch URL of the same guide.
- Expect behavior and file layout to change over time.

## Which Guide To Share

- Share `docs/codex.md` when the target is Codex.
- Share `docs/claude-plugin.md` when the target is Claude Code and you want the plugin flow.
- Share `docs/gemini-cli.md` when the target is Gemini CLI.
- Share `docs/public-distribution.md` when you want publishing, release, or listing guidance for platforms such as `skills.sh`.

## Credential Reminder

All three host guides require the same Realsee credentials:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

Use [my.realsee.cn](https://my.realsee.cn/?utm_source=github) for `cn` accounts and [my.realsee.ai](https://my.realsee.ai/?utm_source=github) for `global` accounts. Do not use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) to infer the account region. That page is for downloading the Realsee app.
