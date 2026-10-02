---
title: "Learn Inference: Inference Engineering, Rebuilt with Dials You Can Turn"
date: 2026-09-29
category: ai
type: deep-dive
tags: [inference, llm-inference, model-serving, gpu, learning-path]
lang: en
tldr: "learn-inference.com is an unofficial interactive companion to Philip Kiely's Inference Engineering (256 pages, Baseten Books, free PDF). It follows the book's 8 chapters and 42 sections with rewritten explanations, turns intuition-heavy ideas like TTFT, P99, speculative decoding, and prefix-cache routing into slider-driven simulators, and ships a keyless JSON API and MCP server."
description: "An introduction to Learn Inference, an interactive site for learning inference engineering: how it relates to the book, how the simulators build intuition, a chapter map, its llms.txt and MCP interfaces for agents, reading paths by role, and its limits."
draft: false
glossary:
  - term: "TTFT"
    aliases: ["time to first token"]
    definition: "The time from sending a request to receiving the first token, set mostly by the prefill phase."
    context: "The first simulator on the Learn Inference home page lets you adjust TTFT and tokens per second separately to feel the difference."
  - term: "prefill / decode"
    aliases: ["prefill", "decode"]
    definition: "The two phases of LLM inference: prefill processes the whole prompt at once and is compute bound; decode emits one token per forward pass, reading the entire model from memory each time, and is bandwidth bound."
    context: "Much of the book and site is organized around this two-phase split."
  - term: "roofline"
    aliases: ["roofline model"]
    definition: "A chart that uses arithmetic intensity (operations per byte read) to show whether a workload is limited by memory bandwidth or compute. The diagonal is the bandwidth ceiling; the flat top is the compute ceiling."
    context: "The simulator in section 2.4 uses it to show why decode at batch size 1 always sits on the bandwidth side."
---

> 🌏 [中文版](/posts/ai/2026-09-29-learn-inference-interactive-guide)

