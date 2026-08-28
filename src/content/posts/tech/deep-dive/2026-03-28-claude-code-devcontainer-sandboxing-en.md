---
title: "How Claude Code Sandboxing Works: Sandboxed Bash, Network Allowlists, and the Threat Model of Six Isolation Approaches"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, sandboxing, ai-agent]
lang: en
tldr: "Claude Code's built-in sandboxed Bash restricts every command at the OS level: writes are limited to the working directory plus session temp, while reads default to the entire machine; network traffic goes through a proxy allowlist that starts with zero domains. The switches live in the /sandbox panel and sandbox.enabled — there is no --sandbox flag. This post also compares sandbox runtime, dev containers, Docker, VMs, and Claude Code on the web to show when each heavier isolation tier earns its setup cost."
description: "A deep dive into Claude Code's sandboxed Bash tool: filesystem and network isolation, the /sandbox panel and sandbox.network.allowedDomains settings, and the official threat-model comparison of six sandbox environments."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 30
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing)

This is the security installment of the [Claude Code Deep Dives](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) series. The previous post covered [permissions and auto mode](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode-en), which answers "which actions ask you first." This one answers a different question: **once an action is already running, what can it touch**.

## Why You Fence Before Letting Go

The permission system is inherently a pre-flight review — every tool call gets intercepted and approved before it runs. But as you move to auto mode or accept edits, fewer and fewer actions pass through you: a classifier judges risk on your behalf, and common operations just go through. With less human review in the loop, the only thing left to limit blast radius when a command goes wrong is the execution environment itself.

That's where the sandbox sits. Claude Code's built-in sandboxed Bash tool uses OS-level security primitives (Seatbelt on macOS, bubblewrap on Linux and WSL2) to enforce one boundary around **every Bash command and all of its child processes**. Note the scope: Bash only. Built-in tools like Read and Edit are gated by permission rules instead, and MCP servers and hooks run as unconstrained separate processes.

## Sandboxed Bash: Two Independent Boundaries

The sandbox has two independent layers: filesystem isolation decides which paths commands can read and write, and network isolation decides which hosts they can reach. The official docs explicitly warn that both must be on for either to matter — lock files but not network, and a compromised agent can exfiltrate SSH keys; the reverse invites backdooring your way into network access.

### Filesystem: Narrow Writes, Broad Reads

The default behavior is deliberately asymmetric:

- **Writes**: only the current working directory (including subdirectories) plus the session temp directory. `$TMPDIR` is redirected to session temp, so tools writing scratch files need no extra configuration.
- **Reads**: the entire machine by default, with only a few directories denied. That means `~/.aws/credentials` and `~/.ssh/` are **readable out of the box** — use `sandbox.credentials` to block those files and unset secret environment variables, or add your own `denyRead`.
- **Protected paths**: even inside writable ranges, files Claude Code itself loads — `.claude` settings, shell startup files like `.zshrc`, `.gitconfig` — deny writes. Otherwise a command could grant itself permissions or install a hook and run outside the sandbox next round.

To widen, add paths under `sandbox.filesystem.allowWrite` (say, `~/.kube` for `kubectl`); enforcement is at the OS level, so child processes inherit it. To tighten, use `denyRead` / `denyWrite` — allows layered on top of a denied region can't reopen it: `denyRead: ["~/.env"]` holds inside any broader allow.

### Network: Zero Domains Allowed by Default

All network traffic passes through a proxy running outside the sandbox. The key default: **Claude Code pre-allows no domains**. The first command needing a new domain triggers a prompt, or goes to the classifier in auto mode; answering "always allow" saves a `WebFetch(domain:...)` rule for future sessions.

To avoid prompts entirely, list domains yourself under `sandbox.network.allowedDomains`, with wildcard support like `*.example.com`. Enterprises get two escalations: `strictAllowlist` turns "ask about everything off-list" into "deny everything off-list," and `allowManagedDomainsOnly` makes the managed-settings list the only effective version, so developers can't sneak entries in.

Know the limits too: by default the proxy doesn't terminate TLS or inspect content, and its allow decision relies on the client-supplied hostname — the docs call out domain fronting as a possible bypass, and threat models requiring stronger guarantees should run a custom TLS-inspecting proxy.

## Where the Switches Live: There Is No --sandbox Flag

One common misconception to clear up first: **the `--sandbox` / `--no-sandbox` CLI flags do not exist**. The control surfaces are:

- **The `/sandbox` panel**: three tabs — Mode picks between auto-allowing sandboxed commands and regular permission flow; Overrides picks whether failed commands may retry unsandboxed; Config shows the resolved settings.
- **settings.json**: `sandbox.enabled: true` turns it on (in user settings, it applies across all projects); `autoAllowBashIfSandboxed` controls whether sandboxed commands auto-approve; `failIfUnavailable: true` turns the "warn and run unsandboxed" fallback into a hard failure, suited to deployments using the sandbox as a security gate.

