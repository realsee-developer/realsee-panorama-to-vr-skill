# 全景图生成VR

[English](./README.md) | [中文](./README.zh-CN.md)

[![CI](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml)
[![CodeQL](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml)
[![Latest Release](https://img.shields.io/github/v/release/realsee-developer/realsee-panorama-to-vr-skill?display_name=tag)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/releases)
[![License](https://img.shields.io/badge/License-Private-red)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/realsee-developer/realsee-panorama-to-vr-skill?style=social)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/stargazers)

`全景图生成VR` 用于把一组本地全景图通过 Realsee Open Platform 工作流生成可访问的 VR 空间。

这个仓库包含 Node.js 运行时、示例数据，以及面向 Codex、Claude Code、Gemini CLI 的接入资源。

已包含的宿主接入：

- Codex
- Claude Code
- Gemini CLI

运行时负责 `manifest` 校验或生成、ZIP 打包、上传令牌获取、对象上传、任务提交、轮询和结构化结果输出。

仓库工具链使用 Node.js：

- 运行时入口使用 Node.js
- 维护脚本使用 Node.js
- CI 校验使用 Node.js

## 发布

- `main` 分支用于持续开发集成。
- 稳定版本通过 Git tag 和 GitHub Release 发布，例如 `v1.0.0`。
- 面向生产环境的接入请固定到某个 release tag，不要直接跟随变化中的 `main`。
- `skills.sh` 页面用于发现，GitHub Release/tag 用于可复现安装。

## 仓库结构

- `.agents/skills/realsee-panorama-to-vr-skill/`
  skill 源目录，Gemini CLI 可以直接通过 `.agents/skills` 发现它。
- `.claude-plugin/realsee-panorama-to-vr-skill/`
  Claude Code plugin 目录，支持 `--plugin-dir` 加载。
- `examples/manifest-input/`
  公开可分发的室内全景图样例和对应 `manifest.json`。
- `examples/SOURCES.md`
  样例数据的来源页面和许可说明。
- `scripts/install-codex-skill.mjs`
  Codex 本地 skill 安装脚本。
## 前置要求

- Node.js 22+
- npm 10+
- 如视开放平台凭证：
  - `REALSEE_APP_KEY`
  - `REALSEE_APP_SECRET`
  - `REALSEE_REGION=global|cn`

凭证注册入口：

- `REALSEE_REGION=cn`：前往 [my.realsee.cn](https://my.realsee.cn/?utm_source=github) 注册，或使用统一链接 [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- `REALSEE_REGION=global`：前往 [my.realsee.ai](https://my.realsee.ai/?utm_source=github) 注册，或使用统一链接 [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github)
- 还没确定账号可用区：先使用统一链接 [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink?utm_source=github) 注册，再确认账号归属 `cn` 或 `global`

接口能力开通邮箱为 [developer@realsee.com](mailto:developer@realsee.com?subject=%E5%85%A8%E6%99%AF%E5%9B%BE%E7%94%9F%E6%88%90VR%20%E6%8E%A5%E5%8F%A3%E8%83%BD%E5%8A%9B%E5%BC%80%E9%80%9A%E7%94%B3%E8%AF%B7&body=%E8%B4%A6%E5%8F%B7%E5%8F%AF%E7%94%A8%E5%8C%BA%EF%BC%9A%20%0AUserID%EF%BC%9A%20%0AIdentityID%EF%BC%9A%20%0A)。邮件内容包含账号可用区、`UserID`、`IdentityID`。

安装依赖：

```bash
npm install
```

固定版本安装：

```bash
VERSION=v1.0.0
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

skill 目录中也包含独立的 [`package.json`](./.agents/skills/realsee-panorama-to-vr-skill/package.json)。

本地 `.env` 加载方式：

```bash
cp .env.example .env
```

## 快速开始

使用示例 `manifest + images` 运行：

```bash
npm run run -- \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

仓库内置的 `examples/` 已替换为 Wikimedia Commons 上的公开 CC0 室内全景样例，不再包含客户真实数据。详见 [examples/SOURCES.md](./examples/SOURCES.md)。

只给图片目录，由运行时自动生成 `manifest.json`：

```bash
npm run run -- \
  --images-dir /absolute/path/to/panoramas \
  --workspace ./workspace \
  --json
```

恢复轮询已有任务：

```bash
npm run run -- \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

后台轮询：

```bash
npm run poll:bg -- \
  --workspace ./workspace \
  --task-code your_task_code

npm run poll:status -- \
  --workspace ./workspace \
  --task-code your_task_code
```

每次运行都会生成独立工作目录，并固定产出：

- `state.json`
- `result.json`

其中 `result.json` 至少包含 `status`、`project_name`、`task_code`、`project_id`、`vr_url`、`workspace_dir`。

## 接入文档

- Codex: [docs/codex.md](./docs/codex.md)
- Claude Code: [docs/claude-plugin.md](./docs/claude-plugin.md)
- Gemini CLI: [docs/gemini-cli.md](./docs/gemini-cli.md)
- Release 流程: [docs/releases.md](./docs/releases.md)

## 说明

- 首版不做 MCP。
- 首版不发布独立 CLI 包。
- Claude 侧使用仓库内置 plugin 目录。
- Gemini CLI 可以直接消费 `.agents/skills`。
- Gemini CLI 使用“仓库内直接发现”或“全局 skills link/install”其中一种方式；同名 skill 同时启用时会出现覆盖提示。

## 仓库趋势

[![Star History Chart](https://api.star-history.com/image?repos=realsee-developer/realsee-panorama-to-vr-skill&type=Date)](https://www.star-history.com/#realsee-developer/realsee-panorama-to-vr-skill&Date)
