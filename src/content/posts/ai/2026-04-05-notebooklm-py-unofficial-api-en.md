---
title: "notebooklm-py: An Unofficial Python API for Google NotebookLM"
date: 2026-04-05
type: guide
category: ai
tags: [notebooklm, google, reverse-engineering, python, rpc]
lang: en
tldr: "notebooklm-py reverse-engineers Google's batchexecute RPC protocol, letting you programmatically control NotebookLM via Python / CLI / AI Agent — including audio, video, slides, quiz generation and more."
description: "A deep dive into notebooklm-py's technical internals: how it reverse-engineers Google's internal RPC protocol, cookie-based authentication, and capabilities beyond the Web UI."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-notebooklm-py-unofficial-api)

notebooklm-py is currently the most complete unofficial Python API for Google NotebookLM. It's not just a simple scraper or Selenium wrapper — it directly reverse-engineers Google's internal RPC protocol, enabling programmatic access to all of NotebookLM's features, including capabilities that the web UI doesn't even expose.

## Core Technology: Google batchexecute RPC

Under the hood, the NotebookLM web app uses Google's internal `batchexecute` RPC protocol. This isn't unique to NotebookLM — Google Photos, Google Translate, and other products all use the same mechanism.

The request structure looks like this:

```
POST /_/LabsTailwindUi/data/batchexecute

f.req = [[[rpc_id, json_params, null, "generic"]]]
```

Key design elements:

- **RPC ID**: Each operation maps to a 6-character identifier (e.g. `wXbhsf`), discovered through reverse engineering
- **Position-sensitive parameters**: The payload isn't key-value pairs but nested JSON arrays where parameter meaning is determined by index position. Missing positions must be filled with `None`
- **Anti-XSSI protection**: Responses are prefixed with `)]}'\n`, which must be stripped before parsing
- **CSRF Token**: Passed as the `at` parameter using the `SNlM0e` value found in the page source

There is no official documentation for this protocol. The developer's approach is to open Chrome DevTools, filter for `batchexecute` requests, perform actions on the web page, then reverse-engineer the RPC IDs and payload structures from the intercepted requests one by one.

## Authentication: Playwright Browser Cookie Extraction

Google doesn't provide an OAuth scope or API key for NotebookLM, so notebooklm-py takes a pragmatic approach: it uses Playwright to open a browser for the user to log in, then captures the session cookies.

```bash
pip install "notebooklm-py[browser]"
playwright install chromium
notebooklm login
```

The flow is: Playwright launches Chromium → the user manually logs into Google → the program captures and stores cookies locally → all subsequent API requests include these cookies to simulate an authenticated session.

This means the authentication lifetime is tied to the Google session cookie's validity period — once it expires, you need to log in again.

## Features: More Than a Web UI Mirror

Beyond replicating every web UI operation (creating notebooks, adding sources, chat Q&A, generating audio overviews, etc.), notebooklm-py also provides capabilities the Web UI can't:

- **Batch downloading** of artifacts (audio, video, slides)
- **Structured export**: Quizzes and flashcards can be exported as JSON / Markdown / HTML, not just viewed in the interface
- **Mind map hierarchical data extraction**: Retrieve structured tree data
- **Editable PPTX downloads**: The web UI only gives you PDFs; here you get PowerPoint files
- **Programmatic permission management**: Batch-configure sharing and access permissions

All content generation goes through a single `CREATE_ARTIFACT` RPC method, using different type codes to distinguish output types (audio, video, slides, quizzes, etc.). Long-running tasks return a task ID, with completion status tracked via polling.

## Three Ways to Use It

**CLI** is ideal for quick operations and scripting:

```bash
notebooklm create "Research Project"
notebooklm source add "https://example.com"
notebooklm generate audio "make it engaging" --wait
notebooklm download audio ./podcast.mp3
```

**Python API** is async-based, suitable for application integration:

```python
async with await NotebookLMClient.from_storage() as client:
    nb = await client.notebooks.create("Research")
    await client.sources.add_url(nb.id, "https://example.com", wait=True)
    result = await client.chat.ask(nb.id, "Summarize this")
```

**AI Agent skill** can be installed into Claude Code, Codex, or OpenClaw:

```bash
notebooklm skill install
```

## Overall Architecture

```
User (Python / CLI / Agent)
        │
  NotebookLMClient (async session)
        │
  RPC Method Layer (RPCMethod enum → 6-char RPC ID)
        │
  HTTP POST → /_/LabsTailwindUi/data/batchexecute
  (cookies + CSRF token + nested JSON payload)
        │
  Google NotebookLM Backend
        │
  Response Parsing (strip anti-XSSI → parse chunked JSON → dataclass)
```

## Overall Assessment

notebooklm-py's core tradeoff is clear: it trades reverse engineering for full programmatic access, at the cost of stability depending on Google not changing its internal protocol.

Good fit for: prototyping, research, batch processing (e.g. generating podcast audio for 20 documents at once), or integrating NotebookLM into AI agent workflows.

Not a good fit for: production environments or services with strict stability requirements. If Google changes a single RPC ID, the entire feature breaks.

Currently at 9.1k stars and 650+ commits, it's the most mature option in this space. If you need programmatic access to NotebookLM, this is essentially your only path.

## References

- [notebooklm-py GitHub Repository](https://github.com/teng-lin/notebooklm-py)
- [notebooklm-py RPC Reference](https://github.com/teng-lin/notebooklm-py/blob/main/docs/rpc-reference.md)
- [notebooklm-py RPC Development Guide](https://github.com/teng-lin/notebooklm-py/blob/main/docs/rpc-development.md)
- [Google NotebookLM](https://notebooklm.google.com/)
