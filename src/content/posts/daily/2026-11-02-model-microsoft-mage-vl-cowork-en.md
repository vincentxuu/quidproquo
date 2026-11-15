---
title: "Model Card: Microsoft Mage-VL-Cowork"
date: 2026-11-02
category: daily
type: digest
tags: [ai-agent, model-release, daily, microsoft, model-family-mage]
lang: en
description: "Microsoft's Mage-VL-Cowork is a 4B hybrid GUI+terminal computer-use agent that hits 66.0% on OSWorld-Verified, beating a 27B open model and Claude Sonnet 4.5, under Apache-2.0"
tldr: "Microsoft Mage-VL-Cowork (HF ID `microsoft/Mage-VL-Cowork`): published to HuggingFace 2026-10-30, 4B parameters, 32,768-token active context (architecture supports up to 262,144), Apache-2.0, no official paid API. OSWorld-Verified: 66.0%, the best score at the 4B scale, ahead of the 27B Qwen3.6-27B (63.9%), the 72B OpenCUA-72B (44.9%), and Claude Sonnet 4.5 (62.9%) even though Sonnet got double the step budget. A single policy routes between screenshot-based GUI actions (`computer_use`) and `bash` terminal execution on its own, with no external router. Online Hybrid RL (GRPO) adds roughly 10pp over plain Hybrid SFT while cutting model calls by 13% and output tokens by 25.4%. Microsoft's own card says it should only run inside an isolated sandbox or VM, never with real credentials or local filesystem access."
series:
  name: "AI Model Tracker"
  order: 66
glossary:
  - term: "Mage-VL-Cowork"
    def: "A 4B hybrid computer-use agent model from Microsoft's Mage team; a single policy handles both GUI screenshot actions and terminal/code execution without an external orchestrator routing between them"
  - term: "Hybrid Computer-Use Agent"
    def: "An agent architecture with two action channels — screenshot-based GUI control and terminal/code execution — where the model itself decides which channel to use at each step"
---

> 🌏 [中文版](/posts/daily/2026-11-02-model-microsoft-mage-vl-cowork)

## Model Overview

