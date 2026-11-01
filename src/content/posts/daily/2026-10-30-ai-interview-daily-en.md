---
title: "AI Engineer Interview Daily — 2026-10-30: Coding"
date: 2026-10-30
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's back to ML-flavored coding: a Mistral AI interviewer hands you raw logits and asks you to implement greedy, top-k, and top-p decoding in NumPy on the spot — the real skill being tested is how you filter and renormalize a probability distribution."
tldr: "Today's practice question comes from a Mistral AI interview, surfaced in a writeup that compiled 270 public interview reports: 'given the logits from a toy language model, implement greedy, top-k, and top-p decoding in NumPy.' The point isn't memorizing the softmax formula — it's being able to explain three specific decisions: subtracting the max before exponentiating to avoid overflow, renormalizing probabilities after either filtering step, and why top-p's candidate set size changes shape with the distribution instead of staying fixed."
series:
  name: "AI Engineer 面試日練"
  order: 72
---

> 🌏 [中文版](/posts/daily/2026-10-30-ai-interview-daily)

## Today's Focus

Friday is still Coding day, but today's variant is hand-rolling decoding strategies: an interviewer gives you a raw, unprocessed logits array and asks you to implement greedy, top-k, and top-p sampling in NumPy — no calling `torch.topk` or `scipy.special.softmax` to dodge the work. This question shows up most often at Mistral AI, because what they're actually probing is whether you understand what's happening inside the model, not whether you can call `model.generate()`.

It tests two separate skills at once: numerical stability (the softmax overflow problem) and probability-distribution manipulation (whether you remember to renormalize after filtering, and what data structure you use to find the cutoff). For an AI Engineer, this is one of the most commonly asked question types, and also one of the easiest to lose points on, because it looks like "just write a few lines of NumPy" while the real traps sit at the algorithm's edges.

## Core Concepts Cheat Sheet

```diagram
title: Three sampling paths from logits to the next token
desc: Logits first go through a numerically stable softmax, then get filtered by greedy, top-k, or top-p before renormalization and sampling, and finally converge into writing the chosen token back to the sequence.
caption: Simplified: the real implementation also has to handle the batch dimension and temperature.
---
<svg viewBox="0 0 720 480">
  <path class="dg-line" d="M360 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 108V180" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 268V300" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M456 224H520" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M264 224H200" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 348V392" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 256V392Q612 400 604 400H364" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M108 256V392Q108 400 116 400H356" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M360 400V420" marker-end="url(#arrow)"/>

  <circle class="dg-dot" cx="360" cy="28" r="6"/>

  <g>
    <rect class="dg-box" x="264" y="60" width="192" height="48" rx="6"/>
    <text class="dg-label" x="360" y="84" text-anchor="middle" dominant-baseline="central">softmax (subtract max first)</text>
  </g>

  <g>
    <path class="dg-box" d="M360 180L456 224L360 268L264 224Z"/>
    <text class="dg-label" x="360" y="214" text-anchor="middle" dominant-baseline="central">How to pick the next token?</text>
    <text class="dg-sub" x="360" y="236" text-anchor="middle" dominant-baseline="central">greedy / top-k / top-p</text>
  </g>

  <g>
    <rect class="dg-box" x="264" y="300" width="192" height="48" rx="6"/>
    <text class="dg-label" x="360" y="324" text-anchor="middle" dominant-baseline="central">greedy: argmax</text>
  </g>

  <g>
    <rect class="dg-box" x="520" y="192" width="200" height="64" rx="6"/>
    <text class="dg-label" x="620" y="214" text-anchor="middle" dominant-baseline="central">top-k filter</text>
    <text class="dg-sub" x="620" y="236" text-anchor="middle" dominant-baseline="central">renormalize, then sample</text>
  </g>

  <g>
    <rect class="dg-box" x="0" y="192" width="200" height="64" rx="6"/>
    <text class="dg-label" x="100" y="214" text-anchor="middle" dominant-baseline="central">top-p filter</text>
    <text class="dg-sub" x="100" y="236" text-anchor="middle" dominant-baseline="central">renormalize, then sample</text>
  </g>

  <circle class="dg-dot" cx="360" cy="400" r="4"/>

  <g>
    <rect class="dg-box dg-box--accent" x="264" y="420" width="192" height="48" rx="6"/>
    <text class="dg-label" x="360" y="444" text-anchor="middle" dominant-baseline="central">emit token, append to sequence</text>
  </g>

  <text class="dg-edge" x="414" y="200" text-anchor="middle" dominant-baseline="central">greedy</text>
  <text class="dg-edge" x="488" y="212" text-anchor="middle" dominant-baseline="central">top-k</text>
  <text class="dg-edge" x="232" y="212" text-anchor="middle" dominant-baseline="central">top-p</text>
</svg>
```

