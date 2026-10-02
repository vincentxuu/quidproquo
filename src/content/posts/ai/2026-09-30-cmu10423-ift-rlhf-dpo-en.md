---
title: "CMU 10-423 L11–L12: Instruction Tuning, RLHF, and DPO — Make the Model Follow Instructions, Then Drop the RL"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, instruction-tuning, rlhf, dpo, post-training, alignment]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 11
tldr: "A pretrained LLM continues text; it doesn't hold a conversation. The second half of CMU 10-423 L11 covers instruction fine-tuning, which turns the model into a chat assistant using data such as InstructGPT's 13k examples, Dolly's 15k, or Flan. Then come InstructGPT's three RLHF steps: humans rank responses, a reward model is trained, and PPO fine-tunes the policy. The first half of L12 adds the intuition behind REINFORCE and PPO, lists five drawbacks of PPO-based RLHF, and derives DPO: start from the Bradley–Terry model, replace the reward model with the policy's own log-probability ratios, and fine-tune directly on preference data."
description: "A guide to the second half of Lecture 11 and the first half of Lecture 12 in CMU 10-423/623/723 Generative AI (Spring 2026): prompt templates for instruction-tuned models, the motivation and datasets for instruction fine-tuning (InstructGPT, Dolly, Flan, MultiInstruct), the three RLHF steps and the reward model loss, LLM fine-tuning as a reinforcement learning problem, REINFORCE and PPO's two modifications, the drawbacks of PPO-based RLHF, the Bradley–Terry model and the DPO derivation, and where this material shows up in HW3, Quiz 3, and the practice exam."
draft: false
glossary:
  - term: "instruction fine-tuning"
    aliases: ["instruction tuning", "chat fine-tuning"]
    definition: "Supervised fine-tuning of a pretrained model on a dataset of instruction/prompt → ideal response pairs, turning a text-completer into an assistant that follows instructions and knows when to stop."
    context: "CMU 10-423 L11 lists its other names: chat fine-tuning, alignment, behavioral fine-tuning."
  - term: "DPO"
    aliases: ["Direct Preference Optimization"]
    definition: "Fine-tunes a language model directly on preference data (a better and a worse response to the same prompt) without training a separate reward model or running RL: it raises the better response's probability relative to a reference model and lowers the worse one's."
    context: "L12 derives it from the Bradley–Terry preference model and the KL-constrained RLHF objective; HW3 section 4 walks you through the derivation."
    links:
      - label: "Rafailov et al. 2023"
        url: "https://arxiv.org/abs/2305.18290"
  - term: "Bradley–Terry model"
    aliases: ["Bradley-Terry"]
    definition: "A probability model for pairwise comparisons: item i beats item j with probability exp(r_i) / (exp(r_i) + exp(r_j)). It is equivalent to logistic regression on the score difference r_i − r_j, and only relative scores matter."
    context: "Both the RLHF reward model and DPO use it to model human preferences."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It is part 11 of the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series. The main material is the instruction fine-tuning and RLHF part of the February 18 [Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf) (Aran Nayebi and Matt Gormley, with "slides credit: Pat Virtue"), and the RLHF continuation and DPO part of the February 23 [Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf) (Matt Gormley; there's also an [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img-ink.pdf)). The in-context learning half of L11 is in [part 10](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en), and the text-to-image half of L12 is left for part 13.

I checked every fact against the official materials on 2026-09-30. The [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) lists no readings for these two lectures, so this post cites only the slides and the figure sources they name. The reinforcement learning slides are marked as coming from Henry Chai. Access level **A3**: slides, homework, and the practice exam are public; lecture recordings are on CMU Panopto and not viewable from outside.

**Series position**: previous [L10–L11: parameter-efficient fine-tuning and in-context learning](/posts/ai/2026-09-30-cmu10423-peft-in-context-learning-en) | next [HW3: fine-tuning GPT-2 with LoRA](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en) | [series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## One story, two models

L11 opens with an example. The same five-sentence story, followed by "One-sentence Summary:", goes to two models:

- **Llama-2-70B** (pretrained only) simply continues with a one-sentence summary.
- **Llama-2-7B Chat** (instruction fine-tuned) first says "Sure! Here is a one-sentence summary of the story:" and then gives the summary.

The slide's explanation: Llama-2-7B Chat was instruction fine-tuned, so its responses look quite different from the Llama-2 models that weren't. The slide before it notes that chat assistants such as ChatGPT and Llama-2 Chat were often trained with specific prompt templates that split the input into system, user, and assistant parts. It shows the Llama-2 Chat `[INST] <<SYS>>` format next to Alpaca's `### Instruction:` / `### Response:` format. With these models, prompting in the template they were trained on is the safer choice.

## Instruction fine-tuning: from autocomplete to chat

The slides frame the motivation as "Autocomplete → Chat":

- LLMs are trained to reduce perplexity on a large corpus of web text, articles, and code, so they're good at completing your ________.
- A chat agent shouldn't merely predict what comes next. It should behave conversationally and know when to stop.
- We want to align the LLM with what a human user expects for a given instruction.

The recipe has two steps: build a "chat agent" training dataset, then fine-tune on it. The technique goes by many names: instruction fine-tuning, chat fine-tuning, alignment, behavioral fine-tuning.

### Where the data comes from

| Dataset | Size and method |
|---|---|
| InstructGPT | 13k prompt/response pairs; labelers wrote instructions and demonstration responses, and some prompts came from early OpenAI API users with labeler-written responses; entirely closed source |
| Dolly | 15k examples, an open-source follow-up to InstructGPT; every pair written by Databricks employees |
| Flan | One of the first instruction fine-tuning datasets (Wei et al., 2021); recent versions have about 3.5 million examples; built by recasting existing NLP tasks as instructions (12 tasks, 62 datasets), with 10 templates per dataset |
| MultiInstruct | A multimodal version (Xu et al., 2023) that combines 62 multimodal tasks from 21 open-source datasets |

The slides spend several pages on real examples from [databricks-dolly-15k](https://huggingface.co/datasets/databricks/databricks-dolly-15k), across categories such as open Q&A, general Q&A, closed Q&A (with a context passage), information extraction, brainstorming, summarization, classification, and creative writing.

Instruction fine-tuned models all start from a pretrained base model. The slides note they're often very effective even at a much smaller scale than the largest LLMs, with 7B–13B parameters being typical.

## RLHF: InstructGPT's three steps

The slides open with a line from the [InstructGPT paper](https://arxiv.org/abs/2203.02155): in human evaluations, outputs from the 1.3B-parameter InstructGPT are preferred to those of the 175B GPT-3, despite having 100x fewer parameters.

**Step 1: instruction fine-tuning.** Supervised fine-tuning on 13k demonstrations makes the model behave like a chat agent. But the diversity of interactions it can learn is limited by what's in the training data. The slides argue that preference signals are a more expressive source of supervision: it's easier for a human to pick the better of several responses than to write a good one.

**Step 2: collect rankings, train a reward model.** Take 33k prompts, have the Step 1 model sample K responses for each, and have a labeler rank them, with K ∈ {4, …, 9}. The slides show [Anthropic's labeling interface](https://arxiv.org/abs/2204.05862) as an example.

The reward model is a copy of the Step 1 model with the softmax over words replaced by a single scalar output: the reward. It's trained so higher-ranked responses get higher rewards:

loss(θ) = −(1 / C(K, 2)) · E_{(x, y_w, y_l)∼D} [ log σ( r_θ(x, y_w) − r_θ(x, y_l) ) ]

Here x is the prompt, y_w and y_l are the winning and losing responses, and D is the dataset of human rankings. All C(K, 2) comparisons for one prompt go in the same batch, which the slides say is for efficiency and stability.

**Step 3: fine-tune with reinforcement learning.** Instead of a human or an expert model providing rewards, the Step 2 reward model is treated as ground truth. The state is the prompt, the action is the response, the reward is the reward model's scalar output, and each episode lasts exactly one turn. The objective combines an RL term and a pretraining term:

objective(φ) = E_{(x,y)∼π_φ^RL} [ r_θ(x, y) − β log( π_φ^RL(y|x) / π^SFT(y|x) ) ] + γ E_{x∼D_pretrain} [ log π_φ^RL(x) ]

The slides give the intuition in three points:

1. The reward term: on samples from the RL model, raise a sample's probability when its reward is high and lower it otherwise.
2. The β term: don't let the RL model's probabilities drift too far from the SFT model. In practice this is a KL penalty.
3. The γ term: the ordinary log-likelihood, applied to the RL model so it doesn't forget the pretraining distribution.

None of the three expectations is computed exactly; each is approximated by Monte Carlo with a very small number of samples. The objective is modeled on PPO, a policy gradient method motivated by TRPO.

**Results**: in Anthropic's experiments, RLHF increases helpfulness and harmlessness, and it doesn't hurt zero-shot or few-shot performance on most tasks.

## LLM fine-tuning as a reinforcement learning problem

The end of L11 and the start of L12 use Henry Chai's slides to put Step 3 into the standard RL framework:

| RL element | What it is for LLM fine-tuning |
|---|---|
| State space 𝒮 | All possible token sequences |
| Action space 𝒜 | The vocabulary of next tokens |
| Reward function | Deterministic, given by the reward model trained on human feedback; it returns 0 for any action other than EOS and scores the whole response at EOS |
| Transition function | Deterministic: append the action to the current sequence |
| Policy | The LLM being fine-tuned, π_φ(a \| s), which gives a distribution over next tokens for any input sequence |

An episode is one complete continuation of prompt x, ending in EOS. The LLM therefore induces a distribution over all possible completions, equal to the product of π_φ(a_t | s_t) over the steps. The slides also point out that, from an RL perspective, this is a bit of a weird reward function, since only the last step is rewarded.

### REINFORCE and PPO

L12 starts from the most basic policy gradient. The goal is to minimize the negative expected reward, and the difficulty is taking the gradient of a long product p_φ(τ). The fix is the likelihood ratio (log-derivative) trick, also known as [REINFORCE (Williams, 1992)](https://link.springer.com/article/10.1007/BF00992696):

∇_φ p_φ(τ) = p_φ(τ) ∇_φ log p_φ(τ), and log p_φ(τ) is just the sum of log π_φ(a_t | s_t) over the steps.

So the gradient becomes an expectation, which you estimate by Monte Carlo over N sampled completions: each completion's reward times the sum of its per-step log-probability gradients.

To get from REINFORCE to [PPO (Schulman et al., 2017)](https://arxiv.org/abs/1707.06347), the slides describe only two high-level changes:

1. **Lower variance**: sampled trajectories and rewards vary a lot, which makes the estimates unstable. PPO uses a trajectory's advantage over a baseline instead, with the baseline usually defined by the value function at each state.
2. **Keep the policy from drifting**: policy gradient is on-policy, so the policy being optimized also generates the training data, and if it ever gets bad, training can fail to converge. The intuition is to keep the policy close to one known to be good. In RLHF, that's the original instruction fine-tuned model, π^SFT.

## DPO: RL is hard, so is there something easier?

After the RLHF results slide, L12 adds "Man, reinforcement learning seems hard; couldn't we do something easier?" and moves on to [DPO (Rafailov et al., 2023)](https://arxiv.org/abs/2305.18290).

### Bradley–Terry first

To model the outcome of pairwise comparisons, the standard Bradley–Terry form is p(i > j) = s_i / (s_i + s_j), where s is a positive "strength" and only relative sizes matter. Set s_i = exp(r_i) and you get

p(i > j) = exp(r_i) / (exp(r_i) + exp(r_j)) = 1 / (1 + exp(−(r_i − r_j)))

which is logistic regression on the score difference, with r free to be any real number. RLHF's reward model uses exactly this form to model human preferences between two responses.

### Five drawbacks of PPO-based RLHF

The slides list them directly:

- **Two-stage training**: train a reward model, then run a separate RL optimization.
- **Instability**: PPO needs careful tuning of the KL coefficient, clipping, and so on.
- **Credit assignment mismatch**: the reward model is trained on pairs, but the policy is optimized on scalar rewards.
- **High compute cost**: on-policy rollouts mean repeated sampling.
- **Reward overoptimization**: the policy exploits artifacts of the reward model.

### The DPO derivation

The slides' intuition: the RL problem we defined for aligning an LLM with human preferences is, in a sense, very simple. The state space, action space, transition function, and reward model are all known in advance and deterministic. So why not skip the learned reward model and fine-tune the LLM on the preferences directly: raise the likelihood of the better response y_w and lower that of the worse response y_l.

<details>
<summary>The three steps of the derivation (following the L12 slides)</summary>

1. Assume a latent true reward r* generates the observed preferences through Bradley–Terry: p(y_w ≻ y_l | x) = exp(r*(x, y_w)) / (exp(r*(x, y_w)) + exp(r*(x, y_l))).
2. If we knew r*, RLHF (without the pretraining term) would optimize the expected reward minus β times log(π_φ / π^ref). One can show its optimal policy is π*(y|x) = π^ref(y|x) · exp(r*(x, y) / β) / Z(x), where Z(x) is a normalizing factor.
3. Solve that equation for r* and plug it back into the probability from step 1. Z(x) cancels in the difference, leaving p(y_w ≻ y_l | x) = 1 / (1 + exp( β log(π*(y_l|x) / π^ref(y_l|x)) − β log(π*(y_w|x) / π^ref(y_w|x)) )).

</details>

The slides quote the paper's subtitle, "Your language model is secretly a reward model." The key takeaway: you can now maximize this probability directly over the LLM's parameters φ, using human-labeled preference triples (x, y_w, y_l), with no reward model and no RL sampling.

### A caveat on the results

The DPO results slide quotes two lines from the paper. For summarization, the baseline is the reference summaries in the test set; for dialogue, it's the preferred response in the test set. And the win rates are computed **using GPT-4 as a proxy for human evaluation**. The slide labels the latter "Key caveat." Keep that in mind when reading DPO's experimental numbers.

## Where these lectures show up in homework and tests

- **HW3** section 4, Direct Preference Optimization, is worth 15 of the assignment's 66 points. It starts from the KL-regularized objective of PPO-based RLHF as background, then walks you through the DPO derivation: show the form of the optimal policy, write the reward as a function of the policy, explain why only reward differences matter under Bradley–Terry, derive the DPO objective, and finally analyze the direction and magnitude of the terms in its gradient. Details are in the [HW3 guide](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en).
- **Quiz 3**: the Reminders slide in L12 says it's in class on February 25, covering Lectures 10, 11, and 12 (RLHF/DPO only). The HW1/HW2 programming test is the same day. Neither is available outside CMU.
- **[Practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)**: question 10, RLHF / DPO, is worth 12 points.

## How to self-study this

1. Draw InstructGPT's three steps as one diagram: the input data, the model being trained, and the output of each step. Once you can draw it, the RL formalization in L12 is just new notation for the same picture.
2. Derive DPO on paper once: solve the optimal-policy equation for r*, plug it into Bradley–Terry, and confirm that Z(x) really cancels. That's the skeleton of HW3 section 4.
3. Go through the five drawbacks of PPO-based RLHF and write down which ones DPO solves and which it doesn't. For example, DPO still needs a reference model π^ref.

One thing to do tonight: open the Bradley–Terry slide in L12 and verify that exp(r_i) / (exp(r_i) + exp(r_j)) equals σ(r_i − r_j). Then look back at the reward model loss. It's the negative log-likelihood of exactly this expression.

## Further reading

- The same material in other courses: [CS224N Lecture 8: from instruction tuning and RLHF to DPO](/posts/ai/2026-08-22-cs224n-post-training-en), [CME295 Lecture 5: preference tuning with RLHF and DPO](/posts/ai/2026-09-29-cme295-preference-tuning-en)
- Course status and a self-study path: [CMU 10-423 series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L11 and L12 dates, Quiz 3
- [Lecture 11 slides: In-Context Learning / Instruction Fine-tuning / RLHF](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Lecture 12 slides: DPO / Latent Diffusion Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf) ([inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img-ink.pdf))
- [HW3 handout (hw3.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw3.zip): structure and points of the DPO section
- [Practice Exam (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Ouyang et al. 2022: Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155)
- [Bai et al. 2022: Training a Helpful and Harmless Assistant with RLHF](https://arxiv.org/abs/2204.05862)
- [Rafailov et al. 2023: Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)
- [Schulman et al. 2017: Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Williams 1992: Simple statistical gradient-following algorithms for connectionist reinforcement learning](https://link.springer.com/article/10.1007/BF00992696)
- [Wei et al. 2021: Finetuned Language Models Are Zero-Shot Learners (Flan)](https://arxiv.org/abs/2109.01652)
- [Longpre et al. 2023: The Flan Collection](https://arxiv.org/abs/2301.13688): the instruction-dataset comparison figure in the slides
- [Xu et al. 2023: MultiInstruct](https://arxiv.org/abs/2212.10773)
- [databricks/databricks-dolly-15k](https://huggingface.co/datasets/databricks/databricks-dolly-15k)
