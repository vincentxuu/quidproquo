---
title: "The Parsing Layer: When Structure Must Be Inferred — and Licensing Is the Real Selection Axis"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-parsing, ocr, vision-language-model, open-source, rag]
lang: en
tldr: "Scans and complex layouts leave you no choice but to infer structure with a model. By late 2026, specialized OCR models around 1B parameters have pushed OmniDocBench v1.6 to 96–97, with the top five less than a point apart — the technical gap is far smaller than the licensing gap. PaddleOCR-VL, MiniCPM-OCR, GLM-OCR, and Unlimited OCR 2 are clean Apache or MIT; dots.ocr layers prohibited uses on top of MIT; Datalab's Chandra, Marker/Surya, and Indra weights carry $2M, $5M, and $20M thresholds; Tencent's Youtu-Parsing excludes the EU; MinerU requires attribution. Read the LICENSE before the benchmark."
description: "The third rung of the document parsing ladder: pipeline systems (MinerU / Marker / Docling) versus end-to-end VLMs, the open OCR models on the shelf as of November 2026 and their licenses (PaddleOCR-VL-1.6, MinerU2.5-Pro, MiniCPM-OCR, GLM-OCR, Xiaomi-OCR-0, Youtu-Parsing-Omni, Unlimited OCR 2, DeepSeek-OCR 2, dots.ocr, olmOCR 2, Chandra 2, Surya 2.5), how to read OmniDocBench and olmOCR-bench, and where commercial APIs fit."
series:
  name: "Document Parsing in Practice"
  order: 5
draft: false
glossary:
  - term: "olmOCR-bench"
    definition: "A document parsing benchmark from Allen AI that uses page-level assertions to check whether output preserves the correct content and structure."
    context: "One of the most-cited public benchmarks at this layer — though most of the citing is done by authors of the tools being measured."
  - term: "OmniDocBench"
    definition: "A document parsing evaluation set and official leaderboard maintained by OpenDataLab; Overall averages text edit distance, formula CDM, and table TEDS."
    context: "The score most 2026 OCR model releases report; its maintainer OpenDataLab is also the team behind MinerU."
  - term: "OpenRAIL-M"
    aliases: ["Responsible AI License"]
    definition: "A model-weights license permitting use and redistribution while attaching use restrictions; vendors frequently layer their own commercial thresholds on top."
    context: "Marker, Surya, and Chandra ship Apache-2.0 code with model weights under a modified OpenRAIL-M — two different licenses in one repo, and the easiest trap to fall into."
---

> :globe: [中文版](/posts/ai/2026-08-06-document-parsing-layout-ocr)

The last rung of the [three-layer ladder](/posts/ai/2026-08-06-document-parsing-three-layers-en): the file contains no usable structure, and sometimes no text at all. Scanned contracts, photographed invoices, two-column papers with formulas, financial statements with nested tables — these can only be inferred by a model from visual signals.

There are many tools here and the benchmark noise is loud, but I would argue **the first thing to check is not accuracy — it is the LICENSE file**. The reasoning follows below.

## Two approaches

