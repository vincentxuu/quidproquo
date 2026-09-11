---
title: "AI Daily — 2026-09-12"
date: 2026-09-12
category: daily
tags: [ai-agent, daily]
lang: en
description: "The same week OpenAI opened public beta of the harness that drives Codex, security researchers confirmed attackers used the same harness paired with DeepSeek to seize domain control in 7 minutes — the lowered barrier to agent infrastructure cuts both ways"
tldr: "OpenAI opened public beta of its Agents API; the same week hundreds of AI agents powered by the OpenAI Codex harness and DeepSeek jointly compromised 395 organizations across 48 countries via PaperCut flaws; WeWorm showed AI writing an RCE exploit in two days and a full zero-click worm in a week; Cognition shipped SWE-2 and raised $2B at a $48B valuation; Mistral closed a €3B Series D at over €21B, pivoting from a model company to a sovereign cloud provider; DeepSeek-V4.1-Flash shipped and will replace DeepSeek's own flagship V4-Pro starting 9/14."
draft: false
series:
  name: "AI Daily"
  order: 28
---

## Take of the Day

**The same week OpenAI opened public beta of the agent harness that drives Codex for developers to use, security research confirmed attackers wielding the same "OpenAI Codex harness + DeepSeek model" combo seized domain control in as little as 7 minutes and swept 395 organizations across 48 countries in hours — the barrier that agent infrastructure lowers cuts both ways, and Taiwanese enterprises adopting agents need to make sure their detection and response speed can keep up with attackers' automated pace before they roll it out.**

## Deep Dive: The Barrier Agent Infrastructure Lowers Has No Direction

I think today's most important signal isn't a single product launch — it's that the same capability showed up on both sides of the offense/defense line at once, and transaction-cost thinking explains it well.

OpenAI's public beta of the Agents API is, at its core, packaging the session management, cross-sandbox orchestration, context compaction, and recovery capabilities that used to live only inside the Codex team into an interface any developer can call — a textbook transaction-cost reduction: building your own agent harness for long-running autonomous tasks used to take a team; now it's an API call. But the same day, security outlets revealed that two PaperCut NG/MF CVEs were exploited by attackers commanding AI agents built on the OpenAI Codex harness paired with DeepSeek models, compromising 395 organizations across 48 countries within hours, with some cases reaching domain admin in as little as 7 minutes. Calif Research's WeWorm demo makes the same point from another angle: researchers used AI to write an RCE exploit in two days and finish a WeChat-voice-call zero-click worm hitting both iOS and Android within a week.

Stack these three together and the pattern is clear: agent harnesses have dropped the transaction cost of building an autonomous system to a level anyone can use — and that drop has no direction. It equally lowers the cost of launching large-scale automated attacks. Lateral movement and exploitation that used to take a whole team weeks can now compress to minutes or days.

For practitioners — and especially Taiwanese enterprises evaluating agent adoption — this means the threat model needs updating. Agent security can't just mean "block prompt injection" at the model layer; you have to assume attackers hold a harness and models just as capable as yours, and their attack speed will be measured in minutes, not days. Rolling out agents means your detection, isolation, and response processes need to reach the same level of automation, or you end up with defenders working at human pace while attackers work at agent pace.

## Today's Signals

### Vendor Updates

