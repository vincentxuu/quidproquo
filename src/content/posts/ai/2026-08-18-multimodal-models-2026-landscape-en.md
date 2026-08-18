---
title: "Multimodal Models, First Half of 2026: Native Fusion vs. Bolted-On Vision, and Why Leaderboards Contradict Each Other"
date: 2026-08-18
type: deep-dive
category: ai
tags: [multimodal, vision-language-model, llm, benchmark, native-multimodal]
lang: en
tldr: "Pure image understanding has flattened out — four frontier models all clear 80% on MMMU-Pro within 3 points of each other. The real differentiation is video, long-document OCR, and realtime speech, each with a different leader. But the most useful lesson from assembling these rankings is that two credible sources named different Video-MME leaders more than 10 points apart — and that July and August each turned the field over again."
description: "The architecture routes, benchmark disagreements, and known limits of Claude, Gemini, GPT, and Qwen multimodal models across the first half of 2026, why production teams route by modality, and the source-checking a benchmark number deserves."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-multimodal-models-2026-landscape)

Progress in multimodal models over the past two years has moved from "can it understand one image" to "can it, like a person, use eyes, ears, and sustained attention on a meeting or video spanning hours, and react in real time."

This piece surveys the first half of 2026. **A methodological point comes first**, because it matters more than any single score: while assembling these rankings I found two credible sources naming **different leaders on the same benchmark**, more than 10 points apart. So every number below carries its source and date. That is not excess caution; it is the minimum this field currently requires.

## Image understanding has flattened

