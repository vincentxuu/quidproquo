---
title: "Region Focus | Oceania"
date: 2026-10-23
category: daily
tags: [ai-agent, region, daily, oceania]
lang: en
type: deep-dive
description: "A new CPA Australia survey finds 88% of Australian and New Zealand businesses use AI, but only 11% have it deeply embedded — the lowest agentic-AI usage of six Asia-Pacific markets surveyed — while New Zealand's Labour Party pitches an undefined 'super-AI' ban and an Australian law scholar warns AI agent liability remains a legal gap"
tldr: "A CPA Australia survey of 1,679 accounting and finance professionals finds 88% of Australian and New Zealand businesses use AI, but only 11% have deeply embedded it, with agentic AI usage at just 28% — behind Mainland China (58%), Hong Kong (49%), and Singapore (47%); ahead of New Zealand's 2026 election, Labour calls the government's AI readiness 'terrifying' and proposes an undefined 'super-AI' ban, while commentary argues the real gaps are in copyright and data rules; Australian law professor Kimberlee Weatherall warns at a parliamentary AI hearing that AI agent liability is unclear, meaning OpenAI is unlikely to face criminal liability over the Medicare breach; and AgenticAdvertising.org launches an Australian chapter to advance agent-to-agent commerce protocols in media trading."
series:
  name: "AI Region Focus"
  order: 18
---

## Region: Oceania

This week's throughline in Oceania is "wide adoption, shallow integration" — CPA Australia put a number on that gap, and the same week's New Zealand and Australian political and legal debates both point to the same underlying cause: regulatory uncertainty is keeping businesses from pushing AI into core operations.

## Key Developments This Week

### CPA Australia Survey: 88% AI Adoption, Only 11% Deep Integration, Lowest Agentic AI Usage Among Six Markets

