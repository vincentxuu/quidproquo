---
title: "Pricing Watch: Claude Sonnet 4.5's Retirement Date Splits in Two — Official Nov 30, Amazon Bedrock Extended to 2027-04-08"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: en
description: "Anthropic's own platforms (Claude API, Claude Platform on AWS, Microsoft Foundry, Anthropic-managed Google Cloud) retire Claude Sonnet 4.5 on Nov 30, 2026, but Amazon Bedrock's own model card sets a later EOL of 2027-04-08. Google Cloud's partner-operated version, oddly, lines up with Anthropic's own date instead."
tldr: "claude-sonnet-4-5-20250929 stops working on the Claude API, Claude Platform on AWS, Microsoft Foundry, and Anthropic-managed Google Cloud on 2026-11-30, with no grace period. But Amazon Bedrock's official model card lists its EOL as 2027-04-08 — over four months later. Google Cloud's partner-operated Model Garden/MaaS version, meanwhile, sides with Anthropic's own date and also shuts down on 11/30. Same model ID, three different clocks."
series:
  name: "AI Pricing Watch"
  order: 40
---

> :globe: [中文版](/posts/daily/2026-11-24-pricing-anthropic-sonnet-4-5-bedrock-eol-divergence)

## Summary

Our [Oct 23 report](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement-en) flagged that the Nov 30 retirement deadline for Claude Sonnet 4.5 only applies to three Anthropic-operated platforms — the Claude API, Claude Platform on AWS, and Microsoft Foundry — while Amazon Bedrock and Google Cloud set their own schedules. At the time we had no concrete dates for the latter two. A month later, we have an answer — and the two "partner-operated" platforms gave opposite answers. AWS's own Bedrock model card states plainly that Claude Sonnet 4.5's EOL is 2027-04-08, more than four months after Anthropic's own deadline. Google Cloud's Model Garden/MaaS partner version, on the other hand, sides with Anthropic and shuts down on the same Nov 30 date. One model ID (`claude-sonnet-4-5-20250929`), three governing parties, three separate retirement dates — a concrete instance of the line buried in Anthropic's own documentation: "partner-operated platforms set their own retirement schedules."

## Before/After

| Platform | Retirement/EOL date | Governed by | Note |
|---|---|---|---|
| Claude API | 2026-11-30 | Anthropic (own) | No grace period; requests fail immediately after |
| Claude Platform on AWS | 2026-11-30 | Anthropic (own, billed via AWS Marketplace) | Same as above |
| Claude Models on Google Cloud (Anthropic-managed) | 2026-11-30 | Anthropic (own) | Same as above |
| Microsoft Foundry | 2026-11-30 | Anthropic (own) | Same as above |
| Google Cloud Model Garden/MaaS (partner-operated) | 2026-11-30 | Google's own schedule | Coincides with Anthropic's date; not an Anthropic mandate |
| **Amazon Bedrock** (`bedrock-runtime`) | **2027-04-08** | **AWS's own schedule** | 129 days later than Anthropic's date; originally listed as "EOL no sooner than" 2026-09-30 |

The recommended replacement is unchanged: Claude Sonnet 5.5, priced 33% cheaper than Sonnet 4.5 on input/output ($2.00/$10.00 vs. $3.00/$15.00 per 1M tokens) — consistent with the Oct 23 report, no new change here.

