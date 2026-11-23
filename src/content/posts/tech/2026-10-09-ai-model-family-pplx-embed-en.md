---
title: "pplx-embed: Perplexity's Embedding Model Family and How to Choose Between v2-context, Late Interaction, and v1"
date: 2026-10-09
category: tech
type: deep-dive
tags: [llm, embeddings, perplexity, pplx-embed, rag, open-weights, model-family-pplx-embed, model-selection]
lang: en
tldr: "pplx-embed is Perplexity's embedding family. The current main line is pplx-embed-v2-context (0.6B/9B), released as weights in late October 2026 and on the API in November: text and images share one embedding space, and it gives either one vector per document or one whole-document-aware vector per chunk, at $0.02/$0.12 per 1M tokens on the API. v2-late is a separate multi-vector line with weights only; v1 is still on the API but is officially being phased out during 2027."
description: "A guide to Perplexity's pplx-embed model family: the February-to-November 2026 timeline, how the v2-context release is trained and how it scores in the official report, where the v2-late multi-vector line fits, the v1 phase-out, API pricing and licensing, and a selection matrix by document type and budget."
series:
  name: "AI Model Families"
  order: 25
draft: false
---

> :globe: [中文版](/posts/tech/2026-10-09-ai-model-family-pplx-embed)

In late October 2026 Perplexity released the final weights of [pplx-embed-v2-context](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b) (0.6B and 9B), and in November put them on the [Embeddings API](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings), replacing the 9B preview from late September. One model now covers text and images, whole documents and chunks that see their full document, and the API docs list it as the default for new users; the February [pplx-embed-v1](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval) is scheduled to be phased out during 2027. The separate [pplx-embed-v2-late](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector), released on October 7, takes the multi-vector route and solves a different problem. This is the twenty-fifth post in the "AI Model Families" series, and it answers one question: which one fits your documents.

For how to read the benchmark numbers quoted here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). For where models sit overall, see the [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en). The v2-late details have their own post: [pplx-embed-v2-late explained](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction-en).

## Family positioning and model matrix

| Model / product line | Positioning | Key difference | Access |
|---|---|---|---|
| pplx-embed-v2-context (0.6B/9B) | Main line: text and image retrieval, whole documents or context-aware chunks | 0.6B outputs 1024 dims (512 optional on the API); 9B outputs 2048, truncatable to 1024; both share an embedding space at 1024 | API; 9B weights MIT, 0.6B model card lists no license |
| pplx-embed-v2-late (0.6B/9B) | Multi-vector / page-image retrieval | One 128-dim vector per token; MaxSim | MIT weights; not listed in the API docs |
| pplx-embed-v1, pplx-embed-context-v1 (0.6B/4B) | Legacy API, phasing out during 2027 | Text only; dense and context are separate models | MIT weights; API still available |

### v2-context does three jobs in one model

In the v1 generation, dense (`pplx-embed-v1`) and contextual (`pplx-embed-context-v1`) were separate models. v2-context merges them and adds images:

| | How to use v2-context | Output |
|---|---|---|
| Whole documents or short text | Each string is one document, `input_type: "document"` | One vector per document |
| Long documents split into chunks | One document's chunks as an ordered array | One vector per chunk, computed with the whole document in view |
| Page screenshots, scans, photos | Base64 images, with `num_chunks` setting how many horizontal bands (1, 2, 4, 8, 16, or 32) | One vector per image, or one per band |
| Queries | `input_type: "query"`, same model as the documents | One vector per query |

API limits: each text or document up to 32,768 tokens; up to 512 documents, 16,000 chunks, and 120,000 tokens per request; image requests up to 96 images and 20 MB, and text and images cannot be mixed in one request. Vectors are INT8 or binary.

## Family evolution

### Timeline

