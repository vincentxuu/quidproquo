---
title: "pplx-embed: Perplexity's Embedding Model Family and How to Choose Between Its Three Lines"
date: 2026-10-09
category: tech
type: deep-dive
tags: [llm, embeddings, perplexity, pplx-embed, rag, open-weights, model-family-pplx-embed, model-selection]
lang: en
tldr: "pplx-embed is the embedding family Perplexity has been releasing since February 2026, in three lines: v1 single-vector (0.6B/4B, API at $0.004/$0.03 per 1M tokens), context embeddings (v1 plus a 9B v2 preview), and v2-late multi-vector (0.6B/9B, searches PDF page images directly). They solve different problems; v2 does not replace v1."
description: "A guide to Perplexity's pplx-embed model family: the February-to-October 2026 timeline, how the single-vector, contextual and late-interaction lines differ in architecture and training, current API pricing and licensing, and a selection matrix by document type and budget."
series:
  name: "AI 模型家族"
  order: 25
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-09-ai-model-family-pplx-embed)

On October 7, 2026, Perplexity released [pplx-embed-v2-late](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector), a week after [pplx-embed-v2-context-9b-preview](https://www.perplexity.ai/hub/blog/contextual-embedding-beyond-the-gold-passage), and the original [pplx-embed-v1](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval) dates from February. That is three batches and seven checkpoints in eight months, all named pplx-embed, but "v2" is not an upgrade of "v1". This is the twenty-fifth post in the "AI model family" series. It splits the family into three lines and answers one question: which one fits your documents.

For how to read the benchmark numbers quoted here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). For where models sit overall, see the [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en). The v2-late details have their own post: [pplx-embed-v2-late explained](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction-en).

## Timeline

