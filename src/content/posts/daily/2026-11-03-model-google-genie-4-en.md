---
title: "Model Card: Google DeepMind Genie 4"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, model-release, daily, google, model-family-genie]
lang: en
description: "Google DeepMind released Genie 4, the first world model to natively generate audio and interactive dialogue; Gemini 3.8 Flash acts as an in-the-loop director breaking multi-step scenes into verifiable steps. Trusted-tester-only, with no public pricing or API."
tldr: "Genie 4 launched 2026-10-27 as a real-time interactive world model (not a text LLM). It is the first in the Genie line to natively generate ambient sound, music, and interactive dialogue, and the biggest leap is how characters move and react. Gemini 3.8 Flash runs in the generation loop as a director, breaking goals into steps and checking progress frame by frame. Access is trusted-tester-only for now, with Project Genie and Gemini API early access still coming soon; there is no public pricing, no API model ID, and no official benchmark scores. Object permanence and legible text remain known weak points."
series:
  name: "AI Model Tracker"
  order: 67
glossary:
  - term: "Genie"
    def: "Google DeepMind's world-model family, generating real-time interactive, camera-steerable environments from text or images to serve as safe training grounds for robots and AI agents"
  - term: "world model"
    def: "An AI system that generates an environment the user can actually act inside, frame by frame, rather than playing back a fixed video — keyboard input and text prompts change what happens next"
---

> 🌏 [中文版](/posts/daily/2026-11-03-model-google-genie-4)

## Model Info

| Item | Value |
|---|---|
| Model ID | Not disclosed (no public API identifier) |
| Vendor | Google DeepMind |
| Parameters | Not disclosed |
| Context Window | Not applicable (a real-time interactive world model, not a text-generation model; the underlying architecture is undisclosed) |
| Input Price (USD/1M tokens) | Not disclosed (no API, no published pricing) |
| Output Price (USD/1M tokens) | Not disclosed (no API, no published pricing) |
| Open source | No (research preview, no open weights) |
| Release date | 2026-10-27 |
| Official announcement | [Google DeepMind Blog](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/), [Google Blog](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-genie-4/) |
| Family | Genie (Genie 1 → 2 → 3 → 4) |

## Key Capabilities

- First in the Genie line to natively generate audio: ambient sound, music, and interactive dialogue are produced in sync with the visuals, with no separate audio model
- People are the biggest leap this generation: characters move naturally, react to their surroundings, and can be steered interactively while a scene is running
- Gemini 3.8 Flash runs in the loop as a "director": it breaks a user's goal into multiple steps, keeps reviewing incoming frames to confirm each step succeeded, and replans the moment the scene shifts or the user intervenes
- Integrated with Gemini 4 Argon and Gemini Robotics for robot scenario generation — the published demo is Apptronik's Apollo humanoid playing a game of checkers

The "director" role Gemini 3.8 Flash plays inside the generation loop is, concretely, a cycle of decomposing steps, checking frames, and replanning when needed:

```diagram
title: Gemini-in-the-loop: the step-decomposition and verification cycle behind a world model
desc: Gemini 3.8 Flash breaks a user's goal into steps and drives Genie 4's rendering; it checks each step against the frames it sees, replans and re-renders when a step fails or the scene changes, and only calls the task done once every step has succeeded.
caption: Simplified from Google DeepMind's and DataCamp's description of Genie 4's "multi-step events planned by Gemini" mechanism; the actual loop internals are undisclosed.
step: Gemini 3.8 Flash breaks down the steps and drives Genie 4 to render frames and audio
step: Gemini keeps watching the frames to check whether this step succeeded
step: If it didn't succeed, or the scene changed, or the user stepped in — replan and go back to Genie 4 to re-render
step: If it succeeded, check whether there is a next step
step: If there is, go back to decomposing; only once every step succeeds is the task done
---
<svg viewBox="0 0 640 460">
  <path class="dg-line" d="M288 34V60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M288 116V148" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M288 204V236" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--warn" d="M384 280H440" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M524 252V184Q524 176 516 176H392" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M288 324V368" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--dashed" d="M192 412H72Q64 412 64 404V96Q64 88 72 88H184" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--accent" d="M384 412H440" marker-end="url(#arrow-accent)" data-step="5"/>

  <circle class="dg-dot" cx="288" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="184" y="60" width="208" height="56" rx="6"/>
    <text class="dg-label" x="288" y="78" text-anchor="middle" dominant-baseline="central">Gemini 3.8 Flash</text>
    <text class="dg-sub" x="288" y="100" text-anchor="middle" dominant-baseline="central">decomposes the plan</text>
  </g>

  <g data-step="1">
    <rect class="dg-box" x="184" y="148" width="208" height="56" rx="6"/>
    <text class="dg-label" x="288" y="166" text-anchor="middle" dominant-baseline="central">Genie 4 renders</text>
    <text class="dg-sub" x="288" y="188" text-anchor="middle" dominant-baseline="central">video + audio, live</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M288 236L384 280L288 324L192 280Z"/>
    <text class="dg-label" x="288" y="270" text-anchor="middle" dominant-baseline="central">Step succeeded?</text>
    <text class="dg-sub" x="288" y="292" text-anchor="middle" dominant-baseline="central">frame-checked</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="440" y="252" width="168" height="56" rx="6"/>
    <text class="dg-label" x="524" y="270" text-anchor="middle" dominant-baseline="central">Replan</text>
    <text class="dg-sub" x="524" y="292" text-anchor="middle" dominant-baseline="central">scene/user change</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M288 368L384 412L288 456L192 412Z"/>
    <text class="dg-label" x="288" y="402" text-anchor="middle" dominant-baseline="central">Next step left?</text>
    <text class="dg-sub" x="288" y="424" text-anchor="middle" dominant-baseline="central">multi-step task</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="440" y="384" width="168" height="56" rx="6"/>
    <text class="dg-label" x="524" y="402" text-anchor="middle" dominant-baseline="central">Task done</text>
    <text class="dg-sub" x="524" y="424" text-anchor="middle" dominant-baseline="central">next prompt</text>
  </g>

  <text class="dg-edge dg-text--warn" x="412" y="268" text-anchor="middle" dominant-baseline="central" data-step="3">no</text>
  <text class="dg-edge dg-text--warn" x="534" y="216" text-anchor="start" dominant-baseline="central" data-step="3">re-render</text>
  <text class="dg-edge" x="300" y="346" text-anchor="start" dominant-baseline="central" data-step="4">yes</text>
  <text class="dg-edge" x="128" y="80" text-anchor="middle" dominant-baseline="central" data-step="5">step left</text>
  <text class="dg-edge dg-text--accent" x="412" y="400" text-anchor="middle" dominant-baseline="central" data-step="5">none (done)</text>
</svg>
```

