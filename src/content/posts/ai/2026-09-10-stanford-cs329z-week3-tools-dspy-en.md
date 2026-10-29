---
title: "Plug Tools In, Take Frameworks Apart — HW1 Begins | Stanford CS329Z Week 3"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 4
tldr: "Lecture 04 follows tool use from training and API retrieval to function calling, MCP and reliability evaluation. Lecture 05 compares DSPy, LangGraph, harnesses, Temporal and observability. Separate MCP and DSPy reading digests explain the protocol and optimization mechanisms; HW1 remains a hand-built harness."
description: "A guided reading of the Stanford CS329Z Week 3 anchors: the MCP spec's host-client-server shape and safety rules, DSPy's compilable-pipeline design, and how each lines up with a framework-free HW1."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-week3-tools-dspy)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Week 3 is the pivot. Monday (Oct 5, Tool Use & Function Calling) assigns the [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18): tools get a standard plug, no more rewriting integrations per vendor. Wednesday (Oct 7, Frameworks & Agent Design) assigns Khattab et al.'s [DSPy](https://arxiv.org/abs/2310.03714) (ICLR 2024): prompt templates graduate from handcraft into compilable, optimizable programs. That same Monday, [HW1 drops](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), Build an Agentic Harness: no agent frameworks, just a chat-completion call, and you build a company's internal AI assistant from scratch — with the project proposal due Friday (Oct 9). Hand-building in the homework while reading a framework paper in lecture is where this week's tension lives.

The official slides and assigned readings serve different roles. The page-by-page guides below cover both lectures; the following reading digests retain the arguments and experiments of the assigned sources. Examples and checks proposed by this article are teaching exercises, not official assignment solutions. Page ranges use physical PDF pages; repeated animation and section-divider pages are grouped.

## Lecture 04 slide guide

<div class="slide-reader" data-slide-reader data-pages="68" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf">
<p>68 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–14: Finish the evidence problem in RAG

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=1" data-slide-page="1">Slides 1–14</a>

The lecture first finishes RAG: retrieving more documents does not ensure that generation uses them better. Lost-in-the-middle and citation-quality figures ask distinct questions: did the model use the evidence, and does its citation support the claim? Clickable sources still require claim-level checking.

As an original diagnostic exercise, keep the model fixed while changing evidence position and irrelevant-document count, then inspect cited passages. This separates retrieval misses, evidence-use failures, and unsupported citations.

### Pages 15–21: Tools delegate computation and access to external programs

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=15" data-slide-page="15">Slides 15–21</a>

A tool is an interface to a program executed outside the model. The model supplies a name and arguments; the harness executes it and returns the result. Multiplication illustrates the distinction, followed by needs involving computation, unseen information, and inaccessible external state. Calculators, retrieval, and databases address different gaps.

Inspect tool selection, actual dispatch, and use of the returned value. A model saying that it checked something is not an execution record.

### Pages 22–35: Toolformer executes candidates before filtering them

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=22" data-slide-page="22">Slides 22–35</a>

Toolformer samples API-call candidates from a few demonstrations, executes them, and retains calls whose results reduce subsequent prediction loss. Those augmented examples become fine-tuning data. This creates a tool-training signal from a language-model objective; it does not establish reliable multi-step execution.

ToolkenGPT instead represents tools as special tokens and learns their embeddings, switching into argument generation when one is selected. Read the comparison by identifying what is trained before comparing tool counts.

### Pages 36–45: At scale, retrieve the right API before generating a call

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=36" data-slide-page="36">Slides 36–45</a>

ToolLLM and Gorilla address larger tool catalogs. The system must locate a suitable API as well as generate its syntax. Gorilla includes correct and incorrect retrieval context during retrieval-aware training. AST subtree matching checks generated calls against the API structure.

API existence, valid arguments, and task success are separate checks. An original test can supply stale API documentation and inspect whether the system detects unsupported fields and recovers from the actual error.

### Pages 46–56: REST, function calling, MCP, and two authentication boundaries

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=46" data-slide-page="46">Slides 46–56</a>

REST exposes service endpoints, function calling supplies model-facing schemas, and MCP provides discovery and invocation across hosts. The slides walk through tools/list and tools/call, then turn LMS routes for assignments, submissions, and grading into tools. Treat the code as a lecture illustration and consult the adopted specification for implementation.

