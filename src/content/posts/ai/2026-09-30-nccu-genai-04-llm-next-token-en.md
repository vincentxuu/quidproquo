---
title: "NCCU Yen-Lung Tsai Generative AI L04: LLMs Are Simpler Than You Think — Next-Word Prediction, Temperature, and Your Own Benchmark"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, course-guide, generative-ai, llm, benchmark]
lang: en
series:
  name: "Reading NCCU Yen-Lung Tsai Generative AI"
  order: 4
tldr: "L04 reduces a large language model to one sentence: look at the preceding words, score every word in the vocabulary, turn the scores into probabilities with softmax, and sample the next word. To give the model a memory of what came before, the lecture covers RNNs and then gives a first look at Transformer Q/K/V. GPT-2's 1.5 billion and GPT-3's 175 billion parameters illustrate scale; temperature and top-p explain why every answer comes out different. The second half covers running open models locally and estimating VRAM. Week 4 homework: write test prompts on a topic you know well and compare at least two LLMs."
description: "A guide to Lecture 4 of NCCU Yen-Lung Tsai's Generative AI: Text and Image Synthesis (Spring 2025, term 1132): why text generation is next-word prediction, RNN memory and its drawback, a first look at self-attention, GPT scale, softmax/temperature/top-p sampling, word embeddings and Word2Vec, open LLMs and VRAM estimates, and the Chang Gung satellite class version of the week 4 'build your own benchmark' homework."
draft: false
glossary:
  - term: "temperature"
    aliases: ["τ"]
    definition: "Divide each word's score by τ before softmax. τ > 1 flattens the probabilities (more random); τ < 1 sharpens them toward the top words (more deterministic)."
    context: "L04 uses it to explain why the same prompt gets a different answer each time."
  - term: "top-p"
    aliases: ["nucleus sampling"]
    definition: "Pick a threshold p (say 0.9), add up probabilities from the most likely word down until the sum exceeds p, keep only those words, renormalize, and sample."
    context: "L04 uses it to stop very unlikely words from being sampled; it comes from Holtzman et al., ICLR 2020."
---

> 🌏 [中文版](/posts/ai/2026-09-30-nccu-genai-04-llm-next-token)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This guide follows the Spring 2025 offering (NCCU term 1132) of Yen-Lung Tsai's "Generative AI: Text and Image Synthesis Principles and Practice" at National Chengchi University.** It is part 4 of the [Reading NCCU Yen-Lung Tsai Generative AI](/posts/ai/2026-09-30-nccu-genai-course-overview-en) series and follows [L03 GANs](/posts/ai/2026-09-30-nccu-genai-03-gan-en). The course is taught in Mandarin.

