---
title: "Scanned PDF Benchmark: How Did 10 Parsers Handle Graduate Entrance Exams?"
date: 2026-08-16
category: ai
type: deep-dive
tags: [document-parsing, ocr, vision-language-model, benchmark, open-source]
lang: en
tldr: "I tested 10 open-source PDF parsing tools on four scanned NTU graduate entrance exams. VLM-based tools—Firecrawl, MinerU 3.4, and Marker v2—overwhelmingly beat conventional OCR on formulas and code, but installation was the real barrier: MinerU's old package name creates dependency hell, Marker's first model download takes 10 minutes, and PaddleOCR needs a separate engine. In practice, use RapidOCR for screening and MinerU or Firecrawl for close inspection."
description: "A hands-on comparison of Firecrawl, MinerU, Marker, Surya, PaddleOCR, RapidOCR, Docling, Tesseract, and other tools on scanned NTU graduate exams containing code, formulas, and mixed Chinese-English text, including installation fixes and a two-stage validation strategy."
series:
  name: "文件解析實戰"
  order: 6
draft: false
glossary:
  - term: "VLM"
    aliases: ["Vision Language Model", "視覺語言模型"]
    definition: "A large model that processes images and text together. Unlike conventional OCR, it can understand page structure and produce formatted output such as LaTeX formulas instead of merely recognizing characters."
    context: "In this benchmark, every tool using a VLM substantially outperformed conventional OCR on formulas and code."
  - term: "BM25 short circuit"
    aliases: ["BM25 短路"]
    definition: "A search optimization that skips slower vector search when BM25 full-text search already returns enough high-quality results, reducing latency."
    context: "quidproquo's search API uses this strategy to avoid calling Vectorize for every query."
---

> 🌏 [中文版](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)

The [previous post](/posts/ai/2026-08-06-document-parsing-layout-ocr-en) discussed how to choose tools for the [parsing layer](/posts/ai/2026-08-06-document-parsing-three-layers-en): check licensing first, then corpus type, and benchmark scores last. Those were other people's benchmarks. This time I ran the tools myself on material I already had—scanned NTU graduate entrance exams.

## Test Material

I used four exams. Every one was an image-only scanned PDF with no extractable text layer:

- **Computer Science Algorithms, 2019:** code mixed with formulas
- **Information Management IT, 2024:** multiple-choice questions mixing Chinese and English
- **Information Management English, 2026:** English reading comprehension
- **Computer Science Mathematics, 2025:** dense formulas and diagrams, including directed graphs and a heap tree

The set deliberately spans plain text, mixed-language text, code, formulas, and diagrams. The mathematics exam is the hardest; every tool performed noticeably worse on it.

## The Result Up Front

| Rank | Tool | Positioning |
|---|---|---|
| Best quality | **Firecrawl** | Cloud VLM; complete LaTeX, preserved code, no garbled text, billed per page |
| Best free option | **MinerU 3.4** | Local pipeline with complete LaTeX formulas; `pip install "mineru[all]"` |
| Tied for second | **Marker v2** / **Claude vision** | Marker preserves LaTeX; Claude understands diagram content |
| Most practical | **RapidOCR** | 1.5s/page, zero configuration, free; flattens formulas to text but recognizes prose accurately |

## Full Comparison

| Tool | Type | Algorithms | IT multiple choice | English | Mathematics | Speed | Installation | Cost |
|---|---|---|---|---|---|---|---|---|
| **Firecrawl** | Cloud VLM | Excellent | Excellent | Excellent | Excellent | 3–5s | None | Per page |
| **MinerU 3.4** | Local pipeline | Excellent, 7,938 chars | Excellent, 11,611 chars | Excellent, 21,519 chars | Good, 5,752 chars | 21–30s | pip | Free* |
| **Claude vision** | VLM | Excellent | Excellent | Excellent | Excellent | ~10s/page | None | API cost |
| **Marker v2** | Local VLM pipeline | Excellent, 7,331 chars | Excellent, 11,949 chars | Excellent, 21,922 chars | Fair, 3,143 chars | 125–538s | pip + models | Free* |
| **Surya 0.22** | Local VLM OCR | Good, 3,645 chars/page | — | — | — | ~30s/page | pip | Free* |
| **PaddleOCR v3.7** | Local OCR | Good, 7,398 chars | Good, 11,310 chars | Good, 21,290 chars | Fair, 1,865 chars | 56–253s | pip + paddlepaddle | Free |
| **RapidOCR** | Local OCR | Good, 2,477 chars/page | Good, 3,682 chars/page | Good | Fair, 415 chars/page | 1–2s/page | pip | Free |
| **Docling** | Local pipeline | Fair | Good | Good | Poor | 6–45s | pip | Free |
| **pdf-inspector** | Classification router | — | — | — | — | 2ms | cargo | Free |
| **Tesseract** | Conventional OCR | 0 chars | — | — | — | — | brew | Free |

