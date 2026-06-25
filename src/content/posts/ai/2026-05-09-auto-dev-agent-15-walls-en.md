---
title: "15 Walls for Building Your Own Auto-Dev Agent: Concrete Lessons from Stripe Minions"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - claude-code
  - guardrails
  - allowlist
  - verification-loop
  - token-budget
  - test-first
  - defense-in-depth
  - pre-commit
  - sub-agent-council
lang: en
tldr: "Stripe Minions says 'The walls matter more than the model,' but the case studies from four Silicon Valley companies never explained how to actually build those walls. This post breaks down the 15 walls we implemented in the daodao auto-dev agent: what each wall prevents, where the files live, and what the tradeoffs are. Tier 1 is mandatory, Tier 2 strengthens governance, Tier 3 is serious governance."
description: "15 walls for building your own auto-dev agent — a concrete implementation checklist distilled from Stripe Minions / Spotify Honk / AI Native 18 practices, each with file paths, failure modes prevented, and tradeoffs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-auto-dev-agent-15-walls)

## TL;DR

Stripe Minions says "The walls matter more than the model," but the [case study from Stripe to Meta](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) never explained how to actually build those walls. This post breaks down the 15 walls we implemented in the daodao auto-dev agent: what each wall prevents, where the files live, and what the tradeoffs are.

Three tiers:

- **Tier 1 (7 walls, mandatory)**: Must-haves before going live — safety and reliability walls that will cause problems if skipped
- **Tier 2 (1 wall, strengthening)**: Improves governance quality — won't explode without it, but you'll be flying blind
- **Tier 3 (3 walls, serious governance)**: Aligns with Stripe / Coinbase / Spotify standards, requires more investment

> These 15 walls are the production version for a small team with 8 sub-repos and an existing Claude Code routine. Stripe Minions runs on dedicated VM warm pools; Coinbase Cloudbot has a full sub-agent council. These walls target failure modes that actually happen — this isn't paper design.

> The walls are decoupled from the "task source" (PM tool). The Notion sync mentioned in this post is just a module outside the walls; if you swap Notion for Linear / Jira / Asana / GitHub Projects, all 15 walls remain unchanged.

---

## Tier 1: 7 Mandatory Walls Before Going Live

### 1. Blueprint Architecture (meta-pattern, applied to every handler)

Every handler script (one per XS/S/M/L scope) must clearly delineate three phases: **deterministic / agentic / verification**. This comes from the Stripe Minions 5-layer pipeline. The standard rhythm for a single handler run:

```
deterministic: cd worktree, git checkout -b auto/, source policy, pull base
agentic:       LLM writes code (Sonnet)
verification:  pnpm lint && pnpm test
agentic (fail): LLM reads stderr and fixes (max 2 retries)
deterministic: git push, open PR
```

**What it prevents**: Avoids "the entire handler relies on the LLM getting everything right." If the LLM takes one wrong step, the whole thing needs to start over. By separating deterministic parts (git, test, push) from fuzzy parts (LLM writing code) — the former uses shell, the latter is delegated to the model.

**Tradeoff**: Each handler requires ~50 more lines of shell compared to a pure LLM prompt version; but when debugging, you can pinpoint exactly which phase failed just by reading the logs.

### 2. Tool & Write-Path Allowlist (Stripe Toolshed Pattern)

**Files**:

- `bin/routine-dispatch/policy/tool-allowlist.json` — 30 regex patterns (gh issue/pr/label, git status/add/commit/push, pnpm exec vitest/tsc/shellcheck/husky, bin/openspec-headless.ts, jq...)
- `bin/routine-dispatch/policy/write-path-blocklist.json` — `.github/workflows/**` / `.env*` / `secrets/**` / `migrate/sql/<merged>` / `apps/*/dist/**` / `node_modules/**`
- `bin/routine-dispatch/policy/enforce.sh` — Provides `safe_run` / `safe_write` shell functions; handlers must use these wrappers for all calls

