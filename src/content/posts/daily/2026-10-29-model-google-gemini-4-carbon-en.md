---
title: "Model Card: Gemini 4 Carbon"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-gemini]
lang: en
description: "Google ships Gemini 4 Carbon — state-of-the-art on all three cybersecurity benchmarks (finding, exploiting, patching vulnerabilities) and #1 on Artificial Analysis Intelligence Index v5.0, but it's only open to trusted cyber defenders for now"
tldr: "Gemini 4 Carbon: shipped 2026-10-28, just two weeks after Argon; Google's own announcement gives no context window or output cap number — a third party, Artificial Analysis, measured a 1M-token context window; pricing carries over Argon's current promo rate, $2.00 input / $10.00 output per 1M tokens, doubling to $4.00/$20.00 once the promo ends (no end date given); state-of-the-art on all three cybersecurity benchmarks — SEC-bench Pro 88.2% (finding vulnerabilities), ExploitGym 54.8% (exploit validation), CWE-bench 71.0% (patching, up from Argon's 68%); #1 worldwide on Artificial Analysis Intelligence Index v5.0 at 59, just one point ahead of Claude Opus 5.5's 58; access is limited to trusted security partners through the Fairwind Program, and there's still no public API model ID"
series:
  name: "AI Model Tracker"
  order: 62
glossary:
  - term: "Gemini"
    def: "Google DeepMind's large language model family; Carbon is the flagship model in the Gemini 4.x branch that follows Argon"
---

> 🌏 [中文版](/posts/daily/2026-10-29-model-google-gemini-4-carbon)

## Model Info

