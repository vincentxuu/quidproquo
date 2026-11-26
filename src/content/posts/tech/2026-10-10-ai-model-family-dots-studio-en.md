---
title: "The Dots Studio Dots Family: dots3-note Preview's Long-Context MoE, Multimodal Input, and Self-Hosting"
date: 2026-10-10
category: tech
type: deep-dive
tags: [dots-studio, dots3, moe, long-context, reasoning, open-weight]
lang: en
tldr: "dots3-note Preview is a 280B-total / 16B-active MoE from Xiaohongshu's Dots Studio with a 512K context. Weights and modeling code are on Hugging Face and GitHub under Apache 2.0, and the FP8 build self-hosts on one 8-GPU node. The OpenRouter free endpoint accepts only text and images and expires on 2026-12-31. Official benchmarks trade wins with similarly sized Hy3 and DeepSeek-v4-flash; the technical report is not out yet."
description: "dots3-note Preview's model matrix, architecture, self-reported benchmarks, Apache 2.0 weights and self-hosting, the limits of the OpenRouter free endpoint, and how the Dots family evolved from dots.llm1 to dots3."
series:
  name: "AI Model Families"
  order: 28
draft: false
---

> :globe: [中文版](/posts/tech/2026-10-10-ai-model-family-dots-studio)

Dots Studio is the model team at Xiaohongshu (RedNote). Its current flagship is dots3-note Preview, a multimodal MoE with 280B total and 16B active parameters, a 512K context, and Apache 2.0 weights. It suits teams that want a self-hostable, long-context agent model that reads images and audio without moving to trillion-parameter scale. After reading, you can decide whether to start with the OpenRouter free endpoint or deploy straight onto your own 8-GPU node, and what to test before going live.

## Family positioning and model matrix

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| dots3-note Preview (`dots-studio/dots3-note-prev`) | Lightest member of the dots3 series; reasoning and long-horizon agents | 280B total / 16B active; 512K context; text, image, video, and audio in, text out | Hugging Face, ModelScope, GitHub; Apache 2.0; BF16 |
| dots3-note Preview FP8 (`dots-studio/dots3-note-prev-fp8`) | FP8-quantized build of the same model | Officially recommended for a single 8-GPU node | Same as above |
| OpenRouter `dots-studio/dots-3-note-preview:free` | Free hosted trial | AtlasCloud is the only provider, FP8; text and image input only; expires 2026-12-31 | OpenRouter API |
| dots.ocr / dots.mocr, dots.tts | Document parsing and speech synthesis lines | Small models on their own release cadence | Hugging Face; licenses vary, see Family evolution |

The official blog says the full dots3 series will include note, jazz, and aria, separated by task complexity, response speed, and compute cost. Jazz and aria have no weights, published specs, or dates yet.

Two points are easy to confuse. First, the weights support more modalities (text, image, video, audio) than the OpenRouter free endpoint (text, image); testing audio or video means self-hosting. Second, "Preview" is the team's own label: reinforcement learning is not finished, as covered under Limitations.

## Family evolution

| Model | When | Key facts | What changed for selection |
|---|---|---|---|
| dots.llm1 | 2025-05 | 142B total / 14B active text MoE, English and Chinese, MIT | Dots' first open-weight general model, released with intermediate training checkpoints |
| dots.ocr | 2025-07 | Multilingual document parser on a 1.7B LLM, unifying layout detection and content recognition, MIT | A self-hostable small model for document parsing instead of using a general model for OCR |
| dots.vlm1 | 2025-08 | Self-trained 1.2B NaViT vision encoder on DeepSeek V3, MIT | The first vision-language model, but on another lab's base |
| dots.mocr | 2026-03 | Beyond document parsing, converts structured graphics such as charts, UI layouts, and scientific figures directly into SVG code, MIT | The OCR line extends into "image to structure" |
| dots.tts | 2026-06 to 08 | 2B continuous autoregressive TTS (48 kHz); base is Apache 2.0, the dots.tts.edit variant has a separate license | An in-house speech output model, separate from dots3's speech understanding |
| dots3-note Preview | mid-August 2026 | 280B / 16B multimodal MoE, 512K, Apache 2.0, in-house architecture submitted to Transformers | The main line moves from "text MoE plus bolt-on vision" to one model for text, images, video, and audio; every other section of this post is about it |

