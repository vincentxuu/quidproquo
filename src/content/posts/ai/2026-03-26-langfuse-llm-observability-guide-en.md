---
title: "Langfuse Complete Guide: LLM Application Observability from Scratch"
date: 2026-03-26
type: guide
category: ai
tags: [langfuse, observability, tracing, llm, prompt-management, evaluation, monitoring]
lang: en
tldr: "Langfuse is currently the most mature open-source LLM Observability platform. This post covers four core capabilities — Tracing, Prompt Management, Evaluation, and Datasets — showing you how to use them in real projects."
description: "Complete Langfuse usage guide: from installation and setup to Tracing, Prompt version management, Evaluation framework, and Dataset regression testing, covering TypeScript/Python SDK integration with practical examples."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-26-langfuse-llm-observability-guide)

Once you ship an LLM application, you immediately hit a series of problems: users report that answer quality has degraded, but you don't know whether you broke the prompt or the retrieval is off; token costs are skyrocketing, but you can't tell which feature is burning money; you want to improve answer quality, but there's no systematic way to measure the improvement.

The common root cause of all these problems is: **you can't see what's happening inside your LLM application**.

Langfuse is the tool that solves this.

---

## What Is Langfuse

Langfuse is an **open-source LLM Observability platform** — a monitoring and analytics tool designed specifically for LLM applications. It's not a general-purpose APM (like Datadog or New Relic); instead, it targets the unique needs of LLM applications: tracking prompt inputs and outputs, calculating token costs, managing prompt versions, and evaluating answer quality.

Four core capabilities:

1. **Tracing** — Track the complete execution flow of every LLM call
2. **Prompt Management** — Version-controlled prompt management with A/B testing support
3. **Evaluation** — Automated and manual quality assessment framework
4. **Datasets** — Collect real queries for regression testing

You can use Langfuse Cloud (the free plan is sufficient to get started) or self-host entirely (Docker Compose or Kubernetes).

---

## Installation and Setup

### Cloud Version

