---
title: "Post-Training and Efficient Adaptation: How a Model Learns to Follow Instructions and How to Tune It Cheaply | NTU Yun-Nung Chen Applied Deep Learning Lecture 7"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, llm, post-training, instruction-tuning, rlhf, dpo, peft, lora]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning"
  order: 8
tldr: "A pre-trained model continues text well and still may not do what an instruction asks. The first half of this lecture covers the two steps of post-training: instruction tuning uses many different tasks to teach the model to read task descriptions, and RLHF then moves the model toward whole responses that people prefer, with a reward model and pairwise comparisons handling the cost of human labor and inconsistent scores, while DPO and KTO drop the reinforcement-learning part. InstructGPT and ChatGPT are these two steps chained together. The second half covers LLM adaptation: models are too large to fine-tune in full, so only a small number of parameters are trained, with Adapter, LoRA, and prompt tuning, and no single method is best on every task."
description: "A guide to Lecture 7 of Yun-Nung Chen's NTU Applied Deep Learning, Fall 2025, based on the Post-Training and LLM Adaptation decks and the spoken content of videos 7.1–7.5: specialists and generalists, instruction tuning (FLAN, T0, Super-NaturalInstructions) and its three limits, a quick policy-gradient review, reward models, pairwise comparisons, Stiennon et al. 2020, DPO, KTO, InstructGPT's three steps and the multi-turn ChatGPT version; Adapter, LoRA, prompt tuning, and the UniPELT comparison; and what the HW2 briefing video says. Includes three examples you can work by hand and a self-check."
draft: false
glossary:
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback: train a reward model on human preference data, then tune the language model with reinforcement learning (often PPO) so its outputs earn higher reward."
    context: "ADL Post-Training deck, slides 26–39."
  - term: "DPO"
    definition: "Direct Preference Optimization (Rafailov et al., 2023): tune the model directly on better/worse response pairs in a supervised way, with no separate reinforcement-learning loop."
    context: "ADL Post-Training deck, slide 38, which calls it removing the RL from RLHF."
  - term: "InstructGPT"
    definition: "The model and method of Ouyang et al. 2022: starting from GPT-3, run supervised fine-tuning, reward-model training, and PPO reinforcement learning in sequence."
    context: "ADL Post-Training deck, slides 40–50, used to tie the whole post-training pipeline together."
  - term: "PEFT"
    aliases: ["Parameter-Efficient Fine-Tuning"]
    definition: "Freeze most of a pre-trained model's parameters and train only a small number of added or selected ones, so one base model can adapt to different tasks at low cost."
    context: "The topic of the ADL LLM Adaptation deck, which calls it Parameter-Efficient LM Tuning."
  - term: "LoRA"
    aliases: ["Low-Rank Adaptation"]
    definition: "The method of Hu et al. 2021: leave the original weights untouched and learn an update that is squeezed to a very small dimension and expanded again, then added to the original output."
    context: "ADL LLM Adaptation deck, slides 9–11."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)

