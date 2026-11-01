---
title: "Region Focus | India & South Asia"
date: 2026-10-30
category: daily
tags: [ai-agent, region, daily, india-south-asia]
lang: en
type: deep-dive
description: "Sarvam and Krutrim absorb 87% of India's new Indic AI funding this year while SEBI's chair floats building a sovereign AI model for securities markets; Pakistan confirms it joined China's WAICO, and the real divide turns out to be inside South Asia, not just between South Asia and the world"
tldr: "Tracxn data shows India's Indic AI ecosystem has raised $399 million across nine rounds through October 15, 2026 — 17x the $23 million raised in all of 2025 — with 87% of that coming from just two funding rounds at a single company, Sarvam AI. Cumulatively, Sarvam and Krutrim together account for 68% of all funding ever tracked across the sector's 34 companies. SEBI's chairman publicly floated building a domestically governed AI model for securities markets, citing confidentiality and availability concerns about frontier models. Pakistan's deputy prime minister confirmed in parliament that the country has signed on to the China-led World AI Cooperation Organization (WAICO). The same week, Microsoft's diffusion data showed India's working-age AI usage rate at 18.5% — the highest in South Asia, but Pakistan (11.9%), Bangladesh (8.0%) and Sri Lanka (7.6%) are bunched within 5 points of each other, and the whole region still trails Singapore's 64.3% by a wide margin."
series:
  name: "AI Region Focus"
  order: 19
---

## Region: India & South Asia

This region last appeared in Region Focus on 9/11 — a 7-week gap, the longest of any region we track. Three threads converged this week: an extreme concentration of capital, a sovereignty concern from a regulator, and a bloc-alignment choice in foreign policy. Read together, they say more about where this region stands than any one of them alone.

## Key Developments This Week

### Indic AI funding jumps 17x, but 87% flows to one company

Market research firm Tracxn reports that India's Indic AI ecosystem (AI built around Indian languages) raised $399 million across nine rounds through October 15, 2026 — up roughly 17x from the $23 million raised across the same nine-round pace in all of 2025. But the money is highly concentrated: Tracxn attributes $346 million of that, about 87%, to just two funding rounds at a single company, Sarvam AI. ([AnalyticsIndiaMag](https://analyticsindiamag.com/ai-news/sarvam-krutrim-account-for-68-of-indic-ai-funding-as-sector-raises-687-million-tracxn))