The shift: in 2025 each modality got its own model, often on an external base; dots3 puts perception and reasoning into one in-house MoE and moves the license from MIT to Apache 2.0. OCR and TTS stay as separate small-model lines.

## Architecture and training trade-offs

### Architecture: sparse MoE with hybrid attention

The Hugging Face model card publishes this architecture:

| Item | Value |
|---|---|
| Layers | 1 dense + 45 MoE |
| Experts | 256 routed + 1 shared, top-8 per token |
| Attention | 13 DSA layers (top-2048) + 33 sliding-window layers, about 1:3 |
| MTP | 1 shared layer, 1.13B, usable for speculative decoding |
| Vision encoder | MoE ViT, 7B total / 1.2B active |
| Audio encoder | Dense, 800M |
| Vocabulary | 152K |
| Precision | BF16, FP8 |

Two trade-offs follow.

- **Active parameters are not deployment memory.** 16B active sets per-token compute, but all 280B weights still have to load. The smallest official deployment is the FP8 build on one 8-GPU node; BF16 needs more memory.
- **Long context rests on sparse attention.** Three quarters of the layers see only a sliding window, and the rest use DSA to pick 2,048 tokens from the long sequence. That makes 512K feasible, but long-range information has to pass through a few global layers; test detail retrieval in long documents yourself rather than trusting the window size.

### Training: reinforcement learning on long-horizon tasks

The official blog centers training on long-horizon agents. It introduces TEMPO (Test-time-scaled Value Estimation with Macro-step Policy Optimization): a rollout that can run more than ten hours is split into macro-steps, and at the end of each one the same agent switches to a critic that uses reasoning and tools to estimate the remaining return, so the policy can update before the task ends. On ARC-AGI-3, the team reports TEMPO's average score 31.5% above the baseline checkpoint and 20.6% above GRPO.

The team also built thousands of ultra-long-horizon environments that need no prior knowledge, training the model to explore unfamiliar settings, write its own memory file, and use it in later decisions. The blog's IMO 2026 result came from a branch of dots3-note Preview plus an internal harness, not from the released weights themselves.

Training data, token budget, and architecture details are promised for the technical report; the model card still lists it as "coming soon".

## Evaluation and alternatives

All numbers below are self-reported in the appendix of Dots Studio's blog. Scores marked * are ones Dots ran for other models; the rest are each vendor's published figures. The table compares two open-weight MoEs of similar size, with Claude Opus 4.8 as an upper reference:

| Benchmark | dots3-note Preview (280B / 16B) | Hy3 (295B / 21B) | DeepSeek-v4-flash-0731 (284B / 13B) | Claude Opus 4.8 |
|---|---|---|---|---|
| SWE-bench Verified | 78.4 | 78.0 | – | 88.6 |
| SWE-bench Pro | 61.0 | 57.9 | – | 69.2 |
| Terminal-Bench 2.1 | 75.1 | 71.7 | 82.7 | 84.6 |
| BrowseComp (context management) | 83.3 | 84.2 | 74.5* | 84.3 |
| WildClawBench | 61.7 | 53.6 | 66.0* | 68.0 |
| Toolathlon-Verified | 55.6 | 56.8 | 70.7 | 76.2 |
| IFBench | 80.4 | 74.6* | 78.7* | 62.2 |

Three cautions for reading it.

- **Same-size results are mixed.** Roughly level with or slightly ahead of Hy3; against DeepSeek-v4-flash-0731 it trails clearly on coding agents (Terminal-Bench, Toolathlon) and leads on instruction following and some search tasks.
- **Harnesses differ.** The SWE series uses live-swe-agent, Terminal-Bench uses Terminus-2, WildClawBench uses OpenClaw, and temperature and context caps vary by row; do not sum across rows.
- **The ARC-AGI-2 score of 81.4 is not comparable.** Dots ran it on the public evaluation set, while most other models' figures are private-set leaderboard scores, so it is left out of the table.

