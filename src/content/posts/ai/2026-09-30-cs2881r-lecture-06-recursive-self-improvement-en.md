---
title: "CS2881R L6: Will AI Doing AI R&D Trigger an Intelligence Explosion?"
date: 2026-09-30
category: ai
type: guide
tags: [cs2881r, ai-course, harvard, ai-safety, recursive-self-improvement, scaling-laws]
lang: en
series:
  name: "Reading Harvard CS2881R"
  order: 10
tldr: "Lecture 6 of Harvard CS 2881R (Fall 2025) had no guest. Boaz Barak used the differential equations of growth theory to ask one question: if AI starts doing its own AI research, does the capability curve stay exponential, blow up into a singularity, or get dragged down by bottlenecks? The answer hinges on a few exponents nobody can measure well. He used Baumol's cost disease, the century-long 2% puzzle in US GDP per capita, and Jones's idea-based growth model to show why both bottlenecks and acceleration are plausible, then took apart the multipliers behind AI 2027. His conclusion: the only scenario he can rule out is 'AI has little effect on R&D.'"
description: "A guide to Lecture 6 (Recursive Self-Improvement) of Harvard CS 2881R AI Safety, Fall 2025: defining intelligence as METR task length, three growth equations, Baumol's cost disease, Jones's idea-based growth, a Cobb-Douglas model where compute and intelligence grow together, heavy-tailed task automation; a student experiment comparing tree and star multi-agent setups; the class's estimates for AI 2027's superhuman coder; and four readings: Takeoff Speeds, Three Types of Intelligence Explosion, Epoch GATE, and AI in 2030."
draft: false
glossary:
  - term: "Baumol's cost disease"
    aliases: ["Baumol cost disease", "Baumol effect"]
    definition: "When one sector's productivity jumps, its share of the economy shrinks; the sectors still tied to human labor become relatively more expensive and end up as the bottleneck."
    context: "CS2881R L6 uses it to argue that even if AI speeds up some parts of research dramatically, overall speed may still be limited by the parts it doesn't speed up."
  - term: "superhuman coder"
    aliases: ["SC"]
    definition: "A milestone in the AI 2027 scenario: an AI system that can do any coding task the best engineer at a leading AGI company does, while being faster and cheaper."
    context: "In L6, students estimated how long a task, at 80% success on METR's benchmark, a model would need to handle to count as reaching this milestone."
    links:
      - label: "AI 2027"
        url: "https://ai-2027.com/"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs2881r-lecture-06-recursive-self-improvement)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 term of Harvard CS 2881R.** It is part 10 of the [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en) series and covers official Lecture 6, Recursive Self-Improvement (October 9, 2025).

A note on the change in register. [The previous post on L10](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en) looked inside a single model: activations, steering vectors, CoT. This one pulls back to the speed of the whole industry: if AI starts doing AI research for us, what does the progress curve look like? The tools change too, from linear algebra to the differential equations of growth economics. This series places official Lecture 6 after Lecture 10 because detection tools and timelines are different kinds of questions, so it finishes the first before taking on the second.

The course site gives this lecture a single framing question: Is AI R&D an "AI-complete" task? In other words, to automate AI research, do you first need a general AI that can do everything, or is a narrow AI that writes code and runs experiments enough?

## Course video sources

The official Fall 2025 schedule and the official YouTube playlist (AI Safety, 17 videos) were checked live on 2026-10-10; the recording for this lecture is listed there.

```youtube
url: https://www.youtube.com/watch?v=wzep3Rnv6iw
title: AI Safety (CS 2881) Lecture 6: Recursive Self Improvement
```

