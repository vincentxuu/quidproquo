---
title: "Turning a Scraper Script into an MCP Server for Claude to Use Directly"
date: 2026-03-20
type: guide
category: tech
tags: [mcp, claude, python, fastmcp, ai-agent]
lang: en
tldr: "Wrap a local Python script into an MCP Server using FastMCP so Claude Code can call it directly — no more manually running pipelines."
description: "A step-by-step walkthrough of turning a 104.com job scraper into an MCP Server: what MCP is, how to implement it, and how to register it with Claude Code."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-20-mcp-server-job-scraper)

I have a script that scrapes job listings from 104.com and LinkedIn, then uses an LLM to score, filter, and generate a report. The pipeline looks like this:

```
uv run fetch.py → produces JSON → uv run filter.py → produces Markdown report
```

Every time I wanted to search for jobs, I had to run it manually and remember the right arguments. Then it occurred to me that I could wrap it as an MCP Server and let Claude call it directly. The full code is at [vincentxuu/offernow](https://github.com/vincentxuu/offernow).

## What is MCP?

MCP (Model Context Protocol) is a protocol defined by Anthropic that allows Claude to call external tools. You write a server, define a few tool functions, and Claude knows "these tools are available" — then decides on its own when to call them during a conversation.

```
You: Find me recent AI-related job listings
        ↓
Claude calls list_local_data → learns what data is available
Claude calls filter_and_score_jobs → filters and scores results
Claude summarizes and replies to you
```

The difference from running scripts directly: you don't need to know which command to run. Claude figures it out for you.

## Architecture

This server does not do the scraping — the scraper still runs manually or on a schedule. The MCP Server only handles reading local JSON, filtering, and scoring:

```
uv run fetch.py          ← runs periodically, produces JSON (slow, takes minutes)
        ↓
data/104_jobs_search.json

        ↓ MCP reads this file

Claude Code ←→ mcp_server.py (real-time)
```

The scraper being slow is fine — it's completely decoupled from the MCP layer.

## Implementation

Install FastMCP:

```bash
uv add "mcp[cli]"
```

Create `mcp_server.py`, wrapping existing functions as tools:

```python
from mcp.server.fastmcp import FastMCP
from filter import pre_filter, score_batch_with_llm, build_report, load_jobs

mcp = FastMCP("offernow")

@mcp.tool()
def list_local_data() -> dict:
    """List locally available job data, including record count and last updated time."""
    ...

@mcp.tool()
def filter_and_score_jobs(max_llm: int = 20) -> str:
    """Load local JSON → pre-filter → LLM scoring → return a Markdown report."""
    jobs_104, jobs_linkedin = load_jobs(DATA_DIR)
    filtered = pre_filter(jobs_104, jobs_linkedin)
    ...
    return build_report(scored, unscored, stats)

@mcp.tool()
def search_local_jobs(
    keyword: str,
    source: str = "all",
    limit: int = 50,
    offset: int = 0,
    include_description: bool = False,
) -> dict:
    """Search job listings in local data without making any network requests."""
    ...
    return {"total": total, "by_source": by_source, "count": len(page), "results": page}

if __name__ == "__main__":
    mcp.run()
```

The `@mcp.tool()` decorator is all you need. FastMCP automatically generates a schema from the docstring and type hints — that's how Claude knows what each tool does and what parameters it accepts.

A few implementation details worth noting:

**Control response size**: The local dataset has 1,000+ job listings. Dumping everything into a tool response would overflow the context window. `search_local_jobs` defaults to `include_description=False` to drop the largest field, and `limit=50` caps the record count. Use `offset` for pagination when more results are needed.

**Return metadata**: Return a `dict` rather than a `list`, including `total` and `by_source`, so Claude knows how many records exist and where they came from — helping it decide whether to query further.

## Registering with Claude Code

```bash
claude mcp add -s user offernow -- bash -c "uv run mcp_server.py"
```

Since `claude mcp add` doesn't have a `--cwd` flag, you'll need to edit `~/.claude.json` directly and update the command to include a `cd`:

```json
{
  "mcpServers": {
    "offernow": {
      "type": "stdio",
      "command": "bash",
      "args": ["-c", "cd /path/to/fetch-data && uv run mcp_server.py"]
    }
  }
}
```

Verify it's loaded:

```bash
claude mcp list
# offernow: bash -c cd /... && uv run mcp_server.py - ✓ Connected
```

## Using It

Restart Claude Code and just say "show me what job data is currently available." Claude will call `list_local_data`, return the local record count and last updated time, then ask if you want to filter. No commands to remember.

## Skills vs. MCP Tools

These two are easy to confuse. A Skill is a Markdown document that Claude reads — it tells Claude "when you encounter X, do Y," but Claude itself is still the executor. An MCP tool is actual code: Claude calls it, and the server runs it with real I/O.

An analogy: a Skill is an SOP document; an MCP tool is a machine.

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [FastMCP (Python MCP SDK)](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code MCP Setup Docs](https://docs.anthropic.com/en/docs/claude-code/tutorials#set-up-model-context-protocol-mcp)
- [uv - Python Package Manager](https://docs.astral.sh/uv/)
- [offernow Project on GitHub](https://github.com/vincentxuu/offernow)
