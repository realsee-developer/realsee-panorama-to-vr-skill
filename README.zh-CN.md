# 全景图生成 VR Skillkit

[English](./README.md) | [简体中文](./README.zh-CN.md)

[![CI](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/ci.yml)
[![CodeQL](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml/badge.svg)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/actions/workflows/codeql.yml)
[![Latest Release](https://img.shields.io/github/v/release/realsee-developer/realsee-panorama-to-vr-skill?display_name=tag)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/releases)
[![License](https://img.shields.io/badge/License-Private-red)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/realsee-developer/realsee-panorama-to-vr-skill?style=social)](https://github.com/realsee-developer/realsee-panorama-to-vr-skill/stargazers)

`realsee-panorama-to-vr-skill` 是官方 `全景图生成 VR` 工作流的 GitHub 分发仓库，用来把一组本地全景图上传到 Realsee Open Platform，并生成可访问的 VR 空间。

已支持的 AI 宿主：

- Codex
- Claude Code
- Gemini CLI

## 推荐安装方式

如果你想用最快的公开安装入口，优先使用：

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

如果你需要固定版本、可复现安装，再改用 GitHub release tag。

## 从这里开始

| 你想做什么 | 先看这里 |
| --- | --- |
| 立即在本地跑通工作流 | [快速开始](#快速开始) |
| 安装到 AI 宿主里使用 | [docs/install-guides.md](./docs/install-guides.md) |
| 参与仓库开发和贡献 | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| 了解仓库结构和运行流程 | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| 给 AI 编码工具提供仓库规则 | [AGENTS.md](./AGENTS.md) |

## 仓库包含什么

- `.agents/skills/realsee-panorama-to-vr-skill/`
  canonical skill、运行时入口，以及面向 AI 工具的参考文档。
- `.claude-plugin/realsee-panorama-to-vr-skill/`
  由 canonical skill 同步生成的 Claude Code plugin 包装层。
- `examples/manifest-input/`
  可公开分发的样例全景图和示例 `manifest.json`。
- `scripts/`
  本地初始化、验证、安装、CI、发布辅助脚本。
- `docs/`
  面向 Codex、Claude Code、Gemini CLI 和维护者的文档。

## 快速开始

### 1. 准备凭证

你需要：

- `REALSEE_APP_KEY`
- `REALSEE_APP_SECRET`
- `REALSEE_REGION=global|cn`

注册入口：

- `REALSEE_REGION=cn`：前往 [my.realsee.cn](https://my.realsee.cn/?utm_source=github)
- `REALSEE_REGION=global`：前往 [my.realsee.ai](https://my.realsee.ai/?utm_source=github)
- 如果还不确定账号归属区：不要使用 [h5.realsee.com/vrapplink](https://h5.realsee.com/vrapplink) 判断地区。该页面用于下载 Realsee App。请先向账号持有人或 Realsee 支持确认账号归属区。

账号准备好后，发邮件至 [developer@realsee.com](mailto:developer@realsee.com?subject=%E5%85%A8%E6%99%AF%E5%9B%BE%E7%94%9F%E6%88%90%20VR%20%E6%8E%A5%E5%8F%A3%E8%83%BD%E5%8A%9B%E5%BC%80%E9%80%9A%E7%94%B3%E8%AF%B7&body=%E8%B4%A6%E5%8F%B7%E5%8F%AF%E7%94%A8%E5%8C%BA%EF%BC%9A%20%0AUserID%EF%BC%9A%20%0AIdentityID%EF%BC%9A%20%0A) 申请官方 `全景图生成 VR` 接口能力。邮件内请包含账号归属区、`UserID`、`IdentityID`。

### 2. 初始化本地环境

```bash
npm run setup:local
```

这个命令会：

- 安装仓库依赖
- 在缺失时从 `.env.example` 生成 `.env`
- 同步 Claude plugin 副本
- 校验 canonical skill 结构

随后把真实凭证填入 `.env`。

### 3. 自检环境

```bash
npm run doctor:local
```

这个检查会验证 Node/npm、必需文件、Claude plugin 校验、Gemini 发现路径冲突，以及 canonical skill 结构。

### 4. 运行公开样例

```bash
npm run run -- \
  --manifest ./examples/manifest-input/manifest.json \
  --images-dir ./examples/manifest-input/images \
  --workspace ./workspace \
  --json
```

仓库内置样例来自 Wikimedia Commons 的 CC0 公开数据，不包含客户真实数据。详见 [examples/SOURCES.md](./examples/SOURCES.md)。

## 支持的工作模式

### 仅图片目录

只提供 `--images-dir`。运行时会自动归一化图片、生成 `manifest.json`、打包 ZIP、提交任务并输出结构化结果。

```bash
npm run run -- \
  --images-dir /absolute/path/to/panoramas \
  --workspace ./workspace \
  --json
```

### Manifest 模式

当你需要明确控制命名、排序或楼层映射时，同时提供 `--manifest` 和 `--images-dir`。

### 恢复轮询

如果已经拿到 `task_code`，可以直接恢复远端任务轮询而不重复上传：

```bash
npm run run -- \
  --workspace ./workspace \
  --task-code your_task_code \
  --json
```

如果任务较长，不想一直占用前台终端：

```bash
npm run poll:bg -- --workspace ./workspace --task-code your_task_code
npm run poll:status -- --workspace ./workspace --task-code your_task_code
```

直接运行时还支持可选轮询参数：

- `--poll-interval-ms <ms>`
- `--poll-max-attempts <count>`

运行时会拒绝未知 flag 和意外的位置参数，避免因为命令拼写错误而静默回退到默认行为。

## 输出约定

每次运行都会在 `--workspace` 下创建独立工作目录，并产出：

- `state.json`
- `result.json`

`result.json` 固定包含：

- `status`
- `project_name`
- `task_code`
- `project_id`
- `vr_url`
- `workspace_dir`

## 安装到 AI 宿主

- Codex: [docs/codex.md](./docs/codex.md)
- Claude Code plugin: [docs/claude-plugin.md](./docs/claude-plugin.md)
- Gemini CLI: [docs/gemini-cli.md](./docs/gemini-cli.md)
- 宿主选择总览: [docs/install-guides.md](./docs/install-guides.md)

## 开发与维护文档

- 贡献流程: [CONTRIBUTING.md](./CONTRIBUTING.md)
- 架构与 source of truth 说明: [ARCHITECTURE.md](./ARCHITECTURE.md)
- 面向 AI 编码工具的仓库说明: [AGENTS.md](./AGENTS.md)
- 公开分发清单: [docs/public-distribution.md](./docs/public-distribution.md)
- Release 流程: [docs/releases.md](./docs/releases.md)
- 支持策略: [SUPPORT.md](./SUPPORT.md)
- 安全策略: [SECURITY.md](./SECURITY.md)

## 发布与分发

- `main` 是持续开发集成分支。
- 稳定安装应固定到 Git tag 或 GitHub Release，例如 `v1.0.3`。
- `skills.sh` 负责发现，GitHub Release 仍然是可复现安装来源。

推荐公开安装命令：

```bash
npx skills add realsee-developer/realsee-panorama-to-vr-skill
```

需要固定版本时使用 release tag；需要公开发现页和一条命令安装入口时使用 `skills.sh`。

## 说明

- 本仓库不提供 MCP server。
- 本仓库不发布独立 CLI 包。
- 面向人类的术语统一使用 `全景图生成 VR`；仓库名、skill id、命令路径继续保持 `realsee-panorama-to-vr-skill`。
- canonical skill 在 `.agents/skills/realsee-panorama-to-vr-skill/`，Claude plugin 副本不是 source of truth。

## 仓库趋势

[![Star History Chart](https://api.star-history.com/image?repos=realsee-developer/realsee-panorama-to-vr-skill&type=Date)](https://www.star-history.com/#realsee-developer/realsee-panorama-to-vr-skill&Date)
