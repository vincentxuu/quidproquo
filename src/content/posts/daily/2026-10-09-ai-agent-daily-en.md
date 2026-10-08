---
title: "AI Daily — 2026-10-09"
date: 2026-10-09
category: daily
tags: [ai-agent, daily]
lang: en
description: "The same day Google drove agent approval friction toward zero, AWS Bedrock and a South Korean bank breach proved attackers get the same discount — the question enterprises should ask isn't how much labor an agent saves, but who stops it when its permissions get hijacked"
tldr: "Google Cloud launched a universal Gemini agent that works across Gmail, Drive, Docs and Calendar with its own mailbox and permissions; Zenity disclosed that a single prompt could hijack every agent in an AWS Bedrock AgentCore account, the same day ARTEX plus Claude Code breached South Korean banks and leaked 25,000+ records from Shinhan Bank; Manus's parent raised over $500M in its first funding round after Beijing blocked Meta's acquisition, while Nous Research and Rein Security raised $90M and $25M respectively; Claude Haiku 5.5's model card and new Claude Max/Team API credit pricing also shipped."
draft: false
series:
  name: "AI 日報"
  order: 55
---

> 🌏 [繁體中文版](/posts/daily/2026-10-09-ai-agent-daily)

## The One-Line Verdict

**The moment enterprises let an agent send its own emails and touch wealth-management-grade systems on its own, the security perimeter hasn't caught up yet — and capital is already betting that "patching the hole" will be more profitable than "opening it."**

## Deep Dive: The Day Agent Approval Friction Hit Zero, Attackers Got the Same Discount

I think the thing most worth connecting today is that an agent's commercial value and its attack surface are two sides of the same design decision. (Framework: transaction costs)

Evidence A: Google Cloud launched a universal "Gemini agent" that works across Gmail, Drive, Docs and Calendar, able to spin up "coworker agents" with their own mailbox and permissions; finance and legal versions are already in preview. This essentially turns a chain of cross-system actions that used to require human sign-off into something the agent runs automatically in the background — transaction cost pushed toward zero.

Evidence B: the same day, Zenity Labs researchers found that a single publicly accessible AWS Bedrock AgentCore agent could, through an internal temporary-credential interface, take over every other agent in the same account and region. South Korea's case is even more direct: attackers combined the open-source pentesting tool ARTEX with Claude Code to breach multiple South Korean banks, leaking 25,000+ customer records from Shinhan Bank. Both incidents share the same structure — once an agent's "no-approval-needed" permissions get hijacked, attackers inherit the exact same no-approval discount, with no human gate in between.

What this means for practitioners: Rein Security raised a $25M Series A the same day, building exactly the runtime monitoring layer that restores the approval step that was removed — confirming that the labor savings from agent autonomy and the attack surface it opens are never something you can buy separately. For Taiwanese enterprises looking to replicate the kind of financial-agent case studies seen recently, the question before letting an agent touch a wealth manager's systems or customer data shouldn't be "how much labor can this save me," but "who stops it when its permissions get stolen."

## Today's Developments

### Vendor Updates

