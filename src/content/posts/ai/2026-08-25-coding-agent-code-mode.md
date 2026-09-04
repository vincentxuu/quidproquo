---
title: "跟成熟 coding agent 學設計（37）：Code mode——把工具呼叫編譯成程式碼批次執行"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 37
tags: [coding-agent, code-mode, tool-use, sandbox, codex, opencode, looplane]
lang: zh-TW
tldr: "looplane 已先做 bounded tool-program DSL：唯讀程式支援 list/read/search/diff、repeat 與 if_contains；modify/check transaction 會經整體 approval，失敗時回滾 touched paths。它還不是任意 JavaScript/Python code mode，也沒有平行 transaction execution。"
description: "對照 codex 與 opencode 的 code mode，並檢視 looplane 已落地的唯讀 tool program 與可回滾 modify/check transaction 基線。"
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

## looplane 已落地的基線

looplane 沒有直接嵌入 JavaScript 或 Python，而是先做一套 bounded DSL。`tool_program` 只開 `list_files`、`read_file`、`search_text`、`git_diff` 等唯讀操作，並支援上限內的 `repeat` 與 `if_contains`。這讓模型能在一次 tool call 裡表達簡單控制流，同時把可執行語言縮到宿主能完整檢查的範圍。

需要修改時走另一個 `tool_transaction`：它先收集 touched paths，整體經過既有 approval/policy，再執行 replace／patch／check；任何步驟失敗都嘗試把受影響檔案回滾到 transaction 前。後端仍有 turn limit，步數和輸出也受限。

這套 baseline 解決的是「批次工具程式」，還不是 codex/opencode 那種任意受限語言 runtime。平行 transaction execution、較豐富的 DSL，以及是否值得承擔完整直譯器的安全成本，仍是開放問題。

## 參考資料

- [looplane tool program / transaction 實作（2ed5efb）](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/tools.py)
- [looplane native loop policy integration（2ed5efb）](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/loop.py)

- [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030)
- [Anthropic Engineering: Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Cloudflare Blog: Code Mode](https://blog.cloudflare.com/code-mode/)
- [Anthropic Docs: Tool Use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [openai/codex — codex-rs/code-mode-protocol](https://github.com/openai/codex/tree/main/codex-rs/code-mode-protocol)
- [sst/opencode — packages/codemode](https://github.com/sst/opencode/tree/dev/packages/codemode)
