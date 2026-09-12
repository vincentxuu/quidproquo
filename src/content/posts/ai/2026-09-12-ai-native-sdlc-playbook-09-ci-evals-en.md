---
title: "AI-Native SDLC Playbook L9: Continuous Evals in CI"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, evals, ci-cd, testing]
lang: en
tldr: "Evals are the AI-native equivalent of stage-gate QA — collect 20–50 real tasks as test cases, run them automatically whenever CLAUDE.md, skills, or hooks change, and block the merge if the pass rate drops. Every production incident becomes a permanent eval."
description: "Claude Academy AI-Native SDLC Playbook Lesson 9 guide: how to regression-test your agent's configuration in CI, and turn every incident into a permanent safety net."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 9
---

Lesson 8's feedback loop solved "verification within a single task" — Claude runs tests before submitting to confirm its output is correct. But there's a higher-level question: **when you change CLAUDE.md, update a skill, or adjust a hook, how do you know the agent's overall behavior hasn't regressed?**

[Claude Academy Lesson 9](https://academy.claude.com/courses/ai-native-sdlc-playbook/continuous-evals-in-ci) gives a direct answer:

> "Evals are the AI-native equivalent of stage-gate QA."

Traditional software uses unit tests and integration tests to ensure code changes don't break existing behavior. AI-native development needs a similar mechanism, but the test target isn't code — it's **the agent's configuration**.

## Why You Need Agent Evals

CLAUDE.md, skills, and hooks — these three things control agent behavior. Changing any of them can shift the agent's output:

- Remove "Money is always BigDecimal" from CLAUDE.md, and the agent might start using `double` for monetary amounts
- Change a security skill's trigger condition, and it may stop firing in certain scenarios
- Adjust a hook's matcher pattern, and it might miss operations it should block

Traditional unit tests won't catch these changes because the code itself hasn't changed — what changed is the behavior of the agent that produces the code.

## How to Build an Eval Suite

### 1. Collect Real Tasks

The course recommends gathering 20–50 tasks from recent actual work, each paired with expected outcomes or acceptance criteria. No need to fabricate test cases — your real PR history is the best source material.

### 2. Convert to Eval Structure

Each eval contains:
- **Prompt**: A task description (similar to the instructions the engineer originally gave Claude)
- **Acceptance checks**: Pass criteria like tests passing, clean lint, consistent behavior, policy compliance

### 3. Run Non-Interactively in CI

The course provides a GitHub Actions example:

```yaml
name: Agent evals
on:
  pull_request:
    paths: ['CLAUDE.md', '.claude/**']
  schedule:
    - cron: '0 2 * * *'
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @anthropic-ai/claude-code
      - name: Run eval suite
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for eval in evals/*.json; do
            claude -p "$(jq -r '.prompt' $eval)" \
              --allowedTools "Read,Edit,Bash(make test)" \
              --output-format json > result.json
            ./evals/check.sh "$eval" result.json
          done
```

Notable design choices:

- **Trigger conditions**: Only fires when PRs modify `CLAUDE.md` or the `.claude/` directory, plus a daily 2 AM scheduled run
- **Tool restrictions**: `--allowedTools` only grants Read, Edit, and restricted Bash (only `make test`) — the eval-running Claude doesn't get full system access
- **Non-interactive**: `claude -p` runs to completion; no human needs to monitor it

### 4. Set Pass Rate as a Merge Gate

Configure the eval pass rate as a merge check — if a skill change causes the pass rate to drop, the PR can't merge until the regressed cases are resolved.

### 5. Every Incident Becomes a Permanent Eval

This is the most valuable piece of the entire mechanism: every production incident gets converted into a permanent eval by the responsible team. That eval stays in the suite permanently, ensuring the same class of issue never recurs.

According to Anthropic, as AI capabilities improve, some evals that once discriminated between good and bad will lose their discriminating power — the model improves to the point where everything passes. So the eval suite needs continuous replenishment with new cases from monitoring to maintain discriminating power.

## Practical Experience

In one of our projects, we haven't built a full CI eval yet, but we have a basic version of the same concept: skills are edited in `.agents/skills/`, then synced to `.claude/skills/` (a read-only mirror) via `skills:sync`. `pnpm verify` checks both sides for consistency — if someone directly edits `.claude/skills/` without going through the proper flow, verification fails.

This is fundamentally "agent config change → automatic verification" in its most basic form, except it verifies file consistency rather than behavioral consistency.

To move toward the course's recommendation, the next steps would be:

1. Collect the 20 most recent development tasks with their prompts and expected outcomes
2. Write an `evals/check.sh` that compares Claude's output against expected results
3. Add a CI job that triggers whenever CLAUDE.md or skills are modified

## Scheduling Flexibility

The course acknowledges that not every team should run evals on every PR. Some organizations may be better served by offline scheduling — for example, running the full eval suite weekly rather than on every change. This depends on how frequently agent configuration changes and the API budget.

Per Anthropic: "Teams have discretion in scheduling. While the lesson provides instructions for continuous evaluations, some organizations may prefer running evals offline on set schedules rather than with every change."

## Governance

The eval mechanism is itself part of governance:

- Pass rate thresholds serve as merge checks with mandatory enforcement
- Every eval execution is logged, enabling comparisons across time
- Agent configuration changes require approval from responsible teams

## How to Measure Effectiveness

- **Leading indicator**: Eval pass rate trend over time, and time from production incident to corresponding eval creation (cross-reference incident tracker and git log)
- **Lagging indicator**: Regressions caught in CI vs regressions that reach production (compare incident tracker against eval records)

The ideal state: as the eval suite grows more comprehensive, the number of regressions reaching production steadily decreases.

## Getting Started

1. Pick 20 representative tasks from recent PR history; record the original prompt and acceptance criteria
2. Write a simple check script that validates whether Claude's output satisfies the criteria
3. Run it manually a few times to confirm the eval has discriminating power — can it distinguish a good CLAUDE.md from a bad one?
4. Once validated, add it to CI with a trigger on CLAUDE.md and `.claude/` changes
5. After each production incident, add a corresponding eval

## References

- [Continuous evals in CI — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/continuous-evals-in-ci)
- [Claude Code Non-Interactive Mode — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
