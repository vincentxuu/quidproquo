# LLM Provider 可用性測試與完整模型清單

日期：2026-08-26
狀態：以 `test-llm` 端點實測修正

## ⚠️ 重要修正

之前用 `POST /api/deep-research`（planner-only）測出的結果是**不可靠的**——deep research API 在 model 失敗時可能走 fallback 或 cached response，回 200 不代表該 model 真的被呼叫。

本次用 `POST /api/admin/flows/test-llm` 重測——這個端點**直接打 provider API**，不走 fallback，結果才是真的。

---

## 各家 Free Model Rate Limit

| Provider | Free Tier 限制 | 安全間隔 | 備註 |
|---|---|---|---|
| **OpenRouter** | 20 req/min, 200 req/day | 3s/req | per-model 限制，無需信用卡 |
| **OpenCode Zen** | 滑動窗口，`retry-after` 回報 ~12.7hr | 不要密集打（<10 req/hr） | 實測被 64 次打爆後 `retry-after: 45660s`（12.7hr）。Pro $9.99/月無限制 |
| **NVIDIA NIM** | 40 RPM, ~1000 req/月 | 1.5s/req | 可申請提升到 200 RPM |
| **Groq** | 依 model 不同 | 視 model | deprecated models 隨時下架 |
| **Gemini** | 1500 req/day (Flash), 50 req/day (Pro) | 1s/req (Flash) | |
| **Cerebras** | 需付費 | — | free tier 已關閉 |

---

## 實測結果（test-llm 端點，2026-08-26）

### 各 Provider 真實可用性

| Provider | 狀態 | 能用的 model | 問題 |
|---|---|---|---|
| **Groq** | ⚠️ | `openai/gpt-oss-20b` ✅ 314ms | gpt-oss-120b timeout |
| **OpenRouter** | ⚠️ | 5/21 free pass（見下方明細） | 部分 free 429 rate limit，7 個 timeout |
| **NVIDIA** | ⚠️ | 18/83 pass（見下方明細） | 65 個快速 ❌（~70ms，可能 credits 耗盡），免費額度 40 RPM / ~1000 req/月 |
| **Gemini** | ✅ | `gemini-3.6-flash` ✅ 5436ms | 3.5 和 3.7 timeout |
| **OpenCode** | ❌ | 無 | free rate limit 用完，paid 沒付款方式 |
| **Cerebras** | ❌ | 無 | payment required |
| **OpenAI** | ❌ | 無 | API key 不存在 |

### test-llm 逐項結果

#### OpenCode Zen（0/16 pass）

| Model ID | HTTP | Latency | Error |
|---|---|---|---|
| `opencode/deepseek-v4-flash-free` | 401 | 71ms | FreeUsageLimitError: rate limit exceeded |
| `opencode/mimo-v2.5-free` | 401 | 80ms | FreeUsageLimitError |
| `opencode/hy3-free` | 401 | 76ms | FreeUsageLimitError |
| `opencode/laguna-s-2.1-free` | 401 | 77ms | FreeUsageLimitError |
| `opencode/nemotron-3-ultra-free` | 401 | 1087ms | FreeUsageLimitError |
| `opencode/nemotron-3.5-lightning-free` | 401 | 74ms | FreeUsageLimitError |
| `opencode/big-pickle` | 401 | 348ms | FreeUsageLimitError |
| `opencode/muse-spark-1.2-contributor-free` | 401 | 71ms | FreeUsageLimitError |
| `opencode/deepseek-v4-flash` | 401 | 99ms | CreditsError: No payment method |
| `opencode/grok-4.5` | 401 | 104ms | CreditsError |
| `opencode/claude-opus-5` | 401 | 91ms | CreditsError |
| `opencode/gpt-5.6-luna` | 401 | 125ms | CreditsError |
| `opencode/gemini-3.7-flash` | 401 | 98ms | CreditsError |
| `opencode/qwen3.6-plus` | 401 | 93ms | CreditsError |
| `opencode/kimi-k3` | 401 | 130ms | CreditsError |

