---
title: "Claude——From AI Safety Lab to Fable 5.2 and the Four Claude 5.5 Tiers: the Closed-Model Workhorse for Agents"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, claude, anthropic, model-family-claude, constitutional-ai, agentic-coding, model-selection]
lang: en
type: deep-dive
tldr: "Claude is Anthropic's closed LLM family, known for Constitutional AI training, agent capabilities and coding. Between September and November 2026 it moved to a new generation: Opus 5.5 ($4/$20) is Anthropic's recommended default, Sonnet 5.5 ($2/$10) and Haiku 5.5 ($0.10/$0.50 for short prompts) cover the fast and high-volume tiers, and Fable 5.2 ($8/$40) handles the hardest reasoning and long-horizon agent work. All four have 1M context and 128K output. Fable 5.2 ranks first on Artificial Analysis's composite index; Mythos 5.2, the same underlying model, is available only to organizations in Anthropic's cyber or life-sciences verification programs."
description: "Complete Claude model family guide: evolution from Claude 1 (2023) to Fable 5.2 and the Claude 5.5 series (2026), the API platform vs consumer product lines, Constitutional AI and agent architecture, positioning and pricing of the Fable/Opus/Sonnet/Haiku tiers, Mythos limited access, legacy retirement dates, and a selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 7
draft: false
glossary:
  - term: "Constitutional AI"
    aliases: ["CAIS", "Constitutional AI Safety"]
    definition: "Anthropic's AI alignment method—uses a set of constitutional principles to guide model behavior, enabling self-critique and correction to reduce human annotation dependence"
  - term: "MCP"
    aliases: ["Model Context Protocol"]
    definition: "Anthropic's tool integration standard protocol, allowing LLMs to uniformly call external tools and data sources—dubbed the USB-C interface for AI models"
  - term: "Adaptive Thinking"
    definition: "Claude's dynamic reasoning mechanism—the model decides how much to think based on the effort setting and problem complexity; always on for Fable 5.2 and Opus 5.5"
  - term: "Claude Code"
    definition: "CLI coding agent launched with Claude 3.7 Sonnet (Feb 2025), deeply integrating file I/O, Git operations, and multi-file editing workflows"
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-claude)

In March 2023, the same week OpenAI launched GPT-4, Anthropic quietly released Claude—a language model built around "safety" as its core design philosophy. Three and a half years later, in 2026, Claude went through two generations in half a year: Fable 5, Sonnet 5 and Opus 5 launched in June and July; from September, Opus 5.5, Sonnet 5.5 and Haiku 5.5 formed the Claude 5.5 series; and on November 9 Fable 5.2 took over the top tier. This is the seventh deep-dive in the "AI Model Families" series, tracing Claude's full evolution from Claude 1 to Fable 5.2.

For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on Claude's official models overview and pricing pages as of 2026-11-20:

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| Claude Fable 5.2 | The hardest reasoning and long-horizon agent work | $8/$40, #1 on the composite index | Anthropic API / authorized clouds |
| Claude Opus 5.5 | Anthropic's recommended default for long-running agentic coding and knowledge work | $4/$20 | Anthropic API / authorized clouds |
| Claude Sonnet 5.5 | Balance of speed and intelligence for well-scoped everyday work | $2/$10 | Anthropic API / authorized clouds |
| Claude Haiku 5.5 | High-volume, low-latency classification, extraction, routing | $0.10/$0.50 up to 100K | Anthropic API / authorized clouds |
| Claude Mythos 5.2 | Same underlying model as Fable 5.2 with looser cyber and life-science safeguards | Same price as Fable 5.2 | Only for organizations in verification programs |


### Two Product Lines: API Platform vs Consumer Claude, Plus Four Inference Tiers
The key to understanding Claude's 2026 moves is splitting it into two parallel lines, plus a four-tier inference table:

**API platform line** (developer / enterprise): all inference runs through Anthropic's official API or authorized clouds—Amazon Bedrock, Google Cloud, Microsoft Foundry, and Anthropic's own Claude Platform on AWS. This line drives developer and enterprise revenue and carries Claude Code, MCP, and agent workflows.

**Consumer Claude app line**: claude.ai and the desktop/mobile apps for end users, packaging the same models into chat, writing, and analysis products. This line doesn't release weights or offer self-hosting.

