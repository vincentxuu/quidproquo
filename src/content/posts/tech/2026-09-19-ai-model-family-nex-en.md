---
title: "Nex-N2.5: The Open Agent Family That Treats Vision as an Interface, From 35B mini to 1.6T Max"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, nex-agi, model-family-nex, moe, open-source, agentic-coding, model-selection]
lang: en
tldr: "Nex-N2.5 is Nex AGI's open agentic model family: mini scores 82.9 on OSWorld-G at 35B-A3B, Pro tops Claude Opus 5 with 87.4 at 397B-A17B, and Max leads the whole official table on BrowseComp with 92.6 at 1.6T, all open under Apache-2.0."
description: "Complete guide to the Nex AGI Nex-N2.5 model family: evolution from Nex-N1 to N2.5, mini/Pro/Max positioning, the visual-feedback self-correction design philosophy, three-level reasoning_effort control, a walkthrough of the official benchmark table, Apache-2.0 open weights and deployment, and a selection guide for agent builders"
series:
  name: "AI 模型家族"
  order: 22
draft: false
glossary:
  - term: "Nex-N2.5"
    definition: "Nex AGI's open agentic model family in three sizes — mini (35B), Pro (397B), Max (1.6T) — built for computer use, browser use, and visual-feedback self-correction on long-horizon tasks."
  - term: "OSWorld-G"
    definition: "A computer-use grounding benchmark that measures how accurately a model locates UI elements — the coordinate fundamentals for computer-use agents."
  - term: "reasoning_effort"
    definition: "Nex-N2.5's thinking control: none answers directly, medium (default) thinks adaptively, high always thinks."
---

> 🌏 [中文版](/posts/tech/2026-09-19-ai-model-family-nex)

