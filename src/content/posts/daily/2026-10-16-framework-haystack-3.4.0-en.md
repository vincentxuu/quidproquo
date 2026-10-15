---
title: "Framework Update: Haystack v3.4.0"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, framework, daily, haystack]
lang: en
description: "Haystack 3.4 adds the experimental ToolResultOffloadCompactor, which offloads old tool-call results to external storage during context compaction instead of dropping or summarizing them; the same release swaps the default embedding model and drops Python 3.10"
tldr: "Haystack v3.4.0, three things worth knowing: (1) new feature — the experimental `ToolResultOffloadCompactor` lets `CompactionHook` write old tool-call results to a `ToolResultStore` and leave only a reference behind; a dedicated read tool can pull the full content back on demand, so nothing is actually lost; (2) breaking — the default embedding model on `OpenAITextEmbedder` and friends changes from `text-embedding-ada-002` to `text-embedding-3-small`; the vectors aren't compatible, so existing corpora need re-indexing or an explicit pin to the old model; (3) breaking — `ChatMessage.from_openai_dict_format` now raises `ValueError` for content parts it can't convert, such as image URL references or `file_id` file references, instead of silently stuffing them into a text string. The same release adds official Python 3.15 support and drops Python 3.10, which reached end of life."
series:
  name: "AI Framework Changelog"
  order: 43
---

