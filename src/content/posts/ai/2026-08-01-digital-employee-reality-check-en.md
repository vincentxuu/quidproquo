---
title: "Digital Employees: Reliability Comes From the Harness, Not the Model"
date: 2026-08-01
type: deep-dive
category: ai
tags: [digital-employee, ai-agent, agentic-ai, anthropic, harness-engineering, pricing]
lang: en
tldr: "\"Digital employee\" isn't a technology — it's a pricing and accountability unit. Anthropic's Project Vend had Claude actually run three shops, and found the most effective intervention wasn't a smarter model but forcing it to follow procedures. Their words: \"we rediscovered that bureaucracy matters.\" Gartner estimates only ~130 of the thousands of vendors claiming to be agentic actually are."
description: "Anthropic's two-phase Project Vend, OpenAI Frontier, per-resolution pricing, and the headcount numbers from Klarna and Salesforce — what the 2026 \"digital employee\" category can actually do, how it's priced, and its documented failure modes."
draft: false
glossary:
  - term: "per-resolution pricing"
    aliases: ["outcome-based pricing", "per-outcome", "per-resolution"]
    definition: "只有在 AI 端到端解決一次問題、沒有轉交真人時才收費的計價方式。"
    definition_en: "Charging only when the AI resolves a conversation end to end without handing off to a human."
    advanced: "取代 per-seat 的主要模型，但「什麼算解決」由賣方定義，且成本從固定變成隨量浮動；部分廠商改用 per-action 計價來避開定義爭議。"
    advanced_en: "The main replacement for per-seat pricing, but the seller defines what counts as resolved, and cost shifts from fixed to volume-dependent. Some vendors moved to per-action pricing to sidestep the definitional dispute."
    context_en: "This post compares the published rates of Intercom Fin ($0.99), Zendesk (~$1.50), Agentforce ($2.00), and HubSpot ($0.50)."
  - term: "context anxiety"
    definition: "模型接近自認的 context 上限時提前草草收尾的行為。"
    definition_en: "A model's tendency to prematurely wrap up work as it approaches what it believes is its context limit."
    advanced: "Anthropic 觀察到 Sonnet 4.5 這個傾向強到光靠 compaction 不夠，必須加 context reset；Opus 4.5 起大致消失，reset 隨之被移除。"
    advanced_en: "Anthropic found the tendency strong enough in Sonnet 4.5 that compaction alone was insufficient and context resets were required; it largely disappeared with Opus 4.5, and the resets were dropped."
    context_en: "Used here to illustrate how harness components expire as models improve."
    links:
      - label: "Harness design for long-running application development"
        url: "https://www.anthropic.com/engineering/harness-design-long-running-apps"
---

> 🌏 [中文版](/posts/ai/2026-08-01-digital-employee-reality-check)