Zoom out to cumulative funding and the concentration gets starker: across the 34 Indic AI companies Tracxn tracks, total funding stands at roughly $687 million, with Sarvam ($389 million cumulative) and Krutrim ($75 million cumulative) together accounting for 68% of it. ([CIOL](https://www.ciol.com/startups/sarvam-ai-drives-87-of-indias-indic-ai-funding-in-2026-tracxn-12765217)) Sarvam shipped its 105-billion-parameter mixture-of-experts model Sarvam-105B (branded Indus) in February and launched the Sarvam Startup Program in March, giving early-stage founders 6-12 months of API credits plus engineering support. Krutrim, meanwhile, paused its chip-design work in late 2025 and pivoted to AI cloud infrastructure. India's government-backed IndiaAI Mission separately selected four companies — Sarvam, Gnani, Soket AI and BharatGen — for compute subsidies to build indigenous foundation models, though those grants sit outside the funding figures above. ([Wikipedia — Sarvam AI](https://en.wikipedia.org/wiki/Sarvam_AI))

### SEBI's chairman floats a sovereign AI model for securities markets

SEBI chairman Tuhin Kanta Pandey told the Business Standard BFSI Insight Summit on 10/28 that India's securities regulator is exploring a domestically built and governed AI model specifically for securities markets, citing concerns over the confidentiality and availability of frontier models. SEBI is also drafting a broader technology roadmap and plans to extend its existing IT and cybersecurity framework from market infrastructure institutions (MIIs) to their subsidiaries, while adopting IOSCO's supervisory toolkit for AI oversight of external models. ([Business Standard](https://www.business-standard.com/specials/bs-events/bfsi-insight-summit-sebi-explores-domestic-ai-model-for-securities-market-126102801985_1.html))

No timeline or budget has been attached yet — this is still an exploratory statement. But it's notable as the first time an Indian financial regulator has publicly framed "we don't want to depend on foreign frontier models" as an official position, rather than something only the industry worries about.

### Pakistan confirms it joined China-led WAICO; a diffusion gap surfaces inside South Asia

Pakistan's deputy prime minister and foreign minister, Ishaq Dar, told the Senate on 10/27 that Pakistan has signed the founding document of the China-led World AI Cooperation Organization (WAICO), reaffirming the government's $1 billion AI-ecosystem investment target for 2030. ([Daily Business News](https://www.dailybusinessnews.pk/pakistan-joins-china-led-global-ai-cooperation-body-ishaq-dar/)) A separate report notes that WAICO itself was formally established in July at the World AI Conference in Shanghai, with Pakistan as a founding member at that time. ([Inside AI](https://insideai.news/news/ai-policy-and-regulation/china-pakistan-ai-cooperation-cpec-2-0/13481/)) Read together, Dar's Senate remarks look less like a new act of joining than the first formal domestic confirmation of something already settled months earlier.

The same week, Microsoft's Q2 2026 AI Diffusion Report (re-checked by IT-Labs on 10/13) showed that South Asia's real AI gap sits inside the region, not just between the region and the world: India's working-age AI usage rate is 18.5%, the highest in South Asia, but Pakistan (11.9%), Bangladesh (8.0%) and Sri Lanka (7.6%) are bunched within 5 points of each other — the gap India opens up on its own is bigger than the combined gap among the other three. ([IT-Labs](https://www.it-labs.in/ai-automation/research/asia-pacific/))

```diagram
title: AI usage across four South Asian countries — India leads, the other three are nearly tied
desc: India's working-age AI usage rate is 18.5%, the highest in South Asia; Pakistan (11.9%), Bangladesh (8.0%) and Sri Lanka (7.6%) are within 5 points of each other.
caption: Source: Microsoft AI Diffusion Report, Q2 2026 (re-checked and compiled by IT-Labs on 2026-10-13). Y-axis starts at 0%; baseline y=300, plot top y=60, domain 0-20%, k=(300-60)/20=12 units per point; bar top y=300-value×12. Singapore, outside South Asia, sits at 64.3% over the same period — too large a gap to plot to scale here, so it's noted in text only.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Usage rate (%)</text>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">10</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <rect class="dg-bar dg-c-accent" x="94" y="78" width="64" height="222"/>
  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="202" y="157" width="64" height="143"/>
    <rect class="dg-bar dg-bar--soft" x="310" y="204" width="64" height="96"/>
    <rect class="dg-bar dg-bar--soft" x="418" y="209" width="64" height="91"/>
  </g>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-label dg-text--accent" x="126" y="68" text-anchor="middle" dominant-baseline="central">18.5%</text>
  <text class="dg-sub" x="234" y="147" text-anchor="middle" dominant-baseline="central">11.9%</text>
  <text class="dg-sub" x="342" y="194" text-anchor="middle" dominant-baseline="central">8.0%</text>
  <text class="dg-sub" x="450" y="199" text-anchor="middle" dominant-baseline="central">7.6%</text>

  <text class="dg-label dg-text--accent" x="126" y="320" text-anchor="middle" dominant-baseline="central">India</text>
  <text class="dg-sub" x="234" y="320" text-anchor="middle" dominant-baseline="central">Pakistan</text>
  <text class="dg-sub" x="342" y="320" text-anchor="middle" dominant-baseline="central">Bangladesh</text>
  <text class="dg-sub" x="450" y="320" text-anchor="middle" dominant-baseline="central">Sri Lanka</text>
</svg>
```

## Deep Dive

I'd read this week's India/South Asia story through the Resource-Based View, because all three developments answer the same underlying question: whoever holds the scarce combination of capital, talent and compute gets to set the region's AI trajectory.

**Concentrated resources become their own competitive advantage.** Sarvam alone captured 87% of this year's new Indic AI funding — not because the other 33 companies aren't trying, but because capital markets are betting on the government-anointed national foundation-model vendor as the lowest-risk play. IndiaAI Mission's compute subsidies and SEBI's apparent preference for sovereign AI both reinforce the same company's resource moat. That's the Resource-Based View's core claim in action: heterogeneous resources compound — whoever secures scarce resources first finds it easier to secure the next round.

**Scarce resources set the menu of national choices.** SEBI wanting an "India-built, India-governed" model presupposes there's already a domestic vendor like Sarvam to partner with. Pakistan's choice to join China-led WAICO looks like the inverse move — when a country lacks the scarce resources (domestic model-building capability, compute) to build on its own, joining someone else's bloc substitutes for self-reliance. That's not an ideological choice so much as the Resource-Based View's other core claim: when resources are scarce, alliance is often the only path to capability.

**South Asia isn't one ecosystem — it's one ecosystem plus a few neighbors that haven't started yet.** Microsoft's usage data bears this out: India's 18.5% is the only number in the region that has really taken off; Pakistan, Bangladesh and Sri Lanka, lacking India's density of capital and talent, are clustered in the single digits to low teens, forming a clear second tier. The Resource-Based View's prediction — resource gaps become capability gaps, capability gaps become adoption gaps — plays out here almost exactly as the textbook describes.

## Takeaways for Taiwanese Founders

- **If you're sizing up South Asia for go-to-market**: don't treat "South Asia" as one market. India's capital and talent density is an order of magnitude ahead of its neighbors, so positioning, pricing and even language support should be planned separately — pitch "deep localization" in India, and "affordable, low-friction, fast to adopt" in Pakistan, Bangladesh and Sri Lanka, where there's no domestic Sarvam-style alternative creating competitive pressure
- **If your customers are in financial services**: SEBI's public concern about frontier-model confidentiality and availability is part of the same wave as recent moves in Japan, South Korea and Europe's financial sectors toward sovereign AI — Taiwanese teams selling AI tools to financial-services clients should get ahead of this with "data stays in-country" and "self-hostable" options, rather than scrambling once a regulator demands it
- **If you're assessing geopolitical or market-entry risk**: Pakistan joining WAICO is a signal that "AI bloc alignment" is becoming a real diplomatic variable, not just a great-power story — Taiwanese teams entering markets with close China AI ties should factor bloc alignment into compliance and supply-chain risk assessments, rather than assuming every market is neutral on AI vendors
- **If you're thinking about resource allocation**: Sarvam's case shows that concentrating resources behind one national champion produces visible results faster than spreading subsidies thin across many small players — worth studying if Taiwan wants to build up domestic AI capability, but also a caution about over-concentration risk: betting wrong on the champion drags down the whole ecosystem's resource efficiency

## Cognitive Delta

I used to think of "South Asia" as roughly "India plus a few smaller neighbors" — a loose, rough grouping. Putting Tracxn's funding numbers next to Microsoft's usage numbers this week showed a sharper structure than I expected: it's not that India is a step ahead of the other three — it's that India alone absorbed 87% of the entire ecosystem's new capital this year, while the usage gap among the other three countries is small enough to almost ignore. South Asia isn't an ecosystem with internal tiers; it's one ecosystem that has already launched, sitting next to three neighbors whose resource gap is still too wide for them to even enter the race.

## References

- [AnalyticsIndiaMag — Sarvam, Krutrim Account For 68% of Indic AI Funding as Sector Raises $687 Million: Tracxn](https://analyticsindiamag.com/ai-news/sarvam-krutrim-account-for-68-of-indic-ai-funding-as-sector-raises-687-million-tracxn)
- [CIOL — Sarvam AI Drives 87% of India's Indic AI Funding in 2026: Tracxn](https://www.ciol.com/startups/sarvam-ai-drives-87-of-indias-indic-ai-funding-in-2026-tracxn-12765217)
- [Wikipedia — Sarvam AI](https://en.wikipedia.org/wiki/Sarvam_AI)
- [Business Standard — BFSI Insight Summit: Sebi Explores Domestic AI Model for Securities Market](https://www.business-standard.com/specials/bs-events/bfsi-insight-summit-sebi-explores-domestic-ai-model-for-securities-market-126102801985_1.html)
- [Daily Business News — Pakistan Joins China-led Global AI Cooperation Body: Ishaq Dar](https://www.dailybusinessnews.pk/pakistan-joins-china-led-global-ai-cooperation-body-ishaq-dar/)
- [Inside AI — China AI Opens New Pakistan Tech Cooperation Under CPEC 2.0](https://insideai.news/news/ai-policy-and-regulation/china-pakistan-ai-cooperation-cpec-2-0/13481/)
- [IT-Labs — AI in China and Asia-Pacific: Country by Country 2026](https://www.it-labs.in/ai-automation/research/asia-pacific/)
