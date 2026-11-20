---
title: "GPT——Closed API for Revenue, Open GPT-OSS for Ecosystem: From the GPT-5.6 Tiers to GPT-6.2 Astra/Sol on the World's Largest AI Platform"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, gpt, openai, model-family-gpt, reasoning, agentic-coding, model-selection]
lang: en
type: deep-dive
tldr: "GPT is OpenAI's LLM family, from the 117M-parameter GPT-1 in 2018 to the GPT-6 generation in 2026: GPT-6 Astra as flagship and Sol/Luna as cheaper tiers in September, GPT-6.1 Sol in late September, GPT-6.1 Terra in October, and on November 17 GPT-6.2 Astra ($8/$40) and GPT-6.2 Sol ($2/$10) took over as the main models. The same underlying model is also split into trusted-access lines, Rosalind (life sciences) and Cyber (security). The open-weight line is still just the 2025 GPT-OSS 120B/20B (Apache 2.0)."
description: "Complete GPT model family guide: evolution from GPT-1 (2018) to GPT-6.2 (2026), the closed API vs open GPT-OSS strategy, the GPT-6 generation's Astra/Sol/Terra/Luna tiers and pricing, the Rosalind and Cyber trusted-access lines, legacy model shutdown dates, and a selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 3
draft: false
glossary:
  - term: "RLHF"
    definition: "Reinforcement Learning from Human Feedback—the alignment technique behind GPT-3.5 and ChatGPT"
  - term: "Reasoning effort"
    definition: "The reasoning-depth parameter used since GPT-5—from none/low to max—trading speed and cost against quality; GPT-6.2 Astra rejects none"
  - term: "Trusted Access"
    definition: "OpenAI's application-based access for high-risk domains: use cases, security controls and governance are reviewed before models with relaxed refusals, such as Rosalind (life sciences) or Cyber (security), are opened up"
  - term: "GPT-OSS"
    definition: "OpenAI's first open-weight language models (2025/08), 120B and 20B sizes, Apache 2.0 licensed"
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-gpt)

On November 30, 2022, ChatGPT went live—1 million users in five days, 100 million in two months, the fastest-growing consumer product in history. Four years later, in 2026, OpenAI went through two generations in half a year: the GPT-5.6 Sol/Terra/Luna tiers launched in July, GPT-6 Astra opened a new generation in September, and on November 17 GPT-6.2 Astra/Sol cut the flagship price by another 20%. This is the third family deep-dive in the "AI Model Families" series, tracing GPT's full evolution from GPT-1 to GPT-6.2.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on the models listed on OpenAI's API pricing page as of 2026-11-20:

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| GPT-6.2 Astra | Flagship for the hardest professional and research work | Highest quality, $8/$40 | Closed API, ChatGPT Work, Codex |
| GPT-6.2 Sol | Everyday workhorse | Close to Astra at about a fifth of the price, $2/$10 | Closed API, ChatGPT Work, Codex |
| GPT-6.1 Terra | High-volume computer use and documents | Half of Sol's price, $1/$5 | Closed API |
| GPT-6 Luna | High throughput, low cost | $0.10/$0.50 | Closed API |
| GPT-6 Rosalind / GPT-6 Cyber | Life sciences / security lines | Trusted access, relaxed refusal boundaries | Application-only API |
| GPT-OSS 120B / 20B | Local deployment | Open weights, not frontier | Apache 2.0 weights |

### Two Product Lines: Closed API Earns Revenue, Open GPT-OSS Fills the Ecosystem
The key to reading GPT's 2026 strategy is splitting it into two lines—the opposite direction from Qwen (Qwen started open and has been pulling back toward closed; GPT started closed and only recently added open weights):

**Closed API line** (OpenAI API / ChatGPT / Codex, also sold through Azure and Amazon Bedrock): every flagship since GPT-5 is API-only, with no downloadable weights. In 2026 this line split from a single GPT-5 into several price tiers, and in the GPT-6 generation the names settled into Astra (flagship) / Sol (everyday) / Terra (mid-priced) / Luna (efficient), each advancing its own version number—so what is on sale at the same time is 6.2 Astra, 6.2 Sol, 6.1 Terra and 6 Luna, not one tidy generation. This line drives revenue—1B users and 2M enterprise customers all run on it.

