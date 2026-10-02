---
title: "AI Agent Arxiv Digest — 2026-10-01"
date: 2026-10-01
category: daily
tags: [ai-agent, arxiv, daily]
lang: en
description: "Today's three papers circle the same question — how thick does an agent's harness need to be: JAZ matches specialized memory and self-improvement systems with a single primitive, Harness-Zero shows a custom harness's behavior can be distilled into model weights and then removed, and TraceDance uses 252,557 real deployment traces to show that regardless of harness thickness, today's frontier models still routinely skip the checks they should run before acting"
tldr: "JAZ uses a single invoke primitive to beat the specialized memory system Letta at under half the cost on a long-recall task; Harness-Zero distills a custom harness's behavior into model weights, and removing the harness afterward scores higher than keeping it attached (23.3% to 44.3%); TraceDance builds benchmarks from 252,557 real deployment sessions and finds that nine frontier LLMs reliably issue valid tool calls (67.9%) but only perform a required check before acting 8.1% of the time, with commit hygiene at just 0.9%"
series:
  name: "AI Agent Arxiv Digest"
  order: 130
---

> 🌏 [中文版](/posts/daily/2026-10-01-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers read like two sides of the same debate: how thick does an agent's harness — the external system that manages tool use and context around the model — actually need to be? JAZ argues the answer can be "barely any": using a single primitive called invoke, with no external memory or self-improvement system attached, it beats two specialized frameworks on their own turf. Harness-Zero offers a different route to thinness — let a custom harness teach the model first, then remove the harness once its benefits have been distilled into the weights. But TraceDance pours cold water on both: building benchmarks from over 252,557 real deployment sessions, it shows that regardless of how thick or thin your harness is, today's frontier models still pass basic pre-action checks only in the single digits to low teens. Put together, the three suggest there may be no settled answer to how thick a harness should be — but there is now a clear, measured gap in whether the checks that should happen actually do.

## Terms worth knowing before reading

| Term | Plain explanation |
|---|---|
| Harness | The external program system wrapping an LLM that manages tool calls, context, and environment interaction — not the model itself |
| invoke primitive | JAZ's single LLM-call primitive; the LLM can write arbitrary executable code and recursively call itself through it |
| Distillation | Transferring the behavior induced by some external mechanism (here, a custom harness) into model weights via training data, so the model no longer needs that mechanism to exhibit the same behavior |
| Decision-Point Continuation | Taking the full context immediately before a key decision point from a real trace, unchanged, and having the model under test continue from there before scoring it |
| LoRA supervised fine-tuning | A fine-tuning method that only adjusts a small set of low-rank parameters, far cheaper than full-parameter fine-tuning |
| Rubric-based grading | Scoring against a fixed rubric written for a specific behavior, rather than comparing to a reference answer |

---

## Paper One | JAZ: One invoke Primitive Matches Specialized Memory and Self-Improvement Systems

**Harness as a Language: A Minimalist Agent Framework With Maximal Expressivity**
Zhening Li, Joshua Liu, Mateja Vukelic et al. (MIT CSAIL) · arxiv: 2609.26891

Links: [arxiv](https://arxiv.org/abs/2609.26891) · [alphaxiv](https://www.alphaxiv.org/abs/2609.26891)

### TL;DR

Using only a single primitive called invoke, with no external memory or self-improvement system attached, JAZ beats the specialized memory system Letta (MemGPT) on a StuLife task that requires recall beyond the context window, at under half the cost; on AppWorld's continual self-improvement task, it likewise beats the specialized framework ACE.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 9 days ago; Semantic Scholar was rate-limited (429) this round, citation count unavailable |
| Institution | MIT CSAIL (with several independent researchers as co-authors) |
| Community response | A third-party reimplementation (AIMentalModel/dsh-jaz) appeared within a week of posting; featured in a DAIR.AI Academy paper digest; DAIR.AI founder @omarsar0 posted a summary thread |
| Credibility | Pass — both case studies have named baselines (Letta, ACE, CodeAct+subagents) with mean ± standard error over 3 independent runs |
| Evidence maturity | Substantial — long-horizon recall and continual self-improvement are each tested as an independent scenario with clear baseline comparisons and cost reporting |
| Reproducibility | Partial artifacts — no official code released yet, but full prompts and hook implementations are given in the appendices; a community reimplementation already exists |
| Why this paper | Direct — directly challenges the hot question of how thick a custom agent harness needs to be |
| Direction novelty | Substantive — replaces an entire external memory/self-improvement stack with a single primitive |
| Today's importance | High — two other independent teams published on the same harness-thickness question this same week, marking this as a converging hot topic |
| Practical link | Clear — gives a quantified cost/benefit basis for deciding whether to bolt on systems like Letta or ACE |
| Editorial confidence | High — sufficient to support the bounded claim that "a single primitive can match specialized systems in specific long-recall and self-improvement scenarios" |
| Recommendation | Must-read — teams choosing a long-horizon agent framework or memory system |
| Primary limitation | Validated on only two benchmarks, both skewed toward long-horizon memory/self-improvement scenarios; unclear whether this generalizes to tasks needing many specialized tools |

### Background

Modern LLM agents are built around the "agent loop": the model sits in an environment exposing tools and repeatedly decides by calling tools and observing results. But handling tasks that exceed the context window, or letting an agent get better at a task over repeated attempts, has typically meant bolting on specialized systems — a memory database like Letta (MemGPT), or a continual self-improvement framework like ACE — each requiring its own engineering and upkeep.

### Mid-Level Walkthrough

- **The problem**: Imagine an agent working a task that spans an entire semester, running through several context windows along the way; or you want an agent to get better each time it repeats a similar task, without hand-rewriting its prompt every time. The usual fix is bolting on a dedicated memory database, or a dedicated "self-improvement" framework.
- **The method**: JAZ gives the agent a single function called invoke; the LLM decides at each call how to implement it, can write arbitrary executable code including recursive calls to invoke, and everything visible to it — including interaction history — is just a regular variable in the code environment that can be inspected, filtered, and passed along. Long-horizon recall relies on "tail-recursive delegation": when the context window is about to fill up, the entire history is delegated unchanged to a subagent to continue, with no dedicated compression or summarization system. Continual self-improvement lets the top-level invoke act as a "meta-agent", directly adjusting a lower-level agent's prompt and skills as ordinary code variables, without a separate optimization framework.
- **Why it matters**: Both case studies tackle exactly the problems specialized systems were built to solve, and JAZ beats both control conditions without adding any specialized mechanism — suggesting the issue may not be "needing more engineering" but "today's general-purpose primitives not being general enough."

### Deep-Dive Points

- Across all 939 scored StuLife tasks: JAZ invoke reaches 72.6%±0.1 pass / 81.6%±0.1 score, versus Letta's 70.9%±0.5 / 81.0%±0.5
- On the far-recall subset (207 tasks requiring recall of information from over 50 tasks earlier): JAZ invoke reaches 69.9%±1.8 pass / 73.6%±1.5 score versus Letta's 61.8%±2.3 / 67.0%±2.4 — at a cost of $18.3 versus Letta's $42.1 (about 44% of the cost)
- The plain CodeAct+subagents baseline, with no dedicated memory mechanism, scores only 20.6%-32.0% pass on the far-recall subset, showing performance drops clearly without a mechanism for long-range dependencies
- Per the paper's abstract, on AppWorld's 417-task continual self-improvement setup, JAZ invoke beats the specialized framework ACE by about 4 percentage points at a lower cost
- Adoption signal: no official code release yet, but a community reimplementation (AIMentalModel/dsh-jaz) appeared within a week, suggesting the barrier to entry isn't high
- Limitation: both benchmarks skew toward long-horizon memory and self-improvement scenarios; whether this generalizes to tasks needing many specialized tools or complex toolchains remains untested

### Reviewer's One-Line Take

Having the same model play both student and supervisor rules out the "swap in a stronger model" confound, and reporting mean ± standard error over 3 independent runs is a level of rigor uncommon in "less is more" papers; but both benchmarks skew toward long-horizon memory and self-improvement, so it's too early to say "no scenario needs specialized systems."

### Your Take-Away

- If you're deciding whether to bolt on a specialized memory system like Letta/MemGPT: first check whether your task genuinely needs cross-window retrieval — for ordinary long conversations, this paper suggests using the code environment's own variables well may beat an external database
- If you're designing an agent self-improvement mechanism: JAZ writes "a meta-agent adjusting a sub-agent's inputs" directly as a recursive call, with no separate optimization framework needed — a pattern worth borrowing directly

---

## Paper Two | Harness-Zero: Distill a Custom Harness's Behavior Into Model Weights, Then Remove the Harness

**Harness-Zero: Harness Distillation via Agent-as-Harness**
Haoran Ye, Yuxing Lu, Haonan Dong et al. (State Key Laboratory of General Artificial Intelligence, Peking University) · arxiv: 2609.24974

Links: [arxiv](https://arxiv.org/abs/2609.24974) · [alphaxiv](https://www.alphaxiv.org/abs/2609.24974)

### TL;DR

Using a "harnessing agent" to distill a custom harness's behavior into model weights, then removing the custom harness at deployment, a 9B model's macro-average across three task domains rises from 23.3% to 44.3% — even surpassing the 41.7% it reaches with the harness still attached.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 10 days ago; Semantic Scholar was rate-limited (429) this round, citation count unavailable |
| Institution | State Key Laboratory of General Artificial Intelligence, School of Intelligence Science and Technology, Peking University |
| Community response | Official repo (github.com/metaevo-ai/harness-zero) confirmed public as of today; added to two independent "awesome-rsi" (recursive self-improvement) community reading lists on GitHub |
| Credibility | Pass — three task domains, multiple baselines (including two general-purpose harnesses, DeepAgents and Claude Code, as controls), and a dedicated ablation table isolating the signal source |
| Evidence maturity | Substantial — covers spreadsheet manipulation, interactive tool use, and chemical retrosynthesis, plus a full ablation of the distillation signal |
| Reproducibility | Full artifacts — official code is now public (this signal was newly confirmed this round; it was not found as of the 09-27 re-check) |
| Why this paper | Direct — directly addresses whether a custom harness's benefits can survive without the harness itself at deployment |
| Direction novelty | Substantive — turns harness optimization from "maintaining external code" into "internalizing into model weights" |
| Today's importance | High — belongs to the same harness-thickness debate as JAZ, and today's re-check fills in the code-release signal that was previously missing |
| Practical link | Clear — gives platforms maintaining many domain-specific harnesses a concrete path to consolidating that engineering complexity |
| Editorial confidence | High — sufficient to support the bounded claim that "a custom harness's procedural behavior can be distilled into weights and the harness removed" |
| Recommendation | Must-read — teams maintaining multiple domain-specific harnesses and weighing deployment complexity |
| Primary limitation | Deep domain knowledge (such as molecular validation logic) is harder to internalize than procedural behavior; the distilled model still trails the harness-attached version on USPTO |

### Background

An agent harness — the external system managing tool use, context, and environment interaction — is one of the main levers for improving agent performance today, but a custom harness's gains stay tied to that harness at deployment: switch domains or models, and you often need to re-tune or maintain an entire separate harness. Recent methods like Meta-Harness automate this optimization process, but what gets optimized is still external code, not the model itself.

### Mid-Level Walkthrough

- **The problem**: Imagine an agent handling spreadsheet tasks paired with a custom harness that helps it remember which cells have been edited and how to verify results — it performs well. But swap in a different deployment environment and remove that harness, and performance collapses back to baseline, because all the benefit was tied to that external tool.
- **The method**: Harness-Zero has a "harnessing agent" play the role of the custom harness, reviewing and correcting a student agent's responses (running under the plain harness) before execution, turning the guidance the custom harness would have provided into training demonstrations. LoRA supervised fine-tuning then internalizes these corrected behaviors into model weights; once training is done, both the custom harness and the harnessing agent can be removed.
- **Why it matters**: This means the performance gains from a harness don't necessarily need to keep depending on that harness at deployment — you can use it to "teach" and then retire it. For agent platforms maintaining a pile of domain-specific harnesses, this is a path toward consolidating engineering complexity back into the model itself.

### Deep-Dive Points

- Inference-time comparison (averaged across 3 domains × 2 models): agent-as-harness with adapted guidance reaches 81.1%, versus 78.1% for meta-harness (mounting the evolved harness directly) and 68.6% for the plain harness; stripping out the guidance content and keeping only the harnessing agent's review action drops the average to just 69.2%, showing that "having someone review" alone explains little of the gain
- After distillation with the harness removed: the 9B model's macro-average across three domains rises from a 23.3% baseline to 44.3%, surpassing the 41.7% reached with the harness still attached; swapping in two general-purpose harnesses, DeepAgents and Claude Code, instead drops the 9B model's performance to 20.5% and 15.9% respectively — showing that attaching just any harness doesn't help
- USPTO retrosynthesis is the exception: the distilled model reaches 30.0%, still trailing the 38.0% reached with the harness attached; the authors attribute this to molecular validation requiring deeper domain knowledge that's harder to internalize than procedural behavior
- Ablations further isolate the mechanism: distilling directly from a teacher model's trajectories under the plain harness barely helps at all; the trajectories must be the ones reviewed by the harnessing agent for the effect to hold
- Adoption signal: when this paper first entered this site's candidate pool on 09-23, official code had not yet been released; this round's re-check confirms github.com/metaevo-ai/harness-zero is now public, upgrading reproducibility from "not provided" to "full artifacts"
- Limitation: requires a sufficiently capable harnessing model to produce a useful review signal; with a weaker harnessing agent, review can become harmful rather than helpful (Appendix F)

### Reviewer's One-Line Take

Having the same model play both student and harnessing agent, plus two general-purpose harnesses as controls, cleanly isolates whether distillation is actually doing the work; but the authors' own admission that deep domain knowledge is harder to distill than procedural behavior — visible in the USPTO gap — is an honest caveat worth taking seriously.

### Your Take-Away

- If your agent platform maintains multiple domain-specific harnesses: this approach is worth evaluating — review training trajectories with a harnessing agent, distill into the model, and consolidate deployment down to a single plain harness, which may be cheaper than permanently maintaining a pile of custom harnesses
- If you're weighing harness complexity: note the finding that a general-purpose harness isn't automatically helpful — the paper shows mounting general tool suites like DeepAgents or Claude Code onto a small model can make it perform worse than having no harness at all

---

## Paper Three | TraceDance: 252,557 Real Deployment Traces Show Exactly Where Agents Stumble

**TraceDance: An Automated System for Building Agent Behavior Benchmarks from Real-World Agent Deployment Traces**
Dehai Min, Daoan Zhang, Yiming Zeng et al. (ByteDance + University of Illinois at Chicago) · arxiv: 2609.33295

Links: [arxiv](https://arxiv.org/abs/2609.33295) · [alphaxiv](https://www.alphaxiv.org/abs/2609.33295)

### TL;DR

Building targeted benchmarks automatically from over 252,557 real agent deployment sessions, nine frontier LLMs issue valid tool calls at a mean pass rate of 67.9%, but only perform a required check before acting 8.1% of the time, with commit hygiene at just 0.9%.

### Editorial Judgment

| Aspect | Judgment |
|---|---|
| Venue | arXiv preprint (not yet peer-reviewed) |
| Citation velocity | Published 4 days ago; Semantic Scholar was rate-limited (429) this round, citation count unavailable |
| Institution | ByteDance Inc. + University of Illinois at Chicago (corresponding author affiliated with UIC) |
| Community response | 46 upvotes on HuggingFace Daily Papers; official repo public; HF's open-source team proactively reached out on the repo to help release the constructed benchmarks |
| Credibility | Pass — 139 test queries validate the system's build/reject behavior, 84% human-annotation agreement, and concrete per-behavior numbers across nine frontier LLMs |
| Evidence maturity | Substantial — covers both coding and general tool-use deployment settings, and includes adversarial queries testing the system's ability to reject rather than only testing positive cases |
| Reproducibility | Partial artifacts — the official repo and 107 constructed benchmarks are public, but the underlying 252,557-session deployment-trace corpus is ByteDance's internal production traffic and is not released |
| Why this paper | Direct — directly answers where agents actually stumble in real deployment, regardless of harness thickness |
| Direction novelty | Substantive — the first system to automatically construct targeted benchmarks from real deployment traces, rather than relying on a fixed general-purpose benchmark |
| Today's importance | High — provides a reality check for JAZ and Harness-Zero's harness-thickness debate: whatever the harness design, pass rates on safety-relevant checks are low enough to demand attention |
| Practical link | Clear — the pass-rate numbers translate directly into pre-launch checklist items for a production system |
| Editorial confidence | High — sufficient to support the concrete claim that "today's frontier models perform noticeably worse on specific safety-relevant decision points than on general tool-call validity" |
| Recommendation | Must-read — any team running a coding agent or tool-calling product in production |
| Primary limitation | The underlying data is production traffic from a single company (ByteDance); whether some findings generalize across all deployment settings awaits verification by other institutions |

### Background

Fixed benchmarks can't catch the specific bad behaviors that only surface after deployment — an agent that forgets to check an error message before retrying in a particular situation, say, or one that accidentally writes a secret to a log while completing a task. Developers usually only learn about these once users report them, and turning a single incident into a repeatable benchmark is hard to do by hand.

### Mid-Level Walkthrough

- **The problem**: Imagine your coding agent ships, and support reports "it sometimes retries a failed test without reading the error message first." You want to turn that specific bad behavior into a test that reruns on every new release, but manually finding similar cases across hundreds of thousands of conversation logs and writing them up as benchmarks is an impossible amount of manual work.
- **The method**: TraceDance uses an "Anchor-and-Confirm" pipeline — a lightweight model first retrieves candidate segments that might match a described behavior, then confirms each one individually; an "Anchor Synthesis Loop" repeatedly generates and revises the specification for that behavior until it reliably catches the right cases. Evaluation itself uses "decision-point continuation" — taking the full context immediately preceding a key decision point in a real trace, unchanged, and having the model under test continue from there, then grading it against a rubric written specifically for that behavior, without needing a reference answer or replaying the whole environment.
- **Why it matters**: This means a bad behavior reported by users today can become a regression test that runs tomorrow, shortening the feedback loop between user reports and model iteration, instead of letting the same problem get reported over and over with no corresponding test ever built.

### Deep-Dive Points

- Applied across coding and general tool-use deployment settings on 252,557 real sessions, producing 107 benchmarks with 4,125 test instances; 95.3% of build-target requests were successfully fulfilled
- System validation: of 139 test queries, 107 were expected to build a benchmark (98 predefined-behavior + 9 custom-behavior queries), and 32 were expected to be rejected (27 adversarial + 5 lacking required parameters); human annotators agreed with the system's behavior judgment on 84% of sampled instances, with automated-grader/human agreement comparable to human/human agreement
- Across nine frontier LLMs on average: valid tool call pass rate is 67.9%, but "check required before proceeding" is only 8.1%, "handle failure/feedback" is 33.5%, and "evidence-supported claim" is 28.9%
- Safety-relevant behaviors score even lower: secret protection at 6.9%, commit hygiene at just 0.9%, and failure-log inspection before acting at only 0.6%
- A counterintuitive finding: responses that open with a planning tool call like TodoWrite pass at only 4.6%, far below the 30.8% average pass rate of other opening actions on the same instances — this pattern holds across all nine models
- Overall rankings mask behavior-specific gaps: Claude Opus 4.8 ranks first overall, beating Kimi-K3 by more than 10 percentage points, but on "error-guided correction" Kimi-K3 beats Opus 57.8% to 27.8%
- Limitation: the underlying 252,557-session corpus is ByteDance's internal production traffic and is not released, so outside researchers can only rerun the 107 public benchmarks, not reconstruct new ones from the raw data

### Reviewer's One-Line Take

Testing extensively with adversarial queries to check whether the system correctly refuses when it should, plus human-validated agreement on the automated grader, is unusually rigorous for a benchmark-generator paper — a category prone to overstatement; but the underlying data is production traffic from a single company, so whether findings like the weak TodoWrite-opening pattern generalize across deployment settings still needs verification elsewhere.

### Your Take-Away

- If you operate a coding agent or tool-calling product: prioritize checking low-scoring behaviors like "check before acting" (8.1%) rather than only overall task-completion rate — this paper shows a completed task doesn't mean a clean process
- If you're choosing among frontier models: don't rely on overall rankings alone — Kimi-K3 beats the overall-higher-ranked Opus specifically on "error-guided correction," so test the specific behavior you actually care about rather than reading off the leaderboard

---

## Today's Takeaway

I used to think "making an agent more reliable means giving it a more complete harness." Today's three papers together say it's not that simple: both JAZ and Harness-Zero show a harness can be made thinner, or even distilled into the model and removed outright. But TraceDance, working from real deployment traces, shows that regardless of harness thickness, today's frontier models still pass a basic safety habit — checking before acting — only in the single digits to low teens. How thick a harness should be may still be unsettled, but whether the checks that should happen actually do is now a clearly measured gap.

## References

- [Harness as a Language: A Minimalist Agent Framework With Maximal Expressivity](https://arxiv.org/abs/2609.26891)
- [JAZ — alphaxiv](https://www.alphaxiv.org/abs/2609.26891)
- [Harness-Zero: Harness Distillation via Agent-as-Harness](https://arxiv.org/abs/2609.24974)
- [Harness-Zero — alphaxiv](https://www.alphaxiv.org/abs/2609.24974)
- [Harness-Zero — official code](https://github.com/metaevo-ai/harness-zero)
- [TraceDance: An Automated System for Building Agent Behavior Benchmarks from Real-World Agent Deployment Traces](https://arxiv.org/abs/2609.33295)
- [TraceDance — alphaxiv](https://www.alphaxiv.org/abs/2609.33295)
- [TraceDance — official code and project page](https://zhishanq.github.io/TraceDance/)
- [HuggingFace Daily Papers](https://huggingface.co/papers)