### Softmax numerical stability

This is the first thing interviewers watch for: exponentiating raw logits directly overflows to `inf` once the numbers get large. The standard fix is subtracting the row's (or batch's) max value before taking `exp`. Mathematically the result is unchanged, because the numerator and denominator both get multiplied by `exp(-max)` and that cancels out — but the floating-point range you're working in stays safe.

### Greedy decoding

Always pick the highest-probability token (`argmax`). It's the simplest to implement, but the output is deterministic, and a repeated opening phrase can snowball into degenerate repetition. Production systems rarely use it alone — it mostly shows up for reproducible debugging or evaluation runs.

### Top-k sampling

Sort the probabilities, keep only the top k, zero out everything else, then renormalize the survivors so they sum to 1 before sampling — skip that renormalization step and the sampled distribution is simply wrong. The weakness is that k is fixed: a very peaked distribution (the model is confident) and a very flat one (the model is unsure) both get the same candidate-set size.

### Top-p (nucleus) sampling

Sort probabilities from largest to smallest, accumulate them, and stop right after the cumulative sum crosses the threshold p. Zero out everything outside that "nucleus," renormalize, and sample. The candidate set's size adapts to the shape of the distribution automatically — it might be just 1-2 tokens when the model is confident and expand when it's uncertain. That adaptiveness is exactly why top-p has become the more common default in modern inference stacks compared to top-k.

### Sorting cost and implementation trade-offs

Top-k can use `np.argpartition` (average O(n)) to grab the top k indices without sorting the whole vocabulary; top-p in principle needs a full sort before the cumulative sum (O(n log n)). Vocabularies routinely run from tens of thousands to over a hundred thousand tokens, so that sort isn't free in a high-throughput serving system. A common optimization is to apply an approximate or pre-truncated candidate set first, then run exact top-p on the smaller set.

## Today's Practice Question

### The Question

You're given a 1D logits array from a toy language model — unnormalized scores over the next token's full vocabulary. Implement three NumPy functions: `greedy_decode(logits)`, `top_k_decode(logits, k, rng)`, and `top_p_decode(logits, p, rng)`, each returning the sampled token index. No calling PyTorch, TensorFlow, or any built-in sampling API.

**Source**: Mistral AI onsite (surfaced from a compilation of 270 public interview reports; most commonly reported at mid-level) **Difficulty**: Medium **Round**: onsite coding

### Breaking It Down

1. **Clarify first**: Is the input a single 1D array, or do you need to handle a batch? Is temperature applied before or inside this function? What about edge values for `k` and `p` (`k` larger than the vocabulary, `p` close to 0 or 1)? Interviewers usually say "write the single-sequence version first, batch support is a bonus."
2. **Build the framework**: All three strategies share the same preprocessing step — `softmax(logits)` with max-subtraction. The only differences are whether you filter the candidate set before sampling, and whether you renormalize after filtering. Factor that shared step into one helper function all three decode functions call.
3. **Get into the core logic**: For top-k, use `np.argpartition` to find the top-k indices without sorting the full array, zero out everything else, then renormalize. For top-p, sort first, take the cumulative sum with `np.cumsum`, and use `np.searchsorted` or a boolean mask to find the cutoff point right after crossing p — same zero-out-and-renormalize pattern. The biggest trap is sampling directly from the filtered-but-not-renormalized probabilities with `np.random.choice`, which samples from the wrong distribution.
4. **Close strong**: Proactively raise an edge case — `p` set so small the candidate set could shrink to zero, or `k` larger than the vocabulary size should degrade gracefully to sampling from the full distribution — and explain how you'd test correctness, e.g. running a known distribution through the sampler many times and checking the sampled frequencies converge to the theoretical probabilities.

