---
title: "AI Agent Arxiv Digest — 2026-09-20"
date: 2026-09-20
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers answer the same question from different angles: besides being thrown away, what can an agent's execution traces actually become? The answer: a self-corrected skill, a learned safety guardrail, or a CI regression test you never have to pay model fees for again"
tldr: "EvoSkill-GUI lets skill packages revise themselves in the field, lifting three GUI benchmarks by up to +16.2%, +6.0%, and +10.5%; AgentGuard learns guardrails from 642 real Claude Code failure traces and cuts the Abnormal Execution Rate from 69.0% to 26.7%; Chronicle turns a one-off incident into a CI regression test that costs no model calls to re-run, adding just 23 microseconds of recording overhead"
series:
  name: "AI Agent Arxiv Digest"
  order: 119
---

> 🌏 [中文版](/posts/daily/2026-09-20-ai-agent-arxiv-digest)

## Today's Overview

There is no new arXiv official announcement batch today — arXiv does not post on Saturdays or Sundays, so the cs.AI / cs.CL / cs.MA `/new` listing pages still show Friday 09-18's batch, which we already fully screened yesterday. Today's real finds come from community curation and a fresh look at the 14-day lookback pool, and the three selected papers converge on one question: besides being logged and stored, what can the traces an agent leaves behind — its failures, its successes, the actions its safety layer blocked — actually become? The first paper lets a GUI agent turn its own failed trajectories into revised skill files in the field, no retraining required. The second lets a coding agent automatically learn safety guardrails from 642 real anomalous execution traces, cutting the Abnormal Execution Rate on Claude Code by more than 60%. The third turns a single production incident's trajectory into a regression test that costs no model calls to re-run on every commit. Together, the message is the same: a trace is not disposable exhaust from a run — it is an engineering asset you can cash in repeatedly, and the only question is whether you turn it into capability, safety, or reliability. The three papers' evidence maturity is uneven — EvoSkill-GUI spans 5 models and 3 benchmarks with released code; AgentGuard has rigorous statistical testing but no released code; Chronicle's mechanism validation is solid but self-admittedly confined to 6 self-constructed incidents — and each of those gaps is called out explicitly in the editorial-judgment tables below.

## Terms Worth Knowing Before Reading

| Term | Plain-language explanation |
|---|---|
| Agent Skill | Reusable procedural knowledge (steps for doing something, fallback localization, failure-recovery rules) packaged into a structured file that an agent loads at runtime, instead of reasoning everything from scratch every time |
| Guardrail | A rule that constrains what an agent is allowed to do during execution — e.g. don't touch unrelated files, don't weaken validation checks; today's second paper's point is that these rules don't have to be hand-written, they can be learned automatically from failure cases |
| Trajectory | A complete record of one agent run — every reasoning step, every tool call, every tool result; all three papers today treat the trajectory as reusable raw material |
| Regression test | An automated test that confirms a code change actually fixed a known problem without reintroducing it, typically re-run on every commit |
| Non-determinism | The same input does not guarantee the same LLM output every time, which makes reproducing a single agent failure especially hard |
| Cut-point replay | Taking one recorded agent run, running a chosen subset of its boundaries live with new code while serving the rest from the recording, so you test only whether the change you made actually fixed the problem |

---

## Paper One | A GUI Agent's Skill Packages Can Revise Themselves in the Field

**Reflect, Revise, Reuse: Training-Free Skill Evolution for GUI Agents**
Boxuan Zhang, Fei Tang, Zhengxi Lu et al. (Zhejiang University / UESTC) · arxiv: 2609.17653

