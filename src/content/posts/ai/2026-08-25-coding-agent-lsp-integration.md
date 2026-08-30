---
title: "跟成熟 coding agent 學設計（36）：LSP 整合——把編譯器診斷推進 agent context"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 36
tags: [coding-agent, lsp, diagnostics, rivumi, oh-my-pi, claude-code, opencode]
lang: zh-TW
tldr: "rivumi 已能把 repo 內 diagnostics 與 open-file 狀態注入下一個 model turn，也有 typed WebSocket IDE context push、可封裝的 VS Code bridge，以及管理長駐 LSP subprocess 的 ManagedLspServer。剩下的是各語言 initialize／didOpen／didChange adapter 的打磨與 live editor 驗證。"
description: "對照成熟 coding agent 的 LSP 診斷注入，並檢視 rivumi 的 IDE context、WebSocket、VS Code 與 ManagedLspServer 基線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-lsp-integration-en)

上一篇談[model catalog 與路由](/posts/ai/2026-08-25-coding-agent-model-catalog-routing)，這篇換一個感官層面的問題：agent 怎麼「看見」程式碼壞掉？

## 能力問題：驗證訊號的延遲落差

`run_check` 仍是 rivumi 判定「程式碼對不對」的品質閘門，但已不是模型取得回饋的唯一來源。IDE/LSP diagnostics 和 open-file state 可以先注入下一個 turn，讓模型在完整測試前看到精確位置；兩種訊號分工清楚：LSP 是 advisory，check 才是驗證證據。

