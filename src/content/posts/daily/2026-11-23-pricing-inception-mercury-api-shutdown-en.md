---
title: "Pricing Watch: Inception's Mercury API Shuts Down Dec 28, Right After an NVIDIA Acquisition Rumor"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, pricing, daily, nvidia]
lang: en
description: "Inception's own wind-down page confirms the Mercury API (Mercury 3, Mercury Voice, Mercury Decide) stops serving requests on 2026-12-28, with no official replacement, days after The Information reported NVIDIA is in talks to acquire the company for over $500 million"
tldr: "Inception's official wind-down notice says the Mercury API (api.inceptionlabs.ai) stops serving requests after 2026-12-28, and submitted data becomes inaccessible too — with no replacement named. The same week, The Information reported NVIDIA is in talks to acquire Inception for over $500 million; neither company has confirmed the deal, but the timing overlaps closely."
series:
  name: "AI Pricing Watch"
  order: 39
---

> :globe: [中文版](/posts/daily/2026-11-23-pricing-inception-mercury-api-shutdown)

## Summary

Inception, the diffusion-LLM startup, quietly posted a wind-down notice in its docs: the Mercury API — covering Mercury 3, Mercury Voice, and Mercury Decide — stops serving requests after December 28, 2026, and after that date customers lose access to any data they submitted to the platform too. The notice itself gives no reason. But the same week, *The Information* reported that NVIDIA is in talks to acquire Inception for more than $500 million. Neither company has confirmed the deal, but an acquisition rumor landing the same week as a shutdown notice is enough for existing customers to put migration on the calendar now. This isn't a price cut or a promo expiring — it's an API sunset with no official replacement, and customers have roughly a month to move.

## Before / After

| Item | Now | After Dec 28 | Change | Effective date |
|---|---|---|---|---|
| Mercury API (api.inceptionlabs.ai) | Serving requests | Stops serving requests | Service ends | 2026-12-28 |
| Inception Platform dashboard | Accessible | Inaccessible | Service ends | 2026-12-28 |
| Submitted data / request logs | Queryable | Inaccessible (deletion unspecified) | Data unreachable | 2026-12-28 |
| Billing / invoice history | Downloadable from dashboard | Must be exported in advance | Manual backup required | Before 2026-12-28 |

The official wind-down page reads: "After this date you will no longer have access to the service or to any data submitted to the platform." It says nothing about refunds, and nothing about whether data is deleted after the cutoff or simply left unreachable — both are the kind of gap teams tend to miss when planning a migration.

## Cost Estimate

There's no old-vs-new rate to compare here — the question isn't "how much more expensive," it's "is the migration window long enough." Here's what the timeline looks like for a concrete case:

**Scenario:** An agent calling Mercury 3 for 20,000 requests a day, learning about this notice today (11/23).

| | Days remaining | Recommended action |
|---|---|---|
| Until service ends (12/28) | 35 days | Hard deadline |
| Suggested cutover complete by (a safety margin — not an official date) | Around 12/14 | Leaves 2 weeks to watch latency and error rates on the new provider |
| Back up billing / request logs | Immediately | Dashboard download also disappears when the service does |

Thirty-five days sounds like enough time, but diffusion LLMs behave differently at inference (parallel denoising, a different latency curve) than autoregressive LLMs. Moving to Groq, Cerebras, or A/B-testing through OpenRouter or a self-hosted LiteLLM proxy means re-measuring latency and output quality — not just swapping a base URL.

## Impact on Developers and Enterprises

### Who benefits most

Teams still evaluating whether to adopt a diffusion LLM get an early signal here: in a niche where only a handful of vendors exist — Inception was one of the first to commercialize it — the platform's own survival risk matters as much as model-quality risk when you're choosing a vendor.

### Competitive landscape

With Mercury shutting down, the diffusion-LLM API space loses one of its few independent providers:

| Position | Status |
|---|---|
| Inception (Mercury) | API ends 2026-12-28, rumored to be folding into NVIDIA |
| Google (Gemini Decide family) | Official decision-oriented models; the closest comparison the wind-down guidance points to for Mercury Decide |
| Groq / Cerebras | Fast-inference providers, not diffusion-based, but usable for a latency-layer swap test |

There's no direct same-category replacement here — the official wind-down notice doesn't name one; community discussion has only informally compared Gemini Decide for decision-type workloads. Worth noting: compared with last week's Gemini 4 Argon promo expiration (where Google published exact old and new prices), Inception's notice doesn't even offer a successor model, so the migration cost structure here is completely different.

### What to do

