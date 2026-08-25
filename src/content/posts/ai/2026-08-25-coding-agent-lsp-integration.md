---
title: "跟成熟 coding agent 學設計（36）：LSP 整合——把編譯器診斷推進 agent context"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 36
tags: [coding-agent, lsp, diagnostics, rivumi, oh-my-pi, claude-code, opencode]
lang: zh-TW
tldr: "omp 把 LSP 做成編輯工具的必經 writethrough，遲到診斷用 mutationVersion 判新鮮度後注入下一個 turn；claude-code 走被動訂閱 publishDiagnostics、下個 query 以 attachment 送出，每檔上限 10 筆、總量 30；opencode 只在 edit/write 的 tool result 後面附加 error-only 區塊；pi 和 codex 都沒做 LSP。rivumi 目前只有 run_check exact argv allowlist，草案分兩階段：先做 pull-on-edit，再上長駐 server 加 deferred 注入。"
description: "對照 omp、claude-code、opencode 的原始碼，拆解 coding agent 怎麼把 LSP 即時診斷變成 agent 的感官：writethrough、deferred diagnostics、去重與量控，以及 rivumi 的導入路線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-lsp-integration-en)

上一篇談[model catalog 與路由](/posts/ai/2026-08-25-coding-agent-model-catalog-routing)，這篇換一個感官層面的問題：agent 怎麼「看見」程式碼壞掉？

## 能力問題：驗證訊號的延遲落差

rivumi 現在取得「程式碼對不對」的方式只有一條路：`run_check`——一張 exact argv 白名單，模型改完檔案、主動呼叫、等整個測試或 typecheck 跑完，才知道有沒有弄壞東西。這個設計的好處是訊號可信（跑過就是跑過），壞處是回饋又慢又粗：一次迴圈動輒數十秒，而且回給模型的常常是幾千行測試 output，錯誤藏在第幾行第幾欄要自己撈。

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

## rivumi 設計草案

rivumi 是 Python，生態系裡 [pyright](https://microsoft.github.io/pyright/) 的 `pyright-langserver --stdio` 是現成的起點。分兩階段：

**Phase 1：pull-on-edit。** 學 opencode 的最簡做法——`edit_file` / `write_file` 成功後，對該檔案做一次 bounded 診斷查詢（spawn pyright 或沿用既有 server，等 1–3 秒），error-only、每檔上限 10 筆，render 成區塊附加在 tool result 後面。不改 run_check、不加長駐程序、失敗就靜默跳過。這一步就能吃到八成的價值：模型在下一個 turn 開始前就知道自己剛剛弄壞了什麼，不用等 run_check 跑完。

**Phase 2：長駐 server＋deferred 注入。** server 子程序的生命週期管理掛在 external_runner 旁邊（同樣吃 approval 分級和 timeout 預算），支援 didOpen/didChange；遲到診斷學 omp——每檔 mutationVersion 判 stale，ledger 按 message identity 去重，超過 inline 預算的診斷排進佇列、下一個 turn 以系統訊息注入。

三條不變的原則：run_check 仍是唯一驗證閘門，LSP 診斷永遠是 advisory；量控先行（per-file cap、total cap、error-first），診斷是給模型看的，不是給它淹的；server 故障一律 fail-silent，退回 Phase 0 的世界（只有 run_check），不能讓 LSP 掛掉拖垮整個 loop。

## 與現有架構的銜接

- `tools.py#run_check` 不動；Phase 1 的診斷查詢做成新的內部 helper，不走 approval（唯讀）
- 子程序管理比照 `external_runner.py#ExternalCodingRunner` 的 deadline/cancel 模式
- transcript 層面，deferred 診斷以明確標記的事件寫進 session log，replay 時可辨識
- 五家對照的最短摘要：**opencode 證明 pull-on-edit 夠用，omp 證明 deferred 注入值得做，claude-code 證明量控與去重不能省，pi/codex 證明不做也能活**——rivumi 先走第一格，留第二格給 roadmap

## 參考資料

- [Language Server Protocol 官網](https://microsoft.github.io/language-server-protocol/)／[LSP 3.17 Specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793)
- [oh-my-pi（GitHub）](https://github.com/can1357/oh-my-pi) — `packages/coding-agent/src/lsp/`
- [sst/opencode（GitHub）](https://github.com/sst/opencode) — `packages/opencode/src/lsp/`
- [anthropics/claude-code（GitHub）](https://github.com/anthropics/claude-code)
- [openai/codex（GitHub）](https://github.com/openai/codex)、[badlogic/pi-mono（GitHub）](https://github.com/badlogic/pi-mono)
- [Pyright 官方文件](https://microsoft.github.io/pyright/)、[rust-analyzer Manual](https://rust-analyzer.github.io/manual.html)
