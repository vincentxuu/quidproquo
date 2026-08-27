# NVIDIA NIM Full Model Test Results

Date: 2026-08-26
Method: planner-only via `POST https://quidproquo.cc/api/deep-research` (production), 20s timeout
Tested: 63 chat/text-gen models (out of 95 total; excluded 32 non-chat models: embedding, reward, safety-guard, vision-only, translation, video-detector, parse, etc.)

## Results: 58/63 pass (92%)

| Model ID | HTTP | Time | Notes |
|---|---|---|---|
| `01-ai/yi-large` | ✅ 200 | 3.9s | |
| `aisingapore/sea-lion-7b-instruct` | ✅ 200 | 2.7s | |
| `bigcode/starcoder2-15b` | ✅ 200 | 3.7s | |
| `databricks/dbrx-instruct` | ✅ 200 | 3.3s | |
| `deepseek-ai/deepseek-coder-6.7b-instruct` | ✅ 200 | 3.6s | |
| `deepseek-ai/deepseek-v4-flash-0731` | ✅ 200 | 3.0s | |
| `google/codegemma-1.1-7b` | ✅ 200 | 3.6s | |
| `google/codegemma-7b` | ✅ 200 | 2.7s | |
| `google/gemma-2b` | ✅ 200 | 4.0s | |
| `google/gemma-3-12b-it` | ✅ 200 | 3.1s | |
| `google/gemma-3-4b-it` | ✅ 200 | 4.2s | |
| `google/gemma-4-31b-it` | ❌ timeout | 20.0s | |
| `google/recurrentgemma-2b` | ✅ 200 | 2.6s | |
| `ibm/granite-3.0-3b-a800m-instruct` | ✅ 200 | 2.8s | |
| `ibm/granite-3.0-8b-instruct` | ✅ 200 | 2.4s | |
| `ibm/granite-34b-code-instruct` | ✅ 200 | 2.5s | |
| `ibm/granite-8b-code-instruct` | ✅ 200 | 2.5s | |
| `meta/codellama-70b` | ✅ 200 | 3.0s | |
| `meta/llama-3.1-70b-instruct` | ✅ 200 | 2.5s | |
| `meta/llama-3.1-8b-instruct` | ✅ 200 | 2.6s | |
| `meta/llama-3.2-1b-instruct` | ✅ 200 | 2.4s | |
| `meta/llama-3.2-3b-instruct` | ✅ 200 | 3.8s | |
| `meta/llama-3.3-70b-instruct` | ✅ 200 | 2.6s | previously deprecated warning, working now |
| `meta/llama2-70b` | ✅ 200 | 2.9s | |
| `meta/muse-glimmer-30b` | ❌ timeout | 20.0s | |
| `microsoft/phi-3.5-moe-instruct` | ✅ 200 | 2.6s | |
| `minimaxai/minimax-m3` | ❌ timeout | 20.0s | |
| `mistralai/codestral-22b-instruct-v0.1` | ✅ 200 | 2.8s | |
| `mistralai/mistral-7b-instruct-v0.3` | ✅ 200 | 2.6s | |
| `mistralai/mistral-large` | ✅ 200 | 2.8s | |
| `mistralai/mistral-large-2-instruct` | ✅ 200 | 2.7s | |
| `mistralai/mistral-nemotron` | ❌ timeout | 20.0s | |
| `mistralai/mixtral-8x22b-v0.1` | ✅ 200 | 3.9s | |
| `moonshotai/kimi-k2.6` | ✅ 200 | 2.6s | |
| `moonshotai/kimi-k3` | ✅ 200 | 3.8s | |
| `nv-mistralai/mistral-nemo-12b-instruct` | ✅ 200 | 4.5s | |
| `nvidia/cosmos-reason2-8b` | ✅ 200 | 2.5s | |
| `nvidia/llama-3.1-nemotron-51b-instruct` | ✅ 200 | 2.6s | |
| `nvidia/llama-3.1-nemotron-70b-instruct` | ✅ 200 | 2.9s | |
| `nvidia/llama-3.1-nemotron-nano-8b-v1` | ✅ 200 | 2.4s | |
| `nvidia/llama-3.1-nemotron-ultra-253b-v1` | ✅ 200 | 2.7s | |
| `nvidia/llama-3.3-nemotron-super-49b-v1` | ✅ 200 | 2.5s | |
| `nvidia/llama-3.3-nemotron-super-49b-v1.5` | ✅ 200 | 2.4s | |
| `nvidia/llama3-chatqa-1.5-70b` | ✅ 200 | 2.4s | |
| `nvidia/mistral-nemo-minitron-8b-8k-instruct` | ✅ 200 | 2.7s | |
| `nvidia/nemotron-3-nano-30b-a3b` | ✅ 200 | 3.9s | |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | ✅ 200 | 5.4s | |
| `nvidia/nemotron-3-super-120b-a12b` | ✅ 200 | 11.5s | |
| `nvidia/nemotron-3-ultra-550b-a55b` | ✅ 200 | 5.9s | |
| `nvidia/nemotron-3.5-lightning-30b-a3b` | ✅ 200 | 13.8s | |
| `nvidia/nemotron-4-340b-instruct` | ✅ 200 | 3.9s | |
| `nvidia/nemotron-mini-4b-instruct` | ✅ 200 | 2.6s | |
| `nvidia/nemotron-nano-3-30b-a3b` | ✅ 200 | 2.9s | |
| `nvidia/nvidia-nemotron-nano-9b-v2` | ✅ 200 | 11.7s | |
| `openai/gpt-oss-120b` | ✅ 200 | 3.8s | |
| `openai/gpt-oss-20b` | ✅ 200 | 5.1s | |
| `poolside/laguna-xs-2.1` | ✅ 200 | 2.5s | |
| `stepfun-ai/step-3.7-flash` | ❌ timeout | 20.0s | |
| `writer/palmyra-creative-122b` | ✅ 200 | 3.0s | |
| `writer/palmyra-fin-70b-32k` | ✅ 200 | 2.6s | |
| `writer/palmyra-med-70b` | ✅ 200 | 2.5s | |
| `writer/palmyra-med-70b-32k` | ✅ 200 | 2.5s | |
| `zyphra/zamba2-7b-instruct` | ✅ 200 | 3.4s | |

