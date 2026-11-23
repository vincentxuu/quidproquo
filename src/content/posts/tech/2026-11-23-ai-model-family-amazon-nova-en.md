---
title: "Amazon Nova: Nova 2 Lite and Nova 2.5 Sonic Carry the Line, Premier, Canvas and Reel Are Retired, and Chronos Is the Only Open-Weight Hit"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, amazon, aws, bedrock, model-family-amazon-nova, voice-agent, model-selection]
lang: en
type: deep-dive
tldr: "Amazon Nova is a closed model family you can only get on AWS. The current workhorses are Nova 2 Lite (1M context, adjustable reasoning, $0.30/$2.50 with Bedrock global inference) and the voice model Nova 2.5 Sonic. Nova 2 Pro and Omni are still previews limited to Nova Forge customers, and Premier, Canvas and Reel were retired in September 2026. Amazon's heavily downloaded open weights are the Chronos-2 time-series model. Nova fits teams already on AWS that care about keeping data in their account and about indemnity; on price or scores alone, there are better options at the same tier."
description: "Amazon Nova model family: positioning and Bedrock pricing for Nova 2 Lite, Nova 2.5 Sonic, Multimodal Embeddings, Nova Act and Nova Forge, the 2024–2026 timeline and the Premier/Canvas/Reel retirements, technical-report and third-party evaluations, the Chronos time-series open weights, and agent selection."
series:
  name: "AI Model Families"
  order: 43
draft: false
glossary:
  - term: "Cross-Region Inference"
    aliases: ["CRIS", "Global cross-region inference"]
    definition: "Bedrock's mechanism for routing a request to another Region in the same geography (Geo) or anywhere in the world (Global). Nova 2 Lite is about 10% cheaper with global inference, at the cost of data possibly leaving the source Region"
  - term: "Nova Forge"
    definition: "AWS's subscription service for building custom models: customers start from Nova pre-training, mid-training or post-training checkpoints, blend in Amazon-curated training data, then run SFT and reinforcement learning"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-amazon-nova)

Amazon Nova is the model family Amazon trains itself. It is available only through [Amazon Bedrock](/posts/ai/2026-08-22-amazon-bedrock-llm-platform-en) and SageMaker AI, with no open weights. This post is for teams already building agents on AWS and answers three questions. Is Nova 2 Lite worth picking over Claude or GPT on Bedrock? Should a voice agent use Nova 2.5 Sonic? After the 2026 cutbacks, which models are still safe to depend on?

As of November 2026, the text workhorse is Nova 2 Lite, launched in December 2025, and the voice workhorse is Nova 2.5 Sonic, launched on October 5. The previous flagship, Premier, and the generation models Canvas and Reel were retired in September. Business Insider reports that Amazon is concentrating resources on a new frontier model expected at re:Invent later this year; Amazon has not confirmed it.

For how to read the benchmark numbers here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Nova's pitch is "AWS-native": billing, IAM, Guardrails, VPC and data retention all go through existing Bedrock mechanisms, and AWS also offers uncapped indemnity. Prices below come from the [AWS Price List API](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/us-east-1/index.json) (2026-11-11 edition, us-east-1), per 1M tokens:

| Model / product line | Role | Key differences | Access and price |
|---|---|---|---|
| Nova 2 Lite (`amazon.nova-2-lite-v1:0`) | Current text workhorse | Text, image and video input; 1M context, 64K max output; reasoning off by default, with low/medium/high levels; built-in web grounding and code interpreter | Bedrock: $0.30/$2.50 with global inference, $0.33/$2.75 in-Region; same price on OpenRouter |
| Nova 2.5 Sonic (`amazon.nova-2-5-sonic`) | Real-time voice agents | Single speech-to-speech model; 7 languages, asynchronous tool calling, voice and text in the same session; 256K context | Bedrock bidirectional streaming API: speech $3.00/$12.00, text $0.33/$2.75 |
| Nova Multimodal Embeddings | RAG and cross-modal search | Text, documents, images, video and audio in one vector space; 8K tokens | Bedrock: text $0.135, $0.00006 per image, $0.0007 per second of video |
| Nova Act | Browser UI automation service | Driven by a custom Nova 2 Lite, with a Python SDK and IDE extension | $4.75 per agent hour, us-east-1 only |
| Nova Forge | Build-your-own-model service | Start from pre-training, mid-training or post-training checkpoints and blend in Amazon data | Annual subscription ([CNBC](https://www.cnbc.com/2025/12/02/amazon-nova-forge-lets-clients-customize-ai-models-for-100000-a-year.html) reports $100,000 a year) |
| Nova 2 Pro, Nova 2 Omni (Preview) | Flagship reasoning, text-and-image generation | Open only to Nova Forge customers | Pro $1.25/$10 with global inference; Omni text $0.30/$2.50 |
| Nova Micro / Lite / Pro (first generation) | Older low-cost text and multimodal | No reasoning mode; 128K/300K/300K context, 10K max output | Bedrock: $0.035/$0.14, $0.06/$0.24, $0.80/$3.20 |
| Chronos-2 (`amazon/chronos-2`) | Time-series forecasting | 120M parameters, zero-shot, multivariate and covariates; not a language model | Open weights, Apache 2.0 |

Three things to know up front:

- **Nova 2 Lite has three inference paths with a 10% price gap.** Global cross-Region inference (the `global.` prefix) is cheapest; Geo inference (`us.`/`eu.`/`jp.`) and in-Region calls are both $0.33/$2.75. Workloads whose data cannot leave a geography pay that 10%.
- **Cache writes are free.** Nova 2 Lite cache reads cost $0.075 with global inference and writes cost $0, but the [model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html) caps Nova prompt caching at 20K tokens, so savings on long system prompts are limited.
- **Nova 2 Pro is not an option for ordinary customers.** It has been in preview since December 2025, is still not GA, and is not in the Bedrock model card list.

### Open weights: Chronos

Nova itself has no weights. Amazon's [`amazon` organization](https://huggingface.co/amazon) on HuggingFace logged about 17.3 million downloads in the last 30 days, and the top ten models are all Chronos time-series models; [Chronos-2](https://huggingface.co/amazon/chronos-2) alone accounts for about 9.23 million. It comes from a different team than Nova (Nova is Amazon AGI, Chronos is an AWS forecasting research team) and has a different license. It is here because readers searching for "Amazon open-source models" usually land on it. It overlaps with IBM Granite's time-series line; see the [Granite family post](/posts/tech/2026-11-23-ai-model-family-granite-en).

## Family evolution

| Version | Released | What changed for selection |
|---|---|---|
| Nova Micro/Lite/Pro, Canvas, Reel | 2024-12 (re:Invent) | Amazon's first general-purpose in-house models, entering Bedrock on low prices, plus image and video generation |
| Nova Act (research preview) | 2025-03-31 | A model and SDK dedicated to browser actions, built around splitting workflows into reliable small steps |
| Nova Sonic | 2025-04-08 | Bedrock's first speech-to-speech model, launched with the bidirectional streaming API |
| Nova Premier | 2025-04-30 | First-generation flagship with 1M context, also the recommended teacher for distillation |
| Nova Multimodal Embeddings | 2025-10-28 | One embedding model for text, images, video and audio |
| Nova 2 Lite, Nova 2 Sonic, Nova Act GA, Nova Forge; Nova 2 Pro and Omni previews | 2025-12-02 | The line becomes hybrid reasoning models; price rises from first-gen Lite's $0.06 to $0.30; customization extends from fine-tuning to joining training midway |
| Premier, Sonic v1, Canvas, Reel enter Legacy | 2026-03 | New customers can no longer adopt them; no designated Nova replacement for generation |
| Business Insider reports cutbacks | 2026-07-28 | Premier, Omni, Canvas and Reel move to maintenance-only mode as resources shift to a new frontier model |
| Premier, Sonic v1 retired; Canvas, Reel retired | 2026-09-14; 2026-09-30 | Calls to the old model IDs fail |
| Nova 2.5 Sonic | 2026-10-05 | Voice model with better reasoning and tool calling and lower latency, at Nova 2 Sonic's price |

The site has no daily model cards for Nova; dates in the table come from AWS announcements and the [Bedrock lifecycle table](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle-legacy.html).

Two turns defined these two years. First, Nova 2 turned the whole line into reasoning models: AIME 2025 jumped from first-gen Lite's 7.0 to 91.0. The cost was a fivefold input price and a roughly tenfold output price, so "Nova is the cheapest" now holds only for first-gen Micro and Lite. Second, the 2026 contraction: the flagship, the omni-modal model and image and video generation have all been retired or left in preview. What remains is text, voice, embeddings, and the Act and Forge services.

## Architecture and training trade-offs

### Closed, and the technical report skips architecture

The [Nova 2 technical report](https://cdn.amazon.science/c5/3d/84514a224666b5be6de4b43ef4aa/nova-2-0-technical-report2.pdf) (2025-12-02) covers evaluations, latency and safety assessments only. It gives no parameter count, architecture, training data volume or training hardware. The design choices AWS does disclose are about the interface:

- **Hybrid reasoning**: Nova 2 Lite, Pro and Omni can toggle reasoning, with low/medium/high depth. The report's Figure 2 shows LiveCodeBench scores rising with reasoning level; since reasoning is off by default, most requests are billed in non-reasoning mode.
- **Built-in tools**: web grounding ($0.03 per request) and a code interpreter run on the Bedrock side, and remote MCP tools are supported.
- **Long context**: Nova 2 Lite and Nova 2 Sonic are both 1M. Nova 2.5 Sonic's model card and announcement say 256K while the Nova product page says "up to 1M"; this post follows the model card.

The cost is that you cannot self-host, inspect weights, or estimate inference cost and latency from parameter counts. Artificial Analysis measures Nova 2 Lite with reasoning (medium) at more than 17 seconds to the first answer token and about 140 output tokens per second.

### Customization is the headline

Nova 2 Lite offers more customization options than most closed models on Bedrock:

- **Bedrock**: supervised fine-tuning (SFT) and reinforcement fine-tuning (RFT).
- **SageMaker AI**: full-parameter fine-tuning. [Since February 2026](https://aws.amazon.com/blogs/aws/announcing-amazon-sagemaker-inference-for-custom-amazon-nova-models/), custom Nova Micro, Nova Lite and Nova 2 Lite models can be deployed on SageMaker Inference (G5, G6 and P5 instances, billed hourly).
- **[Nova Forge](https://aws.amazon.com/nova/forge/)**: start from pre-training, mid-training or post-training checkpoints and blend your data with Amazon-curated data to reduce catastrophic forgetting; the reinforcement learning stage can call reward functions in the customer's own environment. On-demand inference for custom models on Bedrock costs the same as the base model.

Forge customer stories (GlobalFoundries, Nimbus Therapeutics, Sony) all claim a customized Nova 2 Lite beat Claude Sonnet 4.5 or Sonnet 4 on their own tasks. These are customer statements, and they compare a customized model with uncustomized general models.

### Chronos-2: a small, specialized encoder

The [Chronos-2 model card](https://huggingface.co/amazon/chronos-2) and [technical report](https://arxiv.org/abs/2510.15821) (2025-10-17) describe a 120M-parameter, encoder-only model inspired by the T5 encoder. Group attention lets related series and covariates in the same group attend to each other, and the model outputs multi-step quantile forecasts. Context reaches 8,192 steps and prediction length up to 1,024; a single A10G handles more than 300 series per second, and CPU inference works too. The previous Chronos-Bolt was univariate only, with a 2,048 context.

## Evaluation and alternatives

### Vendor-reported: the Nova 2 technical report

From Tables 1, 2 and 4 of the [technical report](https://cdn.amazon.science/c5/3d/84514a224666b5be6de4b43ef4aa/nova-2-0-technical-report2.pdf). Competitor numbers come from each vendor's model card, leaderboards or Artificial Analysis; competitor MultiChallenge scores were run by Amazon following each model card's guidance:

| Benchmark | Nova 2 Lite | Claude Haiku 4.5 | GPT-5 Mini | Gemini 2.5 Flash |
|---|---|---|---|---|
| MMLU-Pro | 80.9 | 80.0 | 83.7 | 83.2 |
| GPQA-Diamond | 79.6 | 73.0 | 82.3 | 82.8 |
| AIME 2025 | 91.0 | 80.7 | 91.1 | 72.0 |
| MultiChallenge | 76.6 | 57.1 | 67.8 | 62.6 |
| τ²-bench Telecom (run by Artificial Analysis) | 76.0 | 54.7 | 71.1 | 31.6 |
| BFCL v4 | 60.3 | 61.8 | 56.0 | 55.9 |
| MMMU-Pro | 61.8 | 58.0 | 74.1 | 69.0 |
| SWE-Bench Verified | 53.6 (64.5) | 73.3 | 71 | 48.9 (60.4) |
| Terminal-Bench 1.0 | 32.5 | 41.8 | 30.8 | 16.8 |

Numbers in parentheses add inference-time scaling: Nova used Amazon's internal agentic scaffolding, while Gemini's is Google's self-reported test-time scaling, so the conditions differ.

How to read it:

- **Instruction following and multi-turn dialogue are the strengths.** MultiChallenge and τ²-bench Telecom lead all three peers, which is the basis for AWS pitching it at customer service and process automation.
- **Coding and vision are the weak spots.** Without scaffolding, SWE-Bench Verified at 53.6 trails Haiku 4.5 and GPT-5 Mini clearly; MMMU-Pro trails GPT-5 Mini by about 12 points.
- **The competitors are a year old.** Haiku 4.5, GPT-5 Mini and Gemini 2.5 Flash all have successors on Bedrock and elsewhere, and Amazon has not published a new comparison.

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/nova-2-0-lite-reasoning-medium) does not give Nova 2 Lite or Nova 2 Pro Preview a score on its current Intelligence Index v5.0.1. Individual results from the earlier index are still shown on [OpenRouter's model page](https://openrouter.ai/amazon/nova-2-lite-v1): Nova 2.0 Lite (high) scores 72.8% on τ²-Bench Telecom, 81.1% on GPQA Diamond and 16.7% on Terminal-Bench Hard. Artificial Analysis rates the price "somewhat expensive" on input and "expensive" on output: the median output price in its class is about $0.83, against Nova 2 Lite's $2.50.

### Voice: Nova 2 Sonic and 2.5 Sonic

The technical report compares Nova 2 Sonic with GPT-Realtime (2025-08) and Gemini 2.5 Flash Live (2025-09):

- **Speech recognition**: average WER on Common Voice across seven languages is 6.5%, against 8.4% for GPT-Realtime and 15.9% for Gemini 2.5 Flash Live (run by Amazon).
- **Reasoning**: Big Bench Audio 87.0 versus GPT-Realtime's 83.0 (run by Artificial Analysis).
- **Latency is the weak spot**: Artificial Analysis measured a median time to first audio of 1.39 seconds, versus 0.98 for GPT-Realtime and 0.63 for Gemini 2.5 Flash Live.

The Nova 2.5 Sonic [announcement](https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-nova-2.5-Sonic/) only says reasoning, instruction following and tool calling improved and latency dropped. It publishes no numbers, and no third-party comparison exists yet. For a cross-vendor comparison of voice models, see the [speech and audio overview](/posts/tech/2026-08-26-ai-model-family-speech-audio-en).

### Time series: Chronos-2

At release, Chronos-2 ranked first among public models for zero-shot forecasting on fev-bench, GIFT-Eval and Chronos Benchmark II (vendor-reported). Other vendors have since claimed to beat it: in October 2026, H2O.ai said its TimeH2O-v1 had the top win rate among 32 models on fev-bench (see [that day's AI agent daily](/posts/daily/2026-10-27-ai-agent-daily-en)). Check the leaderboard's current snapshot before citing a rank.

## Licensing, pricing, and deployment

### Licenses and service terms

- **Nova**: closed and offered only as a service, under the AWS Service Terms and each Bedrock model's EULA (linked from the model cards). The [Nova product page](https://aws.amazon.com/nova/models/) states uncapped indemnity. Content moderation can be relaxed for approved business use cases such as security analysis; controls for child safety and privacy cannot be changed.
- **Chronos family**: Apache 2.0 (HF metadata and the LICENSE in the [GitHub repo](https://github.com/amazon-science/chronos-forecasting)), with no revenue or use restrictions.

### Bedrock pricing notes

- **Service tiers**: Nova 2 Lite supports Standard, Priority, Flex and Reserved. Flex and batch inference are both half price ($0.15/$1.25 with global inference), and Priority is 1.75 times the standard rate.
- **Voice is billed per token**: Nova 2.5 Sonic and Nova 2 Sonic cost the same, $3 for speech input and $12 for speech output; text tokens such as tool results and conversation history are billed separately at $0.33/$2.75.
- **Nova Act is billed by time**: $4.75 per agent hour, from when the agent starts working to when it stops. Time spent waiting for a human reply is excluded, and agents running in parallel are billed separately.
- **Reference point**: also on Bedrock, [Claude Haiku 5.5](https://openrouter.ai/provider/amazon-bedrock) lists at $0.10/$0.50. Per token, Nova 2 Lite is no longer a low-price option on Bedrock; only first-gen Micro and Lite are.

### Regions and retirements

- Nova 2 Lite's model card lists 26 Regions it can be called from (including Taipei, ap-east-2); some Regions are cross-Region inference only. Nova 2.5 Sonic is only in us-east-1, us-west-2, eu-north-1 and ap-northeast-1; Nova Act and Nova Forge are only in us-east-1.
- **Retired**: Nova Premier (`amazon.nova-premier-v1:0`) and first-gen Nova Sonic (`amazon.nova-sonic-v1:0`) were retired on 2026-09-14, and Nova Canvas and Nova Reel on 2026-09-30. Move Sonic v1 to Nova 2.5 Sonic. Premier workloads can move to Nova 2 Lite (the technical report says Lite beats Premier on multi-step reasoning and agent tasks at one seventh the cost). AWS names no Nova replacement for Canvas and Reel, so on Bedrock you have to switch to another vendor's image or video model (see the [video generation overview](/posts/tech/2026-08-26-ai-model-family-video-generation-en)). OpenRouter still lists Nova Premier, but it is retired on the Bedrock side; do not pick it for new projects.
- **Next retirement risk**: the Nova 2 Lite and Nova 2 Sonic model cards say "EOL no sooner than 2026-12-02," with a Legacy period of at least 6 months. That is the earliest possible date, not a scheduled one, but for a family that was cut back in 2026, upcoming notices are worth watching. Models launched on Bedrock after September 7, 2026, including Nova 2.5 Sonic, follow the new lifecycle policy, under which the model card states the earliest EOL date and the length of the Legacy period.

### Adoption

- AWS says more than 50,000 customers use Nova models (an official figure that does not define "use").
- On OpenRouter, Nova 2 Lite processes about 3.5 billion tokens a week, and Amazon Bedrock is its only provider.
- HuggingFace: Chronos-2 has 9.23 million downloads in the last 30 days, and 61 derivative models list `amazon/chronos-2` as their base model. Nova has no weights, so there are no HuggingFace or Ollama download numbers to compare.

## Agent integration and selection

- **Already on AWS and need a cheap reasoning model for customer service, document processing or process automation** → Nova 2 Lite. Reasoning is off by default; run in non-reasoning mode first and turn on low or medium for the tasks that fail.
- **Main coding agent** → do not choose Nova 2 Lite. Amazon's own SWE-Bench Verified and the third-party Terminal-Bench Hard both put it behind peers at the same price.
- **Price per token is what matters** → compare Claude Haiku 5.5 and first-gen Nova Micro/Lite on Bedrock first; Nova 2 Lite's output price is five times Haiku 5.5's.
- **Real-time voice customer service** → Nova 2.5 Sonic. It is Bedrock's native speech-to-speech model, and with [Strands Bidi Agents](https://strandsagents.com/blog/bidi-agents-now-ga/) it reconnects in the background to get past the 8-minute single-session limit. Measure latency first; Nova 2 Sonic's time to first audio is clearly slower than OpenAI's and Google's.
- **RAG that searches text, images and video together** → Nova Multimodal Embeddings, one model instead of several embedding pipelines.
- **Repetitive web forms and back-office operations** → Nova Act. Split the workflow into small steps in Python and hand off to a human when needed; it bills by the hour, so long waits for pages to load cost money too.
- **Lots of proprietary data and a wish for your own model** → try Nova 2 Lite SFT or RFT on Bedrock first. Save Nova Forge, at around $100,000 a year, for cases that need to intervene at pre-training or mid-training.
- **Demand or metric forecasting** → Chronos-2, fully self-hostable under Apache 2.0.

The smallest selection check: use the Bedrock Converse API to send the same task set to `global.amazon.nova-2-lite-v1:0` (reasoning off, and medium) and to the model you use now, then compare completion rate, output tokens and the bill. With the Converse API you switch by changing the model ID; nothing else in the code changes.

## Limitations and trade-offs

- **The family is shrinking.** The Premier flagship, the omni-modal Omni and image and video generation have been retired or left in preview; the new frontier model Business Insider reported has not been announced, so future investment in current models is uncertain.
- **AWS only.** No weights and no hosting on other clouds; OpenRouter only forwards to Bedrock. Leaving AWS means switching models.
- **Evaluations are mostly vendor-reported, against last-generation peers.** The technical report compares Claude Haiku 4.5 and GPT-5 Mini; Artificial Analysis's new index has no Nova 2 scores.
- **Weak at coding and vision.** SWE-Bench Verified without scaffolding and MMMU-Pro both trail same-tier peers.
- **High output price.** Artificial Analysis ranks the $2.50 output price as expensive for its class, and cheaper alternatives exist on Bedrock.
- **Opaque architecture.** Parameter counts, training data and architecture are undisclosed, so latency and cost can only be measured.

Nova fits specific cases: your data and permissions already live on AWS, you need indemnity and Bedrock's governance features, or you want AWS-native agent components such as Nova Act and Sonic. In a selection driven purely by scores or price, Nova 2 Lite rarely makes the front of the list, and Amazon's best-known open-weight model is Chronos-2, which is not part of Nova at all.

## References

- [Amazon Nova 2: Multimodal Reasoning and Generation Models — technical report and model card (PDF)](https://cdn.amazon.science/c5/3d/84514a224666b5be6de4b43ef4aa/nova-2-0-technical-report2.pdf)
- [Amazon Nova 2 technical report — Amazon Science page](https://www.amazon.science/publications/amazon-nova-2-multimodal-reasoning-and-generation-models)
- [Announcing Amazon Nova 2 foundation models — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/nova-2-foundation-models-amazon-bedrock/)
- [Introducing Amazon Nova 2 Lite — AWS News Blog](https://aws.amazon.com/blogs/aws/introducing-amazon-nova-2-lite-a-fast-cost-effective-reasoning-model/)
- [Introducing Amazon Nova 2 Omni in Preview — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-nova-2-omni-preview/)
- [Introducing Amazon Nova 2 Sonic — AWS News Blog](https://aws.amazon.com/blogs/aws/introducing-amazon-nova-2-sonic-next-generation-speech-to-speech-model-for-conversational-ai/)
- [Announcing Amazon Nova 2.5 Sonic — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-nova-2.5-Sonic/)
- [Nova 2 Lite — Bedrock model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-lite.html)
- [Nova 2.5 Sonic — Bedrock model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-2-5-sonic.html)
- [Nova Pro — Bedrock model card](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-amazon-nova-pro.html)
- [Nova Premier — Bedrock model card (Simplified Chinese edition)](https://docs.aws.amazon.com/zh_cn/bedrock/latest/userguide/model-card-amazon-nova-premier.html)
- [Model lifecycle (Legacy) — Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle-legacy.html)
- [Model lifecycle — Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-lifecycle.html)
- [Amazon Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)
- [AWS Price List API — AmazonBedrock (us-east-1)](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonBedrock/current/us-east-1/index.json)
- [Amazon Nova pricing](https://aws.amazon.com/nova/pricing/)
- [Amazon Nova foundation models](https://aws.amazon.com/nova/models/)
- [Amazon Nova Forge](https://aws.amazon.com/nova/forge/)
- [Build agents with Amazon Nova Act (GA) — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/12/build-automate-production-ui-workflows-nova-act/)
- [Introducing Amazon Nova Act — Amazon Science](https://www.amazon.science/blog/nova-act)
- [Amazon Nova Premier — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-nova-premier-complex-tasks-model-distillation/)
- [Announcing Amazon Nova Sonic — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/04/amazon-nova-sonic-speech-to-speech-conversations-bedrock/)
- [Announcing Amazon Nova Multimodal Embeddings — AWS What's New](https://aws.amazon.com/about-aws/whats-new/2025/10/amazon-nova-multimodal-embeddings/)
- [Announcing Amazon SageMaker Inference for custom Amazon Nova models — AWS News Blog](https://aws.amazon.com/blogs/aws/announcing-amazon-sagemaker-inference-for-custom-amazon-nova-models/)
- [Bidi Agents now GA — Strands Agents](https://strandsagents.com/blog/bidi-agents-now-ga/)
- [Amazon Nova Forge lets clients customize AI models for $100,000 a year — CNBC](https://www.cnbc.com/2025/12/02/amazon-nova-forge-lets-clients-customize-ai-models-for-100000-a-year.html)
- [Amazon overhauls its AI strategy, winding down most flagship models — Business Insider](https://www.businessinsider.com/amazon-overhauls-ai-strategy-phasing-out-most-nova-models-2026-7)
- [Amazon: Nova 2 Lite — OpenRouter (pricing, providers, Artificial Analysis scores)](https://openrouter.ai/amazon/nova-2-lite-v1)
- [Amazon Bedrock — OpenRouter provider page](https://openrouter.ai/provider/amazon-bedrock)
- [Nova 2.0 Lite (medium) — Artificial Analysis](https://artificialanalysis.ai/models/nova-2-0-lite-reasoning-medium)
- [Nova 2.0 Pro Preview — Artificial Analysis](https://artificialanalysis.ai/models/nova-2-0-pro-reasoning-medium)
- [amazon/chronos-2 — HuggingFace model card](https://huggingface.co/amazon/chronos-2)
- [Chronos-2: From Univariate to Universal Forecasting — arXiv 2510.15821](https://arxiv.org/abs/2510.15821)
- [amazon-science/chronos-forecasting — GitHub](https://github.com/amazon-science/chronos-forecasting)
- [Amazon Bedrock platform overview](/posts/ai/2026-08-22-amazon-bedrock-llm-platform-en) — this site
- [IBM Granite model family](/posts/tech/2026-11-23-ai-model-family-granite-en) — this site
- [Speech and audio model overview](/posts/tech/2026-08-26-ai-model-family-speech-audio-en) — this site
- [Video generation model overview](/posts/tech/2026-08-26-ai-model-family-video-generation-en) — this site
- [AI agent daily, 2026-10-27](/posts/daily/2026-10-27-ai-agent-daily-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
