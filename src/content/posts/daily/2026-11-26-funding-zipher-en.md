---
title: "Funding Alert｜Zipher Raises $45M Series A to Let Agents Run Enterprise Data Workloads"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, funding, daily, zipher, agent-infrastructure]
lang: en
description: "Israeli startup Zipher closed a $45M Series A (bringing total funding to $53M), co-led by Maor Investments and Glilot Capital, to let AI agents autonomously decide how enterprise data workloads run"
tldr: "Zipher raised a $45M Series A (bringing total funding to $53M) co-led by Maor Investments and Glilot Capital, building agents that autonomously decide the compute, framework, and scheduling for enterprise data workloads. Fortune 500 customers like Hertz report 25-40% compute savings. The signal: data infrastructure needs a new layer built specifically for workloads that agents, not humans, generate."
series:
  name: "AI Agent Funding"
  order: 154
---

> :globe: [中文版](/posts/daily/2026-11-26-funding-zipher)

## Funding details

| Item | Value |
|---|---|
| Company | Zipher (Tel Aviv, Israel & New York, US) |
| Round | Series A |
| Amount | $45M |
| Lead | Maor Investments, Glilot Capital (co-led via Glilot's early-growth fund, Glilot+) |
| Participants | TLV Partners (also led the seed round, returning) |
| Valuation | Undisclosed |
| Total raised | $53M ($8M seed in Aug 2024, led by TLV Partners; $45M Series A) |
| Founded | 2024 |
| Headcount | ~40 (offices in New York and Tel Aviv) |

## What the company does

Zipher builds a decision-making layer for enterprise data platforms — not a BI tool for humans, but data infrastructure built for AI agents. It was co-founded in 2024 by Dan Coster (CEO) and Yoav Gill Ben Ephraim (CTO), both veterans of Israel's Unit 8200 intelligence unit; Ben Ephraim previously led the data platform at Payoneer and held a data role at Microsoft.

The product lets a company set performance targets, SLAs, and a budget, and Zipher's agents handle the rest: picking the compute engine, allocating resources, choosing the processing framework, scheduling execution, and even rewriting code and syntax for each workload. The platform runs across AWS, Azure, and Google Cloud, and integrates with existing tools including dbt, Databricks Workflows, Apache Airflow, Azure Data Factory, and Terraform — all without a data team manually stepping in.

Customers include several Fortune 500 companies; Hertz is the public case study, with a senior data analytics and BI executive reporting compute cost reductions of 25% to 40%. Zipher claims an average 40-60% cost-efficiency gain and up to 80% better SLA adherence across its Fortune 500 customers, with most seeing results within two weeks — figures the company itself provided, not independently verified.

```diagram
title: Zipher's total funding — $8M seed to $45M Series A
desc: Zipher went from an $8M seed round in August 2024 to a $45M Series A in November 2026 — more than a 5.6x step-up — bringing total funding to $53M.
caption: Sources: Calcalist, SiliconANGLE, Pulse2 (Nov 2026 coverage). Conversion: baseline y=300, 5 units per $1M, axis starts at 0.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Amount ($M)</text>
  <line class="dg-grid" x1="72" y1="75" x2="612" y2="75"/>
  <line class="dg-grid" x1="72" y1="188" x2="612" y2="188"/>
  <text class="dg-small" x="64" y="75" text-anchor="end" dominant-baseline="central">45</text>
  <text class="dg-small" x="64" y="188" text-anchor="end" dominant-baseline="central">22.5</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="180" y="260" width="80" height="40"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="380" y="75" width="80" height="225"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="220" y="250" text-anchor="middle" dominant-baseline="central">8</text>
  <text class="dg-label dg-text--accent" x="420" y="65" text-anchor="middle" dominant-baseline="central">45</text>

  <text class="dg-sub" x="220" y="320" text-anchor="middle" dominant-baseline="central">Aug 2024 seed</text>
  <text class="dg-label dg-text--accent" x="420" y="320" text-anchor="middle" dominant-baseline="central">Nov 2026 Series A</text>
</svg>
```

## What this funding signals

### What it means for the agent ecosystem

The new capital goes toward growing the R&D team, expanding sales and marketing to support growth in North America, and moving into Europe, the Middle East, Africa, Latin America, and Asia-Pacific. CEO Coster frames the positioning bluntly: Zipher is solving a problem that platforms like Snowflake and Databricks don't touch — not storage or compute themselves, but who decides how the exploding volume of agent-generated workloads actually runs. That means the competition in data infrastructure is growing a new layer: work that human engineers used to tune by hand is becoming its own standalone market for an agent decision layer.

### What investors are betting on

Glilot Capital co-founder Arik Kleinstein laid out the thesis behind the round: "Within a few years, most enterprise workloads will be created by agents, not people. Companies will stop buying infrastructure tools for their teams to operate and start buying outcomes — every workload finished on time and on budget, with no one watching." He points to Zipher's ability to deliver savings from day one without compromising SLAs or reliability as the "immediate ROI" that led Glilot to back the company through its early-growth fund, Glilot+. Maor Investments partner Ilai Pines emphasized conviction in the founding team instead: "Data infrastructure has become too complex and critical to manage manually — autonomy is the inevitable next step." Both firms are familiar names in Israeli infrastructure and security investing, betting on whether this team can get enterprises to trust autonomous decision-making.

### Numbers worth watching

- The round size jumped more than 5.6x, from the $8M seed in August 2024 to the $45M Series A now — a sign investor conviction in agent-specific data infrastructure is climbing fast.
- A 40-person team raising $53M works out to more than $1.3M in capital per employee — high capital density for a company still building out its infrastructure layer with an undisclosed customer count, reflecting how expensive this kind of foundational R&D is.
- Hertz's publicly cited 25-40% cost reduction is lower than the 40-60% average Zipher claims across its Fortune 500 base — both numbers come from the same company, and the gap is worth watching to see if it's just customer-to-customer variance or an optimistic marketing figure.

## Watchlist status

Zipher is not yet tracked in the watchlist. Recommend adding it to section D7 (Data Analytics / BI), with tracking notes: agent-driven decision infrastructure for data workloads, $45M Series A led by Maor Investments and Glilot Capital, Fortune 500 customers including Hertz.

## Today's takeaway

Snowflake and Databricks solve the problem of how humans query data. Zipher is betting on a different problem: once the entities generating data workloads are no longer a handful of engineers but a swarm of autonomous agents, who picks the engine, allocates the resources, and watches the budget for each one? This layer that absorbs the chaos agents create isn't glamorous, but it may become table stakes faster than agent intelligence itself.

## References

- [Zipher lands $53M to put AI agents, not data engineers, in charge of data workloads](https://siliconangle.com/2026/11/24/zipher-lands-53m-to-put-ai-agents-not-data-engineers-in-charge-of-data-workloads)
- [Zipher A Data Analytics Platform Built For Agents Raises $53 Million](https://forbes.com/sites/timkeary/2026/11/24/zipher-a-data-platform-built-by-agents-for-agents-raises-53-million)
- [Israeli startup Zipher raises $45 million Series A to automate corporate data infrastructure](https://calcalistech.com/ctechnews/article/bkreuwq1xg)
- [Zipher Secures $53 Million To Automate How Companies Run Cloud Data Workloads](https://pulse2.com/zipher-secures-53-million-to-automate-how-companies-run-cloud-data-workloads)
- [AI agents data infrastructure co Zipher raises $53m](https://en.globes.co.il/en/article-ai-agents-data-infrastructure-co-zipher-raises-53m-1001564675)
