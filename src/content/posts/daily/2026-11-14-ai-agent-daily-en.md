---
title: "AI Daily — 2026-11-14"
date: 2026-11-14
category: daily
tags: [ai-agent, daily]
lang: en
description: "OpenAI wants agents to check out for you; retailers chose to block them outright instead of negotiating a cut — this fight over checkout control, not model smarts, will decide what agent commerce looks like"
tldr: "OpenAI launched ChatGPT Wallet so agents can shop and pay directly, while United, Amazon and Target banned third-party shopping agents the same week; Microsoft used AI agents to find 59 Linux kernel bugs including a 21-year-old one, and security vendors converged on giving every agent its own identity; Mirendil ($1B), Mercor ($750M) and LangChain ($300M) all closed rounds this week; the EU held its first Dublin AI summit and Australia plans a safety regulator with criminal liability for frontier AI firms; Anthropic's Claude Fable 5.2 launched 20% cheaper while Google shut down Jules without lowering subscription prices."
draft: false
series:
  name: "AI Daily"
  order: 91
---

> 🌏 [繁體中文版](/posts/daily/2026-11-14-ai-agent-daily)

## Today's Take

**OpenAI wants agents to check out on your behalf; retailers chose to block them outright instead of negotiating a cut — this fight over who controls checkout, not whose agent is smarter, will decide what agent commerce actually looks like, and Taiwanese e-commerce and fintech teams need to decide now whether to open a narrow-scope API or watch-and-block like the incumbents.**

## Deep Dive: The checkout fight is the real battlefield for agent commerce

I think the most important thread today isn't which agent is strongest — it's that "who controls checkout" has become a five-forces-style turf war. (Framework: Five Forces)

Evidence one: OpenAI launched ChatGPT Wallet, letting its "dots" agents shop and pay directly on a user's behalf, with no cut taken and rollout limited to a handful of US retailers for now. This is a new entrant trying to bypass a retailer's own checkout flow and insert itself between the consumer and the merchant — going after the transaction relationship and data that used to belong entirely to the retailer.

Evidence two: the same week, United Airlines, Amazon and Target chose to outright ban third-party AI shopping and booking agents, citing compliance risk (e.g. baggage declarations) and unwanted spending. This is retailers using their bargaining power head-on: unable to negotiate a revenue share with OpenAI's agents on technical terms, they simply lock the competitor out of the checkout page instead of sitting down to talk licensing fees.

The standoff means this market hasn't decided who is the supplier and who is the buyer: OpenAI wants to become the new transaction layer between consumers and merchants, while retailers want to remain the only party that can authorize a transaction at all. The same week's three mega-rounds — Mirendil's $1B, Mercor's $750M and LangChain's $300M — show capital is still optimistic, but that's a bet on "agents becoming default infrastructure," not a bet on who wins this checkout turf war.

What this means for builders: if your product sits in a highly regulated, authorization-sensitive vertical like retail or finance, assume large platforms will block your agent by default, and treat "negotiating direct integration with merchants" as a higher-priority business task than making your agent smarter. Taiwanese e-commerce and financial firms need to decide now: open a narrow-scope authorized API to agent traffic, or follow the international retailers and block-and-watch — the choice shapes who gets to write the local rules for agent commerce over the next year.

