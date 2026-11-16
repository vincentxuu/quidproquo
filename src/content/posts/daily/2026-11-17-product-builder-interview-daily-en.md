---
title: "Product Builder Interview Daily — 2026-11-17: Metrics & Analytics"
date: 2026-11-17
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: en
description: "Metrics & Analytics practice: use the GAME and DEC frameworks to break down a real A/B test readout — a pooled result that looks significant but only holds up in week one — then see how Facebook found its activation metric with '7 friends in 10 days.'"
tldr: "The core move today is splitting a significant-looking A/B test result into time segments before trusting it, and checking whether a guardrail metric broke. The practice question is a trial-activation test whose pooled lift disappears when split by week, and the case is how Facebook found its activation metric with '7 friends in 10 days.'"
series:
  name: "Product Builder 面試日練"
  order: 90
---

> 🌏 [中文版](/posts/daily/2026-11-17-product-builder-interview-daily)

## Today's Focus

The Metrics & Analytics round doesn't test how many metric names you can recite — it tests whether you can break a vague numbers question into sub-questions that can actually be verified. Interviewers lean on two question types: defining a metric for a product, and explaining why a metric moved. The two call for different muscles. The first tests whether you can distill a precise metric out of user behavior; the second tests whether you can root-cause a change with an exhaustive framework when you don't yet have full information. Today we'll run through the GAME and DEC frameworks, then work through a real A/B test readout question that showed up in a data product manager interview — practicing the trap that's easiest to miss: a number that looks significant can still be a false signal.

## Framework Cheat Sheet

Two frameworks cover the two most common Metrics & Analytics questions: GAME for "define a metric for this product," DEC for "this metric changed, why."

**GAME — metric definition questions**

| Step | What to do |
|---|---|
| Goals | Align with the interviewer on whether this is a user goal or a business goal first — don't assume |
| Actions | List every action a user can take in the product, then narrow to the 2-3 most relevant to the goal, before defining any numbers |
| Metrics | Turn the chosen actions into precisely measurable metrics, naming the denominator explicitly (e.g. "comments per thousand sessions," not just "comments") |
| Evaluations | After stating the metric, proactively name its limits and trade-offs — don't wait for the interviewer to ask |

**DEC — metric change questions**

1. **Define**: Pin down the metric's exact definition, the time window of the change, and the affected user segment before listing any causes
2. **Explore**: Sort possible causes into a mutually exclusive, collectively exhaustive (MECE) split — internal vs. external is the standard one — then check each branch with the interviewer for signal
3. **Conclude**: Converge on the most likely root cause, explain how the other candidates were ruled out, and state the next action

The shared principle behind both frameworks: clarify the boundaries of the question before you start analyzing. That's the baseline every Metrics question is really grading.

## Today's Practice Question

### The Question

You're a PM at a B2B SaaS company. The team redesigned the trial signup page to lift trial activation. The A/B test ran for two weeks, roughly 52,000 visitors in each arm:

| Segment | Control | Treatment |
|---|---|---|
| Two-week pooled activation rate | 2,132 / 52,000 (4.10%) | 2,340 / 52,000 (4.50%) |
| Week 1 activation rate | 1,066 / 26,000 (4.10%) | 1,300 / 26,000 (5.00%) |
| Week 2 activation rate | 1,066 / 26,000 (4.10%) | 1,040 / 26,000 (4.00%) |
| Weekly email opt-out rate | 0.60% | 0.84% |

The pooled p-value is about 0.0015, and the team wants to ship this Monday. What do you say?

