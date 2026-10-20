---
title: "AI Agent Arxiv Digest — 2026-10-20"
date: 2026-10-20
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers examine how solid an agent's control boundary really is, at the metric, exploit, and architecture level — a low attack success rate is often just the agent not reacting, a production platform's approval mechanism can be escalated into a backdoor, and an MCP gateway's architecture alone determines the security-cost trade-off"
tldr: "Ignored, Not Refused audits 33,000 trajectories and finds 76-80% of 'successful defenses' are actually the agent not reacting, and ASR swings from 0.2% to 43% with only a system-prompt change; From Approval to Abuse shows agents on Claude Code and Codex CLI can be steered into requesting over-broad allow-rules, succeeding in 58% of instances with 81% silent goal completion once approved; GatewayBench finds flattened MCP gateways' per-turn token cost can balloon 28x as the tool pool grows, while hierarchical gateways can collapse entirely under a weaker model"
series:
  name: "AI Agent Arxiv Digest"
  order: 149
---

> 🌏 [中文版](/posts/daily/2026-10-20-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers take apart the question of whether an agent is actually "under control" at three different layers. *Ignored, Not Refused* first punctures the metric the whole field leans on: a low attack success rate (ASR) is, 76-80% of the time, simply the agent failing to react rather than genuinely defending itself — and changing nothing but the system prompt can send the same models' ASR from 0.2% to 43%. *From Approval to Abuse* then shows exactly how that metric blind spot gets exploited in practice: on Claude Code and Codex CLI, two production platforms people actually use, malicious content planted in a repository can steer an agent performing a routine task into requesting an overly broad "don't ask again" allow-rule; once a user approves it, attackers achieve silent goal completion in 58% of experimental instances without ever triggering further human review. *GatewayBench* pulls the lens back further, to the middleware layer between an agent and the tools it calls: whether an MCP gateway flattens the entire tool list into the agent's context or exposes it hierarchically through discovery is an architecture choice that alone decides the trade-off between security and cost — a flattened gateway's per-turn token cost can climb from 8.3k to 233.3k tokens as the tool pool grows, while a hierarchical gateway can collapse outright once paired with a weaker model. Together, the three papers are a reminder: an agent being "under control" is often just a number that happened to pass a checkpoint — the real control boundary is easier to route around, or to overwhelm, than most teams assume.

## Terms worth knowing before reading

| Term | Plain-language explanation |
|---|---|
| Agent harness | The software layer wrapping a model — system prompts, tool calls, permission checks, sandboxing — not the model itself |
| Attack Success Rate (ASR) | The most common metric for agent security: the fraction of malicious instructions that successfully make the agent misbehave. A low number is usually read as "defense worked" |
| Allow-rule | A rule the harness remembers after a user approves a "don't ask again for this kind of action" request — future matching actions no longer trigger a human review |
| Indirect Prompt Injection (IPI) | A malicious instruction not typed by the user, but hidden in external content the agent reads (a webpage, a file, a repository) and smuggled in while the agent processes a task |
| MCP Gateway | The middleware layer between an agent and a large pool of external tools, responsible for deciding which tools, and in what form, reach the agent — flattened exposes everything at once, hierarchical makes the agent look things up |
| Flattened vs. Hierarchical | Two MCP gateway designs: a flattened gateway stuffs every tool definition into the agent's context at once; a hierarchical gateway only exposes discovery "directory" tools, retrieving specific tools on demand |

---

## Paper 1 | "Ignored" is not "Refused": what a low attack success rate is actually hiding

**Ignored, Not Refused: What Low Prompt-Injection Success Rates Hide in Small Tool-Using Agents**
Farhan Zarif, Kazi Shahid Ahmed Galib, Synthia Akter Promi et al. (BRAC University) · arxiv: 2610.23254

Links: [arxiv](https://arxiv.org/abs/2610.23254) · [alphaxiv](https://www.alphaxiv.org/abs/2610.23254)

### TL;DR

Auditing 33,000 trajectories shows that the field's standard security metric, ASR, is low 76-80% of the time simply because the agent never reacted to the injection, not because it genuinely recognized and refused it — and changing only a nine-word system prompt sends the same models' ASR from 0.2% to 43%.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar returned 429 (rate limit) on two attempts, but every sibling paper from the same batch shows 0 citations, consistent with the expected pattern |
| Institution | BRAC University (Bangladesh) |
| Community signal | Not on HuggingFace Daily Papers; no Papers with Code entry found |
| Credibility | Pass — a label-blind LLM-judge audit of 33,000 trajectories, with human validation and statistical-test details in Appendices D and E |
| Evidence maturity | Substantial — full coverage of 2 standard benchmarks × 11 models × 3 serving precisions (66 cells), but limited to 2-14B small open-weight models |
| Reproducibility | Partial artifacts — labeled corpus, judge prompt, and analysis code released via an anonymized review repository; not yet attributed as a public open-source release |
| Why this paper | Direct — directly challenges the core metric the whole field uses to measure agent security |
| Novelty | Substantive — the first systematic decomposition of what a low ASR actually consists of (genuine defense vs. simply not reacting) |
| Today's importance | High — relevant to any team using ASR as a security benchmark or a selection criterion |
| Practical link | Clear — directly affects agent security evaluation methodology and pre-launch security sign-off standards |
| Editorial confidence | High — concrete numbers and full statistical testing; the claim is scoped to the 11 small open-weight models audited |
| Reading recommendation | Must-read — for anyone doing agent security evaluation, model selection, or writing security sign-off criteria |
| Primary limitation | Only tests 2-14B small open-weight models; frontier commercial agents are not the main audited sample (Appendix F includes only a small frontier reference) |

### Field context

Agent security evaluation has long treated ASR as the one security score that matters: a low ASR is read as "defense worked." But that metric carries a hidden assumption — that every failed attack failed because the agent recognized and resisted it. No one had checked whether failure actually meant "refused" or simply "never reacted," and the two mean very different things for a user.

### Mid-level walkthrough

- **The problem**: Picture a security guard standing at a door someone tried, and failed, to get through. All you see is "break-in failed" — but that could mean the guard spotted the intruder and stopped them, or it could mean the guard was dozing off and the intruder never pushed very hard either. Existing agent security evaluations only report "did the break-in succeed," and have never distinguished between these two very different outcomes.
- **The method**: The authors have a judge model from a different model family than any agent under test (DeepSeek-V4.1-Flash) read full trajectories with no knowledge of scores or model identity, labeling every failed attack into one of six outcomes: genuinely recognized and refused, noticed but not acted on, never noticed at all, mechanical breakdown, partial compliance, or full compliance. They then use an Attack–Task Outcome Matrix (ATOM) to look at two things at once: did the attack succeed, and did the user's actual task get completed — because an agent that's "safe" but also failed to do what the user asked isn't really safe in any useful sense.
- **Why it matters**: If your security sign-off criteria only look at ASR, you may have no idea whether your agent genuinely learned to refuse suspicious instructions, or just got lucky, or is too weak to carry out what the attacker wanted — swap in a stronger model or a different harness, and a previously "safe-looking" ASR number can flip overnight.

### Deep-dive details

- Among failed attacks, 76-80% were "ignored" (inert — either never noticed or noticed but not acted on), and only 17-18% were "genuinely refused"
- Changing only the system prompt (nine extra words) pushed InjecAgent's ASR from an 8.09% baseline to 43.05% under an "Authorize" framing, versus 0.22% under a matched "Interdict" framing
- Nine models shifted significantly under paired McNemar tests (p < 10⁻¹⁵); Spark-4B surged from 0.95% to 70.88%
- A three-rule explicit guardrail (182 words — longer than the nine-word change above) instead pushed ASR from 9.69% down to 0.95%, showing that it isn't simply "a longer prompt is riskier"
- The ATOM matrix shows that across 16,273 audited AgentDojo episodes, 21.7% were "safe but the task didn't get done" — an outcome standard ASR counts as a successful defense, even though the user's task was never completed
- Lowering serving precision (FP8, NF4) only slightly reduced ASR, because the model became less capable of acting, not more defensive — refusal rates stayed flat across precisions
- Limitation: only 2-14B small open-weight models were audited; frontier commercial agents (production-grade Claude Code, GPT-series, etc.) are not the core audited sample

### Reviewer's one-line take

A rigorous, label-blind-judge-plus-human-validation decomposition of an assumption the field has run on for years without ever checking it carefully; but the audited sample is concentrated in small open-weight models, so whether frontier commercial agents show a similar "ignored vs. refused" gap still needs separate verification.

### Take-aways for you

- If you're writing an agent security evaluation report or sign-off criteria: don't report ASR alone — also report whether failed attacks were refused or ignored, and whether the user's task was completed, or you risk mistaking "nothing bad happened by luck" for "genuinely safe"
- If you're comparing the security of different models or harnesses: first check whether a low ASR comes from the model simply being too weak to act — rerun the same guardrail setup with a stronger model, and the number may look completely different

---

## Paper 2 | From approval to abuse: privilege-escalation attacks on production coding agents

**From Approval to Abuse: Privilege Escalation Attacks on Harness-Protected Coding Agents**
Xianglin Yang, Yechao Zhang, Jiahao Liu et al. (National University of Singapore; Nanyang Technological University; Ant Group) · arxiv: 2610.22987

Links: [arxiv](https://arxiv.org/abs/2610.22987) · [alphaxiv](https://www.alphaxiv.org/abs/2610.22987)

### TL;DR

On Claude Code and Codex CLI, malicious content planted in a repository can steer an agent performing a routine task into requesting an overly broad "don't ask again" allow-rule; the induction succeeds in 58% of experimental instances, and once approved, 81.0% achieve verified silent completion of a goal that would otherwise have required human sign-off.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar confirms 0 citations |
| Institution | National University of Singapore; Nanyang Technological University; Ant Group |
| Community signal | Not on HuggingFace Daily Papers; no Papers with Code entry found |
| Credibility | Pass — 4 production-platform configurations (Codex CLI × 2 models, Claude Code × 2 models) × 25 cases, with Benign Control and Direct Request baselines for comparison |
| Evidence maturity | Substantial — a two-stage evaluation framework (permission acquisition / authority reuse), full ablations, and three mechanistic insights, but only 25 cases per configuration (100 base cases total) |
| Reproducibility | Partial artifacts — the appendix gives full prompts, the synthetic sandbox setup, and the case schema; no standalone code repository link appears in the text read |
| Why this paper | Direct — directly attacks the approval mechanism itself on two production coding-agent platforms currently in heavy real-world use |
| Novelty | Substantive — the first systematic study of the attack surface created by a recently popularized UX convenience: reusable allow-rules |
| Today's importance | High — Claude Code and Codex CLI are tools developers use at high frequency right now |
| Practical link | Clear — directly affects the approval-review policies of developers and organizations using these tools |
| Editorial confidence | High — concrete numbers (58%, 56.9%, 81.0%) with baseline comparisons; all experiments confined to a synthetic sandbox, not real user systems |
| Reading recommendation | Must-read — for anyone using Claude Code / Codex CLI, or designing a similar approval mechanism |
| Primary limitation | All experiments run in a synthetic sandbox environment (for research-ethics reasons), covering only 4 agent configurations |

### Field context

To counter prompt injection, recent coding-agent harnesses have widely adopted "approve before execution": any action outside the sandbox boundary must first ask the user. But asking every time is exhausting, so platforms like Claude Code and Codex CLI added a convenience: approve once, remember the rule, and future matching actions no longer need to ask. This paper asks whether that convenience feature — designed specifically to reduce "approval fatigue" — has itself become a new attack surface.

### Mid-level walkthrough

- **The problem**: Imagine you ask a new assistant to tidy up a repository, and partway through they say "I need to use curl to fetch some data — want me to just allow curl commands from now on, so you don't have to approve every time?" You think it sounds reasonable and say yes. But if that exact phrasing was actually suggested by malicious instructions hidden in the repository's documentation, you've just opened the door yourself — and left it open permanently.
- **The method**: The attack has two stages. Stage one (Permission Acquisition) has an attack framework plant plausible-looking content in a repository to steer the agent, while performing a normal task (e.g., "run this repository"), into proactively requesting a semantically broad "don't ask again" rule from the user; a critic LLM reads the attempt's outcome and iteratively refines the planted content until the rule gets approved. Stage two (Authority Reuse) then verifies, after the rule is approved, whether the attacker can actually use it to silently achieve an adversarial goal (unauthorized reading, data exfiltration, file deletion, downloading suspicious artifacts, or configuration tampering) that would normally have required further approval.
- **Why it matters**: This means "a human approved it" doesn't, by itself, guarantee safety — if the content being approved was itself the product of adversarial steering, human review has already been bypassed at the source, and the bypass is permanent rather than one-off.

### Deep-dive details

- Across four configurations spanning Codex CLI (gpt-5.6-luna, gpt-5.6-sol) and Claude Code (claude-haiku-4.5, claude-sonnet-5), the average induction success rate (goal-reachable) reaches 58% across the 100 base cases
- The elicited rules' semantic coverage (PCC) is substantially broader than the Direct Request prompt-injection baseline: e.g., Codex (gpt-5.6-luna) rises from 0.25 to 0.57, and on the most heavily aligned model, Claude (claude-sonnet-5), Goal Reachability jumps from 1/25 to 9/25
- A post-acquisition semantic-coverage test shows the elicited rule covers 56.9% of category-specific capability test cases on average — far broader than what a user approving it likely imagined
- Conditional on the 58 eligible approved-rule instances, 47 (81.0%) achieve verified, silent goal completion without triggering any further approval prompt
- Mechanistic insight: Codex and Claude Code generalize permissions along different axes — Codex abstracts over behavioral history (repeated wget calls collapse into one rule), while Claude Code abstracts over literal command syntax (an unquoted parameter collapses into a wildcard rule) — attackers must tailor their induction strategy to each harness
- Another key finding: "dataflow dependency" beats "narrative persuasion" by a wide margin — simply telling the agent a step matters succeeded 0/3 times, while making the step a technical dependency for subsequent execution succeeded 3/3 times
- Limitation: all experiments ran in a synthetic sandbox (for research-ethics reasons) across only 4 agent configurations, so consistency on real user systems and broader model combinations remains unverified

### Reviewer's one-line take

Turns a convenience feature born from "approval fatigue" into a complete, systematic attack chain, verified on two genuinely heavily used production platforms with concrete numbers and clear baselines; but because of research ethics, every experiment runs in a synthetic sandbox, leaving the "last mile" verification against real deployments for future work.

### Take-aways for you

- If your team uses Claude Code or Codex CLI and is in the habit of approving agent-suggested "don't ask again" rules: get into the habit of checking the exact scope of a rule before approving it, especially when it's proposed while working in an unfamiliar third-party repository
- If you're designing a similar harness approval mechanism: the paper's three mechanistic insights (abstraction axes differ by system, agents follow dataflow rather than narrative, and stronger agents actively route around roadblocks) can be applied directly to redesigning how allow-rules are generated and presented, rather than assuming users will fully understand a rule's scope

---

## Paper 3 | How you design the MCP gateway decides how secure — and how expensive — your agent is

**GatewayBench: Unified Capability and Security Evaluation Platform for MCP Gateways**
Yitian Zheng, Zhaorun Chen, Haoyu Li, Bo Li (Tsinghua University; University of Chicago; University of Illinois Urbana-Champaign) · arxiv: 2610.23449

Links: [arxiv](https://arxiv.org/abs/2610.23449) · [alphaxiv](https://www.alphaxiv.org/abs/2610.23449)

### TL;DR

A systematic comparison across 524 tasks, 11,118 real-world tools, and 7 widely deployed MCP gateways finds that a flattened gateway's per-turn token cost can balloon from 8.3k to 233.3k as the tool pool grows, while a hierarchical gateway can collapse under a weaker model — and the security gap between the two architectures comes almost entirely from tool-level injection, not environment-level injection.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar confirms 0 citations |
| Institution | Tsinghua University; University of Chicago; University of Illinois Urbana-Champaign (Bo Li's lab) |
| Community signal | Not on HuggingFace Daily Papers; no Papers with Code entry found |
| Credibility | Pass — 524 tasks across six domains, 11,118 real tools from 251 authentic MCP servers, 7 widely deployed gateway implementations, with both benign and adversarial evaluation tracks |
| Evidence maturity | Substantial — a large-scale real-world tool ecosystem with cross-cutting capability/efficiency/security experiments, but only tested against specific harnesses (OpenAI Agents SDK, OpenClaw) and model combinations (GPT-5.1/5.4) |
| Reproducibility | Partial artifacts — the task dataset, tool pool, and metrics are described in full; no standalone code repository link appears in the sections read |
| Why this paper | Direct — the MCP gateway is a near-mandatory middleware layer for agent deployment at scale, directly shaping capability, efficiency, and security |
| Novelty | Substantive — the first benchmark to systematically study how gateway architecture itself shapes agent behavior |
| Today's importance | High — as agent deployment scales up, the impact of gateway-selection decisions will grow quickly |
| Practical link | Clear — translates directly into actionable guidance for gateway selection and architecture design |
| Editorial confidence | High — large-scale, real-world tool-ecosystem experiments with concrete numbers and a clear architectural contrast |
| Reading recommendation | Must-read — for any team designing or selecting a tool-access architecture for agents |
| Primary limitation | Tested against only a limited set of model/harness combinations, so whether it generalizes to other mainstream agent harnesses (e.g., Claude Code's own tool-calling mechanism) remains unknown |

### Field context

MCP has become the standard interface for connecting agents to external tools, but as organizations scale up, they typically add a "gateway" layer in between to aggregate and govern potentially thousands of tools. The industry has produced a proliferation of gateway implementations — flattened, hierarchical — but no one had systematically studied how the gateway's own architecture choice shapes an agent's capability, efficiency, and security; everyone was busy picking agents and models, while overlooking that this middleware layer is itself a variable.

### Mid-level walkthrough

- **The problem**: Imagine a company preparing a toolbox for a new hire. One approach dumps every tool in the warehouse onto the employee's desk at once, and they have to dig through thousands of items to find what they need; the other hands them a catalog, and they look something up and check it out as needed. The first (flattened) is slow to search and quickly buries the desk; the second (hierarchical) adds a lookup step but keeps the desk clear. Which is better depends on how skilled the employee (the model) is, and on how likely it is that a bad tool has been mixed into the warehouse.
- **The method**: The authors classify MCP gateways into two major paradigms — flattened (stuffing every tool definition into the agent's context at once) and hierarchical (exposing only discovery "directory" tools, with specific tools retrieved on demand). They built a benchmark of 524 tasks and 11,118 real-world tools from 251 authentic MCP servers, deliberately injecting 0 to 1,500 task-irrelevant "noisy tools" into each task environment to simulate tool-sprawl at scale, then measured benign task completion, adversarial attack success rate, and token cost/latency separately.
- **Why it matters**: This means "which agent model to pick" isn't the only decision that matters — the gateway architecture is itself an independent variable that shapes both security and cost, and it interacts with the model and harness in ways that can amplify or cancel each other out, so no single factor can be judged in isolation.

### Deep-dive details

- With no noisy tools injected, hierarchical gateways show a significantly lower mean indirect attack success rate than flattened ones (19.6% vs. 60.5%, 30.9% vs. 47.2%, 15.6% vs. 42.5%, depending on agent configuration), and under a capable model like GPT-5.4 the security gain comes at essentially no capability cost (85.1% vs. 87.2% task success)
- Injecting up to 1,500 noisy tools drops flattened gateways' benign task success by as much as 10.0 percentage points, versus at most 5.5 points for hierarchical gateways — which under GPT-5.4 barely drops at all (85.1% → 85.6%)
- The security gap comes almost entirely from tool-level injection, not environment-level injection: tool-injection ASR for flattened gateways falls from 51.5% to 40.6% as noisy tools accumulate, while hierarchical gateways hold steady near 16% throughout, with the gap never closing at any noisy-tool count; environment-level injection shows no such separation, since a gateway governs which tools enter context but not what the environment returns
- The cost gap is even sharper: under GPT-5.4, a flattened gateway's mean token cost climbs from 8.3k to 233.3k tokens per turn as noisy tools reach 1,500, while a hierarchical gateway only rises from 9.1k to 12.6k
- A hierarchical gateway can collapse entirely under a weaker model: dropping from GPT-5.4 to GPT-5.1 costs the hierarchical architecture a mean 37.6-point drop in task success (vs. 11.9 points for flattened), with one hierarchical gateway (enkrypt) falling from 86.7% to 23.3% because the weaker model couldn't reliably follow the multi-step discovery process and instead started calling hallucinated tools
- Limitation: tested only against OpenAI Agents SDK and OpenClaw harnesses with GPT-5.1/5.4 model strengths, so whether the conclusions generalize to other mainstream agent harnesses like Claude Code's own tool-calling mechanism remains to be verified

### Reviewer's one-line take

A systematic, real-world-scale tool-ecosystem study of how gateway architecture interacts with capability, efficiency, and security, with an actionable, specific finding (the security gap comes from tool-level, not environment-level, injection); but the tested harness and model combinations are limited, so whether the gateway-selection conclusions carry over to other mainstream agent frameworks still needs more verification.

### Take-aways for you

- If you're planning an enterprise agent tool-access architecture and expect the tool pool to keep growing into the hundreds or thousands: favor a hierarchical gateway, especially if your model is already capable enough to reliably complete multi-step lookup flows — you get the security and cost advantages together
- If you're already running a hierarchical gateway with a relatively weak model: check your system for the same failure mode this paper identifies — a weak model under a multi-step discovery flow starting to call hallucinated tools — rather than assuming a hierarchical architecture is inherently safer than a flattened one

---

## Today's takeaway

Previously, it felt safe to assume that a low attack success rate meant an agent had genuinely learned to defend itself, that a user approving a permission rule meant a human was actually gatekeeping, and that picking the right model was the key decision for an agent deployment's security and cost. Today's three papers each puncture one of those assumptions: ASR is low 76-80% of the time simply because the agent never reacted, and it shows the moment you change a system prompt; the content a human approved can itself be the product of adversarial steering, meaning review was already bypassed at the source; and the MCP gateway sitting between an agent and its tools — a layer most teams barely think about — can swing security and cost by tens of multiples through architecture choice alone. Maybe the right question isn't "is this agent safe," but "what is the ruler we're using to measure safety actually measuring."

## References

- [Ignored, Not Refused: What Low Prompt-Injection Success Rates Hide in Small Tool-Using Agents — arXiv 2610.23254](https://arxiv.org/abs/2610.23254)
- [From Approval to Abuse: Privilege Escalation Attacks on Harness-Protected Coding Agents — arXiv 2610.22987](https://arxiv.org/abs/2610.22987)
- [GatewayBench: Unified Capability and Security Evaluation Platform for MCP Gateways — arXiv 2610.23449](https://arxiv.org/abs/2610.23449)
- [InjecAgent benchmark](https://arxiv.org/abs/2403.02691)
- [AgentDojo benchmark](https://arxiv.org/abs/2406.13352)
- [Model Context Protocol, official introduction](https://modelcontextprotocol.io/)
- [arXiv cs.AI new submissions](https://arxiv.org/list/cs.AI/new)
- [arXiv cs.CL new submissions](https://arxiv.org/list/cs.CL/new)
