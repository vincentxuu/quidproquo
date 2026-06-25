---
title: "DeepSeek-OCR: The 10x Compression Experiment That Turns Long Context into Images"
date: 2026-05-09
type: deep-dive
category: ai
tags: [ocr, deepseek, vision-language-model, long-context, context-compression, rag]
lang: en
tldr: "DeepSeek-OCR's paper is titled Contexts Optical Compression -- OCR is just the means; what it actually validates is that 'rendering text as images and feeding them to a VLM' achieves 10x compression at 97% accuracy. This is a qualitative shift for long-context LLM and RAG token costs."
description: "DeepSeek-OCR is not just another OCR model. Its architecture (DeepEncoder + 3B-MoE-A570M), five resolution modes, comparisons with LightOnOCR, PaddleOCR-VL, olmOCR-2, and Chandra, plus its real research ambition -- compressing LLM long context with vision tokens."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression)

October 2025 was an OCR explosion -- over six open-source OCR/VLM models released in a single month. But DeepSeek-OCR is not just another one riding the wave. Its paper is titled **Contexts Optical Compression**: OCR is the means; context compression is the goal. If this approach works out, the cost of long context in future LLMs may no longer be measured in token count, but in pixel count.

## What It's Betting On

The core bottleneck of current LLMs processing long text is attention's O(n²). 10,000 tokens means 10,000 discrete processing steps, regardless of how much information density those tokens carry.

DeepSeek's bet: **a 1024x1024 document image can be represented with 10x fewer vision tokens than text tokens, while still achieving 97% accuracy when decoded back to the original text**.

Key experimental results from the paper:

| Compression ratio (text tokens / vision tokens) | OCR accuracy |
|---|---|
| < 10x | **97%** |
| 20x | ~60% |

In other words, 1 vision token can carry roughly the information of 10 text tokens, nearly losslessly. If this conclusion extends to general text (not just OCR), it effectively creates a compression channel for LLM context windows.

## Architecture: Two-Stage

```
Input image (e.g. 1024×1024)
    ↓
DeepEncoder (380M)
  ├── SAM visual features
  ├── CLIP semantic features
  └── 16× compressor → few vision tokens (64~1853)
    ↓
DeepSeek3B-MoE-A570M (3B params, 570M activated per token)
    ↓
Text output (plain text / Markdown / HTML tables / grounding coordinates)
```

Key design points:
- **DeepEncoder** maintains low activation under high-resolution input -- this is the key to throughput
- **MoE decoder** has 3B total parameters but only activates 570M, so inference cost is close to a small model
- **SAM + CLIP concatenation** gives it stronger visual grounding capability than typical OCR models

## Five Resolution Modes

At inference time, you choose how many vision tokens to spend:

| Mode | base_size | image_size | crop_mode | Use case |
|---|---|---|---|---|
| Tiny | 512 | 512 | false | Simple pages, speed priority |
| Small | 640 | 640 | false | General documents |
| Base | 1024 | 1024 | false | Balanced option |
| Large | 1280 | 1280 | false | Detail-dense content |
| **Gundam** | 1024 | 640 | **true** | Multi-column, mixed tables (multi-tile slicing) |

For complex layouts (academic papers, newspapers), you must enable Gundam for practical accuracy. In the paper's newspaper tests, because each page had 4,000-5,000 text tokens, Gundam was required to keep the compression ratio below 10x.

## Two Comparison Groups on OmniDocBench

DeepSeek-OCR deliberately picked two extreme opponents:

| Model | tokens / page | Result |
|---|---|---|
| GOT-OCR 2.0 | 256 | baseline |
| **DeepSeek-OCR** | **100** | wins |
| MinerU 2.0 | 6000+ | baseline |
| **DeepSeek-OCR** | **< 800** | wins |

The first group proves "token count can be even lower"; the second proves "even when the opponent uses 7-8x more tokens, I still win with fewer." Production throughput: **200,000+ pages per day on a single A100-40G**, clearly optimized for "generating training data for LLMs/VLMs."

## Contemporary Competitors: The Pure OCR Track

If all you need is PDF-to-Markdown conversion, 2025 actually offers more choices:

| Model | Params | olmOCR-Bench | Speed (pages/s) | Highlight |
|---|---|---|---|---|
| LightOnOCR | 1B | 76.1 | **5.55** | Fastest, cheapest |
| **DeepSeek-OCR** | 3B (570M MoE) | 75.7 | 4.65 | Fewest vision tokens |
| PaddleOCR-VL | 0.9B | 80.0 | 2.20 | Most compact, multilingual |
| dots.ocr | 3B | 79.1 | 1.94 | 100+ languages incl. low-resource |
| olmOCR-2 | 7B | 82.4 | 1.78 | RLVR training, strong handwriting |
| Chandra-OCR | 8B | **83.1** | 1.29 | Best handwriting, multi-format output |

