---
title: "Product Builder Interview Drill — 2026-10-15: AI Product Design"
date: 2026-10-15
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: en
description: "Thursday's rotation is AI Product Design — an AI feature's 'good' has to be written down as evals before a launch gate means anything; practice a real Perplexity interview question: an agent saves users time, but takes the wrong action in 5–10% of sessions — define quality and launch thresholds."
tldr: "Today's practice is defining quality for AI products: an AI PRD adds six sections to a normal PRD, and its eval plan is the acceptance criteria; evals start with error analysis on real traces, ranked by frequency times customer cost, with evals written only for the top few errors and the cheapest check (a code assertion) tried first; launch thresholds are written before you see results and split into zero-tolerance and acceptable-rate classes. The practice question is a Perplexity question from the AllthingsPM bank; the case is Intercom Fin moving its billing unit from resolutions to outcomes."
series:
  name: "Product Builder Interview Daily"
  order: 57
---

> 🌏 [中文版](/posts/daily/2026-10-15-product-builder-interview-daily)

## Today's Focus

Thursday is AI Product Design. Earlier sessions covered the autonomy ladder, trust calibration and human-AI task allocation — all about how much the AI should do. Today goes one step earlier: when an AI's output changes every time, how does a PM decide the feature is good enough to ship? In AI PM loops, evals and launch gates now often replace or extend the classic metrics round, and if you can't name a concrete threshold, a polished design will still get picked apart in the follow-ups.

## Framework Cheat Sheet

### The AI PRD: a normal PRD plus six sections

A normal PRD covers the problem, users, scope and success metrics. An AI feature's PRD adds six more:

| Section | Question it answers |
|---|---|
| AI or not | Is a fixed workflow enough? Why does this need a model? |
| Failure modes and risk register | Where will it go wrong? Who gets hurt, and how badly? |
| Layered guardrails | How are inputs, outputs and actions each blocked? |
| Human escalation triggers | Which cases always go to a person? |
| Eval plan | Which test set and which pass criteria accept the feature? |
| Three-level success metrics | Model quality, user behavior and business outcome, plus cost and latency limits |

The key is the fifth section: the eval plan is the acceptance criteria, not monitoring you bolt on after launch.

### Error analysis first: read traces, then write evals

1. **Read real outputs**: read at least 30–50 real traces and write one sentence on what went wrong in each.
2. **Tag and rank**: tag the errors and rank them by frequency times cost to the customer; this cycle only tackles the top three.
3. **Match a check to each error**: a code assertion when a rule can decide it, a golden dataset when there is one right answer, an LLM-as-judge only when the call is semantic, plus user-behavior signals such as regenerating or editing. Start with the cheapest and use it to filter before the expensive one.

The common mistake is building an LLM judge first and ending up with a score that doesn't measure the real problem.

## Today's Practice Question

### The Question

A computer-use agent genuinely saves users time, but in 5% to 10% of sessions it takes the wrong action. Define the quality bar and the launch thresholds.

(Source: a Perplexity AI PM interview question collected in the AllthingsPM question bank)

### Breaking It Down

1. **Clarify**: what kind of wrong action? A mis-click the agent can redo, or something irreversible like submitting a form, paying or sending an email? Which task types do the errors cluster in? Do users notice and correct them?
2. **Segment users**: power users who watch the screen versus users who hand off a task and walk away. The second group can't see errors, so the cost is much higher.
3. **Structure the analysis**: classify errors by reversibility times impact, and rank them with error analysis. 5–10% is an average; break out how much each class contributes.
4. **Propose a solution**: two kinds of thresholds. Irreversible actions are zero-tolerance and blocked by product design (confirmation before the action, restricted permissions); reversible errors get an acceptable rate, with the requirement that users can see and undo them.
5. **Define success**: time saved per successful task, the share of tasks needing human correction, incidents in the zero-tolerance class, and how often users come back to hand off another task.

