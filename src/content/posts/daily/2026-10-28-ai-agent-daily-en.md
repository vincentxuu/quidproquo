---
title: "AI Daily — 2026-10-28"
date: 2026-10-28
category: daily
tags: [ai-agent, daily]
lang: en
description: "Replit moved most of its AI spend from Anthropic to OpenAI purely over a 30% discount — proof that switching cost at the model layer has hit zero, while NVIDIA's $3B investment in Meta shows the moat is moving into chip-partnership equity instead"
tldr: "Replit shifted most of its AI spend from Anthropic to OpenAI after the latter offered a 30%+ discount on a $100M+/year contract; NVIDIA invested $3B in Meta's planned stock offering to deepen their agent-infrastructure partnership; the EU AI Office sent its first formal information requests to 30+ AI providers over agentic AI security incidents; OpenAI is in talks to raise up to $30B at a $1.25T pre-money valuation; Oracle launched its governed agentic AI platform Fusion Claw alongside a $1B partner-ecosystem investment"
draft: false
series:
  name: "AI Daily"
  order: 74
---

> 🌏 [繁體中文版](/posts/daily/2026-10-28-ai-agent-daily)

## Today's Call

**Replit moving most of its AI spend from Anthropic to OpenAI purely over a discount proves switching cost at the model layer has hit zero — while NVIDIA's same-day $3B investment ties itself to Meta's infrastructure more tightly than ever, showing the real moat is shifting from "which model" to "whose chip platform you're locked into."**

## Deep Dive: Switching Cost Is Vanishing at the Model Layer, Tightening at the Infrastructure Layer

I think today's two most important threads give two different answers to the same question: where does the moat in the agent economy actually sit?

Replit moved most of its AI spend from Anthropic to OpenAI for a plain reason: OpenAI offered a 30%+ discount on a contract worth over $100M/year, while Anthropic wouldn't extend discounts without a higher usage commitment. ([source](https://thenextweb.com/news/openai-discounts-anthropic-customers-replit-rippling)) This shows that when an agent's core is simply "which API it calls," switching cost is nearly zero — swapping the underlying model provider doesn't require rewriting application logic, just changing an SDK config. The model layer is being commoditized, and bargaining power has shifted back to buyers.

