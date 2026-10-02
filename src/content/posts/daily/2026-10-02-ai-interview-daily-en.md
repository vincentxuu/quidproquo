---
title: "AI Engineer Interview Daily — 2026-10-02: Coding"
date: 2026-10-02
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's rotation is Coding. Instead of repeating the batching-scheduler and tokenizer questions from the past few weeks, today implements the parameter almost every LLM API exposes: a sampling function combining temperature, top-k, and top-p. The focus is on the numerical traps interviewers love to probe — softmax overflow without a max-subtraction, temperature=0 as division by zero, and an off-by-one in the top-p cumulative-probability cutoff."
tldr: "Today's Coding rotation goes a different direction from the batching schedulers and tokenizers covered in past weeks: implement a sample_token function that takes logits, temperature, top_k, and top_p. The core concepts are softmax's numerical stability trick (subtracting the max before exponentiating, or a large logit overflows to inf), temperature's edge case (T=0 is division by zero in the formula, and the industry convention is to fall back to greedy decoding instead of raising an exception), the standard application order (temperature reshapes the distribution first, then top-k trims to a fixed count, then top-p trims dynamically by cumulative probability), and the most common top-p bug — the cumulative-probability cutoff has to compare against the running total *before* adding the current token, not after. The practice question comes from a real AI engineering interview question bank, extended with edge cases like top_k exceeding vocabulary size and a zero-denominator renormalization."
series:
  name: "AI Engineer Interview Daily"
  order: 44
---

> 🌏 [中文版](/posts/daily/2026-10-02-ai-interview-daily)

## Today's Topic

Friday's rotation is Coding. The past few Fridays already covered batching schedulers (twice), BPE tokenizers, and a longest-match tokenizer, so today picks something almost everyone who's ever called an LLM API has set a parameter for, yet few have actually implemented by hand: what happens between raw logits and a sampled token, once temperature, top-k, and top-p all get layered together. What makes this question worth asking isn't algorithmic difficulty — it's the long list of numerical edge cases an interviewer can probe: softmax overflow, what to do when temperature is exactly zero, and a one-line mistake in the top-p cutoff that silently breaks the whole thing. This is a good fit for a technical screen's coding round, and it also prepares you for a follow-up like "do you actually know what that temperature slider in the API does under the hood" — with implementation detail, not just the term.

## Core Concepts Cheat Sheet

### Softmax numerical stability: subtract the max before exponentiating

Converting logits to probabilities means softmax — each value exponentiated, then divided by the total. Implemented literally, this breaks in practice: if any logit is large enough, `exp(logit)` can overflow straight to `inf` in floating point, and once `inf` shows up in a numerator or denominator, the whole distribution turns into `nan`, taking the sampling step down with it. The standard fix is to subtract the batch's maximum value from every logit before exponentiating — mathematically this doesn't change softmax's output at all, since multiplying numerator and denominator by the same constant cancels out, but it guarantees the largest input to `exp` is zero, so overflow becomes impossible. What interviewers want to hear is that this is a required engineering step, not an optional optimization.

### Temperature reshapes the distribution, but T=0 is division by zero in the formula

Temperature divides every logit by a temperature value before softmax: T below 1 sharpens the distribution (making the already-highest-scoring token even more likely to win), T above 1 flattens it (giving lower-scoring tokens a real shot). But T equal to zero is mathematically undefined — division by zero has no meaning. The shared industry convention treats `temperature=0` as a signal requesting greedy decoding, directly returning the highest-probability token instead of actually dividing by zero and raising an exception. This is a textbook case of "how do you turn a mathematical edge case into an explicit branch in code" — interviewers love pressing on this exact point to see whether you've actually thought through the edge case, rather than just copying the formula.

### The application order: reshape first, then trim by a fixed count, then trim by a dynamic ratio

