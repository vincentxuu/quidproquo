---
title: "Updates and Deletion: How an AI Knowledge Base Keeps Up When Documents Change or Disappear"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, indexing, freshness, deletion]
lang: en
tldr: "When documents change or are deleted, the index doesn't keep up on its own. A sturdier incremental sync uses a content hash to find which documents changed and redoes only those; deletion has to reach every place a document is stored, including the full-text index and the vector store. Many tools don't handle deletion by default, and deletes and updates can take a while to take effect. Why clean up thoroughly: one preprint put a single outdated document into the context, and two small models flipped three to four in ten medical questions they had answered correctly; when told to answer from the documents, that rose to between two-thirds and three-quarters."
description: "Building Knowledge Bases, order 18: full rebuilds versus incremental sync, detecting changes with hashes, whether metadata-only changes need re-embedding, where deletion must reach, tools that don't detect deletions by default, eventual consistency and sync lag, how outdated documents affect answers, and this site's Ask AI incremental indexing pipeline."
series:
  name: "Building Knowledge Bases"
  order: 18
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-updates-deletion)

In September HR withdrew the old remote-work policy and published a new one. In October a colleague asks the AI, "How many days a week can I work remotely?" The AI answers "three", which was the old rule. The new version says two and is in the knowledge base too; but the old version's chunks are still in the vector store, and nobody cleaned them up.

This is the eighth post in the AI part of "Building Knowledge Bases". [Order 12](/posts/learning/2026-10-22-ai-kb-source-inventory-en) covered collecting only current versions, and [order 15](/posts/learning/2026-10-22-ai-kb-metadata-schema-en) added fields for effective date and status; this post covers how the index keeps up once documents are in and then change or are deleted. Setup steps for specific cloud services are out of scope. By the end you'll be able to design an incremental sync process and list every place deletion has to reach.

## Why old versions must go

