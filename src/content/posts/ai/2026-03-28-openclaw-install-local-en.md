---
title: "OpenClaw Installation Guide (Part 1): npm, Docker, Nix & Local Deployment"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, installation, docker, nix, podman, raspberry-pi, bun]
lang: en
tldr: "OpenClaw offers 6 local installation methods: installer script, npm, Docker, Podman, Nix, and Bun, plus Raspberry Pi deployment and building from source."
description: "A complete guide to installing OpenClaw locally, covering the installer script, npm/pnpm, Docker, Podman, Nix, Bun, Raspberry Pi, and building from source."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-install-local)

OpenClaw supports multiple installation methods, ranging from a single command to declarative Nix flakes. This post covers all local deployment options; the next one covers cloud platforms and Kubernetes.

## System Requirements

- **Node.js 24** (recommended) or Node 22.14+
- **macOS, Linux, or Windows** (both native Windows and WSL2 are supported; WSL2 is more stable)
- `pnpm` is only required when building from source

## Method 1: Installer Script (Recommended)

The fastest approach. Automatically detects your OS, installs Node (if missing), installs OpenClaw, and launches onboarding.

```bash
# macOS / Linux
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows PowerShell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

For CI/automation scenarios, you can skip onboarding:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard
```

## Method 2: npm / pnpm

If you manage Node yourself:

```bash
# npm
npm install -g openclaw@latest
openclaw onboard --install-daemon

# pnpm (requires approving build scripts)
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

If `sharp` compilation fails (usually due to a system-wide libvips installation):

```bash
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

## Method 3: Docker

Ideal for those who want an isolated environment or headless deployment.

**Prerequisites:** Docker Desktop or Engine + Docker Compose v2, at least 2 GB RAM.

```bash
./scripts/docker/setup.sh
```

This automatically builds the image, prompts for your API key, generates a gateway token, and starts everything with Docker Compose.

You can also use a pre-built image (GitHub Container Registry):

```bash
OPENCLAW_IMAGE=ghcr.io/openclaw/openclaw:latest ./scripts/docker/setup.sh
```

Key configuration:

| Environment Variable | Purpose |
|---|---|
| `OPENCLAW_IMAGE` | Use a remote image instead of building locally |
| `OPENCLAW_SANDBOX` | Enable agent sandbox (`1`/`true`/`yes`/`on`) |
| `OPENCLAW_EXTRA_MOUNTS` | Additional host bind mounts |
| `OPENCLAW_HOME_VOLUME` | Use a named volume to persist `/home/node` |

Health check endpoints: `/healthz` (liveness) and `/readyz` (readiness) -- no authentication required.

Docker Compose bind-mounts `~/.openclaw` into the container, so data persists across container rebuilds.

For easier Docker management, you can install the `ClawDock` shell helper:

```bash
mkdir -p ~/.clawdock && curl -sL https://raw.githubusercontent.com/openclaw/openclaw/main/scripts/shell-helpers/clawdock-helpers.sh -o ~/.clawdock/clawdock-helpers.sh
```

## Method 4: Podman (Rootless)

A rootless alternative to Docker. Architecturally, Podman runs the container while the `openclaw` CLI on the host acts as the control plane.

```bash
# Build image + configure
./scripts/podman/setup.sh

# Start
./scripts/run-openclaw-podman.sh launch
```

After setting `OPENCLAW_CONTAINER=openclaw`, you can manage the container with regular `openclaw` commands.

For automatic startup, use Quadlet:

```bash
./scripts/podman/setup.sh --quadlet
```

This creates a systemd user service.

On macOS, since Podman runs inside a VM, browser access may require an SSH tunnel to the Podman VM.

## Method 5: Nix

Declarative installation via the `nix-openclaw` Home Manager module. Features pinned versions and rollback support.

```bash
# Install Nix (if not already installed)
# Use nix-openclaw's agent-first template to create a local flake
# Configure secrets in ~/.secrets/
home-manager switch
```

In Nix mode (`OPENCLAW_NIX_MODE=1`), OpenClaw disables auto-installation and self-updates, making behavior fully predictable.

Rollback:

```bash
home-manager switch --rollback
```

## Method 6: Bun

Run the CLI with the Bun runtime. Suitable for development, **not recommended for production** (known compatibility issues with WhatsApp and Telegram).

```bash
bun install
bun run build
bun run vitest run
```

Note that Bun ignores `pnpm-lock.yaml`, and some scripts (`docs:build`, `ui:*`) still need to be run with `pnpm`.

## Building from Source

For contributors or those who want to run the latest version:

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm ui:build && pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

Or install the GitHub main branch directly:

```bash
npm install -g github:openclaw/openclaw#main
```

## Raspberry Pi

OpenClaw can run on a Raspberry Pi because model inference happens in the cloud -- the Pi only runs the Gateway.