```diagram
title: Claude Sonnet 4.5's retirement timeline splits into two tracks
desc: Five official and partner-operated platforms retire the model together on Nov 30, while only Amazon Bedrock's EOL extends to April 8, 2027.
caption: X-axis is by month; the year rolls over to 2027 after December. Dates verified 2026-11-23 against Anthropic's Model deprecations page, AWS's Bedrock model card, and Google Cloud's Partner model deprecations page.
---
<svg viewBox="0 0 640 240">
  <text class="dg-small" x="204" y="28" text-anchor="middle" dominant-baseline="central">Sep</text>
  <text class="dg-small" x="260" y="28" text-anchor="middle" dominant-baseline="central">Oct</text>
  <text class="dg-small" x="316" y="28" text-anchor="middle" dominant-baseline="central">Nov</text>
  <text class="dg-small" x="372" y="28" text-anchor="middle" dominant-baseline="central">Dec</text>
  <text class="dg-small" x="428" y="28" text-anchor="middle" dominant-baseline="central">Jan</text>
  <text class="dg-small" x="484" y="28" text-anchor="middle" dominant-baseline="central">Feb</text>
  <text class="dg-small" x="540" y="28" text-anchor="middle" dominant-baseline="central">Mar</text>
  <text class="dg-small" x="596" y="28" text-anchor="middle" dominant-baseline="central">Apr</text>
  <line class="dg-rule" x1="176" y1="44" x2="624" y2="44"/>

  <line class="dg-grid" x1="176" y1="44" x2="176" y2="200"/>
  <line class="dg-grid" x1="232" y1="44" x2="232" y2="200"/>
  <line class="dg-grid" x1="288" y1="44" x2="288" y2="200"/>
  <line class="dg-grid" x1="344" y1="44" x2="344" y2="200"/>
  <line class="dg-grid" x1="400" y1="44" x2="400" y2="200"/>
  <line class="dg-grid" x1="456" y1="44" x2="456" y2="200"/>
  <line class="dg-grid" x1="512" y1="44" x2="512" y2="200"/>
  <line class="dg-grid" x1="568" y1="44" x2="568" y2="200"/>
  <line class="dg-grid" x1="624" y1="44" x2="624" y2="200"/>

  <line class="dg-line dg-line--dashed" x1="333" y1="76" x2="333" y2="200"/>

  <text class="dg-sub" x="16" y="89" dominant-baseline="central">Official + partner (5 platforms)</text>
  <g class="dg-c-muted">
    <rect class="dg-bar" x="232" y="80" width="112" height="18"/>
  </g>
  <path class="dg-point dg-c-ink" d="M344 81 L352 89 L344 97 L336 89 Z"/>
  <text class="dg-small" x="344" y="68" text-anchor="middle" dominant-baseline="central">Nov 30 EOL</text>

  <text class="dg-label dg-text--accent" x="16" y="159" dominant-baseline="central">Amazon Bedrock</text>
  <g class="dg-c-accent">
    <rect class="dg-bar" x="232" y="150" width="351" height="18"/>
  </g>
  <path class="dg-point dg-c-accent" d="M583 151 L591 159 L583 167 L575 159 Z"/>
  <text class="dg-small dg-text--accent" x="583" y="181" text-anchor="middle" dominant-baseline="central">4/8 EOL</text>

  <text class="dg-small" x="232" y="216" text-anchor="middle" dominant-baseline="central">Sep 30 notice</text>
  <text class="dg-small" x="333" y="216" text-anchor="middle" dominant-baseline="central">today</text>
</svg>
```

## Cost Math

**Scenario**: A team runs an agent handling 10,000 customer-support conversations a day (averaging 1,500 input tokens + 500 output tokens each), currently calling `anthropic.claude-sonnet-4-5-20250929-v1:0` through Amazon Bedrock.

Because Bedrock's EOL extends to 2027-04-08, this team gets roughly 129 extra days of migration runway compared with a team calling the Claude API directly. Using the Oct 23 report's figure of "$480/month saved after migrating (↓13.3%, net of the new tokenizer's higher token count)" as a baseline:

| | Migrate now (Claude API users, before Nov 30) | Delay migration (Bedrock users, until 2027-04-08) | Difference |
|---|---|---|---|
| Days left before forced migration | 7 days | 136 days | +129 days |
| Old-pricing bill over that window (Sonnet 4.5 rates) | $3,600/mo × ~0.2 mo ≈ $840 | $3,600/mo × ~4.5 mo ≈ $16,200 | — |
| Extra cost of delaying (vs. switching to Sonnet 5.5 immediately) | $0 baseline | ~$2,160 (129 days × $16.8/day forgone savings) | Bedrock users pay about $2,160 extra before they actually migrate |

The point of this table isn't "Bedrock is the better deal" — a team on Bedrock that wants the 13.3% savings can switch to Sonnet 5.5 right now, with no need to wait for the EOL. The extra 129 days is only a buffer against outright breakage, not a free discount.

## Impact on Developers and Businesses

### Who benefits most

