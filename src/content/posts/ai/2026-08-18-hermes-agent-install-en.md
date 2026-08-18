---
title: "Installing and Upgrading Hermes Agent: Check the Support Tier Before You Pick a Path"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, installation, windows, termux, upgrade, nous-research]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 2
tldr: "Hermes install paths come in three support tiers: macOS (Apple Silicon), Windows 10/11, Linux/WSL2, and Docker are Tier 1; Termux and Nix are Tier 2; pip, brew, AUR, and Intel Macs are explicitly unsupported — fixes for those won't be merged. On the upgrade side, `hermes update` snapshots state first, then compiles nine critical files after the pull and hard-resets the checkout if any fail to parse."
description: "Practical notes on installing and upgrading Hermes Agent: the support matrix, per-user versus root layouts, native Windows file locks and antivirus false positives, the narrowed Termux bundle, non-sudo service accounts, and the update path's snapshots, auto-rollback, and disconnect protection."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-install)

Post 2 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

Installation rarely deserves a whole post. It does here, because *how* you install Hermes decides whether upstream will help you when it breaks. The official [Platform Support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support) page is unusually blunt about this — read it first, not last.

## Support tiers first, commands second

| Tier | Platforms | What upstream promises |
|---|---|---|
| **Tier 1** | macOS (Apple Silicon), Windows 10/11 (x86_64, aarch64), Linux/WSL2 (x86_64, aarch64), Docker container | "We strive to never break installations and updates"; regressions here take priority |
| **Tier 2** | Android (Termux, aarch64), Nix (macOS/Linux/NixOS) | Best effort in-tree; releases may break them, no promise of prompt fixes |
| **Unsupported** | AUR, **macOS on Intel**, **pypi (`pip install` / `uv tool install`)**, **brew** | PRs to fix them "will _not_ be accepted"; compatibility code may be removed at any time |

Three of those deserve to be pulled out:

1. **`pip install hermes-agent` is not an installation method.** That runs against the instinct most Python projects train. The supported routes are the official installer, Docker, or the desktop installer.
2. **Intel Macs are unsupported.** Painful if an old x86 Mac is your home server.
3. **Nix was demoted to best effort**, with the docs saying outright: "Breaks often due to node.js packaging woes. Best of luck~!" The flake and NixOS module still exist; the warranty doesn't.

Docker carries one more constraint: **Docker installs don't support `hermes update`**. You upgrade by running a new image.

## The two main paths

Command-line install (Linux / macOS / WSL2 / Termux):

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Native Windows (PowerShell, no WSL required):

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

If you want the GUI, macOS and Windows can start from the Hermes Desktop installer, which the docs list as the recommended route. Going the other way works too — after a CLI-only install, `hermes desktop` fetches and launches the desktop app.

The installer supplies uv, Python 3.11, Node.js v22, ripgrep, and ffmpeg on its own. You need `git`; on Linux also `curl` and `xz-utils` (Node.js arrives as a `.tar.xz`), plus `g++` / `build-essential` if you want the desktop app's native modules to compile.

## Where it lands: per-user versus root

This matters on shared machines:

| Installer | Code | `hermes` binary | Data directory |
|---|---|---|---|
| Per-user (git installer) | `~/.hermes/hermes-agent/` | `~/.local/bin/hermes` (symlink) | `~/.hermes/` |
| Root (`sudo curl … \| sudo bash`) | `/usr/local/lib/hermes-agent/` | `/usr/local/bin/hermes` | `/root/.hermes/` or `$HERMES_HOME` |

Root mode follows the FHS layout, which suits one system install serving every user. But **per-user config — auth, skills, sessions — still lives in each user's `~/.hermes/`** (or an explicit `HERMES_HOME`). Installing once system-wide does not mean configuring once.

## Non-sudo service accounts: only Playwright really needs root

Running Hermes as an unprivileged `hermes` service account is a supported path. The only step that genuinely needs root is Playwright's `--with-deps`, which `apt`-installs the shared libraries Chromium wants (`libnss3`, `libxkbcommon`, and friends). When the installer can't find sudo it degrades gracefully: Chromium goes into the service user's own Playwright cache, and the exact admin command gets printed for someone else to run.

The clean split: an admin runs `sudo npx playwright install-deps chromium` once, then the service user runs the normal installer. If you don't need browser automation at all, `bash -s -- --skip-browser` skips the whole step.

Two details that bite:

- **PATH** — service accounts often lack `~/.local/bin`. A post-install `hermes: command not found` is usually this.
- **Nothing starts at boot** — a user-level service dies at logout until you run `sudo loginctl enable-linger <service-user>`.

One symptom worth memorizing: `ModuleNotFoundError: No module named 'dotenv'` almost always means you invoked the repo's source `hermes` file with system Python instead of the venv launcher.

## Three problems specific to native Windows

**One: Git Bash is bundled.** The installer unpacks MinGit into `%LOCALAPPDATA%\hermes\git` (~45MB, no admin rights, fully isolated from any system Git) and Hermes runs shell commands through it. An existing Git install is detected and used instead.

**Two: antivirus flags `uv.exe`.** The docs carry this as a first-class troubleshooting entry. Bitdefender and Windows Defender quarantine `%LOCALAPPDATA%\hermes\bin\uv.exe`; it's a false positive on Astral's uv, because ML-based engines routinely flag unsigned Rust binaries that download and install packages. Upstream's suggested verification runs `gh attestation verify` against Astral's release and compares file hashes — and the whitelist should target the **folder**, not the hash, since uv updates change it every version.

