---
title: "跟成熟 coding agent 學設計（7）：Provider retry policy 與錯誤分類——一個 5xx 為什麼會炸掉整個 run"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 7
tags: [coding-agent, harness-engineering, llm-api, retry, error-handling, llm-agents]
lang: zh-TW
description: "拆解 pi、OMP、OpenCode、Codex、Claude Code 五家如何做 provider 錯誤分類與重試——SDK 內建 retry 與 harness 層 retry 的分工、Retry-After 的尊重、jitter 與 fallback——並對照 rivumi 從「一個 5xx 就失敗」到統一 harness 層重試的修復過程。"
tldr: "NVIDIA NIM 對某個模型間歇回 500，rivumi 的 ProviderError.retryable 只是被寫進 event log，沒有任何消費者——一個 5xx 直接把 run 標成 FAILED，TUI 只顯示「provider retryable」。五家參考專案都把重試收在 harness 層：pi 明文要求把 SDK 的 max_retries 設成 0 再自己包可中斷的重試；OpenCode 連「SDK 沒標記可重試的 5xx」也強制重試；Claude Code 用 x-should-retry header 加 10 次上限。rivumi 的修法是同一條路：AsyncOpenAI max_retries=0、3 次指數退避（1s/2s/4s）、取 max(backoff, Retry-After)、退避中被取消會提前醒來、每次重試發 model.retry event。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-25-coding-agent-provider-retry-policy-en)

## 設計問題

這篇的起點是一個真實 bug：NVIDIA NIM 對 `nvidia/nemotron-3-ultra-550b-a55b` 間歇性回 500 和 503 overloaded。模型 ID 有效、payload 相容（用真實程式路徑重放驗證過），但 rivumi 的 run 就是一次一次地標成 FAILED，TUI 上只留下一行毫無資訊量的「Error: provider retryable」。

診斷報告（`rivumi/docs/diagnoses/nim-500-diagnosis.md`）拆出來的事實很難堪：錯誤分類早就存在——`rivumi/src/rivumi/models.py#_error_kind` 把 status code >= 500 分到 `RETRYABLE`，`ProviderError.retryable` property 也定義正確——但這個欄位**只是被寫進 event log，沒有任何消費者**。全 repo 找不到任何以 `exc.retryable` 為條件的迴圈或 backoff。唯一在運作的重試是 openai SDK 內建的 `DEFAULT_MAX_RETRIES = 2`，藏在使用者看不見的地方：SDK 悄悄重試兩次、用盡之後 raise，harness 層立刻放棄整個 run。

所以「一個 5xx 為什麼會炸掉整個 run」的完整答案有三層：分類沒有消費者、真正的重試被 SDK 偷偷做了（不可觀測、不可調整）、失敗呈現只給了分類名稱而不是給人看的訊息。這三件事剛好就是 retry policy 設計的三個核心：**誰負責重試、重試要可觀測、放棄時要說人話**。

## 五家怎麼做

### pi：兩層分工寫進文件註解

pi 是五家裡把「SDK retry vs harness retry」講得最白的。`pi-mono/packages/ai/src/utils/provider-retry.ts#retryProviderRequest` 的註解直接說：OpenAI 和 Anthropic SDK 的內建重試計時器不理會 AbortSignal，所以呼叫端必須把 SDK 設成 `maxRetries: 0`，再用這個 helper 包一層**可中斷**的重試。它鏡像了 SDK 的判定（`x-should-retry` header、408/409/429/5xx），延遲優先取 `retry-after-ms` / `retry-after` header（超過 60 秒上限就直接失敗），否則指數退避加負向 jitter。實際接線看得到：`pi-mono/packages/ai/src/api/openai-responses.ts#retryProviderRequest` 和 `anthropic-messages.ts#retryProviderRequest` 都先設 `maxRetries: 0`。

第二層在 harness：`pi-mono/packages/ai/src/utils/retry.ts#isRetryableAssistantError` 用字串 pattern 分類已經正規化的錯誤訊息——5xx、overloaded、連線斷掉、stream 提前結束都算可重試，但 `insufficient_quota`、billing 這類帳戶級限額明確列為**不可**重試。`pi-mono/packages/ai/src/utils/retry.ts#retryAssistantCall` 則按 `RetryPolicy`（預設 3 次、base 2000ms）跑指數退避，每次排程重試都發 callback，退避中收到 abort 會正常收斂成 aborted 結果。

### omp：分類最細，重試和憑證輪換分家

