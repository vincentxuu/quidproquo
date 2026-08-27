# LLM Provider 完整模型清單

日期：2026-08-26
來源：各家 API 端點（`/v1/models`）、官方文件、搜尋結果

---

## 1. Groq

來源：console.groq.com/docs/models, deprecation 公告

### Active Models

| Model ID | Context | Tool Calling | Pricing (in/out $/M) | Notes |
|---|---|---|---|---|
| `openai/gpt-oss-120b` | 131K | ✅ | — | 推薦替代品，120B MoE，~500 TPS |
| `openai/gpt-oss-20b` | 131K | ✅ | $0.05/$0.08 | 輕量版，~1000 TPS |
| `openai/gpt-oss-safeguard-20b` | 131K | ✅ | — | Trust & Safety，帶自訂 policy |
| `qwen/qwen3.6-27b` | 131K | ✅ | — | 多語言通用 |

### Deprecated（仍可用但即將下架）

| Model ID | Shutdown Date | Replacement |
|---|---|---|
| `llama-3.3-70b-versatile` | 8/16/2026 | `openai/gpt-oss-120b` 或 `qwen/qwen3.6-27b` |
| `llama-3.1-8b-instant` | 8/16/2026 | `openai/gpt-oss-20b` |
| `mixtral-8x7b-32768` | Legacy | — |

### 已下架

| Model ID | Shutdown Date | Replacement |
|---|---|---|
| `meta-llama/llama-4-scout-17b-16e-instruct` | 7/17/2026 | `openai/gpt-oss-120b` |
| `meta-llama/llama-4-maverick-17b-128e-instruct` | 3/9/2026 | `openai/gpt-oss-120b` |
| `qwen/qwen3-32b` | 7/17/2026 | `openai/gpt-oss-120b` |
| `moonshotai/kimi-k2-instruct-0905` | 4/15/2026 | `openai/gpt-oss-120b` |
| `meta-llama/llama-guard-4-12b` | 3/5/2026 | `openai/gpt-oss-safeguard-20b` |
| `deepseek-r1-distill-llama-70b` | 10/2/2025 | `openai/gpt-oss-120b` |
| `gemma2-9b-it` | 10/8/2025 | `llama-3.1-8b-instant` |
| `llama3-70b-8192` | 8/30/2025 | `llama-3.3-70b-versatile` |
| `llama3-8b-8192` | 8/30/2025 | `llama-3.1-8b-instant` |

### 其他（語音/Agent）

| Model ID | Type |
|---|---|
| `whisper-large-v3` | Speech-to-text |
| `whisper-large-v3-turbo` | Speech-to-text (fast) |
| Orpheus TTS | Text-to-speech |
| Groq Compound | Agentic system（web search + code exec + reasoning） |

---

## 2. OpenAI（直接 API）

| Model ID | Notes |
|---|---|
| `gpt-4.1-mini` | 實測 ✅ |
| `gpt-4.1` | |
| `gpt-4.1-nano` | 實測 ✅ |
| `gpt-4o-mini` | |
| `gpt-4o` | |

---

## 3. Google Gemini

來源：ai.google.dev/gemini-api/docs/changelog, gradually.ai

### Current Models

| Model ID | Released | Context | Pricing (in/out $/M) | Status | Notes |
|---|---|---|---|---|---|
| `gemini-3.7-flash` | 8/13/2026 | 1M | introductory pricing | **GA** | 最新，coding + agents，實測 timeout |
| `gemini-3.5-flash` | 5/19/2026 | 1M | $1.50/$9.00 | GA | 打贏 3.1 Pro on coding |
| `gemini-3.1-pro` | 2/19/2026 | 2M | $2/$12 (≤200K) $4/$12 (>200K) | GA | 最強推理，77.1% ARC-AGI-2 |
| `gemini-3.1-flash-lite` | — | — | $0.25/— | GA | 低成本 |
| `gemini-3-flash` | 12/2025 | 1M | — | GA | 平衡速度/品質，Gemini app default |
| `gemini-3-pro` | — | 1M | — | GA | |
| `gemini-2.5-pro` | — | 1M | — | Paid only | 4/1 移出免費 tier |
| `gemini-2.5-flash` | — | 1M | $0.10/— | GA | |
| `gemini-2.5-flash-lite` | — | 1M | $0.10/$0.40 | GA | |

### Deprecated / Shutdown

| Model ID | Shutdown Date |
|---|---|
| `gemini-2.0-flash` | 6/1/2026 |
| `gemini-2.0-flash-001` | 6/1/2026 |
| `gemini-2.0-flash-lite` | 6/1/2026 |
| `gemini-3.1-flash-image-preview` | 6/25/2026 |
| `gemini-3-pro-image-preview` | 6/25/2026 |

### 實測結果

