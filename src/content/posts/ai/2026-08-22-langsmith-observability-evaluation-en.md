---
title: "LangSmith Deep Dive: From Agent Traces to Offline and Online Evaluation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [langsmith, llm-observability, tracing, evaluation, llmops, ai-agent]
lang: en
tldr: "LangSmith structures LLM applications as projects, traces, runs, and threads, then uses datasets, evaluators, and experiments to turn production failures into offline regression tests. It observes any LLM application and does not require LangChain."
description: "A guide to LangSmith's trace model, Python instrumentation, feedback and metadata, offline and online evaluation, data governance, self-hosting architecture, and selection boundaries."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-langsmith-observability-evaluation)

[LangSmith](https://docs.langchain.com/langsmith/observability-concepts) is an LLM application observability and evaluation platform from the LangChain team. It captures more than individual model requests: models, retrieval, tool calls, code steps, and their nested relationships can form one operation, making it particularly useful for debugging RAG and agent workflows.

The name can mislead. LangChain and LangGraph offer automatic tracing, but LangSmith does not require either framework. Python, TypeScript, and other services can submit traces through SDKs, wrappers, OpenTelemetry, or manual instrumentation.

This guide follows one spine: how a production problem becomes a repeatable test. First represent an operation as a trace, add metadata and feedback, turn failures into a dataset, validate fixes with offline experiments, and continue monitoring with online evaluators. That lifecycle is the clearest distinction from proxy-first Helicone and gateway-first LiteLLM or Portkey.

## Projects, traces, runs, and threads answer different questions

The [official observability concepts](https://docs.langchain.com/langsmith/observability-concepts) define a project as a container for traces, a trace as one end-to-end operation, a run as a step within that trace, and a thread as a sequence of interactions. Mixing the layers turns a debugging model into logs that cannot be compared.

```text
Project: support-agent-production
└── Thread: conversation-8f2a
    ├── Trace: user turn 1
    │   ├── Run: classify intent
    │   ├── Run: retrieve documents
    │   ├── Run: call tool
    │   └── Run: generate answer
    └── Trace: user turn 2
```

Name projects by application and environment instead of creating a new one every day. A trace should correspond to one user-visible operation; runs should mark steps worth measuring or evaluating separately. Generate thread IDs on a trusted backend and never substitute an email address or access token.

## Trace boundaries before tracing every line

The LangSmith SDK provides a `traceable` decorator. Start with the outer workflow, then add child runs around retrieval, tools, and model wrappers. Instrumenting every helper on day one usually creates noise and cost.

```python
import os
from langsmith import traceable

os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_PROJECT"] = "support-agent-staging"

@traceable(name="support-agent")
def answer_question(question: str) -> str:
    documents = retrieve(question)
    return generate(question, documents)
```

A useful trace answers what entered, which steps ran, where failure occurred, total latency and model usage, and what came out. Wrapping only the outer function hides bottlenecks; turning every string transformation into a run obscures the tool error that matters.

Background work and streaming also require flush checks. A short-lived process, frozen serverless instance, or full exporter queue can leave an application successful but its trace incomplete. Send a recognizable test request after deployment and verify expected run counts and parent-child structure.

## Metadata, tags, and feedback are query contracts

Without version and product context, traces are only browsable one by one. Attach environment, release SHA, prompt version, model alias, and feature to each deployment. Those fields support before-and-after comparisons and precise dataset creation.

Metadata is not a secret store. Use irreversible tenant identifiers and redact documents and personal data. If prompts and responses cannot leave the environment, disable content capture, sample, or evaluate self-hosting rather than sending everything first and planning deletion later.

Feedback records whether a trace or run met a criterion. Sources include user controls, human review, format validators, and model judges. Do not collapse every meaning into one `score`; use keys such as correctness, tool_selection, and groundedness, and preserve the scoring method and evaluator version.

## Offline evaluation compares versions before release

The offline workflow in [LangSmith Evaluation](https://docs.langchain.com/langsmith/evaluation) consists of datasets, evaluators, and experiments. A dataset stores inputs and optional reference outputs. Evaluators can be code rules, humans, LLM judges, or pairwise comparisons. An experiment runs one application version across the dataset and stores comparable results.

The initial dataset need not be large. The [evaluation concepts guide](https://docs.langchain.com/langsmith/evaluation-concepts) recommends manually curating a small set of examples of “good” behavior for each critical component. Evaluate RAG retrieval relevance separately from answer correctness; evaluate agent tool selection, argument schemas, and final answers independently. Failures then point toward the retriever, prompt, or tool.

```python
from langsmith import Client

client = Client()

def exact_match(run, example):
    expected = example.outputs["answer"].strip()
    actual = run.outputs["answer"].strip()
    return {"key": "exact_match", "score": int(actual == expected)}

client.evaluate(
    answer_question,
    data="support-regression",
    evaluators=[exact_match],
    experiment_prefix="prompt-v12",
)
```

The actionable loop is straightforward: every fixed production bug becomes a dataset example with expected behavior, and the next experiment must pass it. A static benchmark that never absorbs real failures cannot prevent those failures from returning.

## Online evaluation monitors production distributions

Offline examples may have references; production traces usually do not. [Online evaluation](https://docs.langchain.com/langsmith/evaluation) is therefore suited to format checks, safety, latency, tool errors, reference-free heuristics, and sampled LLM judges. It detects patterns and feeds an improvement loop; it does not certify every answer as correct.

Configure filters and sampling. Code rules are stable and inexpensive for schemas, forbidden content, and tool failures. LLM judges add cost, latency, and uncertainty; calibrate them against human labels, then sample or run them asynchronously. Version the evaluator itself so a score movement is not silently caused by a changed judge prompt.

The complete loop is: online evaluator finds a problem, a human confirms it, the trace becomes a dataset example, an offline experiment validates the fix, the application deploys, and online monitoring continues. LangSmith's value comes from operating that chain, not accumulating trace volume.

## Retention, self-hosting, and operational boundaries

Before SaaS rollout, define redaction, sampling, retention, workspace permissions, and deletion. Traces may contain system prompts, retrieved documents, tool arguments, and user input, often making them more sensitive than ordinary application logs. Send synthetic secret data and test search, export, and deletion before production traffic.

[Self-hosted LangSmith](https://docs.langchain.com/langsmith/self-hosted) is an Enterprise add-on. Observability and evaluation include the UI, backends, queue, Playground, PostgreSQL, Redis, ClickHouse, and optional object storage. Docker Compose is positioned for development and testing; production uses Kubernetes and Helm. Enabling deployment adds a control plane, operator, and Agent Server data plane.

Self-hosting changes data location and control, not operational responsibility. Teams own databases, queues, storage, upgrades, backups, capacity, SSO, and monitoring. A standalone Agent Server is a separate lightweight deployment option and should not be confused with the complete self-hosted observability platform.

## Where LangSmith fits—and where it does not

LangSmith fits teams that need complete agent or RAG trajectories, production-to-regression datasets, and both offline comparison and online monitoring. It works across frameworks, while LangChain and LangGraph provide the easiest automatic instrumentation.

It is a weaker fit when the primary requirement is a unified model endpoint, keys, budgets, and fallbacks; those are central to LiteLLM and Portkey. For request cost and latency dashboards alone, Helicone's proxy path is more direct. Without a habit of moving failures into datasets and running experiments before release, LangSmith can become only a polished log viewer.

The core tradeoff is an additional trace and evaluation data model in exchange for a loop from production debugging back to development validation. Trace one representative workflow, build a small set of real regression examples, and run one version comparison before expanding instrumentation across the system.

## References

- [LangSmith Observability Concepts](https://docs.langchain.com/langsmith/observability-concepts)
- [LangSmith Evaluation](https://docs.langchain.com/langsmith/evaluation)
- [LangSmith Evaluation Concepts](https://docs.langchain.com/langsmith/evaluation-concepts)
- [Self-hosted LangSmith](https://docs.langchain.com/langsmith/self-hosted)
- [LangSmith SDK GitHub repository](https://github.com/langchain-ai/langsmith-sdk)
- [Helicone Guide](/posts/ai/2026-08-22-helicone-llm-observability-en)
- [LiteLLM Guide](/posts/ai/2026-08-22-litellm-gateway-en)
- [Portkey Guide](/posts/ai/2026-08-22-portkey-ai-gateway-en)
