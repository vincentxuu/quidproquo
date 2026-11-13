---
title: "AI Daily — 2026-11-10"
date: 2026-11-10
category: daily
tags: [ai-agent, daily]
lang: en
description: "Once people hand whole jobs to agents, an accountability gap opens — attackers already outsource intrusions to agents, and regulators are answering by making agents carry an identity and a responsible party"
tldr: "Malbear Labs shows a jailbroken DeepSeek Flash agent attacking a European telecom for two weeks while its operator only checked in asynchronously; Acronis's BossAI report says an AI agent attack system breached Taipei's 119 dispatch system; China's MIIT requires agents built into phones and watches to carry an identity code, and the HKMA launches Project SAGE to cover Know-Your-Agent; Singapore reminds users they remain responsible for what their personal agents do; Perplexity Teammates, Amazon's text-to-shop agent and DeepSeek Harness's 1.54M daily users show how much work is being delegated to agents"
draft: false
series:
  name: "AI Daily"
  order: 87
---

> 🌏 [中文版](/posts/daily/2026-11-10-ai-agent-daily)

## One-line Take

**Today attackers and regulators ran into the same question: once a person hands a whole task to an agent, who answers for what it does? Attackers already outsource intrusions to agents, while regulators are starting to require agents to carry an identity that traces back to a person. Taiwanese teams should inventory their agents, set approval thresholds and keep audit trails now, before the rules are written.**

## Deep Dive: You Can Delegate the Task, Not the Responsibility

I think today's events, read together, form a textbook principal–agent problem: the principal hands execution to an agent but cannot see what the agent does in real time, and that information gap becomes the risk. (Framework: principal–agent theory)

The first piece of evidence comes from attackers. In Operation Snowball, disclosed by Malbear Labs, an operator used a jailbreak prompt of about 78,000 characters to keep a DeepSeek Flash–driven agent attacking a European telecom for more than two weeks. The operator's messages were mostly "Go on" and "Stop" plus a target subnet, and progress was checked asynchronously. When endpoint security blocked an exploit, the agent switched approach on its own and even wrote a replacement for a blocked tunneling tool ([Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)). Acronis's BossAI case hit Taiwan directly: iThome reports that this attack system, which chains 12 AI agents, targeted hundreds of organizations in 11 countries over 12 days. Taiwan was the most heavily targeted, and Taipei's 119 dispatch system and emergency patient care record platform were breached ([iThome](https://www.ithome.com.tw/news/180334)).