\* Licensing caveats: Marker's model weights require payment above a revenue threshold—the $2M–$5M range is disputed; see the [previous analysis](/posts/ai/2026-08-06-document-parsing-layout-ocr-en). MinerU requires separate licensing and disclosure above $20M in monthly revenue. Docling uses a clean MIT license.

olmOCR, Chandra-OCR, and dots.ocr require a GPU or vLLM backend, so I could not test them locally on a CPU Mac.

## The Litmus Test: Question 3, the Min-heap

Docling produced completely garbled text for this question, making it the clearest test of tool quality.

**Firecrawl / MinerU 3.4** (perfect reconstruction):

```
3. (10%) Draw the final min-heap tree after the following operations:
insert 7, insert 4, insert 3, insert 1, delete min, insert 9,
insert 2, insert 5, delete min, delete min.
```

**Docling** (garbled):

```
'In oor  t  se Dmt e t ote  ie  s  ote  te f t e t t t t rt ts
delete min, delete min.
```

Marker v2 and RapidOCR both recognized the text correctly. Marker additionally preserved the LaTeX formatting.

## Mathematical Formulas: The VLM Divide

The 2025 computer science mathematics exam was the hardest document for every tool. Firecrawl's VLM recovered complete LaTeX for matrices and vectors, including `\begin{pmatrix}`. MinerU produced 5,752 characters with occasional formula noise. Marker fell to 3,143 characters despite exceeding 7,000 on every other exam, while PaddleOCR returned only 1,865.

Conventional OCR tools such as RapidOCR and PaddleOCR flatten formulas into plain text—`$a_n$` becomes `an`, and matrices disappear. They remain entirely adequate for plain prose and are 10 to 100 times faster.

Only Claude vision could actually “understand” diagrams such as directed graphs and heap trees. Every other tool merely recognized labels around the diagram without recovering its semantics.

## Installation Pitfalls

### MinerU: The Package Was Renamed, and the Old Name Leads to Dependency Hell

The `magic-pdf` package on PyPI, version 1.3.12, is obsolete. OCR model versions v4/v5 in its `PDF-Extract-Kit-1.0` dependency do not match the v3 models expected by the code. Combined with conflicting `transformers` versions and incompatible tokenizer formats, this creates an unsatisfiable dependency chain.

The correct command is `pip install -U "mineru[all]"`. The package is now named `mineru`; the current version is 3.4.5, and the official project has fully migrated.

### Marker v2: The First Test Returned 0 Characters

This was a reading bug in my test code. `result.markdown` did contain 7,331 characters, including LaTeX. The model takes about 10 minutes to download on first use because of its surya-ocr dependency; installation itself is `pip install marker-pdf`.

### PaddleOCR v3.7: The API Changed

It requires the separate `paddlepaddle` engine (`pip install paddlepaddle`). The API changed from `ocr()` to `predict()`, and the return structure changed as well.

### Surya 0.22: Major API Changes

Use `LayoutPredictor`, not `DetectionPredictor`, together with `RecognitionPredictor`. Results moved from `text_lines` to `blocks`, which includes HTML output. I encountered intermittent connection errors; using Surya indirectly through Marker v2 was the most reliable path.

### dots.ocr: Requires a vLLM Backend

The PyPI package is `dots_ocr`, installed from GitHub with `pip install git+https://github.com/studio-dots-ai/dots.ocr.git`. It requires a vLLM backend and cannot run in a CPU-only environment.

### Tesseract: 0 Characters

Tesseract returned no characters for these scanned PDFs, possibly because of scan resolution or missing image preprocessing.

## Why Did VLM-based Tools Win?

