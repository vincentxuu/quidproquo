---
title: "RAG Observability Tool Landscape: Choices in 2026"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, observability, langfuse, phoenix, langsmith, tracing, monitoring]
lang: en
tldr: "Rolling your own traces is good enough, but open-source tools save you a lot of work. Langfuse, Phoenix, and LangSmith each have their niche — the right choice depends on your trade-offs around self-hosting, open source, and integration complexity."
description: "A 2026 comparison of RAG observability tools: Langfuse, Phoenix (Arize), LangSmith, and Helicone — their strengths, weaknesses, and how to choose."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 40
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-observability-tools)

The observability requirements for RAG systems are clear: trace the execution of every query, log LLM inputs and outputs, evaluate answer quality, and identify which step problems concentrate in.

You can build it yourself (the previous post covered pipeline trace design), or use existing tools. The upside of tools is out-of-the-box UI, built-in evaluation features, and team collaboration support; the cost is one more external dependency.

> **This post deliberately has no feature matrix.** This space turns over every quarter. When this post was first drafted, Phoenix's headline feature was UMAP visualization of embeddings — that entire surface has since been removed. Langfuse's JS SDK moved from a bespoke client to an OpenTelemetry foundation, and the old code simply doesn't run. Helicone changed the integration path it recommends. Any feature matrix or pricing tier hardcoded into an article is stale by the time you read it. So what follows is **the dimensions to choose on** plus each tool's trade-offs and traps; for feature lists and pricing, go to the official pages.

## First, Decide What You're Choosing On

Before comparing tools, answer four questions — the answers cut the field in half:

1. **Can the data leave your infrastructure?** If compliance or a customer contract says no, self-hostability is a hard requirement and every pure-SaaS option is out.
2. **How deep are you willing to be locked in?** Instrument with a vendor's own SDK and switching means re-instrumenting; instrument against OpenTelemetry's GenAI semantic conventions and switching is, in principle, an exporter change. Every mainstream platform now ingests OTLP, so this choice is far cheaper than it was two years ago.
3. **Do you need to see "LLM calls" or "the whole RAG pipeline"?** If you only want spend and token counts, a proxy-layer tool is a one-line change. If you want to know why this particular retrieval returned three documents, you have to emit retrieval spans from your own code — there is no shortcut.
4. **Where does evaluation run?** Some teams want online sampling plus LLM-as-Judge scores written back onto traces; others only need offline dataset runs comparing two versions. Maturity on these two differs a lot between tools.

Each tool below is described along those four dimensions.

## Langfuse

**Positioning**: An open-source Observability platform for LLM applications — the most popular self-hosted option. [Acquired by ClickHouse](https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability) in January 2026; the announcement commits to keeping it open source and self-hostable.

