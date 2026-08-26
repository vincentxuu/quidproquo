---
title: "Headless 與 Agent SDK：從 claude -p 到程式化 agent"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, headless, agent-sdk, cli, automation, scripting]
lang: zh-TW
tldr: "claude -p 把 Claude Code 從終端機互動變成一條可寫進腳本和 CI 的指令：pipe 資料進去、用 --output-format json 拿結構化結果、--bare 跳過所有自動載入加速啟動。本文以 CLI 用法為主體，最後講四個該改用 Python／TypeScript Agent SDK 的訊號。"
description: "Claude Code headless 模式介紹：claude -p 基本用法、text/json/stream-json 三種輸出格式、--bare 與常用旗標組合、CI 實戰，以及何時該從 CLI 升級到 Agent SDK。"
draft: true
series:
  name: "Claude Code 深入介紹"
  order: 18
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide-en)

[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)講過，Claude Code 的本質是一個 agentic loop。平常你在終端機跟它一來一往，loop 由你手動推進；但很多時候你不想坐在終端機前——你想讓它跑完一批 lint 修正、在 CI 裡審查每個 PR、把 build log 餵給它換一份人話解釋。這些場景用的是同一套工具和 loop，只是拿掉了互動介面：加一個 `-p` 旗標，Claude Code 就從對話工具變成 Unix 管線裡的一個元件。

官方文件現在把這條路徑定位成 **Agent SDK 的入口**：CLI 的 `claude -p` 是起點，需求長大之後換成 Python 或 TypeScript SDK。這篇的主體是 CLI——多數自動化需求其實到 CLI 就結束了——最後才講什麼時候該離開。

## Headless 跟互動模式差在哪

差別不在能力，在介面。`claude -p "prompt"` 執行完就退出，不開 TUI、不等你打字；成功退出碼 0，失敗非零，所以 shell script 可以直接用 `$?` 分流。它能做的事跟互動模式相同：讀檔、跑指令、用 MCP server——因為底下是同一個 loop。

兩個行為差異要記住：

- **權限預設 Manual**。`-p` session 不會跳出權限詢問視窗，內建的起始權限模式在所有方案上都是 Manual，沒被核准的動作會直接被擋下。想讓它放手做事要用 `--allowedTools` 或 `--permission-mode` 明確授權。
- **不會載入你不想要的東西**（如果你叫它不要）。這就是下一節的 `--bare`。

## 基本用法與輸出格式

最基本的呼叫：

```bash
claude -p "What does the auth module do?"
```

非互動模式也吃 stdin，所以可以像其他命令列工具一樣接管線：

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

管線輸入上限 10MB，更大的內容請寫進檔案再讓它讀路徑。

`--output-format` 有三種選擇：

| 格式 | 內容 | 適合 |
|------|------|------|
| `text`（預設） | 純文字 | 人要看、或下游只需要一段說明 |
| `json` | 一個 JSON 物件：`result`、`session_id`、用量與成本等 metadata | 腳本要解析結果或追蹤花費 |
| `stream-json` | 每行一個 JSON event | 即時處理 token 或監看每一步 |

`json` 格式的回應含 `total_cost_usd` 和各模型成本拆分——注意這是客戶端估計值，可能跟帳單有出入，但讓腳本能逐次追蹤花費。要強制結構化輸出，加上 `--json-schema`：

```bash
claude -p "Extract the main function names from auth.py" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

結果落在 `structured_output` 欄位，schema 不合法會直接報錯退出而不是默默回純文字。搭配 jq 抽欄位：

```bash
claude -p "Summarize this project" --output-format json | jq -r '.result'
```

要即時串流就上 `stream-json`，需要同時開 `--verbose` 和 `--include-partial-messages`：

```bash
claude -p "Explain recursion" --output-format stream-json --verbose --include-partial-messages
```

每一行是一個 event，最後一行是帶著最終結果與成本的 `result` message。用 jq 過濾出文字 delta 就能得到持續輸出的 token 流：

```bash
claude -p "Write a poem" --output-format stream-json --verbose --include-partial-messages | \
  jq -rj 'select(.type == "stream_event" and .event.delta.type? == "text_delta") | .event.delta.text'
```

## 常用旗標組合

**`--bare`：腳本與 CI 的建議模式。** 平常的 `-p` 會像互動 session 一樣載入 hooks、skills、自訂指令、subagents、外掛、MCP servers、auto memory 和 CLAUDE.md——在你自己的機器上這是功能，在 CI runner 上是不可控的變數。`--bare` 全部跳過，啟動更快、每台機器行為一致：

```bash
claude --bare -p "Summarize README.md" --allowedTools "Read"
```

代價是要自己補 context：系統提示用 `--append-system-prompt`、設定用 `--settings`、MCP servers 用 `--mcp-config`、subagents 用 `--agents <json>`。另外 bare 模式不讀 OAuth 登入，必須設 `ANTHROPIC_API_KEY`。官方文件明講：`--bare` 是腳本與 SDK 呼叫的建議模式，未來會變成 `-p` 的預設。

**`--allowedTools`：精準授權。** 讓特定工具免詢問，規則語法支援前綴匹配——`Bash(git diff *)` 允許任何 `git diff` 開頭的指令（星號前的空格是語法的一部分）：

```bash
claude -p "Look at my staged changes and create an appropriate commit" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

