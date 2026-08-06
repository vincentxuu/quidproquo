---
title: "The Parsing Layer: When Structure Must Be Inferred — and Licensing Is the Real Selection Axis"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-parsing, ocr, vision-language-model, open-source, rag]
lang: en
tldr: "Scans and complex layouts leave you no choice but to infer structure with a model. But the technical gap between MinerU, Marker, and Docling is far smaller than the licensing gap — MinerU needs a separate license past $20M monthly revenue, Marker's model weights need payment past a funding threshold, and only Docling is cleanly MIT. Read the LICENSE before the benchmark."
description: "The third rung of the document parsing ladder: pipeline systems (MinerU / Marker / Docling) versus end-to-end VLMs (olmOCR / dots.ocr / Chandra), what each license actually restricts, how to read olmOCR-bench numbers, and where commercial APIs fit."
series:
  name: "文件解析實戰"
  order: 5
draft: false
glossary:
  - term: "olmOCR-bench"
    definition: "A document parsing benchmark from Allen AI that uses page-level assertions to check whether output preserves the correct content and structure."
    context: "Currently the most-cited public benchmark at this layer — though most of the citing is done by authors of the tools being measured."
  - term: "OpenRAIL-M"
    aliases: ["Responsible AI License"]
    definition: "A model-weights license permitting use and redistribution while attaching use restrictions; vendors frequently layer their own commercial thresholds on top."
    context: "Marker's code is Apache-2.0 while its model weights use a modified OpenRAIL-M — two different licenses in one repo, and the easiest trap to fall into."
---

> 🌏 [中文版](/posts/ai/2026-08-06-document-parsing-layout-ocr)

The last rung of the [three-layer ladder](/posts/ai/2026-08-06-document-parsing-three-layers-en): the file contains no usable structure, and sometimes no text at all. Scanned contracts, photographed invoices, two-column papers with formulas, financial statements with nested tables — these can only be inferred by a model from visual signals.

There are many tools here and the benchmark noise is loud, but I would argue **the first thing to check is not accuracy — it is the LICENSE file**. The reasoning follows below.

## Two approaches

