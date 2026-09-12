---
title: "AI-Native SDLC Playbook L11: Hooks as Approval Gates"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, hooks, governance, security, enterprise]
lang: en
tldr: "Hooks are the governance bedrock of the AI-native SDLC — deterministic gates that intercept agent actions and block them if conditions aren't met. This lesson walks from a single production-gate script to full enterprise managed settings covering permission lockdown, sandboxing, credential isolation, and marketplace allowlists. The most technically dense lesson in the entire course."
description: "Claude Academy AI-Native SDLC Playbook Lesson 11 walkthrough: how hooks evolve from build-phase guardrails to deploy-phase approval gates, plus a full breakdown of managed settings for regulated enterprises."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 11
---

The CLAUDE.md and Skills introduced in earlier lessons are advisory — Claude *should* follow them, but technically can choose not to. Hooks are different. **Hooks are deterministic** — they trigger shell commands before or after an agent acts, and a non-zero exit code blocks the action. No negotiation.

This is the most technically dense lesson in the entire AI-Native SDLC Playbook, escalating from a simple production gate script all the way to a complete managed settings template for regulated enterprises.

## What the Course Teaches

### Build-Phase Guardrails vs Deploy-Phase Gates

The course draws an important distinction:

- **Build-phase hooks** (introduced in L6): fast, automated guardrails. Block edits to protected paths, run formatters/linters after writes, keep credentials out of diffs. No human involvement needed
- **Deploy-phase hooks**: pause actions pending approval from designated personnel. This is the lesson's focus — release gating

As the course puts it: "A hook that asks a human for approval belongs with the gates in Stage 5: Deploy, because an approval prompt during the build puts a person back on the critical path of all the sessions running in parallel."

Pragmatic reasoning — if you require human approval during the build phase, all your parallel sessions stall waiting.

### A Basic Production Gate

The course provides a simple but complete example:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/production-gate.sh" }
        ]
      }
    ]
  }
}
```

With the corresponding gate script:

```bash
#!/bin/bash
cmd=$(jq -r '.tool_input.command' < /dev/stdin)
if [[ "$cmd" == *"deploy"* && "$cmd" == *"production"* ]]; then
  if [ -z "$RELEASE_APPROVAL" ]; then
    echo "Production deploys need a release authorization." >&2
    exit 2   # exit 2 blocks the action
  fi
fi
exit 0
```

`exit 2` blocks the action, and the error message shows up in Claude's output, telling both Claude and the user why it was blocked and how to get approval.

### Team Hooks vs Managed Settings

Hooks exist at two levels:

1. **Team hooks**: live in `.claude/settings.json`, travel with the repo, visible and editable by team members
2. **Managed settings**: administered by platform or IT teams, individual engineers cannot disable them

For regulated enterprises, managed settings are the real defense line.

### Enterprise Managed Settings Breakdown

This is the most valuable section of the lesson — the course provides a complete managed settings template covering seven control dimensions:

**Permission control**: `permissions.deny` blocks sensitive files from entering agent context and shuts down uncontrolled network egress; `permissions.allow` pre-approves safe operations to reduce approval fatigue. `disableBypassPermissionsMode` combined with `allowManagedPermissionRulesOnly` ensures no engineer, project file, or CLI flag can expand the permission scope.

**Sandboxing**: reinforces permission controls at the OS level. Even if tool-level `WebFetch` is denied, shell commands could theoretically still access the network — the sandbox's domain allowlist closes that gap too. `failIfUnavailable` and `allowUnsandboxedCommands` make the sandbox mandatory — Claude Code refuses to launch without it.

**Credential isolation**: the `credentials` section denies reads to `~/.ssh`, `~/.aws/credentials`, and similar paths, and strips specified environment variables from the sandboxed command environment.

**Hook lockdown**: `allowManagedHooksOnly` ensures only hooks defined in managed settings run; hooks from user, project, and local settings are all disabled.

**Plugin source control**: `disableSideloadFlags` and `strictKnownMarketplaces` restrict skills, agents, hooks, and MCP servers to organization-approved marketplaces only.

**MCP allowlist**: `allowManagedMcpServersOnly` locks the agent's tool surface to a platform-team-managed allowlist.

**Version pinning**: `requiredMinimumVersion` blocks unevaluated Claude Code versions from running.

## Lessons from Practice

In a mid-sized project, we use a two-layer hook setup:

**PreToolUse hook**: intercepts operations that violate conventions based on the file's profile (frontend/backend). For example, frontend code shouldn't directly call certain HTTP utility functions, and no file should contain strings that look like credentials. These are build-phase guardrails — automated, no human involvement.

**Stop hook**: before Claude finishes its work, prints check results for every modified file along with a diff line-count summary. This doesn't block anything — it forces a structured "change manifest" so the engineer has a checkpoint before proceeding.

Pitfalls we hit:

- Hook script speed matters — if a PreToolUse hook takes 2 seconds and Claude triggers it 30 times per minute, your dev velocity tanks. Build-phase hooks should run in milliseconds
- When a hook blocks an action, it must tell Claude why. If it just does `exit 2` with no message, Claude will keep retrying the same blocked action

## Getting Started

1. **Start with one hook**: Don't set up 20 hooks at once. Add the most important one — usually "block direct production deploys" or "block credentials from entering diffs"
2. **Build hooks should be fast, deploy hooks can wait**: Build-phase hooks must not include human approval steps; deploy-phase hooks are where those belong
3. **Error messages are part of hook design**: When a hook blocks an action, the message should tell Claude (and the engineer) why it was blocked and how to get approval
4. **If you're in a regulated industry**: Start directly with managed settings, not team hooks that you gradually add to. Managed settings are unbypassable; team hooks are not

## References

- [Hooks as Approval Gates — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/hooks-as-approval-gates)
- [Claude Code Hooks Guide — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code Settings Reference — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/settings)
- [AI-Native SDLC Playbook Course Overview](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
