---
title: "Model Card｜DeepSeek-V4-Flash-Vision-Exp"
date: 2026-09-01
category: daily
tags: [ai-agent, model-release, daily, deepseek, model-family-deepseek]
lang: en
description: "DeepSeek gives the V4-Flash line its first pair of eyes — same MoE backbone plus a vision module, text-agent scores go up rather than down, multimodal-agent performance closes in on Claude Opus 4.8, and the price tag doesn't move at all"
tldr: "DeepSeek-V4-Flash-Vision-Exp: 284B total / 13B active-parameter MoE, 1M context, 384K max output; priced identically to plain V4-Flash (Input $0.44 / Output $1.32 at peak, half that off-peak); wins 6 of 7 text-agent benchmarks against its own predecessor (DeepSWE hits 59.3, edging past Opus-4.8's 58.0); multimodal-agent scores close in on Opus-4.8 (trails by 2.9 on ApexBench, actually leads on ZeroBench); each image is capped at 384 tokens / roughly 800×800 resolution, trading fine detail for near-zero cost"
series:
  name: "AI Model Tracker"
  order: 11
glossary:
  - term: "DeepSeek V4"
    def: "DeepSeek's flagship large language model family, split into Flash (lightweight) and Pro (flagship) tiers, with an experimental multimodal branch added in 2026"
---

> 🌏 [中文版](/posts/daily/2026-09-01-model-deepseek-deepseek-v4-flash-vision-exp)

## Model Information

