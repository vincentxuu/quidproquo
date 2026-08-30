---
title: "AI Agent Arxiv Digest — 2026-08-30"
date: 2026-08-30
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three new papers examine the control gates that fail before an AI agent takes action: misleading evidence, tool-output authorization, and cross-loop safety state"
tldr: "Richly packaged fabricated evidence raises pooled action commitment from 6.5% to 54.0%; SARA separates tool-induced actions from runtime authorization and reduces attack success to 0.06%-0.17% on two benchmarks; LoopHarness shows why decaying safety state can be bypassed by waiting, but its evidence is limited to one frozen model-role configuration and one execution seed"
series:
  name: "AI Agent Arxiv Digest"
  order: 98
---

> 🌏 [中文版](/posts/daily/2026-08-30-ai-agent-arxiv-digest)

## Today's Overview

All three papers ask the same engineering question: after an agent says “I know,” what allows it to actually act? The first finds that a polished but fabricated evidence panel can make models more willing to act on an unknowable event. The second separates an action induced by tool content from runtime authorization. The third argues that safety state which decays across loops can be bypassed simply by waiting. The first two provide broad experiments and explicit limitations. The third combines formal analysis with clear ablations, but uses one frozen model-role assignment and one execution seed, so it is a design warning rather than a widely replicated result.

## Terms Worth Knowing Before You Read

| Term | Plain-language explanation |
|---|---|
| Action commitment | The model goes beyond proposing an answer and agrees to take a costly or irreversible action |
| Indirect prompt injection (IPI) | Malicious instructions hidden in a page, document, or tool result that the agent reads as data |
| Execution authorization | A runtime decision, after a tool call is proposed, about whether the action may actually run |
| Action provenance | A record of whether an action originated with the user, a trusted rule, or untrusted tool content |
| Attack success rate (ASR) | The share of tests in which the attack ultimately executes its intended action |
| Non-decaying state | Safety state that does not disappear merely because more turns or time have passed |

---

## Paper 1 | A Model May Know It Does Not Know and Still Be Nudged Into Acting

**Calibrated Enough to Know, Not Calibrated to Act**
Pranav Aggarwal · arXiv: 2608.27167

