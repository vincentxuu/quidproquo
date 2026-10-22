---
title: "Product Builder Interview Drill — 2026-10-22: AI Product Design"
date: 2026-10-22
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: en
description: "Practicing Cloudsoft Solutions' 'error cost × reversibility' tiering matrix for deciding when to put a human in the loop, paired with Tcules' eight human-AI collaboration UX patterns, on a design question about whether an AI loan-approval system needs human review — with Anthropic's own Claude Code auto mode as the case study for shipping tiered review for real."
tldr: "'Where should the human-in-the-loop go?' is one of the most common AI product design interview questions, and the easiest one to answer as a slogan. 'Important actions need a human to look at them' sounds right, but interviewers want to see whether you can turn 'important' into an operational rule. Today's drill uses Cloudsoft Solutions' three-tier matrix — error cost × reversibility → oversight level (high-cost irreversible actions need approval before they execute, medium-risk high-volume output can be sampled after the fact, low-risk output just needs exception handling and feedback) — paired with Tcules' eight human-AI collaboration UX patterns. The key point is that an approve button by itself doesn't prove real oversight: automation bias doesn't go away with training or reminders, and Anthropic's own data shows Claude Code users approve 93% of permission prompts — direct evidence of approval fatigue. The practice question is a made-up design prompt about an AI loan-approval system: instead of defaulting to 'review everything' or 'auto-approve everything,' the answer tiers review intensity by error cost and designs how to actually verify review is working, not just track the approval rate. The case study is Anthropic's Claude Code auto mode, published March 2026 — it redesigns 'approve every single action' into a three-tier architecture (a safe-tool allowlist, in-project file operations, and classifier-gated review). The two-stage classifier design cuts the false positive rate from 8.5% to 0.4%, but still misses 17% of real dangerous actions in testing — an honest disclosure that automated review isn't zero risk, it's trading approval fatigue for an acceptable amount of residual risk, which is exactly what's worth imitating in an interview answer."
series:
  name: "Product Builder Interview Daily"
  order: 64
---

> 🌏 [中文版](/posts/daily/2026-10-22-product-builder-interview-daily)

## Today's Focus

"Where should human review go in an AI feature?" is one of the most common AI product design interview questions, and the easiest one to answer as a slogan. Nearly every candidate says "important actions need a human to look at them," but what interviewers actually want to hear is whether you can turn "important" into an operational rule — and whether you know that "a human looked at it" doesn't mean "it was actually reviewed." Today's framework and practice question both train that gap, from slogan to executable design.

## Framework Cheat Sheet

### Framework One: error cost × reversibility → oversight level (Cloudsoft Solutions)

Before deciding where to put human review, don't start with the UI — start by classifying outputs by error cost and reversibility:

| Error cost | Reversible? | Oversight level |
|------------|-------------|------------------|
| High (payments, medical, legal, account closures) | No | Approve before action |
| Medium (high-volume output) | Yes | Sample after action |
| Low | Yes | Exceptions + feedback |

This tiering isn't fixed forever — as evidence accumulates (a category runs error-free over a long window), it can move from "approve before action" down to "sample after action." That the tiering should move with evidence is the detail interviewers use to tell whether a candidate has actually done this work before.

### Framework Two: an approve button doesn't prove oversight (Tcules)

Tcules catalogs eight human-AI collaboration UX patterns (evidence-beside-proposal approval, equal approve/edit/reject outcomes, forcing the reviewer to commit first, risk-based routing, pre-approved scope, stop-and-takeover mid-run, undo windows, override records with a reason) — but the more important point is the research behind them. Automation bias shows up in both experts and novices, and training or reminders don't remove it. Anthropic's own numbers are the best proof: Claude Code users approve 93% of permission prompts. That high approval rate alone can't tell you whether reviewers are being careful or just fatigued — you need separate signals like approval speed, whether approval rates differ across easy and hard cases, and whether a seeded known-bad item in the review queue actually gets caught.

## Today's Practice Question

### The Question

"You're the PM for an AI-assisted loan approval system. For every application, the model produces an approve/reject recommendation and a confidence score. The company currently requires human review on every single case before a loan can be disbursed, and the business team is complaining that review is too slow and is hurting conversion. How would you redesign the review process?"

(Made up, combining Cloudsoft Solutions' "55 AI Product Manager Interview Questions" Q33 — "How do you decide where to put a human in the loop" — with Tcules' catalog of human-AI collaboration UX patterns)

### How to Break It Down

1. **Clarify**: First ask the interviewer whether "review everything" is company policy or a hard requirement from the risk team, and how costly each type of error actually is (an unwarranted approval vs. a wrongful rejection that loses a customer). Surface a hypothesis at the same time: "I'll assume the real question isn't 'should there be human review,' but 'should review intensity be tiered,' since a one-size-fits-all policy usually means risk hasn't actually been classified."
2. **Tier by error cost**: Use the error-cost × reversibility matrix to split cases — large amounts, thin credit files, low model confidence stay in the high-cost, irreversible tier and keep approval before action; small amounts, strong credit history, high model confidence move to "auto-disburse plus sample after the fact," a reversible, low-to-medium-risk tier; cases with middling confidence but small amounts get routed to exception handling, only escalating to a human when the model itself flags uncertainty.
3. **Design the review itself, not just the routing**: The review interface needs to show reviewers the model's actual basis — credit data, similar historical cases, the confidence score — not just an approve/reject button. Per Tcules' research, giving reasons alone can actually increase acceptance of wrong recommendations unless those reasons make verification easier for the reviewer; the goal is lowering the cost of checking, not adding more persuasive text.
4. **Verify review is actually working**: Don't just track the final approval rate. Seed the review queue with known-problem test cases and measure whether they get caught. Compare review time against confidence level to flag reviewers who might be rubber-stamping.
5. **Let the tiering move with evidence**: Agree on a review window (say, three months) and use sampling results to reassess — if a confidence band of small loans stays error-free over the long run, loosen its tier further; if a category's override rate stays persistently high, that's a sign the model is systematically wrong there, and it should go back to model evaluation rather than keep absorbing manual review.