The second piece of evidence comes from regulators. China's MIIT Notice No. 42 (2026) requires agents built into phones, tablets and smartwatches to carry an identity code. The HKMA's Project SAGE puts Know-Your-Agent identity, interoperability and liability on an expert group's agenda ([Ctrl+AI+Reg](https://techieray.substack.com/p/passports-for-bots-chinas-gameplan), [What The FinTech](https://whatthefintech.substack.com/p/what-the-fintech-191-9-nov-2026)). Guidance from Singapore's CSA, GovTech and IMDA is blunter: users remain responsible for actions agents take on their behalf ([CNA](https://www.channelnewsasia.com/singapore/personal-ai-agents-assistant-advisory-muse-dots-hermes-grok-openclaw-6529836)). Indian lawyers also note that AI has no legal personality under Indian law, so contractual and regulatory liability stays with the deploying enterprise ([ET LegalWorld](https://legal.economictimes.indiatimes.com/news/corporate-business/companies-must-retain-accountability-as-autonomous-ai-agents-take-on-business-decisions-say-legal-experts/135652742)).

Both sides point the same way: shrink the information gap. Asynchronous check-ins are enough for an attacker because no one holds him accountable. Legitimate users face the opposite, since they need to reconstruct afterward why an agent acted the way it did. For Taiwanese teams, BossAI has shown that Taiwan is a hot zone for agent-driven attacks. Teams selling agents to Hong Kong banks or into China's device supply chain will also face two different identity regimes. The most practical first step is an agent inventory, a threshold for actions that need human approval, and replayable execution logs.

```diagram
title: Two paths after delegating to an agent
desc: The left column lists today's cases of handing whole tasks to agents (Operation Snowball, BossAI, Perplexity Teammates); the right column lists regulators asking agents to carry identity and accountability (China MIIT identity code, Hong Kong Project SAGE, Singapore guidance)
caption: Compiled from Infosecurity Magazine, iThome, itbrief, Ctrl+AI+Reg, What The FinTech and CNA reporting, 2026-11-06 to 11-09.
---
<svg viewBox="0 0 640 288">
  <rect class="dg-zone dg-zone--solid" x="16" y="16" width="288" height="256" rx="8"/>
  <rect class="dg-zone" x="336" y="16" width="288" height="256" rx="8"/>

  <text class="dg-tag dg-text--warn" x="32" y="44" dominant-baseline="central">Whole task handed to agent</text>
  <text class="dg-tag dg-text--accent" x="352" y="44" dominant-baseline="central">Identity and liability rules</text>

  <rect class="dg-box dg-box--warn" x="36" y="64" width="248" height="56" rx="6"/>
  <text class="dg-label" x="160" y="84" text-anchor="middle" dominant-baseline="central">Operation Snowball</text>
  <text class="dg-sub" x="160" y="104" text-anchor="middle" dominant-baseline="central">Operator checks in async</text>

  <rect class="dg-box dg-box--warn" x="36" y="132" width="248" height="56" rx="6"/>
  <text class="dg-label" x="160" y="152" text-anchor="middle" dominant-baseline="central">BossAI</text>
  <text class="dg-sub" x="160" y="172" text-anchor="middle" dominant-baseline="central">12 agents, Taiwan main target</text>

  <rect class="dg-box" x="36" y="200" width="248" height="56" rx="6"/>
  <text class="dg-label" x="160" y="220" text-anchor="middle" dominant-baseline="central">Perplexity Teammates</text>
  <text class="dg-sub" x="160" y="240" text-anchor="middle" dominant-baseline="central">One role spawns more agents</text>

  <rect class="dg-box" x="356" y="64" width="248" height="56" rx="6"/>
  <text class="dg-label" x="480" y="84" text-anchor="middle" dominant-baseline="central">China MIIT Notice No. 42</text>
  <text class="dg-sub" x="480" y="104" text-anchor="middle" dominant-baseline="central">Built-in agents need an ID</text>

  <rect class="dg-box" x="356" y="132" width="248" height="56" rx="6"/>
  <text class="dg-label" x="480" y="152" text-anchor="middle" dominant-baseline="central">Hong Kong Project SAGE</text>
  <text class="dg-sub" x="480" y="172" text-anchor="middle" dominant-baseline="central">Know-Your-Agent, liability</text>

  <rect class="dg-box" x="356" y="200" width="248" height="56" rx="6"/>
  <text class="dg-label" x="480" y="220" text-anchor="middle" dominant-baseline="central">Singapore guidance</text>
  <text class="dg-sub" x="480" y="240" text-anchor="middle" dominant-baseline="central">Users stay responsible</text>
</svg>
```

## Today's Updates

### Vendor Updates

| Entity | Update | Source |
|------|----------|------|
| **Perplexity** | Launched Teammates as a research preview for individual Max subscribers. Each teammate has its own role, can split a goal into parallel tasks and start more agents to handle them; new teammates default to Claude Opus 5.5. | [itbrief](https://itbrief.asia/story/perplexity-launches-teammates-ai-agents-for-max-users) |
| **DeepSeek** | Its open-source agent app DeepSeek Harness, launched August 13, reached 1.54M daily active users by November 4, up from about 271,000 at the end of September. | [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users) |
| **Amazon** | Some US customers can now text the Alexa for Shopping agent to shop, with a wider rollout in coming weeks; Amazon says more than 400M customers used Alexa for Shopping in the past 12 months. | [About Amazon](https://www.aboutamazon.com/news/retail/alexa-for-shopping-text-to-shop) |
| **Sourcegraph** | Cody reaches end of life on January 31, 2027; Sourcegraph is shifting toward helping engineering teams and coding agents understand large codebases. | [Sourcegraph](https://sourcegraph.com/blog/sunsetting-cody-future-of-code-intelligence) |
| **AWS** | The weekly roundup highlights the new Bedrock AgentCore runtime (set `platformVersion` to `V2`), which kept P75 cold starts at about 2 seconds in the team's tests. | [AWS Blog](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-agentcore-runtime-v2-amazon-dynamodb-bulk-put-items-and-more-november-9-2026/) |

### Technical Progress

| Entity | Update | Source |
|------|----------|------|
| **Dapr 1.19** | Diagrid's release sends workflow workers only new events instead of the full history on every step; the preview WorkflowsFastPath cut median step latency from 553 ms to 153 ms in Diagrid's benchmarks. | [SiliconANGLE](https://siliconangle.com/2026/11/09/diagrids-dapr-1-19-lightens-ai-agent-workflows-and-drops-a-control-plane-service/) |
| **Toolshed** | Open-source MCP server manager that installs MCP servers for Claude Code and Codex from one interface and stores API tokens in the system keychain rather than config files. | [Get Ready for Agents](https://www.getreadyforagents.com/news/toolshed-mcp-server-management/) |
| **NVIDIA Nemotron-Personas-Finance-Japan** | Released with Elith: a million-record synthetic Japanese finance persona dataset grounded in official statistics, so financial agent developers can avoid real personal data. | [Hugging Face Blog](https://huggingface.co/blog/nvidia/nemotron-personas-finance-japan) |

### Security Incidents

| Entity | Update | Source |
|------|----------|------|
| **Operation Snowball** | The jailbroken agent entered a European telecom via a Cisco BroadWorks XXE flaw (CVE-2026-20320), reaching 13 organizations hosted on its infrastructure; Malbear did not say whether it confirmed claims with victims. Defense: treat internet-exposed JBoss AS 6 as compromised and watch internal traffic for tunneling. | [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/) |
| **Acronis TRU Cyber Pulse 2026** | Infostealers now take API keys and agent configuration from AI coding tools; BossAI wires attack tools through MCP. The report recommends enforcing filesystem, network and command-execution limits outside the model. | [Developer Tech](https://www.developer-tech.com/news/acronis-report-puts-ai-agent-attacks-on-devsecops-radar/) |

### Regulation and Governance

| Entity | Update | Source |
|------|----------|------|
| **US Congress** | After the Democrats' midterm sweep, the industry expects more hearings and investigations, overlapping with Anthropic's and OpenAI's IPO plans. | [Los Angeles Times](https://www.latimes.com/business/story/2026-11-09/blue-wave-puts-ai-companies-in-regulatory-crosshairs) |
| **Scott Wiener** | The California state senator behind SB 1047 and SB 53 won San Francisco's House seat and said Congress does not appear set to act decisively on AI before year end. | [MIT Technology Review](https://www.technologyreview.com/2026/11/09/1148182/nancy-pelosis-replacement-is-ready-to-regulate-ai/) |
| **EU AI Act enforcement** | Politico reports 16 member states still have not appointed AI safety authorities. | [Politico](https://www.politico.eu/article/eu-countries-still-cant-get-it-together-on-ai/) |
| **EU Digital Fairness Act draft** | According to the draft seen by Bloomberg and Reuters, it would target AI systems that simulate personal relationships to keep users engaged, with fines up to 6% of global annual turnover for unfair digital practices. | [FourWeekMBA](https://fourweekmba.com/ai-eu-draft-targets-ai-bots-addictive-apps-fines-up-to-6/) |

### Regional Updates

| Region | Update |
|------|----------|
| **Taiwan** | iThome summarizes the Acronis report: BossAI attacked 11 countries in 12 days, Taiwan was hit hardest, and Taipei's 119 dispatch system was breached with some patient data leaked ([source](https://www.ithome.com.tw/news/180334)). |
| **China / Hong Kong** | China's MIIT Notice No. 42 requires terminal devices with pre-installed agents to carry an identity code; the HKMA launched Project SAGE and a discussion paper on supervisory considerations for agentic AI in banking ([source](https://whatthefintech.substack.com/p/what-the-fintech-191-9-nov-2026)). |
| **Japan / Korea** | South Korea's Presidential Council on National AI Strategy approved the "Korea AI Legislative Framework," directing ministries to prioritize the AI Basic Act and sectoral amendments over new standalone laws; KISA published an agentic AI zero-trust guide ([source](https://techieray.substack.com/p/passports-for-bots-chinas-gameplan)). |
| **Southeast Asia** | Singapore's CSA, GovTech and IMDA issued personal agent guidance: don't give agents access to banking, government or healthcare accounts, and approve important actions one at a time ([source](https://www.channelnewsasia.com/singapore/personal-ai-agents-assistant-advisory-muse-dots-hermes-grok-openclaw-6529836)). |
| **India / South Asia** | Indian legal experts say enterprises keep contractual and regulatory liability for autonomous agents; the same piece cites a TCS study finding only 10% of enterprises let agents execute decisions across multiple functions without human approval ([source](https://legal.economictimes.indiatimes.com/news/corporate-business/companies-must-retain-accountability-as-autonomous-ai-agents-take-on-business-decisions-say-legal-experts/135652742)). |
| **Middle East (incl. Israel)** | Saudi Arabia's Humain signed up to SR2.5B ($667M) of financing with the National Infrastructure Fund for GPU deployment and data center power ([source](https://www.arabnews.com/eye-on-ai/humain-infra-sign-667m-financing-deals-to-expand-saudi-ai-infrastructure-3010704)); Gulf sovereign AI discussion is shifting toward governance and local language models ([source](https://www.khaleejtimes.com/business/sovereign-ai-emerges-as-next-battleground-for-gulf-economies)). |
| **Africa** | An investor at Cairo's Global Entrepreneurship Festival estimated African startups get about 0.6% of global VC ([source](https://serrarigroup.com/african-startups-get-just-0-6-of-global-vc-as-ai-surges/)); South Africa's national AI policy Cabinet date slipped to March 2027 ([source](https://innovation-village.com/ai-africa-intelligence-october-22-november-4-2026-vol-28/)). |
| **Latin America** | Argentine AI video startup Hashi entered Chile after raising $4M; it serves 500+ clients in 18 countries ([source](https://www.latamrepublic.com/argentine-ai-startup-hashi-reaches-18-countries-with-chilean-launch/)). |
| **Oceania** | A1 Technologies launched Guardrails, an AI governance service for ANZ mid-market firms that inventories AI apps and agent permissions ([source](https://securitybrief.co.nz/story/a1-launches-ai-governance-service-for-mid-market-firms)); Oracle NetSuite Next rolled out across ANZ ([source](https://smbtech.au/news/oracle-lays-out-its-ai-playbook-as-netsuite-rolls-out-autonomous-suite-across-anz/)). |

### Business Cases / Funding

| Entity | Update | Source |
|------|----------|------|
| **Five9 acquires Level AI** | The deal values Level AI at roughly $325M and folds its AI agents, agent assist and quality management into Genius CX, also sold standalone to customers on other platforms. | [UC Today](https://uctoday.com/this-week-enterprise-ai-gets-serious-about-action) |
| **Nominal** | The hardware engineering and testing AI platform raised a $240M Series C at a $3B valuation, tripling in eight months; led by Lightspeed, co-led by Insight Partners. | [TechCrunch](https://techcrunch.com/2026/11/09/ai-hardware-startup-nominal-triples-valuation-to-3b-in-8-months/) |
| **Coframe** | Raised a $25M Series A, $35M in total, co-led by Khosla Ventures and Hanabi Capital; it uses agents to generate and test website and ad variants. | [Unite.AI](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/) |
| **Ebix × intentyx** | Launched SMARE for agent governance: it discovers enterprise agents, records each agent's approved "Design Intent" and flags drift outside authorized boundaries, aimed at insurers and financial firms. | [Efficiently Connected](https://www.efficientlyconnected.com/ebix-intentyx-ai-agent-governance-regulated-industries/) |

## Key Numbers

| Item | Number | Source |
|------|------|------|
| DeepSeek Harness daily active users | 1.54M (November 4) | [Bloomberg](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users) |
| Operation Snowball jailbreak prompt | ~78,000 characters | [Infosecurity Magazine](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/) |
| BossAI attack scope | 12 days, 11 countries | [iThome](https://www.ithome.com.tw/news/180334) |
| Level AI deal value | ~$325M | [UC Today](https://uctoday.com/this-week-enterprise-ai-gets-serious-about-action) |
| Nominal Series C | $240M at a $3B valuation | [TechCrunch](https://techcrunch.com/2026/11/09/ai-hardware-startup-nominal-triples-valuation-to-3b-in-8-months/) |
| Dapr WorkflowsFastPath median step latency | 553 → 153 ms | [SiliconANGLE](https://siliconangle.com/2026/11/09/diagrids-dapr-1-19-lightens-ai-agent-workflows-and-drops-a-control-plane-service/) |

## What to Watch Tomorrow

- Whether victims or a CERT confirm the Malbear and Acronis findings, and the follow-up disclosure and fix timeline for Taipei's 119 dispatch system
- Membership of Hong Kong's Project SAGE expert group, the comment deadline for its discussion paper, and whether Know-Your-Agent diverges from China's device identity code
- When Perplexity Teammates reaches Pro and enterprise plans, and how many credits parallel agents actually burn

## Today's Takeaway

I used to think agent identity would only become urgent once agents routinely transacted with each other. Seeing BossAI reach Taiwan's 119 system made me realize attackers already run agents at scale, while defenders often don't know which agents exist in their own environment. For Taiwanese teams, listing their own agents is more urgent than waiting for an external identity standard.

## References

- [Infosecurity Magazine — Jailbroken AI Agent Ran Two-Week Attack on European Telecom](https://www.infosecurity-magazine.com/news/operation-snowball-ai-telecom/)
- [iThome — BossAI automated attack system targets Taiwan emergency services (Chinese)](https://www.ithome.com.tw/news/180334)
- [Developer Tech — Acronis report puts AI agent attacks on DevSecOps radar](https://www.developer-tech.com/news/acronis-report-puts-ai-agent-attacks-on-devsecops-radar/)
- [itbrief — Perplexity launches Teammates AI agents for Max users](https://itbrief.asia/story/perplexity-launches-teammates-ai-agents-for-max-users)
- [Bloomberg — DeepSeek's AI Agent Platform Reaches 1.54 Million Daily Active Users](https://www.bloomberg.com/news/articles/2026-11-08/deepseek-s-ai-agent-platform-hits-1-54-million-daily-users)
- [About Amazon — Alexa for Shopping is now just a text away](https://www.aboutamazon.com/news/retail/alexa-for-shopping-text-to-shop)
- [Sourcegraph — Sunsetting Sourcegraph Cody](https://sourcegraph.com/blog/sunsetting-cody-future-of-code-intelligence)
- [AWS Weekly Roundup — AgentCore Runtime V2 (November 9, 2026)](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-agentcore-runtime-v2-amazon-dynamodb-bulk-put-items-and-more-november-9-2026/)
- [SiliconANGLE — Diagrid's Dapr 1.19 lightens AI agent workflows](https://siliconangle.com/2026/11/09/diagrids-dapr-1-19-lightens-ai-agent-workflows-and-drops-a-control-plane-service/)
- [Get Ready for Agents — Toolshed MCP server manager](https://www.getreadyforagents.com/news/toolshed-mcp-server-management/)
- [Hugging Face Blog — Nemotron-Personas-Finance-Japan](https://huggingface.co/blog/nvidia/nemotron-personas-finance-japan)
- [Ctrl+AI+Reg — Passports for bots: China's gameplan to control AI agent identity](https://techieray.substack.com/p/passports-for-bots-chinas-gameplan)
- [What The FinTech #191 — HKMA Project SAGE](https://whatthefintech.substack.com/p/what-the-fintech-191-9-nov-2026)
- [CNA — Singapore authorities warn of privacy, security risks from personal AI agents](https://www.channelnewsasia.com/singapore/personal-ai-agents-assistant-advisory-muse-dots-hermes-grok-openclaw-6529836)
- [ET LegalWorld — Companies must retain accountability as autonomous AI agents take on business decisions](https://legal.economictimes.indiatimes.com/news/corporate-business/companies-must-retain-accountability-as-autonomous-ai-agents-take-on-business-decisions-say-legal-experts/135652742)
- [Los Angeles Times — Blue wave puts AI companies in the regulatory crosshairs](https://www.latimes.com/business/story/2026-11-09/blue-wave-puts-ai-companies-in-regulatory-crosshairs)
- [MIT Technology Review — Nancy Pelosi's replacement is ready to regulate AI](https://www.technologyreview.com/2026/11/09/1148182/nancy-pelosis-replacement-is-ready-to-regulate-ai/)
- [Politico — EU countries still can't get it together on AI](https://www.politico.eu/article/eu-countries-still-cant-get-it-together-on-ai/)
- [FourWeekMBA — EU Draft Targets AI Bots, Addictive Apps; Fines Up to 6%](https://fourweekmba.com/ai-eu-draft-targets-ai-bots-addictive-apps-fines-up-to-6/)
- [Arab News — Humain, Infra sign $667m financing deals](https://www.arabnews.com/eye-on-ai/humain-infra-sign-667m-financing-deals-to-expand-saudi-ai-infrastructure-3010704)
- [Khaleej Times — Sovereign AI emerges as next battleground for Gulf economies](https://www.khaleejtimes.com/business/sovereign-ai-emerges-as-next-battleground-for-gulf-economies)
- [Serrari Group — African Startups Get Just 0.6% of Global VC as AI Surges](https://serrarigroup.com/african-startups-get-just-0-6-of-global-vc-as-ai-surges/)
- [Innovation Village — AI Africa Intelligence Vol. 28](https://innovation-village.com/ai-africa-intelligence-october-22-november-4-2026-vol-28/)
- [LatAm Republic — Argentine AI Startup Hashi Reaches 18 Countries With Chilean Launch](https://www.latamrepublic.com/argentine-ai-startup-hashi-reaches-18-countries-with-chilean-launch/)
- [SecurityBrief NZ — A1 launches AI governance service for mid-market firms](https://securitybrief.co.nz/story/a1-launches-ai-governance-service-for-mid-market-firms)
- [SMBtech — Oracle NetSuite rolls out autonomous suite across ANZ](https://smbtech.au/news/oracle-lays-out-its-ai-playbook-as-netsuite-rolls-out-autonomous-suite-across-anz/)
- [UC Today — This Week: Enterprise AI Gets Serious About Action](https://uctoday.com/this-week-enterprise-ai-gets-serious-about-action)
- [TechCrunch — Nominal triples valuation to $3B in 8 months](https://techcrunch.com/2026/11/09/ai-hardware-startup-nominal-triples-valuation-to-3b-in-8-months/)
- [Unite.AI — Coframe Raises $25M Series A](https://www.unite.ai/coframe-raises-25m-series-a-bringing-total-funding-to-35m/)
- [Efficiently Connected — Ebix and intentyx Launch AI Agent Governance](https://www.efficientlyconnected.com/ebix-intentyx-ai-agent-governance-regulated-industries/)
