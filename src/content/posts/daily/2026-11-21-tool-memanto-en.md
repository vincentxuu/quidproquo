---
title: "Tool of the Day: Memanto — Agent Memory That Writes Without Burning LLM Tokens, Built to Catch Cross-Agent Contradictions"
date: 2026-11-21
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "Memanto is an open-source memory agent: remember writes with no LLM call and no vector index to build, with built-in cross-agent conflict detection and expiry policies. Memanto Cloud, a no-install hosted option, launched today."
tldr: "Memanto is an open-source agent memory system you can get running in five minutes with pip install memanto, with MCP support and 38 integrations. It solves the problem of multiple agents keeping their own memories that quietly contradict each other."
series:
  name: "AI Tool of the Day"
  order: 85
---

> :globe: [中文版](/posts/daily/2026-11-21-tool-memanto)

## Tool Info

| Item | Value |
|---|---|
| Name | Memanto |
| Type | CLI + SDK (Python/TS/Go) + MCP server |
| GitHub | [moorcheh-ai/memanto](https://github.com/moorcheh-ai/memanto) |
| Stars | 2.4k (GitHub's rounded display at check time; exact count unavailable; 743 forks) |
| Language | Python (core and CLI); TypeScript and Go ship as official SDKs |
| License | MIT |
| Install | `pip install memanto` |

## What Problem It Solves

Say you've wired up several agents on the same project — Claude Code for the backend, Cursor for the frontend, Codex for refactors. Three months in, you discover two of them disagree about which database you're on: one still remembers the Postgres decision from March, the other learned about last week's move to MongoDB, and neither knows the other is working from a stale fact. Most memory tools only handle the "store" half of the job. None of them flag "these two facts contradict each other — you might want to look."

Memanto positions itself as a memory *agent*, not a memory API. `remember` writes without calling any LLM to extract structure, and without building a vector index — what you write is searchable the instant it lands. Under the hood it runs the author's own retrieval engine, Moorcheh, which compresses embeddings to binary and ranks by information-theoretic relevance rather than nearest-neighbor vector search, so the same query returns the same result every time, which makes it debuggable. Every memory carries a type (decision, preference, fact, learning, and 10 more), a confidence score, a source, and a timestamp. When new information contradicts something already stored, Memanto doesn't silently overwrite it — the new memory supersedes the old one while keeping the prior version, and conflicts between agents get flagged for a human to review. Expiry works the same way: you write a YAML policy saying which memory types should retire after how long, and retired memories are marked but still restorable, not deleted outright.

```diagram
title: Two agents write contradicting memories; Memanto flags the conflict
desc: Agent A remembers "use Postgres" first. Agent B later remembers "use MongoDB." Memanto detects the contradiction and flags it for review; when Agent B queries afterward, it gets both the current value and the conflict record.
step: Agent A writes "use Postgres"
step: Memanto confirms the write
step: Agent B writes "use MongoDB"
step: Memanto detects the conflict and flags it for review
step: Agent B queries "which database are we on"
step: Memanto returns the current value plus the conflict record
---
<svg viewBox="0 0 640 420">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="380"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="380"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="380"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="108" text-anchor="middle" dominant-baseline="central">remember: use Postgres</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 164H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="152" text-anchor="middle" dominant-baseline="central">write confirmed (cp-1)</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M540 208H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="196" text-anchor="middle" dominant-baseline="central">remember: use MongoDB</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M324 252H536" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="430" y="240" text-anchor="middle" dominant-baseline="central">conflict detected, flagged</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M540 296H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="284" text-anchor="middle" dominant-baseline="central">recall: which database</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M324 340H536" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="430" y="328" text-anchor="middle" dominant-baseline="central">returns MongoDB + conflict record</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="196" width="8" height="68" rx="2" data-step="3 4"/>
  <rect class="dg-box" x="316" y="284" width="8" height="68" rx="2" data-step="5 6"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Agent A</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">Memanto</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Agent B</text>
</svg>
```

Good fit for: a project that runs several coding agents at once and needs one shared "what's actually true right now" source; teams who want an auditable trail of decisions and lessons an agent has already learned, instead of trusting an agent's own recollection of the past; or anyone migrating memory from one platform (Mem0, Letta, Supermemory, etc.) to another without re-entering everything by hand.

## Getting Started

### Install

No-install, hosted option (Memanto Cloud, which launched today — sign in from your browser, no Docker needed):

```bash
pip install memanto
memanto login      # browser authorization, no API key to copy
memanto connect    # pick the tools to wire up: claude-code, cursor, codex... 15+ options
```

Fully on-prem, nothing leaves your machine (requires Docker + Ollama):

```bash
pip install memanto
memanto            # pick "Memanto local" → "on-prem" from the interactive menu
```

Wiring it up as MCP (a one-line config for any MCP-compatible client):

```bash
pip install memanto-mcp
```

```json
{
  "mcpServers": {
    "memanto": {
      "command": "memanto-mcp",
      "env": {
        "MOORCHEH_API_KEY": "mch_xxxxxxxxxxxxxxxxxx",
        "MEMANTO_DEFAULT_AGENT_ID": "my-assistant"
      }
    }
  }
}
```

Get a `MOORCHEH_API_KEY` for free at [console.moorcheh.ai](https://console.moorcheh.ai/api-keys) — the free tier covers 100K operations a month, no card required.

### Basic Usage

```bash
# Monday: the backend agent learns something
memanto remember "Auth migrated to JWT — session cookies deprecated" --type decision

# Friday: the review agent never saw that session, but already knows
memanto recall "how does auth work"
memanto answer "why did we drop session cookies?"   # a grounded answer pulled from memory
```

The MCP interface exposes the same 7 tools by default: `remember`, `batch_remember`, `recall`, `recall_recent`, `recall_as_of`, `recall_changed_since`, `answer`.

### Advanced Usage

Ask what the agent believed at a given point in time, and what's changed since:

```bash
memanto recall "deployment policy" --as-of 2026-10-01
memanto recall "deployment policy" --changed-since "last 7 days"
```

Write your own expiry policy (stored at `~/.memanto/policies/<agent>.yaml`):

```yaml
retention:
  context: 7d
  event: 30d
  preference: never          # durable user preferences never age out
rules:
  - name: low-confidence-guesses
    match: {provenance: [inferred], confidence_below: 0.5}
    expire_after: 14d
```

## How It Compares

| | Memanto | Mem0 (agentic pipeline) | Handwritten in CLAUDE.md / AGENTS.md |
|---|---|---|---|
| Calls an LLM on write | No | Yes (entity extraction / graph building) | N/A |
| Time until a write is searchable | Instant | Waits on indexing (README's own benchmark: ~48 minutes) | Instant (but plain text — the agent still has to judge what's true) |
| Cross-agent conflict detection | Yes, auto-flagged for review | No built-in mechanism | None — purely manual discovery |
| Stale-memory cleanup | Policy-driven, reversible | You build it yourself | The file just keeps growing |
| Fully on-prem | Yes (Docker + Ollama) | Depends on deployment | Already local files |
| Native MCP support | Yes (`memanto-mcp`, 7+4 tools) | Needs a separate integration | N/A |

## Things to Watch

- **The cloud path still needs a Moorcheh API key**: the free tier covers 100K operations a month, and you pay past that. Only the "Memanto local + on-prem" path needs no key at all and keeps data entirely off the network.
- **The README is upfront about its own benchmark limits**: the authors state plainly that "scores from different projects on these benchmarks aren't comparable" and that "reader model, judge model, judge prompt" can each move results by several points. They also publish the suite where Memanto loses to Mem0 (letting more stale and injected records into the top results on the adversarial test). Treat the numbers as directional, not absolute.
- **It overlaps with whatever `CLAUDE.md`/`AGENTS.md` memory convention your project already has**: decide which one is the single source of truth before adopting it, or you end up with two memory systems to keep in sync.
- **Admin tools are off by default — think before turning them on**: the MCP server only exposes the 7 read/write memory tools out of the box. `create_agent`/`delete_agent` and similar management tools require explicitly setting `MEMANTO_EXPOSE_ADMIN=true`, which keeps one agent from accidentally wiping another agent's memory namespace.

## Today's Takeaway

Most agent memory tools optimize for "how to store, how to search." Memanto's angle is "how do you know which memory is correct right now" — for a single agent in a single session, retrieval accuracy really is the main bottleneck, but once several agents share one memory, versioning and conflict detection start to matter more than raw search precision. That's also why Memanto's lead over Mem0 is much wider on the benchmark that stresses repeatedly-revised facts over time than on a plain retrieval-accuracy test.

## References

- [moorcheh-ai/memanto — GitHub](https://github.com/moorcheh-ai/memanto)
- [Memanto README (raw)](https://raw.githubusercontent.com/moorcheh-ai/memanto/main/README.md)
- [memanto-mcp integration docs (raw)](https://raw.githubusercontent.com/moorcheh-ai/memanto/main/integrations/mcp/README.md)
- [Memanto: Typed Semantic Memory with Information-Theoretic Retrieval for Long-Horizon Agents (arXiv)](https://arxiv.org/abs/2604.22085)
- [Memanto by Moorcheh — Product Hunt](https://producthunt.com/products/memanto-by-moorcheh)
- [Model Context Protocol docs](https://modelcontextprotocol.io)