**Requirements:** Raspberry Pi 4 or 5, at least 2 GB RAM (4 GB recommended), 64-bit Raspberry Pi OS Lite, 16 GB+ SD card or USB SSD.

```bash
# System update + install essential tools
sudo apt update && sudo apt install -y git curl build-essential

# Install Node 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo bash -
sudo apt install -y nodejs

# Install OpenClaw
curl -fsSL https://openclaw.ai/install.sh | bash
```

Performance optimization tips:
- A USB SSD performs significantly better than an SD card
- Set up 2 GB of swap (used when RAM runs low)
- Enable `NODE_COMPILE_CACHE` to speed up repeated CLI launches
- Disable unnecessary services (Bluetooth, CUPS)
- Reduce GPU memory allocation

Use an SSH tunnel to access the Control UI remotely.

## Verifying the Installation

Regardless of which method you used, run these three checks after installation:

```bash
openclaw --version       # CLI is available
openclaw doctor          # Configuration is correct
openclaw gateway status  # Gateway is running
```

If `openclaw` is not found, check whether `$(npm prefix -g)/bin` is in your `$PATH`.

## Updating

```bash
# Simplest method
openclaw update

# Specify a channel
openclaw update --channel beta

# Preview without applying
openclaw update --dry-run
```

You can also enable automatic updates in your `openclaw.json` configuration. The Stable channel waits 6 hours before applying updates (staged rollout), while Beta checks hourly and applies immediately.

After updating, remember to run:

```bash
openclaw doctor          # Migrate settings + verify
openclaw gateway restart # Reload services
```

## Rollback

npm: `npm i -g openclaw@<version>`, then run doctor + restart.

Source: `git checkout <commit>`, rebuild with `pnpm install && pnpm build`, then restart.

## Uninstalling

```bash
# Simplest method
openclaw uninstall

# Automated (non-interactive)
openclaw uninstall --all --yes --non-interactive
```

Manual steps: stop the gateway, uninstall the service, delete `~/.openclaw`, remove the CLI via npm/pnpm, and delete the macOS app (if applicable).

If the CLI is already gone, here is how to remove the service on each platform:
- **macOS (launchd):** `launchctl bootout gui/$UID/ai.openclaw.gateway`
- **Linux (systemd):** `systemctl --user disable --now openclaw-gateway.service`
- **Windows:** `schtasks /Delete /F /TN "OpenClaw Gateway"`

## Migrating to a New Machine

```bash
# Old machine: backup
openclaw gateway stop
cd ~ && tar -czf openclaw-state.tgz .openclaw

# New machine: restore
cd ~ && tar -xzf openclaw-state.tgz
openclaw doctor
openclaw gateway restart
```

Key point: you need to migrate the **entire `~/.openclaw` directory**, not just `openclaw.json`. It contains API keys, OAuth tokens, session history, and channel connection state. Pay attention to file permissions and use encrypted transfer.

## Summary

Each of the 6 installation methods suits different scenarios:

| Method | Best For |
|---|---|
| Installer script | Most users -- the fastest option |
| npm/pnpm | Developers with an existing Node environment |
| Docker | Isolation, headless, or containerized deployment |
| Podman | Rootless container setups |
| Nix | Reproducibility and rollback capability |
| Bun | Rapid iteration during development (not for production) |
| Source | Contributors or those wanting the latest code |
| Raspberry Pi | Low-cost 24/7 Gateway |

The next post covers cloud platform deployment: Kubernetes, Fly.io, Hetzner, GCP, Azure, and Ansible.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/install/index.md](https://github.com/openclaw/openclaw/blob/main/docs/install/index.md) -- Installation overview
- [docs/install/docker.md](https://github.com/openclaw/openclaw/blob/main/docs/install/docker.md) -- Docker installation
- [docs/install/podman.md](https://github.com/openclaw/openclaw/blob/main/docs/install/podman.md) -- Podman installation
- [docs/install/nix.md](https://github.com/openclaw/openclaw/blob/main/docs/install/nix.md) -- Nix installation
- [docs/install/bun.md](https://github.com/openclaw/openclaw/blob/main/docs/install/bun.md) -- Bun installation
- [docs/install/raspberry-pi.md](https://github.com/openclaw/openclaw/blob/main/docs/install/raspberry-pi.md) -- Raspberry Pi deployment
- [docs/install/updating.md](https://github.com/openclaw/openclaw/blob/main/docs/install/updating.md) -- Update guide
- [docs/install/uninstall.md](https://github.com/openclaw/openclaw/blob/main/docs/install/uninstall.md) -- Uninstallation
- [docs/install/migrating.md](https://github.com/openclaw/openclaw/blob/main/docs/install/migrating.md) -- Migration guide
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md) -- Getting started