Inbound authorization governs agent access to the MCP server; outbound authorization governs the server’s LMS access. Connecting successfully does not authorize every grading action. The executor must check user, resource, and operation scope. The versioned MCP digest below explains host, client, and server roles.

### Pages 57–68: From valid calls to repeatable task completion

<a href="https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=57" data-slide-page="57">Slides 57–68</a>

BFCL tests function choice, arguments, and abstention when no tool applies. ToolBench composes tasks over real APIs; τ-bench adds user interaction and policies. The add/mult example makes abstention concrete: an addition-only tool should not be forced into a multiplication request.

pass@k asks whether at least one attempt succeeds; [pass^k](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=64) asks whether all sampled attempts succeed. For an internal assistant, succeeding once and corrupting data on the second run is not reliable. τ-bench itself keeps changing: [page 66](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=66) lists τ²-bench, which adds a telecom domain where the user must also act, followed by task audits, knowledge retrieval, and voice variants. Name the version whenever you cite a score.

[Page 67](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf#page=67) sorts tool failures into three levels, which translate directly into test cases. A single call can pick the wrong tool or call one when none is needed, invent fields or use wrong types and units, or call an API that does not exist. A multi-step chain can skip a prerequisite call or run steps out of order, and can retry the same failing call instead of backing off. A conversation can act where policy forbids it, assume instead of asking the user, or pass once and fail on the retry, which is exactly what pass^k measures. Put at least one case at each level and inspect the final environment state, not just the reply.

## Lecture 05 slide guide

<div class="slide-reader" data-slide-reader data-pages="132" data-pdf-src="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf">
<p>132 physical PDF pages. Select a page-range link to compare the slides with this guide.</p>
<button type="button" data-slide-open>Open slide comparison</button>
<p><a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf" target="_blank" rel="noopener noreferrer">Open original PDF</a></p>
</div>

### Pages 1–18: Engineering combines data, systems, and evaluation

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=1" data-slide-page="1">Slides 1–18</a>

The opening compares hand-written backprop with PyTorch: abstractions save work, while underlying behavior still matters. Data, system/model, and evaluation/metric form three pillars. Frameworks then occupy positions across models, workflows, and agents; observability and reliable execution form additional layers.

Identify the missing layer before choosing a framework: model interface, composable workflow, agent harness, or recoverable execution. A broad feature list does not establish that a tool addresses your failure mode.

### Pages 19–51: DSPy exposes contracts, composition, and measured optimization

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=19" data-slide-page="19">Slides 19–51</a>

A signature declares inputs and outputs, a module fulfills that contract, and an optimizer improves the program against data and a metric. Many pages are backup screenshots for a live demo: inconsistent fields lead into composition, datasets, scoring, optimization, and agent modules.

Use pages 22 and 51 as structural anchors before inspecting the code screenshots. The paper digest below uses the original paper’s term teleprompter; the lecture uses optimizer. You still own the dataset, metric, and held-out test split.

### Pages 52–77: LangGraph makes shared state and control flow explicit

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=52" data-slide-page="52">Slides 52–77</a>

State is the shared workspace, nodes are functions that read and update it, and edges define what runs next. Conditional edges branch from results. The slides build start/end nodes and a workflow, then an LLM/tool loop. Model decisions still operate inside a programmed graph and state representation.

As an original exercise, separate email retrieval, drafting, and confirmation into nodes. Make “do not send before confirmation” an inspectable state condition. Compare abstractions according to control needs rather than assuming one-to-one feature equivalence with DSPy.

### Pages 78–89: Harnesses choose tools, history, and execution behavior

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=78" data-slide-page="78">Slides 78–89</a>

Mini-SWE-agent, OpenHands, Pi, and OpenClaw illustrate choices in tools, linear/event/tree history, independent subprocesses versus persistent terminals, and scheduled memory work. These are lecture snapshots; use them to identify design dimensions rather than current product specifications.

These choices show up in scores. [Page 86](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=86) cites an arena.ai comparison on Terminal-Bench 2: the same Claude Haiku 4.5 succeeds 31.1% of the time in Codex and 47.8% in Pi. Hold the harness fixed before comparing models, or you cannot tell where an improvement came from. [Pages 87–88](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=87) go further with Meta-Harness, where an agent reads earlier candidates' code, traces, and scores, proposes a new harness, and evaluates it, treating the harness itself as the object of optimization. Lecture 09 returns to this idea.

A persistent shell can retain a directory and environment variables; independent subprocesses cannot be assumed to do so. Two commands with a state dependency provide a simple check of the harness’s actual execution model.

### Pages 90–122: Durable orchestration and telemetry support recovery

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=90" data-slide-page="90">Slides 90–122</a>

[Pages 92–93](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=92) first explain why this layer is needed: agents now work for long stretches, and a crash or API timeout halfway through wastes every completed step, while missing logs leave nothing to debug. These are old software-engineering lessons that carry over to agents. Temporal separates workflows from fallible activities, with a server retaining execution history, queues, and state while workers perform tasks. Backup demo pages cover retries and server-managed timing. MLflow, LangSmith, and Langfuse appear as observability tools for investigating calls and state.

Retries still require side-effect design. In an original email example, a service may accept a message while its response is lost. Repeating the operation can send twice. Record operation identity and outcome before deciding whether a retry is safe; durable orchestration does not automatically make arbitrary external effects occur once.

### Pages 123–132: Use traces and domain tasks to justify complexity

<a href="https://web.stanford.edu/class/cs329z/slides/lecture05.pdf#page=123" data-slide-page="123">Slides 123–132</a>

The conclusion frames engineering as build, run, evaluate, and improve: start simple, expose failures, set timeouts, retries and budgets, and compare representative and edge cases. A generic coding benchmark may not represent a domain assistant.

A Traditional Chinese workplace assistant needs questions in that language, internal terminology, permission differences, and realistic tool failures. Preserve baseline traces and outcomes when changing frameworks, then report which failures improved and at what latency cost.

## Reading | MCP: standard interfaces retain host trust responsibilities

[Monday required reading; this digest uses version 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)

### TL;DR

Hosts manage clients, context, and policy; clients connect to servers providing tools, resources, and prompts. Interoperability does not decide user authorization.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | Versioned normative specification covering roles, capability negotiation, messages, and security principles; not a tool-use benchmark. |
| Boundary | Read capabilities against the named version. Specification principles do not prove that every server implements them correctly. |
| Reading value | A protocol and trust contract to understand before implementing a host or server. |

### Background

Bespoke integrations multiply interface work. MCP supplies a common protocol, while model decisions, host policy, and service permissions remain distinct layers.

### Intermediate guide

**MCP: the standard plug for tools**

The spec's inspiration is LSP (Language Server Protocol): back when every editor needed per-language rewiring, unification unlocked the ecosystem. MCP wants the same for AI tools, in three roles: the host is the LLM app, building clients, aggregating context, and enforcing consent and security policy; clients are connectors inside the host, one client per server; servers provide context and capabilities, all over JSON-RPC 2.0. Isolation is a design principle: the host should limit exposed context, and a server should not automatically access the full conversation or other servers. Capabilities are negotiated up front at initialization — undeclared features stay off.

Servers offer three capabilities, each with a controller: Prompts are user-invoked templates, Resources are application-mounted context, and [Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) are model-invoked functions. [Week 2](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)'s ACI gets its standard shape here: tool definitions stop being per-vendor dialects. Clients symmetrically offer three back to servers: [Sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling) is server-initiated agentic behavior, with model preferences advisory and the client making the final pick; [Roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots) describe filesystem working scope, restricted to file:// URIs in this version; they do not replace host or operating-system permission enforcement; [Elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation) is structured user input, new in this version, limited to flat primitive schemas and never for sensitive information.

The security chapter deserves its own read. Tools are arbitrary code execution, and the spec says so up front: tool annotations count as untrusted unless from a trusted server; invocations keep a human in the loop with veto power, sensitive operations need prior user confirmation, and tool inputs should be shown before the call leaves. Sampling requests and responses must be reviewable; roots need user consent before exposure. The protocol governs format; consent flows are the implementor's homework — a line that comes back when HW1 gives the assistant a terminal and a human in the loop.

```diagram
title: MCP separates the host and its connections
desc: Each client inside the host connects to one server; the host manages context and consent.
caption: Architecture from the existing MCP section. Lines show connections; omits sampling, roots and elicitation exchanges.
---
<svg viewBox="0 0 440 384">
<rect class="dg-zone dg-zone--solid" x="16" y="16" width="408" height="216" rx="6"/>
<text class="dg-label" x="220" y="44" text-anchor="middle" dominant-baseline="central">Host: LLM application</text>
<text class="dg-sub" x="220" y="68" text-anchor="middle" dominant-baseline="central">Context and consent policy</text>
<path class="dg-line" d="M116 200V292" marker-end="url(#arrow)"/>
<path class="dg-line" d="M324 200V292" marker-end="url(#arrow)"/>
<rect class="dg-box" x="36" y="136" width="160" height="64" rx="6"/>
<text class="dg-label" x="116" y="160" text-anchor="middle" dominant-baseline="central">Client A</text>
<text class="dg-sub" x="116" y="180" text-anchor="middle" dominant-baseline="central">One connection</text>
<rect class="dg-box" x="244" y="136" width="160" height="64" rx="6"/>
<text class="dg-label" x="324" y="160" text-anchor="middle" dominant-baseline="central">Client B</text>
<text class="dg-sub" x="324" y="180" text-anchor="middle" dominant-baseline="central">One connection</text>
<rect class="dg-box" x="36" y="296" width="160" height="64" rx="6"/>
<text class="dg-label" x="116" y="320" text-anchor="middle" dominant-baseline="central">Server A</text>
<text class="dg-sub" x="116" y="340" text-anchor="middle" dominant-baseline="central">Capabilities</text>
<rect class="dg-box" x="244" y="296" width="160" height="64" rx="6"/>
<text class="dg-label" x="324" y="320" text-anchor="middle" dominant-baseline="central">Server B</text>
<text class="dg-sub" x="324" y="340" text-anchor="middle" dominant-baseline="central">Capabilities</text>
</svg>
```

### Deeper points

Resources, prompts, and tools have different control models. For sampling, roots, and elicitation, trace request direction, negotiated capabilities, and user visibility.

### Reviewer in one sentence

The key outcome is tracing requests and trust boundaries, not merely calling tools/call.

### Your take-away

Map one read and one write tool, including identity, resource scope, confirmation, and result readback; compare with actual host policy.

## Reading | DSPy: improve multi-stage programs with data and metrics

[Wednesday required reading](https://arxiv.org/abs/2310.03714)

### TL;DR

Signatures define inputs and outputs, modules compose calls, and optimizers use data and metrics to select demonstrations or other parameters across a pipeline.

### Editorial assessment

| Dimension | Assessment |
|---|---|
| Evidence | ICLR 2024 experiments in math and multi-hop QA compare few-shot, bootstrapped, and ensemble configurations. |
| Boundary | Historical scores depend on models and splits; compilation uses model calls and can optimize the wrong objective if the metric is flawed. |
| Reading value | Useful once data and metrics exist for improving a multi-stage program. |

### Background

Hand-written prompts mix task intent, examples, formatting, and execution. DSPy separates these concerns so programs can be improved against data.

### Intermediate guide

**DSPy: declarative modules and measured optimization**

The DSPy paper opens with a provocation: today's LM pipelines are hard-coded prompt templates, long strings accumulated through trial and error. It wants a systematic method instead: abstract pipelines as text-transformation graphs, with LMs invoked through **declarative modules**. Three moving parts: a signature declares inputs and outputs in natural language (e.g. `user_question -> search_query`) without saying how to coax the model; a module implements a signature with learnable parameters — the built-in ChainOfThought just prepends a rationale field and delegates to Predict, sketched in about a dozen lines; a teleprompter optimizes by filling each module with bootstrapped demonstrations. Modules carry parameters and teach themselves — generating and collecting demonstrations, composing prompting, finetuning, augmentation, and reasoning techniques.

In practice you write a signature plus a target metric, and the compiler tunes in three stages: generate candidate demonstrations (run the pipeline, keep traces that pass the metric), pick demonstration sets with random search or Optuna, and optionally rewrite program structure (e.g. ensembling compiled copies behind a majority vote). The paper reports results under its own models, data, and evaluation settings: a few lines of DSPy lift GPT-3.5 to 82% accuracy on [GSM8K](https://arxiv.org/abs/2110.14168); the two-hop retrieval program's ensemble answers 45.6% of the [HotPotQA](https://arxiv.org/abs/1809.09600) test set (that cell covers half the test set, per the paper's cost note); and a 770M-parameter T5 program distilled using 200 labeled inputs and 800 unlabeled questions scores 39.3% answer exact match on dev. Small models with good systems beating big models with bad ones — [Week 1](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en)'s thesis with reproducible numbers.

| Layer | What you describe | What it contributes |
|---|---|---|
| Signature | Input and output fields | Declares the transformation needed |
| Module | An implementation of the signature | Arranges model calls and parameters |
| Teleprompter / optimizer | Training inputs and a validation metric | Selects demonstrations to improve the pipeline |

### Deeper points

Keep final test examples outside compilation. Inspect module and end-to-end errors, and check whether demonstrations leak answers.

### Reviewer in one sentence

It supplies an optimizable program abstraction whose gains depend on data and metrics.

### Your take-away

Replace one query-generation stage in a separate experiment, evaluating held-out quality and cost; keep it separate from the framework-free HW1 submission.

## How the two readings relate: the abstraction-level question

Wednesday's lecture title names it: what frameworks abstract versus what you built from scratch. LangChain, LangGraph, and LlamaIndex each pick a different abstraction altitude; DSPy picks "you don't even hand-write prompts." Week 2's brake pedal still applies: frameworks save startup time and charge debugging visibility. Because HW1 bans frameworks, you hand-build every part first; Wednesday's lecture then asks the reverse question: same agent, scratch versus DSPy builds — what did the framework hide, and what did it decide for you?

## What to do: swap one stage of your hand-built pipeline into DSPy

**What to do**: this is an optional exercise, not homework — HW1 itself bans frameworks, so don't submit the DSPy version. Take your Week 2 hand-built RAG (or the email retrieval pipeline you're starting for HW1), lift exactly one stage (say query generation) into a DSPy signature, compile against twenty questions with accuracy as the metric, and compare against the hand-built score plus your time spent. The score gap matters less than three written lines: what decision the framework made for you, which decision you disagree with, and when you would switch back. Those three lines help you read Wednesday's lecture — and can seed the methods paragraph of Friday's proposal.

## Where it sits in the course

Week 3 releases HW1 (due Oct 30): start with the email retrieval pipeline, then add tools, a terminal, memory, and a human in the loop until it becomes a full harness; Week 4's ReAct and memory are the middle pieces. MCP only grows from here: Week 5's multi-agent collaboration and Week 9's coding agents (SWE-agent, Claude Code architectures) are all division of labor over standard interfaces. Remember the spec's positioning line: MCP governs format, consent and trust are the implementor's homework.

## This week's course material

- Official lecture slides (PDF): [Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf); [Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- Mon 10/5 Tool Use & Function Calling: anchor reading MCP specification (covered above); no additional readings this week.
- Wed 10/7 Frameworks & Orchestration: anchor reading the DSPy paper (covered above); no additional readings this week.
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update Log

- 2026-10-29: Rechecked every section's page range against the Lecture 04/05 PDFs; added the three-level tool-failure taxonomy and τ-bench version history (L04 pp. 64–67), the same-model harness gap and Meta-Harness (L05 pp. 86–88), and the motivation for durable orchestration (L05 pp. 92–93).

- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.

- 2026-10-23: Added an MCP connection diagram and DSPy layer comparison to visualize existing explanations; no factual refresh.

- 2026-10-10: Added direct links to this week's official lecture slides, alongside the existing course video sources and recording access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus is now a corporate email archive); rewrote the affected paragraphs to match.

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- Lecture slides: [Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf); [Frameworks & Orchestration — Lecture 05](https://web.stanford.edu/class/cs329z/slides/lecture05.pdf)
- On this site: [Week 2: workflows versus agents](/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Week 1: stop tuning only the model](/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Stanford CS329Z course guide](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18), [Khattab et al., DSPy, ICLR 2024](https://arxiv.org/abs/2310.03714)
- Tools: [DSPy](https://dspy.ai/), [LangChain](https://www.langchain.com/), [LlamaIndex](https://www.llamaindex.ai/)
