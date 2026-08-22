---
title: "Promptfoo Deep Dive: Local-First LLM Evaluation and Red Teaming"
date: 2026-08-22
category: ai
tags: [promptfoo, llm-evaluation, red-teaming, ai-security, ci-cd, llm]
lang: en
type: deep-dive
tldr: "Promptfoo combines prompts, providers, test cases, and assertions in YAML to produce repeatable local and CI evaluation matrices, with red teaming against the same targets. It lowers the testing barrier but does not remove output variance, LLM-judge bias, or hosted data-flow concerns."
description: "A config-to-CI examination of Promptfoo: test cases, assertions, providers, red teaming, privacy, judge limitations, and trade-offs against major evaluation and observability platforms."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-promptfoo-llm-evaluation)

[Promptfoo](https://www.promptfoo.dev/docs/getting-started/) is an MIT-licensed LLM evaluation and red-team CLI and library. Prompts, model providers, test data, and scoring conditions live in `promptfooconfig.yaml`. A developer runs the matrix locally, compares results in a terminal or local UI, and moves the same command into CI. Compared with adopting a cloud observability platform first, this resembles conventional software testing: configuration and cases can be reviewed alongside code.

In March 2026, OpenAI announced an agreement to acquire Promptfoo, subject to customary closing conditions. Both companies said the open-source project would continue. Adoption figures are company-reported: Promptfoo says more than 350,000 developers have used it, 130,000 are active monthly, and over one-quarter of Fortune 500 companies rely on it. [OpenAI's announcement](https://openai.com/index/openai-to-acquire-promptfoo/) directly repeats only the last figure, so these numbers are scale signals rather than independently audited measurements.

## Step one: Config defines the comparison

Promptfoo does not produce one universal “AI quality score.” Its core is a Cartesian product: each prompt version × provider × test case becomes an execution scored by assertions.

```yaml
# promptfooconfig.yaml
prompts:
  - 'Return JSON only: {"answer": "{{question}}"}'

providers:
  - id: openai:gpt-5-mini
    config:
      temperature: 0

tests:
  - vars:
      question: 'What is the capital of Taiwan?'
    assert:
      - type: is-json
      - type: contains
        value: 'Taipei'
      - type: llm-rubric
        value: 'The answer is correct, direct, and contains no text outside JSON'
```

```bash
npx promptfoo@latest eval -c promptfooconfig.yaml
npx promptfoo@latest view
```

A provider may be OpenAI, Anthropic, Gemini, Bedrock, or Ollama, as well as an HTTP endpoint, JavaScript or Python provider, shell command, or agent runtime. Promptfoo can therefore compare foundation models or call a complete local RAG or agent API. The provider is the system under test; a grader used by a model-graded assertion is another provider. Specify both independently, or the API keys present in the environment may change the default judge.

## Step two: Test cases should represent real failures

Each case can carry `vars`, metadata, prompt or provider filters, and its own assertions. Data can come from YAML, JSON, CSV, or code. A useful starting set has three small groups: golden cases for product requirements, failures observed in production, and policy cases that must never fail.

Every fixed bug should add its input and minimum verifiable condition to the dataset. If a support agent once gave the wrong refund window, test the time limit and cited source—not merely whether the response is “helpful.” A suite becomes valuable when failures accumulate as regression cases, not when its row count looks impressive.

## Step three: deterministic assertions before judges

Promptfoo includes exact match, contains, regex, JSON schema, cost, latency, JavaScript, and Python assertions. It also offers model-assisted metrics such as similarity, factuality, G-Eval, and `llm-rubric`. The sensible order is to encode format, required fields, tool arguments, and hard policy in code. Reserve LLM judges for tone, relevance, and holistic quality that cannot be expressed precisely.

An LLM judge is itself a nondeterministic model. Rubric wording, output order, model versions, and the judge's own preferences affect results. One pass rate is not a precision measurement. Repeat important cases, pin the judge and rubric, preserve raw reasons, and compare a sample against human labels. If the judge cannot reproduce human decisions reliably, treat its CI result as a trend rather than a universal deployment gate.

Caching can also hide variance. Cache during iteration to save money. Use `--no-cache` when measuring variance or checking a provider update, and attach model ID, prompt version, and git SHA to result metadata.

## Step four: red teaming shares a target, not a test type

[Promptfoo red teaming](https://www.promptfoo.dev/docs/red-team/quickstart/) combines targets, plugins, and strategies. A plugin defines the risk—prompt injection, PII leakage, BOLA, or SSRF—while a strategy defines how an attack is transformed and delivered, such as a jailbreak or multi-turn conversation. The August 2026 documentation lists 157 plugins, but selecting everything only increases cost and noise. A foundation-model test does not need application access-control checks, and a chatbot without tools should not pretend to test SSRF.

```bash
npx promptfoo@latest redteam init --no-gui
npx promptfoo@latest redteam run
npx promptfoo@latest redteam report
```

Map data, tool, and role boundaries first, then choose relevant plugins for a baseline. Promote successful attacks into fixed regression cases. Automated red teaming expands exploration; it cannot prove that a system is “secure.” It does not replace API authorization checks, sandbox validation, or human social-engineering review, and it must not target third-party systems without authorization.

## Step five: local-first does not mean no data leaves

The ordinary runner executes locally, but prompts and outputs still go to configured providers. Red-team flows are easier to misunderstand. [Promptfoo's data-handling documentation](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/) says generation and grading may use hosted inference at `api.promptfoo.app` when no usable own API key is present. Some remote-only plugins, setup helpers, Cloud sync, sharing, and `redteam poison` transmit additional content.

Strict local control requires explicitly choosing local or bring-your-own-key providers for generation, grading, embeddings, and moderation; disabling remote generation and telemetry; and avoiding Cloud sync and sharing. Inject keys through CI secrets or environment variables, never YAML. A subtler risk is the config itself: custom assertions, providers, transforms, and hooks execute with the current user's permissions and are not sandboxed. Treat eval configs from external pull requests like build scripts—run them in isolated workers with scoped credentials.

## Step six: put a small, stable set in CI

Promptfoo outputs JSON, HTML, and JUnit XML. `--fail-on-error` makes assertion failures fail the job. Pull requests should run a cheap, deterministic core suite, while comprehensive red teams and expensive judges run on a schedule:

```bash
npx promptfoo@latest eval \
  -c promptfooconfig.yaml \
  --fail-on-error \
  --tag git.sha="$GIT_SHA" \
  -o results.junit.xml
```

Avoid gates where a better average permits one safety case to fail. Ten copywriting cases must not offset one policy violation. Group metrics, hard-fail non-negotiable cases individually, and reserve aggregates and baseline comparisons for subjective quality. Separate provider rate limits from quality failures too; otherwise the team will eventually disable a flaky eval job.

## Choosing among evaluation platforms

| Option | Consider it first when | Dividing line from Promptfoo |
|---|---|---|
| [Promptfoo](https://www.promptfoo.dev/docs/) | Cross-provider tests, assertions, and red teams should live in the repository and CLI | Direct local development and security scanning; production trace analysis is not the center |
| [Patronus AI](https://docs.patronus.ai/docs/evaluators/patronus) | Managed evaluators, enterprise governance, and specialized scoring models matter | More platform-oriented than a YAML run completed locally |
| [Braintrust](https://www.braintrust.dev/docs/evaluate) | Datasets, immutable experiments, playgrounds, and production scoring should form one feedback loop | Stronger experiment management and team analysis; requires Braintrust project and API workflows |
| [Arize Phoenix](https://arize.com/docs/phoenix/) | OpenTelemetry and OpenInference traces should be the common debugging and evaluation data layer | Centers observability and trace-driven evaluation |
| [Galileo](https://v2docs.galileo.ai/) | A managed AI-observability, evaluation, and guardrail workflow is the priority | Platform operations over a lightweight config-as-code loop |
| [Langfuse](https://langfuse.com/docs/evaluation/overview) | Production traces already live in Langfuse and should feed datasets, experiments, and scores | Stronger production feedback and self-hosting ecosystem; Promptfoo's red-team CLI is more direct |

This is not necessarily a single choice. Promptfoo can own deterministic pre-merge regression and adversarial suites, while Phoenix or Langfuse collects production traces and feeds failures back into Promptfoo cases. Do not let two systems hold unrelated copies of a dataset; align them through case ID, git SHA, and prompt version.

## Conclusion

Promptfoo's strongest move is turning “this prompt feels better” into a configuration that can be reviewed, rerun, and failed in CI. It does not remove nondeterminism or turn an LLM judge into ground truth. It provides a loop in which the tests themselves can improve.

Start tonight with ten cases: five real golden examples, three historical failures, and two policy rules that must never fail. Use deterministic assertions for hard requirements and at most one subjective metric with a pinned judge. Run the suite three times and inspect variance. If those ten judgments are unstable, improve the rubric and cases before building a thousand-row dashboard.

## References

- [Promptfoo getting started](https://www.promptfoo.dev/docs/getting-started/)
- [Promptfoo configuration guide](https://www.promptfoo.dev/docs/configuration/guide/)
- [Promptfoo assertions and metrics](https://www.promptfoo.dev/docs/configuration/expected-outputs/)
- [Promptfoo providers](https://www.promptfoo.dev/docs/providers/)
- [Promptfoo red-team quickstart](https://www.promptfoo.dev/docs/red-team/quickstart/)
- [Promptfoo red-team data handling and privacy](https://www.promptfoo.dev/docs/red-team/troubleshooting/data-handling/)
- [Promptfoo security policy](https://github.com/promptfoo/promptfoo/security)
- [Promptfoo CI/CD integration](https://www.promptfoo.dev/docs/integrations/ci-cd/)
- [OpenAI to acquire Promptfoo](https://openai.com/index/openai-to-acquire-promptfoo/)
- [Promptfoo is joining OpenAI](https://www.promptfoo.dev/blog/promptfoo-joining-openai/)
- [Patronus evaluators](https://docs.patronus.ai/docs/evaluators/patronus)
- [Braintrust evaluation workflow](https://www.braintrust.dev/docs/evaluate)
- [Arize Phoenix](https://arize.com/docs/phoenix/)
- [Galileo documentation](https://v2docs.galileo.ai/)
- [Langfuse evaluation overview](https://langfuse.com/docs/evaluation/overview)