```diagram
title: The agent commerce turf war — OpenAI wants to be the transaction layer, retailers chose to block
desc: Left column is OpenAI's new transaction path; right column is the retailers' defensive response; the market hasn't decided who is supplier and who is buyer.
caption: Based on TechCrunch's ChatGPT Wallet report and Business Insider's list of retailers banning AI shopping agents.
---
<svg viewBox="0 0 640 300">
  <text class="dg-heading" x="160" y="28" text-anchor="middle" dominant-baseline="central">OpenAI's offense</text>
  <text class="dg-heading" x="480" y="28" text-anchor="middle" dominant-baseline="central">Retailers' defense</text>
  <line class="dg-rule" x1="320" y1="16" x2="320" y2="280"/>

  <rect class="dg-box dg-box--accent" x="76" y="56" width="168" height="56" rx="6"/>
  <text class="dg-label" x="160" y="78" text-anchor="middle" dominant-baseline="central">ChatGPT Wallet</text>
  <text class="dg-sub" x="160" y="98" text-anchor="middle" dominant-baseline="central">agent checks out directly, no cut</text>

  <rect class="dg-box dg-box--accent" x="76" y="140" width="168" height="56" rx="6"/>
  <text class="dg-label" x="160" y="162" text-anchor="middle" dominant-baseline="central">Inserts between buyer and merchant</text>
  <text class="dg-sub" x="160" y="182" text-anchor="middle" dominant-baseline="central">Captures the relationship and data</text>

  <rect class="dg-box" x="396" y="56" width="168" height="56" rx="6"/>
  <text class="dg-label" x="480" y="78" text-anchor="middle" dominant-baseline="central">Block third-party agents</text>
  <text class="dg-sub" x="480" y="98" text-anchor="middle" dominant-baseline="central">United／Amazon／Target</text>

  <rect class="dg-box" x="396" y="140" width="168" height="56" rx="6"/>
  <text class="dg-label" x="480" y="162" text-anchor="middle" dominant-baseline="central">Defends checkout and authorization</text>
  <text class="dg-sub" x="480" y="182" text-anchor="middle" dominant-baseline="central">Blocks instead of negotiating</text>

  <path class="dg-line" d="M160 112V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 112V140" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="320" y="240" text-anchor="middle" dominant-baseline="central">Whoever forces the other to concede writes the rules of agent commerce</text>
</svg>
```

## Today's Signals

### Vendor Updates

