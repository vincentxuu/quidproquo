---
title: "OpenClaw 參考篇：Pi 整合與設定參考"
date: 2026-03-28
category: ai
tags: [openclaw, pi, reference, configuration, features, architecture]
lang: zh-TW
tldr: "Pi 是 OpenClaw 內嵌的 coding agent runtime，OpenClaw 是 Pi 的 Gateway 殼。設定參考覆蓋 16 個頂層區塊、335 個文件。"
description: "OpenClaw 與 Pi 的整合架構、功能完整列表、以及設定參考速查。"
draft: false
---

OpenClaw 的 AI 核心是 Pi（一個 coding agent runtime）。OpenClaw 負責頻道、路由、安全，Pi 負責推理、工具執行、記憶。這篇整理兩者的關係和設定參考。

## OpenClaw 與 Pi 的關係

| 層 | 負責者 | 功能 |
|---|---|---|
| Gateway | OpenClaw | 頻道管理、路由、認證、排程 |
| Agent Runtime | Pi | 推理、工具執行、context 管理 |
| Session | 共管 | OpenClaw 擁有 session，Pi 執行 agent loop |
| Memory | Pi | Markdown 檔案、vector search |
| Compaction | Pi | Context window 壓縮 |
| Sandbox | 共管 | OpenClaw 管理容器，Pi 在裡面執行 |

Pi 的設定透過 OpenClaw 的 `agents.defaults` 和 `agents.list[]` 傳遞。

## 功能完整列表

### 核心

| 功能 | 說明 |
|---|---|
| Multi-agent routing | 多 agent 路由（binding 優先順序） |
| Delegate architecture | 3 層自主授權 |
| Agent loop | intake → context → inference → tool → stream |
| Block streaming | chunking（minChars/maxChars） |
| 5 種 queue mode | steer/followup/collect/steer-backlog/interrupt |

### 模型

| 功能 | 說明 |
|---|---|
| 35+ providers | Anthropic/OpenAI/Google + 本地（Ollama/vLLM） |
| Auth profile rotation | Cooldown escalation |
| Model failover | Auth → Model → Thinking degradation |
| Prompt caching | cacheRetention (none/short/long) |
| Token tracking | 10 種成本來源 |

### Session & Memory

| 功能 | 說明 |
|---|---|
| 4 種 DM scope | main/per-peer/per-channel-peer/per-account-channel-peer |
| Identity links | 跨平台同一人 |
| Memory flush | Compaction 前自動寫磁碟 |
| Vector search | BM25 + embedding 混合搜尋 |
| Context Engine | 可插拔（ingest/assemble/compact/after-turn） |

### 安全

| 功能 | 說明 |
|---|---|
| 3 種沙箱後端 | Docker/SSH/OpenShell |
| 3 層控制 | Sandbox/Tool Policy/Elevated |
| MITRE ATLAS 威脅模型 | 13 個威脅場景 |
| TLA+ 形式驗證 | 6+ 安全聲明 |
| SecretRef | env/file/exec 三種來源 |

### 頻道

| 功能 | 說明 |
|---|---|
| 24+ 頻道 | 同時運行 |
| Pairing | 8 字元碼，1 小時過期 |
| Broadcast Groups | 多 agent 同時處理 |
| Channel routing | 確定性回覆到來源 |

### 工具

| 功能 | 說明 |
|---|---|
| Browser | Managed profile + 遠端 CDP |
| Exec | 3 種安全等級 + approval |
| Skills | 6 層優先順序 + ClawHub |
| Sub-agent | 最大 5 層巢狀 |
| Lobster | 確定性工作流 runtime |
| TTS | 3 家 provider |
| PDF | Native + extraction |

### 自動化

| 功能 | 說明 |
|---|---|
| Cron | 精確排程 + 隔離 session |
| Heartbeat | 定期巡檢 |
| Webhook | 外部事件觸發 |
| Standing Orders | 永久授權程式 |

### UI & Nodes

| 功能 | 說明 |
|---|---|
| Control UI | 瀏覽器 dashboard |
| TUI | 終端互動 |
| Web Chat | WebSocket 即時聊天 |
| iOS/Android Node | Camera/Canvas/Location/SMS |
| Node Host | 遠端 exec |

## 設定結構速查

```json5
{
  agents: {           // Agent 設定（defaults + list）
    defaults: {
      workspace: "",
      sandbox: {},
      heartbeat: {},
      compaction: {},
      models: {}
    },
    list: []
  },
  channels: {},       // 頻道設定（per-channel）
  commands: {},       // Slash commands 設定
  gateway: {          // Gateway 設定
    bind: "",
    port: 0,
    auth: {},
    tailscale: {},
    controlUi: {}
  },
  hooks: {},          // Webhook 設定
  mcp: {},            // MCP Server 設定
  messages: {},       // 訊息設定（TTS、formatting）
  models: {},         // 模型 provider 設定
  plugins: {},        // Plugin 設定
  secrets: {},        // SecretRef provider 設定
  session: {},        // Session 設定（dmScope、maintenance）
  skills: {},         // Skills 設定
  tools: {}           // 工具設定（exec、browser、web search）
}
```

## CLI 速查

### Gateway

```bash
openclaw gateway              # 啟動 Gateway
openclaw health               # 健康檢查
openclaw doctor               # 診斷
openclaw doctor --fix         # 自動修復
```

### 設定

```bash
openclaw config get <path>    # 讀取
openclaw config set <path> <value>  # 設定
openclaw config validate      # 驗證
openclaw onboard              # 互動式設定
```

### 模型

```bash
openclaw models status        # 認證狀態
openclaw models auth login    # 登入
openclaw models auth setup-token  # Setup token
```

### 頻道

```bash
openclaw channels status      # 頻道狀態
openclaw channels login       # 頻道登入
openclaw channels add         # 新增頻道
openclaw pairing list         # 配對列表
openclaw pairing approve      # 核准配對
```

### 自動化

```bash
openclaw cron add             # 新增 cron
openclaw cron list            # 列出 cron
openclaw cron remove          # 移除 cron
```

### Nodes

```bash
openclaw devices list         # 列出裝置
openclaw devices approve      # 核准裝置
openclaw nodes status         # Node 狀態
openclaw node run             # 啟動 node host
```

### 沙箱

```bash
openclaw sandbox explain      # 查看設定
openclaw sandbox recreate     # 重建沙箱
openclaw sandbox list         # 列出沙箱
```

### Plugin

```bash
openclaw plugins install      # 安裝
openclaw plugins list         # 列出
openclaw plugins status       # 狀態
```

## 整體來說

這篇是整個系列的參考索引。OpenClaw 的功能覆蓋面很廣——從 24+ 頻道到 35+ 模型供應商，從沙箱到形式驗證，從 Skills 市場到確定性工作流。大部分人只需要用到其中 20% 的功能，但知道有什麼可用是重要的。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/reference/pi.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/pi.md) — Pi 整合
- [docs/concepts/features.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/features.md) — 功能列表
- [docs/concepts/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md) — 架構
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration-reference.md) — 設定參考
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/main/docs/cli/index.md) — CLI 總覽
