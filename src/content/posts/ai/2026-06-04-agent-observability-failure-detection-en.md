---
title: "Agent Observability: From OTel Traces to Catching Hallucinations, Tool Misuse, and Infinite Loops"
date: 2026-06-04
category: ai
type: deep-dive
tags: [observability, ai-agent, tool-use, llm, opentelemetry]
lang: en
tldr: "The industry has converged on using OpenTelemetry GenAI semantic conventions to turn every LLM call and tool call into a span. Detecting the three major failure modes then splits into three tracks: faithfulness + semantic entropy for hallucinations, framework-level symbolic guardrails for tool misuse, and max steps + action hash deduplication for infinite loops — all wired into a Final / Trajectory / Single-step three-layer evaluation framework."
description: "A comprehensive overview of the agent observability stack: OTel GenAI semantic conventions span structure, hallucination detection (RAGAS faithfulness, Nature 2024 semantic entropy), tool misuse three-layer defense (AgentDoG, TraceSafe-Bench), infinite loop multi-layer safeguards and the correct usage of LangGraph recursion_limit."
draft: false
glossary:
  - term: "span"
    definition: "The smallest unit of distributed tracing: an operation record with a start and end time plus attributes; multiple spans chain together into a trace."
    context: "This article turns every LLM call, tool call, and reasoning step into an OTel span."
---

> 🌏 [中文版](/posts/ai/2026-06-04-agent-observability-failure-detection)

When an agent breaks in production, all you typically see is "the answer is wrong" or "the bill exploded" — you can't see what it was thinking in between, which tools it called, or why it went in circles. This article surveys the industry's converging answer to "seeing an agent's reasoning process" — **using OpenTelemetry GenAI semantic conventions to turn every LLM call / tool call / reasoning step into a span** — and on top of those traces, the spectrum of methods for detecting three major failure modes: hallucination, tool misuse, and infinite loops.

There's a fundamental difference between traditional service telemetry and LLM agent telemetry: failure modes shift from exceptions / timeouts to **hallucination / context overflow / tool errors**, and debug artifacts shift from stack traces to **prompt + completion + reasoning chains**. This means existing APM thinking still applies, but the contents need to be completely replaced.

## Foundation: OpenTelemetry GenAI Semantic Conventions

The consensus approach for tracing reasoning processes is to use OTel's **GenAI semantic conventions (`gen_ai.*` attributes)** to decompose a single agent execution into a span tree:

- One agent run = root span (`invoke_agent`)
- Each LLM call = child span (`gen_ai.client.chat`), recording `gen_ai.request.model`, `gen_ai.usage.input_tokens` / `output_tokens`, `gen_ai.response.finish_reasons`
- Each tool call = child span (`execute_tool {gen_ai.tool.name}`), optionally recording `gen_ai.tool.call.arguments` / `gen_ai.tool.call.result` (subject to privacy policies)

The resulting trace structure looks like this:

```
[invoke_agent: research-agent]      ← root agent span
 ├─ [chat: anthropic]               ← LLM planning
 ├─ [execute_tool: web_search]      ← tool call #1
 ├─ [chat: anthropic]               ← process results
 ├─ [execute_tool: write_file]      ← tool call #2
 └─ [chat: anthropic]               ← final synthesis
```

The GenAI SIG was established in April 2024, originally covering only LLM client tracing, and has since expanded to six layers including agent orchestration, MCP tool calling, content capture, and quality evaluation; as of v1.41.x **it remains in beta, with some attributes marked experimental**. Datadog, Honeycomb, and New Relic have native support; LangChain, CrewAI, and AutoGen/AG2 can natively or via instrumentation packages output OTel-compliant spans. Landing tools (LangSmith, Langfuse, Arize Phoenix, Braintrust, MLflow Tracing, Opik) are all built on this layer. Claude Agent SDK can automatically export OTel spans to backends like Langfuse via OpenInference instrumentation; Claude Code itself also supports OTLP exporters and can use `TRACEPARENT` to chain agent spans into the parent application's trace.

However, OTel has inherent limitations in AI scenarios: prompts / completions are large text blobs, tool parameters differ structurally each time, and multi-step reasoning doesn't fit into fixed schemas. More critically — **OTel only solves "visibility," it doesn't answer "is the answer good?"** The latter requires an evaluation layer on top, which brings us to the three detection tracks below.

## Detection Track One: Hallucination

Two major approaches, corresponding to "with context" and "without context" scenarios:

**(A) Faithfulness / Groundedness (mainstream for RAG scenarios)**. Defined as "whether the answer is faithful to the retrieved context." The typical computation flow: claim extraction (decompose the answer into atomic claims) → verification (check each claim against the context) → scoring (calculate the proportion supported). Tool-wise, RAGAS provides faithfulness / answer relevancy / context precision-recall, DeepEval has `FaithfulnessMetric`, and G-Eval uses LLM-as-judge to outperform GPTScore / BERTScore / UniEval on the QAGS benchmark. Limitations are clear: RAGAS faithfulness works well for simple search-like queries, **but loses accuracy on complex reasoning**, and effectiveness heavily depends on the judge LLM's capability and claim extraction quality.

**(B) Uncertainty estimation (works without context too)**. The representative work is Oxford OATML's **semantic entropy** published in Nature 2024: computing entropy over "meaning space" rather than token sequence probabilities — sample the same question multiple times, cluster semantically equivalent responses, then calculate distributional entropy. High entropy means high uncertainty and likely confabulation. The cost is multiple samples, making it more expensive than single-pass QA. Other black-box baselines include SelfCheckGPT and TLM (highest precision/recall but high sampling cost); the white-box approach of neural probes is fastest but requires model access.

**(C) Real-time protection (guardrails, not post-hoc eval)**. A post-LLM hallucination guardrail checks each response upon generation for "claims not supported by context," isolates that sentence, sends it back to the LLM for correction, and re-verifies — the user only sees the fully grounded version. The division of labor with continuous eval: guardrails intercept and correct **within a single execution**; eval finds patterns post-hoc across production traffic.

An important point that's easy to misunderstand: **faithfulness ≠ factual correctness**. It assumes the context is ground truth; whether the context itself is correct is a separate problem.

## Detection Track Two: Tool Misuse

First, let's define the types of misuse. AgentDoG (arXiv:2601.18491) provides a systematic taxonomy with four common categories: incorrect parameters (right tool but unsafe or context-inappropriate parameters), wrong tool selection (choosing deprecated / malicious tools), contextual inappropriateness (using a benign tool in a policy-violating context), and unverified tool output (over-trusting tool output).

Detection and defense split into three layers, from hard to soft:

1. **Pre-execution symbolic guardrails (hardest)**. Use framework-layer hooks to evaluate business rules before tool execution, canceling the call on violation (e.g., "cannot confirm booking if payment is unverified"). Key insight: **constraints in docstrings and system prompts are just context to the LLM, not enforcement** — the LLM will ignore them. Rules must be enforced at the framework level so the LLM can't bypass them by changing parameters. In the AWS Strands Agents case study, 3/3 invalid operations were blocked without modifying any tools or prompts.
2. **Tool selection quality scoring (LLM-as-judge)**. Judges "should a tool be used, was the right one selected, and are the parameters correct?" Galileo's Tool Selection Quality, DeepEval's `ToolCorrectnessMetric` (comparing actual vs expected tools), and RAGAS's tool call accuracy all fall in this layer.
3. **Trajectory-level security monitoring (mid-execution)**. TraceSafe-Bench (arXiv:2604.07223) points out that existing guardrails mostly examine single tool calls, **ignoring risks distributed across multi-step trajectories**. It uses over 1,000 multi-step traces with 12 risk types (prompt injection, privacy leakage, hallucinated arguments, etc.) to test "mid-execution interception," concluding that current guardrails are still insufficient for multi-step tool-call detection.

The adversarial side is also worth knowing: Imprompter (arXiv:2410.14923) demonstrates using obfuscated strings to trick production agents into misusing tools with specific parameters (commonly URL access tools) to leak data. Defensive countermeasures include least privilege, role isolation, and sandboxing.

## Detection Track Three: Infinite Loops

The root cause is simple: ReAct-style agent loops have no memory of "the current execution chain's historical state" — if step 5 fails, it retries with the same parameters indefinitely. The community has real cases: an agent ran overnight retrying the same input 200+ times, burning $63.

The industry consensus is a multi-layer defense combination:

1. **Hard ceiling (first line of defense)**: LangGraph's `recursion_limit` **defaults to 25 supersteps**, designed to catch infinite loops, not as a reasonable workload cap; complex graphs should explicitly set 50 or 100. Exceeding it throws `GraphRecursionError` — but this is a hard exception that crashes and loses state. Corresponding knobs in other frameworks: AutoGen's `max_consecutive_auto_reply`, LangChain / CrewAI's `max_iterations` — **apply to all agents**.
2. **TTL / step counter (soft landing)**: Inject a TTL counter into shared graph state, enabling graceful degradation at the limit instead of hard crashes.
3. **State deduplication (catching real loops)**: Hash `tool_name + args` and compare against the last N steps — on match, force a strategy change or exit; or detect "repeated tool calls with identical parameters" and inject negative feedback to force new reasoning paths. The community already has established patterns like `LoopGuard(max_repeats, window)` + `BudgetGuard(max_cost_usd)`.
4. **Critic / Supervisor arbitration**: Use a smaller, cheaper LLM as a critic for trajectory evaluation, which can force-terminate stalled loops.

