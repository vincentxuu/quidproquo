---
title: "Claude Code Sub-agents 怎麼運作：context 隔離、frontmatter 定義、背景執行與權限繼承"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, sub-agent, ai-agent, dx]
lang: zh-TW
tldr: "Sub-agent 是在獨立 context window 中工作的專業助手：一個 Markdown 檔定義 system prompt、工具與模型，Claude 依 description 自動委派，也能 @-mention 直接指派。本文拆解 frontmatter schema、背景執行與巢狀 spawn 的現狀、permission 繼承規則，以及什麼時候不該用。"
description: "深入介紹 Claude Code 的 Sub-agent 機制：內建 agent 清單、自訂 frontmatter 欄位、委派觸發方式、背景執行與三層巢狀 spawn、權限繼承與成本考量，依官方文件整理。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 15
---

> 🌏 [English version](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en)

[系列入口篇](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works)把 subagents 一筆帶過：「開新的 context window 分擔工作」。這篇展開講這句話背後的機制——它怎麼定義、怎麼被觸發、跑在哪裡、能用什麼工具。

## 解決的問題：context 隔離

一個 agent session 最貴的資源是 context window。搜 codebase、讀文件、翻 log 這類任務會產生大量中間輸出，讀完一次就不會再引用，卻永久佔住主對話的空間。

Sub-agent 的做法是把這類工作整包丟進一個**全新的 context window**：它拿到自己的 system prompt 和一段任務描述，自己讀檔案、跑指令，過程中的所有輸出都留在它的視窗裡，最後只有總結和一小段 metadata trailer 回傳主對話。官方文件的 context window 視覺化頁給了具體數字：subagent 讀了 6,100 tokens 的檔案內容，回傳主對話的只有一份 420 tokens 的結果。

不是所有東西都被隔離。非 fork 的 subagent 啟動時會載入：自己的 system prompt、Claude 寫的任務訊息、每一層 CLAUDE.md、父 session 開頭的 git status 快照。內建的 Explore 和 Plan 是例外——為了讓研究又快又便宜，這兩個會跳過 CLAUDE.md 和 git status。如果某條規則一定要讓 Explore 知道（例如「忽略 vendor/ 目錄」），要寫進委派時的 prompt。細節可搭配[context window 管理](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management)一起看。

## 內建清單與自訂方式

內建 subagent 不多：

| Agent | 模型 | 工具 | 用途 |
|-------|------|------|------|
| **Explore** | 繼承主對話（Claude API 上上限 Opus） | 唯讀 | 搜尋、分析 codebase |
| **Plan** | 繼承主對話 | 唯讀 | plan mode 時的研究 |
| **General-purpose** | 繼承主對話 | 全部 | 探索加修改的多步驟任務 |
| 其他輔助 | 各異 | 受限 | `claude`（catch-all）、`statusline-setup`、`claude-code-guide` |

兩個常見誤解先澄清：Explore 從 v2.1.198 起**不再固定跑 Haiku**，改為繼承主對話模型（在 Claude API 上最高只到 Opus）；Bash **不在**內建 agent 清單裡——想在獨立 context 跑指令，用的是 general-purpose 或自訂 agent。

