---
title: "Hermes Agent's Seven Terminal Backends: Moving to a Sandbox Turns Off Dangerous-Command Approval"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, sandbox, docker, modal, daytona, security]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 5
tldr: "Hermes can run commands on seven backends: local, ssh, docker, singularity, modal, daytona, and vercel_sandbox. The decisive trade-off isn't performance, it's approval — local and ssh run dangerous-command checks, the other five skip them entirely because the container is treated as the boundary. Also, Docker defaults to one long-lived container shared across sessions, not a fresh environment per conversation."
description: "Isolation levels and approval behavior across the seven Hermes terminal backends, Docker container lifecycle and mount trade-offs, state sync rules for SSH/Modal/Daytona, and why files left inside a sandbox disappear when it's torn down."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-terminal-backends)

Post 5 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

When an agent runs commands, the questions that matter are **whose machine it runs on and who gets hit when it goes wrong**. Hermes abstracts this into a swappable terminal backend — one line of `terminal.backend` — but swapping it changes more than you'd expect.

## Seven backends and their isolation levels

| Backend | Where commands run | Isolation | Dangerous-command check |
|---|---|---|---|
| `local` | Your machine | None | ✅ Yes |
| `ssh` | Remote host | Network boundary | ✅ Yes |
| `docker` | One long-lived container | Full (namespaces, cap-drop, PID limits) | ❌ Skipped |
| `singularity` | Apptainer container (`--containall`) | Namespaces | ❌ Skipped |
| `modal` | Modal cloud sandbox | Full (cloud VM) | ❌ Skipped |
| `daytona` | Daytona workspace | Full (cloud container) | ❌ Skipped |
| `vercel_sandbox` | Vercel Sandbox microVM | Full (cloud microVM) | ❌ Skipped |

That third column is the most important cell in this post. The security docs state it plainly: **sandboxed backends skip the dangerous-command check because the container is the boundary.**

The rule is defensible; its corollary gets missed. The moment you harden your setup by moving from local to docker, **you also switch off the "confirm before deleting `/`" human approval**. The security model shifts from "a person is watching" to "if it explodes, it only takes the sandbox with it." If that sandbox has host directories mounted or a forwarded `GITHUB_TOKEN`, the assumption no longer holds.

## Docker is not "a fresh container per conversation"

This is the most misread default. Hermes starts **one long-lived container** and routes every terminal, file, and `execute_code` call into it via `docker exec` — across sessions, `/new`, `/reset`, and `delegate_task` subagents. Close the TUI, `/quit`, launch a new `hermes`, and the container is still there; the next process finds it by label and reuses it.

Which means: **working-directory changes, installed packages, files in `/workspace`, and background processes all carry over**. Good for developer experience (no reinstalling dependencies every session), bad for security (residue from the last conversation is visible to the next).

Getting a fresh sandbox per conversation is explicit:

```yaml
terminal:
  backend: docker
  container_persistent: false   # one container per session, removed on close
```

In that mode `delegate_task` subagents still share the parent session's container. The docs' own criterion is clear: **use `false` when the sandbox is a security boundary between conversations; keep `true` when you want the long-lived shared environment.**

Other Docker knobs worth knowing:

- `docker_mount_cwd_to_workspace` (default `false`) — **Hermes does not pass your current directory into the container unless you opt in.** Enabling it gives the sandbox direct access to live host files; the docs label it a security trade-off outright.
- `docker_run_as_host_user` (default `false`) — off means the container runs as root and files written into mounts are root-owned on the host, so you `sudo chown` before editing. On fixes that, at the cost of no `apt install` and no writes to root-owned paths like `/root/.npm`.
- `docker_network: false` — runs the container with `--network=none`. Note that flipping this **removes the existing container and starts a fresh one**, killing any background processes inside it.
- `docker_env` vs `docker_forward_env` — the former writes literal values into `config.yaml`; the latter forwards from your shell or `.env`. **Use the latter for secrets** so tokens never land in the config file.
- `docker_extra_args` — arbitrary `docker run` flags, with a blunt warning: flags conflicting with the sandbox hardening (cap drops, `--user`, the workspace bind mount) **silently weaken isolation**.

