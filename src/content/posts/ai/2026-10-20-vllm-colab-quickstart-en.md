---
title: "Trying vLLM on a Free Google Colab T4: See What an Inference Engine Does in 15 Minutes"
date: 2026-10-20
category: ai
type: guide
tags: [vllm, llm-inference, colab, model-serving, openai-compatible, gpu]
lang: en
tldr: "A Mac has no NVIDIA GPU, so it can't really run vLLM — but Colab's free T4 (compute capability 7.5, exactly vLLM's minimum) can. Serve the 0.6B Qwen3 as an OpenAI-compatible API with vllm serve, fire 8 requests at once, read /metrics, and you can watch continuous batching happen."
description: "A hands-on guide to running vLLM on Google Colab's free GPU: what Colab is and its limits, where vLLM sits in a stack, installing and starting the server, calling it with curl and the OpenAI SDK, concurrent requests and Prometheus metrics, and a security note that --api-key does not protect /metrics."
draft: false
series:
  name: "Self-Hosted Inference"
  order: 8
---

🌏 [中文版](/posts/ai/2026-10-20-vllm-colab-quickstart)

vLLM is the most common inference engine for self-hosted LLM serving, but it is built mainly for NVIDIA GPUs, so most laptops — Macs especially — can't give you a real feel for it. This post uses the T4 GPU that Google Colab lends out for free and goes from `pip install` to firing 8 concurrent requests in about fifteen minutes, so you can see two things with your own eyes: vLLM turning a model into an API, and vLLM serving many users at once.

If you're new to how vLLM works, start with [vLLM — From PagedAttention to a Production-Grade LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine-en). This post is hands-on only.

## Two things to understand first

### Where vLLM sits

A model on its own is just a bundle of weight files; it doesn't answer anything sitting on disk. vLLM is the server program that loads those weights onto a GPU and exposes them over HTTP. The web-backend analogy:

| Web backend | LLM serving |
|---|---|
| Django / FastAPI code | Model weights |
| gunicorn / uvicorn | **vLLM** |
| `POST /api/...` | `POST /v1/chat/completions` (OpenAI-compatible) |

Because the API matches OpenAI's format, code that already calls OpenAI only needs a different `base_url` to hit your own vLLM. Three things earn it the "production-grade" label:

- **PagedAttention**: while generating, the model has to remember the conversation so far (the KV cache). vLLM manages that memory in blocks, the way an operating system pages memory, so one GPU can hold more concurrent conversations.
- **Continuous batching**: new requests don't wait for the previous batch to finish; they join the batch that's already running.
- **Multi-GPU parallelism**: when a model doesn't fit on one card, `--tensor-parallel-size` splits it across several.

SGLang and TensorRT-LLM live in the same layer; Ollama and LM Studio lean toward personal, on-device use. For how they all fit together, see [How to Pick a Self-Hosted Inference Server](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en).

### What Colab is, and why it's free

