---
title: "Model Card: GPT-6 Cyber"
date: 2026-11-06
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI shipped GPT-6 Cyber, a vulnerability-research model that just got reclassified as Critical risk under the Preparedness Framework. ExploitGym scores jumped 51% over the prior model, but access is gated to vetted Daybreak Red customers only."
tldr: "GPT-6 Cyber (API ID: gpt-6-cyber) launched 2026-11-05. OpenAI moved its cybersecurity risk tier from High to Critical under the Preparedness Framework. ExploitGym rose from 32.1% (GPT-5.6 Cyber) to 48.5%. In honeypot testing, it stayed off out-of-scope decoy services 99.93% of the time with no safety prompt, and 100% with one. It has already helped produce 948 working Linux kernel exploits and surface 81 previously-unknown high-severity Firefox bugs. Pricing is $20 input / $100 output per 1M tokens (up 60%/33% from the prior model), and it's available only to vetted Daybreak Red customers."
series:
  name: "AI Model Tracker"
  order: 68
glossary:
  - term: "GPT-Cyber"
    def: "OpenAI's restricted-access cybersecurity model line for vulnerability research, exploit development, and patch verification, running from GPT-5.5-Cyber through GPT-6 Cyber"
  - term: "Daybreak Red"
    def: "OpenAI's gated access tier for authorized penetration testing and exploit development; calling GPT-6 Cyber requires org-level Daybreak Red approval plus a separate model-specific sign-off"
---

> 🌏 [中文版](/posts/daily/2026-11-06-model-openai-gpt-6-cyber)

## Model Info

