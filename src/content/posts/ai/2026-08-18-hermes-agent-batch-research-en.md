---
title: "The Research Side of Hermes Agent: Batch-Running Thousands of Prompts Into Training Data"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, trajectory, training-data, batch-processing, api-server, nous-research]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 11
tldr: "`batch_runner.py` runs thousands of prompts in parallel into ShareGPT-format tool-calling trajectories, lets each prompt name its own container image, and resumes by matching prompt content rather than index. Two quality filters run before you see the data: samples with zero reasoning are discarded, and entries calling hallucinated tool names are dropped at merge time. This is why a research lab builds a personal agent — the agent is the data pipeline."
description: "Batch trajectory generation in Hermes Agent — toolset distribution sampling, content-based resume, and quality filtering — plus the two ways to embed Hermes in your own systems: the OpenAI-compatible API server and the Python library."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-batch-research)

Post 11 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

The first ten posts covered how to use Hermes. This one answers a different question: **why does Nous Research, a lab that trains models, put this much effort into a personal agent?**

The answer is a single-line cell in the README's feature table:

> **Research-ready** — Batch trajectory generation, trajectory compression for training the next generation of tool-calling models.

The agent isn't only a product. It's also **a training-data pipeline**. Once that clicks, several design choices from earlier posts stop looking arbitrary — why tools are grouped into samplable toolsets, why every session lands in SQLite, why the presence or absence of reasoning is counted.

## `batch_runner.py`: the agent as a data generator

```bash
python batch_runner.py \
    --dataset_file=data/prompts.jsonl \
    --batch_size=10 \
    --run_name=my_first_run \
    --model=anthropic/claude-sonnet-4.6 \
    --num_workers=4
```

Input is JSONL with at least a `prompt` field per line. **Each prompt runs a full agent session with tool access in its own isolated environment** — an entirely different thing from batch text completion. What comes out is multi-turn trajectories containing real tool calls.

Output lands in `data/<run_name>/`: `trajectories.jsonl` (the merged final artifact), per-batch `batch_N.jsonl` files, `checkpoint.json`, and `statistics.json`.

A single trajectory, abbreviated:

```json
{
  "prompt_index": 42,
  "conversations": [
    {"from": "human", "value": "Write a function..."},
    {"from": "gpt", "value": "I'll create that function...", "tool_calls": []},
    {"from": "tool", "value": "..."}
  ],
  "completed": true,
  "api_calls": 3,
  "toolsets_used": ["terminal", "file"],
  "tool_stats": {"terminal": {"count": 2, "success": 2, "failure": 0}},
  "tool_error_counts": {"terminal": 0}
}
```

`conversations` uses the ShareGPT-style `from`/`value` shape. One detail worth stealing: **`tool_stats` is normalized so every possible tool appears, zero-filled when unused** — the docs say this exists to keep the schema consistent across entries for HuggingFace datasets compatibility. That's a data-engineering concern, not an agent concern, and it tells you exactly who this file is for.

## Toolset distributions: diversity comes from sampling

