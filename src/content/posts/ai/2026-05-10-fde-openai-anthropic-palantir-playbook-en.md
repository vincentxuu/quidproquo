---
title: "The FDE War: Why OpenAI and Anthropic Are Both Copying Palantir's Playbook"
date: 2026-05-10
type: deep-dive
category: ai
tags: [fde, forward-deployed-engineer, openai, anthropic, palantir, enterprise-ai, deployment]
lang: en
tldr: "MIT research says 95% of enterprise AI pilots yield zero return. OpenAI and Anthropic announced multi-billion-dollar joint ventures in the same week, wholesale adopting the Forward Deployed Engineer model that Palantir has used for over a decade to bring AI into the enterprise battlefield."
description: "OpenAI's The Deployment Company and the Anthropic-Blackstone-Goldman joint venture were both formed in the same week. Why did two top AI labs choose to replicate Palantir's FDE model? This post breaks down the capital structures, strategic intent, and what it all means for enterprise AI, the consulting industry, and Palantir itself."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-10-fde-openai-anthropic-palantir-playbook)

Why do the most powerful AI models still underwhelm inside most enterprises? Why do so many companies finish countless PoCs and still have no idea how to actually deploy AI into their core business?

The answer is straightforward: cutting-edge AI has never been a plug-and-play API.

In the same week in early May 2026, OpenAI and Anthropic each announced a massive joint venture, using a nearly identical playbook to solve this problem. That playbook is the Forward Deployed Engineer (FDE) model that Palantir has used for over a decade.

## Palantir Already Proved This Path Works

FDE is not a new concept. When Palantir was founded in the early 2000s, its target customers were intelligence agencies. The product couldn't be shown publicly, and there was no "marketing website" for demos. They invented an internal role called "Delta": sending top-tier engineers directly into client offices to sit alongside analysts, observe how they used tools, identify where they got stuck, and write code on the spot to solve problems.

The biggest difference between this model and a "solutions consultant" or "sales engineer" is that **FDEs actually write production code** -- they don't make slide decks. Pragmatic Engineer highlighted a key metric: before 2016, Palantir had more FDEs than general software engineers. The company was essentially structured as "field engineers first, platform engineers second."

It wasn't until the Foundry platform gradually took shape that lessons learned in the field were abstracted and fed back into the product itself. But FDEs never disappeared -- they became the key to Palantir's high gross margins. Customers were buying "outcomes," not licenses.

## Why Selling APIs Alone Is No Longer Enough

A widely cited MIT study found that 95% of enterprise AI pilots produced "zero measurable return." RAND's numbers were even harsher: AI project failure rates exceed 80%, double that of traditional IT projects.

This isn't because the models aren't good enough. It's because most enterprises simply don't know how to turn "an impressive model" into "something that actually works." You can hand a bank the Claude API, and they might build a decent chatbot -- and then that's it.

What enterprises pay for isn't "AI capability" -- it's "AI deployment." Deployment is something you can't teach through API documentation and online videos alone. It requires someone to actually go inside the client organization and handle data governance, internal system integration, SSO, permissions, auditing, compliance -- all the "dirty work."

## OpenAI's The Deployment Company: A $10 Billion Palantir Clone

In early May 2026, OpenAI finalized a joint venture codenamed **The Deployment Company** (called DeployCo in early documents), with a pre-money valuation of approximately $10 billion and over $4 billion raised externally. Investors include 19 institutions, with TPG as the anchor investor. Other major participants include Brookfield Asset Management, Advent International, Bain Capital, SoftBank, Dragoneer, and Goanna Capital.

Several key design choices are worth noting:

- **OpenAI itself contributed $500 million** (with an option to increase to $1.5 billion), while maintaining strategic control through super-voting shares.
- **PE investors receive a guaranteed 17.5% annualized return over five years.** This structure makes the investment look more like "infrastructure credit" than venture equity on the books, essentially converting OpenAI's growth potential into a fixed-income product that PE can underwrite.
- **Combined, these PE firms control over 2,000 portfolio companies** spanning healthcare, manufacturing, finance, retail, and logistics -- giving OpenAI a captive enterprise customer base overnight.

DeployCo's business model is nearly a carbon copy of Palantir's: deploy engineers inside client organizations, redesign workflows, automate processes, integrate systems, and charge through a hybrid services-plus-software pricing model -- monetizing at the "deployment" layer, not just the "model call" layer.

## Anthropic's Two-Front Offensive: Accenture + Wall Street JV

Anthropic didn't build a single DeployCo. Instead, it advanced on two fronts simultaneously.

**Front one: Accenture.** In December 2025, Anthropic and Accenture announced the formation of the **Accenture Anthropic Business Group**, which will train **approximately 30,000 Accenture employees** to use Claude. This includes what Accenture calls "reinvention deployed engineers" -- engineers deployed directly to client sites to embed Claude into business processes. Anthropic CEO Dario Amodei called this "the largest-scale Claude Code deployment in our history."

