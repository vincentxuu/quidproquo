---
title: "Paper Reading Interview Guide: How to Read, Discuss, and a Must-Read List"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, paper-reading, research]
lang: en
type: deep-dive
description: "Breaking down the AI Engineer paper reading interview — how to quickly understand a paper, how to discuss it in interviews, and a must-read paper list."
tldr: "Paper reading interviews don't test whether you've read that specific paper — they test whether you can quickly understand a new method and identify its limitations. AI-native companies (Anthropic, OpenAI) particularly favor this format. Strategy: practice reading a paper in 30 minutes and verbally stating contribution + limitation, build your own must-read list, and practice summarizing each paper in three sentences."
series:
  name: "AI Engineer Interview Prep"
  order: 8
---

## How Paper Reading Interviews Work

Paper reading is the most distinctive round in AI-native company interviews. Big tech usually doesn't test this, but companies like Anthropic, OpenAI, Cohere, and DeepMind treat it as a core evaluation because they need people who can not only use existing tools but understand and evaluate cutting-edge methods.

Three common formats:

**Read a new paper on the spot.** The interviewer gives you a paper you likely haven't read (usually published in the last few months), gives you 20-30 minutes to read, then spends 20-30 minutes discussing. This tests your reading speed, ability to extract key points, and whether you can quickly build intuition in unfamiliar territory.

**Discuss a paper you've read.** The interviewer asks you to pick a paper you've recently read and found interesting. This tests your taste — why you think it's important, how you understand its contribution, whether you have your own perspective.

**Deep-dive on a specific paper.** The interviewer names a classic paper (e.g., Attention Is All You Need or DPO) and asks detailed questions. This tests the depth of your understanding of core literature.

Common requirement across all three: you need to restate the method in your own words, identify limitations, and propose improvements. Parroting the abstract isn't enough.

## The 30-Minute Reading Method

When you receive a new paper in an interview, you don't have time to read cover to cover. Here's a proven reading order:

**First 5 minutes: Build the big picture.** Read the abstract (what problem, what method, what results), then jump to figures and tables — a good paper's architecture diagrams and results tables usually tell 80% of the story. Pay special attention to Figure 1 (usually the method overview) and the last table (usually the main experimental results).

**Middle 15 minutes: Understand the method.** Read the method section, focusing on "how does this differ from prior work." Don't try to understand every mathematical formula — understanding intuition matters more than deriving details. If you encounter unfamiliar symbols or concepts, mark and skip; don't get stuck.

**Last 10 minutes: Evaluate results and limitations.** Read the experiments section, focusing on: which baselines were chosen (are important comparisons missing?), which benchmarks were used (do datasets represent real scenarios?), the magnitude of improvement (statistically significant or within noise?). Finally, scan the conclusion and limitations sections to confirm what the authors themselves acknowledge.

**After reading, answer three questions mentally:** What's the core contribution (one sentence)? How is it better than prior methods (specific numbers or qualitative differences)? What are obvious limitations or concerns?

## How to Discuss Papers in Interviews

When an interviewer asks "tell me about this paper," use this four-part structure:

**Contribution (one sentence).** What did this paper do? State the core idea as concisely as possible. Example: "DPO simplified RLHF's three steps (reward model → PPO → fine-tune) into one — directly using preference data for supervised learning, without training a reward model."

**Method (two or three sentences).** How? Focus on intuition, not formulas. If the interviewer wants math, they'll follow up. Example: "It substitutes the reward model's optimal solution back into the RL objective function, deriving a closed-form loss that only needs the log probability difference between preferred and dispreferred responses."

**Limitation (one or two sentences).** What's the problem? This is what interviewers most want to hear — if you only discuss strengths, they'll think you lack critical thinking. Example: "DPO assumes preference data quality is high and preferences within each pair are consistent. If annotator disagreement is large, DPO's performance degrades faster than PPO-based RLHF because it has no reward model as a buffer."

**Extension (optional but earns points).** How would you improve or extend it? This demonstrates research intuition. Example: "One possible direction is introducing confidence weights — pairs with unanimous annotator agreement get high weights, those with disagreement get low weights, hedging against data quality issues."

## Critical Thinking: How to Find Paper Weaknesses

When an interviewer probes "what issues do you see," approach from these angles:

**Experimental design.** Are baselines sufficient? Many papers choose weak baselines to make their numbers look good. If a 2026 paper uses 2023 methods as baselines, you can raise this concern. Also, are ablation studies thorough — if the method has three improvements but only an overall comparison, you don't know which improvement actually works.

**Dataset selection.** Do benchmarks represent real scenarios? Many papers only test on academic benchmarks (MMLU, GSM8K), but the gap between these and production environments can be large. If a paper claims production applicability but only tests on academic datasets, that's a fair challenge.

**Generalizability.** Can results transfer to other model sizes, languages, or domains? Many methods work under specific settings but fail when changed. If a paper only tests on a 7B model, you can ask whether the method would still work on 70B or larger.

**Computational cost.** Does the paper report training and inference costs? Some methods improve by 2% but increase computation by 10x, making them completely impractical in production. This is an engineering perspective critique that interviewers especially appreciate.

**Reproducibility.** Is code open-sourced? Are hyperparameters fully listed? If results are highly dependent on specific hyperparameter settings without reporting the search range, that's a red flag.

## Must-Read Paper List

Organized by topic, 2-3 core papers each. Before interviews, be able to summarize each in three sentences (contribution + method + limitation).

### Transformer and Attention Mechanisms

