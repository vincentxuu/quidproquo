---
title: "CS224R L10: RL for LLM Reasoning and Test-Time Compute"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, reasoning, grpo, test-time-compute]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 13
tldr: "Lecture 10 of CS224R Spring 2026 is a guest lecture by Noam Brown of OpenAI, and it makes one argument: reasoning models open a new scaling dimension by moving compute from training to inference. He starts with his own poker AI work, then uses backgammon, chess, and Go to show that thinking longer at inference time has always paid off. Next comes how LLMs got there: chain of thought, majority voting, o1/o3, GRPO, and DeepSeek-R1-Zero. The second half argues the field needs to rethink itself for large-scale test-time compute: multi-agent systems, evaluation as score versus compute, and the budget assumptions behind safety evaluations. The deck is mostly figures, so this post covers only the points visible on the slides."
description: "A guide to Lecture 10 of Stanford CS224R (Spring 2026), based on the official 10_cs224r_rl_for_llms_reasoning_2026 slides (guest lecture by Noam Brown): the history of inference-time search in poker, backgammon, chess, and Go; the limits of chain of thought and majority voting; o1 to o3, GRPO, and DeepSeek-R1-Zero; and what test-time compute means for multi-agent systems, evaluation, and safety evaluations. The Spring 2025 L10 had a different speaker and serves only as background."
draft: false
glossary:
  - term: "test-time compute"
    aliases: ["inference compute", "test-time scaling"]
    definition: "The computation a model spends while answering, such as writing a longer reasoning trace, sampling several answers and voting, or searching over multiple paths."
    context: "CS224R L10 argues that reasoning models make test-time compute a scaling dimension on par with training compute."
  - term: "GRPO"
    aliases: ["Group Relative Policy Optimization"]
    definition: "A policy gradient method for LLMs: sample a group of responses to the same prompt and use each one's reward relative to the group as its advantage, with no separately learned value model (critic)."
    context: "The CS224R L10 slides use it to explain how DeepSeek-R1-Zero was trained."
  - term: "majority vote"
    aliases: ["consensus", "self-consistency"]
    definition: "Sample several solutions to the same problem and take the most common answer."
    context: "CS224R L10 uses Minerva to show that it works, but that gains flatten out before 100 samples."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning)