Looking at the OCR task alone, **the most accurate are Chandra and olmOCR-2; the best speed-to-cost ratio goes to LightOnOCR**. DeepSeek-OCR does not stand out on this dimension.

Its true uniqueness lies in **achieving near-first-tier accuracy with the fewest vision tokens** -- and that is exactly the evidence the "optical compression" research direction needs.

## The Real Peers: Research Direction

If you place DeepSeek-OCR back on the "visual context compression" research track, its true peers are only two or three:

### Vist (Vision-centric Token Compression, NeurIPS 2025 spotlight)

- **Slow-fast dual pathway** architecture, mimicking human "scanning + close reading"
- Fast path: distant tokens rendered as images, processed by a frozen lightweight vision encoder for an overview
- Slow path: nearby tokens kept as text, fed to the LLM for close reading
- Result: at the same accuracy, tokens down 2.3x, FLOPs down 16%, memory down 50%

### Glyph (Tsinghua, October 2025, same period)

- Same idea of "render text as images and feed to a VLM"
- Discussed alongside DeepSeek-OCR during the same week

DeepSeek-OCR's contribution on this track is **pushing the compression ratio to its maximum (10x) and validating accuracy**, while Vist provides a more engineering-oriented application framework (dual pathway rather than full image).

## Implications for RAG and Long Context

At the end of the paper, DeepSeek hints at an interesting direction: **memory decay mechanisms**. Older conversations/context stored at higher compression ratios (blurrier images, fewer tokens), recent context stored at lower compression (clear) -- simulating the brain's memory decay.

For practitioners actually building RAG systems, here are some pragmatic trade-offs in the near term:

| Scenario | Recommendation |
|---|---|
| Pure markdown / plain text content | No OCR needed; chunking + embedding is still the optimal solution |
| Need to ingest external PDFs / slides / screenshots | PaddleOCR-VL 0.9B (compact) or Chandra (most accurate) |
| Want to experiment with "infinite context" | Follow Vist and DeepSeek-OCR's subsequent work |
| Cloudflare Workers / edge environments | Can't run locally; must use external GPU APIs (vLLM, SGLang already supported) |

DeepSeek-OCR released **weights and methodology**, not a product. It produced reproducible experimental evidence for a direction previously only discussed in papers (visual modality as compression channel), which is more significant than "yet another OCR SOTA."

## The Bottom Line

DeepSeek-OCR is a **research experiment dressed up as OCR**. It's not the most accurate at the OCR task, but it proves that vision tokens can carry 10x the information density of text tokens. If you just want document parsing, choose Chandra or olmOCR-2; if you want to understand how LLM long context might evolve, the DeepSeek-OCR paper is worth reading from start to finish.

The paper explicitly states the next steps: digital-optical text interleaved pretraining, needle-in-a-haystack testing. If those experiments also succeed, the definition of LLM context windows will truly need to be rewritten.

## References

- [DeepSeek-OCR on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-OCR)
- [DeepSeek-OCR: Contexts Optical Compression (arXiv:2510.18234)](https://arxiv.org/abs/2510.18234)
- [DeepSeek-OCR GitHub](https://github.com/deepseek-ai/DeepSeek-OCR)
- [vLLM Official Support Docs](https://docs.vllm.ai/projects/recipes/en/latest/DeepSeek/DeepSeek-OCR.html)
- [Vist: Vision-centric Token Compression in LLM (NeurIPS 2025)](https://openreview.net/forum?id=YdggdEL41C)
- [olmOCR-2-7B](https://huggingface.co/allenai/olmOCR-2-7B-1025)
- [Chandra-OCR](https://huggingface.co/datalab-to/chandra)
- [PaddleOCR-VL](https://huggingface.co/PaddlePaddle/PaddleOCR-VL)
- [dots.ocr](https://huggingface.co/rednote-hilab/dots.ocr)
- [Hugging Face: Supercharge your OCR Pipelines with Open Models](https://huggingface.co/blog/ocr-open-models)
- [E2E Networks: 7 Best Open-Source OCR Models 2025](https://www.e2enetworks.com/blog/complete-guide-open-source-ocr-models-2025)
- [MinerU 2.5: Decoupled VLM for Document Parsing (arXiv:2509.22186)](https://arxiv.org/abs/2509.22186)