**The key rule: `safe_run` must not use `eval`**. The first version of enforce.sh used `eval ${cmd}`, with the allowlist only matching prefixes. Attack vector: `safe_run "gh issue list; rm -rf /"` → passes `^gh issue ` prefix match → `eval` executes the entire string → game over. The fix: first reject strings containing `;`, `|`, `&`, `` ` ``, `$()`, or `<()`, then perform allowlist matching.

**Also don't allow broad entries like `^pnpm exec `**. That's a backdoor — `pnpm exec curl` / `pnpm exec bash` would all pass. Changed to only list 4 specific binaries: `^pnpm exec vitest`, `^pnpm exec tsc`, `^pnpm exec shellcheck`, `^pnpm exec husky`.

**What it prevents**: When handlers run LLM-generated shell commands, prevents prompt injection from tricking the agent into hitting production / modifying .env / pushing already-merged migrations.

### 3. Verification Loop Max 2 Retries + Context Overflow Guard

**Files**: `bin/routine-dispatch/verification-loop.sh` + `bin/routine-dispatch/estimate-context.ts`

```bash
attempt=0
estimated=$(bin/estimate-context.ts <repo> <issue>)
if [ $estimated -gt $((CONTEXT_WINDOW * 70 / 100)) ]; then
  escalate "context overflow predicted ($estimated tokens)"
  exit 4
fi
while [ $attempt -lt 2 ]; do
  run-handler-attempt
  pnpm lint && pnpm test && break
  attempt=$((attempt+1))
  feed-error-to-agent
