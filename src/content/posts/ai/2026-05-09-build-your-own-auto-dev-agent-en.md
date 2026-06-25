---
title: "Step-by-Step: Build a Notion → PR Auto-Dev Agent — A Reproducible Version of the daodao Pipeline"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - claude-code
  - tutorial
  - notion-sync
  - openspec
  - pipeline-automation
  - auto-dev-agent
  - routine
  - cloud-environment
  - github-automation
lang: en
tldr: "Build a Notion task → GitHub issue → spec PR → code PR auto-dev agent from scratch. Using the daodao case as a template, this guide walks through every step — what to do, what to verify, and how to handle problems. Notion DB schema → bin/ scaffold → two Claude Code routines → cloud env vars → staging tests."
description: "Breaking the daodao auto-dev agent into a reproducible 12-step tutorial: from Notion DB schema, bin/ scaffold, two routines, cloud env vars, to staging verification."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-09-build-your-own-auto-dev-agent)

## TL;DR

Build a Notion task → GitHub issue → spec PR → code PR auto-dev agent from scratch. Using the daodao case as a template, this guide walks through every step — what to do, what to verify, and how to handle problems.

By the end, you'll have a working system: two Claude Code routines (Notion sync + dispatch) + a monorepo `bin/` scaffold + label setup across 8 sub-repos + a test card that flows from Notion all the way to a PR.

> This tutorial uses daodao (1 monorepo + 8 sub-repos) as an example, but the skeleton can be adapted to any "Notion planning + multi-repo development" project. daodao-specific parts (repo names, prompt content) are clearly marked so you can substitute your own.

Related content:

- **Design rationale and decisions**: See [From Plan to PR: Building daodao's Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) case study
- **Details and tradeoffs for each wall**: See [15 Walls of Building Your Own Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/)

---

## Prerequisites

- Claude Code account (Pro / Max / Team / Enterprise) with web enabled
- GitHub account + at least one repo you can push to (this guide uses 8 sub-repos as an example)
- Notion workspace + a task DB (**or** Linear / Asana / Jira / ClickUp / GitHub Projects as alternatives; this guide uses Notion — to switch tools, you only need to modify the `bin/notion-sync/` module)
- Local environment: Node 22+ / pnpm 9+ / `gh` CLI / `jq`

---

## Step 1: Notion DB Schema Setup (10 Fields)

Go to your Notion task DB (example: `https://www.notion.so/<workspace>/<db-id>`) and add the following fields:

| Field | Type | Default | Purpose |
|---|---|---|---|
| Title | title | — | issue title |
| Status | single-select | `Idea` | `Idea` / `Refining` / **`Ready for Dev`** / `In Progress` / `Done` |
| Sync to GitHub | checkbox | `false` | Second gate |
| Auto Mode | single-select | `plan-only` | `plan-only` / `auto-pr` / `manual` |
| Scope | single-select | `M` | `XS` / `S` / `M` / `L` (conservative default M) |
| Target Repo | single-select | `<your-default>` | Your sub-repo list |
| Acceptance Criteria | rich text | — | Injected into issue body |
| Labels | multi-select | — | Maps to GitHub labels |
| GitHub Issue | URL | — | Written back by Routine A after sync |
| Notion Page ID | formula `id()` | — | Dedup primary key |

**Verification**: Create a test card in Notion and fill in all fields. If no errors appear, you're good. Auto Mode defaults to `plan-only` and Scope defaults to `M` as conservative values — this prevents accidentally triggering auto-pr just by checking a box.

## Step 2: Obtain Secrets

**NOTION_API_KEY**:

1. Notion → Settings & Members → Connections → Develop or manage integrations
2. New integration → grant read + update permissions to the DB above
3. Copy the Internal Integration Token (`secret_...`)
4. Go back to the Notion DB page → top-right ... → Connections → add the integration you just created

**GITHUB_TOKEN**:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Permissions: `repo` (full) + `workflow` (if you need to modify GH Actions)
4. Copy the token (`ghp_...`)
5. Confirm your GitHub account has push access to all target sub-repos

Store both tokens in a password manager. **Do not write them into any prompt text** — they'll be placed in the Claude Code cloud environment later.

## Step 3: Monorepo Bootstrap

At your monorepo root:

```bash
# package.json
cat > package.json <<'EOF'
{
  "name": "<your-monorepo>",
  "type": "module",
  "scripts": { "test": "vitest", "lint": "shellcheck bin/**/*.sh" },
  "devDependencies": {
    "@notionhq/client": "^2.2.0",
    "@octokit/rest": "^21.0.0",
    "@types/node": "^22.0.0",
    "@vitest/coverage-v8": "^2.1.8",
    "tsx": "^4.21.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.8",
    "zod": "^3.24.0"
  }
}
EOF

# tsconfig.json
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": ".",
    "skipLibCheck": true
  },
  "include": ["bin/**/*.ts"]
}
EOF

# pnpm-workspace.yaml (if your monorepo doesn't have one yet)
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "."
EOF

pnpm install
pnpm tsx --version  # Verify tsx works
```

**Verification**: `pnpm tsx --version` prints a version number — you're good.

## Step 4: `bin/notion-sync/`

Create 5 files + tests (see the case study post and plan section 8, Phase 1.1 for the architecture):

```
bin/notion-sync/
├── notion-client.ts      # @notionhq/client wrapper
├── types.ts              # Zod schema for Notion DB row
├── schema-validate.ts    # Fail-loud on missing fields
├── dedup.ts              # gh issue list --label notion:<short-id>
├── sync.ts               # Main flow, --dry-run flag
└── __tests__/            # vitest fixture-based tests (>=8)
```

**Core logic (sync.ts)**:

```ts
// 1. validate Notion DB schema (or fall back to relaxed mode)
// 2. for each card with Status=Ready for Dev AND Sync to GitHub=true:
//    a. derive short_id from Notion Page ID first 8 chars
//    b. gh issue list --label "notion:<short_id>" — if exists, skip
//    c. else: gh issue create with labels:
//         - auto (or `manual` if AutoMode=manual — see Step 7)
//         - auto:plan-only / auto:auto-pr (per AutoMode)
//         - scope:XS|S|M|L (per Scope)
//         - target-repo:<repo>
//         - notion:<short_id>
//    d. write back issue URL to Notion's "GitHub Issue" field
// 3. relaxed mode: if MIGRATION_MODE=relaxed env set,
//    missing fields use hard-coded fallback (plan-only / scope:M / first repo)
```

**Relaxed mode fallback must be hard-coded** (cannot be read from env):

```ts
const RELAXED_FALLBACK = {
  autoMode: "plan-only",
  scope: "M",
  targetRepo: "<your-safest-repo>",  // Replace with yours
} as const;
```

This embodies the spirit of wall #11 (write-path allowlist) from [15 Walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/): "Modifying fallback values requires PR review; they cannot be silently changed via env vars."

**Verification**:

```bash
pnpm tsx bin/notion-sync/sync.ts --dry-run
# Expected: exit 0, stderr prints "checked N cards, would create M issues"
pnpm test bin/notion-sync/
# Expected: >=8 fixture tests pass
```

## Step 5: `bin/setup-auto-labels.sh`

Create 14 fixed labels x N sub-repos:

```bash
# 14 fixed labels per repo
LABELS=(
  "auto" "auto:plan-only" "auto:auto-pr"
  "scope:XS" "scope:S" "scope:M" "scope:L"
  "spec-pending" "spec-merged" "human-coding"
  "manual" "human-driving" "stop-after-plan" "automation:hold"
)

# Dynamic notion:<short-id> labels are created during sync, not pre-created here
```

Supports 3 modes:

```bash
bash bin/setup-auto-labels.sh <repo>          # Single repo
bash bin/setup-auto-labels.sh --all           # All sub-repos
bash bin/setup-auto-labels.sh --dry-run --all # List operations without executing
```

**Verification**: `bash bin/setup-auto-labels.sh --dry-run --all` prints N x 14 lines — you're good. Then run `bash bin/setup-auto-labels.sh <test-repo>` against one test repo (pick the smallest, least important one) to actually create the labels.

## Step 6: `bin/routine-dispatch/` (Dispatch Core)

This is the most complex part. Full file structure:

```
bin/routine-dispatch/
├── main.sh                    # dispatch entry: source policy → state.ts → handlers/<scope>.sh
├── state.ts                   # Derive issue processing state, including section 6 label priority + Rule 0
├── handoff.sh                 # Clear auto label + audit comment when human-driving
├── kill-switch.sh             # 4-granularity pause checks
├── spec-merged-scan.ts        # Pull-based scan of monorepo merged spec PRs
├── state-store.json           # last_scan_at + token_usage_by_issue + ports_in_use
├── verification-loop.sh       # max 2 retries
├── estimate-context.ts        # Context overflow guard
├── token-budget.ts            # Per-scope cap
├── model-router.ts            # Haiku/Sonnet/Opus + ADR injection
├── policy/
│   ├── tool-allowlist.json    # gh / git / pnpm exec <specific>
│   ├── write-path-blocklist.json # .github/workflows/, .env*, secrets/, merged migrations
│   └── enforce.sh             # safe_run / safe_write (reject metachars first, then allowlist)
└── handlers/
    ├── xs.sh                  # plan+code in one PR
    ├── s.sh                   # plan.md + code in one PR (test-first)
    ├── m.sh                   # Two phases: spec PR → code PR
    └── l.sh                   # Spec PR only + human-coding label
```

Each file is under 200 lines. For the full implementation, refer to [daodao's commit](https://github.com/daodaoedu/daodao/commit/892c0d6) or the structure explanation in [15 Walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/).

**Key Point 1: state.ts Rule 0**

```ts
// HARD-CODED — modifying requires PR review
const HIGH_RISK_REPOS: readonly string[] = ["<your-storage-repo>", "<your-infra-repo>"];

function deriveState(repo: string, labels: string[]): State {
  const isHighRisk = HIGH_RISK_REPOS.includes(repo);
  const isPlanOnly = labels.includes("auto:plan-only") || isHighRisk;

  // Section 6 label priority checks
  if (labels.includes("automation:hold")) return "skip-this-round";
  if (labels.includes("human-driving")) return "human-driving";
  if (labels.includes("manual")) return "manual-mode";
  if (labels.includes("stop-after-plan") && hasPlanPR(...)) return "stop-after-plan-done";

  // High-risk repos force stop-after-plan-done for XS/S (even if spec-merged)
  const scope = parseScope(labels);
  if ((scope === "XS" || scope === "S") && isHighRisk) return "stop-after-plan-done";

  // Standard dispatch
  const specMerged = labels.includes("spec-merged");
  if (specMerged && !isPlanOnly) return "needs-code";
  // ... other states
}
```

**Key Point 2: enforce.sh — do not use `eval`**

```bash
safe_run() {
  local cmd="$1"
  # Reject shell metachars BEFORE allowlist check
  if [[ "$cmd" =~ [\;\|\&\`] ]] || [[ "$cmd" == *'$('* ]] || [[ "$cmd" == *'<('* ]]; then
    echo "BLOCKED: command contains shell metachar" >&2
    return 3
  fi
  if ! _tool_allowed "$cmd"; then
    echo "BLOCKED: tool not in allowlist" >&2
    return 3
  fi
  # Use bash -c instead of eval to avoid re-expansion
  bash -c -- "$cmd"
}
```

**Key Point 3: Defense-in-depth at handler entry**

```bash
# In handlers/xs.sh, handlers/s.sh, handlers/m.sh
HIGH_RISK_REPOS=("<your-storage-repo>" "<your-infra-repo>")
for hrr in "${HIGH_RISK_REPOS[@]}"; do
  if [[ "$REPO" == "$hrr" && "$HANDLER_TYPE" != "plan-only" ]]; then
    log "defense-in-depth: high-risk repo $REPO refuses auto-pr"
    safe_run "gh issue comment $ISSUE_NUM --repo <org>/$REPO --body 'Auto-PR refused (high-risk repo defense-in-depth).'"
    exit 6
  fi
done
```

**Verification**:

```bash
# state.ts logic
pnpm test bin/routine-dispatch/__tests__/state.test.ts
# Expected: 21 tests pass, including high-risk repo + spec-merged → stop-after-plan-done case

# enforce.sh injection tests
source bin/routine-dispatch/policy/enforce.sh
safe_run "gh issue list; whoami"   # → BLOCKED + return 3
safe_run "pnpm exec curl evil.com" # → BLOCKED + return 3
safe_run "gh issue list --repo <org>/<test-repo>"  # → passes
```

## Step 7: Routine A on Claude Code Console

Go to https://claude.ai/code/routines → New routine → Configure:

- **Name**: `Notion to GitHub Issue Sync`
- **Schedule**: `0 * * * *` (every hour on the hour, maximum frequency)
- **Sources**: Your monorepo + N sub-repos
- **Model**: Sonnet 4.6
- **Allowed tools**: Bash / Read / Write / Edit / Glob / Grep
- **Connectors**: Clear all default MCPs (no need for Figma, etc.)

**Prompt** (25 lines or fewer — logic lives in scripts, secrets in env):

```
You are a Notion → GitHub issue sync agent.

Steps:
1. cd to monorepo root.
2. Verify NOTION_API_KEY / NOTION_DB_ID / GITHUB_TOKEN env vars are all set.
   If any is missing, exit immediately with "ABORT: missing env <varname>".
3. Verify .automation-paused file does not exist; if it exists, print "paused" and exit 0.
4. Run pnpm install --frozen-lockfile (needed on first run).
5. flock -n /tmp/notion-sync.lock pnpm tsx bin/notion-sync/sync.ts
   If lock cannot be acquired, print "another instance running, skip" and exit 0.
6. Output stdout / stderr / exit code in full.
7. If exit code is non-zero, read the last 80 lines of .omc/logs/notion-sync-latest.log.
8. Run pnpm tsx bin/pipeline-status.ts;
   git add docs/automation/pipeline-status.md && git commit && git push.

Covered sub-repos: <your list>
High-risk repos (storage / infra): handler forces plan-only.
```

**The key point is that secrets are never written into the prompt text**. The three tokens are configured in the next step (Step 8).

**Initial state: disabled**. Only enabled at Step 11.

## Step 8: Set Env Vars in Cloud Environment

This step involves a somewhat hidden UI design that the docs only briefly mention:

1. Routine edit page → below the Instructions box → click the cloud Default row
2. **Hover** over the Default row (don't click — just hover)
3. A gear icon appears on the right → click it
4. The "Update cloud environment" dialog appears
5. In the **Environment variables** section, use `.env` format:

```env
NOTION_API_KEY=secret_xxxxxxxxxxxx...
NOTION_DB_ID=<your Notion DB id>
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxx...
```

6. **Setup script** (optional, speeds up first launch):

```bash
#!/bin/bash
pnpm install --frozen-lockfile
```

7. Save

**Note**: The UI warning "visible to anyone using this environment" applies to team sharing scenarios. It's fine for personal accounts, but if you plan to add teammates to the org, create a routine-specific environment (avoid sharing the Default one).

## Step 9: Routine B on Claude Code Console

If you already have a dispatch routine, **modify the existing one**; otherwise create a new one.

The new routine configuration is basically the same as Step 7 (same sources, model, env), but change the schedule to `0 */2 * * *` (every 2 hours — one beat slower than Routine A to avoid race conditions).

Prompt template (replaces existing dispatch logic):

```
You are a dispatch + PR patrol agent.

Phase 0: cd to monorepo root; check .automation-paused.
Phase 1: pnpm tsx bin/routine-dispatch/spec-merged-scan.ts (cross-repo label sync)
Phase 2: For each sub-repo, scan issues with auto label (max 3)
         bash bin/routine-dispatch/main.sh <repo> <issue-num>
Phase 3: (Existing PR patrol, kept verbatim)
         For each auto/* PR: read review → fix → push or leave ready-to-merge comment
         If human-driving label present → skip

Emergency fallback: inject --legacy parameter to skip phases 0/1/2 and use the original dispatch.
```

**State**: disabled.

## Step 10: Run setup-auto-labels on All Sub-Repos

```bash
cd <monorepo>
bash bin/setup-auto-labels.sh --all
```

**Verification**:

```bash
for repo in <your sub-repos>; do
  for label in auto auto:plan-only scope:XS spec-merged human-coding manual; do
    gh label list --repo <org>/$repo | grep -q "^$label\b" || echo "MISSING: $repo/$label"
  done
done
# Expected: no MISSING output
```

Also copy the two templates into each sub-repo:

```bash
for repo in <your sub-repos>; do
  cp templates/issue-template-auto.md ../$repo/.github/ISSUE_TEMPLATE/auto.md
  cp templates/husky-pre-commit.sh ../$repo/.husky/pre-commit
  chmod +x ../$repo/.husky/pre-commit
done
```

## Step 11: Staging Test — Enable Routine A

Create a **test card** in Notion (use the lowest-risk combination):

- Status: `Ready for Dev`
- Sync to GitHub: checked
- Auto Mode: `plan-only`
- Scope: `XS`
- Target Repo: Your least important sub-repo (e.g., docs-only)

Go to Console → enable Routine A → manually trigger once (use the "Run now" button on the routine detail page).

**Verification checklist**:

- [ ] Routine A completes with exit 0 (check the session URL transcript)
- [ ] The corresponding sub-repo has a new issue (`gh issue list --repo <org>/<test-repo> --label auto`)
- [ ] Issue body contains `<!-- managed by Routine A -->` and `<!-- notion-id: <id> -->`
- [ ] Issue has 4 labels: `auto` / `auto:plan-only` / `scope:XS` / `target-repo:<repo>` / `notion:<id>`
- [ ] Notion card's GitHub Issue field is back-filled with the URL
- [ ] `git log` shows a new `chore(automation): refresh pipeline status [skip ci]` commit on the monorepo dev branch

If any check fails → read the routine session transcript for stderr / exit code.

Run manual trigger twice in a row — the second run should not create a duplicate issue (dedup verification).

## Step 12: Full E2E — Enable Routine B

After confirming Routine A runs successfully for 2 consecutive rounds, change the test card to `auto-pr` mode (keep scope:XS).

Go to Console → enable Routine B → manually trigger once.

**Verification checklist**:

- [ ] Routine B completes with exit 0
- [ ] The corresponding sub-repo has a new PR: branch name `auto/<num>-*`, base is `dev` (not main)
- [ ] PR commit history: first commit is `tests:` (red), second commit is `feat/fix:` (green)
- [ ] PR description contains plan summary and `Closes #<issue-num>`
- [ ] CI passes green

Upgrade to scope:M test (spec PR two-phase flow):

1. Change the test card to Scope=M
2. Wait for Routine B to run → expect a spec PR in the monorepo (`openspec/changes/<repo>-<num>-*`)
3. Review the spec PR and merge to dev
4. Wait for the next Routine B round → expect a code PR in the sub-repo with the `spec-merged` label on the issue
5. Review the code PR

Finally, test the high-risk repo override:

1. Change the test card's Target Repo to storage / infra
2. Set Auto Mode = auto-pr (intentionally "misconfigured")
3. Wait for Routine B to run → expect Rule 0 to trigger, issue gets audit comment "Auto-PR refused"
4. No code PR is created (because it was blocked)

---

## What You End Up With

After completing all 12 steps, here's what you have:

1. Notion card → GitHub issue auto-sync (hourly)
2. Issue → spec PR or code PR auto-dispatch (every 2 hours)
3. Unified label catalogue across 8 sub-repos
4. Scope risk-tier gates + two-layer defense-in-depth for high-risk repos
5. 4 manual intervention paths (manual / human-driving / stop-after-plan / reverse manual)
6. 4-granularity kill switch
7. Tool allowlist + write-path blocklist + verification loop + token budget

The remaining Tier 2/3 features (observability evals dashboard, Discord trigger, sub-agent council, runtime isolation) should be prioritized after staging runs for a full week and you have real evals data.

**Common troubleshooting**:

| Symptom | Where to look |
|---|---|
| Routine A exits non-zero | Session transcript stderr + last 80 lines of `.omc/logs/notion-sync-latest.log` |
| Routine A doesn't create issues (card not syncing) | Notion DB schema missing fields (schema-validate fail-loud) / Sync to GitHub not checked / Status is not Ready for Dev |
| Duplicate issues | `notion:<short-id>` label not created → check whether sync.ts dedup logic actually finds the label |
| Routine B doesn't process issues | `auto` label not added / `automation:hold` label is blocking / Rule 0 forces plan-only but issue expects auto-pr |
| Handler exit 6 (DiD) | High-risk repo incorrectly set to auto-pr — this is expected behavior |
| spec-merged label never appears | spec-merged-scan failed (check whether state-store.json:last_scan_at updated) |
| BLOCKED log | Tool not in allowlist or path is in blocklist — check enforce.sh stderr message |
| Token budget exceeded | Scope too small but task too large — upgrade scope or split the issue |

The first thing to do after the pipeline is running: set up automated weekly evals (currently a placeholder) — the Tier 2 wall is a genuine operational necessity, not a nice-to-have.

---

## References

- [From Plan to PR: Building daodao's Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) — Design process and decisions
- [15 Walls of Building Your Own Auto-Dev Agent](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/) — Details and tradeoffs for each wall
- [From Stripe to Meta: How Top Silicon Valley Companies Replace Keyboards with AI Agents](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — Source of design rationale
- [Claude Code Routines Official Docs](https://code.claude.com/docs/en/routines) — Complete reference for scheduling remote agents
- [Notion API: Integrations](https://developers.notion.com/docs/create-a-notion-integration) — Obtaining NOTION_API_KEY
- [GitHub PAT Docs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) — Permission setup for GITHUB_TOKEN
- [OpenSpec](https://github.com/fission-ai/openspec) — Spec-driven development framework
- [oh-my-claudecode (OMC)](https://github.com/oh-my-claudecode/oh-my-claudecode) — Source of `/plan --consensus` and `/team` skills
- [GitGuardian ggshield](https://www.gitguardian.com/ggshield) — Pre-commit secret scanning