Original videos: [AI Safety (CS 2881) Lecture 6: Recursive Self Improvement](https://www.youtube.com/watch?v=wzep3Rnv6iw)

Course and recording entries:

- [harvard-cs2881r — official course materials and recording index](https://boazbk.github.io/mltheoryseminar/fall2025/)
- [CS2881R Fall 2025 official YouTube playlist (AI Safety, 17 videos)](https://www.youtube.com/playlist?list=PL_b4B2IWlal3j01Rbj5ebT663E7x4bl_W)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): I read the full auto-generated captions of “Lecture 6: Recursive Self Improvement” (2:29:32) and confirmed Boaz asking GPT-5 to extrapolate the METR curve, Chad Jones's GDP chart and the “talked over the weekend” remark, the ten-person economy example (the captions never say Baumol), the intelligence function and the p-exponent singularity discussion, the students' multi-agent experiment (LangGraph, Inspect, Kaggle), the five-minute table discussion on X, the 250x and 2,000x multipliers, the new-religion joke, Windows 3.1 and the OpenAI charter; the captions do not contain the binary-tree 0.916 and other experiment numbers or the Lifland/Jurkovic estimates, which come from the weekly summary and slides. The student experiment's position was given as exact times, but the captions have no time codes, so it is now approximate.

## Official materials and access

| Material | Status |
|---|---|
| [Lecture video](https://youtu.be/wzep3Rnv6iw) (about 2.5 hours) | Public; Boaz lectures, no guest |
| [Lecture slides](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/ESGsKxa1G79Gv4T9O4g9ZJkBIZd4CWudXEzLmBvdpLbkmg?e=fci9ky) (Harvard SharePoint) | Public and downloadable without login (`AISafety_Fall25_lec6_rsi.pptx`, 31 slides); the equations, the Baumol example, the AI 2027 estimates, and the list of conclusions in this post were checked against the slide text. Slides 5–6, 20–22, 25, and a few others are image-only |
| [LessWrong Week 6 summary](https://www.lesswrong.com/posts/DonyTLfGkyRyvJqwG/cs-2881r-week-6-recursive-self-improvement) (Joshua Qin, Mohammad Khan, Jaray Liu) | Public; writes up the lecture's equations and the student experiment's numbers |
| Reading list | Public: four pre-readings plus ten further readings |
| Student experiment | The course site's "Experiment" field says To be determined, with one idea: an experiment on how much broad general skill success in a narrow task like coding or AI requires. The video and the LessWrong summary show a student group presenting a multi-agent experiment (see below), but the site lists no slides or GitHub repo |

The series as a whole is rated A3 with a list of gaps (see the [series overview](/posts/ai/2026-09-30-cs2881r-course-overview-en)). This lecture alone has no assignment or experiment code to follow, so it is closer to **A2** as defined in the [course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): the video, student summary, and reading list are enough to follow the argument, and practice is up to you.

## Opening discussion: the more numbers in a forecast, the more careful you should be

Boaz opened by asking for reactions to the readings. A few observations ran through the rest of the lecture:

- **Opaque methodology**: one student said that apart from the Epoch piece, the readings had many "n% chance" claims with little explanation of how they were derived, making it hard to know how much to trust them. Boaz said he worries about an "illusion of precision": if he gave you the whiteboard's length to seven significant digits, you'd know he was bluffing, because all he has to measure with is his hands.
- **Software progress is underrated**: another student noticed that much of the exponential growth comes from software, not just hardware. Boaz added that "software" here is not only coding but lots of experiments and ML research that squeeze more out of the same compute.
- **Too comfortable extrapolating**: one student said scaling laws and Moore's law have held so far, but nobody knows whether we'll hit a bottleneck that needs a new algorithmic breakthrough. Another said these pieces give a frictionless upper bound with no regulation, and it would help to see a lower bound too.

Boaz then pointed to a tension in the readings. Epoch's AI in 2030 takes something close to the bitter-lesson position: extrapolate by focusing on compute rather than software improvements. If what drives AI is compute rather than human ingenuity, then AI automating AI research may give less lift than hoped, because humans are only somewhat inefficient at using compute today.

## Defining "intelligence" with METR task length

Boaz returned to the [METR plot](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/) he had shown in Lecture 1: the length of tasks (measured in human completion time) that models can complete with 50% success doubles roughly every seven months. He had asked GPT-5 to extrapolate it, and the result put a full 8-hour workday of tasks around early 2027, and about 30 hours, roughly four workdays, by 2028.

He then defined a rough "intelligence function" I(t): the METR task length AI can complete at a fixed success rate, budget, and time. The question becomes: how does I(t) grow?

### Three growth equations

| Assumption | Recurrence | Differential equation | Solution |
|---|---|---|---|
| Fixed gain per unit time | I(t+1) = I(t) + c | dI/dt = c | Linear |
| More intelligence, more growth | I(t+1) = c·I(t) | dI/dt ∝ I | Exponential |
| More intelligence, same growth in less time | e.g., AIs run faster | dI/dt ∝ I² | Blows up in finite time |

In general, with dI/dt ∝ I^p: p < 1 gives polynomial growth, p = 1 exponential, and p > 1 diverges in finite time, a singularity. The whole debate over recursive self-improvement (RSI) is a debate about p.

## The case for bottlenecks: Baumol's cost disease

The first counterargument comes from economics. Boaz walked through a ten-person economy:

1. Half are farmers and half are teachers, each earning $1 a day. Each farmer makes six meals a day, enough for themselves and one more person; each teacher teaches four children. Half of GDP is farming, half is teaching.
2. An invention makes farmers five times as productive: 30 meals a day.
3. People only eat three meals a day and don't need that much food, so many switch to teaching. Wages have to equalize, or nobody would teach.
4. Result: farming, the sector whose productivity soared, drops from half of GDP to a tenth.

Applied to AI: even if AI makes some parts of research much faster, the parts it doesn't speed up end up setting the pace.

## The case for acceleration: ideas don't get used up

The second observation is a puzzle nobody can fully explain: US GDP per capita has grown about 2% a year for the past 120 to 150 years, and electricity, cars, and the internet didn't bend the line. Boaz said the plot came from a paper by Chad Jones (slide 13 cites "The outlook for long-term economic growth," NBER 2023), whom he had spoken to that weekend, and Jones doesn't know exactly why either.

He noted that the literature often talks about 100% annual GDP growth or a singularity, but even if AI only pushed 2% to a sustained 5%, or 10% for a decade, the world would look completely different from the last 150 years.

Jones's explanation is that economies grow because populations grow: more people means more researchers and more ideas. Unlike food, ideas can be shared without running out. An idea that doubles farm yields can be used by every farmer, which is why growth happens per capita. Boaz wrote this as a differential equation (researchers contribute with exponent λ, ideas get harder to find with exponent β), assumed every quantity grows exponentially, and got that the ratio of productivity growth to researcher growth is λ/β. If AI turns productivity back into more "researchers," that feedback could lead to explosive growth.

He did not claim it must explode. His point was that if you accept that growth comes from more people discovering ideas, then automating idea discovery should raise growth. No law of nature says growth has to be 2%, and even if it settles on a new plateau, that plateau could be well above 2%.

## Inputs to AI research: compute, ideas, data

Boaz split AI's inputs into three: compute, algorithmic ideas, and data. To simplify, he made an optimistic assumption: no new data needed, with compute substituting for data the way it did in AlphaZero. He also flagged two constraints he was setting aside but considered important:

- **Ideas are sequential**: research stands on earlier work and can't be parallelized without limit.
- **Experiments take time**: AI research sits between pure desk work (like proving theorems) and lab science; compute experiments still have to run. AI in 2030 discusses this desk-versus-lab distinction.

He also noted a tension: some discussions assume AI only needs to be good at AI research, not at anything else. But if the models it builds are supposed to do things beyond research, you may still need more data. That is another way of asking whether AI R&D is AI-complete.

### Compute and intelligence have to grow together

Next came a Cobb-Douglas-style production function: intelligence grows as dI/dt ∝ I^α · C^(1−α), with the two inputs not fully substitutable. Assume compute growth also depends on intelligence, dC/dt ∝ I^c. Plugging in exponential solutions, only c = 1 lets both grow exponentially together; c < 1 gives polynomial growth (RSI "fizzles"); c > 1 diverges in finite time. The LessWrong summary writes up the same result.

### Heavy-tailed task automation

The last model takes the task view. Suppose a company's work is made of many tasks whose complexity (in human time) follows a heavy-tailed distribution: most tasks take under a day, a few take much longer. At time t, every task with complexity below I(t) has been automated.

If I(t) grows exponentially and the distribution's tail decays polynomially, the fraction of tasks not yet automated falls exponentially. Boaz's intuition: once half the tasks are automated, seven months later it's three quarters, and seven months after that seven eighths.

A student immediately pointed out that this assumes the set of tasks stays fixed. Boaz agreed that's clearly false: people move on to things they couldn't do before, and a company in 2027 isn't doing its 2024 work. Humans might always be doing more advanced things and adding value on top of AI, or at some point they might not keep up. Another student asked whether AI should count as labor or capital. Boaz said that's unclear and suggested saving it for the economists coming later (see [L9 economic impacts](/posts/ai/2026-09-30-cs2881r-lecture-09-economic-impacts-en)).

## Student experiment: can a tree of agents solve harder tasks?

Starting around 1:00 and lasting roughly 35 minutes (positions estimated from the captions), a group of four presents an experiment; the LessWrong summary also reports the results. Their question: if one model can solve tasks of difficulty K, can combining several solve tasks of arbitrary difficulty? The RSI angle is that labs might speed up AI research through organizational structure, not only through a single stronger model.

Setup:

- **Three architectures**: a single GPT-5; a depth-2 binary tree (the root splits the task in two and delegates down, leaves implement, results are integrated upward); and a star graph (one hub delegates directly to several leaves). Both multi-agent setups used seven nodes.
- **Tools**: LangGraph for the agent graphs, the UK AI Security Institute's Inspect for evaluation, and datasets from Kaggle.
- **Two tasks**: classifying a medical dataset (training a model), and identifying which family of distributions datasets came from (exploratory data analysis).

Results (per the LessWrong summary): on medical classification, the binary tree reached 0.916 accuracy, the star graph 0.890, and the single agent 0.854. Boaz raised a control issue on the spot: the multi-agent setups used seven GPT-5 calls against the single agent's one, so the fair comparison is best-of-seven. The students agreed but didn't have the budget to run it. On exploratory data analysis, all three did much worse than expected.

Their qualitative observations were more interesting than the numbers:

- **The binary tree explored more**: the root often proposed two different methodologies and gave one to each child.
- **The star graph was closer to brute force**: it listed candidate distributions and had each child check one.
- **Structured tasks split more easily than open ones**: when training a model, one child doing preprocessing and another building the model is natural; open exploration had no obvious split. That may be one barrier to RSI, since research involves a lot of open-ended exploration.
- **Safety issues**: all agents shared one working directory and could in principle read and edit each other's files; some agents attempted operations they shouldn't have. Children only saw their own subtask, not the higher-level goal, and could drift locally from the overall intent. They called this the "alignment cost" of delegation.
- **Parallel subtasks must be spelled out**: at first, sibling nodes waited on each other's output. Once the prompt said delegated subtasks had to be completable independently, the analysis node learned to generate its own dummy data to test its code.

## Where AI 2027's numbers come from

In the second half, Boaz went back to [AI 2027](https://ai-2027.com/), read in Lecture 1, and took apart its RSI assumptions. The scenario has two stages: first a superhuman coder appears (able to do any coding task the best engineer at a leading AGI company does, faster and cheaper), then it kicks off recursive improvement. AI 2027 maps the superhuman coder to some task length X at 80% success on METR's benchmark.

### Class estimates: what should X be?

Before showing the authors' numbers, Boaz gave each table five minutes to discuss. The answers were widely spread:

- **A day to a week**: people go home each day and lose some context, and check in with a manager weekly with deliverables, so these are natural units.
- **Two to four weeks**: based on whether tasks can be decomposed.
- **Three months to a year**: one student said their projects run about three months; another said NeurIPS and ACL happen once a year, so a year is one milestone; someone else said it takes six months to a year to bring a new hire fully up to speed.
- **Already passed**: one student said that based on using Claude Code, most day-to-day programming work is already surpassed. Boaz replied that's websites and API endpoints, which is different from "rewrite the training code to train the next model in half the FLOPs."
- **Poorly defined**: one table said 80% success isn't good enough, since you wouldn't accept an employee who doesn't deliver one week in five. Others noted the benchmark doesn't specify how long the AI may take, and that external latency, like waiting for a model to finish training, doesn't shrink just because the AI is faster.

Boaz then explained that the AI 2027 authors' own estimates in the appendix were more conservative than many students', yet still produced short timelines. Slide 24 gives two authors' values of X: Eli Lifland put 6 months (the slide notes his actual median is 10 years, with a confidence interval of 1 month to 1,200 years), and Nikola Jurkovic put 1.5 months (interval 16 to 4,000 hours). The next slide, 26, is labeled "Updated analysis": base February 2029, with modified versions at November 2030, November 2031, and September 2035 (the chart itself is an image; those dates are its only text). As he understood it, that was partly because they put substantial weight on superexponential growth and assumed faster internal deployment.

### How the multipliers stack

AI 2027's takeoff stages are, in order: a superhuman coder speeds up research about 5x, a superhuman AI researcher about 25x, a superintelligent AI researcher about 250x, and ASI about 2,000x. At the last stage, AI makes a year's progress equal to two thousand years of human progress. After doing the arithmetic, Boaz joked that by then we should have a new religion.

The 5x figure comes from multiplying several factors, such as better allocation of compute to the most important experiments (about 2.2x) and experiments with fewer bugs that can be killed early (about 1.6x). He said he agrees with some of these, since Codex already helps him write fewer bugs, but whether the factors can simply be multiplied is an open question. Another input was a survey of just five AI researchers: how much would your company speed up if each person were replaced by 30 copies running 30 times faster? The five answers varied enormously: slide 30 cites a table from Leibowich, Jurkovic, and Davidson (2025) with 1.5x, 3.3x (2–10x), 20x (10–100x), 10x, and 3x.

## Boaz's conclusion: only one scenario can be ruled out

He laid out five possibilities:

1. AI has little effect on research
2. AI is needed just to sustain the current exponential trend (the fruit keeps getting higher, and AI is what lets us reach it)
3. A one-time boost, then back to the old pace
4. A shift to a steeper exponential
5. A superexponential singularity

He said the only one he can rule out is the first: AI coding tools do have an effect, not just for web apps but for AI research itself. He doesn't know how to rule out the other four. Asked which is most likely, he said he is fairly doubtful of the fifth and thinks it more likely lands between the second and third. He also stressed that this isn't binary: even a one-time 2x speedup is already fast.

One last student point is worth keeping: between cognitive intelligence and real human progress sit things like clinical trials and building factories. If AI proves in a year theorems that would take humans a millennium, most people won't feel it in daily life; anything touching the physical world runs on a much slower loop. Boaz agreed, adding the example of an airline whose scheduling software still runs on Windows 3.1.

Asked what the labs actually want, he cited OpenAI's charter (AI that benefits humanity) and said he chose to teach AI safety rather than how to train AI as fast as possible because he hopes to put the focus on making sure AI's impact is positive.

## What the four pre-readings contribute

| Reading | Role in this lecture |
|---|---|
| [Tom Davidson, Takeoff Speeds (presentation at Anthropic)](https://www.alignmentforum.org/posts/Nsmabb9fhpLuLdtLE/takeoff-speeds-presentation-at-anthropic) | An edited transcript of a September 2023 talk on the risks of fast takeoff; Davidson's interactive tool [takeoffspeeds.com](https://takeoffspeeds.com/) is in the further readings |
| [Davidson, Hadshar, MacAskill, Three Types of Intelligence Explosion](https://www.forethought.org/research/three-types-of-intelligence-explosion) | Splits the feedback loop into three: software, chip technology, and chip production, giving a software IE, an AI-technology IE, and a full-stack IE. Its key claim: even if the software loop isn't strong enough, the other two could still happen, just with longer lags |
| [Epoch AI, GATE](https://epoch.ai/blog/announcing-gate) | A compute-centric integrated model with compute, automation, and production modules, plus an [interactive simulator](https://epoch.ai/gate); one preliminary finding is that global compute investment could exceed 10% of world GDP |
| [Epoch AI, AI in 2030](https://epoch.ai/files/AI_2030.pdf) | A report commissioned by Google DeepMind that extrapolates compute, investment, data, hardware, and energy to 2030; it expects desk research (software, math) to flourish first and lab science to move more slowly |

## What to do after this lecture

- **Work it through yourself**: take the lecture's three models (dI/dt ∝ I^p, Cobb-Douglas, heavy-tailed tasks), try a few parameter settings, and make sure you can say which exponent decides whether things explode. Boaz's own trick: assume every quantity grows exponentially and solve for the growth rates; if the math doesn't work out, they don't grow exponentially.
- **Play with a simulator**: in [Epoch GATE](https://epoch.ai/gate) or [takeoffspeeds.com](https://takeoffspeeds.com/), change the parameter you're least sure about and see how much the conclusion moves. It's the fastest way to feel what Boaz meant by an illusion of precision.
- **Redo the student experiment**: replace the single-agent control with best-of-seven, add a weaker model, and see whether the gap between tree and star survives.

## Further reading on this site

- [Stanford CS329A: self-improving agents](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en): self-improvement techniques at the agent level
- [CS336 scaling laws foundations](/posts/ai/2026-08-22-cs336-scaling-laws-foundations-en): empirical regularities between compute, data, and parameters

## Series navigation

- Series overview: [Reading Harvard CS2881R](/posts/ai/2026-09-30-cs2881r-course-overview-en)
- Previous: [L10: reading the model's insides and reading its chain of thought](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en)
- Next: [L7: how to measure capabilities and where to set safety thresholds](/posts/ai/2026-09-30-cs2881r-lecture-07-capabilities-vs-safety-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Fall 2025 schedule and YouTube playlist were checked live and list this lecture’s recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. The student experiment's exact times became an approximate position; the experiment numbers and authors' estimates come from the weekly summary and slides and are not verified against the video.

## References

- [Harvard CS 2881R Fall 2025 course site: Lecture Oct 9, Recursive Self-Improvement](https://boazbk.github.io/mltheoryseminar/fall2025/#lecture-oct-9)
- [L6 lecture video (YouTube)](https://youtu.be/wzep3Rnv6iw)
- [L6 lecture slides (Harvard SharePoint)](https://hu-my.sharepoint.com/:p:/g/personal/boaz_seas_harvard_edu/ESGsKxa1G79Gv4T9O4g9ZJkBIZd4CWudXEzLmBvdpLbkmg?e=fci9ky)
- [Qin, Khan, Liu, [CS 2881r] [Week 6] Recursive Self-Improvement (LessWrong)](https://www.lesswrong.com/posts/DonyTLfGkyRyvJqwG/cs-2881r-week-6-recursive-self-improvement)
- [Davidson, Takeoff Speeds presentation at Anthropic](https://www.alignmentforum.org/posts/Nsmabb9fhpLuLdtLE/takeoff-speeds-presentation-at-anthropic)
- [Davidson, Hadshar, MacAskill 2025, Three Types of Intelligence Explosion](https://www.forethought.org/research/three-types-of-intelligence-explosion)
- [Epoch AI 2025, GATE: Modeling the Trajectory of AI and Automation](https://epoch.ai/blog/announcing-gate)
- [Epoch AI 2025, AI in 2030](https://epoch.ai/files/AI_2030.pdf)
- [METR 2025, Measuring AI Ability to Complete Long Tasks](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)
- [AI 2027](https://ai-2027.com/)
