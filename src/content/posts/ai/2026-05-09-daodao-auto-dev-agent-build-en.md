---
title: "From Plan to PR: Building daodao's Auto-Dev Agent in Practice"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - claude-code
  - multi-agent
  - consensus-planning
  - auto-dev-agent
  - notion-sync
  - openspec
  - pipeline-automation
  - internal-coding-agent
  - defense-in-depth
lang: en
tldr: "5 rounds of consensus to write the plan, then team mode with 5 workers running 12 tasks in parallel — with plenty of pitfalls along the way. Writing it down for my future self and anyone else trying the same thing."
description: "From Notion task board to GitHub PR automation: the plan, implementation, and lessons learned building daodao's internal auto-dev agent"
draft: false
---

🌏 [中文版](/posts/ai/2026-05-09-daodao-auto-dev-agent-build)

## TL;DR

5 rounds of consensus to write the plan, then team mode with 5 workers running 12 tasks in parallel — with plenty of pitfalls along the way. Writing it down for my future self and anyone else trying the same thing.

Looking back at the previous post — [From Stripe to Meta: How Silicon Valley's Top Companies Replace Keyboards with AI Agents](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — that was a case study of large tech companies. After writing it, I started wondering: could a team as small as one to three people at daodao do something similar? This post is the record of that attempt.

It wasn't all smooth sailing. Each of the 5 consensus rounds had reviewers flagging REVISE, the team-fix loop surfaced 5 must-fix issues, a worker experienced LLM hallucination and claimed credit for another worker's task, and the final routine setup ran into a hidden UI quirk in Claude Code. Every pitfall is documented here.

## The Starting Point: A Small Pain Point + An Existing Routine

daodao already had a Claude Code routine (`trig_01KATY...`) that ran every 2 hours: scan `auto` label issues across 4 sub-repos, open `auto/<issue>-*` branches, write code, push, and open PRs to dev. The PR patrol piece — reading review feedback, making revisions, leaving ready-to-merge comments — was also running.

The problems were:

1. The Notion task board (used by PMs for planning) wasn't synced with GitHub issues — PMs had to manually create issues in GitHub after checking things off in Notion
2. The existing routine jumped straight from issue to coding, with no planning phase — for large tasks there was no way for humans to intervene at the spec stage
3. Unified dispatch logic across 8 sub-repos (not 4 — this was discovered later) didn't exist
4. Auto-opened PRs had no AI-Native guardrails — nowhere close to the governance standards of Stripe Minions or Ramp Inspect

The goal: build the full Notion → Issue → Plan → PR pipeline, echoing the lesson from the previous article: "The walls matter more than the model."

## Why It Took 5 Rounds of Consensus Before Writing Code

OMC ([oh-my-claudecode](https://github.com/oh-my-claudecode/oh-my-claudecode)) has a `/plan --consensus` mode: a Planner writes the first draft, an Architect reviews it from an architectural perspective, a Critic reviews it from a quality perspective, and the three loop until the Critic APPROVEs. It sounds tedious, but each round caught things that single-person thinking missed.

### v1: Rough Skeleton + 6 Options

The first draft went with Option B (dual routines + scope routing). In round 1, the Architect marked APPROVE WITH CHANGES, with 3 required changes:

1. Cross-repo state was written using GitHub Actions workflow labels — should be pull-based (Routine B self-scans for merged spec PRs in the monorepo)
2. OpenSpec is an interactive skill and would hang in a headless routine environment — needed a `bin/openspec-headless.ts` wrapper
3. Dedup was using issue body comments — should use `notion:<short-id>` labels instead (label index is real-time, avoiding search index delay races)

Round 1 from the Critic was stricter: 0 PASS / 2 WEAK / 3 FAIL across 5 dimensions, with 12 improvement items. Key points:

- Option D (Notion webhook) and Option E (GitHub Projects replacing Notion) weren't listed at all before selecting Option B — smelled like "fake alternative exploration"
- §9 acceptance stated "no human intervention throughout" — an empty promise with no measurable SLA
- §7 verification commands used `grep "would create"` — if the Notion DB has nothing pending sync, grep fails and reports a false negative

### v2: Filling the Gaps + Tightening Commitments

Options D (webhook) / E (GitHub Projects) / F (pure GH Actions) were all laid out, with clear invalidation reasoning for each. Round 2 from the Architect: APPROVE WITH MINOR CHANGES, 2 must-fix items remaining:

- The 24h window for spec-merged scanning — if the routine goes down for >24h and restarts, it will permanently miss spec PRs merged during that window — needs to switch to a persisted `last_scan_at` timestamp
- The relaxed mode fallback value should be hard-coded (not read from env) to prevent it from silently being changed to auto-pr later

Round 2 from the Critic: 5/5 PASS, 12/12 improvements resolved.

### v3 → v5: Two Expansions Driven by User Feedback

After v3 merged the Architect's two must-fix items, shipping seemed imminent. But the user said: "There's probably also a case where development is done manually" — which triggered v4, adding 4 labels (`manual` / `human-driving` / `stop-after-plan` / `automation:hold`) + label priority ordering + race handling.

v5 was bigger: the user shared two existing quidproquo articles — [Lessons from Practice: What AI-Native Teams Should Get Right](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) and [From Stripe to Meta](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — and said "use these as reference." After reading and doing a gap analysis, 15 missing walls (Tier 1+2+3) were identified:

| Tier | Content |
|---|---|
| 1 (must ship) | Blueprint architecture / Tool allowlist / Verification loop max 2 retries / Token budget per scope / Model routing Haiku/Sonnet/Opus / Test-first scope:S+ / ggshield pre-commit scan |
| 2 (strengthen) | ADR injection into prompts / per-scope file count cap / Observability evals dashboard / write-path allowlist / context overflow estimation protection |
| 3 (serious) | Discord trigger (replacing existing cron) / Sub-agent council writer+reviewer+judge / Runtime isolation worktree+port+db |

The plan grew from 200 lines in v1 to 925 lines in v5 (later refactored to 864 lines). Along the way, a major restructure was done to merge version markers, remove the v1→v5 changelog across five sections, and rewrite it so readers can follow top-to-bottom.

**Lesson learned here**: the value of consensus mode isn't "how fast you finish the plan" — it's "laying out all the alternatives before writing any code, including clear reasoning for why each rejected option was rejected." Discovering mid-coding that "we should have picked Option C" costs far more than getting the choice wrong upfront.

## Team-Exec: 5 Workers / 12 Tasks / 8 Minutes

Once the plan was locked, it went into OMC `/team` mode. First, a `.omc/handoffs/team-plan.md` was written (decisions, rejected options, remaining work, user checklist), then 12 subtasks were broken out with dependency relationships and pre-assigned to 5 workers.

Dependency chain:

```
#1 Bootstrap (package.json + tsconfig + pnpm-workspace)
   └→ #2 #4 #5 #6 #7 #9 all unblocked

#5 spec-merged-scan + state-store
#6 policy (allowlist + blocklist + enforce.sh)
#7 verification-loop + estimate-context + token-budget + model-router
   └→ #8 dispatch core (main.sh + state.ts + handlers)

#3 #10 #11 #12 (labels + docs + routine prompts + pre-commit)
   └→ no dependencies, run in parallel
```

Round 1 assignment: worker-1 #1 (must complete first), worker-2 #3, worker-3 #10, worker-4 #11, worker-5 #12. From round 2 onward, the lead dynamically assigned remaining tasks.

Actual timeline:

- 17:53 — work starts
- 17:56 — #1, #3, #4, #5, #10, #11, #12 all complete (7/12)
- 17:59 — #6, #7 complete (9/12)
- 18:01 — #8 complete (12/12)

8 minutes total, 120+ unit tests all passing.

### Worker Hallucination

worker-1 claimed credit for #6 twice in its messages (which was actually done by worker-5). The first time happened in round 2: after completing #2 and going idle, when it woke again it saw #6 as completed in TaskList and mistakenly thought it had done it itself. The second time happened after a restart.

The response: don't correct it, don't reassign — because the actual state on disk, git status, and TaskList owner all correctly pointed to worker-5. LLMs in long context with multiple wake/sleep cycles frequently confuse "things they observed" with "things they did." The lead's judgment principle: treat disk state + structured state (TaskList, git) as ground truth, not the literal content of worker messages.

## Team-Verify: 3 Reviewers / REVISE → 5 Must-Fixes

Shutting down immediately after 12 tasks complete would be reckless. 3 reviewers were spawned:

- **verifier**: ran all vitest / shellcheck tests, §10 verification commands, §11 acceptance criteria, cross-module integration smoke tests, and git status isolation across 8 sub-repos
- **security-reviewer**: 5 dimensions (secret leak / allowlist bypass / push safety / state.ts rule 0 / headless OpenSpec timeout)
- **critic**: plan vs. implementation comparison (D1~D15 landing quality, test coverage, acceptance SLA, cross-module schema)

The 3 reviewers converged on 5 must-fix items (3 HIGH + 2 MED):

| # | Issue | Severity |
|---|---|---|
| Fix-1 | state.ts logic bug: storage repo + spec-merged + scope:XS/S still returns needs-code | HIGH (Rule 0 promise broken) |
| Fix-2 | enforce.sh `safe_run` uses `eval ${cmd}`: allowlist only matches prefix, so `gh issue list; rm -rf /` passes prefix match and gets eval'd | HIGH (shell injection) |
| Fix-3 | tool-allowlist `^pnpm exec ` is too broad: effectively a backdoor, `pnpm exec curl` / `pnpm exec bash` both pass | HIGH (allowlist bypass) |
| Fix-4 | main.sh never calls spec-merged-scan.ts: M scope Phase 2 never triggers | MED (pipeline broken) |
| Fix-5 | handlers lack defense-in-depth: if state.ts Rule 0 is bypassed, handlers will still push code | MED (single layer of protection) |

### Test Pollution

During verification, the verifier found that `daodao-storage` PR #42 had 2 test comments: "🛡️ Auto-PR refused (high-risk repo defense-in-depth)." worker-1 hit the live GitHub API when running the #13 fixture against the production repo (exit 6 + post comment), and the verifier hit it again during acceptance testing.

Not serious tampering (no code was pushed, no PRs were opened), but two bot comments on a production repo issue looked like test residue. After user confirmation, they were cleared with `gh api -X DELETE`.

**Lesson**: Future acceptance tests involving GitHub API writes should use a staging repo or dry-run mode — don't hit production. This risk wasn't in the plan; it was a post-mortem blind spot.

## Team-Fix → Re-Verify: APPROVE

3 fix tasks were dispatched in parallel and completed in 5 minutes.

Round 2 verifier marked APPROVE: all 5 fixes ✅, 262/264 tests passing (2 failures were pre-existing in daodao-f2e showcase), all shell scripts pass shellcheck. Round 2 critic also marked APPROVE: logic consistent, defense-in-depth with two layers (state.ts Rule 0 + handler guard at entry), enforce.sh metachar rejection doesn't break the happy path.

All 10 teammates shut down (5 workers + 3 reviewers + 2 round-2 reviewers), TeamDelete clean exit.

## What Wasn't in the Plan: Routine Setup

After `git push`, the user said "help me set up the Claude routine first." I assumed the two routines each had their own env var settings in the Console — but the user couldn't find them. After checking the official docs, it turned out: env vars aren't set at the routine level, they're set at the cloud environment level.

The hidden path from the routine edit page to env vars:

1. Click the ✏️ pencil icon to enter Edit
2. Below the Instructions box is a small line reading `☁️ Default`
3. Click Default to expand the selector
4. **Hover over the Default row** (don't click — hold for 1 second)
5. A ⚙️ settings icon floats in from the right
6. Click ⚙️ → "Update cloud environment" dialog opens
7. In the Environment variables section, enter values in `.env` format

The UI helpfully (?) warns "These are visible to anyone using this environment — don't add secrets or credentials." But Stripe Minions, Spotify Honk, and similar production systems actually do store secrets this way — the warning is aimed at shared team environments. For personal accounts it's fine.

**Lesson**: Getting a routine running involves hidden UI design (hover-only ⚙️ icon) that's harder to navigate than expected. Next time, include "env var injection path" as an explicit risk item in the plan stage — don't assume the Console provides an obvious UI.

## Looking Back

Reviewing this end-to-end, the most valuable part wasn't "completing 12 tasks in 8 minutes" — it was the 5 rounds of consensus laying out every alternative, having the Critic scrutinize every risk, and having a security review confirm the safety walls before going live.

This also echoes the Stripe quote from the previous post: **The walls matter more than the model.** The models I used (Sonnet 4.6 / Opus 4.7) aren't dramatically different from two months ago — but because this time we ran a proper Architect/Critic loop, with a tool allowlist, verification loop with max 2 retries, token budget per scope, hard-coded Rule 0, and two-layer defense-in-depth, the resulting scaffold is meaningfully closer to production standards. It hasn't run through 7 days of staging yet, and the real block rates and false-positive rates of these walls are still unknown — we'll have real data once it's actually running.

Key takeaways worth recording:

1. **The value of 5-round consensus is in "writing down why rejected alternatives were rejected"** — v1 didn't list Options D/E; the Critic caught it. v5's walls came from reading other people's articles. Each reviewer sees things that single-person thinking misses.
2. **Team mode monitoring should look at disk state, not worker message content** — worker hallucination in multi-wake environments is nearly inevitable; the cheapest countermeasure is refusing to trust verbal delivery and only trusting git status / TaskList.
3. **Test pollution, hidden UI settings, env var injection paths — "things not in the plan" will always bite you** — next time, list operational risks (not just code risks) in the planning phase.
4. **Hard-coded Rule 0 + two-layer defense-in-depth is necessary** — not paranoia, but a reflection of how catastrophic a mistake in storage or infra can be.

Time breakdown:

| Phase | Time |
|---|---|
| Plan + 5 rounds of consensus | ~1.5 hours (including writing, absorbing two articles, 4 restructures) |
| Team-exec | 8 minutes |
| Team-verify | ~3 minutes |
| Team-fix | ~5 minutes |
| Team-verify round 2 | ~3 minutes |
| Cleanup + commit + push | ~5 minutes |
| Routine setup | ~10 minutes (including env var UI troubleshooting) |

Total: roughly 2.5 hours. Next up is the Tier 2/3 round (Discord trigger / sub-agent council / runtime isolation), using the same consensus + team workflow. Waiting until the Notion DB schema is complete and staging has run for a week with real success rate data before starting.

---

## References

- [From Stripe to Meta: How Silicon Valley's Top Companies Replace Keyboards with AI Agents](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — the benchmark this auto-dev agent was built against
- [Lessons from Practice: What AI-Native Teams Should Get Right](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) — source for the Tier 1+2+3 walls
- [oh-my-claudecode (OMC)](https://github.com/oh-my-claudecode/oh-my-claudecode) — provider of `/plan --consensus`, `/team`, `/oh-my-claudecode:cancel` and other skills
- [Claude Code Routines](https://code.claude.com/docs/en/routines) — documentation for scheduling remote agents, including environment variable configuration
- [OpenSpec](https://github.com/fission-ai/openspec) — spec-driven development framework, wrapped in a headless wrapper for this project
- [GitGuardian: The State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) — motivation for pre-commit ggshield + dependency audit
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/research/evaluating-feature-steering) — design reference for observability + evals dashboard
- [Open SWE (LangChain)](https://github.com/langchain-ai/open-swe) — open-source version of the common patterns from Stripe / Ramp / Coinbase
