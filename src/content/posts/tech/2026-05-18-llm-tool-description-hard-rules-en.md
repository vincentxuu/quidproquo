---
title: "LLM Agent Tool Descriptions Determine Tool Selection: Three Bug Fixes"
date: 2026-05-18
category: tech
type: debug
tags: [ai-agent, rag, llm, prompt-engineering, django, python]
lang: en
tldr: "Rewriting tool descriptions from soft suggestions to hard rules (whitelist + consequence explanation) eliminated the LLM's incorrect tool selection; adding skip_signal=True fixed vector store double-indexing."
description: "Three bugs fixed in an AI agent's attachment tooling: binary format routing rules, STOP THIS TURN instruction, and Django post_save-triggered double indexing."
draft: false
---

🌏 [中文版](/posts/tech/2026-05-18-llm-tool-description-hard-rules)

## TL;DR

Rewriting tool descriptions from soft suggestions to hard rules (whitelist + consequence explanation) eliminated the LLM's incorrect tool selection. Adding `skip_signal=True` fixed vector store double-indexing.

## Context

I was building an AI agent that handles attachments — users can upload PDFs, Excel files, images, plain text, etc., and the agent needs to read or search those files before answering.

The system has two tools:

- `read_attachment_full_text`: reads plain-text attachments inline, no indexing
- `ingest_attachment`: builds the attachment into a knowledge base, going through the RAG pipeline

Which tool to use should be obvious, but the LLM kept picking the wrong one.

## Problems

Three separate bugs, all rooted in the same underlying cause: the tool descriptions weren't giving strong enough information.

**Bug 1: LLM calls `read_attachment_full_text` on PDFs**

The old description looked like this:

```python
READ_ATTACHMENT_DESCRIPTION = (
    'Read the full text of an attachment without indexing. '
    'Use when the file is small/medium and the user wants a summary or full understanding. '
    'Plain-text formats (txt, md, csv, tsv, json, yaml, yml, log) are decoded directly. '
    'Output is truncated at 50,000 characters; if the file is larger or in a binary format, '
    'call ingest_attachment instead. The attachment must belong to the current conversation.'
)
```

"if the file is larger or in a binary format, call ingest_attachment instead" — that's a suggestion, not a rule. After reading this, the LLM would still occasionally pick `read_attachment_full_text` for PDFs, causing the tool to fail.

**Bug 2: LLM keeps calling retrieval tools after ingestion**

The old dispatch return message:

```
Indexing dispatched. The agent will be re-invoked automatically when indexing completes;
do not call retrieval tools in this turn — finish the current response and stop.
```

The LLM would sometimes still call `retrieve_text_nodes` in the same turn. Since the index wasn't ready yet, it returned empty results, and the agent responded with "no relevant content found."

**Bug 3: Duplicate chunks in vector store**

Nodes returned by `retrieve_text_nodes` contained duplicates — the same passage appeared twice, causing the agent's responses to include repeated content.

## Fixes

**Bug 1: Explicitly list both the whitelist and the reject list**

```python
READ_ATTACHMENT_DESCRIPTION = (
    'Read the full text of a plain-text attachment inline — no indexing. '
    'ONLY supports: txt, md, csv, tsv, json, yaml, yml, log. '
    'PDF, doc, docx, pptx, xlsx, html, images, and all other binary or non-plain-text formats '
    'are REJECTED by this tool; call ingest_attachment for those. '
    'Use when the file is small/medium and the user wants a summary or full understanding. '
    'Output is truncated at 50,000 characters. '
    'The attachment must belong to the current conversation.'
)
```

`INGEST_ATTACHMENT_DESCRIPTION` was also updated to open with "REQUIRED for binary or non-plain-text formats" — establishing the rule before the tool is even selected.

**Bug 2: Replace with a STOP command + consequence explanation**

```python
INGEST_DISPATCH_NEXT = (
    'STOP THIS TURN: Indexing has been dispatched. '
    'The index is not yet ready — any retrieval call (query_files / grep_files / retrieve_text_nodes) '
    'will return empty results. '
    'Finish your current response and stop. '
    'The agent will be automatically re-invoked when indexing completes.'
)
```

Three changes:
1. `STOP THIS TURN` goes first — the imperative is immediate and unambiguous
2. Consequence explained: "will return empty results" gives the LLM a self-interested reason not to call those tools
3. `ingest_attachment`'s own description now also includes "MUST end this turn immediately" — warning the model before the tool is called, not just in the return value

**Bug 3: Add `skip_signal=True` to prevent double indexing**

Root cause: `IngestAttachmentTool` was calling `AttachmentService.create_knowledge_base_files_from_attachments()` without `skip_signal=True`.

```python
kb_files = AttachmentService(
    message_instance=None,
    attachments_data=None,
    skip_signal=True,          # added this
).create_knowledge_base_files_from_attachments(
    attachment_instances=[attachment],
    conversation_instance=attachment.conversation,
)
```

Without `skip_signal`, the `post_save` signal on `ChatbotFile` was firing an async Celery task to index the file, while `_ingest_sync` was simultaneously calling `process_knowledge_base_file_tasks(sync=True)` for synchronous indexing — the same file got indexed twice, leaving duplicate chunks in the vector store.

## Why This Happened

Bugs 1 and 2 share the same root cause: **LLMs treat "suggestions" as optional; only "rules" are enforced.**

The old phrasing used:
- "if the file is larger or in a binary format, call X instead" → a conditional statement the LLM evaluates itself
- "do not call retrieval tools in this turn" → an imperative, but with no reason given

The new phrasing uses:
- "are REJECTED by this tool" → a direct negation with no room for conditional judgment
- "will return empty results" → a consequence that gives the LLM a self-interested reason to comply

Another effective pattern: **description pre-warning + return value reinforcement**. State in the tool description that "you must end this turn after calling this tool," then repeat it in the return value. The same instruction appearing twice reduces the chance of deviation.

Bug 3 was a Django signal side-effect issue: when KB files are created dynamically at runtime, the existing signal-based indexing path and the runtime synchronous indexing path are unaware of each other and both execute. The fix is to bypass the signal in the runtime path.

## Key Takeaway

Write tool descriptions for LLMs like contracts, not READMEs. "REJECTED" outperforms "not supported." Explaining consequences outperforms issuing commands alone.

## References

- [Anthropic — Tool use overview](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview)
- [LlamaIndex — Knowledge Base indexing](https://docs.llamaindex.ai/en/stable/understanding/indexing/indexing/)
- [Django — Signals](https://docs.djangoproject.com/en/5.2/topics/signals/)
