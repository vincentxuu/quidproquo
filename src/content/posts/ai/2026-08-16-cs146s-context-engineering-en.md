---
title: "CS146S Week 2: Context Engineering, RePPIT, and MCP's 98.7% Cut"
date: 2026-08-16
category: ai
tags:
  - cs146s
  - context-engineering
  - mcp
  - prompt-engineering
  - ai-agent
  - spec-driven-development
lang: en
type: deep-dive
series:
  name: "CS146S: Ten Weeks of AI-Native Development"
  order: 3
tldr: "Fall 2026 compresses a full week of prompting into one bullet here and adds RePPIT (Research, Propose, Plan, Implement, Test) and MCP. Two RePPIT rules are worth stealing outright: always ask for exactly two proposals, and never let the instance that wrote the code review it. On the MCP side, Anthropic measured turning tools into code calls dropping 150,000 tokens to 2,000."
description: "Stanford CS146S Fall 2026 Week 2, 'Advanced Context Engineering': where context engineering diverges from prompt engineering, the operational rules inside RePPIT's five steps, spec-driven development, and MCP's servers/clients/tools/transport plus the token math of code execution."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-16-cs146s-context-engineering)

This is the third post in the [CS146S series](/posts/ai/2026-08-16-cs146s-course-map-en), covering Week 2 of Fall 2026.

Four listed topics: advanced prompting techniques and when each applies, RePPIT and spec-driven development, MCP fundamentals (servers, clients, tools, transport), and tool ergonomics. The two sessions are "Advanced prompting + agentic dev frameworks" and "Full introduction to MCP and tool-calling."

Start with the biggest signal in this week: **Fall 2025 had a whole session called "Power prompting for LLMs." In Fall 2026 it is the first of four bullets.**

## Why prompting got demoted

Anthropic frames the shift clearly in [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents):

> Building with language models is becoming less about finding the right words and phrases for your prompts, and more about answering the broader question of "what configuration of context is most likely to generate our model's desired behavior?"

The difference is single-turn versus multi-turn. For a one-shot classification or generation task, the prompt is nearly everything. For an agent running dozens of tool calls, the system prompt is a small slice of its context; the rest is tool definitions, tool output, file contents, and message history. However well you polish one paragraph, it won't outweigh the noise that piles in over thirty turns.

The post's most usable line is this test:

> good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome

The mechanism underneath is an attention budget. Anthropic cites Chroma's [context rot research](https://research.trychroma.com/context-rot): as tokens increase, a model's ability to accurately recall information from that context decreases, and "this characteristic emerges across all models." The cause is that a transformer's n² pairwise relationships get stretched thin, compounded by training distributions where short sequences dominate.

Practical conclusion: **the context window is a budget, not a warehouse.**

## RePPIT: one prompt split into five milestones

RePPIT comes from the course's own instructor, Mihail Eric, who published a [full write-up](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) on MLOps Community in June 2026. The letters stand for **Re**search, **P**ropose, **P**lan, **I**mplement, **T**est.

His framing of why splitting matters is blunt:

> One-shotting a feature there is like texting a contractor, "build me an office tower," and expecting move-in-ready floors.

The operational details of each step are far more useful than the acronym:

**Research** — have the model write the current state into a 100–300 line Markdown document that describes and does not recommend. The post specifically says to **regenerate it every time and not commit it**: "A live read beats a cached one, like a current map versus a printout from last year." This is your first human checkpoint and the cheapest place to catch a misunderstanding.

**Propose** — always exactly **two** options. The reasoning: "ask for more, and the extras are just reskins of the first." Two forces genuinely distinct approaches, each returned in a fixed shape: overview, key changes, trade-offs, validation, open questions.

**Plan** — fill a design doc template with functional and non-functional requirements, key decisions with rationale, data models, integration points, and **an explicit list of files touched and not touched**. Clear the context before running this step so the back-and-forth from step 2 doesn't pollute it.

**Implement** — by now the model has almost no room to guess.

**Test** — one rule here is worth copying verbatim:

> do not let the instance that wrote the code review it. It will defend its own choices if it is biased toward an initial implementation, like proofreading your own writing and reading what you meant to type.

Switch model families, or clear context entirely so the reviewer builds its own understanding. The post adds that a harness's built-in review mode carries the same concern.

As for the "2-3X faster" number: it comes from the framework's own author with no independent measurement, so read it as an experience claim.

