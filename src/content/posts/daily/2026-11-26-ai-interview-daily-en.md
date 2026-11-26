---
title: "AI Engineer Interview Daily — 2026-11-26: LLM & Agent Engineering"
date: 2026-11-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: en
description: "Thursday's topic is LLM & Agent Engineering: a real senior AI engineer interview question about what an agent should do when RAG retrieval returns two documents that contradict each other — detect the conflict, score it, then decide whether to rank, cite both sides, decline, or flag a human."
tldr: "Today's core point: conflict detection can't run on a prompt that just tells the model to watch for contradictions. Google's CONFLICTS benchmark found that even the best model scored only 65.3% accuracy on conflict-type classification, and the MAGIC benchmark put the best model's conflict-localization accuracy at 55% against 83.3% for humans. Production systems need three explicit layers — claim comparison, metadata checks (dates, status, region, authority), and conflict scoring — then route by score to ranking, showing both sources, declining gracefully, or flagging the content owner. Raising top-k as a safety margin is a common mistake: it just stuffs more contradictory passages into the same context."
series:
  name: "AI Engineer Interview Daily"
  order: 99
---

> :globe: [中文版](/posts/daily/2026-11-26-ai-interview-daily)

## Today's focus

Thursday is LLM & Agent Engineering day. The last three weeks covered a permission-aware document search agent that knows when to refuse (10/29), designing a tool-calling loop that doesn't spiral out of control (11/05), and figuring out which assumptions still hold when an agent resumes work in a new session (11/19). Today narrows to a failure mode inside retrieval itself that gets underrated: the documents that come back from the retriever disagree with each other. The trap in this question isn't reciting a standard RAG architecture. It's showing that you know the root cause usually sits in how the content is structured, not in the model, and that you know how to catch the conflict before generation, not patch it with a prompt after the answer is already wrong.

## Core concepts

### Retrieved documents contradict each other for four recurring content reasons

Most teams' conflicts aren't a model failure — they're a sign the corpus never gave each fact a single home. Duplicate content is the most common cause: the same return policy lives in the help center, on a product page, and in a PDF onboarding guide, one copy gets updated and the others don't, and a retriever pulling the top chunks by similarity has no reason to prefer either one. Stale versions are the second: the vector index is built by a separate pipeline from the content source, so an edited or deleted document that never gets re-embedded keeps scoring well and lands right next to the current passage. Regional or plan variants are the third: a warranty runs two years in the EU and one in the US, a feature exists on the enterprise plan and not on the growth plan — both statements are true for different audiences, and without a structured field marking scope, the model just sees two conflicting claims. Unclear authority is the fourth: a forum comment, a draft policy, and a published page all mention the same number, and a person knows instantly that the published page wins — the retriever doesn't, unless authority and status travel with the content.

### Detecting a conflict before generation needs three explicit layers, not a model guessing on its own

The first layer is claim comparison: after retrieval, an agent or a lightweight model pulls out the specific claim each passage makes about the same subject — a number, a date, a yes-or-no — and compares them directly. If passage A says 30 days and passage D says 45, the conflict surfaces immediately. This step is cheap when claims are structured values and harder when they're buried in prose. The second layer is metadata checks: two passages with different effective dates usually aren't a contradiction, just a new version replacing an old one; two passages scoped to different regions aren't a contradiction either; a draft shouldn't be competing with a published document at all. None of this works unless metadata actually travels with each passage. The third layer is conflict scoring, which turns detection into a decision: does the disagreement touch what the user actually asked, does one source clearly outrank the other, and are the stakes — price, legal terms, safety — high enough to justify stopping. Answer those three questions and you get a severity score to pass downstream. Asking the model to "watch for contradictions" in a prompt isn't enough — detection has to be an explicit pipeline step, not something left to the model's own judgment.

### Once a conflict is scored, an agent really only has four reasonable next moves

The severity score decides which path to take, and a single answer can use more than one. Ranking by authority and freshness is the default when metadata settles it: the published page beats the draft, the document with the later effective date beats the one it supersedes. This only works when authority is recorded explicitly — teams that leave the model to infer authority from tone or formatting get inconsistent results. Showing both sources fits conflicts that only look like conflicts because each source applies to a different audience: if the agent doesn't know the user's region, the honest answer cites both and asks which one applies; this also works when two equally authoritative sources genuinely disagree and the stakes are moderate, and users accept two cited answers far better than one confident wrong one. Declining gracefully fits high-stakes conflicts the agent can't resolve — say plainly that the documentation is inconsistent on this point and point to someone who can confirm, instead of picking a side by force. Flagging for a person is what actually gets the documents fixed: every high-severity conflict should produce a record of the query, the conflicting passages, their sources, and what the agent did. Without that record, the agent serves, hedges, or declines the same contradiction thousands of times while nobody ever fixes the source. The first three options are a safety net for one conversation; only the fourth makes tomorrow's conflicts rarer.

