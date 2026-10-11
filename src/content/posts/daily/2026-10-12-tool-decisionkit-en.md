---
title: "Tool Pick｜decisionkit — give agents a probability instead of a paragraph"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "A provider-neutral CLI and MCP server that turns binary checks, classification, scoring, and ranking into probability scores agents can threshold on, instead of full LLM reasoning"
tldr: "decisionkit is a CLI and MCP server that routes binary/classification/scoring/ranking questions to a dedicated decision API and gets back probabilities instead of prose. Install: npm i -g @adxtya21/decisionkit. It solves the problem of agents burning a full LLM turn on simple classification, with no probability score to automate on."
series:
  name: "AI Tool of the Day"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-10-12-tool-decisionkit)

## Tool Info

| Field | Value |
|---|---|
| Name | decisionkit |
| Type | CLI + MCP server + Claude Code plugin |
| GitHub | [adityajha2005/decisionkit](https://github.com/adityajha2005/decisionkit) |
| Stars | 4 |
| Language | TypeScript |
| License | MIT |
| Install | `npm i -g @adxtya21/decisionkit` |

## What problem it solves

A CI pipeline or an agent script is full of small judgment calls: is this issue a bug or a feature request? Does this diff break the public API? What severity is this incident? The usual move is to hand the whole thing to an LLM and ask it to answer in plain language, then parse the result back out — slow, costly, and the reply rarely carries a confidence number you can actually automate on. You end up bolting on your own heuristic for "does this sound confident enough to pass."

decisionkit reframes that as a probability problem instead of a text-generation problem. It's a provider-neutral interface in front of the OpenAI Decisions API, Jev (TypeSafe AI, direct or through OpenRouter), or the Claude Code login you already have (no extra API key, but slower). You ask a binary, choice, score, or rank question, and it returns a probability per option rather than a paragraph. With a probability in hand you can set a `--threshold`: auto-approve when confidence is high, and route the rest to a human.

It's a good fit wherever the answer space is fixed but a plain rule set isn't enough: classifying issue type in CI, flagging a diff as a likely breaking change, grading incident severity, or ranking candidate files by relevance before feeding them to the next step of an agent.

## Quick Start

### Install

```bash
npm i -g @adxtya21/decisionkit

# No extra API key needed if you already have Claude Code
export DECISIONKIT_PROVIDER=claude

# Or use a dedicated decision API (faster, returns real probabilities)
export DECISIONKIT_PROVIDER=openai DECISIONKIT_OPENAI_API_KEY=sk-...
```

### Basic usage

```bash
echo "Clicking Export CSV returns HTTP 500 since v2.3" | \
  decisionkit choice "What kind of issue is this?" bug feature refactor docs
# bug 1
```

### Advanced usage

Use it as a CI gate that auto-flags likely breaking changes by probability:

```bash
git diff origin/main | \
  decisionkit binary "Does this diff break the public API?" --threshold 0.8 \
  && echo "needs a major version bump"

# Or grade incident severity
decisionkit score "How severe is this incident?" SEV4 SEV3 SEV2 SEV1 \
  --context "Checkout returns 500 for all users"
# SEV1 0.88 (expected 2.9)
```

Run `decisionkit` with no arguments and it's also an MCP server, installable into Claude Code, Codex, Cursor, VS Code, Gemini CLI, Claude Desktop, Windsurf, or Zed. There's a dedicated Claude Code plugin too (`claude plugin install decisionkit@decisionkit`).

## Compared to existing approaches

| | decisionkit | Asking an LLM directly (full reasoning) | Hand-written keyword/regex classifier |
|---|---|---|---|
| Returns a probability score | ✅ | Needs explicit formatting, often unreliable | ❌ |
| Speed and cost | ✅ 135ms–1.8s, $0.0018–0.0045 per 100 calls | ❌ Noticeably slower and pricier | ✅ Fastest |
| Handles semantically ambiguous cases | ✅ | ✅ | ❌ |
| Needs rules maintained by hand | ❌ | ❌ | ✅ |
| Native CLI / MCP / Claude Code plugin | ✅ | — | — |

(Speed and cost figures are from the project's own 100-task benchmark — see references below.)

## Things to watch out for

- **Probabilities are estimates, not calibrated confidence**: the README itself says they "haven't been verified as calibrated for your task" — pick thresholds against your own labeled examples rather than trusting a default 0.5 or 0.8.
- **The `claude` provider is slower**: about 4 seconds per call, and it counts against your own Claude Code plan usage rather than being free.
- **Still moving fast (0.4.0)**: the README recommends pinning a version (`npm i -g @adxtya21/decisionkit@0.4.0`) so the tool's behavior doesn't change under you; clients like Codex or Gemini CLI that strip or filter environment variables need the extra `env_vars` configuration documented in the README for the API key to actually reach the server.

## Today's takeaway

I used to assume agent classification only had one shape: ask the LLM, get back text, parse it yourself. Seeing a dedicated decision API return a probability instead of language made the shift click — it hands the agent pipeline a knob that's actually automatable: auto-approve the high-confidence cases, route the rest to a human, instead of re-reading the LLM's explanation at every single step to decide what happens next.

## References

- [adityajha2005/decisionkit — GitHub repo](https://github.com/adityajha2005/decisionkit)
- [decisionkit README](https://raw.githubusercontent.com/adityajha2005/decisionkit/main/README.md)
- [@adxtya21/decisionkit — npm package](https://www.npmjs.com/package/@adxtya21/decisionkit)
- [decisionkit bench/RESULTS.md — 100-task accuracy/cost/latency benchmark](https://github.com/adityajha2005/decisionkit/blob/main/bench/RESULTS.md)
