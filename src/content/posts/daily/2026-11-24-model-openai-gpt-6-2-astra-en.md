---
title: "Model Card: GPT-6.2 Astra"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI ships GPT-6.2 Astra and Sol, cutting Astra's price 20% to match Claude Fable 5.2 exactly and beating its predecessor on nine official benchmarks — then gets publicly panned by senior developers as barely usable on agentic work"
tldr: "GPT-6.2 Astra (API ID gpt-6.2-astra, released 2026-11-17): 1,050,000-token context window, 128,000 max output tokens, $8.00 input / $40.00 output per 1M tokens (down 20% from the prior generation, now matching Claude Fable 5.2's exact price), closed source; scores 78.3% on Agents' Last Exam (up from 73.1%) and 82.5% on BenchCAD 2.1 Core (up from 62.6%); ranks 62 on the Artificial Analysis Intelligence Index, second globally behind Claude Fable 5.2's 65. The cheaper companion model, GPT-6.2 Sol, keeps its $2/$10 pricing. But several senior developers who have long tested OpenAI's flagship models publicly called Astra barely usable on long-horizon agentic tasks — a visible gap between benchmark gains and real-world agent reliability."
series:
  name: "AI Model Tracker"
  order: 81
glossary:
  - term: "Preparedness Framework"
    def: "OpenAI's internal risk-tiering framework for frontier-model capabilities that carry outsized risk — cybersecurity, biological/chemical, and AI self-improvement — rated Low, Medium, High, or Critical"
  - term: "AI Self-improvement"
    def: "A Preparedness Framework risk category measuring how much a model can accelerate AI research itself; GPT-6.2 Astra is the first externally released model OpenAI has rated at the 'High' tier for it"
---

> :globe: [中文版](/posts/daily/2026-11-24-model-openai-gpt-6-2-astra)

## Model Info