| Field | Value |
|---|---|
| Model ID | `microsoft/Mage-VL-Cowork` |
| Vendor | Microsoft (Mage Team) |
| Parameters | 4B (9.48GB in bfloat16 across 2 safetensors shards; backbone is Mage-ViT + `Qwen3-4B-Instruct-2507`) |
| Context Window | 32,768 tokens (active training/inference window; architecture supports up to 262,144) |
| Input Price (USD/1M tokens) | N/A (open-weight research model, no official paid API — self-hosted only) |
| Output Price (USD/1M tokens) | N/A (same) |
| Open Source | Yes (Apache-2.0) |
| Release Date | 2026-10-30 |
| Official Announcement | [Mage-VL-Cowork project page](https://microsoft.github.io/Mage/cowork/) / [microsoft/Mage on GitHub](https://github.com/microsoft/Mage) |
| HuggingFace | [microsoft/Mage-VL-Cowork](https://huggingface.co/microsoft/Mage-VL-Cowork) |
| Family | Mage (Mage-ViT vision encoder → Mage-VL 4B multimodal foundation model → Mage-VL-Cowork hybrid computer-use agent; Cowork is the family's first public agent variant, so there is no prior version to compare against) |

## Highlights

- At just 4B parameters, Mage-VL-Cowork hits 66.0% on OSWorld-Verified — the best public score at the 4B scale, ahead of the 27B Qwen3.6-27B (63.9%), the 72B OpenCUA-72B (44.9%), and Claude Sonnet 4.5 (62.9%) despite Sonnet getting double the step budget (100 steps vs. this model's 50)
- A single vision-language policy carries two built-in channels: screenshot-grounded GUI control (`computer_use`) and a persistent shell/Python terminal (`bash`). The model decides for itself, turn by turn, whether to click or to write code — no external router or multi-agent split needed
- Online Hybrid RL (GRPO with verifiable task rewards) adds roughly 10 percentage points over plain Hybrid SFT, while cutting model calls by 13.0% and output tokens by 25.4% — more accurate and cheaper at the same time
- A purpose-built data synthesis engine, Mage-CUA-Forge, drives per-task generation cost down from $0.906 to $0.158 (−82.6%) by reusing skill-level workflows and application-specific preparers instead of running an open-ended agent loop for every task

The five-stage training curriculum stacks capability gradually, and the official technical report breaks the OSWorld-Verified gain down into two clean increments:

```diagram
title: How OSWorld-Verified climbed from 45.56% to 66.0%
desc: Mage-VL-Cowork scored 45.56% after GUI Agent SFT, 55.84% after adding Hybrid CUA SFT, and 66.04% after adding Online Hybrid RL.
caption: Source: the Stage-Wise Progression table on the Mage-VL-Cowork HuggingFace model card. 45.56+10.28=55.84; Microsoft's own text separately states Online RL "adds +10.16pp over Hybrid SFT," which is 0.04pp off the 10.20pp implied by the two rounded totals shown here — a rounding artifact in the source, not a transcription error.
---
<svg viewBox="0 0 640 360">
  <line class="dg-axis" x1="140" y1="123.32" x2="172" y2="123.32"/>
  <line class="dg-axis" x1="228" y1="92.48" x2="260" y2="92.48"/>
  <line class="dg-axis" x1="316" y1="92.48" x2="348" y2="92.48"/>
  <line class="dg-axis" x1="404" y1="61.88" x2="436" y2="61.88"/>

  <rect class="dg-bar dg-c-muted" x="84" y="123.32" width="56" height="136.68"/>
  <rect class="dg-bar dg-c-s1" x="172" y="92.48" width="56" height="30.84"/>
  <rect class="dg-bar dg-c-muted" x="260" y="92.48" width="56" height="167.52"/>
  <rect class="dg-bar dg-c-accent" x="348" y="61.88" width="56" height="30.6"/>
  <rect class="dg-bar dg-c-muted" x="436" y="61.88" width="56" height="198.12"/>
  <line class="dg-axis" x1="64" y1="260" x2="560" y2="260"/>

  <text class="dg-sub" x="112" y="111.32" text-anchor="middle" dominant-baseline="central">45.56%</text>
  <text class="dg-sub" x="200" y="80.48" text-anchor="middle" dominant-baseline="central">+10.28pp</text>
  <text class="dg-sub" x="288" y="80.48" text-anchor="middle" dominant-baseline="central">55.84%</text>
  <text class="dg-label dg-text--accent" x="376" y="49.88" text-anchor="middle" dominant-baseline="central">+10.20pp</text>
  <text class="dg-sub" x="464" y="49.88" text-anchor="middle" dominant-baseline="central">66.04%</text>

  <text class="dg-sub" x="112" y="280" text-anchor="middle" dominant-baseline="central">S2 GUI SFT</text>
  <text class="dg-sub" x="200" y="280" text-anchor="middle" dominant-baseline="central">+Hybrid</text>
  <text class="dg-sub" x="288" y="280" text-anchor="middle" dominant-baseline="central">S4 Hybrid</text>
  <text class="dg-label dg-text--accent" x="376" y="280" text-anchor="middle" dominant-baseline="central">+Online RL</text>
  <text class="dg-sub" x="464" y="280" text-anchor="middle" dominant-baseline="central">S5 Cowork</text>

  <line class="dg-rule" x1="20" y1="308" x2="620" y2="308"/>
  <text class="dg-tag" x="20" y="332" dominant-baseline="central">Legend</text>
  <rect class="dg-swatch dg-c-muted" x="76" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="100" y="332" dominant-baseline="central">Cumulative score</text>
  <rect class="dg-swatch dg-c-s1" x="212" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="236" y="332" dominant-baseline="central">Stage gain</text>
  <rect class="dg-swatch dg-c-accent" x="332" y="324" width="16" height="16" rx="2"/>
  <text class="dg-small" x="356" y="332" dominant-baseline="central">Online RL contribution</text>
</svg>
```

## Benchmarks

| Benchmark | Score | Predecessor | Strongest competitor |
|---|---|---|---|
| OSWorld-Verified (50 steps) | 66.0% | Debut (Mage family's first agent variant, no predecessor) | At 4B: nothing higher yet; across scales: GPT-5.4-mini 69.6%, Qwen3.6-27B (27B) 63.9%, Claude Sonnet 4.5 (100 steps) 62.9% |
| OSWorld-G (grounding) | 56.9% | Debut | Qwen3.5-4B: 54.5% (same scale) |
| ScreenSpot-v2 (grounding) | 87.2% | Debut | Qwen3-VL-4B: 85.3% (same scale) |
| WebVoyager-Static (browser, deterministic offline) | 58.6% | Debut | Fara1.5-4B (browser specialist): 68.0% |

⚠️ All figures above come from Microsoft's own technical report and HuggingFace model card; none have been independently reproduced yet. The headline 66.0% on OSWorld-Verified is the average of two full runs (65.33% and 66.75%) over 361 tasks, excluding Google Drive–dependent tasks.

## Versus Predecessor / Competitors

Mage-VL-Cowork is the Mage family's first public agent variant, so there's no predecessor within the family to compare it against — the relevant comparison set is "4B-scale computer-use agents." There it's unambiguous: it beats every open model listed, including the far larger 27B Qwen3.6-27B (63.9%), the 32B EvoCUA-32B (56.7%), and the 72B OpenCUA-72B (44.9%). Against closed frontier models, it also beats OpenAI's CUA at a 50-step budget (31.3%) and Claude Sonnet 4.5 even with double the step budget (62.9%), but it trails GPT-5.4-mini (69.6%, also at 50 steps) and genuine flagship models (GPT-5.5 at 78.7%, Claude Opus 4.7 at 78.0%).

The real differentiator isn't the score — it's the architecture. Most computer-use agents only drive the GUI through screenshots. Mage-VL-Cowork folds GUI control and terminal execution into one policy, letting the model decide for itself when to click and when three lines of Python will do the job faster. In Microsoft's own side-by-side demos, merging cells and charting a spreadsheet in LibreOffice Calc took 39 seconds and 6 steps by editing the file directly through the terminal, versus 9 minutes 56 seconds and 39 steps for the GUI-only 27B Qwen3.6-27B — a 15.3× speedup. Browser-only tasks aren't where it shines, though: on WebVoyager-Static it scores 58.6%, behind the browser-specialist Fara1.5-4B (68.0%), because that model gave up general desktop competence to specialize purely in browsers.

## What This Means for Agent Builders

A common pattern in MCP and multi-agent setups is a supervisor or router that decides whether to call a GUI agent or a coding agent. Mage-VL-Cowork shows that this routing decision can be trained directly into a single model's policy, with no extra orchestration layer required.

- If you're building computer-use or RPA-style agents: this "GUI + terminal, model picks the channel" design is worth copying — don't force your front-end model to do structured operations (editing a spreadsheet, a config file, checking a file's state) entirely through screenshots when three lines of shell would do it faster
- If you handle sensitive screens (internal systems, customer data, compliance documents): a 4B model can run locally on a single 16GB GPU in bf16, or 8GB with a 4-bit GGUF, which means screenshots never have to leave your environment for a cloud API — useful wherever data residency matters
- Not a fit: scenarios that touch a real filesystem, network, or credentials directly. Microsoft's own card insists it only run inside an isolated, disposable sandbox or VM, never with real SSH keys, cloud tokens, or password stores mounted, and never against unfiltered external web content (to limit indirect prompt injection)
- If you're building a pure browser agent: this isn't its strength — WebVoyager-Static still trails a smaller browser-specialist model, so a browser-limited task is better served by a model built just for that

## Today's Takeaway

I used to assume that "screenshot-based control" and "writing code" had to be stitched together by an external router or multi-agent setup — one model classifies the task, then hands it off to the right specialist. Mage-VL-Cowork's hybrid CUA training shows that routing decision can become part of a single model's policy instead: the same 4B model first builds two independent channels through a five-stage curriculum, then uses RL to learn when to use which — and ends up both more accurate and cheaper in tokens than plain SFT. The lesson for architecture decisions: sometimes the answer to "should we split this into separate agents" is to train both capabilities into one policy first, rather than rushing to decompose into specialists.

## References

- [microsoft/Mage-VL-Cowork · HuggingFace](https://huggingface.co/microsoft/Mage-VL-Cowork)
- [Mage-VL-Cowork official project page](https://microsoft.github.io/Mage/cowork/)
- [microsoft/Mage · GitHub](https://github.com/microsoft/Mage)
- [How to Run Mage-VL-Cowork Locally: Microsoft's 4B Agent Beats Sonnet 4.5 (DEV Community)](https://dev.to/alanwest/how-to-run-mage-vl-cowork-locally-microsofts-4b-agent-beats-sonnet-45-3dh4)
- [Microsoft's Mage-VL-Cowork fits a desktop agent into 4B parameters (i-scoop.eu)](https://www.i-scoop.eu/mage-vl-cowork)