#### Groq

| Model ID | HTTP | Latency | Error |
|---|---|---|---|
| `groq/openai/gpt-oss-20b` | ✅ 200 | 314ms | |
| `groq/openai/gpt-oss-120b` | ❌ | timeout | |
| `groq/qwen/qwen3.6-27b` | ❌ | timeout | |

#### OpenRouter — 全 21 個 free/$0 model 實測（test-llm，3s 間隔）

| Model ID | Status | Latency | Rate Limit | Error |
|---|---|---|---|---|
| `cohere/north-mini-code:free` | ⏱️ | >30s | — | timeout |
| `dots-studio/dots-3-note-preview:free` | ⏱️ | >30s | — | timeout |
| `google/gemma-4-26b-a4b-it:free` | ❌ | 127ms | — | 429 rate limit |
| `google/gemma-4-31b-it:free` | ❌ | 67ms | — | 429 rate limit |
| `google/lyria-3-clip-preview` | ⏱️ | >30s | — | timeout（音樂生成？） |
| `google/lyria-3-pro-preview` | ⏱️ | >30s | — | timeout（音樂生成？） |
| `liquid/lfm-2.5-2.6b:free` | ⏱️ | >30s | — | timeout |
| `minimax/minimax-m2.7:free` | ❌ | 2217ms | — | 429 rate limit |
| `minimax/minimax-m3:free` | ✅ | 2179ms | — | |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | ✅ | 93ms | — | **最快** |
| `nvidia/nemotron-3-super-120b-a12b:free` | ⏱️ | >30s | — | timeout |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | ✅ | 343ms | — | 550B |
| `nvidia/nemotron-3.5-content-safety:free` | ✅ | 235ms | — | 安全分類用 |
| `nvidia/nemotron-3.5-lightning:free` | ⏱️ | >30s | — | timeout |
| `openrouter/free` | ⏱️ | >30s | — | timeout（auto router） |
| `poolside/laguna-s-2.1:free` | ❌ | 245ms | — | 429 rate limit |
| `poolside/laguna-xs-2.1:free` | ✅ | 258ms | — | |
| `stealth/ox-alpha` | ❌ | 213ms | — | 429 rate limit |
| `thinkingmachines/inkling-small:free` | ❌ | 16ms | — | "only available on agentic" |
| `thinkingmachines/inkling:free` | ❌ | 16ms | — | "only available on agentic" |
| `z-ai/glm-5.2:free` | ❌ | 293ms | `retry-after: 5` | 429 rate limit |

**第一次通過（5/21）：** nemotron-3-nano-omni (93ms)、nemotron-3-ultra (343ms)、nemotron-3.5-content-safety (235ms)、laguna-xs-2.1 (258ms)、minimax-m3 (2.2s)

#### Retry 結果（間隔 5s，針對第一輪失敗的 14 個）

| Model ID | Retry | Latency | Notes |
|---|---|---|---|
| `cohere/north-mini-code:free` | ✅ | 495ms | 第一次 timeout，retry pass |
| `liquid/lfm-2.5-2.6b:free` | ✅ | 1132ms | 第一次 timeout，retry pass |
| `minimax/minimax-m2.7:free` | ✅ | 1264ms | 第一次 429，retry pass |
| `nvidia/nemotron-3-super-120b-a12b:free` | ✅ | 90ms | 第一次 timeout，retry pass，**很快** |
| `openrouter/free` | ✅ | 2338ms | 第一次 timeout，retry pass（auto router） |
| `poolside/laguna-s-2.1:free` | ✅ | 874ms | 第一次 429，retry pass |
| `dots-studio/dots-3-note-preview:free` | ⏱️ | >30s | 仍 timeout |
| `google/gemma-4-26b-a4b-it:free` | ❌ | 77ms | 仍 429 |
| `google/gemma-4-31b-it:free` | ❌ | 223ms | 仍 429 |
| `google/lyria-3-clip-preview` | ⏱️ | >30s | 音樂生成，非 chat |
| `google/lyria-3-pro-preview` | ⏱️ | >30s | 音樂生成，非 chat |
| `nvidia/nemotron-3.5-lightning:free` | ⏱️ | >30s | 仍 timeout |
| `stealth/ox-alpha` | ⏱️ | >30s | 仍 timeout |
| `z-ai/glm-5.2:free` | ❌ | 277ms | 仍 429 |

