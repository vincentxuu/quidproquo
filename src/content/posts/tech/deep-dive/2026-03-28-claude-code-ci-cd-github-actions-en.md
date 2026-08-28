---
title: "Claude Code in CI/CD: @claude on GitHub Actions and the GitLab MR Flow"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, github-actions, gitlab-ci, ci-cd, ai-agent, dx]
lang: en
tldr: "Put Claude Code into GitHub Actions with anthropics/claude-code-action: /install-github-app sets everything up in one command, @claude in a PR or issue comment gets bugs fixed, branches pushed, and PR creation links returned; Bedrock/Vertex/Foundry backends switch via one input with OIDC and no stored keys; the GitLab CI/CD integration (beta) mirrors it as a single .gitlab-ci.yml job where every change flows through a merge request."
description: "How to integrate Claude Code with GitHub Actions and GitLab CI/CD: installation paths, @claude trigger syntax, workflow YAML examples, switching to AWS Bedrock / Google Cloud Agent Platform / Microsoft Foundry backends, plus API key management and permission scoping."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 19
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions)

[The previous post in this series](/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide) covered headless mode: the `-p` flag that runs Claude Code without the interactive UI, exiting when done. CI integration is that capability wired to triggers: GitHub Actions and GitLab CI/CD are the two paths the official docs explicitly support. This post covers how to install it, how to trigger it, and how to swap cloud backends in enterprise environments.

## Running an agent in CI vs. running it locally

Locally, you sit at the terminal watching Claude edit code; in CI, execution is driven by repository events — someone comments, a PR opens, a schedule fires. Three practical differences:

- **Different context source**: locally you fill in background as you go; in CI, Claude reads the issue text, the PR diff, and repo files on its own, which makes `CLAUDE.md` the only reliable source of team conventions.
- **Different output destination**: locally the result lands in your working directory; in CI it lands as commits, pull requests, and comments — all on the record.
- **Different permission model**: locally you decide how much freedom it gets with Shift+Tab; in CI the boundary is the workflow's `permissions` block plus the Action's inputs.

## Installation: /install-github-app or a manual workflow

