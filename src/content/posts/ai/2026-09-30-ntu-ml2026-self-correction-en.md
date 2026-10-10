---
title: "Hung-yi Lee ML 2026 Self-Correction: Can a Model Fix Its Own Mistakes? What Changing Decoding, Workflow, or Weights Buys You"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, self-correction, reasoning, rlvr]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 13
tldr: "This lecture asks whether a model can catch and fix its own errors with no human in the loop. Hung-yi Lee splits the approaches into three routes. Change inference: the whole contrastive decoding family builds a version of the model likely to be wrong and subtracts it, and the methods differ only in how that wrong version is made. Change the workflow: appending \"check again\" sometimes helps but is unstable, external feedback beats self-reflection, and under a fixed compute budget, sampling more answers and voting often wins. Change the weights: teaching self-correction directly runs into \"after training, the model makes different mistakes,\" which is why the field moved to RL. Whether RL teaches new abilities or just makes existing paths more likely is still being debated."
description: "A guide to the 4/24 Self-Correction lecture of NTU Hung-yi Lee's Machine Learning 2026 Spring: Contrastive Decoding, DoLa, LayerCD, ICD, CAD, image and audio variants, and MTI; self-correction benchmarks, RefineBench, confidence level vs. critique score, how the reflection prompt's wording matters, and whether verification pays off at fixed compute; ReVISE, the limits of teaching self-correction directly, RLVR, why reasoning goes wrong before it goes right, and what RL actually learns."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-self-correction)

