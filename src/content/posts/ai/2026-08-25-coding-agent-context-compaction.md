---
title: "跟成熟 coding agent 學設計（26）：Context 壓縮與 compaction——從缺口到可審計 baseline"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 26
tags: [coding-agent, compaction, context-window, looplane, claude-code, codex]
lang: zh-TW
tldr: "五家成熟 agent 的 compaction 都要處理觸發、完整 turn 切點與失敗恢復。looplane 已補上 85% high-watermark、自動 compaction、原生 loop 的 deterministic fallback summary、checkpoint 落盤與 workspace context 重新注入；目前仍缺跨 runtime 等價 fallback、模型品質摘要，以及真實 provider 的長 session 驗證。"
description: "對照五家 coding agent 的 compaction 實作，並以 Looplane 固定 commit 說明自動觸發、fallback summary、checkpoint 與 context reinjection baseline。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-context-compaction-en)

進入系列第二部：每篇從一個成熟 agent 能力出發，再追蹤 looplane 的落地進度。第一個就選最要命的——context 管理。

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

## looplane 已落地的 baseline

截至 `2ed5efb`，這一節原本的「完全沒有 compaction」已經過期。`runtime_semantics.py` 現在有純函式 high-watermark policy：長駐 runtime 在已知 context window 且用量達 85% 時才自動 compact，失敗後要降到 70% 才重新武裝。TUI 會在一個 turn 完成後、送出 queued follow-up 前觸發，手動 `/compact` 與自動路徑共用 lifecycle event reducer。

原生 `AgentRunner` 沒有把所有希望押在 provider API 上。當 task token 壓力過高時，`loop.py` 會保留 system/task seed 與最近尾端，把較舊的完整訊息區間換成 `prompts.py` 產生的版本化、有長度上限的 deterministic summary。這不是另一顆模型寫的語意摘要，而是可重現的 lossly fallback；套用前後會跑 `pre_compact`／`post_compact` hook，接著再注入 changed files、verification 狀態、近期重要路徑與 active constraints，避免壓縮後連工作區現況也忘掉。

Compaction 邊界也不再只是畫面狀態。`ContextCheckpoint` 驗證 source turns 與 retained turns 不重疊、壓縮後佔用量不得增加；conversation store 能把成功 checkpoint 寫成 `context.compacted` 事件，replay 時明確排除已被取代的內容。Codex app-server 則有真正的 `thread/compact/start` lifecycle；不支援原生 compact 的 Claude adapter 會明確拒絕，不會假裝成功。

## 還沒完成的部分

現在的 native fallback 是機械式摘要，優點是便宜、可測，缺點是語意品質遠不如模型摘要。自動 provider compaction 也只涵蓋宣告支援、能回報 window 的長駐 runtime；其他 external runtime 還沒有等價 fallback。最重要的證據缺口仍是真實 provider 的長 session：checkpoint persistence、workspace reinjection 與失敗 debounce 都有測試，但尚不能把這些測試寫成跨 provider 的 production parity。

## 參考資料

- [Looplane compaction policy 與 checkpoint（固定 commit）](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/runtime_semantics.py)
- [Looplane native fallback 與 reinjection（固定 commit）](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/loop.py)

- [Lost in the Middle（Liu et al., 2023）](https://arxiv.org/abs/2307.03172)
- [Context Rot（Chroma Research）](https://research.trychroma.com/context-rot)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
- [Effective Context Engineering for AI Agents（Anthropic）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
