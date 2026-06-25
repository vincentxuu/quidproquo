---
title: "Code Mode: Moving Tool Definitions from Context into Code"
date: 2026-05-10
type: deep-dive
category: ai
tags: [mcp, agent, code-mode, runtime, context-engineering, anthropic, cloudflare]
lang: en
tldr: "Stop stuffing all your tool descriptions into context at session start. Let the model write code, have the runtime execute it, and let tool definitions enter context only at the import line — Anthropic's GDrive→Salesforce example dropped from ~150K tokens to 2K, and Cloudflare's 2,500-endpoint schema shrank from 1.17M to 1K."
description: "Anthropic and Cloudflare published back-to-back posts introducing Code Mode, redefining how agents call tools: tools are imported modules, not schemas embedded in prompts."
draft: false
---

🌏 [中文版](/posts/ai/2026-05-10-code-mode-mcp-runtime-pattern)

My earlier post [MCP vs CLI vs API: The Real Boundaries of Agent Tool Interfaces](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface) tackled the "positioning" question: API is the base layer, five wrapper types each suit different scenarios, and MCP's only defensible moat is "cross-host sharing." But that post left a more practical question unanswered — **even when you've picked the right interface, why does a single agent workflow routinely burn through 100K+ tokens?**

On November 4, 2025, the [Anthropic engineering blog](https://www.anthropic.com/engineering/code-execution-with-mcp) and shortly after the [Cloudflare blog](https://blog.cloudflare.com/code-mode-mcp/) gave the same answer: the problem isn't the protocol, it's the habit of "eager loading." The fix is to let the model write code and turn tools from prompt schemas into imported modules. This pattern is now called **Code Mode**.

## The Problem Isn't MCP — It's Eager Loading

The default behavior of mainstream agent hosts is to load all connected tool descriptions into context the moment a session starts. The more tools, the heavier the initial context.

```
Traditional approach (eager loading)
┌──────────────────────────────────┐
│ Session starts                    │
│ ├─ Playwright MCP    13.7K       │
│ ├─ Chrome DevTools   18K         │
│ ├─ GitHub MCP        ~8K         │
│ ├─ Slack MCP         ~6K         │
│ ├─ Notion MCP        ~10K        │
│ ─────────────────────            │
│ Already spent before any work:   │
│   ~55K tokens                    │
└──────────────────────────────────┘
                 ↓
    Each step feeds tool output back to the model
                 ↓
    A single workflow balloons to 150K+ tokens
```

This isn't unique to MCP. OpenAPI tools, platform Actions, and function calling all hit the same wall — as long as "tool descriptions live in the prompt," a multi-tool environment is stuck paying this cost upfront.

## Code Mode: Tools Are Imported Modules

Code Mode flips the model in a single sentence: **tool definitions don't live in the prompt — they live in modules; agents don't fill in parameters — they write code.**

```
Code Mode
┌────────────────────────────────────┐
│ Model context at start:            │
│   runtime overview                 │
│   + "you can import @tools/<name>" │
│ ─────────────────────              │
│ Before any work: < 1K tokens       │
└────────────────────────────────────┘
                 ↓
        Model writes a TS / bash snippet
                 ↓
        Runtime executes → result back to model
                 ↓
    Tool definition enters context only at the import line
    Data only enters context when the model actually needs to see it
```

Workflows burn so many tokens because of two things compounding: (a) all tool schemas are loaded upfront, and (b) every step dumps the full tool output back to the model. Code Mode addresses both at once: tool definitions are lazy-loaded, and data gets reduced inside the code before it ever reaches the model.

### Anthropic's Example: GDrive → Salesforce

Syncing Google Drive meeting transcripts into Salesforce CRM.

| | Old approach | Code Mode |
|---|---|---|
| Tool schema loading | GDrive + Salesforce schemas both in context from the start | `import { getDoc } from "@tools/gdrive"`, `import { updateAccount } from "@tools/salesforce"` — two lines |
| Transcript flow | model → tool → model → tool (passes through model twice) | Passed as variables inside the runtime; model only sees a summary |
| Total tokens | ~150K | ~2K |

The 98.7% reduction comes from two things: tool schemas no longer live permanently in context, and raw transcripts never pass through the model.

### Cloudflare's Extreme Version

Cloudflare compressed their entire 2,500-endpoint API schema (1.17M tokens) down to two functions:

```typescript
search(query: string): EndpointDescriptor[]
execute(endpoint: string, params: object): unknown
```

The agent's initial context is only ~1K tokens — "there's a `search` and an `execute`; look up what you need." To get something done, first `search` for the endpoint, then `execute` it. Once a schema exceeds a certain size threshold, **directory-style lookup is cheaper than schema-in-prompt** — and that threshold is lower than most people think.

## Two Primitives: bash + Typed Imports

Code Mode runtimes aren't limited to TypeScript. In practice, two primitives are mixed and matched — the agent decides which to use for each task.

```
        Code Mode runtime
       ┌──────┴──────┐
       ▼             ▼
     bash       typed module import
   (already     (internal / proprietary APIs)
   installed)
       │             │
   git, curl,    @tools/salesforce
   grep, jq      @tools/stripe
   ffmpeg...     @tools/internal-*
```

**bash**: Everything already on `$PATH`. LLMs have seen millions of examples of `git log`, `grep -r`, and `curl | jq` in their training data, so they can use these correctly with almost no description needed. Want to find every Python file that imports pandas?

```bash
grep -r "import pandas" --include="*.py" .
```

No tool definition required. The shell is the interface.

**Typed module imports**: For things that have no existing CLI and didn't make it into LLM training data — internal systems, enterprise SaaS, private APIs. Each tool is written as a TypeScript file with explicit input/output types; the agent imports it only when it needs it.

These two primitives map directly onto the two tracks from my earlier [MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface) post: CLI wins on familiar tools covered in training; typed imports fill the schema gap for new things. The difference is that Code Mode puts them both inside **the same runtime** — it's no longer an either/or architectural choice.

## What It Looks Like in Practice

```typescript
import { searchFiles } from "@tools/github";
import { sendMessage } from "@tools/slack";

const files = await searchFiles({ pattern: "*.py", path: "./src" });
const summary = files.map(f => f.path).join("\n");

await sendMessage({
  channel: "#engineering",
  text: `Found ${files.length} Python files:\n${summary}`,
});
```

These few lines do three things that the old approach couldn't:

1. **Lazy tool definitions**: The runtime may have 50 tools, but only `searchFiles` and `sendMessage` ever enter the model's context for this task.
2. **Data reduced in code**: The full file list never passes through the model — only the `summary` does.
3. **Control flow is code**: Loops, conditionals, and map/filter all run in the runtime, not through model round-trips.

## Old Approach vs Code Mode

| Dimension | Tool-in-prompt | Code Mode |
|---|---|---|
| When tool definitions enter context | Session start, all at once | At the import line |
| Tool output flow | Back to model after every step | Passed in code; only reaches model when necessary |
| Cost with many tools | Scales linearly | Near zero (unused tools cost nothing) |
| Control flow (loop / branch) | Via model round-trips | Runtime runs it directly |
| Failure mode | Connecting too many servers blows the context | Runtime quota / sandbox errors |
| LLM capability required | Function calling is enough | Must be able to write TS / bash |

This isn't a free lunch — Code Mode assumes the model can write executable code. That's no problem for frontier models, but it's a real barrier for smaller ones.

## "Is MCP Dead?"

No. Anthropic revealed in the same post that MCP SDK downloads grew from 100M at the start of the year to 300M — the fastest-growing piece of agent infrastructure.

What died is the habit of "loading all tool schemas into the prompt at session start." MCP is still the standard interface for writing tools; only the host-side consumption pattern changed —

```
Before: MCP server → tool list loaded into prompt → model calls via function call
After:  MCP server → wrapped as typed module → enters Code Mode runtime → model imports it
```

The protocol is the same; the packaging changed. Nothing changes for people writing MCP servers. For people building agent hosts, the work shifts from "designing prompts" to "designing runtimes."

## The Bigger Picture

Reading my earlier [MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface) post alongside this one, a clear evolution emerges:

> **The interface war is over. What remains is runtime design.** MCP, OpenAPI, and CLI are not runtimes — they're primitives that runtimes assemble. Code Mode is the runtime that assembles them.

Should you migrate to Code Mode right now? Two conditions matter:

- You're connecting 5+ tool sources simultaneously and context is already tight — worth migrating.
- You're connecting one or two tools and the prompt is still clean — you don't need this infrastructure layer yet.

But in the medium-to-long term, there's only one answer: **tool definitions belong in code, not in context.**

## References

- [MCP vs CLI vs API: The Real Boundaries of Agent Tool Interfaces](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface) (earlier post on this site)
- [Anthropic — Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Cloudflare — Code Mode: the better way to use MCP](https://blog.cloudflare.com/code-mode-mcp/)
- [Akshay Pachaar — MCP vs CLI was the wrong debate](https://x.com/akshay_pachaar/status/2053166970166772052)
- [Model Context Protocol official site](https://modelcontextprotocol.io/)
