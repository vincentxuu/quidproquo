---
title: "Arize Phoenix: Turning Traces into Datasets, Experiments, and Evaluators"
date: 2026-08-22
category: ai
tags: [arize-phoenix, llm-observability, evaluation, opentelemetry, openinference, ai-agent]
lang: en
type: deep-dive
tldr: "Phoenix is an MIT-licensed open-source LLM observability and evaluation platform. It collects traces with OpenTelemetry and OpenInference, turns production failures into versioned datasets, compares prompt, model, or RAG changes in experiments, then writes code, human, and LLM evaluator scores back as annotations. It is not Arize AX, and self-hosting defaults require security work."
description: "A tracing-to-evaluation guide to Arize Phoenix: OpenTelemetry, OpenInference, datasets, experiments, evaluators, RAG and agent evaluation, self-hosted data security, and the boundary with Arize AX."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-arize-phoenix-observability-evaluation)

[Arize Phoenix](https://github.com/Arize-ai/phoenix) matters for more than its trace viewer. It connects four steps that often remain separate: find a production failure in a trace, collect it in a dataset, run an experiment against a candidate version, and use evaluators to decide whether the change actually improved anything.

The open-source project uses the MIT license and had roughly 10,100 GitHub stars when checked on 2026-08-22. When Arize announced its [$70 million Series C](https://arize.com/blog/arize-ai-raises-70m-series-c-to-build-the-gold-standard-for-ai-evaluation-observability/) in 2025, it also reported more than two million monthly Phoenix downloads. Downloads are a company-reported metric, not active deployments, but together with OpenTelemetry compatibility they show that Phoenix has moved beyond notebook demos.

## Separate Phoenix, Phoenix Cloud, and Arize AX

Phoenix is an open-source LLM observability and evaluation server that runs on a laptop, Docker, Kubernetes, or your cloud. Phoenix Cloud is Arize-managed hosting for that product line. **Arize AX** is a commercial enterprise platform, not Phoenix with another logo. The [official FAQ](https://arize.com/docs/phoenix/learn/resources/faqs/what-is-the-difference-between-phoenix-and-arize) lists traditional ML, computer vision, HIPAA support, security reviews, Copilot, and customer success as additional AX capabilities; SaaS, VPC, and Private Connect are AX deployment options.

Phoenix fits a team that owns its traces, datasets, and offline experiments. When requirements include cross-team governance, online-evaluation alerts, enterprise support, and compliance evidence, compare AX instead of assuming a Phoenix Helm chart supplies them. The [Phoenix evaluation documentation](https://arize.com/docs/phoenix/evaluation/evals) explicitly points continuous production evaluation with alerts and threshold triggers to Arize AX Online Evals.

## The core loop: trace → dataset → experiment → evaluator

```text
production / staging app
        │ OpenTelemetry spans + OpenInference semantics
        ▼
      Traces ── find latency, error, retrieval, and tool failures
        │ select successes, failures, and edge cases
        ▼
 Versioned Dataset ── input / expected / metadata
        │ prompt, model, retriever, or agent version
        ▼
    Experiment ── execute a task for every example
        │
        ▼
 Evaluators ── code checks + LLM judges + human labels
        └─────────────── scores and annotations return to traces
```

**Tracing** answers what happened. A trace wraps a request; spans represent model calls, retrieval, tool invocation, or custom steps. Cost, tokens, latency, and input/output can live on spans, but a trace alone does not say whether an answer was good.

**Datasets** turn observations into replayable test assets. A Phoenix example has input, optional reference output, and metadata, while mutations are versioned. Do not import only clean golden examples. Continue adding genuine production failures, negative feedback, wrong tools, and long-tail languages.

**Experiments** invoke a candidate task function for every dataset example and bind output, trace, and evaluator scores into one run. The [official workflow](https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments) recommends inspecting full traces for low-scoring cases, identifying a failure mode, and encoding that problem as an evaluator. Starting with a pile of generic metrics and hoping an average score explains the system reverses the order.

**Evaluators** answer whether an output meets your definition of good. Use code evaluators first for exact match, regex, JSON shape, and tool arguments. Reserve LLM judges for tone, relevance, and faithfulness. High-risk and ambiguous cases still need human labels.

## What OpenTelemetry and OpenInference each contribute

Phoenix accepts standard OTLP traces. OpenTelemetry defines spans, traces, exporters, and transport. [OpenInference](https://github.com/Arize-ai/openinference) adds semantic conventions for LLM applications, identifying LLM, retriever, embedding, and tool spans while putting prompts, models, tokens, and documents in consistent fields.

This separation reduces lock-in. An existing OTel collector can fan out to other backends, and instrumentation is not Phoenix-specific. Teams still have to manage schema versions, sensitive attributes, and sampling; using OTel does not produce automatic portability.

A minimal collector and manual span look like this:

```bash
docker run --rm -p 6006:6006 -p 4317:4317 \
  arizephoenix/phoenix:latest

pip install "arize-phoenix-otel>=0.16.0"
```

```python
from phoenix.otel import register, using_attributes

tracer_provider = register(
    project_name="support-agent",
    endpoint="http://localhost:6006/v1/traces",
)
tracer = tracer_provider.get_tracer(__name__)

with using_attributes(session_id="conversation-42"):
    with tracer.start_as_current_span("agent.run") as span:
        span.set_attribute("input.value", "How do I reset billing access?")
        # call the agent here
```

The [Phoenix OTel SDK](https://arize.com/docs/phoenix/sdk-api-reference/python/arize-phoenix-otel) can also use local gRPC on port `4317`; an HTTP endpoint must include `/v1/traces`. Production applications usually add OpenInference auto-instrumentation for OpenAI, Anthropic, LangChain, LlamaIndex, or an agent framework rather than manually constructing every model and tool span.

## Evaluate RAG and agents in parts

RAG contains at least two independent questions: did the retriever find documents capable of answering the query, and did the generator faithfully use those documents? Phoenix supplies document-relevance, faithfulness, and correctness evaluators. Its [retrieval guide](https://arize.com/docs/phoenix/learn/retrieval-and-infrences/benchmarking-retrieval) also warns that retrieval evaluation says whether context is relevant, not whether the final answer is correct. Where relevance labels exist, deterministic retrieval metrics such as MRR, Precision@K, and NDCG should precede an LLM judge.

An agent should not receive only one “overall success” score. Separate routing/tool selection, argument correctness, execution, response handling, and final task outcome. [Phoenix Evals](https://arize.com/docs/phoenix/api/evaluation-models) includes Tool Selection, Tool Invocation, and Tool Response Handling evaluators. When an expected tool or arguments exist, compare them in code. For irreversible actions, evaluation is retrospective measurement rather than a runtime guard; approval and least privilege remain necessary.

## Limits of LLM-as-a-judge

LLM judges apply fuzzy rubrics such as relevance at scale. They are also sensitive to prompt wording, order, model version, language, answer length, and their own knowledge. Phoenix traces evaluator inputs, judge prompts, scores, explanations, and timing, which makes a judge debuggable. Its explanation is still not ground truth.

Start by comparing the judge against a double-labeled human sample. Pin judge model and prompt versions. Use code whenever a condition is deterministic. Periodically relabel disagreements and high-risk cases. After changing a judge, do not append its result directly to an old trend line; run both versions over the same frozen dataset.

## Self-hosted data security is not complete by default

Traces often contain complete prompts, retrieved documents, user data, tool arguments, and model outputs, making them more sensitive than ordinary application logs. Self-hosting keeps data on your network, but the [authentication documentation](https://arize.com/docs/phoenix/deployment/authentication) is explicit: **authentication is disabled by default**. Production deployments should enable `PHOENIX_ENABLE_AUTH`, keep the JWT secret in a secret store, create system API keys, and expose collectors and UI only over TLS and private networks.

Retention is also infinite by default. The [retention documentation](https://arize.com/docs/phoenix/settings/data-retention) says zero days means indefinite storage. `PHOENIX_DEFAULT_RETENTION_POLICY_DAYS` or project policies can purge traces automatically. Redact PII and secrets before exporting spans: deleting data later cannot retract copies already written to backups, judge providers, or downstream exporters.

## Choosing among evaluation and observability tools

- [Langfuse](https://langfuse.com/) is also open source and self-hostable, spanning traces, prompts, cost, and evaluation. An existing Langfuse team should compare OTel/OpenInference support, dataset experiment UX, and data models before migrating for built-in evaluators alone.
- [Braintrust](https://www.braintrust.dev/) tightly connects experiments, datasets, scorers, and production logs for eval-first teams. Phoenix differentiates through an MIT server and the OTel/OpenInference ecosystem.
- [Promptfoo](https://www.promptfoo.dev/) behaves more like a declarative CI test runner for prompt/model matrices and red teaming. It can coexist with Phoenix: Promptfoo gates pull requests while Phoenix collects runtime traces.
- [Patronus AI](https://www.patronus.ai/) emphasizes enterprise evaluation, judge models, and safety/compliance tests. [Galileo](https://galileo.ai/) offers managed evaluation and observability with proprietary metrics. Teams buying packaged governance and support should compare these with Arize AX, not Phoenix OSS alone.

Implement the same agent or RAG pipeline once on each finalist. Check whether trace hierarchy survives, production failures enter datasets easily, CI can replay experiments, evaluator versions are recorded, and raw data can be exported. Feature lists converge; the real difference is how much of this feedback loop remains manual.

## Conclusion

Phoenix fits teams that want observability to drive improvement rather than stop at a polished dashboard. The correct starting point is not ten LLM judges. First establish trace semantics, sensitive-data handling, and a dataset of genuine failures. Then use experiments to compare changes and add evaluators tied to specific failure modes.

If the requirement is only request logs and token cost, Phoenix may be too heavy. If it includes cross-department governance, live alerting, and compliance commitments, Phoenix OSS may be insufficient and Arize AX is the relevant product. Phoenix is strongest between those extremes: a self-hostable, standards-based LLM engineering workspace that brings production evidence back into development.

## References

- [Arize Phoenix GitHub repository](https://github.com/Arize-ai/phoenix)
- [What is Arize Phoenix?](https://arize.com/docs/phoenix)
- [Difference between Phoenix and Arize AX](https://arize.com/docs/phoenix/learn/resources/faqs/what-is-the-difference-between-phoenix-and-arize)
- [Arize AI Raises $70M Series C](https://arize.com/blog/arize-ai-raises-70m-series-c-to-build-the-gold-standard-for-ai-evaluation-observability/)
- [Phoenix OpenTelemetry SDK](https://arize.com/docs/phoenix/sdk-api-reference/python/arize-phoenix-otel)
- [Run Experiments](https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments)
- [Phoenix Evaluation](https://arize.com/docs/phoenix/evaluation/evals)
- [Phoenix Evals API](https://arize.com/docs/phoenix/api/evaluation-models)
- [Benchmarking Retrieval](https://arize.com/docs/phoenix/learn/retrieval-and-infrences/benchmarking-retrieval)
- [Phoenix Authentication](https://arize.com/docs/phoenix/deployment/authentication)
- [Phoenix Data Retention](https://arize.com/docs/phoenix/settings/data-retention)