Production LLM APIs usually stack temperature, top-k, and top-p together, in a fixed order: temperature reshapes the logit distribution first; top-k then trims it to a fixed-size candidate set (keep only the k highest-scoring tokens, discard the rest, and renormalize); top-p then trims the survivors again, dynamically, by cumulative probability (accumulate probability mass from highest to lowest, stop as soon as the running total crosses a threshold p, commonly 0.9 to 0.95). The reasoning behind this order: top-k does a coarse first pass that narrows the field and cuts the cost of what follows, while top-p then fine-tunes based on how confident the model actually is — with the same p=0.9, a confident model might keep a single token while an uncertain one might keep a dozen. That adaptiveness is why top-p, rather than a fixed top-k, is more commonly exposed as the default knob on public APIs.

### The most common top-p bug: compare the cumulative total *before* adding the token, not after

The most common bug in a top-p implementation is in how the running total gets compared to the threshold p. The correct approach: sort by probability from highest to lowest, accumulate running totals, and a token is discardable once the cumulative total *before* it was added has already reached p — equivalently, you keep the token at which the cumulative total first reaches or exceeds p, inclusive. Flip that comparison to "discard this token if the cumulative total *after* adding it exceeds p," and the last essential token gets wrongly dropped. When the model is extremely confident and a single token's probability alone exceeds p, this off-by-one can empty the candidate pool entirely, and renormalizing then divides by zero and the whole thing crashes. If an interviewer asks "where's the easiest place to get this code wrong," this is the textbook answer.

## Today's Practice Question

### The Question

Implement a function `sample_token(logits: list[float], temperature: float, top_k: int, top_p: float) -> int` that takes a model's raw logits over the full vocabulary plus the three sampling settings, and returns the index of the sampled token. It must correctly handle: `temperature == 0` (should fall back to greedy decoding), `top_k` larger than the vocabulary size, `top_p == 1.0` (should be equivalent to no top-p filtering at all), and the case where filtering by top-k/top-p leaves only one candidate — or, in theory, none. Discussion question: if this function has to run thousands of times per second in production, how would you avoid fully sorting the entire vocabulary (which can be tens to hundreds of thousands of tokens) on every single call?

**Source**: a real question from an AI engineering interview question bank (open-sourced on GitHub, originally phrased as "Implement top-k, top-p, and temperature sampling over a logits vector"), with the numerical-traps framing extended from an AI infra coding interview collection　**Difficulty**: Medium　**Round**: technical screen / ML coding round

### How to Break It Down

1. **Clarify first**: Confirm whether the input logits represent a single sequence's next-token distribution or a whole batch at once (assume single-sequence here; batching is the common follow-up extension). Confirm whether `temperature`, `top_k`, and `top_p` might all arrive at values that make a given filter a no-op (e.g. `top_k` set to the vocabulary size, `top_p` set to 1.0) — that decides whether you special-case a fast path for "this layer does nothing."
2. **Build a framework**: Follow the conventional fixed order. First check `temperature == 0` and return argmax directly (greedy); otherwise divide logits by temperature. Then apply top-k (`k = min(top_k, len(logits))` to avoid an index error), keeping only the k highest-scoring candidates. Then apply top-p on what's left: sort by score, compute softmax probabilities, accumulate, and keep a token if the cumulative total *before* it was already below the threshold. Finally, run a numerically stable softmax on the surviving candidates (subtract the max first), renormalize, and sample using a cumulative-probability lookup against a uniform random draw.
3. **Go deep on the core**: The real depth here is in separating "the formula" from "floating-point reality" — softmax needs a max-subtraction to avoid overflow, temperature=0 needs an explicit branch rather than letting a division-by-zero exception propagate, and top-p's cutoff needs to compare against the cumulative total *before* adding the current token, not after. Missing any one of these three can run fine on normal inputs and still break on a specific edge case, like the model being extremely confident about one token. For the discussion question: the production approach is usually to use a smaller fixed top-k cap first (say k=50) to shrink the field dramatically, then run top-p's sort-and-accumulate only on that much smaller subset, rather than sorting the full vocabulary. If the vocabulary is genuinely huge, an approximate top-k selection (partial sort, or an operation like `torch.topk` that only finds the top k without a full sort) cuts the cost further.
4. **Close strong**: Converge on the full pipeline — temperature reshapes the distribution, top-k trims by a fixed count, top-p trims dynamically by cumulative probability, a numerically stable softmax plus renormalization follows, and then sampling happens. Volunteer the three edge cases interviewers are most likely to probe (overflow, T=0, the top-p off-by-one), showing you've thought about how these functions actually fail at the edges, not just that you can call `torch.softmax`.

