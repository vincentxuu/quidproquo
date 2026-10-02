---
title: "CS224R L9: RLHF, DPO, and Preference Optimization"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, rlhf, dpo, post-training]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 12
tldr: "Lecture 9 of CS224R Spring 2026 is a guest lecture by Archit Sharma, with slides adapted from CS224N. The spine is one chain of reasoning. Instruction tuning can't handle tasks with no right answer or errors of unequal weight, so we optimize human preferences directly. Human ratings are expensive and noisy, so we collect pairwise comparisons and fit a Bradley-Terry reward model. RLHF uses that model as the reward and runs policy gradient with a KL penalty. DPO uses the closed-form solution of the KL-constrained problem to write the reward as a log-ratio of policies, which turns the whole thing into a binary classification loss. The last part covers the frontier: reward hacking, verifiable rewards, and AI feedback in place of human feedback."
description: "A guide to Lecture 9 of Stanford CS224R (Spring 2026), based on the official 09_cs224r_rlhf_2026 slides: the LLM training pipeline, the limits of instruction finetuning, REINFORCE and the log-derivative trick, the Bradley-Terry reward model, the KL-penalized RLHF objective, the DPO derivation, and reward hacking, verifiable rewards, and Constitutional AI. Also explains the two assigned readings, DPO (2023) and IPO (2025). The companion video is the Spring 2025 L9 recording (same speaker, supplementary)."
draft: false
glossary:
  - term: "Bradley-Terry model"
    aliases: ["Bradley-Terry", "BT model"]
    definition: "A paired-comparison model from 1952: each option has a score, and the probability that A beats B is the sigmoid of their score difference."
    context: "CS224R L9 uses it to turn pairwise human preferences into a reward-model loss: −log σ(RM(x, y_w) − RM(x, y_l))."
  - term: "DPO"
    aliases: ["Direct Preference Optimization"]
    definition: "A preference optimization method from Rafailov et al. (2023). It skips the separate reward model, writes the reward as the log-probability ratio between the policy and a reference model, and trains on pairwise preferences as binary classification."
    context: "CS224R L9 derives the DPO loss from the KL-constrained RLHF objective."
  - term: "reward hacking"
    aliases: ["reward model over-optimization"]
    definition: "The policy finds behavior that scores well but doesn't match what the designer actually wanted. The less accurate the learned reward model, the more likely it is."
    context: "CS224R L9 names it as the core risk of RLHF and uses it to motivate verifiable rewards."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization)