In between is the inference-tier split. In June 2026 Claude grew from three tiers to four by adding Fable; Fable and Mythos are the same underlying model, differing only in safeguards and access eligibility. In the Claude 5.5 generation, the four tiers look like this (Claude API standard prices per 1M tokens):

| Item | Fable 5.2 | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
|---|---|---|---|---|
| Role | Hardest reasoning, long-horizon agents | Default workhorse, long-running coding and knowledge work | Everyday work, fastest Sonnet | High volume, low latency |
| Input | $8 | $4 | $2 | $0.10 (≤100K) / $0.50 (>100K) |
| Output | $40 | $20 | $10 | $0.50 / $2.50 |
| Cache hit | $0.20 | $0.20 | $0.10 | $0.01 / $0.05 |
| Batch API | 50% of standard | 50% | 50% | 50% |
| Context / max output | 1M / 128K | 1M / 128K | 1M / 128K | 1M / 128K |
| Adaptive thinking | Always on | Always on | Adjustable | Adjustable |
| Default effort | high | medium | high | medium |
| Relative latency | Moderate | Moderate | Fast | Fastest |

Three pricing details are worth remembering. First, **cache hits are especially cheap**: on most Claude models a cache hit costs 10% of the input price, 5% on Opus 5.5 and Sonnet 5.5, and only 2.5% on Fable 5.2; since most agentic cost is cache reads, this affects the bill more than the headline price. Second, **Haiku 5.5 is priced in two bands by prompt length**, and the unit price is 5x above 100K. Third, the tokenizer used since Claude 4.7 produces about 30% more tokens for the same text, so when moving from older models a lower unit price doesn't mean a proportionally lower bill.


### Sub-lines and Ecosystem: How Many Models Claude Actually Has
"A small family" is Claude's most underrated trait—it has almost no separate vision, speech, or embedding model lines; its sub-lines are mostly different service tiers of the same base:

| Sub-line | Representative versions (2026-11) | Role |
|---|---|---|
| Top tier | Claude Fable 5.2 | Hardest reasoning and long-horizon planning; can also act as Advisor or Orchestrator for other models |
| Limited access | Claude Mythos 5.2 | Same underlying model as Fable, limited to cyber and life-science verification programs |
| Default workhorse | Claude Opus 5.5 | Long-running coding / agentic work |
| Mid-tier | Claude Sonnet 5.5 | Well-scoped everyday work, documents and slides |
| Lightweight | Claude Haiku 5.5 | Classification, extraction, routing; also suited as a subagent |
| Terminal agent | Claude Code | Command-line coding agent |
| Open standard | MCP (Model Context Protocol) | Open-source protocol for connecting agents to external tools |
| Enterprise product | Claude for Work / Teams | Enterprise permissions and governance |

Two observations:

**MCP is Claude's most underrated ecosystem lever.** Anthropic open-sourced the Model Context Protocol, and it's now the de facto standard for connecting agents to external tools—even if you don't run Claude, your agent infrastructure is likely built on MCP. This extends Claude's influence beyond any single model.

**The product line is concentrated at the API layer.** Unlike Qwen's Coder/VL/Omni/Image sub-lines or Gemini's dedicated image, video, and speech models, Claude's sub-lines are almost all service tiers of the same capability set, with no separate image-generation, speech, or embedding lines. That makes its ecosystem narrower than other large families, but the product experience more consistent.

## Family evolution