| Item | Value |
|---|---|
| Model ID | `gpt-6-cyber` |
| Vendor | OpenAI |
| Parameters | Not disclosed (built on GPT-6 Astra weights, with additional security-focused RL post-training) |
| Context Window | 1,050,000 tokens (1.05M), up to 128,000 output tokens |
| Input Price (USD/1M tokens) | $20.00 (cached input $2.00; cache write $25.00 for 30-min retention or $50.00 for 12-hour) |
| Output Price (USD/1M tokens) | $100.00 |
| Open source | No (API and Codex access, restricted to vetted Daybreak Red customers) |
| Release date | 2026-11-05 |
| Official announcement | [OpenAI Blog: Introducing GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/), [System Card](https://deploymentsafety.openai.com/gpt-6-cyber) |
| Family | GPT-Cyber (GPT-5.5-Cyber → GPT-5.6-Cyber → GPT-6 Cyber, OpenAI's Daybreak Red-only security model line) |

## Key Capabilities

- ExploitGym, which tests whether a model can build a working exploit for a specified vulnerability, jumped from 32.1% (GPT-5.6 Cyber) to 48.5% — a 51% relative gain, and ahead of the general-purpose flagship GPT-6 Astra's 42.4%
- OpenAI moved its Preparedness Framework cybersecurity risk rating from High to Critical — the only model currently rated Critical that's still offered externally, even under tight gating
- In a honeypot test that deliberately plants an out-of-scope decoy next to the authorized target, it avoided touching the decoy 99.93% of the time with no safety prompt (up from 94.49% for the prior model), and 100% of the time with one
- Already battle-tested on real systems: of 1,724 known Linux kernel vulnerabilities it reproduced, it produced 948 working exploits (versus 166 for GPT-5.6 Sol on the same research harness), and it surfaced 81 previously-unknown high-severity Firefox bugs that Mozilla has started patching

The ExploitGym Honeypot test hinges on one branching decision: when the model encounters a decoy service planted next to its authorized target, does it recognize that the decoy is out of scope and leave it alone?

```diagram
title: ExploitGym Honeypot: how the model decides not to hit the decoy
desc: Facing a decoy service planted next to the authorized target, GPT-6 Cyber first checks whether what it's looking at is actually in scope. If not, it leaves it alone and flags the boundary violation; if it is, it proceeds to develop and verify the exploit. Either branch ends in a reported result.
caption: Simplified from OpenAI's system-card description of the ExploitGym Honeypot evaluation; 99.93%/100% are the in-scope success rates without and with a safety prompt.
step: The task environment contains both the authorized target and a decoy service
step: The model checks whether the service in front of it is actually within the task's authorized scope
step: If it's the decoy, not the authorized target, it leaves it alone and flags the boundary violation — no exploit development
step: If it's the authorized target, it proceeds to develop and verify the exploit
step: Either branch ends in a reported result; the in-scope rate is 99.93% with no safety prompt and 100% with one
---
<svg viewBox="0 0 640 488">
  <path class="dg-line" d="M320 34V60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 116V160" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--warn" d="M416 204H472" marker-end="url(#arrow-warn)" data-step="3"/>
  <path class="dg-line" d="M320 248V296" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--warn" d="M544 232V432Q544 440 536 440H460" marker-end="url(#arrow-warn)" data-step="5"/>
  <path class="dg-line dg-line--accent" d="M320 352V408" marker-end="url(#arrow-accent)" data-step="5"/>

  <circle class="dg-dot" cx="320" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="200" y="60" width="240" height="56" rx="6"/>
    <text class="dg-label" x="320" y="80" text-anchor="middle" dominant-baseline="central">Pen-test task assigned</text>
    <text class="dg-sub" x="320" y="102" text-anchor="middle" dominant-baseline="central">target + decoy both present</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M320 160L416 204L320 248L224 204Z"/>
    <text class="dg-label" x="320" y="194" text-anchor="middle" dominant-baseline="central">In scope?</text>
    <text class="dg-sub" x="320" y="216" text-anchor="middle" dominant-baseline="central">task boundary</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="472" y="176" width="144" height="56" rx="6"/>
    <text class="dg-label" x="544" y="196" text-anchor="middle" dominant-baseline="central">Flag as decoy</text>
    <text class="dg-sub" x="544" y="218" text-anchor="middle" dominant-baseline="central">no exploit, flag it</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="224" y="296" width="192" height="56" rx="6"/>
    <text class="dg-label" x="320" y="316" text-anchor="middle" dominant-baseline="central">Develop + verify exploit</text>
    <text class="dg-sub" x="320" y="338" text-anchor="middle" dominant-baseline="central">confirm target is breached</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="180" y="408" width="280" height="64" rx="6"/>
    <text class="dg-label" x="320" y="428" text-anchor="middle" dominant-baseline="central">Report task result</text>
    <text class="dg-sub" x="320" y="452" text-anchor="middle" dominant-baseline="central">in-scope rate: 99.93% / 100%</text>
  </g>

  <text class="dg-edge dg-text--warn" x="444" y="192" text-anchor="middle" dominant-baseline="central" data-step="3">no</text>
  <text class="dg-edge" x="332" y="272" text-anchor="start" dominant-baseline="central" data-step="4">yes</text>
</svg>
```

## Benchmarks

| Benchmark | Score | Prior model | Best competitor |
|---|---|---|---|
| ExploitGym (exploit development) | 48.5% | GPT-5.6 Cyber 32.1% | GPT-6 Astra 42.4% |
| Black-box web pentest (vuln recall) | 40.3% | — | GPT-6 Astra 32.0% |
| RemoteExploitBench (tasks completed) | 95% | — | GPT-6 Astra (Daybreak Blue) 0% (refused everything) |
| ExploitGym Honeypot (in-scope rate, no prompt) | 99.93% | GPT-5.6 Cyber 94.49% | — |
| Irregular FrontierCyber (external eval) | 90/288 | — | GPT-6 Astra 96/288 |

⚠️ The first four are OpenAI's own self-reported numbers (published in the system card). FrontierCyber is an independent evaluation by third-party firm Irregular, which OpenAI cited as-is in the official announcement even though GPT-6 Cyber actually trails Astra here — neither model cracked the 15 hardest challenges. The Firefox (81 high-severity bugs) and Linux kernel (948 working exploits) real-world findings have been confirmed and fed into fix pipelines by Mozilla and the Linux community respectively; they're not self-reported scores.

## Versus the Predecessor / Competitors

Against its direct predecessor GPT-5.6 Cyber, GPT-6 Cyber advances on both capability and alignment at once: ExploitGym is up 51% relative, and the honeypot in-scope rate climbed from 94.49% to 99.93%. That comes at a price — input is up 60% ($12.50 → $20.00), output up 33% ($75.00 → $100.00), cache-related rates up the same 60%, and the context window jumped from 400K tokens to 1.05M.

Against the general-purpose flagship GPT-6 Astra, the Cyber variant leads on most offense-and-defense tasks (ExploitGym 48.5% vs. 42.4%, web-pentest recall 40.3% vs. 32.0%, RemoteExploitBench 95% vs. 0% — Astra under Daybreak Blue refuses the whole suite outright). But it actually trails on the third-party FrontierCyber eval, 90/288 vs. 96/288, which means this isn't a clean sweep: a meaningful chunk of Cyber's higher scores comes from a lower refusal rate and higher compliance, not purely from a jump in underlying capability. On price, Cyber costs exactly double Astra's Standard rate — the same as Astra's "Fast" mode.

Compared with Google's Gemini 4 Carbon, which also targets cyber defense, the two occupy different niches: Carbon is a general long-horizon reasoning model with a security focus, rolled out in phases to defenders, at an introductory $2 input / $10 output (rising to $4/$20 later) — much cheaper than Cyber. GPT-6 Cyber is a narrow exploit-development specialist sold only to vetted Daybreak Red organizations for authorized offensive testing. They aren't direct substitutes for each other.

## What It Means for Agent Development

If you're building authorized pentesting or red-team agents: the headline here isn't "smarter," it's "more disciplined." The honeypot result — 99.93% in-scope with zero safety prompting — means you can grant an agent more autonomy to run long penetration-testing loops without a human checking scope at every step. That said, OpenAI itself flags evaluation awareness (the model recognizing it's being tested and behaving differently) as an unresolved concern, so sandboxing, action review, and human oversight for high-risk workflows remain mandatory in production, not optional extras.

If you're building patch-verification or vulnerability-remediation pipelines: the 1.05M context window means an entire codebase's crash logs, binaries, and symbols can fit in a single prompt instead of being split across requests with RAG in between. But the price hike is concentrated in cache reads and writes (both up 60%), so a long agent session that leans heavily on cached context will see a bigger bill increase than the headline input/output numbers suggest — worth re-running the ROI math before shipping.

Not a fit for: routine code review or entry-level security scanning — GPT-6 Astra Standard is half the price for most of those tasks, and batch pricing cuts it further. Cyber's premium only pays off where low refusal rates matter: exploit development and penetration testing specifically. It's also not accessible to individual developers or unvetted organizations — access requires Daybreak Red plus an extra model-specific approval, mandatory SSO, MFA, and IP allowlisting, not just an ordinary API key.

## Today's Takeaway

I used to assume cybersecurity capability and alignment training were at odds in high-risk models — the better a model gets at attacking, the harder it is to keep it from attacking the wrong thing. GPT-6 Cyber trains both at once: exploit capability is up 51% while the honeypot in-scope rate climbed from 94.49% to 99.93% in the same release. That means "more capable at attacking" and "more disciplined about scope" aren't zero-sum in the training recipe — OpenAI's choice instead is to lock the model inside Daybreak Red and let access control, not reduced capability, do the risk management.

## References

- [GPT-6 Cyber: Advancing the frontier of aligned cybersecurity agents (OpenAI official announcement)](https://openai.com/index/introducing-gpt-6-cyber/)
- [GPT-6 Cyber System Card (OpenAI official)](https://deploymentsafety.openai.com/gpt-6-cyber)
- [OpenAI Launches GPT-6 Cyber After AI Helps Find 81 Firefox Flaws, 948 Linux Exploits (The Hacker News)](https://thehackernews.com/2026/11/openai-launches-gpt-6-cyber-after-ai.html)
- [OpenAI Unveils GPT-6 Cyber, a Security Model It Rates Too Dangerous for Open Release (BigGo Finance, full benchmark table)](https://finance.biggo.com/news/e26dae71-4427-4f7a-a9a6-025272d26b3f)
- [GPT-6 Cyber API pricing: $20 input, $100 output for Daybreak Red (Data Studios, pricing and system-card benchmark detail)](https://www.datastudios.org/post/openai-gpt-6-cyber-daybreak-red-api-pricing-20-input-100-output)
- [OpenAI debuts GPT-6 Cyber, touting better performance — and safety guardrails (CyberScoop)](https://cyberscoop.com/openai-gpt-6-cyber-security-model/)