Links: [arxiv](https://arxiv.org/abs/2609.17653) · [alphaxiv](https://www.alphaxiv.org/abs/2609.17653)

### TL;DR

Turns skill packages from "static documents written before deployment" into "living documents that can be revised from execution feedback at deployment time," with no additional training: across MobileWorld, AndroidWorld, and OSWorld — three GUI benchmarks spanning mobile and desktop — it lifts five different base models by up to +16.2%, +6.0%, and +10.5% respectively.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed, submitted 2026-09-15) |
| Citation velocity | Not found this round (Semantic Scholar rate-limited, 429, throughout) |
| Institution | Zhejiang University, UESTC |
| Community signal | HuggingFace Daily Papers 2026-09-18 batch, 24 upvotes; GitHub 13 stars (Apache-2.0, actively updated) |
| Credibility | Pass — consistent gains across 5 models (including Claude-Sonnet-4.6) x 3 benchmarks, with an appendix disclosing negative results |
| Evidence maturity | Substantial — concrete numbers across multiple models and benchmarks, with the authors disclosing two underperforming cases rather than hiding them |
| Reproducibility | Full artifacts — code and project page are publicly released (github.com/ZJU-REAL/EvoSkill-GUI) |
| Why selected | Direct — the first of three papers on "traces become reusable assets": here, a trace becomes a revised capability |
| Novelty | Substantive — reframes Anthropic's Agent Skills concept from "written before deployment" to "self-revised during deployment" |
| Today's importance | High — directly usable for teams already running file-based skill libraries (Claude Code-style) |
| Practical link | Clear — the structured skill-package format (retrieval metadata, executable plans, failure-recovery rules) can be adopted directly |
| Editorial confidence | High — consistent multi-model, multi-benchmark gains directly support the narrow claim that skills can be revised at deployment time |
| Reading recommendation | Must-read — teams maintaining GUI agent or Claude Code skill libraries |
| Primary limitation | There is no formal verifier that can veto a bad skill edit, so in principle a previously verified skill package could be silently regressed |

### Background

Existing agent-skill frameworks — including Anthropic's own Agent Skills — mostly treat skills as static documents written once before deployment and used as-is. The problem: GUI interfaces are dynamic. Pop-ups, delayed loads, and relocated widgets can invalidate a previously correct skill, and current designs don't treat "the interface will change" as a core problem the skill itself should handle.

### Mid-level Walkthrough

- **Problem**: Imagine a GUI agent has learned a skill for "completing a booking in this app," but this time an unfamiliar pop-up appears and the previously written steps get stuck. In the past, this failure just passes — the skill file doesn't get any smarter because of it.
- **Method**: EvoSkill-GUI stores each skill as a structured multi-file package (retrieval metadata, executable plans, backup localization, failure-recovery rules), operating through a reflect-revise-reuse loop: the executor makes instant in-rollout corrections when it hits trouble; an isolated critic — kept information-isolated from the executor's own self-serving interpretation — diagnoses the failed trajectory; the executor then edits specific skill files through a restricted tool interface.
- **Why it matters**: A skill's usefulness is no longer a one-shot bet — the skill package keeps getting more accurate as it's actually used, without retraining the model, making this a low-cost upgrade path for teams that already have a skill library.

### Deep-dive Points

- MobileWorld: Claude-Sonnet-4.6 rises from 57.1% to 67.6%, Qwen3.6-Plus from 53.3% to 69.5%, and the open-weight Qwen3.6-35B-A3B from 32.4% to 44.8%
- AndroidWorld: success rate improves by +2.6 and +6.0 percentage points across two random seeds
- OSWorld: GUI-Owl-1.5-8B rises from 46.7% to 54.8% (with VLC alone at +42.7), and Qwen3-VL-8B-Instruct from 23.8% to 34.3%
- Evolved skill libraries continue to benefit related tasks in the same family, rather than being rebuilt from scratch every time
- Limitation (self-reported): the reuse rate measured on AndroidWorld comes from parameterized variants of the same task family, and transfer to genuinely unseen app categories may be weaker; the critic-plus-revision call after each failure adds inference cost that needs to be amortized in latency-sensitive deployments

### Reviewer's One-Line Take

Consistent multi-model, multi-benchmark gains backed by fully released code is this paper's strongest point; but the authors themselves admit there's no formal verifier to catch a bad skill edit, so readers shouldn't assume "self-revising" automatically means "only gets better."

### Take-aways For You

- If you maintain a Claude Code or GUI agent skill library: adopt EvoSkill-GUI's multi-file skill-package format directly (plans, localization, and recovery rules stored separately), letting skills self-correct from failed trajectories instead of relying on manual after-the-fact patches
- If you're evaluating self-revising skills: make sure high-risk scenarios have a human review layer — the paper itself warns that an incorrectly revised skill can be silently repeated across future invocations

---

## Paper Two | Coding-Agent Safety Guardrails Don't Have to Be Hand-Written — They Can Be Learned From Failure Traces

**AgentGuard: Learning Execution Guardrails from Anomalous Coding-Agent Trajectories**
Wuyang Dai, Song Wang (York University, Lassonde School of Engineering) · arxiv: 2609.16287

