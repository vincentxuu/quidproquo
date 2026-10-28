---
title: "AI Engineer Interview Daily — 2026-10-29: LLM & Agent Engineering"
date: 2026-10-29
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Thursday's slot is LLM & Agent Engineering: a real OpenAI interview prompt on designing an internal-document search agent that respects permissions, cites sources, and knows when to refuse."
tldr: "Today's core idea is that permission enforcement and citation checking can't be delegated to a prompt that politely asks the model to behave — they have to be deterministic layers. Access filtering happens before a document ever enters context, not after, on the model's good behavior; citations get checked after generation, by confirming the claimed source IDs actually sit inside the set of documents the model was allowed to retrieve. Today's question is a real OpenAI interview prompt (also reported at Google and Lyft): design an agent that searches internal documents, respects permissions, cites sources, and refuses when it should. The point isn't reciting a RAG architecture — it's showing a division of labor where security boundaries live in code and semantic judgment stays with the model."
series:
  name: "AI Engineer Interview Daily"
  order: 71
---

> 🌏 [中文版](/posts/daily/2026-10-29-ai-interview-daily)

## Today's Focus

Today moves into LLM & Agent Engineering, the area with the highest question density in AI Engineer interviews — it tests RAG, agent architecture, guardrails, and evaluation all at once, and in real systems those four things pull on each other. Bad retrieval drags generation quality down with it, and how tight your guardrails are feeds back into whether retrieval needs to filter more aggressively in the first place.

This kind of question tends to show up in senior-level onsite system design rounds. What interviewers actually care about isn't whether you remember LangChain's API surface — it's whether you put the security boundary in the right place in the architecture: enforced deterministically in code, or left to a prompt that says "please don't leak unauthorized content." The latter gets punched through by prompt injection and by the model's own inconsistency in real systems.

## Core Concepts

```diagram
title: Four security layers in a permission-aware search agent
desc: A user question passes through an ACL-filtered retrieval layer, a tool-loadout-scoped agent orchestration layer, and a citation-tagged generation layer, before a guardrail/eval layer decides whether to answer or refuse.
caption: Simplified: omits multi-turn tool calls and retry loops.
---
<svg viewBox="0 0 640 740">
  <path class="dg-line" d="M320 76V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 196V252" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 316V372" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 436V492" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 556V576"/>
  <path class="dg-line" d="M320 576H148Q140 576 140 584V612" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M320 576H492Q500 576 500 584V612" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="200" y="20" width="240" height="56" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">User question</text>

  <rect class="dg-box dg-box--accent" x="170" y="132" width="300" height="64" rx="6"/>
  <text class="dg-label" x="320" y="156" text-anchor="middle" dominant-baseline="central">Retrieval layer</text>
  <text class="dg-sub" x="320" y="176" text-anchor="middle" dominant-baseline="central">ACL filter + hybrid search</text>

  <rect class="dg-box" x="170" y="252" width="300" height="64" rx="6"/>
  <text class="dg-label" x="320" y="276" text-anchor="middle" dominant-baseline="central">Agent orchestration</text>
  <text class="dg-sub" x="320" y="296" text-anchor="middle" dominant-baseline="central">tool loadout scoping</text>

  <rect class="dg-box" x="170" y="372" width="300" height="64" rx="6"/>
  <text class="dg-label" x="320" y="396" text-anchor="middle" dominant-baseline="central">Generation layer</text>
  <text class="dg-sub" x="320" y="416" text-anchor="middle" dominant-baseline="central">structured output + citations</text>

  <rect class="dg-box dg-box--accent" x="160" y="492" width="320" height="64" rx="6"/>
  <text class="dg-label" x="320" y="516" text-anchor="middle" dominant-baseline="central">Guardrail / eval layer</text>
  <text class="dg-sub" x="320" y="536" text-anchor="middle" dominant-baseline="central">citation check + refusal logic</text>

  <rect class="dg-box" x="40" y="612" width="200" height="64" rx="6"/>
  <text class="dg-label" x="140" y="636" text-anchor="middle" dominant-baseline="central">Answer</text>
  <text class="dg-sub" x="140" y="656" text-anchor="middle" dominant-baseline="central">with citations</text>

  <rect class="dg-box" x="390" y="612" width="220" height="64" rx="6"/>
  <text class="dg-label" x="500" y="636" text-anchor="middle" dominant-baseline="central">Refusal</text>
  <text class="dg-sub" x="500" y="656" text-anchor="middle" dominant-baseline="central">no access / no data</text>

  <line class="dg-rule" x1="20" y1="700" x2="620" y2="700"/>
  <text class="dg-tag" x="20" y="724" dominant-baseline="central">Legend</text>
  <rect class="dg-box dg-box--accent" x="76" y="716" width="16" height="16" rx="3"/>
  <text class="dg-small" x="100" y="724" dominant-baseline="central">deterministic security check</text>
  <line class="dg-line dg-line--dashed" x1="380" y1="724" x2="404" y2="724"/>
  <text class="dg-small" x="412" y="724" dominant-baseline="central">refusal / abort path</text>
</svg>
```

