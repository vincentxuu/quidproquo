---
title: "Machine Theory of Mind: How Agents Infer Other Agents' Intentions, Knowledge, and Goals"
date: 2026-06-04
type: deep-dive
category: ai
tags: [theory-of-mind, multi-agent, ai-agent, llm, reasoning]
lang: en
tldr: "Inferring another's beliefs/goals/intentions from observed behavior is called Machine Theory of Mind. Three lineages: symbolic BDI, Bayesian inverse planning, and deep learning ToMnet. The biggest controversy in the LLM era is that GPT-4 still trails humans by >10 points on ToMBench — are high scores genuine reasoning or statistical shortcuts?"
description: "An analysis of Machine Theory of Mind's three technical lineages (plan recognition/BDI, Bayesian inverse planning, ToMnet) and the core LLM-era debate: emergentists vs. shortcut skeptics, why benchmarks are broken, and the difference between literal and functional ToM."
draft: false
glossary:
  - term: "ToM"
    aliases: ["Theory of Mind", "心智理論"]
    definition: "從外在行為反推他者信念、目標與意圖的能力；機器版本稱 Machine Theory of Mind。"
    context: "本文整理機器具備這種能力的三條技術路線與 LLM 時代的爭議。"
  - term: "ToMnet"
    definition: "DeepMind 2018 提出的神經網路架構，透過觀察 agent 的行為軌跡學會預測其後續行為與信念，是深度學習路線 machine ToM 的代表作。"
    context: "本文用它代表「把心智推理當成 meta-learning 問題」的血脈。"
  - term: "BDI"
    aliases: ["Belief–Desire–Intention"]
    definition: "用信念（Belief）、慾望（Desire）、意圖（Intention）三元素描述 agent 心智狀態的經典框架；意圖帶承諾、不輕易動搖，對行為的預測力最強。"
    context: "本文用 BDI 作為符號路線的標準詞彙，NegotiationToM 等資料集直接用它標註對手心智。"
---

> 🌏 [中文版](/posts/ai/2026-06-04-machine-theory-of-mind-agent-intent-inference)

When multiple agents need to collaborate, negotiate, or even deceive each other, "mind reading" suddenly transforms from a philosophical question into an engineering requirement: one agent must infer another's **invisible beliefs, goals, and intentions** from **observable behavior**. In academia, this goes by a formal name — **Machine Theory of Mind (Machine ToM)**. This article breaks it down into three technical lineages (symbolic planning, Bayesian inference, deep learning), then walks you through the most divisive debate of the LLM era: are models' high scores on mental-state tests genuine reasoning, or Clever Hans-style statistical shortcuts? One key number up front: on ACL 2024's ToMBench, even GPT-4 trails humans by more than 10 percentage points.

## First, Let's Define the Problem: What Does "Inferring Another's Mental State" Mean?

The classic definition of Theory of Mind (ToM) comes from Premack & Woodruff 1978: attributing **mental states** such as beliefs, desires, and intentions to others, and understanding that **another's mental state may differ from reality and from your own**. The hardest test case is false belief — "someone didn't see an object get moved, so they'll look where they **think** it is."

Cognitive science offers two schools of thought on "how humans do this," and these two schools map neatly onto two AI approaches:

- **Theory-Theory**: Mental states are "inferred" from observed behavior → corresponds to inferential models (Bayesian, symbolic abduction).
- **Simulation Theory**: You use your own mind to "simulate" the other person → corresponds to LLMs using their own world model to role-play someone else.

There's also a dimension called order (hierarchy): first-order ToM is "he believes X"; second-order is "he believes 'she believes X'." Most benchmarks start to collapse at second-order and above.

## The Symbolic Lineage: Plan Recognition and BDI