**Pipeline systems** break the work into stages: layout detection → block classification → reading order → per-block content recognition (OCR / table structure / formulas). Each stage is swappable, separately debuggable, and can be run partially. [MinerU](https://github.com/opendatalab/MinerU) ([dedicated post](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en); its accuracy model is the 1.2B MinerU2.5-Pro, currently version 2605), [Marker](https://github.com/datalab-to/marker), and [Docling](https://github.com/docling-project/docling) ([dedicated post](/posts/tech/2026-09-06-docling-document-parsing-en); donated to the Linux Foundation AI & Data in early 2026, also offers a VlmPipeline / Granite-Docling option) all belong here.

**End-to-end VLMs** hand a full page image to a vision-language model and get Markdown back in one shot. [olmOCR 2](https://huggingface.co/allenai/olmOCR-2-7B-1025), [dots.ocr / dots.mocr](/posts/tech/2026-10-10-ai-model-family-dots-studio-en), [Chandra OCR 2](https://github.com/datalab-to/chandra), and [DeepSeek-OCR 2](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2) take this route. The upside is no multi-stage pipeline to maintain and better adaptation to strange layouts; the downside is that local debugging is hard, and it introduces a failure mode pipelines do not have — hallucination. The [DeepSeek-OCR post](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en) dissects the extreme version of this route.

The boundary has largely dissolved. The highest-scoring "OCR models" of 2026 are actually two-stage: [MiniCPM-OCR 1.0](/posts/tech/2026-11-23-ai-model-family-minicpm-en) and [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR) both run PaddlePaddle's PP-DocLayoutV3 for layout first, then hand each region to a roughly 1B recognition model; PaddleOCR-VL is also a layout model plus a VLM. Marker 2.2's `balanced` mode goes the other way: clean text pages stay on CPU and read the text layer, and only equations, complex tables, non-Latin scripts, and scans go to the 0.69B Surya 2.5. Rather than arguing taxonomy, look at two things — **does it need a GPU**, and **can you run only part of it**.

## The open-source field today

### Tools

Stars, licenses, and latest releases are GitHub API values as of 2026-11-23:

| Tool | Stars | Code license | Latest release |
|---|---|---|---|
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | 93,046 | Apache-2.0 | v3.7.0 (2026-06) |
| [MinerU](https://github.com/opendatalab/MinerU) | 84,169 | Apache-2.0 + additional terms | 4.2.3 (2026-11) |
| [Docling](https://github.com/docling-project/docling) | 70,896 | MIT | v2.151.1 (2026-11) |
| [Marker](https://github.com/datalab-to/marker) | 41,024 | Apache-2.0 (code only) | v2.2.0 (2026-11) |
| [Surya](https://github.com/datalab-to/surya) | 21,613 | Apache-2.0 (code only) | v0.24.0 (2026-11) |
| [olmOCR](https://github.com/allenai/olmocr) | 19,842 | Apache-2.0 | v0.4.27 (2026-03) |
| [Chandra](https://github.com/datalab-to/chandra) | 12,744 | Apache-2.0 (code only) | v0.3.0 (2026-11) |
| [dots.ocr](https://github.com/studio-dots-ai/dots.ocr) | 9,237 | MIT (as GitHub labels it) | No releases |

Three repos have moved: Marker from `VikParuchuri` to `datalab-to`, Docling from `DS4SD` to `docling-project`, and dots.ocr from `rednote-hilab` to `studio-dots-ai`. Old URLs all redirect, but new projects should use the new ones.

### Models

The real change in 2026 is on the model side: Chinese vendors and research labs released a wave of specialized OCR models around 1B parameters. The table lists open-weight models on the shelf as of November 2026 that are representative by downloads or score. In the OmniDocBench v1.6 column, "official" means the number appears on the [OmniDocBench official leaderboard](https://github.com/opendatalab/OmniDocBench); "self-reported" means it appears only in the vendor's model card. HF downloads are the last-30-day counts Hugging Face displayed on 2026-11-23.

| Model | Params | Weights license | OmniDocBench v1.6 | HF 30-day downloads | Notes |
|---|---|---|---|---|---|
| [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6) | 0.96B | Apache-2.0 | 96.34 (official) | 95K | 2026-05; layout model + VLM |
| [MiniCPM-OCR 1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) | 1.3B | Apache-2.0 | 96.44 (official) | 299K | 2026-10; PP-DocLayoutV3 + region recognizer |
| [MinerU2.5-Pro-2605](https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B) | 1.2B | Apache-2.0 (per HF) | 95.75 (official) | 33K | 2026-05; the MinerU tool carries extra terms |
| [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR) | 1.3B | MIT (layout model Apache-2.0) | 95.22 (official) | 2.06M | 2026-01; most downloaded in this table |
| [Xiaomi-OCR-0](https://huggingface.co/xiaomi-research/Xiaomi-OCR-0) | 0.87B | Apache-2.0 | 96.83 (self-reported) | 37K | 2026-09; also does document VQA |
| [Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni-en) | 5.3B | Tencent custom, EU excluded | 96.96 (self-reported) | 2K | 2026-10; also takes charts, audio, video |
| [Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en) | 3.34B | MIT | Not listed (predecessor 94.00) | 632K | 2026-10; parses hundred-page documents in one pass |
| [DeepSeek-OCR 2](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2) | 3.4B | Apache-2.0 | 90.25 (official) | 168K | 2026-01 |
| [dots.ocr](https://huggingface.co/dots-studio/dots.ocr) / [dots.mocr](https://huggingface.co/dots-studio/dots.mocr) | 3B | MIT + supplemental agreement | 90.77 (official, dots.ocr) | 315K / 54K | dots.mocr 2026-03, turns charts into SVG |
| [olmOCR 2](https://huggingface.co/allenai/olmOCR-2-7B-1025) | 8.3B | Apache-2.0 | Version not stated (board lists olmOCR at 85.74) | 83K + 177K for FP8 | 2025-10, Qwen2.5-VL-7B base |
| [Chandra OCR 2](https://huggingface.co/datalab-to/chandra-ocr-2) | ~4B | Modified OpenRAIL-M ($2M threshold) | Not listed | 1.27M | 2026-03 |
| [Surya OCR 2.5](https://huggingface.co/datalab-to/surya-ocr-2.5) | 0.69B | Modified OpenRAIL-M ($5M threshold) | Not listed | 150K | 2026-10; Marker's default VLM |
| [Granite-Docling 258M](https://huggingface.co/ibm-granite/granite-docling-258M) | 258M | Apache-2.0 | Not listed | 423K | Default model on Docling's VLM path |

The landscape in one line: **parameters going down, scores bunching up**. The official top five are all at or below 1.3B and score between 96.3 and 97.0; on the same board the 7B olmOCR sits at 85.74 and DeepSeek-OCR 2 (3B) at 90.25. For details on each, see the family posts and model cards: [olmOCR 2](/posts/tech/2026-11-23-ai-model-family-olmo-en), [Unlimited OCR 2](/posts/tech/2026-11-23-ai-model-family-ernie-en), [Granite-Docling](/posts/tech/2026-11-23-ai-model-family-granite-en).

## Licensing: the real dividing line

The technical gap at this layer is converging while the licensing gap widens. The license badge on the GitHub page **will mislead you**, because code and model weights can carry different licenses — and the same vendor can set different thresholds for different models.

The overview first:

| Type | Models / tools | Terms to watch |
|---|---|---|
| Clean Apache-2.0 / MIT | PaddleOCR-VL-1.6, MiniCPM-OCR 1.0, GLM-OCR, Xiaomi-OCR-0, Unlimited OCR 2, DeepSeek-OCR 2, Granite-Docling, Docling | Two-stage models also depend on their layout model (PP-DocLayoutV3 is Apache-2.0) |
| Apache-2.0 with use guidance | olmOCR 2 | Model card says "intended for research and educational use" and links Ai2's Responsible Use Guidelines |
| Permissive license + extra terms | MinerU, dots.ocr / dots.mocr | Attribution duty, prohibited uses, automatic termination on breach |
| Revenue / funding thresholds | Marker, Surya, Chandra, Indra (Datalab) | Thresholds vary by model, plus a competitor clause |
| Territorial exclusion | Youtu-Parsing / Youtu-Parsing-Omni (Tencent) | Not for use within the European Union |

**MinerU** returns `NOASSERTION` from the GitHub API because it uses the "MinerU Open Source License": Apache-2.0 as the base, plus additional terms. Open [LICENSE.md in the repo](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md):

> MinerU may be used for commercial purposes without a separate commercial license. However, if you and your Affiliates, on a consolidated basis, meet either of the following thresholds, you must obtain a separate commercial license from [MinerU Team] before continuing such use: a. monthly active users (MAU) exceed 100 million; or b. total monthly revenue exceeds USD 20 million.

That threshold is far away and irrelevant for most teams. **Sections 2 and 3 are the ones you will actually hit**: if you provide an online service built on MinerU, you must clearly and prominently indicate that fact in the product interface or public documentation — and failing the attribution obligation, or crossing the threshold without a license, means "this License and all rights granted under this License will terminate automatically, and no further notice from the Licensor is required." Automatic termination, no warning letter. Note that the MinerU2.5-Pro weights are tagged Apache-2.0 on Hugging Face while the additional terms live in the MinerU tool repo; neither side says which applies if you use the weights without the MinerU tool, so ask before shipping commercially.

**dots.ocr / dots.mocr** are labeled MIT on both GitHub and Hugging Face, but the Hugging Face repo also carries a "dots.ocr LICENSE AGREEMENT" (dots.mocr's is the same text, renamed). It is "subject to the MIT License" and explicitly allows commercial use, SaaS, and on-prem deployment — but section 3.3 lists prohibited uses whose breach automatically terminates the license. Two bear directly on document parsing: no unauthorized digitization of publications or bulk document scanning, and no extraction of sensitive personal data such as ID numbers or medical records without lawful authorization. Teams scanning contracts, medical records, or books will miss both if they stop at the MIT badge.

**Marker / Surya / Chandra / Indra** (from Datalab) share a two-file structure: `LICENSE` is plain Apache-2.0 (covering code), and the model weights use a modified AI Pubs OpenRAIL-M. Reading only the Apache-2.0 badge on GitHub misses the second entirely. Reading each model's license text in full, the free threshold (prior-year gross revenue **and** total funding raised must both be under it; personal and research use are exempt) varies by model:

| Model | Free threshold | License text |
|---|---|---|
| Chandra OCR 2 | **$2M** | [chandra-ocr-2 LICENSE](https://huggingface.co/datalab-to/chandra-ocr-2/blob/main/LICENSE) |
| Marker, Surya OCR 2.5 | **$5M** | [Marker MODEL_LICENSE](https://github.com/datalab-to/marker/blob/master/MODEL_LICENSE), [surya-ocr-2.5 LICENSE](https://huggingface.co/datalab-to/surya-ocr-2.5/blob/main/LICENSE) |
| Indra OCR (small CPU ONNX model) | **$20M** | [indra-ocr LICENSE](https://huggingface.co/datalab-to/indra-ocr/blob/main/LICENSE) |

The current [Datalab on-prem docs](https://documentation.datalab.to/docs/on-prem/overview) now match the license files (Chandra $2M, Marker and Surya $5M, code Apache 2.0). The earlier contradiction — README saying $5M, on-prem docs saying $2M and GPL — came from mixing different models' thresholds. All three licenses also share a competitor clause: if you (or your employer or affiliates) offer a product or service that competes with Datalab, you are outside the free tier regardless of revenue. For a company selling a document parsing API, that clause bites before any dollar threshold does.

**Youtu-Parsing / Youtu-Parsing-Omni** (Tencent Youtu Lab) ship a [LICENSE](https://huggingface.co/tencent/Youtu-Parsing-Omni/blob/main/LICENSE) structured like Apache-2.0, but section 0 states "Youtu-Parsing IS NOT INTENDED FOR USE WITHIN THE EUROPEAN UNION" and says this clause prevails in any conflict. Teams with EU customers or EU infrastructure should rule it out.

**Docling** is MIT, and its default VLM Granite-Docling is Apache-2.0. For commercial deployment it remains the cleanest tool on the list — unsurprising for an IBM Research project.

One more reminder: PyMuPDF, covered in [the previous post](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en), is AGPL-3.0. A single AGPL component anywhere in the pipeline forces a re-evaluation of the whole SaaS story.

## How to read the benchmarks

### OmniDocBench: the top has bunched up

OmniDocBench v1.6 is the score most 2026 OCR releases report. The official top five: OXR-1.0 97.03, TeleOCR 96.91, OvisOCR2 96.47, MiniCPM-OCR 1.0 96.44, PaddleOCR-VL-1.6 96.34 — five models within 0.69 points, all at or below 1.3B. Youtu-Parsing-Omni (96.96) and Xiaomi-OCR-0 (96.83) report their scores only in their own model cards; neither is on the official board.

Three discounts apply:

1. **The score is close to saturated.** Gaps at the top are smaller than gaps between sub-metrics: MiniCPM-OCR has the highest formula CDM at 98.08, but its table TEDS of 94.40 trails TeleOCR's 96.82. Whether your corpus is table-heavy or formula-heavy changes which model wins.
2. **The benchmark author also has a product.** OmniDocBench is maintained by OpenDataLab, the MinerU team. MinerU2.5-Pro ranks sixth on the official board rather than first, but the structural relationship exists.
3. **Keep self-reported and official numbers apart.** Self-reported scores use the vendor's own inference settings; board numbers come from the official harness.

### olmOCR-bench and OmniParseBench: Datalab's two yardsticks

olmOCR-bench is still the most-cited benchmark for English PDFs. Per the [Marker README](https://github.com/datalab-to/marker), run with the official checker, Marker 2.2 scores 83.7 in `vllm` mode, 76.0 in `balanced`, and 66.6 in CPU-only `fast`, against Docling's 50.3; Chandra OCR 2 self-reports 85.8 and olmOCR 2 self-reports 82.4. Datalab has also launched its own OmniParseBench (2,937 pages, 16,288 pass/fail tests, 92 languages), where Marker `vllm` scores 85.9, `balanced` 80.5, and Docling 67.5.

That looks clear-cut, but it needs two discounts:

1. **These are Datalab's numbers and Marker is Datalab's product.** Same yardstick applied to [anydoc earlier](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en) and to ParseBench: the author's product wins, and the structural bias is real. olmOCR-bench itself belongs to Ai2, but the official table in Ai2's README stops at the olmOCR v0.4.0 round; nearly every newer score is run by the vendor being scored.
2. **The mode changes the shape of failure, not just the score.** In the same README's per-category scores, arXiv math is 83.9 in `balanced`, 23.4 in `fast`, and 0.0 in `no_ocr`. The README confirms the mechanism: `--disable_ocr` (equivalent to `no_ocr`) will "Never call the VLM - pure text-layer extraction (equations and scanned pages are skipped)." Being several times faster does not cost you a few points evenly; it makes one entire document class fail.

Worth noting that this puts Marker's `no_ocr` mode architecturally back in the [extraction layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en) — with the VLM off, it is reading the text layer. That is not a criticism; it confirms the ladder's logic. The cheap path is cheap precisely because it is not inferring anything.

That is exactly how parsing-layer benchmarks mislead: **two tools with similar overall scores can fail in completely different places**. If your corpus is all old scans, the number to read is that category's score, not the total.

## Commercial APIs

LlamaParse, Azure Document Intelligence, Google Document AI, AWS Textract, Reducto, and Mistral OCR all live at this layer, trading money for accuracy and zero maintenance. Mistral OCR remains API-only, with no open weights on Hugging Face. For a full comparison of pricing and capabilities, see [the commercial document parsing API comparison](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en).

On the [ParseBench](https://github.com/run-llama/ParseBench) leaderboard (arXiv [2604.08538](https://arxiv.org/abs/2604.08538)), LlamaParse Agentic scores 84.88 overall at roughly 1.25¢ per page against Azure Document Intelligence's 73.8 (August 2026 v1 scores; v1 has since been re-scored, and the current reference is ParseBench 2, covered in the [commercial API comparison](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en)). But the same warning applies again: ParseBench is built by LlamaIndex, and the leader is their own product.

The more practical criterion is **your volume**. A cent per page across ten thousand pages is $100 and not worth a meeting; across ten million pages it is $100,000 and you should be running your own GPUs. Open-source costs engineering time plus hardware, commercial APIs cost per page — the crossover usually sits somewhere in the hundreds of thousands of pages. With 1B-class models bringing self-hosting down to a single consumer GPU, that crossover is moving lower.

## Choosing

1. **Read the LICENSE — all the way to the one covering weights** (`LICENSE` covers code; `MODEL_LICENSE` or the license file in the Hugging Face repo covers weights). Closed-source SaaS with growing revenue → Docling (MIT) for the tool, and pick models from the Apache/MIT group of PaddleOCR-VL, MiniCPM-OCR, and GLM-OCR. MinerU: remember the attribution obligation. dots.ocr: read the prohibited uses. Datalab models: check your revenue, funding, and whether you count as a competitor. EU business: avoid Youtu-Parsing.
2. **Then match your corpus.** Academic PDFs (formulas, two columns) → MinerU or a 1B model with a high formula score. General business documents at throughput → Marker `balanced`. Structured JSON rather than just Markdown → Docling. Chinese, scanned, or photographed documents → PaddleOCR-VL, MiniCPM-OCR, Xiaomi-OCR-0 — the group that scores high on Real5-OmniDocBench (scanning, warping, screen photos, lighting, skew). Hundred-page documents → Unlimited OCR 2.
3. **Volume decides build-vs-buy.** Below a few hundred thousand pages, ship the product on a commercial API with predictable cost; revisit when you outgrow it.
4. **Do not judge on overall scores.** Run the twenty hardest documents from your own corpus and look at how they break — the [scanned PDF benchmark](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en) did exactly that in August 2026, running 10 tools on 4 scanned exam papers: VLMs dominated on formulas, but installation pain was the real barrier. That test predates most of the new models in the table above, so they are not included.

## Overall

This is the most expensive, slowest, and least deterministic rung on the ladder, which makes the most important decision **using it as little as possible** — do not send it anything the [extraction layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en) can handle, let alone anything the [conversion layer](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en) can.

When you genuinely do land here, the order is: LICENSE → your corpus → per-category benchmark scores → run it yourself. Putting the overall benchmark ranking first is the most common selection mistake at this layer — especially now that the top five are less than a point apart.

The technology will keep converging. License terms will not improve on their own.

## Update log

- 2026-11-23: Model list refreshed to November 2026. Added a model table (PaddleOCR-VL-1.6, MiniCPM-OCR 1.0, MinerU2.5-Pro-2605, GLM-OCR, Xiaomi-OCR-0, Youtu-Parsing-Omni, Unlimited OCR 2, DeepSeek-OCR 2, dots.ocr / dots.mocr, olmOCR 2, Chandra OCR 2, Surya OCR 2.5, Granite-Docling); the tool table now shows 2026-11-23 GitHub figures and latest releases. The licensing section gains a license-type overview, dots.ocr's prohibited uses, and Youtu-Parsing's EU exclusion, and the Datalab thresholds are rewritten from each model's license text (Chandra $2M, Marker / Surya $5M, Indra $20M, plus a competitor clause) — the README vs. on-prem docs contradiction has been corrected in Datalab's docs. The benchmark section now uses first-party numbers from the Marker README (Marker 2.2's four modes) and adds how to read the OmniDocBench v1.6 official board. MinerU updated to version 2605, with an old score that could not be re-verified removed. The scanned PDF benchmark is marked as an August 2026 result.

## References

- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [MinerU Open Source License (LICENSE.md)](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)
- [opendatalab/MinerU2.5-Pro-2605-1.2B — Hugging Face model card](https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [ibm-granite/granite-docling-258M — Hugging Face model card](https://huggingface.co/ibm-granite/granite-docling-258M)
- [datalab-to/marker — GitHub (README with OmniParseBench and olmOCR-bench numbers)](https://github.com/datalab-to/marker)
- [Marker MODEL_LICENSE](https://github.com/datalab-to/marker/blob/master/MODEL_LICENSE)
- [datalab-to/surya — GitHub](https://github.com/datalab-to/surya)
- [datalab-to/surya-ocr-2.5 — Hugging Face model card](https://huggingface.co/datalab-to/surya-ocr-2.5)
- [datalab-to/chandra — GitHub](https://github.com/datalab-to/chandra)
- [datalab-to/chandra-ocr-2 — Hugging Face model card and LICENSE](https://huggingface.co/datalab-to/chandra-ocr-2)
- [datalab-to/indra-ocr — Hugging Face model card and LICENSE](https://huggingface.co/datalab-to/indra-ocr)
- [Datalab On-Prem overview (free-tier thresholds)](https://documentation.datalab.to/docs/on-prem/overview)
- [allenai/olmocr — GitHub (olmOCR-bench)](https://github.com/allenai/olmocr)
- [allenai/olmOCR-2-7B-1025 — Hugging Face model card](https://huggingface.co/allenai/olmOCR-2-7B-1025)
- [studio-dots-ai/dots.ocr — GitHub](https://github.com/studio-dots-ai/dots.ocr)
- [dots-studio/dots.ocr — Hugging Face (with the dots.ocr LICENSE AGREEMENT)](https://huggingface.co/dots-studio/dots.ocr)
- [dots-studio/dots.mocr — Hugging Face model card](https://huggingface.co/dots-studio/dots.mocr)
- [PaddlePaddle/PaddleOCR — GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- [PaddlePaddle/PaddleOCR-VL-1.6 — Hugging Face model card](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6)
- [openbmb/MiniCPM-OCR-1.0 — Hugging Face model card](https://huggingface.co/openbmb/MiniCPM-OCR-1.0)
- [zai-org/GLM-OCR — Hugging Face model card](https://huggingface.co/zai-org/GLM-OCR)
- [xiaomi-research/Xiaomi-OCR-0 — Hugging Face model card](https://huggingface.co/xiaomi-research/Xiaomi-OCR-0)
- [tencent/Youtu-Parsing-Omni — Hugging Face model card and LICENSE](https://huggingface.co/tencent/Youtu-Parsing-Omni)
- [baidu/Unlimited-OCR-2 — Hugging Face model card](https://huggingface.co/baidu/Unlimited-OCR-2)
- [deepseek-ai/DeepSeek-OCR-2 — Hugging Face model card](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2)
- [opendatalab/OmniDocBench — GitHub (v1.6 official leaderboard)](https://github.com/opendatalab/OmniDocBench)
- [ParseBench: A Document Parsing Benchmark for AI Agents (arXiv 2604.08538)](https://arxiv.org/abs/2604.08538)
- [run-llama/ParseBench — leaderboard](https://github.com/run-llama/ParseBench)
- [The Three-Layer Ladder of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en)
- [The Deterministic Extraction Layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)
- [DeepSeek-OCR: Compressing Long Context Into Images](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en)
- [Scanned PDF benchmark](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en)
- [Commercial document parsing API comparison](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en)
- [Model card: Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni-en)
- [Model card: Baidu Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en)