| Date | Model | What changed for selection |
|---|---|---|
| 2026-02-11 | Technical report | [arXiv:2602.11151](https://arxiv.org/abs/2602.11151) published ahead of the models |
| 2026-02-26 | pplx-embed-v1, pplx-embed-context-v1 | Two sizes each (0.6B and 4B), four models; MIT, on the API at launch, and at the time the only generation available through the API |
| 2026-09-30 | pplx-embed-v2-context-9b-preview | 9B contextual preview built with turbopuffer; weights only, interface not guaranteed backward compatible, suited to evaluation only |
| 2026-10-07 | pplx-embed-v2-late-0.6b / 9b | Multi-vector, text plus images; MIT weights, adding a way to search PDF pages without OCR |
| 2026-10-21 / 10-28 | pplx-embed-v2-context-0.6b / 9b final | Weights on Hugging Face, base switched to v2-late, image support; technical report [arXiv:2610.38854](https://arxiv.org/abs/2610.38854) |
| 2026-11 | v2-context on the API; v1 phase-out announced | API docs make v2 the default for new users and say v1 "will be phased out during 2027"; the main pick moves from v1 to v2-context |

v1's selling point was "parity at INT8": the official report put 4B INT8 at 69.66% on MTEB (Multilingual, v2) retrieval, essentially tied with Qwen3-Embedding-4B at 69.60% while storing 4x less than FP32, and context-v1-4B at 81.96% on ConTEB. Those numbers come from the v1 announcement under different evaluation conditions from the v2-context tables below, so they are not directly comparable.

## Architecture and training trade-offs

### v2-context: fine-tuned from the late backbone, trained on answer plus evidence

The context line tackles the old chunking problem: once a passage is cut out, references, headings, and definitions are lost. The method is late chunking: the whole document goes through the model once, pooling happens within chunk spans afterwards, and every chunk vector has seen the full document. Chunks are separated by a learned `<|chunk_sep|>` token, and chunk and query vectors are averages of their token vectors.

The v2 change is in supervision. The usual approach has an LLM label one "gold passage" and treats every other passage as negative, including ones that supply supporting evidence. v2-context instead uses Perplexity's own query-aware context-compression model as a teacher: it scores every document token for relevance, those scores are aggregated into chunk scores, and the embedding model learns "answer passage plus evidence passages". Because the scores are per token, a different chunking needs no relabeling. In the [technical report](https://arxiv.org/abs/2610.38854)'s ablation, removing this distillation loss drops Q2D-Chunk by 15.2 points on average and ConTEB by 14.6 points.

The final release differs from the preview in backbone and sizes. On Hugging Face the two final models list `base_model` as v2-late-9b and v2-late-0.6b, a vision-language backbone, which is why they accept images; both are LoRA fine-tunes, and each release is a model soup averaging several checkpoints from one training run. The 9B outputs 2048-dim INT8 vectors, trained with Matryoshka losses so the first 1024 dims also work alone; the 0.6B is trained against the 9B's 1024-dim prefix, so a 9B index can be queried by the 0.6B. The text mixture is about 440 public and in-house datasets in over 50 languages, roughly 57 million query–document pairs for the 9B; the report states that no ConTEB, context-bench, or Q2D-Chunk data was used for training.

One trade-off runs opposite to v1: **v2 uses prefixes**. v1 deliberately dropped instruction prefixes, reasoning that mismatched index and query prefixes silently wreck retrieval. v2-context is trained with separate query and document prefixes: the model card requires `encode_queries` for queries and `encode` for documents, and the API makes `input_type` mandatory, returning HTTP 400 without it. In effect, the API interface now guards against the wrong-prefix risk.

### v2-late: a vector per token, and images

The architecture and evaluation of v2-late are covered in [the dedicated post](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction-en); here is only its place in the family. It is the one multi-vector line: a Qwen3.5 base, an 18B teacher distilled into 9B and 0.6B students, and a shared embedding space so a 9B index can be queried by the 0.6B. Training data is 186 million query–document pairs from 594 datasets in 46 languages. The final v2-context models are fine-tuned from it.

### What v1 left behind

v1 started from Qwen3 (0.6B and 4B), removed the causal mask, and continued pretraining with a diffusion denoising objective on about 250 billion tokens in 30 languages, turning the decoder into a bidirectional encoder before contrastive training. Quantization was part of training: straight-through estimation kept vectors operating in INT8 during training. That "native INT8" design carries over to v2-context.

## Evaluation and alternatives

All numbers below are Perplexity's self-reported results for the final release, from the v2-context [technical report](https://arxiv.org/abs/2610.38854). The three benchmarks measure different things, so compare within each table rather than merging them into one ranking.

### context-bench: answers, evidence, and telling look-alike documents apart

A private benchmark held by turbopuffer, with 2,099 queries over 38,894 long documents in 21 domains; Perplexity's models were evaluated blind by turbopuffer. At K=10, in %:

| Model | Answer@10 | Evidence recall@10 (in document) | Document@10 |
|---|---|---|---|
| pplx-embed-v2-context-9b | **45.5** | **40.6** | **61.6** |
| voyage-context-4 | 31.1 | 35.6 | 51.6 |
| pplx-embed-context-v1-4b | 26.4 | 36.4 | 58.1 |
| pplx-embed-v2-context-0.6b | 21.9 | 23.8 | 39.0 |

The 9B leads, but the 0.6B trails v1's context-4B here, and the report says plainly that the 0.6B lags the larger contextual models on this benchmark. The absolute values are low, meaning the benchmark is hard for every model, and outsiders cannot reproduce it.

### Q2D-Chunk: real search traffic

A new benchmark Perplexity built from its own search logs (6,069 base queries, 10 languages, 26 domains), published as a [Hugging Face leaderboard](https://huggingface.co/spaces/perplexity-ai/q2d-chunk-leaderboard). The main metric is Answer@10 (base queries, 128-token chunks): v2-context-9b 86.4%, voyage-context-4 83.9%, v2-context-0.6b 83.1%, context-v1-4b 74.9%. On evidence recall, the non-contextual Nemotron-3-Embed-8B scores highest; the report suspects evidence passages overlap lexically with the queries.

### ConTEB: the public contextual-retrieval benchmark

Average nDCG@10 over eight tasks: v2-context-9b 83.4%, context-v1-4b 82.1%, v2-context-0.6b 80.7%, voyage-context-4 80.4%. The 9B wins five of eight tasks; context-v1, which was trained on the ConTEB training set, still leads on Insurance and NarrativeQA, and Nemotron-3-Embed-8B leads on COVID-QA (a mostly lexical-matching task where context helps little).

### Images and storage

The report says v2-context achieves the best results among dense retrievers on ViDoRe-V3 and MIRACL-Vision; on ViDoRe-V3, the 9B with two chunks per image at 1024 dims beats Nemotron-3.5-8B with a 4x smaller index. For higher page-image accuracy, the multi-vector v2-late remains an option, at the cost of a much larger index.

On storage, v2-context produces one vector per chunk, so the vector count equals that of an ordinary chunk index; the 9B truncated to 1024-dim INT8 is 1 KB per vector. The report's experiments show that finer chunks truncated to 1024 dims usually do better at the same index size.

## Licensing, pricing, and deployment

### API pricing

From the [Perplexity Embeddings docs](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings), per 1M tokens (as of 2026-11-23):

| Model | Text | Images | Status |
|---|---|---|---|
| pplx-embed-v2-context-0.6b | $0.02 | $0.40 | Official default, higher throughput and lower latency |
| pplx-embed-v2-context-9b | $0.12 | $0.42 | Choose for retrieval quality |
| pplx-embed-v1-0.6b | $0.004 | — | Phasing out during 2027 |
| pplx-embed-v1-4b | $0.03 | — | Phasing out during 2027 |
| pplx-embed-context-v1-0.6b | $0.008 | — | Phasing out during 2027 |
| pplx-embed-context-v1-4b | $0.05 | — | Phasing out during 2027 |

v2-context uses `POST /v1/embeddings`; the v1 context models use a separate `POST /v1/contextualizedembeddings` endpoint. Image token counts depend on image size and `num_chunks`; the response's `usage.prompt_tokens` is authoritative. The official v1 wording is "phased out during 2027; new users should use v2, existing users are encouraged to migrate", with no exact shutdown date. v2-late is not in the API docs' model table, so it is self-host only.

### Weight licenses

- **v2-context-9b**: MIT on the Hugging Face model card.
- **v2-context-0.6b**: the model card metadata has no license field and the repo has no LICENSE file. Confirm with Perplexity before commercial self-hosting, or use the API.
- **v2-late 0.6B/9B, all of v1, the 9B preview**: MIT on Hugging Face.

Self-hosting v2-context needs `transformers>=5.4.0` and `trust_remote_code=True`; installing `flash-linear-attention` and `causal-conv1d` enables the fast linear-attention path.

## Agent integration and selection

### Selection matrix

| Your situation | Recommendation | Why |
|---|---|---|
| New project, general semantic search or RAG, via API | v2-context-0.6b | Official default, $0.02, supports both whole-text and chunk use |
| Long documents lose meaning after chunking, with heavy references and definitions | v2-context-9b in chunk mode | Best on context-bench and Q2D-Chunk; the 0.6B trails clearly on context-bench |
| Need both the answer and the evidence passages for an agent or human to verify | v2-context-9b | This is its training objective, though one of the main benchmarks is private |
| Documents are PDFs or screenshots with tables and charts | Try v2-context image input first, then evaluate v2-late | v2-context is single-vector with a small index; v2-late is finer-grained but its index grows with token count |
| Index a large corpus once, keep queries fast | Index with 9B (1024 dims), query with 0.6B | They share an embedding space at 1024 dims |
| Already in production on v1 | Schedule a migration to v2-context | v1 phases out during 2027; switching models means rebuilding the index, and v1 and v2 vectors cannot be mixed |
| Commercial self-hosting where legal needs an explicit license | v2-context-9b or v2-late | The v2-context 0.6B model card lists no license |

Related reading on this site: [BGE-M3 embedding model selection](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en) and [ColPali visual document retrieval](/posts/ai/2026-09-03-colpali-visual-document-retrieval-en).

### v2-context usage notes

From the [model card](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b) and the [API docs](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings):

- Encode queries with `encode_queries` (`input_type: "query"` on the API) and document chunks with `encode` (`"document"` on the API); mixing them up "silently degrades retrieval quality". Short indexed text such as titles, summaries, and FAQ entries counts as documents.
- In chunk mode, a document's chunks must not overlap and must stay in source order.
- Vectors are unnormalized INT8: compare with cosine similarity, or set `normalize_embeddings=True` and use the dot product.
- To truncate the 9B to 1024 dims, take the first 1024 values, then normalize; only 1024 and 2048 dims were trained.
- Do not mix vectors from the 9B preview with the final release: the preview model card already warned that weights and interface might not be backward compatible.

## Limitations and trade-offs

### Bottom line

The pplx-embed name now covers two bets. v2-context bets that "one single-vector model is enough, as long as chunks carry the whole document and learn evidence as well as answers", applying the same chunking idea even to images. v2-late bets that "a more expensive index buys finer token-level matching". v1's "native INT8" lives on in v2, while its "no prefixes" decision was reversed, with the API's mandatory `input_type` catching mistakes instead.

Three limitations stand. First, the headline numbers are all self-reported by Perplexity, and context-bench is out of reach for outsiders; Q2D-Chunk is a public leaderboard, but its data still comes from Perplexity's own search traffic. Second, the 0.6B is cheap and the API default, yet it trails the 9B clearly on long-range-context tasks like context-bench, so compare them on your own documents before relying on it for chunk retrieval. Third, the v1 phase-out says only "during 2027" with no exact date, so teams already in production must plan their own migration, and switching models means rebuilding the whole index.

## Update history

- 2026-11-23: Rewritten under the generation-change rule. The final v2-context release (0.6B on Hugging Face on 2026-10-21, 9B on 2026-10-28, on the API in November) is now the main line: matrix, architecture, evaluation, pricing, and selection were rewritten around v2-context, with evaluation numbers replaced by the final-release results from technical report arXiv:2610.38854. v1 pricing is kept and marked with the official "phased out during 2027"; v1's evaluation table and training details are condensed into one paragraph each in the family-evolution and architecture sections. The earlier statement that "no dense single-vector v2 exists yet" no longer holds (v2-context also offers one vector per whole document). The earlier statement that the preview's "model card does not state a license" was corrected: the Hugging Face metadata for that card lists MIT. Added that the v2-context-0.6b model card lists no license.
- 2026-10-11: Reorganized the format, model matrix, and selection sections; retained existing sources and dates. No fresh fact-check was performed.

## References

- [Perplexity API docs: Embeddings (v2 and v1 models, pricing, input limits, v1 phase-out)](https://docs.perplexity.ai/docs/embeddings/contextualized-embeddings)
- [Perplexity API Changelog (2026-11: v2-context on the API)](https://docs.perplexity.ai/docs/resources/changelog)
- [Technical report: Contextual Embeddings Beyond the Gold Chunk (arXiv:2610.38854)](https://arxiv.org/abs/2610.38854)
- [Hugging Face: perplexity-ai/pplx-embed-v2-context-9b](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b)
- [Hugging Face: perplexity-ai/pplx-embed-v2-context-0.6b](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-0.6b)
- [Hugging Face: Q2D-Chunk leaderboard](https://huggingface.co/spaces/perplexity-ai/q2d-chunk-leaderboard)
- [Perplexity community announcement: Introducing pplx-embed-v2-context (2026-11-03)](https://community.perplexity.ai/t/introducing-pplx-embed-v2-context-open-weight-vision-language-embedding-models-in-9b-and-0-6b/6466)
- [Perplexity: pplx-embed announcement (2026-02-26)](https://www.perplexity.ai/hub/blog/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval)
- [Perplexity: Contextual embedding beyond the gold passage (2026-09-30)](https://www.perplexity.ai/hub/blog/contextual-embedding-beyond-the-gold-passage)
- [Perplexity: Multimodal embeddings beyond a single vector (2026-10-07)](https://www.perplexity.ai/hub/blog/multimodal-embeddings-beyond-a-single-vector)
- [Technical report: Diffusion-Pretrained Dense and Contextual Embeddings (arXiv:2602.11151)](https://arxiv.org/abs/2602.11151)
- [Hugging Face: perplexity-ai/pplx-embed-v1-4b](https://huggingface.co/perplexity-ai/pplx-embed-v1-4b)
- [Hugging Face: perplexity-ai/pplx-embed-v2-context-9b-preview](https://huggingface.co/perplexity-ai/pplx-embed-v2-context-9b-preview)
- [Hugging Face: perplexity-ai/pplx-embed-v2-late-0.6b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-0.6b)
- [Hugging Face: perplexity-ai/pplx-embed-v2-late-9b](https://huggingface.co/perplexity-ai/pplx-embed-v2-late-9b)
- [pplx-embed-v2-late explained (on this site)](/posts/ai/2026-10-09-pplx-embed-v2-late-multimodal-late-interaction-en)
