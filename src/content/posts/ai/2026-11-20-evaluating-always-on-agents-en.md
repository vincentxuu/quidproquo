---
title: "How to Evaluate Whether an Always-On Agent Is Useful: What Reporters' Tests, a Nine-Day Scheduled Test and Academic Benchmarks Each Measure, and Your Own One-Week Test"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, benchmark]
lang: en
tldr: "\"Proactive\" can be measured, but only if you break it apart: did it notice what needed doing, did it do it right once noticed, was the timing right, and what did it cost. Reporters' tests (WIRED tested six agents in a day) capture how products feel, but run each task once. AIMultiple ran the same scheduled jobs on four agents for nine days: Hermes caught the most new items, but was also the slowest and missed runs. Academic benchmarks (AutoBuddy, VibeLifeBench, Claw-Anything, Proactivity-Gym) test in simulated worlds and agree that discovery and execution are separate abilities and that proactive tasks are much harder than reactive ones; but they test models inside researchers' own agent harnesses, not products you can subscribe to. The most reliable evaluation is running one of your own routine tasks for a week and recording those four things separately."
description: "The four dimensions for evaluating always-on agents (discovery, execution, timing, cost), what WIRED's hands-on test is worth and where it stops, AIMultiple's nine-day scheduled test and how to read it, what the AutoBuddy, VibeLifeBench, Claw-Anything and Proactivity-Gym benchmarks do and don't measure, criticism of agent benchmarks themselves, and how to design a one-week evaluation for one routine task."
series:
  name: "Always-On AI Agents"
  order: 20
draft: false
---

> :globe: [中文版](/posts/ai/2026-11-20-evaluating-always-on-agents)

| Evaluation | By | What it measures | What it tests | Main limit |
|---|---|---|---|---|
| WIRED one-day test | A reporter | Five everyday tasks, scored 1–5 | Six products | Each task run once |
| AIMultiple nine-day test | A research firm | Two scheduled jobs a day | Four products | Automatic labels; one company |
| AutoBuddy | A Microsoft research team | Finding and completing to-dos in a workspace | 17 models plus an in-house agent | Simulated company |
| VibeLifeBench | Xiaohongshu and others | Multi-week life tasks | Models | Simulated world |
| Claw-Anything | Aggarwal et al. | Acting after reading months of logs | Models plus a lightweight harness | Simulated user |
| Proactivity-Gym | Oh et al. | Discovery, timing and trust together | 23 model–harness combinations | Simulated time and users |