There's also an escape hatch: when a command fails because of a sandbox restriction, Claude can retry it unsandboxed via the `dangerouslyDisableSandbox` parameter — but the retry re-enters the regular permission flow, so Manual mode still prompts you. Set `allowUnsandboxedCommands` to `false` to close this path completely.

## Six Environments, Six Threat Models

The built-in sandbox is only one option. The official comparison lays out the isolation spectrum:

| Approach | What is isolated | Requires Docker | Setup effort |
|----------|------------------|-----------------|--------------|
| [Sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing.md) | Bash commands and their child processes only | No | Near-zero on macOS; low on Linux |
| [Sandbox runtime](https://code.claude.com/docs/en/sandbox-environments.md) (`@anthropic-ai/sandbox-runtime`) | The whole Claude Code process, including file tools, MCP, hooks | No | Low |
| Dev container | Full development environment | Yes | Medium |
| Custom container | Full development environment | Yes | Medium to high |
| Virtual machine | Full operating system | No | High |
| Claude Code on the web | Full operating system hosted by Anthropic | No | No local setup; requires a Claude subscription, and GitHub when launched from the web interface |

The watershed sits between the first two rows and the rest: those run on the host OS, differing only in whether the boundary wraps Bash or the entire Claude Code process; the latter four move Claude Code itself into a container, VM, or Anthropic-hosted environment, bringing file tools, MCP servers, and hooks inside the boundary too. (Dev containers' team-standardization story — the official example container and its firewall config — gets its own post: [Claude Code DevContainer Guide](/posts/tech/deep-dive/2026-08-26-claude-code-devcontainer-en).)

Claude Code on the web is the option you do not host yourself: each session runs in an Anthropic-managed VM, with your GitHub token held by a separate proxy outside the sandbox. If you start a session from the CLI with `--cloud` and no GitHub connection is available, Claude Code can bundle and upload the local repository instead, but that session cannot push back to a remote on its own.

## How to Choose

The official mapping is practical — look up your goal:

- **Fewer permission prompts during everyday work on your own machine** → the sandboxed Bash tool, configured via `/sandbox`.
- **Unattended runs with `--dangerously-skip-permissions`** → dev container, any container or VM, or the sandbox runtime. The docs are blunt: sessions that skip permissions must run inside a container, VM, or the sandbox runtime so file tools and hooks sit inside the boundary too.
- **Long-running background work in auto mode** → not a hard requirement in the same way as `--dangerously-skip-permissions`, but still worth an isolation layer; do not rely on sandboxed Bash alone because it does not cover file tools, MCP servers, or hooks.
- **An untrusted repository** → a dedicated VM, or Claude Code on the web if you have a subscription; web-interface launches also require GitHub access.
- **Standardize a sandboxed environment across a team** → copy the official dev container example into your repo.
- **Native Windows** → the Bash sandbox doesn't support it; use WSL2 or a container.

## How It Divides Work with Permission Modes and Checkpoints

Each mechanism covers a different phase; don't expect any single one to do everything:

- **Permission modes** (see the [B2 post](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode-en)): decide whether an action runs and whether you're prompted first — the pre-flight review.
- **The sandbox**: decides what a running action can reach — the mid-flight fence. Auto mode's classifier is a per-action control, not an isolation boundary, so unattended runs still benefit from defense in depth.
- **Checkpoints** (see the [A4 post](/posts/tech/deep-dive/2026-03-28-claude-code-checkpointing-guide-en)): restore file edits after the fact. But they don't track side effects from bash commands — and the sandbox is precisely the layer that shrinks those side effects' blast radius ahead of time.

The docs' summary is worth memorizing: sandboxes reduce the impact of a breach; they don't eliminate risk. As long as policy permits network egress, anything the agent reads has an exfiltration path; as long as the project directory mounts writable, code can be modified. Treat it as one layer in defense in depth, not a single-point fix.

## References

- [Configure the sandboxed Bash tool — Claude Code Docs](https://code.claude.com/docs/en/sandboxing.md) — official guide to the sandboxed Bash tool's filesystem and network isolation, the `/sandbox` panel, `allowedDomains`, protected paths, and security limitations
- [Choose a sandbox environment — Claude Code Docs](https://code.claude.com/docs/en/sandbox-environments.md) — the official threat-model comparison of sandboxed Bash, sandbox runtime, dev container, custom container, VM, and on-the-web approaches, with selection guidance
- [Development containers — Claude Code Docs](https://code.claude.com/docs/en/devcontainer) — official guidance for installing Claude Code in dev containers, persisting settings, restricting network egress, and using `--dangerously-skip-permissions`
- [Use Claude Code on the web — Claude Code Docs](https://code.claude.com/docs/en/claude-code-on-the-web) — official guide to cloud sessions, GitHub authentication, `--cloud` repository bundling, and cloud isolation

## Changelog

- 2026-08-29: Updated the official environment comparison from five to six approaches by adding Claude Code on the web; separated the isolation guidance for `--dangerously-skip-permissions` from auto mode.
- 2026-08-26: Split from the combined "DevContainer & Sandboxing" outline and retitled to focus on sandboxing; devcontainer content moved to its own post. References rebuilt on the new official docs domain.