自訂 subagent 就是一個放進 `.claude/agents/`（專案層級）或 `~/.claude/agents/`（使用者層級）的 Markdown 檔：

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices. Use proactively after code changes.
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. Analyze the code and provide specific,
actionable feedback on quality, security, and best practices.
```

只有 `name` 和 `description` 必填，其他欄位都有合理預設。常用的幾個：

| 欄位 | 作用 |
|------|------|
| `tools` / `disallowedTools` | allowlist 或 denylist，支援 `mcp__<server>` 這種 server 層級 pattern |
| `model` | `sonnet` / `opus` / `haiku` / `fable` / 完整 model ID / `inherit`，省略即 inherit |
| `permissionMode` | 覆寫這個 agent 的權限模式（見下節的限制） |
| `memory` | persistent memory scope：`user` / `project` / `local` |
| `background` | 強制背景執行 |
| `isolation` | 設 `worktree` 就在暫存 git worktree 裡跑，不動你的 checkout |
| `skills` / `mcpServers` / `hooks` / `maxTurns` / `effort` | 預載 skills、限定 MCP server、lifecycle hooks、回合數上限、effort 等級 |

這裡的 `memory` 是 subagent 自己的 auto memory scope，不是主對話的 auto memory。一般 non-fork subagent 不會讀到主對話 memory；只有 fork 會繼承父對話。

同名衝突依來源優先序：managed settings > `--agents` CLI flag > `.claude/agents/` > `~/.claude/agents/` > plugin。專案層級建議進版控，讓團隊共用。

順帶一提：如果你印象中有一個 `/agents` 互動建立精靈——它已經移除了。v2.1.198 起 `/agents` 只會提醒你直接叫 Claude 寫檔案，或自己編輯 `.claude/agents/`。目錄結構和 frontmatter 格式沒變。

## 委派怎麼觸發

三種方式，從自動到手動：

- **自動委派**：Claude 對照任務內容和每個 subagent 的 `description` 欄位決定要不要交辦。所以 description 是唯一必填欄位裡影響最大的——想鼓勵主動使用，官方建議在描述裡加上「use proactively」。
- **@-mention**：輸入 `@` 從選單挑選（例如 `@"code-reviewer (agent)"`），保證這次任務用指定的 subagent。注意 @-mention 只決定「誰來做」，任務 prompt 仍由 Claude 依你的完整訊息撰寫。
- **整個 session 變身**：`claude --agent code-reviewer` 讓主線程直接套用該 subagent 的 system prompt、工具限制和模型，也可以在 `.claude/settings.json` 設 `"agent": "code-reviewer"` 當專案預設。

## 背景執行與巢狀 spawn

互動 session 中，Claude spawn 出來的 subagent **預設就在背景跑**（W27 起），你繼續打字做事，完成的結果稍後才回到對話。前景模式則是阻塞主對話直到完成。執行中按 `Ctrl+B` 可以把前景任務轉背景。

背景有代價：可用工具縮水。背景 subagent 保留全部 MCP 工具，但內建工具只剩一份白名單（Read、Edit、Bash、WebFetch 等），其餘移除且不報錯——同一份定義在前景和背景可能解析出不同的工具集。權限核可也不會靜默：背景 subagent 遇到需要批准的工具呼叫，prompt 會浮到主 session 讓你決定。

巢狀方面，W24 起子代理可以 spawn 自己的 subagents，目前預設最深**三層**（`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` 可調，設 1 等於關閉）。同時在跑的 subagent 數量預設上限 20 個（`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`）。深度上限處的 subagent 會被收回 Agent 工具，自己做完工返回一份摘要。典型用法是 reviewer subagent 底下再分派 verifier，中間輸出不經過你的主對話。

## Permission 繼承

Subagent 的 `permissionMode` 不是無條件生效：

- 未設定 → 繼承主對話的模式。
- 父 session 用 `bypassPermissions` 或 `acceptEdits` → **優先，不可覆寫**。
- 父 session 用 auto mode → subagent 跟著 auto mode，frontmatter 裡的 `permissionMode` 被忽略，同一組分類器規則照常審查子代理的工具呼叫。
- 組織 managed settings 停用了 bypass 模式 → frontmatter 寫 `bypassPermissions` 也無效。

換句話說，權限的收緊方向永遠是「父層贏」——你可以在子代理定義裡放寬自己，但不能越過父 session 已經給出或收回的邊界。另一個安全細節：v2.1.210 起，每個 subagent 回傳的最終報告會先被掃描，模仿 `<system-reminder>` 之類格式的文字會被插入反斜線或加上標記行，避免挾帶指令的文字被當成系統訊息。掃描不改寫內容，真正的防線仍是 permission checks 和 sandboxing。

還有一條常被忽略的：任何 agent 訊息都不能算作你對權限 prompt 的批准，也不能修改 subagent 的權限設定或 CLAUDE.md——核准只能來自你或 permission 系統。

## 什麼時候不該用

Sub-agent 不是免費的。每個都是一次完整的模型呼叫，起手要重建 context，延遲比主對話高；多個 subagent 各自回傳詳細結果，加總起來照樣吃掉你的 context。官方文件給的判準很實用：

需要頻繁往返、多階段共享大量 context、只是快速小改動——留在主對話。產出大量你不會再看的輸出、需要強制工具限制、工作是自包含的、只需要一份摘要——交給 subagent。想要的是可重複使用的 prompt 或流程、但不需要隔離 context——那應該用 Skills，不是 subagent。

## 學到的事

Sub-agent 的本質是一條交易：**用「重新建立 context 的成本」換「主對話的乾淨」**。值不值，取決於任務的中間輸出有多大、需不需要工具隔離。定義很輕——一個 Markdown 檔——所以合理的做法是發現自己反覆下達同類指示時就抽成一個 subagent，而不是預先設計一套 agent 體系。至於多個 agent 互相溝通、協作的場景，那是 agent teams 和 F 叢集的事，本篇的 subagent 只負責「做完、回報」。

## 參考資料

- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents) — 本篇主要來源：frontmatter schema、內建 agent 清單、背景執行與巢狀 spawn 規則、permission 繼承、persistent memory
- [Explore the context window — Claude Code Docs](https://code.claude.com/docs/en/context-window) — subagent 隔離效果的互動模擬（6,100 tokens 讀入 vs 420 tokens 回傳）與 context 消耗分解
- [How Claude remembers your project — Claude Code Docs](https://code.claude.com/docs/en/memory) — CLAUDE.md、auto memory、subagent memory 與 fork 例外的關係
- [Configure permissions — Claude Code Docs](https://code.claude.com/docs/en/permissions) — permission modes、auto mode、bypass/managed settings 與工具核可規則

## 更新紀錄

- 2026-08-29：對照官方 sub-agents、context-window、memory、permissions 文件；補清楚 metadata trailer 與 subagent memory scope。
- 2026-08-26：初版，依 2026-08 官方文件重寫（Explore 已繼承主對話模型、`/agents` 精靈已移除、子代理預設背景執行並可巢狀 spawn 三層）。