### Models still lag well behind humans at spotting conflicts, and a bigger model alone doesn't fix that

This is where this question trips people up — plenty of candidates assume a bigger model, or a more carefully worded prompt, will let the model catch the conflict on its own. Google's DRAGged into Conflicts (Cattan et al., arXiv 2506.08500, June 2025) built the CONFLICTS benchmark specifically to test this, and the best-performing model (Gemini 2.5 Flash) scored only 65.3% accuracy on conflict-type classification — meaning it often gets even the type of conflict wrong, before any question of resolving it correctly. MAGIC, from EMNLP 2025 Findings, took a different approach, using a knowledge graph to systematically generate 1,080 inter-passage conflicts, and found the best model's conflict-localization accuracy was only 55%, against 83.3% for humans. Both numbers point at the same conclusion: explicit reasoning prompts do improve model responses, but detection still needs a step the model can be trusted to run, not just an instruction to "think harder about contradictions."

```flow-diagram
{
  "title": "After retrieval hits a conflict: three detection layers, four exits",
  "lang": "en",
  "width": 760,
  "height": 760,
  "nodes": [
    {"id": "retrieve", "label": "Retriever returns\ntop-k candidate passages", "x": 380, "y": 50, "w": 260},
    {"id": "claim", "label": "Claim comparison:\nextract numbers/dates/yes-no claims", "x": 380, "y": 160, "w": 260},
    {"id": "metadata", "label": "Metadata check:\neffective date/status/region/owner", "x": 380, "y": 270, "w": 260},
    {"id": "score", "label": "Conflict scoring:\nrelevance x resolvability x stakes", "x": 380, "y": 380, "w": 260, "tone": "accent"},
    {"id": "rank", "label": "Rank and cite\n(metadata resolves it)", "x": 130, "y": 540, "w": 210},
    {"id": "showboth", "label": "Show both sources\n(regional/plan variant,\nor both authoritative)", "x": 380, "y": 540, "w": 220, "h": 80},
    {"id": "decline", "label": "Decline gracefully\n(high stakes, unresolved)", "x": 630, "y": 540, "w": 210},
    {"id": "flag", "label": "Flag the content owner\nlog it, fix the source", "x": 380, "y": 680, "w": 280, "tone": "accent"}
  ],
  "edges": [
    {"from": "retrieve", "to": "claim", "step": 1, "label": "pull the specific claim each passage makes"},
    {"from": "claim", "to": "metadata", "step": 2, "label": "metadata catches what text comparison misses"},
    {"from": "metadata", "to": "score", "step": 3, "label": "three questions: relevance, resolvability, stakes"},
    {"from": "score", "to": "rank", "step": 4},
    {"from": "score", "to": "showboth", "step": 4},
    {"from": "score", "to": "decline", "step": 4},
    {"from": "rank", "to": "flag", "step": 5},
    {"from": "showboth", "to": "flag", "step": 5},
    {"from": "decline", "to": "flag", "step": 5}
  ],
  "steps": [
    "The retriever returns candidates by similarity — this step only tracks how alike they look, not whether they're correct.",
    "Claim comparison first: extract the specific claim each passage makes about the same subject — a number, a date, a yes-or-no — and compare them directly.",
    "Whatever text comparison misses or misreads, metadata catches: effective dates, publish status, region, content owner.",
    "Turn detection into a score, then branch by score: metadata resolves it, rank and cite; a regional/plan variant or two authoritative sources, show both; high stakes with no rule to resolve it, decline gracefully.",
    "Whichever path it takes, every high-severity conflict gets logged and routed back to the content owner — that's what makes tomorrow's conflicts rarer."
  ],
  "caption": "Simplified: production systems usually run claim extraction and conflict scoring as a separate classifier or structured LLM call, not inside the same call that generates the answer."
}
```

## Today's practice question

### The question

When a retriever pulls back a document that contradicts what the user actually meant (or contradicts another passage already retrieved), what should the system do?

**Source**: dev.to (Manohar Papasani's daily AI interview question series, published 2026-11-22, originally shared on the author's LinkedIn) **Difficulty**: medium-to-hard **Round**: senior AI engineer onsite deep-dive

### How to break it down

