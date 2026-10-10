---
title: "CMU 10-423 L20: Reasoning Models — From Chain-of-Thought to o1, DeepSeek-R1, and GRPO, Plus a Look at Mechanistic Interpretability"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, reasoning, chain-of-thought, grpo, deepseek-r1, interpretability]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 19
tldr: "Lecture 20 of CMU 10-423 (Spring 2026) tells the story of reasoning models as one line: chain-of-thought prompting gets models to write intermediate steps, STaR fine-tunes on the reasoning that led to correct answers, and OpenAI o1 trains thinking tokens with reinforcement learning so compute can be added at both training and inference time. On the open side, DeepSeek-R1-Zero uses only rule-based rewards and GRPO and its reasoning grows longer on its own; DeepSeek-R1 adds SFT back to fix readability and language mixing. The lecture ends with mechanistic interpretability: why superposition makes models hard to read, and how replacement models such as sparse autoencoders, circuits, and cross-layer transcoders address it."
description: "A guide to Lecture 20 of CMU 10-423/623/723 Generative AI (Spring 2026): chain-of-thought and zero-shot CoT, the o1 cipher example, STaR, the AIME dataset, o1's training and inference compute, PPO versus GRPO, DeepSeek-R1-Zero's rule-based rewards and results, DeepSeek-R1's four-step training pipeline, and superposition, sparse autoencoders, and cross-layer transcoders in mechanistic interpretability."
draft: false
glossary:
  - term: "GRPO"
    aliases: ["Group Relative Policy Optimization"]
    definition: "A PPO-like reinforcement learning algorithm: sample a group of answers to the same question and use the group's average reward as the baseline for the advantage, so no separate value model is trained and memory needs drop sharply. The KL penalty is added directly to the loss rather than to the reward."
    context: "The algorithm CMU 10-423 Lecture 20 introduces before DeepSeek-R1; it comes from DeepSeekMath."
    links:
      - label: "DeepSeekMath (Shao et al., 2024)"
        url: "https://arxiv.org/abs/2402.03300"
  - term: "STaR"
    aliases: ["Self-Taught Reasoner"]
    definition: "Use a few human-written rationales as in-context demonstrations so the model generates rationales for many problems that have none; if an answer is wrong, try to generate a rationale that leads to the correct answer; then fine-tune only on rationales that led to correct answers, and repeat."
    context: "The self-training method CMU 10-423 Lecture 20 presents between CoT prompting and o1."
    links:
      - label: "STaR (Zelikman et al., 2022)"
        url: "https://arxiv.org/abs/2203.14465"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-reasoning-models)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 19 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and follows [L19 + L21: long context and state space / hybrid models](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en). It covers Lecture 20, "Reasoning Models," on March 30, 2026, given by Aran Nayebi and Matt Gormley.

Official materials used: the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) and the [L20 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture20-reasoning.pdf) (39 pages, no inked version). The full title on the cover slide is "Reasoning Models + Mechanistic Interpretability," which adds the interpretability second half that the schedule leaves out. The schedule lists no readings for this lecture, so this post cites only the slides and the sources they credit. The course's access grade is **A3** (definitions in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)), but the recordings sit behind a CMU Panopto login, so this post relies only on the slides.

The question this lecture answers: **how do reasoning models differ from ordinary LLMs in training and inference?** The slides answer in three steps: get the model to write its reasoning out, reward correct reasoning with reinforcement learning, and let the model spend more compute thinking at inference time too.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. On 2026-10-10 the anonymous Panopto folder listed no videos and prompted sign-in. The course homepage and schedule link no public (YouTube) recordings; an instructor post dated 2026-04-08 said YouTube recordings were “coming very soon”, but no such link had appeared on the official pages when checked. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

Checked: 2026-10-10.

## One thing first: the exam is tonight

The second slide is a reminder: an 80-minute exam at 7 pm that evening, covering Lectures 1–15 (the same as Quizzes 1–4), with one double-sided sheet of notes allowed; unlike the all-multiple-choice quizzes, the exam includes open-ended questions. So L20 itself is not on the exam. It is tested only by Quiz 5 (April 6, covering L16–L20), whose questions are not public.

## Step one: get the model to write its reasoning out

### Chain-of-thought prompting

The slides pick up from [in-context learning in L10](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en):

