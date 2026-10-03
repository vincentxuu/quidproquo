---
title: "AI Engineer Interview Daily — 2026-10-04: Weekly Review & Behavioral"
date: 2026-10-04
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: en
description: "This week's behavioral drill: a STAR story about a RAG Q&A system that got PDF table numbers wrong while overall accuracy looked fine, until a table-specific slice revealed the real failure rate — plus a full weekly review with zero gaps, from ML Fundamentals through Paper Reading."
tldr: "Hiring guides list 'Tell me about an LLM feature that failed' as a staple LLM engineering behavioral question. It's not testing whether you can fix a bug — it's testing whether you can find a root cause hidden behind an average metric, quantify the real improvement, and turn the fix into a team-wide check. Today's story: a RAG internal-knowledge Q&A bot got PDF table numbers wrong. Overall accuracy looked fine at 81%, but a dedicated table-question slice showed only 32% accuracy. We review this week's six other days — ML Fundamentals, Deep Learning, ML System Design, LLM & Agent Engineering, Coding, and Paper Reading — all seven days delivered with no gaps."
series:
  name: "AI Engineer Interview Daily"
  order: 46
---

> 🌏 [中文版](/posts/daily/2026-10-04-ai-interview-daily)

## This Week's Behavioral Practice

### Story framework: a RAG Q&A system got PDF table numbers wrong, and overall accuracy didn't show it

2026 hiring guides for LLM engineer roles list "Tell me about an LLM feature that failed" as a fixed behavioral question, and specifically note that a concrete failure story lands better than a flawless narrative — a line like "our retrieval missed tables in PDFs, so we added a table parser and a test set of table questions" is far more convincing than a polished-sounding success story. What this question really tests is whether, when a feature breaks in production, you stop at "the overall metric looks okay" or actively slice the data to find what the average is hiding. Here's a version you can use directly or adapt into your own real experience.

