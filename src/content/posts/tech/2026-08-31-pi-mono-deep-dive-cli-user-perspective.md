---
title: "pi-mono 深度導讀 1：從 CLI 使用者角度認識 pi——安裝、模式、Session、模型切換與訊息插隊"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, session-management, ollama]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 1
tldr: "把 pi 當黑盒用：4 種運行模式怎麼切、Session 樹狀結構怎麼存、怎麼在對話中途換模型、Enter vs Alt+Enter 訊息插隊差異、/tree 怎麼跳回歷史分支。為後續架構篇建立直覺。"
description: "從使用者視角完整走過 pi CLI 體驗：安裝方式、Interactive/Print/JSON/RPC/SDK 五種模式、Session 持久化與分支、模型切換熱鍵、訊息插隊機制、tree 導航、匯出 HTML 與分享 gist。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-cli-user-perspective-en)

## TL;DR

- **安裝**：`npm i -g @earendil-works/pi-coding-agent` 或 `ollama launch pi`
- **5 模式**：Interactive（預設）、Print、JSON、RPC、SDK——同一套核心，不同介面
- **Session**：JSONL 存 `~/.pi/agent/sessions/`，樹狀結構支援分支、回溯、fork
- **模型切換**：`/model`、`Ctrl+L` 選單、`Ctrl+P` 循環常用模型，Session 中途可換
- **訊息插隊**：`Enter` = steering（當前工具跑完插入）、`Alt+Enter` = follow-up（等做完）
- **導航**：`/tree` 視覺化分支、跳回任意節點續接；`/export` 輸出 HTML、 `/share` 上傳 gist

---

## 安裝與首次啟動

```bash
# npm 全域安裝（建議）
npm install -g @earendil-works/pi-coding-agent

# 或用 Ollama 一鍵啟動（會自動拉模型）
ollama launch pi

# 確認版本
pi --version
# @earendil-works/pi-coding-agent@0.x.x
```

> **套件與 repo 已改名**：npm scope 從 `@mariozechner` → `@earendil-works`，GitHub 從 `badlogic/pi-mono` → `earendil-works/pi`。既有安裝可跑 `pi update --self` 自動遷移。

首次啟動進入 **Interactive 模式**（TUI）：

```
$ pi
╭────────────────────────────────────────────────────────────╮
│  pi 0.x.x  •  Session: a1b2c3d4  •  Model: anthropic/claude-3-5-sonnet-20241022 │
├────────────────────────────────────────────────────────────┤
│  > 你的提示詞...                                              │
╰────────────────────────────────────────────────────────────╯
```

---

## 五種運行模式：同一核心，不同介面

| 模式 | 觸發方式 | 用途 | 輸出 |
|---|---|---|---|
| **Interactive** | `pi`（無參數） | 日常開發、長對話 | TUI、即時渲染、鍵盤綁定 |
| **Print** | `pi -p "prompt"` | 單輪問答、腳本嵌入 | 純文字、stdout 直接印出 |
| **JSON** | `pi --json -p "prompt"` | 程式整合、CI/CD | JSON 物件、含 metadata、tool calls |
| **RPC** | `pi --rpc` | 長連線、IDE 整合、Daemon | JSON-RPC 2.0 over stdin/stdout |
| **SDK** | `import { createAgentSession } from '@earendil-works/pi-coding-agent'` | 嵌入自有應用 | 完整程式化控制 |

### Print 模式範例

```bash
# 單輪問答，適合管線
pi -p "用繁體中文解釋什麼是 async/await" --model ollama:qwen3:1.7b

# 指定輸出格式
pi --json -p "列出 3 個 TypeScript utility type" | jq '.result'
```

### JSON 模式輸出結構

```json
{
  "sessionId": "a1b2c3d4",
  "model": "anthropic/claude-3-5-sonnet-20241022",
  "result": "Async/await 是...",
  "toolCalls": [],
  "usage": { "inputTokens": 42, "outputTokens": 156 },
  "stopReason": "end_turn"
}
```

### RPC 模式：給 IDE/外掛用

```bash
# 啟動 RPC server（stdin/stdout）
pi --rpc

# 客戶端發送 JSON-RPC 2.0 請求
{"jsonrpc":"2.0","id":1,"method":"prompt","params":{"text":"hello"}}
# 回應流式事件
{"jsonrpc":"2.0","method":"event","params":{"type":"message_start",...}}
```

