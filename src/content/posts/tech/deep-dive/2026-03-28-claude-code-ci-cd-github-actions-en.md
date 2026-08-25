---
title: "Claude Code × GitHub Actions: Running an AI Agent in Your CI/CD Pipeline"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, ci-cd, github-actions, code-review, ai-agent, automation, dx]
lang: en
tldr: "Use claude-code-action to run Claude Code inside GitHub Actions — @claude auto-responds to PR/Issue comments, AI code review triggers on PR open, and release notes generate automatically after merge. Supports Anthropic API, AWS Bedrock, and Google Vertex AI. Define team standards with CLAUDE.md."
description: "A complete guide to setting up and using Claude Code GitHub Actions: from quick install with /install-github-app, @claude interactive mode, and automated prompt mode, to enterprise-grade integrations with AWS Bedrock and Google Vertex AI, plus the built-in Code Review feature."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 17
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions)

<!-- TODO: Pending content -->
<!-- Reference: https://code.claude.com/docs/en/github-actions.md -->
<!-- Reference: https://code.claude.com/docs/en/code-review.md -->
<!-- Reference: https://code.claude.com/docs/en/gitlab-ci-cd.md -->

## Planned Outline

### Why Use Claude Code in CI

- Instant PR creation: describe what you need, Claude opens a complete PR automatically
- Automated implementation: Issues become working code
- Follows team standards: reads CLAUDE.md behavioral guidelines
- Secure: code stays on the GitHub runner

### Quick Setup

- `/install-github-app`: one-click GitHub App + secrets installation
- Manual setup: install Claude GitHub App → add API key → copy workflow

### Basic Workflow

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Two Modes

- **Interactive mode**: @claude in a PR/Issue comment, Claude auto-responds
- **Automated mode**: specify instructions via the `prompt` parameter, runs automatically on every event

### Common Use Cases

- `@claude implement this feature based on the issue description`
- `@claude fix the TypeError in the user dashboard`
- `@claude how should I implement user auth for this endpoint?`
- Scheduled daily report: `cron: "0 9 * * *"`

### Action Parameters

| Parameter | Description |
|-----------|-------------|
| `prompt` | Instructions for Claude |
| `claude_args` | CLI flags (--max-turns, --model, etc.) |
| `anthropic_api_key` | API key |
| `trigger_phrase` | Trigger phrase (default: @claude) |
| `use_bedrock` / `use_vertex` | Cloud provider |

### GitHub Code Review

- Automatic AI code review on every PR (no @claude trigger required)
- Differences from claude-code-action

### Enterprise: AWS Bedrock & Google Vertex AI

- OIDC authentication (no stored credentials)
- Bedrock workflow configuration
- Vertex AI workflow configuration
- Custom GitHub App vs. official Claude App

### Cost Control

- GitHub Actions minutes consumption
- API token costs
- `--max-turns` limits
- Conditional triggers: only run on @claude
- Concurrency controls

### Security Best Practices

- Always store API keys in GitHub Secrets
- Principle of least privilege
- Review Claude's suggestions before merging
- Use CLAUDE.md to define behavioral boundaries

### Complementing Local Automation

- Local hooks: real-time quality checks
- CI Claude: deep review + cross-file analysis
- Scheduled tasks: periodic audits

## References

- [Claude Code GitHub Actions Official Docs](https://docs.anthropic.com/en/docs/claude-code/github-actions) — Complete GitHub Actions integration guide, including quick setup, Action parameters, and enterprise configuration
- [anthropics/claude-code-action on GitHub](https://github.com/anthropics/claude-code-action) — Official source code and README for claude-code-action, with usage examples
- [Claude Code — Code Review](https://docs.anthropic.com/en/docs/claude-code/code-review) — GitHub Code Review feature documentation and comparison with claude-code-action
- [Store Instructions and Memories](https://docs.anthropic.com/en/docs/claude-code/memory) — How to use CLAUDE.md to define team behavioral standards in CI environments
- [GitHub Actions Official Docs](https://docs.github.com/en/actions) — Complete GitHub Actions documentation, including workflow syntax, secrets management, and trigger events
- [AWS Bedrock — Anthropic Claude Integration](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html) — Official documentation for using Anthropic Claude on AWS Bedrock
- [Google Vertex AI — Claude Models](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-claude) — Official guide for using Claude on Google Vertex AI, for enterprise-grade CI/CD integration
