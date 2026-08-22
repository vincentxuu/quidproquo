---
title: "Galileo Deep Dive: Experiments, Evaluators, and the Agent Observability Loop"
date: 2026-08-22
category: ai
type: deep-dive
tags: [galileo-ai, llm-evaluation, ai-observability, llm-as-a-judge, experiments, guardrails]
lang: en
tldr: "Galileo connects dataset experiments, LLM/code/Luna evaluators, production traces, and runtime guardrails. It fits enterprises that need observability plus intervention, but the old Protect surface is deprecated and evaluator models do not replace human calibration or application security."
description: "A practical guide to Galileo experiments, metrics, observability, and runtime protection, clarifying the current Evaluate, Observe, and Protect boundaries and comparing adjacent evaluation platforms."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-galileo-llm-evaluation)

[Galileo](https://docs.galileo.ai/what-is-galileo) is the AI evaluation, observability, and production guardrail platform from Galileo Technologies, Inc. It connects a practical workflow: experiment on datasets, score with metrics, find failures in production traces, and promote mature checks into online guardrails.

As of August 2026, the website primarily calls it an AI observability and eval engineering platform or an Agent Reliability platform. The 2024 Evaluate, Observe, and Protect modules still appear in articles and case studies, but current documentation marks the old [Protect page as deprecated](https://docs.galileo.ai/concepts/protect/overview). Its capability continues as runtime protection and guardrails. Buyers should evaluate experiments, metrics, log streams, and runtime rules rather than treat old product names as three separate new services.

The company completed a [$45 million Series B](https://galileo.ai/blog/announcing-our-series-b) in 2024, bringing total funding to $68 million. In the same post, Galileo reported 834% revenue growth, a fourfold increase in enterprise customers, and six new Fortune 50 customers that year. These are vendor-reported growth metrics, not independently audited figures for this article.

## Experiments fix the inputs and comparison conditions

The official [experiments documentation](https://docs.galileo.ai/sdk-api/experiments/experiments) defines an experiment through a dataset, an execution method, and metrics. A dataset may hold input, ground truth, and existing generated output. Execution can use a prompt template, a normal LLM call, or a complete RAG or agent function. Every row becomes a trace in an experiment log stream.

The minimal Python shape is:

```python
from galileo import GalileoMetrics
from galileo.experiments import run_experiment

def answer(row):
    return my_rag_app(row["input"])

results = run_experiment(
    "support-rag-v3",
    dataset=[
        {"input": "What is the return window?", "ground_truth": "30 days after delivery"},
        {"input": "Can custom items be returned?", "ground_truth": "No"},
    ],
    function=answer,
    metrics=[GalileoMetrics.correctness],
    project="support-agent",
)
```

The API's value is not merely batching prompts. It preserves comparable traces, metrics, and system data across versions. A release gate should pin the dataset version, application commit, model, and evaluator configuration, then inspect row-level regressions rather than only average correctness.

## Evaluators: built-in metrics, LLM judges, Luna, and code have different jobs

Galileo usually says **metric** where other platforms say evaluator. The [Metrics Overview](https://docs.galileo.ai/concepts/metrics/overview) lists out-of-the-box metrics, Luna-2, custom LLM-as-a-judge metrics, and custom code metrics; these can target sessions, traces, or spans.

Code metrics fit JSON schemas, required fields, and tool-name allowlists. LLM judges fit semantic criteria such as correctness, tone, and context adherence. Luna-2 is Galileo's small evaluation model for enterprise deployments, intended to support lower-latency online scoring. Their outputs may all be scores, but they are not interchangeable signals.

Platform integration does not remove LLM-judge limitations. Vague rubrics produce unstable judgments. A judge may favor particular styles, languages, or lengths. Incorrect retrieved context can still earn high groundedness. Before deployment, measure false positives and negatives against domain-expert labels, version the judge model and prompt, and treat human disagreements as data for the next metric revision.

## Observability makes scores traceable to execution

Every experiment row is already a trace; production data is likewise organized under projects, log streams, sessions, traces, and spans. A team can drill from a correctness decline into retrieval, model calls, or tool actions, then slice by release, tenant, language, and agent step.

```text
production traces ──→ metrics / evaluators ──→ failure slices
       ↑                                          │
       │                                          ▼
    deploy ←── experiment comparison ←── reviewed dataset
```

Observe is therefore more than prompt storage: it maps an evaluation result back to the execution path. Logging only the final answer hides whether retrieval, reasoning, or tool execution failed. Sending every sensitive context field unchanged creates data risk. Before integration, decide which spans are essential, which fields require redaction, retention duration, and who may inspect production payloads.

## Runtime protection can intervene; it cannot prove safety

The current capability behind the old Protect name appears in the runtime-protection documentation. Metrics inspect inputs or outputs; rules form rulesets; rulesets form stages. A trigger can block, replace output, or hand the request to a person. The documentation says this low-latency path requires enterprise Luna-2 except when using custom code metrics.

That adds synchronous intervention beyond an offline dashboard—and increases blast radius. A loose threshold misses attacks; a strict one blocks valid requests. Teams must also decide whether evaluation-service timeouts fail open or closed for each risk class. A prompt-injection metric is not authentication, and a hallucination score is not a database constraint. Authorization, output schemas, least-privilege tools, PII redaction, and human incident handling remain application responsibilities.

## Data security starts with contracts, not badges

Galileo's [trust and security page](https://galileo.ai/trust-security) lists SOC 2 Type II and says healthcare customers can use HIPAA-compliant infrastructure with a BAA. Those statements do not by themselves answer data residency, subprocessors, retention, model providers, or training use.

The public [Terms of Service](https://galileo.ai/terms-of-service) deserve closer review: they restrict uploading personally identifiable information and include language licensing customer data for improving and internally training algorithms. An enterprise order form, DPA, or custom deployment may set different terms. Security and legal teams should confirm the agreement that actually applies rather than relying on homepage badges. A safe baseline is to redact before export and keep sensitive originals in your evidence store, linked to Galileo by ID.

## Choosing among adjacent tools

| Tool | Public focus | Prefer it when |
|---|---|---|
| [Galileo](https://docs.galileo.ai/what-is-galileo) | Experiments, metrics, traces, runtime guardrails | An enterprise wants offline evaluation to drive production interception |
| [Patronus AI](https://docs.patronus.ai/docs/evaluators/patronus) | Hosted hallucination, safety, and multimodal evaluators | Evaluator models themselves are the main reason to buy |
| [Braintrust](https://www.braintrust.dev/docs/evaluate) | Playgrounds, immutable experiments, CI, online scoring | Prompt and agent release workflow is central |
| [Promptfoo](https://www.promptfoo.dev/docs/red-team/) | Open-source CLI evaluation and red teaming | Local and CI execution plus adversarial generation matter most |
| [Arize Phoenix](https://arize.com/docs/phoenix/) | OpenTelemetry/OpenInference tracing and open-source evals | Self-hosting, open standards, and replaceable judge providers matter |
| [Langfuse](https://langfuse.com/docs/evaluation/core-concepts) | Open-source traces, scores, datasets, experiments | The team already uses Langfuse and wants a production-to-dataset loop |

These products increasingly overlap. Galileo's selection argument is carrying the same metric from experiment to observability and runtime policy—not having more checked boxes. If a team only needs self-hosted tracing, a few deterministic tests, or CLI red teaming, a full enterprise platform may be excessive. When synchronous guardrails and centralized governance are requirements, the integration becomes meaningful.

## Overall

Galileo's complete workflow is a loop: build datasets from human labels and production failures, compare candidates in experiments, locate failures by scoring traces, then promote calibrated, latency-appropriate checks into runtime guardrails. A practical first step is to choose a small set of real cases and one human-decidable rubric, run a baseline, and inspect every score instead of enabling every built-in metric at once.

It is a poor fit when traces cannot leave your environment, no domain expert can calibrate judges, or the need is only simple unit tests. Galileo can shorten the distance from observation to intervention. It cannot define the correct answer for you or assume the application's security boundary.

## References

- [Galileo: What Is Galileo?](https://docs.galileo.ai/what-is-galileo)
- [Galileo: Experiments Basics](https://docs.galileo.ai/sdk-api/experiments/experiments)
- [Galileo: Run Experiments in Code](https://docs.galileo.ai/sdk-api/experiments/running-experiments)
- [Galileo: Metrics Overview](https://docs.galileo.ai/concepts/metrics/overview)
- [Galileo: Protect (deprecated)](https://docs.galileo.ai/concepts/protect/overview)
- [Galileo: Trust and Security](https://galileo.ai/trust-security)
- [Galileo Technologies, Inc.: Terms of Service](https://galileo.ai/terms-of-service)
- [Galileo: Series B announcement](https://galileo.ai/blog/announcing-our-series-b)
- [Patronus AI Evaluators](https://docs.patronus.ai/docs/evaluators/patronus)
- [Braintrust: Evaluate systematically](https://www.braintrust.dev/docs/evaluate)
- [Promptfoo: LLM red teaming](https://www.promptfoo.dev/docs/red-team/)
- [Arize Phoenix documentation](https://arize.com/docs/phoenix/)
- [Langfuse: Evaluation core concepts](https://langfuse.com/docs/evaluation/core-concepts)
