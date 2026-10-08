---
title: "Product Builder Interview Drill — 2026-10-02: Growth & Experimentation"
date: 2026-10-02
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: en
description: "Practicing an OpenAI Growth PM question — designing an experiment to help new users complete ChatGPT onboarding — using Duolingo's user-state transition model. The case study: Duolingo changed its streak rule from requiring a daily goal to requiring just one lesson, and both retention and DAU went up."
tldr: "Growth & Experimentation interviews don't test whether you can run an A/B test — they test whether you can find the lever with the biggest impact on the north star metric before spending experiment budget. Today's question is a real OpenAI Growth PM prompt: 'If you were to design an experiment or feature to help onboard new ChatGPT users, what would you do?' The framework: split users into five states — new, current, reactivated, resurrected, and inactive — estimate how much each transition between states moves daily active users (DAU), and concentrate experiments on whichever transition moves DAU the most. The case is Duolingo's 2018 discovery that improving Current User Retention Rate had roughly five times the DAU impact of the next-best lever. One resulting experiment changed the streak rule from 'hit your daily goal to keep your streak' to 'finish one lesson to keep your streak' — Day 14 retention rose 3.3% relative, overall DAU rose 1%, and the share of learners still on a streak after 20 days rose 10.5%. Over four years, that metric rose 21% and DAU grew 4.5x."
series:
  name: "Product Builder Interview Daily"
  order: 44
---

> 🌏 [中文版](/posts/daily/2026-10-02-product-builder-interview-daily)

## Today's Focus

Growth & Experimentation interviews rarely trip people up on "I'd run an A/B test." They trip people up on the follow-up: "How did you decide what to test?" A weak answer lists a pile of hypotheses and says they all got tested in turn. What interviewers at companies like OpenAI and Meta are actually screening for is whether you can rank levers by impact first, then concentrate experiments on the transition that moves the north star metric the most — that's the core of a Growth PM's "data and experimentation" round.

## Core Frameworks

The **Hook Model** breaks a habit-forming product into four stages:

| Stage | Question | Design focus |
|---|---|---|
| Trigger | What brings the user back? | External triggers (notifications) should gradually give way to internal triggers (habit, emotion) |
| Action | What's the smallest thing the user has to do? | The action must be simpler than what the trigger led them to expect |
| Variable Reward | What does the user get after acting? | The reward needs uncertainty to keep holding attention |
| Investment | What does the user leave behind in the loop? | Investment (data, streaks, connections) makes the next trigger more effective |

The **Growth Lever Model** answers a different question: where should experiment budget go? Split users into five states — new, current, reactivated (recently churned, now back), resurrected (long churned, now back), and inactive — then estimate, for each transition between states, how much a 1% improvement would move DAU. Duolingo's growth team used exactly this model and found that improving the transition "current users stay current" — what they called Current User Retention Rate (CURR) — had roughly five times the DAU impact of the next-best lever. That ranking is what pointed four years of experiment budget at one transition (source: Jorge Mazal, "How Duolingo reignited user growth," Lenny's Newsletter).

## Today's Practice Question

### The Question

"If you were to design an experiment or feature to help onboard new ChatGPT users, what would you do?"

(Source: a real question from OpenAI's Growth Product Manager hiring manager screen, as reported by candidates and collected in Aced's "OpenAI Growth Product Manager Interview Guide.")

### How to Break It Down