The toolset each prompt receives isn't fixed — it's sampled from a **distribution** (`--list_distributions` shows what's available).

The docs clarify the mechanism, which is easy to misread:

> distributions assign a probability to **each individual toolset**. The sampler flips each toolset independently, then guarantees that at least one toolset is enabled.

Each toolset gets its own coin flip rather than being drawn from a hand-authored table of preset combinations. The goal is training data that covers diverse tool combinations — if every sample carries the same toolset, the model only learns that one arrangement.

## Resume by content, not by index

A run of several thousand prompts will be interrupted, so resume quality decides whether the tool is usable. Hermes:

1. Scans all `batch_*.jsonl` files for completed prompts — **matching actual text content, not indices**
2. Filters those out of the dataset
3. Re-batches and runs only what remains
4. Merges old and new batch files into the final `trajectories.jsonl`

Content matching means **a changed dataset order still resumes correctly** — inserting a few prompts mid-run doesn't shift everything and force a redo. Only successfully completed prompts count as done, so failures are retried on resume.

This is my favorite piece of design in the doc: it assumes your dataset will change rather than assuming you won't touch it.

## Two quality filters, applied before you see the data

- **No-reasoning filter**: samples where zero assistant turns contain reasoning (no `<REASONING_SCRATCHPAD>`, no native thinking tokens) are discarded.
- **Hallucinated-tool filter**: entries calling tool names outside the valid tool list are dropped during the final merge.

The second matters more than it looks. **A hallucinated tool call that reaches your training set teaches the next model to keep hallucinating.** It's a contamination mode specific to tool-calling datasets, and one that plausibility-based human spot-checking is bad at catching.

On completion the runner reports per-tool call counts and success/failure rates, reasoning coverage, discarded-sample counts, and total duration, and writes them to `statistics.json`.

## Per-prompt container images

Benchmark datasets often need different environments, declared inline in the JSONL:

```jsonl
{"prompt": "Install numpy and compute eigenvalues of a 3x3 matrix", "image": "python:3.11-slim"}
{"prompt": "Compile this Rust program and run it", "image": "rust:1.75"}
{"prompt": "Set up a Node.js Express server", "image": "node:20-alpine", "cwd": "/app"}
```

This works with the Docker, Modal, and Singularity backends (see [the terminal backends post](/en/posts/ai/2026-08-18-hermes-agent-terminal-backends)), and images are **verified as accessible before each prompt runs** — far better than discovering a typo'd image name at prompt 800.

On cost, the docs are direct: batch runs spin up many concurrent agent sessions, each making model and tool calls. That's exactly where [the subscription approach](/en/posts/ai/2026-08-18-hermes-agent-tool-gateway) earns its keep — a stable cost-per-trajectory beats juggling rate limits across five vendor accounts.

## RL: Atropos

One level up is reinforcement learning. The official learning path includes an "I want to train models" track pointing at Nous's own RL environment framework, [Atropos](https://github.com/NousResearch/atropos) — using Hermes-generated trajectories and environment interaction to fine-tune model behavior.

The Hermes docs only signpost this; the details live in Atropos, so this post doesn't go further. What matters is that **batch runner and Atropos are upstream and downstream of one pipeline**: the runner produces data, Atropos trains on it, and the resulting model goes back to being the agent's brain.

## Embedding Hermes in your own systems: two routes

Outside research, the other non-interactive use is treating Hermes as a component.

**One: an OpenAI-compatible API server.** Set `API_SERVER_ENABLED=true` and `API_SERVER_KEY` in `~/.hermes/.env`, start the gateway, and it listens on `http://127.0.0.1:8642`. Any frontend that speaks the OpenAI format — Open WebUI, LobeChat, LibreChat, NextChat — connects.

The point is that **it isn't a plain model proxy**: requests are handled by your agent with its full toolset (terminal, files, web search, memory, skills), and when streaming, tool progress appears inline so the frontend can show what the agent is doing. `/v1/chat/completions` is **stateless** — the full conversation ships in `messages` on every request.

`API_SERVER_CORS_ORIGINS` is only needed when a browser must call Hermes directly. Leave it unset otherwise; it's the door through which an agent with shell access becomes reachable.

**Two: as a Python library.**

```python
from run_agent import AIAgent

agent = AIAgent(model="anthropic/claude-sonnet-4.6", quiet_mode=True)
print(agent.chat("What is the capital of France?"))
```

`chat()` runs the whole conversation loop internally — tool calls, retries — and returns just the final text. For the full message history and metadata, use `run_conversation()`, whose dict carries `final_response` and `messages`.

Three practical notes:

- **Always set `quiet_mode=True`.** The docs flag this with a warning: without it, CLI spinners and progress indicators pollute your application's output.
- Control permissions with `enabled_toolsets` or `disabled_toolsets`. The docs' rule of thumb is a good one: **use `enabled_toolsets` for a minimal locked-down agent (a research bot with web search only), and `disabled_toolsets` when you want most capabilities minus specific ones (no terminal in a shared environment).**
- Installation matches [the install post](/en/posts/ai/2026-08-18-hermes-agent-install): clone, `uv sync`, run with `uv run python your_app.py`. **Hermes publishes no supported wheel or sdist for `requirements.txt` installs**, so "pip install it into my project" isn't an available path.

## The takeaway

If you just want a chat agent, skip this post. But it answers the question the series opened with: **the self-improvement loop, the grouped toolsets, the full session persistence — none of it is a feature list assembled by a product manager. It's the byproduct of a data pipeline.** A lab training tool-calling models needs an agent that genuinely uses tools to generate genuine trajectories, and what falls out of that is, incidentally, a good personal agent.

Which also suggests an evaluation angle: **when product needs and research needs conflict, which way does this project lean?** Today they're aligned — a better agent produces better data — but it's worth keeping in view.

Back to [the series opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

## References

- [Hermes Agent — Batch Processing](https://hermes-agent.nousresearch.com/docs/user-guide/features/batch-processing)
- [Hermes Agent — API Server](https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server)
- [Hermes Agent — Using Hermes as a Python Library](https://hermes-agent.nousresearch.com/docs/guides/python-library)
- [Hermes Agent — Learning Path](https://hermes-agent.nousresearch.com/docs/getting-started/learning-path)
- [Atropos — Nous Research's RL environment framework](https://github.com/NousResearch/atropos)
- [HuggingFace datasets](https://huggingface.co/docs/datasets/index)
