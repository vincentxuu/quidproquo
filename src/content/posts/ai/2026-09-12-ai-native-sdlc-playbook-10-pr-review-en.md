---
title: "AI-Native SDLC Playbook L10: AI in the PR Review Loop"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, code-review, pr-review, governance]
lang: en
tldr: "Let AI handle the first review pass so humans can focus on intent and risk. This lesson covers how to define REVIEW.md, layer review passes, set up an automated review-comment fix loop, and why the agent that wrote the code must never approve its own PR."
description: "Claude Academy AI-Native SDLC Playbook Lesson 10 walkthrough: how AI fits into the PR review process, from REVIEW.md definitions and auto-fix loops to governance principles."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 10
---

PR review is one of the most labor-intensive parts of any development workflow. After an engineer finishes writing code, the PR sits in a queue waiting for a reviewer. The reviewer reads the diff line by line, leaves comments, the author pushes fixes, and the reviewer checks again — a few rounds later, a single PR can take days from open to merge.

This lesson tackles the problem head-on: **hand off the mechanical checks to Claude so human reviewers can focus on "does this change accomplish its goal" and "is the risk acceptable."**

## What the Course Teaches

### REVIEW.md: Defining Review Standards

The course introduces a new artifact — `REVIEW.md`, placed at the repo root and authored by the tech lead. It defines which passes Claude should run when reviewing a PR, how to classify finding severity, and what to skip.

From the course's example:

```markdown
# Review instructions
## Passes
Run three passes and tag each finding with its pass:
- Bugs: logic errors, broken edge cases, subtle regressions
- Security: injection risks, authentication gaps, PII in logs
- Compliance: the change matches spec.md, plan.md and our design principles

## What Important means here
Reserve Important for findings that would break behavior, leak data
or breach a policy. Style and naming are nits.

## Cap the nits
Report at most five nits per review; summarize the rest as a count.

## Do not report
Generated files under src/gen/ and anything CI already enforces.
```

The design is clever — it's not a generic review checklist but rather **your team's consensus on what matters, encoded as machine-executable instructions**.

### Two Directions of Review

Claude plays two roles in the PR review loop:

1. **Reviewing others' PRs**: Through the Managed Code Review service (enabled by admins per repo) or `claude-code-action` (running in CI), every PR gets consistent review passes with findings ranked by severity
2. **Responding to review comments on its own PRs**: When a reviewer tags `@claude` on a comment, Claude fixes the issue and pushes a new commit. The entire conversation stays in the PR thread

### Humans Still Hold Approval Authority

This is the most important governance principle: **findings themselves don't approve or block PRs**. Branch protection still requires human code owner approval. Claude provides intelligence, not decisions.

As the course puts it: "The agent that wrote code cannot approve it." The agent that authored the code cannot also serve as the approver — this ensures separation of duties.

### The Review Comment Auto-Fix Loop

This mechanism is the most practical part of the lesson:

1. A reviewer leaves a comment on the PR and tags `@claude`
2. Claude reads the comment, fixes the code, and pushes a commit
3. Both the fix and the original comment stay in the PR thread, forming a complete audit trail

Some teams wrap this into a custom slash command — it sweeps all unresolved comments and failing checks, addresses them one by one, pushes fixes, and keeps going until the PR is green with only code owner approval remaining.

### Feedback Loop to CLAUDE.md

The course emphasizes: when review keeps finding the same class of mistake twice, the correction should go into `CLAUDE.md` to prevent future PRs from repeating it. Reviews also flag when `CLAUDE.md` content has become outdated.

## Lessons from Practice

In a mid-sized project, we implemented a similar mechanism with a core design of **clean-context review** — spawning a fresh subagent that receives only the diff and the conventions, with zero visibility into the development conversation.

Why? Because when a developer reviews their own code in the same session, there's a bias where "I think I did it" gets mistaken for "I actually did it." A clean context forces the reviewer to examine only what actually exists in the diff.

Our reviewer bot also performs adversarial verification on each finding:

- **Real bug** → fix and push a commit
- **False positive** → explain with evidence why it's not a bug, then resolve
- **Uncertain** → escalate to a human

This three-way split focuses human reviewer attention on "things that need human judgment" rather than having them sift through a pile of findings on their own.

## Getting Started

1. **Write your `REVIEW.md` first**: It doesn't have to be perfect — start by writing down the 3 review passes your team cares about most. Bugs, Security, and Spec compliance are the most common starting points
2. **Enable the review comment loop**: This has the highest ROI — reviewers leave comments, Claude auto-fixes, saving the "author fixes → pushes → reviewer re-checks" round trips
3. **Set a nit cap**: The course recommends at most 5 nits per review, with the rest summarized as a count. This matters — too many nits drown out the important findings
4. **Don't skip the "code author can't approve" principle**: Even on small teams, ensure PR approval comes from a different person or a different context

## References

- [AI in the PR Review Loop — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/ai-in-the-pr-review-loop)
- [Claude Code Review — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/code-review)
- [AI-Native SDLC Playbook Course Overview](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
