---
title: "跟成熟 coding agent 學設計（2）：Agent loop 的形狀——事件流、checkpoint、resume"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 2
tags: [coding-agent, agent-loop, looplane, session-persistence, claude-code]
lang: zh-TW
tldr: "pi 的 loop 是雙層 while 加 EventStream；claude-code 明講 stop_reason 不可靠、改以串流中收到的 tool_use block 當唯一續跑訊號；codex 把 turn 做成可取消的 SessionTask 再靠 rollout crate 錄 JSONL；looplane 選了「manifest 先落盤、JSONL 跟上」的寫入順序，讓 Ctrl-C 之後能做驗證式續跑而非重跑。這篇全部附 file#symbol 級證據。"
description: "對照 pi、claude-code、codex 三家原始碼，拆解 agent loop 的四個設計軸：事件流形狀、工具呼叫迭代與收尾條件、取消語意、checkpoint 與 resume；並說明 looplane 的選擇與還能改善什麼。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-agent-loop-shapes-en)

上一篇[總覽](/posts/ai/2026-08-25-coding-agent-design-series-overview)說好了系列規則：每篇五段、證據給到 file#symbol。第一個正式主題就是地基——agent loop。

先講本篇取證範圍：深查了三家——**pi**（badlogic/pi-mono）、**claude-code**（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）、**codex**（openai/codex 的 Rust workspace）。omp 是 pi 的 fork，loop 主體同型，不重複查；opencode 這輪沒有逐檔確認，明講不涵蓋。所有引用都是我在本地 clone 實際 grep 過的。

## 設計問題：一個 loop 到底要處理什麼

把「呼叫 LLM、跑工具、重複」寫成 while 迴圈只要二十行。難的是迴圈旁邊的四件事：

1. **串流**：模型的回應是 token-by-token 到的，UI 要邊收邊畫，但 tool call 的參數要等到串完才完整。
2. **工具呼叫迭代**：模型回一批 tool_use，你執行、把結果塞回去、再問一次。什麼時候算結束？stop_reason 可信嗎？輸出被 token 上限截斷的那批 tool call 要不要執行？
3. **取消**：使用者按 Ctrl-C 的瞬間，可能正有半批 tool_use 沒有對應的 tool_result——直接把這種歷史送回 provider 會被 API 拒絕。
4. **斷點續跑**：跑到第 37 步 process 死掉，重來一次太貴。但 resume 不是把 log 讀回來就好——你得能證明「死掉的時候沒有一個副作用做到一半」。

