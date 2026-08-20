---
title: "Stanford CS329A: A Course on Self-Improvement That Says Out Loud What It Can't Improve"
date: 2026-08-20
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, reasoning, llm]
lang: en
tldr: "CS329A is built around the generation–verification gap: models can produce the right answer but can't tell which one it is. The conclusion the course draws about itself matters more — today's methods make models more consistent, not smarter. Nine lectures are public, out of twenty."
description: "A full walkthrough of Stanford CS329A: Self-Improving AI Agents, written after watching all nine public lectures plus the three guest lectures from the first offering — the central argument, how the 34-paper reading list is grouped, the narrow band where self-improvement actually works, the syllabus diff between offerings, and what a self-learner really gets."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)

[CS329A: Self Improving AI Agents](https://cs329a.stanford.edu/) is a three-unit graduate seminar in Stanford's CS department about what happens to a model *after* it ships. It doesn't teach LangGraph. It doesn't teach CrewAI. Not one session of the quarter is about wiring frameworks together.

It teaches a gap — and then, in its final lecture, says plainly how much of that gap current methods actually close.

This piece was written after watching all nine public lectures, plus the three guest lectures from the first offering that sit on other channels. It covers what the course argues, how the 34 assigned papers are grouped, what changed between the two offerings, and how much someone outside Stanford can get. It does **not** do a paper-by-paper close reading.

## The hard facts

Two instructors. [Aakanksha Chowdhery](https://www.achowdhery.com/) led the 540B PaLM model at Google, then drove pre-training and scaling for Gemini's MoE models; she's now at Reflection AI. [Azalia Mirhoseini](http://azaliamirhoseini.com/) is a Stanford assistant professor and director of the [Scaling Intelligence Lab](https://scalingintelligence.stanford.edu/), co-creator of MoE architectures and AlphaChip, previously at Google Brain, Anthropic and Google DeepMind.

The course has run twice: Winter 2025 first, then Autumn 2025 with 99 students. **The next offering is Winter 2026–2027**, already listed in Stanford's ExploreCourses. The Stanford Online course page is stale — it still shows the 2025 autumn dates and says winter is not offered.

The prerequisites are real: CS224N or CS229S, fluent Python, and hands-on experience calling LLM APIs. **Auditing is not allowed.**

## The whole course chases one gap

Lecture 2 sets the problem up. The [Large Language Monkeys](https://arxiv.org/abs/2407.21787) line of work (arXiv:2407.21787) found that sampling one model repeatedly on a single problem makes the fraction solved at least once climb along a power law. Mirhoseini's framing in class:

> "It just seems like the models and smaller models already know the answers to these hard problems, and just by doing this repeated sampling, we are eliciting and surfacing those answers. It's just they just don't tell us that in the first trial."

The problem is picking the right one out of a hundred candidates. The same lecture gives the gap its name: plot what majority voting and reward-model ranking actually achieve against what a perfect verifier would achieve, and the distance between those two curves is the **generation–verification gap**.

Why can't majority voting close it? Because on the hardest problems, the correct answer might show up only two or three times across a thousand — or ten thousand — samples. **They're correct, but they're the minority.** A vote doesn't find them.

So every lecture that follows fills in the second half: verifiers are "how do we recognize a correct answer," reward models are "how do we turn recognition into a training signal," RL is "how do we feed the signal back into the weights." The framing earns its keep as a measuring stick — **next time you evaluate an agent technique, ask whether it improves the generation side or the verification side.** Generation-side work runs into a verification ceiling. Only verification-side work raises it.

## But the course says it plainly: more consistent, not smarter

After covering STaR, DeepSeekMath and DAPO in Lecture 6, Chowdhery draws a conclusion. It is the most honest thing in the course and the least likely to appear in any secondhand summary:

> "All three techniques will improve, in general, the majority-at-K performance... The answer formatting generally will improve. And in general, the model will be more coherent over multiple steps. But none of these will yet improve the fundamental capability, or just teach the model to solve new problems, or generalize a lot out of domain."

Concretely, on DeepSeekMath: sampling 32 times, majority@K went up and **pass@K did not**. Her words: "the model actually became more consistent, not fundamentally smarter."

The course lists "why does only majority@K increase, and pass@K doesn't" as the field's first open problem. Even the backtracking and self-correction behaviors demonstrated in class get a question mark: are those genuinely emerging, or were they always there and merely becoming statistically more frequent?

**If you're evaluating anyone's "self-improving" claims, this is the stick to measure with.** Consistency gains are real, measurable and commercially valuable — but they are a different thing from a model learning something it couldn't do, and only the first has been demonstrated.

## Self-improvement only happens in a narrow band

The same constraint shows up in three guises across three lectures. It's the most practically useful pattern in the course.

**In STaR (Lecture 6):** the model learns from problems it got right. If a batch is far beyond its ability, nothing is correct and there's nothing to learn from. In the other direction, Chowdhery notes that adding rationalization on GSM8K barely helped — forcing reasoning onto a problem already well within the model's range doesn't buy anything.

**In GRPO and DAPO (Lecture 6):** GRPO computes its advantage from the mean and standard deviation of rewards across a group of sampled answers. If every answer in a group is right, or every one is wrong, the standard deviation is zero and the normalization dies. Chowdhery states it flatly: **"If there is not a distribution of rewards, there is nothing for the model to learn."** DAPO's fix is to oversample and then throw away the all-correct and all-wrong groups entirely, keeping only the ones carrying signal.

**In Absolute Zero (Lecture 9):** the model proposes its own tasks. The proposer's reward is zero when the solver's success rate is zero, and otherwise one minus the average success rate. The system is **explicitly rewarded for generating problems the solver sometimes solves and sometimes fails.**

Three levels, one principle: self-improvement happens only at the edge of what the model can already do. Too easy and there's nothing to learn; too hard and there's no signal. It also explains why this works in math and code and struggles everywhere else.

## The real gate isn't verifiability — it's verification latency

In Lecture 9's Q&A, Mirhoseini gives a criterion far sharper than "verifiable vs. non-verifiable domains":

> "In RL fine-tuning, or in test-time scaling, we need these verifiers to be almost instant, or we can wait a little bit. Maybe we can wait minutes. Maybe we can allow one hour. But in this RL training route, we need like hundreds or thousands of steps of iteration — we can't wait like days, or someone human in the loop to collect the reward for us."

By that measure the excluded set isn't just subjective work. Scientific discovery, chip design where one simulation runs for days, chemistry that needs an actual wet lab — these are **perfectly verifiable in principle**. They're just too slow, so the loop won't turn.

The workaround offered in class is to train a reward model that predicts the simulation's outcome instead of running it. The cost is stated openly: that reward model's generality is a function of how much offline data you have, and when it's wrong it drags the whole loop off course.

## How the 34 papers are grouped

Ten lectures carry assigned readings — 34 papers, and the ordering is itself the argument:

| Lecture | Topic | Representative papers |
|---|---|---|
| 2 | Test-Time Compute Scaling | Large Language Monkeys, [Archon](https://arxiv.org/abs/2409.15254) |
| 3 | Robust Verification | [Weaver](https://arxiv.org/abs/2506.18203), [Let's Verify Step by Step](https://arxiv.org/abs/2305.20050) |
| 4 | Learning from tool and code feedback | [ReAct](https://arxiv.org/abs/2210.03629), [RLEF](https://arxiv.org/abs/2410.02089), [Constitutional AI](https://arxiv.org/abs/2212.08073) |
| 5 | Multi-step reasoning and planning | [SWiRL](https://arxiv.org/abs/2504.04736), [LATS](https://arxiv.org/abs/2310.04406), [SPRINT](https://arxiv.org/abs/2506.05745) |
| 6 | Train-Time Scaling / Scaling RL | [STaR](https://arxiv.org/abs/2203.14465), [DeepSeekMath](https://arxiv.org/abs/2402.03300), [DAPO](https://arxiv.org/abs/2503.14476) |
| 7 | Open-ended evolution of self-improving agents | [ADAS](https://arxiv.org/pdf/2505.22954), [The AI Scientist](https://arxiv.org/abs/2408.06292), AlphaEvolve |
| 8 | Search and deep research agents | [AlphaCode](https://arxiv.org/pdf/2203.07814), [Search-o1](https://arxiv.org/pdf/2501.05366) |
| 13 | Agentic frameworks for software engineering | [CodeMonkeys](https://arxiv.org/abs/2501.14723), [KernelBench](https://arxiv.org/pdf/2502.10517) |
| 14 | Giving agents memory | [Cartridges](https://arxiv.org/abs/2506.06266), [MemGPT](https://arxiv.org/abs/2310.08560), [CacheBlend](https://arxiv.org/abs/2405.16444) |
| 17 | Agentic evaluation and long-horizon tasks | [METR](https://arxiv.org/abs/2503.14499), [GDPval](https://arxiv.org/abs/2510.04374), [DeepScholar-Bench](https://arxiv.org/abs/2508.20033) |

Three results from the recordings are worth more than the abstracts.

**Archon's fusion beats oracle selection.** Hand all K candidates to a model and ask it to synthesize one new answer, and it outperforms even a perfect verifier picking the single best of the K. Selection is capped by the best candidate present; synthesis isn't. **If your best-of-N still picks one, try having the model read all of them and rewrite instead.**

**SWiRL found process-filtered data beats outcome-filtered data.** Keeping trajectories whose reasoning steps were judged good — even when the final answer was wrong — trains better than keeping only trajectories that ended correct. The explanation given in class: if you only feed the model what it already gets right, you aren't teaching it to solve anything new. The rule inverts for supervised fine-tuning, which prefers outcome-filtered data because it's imitation learning.

**DeepScholar-Bench: no system exceeds 19% across all metrics.** That lands hard in 2026, with "deep research" products everywhere. The lecture adds a more embarrassing detail: even when you **hand the systems the exact papers they should be citing**, they surface only about half the key facts.

**If you build research agents, here's tonight's exercise:** take verifiability, pull ten recent reports your system produced, and mark claim by claim which are actually supported by the source cited beside them. The fraction you can't mark is your starting point.

## Long-horizon evaluation: three benchmarks disagree, and that's the point

Lecture 17 puts three evaluations side by side and the result is divergence, not convergence — Chowdhery says outright that METR's exponential trend "gets contradicted in some ways by GDPval."

**METR measures time, but the column that matters is reliability.** The 50%-success time horizon for frontier models doubles roughly every seven months, and 2025 models reach close to an hour. Raise the bar to 80% success and the same model drops to somewhere in the teens of minutes. Chowdhery's analogy: "that's like saying you gave your task to an intern, but it only completes it 50% of the time. It might come back with an answer or it might not."

**The finding worth carrying is the contractor one.** On internal codebases, outside contractors without context run 5 to 18 times slower than the maintainers — and **model performance tracks the contractor end, not the maintainer end**. The model's current position isn't "expert in this domain." It's "a smart person with no context."

GDPval translates the same thing into economics. Score GPT-5's output against professionals with a decade-plus of experience and roughly half the tasks land as acceptable-but-subpar, only about a fifth are genuinely better than the human, and **close to three in ten are judged bad or catastrophic**. And these are tasks deliberately written to be fully specified, delivered one-shot with no iteration — that is, the score *after* everything in the human's head has been written into the prompt.

The three together point one way: **humans decide what to work on, models execute.** Chowdhery lists explicitly where the course has low confidence — tasks needing lots of context, ambiguous prompts, adversarial environments, 95%-plus reliability, and generalization beyond software and knowledge work.

## What the second offering cut

Put the two syllabi side by side and the diff is the most informative thing about this course.

**The format changed.** The first offering was a real seminar: small classroom, students presenting papers in turn, weekly discussion questions — a quarter of the grade between them.

The second moved into a lecture hall seating over a hundred. Both were **dropped entirely**, and homework went from two assignments to three, now a full half of the grade. On class size, the first lecture was understated: "because the class is big this quarter, we really can't make any exceptions."

**The content turned over too.** Cut: the AutoGen orchestration lecture, the entire GUI and computer-use session, the benchmark tour from SWE-bench through τ-bench to GAIA, and Toolformer. Added: a dedicated RL lecture on DeepSeekMath and DAPO, plus Weaver, SPRINT, AlphaEvolve, the Cartridges/CacheBlend memory session, and a full lecture on long-horizon evaluation.

The direction is unambiguous: **from "which frameworks and benchmarks exist" to "how do you feed signal back into the weights, and how do you measure long tasks."** The framework side was almost entirely cleared out.

## What the homework and projects actually are

The course site doesn't publish assignments, but three lectures mention them and the picture assembles:

- **Homework 1**: evaluate majority voting on AIME 2024/2025, then compare other ways of combining and error-checking model outputs.
- **Homework 2**: HumanEval, repeated sampling and pass@k.
- **Homework 3**: deep research agents, matching the Search-o1 thread from Lecture 8. Chowdhery explicitly encourages students to try agentic RAG variants there.

Projects are the other half of the grade. The acceptable shapes, stated in Lecture 1: a new evaluation dataset or benchmark, a reliability study of an existing agentic system, hill-climbing an existing benchmark, or questioning a design decision from an assigned paper and changing it. What isn't accepted: survey papers, and "just an app you put together and show us."

That isn't boilerplate. There's an easy-to-miss [Past Projects page](https://cs329a.stanford.edu/pastprojects.html) in the site's nav publishing five Winter 2025 student PDFs — one per acceptable shape. The most interesting is a negative result:

> "We find that only in a few cases — specifically, two datasets — the overall cost of designing and deploying the agents is lower than that of human-designed agents when deployed on over 15,000 examples. In contrast, the performance gains for other datasets do not justify the design cost, regardless of scale."

The same paper found that letting a meta-agent learn by stuffing every previous design into its context performs **worse than ignoring prior designs entirely**. Another team took Archon — the instructor's own lab's system — and went at it with added components. That students are allowed to attack the house papers is part of the course's stance.

## Ten of the assigned papers are the instructor's own

Check the 34 readings against the Scaling Intelligence Lab publication list and Mirhoseini is an author on ten: Large Language Monkeys, Archon, the Monkeys power-law follow-up, Weaver, Constitutional AI, SWiRL, SPRINT, CodeMonkeys, KernelBench, Cartridges.

How to read that depends on what you came for. Research seminars teaching their own work is normal, and her lab genuinely is a primary producer here. In the recordings she's noticeably more concrete on her own papers — which assumption is load-bearing, which step turned out to matter only in hindsight. But be clear that **you're getting the best version of one research agenda, not a survey**: the list has almost no GUI agents, no multi-agent protocols, no production observability.

The thread continues outside the classroom. In late 2025 Mirhoseini co-founded [Ricursive Intelligence](https://www.ricursive.com/) with Anna Goldie, built on exactly this recursive premise — AI designs chips, those chips train better AI — and the Series A the following month valued it at $4 billion. **This worldview isn't an academic thought experiment. It's a roadmap somebody is betting real money on.**

## What self-learners can and cannot get

Stanford Online published the recordings in August 2026, free and without enrollment. But there are **only nine**, against a twenty-session schedule. Each runs roughly 70 to 75 minutes — about 11 hours for the set.

They're worth watching, and the reason isn't the slides — it's the Q&A. Students push back in the room, and the instructors concede. When one points out that a chart's training curve sits suspiciously below its inference curve, Chowdhery's answer is: "Something suspicious is going on, OK? I copied the plot. So the graphs are not always right, as you might know from their latest release." When another argues that self-improving a small model is worse practice than distilling from a large one, she grants the point. **None of that appears in a paper abstract, and none of it appears on an AI-generated course summary site.**

Not available: the memory lecture, the open-ended evolution lecture, the software-engineering agents lecture, and **all five guest lectures** — Denny Zhou on LLM reasoning, Thang Luong on AlphaProof and Gemini's IMO gold, Misha Laskin on autonomous agent systems, Danny Driess on robotics. Not one of the second offering's guests made it out. Slides didn't either; they live in Canvas.

The first offering's guests *are* public, just hidden on other channels — that's the next section.

One warning: the secondhand write-ups already have it wrong. A course-aggregator page states this course has no public recordings. An AI-generated summary site lists the teaching term as autumn 2026 — that's when the videos went up, not when the class ran. **Go to the papers or the recordings for numbers. Don't cite summary sites.**

## The first offering's three guest lectures cover the layer the second one cut

Recordings from the first offering sit on the instructor's personal channel and the lab's channel, never entered the Stanford Online playlist, and are therefore almost never mentioned. Their content doesn't overlap the second offering at all — and it happens to fill in exactly what got cut.

**Jeff Clune on open-ended evolution** (UBC, senior advisor at DeepMind). He opens on a paradox: **for genuinely hard problems, trying harder to solve them directly makes you fail, while ignoring the objective and exploring makes you far more likely to succeed.** His example is the microwave — fund only research into "cook faster over a fire" and you never invent one, because getting there required somebody working on radar who noticed a chocolate bar melting in his pocket.

His POET algorithm admits a new environment only if it is **neither too easy nor too hard for the current agents, and different from what's already in the population.** That's the same principle as STaR's bootstrap precondition, GRPO's reward distribution and Absolute Zero's proposer reward in the second offering — except POET predates the LLM era. The control experiment is the sharp part: take the hard environments POET eventually evolved, try to solve them with direct optimization, and **every single one fails**; try a hand-designed linear curriculum, and every one fails too. The curriculum isn't an accelerant, it's the only route.

**Michele Catasta on coding agents** (president of Replit). The whole hour is about something the second offering never touches: how to design the interface between an agent and a computer. His core claim is to **narrow the agent's available actions until they're nearly deterministic** — because the model is stochastic, asking it to "browse this filesystem" might get you depth-first one time and a recursive listing the next, and then you can't parse the output the same way twice. SWE-agent's 100-line file viewport wasn't a guess; it came out of an ablation: 50 lines loses peripheral context, the whole file eats your context window.

He also gives the most useful line for anyone building agents: if you have no way to measure whether your changes point in the right direction, what you're doing is vibe-based development.

**Chi Wang on AutoGen** is most interesting because his live demo fails. The voice agent keeps announcing to the user "I will repeat the question to you and then get the answer from you" — because the realtime voice API only knows about a "user," not about other agents, so they had instructed it to relay the other agents' questions, and the model spoke the system instruction out loud. He debugs it on the spot in front of the class, then says: it's easy to claim the future of software is agentic; delivering it is not.

He also says something that partly explains why the second offering deleted the framework layer entirely: **if you have the right domain knowledge you usually don't need a complex multi-agent system — you just need the right decomposition and the fewest agents. Getting the decomposition right is the hard part.**

## The trade

What you get is a coordinate system with real internal logic, plus a reading list curated by people doing the work. What you pay is that it's partial, not neutral, and mostly not public.

But the thing most worth carrying away is a qualifier. A whole quarter on making models improve themselves ends with the instructors saying, out loud, that today's methods make models more consistent, more coherent and better formatted — **and not yet smarter**. Coming from two people who have trained frontier models end to end, that carries more weight than any outside critique.

For a self-learner the practical move is to **treat the syllabus as a reading map and the nine recordings as a guided tour**. The scarce thing was never the 34 papers; they're all on arXiv. It's which 34, how they're grouped, and what the instructors admitted under questioning.

If you only have an afternoon, watch Lecture 2 (Test-Time Compute Scaling) and Lecture 6 (Train-Time Scaling / Scaling RL). One opens the gap; the other says how far it's been closed.

## Appendix: comparison conditions for the numbers above

- **Weaver's 87.7%**: generator is Llama 3.3 70B Instruct, verifiers an ensemble of judges and reward models at 70B or smaller, averaged across several reasoning and math tasks. The paper's comparison points are GPT-4o at 69.0% and o3-mini at 86.7%. Distilling to a 400M cross-encoder retains 98.7% of accuracy (the lecture said "about 97%"; the paper's figure is used here).
- **DeepScholar-Bench's 19%**: no system exceeded a score of 19 across *all* metrics, the three axes being knowledge synthesis, retrieval quality and verifiability; queries come from recent arXiv papers across 22 domains and refresh monthly. The lecture adds that even when handed the exact sources, systems surface only about half the key facts.
- **DeepSeekMath's majority@K vs pass@K**: the lecture describes a 32-sample setting where majority@K rose and pass@K did not.
- **DAPO's ablation**: on Qwen-32B against AIME, a GRPO baseline near 30 climbs to roughly 50 as overlong filtering, asymmetric clipping, soft overlong punishment, token-level loss and dynamic sampling are added. This is the ladder as narrated in the lecture, not a cell-by-cell transcription of the paper's table.
- **METR's time horizon**: the v4 paper is titled *Measuring AI Ability to Complete Long **Software** Tasks*. It measures the human-completion time of tasks a model finishes with 50% success, over roughly 170 tasks in three suites: SWAA (~66 tasks, 1–30 seconds), HCAST (~97 tasks, 1 minute to 30 hours) and RE-Bench (~7 tasks, up to 8 hours). The human baseline is the geometric mean of successful completion times by professionals with about five years of experience — with the lecture's own caveat that experienced people underestimate difficulty, and not necessarily where the model finds things hard. The abstract's frontier figure is o3 at around 110 minutes; the lecture's worked example is Claude 3.7 Sonnet at about 59 minutes for 50% success and roughly 15 minutes for 80%.
- **"Contractors run 5 to 18 times slower"**: the gap on internal codebases between outside contractors without project context and long-term maintainers, as relayed in the lecture from METR's analysis.
- **SWE-bench caveat**: the lecture notes annotators tend to underestimate, and models have seen most of the GitHub repos, so doubling times measured on SWE-bench come out shorter than they would on a genuinely unseen repository.
- **GDPval**: 44 occupations across the top nine sectors of US GDP, roughly 1,320 tasks with an open-sourced gold subset of 220, sourced from professionals with a decade-plus of experience. Win rates range from GPT-4o at 12.4% to Claude Opus 4.1 at 47.6%. GPT-5's output quality breaks down as roughly half acceptable-but-subpar, about a fifth where the model is genuinely better, and close to three in ten bad or catastrophic — with some disagreement among human graders. Tasks are deliberately well-specified (about 89% vetted as such), one-shot, with no iterative back-and-forth.
- **Intelligence per Watt's 5.3×**: the improvement in intelligence per watt from 2023 to 2025, decomposed in the lecture as 3.1× from models and 1.7× from hardware. The frequently conflated 88.7% is a *query coverage* figure — the share of queries at least one local model (≤20B active parameters) answers correctly — and is a separate measurement.

## References

- [Stanford CS329A: Self-Improving AI Agents course site](https://cs329a.stanford.edu/)
- [CS329A Past Projects (Winter 2025 student work)](https://cs329a.stanford.edu/pastprojects.html)
- [CS329A Winter 2025 syllabus (Wayback Machine snapshot)](https://web.archive.org/web/20250221002318/https://cs329a.stanford.edu/)
- [CS329A lecture playlist (Stanford Online, 9 videos)](https://www.youtube.com/playlist?list=PLangBM27OtEA)
- [Lecture 2: Test-Time Compute Scaling](https://www.youtube.com/watch?v=-Ggc37xLj_Y)
- [Lecture 6: Train-Time Scaling / Scaling RL](https://www.youtube.com/watch?v=yVnmHSAy3ck)
- [Lecture 9: Future Research Areas](https://www.youtube.com/watch?v=AyO6wyu4DEg)
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
