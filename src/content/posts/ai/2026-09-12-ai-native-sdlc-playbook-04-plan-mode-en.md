---
title: "AI-Native SDLC Playbook L4: Plan Mode — Write the Plan Before Writing Code"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, plan-mode, context-engineering]
lang: en
tldr: "Claude Code's plan mode lets engineers produce a reviewable, version-controlled implementation plan (plan.md) before writing a single line of code. Design review shifts from the PR diff to the planning stage, and the cost of course-correcting drops from 'rewriting code' to 'editing a document.'"
description: "Claude Academy AI-Native SDLC Playbook Lesson 4 guide: why plan mode should be the default starting point for Claude Code sessions, and how plan.md becomes part of the audit trail."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 4
---

Most engineers, upon receiving requirements, open their editor and start writing. That's rational in traditional development — the design in your head is visible only to you, and writing is how you surface it for discussion. But when Claude Code becomes the executor, the cost structure flips: **having AI draft a plan first is an order of magnitude cheaper to revise than having AI draft code.**

[Claude Academy's fourth lesson](https://academy.claude.com/courses/ai-native-sdlc-playbook/plan-mode) positions plan mode as the default starting point for Claude Code sessions — not an optional feature. This article unpacks the lesson's core concepts with practical observations on why "plan first" isn't just a good habit but foundational infrastructure for the AI-native SDLC.

## What the Course Teaches

### How Plan Mode Works

In plan mode, Claude can read the entire codebase but **cannot modify any files.** The engineer feeds in the previous stage's `intent.md` (requirements) and `spec.md` (specification) and asks Claude to produce an implementation plan covering:

- Which files will change
- The execution order
- Which tests prove the change is correct
- Potential risks

The engineer can interrogate the plan: "What could this change break?" "Which step is riskiest?" "What alternatives did you consider and reject?" — iterating until the plan is clear enough that **any engineer who hasn't seen the conversation could implement from it alone.**

### plan.md's Role

The approved plan is committed as `plan.md`, joining `intent.md` and `spec.md` in version control. According to the course, this document serves three purposes:

1. **Audit trail**: who approved the plan and when is recorded in git history
2. **PR review baseline**: Stage 5 (Deploy) PR review checks the final diff against `plan.md` for consistency
3. **Implementation guide**: with a solid plan, Claude's implementation is typically a single pass with no back-and-forth

The course specifically emphasizes: **when implementation diverges from the plan, update `plan.md` in the same commit.** It even suggests using a hook to enforce synchronization.

### From Plan Mode to Auto Mode

The course also covers the advanced trajectory: as guardrails mature (a tuned `CLAUDE.md`, skills encoding org policies, hooks blocking unsafe actions, a comprehensive test suite), auto mode becomes the default for routine work.

As the course puts it: "The shift is now away from the user watching the agent make the edits and reviewing actions, toward the review of artifacts after longer autonomous sessions." This transition is gradual — build trust through plan mode first, then progressively loosen to auto mode.

### Coexisting with Legacy Systems

The course pragmatically addresses legacy systems. Most organizations don't track requirements in Markdown — they use Jira, ServiceNow, or Confluence. The course offers three coexistence patterns:

| Pattern | Source of Truth | Best For |
|---------|----------------|----------|
| Repo as primary | Markdown is authoritative; Jira holds links | Engineering-led orgs |
| Legacy as primary | Jira is authoritative; Markdown is working copy | Compliance/audit requirements |
| Bidirectional links | Both sides hold each other's ID/SHA | Minimum bar during transition |

## Practical Observations: Plan-First in the Real World

In a mid-sized project we maintain, the development entry point is plan-first: after receiving requirements, we confirm design direction in plan mode — which files to change, testing strategy, potential risk points — and only enter build after confirmation.

Some observations:

**Plan quality depends on CLAUDE.md quality.** If `CLAUDE.md` doesn't document architecture conventions and known landmines, Claude's plans will miss project-specific constraints. We once had Claude plan modifications to a frozen legacy module because `CLAUDE.md` didn't say "this module is untouchable." After adding that note, it never happened again.

**Plan mode is the best onboarding tool for newcomers.** Someone unfamiliar with the codebase chatting with Claude in plan mode is effectively getting a guided codebase tour. Faster than reading docs, safer than directly modifying code.

**"Single pass" requires a sufficiently specific plan.** The course says "implementation is often a single pass," and that's true when the plan is written at the file level. But if the plan only states a direction ("add an API endpoint"), Claude's implementation will still need back-and-forth. **A good plan.md reads like a TODO list, not meeting minutes.**

## Getting Started

### Step 1: Build the Plan Mode Muscle

You don't need the full pipeline (intent.md → spec.md → plan.md) from day one. Start with one habit: **every new Claude Code session, enter plan mode first.** Ask Claude "how are you going to approach this," evaluate whether the plan makes sense, then decide whether to let it execute.

### Step 2: Save the Plan

Even if you don't use the name `plan.md`, commit the approved plan to version control. When a PR gets questioned — "why did you change it this way?" — a pre-existing plan is far more convincing than a post-hoc explanation.

### Step 3: Use a Hook to Prevent Plan-Implementation Drift

The course recommends hooks to keep `plan.md` synchronized with actual changes. A simple approach: at commit time, check whether modified files fall outside the scope listed in `plan.md` and warn if they do.

### On Timing the Switch to Auto Mode

The course's advice is pragmatic: build the guardrails first (`CLAUDE.md` + Skills + Hooks + tests), then gradually loosen to auto mode. If you're still at "I need to watch Claude edit every file," the guardrails aren't ready — go back and strengthen `CLAUDE.md` and hooks rather than forcing auto mode.

## References

- [Claude Code Plan Mode — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/plan-mode)
- [Claude Code Memory (CLAUDE.md) — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
