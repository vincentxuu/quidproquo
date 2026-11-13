---
title: "Tool Spotlight｜devvm — secrets stay on the host, the VM never sees the real value"
date: 2026-11-09
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "devvm is an open-source CLI that opens an isolated VM per project so coding agents like Claude Code and Codex run inside it: the VM reaches the network only through an allowlist, and secrets such as GitHub tokens stay on the host, swapped in by a proxy the VM never touches directly."
tldr: "devvm is an MIT-licensed open-source CLI that opens an isolated VM for each project folder, for a coding agent to run inside. Install: brew install devvmhq/tap/devvm, or the official install script. It closes a gap that running an agent directly on your machine leaves open — by default, the VM can reach only allowlisted hosts, and secrets such as your GitHub token never enter the VM at all; a proxy on the host swaps in the real value per request."
series:
  name: "AI Tool of the Day"
  order: 76
---

> 🌏 [中文版](/posts/daily/2026-11-09-tool-devvm)

## Tool info

| Field | Value |
|---|---|
| Name | devvm |
| Type | CLI |
| GitHub | [devvmhq/devvm](https://github.com/devvmhq/devvm) |
| Stars | 400 (at the time of writing, 3 days after launch) |
| Language | Go |
| License | MIT |
| Install | `curl -fsSL https://github.com/devvmhq/devvm/releases/latest/download/install.sh \| bash` |

## What problem it solves

Run a coding agent directly on your own machine, and it can technically reach more than the project folder: `.ssh`, `.aws`, browser cookies, services on your internal network, and any token you've ever pasted into a terminal. A common fix is a Docker container, but a container shares the host's kernel — once a command escapes that kernel layer, the isolation is gone. That's not a hypothetical: a PWN Research post published 2026-11-07 demonstrated escaping a Firecracker microVM and getting root code execution on the host.

devvm picks a different isolation layer: every project folder gets its own real virtual machine, run on [Lima](https://lima-vm.io/) over QEMU rather than a container, and the VM mounts only that one project folder. New VMs default to the "allowlist" network tier, reaching only the hosts you've explicitly permitted. Secrets like your GitHub token or Claude Code's login never enter the VM at all — the VM only ever gets a placeholder string, and a proxy on the host swaps in the real value as it forwards the request. If something in the VM tries to bypass that proxy and connect directly, all it can send out is the placeholder, and the real host still rejects it. Claude Code, Codex, opencode, and pi each keep their own settings inside the VM, so none of it touches what's already installed on your host.

```diagram
title: devvm keeps secrets on the host; the VM only ever holds a placeholder
desc: a request from the coding agent inside the VM goes through a host-side proxy that swaps in the real secret per the allowlist — the VM itself never holds the real value
---
<svg viewBox="0 0 700 380">
  <rect class="dg-zone" x="20" y="40" width="172" height="160" rx="8"/>
  <text class="dg-tag" x="36" y="62" dominant-baseline="central">VM (sandbox)</text>

  <rect class="dg-zone dg-zone--solid" x="300" y="40" width="210" height="160" rx="8"/>
  <text class="dg-tag" x="316" y="62" dominant-baseline="central">This machine</text>

  <path class="dg-line" d="M180 148H320" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M510 136H522Q530 136 530 128V94Q530 86 538 86H560" marker-end="url(#arrow-link)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M510 160H522Q530 160 530 168V240Q530 248 538 248H550" marker-end="url(#arrow-warn)"/>

  <rect class="dg-box" x="40" y="120" width="140" height="56" rx="6"/>
  <text class="dg-label" x="110" y="148" text-anchor="middle" dominant-baseline="central">Coding agent</text>

  <rect class="dg-box dg-box--accent" x="320" y="112" width="190" height="72" rx="6"/>
  <text class="dg-label" x="415" y="139" text-anchor="middle" dominant-baseline="central">devvm proxy</text>
  <text class="dg-sub" x="415" y="159" text-anchor="middle" dominant-baseline="central">secrets stay here</text>

  <rect class="dg-box dg-box--link" x="560" y="56" width="120" height="60" rx="6"/>
  <text class="dg-label" x="620" y="77" text-anchor="middle" dominant-baseline="central">Allowed host</text>
  <text class="dg-sub" x="620" y="97" text-anchor="middle" dominant-baseline="central">e.g. github</text>

  <rect class="dg-box dg-box--warn" x="550" y="240" width="140" height="56" rx="6"/>
  <text class="dg-label" x="620" y="268" text-anchor="middle" dominant-baseline="central">Un-allowed host</text>

  <text class="dg-edge" x="250" y="136" text-anchor="middle" dominant-baseline="central">placeholder</text>
  <text class="dg-edge dg-text--link" x="505" y="104" text-anchor="middle" dominant-baseline="central">real token</text>
  <text class="dg-edge dg-text--warn" x="505" y="208" text-anchor="middle" dominant-baseline="central">403 denied</text>

  <line class="dg-rule" x1="20" y1="320" x2="680" y2="320"/>
  <text class="dg-tag" x="20" y="344" dominant-baseline="central">Legend</text>
  <rect class="dg-box dg-box--accent" x="76" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="100" y="344" dominant-baseline="central">holds secrets</text>
  <rect class="dg-box dg-box--link" x="260" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="284" y="344" dominant-baseline="central">allowed host</text>
  <rect class="dg-box dg-box--warn" x="440" y="336" width="16" height="16" rx="3"/>
  <text class="dg-small" x="464" y="344" dominant-baseline="central">blocked host</text>
</svg>
```

It's a good fit when you want an agent to run unattended for a while, touching the filesystem or installing packages, without re-assessing every time whether this run might touch something it shouldn't see; when you run several coding agents and don't want their configs fighting for the same install on one machine; or when you want the VM to share the project folder with your editor directly, instead of a commit-and-push round trip to see the result. It's a poor fit for a single, one-off shell command — spinning up a VM has a few seconds of startup cost — and for Windows: the project's own testing currently covers only macOS (Apple silicon) and Linux (arm64/x86_64).

## Getting started

### Install

```bash
# macOS (also installs Lima)
brew trust --formula devvmhq/tap/devvm
brew install devvmhq/tap/devvm

# Linux (also works on macOS; asks before installing Lima, QEMU, or /dev/kvm access)
curl -fsSL https://github.com/devvmhq/devvm/releases/latest/download/install.sh | bash

# Check what's missing
devvm doctor
```

### Basic usage

```bash
cd ~/some-project
devvm
# First run asks for the VM's size, toolchains, and network tier (default: allowlist)
# Confirm, and you land in the VM's shell, prompt prefixed with (devvm)
(devvm) $ claude
```

### Advanced usage

```bash
# Give the VM its own clone instead of mounting your working tree directly
devvm --clone

# Once the agent's done, fetch its branch back to this machine and review before merging
git fetch devvm
git log -p main..devvm/main

# See what the VM's proxy has blocked lately
devvm network log --blocked
```

## Compared to existing options

| | devvm | Docker container sandbox | Running directly on the host |
|---|---|---|---|
| Isolation layer | VM (its own kernel) | Container (shares the host kernel) | None |
| Secrets enter the sandbox | ❌ only a placeholder; the real value stays in the host proxy | Usually the whole env / mounted in | — |
| Default network | Allowlist — only hosts you permit | Depends on your Docker setup, often shares the host's network | Same as the host |
| Isolates multiple agent configs | ✅ one set per VM | You manage the volumes yourself | ❌ everything stacked on one machine |
| Install effort | One install command, `devvm doctor` for a health check | Need to know Dockerfiles, volumes, networking | None |

## Watch out for

- **Testing currently covers only macOS (Apple silicon) and Linux (arm64/x86_64).** The README states Intel Macs aren't supported yet, and doesn't mention Windows at all — it isn't in scope today.
- **A VM costs more than a container.** The first VM needs a few minutes to build its base image and 8GB of free disk space; the project recommends at least 8GB of RAM and 4 CPUs, more than a bare container typically needs.
- **The allowlist only covers the sources devvm already knows about.** The first request to a legitimate service it has no built-in rule for — an internal package registry, say — gets a 403, and you add the rule yourself with `devvm network allow`; it isn't open-by-default once installed.

## Today's takeaway

Most of the past year's talk about agent security has stopped at "should I add a sandbox," but the Firecracker-escape writeup from 2026-11-07 is a reminder that even microVM-level isolation isn't an absolute guarantee. devvm's approach is more modest about that: it doesn't claim to be unbreakable. Instead, it structurally removes secrets — the one category of thing you can't take back once it leaks — from the VM entirely, so the real token string never passes through it in the first place. Even if the VM were fully compromised, the most it could steal is a placeholder. That's a "shrink the blast radius" design, not a "assume the wall holds" one, and it's worth borrowing for any setup where an agent runs unattended for a while.

## References

- [devvmhq/devvm — GitHub](https://github.com/devvmhq/devvm)
- [devvm docs: Installing](https://devvm.dev/docs/getting-started/install/)
- [devvm docs: Network tiers](https://devvm.dev/docs/safety/network/)
- [devvm README](https://github.com/devvmhq/devvm#readme)
- [Agent Tools Today, 7 Nov 2026 (the day devvm was covered)](https://munderdiffl.in/blog/agent-tools-today-2026-11-07/)
- [PWN Research: Firecracker escape (the microVM-escape research referenced above)](https://pwn.ai/blog/firecracker-escape)
- [LICENSE (MIT)](https://github.com/devvmhq/devvm/blob/main/LICENSE)
