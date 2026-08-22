---
title: "Braintrust: Closing the LLM Evaluation Loop from Datasets Back to Production"
date: 2026-08-22
category: ai
type: deep-dive
tags: [braintrust, llm-evaluation, observability, tracing, llm-as-judge, ai-agent]
lang: en
tldr: "Braintrust connects versioned datasets, immutable experiments, scorers, and production traces into one evaluation loop. Its value is not another score but the ability to turn production failures into offline tests. The company announced an $80 million Series B in February 2026; its customer list is company-reported."
description: "A component-by-component guide to Braintrust datasets, experiments, scorers, traces, and the production feedback loop, including the open-source versus hosted boundary, privacy and LLM-as-a-judge limits, and alternatives such as Patronus, Promptfoo, Phoenix, Galileo, and Langfuse."
draft: false
---

🌏 [中文版](/posts/ai/2026-08-22-braintrust-llm-evaluation)

[Braintrust](https://www.braintrust.dev/docs/evaluate) is an LLM evaluation and observability platform. It does more than answer, “What was this prompt version's average score?” It productizes a workflow that is difficult to maintain: find failures in production traces, put them into a versioned dataset, run an immutable experiment, compare candidates with scorers, and deploy the better candidate back to production for continued observation.

As of August 2026, Braintrust's [official Series B announcement](https://www.braintrust.dev/blog/announcing-series-b) names Notion, Replit, Cloudflare, Ramp, and Dropbox as customers and announces an $80 million round led by ICONIQ. These are company-reported customer relationships and funding; no public usage data establishes the depth of each deployment. The more useful selection question is whether your team will connect the following four stages into a real loop.

## 1. Datasets decide which failures must be rerun forever

A Braintrust dataset is a versioned test-case collection. Every row has an `input` and may include `expected` and `metadata`. Cases can come from manual curation, user feedback, file imports, or production traces. The [dataset documentation](https://www.braintrust.dev/docs/annotate/datasets) records each change, allowing an experiment to pin a specific data version instead of comparing candidates against moving test sets.

Uploading a CSV is not the hard part; choosing the distribution is. A set containing only ideal “golden answers” produces attractive scores that miss real failures. Dumping every complaint into one set lets frequent traffic overwhelm rare, costly incidents. A useful split is normal critical paths, known regressions, and low-frequency high-impact cases. After every production incident, add at least one reproducible row with its origin and inclusion reason.

An expected output need not be one canonical string. A support response can specify required facts, an agent case can specify allowed tool sequences, and a RAG case can place evidence in metadata. Shape the dataset around the decision criterion instead of forcing the task into exact match.

## 2. Experiments preserve immutable evidence for each change

An experiment is an immutable snapshot of a task run over a dataset version. Braintrust's [experiment documentation](https://www.braintrust.dev/docs/evaluate/run-evaluations) deliberately distinguishes it from a playground: rerunning a playground overwrites results, while an experiment retains per-row outputs, scores, traces, and execution parameters for baselines and CI.

A minimal Python evaluation does not require building a dashboard first:

```bash
pip install braintrust autoevals
```

```python
from autoevals import LevenshteinScorer
from braintrust import Eval

Eval(
    "greeting-bot",
    data=lambda: [
        {"input": "Ada", "expected": "Hello Ada"},
        {"input": "Lin", "expected": "Hello Lin"},
    ],
    task=lambda name: f"Hello {name}",
    scores=[LevenshteinScorer],
)
```

```bash
BRAINTRUST_API_KEY=... braintrust eval greeting_eval.py
```

`data` defines what to test, `task` is the system under test, and `scores` defines judgment. The CLI returns a non-zero exit code for evaluation exceptions, but your team must still decide what regression threshold blocks a pull request. For nondeterministic systems, [Braintrust supports `trial_count`](https://www.braintrust.dev/docs/evaluate/run-evaluations) to repeat a row. Otherwise, one sample's randomness is easy to misread as a version effect.

## 3. Scorers: use code first and models only for semantic judgment

A [Braintrust scorer](https://www.braintrust.dev/docs/evaluate/write-scorers) returns a value from zero to one and can be an AutoEval, an LLM-as-a-judge, or custom code. JSON parseability, valid tool names, and exact monetary values should be deterministic checks. Tone, completeness, and whether a response answered the question are better judge-model tasks. For multi-step agents, trace scorers can inspect the path rather than only the final sentence.

The largest LLM-as-a-judge risk is not cost; it is treating the ruler as truth. Judges are sensitive to rubrics, ordering, verbosity, model changes, and prompt injection. Production traffic usually lacks ground truth as well. Braintrust's [agent evaluation guide](https://www.braintrust.dev/docs/best-practices/agents) recommends stubbing external dependencies and isolating critical actions offline, then combining online judges with user feedback and adaptive sampling.

Start with a human-labeled calibration set and measure judge agreement. Retain human review for high-risk categories. When changing the judge model or rubric, recalibrate the scorer like a versioned product. A dashboard value of 0.91 does not make the second decimal place objective quality.

## 4. Traces and production close the loop

Offline experiments cover only known cases. Braintrust production observability represents one request as a trace containing `task`, `llm`, `function`, `tool`, and `score` spans. The [trace documentation](https://www.braintrust.dev/docs/observe/examine-traces) shows messages, parameters, tokens, cost, and latency on LLM spans. Online scoring runs asynchronously without adding request latency. It is useful for drift and unknown failure clusters, but it is not a synchronous runtime guardrail.

The final step converts selected production traces back into datasets. Do not ingest every log. Filter with user feedback, low scores, exceptions, abnormal cost, or specific tool paths, then have a person confirm the input, expected behavior, and necessary metadata. The next experiment can then prove whether a candidate fixes real failures rather than merely improving a static benchmark.

```text
production traces ── filter / human label ──> versioned dataset
       ▲                                          │
       │                                          ▼
 deploy candidate <── compare / gate ── immutable experiment
                                                    │
                                                    ▼
                                      code / judge / human scorers
```

## 5. The boundary between open-source evals and the hosted platform

Braintrust's [Python SDK](https://github.com/braintrustdata/braintrust-sdk-python) is Apache-2.0 licensed, and AutoEvals can be called independently without storing results in Braintrust. `Eval(..., no_send_logs=True)` and the CLI's `--no-send-logs` keep a run local. Writing a scorer and executing test cases therefore do not require platform lock-in.

The platform supplies dataset versioning, immutable experiments, collaborative comparison UI, production traces, online scoring, and trace-to-dataset workflows. If CI only needs a pass/fail table, the platform may be excessive. If product managers, domain experts, and engineers must annotate, compare, and investigate production failures together, centralized lineage becomes valuable.

Braintrust is also not a fully downloadable open-source product in the usual sense. Its [self-hosting architecture](https://www.braintrust.dev/docs/admin/self-hosting/architecture) is a hybrid deployment: sensitive experiment logs, traces, datasets, and prompt completions live in the customer's data plane, while UI, authentication, and platform metadata remain in Braintrust's control plane. This gives more data-location control than full SaaS but is not an air-gapped OSS alternative.

## 6. Privacy and custom-code security boundaries

Traces readily capture prompts, responses, retrieved passages, tool arguments, and user identifiers. Decide which fields may leave the application before choosing sampling, masking, and retention. Do not wait until ingestion to invent policy. Braintrust's [security documentation](https://www.braintrust.dev/docs/security) says a self-hosted data plane can retain sensitive data in a selected cloud account and region with configurable retention policies.

Scorers may themselves be executable code. Inline and bundled functions in Braintrust-hosted and AWS self-hosted deployments run in ephemeral Lambda environments inside an isolated VPC; they can access the internet but not internal infrastructure. The same documentation states that custom code on GCP and Azure self-hosted deployments runs in the data-plane process without equivalent isolation. Who may upload scorers and which secrets they can read belong in the threat model.

## 7. Choosing among tools in the same layer

**Patronus AI** emphasizes evaluator capabilities and safety checks. Its [evaluator reference](https://docs.patronus.ai/docs/evaluators/reference_guide) offers proprietary families such as hallucination detection and GLIDER. Evaluate Patronus first when buying a specialized judge model for RAG hallucination or safety is the core need. Braintrust's center of gravity is the connected dataset, experiment, trace, and collaboration workflow.

**Promptfoo** is a CLI-first open-source evaluation and red-team tool. Its [official quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/) generates and executes adversarial tests locally. Promptfoo is more direct when test configurations must live in Git and CI runs prompt matrices or security scans. Production trace feedback and cross-role annotation are not its organizing center.

**Arize Phoenix** is an open-source observability and evaluation platform that runs locally, in Docker or Kubernetes, or in a cloud deployment. It uses OpenTelemetry and OpenInference; its [official documentation](https://arize.com/docs/phoenix/) includes datasets, experiments, and a playground. Phoenix is Braintrust's most direct alternative when complete OSS self-hosting and OTel-first architecture are priorities.

**Galileo** extends evaluation into synchronous guardrails. Its [product page](https://galileo.ai/) says offline evaluations can be distilled into low-latency Luna evaluators that control production actions, tool access, and escalation. If a system must block or redact before a response leaves, test Galileo alongside Braintrust's asynchronous scoring. Galileo's performance and accuracy figures are vendor-reported and require validation on your data.

**Langfuse** has an MIT-licensed core plus enterprise directories. Its [experiment data-model documentation](https://langfuse.com/docs/evaluation/experiments/data-model) also covers datasets, experiments, traces, and scores. Langfuse is natural when open-source self-hosting, a large community, and general LLM observability come first. Compare Braintrust's UI and workflow when immutable experiment comparison and production-to-dataset curation are the primary job.

The site already has a [dedicated Langfuse article](/posts/ai/2026-03-26-langfuse-llm-observability-guide-en). Use it to establish the observability baseline before deciding whether a platform migration is warranted.

## Overall

Braintrust's defensible value is not AutoEvals or another score dashboard; both can be built independently. It sells durable lineage: which production failure entered which dataset version, which experiment and scorer established a fix, and which candidate was therefore safe to deploy.

It fits teams with a production AI feature, weekly prompt, model, or agent changes, and a need for engineering, product, and domain experts to share evidence. It does not fit a team with a few dozen fixed cases and no production tracing, or one requiring the entire UI and data plane to be open-source and air-gapped. Start with the open SDK and one reproducible experiment. Pay for the platform when dataset ownership, baseline comparison, and production feedback become the actual bottlenecks.

## References

- [Braintrust: Evaluate systematically](https://www.braintrust.dev/docs/evaluate) (full evaluation loop and offline/online boundary)
- [Braintrust: Build datasets](https://www.braintrust.dev/docs/annotate/datasets) (dataset fields, versions, and trace curation)
- [Braintrust: Create experiments](https://www.braintrust.dev/docs/evaluate/run-evaluations) (immutable experiments, CI, trials, and no-send-logs)
- [Braintrust: Measure output quality with scorers](https://www.braintrust.dev/docs/evaluate/write-scorers) (scorer types and scope)
- [Braintrust: Examine traces](https://www.braintrust.dev/docs/observe/examine-traces) (trace and span data model)
- [Braintrust: Evaluating agents](https://www.braintrust.dev/docs/best-practices/agents) (offline isolation, online feedback, and sampling)
- [Braintrust Security](https://www.braintrust.dev/docs/security) (data location, retention, and custom-code isolation differences)
- [Braintrust self-hosting architecture](https://www.braintrust.dev/docs/admin/self-hosting/architecture) (control-plane and data-plane boundary)
- [braintrustdata/braintrust-sdk-python](https://github.com/braintrustdata/braintrust-sdk-python) (open SDK, minimal Eval example, and license)
- [Braintrust's Series B](https://www.braintrust.dev/blog/announcing-series-b) (official funding and customer announcement)
- [Patronus Evaluator Reference Guide](https://docs.patronus.ai/docs/evaluators/reference_guide) (proprietary evaluator families)
- [Promptfoo Red Team Quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/) (local red-team workflow)
- [Arize Phoenix documentation](https://arize.com/docs/phoenix/) (open-source tracing, evaluation, datasets, and experiments)
- [Galileo AI product page](https://galileo.ai/) (eval-to-guardrail positioning; figures are vendor-reported)
- [Langfuse Experiments Data Model](https://langfuse.com/docs/evaluation/experiments/data-model) (datasets, experiment runs, traces, and scores)
- Related on this site: [Langfuse: Open-source observability for LLM applications](/posts/ai/2026-03-26-langfuse-llm-observability-guide-en)
