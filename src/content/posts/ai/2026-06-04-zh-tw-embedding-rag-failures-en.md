---
title: "A More Expensive Embedding Won't Save Your Traditional Chinese RAG: Three Layers of Failure and the Fix Order"
date: 2026-06-04
category: ai
type: deep-dive
tags: [rag, embedding, traditional-chinese, retrieval, llm]
lang: en
tldr: "Traditional Chinese RAG retrieval failures are a three-layer stack: embedding granularity defects (BGE/GTE from 0.1B to 7B all mis-rank on simple queries like 'fried chicken'), Simplified Chinese / English corpus dominance causing local vocabulary drift ('premium', 'exclusion clause' alignment is unreliable), and MTEB Chinese benchmarks being Simplified Chinese making model selection signals misleading. The fix is architectural: OpenCC normalization -> hybrid + jieba segmentation -> reranker -> local fine-tuning last -- and the prerequisite for all of it is building a Traditional Chinese eval set first."
description: "A systematic breakdown of embedding failure modes in Traditional Chinese RAG and low-resource retrieval strategies: CapRetrieval's granularity defect evidence, cross-lingual alignment issues with local zh-TW vocabulary, ihower's Traditional Chinese benchmark findings, and six engineering remedies ordered by ROI along with evaluation methodology."
draft: false
glossary:
  - term: "CapRetrieval"
    definition: "A fine-grained Chinese retrieval benchmark proposed by WeChat AI (arXiv:2506.08592), empirically demonstrating that encoders struggle between 'aligning overall passage semantics' and 'highlighting fine-grained entities' -- scaling up the model doesn't help."
    context: "Used in this article to demonstrate the first layer of Traditional Chinese RAG retrieval failure: embedding granularity defects."
---

> 🌏 [中文版](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)

When Traditional Chinese RAG retrieval goes wrong, the most common reaction is "switch to a bigger, more expensive embedding model." But the evidence says this almost never works: CapRetrieval (arXiv:2506.08592) tested the BGE and GTE families **from 0.1B to 7B** -- all top-tier models on the MTEB Chinese leaderboard -- and found that for simple queries like "fried chicken" or "purple flowers," they still rank less relevant passages above more relevant ones. The paper states plainly that this phenomenon is "universal regardless of training sources and model sizes."

Traditional Chinese retrieval failure is not a single problem -- it is three layers stacked on top of each other. This article breaks down each layer, provides a remediation checklist ordered by ROI, and establishes the prerequisite for everything: build a Traditional Chinese eval set first.

## Layer 1: Inherent Embedding Defects (Universal Across Models)

Bi-encoders compress entire passage semantics into a single fixed vector, inevitably losing information -- and what gets lost is often **the discriminative power for fine-grained entities and events**. This is not a Chinese-specific problem (the on-site article [Semantic Similarity is Not Retrieval Relevance](/posts/ai/2026-06-04-semantic-similarity-retrieval-relevance-gap) covers the full picture), but CapRetrieval proved with a Chinese evaluation set that it holds equally in Chinese scenarios, and that **scaling up the model doesn't fix it**.

Additional universal issues compound the problem: chunks lose context ("it grew by 40%" lacks a subject and timeframe, making the vector meaningless -- see [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) for the solution), and domain OOV terms (general-purpose embeddings fail to capture specialized semantic nuances).

## Layer 2: Simplified Chinese / English Corpus Dominance, Traditional Chinese Representation Drift

The training data for multilingual embeddings (E5, BGE, GTE multilingual variants) is predominantly English or Simplified Chinese. Traditional and Simplified Chinese **differ not just in character forms but also in institutional vocabulary and phrasing**: terms like "premium" (bao fei), "exclusion clause" (bu bao shi xiang), and "net profit" (jing li) -- financial and legal terminology specific to Taiwan and Hong Kong -- are unreliably aligned in encoders trained on Simplified Chinese and general corpora. The consequence: **"the most important documents systematically fail at retrieval"** (a consistent finding from AICUP Traditional Chinese financial CLIR research and enterprise practice reports).

For local enterprise knowledge bases (government documents, insurance policies, compliance documents, product terminology), this failure mode hits precisely the most critical content.

Another hidden pitfall: Simplified-Traditional conversion is asymmetric. OpenCC's Traditional-to-Simplified is many-to-one and safe; **Simplified-to-Traditional has one-to-many ambiguities**, and named entities are easily mis-converted. Think carefully about the direction when doing script normalization.

## Layer 3: Benchmarks Lack Traditional Chinese, Model Selection Signals Are Misleading

The Chinese portion of MTEB (C-MTEB, 35 datasets) **is Simplified Chinese, and the leaderboard is dominated by Mainland Chinese models**. Using MTEB scores to select an embedding model is equivalent to using Simplified Chinese as a proxy for Traditional Chinese -- a high score doesn't mean it works well in Traditional Chinese scenarios.

The most direct comparison in the Traditional Chinese community is [ihower's Traditional Chinese embedding benchmark](https://ihower.tw/blog/12167): using TCEval-v2's Delta DRCD data (1,000 passages, 3,493 questions), calculating Hit Rate and MRR per question. Two verifiable conclusions: **OpenAI's embedding is not the strongest for Traditional Chinese** (despite being the community's default recommendation), and the best performers are **voyage-multilingual-2** and **multilingual-e5-large** -- multilingual models (see the original post and its comment section for exact numbers). Reports also exist showing Qwen3-Embedding outperforming BGE-M3 on CMTEB -- but CMTEB is Simplified Chinese, so you need to validate in Traditional Chinese scenarios yourself.

