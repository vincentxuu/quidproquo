# LLM Provider 逐項模型測試結果

日期：2026-08-26
測試方法：`POST https://quidproquo.cc/api/deep-research`（planner-only，max-time 15-20s）

## OpenCode Zen — 64/64 通過（100%）

### Batch 1 (1-24)

| Model ID | HTTP | Time | Notes |
|---|---|---|---|
| `big-pickle` | 200 | 2.7s |  |
| `claude-fable-5` | 200 | 2.9s |  |
| `claude-haiku-4-5` | 200 | 2.9s |  |
| `claude-opus-4-5` | 200 | 2.5s |  |
| `claude-opus-4-6` | 200 | 3.1s |  |
| `claude-opus-4-7` | 200 | 2.5s |  |
| `claude-opus-4-8` | 200 | 3.1s |  |
| `claude-opus-5` | 200 | 2.5s |  |
| `claude-sonnet-4` | 200 | 2.6s |  |
| `claude-sonnet-4-5` | 200 | 2.5s |  |
| `claude-sonnet-4-6` | 200 | 4.2s |  |
| `claude-sonnet-5` | 200 | 2.7s |  |
| `deepseek-v4-flash` | 200 | 2.6s |  |
| `deepseek-v4-flash-free` | 200 | 2.6s |  |
| `deepseek-v4-pro` | 200 | 2.5s |  |
| `gemini-3-flash` | 200 | 2.6s |  |
| `gemini-3.1-pro` | 200 | 2.5s |  |
| `gemini-3.5-flash` | 200 | 2.7s |  |
| `gemini-3.5-flash-lite` | 200 | 2.5s |  |
| `gemini-3.6-flash` | 200 | 2.4s |  |
| `gemini-3.7-flash` | 200 | 2.5s |  |
| `glm-5` | 200 | 2.6s |  |
| `glm-5.1` | 200 | 4.9s |  |
| `glm-5.2` | 200 | 2.9s |  |

### Batch 2 (25-64)

| Model ID | HTTP | Time | Notes |
|---|---|---|---|
| `gpt-5` | 200 | 2.4s |  |
| `gpt-5-codex` | 200 | 2.5s |  |
| `gpt-5-nano` | 200 | 2.5s |  |
| `gpt-5.1` | 200 | 2.6s |  |
| `gpt-5.1-codex` | 200 | 2.8s |  |
| `gpt-5.1-codex-max` | 200 | 3.0s |  |
| `gpt-5.1-codex-mini` | 200 | 2.6s |  |
| `gpt-5.2` | 200 | 6.6s |  |
| `gpt-5.2-codex` | 200 | 2.7s |  |
| `gpt-5.3-codex` | 200 | 2.8s |  |
| `gpt-5.3-codex-spark` | 200 | 2.5s |  |
| `gpt-5.4` | 200 | 2.8s |  |
| `gpt-5.4-mini` | 200 | 2.8s |  |
| `gpt-5.4-nano` | 200 | 2.5s |  |
| `gpt-5.4-pro` | 200 | 2.5s |  |
| `gpt-5.5` | 200 | 2.5s |  |
| `gpt-5.5-pro` | 200 | 2.5s |  |
| `gpt-5.6-luna` | 200 | 2.6s |  |
| `gpt-5.6-sol` | 200 | 2.9s |  |
| `gpt-5.6-terra` | 200 | 2.6s |  |
| `grok-4.5` | 200 | 2.5s |  |
| `grok-4.6` | 200 | 2.5s |  |
| `grok-build-0.1` | 200 | 2.7s |  |
| `hy3-free` | 200 | 3.7s |  |
| `kimi-k2.5` | 200 | 3.7s |  |
| `kimi-k2.6` | 200 | 2.6s |  |
| `kimi-k2.7-code` | 200 | 3.1s |  |
| `kimi-k3` | 200 | 2.9s |  |
| `laguna-s-2.1-free` | 200 | 2.6s |  |
| `mimo-v2.5-free` | 200 | 2.5s |  |
| `minimax-m2.5` | 200 | 3.8s |  |
| `minimax-m2.7` | 200 | 2.9s |  |
| `minimax-m3` | 200 | 2.8s |  |
| `muse-spark-1.2` | 200 | 2.6s |  |
| `muse-spark-1.2-contributor-free` | 200 | 2.4s |  |
| `nemotron-3-ultra-free` | 200 | 3.8s |  |
| `nemotron-3.5-lightning-free` | 200 | 4.1s |  |
| `qwen3.5-plus` | 200 | 2.6s |  |
| `qwen3.6-plus` | 200 | 2.5s |  |
| `x-preview-f-free` | 200 | 3.9s |  |