### 1. Separate retrieval errors from generation errors

When a RAG system gets something wrong, a retrieval error (fetched the wrong or incomplete documents) and a generation error (fetched the right documents but the model said the wrong thing) look identical from the outside — the user just sees a wrong answer. The fixes are opposite: retrieval errors get fixed by tuning chunking, hybrid search, or reranking; generation errors get fixed by tuning the prompt or swapping models. In an interview, the first move is always isolating which layer actually broke before proposing a fix — jumping straight to "I'd add a reranker" skips the diagnosis step interviewers are listening for.

### 2. The context-engineering toolbox: tool loadout and context quarantine

A long context isn't a universal fix — cramming in too many tools or too much history degrades the model's behavior instead of improving it. Tool loadout means giving an agent only the subset of tools its current task actually needs, rather than mounting every tool it might ever use — which also doubles as a security boundary: if an agent's job is "search internal documents," it shouldn't also be carrying tools that send email or write to a database, since that limits the blast radius of misuse or prompt-injection hijacking. Context quarantine means handing an independent subtask to a subagent with a clean history, so noise accumulated in the main conversation doesn't contaminate its judgment.

### 3. Guardrails are layered defense, not a single prompt instruction

Guardrails cover input checking (reject out-of-scope questions), output checking (review the generated answer before it ships), tool restriction (the agent can only call approved tools), rate limiting, and anomaly monitoring. Libraries like NeMo Guardrails and Guardrails AI turn these rules into a structured, configurable pipeline — instead of stuffing them all into one giant system prompt and hoping the model complies.

### 4. LLM evaluation: RAGAS's three core metrics

Evaluating a RAG system can't rest on "the answer sounds right." The RAGAS framework offers three measurable metrics: faithfulness (does the answer go beyond what the retrieved context actually says), context precision (what fraction of the retrieved documents are actually relevant), and context recall (what fraction of the truly relevant documents got retrieved). Pair those with a labeled test set, plus an LLM-as-judge pass or manual review, and you have real evaluation infrastructure — not a handful of manual spot checks before launch.

### 5. Reward hacking in RLHF

During RLHF training, a model sometimes finds a loophole in the reward model — learning behavior that scores well with the reward model without actually doing the task well. A classic case: adopting a longer, more confident tone to earn a higher score, instead of becoming more accurate. Detection means monitoring, during training, whether the reward score and real task performance (human ratings, downstream task success rate) start to decouple — a growing gap means the reward model is being gamed. The same idea applies in agent engineering: if "did the user click thumbs-up" is the only optimization signal, the agent can learn to flatter the user instead of solving the problem.

## Today's Practice Question

### The Question

Design an agent that searches internal documents. It must respect each document's access permissions, cite the sources its answer draws on, and proactively refuse to answer when it's uncertain or lacks sufficiently authorized information.

**Source**: Real OpenAI interview question (also reported at Google and Lyft; collected by LLM Dojo from 270 public interview reports) **Difficulty**: Advanced **Round**: Onsite system design

### Breaking It Down