| Item | Value |
|---|---|
| Model ID | `gpt-6.2-astra` (shipped alongside the cheaper `gpt-6.2-sol`) |
| Vendor | OpenAI |
| Parameters | Undisclosed |
| Context Window | 1,050,000 tokens (128,000 max output tokens; input accepts text + image, output is text only) |
| Input Price (USD/1M tokens) | $8.00 (cached input $0.40; $16.00 once input exceeds 272K tokens; Sol: $2.00, cached $0.10) |
| Output Price (USD/1M tokens) | $40.00 ($60.00 once input exceeds 272K tokens; Sol: $10.00) |
| Open Source | No |
| Release Date | 2026-11-17 |
| Official Announcement | [OpenAI: Introducing GPT-6.2 Astra and Sol](https://openai.com/index/introducing-gpt-6-2-astra-sol) |
| Family | GPT-6.x (predecessors: GPT-6 Astra / GPT-6.1 Sol) |

## Key Capabilities

- Agents' Last Exam v1.1 (multistep professional work) jumps from predecessor GPT-6 Astra's 73.1% to 78.3% — achieved at less than a third of the cost
- BenchCAD 2.1 Core (CAD design tasks) climbs from 62.6% to 82.5%, a 19.9-point gain — the largest improvement among the nine official head-to-head benchmarks OpenAI published
- Harvey LAB-AA (legal work, which only credits a pass when every requirement is met with zero material hallucinations) rises from 8.6% to 15.0% — still a low absolute score, but nearly double the predecessor's rate
- The first externally released model OpenAI rates at the "High" tier for AI Self-improvement under its Preparedness Framework; OpenAI shipped a new monitoring system, Control Room, alongside it to intervene in internal research workflows in real time

## Benchmark Results

| Benchmark | GPT-6.2 Astra | Predecessor (GPT-6 Astra) | Competitor |
|---|---|---|---|
| Artificial Analysis Intelligence Index v5 | 62 | 57 | Claude Fable 5.2 — 65 (independent AA test, Astra ranks second globally) |
| Agents' Last Exam v1.1 (multistep professional work) | 78.3% | 73.1% | Not independently disclosed (OpenAI claims a 5.5-point lead over Claude Fable 5.2) |
| Terminal-Bench-Science 0.1 (scientific research workflows) | 77.1% (OpenAI-reported) | 68.1% | Claude Fable 5.2 — 73.3% (independent AA test) / Anthropic-reported 74.6%; Mythos 5.2 self-reported 75.3% |
| Harvey LAB-AA (legal, strict pass rate) | 15.0% | 8.6% | Claude Fable 5.2 — roughly 7% (OpenAI claims Astra's pass rate is "more than double"; Fable's raw score was never independently disclosed) |
| BenchCAD 2.1 Core (CAD tasks) | 82.5% | 62.6% | Undisclosed |

:warning: The Agents' Last Exam, Harvey LAB-AA, and BenchCAD comparisons against the predecessor come from OpenAI's own launch materials, using each model's best reasoning setting; independent labs have not reproduced all of them. The Artificial Analysis Intelligence Index and the AA-measured Terminal-Bench-Science score are independent third-party tests that can be compared across vendors. Separately, independent testing found a more mixed picture on Codex: Astra's Coding Agent Index came out flat versus its predecessor, while Sol's dropped 3 index points — traced mainly to a 14-point decline on the SWE-Atlas-QnA-AA sub-test, where Sol more often leaves out key facts when answering questions about a codebase.

```diagram
title: GPT-6.2 Astra's gains over predecessor GPT-6 Astra on four official benchmarks
desc: GPT-6.2 Astra beats predecessor GPT-6 Astra on all four benchmarks shown, but the absolute scores sit in very different ranges — Harvey LAB-AA's strict pass rate is still in the single-to-low-double digits, while the other three are already in the 60-80% range.
caption: Figures compiled from OpenAI's official launch page and third-party Artificial Analysis coverage. x-coordinate = 200 + score(%) × 4, so 0% maps to x=200 and 100% maps to x=600. Rows are ordered by point gain, largest first: BenchCAD +19.9pp, Terminal-Bench-Science +9.0pp, Harvey LAB-AA +6.4pp, Agents' Last Exam +5.2pp.
---
<svg viewBox="0 0 640 410">
  <text class="dg-small" x="200" y="36" text-anchor="middle" dominant-baseline="central">0%</text>
  <text class="dg-small" x="400" y="36" text-anchor="middle" dominant-baseline="central">50%</text>
  <text class="dg-small" x="600" y="36" text-anchor="middle" dominant-baseline="central">100%</text>
  <line class="dg-grid" x1="400" y1="50" x2="400" y2="356"/>

  <text class="dg-label" x="160" y="90" text-anchor="end" dominant-baseline="central">BenchCAD 2.1</text>
  <line class="dg-axis" x1="450" y1="90" x2="530" y2="90"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="450" cy="90" r="6"/>
  <circle class="dg-point dg-c-accent" cx="530" cy="90" r="6"/>
  <text class="dg-sub" x="438" y="90" text-anchor="end" dominant-baseline="central">62.6%</text>
  <text class="dg-label dg-text--accent" x="542" y="90" text-anchor="start" dominant-baseline="central">82.5%</text>

  <text class="dg-label" x="160" y="170" text-anchor="end" dominant-baseline="central">TB-Science 0.1</text>
  <line class="dg-axis" x1="472" y1="170" x2="508" y2="170"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="472" cy="170" r="6"/>
  <circle class="dg-point dg-c-accent" cx="508" cy="170" r="6"/>
  <text class="dg-sub" x="460" y="170" text-anchor="end" dominant-baseline="central">68.1%</text>
  <text class="dg-label dg-text--accent" x="520" y="170" text-anchor="start" dominant-baseline="central">77.1%</text>

  <text class="dg-label" x="160" y="250" text-anchor="end" dominant-baseline="central">Harvey LAB-AA</text>
  <line class="dg-axis" x1="234" y1="250" x2="260" y2="250"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="234" cy="250" r="6"/>
  <circle class="dg-point dg-c-accent" cx="260" cy="250" r="6"/>
  <text class="dg-sub" x="222" y="250" text-anchor="end" dominant-baseline="central">8.6%</text>
  <text class="dg-label dg-text--accent" x="272" y="250" text-anchor="start" dominant-baseline="central">15.0%</text>

  <text class="dg-label" x="160" y="330" text-anchor="end" dominant-baseline="central">Agents' Last Exam</text>
  <line class="dg-axis" x1="492" y1="330" x2="513" y2="330"/>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="492" cy="330" r="6"/>
  <circle class="dg-point dg-c-accent" cx="513" cy="330" r="6"/>
  <text class="dg-sub" x="480" y="330" text-anchor="end" dominant-baseline="central">73.1%</text>
  <text class="dg-label dg-text--accent" x="525" y="330" text-anchor="start" dominant-baseline="central">78.3%</text>

  <line class="dg-rule" x1="20" y1="356" x2="620" y2="356"/>
  <text class="dg-tag" x="20" y="382" dominant-baseline="central">Legend</text>
  <circle class="dg-point dg-point--hollow dg-c-muted" cx="150" cy="382" r="6"/>
  <text class="dg-small" x="166" y="382" dominant-baseline="central">GPT-6 Astra (predecessor)</text>
  <circle class="dg-point dg-c-accent" cx="400" cy="382" r="6"/>
  <text class="dg-small" x="416" y="382" dominant-baseline="central">GPT-6.2 Astra (this release)</text>
</svg>
```

## Comparison with Predecessor/Competitors

OpenAI's launch page shows nine head-to-head charts; GPT-6.2 Astra beats predecessor GPT-6 Astra on all nine, and GPT-6.2 Sol beats predecessor GPT-6.1 Sol on eight of nine, the one exception being a slight dip on the Vals Science Index (58.5% vs. 59.6%). Independent testing paints a more conservative picture: Artificial Analysis measured Astra's Coding Agent Index as flat on Codex, while Sol's dropped 3 index points — traced to a 14-point decline on the SWE-Atlas-QnA-AA sub-test, where Sol more often omits key facts when answering codebase questions, a regression the official launch page doesn't mention.

Against its closest rival, Claude Fable 5.2, the two flagships' API prices now overlap exactly at $8/$40 after this price cut — the first time the two companies' flagship models have landed on the same number, and it happens the same week Anthropic is preparing to list on Nasdaq. But on the neutral Artificial Analysis Intelligence Index, Fable 5.2 still leads at 65 points to Astra's 62; Astra ranks second globally, not first. The lead OpenAI claims on Harvey LAB-AA (legal work) and the margin on Agents' Last Exam both come only from OpenAI's own launch page — Fable's raw scores on those tests were never independently disclosed, and the two companies used different agent harnesses (mini-swe-agent vs. Claude Code), so how much of the gap is the model versus the test setup can't be fully separated.

What's actually worth remembering is the post-launch reception: despite sweeping gains on all nine official benchmarks, investor and former HyperWrite CEO Matt Shumer and developer-YouTuber Theo Browne publicly said Astra is "essentially unusable" and "the worst model OpenAI has ever released," pointing specifically at stability on long-horizon agentic delegation and creative work. Browne had Astra attempt a TypeScript-to-Rust compiler rewrite; it spent seven days without net progress, then another four days after being redirected. Wharton professor Ethan Mollick had a more mixed experience — Astra built a playable space-elevator simulation, but he described the model as "very uneven and weird" and still reaches for other models. Meanwhile others, like Raindrop.ai CTO Ben Hylak, praised Astra's agentic video-editing and motion-graphics work. The split in opinion tracks almost exactly along the line between single-task benchmark performance and long-horizon agentic work that needs a human watching it.

## Implications for Agent Development

The clearest signal from this release for agent builders: benchmark scores — even ones billed as "multistep professional work," like Agents' Last Exam and GDPval v2 — don't necessarily predict stability over long autonomous runs. Browne's case, seven days with no net progress followed by four more days stuck after a redirection, shows that most multistep benchmarks run for minutes to hours, not the multi-day autonomous loops where a model can actually lose the thread or go in circles.

- If you're building legal or compliance agents that can't tolerate error: Harvey LAB-AA's strict pass rate (full compliance, zero hallucination) only reaches 15.0% even on the newest, strongest model — keep a human review gate on any legal deliverable regardless of how the vendor frames the lead
- If you're building CAD/engineering agents, or anything relying on computer use and 3D visual reasoning: BenchCAD 2.1 Core's 19.9-point jump and Astra's lead in a blind AA-3D preference test (1,318 Elo vs. Fable 5.2's 1,271) point to a genuine, fairly specific differentiator worth testing against your own workflow
- Not a good fit: tasks that need a model to run autonomously for multiple days with minimal human steering (early testers repeatedly reported stalling and looping on long tasks); using Astra as a sub-agent orchestrated by another model — Shumer reported his supervising Claude model ended up redoing Astra's sub-agent output entirely, so re-validate on your own harness before swapping 6.2 Astra in for 6 Astra as a drop-in sub-agent rather than trusting the benchmark numbers alone