| Field | Value |
|---|---|
| Model ID | `deepseek-v4-flash-vision-exp` (API call string; HuggingFace repo is `deepseek-ai/DeepSeek-V4-Flash-Vision-Exp`) |
| Vendor | DeepSeek |
| Parameters | 284B total / 13B active (sparse MoE; same architecture as DeepSeek-V4-Flash-0731, with a vision module bolted on and continued pretraining) |
| Context Window | 1,000,000 tokens (max output 384K tokens) |
| Input pricing (USD/1M tokens) | $0.44 (peak, cache miss) / $0.22 (off-peak, cache miss); cache hit drops further to $0.014 / $0.007 |
| Output pricing (USD/1M tokens) | $1.32 (peak) / $0.66 (off-peak) |
| Open source | Yes (MIT License; weights and reference inference code published on HuggingFace) |
| Release date | 2026-08-21 (API launch announcement) |
| Official announcement | [DeepSeek-V4-Flash-Vision-Exp Release: Multimodal API Now Live](https://api-docs.deepseek.com/news/news260821/) |
| HuggingFace | [deepseek-ai/DeepSeek-V4-Flash-Vision-Exp](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp) |
| Family | DeepSeek V4.x (first multimodal experimental branch of the V4-Flash line) |

## Highlights

- Text-agent capability goes up, not down: wins 6 of 7 text-agent benchmarks against the text-only V4-Flash-0731 it forked from — DeepSeek's own harness measured 59.3 on DeepSWE (a code-repair benchmark), edging past Claude Opus 4.8's 58.0
- Multimodal-agent performance closes in on Opus-4.8: 36.5 on ApexBench (Pass@1), just 2.9 points behind Opus-4.8's 39.4; 35.0 on ZeroBench (Pass@5) actually beats Opus-4.8's 34.0
- Images are nearly free: each image is capped at 384 tokens for billing, so at the off-peak rate of $0.22/1M an image costs roughly $0.00008 — community estimates put it at about 2,500 images per dollar
- Zero-friction API compatibility: reuses V4-Flash's existing Chat Completions / Anthropic Messages / Responses endpoints — swap the model string to `deepseek-v4-flash-vision-exp` and you're done; DeepSeek Harness 0.1.1, released the same day, already supports it out of the box

## Benchmark Results

| Benchmark | Vision-Exp | V4-Flash-0731 (text-only predecessor) | Opus-4.8 (strongest competitor) |
|---|---|---|---|
| Terminal Bench 2.1 | 83.9 | 82.7 | 85.0 |
| DeepSWE | 59.3 | 54.4 | 58.0 |
| Toolathlon-Verified | 75.9 | 70.3 | 76.2 |
| ApexBench (Pass@1, multimodal) | 36.5 | 26.2† | 39.4 |
| Agents' Last Exam (multimodal) | 27.3 | 25.2† | 25.7 |
| ZeroBench (Pass@5, multimodal) | 35.0 | – | 34.0 |

⚠️ All figures above are DeepSeek's own first-party numbers, measured with its own DeepSeek Harness (Minimal Mode, `temperature=1.0`, `top_p=0.95`) on launch day, with no independent third-party reproduction yet. For the two rows marked †, V4-Flash-0731 is a text-only model that simply ignores the multimodal elements of the task during evaluation, so those scores aren't a like-for-like comparison.

## Comparison with Predecessor/Competitors

The counter-intuitive part isn't that Vision-Exp gained sight — it's that its text ability improved too. Compared with the V4-Flash-0731 build it was forked from, DeepSWE moved up 4.9 points and Toolathlon-Verified moved up 5.6 points. DeepSeek's own announcement undersells this with a single word ("matches"), but the actual numbers show a real text-capability upgrade rode along with the vision addition, not just a bolted-on encoder. On the multimodal side, once you strip out the artificial gap caused by V4-Flash-0731 simply being unable to see, the distance to Opus-4.8 isn't large: 2.9 points behind on ApexBench, 0.7 behind on Chartography, but actually ahead on both Agents' Last Exam and ZeroBench.

The most aggressive move here is pricing: Vision-Exp is billed on exactly the same rate card as plain V4-Flash — DeepSeek didn't charge a single extra cent for vision. By contrast, Claude's and GPT's vision inputs typically stack additional image-token costs on top of text pricing; DeepSeek instead compresses every image down to a 384-token ceiling, trading resolution for near-zero marginal cost.

## Implications for Agent Development

Vision-Exp's positioning is clear: this isn't a general-purpose chat-with-images model, it's built for agents that operate on screens and codebases. OpenRouter's traffic data from its first three days live shows the top consumers are coding harnesses — Claude Code, `pi`, and similar — with almost nobody running it as a plain chatbot, which lines up with the across-the-board gains on text-agent benchmarks.

- If you're building a coding agent or CLI agent: it wins 6 of 7 text-agent benchmarks against its predecessor, so swapping the model string to Vision-Exp can be a pure upside even if you never send it a single image — DeepSWE even edges past Opus-4.8
- If you're building an agent that occasionally needs to "glance at a screenshot" (verifying UI rendered correctly, reading a simple chart): the 384-token / roughly 800×800-resolution cap costs next to nothing, which fits "rough judgment" tasks well
- Not a fit: anything that needs to read fine print — 8pt text on a receipt, dense dashboards, or engineering drawings — the 800×800 downscale ceiling throws away exactly that detail; DeepSeek also states FIM (fill-in-the-middle) isn't supported yet, so if your pipeline depends on FIM for inline code completion, you can't just swap the model string over

## Today's Insight

I assumed adding vision capability usually means trading away some text ability. This release argues otherwise — DeepSeek continued pretraining the same MoE backbone with a vision module attached, and text-agent benchmarks broadly improved rather than regressed. It's a reminder that when evaluating a multimodal upgrade, checking "did the multimodal score go up" isn't enough — you also need to check whether the pure-text tasks were helped or hurt, because the two don't necessarily move together.

## References

- [DeepSeek-V4-Flash-Vision-Exp Release: Multimodal API Now Live — DeepSeek API Docs](https://api-docs.deepseek.com/news/news260821/)
- [Models & Pricing — DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [Vision — DeepSeek API Docs](https://api-docs.deepseek.com/guides/vision)
- [HuggingFace model card: deepseek-ai/DeepSeek-V4-Flash-Vision-Exp](https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp)
- [DeepSeek V4 Flash Vision Exp: same price, one big catch — eesel AI](https://www.eesel.ai/blog/deepseek-v4-flash-vision-exp)
- [DeepSeek Launches Multimodal Vision Model V4-Flash-Vision-Exp — KuCoin](https://www.kucoin.com/news/flash/deepseek-launches-multimodal-vision-model-v4-flash-vision-exp)
