---
title: "AI Daily — 2026-11-19"
date: 2026-11-19
category: daily
tags: [ai-agent, daily]
lang: en
description: "Before adopting an agent framework, decide who owns it — today, from a supply-chain attack to Nvidia's founder being pushed out, the top of the AI trust chain looks just as fragile"
tldr: "Anthropic's updated IPO filing priced 825M shares at $70-78, listing on Nasdaq 11/18; Microsoft's Agent Framework PyPI package was compromised with a credential stealer, Google's GTIG reported fully autonomous attack agents already active in the wild, and the FBI warned open-source agentic pentest frameworks are being used in real intrusions; HYPR's AgentPass and Oleria's AI Gateway both extend identity governance to AI agents; Nvidia held its first all-hands since founder Jensen Huang's scandal-driven resignation, beating earnings but still sliding 2% with the board confirming he won't return; new US rules require import licenses for advanced AI chips at Southeast Asian and Brazilian data centers"
draft: false
series:
  name: "AI Daily"
  order: 96
---

> :globe: [繁體中文版](/posts/daily/2026-11-19-ai-agent-daily)

## Today's Take

**Google reporting fully autonomous attack agents, the FBI warning that open-source agentic pentest frameworks are already being used in real intrusions, and Nvidia's founder-CEO getting pushed out over a scandal all point to the same thing: the AI industry's biggest risk is no longer whether the model is strong enough, but that nobody can say clearly who's accountable for an autonomously-acting system — before adopting an agent framework, write down who owns it, before you argue over which framework to pick.**

## Deep Dive: When the top of the trust chain can't hold, transaction costs get repriced

I think today's seemingly unrelated stories point to one conclusion: the AI industry is paying a far higher transaction cost than expected for the question of "who should be accountable for an autonomous system's behavior" — whether that system is a code package, or the founder running the world's biggest chip company. (Framework: Transaction Costs)

Exhibit A: attackers are exploiting the exact gap that "nobody is accountable for the agent." Google's GTIG report found fully autonomous AI agents already writing and launching exploits without human involvement; the FBI warned that open-source agentic pentest frameworks like ARTEX have shown up in real breaches; and Microsoft's own Agent Framework PyPI package was directly compromised with a credential stealer — one that doesn't just read stolen credentials but actively requests fresh tokens from Azure and GitHub Actions. All three share the same root cause: the accountability chain hasn't been wired up across "package," "agent," and "supply-chain publishing rights."

Exhibit B: the market is pricing in real money to close that gap. HYPR launched AgentPass, binding every AI agent to an accountable human owner; Oleria's AI Gateway tracks exactly which permissions each non-human identity actually uses, using a context graph of 7.2 billion relationships. Neither company is selling a smarter model — they're selling "clarifying who's responsible," which is exactly what transaction-cost theory predicts: when coordination and trust costs get painful enough, the market grows an intermediary layer to absorb them.

Zoom out to the very top of the chain and the same logic gets sharper: after Nvidia founder and CEO Jensen Huang resigned amid scandal, the board made clear at the company's first all-hands that he won't be reinstated — earnings beat expectations but the stock still slid, and multiple banks downgraded the stock. The single most important decision-maker in the entire AI supply chain has been absent for over a week, and the company's own governance mechanism is still repricing the question of "who's responsible, who can come back." What this means for practitioners: at every layer, the risk in a complex system has never just been technical capability — it's whether "someone can be found accountable" was designed in from the start. For teams adopting fast-shipping agent frameworks off PyPI or npm, the question isn't how quickly you track the latest release — it's who controls that package's publishing rights, who gets notified when something breaks, and which human has signed off on each agent's actions.

