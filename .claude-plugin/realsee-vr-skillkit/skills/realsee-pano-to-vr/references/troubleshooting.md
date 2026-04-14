# Troubleshooting

## Missing credentials

Symptoms:

- `Missing REALSEE_APP_KEY or REALSEE_APP_SECRET`

Fix:

- Export the variables in your shell
- Or create `.env` from `.env.example`
- Or, in Claude Code, enable the plugin and fill `userConfig`
- If `REALSEE_REGION=cn`, register at `my.realsee.cn` or use `https://h5.realsee.com/vrapplink`
- If `REALSEE_REGION=global`, register at `my.realsee.ai` or use `https://h5.realsee.com/vrapplink`
- If the region is not known yet, use the unified link and confirm whether the account should be `cn` or `global`
- Then email `developer@realsee.com` to request the panorama-to-VR API capability
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
node ./.agents/skills/realsee-pano-to-vr/scripts/run-pano-to-vr.mjs \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

This skips manifest preparation and upload, then resumes polling.
