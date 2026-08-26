---
title: "How to standardize Claude Code dev environments: devcontainer.json, CI consistency, and team rollout"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, devcontainer, docker, team]
lang: en
tldr: "Add Anthropic's official Dev Container Feature (`ghcr.io/anthropics/devcontainer-features/claude-code:1.0`) to `.devcontainer/devcontainer.json` and three steps—write the config, rebuild the container, run `claude` to sign in—put every teammate's Claude Code in an identical container. The same definition feeds GitHub Codespaces and CI; a five-step rollout gets the whole team there."
description: "Put Claude Code inside a consistent, isolated environment with devcontainer.json: the official Feature install, persisting auth and settings across rebuilds, managed-settings policy, why CI should reuse the same container definition, and step-by-step team rollout."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 31
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-devcontainer)

This is part of the [Claude Code Deep Dives](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) series. The previous piece covered how Claude Code works; this one tackles a more practical problem: **five people run Claude Code on five machines with different Node versions, package caches, and shell configs. When the AI breaks something, nobody can reproduce anyone else's result.**

## The problem: unreproducible AI results

Claude Code is an agentic loop—it actually runs commands, installs dependencies, and edits files on your machine. That means its behavior is coupled to your local environment:

- Your machine runs Node 22 while a teammate has Node 18; the same prompt produces different build errors.
- "Works on my machine" becomes "works in my Claude Code session," and debugging now means ruling out human environment drift too.
- A new hire spends half of day one just getting the environment running—then still has to confirm their Claude Code behaves like everyone else's.

This isn't specific to Claude Code; it's common to every tool that runs locally. But AI agents move more and move faster, so environment drift gets amplified faster too.

## Which part of the problem dev containers solve