When diagnosing from traces: if the span tree shows `[Planner→Tool→Critic→Planner→Tool→Critic...]` repeating endlessly, the key is to **check whether the input state payload in the repeated steps is actually changing** — if not, it's truly stuck. Another common pitfall: raising the recursion limit from 25 to 50 **won't fix the problem** — the root cause is usually a router with no path to `END`; raising the limit and fixing the router are two different fixes.

## Wiring the Three Tracks into a Three-Layer Evaluation Framework

All three detection types ultimately plug into the same evaluation framework. Langfuse, LangChain, and MLflow documentation are highly consistent on this:

| Layer | Alias | What it examines | Answers | Corresponding metrics |
|---|---|---|---|---|
| Final response | Black-box | Only input + final answer | **what** went wrong | answer correctness, task completion |
| Trajectory | Glass-box | Entire tool call / reasoning sequence | **where** it went wrong | tool selection, plan quality, trajectory comparison |
| Single-step | White-box | Each decision point independently | **why** it went wrong | step-level oracle, per-step faithfulness |

On trade-offs, outcome metrics are cheap, suitable for initial validation and continuous monitoring; trajectory is expensive but interpretable, selectively used for debugging failures and high-risk decisions. Evaluation-Driven Development (arXiv:2411.13768) warns against over-biasing toward either side. Offline and online evaluation should use **the same set of scorers**: offline runs regression on curated datasets during development, online runs evaluators on sampled production traffic and alerts when scores drop below thresholds. The most valuable test cases come from production failure traces — systematically annotate them via annotation queues and add them to the eval set.

## Overall

| Problem to solve | Minimum viable approach | Enhanced version |
|---|---|---|
| See the reasoning process | Connect OTel GenAI semconv, export to any of Langfuse / LangSmith / Phoenix | Chain into parent application trace via `TRACEPARENT`; add privacy redaction to content capture |
| Hallucination | For RAG scenarios, start with faithfulness + post-LLM guardrail | For context-free scenarios, add semantic entropy uncertainty estimation |
| Tool misuse | Framework-level symbolic guardrail pre-execution interception | Layer on LLM-judge selection quality + trajectory security monitoring |
| Infinite loops | Hard max steps + action/args hash dedup + budget ceiling | TTL soft landing + critic arbitration + inspect state payload changes in traces |
| Overall quality | Three-layer eval (start with final, then add trajectory) | Offline regression + online sampling with the same scorer set |

Four counterintuitive points worth pinning to the wall: tool docstring constraints **are not enforcement** — for hard rules, intercept at the framework level; raising the recursion limit doesn't fix loops — first check whether the router has a path to `END`; OTel only gives you "visibility," the evaluation layer must be added separately; faithfulness does not equal factual correctness — context quality is an independent problem.

## References

- [OpenTelemetry GenAI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [Detecting hallucinations in large language models using semantic entropy (Nature 2024)](https://www.nature.com/articles/s41586-024-07421-0)
- [RAGAS Official Documentation](https://docs.ragas.io/)
- [DeepEval Official Documentation](https://deepeval.com/)
- [G-Eval: NLG Evaluation using GPT-4 (arXiv:2303.16634)](https://arxiv.org/abs/2303.16634)
- [AgentDoG: A Diagnostic Guardrail Framework for AI Agent Safety and Security (arXiv:2601.18491)](https://arxiv.org/abs/2601.18491)
- [TraceSafe-Bench (arXiv:2604.07223)](https://arxiv.org/abs/2604.07223)
- [Imprompter: Tricking LLM Agents into Improper Tool Use (arXiv:2410.14923)](https://arxiv.org/abs/2410.14923)
- [Evaluation-Driven Development of LLM Agents (arXiv:2411.13768)](https://arxiv.org/abs/2411.13768)
- [LangGraph: Graph recursion limit](https://langchain-ai.github.io/langgraph/concepts/low_level/)
- [Langfuse](https://langfuse.com/)
- [LangSmith](https://docs.smith.langchain.com/)
- [Arize Phoenix](https://phoenix.arize.com/)
- [Claude Code: Monitoring usage (OpenTelemetry)](https://code.claude.com/docs/en/monitoring-usage)