The earliest engineered approach was **abduction**: given an observed sequence of actions, infer the plan that best explains them. This line of work is called Plan / Activity / Intent Recognition. One important distinction worth remembering (Blaylock & Allen): **goal recognition is a subset of plan recognition** — goal recognition only asks "what is their top-level goal?"; plan recognition also answers "which plan are they executing, how far along are they, and what role does each action play?" Early work used Cascading HMMs and synthetic plan corpora.

The vocabulary that agents use to describe mental states almost entirely comes from **BDI (Belief–Desire–Intention)**: Bratman's 1987 philosophy, formalized by Rao & Georgeff into a multi-modal temporal logic with possible-world semantics, then implemented in a host of agent programming frameworks. The three concepts map cleanly: Belief is information about the world/others/self, Desire (goal) is a desired state, and Intention is a **goal with commitment**.

This commitment is key. Bratman's original words reveal why "inferring intention" is more predictive than "inferring desire":

> "My desire to play basketball this afternoon is merely a potential influencer of my conduct — it must compete with my other desires to determine what I actually do. By contrast, once I **intend** to play basketball this afternoon, the matter is settled — I typically don't need to keep deliberating."

In other words, once an intention forms, it drives subsequent sub-plans and doesn't keep wavering, making it far more predictive of behavior than desire. BDI was originally an architecture for describing **an agent's own** reasoning, but it provides the **standard vocabulary for modeling others** — NegotiationToM, which we'll see later, directly uses BDI to annotate opponents' mental states.

## The Bayesian Lineage: Bayesian Inverse Planning

The second lineage turns "mind reading" into a clean probabilistic inference problem. The core idea (from the Baker, Saxe, Tenenbaum line of work) is: assume the other party is an **approximately rational planner**, write a **generative model (forward planning)** mapping "mental states → behavior," then use Bayes' theorem to **invert** it — after observing actions, infer the most likely goal-plus-belief combination that produced them. This is **Bayesian Inverse Planning (BIP)**: framing ToM reasoning as "inverting a rational decision-making generative model."

Its value lies in being **principled and able to quantify uncertainty**, rather than producing a black-box guess. Before 2018, it was the mainstream computational model of ToM. Three important extensions emerged:

- **Tolerating irrationality**: Real agents have flawed goals, plans, and actions — the framework needs to model boundedly rational agents.
- **Grounding to language**: Connecting epistemic language like "he knows" or "he thinks" to the belief posteriors inferred by BIP.
- **Hybridizing with LLMs**: Using LLMs as a front-end to convert natural language scenarios into forms BIP can solve (neuro-symbolic inverse planning), or performing cooperative language-guided inverse planning to understand instructions and proactively assist.

The cost: you have to **hand-write the generative model and state space**, making it hard to scale to open domains.

## The Deep Learning Lineage: ToMnet and Its Descendants

2018 was the watershed. DeepMind's **ToMnet** (Rabinowitz et al., ICML 2018) reframed ToM as a meta-learning problem. In the paper's own words:

> "We design a Theory of Mind neural network (ToMnet) that uses meta-learning to build models of the agents it encounters — **learning to model agents purely by observing their behavior**."

The architecture chains three networks:

- **Character net**: Ingests the agent's **past trajectory episodes**, extracting a character embedding that captures "what kind of personality/preferences this agent has" (analogous to long-term memory).
- **Mental state net**: Ingests the **current episode's** trajectory, producing a mental state embedding for the present moment (analogous to working memory).
- **Prediction net**: Combines both embeddings to predict the **next action and which goal the agent will pursue**.

The most elegant result was that it **could infer false beliefs**: researchers made a change to the environment that the agent couldn't see but ToMnet could (e.g., secretly moving the goal object), and ToMnet still predicted the agent would act **according to its outdated belief** — a machine version of the Sally-Anne test.

However, the ToMnet authors honestly acknowledged a fatal limitation in their conclusion: this kind of explicit belief inference **requires access to others' latent belief states as supervision signals during training**, and "in the real world, this communication channel is far sparser than in experiments," so the current form "is unlikely to scale." Subsequent work (Trait-ToM, dynamic-trait attribution, belief-graph models, ToM in cyber-defense scenarios) has largely revolved around working around this sparse supervision signal problem.

