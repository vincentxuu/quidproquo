---
title: "Product Builder Interview Daily — 2026-09-16: Strategy & Execution"
date: 2026-09-16
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: en
description: "Today's Strategy & Execution practice: use Porter's Five Forces to work through a case question on where to build a moat once open-weight models catch up with frontier models, with a case study of Anthropic paying $400M for Coefficient Bio to move its moat from the model layer to vertical data."
tldr: "When the underlying technology gets matched by open-weight models, the interviewer isn't checking whether you can name a moat candidate — they're checking whether you can first use Porter's Five Forces to locate where the pressure is actually coming from, then use TAM-SAM-SOM to size whether a vertical pivot is worth betting on. Today's practice question is an original case built on 2026's model-commoditization pressure: how should an AI application company sequence its roadmap. The case study is Anthropic's acquisition of biotech AI company Coefficient Bio, which moved its defensibility from \"which model you use\" to \"which vertical's data and workflow integration you own.\""
series:
  name: "Product Builder 面試日練"
  order: 28
---

> 🌏 [中文版](/posts/daily/2026-09-16-product-builder-interview-daily)

## Today's Topic

The Strategy & Execution round is the easiest one to turn into a vision speech: "which direction should the company build competitive advantage in." The interviewer isn't listening for you to recite words like "differentiation" or "moat" — they're checking whether you can pin down where the pressure is actually coming from (a supplier, a buyer, a new entrant) before deciding where to put resources. In 2026 this question got a lot more concrete: open-weight models have caught up with frontier closed models on multiple benchmarks, which means "which model we use" is evaporating fast as a moat, forcing every AI product team to re-answer "what are we actually defending."

This topic matters in interviews because it tests both market-positioning judgment (can you see that the moat is shifting) and execution (can you turn that judgment into a concrete, sequenced roadmap rather than a strategy slide nobody actually ships against).

## Core Framework Cheat Sheet

### Porter's Five Forces: locate where the pressure is coming from first

The most common way to lose points on a strategy question is jumping straight to "we should do X" without establishing "why X, and why now." Sweeping the five forces first gives your answer structure:

| Force | What to check | 2026 AI product signal |
|------|------|------|
| Threat of new entrants | Is the barrier to entering this market falling | Open-weight models let new startups ship a "good-enough" product at much lower cost |
| Bargaining power of suppliers | Do the key suppliers you depend on have substitutes | More model-layer providers means the switching cost of your underlying model is dropping |
| Bargaining power of buyers | Do your customers have more alternatives | Customers can compare more AI applications for the same budget, raising their leverage |
| Threat of substitutes | Is there a completely different technical path that replaces you | Could a general-purpose agent tool replace your vertical application |
| Competitive rivalry | How intense is competition among existing players | Are several companies in the same vertical fighting over the same early customers |

**How to use this in an interview**: you don't need to dig deep into all five, but sweep across them once to state which two are actually driving the current pressure, then focus your proposed solution on those two — not a generic "we need a moat."

### TAM-SAM-SOM: sizing whether a pivot is worth the bet

Once you've located the pressure, if the answer is "pivot toward a vertical," you need to prove that pivot has real market size behind it, not just that it sounds appealing:

1. **TAM (Total Addressable Market)**: the theoretical total size of this vertical
2. **SAM (Serviceable Addressable Market)**: the portion reachable given current product capability and go-to-market motion
3. **SOM (Serviceable Obtainable Market)**: what you can realistically capture in the next 1-2 quarters, given competition and resource constraints

What the interviewer wants is a concrete SOM — not "this market is big," but "here's the specific customer segment and size we can capture in two quarters" — because that's what feeds directly into how you sequence the roadmap next.

## Today's Practice Question

### The Question

"You're the head of product strategy at an AI application company. Over the past six months, open-weight models (e.g. DeepSeek, Llama) have caught up with frontier closed models on multiple benchmarks, and your competitors can now swap out their underlying model provider at similar cost. The CEO wants you to propose, at the next quarterly planning meeting, which direction to build a moat in over the next two quarters and how to sequence the roadmap accordingly."

