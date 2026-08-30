---
title: "Building a Taiwan Stock Research Agent (Part 6): Making Every Number in an LLM Report Auditable"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, llm, hallucination, evidence-manifest, opencc, eval]
lang: en
tldr: "Numbers are the easiest part of an LLM report to hallucinate. I therefore put every trusted number into a SHA-256-addressed evidence manifest and let the LLM cite only {{fact.id}} placeholders. If it writes a bare number, the entire output is discarded and replaced with a deterministic template."
description: "How stock-research-agent uses an engineered evidence snapshot and citation guard to trace every number in a research report back to its source field, with zero tolerance for violations."
draft: false
glossary:
  - term: "content-addressing"
    definition: "Using a SHA-256 hash of content as its identifier. If the content changes, its ID changes, making silent substitution detectable."
  - term: "sha-256"
    definition: "A cryptographic hash function that compresses arbitrary data into a fixed-length fingerprint, commonly used to verify integrity."
  - term: "opencc"
    definition: "An open-source Chinese conversion tool. Here, its s2twp configuration converts Simplified Chinese characters and Mainland Chinese terms into Traditional Chinese as used in Taiwan."
  - term: "fail-closed"
    definition: "Rejecting by default when validation does not pass, rather than allowing by default."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations)

> **Building a Taiwan Stock Research Agent (Part 6 of 9)**: [Previous: Walk-Forward Evaluation, Run Cards, and an Honest 50% Baseline](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval-en) ｜ [Next: The Copilot Loop—Plan Contracts, Verifiable Sources, and Human Review](/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop-en) ｜ [Full table of contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

This article covers something I initially thought was minor, then realized formed the foundation of the entire system’s credibility: **where the numbers in a research report come from**. By the end, you will understand why I do not let the LLM type Arabic numerals into a report at all, what it means for the citation guard to discard the entire LLM prose output, and why this guard guarantees only that numbers are auditable—not that their interpretation is correct.

## The Problem: The Worst LLM Hallucinations Are Not Opinions but Numbers

When building a research agent, I am less afraid of the LLM choosing the wrong direction; human review can catch that. What scares me is the model turning “foreign institutional investors bought for three consecutive days” into “foreign institutional investors bought **12,458 lots** over three consecutive days,” or casually changing an f-score of **7** into **8**. Readers may question incorrect qualitative language. They will copy an incorrect number directly into their notes, making me an accomplice to a numerical hallucination.

LLMs have another bad habit: disguising qualitative modifiers as false precision. “Rose sharply” becomes a percentage the model invented. Prompt engineering cannot solve this. Tell the model “do not make up numbers,” and it still will, because generating a number and generating an adjective are both probabilistic token-generation actions.

My conclusion is blunt: **the LLM has no right to write numbers at all**. It may only cite them.

## Evidence Manifest: Decide What Deserves to Be Called a Trusted Fact First

The solution has two halves. Before synthesis, program code—not an LLM—collects **trusted structured scalars** from technical, sentiment, fundamental, chips, events, backtest, reflection, decision, and price-policy sources, then builds a canonical evidence manifest:

```
技術面 score          ──┐
法人籌碼數字            │
事件清單                ├──▶ canonical evidence manifest
回測 trades/win rate    │    （每個 fact: 穩定 ID + 來源欄位 + 顯示值 + 分類）
ATR 停損停利            ──┘            │
                                       ▼
                       manifest 與各來源各算一份 SHA-256
```

Every fact has a stable ID, source field, display value, and category. Both the complete manifest and **each source’s content independently** receive a SHA-256 hash. Anyone who later obtains the manifest can verify cryptographically that “this set of numbers” and “that technical-analysis snapshot” are the same content and were not altered.

The inverse boundary—what does **not** enter trusted facts—is just as important: post snippets, upstream error notes, technical free-text details, and decision reasons. These are text, and text is where an LLM is most likely to cite carelessly. The model may receive them as context, but they do not qualify as citable numbers. Drawing the line at structured scalars keeps everything downstream clean.

## Citation Guard: `{{fact.id}}`, and One Bare Number Discards the Entire Output

The synthesis rule given to the LLM is simple: **it may output only placeholders in the form `{{fact.id}}`**. It may not write Arabic numerals, Chinese numerical expressions—even phrases such as “thirty percent” or “many” count—and it may not cite an ID that does not exist.

That may sound like an honor system, but the guard is absolute. The output guard validates the entire prose response. **Any single violation discards all of the LLM prose and falls back to a deterministic rule-based template.** The violation reason is recorded in `ReportValidation` and returned with both the artifact and the API response. The system does not patch the output and keep using it; the entire LLM result becomes invalid. Zero tolerance is the only meaningful policy. Once “just fix it” becomes an option, the guard becomes a probability instead of a guarantee.

Even after validation passes, the LLM does not fill the placeholders itself. **The program expands the numbers atomically** by replacing `{{fact.id}}` with the display value from the manifest and attaching the fact ID. The LLM never touches the actual bytes of the numbers. In the finished report, every number can identify the fact it came from.

The README summarizes this in one line: “Number citation stays out of the LLM.” It is my favorite line in the entire project.

## State the Boundary Clearly: What This Guard Does **Not** Guarantee

The repository documentation says this explicitly, and it bears repeating here. The citation guard guarantees that the origin of numbers **in an accepted report is auditable**. It does **not** guarantee that the model’s interpretation of qualitative meaning or causality is correct.

In other words, suppose a foreign-investor-positioning fact has the correct display value and the model cites the correct ID. The guard passes it. But if the model interprets “foreign investors bought for consecutive sessions” as “the trend will reverse upward,” that interpretation may still be wrong. Honest numbers do not imply a correct conclusion. This boundary matters to readers, and it matters to me: the guard must not be marketed as proof that “the report cannot be wrong.”

Because interpretation can still be wrong, the review loop in Part 7 and the evaluation gates in Part 8 must follow it.

## Reason in English, Output Traditional Chinese, Then Force OpenCC to Finish the Job

Another small decision with a large effect on quality is that synthesis **reasons internally in English**. The practical reason is that English reasoning is better at the same cost. The output, however, must be a Traditional Chinese summary that includes the required counterargument.

After the LLM runs, the system first performs citation validation and **then** applies OpenCC `s2twp` post-processing to convert any Simplified Chinese characters or Mainland Chinese terms that slipped through into Traditional Chinese as used in Taiwan. Simplified-Chinese drift is not an aesthetic issue. It is a consistency issue: once readers encounter wording that feels imported from another locale, they begin to question where the entire report came from.

The key design property is that **the bytes of ASCII numbers and fact placeholders remain unchanged after OpenCC**. OpenCC changes only Chinese characters, so it cannot disturb a citation that has already passed validation. The pipeline order is fixed: secure the numbers first, then clean up the language. Reversing the order would create a path around the guard.

## It Is Only One of Eight Gates

The citation gate sounds strict, but by itself it is only **the first of eight hard gates** in the evaluation gate covered in Part 8. The other seven are PIT, OOS, cost, sample size, drawdown, replayability, and code policy. A deterministic evaluator judges all eight and fails closed: insufficient evidence is always `False`. Neither the LLM nor a human reviewer can change a failure to a pass. The only valid path is to fix the problem and rerun the evaluation.

This reflects the theme of the entire series. The agent does not “let the LLM improvise and then pray.” It locks down the trust boundary in code, layer by layer, leaving the LLM responsible only for the small part it genuinely does well: organizing language.

## Overall

The lesson from this citation guard is more specific than “how to prevent hallucinations”: **never trust a probabilistic system to follow a natural-language rule consistently**. If you do not want an LLM to write bare numbers, the only reliable approach is to make writing bare numbers structurally meaningless. Once the program owns the placeholders, an invented number has no path into the report.

The cost is real. Discarding the entire output after one violation means the final report is often written by a rule-based template rather than the LLM. That is not a failure; it is the design. I would rather have a plain report than one that sounds intelligent but contains a fabricated number. Readers’ trust in numbers cannot depend on the model getting lucky.

---

## References

- [vincentxuu/stock-research-agent — README](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — evidence snapshots and the number-citation guard](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [OpenCC, an open-source Chinese conversion tool](https://github.com/BYVoid/OpenCC)