CPA Australia released survey findings on October 19 drawn from 1,679 accounting and finance professionals across Australia, New Zealand, Mainland China, Hong Kong, Malaysia, and Singapore. Australian and New Zealand businesses show 88% AI usage, but only 11% have AI deeply embedded across their organizations — the lowest rate of broad integration among the six markets surveyed. Usage of agentic AI systems — capable of completing multi-step tasks with minimal human prompting — sits at just 28% in Australia and New Zealand, well behind Mainland China (58%), Hong Kong (49%), and Singapore (47%); use of custom-built AI tools is also lower, at 37% versus 61% in Mainland China. ([SecurityBrief NZ](https://securitybrief.co.nz/story/australia-nz-lag-on-deep-ai-integration-cpa-says))

```diagram
title: Agentic AI usage across six APAC markets: AU/NZ last
desc: CPA Australia's survey shows Mainland China businesses using multi-step, low-supervision agentic AI at a 58% rate, versus just 28% in Australia and New Zealand — the lowest of the four markets with published figures.
caption: Source: CPA Australia, 2026 enterprise AI adoption survey (1,679 accounting and finance professionals across Australia, New Zealand, Mainland China, Hong Kong, Malaysia, and Singapore; Malaysia's agentic-AI figure was not reported in the source article and is omitted here). Vertical axis starts at 0%; baseline y=300, 4 units per percentage point (y = 300 − value × 4).
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Usage (%)</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="126" y="68" width="72" height="232"/>
    <rect class="dg-bar dg-bar--soft" x="246" y="104" width="72" height="196"/>
    <rect class="dg-bar dg-bar--soft" x="366" y="112" width="72" height="188"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="486" y="188" width="72" height="112"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="162" y="58" text-anchor="middle" dominant-baseline="central">58%</text>
  <text class="dg-sub" x="282" y="94" text-anchor="middle" dominant-baseline="central">49%</text>
  <text class="dg-sub" x="402" y="102" text-anchor="middle" dominant-baseline="central">47%</text>
  <text class="dg-label dg-text--accent" x="522" y="178" text-anchor="middle" dominant-baseline="central">28%</text>

  <text class="dg-sub" x="162" y="320" text-anchor="middle" dominant-baseline="central">Mainland China</text>
  <text class="dg-sub" x="282" y="320" text-anchor="middle" dominant-baseline="central">Hong Kong</text>
  <text class="dg-sub" x="402" y="320" text-anchor="middle" dominant-baseline="central">Singapore</text>
  <text class="dg-label dg-text--accent" x="522" y="320" text-anchor="middle" dominant-baseline="central">AU/NZ</text>
</svg>
```

Gavan Ord, CPA Australia's business and investment lead, framed the report's core finding this way: "Australian and NZ businesses have largely adopted AI, but many are still only scratching the surface of its potential. The businesses seeing the greatest benefits are integrating AI into workflows, decision-making and core business processes rather than limiting its use to standalone tasks such as drafting emails." The survey also found that one in four organizations provide little or no guidance or oversight on AI use — Ord noted that "the speed of adoption had outpaced the development of internal controls in some businesses."

### New Zealand Labour Pitches an Undefined "Super-AI" Ban; Commentary: The Real Gap Is in Copyright and Data Rules

Ahead of New Zealand's 2026 election, the Labour Party criticized the governing coalition's AI readiness as "terrifying" in an interview with *Stuff*, reiterating its call to ban hypothetical "super-AI" systems. Leader Chris Hipkins and spokesperson Reuben Davidson's AI platform, unveiled in September, includes an Office of AI inside the Department of the Prime Minister and Cabinet (DPMC), an expanded remit for the online safety regulator, copyright rules requiring creators be compensated when their work trains models, a deepfake porn ban, renewable energy requirements for data centres, and SME adoption support. ([Stuff](https://www.stuff.co.nz/politics/361049270/labour-blasts-governments-terrifying-lack-ai-readiness-wants-super-ai-ban))

But commentary outlet B2B News argues the "super-AI" ban itself lacks an enforceable definition — nobody, Labour included, has specified which systems would count, or how a ban could be enforced against models hosted offshore. By contrast, the real problems documented in New Zealand's MBIE 2025 AI strategy report are more concrete: 68% of SMEs have no plans to even evaluate AI (versus 38% in Australia), and 43% of non-users cite a lack of expertise; a 2025 Privacy Commissioner survey also found four in five New Zealanders believe current AI regulation is inadequate. New Zealand currently ranks 32nd of 45 high-income countries on the Global Index on Responsible AI, behind Australia at 22nd. ([B2B News](https://b2bnews.co.nz/news/labours-super-ai-ban-leaves-real-ai-rules-unwritten/))

### Australian Law Scholar Warns: AI Agent Liability Is Unclear, OpenAI Unlikely to Face Criminal Charges Over Medicare Breach

Kimberlee Weatherall, a University of Sydney law professor and former member of the government's AI Expert Group, told an Australian parliamentary AI inquiry hearing that current law is unclear about where AI agent responsibility begins and ends — meaning OpenAI is unlikely to face criminal action over an earlier Medicare (Australia's national health insurance system) data breach this year. She called for urgent law reform to clarify liability. ([InnovationAus](https://www.innovationaus.com/australias-ai-agent-liability-gap-needs-urgent-fix-expert-says/))

The hearing followed the Australian government's September 29 mandate requiring immediate reporting of rogue AI incidents, and an October 8 draft "systems-based accountability" framework under which companies must demonstrate a genuinely functioning risk-management process and bear legal responsibility when it fails, rather than being sorted into traditional risk tiers. On one side, the government is trying to close the accountability gap with a new framework; on the other, a law scholar is telling the same hearing that existing law still can't accommodate AI agents as a new kind of actor. That gap may be part of why this week's report shows such low agentic AI usage: when businesses are unsure where liability lands, they naturally keep agent autonomy low.

## Deep Dive

I think the Technology-Organization-Environment (TOE) framework is the right lens for Oceania this week, because the three stories map cleanly onto its three variables — and the causal relationship between them explains the "wide adoption, shallow integration" pattern directly.

**Technology**: The barrier to simply getting hold of AI tools is already low — 88% adoption shows almost no friction at this layer. Point-solution tools (drafting emails, summarizing, single tasks) have become close to saturated.

**Organization**: This is exactly where CPA's data shows the gap opening up — a quarter of organizations lack governance frameworks, and custom-tool usage sits at just 37%. The bottleneck here isn't "can't get AI" — it's that organizations haven't figured out how to embed AI into existing decision-making and workflows.

**Environment**: This is where this week's political and legal stories land — New Zealand Labour's undefined ban proposal and an Australian law scholar's warning about an agent liability vacuum both say the same thing: the regulatory environment hasn't settled. TOE's core insight is that these three layers constrain each other — when the Environment layer's rules are unclear, the Organization layer has no clear compliance standard to design against, so businesses naturally keep AI at low-risk, low-autonomy surface use rather than pushing agentic AI — which demands more trust and less human oversight — into core processes. That explains why AU/NZ's agentic AI usage (28%) trails Mainland China's (58%), where governance and regulation have settled earlier: it's not a capability gap, it's environment-layer uncertainty directly suppressing how much autonomy organizations are willing to grant.

## Takeaways for Taiwanese Founders

- **If you're selling AI tools to SMEs**: the "88% adoption, 11% deep integration" gap in Australia and New Zealand is a reminder that simply selling "access to a model" is already a red ocean. The real product opportunity is in the integration layer — helping businesses embed AI into existing workflows and decision chains — which requires consulting-style implementation capability, not a stronger model
- **If you build AI governance or compliance tooling**: Australia's draft "systems-based accountability" framework (requiring companies to prove their risk-management process actually works, with liability if it fails) and the law scholar's warning about a liability gap show regulators are still playing catch-up. Don't wait for the rules to settle — sell self-imposed governance tools now (auditable agent decision logs, for example). Demand for this is often stronger precisely while regulation stays ambiguous, making it an earlier entry point for Taiwanese companies eyeing the AU/NZ market than waiting for clarity
- **If you're planning your agent's autonomy roadmap**: benchmark "agentic AI usage rate" against APAC peers — Mainland China's 58% versus AU/NZ's 28% suggests Taiwan's market likely sits closer to the AU/NZ end, since accountability frameworks are similarly still forming here. Design in a dial that lets businesses turn down agent autonomy and keep a human approval checkpoint, rather than assuming customers will jump straight to full autonomy
- **If you work in adtech or martech**: AgenticAdvertising.org's new Sydney-based Australian chapter signals that agent-to-agent commerce protocols for ad trading are moving from concept to cross-organization specification work. Taiwanese martech teams building agent-driven media buying or placement products gain an edge by tracking these spec drafts now, rather than waiting to retrofit compatibility once a standard is finalized

## Cognitive Delta

I used to treat "AI adoption rate" as the most direct way to compare AI maturity across markets. Looking at CPA Australia's numbers this week, I realized adoption and deep integration can diverge by a factor of eight (88% vs. 11%) — they're measuring fundamentally different things. Adoption measures whether a business has touched AI at all; deep integration measures whether AI has actually changed how decisions get made. What surprised me more was putting this data next to the same week's Australian and New Zealand political and legal news: "regulatory uncertainty" isn't just a corporate excuse — it measurably suppresses how much autonomy businesses are willing to hand to agents. Unsettled law, it turns out, isn't just a compliance risk sitting in the background; it's itself a structural reason agentic AI usage stays low.

## References

- [SecurityBrief NZ — Australia & NZ lag on deep AI integration, CPA says](https://securitybrief.co.nz/story/australia-nz-lag-on-deep-ai-integration-cpa-says) — Oceania enterprise AI adoption survey
- [Stuff — Labour blasts government's 'terrifying' lack of AI readiness, wants super-AI ban](https://www.stuff.co.nz/politics/361049270/labour-blasts-governments-terrifying-lack-ai-readiness-wants-super-ai-ban)
- [B2B News — Banning super-AI is easy when nobody has to define it](https://b2bnews.co.nz/news/labours-super-ai-ban-leaves-real-ai-rules-unwritten/)
- [InnovationAus — Australia's AI agent liability gap needs urgent fix, expert says](https://www.innovationaus.com/australias-ai-agent-liability-gap-needs-urgent-fix-expert-says/)
