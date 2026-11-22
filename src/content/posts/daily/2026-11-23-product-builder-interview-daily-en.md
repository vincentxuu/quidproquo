---
title: "Product Builder Interview Daily — 2026-11-23: Product Sense"
date: 2026-11-23
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: en
description: "Product sense practice: use the CIRCLES framework to break down an Instagram Reels cold-start question for users following under 50 accounts, then see how Superhuman's 'how disappointed would you be' survey turned a vague product-market-fit problem into an executable priority."
tldr: "Product sense questions are rarely lost on creativity — they're lost when segmentation stops at a demographic label with no behavioral difference attached. Superhuman asked users 'how disappointed would you be if you could no longer use this product,' listened only to the group that answered 'very disappointed,' and took their product-market-fit score from 22% to 58% in three quarters — the clearest real example of segment, then focus, then verify."
series:
  name: "Product Builder 面試日練"
  order: 96
---

> :globe: [中文版](/posts/daily/2026-11-23-product-builder-interview-daily)

## Today's Topic

Product sense questions ("design a product for X," "how would you improve feature Y") look like a creativity test, but what they're actually scoring is whether you can take an open-ended, fuzzy prompt and collapse it into "this group of people, this pain point, this verifiable metric." Most candidates fail at the same step: segmentation that stops at a demographic label ("busy professionals aged 25-35") with no stated behavioral difference from anyone else. A label like that can't be proven wrong, so the interviewer has nothing to push back on and the conversation stalls. Today's practice is about chaining segmentation, pain-point prioritization, and solution trade-offs into one logic an interviewer can actually challenge and verify.

## Core Frameworks

### CIRCLES: the seven-step skeleton

CIRCLES comes from Lewis C. Lin's *Decode and Conquer* and remains the default skeleton for product design questions at Google, Meta, and Amazon. What hasn't changed in 2026 is the seven steps; what has changed is how much weight each one gets:

| Step | What to do | Common point loss |
|------|---------|-----------|
| **C**omprehend | Ask one clarifying question that would genuinely change your answer — not a question for its own sake | Asking "who's the target user?" when the prompt already said "for commuters" |
| **I**dentify the customer | List user segments, pick one, and explain why | A demographic label with no concrete behavior or context attached |
| **R**eport customer needs | State the underlying job the user is actually trying to do, not the feature they're asking for | Stopping at "users want better recommendations" without digging one layer deeper |
| **C**ut via prioritization | Rank pain points on frequency, severity, and alignment with the business goal | Listing several pain points without saying which one wins and why |
| **L**ist solutions | 2-3 meaningfully different options (a quick win, a core bet, a long-horizon idea) — not eight incremental variants | A pile of minor tweaks that signal no real judgment |
| **E**valuate tradeoffs | In 2026 the weight has shifted to whether users will pay for this or change a habit — not technical feasibility | Spending three minutes on engineering complexity and thirty seconds on retention and willingness to pay |
| **S**ummarize | One recommendation plus one metric specific enough to tell "it worked" from "people tried it once" | Forgetting to tie the recommendation back to the business goal from step one |

### Segment with arithmetic, not just categories

Listing segments by category carries almost no signal — nearly every candidate does that. What actually differentiates you is proving the segment is worth pursuing: multiply the segment's size by its current usage frequency and the gap you believe you can close, to get the additional usage this segment could generate. Then check two things — how much of total company-wide growth that represents, and how large a percentage change it is relative to that segment's current baseline. A smaller segment with a bigger percentage change is often the better bet than a bigger segment with a smaller percentage change, because the first is a change you can actually observe, while the second gets buried in seasonal noise.

## Today's Practice Question

### The question

"Instagram Reels' recommendation algorithm relies heavily on a user's follow graph for personalization. For users who follow fewer than 50 accounts — new or light users — that signal is too sparse, so they keep seeing repetitive or irrelevant content. How would you improve the Reels discovery experience for this group?"