"Training teaches a model what it knows. Inference is everything that happens afterward, every time somebody uses it, and it is where the bill actually lands." That is the opening line of [Learn Inference](https://learn-inference.com/).

The site is an interactive companion to [Philip Kiely](https://www.baseten.co/inference-engineering/)'s *[Inference Engineering](https://www.baseten.co/inference-engineering/)*, a 256-page book from Baseten Books that you can download as a free PDF. It follows the book's 8 chapters and 42 sections, rewrites the explanations, and replaces the parts that are "easier to understand by turning a dial than by reading a paragraph" with simulators. If you call LLM APIs but can't quite explain why a self-hosted model takes 400ms to produce its first word and then streams 30 per second, this site is written for you.

## What it is: an unofficial interactive edition

First, the relationship to the book. The [About page](https://learn-inference.com/about) is blunt: this is an independent project with no connection to Baseten or Philip Kiely, nobody there reviewed or signed off on it, and when a rewritten explanation or figure gets something wrong, "the mistake was made here, not in the book." The author is unnamed; the About page says the site won't tell you, but the per-chapter Ask AI will if you ask.

So its scope equals the book's, delivered as web pages plus simulators. On audience, [Baseten's book page](https://www.baseten.co/inference-engineering/) is candid: anyone can read the first twenty pages, but after that some familiarity with coding and CS concepts helps. The site inherits the same bar.

How it compares with other ways to learn inference:

| Resource | Strength | Weakness |
|---|---|---|
| The book (PDF) | Complete, carries the author's own judgment | Static; you imagine the numbers |
| [Stanford CS336's inference lecture](/en/posts/ai/2026-08-22-cs336-inference-en) | Derives from first principles, has assignments | Research-leaning; light on autoscaling and multi-cloud operations |
| Engine docs like [vLLM](/en/posts/ai/2026-03-14-vllm-inference-engine-en) | Most precise on configuration | Only covers itself, not the trade-off landscape |
| Learn Inference | Whole landscape plus simulators, free, no signup | Unofficial rewrite; errors are the site's own |

## Why inference deserves its own study

Section 0.1 opens with a distinction that's easy to miss: training is a project, with a budget and an end date; inference is an operation, with no end date, load set by other people, and cost that scales with your success. What the rest of the book keeps returning to is inference's own two phases: prefill processes the whole prompt at once and is compute bound; decode reads the entire model from memory for every token and is bandwidth bound.

Those phases map to two numbers users actually feel: TTFT (how long until the first word) and TPS (how many words per second after that). The first simulator on the home page, taken from section 1.4, gives you a slider for each and a Run button to watch the response stream. The point it wants you to see:

> A response that starts instantly and trickles can feel faster than one that pauses and then dumps, even when the second finishes first.

Read that sentence and you'll forget it. Drag the slider once and you won't. That's the bet the whole site makes.

For chapter 5's quantization, speculative decoding, KV cache re-use, parallelism, and disaggregation, the chapter intro frames it this way: each trades precision, memory, complexity, or hardware for latency or throughput, and the chapter is about knowing which trade you're making.

## The simulators are the point

Every figure in the book is an interactive component on the site. [llms.txt](https://learn-inference.com/llms.txt) explains why: what the figures teach is "the response to input, which does not survive being written down." A few worth visiting on purpose:

- **1.4, why the mean hides your worst requests**: push the tail weight up and the mean barely moves while P99 runs away. The caption calls that gap "the one in a hundred users who thinks your product is broken."
- **2.4, the roofline**: the diagonal is what memory bandwidth allows, the flat top is what the tensor cores allow. Decode at batch size 1 sits far left of the ridge on every GPU you can buy, which is why batching exists.
- **5.2, where speculative decoding stops paying**: lower the acceptance rate or lengthen the draft and the speedup drops below 1, meaning you're paying for compute to go slower. [The section text](https://learn-inference.com/chapters/techniques/speculative-decoding) adds a caveat people skip: at high batch sizes compute is no longer idle, and speculation can reduce total throughput.
- **5.3, the routing problem under prefix caching**: a shared prefix only needs processing once, but the cache lives on one replica. Without cache-aware routing, an eight-replica fleet finds it one time in eight, and most of the theoretical win quietly disappears.
- **7.2, what a cold start is made of**: four stages, and why a warm pool matters most — it removes the one stage you don't control, getting GPUs from your cloud provider.

One detail made me trust the site more: every figure is labeled with where its numbers come from — "Illustrative numbers," "Constants from the book," or "Datasheet numbers." It doesn't pass off illustrations as measurements.

## Chapter map

| Ch. | Topic | In one line |
|---|---|---|
| 0 | [Inference](https://learn-inference.com/chapters/inference) | Runtime, infrastructure, tooling: three layers, none optional |
| 1 | [Prerequisites](https://learn-inference.com/chapters/prerequisites) | Write "fast enough" as numbers before touching a kernel |
| 2 | [Models](https://learn-inference.com/chapters/models) | From linear layers to transformers to diffusion; find the bottleneck |
| 3 | [Hardware](https://learn-inference.com/chapters/hardware) | Reading GPU spec sheets, Hopper through Rubin |
| 4 | [Software](https://learn-inference.com/chapters/software) | CUDA → PyTorch → vLLM / SGLang / TensorRT-LLM, NVIDIA Dynamo |
| 5 | [Techniques](https://learn-inference.com/chapters/techniques) | Quantization, speculative decoding, caching, parallelism, disaggregation |
| 6 | [Modalities](https://learn-inference.com/chapters/modalities) | VLMs, embeddings, ASR, TTS, image and video generation |
| 7 | [Production](https://learn-inference.com/chapters/production) | Containers, autoscaling, multi-cloud GPUs, zero-downtime deploys, client code |

There's also a [glossary](https://learn-inference.com/chapters/glossary) and a [further reading](https://learn-inference.com/chapters/reading) list grouped by area, taken from the book's Appendix B.

## The side built for agents

The site is far friendlier to agents than most documentation. The [Developers page](https://learn-inference.com/developers) lists four ways in:

- Append `.md` to any page URL for Markdown, or send `Accept: text/markdown`
- The whole book as one file at [`/llms-full.txt`](https://learn-inference.com/llms-full.txt), indexed at [`/llms.txt`](https://learn-inference.com/llms.txt)
- A read-only JSON API, `GET /api/v1/chapters`, with no account or key, described by an [OpenAPI 3.1 spec](https://learn-inference.com/openapi.json)
- An MCP server exposing two tools, `list_chapters` and `get_chapter`, with no authentication

Hooking it into Claude Code or Claude Desktop takes one config block:

```json
{
  "mcpServers": {
    "learn-inference": {
      "url": "https://learn-inference.com/api/mcp"
    }
  }
}
```

I called the MCP server's `tools/list` and both tools came back. Note that the MCP server and API expose the chapter index, not the full text; for content, use `.md` or `llms-full.txt`. The book's author also warns that it's about 60,000 tokens, so don't feed it to an agent in one chunk.

Every chapter has an Ask AI box that answers about the page you're on. The [privacy page](https://learn-inference.com/privacy) says your question travels through Vercel's AI Gateway along with the current page, it can only read pages on the site, and your IP is hashed before being used for rate limiting.

## How to read it

By role:

- **Application engineers** (calling APIs, building RAG or agents): read chapters 0 and 1, then jump to 5.3 Caching and 7.5 Client code. Something to do tonight: measure TTFT and P99 for your service separately instead of looking only at average latency.
- **People about to self-host models**: go 2.4 → 3 → 4.3 → 5, playing with each simulator before reading the text. Then pick up our [open-source LLM self-hosting guide](/en/posts/ai/2026-08-26-open-source-llm-self-hosting-guide-en) to map the concepts onto real framework choices.
- **Interview prep**: each of chapter 5's five sections is a common ML system design topic, and the simulator captions work as one-sentence answers.

## Limits

- **It isn't the book**: the explanations are rewritten, and the site says errors are its own. If you're citing a number or argument, check it against [the book](https://www.baseten.co/inference-engineering/).
- **Lots of illustrative numbers**: most simulators are labeled "Illustrative numbers." Good for intuition, not for estimating your own latency or cost.
- **Anonymous author**: no byline means no traceable expertise behind it; for teaching material, that means doing more of your own verification.
- **NVIDIA-centric**: the hardware and software chapters focus on NVIDIA's ecosystem, with other accelerators getting an overview in 3.4 — a scope inherited from the book.

## References

- [Learn Inference](https://learn-inference.com/) — home page
- [Learn Inference: About](https://learn-inference.com/about) — relationship to the book, non-affiliation statement
- [Learn Inference: Developers](https://learn-inference.com/developers) — JSON API, MCP server, error format, versioning
- [Learn Inference: llms.txt](https://learn-inference.com/llms.txt) — site-wide chapter index and note on simulators
- [Learn Inference: Privacy](https://learn-inference.com/privacy) — where Ask AI data goes
- [Learn Inference: 5.2 Speculative decoding](https://learn-inference.com/chapters/techniques/speculative-decoding)
- [Inference Engineering (Baseten Books)](https://www.baseten.co/inference-engineering/) — the book by Philip Kiely, free download
- [Stanford CS336: Inference](/en/posts/ai/2026-08-22-cs336-inference-en) — related post on this site
- [vLLM inference engine](/en/posts/ai/2026-03-14-vllm-inference-engine-en) — related post on this site
- [Open-source LLM self-hosting guide](/en/posts/ai/2026-08-26-open-source-llm-self-hosting-guide-en) — related post on this site