Teams running Claude Sonnet 4.5 in production on Amazon Bedrock effectively get a free buffer: migration can be folded into the next normal release cycle instead of being rushed to beat Nov 30, including testing Sonnet 5.5's behavior differences around prefill, `thinking.budget_tokens`, and forced tool use — all of which the Oct 23 report found return a 400 error if unhandled. Teams on the Claude API, Claude Platform on AWS, Microsoft Foundry, or Google Cloud's partner-operated version get none of that buffer; service simply stops once Nov 30 passes.

### Competitive landscape

A Bedrock team that uses the full buffer period competes for that stretch against GPT-6 Sol and the newly launched Claude Sonnet 4.6 (same price as Sonnet 4.5 at $3/$15, same tokenizer — a viable bridge, but not Anthropic's recommended long-term replacement):

| Model | Input | Output | Note |
|---|---|---|---|
| Claude Haiku 4.5 | $1.00 | $5.00 | — |
| GPT-6 Sol | $2.00 | $10.00 | — |
| **Claude Sonnet 5.5 (official replacement)** | **$2.00** | **$10.00** | Same price tier as GPT-6 Sol |
| Claude Sonnet 4.6 | $3.00 | $15.00 | Bridge option; retirement "not sooner than" 2027-02-17 |
| Claude Sonnet 4.5 (within Bedrock's buffer) | $3.00 | $15.00 | Callable through 2027-04-08, Bedrock only |
| Claude Opus 5.5 | $4.00 | $20.00 | — |

### What to do

- If you're on the Claude API, Claude Platform on AWS, Microsoft Foundry, or Anthropic-managed Google Cloud: finish migrating before Nov 30, with no buffer. Work through the checklist from the Oct 23 report for prefill, `thinking`, and sampling-parameter code paths.
- If you're on Amazon Bedrock: this isn't a pass to ignore the issue until 2027. The 13.3% bill reduction is available today; waiting until the EOL to migrate just means paying roughly four extra months of the old price. The only reasonable reason to wait is to queue this migration behind other technical debt that genuinely needs to go first.
- If you run multiple platforms at once (e.g., a Claude API test environment plus a Bedrock production deployment): don't assume both sides retire on the same date. Check each platform's current model card or model table — this divergence is a concrete example of why seeing "official Nov 30 notice" doesn't mean every deployment channel follows it.
- When you need your own exact EOL date, go straight to the relevant platform's own page (Anthropic's Model deprecations page, AWS's Bedrock model card, Google Cloud's Partner model deprecations page) — don't assume one platform's date applies to another.

## Deadline Reminder

:warning: **Shutdown dates (vary by platform)**:
- **2026-11-30**: Claude API, Claude Platform on AWS, Microsoft Foundry, Anthropic-managed Google Cloud, Google Cloud Model Garden/MaaS (partner-operated) — `claude-sonnet-4-5-20250929` stops responding entirely, with no grace period.
- **2027-04-08**: Amazon Bedrock (`bedrock-runtime`, model ID `anthropic.claude-sonnet-4-5-20250929-v1:0`) — AWS's own EOL date; requests after this date return `ResourceNotFoundException: This model version has reached the end of its life.`

Migration guide: [Claude Sonnet 5.5 Migration Guide](https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide).

## Takeaway

A line like "Bedrock and Vertex set their own retirement schedules" is easy to skim past as boilerplate, without registering that it can hide a concrete, four-month-plus date gap. Digging into it this time, we found that under that same disclaimer, Google Cloud's partner version chose to sync with Anthropic's date while Amazon Bedrock chose to extend it — "partner-operated" doesn't mean "later," and it doesn't mean "in sync" either; two partners can make opposite calls under the exact same clause. For teams running multi-cloud deployments, the lesson is that checking a model provider's own deprecation page isn't enough — each cloud platform's own model card or lifecycle page is the final authority for that platform.

## References

- [Claude Platform Docs: Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [AWS: Claude Sonnet 4.5 model card (Amazon Bedrock)](https://docs.aws.amazon.com/bedrock/latest/userguide/model-card-anthropic-claude-sonnet-4-5.html)
- [Google Cloud: Partner model deprecations (Claude Sonnet 4.5 on Google Cloud)](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/deprecations/partner-models)
