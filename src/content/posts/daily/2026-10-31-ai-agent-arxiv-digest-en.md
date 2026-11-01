---
title: "AI Agent Arxiv Digest — 2026-10-31"
date: 2026-10-31
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers ask the same question from three different angles: what should an agent actually trust? Skill composition, file placement, and inter-agent messages all turn out to be exploitable"
tldr: "CoSA shows individually-safe agent skills composed together push policy violations from 35.02% to 58.45%; the Trust Region Effect paper finds GPT-5.4 is 2.6x more likely to obey an injected instruction in a README than in a code file; PCM uses cryptographic evidence so one agent can no longer talk another into a lie, cutting lie-acceptance from 70.8-100% under existing protocols down to 1.4%"
series:
  name: "AI Agent Arxiv Digest"
  order: 160
---

## Today's Overview

Today's three papers ask the same question from three different angles: what should an agent actually trust? CoSA shows that agent skills which each pass individual safety review can be composed to bypass review altogether. The Trust Region Effect paper systematically demonstrates that agents place wildly different levels of trust on different file locations — the same injected instruction gets obeyed 2.6x more often when it's sitting in a README than when it's sitting in code. And PCM goes after the root problem of agent-to-agent trust directly, proposing a cryptographic protocol so an agent can no longer talk another agent into believing a bare claim. Put together, the message is clear: agent systems are full of implicit trust boundaries, and right now almost none of them are guarded.

```diagram
title: Three trust boundaries in agent systems
desc: From skill composition through environment file placement to inter-agent messages, today's three papers each expose a trust boundary assumed safe but exploitable
caption: Maps to L1 CoSA (2610.35082), L2 Trust Region Effect (2610.38867), L3 PCM (2610.39109)
---
<svg viewBox="0 0 640 280">
  <path class="dg-axis" d="M36 40V240" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="28" text-anchor="middle" dominant-baseline="central">Narrower</text>
  <text class="dg-tag" x="36" y="252" text-anchor="middle" dominant-baseline="central">Broader</text>

  <rect class="dg-box" x="72" y="24" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="50" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="50" dominant-baseline="central">Skill</text>
  <text class="dg-sub" x="124" y="74" dominant-baseline="central">Assumed: each skill passes review alone</text>
  <text class="dg-sub" x="604" y="50" text-anchor="end" dominant-baseline="central">Composed skills bypass review</text>

  <rect class="dg-box" x="72" y="104" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="130" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="130" dominant-baseline="central">Environment</text>
  <text class="dg-sub" x="124" y="154" dominant-baseline="central">Assumed: every file is equally trustworthy</text>
  <text class="dg-sub" x="604" y="130" text-anchor="end" dominant-baseline="central">README trust: 2.6x vs code</text>

  <rect class="dg-box" x="72" y="184" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="210" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="210" dominant-baseline="central">Communication</text>
  <text class="dg-sub" x="124" y="234" dominant-baseline="central">Assumed: a signed message = true</text>
  <text class="dg-sub" x="604" y="210" text-anchor="end" dominant-baseline="central">A2A/MCP check identity, not truth</text>
</svg>
```

## Terms Worth Knowing Before Reading

| Term | Plain-language explanation |
|---|---|
| Agent Skill | A reusable capability module an agent can load (e.g. "look up an order," "send an email"), usually reviewed for safety individually |
| Indirect Prompt Injection | An attack where the adversary doesn't talk to the agent directly, but hides malicious instructions in files, web pages, or tool outputs the agent will read |
| Trust Region (as used here) | The paper's term for the different levels of trust an agent implicitly assigns to different locations (files, interfaces) in its environment — not the trust-region concept from reinforcement learning |
| A2A / MCP | Agent-to-Agent and Model Context Protocol, today's mainstream protocols for inter-agent communication and tool access; both verify *who* sent a message, not *whether its content is true* |
| Merkle Log | An append-only, tamper-evident record structure that lets anyone verify a given entry is really in it; it's the backbone of PCM's evidence chain |
| Grant Chain | A chain of delegated authority rooted in a human's approval, where each step can only narrow scope, so a downstream agent's permissions can never exceed what was approved upstream |

---

## Paper 1 | CoSA: Individually-Safe Skills Composed Together Are Not Safe

