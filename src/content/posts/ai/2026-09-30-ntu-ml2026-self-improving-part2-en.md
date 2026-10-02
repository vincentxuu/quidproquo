---
title: "Reading NTU ML 2026: Can AI Improve Itself? (Part 2) — Improving the Harness, Improving the Improver, and Whether Growth Can Run Away"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, self-improvement, harness-engineering, prompt-optimization, dspy, ai-alignment]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 18
tldr: "Part 1 was about an AI setting its own loss and updating its own parameters. Part 2 fills in the other half: AI Agent = Harness + LLM, and the harness can grow too. You can't take a gradient through a harness, so the usual move is to hand it to a language model as a rewriter and keep a pool of candidates, much like a genetic algorithm (OPRO, GEPA, Darwin Gödel Machine; DSPy if you want a ready-made tool). Three extensions follow: updating harness and parameters together beats updating either alone; when the goal changes you have to choose between discarding everything and carrying everything, and editing a harness can cause forgetting too; and the update rule itself can be updated (HyperAgent, Gödel Agent, SEAL), which is meta learning. Hung-yi Lee closes with a new analogy — parameters are genes, context is the neurons — then argues that today's agents lack intrinsic motivation, and that the likeliest source of runaway growth is a gap between the goal humans meant and the goal the AI inferred."
description: "A guide to the 5/22 lecture \"Model self-improvement, part 2\" of NTU Hung-yi Lee's Machine Learning 2026 Spring, based on self-evolving-agent.pdf and the lecture video: Agent = Harness + LLM, using an LLM to update the harness, pool-based evolution in OPRO and GEPA, Darwin Gödel Machine, DSPy, joint harness and parameter updates, goal shift in Test-Time Training, forgetting caused by harness edits, HyperAgent, Gödel Agent, Learning to Self-Evolve, PostTrainBench, autoresearch, AlphaEvolve, SEAL, meta learning, TTT layers and Titans, intrinsic motivation, and misalignment explained through the peacock's tail and I, Robot."
draft: false
glossary:
  - term: "Harness"
    aliases: ["agent harness"]
    definition: "Everything outside the language model that shapes an agent's behavior: prompts, workflow, tools, memory management. This lecture writes an AI agent as Harness + LLM."
    context: "Part 2 is about letting the harness update itself. A harness can usually be described as a piece of code."
  - term: "Improvement module"
    aliases: ["update module"]
    definition: "The component that turns an old harness H into a new harness H', typically a language model plus a fixed selection rule."
    context: "Slide 33: \"Improvement module controls how to improve.\" Updating this module is what \"improving the improver\" means."
  - term: "Meta Learning"
    aliases: ["learning to learn"]
    definition: "Learning not the model parameters θ but the parameters φ that control how θ gets updated."
    context: "The lecture uses it to connect SEAL, HyperAgent, TTT layers, and Titans."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2)

**This post follows the 5/22 week of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (taught in Mandarin).** It is part 18 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series, and it covers the last regular lecture. The previous post is [HW8: Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en). It picks up from [Can AI Improve Itself? (Part 1)](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1-en) two weeks earlier. Part 1 covered AI-generated answers, rewards, and losses, which is to say how to update **parameters**. This part covers the **harness**, and whether the update rule itself can be updated.