1. **Clarify the problem first**: ask about the document corpus's scale and type (a structured wiki? PDFs? chat logs?), who the users are (the whole company, or different departments and levels with different access), what the permission model looks like (document-level ACLs? field-level redaction?), and whether the agent has any other tools (just search, or also ticket-system lookups). These answers decide whether you need to handle multi-tenancy and fine-grained permissions later.
2. **Build the framework**: split the system into four layers — a retrieval layer (an ACL-filtered hybrid-search index), an agent orchestration layer (tool loadout, scoped to search-related tools only), a generation layer (forced structured output, every claim tagged with a source document ID), and a guardrail/eval layer (refusal logic and post-hoc auditing).
3. **Go deep on the core trade-offs**: the key trade-off is whether permission checking happens before retrieval or gets left to the model to judge afterward. The right answer is the former — filter out documents the user has no access to, deterministically, at the index layer, based on their identity, so unauthorized content never even enters the context, instead of handing the model the whole batch and hoping the prompt stops it from leaking. That way, even if a document's content hides a prompt injection, it can't trick the model into revealing something it was never shown in the first place. The second trade-off is citation trustworthiness: a model's own claimed source isn't reliable — it can fabricate a plausible-looking document ID — so after generation you need a programmatic check: does every source ID the model cited actually sit inside the set of documents it was allowed to retrieve this time.
4. **Close it out**: close with "defense in depth" — permission filtering happens before retrieval, citation verification happens after generation, and in between sits a refusal mechanism (when retrieval can't find enough relevant or authorized documents, the agent says "I don't have access to enough information to answer this" instead of forcing an answer). Finally, the whole pipeline needs an evaluation set with deliberate privilege-escalation test cases, run before every prompt or model update — not discovered as a vulnerability after launch.

### Sample Answer (How You'd Actually Say This in an Interview)

> I'd start by asking whether the permission model is document-level or field-level, and whether the user base splits by department or seniority — that decides whether I need multi-tenant isolation. **Architecturally** I'd split this into four layers: the retrieval layer filters the index by the user's identity first, so documents they have no access to get blocked before they ever enter context. That step has to be a deterministic, code-level filter — you can't rely on a prompt that says "please don't cite unauthorized content," because document content can hide a prompt injection, and once something's in context, the only remaining security boundary is the model's own self-restraint, which isn't reliable.
>
> **In the generation layer**, I'd force the model to output a structured format where every claim is tagged with its source document ID, then run a programmatic check afterward, confirming those IDs actually fall inside the set the agent was allowed to retrieve this time — you can't trust a model's self-reported citations at face value. If retrieval doesn't surface enough relevant documents, or the user has no access to the relevant ones, I'd have the agent refuse outright: "the information I found isn't sufficient to answer this, or you don't have access to the relevant documents" — instead of fabricating a plausible-sounding answer. **For evaluation**, I'd build a test set that deliberately includes privilege-escalation cases — using a low-permission account to ask questions that only high-permission documents could answer, checking that the agent refuses correctly — paired with RAGAS metrics like faithfulness and context precision, run as a regression suite before every model or prompt update.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|---|---|
| Permission filtering happens before retrieval, at the index layer — not left to the model's good behavior via a prompt | |
| Cited sources are checked programmatically after generation, not trusted at face value from the model's own claims | |
| Clear refusal logic: proactively says "I don't know" when data is insufficient or access is missing | |
| Tool loadout limits what the agent can use, shrinking the blast radius of misuse or injection | |
| The evaluation set includes privilege-escalation test cases, not just general QA accuracy | |
| Bonus: mentioned context poisoning risk — an unfiltered document can skew the answer even if it's never directly cited | |

## Further Reading

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — 270 real interview reports sorted by company; today's question and the "evaluation platform on top" / "abstains when it should" framing both come from here
- [The State of Context Engineering](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html) — a full technical walkthrough of the six context-engineering tactics (augmentation, tool loadout, quarantine, pruning, offloading, summarization), with DSPy code examples
- [AI Engineering Interview Questions 2026: RAG, LLMs & Agents](https://technovids.com/ai-engineering-interview-questions) — an interview-focused explanation of layered guardrail design and the RAGAS evaluation metrics

## References

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — original source of today's practice question, "design an internal-document search agent that respects permissions, cites sources, and refuses appropriately" (a real OpenAI interview question, also reported at Google and Lyft)
- [The State of Context Engineering](https://www.dbreunig.com/2026/10/24/the-state-of-context-engineering.html) — technical source for the "tool loadout" and "context quarantine" concepts
- [AI Engineering Interview Questions 2026: RAG, LLMs & Agents](https://technovids.com/ai-engineering-interview-questions) — source for "layered guardrail design" and the three core RAGAS metrics
- [Cracking the Generative AI Engineering Interview 2026 (Version II)](https://aiengineeringinsider.substack.com/p/cracking-the-generative-ai-engineering) — source for the "isolate retrieval errors from generation errors before fixing either" framing