| Model ID | Status | Time |
|---|---|---|
| `gemini-3.7-flash` | ❌ timeout | >60s |
| `gemini-3.6-flash` | ✅ | 4.9s |

---

## 4. OpenRouter

來源：`GET https://openrouter.ai/api/v1/models`（直接 API 拉取）

**Total: 417 models**（2026-08-26）

### Free / $0 Models（從 `/v1/models` API 確認，2026-08-26 當下）

**⚠️ 重要：之前測試時存在的 `:free` 模型（llama-4-maverick:free、deepseek-r1:free、qwen3-235b:free 等）已在 2026-08 被移除。** 以下是 API 確認仍存在的 free models：

| Model ID | Context | Name |
|---|---|---|
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1,000,000 | NVIDIA Nemotron 3 Ultra 550B |
| `nvidia/nemotron-3-super-120b-a12b:free` | 262,144 | NVIDIA Nemotron 3 Super 120B |
| `nvidia/nemotron-3.5-lightning:free` | 1,000,000 | NVIDIA Nemotron 3.5 Lightning |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 256,000 | NVIDIA Nemotron 3 Nano Omni 30B |
| `nvidia/nemotron-3.5-content-safety:free` | 128,000 | NVIDIA Nemotron 3.5 Content Safety |
| `minimax/minimax-m3:free` | 1,048,576 | MiniMax M3 |
| `minimax/minimax-m2.7:free` | 196,608 | MiniMax M2.7 |
| `google/gemma-4-31b-it:free` | 262,144 | Google Gemma 4 31B |
| `google/gemma-4-26b-a4b-it:free` | 262,144 | Google Gemma 4 26B A4B |
| `z-ai/glm-5.2:free` | 256,000 | Z.ai GLM 5.2 |
| `cohere/north-mini-code:free` | 256,000 | Cohere North Mini Code |
| `poolside/laguna-s-2.1:free` | 262,144 | Poolside Laguna S 2.1 |
| `poolside/laguna-xs-2.1:free` | 262,144 | Poolside Laguna XS 2.1 |
| `thinkingmachines/inkling:free` | 1,048,576 | Thinking Machines Inkling |
| `thinkingmachines/inkling-small:free` | 1,048,576 | Thinking Machines Inkling Small |
| `liquid/lfm-2.5-2.6b:free` | 65,536 | LiquidAI LFM2.5-2.6B |
| `dots-studio/dots-3-note-preview:free` | 512,000 | Dots3-Note Preview |
| `openrouter/free` | 200,000 | Free Models Router（自動選） |

**也有 4 個 $0 但沒 `:free` suffix 的：**
| `google/lyria-3-clip-preview` | 1,048,576 | Google Lyria 3 Clip Preview |
| `google/lyria-3-pro-preview` | 1,048,576 | Google Lyria 3 Pro Preview |
| `stealth/ox-alpha` | 1,048,576 | Ox Alpha |

Total: 21 個 free/$0 models（從 417 個中篩出）

### 已移除的 `:free` models（之前測試時能用，現在已不在 API 列表）

| Model ID | 現在狀態 | 現在價格 (in/out $/M) |
|---|---|---|
| `meta-llama/llama-4-maverick:free` | ❌ 移除 | $0.20/$0.80（paid） |
| `meta-llama/llama-3.3-70b-instruct:free` | ❌ 移除 | $0.71/$0.71 |
| `deepseek/deepseek-r1:free` | ❌ 移除 | $0.70/$2.50 |
| `deepseek/deepseek-chat-v3-0324:free` | ❌ 移除 | $0.25/$1.00 |
| `qwen/qwen3-235b-a22b:free` | ❌ 移除 | $0.455/$1.82 |
| `qwen/qwen-2.5-72b-instruct:free` | ❌ 移除 | $0.36/$0.40 |
| `mistralai/mistral-small-3.1-24b-instruct:free` | ❌ 移除 | $0.351/$0.555 |
| `nousresearch/hermes-3-llama-3.1-405b:free` | ❌ 移除 | $1.00/$1.00 |

### 實測結果（測試時部分 `:free` 還存在，結果僅供參考）

| Model ID | Time | Notes |
|---|---|---|
| `meta-llama/llama-3.3-70b-instruct` | 4.2–12s | paid |
| `meta-llama/llama-4-maverick-17b-128e-instruct` | 5.0s | paid |
| `google/gemini-2.5-flash-preview` | 2.8s | |
| `mistralai/mistral-small-2501` | 3.2s | paid |
| `microsoft/phi-4-multimodal-instruct` | 2.9s | |

---

## 5. OpenCode Zen

來源：opencode.ai/docs/zen, opencode.ai/docs/go#models

### Free Models（7）

