---
title: "9Router: A Local 3-Tier Fallback Router That Routes Claude Code / Cursor / Cline to 40+ Providers"
date: 2026-05-09
category: ai
tags:
  - ai-router
  - 9router
  - claude-code
  - cursor
  - cline
  - codex
  - llm-routing
  - token-saving
  - oauth
  - fallback
lang: en
tldr: "Spin up a local OpenAI-compatible endpoint at localhost:20128 that automatically routes requests from Claude Code / Cursor / Cline / Codex / Copilot through a Subscription → Cheap → Free 3-tier fallback to 40+ providers. Built-in RTK compresses tool_result (saving 20–40% input tokens), Caveman mode compresses output, OAuth auto-refresh, multi-account round-robin — install with npm install -g 9router and two commands."
description: "9Router is a local router that unifies Claude Code / Cursor / Cline and other AI coding CLIs to 40+ LLM providers, offering 3-tier fallback, RTK token compression, format translation, and multi-account management."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-9router-ai-coding-router-introduction)

The [previous post comparing LLM inference services](https://quidproquo.cc/posts/ai/2026-05-09-llm-inference-free-tier-comparison/) laid out the free tiers and pricing of 30+ inference providers. The next question is: once you have a pile of API keys, how do you make Claude Code, Cursor, Cline, and other CLIs automatically switch between them, max out your subscription, and seamlessly fall back to cheap or free tiers when quota runs out?

`decolua/9router` is a local router built specifically for this. Claude Code, Codex, and Cursor all support pointing to a custom OpenAI endpoint. 9Router runs at `http://localhost:20128/v1`, connecting to 40+ providers and 100+ models behind the scenes, automatically falling back according to the "combo" you define.

## Why a Router, Not a SaaS Gateway

OpenRouter, Vercel AI Gateway, and HF Inference Providers are all cloud gateways that funnel requests through a remote endpoint. 9Router takes the opposite approach:

- **Runs locally** (global npm install, Docker, VPS, or Cloudflare Workers all work)
- **OAuth tokens stay on your machine** (directly uses Claude Code, Codex, Antigravity, Cursor, GitHub Copilot subscriptions)
- **API keys stay on your machine** — no third party involved
- **9Router itself is completely free and open-source** — the "cost" shown in the dashboard is a converted comparison, not an actual charge

Feeding subscription-based OAuth tokens to a cloud gateway is a gray area in most ToS. Running 9Router locally sidesteps that issue entirely. The trade-off is you need to run a Node.js daemon yourself.

## 3-Tier Auto Fallback Is the Core Logic

Bind your subscription, cheap, and free tiers into a single combo — when quota runs out or you hit a 429, it automatically switches to the next tier:

```
Combo: my-coding-stack
  Tier 1  cc/claude-opus-4-6      ← Subscription (use until exhausted)
  Tier 2  glm/glm-4.7             ← $0.6/1M cheap backup
  Tier 3  kr/claude-sonnet-4.5    ← Kiro AI free
```

This is far less effort than manually switching endpoints and copy-pasting API keys, and more robust than writing your own wrapper — it handles all of the following out of the box:

- **OAuth token auto-refresh**: Automatically renews tokens for Claude Code, Codex, and Antigravity before they expire
- **Multi-account round-robin**: Each provider can have multiple accounts with rotation or priority ordering
- **Real-time quota tracking**: Shows remaining tokens per provider and countdown to next reset
- **Format translation**: CLI sends requests in OpenAI format, but the backend might be Claude / Gemini / Cursor / Kiro / Vertex / Antigravity / Ollama — 9Router translates in between

That last point is the most critical — it lets Claude Code talk directly to Gemini, or Codex talk directly to Claude, absorbing the adapter work that would otherwise require custom code.

## RTK Token Saver: Save 20–40% Input Tokens

9Router has [RTK](https://github.com/rtk-ai/rtk) built in — middleware that compresses `tool_result` content before the LLM ever sees the prompt.

The biggest token drain for coding agents isn't the conversation itself — it's tool output: a single `git diff` can produce thousands of lines, `grep -r` across an entire repo, `tree` listing directory structures, build logs, test output. These can consume 30–50% of the prompt budget in a single turn.

RTK has built-in filters: `git-diff` / `git-status` / `grep` / `find` / `ls` / `tree` / `dedup-log` / `smart-truncate` / `read-numbered` / `search-list`. **Auto-detection** — it reads the first 1KB of each `tool_result` to decide which filter to apply, no manual configuration needed. **Safe fallback** — if compression fails, produces larger output, or errors out, it falls back to the original text without breaking the request. **Runs before format translation**, so it works for OpenAI / Claude / Gemini / Cursor / Kiro / OpenAI Responses alike.

```
Without RTK: 47K tokens sent to LLM
With RTK:    28K tokens sent to LLM   (40% saved · same context · same answer)
```

Enabled by default; can be toggled off in the dashboard. This feature alone makes it worth installing for coding agents.

On the other side, there's also **Caveman Mode** ([Caveman](https://github.com/JuliusBrussee/caveman)) — it injects a caveman-speak prompt into the system message so the LLM responds in abbreviated language, preserving technical content while saving up to 65% on output tokens. Better suited for fully automated pipelines; don't enable it if you need to read the LLM's responses.

## Supported CLI Tools and Providers

**CLI side (any tool that supports a custom OpenAI endpoint)**: Claude Code, OpenClaw, Codex, OpenCode, Cursor, Antigravity, Cline, Continue, Droid, Roo, Copilot, Kilo Code.

**Providers fall into three categories**:

- **OAuth subscriptions**: Claude Code, Antigravity, Codex, GitHub Copilot, Cursor. Your existing subscriptions — 9Router squeezes every last second before reset.
- **Truly free (unlimited or very generous)**: Kiro AI (includes Claude 4.5 + GLM-5 + MiniMax), OpenCode Free (no registration required, auto-discovers model list), Vertex AI (new GCP accounts get $300 credits).
- **API Key 40+**: OpenRouter, GLM, Kimi, MiniMax, OpenAI, Anthropic, Gemini, DeepSeek, Groq, xAI, Mistral, Perplexity, Together, Fireworks, Cerebras, Cohere, NVIDIA, SiliconFlow, plus Nebius, Chutes, Hyperbolic, and any OpenAI / Anthropic-compatible endpoint.

The three most commonly used cheap-tier providers (pricing taken directly from the README): GLM-5.1 / 4.7 at roughly `$0.60 / 1M tokens`, MiniMax M2.7 at roughly `$0.20 / 1M tokens`, Kimi K2.5 at $9/month flat. After maxing out your subscription and burning quota to zero, falling back to these three is an order of magnitude cheaper than using the Anthropic / OpenAI API directly.

## A Practical Caveat

The README includes an important warning:

> **iFlow, Qwen, and Gemini CLI free tiers stopped working in 2026. Use Kiro / OpenCode Free / Vertex instead.**

Many 9Router tutorials written in 2025 listed iFlow as an unlimited free fallback — that no longer works. If you followed an old guide and your third tier keeps failing, this is why. Free tiers change fast, which is exactly why it's worth letting a router manage your fallback list rather than hardcoding it in your own wrapper.

## Installation and Wiring

Two commands:

```bash
npm install -g 9router
9router
```

The dashboard automatically opens at `http://localhost:20128/dashboard`. Connect your providers (one click for OAuth, paste for API keys) and you're done. Point your CLI tool's endpoint here:

```
Endpoint: http://localhost:20128/v1
API Key:  <provided by the dashboard>
Model:    <the combo name you created in the dashboard>
```

Data is stored in `~/.9router/db.json` (Windows: `%APPDATA%/9router/db.json`) — a plain file, easy to back up.

To run from source (the public repo is `9router-app`, the npm package name is `9router`):

```bash
git clone https://github.com/decolua/9router
cp .env.example .env
npm install
PORT=20128 NEXT_PUBLIC_BASE_URL=http://localhost:20128 npm run dev
```

VPS and Docker deployment snippets are available in the README. Cloudflare Workers is also supported, but for personal use localhost is sufficient.

## The Big Picture

If you only use one provider and never run out of quota, 9Router is over-engineering. Its value shines when:

- **You have both subscriptions and APIs**: Claude Pro you want to max out + GLM as a cheap backup + Kiro as free insurance
- **Multiple CLI tools**: Claude Code, Cursor, and Cline sharing the same provider configuration
- **Cross-format needs**: Codex CLI wants to hit Claude, Claude Code wants to hit Gemini
- **Multiple accounts**: Your team or you personally have two or three accounts with the same provider
- **Token savings matter**: Your coding agent makes hundreds of tool calls a day, and RTK's 30–40% savings translate to real money

Not a good fit for: fully automated batch pipelines that already have their own throttle/fallback logic, situations where you don't want to run an extra daemon, or when your model usage is so small that token savings don't matter.

A practical minimal combo recommendation: **Kiro AI (free unlimited Claude 4.5) + OpenCode Free (no registration) + your existing subscription** — bind all three into one combo with RTK on by default, and you'll feel the difference on day one.

## References

- [9Router Official Site](https://9router.com/)
- [9Router GitHub](https://github.com/decolua/9router)
- [9Router npm](https://www.npmjs.com/package/9router)
- [RTK Token Saver](https://github.com/rtk-ai/rtk)
- [Caveman](https://github.com/JuliusBrussee/caveman)
- [Kiro AI](https://kiro.dev/)
- [OpenCode](https://opencode.ai/)
- [Vertex AI Free Trial](https://cloud.google.com/free)
- [GLM (Zhipu)](https://open.bigmodel.cn/)
- [MiniMax](https://www.minimax.io/)
- [Kimi (Moonshot)](https://platform.moonshot.cn/)
- [On-site: 2026 LLM Inference Provider Free Tiers and Pricing](https://quidproquo.cc/posts/ai/2026-05-09-llm-inference-free-tier-comparison/)