> 🌏 [繁體中文版](/posts/daily/2026-10-16-framework-haystack-3.4.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Haystack |
| Version | v3.4.0 |
| Previous | v3.3.0 |
| Released | 2026-10-15 |
| Release Notes | [v3.4.0](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0) |
| GitHub | [deepset-ai/haystack](https://github.com/deepset-ai/haystack) |
| Stars | 26.7k |

## Why This Release Matters

Haystack 3.3 was a maintenance release; 3.4 brings back a real new capability. Long-running agents no longer have to choose between dropping old tool-call results or summarizing them away. `ToolResultOffloadCompactor` writes old results to an external `ToolResultStore` and leaves only a reference in the conversation; when the agent needs the detail back, a tool scoped to the same store reads it in full. Tool results become something you can page back in, not something compaction permanently throws away — useful for agents that run long and need to keep verifiable full output from earlier searches or file reads, like deep-research or code-review agents. The same release also quietly changes two defaults that are easy to miss but reach far: the embedding model switches from `text-embedding-ada-002` to the cheaper, higher-scoring `text-embedding-3-small`, and `ChatMessage.from_openai_dict_format` now raises instead of silently accepting content it can't convert. Both used to work by accident; now they explicitly don't. Teams running Haystack in production should check both before upgrading.

## Key Changes

- **`ToolResultOffloadCompactor` (experimental)**: a new strategy for `CompactionHook` — when compaction triggers, it writes old tool results to a `ToolResultStore` (such as `FileSystemToolResultStore`) and leaves a reference behind; the agent can read the full result back with a tool scoped to that store → new conversations pay nothing extra before compaction kicks in, and only the results that actually get offloaded cost storage, so long-running agents don't have to trade context size against keeping complete tool output
- **Agent tool lifecycle**: `Agent` gains `close()` / `close_async()` to release tool resources, plus `warm_up_async()` for asynchronous preparation; calling `tool.invoke()` / `invoke_async()` directly now triggers warm-up automatically → writing custom tools, or using a lazy toolset like `MCPToolset` that needs a prep step, no longer means managing warm-up order by hand
- **Tool-failure observability**: when an agent's tool call fails, the `haystack.agent.step.tool` tracing span now carries `haystack.tool.error=True` (set even with content tracing disabled) → failed calls are no longer indistinguishable from a tool that just returns `{"error": ...}`, making alerting rules easier to write
- **Python 3.15 support, Python 3.10 dropped**: Haystack now officially supports Python 3.15; since Python 3.10 reaches end of life in October 2026, the minimum supported version is now 3.11
- **Performance**: removing a redundant `Sockets.__getattribute__` override makes accessing socket attributes like `component.__haystack_input__.query` about 14x faster — the override looked up an attribute no instance ever had, so it was raising and catching `AttributeError` on every access without doing anything useful

## Breaking Changes

- Default embedding model on `OpenAITextEmbedder` / `OpenAIDocumentEmbedder` / `AzureOpenAITextEmbedder` / `AzureOpenAIDocumentEmbedder`:
  - `text-embedding-ada-002` → `text-embedding-3-small`
  - The new model costs roughly a fifth as much per token and scores higher on MTEB, but its vectors aren't compatible with the old model's
  - Affected: projects with an existing document store built on the old default need to re-embed their corpus after upgrading, or pass `model="text-embedding-ada-002"` explicitly (`azure_deployment` for the Azure variants) to keep the old behavior
- `ChatMessage.from_openai_dict_format` now validates content parts strictly:
  - Content parts it can't convert — an image referenced by URL (only base64 data URLs are supported), a file referenced by `file_id`, `input_audio` — now raise `ValueError`
  - Previously the whole content-part list was stored as a single text string and sent back unchanged by `to_openai_dict_format`, so forwarding these parts to OpenAI worked by accident
  - Affected: code that forwarded image URLs or file references to OpenAI through this path will now raise; send images by downloading them and building an `ImageContent` yourself, and send files as inline base64 `file_data`
- `FilterPolicy.MERGE` behavior fix:
  - When both the initialization and runtime filters are logical filters sharing an `OR` or `NOT`, their conditions used to be concatenated — effectively a union, so the initialization filter's restriction didn't really hold. They're now combined under `AND`, so both sides actually apply
  - Affected: callers relying on the old, looser merge should build one explicit `OR` filter containing every alternative and pass it with `FilterPolicy.REPLACE`
- Base `Tool.warm_up()` / `Toolset.warm_up()` removed:
  - OpenAI/Azure chat generators no longer warm up tools automatically; using tools through an `Agent` is unaffected
  - Affected: manual tool preparation — especially lazy toolsets like `MCPToolset` — should switch to `warm_up_tools` / `warm_up_tools_async`
- Splitters now agree that `page_number` means the page a chunk's text *starts* on:
  - `RecursiveDocumentSplitter` used to report the ending page; it now matches `DocumentSplitter` / `MarkdownHeaderSplitter`. Corpora with page breaks (`\f`) will get different numbers after re-indexing
  - Affected: anything that displays or stores `page_number` for documents containing page breaks should re-index to pick up the corrected values

## Migration Guide

### Upgrading from 3.3.x to 3.4.0

```bash
pip install --upgrade haystack-ai==3.4.0
```

```python
# Pin the old embedding model if you don't want to invalidate an existing vector store
from haystack.components.embedders import OpenAIDocumentEmbedder

# Old default (pre-3.4.0)
embedder = OpenAIDocumentEmbedder()  # now defaults to text-embedding-3-small

# Keep the old behavior
embedder = OpenAIDocumentEmbedder(model="text-embedding-ada-002")
# To switch to the new model for its lower cost and higher score, re-embed
# the whole corpus and rebuild the index
```

```python
# Code that sent image URLs to OpenAI through ChatMessage needs to build
# the message explicitly now
from haystack.dataclasses import ChatMessage, ImageContent

# Old: an image URL in the content-part list was silently accepted
# (from_openai_dict_format now raises ValueError for this part type)

# New: download the image and build an ImageContent yourself (still base64)
image = ImageContent.from_url("https://example.com/image.png")
message = ChatMessage.from_user(content_parts=["Describe this image", image])
```

If you display or store `page_number` and your corpus has page breaks, re-index to pick up the corrected values. The other bug fixes (`SentenceWindowRetriever` ordering, `FilterError` replacing a raw `TypeError`, and similar) only matter if you depend on the old behavior directly.

## Compared With Other Frameworks

Around the same time, Pydantic AI shipped `PGTaskDurability` in v2.56.0 — durable execution for the whole agent session, built so it can be interrupted and resumed. Haystack's `ToolResultOffloadCompactor` is narrower: it only decides what happens to tool-call results within a single pipeline, not whether the agent's overall execution state survives a restart. Together they point at the same trend: context management is moving from "keep everything or summarize it away" toward "decide, layer by layer, what's worth keeping in full and what just needs to be retrievable on demand" — Pydantic AI does it at the session level, Haystack at the tool-result level.

## Today's Takeaway

I assumed context compaction only had two moves: summarize, which keeps the gist but loses fidelity, or truncate, which just throws data away. `ToolResultOffloadCompactor` is a reminder there's a third option: treat compaction as a paging problem rather than a compression problem. Old content isn't shrunk — it's moved elsewhere in full, with a reference you can swap back in whenever you need it. It's the same idea as virtual memory, just applied to a different layer.

## References

- [Haystack v3.4.0 release notes — GitHub](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0)
- [deepset-ai/haystack — GitHub](https://github.com/deepset-ai/haystack)
- [Haystack v3.3.0 — previous framework update](/posts/daily/2026-10-02-framework-haystack-3.3.0-en)
- [Pydantic AI v2.56.0 — PGTaskDurability comparison](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0-en)