| Model ID | Pricing | 實測 | Time |
|---|---|---|---|
| `big-pickle` | Free | ✅ | 2.8–2.9s |
| `deepseek-v4-flash-free` | Free | ✅ | 4.3s |
| `mimo-v2.5-free` | Free | ✅ | 2.9s |
| `hy3-free` | Free | ✅ | 5.2s |
| `laguna-s-2.1-free` | Free | ✅ | 2.7s |
| `nemotron-3-ultra-free` | Free | ✅ | 3.3s |
| `nemotron-3.5-lightning-free` | Free | ✅ | 2.6s |

### Paid Models（19）

| Model ID | Pricing (in/out $/M) | 實測 | Time | Notes |
|---|---|---|---|---|
| `deepseek-v4-flash` | — | ✅ | 2.7–2.8s | 最高 quota（31,650 req/5hr） |
| `deepseek-v4-pro` | — | ✅ | 2.9–3.1s | |
| `qwen3.6-plus` | — | ✅ | 2.7s | |
| `qwen3.7-plus` | — | ✅ | 2.8–3.8s | |
| `qwen3.7-max` | $2.50/$7.50 | ✅ | 2.9s | |
| `qwen3.8-max` | — | ✅ | 2.7–3.3s | 最新 Qwen |
| `mimo-v2.5` | — | ✅ | 2.6–3.3s | |
| `mimo-v2.5-pro` | — | ✅ | 2.7–2.9s | |
| `minimax-m2.5` | $0.30/$1.20 | ✅ | 2.8–3.1s | |
| `minimax-m2.7` | $0.30/$1.20 | ✅ | 2.8s | |
| `minimax-m3` | $0.30/$1.20 | ✅ | 2.6–5.2s | |
| `glm-5.1` | $1.40/$4.40 | ✅ | 2.8s | |
| `glm-5.2` | $1.40/$4.40 | ✅ | 3.0s | |
| `glm-5.3` | — | ✅ | 6.7s | 最慢 |
| `kimi-k2.6` | $0.95/$4.00 | ✅ | 2.8s | |
| `kimi-k2.7-code` | $0.95/$4.00 | ✅ | 3.0s | coding-tuned |
| `kimi-k3` | $3.00/$15.00 | ✅ | 3.0s | 最貴 |
| `grok-4.5` | — | ✅ | 2.5s | **最快**，quota 最少（120 req/5hr） |
| `gpt-5.6-luna` | — | ✅ | 3.2s | |

### 其他 models（從官方文件，未透過 deep-research API 測試）

| Model ID | Endpoint | Notes |
|---|---|---|
| `gpt-5.6-sol` | OpenAI-compat | |
| `gpt-5.6-terra` | OpenAI-compat | |
| `gpt-5.5` | OpenAI-compat | |
| `gpt-5.5-pro` | OpenAI-compat | |
| `gpt-5.4` | OpenAI-compat | |
| `gpt-5.4-pro` | OpenAI-compat | |
| `gpt-5.4-mini` | OpenAI-compat | |
| `gpt-5.4-nano` | OpenAI-compat | |
| `gpt-5.3-codex` | OpenAI-compat | |
| `gpt-5.3-codex-spark` | OpenAI-compat | |
| `gpt-5.2` | OpenAI-compat | |

### Deprecated

| Model ID | Deprecation Date |
|---|---|
| `gpt-5.2-codex` | 7/23/2026 |
| `gpt-5.1-codex` / `codex-max` / `codex-mini` | 7/23/2026 |
| `gpt-5-codex` | 7/23/2026 |
| `claude-opus-4.1` | 8/5/2026 |
| `claude-sonnet-4` | 6/15/2026 |
| `claude-haiku-3.5` | 2/16/2026 |
| `gemini-3-pro` | 3/9/2026 |
| `minimax-m2.5` | 8/5/2026 |
| `minimax-m2.1` | 3/15/2026 |
| `glm-5` | 5/14/2026 |
| `glm-4.7` / `glm-4.6` | 3/15/2026 |
| `kimi-k2.5` | 8/5/2026 |
| `kimi-k2-thinking` / `kimi-k2` | 3/6/2026 |
| `qwen3-coder-480b` | 2/6/2026 |

---

## 6. NVIDIA NIM

來源：build.nvidia.com, tavily 搜尋

### 實測結果

| Model ID | Status | Time | Notes |
|---|---|---|---|
| `meta/llama-4-scout-17b-16e-instruct` | ✅ | 2.6–4.4s | |
| `nvidia/llama-3.3-nemotron-super-49b-v1` | ✅ | 5.3s | |
| `deepseek-ai/deepseek-r1` | ✅ | 3.0s | **最快** |
| `qwen/qwen2.5-72b-instruct` | ✅ | 3.5s | |
| `mistralai/mistral-large-2-instruct` | ✅ | 3.0s | |
| `meta/llama-4-maverick-17b-128e-instruct` | ❌ | >30s | timeout |
| `meta/llama-3.3-70b-instruct` | ❌ | >30s | **8/25 deprecated** |

