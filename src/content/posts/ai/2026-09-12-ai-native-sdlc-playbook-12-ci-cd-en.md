---
title: "AI-Native SDLC Playbook L12: CI/CD Integration and Deployment"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, ci-cd, deployment, devops, governance]
lang: en
tldr: "Plug Claude into the CI/CD pipeline — start with read-only build failure triage, gradually add write operations behind existing gates, expose deployment tooling through MCP, and tier autonomy by environment. The governing principle is one sentence: 'The agent may act up to the production gate and cannot pass it.'"
description: "Claude Academy AI-Native SDLC Playbook Lesson 12 walkthrough: how to run Claude non-interactively in CI/CD pipelines, from build triage to deployment gates — the full implementation path."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 12
---

The previous lessons established review mechanisms (L10) and approval gates (L11). This lesson wires them into the CI/CD pipeline — running Claude non-interactively to make judgments, push fixes, and handle deployments, while always stopping at the production gate.

## What the Course Teaches

### Start Read-Only, Gradually Add Write Access

The implementation path is pragmatic — not all-at-once, but staged escalation of agent permissions within the pipeline:

**Step one: read-only judgment.** Platform engineers use `claude -p` in pipeline jobs for build failure triage, flaky test summaries, and changelog drafts. These are read-only operations with near-zero risk.

The course's pipeline step example:

```yaml
- name: Triage failed build
  if: failure()
  run: >
    claude -p "Read the build log at out/build.log. Identify the most
    likely cause, say whether the failure looks flaky or real, and write a
    three-line summary for the PR thread." >> triage.md
```

**Step two: gated writes.** Fix lint issues, update generated docs, address review comments. Agent writes arrive as PRs through branch protection — no direct path to push to main.

**Step three: sandboxed execution.** Agent jobs run in containers under network policy with short-lived scoped tokens and no production credentials by default.

### Exposing Deployment Through MCP

This is the lesson's most interesting architectural design — instead of letting the agent run deployment scripts, wrap deploy, status, and rollback as MCP tools, each scoped per environment.

The benefit: the agent's deployment capabilities become an allowlist rather than a pile of shell scripts with embedded credentials. The platform team controls what's on the allowlist; the agent can only operate through these tools.

### Tiered Autonomy by Environment

| Environment | Agent Permissions |
|-------------|-------------------|
| Development | Free to deploy |
| Staging | Middle ground (team-defined) |
| Production | Requires release manager authorization |

This tiering pairs with the hooks from L11 — the production deploy hook blocks the action without a `RELEASE_APPROVAL`.

### Rehearse Rollback Extensively

The course emphasizes that rollback should be the "most practiced path" in the pipeline. The reasoning is direct: L13 (Closing the loop on metrics) covers what happens when monitoring metrics breach control bands, and the agent needs to trigger a rollback. If the rollback path hasn't been validated in advance, no one will trust it in a real emergency.

### The Governing Principle

The entire lesson's governance boils down to one sentence:

> "The agent may act up to the production gate and cannot pass it."

Enforced through three mechanisms:

1. **Branch protection**: agent writes become PRs with no direct main push path
2. **Production deploy hook**: blocks until release manager authorizes
3. **Per-environment permission tiers**: define what the agent can do in each environment

## Lessons from Practice

In a mid-sized project, we haven't yet used Claude for in-pipeline triage, but we do use hooks as pre-commit gates. Our `pnpm verify` runs lint, reference checks, and skills-sync validation as a pre-commit hook — nothing gets committed unless it passes. This is the same concept as the course's "read-only judgment," just implemented differently: automated checks that reduce the burden on human review.

Our governance tiering also maps to the course's environment tiering:

| Our Tier | Corresponding Concept |
|----------|----------------------|
| Tier 0 (autonomous) | Free operations in dev environment |
| Tier 1 (gated) | Run verify before commit, like branch protection |
| Tier 2 (ask first) | Schema changes, deploys, CI modifications — the production gate |
| Tier 3 (forbidden) | Bypassing checks, writing unsourced facts — hard blocks in managed settings |

What we haven't done yet is "expose deployment through MCP" — our deploys are still manually triggered. But the course's MCP architecture is clearly the better approach: abstracting deployment capabilities from shell scripts into scoped tools is far safer than giving an agent direct shell access.

## Getting Started

1. **Start with build failure triage**: Add an `if: failure()` step that has Claude read the build log and output a three-line summary. Zero risk, immediate value
2. **Don't skip sandboxing**: Agent jobs in CI must have container isolation and short-lived credentials. Don't cut corners by using an engineer's personal API key
3. **Practice rollback first**: Don't wait for a real incident to run your first rollback. Practice it on staging until it's second nature, then give the agent permission to trigger it
4. **MCP over shell scripts**: If you're designing an agent's deployment path, wrapping it in MCP tools is better than granting shell access. Allowlists are safer than denylists

## References

- [CI/CD Integration and Deployment — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/ci-cd-integration-and-deployment)
- [Claude Code CLI Usage — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/cli-usage)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [AI-Native SDLC Playbook Course Overview](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