As of an April 2026 cross-comparison, four frontier models all clear 80% on MMMU-Pro within 3 points of each other: [Digital Applied's roundup](https://www.digitalapplied.com/blog/multimodal-ai-benchmarks-2026-vision-audio-code) gives GPT-5.5 at 82.8, Gemini 3 Deep Think at 82.1, Claude Opus 4.7 at 81.4, and Qwen3.5-Omni at 81.0.

That set is secondhand. What maps to a primary source is Google's own [Gemini 3 announcement](https://blog.google/products-and-platforms/products/gemini/gemini-3), which reports Gemini 3 **Pro** at 81% on MMMU-Pro. Worth noting from Google's [evaluation methodology](https://storage.googleapis.com/deepmind-media/gemini/gemini_3_pro_model_evaluation.pdf): **the competitors' MMMU-Pro and Video-MMMU scores in that table were computed by Google using the rivals' own APIs**, because self-reported or official leaderboard numbers were unavailable. A score run by a competitor deserves a discount on its own.

With MMMU-Pro saturated, the differentiation moved to a handful of narrower axes.

## Two architecture routes

**Native / early fusion** is represented by Gemini and the Qwen3.5 line: image patches, video frames, audio waveforms, and text tokens are projected into one latent space from the start and attended over by the same transformer layers. Audio is encoded straight from the raw waveform rather than passing through speech-to-text, preserving intonation, timbre, and background sound that transcription discards. The [Gemini 2.5 technical report](https://arxiv.org/abs/2507.06261) describes these as "natively multimodal models" and notes processing of up to 3 hours of video.

(The phrase "Unified Multimodal Token Interleaving" often circulates as that report's own term. I could not find that string in its abstract or introduction, and the trail leads to a third-party aggregator rather than Google, so I do not cite it.)

Qwen's generational shift illustrates the trend best. [NVIDIA's technical blog](https://developer.nvidia.com/blog/develop-native-multimodal-agents-with-qwen3-5-vlm-using-nvidia-gpu-accelerated-endpoints) records Qwen3.5's specs: a natively multimodal MoE with 397B total and 17B active parameters. The previous generation split Qwen3 (text) and Qwen3-VL (vision) into separate product lines; Qwen3.5 merges them into one model with **no separate vision adapter** — as Maxime Labonne [put it](https://medium.com/@mlabonne/qwen3-5-nobody-agrees-on-attention-anymore-4709e1bd014b): "Early fusion training on multimodal tokens means the model doesn't need a separate vision adapter."

Audio goes furthest with Qwen3.5-Omni. Its [technical report](https://arxiv.org/abs/2604.15804) (2026-04) describes a Thinker-Talker architecture: the Thinker processes omni-modal signals and emits text, the Talker takes multimodal input plus the Thinker's text and synthesizes speech in parallel, both on a Hybrid Attention MoE. It supports 256k context, over 10 hours of audio input, and 400 seconds of 720P video at 1 FPS. The report also introduces ARIA (Adaptive Rate Interleave Alignment) to stabilize streaming speech synthesis, whose instability stems from mismatched encoding efficiency between text and speech tokenizers.

**Adapter / bolted-on** is Claude's current choice. [The docs](https://docs.anthropic.com/en/docs/about-claude/models/overview) state plainly that "All current Claude models support text and image input" — no native audio or video. This reads as deliberate product positioning rather than a technical limit: Claude targets document-heavy work, with up to **600 images per API request**. That number is conditional: **600 applies to models outside the 200k-context tier, while 200k-context models cap at 100**, and claude.ai allows 20 per message.

As for why Anthropic skips audio and video, I found no official statement — only third-party speculation. It is an unexplained strategic gap.

## Video: where two sources contradict each other

General open-domain video QA is measured by Video-MME. On [llm-stats' leaderboard](https://llm-stats.com/benchmarks/video-mme), the top three are ByteDance's **Seed 2.1 Pro (89.2%)** and **Seed 2.1 Turbo (89.0%)**, followed by **Qwen3.7-Plus (88.0%)** — so the frequently repeated "Qwen tops Video-MME" is actually third place.

But the April Digital Applied analysis names **Gemini 3 Deep Think at 78.4%** as the Video-MME leader, with a 7-point margin over second. **The two differ by more than 10 points, and do not even agree on which company leads.**

Nobody is fabricating. The **model pools and evaluation setups differ**: one is a continuously updated public leaderboard, the other a point-in-time comparison of four flagships, with different models under test. The practical implication is direct — **quoting a benchmark number without its source and date leaves the reader unable to tell which contest you mean.**

Knowledge absorption from educational long-form video is measured by Video-MMMU, where Google's announcement reports Gemini 3 Pro at **87.6%** (that post dates from November 2025; Gemini has since iterated to 3.1 Pro and beyond). The two benchmarks measure different capabilities and cannot be collapsed into "vendor X is best at video."

### Stricter scoring halves the numbers

[Video-MME-v2](https://toknow.ai/posts/video-mme-v2-benchmark-video-understanding-gap-humans) is built specifically to punish lucky guesses: 800 videos averaging 10.4 minutes, four linked questions each with eight options, assembled over 3,300 human-hours by 12 annotators and 50 independent reviewers. The key is scoring — questions are grouped in fours under a non-linear `(N/4)²` formula, so **getting one right by luck while missing its siblings earns almost nothing**.

Under that scheme the strongest model tested, Gemini 3 Pro, scores 66.1% on plain per-question accuracy but **only 49.4% under group scoring**. On "Action & Motion" and "Physical World Reasoning," even Gemini 3 Pro falls below 30%. Open models trail further: Qwen3.5-397B-Think reaches 39.1% with 512 frames and drops to 30.6% at 64 frames.

One counterintuitive finding: **thinking mode frequently hurts on purely visual tasks.** It helps when subtitles are present, but KimiVL-16B loses 3.3% overall with thinking on and 4% on the hardest Level 3 questions. That points at something structural — **current "thinking" in video models leans on text cues, not pixels.**

## The remaining axes

**Long-document OCR** belonged to Claude Opus 4.7 in the April snapshot (DocVQA 93.0%, ahead of GPT-5.5's 91.5% and Gemini 3's 90.8%). Mind the generations: Opus 4.7 shipped April 16, and Anthropic has since released Opus 4.8 (5/28), Fable 5 (6/9), and Opus 5 (7/24) — whether the crown moved needs retesting.

**Chart reasoning and code-with-vision** go to GPT-5.5 (ChartQA 92.1%, AI2D 96.2%), which Digital Applied attributes to its "longer reasoning traces shine."

**Realtime speech**: Qwen3.5-Omni's technical report claims SOTA or highly competitive results across 215 audio and audio-visual subtasks, "surpassing Gemini 3.1 Pro in key audio tasks." Two caveats: the abstract credits those 215 results to the `Qwen3.5-Omni-Plus` variant rather than the base model, and **these are vendor-reported numbers with no independent verification yet**.

The practical conclusion: the era of one model winning every modality is over. Production setups more often route by modality — documents to Claude, educational long video to Gemini, general video QA to Seed or Qwen, charts and code to GPT, realtime speech to Qwen Omni.

## July and August: this survey has already been lapped twice

Since the material above was written, July and August each turned the field over. This section stays in deliberately, because it demonstrates the shelf life of a survey better than any single score:

| Date | Event |
|---|---|
| 6/26 | OpenAI opens GPT-5.6 in limited preview to trusted partners |
| **7/9** | **GPT-5.6 reaches GA in three tiers: Luna, Terra, Sol** |
| 7/16 | Moonshot announces Kimi K3 |
| **7/21** | **Google DeepMind ships Gemini 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber at once** |
| **7/24** | **Anthropic releases Claude Opus 5** |
| 7/30 | OpenAI cuts GPT-5.6 Luna and Terra prices (Luna by 80%) |
| 8/3 | Alibaba announces Qwen3.8-Max (2.4T MoE, ~95B active); weights land 8/12 (text-only) |
| **8/5** | **ByteDance releases SeedRealtime — a native audio-visual full-duplex LLM** |
| 8/10 | Meta releases Muse Glimmer (30B, Apache 2.0, multimodal local agent model with a 2B Perception Encoder) |
| 8/12 | xAI releases Grok 4.6, matching GPT-5.6 Sol on the Artificial Analysis index |
| **8/14** | **Alibaba open-sources Qwen3.8-27B — a 27B dense native VLM taking text, images, and video, Apache 2.0** |

Three concrete consequences for the material above:

**1. Primary MMMU-Pro numbers are now available.** [OpenAI's GPT-5.6 page](https://openai.com/index/gpt-5-6/) publishes the table: GPT-5.6 Sol at **83%** on MMMU Pro (no tools), Terra 80.7%, Luna 78.4%, against GPT-5.5's 81.2% and Gemini 3.1 Pro Preview's 80.5%; with tools Sol reaches 84.6%. **The conclusion "everyone is in the low 80s, separated by a few points" still holds** — only the roster changed.

**2. There is now an independent third-party vision test.** Roboflow's [July 16 evaluation](https://blog.roboflow.com/openai-gpt-5-6/) measured GPT-5.6 Sol's object detection jumping from GPT-5.5's 13.8 mAP@50 to **46.2**, and counting from 64.9% to **73.0%** — while OCR barely moved (90.7% vs 91.2%, slightly down). More notably, their conclusion: **Gemini 3.5 Flash still leads detection and counting, at 0.8 cents per image against Sol's 2.5.** Which restates this article's theme — different axes have different winners, and "strongest" is not "what you should use."

**3. The closed-source field is reshuffling internally.** On the Artificial Analysis Intelligence Index (early August, max effort): Claude Opus 5 at 63, Fable 5 at 62, GPT-5.6 Sol at 61, Kimi K3 at 60, Opus 4.8 at 57 — the top four inside three points. **Kimi K3 is open-weight and beats the commercial Opus 4.8**, which is worth holding in mind for the open-source section below.

## Two unsolved hard problems

**Temporal hallucination** is the most active research area for video models. [Galileo's survey](https://galileo.ai/blog/survey-of-hallucinations-in-multimodal-models) identifies three roots: insufficient vision-encoder resolution (commonly 224×224 or 336×336, since higher costs too much compute), oversimplified connector modules (usually linear layers, poorly aligning visual and textual features), and decoders over-weighting already-generated text at the expense of the original visual input. The [Awesome-Video-Hallucination](https://github.com/hukcc/Awesome-Video-Hallucination) list shows new detection and mitigation methods still appearing through 2026 — this is not solved.

**Realtime response** is an architectural bottleneck. [arXiv 2601.06843](https://arxiv.org/html/2601.06843v1) notes that most MLLMs still require complete input before generating; even streaming methods keep a sequential perceive-then-generate cycle. The paper attributes this to positional encoding in decoder-only architectures: "the global positional continuity constraint imposed by standard positional encoding schemes... tightly couples perception and generation, preventing effective input-output parallelism." For simultaneous interpretation or live-stream analysis — "watch and speak at once" — this is a hard limit mainstream architectures have not cleared.

**But this one was challenged in August.** ByteDance's [SeedRealtime](https://seed.bytedance.com/en/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction) (8/5) targets exactly this: a unified architecture natively fusing audio, video, and text so that, in their words, rather than "listening in full, then looking, and finally answering," perception, understanding, decision-making, and expression **run in parallel over continuous audio-visual streams** — and they claim large-scale deployment.

I have no independent verification, so I will not declare the problem solved. But note the interval: **a January paper called this an architectural limit, and by August a vendor claimed to have shipped it.** The shelf life of a "hard limit" may be shorter than you assume.

**Claude's self-declared limits** deserve a separate mention, because these come from official documentation rather than outside inference. The [vision docs](https://docs.anthropic.com/en/docs/build-with-claude/vision) state: no facial recognition ("Claude cannot be used to name people in images and refuses to do so"), no reliable detection of AI-generated images, approximate object counts, and degraded interpretation of images under 200 pixels.

## How far behind is open source: a number often quoted backwards

[Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap) measured it directly with their Capabilities Index (ECI): **between January and May 2026, the most capable open-weight models lagged frontier closed models by an average of four months**, an ECI gap of 8 points.

This deserves a warning because retellings often get the direction wrong: **four months is the number after the gap widened.** Epoch's previous analysis from October 2025 (covering January 2023 to October 2025) found three months — the gap **did not keep shrinking; it grew slightly.** Epoch also notes that under a stricter criterion (requiring the open model's ECI point estimate to exceed the closed model it is chasing) the estimate rises to six months, and lists two reasons their figure may understate the gap: open-weight models tend to do worse on private benchmarks (plausibly from harder hill-climbing on public ones), and leading closed labs do not always release their most capable models.

The gap is uneven across capabilities: coding and agentic tasks, math and reasoning are close, and general conversation quality is close; **image and video multimodal understanding remains the widest gap.**

That does not contradict the Video-MME ranking — the top three there (Seed 2.1 Pro/Turbo, Qwen3.7-Plus) are all closed, while the strongest **open-weight** entry is Xiaomi's **MiMo-V2.5 (87.7%)**, 0.3 points behind third and 1.5 off the lead. Open models genuinely approach the frontier on specific tasks, but overall it remains "approaching," not "level."

The July-August signal is more complicated, though. On the Artificial Analysis composite, open-weight Kimi K3 (60) **beats the commercial Claude Opus 4.8 (57)**, losing only to that month's three new flagships. And August's open-source wave was denser — and explicitly natively multimodal:

- **Kimi K3**: 2.8T parameters, 104B active, 1M context, with a MoonViT-V2 vision encoder; billed as the world's first open 3T-class model
- **Qwen3.8-27B** (8/14): a 27B dense native VLM taking text, images, and video, Apache 2.0, 262k context (extendable to 1M via YaRN per Alibaba). Note that early coverage described the Qwen3.8 open weights as text-only — true of the 8/12 Qwen3.8-Max, not of the 27B
- **Muse Glimmer** (8/10): Meta's 30B under Apache 2.0, with a 2B Perception Encoder-class vision tower, aimed at local agents on a single consumer GPU

So "four months" is an average, not a fact about every cell — **in some windows and on some capabilities, open models briefly overtake a commercial model one generation back** — and the claim that image and video understanding is open source's widest gap is being directly tested by this wave.

## The big picture

Choosing a multimodal model should not come down to a checklist of supported modalities. Two things matter: **whether a modality is natively trained or bolted on** (native tends to be stronger at cross-modal reasoning — watching a screen while hearing tone — at higher training and serving cost), and **which differentiation axis your use case lands on** (document OCR, video understanding, realtime speech, and chart reasoning each have different leaders).

And when reading a survey like this, the methodological lesson is more useful than any score: **two not-unreasonable sources can name different leaders on the same benchmark, more than 10 points apart.** This article is its own example — the body covers the first half of the year, and July and August each turned the roster over, with even an architectural conclusion like "realtime is a hard limit" claimed as broken in August. When you meet an attractive number, ask which contest it came from, when it was run, and who ran it. Google's note that competitor scores were computed in-house, and Video-MME-v2's guess-resistant scoring, both point the same way: **published leaderboard scores are usually more optimistic than real reliability.**

## References

- [A new era of intelligence with Gemini 3 - Google Blog](https://blog.google/products-and-platforms/products/gemini/gemini-3) (2025-11)
- [Gemini 3 Pro Model Evaluation - Google DeepMind](https://storage.googleapis.com/deepmind-media/gemini/gemini_3_pro_model_evaluation.pdf) (methodology)
- [Gemini 2.5 Technical Report (arXiv 2507.06261)](https://arxiv.org/abs/2507.06261)
- [Vision - Claude Platform Docs](https://docs.anthropic.com/en/docs/build-with-claude/vision)
- [Models overview - Claude Platform Docs](https://docs.anthropic.com/en/docs/about-claude/models/overview)
- [Qwen3.5-Omni Technical Report (arXiv 2604.15804)](https://arxiv.org/abs/2604.15804)
- [Qwen3.5: Nobody Agrees on Attention Anymore - Maxime Labonne](https://medium.com/@mlabonne/qwen3-5-nobody-agrees-on-attention-anymore-4709e1bd014b)
- [Develop Native Multimodal Agents with Qwen3.5 VLM - NVIDIA Technical Blog](https://developer.nvidia.com/blog/develop-native-multimodal-agents-with-qwen3-5-vlm-using-nvidia-gpu-accelerated-endpoints)
- [Video-MME Leaderboard - llm-stats.com](https://llm-stats.com/benchmarks/video-mme)
- [Video-MME-v2: Top AI Video Models Still Trail Humans - ToKnow.ai](https://toknow.ai/posts/video-mme-v2-benchmark-video-understanding-gap-humans)
- [Multimodal AI Benchmarks 2026 - Digital Applied](https://www.digitalapplied.com/blog/multimodal-ai-benchmarks-2026-vision-audio-code) (2026-04 snapshot)
- [Open models lag state-of-the-art closed models by 4 months - Epoch AI](https://epoch.ai/data-insights/open-closed-eci-gap)
- [GPT-5.6: Frontier intelligence that scales with your ambition - OpenAI](https://openai.com/index/gpt-5-6/) (2026-07-09)
- [GPT 5.6 Sol is the best "vision" model OpenAI ever released - Roboflow](https://blog.roboflow.com/openai-gpt-5-6/) (2026-07-16)
- [Introducing Claude Opus 5 - Anthropic](https://www.anthropic.com/news/claude-opus-5) (2026-07-24)
- [SeedRealtime Audio-Visual Full-Duplex LLM Released - ByteDance Seed](https://seed.bytedance.com/en/blog/seedrealtime-audio-visual-full-duplex-llm-released-toward-omni-modal-natural-interaction) (2026-08-05)
- [Introducing Muse Glimmer - Meta AI Research](https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model) (2026-08-10)
- [Introducing Grok 4.6 - xAI](https://x.ai/news/grok-4-6) (2026-08-12)
- [Alibaba releases Qwen3.8-27B open weights - DataNorth AI](https://datanorth.ai/news/alibaba-releases-qwen3-8-27b) (2026-08-17)
- [Kimi K3 - MoonshotAI (GitHub)](https://github.com/MoonshotAI/Kimi-K3)
- [Survey of Hallucinations in Multimodal Models - Galileo](https://galileo.ai/blog/survey-of-hallucinations-in-multimodal-models)
- [Awesome-Video-Hallucination - GitHub](https://github.com/hukcc/Awesome-Video-Hallucination)
- [Speak While Watching: Real-Time Video Understanding (arXiv 2601.06843)](https://arxiv.org/html/2601.06843v1)
