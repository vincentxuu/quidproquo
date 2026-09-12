---
title: "AI-Native SDLC Playbook L13: Closing the Loop with Monitoring"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, monitoring, metrics, autonomous-agent, devops]
lang: en
tldr: "Stage 6 is both the endgame and the starting point of the AI-Native SDLC: a monitoring script detects an anomaly → Claude writes a diagnosis as intent.md → it flows through the entire development pipeline. Humans shift from 'starting work' to 'triaging and reviewing work.'"
description: "Claude Academy Lesson 13 walkthrough: how monitoring loops let AI agents autonomously detect anomalies, produce intent.md files, and drive the entire SDLC pipeline, with Western Electric rules and tiered response configuration."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 13
---

Every mechanism built across the first 12 lessons — intent.md, spec.md, plan mode, CLAUDE.md, Skills, Hooks, CI evals, PR review — comes together in this lesson as a loop. The core argument of Stage 6: Maintain is: **when every stage has agent participation, anomalies detected by monitoring can automatically become intent.md files and flow through the entire pipeline**. Humans no longer need to initiate work — they just triage and review what the agent produces.

This is the most ambitious lesson in the course, and the one that requires all preceding infrastructure to be in place before execution.

## What the Course Teaches

### From Reactive Response to Proactive Loop

Traditional operations are reactive: an alert fires at 3 a.m., an engineer wakes up to check dashboards, manually investigates, writes a post-mortem, and schedules the fix for the next sprint — if there's time. Many post-mortem action items end up buried in the backlog forever.

The AI-native approach has monitoring scripts automatically invoke Claude when anomalies are detected. As the course puts it: "People triage and review that work, and no longer have to start it." The human role shifts from "initiating work" to "triaging and reviewing work."

### Detection Scripts: Deterministic, No Models

The course specifically emphasizes that detection scripts are **completely deterministic** — they calculate rolling baselines using mean + standard deviation and apply [Western Electric rules](https://en.wikipedia.org/wiki/Western_Electric_rules) to determine deviations. No LLM involvement whatsoever. This matters: you don't want a probabilistic model deciding whether to trigger another probabilistic model.

Detection targets can be any metric with a stable baseline:
- CI test failure rate
- Post-deploy 5xx error rate
- PR merge cycle time

### Tiered Response: bands.yaml

The course defines three response tiers in a version-controlled config file:

```yaml
metric: ci_test_failure_rate
baseline: rolling_30d
rules: western_electric
tiers:
  1sigma: { action: log }
  2sigma: { action: diagnose,
            tools: "Read,Grep,Bash(gh run view *)" }
  3sigma: { action: propose,
            routes: [pull_request, runbook:rollback-deploy] }
```

- **1σ**: log only, take no action
- **2σ**: Claude runs in read-only diagnostic mode — reads logs, examines code, identifies causes
- **3σ**: Claude may act — open PRs or trigger pre-approved runbooks (e.g., rollback)

The elegance of this design: **don't waste tokens on low signals; only let the agent act on high signals**. And even then, the agent's actions are still constrained by hooks — PRs it opens go through the review gate, and runbooks it triggers are pre-approved.

### Agent Output: intent.md

Regardless of which tier fires, Claude's final output is always an intent.md — same format as taught in L2: what the anomaly is, supporting evidence, proposed remediation, affected systems, and open questions. This intent.md enters a triage queue where service owners or on-call engineers decide: fix now, schedule it, or dismiss (dismissals feed back to adjust band thresholds and reduce future noise).

If the decision is to fix, the intent.md flows through the full pipeline: spec.md → plan.md → implementation → testing → PR review → deployment. **Same process, just triggered by the monitoring system instead of a person.**

### Claude Tag: Real-Time Response in Slack

The course also introduces Claude Tag (currently in public beta, supporting Slack) — adding Claude to a Slack channel as a member. When incidents occur, Claude can provide immediate first responses in threads: checking metrics, verifying hypotheses, writing post-mortems. The channel history itself becomes an auditable record.

## Lessons from Practice

Honestly, we haven't built the "fully automated monitoring loop" the course describes. But we do have a manual version of Stage 6.

Our approach is periodically running a process that pulls recent PR review artifacts across three repos — what got blocked, what got missed, what got misjudged — categorizes them into an evidence table, and writes conclusions back as three types of corrections:

1. **PR state convergence**: which PRs are still stuck and need attention
2. **Repo rule files**: update CLAUDE.md or lint rules
3. **Dev tooling gates/reviewers**: adjust hook judgment logic

This is logically identical to Stage 6: **find patterns in outputs, feed corrections back into the system that produced those outputs**. The difference is we trigger it manually; the course teaches triggering via detection scripts.

Moving from the manual version to automated requires not so much technical capability (detection scripts aren't hard to write) but **trust in agent output quality**. When your feedback loop (L8) and CI evals (L9) aren't mature enough, letting an agent auto-open PRs at 3σ carries too much risk. Stage 6 assumes all 12 preceding lessons' infrastructure is solid.

## Getting Started

### Step 1: Pick One Metric

Don't try to monitor everything at once. Choose one metric with a stable rolling baseline — CI test failure rate is usually the best starting point because the data is clean, the baseline is stable, and false positives are easy to identify.

### Step 2: Start with 1σ + 2σ Only

Don't enable 3σ automated actions yet. Let the detection script run for a while and validate:
- Whether 1σ logs are capturing meaningful signals
- Whether 2σ Claude diagnostics are accurate

Use the course's measurement approach: track time from band breach to intent.md appearing in the triage queue, compared to historical time from incident discovery to post-mortem action items.

### Step 3: Run the Manual Version First

Before turning on automation, manually run the "pull PR review artifacts → categorize → write back rules" loop. This builds intuition: which patterns recur, which rule corrections actually work, which are just noise. With that intuition, you'll know how to set your bands.yaml thresholds.

### Step 4: Measure Loop Effectiveness

The course's lagging indicator is practical: **fix survival rate** — how many findings actually become merged PRs, and whether the recurrence rate of similar incidents declines. If the finding-to-PR ratio is low, the detection script is producing too much noise; if similar incidents keep recurring, the fixes aren't actually solving the problem.

## References

- [The AI-Native SDLC Playbook — L13: Closing the loop on metrics](https://academy.claude.com/courses/ai-native-sdlc-playbook/closing-the-loop-on-metrics)
- [Western Electric rules — Wikipedia](https://en.wikipedia.org/wiki/Western_Electric_rules)
- [Claude Code Monitoring (OpenTelemetry) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/monitoring)
- [Claude Tag — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-tag)
- [AI-Native SDLC Playbook Course Overview](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
