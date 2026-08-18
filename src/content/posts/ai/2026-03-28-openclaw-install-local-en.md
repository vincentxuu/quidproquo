---
title: "OpenClaw Installation Guide (Part 1): Choosing Among Six Local Methods, and Where It Gets Stuck"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, installation, docker, nix, podman, raspberry-pi, bun]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 2
tldr: "OpenClaw has six local install methods, and what separates them is not the command but whether you want reproducibility, isolation, or self-updating. The real blocker is package-manager lifecycle-script policy: both npm 12 and global pnpm installs block OpenClaw's build scripts by default."
description: "A selection guide for installing OpenClaw locally — who the installer script, npm/pnpm/bun, Docker, Podman, Nix, source builds, and Raspberry Pi each suit, and the points where installation actually fails."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-install-local)

The install commands live in the official [Install](https://docs.openclaw.ai/install/) page and are always current, so this article does not restate them. It answers the two things that page does not spell out: **how the six methods differ and which one you should pick**, and **where installation actually stops halfway**.

## System requirements

- **Node 22.22.3+, 24.15+, or 25.9+**, with Node 26 recommended. The installer script provisions Node automatically when it is missing
- macOS, Linux, or Windows. Windows desktop users now have a native Windows Hub app; the PowerShell installer and a WSL2 Gateway are both supported too
- `pnpm` is only needed if you build from source

## How to choose among the six

The difference is not command length — it is what property you want:

| Method | What you get | What it costs |
|---|---|---|
| Installer script | Shortest path; OS detection and Node provisioning handled for you | Installs at the system level, on its choice of versions |
| Local-prefix installer (`install-cli.sh`) | OpenClaw and Node kept under `~/.openclaw` | Independent of system Node — and not shared with it either |
| npm / pnpm / bun | Reuses the Node toolchain you already run | You handle lifecycle-script policy yourself (see below) |
| Docker / Podman | Isolation and disposability, friendly to headless hosts | One more layer to manage; the build needs 2 GB of RAM |
| Nix | Reproducible, rollback-able, everything pinned | Your config file becomes read-only — see Nix mode below |
| From source | Runs `main` before it ships | You build it, and you own what breaks |

Absent a specific reason, `curl -fsSL https://openclaw.ai/install.sh | bash` is the answer; add `--no-onboard` to install without running onboarding.

## Where it actually gets stuck

These are the "the command looks right but it fails" cases — the main reason this article exists.

**1. npm 12 blocks OpenClaw's build scripts by default.** npm 12 no longer runs unapproved package lifecycle scripts, and OpenClaw has both `preinstall` and `postinstall`. So a global install has to read:

```bash
npm install -g openclaw@latest --allow-scripts=openclaw
```

Without it, npm reports the scripts as `blocked because they are not covered by allowScripts`. Mind the version differences: npm 11.16 accepts the option and, without it, only warns while still running the scripts; **npm 11.15 and earlier have no such option and must omit it**. Also, the `npm approve-scripts openclaw` command npm 11.16 suggests does not work for a global install — it fails with `ENOMATCH No installed packages match: openclaw`.

**2. Global pnpm installs cannot use `approve-builds`.** `pnpm approve-builds -g` is not supported for global installs; the approval has to ride along on the install command:

```bash
pnpm add -g --allow-build=openclaw openclaw@latest
```

**3. Bun can install it, but running it still needs Node.** `bun add -g --trust openclaw@latest` completes the install, yet the resulting `openclaw` executable still requires a supported Node runtime — OpenClaw's state layer uses `node:sqlite`. Bun is the package manager here, not the runtime.

**4. Docker builds get OOM-killed on 1 GB hosts.** The symptom is exit 137 during `pnpm install`. Budget at least 2 GB of RAM.

**5. `openclaw: command not found` is almost always PATH.** npm's global bin directory is not on your shell's `PATH`:

```bash
node -v           # is Node installed?
npm prefix -g     # where do global packages go?
echo "$PATH"      # is that bin directory in it?
```

## Containers: Docker and Podman

Docker is **optional**. Its purpose is isolation, disposability, or deploying to a host with no local dev environment. It is a separate matter from the agent sandbox — sandboxing is off by default and does not require the Gateway itself to run in a container.

Pre-built images are published primarily to the GitHub Container Registry (`ghcr.io/openclaw/openclaw`), with the same release mirrored to Docker Hub (`openclaw/openclaw`). A few variants are worth knowing: `slim` is the trimmed build, and the `-browser` variants bake Chromium into the image, which saves the first-run Playwright install for the sandboxed browser tool. Stable releases move `latest` and `main`; only the trailing-month Gateway releases move `extended-stable`.

When you upgrade by swapping images, the new Gateway runs startup-safe migrations and plugin convergence before reporting ready — and if it cannot do that safely it exits rather than reporting healthy. So when you see a container restart-looping, keep the mounted state volume and run `openclaw doctor --fix` once from the same image, instead of tearing it down.

Podman is the rootless alternative: containers run under Podman while the `openclaw` CLI on the host acts as the control plane. On macOS, because Podman runs inside a VM, browser access may need an SSH tunnel to that VM.

## Nix: buying reproducibility, selling writability

The Nix path goes through [nix-openclaw](https://github.com/openclaw/nix-openclaw), the first-party Home Manager module. The upside is direct: everything pinned, a launchd service that survives reboots, and `home-manager switch --rollback` to go back.

But know the price of Nix mode (`OPENCLAW_NIX_MODE=1`, set automatically by nix-openclaw) up front: **`openclaw.json` becomes immutable**. Every config-writing path refuses to edit it — setup, onboarding, a mutating `openclaw update`, plugin install/update/uninstall/enable, `doctor --fix`, `doctor --generate-gateway-token`, and `openclaw config set` — and the UI shows a read-only banner. You edit the Nix source instead. Auto-install and self-update flows are disabled as well.

That is not a defect; it is what promising reproducibility necessarily costs. But if `doctor --fix` is your usual repair reflex, this path will feel wrong.

## Updating: the channel decides more than the version

`openclaw update` detects your install type (npm, pnpm, Bun, or git), fetches the latest version, runs `doctor`, and restarts the gateway. It has no `--verbose`; for diagnostics use `--dry-run` to preview or `--json` for structured results.

The semantics differ meaningfully between channels:

- `beta` prefers the beta dist-tag but **falls back to stable when the beta tag is missing or older**. Use `--tag beta` when you specifically want that beta build
- `extended-stable` is package-only and **fails closed** — missing or inconsistent registry data is an error, never a silent fallback to `latest`
- `dev` gives you a persistent, moving GitHub `main` checkout

The less obvious part: **channels are also how you switch install type**. `openclaw update --channel dev` converts an npm package install into an editable git checkout, `--channel stable` converts it back, and your state, config, credentials, and workspace in `~/.openclaw` are preserved either way. Preview with `--dry-run` before switching.

## Verifying and migrating

Whichever method you used, run these three:

```bash
openclaw --version      # the CLI is available
openclaw doctor         # config is sound
openclaw gateway status # the Gateway is running
```

When migrating to a new machine, **move the entire `~/.openclaw` directory**, not just `openclaw.json`. It holds API keys, OAuth tokens, session history, and channel connection state — so file permissions and transport encryption both matter while it is in transit.

A Raspberry Pi works, because inference happens in the cloud and the Pi only runs the Gateway; in practice the biggest lever is using a USB SSD rather than an SD card. Startup tuning for low-power and ARM hosts (`NODE_COMPILE_CACHE`, systemd restart policy) is covered in the next article.

## The big picture

The six methods are really combinations of three trade-offs: **whether to touch the system layer** (installer vs. local prefix vs. container), **whether you need reproducibility** (Nix vs. everything else), and **whether you want unreleased code** (source or the `dev` channel vs. releases). The commands will change; those three axes will not.

The real traps cluster in one place: package-manager policy on lifecycle scripts, which happens to have shifted over the past year. If your install stalls at the npm or pnpm step, go back to those two entries before reaching for a different method.

Next up: cloud deployment.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Three commands that would fail as written were corrected**: global npm installs now need `--allow-scripts=openclaw` (npm 12 blocks lifecycle scripts by default), pnpm must use `pnpm add -g --allow-build=openclaw` (`approve-builds -g` is unsupported for global installs), and the Node requirement moved from "24 or 22.14+" to "22.22.3+ / 24.15+ / 25.9+, Node 26 recommended". The article was also refocused: step-by-step install commands are left to the official docs, and this piece now covers selection trade-offs and failure points. Added the local-prefix installer, Docker image variants and upgrade behavior, `extended-stable` / `dev` channel semantics, and the read-only cost of Nix mode. Bun was corrected from "not suitable for production" to "a viable install path that still requires a Node runtime".

## References

This article draws on the following official OpenClaw documentation:

- [Install](https://docs.openclaw.ai/install/) — install overview, system requirements, and per-package-manager lifecycle-script policy
- [Getting Started](https://docs.openclaw.ai/start/getting-started) — quickstart
- [Docker](https://docs.openclaw.ai/install/docker) — containerized deployment, image variants, and upgrade behavior
- [Nix](https://docs.openclaw.ai/install/nix) — declarative installation and Nix-mode behavior changes
- [Updating](https://docs.openclaw.ai/install/updating) — updates, channel semantics, and install-type switching
- [Linux server](https://docs.openclaw.ai/vps) — startup tuning for low-power hosts