On November 2, the research firm AIMultiple gave four always-on agents a Gmail mailbox each and the same job description. Every weekday at 06:00 UTC, check six AI benchmark sites for anything new and write a report; at 10:00, fact-check a list of pages. For the next nine days, [they didn't talk to the agents or change their settings](https://aimultiple.com/always-on-agents).

Each agent ran into something different:

- Claude Duet messaged the account owner with suggestions every morning; after six days without a reply, it said it would pause its check-ins, and on November 11 neither job ran.
- Hermes Agent saved raw data from one site every day until it filled the 25 GB disk on November 5.
- Grok Bot warned up front that its routines "may start up to 15 minutes late," and one day saved only a report header.
- Dots ran all 18 scheduled jobs, and once went back two and a half hours later to rewrite its own report, reversing one of its findings.

This post is about evaluation: whether "proactive" can be measured, and what existing evaluations do and don't capture.

## Measure proactivity as four separate things

The previous post said trust has to be calibrated against evidence. For evidence to be useful, you first need to know what you're measuring. A useful always-on agent has to clear four hurdles:

| Dimension | Question | Example |
|---|---|---|
| Discovery | Did it notice what needed doing on its own? | An email says to call at 2 pm, clashing with the calendar; did it spot that? |
| Execution | Once it noticed, did it do it right? | Was the alternative time reasonable; did the email go to the right person? |
| Timing | When to speak, and whether to? | Did it stay quiet when it should; did it interrupt you while you were focused? |
| Cost | How much time and money did it take? | How many minutes until the report; how many tokens a day? |

Lump these together into one overall score and you can't see which hurdle it failed.

## Reporters' tests: you get the feel, but each task runs once

In late October, WIRED's Reece Rogers spent a day testing six always-on agents. [One test](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) was a planted challenge: the calendar had an important, unmovable meeting at 2 pm; an email said to call a mother just out of the hospital at 2 pm. Which agents would spot the conflict and flag it before 2 pm?

| Product | Score | What happened |
|---|---|---|
| Dots | 5 | Flagged it almost immediately and suggested an alternative |
| Claude Duet | 4 | Flagged it hours ahead, but offered no alternatives |
| Grok Bot, Instinct, Muse | 2 | Missed it, then said they'd watch for it in future |
| Gemini Spark | 1 | Missed it and suggested no fix |

The value of this kind of test is that it's close to real use: real products, a real inbox, situations ordinary people run into. The limit is just as clear: each task ran once, and Rogers notes sharing only a personal calendar and Gmail, a small slice of what these tools can do. Test the same agent tomorrow and the result could differ; this is n=1.

## AIMultiple's nine-day test: how not to misread it

AIMultiple went a step further than a reporter: the same job, nine weekdays, twice a day, and its own daily crawl of the six sites so it knew how many new items there were in total. Across nine days there were 47 new items. Each agent's share:

| Product | Caught | Items listed in reports | Median time to report |
|---|---|---|---|
| Hermes Agent | 0.51 (24) | 1,099 | 162 minutes |
| Grok Bot | 0.47 (22) | 33 | 13 minutes |
| Dots | 0.45 (21) | 42 | 4 minutes |
| Claude Duet | 0.26 (12) | 22 | 11 minutes |

Read only the first column and Hermes looks best. The other two columns tell a different story:

- **It caught more because it listed more**: Hermes's reports listed 1,099 items, 824 of them user-submitted test prompts from one site's community page, which no other agent reported. It caught the most and was also the noisiest.
- **Slowest, and it missed runs**: Hermes's median report took 162 minutes; one day took five hours, past the four-hour limit, which counts as a miss. The other three saved every report within 33 minutes.
- **Of the 47 items, 24 were found by only one agent**, and only 3 by all four. No single agent covered everything.

Read it alongside [the wake levels from order 1](/posts/ai/2026-11-20-always-on-agent-anatomy-en), too. This test used scheduled jobs, so it measures L2: when the time comes, does the agent do the job well? It didn't test L3, deciding for itself when to wake, but it accidentally caught an L3 side effect: Duet decided on its own to pause because the owner hadn't replied for six days.

The authors list the test's limits in their methodology:

- Whether an item was caught is labeled automatically, and manual review may raise the numbers.
- The sites are live, so new items that neither the agents nor their crawl saw aren't in the total.
- Duet ran on a working account, sharing its usage limit with the owner's own work.

OpenClaw was left out of the results because it ran on AIMultiple's own server, which several sites blocked.

## Academic benchmarks: tested in simulated worlds, with consistent results

2026 brought a set of academic benchmarks built specifically for always-on agents. They build a simulated world, hide the work that needs doing inside it, and see whether the agent can find and finish it on its own.

**AutoBuddy**: a Microsoft research team [simulated an entire company](https://arxiv.org/abs/2611.12393), with employees, projects, email, chat, documents and business systems. Each employee's to-dos are derived from events but never told to the agent. Running the same agent with 17 different models on the same 120 tasks, end-to-end scores ranged from 0.23 to 0.70. The key finding is that where tasks are lost shifts with model strength:

- Weaker models fail mainly at discovery: they never find the work.
- Intermediate models find it but often don't finish.
- The strongest models fail mainly at execution, most often on business-system operations.

Discovery precision is only weakly related to execution quality; the authors conclude that recognizing outstanding work and completing it are distinct abilities.

**VibeLifeBench**: [a life-focused version](https://arxiv.org/abs/2608.10875) from Xiaohongshu and others, with 200 tasks across ten areas of everyday life. Each task is a timeline on a simulated clock, with a median length of 29 days. The world changes on its own (weather, prices, flight delays, venue closures), and many of those changes come with no notification, so only an agent that checks back on its own notices them. Each task has a median of 58 checks, covering both the end result (did it stay within budget?) and the process (did it flag a policy change without being asked?).

**Claw-Anything**: [Aggarwal and colleagues](https://arxiv.org/abs/2605.26086) simulated months of user activity logs, more than forty services, and both phones and computers. OpenClaw-style periodic check-ins are built into the tasks too. The strongest model succeeded on the first try only 34.5% of the time, and on all three tries only 20%. In the authors' analysis, reactive tasks (where the user asks) succeeded 25.9% of the time, proactive tasks only 6.7%.

**Proactivity-Gym**: [the previous post](/posts/ai/2026-11-20-human-side-of-agents-en) covered its 30-person study. Its benchmark tested 23 model–harness combinations and found something important for anyone reading evaluations. When another model rated "trust," its scores tracked how well the task was done closely (r=0.70); they tracked whether the intervention suited the user much less (r=0.34). In other words, model judges treat "did it well" as "trustworthy," missing the timing and depth people actually care about.

All four point the same way: measure discovery and execution separately, proactive is much harder than reactive, and timing is its own dimension.

## What these benchmarks can't tell you

You can't pick a product straight from academic benchmark results, for three reasons:

- **They test models inside harnesses, not products**: AutoBuddy uses its own reference agent, and Claw-Anything uses a lightweight open-source harness. Proactivity-Gym uses OpenClaw, Claude Code and Codex. The harness, permissions and product design behind Dots, Duet or Muse aren't in the test.
- **The world is simulated**: simulated companies, simulated users, simulated time. Real inboxes are messier, and real you is harder to predict.
- **Benchmarks can have problems of their own**: [Zhu and colleagues at NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/file/f316275b44ee2de533102913828a8107-Paper-Datasets_and_Benchmarks_Track.pdf) compiled a checklist for agent benchmarks. A rigorous benchmark has to get two things right: task success has to actually reflect the capability, and the scoring has to actually detect success. Flaws in design or implementation can inflate scores or deflate them. They also advise against relying on continually updated external websites, because results can't be reproduced; tests on live sites like AIMultiple's trade reproducibility for realism.

Conversely, the reporter and AIMultiple tested real products, but with tiny samples, one person or one company. Each side holds half the picture.

## Your own one-week evaluation

The most useful evaluation for you is running one of your own routine tasks for a week.

**1. Pick a recurring task**: for example, sorting out which emails need replies every morning, tracking three competitors' websites each week, or checking your calendar for conflicts every day.

**2. Make your own answer key first**: keep doing the task yourself this week and write down what "should have been noticed." That's the equivalent of AIMultiple crawling the sites itself; without it, you only know what the agent said, not what it missed.

**3. Record four columns separately every day**:

| Date | Should have been noticed | It noticed | Of those, done right | Timing right? | Cost |
|---|---|---|---|---|---|
| Mon | 5 | 4 | 3 | Interrupted once during a meeting | Report 20 minutes late |
| Tue | … | … | … | … | … |

Also keep a column for "extras": things it listed that you didn't want. As Hermes's 824 items show, catching more isn't always better.

**4. At the end of the week, calculate three numbers**:

- Discovery rate: what it noticed ÷ what should have been noticed.
- Execution accuracy: what it did right ÷ what it noticed.
- Noise: extras ÷ everything it listed.

**5. Decide what to do next based on the results**:

- Low discovery rate → it may not be looking in the right places, or this kind of task isn't its strength; keep it yourself.
- High discovery, low execution accuracy → let it only remind you, and do the acting yourself.
- Both high, but timing often wrong → change how it notifies you, so results are batched and delivered later.
- High noise → narrow the job description and tell it what not to report.

A week is only a starting point. As the previous post said, keep checking back after you hand something off.

## Questions to ask when reading an evaluation

- Does it test products, or models inside a harness the researchers wrote?
- How many times was each task run? A single result could be luck.
- Is there an answer key? Without one, you know what it reported but not what it missed.
- Is there just one overall score, or are discovery, execution, timing and cost listed separately?
- Were scores given by people or by a model? Model judges may treat "did it well" as "trustworthy."
- Who ran the evaluation, and what interests do they have?

These questions apply to every product available in Taiwan; the evaluation reports themselves are mostly in English, but the one-week method works in any language.

Evaluation is about whether it's useful; [next](/posts/ai/2026-11-20-who-pays-for-always-on-en) is whether it's worth it. In AIMultiple's test, OpenClaw's model usage cost about $11 a day, whether or not it produced a report. An always-on agent keeps running, and someone pays for that.

## References

- [Always-On Agents: Claude Duet vs Dots vs Grok Bot](https://aimultiple.com/always-on-agents) (AIMultiple, 2026-11-16)
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/) (WIRED, 2026-10-27)
- [AutoBuddy: Evaluating Proactive, Always-On Agents on Task Discovery and Execution in a Simulated Workplace](https://arxiv.org/abs/2611.12393) (Chen et al., Microsoft, arXiv, 2026)
- [VibeLifeBench: Can Your Life Agent Be Proactive and Persistent in a Living World?](https://arxiv.org/abs/2608.10875) (arXiv, 2026)
- [Claw-Anything: Benchmarking Always-On Personal Assistants with Broader Access to User's Digital World](https://arxiv.org/abs/2605.26086) (Aggarwal et al., arXiv, 2026)
- [Foundations of Proactive Agents](https://harryoh99.github.io/foundations_of_proactive_agents/) (Oh et al., 2026, including Proactivity-Gym)
- [Establishing Best Practices for Building Rigorous Agentic Benchmarks](https://proceedings.neurips.cc/paper_files/paper/2025/file/f316275b44ee2de533102913828a8107-Paper-Datasets_and_Benchmarks_Track.pdf) (Zhu et al., NeurIPS 2025)