**含 retry 後能用（11/21）：** nemotron-3-nano-omni (93ms)、nemotron-3-super (90ms)、nemotron-3-ultra (343ms)、nemotron-3.5-content-safety (235ms)、cohere/north-mini-code (495ms)、laguna-xs-2.1 (258ms)、laguna-s-2.1 (874ms)、liquid/lfm-2.5-2.6b (1.1s)、minimax-m2.7 (1.3s)、minimax-m3 (2.2s)、openrouter/free (2.3s)

#### 3 輪 Retry 結果（間隔 10s，針對仍失敗的 10 個）

| Model ID | R1 | R2 | R3 | 結論 |
|---|---|---|---|---|
| `dots-studio/dots-3-note-preview:free` | ⏱️ | ✅ 634ms | ⏱️ | ⚠️ 不穩定但能用 |
| `google/gemma-4-26b-a4b-it:free` | ❌ | ✅ 698ms | ✅ 643ms | ⚠️ 不穩定但能用 |
| `google/gemma-4-31b-it:free` | ❌ | ❌ | ❌ | ❌ 持續 429 |
| `google/lyria-3-clip-preview` | ⏱️ | ⏱️ | ⏱️ | ❌ 非 chat model（音樂生成） |
| `google/lyria-3-pro-preview` | ⏱️ | ⏱️ | ⏱️ | ❌ 非 chat model（音樂生成） |
| `nvidia/nemotron-3.5-lightning:free` | ⏱️ | ⏱️ | ⏱️ | ❌ 持續 timeout |
| `stealth/ox-alpha` | ❌ | ⏱️ | ⏱️ | ❌ 不穩定且多數失敗 |
| `z-ai/glm-5.2:free` | ✅ 273ms | ❌ | ❌ | ⚠️ 偶爾能用（1/3 pass） |
| `thinkingmachines/inkling-small:free` | ❌ | ❌ | ❌ | ❌ "only available on agentic" |
| `thinkingmachines/inkling:free` | ❌ | ❌ | ❌ | ❌ "only available on agentic" |

#### 最終 OpenRouter Free Model 總結（含所有 retry）

| 分類 | 數量 | Models |
|---|---|---|
| ✅ 穩定能用 | 11 | nemotron-3-nano-omni (93ms)、nemotron-3-super (90ms)、nemotron-3-ultra (343ms)、nemotron-3.5-content-safety (235ms)、cohere/north-mini-code (495ms)、laguna-xs-2.1 (258ms)、laguna-s-2.1 (874ms)、liquid/lfm-2.5-2.6b (1.1s)、minimax-m2.7 (1.3s)、minimax-m3 (2.2s)、openrouter/free (2.3s) |
| ⚠️ 不穩定但能用 | 3 | dots-studio/dots-3-note (偶爾 timeout)、gemma-4-26b (偶爾 429)、z-ai/glm-5.2 (1/3 pass) |
| ❌ 不能用 | 7 | gemma-4-31b (持續 429)、lyria-clip/pro (非 chat)、nemotron-3.5-lightning (timeout)、stealth/ox-alpha、thinkingmachines/inkling x2 (agentic only) |

#### NVIDIA NIM — 全 83 model × 3 輪 retry（test-llm，5s 間隔）

**18/83 pass（21.7%）。** 65 個快速失敗（~70ms），可能是 free credits 被之前的測試耗盡。

##### ✅ 能用（18 個）