| Item | Value |
|---|---|
| Model ID | Not published (as of 2026-10-29, Google's Gemini API pricing page still lists only Argon, no Carbon entry) |
| Vendor | Google DeepMind |
| Parameters | Not disclosed |
| Context Window | The official announcement gives no concrete number; third-party evaluator Artificial Analysis measured a 1,000,000-token context window on its model page, with text/image/speech/video input and text output |
| Input pricing (USD/1M tokens) | $2.00 (introductory price, carried over from Argon's current promo) |
| Output pricing (USD/1M tokens) | $10.00 (introductory price, carried over from Argon's current promo) |
| Open source | No (closed, proprietary to Google) |
| Release date | 2026-10-28 |
| Official announcement | [Google Blog: Gemini 4 Carbon: our next frontier model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/) |
| HuggingFace | N/A (closed model) |
| Family | Gemini 4.x (follows Gemini 4 Argon, released 2026-09-30) |

## Highlights

- State-of-the-art across all three cybersecurity defense benchmarks: SEC-bench Pro (finding vulnerabilities) 88.2%, ExploitGym (exploit validation) 54.8%, CWE-bench (patching) 71.0%. Google says internal tests show more than a 2x uplift over Argon in generating vulnerability-free code
- The rate of successful "cheating" on Terminal-Bench 4.0 drops to 0.0% (attempt rate 0.4%) while overall accuracy holds steady, suggesting alignment training is working against shortcut-taking
- Attack success rate on Gray Swan's Indirect Prompt Injection Benchmark drops to 0.0%, down from Argon's 0.7% — resisting every evaluated injection attempt
- WebDev Arena Elo jumps 89 points to rank #4 (1768 Elo); Google's internal testing shows high-severity "misalignment" alerts dropping by nearly 80% versus Argon

## Benchmark Results

| Benchmark | Score | Previous (Argon) | Best competitor |
|---|---|---|---|
| SEC-bench Pro (vulnerability discovery) | 88.2% (SOTA) | Not published | Not reported |
| ExploitGym (exploit validation) | 54.8% (SOTA) | Not published | Not reported |
| CWE-bench (patching) | 71.0% | 68% (tied for first) | GPT-6 Astra 68%, Claude Opus 5.5 67% |
| Artificial Analysis Intelligence Index v5.0 | 59 (#1 worldwide) | 50.4 (same version, re-tested; compiled by felloai.com) | Claude Opus 5.5 58, GPT-6 Astra 57 |
| Artificial Analysis Coding Agent Index | 59 | Not ranked | Claude Opus 5.5 (max) 62 (#1) |
| Gray Swan IPI Benchmark (prompt injection attack success rate, lower is better) | 0.0% | 0.7% | Not reported |

⚠️ SEC-bench Pro, ExploitGym, CWE-bench, WebDev Arena, Terminal-Bench 4.0, and the Gray Swan IPI benchmark are all Google's own tests or results from partners (Gray Swan, Wiz) — none have been independently reproduced yet. The Artificial Analysis Intelligence Index and Coding Agent Index are independently measured by a third-party platform, not self-reported by Google. Only CWE-bench and the Intelligence Index can be directly compared with Argon; Google hasn't published Argon's numbers on the other security benchmarks, so progress on those can't be measured.

```diagram
title: Gemini 4 Carbon tops Intelligence Index v5.0, but only by a point or two
desc: Carbon's score of 59 ranks #1 worldwide, just 1 point ahead of Claude Opus 5.5's 58 and 2 points ahead of GPT-6 Astra's 57 — a much smaller gap than the 8.6-point lead over predecessor Argon (50.4).
caption: Source: Artificial Analysis Intelligence Index v5.0 (published 2026-10-27, checked 2026-10-29); Argon's score is from a re-test on the same version (compiled by felloai.com), not the v4.x score used at Argon's launch. Conversion: baseline y=300, plot top y=60, domain 0-60 points, k=(300-60)/60=4 (4 units per point), bar top y=300-score×4.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">pts</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <rect class="dg-bar dg-c-accent" x="107.5" y="64" width="64" height="236"/>
  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="242.5" y="68" width="64" height="232"/>
    <rect class="dg-bar dg-bar--soft" x="377.5" y="72" width="64" height="228"/>
    <rect class="dg-bar dg-bar--soft" x="512.5" y="98" width="64" height="202"/>
  </g>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-label dg-text--accent" x="139.5" y="54" text-anchor="middle" dominant-baseline="central">59</text>
  <text class="dg-sub" x="274.5" y="58" text-anchor="middle" dominant-baseline="central">58</text>
  <text class="dg-sub" x="409.5" y="62" text-anchor="middle" dominant-baseline="central">57</text>
  <text class="dg-sub" x="544.5" y="88" text-anchor="middle" dominant-baseline="central">50.4</text>

  <text class="dg-label dg-text--accent" x="139.5" y="320" text-anchor="middle" dominant-baseline="central">Carbon</text>
  <text class="dg-sub" x="274.5" y="320" text-anchor="middle" dominant-baseline="central">Opus 5.5</text>
  <text class="dg-sub" x="409.5" y="320" text-anchor="middle" dominant-baseline="central">GPT-6 Astra</text>
  <text class="dg-sub" x="544.5" y="320" text-anchor="middle" dominant-baseline="central">Argon</text>
</svg>
```

## Versus the Previous Model and Competitors

Against Argon, Carbon's biggest gains are in cybersecurity defense and alignment: CWE-bench climbs from 68% to 71.0%, the Gray Swan IPI attack success rate drops from 0.7% to 0.0%, and the Terminal-Bench 4.0 cheating rate falls sharply. But Google also admits Carbon's hallucination rate rose from Argon's 4% to 11% — still the second-lowest of any model (behind only Argon itself), but it signals a tension between "more willing to attempt an answer" and "more likely to fabricate," not a clean improvement across the board.

Against competitors, Carbon takes #1 on the Artificial Analysis Intelligence Index v5.0 at 59, but it's only 1 point ahead of Claude Opus 5.5's 58 and 2 points ahead of GPT-6 Astra's 57 — and since the evaluator itself doesn't publish a margin of error, that reads more like a close three-way tie than a decisive lead. On the Coding Agent Index, Carbon actually trails Claude Opus 5.5 by 3 points (59 versus 62), which suggests Carbon's strength is concentrated in security and complex reasoning rather than a broad win across agentic coding.

On pricing, Carbon simply carries over Argon's current promotional rate of $2/$10, doubling to $4/$20 once the promo ends — there's no new pricing strategy this time, just a capability upgrade at the same price point, and Google hasn't given an end date for the promo, same as with Argon.

## What It Means for Agent Development

Carbon's biggest limitation right now isn't capability — it's access. It's only available to trusted security partners inside the Fairwind Program, ordinary developers can't even see an API model ID, and Google's announcement gives no concrete timeline for wider release.

- If you're building cybersecurity defense agents (the full loop of finding, validating, and patching vulnerabilities): state-of-the-art on all three security benchmarks makes this the strongest candidate available, but you'll need to apply to the Fairwind Program to actually test it — there's no path to integrating it into a product in the near term
- If you're building coding agents that need to run continuously for days on complex, multi-step engineering tasks: Google says its internal teams have let Carbon run for days to track down subtle bugs in large codebases, but it still trails Claude Opus 5.5 on the Coding Agent Index, so run your own tasks against both before committing
- Not a fit: putting Carbon on your production dependency list right now — there's no public model ID, no API access timeline, and even the 1M-token context window is a third-party measurement, not a number Google has confirmed, exactly the same situation Argon was in at launch
- If you're comparing flagship Gemini/Claude/GPT models: the gap between Carbon, Opus 5.5, and GPT-6 Astra on composite scores is only 1-2 points, so "which model can you actually get access to" may matter more for your decision than "whose benchmark score is marginally higher"

## Today's Takeaway

Google shipped Argon and then Carbon within two weeks, running the same playbook both times: announce benchmarks and pricing first, hold access back until last — and this time access came even later than before. It's a reminder to track "announcement date" and "availability date" as two separate timelines when following new model releases: the gap might be two weeks this time, or it might stretch past a month like it did with Argon. A model card's publish date doesn't mean anyone can actually get their hands on the model yet.

## References

- [Google Blog: Gemini 4 Carbon: our next frontier model](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Ars Technica: Google announces Gemini 4 Carbon, its latest frontier AI model that you can't use](https://arstechnica.com/ai/2026/10/google-announces-gemini-4-carbon-its-latest-frontier-ai-model-that-you-cant-use/)
- [CNET: Google Debuts New AI Models, Genie 4 and Gemini 4 Carbon: What You Need to Know](https://www.cnet.com/tech/services-and-software/google-genie-4-gemini-4-carbon-ai-news/)
- [Artificial Analysis: Gemini 4 Carbon is the new #1 on the Artificial Analysis Intelligence Index](https://artificialanalysis.ai/articles/gemini-4-carbon-new-number-1)
- [Artificial Analysis: Gemini 4 Carbon (high) model page](https://artificialanalysis.ai/models/gemini-4-carbon)
- [This site: Model Card: Gemini 4 Argon](/posts/daily/2026-10-05-model-google-gemini-4-argon-en)
