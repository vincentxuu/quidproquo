---
title: "跟成熟 coding agent 學設計（33）：Session 錄製與 replay——錄了，卻放不出來"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 33
tags: [coding-agent, session-replay, observability, rivumi, codex, trace]
lang: zh-TW
tldr: "codex 的 rollout-trace 把『觀察』和『解讀』切成兩段：執行期只寫 raw event spine，事後用確定性的 reducer 重播成狀態圖；omp 的 metaharness 把每次 run 的 trace 放進 SQLite 加 dashboard，還能叫便宜模型把 trace 寫成敘事報告；pi 要求每個工具宣告 replay 是 safe 還是 never，resume 時才知道哪些步驟可以重跑。rivumi 的 JSONL 素材都在，但沒有任何東西能把錄好的事件『放』出來——這是本篇的缺口。"
description: "對照 codex、omp、opencode、pi、claude-code 的 session 錄製與 replay 機制，整理 observe-first 設計、trace 儲存與重播策略，提出 rivumi 的設計草案。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-session-recording-replay-en)

系列第二部第 33 篇。前一篇講 compaction，這篇換一個看起來「早就做了」的題目：session 錄製。

先交代取證範圍：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88）。所有引用都是我在本地 clone 實際 grep 過的。

## 能力問題：素材都在，就是放不出來

rivumi 其實已經錄得很勤。每個 run 目錄有 `events.jsonl`（`loop.py#EventWriter`），conversation 有自己的事件流，crash recovery 也靠這些檔案。問題是這些錄影帶只能**事後用眼睛讀**：想重演一次 run、在第三個 tool call 前停下來看看當時的狀態、或問「這個爛輸出到底是哪個請求產生的」——沒有任何指令做得到。

錄製和 replay 是兩種能力。錄製考驗寫入端的紀律（不丟事件、不拖慢主流程），replay 考驗的是**解讀端的工程**：誰負責把一串 raw 事件折疊回可檢視的狀態？哪些步驟可以重新執行、哪些絕對不行？五家專案在這兩端各有值得抄的設計。

## 五家怎麼做

### codex：observe first, interpret later

`codex-rs/rollout-trace` 的 README 開宗明義：「關鍵設計選擇是 observe first, interpret later」。hot path 不邊跑邊建圖，只透過 `codex-rs/rollout-trace/src/writer.rs#TraceWriter` 把有序的 raw 事件寫進 bundle——`manifest.json`、`trace.jsonl` 事件主幹、`payloads/*.json` 放大型原始證據（完整的請求回應、終端機輸出）。大 payload 先落盤、事件裡只留引用，主幹保持輕。

真正的 replay 在離線端：`codex-rs/rollout-trace/src/reducer/mod.rs#replay_bundle` 是一個**確定性 reducer**，把 bundle 折疊成 `state.json`——不是 transcript，而是一張圖：model-visible 對話、inference_calls、tool_calls、terminals，加上 `interaction_edges`（哪個請求生出了哪個 tool call、哪個 cell 發了巢狀呼叫）。縮減後的快取就放在 bundle 旁邊（`bundle.rs#REDUCED_STATE_FILE_NAME`），不用每次重算。

三個紀律值得整段抄：第一，整條路徑 opt-in，靠 `CODEX_ROLLOUT_TRACE_ROOT` 環境變數開啟，且明文聲明這不是 telemetry、不會上傳；第二，trace 寫入 best-effort，「診斷記錄失敗絕不該讓 session 失敗」；第三，未啟用的 context 也接受同樣的呼叫、只是什麼都不記，所以 hot path 不用寫 if。

至於 resume 面，[session persistence 那篇](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)已經寫過 rollout 檔案格式，這裡只補執行面：`codex-rs/thread-store/src/store.rs#ThreadStore` 把持久化收斂成一個 storage-neutral trait——`resume_thread` 重開 live writer、`persist_thread` 帶 `PersistContext::Standard | TurnStart` 兩級耐久性、fork/revert 都是「thread id 不變、開新 rollout 檔」，甚至能用 `ReadThreadByRolloutPathParams` 直接從 rollout 檔案路徑開 thread。錄製格式和存取介面是同一份契約。

### omp：trace 進資料庫，報告交給模型

omp 的 `packages/metaharness` 把「實驗 → run → trace」做成統一模型：SQLite store（`src/store.ts#RunStore`）之上開 REST/SSE API 和 dashboard，任何 benchmark adapter 都正規化成同一種 trace 格式，`GET /api/runs/:name/traces/:trace?raw=1` 可以在正規化視圖和原生證據之間切換。

更有意思的是 `scripts/trace-report.ts`：把一份 trace 交給兩個便宜的 OpenRouter 模型做 map/reduce，產出敘事式的 markdown 報告。也就是說 replay 的消費端不只給人看，還可以給模型看——「幫我看這個 run 為什麼失敗」變成一條命令。

### opencode：測試工具裡的三個可搬觀念

http-recorder 本身是測試工具（testing 那篇寫過 cassette 格式），但它有三個觀念直接適用於生產環境診斷：