| Model ID | R1 | R2 | R3 | Best Latency |
|---|---|---|---|---|
| `nvidia/nemotron-3.5-content-safety` | ✅ | ✅ | ✅ | 328ms（穩定） |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | ✅ | ❌ | ✅ | 386ms |
| `nvidia/llama-3.1-nemoguard-8b-content-safety` | ✅ | ✅ | ✅ | 432ms（穩定） |
| `nvidia/riva-translate-4b-instruct-v1.1` | ✅ | ⏱️ | ✅ | 451ms |
| `nvidia/riva-translate-4b-instruct-v2` | ✅ | ✅ | ✅ | 463ms（穩定） |
| `nvidia/llama-3.1-nemotron-safety-guard-8b-v3` | ✅ | ✅ | ✅ | 491ms（穩定） |
| `meta/llama-3.2-11b-vision-instruct` | ✅ | ⏱️ | ✅ | 452ms |
| `google/diffusiongemma-26b-a4b-it` | ⏱️ | ✅ | ✅ | 560ms |
| `nvidia/llama-3.1-nemoguard-8b-topic-control` | ✅ | ✅ | ✅ | 789ms（穩定） |
| `nvidia/nemotron-3-ultra-550b-a55b` | ✅ | ✅ | ✅ | 744ms（穩定） |
| `nvidia/nemotron-3-nano-30b-a3b` | ✅ | ⏱️ | ✅ | 339ms |
| `nvidia/nemotron-3-super-120b-a12b` | ✅ | ⏱️ | ⏱️ | 957ms（不穩定） |
| `openai/gpt-oss-20b` | ✅ | ✅ | ✅ | 324ms（穩定） |
| `moonshotai/kimi-k3` | ✅ | ⏱️ | ✅ | 2346ms（慢） |
| `meta/llama-3.2-90b-vision-instruct` | ⏱️ | ✅ | ✅ | 5506ms（慢） |
| `google/gemma-4-31b-it` | ⏱️ | ⏱️ | ✅ | 6591ms（很慢） |
| `meta/muse-glimmer-30b` | ✅ | ✅ | ✅ | 7041ms（很慢） |
| `stepfun-ai/step-3.7-flash` | ⏱️ | ⏱️ | ✅ | 19366ms（極慢） |

##### ❌ 不能用（65 個，快速 ❌ ~70ms 或持續 timeout）