### Sample Answer (how to actually say it in an interview)

> **Reject the one-size-fits-all framing first**: "I wouldn't directly answer 'should everything be reviewed or nothing.' The real question isn't whether a human is reviewing — it's whether review intensity matches risk. I'd tier cases by error cost and reversibility: large amounts, low credit scores, and low model confidence stay in approval-before-action; small amounts with high credit scores and high model confidence move to auto-disburse with sampled review afterward; everything in between goes to exception handling."
>
> **Treat the review interface itself as part of the design**: "Tiering only solves 'who needs to be reviewed,' not 'is review actually happening.' I'd make sure reviewers see the model's actual evidence — credit data, similar historical cases — not a block of model-generated explanation text, because research shows explanation text can make people more likely to accept a wrong recommendation unless it makes verification easier rather than just more persuasive."
>
> **Verify review quality with testing, not the approval rate**: "I'd regularly seed the review queue with known-problem test cases and track the catch rate, instead of just watching the approval rate, because a 93% approval rate could mean reviewers are being careful, or it could mean they're fatigued and rubber-stamping — you can't tell the difference from the rate alone. As evidence accumulates, I'd gradually move confirmed-safe segments from approval-before-action down to sampled review, so human attention goes to the genuinely high-risk cases."

### Self-Check

Use this table to check whether your answer hit the key points:

| Checkpoint | Covered? |
|------------|----------|
| Rejected a one-size-fits-all "review everything" or "auto-approve everything" answer | |
| Tiered by error cost × reversibility instead of judging risk by gut feel | |
| Included the review interface design itself (what evidence reviewers see), not just routing | |
| Designed a way to verify review is actually working, not just tracking the approval rate | |
| Bonus: mentioned that tiering should move dynamically as evidence accumulates | |

## Today's Case Study

**Anthropic's Claude Code auto mode: redesigning "approve every action" into a three-tier architecture**

In March 2026, Anthropic published the design details behind Claude Code auto mode, starting from the exact number cited in Framework Two above — users were approving 93% of permission prompts, producing "approval fatigue." They didn't choose to drop the prompts entirely (removing all protection), nor keep requiring human approval for every action (never solving the fatigue problem). Instead they designed three tiers: a built-in allowlist of tools that can't modify state gets executed directly; in-project file operations (recoverable through version control) also get executed directly; only actions with real downside — shell commands, external network requests, file operations outside the project — go to a third-tier classifier for review. The classifier itself runs in two stages: stage one is a fast, deliberately permissive filter for suspicious actions, and stage two applies full reasoning only to what stage one flags, cutting the overall false positive rate from 8.5% down to 0.4%. Even so, the false negative rate on a real dangerous-action test set is still 17%, and Anthropic says so plainly: "it is not a drop-in replacement for careful human review on high-stakes infrastructure" — it's trading an acceptable amount of residual risk for an end to approval fatigue.

**Interview angle**: use this case directly for any "should an AI feature have human review" or "how do you cut approval fatigue without sacrificing safety" question. It demonstrates how to turn an abstract "tiered review" into an architecture that actually ships (allowlist, auto-approved low-risk actions, classifier-gated review), and how to present the trade-off honestly with real numbers instead of just claiming the system is "safe and convenient."

## Further Reading

- [What are good human-in-the-loop UX patterns?, Tcules](https://www.tcules.com/insights/human-in-the-loop-ux-patterns) — the full source of today's eight patterns in Framework Two, with citations on automation bias and how explanations can increase over-reliance
- [55 AI Product Manager Interview Questions, Answered Practically, Cloudsoft Solutions](https://cloudsoftsol.com/blog/ai-product-manager-interview-questions) — source of today's Framework One error-cost × reversibility matrix (Q33) and the rubber-stamping detection question (Q34), plus 53 more common AI PM interview questions on evaluation sets, cost, and pricing
- [How we built Claude Code auto mode: a safer way to skip permissions, Anthropic](https://www.anthropic.com/research/claude-code-auto-mode) — full technical details behind today's case study, including the classifier architecture, threat model, and the full FPR/FNR numbers

## References

- [What are good human-in-the-loop UX patterns?, Tcules](https://www.tcules.com/insights/human-in-the-loop-ux-patterns) — source for Framework Two and the review-interface design section of today's practice question
- [55 AI Product Manager Interview Questions, Answered Practically, Cloudsoft Solutions](https://cloudsoftsol.com/blog/ai-product-manager-interview-questions) — source for the Framework One matrix and the review-quality verification section of today's practice question
- [How we built Claude Code auto mode: a safer way to skip permissions, Anthropic](https://www.anthropic.com/research/claude-code-auto-mode) — source for today's case study, the Claude Code auto mode three-tier architecture and numbers