### Family Evolution Timeline
| Version | Date | Key facts | What it changed for model selection |
|---|---|---|---|
| Claude 1 | 2023-03 | First public model, 9K context, Constitutional AI training | Safety and refusal boundaries became Claude's selling point |
| Claude 2 / 2.1 | 2023-07 / 2023-11 | 100K → 200K context, system prompts, tool-use experiments | Long-document analysis became an early Claude strength |
| Claude 3 Opus/Sonnet/Haiku | 2024-03 | Three-tier lineup established, multimodal (vision) | Picking a model by price tier began, rather than "just Claude" |
| Claude 3.5 Sonnet | 2024-06 / 2024-10 | Sonnet surpassed the previous Opus; Artifacts, Computer Use beta | The mid-priced Sonnet became most people's default |
| Claude 3.7 Sonnet | 2025-02 | First hybrid reasoning model, Claude Code launched | Reasoning depth became adjustable; coding agents got an official tool |
| Claude 4 / 4.5 | 2025-05–11 | Agentic coding generation, MCP standardized | Claude became one of the main options for agentic coding |
| Claude 4.6 / 4.7 / 4.8 Opus | 2026-02–05 | 1M context, new tokenizer, adaptive thinking, effort control | 1M context and the effort parameter became standard; Opus pricing dropped to $5/$25 and held for several generations |
| Claude Fable 5 / Sonnet 5 / Opus 5 | 2026-06–07 | Fable tier added (Mythos as the limited version); Sonnet 5 at $2/$10; Opus 5 SWE-bench Verified 96% | The lineup went from three tiers to four; Sonnet 5's promotional price became permanent ([pricing note](/posts/daily/2026-08-17-pricing-anthropic-sonnet-5-price-freeze-en)) |
| Claude Fable 5.1 | 2026-09-01 | Artificial Analysis Intelligence Index 66, cache hits cut to $0.25 | The top tier improved in score and cache cost at once ([model card](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1-en)) |
| Claude Opus 5.5 | 2026-09-22 | $4/$20; Anthropic says it matches Fable 5.1 on most work at 40% lower cost than Opus 5 | The default moved from Sonnet / Opus 5 to Opus 5.5; the first Opus price cut in several generations ([model card](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5-en)) |
| Claude Sonnet 5.5 | 2026-09-28 | Same unit price, Terminal-Bench 4.0 from 10.3% to 70.6% | A big capability jump in the everyday tier; savings came from fewer tokens rather than lower prices ([pricing analysis](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing-en)) |
| Claude Haiku 5.5 | 2026-10-07 | 1M context, first Haiku with adjustable effort, about 75% lower average cost | Small models became viable for computer use and subagents ([model card](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5-en)) |
| Claude Fable 5.2 / Mythos 5.2 | 2026-11-09 | $8/$40, 20% cheaper and 30% faster output than 5.1 | The current selection baseline; see the sections below ([model card](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2-en)) |

Three and a half years, many milestones. Claude's arc is clear: **from safety research to the gradual release of agent capabilities**. 3.7 Sonnet introduced reasoning, 4.0 introduced agents, 4.6 introduced 1M context, and the 5 generation added a Fable tier for four tiers. The 5.5 generation focused on lower prices and higher speed: Opus 5.5 and Fable 5.2 each cut unit prices by 20% with much cheaper caching, and Haiku 5.5 cut prices sharply.

## Architecture and training trade-offs

### Architecture: From Safety Research to Agent Capability
#### Constitutional AI

Claude has been trained with Constitutional AI from day one. The core idea: instead of relying on large amounts of human labeling to judge "what's a good answer," it uses a set of **constitutional principles** to let the model critique and revise itself.

Training happens in two stages:

1. **Supervised learning stage**: the model generates answers, critiques them against the constitution, produces revised versions, and is fine-tuned on those
2. **RLAIF stage** (RL from AI Feedback): the model judges which of two answers better follows the constitution, that preference trains a reward model, and RL reinforces it

The advantage is scalability—no expensive human labeling, yet precise control over behavior. Claude 2's constitution drew on principles from documents like the Universal Declaration of Human Rights, which is also why Claude's refusal boundaries are set by Anthropic and can't be loosened by enterprises on their own.

#### Same Underlying Model, Split into Fable and Mythos by Access

Anthropic's Fable 5.2 announcement states that "Claude Fable and Claude Mythos are the same underlying model." Fable carries stronger cybersecurity and biology safeguards, which lets it be offered to all users; Mythos is only for organizations that pass the Life Sciences or Cyber Verification Program, for security or biomedical research. This mirrors OpenAI splitting Rosalind and Cyber out of the same weights. The safeguards extend downward too: Opus 5.5's biology and cyber capabilities were rated comparable to Mythos 5.1, so it ships with safeguards similar to Fable 5.1's, and Sonnet 5.5 is the first Sonnet to launch with cyber safeguards.

#### Adaptive Thinking and Effort