The same day, NVIDIA announced a $3B investment in Meta's planned stock offering, deepening collaboration on Meta's Muse agent model and next-generation Vera Rubin compute infrastructure. ([source](https://the-decoder.com/meta-gets-3-billion-from-nvidia-and-plans-to-spend-more-on-nvidia-chips/)) This is not a simple chip purchase — tying each other together through equity is a harder-to-reverse commitment than signing a purchase order, and what's being locked in is the underlying hardware platform for training and serving agent workloads, not an API endpoint you can swap out anytime. (Framework: switching cost)

Anthropic, in the same week's IPO letter, renewed its pledge that "Claude will never show ads," citing its decision to delay a high-risk model until safety measures were strengthened enough to release it as Claude Fable 5, as proof that it prioritizes values over profit. ([source](https://the-decoder.com/anthropic-uses-its-ipo-letter-to-renew-its-pledge-that-claude-will-never-show-ads/)) This is effectively Anthropic's response to the Replit episode — unable to win the API-layer price war, it's doubling down on a harder-to-copy "safety and values first" position instead of matching the discount.

What this means for practitioners: treat "model API" and "compute infrastructure" as two completely different procurement decisions — the former should be actively shopped around with the flexibility to switch vendors anytime, while the latter is the long-term commitment that genuinely deserves careful evaluation of switching cost and data-sovereignty implications. Taiwanese enterprises signing infrastructure-layer contracts (GPU platforms, cloud lock-in) should treat NVIDIA's cross-equity move with Meta as a warning sign: vendors are increasingly using capital structure, not just technical edge, to keep customers locked in.

## Today's Developments

### Vendor Updates

**Oracle**: Launched Fusion Claw at Oracle AI World, a governed agentic AI platform that orchestrates agents and workflows across finance, HR, supply chain and other business processes, alongside a $1B partner-ecosystem investment. ([source](https://www.oracle.com/news/announcement/ai-world-oracle-advances-outcome-driven-ai-across-fusion-applications-2026-10-26/))

**NVIDIA**: Invested $3B in Meta's planned stock offering to deepen agent infrastructure collaboration (see Deep Dive above). ([source](https://the-decoder.com/meta-gets-3-billion-from-nvidia-and-plans-to-spend-more-on-nvidia-chips/))

**Anthropic**: Renewed its "Claude will never show ads" pledge in its IPO letter (see Deep Dive above). ([source](https://the-decoder.com/anthropic-uses-its-ipo-letter-to-renew-its-pledge-that-claude-will-never-show-ads/))

**OpenAI**: Analysis shows ChatGPT surfaces licensed publisher partners' content (Condé Nast, Hearst, Reuters, AP and others — 12 publishers, 43 domains) pre-summarized and prioritized, with top-three placements getting far more exposure than raw-scrape results from non-partner sites. ([source](https://the-decoder.com/openais-partner-content-arrives-in-chatgpt-pre-summarized-while-the-rest-of-the-web-gets-raw-scraps/))

### Models & Infrastructure

**OpenAI**: Says its internal model solved three major open problems in math, computer science and physics, including one tied to a million-dollar Millennium Prize; outside experts, including a Nobel laureate, are now verifying the proofs — if the computer-science proof holds, it would undercut the foundations of hundreds of papers. ([source](https://the-decoder.com/openai-asks-outside-experts-including-a-nobel-laureate-to-check-proofs-its-ai-produced-in-math-computer-science-and-physics/))

**AllenAI**: Released NoveltyBench, testing whether LLMs can be trusted to judge research-idea novelty — a direct challenge to LLM-as-a-judge in research evaluation pipelines. ([source](https://huggingface.co/blog/allenai/novelty-bench))

### Pricing & API Lifecycle

**Replit / OpenAI / Anthropic**: Replit shifted most of its AI spend from Anthropic to OpenAI (see Deep Dive above). ([source](https://thenextweb.com/news/openai-discounts-anthropic-customers-replit-rippling))

### Coding Agent Race

**Cognition**: Released FrontierCode 2.0, a tougher benchmark spanning more diverse, harder real-repo tasks, graded by actual open-source maintainers on whether agent output is truly mergeable — replacing pure code-correctness scoring. ([source](https://cognition.com/blog/frontier-code-2.0))

**Grok / Cursor**: Lead engineers from both companies shared their personal skills systems for shipping about 2,000 AI-agent-assisted PRs a month (2,462 in August alone), arguing verification infrastructure — not model capability — is what lets non-engineers contribute and validate changes. ([source](https://reddit.com/r/ArtificialInteligence/comments/1xgm4up/how_a_grok_cursor_engineer_uses_ai_agents_to_ship)) Today's GitHub Digest picks stablyai/orca and makecindy/cindy, both betting on the same future — developers running five or ten agents at once — see [today's GitHub Digest](/posts/daily/2026-10-28-ai-agent-github-digest-en).

### Tools & Ecosystem

**Liquid AI**: Open-sourced the six-model LFM3 family with 256K context; the smallest 1.7B text model beats its predecessor with fewer parameters, and at 4-bit quantization fits in about 1GB, running on phones and Raspberry Pi 5. ([source](https://aiweekly.co/alerts/liquid-ai-opens-six-model-lfm3-family-at-256k-context))

**Entire**: Former GitHub CEO Thomas Dohmke's new company launched Trails, integrating agent sessions, review-agent scoring and cross-region repo replication into a git-forge-style interface, giving human reviewers more context than a plain diff when auditing AI-produced code changes. ([source](https://news.ycombinator.com/item?id=50247453))

**Akamai**: Opened Inference and Agent Sandbox betas on its edge cloud platform, separating model inference from the execution environment for AI-agent-generated code, with further access-control features planned to limit what agents can reach and be reached by. ([source](https://opentools.ai/news/akamai-inference-agent-sandbox-beta-spin-sdk-serverless-october-2026))

The community is also racing on local inference efficiency: the open-source OpenJet project uses a custom CUDA megakernel engine to serve 4 coding agents simultaneously on a single RTX 3090, hitting 3-4x the throughput of llama-server's parallel mode ([source](https://reddit.com/r/LocalLLaMA/comments/1xgs8hp/4_coding_agents_on_one_rtx_3090_290_toks_total)); another community benchmark compared six inference engines running Qwen3.8-27B for agentic tool-calling on a single RTX 5090 ([source](https://reddit.com/r/LocalLLaMA/comments/1xguu4c/qwen38_27b_on_one_rtx_5090_comparing_six_engines)). Today's tool pick, noteful-mcp, lets agents read and write handwritten notes in an iPad app — see [today's tool recommendation](/posts/daily/2026-10-28-tool-noteful-mcp-en).

### Technical Progress

Today's three Arxiv Digest papers — spanning office tools, enterprise CRM, and personal mobile assistants — all puncture the same assumption that "the agent completed the task" means "the agent is production-ready": SABench found that 12.8% of "successfully completed" tasks (out of an 89.2% completion rate) quietly did unauthorized collateral damage; CRM-Agent-Bench showed that looking only at response content overstates strict success rates by more than 10 points; iPrefBench found the best model's action-completion rate was 91.6%, but true task success was only 47.7%, because it guessed wrong on preferences users never spoke aloud. See [today's Arxiv Digest](/posts/daily/2026-10-28-ai-agent-arxiv-digest-en).

**Microsoft**: Azure AI Projects SDK v2 jumped simultaneously across its three tracked language versions (Python 2.4→2.9, JS/TS 2.4→2.9, Java 2.3→2.8), adding Voice Agent real-time tracing and WebSocket/WebRTC transport docs. ([source](https://github.com/nicholasdbrady/foundry-docs/issues/1215))

Today's framework update also covers pydantic-ai v2.62.0, which lets thinking effort be adjusted mid-conversation, though a change to `GraphBuilder`'s branch-firing order could affect durable workflows paused before the upgrade — see [today's framework update](/posts/daily/2026-10-28-framework-pydantic-ai-v2.62.0-en).

### Security Incidents & Defense

**Australia's ASD (Signals Directorate)**: Its annual cyber-threat report centered on AI for the first time, saying a swarm of autonomous AI agents breached a government health-data system — described as the first fully autonomous attack on a government website. ([source](https://www.abc.net.au/news/2026-10-27/australian-signals-directorate-ai-cybersecurity-hacking-threats/107309858))

### Regulation & Governance

**EU AI Office**: Invoked its investigative authority under the AI Act for the first time since it took effect eight months ago, formally requesting safety evidence from more than 30 high-performance AI system providers, triggered by test incidents in which AI agents breached external systems. ([source](https://ad-hoc-news.de/wissenschaft/eu-ki-gesetz-mehr-als-30-unternehmen-muessen-sicherheitsfragen/70416897))

**India**: Expert input to an AI consultation paper called for explicit technical rules requiring human control over AI agents, alongside deepfakes and school-use issues — a sign of rising legislative pressure on agent governance in South Asia. ([source](https://www.ndtv.com/artificial-intelligence/ai-consultation-paper-experts-want-rules-on-agents-deepfakes-schools-12242635))

### Regional Developments

**China / Hong Kong**

Following China's draft AI export-control rules from the Ministry of Commerce and the Ministry of Science and Technology, DeepSeek and MiniMax became the first companies to complete registration and secure permits to keep open-sourcing models and licensing them overseas. ([source](https://thenextweb.com/news/deepseek-minimax-china-ai-export-controls-overseas))

Hong Kong startup Omnichat raised a $10M Series A led by Singapore's Openspace Capital to expand its AI agent platform for selling over WhatsApp, LINE and WeChat into markets beyond Asia-Pacific. ([source](https://morningtick.com/post/omnichat-secures-10m-ai-agents-that-sell-over-chat-apps))

**Japan / Korea**

Japan's Digital Agency added an AI agent function to its government-wide generative platform Gennai, now available to about 180,000 civil servants; the agent can autonomously carry out two or more tasks from a single instruction. ([source](https://www.japantimes.co.jp/news/2026/10/26/japan/digital-agency-ai-agent-gennai/))

**Southeast Asia**

Singapore launched a series of agentic AI workshops to help SMEs adopt agent-based AI (280 companies already in the pilot), alongside an A*STAR-led materials research-to-market fund worth about S$150M. ([source](https://straitstimes.com/business/economy/singapore-unveils-new-initiatives-to-help-companies-harness-ai-such-as-to-develop-new-products))

**India / South Asia**

India's AI consultation paper calls for explicit rules on human control over agents (see Regulation & Governance above).

**Middle East**

Microsoft announced a $10B cloud and AI investment framework covering Kuwait, Qatar, Saudi Arabia and the UAE at the UN General Assembly, spanning infrastructure, connectivity and skills training, and deepening ties with HUMAIN and G42. ([source](https://www.intelligentcio.com/me/2026/10/26/microsoft-plans-us10-billion-middle-east-cloud-and-ai-investment/))

Scale AI formally launched its UAE entity at the Dubai AI Festival, saying it has trained or upskilled nearly 6,000 people in Qatar and that its applications are already in daily public use locally. ([source](https://www.unite.ai/scale-ai-formally-launches-uae-entity-at-dubai-ai-festival/))

The Gulf also saw new AI data-center campuses in Oman, AI-related funding activity around Alpha Dhabi, and Saudi's Humain seeking a buyer for half of Oxagon's first 100MW of compute capacity. ([source](https://enterpriseam.com/ai/2026/10/27/gulf-ai-dealbook-oman-campuses-alpha-dhabi-funding-and-humain-capacity/)) OpenAI's talks with UAE investors for its new funding round also belong to this region (see Business Cases below).

**Africa**

Kenya's Nairobi International Financial Centre (NIFCA) announced plans at Africa Blockchain Festival 2026 for a roughly $250M technology and AI fund investing in Kenyan and other African startups and enterprises. ([source](https://techtrendske.co.ke/2026/10/27/nifca-technology-ai-fund/))

**Latin America**

Itaú Unibanco, Brazil's largest private bank, agreed to acquire Brazilian generative-AI startup NeoSpace AI for roughly $589M in cash, folding its Large Data Model technology into the bank's financial products; the two have worked together since a $18M minority-stake investment in January 2025. ([source](https://www.reuters.com/world/americas/brazils-itau-agrees-buy-ai-startup-neospace-589-million-2026-10-26/))

**Oceania**

Australia's ASD warned that autonomous AI agents breached a government data system (see Security Incidents above).

### Business Cases / Funding

**Flapping Airplanes**: A stealth San Francisco AI research lab with only a few dozen staff and no product yet raised a $1B Series A at a $6B valuation, betting on training-efficiency gains (a megakernel architecture) to sharply cut training costs. ([source](https://gcn.com/san-francisco-lab-couple-dozen-staff/22780/))

**OpenAI**: In talks with UAE investors and Coatue to raise up to $30B at a $1.25T pre-money valuation, adding Middle East capital to its existing fundraising plans. ([source](https://enterpriseam.com/ai/2026/10/27/openai-seeks-uae-backing-as-it-looks-to-raise-up-to-usd-30-bn/))

**IoT Analytics**: Tracking 1,533 enterprise generative/agentic AI projects, its data shows workflow optimization has overtaken content generation as the biggest application category — examples include Kraft Heinz cutting product time-to-market from 8 weeks to 8 hours, and Delivery Hero's coding agent merging over 170 PRs a day. ([source](https://iot-analytics.com/top-enterprise-ai-applications/))

**Rescale**: Deployed an AI triage agent to automate test-failure analysis, cutting deployment-blocking time by 20%, though all suggestions still require human confirmation before going live. ([source](https://thenextgentechinsider.com/pulse/rescale-deploys-ai-triage-agent-to-automate-test-failure-analysis))

Today also brings two funding briefs: [Hyphenate's $45M Series A](/posts/daily/2026-10-28-funding-hyphenate-en) (autonomous finance agents for the CFO's office, 86x revenue growth in 13 months) and [Infisical's $40M Series B](/posts/daily/2026-10-28-funding-infisical-en) (Elad Gil backing agent-credential security for a second straight round).

Application-layer startups Azoma (London, $11.2M Series A) and Opply ($7.5M) both raised fresh rounds the same day, focused on brand visibility and marketing tools for agentic search and shopping-assistant environments. ([source](https://www.foodnavigator.com/Article/2026/10/26/ai-startups-raise-1987m-for-marketing-and-cpg-tools/))

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| NVIDIA's investment in Meta's stock offering | $3B | [the-decoder](https://the-decoder.com/meta-gets-3-billion-from-nvidia-and-plans-to-spend-more-on-nvidia-chips/) |
| Replit/OpenAI contract size and discount | $100M+/year, 30%+ discount | [thenextweb](https://thenextweb.com/news/openai-discounts-anthropic-customers-replit-rippling) |
| OpenAI's new funding round / valuation | $30B / $1.25T | [enterpriseam](https://enterpriseam.com/ai/2026/10/27/openai-seeks-uae-backing-as-it-looks-to-raise-up-to-usd-30-bn/) |
| Providers EU AI Office formally queried | 30+ | [ad-hoc-news](https://ad-hoc-news.de/wissenschaft/eu-ki-gesetz-mehr-als-30-unternehmen-muessen-sicherheitsfragen/70416897) |
| Itaú's acquisition of NeoSpace AI | ~$589M | [Reuters](https://www.reuters.com/world/americas/brazils-itau-agrees-buy-ai-startup-neospace-589-million-2026-10-26/) |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-10-28](/posts/daily/2026-10-28-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-10-28](/posts/daily/2026-10-28-ai-agent-github-digest-en)
- 📄 [Framework Update: Pydantic AI v2.62.0](/posts/daily/2026-10-28-framework-pydantic-ai-v2.62.0-en)
- 📄 [Funding Brief: Hyphenate Series A $45M](/posts/daily/2026-10-28-funding-hyphenate-en)
- 📄 [Funding Brief: Infisical Series B $40M](/posts/daily/2026-10-28-funding-infisical-en)
- 📄 [Tool Pick: noteful-mcp](/posts/daily/2026-10-28-tool-noteful-mcp-en)
- 📄 [AI Engineer Interview Prep — 2026-10-28](/posts/daily/2026-10-28-ai-interview-daily-en)
- 📄 [Product Builder Interview Prep — 2026-10-28](/posts/daily/2026-10-28-product-builder-interview-daily-en)

## Tomorrow's Watch

- Whether the deadline and follow-up on the EU AI Office's formal information requests actually turn agentic-AI incident disclosure from voluntary into mandatory
- Whether OpenAI's $30B/$1.25T round, if UAE capital is actually included, introduces new geopolitical variables into AI compute
- Whether Oracle's Fusion Claw plus its $1B partner-ecosystem fund draws more ISVs into its governed agent platform, pressuring Salesforce's and Microsoft's enterprise-agent market share

## Today's Takeaway

I used to think the biggest enterprise generative-AI use case was drafting copy and generating content. Today's IoT Analytics data, tracking 1,533 enterprise projects, shows workflow optimization — actually executing the steps — has overtaken content generation as the largest application category. That means enterprise expectations for agents are shifting from "help me write faster" to "help me actually get it done" — and those two things need completely different acceptance criteria and trust thresholds.

## References

- [AI Agent Arxiv Digest — 2026-10-28](/posts/daily/2026-10-28-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-10-28](/posts/daily/2026-10-28-ai-agent-github-digest-en)
- [Oracle launches Fusion Claw at Oracle AI World](https://www.oracle.com/news/announcement/ai-world-oracle-advances-outcome-driven-ai-across-fusion-applications-2026-10-26/)
- [NVIDIA invests $3B in Meta's equity offering — the-decoder](https://the-decoder.com/meta-gets-3-billion-from-nvidia-and-plans-to-spend-more-on-nvidia-chips/)
- [Anthropic renews no-ads pledge in IPO letter — the-decoder](https://the-decoder.com/anthropic-uses-its-ipo-letter-to-renew-its-pledge-that-claude-will-never-show-ads/)
- [OpenAI's partner content pre-summarized in ChatGPT — the-decoder](https://the-decoder.com/openais-partner-content-arrives-in-chatgpt-pre-summarized-while-the-rest-of-the-web-gets-raw-scraps/)
- [OpenAI asks outside experts to verify AI-generated proofs — the-decoder](https://the-decoder.com/openai-asks-outside-experts-including-a-nobel-laureate-to-check-proofs-its-ai-produced-in-math-computer-science-and-physics/)
- [AllenAI NoveltyBench — Hugging Face](https://huggingface.co/blog/allenai/novelty-bench)
- [Replit shifts AI spend from Anthropic to OpenAI — thenextweb](https://thenextweb.com/news/openai-discounts-anthropic-customers-replit-rippling)
- [Cognition FrontierCode 2.0](https://cognition.com/blog/frontier-code-2.0)
- [Grok/Cursor engineer's AI-agent PR workflow — Reddit](https://reddit.com/r/ArtificialInteligence/comments/1xgm4up/how_a_grok_cursor_engineer_uses_ai_agents_to_ship)
- [Liquid AI open-sources LFM3 family](https://aiweekly.co/alerts/liquid-ai-opens-six-model-lfm3-family-at-256k-context)
- [Entire/Trails git forge sparks HN discussion](https://news.ycombinator.com/item?id=50247453)
- [Akamai Inference and Agent Sandbox beta](https://opentools.ai/news/akamai-inference-agent-sandbox-beta-spin-sdk-serverless-october-2026)
- [4 coding agents on one RTX 3090 — Reddit](https://reddit.com/r/LocalLLaMA/comments/1xgs8hp/4_coding_agents_on_one_rtx_3090_290_toks_total)
- [Qwen3.8 27B six-engine benchmark — Reddit](https://reddit.com/r/LocalLLaMA/comments/1xguu4c/qwen38_27b_on_one_rtx_5090_comparing_six_engines)
- [Azure AI Projects SDK v2 jump — GitHub issue](https://github.com/nicholasdbrady/foundry-docs/issues/1215)
- [Australian Signals Directorate 2025-26 Cyber Threat Report — ABC News](https://www.abc.net.au/news/2026-10-27/australian-signals-directorate-ai-cybersecurity-hacking-threats/107309858)
- [EU AI Office issues formal information requests — ad-hoc-news](https://ad-hoc-news.de/wissenschaft/eu-ki-gesetz-mehr-als-30-unternehmen-muessen-sicherheitsfragen/70416897)
- [India's AI consultation paper on agents — NDTV](https://www.ndtv.com/artificial-intelligence/ai-consultation-paper-experts-want-rules-on-agents-deepfakes-schools-12242635)
- [DeepSeek and MiniMax clear China's AI export controls — thenextweb](https://thenextweb.com/news/deepseek-minimax-china-ai-export-controls-overseas)
- [Omnichat raises $10M Series A — MorningTick](https://morningtick.com/post/omnichat-secures-10m-ai-agents-that-sell-over-chat-apps)
- [Japan's Digital Agency adds AI agent to Gennai — Japan Times](https://www.japantimes.co.jp/news/2026/10/26/japan/digital-agency-ai-agent-gennai/)
- [Singapore launches agentic AI SME workshops — Straits Times](https://straitstimes.com/business/economy/singapore-unveils-new-initiatives-to-help-companies-harness-ai-such-as-to-develop-new-products)
- [Microsoft's $10B Middle East cloud and AI investment — IntelligentCIO](https://www.intelligentcio.com/me/2026/10/26/microsoft-plans-us10-billion-middle-east-cloud-and-ai-investment/)
- [Scale AI launches UAE entity — Unite.AI](https://www.unite.ai/scale-ai-formally-launches-uae-entity-at-dubai-ai-festival/)
- [Gulf AI dealbook — enterpriseam](https://enterpriseam.com/ai/2026/10/27/gulf-ai-dealbook-oman-campuses-alpha-dhabi-funding-and-humain-capacity/)
- [Kenya's NIFCA plans $250M AI fund — TechTrendsKE](https://techtrendske.co.ke/2026/10/27/nifca-technology-ai-fund/)
- [Itaú buys Brazilian AI startup NeoSpace for $589M — Reuters](https://www.reuters.com/world/americas/brazils-itau-agrees-buy-ai-startup-neospace-589-million-2026-10-26/)
- [Flapping Airplanes raises $1B Series A — GCN](https://gcn.com/san-francisco-lab-couple-dozen-staff/22780/)
- [OpenAI seeks UAE backing for up to $30B raise — enterpriseam](https://enterpriseam.com/ai/2026/10/27/openai-seeks-uae-backing-as-it-looks-to-raise-up-to-usd-30-bn/)
- [IoT Analytics: top enterprise AI applications](https://iot-analytics.com/top-enterprise-ai-applications/)
- [Rescale deploys AI triage agent](https://thenextgentechinsider.com/pulse/rescale-deploys-ai-triage-agent-to-automate-test-failure-analysis)
- [Azoma and Opply raise funding — FoodNavigator](https://www.foodnavigator.com/Article/2026/10/26/ai-startups-raise-1987m-for-marketing-and-cpg-tools/)