Podman works out of the box via `HERMES_DOCKER_BINARY=podman`.

## The real trap with remote backends: teardown syncs only Hermes state

For SSH, Modal, and Daytona, Hermes pushes your `~/.hermes/` state (credential files, skills, cache) into the remote sandbox during the session, then on teardown syncs **changed state files** back by content hash; new remote files under a synced directory — a skill the agent wrote remotely, say — map back to the corresponding host path. Upload-only credential files are never overwritten. The sync retries up to three times and refuses to extract remote archives over 2 GiB.

Thorough — and then comes the sentence you have to memorize:

> This covers Hermes state (`~/.hermes/`), **not** arbitrary working-tree files inside the sandbox — have the agent copy important artifacts out explicitly.

**Work files inside the sandbox do not come back.** A report the agent spent three hours producing inside a Modal sandbox is gone when the sandbox dies unless something explicitly `scp`'d or `modal volume put` it out. This is where this layer causes actual losses.

Docker and Singularity are exempt: they use bind mounts and see the host filesystem live.

## How the three cloud backends differ

| | Modal | Daytona | Vercel Sandbox |
|---|---|---|---|
| Auth | `MODAL_TOKEN_ID` + `MODAL_TOKEN_SECRET`, or `~/.modal.toml` | `DAYTONA_API_KEY` | All three of `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID` |
| Persistence | Filesystem snapshots tracked in `~/.hermes/modal_snapshots.json` | Stop instead of delete, resume next session | Snapshot/restore filesystem |
| Limits | Preserves filesystem, not live processes or background jobs | 10 GiB disk cap, requests above are capped with a warning | Needs `pip install 'hermes-agent[vercel]'`; custom disk size unsupported |

Modal and Daytona sell **near-zero cost while idle** — the sandbox hibernates and wakes on demand. For the common personal pattern of "gateway is always up, actually used a few times a day," that's the economical option, and it's what upstream means by "not tied to your laptop."

Vercel Sandbox is the newest of the seven, with `node24 | node22 | python3.13` runtimes. One-off local development can use short-lived Vercel OIDC tokens, but long-running deployments need the three-part access token setup.

## Two behaviors that are easy to miss

**`persistent_shell`** defaults to on for SSH and off for local. With it on, a single `bash -l` stays alive so `cd`, `export`, and shell variables persist across commands. Enable it locally with `TERMINAL_LOCAL_PERSISTENT=true`. **Commands needing `stdin_data` or sudo fall back to one-shot mode automatically**, since the persistent shell's stdin is occupied by the IPC protocol.

**`terminal.home_mode`** defaults to `auto`: host installs keep your real OS-user `HOME`, containers use `{HERMES_HOME}/home`. That's what lets `git`, `ssh`, `gh`, `az`, `npm`, Claude Code, and Codex find the credentials they already have. The cost is that **multiple profiles on one machine share the same user-level CLI credentials**. A profile that needs a separate git identity or SSH key has to switch to `profile` mode and populate that profile home itself.

## Where to start when it breaks

The backend troubleshooting list is short enough to memorize: Docker → run `docker version`; SSH → both `TERMINAL_SSH_HOST` and `TERMINAL_SSH_USER` must be set; Modal → `MODAL_TOKEN_ID` or `~/.modal.toml`; Daytona → `DAYTONA_API_KEY`; Singularity → `apptainer` or `singularity` on `$PATH`. And the general rule:

> When in doubt, set `terminal.backend` back to `local` and verify that commands run there first.

Fall back to local, confirm the command itself works, then add isolation. Same methodology as "keep routing off until the base provider is stable" from [the providers post](/en/posts/ai/2026-08-18-hermes-agent-providers): add one layer at a time.

Next: [memory and skills](/en/posts/ai/2026-08-18-hermes-agent-memory-skills) — the part where the agent rewrites itself.

## References

- [Hermes Agent — Configuration (terminal backends)](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Hermes Agent — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Modal](https://modal.com/)
- [Daytona](https://www.daytona.io/)
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox)
- [Apptainer (formerly Singularity)](https://apptainer.org/)