**Video status: Videos included.** [Source details](#course-video-sources)

This is Lecture 7 in [Reading NTU Yun-Nung Chen Applied Deep Learning](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en), based on the 9/22 week of ADL Fall 2025 (114-1, 2025/09/01–12/15). [Lecture 6](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en) covered pre-training and the ways to use prompts. This one answers two questions: **a pre-trained model already continues text well, so why train it again? And when the model really has to change, how can anyone afford to change something this large?**

Official materials:

- The [Post-Training deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf) (55 slides) and videos [7.1 Post-Training](https://youtu.be/G5O93KOsBCs) (16:50), [7.2 Instruction Tuning / SFT](https://youtu.be/PfSybChNSNc) (27:46), [7.3 RLHF](https://youtu.be/4Md8Y0zAXUE) (33:30), and [7.4 InstructGPT & ChatGPT](https://youtu.be/-hchhJoH3YE) (13:58)
- The [LLM Adaptation deck](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf) (14 slides) and video [7.5 Parameter-Efficient Fine-Tuning](https://youtu.be/ii2kMoUyNOs) (19:21)
- The [HW2 briefing video](https://youtu.be/_QiIp0WTRzI) (13:05)

7.1, 7.2, 7.3, and 7.5 have captions. 7.4 and the HW2 briefing have none, so this guide works from transcripts made from their audio. The lectures are in Mandarin. Examples marked "made up for this post" are not from the lecture.

After reading you should be able to do five things: state the difference between specialists and generalists and why a generalist needs an instruction; explain what ability instruction tuning trains and its three limits; name the three steps of RLHF and what the reward model and pairwise comparisons each solve; tell apart the data that RLHF, DPO, and KTO need; and compute how many parameters LoRA trains on one weight matrix.

## First half: post-training

### Specialists and generalists

Model training used to have only training and testing. The term post-training appeared after pre-training did: the model first "reads books" on large amounts of text, and any training done after that and before deployment counts as post-training.

Professor Chen opens the lecture with a contrast (slides 3–10):

- **Specialist**: masters one task. A summarization model only summarizes, translation is a different model, and the two have different parameters.
- **Generalist**: one model does many tasks, and is not necessarily the best at each.

The difference shows in the input. A specialist does not need to be told what to do; give it the text and it summarizes. A generalist is one model that summarizes this time and translates next time, so the input needs an extra prompt or instruction saying what the task is.

Can a generalist match a specialist? Slide 5 shows a machine translation comparison (Jiao et al. 2023; Hendy et al. 2023) between WMT systems built for translation and the GPT series. She asks the class to skim it: the generalist's scores are mostly a little lower.

She then says this does not settle which side to choose. Generalists keep improving, and the models are large. If your need is to translate every incoming document, at that volume a much smaller dedicated model with similar quality may be the better deal. In industry you weigh performance, cost, storage, and speed together, and no solution is always best.

The generalist idea is not new. Slide 7 is a 2018 paper (McCann et al., The Natural Language Decathlon) that writes translation, summarization, natural language inference, and sentiment analysis all as "question, context, answer," and trains one model on all of them.

A generalist has one advantage a specialist lacks. A specialist can handle unseen **data** and cannot handle unseen **tasks**. A generalist that has really learned to "read a description and do the task" has a chance at a new task as long as it is described clearly (slide 8: prompt engineering enables to perform unseen task).

Slides 9–10 map the contrast onto the two routes from the previous lecture: specialists correspond to fine-tuning, where the model's parameters actually change; generalists correspond to prompting, where the model stays fixed and the prompt switches the task.

### Why train another round

Slide 11 lists what it takes to train a good generalist. First come large pre-training data and a large enough model; with both, the so-called emergent ability appears: the model has read enough to start inferring things no one taught it directly. With too little data or too small a model, it does not appear.

To improve further there are two directions:

- **The tasks are known.** If the model will only ever summarize, write a good prompt for summarization, do prompt tuning, or fine-tune the model on summarization data. This is the same idea as pre-training BERT and then fine-tuning it.
- **The tasks are unknown.** If you do not know whether users will ask for summaries, translations, or answers, you cannot tune toward a target. The model then has to learn more general ability, by collecting annotations or feedback on a large number of different tasks.

The second direction leads to this lecture's two methods: **instruction tuning** and **RLHF**.

### Instruction tuning: teaching the model to read the question

The idea on slide 13 is simple: since future tasks are unknown, train the model's ability to **understand task descriptions**. The slide contrasts two inputs built from the same sentence:

- Sentence completion only: `I went to Jolin's concert last night. I really loved her songs and dancing. It was ______`
- With a detailed task description: `Decide the sentiment of the following sentences: …… OPTIONS: - positive – negative - neutral`

The model can continue the first one, since pre-training is exactly sentence continuation, and no one has told it what the goal is. Her analogy: this is like a child who has finished reading and now does many practice exams. After seeing many question types, the child is better at telling what a new type is asking for.

Slide 14 draws three approaches side by side:

| Approach | Flow | Property |
|---|---|---|
| (A) Pretrain–finetune (BERT, T5) | Pre-train → fine-tune on task A → do task A | Needs many labeled examples per task; one model per task |
| (B) Prompting (GPT-3) | Pre-train → do task A directly with few-shot examples or a prompt | The model is not adjusted |
| (C) Instruction tuning (FLAN) | Pre-train → fine-tune by instruction on tasks B, C, D, … → do unseen task A | The model learns to "do tasks from natural-language instructions" |

This comes from Google's FLAN (Wei et al., 2022). To verify that untrained tasks also improve, datasets are first grouped by task (slide 16: natural language inference, commonsense, sentiment, translation, summarization, and so on); a whole cluster is removed from training and used only at test time.

Slide 17 has the results. The left chart compares zero-shot performance of FLAN 137B, GPT-3 175B, and others on each task, and FLAN's stars mostly sit to the right. Her point: GPT-3 is used straight after pre-training and is even a little larger; FLAN went through instruction tuning, understands tasks better, and does better zero-shot on other tasks.

The right chart is an ablation on how detailed the instruction must be (zero-shot average over four task clusters):

| Given at fine-tuning | Given at evaluation | Score |
|---|---|---|
| No instruction | Instruction | 37.3 |
| Dataset name | Instruction | 46.6 |
| Dataset name | Dataset name | 47.0 |
| Instruction | Instruction (FLAN) | 55.2 |

The conclusion is that both sides need full instructions. She explains that some dataset names happen to be task names, such as NLI, so the name alone gives a hint; some names have no very direct relation to the task, and a name alone is then harder to work from.

Slide 18 adds two experiments:

- **It stacks with prompt tuning.** Instruction tuning changes the model and prompt tuning changes the prompt, so they do not conflict. After prompt tuning, the model without instruction tuning scores 63.8 (32 training examples) and 78.1 (full training set), and the instruction-tuned model scores 79.1 and 87.4.
- **The model must be large enough.** The five sizes on the chart are 0.4B, 2B, 8B, 68B, and 137B. At the first three, instruction tuning is worse than no tuning, and it flips only at 68B and 137B.

She warns against applying the second point directly today. That was an experiment of its time; an 8B or even a 3B model now generalizes well after instruction tuning, because techniques and data have improved. What carries over is the trend: a model that is too small can hardly be expected to have general ability.

### T0: another version from the same year

Slides 19–23 are T0 (Sanh et al., 2022), from the same year. The idea is identical: write many tasks as prompts with descriptions, train one model on all of them as multi-task training, and hope it generalizes zero-shot to unseen tasks.

She thinks the name T0 refers to T5, and even the figures look alike. T5 also trained many tasks into one model, without aiming to generalize to new tasks, and for some tasks the input was prefixed only with a dataset code. Her example is STS-B, which judges how similar two sentences are: T5 writes only `stsb sentence1: ……` in front and never says what the task is. A model that has not seen the code does not know what to do. Replace the code with a task description and generalization becomes possible.

Slide 22 compares T0 (11B) with GPT-3 (up to 175B). She says T0 is better on most datasets while being only 11B, under 100B and far smaller than GPT-3.

Slide 23 asks how many different prompts per task are best. Summarization can be requested as "please summarize this paragraph" or "describe this paragraph in a few words." The four settings on the chart are p = 0 (T5+LM, without this training), p = 1, p = 5.7, and p = 8.03 (T0), where p is the average number of prompts per dataset. Her reading has two parts: more prompt variety helps a little more, and the largest gap is between 0 and 1, that is, whether instruction tuning was done at all, with diminishing returns after that.

### Large enough to become part of pre-training

The title of slide 24 strikes out "Tuning" in "Instruction Tuning" and replaces it with "Pretraining." The slide says the Super-NaturalInstructions dataset contains over 1.6K tasks and 3M+ examples. Her explanation: once this kind of data is large enough and generic enough that it is run regardless of the target, it is effectively a fixed stage of training.

### Three limits of instruction tuning

Slide 25 lists three problems, which are also the reasons for moving on to RLHF:

1. **Paired data is expensive.** Every item needs a problem and an answer. She adds a language issue: existing data is mostly English, and after translating it into another language there is no way to confirm that the questions still make sense or that the translation is good, so some groups build instruction data for specific languages.
2. **Open-ended tasks have no single correct answer.** Summarization already has some slack, and "write a three-sentence story" can be done in countless ways. Training on one fixed input–output pair pushes the model toward one way of writing and narrows it.
3. **The training objective is at the token level.** The model produces a first token, it is compared with the first token of the reference, and any gap produces an update; the second token is handled the same way. Every token has the same weight, while a sentence contains content words that carry meaning and function words that matter much less.

The third point gives the conclusion of this part: a language model's objective matches token by token, and a person judges a response as a whole. The two do not agree (the deck: mismatch between LM objective & human objective). A second stage is therefore needed, which changes what is optimized from tokens to the whole response.

### Before RLHF: a minimal review of reinforcement learning

Slides 27–30 go through reinforcement learning quickly; she says this part is reference material for anyone unfamiliar with it. Mapped onto a language model:

- The **actor** is whoever acts, here the language model itself.
- An **action** is choosing one token from the vocabulary and producing it.
- A **trajectory (τ)** is a sequence of states, actions, and rewards: τ = {s₁, a₁, r₁, s₂, a₂, r₂, …, s_T, a_T, r_T}. Her analogy is a video game: the screen is the state, a button press is the action, the press leads to the next screen, and so on to the end. For a language model, it runs from the input arriving to the whole response being produced.
- The reward of a trajectory is the sum of the rewards at each time step, R(τ) = Σ γ^(t−1) r_t; the γ is a scaling factor applied in the sum, which she says is not important here.
- How good a model is depends on its **expected reward**. All possible trajectories cannot be collected, so the model is run N times and averaged: R(θ) ≈ (1/N) Σ R(τⁿ).

Training adjusts the parameters to raise the expected reward, θ′ ← θ + η∇R(θ). The most basic method is policy gradient, and slide 29 writes the gradient as:

∇R(θ) ≈ (1/N) Σₙ Σₜ R(τⁿ) ∇ log p(aₜⁿ | sₜⁿ, θ)

What she wants remembered is its meaning: if an action taken in some state is followed by high reward, raise the probability of "this action in this state"; if the reward is low, lower it. Replace the action "jump" with "produce a certain token" and the meaning is the same. The slide adds a reminder on this page: use the cumulative reward of the whole trajectory, not the immediate reward of that step.

The process is therefore a loop (slide 30): produce a batch of responses with the current model → each response gets a reward → update the model by the rewards → produce another batch with the new model.

### Problem one: who gives the score

The loop needs someone to tell the model "this whole response gets this score." Asking people is the most direct way, and training produces an enormous number of responses, so scoring each by hand is not feasible (slide 31: human-in-the-loop is expensive).

The solution is to train a **reward model (RM)** to simulate human scores: the input is the problem and the response, and the output is a score. A batch of human-scored data is collected first, and the RM is trained on it with supervised learning.

With an RM in hand, why not use it directly to pick answers? Slide 32 draws exactly that: sample three responses for one input, score each with the RM, and choose the highest. She says this certainly works and has two drawbacks:

- **Slow.** Output appears only after all responses are produced and scored, so it cannot be shown as it is generated the way current products do.
- **Expensive.** Three responses are produced and one is used, so the cost is three times.

Slide 33 therefore uses the RM's scores to tune the language model, so the model itself learns which responses people prefer. After training, inference needs only one generation.

### Problem two: human scores are inconsistent

Slide 34 states the second problem: human judgments are noisy and miscalibrated. Her description: you are asked to score a response from 0 to 10, you think it is good and give 7; many items later you see another response to the same question, you have forgotten the earlier 7, you think this one is also good and give 7 again, though it is not as good as the first. Such scores do not reflect the difference between the two.

The solution is to ask an easier question: give two responses to the same input and ask **which is better**. The RM's loss is then written as:

L(r_θ) = −E[ log σ( r_θ(x, y_j) − r_θ(x, y_k) ) ]

y_j is the chosen response and y_k is the losing one. The loss pushes the winner's score minus the loser's score to be as large as possible.

**Example (made up for this post).** Setup: one question has two responses and the annotator chose A. The RM currently scores A at 2.0 and B at 0.5.

- Reasoning: the score difference is 2.0 − 0.5 = 1.5, σ(1.5) ≈ 0.818, and the loss is −ln 0.818 ≈ 0.20.
- If the RM has it backwards, with A at 0.5 and B at 2.0: the difference is −1.5, σ(−1.5) ≈ 0.182, and the loss is −ln 0.182 ≈ 1.70.
- Result and meaning: the loss is small when the ordering agrees with the person and large when it is reversed. The loss depends only on the **difference** between the two scores, so the RM learns relative order; scoring A at 2.0 or at 102.0 makes no difference as long as B is also 100 higher. This sidesteps the question of what a 7 means.

The RM's quality is critical, because the language model optimizes entirely against its scores; with a bad RM everything after it breaks. After training, part of the human labels is held out as a validation set to check how close the RM's judgments are to people's. Slide 35 is a chart from Stiennon et al. 2020: the horizontal axis is RM model size, the lines are different data sizes (8k to 64k), and the two dashed horizontal lines are the level of a single annotator and of several annotators combined. Validation accuracy rises with a larger RM and more data, and the slide concludes that a large enough RM can approach single human preference.

### The three steps of RLHF

Slide 36 is the pipeline from Stiennon et al. 2020, applied at the time only to summarization, though the method is general:

1. **Collect human feedback.** Produce several summaries of the same post, take two, and ask a person which is better.
2. **Train the reward model** on the pairwise comparisons from step 1.
3. **Train the policy with PPO.** The policy is the language model, starting from the pre-trained model; it produces a summary, the RM scores it, and the score is used as the reward to update it. PPO is one method in the policy-gradient family.

Slide 37 has the result. The vertical axis is "fraction preferred to reference," and the dashed line at 0.5 is the reference summaries themselves. Pre-training only is lowest, supervised learning is below 0.5, and the model with human feedback is above 0.5.

She points out that the model with human feedback beats even the dataset's reference summaries. Her explanation returns to the second limit above: summarization is somewhat open-ended, and supervised training that makes the model produce one particular answer does not necessarily match how people judge quality.

### DPO: taking the RL out

Slide 38 is DPO from 2023 (Rafailov et al.). The original RLHF is: preference data → train an RM → the RM supplies rewards → train the language model with reinforcement learning.

She does not derive the formula and only explains why it can be simplified. In ordinary reinforcement learning, such as playing a game, how the environment changes after an action is unknown, and the simulator is a black box. Producing tokens is different: once the model produces the first token, the next state is "the original input plus that token," with no unknown environment in between. Without that unknown, the objective that needed reinforcement learning can be rewritten as one trained directly in a supervised way:

L_DPO = −E[ log σ( β log(π_θ(y_w|x) / π_ref(y_w|x)) − β log(π_θ(y_l|x) / π_ref(y_l|x)) ) ]

y_w is the better response, y_l is the worse one, and π_ref is the reference model from before training (the note on notation is added here from the DPO paper). The loss asks that, relative to the reference model, the better response's probability rise more than the worse one's. Only pairs of the form "y_w beats y_l" are needed, with no separate RM and no reinforcement-learning loop.

**Example (made up for this post).** Setup: take β = 1. The reference model gives both responses probability 0.20; the current model gives the better one 0.30 and the worse one 0.10.

- Reasoning: the log ratio of the better response is ln(0.30/0.20) ≈ 0.405, and of the worse one ln(0.10/0.20) ≈ −0.693. Their difference is 1.099, σ(1.099) = 0.75, and the loss is −ln 0.75 ≈ 0.29.
- For comparison: if the model has not moved and both are 0.20 like the reference, both log ratios are 0, σ(0) = 0.5, and the loss is −ln 0.5 ≈ 0.69.
- Result and meaning: pushing the better response's probability up and the worse one's down lowers the loss from 0.69 to 0.29. The whole computation uses only probabilities the model itself computes, so it can be trained by gradient descent like ordinary supervised training.

She says DPO is more efficient and faster, and performs no worse than RLHF. The slide's tagline is Removing "RL" from RLHF. She also notes a point about wording: when people say "I am applying RLHF" today, the actual method is mostly this kind of supervised likelihood maximization with no RL inside, and the name has simply stuck.

### KTO: no paired data either

DPO still needs paired data: one question, two responses, and someone marking which is better. KTO on slide 39 (Ethayarajh et al., dated 2023 on the slide) addresses how hard such data is to get. Her example is a situation everyone has met: you ask a model a question, it gives one answer, and all you can do is click thumbs up or thumbs down. Occasionally a product shows two answers side by side and asks you to choose, which is paired data, and most of the time it does not.

KTO optimizes with only binary labels (this response is good, this one is bad), aiming to approach DPO's effect. She says its results are close to DPO's, and on the slide's chart it is even a little higher. The slide concludes that KTO provides a practical approach for preference tuning.

### InstructGPT: chaining the two steps

Video 7.4 returns to GPT. She says InstructGPT (Ouyang et al., 2022) matters because ChatGPT has no full technical report; the official statement is only that the method is about the same as InstructGPT's, extended from single-turn to multi-turn. Understanding InstructGPT therefore explains how GPT-3, with only pre-training, became ChatGPT.

Three steps (slides 41–45):

1. **Supervised fine-tuning (SFT).** Collect human-written demonstrations: one prompt paired with a human-written desired output. The slide notes 30K tasks. She adds where the data came from: after GPT-3 was trained it was opened to the public through the Playground, so a very diverse set of prompts could be collected. This step is instruction tuning, now often called SFT (slide 41: Supervised fine-tuning (SFT) = Instruction tuning).
2. **Train the reward model.** Sample several outputs for one prompt and have a person rank them. The slide's example has four outputs A, B, C, D with the human ranking D > C > A = B. The loss is the same pairwise comparison as above; slide 43 also notes normalizing the reward model with a bias to zero mean.
3. **Reinforcement learning via PPO.** The model, already through SFT, produces responses, the RM scores them, and the scores update the model, repeatedly.

Slide 45 gives the objective:

objective(φ) = E[ r_θ(x, y) − β log( π_φ^RL(y|x) / π^SFT(y|x) ) ]

The first term is the RM's score, and the second is the gap between the new model and the SFT model, which holds the model back from drifting too far from the SFT model (this reading is added by this post). She does not unpack the formula, says only that it makes a small adjustment, and leaves it to the class. The same slide has **PPO-ptx**: mixing the pre-training gradients into the PPO gradients by adding a term γ E[log π_φ^RL(x)], to reduce the model's regression on general NLP datasets.

Her summary of the three steps: the data for SFT and RLHF both cover a very diverse set of questions and optimize at the level of the whole response, so the model's general ability can be expected to improve (slide 44: Diverse tasks (questions) can improve model's generalizability).

### How InstructGPT was evaluated

Slide 46 compares GPT, SFT only, and InstructGPT on two existing datasets:

| Dataset | GPT | Supervised Fine-Tuning | InstructGPT |
|---|---|---|---|
| TruthfulQA | 0.224 | 0.206 | 0.413 |
| RealToxicity | 0.233 | 0.199 | 0.196 |

Her reading: InstructGPT answers more correctly and is less likely than the starting model to produce harmful content. The reason is that the human feedback marks which responses contain hallucination and which are harmful, and those responses get lower reward.

Slides 47–48 are human evaluation, with labels grouped as useful, honest, and potentially harmful. The four charts on slide 48 show that attempting the correct instruction and following explicit constraints both rise through SFT and PPO, and suitability as an assistant was already high and rises a little more.

**The hallucination chart is different**, and she stops on it: it is lowest after SFT and rises again somewhat after reinforcement learning. Her explanation: SFT pushes down unwanted tokens directly at the token level, and pushes them very low; reinforcement learning cares about the whole response and keeps some room for exploration, so it may produce content that is not fully factual. This is her explanation in class and is not written on the slide.

Slide 49 compares overall quality on a 1–7 Likert scale. PPO-ptx is highest, and FLAN and T0, which are also instruction-tuned models without human feedback, are both lower.

Slide 50 is an example. The prompt gives code that computes a binomial coefficient and asks what the list C is for. GPT-3's completion lists options A to D, each a sentence like "to store the value of C[0]." She calls this empty talk: nothing in it is wrong, and it does not answer the question at all. InstructGPT's completion says C stores the values of the binomial coefficient, and explains how the function iterates and what it returns.

### ChatGPT: the same pipeline, moved to multi-turn

Slides 52–54 change one thing in each of the three steps:

1. The SFT demonstrations change from "one question, one answer" to **human-written multi-turn conversations**. The model has to learn to read the conversation history and then answer the current turn.
2. The RM's input changes from "one question plus one answer" to "a conversation history, the current input, and the current output."
3. PPO as before.

The slide concludes: enabling multi-turn interactions. She says people were amazed at the time because it could answer all kinds of questions and also sustain multi-turn interaction, which is closer to the personal assistant people wanted.

### Summary of the first half

At the end of 7.4 she strings the whole part together: after pre-training comes instruction tuning (also called SFT), so the model learns to read task descriptions; then RLHF, which pulls the model's objective toward people's subjective judgments. Today's "RLHF" may contain no RL and may be DPO or KTO, which still optimize human feedback.

## Second half: LLM adaptation

### Why a cheap way to tune is needed

Video 7.5 returns to the "tasks are known" direction. Suppose you want the model to do exactly three tasks, A, B, and C, and do not care about the rest. The model you took does these three acceptably, you want it to do better, and so you want to fine-tune it.

The problem is cost. Traditional fine-tuning fixes the inputs and outputs and updates every parameter by its gradient. The model has on the order of a billion parameters and all of them move, which ordinary people cannot afford (slide 4: Fine-tuning LLMs may be expensive and impractical).

Slide 6 lists three reasons to study efficient adaptation:

1. Current AI research emphasizes accuracy over efficiency. The bar chart on the right counts papers at several venues (ACL 2018, CVPR 2019, NeurIPS 2018), and most target accuracy.
2. Training and fine-tuning LLMs have hidden environmental costs.
3. As training costs go up, AI development becomes concentrated in well-funded organizations, especially in industry.

Her addition: once accuracy is high and gains shrink, another need surfaces. Training cost is directly money. Academia and small companies cannot afford full fine-tuning and still need to tune models for specific areas. Much current research therefore sells itself as "about the same performance at lower cost."

### The shared idea: learn only the change

Slide 7 sets up a shared picture. The representation at some layer of the pre-trained model is h. After full fine-tuning every parameter has changed, and the representation at the same layer becomes h′. Write the gap as Δh:

h′ = h + Δh

The question becomes: can this Δh be imitated with very few parameters? The three methods below all answer it, and differ in where the new parameters go.

### Adapter

Slide 8 (dated He et al., 2022 on the slide): insert small trainable modules into the Transformer block. The original multi-head attention, layer norm, and feed-forward stay untouched, and only the adapter is trained. Zoomed in, the adapter takes h, computes Δh, and adds it back to get h′.

She stresses that it is plug and play. For summarization, train a summarization adapter on summarization data; for translation, train another one. There is one copy of the original model, each task stores only its own adapter, and you plug in whichever task you need.

The slide lists two benefits:

- **Storage-efficient**: all tasks share the same pre-trained model.
- **Better robustness**: her explanation is that when the model is large and fine-tuning data is scarce, full fine-tuning overfits easily and a small amount of data drags the whole model off. An adapter changes little and the original parameters do not move at all, so this is less likely.

### LoRA

Slides 9–11 are LoRA (Low-Rank Adaptation, Hu et al., 2021), which she says is now widely used for tuning all kinds of models.

The idea is close to the adapter: learn a Δh and add it back to h. The difference is in the figure on slide 10: the Δh branch is forced to squeeze down to a very small dimension first and then expand back to the original dimension. Her example: if the original dimension is 1024, the middle must shrink to a much smaller number, and only the parameters on either side of this bottleneck are trained.

Why can anything be learned after squeezing to low dimension? She explains with rotation: tuning a model toward a task is like a small rotation in a high-dimensional space. Describing a rotation does not require recording where every point moves; learning the direction of rotation is enough, and applying it moves all the points. So little is learned and much is affected. The slide puts it this way: weight updates for downstream fine-tuning give a low intrinsic rank.

**The deck draws LoRA's location in two ways.** Slide 9 draws LoRA beside the feed-forward layer, and she also says it focuses on the feed-forward layer, since fully connected layers have the most parameters. The UniPELT architecture figure cited on slide 13 draws LoRA in the attention block, attached beside the attention weight matrices. The next two sentences are not from the lecture and are added here from the LoRA paper: its experiments adapt only attention weight matrices; the method itself can be attached to any weight matrix, and which layers to attach it to is a setting you choose.

**Example (made up for this post).** The deck draws only the bottleneck shape; the count below uses the LoRA paper's formulation, where the weight update is a product of two small matrices, ΔW = BA, with B of size d × r and A of size r × k. Setup: one weight matrix with d = k = 4096, and r = 8.

- Reasoning: full fine-tuning updates 4096 × 4096 = 16,777,216 parameters. LoRA trains only B and A, r × (d + k) = 8 × 8192 = 65,536 in total.
- Result: 65,536 ÷ 16,777,216 ≈ 0.39%.
- Meaning: each task stores only this extra 0.39%, and r is your choice; doubling r only doubles the parameter count. This is where it is cheap.

Slide 11 is the LoRA paper's experiment on GPT-3 175B:

| Method | Trainable parameters | WikiSQL | MNLI-m | SAMSum (R1/R2/RL) |
|---|---|---|---|---|
| Full fine-tuning (FT) | 175,255.8M | 73.8 | 89.5 | 52.0/28.0/44.5 |
| Adapter | 7.1M | 71.9 | 89.8 | 53.0/28.9/44.8 |
| Adapter | 40.1M | 73.2 | 91.5 | 53.2/29.0/45.1 |
| LoRA | 4.7M | 73.4 | 91.7 | 53.8/29.8/45.9 |
| LoRA | 37.7M | 74.0 | 91.6 | 53.4/29.2/45.1 |

She points at two places. At similar parameter counts (LoRA 37.7M against Adapter 40.1M), LoRA is slightly ahead. At a very small count (4.7M), LoRA still performs well. In the two charts on the right, the horizontal axis is the number of trainable parameters, and she says LoRA's pink line is on top throughout; on the MultiNLI chart the Adapter points nearly overlap it at the larger parameter counts. The slide concludes that LoRA exhibits better scalability and task performance.

### Prompt tuning

Slide 12 reviews prefix-tuning and soft prompt-tuning from the previous lecture. They are also parameter-efficient adaptation: the model stays fixed and only a short sequence of vectors in front of the input is trained.

### Which one is best

Slide 13 cites the comparison in Mao et al. 2022 (GLUE dev set):

| Method | Average over eight tasks |
|---|---|
| Fine-tuning | 82.67 |
| Adapter | 83.02 |
| Prefix-tuning | 82.07 |
| LoRA | 82.20 |
| UniPELT | 83.50 |

The best score on each task is spread across different methods. The slide concludes: No one can fit all tasks.

The paper therefore proposes UniPELT: put adapter, prefix-tuning, and LoRA into the same model, each with a gate, and let the model learn whether to use each at this layer. She relays the paper's claim: it does well overall, and when it is not the best it is mostly second best; and it obviously has more to train than any single method.

Her practical advice: before choosing a method, look at what others usually use on the same task and how far apart the methods are. Often the differences are tiny, and then you choose the one that is easiest to implement or has the fewest parameters.

## HW2: classical Chinese translation with LoRA

The end of 7.5 announces that HW2 is released that day and is about LoRA tuning. The next two weeks are holidays (the Teachers' Day make-up holiday and the Mid-Autumn Festival), so it is announced early.

HW2 has no public spec document; what follows is from the TA's spoken briefing in the video. Numbers in the transcript may be misheard, and enrolled students should follow the course announcements.

- **Task**: instruction tuning, with translation between classical and modern Chinese as the downstream task. The input is an instruction and the output is the translation.
- **Model**: Alibaba's Qwen3-4B. The model is fairly large, so not all parameters are fine-tuned and LoRA is used; QLoRA is also used, which lowers training memory further through quantization.
- **Data**: 10,000 training items, and 250 each for public and private test. Each item has an id and an instruction, and public data also includes the output. Extra training data is not allowed.
- **Metric**: perplexity. The TA's explanation: given the input, the higher the probability the model assigns to the correct answer, the lower the perplexity.
- **What to submit**: `download.sh` (downloads your adapter checkpoint, not the original model), `utils.py` (implement `get_prompt` and `get_bnb_config`; the first designs the prompt and the second sets the quantization hyperparameters), a `README`, and `run.sh` (the script the TAs use to generate outputs).
- **Test environment**: the TA says one 3070 with 8GB of VRAM.
- **Grading**: 20 points plus 2 bonus. Model performance is 5 points (2 each for public and private, 1 for human evaluation), and the report is 15. The report covers the training process (how data was chosen, how the instruction was designed, how hyperparameters were chosen), the final performance and learning curve, and a comparison of zero-shot, few-shot, and LoRA tuning. The bonus is to also try the Taiwan version of LLaMA released by a senior member of the lab.

The TA also explains how a training example is assembled: the designed prompt followed by the answer, with BOS and EOS tokens around it. For the loss, the last token of the prompt predicts the first token of the answer, the first token of the answer predicts the second, and so on. This is what the "token-level objective" from earlier looks like in practice.

The TA says the data and the scoring script `ppl.py` are provided through the assignment link; this guide has not confirmed whether readers outside the course can access it. To practice, prepare a small set of parallel classical and modern Chinese text yourself and compare "prompt only," "few-shot," and "LoRA." For the hands-on details see the LLM LoRA Training session in [the TA recitations guide](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations-en).

## Common misreadings

This list is my own summary, not something the lecture enumerated point by point.

- **"Instruction tuning teaches the model to do those tasks."** Not quite. The training tasks are only material, and what is learned is reading task descriptions. That is why validation deliberately removes a whole task cluster and checks whether untrained tasks improve.
- **"Instruction tuning and prompt tuning are the same thing."** They are not. The first changes the model's parameters, and in the second the model stays fixed and only the prompt is trained. They stack, as the experiment on slide 18 shows.
- **"With a reward model there is no need to tune the language model; just pick the highest score."** That works, and every request then needs several generations plus scoring, which is slow and expensive and cannot be shown as it is generated.
- **"RLHF as the term is used today always contains reinforcement learning."** Not necessarily. She says current practice is mostly supervised training such as DPO, with the name carried over.
- **"After RLHF every metric is better than with SFT alone."** InstructGPT's hallucination measure is lowest after SFT and rises again after reinforcement learning.
- **"LoRA is always better than the other methods."** In the GPT-3 experiment on slide 11 LoRA is best, and in the GLUE comparison on slide 13 the adapter's average is higher than LoRA's. The conclusion is that no method suits every task.

## Self-check

The questions were written for this post, and every answer can be found above.

**1. Why does a specialist model not need an instruction, and why does a generalist need one?**

A specialist does one task, so the input alone says what to do. A generalist is one model for many tasks, and without being told whether this is summarization or translation it has no way to know.

**2. In the FLAN experiment, what is the score when only the dataset name is given at fine-tuning and a full instruction at evaluation? And with full instructions on both sides? What does this show?**

46.6 and 55.2. The model learns the ability to "read descriptions" well only when it sees full task descriptions in training; a name alone still helps (it beats giving nothing), and some names have no very direct relation to the task.

**3. What is the third limit of instruction tuning, and how does it lead to RLHF?**

The training objective is at the token level and every token's error has the same weight, while people judge a response as a whole. RLHF changes what is optimized to the reward of the whole response.

**4. The reward model currently gives the winning response 1.0 and the losing response 1.0. What is the pairwise loss?**

The difference is 0, σ(0) = 0.5, and the loss is −ln 0.5 ≈ 0.69. An RM that cannot tell the two apart is the same as a coin flip.

**5. Why collect human preference as "choose one of two" instead of asking for a score from 0 to 10?**

Absolute scores are noisy and uncalibrated, and the same person's 7 at two different times does not necessarily mean the same quality. Putting two responses side by side and choosing the better one is much easier and much more stable.

**6. What data and training flow do RLHF, DPO, and KTO each need?**

RLHF: paired preference data → train a reward model → train the language model with reinforcement learning. DPO: the same paired preference data, used directly in a supervised loss on the language model, with no reward model and no reinforcement learning. KTO: only a binary good-or-bad label for each response, with no pairs.

**7. How does ChatGPT's pipeline differ from InstructGPT's?**

The three steps are the same. The demonstration data changes from single-turn question and answer to multi-turn conversations, and the reward model's input gains the preceding conversation history.

**8. For a weight matrix with d = 1024 and k = 1024, how many parameters does LoRA train at r = 4? What fraction of full fine-tuning is that?**

r × (d + k) = 4 × 2048 = 8,192. Full fine-tuning is 1024 × 1024 = 1,048,576, so about 0.78%.

**9. Why is an adapter less prone to overfitting than full fine-tuning?**

When fine-tuning data is scarce and the model is large, updating all parameters lets a small amount of data pull the whole model off. An adapter trains only a small number of added parameters and the original ones do not move.

**10. You want to tune a model for some task. How does the lecturer suggest choosing a PEFT method?**

No method is best on every task. First look at what others usually use on this task and how large the gaps are; if the gaps are small, choose the one that is easiest to implement or has the fewest parameters.

## Further reading

Other course guides on this site cut the same topics differently:

- [CS224N Lecture 8: From Instruction Tuning and RLHF to DPO](/posts/ai/2026-08-22-cs224n-post-training-en)
- [CS224N Lecture 9: Prompting, LoRA, and Parameter-Efficient Adaptation](/posts/ai/2026-08-22-cs224n-efficient-adaptation-en)
- [CME295 Lecture 5: SFT Can't Teach "Don't Answer Like That", So RLHF and DPO Add the Negative Signal](/posts/ai/2026-09-29-cme295-preference-tuning-en)
- [CME295 2026 Lecture 4: SFT, PPO, GRPO, and On-Policy Distillation Are One Policy Gradient](/posts/ai/2026-09-29-cme295-rl-with-llms-en)

Next lecture: [Lecture 8, RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en)

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=G5O93KOsBCs
title: ADL 7.1: Post-Training (YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=PfSybChNSNc
title: ADL 7.2: Instruction Tuning / SFT (YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=4Md8Y0zAXUE
title: ADL 7.3: RLHF (YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=-hchhJoH3YE
title: ADL 7.4: InstructGPT & ChatGPT (YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=ii2kMoUyNOs
title: ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) (YouTube)
```

Original videos: [ADL 7.1: Post-Training (YouTube)](https://www.youtube.com/watch?v=G5O93KOsBCs), [ADL 7.2: Instruction Tuning / SFT (YouTube)](https://www.youtube.com/watch?v=PfSybChNSNc), [ADL 7.3: RLHF (YouTube)](https://www.youtube.com/watch?v=4Md8Y0zAXUE), [ADL 7.4: InstructGPT & ChatGPT (YouTube)](https://www.youtube.com/watch?v=-hchhJoH3YE), [ADL 7.5: Parameter-Efficient Fine-Tuning (Adaptor, LoRA) (YouTube)](https://www.youtube.com/watch?v=ii2kMoUyNOs), [ADL 2025 Fall Homework 2 (YouTube)](https://www.youtube.com/watch?v=_QiIp0WTRzI)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): 7.1, 7.2, 7.3, and 7.5 were written from their captions. 7.4 and the HW2 briefing have no captions, so this guide was written from speech-recognition transcripts of their audio, which may mishear some proper nouns and numbers. Formulas, tables, and chart numbers follow the slide pages.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-13: Merged the previously separate Post-Training and PEFT guides into one guide for Lecture 7, rewritten from the spoken content of the five videos, with the content of the HW2 briefing video, three examples, common misreadings, and a self-check with answers. The old "PEFT: Adapter, LoRA, Prompt Tuning, and HW2" URL now redirects here.

## References

- [ADL Fall 2025 (114-1) course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 9/22 lecture row, videos, slides, and HW 2 link
- [Post-Training slides (250922_PostTraining.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_PostTraining.pdf)
- [LLM Adaptation slides (250922_Adaptation.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250922_Adaptation.pdf)
- [2025 Fall NTU CSIE ADL playlist](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [ADL 2025 Fall Homework 2 (YouTube)](https://youtu.be/_QiIp0WTRzI)
- [McCann et al., The Natural Language Decathlon: Multitask Learning as Question Answering](https://arxiv.org/abs/1806.08730) — slide 7
- [Jiao et al., Is ChatGPT A Good Translator?](https://arxiv.org/abs/2301.08745) — slide 5
- [Hendy et al., How Good Are GPT Models at Machine Translation?](https://arxiv.org/abs/2302.09210) — slide 5
- [Wei et al., Finetuned Language Models Are Zero-Shot Learners (FLAN)](https://arxiv.org/abs/2109.01652)
- [Sanh et al., Multitask Prompted Training Enables Zero-Shot Task Generalization (T0)](https://arxiv.org/abs/2110.08207)
- [Wang et al., Super-NaturalInstructions](https://arxiv.org/abs/2204.07705)
- [Stiennon et al., Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)
- [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ethayarajh et al., KTO: Model Alignment as Prospect Theoretic Optimization](https://arxiv.org/abs/2402.01306)
- [Ouyang et al., Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)
- [Hu et al., LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
- [Mao et al., UniPELT: A Unified Framework for Parameter-Efficient Language Model Tuning](https://arxiv.org/abs/2110.07577)