**Front two: Wall Street joint venture.** On May 4, 2026, Anthropic, Blackstone, Hellman & Friedman, and Goldman Sachs announced a $1.5 billion joint venture:

- Anthropic, Blackstone, and Hellman & Friedman each contributed approximately $300 million, with Goldman Sachs contributing approximately $150 million.
- The remainder was filled by Apollo, General Atlantic, Leonard Green, GIC, Sequoia Capital, and others.
- The target customers are **mid-market enterprises**, particularly healthcare, manufacturing, financial services, retail, and real estate companies within PE portfolios.

Goldman's Global Head of Asset and Wealth Management, Marc Nachmann, said something crucial on CNBC: "The purpose of this company is to democratize forward-deployed engineers." This is the Palantir model restated in investment banking language.

## Why Joint Ventures Specifically?

Both top labs independently chose the JV route, driven by several realities:

1. **Scaling FDEs can't rely on internal hiring alone.** It took Palantir twenty years to cultivate its FDE culture. OpenAI and Anthropic don't have that kind of time. Leveraging consulting firms (Accenture) and PE's existing talent and client networks is the only way to scale to tens of thousands of people within two to three years.
2. **PE portfolios are ready-made customer pools.** Technology evaluation, procurement, and internal politics can be accelerated "top-down" in PE-controlled companies.
3. **Capital structure optimization.** For OpenAI and Anthropic, this part of the business is essentially a high-margin, labor-intensive services operation with lower valuation multiples than the models themselves. Housing it in a joint venture prevents it from dragging down the parent company's valuation multiples, while allowing PE to structure guaranteed returns as underwritable credit.

## Is This Cooperation or Competition with Palantir?

Both. Here's how to understand the stack:

- **Bottom layer -- the operating system (Palantir's moat):** Palantir's real strength isn't AI -- it's the **Ontology**, which transforms chaotic, siloed enterprise data into structured, governable digital twins that AI can safely operate on.
- **Top layer -- the intelligence engine (OpenAI/Anthropic's core advantage):** The most powerful reasoning and generation models.

In theory, the two are complementary, and many of the most complex deployments should combine Palantir Ontology with OpenAI/Anthropic models. But as OpenAI and Anthropic penetrate deeper into enterprise processes through FDEs, they will inevitably encroach on Palantir's "implementation layer" revenue. The high margins Palantir previously defended through FDEs are now being directly challenged by new competitors using the exact same playbook.

## What This Means for the Market

**Short term (2026-2027):** The consulting industry is the biggest beneficiary. Accenture gains a massive new revenue line overnight. Deloitte and Cognizant are also entering through Anthropic's Claude Partner Network. These large SIs suddenly have tens of thousands of people with "top AI lab certification + FDE training" that they can bill out.

**Medium term (2027-2028):** Enterprise AI adoption will accelerate noticeably, but won't explode overnight. Data quality, organizational change management, and procurement processes remain bottlenecks. A more reasonable expectation: by 2028, we'll see significantly more AI actually reaching production, rather than stalling at the demo stage.

**For OpenAI / Anthropic themselves:** They're transforming from "research institutions / model providers" into "enterprise transformation partners."
- Revenue structure shifts from API token billing to API + high-value services.
- Customer stickiness increases dramatically -- engineers are already sitting with client teams, having built extensive customizations. The cost of switching providers becomes very high.
- The moat against open-source models widens -- even with free open-source models available, enterprises still need someone to help them deploy, and that "someone" is increasingly sent by OpenAI and Anthropic themselves.

## The Big Picture

This isn't a financing story -- it's a strategic repositioning. OpenAI and Anthropic have recognized that the gap in model capability is no longer the bottleneck for enterprise AI adoption; deployment capability is. Whoever can place tens of thousands of engineers who "write production code and speak the language of business" into mid-market enterprise offices will dominate the next decade's enterprise AI budget.

The "Forward Deployed Engineer" -- a role invented over a decade ago by a secretive intelligence technology company -- is becoming one of the hottest job titles in the 2026 tech industry. The ground war has only just begun.

## References

### Official Company Sources

**Anthropic**
- [Building a new enterprise AI services company with Blackstone, Hellman & Friedman, and Goldman Sachs (Anthropic, 2026/5/4)](https://www.anthropic.com/news/enterprise-ai-services-company)
- [Accenture and Anthropic launch multi-year partnership to move enterprises from AI pilots to production (Anthropic, 2025/12/9)](https://www.anthropic.com/news/anthropic-accenture-partnership)
- [Anthropic invests $100 million into the Claude Partner Network (Anthropic)](https://www.anthropic.com/news/claude-partner-network)
- [Anthropic raises $30 billion in Series G funding at $380 billion post-money valuation (Anthropic)](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation)

**Blackstone / Goldman Sachs / Hellman & Friedman**
- [Anthropic Partners with Blackstone, Hellman & Friedman, and Goldman Sachs to Launch Enterprise AI Services Firm (Blackstone official press release, 2026/5/4)](https://www.blackstone.com/news/press/anthropic-partners-with-blackstone-hellman-friedman-and-goldman-sachs-to-launch-enterprise-ai-services-firm/)
- [Anthropic Partners with Blackstone, Hellman & Friedman, and Goldman Sachs to Launch Enterprise AI Services Firm (BusinessWire joint release, with Goldman and H&F executive quotes)](https://www.businesswire.com/news/home/20260503427206/en/Anthropic-Partners-with-Blackstone-Hellman-Friedman-and-Goldman-Sachs-to-Launch-Enterprise-AI-Services-Firm)

**Accenture**
- [Accenture and Anthropic Launch Multi-Year Partnership to Drive Enterprise AI Innovation and Value Across Industries (Accenture Newsroom, 2025/12/9)](https://newsroom.accenture.com/news/2025/accenture-and-anthropic-launch-multi-year-partnership-to-drive-enterprise-ai-innovation-and-value-across-industries)
- [Accenture and Anthropic Team to Help Organizations Secure, Scale AI-Driven Cybersecurity Operations (Accenture Newsroom, 2026)](https://newsroom.accenture.com/news/2026/accenture-and-anthropic-team-to-help-organizations-secure-scale-ai-driven-cybersecurity-operations)

**OpenAI** (Note: "The Deployment Company / DeployCo" currently appears only in Bloomberg, Reuters, and FT reports. OpenAI has not issued a standalone announcement. The earliest official OpenAI document mentioning the FDE role is the Frontier platform introduction page.)
- [Introducing OpenAI Frontier -- explicitly mentions "OpenAI Forward Deployed Engineers (FDEs)" deploying agents alongside customers (OpenAI official)](https://openai.com/index/introducing-openai-frontier/)
- [OpenAI raises $122 billion to accelerate the next phase of AI (OpenAI official, mentions enterprise deployment flywheel)](https://openai.com/index/accelerating-the-next-phase-ai/)

**Palantir** (official descriptions of the FDE / Delta model)
- [Dev versus Delta: Demystifying engineering roles at Palantir (Palantir Blog, official explanation of the two engineering roles)](https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87)
- [A Day in the Life of a Palantir Forward Deployed Software Engineer (Palantir Blog)](https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1)
- [Who Wants to be a Delta? (Palantir Blog)](https://blog.palantir.com/who-wants-to-be-a-delta-8d2ea948035)
- [Palantir Careers -- Students and Early Talent (official Forward Deployed Software Engineer job description)](https://www.palantir.com/careers/students-and-early-talent/)

### Major News Coverage

**OpenAI The Deployment Company**
- [OpenAI closes The Deployment Company, a $10bn enterprise AI bet on private equity (TheNextWeb)](https://thenextweb.com/news/openai-deployco-finalized-10-billion-joint-venture)
- [OpenAI bags over $4B to build 'Deployment Company' with TPG, Brookfield, Bain (TFN)](https://techfundingnews.com/openai-bags-over-4b-to-build-deployment-company-with-tpg-brookfield-bain-for-enterprise-ai-rollout-report/)
- [TPG, Bain, Brookfield, and Advent in talks with OpenAI on $10bn enterprise AI venture (PE Insights)](https://pe-insights.com/tpg-bain-brookfield-and-advent-in-talks-with-openai-on-10bn-enterprise-ai-venture/)
- [OpenAI's $10B Joint Venture: PE-Backed Enterprise AI Distribution Explained (TeckNexus)](https://tecknexus.com/openais-10b-joint-venture-pe-backed-enterprise-ai-distribution-explained/)

**Anthropic x Wall Street**
- [Anthropic, Goldman and others launch $1.5 billion AI venture (CNBC, 2026/5/4)](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html)
- [Anthropic forms $1.5B joint venture with Blackstone, Goldman Sachs (Yahoo Finance)](https://finance.yahoo.com/sectors/technology/articles/anthropic-forms-1-5b-joint-123147935.html)
- [Anthropic's $1.5B JV with Blackstone (Augment Pulse strategic analysis)](https://augment.market/pulse/anthropics-1-5b-jv-with-blackstone)

### Forward Deployed Engineer Model (Industry Analysis)
- [What are Forward Deployed Engineers, and why are they so in demand? (Pragmatic Engineer)](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)
- [So You Want to Hire a Forward Deployed Engineer (First Round Review)](https://review.firstround.com/so-you-want-to-hire-a-forward-deployed-engineer/)
- [Understanding Forward Deployed Engineering (barry.ooo)](https://www.barry.ooo/posts/fde-culture)
- [What's a Forward Deployed Engineer? (Technically)](https://technically.dev/posts/whats-a-forward-deployed-engineer)
- [Forward Deployed Engineering: From Deployment to Delivery Intelligence (Ideas2IT)](https://www.ideas2it.com/blogs/forward-deployed-engineer)