On September 8, 2026, [Nex AGI](https://nex-agi.com/) released [Nex-N2.5](https://huggingface.co/nex-agi/Nex-N2.5-mini) — an open agentic model family spanning 35B to 1.6T, all under Apache-2.0. The eye-catcher is not the biggest one but the middle child: Pro scores 87.4 on [OSWorld-G](https://huggingface.co/nex-agi/Nex-N2.5-mini) computer-use grounding, ahead of [Claude Opus 5](https://www.anthropic.com/) at 76.8, while the Max tops the entire official table on BrowseComp with 92.6. This is the twenty-second family deep-dive in the "AI 模型家族" series, tracing Nex from Nex-N2 to N2.5.

For how to read benchmark numbers in this post, see the [AI model evaluation sources guide](/en/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This post is part of the [AI model landscape overview](/en/posts/tech/2026-08-24-ai-model-landscape-overview-en) series. For per-model details see the site's two model cards: [Model Card: Nex-N2.5-mini](/en/posts/daily/2026-09-11-model-nex-agi-nex-n2-5-mini-en) and [Model Card: Nex-N2.5-Pro](/en/posts/daily/2026-09-15-model-nex-agi-nex-n2-5-pro-en).

## Family timeline

| Date | Release | What mattered |
|---|---|---|
| Dec 2025 | Nex-N1 (four sizes 8B–671B + N1.1) | First generation: full-stack agent platform, flagship DeepSeek-V3.1-Nex-N1 (671B) at 70.6 on SWE-bench Verified |
| Pre-2026 | Nex-N2 (mini / Pro) | Previous generation: mini as a 35B-A3B autonomous-agent model, Pro at 397B-A17B; N2-mini's DeepSWE sat at 8.0 — the baseline N2.5 exploded from |
| 2026-09-08 | Nex-N2.5 (mini / Pro / Max) | Full second generation: mini/Pro continue N2's multimodal foundations with stronger post-training, Max completes full post-training at trillion-parameter scale for the first time |

Nex iterates the same way [Laguna](/en/posts/tech/2026-09-19-ai-model-family-laguna-en) does: **new post-training, not a new base**. Looking further back, the first generation was [Nex-N1](https://github.com/nex-agi/Nex-N1) (Dec 2025, four sizes from 8B to 671B, flagship DeepSeek-V3.1-Nex-N1), with N2 building one layer on top. The official line is that N2.5-mini/Pro continue the [Nex-N2](https://github.com/nex-agi/Nex-N2) multimodal foundations, with gains from wider agent-training environments, task types, and productivity-scenario coverage. The shape of the scores backs it: mini's DeepSWE v1.1 jumps from 8.0 to 36.1 (4.5x), Pro's Terminal-Bench 2.1 from 75.3 to 82.7 (+7.4pp) — same parameters, higher long-horizon success rates.

## Three sizes: mini for volume, Pro for work, Max for the ceiling

**mini (35B-A3B)**: the entry point, 35B total parameters in BF16 on [Hugging Face](https://huggingface.co/nex-agi/Nex-N2.5-mini), post-trained from Qwen3.5-35B-A3B-Base. 262,144 context with about 236K max output. Runs on a single 2×H100 node (`--tp 2`) — the lowest deployment bar of the three. [OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-mini:free) hosts a free tier at $0.00 for input and output.

**Pro (397B-A17B)**: the workhorse, keeping the previous generation's 397B-total, ~17B-active MoE (built on `Qwen3.5-397B-A17B`). Same 262,144 context. Servable on a single 8×H100 node (`--tp 8`) with no multi-node cluster like Max needs. [OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-pro:free) offers a free tier too.

**Max (1.6T text-only MoE)**: the flagship, a 1.6-trillion-parameter text-only MoE and Nex's first complete post-training run at trillion scale. Note the difference from its siblings: **text only, no multimodality**. Deployment takes 2 nodes and 16×H200 (`--tp 16`) at 262,144 context. This size is clearly not meant for self-hosting mortals — it exists to prove the post-training recipe works at trillion scale.

The division of labor is blunt: **mini validates the loop, Pro does the work, Max proves the ceiling**.

## Design philosophy: vision is an interface, not an input

The whole N2.5 family shares a one-line design philosophy, quoted from the official [model card](https://huggingface.co/nex-agi/Nex-N2.5-mini):

> Vision is therefore no longer merely an input modality; it has become a critical interface through which an agent perceives its environment, verifies outcomes, and moves a task forward.

In plain terms: the model looks at the screen not to "understand images" but to **check whether its last action worked** — did the app open, did the button press register, did the tests pass. That is the visual-feedback self-correction loop: operate computers and browsers, execute and test programs, and on mismatch diagnose, fix, and rerun instead of answering once.

That bet explains the entire benchmark shape: everything measuring "how accurately it grounds" or "how completely it operates" (OSWorld-G, OSWorld-Verified, BrowseComp) favors the whole Nex family, while pure-text reasoning ceilings (SWE-Bench Pro, DeepSWE) honestly trail closed flagships. All resources on one face, so the leaderboard grows the same shape.

## Reasoning control: three levels, one finer than Laguna

N2.5 controls thinking with `reasoning_effort` ([official docs](https://huggingface.co/nex-agi/Nex-N2.5-mini)): `none` answers directly with no trace, `medium` (default) thinks adaptively, `high` always thinks. Compared with [Laguna S 2.1](/en/posts/tech/2026-09-19-ai-model-family-laguna-en), which offers only `off`/`max`, Nex adds one middle setting that lets the model decide.

The parsers come in two pairs as well: `--reasoning-parser qwen3` for mini/Pro, `--reasoning-parser deepseek-r1` for Max, with function calling uniformly on `--tool-call-parser qwen3_coder`. Recommended sampling is `temperature=0.7`, `top_p=0.95`, `top_k=40` — note the departure from the `temperature=1.0` default of most coding models; align judge conditions before cross-comparing.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="YOUR_OPENROUTER_KEY",
)
resp = client.chat.completions.create(
    model="nex-agi/nex-n2.5-mini:free",
    messages=[{"role": "user", "content": "Open the settings app and turn on dark mode."}],
    extra_body={"reasoning_effort": "medium"},
)
print(resp.choices[0].message.content)
```

## Family matrix and selection

All numbers below are the official September 8, 2026 table (coding on the in-house [NexAU](https://github.com/nex-agi/NexAU) harness, computer use on NexCUA, no independent third-party reproduction yet):

| Benchmark | mini | Pro | Max | Strongest rival in table |
|---|---|---|---|---|
| Terminal-Bench 2.1 | 73.4 | 82.7 | 86.1 | Opus 5: 89.1 |
| SWE-Bench Pro | 43.8 | 61.2 | 65.7 | Opus 5: 79.2 |
| DeepSWE v1.1 | 36.1 | 55.8 | 65.6 | Opus 5: 73.7 |
| BrowseComp | 83.4 | 89.7 | **92.6 (table best)** | Opus 5: 90.8 |
| OSWorld-G (grounding) | 82.9 | **87.4 (table best)** | — | Qwen3.8-Max: 84.9 |
| OSWorld-Verified | 71.2 | 82.2 | — | Qwen3.8-Max: 86.1 |
| Toolathlon Verified | 54.6 | 68.5 | 74.7 | Opus 5 / Kimi-K3: 76.5 |
| AutomationBench | 32.3 | 44.2 | 50.2 | Opus 5: 50.3 |

Selection logic: **for free computer-use loop experiments — mini; for grounding accuracy on holdable single-node hardware — Pro; for the text-reasoning ceiling — Max (if you have 16×H200)**. Max has no OSWorld-family scores because it is a text-only model and cannot enter the computer-use track — don't measure it with the wrong ruler.

## Open strategy and ecosystem

All three ship under Apache-2.0, with weights on both [Hugging Face](https://huggingface.co/collections/nex-agi/nex-n25) and [ModelScope](https://modelscope.cn/models/nex-agi/Nex-N2.5-mini) and hosted access via [OpenRouter](https://openrouter.ai/nex-agi/nex-n2.5-mini) (mini/Pro on free tiers). Deployment runs on the in-house [sglang fork](https://github.com/nex-agi/Nex-N2.5) (`nexagi/sglang:v0.5.18-nex-patch`), with [vLLM](https://github.com/vllm-project/vllm) and transformers also supported. Against Laguna's OpenMDW-1.1, Apache-2.0 is the more dispute-free commercial license and the easier sell to enterprise legal.

The free-tier play is worth noting: mini and Pro both at $0.00 pushes the "try it" cost to zero. Unlike [Laguna](/en/posts/tech/2026-09-19-ai-model-family-laguna-en), whose free tier caps context at 256K, Nex's free offering is the full model — the price is rate limits, so check OpenRouter's limit docs before scaling.

## Where it stands against rivals

One line: **honest follower on coding boards, leader on computer-use boards**.

On text coding (Terminal-Bench, SWE-Pro, DeepSWE) all three trail Opus 5 by 3pp to 35pp; Max's SWE-Pro 65.7 does beat GPT-5.6 Sol (64.6) and Kimi-K3 (63.3), an open first tier. But on OSWorld-G both mini (82.9) and Pro (87.4) beat Opus 5 (76.8) and GPT-5.6 Sol (77.7), and Max's BrowseComp (92.6) is the table's only score ahead of Opus 5 — the visual-grounding-plus-self-correction bet paying out.

One caveat: the whole table is vendor self-tested (NexAU/NexCUA) with rival scores taken from public reports and leaderboards, not rerun in one harness by a third party. Discount for home-field advantage accordingly.

## What it means for agent builders

For **computer-use/browser-use prototypes**: mini is currently the cheapest validation entry — a free tier plus 82.9 grounding to test whether the visual-feedback loop works before committing to a paid API.

For a **self-hosted workhorse agent**: Pro is the sweet spot. 87.4 grounding accuracy, 82.7 on TB 2.1, single 8×H100 node, and Apache-2.0 with no modification baggage. Existing N2 sglang deployment scripts carry over for upgrades.

Not for: top coding accuracy in production (SWE-Pro 61.2 trails Opus 5's 79.2 by ~18pp), commercial SLAs (only the OpenRouter free tier exists so far, no standalone commercial pricing), or flagship text capabilities outside multimodality (that's Max territory, and it wants a two-node H200 cluster).

## Overall

Nex-N2.5's bet is the other side of Laguna's coin: Laguna bets on "behavior that persists", Nex bets on "**the loop that sees**" — turning vision from input into verification interface so agents finish tasks in real environments on their own. mini proves the loop works at 35B, Pro proves it can beat closed models, Max proves it scales to trillions.

Two things to watch: whether third parties reproduce the 87.4 OSWorld-G once NexCUA is open-sourced, and whether Max's text-only track merges with the multimodal line next generation — 1.6T doing text alone looks like an unfinished puzzle.

## References

- [Nex AGI: Nex-N2.5 — Vision into Action (official site)](https://nex-agi.com/)
- [Hugging Face: nex-agi/Nex-N2.5-mini (full family benchmark table)](https://huggingface.co/nex-agi/Nex-N2.5-mini)
- [Hugging Face: nex-agi/Nex-N2.5-Pro](https://huggingface.co/nex-agi/Nex-N2.5-Pro)
- [Hugging Face: Nex-N2.5 Collection (all three weights)](https://huggingface.co/collections/nex-agi/nex-n25)
- [GitHub: nex-agi/Nex-N2.5 (deployment and eval)](https://github.com/nex-agi/Nex-N2.5)
- [GitHub: nex-agi/Nex-N2 (previous-gen benchmarks and base specs)](https://github.com/nex-agi/Nex-N2)
- [GitHub: nex-agi/Nex-N1 (first generation, four sizes 8B–671B)](https://github.com/nex-agi/Nex-N1)
- [Hugging Face: Nex-N1 Collection](https://huggingface.co/collections/nex-agi/nex-n1)
- [OpenRouter: nex-agi/nex-n2.5-mini:free](https://openrouter.ai/nex-agi/nex-n2.5-mini:free)
- [OpenRouter: nex-agi/nex-n2.5-pro:free](https://openrouter.ai/nex-agi/nex-n2.5-pro:free)