**Open-weight line** (GPT-OSS): first released in August 2025 in 120B and 20B sizes under Apache 2.0. The only follow-up was gpt-oss-safeguard in October 2025 (safety-classification fine-tunes at the same sizes); as of November 2026 there is no new general-purpose open model. This line fills an ecosystem niche—an exit for developers who need self-hosting, fine-tuning, or data sovereignty—but it is explicitly not a frontier model.

The turning point worth remembering: OpenAI converted to capped-profit in 2019 and IPO rumors surfaced in 2026, so commercial pressure only keeps rising. GPT-OSS reads more as a strategic response (to the open-weight push from Llama, Qwen, and DeepSeek) than a return to openness—the closed-flagship core never loosened, and more than a year without a sequel to the open line confirms it.


### Sub-lines and Ecosystem: How Many Products GPT Actually Has
On "family breadth," GPT ranks second among closed vendors (after Qwen). Beyond the general mainline, it runs several sub-lines:

| Sub-line | Representative versions (2026-11) | Role |
|---|---|---|
| Flagship and everyday mainline | GPT-6.2 Astra/Sol, GPT-6.1 Terra, GPT-6 Luna | Price tiers from top intelligence to high throughput |
| Trusted-access lines | GPT-6 Rosalind (life sciences), GPT-6 Cyber (security), Astra for Law | Same underlying model, refusals and access tuned per domain |
| Open weights | GPT-OSS 120B / 20B, gpt-oss-safeguard | Apache 2.0, self-hostable |
| Image | GPT-Image-2.6 Flare/Sunburst | Text-to-image, editing, GIFs, SVG output |
| Speech | gpt-realtime-2.1, GPT-Live, gpt-transcribe | Voice conversation, live transcription |
| Embeddings | text-embedding-3 | RAG workhorse |
| Developer tools | Codex, Responses API, Agents SDK | Agent infrastructure |
| Consumer | ChatGPT (incl. Work) | World's largest AI app |

Two observations:

**From "one router" back to "explicit tiers."** GPT-5 (2025-08) bet on unified routing: one router sent each task to a fast model or a reasoning model, so developers did not have to choose. But from GPT-5.6's Sol/Terra/Luna to GPT-6's Astra/Sol/Terra/Luna, OpenAI instead laid the tiers out for developers to pick, plus a reasoning effort parameter for depth. The upside is cost control; the cost is a naming matrix that is very hard to remember.

**The old lines are being shut down in bulk.** Among the o-series reasoning models, o1, o3-mini and o4-mini were shut down on 2026-10-23, and o3, o3-pro and the GPT-5 series stop on 2026-12-11. Sora 2 and the Videos API closed on 2026-09-24 with no replacement. DALL·E has been replaced by the GPT-Image series. The API version of Whisper, `whisper-1`, is scheduled to shut down on 2027-02-26 (the open weights remain). One last reminder: Astra/Sol/Terra/Luna in API model names are service-tier labels and do not guarantee downloadable weights—to judge whether you can self-host, check the license field, not the model suffix.

## Family evolution

