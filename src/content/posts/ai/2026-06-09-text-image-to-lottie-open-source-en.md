---
title: "Text / Image to Lottie: A Landscape Overview of AI Animation Generation Tools"
date: 2026-06-09
category: ai
type: deep-dive
tags: [lottie, animation, open-source, llm, vlm, vector-animation]
lang: en
tldr: "From the CLI tool kin3o to the CVPR 2026 paper OmniLottie — a survey of open-source approaches for converting text and images into Lottie animations, with performance benchmarks and selection guidance."
description: "A landscape overview of open-source tools for generating Lottie vector animations from text, images, and video: OmniLottie, LottieGPT, AnimTOON, kin3o, and the trade-offs between each technical approach."
draft: false
---

🌏 [中文版](/posts/ai/2026-06-09-text-image-to-lottie-open-source)

Lottie is Airbnb's JSON-based vector animation format, introduced in 2015 and now the de facto standard for lightweight UI animations on iOS, Android, and the web. Yet for years there were no good open-source tools to turn a plain text description or a single image into a ready-to-run Lottie animation.

Early 2026 brought a qualitative leap: two CVPR papers simultaneously proposed end-to-end vector animation generation frameworks, and two developer-focused tools make it possible to get started today. This post surveys the technical approaches, benchmarks, and how to choose between them.

## Why Is It So Hard to Have an LLM Generate Lottie Directly?

Understanding the core difficulty starts with the format itself — Lottie is not LLM-friendly.