The fastest way to get started. Sign up at [cloud.langfuse.com](https://cloud.langfuse.com), create a project, and you'll get two keys:

```bash
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_BASEURL=https://cloud.langfuse.com
```

### Self-Hosted Version

Spin up a complete environment with Docker Compose:

```bash
# Clone the official repo
git clone https://github.com/langfuse/langfuse.git
cd langfuse

# Start (includes PostgreSQL and Langfuse server)
docker compose up -d
```

The full self-hosted architecture includes: Web container (UI/API), Worker container (async event processing), PostgreSQL, ClickHouse (OLAP for trace and score analytics queries), Redis (cache/queue), and S3/Blob Store.

The advantage of self-hosting is that your data stays entirely in your own hands — ideal for teams with compliance requirements (GDPR, data residency). The tradeoff is maintaining this infrastructure. Docker Compose is fine for testing; Kubernetes is recommended for production.

### SDK Installation

```bash
# TypeScript / Node.js (v4 is built on OpenTelemetry)
npm install langfuse @langfuse/openai          # Core + OpenAI wrapper
npm install @langfuse/langchain                # LangChain integration (optional)
npm install @langfuse/vercel                   # Vercel AI SDK integration (optional)

# Python
pip install langfuse
```

> **Note**: The TypeScript SDK v4 was re-architected on top of OpenTelemetry. If you're upgrading from v3, there are some API changes. The examples below primarily use the v3 style (which most projects still use), but v4 syntax is noted where applicable.

---

## Tracing: See What Happens in Every Call

Tracing is Langfuse's most essential capability. Every time a user sends a request, your LLM application may be doing a lot of work behind the scenes: querying a database, calling an embedding API, performing retrieval, and calling the LLM to generate an answer. Tracing records all of these steps so you can inspect them after the fact.

### Core Concepts

A Langfuse trace is composed of three types of elements:

- **Trace**: A complete request (e.g., a single user question)
- **Span**: A step within a trace (e.g., "vector search" or "reranking")
- **Generation**: A single LLM call (automatically records input/output/token usage/latency)

Their relationship forms a tree structure: a Trace contains multiple Spans, and Spans can contain child Spans or Generations.

### TypeScript SDK Example

```typescript
import Langfuse from "langfuse";

const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL,
});

async function handleUserQuery(query: string, userId: string) {
  // Create a trace representing a complete user request
  const trace = langfuse.trace({
    name: "rag-query",
    input: { query },
    userId,
    metadata: { environment: "production" },
  });

  // Record the retrieval step
  const retrievalSpan = trace.span({
    name: "vector-search",
    input: { query, topK: 10 },
  });

  const documents = await vectorSearch(query, 10);

  retrievalSpan.end({
    output: { documentCount: documents.length },
    metadata: { index: "main-knowledge-base" },
  });

  // Record the reranking step
  const rerankSpan = trace.span({
    name: "rerank",
    input: { documentCount: documents.length },
  });

  const reranked = await rerank(query, documents);

  rerankSpan.end({
    output: { topScore: reranked[0]?.score },
  });

  // Record the LLM generation (use generation, not span)
  const generation = trace.generation({
    name: "answer-generation",
    model: "gpt-4o",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildPrompt(query, reranked) },
    ],
  });

  const answer = await callLLM(query, reranked);

  generation.end({
    output: answer,
    usage: {
      input: answer.promptTokens,
      output: answer.completionTokens,
    },
  });

  // Update the trace with the final output
  trace.update({
    output: { answer: answer.text },
  });

  // Ensure data is flushed
  await langfuse.flushAsync();

  return answer.text;
}
```

In the Langfuse Dashboard, you can click on any trace and see the complete call tree: how long each step took, what prompt the LLM received, what it returned, and how many tokens it used.

### Simpler with the OpenAI SDK Wrapper

If your application primarily calls the OpenAI API, Langfuse provides a wrapper that requires almost no code changes:

```typescript
import OpenAI from "openai";
import { observeOpenAI } from "@langfuse/openai";

const openai = observeOpenAI(new OpenAI(), {
  generationName: "chat-completion",
  sessionId: "session-123",
  userId: "user-abc",
  tags: ["production"],
});

// Call as usual — traces are generated automatically
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "What is RAG?" }],
});
```

This is the lowest-effort integration approach. All `chat.completions.create` calls are automatically recorded as generations, with complete input/output and token usage.

### Python Decorator Approach

The Python SDK provides an `@observe` decorator that's particularly elegant:

```python
from langfuse.decorators import observe, langfuse_context

@observe()
def rag_pipeline(query: str):
    documents = retrieve(query)
    answer = generate(query, documents)
    return answer

@observe()
def retrieve(query: str):
    # This function automatically becomes a span in the trace
    results = vector_db.search(query, top_k=10)
    return results

@observe(as_type="generation")
def generate(query: str, documents: list):
    # This function is recorded as a generation
    response = openai.chat.completions.create(
        model="gpt-4o",
        messages=[...],
    )
    # Manually update token usage
    langfuse_context.update_current_observation(
        usage={
            "input": response.usage.prompt_tokens,
            "output": response.usage.completion_tokens,
        }
    )
    return response.choices[0].message.content
```

By adding the `@observe()` decorator, function call relationships are automatically reconstructed as a tree-structured trace — no need to manually manage parent-child span relationships.

---

## Prompt Management: Version-Control Your Prompts

Many teams manage prompts by hardcoding them, so changing a prompt means changing code and redeploying. The problems with this approach:

- Changing a prompt requires the full CI/CD pipeline
- You don't know which prompt version performs best
- You can't quickly rollback to a previous version

Langfuse's Prompt Management decouples prompts from code, managing them in the Dashboard.

### Creating and Using Prompts

Create a prompt in the Langfuse Dashboard, for example named `rag-system-prompt`:

```
You are a technical assistant. Answer the user's question based on the following reference documents.
If the reference documents don't contain relevant information, clearly tell the user you cannot answer.

Reference documents:
{{context}}

User question:
{{query}}
```

Use it in code like this:

```typescript
// Fetch the latest prompt from Langfuse
const prompt = await langfuse.getPrompt("rag-system-prompt");

// Fill in variables
const compiled = prompt.compile({
  context: documents.map((d) => d.content).join("\n\n"),
  query: userQuery,
});

// Call the LLM
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: compiled }],
});
```

### Version Management and Labels

Every time you modify a prompt in the Dashboard, Langfuse automatically creates a new version. You can:

- Use **labels** to tag versions: `production`, `staging`, `latest`
- Specify which label to use in code:

```typescript
// Fetch the version with the production label
const prompt = await langfuse.getPrompt("rag-system-prompt", undefined, {
  label: "production",
});
```

The benefit is that you can modify and test prompts in the Dashboard, and once you've confirmed the results are good, move the `production` label to the new version — no code redeployment needed.

### A/B Testing Prompts

Combined with the Evaluation feature, you can A/B test prompts:

1. Create two versions of a prompt
2. Randomly select different versions in code
3. Use Evaluation to compare answer quality between the two versions

```typescript
// Randomly select a version
const version = Math.random() > 0.5 ? 1 : 2;
const prompt = await langfuse.getPrompt("rag-system-prompt", version);

// Record which version was used in the trace
trace.update({
  metadata: { promptVersion: version },
});
```

In the Dashboard, you can filter traces by prompt version to compare performance across different versions.

---

## Evaluation: Measuring Answer Quality

Knowing what the LLM returned is the first step; knowing whether it answered **well** is what matters. Langfuse offers three evaluation approaches:

### 1. Manual Scoring (Human Annotation)

The most straightforward approach. Browse traces in the Dashboard and score each answer:

- Define scoring dimensions: e.g., `correctness` (0-1), `helpfulness` (0-5), `hallucination` (boolean)
- Team members can divide the labeling work
- Labels are associated with traces for trend analysis

Best suited for early stages or high-risk scenarios (e.g., medical, legal) that require human quality verification.

### 2. User Feedback

Send user feedback (thumbs up/down, ratings) back to Langfuse:

```typescript
// User clicked "helpful"
langfuse.score({
  traceId: currentTraceId,
  name: "user-feedback",
  value: 1,
  comment: "User gave a thumbs up",
});
```

This is the most valuable signal — after all, whether the user thinks it's good is what truly matters.

### 3. LLM-as-Judge Automated Evaluation

Use another LLM to evaluate answer quality, suitable for large-scale automated evaluation:

```typescript
// Set up an Evaluator in the Langfuse Dashboard
// Or manually submit scores via the SDK

async function evaluateWithLLM(
  query: string,
  answer: string,
  context: string,
  traceId: string
) {
  const evalResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an evaluation assistant. Evaluate answer quality based on the following criteria:
1. Correctness (0-1): Is the answer consistent with the reference documents?
2. Completeness (0-1): Does it address all aspects of the question?
3. Hallucination (0 or 1): Does it contain information not found in the reference documents?

Return in JSON format: {"correctness": 0.9, "completeness": 0.8, "hallucination": 0}`,
      },
      {
        role: "user",
        content: `Question: ${query}\nReference documents: ${context}\nAnswer: ${answer}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const scores = JSON.parse(evalResponse.choices[0].message.content);

  // Send scores back to Langfuse
  for (const [name, value] of Object.entries(scores)) {
    langfuse.score({
      traceId,
      name,
      value: value as number,
    });
  }
}
```

Langfuse also has a built-in Evaluator feature that lets you set up evaluation templates in the Dashboard to automatically evaluate new traces — no need to write evaluation logic in your application code.

---

## Datasets: Regression Test Your Pipeline

Every time you change a prompt, swap models, or adjust retrieval parameters, you need to know whether things got better after the change. Langfuse Datasets let you build a standard test set, rerun it after each modification, and compare results.

### Creating a Dataset

You can create one manually from the Dashboard or select from existing traces:

```typescript
// Create a dataset from code
const dataset = await langfuse.createDataset({
  name: "rag-golden-set",
  description: "50 human-verified QA pairs",
});

// Add a dataset item
await langfuse.createDatasetItem({
  datasetName: "rag-golden-set",
  input: { query: "What is a vector database?" },
  expectedOutput: {
    answer: "A vector database is a database specifically designed for storing and retrieving high-dimensional vectors...",
  },
  metadata: { difficulty: "easy", category: "concepts" },
});
```

A more common approach is to add well-performing traces directly to a dataset from the Dashboard — real user questions make for more realistic test sets than manually crafted ones.

### Running Regression Tests

```typescript
const dataset = await langfuse.getDataset("rag-golden-set");

for (const item of dataset.items) {
  // Run your pipeline on each test case
  const trace = langfuse.trace({
    name: "regression-test",
  });

  const result = await ragPipeline(item.input.query);

  trace.update({ output: { answer: result } });

  // Link this run to the dataset item
  await item.link(trace, "experiment-v2-new-prompt");

  // Automated evaluation
  langfuse.score({
    traceId: trace.id,
    name: "exact-match",
    value: result === item.expectedOutput.answer ? 1 : 0,
  });
}

await langfuse.flushAsync();
```

In the Dashboard, you can compare results across different versions by experiment name: which cases improved, which regressed, and what the overall score trends look like.

---

## Sessions: Tracking Multi-Turn Conversations

If your application has multi-turn conversations, you can use sessions to link related traces together:

```typescript
const sessionId = `session-${Date.now()}`;

// First turn
const trace1 = langfuse.trace({
  name: "chat-turn",
  sessionId,
  input: { message: "What is RAG?" },
});

// Second turn (same sessionId)
const trace2 = langfuse.trace({
  name: "chat-turn",
  sessionId,
  input: { message: "How does it differ from fine-tuning?" },
});
```

In the Dashboard, you can browse by session to see the complete multi-turn conversation history and trace details for each turn.

---

## Cost Tracking

Langfuse automatically calculates costs based on the model and token usage recorded in generations. The Dashboard shows:

- **Time-based** cost trends
- **Model-based** cost breakdown (GPT-4o vs Claude vs others)
- **User-based** costs (identify high-usage users)
- **Feature-based** costs (which trace name burns the most money)

No additional configuration needed — as long as generations record the model and token usage, costs are calculated automatically. Langfuse has built-in pricing data for mainstream models (OpenAI, Anthropic, Gemini, etc.). If you're using self-hosted or fine-tuned models, you can customize pricing in the Dashboard.

Supported token types include: `input_tokens`, `output_tokens`, `cached_tokens`, `reasoning_tokens`, `image_tokens`, and more — enabling precise tracking of different consumption types.

---

## Framework Integrations

Langfuse offers more than just low-level SDKs; it has ready-made integrations with major frameworks:

### LangChain

```typescript
import { CallbackHandler } from "@langfuse/langchain";

const langfuseHandler = new CallbackHandler({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASEURL,
});

// Pass the handler to LangChain — all calls are automatically traced
const result = await chain.invoke(
  { query: "What is RAG?" },
  { callbacks: [langfuseHandler] }
);
```

### Vercel AI SDK

Integrates via OpenTelemetry exporter, enabling telemetry in `generateText`, `streamText`, and other functions:

```typescript
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// Enable telemetry — Langfuse receives data via the OTEL exporter
const { text } = await generateText({
  model: openai("gpt-4o"),
  prompt: "What is RAG?",
  experimental_telemetry: {
    isEnabled: true,
    functionId: "rag-answer",
    metadata: {
      sessionId: "session-123",
      userId: "user-abc",
      tags: ["production"],
    },
  },
});
```

Pair this with the `LangfuseExporter` from `@langfuse/vercel` to configure OpenTelemetry, and all Vercel AI SDK calls are automatically sent to Langfuse. Supports all AI SDK providers (OpenAI, Anthropic, Google, Mistral, etc.).

### LlamaIndex

```python
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from langfuse.llama_index import LlamaIndexCallbackHandler

langfuse_handler = LlamaIndexCallbackHandler()
Settings.callback_manager = CallbackManager([langfuse_handler])

# All subsequent LlamaIndex operations are automatically traced
```

---

## Practical Workflow

Putting all the features together, a typical Langfuse workflow looks like this:

**Development Phase**:
1. Add tracing to your code to record every LLM call
2. Inspect traces in the Dashboard to find poor-quality answers
3. Analyze the root cause (bad prompt? Retrieval didn't find the right documents?)
4. Modify the prompt (change it in Prompt Management — no redeployment needed)
5. Add high-quality traces to a Dataset as a test set

**Post-Launch**:
1. Collect user feedback (thumbs up/down) and send it to Langfuse
2. Set up LLM-as-Judge to automatically evaluate new traces
3. Monitor quality trends and costs in the Dashboard
4. When issues arise, use traces to quickly pinpoint the root cause
5. After fixes, run Dataset regression tests to confirm improvements

**Iterative Optimization**:
1. Want to switch models? Run both models against the Dataset and compare scores
2. Want to change the prompt? Create a new version in Prompt Management and A/B test
3. Want to adjust retrieval? Compare trace performance under different parameters

---

## Should You Use Langfuse?

**Good fit**:
- Your LLM application is already live or about to launch
- Your team has multiple collaborators who need a shared observability tool
- You have compliance requirements and data must stay on your own infrastructure (self-hosted)
- You need systematic quality evaluation, not gut feelings

**Not necessary**:
- Personal side project where console.log is enough
- You're just making a single LLM API call with no complex pipeline
- Your deployment environment has limitations that prevent external SDK flush mechanisms (e.g., certain Cloudflare Workers scenarios)

**How it differs from other tools**:
- More open than LangSmith — open-source, self-hostable, not tied to LangChain
- Better TypeScript support than Phoenix
- Deeper trace depth than Helicone — you see not just LLM calls but the entire pipeline

If you're seriously building an LLM application, Langfuse is worth an afternoon to set up. You can only fix problems you can see.

---

## References

- [Langfuse Official Docs](https://langfuse.com/docs)
- [Langfuse GitHub](https://github.com/langfuse/langfuse)
- [Langfuse Cloud](https://cloud.langfuse.com)
- [Langfuse Cookbook (Integration Examples)](https://langfuse.com/guides/cookbook)
- [Langfuse TypeScript SDK](https://www.npmjs.com/package/langfuse)
- [Langfuse Python SDK](https://pypi.org/project/langfuse/)