Order 12 mentioned that one extra outdated passage in the context noticeably hurts a model. A 2026 preprint by Ahmed and colleagues measured this in more detail ([Ahmed et al. 2026](https://arxiv.org/abs/2609.31342)): they put one outdated document directly into the context, and two open 7B and 8B models flipped 30% and 37% of the medical questions they had answered correctly with no documents at all. With an added instruction to answer from the documents, the share rose to between two-thirds and three-quarters. Software questions were flipped less often.

Another finding is more telling: when the old document was replaced with the new one, the models almost always answered from it. So the problem isn't that models ignore retrieval; it's that the old document is still there and gets retrieved. They also found that when a document stated plainly when it stopped being valid, the larger models almost always recognized it as outdated. This echoes order 15: effective date and status need their own fields.

## Full rebuild or incremental sync

A **full rebuild** re-chunks every document, recomputes every vector and rebuilds the index each time. It's simple and misses nothing, but gets slow and expensive as documents pile up.

An **incremental sync** handles only what changed: add new documents, redo changed ones, remove deleted ones. It's fast, but it has to tell correctly what changed, and it has to remember deletions.

A common way to tell is a **content hash**: compute a hash of the document's content (sometimes plus metadata) and compare it with the last recorded one; if they differ, it changed. LangChain's indexing tool works this way, using the hash as the vector ID too and skipping unchanged content ([LangChain: Indexing API](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/how_to/indexing.ipynb)). Not every tool uses hashes, though: Azure AI Search, reading from Blob storage, relies on file modification times ([Azure: Change and delete detection](https://learn.microsoft.com/en-us/azure/search/search-howto-index-changed-deleted-blobs)); Amazon Bedrock knowledge bases say only that a sync handles added, modified and deleted documents, without saying how they decide ([Amazon Bedrock: Sync your data](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-data-source-sync-ingest.html)).

**Changing only metadata doesn't always require re-embedding.** Recomputing vectors is the most expensive step. Pinecone can update metadata without sending vectors ([Pinecone: Update data](https://docs.pinecone.io/guides/manage-data/update-data)); Bedrock doesn't call the embedding model when only a metadata file changed, the content didn't, the content isn't CSV, and no custom Lambda is used. If your metadata is prepended to chunks for matching (order 15), though, changing it means re-embedding.

**Incremental isn't always better than full.** A 2024 preprint by Xiao and colleagues found that the widely used HNSW vector index, after a few thousand rounds of deleting and re-inserting, left 3% to 4% of points permanently unreachable by search, and tuning query parameters didn't bring them back ([Xiao et al. 2024](https://arxiv.org/abs/2407.07871)). This was measured on a standard image-vector benchmark, not a Q&A system; but it's a reminder that an index maintained only incrementally still needs an occasional full rebuild.

## Deletion is the easiest thing to miss

**Many tools don't handle deletion by default.**

- Azure AI Search's documentation is explicit: changes can be detected automatically, deletions can't; if deletion detection isn't set up before the first run, documents deleted before then stay in the index. When chunking maps one file to many index entries, the mechanism doesn't apply at all, and you have to call delete yourself.
- LangChain's indexing tool has several cleanup modes; the incremental mode used day to day doesn't remove sources that no longer exist, and only full mode does.
- Order 17 mentioned that Microsoft 365 Copilot connectors' incremental crawls don't handle deletions either.

**Deletion has to reach every place a document is stored.** Once a document is in the knowledge base, it usually lives in more than one place: the vector store, the full-text index, a document list, caches, sometimes copies in other languages or with other chunking. Deleting it means clearing every one.

**Deletion doesn't take effect immediately.** Pinecone's documentation says updates and deletes are eventually consistent and take a moment to show up in queries; Bedrock says it takes a few minutes after a sync completes before changes are queryable. The ConfusedPilot study mentioned in order 14 also measured Microsoft 365 Copilot still citing a file for tens of seconds to minutes after it was deleted.

## Sync failures must be visible

Incremental syncs fail: a file won't parse, a batch of vector writes times out, a connector lacks permissions. Order 12 noted that some connectors import nothing and report no error when they lack permissions. So the sync process needs to leave a record: how many documents were processed this time, how many succeeded, how many failed, and which ones. Bedrock's sync jobs report statistics such as the number of failed documents; Google's RAG Engine can write each file's result to a location you choose ([Google Cloud: RAG Engine data ingestion](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)).

At a minimum, monitor three things: how many documents the source has, how many the index has, and when the last successful sync ran. When those don't line up, it's time to look.

## Example: this site's Ask AI incremental indexing

This site's Ask AI feature uses an incremental sync (there's a [full write-up](/posts/ai/2026-08-30-ask-ai-indexing-pipeline-en)). Simplified:

1. **Compute a hash.** Each post's title, category, description, tags and body become one `source_hash`.
2. **Compare the lists.** Compare with the list recorded in the database: add new posts, redo posts whose hash differs, and delete posts in the database that no longer exist in the repo.
3. **A safety check.** If the repo's post list is empty, refuse to sync, so the index can't be wiped in one go.
4. **Deletion clears five places.** When a post is deleted, four tables are cleared (two full-text indexes, the chunk table and the post table), and its vectors are removed from the vector store through a deletion queue.
5. **The vector store catches up asynchronously.** The deletion queue is emptied before new vectors are written, and a chunk is marked updated only after its write succeeds. Failures stay pending and are retried in the next batch.

The pipeline has room to improve too: today, changing only a post's tags or description recomputes all of its vectors, which is costlier than a metadata-only update; and until re-embedding finishes, old and new versions of the same chunk ID briefly coexist.

## Limits of the research

Ahmed and colleagues' paper is a preprint, its figures come from medical questions and two small models with about 50 questions each, and the outdated document was placed directly in the context rather than competing with the new one in retrieval. Xiao and colleagues' paper is also a preprint, using image-vector datasets. The LangChain material is the v0.3 documentation. Sync behavior changes between versions of each tool, and neither Bedrock nor Pinecone publishes specific latency figures.

## What you can do tonight

1. **Check whether your sync handles deletion.** Is it on by default, or does it need extra configuration or a full sync?
2. **List every place a document is stored.** Vector store, full-text index, lists, caches; each must be cleared on deletion.
3. **Run a deletion test.** Delete a test document at the source, run the sync, then ask a question only that document could answer, and see whether the AI still cites it.
4. **Add sync monitoring.** Source count, index count and the time of the last successful sync, somewhere people will see them.

## Self-check

**Q:** A document was deleted at the source but is still in the vector store. What happens?

**How to judge:** The AI keeps finding and citing it, answering with withdrawn content that looks just as trustworthy as the rest. If the new version is also there, both get retrieved and the model may blend them or get it wrong; if only the old one is there, the model confidently gives the outdated answer. So deletion has to reach every place the document is stored, and a test question should confirm it's really gone.

## References

- [Ahmed, Galke Poech & Röttger 2026, Stale-Document Poisoning: When Outdated Retrieval Overrides Correct Model Answers (arXiv)](https://arxiv.org/abs/2609.31342)
- [LangChain v0.3 docs, How to use the LangChain indexing API](https://github.com/langchain-ai/langchain/blob/v0.3/docs/docs/how_to/indexing.ipynb)
- [Azure AI Search, Change and delete detection using indexers for Azure Storage](https://learn.microsoft.com/en-us/azure/search/search-howto-index-changed-deleted-blobs)
- [Amazon Bedrock User Guide, Sync your data with your Amazon Bedrock knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-data-source-sync-ingest.html)
- [Google Cloud, Use data ingestion with RAG Engine](https://docs.cloud.google.com/gemini-enterprise-agent-platform/build/rag-engine/use-data-ingestion)
- [Pinecone, Update data](https://docs.pinecone.io/guides/manage-data/update-data)
- [Pinecone, Delete data](https://docs.pinecone.io/guides/manage-data/delete-data)
- [Xiao, Zhan, Xi, Hou & Liao 2024, Enhancing HNSW Index for Real-Time Updates: Addressing Unreachable Points and Performance Degradation (arXiv)](https://arxiv.org/abs/2407.07871)
- [RoyChowdhury et al. 2024, ConfusedPilot: Confused Deputy Risks in RAG-based LLMs (arXiv)](https://arxiv.org/abs/2408.04870)
- On this site: [How Ask AI Indexes Posts: Chunks, D1 FTS5, and Vectorize](/posts/ai/2026-08-30-ask-ai-indexing-pipeline-en)