## Failed (5 models, all timeout)

| Model ID | Likely Reason |
|---|---|
| `google/gemma-4-31b-it` | May be overloaded or cold-starting |
| `meta/muse-glimmer-30b` | Music generation model, not text chat |
| `minimaxai/minimax-m3` | May need different API format |
| `mistralai/mistral-nemotron` | May be down or cold-starting |
| `stepfun-ai/step-3.7-flash` | May be down or cold-starting |

## Top by Speed (under 2.6s)

| Model ID | Time |
|---|---|
| `ibm/granite-3.0-8b-instruct` | 2.4s |
| `meta/llama-3.2-1b-instruct` | 2.4s |
| `nvidia/llama-3.1-nemotron-nano-8b-v1` | 2.4s |
| `nvidia/llama-3.3-nemotron-super-49b-v1.5` | 2.4s |
| `nvidia/llama3-chatqa-1.5-70b` | 2.4s |
| `ibm/granite-34b-code-instruct` | 2.5s |
| `ibm/granite-8b-code-instruct` | 2.5s |
| `meta/llama-3.1-70b-instruct` | 2.5s |
| `nvidia/cosmos-reason2-8b` | 2.5s |
| `nvidia/llama-3.3-nemotron-super-49b-v1` | 2.5s |
| `poolside/laguna-xs-2.1` | 2.5s |
| `writer/palmyra-med-70b` | 2.5s |
| `writer/palmyra-med-70b-32k` | 2.5s |

## Note

`meta/llama-3.3-70b-instruct` returned 200 this time (2.6s) despite earlier being marked deprecated 8/25. Groq deprecated it but NVIDIA may still serve it independently.