> **Source term**: Based on the Spring 2026 [09_cs224r_rlhf_2026 slides](https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf) (scheduled 2026-04-29). The companion video is the [Spring 2025 L9 recording (supplementary)](https://www.youtube.com/watch?v=XKLGuwvSKvI). The [2025 archive page](https://cs224r.stanford.edu/spring_2025/) lists the same speaker, Archit Sharma, but the slides are the 2025 version and details may differ. This is post 12 in the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series.

The [CS224R](https://cs224r.stanford.edu/) schedule calls this lecture "RL for LLMs: Preference Optimization," given by guest lecturer Archit Sharma. The deck is titled "The Post-Training Frontier: RLHF, DPO and Modern Preference Optimization," and the cover says "Based on slides from CS224N," Stanford's NLP course.

The previous eleven posts were about robots and control. This lecture jumps to language models. Lining the two up first makes the derivations much easier to follow.

## Mapping LLMs onto RL vocabulary

The slides don't include this table. The series adds it as a bridge, using the definitions from [L1](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en):

| RL (L1 definitions) | LLM post-training |
|---|---|
| state sₜ | the prompt plus the tokens generated so far |
| action aₜ | the next token |
| trajectory τ | a full response |
| policy πθ(a \| s) | the language model itself, pθ(y \| x) |
| reward r | a human's (or reward model's) judgment of the full response |

In this lecture the reward usually arrives once, at the end of the response. So the slides treat the whole response y as one sample, pθ(y | x), rather than splitting it token by token.

The other callback is [L8 Reward Learning](/posts/ai/2026-09-30-cs224r-reward-learning-en), which already covered learning rewards from human preferences (the assigned reading was Christiano 2017). L9 moves the same idea onto language models.

## How an LLM gets trained

The slides split training into four stages:

1. **Pre-training**: lots of natural data, primarily from the internet
2. **Mid-training**: more targeted domains, lower data volume
3. **Supervised fine-tuning / instruction tuning**: small, curated data that teaches the model to follow human intent
4. **Reinforcement learning (from human feedback)**: align with *implicit* human intent

What does pretraining learn? The slides show a string of fill-in-the-blank examples: where Stanford is (trivia), "I put ___ fork down" (syntax), coreference, sentiment, simple reasoning, and arithmetic. Language models may even do rudimentary modeling of agents and beliefs (citing Andreas 2022).

The problem: how do you get from "Stanford University is located in ___" to an assistant that handles any request? The slides divide post-training into three parts, and this post follows the same order: instruction finetuning, optimizing for human preferences (DPO/RLHF), and a peek at frontier post-training.

## Step one: instruction finetuning, and where it tops out

A language model is trained to predict the next word. That is not the same as helping a user (the slides cite [InstructGPT](https://arxiv.org/abs/2203.02155), Ouyang et al. 2022). The fix is to collect many (instruction, output) pairs across many tasks, finetune, and evaluate on unseen tasks. The example is FLAN-T5 (Chung et al. 2022). Data scale is key: SuperNaturalInstructions has over 1,600 tasks. Evaluation relies on multitask benchmarks like MMLU and BIG-Bench.

It's simple, and it generalizes to unseen tasks. Then the slides ask what the subtler limitations are, and list three:

- **Open-ended generation has no right answer.** What's the correct output for "Write me a story about a dog and her pet grasshopper"?
- **The language modeling loss penalizes every token-level mistake equally**, but some errors are much worse than others.
- **Human demonstrations are themselves suboptimal.**

That gives two conclusions. Demonstrations are expensive to scale, and there's always a gap between the LM objective and "satisfy human preferences." The next step is to optimize human preferences directly.

## Step two: writing human preference as an RL objective

Suppose that for an instruction x and a model output y, we could get a human score R(x, y), higher is better. The slides use news summarization. For the same San Francisco earthquake article, "An earthquake hit San Francisco. There was minor property damage, but no injuries" scores 8.0. "The Bay Area has good weather but is prone to earthquakes and wildfires" scores 1.2. The goal is to maximize the expected score of the model's samples:

```text
max_θ  E_{ŷ ~ pθ(y | x)} [ R(x, ŷ) ]
```

**How do you take the gradient of that expectation?** R may not be differentiable, and the expectation can't be computed directly. Here the slides briefly recap REINFORCE (Williams 1992) from [L3](/posts/ai/2026-09-30-cs224r-policy-gradients-en). The log-derivative trick moves the gradient inside the expectation, and Monte Carlo samples estimate it.

<details>
<summary>Expand: the three-line REINFORCE derivation (slide version)</summary>

```text
∇θ E_{s~pθ}[R(s)] = Σ_s R(s) ∇θ pθ(s)
                  = Σ_s pθ(s) R(s) ∇θ log pθ(s)      # ∇p = p ∇log p
                  = E_{s~pθ}[ R(s) ∇θ log pθ(s) ]
                  ≈ (1/m) Σᵢ R(sᵢ) ∇θ log pθ(sᵢ)
```

</details>

The slides read the formula plainly. If R is high, push that sample's probability up. If R is low, push it down. That's where the name "reinforcement" comes from. They also warn that this is "heavily simplified," and that training a real language model with RL needs a lot more.

## Where the reward comes from: a Bradley-Terry reward model

All of that assumes a human scores every response. The slides raise two problems, each with a fix.

**Problem 1: keeping a human in the loop is expensive.** Instead, treat human preference as its own learning problem. Train a reward model RMφ(x, y) on annotated data to predict the human score, then optimize RMφ instead (citing Knox & Stone 2009).

**Problem 2: human judgments are noisy and miscalibrated.** Should "A 4.2 magnitude earthquake hit San Francisco, resulting in massive damage" get 4.1 or 6.6? The fix is to skip direct ratings and ask which of two responses is better. Pairwise comparisons are more reliable (citing Phelps 2015 and Clark 2018).

With pairwise comparisons, you fit the reward model with the Bradley-Terry (1952) model. It only asks that the winning sample y_w score higher than the losing sample y_l:

```text
J_RM(φ) = − E_{(x, y_w, y_l) ~ D} [ log σ( RMφ(x, y_w) − RMφ(x, y_l) ) ]
```

## RLHF: optimize the learned reward, but don't drift too far

You have a pretrained (possibly instruction-tuned) model p^PT and a reward model. RLHF copies the model into p^RL_θ and maximizes the expected RMφ.

The slides ask what could go wrong. Learned rewards are imperfect. Maximize one directly and the model will exploit its flaws. So you add a penalty that keeps the model close to where it started:

```text
max_θ  E_{ŷ ~ p^RL_θ(y | x)} [ RMφ(x, ŷ) − β · log( p^RL_θ(ŷ | x) / p^PT(ŷ | x) ) ]
```

You pay a price whenever the new model assigns a response more probability than the original did. In expectation, this term is the KL divergence between the two distributions.

On results, the slides cite the summarization experiments in [Stiennon et al. 2020](https://arxiv.org/abs/2009.01325): the RLHF model beats both the pretrained model and the plain finetuned one. The cost is complexity. You fit a value function, online sampling is slow, and performance is sensitive to hyperparameters (citing Secrets of RLHF, Zheng et al. 2023). These are the same headaches [L5](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) ran into with PPO.

## DPO: writing the reward model as a policy

The slides' question: could we express the reward model directly in terms of the policy? The only external information in the whole optimization is the preference labels, so this might be possible.

The derivation has three steps.

**Step 1: the KL-constrained problem has a closed-form solution.** For the KL-penalized objective above, the optimal policy is:

```text
p*(ŷ | x) = (1 / Z(x)) · p^PT(ŷ | x) · exp( RM(x, ŷ) / β )
```

**Step 2: solve for the reward.** Rearranging:

```text
RM(x, ŷ) = β · log( p*(ŷ | x) / p^PT(ŷ | x) ) + β · log Z(x)
```

The slides stress that this holds for arbitrary LMs. So you can swap p* for the model you're training, p^RL_θ, and get a policy-defined reward RMθ.

**Step 3: Z(x) cancels in the difference.** The Bradley-Terry loss only needs the score difference between y_w and y_l. β log Z(x) depends only on x, so it drops out:

```text
J_DPO(θ) = − E [ log σ( β log( p^RL_θ(y_w|x) / p^PT(y_w|x) )
                       − β log( p^RL_θ(y_l|x) / p^PT(y_l|x) ) ) ]
```

The slides' takeaway: a simple classification loss that connects preference data directly to language model parameters. The paper is [Rafailov et al. 2023, Direct Preference Optimization](https://arxiv.org/abs/2305.18290), the first assigned reading for this lecture.

## The two routes side by side

The slides close this part with a summary page:

| | RLHF | DPO |
|---|---|---|
| Method | Train an explicit reward model on comparison data, then maximize its score under a KL constraint | Update model parameters directly on preference data by solving a binary classification problem |
| Strength | Very effective when tuned well | Simple and effective, with properties similar to RLHF |
| Weakness | Computationally expensive and tricky to get right | Does not leverage online data |

Hold onto "does not leverage online data." DPO learns only from a fixed preference dataset, which makes it an offline method. That puts it in the same spot as [L7 offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en): the data wasn't generated by the current policy.

For real-world cases, the slides list InstructGPT (marked with 30k tasks, plus a page on the task types labelers collected) and ChatGPT (instruction finetuning, then RLHF). They also note that DPO is helping open-source models improve. One visible effect of RLHF/DPO is stylistic: responses get more detailed and use more list formatting (citing Dubois et al. 2023).

## The frontier: the reward itself is unreliable

The last part, "Peeking into frontier post-training," covers open problems:

- **Reward hacking is common in RL.** Human preferences are unreliable, and learned models of them are even less reliable. The slides show the reward-model over-optimization plot from Stiennon 2020: push too hard on RMφ and true quality drops.
- **Train on verifiable rewards.** Math, code, and science problems have checkable answers that are hard to hack. The slides say this led to reasoning models, the topic of the next lecture, and add that not everything can be made verifiable.
- **Model behavior is hard to control.** Preference training can make models overuse emojis and become sycophantic. We want precise control over things like politeness and abstention, but balancing many reward functions is hard.
- **Let AI reward itself.** The final example is [Constitutional AI](https://arxiv.org/abs/2212.08073) (Bai et al. 2022). The model first gives a harmful answer (how to hack a neighbor's Wi-Fi), then critiques and revises its own answer into a refusal that explains the risk.

## The second reading: IPO (2025)

The schedule lists two readings for this lecture. The second is [Garg et al. 2025, IPO: Your Language Model is Secretly a Preference Classifier](https://arxiv.org/abs/2502.16182), which the slides don't cover. According to its abstract, this IPO is **Implicit Preference Optimization**: it uses a generative LLM as a preference classifier, which reduces reliance on human labels or an external reward model.

Watch out for the name collision. The IPO you implement in the [Default Project](/posts/ai/2026-09-30-cs224r-default-project-llm-rl-en) cites a different paper: [Gheshlaghi Azar et al. 2023, A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036). That one is a preference objective that relaxes the Bradley-Terry assumption and replaces the log-sigmoid with a squared loss. Same acronym, different method, so don't mix them up when you read the spec.

## Something to try tonight

Take a preference dataset you have (or write five pairs of good and bad responses to the same prompt). Write down the four numbers the DPO loss needs:

```text
log p_θ(y_w | x)     log p_ref(y_w | x)
log p_θ(y_l | x)     log p_ref(y_l | x)
```

Compute them with any small model and plug them into the DPO formula. Before training, p_θ = p_ref, so what's the loss? (It's log 2, because the term inside the sigmoid is 0.) That starting value makes a handy sanity check when you implement the Default Project.

## Further reading

- [CS336: SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en): the same methods from the angle of the LM training pipeline
- [CME295: Preference tuning](/posts/ai/2026-09-29-cme295-preference-tuning-en): another Stanford course's take on RLHF and DPO
- [Reading CS224N](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en): the course these slides were adapted from

**Series**: previous [HW3: Offline RL with AWAC and IQL](/posts/ai/2026-09-30-cs224r-hw3-offline-rl-awac-iql-en) | next [L10: RL for LLM reasoning and test-time compute](/posts/ai/2026-09-30-cs224r-rl-llm-reasoning-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## References

- [CS224R course home page and schedule (Spring 2026)](https://cs224r.stanford.edu/)
- [Lecture 9 slides: The Post-Training Frontier: RLHF, DPO and Modern Preference Optimization (2026)](https://cs224r.stanford.edu/slides/09_cs224r_rlhf_2026.pdf)
- [CS224R Spring 2025 archive page](https://cs224r.stanford.edu/spring_2025/)
- [Spring 2025 Lecture 9: RL for LLMs (YouTube, supplementary)](https://www.youtube.com/watch?v=XKLGuwvSKvI)
- [Rafailov et al. 2023, Direct Preference Optimization: Your Language Model is Secretly a Reward Model](https://arxiv.org/abs/2305.18290)
- [Garg et al. 2025, IPO: Your Language Model is Secretly a Preference Classifier](https://arxiv.org/abs/2502.16182)
- [Gheshlaghi Azar et al. 2023, A General Theoretical Paradigm to Understand Learning from Human Preferences](https://arxiv.org/abs/2310.12036)
- [Ouyang et al. 2022, Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Stiennon et al. 2020, Learning to summarize from human feedback](https://arxiv.org/abs/2009.01325)
- [Bai et al. 2022, Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073)