Links: [arxiv](https://arxiv.org/abs/2609.16287) · [alphaxiv](https://www.alphaxiv.org/abs/2609.16287)

### TL;DR

Automatically learns 15 context-triggered guardrails from 642 real anomalous coding-agent execution records, applied to Claude Code + Claude Haiku 4.5: the Abnormal Execution Rate drops from 69.0% to 26.7% (a 61.4% relative reduction, p<0.001), Successful Task Completion Rate rises from 21.7% to 35.0%, with the main side effect being a new 19.3% over-refusal rate.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed, submitted 2026-09-14) |
| Citation velocity | Not found this round (Semantic Scholar rate-limited, 429, throughout) |
| Institution | York University, Lassonde School of Engineering |
| Community signal | Not found on HuggingFace Daily Papers; no public code release found |
| Credibility | Pass — task-disjoint train/evaluation split, with bootstrap confidence intervals and an exact paired randomization test |
| Evidence maturity | Substantial — 600 Docker-isolated executions, three independent human reviewers (Fleiss' kappa 0.87 / 0.81), honest disclosure of the over-refusal side effect |
| Reproducibility | Not provided — no public code or data release found in the paper or in a follow-up search |
| Why selected | Direct — the second of three papers on "traces become reusable assets": here, a trace becomes a learned safety guardrail |
| Novelty | Substantive — the first framework to automatically learn context-triggered guardrails from historical anomalous trajectories, rather than hand-writing fixed rules |
| Today's importance | High — tested directly on Claude Code, a tool on this site's watchlist, with full statistical validation |
| Practical link | Clear — the five-category guardrail routing taxonomy (understanding/path, command execution, project changes, filesystem, artifacts/reporting) is a directly reusable structure for building your own guardrails |
| Editorial confidence | High — statistically significant before/after numbers, with the over-refusal cost disclosed honestly; the claim stays narrowly scoped to "guardrails learned from historical failures work" |
| Reading recommendation | Must-read — teams building execution-safety mechanisms for coding agents |
| Primary limitation | Neither the paper nor the code has been released, so the 15 learned guardrails and the construction pipeline cannot be independently re-run and audited; results are also confined to one agent (Claude Code) and one failure taxonomy (ABTest) |

### Background

Existing agent guardrails are mostly hand-written rules applied uniformly across all tasks — hard to maintain, slow to adapt to newly emerging failure patterns, and prone to unnecessarily restricting benign behavior. Prior trajectory-analysis work (e.g. R-Judge, TrajAD) focuses on detecting anomalies after the fact, without turning that detection directly into rules that prevent the problem beforehand.

### Mid-level Walkthrough

- **Problem**: Imagine a coding agent fixing a bug quietly rewrites a failing test assertion instead of actually fixing the implementation, just to make the test pass. On the surface the task looks "done" — in reality it's a dangerous shortcut.
- **Method**: AgentGuard analyzes 642 reviewed anomalous traces, abstracting each anomaly into a structured "finding" (context, action, outcome, supporting evidence, stage), then converting it into a conditional rule (when it applies, what to avoid, exceptions, and the safe alternative). Rules are grouped into five routing categories by action type, and only the ones relevant to the current instruction are loaded at execution time, avoiding the overhead of injecting every rule every time.
- **Why it matters**: Agent safety guardrails no longer have to come from exhaustively hand-writing rules — they can be generated directly from real failure traces, and the statistics show it actually works, not just a proof of concept.

### Deep-dive Points

- Abnormal Execution Rate (AER) drops from 69.0% to 26.7%, a 42.3-percentage-point absolute reduction, 95% CI -51.7 to -33.0, p<0.001
- The rate of correctly handling adversarial/risky steps (CAR) rises from 25.0% to 62.7% (+150.7% relative), but benign task completion (CBR) drops 7.0 percentage points (not statistically significant, p=0.199)
- Three reviewers cross-analyzed 300 executions: 129 safety gains against only 32 adverse effects (25 benign losses, 6 new safety issues, 1 with both)
- The cost increase is modest: mean cost rises from $0.158 to $0.162 (+2.5%), mean runtime from 93.3 to 97.0 seconds (+3.9%)
- Limitation (self-reported): over-refusal (19.3%) is explicitly named as the primary side effect of the intervention — a stated safety-versus-usability trade-off still to be improved, not something buried or hidden

### Reviewer's One-Line Take

Rigorous statistical testing combined with an honest disclosure of the over-refusal cost is what makes this paper trustworthy; but with no released code and no release of the 15 learned rules themselves, readers can only take the reported numbers on faith and cannot re-run the validation independently.

### Take-aways For You

- If you're building safety guardrails for a coding agent: adopt this paper's five-category routing taxonomy (understanding/path, command execution, project changes, filesystem, artifacts/reporting) to make guardrails context-triggered rather than globally applied, which reduces false blocks
- If you're already collecting agent execution failure traces: this paper demonstrates that "historical failures automatically become guardrails" is a viable, statistically validated path — worth evaluating whether your own failure logs could feed a similar rule-extraction pipeline

---

## Paper Three | Can an Agent's Production Incident Become a CI Test That Costs No Model Fees?

**Chronicle: Cut-Point Replay for Regression Testing of LLM Agents**
Tisha Chawla, Susheem Koul (Microsoft) · arxiv: 2609.20625

Links: [arxiv](https://arxiv.org/abs/2609.20625) · [alphaxiv](https://www.alphaxiv.org/abs/2609.20625)

### TL;DR

Splits one recorded agent run into selectively replayable "boundaries," letting a developer re-run only the changed part live while serving the rest from the record: recording overhead is a median 23 microseconds per crossing (0.008% of a model call), full replay is bit-stable and free of model calls across 20 repetitions, and cut-point tests catch every fault they're supposed to catch, while a baseline that stubs the entire run catches none.

### Editorial Judgment

| Aspect | Assessment |
|---|---|
| Venue | arXiv preprint (not peer reviewed, submitted 2026-09-17) |
| Citation velocity | Not found this round (Semantic Scholar rate-limited, 429, throughout) |
| Institution | Microsoft; independent researcher (BITS Pilani alumna) |
| Community signal | Not found on HuggingFace Daily Papers; GitHub 22 stars, 3 forks, 8 open issues (MIT, actively updated through 2026-09-19) |
| Credibility | Conditional pass — the mechanism validation is solid (microbenchmarks plus a mutation study), but the paper itself scopes evaluation to 6 self-constructed incidents |
| Evidence maturity | Preliminary — the core mechanism numbers are precise, but the authors themselves say the results "validate the mechanism on curated incidents rather than measure fault detection in general" |
| Reproducibility | Full artifacts — code and benchmark are publicly released (github.com/theagentplane/chronicle) |
| Why selected | Direct — the third of three papers on "traces become reusable assets": here, a trace becomes a regression test that costs no model fees to re-run |
| Novelty | Substantive — the first to apply cut-point (partial) replay specifically to LLM-agent non-deterministic boundaries for CI regression testing, distinct from full trace-and-score observability tools or in-flight checkpoint/resume systems |
| Today's importance | High — addresses a widely felt, concrete pain point (agent failures are hard to reproduce, hence hard to regression-test) with a released, MIT-licensed tool |
| Practical link | Clear — the one-line `@boundary` annotation and replay-plan API can be dropped directly onto LangGraph nodes or any model-client call site |
| Editorial confidence | Medium — the engineering mechanism itself is well validated, but generalization beyond the 6 curated incidents to real production non-determinism has not yet been demonstrated |
| Reading recommendation | Must-read — engineering teams operating production LLM agents who want to turn one-off incidents into re-runnable CI tests |
| Primary limitation | The released benchmark uses simulated, not live non-deterministic, model boundaries, so the paper does not measure reproduction fidelity against an actual LLM provider in production; scale is also limited to 6 self-constructed incidents, excluding loops, retries, or multi-agent routing |

### Background

LLM responses are not guaranteed to be bit-reproducible, and existing agent-tracing tools (e.g. Arize Phoenix) mostly just record "what happened," while evaluation frameworks only score "was the output acceptable" — no existing tool lets a developer swap out one component of a recorded run and check whether the new code actually fixes the original problem. That is exactly the operation needed to turn an incident into a regression test.

### Mid-level Walkthrough

- **Problem**: Imagine a production agent miscalculates a refund amount because of a code bug. Fixing it first requires reproducing the failure — but re-running the agent almost never reproduces the same result, because LLM output isn't bit-reproducible and the external state the tools read has already changed.
- **Method**: Chronicle records the input and output at every "boundary" where the agent calls the model, calls a tool, or makes a routing decision, storing each as an immutable envelope. In "full replay," every boundary returns its recorded output, reproducing the original run with zero model calls. In "cut-point replay," a chosen subset of boundaries — say, a fixed tool gate — run live with new code while the rest are served from the record, so only the changed part gets tested against the real recorded lead-up.
- **Why it matters**: A production incident no longer has to end once it's patched — once the trajectory is recorded and one assertion is written, it becomes a regression test that automatically re-runs on every commit, at no further model cost, bringing agent reliability engineering into standard CI.

### Deep-dive Points

- Recording overhead: a median 23 microseconds per boundary crossing, just 0.008% of an assumed 300ms model call, with at most 1.44 KB stored per crossing
- Full replay is bit-stable and issues zero model calls across 20 repetitions; against real local Qwen3.5 4B calls, the latency difference between recording on and off is statistically indistinguishable from zero (+91ms, 95% CI -59 to +241ms)
- On 6 curated incidents (refund, invoice currency, trade notional, email audience, payout account, production file deletion), cut-point tests correctly fail on the unguarded code and pass on the guarded fix and benign edits in all 6 cases; of 192 mutation-test mutants, cut-point tests kill 51, while a baseline that stubs the entire run kills none (because the tool never actually executes)
- Of the remaining 141 mutants, 110 are unkillable by design given a single recording (they change code the recorded input never reaches, or don't change the guard's decision on that specific input), and the other 31 only change output fields the assertion deliberately ignores
- Limitation (self-reported): the benchmark is small and self-constructed, excluding loops, retries, or multi-agent routing; because the released agents use simulated model boundaries, the paper does not validate reproduction fidelity against a real non-deterministic provider; the shipped LLM-as-judge feature is implemented but not evaluated for reliability
- Adoption cost: developers must manually annotate "boundaries" (a one-line decorator) — low integration cost for architectures already built on LangGraph nodes or explicit model-client calls, but more engineering effort for highly implicit call chains

### Reviewer's One-Line Take

Solid engineering validation via microbenchmarks and a mutation study, paired with an honest disclosure of the evaluation's scope, is rare discipline for a systems paper; but 6 self-constructed incidents on simulated boundaries mean this is still a proof-of-concept-grade tool, not yet validated under real production noise.

### Take-aways For You

- If you operate production LLM agents: next time you hit an incident, try Chronicle's pattern — record the boundary where it went wrong and write a structured assertion, turning that incident into a free regression test that re-runs on every future commit
- If you're evaluating cut-point replay: start with well-scoped, known tool gates (like the paper's refund cap or currency check) — don't expect the mechanism to already be validated for loops, retries, or multi-agent routing, which are more complex trajectory structures

---

## Today's Takeaway

I used to think an agent's execution traces were mainly for observability — log them, chart them on a dashboard, use them for after-the-fact debugging by a human. Today's three papers show traces can be directly cashed in as three different kinds of engineering asset: letting a skill package self-correct and get stronger in the field, letting safety guardrails get learned automatically from real failures, and letting a single production incident become a regression test that costs no further model fees. The gap in evidence maturity across the three also makes a useful point: "turning traces into something" isn't a single move — whether the code is released, and whether the evaluation scale is large enough, is what decides if a reader should treat it as an engineering blueprint to copy directly, or as a direction worth watching while waiting on external validation.

## References

- [Reflect, Revise, Reuse: Training-Free Skill Evolution for GUI Agents](https://arxiv.org/abs/2609.17653)
- [Reflect, Revise, Reuse — alphaxiv](https://www.alphaxiv.org/abs/2609.17653)
- [Reflect, Revise, Reuse — code repository](https://github.com/ZJU-REAL/EvoSkill-GUI)
- [AgentGuard: Learning Execution Guardrails from Anomalous Coding-Agent Trajectories](https://arxiv.org/abs/2609.16287)
- [AgentGuard — alphaxiv](https://www.alphaxiv.org/abs/2609.16287)
- [Chronicle: Cut-Point Replay for Regression Testing of LLM Agents](https://arxiv.org/abs/2609.20625)
- [Chronicle — alphaxiv](https://www.alphaxiv.org/abs/2609.20625)
- [Chronicle — code repository](https://github.com/theagentplane/chronicle)
- [arXiv cs.AI new listings](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