**Situation**: The team built a Slack-based internal knowledge Q&A agent using RAG over company documents — product specs, financial reports, pricing sheets. Two weeks after launch, users started reporting that questions about numbers inside tables (a product's pricing tiers, quarterly revenue breakdowns) were often answered incorrectly or off-topic, while questions about plain text sections stayed accurate.

**Task**: I owned this RAG pipeline and needed to find and fix the issue specific to table questions, without hurting the existing text-question accuracy.

**Action**: I didn't jump straight into the code. I first pulled up overall conversation accuracy — 81%, which looked fine on its own, and if I'd stopped there I'd have concluded there was no real problem. But since every complaint pointed to tables, I sampled two weeks of retrieval logs and pulled every incorrect case to look at what chunks had actually been retrieved. The pattern was clear: in most failures, the retrieved chunks simply didn't contain the correct table data — this was a retrieval-stage problem, not a generation-stage one. Tracing further back into the document-to-text pipeline, I found it used a generic PDF parser that flattened tables into unaligned lines of plain text, and the chunking logic split on a fixed token count with no awareness of semantic boundaries — often splitting a single table across two or three incomplete fragments, so the embeddings no longer matched what users were actually asking about. I split the fix into two parts: add a table-detection step that converts detected table regions into Markdown with preserved row/column structure, and treat each table as one indivisible chunk unit, tagged with page number and table name as metadata. Because table questions were a small fraction of total traffic, any improvement would barely move the overall accuracy number, so I pulled 50 historical user questions that clearly involved table values, hand-labeled the correct answers, and built a dedicated table-question regression set — then ran the old and new pipelines side by side on those 50 before shipping.

**Result**: The new pipeline's accuracy on the 50-question table set jumped from 32% to 89%, while overall conversation accuracy only nudged from 81% to 86% because table questions were a small slice of total traffic — if I'd judged the fix by the overall number alone, I'd likely have concluded it wasn't worth shipping. After this, I added "tables must be kept as indivisible chunks with structure preserved" to the team's document ingestion checklist, so every new document source gets checked for the same issue before it's indexed.

If I'd closed this out after looking only at overall accuracy, the problem would probably still be hiding behind a number that "looked fine." That's now my habit for evaluating any feature change: check whether the metric slice you're looking at is fine-grained enough before deciding whether there's a problem or an improvement — an aggregate average lies easily when the underlying sample isn't evenly distributed.

### How to tell this story

- **Do**: Lead with how you actively doubted an "overall metric looks fine" result and went digging for the root cause — interviewers are checking for a habit of distrusting averages, not how fast you patched a bug.
- **Do**: Anchor every turn with real numbers (81% overall, 32% on the table slice, 89% after the fix, 86% overall) — and explicitly call out that the overall metric barely moved, since that's the detail most candidates skip and the one that carries the most weight.
- **Do**: Explain how you decided whether a low-traffic failure mode deserved its own dedicated test set — that's what signals judgment, not just debugging skill.
- **Don't**: Turn this into a plain debugging play-by-play. The point is "how you noticed the metric was lying to you" and "how you quantified an improvement that was being diluted" — without those two beats, it's just an ordinary bug-fix story.
- **Don't**: Run past two minutes. Hiring guides consistently recommend keeping a STAR story under two minutes, following Situation → Task → Action → Result in order — dragging it out buries your own point.

## Weekly Review

| Day | Topic | What we practiced | Self-check |
|---|---|---|---|
| Mon | ML Fundamentals | Bagging vs boosting (variance vs bias), why too many boosting rounds overfit but random forests don't, how XGBoost's gradient + Hessian second-order approximation and built-in regularization dominate tabular data, standardization vs normalization (choose by algorithm assumptions, not the data), the design motivation behind AdamW | (fill in yourself) |
| Tue | Deep Learning & NLP | Why scaled dot-product attention parallelizes on GPU with a single batched matmul, how multi-head attention splits the embedding dimension into subspaces that each learn different relationships, why positional encoding is information Transformers must add back once they drop recurrence, the locality assumption in CNNs vs the recurrence assumption in RNNs | (fill in yourself) |
| Wed | ML System Design | Data drift and concept drift are two different failure modes requiring different detection and remediation; monitoring needs four layers (feature distribution, prediction distribution, delayed-label performance metrics, business metrics) or you won't catch a broken model until revenue drops | (fill in yourself) |
| Thu | LLM & Agent Engineering | Skipped the usual RAG-vs-agent framework to focus on the three failure modes that break agents once they're actually running — infinite loops, wrong tool selection, malformed parameters — and why `max_turns` alone isn't enough without proper termination conditions | (fill in yourself) |
| Fri | Coding | Skipped the batching scheduler and tokenizer drills from previous weeks, instead hand-implementing a `sample_token` function taking logits, temperature, top_k, and top_p, centered on softmax numerical stability (subtract the max before exponentiating to avoid overflow) | (fill in yourself) |
| Sat | Paper Reading | Deep read of arXiv:2609.37658 "EnterpriseBench" — static QA scores and interactive decision-making performance are two rankings that can't predict each other, no single agent method wins across all tasks and backbones, and LLM-as-judge reliability needs three layers of validation | (fill in yourself) |
| Sun | Behavioral | A RAG Q&A system got PDF table numbers wrong; overall accuracy at 81% hid the problem until a dedicated table slice showed only 32% — practiced turning a metric-masked failure into a quantified improvement via root-cause tracing and a targeted test set | (fill in yourself) |

All seven days this week shipped on schedule — unlike last week, when Wednesday (ML System Design) and Thursday (LLM & Agent Engineering) were skipped. If you're following this series for systematic review, this week gives you a full, gap-free set of all seven topics. Today's behavioral story and Wednesday's "monitoring needs four layers" share the same judgment call: both are about recognizing that a single aggregate metric can lie, and you have to peel back a layer to see the real problem — a habit tested in both system design and behavioral rounds.

## Next Week

The weekly topic rotation stays the same — Monday ML Fundamentals through Sunday Behavioral — but each day's search results and further reading will be fresh. With zero gaps this week, if you want to target a specific weak spot, bump that topic's weight to 2-3 in `src/data/interview-focus.json` so the routine can slot in extra practice on non-scheduled days. For instance, today's story touched on RAG ingestion and chunking design, which echoes Thursday's LLM & Agent Engineering and Friday's Coding content — if that's a weak area, raising the `llm-engineering` weight would be more efficient than drilling it in isolation.

## References

- [LLM interview questions: 25 you'll actually face in 2026 — Consultadd](https://consultadd.com/blog/llm-interview-questions-25-youll-actually-face) — source for this week's story framework: question 24, "Tell me about an LLM feature that failed," uses "retrieval missed tables in PDFs, so we added a table parser and a test set" as its own example
- [Machine Learning Engineer Interview Preparation Guide — Mocklingo](https://mocklingo.com/blogs/machine-learning-engineer-interview-preparation-guide-a-complete-roadmap-for-2026) — source for the advice in "How to tell this story" to keep STAR answers under two minutes and avoid rambling
- [Top Machine Learning Interview Questions and Answers — Simplilearn](https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions) — source for the principle of structuring behavioral answers around a real decision rather than a dramatic narrative
- [Amazon Behavioral Interview Questions (+ answers, method) — IGotAnOffer](https://igotanoffer.com/blogs/tech/amazon-behavioral-interview) — source for the "past behavior predicts future behavior" scoring principle referenced in the Weekly Review, and the need for verifiable specifics in a story