done
[ $attempt -ge 2 ] && add-label human-coding && exit 5
```

**What it prevents**: The Stripe Minions heuristic is "if CI fails and isn't fixed in 2 attempts, the 3rd attempt won't fix it either." Beyond the 3rd attempt, you're just burning compute for nothing. Immediately add a `human-coding` label and escalate to a human.

**Context overflow guard**: At the start, the handler estimates task size (issue body + acceptance criteria + expected changed files token count). If it exceeds 70% of the context window, it refuses to run and escalates.

### 4. Token Budget per Issue

**File**: `bin/routine-dispatch/token-budget.ts`

Hard-coded caps (changes require PR review):

| Scope | Cap |
|---|---|
| `scope:XS` | 50,000 tokens |
| `scope:S` | 200,000 tokens |
| `scope:M` | 800,000 tokens (shared between spec PR + code PR) |
| `scope:L` | 1,500,000 tokens |

After each LLM call, the handler increments accumulator += response_tokens. When the cap is exceeded, it immediately aborts + comments "⚠️ Token budget exceeded" + adds the `human-coding` label. Token usage is persisted to `state-store.json:token_usage_by_issue` for weekly evals to track p99.

**What it prevents**: Agent loop runaway is a real risk. One prompt goes in the wrong direction, the agent retries on the wrong path 10 times, and token costs explode overnight. A hard cap per issue means it stops and hands off to a human when exceeded.

### 5. Model Selection + ADR Injection

**File**: `bin/routine-dispatch/model-router.ts`

| Task | Model | Rationale |
|---|---|---|
| Dispatch routing (state.ts derivation) | Haiku 4.5 | Pure label routing, no reasoning depth needed |
| XS/S handler code writing | Sonnet 4.6 | Everyday development, code review, test generation |
| M/L spec generation (openspec-headless) | Opus 4.7 | Architecture design, requires deep reasoning |
| reviewer-agent (council) | Sonnet 4.6 | Peer-level dialogue with the writer |
| judge-agent (council arbitration) | Haiku 4.5 | Structured judgment |

**ADR injection**: The handler prompt automatically injects into the system message:

- `openspec/changes/<id>/proposal.md` (if it exists)
- `openspec/specs/<related-domain>/spec.md` (derived from the issue body's area field)
- `docs/adr/*.md` ADRs related to the target_repo (matched by grep tag)

**What it prevents**: Using the right model tier saves money. Running Opus for dispatch routing wastes 90% of costs; running Haiku for spec generation produces subpar architecture. And making the model aware of historical project decisions (ADRs) prevents reinventing the wheel.

### 6. Test-First Discipline (scope:S+)

**scope:S** handler commit order is enforced:

1. `tests: <name>` — run once to verify it's red (fail)
2. `feat/fix: <name>` — run once to verify it's green (pass)
3. Push as PR

**scope:M Phase 1** spec PR must include `tasks.md`, with each acceptance test as a given/when/then line.
**scope:M Phase 2** code PR: commit 1 = test, commit 2+ = code.

**Enforcement mechanism**: After the handler writes tests, running pnpm test must fail; if it passes, the test isn't actually testing the target behavior — escalate.

**What it prevents**: Embodies the spirit of Article #3, "You don't have to write code by hand, but you should write tests by hand." Tests become the executable version of acceptance criteria. The agent writes code to make tests green, not to "look correct."

### 7. Security Guardrails (pre-commit ggshield + Dependency Audit)

Every sub-repo `.husky/pre-commit`:

```bash
ggshield secret scan pre-commit       # or gitleaks
pnpm audit --audit-level=high         # node sub-repos
pip-audit --strict                    # python sub-repos
```

CI runs the same checks again as a double safety net.

**What it prevents**: The GitGuardian 2026 secret sprawl report found 28.6 million new secret leaks in public GitHub repos in 2025, with AI-assisted commits leaking at twice the baseline rate. Pre-commit is the last line of defense — don't skip it.

---

## Tier 2: Strengthening Governance (1 Wall)

### 8. Observability + Per-PR Evals

**Output**:

- `docs/automation/pipeline-status.md` (updated every routine cycle)
- `docs/automation/evals.md` (updated weekly)

**Metrics**:

- Per-scope merge rate (scope:XS PRs merged within 7d / total opened)
- Failure classification (CI fail / context overflow / token overrun / human takeover / dedup race / spec rejected by reviewer / judge dissent)
- Per-PR token cost
- Per-issue intervention count
- Council dissent rate (used to detect rubber-stamping)

**What it prevents**: Without observability you're flying blind. Article #12, "No measurement means no improvement," applies directly. But note: the value of a metrics dashboard depends on whether the metrics map to actual failure modes. The 5 metric categories above were derived from the failure modes in plan §6's risk table — more metrics isn't better; what matters is being able to see the real occurrence rate of every risk.

---

## Tier 3: Serious Governance (3 Walls)

### 9. Trigger Layer: Cron + Discord/Slack Real-Time Triggers

**Cron** (default):

- Routine A: every hour `0 * * * *`
- Routine B: every 2 hours

**Discord real-time** (a low-latency path beyond cron):

- Slash command `/automate <repo>#<issue-num>` → immediately triggers the routine to process a single issue
- Emoji `:create-minion:` on a message containing an issue link → same effect (echoing the Stripe Minions UX)
- Deployment: Cloudflare Worker receiving Discord webhooks
- Permissions: only specific channel members can trigger; all events logged to evals.md

**Why Tier 3**: Cron already works. The Discord trigger is a nice-to-have that reduces the "idea → issue appears" latency from 1 hour to <2 minutes. It introduces a new ops surface (Cloudflare Worker / fly.io) and isn't required for launch.

### 10. Sub-Agent Council (Writer + Reviewer + Judge)

**Applies to**: scope:M+ with `auto:auto-pr` (not used for XS/S to avoid over-engineering)

**Council composition**:

- **writer-agent** (Sonnet): writes code, outputs diff
- **reviewer-agent** (Sonnet, **independent context**, does not share the writer's prompt history): gives `approve` / `request-changes` + reasoning
- **judge-agent** (Haiku): arbitrates disagreements

**Flow**:

```
writer writes → reviewer reviews →
  approve → goes to PR
  request-changes →
    writer revises once → reviewer re-reviews →
      approve → goes to PR
      still request-changes → judge arbitrates →
        approve → PR
        reject → escalate to human
```

**Deliberately not implementing Coinbase-style auto-merge**: Even when the council approves, it only opens a PR — humans must still review and merge. This upholds Article #14, "production-affecting decisions need human approval."

**What it prevents**: For scope:M+ tasks with high complexity, a single agent easily convinces itself. A reviewer with an independent context can catch the writer's blind spots. Weekly evals track dissent rate: <5% is a rubber-stamp warning (reviewer too lenient), >30% means the reviewer is too strict.

**Tradeoff**: Multiple LLM calls in the council make token costs 3–5x higher than single-agent mode; the token budget cap must be expanded accordingly.

### 11. Runtime Isolation (Worktree + Port + DB Schema)

**Files**: `bin/routine-dispatch/sandbox.sh` + `bin/routine-dispatch/sandbox-cleanup.sh`

Each issue gets a dedicated worktree: `.git/worktrees/auto-<repo>-<issue-num>/`, and the handler's CWD is restricted to it.

If the issue requires a server / db (for testing):

- Random port (excluded from `state-store.json:ports_in_use`)
- Isolated db schema: postgres `?currentSchema=auto_<issue>` or a temporary sqlite

**Orphan cleanup**: At the start of each routine, scan `.git/worktrees/` and delete orphan worktrees older than 24 hours.

**What it prevents**: When two issues run simultaneously — git lock conflicts, port collisions, db schema overwrites. Stripe Minions uses dedicated EC2 VMs; Spotify Honk uses cloud sandboxes. For a small team, worktrees are the pragmatic version.

---

## The Big Picture

These 15 walls weren't written all at once. The actual rollout order:

1. Start with the 7 Tier 1 walls (mandatory) to avoid stepping on landmines
2. After running for 1–2 weeks and collecting real eval data, add Tier 2 observability
3. For the 3 Tier 3 walls, let eval results determine priority: high dissent rate → add council; frequent context overflow → add runtime isolation; too many trigger latency complaints → add Discord

**Uncovered "unknown unknowns"**:

- **Test pollution**: A worker running acceptance tests actually hit the production GitHub repo API (leaving 2 test comments). The plan didn't list this as a risk — it was only discovered in the post-mortem. Next time, add "tests involving production write actions" as an independent risk during the planning phase.
- **Hidden UI settings**: Claude Code Console's environment variable settings are hidden behind a "gear icon that only appears on hover." You won't find it without reading the docs. Next time, add "environment variable injection paths" as a risk in the plan.
- **Worker hallucination**: In team mode, after multiple wake/sleep cycles, a worker might count someone else's task as their own. The lead's countermeasure: "Don't trust verbal handoffs — only trust git + TaskList."

**The most important judgment criterion to remember**: When you think "this wall looks like too much hassle, let's skip it," ask yourself "has the failure mode this wall prevents ever happened?" Stripe Minions' 5-layer pipeline was added after stepping on production landmines — it wasn't paper design. The GitGuardian report of 28.6M publicly leaked secrets isn't a scare tactic; it's a cumulative count of real incidents. If you want to skip a wall, at least find a concrete reason why "this failure mode will never happen" — if you can't, just build the wall.

---

## References

- [From Stripe to Meta: How Top Silicon Valley Companies Replace Keyboards with AI Agents](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — Source of "The walls matter more than the model"
- [Lessons from Practice: What AI Native Teams Should Get Right](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) — 18 best practices, closely related to this post's 15 walls
- [From Plan to PR: Building daodao's Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) — Companion case study for this post
- [Stripe Dev Blog: Minions — Part 1](https://stripe.dev/blog/2026/02/minions-part-1) — Source of the Blueprint architecture and Toolshed pattern
- [GitGuardian: The State of Secrets Sprawl 2026](https://www.gitguardian.com/state-of-secrets-sprawl-report-2026) — Motivation for pre-commit ggshield (28.6M secrets / AI-assisted commit leak rate 2x baseline)
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/research/evaluating-feature-steering) — Observability + evals dashboard design
- [LangChain Open SWE](https://github.com/langchain-ai/open-swe) — Open-source version of the Stripe / Ramp / Coinbase common patterns
- [Penligent: Git Worktrees Need Runtime Isolation](https://penligent.io/blog/git-worktrees-need-runtime-isolation) — Runtime isolation isn't just git — it's also ports / db / cache
- [HumanLayer: Human approval for AI agents](https://humanlayer.dev/) — Design rationale for why the sub-agent council doesn't auto-merge