| Date | Model | Key facts |
|---|---|---|
| 2026-02-11 | Technical report | [arXiv:2602.11151](https://arxiv.org/abs/2602.11151) appears before the models |
| 2026-02-26 | pplx-embed-v1, pplx-embed-context-v1 | 0.6B and 4B of each, four checkpoints; MIT license, API on day one |
| 2026-09-30 | pplx-embed-v2-context-9b-preview | 9B contextual preview, built with turbopuffer; weights on Hugging Face, no API yet |
| 2026-10-07 | pplx-embed-v2-late-0.6b / 9b | Multi-vector, text plus images; MIT weights, API planned |

v2 currently has only the context and late lines. There is no v2 dense model yet: the late announcement says Perplexity is "currently training the next generation of our dense embedding models" and will roll them out on the API progressively. For ordinary semantic search today, v1 is what you can actually use.

## Three lines, three problems

| | v1 (dense) | context (v1 / v2 preview) | v2-late |
|---|---|---|---|
| Output per input | One vector | One vector per chunk, aware of the whole document | One 128-dim vector per token |
| Sizes | 0.6B (1024-dim), 4B (2560-dim) | v1: 0.6B, 4B; v2: 9B (2048-dim, truncatable to 1024) | 0.6B, 9B |
| Input | Text | Text | Text, page images |
| Quantization | Native INT8 / binary | v1: INT8 / binary; v2 preview: INT8 | Not stated |
| Max length | 32K | v2 evaluated at up to 32,768 tokens per pass | Not published |
| Scoring | Cosine | Cosine | MaxSim |
| API (checked 2026-10-09) | Yes | v1 yes, v2 preview no | No, planned |

Prices from the [Perplexity API docs](https://docs.perplexity.ai/docs/embeddings/quickstart), checked 2026-10-09, per 1M tokens:

| Model | Price |
|---|---|
| pplx-embed-v1-0.6b | $0.004 |
| pplx-embed-v1-4b | $0.03 |
| pplx-embed-context-v1-0.6b | $0.008 |
| pplx-embed-context-v1-4b | $0.05 |

## v1: turning a decoder into an encoder with diffusion pretraining

v1 starts from an unusual choice. Most strong embedding models sit on decoder-only language models, where a token only sees what precedes it. Perplexity starts from Qwen3 (0.6B and 4B), removes the causal mask, and continues pretraining with a diffusion denoising objective on about 250 billion tokens across 30 languages, producing a bidirectional encoder before contrastive training. Its ablations credit this with roughly one percentage point on retrieval.

Three contrastive stages follow: pair training, contextual training (which yields the context models) and triplet training with mined hard negatives. The final v1 model merges the contextual and triplet checkpoints by spherical linear interpolation. Quantization is part of training rather than a post-hoc step: embeddings run as INT8 throughout with straight-through estimation, cutting storage 4x against FP32; binary cuts it 32x, with a drop under 1.6 points at 4B and 2 to 4 points at 0.6B.

Another trade-off: **no instruction prefix**. The model card says prefixes can add 2% to 3% on benchmarks but make indexing brittle when index-time and query-time prefixes drift apart, so they were left out.

Reported results (all self-published):

| Item | Number | Comparison |
|---|---|---|
| MTEB(Multilingual, v2) retrieval, 4B INT8 | 69.66% | Qwen3-Embedding-4B 69.60%, gemini-embedding-001 67.71% |
| ConTEB, context-v1-4B INT8 | 81.96% | voyage-context-3 79.45%, Anthropic Contextual 72.4% |
| PPLXQuery2Doc (30M docs), 4B | Recall@1000 91.7% | Qwen3-Embedding-4B 88.6% |

On MTEB the gap is 0.06 points, effectively a tie. v1's pitch is parity at INT8, which makes storage cheap.

## The context line: from the "gold passage" to answer plus evidence

This line targets the old chunking problem: once a passage is cut out, its references, headings and definitions are gone. The method is late chunking: encode the whole document in one pass, then pool within chunk boundaries, so every chunk vector has seen the full text.

The v2 preview changes the supervision. The usual recipe has an LLM label one "gold passage" and treats every other chunk as a negative, including chunks that carry supporting evidence. The preview instead uses Perplexity's query-aware context compression model as a teacher: it scores each document token for relevance, those scores are aggregated into chunk scores, and the embedding model learns to retrieve the answer chunk together with its support. It starts from an in-house 9B ColBERT model, trains on about 430 datasets in more than 50 languages, and ships as a model soup averaged over several checkpoints.

This is the line whose evaluation needs the most careful reading:

- The headline results are on **context-bench**, held privately by turbopuffer, which only evaluates submitted models. That limits training contamination but nobody outside can reproduce it.
- On context-bench at K=10 the 9B preview reaches 45.5% answer recall and 40.6% evidence recall, 14.4 and 5.0 points above voyage-context-4. The absolute levels are modest: document-level Document@10 is 61.6%, so the benchmark is hard for every model.
- It has the best average on the public ConTEB but not every task: it loses NarrativeQA to the v1 4B model and COVID-QA to Nemotron. Perplexity notes COVID-QA rewards surface lexical matching, so context helps less there.
- On query-to-document retrieval across domains, its average is slightly below voyage-context-4.
- The v2 post also says the v1 context-4B was trained only on the ConTEB training set and transfers poorly to other domains. That comes from Perplexity itself, and it means v1 context's 81.96% on ConTEB should not be extrapolated to your domain.

One practical storage figure: the preview emits 1024-dim INT8 vectors at 1 KB each and slightly beats voyage-context-4's 2048-dim float32 (8 KB) on average chunk-retrieval score. That counts vectors only, not the rest of the index.

Usage notes from the [model card](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b-preview):

- It is a preview; weights and interface may change without backward compatibility, so **do not mix preview embeddings with a future release**.
- Use `encode_queries` for queries and `encode` for document chunks; they use different prefixes and the wrong call "silently degrades retrieval quality".
- Embeddings are unnormalized INT8; compare with cosine similarity.
- It needs `transformers>=5.4.0` and `trust_remote_code=True`.
- The model card does not state a license. Secondary coverage says MIT, which I did not confirm on a primary page; check the license field on Hugging Face before use.

## v2-late: a vector per token, and images

The architecture and evaluation of v2-late are covered in [the dedicated post](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction-en); here is only its place in the family. It is the one multi-vector line: a Qwen3.5 base, an 18B teacher distilled into 9B and 0.6B students, and a shared embedding space so a 9B index can be queried by the 0.6B. Training data is 186 million query–document pairs from 594 datasets in 46 languages.

The trade-off to remember: it has the **highest storage cost** of the three lines, in exchange for page-image retrieval and agent-style accuracy. The MADQA 92.4% is a self-run test with a Gemini 3.5 Flash agent; the dedicated post has the conditions.

## Selection matrix

| Your situation | Pick | Why |
|---|---|---|
| General semantic search, text only, need it now | v1 4B; 0.6B on a tight budget | Only dense line with an API; INT8 storage is small |
| Chunked long documents with many references and definitions | v1 context (has API), or evaluate the v2 preview | Late chunking keeps document context; the preview is not for production |
| Need both the answer and supporting passages for an agent or a reviewer | Evaluate the v2-context preview | That is its training goal, but the benchmark is private |
| PDFs with tables and charts where OCR is the bottleneck | Evaluate v2-late | Only line that searches page images directly |
| Tight storage, vector DB without multi-vector support | v1 | v2-late index grows with token count |
| Must use an API, no self-hosting | v1 or v1 context | Both v2 lines are weights-only for now |

Related reading on this site: [BGE-M3 embedding model selection](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en) and [ColPali visual document retrieval](/posts/ai/2026-09-03-colpali-visual-document-retrieval-en).

## Bottom line

Under one name, pplx-embed is three bets. v1 bets that native INT8 and no instruction prefix make single vectors cheap enough. The context line bets that chunks must carry document context and learn evidence, not just answers. The late line bets that a pricier index buys image retrieval and agent accuracy. What they share is Perplexity's own search traffic as the yardstick, which is close to real queries but means the most prominent benchmarks (PPLXQuery, PPLX-Q2I, context-bench) are not available to outsiders.

Three things to watch: when a v2 dense model ships and whether it reaches the API; when the context preview becomes a final release and whether anyone outside turbopuffer replicates the results; and whether the late technical report lets others reproduce 92.4%. Until then, production workloads belong on v1 with its API and stable versions, and the other two lines are evaluation candidates.

## References

- [Perplexity: pplx-embed announcement (2026-02-26)](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval)
- [Perplexity: Contextual embedding beyond the gold passage (2026-09-30)](https://www.perplexity.ai/hub/blog/contextual-embedding-beyond-the-gold-passage)
- [Perplexity: Multimodal embeddings beyond a single vector (2026-10-07)](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector)
- [Technical report: Diffusion-Pretrained Dense and Contextual Embeddings (arXiv:2602.11151)](https://arxiv.org/abs/2602.11151)
- [Perplexity API docs: Embeddings (models and pricing)](https://docs.perplexity.ai/docs/embeddings/quickstart)
- [Hugging Face: perplexity-ai/pplx-embed-v1-4b](https://huggingface.co/perplexity-ai/pplx-embed-v1-4b)
- [Hugging Face: perplexity-ai/pplx-embed-v2-context-9b-preview](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b-preview)
- [Hugging Face: perplexity-ai/pplx-embed-v2-late-0.6b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-0.6b)
- [Hugging Face: perplexity-ai/pplx-embed-v2-late-9b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-9b)
- [pplx-embed-v2-late explained (on this site)](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction-en)