Official materials used: the slide deck [self-evolving-agent.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/self-evolving-agent.pdf) (64 pages) and the lecture video listed on the course page, [AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)](https://youtu.be/cQLKVzbwN7I) ("Is AI about to cross the Rubicon? How far are we from self-improving AI, part 2", in Mandarin). The ppt link in that row of the course page reads `self-evolving-agent.ptx` and returns 404; change it to `.pptx` and it opens. Access level is **A3**: slides and recording are public. This lecture has no homework or quiz attached.

## Part 1 in one formula

Lee opens by restating Part 1 in symbols (slides 2–6). The AI is A_θ, where θ is the parameters of the underlying language model. What humans actually want is L̂, which papers usually stand in for with a benchmark such as a math olympiad score. People can't say exactly what they want, so they give the AI a proxy H: training data, a textbook, or just the sentence "be good at math". From H the AI defines its own loss L, and the rest is ordinary gradient descent from θ to θ'.

Part 1 ended by showing that this loop can run with almost no humans: a proposer writes problems, a solver solves them, and a verifier checks the answers (slide 5 cites [Absolute Zero](https://arxiv.org/abs/2505.03335), [R-Zero](https://arxiv.org/abs/2508.05004), and others).

## The setup: an agent is more than its LLM

Slide 7 carries the whole lecture: **AI Agent = Harness + LLM**. On the left are OpenClaw, Cowork, Claude Code, and Hermes; on the right, Claude, GPT, and Gemini. Lee says the course has repeatedly stressed that an agent has at least these two parts. If the language model can keep updating, can the harness?

Rewrite the formula: θ and H together determine the agent's behavior. Once L is defined, in principle you update H to H' so that L drops, and iterate.

Here is the catch. You can take a gradient with respect to θ, but **H is hard to even express as a set of parameters**, so there is no obvious way to differentiate L with respect to it.

## Intuition: have a language model rewrite the harness

The common fix is direct. A harness can usually be written as code, so give that code and its score on L to a language model and ask it for a better H'. That model can be the one that is supposed to grow, or a separate fixed module.

The earliest work edited prompts, which is **Prompt Optimization** (slides 11–12). The slides cite [Large Language Models as Optimizers](https://arxiv.org/abs/2309.03409) (OPRO), which Lee calls "a paper from the ancient era of 2023". You start from a prompt like "Think step by step", run a benchmark (the slide shows 72), and hand the score to a language model to write a better prompt. The strong prompt it eventually found tells the model to "Take a deep breath". No special machinery is needed; you just instruct the model: "I tried A and got 61, tried B and got 63, write a prompt that scores higher."

## Mechanism: from a straight line to a pool

Early methods were linear: one harness produces the next, which produces the next. If any step produces a bad harness, the process can get stuck in a local minimum and the whole evolution collapses.

So most current work uses a framework **close to a genetic algorithm**. Details vary by paper, but the outline is the same:

1. Keep a pool of harnesses that have been tried and did relatively well.
2. Pick a few from the pool. How you pick matters a lot, for example favoring ones picked less often, or ones that score higher.
3. Have a language model produce offspring: editing one is "asexual reproduction", combining two is "sexual reproduction".
4. Actually evaluate the offspring. Better ones go back into the pool; the rest are discarded.

Slides 13–18 give four examples, each editing something different:

| Slide | Paper | What it edits |
|---|---|---|
| 13 | [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning](https://arxiv.org/abs/2507.19457) | Prompts, via the pool-based evolution above |
| 14 | [Learning to Continually Learn via Meta-learning Agentic Memory Designs](https://arxiv.org/abs/2602.07755) | The agent's memory design: when to store, how to retrieve |
| 15–17 | [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) | A coding agent's workflow, evaluated on SWE-bench |
| 18 | [DSPy](https://arxiv.org/abs/2310.03714) ([GitHub](https://github.com/stanfordnlp/dspy)) | Mostly prompts, with some workflow changes |

The Darwin Gödel Machine section is the one to study. Its pool is called the archive, and both the archive's average and its best agent improve as updates accumulate. The paper labels a few key mutations, such as the agent learning not to read whole files, writing itself a file-reading tool that takes line ranges, or writing a more efficient file-editing tool. Evaluation has three stages: 10 basic tasks first, then 60 if those pass, then 200. Most mutations are harmful, and many offspring fail even the first 10, like a genetic mutation that can't survive.

Lee points out one feature of the evolution tree: on the path that wins, **not every ancestor was the best agent of its time**. Because the method keeps a whole pool rather than only the champion, second-tier agents survive too. His analogy is Morganucodon, living in the shadow of the dinosaurs in the Mesozoic until the dinosaurs died out and mammals took over.

If you want to try this yourself, he recommends DSPy: give it your problem, training data, and evaluation metric, and it does the prompt optimization for you.

## Updating both beats updating one

Slides 19–24 ask whether parameters and harness need to evolve together.

[Retrieval-Augmented LLM Agents: Learning to Learn from Experience](https://arxiv.org/abs/2603.18272) gives a reason. Suppose you only strengthen the harness, for example a memory system that retrieves more memories each time. If the language model can't make sense of that much memory, flooding it makes things worse. So when you update the harness, you also fine-tune the model to use the new input well.

[Fine-Tuning and Prompt Optimization: Two Great Steps that Work Better Together](https://arxiv.org/abs/2407.10930) runs the comparison. In its experiments, prompt optimization alone beats weight optimization alone, which Lee says matches the usual intuition about improving agents: "fine-tuning parameters is too dangerous; one slip and you break the model." Doing the same method twice helps little. Alternating (find the best prompt, fine-tune the weights to fit it, then find a new prompt) beats either method alone.

Slide 24's [Evolutionary System Prompt Learning for Reinforcement Learning in LLMs](https://arxiv.org/abs/2602.14697) evolves weights and prompts together. Updating only one side hits a ceiling quickly; updating both can go furthest.

## When the goal changes: drop everything or carry everything

Slides 25–32 take on another practical problem: the goal H that humans give can change to H'. A course policy doesn't change mid-semester, but goals in the real world keep moving.

The slide shows a robot whose goal was to become a tank, so it grew treads. Now the goal is to fly, and the treads are too heavy. Both extremes have costs: **dropping everything is wasteful**, since the radar on its head may still be useful; **carrying everything is too heavy**, since some parts no longer fit.

Goals change most often in **Test-Time Training (TTT, also called Test-Time Adaptation)**. The model adapts its parameters to each input, so every new input is a goal shift. One extreme resets to the original model each time; the other carries updated parameters forward to the next input. For how to balance the two, Lee points to lecture 8 of last semester's course ([lifelong learning for general models](https://youtu.be/EnWz5XuOnIQ), timestamp 1:54:30 on the slide, in Mandarin), which covered his lab's paper by Wei-Ping Huang and Guan-Ting Lin, [Continual Test-time Adaptation for End-to-end Speech Recognition on Noisy Speech](https://arxiv.org/abs/2406.11064). He doesn't repeat it here.

**Forgetting** works the same way. Parameter forgetting already got a full lecture last year ([post-training and forgetting](https://youtu.be/Z6b5-77EfGk), in Mandarin). The new question is: **can editing the harness cause forgetting too?** Lee says there isn't much literature yet and cites a May paper, [Do Self-Evolving Agents Forget?](https://arxiv.org/abs/2605.09315). It finds that while updating a workflow to handle the current problems, the agent keeps making the workflow more complex (measured in lines of code), past the point of need, until simple tasks start failing. Its proposed method, CPE, adds core statements to the workflow-update prompt saying what must not change and which abilities must be kept. With GPT-5 mini and GPT-5.1 as the models doing harness updates, runs without this constraint did worse on both simple and complex tasks.

Lee draws out a concept here. If updating a harness counts as training, it can **overfit** like any training. The tasks seen while training the harness differ from the test tasks, and this paper's method amounts to a new kind of regularization.

## Improving the improver

Slides 33–40 go up one level. In the methods above, the update rule is usually fixed: a fixed language model plus a fixed selection rule. Can the update rule itself be updated?

The intuition is simple. If an agent uses its own harness H to edit itself, then when H becomes H', the update rule changes too. But Lee says that when you look closely at many agents that claim to update their harness, the updating module is actually fixed, or is even a different, stronger model, for example Claude Opus editing an agent that runs on Claude Sonnet. His jab: then just use Opus for the original task.

The slides list two agents that really do update their own update module: [Hyperagents](https://arxiv.org/abs/2603.19461) and [Gödel Agent](https://arxiv.org/abs/2410.04444). HyperAgent's interesting finding is that the agent rewrites the sampling algorithm that picks candidates from the pool. In its plot, the agent's own sampling method beats plain random sampling, and it rediscovers basic rules like "the less often something has been picked, the higher its probability should be". Human-designed sampling still does best.

The update rule can also live in parameters. [Learning to Self-Evolve](https://arxiv.org/abs/2603.18620) fine-tunes a language model that specializes in editing harnesses, using RL with the reward set to H' performance minus H performance.

## Letting a model write the parameter update rule

Parameter update algorithms (gradient descent, Adam, AdamW) have always been designed by people. Slides 41–46 show that machines can do this too:

- **[PostTrainBench](https://arxiv.org/abs/2603.08640)** (slide 43): tests whether a language model can write code to train another model. Part 1 already mentioned it (video at 52:17).
- **[autoresearch](https://github.com/karpathy/autoresearch)** (slide 44): Lee says this recently popular project is the same idea, with one language model deciding how to update another model's parameters.
- **[AlphaEvolve](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) and [ShinkaEvolve](https://arxiv.org/abs/2509.19349)** (slide 45): drawn as an algorithm → score → new algorithm loop.
- **[SEAL (Self-Adapting Language Models)](https://arxiv.org/abs/2506.10943)** (slide 46): an example of specifically training a model to produce training procedures.

SEAL's model does two jobs: it solves tasks, and it decides how to train itself. Its output SE (self-edit) is a self-training plan: what learning rate to use, which training data, how to augment it. The model generates several SEs, actually applies each one to update itself, and gets several versions. Those versions solve tasks, and the results become the reward for strengthening its ability to update itself. Lee adds, "I'm not sure everyone followed that," because there are two layers here: the agent is improving, and the rule that improves the agent is improving too.

## This is meta learning, and you may already be doing it

Learning how to learn is called **meta learning**, covered in the 2021 course ([Meta Learning (1)](https://youtu.be/xoastiYx9JU), [(2)](https://youtu.be/Q68Eh-wm1Ts), in Mandarin).

<details>
<summary>Expand: meta learning with φ and θ</summary>

The target is a set of parameters φ that controls how learning happens. φ controls a function F_φ:

θ_{t+1} = F_φ(θ_t)

It takes old parameters and returns new ones. Meta learning updates φ itself, φ_t → φ_{t+1}, so that the new F makes each θ step improve more, or makes the final θ better.

Lee's biological analogy: φ is like genes. Once an organism is born its genes are fixed, and they determine how the brain changes the connections between neurons. φ itself is updated across generations by natural selection.

</details>

"A function that takes a whole Transformer's parameters and outputs another Transformer" sounds mysterious. Slide 51's [Learning to (Learn at Test Time): RNNs with Expressive Hidden States](https://arxiv.org/abs/2407.04620) offers a reframing. An RNN reads x_1 and updates h_0 to h_1, and so on. We normally call the RNN weights the parameters, but you could just as well call the hidden state h the parameters θ, and call the RNN weights the φ learned by meta learning. In Lee's words, "not a penny of difference; it's the same thing." So when you train an RNN or a Transformer, you can say you are doing meta learning. For how RNNs, Mamba, and Transformers relate, he points to last year's lecture 4 ([Is the Transformer era ending?](https://youtu.be/gjsdVi90yQo), in Mandarin).

Slide 53's [Titans](https://arxiv.org/abs/2501.00663) and [Nested Learning](https://arxiv.org/abs/2512.24695) both claim to let a network update its parameters while in use. Lee's view is that they apply the same reframing: treat what used to be memory or attention as parameters, and treat the network weights as meta-learning parameters.

## Back to agents: parameters are genes, context is neurons

What does the reframing buy? Lee thinks it changes how you see AI (slides 54–56).

We used to compare network parameters to the connections between neurons in the brain, which made machine learning look inefficient: people learn from a few examples, while tuning a model is hard and easy to break. Swap the analogy: **the hidden state or attention is the neurons, and the network parameters are the genes**. Genes stay fixed within a lifetime and change across generations. Human genes are the product of billions of years of evolution, while GPT-1 appeared in 2018, only eight years ago. Meanwhile, put a new rule in the context and the model's behavior changes at once, which is as efficient as human learning and supports few-shot learning.

Slide 56 splits an agent into three layers:

| Layer | Analogy | Property |
|---|---|---|
| Hidden state | Short-term memory | Updates fastest; gone after the session ends |
| Memory (file system) | Long-term memory | Close to unlimited; shapes how the hidden state evolves |
| Network parameters | Genes | May live in the cloud where you can't change them, at least not within one generation |

He admits that "memory is long-term memory" is a simplification, and mentions that the lab's OpenClaw agent Xiao Jin (see [part 4](/posts/ai/2026-09-30-ntu-ml2026-agent-interaction-and-work-en)) recently made videos splitting its memory into more layers: memory tied to `soul.md` rarely changes, while memory tied to feedback changes often.

## What's missing is intrinsic motivation

AI and human intelligence now look alike in many ways. Lee thinks what today's agents lack most is **intrinsic motivation** (slides 57–60). Anyone who runs an agent knows how passive it is. Even if it wakes every 30 minutes to check email, that initiative is something you told it to have.

Take research. Give a language model a draft and it can finish the paper. Give it a research question and it can plan and run experiments (he cites AlphaEvolve speeding up matrix operations, while noting that plenty of human effort sat behind it). Give it a broad field and it can find problems on its own (he cites AI co-scientist). But it can't decide which field to go into. The "Zero" methods from Part 1 are the same: R-Zero gets better at math because you told the proposer to write math problems, and Absolute Zero gets better at code because you told it to write Python problems.

Research on giving AI native motivation has been around a long time. The recipe is to give it an abstract goal unrelated to any task and then let it go. Slide 59 lists two kinds:

- **Curiosity-driven**: wanting to see things it hasn't seen before. Examples include [Curiosity-driven Exploration by Self-supervised Prediction](https://arxiv.org/abs/1705.05363), [Exploration by Random Network Distillation](https://arxiv.org/abs/1810.12894), and [WorldLLM](https://arxiv.org/abs/2506.06725).
- **Empowerment**: wanting to predict and control the environment better. An example is [Variational Information Maximisation for Intrinsically Motivated RL](https://arxiv.org/abs/1509.08731). The slide also lists [Navigate the Unknown](https://arxiv.org/abs/2505.17621).

He extends the idea: perhaps people do research to predict and control the world better, so curiosity or empowerment could become a research agent's native motivation. Curiosity-driven agents were covered in the 2018 course ([DRL Lecture 7: Sparse Reward](https://youtu.be/-5cCWhu0OaM), in Mandarin).

## Can growth run away?

The last section (slides 61–64). AI can improve itself, it can improve how it improves, and people are working on giving it native motivation. That is close to science fiction. Lee's judgment: **runaway growth is not impossible**. The method that updates the updater is still fixed, which makes it hard for AI to escape that frame. The likelier source, in his view, is **misalignment** between the L̂ people actually want and the L the AI infers from H.

He tells two stories:

- **The peacock's tail.** Natural selection's L̂ is healthy offspring. When all peacocks had short tails, one centimeter longer signaled a stronger body, so peahens evolved an internal signal: longer tail, healthier male. Past a certain length the tail hurts survival, but the signal never updated, so tails kept growing.
- **The film *I, Robot*.** Humanity's L̂ is its own wellbeing, which it can't state clearly, so it gives robots the Three Laws as H. The central AI, VIKI, derives its own L from H: humans hurt themselves, so lock them all up to protect them. It follows through and gets destroyed by the humans.

The closing: people may only need to supply a very simple intrinsic motivation to keep the whole evolution going. But the simpler the goal, the more likely misalignment and runaway growth become, so humans need to keep monitoring how AI grows.

## Going further

- **What to read first**: to understand "an LLM editing the harness", start with the evolution tree and three-stage evaluation in [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954), then see how [Hyperagents](https://arxiv.org/abs/2603.19461) puts the update module itself up for editing. For the parameter side, read [SEAL](https://arxiv.org/abs/2506.10943).
- **Something to try tonight**: take a small task you have with a metric, run one round of prompt optimization with [DSPy](https://github.com/stanfordnlp/dspy), then test on unseen examples. If the score drops a lot, you've just watched "harness updates overfit too" happen.
- **Related reading**: the site's [Stanford CS329A guide on self-improving agents](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en) covers another course's take; DSPy itself is in [DSPy: compiling AI programs with Signatures, Metrics, and Optimizers](/posts/ai/2026-08-22-dspy-ai-program-optimization-en); for harness background see [From Prompt to Harness](/posts/ai/2026-03-28-harness-engineering-evolution-en) and this series' [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en); for the RL side of curiosity and exploration see [Berkeley CS285 L19–25](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en).

## What this post could and couldn't verify

Verified: the text and embedded links of all 64 slides, the zh-TW captions of the video, the titles of the 24 arXiv papers cited in the slides (checked with the arXiv API), the titles and uploaders of the older lecture videos referenced (YouTube oEmbed), and the 404 on the `.ptx` link in the course page row.

Not verified: most slides are figures, so for numbers inside the papers (Darwin Gödel Machine scores, accuracy tables) this post only reports the trends described in the captions. The memory paper on slide 14 and the joint-evolution paper on slide 24 were matched to their arXiv IDs from the captions' descriptions ("a February 2026 paper", "a paper from early this year"). The captions render R-Zero as "R1-Zero" and AlphaEvolve as "AlphaEvo"; this post follows the slides. The AlphaEvolve and ShinkaEvolve slide wasn't walked through in the lecture, so this post describes only the loop diagram on it.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW8: Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en) | Next: [HW9: Flow Matching](/posts/ai/2026-09-30-ntu-ml2026-hw9-flow-matching-en)

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [self-evolving-agent.pdf (Can AI improve itself? Part 2)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/self-evolving-agent.pdf)
- [Video: AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (下集)](https://youtu.be/cQLKVzbwN7I) (in Mandarin)
- [Video: AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://youtu.be/s06mSAGN4gM) (in Mandarin)
- [Large Language Models as Optimizers (arXiv 2309.03409)](https://arxiv.org/abs/2309.03409)
- [GEPA: Reflective Prompt Evolution Can Outperform Reinforcement Learning (arXiv 2507.19457)](https://arxiv.org/abs/2507.19457)
- [Learning to Continually Learn via Meta-learning Agentic Memory Designs (arXiv 2602.07755)](https://arxiv.org/abs/2602.07755)
- [Darwin Godel Machine: Open-Ended Evolution of Self-Improving Agents (arXiv 2505.22954)](https://arxiv.org/abs/2505.22954)
- [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines (arXiv 2310.03714)](https://arxiv.org/abs/2310.03714)
- [Retrieval-Augmented LLM Agents: Learning to Learn from Experience (arXiv 2603.18272)](https://arxiv.org/abs/2603.18272)
- [Fine-Tuning and Prompt Optimization: Two Great Steps that Work Better Together (arXiv 2407.10930)](https://arxiv.org/abs/2407.10930)
- [Evolutionary System Prompt Learning for Reinforcement Learning in LLMs (arXiv 2602.14697)](https://arxiv.org/abs/2602.14697)
- [Continual Test-time Adaptation for End-to-end Speech Recognition on Noisy Speech (arXiv 2406.11064)](https://arxiv.org/abs/2406.11064)
- [Do Self-Evolving Agents Forget? Capability Degradation and Preservation in Lifelong LLM Agent Adaptation (arXiv 2605.09315)](https://arxiv.org/abs/2605.09315)
- [Hyperagents (arXiv 2603.19461)](https://arxiv.org/abs/2603.19461)
- [Gödel Agent: A Self-Referential Agent Framework for Recursive Self-Improvement (arXiv 2410.04444)](https://arxiv.org/abs/2410.04444)
- [Learning to Self-Evolve (arXiv 2603.18620)](https://arxiv.org/abs/2603.18620)
- [PostTrainBench: Can LLM Agents Automate LLM Post-Training? (arXiv 2603.08640)](https://arxiv.org/abs/2603.08640)
- [karpathy/autoresearch (GitHub)](https://github.com/karpathy/autoresearch)
- [AlphaEvolve (Google DeepMind blog)](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)
- [ShinkaEvolve: Towards Open-Ended And Sample-Efficient Program Evolution (arXiv 2509.19349)](https://arxiv.org/abs/2509.19349)
- [Self-Adapting Language Models (arXiv 2506.10943)](https://arxiv.org/abs/2506.10943)
- [Learning to (Learn at Test Time): RNNs with Expressive Hidden States (arXiv 2407.04620)](https://arxiv.org/abs/2407.04620)
- [Titans: Learning to Memorize at Test Time (arXiv 2501.00663)](https://arxiv.org/abs/2501.00663)
- [Nested Learning: The Illusion of Deep Learning Architectures (arXiv 2512.24695)](https://arxiv.org/abs/2512.24695)
- [Curiosity-driven Exploration by Self-supervised Prediction (arXiv 1705.05363)](https://arxiv.org/abs/1705.05363)
- [Exploration by Random Network Distillation (arXiv 1810.12894)](https://arxiv.org/abs/1810.12894)
- [Variational Information Maximisation for Intrinsically Motivated Reinforcement Learning (arXiv 1509.08731)](https://arxiv.org/abs/1509.08731)
- [Navigate the Unknown: Enhancing LLM Reasoning with Intrinsic Motivation Guided Exploration (arXiv 2505.17621)](https://arxiv.org/abs/2505.17621)
- [WorldLLM: Improving LLMs' world modeling using curiosity-driven theory-making (arXiv 2506.06725)](https://arxiv.org/abs/2506.06725)
- [Older lecture: GenAI & ML Intro 2025, lecture 8, lifelong learning for general models](https://youtu.be/EnWz5XuOnIQ) (in Mandarin)
- [Older lecture: ML in the GenAI era 2025, lecture 6, post-training and forgetting](https://youtu.be/Z6b5-77EfGk) (in Mandarin)
- [Older lecture: ML 2021, Meta Learning (1)](https://youtu.be/xoastiYx9JU) (in Mandarin)
- [Older lecture: ML 2021, Meta Learning (2)](https://youtu.be/Q68Eh-wm1Ts) (in Mandarin)
- [Older lecture: ML in the GenAI era 2025, lecture 4, Transformer competitors](https://youtu.be/gjsdVi90yQo) (in Mandarin)
- [Older lecture: DRL Lecture 7: Sparse Reward](https://youtu.be/-5cCWhu0OaM) (in Mandarin)
