---
title: "Claude Code Cloud Routines: When outcomes Pushes to a Feature Branch Instead of main"
date: 2026-09-01
category: tech
type: debug
tags: [claude-code, cloud, git, debug, ci-cd, automation]
lang: en
tldr: "Cloud routine outcomes config creates a feature branch, so the agent commits and pushes there instead of main. Fix: remove outcomes + add explicit git checkout main in skills. Also hit a list API pagination bug (cursor never advances) along the way."
description: "Debugging why Claude Code cloud routines pushed daily-digest articles to feature branches instead of main, caused by the outcomes config creating an implicit branch checkout."
draft: false
---

## TL;DR

Cloud routine `outcomes` config makes the cloud session work on a feature branch. Even if the skill says `git push origin main`, the agent is already on the branch and pushes there. Fix: remove `outcomes` + add `git checkout main` in every skill. Along the way, hit a RemoteTrigger list API pagination bug where the cursor never advances — had to get trigger IDs manually from the Web UI.

## Context

The quidproquo blog runs 15 Claude Code cloud routines to auto-generate daily articles (arxiv digest, GitHub trending, security alerts, model cards, etc.). Each routine reads its corresponding skill file and pushes to `main` at the end.

On 2026-09-01, the arxiv digest appeared on the site but the other 7 daily articles were missing.

## Problem

Comparing the successful arxiv session's run log against the failed GitHub digest session using `RemoteTrigger`'s `get_run_log` revealed the key difference:

**Arxiv session** (success): worked on `main`, ran `git push -u origin main` directly.

**GitHub digest session** (failure): worked on `claude/trusting-cannon-npgqrz`, pushed to the feature branch. Articles never reached `main`.

Both routines had identical skill instructions saying `git push origin main`. Why the different behavior?

## Investigation

### Step 1: Compare routine configs

Pulled both routine configs with `RemoteTrigger`'s `get` action. Both had an `outcomes` field:

```json
"outcomes": [{
  "git_repository": {
    "git_info": {
      "branches": ["claude/trusting-cannon"],
      "repo": "vincentxuu/quidproquo"
    }
  }
}]
```

`outcomes` makes the cloud environment create a feature branch with a random suffix (e.g., `claude/trusting-cannon-npgqrz`) and checks it out. When the agent runs `git pull origin main`, it only merges main into the feature branch — **it does not switch to main**.

### Step 2: Assess blast radius

Scanned all remote branches with `git ls-tree` and found 8 branches with 09-01 daily articles that never made it to main:

```bash
for b in $(git branch -r); do
  count=$(git ls-tree --name-only "$b" -- src/content/posts/daily/ \
    | grep "2026-09-01" | wc -l)
  [ "$count" -gt 0 ] && echo "$b: $count files"
done
```

### Step 3: List API pagination bug

Tried to list all daily routines via `RemoteTrigger`'s `list` action to batch-update their configs. The API's `next_cursor` always returned the same value `MTc4NzUwMDcwNTE0NDI2MzAwMHw2YjhmZmRiOC0wN2JkLTQ1ZWUtOTI3NS04Mjc4YTZkNTM5NjA=` (base64 for `1787500705144263000|6b8ffdb8-07bd-45ee-9275-8278a6d53960`). Pagination was stuck.

The newest 20 results were all one-shot PR re-check routines (created Aug 23-27), completely hiding the daily-digest routines (created Aug 16). Tried fabricating earlier cursors — same page returned. The server ignores the cursor parameter entirely.

Workaround: user manually copied 14 trigger IDs from https://claude.ai/code/routines.

## Fix

Three-layer repair, applied simultaneously:

### 1. Rescue stuck articles: cherry-pick

Each branch had only 1-2 unique commits. Cherry-picked all 8 back to main with zero conflicts:

```bash
git cherry-pick 5b2622f5  # github digest
git cherry-pick f5b419b5  # product builder interview
git cherry-pick 9ee6b4be  # security alert
# ... 8 commits total
pnpm verify  # all green
git push origin main
```

### 2. Add `git checkout main` to skills (belt)

Added `git checkout main` before `git pull origin main` in all 15 daily-digest skills:

```bash
# Step 1: Preparation
git checkout main        # ← added
git pull origin main
```

Batch-applied with sed:

```bash
for f in .agents/skills/daily-digest-*/SKILL.md; do
  sed -i '' '/^git pull origin main$/i\
git checkout main
' "$f"
done
pnpm skills:sync
```

### 3. Remove `outcomes` from routine configs (suspenders)

Updated all 15 routines via `RemoteTrigger`'s `update` action, rewriting `session_context` without `outcomes`:

```json
{
  "job_config": {
    "ccr": {
      "session_context": {
        "allowed_tools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep"],
        "model": "claude-sonnet-5",
        "sources": [{"git_repository": {"url": "https://github.com/vincentxuu/quidproquo"}}]
      }
    }
  }
}
```

All 13 remaining updates sent in parallel, all returned HTTP 200.

## Root Cause

`outcomes` is a cloud routine config designed to direct session output to a specific feature branch — useful when you want PR-based review. For a personal blog that pushes directly to main, it creates an implicit trap:

1. The cloud environment checks out the outcomes branch after cloning
2. `git pull origin main` on a feature branch is a merge, not a branch switch
3. The agent may follow the branch it's on rather than the skill's `git push origin main` instruction
4. The arxiv routine "accidentally succeeded" because its agent happened to stay on main

The `outcomes` field's branch-checkout behavior is not documented — it was deduced by comparing run logs.

## Lessons Learned

- Cloud routine `outcomes` changes the session's starting branch. If your workflow pushes directly to main, don't configure `outcomes`.
- `git pull origin main` ≠ `git checkout main`. On a non-main branch, pull-from-main is just a merge.
- `get_run_log` is the most useful debugging tool for cloud routines — it shows every command the agent ran, which branch it was on, and where it pushed.
- The RemoteTrigger list API has a pagination bug (cursor never advances). Work around it with `get` and known trigger IDs.

## References

- [Claude Code Routines Management UI](https://claude.ai/code/routines)
- [Claude Code Official Documentation](https://docs.anthropic.com/en/docs/claude-code/overview)
- [RemoteTrigger API — built-in reference from /schedule skill](https://claude.ai/code) — API reference loaded when the `/schedule` skill is invoked