From the [Colab FAQ](https://research.google.com/colaboratory/faq.html):

> Colab is a hosted Jupyter Notebook service that requires no setup to use and provides free of charge access to computing resources, including GPUs and TPUs.

In other words, a Jupyter Notebook in your browser, running on Google's machines. Google doesn't say publicly why it's free, but the product design suggests the motives: the free tier funnels people toward paid plans like Colab Pro, keeps their files in Google Drive, and eventually points heavier workloads at Google Cloud.

The cost of "free" is spelled out in the same FAQ, and you should know it before you start:

> Colab resources are not guaranteed and not unlimited, and usage limits sometimes fluctuate.

> In the version of Colab that is free of charge notebooks can run for at most 12 hours, depending on availability and your usage patterns.

In practice: you may not get a GPU at peak times, idle runtimes get reclaimed, and when the runtime resets, every package you installed and every model you downloaded is gone. It's a personal Google service, so **don't put company or customer data in it**. Experimenting with public models is fine.

## Why a T4, and why Qwen3-0.6B

The hardware floor in [vLLM's GPU installation docs](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/):

> GPU: compute capability 7.5 or higher (e.g., T4, RTX20xx, A100, L4, H100, B200, etc.)

The T4 is 7.5 — right on the line. The catch is that the T4 doesn't support bfloat16, while most recent models ship bfloat16 weights. Older vLLM versions error out in that case (`Bfloat16 is only supported on GPUs with compute capability of at least 8.0`, see [vllm#1157](https://github.com/vllm-project/vllm/issues/1157)), so every command below passes `--dtype half` explicitly.

The model is [Qwen/Qwen3-0.6B](https://huggingface.co/Qwen/Qwen3-0.6B): the model card lists 0.6B parameters and a 32,768-token context. It fits comfortably in the T4's 16 GB and downloads quickly. It "thinks" by default (it writes out its reasoning before the answer), which conveniently shows off how vLLM's reasoning parser splits the two.

## Hands-on: from zero to the first reply

### Step 1: Open Colab and switch to a GPU

1. Go to <https://colab.research.google.com>, sign in with a Google account, and create a new notebook.
2. Open "Runtime → Change runtime type", pick **T4 GPU** as the hardware accelerator, and save.
3. In the first cell, confirm you actually got a card:

```bash
!nvidia-smi
```

You should see one `Tesla T4` with roughly 15 GB of memory. If you get `command not found` or no GPU, you didn't get one — try again later or use a paid plan.

### Step 2: Install vLLM

```bash
!pip install -q vllm
!python -c "import vllm; print(vllm.__version__)"
```

The install takes a few minutes because it pulls PyTorch and the CUDA packages along with it. On the day this was checked (2026-10-20), the latest release on [GitHub releases](https://github.com/vllm-project/vllm/releases) was v0.32.0 (October 18), with v0.31.0 (October 5) and v0.30.0 (September 22) before it — roughly one release every two weeks.

If Colab asks you to restart the session after installing, do it before moving on.

### Step 3: Start the server in the background

A Colab cell waits for its command to finish, but `vllm serve` is a long-running server, so push it into the background and send its log to a file:

```bash
!nohup vllm serve Qwen/Qwen3-0.6B \
    --dtype half \
    --max-model-len 4096 \
    --reasoning-parser qwen3 \
    > vllm.log 2>&1 &
```

- `--dtype half`: the T4 has no bfloat16, so use float16.
- `--max-model-len 4096`: caps the length of a single conversation. Less KV cache gets reserved, so startup is faster and you're less likely to run out of memory.
- `--reasoning-parser qwen3`: per the [vLLM Reasoning Outputs docs](https://docs.vllm.ai/en/latest/features/reasoning_outputs/), `qwen3` is the parser for the Qwen3 series. The response then carries the reasoning in a separate `reasoning` field.

Wait until it's ready (the first run downloads the weights):

```bash
!for i in $(seq 1 60); do curl -sf localhost:8000/health && echo "ready" && break; sleep 5; done
!tail -n 20 vllm.log
```

`ready` means it worked. If it still isn't up after five minutes, read the last lines of `vllm.log`. The usual suspects are running out of memory (lower `--max-model-len` further) or a dtype error.

### Step 4: Call it in OpenAI format

First list the models to confirm the API is alive:

```bash
!curl -s localhost:8000/v1/models
```

Then ask something:

```bash
!curl -s localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "Qwen/Qwen3-0.6B", "messages": [{"role": "user", "content": "Explain the KV cache in one sentence"}], "max_tokens": 512}'
```

The JSON looks just like OpenAI's: `choices[0].message.content` holds the answer, `reasoning` holds the model's thinking, and `usage` records input and output token counts.

The official OpenAI SDK works too — just change `base_url`. If you don't want the thinking, turn it off per request the way the docs show:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")
resp = client.chat.completions.create(
    model="Qwen/Qwen3-0.6B",
    messages=[{"role": "user", "content": "Suggest three things to do in Taipei on a rainy day"}],
    max_tokens=512,
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(resp.choices[0].message.content)
```

At this point you have an LLM API in OpenAI's format, running on a GPU you control.

## Going further: watch continuous batching

What vLLM is really good at is serving many people at once. Send 8 requests concurrently and time the whole thing:

```python
import asyncio, time
from openai import AsyncOpenAI

client = AsyncOpenAI(base_url="http://localhost:8000/v1", api_key="not-needed")

async def ask(i):
    r = await client.chat.completions.create(
        model="Qwen/Qwen3-0.6B",
        messages=[{"role": "user", "content": f"Write a 100-word short piece on topic number {i}"}],
        max_tokens=256,
        extra_body={"chat_template_kwargs": {"enable_thinking": False}},
    )
    return r.usage.completion_tokens

start = time.time()
tokens = await asyncio.gather(*(ask(i) for i in range(8)))
elapsed = time.time() - start
print(f"8 requests, {sum(tokens)} tokens total, {elapsed:.1f}s, about {sum(tokens)/elapsed:.0f} tok/s")
```

Colab cells already run inside an event loop, so a bare `await` works. Then change `range(8)` to `range(1)` and run it again for comparison: eight requests usually take far less than eight times as long as one, because they get merged into the same batch. That's continuous batching.

Read the metrics while it's running:

```bash
!curl -s localhost:8000/metrics | grep -E "^vllm:(num_requests_running|num_requests_waiting|kv_cache_usage_perc|generation_tokens_total)"
```

According to the [vLLM Metrics docs](https://docs.vllm.ai/en/latest/design/metrics/):

| Metric | Meaning |
|---|---|
| `vllm:num_requests_running` | Requests currently being computed |
| `vllm:num_requests_waiting` | Requests queued |
| `vllm:kv_cache_usage_perc` | Fraction of the KV cache in use |
| `vllm:generation_tokens_total` | Total tokens generated so far |
| `vllm:time_to_first_token_seconds` | Distribution of time to first token |

In production these feed Prometheus and Grafana for capacity planning: if `waiting` stays above 0 and `kv_cache_usage_perc` sits near 1 for long stretches, you're out of GPU.

## Security note: `--api-key` doesn't cover everything

Inside Colab the server only listens on `localhost`, so nothing outside can reach it, which is why no key was set above. But if you later run vLLM on a real server, the [vLLM Security docs](https://docs.vllm.ai/en/latest/usage/security/) are blunt about it:

> The --api-key flag (or VLLM_API_KEY environment variable) provides authentication for vLLM's HTTP server, but only for endpoints under the /v1, /v2, /inference, and /cohere path prefixes. Many other sensitive endpoints are exposed on the same HTTP server without any authentication enforcement.

The unprotected ones include `/metrics`, `/health`, `/version`, `/tokenize`, and operational endpoints such as `/pause` and `/abort_requests`. Any public deployment belongs behind a reverse proxy or gateway that handles authentication and routing — don't rely on `--api-key` alone.

## Alternatives on a Mac

For a similar experience on your own Mac, Ollama or LM Studio is the practical route: one-click install, Apple Silicon acceleration, and an OpenAI-compatible API. Neither is vLLM, and neither matches its concurrency, but the idea — run a model as a service and call `/v1/chat/completions` — is exactly the same. Setup and usage are in [The Complete Ollama Guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en).

## The big picture

Colab plus a T4 lets you see three things about vLLM without spending money or buying hardware: it's an OpenAI-compatible server, it merges many requests into one batch, and its Prometheus metrics tell you how much capacity is left. A T4 is too old and this model too small to show how big models or multi-GPU setups behave — that takes real data-center GPUs.

Where to go next:

- How a course teaches deployment: [NTU Applied Deep Learning TA recitations](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en) go from Colab all the way to serving with vLLM.
- Whether to self-host at all: [How to Pick a Self-Hosted Inference Server](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en).
- Swap in a somewhat larger model (say 1.5B–4B) and watch how `kv_cache_usage_perc` and tok/s change.

## References

- [Google Colab FAQ](https://research.google.com/colaboratory/faq.html)
- [vLLM docs: GPU installation](https://docs.vllm.ai/en/latest/getting_started/installation/gpu/)
- [vLLM docs: Quickstart](https://docs.vllm.ai/en/latest/getting_started/quickstart/)
- [vLLM docs: Reasoning Outputs](https://docs.vllm.ai/en/latest/features/reasoning_outputs/)
- [vLLM docs: Metrics](https://docs.vllm.ai/en/latest/design/metrics/)
- [vLLM docs: Security](https://docs.vllm.ai/en/latest/usage/security/)
- [vLLM GitHub Releases](https://github.com/vllm-project/vllm/releases)
- [vLLM issue #1157: T4 doesn't support bfloat16](https://github.com/vllm-project/vllm/issues/1157)
- [Qwen/Qwen3-0.6B model card](https://huggingface.co/Qwen/Qwen3-0.6B)
- [vLLM — From PagedAttention to a Production-Grade LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine-en)
- [How to Pick a Self-Hosted Inference Server](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en)
- [NTU Applied Deep Learning TA recitations](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en)
- [The Complete Ollama Guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en)
