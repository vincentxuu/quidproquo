---
title: "Hermes Agent 的工具層：3,300 個 MCP 工具塞不進 context 時，它怎麼處理"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, mcp, plugins, tool-search, subagent, code-execution]
lang: zh-TW
series:
  name: "Hermes Agent 文件導讀"
  order: 7
tldr: "接上一堆 MCP server 之後，工具 schema 本身就會吃掉大半 context——官方舉的極端例子是 Cloudflare 單一 server 約 3,300 個工具、光名稱就 32K token。Hermes 的解法是 Tool Search：把 MCP 與非核心 plugin 工具換成三個橋接工具，schema 按需載入，核心工具永不延後。另外 plugin 預設全部停用，要在 `plugins.enabled` 逐一點名才會跑。"
description: "Hermes Agent 工具層拆解：toolset 分組、Tool Search 的三層漸進揭露、execute_code 的兩種模式與環境變數清洗、delegate_task 子代理的 context 隔離、MCP 設定與策展目錄，以及四種 plugin 型別與探索優先序。"
draft: false
---

系列第 7 篇。[導讀在這裡](/posts/ai/2026-08-18-hermes-agent-intro)。

工具這一層有個現代 agent 共通的難題：**工具愈多，還沒開始做事就先花掉一堆 token**。Hermes 對這題的處理方式比多數框架完整，值得單獨看。

## 工具是分組的

工具依用途歸進 toolset，可以按平台個別開關（`hermes tools`）。高階分類大致是：web（`web_search`、`web_extract`）、終端與檔案（`terminal`、`process`、`read_file`、`patch`）、瀏覽器（`browser_navigate`、`browser_snapshot`、`browser_vision`）、媒體（`vision_analyze`、`image_generate`、`text_to_speech`）、agent 編排（`todo`、`clarify`、`execute_code`、`delegate_task`）、記憶（`memory`、`session_search`）、自動化（`cronjob`）、整合（Home Assistant、MCP）。

一個小提醒延續[導讀](/posts/ai/2026-08-18-hermes-agent-intro)提過的：README 說 40+ 工具、架構頁說 70+ 工具 28 個 toolset。要精確數字看官方的 Built-in Tools Reference，別引用文章裡的數字。

## Tool Search：讓 schema 按需載入

問題陳述在官方文件裡很清楚：接上多個 MCP server 或非核心 plugin 之後，**它們的 JSON schema 每一回合都會佔掉可觀比例的 context**，即使這回合只用得到其中兩個。

Tool Search 是這題的選配解法。啟用後，MCP 與非核心 plugin 工具在模型可見的工具陣列裡被換成三個橋接工具：

```
tool_search(query, limit?)     — 搜尋被延後的工具目錄
tool_describe(name)            — 載入單一工具的完整 schema
tool_call(name, arguments)     — 呼叫被延後的工具
```

兩個設計細節值得學：

**核心工具永不延後。** `terminal`、`read_file`、`write_file`、`patch`、`search_files`、`todo`、`memory`、`browser_*`、`web_search`、`clarify`、`execute_code`、`delegate_task`、`session_search` 這些一律直接載入。會被延後的只有 MCP 與非核心 plugin 工具。

**橋接會被拆掉。** 模型呼叫 `tool_call` 時，Hermes 解開橋接、以真實工具名派送——**pre／post tool call hook、guardrail、審批提示全部對真實工具名生效**，CLI 與 gateway 的活動列表顯示的也是底層工具而不是 `tool_call`。這點很關鍵：否則整套審批機制會被一層 wrapper 繞過。

啟用是分層的，而且分層的是「目錄露出多少」而不是「要不要延後」：

| 層 | 條件 | 模型看到什麼 |
|---|---|---|
| 0 | 沒有 MCP／plugin 工具 | 全部直接載入，無橋接 |
| 1 | 延後工具的清單放得進預算 | 橋接 + 每個延後工具的名稱與簡述（超預算時降級成只有名稱）；**降級是 per server 的**，一個超大 server 塌成摘要行時，旁邊的小 server 仍保留逐工具清單 |
| 2 | 連「每個 server 只列名稱」都超預算 | 只有橋接 + 每個 server 一行摘要（名稱 + 工具數），個別工具只能靠 `tool_search` 找到 |

官方舉的第 2 層例子非常具體：**Cloudflare 的扁平 API 表面約 3,300 個工具，光名稱就約 32K token**。清單預算是 `min(context 的 threshold_pct%, listing_max_tokens)`，而且每次組工具陣列都重新判定——session 中途加減 MCP server 會即時換層。

## `execute_code`：把多步流程壓成一回合

`execute_code` 讓 agent 寫 Python 腳本、在腳本裡用 RPC 呼叫 Hermes 的工具。它的價值是把「搜尋 → 過濾 → 逐項處理 → 彙整」這種多步流程壓成**單一 LLM 回合**，中間結果不進 context。

兩種模式的差別要搞清楚：

```yaml
code_execution:
  mode: project      # project（預設）| strict
  timeout: 300
  max_tool_calls: 50
```

`project` 在 session 的工作目錄、用當前 virtualenv 的 python 跑，專案依賴（`pandas`、`torch`）與相對路徑（`.env`、`./data.csv`）都解得開；`strict` 在暫存目錄用 Hermes 自己的 python 跑，可重現性最高但專案依賴與相對路徑通通失效。