**Core features**: trace views, sessions, an evaluation framework (human annotation + LLM-as-Judge), dataset management, and prompt versioning. Details are in the [official docs](https://langfuse.com/docs); what follows is only the part that affects your choice.

**SDK integration**:

> **The JS/TS SDK was replaced wholesale.** The old `new Langfuse({...})` followed by `langfuse.trace()` / `trace.span()` was the v2/v3 API. The current JS/TS SDK is v5 and is built on OpenTelemetry: you instrument with `startObservation` / `startActiveObservation` from `@langfuse/tracing`, and you export via `LangfuseSpanProcessor` from `@langfuse/otel` wired into the OTel SDK. The code in this post's original draft does not run on current versions.

```typescript
// 1. Initialize once per process
import { NodeSDK } from "@opentelemetry/sdk-node";
import { LangfuseSpanProcessor } from "@langfuse/otel";

const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor()],
});
sdk.start();
```

```typescript
// 2. Instrument the RAG pipeline
import {
  startActiveObservation,
  startObservation,
  updateActiveTrace,
} from "@langfuse/tracing";

await startActiveObservation("rag-query", async (root) => {
  root.update({ input: { query } });
  updateActiveTrace({ name: "rag-query", userId });

  const retrieval = startObservation(
    "hybrid-search",
    { input: { filter, topK } },
    { asType: "retriever" },
  );
  const results = await hybridSearch(query, filter, topK);
  retrieval.update({
    output: results,
    metadata: { cragTriggered: false },
  });
  retrieval.end();

  const generation = startObservation(
    "llm-generation",
    { input: messages },
    { asType: "generation" },
  );
  const answer = await generate(messages);
  generation.update({ output: answer });
  generation.end();

  root.update({ output: { answer, sources } });
});
```

`asType: "retriever"` matters: once a retrieval step is typed as a retriever, the UI renders it in a layout built for "query → retrieved documents" rather than as a generic span. Zero-result retrievals and ranking anomalies become visible at a glance.

**Trade-offs**:
- Self-hosting is a first-class path, but **the dependencies go well beyond PostgreSQL**: a current deployment needs at minimum a web container, a worker container, PostgreSQL, Redis/Valkey, ClickHouse, and S3 or S3-compatible blob storage. That is heavier than the "just run docker compose" many people expect — check the [official infrastructure requirements](https://langfuse.com/self-hosting/configuration/scaling) before you commit.
- The license is a hybrid: MIT for the core, with the `ee/` directories under a separate commercial license. If you're self-hosting and care about license scope, read it first.
- SDK and server versions have a compatibility matrix (JS/TS SDK v5 requires a server at or above a certain version), so self-hosters should check before upgrading.
- Prompt version management is still the most complete of this group.

**Best for**: teams that need data to stay on their own infrastructure, value prompt versioning, and are willing to operate a multi-component deployment.

---

## Phoenix (Arize AI)

**Positioning**: Arize's open distribution for AI observability, focused on tracing, evaluation, and datasets/experiments.

> **The reason this post originally recommended it no longer holds.** The draft called UMAP visualization of embeddings Phoenix's unique selling point; that whole surface — model inferences, dimensions, embeddings, the pointcloud UI, and their APIs — was [removed in early 2026](https://github.com/Arize-ai/phoenix/pull/11589), and the UI no longer has `/model`, `/dimensions`, or `/embeddings` routes. If you came for embedding cluster analysis, Phoenix no longer provides it; that capability lives in Arize's commercial product.

> **It is also not Apache 2.0.** `arize-phoenix` is licensed under the **Elastic License 2.0** — source-available, not OSI open source. You can self-host and read the source, but you cannot turn it into a competing hosted service. The original "fully open source (Apache 2.0)" claim was wrong.

**What it is actually good at now**:
- OpenTelemetry-native: instrument via OpenInference conventions, with the smoothest auto-instrumentation for frameworks like LlamaIndex and LangChain
- Built-in RAG evaluators (hallucination, QA correctness, relevance) and an experiment framework, which makes "change one parameter, rerun the dataset, compare scores" a routine action
- Runs entirely locally, so you don't need an account to start

**Trade-offs**:
- Primarily a Python ecosystem; the TypeScript surface is thinner
- Weaker prompt management
- License restrictions as above

**Best for**: Python stacks that want OTel/OpenInference instrumentation and treat evaluation and experiments as the main job.

---

## LangSmith

**Positioning**: LangChain's official observability platform, deeply integrated with LangChain / LangGraph.

> **The docs moved and the environment variables were renamed.** LangSmith docs now live at `docs.langchain.com/langsmith` (the old `docs.smith.langchain.com` redirects). The tracing variables are `LANGSMITH_TRACING` / `LANGSMITH_API_KEY`; the older `LANGCHAIN_TRACING_V2` / `LANGCHAIN_API_KEY` still work, but current docs use the new names throughout.

**Integration**:

```bash
export LANGSMITH_TRACING=true
export LANGSMITH_API_KEY="<your-langsmith-api-key>"
```

On LangChain / LangGraph that's all you need — traces appear with no code changes. Off LangChain it still works, via the `@traceable` decorator and provider wrappers:

```python
from langsmith import traceable
from langsmith.wrappers import wrap_openai
import openai

client = wrap_openai(openai.Client())

@traceable(run_type="retriever", name="hybrid-search")
def retrieve(query: str):
    return hybrid_search(query)

@traceable
def rag_pipeline(query: str):
    context = retrieve(query)
    return client.chat.completions.create(...)
```

(The original `new RetrievalQAChain({...})` example has been dropped: that's an old LangChain JS class, the current guidance is LCEL / `createRetrievalChain`, and copying the old form gets you a missing export.)

**Trade-offs**:
- Lowest setup cost on the LangChain stack; the Playground and annotation queue are genuinely convenient for prompt iteration and human labeling
- Closed source, data on LangChain's servers (self-hosting exists but sits under enterprise contracts)
- Pricing tiers change, so no numbers here — check the [official pricing page](https://www.langchain.com/pricing), and note that billing is typically per trace/span rather than per seat, so a heavy RAG pipeline can emit a dozen-plus spans per query

**Best for**: LangChain-stack teams that need a complete evaluation framework and human labeling workflow.

---

## Helicone

**Positioning**: Observability at the LLM API layer — the lightest option.

> **The integration path changed.** The original draft pointed `baseURL` at `https://oai.helicone.ai/v1` with a `Helicone-Auth` header; the docs now file that under "Legacy Integrations." The current recommendation is the AI Gateway:

```typescript
import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://ai-gateway.helicone.ai",
  apiKey: process.env.HELICONE_API_KEY,
});

const response = await client.chat.completions.create({
  model: "gpt-4o-mini", // change the model string to change provider
  messages: [{ role: "user", content: "…" }],
});
```

**Trade-offs**:
- Lowest integration cost (one baseURL line), and the most detailed cost analysis of this group
- But it cannot see the RAG layer: it knows how many LLM calls you made, not how many documents retrieval returned or what the reranker discarded. **Choosing it means giving up pipeline traces**
- Routing through a gateway hands off the path your LLM traffic takes, adding an availability dependency — the biggest architectural difference from pure-SDK tools

**Best for**: cases where you only need LLM cost and basic usage monitoring and don't need deep RAG traces.

---

## Also on the List

Not covered in depth, but worth evaluating alongside: **Braintrust** (evaluation- and dataset-oriented), **W&B Weave** (integrates with existing W&B experiment tracking), and **[OpenLLMetry](https://github.com/traceloop/openllmetry)** (a set of OpenTelemetry instrumentations rather than a backend — point it at anything that ingests OTLP).

If you haven't decided, instrumenting against OpenTelemetry's [GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) is the least regrettable move: nearly every platform above ingests OTLP, so switching backends lands in configuration rather than a rewrite.

## How to Choose

**Data can't leave your own infrastructure** → Langfuse. Self-hosting is a first-class path and the feature set is the most complete; the cost is someone has to operate that multi-component deployment.

**Python stack, evaluation and experiments are the point** → Phoenix. OTel-native with the smoothest auto-instrumentation for LlamaIndex/LangChain; note the Elastic 2.0 license, and that embedding visualization is gone.

**Using LangChain / LangGraph** → LangSmith. Lowest setup cost, and the annotation queue suits human labeling; closed source and billed per trace, so do the math at volume.

**Only need cost monitoring, don't want to change code** → Helicone. One baseURL line gets you cost reports, at the price of total blindness to the RAG layer.

**Haven't decided** → instrument against OpenTelemetry GenAI semantic conventions now and pick a backend later.

**Roll your own traces** → Best for scenarios with special requirements or where you want full control over trace data structures. The cost is maintaining your own UI and query interface, but you get complete customization.

NobodyClimb's system went with custom traces, mainly because it's deployed on Cloudflare Workers (which can't easily run external SDKs' flush mechanisms), and trace data needs tight integration with business data (climbing routes, user profiles). But if starting from scratch with no platform constraints, Langfuse would be the first option to try.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Langfuse Documentation](https://langfuse.com/docs)
- [Langfuse GitHub Repository](https://github.com/langfuse/langfuse)
- [Langfuse self-hosting infrastructure requirements](https://langfuse.com/self-hosting/configuration/scaling)
- [ClickHouse announces the Langfuse acquisition (Jan 2026)](https://clickhouse.com/blog/clickhouse-acquires-langfuse-open-source-llm-observability)
- [Phoenix (Arize AI) Documentation](https://arize.com/docs/phoenix)
- [Phoenix GitHub Repository](https://github.com/Arize-ai/phoenix)
- [The PR removing inferences / embeddings / pointcloud UI from Phoenix](https://github.com/Arize-ai/phoenix/pull/11589)
- [LangSmith Documentation](https://docs.langchain.com/langsmith/observability)
- [LangSmith Tracing Quickstart](https://docs.langchain.com/langsmith/observability-quickstart)
- [Helicone Quickstart (AI Gateway)](https://docs.helicone.ai/getting-started/quick-start)
- [OpenLLMetry - OpenTelemetry for LLMs (GitHub)](https://github.com/traceloop/openllmetry)
- [OpenTelemetry GenAI Semantic Conventions](https://github.com/open-telemetry/semantic-conventions-genai)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
