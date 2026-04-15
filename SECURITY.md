# Security Policy

## Report Security Issues Privately

Do not open a public GitHub issue for:

- credential leaks
- private panorama data exposure
- access-control problems
- vulnerabilities in upload, polling, or result handling

Send security reports to:

- `developer@realsee.com`

Include:

- affected version, tag, or commit
- reproduction steps
- expected impact
- whether credentials, private panoramas, or workspace artifacts may have been exposed

## Sensitive Data Rules

Never include these in issues, pull requests, comments, screenshots, or logs:

- real customer panoramas
- real `REALSEE_APP_KEY` / `REALSEE_APP_SECRET`
- access tokens
- private task artifacts
- raw workspace directories from customer jobs

If you accidentally expose anything sensitive, stop using the public thread and report it by email immediately.