A typical Lottie JSON averages around **18,202 raw tokens** (per benchmark data from the [AnimTOON paper](https://github.com/srk0102/AnimTOON)), and the format has several traps:

- **Implicit conventions**: colors are 0–1 floats (not 0–255), time is expressed in frame numbers (not seconds), and easing uses Bézier control points — all things LLMs routinely get wrong
- **Strict nesting**: multi-level JSON nesting of `layers → shapes → keyframes` means a single malformed node breaks everything
- **Verbose boilerplate**: large amounts of fixed metadata eat into the token budget, leaving little room for the actual animation logic

The [OmniLottie (CVPR 2026)](https://arxiv.org/abs/2603.02138) paper directly quantifies this: when GPT-5 generates Lottie JSON directly, the **success rate is only 9.2%**; for Gemini 3.1 Pro it is **0%**. This isn't a model capability problem — it's a format problem.

## Four Technical Approaches

```
Approach A: LLM Prompt Engineering
  Text → Claude / GPT generates JSON → Validate + auto-fix → .lottie
  Pros: No GPU needed, usable today
  Cons: Quality bounded by LLM capability, unstable for complex animations

Approach B: End-to-End VLM Fine-tuning
  Text / Image / Video → Custom tokenizer compression → Qwen2.5-VL → .lottie
  Pros: Highest quality, rigorous academic benchmarks
  Cons: High hardware requirement (~15 GB VRAM), training code not open-sourced

Approach C: Intermediate Format + Smaller Model
  SVG + Text → AnimTOON format (166 tokens) → 3B LoRA → Converter → .lottie
  Pros: Runs on consumer GPU (~5 GB), highest token efficiency
  Cons: SVG input required — text alone is not sufficient

Approach D: Static SVG Conversion
  SVG → Corresponding Lottie layer structure → .json (no animation)
  Pros: Deterministic, 100% reliable, mature tooling
  Cons: Format conversion only — no animation is added
```

---

## kin3o (Approach A)

**[kin3o](https://github.com/affromero/kin3o)** is the most immediately usable text-to-Lottie tool available today. Rather than training a model, it wraps LLM calls with careful engineering around them:

```bash
npx @afromero/kin3o generate "pulsing circle that breathes"
npx @afromero/kin3o generate "toggle switch with on/off states" --interactive
```

The core design principle is "let the LLM generate, handle everything else ourselves": a carefully crafted system prompt with few-shot examples steers Claude or Codex away from common mistakes, followed by JSON extraction, structural validation, and auto-fix (RGB 0–255 → 0–1, missing fields, malformed keyframes) before writing to disk.

It supports three AI providers: Claude Code CLI (auto-detects an existing logged-in session), Codex CLI, or a direct Anthropic API key. The `--interactive` flag outputs a dotLottie state machine with hover/click states, and it also integrates with LottieFiles marketplace search and publishing.

**When to choose kin3o**: no GPU to install, need something working immediately, output that can be git-diffed.  
**Not suitable for**: complex multi-layer animations, image input, or strict quality requirements.

---

## OmniLottie (Approach B)

**[OmniLottie](https://github.com/OpenVGLab/OmniLottie)** ([arXiv:2603.02138](https://arxiv.org/abs/2603.02138), CVPR 2026) is the most academically rigorous solution available, and the first end-to-end Lottie generation framework to support text, image, and video as inputs.

The core innovation is the **Lottie Tokenizer**: it decomposes the nested structure of raw Lottie JSON into three categories of command tokens — shape, effect, and animation — compressing the 18,202-token raw format down to approximately 20–40k custom tokens. Qwen2.5-VL is then fine-tuned on this compressed vocabulary, allowing the model to focus on learning animation semantics rather than format details.

The training dataset **MMLottie-2M** contains 2 million Lottie animations with text, keyframe, and video annotations, paired with the evaluation benchmark **MMLottieBench** (900 samples, Real and Synthetic subsets).

Results on MMLottieBench (from [arXiv:2603.02138](https://arxiv.org/abs/2603.02138) Table 1):

| Method | Success Rate | Avg. Generation Time | Object Alignment | Motion Alignment |
|--------|-------------|---------------------|-----------------|-----------------|
| [OmniLottie](https://github.com/OpenVGLab/OmniLottie) | **88.3%** | **~29s** | 4.44 | **5.94** |
| [GPT-5](https://openai.com/) | 9.2% | ~46s | — | 13.34 |
| [Gemini 3.1 Pro](https://deepmind.google/technologies/gemini/) | 0% | ~39s | — | — |
| [Qwen2.5-VL (3B)](https://github.com/QwenLM/Qwen2.5-VL) | 0% | ~21s | — | — |

On the text-image-to-Lottie task, OmniLottie is **52× faster** than AniClipart (88s vs 1212s) with a 93.3% success rate.

**Limitations**: inference requires ~15 GB VRAM (⚠️ this figure comes from AnimTOON's comparison table, not officially confirmed), output frame rate is only 8 fps, and training code is not yet open-sourced.

---

## LottieGPT (Approach B — not yet available)

**[LottieGPT](https://github.com/yisuanwang/LottieGPT)** ([arXiv:2604.11792](https://arxiv.org/abs/2604.11792), CVPR 2026) follows a similar path to OmniLottie but with a different tokenizer design: it uses keyframe-based temporal compression, encoding only keyframes and interpolation functions rather than every frame, achieving lossless roundtrip (decoded animation is perfectly identical to the original rendering).

The training dataset is larger: **LottieImage-15M** (15 million static images) + **LottieAnimation-660K** (660k animations), using a two-stage training strategy — learn statics first, then learn motion.

**⚠️ Important**: as of 2026-06-09, inference code and model weights **have not been released** (the open-source plan checkbox on GitHub remains unchecked). This one is paper-only for now.

---

## AnimTOON (Approach C)

**[AnimTOON](https://github.com/srk0102/AnimTOON)** takes a completely different angle: rather than having the model generate shapes, it separates shape from animation.

The idea is that the model only needs to generate "animation keyframe descriptions"; shapes are extracted from the input SVG and combined deterministically by a Converter. This compresses model output to **166–597 tokens** instead of OmniLottie's 4k–40k:

```
# AnimTOON format example (a complete animation in just 166 tokens)
anim fr=30 dur=120

layer Logo shape
  fill #000000
  path sh x2
  pos [0.5,0.5]
  rot 0.0->-67 0.04->46 0.14->-31 0.28->0 ease=bounce
  scale 0.0->[0,0] 0.14->[90,90] 0.28->[100,100] ease=smooth
  opacity 0.0->0 0.14->100 ease=fade
```

Quantitative comparison with OmniLottie (from [AnimTOON README benchmark](https://github.com/srk0102/AnimTOON)):

| Metric | [AnimTOON](https://github.com/srk0102/AnimTOON) | [OmniLottie](https://github.com/OpenVGLab/OmniLottie) |
|--------|----------|------------|
| Output tokens (simple) | **166** | 616 |
| Output tokens (complex) | **597** | 4,095 |
| Generation time | **13–38s** | 55–120s+ |
| Frame rate | **30 fps** | 8 fps |
| Inference VRAM | **~5 GB** | ~15.2 GB |
| Custom tokenizer | **No (plain text)** | Yes (40k tokens) |
| Format success rate | **100%** (converter guaranteed) | 88.3% |

**Limitations**: SVG input is required (cannot generate shapes from text alone), training is not yet complete (~60%), and the community is very small (Stars: 5). Best suited for scenarios where you already have SVG artwork and want animation added automatically.

---

## Static SVG → Lottie Conversion Tools

If the requirement is format conversion rather than animation generation, these tools are more reliable:

- **[python-lottie](https://mattbas.gitlab.io/python-lottie)**: the Swiss Army knife of format conversion, supporting bidirectional conversion between SVG, GIF, Synfig, Telegram TGS, WebP, dotLottie, and more — the most mature non-AI option
- **[stepancar/svg-to-lottie](https://github.com/stepancar/svg-to-lottie)**: JavaScript implementation, CLI + browser API, supports basic shapes like rect, circle, and path
- **[marciogranzotto/lottie-tools](https://github.com/marciogranzotto/lottie-tools)**: web-based editor, allows SVG import followed by manual keyframe animation, then export to Lottie JSON

These tools produce static Lottie output (shapes are preserved; animation must be added manually) and are appropriate when deterministic results are required and AI output instability is unacceptable.

---

## Comparison with Commercial Solutions

| | [LottieFiles Motion Copilot](https://lottiefiles.com/) | [Rive](https://rive.app/) | [Lottielab](https://www.lottielab.com/) |
|---|---|---|---|
| Input | Text (within editor) | Visual editing | Visual editing |
| Skeletal animation | No | ✅ with mesh deformation | No |
| Runtime interactivity | Limited | ✅ (mouse, sliders) | Limited |
| Open source | No | Player is open source | No |
| LLM-generatable format | ✅ (JSON) | ❌ (binary .riv) | ✅ (JSON) |

Rive is far ahead on skeletal animation and runtime interactivity, but its `.riv` format is binary — LLMs cannot generate it directly. This is where the Lottie open-source ecosystem has an inherent advantage: JSON is naturally AI-friendly.

Commercial AI features (Motion Copilot, etc.) integrate designer workflows (editor + asset library + collaboration), which open-source tools currently lack. But the quality gap in pure generation is closing quickly.

---

## How to Choose

| Scenario | Recommended Tool |
|----------|-----------------|
| Need something working now, no GPU to install | **kin3o** |
| Image or video input required | **OmniLottie** |
| Already have SVG, want animation added, limited GPU memory | **AnimTOON** (once training completes) |
| Research / want to fine-tune on MMLottie-2M | **OmniLottie** or **LottieGPT** (the latter, once code is released) |
| Format conversion only, no animation needed | **python-lottie** |
| Skeletal animation / runtime interactivity | **Rive** (outside the open-source Lottie ecosystem) |

The open-source tooling in this space only matured in the first half of 2026 — OmniLottie and LottieGPT were both accepted at CVPR this year, and AnimTOON is still in training. For UI animation work today, kin3o is the lowest-friction entry point. If you need higher-quality image-driven generation, OmniLottie is already usable.

## References

- [OmniLottie GitHub](https://github.com/OpenVGLab/OmniLottie)
- [OmniLottie paper (arXiv:2603.02138)](https://arxiv.org/abs/2603.02138)
- [OmniLottie HuggingFace model page](https://huggingface.co/OmniLottie/OmniLottie)
- [MMLottieBench Dataset](https://huggingface.co/datasets/OmniLottie/MMLottieBench)
- [LottieGPT GitHub](https://github.com/yisuanwang/LottieGPT)
- [LottieGPT paper (arXiv:2604.11792)](https://arxiv.org/abs/2604.11792)
- [AnimTOON GitHub](https://github.com/srk0102/AnimTOON)
- [kin3o GitHub](https://github.com/affromero/kin3o)
- [kin3o website](https://kin3o.com/)
- [python-lottie](https://mattbas.gitlab.io/python-lottie)
- [stepancar/svg-to-lottie](https://github.com/stepancar/svg-to-lottie)
- [marciogranzotto/lottie-tools](https://github.com/marciogranzotto/lottie-tools)
