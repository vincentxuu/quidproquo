---
title: "The Hermes Agent Gateway and Scheduler: An Unattended Agent's Biggest Risk Is Spending Your Money"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, gateway, telegram, discord, cron, automation]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 8
tldr: "One gateway process fronts 30-plus chat platforms and denies every user not on an allowlist or paired by DM. The scheduler adds two unusual guards: pre-dispatch validation marks a misconfigured job `blocked_config` without making a single LLM call, and the model drift guard makes unpinned jobs fail closed when the global model changes — protecting you from an hourly job quietly following you onto a paid model."
description: "The Hermes Agent multi-platform gateway and cron scheduler: the platform capability matrix, allowlists and DM pairing, group session isolation, systemd/launchd service pitfalls, and cron's model resolution order, drift guard, preflight validation, and no-agent mode."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-gateway-cron)

Post 8 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

The gateway is how Hermes delivers on "not tied to your laptop": one resident process holds every platform connection and keeps conversation continuity across them. Once the agent is resident and scheduling its own work, the question changes from "is it pleasant to use" to "what does it do while nobody's watching."

## Not seven platforms — thirty-plus

The official comparison table lists more than 30 channels: Telegram, Discord, Slack, Google Chat, WhatsApp (plus Cloud API), Signal, SMS, Email, Home Assistant, Mattermost, Matrix, DingTalk, Feishu/Lark, WeCom, Weixin, BlueBubbles and Photon (iMessage), QQ, Yuanbao, Microsoft Teams, LINE, ntfy, IRC, Buzz, SimpleX, and more.

But **capabilities are not equal**, and that's what should drive platform choice. The table scores seven columns: voice, images, files, threads, reactions, typing indicator, and streaming (progressive updates via message editing). Discord, Slack, Matrix, and Feishu score all seven; WhatsApp lacks threads and reactions; Signal lacks voice replies and streaming; SMS, ntfy, and IRC are nearly empty.

**If your workflow depends on watching output arrive incrementally, don't pick a platform without streaming** — the same agent feels live on Discord and arrives as one long-delayed block on Signal.

## The security default is the right one: deny everyone

> **By default, the gateway denies all users who are not in an allowlist or paired via DM.** This is the safe default for a bot with terminal access.

Two ways in. Allowlists via environment variables (`TELEGRAM_ALLOWED_USERS`, `DISCORD_ALLOWED_USERS`, `GATEWAY_ALLOWED_USERS`…), or **DM pairing**: an unknown user who DMs the bot receives a one-time code, and you approve it on the host with `hermes pairing approve telegram XKGH5N7P`. Codes expire after an hour, are rate-limited, and use cryptographic randomness.

`GATEWAY_ALLOW_ALL_USERS=true` exists, labeled "NOT recommended for bots with terminal access" — an honest label, given what sits behind the bot.

Unauthorized-DM behavior is configurable: `pair` (default, replies with a code) or `ignore` (silently drops). **Email defaults to `ignore`** for a practical reason: inboxes are full of unrelated unread mail.

There's also a policy question that's easy to get wrong: how sessions split in groups. `group_sessions_per_user: true` (default and recommended) gives each sender their own session inside a channel or group; `false` reverts to one shared room conversation — which means **participants share each other's context, token costs, and interrupt state**. Threads stay isolated from the parent channel either way.

`max_concurrent_sessions` caps active sessions across CLI, TUI/dashboard, and gateway combined. The implementation detail is considerate: **a slot is taken when a session runs its first turn, not when a chat window opens**, so idle desktop tabs and websocket reconnects can't starve the gateway.

## Running it as a service: two pitfalls that bite

Linux uses systemd (`hermes gateway install`), macOS uses launchd. Two traps are worth memorizing.