## Today's Takeaway

It's tempting to treat benchmark scores as a proxy for model capability, but here GPT-6.2 Astra swept all nine official benchmarks against its predecessor and posted OpenAI's own highest-ever score on the Artificial Analysis Intelligence Index — while several developers who've long tested OpenAI's flagships publicly called it the worst generation yet. That gap is a reminder that standardized benchmarks mostly measure peak performance on single tasks, while what actually determines whether an agent is usable is something no benchmark measures: how often you have to look over its shoulder during a long run. The two don't move together.

## References

- [OpenAI: Introducing GPT-6.2 Astra and Sol (official announcement)](https://openai.com/index/introducing-gpt-6-2-astra-sol)
- [OpenAI: GPT-6.2 Astra Model (API spec page)](https://developers.openai.com/api/docs/models/gpt-6.2-astra)
- [OpenAI: GPT-6.2 Astra & Sol System Card](https://deploymentsafety.openai.com/gpt-6-2-astra-sol)
- [VentureBeat: 'Essentially unusable': OpenAI launches GPT-6.2 Astra and Sol to negative reception from AI power users](https://venturebeat.com/technology/essentially-unusable-openai-launches-gpt-6-2-astra-and-sol-to-negative-reception-from-ai-power-users)
- [Anthropic: Claude Fable 5.2 and Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [quidproquo: GPT-6.2 Astra's 20% price cut lands it exactly on Claude Fable 5.2's number (2026-11-20)](/posts/daily/2026-11-20-pricing-openai-gpt-6-2-astra-sol-cut-en)
