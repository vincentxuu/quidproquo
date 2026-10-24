---
title: "AI Agent Arxiv Digest — 2026-10-25"
date: 2026-10-25
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers puncture the assumption that 'accurate memory is enough': preferences get remembered but never acted on, correct content gets used after its validity state is corrupted, and once a task is narrow enough for validation gates, multi-agent automation is already shipping in production"
tldr: "MemPABench shows that three retrieval-based memory systems (Mem0, MemOS, RAG) are no better than no memory at all for learning a user's interaction preferences; Governance-State Corruption's six-provider cross-model stress test shows that when memory content is held fixed but the governance state controlling its validity is corrupted, correctness drops by 27.55 points on average and almost fully recovers under oracle-backed enforcement; DoorDash's production report shows that once a task is narrowed to a scope covered by mechanical validation gates (CI, patch coverage, git worktree isolation), multi-agent automation is already running reliably in production — cleaning up 56,000 feature flags at $4.79 and a 90% success rate per flag"
series:
  name: "AI Agent Arxiv Digest"
  order: 154
---

> 🌏 [繁體中文版](/posts/daily/2026-10-25-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers together puncture a common assumption: "if the memory system is accurate enough, the agent will do the right thing." MemPABench first shows the gap sits at the interaction-preference layer — a memory system can store facts correctly yet still fail to learn how a person wants to be helped, and all three retrieval-based memory systems tested are no better than having no memory at all. Governance-State Corruption goes further: even when memory content is completely correct, if the governance state that determines whether it's still valid is corrupted, six different providers' models all keep using the corrupted memory anyway — correctness drops by 27.55 points on average. Both papers point to the same thing: memory failures aren't the intuitive "can't store it, can't retrieve it" — they hide in two subtler gaps: "remembered but never acted on" and "content is fine but the validity state is wrong." The third paper, DoorDash's production report, offers the counterpoint: once a task is narrowed to a scope fully covered by explicit validation gates (CI passing, ≥95% patch coverage, git worktree isolation), multi-agent automation is no longer a research demo — it's a system reliably shipping production pull requests across 56,000 feature flags. Put together: the semantic layer of memory is still stepping on landmines, but once a task is cut narrow enough and the validation gates are tight enough, agent automation already works today.

```diagram
title: Memory that looks accurate can still fail in two invisible places
desc: A user's interaction preferences and a memory's governance state are two hidden dimensions beyond memory content itself — MemPABench exposes preferences that are remembered but never acted on, Governance-State Corruption exposes content that's correct but still gets used after its governance state is corrupted; on the right, DoorDash shows that once a task is narrowed to a scope covered by validation gates, agent automation is already shipping.
caption: Simplified: the two papers on the left expose two different failure points on the same memory pipeline; the case on the right shows that narrowing task scope lets validation gates absorb the remaining uncertainty by themselves.
---
<svg viewBox="0 0 640 420">
  <path class="dg-line" d="M156 90H172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M156 180H172" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M296 90H312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M296 180H312" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M454 135H470" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--link" x="16" y="58" width="140" height="64" rx="6"/>
  <text class="dg-label" x="86" y="81" text-anchor="middle" dominant-baseline="central">Memory content</text>
  <text class="dg-sub" x="86" y="101" text-anchor="middle" dominant-baseline="central">facts / preferences</text>

  <rect class="dg-box dg-box--link" x="16" y="148" width="140" height="64" rx="6"/>
  <text class="dg-label" x="86" y="171" text-anchor="middle" dominant-baseline="central">Governance state</text>
  <text class="dg-sub" x="86" y="191" text-anchor="middle" dominant-baseline="central">still valid?</text>

  <rect class="dg-box dg-box--accent" x="172" y="58" width="124" height="64" rx="6"/>
  <text class="dg-label" x="234" y="81" text-anchor="middle" dominant-baseline="central">MemPABench</text>
  <text class="dg-sub" x="234" y="101" text-anchor="middle" dominant-baseline="central">remembered, never acted on</text>

  <rect class="dg-box dg-box--accent" x="172" y="148" width="124" height="64" rx="6"/>
  <text class="dg-label" x="234" y="171" text-anchor="middle" dominant-baseline="central">Governance-State</text>
  <text class="dg-sub" x="234" y="191" text-anchor="middle" dominant-baseline="central">content fine, used anyway</text>

  <rect class="dg-box" x="312" y="90" width="142" height="100" rx="6"/>
  <text class="dg-label" x="383" y="118" text-anchor="middle" dominant-baseline="central">Looks the same</text>
  <text class="dg-sub" x="383" y="140" text-anchor="middle" dominant-baseline="central">from outside</text>
  <text class="dg-sub" x="383" y="160" text-anchor="middle" dominant-baseline="central">metrics look fine</text>

  <rect class="dg-box dg-box--store" x="470" y="90" width="150" height="100" rx="6"/>
  <text class="dg-label" x="545" y="118" text-anchor="middle" dominant-baseline="central">DoorDash case</text>
  <text class="dg-sub" x="545" y="140" text-anchor="middle" dominant-baseline="central">narrow scope + CI /</text>
  <text class="dg-sub" x="545" y="160" text-anchor="middle" dominant-baseline="central">coverage gates = shippable</text>

  <line class="dg-rule" x1="16" y1="320" x2="624" y2="320"/>
  <text class="dg-tag" x="16" y="344" dominant-baseline="central">Legend</text>
  <text class="dg-small" x="16" y="368" dominant-baseline="central">Left two rows: two hidden failure dimensions of memory, both invisible to surface-level metrics</text>
  <text class="dg-small" x="16" y="390" dominant-baseline="central">Right: once the task fits inside what the validation gates can fully cover, the uncertainty is boxed in</text>
</svg>
```

## Terms worth knowing before this one

| Term | Plain explanation |
|---|---|
| Interaction preference | How a user wants to be served — whether to confirm first, reply briefly or at length, reach out proactively or wait — a different memory dimension from "what facts were remembered" |
| Governance state | The state that determines whether a memory item is still usable right now — deleted, superseded, expired — a completely separate question from whether the content itself is accurate |
| Governance-state corruption | The memory content hasn't changed, but the state that controls whether it's allowed into the model's visible context has been corrupted, so the agent ends up acting on an invalid memory |
| Oracle-backed enforcement | Repairing a corrupted governance state using an externally known correct state, used to measure an upper bound on "how much could be recovered if the governance state were correct" — not evidence the agent can find and fix it on its own |
| Validation gate | A mechanical check that blocks a bad result before an agent's output ships — e.g. whether CI passes, whether code coverage meets a threshold — not something the model judges for itself |

---

## Paper One｜An agent that remembers facts can still forget how you want to be served

**Why Bother Me Again? Benchmarking Personal Agent Memory for Interaction Preferences**
Jialin Li, Zhenhao Chen, Hanjun Luo, Hanan Salam (New York University Abu Dhabi) · arxiv: 2610.30485

Links: [arxiv](https://arxiv.org/abs/2610.30485) · [alphaxiv](https://www.alphaxiv.org/abs/2610.30485)

### TL;DR

MemPABench runs 4 simulated users through 4 months and 99 sessions with a personal agent, and finds that all three retrieval-based memory systems tested (Mem0, MemOS, simple RAG) perform about as well as no memory at all for learning interaction preferences (PSA 49.9–50.0% vs. 49.6% for No Memory); only file-based memory helps (+9.6 points), but at the cost of applying preferences across the wrong contexts.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar API returned HTTP 429 (rate limit, no key) throughout this run — given the publication date, citation data would be negligible regardless |
| Institution | New York University Abu Dhabi |
| Community signal | Not listed on HF Daily Papers (checked 2026-10-22 and 2026-10-23); official GitHub repo + HuggingFace dataset already public but too new to have star counts |
| Credibility | Pass — 4 memory systems × 4 model backbones × 4 users × 3 repeats, with 95% CIs, plus No Memory / Oracle reference arms and a random baseline |
| Evidence maturity | Substantial — the core finding holds consistently across every tested backbone, and is backed by an additional breakdown of whether the relevant preference actually reached the model's input |
| Reproducibility | Full artifacts — code (MIT), user personas, and complete interaction traces (CC-BY-4.0) are all public on GitHub/HuggingFace and rerunnable |
| Why this one | Direct — it tests whether memory can change an agent's interaction behavior, not plain fact recall; this is the memory dimension most directly relevant to personal-assistant products |
| Novelty | Substantive — existing memory benchmarks mostly test factual recall and personalized QA; this is the first systematic test of learning and updating interaction preferences over time |
| Today's importance | High — applies to any personal-assistant product that claims to "remember how you like to be helped"; the gap it reveals is more hidden than surface-level memory accuracy |
| Practical link | Clear — names the specific gap in retrieval-based memory (the Mem0/MemOS/RAG class of architectures); product teams can check their own memory systems against it directly |
| Editorial confidence | High — the claims used here map directly onto the paper's published quantitative results and confidence intervals, with no extrapolation beyond what was tested |
| Recommendation | Must-read — teams building personal-assistant or support-agent products with long-term memory |
| Primary limitation | Only 4 simulated users and 4 LLM backbones; whether the simulated users' feedback patterns capture real-user diversity hasn't been validated |

### Field context

Past work on agent memory mostly focused on whether the agent remembers facts — things the user said, asked, or delegated. But what a personal assistant really needs to learn is often never stated explicitly: interaction habits only revealed through reactions — does this person like to be asked first, or prefer a short reply over a detailed one. No existing benchmark had systematically tested this layer.

### Mid-level walkthrough

- **The problem**: imagine your personal assistant asks "are you sure?" every time it books a restaurant, even after you've said yes ten times in a row; or every proactive message from it is a long explanation, even though you've clearly shown you just want one line. These small frictions add up, turning an assistant meant to save effort into a burden — the question is how it learns to stop doing that.
- **The method**: MemPABench has 4 simulated users, each carrying 14 interaction preferences across work/personal contexts, interact with a personal agent over 4 months and 99 sessions. The users never state their preferences directly — they only reveal them through reactions (a correction here, tolerating a shortcut there), and each user changes 5 preferences along the way to test whether memory updates. A set of probes then checks whether the agent picked the right interaction setting and actually followed through on it.
- **Why it matters**: all three retrieval-based memory systems were no better than no memory at all — and the paper traces why: under the three retrieval systems, a relevant preference actually reached the model's input in only 7 out of 334 judged probes, versus 60 out of 111 under file-based memory. In other words, the problem isn't failing to store the right thing — it's storing it and never calling it back up.

### Deep-dive points

- Preference Selection Accuracy (PSA) for the three retrieval-based memory systems (Mem0 v2.0.2, MemOS v2.0.15, simple RAG) is 50.0%, 50.0%, and 49.9% respectively; No Memory is 49.6%, and random selection is 45.2%
- File memory raises PSA by 9.6 points (95% CI [+3.9, +15.6]), but Context Sensitivity (whether the same preference is correctly tracked separately for work vs. personal contexts) drops from 21.8% under No Memory to 14.4% — it remembers the preference but applies it in the wrong context
- Even under the Oracle condition (placing the correct setting exactly where retrieved memory should surface it), the agent's delivered behavior matched the setting correctly in only 60% of cases for the 5 hardest settings, versus 95% for the other 25 ⚠️ (Oracle is the paper's own idealized upper bound, not evidence any real memory system can reach it)
- Practical threshold: treat "a user's interaction habits" as a memory dimension as important as factual memory in both evaluation and system design — don't assume high retrieval accuracy will solve this automatically
- Relation to mainstream frameworks: Mem0, MemOS, and RAG are all memory backends already common in production; the paper tests these existing architectures directly, not self-built strawman baselines
- Limitation: the simulated users, though built on rich personas, are still not real people — whether the diversity of their preference expression matches real users remains to be validated

### Reviewer's one-line take

Testing interaction-preference memory with a 4-month, multi-preference-change longitudinal design is currently the most rigorous method for this question; but the subjects are still simulated users, and whether this gap fully transfers to real product usage still needs follow-up validation with real users.

### Takeaways for you

- If you're building a personal-assistant or support-agent product: don't just check factual recall accuracy — separately test whether a stored preference actually gets called back up and used; this paper shows the two can be completely decoupled
- If you're evaluating file-based memory: watch for it misapplying preferences across contexts; before shipping, add at minimum a layer tagging which context a given preference applies to

---

## Paper Two｜Memory content hasn't changed, but once "is it still valid" is corrupted, the model uses it anyway

**Governance-State Corruption in Long-Term Memory for LLM Agents: A Cross-Model Stress Test**
Bowen Liu, Youting Wang, Bonan Shen, Dingyan Shang (Independent Researchers) · arxiv: 2610.30698

Links: [arxiv](https://arxiv.org/abs/2610.30698) · [alphaxiv](https://www.alphaxiv.org/abs/2610.30698)

### TL;DR

With memory content and the task held fixed, corrupting only the governance state that determines "is this memory still valid to use" drops correctness by an average of 27.55 points across six LLM providers; restoring the known-correct governance state recovers nearly all of it — showing this is a failure mode entirely distinct from, but just as damaging as, memory retrieval accuracy.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | arXiv preprint (not peer-reviewed) |
| Citation velocity | Published 3 days ago; Semantic Scholar API returned HTTP 429 (rate limit) throughout this run — given the publication date, citation data would be negligible regardless |
| Institution | Independent Researchers (all 4 authors list no institutional affiliation) |
| Community signal | Not listed on HF Daily Papers; no Papers with Code repo found |
| Credibility | Pass — a controlled experiment across six providers × 731 benchmark-grounded cases × 2,080 matched fault pairs, with 95% bootstrap CIs, cross-checked against direction-consistent results from an independent native-style subsample |
| Evidence maturity | Preliminary — the direction is consistent and doubly validated, but the authors themselves disclose that the frozen-proxy score is not a validated semantic-correctness measure (the LongMemEval subsample's scorer agreement is only 62.5%), so claim strength must be lowered |
| Reproducibility | Partial artifacts — the text names several internal audit scripts by path, implying a complete internal implementation, but no public code repository link was found in the sections read |
| Why this one | Direct — it exposes a failure dimension completely distinct from retrieval accuracy; any team running multi-tenant or long-term memory systems should be testing for this separately |
| Novelty | Substantive — formally separates "memory content" from "memory governance state" as two independent variables in a controlled experiment, rather than conflating both into a single retrieval-accuracy metric |
| Today's importance | High — multi-tenant, cross-session memory systems are being deployed at scale, but most memory evaluation only checks retrieval accuracy; no one had systematically stress-tested what happens when governance state is corrupted |
| Practical link | Clear — for any memory system with deletion, update, or permission-change mechanics, this paper offers a concrete stress-test methodology that can be borrowed directly |
| Editorial confidence | Medium — the direction is consistent and doubly validated, but the authors' own disclosed scorer-validity gap means the absolute numbers can't be taken at face value; this only supports the narrower claim that "the direction is real" |
| Recommendation | Must-read — teams designing multi-tenant or deletion/update-capable long-term memory systems; skim — scenarios with a single user where memory content only ever accumulates and never becomes invalid |
| Primary limitation | The full-cohort proxy-score effect size (-27.55 points) is a frozen-proxy score, not a validated semantic-correctness measure; all 380 deletion-event cases come from Memora alone, so event type and data source can't be disentangled |

### Field context

Past efforts to improve agent long-term memory mostly focused on making the content itself more accurate — better retrieval, fresher information, more consistent conflict resolution (as in systems like MemGPT, Mem0, GateMem). This paper points to an overlooked dimension: a memory item can be entirely accurate in content yet still get misused because its validity state has been corrupted — e.g. information that should be marked deleted or expired instead gets treated as current.

### Mid-level walkthrough

- **The problem**: imagine an assistant remembers your "weekly to-do list" has two items. The list content has no errors at all, but if the state information that determines "which items are still currently valid" gets corrupted — one item was actually marked complete by you, but that marking is lost — the assistant will keep reminding you of an item that's actually done, even though the task content it remembers is word-for-word correct.
- **The method**: the researchers took 731 cases from three existing benchmarks (LongMemEval, Memora, OAKS) and built three versions of each: clean (correct governance state), corrupted (one of four injected faults — missing, stale, flipped, or conflicting), and enforced (restored to the known-correct state). Memory content, task, and scoring criteria stay identical across all three versions — only the governance state differs. Six different providers' models (DeepSeek, GPT, Claude, Gemini, Kimi, Grok) were then run on all three versions to compare correctness.
- **Why it matters**: this shows that testing memory systems purely on "did retrieval find the right content" isn't enough — you also need to test "if the state controlling whether this memory should be used goes wrong, will the agent use it anyway." This is a blind spot in current evaluation for any memory system with deletion, expiration, or permission-revocation mechanics.

### Deep-dive points

- All six providers show a significant negative effect on the frozen-proxy full-cohort score, averaging -27.55 points (ranging from -18.47 for Grok 4.3 to -31.88 for Gemini 3 Flash); restoring the known-correct state recovers an average of +27.51 points
- An independently drawn 298-triplet native-style subsample (238 distinct cases) confirms the same direction: LongMemEval binary correctness drops 40.54 points (95% CI [30.32, 50.71]), Memora's FAMA score drops 30.60 points (95% CI [23.31, 37.69])
- Of the four fault types, "stale" causes the largest damage across every provider (-32.19 to -58.40 points), still outpacing "missing" faults by 12.25–13.68 points even after controlling for shared base cases ⚠️ (this is the frozen-proxy proxy score the authors repeatedly flag in the text as not a validated semantic-correctness measure — the absolute numbers shouldn't be extrapolated directly to real-world usage loss)
- Recovery after enforcement isn't a perfect return to baseline: Memora's post-enforcement residual is -4.35 points (95% CI excludes 0), showing that even with the governance state fixed, model behavior doesn't snap back 100%
- Practical threshold: system design needs to explicitly separate "memory content" from "memory governance state (deletion/expiration/permissions)" as two distinct fields, and run fault-injection tests specifically on the governance state — retrieval-accuracy evaluation alone won't cover it
- Limitation: all 380 deletion-event cases among the 731 come from Memora alone, so event type (deletion/stale/update) and data source are fully confounded and can't be separated

### Reviewer's one-line take

Unusually, this paper repeatedly and proactively flags in its own text what each number cannot be interpreted to mean — a methodological self-restraint worth crediting. The core direction (governance-state corruption systematically harms correctness, and it's recoverable) holds up under dual validation; but the gap between the frozen-proxy score and semantic correctness means readers shouldn't take the absolute -27.55 figure as a precise estimate of production-environment loss.

### Takeaways for you

- If you run a multi-tenant or deletion/update-capable long-term memory system: build a separate "governance-state fault injection" test suite; don't rely on retrieval-accuracy evaluation alone to cover memory system reliability
- If you're evaluating a memory vendor or framework: ask explicitly how it handles "memory that's invalid but still present" — this paper shows all six mainstream LLMs tested are similarly fragile on this dimension

---

## Paper Three｜Once a task is narrow enough for validation gates, multi-agent automation ships in production and makes money

**Automating Feature Flag Cleanup at Scale with Multi-Agent LLM Systems: An Industrial Experience at DoorDash**
Atharv Chandratre, Jai Datar (DoorDash, Inc.) · arxiv: 2610.31351

Links: [arxiv](https://arxiv.org/abs/2610.31351) · [alphaxiv](https://www.alphaxiv.org/abs/2610.31351)

### TL;DR

DoorDash built a multi-agent system — Claude Sonnet 4.6 for orchestration, Claude Opus 4.6 for code modification — that achieves a 90% usable success rate on 50 real stale feature flags, at an average of 13.8 minutes and $4.79 per flag, with zero code bugs or regressions introduced across the whole evaluation; the system's reliability boundary is one of completeness, not correctness.

### Editorial judgment

| Dimension | Judgment |
|---|---|
| Venue | IEEE ICSME 2026 Industry Track (accepted, not a plain preprint) |
| Citation velocity | Published 3 days ago; Semantic Scholar API returned HTTP 429 (rate limit) throughout this run — given the publication date, citation data would be negligible regardless |
| Institution | DoorDash, Inc. |
| Community signal | DoorDash's own engineering blog predates the paper (2026-08-24); covered by InfoQ (2026-09-20); not listed on HF Daily Papers |
| Credibility | Pass — complete evaluation methodology on 50 real production cases, with complexity tiers, CI pass rate, and cost/time distributions all given as concrete numbers, plus an honest limitations section and specific technical reasons why existing rule-based tools don't apply |
| Evidence maturity | Preliminary — real production cases rather than synthetic tests is a plus, but the sample size (50) is modest, scoped to a single company and single language (Kotlin), with no direct quantitative comparison against existing rule-based tools |
| Reproducibility | Not provided — the system and data are DoorDash's internal production environment; no code or dataset released (a normal limitation for an industry report, not a deliberate withholding) |
| Why this one | Direct — offers a counterpoint perspective to today's first two memory-blind-spot papers: once a task is narrowed enough, multi-agent systems are already reliably shippable |
| Novelty | Adaptation — the system design itself (orchestrator + parallel removal agents + git worktree isolation) extends existing multi-agent orchestration patterns; the novelty is landing it on a real-world scenario rule-based tools couldn't handle, with a complete quantitative evaluation |
| Today's importance | Medium — for engineering teams evaluating whether to deploy multi-agent automation, this is a rare production-grade quantified case study with a complete failure analysis |
| Practical link | Clear — all three safety mechanisms (git worktree isolation, patch-coverage threshold, one-hour timeout) are concrete designs directly transferable to other multi-agent automation scenarios |
| Editorial confidence | High — the claims used here rely only on quantitative results the paper explicitly discloses, alongside its own disclosed external-validity limits (single company, single language); claim strength matches the evidence |
| Recommendation | Must-read — engineering teams evaluating whether to put multi-agent automation into production; skim — simple automation scenarios needing only a single agent with no parallel coordination |
| Primary limitation | Only 50 cases, scoped to DoorDash's own Kotlin codebase; complexity labels were assigned post hoc by the authors; whether this generalizes to other companies' feature-flag architectures remains to be seen |

### Field context

Feature flag cleanup has long been a widely-acknowledged-as-annoying, low-priority piece of technical debt for engineering teams — prior research found roughly 25% of flags in open-source projects persist for over 8 years. Existing rule-based tools (like Uber's Piranha) use AST pattern matching to automate cleanup, but break down against dependency-injected wrapper functions, non-boolean flags, and cross-file cleanup requirements — exactly DoorDash's situation.

### Mid-level walkthrough

- **The problem**: DoorDash has over 56,000 feature flags spread across 623 repositories, with 1,659 currently stale yet still present, each manual cleanup taking one to two hours, while roughly 2,300 new flags are created every month — the backlog grows faster than the team can clear it.
- **The method**: the system runs in two phases. In Phase 1, an orchestrator agent reads Jira tickets and queries the experimentation platform via MCP to get a flag's actual live rollout state (rather than trusting the code's default value), then generates a confirmation report. After an engineer confirms the target value, Phase 2 spawns a dedicated removal agent for each flag, each operating in an isolated git worktree to edit code, update tests, and run the build and static analysis in parallel — all gates must pass before a PR opens.
- **Why it matters**: this demonstrates that the combination of "narrowed task scope + mechanical validation gates (CI passing, coverage thresholds, worktree isolation)" can box an LLM's uncertainty into a controllable range — the paper specifically notes that across all 50 cases, not a single one was rejected for a code bug or regression; every case needing human intervention was a completeness problem ("missed a few lines"), not a correctness problem ("changed something wrong").

### Deep-dive points

- Of 50 stale feature flag cleanups, 31 (62%) succeeded on the first attempt, 14 (28%) needed a minor fix, and 5 (10%) failed, for an overall usable cleanup rate of 45/50 (90%)
- CI passed on the first attempt for 88% of cases; all 6 initial CI failures were coverage-related, none due to incorrect code changes
- Average cost per cleanup was 13.8 minutes (median 12.3) and $4.79 (median $3.49), against the team's internal estimate of one to two hours of manual effort — a clear time and cost saving
- By complexity tier: simple flags (n=6) achieved 100% first-shot success; medium complexity (n=18) achieved a 94% overall cleanup rate; complex flags (n=26, spanning 5+ layers of method calls, nested conditionals, and significant test changes) still achieved an 85% overall cleanup rate
- Practical threshold: requires a reliable source for live flag rollout state (here, an MCP integration with the experimentation platform), worktree isolation for parallel edits, and mechanical validation gates before PR creation — missing any one of the three raises automation risk
- Limitation: the evaluation covers a single company and language (Kotlin), using direct API-call-style flags rather than dependency-injected wrappers; rule-based tools like Piranha may be more applicable elsewhere, so results shouldn't be generalized directly to other languages or flag patterns

### Reviewer's one-line take

Splitting model roles by task nature (a cheaper model for orchestration, a more expensive one for code modification) combined with mechanical validation gates rather than relying on the model to police itself is a solid and honest engineering report; but the sample size and scenario are both limited to a single company and language, and whether this generalizes to other teams' flag architectures is something the paper itself explicitly says still needs validation.

### Takeaways for you

- If you're evaluating whether to let a multi-agent system touch production code: first check whether the task can be narrowed to a scope fully covered by mechanical validation gates (CI, coverage, isolated environments), rather than letting the model operate freely
- If your team has a similar technical-debt cleanup need: this paper's three-part design — "orchestrator queries real state + parallel cleanup agents + validation gates as the backstop" — is a rare production-grade reference architecture

---

## Today's takeaway

I used to think the problem with agent memory was mostly "can't store it, can't retrieve it." Today showed two subtler cracks instead: a preference gets stored correctly but never called back up to act on (MemPABench), and content stays correct while the state that governs whether it's still usable gets corrupted and used anyway (Governance-State Corruption). But the same day's DoorDash case supplies the other half of the picture — this uncertainty isn't unmanageable; once a task is narrowed to a scope mechanical validation gates can fully cover, multi-agent automation already ships reliably and makes money today, without waiting for the semantic layer of memory to be fully solved.

## References

- [Why Bother Me Again? Benchmarking Personal Agent Memory for Interaction Preferences (arXiv:2610.30485)](https://arxiv.org/abs/2610.30485)
- [MemPABench — alphaxiv](https://www.alphaxiv.org/abs/2610.30485)
- [MemPABench — official repository and results](https://github.com/mempabench/mempabench)
- [Governance-State Corruption in Long-Term Memory for LLM Agents: A Cross-Model Stress Test (arXiv:2610.30698)](https://arxiv.org/abs/2610.30698)
- [Governance-State Corruption — alphaxiv](https://www.alphaxiv.org/abs/2610.30698)
- [Automating Feature Flag Cleanup at Scale with Multi-Agent LLM Systems: An Industrial Experience at DoorDash (arXiv:2610.31351)](https://arxiv.org/abs/2610.31351)
- [DoorDash feature flag cleanup — alphaxiv](https://www.alphaxiv.org/abs/2610.31351)
- [DoorDash engineering blog: Automating Feature-Flag Cleanup at Scale with a Multi-Agent LLM System](https://careersatdoordash.com/blog/automating-feature-flag-cleanup-at-scale-with-a-multi-agent-llm-system/)
