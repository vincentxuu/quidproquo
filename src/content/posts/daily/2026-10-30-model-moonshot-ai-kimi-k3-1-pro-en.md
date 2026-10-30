---
title: "Model Card: Kimi K3.1 Pro"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, model-release, daily, moonshot-ai, model-family-kimi]
lang: en
description: "Moonshot AI ships Kimi K3.1 Pro — a 2.8T MoE open-weight model with a 33% price cut, jumping to 67% on an independent Terminal-Bench 4.0 run and closing in on top closed models"
tldr: "Kimi K3.1 Pro: released 2026-10-23, 2.8T total / 104B active MoE parameters, 1M-token context window, $2.00 input / $10.00 output per 1M tokens (33% below K3); independent testing put Terminal-Bench 4.0 at 67% (up from K3's 13%), and it ranks 4th worldwide on the Artificial Analysis Intelligence Index at 55.1; weights aren't public yet — Moonshot promises open release by 2026-11-04, at which point it's projected to become the highest-scoring open-weight model available"
series:
  name: "AI Model Tracker"
  order: 63
glossary:
  - term: "Kimi"
    def: "Moonshot AI's conversational and agentic model family; K3.1 Pro is a post-trained flagship built on K3"
---

> 🌏 [中文版](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro)

## Model Info

