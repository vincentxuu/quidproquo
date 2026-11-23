---
title: "Microsoft's In-House Models: MAI Code 2, Thinking 1 and the Speech and Image Lines, Plus Phi and Microsoft Research's Open-Weight Small Models"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, microsoft, model-family-microsoft, moe, open-source, model-selection]
lang: en
type: deep-dive
tldr: "Microsoft's in-house models come from two places. Microsoft AI (MAI) builds closed, hosted models: the lead is MAI Code 2, launched at Ignite (about 2.8T total parameters, 77B active, 1M context, GitHub Copilot only), plus Code 2 Flash (Copilot and Foundry), the reasoning model MAI Thinking 1, MAI Image 2.7, MAI Transcribe 2 and MAI Voice 2.1. None ship weights, prices sit at a fraction of rivals', and the text models so far have only Microsoft's own scores. Microsoft Research and the Windows team release MIT- and Apache-licensed small models: Phi-4-reasoning-vision-15B, the browser agent Fara1.5, the 4B desktop agent Mage-VL-Cowork and Windows' built-in Aion 1.0."
description: "Microsoft's in-house model family: specs, pricing and channels for MAI Code 2 and Code 2 Flash, Thinking 1, Cyber 2 Flash, Image 2.7, Transcribe 2, Voice 2.1 and Realtime 1; the Phi, Fara, Mage and Aion open-weight lines; the 2024–2026 timeline; where vendor and third-party evaluations stop; and agent selection."
series:
  name: "AI Model Families"
  order: 38
draft: false
glossary:
  - term: "MAI (Microsoft AI)"
    aliases: ["Microsoft AI"]
    definition: "Microsoft's AI division led by Mustafa Suleyman, which pre-trains closed models from scratch (MAI Code, Thinking, Image, Transcribe, Voice and others), separate from Microsoft Research's open-weight lines"
  - term: "MSBench"
    definition: "Microsoft's internal agent evaluation platform; the official MAI Code scores were all run there with GitHub Copilot CLI as the harness"
  - term: "Computer-use agent (CUA)"
    aliases: ["CUA"]
    definition: "An agent model that reads screenshots and emits clicks, keystrokes and similar actions to operate a computer or browser"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-microsoft)

This post covers the models Microsoft trains itself, not the OpenAI or Anthropic models it hosts on Azure. It is written for two readers: people choosing models in GitHub Copilot or Microsoft Foundry who want to know how the MAI names differ, and people looking for MIT-licensed small models to self-host. By the end you should be able to decide which work can go to the cheap MAI models, which should wait for third-party evaluations, and which local deployments suit Phi, Fara and Mage.

As of November 2026, Microsoft AI launched seven models at Ignite on November 17, led by the coding models MAI Code 2 and Code 2 Flash. On the open-weight side, the newest general-purpose Phi is still March's Phi-4-reasoning-vision-15B; there is no Phi-5.

For how to read the benchmark numbers here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Microsoft's in-house models are released by two organizations, and you get them in completely different ways:

- **Microsoft AI (MAI)**: closed models pre-trained from scratch, offered only through GitHub Copilot, Microsoft Foundry, a few partner platforms (OpenRouter, fal, Vercel) and Microsoft's own products. Weights are not distributed.
- **Microsoft Research and the Windows team**: MIT or Apache 2.0 open weights in the [`microsoft` organization](https://huggingface.co/microsoft) on Hugging Face, mostly small models and computer-use agents.

Prices are per 1M tokens; sources are noted below the table:

| Model / line | Role | Key differences | Access and price |
|---|---|---|---|
| MAI Code 2 | Everyday enterprise coding workhorse | About 2.8T total, 77B active; 1M context; text and image input; five reasoning-effort levels | GitHub Copilot only (Pro and up): $0.50 / $2.50, cached $0.025 (promotional until 2027-05-17, then $1 / $5) |
| MAI Code 2 Flash | High-volume, low-cost coding | About 398B total, 12B active; 1M context | Copilot (including Free) and a limited Foundry preview: $0.05 / $0.25 (until 2027-05-17, then $0.10 / $0.50) |
| MAI Thinking 1 | General reasoning | About 1T total, 35B active; 256K context; function calling | Foundry public preview: $2 / $8, cached $0.20 |
| MAI Cyber 2 Flash | Vulnerability scanning | 1M context; trained on Microsoft security data | Microsoft security products only (MDASH and others); no public API |
| MAI Image 2.7 / 2.7 Flash | Image generation and editing | 2.7 for quality, Flash for speed; transparent backgrounds | Foundry public preview, OpenRouter and others: about $35 and $10 per 1,000 images |
| MAI Transcribe 2 (+ Streaming) | Batch and real-time transcription | 60 languages, speaker diarization, word timestamps | Foundry / Azure Speech: $0.10 per hour (limited time, until 2026-12-31); Streaming $0.54 per hour |
| MAI Voice 2.1 / 2.1 Flash | Text-to-speech | 23 languages, one voice across languages, voice cloning from a few seconds of audio | Foundry, OpenRouter: $22 and $15 per 1M characters |
| MAI Realtime 1 | Speech-to-speech | Compatible with the OpenAI Realtime API | MAI Labs trial plus sign-up: $0.01 per audio minute, reasoning billed separately |
| Phi-4-reasoning-vision-15B | Open-weight visual reasoning | 15B, 16K context; switchable thinking / non-thinking | Hugging Face, MIT; Foundry |
| Fara1.5 (4B / 9B / 27B) | Open-weight browser agent | Fine-tuned from Qwen3.5; 262K context | Hugging Face, MIT |
| Mage-VL-Cowork | Open-weight desktop agent | 4B, GUI and terminal channels | Hugging Face, Apache 2.0 |
| Aion 1.0 Instruct | Windows built-in small model | 2.3B, 32K context, 8 languages | Hugging Face, MIT; ships in Windows by end of January 2027 |

Code pricing comes from the [GitHub Copilot pricing table](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing), Thinking 1 and image pricing from Azure retail prices, and speech and transcription pricing from each MAI launch post.

Three things to know first:

- **The strongest MAI Code 2 is not in Foundry.** The [model card](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf) says Foundry offers only Code 2 Flash; if you want Code 2 behind your own agent, Copilot is currently the only route. Microsoft says OpenRouter, Vercel and others are coming, with no date.
- **MAI's text models have no weights.** The one exception is [MAI Licensed Weights](https://microsoft.ai/news/introducing-mai-licensed-weights/), announced at Ignite: enterprises deploy and fine-tune MAI models in their own Azure environment, but only through Microsoft's Frontier Company engagements, and it is not open yet.
- **Most open-weight lines are not trained from scratch.** Phi is trained from scratch by Microsoft; Fara1.5 is fine-tuned on Qwen3.5, and Mage-VL's language decoder is Qwen3-4B, with only the Mage-ViT vision encoder trained from scratch.

### Other sub-lines

- **Decision models**: Microsoft-Decision-1.1 returns option probabilities instead of generating text; see [choosing a decision model](/posts/tech/2026-10-22-ai-model-family-decision-models-en).
- **MAI Work Flash**: further optimized from Code 2 Flash to serve Excel, PowerPoint, Word, Teams and FabricIQ; not sold separately.
- **Open-weight speech recognition and embeddings**: VibeVoice-ASR (including 1.5B and 7B streaming versions) and the harrier-oss-v1 embedding models (270M, 0.6B, 27B) are all MIT. harrier 27B has a score in the embeddings section of the [landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).
- **Smaller Phi branches**: Phi-Ground-Any for GUI grounding, MediPhi for medicine, and the MoE versions Phi-mini-MoE and Phi-tiny-MoE.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Phi-3 / 3.5 | 2024-04 / 2024-08 | The 3.8B Phi-3-mini targeted on-device use, MIT licensed; 3.5 added MoE and vision versions | — |
| Phi-4 | 2024-12 | 14B, 16K context, trained on large amounts of synthetic data with a focus on math and reasoning; still the only Phi on OpenRouter | — |
| Phi-4-mini / multimodal / reasoning | 2025-02 to 04 | Small models gained function calling, speech input and reasoning versions | — |
| MAI-DS-R1 | 2025-04 | Open weights MAI post-trained on DeepSeek-R1, not an in-house base | — |
| MAI-Voice-1, MAI-1-preview | 2025-08-28 | MAI's first in-house models; MAI-1-preview was an MoE trained on about 15,000 H100s, tested only on LMArena, in Copilot and through an API for invited testers | — |
| MAI-Image-1 | 2025-10-13 | First in-house image model, added to Bing Image Creator | — |
| MAI Transcribe 1, Voice 1, Image 2 in Foundry | 2026-04-02 | First time any developer could pay for MAI models through an API | — |
| Build: seven models including Thinking 1 and Code 1 Flash | 2026-06-02 | MAI's first reasoning model and first coding model; Code 1 Flash has only 5B active | — |
| MAI Code 1.1 Flash | 2026-08-11 | 138B / 5B active, 256K, price cut to about a quarter of 1.0; a 3-bit version for local use was added in October | — |
| Thinking 1 public preview, Cyber 1 Flash | 2026-08-12 / 13 | Thinking 1 opened in Foundry at $2 / $8; the first security model went into MDASH | — |
| Transcribe 2, Image 2.6, Voice 2.1 | 2026-09 to 10 | Transcription added diarization and dropped to $0.10 per hour; Voice expanded to 23 languages | — |
| Mage-VL-Cowork | 2026-10-30 | 4B open-weight desktop agent with GUI and terminal in one policy | [Model card](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork-en) |
| Ignite: Code 2, Cyber 2 Flash, Image 2.7, Realtime 1 | 2026-11-17 | Code moved to the MAI-Base-2 base with 1M context; Licensed Weights announced | — |
| Aion 1.0 Instruct | 2026-11-18 | Next-generation Windows built-in small model (succeeding Phi Silica), MIT weights first | — |

Two threads run through the past year and a half. First, MAI went from "consumer models used inside Copilot" to an enterprise product line split by task: coding, reasoning, security, images, transcription and voice, each leading on price. Second, the base is growing: Code 1.x Flash has 5B active, while Code 2 moved to [MAI-Base-2](https://microsoft.ai/news/frontier-pre-training-at-microsoft-ai/), which finished pre-training in October (about 2.8T total, 80B active). Phi, by contrast, has slowed: after Phi-4 there are only branch releases, and the Windows built-in small model was renamed Aion.

## Architecture and training trade-offs

### MAI Code 2: a large base, long context, and training inside Copilot

What the [MAI Code 2 model card](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf) makes public:

- **Two sizes, one recipe**: both are sparse MoE decoders with a vision encoder. Code 2 has about 2.8T total parameters, 77B active plus 3B embedding parameters, pre-trained on about 50T tokens and extended to 1M context with about 150B tokens. Code 2 Flash has about 398B total and 12B active, pre-trained on about 25T tokens (3T of them image tokens) with logit distillation from a larger in-house MAI model.
- **Reinforcement learning runs in the product harness**: the RL environments are the GitHub Copilot CLI and VS Code agent harnesses, so that offline scores track real use. The flip side is that the official scores are measured in the same harness, and results in another agent framework may differ.
- **Context limits**: 1,050,000 tokens in total, up to 922,000 input and 128,000 output; five reasoning-effort levels from low to max.

One thing to watch: the summary table at the top of the model card says "50B-100B (80B active)", which does not match the 2.8T total in section 1. This post follows the prose in section 1.

MAI keeps stressing that it "does not distill from third-party models and the data is traceable". That is its main difference from most open-weight models and the selling point of Licensed Weights. Code 2 Flash's logit distillation uses MAI's own teacher, which does not contradict the claim.

### MAI Thinking 1: a mid-sized reasoning model

The [Thinking 1 launch post](https://microsoft.ai/news/introducing-mai-thinking-1/) discloses only a sparse MoE with about 1T total and 35B active parameters, 256K context, and safety trained in the same RL reward as capability (treating both unsafe compliance and unnecessary refusal as defects). Architecture details and training data volume are not public. It is the source of Cyber 1 Flash; Code 2 moved to the new MAI-Base-2 instead.

### Phi and Research open weights: small and local, but mostly English

- **Phi-4-reasoning-vision-15B**: the [model card](https://huggingface.co/microsoft/Phi-4-reasoning-vision-15B) describes a mid-fusion architecture of Phi-4-Reasoning plus the SigLIP-2 vision encoder, trained on 240 B200s for 4 days. The same model can reason at length with `<think>` or answer directly with `<nothink>`. Context is only 16K and it targets English.
- **Fara1.5**: the [model card](https://huggingface.co/microsoft/Fara1.5-27B) says it sees only screenshots, not the DOM, and emits clicks as pixel coordinates; training data is synthesized and verified by the multi-agent pipeline FaraGen1.5. It is trained to stop and ask before entering personal data, paying, submitting or signing in.
- **Mage-VL-Cowork**: a vision encoder trained from scratch that allocates tokens by video-codec importance, followed by a five-stage curriculum that merges GUI operation and terminal execution into one policy; details in the [model card post](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork-en).
- **Aion 1.0**: the [model card](https://huggingface.co/microsoft/Aion-1.0-Instruct-2.3B) lists 2.29B parameters, 28 layers, 21 sliding-window layers plus 7 full-attention layers, and training data extended from Phi Silica. Multilingual data is only about 6%.

## Evaluation and alternatives

### Third party: available for multimodal, not yet for text

- **Images**: MAI cites Artificial Analysis's AA-Image-Editing v2.1, where MAI Image 2.7 ranks first at 1,215 Elo, 4 points ahead of GPT Image 2.6 Sunburst (max) ([launch-post footnote](https://microsoft.ai/news/introducing-mai-image-2-7/), as of 2026-11-16). The image table in the [landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) shows the same score and notes it is the cheapest of the top five.
- **Transcription**: on Artificial Analysis's word-error-rate leaderboard, MAI Transcribe 2 scores 2.0% and ranks second ([model page](https://microsoft.ai/models/mai-transcribe-2/)); for comparisons with other APIs and open weights, see the [speech and audio family post](/posts/tech/2026-08-26-ai-model-family-speech-audio-en).
- **Decisions**: Microsoft-Decision-1.1 scores 67.8 on the Artificial Analysis Decision Index v2.1; see the [decision models post](/posts/tech/2026-10-22-ai-model-family-decision-models-en).
- **Text models**: MAI Thinking 1, Code 2 and Code 2 Flash have no measured score on the Artificial Analysis Intelligence Index. Thinking 1 scores you may see on third-party sites are estimates from other benchmarks, not measurements.

### Vendor-reported: MAI Code 2 and Code 2 Flash

The [model card](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf) publishes scores only for Microsoft's two models, run on MSBench with GitHub Copilot CLI 1.0.102, subagents off, max reasoning, averaged over three runs per task:

| Benchmark | MAI Code 2 | MAI Code 2 Flash |
|---|---|---|
| DeepSWE 1.1 | 73.2% | 59.9% |
| Terminal-Bench 2.1 | 84.6% | 78.3% |
| SWE Atlas | 43.1% | 44.8% |

The [launch post](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/) gives only ratios: averaged over four benchmarks (the three above plus FrontierCode v1.1), Code 2 delivers 98% of GPT-6.1 Sol's performance at 40% of the cost, and 96% of Claude Opus 5.5's at 5% of the cost. Code 2 Flash is comparable to GPT-6 Luna and Claude Haiku 5.5 at 65% and 20% of the cost. All costs use the 50% promotional price.

[InfoWorld](https://www.infoworld.com/article/4250152/microsoft-launches-mai-code-2-models-to-challenge-openai-and-anthropic-in-ai-coding.html) reported the per-benchmark chart Microsoft showed at launch: the four-benchmark average is 63.2% for Code 2, 64.1% for GPT-6.1 Sol and 65.3% for Claude Opus 5.5. The gap is concentrated in SWE Atlas, where Code 2 scores 43.1% and Claude Opus 5.5 57.5%.

How to read it:

- **Close to the frontier on everyday coding, behind on long-horizon work and large-codebase understanding.** SWE Atlas covers Q&A, test writing and refactoring across 18 large repositories, and it is where Code 2 loses most. Microsoft also says plainly that it was not tuned for "very long-horizon agentic work".
- **Flash is not weaker across the board.** On SWE Atlas Flash is slightly above Code 2, by 1.7 points; with three-run averages, treat them as comparable.
- **The same model card has two sets of scores.** The advanced-autonomy table in the safety section lists Code 2 at 60.2% on DeepSWE 1.1 and 80.9% on SWE Atlas, different from the performance section, with no stated conditions. Cite the performance-section table.
- **Self-assessed alignment**: the model card says both models are "similar in alignment to GPT-5.6 Sol but less aligned than GPT-6".

### Vendor-reported: MAI Thinking 1 and multimodal

- **Thinking 1**: AIME 2025 97.0%, AIME 2026 94.5%; on par with Claude Opus 4.6 on SWE-Bench Pro; preferred over Claude Sonnet 4.6 in a 1,276-task blind evaluation by Surge's professional raters. Its comparison set is the previous model generation, not the one Code 2 is compared against.
- **Transcribe 2**: average word error rate of 5.2% across 60 FLEURS languages (3.4% on the top 25), about 10 seconds for an hour of audio; Microsoft says it is 10x faster than GPT-Transcribe and 7x faster than Scribe v2 ([launch post](https://microsoft.ai/news/mai-transcribe-2-is-the-fastest-most-accurate-and-cheapest-speech-recognition-model-in-the-world/)).
- **Realtime 1**: Microsoft says it beats GPT-Realtime 2.1 on Big Bench Audio and τ-Voice, without publishing scores.
- **Cyber 2 Flash**: 92.3% on CyberGym-E2E versus 91.5% for GPT-6 Astra. Microsoft found that 92 of the 905 tasks came from the same open-source projects and vulnerability reports as its training data, and excluded those 92 for every model.

### Open weights

- **Fara1.5** (vendor-reported, [model card](https://huggingface.co/microsoft/Fara1.5-27B)): WebVoyager 80.8, 86.6 and 89.3 for 4B / 9B / 27B; Online-Mind2Web 57.3, 63.4, 72.3; WebTailBench 27.4, 32.3, 40.2.
- **Mage-VL-Cowork**: 66.0% on OSWorld-Verified (50 steps), the best at 4B, but it loses browser tasks to the browser-specialized Fara1.5-4B.
- **Phi-4-reasoning-vision-15B**: AI2D 84.8, ChartQA 83.3, MathVista 75.2, MMMU 54.3, ScreenSpot-V2 88.2 (Microsoft's own runs with VLMEvalKit).

## Licensing, pricing, and deployment

### Weight licenses

- **MIT**: the whole Phi line, Fara1.5, Aion 1.0, VibeVoice and harrier. The Phi-4 and Aion repositories include the full MIT text; Phi-4-reasoning-vision-15B and Fara1.5 declare MIT only in model-card metadata.
- **Apache 2.0**: Mage-VL and Mage-VL-Cowork (full license text included). Fara1.5 and Mage-VL build on Qwen, so check the original Qwen weights' terms as well when self-hosting.
- **MAI**: no weight license. The Code 2 model card lists the Microsoft Enterprise AI Services Code of Conduct, the Foundry terms in the Microsoft Product Terms, and the Azure Supplemental Preview Terms. Thinking 1, Image 2.7 and Transcribe 2 are still public preview in Foundry under the Azure Supplemental Preview Terms; do not treat them as SLA-backed services before general availability.

### API pricing

- **Coding (GitHub Copilot rates, per 1M tokens)**: Code 2 $0.50 / $2.50, Code 2 Flash $0.05 / $0.25, both promotional until 2027-05-17, after which they double; the previous Code 1.1 Flash is $0.20 / $1.20. Copilot Free and Student plans get Flash only.
- **Thinking 1**: Foundry Global deployment $2 / $8, cached input $0.20.
- **Images**: Image 2.7 about $35 per 1,000 images, Flash about $10; token rates are $5 text input, $8 image input and $34 image output ($1.75, $2.50 and $10 for Flash).
- **Speech and transcription**: Transcribe 2 $0.10 per hour (limited time, until 2026-12-31), Streaming $0.54 per hour; Voice 2.1 $22 and Flash $15 per 1M characters; Realtime 1 $0.01 per minute, reasoning billed at $1 / $5.
- **Hosted open weights**: Phi-4 is the only Phi on OpenRouter, at $0.07 / $0.14 with 16K context.

### Deployment

- **MAI**: pick the model directly in Copilot; in Foundry, Code 2 Flash uses the OpenAI-compatible Responses API, Thinking 1 is Chat Completions compatible and Realtime 1 is OpenAI Realtime API compatible, so existing OpenAI SDK code can be tested by changing the endpoint.
- **Phi-4-reasoning-vision-15B**: Microsoft recommends vLLM at bf16, tested on A6000, A100, H100 and B200.
- **Fara1.5**: Microsoft requires the MagenticLite or fara CLI sandbox (a Docker browser, domain allow-lists, pause at any time); for 27B it recommends at least two GPUs.
- **Mage-VL-Cowork**: 4B, runs on a single GPU; the model card requires running it only inside an isolated VM or sandbox.

## Agent integration and selection

- **Everyday coding agents in Copilot** → start with Code 2 Flash and escalate hard tasks to Code 2. Both sit in the cheap tier of the Copilot price table, but compare them against Claude or GPT on your own repository for long-horizon, large-codebase tasks first.
- **Building your own coding agent on Foundry** → only Code 2 Flash is available; for Code 2-level capability you currently need another vendor's model.
- **General reasoning and document work** → Thinking 1 ($2 / $8, 256K). Microsoft compares it with the Claude Sonnet 4.6 and Opus 4.6 generation and there is no third-party score, so run it side by side with your current model first.
- **Transcription, voiceover and voice agents** → Transcribe 2 (batch), Transcribe 2 Streaming plus Voice 2.1 Flash (low-latency conversation), or Realtime 1 directly. This side has third-party scores and is where MAI's price advantage is largest.
- **Image generation and editing** → Image 2.7: first on a third-party editing leaderboard, and Microsoft says it costs about a fifth of GPT Image 2.6 Sunburst (max); use Flash for volume.
- **Local or offline** → Phi-4-reasoning-vision-15B for document and chart reasoning; Fara1.5 for browser agents; Mage-VL-Cowork for mixed desktop and terminal work; Aion 1.0 for summarizing and rewriting on Windows devices. All of them suit English-centric work only.
- **Decisions and routing** → Microsoft-Decision-1.1; see the decision models post.

The smallest selection check: in Copilot CLI, run the same set of issues through Code 2 Flash, Code 2 and your current main model, and record completion rate, AI credits and how much you had to fix by hand. The official numbers were measured in this harness, so it is the easiest like-for-like comparison; then rerun in your other framework and see how much the scores drop.

## Limitations and trade-offs

- **Text models have only vendor scores.** Code 2's per-benchmark scores cover only Microsoft's two models, with rivals shown only as ratios or a chart reported by the press; Thinking 1 has no independent overall evaluation either. Until they appear on Artificial Analysis or another third party, selection rests on your own tasks.
- **Long-horizon agents are not the design goal.** Microsoft says Code 2 was not tuned for scientific research or very long-horizon agentic work; the model card also lists repeated tool calls, drifting from instructions and stopping before verification in long sessions.
- **Optimized for English only.** Code 2 states it is optimized only for English code production; Phi, Fara and Aion are also English-centric, so test non-English work yourself.
- **Prices expire.** The Code promotional prices run until 2027-05-17 and Transcribe 2's $0.10 until 2026-12-31; budget long-term at full price.
- **Channel lock-in.** Code 2 is only in Copilot and Cyber 2 Flash only in Microsoft security products; MAI has no weights and Licensed Weights is not open yet, so teams that need portability should not bet core workflows on MAI.
- **The open-weight lines lean toward research.** Fara1.5 and Mage-VL build on Qwen, while general-purpose Phi has stayed at the Phi-4 generation with context mostly between 16K and 32K.

Overall, MAI's strategy is to turn each task into a dedicated model far cheaper than the frontier, ship it first in Copilot, Office and Bing, then open it in Foundry. For outside developers, speech, transcription and images already have third-party support and can go straight onto an evaluation list; the coding and reasoning models are attractively cheap, but wait for independent evaluations or test them yourself first.

## References

- [Seven new world-class models at scalable price-performance — Microsoft AI (Ignite 2026 overview)](https://microsoft.ai/news/microsoft-ignite-2026/)
- [MAI Code 2 and Code 2 Flash — Microsoft AI](https://microsoft.ai/news/introducing-mai-code-2-and-mai-code-2-flash/)
- [MAI Code 2 and MAI Code 2 Flash model card (PDF)](https://microsoft.ai/pdf/MAI-Code-2-And-MAI-Code-2-Flash-Model-Card.pdf)
- [MAI Code 2 and MAI Code 2 Flash in GitHub Copilot — GitHub Changelog](https://github.blog/changelog/2026-11-17-mai-code-2-and-mai-code-2-flash-in-github-copilot/)
- [Models and pricing for GitHub Copilot — GitHub Docs](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)
- [MAI Code 1.1 Flash — Microsoft AI](https://microsoft.ai/news/mai-code-1-1-flash-br-better-faster-at-a-quarter-of-the-cost/)
- [MAI-Code-1.1-Flash model card (PDF)](https://microsoft.ai/pdf/MAI-Code-1.1-Flash-Model-Card.PDF)
- [Introducing MAI Thinking 1 — Microsoft AI](https://microsoft.ai/news/introducing-mai-thinking-1/)
- [New MAI models in Microsoft Foundry — Microsoft Community Hub (includes Thinking 1 pricing)](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/new-mai-models-in-microsoft-foundry-across-text-image-voice-and-speech/4524632)
- [Building a hill-climbing machine: Launching seven new MAI models — Microsoft AI (Build 2026)](https://microsoft.ai/news/building-a-hillclimbing-machine-launching-seven-new-mai-models/)
- [Frontier Pre-training at Microsoft AI (MAI-Base-2)](https://microsoft.ai/news/frontier-pre-training-at-microsoft-ai/)
- [MAI Cyber 2 Flash — Microsoft AI](https://microsoft.ai/news/introducing-mai-cyber-2-flash/)
- [MAI Image 2.7 — Microsoft AI](https://microsoft.ai/news/introducing-mai-image-2-7/)
- [MAI Image 2.6 — Microsoft AI](https://microsoft.ai/news/pushing-the-quality-cost-frontier-with-mai-image-2-6/)
- [MAI Transcribe 2 — Microsoft AI](https://microsoft.ai/news/mai-transcribe-2-is-the-fastest-most-accurate-and-cheapest-speech-recognition-model-in-the-world/)
- [MAI Transcribe 2 model page](https://microsoft.ai/models/mai-transcribe-2/)
- [MAI-Transcribe-2 model card (PDF)](https://microsoft.ai/pdf/MAI-Transcribe-2-Model-Card.pdf)
- [MAI Transcribe 2 Streaming and MAI Voice 2.1 — Microsoft AI](https://microsoft.ai/news/our-first-streaming-transcription-model/)
- [MAI Realtime 1 — Microsoft AI](https://microsoft.ai/news/introducing-mai-realtime-1/)
- [MAI Licensed Weights — Microsoft AI](https://microsoft.ai/news/introducing-mai-licensed-weights/)
- [Two in-house models in support of our mission — Microsoft AI (MAI-Voice-1, MAI-1-preview)](https://microsoft.ai/news/two-new-in-house-models/)
- [Introducing MAI Image 1 — Microsoft AI](https://microsoft.ai/news/introducing-mai-image-1-debuting-in-the-top-10-on-lmarena/)
- [Microsoft launches MAI Code 2 models — InfoWorld](https://www.infoworld.com/article/4250152/microsoft-launches-mai-code-2-models-to-challenge-openai-and-anthropic-in-ai-coding.html)
- [microsoft/Phi-4-reasoning-vision-15B — Hugging Face](https://huggingface.co/microsoft/Phi-4-reasoning-vision-15B)
- [Introducing Phi-4-Reasoning-Vision to Microsoft Foundry — Microsoft Community Hub](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-phi-4-reasoning-vision-to-microsoft-foundry/4499154)
- [microsoft/phi-4 — Hugging Face](https://huggingface.co/microsoft/phi-4)
- [microsoft/Fara1.5-27B — Hugging Face](https://huggingface.co/microsoft/Fara1.5-27B)
- [microsoft/Mage-VL — Hugging Face](https://huggingface.co/microsoft/Mage-VL)
- [microsoft/Mage-VL-Cowork — Hugging Face](https://huggingface.co/microsoft/Mage-VL-Cowork)
- [microsoft/Aion-1.0-Instruct-2.3B — Hugging Face](https://huggingface.co/microsoft/Aion-1.0-Instruct-2.3B)
- [Microsoft: Phi 4 — OpenRouter](https://openrouter.ai/microsoft/phi-4)
- [MAI-Image-2.7 — OpenRouter](https://openrouter.ai/microsoft/mai-image-2.7)
- [Model card | Microsoft Mage-VL-Cowork](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork-en) — this site
- [Choosing a decision model](/posts/tech/2026-10-22-ai-model-family-decision-models-en) — this site
- [Speech and audio models](/posts/tech/2026-08-26-ai-model-family-speech-audio-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