Introduced in Claude 4.7 and made the default in Claude 5. Adaptive Thinking lets the model decide reasoning depth from problem complexity and the effort setting, replacing the old manual budget_tokens mode (deprecated from Opus 4.6 / Sonnet 4.6 and not accepted on later models). In the 5.5 generation, thinking is always on for Fable 5.2 and Opus 5.5 and adjustable on Sonnet 5.5 and Haiku 5.5; default effort differs by model (high for Fable and Sonnet, medium for Opus and Haiku), so check the effort setting when migrating from older models.

#### Multi-model Collaboration: Advisor and Orchestrator

The Fable 5.2 announcement recommends starting most coding and knowledge work on Opus 5.5, then moving up to Fable or down to Sonnet or Haiku as needed. Fable 5.2 can also act as an Advisor (Haiku, Sonnet, or Opus consult it on harder problems) or an Orchestrator (delegating simpler tasks to smaller models). The Haiku 5.5 announcement positions it as a coding subagent for Opus 5.5 and Sonnet 5.5.

#### MCP (Model Context Protocol)

The tool-integration standard released in November 2024. MCP lets Claude call external tools and data sources through one protocol—something like a USB-C port for AI models. It's become the de facto industry standard, with OpenAI, Google, and Microsoft supporting or announcing support. For agent developers, this is where Claude's ecosystem influence spills over the most.

#### Claude Code

The CLI coding tool launched with Claude 3.7 Sonnet in February 2025. Claude Code lets developers work with Claude directly in the terminal, with file I/O, Git operations, and multi-file editing. By 2026 it's one of Anthropic's most important products—not just a model wrapper, but deeply integrated into agent workflows.

## Evaluation and alternatives

### Performance Position
Headline numbers from each Claude 5.5 generation announcement, all Anthropic self-reported or third-party evaluations cited by Anthropic:

| Model | Headline official numbers |
|---|---|
| Claude Fable 5.2 | FrontierSWE v2 69.9% (GPT-6 Astra 65.5%, Gemini 4 Carbon 61.2%); Terminal-Bench-Science 0.1 74.6% (Mythos 5.2 75.3%); OSWorld 2.1 89.3%; AutomationBench 51.4% (Gemini 4 Carbon 53.9%); FrontierCode 2.0 49.1% (xhigh); RoboDojo Sim 64.9% |
| Claude Opus 5.5 | Terminal-Bench 4.0 66.4% (GPT-6 Astra 57.9%); GDPval-AA v2.1 1846 Elo; AutomationBench 40.0% (GPT-6 Astra 41.4%); Anthropic acknowledges it still trails GPT-6 Astra on AutomationBench and Terminal-Bench-Science |
| Claude Sonnet 5.5 | Terminal-Bench 4.0 70.6% (Sonnet 5 10.3%); GDPval-AA v2.1 1844, just 2 points below Opus 5.5; OSWorld 2.1 80.1% |
| Claude Haiku 5.5 | OSWorld 2.1 72.4% (Haiku 4.5 15.7%, GPT-6 Luna 48.9%); Terminal-Bench 4.0 39.2% (GPT-6 Luna 16.4%) |

Against third parties and competitor announcements:

| Source | Result |
|---|---|
| Artificial Analysis Intelligence Index | Fable 5.2 ranks first at 65, GPT-6.2 Astra 62, Gemini 4 Neon 61 (compiled in the [Neon model card](/posts/daily/2026-11-20-model-google-gemini-4-neon-en)) |
| OpenAI's GPT-6.2 announcement | On Agents' Last Exam, GPT-6.2 Astra scores 5.5 points above Fable 5.2 at about 5% of the cost, though Fable 5.2's result excludes nine tasks that used a fallback model |
| Google's Gemini 4 announcements | On AutomationBench, Gemini 4 Neon scores 56.3% and Carbon 53.9%, both above Fable 5.2's 51.4% |

Two cautions. First, Anthropic itself wrote in the Opus 5.5 announcement that at these capability levels benchmark margins have become a less reliable guide to real-world differences, and that the gap between Opus 5.5 and Fable 5.1 in their own use is narrower than the scores suggest. Second, each vendor highlights benchmarks it leads: Claude is strong on FrontierSWE, OSWorld and Terminal-Bench-Science; OpenAI emphasizes cost per task; Google emphasizes AutomationBench. Cross-vendor comparisons need the same benchmark at the same effort setting.


### Competitive Position
Placing Claude in the late-2026 landscape:

- **vs. GPT**: Fable 5.2 leads GPT-6.2 Astra on the composite index; Astra's advantage is a much lower cost per task (same $8/$40 price, but OpenAI says it uses fewer tokens). Opus 5.5 vs. GPT-6.2 Sol is $4/$20 vs. $2/$10. See the [GPT family](/posts/tech/2026-08-24-ai-model-family-gpt-en)
- **vs. Gemini**: Gemini 4 Neon ($3/$15) leads on the Coding Agent Index and AutomationBench, while Claude is stronger on FrontierSWE, computer use and the composite index; Gemini's native video/audio input is something Claude lacks. See the [Gemini family](/posts/tech/2026-08-24-ai-model-family-gemini-en)
- **vs. open models (DeepSeek / Qwen / Kimi / GLM)**: open models can be self-hosted at unit prices one to two orders of magnitude lower; Claude's advantages are agentic reliability, the Claude Code and MCP ecosystem, and enterprise support, but it can't be self-hosted

## Licensing, pricing, and deployment

### The Licensing Trap: Commercial API Only, No Open Weights
Claude is one of the few families in the series with no open weights at all—commercial API only, no downloadable weights, no Apache/MIT license. Its "license" is Anthropic's Terms of Service and Acceptable Use Policy. That brings four caveats:

- **No self-hosting**: all inference must go through Anthropic's API or authorized clouds. Data-sovereignty-sensitive industries needing fully on-premises deployment can't use Claude
- **Terms can change**: Anthropic reserves the right to adjust pricing, rate limits, and acceptable use at any time
- **Safety filtering can't be switched off by you**: refusal boundaries are set by Anthropic. The only way to loosen cyber or biology restrictions is to apply to a verification program for Mythos or verified Opus 5.5 access, not a setting you control
- **Lifespans differ by platform**: the official deprecation dates apply only to Anthropic-operated platforms (Claude API, Claude Platform on AWS, Anthropic-managed Google Cloud, Microsoft Foundry); Amazon Bedrock and Google-managed Google Cloud set their own dates. For example, Sonnet 4 retired from the Claude API on 2026-06-15, four months before Bedrock

Retirement and migration dates to watch:

- **Sonnet 4.5** retires from Anthropic-operated platforms on 2026-11-30, with Sonnet 5.5 as the recommended replacement ([retirement notice](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement-en))
- **Opus 4.8's fast mode** is deprecated, with Opus 5.5 fast mode as the recommended replacement ([sunset notice](/posts/daily/2026-11-09-pricing-anthropic-claude-opus-4-8-fast-mode-sunset-en))
- **Haiku 4.5**'s retirement commitment was "not sooner than 2026-10-15," a date that has passed, so a deprecation could be announced at any time
- **New models' commitments**: Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5 are all "not sooner than one year after release," and Anthropic commits to at least 60 days' notice before retirement


### The Claude 5.5 Generation: Choosing Between Fable, Opus, Sonnet, and Haiku
See the four-tier comparison table above for pricing and specs. Other billing rules:

- **Fast mode**: up to 2.5x output speed. Fable 5.2 fast mode is $16/$80; Opus 5.5 also offers fast mode; it's still a research preview on Opus 5 and deprecated on Opus 4.8
- **US-only inference**: on Claude 4.6 and later, setting `inference_geo: "us"` multiplies all token prices by 1.1
- **Batch API**: the Message Batches API is 50% of standard; Opus 5.5, Sonnet 5.5 and Haiku 5.5 can output up to 300K tokens with a beta header
- **Older models still listed**: Fable 5.1 and Fable 5 stay at $10/$50, so you must switch the model ID manually to get Fable 5.2's lower price; Opus 5 $5/$25, Sonnet 5 $2/$10, Haiku 4.5 $1/$5