> **架構預覽**：這 5 模式共用同一個 `AgentSession` 核心（`packages/coding-agent/src/core/sdk.ts`），差別只在 `runPrintMode`、`runRpcMode`、`InteractiveMode` 如何包裝事件流。

---

## Session：不只是歷史紀錄，是可編輯的樹

### 存在哪裡

```
~/.pi/agent/sessions/
└── --your-project-path--/
    ├── 2026-08-31T10-30-00_a1b2c3d4.jsonl   # 最新 session
    └── 2026-08-30T14-22-11_e5f6g7h8.jsonl   # 昨天的 session
```

- **格式**：JSONL（每行一個 entry），append-only
- **命名**：`ISO8601_timestamp_sessionId.jsonl`
- **編碼**：目錄名把 `cwd` 用 `--` 包起來、路徑分隔符換成 `-`

### Entry 類型一覽

| Entry Type | 用途 | 進 LLM Context？ |
|---|---|---|
| `message` | user/assistant/toolResult | ✅ |
| `thinking_level_change` | 思考等級切換 | ✅ (via context settings) |
| `model_change` | 模型切換記錄 | ✅ (via context settings) |
| `compaction` | 摘要壓縮點 | ✅ (代表被摘要的歷史) |
| `branch_summary` | 分支摘要 | ✅ |
| `custom_message` | Extension 注入訊息 | ✅ |
| `custom` | Extension 內部狀態 | ❌ |
| `label` | 使用者書籤 | ❌ |
| `session_info` | 顯示名稱 | ❌ |

### 樹狀結構：Branch、Reset、Fork

```bash
# 在 TUI 裡
/tree          # 顯示分支樹，可用 ↑↓ 選擇節點、Enter 跳回續接
/branch        # 從當前位置建立新分支（不改歷史）
/reset         # 回到根節點（重寫第一條 user message）
/fork          # 複製整個 session 到新檔案（可跨專案）
```

**關鍵觀念**：Session 是 **append-only tree**。每次 append 都建立 child of current leaf。`/branch` 只是移動 leaf pointer 到舊節點，下一條訊息就成了新分支。歷史**完全不刪不改**。

---

## 模型切換：Session 中途熱插拔

pi 支援 15+ 供應商：**Anthropic、OpenAI、Google、Azure、Bedrock、Mistral、Groq、Cerebras、xAI、Hugging Face、Kimi、MiniMax、NVIDIA、OpenRouter、Ollama**。

### 三種切換方式

```bash
# 1. 指令選單（可搜尋、分組顯示）
/model

# 2. 快捷鍵選單（Ctrl+L）
# 3. 循環常用模型（Ctrl+P）
```

### 實測：對話中途換模型

```
> 用 Python 寫一個快速排序
# ... Claude 3.5 Sonnet 回覆 ...

> /model 切換到 ollama:qwen3:1.7b
Model switched to ollama:qwen3:1.7b

> 現在用 Rust 重寫剛才那個
# ... Qwen3 1.7B 繼承上下文繼續 ...
```

**底層機制**：切換時會在 session 寫入 `model_change` entry，`buildSessionContext()` 讀取最新的 model 設定傳給下一輪 LLM 呼叫。System prompt、tools、歷史訊息**完全保留**。

---

## 訊息插隊：Steering vs Follow-up

這是 pi 最獨特的互動設計——**Agent 工作時你仍可送訊息**：

| 按鍵 | 名稱 | 時機 | 適用場景 |
|---|---|---|---|
| `Enter` | **Steering** | 當前 tool 執行完、下一輪 LLM 呼叫前 | 「先別跑那個指令」、「改成用 grep 找」、「補充條件」 |
| `Alt+Enter` | **Follow-up** | 整個 turn 結束（agent 判斷應停止時） | 「做完後幫我測試」、「接著做下一步」 |

### 視覺化時序

```
Agent 狀態:  [Thinking] → [Tool: bash] → [Thinking] → [Tool: edit] → [Thinking] → [Done]
                    ↑                          ↑
                Steering 插入             Steering 插入
                (下一輪前)                 (下一輪前)
                                                             ↑
                                                     Follow-up 插入
                                                     (Agent 判定結束後)
```