[Firecrawl](https://github.com/mendableai/firecrawl) first uses [pdf-inspector](https://github.com/firecrawl/pdf-inspector), written in Rust, to classify a PDF as scanned or text-based in 2ms and route it accordingly. Scanned PDFs go to a Vision Language Model rather than conventional OCR. Its output contains LaTeX such as `$b_n$`, `$O(n)$`, and `\begin{pmatrix}`, confirming the distinction: conventional OCR cannot generate this formatting.

Marker v2 embeds [Surya OCR](https://github.com/datalab-to/surya), which is VLM-based, in its pipeline and can therefore emit LaTeX. MinerU 3.4 uses UniMERNet for formula recognition, another model-inference approach.

This confirms an observation from the [previous post](/posts/ai/2026-08-06-document-parsing-layout-ocr-en): the boundary between pipeline systems and end-to-end VLMs is becoming less distinct.

## Choosing by Scenario

| What you need | Use | Why |
|---|---|---|
| Quickly validate many documents | **RapidOCR** | 1.5s/page, free, zero configuration, adequate text accuracy |
| Reconstruct documents containing formulas | **MinerU 3.4** | Free, local, complete LaTeX |
| Best quality without installing anything | **Firecrawl** | Cloud VLM, no setup or installation pitfalls, billed per page |
| Understand diagram semantics | **Claude vision** | The only option that understood directed graphs, heap trees, and shape symbols |
| Commercial product with clean licensing | **Docling** | MIT license; moderate quality on scans but no licensing risk |
| Highest accuracy with a GPU | **olmOCR / Chandra** | End-to-end VLMs requiring a GPU or remote inference server |

## A Two-stage Validation Strategy

After validating 61 past exams, this strategy offered the best trade-off:

**Stage one, screening:** run RapidOCR over all 61 documents in about five minutes. Compare them automatically against the question-bank JSON and flag mismatches.

**Stage two, close inspection:** run full MinerU parsing only on the 18 documents flagged during screening, then compare and correct each question.

The result: 50 documents passed directly and 10 required reconstruction—three contained the wrong subject, five came from the wrong year, and two failed the OCR comparison. All were repaired, covering 1,449 questions in total.

## Mapping Back to the Three-layer Ladder

Returning to the framework from the [first post in the series](/posts/ai/2026-08-06-document-parsing-three-layers-en):

| Layer | Appropriate input | Tools covered here |
|---|---|---|
| Conversion | Office/HTML, where structure is already in the file | Not applicable: the exams are scanned PDFs |
| Extraction | Digitally native PDFs with text but no structure | pdf-inspector for routing; Tesseract |
| Parsing | Scans where even the text must be inferred | Firecrawl, MinerU, Marker, Surya, Docling, RapidOCR, PaddleOCR, Claude vision |

Every scanned exam belongs in the parsing layer; there is no shortcut. The point of the two-stage strategy is to use a cheap tool, RapidOCR, to decide which files need the full parsing stack rather than applying the most expensive method to every document.

## Overall

The technology has converged to the point where every serious option is usable. The meaningful differences are speed, cost, and installation burden. Setup problems—MinerU's rename, Marker's model download, PaddleOCR's missing engine, and Surya's cross-version incompatibility—consumed more time than the quality gaps among the tools. Only RapidOCR and Docling worked immediately after `pip install`.

If you remember one thing, remember this: **choose the strategy before the tool**. The two-stage approach reduced processing for 61 exams from “30 minutes of MinerU for everything” to “five minutes of RapidOCR plus close inspection of 18 documents with MinerU.”

---

## References

- [mendableai/firecrawl — GitHub](https://github.com/mendableai/firecrawl)
- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)
- [datalab-to/surya — GitHub](https://github.com/datalab-to/surya)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [PaddlePaddle/PaddleOCR — GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- [RapidAI/RapidOCR — GitHub](https://github.com/RapidAI/RapidOCR)
- [allenai/olmocr — GitHub](https://github.com/allenai/olmocr)
- [datalab-to/chandra — GitHub](https://github.com/datalab-to/chandra)
- [studio-dots-ai/dots.ocr — GitHub](https://github.com/studio-dots-ai/dots.ocr)
- [firecrawl/pdf-inspector — GitHub](https://github.com/firecrawl/pdf-inspector)
- [The Parsing Layer: When Structure Must Be Inferred—and Licensing Becomes the Real Selection Axis](/posts/ai/2026-08-06-document-parsing-layout-ocr-en)
- [The Three-layer Ladder of Document Parsing: Conversion, Extraction, and Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en)
- [The Deterministic Extraction Layer: Solve 80% of PDFs Without a Model](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)