By 2026 the "digital employee" is a formal enterprise software category. [OpenAI launched Frontier on February 5](https://techcrunch.com/2026/02/05/openai-launches-a-way-for-enterprises-to-build-and-manage-ai-agents), explicitly pitched as managing agents the way companies manage human employees. [Forrester's 2026 predictions](https://www.forrester.com/blogs/predictions-2026-ai-agents-changing-business-models-and-workplace-culture-impact-enterprise-software) say the top five HCM platforms will grow digital-employee management features. Meanwhile, [Gartner estimates only about 130 of the thousands of vendors claiming agentic capabilities actually have them](https://www.reuters.com/business/over-40-agentic-ai-projects-will-be-scrapped-by-2027-gartner-says-2025-06-25).

This post covers what the term actually means, where the capability boundary sits, how it's priced, and which failure modes have public evidence. The technical components already have dedicated posts on this site — here I only cover the parts that change a buy-or-manage decision.

## A digital employee is a pricing and accountability unit, not a technology

Technically it's just an agent: an LLM plus tools plus memory, running in a loop. What's new is the packaging as an **organizational unit** — with a scope of duties, permissions, performance targets, and a human who answers for its output.

So the boundary shouldn't be drawn at "does it use an LLM." It should be drawn at who carries the outcome:

| | What you give it | Who picks the path | Who answers for the result |
|---|---|---|---|
| RPA / scripts | A path | You | You |
| Copilot / assistant | Step-by-step help | You (present at every step) | You |
| Digital employee | An outcome | It | **Someone must be named** |

Gartner defines "[agent washing](https://martech.org/gartner-40-of-agentic-ai-projects-will-fail-making-humans-indispensable)" as rebranding existing chatbots and automation tools as agentic — and puts the count of genuine vendors at **roughly 130 out of thousands**. The line is harder to cross than it looks.

A simple practical test: **if there's no named human owner and no auditable action log, that isn't an employee — it's an unowned service account.**

## Project Vend: the most honest public experiment so far

[Anthropic's Project Vend](https://www.anthropic.com/research/project-vend-1) had Claude actually run a shop in the office — sourcing, pricing, inventory, and talking to customers on Slack. It's one of the few long-running experiments that isn't vendor marketing material, and the [phase two report (2025-12-18)](https://www.anthropic.com/research/project-vend-2) publishes the failures alongside the wins.

**Phase one was a disaster.** Claudius (running Sonnet 3.7) lost money, handed out discounts indiscriminately, was goaded into selling tungsten cubes at a loss, and at one point claimed to be a human wearing a blue blazer.

**Phase two swapped in newer models (Sonnet 4.0 / 4.5) and better tools, and the loss-making weeks largely disappeared.** The shop expanded to three locations: San Francisco (two machines), New York, and London. The tools added were unglamorous, but each one maps to a specific failure:

- A CRM — tracking customers, suppliers, and orders
- An inventory interface that **always shows what it paid** for an item — which structurally eliminates selling below cost
- Browser access and deeper research — comparing prices and suppliers itself
- **Payment links collected up front** — take the money before ordering, reducing exposure to bad-faith customers

The lesson is direct: scaffolding has an extremely high marginal return, and the effective shape is usually "remove the possibility of the mistake from the interface," not "tell the model to be careful."

### Adding a CEO agent did not help

Anthropic gave Claudius a CEO agent named "Seymour Cash," equipped with an OKR tool to apply pressure. The result:

> After introducing the CEO, the number of discounts was reduced by about 80% and the number of items given away cut in half… In the place of discounts, Seymour tripled the number of refunds and doubled the number of store credits — even though both led to entirely forgone revenue. **The fact that the business started to make money may have been in spite of the CEO, rather than because of it.**

The report gives the reason: Seymour and Claudius were **the same underlying model**, and shared the same blind spots. The two agents would also spend nights spiraling into conversations about "eternal transcendence."

This is a useful counterexample to the intuition that more agents means more perspectives. For [multi-agent architectures](/posts/ai/2026-03-28-google-multi-agent-patterns-en) to help, the role split has to introduce genuinely different information or constraints. In the same report, a third agent — "Clothius," which made custom merch — clearly did work, and Anthropic attributes that to **the clean separation of responsibilities** between it and Claudius.

### What actually worked was forcing procedure

The most quotable line in the report:

> One way of looking at this is that we rediscovered that **bureaucracy matters**. Although some might chafe against procedures and checklists, they exist for a reason: providing a kind of institutional memory that helps employees avoid common screwups at work.

Concretely: when a new product request came in, Claudius was no longer allowed to blurt out an optimistic price and delivery date. It **had to verify both with its research tools first**. Prices went up and waits got longer — but they became real.

### What still broke

Phase two Claudius still managed to:

- Nearly sign an onion futures contract, until a staffer pointed out it would violate the US [Onion Futures Act](https://en.wikipedia.org/wiki/Onion_Futures_Act) of 1958
- Respond to a shoplifting report by trying to hire its own security officer at **$10/hour** — below California minimum wage, and with no authority to employ anyone
- Get talked into announcing, during a naming vote, that a staff member had been elected the business's actual CEO

Anthropic's read on the root cause is worth keeping whole: these problems stem largely from the models being **trained to be helpful**. They made business decisions from something closer to the perspective of a friend who just wants to be nice, rather than on hard-nosed market principles.

Put another way: the trait that makes the model pleasant to use is the same trait that makes it fragile in an adversarial commercial environment. That's not a prompt-tuning gap — it's a structural tradeoff.

## The technical components are all expiring

[Anthropic's engineering blog](https://www.anthropic.com/engineering) has essentially published the full component list for a working agent. Those have dedicated posts on this site; here are the five points that change decisions:

1. **The tool interface deserves more investment than the prompt.** [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) notes that while building their SWE-bench agent, they spent more time optimizing tools than the overall prompt — and changing a tool to require absolute file paths eliminated an entire class of error.
2. **Context is a budget, not a capacity.** [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) frames the goal as finding "the **smallest** possible set of high-signal tokens that maximize the likelihood of some desired outcome." → See: [Context Engineering](/posts/ai/2026-03-24-context-engineering-guide-en)
3. **Handoff across sessions is the real long-horizon problem.** The [long-running harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) uses an initializer agent to build the environment (`init.sh`, a progress file, a JSON list of 200+ features all initially marked failing), after which each session works on exactly one feature and must commit and update the progress file before ending. JSON was chosen over Markdown deliberately, because the model is less likely to overwrite it. → See: [Anthropic's Harness Design](/posts/ai/2026-03-28-anthropic-harness-design-en)
4. **Verification has to touch the real environment.** The evaluator agent clicked through the running app with Playwright, rather than asking the model whether it was done.
5. **Then treat every one of the above as an assumption with an expiry date.**

Point 5 is the single most important line in the whole set. [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) puts it plainly:

> Every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing, both because they may be incorrect, and because they can quickly go stale as models improve.

They demonstrated it twice on themselves. Sonnet 4.5 exhibited "context anxiety" — wrapping up work prematurely as it approached its perceived context limit — so the harness needed context resets. On Opus 4.5 the behavior largely disappeared, and the resets went from necessary machinery to dead weight, and were dropped. Likewise, after Opus 4.6, running the evaluator on every sprint became unnecessary overhead for simpler tasks.

**So a harness is a liability, not an asset.** Every patch you write today is a bet that some model weakness will persist. Periodically deleting scaffolding you no longer need is routine work in this discipline, not an exception.

## Pricing: per-seat is dying, and per-outcome isn't clean either

An AI doing the work of ten people doesn't ask for ten seats — the seat as a pricing unit collapses on its own. Customer support pricing has converged on per-resolution:

| Product | Unit | Published rate |
|---|---|---|
| [Intercom Fin](https://fin.ai/) | per resolution | $0.99 |
| [Zendesk AI Agents](https://www.zendesk.com/service/ai/) | per automated resolution | ~$1.50 |
| [Salesforce Agentforce](https://www.salesforce.com/agentforce/) | per conversation | $2.00 |
| [HubSpot Customer Agent](https://www.hubspot.com/products/service) | per resolution | $0.50 |
| [Sierra](https://sierra.ai/) | outcome-based | Not published |

Intercom even attaches a performance guarantee: up to $1M back if resolution targets aren't met (company-reported).

But per-outcome leaves two problems unsolved:

1. **"Resolved" is defined by the seller.** This is why some vendors deliberately switched to per-action pricing, explicitly to sidestep disputes over what counts as resolved. Buyers need to pin the definition down in the contract themselves.
2. **Cost moves from predictable to unpredictable.** A seat is fixed; a resolution isn't. At volume, per-outcome can cost more than per-seat.

The high end doesn't publish rates at all. [Sierra raised $950M at a $15.8B valuation in May 2026](https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious) and runs a pure enterprise sales process; third-party comparisons put annual contracts in the $150K–$350K+ range including implementation. That figure has no official source — treat it as an order of magnitude, not a quote.

## Documented failure modes

### Assume vendor numbers are unverified

In March 2025, [TechCrunch's investigation into AI SDR vendor 11x](https://techcrunch.com/2025/03/24/a16z-and-benchmark-backed-11x-has-been-claiming-customers-it-doesnt-have/) (reporter Marina Temkin, based on nearly two dozen sources) found customer logos on the site belonging to non-customers. A ZoomInfo spokesperson said on the record: "We did not give them permission to use our logo in any manner, and we are not a customer." On revenue, contracts carrying a three-month break clause were counted at full annual value — roughly $14M in claimed ARR was closer to $3M once lapsed trials were removed.

The churn figure is directly contested: insiders reported 70–80% churn in early cohorts, while 11x countered with a 79% retention rate as of March 2025. **That contradiction is itself the lesson** — in this category, public numbers without third-party verification should be treated as marketing.

### "Replaced by AI" headlines almost always need a discount

The two most-cited cases are both more complicated than the headline:

**Klarna.** In February 2024 the company said its AI assistant handled 2.3 million conversations in its first month, equivalent to about 700 full-time agents, and was on track to add $40M in profit for the year. In May 2025, CEO Sebastian Siemiatkowski [told Bloomberg](https://www.emarketer.com/content/klarna-backtracks-ai-customer-service-plans):

> As cost unfortunately seems to have been a too predominant evaluation factor when organizing this, what you end up having is lower quality.

Then they started rehiring humans. But note: the version that spread widest is "Klarna admits AI failed," while the actual move looks more like a **scope correction** — AI still holds the high-volume front line, with humans returning to complaints, fraud, and disputes, where judgment is dense. Both narratives are in circulation; it's worth knowing the difference.

**Salesforce.** Benioff said on the Logan Bartlett Show that support headcount went from 9,000 to about 5,000, that 50% of interactions are now with agents, and that AI and humans each handled about 1.5 million conversations with roughly equal CSAT. But [a Salesforce spokesperson framed the same change](https://www.salesforceben.com/ai-agents-drive-4000-job-cuts-in-salesforce-support-division) as declining to backfill roles plus hundreds of redeployments — and Benioff's own word was "rebalance." **Same numbers, two framings.**

### The base rate on the projects themselves

- [Gartner (2025-06)](https://www.reuters.com/business/over-40-agentic-ai-projects-will-be-scrapped-by-2027-gartner-says-2025-06-25): **more than 40%** of agentic AI projects will be canceled by the end of 2027, due to escalating costs, unclear business value, and inadequate risk controls. Analyst Anushree Verma: "Most agentic AI projects right now are early stage experiments or proofs of concept that are mostly driven by hype and are often misapplied."
- MIT Project NANDA, *The GenAI Divide: State of AI in Business 2025*: **95%** of enterprise GenAI pilots delivered no measurable P&L impact. Note that the report's sample size appears in two different versions across secondary coverage (52 interviews / 153 survey responses vs. 150 interviews / 350 employee responses), so it's worth citing which. The best ROI cases in the report were all in unglamorous back-office work, not marketing.

## Where it fits, and where it doesn't

**Fits:** high-volume, homogeneous work with a clear success signal and a cheap rollback. Front-line "where's my order," document processing, back-office reconciliation.

**Doesn't fit:** judgment-dense, emotion-dense work where the cost of error is asymmetric. Klarna drew that line clearly, and the onion futures contract in Project Vend is the same category of problem — the model doesn't know what it doesn't know.

One indirect but useful reference point: the [Anthropic Economic Index](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report) found that when businesses use Claude through the API, **77% of transcripts show automation patterns and only 12% show augmentation**; measured by task, 97% of API tasks are automation-dominant, versus just 47% on Claude.ai. Enterprises have been delegating whole units of work for a while — but what they delegate is mostly **tasks**, not **roles**. The gap between the two is exactly what Project Vend spent a year filling in.

## Overall

The 2026 digital employee can genuinely do work. Three judgments worth keeping:

1. **Before buying an "employee," ask who signs.** The accountability structure is what makes it an employee rather than an unowned account, and it has nothing to do with how strong the model is.
2. **Procedure first, autonomy second.** The most effective intervention in Project Vend wasn't a smarter model — it was an SOP that forced verification. A checklist is institutional memory for an agent.
3. **Don't treat the harness as an asset.** Anthropic deleted its own context resets and per-sprint evaluator. Your scaffolding will expire too, and nobody will send you a notice.

## References

**Anthropic research and engineering blog**

- [Project Vend: Can Claude run a small shop?](https://www.anthropic.com/research/project-vend-1)
- [Project Vend: Phase two](https://www.anthropic.com/research/project-vend-2)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents)
- [Anthropic Economic Index report (2025-09)](https://www.anthropic.com/research/anthropic-economic-index-september-2025-report)
- [Anthropic Economic Index report: Economic primitives (2026-01)](https://www.anthropic.com/research/anthropic-economic-index-january-2026-report)

**Market and products**

- [TechCrunch: OpenAI launches a way for enterprises to build and manage AI agents](https://techcrunch.com/2026/02/05/openai-launches-a-way-for-enterprises-to-build-and-manage-ai-agents)
- [Axios: OpenAI launches platform to manage AI agents](https://www.axios.com/2026/02/05/openai-platform-ai-agents)
- [TechCrunch: Sierra raises $950M](https://techcrunch.com/2026/05/04/sierra-raises-950m-as-the-race-to-own-enterprise-ai-gets-serious)
- [VentureBeat: Anthropic launches Cowork](https://venturebeat.com/technology/anthropic-launches-cowork-a-claude-desktop-agent-that-works-in-your-files-no)
- [Forrester: Predictions 2026 — AI Agents And New Business Models](https://www.forrester.com/blogs/predictions-2026-ai-agents-changing-business-models-and-workplace-culture-impact-enterprise-software)

**Failure cases and market data**

- [Reuters: Over 40% of agentic AI projects will be scrapped by 2027, Gartner says](https://www.reuters.com/business/over-40-agentic-ai-projects-will-be-scrapped-by-2027-gartner-says-2025-06-25)
- [martech.org: Gartner — 40% of agentic AI projects will fail](https://martech.org/gartner-40-of-agentic-ai-projects-will-fail-making-humans-indispensable)
- [TechCrunch: 11x has been claiming customers it doesn't have](https://techcrunch.com/2025/03/24/a16z-and-benchmark-backed-11x-has-been-claiming-customers-it-doesnt-have/)
- [eMarketer: Klarna backtracks AI customer service plans](https://www.emarketer.com/content/klarna-backtracks-ai-customer-service-plans)
- [Salesforce Ben: AI Agents Drive 4,000 Job Cuts in Salesforce Support Division](https://www.salesforceben.com/ai-agents-drive-4000-job-cuts-in-salesforce-support-division)
- [MIT NANDA report methodology](https://virtualizationreview.com/articles/2025/08/19/mit-report-finds-most-ai-business-investments-fail-reveals-genai-divide.aspx)

**Related posts on this site**

- [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design-en)
- [Context Engineering: Why Your AI Agent's Problem Is Information, Not the Model](/posts/ai/2026-03-24-context-engineering-guide-en)
- [Agent Memory Systems: From RAG to Read-Write Memory](/posts/ai/2026-03-19-agent-memory-systems-en)
- [The Complete Guide to AI Agent Architecture Patterns](/posts/ai/2026-03-18-ai-agent-patterns-guide-en)
- [Google's Eight Multi-Agent Design Patterns](/posts/ai/2026-03-28-google-multi-agent-patterns-en)
