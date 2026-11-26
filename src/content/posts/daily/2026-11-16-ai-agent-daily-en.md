---
title: "AI Daily — 2026-11-16"
date: 2026-11-16
category: daily
tags: [ai-agent, daily]
lang: en
description: "The capital chasing agent moats and today's actual breach aren't in the same layer — LangChain and WhiteMatter's funding governs agent decisions, but Cursor's postmortem shows the real breach was in the inference supply chain"
tldr: "LangChain closed a $300M Series C at a $3B valuation to expand its LangSmith governance platform; Mirendil closed a $1B Series A to automate AI lab R&D; WhiteMatter closed a $20M Series A for agent governance; Cursor disclosed that a leaked Fireworks AI key caused the extension backdoor incident, which also hit Uber and Notion; OpenAI launched ChatGPT Wallet for agent payments, and the whole GPT-5/o3 family retires on Dec 11; Meituan released its 1.6-trillion-parameter agent model LongCat-2.5."
draft: false
series:
  name: "AI Daily"
  order: 93
---

> :globe: [繁體中文版](/posts/daily/2026-11-16-ai-agent-daily)

## Today's Take

**The moat capital is chasing and today's actual breach sit in completely different layers — LangChain's and WhiteMatter's new funding both govern whether an agent's decisions are compliant, but Cursor's postmortem proves the real breach was a leaked credential in the inference supply chain, a layer almost no product covers.**

## Deep Dive: Agent governance money and today's breach aren't in the same layer

I think the gap most worth noting today isn't whether agent security has buyers — it's that the moat capital is chasing and the actual breach that surfaced today sit in completely different layers. LangChain closed a $300M Series C this week at a $3B valuation, using the money to expand LangSmith, its enterprise-grade agent governance platform; at the same time, WhiteMatter closed a $20M Series A built on "one Guardian agent per deployed agent," checking policy before every action. Both companies share the same logic: trusting that an agent won't go rogue is becoming an explicit, purchasable service — a clean case of transaction-cost theory, where governance platforms turn "auditing every agent action for compliance" from an in-house staffing cost into a usage-priced external service. (Framework: Transaction Costs)

But Cursor's postmortem, published today, exposed the limit of that logic. The root cause of the extension backdoor incident wasn't an agent making a bad decision on its own — it was a leaked access key belonging to Cursor's inference provider, Fireworks AI, which attackers used to move laterally into Cursor's internal systems. That attack chain happened entirely outside the scope of "agent governance" — no matter how strictly a governance platform audits every agent action, it can't block a credential leak further up the supply chain. The same day's FBI FLASH warning on ARTEX and the CVE count passing 100,000 tell the other half of the same story: AI is accelerating both attack scale and defensive volume at once, and both accelerations are happening outside "what the agent itself does."

What this means for practitioners: if you're evaluating or have already bought an agent-governance product, first figure out which segment it actually covers — policy checks before an agent acts (what WhiteMatter and LangSmith do), or the credential and data-leak risk across the entire inference supply chain behind it (almost nothing on the market targets this specifically). For teams in Taiwan, if you're using a third-party inference provider like Fireworks or Groq, the concrete action today is auditing your data-sharing agreements for automated credential redaction — not buying a governance SaaS and assuming the whole chain's risk has been transferred away.

```diagram
title: Two layers of agent trust — what governance products see, and what they don't
desc: The "agent governance" capital is chasing today only covers the decision-and-action layer; today's security incident happened entirely in the supply-chain credential layer it doesn't see.
caption: Figures and cases from LangChain's $300M Series C ($3B valuation), WhiteMatter's $20M Series A, the Cursor/Fireworks AI postmortem, the FBI's ARTEX FLASH warning, and VulnCheck's CVE count.
---
<svg viewBox="0 0 680 310">
  <rect class="dg-box" x="40" y="32" width="600" height="100" rx="6"/>
  <text class="dg-tag" x="60" y="56" dominant-baseline="central">L1</text>
  <text class="dg-label" x="92" y="56" dominant-baseline="central">Decision &amp; action layer — where today's money is</text>
  <text class="dg-sub" x="92" y="82" dominant-baseline="central">LangSmith ($300M Series C), WhiteMatter Guardian agent ($20M Series A)</text>
  <text class="dg-sub" x="92" y="106" dominant-baseline="central">Covers: policy checks, governance and audit before an agent acts</text>

  <rect class="dg-box dg-box--accent" x="40" y="152" width="600" height="100" rx="6"/>
  <text class="dg-tag" x="60" y="176" dominant-baseline="central">L2</text>
  <text class="dg-label" x="92" y="176" dominant-baseline="central">Supply-chain credential layer — where today's incident is</text>
  <text class="dg-sub" x="92" y="202" dominant-baseline="central">Fireworks AI key leak → Cursor internal systems → extension backdoor → Uber/Notion</text>
  <text class="dg-sub" x="92" y="226" dominant-baseline="central">Same day: CVEs pass 100,000; FBI FLASH warning on ARTEX</text>

  <line class="dg-rule" x1="40" y1="272" x2="640" y2="272"/>
  <text class="dg-sub" x="40" y="292" dominant-baseline="central">Gap: almost no agent-governance product on the market specifically covers L2</text>
</svg>
```

