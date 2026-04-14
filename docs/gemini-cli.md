# Gemini CLI Integration

## Local clone + link

Clone the repository and install dependencies:

```bash
git clone https://github.com/realsee-developer/realsee-vr-skillkit.git
cd realsee-vr-skillkit
npm install
```

If your Gemini setup consumes the skill directory more directly, you can also install dependencies in the skill root itself:

```bash
npm install --prefix ./.agents/skills/realsee-pano-to-vr
```

Gemini CLI can use this repository in two different ways. Pick exactly one:

1. Workspace discovery
   Run Gemini inside the cloned repository and let it discover `.agents/skills` directly. This is the preferred development flow and does not require any extra install step.
2. Global install or link
   Use this only when you want the skill outside the repository checkout.

Do not keep both the workspace-discovered skill and a same-name global skill link enabled at the same time, or Gemini will warn that one is overriding the other.

If you want a global skill, link the canonical skill from the repository root:

```bash
gemini skills link ./.agents/skills/realsee-pano-to-vr
```

You can also install the repository directly from Git:

```bash
gemini skills install https://github.com/realsee-developer/realsee-vr-skillkit.git
```

## Credentials

Gemini CLI users should export:

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION`

You can also keep them in a local `.env` file if you run the bundled Node runtime from the repository root.

If you do not have credentials yet:

- `REALSEE_REGION=cn`: register at `my.realsee.cn` or use `https://h5.realsee.com/vrapplink`
- `REALSEE_REGION=global`: register at `my.realsee.ai` or use `https://h5.realsee.com/vrapplink`
- Unknown region: use the unified link first, then confirm whether the account should be `cn` or `global`

After that, email `developer@realsee.com` to request the official `全景图生成VR` API capability. Include your account region, `UserID`, and `IdentityID`.

## Typical prompts

- `Use realsee-pano-to-vr on ./examples/manifest-input.`
- `Use realsee-pano-to-vr on /data/panos and generate the manifest automatically.`
- `Use realsee-pano-to-vr to resume polling task_code abc123 in ./workspace.`

For shell-level background polling after a task is already submitted:

```bash
npm run poll:bg -- --workspace ./workspace --task-code abc123
npm run poll:status -- --workspace ./workspace --task-code abc123
```
