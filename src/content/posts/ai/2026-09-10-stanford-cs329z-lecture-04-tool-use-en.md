---
title: "Plug Tools In: Function Calling, MCP, and Tool Failures | Stanford CS329Z Lecture 4"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 5
tldr: "Lecture 04 runs from Toolformer's tool learning and Gorilla and ToolLLM's API retrieval to function calling, MCP, and reliability benchmarks such as BFCL and τ-bench. The assigned MCP specification standardizes the interface while trust responsibilities stay with the host."
description: "A page-linked guide to the 68 slides of CS329Z Lecture 04, Tool Use & Function Calling, plus a digest of the MCP specification's host-client-server shape and safety principles; HW1 is released the same day."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Lecture 4 (Oct 5, Tool Use & Function Calling) asks why models need tools and how they learn to use them: from Toolformer, Gorilla and ToolLLM to standard interfaces such as REST, function calling and MCP, evaluated with BFCL, ToolBench and τ-bench. The same day, [HW1 is released](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en): no agent frameworks, a single chat-completion call, and a company-internal AI assistant built from scratch.

The assigned readings are Toolformer, Gorilla and the [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18). This post digests MCP: tools get a standard plug, so integrations no longer need rewriting per vendor. The slide guide below follows the PDF page numbers, followed by digests of the assigned readings. Examples and self-checks are teaching exercises, not official homework answers; repeated animation frames, logistics and section dividers are grouped together.

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

## Reading | MCP: standard interfaces retain host trust responsibilities

[Required reading; this digest uses version 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)

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

Servers offer three capabilities, each with a controller: Prompts are user-invoked templates, Resources are application-mounted context, and [Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) are model-invoked functions. The ACI from [Lecture 6](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns-en) gets its standard shape here: tool definitions stop being per-vendor dialects. Clients symmetrically offer three back to servers: [Sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling) is server-initiated agentic behavior, with model preferences advisory and the client making the final pick; [Roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots) describe filesystem working scope, restricted to file:// URIs in this version; they do not replace host or operating-system permission enforcement; [Elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation) is structured user input, new in this version, limited to flat primitive schemas and never for sensitive information.

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

## Where it sits in the course

Tools are the first component of the HW1 harness. [Lecture 5](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks-en) then looks at what frameworks abstract away, although HW1 still requires a hand-built harness. MCP only grows in importance: Lecture 8's multi-agent collaboration and Lecture 17's coding agents both divide work over standard interfaces. Remember the specification's stance: MCP defines the format; consent and trust are the implementer's job.

## Course material for this lecture

- Official slides (PDF): [Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)
- Assigned readings: Schick et al., "Toolformer"; Patil et al., "Gorilla"; Model Context Protocol Specification 2025-06-18 (digested here)
- Schedule: [CS329Z site](https://cs329z.stanford.edu/)

## Course video sources

The [official Logistics page](https://cs329z.stanford.edu/logistics.html) states that lecture recordings are accessed by logging into the course Canvas site. This article uses publicly available PDFs and readings; it does not claim to have watched the restricted recordings. The recording-access statement was checked against the official page on 2026-10-23.

## Update log

- 2026-10-29: The series moved from one post per week to one post per lecture. This post now holds Lecture 4 (Mon Oct 5), previously part of the "Week 3: plug tools in, take frameworks apart" guide; earlier entries below predate the split.
- 2026-10-29: Rechecked every section's page range against the Lecture 04/05 PDFs; added the three-level tool-failure taxonomy and τ-bench version history (L04 pp. 64–67), the same-model harness gap and Meta-Harness (L05 pp. 86–88), and the motivation for durable orchestration (L05 pp. 92–93).
- 2026-10-23: Added page-grounded guides for both official lecture PDFs, with mechanisms, examples, checks, and separate assigned-reading digests.
- 2026-10-23: Added an MCP connection diagram and DSPy layer comparison to visualize existing explanations; no factual refresh.
- 2026-10-10: Added direct links to this week's official lecture slides, alongside the existing course video sources and recording access notes.
- 2026-09-29: HW1 was restructured (no more Part A / Part B split, no required DSPy rewrite, corpus is now a corporate email archive); rewrote the affected paragraphs to match.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Logistics page says recordings require logging into the course Canvas, opening the entry confirmed the sign-in wall, and no public recording was found; the status is now sign-in required.

## References

- On this site: [Lecture 3: RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag-en), [Lecture 5: Frameworks & Orchestration](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks-en), [Stanford CS329Z course overview](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Lecture slides: [Tool Use & Function Calling — Lecture 04](https://web.stanford.edu/class/cs329z/slides/lecture04.pdf)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18)