### Sample Answer (how you'd actually say this in an interview)

> **First, break up the 5–10%.** I wouldn't answer "the error rate needs to get down to X%," because the average mixes two very different kinds of errors. I'd read the last 50 failed sessions, split the errors into reversible and irreversible, and see which tasks each clusters in. Say 1% of an 8% rate is irreversible — submitting forms or paying — and the other 7% is mis-clicks and wrong entries the agent recovers from. Those two classes get separate thresholds.
>
> **Write the thresholds before seeing results.** Irreversible actions are zero-tolerance: the launch condition is zero cases of this class in the eval set, and the product always stops for user confirmation before submitting, rather than trusting the model's own judgment. For reversible errors I'd set a rate, say under 5% on the eval set, and require every action to be visible on screen with one-click undo. The eval set is sampled from real sessions, not scenarios the engineers made up.
>
> **After launch, watch three numbers.** Time saved per successful task has to exceed the time users spend correcting; the share of tasks needing human intervention should fall week over week; and any zero-tolerance incident automatically drops the agent into confirm-every-step mode. That way the threshold isn't just a launch-day gate but the basis for loosening or tightening autonomy later.

### Self-Check List

Use this table to check your answer for gaps:

| Check item | Covered? |
|---------|---------|
| Break the average error rate into classes | |
| Use reversibility and impact to choose the threshold type | |
| Zero tolerance for irreversible actions, enforced by product design | |
| Eval set drawn from real sessions, thresholds written in advance | |
| Post-launch metrics and automatic downgrade | |
| Bonus: tie thresholds to loosening or tightening autonomy | |

## Today's Case

**Intercom Fin: moving the billing unit from resolutions to outcomes**

Intercom started by defining success as Fin fully resolving a conversation on its own, and priced on that: you pay only when it resolves. That let customers compare AI against human support directly; more than 12,000 teams now use Fin, with an average resolution rate of 76%. But once Fin took on subscription changes, transaction disputes and billing flows, many conversations were supposed to end with a human confirming, per the customer's own policy, and the old definition counted all of those as failures. So Intercom switched to "outcomes": Fin completing the action it was configured to perform counts, and a full resolution is just one kind of outcome.

**Interview angle**: when asked how you'd define success for an AI feature, this case shows that the definition itself is a product decision. Too narrow, and it pushes the product toward full automation it shouldn't attempt; too broad, and the metric stops meaning anything. A strong answer says what behavior your chosen definition will encourage.

## Further Reading

- [The AI PRD: A Template With Risks, Guardrails, and Success Metrics](https://allthingspm.app/blog/the-ai-prd) — section-by-section template for the six extra AI PRD sections
- [The AI Eval Starter Kit: Six Templates, Error Analysis to Gate](https://falkster.com/blog/ai-eval-starter-kit) — six templates from the error-analysis log to the launch gate
- [AI PM Interview Questions and Answers (2026)](https://allthingspm.app/blog/ai-pm-interview-questions) — what each AI PM round tests, with real questions from Anthropic, OpenAI, Perplexity and others

## References

- [The AI PRD — AllthingsPM](https://allthingspm.app/blog/the-ai-prd) — framework: the six AI PRD sections
- [The AI Eval Starter Kit — Falkster](https://falkster.com/blog/ai-eval-starter-kit) — error analysis first, ranking by frequency times cost, don't build the judge first
- [Teresa Torres's Three Steps for AI Evals — Falkster](https://falkster.com/answers/what-is-teresa-torres-three-step-approach-to-ai-evals) — matching errors to check types, cheapest first
- [AI PM Interview Questions and Answers (2026) — AllthingsPM](https://allthingspm.app/blog/ai-pm-interview-questions) — source of the practice question (Perplexity) and how evals replace the metrics round
- [From resolutions to outcomes — Intercom](https://www.intercom.com/blog/from-resolutions-to-outcomes-evolving-how-fin-delivers-value/) — today's case