### Sample Answer (What You'd Actually Say)

> I'd split this into four stages, each one handling a specific edge case. **Stage one is temperature**: if `temperature == 0`, I return the index of the maximum logit directly as greedy decoding, since division by zero has no meaning in the formula and the industry convention treats that value as a request for deterministic output. Otherwise, I divide all logits by temperature to reshape the distribution. **Stage two is top-k**: I clamp `k` to `min(top_k, len(logits))` to avoid an error when the vocabulary is smaller than k, then keep only the k highest-scoring candidates and discard the rest.
>
> **Stage three is top-p**, which is the easiest part to get wrong. I sort the remaining candidates by score, compute softmax probabilities, accumulate from highest to lowest, and decide whether to keep a token based on whether the cumulative total *before* it was added had already reached p — not the total after adding it. Getting that direction backwards drops the last essential token, and in the extreme case leaves the candidate pool empty. **Stage four** runs a numerically stable softmax on whatever survives — subtracting the batch's max value before exponentiating, so a large logit can't overflow to inf — then renormalizes and samples by comparing a uniform random draw against the cumulative probabilities, returning the corresponding token index. For a production deployment running thousands of times a second, I'd apply a smaller fixed top-k first (say 50) to shrink the sorting range, then run top-p on that much smaller subset instead of sorting the full vocabulary every time.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Softmax numerical stability: subtract the max before exponentiating to avoid overflow | |
| Temperature=0 edge case: falls back to greedy, not an actual division by zero | |
| Clearly stated the application order (temperature → top-k → top-p → stable softmax + renormalize → sample) | |
| Top-p cumulative-probability cutoff compares against the total *before* adding the token, not after | |
| Clamped top_k when it exceeds vocabulary size, avoiding an index error | |
| Bonus: discussion answer mentioned using a smaller top-k first to avoid sorting the full vocabulary | |

## Further Reading

- [How do Top-k and Top-p Sampling work? — Outcome School](https://outcomeschool.com/blog/how-do-top-k-and-top-p-sampling-work) — A full step-by-step breakdown of top-k and top-p with ready-to-reference PyTorch code, covering today's "application order" and "top-p cutoff" sections in detail.
- [LLM Temperature, Top-P, and Top-K Explained — With Python Simulations — Machine Learning Plus](https://machinelearningplus.com/gen-ai/llm-temperature-top-p-top-k-explained) — Simulates how softmax, top-k, and top-p interact using NumPy, with code that explicitly demonstrates the max-subtraction numerical stability trick.
- [Temperature, top-k, and top-p sampling — Sebastian Raschka](https://sebastianraschka.com/faq/docs/temperature-topk-topp-sampling.html) — A formal treatment of the temperature=0 edge case, explaining why the industry treats it as greedy decoding rather than literal division by zero.

## References

- [AI Engineer Interview Questions — GitHub (open-sourced by amitshekhariitbhu)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — Original source of today's practice question, "Implement top-k, top-p, and temperature sampling over a logits vector."
- [Infra Coding Interview Questions & Answers (2026) — AI Infra Interviews](https://aiinfrainterviews.com/c/coding-systems) — Source for the "numerical traps" framing and common AI infra coding round question types.
- [How do Top-k and Top-p Sampling work? — Outcome School](https://outcomeschool.com/blog/how-do-top-k-and-top-p-sampling-work) — Source for the "application order" and "most common top-p bug" sections' technical detail and code.
- [LLM Temperature, Top-P, and Top-K Explained — With Python Simulations — Machine Learning Plus](https://machinelearningplus.com/gen-ai/llm-temperature-top-p-top-k-explained) — Source for the "softmax numerical stability" section's max-subtraction code.
- [Temperature, top-k, and top-p sampling — Sebastian Raschka](https://sebastianraschka.com/faq/docs/temperature-topk-topp-sampling.html) — Source for the "temperature reshapes the distribution" section's theoretical treatment of the T=0 edge case.
