---
title: "Claude Code Remote Control：用手機繼續本地開發 Session"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, remote-control, mobile, cross-device, dx]
lang: zh-TW
tldr: "Remote Control 讓你從手機、平板或任何瀏覽器繼續本地跑的 Claude Code session。程式碼在你的電腦上執行，MCP servers 和本地工具全都可用。支援 QR code 快速連線，多裝置同步對話。"
description: "介紹 Claude Code 的 Remote Control 功能：連線方式（server mode / interactive / 既有 session）、安全機制、與 Claude Code on the web 的差異，以及 Dispatch、Channels、Slack 等遠端工作方式的比較。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 22
---

🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en)

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/remote-control.md -->

## 預計大綱

### Remote Control 是什麼
- 從手機/平板/其他電腦繼續本地 session
- Claude 在你的電腦上執行（不是雲端）
- 本地 MCP servers、工具、專案設定全部可用
- 多裝置同步：terminal + 瀏覽器 + 手機可交替操作

### 三種啟動方式

#### Server Mode
```bash
claude remote-control
```
- 專用 server 模式，等待遠端連線
- `--name`、`--spawn`（same-dir / worktree）、`--capacity`

#### Interactive Session
```bash
claude --remote-control
```
- 正常互動 session + 遠端可控
- 本地和遠端都可以打字

#### 從既有 Session
```
/remote-control
```
- 帶著完整對話歷史繼續

### 連線方式
- Session URL 直接開啟
- QR code（手機掃描）
- claude.ai/code 或 Claude app 找到 session

### 安全機制
- 只有 outbound HTTPS，不開 inbound port
- 所有流量經過 Anthropic API over TLS
- 多個短期 credentials，各自獨立過期

### vs Claude Code on the web
| | Remote Control | Claude Code on the web |
|---|---|---|
| 執行在 | 你的電腦 | Anthropic 雲端 |
| 本地檔案 | ✅ | ❌（每次 fresh clone）|
| MCP servers | ✅ | ❌ |
| 適合 | 繼續進行中的本地工作 | 不需要本地環境的獨立任務 |

### 五種遠端工作方式比較
| 方式 | 觸發 | Claude 跑在 | 適合 |
|------|------|-------------|------|
| Dispatch | 手機 Claude app | Desktop | 離開後交代任務 |
| Remote Control | claude.ai/code 或手機 | 你的電腦 CLI | 操控進行中的工作 |
| Channels | Telegram/Discord/iMessage | 你的電腦 CLI | 回應外部事件 |
| Slack | @Claude | Anthropic 雲端 | 從團隊對話啟動 |
| Scheduled Tasks | Cron | 雲端或本地 | 定期自動化 |

## 參考資料

- [Claude Code Remote Control — 官方文件](https://docs.anthropic.com/en/docs/claude-code/remote-control) — Remote Control 的完整設定說明，含連線方式、安全機制與 troubleshooting
- [Claude Code on the Web — 官方文件](https://docs.anthropic.com/en/docs/claude-code/claude-code-on-the-web) — Claude Code 雲端版說明，可與 Remote Control 對比使用情境
- [Claude Code CLI Reference — remote-control 指令](https://docs.anthropic.com/en/docs/claude-code/cli-reference) — claude remote-control 的所有 flags，含 --name、--spawn、--capacity
- [Claude Code in Slack — 官方文件](https://docs.anthropic.com/en/docs/claude-code/slack) — 從 Slack 遠端啟動任務的另一種方式
- [Claude Code Channels — 官方文件](https://docs.anthropic.com/en/docs/claude-code/channels) — 透過 Telegram、Discord 等外部訊息觸發本地 Claude Code session
- [Claude iOS/Android App](https://claude.ai/download) — 用手機控制 Remote Control session 所需的 Claude mobile app
- [Claude Code Scheduled Tasks](https://docs.anthropic.com/en/docs/claude-code/scheduled-tasks) — 定期自動化任務的設定方式，可搭配遠端工作流程