```diagram
title: The accountability gap, from package to founder, surfaced the same day
desc: Three layers of signal showed up at once today: attackers exploiting the governance vacuum, the market starting to fill it with identity governance, and corporate governance at the very top stuck on the same question.
caption: Cases and figures from Google GTIG, FBI/dev.to, HYPR, Oleria, CNBC.
---
<svg viewBox="0 0 640 300">
  <rect class="dg-box" x="40" y="24" width="560" height="56" rx="6"/>
  <text class="dg-tag" x="60" y="52" dominant-baseline="central">L1</text>
  <text class="dg-label" x="92" y="40" dominant-baseline="central">Attackers — exploiting the governance vacuum</text>
  <text class="dg-sub" x="92" y="64" dominant-baseline="central">GTIG: autonomous attack agents seen; FBI: pentest kits used in breaches</text>

  <rect class="dg-box dg-box--accent" x="40" y="96" width="560" height="56" rx="6"/>
  <text class="dg-tag" x="60" y="124" dominant-baseline="central">L2</text>
  <text class="dg-label" x="92" y="112" dominant-baseline="central">Market response — identity governance fills in</text>
  <text class="dg-sub" x="92" y="136" dominant-baseline="central">HYPR AgentPass, Oleria AI Gateway tie each agent to a human owner</text>

  <rect class="dg-box dg-box--accent" x="40" y="168" width="560" height="56" rx="6"/>
  <text class="dg-tag" x="60" y="196" dominant-baseline="central">L3</text>
  <text class="dg-label" x="92" y="184" dominant-baseline="central">The top is just as stuck — corporate governance too</text>
  <text class="dg-sub" x="92" y="208" dominant-baseline="central">Nvidia's decision vacuum has lasted over a week since the founder left</text>

  <line class="dg-rule" x1="40" y1="236" x2="600" y2="236"/>
  <text class="dg-sub" x="40" y="260" dominant-baseline="central">Shared gap: accountability isn't wired up at the package, agent, or board level</text>
  <text class="dg-sub" x="40" y="280" dominant-baseline="central">The market is filling that gap slower than attackers and the vacuum are growing</text>
</svg>
```

## Today's Developments

### Vendor Updates

