---
title: "How to Read a Model's Report Card: Benchmarks, Arena Rankings, and the Traps Behind the Numbers"
date: 2026-08-26
category: ai
type: deep-dive
tags: [benchmark, evaluation, mmlu, chatbot-arena, llm-evaluation, ai-model, perplexity]
lang: en
series:
  name: "認識 AI 模型"
  order: 10
tldr: "Benchmark scores in model releases have three common traps: cherry-picking (only showing wins), contamination (test data leaking into training), and saturation (when everyone scores 90%+, the benchmark stops being useful). Arena (formerly Chatbot Arena) runs blind human votes on questions that are hard to memorize in advance, but it has its own bias: labs can test many variants privately and publish only the best one."
description: "LLM evaluation primer: what MMLU, HumanEval, and GSM8K each test, what Arena's human-vote rankings add and where they are biased, and three traps to watch for when reading benchmark tables."
draft: false
glossary:
  - term: "MMLU"
    def: "Massive Multitask Language Understanding — a 57-subject multiple-choice benchmark measuring broad knowledge"
  - term: "Chatbot Arena"
    def: "An anonymous model battle platform where real humans vote blindly and a Bradley-Terry model turns the votes into scores and ranks. It began as the LMSYS research project at UC Berkeley, has been run by Arena Intelligence since 2025, and was renamed Arena in 2026"
---

> :globe: [中文版](/posts/ai/2026-08-26-understanding-ai-models-evaluation)

Every time a new model drops, you see the same thing: a table full of abbreviations in rows and columns, percentage numbers in every cell, and the best scores in bold. "We hit 90.2% on MMLU!" "95.1% on GSM8K!"

But what are these numbers actually saying? Should you believe them?

## Why Tests Exist

You use ChatGPT to write some code. Feels good. You use Claude for the same task. Also feels good. Which one is better?

"Feeling" doesn't scale. You probably only tried one task, and your judgment is swayed by all sorts of biases — well-formatted answers look smarter, and whichever you tried first becomes the baseline.

Benchmarks exist to solve this problem: **use standardized questions so different models take the same exam, producing comparable scores**. Like college entrance exams — imperfect, but at least everyone takes the same test.

## Three Levels of Evaluation

Model evaluation falls into roughly three tiers, each serving a different purpose.

### 1. Perplexity: The Model's Internal Score

In [part 4](/posts/ai/2026-08-26-understanding-ai-models-loss-function-en) on loss functions, we introduced perplexity. It measures how "confused" a model is when predicting the next token — a perplexity of 10 means the model is, on average, hesitating among 10 choices.

The upside of perplexity: you don't need a separate test set; any text will do. But it has a fundamental limitation: **it only tells you how well the model predicts text, not whether it can solve math, write code, or answer history questions**. A model with very low perplexity might simply be great at predicting common sentence patterns while still failing at reasoning tasks.

So the industry needs more specific exams.

### 2. Benchmarks: Standardized Tests

These are what you see most often on model release pages. Each benchmark is designed to test a specific capability:

| Benchmark | What It Tests | Format |
|-----------|--------------|--------|
| **MMLU** | Broad knowledge (57 subjects) | 4-choice multiple choice |
| **HellaSwag** | Common-sense reasoning | Sentence completion choices |
| **ARC** | Science reasoning (elementary to middle school) | Multiple choice |
| **GSM8K** | Math word problems (grade school level) | Generate answer |
| **HumanEval** | Code generation (Python) | Write a function that passes tests |
| **MATH** | High school to college math | Generate answer |

Each benchmark has its niche. MMLU is a general knowledge exam testing how much the model knows; GSM8K tests whether it can work through math step by step; HumanEval tests whether the code it writes actually runs.

Scores are typically accuracy — questions answered correctly divided by total questions. Higher is better.

### 3. Human Preference: Real Humans, Blind Voting

Benchmarks have a fundamental problem: they test for "correct answers," but many real-world tasks don't have one. Ask a model to "write an apology email" — which version is better? There's no multiple-choice rubric for that.

