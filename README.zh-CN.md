# 全景图生成VR SkillKit

[![CI](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml)
[![CodeQL](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml)
[![Latest Release](https://img.shields.io/github/v/release/realsee-developer/realsee-panorama-to-vr-skill?display_name=tag)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/releases)
[![License](https://img.shields.io/github/license/realsee-developer/realsee-panorama-to-vr-skill)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/realsee-developer/realsee-panorama-to-vr-skill?style=social)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/stargazers)

这个仓库用于把一组本地全景图通过 Realsee OpenAPI 编排成可访问的 VR 空间，并以 **GitHub 可接入仓库** 的方式提供给外部使用。

仓库对外的公开身份和 canonical skill id 为 `realsee-panorama-to-vr-skill`。

正式产品能力名称为 `全景图生成VR`，官方英文名称为 `Panorama-to-VR`。代码、脚本、接口字段、宿主触发名使用英文。

它不是独立 `realsee-cli` 产品，而是一个共享技能仓库，首版覆盖：

- Codex
- Claude Code
- Gemini CLI

核心能力只有一套：位于 `.agents/skills/realsee-panorama-to-vr-skill/` 的 canonical skill，以及其中内置的 Node.js 编排运行时。

仓库工具链使用 Node.js：

- 运行时入口使用 Node.js
- 维护脚本使用 Node.js
- CI 校验使用 Node.js

## 发布策略

- `main` 分支用于持续开发集成。
- 稳定版本通过 Git tag 和 GitHub Release 发布，例如 `v0.1.0`。
- 面向生产环境的接入请固定到某个 release tag，不要直接跟随变化中的 `main`。
- 未来上架 `skills.sh` 时，该页面作为发现入口，GitHub Release/tag 作为可复现安装入口。

## 仓库结构

- `.agents/skills/realsee-panorama-to-vr-skill/`
  canonical skill 源目录，Gemini CLI 可以直接通过 `.agents/skills` 发现它。
- `.claude-plugin/realsee-panorama-to-vr-skill/`
  Claude Code plugin 包装层，支持 `--plugin-dir` 加载。
- `examples/manifest-input/`
  公开可分发的室内全景图样例和对应 `manifest.json`。
- `examples/SOURCES.md`
  样例数据的来源页面和许可说明。
- `scripts/install-codex-skill.mjs`
  Codex 本地 skill 安装脚本。
- `docs/capability-naming.md`
  正式能力名和开发标识的命名约定。

## 前置要求

- Node.js 22+
- npm 10+
- 如视开放平台凭证：
  - `REALSEE_APP_KEY`
  - `REALSEE_APP_SECRET`
  - `REALSEE_REGION=global|cn`

如果你还没有 `REALSEE_APP_KEY` / `REALSEE_APP_SECRET`，需要按 `region` 区分引导：

- `REALSEE_REGION=cn`：前往 `my.realsee.cn` 注册，或使用统一链接 `https://h5.realsee.com/vrapplink`
- `REALSEE_REGION=global`：前往 `my.realsee.ai` 注册，或使用统一链接 `https://h5.realsee.com/vrapplink`
- 还没确定账号可用区：先使用统一链接注册，再确认账号归属 `cn` 或 `global`

完成注册后，使用账号的【账号可用区 / region】【如视 ID / UserID】【组织账号 / IdentityID】发送邮件到 `developer@realsee.com`，申请开通“全景图生成VR”的接口能力。

安装依赖：

```bash
npm install
```

如果你要按稳定版本接入，优先固定某个 release tag：

```bash
VERSION=v0.1.0
git clone --branch "$VERSION" --depth 1 https://github.com/realsee-developer/realsee-panorama-to-vr-skill.git
cd realsee-panorama-to-vr-skill
npm install
```

canonical skill 目录里也带了独立的 [`package.json`](./.agents/skills/realsee-panorama-to-vr-skill/package.json)，如果某个宿主是直接消费 skill 目录本身，也可以在该目录单独安装依赖。

如果你希望通过本地 `.env` 加载凭证：

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

如果任务处理时间较长，可以把轮询放到后台：

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
- GitHub 仓库配置: [docs/github-repository-setup.md](./docs/github-repository-setup.md)

Codex、Claude Code、Gemini CLI 的 skill id / plugin namespace 为 `realsee-panorama-to-vr-skill`。详细约定见 [docs/capability-naming.md](./docs/capability-naming.md)。

## 说明

- 首版不做 MCP。
- 首版不发布独立 CLI 包。
- Claude 侧优先使用仓库内置 plugin 包装层。
- Gemini CLI 可以直接消费 `.agents/skills`。
- Gemini CLI 请在“仓库内直接发现”和“全局 skills link/install”之间二选一，不要同时启用同名 skill。

## 仓库趋势

[![Star History Chart](https://api.star-history.com/svg?repos=realsee-developer/realsee-panorama-to-vr-skill&type=Date)](https://www.star-history.com/#realsee-developer/realsee-panorama-to-vr-skill&Date)
