---
title: "跟成熟 coding agent 學設計（37）：Code mode——把工具呼叫編譯成程式碼批次執行"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 37
tags: [coding-agent, code-mode, tool-use, sandbox, codex, opencode, rivumi]
lang: zh-TW
tldr: "code mode 讓模型寫一小段程式去呼叫工具，迴圈、分支、平行呼叫都在沙箱裡一次跑完，中間結果不必回流 context。五家中只有 codex 和 opencode 做了：codex 用獨立 V8 host process 加 exec/wait 兩個工具，opencode 自己寫了一個受限 JS 直譯器。rivumi 的草案是先做唯讀批次執行，approval 從逐次請求升級成整段程式的效果分類。"
description: "對照 codex 與 opencode 的 code mode 實作——受限直譯器、API 簽名生成、錯誤分類、approval 路由——並提出 rivumi 的設計草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-code-mode-en)

系列第二部來到第 37 篇。這個主題比前幾篇新：五家參考專案裡只有兩家做了，而且都還在快速迭代。取證範圍照舊——pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88）。我在本地 clone 實際 grep 過 `code mode`、`codemode`、`code_mode`：pi、omp、claude-code 三家都沒有對應實作，所以這篇誠實寫短一點，只攤開有東西的兩家。

## 能力問題：每一次工具呼叫都是一趟 round trip

傳統 agent loop 裡，模型每想呼叫一個工具就要吐一次 tool_use、等一次結果、再把結果讀進來。三個後果：

1. **延遲**：十個序列呼叫就是十趟完整的模型往返。
2. **context 浪費**：每個中間結果都要完整進出模型一次。抓一萬列表格再過濾出五列，那九千九百多列白白燒 token。
3. **控制流靠模型硬撐**：迴圈、條件判斷、「失敗就換招」都得用一輪輪推理演出來。

Code mode 的解法是把「一串工具呼叫」編譯成一段程式：模型寫一段受限的 JavaScript（或 Python），迴圈和分支在沙箱裡原生執行，工具以函式形式注入，只有最終結果回流 context。Anthropic 在工程部落格把這套模式講得很清楚，引用 Cloudflare 的命名叫 Code Mode：把 MCP 工具呈現成 code API 而不是直接工具呼叫，一個 Google Drive 轉 Salesforce 的案例從 15 萬 token 降到 2 千。

## 兩家怎麼做

### codex：獨立 V8 host process，模型只看到 `exec` 和 `wait`

codex 把整個 runtime 拆成一個可選安裝的獨立執行檔。協定層在 `codex-rs/code-mode-protocol`，gRPC 定義檔 `codex.code_mode.v1.proto` 開頭註解寫明職責分工：host 負責跑 JavaScript，nested tool call 委託回 session owner。V8 初始化隔離在 `codex-rs/code-mode-runtime/src/v8_init.rs#initialize_v8`，連 JIT 開關都是獨立型別 `V8JitMode`。

模型端介面刻意極小：`codex-rs/code-mode-protocol/src/lib.rs#PUBLIC_TOOL_NAME` 就是 `"exec"`——一個吃原始 JS 的工具；旁邊還有 `WAIT_TOOL_NAME = "wait"`。有意思的是 yield 語意：腳本超過 `yield_time_ms` 就先回傳目前輸出、繼續在背景當一個 cell 跑，之後用 `wait` 回來收割。長任務不會卡死 turn。原始碼第一行可以用 `// @exec:` pragma 自帶 `yield_time_ms` 和 `max_output_tokens` 參數（`codex-rs/code-mode-protocol/src/description.rs#parse_exec_source`）。

工具怎麼變成程式裡可以呼叫的函式？答案在簽名生成：`ToolDefinition` 帶 `input_schema` 和 `output_schema`，`codex-rs/code-mode-protocol/src/description.rs#render_json_schema_to_typescript` 把 JSON Schema 渲染成 TypeScript 型別簽名給模型看。模型看到的不是「有一堆工具」，而是有型別提示的 API 面。

安全路由是最值得抄的部分。腳本內的工具呼叫會被送回 host 重走一遍正常管線：`codex-rs/core/src/tools/code_mode/mod.rs#call_nested_tool` 把每個 nested call 包成 `ToolCall`、標記 `ToolCallSource::CodeMode`，走原本的 `handle_tool_call_with_source`——也就是 approval、policy、telemetry 一個都不少。同時它擋掉 `exec` 呼叫自己，防止巢狀遞迴。可用性處理也很務實：`mod.rs#CodeModeService.is_available` 檢查 host 是否存在，不存在時直接降級回 direct tools，設定裡的 `disable_in_process_fallback` 可以改成 fail closed（`codex-rs/core/src/config/mod.rs#CodeModeConfig`）。

### opencode：自己寫一個受限 JS 直譯器