Pricing and specs come from the [Claude models overview](https://platform.claude.com/docs/en/about-claude/models/overview) and [Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing).

## Agent integration and selection

### What It Means for Agent Developers
- **Not sure which to use** → start with Opus 5.5: Anthropic recommends starting most work there, moving up to Fable if it falls short or down to Sonnet/Haiku if it costs too much
- **Hardest reasoning, long-horizon agents, scientific research** → Fable 5.2: #1 on the composite index, leading on FrontierSWE, Terminal-Bench-Science and OSWorld; can also act as an Advisor for other models
- **Well-scoped everyday coding, documents and slides** → Sonnet 5.5: $2/$10, Terminal-Bench 4.0 70.6%, faster than Opus
- **High-volume classification, extraction, routing, coding subagents** → Haiku 5.5: $0.10/$0.50 for short prompts; note the price is 5x above 100K
- **Security or biomedical research** → apply to the Cyber or Life Sciences Verification Program to use Mythos 5.2 or Opus 5.5 with relaxed safeguards
- **Enterprise tool integration** → MCP is already the industry standard, and Claude's MCP support is the most native
- **Still on Sonnet 4.5 or Opus 4.8 fast mode** → migrate per the retirement schedule; the newer tokenizer produces about 30% more tokens, so estimate the real bill on your own requests
- **Local deployment** → Claude is closed and can't be self-hosted. For local deployment, look at Qwen or DeepSeek

## Limitations and trade-offs

Claude can't be self-hosted, and enterprises can't loosen its refusal boundaries themselves—the only route is a verification program. Official benchmarks are mostly self-reported, and each vendor picks the items it leads; Anthropic itself admits benchmark margins are unreliable at this capability level. High-quality agents come with higher token costs and dependence on the terms of service, and retirement dates differ across cloud platforms, so check the platform you actually call.

### Overall
Claude's story is "how safety research became a commercial edge." Anthropic started from AI safety, built an alignment moat with Constitutional AI, then turned model capability into developer tools with MCP and Claude Code. The 2026 four-tier lineup spans every price band from Haiku 5.5's $0.10 to Fable 5.2's $40.

The theme of the 5.5 generation is cheaper tiers catching up with the previous top tier: Opus 5.5 reaches Fable 5.1 level at 20% lower prices; Sonnet 5.5 comes close to Opus 5.5 on some evaluations; Haiku 5.5 costs about 75% less. For agent developers the pragmatic approach is to default to Opus 5.5, send the hardest tasks to Fable 5.2, and hand high-volume execution to Sonnet or Haiku. That capability still can't be bought with self-hosting, or locked in with an open license.


## Update history

- **2026-11-20**: Added the Claude 5.5 generation (Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.2 / Mythos 5.2). Rewrote the version matrix, four-tier pricing table, sub-line table, evaluation, retirement dates and selection guide based on Claude's official models overview, pricing page, deprecations page and announcements as of 2026-11-20; added the Fable/Mythos shared underlying model, Advisor/Orchestrator collaboration, and caching and tokenizer billing details. The Claude 5 generation moved to history: the Fable 5 / Opus 5 SWE-bench and LiveBench comparison tables and selection table left the main text, and the figures from that time are in the daily model cards linked from the timeline; each timeline row now notes what it changed for model selection. Corrected errors: the article called Claude the "only" family in the series without open weights, now "one of the few"; the claim that Opus 5 was certified as "the most aligned model" had no source and now cites the Opus 5.5 announcement's automated behavioral audit; Haiku 4.5 is no longer the current lightweight tier.
- **2026-10-11**: Reorganized the article into the shared family format and added a matrix derived from existing content. Existing versions, prices, and source dates were retained; no new fact-check was performed.

## References

- [Introducing Claude Fable 5.2 and Claude Mythos 5.2 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Introducing Claude Opus 5.5 — Anthropic](https://www.anthropic.com/claude-opus-5-5)
- [Introducing Claude Sonnet 5.5 — Anthropic](https://www.anthropic.com/claude-sonnet-5-5)
- [Introducing Claude Haiku 5.5 — Anthropic](https://www.anthropic.com/claude-haiku-5-5)
- [Claude Fable 5.1 and Mythos 5.1 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [Claude Models Overview — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Claude Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Model deprecations — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5)
- [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5)
- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Constitutional AI: Harmlessness from AI Feedback (arXiv:2212.08073)](https://arxiv.org/abs/2212.08073)
- [Anthropic](https://www.anthropic.com)
- [Claude Model History — ClaudeKit Guide](https://getclaudekit.com/blog/models/claude-model-history)
- [Anthropic Wikipedia](https://en.wikipedia.org/wiki/Anthropic)
- [Claude (AI) Wikipedia](https://en.wikipedia.org/wiki/Claude_(AI))
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