**Three: upgrades refuse to run behind a live process.** Windows won't let you replace a running `.exe`, so `hermes update` aborts when it sees another `hermes.exe` — the desktop backend, an open REPL, a running gateway. `--force` skips only the first check. The second guard — "a process is running from this venv's interpreter" — ignores `--force` entirely, because those processes hold `.pyd` files locked and a half-finished dependency sync strands the install between versions. Bypassing that one requires the explicit `hermes update --force-venv`.

Windows venv recreation is transactional: the old tree is renamed `venv.stale.*`, and it's deleted only after the replacement installs dependencies and passes baseline imports; on failure the partial tree becomes `venv.failed.*` and the previous venv is restored. Leftover directories with those names mean some process still holds a file handle.

## Termux: a deliberately narrowed build

Hermes on a phone is not the full build. It's a curated `.[termux]` extra (`python -m pip install -e '.[termux]' -c constraints-termux.txt`). The tested surface is the CLI, cron, PTY/background terminal, the Telegram gateway (best effort), MCP, Honcho memory, and ACP.

What you don't get:

- `.[all]` doesn't install on Android
- the `voice` extra is blocked by `faster-whisper → ctranslate2`, which publishes no Android wheels, so local transcription is out
- browser/Playwright bootstrap is skipped outright
- **no Docker backend inside Termux**, so no container isolation
- Android suspends background jobs, making gateway persistence best-effort rather than a managed service

Read that as: great as a pocket CLI agent, wrong as your always-on gateway host.

## Upgrading: what `hermes update` actually does

```bash
hermes update
```

Per the docs, that one line covers six steps:

1. **Pre-update snapshot** — `quick` by default, covering pairing data, cron jobs, `config.yaml`, `.env`, `auth.json`, and other runtime-mutable state. Files over 1 GiB are skipped so a large sessions DB never slows the update.
2. **git pull** from `main`, submodules included.
3. **Syntax validation with auto-rollback** — after the pull, Hermes compiles the nine critical files every invocation imports at startup. If any fails to parse, it runs `git reset --hard <pre-pull-sha>` so your shell stays bootable.
4. **Dependency install** (`uv pip install -e ".[all]"`).
5. **Config migration** — detects newly added options and prompts.
6. **Gateway auto-restart** — service-managed gateways go through systemd/launchd; manual ones are relaunched when the PID maps back to a profile.

Three flags worth knowing: `--check` compares against `origin/main` without touching files (ideal for cron gating), `--backup` takes a full `HERMES_HOME` zip (equivalent to `updates.pre_update_backup: full`), and `--branch <name>` tracks a non-default branch, auto-stashing your work, switching HEAD, and creating the local branch from `origin/<name>` — a branch that exists nowhere fails cleanly and restores your stash.

Non-interactive updates (the desktop app's Update button, a gateway-triggered update) have nobody to answer the "restore your local changes?" prompt, so `updates.non_interactive_local_changes` decides: `stash` (default, auto-restore) or `discard`. Note that `discard` drops the stash rather than running `git reset --hard` plus `git clean -fd`, so ignored paths like `node_modules`, `venv`, and build output are never touched.

One quietly considerate design: **the update ignores `SIGHUP`**, so a dropped SSH session no longer kills it midway, and all output mirrors to `~/.hermes/logs/update.log`. The old habit of wrapping upgrades in tmux can retire. `Ctrl-C` and SIGTERM are still honored — those are deliberate cancellations.

The recommended post-update check is `git status --short` → `hermes doctor` → `hermes --version` → `hermes gateway status` if you run one. An unexpectedly dirty tree means local modifications were reapplied on top; stop and look before continuing.

## Rollback and migration are different things

Rollback is a git operation: find a commit with `git log --oneline -10` or a tag with `git tag --sort=-version:refname`, `git checkout` it, rerun `uv pip install -e ".[all]"`, then `hermes gateway restart`. Always run `hermes config check` afterward — options added by newer versions become unrecognized keys on the older one.

Migration is a different pair of commands, and the difference matters:

- `hermes backup` / `hermes import` — the whole `~/.hermes`, **credentials included**
- `hermes profile export` — a single profile, **credentials excluded by design**

So "I already backed up with profile export" is not true. That is not a full backup.

## The takeaway

The one judgment to keep from this chapter: **find your platform's tier before you invest**. Intel Mac, pip installs, and AUR are dead ends today, while Termux and Nix are "works, don't depend on it." Flags change; when you need an exact list, go to the [CLI Commands Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands).

Next up: [model providers, routing, fallback, and credential pools](/en/posts/ai/2026-08-18-hermes-agent-providers).

## References

- [Hermes Agent — Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)
- [Hermes Agent — Platform Support](https://hermes-agent.nousresearch.com/docs/getting-started/platform-support)
- [Hermes Agent — CLI Commands Reference](https://hermes-agent.nousresearch.com/docs/reference/cli-commands)
- [Hermes Agent on GitHub](https://github.com/NousResearch/hermes-agent)
- [astral-sh/uv — upstream antivirus false-positive thread](https://github.com/astral-sh/uv/issues/13553)
- [Playwright CLI docs](https://playwright.dev/docs/cli)