| Who | What happened | Source |
|------|----------|------|
| **OpenAI** | Launched ChatGPT Wallet, letting its "dots" agents complete purchases on a user's behalf, limited for now to a handful of US retailers, no cut taken. | [TechCrunch](https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/) |
| **Google** | Shipped Modern Web Guidance 1.0, bundling web-platform knowledge plus accessibility/performance/security checks into a coding-agent skill, already listed on Claude Code, Codex and Cursor marketplaces. | [SoftTechHub](https://softtechhub.us/2026/11/13/modern-web-guidance-1-0-ai-coding-agents/) |
| **Microsoft** | Showed off local MoE coding models running on NVIDIA RTX Spark (128GB unified memory) with no per-token billing; separately used its "Frontier Firms" cases to argue the enterprise AI bottleneck has shifted from adoption to governance. | [Microsoft Foundry Blog](https://devblogs.microsoft.com/foundry-on-windows/coding-ai-on-windows-pcs-quality-efficiency/) |

### Models & Infrastructure

| Who | What happened | Source |
|------|----------|------|
| **Anthropic** | Claude Fable 5.2 / Mythos 5.2 launched to replace 5.1: 30% faster output, API prices cut 20% to $8/$40 per 1M tokens, FrontierSWE v2 at 69.9% — see the [model card](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2). | internal |

### Security Incidents

| Who | What happened | Source |
|------|----------|------|
| **Microsoft Research** | Used AI agents plus human verification to find 59 Linux kernel vulnerabilities, one of them 21 years old; the same week OpenAI's GPT-6 Cyber reported 81 high-severity Firefox bugs — AI-assisted vulnerability hunting is accelerating. | [CSO Online](https://www.csoonline.com/article/4247815/ai-found-linux-kernel-bugs-that-remained-undetected-for-decades.html) |
| **OpenAI Codex** | A prompt-injection chain through a GitHub Actions flaw reached signing access for the official npm package; already patched with a bounty paid out — see the [security alert](/posts/daily/2026-11-14-security-codex-npm-supply-chain-prompt-injection). | internal |
| **Security industry consensus** | Multiple security vendors converged on the same stance: every agent needs its own identity, least privilege, and individually revocable access, or delegated authorization quietly widens in scope. | [Nudge Security](https://www.nudgesecurity.com/post/ai-agent-identity) |

### Regulation & Governance

| Who | What happened | Source |
|------|----------|------|
| **Australia** | Plans a dedicated AI safety regulator with criminal liability for frontier AI firms whose systems cause harm, prompted by an unreported OpenAI agent incident on Medicare's portal. | [CASRAI](https://casrai.org/news/australia-ai-safety-regulator-frontier-ai-2026) |
| **EU** | Council held its first dedicated AI summit in Dublin, covering sovereign compute, Chips Act 2.0 and security, against a backdrop of rogue-agent incidents and Nvidia leadership turmoil; a new guidance map confirms the AI Act already covers agents despite having no explicit "agent" category, and clarifies provider/deployer responsibility. | [FinChannel](https://finchannel.com/eu-leaders-put-ai-sovereignty-computing-capacity-and-safeguards-on-dublin-agenda/141447/world-2/europe/2026/11/) |
| **Hong Kong** | Industry is pushing for clearer agent accountability rules while HKMA launches Project SAGE to study authorization and regulation for agentic finance. | [SCMP](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable) |
| **China** | MIIT brought AI agents preinstalled on phones, tablets and wearables under telecom market-entry regulation. | [Chinascope](https://chinascope.org/archives/41598) |
| **US** | Nonprofits sued tech giants in a California court to halt training of "catastrophic"-risk AI models; public-sector unions won AI retraining and anti-sole-cause-termination protections the same week. | [Al Jazeera](https://www.aljazeera.com/news/2026/11/12/us-nonprofits-sue-tech-giants-to-halt-ai-development) |
| **Global governance scan** | Digital Policy Alert's review of 84 national AI laws and 9 international frameworks found 10 shared concerns, with transparency and safety assessment the most common. | [Digital Policy Alert](https://digitalpolicyalert.org/report/global-view) |

### Regional Watch

| Region | What happened |
|------|----------|
| **Southeast Asia** | WSJ reports the US is weighing tighter licensing and disclosure rules on AI-chip exports to Malaysia, Thailand, Indonesia and Singapore to block transshipment to China. |
| **India / South Asia** | IndiaAI Mission faces compute and funding gaps; GSMA opened up to £250K AI-finance grants to startups in Pakistan, Bangladesh, Sri Lanka and Nepal. |
| **Middle East** | Saudi Arabia saw over $5.1B in AI/startup deals in a single week, concentrating Gulf capital in the Kingdom; MENA enterprises plan 10%+ of revenue for AI but policy uncertainty delays roughly one in nine projects; Qatar added new partnerships to its regional AI hub push. |
| **Africa** | Kenya's High Court ordered the government to pass AI legislation within six months while readying a $500M startup fund; a GIZ/Briter survey of 311 African AI ventures found a median raise of just $225K with only 15% profitable; Kenyan startup Satlyt landed an $8M seed round and a spot in Google's first Africa AI Futures Fund lab cohort. |
| **Latin America** | CEPAL/CENIA data shows the region accounts for 14% of global AI app traffic, yet 85% of local tech firms already use agents while only 22% validate the financial impact — adoption is outrunning regulation. |
| **Oceania** | Australia's AI safety regulator plan is covered above; a New Zealand report says banks must rebuild around individually-identified agents instead of shared service accounts. |

### Business Cases / Funding

| Who | What happened | Source |
|------|----------|------|
| **Mirendil / Mercor / LangChain** | Closed a $1B Series A, $750M Series D and $300M Series C (at a $3B valuation) in the same week — agentic AI infrastructure remained this week's biggest capital draw. | [Crunchbase](https://news.crunchbase.com/venture/biggest-startup-funding-rounds-agentic-ai-infrastructure-mirendil-mercor/) |
| **Cohere** | Acquired AISLE and cubic, extending its sovereign AI platform into cyber defense and secure software development. | [Cohere Blog](https://cohere.com/blog/cohere-expands-sovereign-ai-platform-aisle-cubic) |
| **Bay / Kindo / Nebuly** | Agent security, governance and value-measurement startups each closed a round the same day ($50M / $57.6M cumulative / $21M) — see [Bay](/posts/daily/2026-11-14-funding-bay-en), [Kindo](/posts/daily/2026-11-14-funding-kindo-en), [Nebuly](/posts/daily/2026-11-14-funding-nebuly-en). | internal |
| **Agile Robots** | Raised a SoftBank-led $500M Series F at an $8.5B valuation, targeting physical AI in logistics, automotive and electronics manufacturing. | [SiliconANGLE](https://siliconangle.com/2026/11/12/agile-robots-raises-500m-funding-led-by-softbank-at-8-5b-valuation/) |
| **Natera** | Built an agentic lab-ops system called SWARM on Amazon Bedrock AgentCore, cutting first-response time roughly 130x. | [AWS Blog](https://aws.amazon.com/blogs/machine-learning/how-natera-designed-an-agentic-ai-system-for-lab-ops-with-amazon-bedrock-agentcore/) |
| **Retailer pushback** | United, Amazon and Target banned third-party AI shopping/booking agents, directly colliding with OpenAI's agent-commerce push (see Deep Dive). | [Business Insider](https://www.businessinsider.com/list-companies-banning-ai-agents-retail-travel-united-amazon-target-2026-11) |

### Pricing & API Lifecycle

| Who | What happened | Source |
|------|----------|------|
| **Google** | Shut down the Jules coding agent (read-only from 11/11, fully off 12/31); Google AI Pro/Ultra subscription prices stay the same even though the bundled coding benefit disappears — see the [pricing tracker](/posts/daily/2026-11-14-pricing-google-jules-coding-agent-shutdown-en). | internal |
| **US federal agencies** | GAO's chief scientist warned that introductory AI pricing deals are expiring, and without better token-usage management, federal AI use could slow sharply within 8-10 months. | [ExecutiveGov](https://www.executivegov.com/articles/federal-agencies-ai-token-cost-management-gao) |

### Technical Progress

Today's Arxiv Digest focuses on the gap between agents "looking governed" and what's actually happening: guardscope found that 5 of 15 execution paths in enterprise agent deployments — including Microsoft's own governance tooling — are bypassable under any deployment design; a tau2-bench evaluation study found LLM judges missed 10 of 11 confirmed policy-violating writes that a model-free rule check caught every time; and Breaking Bad found a "task going wrong" signal in internal activations that rises before reward hacking occurs. See today's [Arxiv Digest](/posts/daily/2026-11-14-ai-agent-arxiv-digest-en).

The GitHub ecosystem's signal is "writing code to call tools" (Code Mode) surfacing independently in Claude Code v2.1.323, the UTCP community's code-mode library, and Vercel's new framework eve — the traditional turn-by-turn tool-calling loop is being displaced. See today's [GitHub Digest](/posts/daily/2026-11-14-ai-agent-github-digest-en).

Mastra's @mastra/core v1.83.0 gives every Agent a resumable stream and a built-in MCP endpoint, but also splits the "durable" option into separate "stream resumption" and "crash-resilient durable execution" concepts — see the [framework update](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0-en).

Other open-source signals: AI2 and Hugging Face co-released XYBench, an 8,115-question benchmark testing whether LLMs can spot flawed premises behind a user's request; local inference engine llama.cpp hit v1.0.0, seen as a major stability milestone for the local AI ecosystem; Alibaba Cloud's open-source AI Agent Handbook passed 3,000 GitHub stars.

### Tools & Ecosystem

| Who | What happened | Source |
|------|----------|------|
| **AWS** | Open-sourced the Universal Agent Evaluation Framework (UAEF) under Apache 2.0, standardizing cross-framework agent grading and hardening its judge model against prompt injection. | [TechTimes](https://www.techtimes.com/articles/330523/20261112/aws-open-sources-ai-agent-evaluation-framework-that-hardens-its-ai-grader-against-prompt-injection.htm) |
| **ha-mcp** | A community-maintained Home Assistant MCP server with 87 tools and 7,700+ stars, covering automation/dashboard/HACS maintenance the official integration can't reach — see the [tool recommendation](/posts/daily/2026-11-14-tool-ha-mcp-en). | internal |

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Linux kernel bugs Microsoft found | 59 (incl. 1 bug 21 years old) | [CSO Online](https://www.csoonline.com/article/4247815/ai-found-linux-kernel-bugs-that-remained-undetected-for-decades.html) |
| Mirendil Series A | $1B | [Crunchbase](https://news.crunchbase.com/venture/biggest-startup-funding-rounds-agentic-ai-infrastructure-mirendil-mercor/) |
| Claude Fable 5.2 API price cut | -20% ($8/$40 per 1M tokens) | internal model card |
| This week's Middle East AI/startup deal volume | $5.1B | [entARABI](https://entarabi.com/en/2026/11/5-1-billion-dollars-in-a-week-how-did-saudi-arabia-become-a-hub-for-gulf/) |
| ha-mcp GitHub stars | 7,700+ | internal tool post |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-github-digest-en)
- 📄 [Model Card: Claude Fable 5.2](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2-en)
- 📄 [Security Alert: Codex npm supply-chain prompt injection](/posts/daily/2026-11-14-security-codex-npm-supply-chain-prompt-injection-en)
- 📄 [Framework Update: Mastra @mastra/core v1.83.0](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0-en)
- 📄 [Funding: Bay Series A $37M](/posts/daily/2026-11-14-funding-bay-en)
- 📄 [Funding: Kindo $30M growth round](/posts/daily/2026-11-14-funding-kindo-en)
- 📄 [Funding: Nebuly Series A $21M](/posts/daily/2026-11-14-funding-nebuly-en)
- 📄 [Pricing Watch: Google shuts down Jules](/posts/daily/2026-11-14-pricing-google-jules-coding-agent-shutdown-en)
- 📄 [Tool of the Day: ha-mcp](/posts/daily/2026-11-14-tool-ha-mcp-en)
- 📄 [AI Engineer Interview Prep](/posts/daily/2026-11-14-ai-interview-daily-en)
- 📄 [Product Builder Interview Prep](/posts/daily/2026-11-14-product-builder-interview-daily-en)

## Watching Tomorrow

- Whether the retailer bloc (United/Amazon/Target) escalates to regulatory action or shifts toward negotiating licensed API access and revenue share as OpenAI expands ChatGPT Wallet's retailer list.
- Whether Australia's final AI safety regulator bill keeps the criminal-liability threshold, and how fast other markets follow.
- Whether AI-assisted vulnerability hunting at Microsoft/OpenAI's scale produces a matching wave of attacker-side abuse.

## Today's Realization

I used to think the bottleneck for agent commerce was mostly "is the agent smart enough to complete a purchase flow." Writing this, I realized the real bottleneck is "who has the authority to decide on the merchant's behalf" — that's a question of commercial authorization and bargaining power, not a technical one. And the fact that retailers chose to block outright rather than sit down and negotiate a licensing fee shows this fight is still being fought with the bluntest tool available.

## References

- [AI Agent Arxiv Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-11-14](/posts/daily/2026-11-14-ai-agent-github-digest-en)
- [OpenAI launches ChatGPT Wallet — TechCrunch](https://techcrunch.com/2026/11/13/chatgpts-new-wallet-lets-ai-agents-shop-and-check-out-for-you/)
- [Retailers banning AI shopping agents — Business Insider](https://www.businessinsider.com/list-companies-banning-ai-agents-retail-travel-united-amazon-target-2026-11)
- [AWS open-sources UAEF — TechTimes](https://www.techtimes.com/articles/330523/20261112/aws-open-sources-ai-agent-evaluation-framework-that-hardens-its-ai-grader-against-prompt-injection.htm)
- [Google Modern Web Guidance 1.0 — SoftTechHub](https://softtechhub.us/2026/11/13/modern-web-guidance-1-0-ai-coding-agents/)
- [Microsoft AI found Linux kernel bugs — CSO Online](https://www.csoonline.com/article/4247815/ai-found-linux-kernel-bugs-that-remained-undetected-for-decades.html)
- [Natera SWARM on Bedrock AgentCore — AWS Blog](https://aws.amazon.com/blogs/machine-learning/how-natera-designed-an-agentic-ai-system-for-lab-ops-with-amazon-bedrock-agentcore/)
- [Mirendil/Mercor/LangChain funding recap — Crunchbase](https://news.crunchbase.com/venture/biggest-startup-funding-rounds-agentic-ai-infrastructure-mirendil-mercor/)
- [Agile Robots $500M Series F — SiliconANGLE](https://siliconangle.com/2026/11/12/agile-robots-raises-500m-funding-led-by-softbank-at-8-5b-valuation/)
- [AI agent identity consensus — Nudge Security](https://www.nudgesecurity.com/post/ai-agent-identity)
- [Hong Kong agent accountability and Project SAGE — SCMP](https://www.scmp.com/news/hong-kong/article/3374119/when-ai-agents-go-rogue-who-can-hong-kong-hold-accountable)
- [China MIIT regulates preinstalled agents — Chinascope](https://chinascope.org/archives/41598)
- [US weighs Southeast Asia AI-chip export rules — The Standard](https://www.thestandard.com.hk/innovation/article/348455/Nvidia-fallout-throws-spotlight-on-Southeast-Asias-AI-boom)
- [India's sovereign AI challenge — Shafaqna](https://en.shafaqna.com/491273/can-india-turn-its-sovereign-ai-ambitions-into-reality/)
- [GSMA AI-finance grants for Pakistan — ProPakistani](https://propakistani.pk/2026/11/13/gsma-grants-pakistani-startups-ai-finance/)
- [EU AI Act agent definition map — NHIMG](https://nhimg.org/eu-ai-act-agentic-ai-requirements-map)
- [EU Dublin AI summit — FinChannel](https://finchannel.com/eu-leaders-put-ai-sovereignty-computing-capacity-and-safeguards-on-dublin-agenda/141447/world-2/europe/2026/11/)
- [MENA enterprise digital investment survey — PR Newswire](https://www.prnewswire.com/news-releases/mena-enterprises-plan-major-digital-investment-but-policy-barriers-delay-projects-for-one-in-nine-302938893.html)
- [Saudi Arabia's $5.1B week — entARABI](https://entarabi.com/en/2026/11/5-1-billion-dollars-in-a-week-how-did-saudi-arabia-become-a-hub-for-gulf/)
- [Qatar's regional AI hub push — The Peninsula Qatar](http://thepeninsulaqatar.com/article/13/11/2026/qatar-poised-to-strengthen-regional-ai-leadership-through-global-tech-partnerships)
- [Kenya court orders AI legislation — Africa AI News](https://www.africaainews.com/p/kenya-high-court-orders-ai-laws-kenya)
- [African AI venture funding survey — WeeTracker](https://weetracker.com/2026/11/13/africa-ai-costs-foreign-cloud-bills/)
- [Kenya's Satlyt joins Google AI Futures Fund — Dealroom](https://app.dealroom.co/news/note/kenya-s-satlyt-makes-google-s-first-africa-ai-lab-after-8m-raise)
- [Latin America AI adoption outruns regulation — Revista Economía](https://www.revistaeconomia.com/america-latina-la-ia-ya-avanzo-mas-rapido-que-la-regulacion/)
- [85% of LatAm tech firms use agents — Revista Economía](https://www.revistaeconomia.com/el-85-de-las-tecnologicas-en-america-latina-ya-utiliza-agentes-de-ia-pero-solo-el-22-valida-su-impacto-financiero/)
- [Australia's AI safety regulator — CASRAI](https://casrai.org/news/australia-ai-safety-regulator-frontier-ai-2026)
- [New Zealand bank agent governance report — ITBrief NZ](https://itbrief.co.nz/story/banks-must-rebuild-around-governed-ai-agents-report)
- [Microsoft NVIDIA RTX Spark coding — Microsoft Foundry Blog](https://devblogs.microsoft.com/foundry-on-windows/coding-ai-on-windows-pcs-quality-efficiency/)
- [Cohere acquires AISLE and cubic — Cohere Blog](https://cohere.com/blog/cohere-expands-sovereign-ai-platform-aisle-cubic)
- [XYBench — Allen Institute](https://allenai.org/blog/xybench-helping-with-the-problem-behind-the-question)
- [llama.cpp v1.0.0 — Hugging Face Blog](https://huggingface.co/blog/llama-cpp-v1)
- [Alibaba Cloud's AI Agent Handbook passes 3,000 stars — Alibaba Cloud Blog](https://www.alibabacloud.com/blog/alibaba-clouds-open-source-ai-agent-handbook-3k-github-stars)
- [Microsoft's Frontier Firms governance observations — Microsoft Blog](https://blogs.microsoft.com/blog/2026/11/12/scaling-ai-value-without-losing-control-lessons-from-frontier-firms/)
- [Digital Policy Alert global governance report](https://digitalpolicyalert.org/report/global-view)
- [US federal agency AI pricing — ExecutiveGov](https://www.executivegov.com/articles/federal-agencies-ai-token-cost-management-gao)
- [US nonprofits sue to halt training — Al Jazeera](https://www.aljazeera.com/news/2026/11/12/us-nonprofits-sue-tech-giants-to-halt-ai-development)
- [US public-sector union AI protections — The Guardian](https://www.theguardian.com/technology/2026/nov/12/us-workers-governments-unions-ai)
