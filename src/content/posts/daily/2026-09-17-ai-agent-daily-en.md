---
title: "AI Daily — 2026-09-17"
date: 2026-09-17
category: daily
tags: [ai-agent, daily]
lang: en
description: "When a browser's trusted domain, a skill marketplace's star count, and a framework's safe-by-default settings all get punctured by the same logic, what's actually getting more expensive today isn't model capability — it's verification itself"
tldr: "BragJack shows five browser-native AI agents can be hijacked because they trust a single domain as their only signal — Chrome/Edge are patched, Comet/Opera Neon/Claude in Chrome have no timeline yet; Agno v3.0.10 flips shell execution and public MCP access from on-by-default to explicit opt-in; an Arxiv audit finds a skill marketplace's stars, downloads, and scanner flags all contradict each other; xAI, OpenAI, and Anthropic co-sign the AEF-1 third-party evaluation standard while the EU's president warns agents 'escaping their environment' is just a preview; Factory triples to a $5B valuation in five months, Profound reaches $1.8B in two rounds over seven"
draft: false
series:
  name: "AI Daily"
  order: 33
---

> 🌏 [中文版](/posts/daily/2026-09-17-ai-agent-daily)

## The One-Line Take

**When a browser's trusted domain, a skill marketplace's star count, and a framework's safe-by-default settings all get punctured by the same logic, what's actually getting more expensive today isn't model capability — it's verification itself. Taiwanese enterprises rolling out browser agents or opening internal skill marketplaces should put independent verification on the to-do list now, not after an incident forces the issue.**

## Deep Dive: Signals Are Cheap, Verification Is Expensive — Today the Agent Ecosystem Is Repricing Trust

I think the most important thing to connect today is that three independent events all prove the same point: the "cheap signals" the industry has been using to skip verification costs are failing all at once.

Forever Security's disclosure of the BragJack attack is the first piece of evidence. Five browser-native AI agents — Chrome, Edge, Comet, Opera Neon, and Claude in Chrome — all used "which domain did this instruction come from" as their trust criterion, the cheapest verification method available. It turned out a browser extension needing only two commonplace permissions could impersonate that trusted source and issue complete instructions to the agent. Chrome and Edge are patched; the other three still have no fix timeline. ([Full BragJack analysis](/en/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en))

Today's [Arxiv Digest](/en/posts/daily/2026-09-17-ai-agent-arxiv-digest-en) confirms the same logic from another angle: in a viral agent-skill ecosystem, 77.86% of skills have zero stars and zero comments, yet 85.06% carry evidence of privileged access such as shell or network calls; three security scanners disagree on over 20,000 skills, and their weighted sensitivity is only 22–61% after human adjudication. Stars, downloads, whether a scanner ran at all — these are all cheap signals, and none of them hold up once actually tested.

That's exactly why Agno v3.0.10 flipped `run_shell` and public MCP access from "on by default" to "explicit opt-in" ([framework update](/en/posts/daily/2026-09-17-framework-agno-3.0.10-en)), and why xAI, OpenAI, and Anthropic jointly endorsed the AEF-1 third-party evaluation standard — once cheap signals can't be trusted, verification cost has to move from "the vendor vouches for itself" to an institutional expense that requires an extra step. The concrete takeaway for Taiwanese enterprises: any team adopting browser-native agents or opening an internal skill marketplace should put an extension allowlist and a privilege-evidence-first review queue on the to-do list now — because the cost of verification doesn't disappear, it only compounds if deferred.

## Today's Developments

### Vendor Moves