The quick path from the official docs is running `/install-github-app` in your repository. Prerequisite: the [GitHub CLI](https://cli.github.com) installed and authenticated via `gh auth login`. It does three things: installs the Claude GitHub App, saves your credential as a repo secret (`ANTHROPIC_API_KEY` for an API key, `CLAUDE_CODE_OAUTH_TOKEN` for a subscription token), and pushes a branch with the workflow files, opening a ready-to-merge PR. Merge it and `@claude` goes live.

If you'd rather not depend on a local Claude Code install, take the manual path — same three steps, done yourself: install the app at [github.com/apps/claude](https://github.com/apps/claude), add one of those secrets, and copy [examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) into `.github/workflows/`. For organization-wide rollout, install the App once at the org level, store the secret as an organization-level Actions secret, and add just the workflow file per repository.

## @claude: naming tasks in comments

The Action has two modes. With no `prompt` input, it runs in interactive mode: Claude waits for the trigger phrase (default `@claude`) to appear in an issue or PR comment, a review comment, or the title/body of a newly opened issue. With a `prompt`, it's automation mode: it runs on every event without waiting for a mention.

The official examples of what interactive mode can do:

```text
@claude implement this feature based on the issue description
@claude fix the TypeError in the user dashboard component
@claude how should I implement user authentication for this endpoint?
```

The third asks a question without touching code; the first has Claude push a change branch and return the PR creation entry point. Claude reports progress in a comment on the same issue or PR. Separately, Anthropic also ships a Code Review product line that reviews every PR automatically without any workflow file; that belongs to another post in this series, so I won't expand on it here.

## A minimal workflow example

The minimal setup for responding to `@claude` mentions, taken from the official docs' minimal example:

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
jobs:
  claude:
    if: contains(github.event.comment.body, '@claude')
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

The non-boilerplate lines deserve explanation: `if` keeps runners from starting on comments without `@claude`; `id-token: write` is required by the Action's default GitHub App authentication; `actions: read` lets Claude read CI results on PRs. The key inputs for automation mode are `prompt` (plain text or a skill invocation) and `claude_args` (CLI flags such as `--max-turns 5 --model claude-sonnet-5`). Two checks gate every run: the triggering actor must have write access to the repository and must be human — bots pass only if listed in `allowed_bots`.

## Switching cloud backends: Bedrock, Vertex, Foundry

By default the Action calls the Claude API directly. If your organization requires inference traffic to stay inside your own cloud account, the docs support three backends, switched by a single input: Amazon Bedrock with `use_bedrock: "true"`, Google Cloud's Agent Platform with `use_vertex: "true"`, Microsoft Foundry with `use_foundry: "true"`.

All three share one design: OIDC identity federation instead of static keys. The workflow's `id-token: write` has GitHub mint a short-lived token, the cloud side trusts it under a condition scoped to your repository, and each run exchanges it for temporary credentials — no long-lived secret ever sits in the repo. The remaining setup differs per provider:

| Backend | Repo secrets | Extra environment variables |
|---------|--------------|------------------------------|
| Bedrock | `AWS_ROLE_TO_ASSUME` | model IDs carry a cross-region prefix, e.g. `us.anthropic.claude-sonnet-4-6` |
| Google Cloud | `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` | `ANTHROPIC_VERTEX_PROJECT_ID`, `CLOUD_ML_REGION` |
| Foundry | `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID` | `ANTHROPIC_FOUNDRY_RESOURCE` |

## GitLab CI/CD: the same job through merge requests

GitLab has no app to install; the official integration (beta) is built on the CLI and Agent SDK as a CI job: add a job to `.gitlab-ci.yml`, install the CLI in `before_script` with `curl -fsSL https://claude.ai/install.sh | bash`, add `$HOME/.local/bin` back to `PATH`, then run:

```yaml
- >
  claude
  -p "${AI_FLOW_INPUT:-'Review this MR and implement the requested changes'}"
  --permission-mode acceptEdits
  --allowedTools "Bash Read Edit Write mcp__gitlab"
```

Credentials are a masked CI/CD variable holding `ANTHROPIC_API_KEY`. The biggest difference from the GitHub version is triggering: GitLab has no built-in comment listener, so mention-driven `@claude` requires a "Comments (notes)" webhook whose listener calls the pipeline trigger API with `AI_FLOW_INPUT` and related variables when it detects a mention. The simplest way in is web-triggered manual runs or merge request events. The security model shares the same backbone: each interaction runs in an isolated container, and every change flows through a merge request, so reviewers and approval rules work as usual. Bedrock and Vertex backends are supported too, via `CLAUDE_CODE_USE_BEDROCK=1` and `CLAUDE_CODE_USE_VERTEX=1` plus OIDC/WIF setup.

## Security notes

- **Keys live only in secrets**: GitHub API keys and OAuth tokens go into GitHub Secrets; GitLab's `ANTHROPIC_API_KEY` goes into a masked CI/CD variable. The official warning is blunt: never commit them.
- **Least privilege**: the official Claude GitHub App's permission set covers every Claude feature (read-write on Actions, Checks, Discussions, and more); if you only run the Claude Code Action, create a custom GitHub App scoped to Contents, Issues, and Pull requests.
- **Trust boundaries**: write-access and bot checks are built in, but fork PRs on public repos receive no secrets, and for comment-triggered runs you may still want to verify the commenter's access before any credential step.
- **Humans stay in the loop**: commits Claude pushes go through your normal CI and review flow — read the diff before merging.
- **Cost brakes**: `--max-turns` caps iterations, job-level timeouts prevent runaway jobs, concurrency controls limit parallelism — each run burns both Actions minutes and tokens.

## What I learned

Running Claude Code in CI is headless mode wired into a version-control platform's event system: on GitHub, a `@claude` mention is the trigger and changes land as branches plus PR creation flow; on GitLab, everything converges on the merge request. Only two principles are shared across both: hand keys to the platform's secret mechanism, and leave changes to human review.

## References

- [Claude Code GitHub Actions — Claude Code Docs](https://code.claude.com/docs/en/github-actions) — official coverage of setup paths, interactive/automation modes, action parameters, trigger checks, and cost management
- [Use Claude Code GitHub Actions with cloud providers — Claude Code Docs](https://code.claude.com/docs/en/github-actions-cloud-providers) — OIDC configuration, secrets table, and full workflow examples for the Bedrock / Agent Platform / Foundry backends
- [Claude Code GitLab CI/CD — Claude Code Docs](https://code.claude.com/docs/en/gitlab-ci-cd) — job syntax for the GitLab beta integration, the `AI_FLOW_*` trigger mechanism, and Bedrock/Vertex configuration examples
- [claude-code-action examples/claude.yml](https://github.com/anthropics/claude-code-action/blob/main/examples/claude.yml) — example workflow for GitHub Action interactive mode
- [claude-code-action usage reference](https://github.com/anthropics/claude-code-action/blob/main/docs/usage.md) — Action inputs, trigger phrase, `claude_args`, and v1 migration mapping
- [claude-code-action security guide](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md) — actor checks, default PR creation behavior, fork/pull_request_target risks, and secret handling
- [claude-code-action setup guide](https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md) — manual setup, GitHub Secrets, custom GitHub App, and workload identity federation

## Update log

- 2026-08-26: Initial version, written against the August 2026 official docs (includes the Microsoft Foundry backend and the GitLab beta integration).