**One: never add an `ExecStopPost` kill drop-in.** The docs raise this to a danger-level warning. The installed unit already shuts down cleanly with `KillMode=mixed` plus `SIGTERM`, and uses `Restart=always` so updates and `/restart` respawn correctly. `ExecStopPost` fires on **every** stop, including clean restarts — so it `SIGKILL`s the freshly spawned instance, `Restart=always` respawns it, and you get an infinite restart loop (on Telegram, a flood of restart messages).

**Two: headless boxes want a user service plus linger, not a system service.** A system service needs root for every restart, including the automatic one at the end of `hermes update`. Running as non-root, the updater tries passwordless `sudo systemctl`, and if that's unavailable it skips the restart and prints the manual command rather than blocking on a password prompt. A user service with `sudo loginctl enable-linger $USER` gives you start-at-boot with zero root involvement.

On macOS the wrinkle is that launchd plists are static: **tools installed after setup (a new Node via nvm, ffmpeg via Homebrew) won't be on the gateway's PATH** until you rerun `hermes gateway install`.

Multiple installs (different `HERMES_HOME`) each get their own service name — `hermes-gateway` for the default, `hermes-gateway-<hash>` otherwise.

## Cron: the model resolution order decides who pays

Jobs can be created in natural language or cron expressions — `/cron add` in chat, `hermes cron create` on the CLI, or just telling the agent "every morning at 9am check Hacker News and send me a summary on Telegram." A job can attach zero or more skills and deliver results to the originating chat, local files, or configured platform targets.

What actually matters is the **model resolution order**, because it determines where unattended spend comes from:

1. **A per-job pin** — set by you via the dashboard, `hermes cron create/edit --model … --provider …`, or `jobs.json`. **The agent's own `cronjob` tool cannot set or change it**; inference pins are user-owned.
2. **`cron.model` / `cron.model_provider`** — a fleet-wide default independent of your chat model, so switching chat models with `hermes model` never touches the schedule.
3. **The global default** — only when neither of the above is set.

Case 3 comes with a guard I haven't seen elsewhere: the **model drift guard**. Hermes snapshots provider and model at job creation. If the global default later changes, the job **fails closed** — it skips the run, makes no inference call, and alerts you once, then stays silently skipped until you act or restore the config.

The scenario it protects against is specific: **you switch your chat model from a free endpoint to a paid one and forget you have an hourly job.** You can turn it off (`cron.model_drift_guard: false`), immediately after which the docs warn that unattended jobs will spend money on every run.

The second guard is **pre-dispatch validation**: before building any agent machinery, the scheduler checks that the provider key resolves (skipped when a fallback chain exists), attached skills are ready (no missing env vars, commands, or credential files), and delivery targets have gateway credentials. On failure the job becomes `blocked_config`, **one alert is sent, and no LLM call happens** — a misconfigured job never spends tokens. The next healthy run clears the state so a future break alerts again.

The third is recursion prevention: **a cron-run session cannot create more cron jobs.** Hermes disables cron management tools inside cron executions to prevent runaway scheduling.

There's also a mode that saves both money and complexity: **no-agent mode** runs a script on a schedule and delivers its stdout verbatim with zero LLM involvement. Monitoring tasks — disk space, backup results, health checks — need nothing more.

Quick commands follow the same spirit: define `type: exec` entries in `config.yaml` and type `/disk` or `/gpu` on any platform to run a shell command and get its output back — **zero tokens, no LLM call**, 30-second timeout. Checking server status from your phone shouldn't require an agent.

## The takeaway

The gateway turns "resident agent" from a concept into a service you operate, and what it gets right is putting **defaults on the conservative side**: deny everyone, isolate per user in groups, stop when cron config breaks, stop when the model drifts.

One practical addition: **before going live, read `hermes pairing list` and `hermes cron list` once each.** The first tells you who can reach this agent, the second tells you what it does when you're not looking. Those two lists describe the system more accurately than any config file.

Next: [the security model](/en/posts/ai/2026-08-18-hermes-agent-security) — approvals, deny rules, and prompt injection.

## References

- [Hermes Agent — Messaging Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)
- [Hermes Agent — Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
- [Hermes Agent — Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)
- [Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
