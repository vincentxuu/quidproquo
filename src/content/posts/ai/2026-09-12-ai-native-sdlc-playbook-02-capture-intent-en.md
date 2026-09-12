---
title: "AI-Native SDLC Playbook L2: intent.md Turns Requirements into Version-Controlled Documents"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, intent-md, requirements, context-engineering]
lang: en
tldr: "Traditional requirements scatter across Jira, Slack, and meeting notes, losing fidelity at every handoff. intent.md lets the originator collaborate directly with Claude to produce a human-readable, machine-actionable, version-controlled Markdown proto-spec — from conversation to committed document in hours, not weeks."
description: "AI-Native SDLC Playbook Lesson 2 guide: the intent.md format, its creation workflow, governance considerations, and how to land it with existing tools."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 2
---

The biggest problem in requirements management isn't "we can't write requirements." It's that **requirements lose fidelity at every handoff**.

An idea leaves someone's head, passes through backlog grooming, user story decomposition, story point estimation, and refinement meetings. By the time it reaches an engineer, the original intent has been translated at least three times. Each translation loses information, and no one can trace back to "what were we actually trying to solve."

According to [Claude Academy's second lesson](https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent), `intent.md` solves exactly this.

## What intent.md Is

`intent.md` is not a requirements specification, nor a user story. It's a **proto-spec** — a structured statement of "problem + expected outcome + constraints," co-authored by the originator (not necessarily an engineer) and Claude.

The course's example:

```markdown
# Intent: claims status self-service
Author: J. Ortiz (claims operations). Status: draft.

## Problem
Customers phone the contact center to ask where their claim is.
Handlers spend roughly a third of call time on status-only queries.

## Proposed outcome
Customers see claim status, next step and expected date in the portal.

## Affected users and systems
Claims handlers, portal team, claims-core API.

## Constraints
No new PII in the portal session. Existing authentication only.

## Open questions
Do third-party loss adjusters need access too?
```

Note the design choices:

- **Business language, not technical language.** The author doesn't need to know how to call an API
- **Explicit constraints** ("no new PII," "existing auth only") that become hard boundaries for the Design stage
- **Open questions** that explicitly acknowledge the document is incomplete and needs follow-up

## The Five-Step Workflow

According to the course, producing `intent.md` follows five steps:

1. **The originator describes the problem in natural language** — what can't be done today, who's affected, what should improve, what's out of scope. No formal format needed
2. **Brainstorm with Claude until concrete** — Claude asks analyst-level questions: scope, users, constraints, success criteria
3. **Ask Claude to write it as `intent.md` using the org template** — the template is defined as a skill by a technical team member, signed off by leadership
4. **The originator corrects any misunderstandings**
5. **Commit to a shared version-controlled repo** — git history records author, timestamp, and full revision history

One-time infrastructure setup:

- Claude access for non-engineering staff (claude.ai or Cowork)
- An agreed `intent.md` template
- A shared, version-controlled repo (single product: `intent/` folder; multi-repo: dedicated intent repo)
- For contributors unfamiliar with Git: a GitHub connector so Claude commits on their behalf

## How It Differs from Traditional Approaches

| | Traditional | AI-Native |
|---|---|---|
| Author | Analyst / PM writes; multiple handoffs | Originator co-creates with Claude |
| Format | Jira ticket / user story / meeting notes | Version-controlled Markdown |
| Timeline | Weeks (including refinement, estimation, prioritization) | Hours |
| Traceability | Scattered across systems | Complete git history |
| Machine-readable | No | Yes (direct input for the next stage) |

The biggest change is that **ownership never transfers**. In traditional processes, requirements go from originator → analyst → PM → engineer, with potential distortion at each handoff. `intent.md` keeps the originator as author, with Claude providing structural assistance.

## Governance: Git Is the Evidence Chain

The course keeps governance deliberately simple:

- **Evidence artifact**: the committed `intent.md` itself
- **Audit trail**: git history (author, timestamp, full diffs)
- **Decision record**: the product owner's accept (merge into Design) or reject (close review)

No additional approval tools needed. Git's merge/close action *is* the documented decision.

## How to Measure

The course recommends tracking two metrics:

- **Leading indicator**: time from first conversation to committed `intent.md` (from git history), expected to shrink from weeks to hours
- **Lagging indicator**: survival rate — the percentage of `intent.md` files the product owner accepts into Design. Also track how many times `intent.md` is modified after the first `spec.md` commit (fewer modifications = higher initial quality)

## Practical Observations

We used a similar concept in one project, just under a different name — we called it an "acceptance contract." The approach was converting Notion requirements into a numbered acceptance checklist stored in the repo at `.harness/spec-<slug>.md`, with subsequent reviews and audits checking each item.

Compared to the course's `intent.md`, our approach leaned more toward "acceptance criteria" than "problem statement." The course's design is better — write the problem first (intent), have Claude generate the spec, then derive acceptance criteria. This separation lets non-technical people participate in requirements capture without being forced to describe problems in technical language.

If starting over, I'd split the process into two steps: first, let the originator and Claude produce `intent.md` (problem and expectations only); then have a technical person work with Claude to transform the intent into an acceptance checklist.

## Getting Started

1. **Define a template**: take the course's example and adjust the sections for your organization (Problem / Proposed outcome / Affected users / Constraints / Open questions is a solid starting point)
2. **Package the template as a Claude skill**: so anyone chatting with Claude can trigger it with `/intent`
3. **Create an `intent/` folder in your existing repo**: no new tools needed — git is enough
4. **Run a pilot**: pick an upcoming small feature and let the business side produce `intent.md` directly with Claude; compare quality and time against the old process

Most importantly: **don't wait until the entire SDLC is AI-native before starting.** `intent.md` is standalone — even if Design, Build, and Test are still traditional, making requirements capture faster and traceable already delivers concrete value.

## References

- [Capture as intent.md — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