安全姿態則**兩種模式完全相同**：環境變數清洗（剝掉 `*_API_KEY`、`*_TOKEN`、`*_SECRET`、`*_PASSWORD`、`*_CREDENTIAL`、`*_AUTH`）與工具白名單一樣套用。官方特別點出這句——換模式不會改變安全性，別拿 `strict` 當沙箱用。

技能若真的需要某個環境變數，走的是另一條路：在 SKILL.md frontmatter 宣告 `required_environment_variables`，載入該技能時那些變數才會被註冊為 passthrough（而且只註冊真的有設值的）。

## `delegate_task`：子代理什麼都不知道

`delegate_task` 生出子 AIAgent，各自有隔離的 context 與自己的終端 session，**只有最終摘要會回到父 agent 的 context**。預設同時三個，可調且沒有硬上限。

官方用一個 warning 標了最容易犯的錯：

> **Critical: Subagents Know Nothing** — Subagents start with a completely fresh conversation… The subagent's only context comes from the `goal` and `context` fields.

所以 `delegate_task(goal="Fix the error")` 是壞用法——子代理不知道「那個錯誤」是什麼。父代理必須把檔案路徑、錯誤訊息、專案位置、Python 版本這些全部塞進 `context`。這其實是所有 multi-agent 系統的共通稅：**你省下的 context 是靠人工重述換來的**，而重述得不完整就會得到自信但錯誤的結果。

另一個實作細節：頂層的委派呼叫會自動在背景跑，Hermes 立刻回一個 handle 讓對話繼續，結果之後以新訊息貼回來；但 orchestrator 型的子代理會等自己的 worker 做完才回，這樣才能綜整。

## MCP：設定即接上

MCP server 直接寫在 `config.yaml`：

```yaml
mcp_servers:
  filesystem:
    command: "npx"
    args: ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/projects"]
```

stdio 本地 server 與遠端 HTTP server 可以混在同一份設定裡，啟動時自動發現並註冊工具，並支援 per-server 過濾——**只露出你真的要 agent 看到的那些工具**，這是控制上一節那個 context 成本最直接的手段。

兩個好用的入口：`hermes mcp` 是互動式選單、`hermes mcp catalog` 列出 Nous 審查過的策展目錄（**預設全部停用**，要裝才裝）。而從 Claude Code 搬家的人可以直接跑 `hermes import-agent claude-code`，`~/.claude.json` 的 `mcpServers` 區塊會對應到 Hermes 的 `mcp_servers`，技能與 instructions 一起搬。

ACP 則是反方向：Hermes 當 ACP server，讓 VS Code、Zed、JetBrains 這類編輯器接進來，並用一組策展過的 `hermes-acp` toolset——**刻意排除訊息投遞與 cron 管理**，因為那些不符合編輯器的 UX。要裝 `.[acp]` extra。

## Plugin：預設全部停用

這是我覺得 Hermes 做得最對的預設值之一：

> **General plugins and user-installed backends are disabled by default** — discovery finds them… but nothing with hooks or tools loads until you add the plugin's name to `plugins.enabled`.

也就是說，plugin 會被「發現」並列在 `hermes plugins` 裡，但不點名就不會執行任何程式碼。`disabled` 這個否決清單永遠贏過 `enabled`。

四種 plugin 型別的選擇語意不同，這點常被搞混：

| 型別 | 做什麼 | 選擇方式 |
|---|---|---|
| 一般 plugin | 加工具、hook、slash command、CLI 子指令 | 多選 |
| Memory provider | 取代或增強內建記憶（Honcho、Mem0…） | **單選，一次一個** |
| Context engine | 取代內建的 context 壓縮器 | **單選，一次一個** |
| Model provider | 宣告一個推論後端 | 多註冊，用 `--provider` 挑 |

探索來源的優先序是：bundled → 使用者 `~/.hermes/plugins/` → 專案 `.hermes/plugins/` → pip entry point → Nix。**後者覆蓋前者**，所以同名的使用者 plugin 會取代內建的——這是不改 repo 就能換掉內建行為的正規手段。專案層 plugin 另外要 `HERMES_ENABLE_PROJECT_PLUGINS=true` 才會載入，這個 gate 存在得很合理：不然 clone 一個 repo 就等於執行別人的 plugin。

另外值得記的一句設計說明：**不是所有擴充都要寫 Python**。TTS／STT 後端與 shell hook 是設定驅動的 shell 指令，MCP 是外部 server，gateway hook 是丟一個 `HOOK.yaml` + `handler.py` 進目錄。選對表面比硬寫 plugin 省事。

## 這一層的判斷

如果你只從這篇帶走一件事：**接 MCP server 之前先想清楚 context 成本**。per-server 過濾與 Tool Search 是兩道不同的閘門——前者是你決定露出什麼，後者是系統決定什麼時候載入 schema。兩個都不做的話，你會付出「還沒問問題就先燒 30K token」的代價。

下一篇談 [Gateway 與排程自動化](/posts/ai/2026-08-18-hermes-agent-gateway-cron)。

## 參考資料

- [Hermes Agent — Tools & Toolsets](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools)
- [Hermes Agent — MCP Integration](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp)
- [Hermes Agent — Plugins](https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Agent Client Protocol](https://agentclientprotocol.com/)