- **Attention Is All You Need** (Vaswani et al., 2017) — The origin of Transformers; you must be able to explain the self-attention computation flow and why it replaced RNNs
- **FlashAttention** (Dao et al., 2022) — IO-aware attention computation; the core answer when asked "how to make Transformers faster"

### Alignment and RLHF

- **Training language models to follow instructions with human feedback** (Ouyang et al., 2022) — InstructGPT, the classic RLHF implementation
- **Direct Preference Optimization** (Rafailov et al., 2023) — DPO; understand why it can replace PPO and when it can't

### RAG and Retrieval Augmentation

- **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** (Lewis et al., 2020) — The foundational RAG paper
- **Lost in the Middle** (Liu et al., 2023) — How information position in long context affects model performance; frequently tested

### Scaling Laws

- **Scaling Laws for Neural Language Models** (Kaplan et al., 2020) — The relationship between model size, data volume, and compute
- **Chinchilla** (Hoffmann et al., 2022) — Corrected the scaling law's data volume estimates, introducing compute-optimal training

### Agent Systems

- **ReAct** (Yao et al., 2022) — The reasoning + acting agent framework; foundational when discussing agent architecture
- **Toolformer** (Schick et al., 2023) — Models autonomously learning to use tools

This isn't a comprehensive literature review — it's a minimum viable reading list for interview preparation. If you have extra time, prioritize directions most relevant to your target company.

## Interview Tips

**Admitting you don't know beats making things up.** If the interviewer asks about a paper you haven't read, say directly: "I haven't read this one, but based on the title and your description, I'd guess it's doing X. I've read a related paper Y, which approaches it by..." This is infinitely better than pretending you've read it and getting exposed under follow-up questions.

**Prepare your own "favorite papers."** Many interviews ask "what interesting paper have you read recently?" Prepare 2-3 papers you genuinely understand and have your own perspective on. The selection criterion isn't fame — it's whether you can articulate contribution + limitation + your extension ideas.

**Practice verbal summaries.** Reading comprehension and verbal articulation are different skills. Many people understand but can't explain clearly. Practice method: after reading a paper, without looking at it, spend 5 minutes explaining it to a mirror or recording, then compare against the original to see what you missed.

**Don't memorize — understand context.** Interviewers can instantly tell if you're reciting a summary versus truly understanding. The best preparation isn't reading papers in isolation but understanding the evolutionary relationships — why DPO came after InstructGPT, what problem FlashAttention solved in the original Transformer, how Chinchilla corrected Kaplan's scaling laws.

## Practice Question

### Question

"Here's the FlashAttention paper. You have 30 minutes to read it, then we'll discuss. Tell me what problem it solves, what the core insight of the method is, and what you think its limitations are."

**Source**: Anthropic / OpenAI interview (typical format)　**Difficulty**: Advanced　**Round**: onsite paper discussion

### Approach

1. **Clarify the problem**: Confirm what depth the interviewer expects — high-level intuition or deep IO-aware algorithm details? Any specific angle they want to hear (e.g., applicability in their inference stack)?
2. **Build the framework**: Use the contribution → method → limitation → extension four-part structure.
3. **Go deep on the core**: Don't just say "it's faster." The core insight is **shifting the attention bottleneck from computation to memory IO** — standard attention's O(n^2) isn't slow because of computation, but because of data movement between HBM and SRAM. FlashAttention uses tiling to keep intermediate results in SRAM, avoiding HBM round-trips.
4. **Wrap up**: Proactively raise limitations and your extension ideas to demonstrate critical thinking.

### Sample Answer (How to say it in an interview)

> **Problem and contribution.** Standard Transformer self-attention has O(n^2) time and space complexity. Most prior work (Linformer, Performer) tried to reduce complexity to O(n) using approximations, sacrificing model quality. FlashAttention takes a different path — it doesn't change the attention math, but changes how the computation is performed, making exact attention run faster and use less memory on GPUs.
>
> **Core method.** The key insight is that the GPU bottleneck isn't in computation (FLOPs are cheap) but in data movement between HBM and SRAM. Standard implementation writes the n×n attention matrix to HBM then reads it back. FlashAttention uses a tiling technique to split Q, K, V into small blocks, computing softmax in SRAM (using online softmax to avoid needing the global max), without writing the intermediate attention matrix back to HBM. This yields two benefits: wall-clock time is 2-4x faster due to reduced IO, and memory usage drops from O(n^2) to O(n).
>
> **Limitations and extensions.** I see several limitations: first, it's highly dependent on GPU architecture's SRAM size — changing hardware may require retuning tile sizes; second, custom CUDA kernels increase engineering maintenance costs; third, FlashAttention 2's paper acknowledges efficiency drops when the head dimension isn't a power of 2. For extensions, I'm curious whether FlashAttention's tiling strategy could generalize to other operations with similar IO bottlenecks, such as cross-attention or sparse attention patterns.

### Self-Check Checklist

| Checkpoint | Mentioned? |
|-----------|-----------|
| Problem definition: standard attention's O(n^2) bottleneck | |
| Difference from prior methods (exact vs approximate) | |
| Core insight: IO-aware (HBM vs SRAM) | |
| Method: tiling + online softmax | |
| Specific results: 2-4x speedup + O(n) memory | |
| Limitation: at least one substantive observation | |
| Bonus: extension ideas or connection to your own work | |

## References

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — Original Transformer paper, the origin of the self-attention mechanism
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) — DPO paper, the core reference in the discussion example
- [How to Read a Paper](https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf) — Keshav's classic three-pass reading method, the foundation for this article's 30-minute reading approach