**This post covers the 4/24 lecture "How to educate a model (2): Self-Correction" from [Machine Learning 2026 Spring](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is Part 13 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The official materials are the slides [Self-Correction.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Correction.pdf) (65 pages, plus a pptx) and the video [AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理](https://youtu.be/m3i2mk5hs8U) (in Chinese). Access is **A3**: slides and recording are both public.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=m3i2mk5hs8U
title: Video: AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理 (in Chinese)
```

Original videos: [Video: AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理 (in Chinese)](https://www.youtube.com/watch?v=m3i2mk5hs8U)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## The question: can a model fix itself when nobody points out the error?

Tell a model "you're wrong, here's where," and it usually fixes the answer. This lecture asks the harder version: **after the model answers, with no human involved, can it notice the error and correct it on its own?**

Lee says he has covered this twice before. The first time was the 2023 video ["ChatGPT can reflect on itself!"](https://youtu.be/m7dUFlX-yQI). Much of this lecture extends Lecture 7 of 2025, [on deep thinking (reasoning)](https://youtu.be/bJFtcwLSNxI), and he says he "won't repeat much of the old material." The slides link timestamps in that 2025 video in several places, so you can fill gaps as you go (both videos are in Chinese).

The lecture follows three routes, shallow to deep:

| Route | What changes | Training needed? | Cost |
|---|---|---|---|
| Change the inference process | The probability distribution at each step | No | An extra (full or partial) forward pass |
| Change the harness (workflow) | Append a reflection prompt after generation | No | Extra tokens on every question |
| Change model parameters (reasoning) | The weights | Yes | Training cost |

## Route 1: change inference

### The error signal lives in the representations

Lee starts with two earlier papers showing that both detection and correction can be automatic. The first ([arXiv 2304.13734](https://arxiv.org/abs/2304.13734)) collects representations from when a model answers correctly and incorrectly, trains a binary classifier, and finds it can partly predict correctness on unseen questions. The second, [TruthX](https://arxiv.org/abs/2402.17811), averages the correct and incorrect representations, subtracts them to get a "correct minus wrong" vector, and adds it to the representation of a question the model would get wrong. The model may then answer correctly.

The slide names their shared drawback: **you have to collect extra data**.

### Contrastive decoding: build a version likely to be wrong, then subtract it

The data-free alternative is contrastive decoding. Run the same question twice: once normally, and once in a state **deliberately engineered to likely produce a wrong answer**. Subtract the second output from the first to push the answer away from the wrong side. This happens at every generated token.

<details>
<summary>What the formula looks like</summary>

As Lee explains it: call the normal output $z$ and the wrong version $z^-$. Take the difference, scale it by an $\alpha$ usually below 1, and add it back. That equals

$$
(1+\alpha)\,z - \alpha\, z^-
$$

The literature most often applies this to the final logits or probability distribution, not a middle hidden layer. Later slides on CAD and the audio variant write it as a combination of $(1-\alpha)$ and $\alpha$. The idea is the same: boost the normal component, subtract the wrong one.

</details>

The slide states the trade-off plainly. **The upside is that model parameters don't change**, so you can apply it any time after training. **The downside is extra compute**: one forward pass becomes two.

The first paper to use the name was [Contrastive Decoding](https://arxiv.org/abs/2210.15097) in 2022. Lee's example is "Obama was born in Honolulu, and he was born in the year." Large GPT-2's top next token is Hawaii (wrong; it should be a year). Using GPT-2 Small's output as the wrong version and subtracting, the top token becomes 1961. Because the two models have different depths, the subtraction can only happen at the final output.

Nearly every later method answers one question: **where does the wrong version come from?** The slides end this section with a summary table, reproduced here with its columns:

| Method | How the wrong result is obtained | What is modified |
|---|---|---|
| [Contrastive Decoding](https://arxiv.org/abs/2210.15097) | A smaller model | output |
| [DoLa](https://arxiv.org/abs/2309.03883) | Shallow-layer output via logit lens | output |
| [LayerCD](https://arxiv.org/abs/2509.25177) | Shallow image-encoder layers | output |
| [ICD](https://arxiv.org/abs/2311.00233) | A "dumb-down" instruction | output |
| [CAD](https://arxiv.org/abs/2305.14739) | Remove context (e.g., RAG-retrieved documents) | output |
| [VCD](https://arxiv.org/abs/2311.16922) | Add noise to the image, shuffle patches, mask key regions | output |
| [Audio-aware Decoding](https://arxiv.org/abs/2506.07233) | Remove the audio | output |
| [MTI](https://arxiv.org/abs/2510.13940) | A dumb-down instruction, aimed at cutting compute | output |
| [VISTA](https://arxiv.org/abs/2502.03628) | Remove the image | hidden representation |
| [ACG](https://arxiv.org/abs/2601.13707) | Remove the image | attention |

A few deserve an extra sentence:

- **DoLa** builds on the [logit lens](https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens): attach the LM head to a middle layer and you can decode from it. The slide asks Llama 2 for the Chinese translation of the French word "fleur," and a middle layer decodes the English "flower." DoLa assumes shallow-layer outputs are more likely wrong and uses them as the wrong version. Shallow layers run anyway, so the extra cost is small. Lee notes that Hugging Face Transformers has a built-in DoLa option, and that DoLa's first author was once an undergraduate researcher in his lab.
- **ICD**'s "dumb-down spell" is literally appending something like "you always give wrong answers" to the input.
- **CAD** started with RAG: some models think they already know the answer and ignore retrieved documents. Run once without the documents as the wrong version and subtract it. The image version is the most intuitive. Show a model a black banana and ask its color, and it wavers between its prior ("bananas are yellow") and what it sees. Remove the image or add heavy noise, and it answers "yellow" from prior alone. Subtract that, and "black" rises to the top.
- **MTI** tries to save compute by applying contrastive decoding only at tokens where the model is most uncertain (high entropy). The catch: getting the wrong version at that position would normally mean rerunning the whole input. MTI borrows the [cross-conversation KV cache](/posts/ai/2026-09-30-ntu-ml2026-kv-cache-en) idea and appends the dumb-down phrase at the very end (the paper uses the two tokens "Output Error"). Everything before it is a cache hit, and only those two tokens need computing. Lee cites accuracy rising from about 62% to 72%. Swapping in "Output Correct" or words like "Monkey" works worse.

Lee's verdict is practical: none of these needs training, so "just run it, there's nothing to lose." Whether it's better to intervene somewhere other than the logits (hidden representations, attention) he considers an open question.

## Route 2: change the workflow

### Append "check again"

The workflow here is the generation + verification pattern from [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en): after the model answers, a program automatically appends a reflection prompt unrelated to the question (e.g., "check again") and sees whether the model revises. Because a program inserts it, it still counts as self-correction. For more workflow variants Lee points to 2025 Lecture 7; here he covers only the basic idea.

The slides give two intuitions for why it might help:

- **Critiquing is easier than generating**: you can judge a novel without being able to write one.
- **Generation can't go back**: sample one wrong token and the model has to keep bluffing. A reflection prompt gives it an "opportunity" to continue with a correction.

Lee also warns these are human intuitions. One study found models aren't better at picking their own correct answer than at generating it, but that study framed critique as multiple choice, so the model might simply have been bad at multiple choice. You need experiments.

### What the experiments say

**[Can LLMs Correct Themselves?](https://arxiv.org/pdf/2510.16062)** compares accuracy before and after reflection across many models and benchmarks (HotpotQA, CS-QA, GPQA, AQUA, GSM8K, MATH, HumanEval). Self-reflection alone (internal) often helps but is **unstable**, and in many cases makes things worse. External feedback (running code to see error messages, web search) is steadier: fewer cases get worse, and those that do drop less.

**[RefineBench](https://arxiv.org/pdf/2511.22173)** reaches a similar conclusion. In Lee's walkthrough, a strong model like Claude 3.5 Sonnet barely improves over five rounds of self-reflection. Giving it a partial checklist, the full checklist, and then full feedback yields bigger gains at each step. **External feedback is the signal that improves models most.**

### Stubborn or pushover: confidence level and critique score

[This analysis](https://arxiv.org/pdf/2412.19513) splits before/after correction into four cases and defines two numbers:

- **Confidence Level (CL)**: the probability that a correct answer stays correct after correction.
- **Critique Score (CS)**: the probability that a wrong answer becomes correct.

Together they determine post-correction accuracy:

$$
\text{ACC}_2 = \text{ACC}_1 \times \text{CL} + (1-\text{ACC}_1)\times \text{CS}
$$

In the slide's table, most models have high CL and low CS: they rarely break a correct answer, but they also rarely fix a wrong one. Lee reads this as model "personality," and stubbornness and openness to criticism look somewhat mutually exclusive.

The wording of the reflection prompt changes that personality. The paper compares three prompts on Llama 3: Reask (do it again), Confidence (you're probably right, give me your final answer), and Critique (are you sure? think carefully). On GSM8K, CL goes from 91.7 with Reask to 93.5 with Confidence and 77.7 with Critique; CS goes from 44.9 to 32.9 and 47.9. **Affirm the model and it holds its ground; question it and it revises more, including breaking correct answers.** Lee suggests this may be why the literature disagrees on whether reflection works: papers insert different prompts, and models have different personalities.

### Does verification actually pay off?

Reflection costs compute. What if you spent the same compute sampling more answers and taking a majority vote? [This paper](https://arxiv.org/abs/2504.01005) makes two plots:

- **With number of solutions on the x-axis**, adding verification looks great: the same accuracy with about a quarter as many solutions.
- **With compute (FLOPs) on the x-axis**, the conclusion flips. On a limited budget, skipping verification and just sampling more answers to vote is better. Verification only starts paying off once extra sampling saturates; the slide marks that a 3.8% gain takes about 128× the compute.

Lee's conclusion: verification is a luxury good. If you propose a new reflection workflow, the minimum baseline is majority voting at equal compute, and results that skip it will likely be challenged.

## Route 3: change the weights

### From workflow to reasoning

A workflow forces a reflection prompt on every question, making the model think more whether its answer is right or wrong. Reasoning aims for a model that **learns to revise only when it should** and stops when it shouldn't, which could be cheaper and smarter.

But knowledge isn't the same as self-correction. The [study](https://arxiv.org/pdf/2505.16170) cited on the slide asks a model to name a politician born in New York City, and it says Hillary Clinton. Asked separately where Clinton was born, it knows: Chicago. It has the right knowledge but doesn't notice its earlier answer is wrong. Lee adds that the paper finds self-correction behaves like a "state" that can be extracted as a steering vector, so it takes extra training to acquire.

### Teaching it directly: ReVISE and its limits

[ReVISE](https://arxiv.org/pdf/2502.14565) teaches self-correction in two stages: first error detection (after a wrong output emit `[REFINE]`, after a correct one emit `[END]`), then error correction (after a wrong output plus `[REFINE]`, produce the correct answer). Lee says the paper found learning them separately easier than learning them together.

A [2024 paper](https://arxiv.org/abs/2409.12917) points out the problem with teaching it directly: once the model is trained, its parameters change, and **so do its mistakes**. During training it only saw how to fix the old errors; at inference it meets new ones, a "state never seen in training," and may do worse. So the whole pipeline of answering and self-correcting needs to be trained together, which is why the industry moved to reinforcement learning.

### RL: only the final answer matters

RL with verifiable rewards (RLVR) only checks the final answer, which suits math and coding where right and wrong are unambiguous. The interesting part: after this training, models naturally start to "propose a solution → check it → try another approach." Self-correction emerges without anyone teaching it specifically.

### Why not get it right the first time?

Lee offers two angles. The first is the MIT News story on ["the cost of thinking"](https://news.mit.edu/2025/cost-of-thinking-1119): on some tasks, a model's reasoning token count roughly tracks human solving time. He critiques the comparison himself: tokens should correspond to how much a person writes on scratch paper, not to time.

The second comes from three February 2025 papers ([2502.04667](https://arxiv.org/abs/2502.04667), [2502.08991](https://arxiv.org/abs/2502.08991), [2502.18273](https://arxiv.org/abs/2502.18273)). If each step has $K$ variations, doing it in one shot means learning $K^{T+1}$ input–output combinations, while splitting it into $T+1$ steps needs only $K(T+1)$ examples. Lee's concrete example is 6-bit parity: memorizing it directly takes $2^6 = 64$ examples; as a chain of XORs, each step has 4 combinations over 5 steps, so 20 examples suffice. He also notes that for problems drawn from the training distribution you can skip reasoning and memorize; reasoning pays off when you need generalization.

### What does RL actually learn?

This closing section is the most open, with evidence on both sides:

- **It just makes existing paths more likely**: [this paper](https://arxiv.org/abs/2504.13837) compares pass@k before and after RL. At $k=1$ the RL model is much better; at $k=256$ they're about equal, with RL even slightly lower. The correct answers were reachable by the base model, just unlikely. Following that idea, [a training-free sampling method](https://arxiv.org/abs/2510.14901) approaches or beats a GRPO-trained model on MATH500, HumanEval, and GPQA.
- **It really learns something new**: [another paper](https://arxiv.org/pdf/2506.14245) argues the base model's large-$k$ successes may be lucky guesses. Using CoT-Pass@k (the reasoning must also be correct), the gap between before and after RL reopens. Lee's critique: whether the reasoning is correct is judged by yet another language model.
- **Both**: [The Debate on RLVR Reasoning Capability Boundary](https://arxiv.org/abs/2510.04028) concludes that early in training RL mainly reweights existing paths, and new abilities can emerge only with long enough training. Which algorithms and rewards best elicit new abilities is still under study.

## Takeaways for engineers

- To raise accuracy **without touching the model**, try the contrastive decoding family first. DoLa has a ready-made option in Hugging Face and costs the least.
- Before adding a **self-reflection step**, check whether external feedback is available (tests, execution results, retrieval); it's steadier than self-reflection. Then use majority voting at equal compute as your baseline, and keep the step only if it wins.
- The **wording** of the reflection prompt changes model behavior, so retest whenever you switch models.

**Something to do tonight**: take a small task with known answers (20 questions is enough) and compare two setups: sample 4 answers and vote, versus sample 2 answers and append "check again" to each. The compute is roughly equal. Note which gets higher accuracy.

## Going deeper

- The predecessor of this lecture: 2025 [Lecture 7 on deep thinking (reasoning)](https://youtu.be/bJFtcwLSNxI) (in Chinese). The slides link matching timestamps in the workflow, ReVISE, and RL sections.
- **Further reading**: for a full treatment of reasoning models and GRPO, see [CME295 Lecture 6](/posts/ai/2026-09-29-cme295-llm-reasoning-en); for the trade-offs of sampling, voting, and test-time scaling, see [BrowseConf and test-time scaling](/posts/ai/2026-09-19-browseconf-test-time-scaling-en); to learn RL from the ground up, see the [Berkeley CS285 guide](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en).

## What this post could and couldn't verify

Verified: the text and main figures of all 65 slides (the benchmark scatter plots, RefineBench curves, CL/CS tables, the two verification plots, and the pass@k plot were read directly from slide images), the video's zh-TW captions, and the titles and uploaders of the lecture video and the related 2023/2025 recordings.

Not verified: the captions render TruthX as "True Facts"; this post follows the slides. Lee mentions a paper showing models critique no better than they generate but says he forgot to put it on the slides, and I couldn't identify it, so there's no link. MTI's 62%→72% and the model names used in RefineBench come from Lee's narration; I didn't check the numbers against the original papers.

Series navigation: Previous [HW5: Finetuning without Forgetting](/posts/ai/2026-09-30-ntu-ml2026-hw5-finetuning-without-forgetting-en) | Next [HW6: Model Editing](/posts/ai/2026-09-30-ntu-ml2026-hw6-model-editing-en) | [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [NTU Hung-yi Lee, Machine Learning 2026 Spring course page](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)
- [Self-Correction.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/Self-Correction.pdf)
- [Video: AI 能自我修正嗎？從 decoding、workflow 到 reasoning 的技術發展整理 (in Chinese)](https://youtu.be/m3i2mk5hs8U)
- [Machine Learning in the Era of Generative AI (2025), Lecture 7: Reasoning (in Chinese)](https://youtu.be/bJFtcwLSNxI)
- [ChatGPT can reflect on itself! (2023, in Chinese)](https://youtu.be/m7dUFlX-yQI)
- [The Internal State of an LLM Knows When It's Lying (arXiv 2304.13734)](https://arxiv.org/abs/2304.13734)
- [TruthX: Alleviating Hallucinations by Editing Large Language Models in Truthful Space (arXiv 2402.17811)](https://arxiv.org/abs/2402.17811)
- [Contrastive Decoding (arXiv 2210.15097)](https://arxiv.org/abs/2210.15097)
- [DoLa: Decoding by Contrasting Layers (arXiv 2309.03883)](https://arxiv.org/abs/2309.03883)
- [interpreting GPT: the logit lens (LessWrong)](https://www.lesswrong.com/posts/AcKRB8wDpdaN6v6ru/interpreting-gpt-the-logit-lens)
- [LayerCD (arXiv 2509.25177)](https://arxiv.org/abs/2509.25177)
- [Instruction Contrastive Decoding (arXiv 2311.00233)](https://arxiv.org/abs/2311.00233), [arXiv 2403.18715](https://arxiv.org/abs/2403.18715)
- [Context-aware Decoding (arXiv 2305.14739)](https://arxiv.org/abs/2305.14739)
- [Visual Contrastive Decoding (arXiv 2311.16922)](https://arxiv.org/abs/2311.16922)
- [Audio-aware Decoding (arXiv 2506.07233)](https://arxiv.org/abs/2506.07233)
- [Less is More: Improving LLM Reasoning with Minimal Test-Time Intervention (arXiv 2510.13940)](https://arxiv.org/abs/2510.13940)
- [VISTA (arXiv 2502.03628)](https://arxiv.org/abs/2502.03628), [Attention-space Contrastive Guidance (ACG, arXiv 2601.13707)](https://arxiv.org/abs/2601.13707)
- [Can LLMs Correct Themselves? A Benchmark of Self-Correction in LLMs (arXiv 2510.16062)](https://arxiv.org/pdf/2510.16062)
- [RefineBench (arXiv 2511.22173)](https://arxiv.org/pdf/2511.22173)
- [Confidence v.s. Critique: A Decomposition of Self-Correction Capability for LLMs (arXiv 2412.19513)](https://arxiv.org/pdf/2412.19513)
- [When To Solve, When To Verify (arXiv 2504.01005)](https://arxiv.org/abs/2504.01005)
- [When Do LLMs Admit Their Mistakes? Understanding The Role Of Model Belief In Retraction (arXiv 2505.16170)](https://arxiv.org/pdf/2505.16170)
- [ReVISE: Learning to Refine at Test-Time via Intrinsic Self-Verification (arXiv 2502.14565)](https://arxiv.org/pdf/2502.14565)
- [Training Language Models to Self-Correct via Reinforcement Learning (arXiv 2409.12917)](https://arxiv.org/abs/2409.12917)
- [MIT News: The cost of thinking](https://news.mit.edu/2025/cost-of-thinking-1119)
- [arXiv 2502.04667](https://arxiv.org/abs/2502.04667), [arXiv 2502.08991](https://arxiv.org/abs/2502.08991), [arXiv 2502.18273](https://arxiv.org/abs/2502.18273)
- [Does Reinforcement Learning Really Incentivize Reasoning Capacity in LLMs Beyond the Base Model? (arXiv 2504.13837)](https://arxiv.org/abs/2504.13837)
- [Reasoning with Sampling: Your Base Model is Smarter Than You Think (arXiv 2510.14901)](https://arxiv.org/abs/2510.14901)
- [Reinforcement Learning with Verifiable Rewards Implicitly Incentivizes Correct Reasoning in Base LLMs (arXiv 2506.14245)](https://arxiv.org/pdf/2506.14245)
- [The Debate on RLVR Reasoning Capability Boundary (arXiv 2510.04028)](https://arxiv.org/abs/2510.04028)
