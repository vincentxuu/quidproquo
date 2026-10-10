---
title: "Model Card: Youtu-Parsing-Omni"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-youtu]
lang: en
description: "Tencent's Youtu Lab open-sources Youtu-Parsing-Omni — a single 5B model with one encoder that parses documents, images, charts, geometry figures, audio and video, hitting the highest known OmniDocBench v1.6 score of 96.96"
tldr: "Youtu-Parsing-Omni: open-sourced 2026-10-09, HuggingFace ID `tencent/Youtu-Parsing-Omni`, 5B parameters, 1,048,576-token context window; OmniDocBench v1.6 overall score of 96.96 (a publicly reproducible leaderboard, over 4 points ahead of Gemini-3-Pro's 92.91), and an OmniParsingBench average of 75.08 — the highest among open-weight models, second only to Gemini-3-Pro's 77.44; a single Youtu-Omni-Encoder unifies seven input types (documents, natural images, charts, flowcharts, geometry figures, audio, video) into one OmniSchema JSON output, replacing the dual-tower architecture used by prior omni models; open weights, self-hosted only with no official API pricing, and its custom license explicitly excludes use within the EU"
series:
  name: "AI Model Tracker"
  order: 44
glossary:
  - term: "Youtu Lab"
    def: "Tencent's internal computer-vision and multimodal AI research team, the developer of the Youtu-VL, Youtu-LLM and Youtu-Parsing model series"
  - term: "OmniDocBench"
    def: "A public, standardized benchmark for document-parsing ability (layout, text, tables, formulas, reading order) that third parties can independently reproduce"
---

> 🌏 [中文版](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni)

## Model Info

