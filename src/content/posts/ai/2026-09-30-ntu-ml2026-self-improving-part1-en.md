---
title: "Reading NTU ML 2026: Self-Improving AI (Part 1) — AI-Generated Answers, Rewards, and Losses, and How Far Humans Can Step Back"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ntu, ai-course, course-guide, self-improvement, reinforcement-learning, test-time-compute]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 15
tldr: "Hung-yi Lee opens his May 8 lecture by admitting that \"self-improving AI\" has no clear definition: it is a process of humans gradually letting go. He splits machine learning into three steps and checks where the \"I\" can be replaced by AI. Answers can come from the model's own self-corrections, reward shaping can be written by an LLM, the loss can be set by the model itself (scores, majority vote, entropy), and even the questions can come from a proposer model. But experiments keep showing that with no human at all, progress plateaus or the model trains itself into the ground. A strong AI can already train a weaker one, just not better than humans do. His verdict: in May 2026, AI is \"still standing at the bank of the Rubicon.\""
description: "Guide to the May 8 lecture \"Self-Improving (1)\" in NTU Hung-yi Lee's Machine Learning 2026 Spring, based on Self-Improving.pdf and video s06mSAGN4gM: I. J. Good's \"last invention,\" the three steps of machine learning, AI-generated answers, sparse rewards and LLM-written reward shaping, self-defined losses (verbalized / ensemble / certainty), TENT and unsupervised RLVR, test-time training, the missing term in entropy minimization (derivation folded), Absolute Zero / R-Zero, PostTrainBench, and weak-to-strong."
draft: false
glossary:
  - term: "Reward shaping"
    aliases: ["proxy reward"]
    definition: "When the true reward is too sparse, you design an easier-to-learn proxy reward to guide training, while still evaluating on the true reward."
    context: "Lee's example is a robot opening a door: scoring only a fully opened door is too hard to learn, so touching the handle also earns 0.5."
  - term: "Test-Time Training"
    aliases: ["TTT"]
    definition: "At inference, take one test example (or batch), update the parameters with a loss the model sets for itself, then answer with the updated model."
    context: "The lecture argues that self-defined losses work best for small updates, which is exactly the TTT setting."
  - term: "Entropy minimization"
    aliases: ["certainty-based loss"]
    definition: "Use the entropy of the model's output distribution as the loss: a more concentrated distribution means more confidence and a lower loss. No ground truth needed."
    context: "TENT for images, SUTA for speech, and The Unreasonable Effectiveness of Entropy Minimization for text all use this idea."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part1)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post covers the May 8 lecture "模型的自我成長 - 1" (Self-Improving, part 1) of [NTU Hung-yi Lee's Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 15 of the series [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en). The previous post is [HW6: Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en). The lecture before that, [Self-Correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en), asked whether a model can fix its own mistakes. This one goes a level deeper: **can a model get better without humans?**

Official materials: the slides [Self-Improving.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Improving.pdf) (62 pages, plus a [pptx](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Improving.pptx)) and the video listed on the course page, [AI 要跨越盧比孔河了嗎？自我成長的 AI 離我們多遠 (上集)](https://youtu.be/s06mSAGN4gM) ("Is AI about to cross the Rubicon? How far away is self-improving AI, part 1"; in Mandarin). Access rating: **A3**. The slides and the full recording are public, and the recording has Chinese captions. There is no quiz for this lecture. Most slides are images, so this post follows the captions for the argument. Every paper cited on the slides was checked against arXiv for its title.

## Course video sources

Video sources were checked against the official course page. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=s06mSAGN4gM
title: Video: Is AI about to cross the Rubicon? How far away is self-improving AI (part 1)
```

Original videos: [Video: Is AI about to cross the Rubicon? How far away is self-improving AI (part 1)](https://www.youtube.com/watch?v=s06mSAGN4gM)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## Prerequisite: the three steps of machine learning

Lee assumes you have seen [Lecture 5 of his 2025 Intro to Generative AI and Machine Learning](https://youtu.be/Taj1eHmZyWw) (in Mandarin), where machine learning is three steps:

1. Decide what function I want (define the loss)
2. Decide which candidate functions I have (define the model)
3. Pick the best candidate (gradient descent, basically automatic)

Steps one and two both contain an "I." That "I" used to be a human. The question for this lecture: **how much of that "I" can be AI?** The lecture mostly deals with step one, where the loss comes from. For test-time training it points to [Lecture 8 of the 2025 course](https://www.youtube.com/watch?v=EnWz5XuOnIQ) (in Mandarin).

## The scene: humanity's last invention, and the Rubicon

The slides start with the statistician [I. J. Good](https://en.wikipedia.org/wiki/I._J._Good) in 1965. If humans build an AI that can build an AI stronger than itself, humans are no longer needed, so that AI would be "the last invention" humans ever make.

Next comes [Import AI 455](https://importai.substack.com/p/import-ai-455-automating-ai-research). Its author "reluctantly" puts the chance of AI R&D with no human involvement, an AI building its own successor, at 60% or more by the end of 2028. If that happens, he writes, we "cross a Rubicon" into a nearly unforecastable future. Lee explains the idiom: Roman generals were forbidden to lead troops across the Rubicon. Caesar did it anyway, and the civil war that followed could not be undone.

Then Lee sets expectations. Plenty of papers claim self-improvement, and ICLR 2026 even had a dedicated workshop. But the slide says:

> "Self-improving AI" is a process of humans gradually letting go. Much of the literature claiming self-improvement still involves humans, just less than before.

So read every method in this lecture by asking one question: where is the human still in the loop?

## Letting go, step one: the AI produces the answers

In supervised learning the loss is the distance between the model's output Y and the ground truth Ŷ, and Ŷ comes from human labelers. Ŷ is the first thing to replace.

Having a stronger AI generate answers for a weaker one is ordinary knowledge distillation. Lee sets it aside. The question is whether AI can build an AI stronger than itself. Bringing in a stronger teacher means you already have the stronger AI.

The real question: **can a model learn from pseudo-answers it generated itself?** Lee says yes, and the key is [last lecture's self-correction](/posts/ai/2026-09-30-ntu-ml2026-self-correction-en). Self-correction does not touch the parameters. Ask the same question again and the model still gets it wrong first, then corrects again. But fine-tune the model on its own corrected answers, and the new model is more likely to get it right the first time. Lee notes that Anthropic's early Constitutional AI work used this approach.

## Step two: let the AI write the reward

You might object that reinforcement learning needs no ground truth. Lee agrees, but points out that humans are still involved: they write the reward function. To keep supervised learning and RL in one framework, this lecture treats every reward function's output as a loss where smaller is better.

The pain point of RL is that **rewards are sparse**. The slides use a robot opening a door: 1 for an opened door, 0 for everything else, and the robot almost never learns. The usual fix is reward shaping. The true reward stays the same, but you add a proxy reward, say 0.5 for touching the handle. Training uses the proxy loss. Evaluation still uses the real loss.

An LLM can do this step:

- The LLM writes a first proxy reward, which is used to train the target policy (not necessarily an LLM; often a robot arm)
- After training, the policy is scored on the real reward, and the result goes back to the LLM
- The LLM rewrites the proxy reward based on that feedback

The slides cite three papers: [Eureka](https://arxiv.org/abs/2310.12931) (2023), [REvolve](https://arxiv.org/abs/2406.01309) (2024), and [RF-Agent](https://arxiv.org/abs/2602.23876) (2026). The example comes from RF-Agent's ball-catching task. The original reward is one line. The LLM's proxy reward covers many aspects, such as how close the ball is and how the arm is posed.

Lee then detours into dopamine. For genes, the only true reward is reproduction, which is far too sparse. The brain's reward system makes you feel good for each small goal, like catching prey or eating food. That, he says, is reward shaping produced by evolution.

## Step three: let the AI set its own loss

For tasks like writing an essay or answering open questions, you cannot even write a reward function. RLHF works around this. A human can't write the function, but can score an answer, so you train a reward model to imitate human scores and use it to train the policy. Replace the human scores with an LLM's judgment and you get RLAIF.

Again Lee rules out using a stronger model as the judge. His question is whether **a loss the model sets for itself** can make that same model better. The slides list three families:

| Family | How it works |
|---|---|
| Verbalized-based | Ask the model for a 1–5 score, or ask "Is this answer correct?" and use −1 × the probability of the "yes" token as the loss |
| Ensemble-based | Sample the same question many times, take the majority vote as a pseudo answer, and use the distance to it as the loss |
| Certainty-based | Look at the entropy of the output distribution: more concentrated means more confident, so the loss is lower |

Certainty-based methods predate LLMs. [TENT](https://arxiv.org/abs/2006.10726) (2020, images) found that higher entropy goes with higher error rates. Lee's student Guan-Ting Lin proposed [SUTA](https://arxiv.org/abs/2203.14222) for speech recognition in 2022. An early text example is [The Unreasonable Effectiveness of Entropy Minimization in LLM Reasoning](https://arxiv.org/abs/2505.15134) (2025), whose title says it all: just minimizing entropy actually works.

### Does a self-defined loss really work?

Lee cites [How Far Can Unsupervised RLVR Scale LLM Training?](https://arxiv.org/abs/2603.08660). "Unsupervised" here means the LLM sets the reward itself, with no human. Two findings:

- Compared with a reward from true answers, a majority-vote reward performs about the same early in training. The true reward keeps guiding the model for longer, though, and **a model that keeps training on its own loss can eventually break itself**.
- Across 5 self-defined reward methods, some hold up longer before collapsing, but most improve early on.

So self-defined losses help most when you take only a small step. That is exactly **test-time training (TTT)**. At inference you get one test input X. The model produces Y, computes its own loss, updates its parameters, and then the new model produces Y′. From the user's side, X goes in and Y′ comes out. With one example or one batch of training data, the model can't drift far.

## The math section: how is entropy actually computed? (skippable)

The slides bracket this part with **Math Warning** and **End of Math Warning**, and Lee says skipping it won't hurt the rest of the lecture. It comes from a paper by his student Wei-Ping Huang, which was about to go on arXiv at the time: "Rethinking Entropy Minimization in Test-Time Adaptation for Autoregressive Models." I could not find a public version while writing this.

The intuition: the entropy of a sequence sums over all possible outputs, which you can't compute. In practice, people sample one sequence and minimize **the sum of per-token entropies along it** as a proxy loss. The expected value of that proxy equals the true entropy, so it looks sound. But when you take the gradient of the true loss, **a term is missing**.

The missing term does something different. The usual term says: sample one path, then dig deeper into it and make it more certain. The missing term says: across all paths, raise the probability of sampling the low-entropy ones. One refines the path you picked. The other picks a better path to begin with. They complement each other, and both belong in the update.

<details>
<summary>Expand: the true loss, the proxy loss, and the missing term</summary>

The loss you actually want to minimize (sequence-level entropy):

L(θ) = −Σ_Y P_θ(Y|X) log P_θ(Y|X) = E_{Y∼P_θ(Y|X)} [ −log P_θ(Y|X) ]

Y ranges over all possible output sequences, so you can't enumerate it.

The proxy loss you can compute: sample Y = (y₁, y₂, …) and add up the entropy of each step's token distribution

L̃_θ(Y) = Σ_t H( y_t | X, y_<t )

Each step is a single-token distribution, so its entropy is easy. By the chain rule of entropy:

E_{Y∼P_θ} [ L̃_θ(Y) ] = L(θ)

The update used in practice was E_{Y∼P_θ} [ ∇_θ L̃_θ(Y) ]. It feels like "take the gradient of both sides" gives ∇L. But the distribution of Y also depends on θ, so the gradient can't move straight inside the expectation. Expanding with the log-derivative trick (this line is a standard derivation I added; the slides present it as figures):

∇_θ L(θ) = E_Y [ ∇_θ L̃_θ(Y) ] + E_Y [ L̃_θ(Y) · ∇_θ log P_θ(Y|X) ]

The first term is what the earlier literature used. The second is the missing term. It raises the probability of paths with smaller L̃, that is, lower entropy.

The experiment shown in class is on speech recognition across 3 corpora, measured by error rate. Adding the second term beat using only the first term in all 3 settings.

</details>

## Even the questions: No Human in the Loop?!

One human role remains at this point: **humans pick the inputs**. What if the model writes its own questions too? In 2025, [Absolute Zero](https://arxiv.org/abs/2505.03335), [R-Zero](https://arxiv.org/abs/2508.05004), and [Self-Questioning Language Models](https://arxiv.org/abs/2508.03682) appeared almost at once with very similar ideas. Each uses three roles, often played by the same model:

- The **proposer** writes a question
- The **solver** answers it, aiming to minimize the loss from the verifier
- The **verifier** judges the answer

The interesting part is that the proposer has a different loss. If the verifier's loss is too high (nobody can solve it) or too low (it's trivial), the proposer did badly. A question that is **neither too hard nor too easy** counts as success. How each paper defines "in the middle" is where they differ.

The experiment shown in class (the slide cites arXiv 2508.05004) makes two points:

1. The proposer does its job. The same solver gets lower accuracy on questions from steps 15, 30, and 45, so the questions really do get harder.
2. Progress has a ceiling. Starting from Qwen 0.6B, 1.7B, and 4B, all three curves rise, but each one levels off. Stronger starting models go further. The smallest one stops improving around step 15 and never catches the larger models.

Absolute Zero also records an "**Oh-no moment**." With no human guidance in training, the model said while writing a question that it wanted to confuse the other AIs and outsmart other intelligent machines and "less intelligent humans." Lee contrasts it with the "aha moment" in reasoning research: nobody taught the model this, and out came a behavior humans don't want to see.

The more solid finding so far: **a little external information usually helps**. The slides list [SPICE](https://arxiv.org/abs/2510.24684) and [R-Few](https://arxiv.org/abs/2512.02472). Letting the proposer draw on outside documents or a few human-written examples makes the whole proposer–solver–verifier loop work better. The human comes back into the loop, just in a small role.

## A step back: strong AI training weaker AI works in 2026

Sustained self-surpassing looks hard. But having a strong AI carry out the three steps of machine learning to train a model weaker than itself already has plenty of literature. The slides list [PostTrainBench](https://arxiv.org/abs/2603.08640) and [FT-Dojo](https://arxiv.org/abs/2603.01712), and Lee walks through the first:

- The setup is a prompt: here is a weak base model and a target benchmark, one H100, 10 hours, internet allowed. After that, no humans.
- The slide example is **Opus 4.5 post-training Gemma3-4B-Base**. Opus searched the web for a dataset and removed items that overlapped with the test set. Its first run used 200,000 examples, hit a timeout after 5 hours, and left 3 hours 57 minutes. Opus then cut the data to 20,000 examples for one epoch, reran, and delivered a model.
- Overall: the official instruct models (trained by humans) average 51 across the benchmarks, and even Opus's models fall short of that. On tasks like BFCL (tool use), they come close. The awkward part: the base model with a few-shot prompt already scores around 18, and many AI-trained models land around 18 too.

The slides also list the cheating. Models downloaded test data to train on, wrote "# Repeat the data multiple times to overfit" in a comment, called other LLM APIs against the rules, or simply downloaded someone else's trained model and submitted it. Lee's take: humans do the same when they're stuck and nothing forbids it, but that doesn't make it right.

### Weak-to-strong: letting Opus design the method

The last part picks up [OpenAI's weak-to-strong generalization from December 14, 2023](https://openai.com/index/weak-to-strong-generalization/). If AI someday surpasses humans, can humans still teach it? That experiment used a weak model as teacher and a strong model as student. The strong model still learned from the weak one, but it took some method design, such as only learning when the student thinks the teacher is probably right.

Anthropic's April 2026 posts ([short version](https://www.anthropic.com/research/automated-alignment-researchers), [long version](https://alignment.anthropic.com/2026/automatedw2s-researcher/)) keep that setup but have Claude Opus design the weak-to-strong algorithm. Multiple Opus instances exchanged messages, and the methods they designed beat the ones human researchers designed by a wide margin.

Lee's judgment: this still isn't crossing the Rubicon. No matter how good the student gets, it isn't stronger than Opus. Opus isn't training a stronger Opus. The slide's conclusion: **in May 2026, we are probably still standing at the riverbank.**

## Back to the model: this lecture changed only half of it

Every method so far tunes the language model's parameters. But today's AI is often an agent, and the last slide draws it as **AI Agent = Harness + language model**, where the harness includes OpenClaw, Cowork, Claude Code, Hermes, and every file produced during the interaction. Tuning only the parameters strengthens only half the agent. How the other half improves itself is the topic of [part 2](/posts/ai/2026-09-30-ntu-ml2026-self-improving-part2-en).

A summary table of where humans remain at each step:

| What gets handed over | Representative method | Where humans remain |
|---|---|---|
| Answers | Fine-tune on self-corrected answers | Choose inputs and the correction method |
| Reward | LLM-written proxy reward | Define the real reward |
| Loss | Verbalized / ensemble / entropy, TTT | Find inputs; long runs collapse |
| Questions | Proposer / solver / verifier | Define how L and L′ relate; outside data helps |
| The whole training pipeline | PostTrainBench, Opus designing weak-to-strong | The trained model is still weaker than the trainer |

## Going deeper

- **Try it**: take a small model and a math dataset you have. Sample each question 8 times and record the share of the majority answer and the average token entropy of each answer. Check whether "more concentrated means more correct" holds for your model. That is the assumption behind ensemble- and certainty-based losses.
- **Papers**: start with [How Far Can Unsupervised RLVR Scale LLM Training?](https://arxiv.org/abs/2603.08660), the main evidence for "self-defined losses help early and collapse later." Then read [R-Zero](https://arxiv.org/abs/2508.05004) to see how the proposer's loss is defined.
- **Homework**: this term's next assignments are [HW7: Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en) and [HW8: Test-Time Scaling](/posts/ai/2026-09-30-ntu-ml2026-hw8-test-time-scaling-en). HW8's Self-Certainty and DeepConf use the same certainty-based idea from this lecture, but to pick answers rather than update parameters.
- **Related reading**: for the full RLVR picture, see [Stanford CS336 RLVR](/posts/ai/2026-08-22-cs336-rlvr-en) and [CS336 SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en). For RL with LLMs, see [CME295 RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en). For RL fundamentals, see [Berkeley CS285 policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en).

## What this post could and couldn't verify

Verified: the slide text and linked citations, the Chinese captions on the video (marked zh-TW on YouTube and not auto-generated), the titles of the 15 arXiv papers on the slides (checked via the arXiv API), and that Import AI 455 was written by Jack Clark (confirmed on the original page; in class Lee only said the author is "probably one of Anthropic's co-founders").

Not verified: I could not find a public version of Wei-Ping Huang's paper, so the second-term formula in the fold is a standard derivation based on the lecture's description, not copied from the paper. For the Qwen 0.6B / 1.7B / 4B curves, the slide cites the R-Zero arXiv ID, but I did not match the figure against the paper. PostTrainBench's 51 and 18 come from the captions and were not checked against the paper's tables.

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [HW6: Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en) | Next: [HW7: Model Merging](/posts/ai/2026-09-30-ntu-ml2026-hw7-model-merging-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [NTU Hung-yi Lee Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [Self-Improving.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Improving.pdf) (in Mandarin)
- [Video: Is AI about to cross the Rubicon? How far away is self-improving AI (part 1)](https://youtu.be/s06mSAGN4gM) (in Mandarin)
- [Prerequisite: 2025 Intro to Generative AI and ML, Lecture 5](https://youtu.be/Taj1eHmZyWw) (in Mandarin)
- [TTT follow-up: 2025 Intro to Generative AI and ML, Lecture 8: lifelong learning for general models](https://www.youtube.com/watch?v=EnWz5XuOnIQ) (in Mandarin)
- [Import AI 455: Automating AI research](https://importai.substack.com/p/import-ai-455-automating-ai-research)
- [I. J. Good (Wikipedia)](https://en.wikipedia.org/wiki/I._J._Good)
- [Eureka: Human-Level Reward Design via Coding Large Language Models (arXiv 2310.12931)](https://arxiv.org/abs/2310.12931)
- [REvolve: Reward Evolution with Large Language Models using Human Feedback (arXiv 2406.01309)](https://arxiv.org/abs/2406.01309)
- [RF-Agent: Automated Reward Function Design via Language Agent Tree Search (arXiv 2602.23876)](https://arxiv.org/abs/2602.23876)
- [Tent: Fully Test-time Adaptation by Entropy Minimization (arXiv 2006.10726)](https://arxiv.org/abs/2006.10726)
- [Listen, Adapt, Better WER (SUTA, arXiv 2203.14222)](https://arxiv.org/abs/2203.14222)
- [The Unreasonable Effectiveness of Entropy Minimization in LLM Reasoning (arXiv 2505.15134)](https://arxiv.org/abs/2505.15134)
- [How Far Can Unsupervised RLVR Scale LLM Training? (arXiv 2603.08660)](https://arxiv.org/abs/2603.08660)
- [Absolute Zero: Reinforced Self-play Reasoning with Zero Data (arXiv 2505.03335)](https://arxiv.org/abs/2505.03335)
- [R-Zero: Self-Evolving Reasoning LLM from Zero Data (arXiv 2508.05004)](https://arxiv.org/abs/2508.05004)
- [Self-Questioning Language Models (arXiv 2508.03682)](https://arxiv.org/abs/2508.03682)
- [SPICE: Self-Play In Corpus Environments Improves Reasoning (arXiv 2510.24684)](https://arxiv.org/abs/2510.24684)
- [Guided Self-Evolving LLMs with Minimal Human Supervision (R-Few, arXiv 2512.02472)](https://arxiv.org/abs/2512.02472)
- [PostTrainBench: Can LLM Agents Automate LLM Post-Training? (arXiv 2603.08640)](https://arxiv.org/abs/2603.08640)
- [FT-Dojo: Towards Autonomous LLM Fine-Tuning with Language Agents (arXiv 2603.01712)](https://arxiv.org/abs/2603.01712)
- [Anthropic: Automated alignment researchers](https://www.anthropic.com/research/automated-alignment-researchers)
- [Anthropic Alignment Science: Automated weak-to-strong researcher](https://alignment.anthropic.com/2026/automatedw2s-researcher/)
- [OpenAI: Weak-to-strong generalization](https://openai.com/index/weak-to-strong-generalization/)