**OpenAI**: Beyond the Agents API public beta, it also shipped a Data agent for ChatGPT Work that lets enterprise dashboards connect directly to company data sources, and launched ChatGPT for Financial Services with industry-specific AI assistants and agent workflows. ([Source](https://openai.com/index/introducing-the-agents-api/))

**Ant International**: Extended its Agentic Mobile Protocol (AMP) to Asian wallets including AlipayHK, Starryblu, KakaoPay, and Toss, and partnered with Visa and Mastercard on a Know-Your-Agent (KYA) identity framework targeting cross-border AI agent payments. Alipay simultaneously launched an AI wallet agent adding three "AI Collect" capabilities — VibePay, SkillPay, and MachinePay. ([Source](https://www.scmp.com/tech/big-tech/article/3367183/ant-international-let-ai-agents-shop-across-alipayhk-starryblu-kakaopay-and-toss))

**xAI**: Continued expanding Grok 4.6's reach, landing on Microsoft Foundry, Amazon Bedrock, and Google's Gemini Enterprise Agent Platform, and opening Grok Bot to Cursor Pro/Teams users. ([Source](https://x.ai/news))

**Anthropic**: The EU's ENISA secured independent testing access to Mythos 5, Anthropic's cybersecurity AI, after months of negotiation — though it still can't access Anthropic's latest models. ([Source](https://www.techrepublic.com/article/news-enisa-anthropic-mythos-5-cyber-ai-access-europe-emea/))

### Models & Infrastructure

**DeepSeek-V4.1-Flash**: A 552B total-parameter MoE swapping in a Causal Encoder-Decoder architecture; Terminal-Bench 4.0 jumped from 7.0 to 31.2, and DeepSWE v1.1 now matches Claude Opus 5. Pricing undercuts the prior generation, and DeepSeek announced that starting 9/14 all traffic to its own flagship V4-Pro will be routed to this Flash version and billed at Flash rates. See the [model card](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash-en).

**Cognition SWE-2**: Beat SWE-1.7 and Grok 4.6 on FrontierCode 1.1 at lower cost, and is the first model to support effort levels; already live in Devin Desktop/CLI. ([Source](https://cognition.com/blog/swe-2))

**OpenAI GPT-5.6 Sol**: Previewed with a focus on long-horizon security tasks (vulnerability research and exploitation) — a notable pairing with the same day's PaperCut disclosure, showing model vendors and attackers are both chasing the same "long-horizon autonomous task" capability. ([Source](https://openai.com/index/previewing-gpt-5-6-sol/))

### Tools & Ecosystem

**mcp-bi**: An open-source Rust MCP server that unifies dashboard queries across Superset, Metabase, and up to seven BI platforms behind one set of tool calls, always returning the underlying statistics alongside any chart image rather than a screenshot alone. See the [tool pick](/posts/daily/2026-09-12-tool-mcp-bi-en).

**agentgateway**: An open-source vendor-neutral HTTP/gRPC gateway that handles both conventional traffic and AI-native protocols like MCP and A2A, with role-based access control and traffic visibility. ([Source](https://agentgateway.dev/))

### Technical Progress

**Temporal v1.32.0**: Standalone Activities reached GA, adding operator APIs for independently pausing, resuming, and resetting activities plus batch operations, alongside a security-driven breaking change that switches Nexus callback routing to URL-scheme-based by default. See the [framework update](/posts/daily/2026-09-12-framework-temporal-1.32.0-en).

### Security Incidents

**PaperCut mass AI-agent-coordinated attack**: Attackers exploited CVE-2026-81578 and CVE-2026-82078 to command AI agents built on the OpenAI Codex harness and DeepSeek models, compromising 395 organizations across 48 countries within hours, reaching domain admin in as little as 7 minutes in some cases. ([Source](https://www.techtimes.com/articles/327294/20260911/attacker-used-ai-agents-hack-395-organizations-via-papercut-print-flaws.htm))

**WeWorm zero-click worm**: Calif Research demonstrated the first zero-click worm spreading via WeChat voice calls across both iOS and Android; researchers used AI to write an RCE exploit in two days and complete the entire worm within a week. ([Source](https://simonwillison.net/2026/Sep/10/calif-research/))

**MCP tool and automation framework flaws**: The code.find MCP tool (CVE-2026-88938, moderate severity) failed to constrain path access to the project root, letting an agent session read source code outside its scope; AutoAgent has an unauthenticated remote code execution flaw (CVE-2026-86124) that lets anyone connecting to its TCP port issue commands as root. ([Source](https://netfoundry.io/ai/reachability-watch-cve-kev-tracker-2026-09-11/))

### Regulation & Governance

**California signs AI regulation bills**: Governor Newsom signed two AI regulation bills, responding to a former Anthropic researcher's public warning about loss-of-control risk that has drawn over 150 million views, which has prompted lawmakers to revive federal AI safety proposals; OpenAI simultaneously called on Congress to set federal-level rules. ([Source](https://gizmodo.com/newsom-signs-ai-industry-approved-ai-regulation-bills-into-law-in-california-2000809702))

### Global Regional Roundup

**China**

Alipay's new AI wallet agent launch coincides with China rolling out its own AI-payment "Know Your Agent" rules, with regulation and product moving in step on agentic payments. Shenzhen embodied-intelligence startup Kinetix AI has raised over RMB 500M cumulatively, focused on humanoid robotics. ([Source](https://www.techinasia.com/news/alipay-to-launch-wallet-agent-for-ai-payments))

**Japan/Korea**

South Korean robotics startup AIDIN Robotics closed a KRW16B strategic round backed by Hyundai Robotics and Samsung Ventures, pushing humanoid robots from demos toward real factory and shipyard deployment. ([Source](https://techstartups.com/2026/09/11/startup-funding-news-today-september-11-2026-kinetix-ai-aidin-robotics-enigmata-more))

**Southeast Asia**

The Philippine government released the final draft of its $34.4B AI+ Infrastructure Masterplan, aiming to become a regional AI infrastructure hub. ([Source](https://indopacificinsights.substack.com/p/indo-pacific-5x5-september-11th-2026))

**India**

India's payments regulator is building a centralized registry to verify and monitor AI agents executing transactions on users' behalf, starting with the UPI system. ([Source](https://www.archynewsy.com/india-to-launch-registry-for-ai-payment-agents/))

**Europe**

Improbable-backed startup Bolter raised $10M to build a messaging platform for mixed human-AI-agent teams, emphasizing European digital sovereignty — echoing the same day's Mistral €3B Series D and its sovereign-cloud pivot; see the [funding alert](/posts/daily/2026-09-12-funding-mistral-en).

**Middle East**

Reuters reports UAE officials are revising AI data center plans after Iranian missile and drone attacks on Gulf states; separately, MENA startup funding hit $375M in August, up 117% year over year, driven by two large UAE deals. ([Source](https://www.usnews.com/news/world/articles/2026-09-11/exclusive-uae-revises-ai-data-center-plan-after-iranian-attacks-sources-say))

**Africa**

Egypt committed $1B to the AI infrastructure race; Nigeria leads Africa in AI startup count but has raised only about $47M, well behind Kenya and South Africa. Africa and the Middle East together raised $141.3M in weekly startup funding. ([Source](https://innovation-village.com/ai-africa-intelligence-september-3-9-2026-vol-22/))

**Latin America**

Latin American startups raised $140M for the week, led by Kapital's $125M fintech round, alongside AI, legal-tech, and wealth-tech startups also securing funding. ([Source](https://www.techloy.com/latin-america-startup-funding-week-37-2026/))

**Oceania**

A survey found 81% of New Zealand organizations already use or plan to adopt AI cybersecurity tools within 12 months, but most incidents still get handled manually, and only 19% believe their data is ready for reliable AI agent use — a gap worth noting against today's PaperCut and WeWorm incidents. ([Source](https://www.reseller.co.nz/article/4220544/most-nz-organisations-using-ai-for-cyber-security-still-rely-on-manual-responses.html))

Taiwan was checked today; no directly relevant AI-agent news with credible sourcing turned up, so it's omitted.

### Business Cases / Funding / M&A

**Cognition (Devin)**: Raised over $2B at a $48B valuation, led by a16z and Accel, with annualized revenue climbing from $492M in May to nearly $900M; the same day it welcomed the Dioxus developer-tools team aboard, continuing its recent acquisition streak. ([Source](https://sacbee.com/news/business/article317209651.html))

**Mistral**: Closed a €3B (about $3.5B) Series D led by Samsung Electronics, pushing its valuation from €11.7B a year ago to over €21B, pivoting its strategy from selling models to selling sovereign cloud compute. See the [funding alert](/posts/daily/2026-09-12-funding-mistral-en).

**Clay**: Raised $115M to expand its AI sales agent lineup, more than doubling its prior $3.1B valuation, with funds earmarked for its GTM Engineer fellowship program. ([Source](https://ventureburn.com/clay-raises-115-million-to-build-ai-sales-teams))

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Cognition valuation | $48B (raised $2B) | [sacbee.com](https://sacbee.com/news/business/article317209651.html) |
| PaperCut incident scale | 395 orgs / 48 countries, domain control in as little as 7 minutes | [Tech Times](https://www.techtimes.com/articles/327294/20260911/attacker-used-ai-agents-hack-395-organizations-via-papercut-print-flaws.htm) |
| Mistral valuation | Over €21B (nearly doubled in a year) | [Today's funding alert](/posts/daily/2026-09-12-funding-mistral-en) |
| DeepSeek-V4.1-Flash pricing | Output $1.20/1M tokens peak (prior gen: $1.32) | [Today's model card](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash-en) |
| Clay funding | $115M, valuation over $6.2B | [VentureBurn](https://ventureburn.com/clay-raises-115-million-to-build-ai-sales-teams) |

## Today's Digests

- 📄 [Framework Update | Temporal v1.32.0](/posts/daily/2026-09-12-framework-temporal-1.32.0-en)
- 📄 [Funding Alert | Mistral Series D €3B](/posts/daily/2026-09-12-funding-mistral-en)
- 📄 [Model Card | DeepSeek-V4.1-Flash](/posts/daily/2026-09-12-model-deepseek-deepseek-v4-1-flash-en)
- 📄 [Tool Recommendation | mcp-bi — one set of tool calls to read Superset, Metabase, and Power BI dashboards](/posts/daily/2026-09-12-tool-mcp-bi-en)
- 📄 [AI Engineer Interview Daily — 2026-09-12: Paper Reading](/posts/daily/2026-09-12-ai-interview-daily-en)
- 📄 [Product Builder Interview Daily — 2026-09-12: Technical PM](/posts/daily/2026-09-12-product-builder-interview-daily-en)

## Watching Tomorrow

- How fast developers actually adopt the Agents API in public beta, and how third-party agent frameworks (LangGraph, CrewAI) respond
- Whether more victim organizations come forward after the PaperCut attack, and whether other print-management vendors follow with their own security reviews
- Whether Cognition adjusts Devin's pricing after SWE-2 and its $48B valuation, and the next steps in Mistral's strategic partnership with Samsung

## Today's Takeaway

I used to assume AI infrastructure could only be funded by burning equity rounds. Looking at Mistral's raise today, I realized its multi-year "European Compute Unit" (ECU) prepayment commitments are really pulling forward future cloud sales revenue into present-day capital for building data centers — a different financial logic from simply raising and burning cash, and one that other capital-intensive AI infrastructure companies may well copy next.

## References

- [OpenAI: Introducing the Agents API](https://openai.com/index/introducing-the-agents-api/)
- [OpenAI: Put data to work](https://openai.com/index/put-data-to-work/)
- [OpenAI: Introducing ChatGPT for Financial Services](https://openai.com/index/introducing-chatgpt-financial-services/)
- [OpenAI: Previewing GPT-5.6 Sol](https://openai.com/index/previewing-gpt-5-6-sol/)
- [Cognition: SWE-2](https://cognition.com/blog/swe-2)
- [Cognition Series E $2B at $48B — Sacramento Bee (AP)](https://sacbee.com/news/business/article317209651.html)
- [Cognition: Welcoming Dioxus](https://cognition.com/blog/welcoming-dioxus)
- [Clay raises $115M — VentureBurn](https://ventureburn.com/clay-raises-115-million-to-build-ai-sales-teams)
- [PaperCut AI Agent Mass Exploit — Tech Times](https://www.techtimes.com/articles/327294/20260911/attacker-used-ai-agents-hack-395-organizations-via-papercut-print-flaws.htm)
- [WeWorm — Simon Willison](https://simonwillison.net/2026/Sep/10/calif-research/)
- [CVE/KEV Tracker 2026-09-11 — NetFoundry](https://netfoundry.io/ai/reachability-watch-cve-kev-tracker-2026-09-11/)
- [Newsom signs AI regulation bills — Gizmodo](https://gizmodo.com/newsom-signs-ai-industry-approved-ai-regulation-bills-into-law-in-california-2000809702)
- [Ant International KYA framework — SCMP](https://www.scmp.com/tech/big-tech/article/3367183/ant-international-let-ai-agents-shop-across-alipayhk-starryblu-kakaopay-and-toss)
- [Alipay AI wallet agent — Tech in Asia](https://www.techinasia.com/news/alipay-to-launch-wallet-agent-for-ai-payments)
- [India's UPI AI agent registry](https://www.archynewsy.com/india-to-launch-registry-for-ai-payment-agents/)
- [Philippines AI+ Infrastructure Masterplan](https://indopacificinsights.substack.com/p/indo-pacific-5x5-september-11th-2026)
- [AIDIN Robotics KRW16B — TechStartups](https://techstartups.com/2026/09/11/startup-funding-news-today-september-11-2026-kinetix-ai-aidin-robotics-enigmata-more)
- [UAE revises AI data center plans — US News/Reuters](https://www.usnews.com/news/world/articles/2026-09-11/exclusive-uae-revises-ai-data-center-plan-after-iranian-attacks-sources-say)
- [Egypt's $1B AI infrastructure commitment — Innovation Village](https://innovation-village.com/ai-africa-intelligence-september-3-9-2026-vol-22/)
- [Latin America weekly startup funding $140M — Techloy](https://www.techloy.com/latin-america-startup-funding-week-37-2026/)
- [New Zealand enterprise AI security tool adoption survey — Reseller News](https://www.reseller.co.nz/article/4220544/most-nz-organisations-using-ai-for-cyber-security-still-rely-on-manual-responses.html)
- [ENISA secures Anthropic Mythos 5 testing access — TechRepublic](https://www.techrepublic.com/article/news-enisa-anthropic-mythos-5-cyber-ai-access-europe-emea/)
- [Bolter $10M European AI messaging platform](https://datatech.disruptsmedia.com/ai-ml/bolter-exits-stealth-10m-build-european-ai-messaging-platform)
- [xAI expands Grok 4.6 distribution](https://x.ai/news)
- [agentgateway](https://agentgateway.dev/)
