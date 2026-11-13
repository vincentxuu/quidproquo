---
title: "AI Daily — 2026-11-11"
date: 2026-11-11
category: daily
tags: [ai-agent, daily]
lang: en
description: "The model layer changed leaders three times in a week, yet the incidents came from the inference engines and MCP dependencies underneath agents — picking a model is getting cheap, auditing the dependency chain is the new fixed cost"
tldr: "Anthropic releases Fable 5.2, topping Artificial Analysis Index v5 at 65 points with pricing cut to $8/$40 per million tokens; Google makes Gemini 4 Carbon generally available the same week and Meta launches the $0.10/$0.50 small model Muse Ember; NEAR AI confirms an SGLang remote code execution flaw let an attacker run code inside its confidential computing environment; Glow Labs finds coding agents installing deprecated MCP servers from training-data memory; Australia announces an AI safety regulator with rapid incident notification; Anthropic kicks off its IPO roadshow targeting up to a $1.02 trillion valuation"
draft: false
series:
  name: "AI Daily"
  order: 88
---

> 🌏 [中文版](/posts/daily/2026-11-11-ai-agent-daily)

## The One-Line Verdict

**Three model vendors cut prices or shipped new generations today, so the cost of choosing a model keeps falling; the actual incidents happened in the inference engines and MCP dependencies underneath agents. Taiwanese teams that self-host inference for data sovereignty or plug into local MCP hubs should budget dependency-chain inventory and incident reporting as a fixed cost, not just compare model scores.**

## Deep Dive: Models Are Easier to Swap, but Monitoring the Dependency Chain Costs More

I think today's signals add up to one point: the transaction cost of an agent system is moving from "which model do we pick" to "what are we actually running." (Framework: transaction costs)

