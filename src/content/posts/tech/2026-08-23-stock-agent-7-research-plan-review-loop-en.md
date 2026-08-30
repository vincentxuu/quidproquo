---
title: "Building a Taiwan Stock Research Agent (Part 7): The Copilot Loop—Plan Contracts, Verifiable Sources, and Human Review"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, human-in-the-loop, research-plan, eval]
lang: en
tldr: "A research request first becomes a ResearchPlan that requires human approval. External documents must be fetched in full, and verbatim quotes must be verified before they can enter a report. Quant review is always append-only, and free-text feedback never flows back into a prompt. This is the complete M5 Copilot loop."
description: "A look inside the stock-research-agent M5 Copilot loop: why plans require approval before spending money, how document sources become verifiable, and why the review loop is append-only and uses only sanitized aggregates."
draft: false
glossary:
  - term: "fail-closed"
    definition: "A design principle that denies access by default when an error occurs or evidence is insufficient."
  - term: "content-addressed"
    definition: "Using a SHA-256 hash of the content as its identifier. Any content change produces a different ID, preventing silent substitution."
  - term: "prompt injection"
    definition: "An attack that hides malicious instructions in text supplied to an LLM, trying to make the model follow those instructions instead of yours."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop)

> **Building a Taiwan Stock Research Agent (Part 7 of 9)**: [Previous: Making Every Number in an LLM Report Auditable](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations-en) ｜ [Next: The Boundary Between Research and Paper Orders—Content-Addressed Execution Contracts](/posts/tech/2026-08-23-stock-agent-8-execution-contracts-en) ｜ [Full table of contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

Parts 1 through 6 covered how to keep hallucinations from contaminating a single research run. Part 7 introduces another dimension: instead of taking a question and running to completion as a black box, the system operates as a **Copilot loop**—research request → plan approval → verifiable sources → backtest validation → human review feedback. M5 has three core rules: approve before spending, verify before evidence enters a report, and sanitize human comments before they enter the system.

## Plan contracts: an unapproved plan does not spend a cent

In many agent projects, the "plan" is just a stretch of self-talk inside a prompt. This project's `ResearchPlan` is a schema-valid structured contract: which tools this run will use, why it will use them, the data period, the estimated LLM budget, and the fallback path if each stage fails.

Two design choices matter most to me:

**1. Routing is deterministic.** Only questions that genuinely need event or news evidence schedule the documents node to search externally. A purely technical question will not call sentiment or fundamental-analysis tools "while it is at it." This avoids the wasteful approach of running everything just to be safe. Every unnecessary tool call adds both cost and another point of failure.

**2. Boundaries fail closed.** Does the plan include external search or an expensive model? Without `--approve-plan`, the boundary rejects it immediately and records the reason in the error channel. A nonexistent tool, an over-budget plan, and an unapproved plan all die the same way: the system refuses the request and leaves a record. "Run it first and sort it out later" does not exist here.

In practice, the command looks like this:

```bash
STOCK_AGENT_NO_LLM=1 uv run stock-agent research 2330 \
  --objective "assess swing risk over the next 20 sessions" \
  --max-cost 0.5 --approve-plan
```

`--max-cost` becomes the plan's budget ceiling. If the plan exceeds it, the plan fails before execution rather than reporting the overrun afterward.

## Verifiable document sources: search results are candidates, not evidence

This may be my favorite part of the design because it directly addresses the two most common lies in "LLM citations":

**Lie one: treating a search snippet as evidence.** A search engine returns a summary only a few dozen words long, yet an LLM can talk as if it read the full page. The rule here is that a snippet is always just a candidate. Before a source can enter a report, the system must fetch it in full and store it as a content-addressed `ResearchDocument`. The SHA-256 hash of its content becomes its identity, so nobody can silently swap the content later. **Failures are recorded too**: if the fetch fails, it fails. The gap remains visible in the report, and the model is not allowed to "fill it in." Being honest about getting nowhere matters even more for a research artifact than it does for a person.

**Lie two: treating document content as trusted input.** Text fetched from the web is always untrusted. Only verbatim-verified quote spans—passages whose positions can be matched against the source text—may enter output visible to the LLM. SSRF and prompt-injection defenses live in the adapter layer, not in a reminder inside the prompt to "be careful."

## The append-only review loop: the quant has the final say, but the quant's words never enter the prompt

A completed research run can be submitted for review:

```bash
uv run stock-agent review runs/2330-<timestamp>.json \
  --reviewer quant --verdict accept --score citation_correctness=1.0
uv run stock-agent reviews <run_id>
```

Several design choices are deliberate:

- **A verdict is limited to accept / revise / reject**, plus reason codes and scores. Review is structured too; it is not a throwaway "looks good."
- **The original report is never overwritten.** Revised versions use `parent_run_id` / `review_id` to create a lineage. The system can replay what changed, who changed it, and why. Append-only storage is a stubborn principle applied consistently from the decision log to the review store.
- **Most importantly, the next research run on the same ticker reads only sanitized aggregates**—statistics such as the verdict distribution and common rejection reasons. Free-text comments written by the quant are **never promoted into a system prompt or instruction**. This rule prevents two disasters: an offhand comment contaminating the behavior of every later research run, and review feedback itself becoming an injection channel.

## Eval harness: regressions cannot hide behind an average score

Human review alone is not enough; the agent needs its own exam. Golden cases expand beyond a simple "did it predict the direction correctly?" into five categories: tool routing, citation validity, number groundedness, failure recovery, and usefulness.

The rule is strict: **the citation, permission, and negative-expected-value invariants must each pass 100% of the time.** This is not a case where passing on average is good enough. A regression in any one of these three is a regression; high scores elsewhere cannot average it away. This follows the same philosophy as the backtest validation in Part 4 and citation guardrails in Part 6: some errors determine eligibility, and eligibility is not a matter of strengths outweighing weaknesses.

## Overall

M5 turns "human-AI collaboration" from a slogan into three contracts: a plan must be approved before it spends money, a source must be verified before it is cited, and feedback must be sanitized before it flows back into the system. The tradeoff is giving up the fluidity of "let the agent do whatever comes to mind." In return, every step can be audited, replayed, and rejected. In research—where being confidently wrong is worse than not knowing—I think that is the right tradeoff.

The next article covers M7. When a research conclusion crosses the line into placing a paper order, the system relies on content-addressed execution contracts, not more prompting.

---

## References

- [stock-research-agent (GitHub)](https://github.com/vincentxuu/stock-research-agent)
- [Architecture: design decisions and trust boundaries](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [PLAN.md: milestones and backlog](https://github.com/vincentxuu/stock-research-agent/blob/main/PLAN.md)