OMP 把錯誤分類推到極致。`oh-my-pi/packages/ai/src/error/retryable.ts#isTransientStatus` 定義純狀態碼判定（408/429/>=500），`oh-my-pi/packages/ai/src/error/retryable.ts#isProviderRetryableError` 再疊上傳輸層 pattern、stream 解析錯誤、以及 provider 專屬 hook。關鍵決策寫在註解裡：帳戶級 usage limit **故意**不在秒級 backoff 裡處理，那是憑證輪換層（credential rotation）的責任。backoff 也按原因分流：`oh-my-pi/packages/ai/src/error/rate-limit.ts#calculateRateLimitBackoffMs` 給 quota 用盡 30 分鐘、rate limit 30 秒、concurrency cap 只有 5 秒。harness 層的 `oh-my-pi/packages/coding-agent/src/session/retry-fallback-chains.ts#calculateRetryBackoffDelayMs` 做指數退避但封頂 8 秒加 25% jitter，`turn-recovery.ts` 裡 provider 的 retry-after 是權威值、沒有 hint 才退回啟發式視窗，重試預算用完還能沿 fallback chain 換模型。

### opencode：「SDK 說不能重試」不一定是真的

`opencode/packages/opencode/src/session/retry.ts#retryable` 有一個很務實的判斷：5xx 一律重試，「即使 provider SDK 沒有標記它可重試」。更極端的是 `opencode/packages/opencode/src/provider/error.ts#isOpenAiErrorRetryable`——OpenAI 有時會對實際存在的模型回 404，所以 OpenCode 乾脆把 404 也當可重試。政策本體 `opencode/packages/opencode/src/session/retry.ts#policy` 用 Effect Schedule 實作：最多 5 次、初始 2 秒、因子 2、25% jitter；有 response headers 時 `retry-after-ms` 和 `retry-after`（含 HTTP-date 格式）是權威延遲，沒有 header 就把退避封頂在 30 秒。context overflow 永遠不重試，免費額度用盡則轉成一個帶升級連結的 UI action 而不是無腦重試。

### codex：stream 重試、transport fallback、讓使用者看得見

Codex 在 Rust 端把重試做成三件套。基礎退避在 `codex/codex-rs/core/src/util.rs#backoff`（200ms 起、乘 2、±10% jitter），HTTP 層的分類開關在 `codex/codex-rs/codex-client/src/retry.rs#RetryOn`（retry_429 / retry_5xx / retry_transport 三個 flag）。stream 層 `codex/codex-rs/core/src/responses_retry.rs#handle_retryable_response_stream_error` 最有意思：伺服器給的 `err.retry_delay()` 優先於自己的 backoff；重試次數用完時先嘗試從 WebSocket fallback 到 HTTPS transport 再繼續；還有一個 feature flag 可以對純連線失敗做無上限重試（5 秒起步、封頂 60 秒）。每次重試都會送出「Reconnecting... n/max」事件——註解明說是為了讓使用者知道畫面不是凍住了。

### claude-code：header 權威、來源感知、防放大

Claude Code 的 `claude-code-source/src/services/api/withRetry.ts#withRetry` 是單檔八百行的重試總集：預設最多 10 次（`claude-code-source/src/services/api/withRetry.ts#getDefaultMaxRetries` 可用環境變數覆寫）、500ms base、封頂 32 秒加最多 25% 正向 jitter（`claude-code-source/src/services/api/withRetry.ts#getRetryDelay`）。`claude-code-source/src/services/api/withRetry.ts#shouldRetry` 先尊重非標準的 `x-should-retry` header，再按 408/409/429/5xx/連線錯誤分類，401 時清快取並在迴圈內刷新 OAuth token。兩個獨到的設計：一是**來源感知**——背景任務（摘要、標題、分類器）撞到 529 一律立即放棄，因為容量風暴時每次重試都是 3 到 10 倍的 gateway 放大；二是連續三次 529 就觸發模型 fallback（`FallbackTriggeredError`）。無人值守模式還能把退避拉長到五分鐘、切成 30 秒心跳塊避免 host 判定 idle。

## rivumi 的選擇與差異

修復遵循 pi 的路線但更精簡：**所有重試統一收到 harness 層**。所有 `AsyncOpenAI` client 都設 `max_retries=0`（`rivumi/src/rivumi/models.py` 的 `AsyncOpenAI` 建構處，`provider_verification.py:144` 同步），註解寫明理由：SDK 內建重試會把上游請求乘出 3×3，而且繞過 audit trail。

