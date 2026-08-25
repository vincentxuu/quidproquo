---
title: "跟成熟 coding agent 學設計（34）：Telemetry 與成本追蹤——token 記了，然後呢"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 34
tags: [coding-agent, telemetry, cost-tracking, opentelemetry, rivumi]
lang: zh-TW
tldr: "五家成熟專案都把「用量」和「錢」分開記：pi 在 Usage 型別裡直接內嵌逐項 cost、omp 再把 session JSONL 同步進 SQLite 做儀表板；claude-code 用價目表 fallback 加「未知模型」誠實標記；codex 本地估 USD 之餘還向後端查權威帳單。rivumi 已有 usage 累加與 events.jsonl token 事件，缺的是價目表、cost 欄位和 schema 化的 span——補起來不難，難在別把估計值當真帳。"
description: "對照 pi、omp、opencode、codex、claude-code 五家的 telemetry 與成本追蹤設計：span schema、OTel 上報、價目表與未知模型處理，並提出 rivumi 的設計草案與銜接方式。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-telemetry-cost-tracking-en)

系列第二部的第 34 篇。前一篇講 session 錄製與 replay，這篇講一個看起來很瑣碎、但跑長任務時會突然變成大問題的能力：telemetry 與成本追蹤。

取證範圍照舊：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex Rust workspace）、claude-code（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有 `repo/path/file.ext#symbol` 都是我本地 grep 過的。

## 能力問題：usage 欄位不等於成本追蹤

每家 provider 的 API response 都帶 usage，所以任何 agent 「都有 token 數」。但 token 數回答不了三個真正的問題：

1. **這個 run 花了多少錢？** input/output/cache read/cache write 價差可以到十倍以上，只看總 token 完全看不出成本結構。
2. **錢花在哪？** 是主模型反覆重讀 context？還是 compaction 或 subagent 的隱形呼叫？沒有 per-model、per-span 歸因就答不出來。
3. **數字可不可信？** 自訂模型、訂閱額度、快取計價改版，都會讓本地估算失真。使用者需要知道眼前這個數字是精算還是猜的。

rivumi 目前的盤點如實說：`contracts.py#Usage` 有正規化的 input/output/cached_input/reasoning tokens；`loop.py` 每輪用 `_add_usage` 累加、寫進 checkpoint 和 RunResult，`model.completed` 事件也帶 per-turn usage；啟動路徑有 env 開關的 `_StartupTracer`。但全 repo grep `cost` 只命中無關檔案——**有用量、零成本**。

## 五家怎麼做

### pi：型別裡直接內嵌成本，schema 定義 span 字彙

pi 的做法最乾淨：`pi-mono/packages/ai/src/types.ts#Usage` 不只有 token 數，還內嵌一組逐項 cost（input/output/cacheRead/cacheWrite/total），由 `pi-mono/packages/ai/src/models.ts#calculateCost` 在收到回應時就地算好——支援 tiered pricing，連 Anthropic 1h cache write 按 base input 兩倍計費的細節都寫死在公式裡。也就是說，**成本是 usage 的一部分，不是事後另算的報表**。

遙測方面，`pi-mono/packages/telemetry/src/index.ts#TelemetryContext` 定義了 span 抽象（startSpan/setAttributes/setStatus），再用 `defineTelemetrySchema` 把 span 名稱、屬性、必填性做成型別級 schema。`pi-mono/packages/agent/src/harness/telemetry.ts#AI_TELEMETRY_SCHEMA` 據此宣告 `pi.ai.request` span 的結束屬性：input/cache_read/cache_write/reasoning tokens 之外，直接有一條 `pi.ai.usage.cost`。預設實作是 `NOOP_TELEMETRY_CONTEXT`，不接後端就是零開銷。

### omp：session JSONL 當資料來源，SQLite 做儀表板

omp 是 pi 的 fork，繼承了 usage.cost 內嵌，然後往上疊了一整個 stats 套件：`oh-my-pi/packages/stats/src/parser.ts` 從 session JSONL 讀出每則 assistant message 的 rawUsage.cost，`oh-my-pi/packages/stats/src/aggregator.ts#syncAllSessions` 增量同步進 SQLite，`db.ts` 的 messages 表格直接開 cost_input / cost_output / cost_cache_read / cost_cache_write / cost_total 欄位，再由 `aggregator.ts#getCostDashboardStats` 出時間序列。它甚至處理了「舊資料當時沒算 cost」的回填問題（COST_REINGEST_BACKFILL_KEY）。這是「離線聚合」路線的代表：runtime 只負責把數字寫進 log，分析交給事後批次。

### opencode：正規化先行，計價含 tiered 與供應商特例

`opencode/packages/opencode/src/session/session.ts#getUsage` 是一份值得逐行讀的正規化程式碼：AI SDK v6 已把 cached tokens 併入 inputTokens，所以先減回去才能分開計價；reasoning 從 output 裡拆出來按 output 價計；cache write 對不同 provider 從各自的 metadata 位址撈。計價用 Decimal 精確累加，支援 `model.cost.tiers` 的 context 分段定價，遇到 Copilot 這種直接給 `totalNanoAiu` 的供應商就跳過自算、原樣換算。資料落進 SQLite session 表的 tokens_* 與 cost 欄位。

### codex：本地估計 + 後端權威帳單雙軌

