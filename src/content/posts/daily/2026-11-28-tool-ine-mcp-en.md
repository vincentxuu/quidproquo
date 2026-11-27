---
title: "Tool Pick｜INE MCP — Spain's national statistics office ships its own MCP server for AI agents"
date: 2026-11-28
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "INE MCP is an MCP server published by Spain's national statistics office, letting AI assistants query official data like unemployment and population figures in plain language, with a server-enforced five-step order that blocks guessed statistical codes"
tldr: "INE MCP is an MCP server published by Spain's national statistics office (INE) itself, letting agents query official statistics directly. Install: uv sync, then uv run ine-mcp. It fixes the problem of INE's statistical code system being hard to navigate and agents guessing their way through multi-step calls."
series:
  name: "AI Tool of the Day"
  order: 92
---

> :globe: [中文版](/posts/daily/2026-11-28-tool-ine-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | INE MCP |
| Type | MCP server |
| GitHub | [es-ine/mcp](https://github.com/es-ine/mcp) |
| Stars | 195 (checked 2026-11-28, published two days earlier by Spain's national statistics office) |
| Language | Python |
| License | EUPL-1.2 |
| Install | `uv sync && uv run ine-mcp` (after cloning the repo) |

## What Problem It Solves

Say you want the last four quarters of the male unemployment rate in Murcia, Spain. The number is sitting in INE's (Instituto Nacional de Estadística, Spain's national statistics office) public API, but getting to it means finding the right one of over a hundred "statistical operations," then the right table inside it, where every province, sex and age bracket is represented as a numeric code. Learning that code system takes a human a while; letting an LLM guess at the codes is worse, because a wrong code looks just as plausible as a right one — it can pull the wrong category entirely, or fail outright, and nothing in the response tells you where it went wrong.

INE MCP isn't a third-party wrapper around the API — INE built it themselves. It splits the query process into five read-only tools and enforces their order on the server: pick the statistical operation, then the table, then the table's variable groups, then the values for those variables, and only then can you pull the actual data. Each step accepts only IDs that a previous step genuinely returned; skip a step or invent an ID and the server rejects it outright with a `BLOCKED` response naming the tool to call next. Every successful result comes with the official table's URL and the filters that were applied, so it can be checked and cited.

It fits economic or policy research on Europe, fact-checking for journalism, or any analysis agent that needs trustworthy official Spanish statistics. It's also worth studying as a pattern for exposing any multi-step API with ID dependencies to an agent safely, well beyond this one use case.

```diagram
title: INE MCP's enforced step order blocks out-of-order queries
desc: Calling straight through to the data step is rejected; only starting from the operation lookup and following the order actually reaches INE's public API.
caption: Simplified from the official README's "Enforced order" section; the full flow has five steps, and this diagram only shows the failed skip-ahead attempt and the successful in-order path.
step: The AI assistant skips ahead and calls the data-fetching tool directly
step: MCP rejects it locally and returns BLOCKED
step: The AI assistant starts over from step one and looks up the statistical operation
step: MCP forwards the lookup to INE's public API
step: INE API returns the matching operations
step: MCP hands the operation ID back to the AI assistant, which can now proceed
---
<svg viewBox="0 0 640 456">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="420"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="420"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="420"/>

  <g data-step="1">
    <path class="dg-line" d="M96 132H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="120" text-anchor="middle" dominant-baseline="central">skip ahead to data</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M316 180H100" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-text--warn" x="208" y="168" text-anchor="middle" dominant-baseline="central">BLOCKED</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 252H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="240" text-anchor="middle" dominant-baseline="central">look up operation</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M324 300H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="288" text-anchor="middle" dominant-baseline="central">query catalogue</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--dashed" d="M540 348H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="432" y="336" text-anchor="middle" dominant-baseline="central">return operations</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 396H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="208" y="384" text-anchor="middle" dominant-baseline="central">ready for next step</text>
  </g>

  <rect class="dg-box" x="316" y="120" width="8" height="72" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="240" width="8" height="168" rx="2" data-step="3 4 5 6"/>
  <rect class="dg-box" x="540" y="288" width="8" height="72" rx="2" data-step="4 5"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">AI assistant</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">INE MCP</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">INE API</text>
</svg>
```

## Getting Started

### Install

```bash
git clone https://github.com/es-ine/mcp.git ine-mcp
cd ine-mcp
uv sync                 # requires Python 3.11+ and uv
claude mcp add ine -- uv run --directory "$(pwd)" ine-mcp
```

### Basic usage

Ask a plain-language question, and INE MCP walks through five tools in order, each one accepting only the IDs the previous step actually returned:

```text
You ask: "What was the male unemployment rate in Murcia over the last four quarters?"

1. ine_select_operation("labour force survey")        → finds the operation_id for the Labour Force Survey
2. ine_select_multiple_tables(operation_id)            → lists available tables, picks the unemployment-rate one
3. ine_select_multiple_table_groups(table_id)          → reads the table's variable groups (province, sex, age...)
4. ine_select_multiple_values(table_id, group_id)      → resolves "Murcia" and "male" to their value IDs
5. ine_select_multiple_table_data(table_id, tv=[...])  → returns the figures plus the official INE table URL
```

### Advanced usage (optional)

```bash
# One-line install for VS Code
code --add-mcp '{"name":"ine","command":"uv","args":["run","--directory","/path/to/ine-mcp","ine-mcp"]}'
```

```toml
# Codex CLI (~/.codex/config.toml)
[mcp_servers.ine]
command = "uv"
args = ["run", "--directory", "/path/to/ine-mcp", "ine-mcp"]
```

## How It Compares

| | INE MCP | Manually browsing INE's website | General-purpose web scraping (Firecrawl etc.) |
|---|---|---|---|
| Natural-language question finds the right operation and table | ✓ | ✗ (you need to know the codes) | Partial (reads the text, but doesn't understand INE's operation/table/variable code structure) |
| Result always includes the official table URL | ✓ | ✓ (whichever one you found yourself) | Depends on the page; often just fragments of text |
| Blocks guessed or skipped-ahead variable codes | ✓ (server-enforced five-step order) | — | ✗ (the LLM can invent codes) |
| Requires knowing INE's statistical system beforehand | ✗ | ✓ | Partial |
| Hits the live INE API, not a stale cache | ✓ | ✓ | Depends on when it was scraped |

## Things to Watch

- **Local setup only, for now**: the README lists the hosted endpoint as "available soon." Until it ships, using this means `git clone` and `uv sync` — there's no installable package that connects to a remote service yet.
- **Only 110 of 166 statistical operations have tables**: the other 56 are listed by name in the catalogue, but INE hasn't published their tables yet, so querying those returns nothing.
- **Data labels are in Spanish**: tool descriptions are in English, but the actual variable values and category names come back exactly as INE publishes them — in Spanish. Non-Spanish-speaking users or agents need to handle that translation themselves.
- The project is marked "Work in progress," and the README's disclaimer states the code is provided "as is," with INE not liable for damages from its use. It was published 2026-11-26, and while it climbed to 195 stars within two days, no outside users have reported issues yet — worth running against statistics you can personally verify before putting it into a production pipeline.

## Today's Takeaway

The notable part of a national statistics office shipping its own MCP server isn't just that Spain's unemployment figures became queryable — it's that the primary data holder, not a scraper or a third-party wrapper, decided what interface to hand an agent. Instead of one big, flexible `query(sql)`-style tool, they chose five small tools with an enforced order, so "does this variable value actually exist" gets caught in the call chain itself, instead of surfacing only after the agent has already assembled a set of coordinates that don't match the table's real columns. That state-machine trick — using enforced call order to keep an agent from hallucinating its way through a dependent, multi-step API — is directly reusable by anyone wrapping their own such API for agent use.

## References

- [es-ine/mcp — GitHub](https://github.com/es-ine/mcp)
- [es-ine/mcp — README](https://github.com/es-ine/mcp/blob/main/README.md)
- [Instituto Nacional de Estadística (INE)](https://www.ine.es)
- [INE JSON API documentation](https://www.ine.es/dyngs/DAB/index.htm?cid=1099)
- [Model Context Protocol](https://modelcontextprotocol.io)
