---
title: "Tool Pick | read4all — Letting an Agent Read PDFs, Office Files, and Screenshots as Markdown"
date: 2026-09-01
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that converts PDFs, Office files, images, and web documents into Markdown, preferring a MinerU cloud engine and falling back to fast local libraries when no key is set"
tldr: "read4all is an MCP server that converts PDFs, Office files, images, and web documents into Markdown plus images, preferring MinerU's cloud engine and falling back to local libraries when no API key is set. Install: uvx read4all. It solves the problem that an agent reading an attachment either loses all layout structure or needs a hand-built conversion pipeline."
series:
  name: "AI Tool of the Day"
  order: 17
---

> 🌏 [中文版](/posts/daily/2026-09-01-tool-read4all)

## Tool Info

| Field | Value |
|---|---|
| Name | read4all |
| Type | MCP server (multi-format attachment → Markdown conversion) |
| GitHub | [int2t05/read4all](https://github.com/int2t05/read4all) |
| Stars | 1 |
| Language | Python |
| License | MIT |
| Install | `uvx read4all` |

## What Problem It Solves

Have you ever had an agent read a PDF report or an internal Office document a user handed it, only to get tables collapsed into misaligned blank space, formulas that vanish entirely, or a chart in a screenshot the agent simply can't interpret? Plain-text extraction tools only care about pulling characters out — layout structure, table boundaries, and image positions all get thrown away. Keeping that information usually means hand-building a pipeline: detect the format, call the right library, handle images, stitch it back into Markdown — one more block of glue code for every format you add.

read4all packages that pipeline into a single MCP tool. `convert_to_markdown` takes an attachment path and prefers MinerU's cloud engine for high-precision formula, table, and layout reconstruction. When `MINERU_API_KEY` isn't set, or the cloud call times out, hits a rate limit, or the file exceeds 200MB / 200 pages, it falls back to a local library chain (pymupdf + pypdf + pdfplumber for PDFs, MarkItDown for Office and web formats). The fallback isn't a stripped-down version — the local path still folds in "deep extraction" capabilities like best-effort table selection, chart geometry annotation, and embedded image extraction; it's just lower-precision than the cloud engine. Output always lands in a sibling `<stem>/` directory next to the attachment, and repeat conversions of the same file hit a content-hash cache for a near-instant return.

Good fit for: agents that need to read user-uploaded PDF reports, internal Office documents, or screenshots with tables and charts for summarization or RAG; also useful for text-only models that need `describe_images=True` to get a text description of an image, letting a model that "can't see" indirectly understand a screenshot's content.

## Quick Start

### Install

```bash
# Install uv first if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh

# uvx pulls and runs read4all straight from PyPI — no pre-install needed
```

`.mcp.json`:

```json
{
  "mcpServers": {
    "read4all": {
      "command": "uvx",
      "args": ["read4all"]
    }
  }
}
```

Restart Claude Code, then just tell the agent "convert this PDF to Markdown" to trigger `convert_to_markdown`.

### Basic Usage

The agent gets two tools:

- `get_capabilities` — query supported formats, engines, and whether MinerU is available
- `convert_to_markdown` — the single conversion entry point, returning `{md_path, images_dir, image_count, engine_used, fallback_reason, preview}` (`preview` is the first 2000 characters, usable directly; the agent reads `md_path` for the full content)

```
You: Convert report.pdf to Markdown
Agent: → convert_to_markdown("report.pdf")
      ← engine_used: "pymupdf" (no MinerU key, local fallback)
      ← report/report.md + report/images/img1.png ...
```

### Advanced Usage

Set a MinerU key to get the cloud engine's high-precision formula, table, and layout reconstruction:

```bash
export MINERU_API_KEY="your_token"   # get one at https://mineru.net/apiManage
```

Add a VLM endpoint to let a text-only model "understand" ordinary photos too (not just document-style screenshots):

```bash
export READ4ALL_VLM_BASE_URL="https://api.openai.com/v1"
export READ4ALL_VLM_API_KEY="..."
export READ4ALL_VLM_MODEL="gpt-4o-mini"
```

Without a VLM configured, MinerU's OCR text for document-style images (screenshots, scans) still populates `description`; configuring one extends that to general photos and charts.

## Comparison with Existing Tools

| | read4all | Hand-rolled pymupdf/pdfplumber script | MarkItDown (standalone) | Cloud OCR SaaS (e.g. Textract) |
|---|---|---|---|---|
| Native MCP, agent calls directly | ✅ | ❌ | ❌ | Needs wrapping |
| Works without a key (local fallback) | ✅ | ✅ (but you write it) | ✅ | ❌ |
| High-precision formula/table/layout (with key) | ✅ (MinerU) | ❌ | ❌ | Partial |
| Content-hash caching, instant repeats | ✅ | Build it yourself | ❌ | Vendor-dependent |
| Single entry point for all formats (PDF/Office/image/web) | ✅ | Needs integration | ✅ (no deep extraction) | Vendor-dependent |

## Things to Watch

- **Read-only**: no PDF generation, merging, splitting, or form-filling — this is a one-way attachment-to-Markdown converter.
- **The local fallback has a ceiling**: local libraries don't reconstruct vector-path formulas and don't do local OCR — both require MinerU. Without a key, quality drops noticeably on scanned documents or complex formulas.
- **Very new project**: PyPI's first release, `0.1.0`, went out today (2026-08-31); the GitHub repo was created the same day and currently has just 1 star. It hasn't seen much community validation yet, so run your own test pass before adopting it in production. Always pass the MinerU key via an environment variable — never commit it into `.mcp.json`.

## Today's Takeaway

Most "fallback" designs cut functionality down to a bare minimum. read4all's fallback chain instead folds deep extraction capabilities — best-effort table selection, chart geometry annotation — into the local path too, so "no cloud key" doesn't mean "plain text only." That's different from a two-tier design where the cloud path is the real product and the local path is an afterthought — here the fallback chain itself is treated as a product surface worth optimizing, not just a backup of a backup.

## References

- [int2t05/read4all GitHub repo](https://github.com/int2t05/read4all): README, tool table, fallback chain, and output contract are all from the official repo.
- [int2t05/read4all repo metadata](https://api.github.com/repos/int2t05/read4all): MIT license, Python, created 2026-08-31, confirmed via GitHub API.
- [read4all on PyPI](https://pypi.org/project/read4all/): version 0.1.0, published 2026-08-31, confirms the `uvx read4all` install path works.