### Sample Answer (how to actually say this in the interview)

> **I'd start with the shared piece**: I'd write a `_softmax(logits)` helper that does `logits - logits.max()` before taking `exp`, to avoid overflow on large logits. All three decode functions call this one helper, so numerical stability only needs to be written and tested once.
>
> **Greedy is the simplest**: just `np.argmax(logits)` — you don't even need softmax first, since argmax is invariant under the monotonic softmax transform, so skipping it saves an unnecessary computation.
>
> **For top-k, I'd use `np.argpartition(probs, -k)[-k:]` to get the top-k indices instead of sorting the whole vocabulary** — the vocabulary can have tens of thousands of tokens, and a full sort is O(n log n) while argpartition averages O(n). Once I have those k indices, I build a same-shaped array initialized to zero, fill in the original probabilities only at those k positions, divide by their sum to renormalize, and sample from that normalized distribution with `np.random.choice`. **Top-p follows the same pattern but the filter condition isn't a fixed count**: sort probabilities descending, compute the cumulative sum with `np.cumsum`, find the first index where the cumulative sum exceeds p, and treat that as the cutoff — everything past it gets zeroed, renormalized, and sampled. I'd specifically test a very small p, like 0.01, to make sure at least one token always survives — otherwise you can end up sampling from an empty set and crashing.

### Self-Check Checklist

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---------|---------|
| Mentioned subtracting the max before softmax, and explained why it doesn't change the result | |
| Said explicitly that top-k/top-p both need renormalization after filtering, before sampling | |
| Used argpartition instead of a full sort for top-k, and named the complexity difference | |
| Noted that top-p's candidate set size adapts to the distribution instead of staying fixed | |
| Raised at least one edge case (p too small, k larger than the vocabulary) and how to handle it | |
| Bonus: mentioned how to test sampling correctness (large-sample frequency convergence to theoretical probabilities) | |

## Further Reading

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — 270 public interview reports organized by company; today's question and the observation that "Mistral loves asking about what's happening inside the model" both come from here
- [Implement a Byte-Pair Encoding Tokenizer](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-tokenizer-threshold-training-encode-and-decode) — another real onsite question in the same "hand-roll a tokenizer/decoder" family, with a full list of clarifying questions to settle ambiguity; a good follow-up after today's problem
- [LLM top_p and top_k sampling explained](https://www.krishnaik.in/ai-tutorials/llm-fundamentals/top-p) — an interactive walkthrough of the top_p/top_k filtering logic, useful for checking your implementation's understanding against today's code

## References

- [What OpenAI, Anthropic, Mistral and Meta actually ask in AI engineer interviews](https://dev.to/adityajha2005/what-openai-anthropic-mistral-and-meta-actually-ask-in-ai-engineer-interviews-2adk) — original source for today's practice question, "implement greedy, top-k, and top-p decoding in NumPy given logits" (Mistral AI onsite)
- [Implement a Byte-Pair Encoding Tokenizer](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-tokenizer-threshold-training-encode-and-decode) — supporting source for the claim that hand-rolled decoding/tokenizer questions commonly test edge cases
- [GitHub: ai-engineering-interview-questions](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — "implement top-k, top-p, and temperature sampling" recurs as a question pattern across a public question bank, corroborating that today's question isn't one interviewer's idiosyncratic pick