Spec-driven development is the same direction under a different name. Fall 2025's Week 3 assigned [Specs Are the New Source Code](https://blog.ravi-mehta.com/p/specs-are-the-new-source-code), whose argument is that the spec, not the code, becomes the artifact you maintain. RePPIT's Plan step is that idea given a concrete shape.

## MCP: four nouns and a token bill

The course splits MCP fundamentals into servers, clients, tools, and transport. The short version:

- **server**: wraps some system's capabilities behind a standard interface (GitHub, a database, your internal API)
- **client**: the agent side, handling connection and invocation
- **tool**: a single action a server exposes, with a name, description, and parameter schema
- **transport**: how the two talk (local stdio, or remote HTTP)

Since [MCP](https://modelcontextprotocol.io/) launched in November 2024, Anthropic's own summary of where it landed is that "the industry has adopted MCP as the de-facto standard for connecting agents to tools and data."

But the thing to take from this week is the cost. In [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp), Anthropic measured two forms of waste: every tool definition loaded up front, and every intermediate result passing through the model. Their example writes a Google Drive meeting transcript into Salesforce — the same transcript flows through context twice, and "for a 2-hour sales meeting, that could mean processing an additional 50,000 tokens."

The fix is to present MCP tools as code APIs on a filesystem and let the agent write code against them instead of making one tool call at a time:

```
servers
├── google-drive
│   ├── getDocument.ts
│   └── index.ts
└── salesforce
    ├── updateRecord.ts
    └── index.ts
```

The measured difference: "This reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%." Cloudflare reached the same conclusion under the name [Code Mode](https://blog.cloudflare.com/code-mode/).

Anthropic also writes the cost down: running agent-generated code needs sandboxing, resource limits, and monitoring, and "these infrastructure requirements add operational overhead." That thread runs straight into [Week 9's MCP portals and gateways](/posts/ai/2026-08-16-cs146s-ai-native-team-en).

## Tool ergonomics: designing tools for agents

The syllabus phrase is "Designing tools for agent ergonomics." A usable checklist:

- One tool, one job — overlapping functionality makes the choice ambiguous
- Parameter names should explain themselves; no `opts`, `data`, `payload`
- Return values should be token-efficient — five filtered rows and a count beat ten thousand raw rows
- Write error messages for the model: what went wrong and what to do next
- Less is more — more tools means more chances to pick the wrong one

## Three moves for long-horizon tasks

The same context engineering post lists three ways to handle tasks that exceed the context window, and all three foreshadow later weeks:

| Technique | What it does | Best for |
|---|---|---|
| Compaction | Summarize a nearly-full conversation and restart context from the summary | Tasks needing extensive back-and-forth |
| Structured note-taking | Write progress to files outside context (`NOTES.md`, todo lists) | Iterative work with clear milestones |
| Sub-agents | Subordinate agents explore in clean contexts and return only conclusions | Parallel exploration and research |

The sub-agent line comes with a number: a subagent may burn tens of thousands of tokens but returns "a condensed, distilled summary of its work (often 1,000-2,000 tokens)." That ratio is the entire value proposition — it keeps the intermediate process off the main thread.

## What will go stale

- Fall 2026 readings aren't published; the sources here were selected against the published topics
- "2-3X faster" and "98.7%" come from the framework's author and a tool vendor respectively — both are self-measured
- MCP's transport specification is still evolving; check current docs before implementing

## References

- [CS146S Fall 2026 syllabus](https://themodernsoftware.dev/) — Week 2 topics and sessions
- [RePPIT: A Framework to Ship Production Code 2-3X Faster](https://mlops.community/blog/reppit-a-framework-to-ship-production-code-2-3x-faster) — Mihail Eric, MLOps Community, 2026-06-02
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic Engineering, 2025-09-29
- [Code execution with MCP: Building more efficient agents](https://www.anthropic.com/engineering/code-execution-with-mcp) — Anthropic Engineering, 2025-11-04
- [Code Mode: the better way to use MCP](https://blog.cloudflare.com/code-mode/) — Cloudflare
- [Model Context Protocol documentation](https://modelcontextprotocol.io/) — servers, clients, transports
- [Context Rot: Understanding Degradation in AI Context Windows](https://research.trychroma.com/context-rot) — Chroma Research, assigned in Fall 2025 Week 6
- [Specs Are the New Source Code](https://blog.ravi-mehta.com/p/specs-are-the-new-source-code) — assigned in Fall 2025 Week 3