codex 的 Rust workspace 有獨立的 `codex-rs/otel` crate。`codex-rs/otel/src/events/session_telemetry.rs#record_responses` 把 token 數記到 OpenTelemetry span 屬性上，而且刻意用了 gen_ai 語意慣例的屬性名（`gen_ai.usage.input_tokens`、`gen_ai.usage.cache_read.input_tokens`）；`SessionTelemetry.record_turn_cost` 另發一個 `codex.turn_cost` 事件帶 `usage.estimated_usd`。有趣的是它不自欺：TUI 顯示的 `/status` 用量卡（`codex-rs/tui/src/status/thread_usage.rs#format_estimated_usd_micros`）標明 estimated，而 `codex-rs/app-server/src/turn_cost_worker.rs` 會背景輪詢後端拿 ApiKeyTurnCost 的**權威數字**再回填卡片。本地估計求即時，真帳求準確，兩者分開呈現。

### claude-code：價目表、fallback 誠實標記、exit hook 落盤

`claude-code-source/src/utils/modelCost.ts#MODEL_COSTS` 維護一張按 model short name 索引的價目表（$3/$15 Sonnet tier、$15/$75 Opus tier 等，含 cache read/write 與 web search 計價）。查不到模型時不是報錯也不是裝沒事，而是套用 `DEFAULT_UNKNOWN_MODEL_COST` 並設下 `hasUnknownModelCost` 旗標——所以 `cost-tracker.ts#formatTotalCost` 會印出「costs may be inaccurate due to usage of unknown models」。累加入口在 `src/cost-tracker.ts#addToTotalSessionCost`：per-model usage 累加之外，同時把 cost 與各類 token 餵給 OpenTelemetry counter（`getCostCounter().add(cost, {model})`、`getTokenCounter()` 按 type=input/output/cacheRead/cacheCreation 打點），advisor 子呼叫的成本也遞迴歸進總帳。離開時 `src/costHook.ts#useCostSummary` 在 process exit 印總結、並透過 `saveCurrentSessionCosts` 存進 project config，讓 resume 能靠 `restoreCostStateForSession` 接回累計。

## 工程依據

五家的共同收斂點，正好對上 OpenTelemetry 的 gen-ai 語意慣例：屬性名用 `gen_ai.usage.*`、token 分 input/output/cache 三路記、cost 作為衍生指標而非原始事件。[OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) 明確要求 usage 屬性分項命名，[OTLP](https://opentelemetry.io/docs/specs/otlp/) 則是各家 exporter 的共通出口——codex 直接用 otel crate 對接，claude-code 的 counter 抽象也是同構的。價目表維護則依賴 [models.dev](https://models.dev) 這類社群目錄（pi 與 opencode 的 model catalog 都源自它）或官方 pricing page 手工同步。

## rivumi 設計草案

照 rivumi 的品味（契約優先、stdlib、零依賴預設），我會這樣做：

1. **Usage 旁邊加 CostBreakdown**。`contracts.py` 新增 `CostBreakdown(input=..., output=..., cache_read=..., cache_write=..., total=...)`，由 adapter 在收到回應時計好掛到 turn 上，不改動 Usage 本身的語意（cached_input 是 input 子集那條規則保持不變）。計價函式對齊 pi 的 `calculateCost`：純函式、tiered、測得起來。
2. **價目表進 model_catalog**。靜態 dict + 使用者 override，查不到的模型回 `None` 並設 `has_unknown_model_cost` 旗標——學 claude-code 的誠實路線，絕不硬掰一個數字。
3. **事件流零新概念**。events.jsonl 已是 append-only JSONL，`model.completed` 已帶 per-turn usage；加上 cost 欄位即可，RunResult 加 `cost_total`。omp 證明了「log 寫好、分析事後」就夠用。
4. **startup_trace 泛化成 opt-in tracer**。把 `_StartupTracer.span(name)` 推廣成帶屬性的 span（env 開關、stderr/file sink、stdlib-only 都保留），屬性名對齊 `gen_ai.*` 慣例，未來要接 OTel collector 只是換 sink。
5. **外部 CLI backend 別丟帳單**。現在 `claude_backend.py` 解析 result 事件時只留 is_error 和 subtype，CLI 回傳的 `total_cost_usd` 和 usage 直接被扔掉。先把它們放進 event data，這是成本最低的一步。

## 與現有架構的銜接

這份草案幾乎不碰現有骨架：累加點已經存在（loop 的 `_add_usage`），持久化格式已經存在（checkpoint、RunResult、events.jsonl），唯一的新東西是價目表和一個純函式。順序上我會先做第 5 點（外部 backend 保真）→ 第 1、2 點（native path 的 cost）→ 第 3 點（事件欄位）→ 第 4 點（tracer 泛化），每步都能獨立驗證。

真正要守住的原則只有一句，也是五家共同的教訓：**估計值永遠標明是估計值**。claude-code 的 inaccurate 提示、codex 的 estimated vs. 權威帳單雙軌，都是為了不讓使用者把猜的數字當成帳單。telemetry 可以事後補，信任壞了很難修。

## 參考資料

- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — `gen_ai.usage.*` 屬性命名的規範來源
- [OpenTelemetry OTLP specification](https://opentelemetry.io/docs/specs/otlp/) — telemetry export 的共通協定
- [badlogic/pi-mono packages/telemetry](https://github.com/badlogic/pi-mono/tree/main/packages/telemetry) — span schema 型別化的完整實作
- [openai/codex codex-rs/otel](https://github.com/openai/codex/tree/main/codex-rs/otel) — Rust 側 OpenTelemetry 上報與 turn cost 事件
- [can1357/oh-my-pi packages/stats](https://github.com/can1357/oh-my-pi/tree/main/packages/stats) — session JSONL → SQLite 成本儀表板
- [Anthropic pricing](https://docs.claude.com/en/docs/about-claude/pricing) — cache read/write 分項計價的官方依據
- [models.dev](https://models.dev/) — pi / opencode model catalog 與價目的社群資料源