> **Source term**: Based on the Spring 2026 [10_cs224r_rl_for_llms_reasoning_2026 slides](https://cs224r.stanford.edu/slides/10_cs224r_rl_for_llms_reasoning_2026.pdf) (scheduled 2026-05-01). The speaker for the [Spring 2025 L10 recording](https://www.youtube.com/watch?v=O2VpNnwB4lM) was Aviral Kumar (per the [2025 archive page](https://cs224r.stanford.edu/spring_2025/)). That's a **different speaker** from 2026, so the video can't stand in for this lecture and serves only as background. This is post 13 in the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series.

> **Scope limits for this post**: The deck is 42 pages, mostly charts and screenshots, with under a thousand words of extractable text. Guest lectures are opinion-driven, and whatever the speaker added on stage isn't on the slides. This post covers only slide titles, bullet points, and numbers printed on figures, and doesn't fill in arguments for the speaker. The schedule also lists no assigned reading for this lecture.

The [CS224R](https://cs224r.stanford.edu/) schedule calls this lecture "RL for LLMs: Reasoning." The guest speaker is Noam Brown, and the title slide lists OpenAI as his affiliation. [The previous lecture](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en) ended on this point: learned reward models are unreliable, and switching to verifiable rewards like math and code led to reasoning models. This lecture picks up there, but its entry point isn't an algorithm. It's where compute should be spent.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=O2VpNnwB4lM
title: Spring 2025 Lecture 10: RL for LLM Reasoning (YouTube, different speaker, background only)
```

Original videos: [Spring 2025 Lecture 10: RL for LLM Reasoning (YouTube, different speaker, background only)](https://www.youtube.com/watch?v=O2VpNnwB4lM)

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

## The main argument: scaling gets a new dimension

The first four slides lay out the thesis:

- AI progress from 2019 to today is primarily due to scaling data and compute. The figure shows GPT-2 through GPT-4 answering the same scheduling question, going from confused to correct.
- But is scaling all you need? The next slide is a screenshot of ChatGPT playing tic-tac-toe. The opponent already has two X's on the bottom row, and ChatGPT puts its O in the top right instead of blocking.
- **Reasoning models are a new dimension for scaling.** Training costs grew rapidly, but inference costs stayed low: a ChatGPT query without reasoning cost under a penny. Reasoning models scale inference, not just training. The chart beside it shows o1's AIME accuracy rising with test-time compute (log scale).

The rest splits into three parts: why we should believe inference compute helps (the history of game AI), how LLMs put it to use, and what it means for the field.

## Evidence 1: poker

The speaker opens with his own history.

**The Annual Computer Poker Competition**: labs brought poker bots to play each other every year. The slides say it turned into a competition of scaling models, with a chart of parameter counts rising year over year.

**2015 Brains vs. AI**: CMU challenged four top pros to an 80,000-hand match with $120,000 in prize money. Their bot, Claudico, lost by 9.1 big blinds per 100 hands (9.1 bb/100).

**The importance of planning**: the next chart comes from [Brown & Sandholm, Safe and Nested Subgame Solving](https://arxiv.org/abs/1705.02955) (NeurIPS 2017 Best Paper). In a medium-sized poker game, the x-axis is model size (buckets) and the y-axis is distance from Nash equilibrium. The line with search sits far below the line without it, across the whole range.

**2017 Brains vs. AI**: Libratus played four pros over 120,000 hands for $200,000 in prize money and won by 15 bb/100, with a p-value around 0.0002. Every player lost individually.

The slides never state the moral in one sentence, but the chart says it: the same model does far better when it searches at inference time.

## Evidence 2: backgammon, chess, Go

The next three slides make the same point in other games:

| Game | What the slide highlights |
|---|---|
| Backgammon (Tesauro 1994) | Human master level in 1994, the first major neural-network success in games. Strength came from value learning plus shallow search (2–3 ply lookahead). Takeaway: "Even early neural game systems spent compute at inference time." |
| Chess (Campbell et al. 2002) | Deep Blue beat Kasparov in 1997. Large-scale alpha-beta pruning was the key, and it spent minutes calculating each move. Takeaway: "Stronger play came from searching deeper at inference time." |
| Go (Silver et al. 2017) | Full AlphaGo Zero is superhuman. The raw policy network with no test-time search sits around 3000 Elo. Gaining 120 Elo takes roughly 2x model size and training, or roughly 2x test-time search. Getting the raw policy from 3000 to 5200 Elo would require scaling it by about 100,000x. |

The Go numbers make the case most sharply. Buying with training what inference-time search gives you can cost an impractical amount. That sets up the pivot slide: **is there a general way to scale inference compute in LLMs?**

## The first LLM answers: CoT and majority voting

**Prompted chain of thought** ([Wei et al. 2022](https://arxiv.org/abs/2201.11903)): show step-by-step reasoning in the prompt examples and the model writes out its reasoning too. The slides show the classic tennis-ball and cafeteria-apples examples, plus LaMDA and PaLM charts on MultiArith and GSM8K. The bigger the model, the larger CoT's advantage over standard prompting.

**Majority voting (consensus)**: generate many solutions and take the most common. The slides' example is [Minerva](https://arxiv.org/abs/2206.14858) (Lewkowycz et al.), which goes from 33.6% to 50.3% on MATH thanks to consensus. The slide also says **consensus flatlines before 100 samples**. Next to it is a figure from the [Large Language Monkeys](https://arxiv.org/abs/2407.21787) paper comparing majority vote, reward-model best-of-N, and coverage (at least one correct) on Llama-3 models.

Both methods help, and both hit a ceiling.

## o1 to o3, then GRPO and R1-Zero

**OpenAI o1**: the slides replay the opening chart of o1's AIME pass@1 accuracy rising with test-time compute. The next slide compares o1 and o3. The y-axis is AIME 2025 (no tools), the x-axis is estimated inference cost in dollars, and o3's low/medium/high curve sits entirely above o1's. Two slides follow on an NYT Connections puzzle, where the model reasons for 1 minute 25 seconds and then gives the four groups.

**GRPO** (Group Relative Policy Optimization): the slides explain it with two diagrams. Sample several responses to the same question, have a verifier grade them, compare and rank within the group, then nudge the model toward the better responses. The diagram marks "no critic": no separate value model is learned. The second diagram gives the details. The advantage is normalized by the group's mean and standard deviation, the objective is clipped, and a KL regularizer keeps the policy tethered to a reference model. GRPO first appeared in [DeepSeekMath](https://arxiv.org/abs/2402.03300).

**R1-Zero: GRPO scaled up**: [DeepSeek-R1-Zero](https://arxiv.org/abs/2501.12948) samples 16 outputs per question during RL. The slides' charts show AIME accuracy and response length rising together over training.

**CoT vs majority voting**: the next slide plots deepseek-r1-lite-preview's AIME accuracy against the average number of thought tokens, comparing longer reasoning (pass@1) with majority voting. The longer-reasoning curve climbs more steeply.

To connect GRPO to the policy gradients from L3, you can read it this way. The group mean as baseline is the variance-reduction trick from [L3](/posts/ai/2026-09-30-cs224r-policy-gradients-en). The clip comes from PPO in [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en). The KL term matches the RLHF objective from [L9](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en). This mapping is the series' addition, not the slides'.

## The claim: rethink AI for large-scale test-time compute

Slide 24 is a single-sentence pivot: "Claim: Need to rethink AI in an era of large-scale test-time compute." Every section after it unpacks that sentence.

**How far can this go?** The slides give the time scales: o1 operated over seconds, o3 over minutes, "our IMO gold model" over hours, and today's scaffolds over days to weeks. Mixed in are a GPT-5.5 benchmark table, an autotuning progress chart that kept 29 improvements out of 276 experiments, and a chart of steps completed on a network-attack exercise (from initial reconnaissance to full network takeover) against cumulative tokens.

**Multi-agent**: chain of thought is inherently **serial**, so latency eventually becomes a bottleneck. Some test-time scaling techniques are **parallel**, like best-of-N and consensus. They have lower latency but are less compute-efficient. The chart beside it shows AIME 2024: GPT-4o at 13.4, o1-preview at 56.7, o1 at 83.3.

**How evaluation should work: plot score versus compute or time.** The slides use the ARC-AGI-2 leaderboard (x-axis: cost per task) and Artificial Analysis's intelligence index plotted against output tokens. A single score isn't enough. Scores should be compared on a compute or time axis.

## What this means for safety evaluations

This section has more text:

- **Safety/preparedness evaluations are broken.** They measure whether a model might contribute to catastrophic harms (cyber, nuclear, biological weapons), but they're usually run at low budgets (under $100). A dedicated state actor can easily spend $10M on inference.
- **Safety evaluations should project what happens as test-time compute scales.**
- **Long-horizon safety evaluations are hard.** Suppose a model has a trillion-token context and runs for months. How do you know what it will be capable of after a month? The only sure way is to run it for a month.
- **Inference capacity is strategically undervalued.** As inference matters more, weights matter relatively less. Securing model weights has been the big focus, and the slides say it still matters enormously, but inference compute is a strategic advantage in its own right.
- **Test-time compute is a window into the future.** Capabilities that cost $1M today might cost $100 next year. Large-scale inference lets us see future model capabilities early and use the time to prepare.

## Closing: where this goes

The last two slides:

- There's still a lot of room to push inference compute, trading much higher inference cost for much more capable models. The slides ask what inference cost you'd pay for a proof of the Riemann Hypothesis, or for new life-saving drugs.
- Civilization was built by billions of humans over millennia. Likewise, there will likely be billions of persistent agents that share knowledge and specialize, the way humans do.
- It ends by quoting Richard Sutton's "The Bitter Lesson": the biggest lesson of 70 years of AI research is that general methods that leverage computation are ultimately the most effective, and the two that seem to scale arbitrarily are **search** and **learning**.

That quote ties the lecture together. Search in poker and Go, learning in GRPO: both point the same way.

## Something to try tonight

Pick a small task you use often where answers can be checked automatically (a set of 24-game puzzles, or coding problems with unit tests). Run the same model in two setups:

```text
A: sample once, ask for a written reasoning trace
B: sample N times (N = 1, 4, 16, 64) and take the majority vote
```

Plot accuracy against total output tokens, not against N. That's the score-versus-compute evaluation the slides argue for, and you'll see for yourself where majority voting stops improving.

## Further reading

- [CS336: RLVR](/posts/ai/2026-08-22-cs336-rlvr-en): the engineering details of RL with verifiable rewards
- [CME295: RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en) and [LLM reasoning](/posts/ai/2026-09-29-cme295-llm-reasoning-en): another Stanford course on the same topic
- [Reading Berkeley CS285 Spring 2026](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en): fuller RL theory background

**Series**: previous [L9: RLHF, DPO, and preference optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en) | next [Default Project: fine-tuning an LLM on Countdown with SFT, IPO, and RLOO](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224R course home page and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 10 slides: RL for LLMs: Reasoning (Noam Brown, 2026)](https://cs224r.stanford.edu/slides/10_cs224r_rl_for_llms_reasoning_2026.pdf)
- [CS224R Spring 2025 archive page](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 10: RL for LLM Reasoning (YouTube, different speaker, background only)](https://www.youtube.com/watch?v=O2VpNnwB4lM)
- [Brown & Sandholm 2017, Safe and Nested Subgame Solving for Imperfect-Information Games](https://arxiv.org/abs/1705.02955)
- [Wei et al. 2022, Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Lewkowycz et al. 2022, Solving Quantitative Reasoning Problems with Language Models (Minerva)](https://arxiv.org/abs/2206.14858)
- [Brown et al. 2024, Large Language Monkeys: Scaling Inference Compute with Repeated Sampling](https://arxiv.org/abs/2407.21787)
- [Shao et al. 2024, DeepSeekMath (origin of GRPO)](https://arxiv.org/abs/2402.03300)
- [DeepSeek-AI 2025, DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948)
- [Richard Sutton, The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)