Three official sources back this post: the [Lecture 4 recording](https://www.youtube.com/watch?v=LcSTLXCJrzA) (2025-03-11, 2 h 54 min), the slide deck [GenAI04 Large Language Models](https://drive.google.com/file/d/10mfLvj8o2H4z6sHI4xGXAr7OCgWxAoR5/view) (90 pages), and the week 4 homework on the [Chang Gung satellite class page](https://yangchihyuan.github.io/courses/GenerativeAI2025). Access level: **A3**. Recordings, slides, homework prompts, and rubrics are public; grading runs through each school's platform, so outside readers can only self-assess.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=LcSTLXCJrzA
title: Lecture 04: LLMs are simpler than you think (YouTube recording, 2025-03-11) (in Mandarin)
```

Original videos: [Lecture 04: LLMs are simpler than you think (YouTube recording, 2025-03-11) (in Mandarin)](https://www.youtube.com/watch?v=LcSTLXCJrzA)

Course and recording entries:

- [Official course and recording entry](https://yangchihyuan.github.io/courses/GenerativeAI2025)

## Where this week fits

L03 dealt with image generation; L04 turns to text. Its job is to explain "why ChatGPT can talk" at a level anyone can follow: **a text-generation AI is just a simple machine that looks at the preceding words and predicts the next one.**

It also sets up L05. Q/K/V make a brief appearance here; the full linear-algebra derivation waits for [L05 Transformers, Explained](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en).

The recording has three parts. The first covers the idea behind text generation, RNNs and Transformers, and GPT scale. The second covers sampling strategies, word embeddings, open LLMs and hardware, and how to design a benchmark. The third is student lightning talks and a TA session.

## Text generation = guessing the next word

Slides 8–10 invite a guess: how is the mysterious text-generation model designed? The answer is almost anticlimactic: **look at the previous word and predict the next one.**

That immediately breaks. Train on the sentence 「今天天氣很好。」 ("The weather is nice today."), where the character 「天」 appears twice:

- f(「今」) = 「天」
- f(「天」) = 「天」
- f(「天」) = 「氣」

The same input 「天」 maps to two outputs, so this isn't a function either (the same trap as L03's creative AI). The fix is **memory**: fuse all preceding words x₁…x_{t−1} into one vector h_{t−1} and let it, together with the current word, decide the next word.

Using the machine is then simple: give it a prompt, predict the next word, append it, predict again, and keep going.

### The model actually scores every word

Computers only handle numbers, so every word the model can produce gets an ID. The model outputs **a score for every word**, then softmax turns the scores into probabilities.

The example on slides 17–18: five candidates score 1.40, 0.03, 1.71, −0.73, and 0.95; after exponentiation their shares are roughly 30%, 7%, 40%, 4%, and 19%. The model has no idea what it's doing; it just picks whatever sounds smooth next. In the slides' words, the training goal is to turn it into a "smooth-talking bluffer" that is very good at continuing a conversation.

## Two neural networks with memory: RNNs and Transformers

Slide 11 and slides 21–23 group network layouts into "3+1" kinds: DNN (fully connected), CNN (strong at images), RNN (with memory), plus the Transformer.

- **RNN (recurrent neural network)**: each layer feeds its previous output h_{t−1} back in as "earlier memory." The drawback is **recurrent computation**: word t must wait for word t−1, so nothing runs in parallel.
- **Transformer**: Google's idea was to compute the "memory" at every position at once. Each word goes through learned linear maps to produce three vectors, query, key, and value. Dot products give attention strengths, softmax normalizes them, and the output is a weighted average of the values.

This lecture stops there. The takeaway: the Transformer replaces "read one word at a time" with "compute the whole passage at once," and the computation is basically matrix multiplication. The slides joke that dividing by √d_k in the formula is "written that way to look mysterious"; the real reason comes in L05.

<details>
<summary>Computing self-attention (slides 25–28)</summary>

```
q_i = x_i W_Q,  k_j = x_j W_K,  v_j = x_j W_V     (all W are learned; Google favors row vectors, so the matrix goes on the right)
e_j = q_i · k_j                                   (attention strength)
α_1 … α_T = softmax(e_1 … e_T)
h_i = α_1 v_1 + α_2 v_2 + … + α_T v_T

In matrix form: Attention(Q, K, V) = softmax(Q Kᵀ / √d_K) V
```

</details>

## Why generative models got so good: scale

Slides 31–38 use a string of examples to show how far "just guessing the next word" goes:

- [Andrej Karpathy's 2015 post](http://karpathy.github.io/2015/05/21/rnn-effectiveness/) had RNNs produce LaTeX that looks like an algebraic geometry paper and scripts that read like Shakespeare, sparking wide interest in text generation.
- The course once trained its own *Dream of the Red Chamber* generator. Prompt it with "After the Monkey King burst out of the rock…" and it continues in the novel's voice. The slides list it at 3 million parameters.
- OpenAI's 2019 post [Better Language Models and Their Implications](https://openai.com/index/better-language-models/) stunned the world with a fabricated article about discovering unicorns. GPT-2 has **1.5 billion** parameters.
- GPT-3 has **175 billion** parameters, too large to download, available only by API. The slides do the math: GPT-3 read roughly 499 billion words, while a typical person reads about 200 million in a lifetime, so it would take 9,415 lifetimes.

That's the "large" in **large language model (LLM)**.

## Sampling temperature: why every answer is different

The output is a probability distribution, and next comes **choosing a word**. The simplest rule is to always take the top score, but in practice models **sample according to probability**.

The example on slides 46–47: three words score 4.3, 3.4, and 0.2, which softmax turns into 70%, 29%, and 1%. Two scores that looked close end up far apart in probability because softmax exponentiates. It is "winner-take-all."

**Temperature** tunes exactly this: divide the scores by τ before softmax. τ > 1 pulls the probabilities together (more random); τ < 1 pushes them apart (more predictable output).

Plain sampling still lets unlikely words through, so the model sometimes rambles. **Top-p** fixes that: choose a threshold p (say 0.9), add probabilities from the most likely word down until the sum exceeds p, keep only those top N words, renormalize, and sample. The slides note its formal name is nucleus sampling, from [Holtzman et al., ICLR 2020](https://arxiv.org/abs/1904.09751), and say the most surprising thing is how late such an intuitive method appeared.

In one sentence: text generation **computes a probability distribution P(w_i | x₁, …, x_T) from the preceding words, then uses some strategy to sample the next word from it.**

<details>
<summary>Temperature and top-p formulas (slides 49–53)</summary>

```
softmax with temperature:  p_i = e^{a_i/τ} / Σ_j e^{a_j/τ}

top-p: find the smallest N with Σ_{i=1..N} p_i > p, keep the top N words,
       p′_k = p_k / Σ_{i=1..N} p_i   (k ≤ N)
```

The slides also mention that implementations often take the log of the post-softmax probabilities and divide by τ, since log undoes the exponentiation (another softmax then gives the new probabilities).

</details>

## The input side: one-hot isn't enough, it needs "meaning"

With outputs covered, slides 57–69 return to inputs. Every word has an ID and can be one-hot encoded, but after one-hot it is still just an ID with no sense of what the word means.

We don't actually know what a "good" representation vector is, so we let the computer do **pretext tasks**: tasks it can only complete if it "understands" words, but which aren't our end goal. Once training succeeds, a hidden layer's output serves as the **word embedding**.

[Word2Vec](https://code.google.com/archive/p/word2vec/) ([Mikolov et al. 2013](https://arxiv.org/abs/1301.3781)) defines two pretext tasks:

- **CBOW**: predict the middle word from its neighbors.
- **Skip-Gram**: predict the neighbors from the middle word.

After training, similar words cluster together, and the computer seems to "really understand." The last point on the slides: **Transformers have their own embedding layer.** One-hot inputs feed into it, and it is trained along with everything else.

## Using LLMs: closed, open, and hardware

Slides 71–80 are the practical part:

- **The big four closed models**: OpenAI, Google, Anthropic, xAI (Grok).
- **Open models**: Taiwan's TAIDE and Breeze strengthen Traditional Chinese; France has Mistral. To run them on your own machine, use [LM Studio](https://lmstudio.ai/) (an interface like the closed chat apps) or [Ollama](https://ollama.com/) (a minimal terminal interface).
- **Models to consider** (slide 75, as of March 2025): Llama 3.2 3B, Llama 3.3 70B, TAIDE 7B, Breeze2 8B, Hermes 3 3B, DeepHermes 3 8B, Mistral Small 24B, Phi-4 14B, Phi-4 Mini 3.8B.
- **How much VRAM**: "70B" means 70 billion parameters. For a 4-bit quantized version, estimate about 0.5 × 70 = 35 GB. The NVIDIA cards listed: RTX 5090 32GB, RTX 4090 24GB, H100/H800 80GB. Macs use unified memory, so roughly however much RAM you have is your VRAM.
- Open models don't have to live on your machine either: [Groq](https://groq.com/) serves open models online.

That model list reflects March 2025 and will date quickly. The durable takeaway is the estimate: **parameter count × bytes per parameter.**

## Understand the principles and you'll use LLMs well

Slides 82–87 keep prompting simple: **give the model the correct information it needs, and give clear instructions** (for example, what format and style to answer in).

Then the question: does a higher benchmark score mean a better model? Standard LLM benchmarks mean something, but you may not care whether your go-to model beats another one at math problems. Tsai's advice is to **write a few standard test prompts yourself**, on a topic you know well enough to judge the answers. His own example is a set of questions about Yogācāra ("Consciousness-only") Buddhism, with the [ChatGPT](https://yenlung.me/MindOnly_GPT) and [Grok](https://yenlung.me/MindOnly_Grok) answers shared for comparison.

## This week's demo notebook

The 1132 term has **no in-class demo notebook for this lecture**. At the end of the TA session the recording introduces the instructor's GitHub and how to `git clone` it. The [AI-Demo repo](https://github.com/yenlung/AI-Demo) currently includes `在_Colab_上用_Ollama.ipynb` and `用_Ollama_打造自己的對話機器人.ipynb`, but the repo is shared across courses and still updated after the term, so this post does not treat them as this lecture's assigned examples. Ollama gets its proper hands-on treatment in [L07](/posts/ai/2026-09-30-nccu-genai-07-build-chatbot-en).

## Homework breakdown: week 4 "Build your own benchmarks" (Chang Gung satellite class version)

The prompt and rubric below come from the [Chang Gung satellite class page](https://yangchihyuan.github.io/courses/GenerativeAI2025) (in Chinese).

**The task:**

1. Build your own set of benchmark prompts (follow-up questions allowed).
2. Pick a topic you're interested in and know something about, so you can judge quality.
3. Don't quiz the LLM on facts, such as "Who are the members of IVE?"
4. Test at least two LLMs.
5. Write down what you think of each model's answers: which you prefer and why.

Submit a Colab with screenshots, or a PDF.

**Rubric:** asking the same questions as the instructor earns 1 point; GPT-level or off-topic work earns 2; comparing only one LLM earns 4; comparing two LLMs with overly simple questions earns 6 (the base score); meeting all the requirements earns 8–10. The usual shared rules apply: omitting the instructor's "fixed four import lines" costs 1 point (see [L01](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai-en)); disclose any generative-AI help with prompt screenshots; confirmed plagiarism means 0 for the assignment and 10 more points off the course total.

**The key to 8–10 points** lies on two rubric boundaries: questions can't be "overly simple," and they can't be fact quizzes. A useful test: can you write down in advance "the three points a good answer should hit"? If yes, the question works as a benchmark. If not, you probably don't know the topic well enough yourself.

## Self-check

1. Why does "predict the next word from the previous word" fail on 「今天天氣很好」? How does an RNN fix it?
2. Why can't an RNN compute in parallel? How does a Transformer compute everything at once?
3. Scores 4.3, 3.4, 0.2 give 70%, 29%, 1% under softmax. Set τ to 2: does the top word's probability go up or down?
4. What problem does top-p solve? What happens to the output as p gets smaller?
5. Roughly how many GB of VRAM does an 8B model need at 4-bit quantization?

**Something to do tonight**: paste the four lines below into a Colab and watch τ reshape the probabilities of the slides' three words. Then pick a topic you genuinely know, write three prompts, and list "three points a good answer should hit" for each. That's week 4 underway.

```python
import numpy as np
scores = np.array([4.3, 3.4, 0.2])
for tau in (1, 0.5, 2):
    p = np.exp(scores / tau); print(tau, (p / p.sum()).round(2))   # 1 → [0.7 0.29 0.01]
```

## Further reading

- The full derivation of language models and RNNs: [CS224N Lecture 4: Language Models, RNNs, and Vanishing Gradients](/posts/ai/2026-08-22-cs224n-rnn-language-models-en)
- Word2Vec's training objective: [CS224N Lecture 2: How word2vec Turns Meaning into Vectors](/posts/ai/2026-08-22-cs224n-word-vectors-en)
- Sampling and n-gram basics: [CMU 07-280 Lecture 18: N-grams](/posts/ai/2026-08-22-cmu-07280-lecture-18-ngram-sampling-en)
- Why public benchmarks go stale: [CS224N Lecture 11: Benchmarks and LLM Evaluation](/posts/ai/2026-08-22-cs224n-benchmark-evaluation-en)
- Building a language model from scratch: [Stanford CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en)

Series navigation: [Series overview](/posts/ai/2026-09-30-nccu-genai-course-overview-en) | Previous: [L03 GANs](/posts/ai/2026-09-30-nccu-genai-03-gan-en) | Next: [L05 Transformers, Explained](/posts/ai/2026-09-30-nccu-genai-05-transformers-math-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Chang Gung satellite class page: Generative AI 2025 (schedule, week 4 homework and rubric) (in Chinese)](https://yangchihyuan.github.io/courses/GenerativeAI2025)
- [Lecture 04: LLMs are simpler than you think (YouTube recording, 2025-03-11) (in Mandarin)](https://www.youtube.com/watch?v=LcSTLXCJrzA)
- [1132 Generative AI recordings playlist (in Mandarin)](https://www.youtube.com/playlist?list=PL-eaXJVCzwbukEFU2k5vu_BlUqgVLsEnv)
- [GenAI04 Large Language Models slides (Google Drive) (in Chinese)](https://drive.google.com/file/d/10mfLvj8o2H4z6sHI4xGXAr7OCgWxAoR5/view)
- [1132 slide folder entry point (yenlung.me/1132GenAI)](https://yenlung.me/1132GenAI)
- [yenlung/AI-Demo (the instructor's demo notebook repo)](https://github.com/yenlung/AI-Demo)
- [Andrej Karpathy: The Unreasonable Effectiveness of Recurrent Neural Networks (2015)](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- [OpenAI: Better Language Models and Their Implications (2019)](https://openai.com/index/better-language-models/)
- [Holtzman et al.: The Curious Case of Neural Text Degeneration (ICLR 2020)](https://arxiv.org/abs/1904.09751)
- [Mikolov et al.: Efficient Estimation of Word Representations in Vector Space (2013)](https://arxiv.org/abs/1301.3781)
- [word2vec (Google Code Archive)](https://code.google.com/archive/p/word2vec/)
