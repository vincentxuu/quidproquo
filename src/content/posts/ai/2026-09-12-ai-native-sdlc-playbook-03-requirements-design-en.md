---
title: "AI-Native SDLC Playbook L3: Requirements and Design Collapse into One Session"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, spec-md, requirements, design]
lang: en
tldr: "Traditionally, requirements analysis and design are separate phases run by different teams — every handoff loses information. This lesson's approach: Claude reads intent.md in a single session, applies organizational standards (brand, security, compliance, UX loaded as skills), and produces a unified spec.md. The product owner reviews; they don't author."
description: "AI-Native SDLC Playbook Lesson 3 guide: how requirements and design merge into one phase, the spec.md creation workflow, and how policy conflicts surface at spec time instead of during review."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 3
---

In traditional development, requirements and design are two separate phases. Analysts formalize concepts into requirements documents; designers translate those requirements into designs — two teams, two handoffs, two documents. Clear accountability, but slow and lossy.

[Claude Academy's third lesson](https://academy.claude.com/courses/ai-native-sdlc-playbook/requirements-and-design) proposes: **merge both phases into a single Claude-driven session.**

## From intent.md to spec.md

Once the product owner approves the previous stage's `intent.md` (see [L2: intent.md Turns Requirements into Version-Controlled Documents](/posts/ai/2026-09-12-ai-native-sdlc-playbook-02-capture-intent)), the next step is producing `spec.md` — a document that unifies requirements and design into one specification.

The course's workflow:

1. **The product owner opens a Claude session**, loads organizational skills (brand guidelines, security policies, compliance requirements, UX standards), and attaches the `intent.md`
2. **Prompts Claude** to read the intent, generate a complete `spec.md` constrained by loaded skills, and flag any conflicts it cannot resolve
3. **Reviews the spec**: does it address the original problem? Are open questions from `intent.md` resolved or explicitly carried forward?
4. **Handles flagged conflicts first** — these are the issues an analyst would have escalated, e.g., a security policy's encryption requirements conflicting with performance needs. The product owner coordinates with policy owners to resolve them at this stage
5. **Commits `spec.md`** alongside `intent.md`, documenting both "what was requested" and "what was decided"
6. **Decides whether to proceed to Build** — the product owner makes the call; high-risk items involve a tech lead. This decision is always made by a human

The course's example prompt:

> "Read the attached intent.md and produce a requirements and design spec for integrating it into our existing codebase. Apply the skills available to you so the plan conforms to our brand guidelines, security policies and UX standards. Document the spec fully as spec.md, ready to hand to the engineering team. Describe clearly any areas of concern, especially where you cannot satisfy contradicting policies."

## Automation Potential

The course mentions an advanced approach: **set up spec generation as a non-interactive automated job.** When `intent.md` is merged into the repo, a CI job triggers Claude to generate `spec.md` and submit it as a PR. The product owner's first involvement is reviewing that PR rather than authoring from scratch.

This is one of the dividing lines between AI-native and AI-assisted: not "use AI to help a person write specs" but "AI writes first, humans review." The role shifts from **author** to **reviewer**.

## The Frontend Path

The course specifically highlights frontend as the clearest application. The flow:

1. After `intent.md` approval, the product owner creates design mockups in Claude Design (beta) based on the intent
2. Iterates on mockups within Claude Design
3. Exports to Claude Code for implementation

Unlike traditional Figma → dev handoffs, design and implementation use the same toolchain — spec fidelity loss approaches zero.

## Policy Conflicts Surface Early

This lesson's most valuable insight: **policy conflicts are discovered at spec time, not weeks later during review.**

In traditional workflows, security, compliance, and UX requirements are checked by different teams at different points. A PR enters review only to get rejected by security — "this endpoint can't allow anonymous access" — after the engineer has already spent three days coding.

The AI-native approach encodes those policies as skills applied as constraints during spec generation. If Claude finds a conflict between brand guidelines and security policy, it flags it in `spec.md`, and the product owner sees it during review. As the course puts it: "Policy conflicts surface during spec creation rather than weeks later during review."

## Governance Design

Like [L2](/posts/ai/2026-09-12-ai-native-sdlc-playbook-02-capture-intent), governance is deliberately simple:

- **Evidence**: the `spec.md`, the prompt that generated it, and the skill versions active at the time — all in version control
- **Audit**: git history records who approved what and when
- **Decision**: product owner approves the spec; high-risk items require tech lead co-approval

## How to Measure

- **Leading indicator**: time from `intent.md` commit to `spec.md` commit (calculated directly from git timestamps), compared against the previous requirements + design cycle
- **Lagging indicator**: requirements rework after build begins — count `spec.md` commits dated after the first `plan.md` commit for the same change. Fewer = higher spec-stage quality

## Practical Observations

In one project, our approach was to have Claude generate an implementation plan in plan mode, with human review before entering build. The difference from the course: we didn't explicitly separate requirements and design into `intent.md` and `spec.md` — we jumped from a Notion requirements doc straight to an implementation plan.

In retrospect, missing the `spec.md` layer caused problems. Several times we discovered mid-build that a constraint from the requirements hadn't been factored into the design. A formal spec stage would have surfaced those conflicts earlier.

Another observation: the course's emphasis on skill-as-constraint (treating policies as constraints during spec generation) is extremely practical. We eventually adopted a similar approach — loading the team's coding standards and review checklist as skills in the Claude session, so Claude proactively avoids known pitfalls when writing plans.

## Getting Started

1. **You don't need intent.md in place first**: even without a formal intent workflow, you can start from existing requirements (Jira tickets, Notion pages, Slack threads) and have Claude produce `spec.md`
2. **Encode your most-violated policies as skills first**: if your team repeatedly gets flagged by security or compliance, encode those rules as skills so Claude applies them at spec time
3. **Run a pilot on one small project**: pick an upcoming feature, try "Claude generates spec → human reviews → proceed to build," and record time and quality differences
4. **Keep spec alongside intent**: regardless of your requirements tool, `spec.md` should live in the same repo/folder as `intent.md` so later reviews can compare "what was asked" against "what was decided"

The most important mindset shift: **the product owner's role changes from "spec author" to "spec reviewer."** This isn't laziness — review requires no less judgment than authoring, but it's significantly faster.

## References

- [Requirements and design — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/requirements-and-design)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Claude Design — Anthropic](https://docs.anthropic.com/en/docs/claude-design)
- [AI-Native SDLC Playbook L2: intent.md Turns Requirements into Version-Controlled Documents](/posts/ai/2026-09-12-ai-native-sdlc-playbook-02-capture-intent)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
