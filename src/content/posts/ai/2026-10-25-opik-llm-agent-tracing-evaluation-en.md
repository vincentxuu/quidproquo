---
title: "How Opik Traces and Evaluates LLM Agents: Traces, Test Suites, Online Scoring, and Self-Hosting Trade-offs"
date: 2026-10-25
category: ai
type: deep-dive
tags: [opik, ai-agent, observability, evaluation, open-source, self-hosting]
lang: en
tldr: "Opik is an Apache-2.0 platform from Comet that puts agent tracing, offline evaluation, prompt versioning, and online scoring in one place. Self-hosting is free but has no user management, production means running ClickHouse on Kubernetes with Helm, and paid cloud plans are priced by span count."
description: "A guide to Opik's trace data model, the two evaluation styles (Test Suites and Datasets), online evaluation rules, the Prompt Library, the LangGraph setup, and the self-hosting and cloud differences and limits to know before adopting it."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-25-opik-llm-agent-tracing-evaluation)

When an agent goes wrong in production, the failure is usually in the middle: a tool call returned nothing, retrieval pulled the wrong passage, a one-word prompt change caused a regression. Whether to add tracing and evaluation depends on whether you can live with only seeing the final answer. This post uses [Opik](https://github.com/comet-ml/opik) to show what a complete setup looks like: what it records, how it scores, how to attach it to LangGraph, and what choosing it costs (license, self-hosting effort, cloud quotas).

## What it is

Opik is an open-source platform built by Comet. The [README positions it](https://github.com/comet-ml/opik) as an LLM observability and evaluation platform covering agent tracing, LLM evaluation, prompt management, and production monitoring. The license is [Apache-2.0](https://github.com/comet-ml/opik/blob/main/LICENSE), and the README states that the server, web app, tracing, datasets, experiments, evaluation, prompt management, and online evaluation all live in the same repository. Comet's [pricing page](https://www.comet.com/site/pricing/) also says the open-source version and the hosted versions share the same codebase.

The data model has [three layers: trace, span, and thread](https://www.comet.com/docs/opik/tracing/concepts). A trace is one complete interaction, a span is a step inside it (an LLM call, a function, an external API) and spans can nest, and a thread groups the traces of one conversation.

## Who it is for and prerequisites

It fits teams that already have an agent or RAG application and want to see what happens at each step. You need Python or TypeScript (the only official SDKs), or the ability to configure an [OpenTelemetry](https://www.comet.com/docs/opik/integrations/opentelemetry) exporter. Self-hosting requires Docker Compose, and production requires Kubernetes and Helm experience.

If you are still doing single-prompt experiments with no multi-step flow, most of it will go unused. The site's [post on agent observability](/posts/ai/2026-06-04-agent-observability-failure-detection-en) covers which failure modes to look for and is worth reading first.

## Content map

| Capability | What it does | Notes |
|---|---|---|
| Tracing | Records traces, spans, threads | Via the [`@track` decorator or framework integrations](https://github.com/comet-ml/opik), or the [OTel HTTP endpoint](https://www.comet.com/docs/opik/integrations/opentelemetry) |
| Offline evaluation | [Test Suites and Datasets + Metrics](https://www.comet.com/docs/opik/evaluation/concepts) | Test Suites use natural-language assertions checked by an LLM judge; Datasets use numeric metrics, and each run becomes an Experiment |
| Online evaluation | [Scores new traces, threads, or spans automatically](https://www.comet.com/docs/opik/production/online-evaluation/rules) | Filters and a sampling rate; the scorer can be an LLM judge, a decision model, or Python code |
| Prompt Library | [Versioned prompts linked to traces](https://www.comet.com/docs/opik/development/prompt-library/getting-started) | `environment="production"` fetches the version deployed to production |
| Coding-agent hookup | [`uvx opik mcp configure`](https://www.comet.com/docs/opik/mcp-server) | Detects clients such as Claude Code and Cursor, then installs the MCP server and Opik skills |

A few details worth knowing up front:

- Test Suite pass logic is [layered](https://www.comet.com/docs/opik/evaluation/concepts): a run passes only if all its assertions pass, an item passes if enough runs pass (`pass_threshold`), and the pass rate is the share of items that pass.
- The online-evaluation LLM judge [works as an agent-as-a-judge by default](https://www.comet.com/docs/opik/production/online-evaluation/rules). It receives the whole trace and, on a model that supports tool calling, can inspect it with `read`, `jq`, and `search`, so it can check tool-call order and return values rather than only the final answer.
- Thread-level scoring waits for [a cooldown period](https://www.comet.com/docs/opik/production/online-evaluation/rules) (15 minutes by default) so the evaluator sees the whole conversation.
- The site's [MCP introduction](/posts/ai/2026-03-22-mcp-model-context-protocol-en) covers the protocol itself; Opik's MCP server lets a coding agent [read traces, find failing cases, and run evaluations](https://www.comet.com/docs/opik/mcp-server).

## A concrete example: LangGraph tracing plus an offline evaluation

The two snippets below are adapted from the official [LangGraph integration](https://www.comet.com/docs/opik/integrations/langgraph) and [Evaluate your agent](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm) docs. I did not run them, so treat the official docs as authoritative.

The first snippet is tracing. Compile the graph as usual, wrap it once with `track_langgraph`, and every later call is logged automatically:

```python
from opik.integrations.langchain import OpikTracer, track_langgraph

# app is a compiled LangGraph graph (the official example is a classification workflow)
opik_tracer = OpikTracer(project_name="classification-workflow")
app = track_langgraph(app, opik_tracer)

result = app.invoke({"question": "Hello, how are you?"})
```

Per the official docs, the UI then shows [the full execution path through the graph, including the classification decision and the branch taken](https://www.comet.com/docs/opik/integrations/langgraph). If a node calls a function decorated with `@track`, it nests under that node's span, and LangGraph's `thread_id` is [used as the Opik thread_id](https://www.comet.com/docs/opik/integrations/langgraph).

The second snippet is an offline evaluation. A dataset holds the test cases, a task returns the agent's output, metrics score it, and the result becomes an Experiment you can compare side by side with other versions:

```python
from opik import Opik
from opik.evaluation import evaluate
from opik.evaluation.metrics import Hallucination

client = Opik()
dataset = client.get_or_create_dataset(name="Example dataset", project_name="my-project")
dataset.insert([
    {"input": "What is the capital of France?"},
    {"input": "What is machine learning?"},
])

def evaluation_task(x):
    # Adapted: the official example calls an LLM function; here it calls the graph above
    return {"output": app.invoke({"question": x["input"]})["response"]}

evaluate(
    dataset=dataset,
    task=evaluation_task,
    scoring_metrics=[Hallucination()],
    experiment_config={"model": "your-model-name"},
)
```

`experiment_config` records which prompt template, model, and parameters a run used; the docs recommend [storing this information](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm) so you can tell what differed when you compare experiments later.

## Self-hosting and cloud

For local trials, use [Docker Compose](https://www.comet.com/docs/opik/self-host/local_deployment): clone the repo, run `./opik.sh`, open `localhost:5173`, and point the SDK at it with `opik configure --use_local`. Data lives in `~/opik`, so stopping and restarting does not lose it. The docs say this setup is not meant for production; for production use the [Helm chart on Kubernetes](https://www.comet.com/docs/opik/self-host/kubernetes).

The backend depends on [MySQL, Redis, ClickHouse, ZooKeeper, and MinIO](https://www.comet.com/docs/opik/self-host/local_deployment). The Helm chart deploys MinIO by default, and there are [settings for switching to S3 or an external ClickHouse](https://www.comet.com/docs/opik/self-host/kubernetes).

Cloud plans are on the [pricing page](https://www.comet.com/site/pricing/) (read on 2026-10-25):

| Plan | Price | Spans included (per month) | Overage and retention |
|---|---|---|---|
| Free | 0 | 25k | 60-day retention |
| Pro | 19 USD / month | 100k | Extra spans cost 5 USD per 100k; extending retention to 400 days costs another 29 USD per 100k spans |

A span is [one tracked operation](https://www.comet.com/site/pricing/), such as an LLM call, a tool call, or a tracked function.

## Trade-offs against similar tools

Opik's selling points are license and self-hosting: the whole platform is Apache-2.0, and self-hosting needs no commercial license. The README has [a comparison table against LangSmith, Phoenix, Langfuse, Braintrust, and others](https://github.com/comet-ml/opik) that labels Phoenix as source-available under the Elastic License 2.0 and Langfuse as an MIT core with commercial enterprise modules. That table is Opik's own summary, so check each vendor's current license page before choosing.

The site has introductions to the alternatives for a side-by-side read: [Langfuse](/posts/ai/2026-03-26-langfuse-llm-observability-guide-en), [Arize Phoenix](/posts/ai/2026-08-22-arize-phoenix-observability-evaluation-en), [LangSmith](/posts/ai/2026-08-22-langsmith-observability-evaluation-en), and [Braintrust](/posts/ai/2026-08-22-braintrust-llm-evaluation-en). If your goal is to put evaluation into a local test loop rather than operate a platform, [Promptfoo](/posts/ai/2026-08-22-promptfoo-llm-evaluation-en) is a different route.

## Limits

**Self-hosted Opik has no user management.** The [self-hosting docs](https://www.comet.com/docs/opik/self-host/overview) say you get all tracing and evaluation features but without user management, and the [pricing page](https://www.comet.com/site/pricing/) lists SSO, service accounts, and view-only users only under Enterprise. Teams that share an instance and need permission tiers should count that cost.

**Production operations are on you.** The Kubernetes docs have several cautions: ClickHouse replication [must be enabled only after Opik is already running](https://www.comet.com/docs/opik/self-host/kubernetes) or it may error. The [SDK version must match the server version](https://www.comet.com/docs/opik/self-host/kubernetes), so upgrade both together. Deleted traces and spans are first masked and only physically removed when ClickHouse merges data parts, with the chart [leaving force-merge off by default](https://www.comet.com/docs/opik/self-host/kubernetes), which you should weigh if you delete a lot of data.

**Some features exist only on the cloud.** In the pricing page's feature table, the Ollie assistant and Opik Connect are empty in the open-source column, and on the cloud Free and Pro plans they are [a trial followed by purchased tokens](https://www.comet.com/site/pricing/). Teams hoping to lean on them for debugging will not find them listed for the self-hosted version.

**Span pricing is amplified by agent loops.** Cloud quotas count spans, and every tool call and LLM call in an agent is a span, so one interaction produces many. Measure a week of real traffic and compute monthly volume before picking a plan.

**OTel accepts HTTP only.** The [docs](https://www.comet.com/docs/opik/integrations/opentelemetry) say the exporter must use HTTP, and gRPC produces errors. Each trace must have one root span with no parent, otherwise the spans are stored but the Traces tab stays empty. If your agent runs in an environment that injects an external trace context (an API gateway, for example), create a new root span at the start of each invocation yourself.

**The scorer itself needs validation.** The built-in Hallucination and Answer relevance metrics are an LLM making a judgment, and online evaluation adds model spend, which is why a [cost limit and sampling rate](https://www.comet.com/docs/opik/production/online-evaluation/rules) exist. Whether the judging standard matches your needs should be checked by sampling against [human annotation queues](https://www.comet.com/docs/opik/evaluation/overview), not treated as ground truth. Also, the Code evaluator type only appears when [Python evaluators are enabled on the deployment](https://www.comet.com/docs/opik/production/online-evaluation/rules), so confirm that setting when self-hosting.

**Docs and APIs change quickly.** The evaluation docs note that [from Opik 2.0, Experiments and Evaluation Suites are project-scoped](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm), so creating a dataset needs a `project_name`. Code written from older tutorials may need adjusting after a version change.

## How to adopt it

1. **Run it locally first.** Start with `./opik.sh`, connect with `opik configure --use_local`, and defer the cloud-versus-self-host decision.
2. **Connect one real agent and look only at traces.** Use a framework integration or `@track`, run a few dozen real tasks, and check that the span granularity is useful to you.
3. **Turn one failure into a Test Suite item.** Follow the [official evaluation loop](https://www.comet.com/docs/opik/evaluation/overview): find the failure in a trace, add it to a Test Suite with a one-sentence assertion, fix the agent, and rerun to confirm the new case passes and nothing else regressed.
4. **Then decide on online scoring.** Start with a low sampling rate and a cost limit, and spot-check whether the scores agree with human judgment.
5. **Decide self-host versus cloud last.** Estimate monthly span volume, whether you need SSO and permission tiers, and whether anyone can operate ClickHouse. If needs are simple, begin on the free cloud plan and revisit self-hosting when data volume or compliance requirements appear.

## References

- [comet-ml/opik (README)](https://github.com/comet-ml/opik)
- [Opik LICENSE (Apache-2.0)](https://github.com/comet-ml/opik/blob/main/LICENSE)
- [Comet pricing page](https://www.comet.com/site/pricing/)
- [Tracing Core Concepts](https://www.comet.com/docs/opik/tracing/concepts)
- [Evaluation Overview](https://www.comet.com/docs/opik/evaluation/overview)
- [Evaluation Concepts](https://www.comet.com/docs/opik/evaluation/concepts)
- [Evaluate your agent](https://www.comet.com/docs/opik/evaluation/advanced/evaluate_your_llm)
- [Online Evaluation rules](https://www.comet.com/docs/opik/production/online-evaluation/rules)
- [Prompt Library: Getting started](https://www.comet.com/docs/opik/development/prompt-library/getting-started)
- [Observability for LangGraph with Opik](https://www.comet.com/docs/opik/integrations/langgraph)
- [OpenTelemetry integration](https://www.comet.com/docs/opik/integrations/opentelemetry)
- [Opik's MCP server](https://www.comet.com/docs/opik/mcp-server)
- [Self-host: Overview](https://www.comet.com/docs/opik/self-host/overview)
- [Self-host: Local deployment](https://www.comet.com/docs/opik/self-host/local_deployment)
- [Self-host: Kubernetes deployment](https://www.comet.com/docs/opik/self-host/kubernetes)
- [Agent observability: from OTel traces to catching hallucinations, tool misuse, and infinite loops](/posts/ai/2026-06-04-agent-observability-failure-detection-en)
- [The complete Langfuse guide](/posts/ai/2026-03-26-langfuse-llm-observability-guide-en)
- [Arize Phoenix](/posts/ai/2026-08-22-arize-phoenix-observability-evaluation-en)
- [LangSmith in depth](/posts/ai/2026-08-22-langsmith-observability-evaluation-en)
- [Braintrust](/posts/ai/2026-08-22-braintrust-llm-evaluation-en)
- [Promptfoo in depth](/posts/ai/2026-08-22-promptfoo-llm-evaluation-en)
- [MCP introduction](/posts/ai/2026-03-22-mcp-model-context-protocol-en)
