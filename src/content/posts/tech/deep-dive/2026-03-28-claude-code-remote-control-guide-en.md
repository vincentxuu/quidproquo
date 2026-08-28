---
title: "Claude Code Remote Control: Pick Up a Local Session from Any Device"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, remote-control, mobile, cross-device]
lang: en
tldr: "Remote Control turns claude.ai/code or the Claude mobile app into a remote for your local Claude Code session: code still runs on your own machine, with MCP servers and local tools fully available, while transcript sync passes through Anthropic servers. This post covers startup, reconnection, push notifications, file delivery, and the security boundary."
description: "How Claude Code's Remote Control works: starting, connecting, and resuming a local session from your phone or browser, push notifications and file transfer while connected, and how it fundamentally differs from cloud execution."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 37
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide)

## You Walked Away, but the Task Is Still Running

When Claude Code runs a long task, you don't stay glued to the terminal. A refactor is halfway done when you need to pick up your kid; the test suite needs twenty minutes but you have a meeting. What happens after you step away? The traditional answers are: wait and watch, or deal with it later. [Scheduled tasks](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide) solve a different problem — they make things run on their own when nobody is present, not let you keep directing things while you're out. Remote Control solves the second one.

## The Program Still Runs on Your Machine; the Browser Is Just a Remote

[Remote Control](https://code.claude.com/docs/en/remote-control) connects [claude.ai/code](https://claude.ai/code) or the Claude mobile app (iOS and Android) to a Claude Code session **running on your machine**. The key is where execution happens: Claude runs locally the entire time — code execution and filesystem access never leave your machine. The browser and phone are just a window into that session.

Your full local environment stays intact:

- Filesystem, [MCP servers](https://code.claude.com/docs/en/mcp), tools, and project configuration all remain available; typing `@` from the remote side even autocompletes file paths from your local project.
- The conversation and the progress of subagents and dynamic workflows stay in sync across all connected devices, so you can type interchangeably from terminal, browser, and phone.
- If your laptop sleeps or drops off the network, Claude Code reconnects automatically when you're back online, queuing subagent status updates during the outage.

That's a fundamentally different thing from cloud execution, where the program isn't on your machine at all. I'll compress that difference into one sentence at the end.

## Three Ways to Start, Then Connect

Prerequisites: a Pro／Max／Team／Enterprise subscription (API keys are not supported), a `/login` claude.ai account, and having accepted the workspace trust dialog in your project directory at least once. Team and Enterprise plans default to off until an Owner enables it in admin settings. Configurations that bypass the official API won't work either: Bedrock, a custom `ANTHROPIC_BASE_URL`, enterprise gateways — and even env vars that disable feature-flag evaluation, like `DISABLE_TELEMETRY`, will keep it from starting.

Three ways to start:

```bash
# Server mode: dedicated process waiting for remote connections,
# press spacebar to show a QR code
claude remote-control --name "My Project"

# Normal interactive session that's also remotely controllable;
# both local and remote can type
# --rc is also accepted
claude --remote-control
```

```
# Already inside a session? Turn it remote with full history intact
/remote-control
```

Server mode is a resident service that can serve multiple sessions (32 by default), and `--spawn worktree` gives each new session its own git worktree. After stopping the server, you have about four hours to bring sessions back from the same directory with `claude remote-control --continue` or `--session-id`. Interactive mode is an ordinary session that happens to be remote-controllable. The VS Code extension has a same-named `/remote-control`/`/rc` command too.

From another device there are three ways to connect: open the session URL directly, scan the QR code (straight into the Claude app on mobile), or find the session in the list at claude.ai/code or in the app (online sessions show a computer icon with a green dot). If manual startup gets old, `/config` has an "Enable Remote Control for all sessions" toggle that connects every interactive session automatically.

## What You Can Do Once Connected

The basics are three things: **watch progress** — the terminal conversation appears live on your handheld device; **reply** — including interjecting mid-turn, where messages queue until the current action finishes; **get notified**.

Notifications deserve their own paragraph. While Remote Control is connected, the built-in `PushNotification` tool can push to your phone — typically when a long task finishes or Claude needs a decision from you to continue. You can also just ask in your prompt: "notify me when the tests finish." The switches live in `/config`: "Push when Claude decides" for proactive notifications, "Push when actions required" for permission prompts. It stays quiet while you're typing in the connected terminal; as of v2.1.181, `CLAUDE_CLIENT_PRESENCE_FILE` can extend that "I'm at the machine" signal to other windows by skipping phone pushes while the marker file exists.

The reverse direction works too: the `SendUserFile` tool delivers session output — reports, screenshots, build artifacts — straight to your device, no digging through the transcript for paths; it is available when a Remote Control client is connected and in managed cloud environments such as Claude Code on the web. Permission prompts get forwarded to the phone as well; after several repeated permission confirmations, Claude Code will even proactively suggest approving from your phone. And background subagents and workflows can be stopped right from the remote device.

## Security: Who Can Reach Your Session

Architecturally it's outbound-only: the local session makes outbound HTTPS requests only and **never opens inbound ports**. All traffic travels through the Anthropic API over TLS, using multiple short-lived credentials that each expire independently.

One thing to think through: while connected, **the full session transcript — your messages, responses, tool activity — is stored on Anthropic servers**. That's the price of multi-device sync and reconnection after network drops. Organizations with Zero Data Retention compliance requirements simply can't enable the feature.

As for who can connect: auto-connect signs in with your own claude.ai account, so sessions appear only in your account. Team and Enterprise plans additionally get beta Trusted Devices: each device enrolls its own credential, and once a sign-in ages past 18 hours, interacting with a session requires Face ID／Touch ID／Windows Hello or a passkey — tying access to a known device plus recent authentication, not merely a signed-in account. Individual users should at least do this: don't turn on auto-connect for sessions running on shared machines.

## How It Differs from Cloud Execution

One sentence: both use the same claude.ai/code interface; what differs is where the session runs — Remote Control executes on your machine and touches your local environment, while Claude Code on the web executes in a cloud environment (Anthropic-managed VMs by default, or a self-hosted environment when an organization routes it there) for standalone tasks that need no local setup. The cloud half (`--cloud`/`--teleport`, auto-fix PRs, phone dispatch) is covered in full in the next post: [Claude Code in the Cloud](/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web-en).

A related sibling: if you're juggling several sessions rather than one, [agent view](/posts/tech/deep-dive/2026-08-26-claude-code-agent-view) is the multi-session monitoring piece of the puzzle.

## References

- [Continue local sessions from any device with Remote Control — Claude Code Docs](https://code.claude.com/docs/en/remote-control) — Official docs on startup modes, pairing, the security model, Trusted Devices, push notifications, and limitations
- [Tools reference — Claude Code Docs](https://code.claude.com/docs/en/tools-reference) — Built-in tool list, including `PushNotification` (phone pushes only while Remote Control is connected) and the `SendUserFile` file-delivery tool

## Update Log

- 2026-08-26: Initial version, written against the August 2026 official documentation.