A [dev container](https://containers.dev/) is an open spec: `devcontainer.json` defines a containerized development environment—base image, tool versions, extensions—that any spec-compliant editor (VS Code, GitHub Codespaces, JetBrains IDEs, Cursor) can launch. Your editor UI stays on the host; the integrated terminal, language servers, and build tools all run inside the container.

Once Claude Code is installed in that container, every command it runs executes inside it rather than on your host, while its edits to project files appear directly in your local repository. Per the [official Claude Code docs](https://code.claude.com/docs/en/devcontainer.md), this means Claude sees the same files, dependencies, and tools as the rest of your project's toolchain.

Be clear about the increment: containerized environments aren't new—Docker has existed for a decade. What dev containers add is turning the environment definition into a version-controlled config file inside the repo, natively supported by editors. You stop maintaining a setup doc that rots.

## Minimal setup: three steps

Anthropic publishes a [Dev Container Feature](https://github.com/anthropics/devcontainer-features/tree/main/src/claude-code) that reduces installation to one JSON block. Create `.devcontainer/devcontainer.json` in your repo:

```json
{
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/anthropics/devcontainer-features/claude-code:1.0": {}
  }
}
```

Then three steps:

1. **Rebuild the container**—in VS Code, `Cmd+Shift+P` → "Dev Containers: Rebuild Container".
2. **Run `claude` in the container's terminal** and follow the sign-in prompt.
3. Start working.

Details worth knowing:

- The trailing `:1.0` pins the Feature's install script, not the Claude Code release itself. The feature installs the latest Claude Code and auto-updates inside the container by default. To pin the CLI version for reproducible builds, install it from your Dockerfile with `npm install -g @anthropic-ai/claude-code@X.Y.Z` instead, and set `DISABLE_AUTOUPDATER=1`.
- If the base image lacks Node.js, the feature installs it; if the build stops at `Failed to install Node.js and npm`, add `"ghcr.io/devcontainers/features/node:1": {}` above the Claude Code feature and rebuild.
- To open your dev server from the editor, add standard Dev Containers port forwarding like `"forwardPorts": [3000]`—that's a spec-level field, unrelated to Claude Code.

## Making settings and sign-in survive rebuilds

By default, a rebuild discards the container's home directory, so you'd sign in again every time. Claude Code stores its auth token and user settings under `~/.claude`, but your OAuth account and per-project trust live in a separate file, `~/.claude.json`—mounting a volume at `~/.claude` alone isn't enough.

The official approach: mount a named volume and point `CLAUDE_CONFIG_DIR` at the same path, so `.claude.json` gets written into the volume too:

```json
"mounts": [
  "source=claude-code-config,target=/home/node/.claude,type=volume"
],
"containerEnv": {
  "CLAUDE_CONFIG_DIR": "/home/node/.claude"
}
```

The same spot is where organization policy goes: use `containerEnv` to set `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` and `DISABLE_AUTOUPDATER=1`, or copy `managed-settings.json` to `/etc/claude-code/` from your Dockerfile—it sits at the top of the settings hierarchy, overriding anything engineers set locally or per-project. But the docs are honest about the limit: the Dockerfile lives in the repo, so anyone with write access can change or remove that step. Policy that engineers truly can't bypass needs server-managed settings or MDM.

## One definition for CI too

This is the most valuable part of team standardization. Because `devcontainer.json` is a declarative container definition, the same file can run in three places:

- engineers' local machines (VS Code / JetBrains),
- GitHub Codespaces (same definition in the cloud),
- CI pipelines (via the [Dev Containers CLI](https://github.com/devcontainers/cli), or by building the same Dockerfile).

Suddenly "the tests passed when Claude ran them" has a verifiable basis: local, cloud, and CI all run **the same image with the same tool versions**. When Claude reports green tests locally and CI re-runs them in the same container, failure reduces to code changes and timing—no environmental factors left. Conversely, if your CI environment and everyone's dev containers are maintained separately, you're maintaining two environments that each drift on their own—which is worse than local-only drift, because you believe you have consistency when you don't.

## Team rollout in five steps

1. **One person proves out the minimal setup**: add the Feature to `.devcontainer/devcontainer.json`, rebuild, sign in, and confirm the project's full toolchain works inside the container (add any native dependencies to the Dockerfile).
2. **Add persistence and policy**: the volume mount plus `CLAUDE_CONFIG_DIR`; pin the version via Dockerfile install with auto-update disabled if reproducibility matters.
3. **PR it into the repo, switch the whole team**: onboarding becomes clone, reopen in container, wait for the build—no more setup docs that don't match reality.
4. **Align CI**: point your pipeline at the same container definition so all three execution environments converge into one.
5. **Reach for the reference container for tighter control**: the [`anthropics/claude-code`](https://github.com/anthropics/claude-code/tree/main/.devcontainer) repo ships a complete example combining an egress firewall and persistent volumes (the `init-firewall.sh` script requires `NET_ADMIN` and `NET_RAW` capabilities). To run `--dangerously-skip-permissions` unattended, `remoteUser` must be a non-root account—the CLI rejects root.

Be precise about the security boundary: the official docs state plainly that dev containers aren't immune—anything accessible inside the container (including the Claude Code credentials stored in `~/.claude`) could be exfiltrated by a malicious project. Don't mount host secrets like `~/.ssh` or cloud credential files into containers; prefer repository-scoped or short-lived tokens.

## How this splits from sandboxing

Dev containers solve environment consistency and bring isolation along; if what you want is lightweight, Docker-free isolation at the machine level—constraining bash commands' filesystem writes and network access—that's the job of Claude Code's built-in sandbox mechanism. They solve different problems at different strengths; details in [the sandboxing post](/posts/tech/deep-dive/2026-03-28-claude-code-devcontainer-sandboxing). Quick split: team standardization and cross-machine reproducibility → dev container; shrinking the blast radius of agent mistakes on a single machine → sandbox. Using both together is fine.

## Takeaway

The value of dev containers isn't containerization itself—it's turning the environment into a version-controlled file in the repo. Claude Code's behavior becomes inspectable and reproducible, and "the AI says the tests pass" gains objective meaning for the first time. The one-line Feature config is the entry point; converging CI is where the real payoff lands.

## References

- [Development containers — Claude Code Docs](https://code.claude.com/docs/en/devcontainer.md) — official guidance on the Dev Container Feature, auth persistence, organization policy, network egress restrictions, and permission-prompt-free operation

## Changelog

- 2026-08-26: Initial version, written against the August 2026 official devcontainer documentation.