- Including reasoning in the few-shot demonstrations improves performance; this is [chain-of-thought prompting (Wei et al. 2022)](https://arxiv.org/abs/2201.11903)
- Even simpler: with no demonstrations at all, just prompting the model to "think step by step" also helps, from [Kojima et al. 2022](https://arxiv.org/abs/2205.11916)

### A really long "thought"

The slides then spend eight pages on the cipher problem from [OpenAI's o1 announcement](https://openai.com/index/learning-to-reason-with-llms/). The prompt gives an example: `oyfjdnisdr rtqwainr acxz mynzbhhx` decodes to `Think step by step`, and asks the model to decode another ciphertext by the same rule.

The excerpted thinking reads like someone trying things on scratch paper: count the letters, notice that each ciphertext word is exactly twice as long as the plaintext word, guess that two letters map to one, try summing letter positions, and keep going until it decodes `THERE ARE THREE R'S IN STRAWBERRY`. The slides mark "1276 lines later" in the middle, a reminder of how long this thinking runs.

The point is not the cipher. It is a product decision behind o1: **OpenAI did not release the full "Thinking" output, only a summary of it.**

### STaR: train on the reasoning that got it right

Before o1, the slides introduce [STaR (Self-Taught Reasoner)](https://arxiv.org/abs/2203.14465). There are only two kinds of data: a small set of human-annotated rationales, and many problems without rationales. The loop repeats:

1. Use the few rationale examples for ICL to generate rationales for the problems without them
2. If a generated answer is wrong, try to regenerate a rationale that leads to the correct answer
3. Fine-tune on all rationales that led to correct answers

This step turns "reasoning" from a prompting trick into training data.

## Step two: train thinking tokens with reinforcement learning

### AIME and o1

The slides first introduce the benchmark that keeps coming back: the [AIME 2024 dataset](https://huggingface.co/datasets/Maxwell-Jia/AIME_2024), problems from the American Invitational Mathematics Examination.

Then the summary of o1:

- o1 was trained with reinforcement learning to generate chain-of-thought style rationales for its answers
- These rationales (called Thinking tokens) are hidden from the user, who sees a summary instead
- **At train time**, compute can be increased by doing more reinforcement learning; **at test time**, by letting the model think longer
- Result 1: more train-time compute gives higher accuracy on reasoning problems; result 2: more test-time compute does too

The slides ask and answer their own question here: why is this description so vague and non-technical? Because OpenAI only released a blog post, and this is about the sum total of what it said.

The slides then use OpenAI's figure to show o1 beating GPT-4o across math, reasoning, commonsense, coding, and other problems, and conclude: the closed-source o1 was clearly superior to any open-source model, "so we waited for the open source models to catch up…"

### Enter DeepSeek-R1

[DeepSeek-R1](https://arxiv.org/abs/2501.12948) is the slides' answer: open source, open weights, 671B parameters, a carefully tuned version of the base model DeepSeek-V3, with performance comparable to o1.

### How PPO and GRPO differ

To explain how R1 was trained, the slides go back to the algorithm. GRPO predates R1 and was introduced in [DeepSeekMath](https://arxiv.org/abs/2402.03300). The slides' one-line version: **GRPO is an RL algorithm akin to PPO, but it removes the value model and so greatly reduces memory requirements.**

The slides paste two passages and the diagram from the DeepSeekMath paper. The differences fit in one table:

| | PPO | GRPO |
|---|---|---|
| Models to train | Policy model + value model | Policy model only |
| Where the advantage comes from | Rewards and the value model's estimates, via GAE | Sample a group of answers (o₁…o_G) to the same question and use their relative rewards as the baseline |
| Where the KL penalty goes | Added to the per-token reward | Added directly to the loss, keeping the advantage computation simple |

For PPO, look back at [RLHF in L11](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en): the PPO there is the left column of this table.

<details>
<summary>Expand: the structure of the GRPO objective</summary>

Equation (3) from DeepSeekMath, as pasted on the slides, breaks into three layers:

1. For each question q, sample G answers from the old policy
2. For every token of every answer, compute the probability ratio between the new and old policies, multiply by the advantage Â, and apply the same clip as PPO (range 1−ε to 1+ε)
3. Average over all answers and tokens, then subtract β times the KL between the new policy and the reference policy

ε and β are hyperparameters. The only differences from PPO are where Â comes from and where the KL goes.

</details>

### DeepSeek-R1-Zero: reinforcement learning only

The slides spend five pages on R1-Zero:

**Training method**
- Trained entirely with reinforcement learning, without any supervised fine-tuning (SFT)
- Starts from the pretrained DeepSeek-V3-Base, with RL that uses no human preferences
- The slides call it one of the first large-scale demonstrations of RL-only training for LLMs
- The aim was to see whether reasoning abilities can emerge from RL alone, without labeled data

**Reward model**: no neural reward model, just two rule-based rewards:
- **Accuracy reward**: is the answer correct?
- **Format reward**: did the model follow the prompt template?

The template asks the model to put its reasoning inside `<think>` tags and its answer inside `<answer>` tags.

**Results**
- On AIME, the longer the model is trained with RL, the better it performs, eventually surpassing o1
- The model gradually learns to use longer and longer sequences of Thinking tokens. This comes purely from the RL objective; nothing directly pushes reasoning length up

**Problems**
- Poor readability: humans can't really understand what it is saying
- Language mixing: English and Chinese muddled into a pidgin

### DeepSeek-R1: bring SFT back

R1 builds on R1-Zero with a hybrid training strategy. The figure the slides cite lists four steps:

1. **Cold start**: fine-tune the base model on a few thousand curated, human-friendly long CoTs
2. **Reasoning-focused RL**: scale up RL on math, coding, and logic tasks, and add language-consistency rewards to keep the model in a single language
3. **Rejection sampling + SFT**: sample correct, well-structured chains of thought from the RL model, add general-capability data (writing, Q&A, self-cognition), and train a new base checkpoint
4. **RL across scenarios**: a second RL stage covering both reasoning tasks and general tasks, for "helpfulness" and "harmlessness"

The slide text calls this a "two-stage pipeline," while the cited figure lists four steps. My reading is that the "SFT then RL" pair is done twice, but that is a guess; the in-class explanation is not available. The slides' conclusion is clear: doing SFT before RL fixed R1-Zero's repetition and language mixing, and improved readability, coherence, and task accuracy.

## Second half: mechanistic interpretability

The last six slides switch topics. They list four reasons interpretability matters: safety (corrective action), safety (preventative action), preventing an AI apocalypse, and learning from AI.

**Why it is hard**: the main problem is superposition. A human-interpretable "feature" rarely activates in a single place in the network; its activations are almost always spread across many locations: across heads, across MLP neurons, across layers.

**Replacement models**: for specific blocks in a network, train a "replacement block" to mimic the original block's input-to-output behavior, with the key requirement that the replacement be more interpretable. The techniques listed:

- **Sparse autoencoders**: replace the MLP layer in a Transformer block with an autoencoder version that has more neurons (features) in the hidden layer, plus a regularizer that encourages sparse activations, such as L1
- **Circuits**
- **Cross-layer transcoders**: let a replacement block directly access all earlier replacement blocks

The final slide shows Anthropic's [On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html), which uses a circuit tracing method to study the internal mechanisms of Claude 3.5 Haiku in settings such as multi-step reasoning, planning rhymes, multilingual circuits, medical diagnoses, refusals, jailbreaks, and CoT faithfulness. The slides show only the study's table-of-contents figure and do not walk through individual cases.

## One table to wrap up

| Stage | Examples | Where the reasoning comes from | Where compute is added |
|---|---|---|---|
| Prompting | CoT, zero-shot CoT | Demonstrations, or a single "think step by step" | A few more tokens at inference |
| Self-training | STaR | Generated by the model, keeping only correct ones | Fine-tuning |
| Reinforcement learning | o1, R1-Zero, R1 | Rewards for correct answers (R1 adds format and language consistency) | More RL at training time, longer thinking at inference time |

**Try this tonight**: compute GRPO advantages by hand once. Suppose you sample 4 answers to one question and the rule-based rewards are [1, 0, 0, 1]. Following the outcome supervision setup in the DeepSeekMath paper, subtract the group mean (0.5) and divide by the group standard deviation (0.5 using the population standard deviation), giving advantages [1, −1, −1, 1]. Now change the rewards to [1, 1, 1, 1]: after subtracting the mean everything is 0, and the formula would divide by 0. The small example shows that when a group is all right or all wrong, there is nothing to compare against inside the group, so that question provides no learning signal.

## What this post can and cannot confirm

Confirmed: the schedule's date and quiz coverage; the text, tables, figure captions, and credits on the slides; how GRPO normalizes advantages (checked against the DeepSeekMath paper); and the titles of the papers the slides cite (checked against arXiv). Not confirmed: what was said in class (Panopto requires login), numbers shown only in figures (for example, o1's compute curves, R1-Zero's AIME accuracy curve, and the R1 versus o1 benchmark bars), and the official explanation of the gap between "two-stage" and the four-step figure.

Further reading: this site's [CME295 LLM reasoning post](/posts/ai/2026-09-29-cme295-llm-reasoning-en) and [CS336 RLVR post](/posts/ai/2026-08-22-cs336-rlvr-en) cover reasoning models and verifiable rewards from other angles; for interpretability, continue with the [CS224N interpretability post](/posts/ai/2026-08-22-cs224n-interpretability-en) and the [Harvard CS2881R interpretability post](/posts/ai/2026-09-30-cs2881r-lecture-10-interpretability-en).

Series navigation: previous [L19 + L21: long context and state space / hybrid models](/posts/ai/2026-09-30-cmu10423-long-context-ssm-en) | next [L22 + L26: practical risks and the science of alignment](/posts/ai/2026-09-30-cmu10423-risks-alignment-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (L20 date, exam, and Quiz 5 coverage)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 20 slides: Reasoning Models + Mechanistic Interpretability](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture20-reasoning.pdf)
- [Wei et al. 2022: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903)
- [Kojima et al. 2022: Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916)
- [OpenAI: Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/)
- [Zelikman et al. 2022: STaR: Bootstrapping Reasoning With Reasoning](https://arxiv.org/abs/2203.14465)
- [Maxwell-Jia/AIME_2024 dataset (Hugging Face)](https://huggingface.co/datasets/Maxwell-Jia/AIME_2024)
- [DeepSeek-AI 2025: DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948)
- [Shao et al. 2024: DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models](https://arxiv.org/abs/2402.03300)
- [DeepSeek-R1 explained (Hugging Face blog, source of the R1 pipeline figure on the slides)](https://huggingface.co/blog/NormalUhr/deepseek-r1-explained)
- [Anthropic 2025: On the Biology of a Large Language Model](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)