[ReAct](https://arxiv.org/abs/2210.03629) 論文展示的「推理與行動交錯」就是這個 loop 的學術原型，但論文裡的 loop 不用管 Ctrl-C 和斷電。工程難度全在上面那四件事。

## 參考專案怎麼做

### pi：最小 loop 的教科書

整個核心是 `pi-mono/packages/agent/src/agent-loop.ts#agentLoop`，一個函式回傳 `EventStream<AgentEvent, AgentMessage[]>`。內部的 `runLoop` 是雙層 while：內層跑「串流回應 → 收集 toolCall → 執行 → 塞回結果」，外層處理排隊中的 follow-up 訊息。事件流是一組固定的判別聯集（`types.ts#AgentEvent`）：`agent_start`、`turn_start`、`message_start/update/end`、`tool_execution_start/update/end`、`turn_end`、`agent_end`。

幾個值得抄的細節：

- **finish reason 的防禦**：`streamAssistantResponse` 拿到 `stopReason === "length"` 時，不執行任何 tool call，改走 `failToolCallsFromTruncatedMessage` 全部回報錯誤——因為串流時 tool call 參數是用 best-effort JSON 修復的，截斷的參數「看起來合法」最危險。
- **取消不是例外**：`AbortSignal` 一路傳進每個工具，序列執行的迴圈裡每個 tool call 之間都檢查 `signal.aborted` 就 break，已完成的結果照常入列。
- **retry 專用的入口**：`agentLoopContinue` 不加新訊息、只要求 context 最後一則是 user 或 toolResult，專門給「上一輪失敗要重試」用。

### claude-code：不信 stop_reason 的狀態機

`src/query.ts#query` 是一個 async generator，yield 串流事件和 Message，return 一個 `Terminal`（帶 `reason: 'aborted_streaming' | 'model_error' | ...`）。真正的主體 `queryLoop` 維護一個 `State` 物件，其中 `transition: Continue | undefined` 記錄「上一輪為什麼繼續」，等於把狀態機的轉移原因顯式化。

兩個我認為全場最重要的註解都在這檔：

- query.ts 第 554 行附近明講：`stop_reason === 'tool_use'` 不可靠、不一定被正確設定，真正的續跑訊號是**串流過程中實際收到過 tool_use block**（`toolUseBlocks` 陣列）。這是產品級教訓：協議欄位和現實之間有落差。
- 中止時走 `yieldMissingToolResultBlocks`，為每個沒有結果的 tool_use 合成一個 `is_error: true` 的 tool_result。沒有這步，被中斷的歷史送回 API 就是孤兒 tool_use，直接報錯。

另外它對 `max_output_tokens` 有個恢復上限（`MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3`），超過就放棄——自動重試也要有終點。

### codex：turn 是任務，錄影是基礎建設

Rust 這邊的分工更清楚。`codex-rs/core/src/tasks/regular.rs#RegularTask::run` 先發 `TurnStarted` 事件，然後 loop 呼叫 `run_turn`，直到 `input_queue` 沒有待處理輸入才返回——使用者中途打的字會變成下一輪的輸入，而不是打斷。真正的取樣迴圈在 `codex-rs/core/src/session/turn.rs#run_turn`：pre-sampling compact、hooks、`capture_step_context`、發請求，全程拿著 `CancellationToken`，取消是每個 await 點都能生效的一等公民。

持久化獨立成 `codex-rs/rollout` crate：`recorder.rs#RolloutRecorder` 把 session 錄成 JSONL，甚至有 `RolloutRecorder::resume` 直接從檔案重建；`reverse_jsonl_scanner.rs#ReverseJsonlScanner` 是個從檔尾往前掃的唯讀 scanner，還能凍結「某個 byte offset 之前的前綴」——resume 時只需要尾巴，不用讀整份歷史。這是把「append-only log 當唯一真相」做到底的設計。

## looplane 的選擇：寫入順序就是 crash 語意

looplane 的主迴圈在 `src/looplane/loop.py#AgentRunner.run`，形狀比上面三家樸素：單層 while，每步開頭檢查 cancel flag 和剩餘 wall-time，模型回應後逐一執行 tool calls。不做平行工具執行、不做 mid-turn steering——M1 的範圍決定了先求可證明正確。

但持久化這塊我做了跟三家都不同的排序。每次發事件的 `_event`（`loop.py#_event`）固定先做兩件事：

1. 把**完整的可續跑狀態**（messages、usage、step、重複動作指紋、event sequence）寫進 `session.json` manifest；
2. 才 append JSONL 事件到 `events.jsonl`。

這個順序製造了一個已知且唯一的 crash window：manifest 比 JSONL 多一個 sequence。而 `src/looplane/session.py#SessionStore.claim_and_validate_resume` 明確修復它（manifest 回退一格重存），其他一切不一致都拒絕 resume。特別是最後一筆事件若是 `tool.started` 或 `verification.started`，直接 fail closed——你無法證明那個副作用到底做完沒有，猜測不如拒絕。workspace 也要驗：Git root 存在且 HEAD 等於釘住的 base_sha，否則續跑是在錯的程式碼上繼續。

checkpoint 本體是 `loop.py#_checkpoint` 寫出的 `checkpoint.json`（`events.py#atomic_write_json` 做 temp-file + rename + directory fsync）。而 `loop.py#AgentRunner.resume` 是嚴格的 hydration：provider/model/protocol 必須相符、事件序列必須連續，然後把 `_made_changes` 保守地設回 True——因為中斷前的工作區可能有未完成的修改，最終驗證閘門必須武裝。如果死掉的時候有個審批懸著，`_reconcile_interrupted_approval` 會把它記成一個失敗的 `ToolObservation` 加一筆 `approval.abandoned` 事件，讓模型重新請求，而不是偷偷執行舊批准。

跟 ReAct 式的理想 loop 差最遠的地方，正是這些「論文不會寫」的部分：[Anthropic 的工程報告 Building effective agents](https://www.anthropic.com/research/building-effective-agents) 說得直白——agent 的可靠性來自 harness 的工程細節，不是 prompt。我的驗證閘門也一樣：就算模型自己跑過測試，收尾時照樣重跑全部宣告的檢查，失敗輸出當成不可信文字餵回去。

## 還能改善什麼

1. **沒有串流**。pi 的 `message_update` 事件和 codex 的逐項串流 UI 都建立在串流上，looplane 目前是整個回應等完才落盤，互動體感差一截，也少了「邊串邊偵測 tool call」的能力。
2. **checkpoint 成本是 O(整份歷史)**。每個事件都重寫整份 manifest，session 長了會變慢。codex 的 rollout 方案——append-only JSONL 加 reverse scanner 只讀尾部——是現成的升級路線。
3. **工具不平行**。pi 在 `executeToolCalls` 支援平行批次（除非工具宣告 sequential），唯讀工具其實很適合。
4. **取消粒度粗**。looplane 的 cancel 只在步驟邊界生效，正在跑的工具靠 timeout 兜底；AbortSignal 那種即時貫穿值得補。

系列下一篇換 workspace 隔離與 path policy——loop 之外的另一條安全線。

## 參考資料

- [badlogic/pi-mono — packages/agent](https://github.com/badlogic/pi-mono/tree/main/packages/agent) — 最小 agent loop 與事件流
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — 官方 repo（發布 minified bundle；本篇引用自社群反編譯 v2.1.88）
- [openai/codex — codex-rs/core](https://github.com/openai/codex/tree/main/codex-rs/core) 與 [codex-rs/rollout](https://github.com/openai/codex/tree/main/codex-rs/rollout) — turn 任務化與 session 錄製
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — 推理與行動交錯的原型 loop
- [Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic 的 agent 工程原則