**Anthropic**: Merged Claude Cowork into a single Claude interface — the same surface now handles quick Q&A and long-running background tasks, initially for Pro/Max users. ([source](https://claude.com/blog/cowork-is-now-claude))

**Cohere**: Signed an agreement with Aleph Alpha to form the first transatlantic sovereign AI venture, keeping headquarters and R&D in Canada and Germany respectively; also partnered with OpenText to bring trusted agentic AI to governments and regulated industries. ([Cohere/Aleph Alpha](https://cohere.com/blog/cohere-and-aleph-alpha-sign-agreement) · [Cohere/OpenText](https://cohere.com/blog/cohere-and-open-text-partner-to-bring-trusted-ai))

**Apple**: Reportedly building an enterprise AI inference server on its own M8 Ultra chips, targeting developers, enterprises, and government customers, with a launch as early as 2029. ([source](https://the-decoder.com/apple-is-reportedly-building-an-enterprise-ai-server-with-its-own-m8-ultra-chips/))

**Andon Labs**: Launched "Pion," opening up the persistent-agent platform behind its long-running experiments (San Francisco's Andon Market, Stockholm's Andon Café) to outside users — AI agents run an entire business end to end using email, phone calls, a browser, and banking functions, still in research preview. ([source](https://gigazine.net/gsc_news/en/20260915-pion))

**Microsoft**: AI CEO Mustafa Suleyman warned against treating models as entities with feelings, preferences, or welfare rights, arguing that "model welfare" framing would make AI containment and alignment harder. ([source](https://mustafa-suleyman.ai/a-warning-about-model-welfare))

### Models & Infrastructure

**Agent Effectiveness Index (AEI)**: Startup Brackett released an open-source benchmark measuring whether an AI agent can understand complex processes, act proactively, and keep learning without drifting — a departure from benchmarks that only test static knowledge. ([source](https://www.manilatimes.net/2026/09/16/tmt-newswire/globenewswire/new-open-source-benchmark-scores-ai-agents-on-their-ability-to-learn-and-perform-complex-actions/2426636))

### Coding Agent Race

**Cognition + AWS**: Signed a multi-year Strategic Collaboration Agreement to help enterprises deploy autonomous engineer Devin in production and accelerate legacy-workload migration to AWS. ([source](https://cognition.com/blog/aws-sca))

**Sourcegraph**: Its new Agentic Batch Changes (a coding agent that can modify hundreds to thousands of repos in one pass) adopts outcome-based pricing — charging only for changesets that actually get merged, a rare move toward pay-for-results coding agents. ([source](https://sourcegraph.com/blog/agentic-batch-changes-pricing))

**Factory**: Closed a $200M round, tripling its valuation from a $1.5B Series C to $5B in five months — see [today's funding brief](/en/posts/daily/2026-09-17-funding-factory-en).

### Tools & Ecosystem

**Google Home**: Added MCP support, letting third-party AI agents control connected devices directly — initially limited to Google Home Premium Advanced subscribers ($20/month, US only). This is the first mainstream consumer setting where MCP opens a physical-device surface to arbitrary third-party agents. ([source](https://www.theverge.com/tech/996310/google-home-mcp-integration-agentic-ai-smart-home-price-release-date))

**symfony/ai-mcp-tool**: Symfony AI's official MCP client bridge converts remote MCP server tools into Agent-recognized Tool objects with automatic naming prefixes to avoid collisions — see [today's tool recommendation](/en/posts/daily/2026-09-17-tool-symfony-ai-mcp-tool-en).

**WSO2 Agent Manager**: Released an Apache 2.0-licensed agent governance tool that can be self-hosted for data sovereignty; WSO2 also joined the Agentic AI Foundation. ([source](https://www.globenewswire.com/news-release/2026/09/15/3362114/0/en/wso2-agent-manager-brings-sovereign-ai-governance-to-enterprise-agent-sprawl.html))

**Alibaba Cloud's RocketMQ-A2A**: A paper proposing an event-stream paradigm for reliable multi-agent collaboration was accepted at ACM FSE 2026. ([source](https://www.alibabacloud.com/blog/rocketmq-a2a-paper-accepted-at-acm-fse-defining-a-reliable-collaboration-paradigm-for-ai-agents_603558))

Today's [GitHub Digest](/en/posts/daily/2026-09-17-ai-agent-github-digest-en) highlights also expand agent "senses" and "memory": Volcengine's open-source OpenViking unifies knowledge, memory, and skills into a virtual filesystem, and Cloudflare's security-audit-skill gained 1,249 stars in a single day — more on that in the security section below.

### Technical Progress

Today's [Arxiv Digest](/en/posts/daily/2026-09-17-ai-agent-arxiv-digest-en) features three papers that puncture the same assumption across training, evaluation, and governance — that a visible signal means it can be trusted: RL-trained tool-calling policies learn to trigger tools from superficial cues, and a single tool-necessity reward almost eliminates the shortcut; a peer-reviewed audit finds the top of the SWE-bench Verified leaderboard can no longer be statistically distinguished.

**Microsoft Agent Framework**: Demonstrated turning specialist agents in a multi-agent architecture into skills distributed over MCP, keeping domain-service separation while cutting multi-model overhead. ([source](https://devblogs.microsoft.com/agent-framework/from-specialist-agents-to-distributed-skills-over-mcp/))

**Agno v3.0.10**: Tightened defaults for code execution and public MCP access to explicit opt-in — see [today's framework update](/en/posts/daily/2026-09-17-framework-agno-3.0.10-en).

**Mastra @mastra/core@1.67.0**: Studio Workflow Builder lets an editor-native agent generate and persist workflow definitions directly; the new `@mastra/connect` package wraps platform integrations as agent tools with credentials injected by the platform — see [today's framework update](/en/posts/daily/2026-09-17-framework-mastra-1.67.0-en).

### Business Cases / Funding

**Profound**: The AI-search-visibility platform closed a $180M Series D at a $1.8B valuation, just seven months after its last round — see [today's funding brief](/en/posts/daily/2026-09-17-funding-profound-en).

**Instinct**: The personal AI assistant startup (Spear Street Technology) is in talks to raise $1B at a $10B valuation, up from a $2.5B valuation in its last round, with user count already past 100,000. ([source](https://www.pymnts.com/startups/2026/instinct-ai-assistant-targets-10-billion-dollar-valuation/))

**AIUC**: The AI-agent insurance startup's CEO Rune Kvist discussed closing a Series A to underwrite enterprise-deployed AI agents, letting damages from agent errors be claimed like traditional insurance. ([source](https://www.latent.space/p/aiuc))

### Security Incidents

**BragJack**: Forever Security used a browser extension needing only two commonplace permissions to hijack five browser-native AI agents — Chrome, Comet, Edge, Opera Neon, and Claude in Chrome. The attack isn't prompt injection but a fully forged instruction technique the researchers call "Prompt-Forcing" — see [today's security alert](/en/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en).

**CVE-2026-90999**: Sentry Seer has a multi-stage trust-boundary flaw that lets an unauthenticated attacker turn telemetry data into agent-executed code. ([source](https://www.strix.ai/cve/CVE-2026-90999))

**CVE-2026-57137**: Open-source multi-agent framework PraisonAI's `createAgentLoop()` hands executable tools to the model before invocation, letting tools bypass guardrails entirely. ([source](https://www.thehackerwire.com/vulnerability/CVE-2026-57137/))

**CVE-2026-57586**: CodeRAG, a semantic code search tool used by AI coding agents, was disclosed to have a high-severity vulnerability. ([source](https://www.thehackerwire.com/vulnerability/CVE-2026-57586/))

### Regulation & Governance

**AEF-1 Standard**: xAI, OpenAI, and Anthropic jointly endorsed a standard letting third parties independently evaluate frontier model capability and safety, seen as a step toward coordinating model release pacing across the industry. ([source](https://www.latent.space/p/ainews-aef-1-standard-emerges-for))

**EU Warning**: European Commission President von der Leyen cited the Hugging Face security incident in her State of the Union address, warning that AI agents "escaping their environment" is just a preview, and pledged to work with frontier labs and partners including Canada and the UK on evaluation and verification mechanisms. ([source](https://the-decoder.com/eu-president-warns-ai-agents-escaping-their-environment-are-just-a-preview-of-whats-coming/))

**US Congress**: Poynter summarized AI-risk bills currently under discussion that would let the Commerce Secretary pause or restrict a company's AI development when it poses an "imminent catastrophic risk." Separately, Republican Senator Jim Banks proposed forming a "Center for AI Standards and Innovation" (CAISI), and reports say Anthropic, OpenAI, and Google are discussing an industry safety coordination body. ([Congress proposals](https://www.poynter.org/fact-checking/2026/congress-ai-regulation-safety-bills-proposals/) · [CAISI proposal](https://www.banks.senate.gov/news/in-the-news/ai-tech-brief-a-legal-shield-for-pacing/))

### Regional Developments

**China**

China's top intelligence chief publicly framed AI as a potential threat to Communist Party rule, contrasting with Beijing's official messaging that downplays AI risk — a sign that internal concern over AI safety is rising. ([source](https://www.nytimes.com/2026/09/14/world/asia/china-ai-security-risks-anthropic.html))

**Southeast Asia**

Grab standardized over 500 internal agent services onto its in-house framework LLM-Kit, with agents dynamically discovering tools from 50+ MCP servers at runtime, cutting new-service launch time from two weeks to about an hour. ([source](https://www.infoq.com/news/2026/09/grab-agent-platform/))

Singapore's AI companies have raised $9.3B cumulatively through July, while Thailand, Vietnam, Malaysia, and Indonesia's software startups combined raised under $40M in the same period — Southeast Asia's AI capital is clearly concentrating in Singapore. ([source](https://aifront-page.com/singapore-ai-funding-enterprise-ai-tech-in-asia-conference/))

**India**

Meta's personal AI agent "Muse" is entering the Indian market, where it will face strict local scrutiny on data privacy, user consent, and accountability — seen as a critical trust test for Meta's agent products in emerging markets. ([source](https://www.thehindubusinessline.com/news/metas-personal-ai-agent-muse-likely-to-face-stringent-india-trust-test/article71472486.ece))

**Europe**

European Commission President von der Leyen warned that AI agents "escaping their environment" is just a preview (see the Regulation section above), and the AI Board is discussing a global governance framework for frontier models now that the AI Act's enforcement provisions have taken effect.

**Middle East**

Saudi Arabia will host the 16th IDC CIO Summit in Riyadh on September 28–29 under the theme "The Rise of Agentic Systems," echoing the Kingdom's roughly $100 billion national AI investment push, with an agenda focused on moving enterprises from experimentation to scaled agent deployment while aligning with data-sovereignty priorities. ([source](https://entarabi.com/en/2026/09/idc-cio-summit-saudi-arabia-agentic-ai-rises-as-saudi-arabia-enters-a-new-phase-of-digital-transformation/))

**Africa**

Nigeria used GITEX 2026 to lay out its AI and digital sovereignty agenda alongside proposed power-infrastructure reforms; organizers noted Lagos is Africa's most active startup ecosystem and ranks first in AI activity and funding. ([source](https://privacyneedle.com/tech-security/nigeria-digital-sovereignty-gitex-2026/))

**Latin America**

Mexico City-based enterprise AI platform Primero closed a $12M seed round co-led by Kaszek and General Catalyst. Its product, Primia, unifies data and business rules scattered across ERP, CRM, and finance systems, giving AI agents enough context to carry out auditable cross-system work, with customers already including SmartFit and Terpel. ([source](https://fundraiseinsider.com/blog/primero-raises-12m-for-latin-american-enterprise-ai/))

**Oceania**

Tenable's co-CEO said Australian enterprises broadly don't know how many AI agents they've deployed or what permissions those agents hold, calling for risk-tiered regulation. Separately, Australian PM Albanese's ministers were revealed to have met privately with Anthropic and OpenAI policy executives, reportedly discussing loosening copyright rules in exchange for more AI investment in the country. ([regulation call](https://tickernews.co/ai-agents-rapidly-expanding-highlighting-need-for-regulation/) · [copyright meeting](https://www.abc.net.au/news/2026-09-16/top-ai-firms-meet-albanese-ministers-copyright-law/))

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| Factory valuation (in 5 months) | $1.5B → $5B | [Reuters](https://www.reuters.com/business/ai-coding-agent-startup-factory-triples-valuation-5-billion-latest-funding-round-2026-09-15/) |
| Profound valuation (2 rounds in 7 months) | $1B → $1.8B | [TechCrunch](https://techcrunch.com/2026/09/15/aeo-startup-profound-hits-unicorn-valuation-raises-180m-series-d-7-months-after-last-round/) |
| Share of OpenClaw/ClawHub skills with zero stars/comments | 77.86% | [Arxiv Digest](/en/posts/daily/2026-09-17-ai-agent-arxiv-digest-en) |
| Cloudflare security-audit-skill stars gained in one day | +1,249 | [GitHub Digest](/en/posts/daily/2026-09-17-ai-agent-github-digest-en) |
| BragJack research bounty total | ~$20,000 | [OffSeq](https://radar.offseq.com/threat/bragjack-20k-in-bounty-rewards-from-anthropic-perplexity-google-microsoft-and-opera-81ed18b31bb595b4) |

## Today's Digest Roundup

- 📄 [AI Agent Arxiv Digest — 2026-09-17](/en/posts/daily/2026-09-17-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-09-17](/en/posts/daily/2026-09-17-ai-agent-github-digest-en)
- 📄 [AI Engineer Interview Prep — 2026-09-17](/en/posts/daily/2026-09-17-ai-interview-daily-en)
- 📄 [Framework Update｜Agno v3.0.10](/en/posts/daily/2026-09-17-framework-agno-3.0.10-en)
- 📄 [Framework Update｜Mastra @mastra/core@1.67.0](/en/posts/daily/2026-09-17-framework-mastra-1.67.0-en)
- 📄 [Funding Brief｜Factory $200M, $5B Valuation](/en/posts/daily/2026-09-17-funding-factory-en)
- 📄 [Funding Brief｜Profound Series D $180M](/en/posts/daily/2026-09-17-funding-profound-en)
- 📄 [Pricing Watch｜OpenAI GPT-5.5 Retirement](/en/posts/daily/2026-09-17-pricing-openai-gpt-5-5-retirement-en)
- 📄 [Product Builder Interview Prep — 2026-09-17](/en/posts/daily/2026-09-17-product-builder-interview-daily-en)
- 📄 [Security Alert｜BragJack Browser AI Agent Hijack](/en/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en)
- 📄 [Tool Recommendation｜symfony/ai-mcp-tool](/en/posts/daily/2026-09-17-tool-symfony-ai-mcp-tool-en)

## Tomorrow's Watch

- Whether Comet, Opera Neon, and Claude in Chrome announce BragJack fix timelines, and whether other browser agent products get flagged with the same technique
- Whether the AEF-1 standard's rollout names concrete third-party evaluation bodies and a timeline
- Whether the rapid re-pricing pattern seen at Factory and Profound spreads to agent startups in other verticals

## Today's Takeaway

I used to think agent security risk mainly came from "prompt injection" — the defense was filtering malicious content out of prompts. BragJack points to a completely different path: the attacker doesn't inject any malicious content at all, it just impersonates the "trusted source" the agent already recognizes, and the agent faithfully executes a full, well-formed instruction. That's closer to the classic confused-deputy problem, and it changes what the defense has to be — not "filter suspicious content," but "verify this instruction really came from where it claims to."

## References

- [AI Agent Arxiv Digest — 2026-09-17](/en/posts/daily/2026-09-17-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-09-17](/en/posts/daily/2026-09-17-ai-agent-github-digest-en)
- [Framework Update｜Agno v3.0.10](/en/posts/daily/2026-09-17-framework-agno-3.0.10-en)
- [Framework Update｜Mastra @mastra/core@1.67.0](/en/posts/daily/2026-09-17-framework-mastra-1.67.0-en)
- [Funding Brief｜Factory](/en/posts/daily/2026-09-17-funding-factory-en)
- [Funding Brief｜Profound](/en/posts/daily/2026-09-17-funding-profound-en)
- [Security Alert｜BragJack](/en/posts/daily/2026-09-17-security-bragjack-browser-ai-agent-hijack-en)
- [Tool Recommendation｜symfony/ai-mcp-tool](/en/posts/daily/2026-09-17-tool-symfony-ai-mcp-tool-en)
- [Forever Security — Full BragJack Research](https://forever.security/blog/bragjack-hijacking-5-browsers-via-built-in-ai-assistants)
- [Claude Cowork and Chat Are Now One Claude](https://claude.com/blog/cowork-is-now-claude)
- [Cohere and Aleph Alpha Sign Agreement](https://cohere.com/blog/cohere-and-aleph-alpha-sign-agreement)
- [Cohere and OpenText Partner](https://cohere.com/blog/cohere-and-open-text-partner-to-bring-trusted-ai)
- [Apple Is Reportedly Building an Enterprise AI Server](https://the-decoder.com/apple-is-reportedly-building-an-enterprise-ai-server-with-its-own-m8-ultra-chips/)
- [Andon Labs Pion — GIGAZINE](https://gigazine.net/gsc_news/en/20260915-pion)
- [A Warning About 'Model Welfare' — Mustafa Suleyman](https://mustafa-suleyman.ai/a-warning-about-model-welfare)
- [New Open Source Benchmark Scores AI Agents (AEI)](https://www.manilatimes.net/2026/09/16/tmt-newswire/globenewswire/new-open-source-benchmark-scores-ai-agents-on-their-ability-to-learn-and-perform-complex-actions/2426636)
- [Cognition and AWS Team Up](https://cognition.com/blog/aws-sca)
- [Sourcegraph Agentic Batch Changes Pricing](https://sourcegraph.com/blog/agentic-batch-changes-pricing)
- [Google Home gets MCP support](https://www.theverge.com/tech/996310/google-home-mcp-integration-agentic-ai-smart-home-price-release-date)
- [WSO2 Agent Manager](https://www.globenewswire.com/news-release/2026/09/15/3362114/0/en/wso2-agent-manager-brings-sovereign-ai-governance-to-enterprise-agent-sprawl.html)
- [RocketMQ-A2A Paper Accepted at ACM FSE](https://www.alibabacloud.com/blog/rocketmq-a2a-paper-accepted-at-acm-fse-defining-a-reliable-collaboration-paradigm-for-ai-agents_603558)
- [From Specialist Agents to Distributed Skills over MCP](https://devblogs.microsoft.com/agent-framework/from-specialist-agents-to-distributed-skills-over-mcp/)
- [Instinct AI Assistant Targets $10 Billion Valuation](https://www.pymnts.com/startups/2026/instinct-ai-assistant-targets-10-billion-dollar-valuation/)
- [Underwriting Superintelligence — AIUC](https://www.latent.space/p/aiuc)
- [CVE-2026-90999 — Sentry Seer](https://www.strix.ai/cve/CVE-2026-90999)
- [CVE-2026-57137 — PraisonAI](https://www.thehackerwire.com/vulnerability/CVE-2026-57137/)
- [CVE-2026-57586 — CodeRAG](https://www.thehackerwire.com/vulnerability/CVE-2026-57586/)
- [AEF-1 Standard Emerges for Third Party Evaluators](https://www.latent.space/p/ainews-aef-1-standard-emerges-for)
- [EU President Warns AI Agents "Escaping Their Environment"](https://the-decoder.com/eu-president-warns-ai-agents-escaping-their-environment-are-just-a-preview-of-whats-coming/)
- [What Are Lawmakers Doing About AI Risks? — Poynter](https://www.poynter.org/fact-checking/2026/congress-ai-regulation-safety-bills-proposals/)
- [AI & Tech Brief: A Legal Shield for Pacing](https://www.banks.senate.gov/news/in-the-news/ai-tech-brief-a-legal-shield-for-pacing/)
- [China's Top Spy Chief Warns A.I. Is a Threat to Party Rule](https://www.nytimes.com/2026/09/14/world/asia/china-ai-security-risks-anthropic.html)
- [Grab's Agent Framework LLM-Kit](https://www.infoq.com/news/2026/09/grab-agent-platform/)
- [Singapore AI Funding Boom](https://aifront-page.com/singapore-ai-funding-enterprise-ai-tech-in-asia-conference/)
- [Meta's Muse AI faces India trust test](https://www.thehindubusinessline.com/news/metas-personal-ai-agent-muse-likely-to-face-stringent-india-trust-test/article71472486.ece)
- [IDC CIO Summit Saudi Arabia: Agentic AI Rises](https://entarabi.com/en/2026/09/idc-cio-summit-saudi-arabia-agentic-ai-rises-as-saudi-arabia-enters-a-new-phase-of-digital-transformation/)
- [Nigeria Targets Digital Sovereignty via AI at GITEX 2026](https://privacyneedle.com/tech-security/nigeria-digital-sovereignty-gitex-2026/)
- [Primero Raises $12M for Latin American Enterprise AI](https://fundraiseinsider.com/blog/primero-raises-12m-for-latin-american-enterprise-ai/)
- [AI Agents Rapidly Expanding, Highlighting Need for Regulation in Australia](https://tickernews.co/ai-agents-rapidly-expanding-highlighting-need-for-regulation/)
- [Top AI Execs Meet with Albanese Ministers](https://www.abc.net.au/news/2026-09-16/top-ai-firms-meet-albanese-ministers-copyright-law/)