(Source: adapted from a cold-start algorithm scenario in PM Streak's 2026 product sense question bank; this "new-user cold start" pattern is a common variant in Meta- and ByteDance-style product interviews.)

### How to break it down

1. **Scope the problem**: First ask whether we're optimizing this group's *retention* or the *delight of their first experience* — the two goals point to very different solutions (retention needs a sustained behavior change; delight can come from a single strong content hit).
2. **Define the user more precisely**: Don't stop at "new users." Cut again: among people who follow under 50 accounts, separate those who've actively searched for interest-based content from those who are purely passive browsers who've never searched at all — the latter is the subgroup with the sparsest algorithmic signal and the real cold-start problem.
3. **Translate the problem into a job**: Using CIRCLES' "report needs" step, reframe "the algorithm lacks signal" into user language: this group doesn't need "better recommendations" — they need a reason to stay before the system has learned anything about them yet.
4. **Propose solutions with real contrast**: At least two meaningfully different options — (a) a quick win: add five lightweight interest-selection questions at sign-up, and weight the first two weeks toward exploration rather than the follow graph; (b) a core bet: build a temporary interest vector in real time from first-session dwell time and swipe-away behavior, substituting for the follow-graph signal until a user crosses the 50-follow threshold.
5. **Define success**: The primary metric is 7-day retention and average session watch time for this cohort; guardrails are the swipe-away rate and whether recommendation quality drops off sharply once a user crosses the 50-follow threshold.

### Sample answer (how to actually say this in the interview)

> **Scope before segmenting.** For this one I'd first confirm whether we care about this light-user cohort's 7-day retention or the delight of a single session — that decision shapes how I cut the segment. Assuming it's retention, I'd split "follows under 50" into two groups: people who've actively searched for interest-based content, and people who are purely passive and have never searched at all. The second group is the real cold-start problem, because the algorithm has no baseline interest signal to work with at all.
>
> **State the need as a job, not a feature.** This group doesn't need "better recommendations" — that's too surface-level. What they actually need is a reason to stay before the system has learned anything about them yet. In other words, the exploration experience itself has to deliver instant payoff; it can't wait for the algorithm to figure out who they are.
>
> **Solutions and the trade-off.** I'd propose two directions. The quick win is adding a handful of lightweight interest-selection questions at sign-up and shifting recommendation weighting from follow-graph-first to exploration-first for the first two weeks. The core bet is building a temporary interest vector in real time from first-session dwell time and swipe-away behavior, to stand in for the sparse follow-graph signal until the user crosses the threshold. I'd ship the quick win first to validate the hypothesis cheaply and fast, before committing to the heavier engineering lift of the core bet. The primary metric is this cohort's 7-day retention; the guardrail is swipe-away rate, to make sure we're not trading long-term content fatigue for short-term delight.

### Self-check

Use this table to make sure your answer didn't skip anything:

| Check | Covered? |
|---------|---------|
| Segmentation cuts on behavior, not just a demographic label | |
| The need is stated as a job, not a jump straight to a feature | |
| At least 2 meaningfully different solutions (not minor variants of the same one) | |
| Clear on which to build first and why (the trade-off logic) | |
| Both a primary metric and a guardrail metric are defined | |
| Bonus: the solution ties back to the business goal set at the start | |

## Today's Case

**Superhuman: one survey question took its product-market-fit score from 22% to 58%**

In 2017, Superhuman founder Rahul Vohra realized the company hadn't found product-market fit, but didn't know which direction to push. He borrowed Sean Ellis's leading indicator — asking users "how disappointed would you be if you could no longer use this product?" — and used the share answering "very disappointed" against Ellis's 40% benchmark. Superhuman started at 22%. The decisive move wasn't the survey itself, but what came next: Vohra looked only at how the "very disappointed" group answered "who do you think benefits most from this product?" and "what's the main benefit you get from it?" — and deliberately ignored the "not disappointed" group's feedback, because that group tends to voice the loudest requests you should least act on. That segmentation surfaced that the "very disappointed" users cared most about speed, and that "somewhat disappointed" users who also cared about speed were held back by one specific thing: no mobile app. A feature that had been ranked low on gut feel suddenly became the top priority. Three quarters later, the score had gone from 22% to 58%.

**Interview angle**: this case is ready-made material for follow-up questions like "how would you use data to validate a segmentation hypothesis" or "how do you decide which requests to cut." The core argument: segmentation isn't listing every possible user type — it's using one signal (here, "how disappointed") to cut the population, and then deliberately ignoring the loudest slice of it.

## Further Reading

- [CIRCLES framework: full worked example for PM interviews](https://productinterview.com/frameworks/circles/) — a step-by-step walkthrough of where to spend time within each CIRCLES step in 2026
- [Product sense, without the generic answer](https://channelpulse.us/tutorials/product/the-method/product-sense) — turns "segmentation" from a list of categories into an arithmetic argument you can actually defend (Reach × Gap)
- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/) — the full original write-up behind today's case, including the survey design and each round of segmentation

## References

- [CIRCLES framework: full worked example for PM interviews](https://productinterview.com/frameworks/circles/) — supports the CIRCLES table in "Core Frameworks"
- [Product sense, without the generic answer](https://channelpulse.us/tutorials/product/the-method/product-sense) — supports the segmentation-arithmetic section in "Core Frameworks"
- [How Superhuman Built an Engine to Find Product Market Fit](https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/) — supports "Today's Case" on Superhuman's segmentation and product-market-fit score
- [PM Product Sense Examples (2026) — 10 Questions With Sample Answers](https://learnanything.pro/pm-product-sense-examples) — background for the cold-start question pattern used in "Today's Practice Question"