1. **Scope the problem**: Ask what "completing onboarding" means here — finishing one meaningful conversation, setting up personalization, or hitting some usage frequency? Is the target self-serve consumer signup or employees being onboarded after an enterprise rollout? The two contexts fail in different places.
2. **Define the users**: Split into two groups — people trying an LLM product for the first time (who don't know what to ask), and people switching over from another tool (who arrive with expectations and stumble on interface differences). They need different onboarding help.
3. **Structure the analysis**: Use the Growth Lever Model to break onboarding into transitions — install/signup → first conversation → second visit → habitual use. Estimate, for each transition, how much a 1% improvement there would move overall activation. Find the transition that's both leaking the most users and has the biggest lever, instead of touching every stage at once.
4. **Propose a solution**: Design one small, reversible experiment targeting the leakiest, highest-leverage transition — for example, surfacing three context-specific prompt suggestions the first time a new user opens an empty chat box, rather than rebuilding the whole onboarding flow. Keep the change narrow enough that causality is clear.
5. **Define success**: Pick a north star metric (e.g., Day 1 or Day 7 return rate) and check the precondition — do you have enough traffic, and will you run the test long enough to detect the effect size you're hoping for? Don't ship a change on traffic too small to ever reach significance and then draw a conclusion anyway.

### Sample Answer (how to actually say this in an interview)

> **Scope it first.** I'd confirm what "completing onboarding" means for this team — if it's self-serve consumer ChatGPT, I'd assume the goal is a new user having one conversation in their first session that felt genuinely useful, since that tends to be the strongest predictor of return visits. I'd also split first-time LLM users from people switching over from another tool, since lumping them together dilutes the signal from each.
>
> **Then find the lever.** I'd break onboarding into transitions — signup → first conversation → second visit → habitual use — and look at where the existing data shows the biggest drop-off. If most users never come back after their first conversation, the problem isn't getting people in the door, it's that they don't know what the product can do for them. I'd put experiment budget there instead of touching signup flow, UI, and notification copy all at once — with limited resources, spreading tests thin just means none of them reach significance.
>
> **Then design the experiment.** For the first-conversation transition, I'd test something small and specific: showing three prompt suggestions tailored to acquisition source (search, referral, enterprise rollout) above the empty chat box, against a control with no suggestions. Success metrics would be Day 7 return rate and whether the first conversation leads to a follow-up question — and I'd compute the required sample size from current traffic and expected effect size before launching, rather than calling it early off a day or two of promising-looking numbers.

### Self-Check

| Checkpoint | Covered? |
|---|---|
| Scoped what "completing onboarding" means and for whom (consumer vs. enterprise) | |
| Distinguished first-time users from switchers and their different sticking points | |
| Used a funnel/transition model to find the leakiest, highest-leverage stage | |
| Proposed one narrow, reversible experiment rather than reworking the whole flow | |
| Defined a success metric and addressed sample size / statistical significance | |
| Bonus: argued for concentrating budget on one lever over spreading ten tests thin |  |

## Today's Case

**Duolingo: changing the streak rule from "hit your goal" to "finish one lesson"**

By mid-2018, Duolingo's DAU growth had slowed to single digits. The team first applied the Growth Lever Model, splitting users into five states, and found that improving Current User Retention Rate (CURR) — the odds a currently active user stays active — had roughly five times the DAU impact of the next-best lever, so they built a dedicated team around that one metric. One resulting experiment came from a counterintuitive finding: under the rule that required hitting your daily goal to keep your streak, users with the highest daily goal tier were actually *least* likely to keep a streak — the goal itself had become a barrier to building the habit. The team decoupled the streak from the daily goal, letting one completed lesson extend the streak instead. The A/B test showed Day 14 retention up 3.3% relative, overall DAU up 1%, and the share of learners still on a streak after 20 days up 10.5% — with new users' streak rate up 19% (source: Duolingo's official blog, "Improving the streak: Forming habits one lesson at a time"). Over the following four years, CURR rose 21% relative and DAU grew 4.5x (source: Jorge Mazal, Lenny's Newsletter).

**Interview angle**: Use this case to answer "how do you decide what to test" questions — it demonstrates that finding the highest-leverage transition before experimenting beats testing every plausible change at once. It also works for "a result that surprised you" questions, since the counterintuitive finding — higher goals making streaks *harder* to keep — is what triggered the experiment in the first place.

## Further Reading

- [How Duolingo reignited user growth](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) — former Duolingo CPO Jorge Mazal's full breakdown of the Growth Lever Model, how CURR was identified, and the path to 4.5x DAU growth over four years.
- [Improving the streak: Forming habits one lesson at a time](https://blog.duolingo.com/improving-the-streak/) — Duolingo's own blog post with the first-hand data and design rationale behind the streak experiment.
- [OpenAI Growth Product Manager (PM) Interview Guide](https://www.aced.io/guides/openai-growth-product-manager-interview) — source of today's practice question, with the full OpenAI Growth PM interview loop and reported questions for each round.

## References

- [How Duolingo reignited user growth — Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) — source for the Growth Lever Model framework and the CURR-ranking part of today's case.
- [Improving the streak: Forming habits one lesson at a time — Duolingo Blog](https://blog.duolingo.com/improving-the-streak/) — source for today's case's Day 14 retention (3.3%), DAU (1%), and streak-share (10.5%) figures.
- [OpenAI Growth Product Manager (PM) Interview Guide — Aced](https://www.aced.io/guides/openai-growth-product-manager-interview) — source for today's practice question, from the Hiring Manager Screen section.
- [Duolingo Users (2026): How It Grew to 58.7M Daily Learners — okara.ai](https://okara.ai/blog/how-duolingo-grew) — cross-reference used to confirm the streak experiment numbers and Growth Lever Model timeline.
