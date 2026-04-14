# Troubleshooting

## Missing credentials

Symptoms:

- `Missing REALSEE_APP_KEY or REALSEE_APP_SECRET`

Fix:

- Export the variables in your shell
- Or create `.env` from `.env.example`
- Or, in Claude Code, enable the plugin and fill `userConfig`
- If `REALSEE_REGION=cn`, register at [my.realsee.cn](https://my.realsee.cn/?utm_source=github) or use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- If `REALSEE_REGION=global`, register at [my.realsee.ai](https://my.realsee.ai/?utm_source=github) or use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- If the region is not known yet, use [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github) first and confirm whether the account is `cn` or `global`
- Then email [developer@realsee.com](mailto:developer@realsee.com?subject=Panorama-to-VR%20API%20Capability%20Request&body=Account%20region%3A%20%0AUserID%3A%20%0AIdentityID%3A%20%0A) to request the official `Panorama-to-VR` API capability
- Include your account region, `UserID`, and `IdentityID` in the request email

## Invalid region

Symptoms:

- `Invalid REALSEE_REGION`

Fix:

- Use `global` for overseas or `cn` for mainland China

## Manifest mismatch

Symptoms:

- Missing image for `scan_list[].id`

Fix:

- Make sure every `id` in `manifest.json` resolves to an actual file in `--images-dir`

## Resume polling

If the initial run already submitted a task but the session ended:

```bash
node ./.agents/skills/realsee-panorama-to-vr-skill/scripts/run-panorama-to-vr.mjs \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

This skips manifest preparation and upload, then resumes polling.
