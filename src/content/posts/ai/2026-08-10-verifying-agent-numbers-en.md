---
title: "Before You Cite: I Checked 19 Primary Sources"
date: 2026-08-10
category: ai
type: deep-dive
tags: [ai-agent, research, llm, multi-agent, evaluation]
lang: en
series:
  name: "Agent 生產線"
  order: 6
tldr: "Nineteen primary sources, about forty claims, roughly 70% clearly correct. But the failures have a very consistent shape: caveats fall off, mechanism compresses into conclusion, causation gets supplied, and the story stops where it flatters the argument."
description: "Verifying the numbers commonly cited in agent writing against primary sources: what 15× tokens, Klarna's 2.3M conversations, Google's 75%, Chroma's 95%→60% and METR's 19% actually say, plus the four recurring shapes of citation drift."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-verifying-agent-numbers)

The previous five parts cite a lot of numbers. This one explains how those numbers were checked — and which ones didn't survive.

The method was plain: open the original of every external source a write-up cites and compare the wording. Nineteen primary sources, about forty verifiable claims. Roughly 70% clearly correct, which sounds fine — but **the shape of the failures matters more than the hit rate**, because it is predictable.

## Five numbers not to cite: Anthropic, Klarna, Google, Chroma, METR

| Claim | Verification |
|---|---|
| Multi-agent burns "15× the tokens of a single-agent approach" | ❌ [Anthropic's original](https://www.anthropic.com/engineering/multi-agent-research-system) says agents use about 4× **standard chat interactions** and multi-agent systems about 15× **chats**. Relative to a single agent that is 15 ÷ 4 ≈ **3.75×** — overstated about fourfold. And the sentence sits in a passage arguing that multi-agent is expensive and should be adopted cautiously, so the error points in the direction that strengthens the author's own case |
| Klarna's AI support handled 2.3M conversations in month one | ⚠️ The figure is correct (Feb 2024 press release), but **Klarna's CEO publicly reversed course in May 2025** and began rehiring human agents: "cost seems to have been a too predominant evaluation factor... what you end up having is lower quality." A 2026 article still cites it as a success and never mentions the reversal |
| "AI generates over 75% of new code at Google" | 🔴 **No traceable source.** The publicly available official figures are "over 25%" (Oct 2024) and "over 30%" (Apr 2025). 75% is more than double the highest known public number |
| Chroma: "some models hold 95% accuracy then fall to 60% past a length threshold" | 🔴 Neither "95%" nor "60%" appears anywhere in the 62,000-character original. The study presents those results as charts; the prose has no such figures. It looks eyeballed off a graph |
| "The METR/Anthropic RCT showed experienced developers were 19% slower" | ⚠️ The 19% is right, but two things are wrong: [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study) is an **independent non-profit research organization, not a co-author with Anthropic** (Anthropic's model was one of the tools under test); and the original lists several competing hypotheses and explicitly says the cause is uncertain. "The culprit is under-verified over-reliance" was added by the writer |

Klarna is the one worth pausing on. It differs in kind from the other four — the number is right and the source is right. What's wrong is **where the story stops**. The 2.3M figure is a February 2024 monthly report; a 2026 article uses it to argue an architectural choice works, while omitting that the company itself said in May 2025 that quality had dropped and they had cut too far. The reader comes away with the opposite impression, and cannot detect the problem, because every word is true.

Incidentally, that same passage cites two **failure** cases. Two failures and one success — and the only one whose sequel is omitted is the success.

## Four recurring shapes of drift

These are not unique to one source; they are endemic to technical retelling.

**1. Caveats fall off.** "This is an internal eval." "The 95% CI is [-40%, -2%]." "This is a snapshot of early-2025." "Single agent ≈ 4× chats." All gone. A number stripped of its comparison anchor is the easiest thing to misread, and 15× is exactly what got misread.

**2. Mechanism compresses into conclusion.** Anthropic wrote that three factors explain 95% of performance variance on BrowseComp, with token usage alone explaining 80%. The retelling became "improvement correlates strongly with token usage." The difference is large: the original tells you **why** multi-agent works (it spends more tokens; the collaboration is not magic in itself), while the compressed version hands you a conclusion with no basis for judging whether it applies to your situation.

**3. Causation gets supplied.** METR explicitly says the cause is unknown; the retelling says "the culprit is under-verified over-reliance." That is not summarizing, it is adding.

**4. The story stops where it flatters the argument.** Klarna.

## Two exonerations

Verification does not only catch errors. Two items I had flagged turned out to be unfair.

- **Pinterest's "As of January 2025" appearing in a 2026 article** looked like a botched date. But that sentence is verbatim from **Pinterest's own Medium post**, transcribed accurately, including the caveat that the figures are owner-provided estimates. The suspicious date is Pinterest's problem
- **Codex's state management appearing to reverse** — the March 2026 piece says OpenAI deliberately avoids the server-side state parameter; the July 2026 piece says Codex opens a persistent WebSocket and sends `previous_response_id`. Checking OpenAI's own documentation, the March piece is **faithful line by line**: the official text says Codex does not use `previous_response_id`, primarily to stay fully stateless and support Zero Data Retention. And the constraint is enforced at the API layer — with ZDR enabled, passing that parameter returns an error. **Both pieces describe the product state at the time they were written, and neither is wrong**

The second leaves a useful general rule: **read any agent architecture description together with its publication date.** Four months is enough to invalidate one, and invalidation does not mean the author was wrong.

## Walking up the citation chain usually pays

An unexpected benefit of verification: **three times, following the chain upstream led somewhere better than the retelling.**

1. Anthropic's "token usage alone explains 80% of the variance" — far more useful than "multi-agent scores 90.2% higher"
2. [Cognition's](https://cognition.com/blog/dont-build-multi-agents) April 2026 revision of its own June 2025 position: "the most effective use of multi-agent systems today is to **keep writes single-threaded, with additional agents contributing intelligence rather than actions**." The article citing it came three months *after* that update and still quotes only the original stance
3. UC Berkeley's [MAST paper](https://arxiv.org/abs/2503.13657) — 1,642 annotated execution traces across seven open-source multi-agent frameworks, 14 failure modes, inter-annotator agreement κ = 0.88, and reported failure rates between **41% and 86.7%**. It is the most solid multi-agent dataset I hit anywhere in the corpus, **and it is never cited**

## Three methodology lessons

The last three came from the verification process itself. Nothing to do with agents, but they generalize.

**Extraction tools truncate silently.** My first fetch of the Anthropic piece returned about 20,000 characters, and three key figures were nowhere in it. I nearly concluded the original never contained them. Switching tools and refetching showed the extraction was incomplete and the original had all three. **Any conclusion of the form "the original doesn't say X" first requires proving the extraction was complete.**

**Errors are not uniformly distributed.** I once reasoned that since other numbers in the same piece were wrong, the rest were not worth checking either. When pushed to check anyway, four out of six were entirely correct. That induction does not hold.

**When the list can be enumerated, don't sample.** I once stopped reading the remaining articles on the grounds that "the pattern has repeated." Reading them showed most contained new material and overturned three things I had already written down. **When the list is already assembled and each item costs one fetch, sampling has no justification — if you want to save cost, say you want to save cost, rather than dressing it as a quality judgment.**

## So how should this kind of material be used

As an **index**, not as a **citation source**.

Its value is telling you which primary material to read and giving you a structure to hang things on — which is exactly what the first five parts of this series do. But once you need a specific number, going to the source costs far less than citing it wrong.

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. **Before You Cite: I Checked 19 Primary Sources** (this post)
7. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
8. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Chroma Research — Context Rot](https://research.trychroma.com/context-rot)
- [METR — Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study)
- [Why Do Multi-Agent LLM Systems Fail? (arXiv:2503.13657, UC Berkeley, NeurIPS 2025)](https://arxiv.org/abs/2503.13657)
- [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)
- [Pinterest Engineering — Building an MCP Ecosystem at Pinterest](https://medium.com/pinterest-engineering/building-an-mcp-ecosystem-at-pinterest-d881eb4c16f1)
- [ByteByteGo — Best Practices for Building AI Agents That Work in Production](https://blog.bytebytego.com/p/best-practices-for-building-ai-agents)
- [ByteByteGo — A Practical Guide to Becoming an AI-Native Engineer](https://blog.bytebytego.com/p/a-practical-guide-to-becoming-an)
