---
title: "AI Agent Arxiv Digest — 2026-09-22"
date: 2026-09-22
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers puncture the same assumption from different angles — that human review, a smart-enough model, or a cancel button means an agent's authorization boundary is safe"
tldr: "Loopjacking reproduces a 'human approves A, system executes B' failure mode in real released products — Agno AgentOS, LangGraph Agent Server, and OpenClaw; APort Vault runs 225,964 evaluations to show that what actually stops an agent from making unauthorized payments is a deterministic policy layer at the tool boundary, not a smarter model; Authorization Revocation formally proves that 'cancellation' may not even be a well-defined concept once delegation and asynchronous execution are involved"
series:
  name: "AI Agent Arxiv Digest"
  order: 121
---

> 🌏 [中文版](/posts/daily/2026-09-22-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers puncture the same assumption from different angles: that human review, a smart-enough model, or pressing a "cancel" button means an agent's authorization has actually been withdrawn. The first, Loopjacking, reproduces a review-failure mode in real released agent products — a human approves what they understand as operation A, while the system executes a materially different operation B — and it reproduces this in Agno AgentOS, LangGraph Agent Server, and OpenClaw. The second, APort Vault, replays real capture-the-flag attacks across 225,964 evaluations to show that what actually stops an agent from making unauthorized payments is not a safer model choice, but a deterministic policy check sitting between the model's tool call and its execution. The third, Authorization Revocation, steps back to ask a more fundamental question: when a long-running agent with delegated tasks and asynchronous execution is "cancelled," what grounds do you have for saying its authorization has actually ended? The three papers' evidence maturity differs — Loopjacking and APort Vault both offer large-scale, reproducible empirical numbers, while Authorization Revocation is a formal proof paired with a modest self-built test suite — but together they point at the same thing: an agent's authorization boundary is not a switch you flip once. It is an engineering problem that has to be explicitly checked and explicitly defined, at every layer of the architecture, for when it truly ends.

## Terms Worth Knowing Before Reading

| Term | Plain-language explanation |
|---|---|
| Human-in-the-loop | A mechanism that has a person give final sign-off before an agent executes a consequential operation, often treated as the last line of defense |
| Authorization boundary | The scope and duration of what an agent is permitted to do — today's three papers each puncture a different assumption about this boundary: that review equals safety, that cancellation equals termination, and that a smarter model equals a safer one |
| Deterministic policy engine | A check layer that blocks non-compliant operations before a tool call executes, based on explicit rules rather than the model's own judgment; APort Vault shows this layer, not model choice, is what actually stops unauthorized payments |
| Delegation | An agent handing off a task, credential, or capability to another process, queue, or third-party service — once handed off, the original "cancel" action may no longer be able to reach it |
| CTF (Capture The Flag) | A common security-community attack/defense competition format; APort Vault uses attacks collected from a real public CTF as its test material, rather than researcher-authored attack prompts |
| Negative control | A deliberately chosen case that, in theory, should not be vulnerable; if it genuinely isn't, that helps confirm the measured vulnerability is real rather than an artifact of the test method itself |

---

## Paper One | Loopjacking: What a Human Approves May Not Be What the System Executes

**Loopjacking: Hijacking Human-in-the-Loop Approval**
Adithyan Arun Kumar (Independent Security Researcher) · arxiv: 2609.21081

Links: [arxiv](https://arxiv.org/abs/2609.21081) · [alphaxiv](https://www.alphaxiv.org/abs/2609.21081)

### TL;DR

Defines and reproduces, in real released agent products, a review-failure mode in which a human believes they approved operation A while the system actually executes a materially different operation B: post-approval state-substitution is reproduced across seven tested Agno AgentOS releases and twelve tested LangGraph Agent Server compositions, representation mismatch is reproduced in OpenClaw 2026.2.23 (fixed in 2026.2.24), while OpenAI Agents SDK fully rejects the same attack as a negative control.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; cs.CR primary, cs.MA cross-list; submitted 2026-09-17) |
| Citation velocity | Not verified (Semantic Scholar rate-limited, HTTP 429, throughout this cycle) |
| Institution | Independent security researcher (Adithyan Arun Kumar) |
| Community signal | No HF Daily Papers / Papers with Code listing found; author released a public evidence archive (github.com/adithyan-ak/loopjacking) |
| Credibility | Pass — reproduced on named, real product versions, with a negative control included |
| Evidence maturity | Preliminary — concrete and reproducible, but the author explicitly states the sample was purposively chosen to test mechanically different approval paths, not a survey of the ecosystem |
| Reproducibility | Full artifacts — public evidence archive with exact versions and reproduction steps |
| Why this paper | Direct — punctures the "human review equals safety" assumption, the entry in today's authorization-boundary theme closest to everyday engineering practice |
| Direction novelty | Substantive — gives the vague intuition of "hijacked approval" a testable formal definition, and separates it from prior work on misleading dialogs and session smuggling |
| Today's importance | High — relevant to any team relying on human-in-the-loop as a security control |
| Practical link | Clear — the paper names two concrete fixes: full canonical re-rendering with exact use-time comparison, or preventing an unauthorized actor from mutating pending approved state |
| Editorial confidence | High — the claim's scope (these named versions exhibit this failure mode) is fully supported by the reproduced evidence |
| Recommendation | Must-read — teams using Agno, LangGraph, or any human-in-the-loop approval mechanism |
| Primary limitation | A comparative, purposively sampled study; the author explicitly disclaims any ecosystem-wide prevalence estimate |

### Field Context

Human-in-the-loop review is often treated as the last line of defense before an agent executes a consequential action, but prior discussion of when this defense fails has mostly stayed at the level of misleading dialogs or prompt injection, rarely systematically examining whether the binding between "the operation reviewed at approval time" and "the operation actually executed" can itself break.

### Mid-Level Walkthrough

- **The problem**: Imagine a low-privilege user requests a $20 transfer to an approved vendor, and an administrator reviews and approves it. If the user can then swap the pending amount to $2,000 to an attacker-controlled account after the administrator's approval, and the system executes the new transaction under that still-valid approval, a human did participate in the review — but the control has failed.
- **The method**: Loopjacking splits this failure into two variants: "post-approval state-substitution," where the human sees the correct operation A but mutable workflow state later replaces it with B; and "representation mismatch," where B is already encoded in the system but the approval view never fully renders it. The authors define a testable qualifying-trace criterion: a genuine human decision must exist, the executed operation must materially differ from what the human understood, an attacker must be able to influence that difference, the product must consume the human's decision for the different operation, and the attacker must have lacked an equally direct path to the same effect — deliberately excluding ordinary persuasion, generic mutable state, forged confirmation without a real human decision, and prompt injection that never reuses an approval.
- **Why it matters**: Whether a human is reviewing and whether that review mechanism is actually secure are two different questions — if the system doesn't re-verify the complete operation at execution time, the approval button may be nothing more than psychological comfort, not a real security boundary.

### Deep-Dive Points

- Post-approval state-substitution reproduced across seven tested Agno AgentOS releases (up to 3.0.9) and twelve tested LangGraph Agent Server compositions (up to 0.14.0)
- Representation mismatch reproduced in OpenClaw 2026.2.23; the same product's 2026.2.24 release has already fixed it and rejects the attack
- OpenAI Agents SDK 0.22.0 and 0.22.2 serve as a negative control: serialized continuation preserves the exact per-call binding and rejects the mutated operation B
- The authors explicitly exclude four easily-confused cases: a human knowingly approving a visible operation B, generic mutable state, forged confirmation with no real human decision, and prompt injection that never reuses an approval
- Deployment threshold: two viable fixes are "complete, canonical re-rendering of the pending operation plus exact use-time comparison," or "preventing an unauthorized actor from mutating pending approved state" — neither requires redesigning the entire review flow
- Limitation (author's own): the study is comparative rather than a census; the sample was purposively chosen to test mechanically different review paths and cannot be used to estimate what fraction of the agent ecosystem is affected; the evidence cutoff is 2026-09-10

### Reviewer's One-Line Take

Turning a previously vague intuition into testable security research — with named reproductions and a negative control — is this paper's strongest contribution; but the sample is purposively chosen and covers only a handful of products, so readers shouldn't read these cases as "human-in-the-loop is generally unsafe."

### Takeaways for You

- If your product has a human-in-the-loop approval gate: check it against the paper's criterion — does your system re-verify the complete operation content at execution time, or does it just render it once at review time and assume it won't change?
- If you're building review flows on Agno AgentOS or LangGraph: go read the paper's exact reproduction steps and affected versions to confirm whether your deployment falls in the affected range

---

## Paper Two | APort Vault: What Stops an Agent from Making Unauthorized Payments Is Not a Smarter Model

**APort Vault: Benchmarking AI Agent Payment Authorization with the Open Agent Passport**
Uchi Uchibeke (APort Technologies Inc.) · arxiv: 2609.22076

Links: [arxiv](https://arxiv.org/abs/2609.22076) · [alphaxiv](https://www.alphaxiv.org/abs/2609.22076)

### TL;DR

Using 4,371 human-authored attacks collected from a real public capture-the-flag event, replayed across 14 models, 5 policy levels, and 225,964 total evaluations: with the model acting alone, 140 of 76,842 compliance-tier (Levels 2–4) evaluations resulted in a transfer to a recipient the policy did not permit; with a deterministic pre-action authorization check (Open Agent Passport) added at the tool boundary, the same attacks produced 0 unpermitted transfers across 69,297 evaluations — and that zero was not achieved by refusing payments, since 25,370 legitimate payments still executed behind the layer.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; cs.CR primary, cs.AI secondary; submitted 2026-09-18) |
| Citation velocity | Not verified (Semantic Scholar rate-limited, HTTP 429, throughout this cycle) |
| Institution | APort Technologies Inc. (Toronto, Canada) |
| Community signal | Included in HuggingFace Daily Papers' 2026-09-21 curation batch; also listed on paperswithcode.co and independent paper-review index pith.science; full 225,964-row evaluation dataset, scoring code, and pre-registration released at huggingface.co/datasets/aporthq/vault-benchmark-v1 (CC BY 4.0) |
| Credibility | Pass — attacks come from real people rather than researcher-authored prompts, the outcome metric reads executed tool calls rather than model or judge self-scoring, and the paper discloses its statistical methods and pre-registration |
| Evidence maturity | Substantial — large-scale, consistent results across 14 models with a five-stage breakdown and matched statistical comparisons, though still confined to a single simulated bank and one tool schema |
| Reproducibility | Full artifacts — the complete evaluation dataset, policy configurations, scoring code, and analysis script are all publicly released |
| Why this paper | Direct — answers, at benchmark scale, exactly where the authorization boundary should sit: at the pre-action policy layer, not a bet on the model not being fooled |
| Direction novelty | Substantive — separates two questions that prior work often conflated ("will the model be talked into it" vs. "will the system actually execute it"), measuring both on the same attacks and the same models |
| Today's importance | High — relevant methodology for any team building agents that touch money or high-risk tools |
| Practical link | Clear — directly demonstrates the "deterministic check before the tool call" architecture pattern, applicable to any agent system with payment or high-risk operations |
| Editorial confidence | High — the paper clearly separates what it does and does not claim, and the numbers within its claimed scope are fully backed by released data |
| Recommendation | Must-read — teams designing authorization or payment-control mechanisms for agent systems |
| Primary limitation | Scoped to a single tool (payments) in one simulated bank; the paper itself stresses the "zero violations" result assumes a correctly configured policy engine, not a guarantee that authorization layers can't be misconfigured |

### Field Context

Most prior agent-security benchmarks answer "which model is safer" — an answer that expires the moment a model is retrained, and one that doesn't tell a deployer what residual risk remains after choosing the best available model. This paper reframes the question as: given the same attacks and the same model, does adding an independent authorization check before the tool call make a difference?

### Mid-Level Walkthrough

- **The problem**: Imagine an agent that can transfer money for you, with a rule that it may only send funds to an allowlisted recipient. An attacker talks to the agent, trying to trick it into sending money to a recipient outside that list. Prior research mostly asked only "can this model be persuaded to attempt the transfer" — not "even if the model is persuaded, does the money actually move?"
- **The method**: The authors ran a real public capture-the-flag event, letting real attackers target a live payment agent, collecting 4,371 actual attack attempts. They then replayed the same attacks, the same model, and the same prompts under two architectures — "model alone" and "model plus a deterministic policy check before the tool call" — with that check being the only manipulated variable.
- **Why it matters**: This shows that "pick a smarter model" is not the fix — "check it once at the tool boundary" is what actually works — and that conclusion is measured directly from the same real attacks, not derived from theory.

### Deep-Dive Points

- At the compliance tiers (Levels 2–4), the model acting alone produced 140 unpermitted transfers across 76,842 evaluations; with the authorization layer added, 0 unpermitted transfers across 69,297 evaluations, giving a per-session upper bound of 0.38%
- That zero was not achieved by refusing payments: 25,370 legitimate payments still executed behind the layer, and the policy denied only 187 of 25,640 transfer calls it evaluated (148 of those for a forbidden recipient)
- Request rates were close across both architectures — on 68,970 matched triples, the paired difference was only +0.084 percentage points (95% CI: -0.020 to +0.189) — though the authors also disclose that 1,220 of those pairs individually disagreed, and do not present the near-zero average as proof the two architectures are equivalent
- The accompanying two-judge audit panel had middling reliability (pooled Cohen's kappa 0.772, dropping to 0.167 at Level 3), with one judge missing 35.6% of deterministically confirmed violations — precisely why the paper uses executed tool calls, not judge scoring, as its headline metric
- Deployment threshold: requires an architectural point where a deterministic check can sit between the tool call and its execution (the paper calls this the Open Agent Passport); systems that already have an API gateway or tool-routing layer face a comparatively well-defined engineering cost to add it
- Limitation (author's own): results are confined to one tool (payments) in one simulated bank, and do not imply the same result would hold for data exfiltration, code execution, or multi-agent delegation; Level 5 deliberately gives the model no payment capability at all while prompting it to attempt a transfer, measuring whether the check layer holds rather than whether the model can be fooled, and the paper explicitly excludes Level 5 from any headline number

### Reviewer's One-Line Take

Using real human attacks, large-scale matched comparisons, and honestly disclosing its own judge panel's limited reliability is a rare degree of self-scrutiny for an agent-security benchmark; but the conclusion remains confined to a single payment scenario, well short of data exfiltration or multi-agent delegation — domains the paper itself warns readers not to extrapolate to.

### Takeaways for You

- If your agent system touches money or executes high-risk operations: don't put your entire safety budget into "buy a more expensive, smarter model" — first confirm there's a deterministic authorization check, independent of the model's own judgment, sitting before the tool call
- If you're designing your own agent-security benchmark: consider this paper's approach of splitting "request," "successful execution," "authorization decision," "recipient membership," and "unpermitted transfer" into five separate events rather than collapsing them into a single, easily-distorted success rate

---

## Paper Three | When an Agent's "Cancel" Button Is Pressed, Has Its Authorization Actually Ended?

**Authorization Revocation for Long-Running AI Agents: Root-Scoped Quiescence under Delegation and Asynchronous Execution**
Genliang Zhu, Chu Wang (Accentrust; Georgia Institute of Technology; University of Illinois Urbana-Champaign) · arxiv: 2609.21284

Links: [arxiv](https://arxiv.org/abs/2609.21284) · [alphaxiv](https://www.alphaxiv.org/abs/2609.21284)

### TL;DR

Long-running agents can outlive the process that launched them through credentials, delegated tasks, queues, callbacks, reservations, and provider-side operations, so cancellation, process exit, or credential revocation alone cannot guarantee that every execution path that existed before the revocation is closed. The paper proposes a formal protocol and certificate for "root-scoped authorization quiescence," passing all 17 traces in a self-built test suite and having a separately implemented checker reject 44 deliberately constructed semantic-regression cases.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed; cs.PL primary, cs.AI and cs.CR secondary; submitted 2026-09-18) |
| Citation velocity | Not verified (Semantic Scholar rate-limited, HTTP 429, throughout this cycle) |
| Institution | Accentrust (Vancouver, Canada), Georgia Institute of Technology, University of Illinois Urbana-Champaign |
| Community signal | No HF Daily Papers / Papers with Code listing found |
| Credibility | Conditional pass — the formal definitions and six proved properties are complete with a clearly stated scope, but empirical validation is limited to one modestly sized, self-built test suite |
| Evidence maturity | Preliminary — the proofs are complete within the paper's own model, but the 17-trace test suite is self-implemented and has not yet been validated against existing real delegation protocols such as MCP, A2A, or OAuth |
| Reproducibility | Partial artifacts — exact test results and counts are reported in the paper, but no public code repository link was found in the abstract/introduction sections read this round |
| Why this paper | Direct — fills the gap neither of the other two papers addresses: what does it formally mean for an agent's authorization to have "ended" under delegation and asynchronous execution |
| Direction novelty | Substantive — unifies several individually incomplete signals ("cancel," "credential revoked," "process ended") into one provable, root-authorization-scoped quiescence certificate |
| Today's importance | High — offers a rare formal vocabulary for teams designing long-running, cross-provider delegated agent systems |
| Practical link | Clear — the paper explicitly distinguishes itself from MCP task cancellation, A2A cancellation, and OAuth token revocation, naming exactly what each can and cannot prove |
| Editorial confidence | Medium — the formal properties' stated scope is clear, but the strength of "this solves the practical delegation-revocation problem" still rests on a self-built test suite, not broader field validation |
| Recommendation | Skim — requires accepting some formal-methods vocabulary to fully absorb; especially valuable for engineers designing related systems, general readers can focus on the Section 1.1 counterexample |
| Primary limitation | The test suite is modestly sized (17 traces) and self-built; the paper does not demonstrate integration with an existing agent runtime |

### Field Context

MCP task cancellation and A2A cancellation are both explicitly defined as best-effort requests, not proofs that all underlying execution has stopped; OAuth token revocation only invalidates a named credential at the authorization server, and does not address delegated work or cross-provider operations already accepted before the revocation. Each of these gives a useful but incomplete observation, and none answers the question of whether this authorization root could still cause a new protected action in the future.

### Mid-Level Walkthrough

- **The problem**: Imagine a shared remote worker process supported by two independent authorization roots, A and B. Before shutting down root A, work under A has already put a message on a durable queue and reserved a provider-side operation. You receive a successful cancellation response, revoke the initiating credential, and see the local process exit — but the queue already accepted that message, and the remote worker could still turn the reservation into a real protected effect at any time. All three signals say "cancelled," but that claim is false.
- **The method**: The paper defines "root-scoped authorization quiescence": for every node where a protected action could occur, a certificate must prove that every action accepted before the revocation took effect is exactly accounted for, that no action after revocation depends on the retired authorization root, while still permitting continued, legitimate work supported by an independent authorization root. The protocol is triggered by a cut on one authorization root, freezes that root's expansion and its protected sinks, represents multi-root authority as a compositional structure of "minimal sufficient root sets," and combines cross-provider certificates into one cutset proof, exactly accounting for channel tokens transferred across interfaces.
- **Why it matters**: "I pressed cancel," "I revoked the token," and "my process has exited" — none of these alone can answer whether this agent could still take a new protected action in the future. If your system involves delegation, asynchronous execution, or cross-provider operations, the guarantee your current cancellation mechanism gives you may be thinner than you think.

### Deep-Dive Points

- Under the paper's own model, six properties are proved: post-cut issuer non-expansion, support-sound projection, compositional soundness under cross-provider composition, independent-support preservation, merge-order independence, and crash/replay stability
- A provider-agnostic "late-effect" test suite matches expected outcomes on all 17 registered execution traces: two cancellation-only executions and one cut-only execution accept the same class of already-scheduled late effect, while two cut-plus-fence executions, one restart, and one stale-process execution correctly reject it
- A separately implemented checker verifies the same 17 traces and rejects 44 deliberately constructed semantic-regression cases
- The paper explicitly bounds what the certificate covers: it proves quiescence relative to one authorization root, not system-wide idleness, not rollback, and not business-level task completion
- Limitation (author's own): the certificate's soundness depends on the assumption that all relevant endpoints are completely or conservatively covered; an opaque endpoint that offers no reliable query, fence, expiry, or terminal receipt cannot contribute a positive quiescence proof

### Reviewer's One-Line Take

Turning the vague practical question of "has authorization actually ended" into a formal definition backed by six proved properties is this paper's most valuable contribution; but validation stops at a modest, self-built test suite, leaving real distance to whether this protocol could integrate into production deployments of MCP, A2A, or similar delegation protocols — readers should not mistake the completeness of the formal proof for validated real-world integration.

### Takeaways for You

- If you're designing an agent system with cross-provider delegation and asynchronous task queues: read the Section 1.1 counterexample and check whether your current "cancel" mechanism can only answer "the local process ended," not "every cross-provider execution path is actually closed"
- If you're evaluating whether to adopt this formal protocol: treat it first as a framework for auditing where your existing delegation-revocation design has gaps, not as an off-the-shelf component ready for production integration

---

## What I Learned Today

I used to think "a human reviews it," "the model is smart enough," and "I pressed cancel" each meant an agent's authorization boundary was safe. Today's three papers puncture all three assumptions: review only means something if the system re-verifies the operation's content at execution time; what actually stops risk is a deterministic check at the tool boundary, not a better model; and "cancellation" under delegation and asynchronous execution doesn't even have a rigorous, provable definition yet. Together, they say the same thing: an agent's authorization boundary isn't a switch you can flip and trust — it's something that only really exists once you've engineered and verified it at every layer of the architecture, from the approval screen to the tool call to the delegation protocol.

## References

- [Loopjacking: Hijacking Human-in-the-Loop Approval](https://arxiv.org/abs/2609.21081)
- [Loopjacking — alphaxiv](https://www.alphaxiv.org/abs/2609.21081)
- [Loopjacking — evidence archive](https://github.com/adithyan-ak/loopjacking)
- [APort Vault: Benchmarking AI Agent Payment Authorization with the Open Agent Passport](https://arxiv.org/abs/2609.22076)
- [APort Vault — alphaxiv](https://www.alphaxiv.org/abs/2609.22076)
- [APort Vault — evaluation dataset](https://huggingface.co/datasets/aporthq/vault-benchmark-v1)
- [Authorization Revocation for Long-Running AI Agents](https://arxiv.org/abs/2609.21284)
- [Authorization Revocation — alphaxiv](https://www.alphaxiv.org/abs/2609.21284)
- [arXiv cs.AI new listings](https://arxiv.org/list/cs.AI/new)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
