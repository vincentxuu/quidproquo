---
title: "AI-Native SDLC Playbook L6: Skills Turn Organizational Standards into Reusable Knowledge"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, agent-skills, claude-skills, governance]
lang: en
tldr: "A skill is organizational tacit knowledge made operational — a folder with a SKILL.md that Claude loads automatically when trigger conditions are met. The course's key principle: skills make violations rare; hooks make them nearly impossible."
description: "Claude Academy AI-Native SDLC Playbook Lesson 6 guide: what skills are, the five-step creation process, how to pair them with hooks, and lessons from maintaining 60+ skills."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 6
---

Every organization has standards that only veterans remember to follow: run the security checklist before shipping an API, make sure lint is green before opening a PR, follow specific steps for staging deployments. These standards usually live in wikis, onboarding docs, or a pinned Slack message. New hires don't know about them; AI agents know even less.

[Claude Academy Lesson 6](https://academy.claude.com/courses/ai-native-sdlc-playbook/skills-as-institutional-knowledge) argues that you should **package this tacit knowledge into skills so agents load and execute them consistently.**

## What the Course Teaches

### What a Skill Is

Per the course definition, a skill is **how an organization makes its institutional knowledge operational**. The instructions are explicit, version-controlled, broadly applied, and centrally updated when policy changes.

The course provides a clear decision rule:

> Institutional knowledge requiring consistent application → create a skill.
> Things that belong in CLAUDE.md or prompts → don't create a skill.

### Five-Step Creation Process

1. **Identify**: Find one piece of knowledge currently enforced inconsistently — security standards, API design conventions, or brand guidelines all qualify
2. **Write**: Create a folder with `SKILL.md` — frontmatter defines trigger conditions, body explains what to do. Engineers write from the policy owner's source of truth, with Claude's assistance
3. **Place**: Put it in `.claude/skills/<name>/` to ship with code, or distribute organization-wide via a plugin
4. **Test triggering**: Ask Claude to perform the relevant task in different ways and confirm the skill loads every time
5. **Update**: When policy changes, update the skill and get policy owner sign-off. Engineers pick up the new version automatically in their next session

### Example: API Security Review Skill

```markdown
---
name: secure-api-review
description: Apply the API security standard. Use whenever creating or
  modifying an external-facing endpoint, reviewing API code, or
  generating an OpenAPI spec.
---
# Secure API review
When you create or change an API endpoint:
1. Authentication: every endpoint requires the gateway JWT;
   no anonymous routes outside /health.
2. Input validation: validate request bodies against the OpenAPI
   schema and reject unknown fields.
3. Audit: every state-changing endpoint emits an audit event with
   actor, action, entity and timestamp.
4. Data classification: fields tagged pii in the schema must never
   appear in logs or error messages.
Run scripts/check-endpoints.sh and include its output in your summary.
```

This example shows the typical skill structure: **frontmatter defines when to trigger** (creating or modifying external-facing APIs) and **body defines what to do** (four checks plus an automated script).

### Skills vs Hooks: Advisory vs Deterministic

The course draws an important line here:

> "The skill makes violations rare and the hook makes them close to impossible."

Skills are **advisory controls** — Claude will "very likely" follow the skill's instructions when writing code, but it's not technically enforced. If a policy **must** hold, you need a hook behind the skill for deterministic enforcement.

Take the API security example: the skill tells Claude "every endpoint needs JWT authentication," while the hook scans for unauthenticated routes before commit — the former is prevention, the latter is the safety net.

### Build-Phase Hooks

The course also previews hooks appropriate for the build phase:

- Block edits to protected paths (generated classes, frozen packages)
- Run formatter and linter after file edits
- Keep credentials out of diffs
- Provide deterministic backing for policies that must always hold

Key constraint: **build-phase hooks must run fast and scope to the changed file**. Heavy checks like full test suites belong at commit or PR stage.

The course specifically notes: "A hook that asks a human for approval belongs with the gates in Stage 5: Deploy, because an approval prompt during the build puts a person back on the critical path of all the sessions running in parallel."

## Practical Experience: From 5 Skills to 60+

In one of our projects, we started with 5 skills and have now accumulated over 60. Key lessons:

### Skill Triggering Is the Biggest Challenge

The course lists "test triggering" as step four, but in practice it's the most time-consuming step. If the `description` field is too vague, Claude won't load the skill; too broad, and unrelated tasks trigger it. We iterated on trigger phrases until each skill's activation rate stabilized.

An effective approach: list explicit trigger keywords in the `description` rather than writing descriptive prose. For example, "Use when user mentions new model, PricingRule, pricing rule, credit, billing" triggers more reliably than "Use when relevant to pricing."

### Mirror Sync Mechanism

All our skill edits happen in `.agents/skills/`, synced to `.claude/skills/` via a `skills:sync` script — the latter is where Claude actually reads from, but hand-editing it is prohibited. The verify gate checks both sides for consistency and blocks the commit if they diverge.

This mechanism solves a practical problem: **when skill count grows large, "who changed what" needs a clear source of truth**. `.agents/skills/` is the only edit entry point; everything else is derived.

### Skill Lifecycle Management

60+ skills can't all stay current. Our approach:

- Each skill has an owner (usually the original author)
- Skills with persistently low trigger rates go on a cleanup list
- Skill rules fully superseded by hooks get removed from the skill (avoiding duplicate checks)
- When policy changes, update the skill first, then the code — order matters

## Getting Started

### Step 1: Start from One Pain Point

Don't build 10 skills at once. Find the **single most inconsistently enforced thing** on your team — maybe it's the PR checklist, API error-handling conventions, or the modification process for a specific module. Write one skill, test its triggering, and observe the effect over two weeks.

### Step 2: Involve the Policy Owner

Skill content should come from the policy owner (security lead, tech lead, API standards maintainer), not from developers guessing. The engineer's role is to translate policy into a `SKILL.md` format that Claude can understand.

### Step 3: Use Skills and Hooks Together

For rules where "the cost of failure is high" (security, compliance, sensitive data), don't rely on skills alone. The skill is the first line of defense (follow the rule while writing code); the hook is the second (enforce the check at commit/push time). Both layers together provide the best coverage.

### Step 4: Clean Up Regularly

Review monthly: Which skills have trigger rates that are too low (possibly a trigger-phrase problem)? Which skill rules have been superseded by hooks? Which skills reference outdated policy sources? Skills, like code, need maintenance — unmaintained skills rot.

## References

- [Skills as Institutional Knowledge — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/skills-as-institutional-knowledge)
- [Claude Code Skills — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