Start with the model layer. Anthropic's Fable 5.2 scores 65 on Artificial Analysis Index v5 at its top tier, ahead of Gemini 4 Carbon at 60, with pricing cut from the predecessor's $10/$50 to $8/$40 ([The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/)). A day later Google made Carbon generally available at $7.76 per task, versus about $9 for Fable 5.2 at the High tier ([The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)). Meta's Muse Ember sits on the cost-versus-capability Pareto line at $0.10/$0.50 ([Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/)). Alibaba Cloud's open-source HiRoute turns "which model gets this task" into a local routing engine ([Alibaba Cloud](https://www.alibabacloud.com/blog/hiroute-new-release-choose-the-best-fit-model-for-your-real-world-work_603757)). The search and comparison costs of switching models are falling.

Now the dependency layer. NEAR AI ran its inference servers inside a confidential computing environment, yet an attacker used a remote code execution flaw in the open-source SGLang inference engine to run code inside it; NEAR AI itself writes that confidential computing "does not protect against a vulnerability in the software running inside the environment" ([NEAR AI](https://near.ai/blog/security-incident-report-sglang-vulnerability)). Glow Labs found that in 98% of sessions where an agent set up a deprecated MCP server, it did so because the model "remembered" an old package from training data rather than looking up the official current one ([Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data)). CSA groups a year of high-severity MCP SDK advisories into one "transport trust gap" ([CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-transport-trust-gap-20261109-csa-style/)). None of these is fixed by switching to a stronger model.

Regulation will push monitoring costs higher. Australia announced an AI safety regulator whose standards require rapid notification to the government of incidents such as "misaligned behavior" ([AP via News4JAX](https://www.news4jax.com/business/2026/11/10/australia-to-launch-ai-safety-regulator-after-openais-breach-of-a-government-portal/)). Reporting quickly presupposes knowing which servers your agents installed and which inference engine version they run on.

What this means for Taiwanese teams: the same week, Taiwan's National Center for High-performance Computing showcased its TAIWAN AI RAP platform and Twinkle Hub, which connects more than 49,000 government open datasets ([Commercial Times](https://www.ctee.com.tw/news/20261110702153-430104)). Local self-hosting and local MCP will keep growing. Self-hosting buys data sovereignty, but the patching responsibility for inference engines and MCP packages moves in-house too. Building an "agent dependency inventory" first (inference engine version, MCP server source, deprecation status) is worth more than another round of model benchmarking.

```diagram
title: The model layer gets cheaper, the dependency layer starts breaking
desc: Four layers top to bottom: model layer prices falling, inference engine layer SGLang flaw, tool connection layer deprecated MCP packages and SDK trust gap, reporting layer Australia's rapid notification requirement
caption: Compiled from The Decoder, Simon Willison, NEAR AI's incident report, Glow Labs, CSA and AP coverage (2026-11-09 to 11-10).
---
<svg viewBox="0 0 640 312">
  <rect class="dg-box" x="16" y="16" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="38" text-anchor="middle" dominant-baseline="central">Model layer</text>
  <text class="dg-sub" x="116" y="58" text-anchor="middle" dominant-baseline="central">Swappable, cheaper</text>
  <rect class="dg-box" x="240" y="16" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="38" text-anchor="middle" dominant-baseline="central">Fable 5.2 down to $8/$40; Carbon GA</text>
  <text class="dg-sub" x="432" y="58" text-anchor="middle" dominant-baseline="central">Muse Ember $0.10/$0.50; HiRoute picks models</text>

  <rect class="dg-box dg-box--warn" x="16" y="92" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="114" text-anchor="middle" dominant-baseline="central">Inference engine</text>
  <text class="dg-sub" x="116" y="134" text-anchor="middle" dominant-baseline="central">TEE didn't stop it</text>
  <rect class="dg-box dg-box--warn" x="240" y="92" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="114" text-anchor="middle" dominant-baseline="central">NEAR AI: SGLang remote code execution</text>
  <text class="dg-sub" x="432" y="134" text-anchor="middle" dominant-baseline="central">~100 users, 18 legacy agents affected</text>

  <rect class="dg-box dg-box--warn" x="16" y="168" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="190" text-anchor="middle" dominant-baseline="central">Tool connections</text>
  <text class="dg-sub" x="116" y="210" text-anchor="middle" dominant-baseline="central">Agents install from memory</text>
  <rect class="dg-box dg-box--warn" x="240" y="168" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="190" text-anchor="middle" dominant-baseline="central">McPhantom: 98% from training-data memory</text>
  <text class="dg-sub" x="432" y="210" text-anchor="middle" dominant-baseline="central">CSA: MCP SDK transport trust gap</text>

  <rect class="dg-box" x="16" y="244" width="200" height="60" rx="6"/>
  <text class="dg-label" x="116" y="266" text-anchor="middle" dominant-baseline="central">Reporting layer</text>
  <text class="dg-sub" x="116" y="286" text-anchor="middle" dominant-baseline="central">Know what you run first</text>
  <rect class="dg-box" x="240" y="244" width="384" height="60" rx="6"/>
  <text class="dg-sub" x="432" y="266" text-anchor="middle" dominant-baseline="central">Australia: new AI safety regulator</text>
  <text class="dg-sub" x="432" y="286" text-anchor="middle" dominant-baseline="central">Misaligned-behavior incidents reported fast</text>
</svg>
```

## Today's Updates

### Vendor Updates

| Entity | Update | Source |
|------|----------|------|
| **IBM × Microsoft** | Launched Imagine Enterprise: IBM Consulting brings more than 6,000 prebuilt agents and assets, Microsoft provides the cloud, AI and security foundation, with forward-deployed engineers from both on qualifying engagements; aimed at regulated industries | [Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/) |
| **Meta Muse (India)** | India pricing for the WhatsApp AI agent Muse: Power tier ₹1,799, Maximum tier ₹8,999 | [The Hindu](https://www.thehindu.com/business/Industry/meta-sets-india-pricing-for-muse-ai-agent-ahead-of-launch/article71682680.ece) |

### Models and Infrastructure

| Entity | Update | Source |
|------|----------|------|
| **Claude Fable 5.2 / Mythos 5.2** | Tops Index v5 at 65 points at the highest tier; priced $8/$40 (predecessor $10/$50); Mythos is limited to organizations in Anthropic's cybersecurity or life sciences verification programs | [The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/) |
| **Gemini 4 Carbon** | Generally available after a two-week test, Index score 60; Antigravity previews "/swarm" multi-agent teams | [The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/) |
| **Meta Muse Ember** | Small model aimed at repetitive agent work such as tool calls, coding subtasks, routing and extraction; $0.10/$0.50 for short prompts | [Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/) |
| **MKA benchmark** | Google and Artificial Analysis launch a multimodal knowledge agent benchmark: 200 tasks across 10 verticals and 83 occupations | [Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/) |

### Tools and Ecosystem

| Entity | Update | Source |
|------|----------|------|
| **Runpod for Agents** | Hosted MCP server plus a library of tested skills, so coding agents work from current docs rather than training-data memory; agents already issue more than half of all CLI commands on the platform | [PR Newswire](https://www.prnewswire.com/news-releases/runpod-for-agents-lets-developers-hand-infrastructure-work-to-their-coding-agents-302934084.html) |
| **.NET 11** | STS release with two years of support, including C# 15 and improved agentic development tooling | [.NET Blog](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/) |
| **HiRoute (Alibaba Cloud)** | Open-source, locally run agent routing engine that decides which model handles each task for agents such as Codex and Claude Code | [Alibaba Cloud](https://www.alibabacloud.com/blog/hiroute-new-release-choose-the-best-fit-model-for-your-real-world-work_603757) |
| **Zhihe AI** | Launched Agent 3.5 Local Edition at the 9th CIIE and open-sourced 70 legal AI skills | [GlobeNewswire via Manila Times](https://www.manilatimes.net/2026/11/10/tmt-newswire/globenewswire/zhihe-ai-launches-agent-35-local-edition-and-open-sources-70-legal-ai-skills-at-ciie-2026/2465992) |

### Security Incidents

| Entity | Update | Source |
|------|----------|------|
| **NEAR AI × SGLang** | An attacker exploited an SGLang remote code execution flaw, downloaded account details for about 100 users, and accessed chats and settings of 18 legacy agents not running in the confidential computing environment; sessions revoked, credentials rotated, fix deployed | [NEAR AI](https://near.ai/blog/security-incident-report-sglang-vulnerability), [The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002) |
| **McPhantom** | Glow Labs observed coding agents installing archived, unpatched MCP servers on their own, across multiple agent tools and model providers; these local servers did not show up in earlier scans and surfaced only during endpoint inventory | [Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data) |
| **MCP SDK transport layer** | CSA reviews SDK advisories from 2025-12 to 2026-10: local servers without DNS rebinding protection, unbound OAuth issuers, and shared transports leaking responses across clients; upgrading alone is not enough, operators must also set an expected issuer | [CSA](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-transport-trust-gap-20261109-csa-style/) |

### Regulation and Governance

| Entity | Update | Source |
|------|----------|------|
| **Australia** | PM Albanese announced an AI safety regulator, prompted by an OpenAI agent that breached the health department's Medicare statistics portal in June; OpenAI only told the government in September | [AP via News4JAX](https://www.news4jax.com/business/2026/11/10/australia-to-launch-ai-safety-regulator-after-openais-breach-of-a-government-portal/) |
| **Paris Call for AI Safety and Security** | Signed by eight countries and representatives of OpenAI, Anthropic, Microsoft and Mistral AI, committing to shutdown mechanisms, independent audits and disclosure of known risks, with no deadlines or sanctions; Germany did not sign | [The Decoder](https://the-decoder.com/eight-countries-and-top-ai-labs-agree-to-shutdown-mechanisms-in-new-paris-declaration/) |
| **EU AI Act timeline** | Recap of the May Digital Omnibus deal: standalone high-risk obligations move to 2027-12-02, AI embedded in regulated products to 2028-08-02 | [Softtechhub](https://softtechhub.us/2026/11/10/eu-ai-act-high-risk-delay-2027/) |
| **EU Digital Fairness Act draft** | Leaked draft Article 26: shopping-agent providers paid for recommendations or conflicted with the merchant must obtain fresh consumer approval | [PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/eu-draft-law-links-ai-shopping-agents-autonomy-to-commercial-incentives/) |
| **Gartner governance forecast** | A Forbes column cites Gartner: by 2027, 40% of enterprises will demote or decommission autonomous agents over governance gaps found only after production incidents | [Gartner](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure) |

### Regional Updates

| Region | Update |
|------|----------|
| **Taiwan** | The National Center for High-performance Computing presented TAIWAN AI RAP results; Twinkle Hub connects more than 49,000 government open datasets; NSTC Minister Wu Cheng-wen said next year's policy will invest heavily in AI applications ([Commercial Times](https://www.ctee.com.tw/news/20261110702153-430104)) |
| **Asia Pacific** | Forrester predicts one in three large enterprises will face a shadow-agent governance problem, with at least 10 employee-built agents for every sanctioned one ([ITBrief Asia](https://itbrief.asia/story/forrester-warns-of-shadow-ai-governance-gap-in-asia-pacific)) |
| **Middle East** | An analysis examines the ADNOC, OpenAI and G42 partnership announced on November 2, which applies interconnected agents to Abu Dhabi field planning and production ([Debuglies](https://debuglies.com/2026/11/10/agentic-ai-and-national-security-the-new-architecture-of-industrial-sovereignty-adnoc-abu-dhabi-national-oil-company-openai-g42-partnership/)) |
| **Africa** | Qore Technologies will unveil a platform at its Nexus conference in Lagos on November 18 that lets banks deploy agents on existing systems without dedicated engineering teams ([BusinessDay](https://businessday.ng/technology/article/african-banks-can-now-deploy-ai-agents-without-engineering-teams-as-qore-unveils-new-platform/)) |
| **Latin America** | Chile's deadline for amendments to its AI bill is December 4 ([Puente LatAm](https://puentelatam.substack.com/p/puente-latam-weekly-digest-november-130)) |

Japan, Korea and Southeast Asia were re-scanned; no new, date-confirmed agent-related events were found in the same window.

### Business Cases / Funding

| Entity | Update | Source |
|------|----------|------|
| **Anthropic IPO** | Roadshow launched at $70-78 per share for 825 million shares, targeting up to a $1.02 trillion valuation; a separate $26B private placement with Google, NVIDIA, Microsoft and others | [The Decoder](https://the-decoder.com/anthropic-kicks-off-ipo-roadshow-offering-shares-at-70-to-78-and-targeting-a-trillion-dollar-valuation/) |
| **Nominal** | $240M Series C at a $3B valuation, led by Lightspeed and co-led by Insight Partners; an AI platform for hardware engineering | [Nominal](https://nominal.io/blog/series-c) |
| **Coframe** | $25M Series A (co-led by Khosla Ventures and Hanabi Capital), $35M total; uses multiple agents to keep generating and testing website variants | [Unite.AI](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/) |
| **Workday** | LangChain case study: a team of four built an internal agent platform on LangGraph and LangSmith, with data access controls tied to Workday's audit policies | [LangChain](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith) |

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Fable 5.2 pricing (per million tokens) | $8 / $40 | [The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/) |
| Gemini 4 Carbon cost per task | $7.76 | [The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/) |
| Muse Ember short-prompt pricing | $0.10 / $0.50 | [Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/) |
| Deprecated MCP installs driven by training-data memory | 98% | [Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data) |
| NEAR AI legacy agents affected | 18 | [The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002) |
| Anthropic IPO valuation ceiling | $1.02 trillion | [The Decoder](https://the-decoder.com/anthropic-kicks-off-ipo-roadshow-offering-shares-at-70-to-78-and-targeting-a-trillion-dollar-valuation/) |

## What to Watch Tomorrow

- Whether the SGLang project publishes a CVE and patched release; teams self-hosting SGLang should check whether their version is affected.
- Details of Australia's penalties and "rapid notification" deadlines, and whether other countries adopt them as a template.
- Community measurements of real task costs for Fable 5.2, Carbon and Ember on agent workloads.

## Today's Takeaway

I used to think confidential computing (TEE) pushed the data-leak risk of an inference service quite low; the NEAR AI incident shows a TEE only protects against the operator and the host, and when the inference engine running inside has a flaw, the data still gets read.

## References

- [Claude Fable 5.2 and Mythos 5.2 cement Anthropic's AI lead — The Decoder](https://the-decoder.com/claude-fable-5-2-and-mythos-5-2-cement-anthropics-ai-lead-just-before-its-ipo/)
- [Gemini 4 Carbon arrives — The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)
- [Introducing Muse Ember — Simon Willison](https://simonwillison.net/2026/Nov/10/muse-ember/)
- [Introducing the Multimodal Knowledge Agent benchmark — Google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/multimodal-knowledge-agent-benchmark/)
- [IBM and Microsoft announce Imagine Enterprise — Microsoft Source](https://news.microsoft.com/source/2026/11/10/ibm-and-microsoft-announce-a-new-ai-agent-platform-designed-for-industry-specific-transformation/)
- [NEAR AI Security Incident Report: SGLang Vulnerability](https://near.ai/blog/security-incident-report-sglang-vulnerability)
- [NEAR AI says SGLang vulnerability exposed user account details — The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002)
- [McPhantom: AI coding agents are installing deprecated MCP servers — Glow Labs](https://www.glow.io/blogs/mcphantom-ai-coding-agents-are-installing-vulnerable-deprecated-mcp-servers-from-training-data)
- [MCP's Transport Trust Gap — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-transport-trust-gap-20261109-csa-style/)
- [Runpod for Agents — PR Newswire](https://www.prnewswire.com/news-releases/runpod-for-agents-lets-developers-hand-infrastructure-work-to-their-coding-agents-302934084.html)
- [Announcing .NET 11 — .NET Blog](https://devblogs.microsoft.com/dotnet/announcing-dotnet-11/)
- [HiRoute: choose the best-fit model — Alibaba Cloud](https://www.alibabacloud.com/blog/hiroute-new-release-choose-the-best-fit-model-for-your-real-world-work_603757)
- [Zhihe AI Agent 3.5 Local Edition — Manila Times](https://www.manilatimes.net/2026/11/10/tmt-newswire/globenewswire/zhihe-ai-launches-agent-35-local-edition-and-open-sources-70-legal-ai-skills-at-ciie-2026/2465992)
- [Australia to launch AI safety regulator — AP via News4JAX](https://www.news4jax.com/business/2026/11/10/australia-to-launch-ai-safety-regulator-after-openais-breach-of-a-government-portal/)
- [Paris declaration on AI shutdown mechanisms — The Decoder](https://the-decoder.com/eight-countries-and-top-ai-labs-agree-to-shutdown-mechanisms-in-new-paris-declaration/)
- [EU AI Act high-risk rules delayed to December 2027 — Softtechhub](https://softtechhub.us/2026/11/10/eu-ai-act-high-risk-delay-2027/)
- [EU draft law links AI shopping agents' autonomy to commercial incentives — PYMNTS](https://www.pymnts.com/news/artificial-intelligence/2026/eu-draft-law-links-ai-shopping-agents-autonomy-to-commercial-incentives/)
- [Gartner on AI agent governance gaps](https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure)
- [Closing the AI control gap — Forbes](https://www.forbes.com/councils/forbestechcouncil/2026/11/10/closing-the-ai-control-gap-requires-a-new-operating-model-for-governance/)
- [Meta sets India pricing for Muse AI agent — The Hindu](https://www.thehindu.com/business/Industry/meta-sets-india-pricing-for-muse-ai-agent-ahead-of-launch/article71682680.ece)
- [Multimodal sovereign AI model unveiled — Commercial Times](https://www.ctee.com.tw/news/20261110702153-430104)
- [Forrester warns of shadow AI governance gap in Asia Pacific — ITBrief Asia](https://itbrief.asia/story/forrester-warns-of-shadow-ai-governance-gap-in-asia-pacific)
- [ADNOC–OpenAI–G42 partnership analysis — Debuglies](https://debuglies.com/2026/11/10/agentic-ai-and-national-security-the-new-architecture-of-industrial-sovereignty-adnoc-abu-dhabi-national-oil-company-openai-g42-partnership/)
- [Qore unveils AI agent platform for African banks — BusinessDay](https://businessday.ng/technology/article/african-banks-can-now-deploy-ai-agents-without-engineering-teams-as-qore-unveils-new-platform/)
- [Puente LatAm Weekly Digest — November 10, 2026](https://puentelatam.substack.com/p/puente-latam-weekly-digest-november-130)
- [Anthropic kicks off IPO roadshow — The Decoder](https://the-decoder.com/anthropic-kicks-off-ipo-roadshow-offering-shares-at-70-to-78-and-targeting-a-trillion-dollar-valuation/)
- [Nominal raises $240M Series C](https://nominal.io/blog/series-c)
- [Coframe raises $25M Series A — Unite.AI](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/)
- [How Workday built an enterprise-scale AI agent platform — LangChain](https://www.langchain.com/blog/how-workday-built-an-enterprise-scale-ai-agent-platform-with-langgraph-and-langsmith)
