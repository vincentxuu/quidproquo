---
title: "LLM Council: Karpathy's Weekend Multi-Model Parliament — Three Stages of LLM Peer Review"
date: 2026-04-13
type: guide
category: ai
tags: [llm-council, karpathy, multi-model, openrouter, fastapi, ensemble, peer-review]
lang: en
tldr: "LLM Council is a local Web App Andrej Karpathy built over a weekend. It sends one question to multiple LLMs simultaneously, has them anonymously peer-review each other, and then a Chairman model synthesizes a final answer. Positioned as a small tool for comparing models while studying — 99% vibe coded with no plans for long-term maintenance — but the architecture itself is a minimal ensemble LLM implementation worth studying."
description: "An introduction to karpathy/llm-council's three-stage multi-model collaboration design, architecture, installation, and the use cases it's suited (and not suited) for."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-13-llm-council-karpathy-intro)

Most people use LLMs by picking one model and sticking with it. Andrej Karpathy's weekend project [llm-council](https://github.com/karpathy/llm-council) proposes a different approach: **ask multiple models the same question simultaneously, have them peer-review each other, then ask a "Chairman" to make the final call.** The result is a local ChatGPT-style Web App with a clean interface that you can use directly for comparative study.

## Core Concept: Three-Stage Collaboration

The Council workflow isn't complex, but it's well-designed:

**Stage 1 — First Opinions**
The user's prompt is dispatched in parallel to all council members (e.g., GPT-5, Claude Opus, Gemini, Grok, etc.), and each model responds independently. The frontend displays results in tabs so you can switch between them for comparison.

**Stage 2 — Review (Anonymous Peer Review)**
Each model receives the other members' responses — but **identities are anonymized**, showing only `Response A / B / C / D` with no indication of which model wrote what. Models are asked to rank the other answers by accuracy and insight. The anonymous design in this stage is the project's most critical design choice: it prevents models from showing bias because "this looks like something Claude wrote."

**Stage 3 — Final Response (Chairman Synthesis)**
A pre-designated Chairman model reads all initial responses plus all peer reviews, then synthesizes a final reply for the user.

The result is not just one answer, but **an answer that has been through a debate process** — you can expand the tabs to see each model's original opinion, how they rated each other, and then the Chairman's synthesized conclusion.

## Why Do This

A single LLM has three common problems: it can confidently say wrong things, it has a fixed style, and its domain strengths are limited. Ensemble methods are a common solution, but most focus on "voting" or "routing" — Council takes the path of **having models peer-review each other**.

This design has several subtle advantages:

- **Anonymous peer review reduces a model's preference for its own family**: Without anonymization, GPT would likely favor the style of another GPT's response.
- **Peer review itself is a form of self-consistency check**: If an answer ranks last in every other model's eyes, something is probably wrong with it.
- **The Chairman isn't a voting machine**: It reads all opinions before writing, which preserves details and diverse viewpoints better than simple majority rule.

This isn't an academically rigorous ensemble method, but as an everyday "multi-model second opinion" tool, it's practical enough.

## Technical Architecture

The project's tech choices are minimalist, very fitting for a "weekend project":

| Aspect | Details |
|--------|---------|
| Backend | FastAPI (Python 3.10+) |
| HTTP Client | httpx (async) |
| Model Gateway | [OpenRouter](https://openrouter.ai/) (one API key for all providers) |
| Frontend | React + Vite |
| Conversation Storage | Local JSON files |
| License | MIT |

Using OpenRouter is the key to keeping this project so lean — no need to integrate four separate SDKs for OpenAI / Anthropic / Google / xAI; one key, one API handles everything. The trade-off is paying OpenRouter's intermediary fee and slightly higher latency for some models compared to direct connections.

### Overall Flow

```
               ┌──────────────┐
 user query ─▶ │   FastAPI    │
               │   backend    │
               └──────┬───────┘
                      │  (fan-out, async)
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │ GPT-5   │   │ Claude  │   │ Gemini  │   ... (council members)
   └────┬────┘   └────┬────┘   └────┬────┘
        └─────────────┼─────────────┘
                      │  Stage 1: First Opinions
                      ▼
         ┌──────────────────────────┐
         │ Anonymize + redistribute │
         └──────────┬───────────────┘
                    │  Stage 2: Peer Review (blind)
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      rank        rank        rank
        └───────────┼───────────┘
                    ▼
              ┌──────────┐
              │ Chairman │   Stage 3: Synthesis
              └────┬─────┘
                   ▼
              final answer
```

## Installation and Usage

```bash
# Backend
uv sync
echo "OPENROUTER_API_KEY=sk-or-..." > .env
uv run python -m backend.main

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Or just run the `start.sh` script provided by the author.

To change council members, edit `backend/config.py`:

```python
COUNCIL_MODELS = [
    "openai/gpt-5",
    "anthropic/claude-opus-4.5",
    "google/gemini-3-pro",
    "x-ai/grok-4",
]
CHAIRMAN_MODEL = "anthropic/claude-opus-4.5"
```

Adding members, swapping the Chairman, or adjusting prompts is just editing this file — no framework magic involved.

## Suitable and Unsuitable Use Cases

**Suitable:**

- **"Second opinion" while studying / researching**: The author's own use case — throw in controversial or uncertain claims and see what different models have to say.
- **Model evaluation**: When you want to observe different models' styles and error patterns on the same question, this beats manually switching tabs and copy-pasting.
- **Starting point for learning ensemble LLM**: The entire codebase is small enough to read in an afternoon, making it ideal for forking and adapting into your own pipeline.

**Not suitable:**

- **Production environments**: The author explicitly states this is vibe coded and won't be maintained.
- **Low-latency requirements**: Three sequential stages mean total time is roughly max(Stage 1) + max(Stage 2) + Chairman inference time, typically 30 seconds to a minute.
- **Cost-sensitive scenarios**: A single question calls N models + N peer reviews + one synthesis, using roughly (2N+1) times the tokens of a single model.
- **Tool calling / Agent behavior**: This is a pure Q&A framework with no tool use.

## Things to Watch Out For

- **OpenRouter dependency**: If you want to connect directly to each provider's API, you'll need to rewrite the call logic in `backend/` — it's not a config-level change.
- **Anonymization is prompt-level only**: If a model's response contains obvious "I am Claude" self-references, other models may still identify it.
- **Chairman bias gets amplified**: Since the Chairman writes the final answer, its style and blind spots are directly reflected in the conclusion. Consider rotating the Chairman periodically.
- **Storage format is JSON files**: Convenient for auditing raw results from each round, but not suitable for high-volume conversations.

## Overall Takeaway

The value of llm-council isn't as a production-ready tool — it's that it clearly demonstrates the concept of "multi-model collaboration + anonymous peer review + chairman synthesis" in **a few hundred lines of code**. Karpathy positions it as "a little toy for studying," but this codebase is actually a solid reference implementation — anyone building multi-model products can fork it and iterate much faster than starting from scratch.

While everyone is talking about agents, tool use, and RAG, this project returns to a more fundamental question: **Is a single LLM good enough? If not, would a group of LLMs checking each other be better?** The answer isn't always yes, but at least this tool lets you test that hypothesis every day.

## References

- [karpathy/llm-council GitHub Repository](https://github.com/karpathy/llm-council)
- [OpenRouter Official Website](https://openrouter.ai/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/)
- [oh-my-openagent: Multi-Model Agent Team Coding Framework](/posts/ai/2026-04-05-oh-my-openagent-multi-model-orchestration)
- [Multi-Model Routing: Open-Source Tools Comparison](/posts/ai/2026-04-02-multi-model-routing-opensource-tools)