(Source: an original question designed around 2026's industry trend of open-weight models catching up with frontier models and rapid commoditization at the model layer.)

### How to Break It Down

1. **Clarify the problem**: Ask first — which layer does the company's value currently sit in (model layer, application layer, or data/workflow-integration layer)? What existing assets could be moat candidates (proprietary data, depth of customer workflow integration, existing distribution)? How much engineering and resource capacity is available over the next two quarters?
2. **Define the user**: Is the core customer enterprise or SMB? Does their current switching cost come mainly from "model quality," or from "they're already integrated into a workflow they can't easily rip out"? This distinction decides which direction the moat should be reinforced in.
3. **Structured analysis**: Use Porter's Five Forces to locate the pressure — it's mainly rising supplier bargaining power (the model is more substitutable) and rising buyer bargaining power (customers can switch providers more easily), not new entrants or substitutes directly. Then use TAM-SAM-SOM to size whether "deepening into a specific vertical" is worth the investment.
4. **Propose a plan**: State the trade-off clearly — continuing to compete on "model quality" means the moat keeps thinning as open-weight models catch up; the better bet is moving the moat from "which model you use" to "which vertical's proprietary data and workflow integration you own," and name what this choice gives up (e.g. not chasing the latest model performance leaderboard in the short term, redirecting that budget into domain data collection and customer integration).
5. **Define success**: Set verifiable metrics — net revenue retention (NRR), churn rate when a competitor offers a comparable model, contract renewal rate among vertical customers — that prove the moat actually moved from "model" to "data and integration," not just that the story changed.

### Sample Answer (how to actually say this in an interview)

> **Clarify and locate**: "I'd first confirm which layer our value actually sits in — if customers stay because our model performs slightly better, that edge is going to erode fast as open-weight models catch up. So my first move is a five-forces read: this pressure is mainly rising supplier bargaining power, because the underlying model is now substitutable, and rising buyer bargaining power, because customers can compare more providers on the same budget. That tells me we shouldn't keep competing on 'model quality' as our primary axis."
>
> **Structured analysis and trade-off**: "I'd evaluate a pivot into a specific vertical using TAM-SAM-SOM and pin down an actual number, not just 'this market is big.' Assuming we pick a vertical where customers are already using us and we already hold the data, what we can realistically capture in two quarters is the number that decides whether this bet is worth making. I'd recommend shifting the next two quarters' resources from 'chase the newest model performance' to 'deepen this vertical's data and workflow integration' — the cost is that our short-term benchmark ranking might not lead, but the resulting moat holds up longer than a model-layer one."
>
> **Defining success**: "I'd validate this with net revenue retention and churn rate when a competitor offers a comparable model — if the moat really moved to data and integration, even when a better-performing open-weight model shows up later, our retention shouldn't drop meaningfully, because customers can't easily rip out what's already wired into their workflow. That's the core metric I'd use to judge whether this strategy actually worked, not our position on a model benchmark leaderboard."

### Self-Check List

Use this table to check whether your answer missed anything important:

| Check item | Covered? |
|---------|---------|
| Used Porter's Five Forces to locate which force is actually driving the pressure, instead of a generic "we need a moat" | |
| Distinguished "model-layer moat" from "data/workflow-integration-layer moat" | |
| Used TAM-SAM-SOM to give a concrete, verifiable market-size judgment | |
| Named the trade-off clearly — what the pivot gives up, what it gains | |
| Success metric verifies the moat actually moved, not just a change in narrative | |
| Bonus: tied the moat candidate to a specific mechanism for "why the customer can't switch away" | |

## Today's Case Study

**Anthropic: paying $400M for Coefficient Bio to move the moat from the model to vertical data**

In April 2026, Anthropic acquired biotech AI company Coefficient Bio for roughly $400 million — its largest acquisition at the time. The deal was part of what's been described externally as a "100-day biopharma sprint": Anthropic simultaneously acquired teams with molecular-design-pipeline and scientific-research-workflow experience, and launched a biology-optimized Claude Science workbench, aiming to move from being a general-purpose model provider to becoming a research partner that global pharmaceutical companies actually depend on. This timing lines up almost exactly with open-weight models (DeepSeek, Llama, etc.) catching up with frontier closed models on multiple benchmarks — as "our model is simply better" becomes harder to sustain as a long-term edge, Anthropic chose to bet its defensibility on "which vertical's proprietary data, workflow integration, and scientific talent we own" instead of continuing to compete purely on model-performance rankings.

**Interview angle**: this case is strong material for "how should a company build a new moat once its technical moat disappears" or "describe a strategic pivot you've observed." A strong answer doesn't stop at "Anthropic acquired a company" — it names the underlying logic: when one layer's (the model layer's) moat thins out due to commoditization, the company redirects resources into another layer (vertical data and workflow integration), and backs that judgment with concrete acquisition and product moves (the Claude Science workbench), rather than just talking about differentiation.

## Further Reading

- [Competitive Moat: Meaning, Types & Examples in Business [2026]](https://waveup.com/blog/how-to-build-your-competitive-moat/) — a survey of the main moat types and 2026 examples, including Nvidia's CUDA ecosystem, Tesla's FSD data moat, and the logic behind Anthropic's acquisition
- [Unpacking Anthropic's 100-Day Sprint to Reshape Biopharma and Drug Discovery](https://priyalifescience.com/article/unpacking-anthropic-100-day-sprint-biopharma-drug-discovery-2026) — a full breakdown of the acquisitions and product moves inside Anthropic's "100-day biopharma sprint"
- [The Next Inflection Is the Lab](https://bepresearch.substack.com/p/the-next-inflection-is-the-lab) — industry context on why AI labs are broadly pivoting toward vertical data and talent moats under model-commoditization pressure

## References

- [Competitive Moat: Meaning, Types & Examples in Business [2026]](https://waveup.com/blog/how-to-build-your-competitive-moat/) — source for the moat taxonomy in "Core Framework Cheat Sheet" and the commoditization scenario in "Today's Practice Question"
- [Unpacking Anthropic's 100-Day Sprint to Reshape Biopharma and Drug Discovery](https://priyalifescience.com/article/unpacking-anthropic-100-day-sprint-biopharma-drug-discovery-2026) — source for the details of Anthropic's acquisition of Coefficient Bio in "Today's Case Study"
- [The Next Inflection Is the Lab](https://bepresearch.substack.com/p/the-next-inflection-is-the-lab) — source for the industry background on model commoditization and AI labs' pivot to vertical moats in "Today's Case Study"
