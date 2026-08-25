---
title: "跟成熟 coding agent 學設計（26）：Context 壓縮與 compaction——五家都有、rivumi 還沒有的能力"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 26
tags: [coding-agent, compaction, context-window, rivumi, claude-code, codex]
lang: zh-TW
tldr: "claude-code 用「context window 減保留額」算觸發門檻、失敗三次就熔斷；codex 把 compaction 做成可注入 initial context 的獨立 task；omp 的 snapcompact 乾脆把舊歷史渲染成 PNG 給視覺模型讀；pi 和 opencode 都用 cut-point 保證不切壞 turn。rivumi 目前只有「最近 12 個 turn」的硬截斷，被丟掉的上下文沒有任何摘要補償——這是第二部系列的第一個缺口。"
description: "對照 pi、omp、opencode、codex、claude-code 五家的 compaction 實作，整理觸發時機、切點策略與摘要生成，提出 rivumi 的設計草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-context-compaction-en)

進入系列第二部：每篇講一個「五家成熟專案都有、rivumi 還沒有」的能力。第一個就選最要命的——context 管理。

先交代取證範圍：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有引用都是我在本地 clone 實際 grep 過的。

## 能力問題：session 一長，你只剩兩個爛選項

Agent 的每一輪都要把整份對話歷史送回 provider。工具結果動輒幾千 token，跑一小時的 session 很容易頂到 context window。頂到之後只有兩條路：直接報錯結束，或者把舊內容丟掉。直接報錯沒人想看；但「無腦丟掉」更危險——第 3 個 turn 決定的架構約束、第 17 個 turn 發現的測試陷阱，都會在沒有任何紀錄的情況下消失。

Compaction 就是第三條路：在還沒爆掉之前，把舊歷史交給 LLM 做成摘要，換成一段緊湊的文字放回 context 最前面。難的不是「叫 LLM 摘要」這一步，而是旁邊的三件事：

1. **什麼時候觸發**：太早浪費錢、摘要會把還有用的細節壓掉；太晚一次要摘要的量太大。
2. **在哪裡切**：不能把一組 tool_use/tool_result 切成一半，否則送回 API 直接被拒。
3. **怎麼驗證**：摘要是另一顆模型寫的，寫壞了整個 session 的記憶就毀了。

## 五家怎麼做

### pi：教科書式的最小實作

核心判斷式一行：`pi-mono/packages/agent/src/harness/compaction/compaction.ts#shouldCompact`——`contextTokens > contextWindow - settings.reserveTokens`，token 估計用保守的字元啟發法（`estimateContextTokens` 連圖片都按固定字數折算）。切點邏輯獨立在 `findTurnStartIndex` 和 `findCutPoint`：往回找到 turn 邊界才下刀，保證不產生孤兒 tool_use。

### omp：把觸發時機做成六種，再把摘要變成一張圖

omp 的 fork 加深了很多。`oh-my-pi/docs/compaction.md` 明列六種觸發：手動 `/compact`、同模型 context overflow 錯誤後的自動恢復、`stopReason === "length"` 後的恢復、成功 turn 後的閾值維護、turn 進行中的 mid-turn 維護、idle 維護。也就是說 compaction 不只防爆，也是**錯誤恢復路徑**的一部分。

更有趣的是 `packages/snapcompact/src/snapcompact.ts#compact`：被丟棄的歷史不做 LLM 摘要，而是序列化後用原生字型**渲染成一張張 PNG**，靠視覺模型的識讀能力把資訊帶回來——本地、確定性、不用多花一次文字 API 呼叫。框架形狀按 provider 調過（`resolveShape`），序列化時每個 tool result 截到 `TOOL_RESULT_MAX_CHARS = 2000`。

### opencode：修剪優先

`opencode/packages/opencode/src/session/compaction.ts#PRUNE_MINIMUM` 定義了 20,000 token 的最低修剪量，`PRUNE_PROTECT = 40_000` 保護最近區段不被剪。工具輸出統一截到 2,000 字再進入摘要流程。哲學是：能機械式省下來的先省（修剪），真不夠才請 LLM 摘要。

### codex：compaction 是一等公民任務

Rust 端把整件事做成獨立模組群：`codex-rs/core/src/compact.rs#run_compact_task` 是入口，單次 compact 的 user message 上限 `COMPACT_USER_MESSAGE_MAX_TOKENS = 20_000`。兩個值得抄的細節：

- `codex-rs/core/src/state/auto_compact_window.rs#AutoCompactWindow` 把「自動壓縮窗口」編號管理，resume 時能還原窗口狀態。
- `InitialContextInjection` enum 區分 pre-turn 和 mid-turn 兩種語意：前者摘要後下一輪完整重注初始 context，後者必須把 initial context 注在最後一個 user message 之前——因為模型訓練時預期 mid-turn 摘要就是歷史的最後一項。這種協議層的細節，不讀原始碼根本想不到。