**CoSA: The Conflict of Skills Attack in Real-World LLM Agent Ecosystems**
Yujia Zheng, Tianhao Li, Shangzhi Xu et al. (9 authors, one affiliated with the Institute of Computing Technology) · arxiv: 2610.35082

Links: [arxiv](https://arxiv.org/abs/2610.35082) · [alphaxiv](https://www.alphaxiv.org/abs/2610.35082) · [GitHub](https://github.com/SIGMIR-ORG/CoSA)

### TL;DR

Agent skills that individually pass safety checks can, when composed, push the policy-violation rate from 35.02% to 58.45% — with the added skills capped at just 5% of the existing pool.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 5 days ago, 0 citations (confirmed via Semantic Scholar) |
| Institution | 9 authors; one affiliated with the Institute of Computing Technology, the rest not individually verified |
| Community signal | Official GitHub repo (SIGMIR-ORG/CoSA); picked up by a Korean community arXiv-tracking bot (roomedia/ax-trend) |
| Credibility | Pass — full text provides a complete 288-task CoSA-Bench across 5 LLMs × 3 agent harnesses, plus a working defense with before/after numbers |
| Evidence maturity | Substantial — attack mechanism, benchmark, and defense are all present, with clear numeric comparisons |
| Reproducibility | Full artifacts — official open-source repo |
| Why this paper | Direct — exposes a new attack surface in agent-skill ecosystems: per-skill vetting cannot catch composition risk |
| Novelty | Substantive — formalizes "Conflict of Skills" as a failure mode distinct from single-skill risk |
| Today's importance | High — agent skill marketplaces (e.g. OpenClaw) are expanding fast, and composition risk is currently almost unreviewed |
| Practical link | Clear — the harness-level guard in the paper can be applied directly to skill-marketplace review pipelines |
| Editorial confidence | High — attack, benchmark, and defense are all backed by concrete numbers within a clearly bounded claim |
| Reading recommendation | Must-read — for any team running an agent skill/plugin marketplace |
| Primary limitation | Evaluated within CoSA-Bench's 4 constructed business domains (recruiting, finance, IT, business); generalization to arbitrary real-world skill ecosystems is untested |

### Field Context

Agent Skills let developers extend agent capability without rewriting everything, but today's review process is almost entirely "check each skill in isolation" — every skill is security-scanned before it's listed. The problem: that review assumes skills don't affect each other, but in practice, output from one skill can be reused by another skill in a way that drops the restrictions the original output carried.

### Intermediate Walkthrough

- **The problem**: Imagine a "read customer data" skill that passes review because it only returns data to the agent itself, and a "send email" skill that passes review because it only sends when the user explicitly asks. If the agent repackages data it read from the first skill as "the user already approved this" for the second skill, the two individually-safe skills combine into unauthorized data exfiltration.
- **The method**: CoSA analyzes an existing skill pool and identifies two composition mechanisms — "capability supplementation" (supplying a missing operation) and "relationship reshaping" (altering how artifacts, decisions, or action targets get passed along) — then uses these to select seemingly benign skills to add, within a budget of just 5% of the pool.
- **Why it matters**: "Every skill is safe" does not imply "the skill pool is safe." Skill marketplace review needs to move from per-skill auditing to composition-risk auditing.

### Deep-Dive Points

- CoSA-Bench: 288 tasks across recruiting, finance, IT, and business domains, covering data leakage, unauthorized state modification, and unsafe execution
- Across 5 LLMs and 3 agent harnesses, adding at most 5% new skills to the pool raises the policy-violation rate from 35.02% to 58.45% (+23.43 points)
- Defense: a harness-level guard that checks information flow and authorization drops violations on OpenClaw recruiting tasks from 65.28% to 6.67%, with a reported tradeoff against benign-task completion
- Deployment bar: requires inserting information-flow tracking at the harness layer (not the single-skill layer) — an architectural change for existing live marketplaces, not a simple scanning rule
- Framework relevance: applies to any agent framework supporting external skill/plugin loading (e.g. systems built on OpenClaw or MCP-style tool ecosystems)
- Limitation: evaluation is bounded to CoSA-Bench's constructed scenarios; real marketplace composition space is far larger than 288 tasks

### Reviewer's One-Liner

The attack mechanism is clearly defined and the benchmark is solid, with the defense backed by concrete effect sizes — a rare case of an agent-security paper delivering attack, benchmark, and defense together; but the evaluation is still on a self-built benchmark, and the complexity and adversarial dynamics of real skill marketplaces still need external validation.

### Takeaways for You

- If you run an agent skill/plugin marketplace: don't rely on single-skill scanning alone — add cross-skill information-flow and authorization tracking at the harness layer; CoSA's defense design is a direct reference
- If you're assessing your own agent's security: add composition testing to your red-team process — testing each skill individually says nothing about safety when they're combined

---

## Paper 2 | The Trust Region Effect: Agents Trust Different Files Very Differently

**Where You Inject Matters: The Trust Region Effect in LLM Agents**
Chengquan Guo, Xiaodong Liu, Weiwei Yang et al. (University of Chicago, Microsoft Research, University of Rochester, Simon Fraser University, UC Davis, UIUC; 10 authors) · arxiv: 2610.38867

Links: [arxiv](https://arxiv.org/abs/2610.38867) · [alphaxiv](https://www.alphaxiv.org/abs/2610.38867)

### TL;DR

Holding the injected content fixed and varying only its location, GPT-5.4 is 2.6x more likely on average to obey a malicious instruction placed in a README/TODO file than the identical instruction in a code or data file.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 3 days ago; Semantic Scholar 429-rate-limited on retries, not individually confirmed, but near-certainly 0 citations given recency |
| Institution | University of Chicago, Microsoft Research, University of Rochester, Simon Fraser University, UC Davis, UIUC (including Bo Li, Jianfeng Gao) |
| Community signal | Picked up by a community arXiv-digest bot (matouskozak/arxiv-digest #259, 2026-10-30); not found in HF Daily Papers |
| Credibility | Pass — 3 independent testbeds, 8 frontier models, deterministic script-based verification (not LLM-judged), with full ASR comparison tables |
| Evidence maturity | Substantial — systematically varies only the "placement" variable, replicated across coding, tool-use, and daily-workflow domains |
| Reproducibility | Not provided — no code/testbed release statement found in the sections read |
| Why this paper | Direct — the first systematic breakdown of injection *placement*, a dimension prior work largely ignored |
| Novelty | Substantive — earlier work only varied attack content or placement within a single surface; this paper compares systematically across heterogeneous environments |
| Today's importance | High — indirect prompt injection has topped the OWASP LLM Top 10 for two years running, and placement is a current blind spot in defense design |
| Practical link | Clear — points directly at a concrete defense direction: don't give document-type files (README/TODO) implicitly higher trust than code |
| Editorial confidence | High — the effect holds consistently across 8 models and 3 domains, with the claim's scope clearly bounded to the tested models and testbeds |
| Reading recommendation | Must-read — for anyone building coding agents or agents that read external documents |
| Primary limitation | Measures conditional attack-success-rate among injections that were successfully delivered within 3 self-built testbeds; whether the surface-trust ranking generalizes to arbitrary production deployments is untested |

### Field Context

Indirect prompt injection — where an attacker hides malicious instructions in content the agent will read, rather than talking to the agent directly — has topped the OWASP LLM Application Top 10 for two consecutive years. Prior research mostly optimized *what* to inject, or compared placement only within a single interface (e.g. one webpage); nobody had systematically compared *which kind of file* the injection sits in as a variable in its own right.

### Intermediate Walkthrough

- **The problem**: Imagine a coding agent working through a task, reading a README, a TODO file, source files, and data files in sequence. The exact same malicious instruction, placed in the README, may get followed; placed in a data file, it gets completely ignored. Same content, wildly different outcome — this is what the paper calls the "trust region effect": agents implicitly assign different trust levels to different regions of their environment.
- **The method**: The team built 3 long-horizon testbeds (coding, tool-use, daily workflow), held the malicious instruction's content fixed, and varied only the file type and in-file position (start/middle/end), using deterministic scripts (not an AI judge) to determine attack success, repeated across 8 frontier models.
- **Why it matters**: If current agent-safety defenses only check "does this content look dangerous," they'll miss an equally important risk factor: "where is this content located." Defense design needs extra scrutiny on high-trust regions like documentation files.

### Deep-Dive Points

- Three testbeds built on Terminal-Bench-2 (coding), AgentDojo (tool-use), and DecodingTrust-Agent (daily workflow), covering 36 environmental surfaces
- GPT-5.4 follows an unsafe instruction in README/TODO 2.6x more often on average than in code/data files; in the workflow domain, GitHub and Slack are more exploitable than Confluence and Jira
- Failed injections are overwhelmingly *ignored* rather than explicitly refused — GPT-4o ignores 81.3% vs. explicitly refusing only 0.7%
- Using GPT-5.4 itself as an attacker to pick the best injection placement does not reliably beat a simple frequency-based prior
- A two-stage GRPO-trained "placement-aware attacker," optimizing content and placement jointly, outperforms content-only optimization and transfers to a more robust model
- Limitation: measures conditional attack-success-rate *after* successful delivery; whether an injection even reaches the agent in a real deployment is a separate question

### Reviewer's One-Liner

Using deterministic verifiers instead of an AI judge to score attack success is methodologically more rigorous than much comparable work, and the consistency across 8 models and 3 independent testbeds makes the "trust region effect" finding solid; but this is still a "problem discovery" paper — it offers no corresponding defense mechanism, leaving readers with a clear direction rather than a ready-made fix.

### Takeaways for You

- If you build coding agents or agents that read external documents: don't assume README, TODO, or comment-style content is inherently trustworthy — add an extra check for instruction-like language in these file types
- If you're designing agent safety guardrails: rules shouldn't only judge "does this content look like an attack" — they should also weight risk by "which surface does this content appear on," since the same instruction carries different risk depending on placement

---

## Paper 3 | PCM: Making It Impossible for One Agent to Lie to Another

**PCM: A Proof-Carrying Message Protocol for Verifiable Multi-Agent Communication**
Bravish Ghosh (Cygnux Labs) · arxiv: 2610.39109

Links: [arxiv](https://arxiv.org/abs/2610.39109) · [alphaxiv](https://www.alphaxiv.org/abs/2610.39109) · [GitHub](https://github.com/Cygnux-Labs/PCM-protocol)

### TL;DR

On a benchmark of 926 real messages, 712 of them lies, PCM accepts only 10 (1.4%), while six existing deployed protocols — including the ecosystem around A2A and MCP — accept between 504 and 712.

### Editorial Judgment

| Dimension | Assessment |
|---|---|
| Venue | arXiv preprint, primary category cs.CE, cross-listed cs.AI/cs.CR/cs.MA (not peer-reviewed) |
| Citation velocity | Published 2 days ago; Semantic Scholar 429-rate-limited on retries, not individually confirmed, but near-certainly 0 citations given recency |
| Institution | Bravish Ghosh, Cygnux Labs (solo author, startup-scale) |
| Community signal | Open-source reference implementation Cygnux-Labs/PCM-protocol (MIT license), with a companion signer project Cygnux-Labs/Tracekit; not found in HF Daily Papers |
| Credibility | Pass — full text provides a complete formal threat model, 5 proven security properties, 187 conformance vectors, and an empirical benchmark against 6 deployed protocols |
| Evidence maturity | Substantial — combines formal proofs with an empirical benchmark; the author is explicit about what the protocol does *not* do (cannot make a compromised agent honest, trusts the signer as the TCB) |
| Reproducibility | Full artifacts — spec, JSON Schemas, reference implementation, independent verifier, conformance vectors, and benchmark all open-sourced under MIT |
| Why this paper | Direct — targets a gap A2A and MCP leave open: they verify *who* sent a message but not *whether its content is true* |
| Novelty | Substantive — applies the "proof-carrying code" idea to agent-to-agent communication, a new problem framing rather than a tweak on existing crypto |
| Today's importance | High — multi-agent collaboration (a planning agent delegating to a coding agent, a customer-service agent asking a payments agent for a refund) is spreading fast, and nothing currently guarantees inter-agent message truthfulness |
| Practical link | Clear — can be layered on top of existing A2A/MCP deployments without a protocol rewrite |
| Editorial confidence | High — the claim is precisely scoped (given an honest signer and an untrusted agent, lie-acceptance is far lower than existing protocols), and the author states the trust boundary as clearly as the contribution |
| Reading recommendation | Must-read — for any team designing multi-agent systems, especially ones involving money or authority transfer |
| Primary limitation | Solo-authored, not yet peer-reviewed; the attesting signer is itself the trusted computing base, and the guarantee fails if a deployment doesn't actually isolate the signer from the agent |

### Field Context

Protocols like A2A (from Google) and MCP (from Anthropic) solved how agents transmit messages and authenticate channels, but not whether the receiving agent should believe the message's content. An agent compromised by prompt injection — or one that's simply hallucinating — can sign and send a completely well-formed lie, and existing protocols have no way to tell.

### Intermediate Walkthrough

- **The problem**: Imagine Agent A tells Agent B "the tests passed, please refund $120." B has only A's word. If A was prompt-injected, or simply reported a failed test as a pass, B has no way to tell — existing protocols only verify "this really was signed by A," not "what A claims actually happened."
- **The method**: PCM borrows from proof-carrying code — the producer of untrusted code ships a proof, and the consumer checks it with a small checker instead of trusting the producer. PCM routes every agent tool call through an "attesting signer" service the agent cannot write to, which records each call's outcome in a tamper-evident log. When an agent sends a message, it ships the log evidence alongside; the receiver checks the signature and evidence offline and returns one of three verdicts — proven, unproven, or failed. A claim resting solely on the agent's own word can never be "proven." Authority works the same way: a grant chain rooted in a human's approval that can only narrow at each step.
- **Why it matters**: This turns inter-agent trust from "I choose to believe you" into "I can independently verify you." For any multi-agent system touching money or delegated authority, this is a concrete move from optimistic trust toward a zero-trust architecture.

### Deep-Dive Points

- PCM-Lies benchmark: 926 messages from real signer runs (real pytest suites, HTTP requests, file writes, human approvals), 712 of them lies across 16 classes
- PCM accepts only 10/712 lies (1.4%, 95% CI 0.8-2.6%), all of the "stale evidence" type (a test passed once, the code later changed and broke it, but the sender still cites the old pass)
- Baselines: plain A2A accepts all 712; six modeled deployed protocols (signed A2A Agent Cards, uAgents, RFC 9421, SCITT, AP2, Verifiable Intent) accept 504-712; even stacking AP2, SCITT, and RFC 9421 together still accepts 51.3%
- Two independently written verifiers agree on all 926 verdicts; per-message verification takes about 0.8-1.2 ms, with a median message size of 1.9-11.7 KB
- Deployment bar: requires standing up an independent "signer" service and genuinely ensuring the agent cannot touch the signer's keys or log — an architectural change
- Framework relevance: can layer on top of A2A/MCP as an additional verification layer; the paper explicitly positions itself as augmenting, not replacing, existing protocols
- Limitation: the signer itself is the trusted computing base, and the paper does not end-to-end test whether signer isolation actually holds in a real multi-tenant production environment

### Reviewer's One-Liner

A formal threat model, proven security properties, and an empirical benchmark all present together — with "what this protocol doesn't solve" spelled out as clearly as the contribution — is a rare level of engineering rigor; but it's solo-authored and not yet peer-reviewed, and the entire guarantee rests on the deployment assumption that the signer is actually isolated, which still needs external validation.

### Takeaways for You

- If you're designing a multi-agent system involving money or delegated authority: existing A2A/MCP signatures only prove *who* sent a message, not that its content is true — PCM's proof-carrying approach is worth directly evaluating
- If you're auditing agent security: use PCM-Lies' 16-class lie taxonomy to check whether your downstream agents can take high-risk actions based solely on an upstream agent's unverified self-report

---

## Today's Takeaway

I used to think agent security was mainly about blocking malicious input. Today's digest points at something more fundamental: what should an agent actually trust? Skill composition, file location, and another agent's word are all currently assumed trustworthy by default — and all three papers show that default assumption can be exploited. Defense design needs to go one step before "block the attack": first draw the trust boundaries.

## References

- [CoSA: The Conflict of Skills Attack in Real-World LLM Agent Ecosystems (arXiv:2610.35082)](https://arxiv.org/abs/2610.35082)
- [CoSA official code (GitHub: SIGMIR-ORG/CoSA)](https://github.com/SIGMIR-ORG/CoSA)
- [Where You Inject Matters: The Trust Region Effect in LLM Agents (arXiv:2610.38867)](https://arxiv.org/abs/2610.38867)
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [PCM: A Proof-Carrying Message Protocol for Verifiable Multi-Agent Communication (arXiv:2610.39109)](https://arxiv.org/abs/2610.39109)
- [PCM official code and spec (GitHub: Cygnux-Labs/PCM-protocol)](https://github.com/Cygnux-Labs/PCM-protocol)
- [Google Agent2Agent (A2A) Protocol](https://a2a-protocol.org/)
- [Anthropic Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