## Benchmarks

⚠️ The official announcement includes no benchmark scores or quantitative comparison against other world models, and as of 2026-10-28 no independent third-party evaluation or score reproduction had surfaced either (source: DataCamp's writeup on Genie 4). The table below lists verifiable capability and limitation differences instead — it is not a quantitative benchmark:

| Dimension | Genie 3 (released 2025-08) | Genie 4 (released 2026-10-27) |
|---|---|---|
| Audio | No native audio | First to natively generate ambient sound, music, and interactive dialogue |
| Visual specs | 24 fps, 720p, coherent for a few minutes | No published fps/resolution figures |
| Multi-step reasoning | No built-in reasoning loop | Gemini 3.8 Flash runs in the loop, decomposing and verifying steps |
| Access | Limited preview for academics and creators | Trusted testers first; Project Genie and Gemini API partners "coming soon" |
| Known weaknesses | Limited action space, multi-agent interaction, real-world location accuracy, text legibility, interaction capped at a few minutes | Object permanence and visual detail still drift over long sessions; complex physical interactions, real-time audio accuracy, legible text, spatial accuracy |

## Versus the Predecessor / Competitors

The qualitative shift from Genie 3 is that people now move and talk. Genie 3's demos were mostly about environments and ecosystems — water, lighting, plants and animals — with character interaction never the focus. DeepMind explicitly calls people "the most dramatic leap" in Genie 4: characters react naturally and can be steered into live dialogue, something none of the earlier generations did. The other difference is the reasoning layer: Genie 4 wires Gemini 3.8 Flash into the generation loop, so for the first time a world model has a "director" checking whether the task is actually progressing through its steps, instead of relying on pixel generation alone to stay coherent.

No other lab has shipped a comparable real-time, natively-audio interactive world model to compare it against directly, and both the official announcement and third-party coverage (DataCamp, dev.to) are explicit that Genie 4 has no public benchmarks, pricing, or API model ID; as of 2026-10-28 it is also absent from both OpenRouter and models.dev. In other words, Genie 4 is still a research preview, not a product that can be directly scored against alternatives — any claim about how much stronger it is than its predecessor can only be judged from the official demos, and DeepMind itself cautions that those demos are curated takes and should be read as a ceiling, not an average.

## What It Means for Agent Development

Genie 4 pushes "world model" a step further, from pure scene generation toward a "training environment with a built-in reasoning loop." Having Gemini 3.8 Flash decompose tasks and verify progress inside the loop effectively moves the plan-and-verify pattern agent builders already use into the world model itself, without needing a separate orchestrator to check simulation progress.

- If you're training robots or embodied agents: the Genie 4 + Gemini Robotics combination is worth watching — it demonstrates decomposing a humanoid robot task (like playing chess) into multi-step scenes to rehearse in an imagined environment before touching real hardware. DeepMind hasn't quantified how well behavior learned in a Genie 4 scene transfers to physical robots, though, so this isn't yet something to base a decision on
- If you're building agent evaluation or sandbox environments: the Genie line has long been positioned as a safe practice ground for agents (Genie 3 was tested with the SIMA agent). If Genie 4's multi-step consistency holds up, it could eventually replace some hand-built simulation environments — but for now only trusted testers have access, and everyone else is stuck on the Project Genie / Gemini API waitlist
- Not a fit for: anything that needs to run stably for a long time (object permanence drifts over time), applications that need precise real-world locations, or scenes that need legible text — DeepMind is explicit these are open research problems, not nearly-fixed bugs

## Today's Takeaway

I used to assume "world models" and "conversational models" were two parallel technical tracks, each filling in the other's gaps. Wiring Gemini 3.8 Flash directly into the generation loop as a "director" shows those two tracks are starting to converge: the world model handles real-time video and audio generation, while the language model plans the narrative and verifies progress behind the scenes. That division of labor arrived earlier than I expected, and it matches DeepMind's own stated direction toward "hybrid world models."

## References

- [Genie 4: A new generation of world simulation (Google DeepMind official announcement)](https://deepmind.google/blog/genie-4-a-new-generation-of-world-simulation/)
- [We're announcing Genie 4 (Google Blog official announcement)](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-genie-4/)
- [Genie 3: A new frontier for world models (predecessor's official announcement, source for spec/limitation comparison)](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models)
- [Genie 4 World Model: Features, Capabilities, and How to Get Access (DataCamp, independent confirmation of no benchmarks/pricing/API ID)](https://www.datacamp.com/blog/genie-4)
- [Genie 4 vs Genie 3: What Changed in Google's Interactive World Models? (dev.to, third-party capability-gap analysis)](https://dev.to/jamilxt/genie-4-vs-genie-3-what-changed-in-googles-interactive-world-models-53m5)