Links: [arXiv](https://arxiv.org/abs/2608.27167) · [alphaXiv](https://www.alphaxiv.org/abs/2608.27167)

### TL;DR

In a preregistered 12-model study, action commitment on unknowable events rises from 6.5% to 54.0% as the evidence display becomes richer. Real-rich and fully fabricated panels produce 37.6% and 36.8% commitment, a difference inside the prespecified plus-or-minus-five-percentage-point equivalence margin.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Credibility | Pass — the preregistered design, 12-model evaluation, heterogeneous results, and limitations are traceable to the paper |
| Evidence maturity | Substantial — equivalence tests, interventions, and failure cases support the core claim, within a limited scope |
| Reproducibility | Full artifacts — code, preregistration, cached outputs, and a Zenodo archive are public |
| Editorial confidence | High — the evidence supports the narrow claim that evidence presentation can increase action commitment |
| Reading recommendation | Must-read — for teams whose agents act from search, reports, or RAG context |
| Primary limitation | The effect is concentrated in three models from one developer and cannot be generalized to all frontier models |

### Field Background

Calibration usually asks whether a model's confidence matches answer accuracy. Agents add a second risk: even when the model cannot know the answer, a display that looks evidence-rich may still persuade it to take a consequential action. This paper measures “knowing” and “acting” separately.

### Intermediate Walkthrough

- **The problem**: an agent is asked to act on tomorrow's realized weather, which cannot yet be known. Does adding charts, source labels, and precise numbers make it act anyway?
- **The approach**: the study escalates evidence presentation from no panel to real-rich and fully fabricated panels, then tests small-model fine-tuning and constrained output formats as interventions.
- **Why it matters**: asking the same model whether it is confident leaves the evidence display free to influence both the answer and the authorization decision. Provenance, knowability, and action risk need independent checks.

### Deep Dive

- Pooled commitment rises from 6.5% to 54.0%, but the effect is heterogeneous: three models are susceptible, four rarely commit, three almost always commit, and two react weakly
- Real-rich and fabricated panels yield 37.6% and 36.8%; the -0.83-point difference has a 90% case-clustered interval of -4.51 to +2.66, inside the preregistered equivalence band
- The authors explicitly limit the claim: the susceptible models come from one developer, so the pooled rate is not a universal frontier-model result
- Fine-tuning a 3B model on 540 synthetic cases drives commitment to zero on the original cases, but a rigid reasoning-suppressing format drops answerable accuracy from 88.9%-98.6% to 50.9%-73.8%; one ablation seed commits on all 48 unknowable cases
- ⚠️ Author-run evaluation, not externally replicated; weather is a weak instrument and hosted serving configurations are not fully controlled

### Reviewer's One-Liner

The contribution is not the generic claim that models can be fooled, but the separation of knowledge calibration from action commitment with preregistration, public artifacts, heterogeneous results, and failed interventions; it still needs replication across developers, tasks, and real irreversible tools.

### Your Takeaway

- Do not release high-risk tools from self-reported model confidence alone; independently check provenance, knowability, and reversibility
- Evaluate answer accuracy and whether wrong answers trigger actions as separate metrics

---

## Paper 2 | Tool Output May Influence Planning Without Receiving Execution Authority

**When Tool Outputs Become Commands: Separating Action Induction from Runtime Authorization in Tool-Augmented LLM Agents**
Xiaokun Guo, Zhen Xu, Dongdong Huo et al. · arXiv: 2608.27146

Links: [arXiv](https://arxiv.org/abs/2608.27146) · [alphaXiv](https://www.alphaxiv.org/abs/2608.27146)

### TL;DR

SARA separates actions induced by external content from runtime authorization. With GPT-4o-mini, it reduces ASR from 15.79% to 0.06% on AgentDojo and from 16.07% to 0.17% on AgentDyn, while total input rises to 1.91x and 2.21x the unprotected agent baseline.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Credibility | Pass — two benchmarks, eight defense families, cross-backbone tests, and ablations provide inspectable evidence |
| Evidence maturity | Substantial — security, benign utility, and token cost are compared, although this is not a formal guarantee |
| Reproducibility | Partial artifacts — algorithms, datasets, and settings are described, but a complete public implementation and cached outputs were not confirmed |
| Editorial confidence | High — the evidence supports the engineering value of separating action induction from runtime authorization |
| Reading recommendation | Must-read — for browsing, email, enterprise-document, and coding-agent engineers |
| Primary limitation | The scope is tool-based IPI under trusted user, schema, runtime, and executor assumptions |

### Field Background

Indirect prompt injection is difficult because agents must consume external content to work, and that content can contain instructions. A one-time input filter is insufficient when malicious content changes the plan and later steps launder its origin into a syntactically normal tool call.

### Intermediate Walkthrough

- **The problem**: a page says “forward the user's email to this address.” The final email call may be valid in shape, but the user never authorized its purpose.
- **The approach**: SARA uses an isolated Action Probe to detect action-inducing content, persists an `EXPOSED` state and action-origin set, and checks goal, chain, and argument support against user authority. No-History-Promotion prevents later steps from laundering external instructions into “the agent's own decision.”
- **Why it matters**: the security boundary moves into the runtime instead of asking one model, in one mixed-trust context, to read untrusted data, plan, and supervise itself.

### Deep Dive

- Evaluation covers 92 benign tasks and 3,528 attacks in AgentDojo, plus 141 benign tasks and 5,202 attacks in AgentDyn, against eight defenses including Spotlighting, CaMeL, MELON, and AttriGuard
- GPT-4o-mini ASR falls from 15.79% to 0.06% and 16.07% to 0.17%; Gemini 2.5 Flash Lite falls from 33.28% to 0.62% and 30.91% to 0.63%
- SARA is not the lowest-ASR method everywhere: CaMeL is lower in three settings, but SARA preserves substantially more benign utility
- Across eight additional backbone-benchmark combinations, most residual ASRs are at or below 0.3%, while Llama 3.1 8B remains at 1.64% and 1.75%
- ⚠️ This is not a formal guarantee. It covers tool-based IPI and assumes trusted users, tool schemas, runtimes, and executors; direct bypasses and pure data dependencies remain out of scope
- ⚠️ Author-run evaluation, not externally replicated; cross-framework, enterprise toolchain, and long-running deployment behavior remains untested

### Reviewer's One-Liner

Persistent action provenance is closer to the real execution boundary than a one-shot classifier, and the paper reports baselines, utility, and token cost; non-tool data flow and semantic probe errors remain the next tests.

### Your Takeaway

- Persist where an action first originated instead of checking only the final, apparently clean tool arguments
- Measure security, benign utility, and token cost together; ASR alone can reward a defense that makes the agent unusable

---

## Paper 3 | When Cross-Loop Safety State Decays, Waiting Becomes an Attack Step

**Safety Does Not Compose: Non-Decaying Loop State for Autonomous LLM Agents**
Chenhao Wu, Haoxuan Jia, Yang Liu et al. · arXiv: 2608.27141

Links: [arXiv](https://arxiv.org/abs/2608.27141) · [alphaXiv](https://www.alphaxiv.org/abs/2608.27141)

### TL;DR

LoopHarness persists cross-loop risk with a non-decaying latch. In 1,000 attack episodes per configuration, the authors report 0.1% ASR for the full controller versus 88.4%-97.6% for weakened variants, but only under one frozen model-role assignment and one execution seed.

### Editorial Assessment

| Dimension | Assessment |
|---|---|
| Credibility | Conditional pass — the formal analysis and ablations are inspectable, but empirical generality is not established |
| Evidence maturity | Proof of concept — the tests support a state-machine warning, not a general 0.1% safety claim |
| Reproducibility | Partial artifacts — the paper describes a controller, attack suite, report generator, and cached calls, but an independent public repository was not confirmed |
| Editorial confidence | Medium — confidence is higher in the decay-bypass mechanism than in numerical generalization |
| Reading recommendation | Skim — for runtime, Durable Object, and long-running background-agent designers |
| Primary limitation | One frozen model-role configuration, one execution seed, and structured synthetic attacks |

### Field Background

Many defenses inspect one trajectory or let risk scores cool down to avoid permanent lockout. An autonomous agent can execute repeatedly: an attack split across loops may look benign within each loop, while a decaying state lets passive waiting reopen the gate.

### Intermediate Walkthrough

- **The problem**: one loop detects suspicious behavior and disables a tool, but the risk score resets after a few benign turns. The attacker waits and then resumes the same goal.
- **The approach**: the paper formalizes why a trajectory-scoped monitor may not distinguish fragmented attacks from benign observations. LoopHarness persists a non-decaying latch until an explicit release condition or staffed escalation clears it.
- **Why it matters**: once agents survive across loops, sessions, or scheduled resumes, safety-state persistence matters as much as the model classifier.

### Deep Dive

- On a 200-task pool, each configuration runs 1,000 attack episodes; the full controller reports 0.1% ASR and 96.9% clean goal completion, while weakened variants reach 88.4%-97.6% ASR
- In the retention test, no persistent state yields 95.5%-97.5% ASR. Geometric decay is at 0% after distance 1 but returns to 97% after distance 2; the latch stays at 0% across all waiting intervals
- Ablations restore the intended failure modes as components are removed, making the responsible control gate easier to identify than a single aggregate score
- The paper acknowledges an availability cost: without a reliable release or escalation path, the safety mechanism can lock the service indefinitely
- ⚠️ Conditional pass and author-run evaluation: one frozen cohort, one execution seed, and fixed DeepSeek, GPT-4o-family, and Claude Sonnet 4.6 role assignments, with no multi-seed or cross-role replication

### Reviewer's One-Liner

The formal argument, state machine, and ablations clearly explain why waiting can bypass a decaying defense, but the single configuration, seed, and structured synthetic attacks keep the empirical result at proof-of-concept strength.

### Your Takeaway

- Audit whether risk flags disappear through timeouts, session reconstruction, context summarization, or retry logic
- Pair non-decaying state with explicit release criteria and staffed escalation, or a safety control becomes an availability failure

---

## Today's Takeaway

The useful lesson is not that one defense reaches a tiny ASR. Execution authority needs its own data and state: polished evidence does not make an event knowable; tool content that changes a plan does not gain user authorization; and blocking one loop does not clear cross-loop risk. Once an agent can create external consequences, answer generation and execution authorization should be separately observable, testable, and revocable paths.

## References

- Aggarwal, *Calibrated Enough to Know, Not Calibrated to Act*: [arXiv 2608.27167](https://arxiv.org/abs/2608.27167), [code and preregistration artifacts](https://github.com/Pranav-1100/confidence-calibration-evaluation), and [Zenodo archive](https://doi.org/10.5281/zenodo.22043517)
- Guo et al., *When Tool Outputs Become Commands*: [arXiv 2608.27146](https://arxiv.org/abs/2608.27146)
- Wu et al., *Safety Does Not Compose*: [arXiv 2608.27141](https://arxiv.org/abs/2608.27141)
- Official arXiv announcement schedule: [Submission Schedule and Cutoff Time](https://info.arxiv.org/help/availability.html)
