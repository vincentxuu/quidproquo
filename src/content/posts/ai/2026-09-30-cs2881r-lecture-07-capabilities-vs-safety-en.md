---
title: "CS2881R L7: How to Measure Capabilities and Where to Set Safety Thresholds"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, evaluation, ai-governance]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 11
tldr: "Lecture 7 of Harvard CS 2881R (Fall 2025) had METR's Joel Becker work through a puzzle. On benchmarks, AI can complete, half the time, tasks that take humans hours, and that length doubles about every seven months. Yet in METR's own randomized controlled trial, experienced open-source developers were 19% slower with AI, and labor-market effects are concentrated among young workers. Becker laid out several reconciliations, centered on benchmark tasks being too clean, scoring too cheap, and human baseliners lacking context. The course had also scheduled frontier safety frameworks (OpenAI's Preparedness Framework, Anthropic's RSP) for this lecture, but they were not covered; this post fills them in from the reading list, showing how they turn capability measurements into thresholds."
description: "A guide to Lecture 7 (Capabilities vs. Safety) of Harvard CS 2881R AI Safety, Fall 2025: Joel Becker (METR) on lab versus field evidence, how METR measures 50% time horizon and checks external validity, GDPval's strengths and weaknesses, the design and results of the open-source developer productivity RCT, labor-market data from Canaries in the Coal Mine, and five reconciliations; plus, from the reading list, the AI self-improvement thresholds in OpenAI's Preparedness Framework v2 and Anthropic's RSP."
draft: false
glossary:
  - term: "50% time horizon"
    aliases: ["time horizon", "task time horizon"]
    definition: "The length of tasks, measured in how long human experts take, that an AI model can complete with 50% success. You fit a logistic curve of success rate against log human completion time and read off where it crosses 50%."
    context: "METR's metric; in CS2881R L7, Joel Becker explains how it is measured, extrapolated, and checked for external validity."
    links:
      - label: "METR, Measuring AI Ability to Complete Long Tasks"
        url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/"
  - term: "capability threshold"
    aliases: ["Capability Threshold"]
    definition: "A capability level written in advance into a frontier AI company's safety framework; once a model reaches it, stronger security and deployment safeguards are required before training or deployment can continue."
    context: "OpenAI's Preparedness Framework uses High and Critical; Anthropic's RSP maps thresholds to ASL levels. Both set thresholds for AI self-improvement."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety)