harness 層的核心是 `rivumi/src/rivumi/loop.py#_complete_model_with_retry`：每個模型 step 最多 3 次嘗試，只有 `exc.retryable`（RETRYABLE 或 RATE_LIMIT）會重試，AUTH 和 INVALID_REQUEST 立即 re-raise。延遲取 `max(backoff[attempt], retry_after_seconds)`——退避表固定 1s/2s/4s，但伺服器的 `Retry-After` 說了算。兩個細節值得說：退避等待用 `rivumi/src/rivumi/loop.py#_backoff_sleep` 以 `asyncio.wait` 實作，使用者取消會提前醒來、下一次嘗試立即觀察到取消訊號，run 走原本的 CANCELLED 路徑；每次重試前發 `model.retry` event（帶 attempt、provider、error、delay_seconds），事後可以從 events.jsonl 完整重播一次 run 的重試歷史。

放棄之後的呈現也修了：`loop.py` 的 `except ProviderError` 路徑現在組出「nvidia-nim failed 3 consecutive model requests (500, 503, 500); the service is temporarily unavailable...」這種人類可讀訊息填進 `RunResult.error`，TUI 顯示它而不是「provider retryable」；`terminal_reason="provider_retryable"` 原樣保留當機器可讀欄位。

跟五家比起來，rivumi 目前刻意簡單：沒有 jitter、沒有憑證輪換、沒有 transport fallback、也沒有來源感知的重試預算。這些不是疏忽，是階段取捨——先把「分類有消費者、重試可觀測、放棄說人話」這三件事做對。

## 學術依據

指數退避加 jitter 不是品味問題。[AWS Architecture Blog 的〈Exponential Backoff And Jitter〉](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)用實測數據說明：故障恢復期間所有 client 若用相同的固定退避，會形成同步波峰持續打爆 server，「full jitter」能把完成時間砍掉一個量級。這正是 Claude Code、OpenCode、codex 都加 jitter、而 rivumi 還沒加的原因。[Google SRE Book 第 22 章〈Addressing Cascading Failures〉](https://sre.google/sre-book/addressing-cascading-failures/)則把 retry 視為潛在的放大器，主張用 retry budget（例如「重試請求不得超過總請求的 10%」）限制系統在過載時的自我傷害——Claude Code 對背景任務直接禁止重試 529，就是同一思想的具體化。至於 `Retry-After` 本身，語意由 [MDN 的 HTTP 文件](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)定義：它是伺服器的指令，不是建議——五家全部把它當權威延遲，pi 甚至對超過 60 秒的伺服器指定延遲直接失敗而不是硬等。

## 改善路線

1. **加 jitter**。rivumi 的 1s/2s/4s 是確定性的，多個 run 同時失敗會同步重試。照 AWS 文章做 full jitter（`random(0, backoff)`）是一行改動。
2. **跨 step 的 retry budget**。目前每個模型 step 各有 3 次額度，一個 run 幾十個 step 理論上可以吞幾百次 5xx。SRE 式的全局 budget（連續失敗率超過門檻就提前放棄整個 run）更符合過載語意。
3. **fallback chain**。連續重試耗盡後，OMP 換模型、codex 換 transport、claude-code 換 fallback model；rivumi 已有 runtime registry，連續 provider 失敗時在 status 列提示切換是最小版本。
4. **per-provider 政策表**。NIM 免費額度本來就不穩，OMP 的「按原因分流 backoff」和 pi 的 settings（maxRetries/baseDelayMs 可設定）都指向同一個方向：重試參數應該跟著 provider 走，而不是全域常數。

一句話總結：**retry policy 的本質不是「多試幾次」，而是把「哪些錯誤值得再賭一次」變成分類明確、延遲聽伺服器的、每一次嘗試都可觀測的決策——然後在放棄時，好好告訴人類發生了什麼。**

## 參考資料

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)（`packages/ai/src/utils/provider-retry.ts`、`packages/ai/src/utils/retry.ts`）
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)（`packages/ai/src/error/retryable.ts`、`packages/ai/src/error/rate-limit.ts`）
- [sst/opencode](https://github.com/sst/opencode)（`packages/opencode/src/session/retry.ts`）
- [openai/codex](https://github.com/openai/codex)（`codex-rs/core/src/responses_retry.rs`、`codex-client/src/retry.rs`）
- [anthropics/claude-code](https://github.com/anthropics/claude-code)（decompiled v2.1.88，`src/services/api/withRetry.ts`）
- [AWS Architecture Blog: Exponential Backoff and Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Google SRE Book: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)
- [MDN: Retry-After header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
- [OpenAI API: Rate limits 與錯誤處理文件](https://platform.openai.com/docs/guides/rate-limits)