---

## NVIDIA NIM — 85/95 通過（89.5%）

### 通過（85 models）

| Model ID | HTTP | Time | Notes |
|---|---|---|---|
| `01-ai/yi-large` | 200 | 2.9s |  |
| `adept/fuyu-8b` | 200 | 10.1s |  |
| `ai21labs/jamba-1.5-large-instruct` | 200 | 2.6s |  |
| `aisingapore/sea-lion-7b-instruct` | 200 | 2.9s |  |
| `bigcode/starcoder2-15b` | 200 | 2.6s |  |
| `databricks/dbrx-instruct` | 200 | 2.6s |  |
| `deepseek-ai/deepseek-coder-6.7b-instruct` | 200 | 2.7s |  |
| `deepseek-ai/deepseek-v4-flash-0731` | 200 | 2.6s |  |
| `google/codegemma-1.1-7b` | 200 | 2.6s |  |
| `google/codegemma-7b` | 200 | 2.6s |  |
| `google/deplot` | 200 | 2.8s |  |
| `google/diffusiongemma-26b-a4b-it` | 200 | 5.3s |  |
| `google/gemma-2b` | 200 | 2.5s |  |
| `google/gemma-3-12b-it` | 200 | 2.6s |  |
| `google/gemma-3-4b-it` | 200 | 3.3s |  |
| `google/recurrentgemma-2b` | 200 | 2.8s |  |
| `ibm/granite-3.0-3b-a800m-instruct` | 200 | 2.6s |  |
| `ibm/granite-3.0-8b-instruct` | 200 | 3.0s |  |
| `ibm/granite-34b-code-instruct` | 200 | 5.0s |  |
| `ibm/granite-8b-code-instruct` | 200 | 2.8s |  |
| `meta/codellama-70b` | 200 | 2.6s |  |
| `meta/llama-3.1-70b-instruct` | 200 | 3.4s |  |
| `meta/llama-3.1-8b-instruct` | 200 | 3.2s |  |
| `meta/llama-3.2-11b-vision-instruct` | 200 | 3.2s |  |
| `meta/llama-3.2-1b-instruct` | 200 | 2.8s |  |
| `meta/llama-3.2-3b-instruct` | 200 | 2.5s |  |
| `meta/llama-3.3-70b-instruct` | 200 | 2.9s |  |
| `meta/llama2-70b` | 200 | 2.6s |  |
| `microsoft/kosmos-2` | 200 | 2.5s |  |
| `microsoft/phi-3-vision-128k-instruct` | 200 | 2.5s |  |
| `microsoft/phi-3.5-moe-instruct` | 200 | 2.6s |  |
| `mistralai/codestral-22b-instruct-v0.1` | 200 | 2.6s |  |
| `mistralai/mistral-7b-instruct-v0.3` | 200 | 2.6s |  |
| `mistralai/mistral-large` | 200 | 2.7s |  |
| `mistralai/mistral-large-2-instruct` | 200 | 2.7s |  |
| `mistralai/mixtral-8x22b-v0.1` | 200 | 2.8s |  |
| `moonshotai/kimi-k2.6` | 200 | 2.4s |  |
| `moonshotai/kimi-k3` | 200 | 2.7s |  |
| `nv-mistralai/mistral-nemo-12b-instruct` | 200 | 2.6s |  |
| `nvidia/cosmos-reason2-8b` | 200 | 2.6s |  |
| `nvidia/embed-qa-4` | 200 | 2.7s |  |
| `nvidia/ising-calibration-1.5-31b` | 200 | 4.3s |  |
| `nvidia/llama-3.1-nemoguard-8b-content-safety` | 200 | 2.1s |  |
| `nvidia/llama-3.1-nemoguard-8b-topic-control` | 200 | 3.1s |  |
| `nvidia/llama-3.1-nemotron-51b-instruct` | 200 | 2.8s |  |
| `nvidia/llama-3.1-nemotron-70b-instruct` | 200 | 3.9s |  |
| `nvidia/llama-3.1-nemotron-nano-8b-v1` | 200 | 2.7s |  |
| `nvidia/llama-3.1-nemotron-nano-vl-8b-v1` | 200 | 2.5s |  |
| `nvidia/llama-3.1-nemotron-safety-guard-8b-v3` | 200 | 2.3s |  |
| `nvidia/llama-3.1-nemotron-ultra-253b-v1` | 200 | 2.5s |  |
| `nvidia/llama-3.2-nemoretriever-1b-vlm-embed-v1` | 200 | 2.7s |  |
| `nvidia/llama-3.2-nv-embedqa-1b-v1` | 200 | 2.6s |  |
| `nvidia/llama-3.3-nemotron-super-49b-v1` | 200 | 2.6s |  |
| `nvidia/llama-3.3-nemotron-super-49b-v1.5` | 200 | 2.8s |  |
| `nvidia/llama-nemotron-embed-vl-1b-v2` | 200 | 2.6s |  |
| `nvidia/llama3-chatqa-1.5-70b` | 200 | 2.7s |  |
| `nvidia/mistral-nemo-minitron-8b-8k-instruct` | 200 | 2.7s |  |
| `nvidia/nemotron-3-embed-1b` | 200 | 2.6s |  |
| `nvidia/nemotron-3-nano-30b-a3b` | 200 | 4.0s |  |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | 200 | 6.3s |  |
| `nvidia/nemotron-3-super-120b-a12b` | 200 | 3.5s |  |
| `nvidia/nemotron-3.5-content-safety` | 200 | 2.0s |  |
| `nvidia/nemotron-3.5-lightning-30b-a3b` | 200 | 13.1s |  |
| `nvidia/nemotron-4-340b-instruct` | 200 | 3.0s |  |
| `nvidia/nemotron-4-340b-reward` | 200 | 2.8s |  |
| `nvidia/nemotron-mini-4b-instruct` | 200 | 2.5s |  |
| `nvidia/nemotron-nano-3-30b-a3b` | 200 | 3.1s |  |
| `nvidia/nemotron-parse` | 200 | 3.2s |  |
| `nvidia/neva-22b` | 200 | 2.8s |  |
| `nvidia/nv-embedqa-mistral-7b-v2` | 200 | 2.6s |  |
| `nvidia/nvclip` | 200 | 2.5s |  |
| `nvidia/nvidia-nemotron-nano-9b-v2` | 200 | 11.1s |  |
| `nvidia/riva-translate-4b-instruct` | 200 | 2.6s |  |
| `nvidia/riva-translate-4b-instruct-v1.1` | 200 | 2.3s |  |
| `nvidia/riva-translate-4b-instruct-v2` | 200 | 2.5s |  |
| `nvidia/vila` | 200 | 2.5s |  |
| `openai/gpt-oss-120b` | 200 | 10.3s |  |
| `openai/gpt-oss-20b` | 200 | 4.3s |  |
| `poolside/laguna-xs-2.1` | 200 | 2.3s |  |
| `snowflake/arctic-embed-l` | 200 | 2.5s |  |
| `writer/palmyra-creative-122b` | 200 | 2.7s |  |
| `writer/palmyra-fin-70b-32k` | 200 | 2.9s |  |
| `writer/palmyra-med-70b` | 200 | 2.7s |  |
| `writer/palmyra-med-70b-32k` | 200 | 2.6s |  |
| `zyphra/zamba2-7b-instruct` | 200 | 2.7s |  |

### Timeout（10 models）

| Model ID | HTTP | Time | Notes |
|---|---|---|---|
| `google/gemma-4-31b-it` | 000 | 15.0s | timeout |
| `meta/llama-3.2-90b-vision-instruct` | 000 | 15.0s | timeout |
| `meta/llama-guard-4-12b` | 000 | 15.0s | timeout |
| `meta/muse-glimmer-30b` | 000 | 15.0s | timeout |
| `minimaxai/minimax-m3` | 000 | 15.0s | timeout |
| `mistralai/mistral-nemotron` | 000 | 15.0s | timeout |
| `nvidia/ai-synthetic-video-detector` | 000 | 15.0s | timeout |
| `nvidia/nemotron-3-ultra-550b-a55b` | 000 | 15.0s | timeout |
| `nvidia/nemotron-nano-12b-v2-vl` | 000 | 15.0s | timeout |
| `stepfun-ai/step-3.7-flash` | 000 | 15.0s | timeout |

**備註：** timeout 不一定是模型不可用——可能是模型需要較長啟動時間（cold start），或者是非 chat 模型（如 embedding、vision、video detector）不適合用 chat API 測。
