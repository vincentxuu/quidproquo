---
title: "NTU ADL 2025 Lecture 10: Bias, Safety, Hallucination, and Alignment, Plus the Jailbreaking Olympics Final Project"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, ai-safety, hallucination, alignment]
lang: en
series:
  name: "Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall"
  order: 13
tldr: "Lecture 10 of ADL Fall 2025 sorts the problems of pretrained models into four groups, each paired with a goal: bias with fairness, toxicity with safety, hallucination with factuality, and finally alignment. The slides argue that bias can enter at any stage of the ML pipeline, that safeguards belong at four layers (data, input, training, output), that hallucination can be checked atomic fact by atomic fact, and that over-optimizing a reward model produces familiar symptoms: verbosity, excessive apologies, over-refusal. The final project announced that week is called Jailbreaking Olympics, but all that is public is the titles and one-line descriptions of two videos."
description: "A guide to the 11/03 Issues and Development in PLMs slides and videos 10.1–10.3 of NTU Yun-Nung Chen's ADL Fall 2025 (114-1): the definition and sources of bias, system-level mitigation, StereoSet, toxicity and four layers of safeguards, jailbreaking (AutoDAN, GCG), long-form factuality evaluation and FactAlign, reward models and DogeRM, over-optimization, unintended effects of alignment, and how much of the Jailbreaking Olympics final project is public."
draft: false
glossary:
  - term: "jailbreaking"
    aliases: ["jailbreak"]
    definition: "Using carefully crafted adversarial prompts to bypass a model's safety alignment and safeguards, forcing it to produce content it would normally restrict."
    context: "The definition on slide 19, which lists manual prompts, automatic prompt search, and gradient-based optimization."
  - term: "over-optimization"
    aliases: ["overoptimization"]
    definition: "When RL uses a reward model as a stand-in for human preference, the model pushes the stand-in's score too high and actual quality drops."
    context: "Slide 38 lists ChatGPT's symptoms: excessive verbosity, excessive apologies, over-refusal, and more."
  - term: "atomic fact"
    aliases: ["atomic claim"]
    definition: "The smallest verifiable statement a long answer can be split into, each judged true or false on its own."
    context: "Slide 25 walks through the FactScore / LongFact evaluation pipeline."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-adl2025-fairness-safety-factuality)