**架構預覽**：對應 `AgentLoopConfig.getSteeringMessages()`（steering）與 `getFollowUpMessages()`（follow-up），在 `agent-loop.ts` 的雙層 while 迴圈中分別處理。

---

## 實用指令速查表

| 指令 | 功能 | 關鍵參數 |
|---|---|---|
| `/model` | 切換模型 | 可輸入關鍵字過濾 |
| `/tree` | 顯示分支樹 | Enter 跳回、空白展開/收合 |
| `/branch` | 從當前節點分支 | 可加 summary 總結舊路徑 |
| `/compact` | 手動觸發 compaction | 壓縮舊對話節省 token |
| `/export` | 匯出 HTML | `--file path.html` |
| `/share` | 上傳 gist 分享 | 需 GitHub token |
| `/session` | 列出/切換 session | `new`、`resume <id>`、`list` |
| `/settings` | 設定面板 | Theme、Keybindings、Tools、Trust |
| `/help` | 所有指令與快捷鍵 | 分類顯示 |

### 快捷鍵重點

| 快捷鍵 | 動作 |
|---|---|
| `Ctrl+L` | 模型選單 |
| `Ctrl+P` | 循環常用模型 |
| `Ctrl+O` | 開啟檔案（fuzzy search） |
| `Ctrl+R` | 歷史指令搜尋 |
| `Alt+Enter` | Follow-up 訊息 |
| `Escape` | 中斷當前生成/工具 |
| `Tab` | 自動完成（指令、檔案、模型） |

---

## 本地模型：Ollama 整合實測

pi 對小模型特別友善——**極短 system prompt + 4 工具 = 低 token 消耗**。

```bash
# 拉模型
ollama pull qwen3:1.7b
ollama pull gemma2:2b

# 指定本地模型啟動
pi -p "用繁體中文說 hello world" --model ollama:qwen3:1.7b

# 或在 Interactive 模式裡 /model 選 Ollama 群組
```

| 場景 | 建議模型層級 | 實測可用模型 |
|---|---|---|
| 輕量使用（讀檔、改小 bug） | 1.7B~2B | Qwen3:1.7B、Gemma2:2B |
| 一般開發（重構、寫測試） | 7B~8B | Qwen2.5:7B、Llama3.1:8B |
| 複雜任務（架構設計、多檔協作） | 旗艦級 | Claude 3.5 Sonnet、GPT-4o、Opus |

> **為什麼小模型能跑？** Pi 的 system prompt 約 300 tokens（Claude Code 數千），工具只有 4 個，prompt cache 命中率極高。這是「功能齊全 harness」做不到的。

---

## 動手實驗：建立你的第一個 Session 樹

```bash
# 1. 進入有 Git repo 的專案目錄
cd your-project

# 2. 啟動 pi
pi

# 3. 送幾個提示詞建立主線
> 幫我加一個 README.md
> 現在把 main function 抽出來成單獨模組

# 4. 用 /tree 看樹狀結構
/tree
# 選擇第一個 user message → Enter 跳回

# 5. 在分支點送新訊息（自動建立分支）
> 其實先寫測試再重構

# 6. 再次 /tree 看分支
# 現在有兩條路徑，可隨意跳轉

# 7. 匯出 HTML 留存
/export --file session-review.html

# 8. 分享給同事
/share
# 輸出 gist URL
```

---

## 參考資料

- [Pi 官方網站 pi.dev — CLI 文件與指令參考](https://pi.dev/docs/latest)
- [GitHub - earendil-works/pi — 原始碼：packages/coding-agent/src/cli.ts](https://github.com/earendil-works/pi/tree/main/packages/coding-agent/src)
- [Pi 作者部落格：打造極簡 coding agent 的心得 — Interactive 模式設計](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Ollama 官方模型庫 — 適合 pi 的小型模型](https://ollama.com/search)
- [舊版 Pi 介紹文：4 模式、擴充機制、TUI 引擎](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness)

---

## 下一篇預告

> **第 2 篇：Monorepo 架構與核心抽象層**
>
> 7 個套件怎麼分工？為什麼依賴單向流動？`pi-ai`、`pi-agent-core`、`pi-coding-agent`、`pi-tui`、`pi-telemetry`、`pi-client/server/protocol` 各自負責什麼？從「使用者看得到的」進入「看不到的架構決策」。