opencode 的做法更激進：不用 V8，自己在 `packages/codemode` 寫了一個 Effect-native 的受限 JavaScript 直譯器。`README.md` 開宗明義：「orchestration language, not a general JavaScript runtime」——支援資料操作、迴圈、函式、Promise 平行（上限 8 個並發工具呼叫），但沒有 `eval`、動態 import、模組、timer、host globals。程式能碰到的只有 host 明確提供的 `tools` 物件樹，跨邊界的值必須是 plain data。

三個細節值得單獨講：

- **限制即政策**：`timeoutMs`、`maxToolCalls`、`maxOutputBytes` 三個旋鈕全部預設關閉，理由寫在 README——執行預算是 host 政策，不是 library 政策。錯誤則做成固定的 diagnostic 分類（`packages/codemode/src/codemode.ts#DiagnosticKind`）：`UnknownTool`、`InvalidToolInput`、`ToolCallLimitExceeded`……失敗是資料，不是 exception。
- **工具探索**：目錄預算 2,000 token，各 namespace 輪流放簽名保證公平；放不下的靠內建 `$codemode.search` 工具按需查詢。這就是 progressive disclosure 的具體實作。
- **approval 不歸它管**：`packages/opencode/src/tool/code-mode.ts#CodeModeTool` 把 MCP 工具包進 `tools` 樹，每個子呼叫仍會觸發 `tool.execute.before`/`after` hooks，授權明確留在 host 層。README 的 Authority Boundary 一節寫得直白：「A program cannot gain authority through prose or generated code.」

## 學術依據

「用程式碼統合多步工具呼叫」最直接的學術印證是 [CodeAct](https://arxiv.org/abs/2402.01030)（Executable Code Actions Elicit Better LLM Agents，ICML 2024）：把 agent action 空間從一個個 JSON tool call 換成可執行程式碼，讓模型利用程式語言的控制流組合多個動作、在中間狀態上迭代。code mode 基本上就是 CodeAct 加上生產級的沙箱與審計。工程面則有 Anthropic 的 [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)（含上面提的 token 數據）與 Cloudflare 的 [Code Mode](https://blog.cloudflare.com/code-mode/)，兩篇都強調同一件事：LLM 很會寫程式，就該讓它寫程式去呼叫工具。[Anthropic 官方 tool use 文件](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)裡的 parallel tool use 一節也承認：直接工具呼叫的正交平行只是起點，複雜依賴結構需要更強的編排原語。

## rivumi 設計草案

rivumi 目前的 native harness 是純逐一工具呼叫：每次呼叫產生事件、過 `approvals.py` 的 policy、等結果。加 code mode 我會分四步：

1. **先做唯讀批次**。第一批只開 read-only 工具（read/grep/glob/list），執行環境用 RestrictedPython 或同等受限直譯器，注入的只有工具函式，沒有 IO 原語。唯讀集合的 approval 本來就能自動放行，風險最低。
2. **Approval 升級為整段程式效果分類**。靜態掃描程式引用了哪些工具符號：全是 auto-approve 集合就直接跑；只要碰到一個 mutating 符號，整段程式升級為一次 approval 請求，預覽列出效果聯集。執行期每個 nested call 仍走原本的 `ApprovalPolicy.decide`——deny 就中止程式。這是 codex `call_nested_tool` 的做法，確保 code mode 不會變成繞過 approval 的後門。
3. **三個限制旋鈕照抄 opencode**：wall-clock timeout、maxToolCalls、輸出截斷，當作 host 政策而非 library 預設。
4. **API 面生成與探索**。從現有工具 schema 渲染型別化簽名放進 prompt；等 MCP 整合（第 30 篇）之後工具數量暴增，再加 search 式的 progressive disclosure。

## 與現有架構的銜接

事件流方面，code mode 對外只需一個 `execute` 工具，但 transcript 不能只顯示一行「跑了段程式」——nested 工具呼叫應該重用現有的 `ToolStartedEvent`/`ToolCompletedEvent` 配上 correlation ID，TUI 的 semantic transcript 才能把每次子呼叫掛在正確的位置。外部 CLI backend（OpenCode/Pi/OMP adapter）完全不受影響，它們有自己的 harness；code mode 是 rivumi native path 的能力。M6 的 Cloudflare sandbox service 未來可以承接執行環境，把「受限直譯器」換成「遠端沙箱」，架構位置不變。

誠實的結尾：這是新興能力，兩家的設計都還在動（codex 的 code mode host 目前要另行安裝、opencode 的直譯器子集邊界持續調整）。現在值得吸收的不是特定實作，而是兩條共識——工具呼叫照樣走完整 approval/policy 管線，以及執行限制是 host 政策。

## 參考資料

- [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030)
- [Anthropic Engineering: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Cloudflare Blog: Code Mode](https://blog.cloudflare.com/code-mode/)
- [Anthropic Docs: Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [openai/codex — codex-rs/code-mode-protocol](https://github.com/openai/codex/tree/main/codex-rs/code-mode-protocol)
- [sst/opencode — packages/codemode](https://github.com/sst/opencode/tree/dev/packages/codemode)