On multimodal tasks, the team reports MMMU-Pro 79.1, CharXiv Reasoning 83.1, VideoMMMU 86.8, VoiceBench 92.4, and MMAU-Pro 69.8. Kimi K3 and Gemini-3.5-flash score higher on most rows of the same table, which puts dots3-note mid-pack there rather than in the lead.

There is no independent reproduction. Re-test on your own tasks before going live.

## Licensing, pricing, and deployment

### License

The weights and modeling code are licensed under **Apache 2.0**, with the full LICENSE file in the Hugging Face repository. The copyright holder is Xiaohongshu; Dots Studio develops and releases the model. The GitHub repository `studio-dots-ai/dots3-note-prev` is also Apache 2.0. Apache 2.0 permits commercial use, modification, and redistribution, provided license and copyright notices are kept; Transformers, SGLang, vLLM, and other third-party software carry their own licenses.

### Pricing

| Channel | Price | Limits |
|---|---|---|
| OpenRouter `dots-studio/dots-3-note-preview:free` | Free | AtlasCloud (FP8) only; text and image input; max output 460,800 tokens; expires 2026-12-31; free-tier rate limits apply |
| Self-hosting | Hardware cost | See below |

The API access link in the official blog points to this same OpenRouter free endpoint, and no separate paid price list is published. It is good for evaluation, not as a long-term dependency: one provider and a fixed expiry date.

### Self-hosting

- **vLLM**: native support on `main`; use a nightly until a stable release includes it. The official example serves the FP8 build on eight H100s with TP=8 and EP=8 and `--max-model-len 262144`.
- **SGLang**: an official `lmsysorg/sglang:dev-dots3-note` image and cookbook can serve the full 524,288 context; source support is still in review in PR #33829.
- **Transformers**: the official docs now include `dots3_note` (merged 2026-11-12), suited to small-scale inference and debugging; multi-GPU serving still points to SGLang or vLLM.
- **Common flags**: `enable_thinking` toggles reasoning mode; tool calling uses `--tool-call-parser dots`; for text-only use, `--language-only` (SGLang) or `--language-model-only` (vLLM) skips the vision and audio encoders; the team says MTP speculative decoding can cut TPOT by more than half.

### API example