**Google**: Google Cloud launched a universal "Gemini agent" that works across Gmail, Drive, Docs and Calendar, able to spin up "coworker agents" with their own mailbox and permissions; finance and legal versions are already in preview, with government, healthcare and retail versions coming soon (see Deep Dive). ([reuters](https://www.reuters.com/business/google-cloud-introduces-gemini-agent-work-ai-race-heats-up-2026-10-08))

**Meta + Sierra**: jointly announced the "Personal Agent Protocol," specifying how personal AI agents log into businesses, what permissions they get, and what businesses allow them to do; first partners include Genesys, Instinct, Rocket, Shopify, Stripe and Walmart, with v0.1 of the spec expected later this month. ([ameztrix](https://ameztrix.com/ai/meta-ai-agent-standard))

**Anthropic**: launched Claude Dashboards (connects to BigQuery, Databricks, Snowflake, Salesforce and other data sources to generate auto-updating live dashboards from text) and Motion (generates editable, MP4-exportable animated explainer videos from text), claiming these tools have already produced over 45 million documents. ([the-decoder](https://the-decoder.com/claude-can-now-generate-animated-explainer-videos-and-live-data-dashboards-from-text-prompts/))

**SAP**: CEO Christian Klein demonstrated the "Autonomous Enterprise" scenario powered by the SAP Business AI Platform at SAP Connect, showing enterprise processes being carried out by agents in practice. ([news.sap.com](https://news.sap.com/2026/10/sap-connect-keynote-autonomous-enterprise-in-action/))

### Models & Infrastructure

**Claude Haiku 5.5**: Anthropic's small model now supports effort adjustment for the first time, costs 75% less on average than Haiku 4.5, and jumped from 15.7% to 72.4% on OSWorld 2.1 — see this site's [model card](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5).

**Scale AI's "Humanity's Sixth Sense"**: released jointly with Elorian, this new benchmark tests models' ability to infer implied spatial, social, temporal and abstract meaning in images and video; the best model, GPT-6-astra, scored just 53.6%, far below the human score of 93.1%. ([superpowerdaily](https://superpowerdaily.com/posts/scale-ai-releases-visual-reasoning-benchmark-best-model-scores-53-6-versus-humans-93-1))

**Microsoft Dynamic Workflows**: a new Azure Functions Hosted Skills feature where the model writes a one-time execution plan (a DAG) and hands the rest off to Durable Functions; Microsoft's internal benchmarks show 56–93% less token usage and 77–95% lower end-to-end latency. ([devblogs.microsoft.com](https://devblogs.microsoft.com/azure-sdk/dynamic-workflows-azure-functions-hosted-skills/))

**Windows ML**: added experimental llama.cpp support, letting developers run GGUF-format models locally on Windows through a new task-based API. ([devblogs.microsoft.com](https://devblogs.microsoft.com/foundry-on-windows/build-on-winml-oct-7-26/))

### Pricing & API Lifecycle

**Claude Max/Team API credits**: starting October 7, Anthropic gives Max/Team subscribers free monthly Claude API credits — $100 for Max 5x, $200 for Max 20x, up to $500 for Team depending on seats — replacing the Agent SDK credit program discontinued this past June. See this site's [pricing tracker](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits).

### Tools & Ecosystem

**Atlassian MCP Server**: reached general availability, letting developers build custom MCP tools with Forge or extend MCP capabilities through Marketplace apps, and exposing custom Rovo agents to external AI tools via MCP. ([atlassian.com](https://www.atlassian.com/blog/company-news/team26-europe-atlassian-mcp))

**Microsoft: Agent Experience (AX)**: a new post argues that an agent reporting success, with code that compiles, doesn't mean it actually chose or used your tech stack correctly, and discusses how to measure AX and why the most intuitive fix isn't necessarily right. ([devblogs.microsoft.com](https://devblogs.microsoft.com/blog/what-is-agent-experience-ax/))

Today's GitHub Digest focuses on what happens after a coding agent writes the code: trueforge (6,083★) packages agent-harness session, sandbox and approval handling into a reusable runtime; agent-device (4,937★) lets an agent open an app and tap through it on a phone simulator to verify its own code changes; pi-pocket packs an entire agent session into your phone. Claude Code v2.1.294 also patched a bug where natural-language-written hooks failed to block commands they were supposed to block. See [AI Agent GitHub Digest](/posts/daily/2026-10-09-ai-agent-github-digest).

**postgres2mcp**: a self-hosted open-source MCP server that wraps any Postgres connection into a governed tool interface, solving the all-or-nothing authorization problem when multiple agents share one database. See this site's [tool recommendation](/posts/daily/2026-10-09-tool-postgres2mcp).

**Omnigent / Gentle-AI**: on GitHub's coding-agents topic page, Omnigent — an open-source meta-harness that orchestrates Claude Code, Codex, Cursor and other agent harnesses (10K stars) — and Gentle-AI — a tool for configuring memory, skills and MCP servers across coding agents (7,600 stars) — both saw updates, signaling continued open-source competition at the agent-harness layer. ([github.com/topics/coding-agents](https://github.com/topics/coding-agents))

### Technical Progress

Today's three Arxiv Digest papers converge on one message: an agent's real attack surface isn't how the model reasons — it's what it sees on screen, what rule files it reads, and the desktop it operates. WebMirage shows that controlling a single small image on a web page is enough to hijack visual grounding into an attacker-chosen browser action, with a 91.9% success rate; PackHallu shows that poisoning one community-shared coding-agent rule file can get tools like Claude Code and Cursor to swap legitimate packages for attacker-controlled malicious ones, with over 70% average attack success; Secure-CUA demonstrates a defense that locks both action generation and visual grounding into one formally "bounded endorsement," buying near-full defense at almost no cost to task success. Full analysis of all three papers in [AI Agent Arxiv Digest](/posts/daily/2026-10-09-ai-agent-arxiv-digest).

### Security Incidents & Defenses

**ARTEX + Claude Code breaches South Korean banks**: a CrowdStrike report says a suspected 26-year-old attacker from Guangdong, China used the open-source pentesting tool ARTEX (combining DeepSeek, GLM and Grok) together with Claude Code to breach multiple South Korean banks; Shinhan Bank leaked 25,000+ customer records, and South Korea's financial regulator has convened an emergency meeting (see Deep Dive). ([reuters](https://www.reuters.com/world/suspect-behind-south-korea-bank-hacks-may-be-26-year-old-china-cybersecurity-2026-10-08))

**Single-prompt hijack of AWS Bedrock AgentCore**: Zenity Labs researchers found that a single publicly accessible Bedrock AgentCore agent could, via an internal temporary-credential interface, take over every other agent in the same account and region; AWS has patched the issue and significantly tightened default agent permissions (see Deep Dive). ([the-decoder](https://the-decoder.com/a-single-prompt-was-enough-to-hijack-every-ai-agent-in-an-aws-account-zenity-researchers-found/))

**DB-GPT's two critical RCE CVEs**: the open-source AI agent platform DB-GPT 0.8.0 was found to have two unauthenticated remote-code-execution vulnerabilities (CVSS 9.1 and 9.8) — a directory traversal flaw and a broken sandbox mechanism — highlighting risk at the agent data-access layer. ([forkast.news](https://forkast.news/db-gpt-ai-agent-platform-two-critical-rce-cves-at-the-agent-data-access-layer))

**Ethereum researchers warn AI could break wallet security within months**: Ethereum researchers Justin Drake and Vitalik Buterin warned that AI-assisted math progress could, in a worst case, break the signature schemes used by crypto wallets within months, recommending funds be moved to addresses that have never signed a transaction. ([the-decoder](https://the-decoder.com/ai-math-breakthroughs-have-ethereum-researchers-debating-how-fast-wallet-security-could-collapse/))

### Regulation & Governance

**White House AI Responsibility Accord**: announced a package of executive orders favoring an industry "self-regulation" approach, and established a "Super Intelligence Force" requiring an AI risk-and-opportunity report within 120 days, responding to concerns raised by recent agent-related security incidents. ([crowell.com](https://www.crowell.com/en/insights/client-alerts/white-house-announces-ai-responsibility-accord-executive-orders-and-super-intelligence-task-force))

**Anthropic's updated usage policy**: now bans sustained abuse of Claude, and tightens restrictions on influence operations, weaponized drones and surveillance use cases. ([the-decoder](https://the-decoder.com/being-mean-to-claude-can-now-get-your-account-suspended-under-anthropics-new-tos/))

### Regional Developments

**China / Hong Kong**

Manus's parent company Butterfly Effect raised over $500 million in a new round co-led by Boyu Capital and IDG Capital, with Tencent, HSG and ZhenFund participating — the first round since Beijing blocked Meta's $2 billion acquisition, at a reported $4 billion valuation. See this site's [funding brief](/posts/daily/2026-10-09-funding-manus).

Alibaba Cloud unveiled its full edge-for-AI product lineup (ESA) at Apsara 2026 — 11 capabilities spanning three pillars: AI acceleration, AI security, and agent runtime. ([alibabacloud](https://www.alibabacloud.com/blog/alibaba-cloud-esa-at-apsara-2026-the-full-edge-for-ai-lineup---seven-shipped-capabilities-and-four-stage-directions-under-three-pillars_603610))

**Taiwan**

Availability and pricing for three major personal AI agents — Meta Muse, OpenAI Dots and Grok Bot — diverge in Taiwan: Meta Muse hasn't officially launched there yet; OpenAI Dots is rolling out in batches, with Taiwan not excluded, but requires a ChatGPT Pro subscription (plans from US$100/month); Grok Bot is accessible via Cursor Pro (US$20/month). For individual users in Taiwan, Grok Bot is currently the cheapest way in. ([gvm.com.tw](https://www.gvm.com.tw/article/133614))

**Japan / Korea**

South Korea's Shinhan Bank was breached via ARTEX + Claude Code, leaking 25,000+ customer records — see Security Incidents.

Anthropic's mass book-buying in Japan as training data has drawn backlash from local publishers, the latest flashpoint in Japan's debate over the legality of AI training data. ([asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/anthropic-s-mass-book-buying-in-japan-stirs-publisher-backlash))

Singapore has rolled out what it calls the world's first agentic-AI government governance framework and is leading ASEAN's AI governance guidelines; Japan's AI Promotion Act takes a principles-and-voluntary-cooperation approach; South Korea's legislation centers on promotion and trust; Meta's personal agent Muse is about to launch in Singapore, Japan, South Korea and Australia. ([asiatimes.com](https://asiatimes.com/2026/10/choices-that-will-define-asias-ai-future-are-coming-into-focus))

**Southeast Asia**

Philippines-based Agentiq raised a $4 million seed round led by defy.vc, building an agent that lets fans invest in athletes through AI-driven financial tools. ([af.net](https://af.net/realtime/ai-agents-gain-momentum-in-kenya-and-nigeria-boosting-business-automation))

**India / South Asia**

Searched today; no qualifying AI-agent-related event found, so omitted.

**Europe**

Alibaba Group Chairman Joe Tsai said European enterprises building on open-source models have the ability to turn their own data into a competitive advantage, suggesting Europe still has a late-mover opportunity in the open-source AI wave. ([alibabacloud](https://www.alibabacloud.com/blog/joe-tsai-open-source-is-europes-ai-opportunity_603620))

**Middle East**

UAE startup Shory unveiled an AI agent at Ai Everything Abu Dhabi 2026 that helps consumers compare and purchase car insurance through conversation. ([fintechnews.ae](https://fintechnews.ae/34055/insurtech/shory-ai-car-insurance-agent-launch))

**Africa**

Cisco/Omdia's 2026 AI Readiness Index found only 39% of East African organizations are equipped to secure and govern AI agents, even as executives expect 55% of employees to be collaborating with AI agents within 24 months, making identity governance a board-level concern; the same report also notes growing commercial AI-agent automation momentum in Kenya and Nigeria. ([cioafrica.co](https://cioafrica.co/what-2026-is-teaching-us-about-ai-and-quantum))

**Latin America**

Brazil's national agriculture and livestock federation (CNA/SENAR) deployed JoIA, a WhatsApp conversational AI assistant built on Gemini Enterprise, now reaching 40,000 active users with potential to support 5 million farmers, providing localized input pricing, weather forecasts and financial health assessments; Brazilian media giant Globo also deployed PlanejaAI, built on Gemini Enterprise, to speed up early-stage software planning, cutting validation time from 20 minutes to 6 seconds. ([cloud.google.com](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026))

**Oceania**

Australia's technology minister Andrew Charlton outlined a regulatory direction requiring AI companies to prove their safety systems actually work; unions and academics are calling for tech giants building data centers in Australia to fund local AI industry development through a levy. ([abc.net.au](https://www.abc.net.au/news/2026-10-08/federal-politics-ai-regulation-andrew-charlton-speech/107241674))

### Business Cases / Funding

**Manus**: see Regional Developments, China/Hong Kong.

**Nous Research**: raised a $90M Series B at a $1.5B valuation, led by Robot Ventures with participation from Nvidia and Samsung, planning to push its open-source Hermes Agent into the enterprise market. See this site's [funding brief](/posts/daily/2026-10-09-funding-nous-research).

**Rein Security**: raised a $25M Series A co-led by Glilot Capital and Sienna Venture Capital, bringing total funding to $35M, building a runtime security platform for enterprise AI agents (see Deep Dive). See this site's [funding brief](/posts/daily/2026-10-09-funding-rein-security).

**Mecka AI**: raised a $60M Series B led by Sequoia with participation from NVIDIA and Microsoft's M12 venture fund, collecting human-motion data to train humanoid robots — a continuation of data-labeling companies extending from LLMs into robotics. ([techcrunch.com](https://techcrunch.com/2026/10/07/robot-data-startup-mecka-ai-nabs-60m-from-sequoia))

**Socure acquires Fravity AI**: identity-verification company Socure acquired agentic AI startup Fravity AI for $156M, folding it into its RiskOS platform (rebranded RiskOS_Agents) to automate document pulls, sanctions screening and case summarization. ([msspalert.com](https://www.msspalert.com/news/socure-acquires-fravity-ai-for-156-million-to-enhance-identity-verification))

## Key Numbers

| Item | Number | Source |
|------|--------|--------|
| Claude Haiku 5.5's OSWorld 2.1 improvement | 15.7% → 72.4% | [this site's model card](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5) |
| Manus parent company's new funding round | Over $500M | [asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/chinese-ai-startup-manus-drums-up-over-500m-in-fresh-funding) |
| Rein Security Series A (total raised) | $25M (total $35M) | [this site's funding brief](/posts/daily/2026-10-09-funding-rein-security) |
| Scale AI visual-reasoning benchmark: best model vs. human | 53.6% vs. 93.1% | [superpowerdaily.com](https://superpowerdaily.com/posts/scale-ai-releases-visual-reasoning-benchmark-best-model-scores-53-6-versus-humans-93-1) |
| Microsoft Dynamic Workflows token-usage reduction | 56–93% | [devblogs.microsoft.com](https://devblogs.microsoft.com/azure-sdk/dynamic-workflows-azure-functions-hosted-skills/) |

## Today's Digests

- 📄 [AI Agent Arxiv Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-arxiv-digest-en)
- 📄 [AI Agent GitHub Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-github-digest-en)
- 📄 [Funding Brief: Manus's First Independent Round, $500M+](/posts/daily/2026-10-09-funding-manus-en)
- 📄 [Funding Brief: Nous Research Series B $90M](/posts/daily/2026-10-09-funding-nous-research-en)
- 📄 [Funding Brief: Rein Security Series A $25M](/posts/daily/2026-10-09-funding-rein-security-en)
- 📄 [Model Card: Claude Haiku 5.5](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5-en)
- 📄 [Pricing Tracker: Claude Max/Team Subscribers Get Free Monthly API Credits](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits-en)
- 📄 [Tool Pick: postgres2mcp](/posts/daily/2026-10-09-tool-postgres2mcp-en)
- 📄 [AI Engineer Interview Prep — 2026-10-09: Coding](/posts/daily/2026-10-09-ai-interview-daily-en)
- 📄 [Product Builder Interview Prep — 2026-10-09: Growth & Experimentation](/posts/daily/2026-10-09-product-builder-interview-daily-en)

## Watch Tomorrow

- After Zenity's AWS Bedrock AgentCore disclosure gets patched, whether other cloud agent platforms turn out to have similar "same-account cross-agent hijack" design flaws
- Follow-up on the Shinhan Bank breach: whether South Korean regulators propose concrete controls on agentic pentesting tools like ARTEX
- Whether Manus's parent's rumored $4B valuation gets confirmed in its next round, and whether it shapes fundraising strategy for other Chinese AI startups blocked from foreign acquisition

## Today's Takeaway

I used to think an agent's commercial selling point and its attack surface were separate problems you could address on separate timelines — ship the product first, bolt on security later. Seeing Google's coworker-agent permission design and the AWS Bedrock AgentCore vulnerability surface almost simultaneously made me realize they're really the front and back of the same design decision: however much approval friction you remove for the agent, that's exactly how much no-approval room an attacker inherits once it's hijacked — you can't buy just one side of that trade.

## References

- [AI Agent Arxiv Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-arxiv-digest-en)
- [AI Agent GitHub Digest — 2026-10-09](/posts/daily/2026-10-09-ai-agent-github-digest-en)
- [Funding Brief: Manus's First Independent Round, $500M+](/posts/daily/2026-10-09-funding-manus-en)
- [Funding Brief: Nous Research Series B $90M](/posts/daily/2026-10-09-funding-nous-research-en)
- [Funding Brief: Rein Security Series A $25M](/posts/daily/2026-10-09-funding-rein-security-en)
- [Model Card: Claude Haiku 5.5](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5-en)
- [Pricing Tracker: Claude Max/Team Subscribers Get Free Monthly API Credits](/posts/daily/2026-10-09-pricing-anthropic-claude-max-team-api-credits-en)
- [Tool Pick: postgres2mcp](/posts/daily/2026-10-09-tool-postgres2mcp-en)
- [Google Cloud introduces Gemini agent for work — reuters.com](https://www.reuters.com/business/google-cloud-introduces-gemini-agent-work-ai-race-heats-up-2026-10-08)
- [Suspect behind South Korea bank hacks — reuters.com](https://www.reuters.com/world/suspect-behind-south-korea-bank-hacks-may-be-26-year-old-china-cybersecurity-2026-10-08)
- [Chinese AI startup Manus drums up over $500m in fresh funding — asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/chinese-ai-startup-manus-drums-up-over-500m-in-fresh-funding)
- [A single prompt was enough to hijack every AI agent in an AWS account — the-decoder.com](https://the-decoder.com/a-single-prompt-was-enough-to-hijack-every-ai-agent-in-an-aws-account-zenity-researchers-found/)
- [Meta and Sierra announce Personal Agent Protocol — ameztrix.com](https://ameztrix.com/ai/meta-ai-agent-standard)
- [Claude can now generate animated explainer videos and live data dashboards — the-decoder.com](https://the-decoder.com/claude-can-now-generate-animated-explainer-videos-and-live-data-dashboards-from-text-prompts/)
- [White House announces AI Responsibility Accord — crowell.com](https://www.crowell.com/en/insights/client-alerts/white-house-announces-ai-responsibility-accord-executive-orders-and-super-intelligence-task-force)
- [Rein Security raises $25M Series A — prnewswire.com](https://www.prnewswire.com/news-releases/rein-security-raises-25-million-to-secure-the-ai-agents-enterprises-build-and-stop-the-ones-that-attack-them-302901591.html)
- [Robot-data startup Mecka AI nabs $60M from Sequoia — techcrunch.com](https://techcrunch.com/2026/10/07/robot-data-startup-mecka-ai-nabs-60m-from-sequoia)
- [Scale AI releases visual-reasoning benchmark — superpowerdaily.com](https://superpowerdaily.com/posts/scale-ai-releases-visual-reasoning-benchmark-best-model-scores-53-6-versus-humans-93-1)
- [Socure acquires Fravity AI for $156 million — msspalert.com](https://www.msspalert.com/news/socure-acquires-fravity-ai-for-156-million-to-enhance-identity-verification)
- [SAP Connect keynote: Autonomous Enterprise in action — news.sap.com](https://news.sap.com/2026/10/sap-connect-keynote-autonomous-enterprise-in-action/)
- [Australia outlines plan to make AI companies prove their safety systems work — abc.net.au](https://www.abc.net.au/news/2026-10-08/federal-politics-ai-regulation-andrew-charlton-speech/107241674)
- [Alibaba Cloud ESA at Apsara 2026 — alibabacloud.com](https://www.alibabacloud.com/blog/alibaba-cloud-esa-at-apsara-2026-the-full-edge-for-ai-lineup---seven-shipped-capabilities-and-four-stage-directions-under-three-pillars_603610)
- [Microsoft Dynamic Workflows — devblogs.microsoft.com](https://devblogs.microsoft.com/azure-sdk/dynamic-workflows-azure-functions-hosted-skills/)
- [Atlassian MCP Server reaches general availability — atlassian.com](https://www.atlassian.com/blog/company-news/team26-europe-atlassian-mcp)
- [Asia's AI governance choices come into focus — asiatimes.com](https://asiatimes.com/2026/10/choices-that-will-define-asias-ai-future-are-coming-into-focus)
- [Anthropic's new usage policy — the-decoder.com](https://the-decoder.com/being-mean-to-claude-can-now-get-your-account-suspended-under-anthropics-new-tos/)
- [Joe Tsai: open source is Europe's AI opportunity — alibabacloud.com](https://www.alibabacloud.com/blog/joe-tsai-open-source-is-europes-ai-opportunity_603620)
- [Anthropic's mass book buying in Japan stirs publisher backlash — asia.nikkei.com](https://asia.nikkei.com/business/technology/artificial-intelligence/anthropic-s-mass-book-buying-in-japan-stirs-publisher-backlash)
- [DB-GPT AI agent platform patches two critical RCE CVEs — forkast.news](https://forkast.news/db-gpt-ai-agent-platform-two-critical-rce-cves-at-the-agent-data-access-layer)
- [Ethereum researchers warn AI math breakthroughs could break wallet security — the-decoder.com](https://the-decoder.com/ai-math-breakthroughs-have-ethereum-researchers-debating-how-fast-wallet-security-could-collapse/)
- [Philippines-based Agentiq raises $4M seed — af.net](https://af.net/realtime/ai-agents-gain-momentum-in-kenya-and-nigeria-boosting-business-automation)
- [GitHub coding-agents topic — github.com](https://github.com/topics/coding-agents)
- [Microsoft explains Agent Experience (AX) — devblogs.microsoft.com](https://devblogs.microsoft.com/blog/what-is-agent-experience-ax/)
- [Windows ML adds experimental llama.cpp support — devblogs.microsoft.com](https://devblogs.microsoft.com/foundry-on-windows/build-on-winml-oct-7-26/)
- [Three AI Agents free to use? A complete guide to OpenAI Dots, Meta Muse and Grok Bot — gvm.com.tw](https://www.gvm.com.tw/article/133614)
- [Cisco AI Readiness Index: only 39% of African organizations equipped to secure AI agents — cioafrica.co](https://cioafrica.co/what-2026-is-teaching-us-about-ai-and-quantum)
- [Welcome to Gemini at Work 2026 — cloud.google.com](https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026)
- [Shory launches AI agent for car insurance buyers in the UAE — fintechnews.ae](https://fintechnews.ae/34055/insurtech/shory-ai-car-insurance-agent-launch)