1. **Clarify the question first**: "contradicts" could mean two very different things — the retriever matched the wrong sense of the user's intent, or both passages matched correctly but disagree with each other. Ask, or state up front that you'll cover both cases separately.
2. **Frame it correctly**: this is a ranking/failure-mode problem, not a prompt-tuning problem. Embeddings measure semantic similarity, not correctness, and not which version the user actually needs — an outdated policy worded almost identically to the current one can easily outrank it.
3. **Go deep on the mechanism**: explain how the three detection layers divide labor (claim comparison, metadata checks, conflict scoring), then the four exits after scoring (rank, show both, decline, flag), and call out a common mistake — raising top-k as a safety margin just stuffs more contradictory passages into the same context, which raises the odds the model blends the wrong sources together.
4. **Close with something verifiable**: build a labeled set of queries whose top-k is known to contain a misleading document, and track retrieval precision@k and answer faithfulness as separate metrics — not "I changed the prompt and a few examples looked better."

### A sample answer (how to say this out loud)

> **Split the problem into two layers first.** If the retriever matched the wrong sense of the user's intent, the root cause sits upstream of generation — query rewriting, or asking a clarifying question when the ambiguity is real, then retrieving against the clarified query, rather than hoping the generation step guesses correctly. If the retrieved results themselves disagree, that's a different problem: I'd add an explicit detection step before generation, starting with claim comparison to extract the specific claim each passage makes about the same topic, then layering in metadata — effective date, publish status, region, owner — because a lot of "apparent contradictions" are really a new version superseding an old one, or two regions that are each correct, and the metadata resolves them without ever needing to call them a conflict.
>
> **Only genuinely unresolved conflicts go to scoring.** I'd assign a score based on three questions: does this disagreement bear on what the user asked, does one side clearly outrank the other, and how high are the stakes. Low score, rank and cite directly. Moderate score from a regional or plan variant, show both sources with citations and let the user pick. High score with no rule to resolve it, say plainly that the documentation disagrees on this point and point them toward someone who can confirm, rather than betting on one answer. Whichever path it takes, every high-severity conflict gets logged and routed back to the content owner, so the same contradiction gets rarer over time instead of the agent improvising around it every single time.
>
> **The mistake I'd avoid is treating a bigger top-k as a safety margin.** More passages in context just raises the odds of contradictory material, and the odds the model blends the wrong sources together. Worth mentioning here too: Google's CONFLICTS benchmark found even the best-performing model scored only 65.3% accuracy on conflict-type classification, so detection has to be an explicit pipeline step — it can't ride on a single extra line in the prompt telling the model to watch for contradictions.

### Self-check

Use this table to see whether your answer covered the key points:

| Check | Covered? |
|---|---|
| Distinguished "retriever matched the wrong intent" from "two retrieved passages genuinely conflict" | |
| Named all three detection layers — claim comparison, metadata check, conflict scoring — not just "let the model figure it out" | |
| Named at least three of the four post-scoring exits (rank/cite, show both, decline gracefully), not a single fixed response | |
| Called out "raising top-k as a safety margin" as a common mistake and explained why it backfires | |
| Mentioned tracking retrieval precision@k and answer faithfulness as separate offline metrics, not a prompt change judged by feel | |
| Bonus: cited a concrete benchmark number showing models still lag humans at conflict classification/localization | |

## Further reading

- [Conflicting Sources in RAG: How Agents Should Detect and Handle Contradictions Between Documents](https://www.agent-context.org/guides/conflicting-sources-in-rag-how-agents-should-detect-and-handle-contradictions-between-documents) — breaks the problem into four content-level causes, three detection layers, and four decision exits; the main source behind today's four core concepts.
- [DRAGged into Conflicts: Detecting and Addressing Conflicting Sources in Search-Augmented LLMs (arXiv 2506.08500)](https://arxiv.org/abs/2506.08500) — Google's conflict taxonomy and the CONFLICTS benchmark; the most direct read if you want to see exactly how poorly models still do on real conflict types.

## References

- [What happens when the retriever pulls back a document that contradicts what the user actually meant? (dev.to, Manohar Papasani)](https://dev.to/technaom/what-happens-when-the-retriever-pulls-back-a-document-that-contradicts-what-the-user-actually-meant-4eoa) — source of today's practice question and its "strong answer / common mistakes" framing.
- [Conflicting Sources in RAG: How Agents Should Detect and Handle Contradictions Between Documents](https://www.agent-context.org/guides/conflicting-sources-in-rag-how-agents-should-detect-and-handle-contradictions-between-documents) — backs the first three core concepts on conflict causes, the three detection layers, and the four decision exits.
- [DRAGged into Conflicts: Detecting and Addressing Conflicting Sources in Search-Augmented LLMs (arXiv 2506.08500)](https://arxiv.org/abs/2506.08500) — source of the 65.3% conflict-type classification accuracy figure for Gemini 2.5 Flash in the fourth concept.
- [MAGIC: A Multi-Hop and Graph-Based Benchmark for Inter-Context Conflicts in Retrieval-Augmented Generation (EMNLP 2025 Findings)](https://aclanthology.org/2025.findings-emnlp.466/) — source of the 55% model vs. 83.3% human conflict-localization accuracy figures in the fourth concept.