(Source: adapted from a readout exercise in KORE1's "Data Product Manager Interview Questions 2026," itself a simplified version of a real client case used in actual interview loops)

### How to Break It Down

1. **Split the pooled numbers**: compare week by week instead of trusting the two-week average
2. **Check whether the lift is real**: look for a novelty effect, or an external event (a promo, a campaign) that overlapped with one week
3. **Check whether a guardrail metric broke**: is the opt-out rate drift inside a threshold that was set before the test started?
4. **Ask whether the decision rule existed beforehand**: minimum detectable effect, run length, and guardrail thresholds should have been written down before launch, not debated after
5. **State a conclusion**: neither ship nor kill outright — give the specific condition under which you'd rerun or extend the test

### Sample Answer (how you'd actually say this in an interview)

> **Split the numbers first**: "Pooled together, this looks like a real win — activation moved from 4.10% to 4.50% over two weeks, with a p-value around 0.0015. But before I trust that, I'd split it by week. Week one shows a 0.9-point lift in the treatment group; week two shows negative 0.1. The entire win lives inside week one, and it's gone by week two."
>
> **Check whether it's a real effect**: "That pattern looks like a novelty effect — users react more positively to something new, and the effect fades. If week one also overlapped a promotion, the traffic mix itself wasn't representative of a normal week. Randomization guarantees the two groups were comparable to each other; it doesn't guarantee that this particular traffic predicts what happens going forward. I wouldn't treat this as confirmed — it's a hypothesis that needs another test to settle."
>
> **Check the guardrail**: "I'd also look at the email opt-out rate, which moved from 0.60% to 0.84% — a 40% relative increase. If a guardrail threshold was set before the test and this crosses it, the guardrail violation outranks the lift, full stop, regardless of how good the activation number looks. If no threshold was ever set, that's itself the finding — the test shipped without a guardrail, and that needs fixing before we talk about shipping the redesign."
>
> **State the decision**: "I wouldn't ship this redesign outright, and I wouldn't kill it either. I'd rerun the test on ordinary traffic with the promotion excluded, and before rerunning it, write down the minimum detectable effect, the run length, the guardrail threshold, and the decision rule — so the next readout doesn't come down to eyeballing a one-time number again."

### Self-Check

Use this table to check whether your answer covered the key points:

| Checkpoint | Covered? |
|---------|---------|
| Split the pooled number into weeks or segments | |
| Named the possible novelty effect or external interference (promo, campaign) | |
| Checked whether a guardrail metric (not the primary one) was violated | |
| Named the MDE, run length, and decision rule that should have existed beforehand | |
| The conclusion wasn't a flat "ship" or "kill," but a specific next-step condition | |
| Bonus: distinguished "randomization guarantees the two groups are comparable" from "this traffic predicts future traffic" — two different claims | |

## Today's Case

**Facebook's "7 friends in 10 days" — finding an activation metric from data, not intuition**

Between 2007 and 2010, as Facebook's growth slowed, the growth team led by Chamath Palihapitiya worked backward from user behavior data and found that new users who added at least 7 friends within their first 10 days showed dramatically higher long-term retention than users who didn't hit that threshold. Instead of guessing which feature mattered most, the team collapsed the entire product's priorities into a single target: get as many new users as possible to 7 friends within 10 days. Friend suggestions, contact import, and engagement nudges were all designed to push users toward that threshold — not as a list of independent features. The metric went on to be publicly cited as the core growth metric behind Facebook's path to a billion users.

**Interview angle**: use this case when asked how to define an activation metric for a new product. The point isn't the number "7 friends" itself — it won't transfer directly to a different product. It's the method: work backward to find which early behavior correlates most strongly with long-term retention, then collapse that behavior into a single metric the whole team can align around, instead of chasing a dozen numbers at once.

## Further Reading

- [How to Crack Product Metrics Questions in PM Interviews - IGotAnOffer](https://igotanoffer.com/blogs/product-manager/product-metric-interview-questions) — the full GAME and DEC frameworks, with real interview question banks from Meta, Google, and Anthropic
- [Data Product Manager Interview Questions 2026 - KORE1](https://www.kore1.com/data-product-manager-interview-questions/) — the original version of today's practice question, plus related exercises on event schema design and table ownership
- [facebook-seven-friends-in-ten-days-2007-2010 - GitHub (deciqAI)](https://github.com/deciqAI/knowledge-skills/blob/main/north-star-metric/examples/facebook-seven-friends-in-ten-days-2007-2010.md) — Chamath Palihapitiya's original lecture quote and context

## References

- [Data Product Manager Interview Questions 2026 - KORE1](https://www.kore1.com/data-product-manager-interview-questions/) — source of today's practice question's A/B test readout case and numbers
- [How to Crack Product Metrics Questions in PM Interviews - IGotAnOffer](https://igotanoffer.com/blogs/product-manager/product-metric-interview-questions) — source of the GAME and DEC framework steps in the cheat sheet
- [facebook-seven-friends-in-ten-days-2007-2010 - GitHub (deciqAI)](https://github.com/deciqAI/knowledge-skills/blob/main/north-star-metric/examples/facebook-seven-friends-in-ten-days-2007-2010.md) — original quote source for today's case
- [Facebook's "Aha" Moment Was Simpler Than You Think - Mode](https://mode.com/blog/facebook-aha-moment-simpler-than-you-think/) — background on "7 friends in 10 days" as a north star metric
