---
title: "GitHub Copilot CLI: An Agent That Runs on GitHub the Platform"
date: 2026-08-19
type: project
category: tech
tags: [github-copilot, coding-agent, ai-tools, cli, mcp, pricing]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 14
tldr: "Copilot CLI went GA on 2026-02-25 and is included in every Copilot plan, Free included. Its differentiator isn't the agent — it's the GitHub integration: a built-in GitHub MCP server that works on issues and PRs, org policies inherited automatically, and an `&` prefix that hands work to the cloud coding agent. Billing runs on GitHub AI Credits (1 credit = $0.01): Pro $10/mo includes $15, Pro+ $39 includes $70, Max $100 includes $200."
description: "Installing GitHub Copilot CLI, its plan and autopilot modes, /fleet parallel subagents, built-in custom agents, AI Credits billing, and how it differs from other terminal agents."
draft: false
---

🌏 [中文版](/posts/tech/2026-08-19-github-copilot-cli)

If your team already pays for GitHub Copilot, you already have a terminal agent — you may just not have opened it.

Copilot CLI entered public preview in September 2025 and went **generally available on February 25, 2026**, included in every Copilot plan, free tier included. This post covers whether it's worth switching to, and where its real differentiation lies.

## The differentiator isn't the agent, it's the platform

Up front: plan mode, autopilot, subagents, hooks, skills, MCP — every other tool in this series has these. You can't tell them apart from a feature list. **What sets Copilot CLI apart is that it lives on GitHub.**

Concretely, three things:

**A built-in GitHub MCP server.** Not "it supports MCP so you can wire it up" — it ships configured. You can say "find the open issues related to this change" and it searches issues, reads labels and activity, and summarizes scope without you opening a browser. The objects it works on are issues, branches, and PRs, not just local files.