**Video status: Videos included.** [Source details](#course-video-sources)

This is post 13 of [Reading NTU Yun-Nung Chen Applied Deep Learning 2025 Fall](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en). ADL Fall 2025 (114-1, 2025/09/01–12/15) taught this lecture on 11/03. On the [course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/), the same row also carries the Final Project Announcement and the LLM Deployment TA session, and the week is marked Physical.

**Sources**: the slide deck [Issues and Development in PLMs: Fairness, Safety, Factuality, Alignment (251103_Issues.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251103_Issues.pdf) (42 pages) and three videos: [10.1 Fairness for Bias Mitigation](https://youtu.be/3BAFtBS27UI) (24:53), [10.2 Model Safety](https://youtu.be/V2Pot_Uv31E) (23:46), and [10.3 Factuality for Hallucination Mitigation](https://youtu.be/v9Vqk_mfDyA) (33:43). All three video descriptions are dated 2025/11/03 and credit the slides to Stanford and CMU courses, which the deck's last page also lists. The videos are taught in Mandarin. I checked the slides on 2026-09-30, and all page numbers below refer to the PDF.

**Series**: Previous: [NLG: Decoding, Control, and Evaluation](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en) | Next: [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en) | [Series overview](/posts/ai/2026-09-30-ntu-adl2025-course-overview-en)

> **Access note**: The series as a whole is A2. This lecture's slides and three videos are public, but the **Alignment section (slides 29–40) has no matching video**. The playlist has only 10.1–10.3 for lecture 10, and their titles map to fairness, safety, and factuality. The final project spec isn't public either; see the end of this post.

The previous lectures made models stronger: pretraining, [post-training](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf-en), [RAG](/posts/ai/2026-09-30-ntu-adl2025-rag-hw3-en). This one turns the question around: **what problems does a model trained on huge amounts of web data carry, and how do you measure and fix them?**

The deck is organized as four problem-to-goal pairs:

| Problem | Goal | Slides | Video |
|---|---|---|---|
| Bias | Fairness | 2–13 | 10.1 |
| Toxicity | Safety | 14–22 | 10.2 |
| Hallucination | Factuality | 23–28 | 10.3 |
| (steering models toward specific goals) | Alignment | 29–40 | none |

## Course video sources

These videos were checked on 2026-10-10 against the official course page and official YouTube playlist (lecture numbers and titles match); no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=3BAFtBS27UI
title: ADL 10.1: Fairness for Bias Mitigation (YouTube, in Mandarin)
```

```youtube
url: https://www.youtube.com/watch?v=V2Pot_Uv31E
title: ADL 10.2: Model Safety (YouTube, in Mandarin)
```

Original videos: [ADL 10.1: Fairness for Bias Mitigation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=3BAFtBS27UI)、[ADL 10.2: Model Safety (YouTube, in Mandarin)](https://www.youtube.com/watch?v=V2Pot_Uv31E)、[ADL 10.3: Factuality for Hallucination Mitigation (YouTube, in Mandarin)](https://www.youtube.com/watch?v=v9Vqk_mfDyA)、[ADL 2025 Final Project Introduction (YouTube)](https://www.youtube.com/watch?v=UBe9eGPwRyg)、[ADL 2025 Final Project Grand Challenge (YouTube)](https://www.youtube.com/watch?v=pZxBNlSqy6I)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

Checked: 2026-10-10.

Transcript attempt (2026-10-10): the embedded 10.1 (24:53) and 10.2 (23:46) have no obtainable YouTube transcript, so their spoken content was not checked. The article takes its content from numbered slides and does not attribute any claim to the spoken lecture. Both were uploaded on 2025-11-06 with a description dated 2025/11/03 crediting Stanford and CMU courses for the slides.

## Bias → Fairness

### Where bias comes from

Slide 3 quotes Wikipedia: bias is "disproportionate weight in favor of or against an idea or thing, usually in a way that is closed-minded, prejudicial, or unfair". The slide writes the relationship as presence of bias ≃ absence of fairness, and algorithmic fairness as the attempt to correct biases in ML systems.

Slide 4 is the figure to remember from this section. The ML pipeline runs from data distributions, selection and filtering, labeling, feature and task setup, model choice, and loss choice to evaluation and downstream use, and **bias can arise from any of these design decisions**.

The slides then give two kinds of examples:

- **Data bias** (slides 5–6): in [Zhao et al. 2017](https://arxiv.org/abs/1707.09457)'s visual semantic role labeling, 66% of training images of cooking had a woman as the agent, and the model predicted a woman for 84% of cooking images at test time. The bias got amplified. Slide 6 adds ChatGPT leaning on gender stereotypes when choosing pronouns for kindergarten teachers, nurses, technicians, and construction workers.
- **Model bias** (slide 7): an objective that minimizes loss globally learns to predict the most frequent class and sacrifices less frequent ones. Simplicity bias makes limited-capacity models learn shortcuts first, stereotypes included.

### System-level mitigation

The examples on slides 8–11 change the system, not the model:

- When Google Translate gets input in a non-gendered language (Turkish, for example), it translates twice and returns both a masculine and a feminine version. The slide's summary: detect ambiguity and provide multiple responses covering both majority and minority.
- Asked "Who is Taiwan's captain?" (a nickname with several referents), ChatGPT first asks for context. Add "in baseball" or "in politics" and the answers are completely different. The slide's conclusion: **asking the user to clarify can steer the model off the majority path**.

Slide 12 adds language bias: MMLU shows significant gaps between high-resource English and lower-resource languages (the slide uses Telugu). Slide 13 introduces StereoSet, a dataset for measuring stereotypical bias.

## Toxicity → Safety

Slide 15 separates bias from toxicity (citing slides from CMU's Advanced NLP course), and slide 16 names the root cause. The pretraining recipe is "use as much data as you can", so the model also learns toxicity, bias, and extremism. Slide 17 gives two data points: larger models show more toxicity (Touvron et al. 2023), and over 4% of GPT-2's pretraining documents are toxic (Gehman et al. 2020).

Slide 18 sorts LLM safeguards into four layers. You can use the table as-is to audit your own system:

| Layer | What to do |
|---|---|
| Training data | Filter out toxic training data |
| Input prompt classification | Topic-based filters, toxic content detection |
| Instruction tuning and RLHF | Write refusal demonstrations; make RLHF prefer non-toxic generations |
| Output | Generate-then-classify; controllable text generation |

### Jailbreaking

Slide 19 defines **jailbreaking**: carefully crafted adversarial prompts that bypass a model's safety alignment and force it to produce restricted content. It lists three families of methods:

1. Manual prompt engineering: role-play, long context, mimicking the system prompt, few-shot.
2. Automatic jailbreak prompt search: the slides use [AutoDAN](https://arxiv.org/abs/2310.04451) (Liu et al. 2024, slide 20), which looks for prompts that trigger dangerous responses.
3. Gradient-based optimization: the slides use [Greedy Coordinate Gradient (GCG)](https://arxiv.org/abs/2307.15043) (Zou et al. 2023, slides 21–22), which learns the adversarial prompt with gradients.

The slides give only this taxonomy and the core idea of the two papers; they don't go into attack details.

## Hallucination → Factuality

The example on slide 24 is persuasive. Asked for a biography of Yun-Nung Chen, a model says she got her PhD at UC Berkeley under Dan Klein; the slide marks the correct answers next to it, Carnegie Mellon University and Alexander I. Rudnicky. The slide's claim: **factuality is crucial if LLMs are to be the next-generation information engine**.

### Evaluating long-form factuality

The pipeline on slide 25: split the answer into atomic claims, revise each to be self-contained, then check each one against search or Wikipedia. The slide cites [FactScore](https://arxiv.org/abs/2305.14251) (Min et al. 2023) and [LongFact](https://arxiv.org/abs/2403.18802) (Wei et al. 2024), with precision, Recall@K, and F1@K as metrics, and notes that these evaluators agree closely with human annotation.

### FactAlign

Slides 26–28 cover [FactAlign](https://arxiv.org/abs/2410.01691) (Huang & Chen 2024) from Chen's lab. The idea is to move alignment from one binary label per response down to the **sentence level**, with an algorithm called fKTO and iterative optimization. The results on slide 28: on LongFact, LLaMA-3-8B, Phi3-Mini, and Gemma-2B all reach a higher F1@100 with FactAlign than with SFT.

## Alignment (slides only, no video)

### What data SFT and RLHF need

Slides 30–31 compare two kinds of human feedback:

- **Instruction-following data** (one input, one good output) is harder to create; **preference data** (pick one of two outputs) is easier.
- SFT learns to predict the next good token, which is local. RLHF learns to generate a good whole response, which is global.

This is the same local-versus-global argument as [RL for NLG in the previous post](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en). The slides also note that human feedback remains expensive and hard to scale.

### Reward models and DogeRM

Slides 32–33: a reward model simulates human feedback and is trained with supervised learning on collected preferences. The catch is that preference data for specific domains, such as coding, is hard to collect.

[DogeRM](https://arxiv.org/abs/2407.01470) (Lin et al. 2024, slides 34–35) starts from the observation that domain SFT data is far more plentiful than preference data, so it uses **model merging** to give the reward model domain knowledge. The slides report that it works across benchmarks.

Slides 36–37 show two ways to use a reward model: generate several answers and let the RM pick the highest-scoring one (slow, expensive), or tune the LLM with the RM's scores through RL so it only has to generate once.

### Over-optimization and its symptoms

Slide 38: **over-optimization may hurt performance**. Citing an ICML 2023 invited talk, it lists ChatGPT's symptoms:

- Excessive verbosity
- Excessive apologies and self-doubt
- "As an AI language model"
- Hedging language, "there's no one-size-fits-all solution…"
- Over-refusals

Slide 39 cites Ryan et al. 2024: both SFT and preference tuning tend to steer models toward US preferences and opinions. Slide 40 leaves three big questions: how to balance harmless and helpful; what to do when people's preferences are biased or gameable (people prefer certainty over uncertainty in answers, for example); and the fundamental one, that **you cannot represent all values and cultures in one ranking**.

## Final project: Jailbreaking Olympics

The final project was announced the same week. According to [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf), the team final project is 35% of the grade, and the course page lists 2025/12/15 as Final Project Due.

Only two videos are public, and the only content this post can confirm is their titles and descriptions:

| Video | Length | Description |
|---|---|---|
| [ADL 2025 Final Project Introduction](https://youtu.be/UBe9eGPwRyg) | 10:58 | Rules and Grading |
| [ADL 2025 Final Project Grand Challenge](https://youtu.be/pZxBNlSqy6I) | 38:30 | Jailbreaking Olympics: Building & Breaking Satety Systems (spelling as in the original) |

The description tells you the direction: build safety systems and break them, which lines up with this lecture's safeguards and jailbreaking sections. **The rules, grading, data, and platform have no public documents**, and this series doesn't paraphrase details from the video frames, so I leave them out. If you want to run a similar exercise yourself, the four-layer safeguard table on slide 18 and the three attack families on slide 19 are where to start designing both sides.

## How to self-study this lecture

1. Start with 10.2 alongside slides 18–22, and map the four safeguard layers against the three jailbreak families.
2. For 10.3, ask any LLM for a biography of someone you know well, split it into atomic facts following slide 25, and check each one yourself.
3. The Alignment section has no video, so read slides 29–40 directly. The symptom list on slide 38 works as a checklist when you review your own model's answers.

One thing you can do tonight: take an LLM application you own, go through slide 18's four layers, and write "done / not done" for each. Find the emptiest layer.

## Further reading

- [CS224N Lecture 16: Hallucination, Creativity, Work, and Value Alignment](/posts/ai/2026-08-22-cs224n-social-impacts-en): the Stanford take on the same topics, and one of the sources this deck draws from.
- [CME295 Lecture 5: RLHF and DPO](/posts/ai/2026-09-29-cme295-preference-tuning-en): reward models and preference tuning in detail.
- [CS224N Lecture 8: From Instruction Tuning and RLHF to DPO](/posts/ai/2026-08-22-cs224n-post-training-en)

Previous: [NLG: Decoding, Control, and Evaluation](/posts/ai/2026-09-30-ntu-adl2025-nlg-decoding-evaluation-en)
Next: [Language Agents](/posts/ai/2026-09-30-ntu-adl2025-language-agents-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded videos match the lectures on the official course page and playlist.
- 2026-10-10: Tried to check 10.1 and 10.2 against transcripts, but neither has one, so the content was not checked; the article was left unchanged.

## References

- [ADL Fall 2025 course page](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — the 11/03 schedule row and the Final Project Due date
- [Issues and Development in PLMs slides (251103_Issues.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/251103_Issues.pdf) — all page numbers in this post
- [Course Logistics slides (250901_Course.pdf)](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) — final project weight of 35%
- [ADL 10.1: Fairness for Bias Mitigation (YouTube, in Mandarin)](https://youtu.be/3BAFtBS27UI)
- [ADL 10.2: Model Safety (YouTube, in Mandarin)](https://youtu.be/V2Pot_Uv31E)
- [ADL 10.3: Factuality for Hallucination Mitigation (YouTube, in Mandarin)](https://youtu.be/v9Vqk_mfDyA)
- [ADL 2025 Final Project Introduction (YouTube)](https://youtu.be/UBe9eGPwRyg)
- [ADL 2025 Final Project Grand Challenge (YouTube)](https://youtu.be/pZxBNlSqy6I)
- [Zhao et al., Men Also Like Shopping: Reducing Gender Bias Amplification using Corpus-level Constraints (EMNLP 2017)](https://arxiv.org/abs/1707.09457)
- [Liu et al., AutoDAN: Generating Stealthy Jailbreak Prompts on Aligned Large Language Models](https://arxiv.org/abs/2310.04451)
- [Zou et al., Universal and Transferable Adversarial Attacks on Aligned Language Models (GCG)](https://arxiv.org/abs/2307.15043)
- [Min et al., FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation](https://arxiv.org/abs/2305.14251)
- [Wei et al., Long-form factuality in large language models (LongFact)](https://arxiv.org/abs/2403.18802)
- [Huang & Chen, FactAlign: Long-form Factuality Alignment of Large Language Models](https://arxiv.org/abs/2410.01691)
- [Lin et al., DogeRM: Equipping Reward Models with Domain Knowledge through Model Merging](https://arxiv.org/abs/2407.01470)
