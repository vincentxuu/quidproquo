---
title: "Claude Code × Slack: Launch AI Development Tasks Directly from Team Conversations"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, slack, team-collaboration, ai-agent, automation, dx]
lang: en
tldr: "@Claude in Slack to describe a task, automatically kicks off a Claude Code web session → analyzes code → opens a PR. Turn a bug report into a fix without ever leaving Slack. Supports two routing modes: Code only and Code + Chat."
description: "An introduction to Claude Code's Slack integration: installation and setup, routing modes (Code only / Code + Chat), context collection from Slack threads, session flow, repository selection, and how it works alongside Claude Code on the web."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 20
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration)

<!-- TODO: To be written -->
<!-- Reference official docs: https://code.claude.com/docs/en/slack.md -->

## Planned Outline

### What is Claude Code in Slack
- @Claude a message in a Slack channel → automatically detects coding intent
- Launches a Claude Code web session → reports back to Slack when done
- Requires a Pro/Max/Teams/Enterprise plan + Claude Code on the web access

### Setup Steps
1. Install the Claude app from the Slack App Marketplace
2. Link your Claude account in App Home
3. Configure Claude Code on the web + GitHub
4. Choose a routing mode (Code only / Code + Chat)
5. `/invite @Claude` to add it to a channel

### Routing Modes
- **Code only**: All @mentions route through Claude Code
- **Code + Chat**: AI automatically determines whether the request is a coding task or a general Q&A
- If it routes incorrectly, you can "Retry as Code" or switch modes

### How It Works
1. @mention Claude with a coding request
2. Claude detects coding intent
3. Creates a Claude Code web session
4. Reports progress back in the Slack thread
5. @mentions you when done, with a summary and action buttons
6. Options: View Session / Create PR / Change Repo

### Context Collection
- Thread: reads all messages in the thread
- Channel: reads recent channel messages
- Automatically selects the appropriate repository

### Use Cases
- Bug investigation: reported in Slack → fixed directly
- Quick code review: revisions based on team feedback
- Collaborative debugging: uses context from Slack discussions to debug
- Parallel tasking: kick off a task in Slack and continue with other work

### Security & Permissions
- Each user authenticates with their own Claude account
- Sessions count against individual plan quotas
- Can only access repositories linked to your account
- Channel-based access control

### Best Practices
- Be specific (include file names, function names, error messages)
- Define a completion criterion (should it write tests? update docs? open a PR?)
- Use threads to accumulate context

## References

- [Claude Code in Slack — Official Docs](https://docs.anthropic.com/en/docs/claude-code/slack) — Complete guide to installation, routing modes, session flow, and security settings
- [Claude App — Slack App Marketplace](https://slack.com/marketplace/A07DNBDB84N-claude) — Official page to install the Claude app from the Slack App Marketplace
- [Claude Code on the Web — Official Docs](https://docs.anthropic.com/en/docs/claude-code/claude-code-on-the-web) — Explains the cloud session infrastructure that the Slack integration depends on
- [Claude for Slack — General Usage Docs](https://www.anthropic.com/news/claude-for-slack) — Feature overview and use cases for Claude for Slack
- [Claude Code GitHub Actions](https://docs.anthropic.com/en/docs/claude-code/github-actions) — Another way to trigger Claude Code tasks from external tools (CI/CD integration)
- [Claude Code Permissions — Official Docs](https://docs.anthropic.com/en/docs/claude-code/permissions) — Understanding session permission controls
- [Claude Plans & Pricing](https://claude.ai/upgrade) — Check which plans (Pro/Max/Teams/Enterprise) are required for the Slack integration