## The LLM Era: The Core Debate (Both Sides Presented)

After LLMs arrived, "mind reading" suddenly became very accessible — but it also immediately split into two camps, with no consensus to date.

**The Emergentist Camp (Optimistic)**: Kosinski 2023 argued that ToM appears to **emerge spontaneously** with model scale, with GPT-4 performing at the level of a 7-year-old child on multiple false-belief tests; Bubeck et al.'s "Sparks of AGI" echoed this view.

**The Shortcut Camp (Skeptical)**: Ullman 2023's counterattack was devastating — **minor perturbations cause collapse**. For example, telling the model "the bag is transparent" or "the character can't read," the model still predicted the character would hold a false belief. He argued that evaluation should default to skepticism, and **outlier failures should outweigh impressive average scores**.

Shapira et al.'s "Clever Hans or Neural Theory of Mind?" (EACL 2024) retested across 6 tasks and concluded:

> "Contemporary LLMs exhibit **limited** N-ToM capabilities... these capabilities are not robust, and in some cases we found evidence that they rely excessively on simple heuristics rather than generalized reasoning."

They directly rebutted the emergentist camp for over-extrapolating from 10–40 examples.

Even the benchmarks themselves have been questioned:

- **ToMBench** (Chen et al., ACL 2024): 8 tasks, 31 types of social cognitive abilities, **bilingual, built from scratch to avoid data contamination**, with multiple-choice automatic scoring. Conclusion: "even the most advanced GPT-4 trails humans by more than 10 percentage points."
- **FANToM**: Places false belief in **multi-party conversations with information asymmetry**, where all questions share the same underlying reasoning — "who knows this piece of information from the conversation." The conclusion is blunt: **LLMs don't have coherent ToM** — even with chain-of-thought or fine-tuning, they clearly underperform humans.
- **Position: ToM Benchmarks are Broken** (ICLR position paper) introduces an important distinction: **literal ToM** (ability to predict others' behavior) vs. **functional ToM** (ability to **adjust in real-time based on the other party's strategy during interaction**). It found that many open-source LLMs are strong on literal ToM but poor on functional ToM, arguing that the latter is what really needs to be tested.

Can "thinking reasoning models save ToM"? This too is divided: one camp found reasoning models more robust to perturbations; the other ("To Think or Not To Think") found they are **not necessarily better, sometimes worse**, and observed "slow-thinking collapse" where "the longer the reasoning, the lower the accuracy," as well as "removing answer options actually improves accuracy → the model was relying on option-matching shortcuts." The conclusion: reasoning gains in math/code **do not directly transfer to social reasoning**.

However, the skeptics don't completely win either. "Language Models Represent Beliefs of Self and Others" (ICML 2024) found that different agents' belief states can be **linearly decoded from the model's neural activations**, and manipulating these internal representations changes ToM performance — suggesting that models **do contain some form of belief representation** internally, not purely surface-level shortcuts.

## Multi-Agent Systems and "The Upper Bound of Mind Reading"

Placing all of this back in multi-agent systems, several points are worth remembering:

- **Collaboration always has a gap**: In speaker–listener experiments, speakers with Machine ToM gave better guidance than those without, **but still fell short of the upper bound achievable by "directly accessing the other's true mental state."** Inference, after all, is not mind reading.
- **Negotiation and deception**: NegotiationToM directly uses the BDI framework to annotate opponents' desires, second-order beliefs, and intentions; game-theory research finds that LLM agents tend toward cooperation and prefer negotiation when goals are aligned, but strategic deception also emerges.
- **Multimodal**: MuMA-ToM and MMToM-QA push ToM into **video + text embodied home scenarios**, testing both belief inference and goal inference simultaneously.

## Overall Architecture

