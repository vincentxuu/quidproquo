---
title: "MCP Tool Returns 1M Characters: The Token Explosion in search_local_jobs"
date: 2026-03-20
type: debug
category: tech
tags: [mcp, python, claude-code, debug]
lang: en
tldr: "The MCP tool was returning a description field that caused 1,033 job listings to exceed the token limit. The fix: exclude description by default and add pagination."
description: "A debugging story about an MCP search tool blowing past the token limit, and how Claude stumbled through three consecutive format misassumptions before finally getting the right answer."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-20-mcp-tool-token-overflow-search-jobs)

## TL;DR

`search_local_jobs("AI")` returned 1,033 job listings. With the `description` field included, the total came to 1,082,675 characters — exceeding the MCP token limit. The output was saved to a file, and Claude then failed to parse it correctly three times in a row due to wrong format assumptions, finally getting the right answer on the fifth attempt. The real fix: exclude `description` by default and return a summary field with pagination instead.

## Context

`offernow` is a local job search tool that lets Claude query a local JSON dataset via an MCP server. One day I asked it "how many AI jobs are there?" — and things started going sideways.

## The Problem

```
Error: result (1,082,675 characters) exceeds maximum allowed tokens.
Output has been saved to /Users/.../.claude/tool-results/mcp-offernow-search_local_jobs-xxx.txt
```

The result was saved to a file, and Claude had to read it manually. The file format was the MCP tool-result format: an array of 1,033 `{type, text}` objects, where each `text` was a JSON string representing one job.

## The Debugging Attempts

**Attempt 1**: Assumed `text` was a jobs array, and tried to iterate over the first item:

```python
jobs = json.loads(item['text'])  # got a single job (dict with 21 fields)
for job in jobs:                 # iterating a dict = iterating over keys
    src = job.get('source')      # AttributeError: 'str' has no .get()
```

Printed `Total AI jobs found: 21` before crashing — 21 was the number of fields in a single job, not the number of listings.

**Attempt 2**: Tried to print the first item, but got the syntax wrong:

```python
json.dumps[jobs[0], ensure_ascii=False](:200)  # SyntaxError
```

**Attempt 3**: Used `list(jobs.keys())[:3]` to inspect the structure, got `['job_id', 'job_name', 'company']` — still looking at a single job's fields, mistaking them for a clue about the data structure. Still wrong.

**Attempt 4**: Finally noticed that the entire `data` was 1,033 items, and each item's `text` was an independent job JSON string.

**Attempt 5**: The correct solution:

```python
for item in data:
    if item.get('type') == 'text':
        job = json.loads(item['text'])
        src = job.get('_source', 'unknown')
        sources[src] = sources.get(src, 0) + 1
```

Result: 647 from 104, 386 from LinkedIn, 1,033 total.

## The Fix

The root cause was that `search_local_jobs` was returning the `description` field verbatim. That field alone accounts for the bulk of the data size — returning 1,033 of them at once caused the overflow.

Updated tool:

```python
@mcp.tool()
def search_local_jobs(
    keyword: str,
    source: str = "all",
    limit: int = 50,
    offset: int = 0,
    include_description: bool = False,
) -> dict:
    EXCLUDE_FIELDS = {"description", "address"}
    # ... search logic unchanged ...

    page = matched[offset: offset + limit] if limit > 0 else matched[offset:]

    if not include_description:
        page = [{k: v for k, v in job.items() if k not in EXCLUDE_FIELDS} for job in page]

    return {
        "total": total,
        "by_source": by_source,
        "offset": offset,
        "limit": limit,
        "count": len(page),
        "results": page,
    }
```

Now "how many AI jobs are there?" pulls the answer directly from `total` and `by_source` — no workarounds needed.

## Why This Happened

Two problems compounded each other:

1. **Tool design**: The search tool was returning full job objects, including `description` fields that can run thousands of characters long. A search result has no business including the full job description.
2. **Misread format**: When MCP exceeds the token limit, it stores each content item separately as an array. Claude encountered this format for the first time and assumed three times in a row that "text is a jobs array" rather than "each item is one job."

## What I Learned

Search APIs should return summary fields only. Leave `description` for the detail endpoint.

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [FastMCP (Python MCP SDK)](https://github.com/modelcontextprotocol/python-sdk)
- [Claude Code MCP Setup Docs](https://docs.anthropic.com/en/docs/claude-code/tutorials#set-up-model-context-protocol-mcp)