### Family Evolution Timeline
| Version | Released | Key facts | What it changed for model selection |
|---|---|---|---|
| GPT-1 | 2018-06 | 117M parameters, first generative pretrained model | Showed "pretrain, then fine-tune" works; not yet a usable product |
| GPT-2 | 2019-02 | 1.5B parameters, staged release over "too dangerous" concerns (later fully open) | Started the "should weights be released" debate; the last open-weight GPT before GPT-OSS |
| GPT-3 | 2020-05 | 175B parameters, few-shot learning, API access (by application) | Shifted from downloading models to calling an API—the start of OpenAI's closed-API path |
| GPT-3.5 / ChatGPT | 2022-03 / 2022-11 | ~175B, RLHF fine-tuning; ChatGPT hit 100M users in 2 months | A chat interface turned the general public into users; RLHF became standard |
| GPT-4 / GPT-4 Turbo | 2023-03 / 2023-11 | Multimodal, 90th percentile on the bar exam; Turbo added 128K context | Set the "closed flagship = highest quality" expectation; long context became usable |
| GPT-4o | 2024-05 | Native multimodality (text + vision + voice) | Voice and images no longer needed a chain of models; API shutdown on 2027-01-14 with GPT-6 Luna as the recommended replacement ([shutdown notice](/posts/daily/2026-10-16-pricing-openai-gpt-4o-gpt-4-1-api-sunset-en)) |
| o1 / o3 / o4-mini | 2024-09 / 2025-04 | Reasoning models, "think before answering" | Reasoning depth became a dimension to choose; later folded into mainline reasoning effort as the o-series was retired |
| GPT-4.1 | 2025-04 | API-only, 1M context | Brought 1M context into the API mainline |
| GPT-OSS | 2025-08 | 120B / 20B, Apache 2.0 | An official self-hosting option—with no sequel since |
| GPT-5 | 2025-08 | Fast model + reasoning model + real-time router | The system picked the model for developers, at the cost of opaque spend; API shutdown on 2026-12-11 ([shutdown notice](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en)) |
| GPT-5.5 | 2026-04 | Efficiency and agent capability gains, 1M context | Removed from ChatGPT and Codex on 2026-10-14; still callable in the API ([retirement notice](/posts/daily/2026-09-17-pricing-openai-gpt-5-5-retirement-en)) |
| GPT-5.6 Sol/Terra/Luna | 2026-07 | Three-tier lineup, 1.05M context | Back from "the router picks" to "developers pick a price tier," with repeated price cuts funded by inference efficiency ([official price cut](/posts/daily/2026-08-23-pricing-openai-gpt-5-6-sol-official-price-cut-en)) |
| GPT-6 Astra | 2026-09-03 | New-generation flagship, $10/$50; meets the Critical cybersecurity threshold under the Preparedness Framework | The generation launched flagship-first, and safety tiers began to shape which capabilities you can use ([model card](/posts/daily/2026-09-06-model-openai-gpt-6-astra-en)) |
| GPT-6 Sol / Luna | 2026-09-22 | Trained with methods similar to Astra's, a further 50% below GPT-5.6 promotional pricing | Cheaper tiers stopped being cut-down flagships; one generation's capability spread across price points ([model card](/posts/daily/2026-09-25-model-openai-gpt-6-sol-luna-en)) |
| GPT-6.1 Sol | 2026-09-29 | Announced at DevDay, near-Astra performance at about a fifth of the price | The everyday model closed in on the flagship, so most tasks no longer need Astra ([model card](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol-en)) |
| GPT-6.1 Terra | 2026-10-26 | Mid-priced computer-use model, $1/$5 | High-volume computer-use work got a dedicated mid-priced option ([model card](/posts/daily/2026-10-26-model-openai-gpt-6-1-terra-en)) |
| GPT-6 Rosalind / Cyber | 2026-10-30 / 11-05 | Trusted-access lines: life sciences, security | The same underlying model split into products and prices by access eligibility ([Rosalind](/posts/daily/2026-11-01-model-openai-gpt-6-rosalind-en), [Cyber](/posts/daily/2026-11-06-model-openai-gpt-6-cyber-en)) |
| GPT-6.2 Astra / Sol | 2026-11-17 | Flagship price cut 20%, cached input cut 60%; Astra is the first externally released model to meet the High threshold for AI self-improvement | The current selection baseline; see the sections below |

Eight years, many milestones. GPT's arc is clear: **from research paper to consumer product to platform ecosystem**. GPT-3 proved scaling laws, ChatGPT created consumer demand, GPT-4 set the quality bar, and from GPT-5 onward the focus is agent capability and efficiency. The pace picked up sharply in the second half of 2026: three version numbers—GPT-6, 6.1 and 6.2—in under three months from September to November, each upgrade centered on "same quality, lower unit price."

## Architecture and training trade-offs

### Architecture: Why One System Handles Many Tasks
#### Unified Routing: Where GPT-5 Started

GPT-5 in August 2025 marked OpenAI's shift from "a single model" to "a unified system":

**GPT-5 = fast model + reasoning model + real-time router**

The router decides in real time which model to use, based on conversation type, complexity, tool needs, and explicit user intent (e.g., "think hard about this"). Conceptually it resembles Anthropic's adaptive thinking, but GPT-5's implementation is more explicit—two separate models behind the scenes, whereas Claude adjusts reasoning depth inside one model.