- **[Microsoft](https://aiagentsdirectory.com/news/ai-agents-news-brief-november-18-2026)** (aiagentsdirectory): Launched the autonomous agent Copilot Autopilot with its own identity and reasoning layer at Ignite 2026, alongside the MAI Code 2 model family aimed at existing coding assistants.
- **[Google Labs](https://www.testingcatalog.com/early-look-at-loop-new-autonomous-ai-agent-from-google/)** (testingcatalog): Released Stitch Loop, an autonomous product agent that continuously monitors production data and auto-opens PRs for security, latency and accessibility issues.
- **[Oleria](https://finance.yahoo.com/technology/ai/articles/oleria-extends-identity-governance-ai-170000479.html)** (yahoo finance): Launched AI Gateway, extending identity governance to AI agents, tracking each agent's actual permission use with a context graph of 7.2B relationships and 52B events.
- **[Alibaba (Qwen)](https://www.alibabacloud.com/blog/qoderwake-digital-workers-take-the-initiative-%E2%80%94-no-need-to-%40-every-time_603789)** (alibabacloud): Released QoderWake, letting AI digital workers proactively and cost-efficiently handle group-chat requests without an explicit @-mention every time.
- **[Meta](https://www.smartcompany.com.au/artificial-intelligence/your-new-muse-meta-launches-ai-personal-assistant-in-australia/)** (smartcompany): Personal AI agent Muse officially launched in Australia, one of its earliest international markets outside the US, confirming with users before taking sensitive actions.
- **[OpenAI](https://openai.com/index/advancing-chip-design-with-our-models/)** (openai): Published how it used its own models, including GPT-6 Astra, to optimize Jalapeño silicon circuits and RISC-V core design.
- **[Nvidia](https://www.cnbc.com/2026/11/18/nvidia-interim-ceo-kress-addresses-staff-after-jensen-huang-exit-.html)** (cnbc): Q3 earnings beat expectations but the stock still fell 2%; held its first all-hands since founder/CEO Jensen Huang's scandal-driven resignation, with the board confirming he won't return while still searching for a new CEO.

### Models & Infrastructure

- **[Tencent Hunyuan](/posts/daily/2026-11-19-model-tencent-hy4-flash-en)** (our article): Open-sourced Hy4 flash: 224B total parameters (including a 64B Engram lookup module), 12B active parameters, 1M context — WorkIndex task cost is just 1/20 of flagship Hy4 (full model card already in Stage 1)

### Technical Progress

Today's Arxiv Digest looks at three papers on the handoff design flaws in multi-agent shared memory: standard benchmarks can't tell memory architectures apart, delegated investigation lets evidence get stuck between workers and leads, and filtering out conflicting evidence cleanly actually makes systems easier to poison. The shared lesson: agent memory systems usually fail not because they don't remember enough, but because the design around "who should fully see what evidence" is wrong ([AI Agent Arxiv Digest](/posts/daily/2026-11-19-ai-agent-arxiv-digest-en)).

- **[Mastra](https://mastra.ai/blog/introducing-built-in-mcp-server)** (mastra blog): Added a built-in MCP Server to its agent framework, connecting directly to Claude Code/Cursor/VS Code, alongside a Custom Factory and Mastra Forward managed agent-engineering service.
- **[Pydantic AI](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0-en)** (our article): v2.70.0 fixed two high-severity ReDoS vulnerabilities and added harness primitives like ToolSearch and PruneToolResults (full writeup in Stage 1)

### Security Incidents

- **[Google GTIG](https://www.helpnetsecurity.com/2026/11/17/ai-powered-cyberattacks-gtig-report/)** (helpnetsecurity): Threat intel report found fully autonomous AI agents already writing and launching exploits without human involvement; attack events nearly doubled Jan-Aug, with 22 zero-days in August alone.
- **[FBI](https://dev.to/humanbound_ai/attacker-agents-now-turn-fresh-patches-into-exploits-on-their-own-35l7)** (dev.to): Warned that open-source agentic pentest frameworks like ARTEX, CAIRN and CyberStrikeAI have shown up in real intrusions, suspected North Korean actors, including one that tampered with `.claude/settings.json` to plant a backdoor.
- **[Sourcegraph](https://www.bankinfosecurity.com/ai-agent-finds-critical-java-flaw-in-just-3-hours-a-33427)** (bankinfosecurity): Security startup Calif's AI model found the critical Java4Shell flaw (CVE-2026-114938) in just 3 hours.
- **[Microsoft Agent Framework](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer-en)** (our article): PyPI package compromised with a .pth startup-hook credential stealer, leaking Azure/GitHub Actions credentials (full writeup in Stage 1)
  - **Why it matters**: Before adopting a fast-releasing agent framework from PyPI, check who holds publish rights and whether versions are pinned; this is the accountability gap in today's deep dive.

### Tools & Ecosystem

Today's GitHub Digest theme is "security hardening racing to catch up with framework expansion" — Pydantic AI and CrewAI both fixed vulnerabilities in their own code and third-party dependencies on the same day; on the tooling side, Claude-BugHunter broke a thousand stars in a day, Google connected Agent Skills to its own design tool Stitch, and Mastra followed Tencent's LoopForge with its own issue-in, PR-out Factory template ([AI Agent GitHub Digest](/posts/daily/2026-11-19-ai-agent-github-digest-en)).

- **[HYPR](https://www.globenewswire.com/news-release/2026/11/18/3405704/0/en/hypr-launches-agentpass-to-assign-every-ai-agent-to-an-accountable-human.html)** (globenewswire): Launched AgentPass, assigning every AI agent an accountable human owner.
  - **Why it matters**: Turns "who owns this agent" into a product, matching the one-line take: write the accountable owner into the contract before adopting.
- **[Vercel](https://vercel.com/blog/eve-is-now-generally-available)** (vercel blog): eve 1.0 reached general availability, packaging harness and infrastructure for AI agents.
- **[otpkit](/posts/daily/2026-11-19-tool-otpkit-en)** (our article): API-key-free temp email/SMS MCP server that auto-extracts OTP codes (full writeup in Stage 1)

### Regulation & Governance

- **[US Commerce Department](https://www.cnbc.com/2026/11/18/nvidia-us-ai-chip-export-controls-data-centers-.html)** (cnbc): New rules require data centers in Singapore, Malaysia, Thailand, Indonesia and Brazil to get a license before importing advanced AI chips, closing a loophole for remote Chinese access to compute.
- **[Hong Kong AI industry group](https://www.crowdfundinsider.com/2026/11/323415-hong-kong-ai-group-calls-on-businesses-to-strengthen-controls-as-ai-agents-advance/)** (crowdfundinsider): Released a voluntary AI agent governance framework drawing on EU, Singapore, Japan/Korea and US approaches, urging businesses to tighten controls — though it carries no legal force.
- **[US-Japan-India-Australia Quad](https://www.nextgov.com/artificial-intelligence/2026/11/trump-touts-quad-initiative-expand-ai-access-indo-pacific/417286/)** (nextgov): Launched an Indo-Pacific AI initiative coordinating funding and technical assistance for trustworthy AI deployment in the region.
- **[German official](https://www.semafor.com/article/11/17/2026/europe-needs-innovation-friendly-regulation-to-catch-up-on-ai-german-official-says)** (semafor): Called for more innovation-friendly EU AI regulation to catch up in the race, naming the current EU AI Act as raising the bar for European companies.
- **[US + UAE and others](https://www.thenationalnews.com/opinion/editorial/2026/11/18/uae-us-france-ai-artificial-intelligence-regulation-anthropic/)** (thenationalnews): Signed the San Francisco Declaration pledging to protect sensitive technology and critical infrastructure underpinning AI systems; Israel and Qatar joined too, Saudi Arabia did not.
- **[UAE](https://www.fticonsulting.com/insights/articles/the-uaes-federal-authority-for-artificial-intelligence-and-data)** (fticonsulting): Established a Federal Authority for Artificial Intelligence and Data, unifying AI, data governance and digital government under one body.

### Regional Developments

- **China / Hong Kong**: e27 rounded up the 50 companies that defined Asia's AI industry in 2026, highlighting Alibaba, Tencent and Chinese state funds behind the scenes; Hong Kong regulators and industry leaders met to discuss the risks of agentic AI seeping into finance
- **Japan / Korea**: Google rolled out Gemini's autonomous "Tasks" feature for free in Japan, Korea, Canada, Australia and India (powered by the new Gemini 4 Hydrogen model); JPMorgan and South Korea's Hyundai Card completed a proof-of-concept for AI agents autonomously executing FX transactions, planning to expand testing to more complex multi-agent transactions in H1 2027
- **Southeast Asia / South Asia**: Visa expanded its Agentic Ready program across Asia-Pacific to prepare merchants for agent-initiated transactions (see also the Regulation section on new chip-import rules hitting Southeast Asia)
- **Europe**: Paris startup H Company deployed its enterprise agent platform on AWS's European sovereign cloud, keeping data from regulated industries and public-sector clients within the EU
- **Africa**: Cassava Technologies plans to deploy 12,000 NVIDIA GPUs across five African countries in a $720M investment (see also the Google.org grant to Nigeria below)
- **Latin America**: An Inter-American Development Bank report found widespread AI adoption could lift Latin America and Caribbean GDP by 5.1% within a decade; Uruguay has already set up a national AI center
- **Oceania**: Systems integrator Insight launched an enterprise Agent Store across Australia, New Zealand, Singapore and 11 other countries; Meta's Muse is now live in Australia (see Vendor Updates)

We checked for AI agent news specific to Taiwan today and found no qualifying event; see "Today's Take" and the "Deep Dive" above for the reader-facing judgment that applies regardless.

### Business Cases / Funding

- **[Anthropic](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html)** (yahoo finance): Updated IPO filing: selling 825M Class A shares at $70-78, pricing 11/18 ahead of listing on Nasdaq under ticker ANT.
- **[Model ML](https://techcrunch.com/2026/11/17/model-ml-raises-250m-to-automate-investment-banking-grunt-work/)** (techcrunch): $250M Series C at a $1.5B valuation, co-led by General Atlantic and QED Investors, building AI agents for investment bankers.
- **[Arva AI](https://www.scommerce.com/arva-ai-funding/)** (scommerce): $20M Series A led by Arthur Ventures with Y Combinator and Gradient, building banking-compliance AI agents.
- **[Humyn Labs](https://www.business-standard.com/companies/news/ai-startup-humyn-labs-raises-47-million-in-series-a-funding-round-126111800765_1.html)** (business-standard): $47M Series A (equity portion led by Accel), an India-based company collecting physical-world human task data to sell to AI/robotics firms.
- **[Soket AI](https://timesofindia.indiatimes.com/business/india-business/bajaj-finance-pennant-technologies-invest-4mn-in-soket-ai/articleshow/135968881.cms)** (timesofindia): Bajaj Finance and Pennant Technologies jointly invested $4M in this Indian AI startup.
- **[Google.org](https://iwajoo.substack.com/p/who-gets-to-shape-africas-ai-future)** (iwajoo): Nigeria's Helium Health was selected as one of 15 global recipients of the $30M "AI for Government Innovation" program.
- **[Payhawk](/posts/daily/2026-11-19-funding-payhawk-en)** (our article): Series C $280M at a $2B valuation, led by Goldman Sachs Alternatives, pivoting toward an "AI-era finance operating system" (full writeup in Stage 1)

## Key Numbers

| Item | Number | Source |
|------|------|------|
| Anthropic IPO pricing | $70–78/share, 825M shares | [yahoo finance](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html) |
| Microsoft Agent Framework exposure | ~190K monthly downloads | [Security Alert post](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer-en) |
| Google GTIG attack growth | Attack events nearly doubled Jan-Aug; 22 zero-days in August | [helpnetsecurity](https://www.helpnetsecurity.com/2026/11/17/ai-powered-cyberattacks-gtig-report/) |
| US chip export rule coverage | 5 Southeast Asian countries + Brazil data centers now need licenses | [cnbc](https://www.cnbc.com/2026/11/18/nvidia-us-ai-chip-export-controls-data-centers-.html) |
| Nvidia's stock after earnings | Q3 beat expectations but fell 2% on the day, with downgrades from Bernstein, Evercore and others | [cnbc](https://www.cnbc.com/2026/11/18/nvidia-interim-ceo-kress-addresses-staff-after-jensen-huang-exit-.html) |

## Today's Digest Roundup

- :file: [AI Agent Arxiv Digest — 2026-11-19](/posts/daily/2026-11-19-ai-agent-arxiv-digest-en)
- :file: [AI Agent GitHub Digest — 2026-11-19](/posts/daily/2026-11-19-ai-agent-github-digest-en)
- :file: [Framework Update｜Pydantic AI v2.70.0](/posts/daily/2026-11-19-framework-pydantic-ai-v2.70.0-en)
- :file: [Model Card｜Tencent Hy4 flash](/posts/daily/2026-11-19-model-tencent-hy4-flash-en)
- :file: [Funding Flash｜Payhawk Series C $280M](/posts/daily/2026-11-19-funding-payhawk-en)
- :file: [Security Alert｜Microsoft Agent Framework PyPI package compromised with credential stealer](/posts/daily/2026-11-19-security-microsoft-agent-framework-pypi-credential-stealer-en)
- :file: [Tool Pick｜otpkit](/posts/daily/2026-11-19-tool-otpkit-en)
- :file: [AI Engineer Interview Drill — 2026-11-19](/posts/daily/2026-11-19-ai-interview-daily-en)
- :file: [Product Builder Interview Drill — 2026-11-19](/posts/daily/2026-11-19-product-builder-interview-daily-en)

## Watching Tomorrow

- Nvidia's board search for a new CEO and whether the stock stabilizes
- How Anthropic's IPO trades on its Nasdaq debut after the 11/18 pricing, and whether it becomes a template for other AI labs' IPO windows
- Whether more enterprises adopt agent identity-governance tools like HYPR's AgentPass and Oleria's AI Gateway in response to the risks Google's GTIG report surfaced

## Today's Insight

I used to think an agent's accountability problem was mostly a technical design issue — like the delegation strategies and memory architectures in today's three Arxiv papers. Today I realized the human side of accountability has just as big a gap: an entire company's founder and CEO can be pushed out over a personal scandal, leaving the world's most important AI supply chain without its decision-maker for over a week while the company's own governance mechanism still hasn't settled who's responsible or who can come back. That's a more direct reminder than any agent delegation flaw that accountability in a complex system has never been only an AI-side problem.

## References

- [Anthropic IPO: what we know - Yahoo Finance](https://finance.yahoo.com/technology/ai/article/anthropic-ipo-what-we-know-143321078.html)
- [AI Agents News Brief: November 18, 2026 - aiagentsdirectory](https://aiagentsdirectory.com/news/ai-agents-news-brief-november-18-2026)
- [Microsoft's Agent Framework PyPI package compromised - Socket.dev](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer)
- [Early look at Loop, new autonomous AI agent from Google - testingcatalog](https://www.testingcatalog.com/early-look-at-loop-new-autonomous-ai-agent-from-google/)
- [AI-powered cyberattacks, GTIG report - helpnetsecurity](https://www.helpnetsecurity.com/2026/11/17/ai-powered-cyberattacks-gtig-report/)
- [Attacker agents now turn fresh patches into exploits on their own - dev.to](https://dev.to/humanbound_ai/attacker-agents-now-turn-fresh-patches-into-exploits-on-their-own-35l7)
- [AI agent finds critical Java flaw in just 3 hours - bankinfosecurity](https://www.bankinfosecurity.com/ai-agent-finds-critical-java-flaw-in-just-3-hours-a-33427)
- [HYPR launches AgentPass - globenewswire](https://www.globenewswire.com/news-release/2026/11/18/3405704/0/en/hypr-launches-agentpass-to-assign-every-ai-agent-to-an-accountable-human.html)
- [Oleria extends identity governance to AI agents - Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/oleria-extends-identity-governance-ai-170000479.html)
- [eve is now generally available - Vercel](https://vercel.com/blog/eve-is-now-generally-available)
- [Introducing built-in MCP server - Mastra](https://mastra.ai/blog/introducing-built-in-mcp-server)
- [QoderWake: digital workers take the initiative - Alibaba Cloud](https://www.alibabacloud.com/blog/qoderwake-digital-workers-take-the-initiative-%E2%80%94-no-need-to-%40-every-time_603789)
- [Your new Muse: Meta launches AI personal assistant in Australia - smartcompany](https://www.smartcompany.com.au/artificial-intelligence/your-new-muse-meta-launches-ai-personal-assistant-in-australia/)
- [Advancing chip design with our models - OpenAI](https://openai.com/index/advancing-chip-design-with-our-models/)
- [Nvidia interim CEO Kress addresses staff after Jensen Huang exit - CNBC](https://www.cnbc.com/2026/11/18/nvidia-interim-ceo-kress-addresses-staff-after-jensen-huang-exit-.html)
- [US AI chip export controls on data centers - CNBC](https://www.cnbc.com/2026/11/18/nvidia-us-ai-chip-export-controls-data-centers-.html)
- [Hong Kong AI group calls on businesses to strengthen controls - crowdfundinsider](https://www.crowdfundinsider.com/2026/11/323415-hong-kong-ai-group-calls-on-businesses-to-strengthen-controls-as-ai-agents-advance/)
- [Trump touts Quad initiative to expand AI access in Indo-Pacific - nextgov](https://www.nextgov.com/artificial-intelligence/2026/11/trump-touts-quad-initiative-expand-ai-access-indo-pacific/417286/)
- [Europe needs innovation-friendly regulation to catch up on AI - Semafor](https://www.semafor.com/article/11/17/2026/europe-needs-innovation-friendly-regulation-to-catch-up-on-ai-german-official-says)
- [UAE, US, France AI regulation declaration - The National](https://www.thenationalnews.com/opinion/editorial/2026/11/18/uae-us-france-ai-artificial-intelligence-regulation-anthropic/)
- [The UAE's Federal Authority for Artificial Intelligence and Data - FTI Consulting](https://www.fticonsulting.com/insights/articles/the-uaes-federal-authority-for-artificial-intelligence-and-data)
- [50 Asian AI companies that defined 2026 - e27](https://e27.co/cheques-bans-and-bell-ringing-50-asian-ai-companies-that-defined-2026-20261118/)
- [Agentic AI seeps into finance, concerns grow - SCMP](https://www.scmp.com/business/banking-finance/article/3374724/agentic-ai-seeps-finance-concerns-grow-over-new-risks-and-blind-spots)
- [You can now assign Gemini 'tasks' for free in six countries - 9to5google](https://9to5google.com/2026/11/17/gemini-tasks-free/)
- [JPMorgan is working on AI agent transactions that don't involve humans - CNBC](https://www.cnbc.com/amp/2026/11/18/jpmorgan-hyundai-card-ai-agents-payments.html)
- [Visa expands Agentic Ready in Asia Pacific - tribuneindia](https://www.tribuneindia.com/news/advertorial-disclaimer/visa-expands-agentic-ready-to-help-scale-trusted-ai-commerce-in-asia-pacific)
- [French AI startup H Company puts agents on AWS European sovereign cloud - actuia](https://www.actuia.com/en/news/french-ai-startup-h-company-puts-agents-on-aws-european-sovereign-cloud/)
- [Cassava Technologies plans $720M AI infrastructure rollout in five African countries - asaaseradio](https://asaaseradio.com/cassava-technologies-plans-720m-ai-infrastructure-rollout-in-five-african-countries/)
- [IDB weekly digest - puentelatam](https://puentelatam.substack.com/p/puente-latam-weekly-digest-november-58a)
- [Insight launches Agent Store, engineering program - arnnet](https://www.arnnet.com.au/article/4249944/insight-launches-agent-store-engineering-program-to-accelerate-enterprise-ai-adoption.html)
- [Model ML raises $250M to automate investment banking grunt work - TechCrunch](https://techcrunch.com/2026/11/17/model-ml-raises-250m-to-automate-investment-banking-grunt-work/)
- [Arva AI funding - scommerce](https://www.scommerce.com/arva-ai-funding/)
- [AI startup Humyn Labs raises $47 million in Series A - Business Standard](https://www.business-standard.com/companies/news/ai-startup-humyn-labs-raises-47-million-in-series-a-funding-round-126111800765_1.html)
- [Bajaj Finance, Pennant Technologies invest $4mn in Soket AI - Times of India](https://timesofindia.indiatimes.com/business/india-business/bajaj-finance-pennant-technologies-invest-4mn-in-soket-ai/articleshow/135968881.cms)
- [Who gets to shape Africa's AI future - iwajoo](https://iwajoo.substack.com/p/who-gets-to-shape-africas-ai-future)