**This post is based on the Fall 2025 term of Harvard CS 2881R.** It is part 11 of the [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en) series and covers official Lecture 7, Capabilities vs. Safety (October 16, 2025), with guest lecturer Joel Becker of [METR](https://metr.org/).

[The previous post on L6](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement-en) used differential equations to ask whether AI doing AI research would explode, and every equation there needs an input: how capable is AI right now, and how fast is it improving? This lecture is about that input. It also connects to the other end of safety: frontier labs' safety frameworks use exactly these capability measurements to decide when to hit the brakes.

The course site's outline for this lecture:

- Growth in capabilities: METR task doubling, METR developer productivity, OpenAI GDPval
- What it means for: large-scale job displacement, automating AI R&D
- The OpenAI Preparedness Framework and other responsible scaling policies

What actually happened in the video needs saying up front. Becker's talk covered the first two items; the third was not covered. At the end of the video, Boaz says he had planned to talk about responsible scaling policies and the Preparedness Framework but ran out of time and would find another slot. The last section of this post fills in those two frameworks from the reading list and is clearly marked as not coming from the lecture.

## Official materials and access

| Material | Status |
|---|---|
| [Lecture video](https://youtu.be/fuRmxFZ-umE) (YouTube title "Lecture 7: Lab vs Field: Guest lecture by Joel Becker", about 2 hours) | Public |
| [Joel Becker's slides](https://docs.google.com/presentation/d/1ipTQKM56fPRrUfQQ7y0jXBsqhtNEbIxF0xoJvcHYNlM/edit) (Google Slides, titled "Reconciling impressive AI capabilities with limited in-the-wild impacts") | Public |
| Reading list | Public: four pre-readings plus a dozen-plus further readings, including policy documents from several governments |
| Student experiment | The course site says TBD; Boaz confirms at the start of the video that there is no experiment this lecture |
| Lecture notes | The student-written [LessWrong weekly summaries](https://www.lesswrong.com/w/cs-2881r) do not cover this week |

The series as a whole is rated A3 with a list of gaps (see the [series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)). This lecture alone has its video, slides, and reading list but no practice material, so it is closer to **A2** as defined in the [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

The video also opens with some logistics: the midterm mini-project deadline moved to November 2; the final project is due on the last day of the semester, December 3; and because of Thanksgiving, the last lecture is November 20. For the midterm and final, see this series' posts on the [midterm reproduction project](/posts/ai/2026-09-30-cs2881r-midterm-reproduction-project-en) and the [final projects retrospective](/posts/ai/2026-09-30-cs2881r-final-projects-retrospective-en).

## The puzzle: lab evidence and field evidence disagree

Becker's whole talk revolves around one contrast. He splits evidence about capabilities into two buckets:

- **Lab-like evidence**: benchmarks and model-card scores. Clean tasks, automatic scoring.
- **Field-like evidence**: randomized controlled trials (RCTs) and labor-market data. Messier and smaller, but closer to outcomes we actually care about.

He says the two buckets give different answers, and the talk tries to reconcile them. He comes from academic economics, which is where the lab-versus-field distinction comes from.

He first explains what METR is: an independent nonprofit whose name stands for Model Evaluation and Threat Research. Model evaluation means measuring models' capabilities and propensities; threat research means connecting those to potential risks. To motivate why capabilities matter, he recommends the pre-reading [METR GPT-5 report](https://evaluations.metr.org/gpt-5-report/), which he calls greatly underread. Unlike the usual "what METR tested" entries in model cards, it is a structured argument: three threat models at the top (AI R&D automation, autonomous replication, sabotaging an AI company) and three kinds of evidence below (assurances from the lab, capability measurements, and examination of reasoning traces). The reasoning traces are checked to rule out sandbagging, where a model deliberately underperforms, because much of the conclusion that GPT-5 is unlikely to pose catastrophic risk rests on it not yet being able to do certain things.

## Lab evidence 1: METR's task length

### Why not just use benchmark scores

Becker points to two problems with traditional benchmarks: scores are hard to interpret (what does 60% or 80% on SWE-bench mean? Is hitting 100% of the human baseline superhuman?), and the time from "no signal" to "fully saturated" keeps shrinking, so it is now hard to build a benchmark that isn't already saturated.

### The method

METR converts AI performance into human time:

1. Have human experts do a set of tasks under conditions as close as possible to the AI's (same environment, instructions, resources) and record how long they take. The tasks come from three suites: HCAST (open-ended software tasks that require autonomy), SWAA (atomic software tasks of seconds to minutes, such as "which of these four filenames most likely contains the passwords"), and RE-Bench (hard ML research engineering tasks).
2. Have AI agents do the same tasks.
3. Put log human completion time on the x-axis and AI success rate on the y-axis, fit a logistic curve, and read off where success is 50%. That is the model's **50% time horizon**.

Examples from the slides, using GPT-5:

| Task | Human time | Can GPT-5 do it? |
|---|---|---|
| Answer a basic SWE question | 15 sec | ✓ |
| Answer a question via googling | 5 min | ✓ |
| Implement a simple webserver | 23 min | ✓ |
| Hack into a vulnerable Docker container | 3.5 hrs | Sometimes (50%) |
| Build a classifier to identify monkey species from audio files | 5.6 hrs | ✓ |
| Write a very efficient kernel | 8 hrs | ✗ |

Becker is candid about the arbitrary choices. Nothing is special about 50%; it is where there are the most positive and negative examples, so statistical power is best, and it matches prior literature. Human time is the geometric mean of successful baseliners' completion times. As for the bar METR uses to flag potentially dangerous capability, a 40-hour time horizon at 50% reliability, he says a very smart colleague at METR came up with it as a guess, and he is very open to better ways of setting it.

Two good questions came up. Boaz asked whether human time predicting model success so well is a property of these benchmarks or a general phenomenon. Becker said it is an empirical regularity observed in many places, with no strong prior theory. A student asked whether long tasks are just short tasks chained together. Boaz added that if a 16-hour task were 16 one-hour tasks in sequence, success should fall off exponentially, like 2 to the minus 16, rather than follow a logistic in log time. Becker mentioned that Toby Ord has a post fitting METR's data with a model where each agent has a constant failure rate per unit of time.

### Extrapolation and external validity

Plot each model's 50% time horizon against release date and you get something close to a straight line on a log scale. Per METR's paper abstract, it has doubled roughly every seven months since 2019. Becker says naive extrapolation to one-month tasks lands around 2029 to 2030; if you believe the recent slope is steeper, 2027. He personally prefers the most parsimonious single line, since with so few data points two lines risks reading tea leaves.

He attacks the conclusion several ways:

- **80% reliability**: similar doubling time, lower intercept. Later in Q&A he said 80% time horizons are about a fifth of 50% ones.
- **Retrodiction**: does a trend built only on early tasks predict later points? Surprisingly well.
- **Messiness**: METR's tasks are mostly clean, automatically scored, with context already curated. They rated tasks for messiness and found messier tasks start lower but also improve. He stresses this isn't unique to METR; popular benchmarks like SWE-bench share it.
- **A different dataset**: SWE-bench Verified shows a similar trend, but with a doubling time of about 70 days, which he thinks is mostly a problem with that dataset's human baseline times.
- **Across task distributions**: follow-up work by his colleague Thomas Kwa shows surprisingly similar slopes across different software task distributions but very different intercepts, with tasks needing vision starting especially low.

A student asked how Anthropic's claim that Sonnet 4.5 can stay focused on a coding task for 30 hours squares with METR's numbers. Becker said METR's estimate of about a 2-hour time horizon for Sonnet 4.5 doesn't contradict there being some case where it worked coherently for 30 hours: one is an average, the other a maximum. Boaz added that two different clocks are mixed here: how long humans take and how long the model spends.

## Lab evidence 2: GDPval

Becker first says this isn't his paper and he may get things wrong. As he describes it, [GDPval](https://openai.com/index/gdpval/) works like this:

1. Pick the 9 sectors that contribute most to US GDP, and within each, the 5 occupations that contribute most to wages and are predominantly digital.
2. Have professionals in those occupations create tasks: a curated prompt with reference files, plus a gold-standard deliverable made by an experienced human. Deliverables aren't limited to text.
3. Have another group of human experts (and separately an automated grader) compare the AI deliverable to the human one on subjective and objective criteria.

He praised the paper for reporting that a non-OpenAI model outperformed OpenAI's models, calling it commendable research practice.

His opinionated pros and cons:

| Pros | Cons |
|---|---|
| Scoring is a holistic quality judgment, not zero-cost automatic scoring | Taskification removes real-world frictions: only final outputs are judged, not defining the task yourself, sharing drafts, and folding in feedback |
| Some tasks are long, which is rare; METR itself struggles to find real tasks that take more than a day without being absurdly expensive | Context is curated for the model, underplaying information retrieval, an important part of real work |
| Tasks correspond to real occupational outputs | Dependencies and interactions between tasks are ignored |
| | Experts pick tasks that low-context judges can score, adding selection across and within occupations |

### What benchmarks tell us overall

Before turning to field evidence, Becker said something in benchmarks' favor: he could not do the ML challenges in RE-Bench to the standard AI does today, which is an extraordinary fact, and progress is fast. But benchmarks share four limits: low-context baseliners (domain experts who don't know the specific task setting), low ceilings, heavily selected tasks, and tasks that are too clean.

## Field evidence 1: the open-source developer productivity RCT

This is Becker's own study, the pre-reading [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://arxiv.org/abs/2507.09089).

### Design

- **People**: 16 experienced developers from large, mature open-source projects such as the Haskell compiler GHC, scikit-learn, and Hugging Face transformers. These projects average over a million lines of code and have existed for more than ten years; developers had worked on them for about 5 years on average and typically ranked around third by commits.
- **Tasks**: issues from their own real work, about 16 each. Anything expected to take over 4 hours was split, for statistical power. The paper's abstract gives 246 tasks in total.
- **Randomization**: tasks, not people, were randomized. Each task was assigned to "AI disallowed" (back to 2019: no tab autocomplete, no Cursor, no ChatGPT) or "AI allowed" (use whatever you want, nothing mandatory).
- **Tools**: in practice METR bought them Cursor Pro, and most used the frontier models of the time, Claude 3.5 and 3.7 Sonnet. There was about 30 minutes of training at the start.
- **Outcome**: completion time, including time after responding to code review.

Becker explained the choice of setting: they had external-validity concerns about the time horizon work and wanted a simple pilot of a few months. Open source didn't require partnering with a company and gave access to very experienced people. The planned two-month pilot became a six-month project because the result was so surprising that they spent a long time making sure they hadn't messed something up.

### Results

| Whose forecast | Expected change in completion time |
|---|---|
| Economics experts (before the study) | about 39% shorter |
| ML experts (before the study) | about 38% shorter |
| Developers (before the study) | 24% shorter |
| Developers (looking back after the study) | 20% shorter |
| **Observed** | **19% longer** |

Numbers follow the paper's abstract; in the video Becker summarized both expert groups as about 40%. He said that when he used to collect forecasts from audiences before revealing this slide, there was always an audible gasp.

### Why developers slowed down

They watched a large number of screen recordings and ran exit interviews, and identified factors that may have caused the slowdown:

- **Over-optimism about AI**: developers could always choose not to use AI, but they expected it to help, so they used it.
- **High familiarity with the repositories**: they often knew how to solve the problem before starting and knew far more about the codebase than the AI did.
- **Large, complex repositories**: the same issue as messiness above.
- **Low AI reliability**: suggestions were often directionally right, but you had to verify them and redo the work when wrong. Becker said developers accepted under 44% of AI-generated lines, and he guesses only about 15% to 20% survived into the final PR.

The most common objection in public discussion was that the developers just weren't good at using AI. Becker is skeptical, mainly not because of any chart but because he watched many hours of these developers using Cursor and didn't see obvious speedups left on the table; subgroup analyses (developers with prior AI experience, excluding early tasks) showed no clear difference. He also said some people read a learning effect into the chart of cumulative AI hours, so the team labels this factor as "unclear effect."

He stressed that the sample is small. His rough math: if you thought beforehand there was a 5% chance AI slows down developers like these, this evidence should move you to about 25%; it is stronger evidence against AI giving very large positive speedups.

Two more details from Q&A: about two months after the study, roughly 80% of developers were still using Cursor on most days; and METR is running a larger follow-up where payment for tools is more flexible and CLI agents like Claude Code are welcome.

## Field evidence 2: the labor market

Becker said an economist would cover this later in the course (see [L9 economic impacts](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts-en)), so he kept it brief:

- **Gimbel et al.**: using OpenAI's GPT-4 exposure measure (for each O*NET task, "can GPT-4 cut completion time by half or more?", with an occupation's score being the share of yes answers), they asked whether people moved into or out of exposed occupations. The first-pass answer is no.
- **[Canaries in the Coal Mine](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf)** (Brynjolfsson et al.): uses large-scale payroll data to get around the CPS being too small to say much about young workers. Becker's reading of one plot: only 22- to 25-year-olds entering highly AI-exposed occupations show declining employment; experienced workers in exposed occupations and young workers in less exposed ones both show robust growth. These are descriptive facts, not causal estimates.
- **One speculation** (from a post by economist Joshua Gans): young workers enter with textbook-like knowledge, senior workers have tacit knowledge; AI may substitute for the former and complement the latter. The worry is where new graduates will build AI-complementary tacit knowledge if firms won't pay for on-the-job training that isn't specific to them.
- **A counterexample**: Humlum and Vestergaard, using Danish firm data with workers' reports of whether their employer encourages AI use as the exposure measure, find no difference in entry-level hiring.

He acknowledged that other productivity RCTs mostly find positive effects, but he is skeptical of many: they often use lines of code or number of PRs as outcomes (his analogy: an LLM makes your article longer, but word count isn't what you care about), and many use synthetic tasks like "implement an HTTP server" that AI is especially good at.

## Five reconciliations

So the puzzle: Claude 3.7 Sonnet and 3.6 Sonnet have time horizons of about 1 hour and 0.5 hours, and benchmarks keep saturating, which seems impressive; the same models slowed down experienced developers, and labor-market effects are limited. Becker's explanations are not mutually exclusive and not guaranteed to be complete:

1. **We messed up, or the field evidence is weak**: developers used AI poorly; scope grew with AI (say, an extra test, so PRs were longer and better); tasks or developers were selected; hourly pay removed any incentive to hurry; the sample is small. Hourly pay was deliberate, because paying per task would push developers to bring smaller tasks.
2. **There is no puzzle**: the RCT's average task was about 2 hours, already beyond the 50% time horizon of models at the time; and saving time requires very high reliability, where 80% time horizons are much shorter.
3. **Different scoring standards**: AI output might pass SWE-bench-style unit tests without being something a maintainer would merge. Becker said unpublished METR work suggests that under a "mergeable into main" standard, you should take roughly 20 percentage points off SWE-bench scores.
4. **Low-context versus high-context baseliners**: a task that takes a familiar developer 2 hours might take a low-context METR baseliner 4 or 16. Boaz chimed in: then it's no surprise models struggle, and it's just a matter of waiting a few more seven-month doublings.
5. **Task distribution and elicitation**: plot time horizons on a different set of tasks and the curve may look much less impressive; the agent inside Cursor may be under-elicited, since METR's agents burn through lots of tokens and token usage matters a lot for performance.

### What it means for job displacement and automated AI R&D

The slides list several readings for technological unemployment: early-2025 AI might not boost productivity at all; it might boost productivity but create more jobs than it destroys (the bank-teller story); it might complement some types of human capital; or it simply hasn't diffused yet. The slide cites a Pew figure that about 34% of US adults had used ChatGPT by March 2025.

On automated AI R&D, he made three points:

- **Extraordinary R&D automation is compatible with small economic impacts**: many AI 2027 stories rely on internal deployment of models that are never released.
- **The field evidence is at least negative evidence on levels**: under some conditions, on some types of problems, capability is lower than it looks. If you think capability explosions require closing the whole R&D loop, then even one important class of problems where models do poorly is evidence against an explosion, or at least against it happening soon.
- **The big open question**: is the gap between the two kinds of evidence only in levels (the time horizon line shifts down with the same slope), or something deeper? For example, time horizons could keep growing exponentially while real speedups bend over because of communication bottlenecks between AIs or between humans and AIs. He said he doesn't know.

## Supplement (from the reading list, not the lecture): how safety frameworks turn capabilities into thresholds

The course site lists the OpenAI Preparedness Framework and responsible scaling policies as topics for this lecture and assigns both documents as pre-readings, but the video doesn't cover them. What follows comes from the documents themselves and focuses on the AI self-improvement thresholds most relevant to L6 and L7.

| | [OpenAI Preparedness Framework v2](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf) | [Anthropic Responsible Scaling Policy](https://www-cdn.anthropic.com/872c653b2d0501d6ab44cf87f43e1dc4853e4d37.pdf) |
|---|---|---|
| Version | The document says Version 2, last updated April 15, 2025 (the course site labels it 2024) | The course site labels the link 2024; when I opened it for this post, the URL served Version 2.2, effective May 14, 2025 |
| Scope | Three Tracked Categories: biological and chemical, cybersecurity, AI self-improvement; plus Research Categories (long-range autonomy, sandbagging, autonomous replication and adaptation, undermining safeguards, nuclear and radiological) | Capability Thresholds in two areas: CBRN and autonomous AI R&D |
| Levels | High: significantly increases existing pathways to severe harm, requires sufficient safeguards before deployment; Critical: a qualitatively new threat vector with no precedent, requires safeguards even during development | ASL (AI Safety Level) standards; all current models must meet at least ASL-2, and reaching a threshold triggers the corresponding ASL |
| Lower AI self-improvement threshold | High: impact equivalent to giving every OpenAI researcher a highly performant mid-career research engineer assistant, relative to a 2024 baseline | AI R&D-4: can fully automate the work of an entry-level, remote-only researcher at Anthropic. Requires the ASL-3 Security Standard plus an affirmative case identifying and mitigating risks from models pursuing misaligned goals |
| Higher AI self-improvement threshold | Critical: capable of recursive self-improvement (fully automated AI R&D), defined as a superhuman research-scientist agent (leading indicator) or causing a generational model improvement (e.g., o1 to o3) in a fifth of 2024's wall-clock time, sustained for several months (lagging indicator). Halt further development until safeguards are specified | AI R&D-5: can cause dramatic acceleration in the rate of effective scaling. Requires at minimum the ASL-4 Security Standard (protection against model-weight theft by state-level adversaries), with an affirmative case also expected |
| Who decides | An internal cross-functional Safety Advisory Group recommends, OpenAI leadership approves or rejects, and the board's Safety and Security Committee oversees | (Governance sections not covered in this post) |

Read back against L6 and L7, the table has three connections:

- **L6's vocabulary**: OpenAI's Critical threshold is almost an operational definition of RSI as L6 used the term; the "one fifth of the time" can be set against the roughly 5x R&D multiplier AI 2027 assigns to a superhuman coder (that comparison is mine, not the framework's or the lecture's).
- **L7's measurement problem**: both frameworks phrase thresholds as "equivalent to some kind of human researcher." Becker's whole talk shows how hard that conversion is: the same model looks like a multi-hour expert on benchmarks and slows experts down in their own codebases. He himself described METR's 40-hour bar as a guess.
- **Sandbagging as a Research Category**: OpenAI lists it as an area to study, with the response of using elicitation that overcomes sandbagging or a conservative upper bound. That is the same reason the METR GPT-5 report checks reasoning traces, and it connects back to [evaluation awareness in L10](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en).

The further readings also list the DeepMind Frontier Safety Framework, METR's Common Elements of Frontier AI Safety Policies, the EU AI Act code of practice, the NIST AI RMF, and others, which this post doesn't go through.

## What to do after this lecture

- **Read two things first**: the [METR developer RCT](https://arxiv.org/abs/2507.09089) for how field evidence is designed, and the [METR GPT-5 report](https://evaluations.metr.org/gpt-5-report/) for how capability measurements become a risk argument.
- **Measure a time horizon yourself**: pick 10 tasks you actually did at work, write down how long each took you, have your usual agent attempt each three times, and see where on the human-time axis it starts failing. You'll run into every issue Becker raised: high versus low context, scoring standards, and how clean the task is.
- **Ask one question when reading a framework**: what measurement triggers each threshold? If the answer is "equivalent to some kind of human," go back to this lecture's puzzle.

## Further reading on this site

- [CS336 evaluation](/posts/ai/2026-08-22-cs336-evaluation-en): basic methods and pitfalls in evaluating language models
- [Stanford CS329Z Week 8: LLM judges and evaluation safety](/posts/ai/2026-09-16-stanford-cs329z-week8-judge-safety-en)
- [Stanford CS329A: self-improving agents](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)

## Series navigation

- Series overview: [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en)
- Previous: [L6: will AI doing AI R&D trigger an intelligence explosion?](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement-en)
- Next: [L9: early evidence on AI, jobs, and productivity](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts-en)

## References

- [Harvard CS 2881R Fall 2025 course site: Lecture Oct 16, Capabilities vs. Safety](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-oct-16)
- [L7 lecture video (YouTube)](https://youtu.be/fuRmxFZ-umE)
- [Joel Becker's slides: Reconciling impressive AI capabilities with limited in-the-wild impacts](https://docs.google.com/presentation/d/1ipTQKM56fPRrUfQQ7y0jXBsqhtNEbIxF0xoJvcHYNlM/edit)
- [Becker, Rush, Barnes, Rein 2025, Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://arxiv.org/abs/2507.09089)
- [METR, GPT-5 Report](https://evaluations.metr.org/gpt-5-report/)
- [METR 2025, Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- [OpenAI, GDPval](https://openai.com/index/gdpval/)
- [Brynjolfsson, Chandar, Chen 2025, Canaries in the Coal Mine?](https://digitaleconomy.stanford.edu/wp-content/uploads/2025/08/Canaries_BrynjolfssonChandarChen.pdf)
- [OpenAI, Preparedness Framework Version 2](https://cdn.openai.com/pdf/18a02b5d-6b67-4cec-ab64-68cdfbddebcd/preparedness-framework-v2.pdf)
- [Anthropic, Responsible Scaling Policy (course link, currently Version 2.2)](https://www-cdn.anthropic.com/872c653b2d0501d6ab44cf87f43e1dc4853e4d37.pdf)
- [METR, Common Elements of Frontier AI Safety Policies](https://metr.org/blog/2025-03-26-common-elements-of-frontier-ai-safety-policies/)