```
                   Observed behavior / trajectories / dialogue
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
      Symbolic            Bayesian            Neural
      abduction         inverse planning      network
   plan/goal recog.   (invert rational       ToMnet family
   (BDI vocabulary)    generative model)    (meta-learning)
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
            Inferred: belief (what they know) / desire (what they want)
                      / intention (what they're committed to doing)
                              │
                              ▼
              Predict next move → collaborate / negotiate / assist / defend
```

## The Bottom Line

The three lineages represent clear trade-offs: for **interpretability, quantifiable uncertainty, and few-shot scenarios**, go with Bayesian inverse planning — but you must hand-write the generative model and scaling is hard; for **learning from large behavioral datasets and generalizing to unseen agents**, go with ToMnet-family approaches — but you need sparse mental-state supervision signals; for **natural language, open-domain, plug-and-play** use, go with LLMs — but robustness is the biggest question mark. In multi-agent systems modeling opponents, the most common combination today is **"BDI as vocabulary + any of the above engines as the inference mechanism."**

The most important methodological warning to remember: inferring others' mental states **always has an upper-bound gap between "inferred" and "true" mental state**; LLMs make this easy to get started with, but **equating "correct benchmark answers" with "genuine Theory of Mind" is currently the biggest trap in this field**. A more precise characterization of the current state: LLMs show signs of literal ToM, but functional, robust ToM remains an open problem.

## References

- [Machine Theory of Mind (Rabinowitz et al., ICML 2018)](https://arxiv.org/abs/1802.07740) — ToMnet original paper
- [Machine Theory of Mind (PMLR full text)](https://proceedings.mlr.press/v80/rabinowitz18a/rabinowitz18a.pdf)
- [Belief–Desire–Intention software model (Wikipedia)](https://en.wikipedia.org/wiki/Belief%E2%80%93desire%E2%80%93intention_software_model)
- [BDI Agent Architectures: A Survey (IJCAI 2020)](https://www.ijcai.org/proceedings/2020/0684.pdf)
- [An Introduction to Plan, Activity, and Intent Recognition (PAIR Book)](https://ial.eecs.ucf.edu/pdf/PAIRBook-Intro.pdf)
- [Acting as Inverse Inverse Planning (Bayesian inverse planning, arXiv 2305.16913)](https://arxiv.org/abs/2305.16913)
- [Modeling the Mistakes of Boundedly Rational Agents (arXiv 2106.13249)](https://arxiv.org/abs/2106.13249)
- [ToMBench: Benchmarking Theory of Mind in Large Language Models (ACL 2024, arXiv 2402.15052)](https://arxiv.org/abs/2402.15052)
- [ToMBench GitHub repo](https://github.com/zhchen18/ToMBench)
- [FANToM: A Benchmark for ToM in Interactions (EMNLP 2023)](https://hyunw.kim/fantom)
- [Large Language Models Fail on Trivial Alterations to ToM Tasks (Ullman 2023, arXiv 2302.08399)](https://arxiv.org/abs/2302.08399)
- [Clever Hans or Neural Theory of Mind? (Shapira et al., EACL 2024)](https://aclanthology.org/2024.eacl-long.138.pdf)
- [Evaluating large language models in theory of mind tasks (Kosinski, arXiv 2302.02083)](https://arxiv.org/abs/2302.02083)
- [Position: Theory of Mind Benchmarks are Broken for LLMs (OpenReview)](https://openreview.net/forum?id=BCP8UU2BcU)
- [Language Models Represent Beliefs of Self and Others (ICML 2024, arXiv 2402.18496)](https://arxiv.org/abs/2402.18496)
- [To Think or Not To Think: LLM Reasoning in Theory of Mind Tasks (OpenReview)](https://openreview.net/forum?id=jGcBIvOrqc)
- [MuMA-ToM: Multi-modal Multi-Agent Theory of Mind (arXiv 2408.12574)](https://arxiv.org/abs/2408.12574)