**Org policies are inherited automatically.** The CLI picks up your organization's existing Copilot governance — branch protections, required checks, and model availability allowlists all still apply. For a company already on Copilot Business or Enterprise, adopting a terminal agent doesn't mean a fresh security review. (The cost: on Business/Enterprise an admin has to enable Copilot CLI on the Policies page first; individuals can't turn it on themselves.)

**Local and cloud are interchangeable.** Prefix any prompt with `&` and the work is handed to the cloud-based Copilot coding agent in the background, freeing your terminal; `/resume` switches between local and remote sessions. You can also start a cloud agent session on github.com and pull it down locally to continue.

## Installation and basics

```bash
npm install -g @github/copilot
copilot
```

Homebrew, WinGet, a shell script, and standalone executables are also available; the Homebrew, WinGet, and install-script paths self-update. It runs on macOS, Linux, and Windows (PowerShell 6+), and ships in the default GitHub Codespaces image.

Run `/init` first to generate project-tailored Copilot instructions. Authentication uses your existing GitHub account, with OAuth device flow, GitHub CLI token reuse, and CI/CD-friendly `GITHUB_ASKPASS` also supported.

## Three levels of autonomy

`Shift+Tab` cycles between modes:

| Mode | Behavior |
|---|---|
| Default | Every file-modifying or command-executing tool call needs approval; you can approve a tool for the whole session |
| **Plan** | Analyzes the request, asks clarifying questions, and produces a structured implementation plan before writing code |
| **Autopilot** | Runs to completion without step-by-step approval |

For full autonomy there's `--allow-all` / `--yolo`, but the more interesting control is **`/sandbox enable`**: it doesn't sandbox the CLI itself — it restricts what **the commands and tools Copilot runs on your behalf** can reach in your filesystem, network, and system capabilities. That distinction matters: the sandbox constrains the hands, not the head.

## Built-in custom agents

Copilot CLI ships with a set of specialized subagents the model delegates to when it judges that worthwhile:

| Agent | Job |
|---|---|
| Explore | Fast codebase analysis without consuming your main context |
| Task | Runs tests and builds; brief summary on success, full output on failure |
| General purpose | Complex multi-step work in a separate context |
| Code review | Surfaces only genuine issues, minimizing noise |
| Research | Deep research across your codebase, related repos, and the web, with citations |
| Rubber duck | A constructive critic, consulted automatically by the CLI |

Rubber duck deserves its own note: it doesn't appear in the `/agent` picker — Copilot consults it on your behalf when it wants a second opinion. **Shipping a built-in contrarian** is the most unusual entry on that list.

`/fleet` goes the other direction: run the same task across multiple subagents in parallel, optionally on different models, then converge on one decision-ready result you choose to apply.

Custom agents are Markdown files (`.agent.md`) definable at the user level (`~/.copilot/agents`), repo level (`.github/agents`), or org/enterprise level (an `/agents` directory in the `.github-private` repo).

## Billing: AI Credits

This is the easiest part to get wrong. Copilot bills in **GitHub AI Credits, where 1 credit = $0.01 USD**:

| Plan | Monthly | Included credits |
|---|---|---|
| Free | $0 | Limited; includes Copilot CLI and agent mode |
| Pro | $10/user | $15 |
| Pro+ | $39/user | $70 |
| Max | $100/user | $200 |
| Business / Enterprise | Separate | Admins set limits and decide whether overage is allowed |

Key points:

- **Code completions and next edit suggestions don't consume credits** and stay unlimited on paid plans. Chat, agent mode, code review, the cloud agent, and Copilot CLI do.
- Burn rate **varies by model**. `/usage` shows credits spent this session, session duration, lines edited, and per-model token breakdown.
- On Business/Enterprise, an admin decides whether hitting the cap pauses Copilot or bills onward.

Models span Anthropic, OpenAI, and Google; `/model` switches mid-session, reasoning effort is configurable, and `Ctrl+T` toggles whether reasoning is shown.

## Context management

`/context` gives a visual overview of token usage and `/compact` compresses history manually. **At roughly 95% of the context window it auto-compacts in the background** without interrupting you.

There are also two memory layers: repository memory retains conventions and patterns for a codebase, and cross-session memory lets you ask about past work, files, and PRs.

## Who it fits

**Good fit:**

- Developers whose **org already pays for Copilot** — marginal cost is zero and no new security review is required
- People whose work centers on **issues and PRs**, not just local files
- People who want **local/cloud handoff** — `&` to send it out, `/resume` to take it back
- People whose editor has no official Copilot extension: the CLI is editor-independent

**Poor fit:**

- Teams outside the GitHub ecosystem — platform integration is the entire moat; remove it and this is an ordinary terminal agent
- People who want full control over models and providers — GitHub sets the model list and org admins can narrow it further
- Individuals inside a Business/Enterprise org who want to self-enable — you're waiting on an admin

## Overall

The judgment here is simple: **how much of your time is spent on GitHub?** If your workflow is issue → branch → PR → review, this pulls that line into your terminal using money you've already spent. If GitHub isn't central to your work, it offers no clear advantage over [Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent-en) or [OpenCode](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en).

It forms an interesting contrast with [Codex](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en): both are terminal agents riding an existing subscription, but Codex rides ChatGPT, a consumer subscription, while Copilot CLI rides **a developer platform the company already bought**. The latter is usually an easier sell internally.

## References

- [GitHub Copilot CLI product page](https://github.com/features/copilot/cli)
- [GitHub Changelog: Copilot CLI is now generally available (2026-02-25)](https://github.blog/changelog/2026-02-25-github-copilot-cli-is-now-generally-available/)
- [GitHub Docs: Using GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/overview)
- [GitHub Copilot CLI repo: github/copilot-cli](https://github.com/github/copilot-cli)
- [GitHub Copilot plans and pricing](https://github.com/features/copilot/plans)
- [GitHub Blog: Power agentic workflows in your terminal with GitHub Copilot CLI](https://github.blog/ai-and-ml/github-copilot/power-agentic-workflows-in-your-terminal-with-github-copilot-cli/)