### claude-code：門檻工程與熔斷器

`src/services/compact/autoCompact.ts#getAutoCompactThreshold` 的算法：context window 先扣掉摘要保留額，再扣 `AUTOCOMPACT_BUFFER_TOKENS = 13_000` 才是觸發線。最值得抄的是熔斷器——`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`，註解直白寫著曾經有 session 連續失敗上千次、一天燒掉全球約 25 萬次 API 呼叫。另外它還有 `microCompact.ts#microcompactMessages` 做細粒度的 microcompact，和整段 compaction 是兩層不同的機制。

## 學術依據

為什麼摘要有效而不是單純損失？因為長 context 本來就有衰減問題。[Liu et al. 的 "Lost in the Middle"](https://arxiv.org/abs/2307.03172) 實測模型對 context 中段的資訊召回明顯較差——塞更多不等於記得更多。[Chroma 的 context rot 研究](https://research.trychroma.com/context-rot)進一步指出效能隨 context 長度增加而普遍下滑。[MemGPT](https://arxiv.org/abs/2310.08560) 則把作業系統的分頁概念搬進 LLM：主 context 放熱資料、外部儲存放冷資料、靠中斷機制換頁——compaction 可以看作它「換頁」策略的工程化簡化版。Anthropic 自己的[context engineering 文章](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)也把 compaction 列為長任務 agent 的核心技術。

## rivumi 設計草案

先如實描述現狀：grep 整個 `~/Projects/rivumi/src/rivumi/`，**沒有任何 compaction 機制**。現有的只有三個硬邊界——`conversation.py#MAX_REPLAY_MESSAGES = 12`、`conversation.py#MAX_REPLAY_CHARS = 48_000`、`conversation.py#MAX_MESSAGE_CHARS = 16_000`。`ConversationStore.completed_turns` 只回傳最後 12 個完整 turn 給 replay 路徑，第 13 個 turn 之前的內容**靜默消失**，沒有摘要、沒有標記、沒有事件。`loop.py#bounded_text` 只是把 artifact preview 截短，救不了對話記憶。

若要做，草案如下：

**介面位置**：新增 `src/rivumi/compaction.py`，定義 `Compactor` protocol（`should_compact(usage) -> bool`、`summarize(turns) -> str`），實作走既有的 `ModelProvider` 抽象——provider gateway 在 M2 就做好了，不需要新依賴。

**資料流**：每次 turn 完成後從 snapshot events 估算 context 大小（沿用 pi 的字元啟發法即可）；超過 `window - reserve` 就把待摘要的 turn 區間送 `summarize`，摘要以一個新的 conversation event 類型（例如 `compaction_summary`）append 進 JSONL，replay 時 `completed_turns` 改成「summary + 之後的完整 turn」。compaction 本身也落盤成事件，audit trail 不斷裂——這點和 rivumi 既有的事件溯源設計完全同構。

**風險與取捨**：

- **外部 CLI backend 不歸 rivumi 管**。M11 之後 rivumi 主力是長駐外部 session，pi/omp/codex adapter 底下的 CLI 有自己的 compaction；rivumi 層再做一份會雙重摘要。所以第一版只該覆蓋 native conversation 路徑，external backend 明確標記為「由 runtime 自理」。
- **摘要品質不可驗證**：摘要寫壞等於記憶損毀。至少要把摘要原文留在事件裡可檢視，並允許 `/compact <instructions>` 式的手動干預。
- **成本**：每次 compaction 多一次 LLM 呼叫。修剪優先（學 opencode）：先把超長工具輸出截短重算，真的還超標才請模型摘要。

## 與現有架構的銜接

目前缺這塊的具體影響：native 路徑上任何超過 12 個 turn 的 session，早期決策都在無紀錄的情況下消失，而且使用者完全不知道——TUI 上看不到任何「這裡有東西被丟掉了」的邊界。五家裡最起碼的共識是**compaction 必須是一個可見、可審計的邊界事件**（omp 的 cmp entry、codex 的 CompactionEvent、claude-code 的 CompactBoundaryMessage 都是）。rivumi 既有的事件流和 transcript UI 已經能把這個邊界畫出來，缺的只是承認「硬截斷不是策略」。這是改善路線圖上性價比最高的一格。

## 參考資料

- [Lost in the Middle（Liu et al., 2023）](https://arxiv.org/abs/2307.03172)
- [Context Rot（Chroma Research）](https://research.trychroma.com/context-rot)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Effective Context Engineering for AI Agents（Anthropic）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