- **自動模式判斷**：`recorder.ts#resolveAutoMode`——CI 裡一律 replay，本地有 cassette 就 replay、沒有就 record。同一套程式碼，模式由環境決定。
- **先遮蔽再落盤**：`cassette.ts#UnsafeCassetteError` 在偵測到疑似密鑰時拒絕寫入。錄下來的東西遲早會被分享，redaction 必須發生在寫入那一刻。
- **不匹配時給 diff**：`matching.ts#requestDiff` 在 replay 失敗時直接輸出期望與實際的差異清單，而不是丟一句「不匹配」。

### pi：replay 安全性是一等公民

pi 要求每個工具宣告重跑政策：`pi-mono/packages/agent/src/harness/agent-harness.ts#HarnessTool` 的 `replay?: "never" | "safe"`——唯讀工具標 safe，有副作用的標 never。這個宣告會進 telemetry（`telemetry.ts` 的 `pi.tool.replay` 屬性）。這回答了 replay 最容易被迴避的問題：**重播時能不能重新執行工具？** 沒有這個標記，你要嘛全部不敢重跑（replay 退化成閱讀），要嘛全敢（重複副作用）。

### claude-code：SDK 消費端的事件重播

小而具體的一個例子：SDK 模式下 `--replay-user-messages` 旗標會把 stdin 收過的 user message 重新發到 stdout（`main.tsx#effectiveReplayUserMessages`），讓 stream-json 的下游在斷線重連後補齊沒收到的事件。replay 不一定要重跑 agent，有時只是把事件流**可靠地送達消費端**。

## 工程依據

「錄 raw 事件、事後解讀」正是 [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) 的標準論述：事件流是不可變的事實來源，各種投影（狀態、報表、除檢視圖）都是事後摺疊的產物，隨時可以用新版邏輯重算——codex 換 reducer 版本就能重建 state.json，不用重跑 session。確定性 record-and-replay 在系統除錯領域有成熟的先行者：[rr](https://rr-project.org/) 用「錄一次、反覆重播」把多執行緒 bug 的除錯成本壓到接近單步執行；HTTP 測試的 [VCR](https://vcrpy.readthedocs.io/) 系工具則證明了「錄下的互動 + 匹配規則 + diff 診斷」這個三元組足夠通用。metaharness 的做法另有一層意義：trace 一旦進了結構化儲存，LLM 就成了新的消費端——這和 log 分析自動化是同一個方向。

## rivumi 設計草案

如實描述現狀：`events.jsonl` 有序、有 `sequence`、pydantic frozen model 保證不可變（`events.py#RunEvent`），素材品質夠格。缺的是三樣：折疊器、檢視器、重跑政策。

**折疊器**：新增 `src/rivumi/replay.py`，核心是把現在散在 `loop.py` 裡的狀態轉移抽成純函式 reducer，live 路徑和 replay 路徑共用同一份——這是 codex「observe first」的直接翻版。`rivumi replay <run_id>` 先掃事件流，若旁邊的 `.state.json` 快取比事件新就直接用（學 `REDUCED_STATE_FILE_NAME`），否則離線折疊後寫回。

**檢視器**：第一版不必做 web dashboard。既有 `transcript_export.py` 已經能把事件渲染成文字 transcript，replay 只需在其上加時間軸巡遊：跳到第 N 個事件、展開某個 tool call 前後的完整上下文。`--report` 旗標走 provider gateway 叫便宜模型生成敘事報告（學 metaharness 的 trace-report），這一步 rivumi 幾乎免費——gateway 早就有了。

**重跑政策**：在 `tools.py` 的工具定義加 `replay: Literal["safe", "never"]` 欄位（照抄 pi），replay 分兩級——read-only 永遠可用；step-through 重執行只允許 safe 工具，never 工具顯示錄下的結果並標注「未重跑」。

**Redaction**：任何匯出／分享路徑都先過一層敏感內容遮蔽（學 `UnsafeCassetteError` 的立場：擋下來，不是警告）。這一步 rivumi 目前完全沒有，testing 那篇已經點名過。

## 與現有架構的銜接

好消息是這個缺口不需要動架構，只需要長出新模組：事件 spine（`events.py#EventWriter`）不變；`conversation.py#completed_turns` 的 replay 語意（給 provider 的歷史重建）和這裡講的 replay（給人的診斷重播）是兩件事，互不干擾；外部 CLI backend 底下的 runtime 自己錄自己的，rivumi 層的 replay 只涵蓋 adapter 觀察到的事件，範圍誠實標清楚。入口做成 `/replay <run_id>` slash command，和現有的 export 命令並列。

優先順序上我會把折疊器排最前面：它是唯一「不做，其他都是空中樓閣」的部分。檢視器和報告都可以等真除過一次 bug 之後，按實際痛點再加。

## 參考資料

- [openai/codex — codex-rs/rollout-trace](https://github.com/openai/codex/tree/main/codex-rs/rollout-trace)
- [openai/codex — codex-rs/thread-store](https://github.com/openai/codex/tree/main/codex-rs/thread-store)
- [can1357/oh-my-pi — packages/metaharness](https://github.com/can1357/oh-my-pi/tree/main/packages/metaharness)
- [sst/opencode — packages/http-recorder](https://github.com/sst/opencode/tree/dev/packages/http-recorder)
- [badlogic/pi-mono — packages/agent](https://github.com/badlogic/pi-mono/tree/main/packages/agent)
- [Martin Fowler — Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [rr — record and replay debugger](https://rr-project.org/)
- [VCR.py](https://vcrpy.readthedocs.io/)