- If you're calling `api.inceptionlabs.ai` in production: export your request logs, billing history, and invoices from the dashboard now — the notice says you lose access after 12/28, not "lose access a bit after 12/28"
- If you're using Mercury Decide for decision-type workloads: run your own data through Gemini Decide now, don't wait until mid-December to start looking for an alternative
- If you're still at the evaluation stage and not yet in production: treat this as a case study — when picking a diffusion-LLM vendor, put the company's survival/acquisition risk on the same scorecard as model quality

## Deadline

:warning: **Shutdown date:** 2026-12-28. The Mercury API (Mercury 3, Mercury Voice, Mercury Decide) and the Inception Platform dashboard both stop serving at the same time, and any submitted data becomes inaccessible after that date. Download your request logs and billing history from the dashboard before migrating. Official wind-down notice: [docs.inceptionlabs.ai/support/wind-down](https://docs.inceptionlabs.ai/support/wind-down.md).

```diagram
title: Mercury API shutdown timeline
desc: From the NVIDIA acquisition rumor surfacing (11/19) to the Mercury API actually shutting down (12/28) is only 39 days — and after subtracting the days before this report (11/23), the real migration window is only about 35 days.
caption: Scale: 1 day ≈ 9.2px, starting 2026-11-19. 12/14 is this article's suggested safety margin, not an official date — the official wind-down page only gives the single date 12/28.
---
<svg viewBox="0 0 640 280">
  <path class="dg-axis" d="M40 124H560"/>
  <path class="dg-axis" d="M140 124V130M232 124V130M325 124V130M417 124V130"/>
  <text class="dg-small" x="140" y="146" text-anchor="middle" dominant-baseline="central">11/19</text>
  <text class="dg-small" x="232" y="146" text-anchor="middle" dominant-baseline="central">11/29</text>
  <text class="dg-small" x="325" y="146" text-anchor="middle" dominant-baseline="central">12/9</text>
  <text class="dg-small" x="417" y="146" text-anchor="middle" dominant-baseline="central">12/19</text>

  <rect class="dg-band dg-band--warn" x="177" y="236" width="323" height="24"/>
  <text class="dg-small dg-text--warn" x="339" y="248" text-anchor="middle" dominant-baseline="central">Migration window: ~35 days (from 11/23)</text>

  <g>
    <line class="dg-rule" x1="140" y1="76" x2="140" y2="118"/>
    <circle class="dg-dot" cx="140" cy="124" r="4"/>
    <text class="dg-label" x="140" y="40" text-anchor="middle" dominant-baseline="central">11/19 Acquisition rumor</text>
    <text class="dg-sub" x="140" y="62" text-anchor="middle" dominant-baseline="central">The Information reports NVIDIA in talks</text>
  </g>
  <g>
    <line class="dg-rule" x1="371" y1="130" x2="371" y2="172"/>
    <circle class="dg-dot" cx="371" cy="124" r="4"/>
    <text class="dg-label" x="371" y="186" text-anchor="middle" dominant-baseline="central">12/14 Suggested cutoff</text>
    <text class="dg-sub" x="371" y="208" text-anchor="middle" dominant-baseline="central">2-week buffer to vet a new provider (unofficial)</text>
  </g>
  <g>
    <line class="dg-rule" x1="500" y1="76" x2="500" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="500" cy="124" r="6"/>
    <text class="dg-label" x="500" y="40" text-anchor="middle" dominant-baseline="central">12/28 Service ends</text>
    <text class="dg-sub" x="500" y="62" text-anchor="middle" dominant-baseline="central">API and dashboard data both unreachable</text>
  </g>
</svg>
```

## Today's Takeaway

Pricing-watch posts are usually about tracking how much something went up or down, but the signal worth keeping here isn't a price — it's the absence of a successor model in the notice itself. A company that spells out old and new rates (like Google's Gemini 4 Argon promo-expiration notice) is telling you it plans to keep charging you in this market. A notice that gives only a shutdown date, with no replacement, usually means the platform itself is heading somewhere else — in this case, apparently into an acquisition. The number to plan around isn't how much you'll save; it's how much time you have left.

## References

- [Inception: Mercury API wind-down notice (official docs, shutdown date and data-access terms)](https://docs.inceptionlabs.ai/support/wind-down.md)
- [NVIDIA in talks to acquire AI developer Inception amid Mercury API wind-down (summarizes The Information's acquisition report and the notice's timing)](https://beri.net/article/nvidia-inception-acquisition-500-million-mercury-api-wind-down-december-28-diffusion-llm-migration)
- [This series, 10/17: Google adds the missing Gemini 4 Argon promo-expiration date](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline-en)