## Remediation: Six Strategies Ordered by ROI

The fix is **architectural**, not about swapping models:

| # | Strategy | What to Do | Cost |
|---|---|---|---|
| 1 | Script normalization | Normalize both index and query with OpenCC to unify character forms, eliminating Simplified-Traditional mismatch (watch out for one-to-many in Simplified-to-Traditional) | Low |
| 2 | Hybrid (BM25 + dense) + RRF | Compensate for dense retrieval's weakness with exact keywords and entities -- precisely Layer 1's blind spot | Low |
| 3 | zh-TW BM25 with word segmentation | OpenCC then jieba segmentation before BM25, outperforms character-level (single-source practice report, but reasonable) | Low |
| 4 | Reranker (two-stage) | Expand top-k then re-rank with cross-encoder to select top N; the Taiwan community's testing shows "nearly all embeddings improve after reranking," with bge-reranker-v2-m3 as the top pick | Medium (latency) |
| 5 | BGE-M3 single-model hybrid | One model outputs dense + sparse + multi-vector simultaneously, with native support for Traditional/Simplified Chinese and English, eliminating the need to maintain two separate indexes | Medium |
| 6 | Local fine-tuning | Contrastive fine-tuning with your own Traditional Chinese corpus | High, do last |

Strategies 1-3 require no model change and offer low cost with high returns; for details on hybrid search and reranking, see the on-site articles [hybrid search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf), [cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking), and [BGE-M3 model selection](/posts/ai/2026-03-12-bge-m3-embedding-model-selection).

Strategy 6 deserves extra mention: low-resource retrieval research provides a pragmatic path -- **use LLMs to synthesize triplet data for contrastive fine-tuning**. CapRetrieval showed that after augmenting with LLM-generated data, **a self-trained 0.1B encoder surpassed a 7B baseline**; another paper (arXiv:2603.22290) demonstrated that mE5 fine-tuned with **only 10k noisy synthetic pairs** was already effective. Traditional Chinese relative to Simplified Chinese is "moderately low-resource" (character-level resources are sufficient; high-quality annotated retrieval data is scarce), and these general findings transfer directly -- small models after fine-tuning often outperform large models at zero-shot.

## Prerequisite: Build a Traditional Chinese Eval Set First

The effectiveness of every strategy above cannot be verified without a Traditional Chinese evaluation set:

1. **Data**: Start by replicating ihower's approach using TCEval-v2 / DRCD; even better, build an internal eval set from your own knowledge base and real query logs -- this best captures local vocabulary failure modes.
2. **Metrics**: Hit Rate / Recall@k, MRR, nDCG@3.
3. **Design considerations**: The control group must include **queries with local vocabulary and specialized terminology** (insurance policies, compliance, government documents) to expose Layer 2 failures; add **simple entity query probes** modeled after CapRetrieval to test Layer 1; include synonym paraphrases to prevent BM25 from taking shortcuts.
4. **Variable sweep**: chunk size (64/128/256/512), embedding model, retriever combination (dense / bm25 / hybrid / hybrid+rerank), top-k -- CRUD-RAG (arXiv:2401.17043)'s full-component Chinese evaluation serves as a methodological reference.

## The Big Picture

Traditional Chinese RAG retrieval failure = inherent model defects x Simplified Chinese corpus bias x benchmarks missing Traditional Chinese. Each layer has its countermeasures, but **none of the countermeasures is "switch to a bigger model."** The deployment order: build a Traditional Chinese eval set first (without it, everything is guesswork) -> normalization + hybrid + segmentation as three low-cost quick wins -> add a reranker -> consider local fine-tuning last. Knowledge bases dense with local terminology (compliance, insurance, government documents) should prioritize hybrid + rerank; general conversational knowledge bases can be more lenient.

## References

- [Dense Retrievers Can Fail on Simple Queries / CapRetrieval (arXiv:2506.08592)](https://arxiv.org/abs/2506.08592)
- [CRUD-RAG: Full-Component Chinese RAG Evaluation (arXiv:2401.17043)](https://arxiv.org/abs/2401.17043)
- [ihower -- Traditional Chinese Embedding Retrieval Evaluation](https://ihower.tw/blog/12167)
- [ihower -- zh-tw-embedding-model-benchmark (GitHub)](https://github.com/ihower/zh-tw-embedding-model-benchmark)
- [BGE-M3 (Hugging Face)](https://huggingface.co/BAAI/bge-m3)
- [Adapting Text Embeddings for Low-Resource Languages (arXiv:2603.22290)](https://arxiv.org/abs/2603.22290)
- [LUSIFER: Cross-lingual Shared Semantic Space (arXiv:2501.00874)](https://arxiv.org/abs/2501.00874)
- [Advancing RAG in Low-Resource Languages (arXiv:2501.04858)](https://arxiv.org/abs/2501.04858)
- [OpenCC (GitHub)](https://github.com/BYVoid/OpenCC)
- [jieba Chinese Word Segmentation (GitHub)](https://github.com/fxsjy/jieba)