The practical upside was that developers did not have to pick a model. The cost was opaque routing and weaker cost control—the background for GPT-5.6 and GPT-6 going back to explicit tiers and handing the choice back to developers. The consumer side keeps the automation: new ChatGPT Work chats default to GPT-6.2 Sol at Light reasoning.

#### The GPT-6 Generation: One Method, Cut into Price Points

The GPT-6 generation tiers differently from GPT-5.6. In the GPT-6 Sol/Luna announcement, OpenAI states these two models were "trained with similar methods as GPT-6 Astra," carrying Astra's gains in professional work, factuality, coding, computer use and alignment into faster, cheaper models—not a cut-down copy of the same model. Each point release since has done the same thing:

- **GPT-6.1 Sol** (9/29): OpenAI says it matches GPT-6 Astra on DeepSWE v1.1 at about a fifth of the cost; cached input dropped to $0.10
- **GPT-6.1 Terra** (10/26): focused on computer use and visual reasoning; the internal factual error rate at low effort fell from 53.6% for GPT-5.6 Terra to 16.7%
- **GPT-6.2 Astra/Sol** (11/17): Astra's standard rates down 20% and cached input down 60%; OpenAI stresses finishing harder tasks "with fewer output tokens"

Inference efficiency is the main source of the price cuts. The GPT-6 Sol/Luna announcement credits improvements in caching and inference; GPT-6.2 cuts both unit prices and the tokens each task consumes, so cost per task falls further than price per token.

#### Same Weights, Priced by Access Tier

Another new move in the GPT-6 generation is splitting one underlying model into different products by safety configuration and access plan. The GPT-Rosalind-6 system card addendum states that it "uses the same weights as GPT-6 Astra. We did not add training data or perform additional post-training for this release." The difference is fewer refusals on dual-use biology questions, available only through trusted access. GPT-6 Cyber is a security model trained specifically to find and validate exploitable vulnerabilities while staying within the authorized scope, available only to vetted Daybreak Red customers. In other words, these two lines sell not just capability but "how far the model is willing to answer."

#### Native Multimodality and the GPT-OSS Architecture

GPT-4o (2024-05) established the native multimodal path—text, vision, and voice processed inside one model rather than through bolted-on adapters. By GPT-6.2 Astra, the API model page lists text and image inputs with text output; image generation and voice are handled by the GPT-Image and realtime series respectively.

On the other side, GPT-OSS was OpenAI's first release of language model weights. Both are MoE: the 120B has about 117B total parameters with 5.1B active per token and runs on a single 80GB GPU; the 20B has about 21B total with 3.6B active and runs in 16GB of memory. Both support function calling and structured outputs under a clean Apache 2.0 license. Quality trails the closed flagships by a wide margin, and there has been no update in over a year.

## Evaluation and alternatives

### Performance Position
The GPT-6 generation announcements lean heavily on "versus the predecessor" and "cost per task" comparisons. The following follows the official announcement text and is marked as self-reported:

| Model | Headline official numbers (OpenAI self-reported) |
|---|---|
| GPT-6 Astra | FrontierMath Tier 4 98%, ARC-AGI-3 99.9%, ExploitBench 100%; OSWorld 2.0 latency simulation 72.6% (GPT-5.6 Sol 65.7%) with about 47% less time per task |
| GPT-6 Sol | AutomationBench (xhigh) 33.2% at $0.27 per task; Claude Opus 5 (max) 26.9% at 11.1x Sol's cost. Agents' Last Exam (max) 56.4% |
| GPT-6.1 Sol | Matches GPT-6 Astra on DeepSWE v1.1 at about a fifth of the cost; Terminal-Bench Science 0.1 at $5.47 per task vs. $23.21 for Opus 5.5 and $23.80 for Astra (Astra still scores highest, 68.1%) |
| GPT-6.1 Terra | Terminal-Bench 4.0 (max) 50.3%, vs. GPT-5.6 Terra's published 21.5% |
| GPT-6.2 Astra | Agents' Last Exam 5.2 points above GPT-6 Astra at under a third of the cost; 5.5 points above Claude Fable 5.2 at about 5% of the cost. Terminal-Bench Science 0.1 9 percentage points above GPT-6 Astra |
| GPT-6.2 Sol | Cognition FrontierCode 2.0 (max) within 0.5 points of GPT-6.2 Astra at about a fifth of the cost |