A self-hosted server exposes an OpenAI-compatible interface. Below is the model card's minimal request; for OpenRouter, change `base_url` to `https://openrouter.ai/api/v1` and `model` to `dots-studio/dots-3-note-preview:free`. We did not run this code:

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="EMPTY")
response = client.chat.completions.create(
    model="dots3-note-prev",
    messages=[{"role": "user", "content": "Summarize the following text and cite the source passage for each conclusion: ..."}],
    temperature=1.0,
    top_p=0.95,
    max_tokens=1024,
    extra_body={"chat_template_kwargs": {"enable_thinking": False}},
)
print(response.choices[0].message.content)
```

## Agent integration and selection

### Pairing long context with RAG

512K is worth trying for cross-chapter summaries, comparing several documents in one question, or asking the model to return to a given passage for evidence. Window size does not guarantee that the model finds every detail or cites correctly; with most layers on a sliding window, this needs testing even more.

Compared with RAG, putting whole documents in skips retrieval design, but every request processes all of the input. Run the same questions through both paths: does the answer cite a source, which conditions are missed, how long does it take; then decide whether to send the full document.

### Tool calls and document workflows

The model proposes tool calls; the host program actually runs search, SQL, and file reads or writes. For case-file processing, a starting workflow:

1. The host parses documents and keeps page numbers and document IDs.
2. It sends text, images, or audio to the model and asks for specified fields.
3. When similar cases are needed, the host runs retrieval and returns the results.
4. The model builds a comparison table, and the host checks that fields and citations match the source.

This is an application design example that we did not run. Test with documents whose answers are known, and keep human review.

### How to compare

| Need | Recommendation |
|---|---|
| Evaluate capability without managing hardware | OpenRouter free endpoint; it expires at the end of December and accepts only text and images |
| Audio or video understanding | Self-host; the free endpoint does not accept either |
| Long-horizon agents, multi-step tools | Shortlist it and test against Hy3 and DeepSeek-v4-flash in your own harness |
| Coding agents first | Self-reported scores trail the similarly sized DeepSeek-v4-flash-0731 on Terminal-Bench and Toolathlon; test before deciding |
| Low-latency short Q&A | Test smaller dense models too and measure end-to-end time |
| Commercial self-hosting | Apache 2.0 allows it; the hardware floor is an 8-GPU node |

## Limitations and trade-offs

- **It is a preview.** The team's own list: reinforcement learning is unfinished, and hallucination control, the balance between text and multimodal ability, and overall stability all fall short.
- **All benchmarks are self-reported.** The technical report is not out, so training data and details cannot be checked, and some competitor scores were run by Dots.
- **The free endpoint expires.** The OpenRouter free version ends on 2026-12-31, has one provider, and has no published paid alternative; long-running services need self-hosting.
- **The hardware floor is high.** 16B active sounds small, but all 280B weights must load; even FP8 needs an 8-GPU node.
- **Simulated environments are not real life.** The blog's long-horizon cases, such as wedding planning and travel concierge, run in simulation, and the team notes that real experiences also need harnesses, connectors, data sources, and permission controls.
- **Image input is not full PDF processing.** The application still has to choose between extracting text, rendering scanned pages as images, or parsing first with a dedicated model such as dots.ocr.

## Update history

- 2026-11-23: Corrected an error: the previous version said the weight license was unconfirmed and that no official weight repository existed. In fact the team released weights and modeling code under Apache 2.0 on Hugging Face and GitHub in mid-August 2026. Rewrote the matrix, architecture, evaluation, licensing, and deployment sections from the official blog and Hugging Face model card; added the dots3 series plan (note / jazz / aria), the FP8 build, self-hosting options, the free OpenRouter endpoint's modality limits and expiry date, and the family evolution from dots.llm1, dots.ocr, dots.vlm1, and dots.mocr to dots.tts.
- 2026-10-11: Reorganized sections to the shared family format and used existing material to add the model matrix; fact-check dates follow existing records.
- 2026-10-11: Checked the full platform text, corrected text-only claims, removed unconfirmed official-site, repository, training, and deployment claims, and clarified model versus application responsibilities before publication.

## References

- [Dots Studio tech blog: dots3-note Preview (English)](https://studio.dots.ai/dots/dots3-en.html)
- [Dots Studio tech blog: dots3-note Preview (Chinese)](https://studio.dots.ai/dots/dots3-zh.html)
- [Hugging Face: dots-studio/dots3-note-prev model card and LICENSE](https://huggingface.co/dots-studio/dots3-note-prev)
- [Hugging Face: dots-studio/dots3-note-prev-fp8](https://huggingface.co/dots-studio/dots3-note-prev-fp8)
- [GitHub: studio-dots-ai/dots3-note-prev](https://github.com/studio-dots-ai/dots3-note-prev)
- [Hugging Face Transformers docs: Dots 3 Note Preview](https://huggingface.co/docs/transformers/en/model_doc/dots3_note)
- [vLLM Recipes: dots3-note-prev](https://recipes.vllm.ai/dots-studio/dots3-note-prev)
- [TEMPO tech blog](https://studio.dots.ai/dots/tempo-blog.html)
- [OpenRouter: Dots3-Note Preview (free)](https://openrouter.ai/dots-studio/dots-3-note-preview:free)
- [OpenRouter free models and rate limits](https://openrouter.ai/docs/api-reference/limits)
- [Hugging Face: dots-studio organization (dots.llm1, dots.ocr, dots.vlm1, dots.mocr, dots.tts)](https://huggingface.co/dots-studio)
- [AI model evaluation sources: how to read benchmark evidence](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
