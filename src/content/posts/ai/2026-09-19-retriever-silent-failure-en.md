---
title: "10% of Conversations Were Making Things Up: Debugging a Silent Retriever Failure"
date: 2026-09-19
category: ai
type: debug
tags: [rag, debugging, error-handling, fault-tolerance, elasticsearch, retrieval, agent-reliability]
lang: en
tldr: "About 10% of conversations on our AI assistant platform randomly lost knowledge base tools — the agent hallucinated answers from training data instead. Root cause: a bare except Exception swallowed Elasticsearch connection failures during retriever initialization, silently skipping tool registration. Fix: retry + surface failures to system prompt + structured metadata tracking."
description: "A complete debugging walkthrough of a silent RAG failure: from users reporting 'sometimes accurate, sometimes nonsense' to finding a bare except Exception that swallowed ES connection errors."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-19-retriever-silent-failure)

## TL;DR

About 10% of conversations on our AI assistant platform randomly lost their knowledge base (KB) tools. The agent didn't error out — it confidently fabricated answers from training data that looked plausible but were completely wrong. Root cause: [Elasticsearch](https://www.elastic.co/elasticsearch) connection failures during retriever initialization were swallowed by `except Exception: pass`, silently skipping tool registration. The symptom was maddening: "sometimes the answers are spot-on, sometimes they're nonsense" — with no pattern.

## The Situation

A customer reported that their AI assistant gave inconsistent answers. Same assistant, same type of question — sometimes it quoted the knowledge base precisely, sometimes it made up information that didn't exist in the KB at all. Asking again would fix it.

Initial suspicion was RAG retrieval quality (bad ranking, misaligned chunks). But when we inspected the "bad" conversations, we found something more fundamental: **those conversations had zero KB-related tool calls**. The agent wasn't "retrieving the wrong thing" — it never attempted retrieval at all.

## The Problem

Comparing the tool lists between normal and broken conversations:

```
Normal conversation tools:
  retrieve_text_nodes, retrieve_faq_nodes, image_search, web_search, ...

Broken conversation tools:
  web_search, ...
  (all KB tools missing)
```

KB tools are dynamically registered at agent startup: the system initializes a retriever for each knowledge base bound to the chatbot, then adds `retrieve_text_nodes` and related tools to the tool list. If initialization fails, the tools simply don't appear — and the agent has no idea it's "supposed to have" them.

## The Investigation

### Layer 1: Which conversations were affected?

We pulled 7 days of conversation metadata and tagged each as "has KB tools" or "missing KB tools." The result wasn't isolated to a specific chatbot or time window — **it was randomly distributed across all chatbots, all time slots, accounting for roughly 10%**.

This ruled out configuration issues (a chatbot missing its KB binding) and deployment issues (broken after a release). Random, low-frequency, cross-chatbot — the classic signature of a **transient failure**.

### Layer 2: What does retriever initialization actually do?

Tracing the code, the initialization flow looked roughly like this:

```python
def _init_retrievers(self, chatbot):
    for kb in chatbot.knowledge_bases.all():
        try:
            retriever = self._create_retriever(kb)
            # Connect to ES, verify index exists, load config
            retriever.validate()
            self.retrievers.append(retriever)
        except Exception:
            # If initialization fails, skip this KB
            pass
```

The moment I saw `except Exception: pass`, the root cause was obvious.

### Layer 3: Why would ES connections fail intermittently?

Under normal conditions, connecting to an ES cluster takes milliseconds. But several scenarios cause brief connection failures:

- **Rolling node restarts** during cluster updates
- **Network blips** (routine in cloud environments)
- **Connection pool exhaustion** during traffic spikes
- **DNS resolution delays**

These are second-scale transient errors — a single retry usually succeeds. But `except Exception: pass` doesn't even retry. It just gives up silently.

## Why This Happened

Three factors compounded into this silent failure:

1. **`except Exception` swallowed everything**: It didn't distinguish between "ES temporarily unreachable" (just retry) and "index doesn't exist" (configuration error). Everything was silently skipped. No log, no metric, no one knew it happened.

2. **The agent didn't know it was missing tools**: The tool list is assembled dynamically. The agent only sees "I have web_search" — it doesn't realize "I'm supposed to also have retrieve_text_nodes." It does its best with what it has, using web search or training data.

3. **Plausible hallucinations are worse than errors**: If the agent said "I can't access the knowledge base," users would retry or report the issue. But when the agent produces a fluent, confident, well-structured answer that happens to be fabricated — users are likely to trust it.

Per the [Elasticsearch documentation on network settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html), transient connection failures are expected behavior in distributed systems, and clients should implement retry mechanisms.

## The Fix

A three-part approach:

### 1. Retry mechanism

```python
def _init_retrievers(self, chatbot):
    for kb in chatbot.knowledge_bases.all():
        retriever = None
        for attempt in range(2):  # Try up to 2 times
            try:
                retriever = self._create_retriever(kb)
                retriever.validate()
                break
            except ConnectionError:
                if attempt == 0:
                    time.sleep(0.5)
                    continue
                raise
        if retriever:
            self.retrievers.append(retriever)
```

One retry with 500ms backoff is enough to ride out most network blips.

### 2. Surface failures to the system prompt

When retry still fails, inject a notice into the agent's system prompt:

```
⚠️ Knowledge base "{kb.name}" is currently unavailable.
If the user's question requires knowledge base lookup, inform them
that the system cannot retrieve relevant data at the moment and
suggest trying again later.
Do not fabricate potentially incorrect answers from training data.
```

The agent goes from "unaware it's missing something" to "explicitly told the KB is down and instructed not to make things up."

### 3. Structured metadata tracking

Record retriever initialization status in conversation metadata:

```json
{
  "retriever_init": {
    "attempted": ["kb-001", "kb-002"],
    "succeeded": ["kb-001"],
    "failed": ["kb-002"],
    "failure_reason": "ConnectionError after 2 attempts"
  }
}
```

This lets monitoring catch "which conversations had degraded KB access" and track failure rate trends with alerts.

## Lessons Learned

**`except Exception: pass` is the most dangerous three-word pattern in production code.**

It's not "fault tolerance" — it's "hiding errors so everyone thinks the system is working fine." In agent systems, this is especially lethal: agents don't complain about missing tools. They improvise with whatever they have, producing "looks correct but is actually hallucinated" content.

If your system has dynamically initialized components (tools, plugins, retrievers), do at least three things:

1. **Distinguish retryable transient errors from unrecoverable configuration errors**
2. **Make the system aware of its own degradation** (notify the agent, notify the user, notify monitoring)
3. **Record initialization failures as structured metadata** — not just a log line that disappears into the void

The cost of silent failure isn't "the system goes down." It's "the system keeps running in a broken state, and nobody knows."

## References

- [Elasticsearch — Network Settings](https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html) — ES connection behavior and expected transient failures
- [Elasticsearch — Retry on Conflict](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html#docs-update-api-query-params) — Official guidance on retry mechanisms
- [Python Exceptions — Best Practices](https://docs.python.org/3/tutorial/errors.html) — Why bare except is discouraged
- [LlamaIndex — Retriever](https://docs.llamaindex.ai/en/stable/module_guides/querying/retriever/) — Retriever initialization reference