Against third-party evaluations:

| Source | Result |
|---|---|
| Artificial Analysis AA-3D (blind human preference) | GPT-6.2 Astra first at 1,318 Elo, Claude Fable 5.2 1,271, GPT-6.2 Sol 1,259 (as cited in OpenAI's announcement) |
| Artificial Analysis Intelligence Index | GPT-6.2 Astra ranks second behind Claude Fable 5.2, but leads the cost-performance frontier (per The Decoder) |
| Agents' Last Exam | The Decoder notes only Gemini 4 Carbon keeps up with GPT-6.2 Astra on this benchmark |

Two cautions when reading these numbers. First, OpenAI likes to present "same score at a fraction of the cost," and absolute scores are often left out. Second, comparisons against Claude often carry footnotes—for example, Fable 5.2's Agents' Last Exam result excludes nine tasks that used a fallback model. On composite indices GPT-6.2 Astra does not win outright; what it really leads on is cost per task.


### Competitive Position
Placing GPT in the late-2026 landscape:

- **vs. Claude**: the two closed-model leaders. Claude Fable 5.2 still ranks first on Artificial Analysis's composite index; GPT-6.2 Astra leads on OpenAI's chosen professional-work and science benchmarks at a much lower cost per task. See the [Claude family](/posts/tech/2026-08-24-ai-model-family-claude-en)
- **vs. Gemini**: Gemini 4 Carbon is one of the few models keeping pace with GPT-6.2 Astra on Agents' Last Exam; Gemini's long-standing strengths are native multimodality and long context. See the [Gemini family](/posts/tech/2026-08-24-ai-model-family-gemini-en)
- **vs. DeepSeek and the open frontier**: DeepSeek, Qwen, Kimi and GLM keep shipping open weights that can be self-hosted at unit prices far below GPT's. GPT's edge is ecosystem maturity (Codex, Responses API), cloud distribution and enterprise compliance; GPT-OSS offers an open fallback, but not at frontier quality. See the [DeepSeek family](/posts/tech/2026-08-24-ai-model-family-deepseek-en)

## Licensing, pricing, and deployment

### The Licensing Trap: Closed Flagship, Non-Frontier Open Weights
OpenAI's licensing is the most stratified in the series—there is a clear line between open and closed, and the GPT-6 generation added an application-only layer:

- **Closed mainline (all GPT-6.x)**: API only, no weights, licensed under OpenAI's terms of service. The strongest models cannot be self-hosted at all
- **Trusted access (Rosalind, Cyber)**: even API access requires an application; OpenAI reviews use cases, security controls and governance before granting access, and reserves the right to revoke it
- **Open weights (GPT-OSS 120B / 20B)**: Apache 2.0—downloadable, fine-tunable, self-hostable—but not frontier models
- **Legacy**: GPT-2 fully open, GPT-3 semi-open (by application), GPT-4 onward fully closed

The caveat: **"OpenAI open-sources" ≠ "the strongest model is open."** GPT-OSS is genuine Apache 2.0, cleaner than Llama 4's Community License, but quality trails GPT-6.2 by a wide margin. If you need "Apache 2.0 + frontier quality," GPT-OSS can't deliver—look at DeepSeek (MIT) or Qwen (mostly Apache).

Three easily overlooked cost and operations details:

- **Long-context surcharge**: once a request exceeds 272K input tokens, input and cache rates double and output becomes 1.5x for the whole request. Long-document workloads (codebases, contracts, meeting transcripts) cost noticeably more than the short-context price suggests
- **Fast retirement cadence**: OpenAI's docs promise at least 6 months' notice for generally available models, but 2026 scheduled shutdowns in bulk—the GPT-5 series, o3 and o3-pro stop on 2026-12-11, GPT-4o and GPT-4.1 on 2027-01-14. Moving to the new generation doesn't always save money: the recommended replacement for `gpt-5-mini` is `gpt-6.1-terra`, which raises the unit price from $0.25/$2 to $1/$5
- **Self-serve fine-tuning wound down**: organizations that never ran fine-tuning can no longer create training jobs, and from 2027-01-06 existing customers can't create new ones either. The GPT-6.2 Astra model page also lists fine-tuning as unsupported


### The GPT-6 Generation: Choosing Between Astra, Sol, Terra, and Luna
Standard rates from OpenAI's API pricing page (read 2026-11-20), per 1M tokens, short context (≤272K input):

| Item | GPT-6.2 Astra | GPT-6.2 Sol | GPT-6.1 Terra | GPT-6 Luna |
|---|---|---|---|---|
| Role | Hardest professional, research and coding work | Everyday workhorse | High-volume computer use, documents | High throughput, low cost |
| Input | $8 | $2 | $1 | $0.10 |
| Cached input | $0.40 | $0.10 | $0.05 | $0.01 |
| Output | $40 | $10 | $5 | $0.50 |
| Long-context input / output | $16 / $60 | $4 / $15 | $2 / $7.50 | $0.20 / $0.75 |
| Batch | 50% of Standard | 50% | 50% | 50% |
| Fast mode | 2x Standard | 2x | 2x | 2x |
| License | Closed API | Closed API | Closed API | Closed API |

The GPT-6.2 Astra model page lists a 1,050,000-token context window, 922,000 max input tokens and 128,000 max output tokens. Other billing rules:

- **Ultrafast**: for GPT-6.2 Astra/Sol, 3x Standard through 2027-02-28 and 6x from 2027-03-01
- **Background-request discount**: for GPT-6.2 Astra/Sol, GPT-6.1 Terra and GPT-6 Luna, eligible background requests are 30% below Standard for the 2-hour completion window and 40% below for the 8-hour window
- **Older models still listed**: GPT-6 Astra $10/$50, GPT-6.1 Sol and GPT-6 Sol $2/$10; GPT-5.6 Sol's $4/$20 promotional price only runs until 2026-11-30
- **Specialized-line pricing**: GPT-6 Cyber $20/$100 (Daybreak Red); GPT-6 Rosalind currently at a $10/$50 promotional price through at least 2026-12-31; GPT-6.2 Astra for Law, for lawyers, $8/$40

## Agent integration and selection

### What It Means for Agent Developers
- **Strongest agentic and research performance** → GPT-6.2 Astra: leads OpenAI's professional-work and Terminal-Bench Science results, and its $40 output is 20% cheaper than GPT-6 Astra
- **Everyday coding, writing, multistep work** → GPT-6.2 Sol, $10 output; OpenAI says it comes within 0.5 points of Astra on FrontierCode 2.0 at about a fifth of the cost
- **High-volume computer use, forms, document workflows** → GPT-6.1 Terra, $5 output, focused on computer use and visual reasoning; for the most complex coding OpenAI still recommends Sol or Astra
- **High-throughput classification / summarization** → GPT-6 Luna, $0.50 output, also OpenAI's recommended replacement once GPT-4o and GPT-4.1 shut down
- **Life sciences or security research** → Rosalind and Cyber require trusted-access approval; Rosalind shares Astra's weights, so what you gain is fewer refusals, not more capability
- **Need self-hosting + Apache 2.0** → GPT-OSS 120B/20B can be self-hosted, but it is not frontier and hasn't been updated in over a year; for frontier self-hosting look at Qwen or DeepSeek
- **Still on older models** → check the deprecations page first: the GPT-5 series and o3 shut down on 2026-12-11; before migrating, compare outputs, latency and cost on your own requests
- **When citing benchmarks** → GPT's naming matrix (generation × Astra/Sol/Terra/Luna × point release × specialized line) is the easiest to get wrong of any family. Always write the full model name and date, or you're comparing different runs

## Limitations and trade-offs

Most GPT-6 generation announcements are OpenAI self-reports with OpenAI-chosen baselines and reasoning effort settings, often giving only relative gaps rather than absolute scores; on third-party composite indices GPT-6.2 Astra is not first. GPT-6.x quality also doesn't carry over to GPT-OSS's licensing promises. The long-context surcharge, reasoning settings and Ultrafast multipliers all change real costs, so estimate with the billing conditions preserved here.

### Overall
GPT's story is "from research paper to global infrastructure." OpenAI used GPT-3 to prove scaling laws, ChatGPT to create consumer demand, GPT-4 to set the quality bar, GPT-5's unified routing to redefine how models are used, and then the GPT-6 generation to lay the tiers out: Astra, Sol, Terra and Luna cover every price band from $0.50 to $40 output.

The theme of the three months from GPT-6 to 6.2 wasn't raising the score ceiling but pushing flagship-level capability down into cheaper tiers while cutting the tokens each task consumes. For agent developers the pragmatic approach is: Astra for the hardest tasks, Sol for everyday coding, Terra for high-volume computer use, Luna for high-throughput work—and keep a close eye on shutdown dates.

The thing really worth watching is how licensing and access are stratifying: flagships fully closed, specialized lines by application only, GPT-OSS genuinely Apache 2.0 but not frontier and frozen in 2025. "Open source" is only real on one tier of GPT today, and that tier isn't the strongest model.


## Update history

- **2026-11-20**: Added the GPT-6 generation (GPT-6 Astra, GPT-6 Sol/Luna, GPT-6.1 Sol, GPT-6.1 Terra, GPT-6.2 Astra/Sol), the Rosalind and Cyber trusted-access lines, and GPT-Image-2.6. Rewrote the version matrix, sub-line table, timeline, benchmarks, pricing and selection guide based on OpenAI's pricing page and announcements as of 2026-11-20; added legacy shutdown dates and the fine-tuning wind-down. GPT-5.6 moved to history: its benchmark table, pricing table and selection advice left the main text, and the figures from that time are in the daily model cards and pricing snapshots linked from the timeline; each timeline row now notes what it changed for model selection. Corrected errors: "o4 / o5" in the sub-line table (o5 was never released), "DALL·E 3 / 4" (replaced by GPT-Image), and GPT-5.6 Sol's "$5/$30, promo through 11/21," which didn't match OpenAI's pricing page ($4/$20 promotional price, through 11/30).
- **2026-10-11**: Restructured sections to the shared family format and added a matrix compiled from existing content. Kept the original versions, prices, and source dates; no new round of fact-checking.

## References

- [Introducing GPT-6.2 Astra and Sol — OpenAI](https://openai.com/index/introducing-gpt-6-2-astra-sol)
- [GPT-6.2 Astra model page — OpenAI API Docs](https://developers.openai.com/api/docs/models/gpt-6.2-astra)
- [GPT-6 Astra: A new generation of intelligence — OpenAI](https://openai.com/index/gpt-6-astra/)
- [Introducing GPT-6 Sol and Luna — OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- [Introducing GPT-6.1 Sol — OpenAI](https://openai.com/index/introducing-gpt-6-1-sol/)
- [Introducing GPT-6.1 Terra — OpenAI](https://openai.com/index/introducing-gpt-6-1-terra/)
- [GPT-Rosalind-6 System Card Addendum — OpenAI Deployment Safety Hub](https://deploymentsafety.openai.com/gpt-rosalind-6)
- [GPT-6 Cyber: Advancing the frontier of aligned cybersecurity agents — OpenAI](https://openai.com/index/introducing-gpt-6-cyber/)
- [Introducing Images 2.6 — OpenAI](https://openai.com/index/introducing-images-2-6/)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)
- [Introducing gpt-oss — OpenAI](https://openai.com/index/introducing-gpt-oss/)
- [Introducing gpt-oss-safeguard — OpenAI](https://openai.com/index/introducing-gpt-oss-safeguard/)
- [OpenAI launches GPT-6.2 Astra and Sol with lower API prices and some benchmark gains — The Decoder](https://the-decoder.com/openai-launches-gpt-6-2-astra-and-sol-with-lower-api-prices-and-some-benchmark-gains/)
- [GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI](https://openai.com/index/gpt-5-6/)
- [Introducing GPT-5 — OpenAI](https://openai.com/index/introducing-gpt-5/)
- [OpenAI — Wikipedia](https://en.wikipedia.org/wiki/OpenAI)
- [The Complete History of OpenAI](https://www.datastudios.org/post/the-complete-history-of-openai-founding-structure-gpt-models-chatgpt-and-the-road-to-2026)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