**Pipeline systems** break the work into stages: layout detection → block classification → reading order → per-block content recognition (OCR / table structure / formulas). Each stage is swappable, separately debuggable, and can be run partially. [MinerU](https://github.com/opendatalab/MinerU), [Marker](https://github.com/datalab-to/marker), and [Docling](https://github.com/docling-project/docling) all belong here.

**End-to-end VLMs** hand a full page image to a vision-language model and get Markdown back in one shot. [olmOCR](https://github.com/allenai/olmocr), [dots.ocr](https://github.com/rednote-hilab/dots.ocr), and [Chandra](https://github.com/datalab-to/chandra) take this route. The upside is no multi-stage pipeline to maintain and better adaptation to strange layouts; the downside is that local debugging is hard, and it introduces a failure mode pipelines do not have — hallucination. The [DeepSeek-OCR post](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en) dissects the extreme version of this route.

The boundary is blurring in practice: Marker embeds VLMs inside its pipeline, and MinerU offers a VLM backend. Rather than arguing taxonomy, look at two things — **does it need a GPU**, and **can you run only part of it**.

## The open-source field today

Stars, licenses, and last-push dates are GitHub API values queried 2026-08-06:

| Tool | Stars | License | Last push |
|---|---|---|---|
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | 86,967 | Apache-2.0 | 2026-07-22 |
| [MinerU](https://github.com/opendatalab/MinerU) | 76,853 | Custom MinerU license | 2026-08-05 |
| [Docling](https://github.com/docling-project/docling) | 64,238 | MIT | 2026-08-03 |
| [Marker](https://github.com/datalab-to/marker) | 38,077 | Apache-2.0 (code only) | 2026-07-20 |
| [Surya](https://github.com/datalab-to/surya) | 21,215 | Apache-2.0 (code only) | 2026-07-23 |
| [olmOCR](https://github.com/allenai/olmocr) | 19,231 | Apache-2.0 | 2026-03-25 |
| [Chandra](https://github.com/datalab-to/chandra) | 11,917 | Apache-2.0 | 2026-06-26 |
| [dots.ocr](https://github.com/rednote-hilab/dots.ocr) | 9,056 | MIT | 2026-03-24 |

Two repos have moved: Marker from `VikParuchuri` to `datalab-to`, and Docling from `DS4SD` to `docling-project`. The old URLs redirect, but new projects should use the new ones.

## Licensing: the real dividing line

The technical gap at this layer is converging while the licensing gap widens. The license badge on the GitHub page **will mislead you**, because code and model weights can carry two different licenses.

**MinerU** returns `NOASSERTION` from the API because it uses a custom "MinerU Open Source License" — Apache-2.0 as a base with added conditions. Past a certain scale (per [MarkTechPost's 2026-07 breakdown](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/amp), 100M MAU or $20M monthly revenue) you need a separate commercial license, and online services built on it must disclose that fact. For most teams that threshold is far away, but platform products should read it carefully.

**Marker / Surya** (from Datalab) hide the easiest trap: **the code is Apache-2.0 while the model weights use a modified AI Pubs OpenRAIL-M**, free for research, personal use, and startups below a funding/revenue threshold, paid above it. Sources disagree on the number — the same breakdown says $5M in funding/revenue while an earlier Datalab partnership announcement says $2M. **Go read the LICENSE in the repo and the terms on the vendor's site yourself. Do not trust secondhand summaries, this post included.**

**Docling** is MIT, with model licenses tracked separately in their original packages. For commercial deployment it is the cleanest option on the list — unsurprising for an IBM Research project.

One more reminder: PyMuPDF, covered in [the previous post](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en), is AGPL-3.0. A single AGPL component anywhere in the pipeline forces a re-evaluation of the whole SaaS story.

## How to read the benchmarks

olmOCR-bench is the most-cited number right now. Per MarkTechPost's 2026-07-24 summary of Datalab's own figures, Marker v2 in balanced mode scores 76.0% on olmOCR-bench at 2.9 pg/s against Docling's 50.3% at 2.1 pg/s, and Marker's fast mode with `--disable_ocr` reaches 23.7 pg/s on CPU alone.

That looks clear-cut, but it needs two discounts:

1. **This is Datalab's benchmark and Marker is Datalab's product.** Same yardstick applied to [anydoc earlier](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en) and to ParseBench: the author's product wins, and the structural bias is real.
2. **The mode changes the shape of failure, not just the score.** The same breakdown notes that fast mode reads formulas from the PDF text layer instead of OCR-ing them, dropping the arXiv math category from 83.9 to 23.4 — and `--disable_ocr` scores 0.0 there outright. "Eight times faster" does not cost you a few points evenly; it makes one entire document class fail.

That is exactly how parsing-layer benchmarks mislead: **two tools with similar overall scores can fail in completely different places**. If your corpus is all old scans, the number to read is that category's score, not the total.

## Commercial APIs

LlamaParse, Azure Document Intelligence, Google Document AI, AWS Textract, and Reducto all live at this layer, trading money for accuracy and zero maintenance.

On the [ParseBench](https://github.com/run-llama/ParseBench) leaderboard (arXiv [2604.08538](https://arxiv.org/abs/2604.08538)), LlamaParse Agentic scores 84.88 overall at roughly 1.25¢ per page against Azure Document Intelligence's 73.8. But the same warning applies again: ParseBench is built by LlamaIndex, and the leader is their own product.

The more practical criterion is **your volume**. A cent per page across ten thousand pages is $100 and not worth a meeting; across ten million pages it is $100,000 and you should be running your own GPUs. Open-source costs engineering time plus hardware, commercial APIs cost per page — the crossover usually sits somewhere in the hundreds of thousands of pages.

## Choosing

1. **Read the LICENSE first.** Closed-source SaaS with growing revenue → Docling (MIT) is safest. Comfortable with the conditions, or small volume → MinerU or Marker both work.
2. **Then match your corpus.** Academic PDFs (formulas, two columns) → MinerU. General business documents at throughput → Marker. Structured JSON rather than just Markdown → Docling. Chinese-heavy workloads → the PaddleOCR ecosystem is deepest.
3. **Volume decides build-vs-buy.** Below a few hundred thousand pages, ship the product on a commercial API with predictable cost; revisit when you outgrow it.
4. **Do not judge on overall scores.** Run the twenty hardest documents from your own corpus and look at how they break.

## Overall

This is the most expensive, slowest, and least deterministic rung on the ladder, which makes the most important decision **using it as little as possible** — do not send it anything the [extraction layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en) can handle, let alone anything the [conversion layer](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en) can.

When you genuinely do land here, the order is: LICENSE → your corpus → per-category benchmark scores → run it yourself. Putting the overall benchmark ranking first is the most common selection mistake at this layer.

The technology will keep converging. License terms will not improve on their own.

## References

- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)
- [datalab-to/surya — GitHub](https://github.com/datalab-to/surya)
- [datalab-to/chandra — GitHub](https://github.com/datalab-to/chandra)
- [allenai/olmocr — GitHub](https://github.com/allenai/olmocr)
- [rednote-hilab/dots.ocr — GitHub](https://github.com/rednote-hilab/dots.ocr)
- [PaddlePaddle/PaddleOCR — GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- [Datalab Marker v2 vs MinerU, Docling, LiteParse — licensing and benchmark breakdown (MarkTechPost, 2026-07-24)](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/amp)
- [ParseBench: A Document Parsing Benchmark for AI Agents (arXiv 2604.08538)](https://arxiv.org/abs/2604.08538)
- [run-llama/ParseBench — leaderboard](https://github.com/run-llama/ParseBench)
- [The Three-Layer Ladder of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en)
- [The Deterministic Extraction Layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)
- [DeepSeek-OCR: Compressing Long Context Into Images](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en)