含：01-ai/yi-large, adept/fuyu-8b, ai21labs/jamba, aisingapore/sea-lion, bigcode/starcoder2, databricks/dbrx, deepseek-ai/deepseek-coder, deepseek-ai/deepseek-v4-flash-0731, google/codegemma x2, google/deplot, google/gemma-2b, google/gemma-3 x2, google/recurrentgemma, ibm/granite x4, meta/codellama-70b, meta/llama2-70b, meta/llama-guard-4-12b, microsoft/kosmos-2, microsoft/phi-3-vision, microsoft/phi-3.5-moe, minimaxai/minimax-m3, mistralai/* x5, moonshotai/kimi-k2.6, nv-mistralai/mistral-nemo, nvidia/ai-synthetic-video-detector, nvidia/cosmos-reason2, nvidia/embed-qa-4, nvidia/ising-calibration, nvidia/llama-3.1-nemotron-51b, nvidia/llama-3.1-nemotron-70b, nvidia/llama-3.1-nemotron-ultra-253b, nvidia/llama-3.1-nemotron-nano-8b, nvidia/llama-3.2-nemoretriever, nvidia/llama-3.2-nv-embedqa, nvidia/llama-nemotron-embed, nvidia/llama3-chatqa, nvidia/mistral-nemo-minitron, nvidia/nemotron-3-embed, nvidia/nemotron-3.5-lightning, nvidia/nemotron-4 x2, nvidia/nemotron-nano-3, nvidia/nemotron-parse, nvidia/neva-22b, nvidia/nv-embedqa-mistral, nvidia/nvclip, nvidia/riva-translate (v1), nvidia/vila, nvidia/nvidia-nemotron-nano-9b, openai/gpt-oss-120b, poolside/laguna-xs-2.1, snowflake/arctic-embed, writer/* x4, zyphra/zamba2

**注意：** 之前 deep-research API 測出 85/95 pass 是假象。test-llm 直接打 NVIDIA API 只有 18/83 能用。大量快速 ❌（~70ms）可能是 free credits 耗盡（1000 req/月額度被之前的測試用完）。

#### Gemini

| Model ID | HTTP | Latency | Error |
|---|---|---|---|
| `gemini/gemini-3.6-flash` | ✅ 200 | 5436ms | |
| `gemini/gemini-3.5-flash` | ❌ | timeout | |
| `gemini/gemini-3.7-flash` | ❌ | timeout | |

#### Cerebras

| Model ID | HTTP | Latency | Error |
|---|---|---|---|
| `cerebras/gpt-oss-120b` | ❌ 402 | 99ms | Payment required |
| `cerebras/gemma-4-31b` | ❌ 402 | 77ms | Payment required |

#### OpenAI

| Model ID | HTTP | Latency | Error |
|---|---|---|---|
| `openai/gpt-4.1-mini` | ❌ | — | OPENAI_API_KEY not found |
| `openai/gpt-4.1-nano` | ❌ | — | OPENAI_API_KEY not found |

---

## 逐項測試結果（deep-research API，結果不可靠但保留記錄）

### NVIDIA NIM（85/95 pass via deep-research API）

完整結果見 `.research/2026-08-26-opencode-nvidia-full-model-test.md`

### OpenCode Zen（64/64 pass via deep-research API）

**⚠️ 全部是假象——deep-research API 在 model 初始化失敗時走 fallback，所以回 200。test-llm 直接打 provider 全部失敗。**

完整結果見 `.research/2026-08-26-opencode-nvidia-full-model-test.md`

---

## 完整模型目錄

從各家 `/v1/models` API 端點拉取的完整列表見 `.research/2026-08-26-llm-provider-complete-model-lists.md`

| Provider | API 端點 | Total Models | 需 Auth |
|---|---|---|---|
| OpenRouter | `GET https://openrouter.ai/api/v1/models` | 417 | 否 |
| NVIDIA NIM | `GET https://integrate.api.nvidia.com/v1/models` | 95 | 否 |
| OpenCode Zen | `GET https://opencode.ai/zen/v1/models` | 64 | 否 |
| Groq | `GET https://api.groq.com/openai/v1/models` | — | 是 |
| Cerebras | `GET https://api.cerebras.ai/v1/models` | — | 是 |

---

## 結論：實際可用的 Fallback Chain

| 優先 | Provider | Model | 狀態 |
|---|---|---|---|
| 1 | Groq | `openai/gpt-oss-20b` | ✅ 穩定 314ms |
| 2 | OpenRouter | `nvidia/nemotron-3-ultra-550b-a55b:free` | ✅ 280ms，20 req/min |
| 3 | Gemini | `gemini-3.6-flash` | ✅ 5.4s，1500 req/day |
| 4 | NVIDIA | `moonshotai/kimi-k3` | ⚠️ 8.2s，40 RPM |
| ❌ | OpenCode | — | free 額度用完，paid 沒付款 |
| ❌ | Cerebras | — | 需付費 |
| ❌ | OpenAI | — | 無 API key |

**codebase 需要更新：** 目前 fallback chain 設的是 opencode → openrouter → nvidia，但 opencode 全軍覆沒，需移除或改成等 rate limit reset 後才用。

---

## 教訓

1. **測試要用對的端點**：deep-research API 有 fallback，回 200 不代表 model 能用。`test-llm` 直接打 provider 才是真的。
2. **Free model 有日限**：密集測試會燒光額度。OpenCode 100 req/day、OpenRouter 200 req/day。
3. **Provider 的 model 隨時變**：Groq 的 llama-3.3 在 8/16 deprecated、NVIDIA 的在 8/25、OpenRouter 的 :free 模型隨時移除。
4. **先查清單再測，不要憑印象猜 model ID**。