不想逐一列工具，就用 `--permission-mode` 定基調：`acceptEdits` 自動接受檔案編輯、`dontAsk` 只准 allow 清單和唯讀指令集（適合鎖死的 CI）、`auto` 交給背景分類器審查大多數動作。

**`--max-turns`：設停損點。** 限制 agentic turns 數，達上限即報錯退出，預設無上限。批次跑不可信的任務時，這是防止 agent 無限迴圈燒錢的保險絲：

```bash
claude -p --max-turns 10 "Fix all ESLint errors in src/"
```

**`--continue` 與 `--resume`：跨次延續對話。** headless 不是只能一次性呼叫：

```bash
session_id=$(claude -p "Start a review" --output-format json | jq -r '.session_id')
claude -p "Continue that review" --resume "$session_id"
```

`--continue` 接最近一次對話，`--resume` 按 session ID 接指定對話，而且兩個指令可以在不同目錄跑（v2.1.223 起）。這已經摸到「多輪狀態管理」的邊了——後面會回到這件事。

## 放進腳本和 CI

組合起來，headless 最自然的家是 build 腳本和 CI pipeline。官方文件的例子是把 diff 對 main pipe 進去當 typo linter：

```json
{
  "scripts": {
    "lint:claude": "git diff main | claude -p \"you are a typo linter. for each typo in this diff, report filename:line on one line and the issue on the next. return nothing else.\""
  }
}
```

pipe diff 而不是讓它自己跑 git，連 Bash 權限都省了。GitHub Actions 上的完整整合——包括 `claude setup-token` 產生長期 token、annotation 回寫 PR——在[GitHub Actions 篇](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions)展開；定時任務（cron 加 `claude -p`）則見[排程自動化主篇](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide)。

幾個 CI 特有的細節：SIGTERM 中止的 run 以退出碼 143 結束且該 turn 不記結果，process supervisor 要靠退出碼判斷成敗時留意；run 結束後背景 Bash 任務（dev server、watch build）約五秒後被砍掉；`system/init` event 的 `mcp_server_errors` 和 `plugin_errors` 欄位可以用來在 CI 裡擋掉「server 根本沒載起來」的假綠燈。

## 什麼時候該離開 CLI，改用 Agent SDK

CLI 能做的比多數人以為的多，先別急著升級。但官方文件畫了一條清楚的線：SDK 目前只有 Python 和 TypeScript 版本，其他語言想驅動同一個 agent loop，官方建議就是用子行程跑 CLI。反過來說，如果你的宿主環境剛好是 Python 或 TypeScript，出現以下四個訊號就該換 SDK：

1. **多輪 session 管理**。用 `--resume` 加 shell 變數管理對話狀態，撐得過兩三輪；要在應用程式裡長期維護數百個 session、隨時 fork 和恢復，SDK 的 Sessions API 是為此設計的。
2. **即時 streaming**。CLI 的 `stream-json` 是「你自己解析 NDJSON」；SDK 提供原生的 callback 與 message 物件，token 事件直接進你的程式。
3. **型別安全的 structured output**。`--json-schema` 回 JSON，解析和驗證自己做；SDK 直接回 native 物件，TypeScript 下有完整型別。
4. **in-process custom tools 與 hooks**。想在 tool approval 上掛自己的 callback、把自家函式直接註冊成工具讓 loop 呼叫，這類深度客製化在 SDK 裡是一等公民，CLI 只能靠 `--mcp-config` 和 `--agents <json>` 從外面塞。

一句話判斷：**腳本消費結果，用 CLI；你的程式碼就是 agent 的宿主，用 SDK。**

## 往深水區走

Agent SDK 本身夠寫一整個系列，這裡不展開。要往下挖，直接讀官方章節：

- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)——能力總覽，以及 Agent SDK、CLI、Client SDK、Managed Agents 四者的定位比較
- [Python SDK](https://code.claude.com/docs/en/agent-sdk/python) 與 [TypeScript SDK](https://code.claude.com/docs/en/agent-sdk/typescript)——完整 API 參考
- [Quickstart](https://code.claude.com/docs/en/agent-sdk/quickstart)——第一個找 bug 修 bug 的 SDK agent

## 參考資料

- [Run Claude Code programmatically（Headless）— Claude Code Docs](https://code.claude.com/docs/en/headless) — `claude -p` 官方主頁：基本用法、bare mode、structured output、streaming、continue conversations、SIGTERM 行為
- [CLI reference — Claude Code Docs](https://code.claude.com/docs/en/cli-reference) — `-p` 相關旗標完整清單：`--output-format`、`--json-schema`、`--max-turns`、`--include-partial-messages`、`--input-format` 等
- [Agent SDK overview — Claude Code Docs](https://code.claude.com/docs/en/agent-sdk/overview) — SDK 定位、與 CLI／Client SDK／Managed Agents 的比較、「其他語言用 subprocess 跑 CLI」的官方建議

## 更新紀錄

- 2026-08-26：初版，依 2026-08 官方文件（headless、cli-reference、agent-sdk overview）撰寫。