人類工程師不是這樣工作的。你存檔那一秒，編輯器裡的語言伺服器已經把紅色波浪線畫好了——型別錯、未定義變數、import 少一個字母，全部標在精確位置。[LSP（Language Server Protocol）](https://microsoft.github.io/language-server-protocol/)就是把「編輯器的即時診斷」標準化的協議：編輯器送 didOpen/didChange，server 用 `textDocument/publishDiagnostics` 推回結構化錯誤。

問題是：coding agent 沒有編輯器。誰來收這些診斷？收到之後怎麼塞進 model context？五家參考專案裡，三家做了、兩家沒做，而且做法差很多。

本篇取證範圍：**pi**（badlogic/pi-mono）、**omp**（can1357/oh-my-pi）、**opencode**（sst/opencode）、**codex**（openai/codex）、**claude-code**（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有引用都在本地 clone 實際 grep 過，包含負向發現。

先講一個取證更正：我的路由表原本寫 omp 的 LSP 在 `crates/` 的 lsp、dap——實際查下去，`oh-my-pi/crates/` 底下只有 pi-ast、pi-shell 等 crate，沒有獨立 lsp/dap crate。omp 的 LSP 整合整個在 TypeScript 側的 `packages/coding-agent/src/lsp/`。記錄在這裡，免得下次又被自己騙。

## 五家怎麼做

### omp：編輯必經 writethrough＋遲到診斷注入

omp 是五家中做得最重的。核心概念叫 writethrough：所有編輯工具寫檔不直接寫磁碟，而是經過 `oh-my-pi/packages/coding-agent/src/lsp/writethrough.ts#createLspWritethrough`——先通知 LSP server（didOpen/didChange/didSave），等診斷回來，再把檔案落地。等待是有預算的：`diagnostics.ts` 裡的常數列得很清楚，inline 等 500ms（`INLINE_DIAGNOSTICS_WAIT_TIMEOUT_MS`），單檔最多 3 秒（`SINGLE_DIAGNOSTICS_WAIT_TIMEOUT_MS`），批次 400ms。

真正的巧思在「遲到診斷」。500ms 內 rust-analyzer 不一定吐得完，但 tool result 已經要回給模型了。`oh-my-pi/packages/coding-agent/src/lsp/deferred-diagnostics.ts#DeferredDiagnostics` 處理這件事：每次檔案修改都 bump 一個 mutationVersion，遲到的診斷帶著當時的版本號回來，如果檔案又被改過（版本不符）就直接丟棄——`isStale()` 避免模型看到過期錯誤白修一輪。活的診斷則透過 `sdk.ts` 的 yieldQueue 以 `LSP_LATE_DIAGNOSTIC_MESSAGE_TYPE` 批次打包，注入下一個 turn 的 context。

重複噪音用 ledger 壓制：`oh-my-pi/packages/coding-agent/src/lsp/diagnostics-ledger.ts#DiagnosticsLedger.reduce` 把每筆診斷剝掉 location prefix 後算 identity，同一檔案看過的就不重報。

另外 omp 也提供主動查詢工具 `oh-my-pi/packages/coding-agent/src/lsp/tool.ts#LspTool`，action 有 status、diagnostics、definition、symbols、rename_file、reload 等，read-only session 用 `LSP_READONLY_ACTIONS` 擋掉寫入類操作。內建 server 預設表 `src/lsp/defaults.json` 收了六十幾個 language server，連 tlaplus 和 gleam 都有。

### claude-code：被動訂閱＋attachment 投遞

claude-code 走完全不同的路：不做 writethrough，純被動。`claude-code-source/src/services/lsp/passiveFeedback.ts#registerLSPNotificationHandlers` 對所有 server 訂閱 `textDocument/publishDiagnostics`，收到就登記進 registry；下一個 query 開始前，`claude-code-source/src/utils/attachments.ts#getLSPDiagnosticAttachments` 把 pending 的撈出來，轉成 attachment 自動送進對話。

量控做得很細（`claude-code-source/src/services/lsp/LSPDiagnosticRegistry.ts#checkForLSPDiagnostics`）：每檔上限 10 筆、總量上限 30，按 severity 排序讓 Error 優先；去重 key 是 message+severity+range+source+code 的 hash，跨 turn 用 LRUCache 記住已投遞的（上限 500 檔），檔案被編輯時 `clearDeliveredDiagnosticsForFile` 清掉該檔紀錄——同樣的錯誤修完又出現，才會重報。

兩個值得注意的決策：一是 server 只能由 plugin 提供（`services/lsp/config.ts#getAllLspServers` 的註解明說不開放 user/project settings），把供應面收斂到審核過的來源；二是 attachments.ts 裡那句註解「LSP diagnostics are only useful if the agent has the Bash tool」——被動診斷只有在 agent 有能力行動時才有價值，否則只是灌 context。

### opencode：tool result 後面貼 error 區塊

opencode 的做法最樸素也最省事：不搞注入時序，直接在 edit/write 工具的結果後面附加診斷。`opencode/packages/opencode/src/lsp/diagnostic.ts#report` 只挑 severity===1 的 error、每檔最多 20 筆，render 成 `<diagnostics file="...">` XML 區塊；`tool/edit.ts` 和 `tool/write.ts` 呼叫它。write 甚至會掃專案層級的診斷，但用 `MAX_PROJECT_DIAGNOSTICS_FILES` 封頂。

client 端有個細節值得抄：`src/lsp/client.ts` 特意不在 didChange 時清空診斷 store，因為 clangd 這類 server 只在內容真的變了才重發，先清空會閃瞎。

### pi 和 codex：沒有

負向發現也要記錄。pi-mono 核心程式碼 grep 不到任何 LSP 整合；codex-rs 同樣沒有。codex 的哲學是 shell 才是唯一真相——要驗證就跑 build、跑測試，跟 rivumi 的 run_check 血緣最近。而 omp 的整套 LSP 正是 fork 自 pi 之後加上的，兩代對照本身就是設計文件：上游認為「執行結果夠用」，fork 認為「即時診斷值得多養幾個子程序」。

## 學術與工程依據

這件事的學理依據其實是老東西：[SWE-agent 論文](https://arxiv.org/abs/2405.15793)提出的 ACI（agent-computer interface）設計原則，第一條就是 feedback 要低成本——linting 之所以有效，是因為它把「錯在哪」從需要推理的問題降級成需要閱讀的問題。LSP 官方[規格文件](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)定義了 Diagnostic 結構（range、severity、source、code），正好是現成的結構化錯誤格式，不用自己發明 schema。rust-analyzer 的[使用手冊](https://rust-analyzer.github.io/manual.html)也展示了 flycheck（存檔觸發 cargo check）怎麼把非同步編譯結果推回編輯器——omp 對 rust-analyzer 設 `checkOnSave: false` 就是不想跟自己的 writethrough 打架。

代價面要誠實：每個 project 多養一到數個長駐子程序（rust-analyzer 吃起記憶體不客氣）、啟動索引要時間（omp 有 warmup 機制和 `DIAGNOSTICS_PIPELINE_GRACE_MS = 10_000` 的管線寬限）、而且診斷是「顧問」不是「判決」——server 掛了、索引還沒建好、或設定不對時，安靜地沒有訊號不等於沒有錯誤。

## rivumi 已落地的基線

`ide.py` 已定義 bounded diagnostics 與 open-file snapshot，native loop 會把它們以標記過的 injected context 放進下一個 model turn，並留下 `ide.diagnostics_injected`／`ide.open_files_injected` 事件。stateful WebSocket 也接受 typed IDE context push；`editors/vscode` 已能封裝與做本機 smoke。

長駐程序由 `ManagedLspServer` 管理：exact argv、受限訊息大小、stdio `Content-Length` framing、`publishDiagnostics` 解析、原子寫入 snapshot，以及 bounded shutdown 都已存在。run_check 仍是驗證閘門，LSP 只提供 advisory context。

剩下的是 language-specific initialize、didOpen、didChange adapter 細節，以及在真實 VS Code／多語言專案的 live 驗證。現有測試證明 process ownership 與 context injection，不等於所有 language server 都已可直接使用。

## 參考資料

- [rivumi `lsp.py`（2ed5efb）](https://github.com/vincentxuu/rivumi/blob/2ed5efb/src/rivumi/lsp.py)
- [rivumi IDE bridge（2ed5efb）](https://github.com/vincentxuu/rivumi/blob/2ed5efb/src/rivumi/ide.py)

- [Language Server Protocol 官網](https://microsoft.github.io/language-server-protocol/)／[LSP 3.17 Specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)
- [oh-my-pi（GitHub）](https://github.com/can1357/oh-my-pi) — `packages/coding-agent/src/lsp/`
- [sst/opencode（GitHub）](https://github.com/sst/opencode) — `packages/opencode/src/lsp/`
- [anthropics/claude-code（GitHub）](https://github.com/anthropics/claude-code)
- [openai/codex（GitHub）](https://github.com/openai/codex)、[badlogic/pi-mono（GitHub）](https://github.com/badlogic/pi-mono)
- [Pyright 官方文件](https://microsoft.github.io/pyright/)、[rust-analyzer Manual](https://rust-analyzer.github.io/manual.html)