| Field | Value |
|---|---|
| Model ID | `kimi-k3.1-pro` (Highspeed variant: `kimi-k3.1-pro-highspeed`) |
| Vendor | Moonshot AI |
| Parameters | 2.8T total / 104B active (Mixture-of-Experts) |
| Context Window | 1,048,576 tokens (1M) |
| Input Price (USD/1M tokens) | $2.00 |
| Output Price (USD/1M tokens) | $10.00 |
| Open-weight | Yes (weights not yet released; Moonshot has promised an open release by 2026-11-04; license terms are not yet published — the prior K3 model used a custom Kimi K3 License) |
| Release Date | 2026-10-23 (US time) / 2026-10-24 (China time) |
| Official Announcement | [Kimi Blog: Kimi K3.1 Pro Tech Blog](https://www.kimi.ai/blog/kimi-k3-1-pro) |
| Hugging Face | Not yet listed (weights not released) |
| Family | Kimi K3.x (a post-trained version of K3; first release in the K3.1 line) |

## Key Capabilities

- A sharp jump on Terminal-Bench 4.0: Moonshot's own run scored 65.7% (just behind Claude Opus 5.5's 66.4%, ahead of GPT-6 Astra's 58.2%), while independent testing from Artificial Analysis measured 67% — the highest score it has recorded for any model, up 54 points from K3's 13%
- 4th place worldwide on the Artificial Analysis Intelligence Index v4.3.2 at 55.1, trailing only Claude Opus 5.5 (57.6), Claude Sonnet 5.5 (56.0), and Meta's Muse Wonder Full (55.8) — an 11.5-point gain over K3's own 43.6
- A third cheaper: input/output pricing dropped from K3's $3.00/$15.00 to $2.00/$10.00 per 1M tokens, though Artificial Analysis found K3.1 Pro uses 14% more output tokens per task, so real per-task cost is roughly flat
- Cyber-attack training data deliberately stripped before the open release: on the xdev-bench-hard vulnerability-discovery test, an internal checkpoint that kept the attack data solved 90.5% of tasks (pass@3), while the final open-weight release was deliberately capped at 81.0% — a rare case of a lab dialing down a specific capability on purpose before open-sourcing

## Benchmark Results

| Benchmark | Score | Predecessor (K3) | Best Competitor |
|---|---|---|---|
| Terminal-Bench 4.0 (Artificial Analysis, independent) | 67% | 13% | Claude Sonnet 5.5 64% |
| Terminal-Bench 4.0 (Moonshot self-report, Claude Code harness) | 65.7% | Not reported | Claude Opus 5.5 66.4% |
| Artificial Analysis Intelligence Index v4.3.2 | 55.1 (4th) | 43.6 | Claude Opus 5.5 57.6 |
| GDPval-AA (Elo, Artificial Analysis, independent) | 1,846 (3rd) | 1,534 | Claude Opus 5.5 1,866 |
| BenchCAD with tools (Moonshot self-report) | 92.7% | Not reported | Claude Opus 5.5 96.2%, GPT-6 Astra 95.9% |

⚠️ Terminal-Bench 4.0 (Moonshot's own run), BenchCAD, OfficeQA Pro v2, and xdev-bench-hard are all Moonshot self-reported figures with no independent reproduction yet. Terminal-Bench 4.0 (independent run), the Intelligence Index, and GDPval-AA come from Artificial Analysis, a third-party evaluator. The two parties scored the same Terminal-Bench 4.0 test differently (67% vs. 65.7%) using different harnesses and settings, so the numbers shouldn't be added together or treated as directly comparable.

```diagram
title: Kimi K3.1 Pro closes to within 2.5 points of Claude Opus 5.5 on the Intelligence Index
desc: K3.1 Pro's 55.1 is an 11.5-point gain over K3's 43.6, closing in on Claude Sonnet 5.5 (56.0) and Claude Opus 5.5 (57.6), narrowing the gap to single digits.
caption: Source: Artificial Analysis Intelligence Index v4.3.2 (compiled by felloai.com, verified 2026-10-23). Scale: baseline y=300, plot top y=60, domain 0-60 points, k=(300-60)/60=4 (4 units per point), bar top y=300-score*4.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">pts</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="107.5" y="125.6" width="64" height="174.4"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="242.5" y="79.6" width="64" height="220.4"/>
  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="377.5" y="76" width="64" height="224"/>
    <rect class="dg-bar dg-bar--soft" x="512.5" y="69.6" width="64" height="230.4"/>
  </g>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="139.5" y="115.6" text-anchor="middle" dominant-baseline="central">43.6</text>
  <text class="dg-label dg-text--accent" x="274.5" y="69.6" text-anchor="middle" dominant-baseline="central">55.1</text>
  <text class="dg-sub" x="409.5" y="66" text-anchor="middle" dominant-baseline="central">56.0</text>
  <text class="dg-sub" x="544.5" y="59.6" text-anchor="middle" dominant-baseline="central">57.6</text>

  <text class="dg-sub" x="139.5" y="320" text-anchor="middle" dominant-baseline="central">Kimi K3</text>
  <text class="dg-label dg-text--accent" x="274.5" y="320" text-anchor="middle" dominant-baseline="central">K3.1 Pro</text>
  <text class="dg-sub" x="409.5" y="320" text-anchor="middle" dominant-baseline="central">Sonnet 5.5</text>
  <text class="dg-sub" x="544.5" y="320" text-anchor="middle" dominant-baseline="central">Opus 5.5</text>
</svg>
```

## vs. Predecessor and Competitors

The biggest gains over K3 are in agentic coding and long-horizon execution: Terminal-Bench 4.0 jumped from K3's 13% to 67% in Artificial Analysis's independent test, and the GDPval-AA Elo score rose by 312 points. Moonshot credits this to post-training reinforcement learning compute "substantially larger" than K3's, spread across hundreds of downstream domains — not a new architecture. K3.1 Pro's backbone is identical to K3: the same 2.8T total / 104B active MoE.

Against competitors, K3.1 Pro trails Claude Opus 5.5 by just 2.5 points on the Intelligence Index, ranking 4th worldwide. Once the weights actually ship by November 4, Artificial Analysis projects it will become the highest-scoring open-weight model available, narrowing the gap between the best open and closed models from 12 points to 3. But Moonshot's own BenchCAD test shows K3.1 Pro still trailing both Claude Opus 5.5 (92.7% vs. 96.2%) and GPT-6 Astra (95.9%) on 3D modeling — this isn't an across-the-board win.

On pricing, K3.1 Pro cuts both input and output rates by 33% ($3/$15 → $2/$10), which looks like a straightforward discount. But Artificial Analysis found it uses 14% more output tokens per task than K3, so actual per-task spend barely changes — Moonshot chose to spend the same money on a stronger model rather than simply undercutting on price.

## What This Means for Agent Development

The weights don't land until November 4, so for now you can only validate the model through the API — self-hosting isn't an option yet.

- If you're building a coding agent that needs self-hosting, can't send data outside your infrastructure, or needs custom fine-tuning: run your own test suite against the `kimi-k3.1-pro` API first, then decide on self-hosting once the weights ship on 11/4 — Artificial Analysis projects it'll be the highest-scoring open-weight model once released
- If you're building a long-horizon agent: Moonshot's own example shows K3.1 Pro iterating across 167 missions and 420 independent reviews to find and fix 36 miscalculations in a physics simulation on its own — a real-world case study for "runs a long time and debugs itself," not just a benchmark number
- If you're comparing cost-efficiency among open-weight flagships: the sticker price dropped a third, but actual per-task cost is nearly flat because of higher output-token usage — benchmark your own workloads rather than trusting the list price
- Not a fit: use cases that need top-tier red-team or exploit-development capability — Moonshot deliberately stripped relevant training data before the open release, capping the xdev-bench-hard score at 81.0% instead of the 90.5% the pipeline could otherwise reach, and the company is explicit that this is a design choice, not a capability ceiling

## Cognitive Takeaway

"Open-weight vs. closed" used to feel like a binary choice — you either give away everything or nothing. Kimi K3.1 Pro's approach was to first measure the exact capability gap created by removing attack-related training data (90.5% vs. 81.0%), then decide what to release based on that number. That turns "how much capability to open up" into a dial you can adjust in steps, rather than a yes-or-no question.

## References

- [Kimi Blog: Kimi K3.1 Pro Tech Blog](https://www.kimi.ai/blog/kimi-k3-1-pro)
- [felloai.com: Kimi K3.1 Pro: Moonshot's Cheaper, Stronger K3, Explained](https://felloai.com/kimi-k3-1/)
- [Unite.AI: Moonshot AI Releases Kimi K3.1 Pro, First Model in New K3.1 Series](https://www.unite.ai/moonshot-ai-releases-kimi-k3-1-pro-first-model-in-new-k3-1-series/)
- [innfactory.ai: Moonshot Kimi K3.1 Pro: Pricing, Licence, GDPR](https://innfactory.ai/en/ai-models/moonshot-kimi/)