| Field | Value |
|---|---|
| Model ID | `tencent/Youtu-Parsing-Omni` |
| Vendor | Tencent (Youtu Lab) |
| Parameters | 5B |
| Context Window | 1,048,576 tokens |
| Input Price (USD/1M tokens) | Not applicable (open weights, self-hosted only, no official hosted API) |
| Output Price (USD/1M tokens) | Not applicable (open weights, self-hosted only, no official hosted API) |
| Open Source | Yes (custom "License Terms of Youtu-Parsing," not Apache/MIT; the terms explicitly exclude use within the European Union) |
| Release Date | 2026-10-09 |
| Official Announcement | [GitHub: TencentCloudADP/youtu-parsing](https://github.com/TencentCloudADP/youtu-parsing) |
| HuggingFace | [tencent/Youtu-Parsing-Omni](https://huggingface.co/tencent/Youtu-Parsing-Omni) |
| Family | Youtu-Parsing (predecessor Youtu-Parsing 2.5B → this generation Youtu-Parsing-Omni 5B, adding omni-modal support) |

## Capability Highlights

- A single **Youtu-Omni-Encoder** ingests seven input types — document pages, natural images, charts, flowcharts, geometry figures, audio, and video — sharing one `(t, h, w)` positional encoding so pixels and sound live in the same bidirectional Transformer, instead of the usual two separately pretrained towers for vision and audio that only meet downstream inside the language model
- OmniDocBench v1.6 overall score of **96.96**, the highest known score on this public leaderboard, 4.05 points ahead of Gemini-3-Pro's 92.91, and ahead of specialized OCR models at similar scale (TeleOCR 1.2B's 96.91, PaddleOCR-VL-1.6's 96.34)
- OmniParsingBench (covering charts, geometry, natural images, audio, natural video, and text-rich video) average of **75.08**, the highest among open-weight models, trailing only the closed-source Gemini-3-Pro (77.44)
- All ten parsing tasks share one **OmniSchema** output format, trained with OSAD (OmniSchema-Aware On-Policy Distillation): the model samples its own rollouts and becomes its own next-round teacher, without a hand-designed reward function or a separately trained teacher model

## Benchmark Results

| Benchmark | Youtu-Parsing-Omni | Predecessor Youtu-Parsing (2.5B) | Strongest Competitor |
|---|---|---|---|
| OmniDocBench v1.6 (Overall) | 96.96 | 93.74 | Gemini-3-Pro 92.91 |
| OmniParsingBench (6-category avg.) | 75.08 | Not tested (predecessor lacked this) | Gemini-3-Pro 77.44 (closed-source, ahead by 2.36pp) |
| ChemOCR (chemical structure recognition, Tani@1.0) | 54.2 | Not tested | DeepSeek-OCR 2 (3B) 49.6 (but that model's Avg. Sim. of 74.9 is slightly ahead of this model's 74.6) |
| PDMX-Synth (music-score recognition, CER) | 22.73 | Not tested | LEGATO (a specialized optical music recognition model) 23.30 (this model narrowly ahead) |

⚠️ OmniDocBench and OmniParsingBench are public, standardized leaderboards that third parties can independently reproduce. ChemOCR and PDMX-Synth are self-reported results from the official technical report; neither is this model's primary use case (chemistry diagrams and sheet music, respectively) — they're included to show cross-domain generalization from a single model, not peak performance in a specialty.

## Comparison with Predecessor/Competitors

Compared with the predecessor Youtu-Parsing (2.5B, document parsing only), the biggest leap is expanding input coverage from "document pages only" to seven modalities — documents, natural images, charts, geometry figures, audio, and video — sharing one encoder and one output format, while the OmniDocBench score also improved from 93.74 to 96.96, showing that broadening modality coverage didn't come at the cost of the model's already-strongest capability.

Against competitors, Youtu-Parsing-Omni beats every listed rival on OmniDocBench — including Qwen3-VL-235B, which has 47x the parameters, and closed-source Gemini-3-Pro and GPT-5.2. But on OmniParsingBench's six sub-categories, it clearly trails Gemini-3-Pro on geometry figures (74.33 vs. 85.43) and natural images (62.84 vs. 69.73), showing its edge is concentrated in "structured inputs with fixed layout rules" (documents, charts) rather than open-ended natural-scene understanding. On the two non-primary tasks — chemical structure and sheet-music recognition — it only ties or narrowly beats specialized models, not a clean sweep.

Being an open-weight, self-hosted model, there's no directly comparable pricing strategy against closed-source rivals. But matching or beating some much larger closed-source models on specific tasks with only 5B parameters is itself a form of pricing strategy — trading compute cost for a smaller model.

## Implications for Agent Development

The biggest architectural signal here is doing all perception with one encoder. Historically, giving an agent the ability to handle documents, images, audio, and video at once meant wiring up several specialized models (an OCR model, an ASR model, a video-understanding model) and stitching their outputs together yourself. Youtu-Parsing-Omni collapses those outputs into one OmniSchema JSON format, effectively standardizing the "multimodal perception" layer into a single interface.

- If you're building document/knowledge-base processing pipelines: a 96.96 OmniDocBench score plus native support for LaTeX formulas, OTSL tables, and Mermaid flowchart output can directly replace a multi-stage "PDF-to-text plus a separate table-recognition pass" pipeline; at 5B parameters it's also small enough to self-host for batch jobs, so sensitive documents never have to leave your infrastructure for a closed-source API
- If you're building multimodal RAG or meeting/video summarization agents: the textrich_video task directly outputs a Markdown structured report of an entire video (with timestamped OCR and ASR), which can skip the usual DIY layer of slicing video and calling an LLM segment by segment
- Not a fit: agents that need strong open-domain scene understanding (robot vision, open natural-scene Q&A) — OmniParsingBench's natural-image and geometry scores clearly trail Gemini-3-Pro, since this model's training focus is structured parsing rather than open-ended visual reasoning; also note the license explicitly excludes use within the EU, so services targeting EU users need to check compliance separately

## Today's Takeaway

"Omni" in multimodal models usually refers to understanding many kinds of input, but Youtu-Parsing-Omni's real focus is unifying the output format — whatever you feed in, a document, a chart, or a video, it emits the same OmniSchema JSON. That suggests model-architecture competition is shifting from "whose inputs cover more modalities" toward "who can collapse multimodal output into one standard interface that's easy for downstream systems to plug into" — and the latter matters more to anyone actually wiring these models into an agent pipeline.

## References

- [HuggingFace: tencent/Youtu-Parsing-Omni model card](https://huggingface.co/tencent/Youtu-Parsing-Omni)
- [GitHub: TencentCloudADP/youtu-parsing](https://github.com/TencentCloudADP/youtu-parsing)
- [HuggingFace: tencent/Youtu-Parsing-Omni LICENSE](https://huggingface.co/tencent/Youtu-Parsing-Omni/blob/main/LICENSE)
- [arXiv 2601.20430: Youtu-Parsing (predecessor document-parsing model technical report)](https://arxiv.org/abs/2601.20430)
- [arXiv 2601.19798: Youtu-VL (vision encoder technical report)](https://arxiv.org/abs/2601.19798)
- [arXiv 2512.24618: Youtu-LLM (language model backbone technical report)](https://arxiv.org/abs/2512.24618)
- [OmniDocBench: public standardized document-parsing leaderboard](https://github.com/opendatalab/OmniDocBench)
