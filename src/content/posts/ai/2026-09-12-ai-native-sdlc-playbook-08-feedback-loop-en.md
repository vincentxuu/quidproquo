---
title: "AI-Native SDLC Playbook L8: Give Claude a Feedback Loop"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, feedback-loop, testing, ci-cd]
lang: en
tldr: "Have Claude verify its own output before submitting — tests, builds, and screenshot diffs all run to completion before the task is marked done. Engineers receive code that's already passed verification, not code that 'might be correct.'"
description: "Claude Academy AI-Native SDLC Playbook Lesson 8 guide: how to build a feedback loop for agent self-verification, and how to use hooks to prevent the agent from weakening tests to make them pass."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 8
---

AI agents write code fast, but there's a gap between "written" and "correct." Traditional verification signals arrive too late — CI takes minutes, code review takes hours, production issues take days or weeks. If the agent only produces and humans do all the verification, the engineer becomes the bottleneck.

[Claude Academy Lesson 8](https://academy.claude.com/courses/ai-native-sdlc-playbook/give-claude-a-feedback-loop) boils down to one principle:

> "Always give Claude a way to verify its own work, whether tests, a build, or a screenshot diff."

## Feedback Loop ≠ Verifier Subagent

The course carefully distinguishes two concepts that are easily conflated:

- A **feedback loop** runs throughout the entire task — Claude writes, verifies, corrects, and verifies again, cycling until all checks pass
- A **verifier subagent** (from Lesson 7) is a separate role that does one comprehensive check at task completion

They're complementary, but the feedback loop is the more fundamental mechanism. Without it, Claude only learns whether its output is correct at the very end; with it, every step gets a signal.

## How to Build a Feedback Loop

### 1. Consolidate Verification into a Single Command

If verification requires three commands, two log inspections, and a manual page check, Claude will easily miss a step. The course recommends wrapping all verification into one target — like `make test` or `npm test` — that returns a non-zero exit code on failure.

### 2. Document It in CLAUDE.md

Verification commands, what healthy output looks like, and what counts as "passing" — all go in CLAUDE.md:

```markdown
## Verifying your work

- Build: make build (must finish with "Build succeeded")
- Test: make test (all green; never skip or delete a failing test)
- Lint: make lint (zero warnings)

Run all three before reporting any task complete, and paste the output.
If a test fails, fix the code, not the test.
```

The last line is the key: "If a test fails, fix the code, not the test." This is a rule that needs hook enforcement, discussed below.

### 3. Make Verification Targets Quantifiable

Vague instructions ("confirm the feature works") let Claude decide what "works" means. The course recommends specific, measurable targets:

- "All tests in `test_status.py` pass"
- "Screenshot matches the attached mock"
- "Endpoint returns 200 with the new field"

Claude can independently determine whether these conditions are met, no human intervention needed.

### 4. For Bug Fixes, Write Tests First

This is the most actionable advice in the lesson:

1. Have Claude reproduce the bug as a test
2. Confirm the test fails, and that the failure matches the bug
3. Commit this test
4. Ask Claude to fix the bug, but **prohibit editing the test file** (enforce with a hook)
5. When the test passes, the bug is proven fixed

The elegance: once the test is committed, Claude has no escape route of "editing the test to make it pass."

### 5. Use Visual Verification for UI Work

Frontend changes need visual confirmation. The course recommends providing browser or screenshot tools (via MCP) so Claude can see rendered results. A typical cycle is 2–3 rounds: change → screenshot → compare against mock → change again.

### 6. Protect the Loop from Weakening

The feedback loop's biggest risk is the agent weakening the checks themselves to make them pass — deleting failing tests, downgrading lint rules from error to warning, skipping screenshot comparisons. The course uses hooks to address this:

- Block test file edits during bug-fix tasks
- Check PRs for diffs that modify tests

## Practical Experience

In one of our projects, we implemented a similar concept. `pnpm verify` is our unified gate, automatically running lint, internal reference checks, and skill sync verification at pre-commit time. One command, non-zero exit blocks the commit.

Specific rules live in our CLAUDE.md's governance tiers:

- **Tier 1 (gate required)**: Every commit must pass `pnpm verify` — fix real issues, no `--no-verify`
- **Tier 3 (forbidden)**: Weakening checks to make them pass

We also implemented similar protections via hooks. Our `PreToolUse` hook inspects the files Claude attempts to edit, blocking operations that look like credential exposure or profile-rule violations. The `Stop` hook prints check results and diff line counts for every edited file before Claude finishes.

The effect was clear: before introducing the feedback loop, roughly 30% of commits would fail in CI (usually lint or broken references). After, that dropped to single-digit percentages — because Claude was already running verification locally.

## Governance and Evidence

The course emphasizes that the feedback loop is itself part of governance:

- `make test` output, build logs, and screenshot diffs are all artifacts Claude ran itself — they constitute evidence
- Session transcripts can be forwarded via OpenTelemetry to observability platforms
- Check run results in PRs are visible to reviewers and auditors
- Code owners can focus on intent and risk during review, since mechanical verification is already attached to the PR

## How to Measure Effectiveness

- **Leading indicator**: First-pass CI success rate for agent-written changes (CI systems already have this data)
- **Lagging indicator**: Review time per PR (from PR metadata) and change failure rate (from incident trackers)

Ideally, review time should decrease — because mechanical issues reviewers used to catch (lint, missing tests, broken builds) are now intercepted by the feedback loop.

## Getting Started

1. Wrap all verification steps into one command with a non-zero exit code on failure
2. List the command, expected output, and pass criteria in CLAUDE.md
3. Add a rule: "When a test fails, fix the code, not the test"
4. Enforce that rule with a hook — at minimum, block test file edits on bug-fix branches
5. After one week, check whether CI first-pass success rate has improved

## References

- [Give Claude a feedback loop — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/give-claude-a-feedback-loop)
- [Claude Code Hooks — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