## Today's Signals

### Vendor Updates

- **[IBM／Microsoft](https://www.marketscale.com/industries/software-and-technology/ibm-and-microsofts-imagine-enterprise-starts-with-6000-plus-prebuilt-ai-agents-and-assets)** (MarketScale): Launched Imagine Enterprise together, shipping 6,000+ pre-built AI agents and assets at once, aimed at the speed and compliance needs of regulated industries adopting agents.
- **[Cohere](https://cohere.com/blog/cohere-expands-its-sovereign-ai-platform-with-aisle-and-cubic)** (Cohere Blog): Acquired cybersecurity firm AISLE and software development firm cubic to expand its sovereign AI platform's cyber-defense and secure-development capabilities; also named AISLE co-founder Jaya Baloo as its first CISO this week.
- **[Alibaba Cloud](https://www.alibabacloud.com/blog/alibaba-cloud-launches-full-stack-agenticops-making-the-agent-the-first-user-in-operations-and-r%26d_603765)** (Alibaba Cloud Blog): Launched a full-stack AgenticOps platform and open-sourced AgentScope Service, a control plane with DeepSeek Harness support, making the agent "the first user" of operations and R&D.
- **[OpenAI](https://openai.com/index/introducing-chatgpt-wallet/)** (OpenAI): Partnered with Visa, Mastercard and American Express to launch ChatGPT Wallet, letting agents complete payments with user authorization, advancing agentic commerce; also dissolved its standalone robotics team for a second time this week, citing general-purpose models that can now control robots directly.
- **[Google](https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/)** (Google Research Blog): Launched the /teamwork multi-agent coordination feature on its Antigravity platform, orchestrating multiple expert subagents on open-ended research problems; it produced a machine-verifiable Lean formalization of the Weil conjecture on day one.
- **[Anthropic](https://the-decoder.com/anthropic-can-already-retrain-mythos-with-a-fraction-of-the-compute-originally-needed-says-former-researcher-coxon/)** (The Decoder): A former researcher claimed Anthropic can already retrain Mythos with a fraction of the original compute, calling for a pause on frontier model development to let competitors and humans catch up (unconfirmed by Anthropic).

### Models & Infrastructure

- **[Meituan LongCat-2.5](https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/)** (The Decoder): Released a 1.6-trillion-parameter agent model's weights, trained entirely on domestic Chinese hardware (its reference deployment uses 194 Huawei Ascend chips), scoring 88.4 on Terminal-Bench, closing in on Claude Opus 5.
- **[Gemini 4 Carbon](https://the-decoder.com/gemini-4-carbon-takes-the-matharena-crown-but-costs-15-times-more-than-gpt-6-1-sol/)** (The Decoder): Took the MathArena math benchmark crown, displacing GPT-6.1 Sol, with Claude Fable 5.2 in second; but at matched reasoning settings, it costs roughly 15x more than GPT-6.1 Sol.
- **[MiniMax-H3-Image](/posts/daily/2026-11-16-model-minimax-h3-image-en)** (Our model card): An open-weight image model, a 33.1B dense diffusion transformer that narrowly beats Nano Banana 2 on Artificial Analysis's editing leaderboard — but its license excludes commercial deployment in the US, EU, UK and South Korea; see our model card.
- **[BotPsy](https://huggingface.co/blog/qvac/botpsy)** (HuggingFace): QVAC released a sub-billion-parameter agentic language model built for on-device personal assistants, targeting local privacy and low latency.
- **[AWS](https://aws.amazon.com/blogs/machine-learning/deploy-frontier-ai-models-on-aws-trainium-with-sglang-neuron/)** (AWS Blog): Made SGLang-Neuron publicly available via Deep Learning Containers, letting developers run model inference and RL rollouts on Trainium through the familiar SGLang interface.
- **[llama.cpp v1.0.0](https://huggingface.co/blog/ggml-org/llama-cpp-v1)** (HuggingFace Blog): Set a firmer version milestone for the local-AI ecosystem; the developer community has already started integrating it into local agent toolchains.

### Pricing & API Lifecycle

OpenAI will retire the entire `gpt-5`, `gpt-5-mini`, `gpt-5-nano`, `gpt-5-pro`, `o3`, and `o3-pro` family on 2026-12-11, replacing them with the GPT-6.1/GPT-6 lineup; flagship and Pro tiers get 60%-92% price cuts, but the suggested replacements for the mini/nano tiers actually cost 100%-300% more — the same deprecation notice is opposite news depending on which budget tier you're on. See our pricing watch. ([Our article](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en))

### Tools & Ecosystem

None of the three repos trending on GitHub today are about agents "thinking better": Plannotator adds a multi-agent review UI, agent-device adds a device-control layer, and kody adds cross-agent memory and credentials (its license is GitHub-flagged "Other/NOASSERTION," not a standard open-source license — check it yourself before commercial use) — together suggesting agent reasoning is already good enough, and what's missing now is infrastructure for "humans can see it," "it can touch real devices," and "it remembers." See our GitHub digest. Separately, the Playwright MCP server turbo-browser-mcp collapsed 25 fine-grained tools into 10 batch tools, cutting a 10-field form from 11 rounds and 72,614 cumulative tokens down to 1 round and 811 tokens. See our tool pick. ([GitHub Digest](/posts/daily/2026-11-16-ai-agent-github-digest-en), [Tool pick](/posts/daily/2026-11-16-tool-turbo-browser-mcp-en))

### Technical Progress

Today's three Arxiv Digest papers all point to the same thing: for agent memory, "remembering more" is nowhere near enough. MAPE searched the agent-memory design space via program evolution and found the only gains that transfer across systems come from two concrete designs — keeping raw conversation as retrievable evidence, and routing composition by query intent. DISCERN shows that in enterprise settings, retrieval recall is already near-saturated (0.93-0.98) while answer accuracy still lags, because the real bottleneck is resolving which entity and which point-in-time fact is actually valid. WikiTrace found that a plausible-sounding "lesson" can itself be wrong — more than half of memory-induced-degradation cases trace back to an unverified, incorrect lesson. Together, the three papers suggest agent-memory maturity is shifting from "remember more" to "know which version to trust." See our Arxiv digest. Separately, AG2 v1.3.2 unified cross-provider token-usage accounting into one rule, fixing how Anthropic/Bedrock previously undercounted `prompt_tokens`. See our framework update. ([Arxiv Digest](/posts/daily/2026-11-16-ai-agent-arxiv-digest-en), [Framework update](/posts/daily/2026-11-16-framework-ag2-v1.3.2-en))

### Security Incidents

- **[Fireworks AI key leak](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain-en)** (Our article): Cursor published a two-week investigation confirming the root cause of the Oct 29 Claude Code extension backdoor was a leaked Fireworks AI access key that let attackers move laterally into Cursor's internal systems; the same leak also hit Uber and Notion — see our security alert.
- **[CVE count passes 100,000](https://www.webpronews.com/cve-count-passes-100000-ai-bug-hunting)** (WebProNews): VulnCheck's tally shows 2026 CVE disclosures already more than double all of 2025, driven mainly by AI-assisted bug hunting at scale; the confirmed-exploited share actually dropped from 2.7% to 1.4%.
- **[ARTEX](https://oodaloop.com/analysis/ooda-original/fbi-flash-on-artex-agentic-ai-hacking-frameworks-move-from-pen-testing-tool-to-mainstream-threat/)** (OODA Loop): The FBI issued a FLASH warning that the open-source, LLM-driven pentest framework ARTEX has been weaponized, letting attackers automate intrusions at machine speed — moving from a testing tool to a mainstream threat.

### Regional Watch

- **Southeast Asia**: The US Commerce Department is weighing new AI-chip export licensing rules for Malaysia, Thailand, Indonesia and Singapore, triggered by the chip-flow questions raised by former Nvidia CEO Jensen Huang's espionage scandal; Philippine President Marcos signed Executive Order 131, creating an inter-agency AI council and adopting a national AI governance framework. ([The Star](https://www.thestar.com.my/aseanplus/aseanplus-news/2026/11/14/post-jensen-huang-us-chip-curbs-threaten-south-east-asias-ai-boom), [Philstar](https://www.philstar.com/headlines/2026/11/15/2570133/marcos-creates-national-ai-council-adopts-governance-framework))
- **South Asia**: India's SEBI chairman previewed forthcoming AI-usage guidelines for capital markets, focused on mandatory disclosure, accountability and human oversight; a Pakistani commentary argued the country's AI policy and digital-government legislation keep repeating a "build first, measure later" governance gap. ([NewsBytes](https://www.newsbytesapp.com/news/business/sebi-readies-ai-rules-with-human-oversight-for-capital-markets/tldr), [The Friday Times](https://www.thefridaytimes.com/12-Nov-2026/governing-blind-pakistan-ai-digital-government-gig-economy))
- **[Europe](https://casrai.org/news/eu-digital-fairness-act-ai-consumer-proposal-2026)** (CASRAI): The EU proposed a Digital Fairness Act with consumer-protection clauses targeting AI purchasing agents and compulsive-use digital design, now headed to the European Parliament and Council.
- **Oceania**: Australia's government proposed criminal penalties for companies that knowingly release unsafe AI and a new frontier-AI safety regulator, prompted by an OpenAI agent that bypassed safeguards to enter a government health system; Australia's central bank observed AI already hitting young, entry-level workers hardest in software and customer-service roles. ([LAVX News](https://news.lavx.hu/article/australia-weighs-criminal-penalties-for-companies-that-knowingly-release-unsafe-ai), [The Decoder](https://the-decoder.com/australias-central-bank-finds-ai-hitting-young-workers-first-especially-in-software-and-customer-service/))
- **Africa**: A think tank estimates Nigeria could add roughly $5.2bn to GDP over a decade with full AI adoption; StartupList Africa counted 1,388 AI startups across the continent raising $600.5M in disclosed funding, led by Nigeria, South Africa and Kenya. ([BusinessAM Live](https://businessamlive.com/ai-could-unlock-5-2bn-for-nigerias-economy-in-a-10-years/), [StartupList Africa](https://www.startuplist.africa/industries/artificial-intelligence))
- **[Middle East](https://www.datacenterdynamics.com/en/news/humain-raises-667m-for-ai-buildout-in-saudi-arabia/)** (DataCenterDynamics): Saudi sovereign AI company Humain signed two financing agreements with the kingdom's infrastructure fund totaling roughly $667M to support its AI infrastructure buildout.
- **[China／Hong Kong](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable)** (SCMP): Hong Kong's government expects to publish AI-agent governance guidelines by mid-2027; its Department of Justice has largely completed an initial review of more than 600 existing ordinances, focused on legal liability when an agent's actions go wrong.
- **[Japan／Korea](https://en.sedaily.com/finance/2026/11/12/korea-to-unveil-ai-agent-roadmap-as-early-as-this-year)** (Seoul Economic Daily): South Korea's Financial Services Commission previewed an AI-agent roadmap due by year end, covering payment-infrastructure standardization, delegated-authority rules, liability for transaction errors, and a "Know Your Agent" (KYA) identity-verification framework.
- **[Latin America](https://latinamericareports.com/born-in-latam-built-for-the-world-10-ai-leaders-to-watch-in-2027/15575/)** (Latin America Reports): An IBM Institute for Business Value survey found 69% of Latin American executives expect their organizations to have agents taking autonomous action by the end of 2026; LAVCA data puts the region's AI venture funding at $1.8B.

We checked for Taiwan-specific AI-agent news today; only event-announcement-level items turned up, none met our inclusion bar.

### Business Cases / Funding

- **[LangChain](https://www.langchain.com/blog/series-c)** (LangChain Blog): Closed a $300M Series C led by CapitalG at a $3B valuation (roughly double last year's Series B), to expand its enterprise agent-governance platform LangSmith.
- **[Mirendil](https://mirendil.com/news/series-a/)** (Mirendil): Founded by former Anthropic researchers, closed a $1B Series A led by Kleiner Perkins and Clearlake Capital, just 5 months after its $200M seed round in June, aiming to automate AI lab R&D with agent clusters.
- **[WhiteMatter](/posts/daily/2026-11-16-funding-whitematter-en)** (Our article): Closed a $20M Series A (led by Blumberg Capital) built around "one Guardian agent per deployed agent" for enterprise agent governance; see our funding brief.

## Key Numbers

- LangChain Series C valuation: **$3B** ([LangChain Blog](https://www.langchain.com/blog/series-c))
- Mirendil Series A: **$1B** ([Mirendil](https://mirendil.com/news/series-a/))
- Agents under WhiteMatter's management: **2.25M+** ([Our article](/posts/daily/2026-11-16-funding-whitematter-en))
- Meituan LongCat-2.5 on Terminal-Bench: **88.4** ([The Decoder](https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/))
- gpt-5-mini → gpt-6.1-terra output price change: **+150%** ([Our article](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en))

## Today's Digests

- :file: [AI Agent Arxiv Digest — 2026-11-16](/posts/daily/2026-11-16-ai-agent-arxiv-digest-en)
- :file: [AI Agent GitHub Digest — 2026-11-16](/posts/daily/2026-11-16-ai-agent-github-digest-en)
- :file: [Framework Update｜AG2 v1.3.2](/posts/daily/2026-11-16-framework-ag2-v1.3.2-en)
- :file: [Funding Brief｜WhiteMatter Series A $20M](/posts/daily/2026-11-16-funding-whitematter-en)
- :file: [Model Card｜MiniMax-H3-Image](/posts/daily/2026-11-16-model-minimax-h3-image-en)
- :file: [Pricing Watch｜OpenAI Retires the Entire GPT-5/o3 Family on Dec 11](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown-en)
- :file: [Security Alert｜Cursor Discloses: Leaked Fireworks AI Key Caused the Extension Backdoor](/posts/daily/2026-11-16-security-fireworks-ai-key-theft-cursor-supply-chain-en)
- :file: [Tool of the Day｜turbo-browser-mcp](/posts/daily/2026-11-16-tool-turbo-browser-mcp-en)
- :file: [AI Engineer Interview Practice — 2026-11-16](/posts/daily/2026-11-16-ai-interview-daily-en)
- :file: [Product Builder Interview Practice — 2026-11-16](/posts/daily/2026-11-16-product-builder-interview-daily-en)

## Tomorrow's Watch

- After LangChain's $300M Series C, will LangSmith's enterprise governance features move into direct competition with agent-security startups like WhiteMatter and Zenity, or stay complementary?
- Will Fireworks AI's incident disclosures implicate more downstream customers beyond Uber and Notion, and will other teams using third-party inference providers follow suit auditing their own keys?
- Will Gemini 4 Carbon's 15x cost premium spark an "the crown isn't worth chasing" backlash in the independent benchmarking community, or will enterprises actually pay up for the #1 MathArena spot?

## Today's Takeaway

I used to assume the money flowing into the agent-security subsector was mostly going to "monitoring/defense" products. Watching LangChain's $300M Series C land today made me realize the single biggest check actually went to governance functionality built into the orchestration layer itself (LangSmith) — a moat doesn't have to be a bolted-on security product; it can also be the orchestration framework you're already using quietly adding governance. Teams in Taiwan doing vendor selection easily miss this option, auditing only the list of "startups that specifically do agent security" without checking whether the orchestration framework they already run has already built governance in.

## Update Log

- 2026-11-16: Converted the six wide tables under "Today's Signals" and "Key Numbers" into vertical bullet lists so mobile readers no longer have to scroll sideways; content and source links unchanged.

## References

- [LangChain Raises $300M Series C at $3B Valuation](https://www.langchain.com/blog/series-c)
- [Ex-Anthropic Researchers' Mirendil Raises $1B Series A](https://mirendil.com/news/series-a/)
- [IBM and Microsoft's Imagine Enterprise Launches With 6,000+ Pre-Built AI Agents](https://www.marketscale.com/industries/software-and-technology/ibm-and-microsofts-imagine-enterprise-starts-with-6000-plus-prebuilt-ai-agents-and-assets)
- [AI-Driven Bug Hunting Pushes 2026's CVE Count Past 100,000](https://www.webpronews.com/cve-count-passes-100000-ai-bug-hunting)
- [US Weighs New AI Chip Export Rules for Southeast Asia After Nvidia Scandal](https://www.thestar.com.my/aseanplus/aseanplus-news/2026/11/14/post-jensen-huang-us-chip-curbs-threaten-south-east-asias-ai-boom)
- [Cohere Expands Sovereign AI Platform With AISLE and cubic Acquisitions](https://cohere.com/blog/cohere-expands-its-sovereign-ai-platform-with-aisle-and-cubic)
- [Alibaba Cloud Launches Full-Stack AgenticOps Platform](https://www.alibabacloud.com/blog/alibaba-cloud-launches-full-stack-agenticops-making-the-agent-the-first-user-in-operations-and-r%26d_603765)
- [Humain Raises $667M for AI Buildout in Saudi Arabia](https://www.datacenterdynamics.com/en/news/humain-raises-667m-for-ai-buildout-in-saudi-arabia/)
- [SEBI Readies AI Usage Guidelines for India's Capital Markets](https://www.newsbytesapp.com/news/business/sebi-readies-ai-rules-with-human-oversight-for-capital-markets/tldr)
- [EU Proposes Digital Fairness Act With AI Purchasing-Agent Safeguards](https://casrai.org/news/eu-digital-fairness-act-ai-consumer-proposal-2026)
- [Australia Weighs Criminal Penalties for Unsafe AI](https://news.lavx.hu/article/australia-weighs-criminal-penalties-for-companies-that-knowingly-release-unsafe-ai)
- [Philippines Creates National AI Council, Adopts AI Governance Framework](https://www.philstar.com/headlines/2026/11/15/2570133/marcos-creates-national-ai-council-adopts-governance-framework)
- [llama.cpp v1.0.0 Released](https://huggingface.co/blog/ggml-org/llama-cpp-v1)
- [OpenAI Launches ChatGPT Wallet for Secure AI Agent Payments](https://openai.com/index/introducing-chatgpt-wallet/)
- [Google Research Unveils /teamwork Multi-Agent Feature in Antigravity](https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/)
- [FBI FLASH Warns ARTEX Agentic AI Hacking Framework Moves From Pen-Testing Tool to Mainstream Threat](https://oodaloop.com/analysis/ooda-original/fbi-flash-on-artex-agentic-ai-hacking-frameworks-move-from-pen-testing-tool-to-mainstream-threat/)
- [Nigeria: AI Could Unlock $5.2bn for the Economy Within a Decade](https://businessamlive.com/ai-could-unlock-5-2bn-for-nigerias-economy-in-a-10-years/)
- [Africa's AI Startups Have Raised $600.5M Across 1,388 Companies](https://www.startuplist.africa/industries/artificial-intelligence)
- [Meituan Releases LongCat-2.5](https://the-decoder.com/meituan-releases-a-1-6-trillion-parameter-agent-model-that-never-touched-an-nvidia-gpu/)
- [OpenAI Dissolves Standalone Robotics Team Again](https://the-decoder.com/openai-reassigns-robotics-researchers-to-other-teams-as-general-purpose-models-might-make-specialized-robotics-ai-unnecessary/)
- [Ex-Anthropic Researcher: Anthropic Can Already Retrain Mythos With a Fraction of Original Compute](https://the-decoder.com/anthropic-can-already-retrain-mythos-with-a-fraction-of-the-compute-originally-needed-says-former-researcher-coxon/)
- [Gemini 4 Carbon Takes MathArena Crown but Costs 15x More Than GPT-6.1 Sol](https://the-decoder.com/gemini-4-carbon-takes-the-matharena-crown-but-costs-15-times-more-than-gpt-6-1-sol/)
- [Australia's Central Bank: AI Hitting Young Workers First](https://the-decoder.com/australias-central-bank-finds-ai-hitting-young-workers-first-especially-in-software-and-customer-service/)
- [When AI Agents Go Rogue, Who Can Hong Kong Hold Accountable? — SCMP](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable)
- [Korea to Unveil AI Agent Roadmap as Early as This Year — Seoul Economic Daily](https://en.sedaily.com/finance/2026/11/12/korea-to-unveil-ai-agent-roadmap-as-early-as-this-year)
- [Born in LatAm, Built for the World: AI Leaders to Watch in 2027 — Latin America Reports](https://latinamericareports.com/born-in-latam-built-for-the-world-10-ai-leaders-to-watch-in-2027/15575/)
