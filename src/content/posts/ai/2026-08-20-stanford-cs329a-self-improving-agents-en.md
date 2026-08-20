---
title: "Stanford CS329A: A Course Built Around One Gap — Models Can Produce the Right Answer, but Can't Tell Which One It Is"
date: 2026-08-20
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, reasoning, llm]
lang: en
tldr: "CS329A doesn't teach agent frameworks. It teaches the generation–verification gap: a model's chance of producing a correct answer far exceeds its chance of recognizing which one is correct. All 34 assigned papers hang off that thread, and 10 of them are the instructor's own. Nine lectures are public — out of twenty. None of the five guest lectures made it out."
description: "A full walkthrough of Stanford CS329A: Self-Improving AI Agents — the course's central argument, how its 34-paper reading list is grouped, what got cut between the two offerings, the five public student projects, and exactly what a self-learner can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)

[CS329A: Self Improving AI Agents](https://cs329a.stanford.edu/) is a three-unit graduate seminar in Stanford's CS department about what happens to a model *after* it ships — how it keeps getting better. It doesn't teach LangGraph. It doesn't teach CrewAI. Not one session of the quarter is about wiring frameworks together.

What it teaches is a gap.

This piece covers the course itself: what it argues, how the 34 assigned papers are grouped, what changed between its two offerings, and how much of it someone outside Stanford can actually get. It does **not** do a paper-by-paper close reading — that's a different project entirely.

## The hard facts

Two instructors. [Aakanksha Chowdhery](https://www.achowdhery.com/) led the 540B PaLM model at Google, then drove pre-training and scaling for Gemini's MoE models; she's now at Reflection AI. [Azalia Mirhoseini](http://azaliamirhoseini.com/) is a Stanford assistant professor and director of the [Scaling Intelligence Lab](https://scalingintelligence.stanford.edu/), co-creator of MoE architectures and AlphaChip, previously at Google Brain, Anthropic and Google DeepMind.

The course has run twice: first in Winter 2025, then again in Autumn 2025 with 99 students enrolled. **The next offering is Winter 2026–2027**, already listed in Stanford's ExploreCourses. Note that the Stanford Online course page is stale — it still shows the 2025 autumn dates and says winter is not offered. Don't treat it as current.

The prerequisites are real, not decorative: CS224N or CS229S, fluent Python, and hands-on experience calling LLM APIs. **Auditing is not allowed.**

## The whole course chases one gap

Lecture 2 sets up the problem. The [Large Language Monkeys](https://arxiv.org/abs/2407.21787) line of work (arXiv:2407.21787) found that if you sample the same model repeatedly on one problem, the fraction of problems it solves at least once climbs with sample count following a power law. The model *does* know the answer. It just doesn't produce it on the first draw.

The problem is picking the right one out of a hundred candidates.

Mirhoseini opens Lecture 3 by naming it directly:

> "Language model seems to know the answer to many of the hard questions, and especially with methods such as repeated sampling, or other scaling test time techniques, they can generate one. But a question is, how can we automatically select which answer is correct, or guide the model throughout the process of answer generation?"

That's the generation–verification gap. Everything that follows is an attempt to fill in the second half: verifiers are "how do we recognize a correct answer," reward models are "how do we turn that recognition into a training signal," RL is "how do we feed the signal back into the weights" — and the long-horizon evaluation lecture argues we haven't even solved *knowing whether the task got done*.

The framing earns its keep by collapsing a pile of seemingly unrelated techniques into one coordinate system. **Next time you evaluate an agent technique, ask first whether it's improving the generation side or the verification side.** Generation-side improvements — bigger models, more samples, longer thinking — run into a verification ceiling. Only verification-side work raises the ceiling.

Lecture 3 closes on [Weaver](https://arxiv.org/abs/2506.18203) (arXiv:2506.18203), out of Mirhoseini's own lab: instead of training one strong verifier, combine a pile of weak ones (LLM judges, reward models) with learned weights. A mid-sized open model as generator, paired with an ensemble of same-tier verifiers, reaches o3-mini-level average accuracy — and o3-mini got there through extensive post-training. (Exact figures and their comparison conditions are in the appendix.)

The lecture also covers a follow-up that matters more for engineers: distill the whole verifier ensemble into a single 400M cross-encoder, and accuracy barely moves. The instructor added, on the spot:

> "And these distilled version, and the original version — they're all open-sourced, and the checkpoints are available, if any of you are interested in working with them in your agentic or test-time scaling projects."

**That's the part you can act on tonight.** If your best-of-N selection logic is still majority voting, drop Weaver's distilled checkpoint in as a reranker and run an A/B. Majority voting is exactly the baseline the lecture compares against, and it loses badly.

## How the 34 papers are grouped

Ten lectures carry assigned readings — 34 papers total, and the ordering is itself the argument:

| Lecture | Topic | Representative papers |
|---|---|---|
| 2 | Test-Time Compute Scaling | Large Language Monkeys, [Archon](https://arxiv.org/abs/2409.15254) |
| 3 | Robust Verification | Weaver, [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| 4 | Learning from tool and code feedback | [ReAct](https://arxiv.org/abs/2210.03629), [RLEF](https://arxiv.org/abs/2410.02089), [Constitutional AI](https://arxiv.org/abs/2212.08073) |
| 5 | Multi-step reasoning and planning | [SWiRL](https://arxiv.org/abs/2504.04736), [LATS](https://arxiv.org/abs/2310.04406), [SPRINT](https://arxiv.org/abs/2506.05745) |
| 6 | Train-Time Scaling / Scaling RL | [STaR](https://arxiv.org/abs/2203.14465), [DeepSeekMath](https://arxiv.org/abs/2402.03300), [DAPO](https://arxiv.org/abs/2503.14476) |
| 7 | Open-ended evolution of self-improving agents | [ADAS](https://arxiv.org/pdf/2505.22954), [The AI Scientist](https://arxiv.org/abs/2408.06292), AlphaEvolve |
| 8 | Search and deep research agents | [AlphaCode](https://arxiv.org/pdf/2203.07814), [Search-o1](https://arxiv.org/pdf/2501.05366) |
| 13 | Agentic frameworks for software engineering | [CodeMonkeys](https://arxiv.org/abs/2501.14723), [KernelBench](https://arxiv.org/pdf/2502.10517) |
| 14 | Giving agents memory | [Cartridges](https://arxiv.org/abs/2506.06266), [MemGPT](https://arxiv.org/abs/2310.08560), [CacheBlend](https://arxiv.org/abs/2405.16444) |
| 17 | Agentic evaluation and long-horizon tasks | [METR](https://arxiv.org/abs/2503.14499), [GDPval](https://arxiv.org/abs/2510.04374), [DeepScholar-Bench](https://arxiv.org/abs/2508.20033) |

The last lecture's reading deserves singling out. [DeepScholar-Bench](https://arxiv.org/abs/2508.20033) (arXiv:2508.20033) asks systems to write the related-work section of a paper, drawing queries from recent arXiv papers to dodge contamination. The authors' finding: **no system exceeds a score of 19% across all metrics.**

That number lands hard in 2026. "Deep research" products are everywhere, but score them on knowledge synthesis, retrieval quality and verifiability and every one of them sits far below passing.

**If you build research agents, here's tonight's exercise.** Take verifiability — one of the three axes — pull ten recent reports your system produced, and go claim by claim marking which ones are actually supported by the source cited next to them. The fraction you can't mark is your starting point, and it will probably look worse than you expect.

## What the second offering cut

Put the two syllabi side by side and the diff is the most informative thing about this course.

**The format changed.** The first offering was a real seminar: small classroom, students took turns presenting papers, weekly discussion questions due before class — those two together were a quarter of the grade.

The second offering moved into a lecture hall seating over a hundred. Both of those were **dropped entirely**, and homework went from two assignments to three, now carrying a full half of the grade. On the subject of class size, the first lecture was understated: "because the class is big this quarter, we really can't make any exceptions."

**The content turned over too.** Cut: the AutoGen agent-orchestration lecture, the entire GUI and computer-use session, the benchmark tour running from SWE-bench through τ-bench to GAIA, and Toolformer. Added: a dedicated RL lecture built on DeepSeekMath and DAPO, plus Weaver, SPRINT, AlphaEvolve, the Cartridges/CacheBlend memory-systems session, and a full lecture on long-horizon evaluation.

The direction is unambiguous: **from "which frameworks and benchmarks exist" to "how do you feed signal back into the weights, and how do you measure long tasks."** The framework side was almost entirely cleared out. If you're weighing which orchestration framework deserves your study time, this course answered that question across an eight-month gap.

## Projects must be research, not artifacts

Half the grade is the project. Mirhoseini spells out the acceptable shapes in Lecture 1: a new evaluation dataset or benchmark, a reliability study of an existing agentic system, hill-climbing an existing benchmark, or questioning a design decision from one of the assigned papers and changing it.

What isn't accepted is equally blunt: survey papers, and "just an app you put together and show us."

This isn't boilerplate. There's an easy-to-miss [Past Projects page](https://cs329a.stanford.edu/pastprojects.html) in the course site's nav, publishing five Winter 2025 student project PDFs — one per acceptable shape, as it happens. The most interesting is a negative result:

> "We find that only in a few cases — specifically, two datasets — the overall cost of designing and deploying the agents is lower than that of human-designed agents when deployed on over 15,000 examples. In contrast, the performance gains for other datasets do not justify the design cost, regardless of scale."

The same paper found that letting a meta-agent learn by stuffing every previous design into its context performs **worse than ignoring prior designs entirely**. Another team took Archon — the instructor's own lab's system — and went at it with added components. That students are allowed to attack the house papers is itself part of the course's stance.

## Ten of the assigned papers are the instructor's own

Check all 34 assigned readings against the Scaling Intelligence Lab publication list and Mirhoseini is an author on ten: Large Language Monkeys, Archon, the Monkeys power-law follow-up, Weaver, Constitutional AI, SWiRL, SPRINT, CodeMonkeys, KernelBench, and Cartridges.

How to read that depends on what you came for. Research seminars teaching their own work is normal, and her lab genuinely is one of the primary producers on this topic. But be clear that **you're getting the best version of one specific research agenda, not a survey of the field** — the list has almost no GUI agents, no multi-agent communication protocols, no production observability.

The thread continues outside the classroom. In late 2025, Mirhoseini co-founded [Ricursive Intelligence](https://www.ricursive.com/) with Anna Goldie, built on exactly this idea of recursive self-improvement — AI designs chips, those chips train better AI — and the Series A the following month valued it at $4 billion. **This course's worldview isn't an academic thought experiment. It's a roadmap somebody is betting real money on.**

## What self-learners can and cannot get

Stanford Online published the recordings in August 2026, free and without enrollment. But there are **only nine**, against a twenty-session schedule.

Available: course overview, test-time scaling, robust verification, learning from feedback, multi-step reasoning, RL, deep research agents, long-horizon evaluation, and future directions. Each runs roughly 70 to 75 minutes — about 11 hours for the set.

Not available: the memory lecture, the open-ended evolution lecture, the software-engineering agents lecture, and **all five guest lectures** — Denny Zhou on LLM reasoning, Thang Luong on AlphaProof and Gemini's IMO gold medal, Misha Laskin on autonomous agent systems, Danny Driess on robotics. The guests are the hardest part of this course to reproduce on your own, and not one of them made it out. Slides didn't either; they live in Canvas.

Recordings from the first offering are scattered on other channels and don't overlap at all: Jeff Clune on open-ended agent learning, Michele Catasta (president of Replit) on coding agents, Chi Wang on AutoGen. None of those have a counterpart in the second offering, which makes them genuinely exclusive.

One warning: the existing secondhand write-ups already have it wrong. One course-aggregator page states this course has no public recordings. An AI-generated summary site lists the teaching term as autumn 2026 — that's when the videos went up, not when the class ran. **Go to the papers for numbers. Don't cite summary sites.**

## The trade

What you get is a coordinate system with real internal logic, plus a reading list curated by people doing the work. What you pay is that it's partial, not neutral, and mostly not public.

For a self-learner the practical move is to **treat the syllabus as a reading map and the nine recordings as a guided tour** — not to expect a complete online course. The scarce thing was never the 34 papers; they're all on arXiv. The scarce thing is *which* 34, how they're grouped, and which ones made the first offering only to get cut from the second.

If you only have an afternoon, watch Lecture 3 (Robust Verification) and Lecture 8 (Agentic Evaluations). One is about recognizing a correct answer; the other is about how badly we still measure "correct." The head and the tail of the whole thing.

## Appendix: comparison conditions for the numbers above

- **Weaver's 87.7%**: generator is Llama 3.3 70B Instruct, verifiers are an ensemble of judges and reward models at 70B or smaller, and the figure is an average across several reasoning and math tasks. The paper's stated comparison points are GPT-4o at 69.0% and o3-mini at 86.7%.
- **The distilled model's 98.7%**: the share of the full ensemble's accuracy retained after distilling from the 70B tier down to 400M. The lecture said "about 97%" out loud; the paper's figure is used here.
- **DeepScholar-Bench's 19%**: means no system exceeded a score of 19 across *all* metrics, the three axes being knowledge synthesis, retrieval quality and verifiability.
- **METR's time horizon**: the v4 paper is now titled *Measuring AI Ability to Complete Long **Software** Tasks*. It measures the human-completion time of tasks a model finishes with 50% success, over a task set of RE-Bench, HCAST and 66 novel shorter tasks. The authors add their own external-validity caveat in the abstract. The syllabus still links it under the older title.
- **GDPval**: covers 44 occupations across the top nine sectors of US GDP, with tasks built from professionals averaging 14 years of experience; the open-sourced gold subset is 220 tasks.

## References

- [Stanford CS329A: Self-Improving AI Agents course site](https://cs329a.stanford.edu/)
- [CS329A Past Projects (Winter 2025 student work)](https://cs329a.stanford.edu/pastprojects.html)
- [CS329A Winter 2025 syllabus (Wayback Machine snapshot)](https://web.archive.org/web/20250221002318/https://cs329a.stanford.edu/)
- [CS329A lecture playlist (Stanford Online, 9 videos)](https://www.youtube.com/playlist?list=PLangBM27OtEA)
- [CS329A Winter 2025 playlist (includes Jeff Clune and Michele Catasta guest lectures)](https://www.youtube.com/playlist?list=PL3058ht9NqT1NG6Y663elpHSDh-AW1TIr)
- [Stanford Online: CS329A course page (SCPD non-degree entry)](https://online.stanford.edu/courses/cs329a-self-improving-ai-agents)
- [Weaver: Shrinking the Generation-Verification Gap with Weak Verifiers](https://arxiv.org/abs/2506.18203)
- [Large Language Monkeys: Scaling Inference Compute with Repeated Sampling](https://arxiv.org/abs/2407.21787)
- [DeepScholar-Bench: A Live Benchmark for Generative Research Synthesis](https://arxiv.org/abs/2508.20033)
- [Measuring AI Ability to Complete Long Software Tasks (METR)](https://arxiv.org/abs/2503.14499)
- [GDPval: Evaluating AI Model Performance on Real-World Economically Valuable Tasks](https://arxiv.org/abs/2510.04374)
- [Scaling Intelligence Lab publications](https://scalingintelligence.stanford.edu/pubs/)
- [Ricursive Intelligence](https://www.ricursive.com/)
- On this site: [Stanford CS146S syllabus diff across two offerings](/posts/ai/2026-08-16-cs146s-course-map-en)
- On this site: [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Chinese)