**[Arena](https://arena.ai)** (formerly Chatbot Arena; it began as the LMSYS research project at UC Berkeley and is now run by the company Arena Intelligence) uses a simple approach: let real humans judge. A user enters a question, the system sends it to two anonymous models simultaneously, and the user votes for the better response. The user doesn't know which models they're talking to.

With enough votes, the platform fits a Bradley-Terry model (it used chess-style Elo early on, and the scores are still often called Elo) to compute each model's score and confidence interval. **A higher score means voters picked that model's answers more often**.

The biggest advantage: **the questions aren't in the labs' hands**. Traditional benchmarks have fixed, public questions, so labs can optimize for them or even accidentally include them in training data. Arena questions come from users worldwide, change daily, and can't be memorized in advance.

But Arena has its own biases. First, labs can test many variants privately before a release and publish only the one with the best score: [The Leaderboard Illusion](https://arxiv.org/abs/2504.20879) counted as many as 27 Meta models being tested privately on the platform in the month before Llama 4's release. Picking the highest of several noisy scores is biased upward in expectation. Arena's [response](https://arena.ai/blog/our-response) was that every lab is allowed to test this way; the platform later added a "preliminary" tag to anonymously tested models until enough fresh votes arrive after public release ([changelog](https://arena.ai/company/leaderboard-changelog)), but it did not stop labs from publishing only the best variant.

Second, human votes are swayed by response style — longer answers tend to win — and the platform now shows [style-controlled](https://arena.ai/blog/style-control) scores by default.

So Arena measures "which model real people pick more often on everyday questions." It covers what benchmarks miss, but like any score, you need to know how it was computed before you compare with it.

## How to Read a Benchmark Table

So you open a model release blog post and see a table. Rows are models, columns are benchmarks, cells are scores. Looks objective. But watch out for three traps.

### Trap 1: Cherry-Picking (Only Showing Wins)

Every model has strengths and weaknesses. Publishers choose to display the benchmarks where their scores are highest and skip the rest.

Say Model A beats Model B on MMLU but loses on HumanEval. Model A's release page will only show the MMLU comparison — the HumanEval column simply disappears.

**How to spot it**: Look at which benchmarks are included. If a commonly reported benchmark is conspicuously absent, ask yourself: is it because it's irrelevant, or because the score was unflattering?

### Trap 2: Contamination (Test Data in Training Data)

This is the most serious issue. Training data is typically scraped from the internet at massive scale. If benchmark questions appear in the training data, the model has effectively seen the exam before taking it — high scores, but no guarantee of actual understanding.

Real example: researchers found that certain models scored very high on MMLU, but when the answer option order was shuffled, accuracy plummeted. This strongly suggests the model memorized answer positions rather than actually understanding the questions.

**How to spot it**: If a model's score on one benchmark is far above other models of similar size, but it doesn't show the same advantage on functionally similar benchmarks, contamination is worth suspecting.

### Trap 3: Saturation (The Test Is Too Easy)

When most models score above 90% on a benchmark, that benchmark loses its ability to differentiate. It's like an exam where everyone scores 95% — you can't tell who's actually better.

HellaSwag is a textbook example. A few years ago it was a key differentiator, but now mainstream models nearly all exceed 95%, with differences reduced to decimal-point noise.

**How to spot it**: If a column in the table shows all numbers squeezed between 90% and 98%, those numbers can be largely ignored.

## Practical Advice

1. **Don't pick a model by one benchmark**. Each benchmark tests a different capability. The benchmark closest to your use case is the one worth paying attention to. Writing code? Look at HumanEval. Building a general Q&A system? Look at MMLU.

2. **Treat Arena as a cross-check on benchmarks, not a referee**. Its questions come from real people and refresh continuously, so they are the hardest to memorize in advance. Use it to check whether a model that scores well on benchmarks is also preferred in use. When reading ranks, check whether the confidence intervals overlap, and watch for the "preliminary" tag on newly listed models.

3. **Your own eval matters most**. Benchmarks tell you about a model's general capabilities, but your application has its own specific needs. Invest time in building your own test suite with your own data, your own tasks — that's far more useful than staring at public benchmark tables.

4. **Mind the timestamps**. Benchmark scores inflate over time — new training techniques, larger datasets, even contamination all push scores up. Scores from different months or years can't be directly compared.

## Next Up

Now we know how to evaluate models. But so far, every model we've discussed was trained once and then deployed. In practice, there's one more critical step: [fine-tuning](/posts/ai/2026-08-26-understanding-ai-models-finetuning-vs-rag-en) — taking a pre-trained model and adjusting it with specific data so it specializes in a particular domain.

## Update Log

- 2026-11-24: Rewrote the Arena section and practical advice #2. The platform is now called Arena and run by a company, and corrected the scoring method to a Bradley-Terry model; removed the "most manipulation-resistant" claim and added private best-of-N testing and style bias. Updated the title, tldr, description, and glossary to match, and added the corresponding references. For a deeper treatment, see the [Understanding AI Benchmarks series](/posts/ai/2026-11-24-understanding-benchmarks-overview-en).

## References

- Hendrycks, D. et al. (2021). [Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300). ICLR 2021.
- Zellers, R. et al. (2019). [HellaSwag: Can a Machine Really Finish Your Sentence?](https://arxiv.org/abs/1905.07830) ACL 2019.
- Cobbe, K. et al. (2021). [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168). arXiv:2110.14168.
- Chen, M. et al. (2021). [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374). arXiv:2107.03374.
- Chiang, W. et al. (2024). [Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference](https://arxiv.org/abs/2403.04132). arXiv:2403.04132.
- Singh, S. et al. (2025). [The Leaderboard Illusion](https://arxiv.org/abs/2504.20879). arXiv:2504.20879.
- Arena. (2025). [Our Response to 'The Leaderboard Illusion' Writeup](https://arena.ai/blog/our-response).
- Arena. (2024). [Does Style Matter? Disentangling style and substance in Chatbot Arena](https://arena.ai/blog/style-control).
- Arena. (2026). [LMArena is now Arena](https://arena.ai/blog/lmarena-is-now-arena).
- Arena. [Leaderboard Changelog](https://arena.ai/company/leaderboard-changelog).
- Oren, Y. et al. (2024). [Proving Test Set Contamination in Black-Box Language Models](https://arxiv.org/abs/2310.17623). ICLR 2024.