### 其他可用 models（從文件，未逐一實測）

| Model ID | Notes |
|---|---|
| `deepseek-ai/deepseek-v4-flash` | 284B MoE, 1M ctx |
| `qwen/qwen3-coder-480b-a35b-instruct` | 256K ctx, agentic coding |
| `meta/llama-4-scout-17b-16e-instruct` | 多模態 |
| `nvidia/nemotron-3-super-120b-a12b` | |
| `nvidia/nemotron-mini-4b-instruct` | |
| `nvidia/riva-translate-4b-instruct-v2` | 翻譯 |

---

## 7. Cerebras

來源：cerebras.ai/pricing

### Current Models

| Model ID | Context | Tool Calling | Pricing (in/out $/M) | Status | Notes |
|---|---|---|---|---|---|
| `gpt-oss-120b` | 131K | ✅ | $0.35/$0.75 | **Active** | ~3000 TPS |
| `gemma-4-31b` | 131K | ✅ | $0.99/$1.49 | Preview | 多模態 |
| `zai-glm-4.7` | 131K | ✅ | — | ⚠️ Deprecated 8/17 | |

### 實測（via deep-research API）

| Model ID | Status | Time |
|---|---|---|
| `llama-3.3-70b` | ✅ | 2.9s |
| `llama3.1-8b` | ✅ | 3.8s |

---

## 8. Cloudflare Workers AI

來源：developers.cloudflare.com/ai/models, changelog

### Text Generation Models（active）

| Model ID | Context | Function Calling | Pricing (in/out $/M) | Notes |
|---|---|---|---|---|
| `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | 24K | ✅ | $0.29/$2.25 | 實測 ✅ 2.7–4.7s |
| `@cf/meta/llama-3.1-8b-instruct` | 24K | — | — | 實測 ✅ 3.3s |
| `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b` | 80K | — | — | 實測 ✅ 8.3s, reasoning |
| `@cf/qwen/qwen1.5-14b-chat-awq` | — | — | — | 實測 ✅ 3.0s |
| `@cf/openai/gpt-oss-120b` | — | — | — | 從 changelog 提到 |
| `@cf/deepseek-ai/deepseek-v4-flash-0731` | — | — | — | 從 changelog 提到 |
| `@cf/zai-org/glm-4.7-flash` | — | ✅ | — | 推薦用於 tool-calling |
| `@cf/google/gemma-4-26b-a4b-it` | — | — | — | |
| `@cf/ibm-granite/granite-4.0-h-micro` | — | — | — | |
| `@cf/meta/llama-4-scout-17b-16e-instruct` | — | — | — | |
| `@cf/moonshotai/kimi-k2.6` | — | ✅ | — | vision + tool-calling |

### Deprecated / Deprecating

| Model ID | Shutdown Date | Replacement |
|---|---|---|
| `@cf/meta/llama-2-7b-chat-fp16` | — | newer models |
| `@cf/meta/llama-2-7b-chat-int8` | — | newer models |
| `@cf/meta/llama-3-8b-instruct` | — | `@cf/meta/llama-3.1-8b-instruct` |
| `@cf/meta/llama-3-8b-instruct-awq` | — | newer models |
| `@cf/meta/llama-3.1-70b-instruct` | 5/30/2026 | `@cf/meta/llama-3.3-70b-instruct-fp8-fast` |
| `@cf/meta/llama-3.1-8b-instruct-awq` | — | newer models |
| `@cf/microsoft/phi-2` | — | newer models |
| `@cf/mistral/mistral-7b-instruct-v0.1` | — | newer models |
| `@cf/google/gemma-3-12b-it` | — | `@cf/google/gemma-4-26b-a4b-it` |
| `@cf/moonshotai/kimi-k2.5` | 5/30/2026 | `@cf/moonshotai/kimi-k2.6` |

### 其他類型（非 text generation）

| Model ID | Type |
|---|---|
| `@cf/deepgram/nova-3` | Speech-to-text |
| `@cf/deepgram/aura-2-en` / `aura-2-es` | Text-to-speech |
| `@cf/pipecat-ai/smart-turn-v2` | Voice activity detection |
| `@cf/black-forest-labs/flux-2-dev` | Text-to-image |
| `@cf/black-forest-labs/flux-2-klein-4b` | Text-to-image |
| `@cf/leonardo/lucid-origin` | Text-to-image |
| `@cf/leonardo/phoenix-1.0` | Text-to-image |
| `@cf/google/embeddinggemma-300m` | Embedding |
| `@cf/ai4bharat/indictrans2-en-indic-1B` | Translation (22 Indic languages) |

**限制：Workers AI 的 text gen models 走自建 adapter，沒有 LangChain `bindTools`。只能用於 planner/writer/critic，不能用於 createReactAgent。**
