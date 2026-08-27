---
title: "Choosing a Mobile Client for Claude Code: Moshi's SSH Terminal, moshi-hook, and Pricing"
date: 2026-08-27
type: deep-dive
category: tech
tags: [claude-code, mobile, terminal, ssh, remote-control, tmux]
lang: en
tldr: "Moshi is an iOS/Android terminal app (plus a free Moshi Desktop web UI) that connects over SSH/Mosh straight to your own machine to drive Claude Code, Codex, and other coding agents. The free tier is a complete terminal; Pro ($7.99/mo and up) unlocks Mosh's connection resilience, deep tmux integration, and the diff viewer."
description: "A look at Moshi, a local-first terminal app — mobile and a free Moshi Desktop web UI — that connects over SSH/Mosh directly to your own machine to monitor Claude Code, Codex, and other AI coding agents. Covers the architecture, free vs. Pro, how it compares to Claude Code's own Remote Control, and its security model."
draft: false
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-27-moshi-terminal-app)

There are now at least three ways to check on a coding agent from your phone: Anthropic's own Claude Code Remote Control, open-source relay clients like Happy, and apps like [Moshi](https://getmoshi.app/) that take a different tack entirely — just give you a real terminal. Moshi is an iOS/iPadOS/Android/macOS app that launched in early 2026. Its pitch isn't a chat UI; it's a direct SSH, Mosh, or ET connection into a machine you already control, opening the same shell you'd get sitting at your desk.

## What Moshi is: a local-first, direct-connect terminal

The app describes itself as "a baby monitor for your AI agents" — the agent keeps running on your own machine while you're away, and Moshi's job is to pull you back in when it needs you (an approval, a finished turn, a stall). Behind that tagline is a concrete architectural choice: **the agent runs on your machine from start to finish; Moshi is only the mobile control surface and notification layer** on top of it. Nothing about your repo, your code, or your conversation gets moved into a vendor's cloud to execute.

The architecture splits into two layers:

- **Moshi core (the app itself)**: a plain terminal — no host-side install required. SSH/Mosh connections, biometric key protection, voice input, and agent usage tracking all work through the client plus standard SSH.
- **[`moshi-hook`](https://getmoshi.app/docs/hooks) (an optional host-side daemon)**: installed on your own machine, it normalizes hook events from Claude Code, Codex, and other agents into a unified inbox, and opens a local gateway bound only to `127.0.0.1:24543` that powers the diff viewer, browser preview, and multiplexer detection. Everything "agent-aware" about Moshi comes from this daemon.

Moshi's own comparison pages repeat the same line: **no wrapper command, no host daemon standing in for your shell**. The session you open from your phone is the same [tmux](https://getmoshi.app/docs/tmux) session you'd use anywhere else — Moshi is just a different screen plugged into it.

## moshi-hook: turning agent events into phone notifications

`moshi-hook` currently supports hook integration for 11 agents (Claude Code, Codex CLI, OpenCode, Antigravity, Cursor, Kimi, Qwen Code, Grok Build, Pi, Oh My Pi, and Hermes), normalizing their events into five inbox categories: `approval_required`, `task_complete`, `session_started`, `tool_running`, and `tool_finished`. This list comes from a single source — the official docs — and could change between versions. Any agent not on the list still runs fine in Moshi's terminal; it just doesn't get inbox notifications or approval cards.

Chat View — rendering an agent session as a native phone conversation, complete with tool cards, approval cards, and voice — is marked "experimental" by Moshi itself, supports a narrower agent list than the general hooks table, and needs a live host-gateway connection to work.

## Moshi Desktop: a free console for the big screen

Alongside the phone app, Moshi ships [Moshi Desktop](https://getmoshi.app/desktop) — a free control surface for macOS, Linux, and Windows. It isn't a separate app to install; it's **a web UI**. If a machine already has `moshi-hook` running, typing `moshi` opens `http://127.0.0.1:24544` in your browser, because Desktop shares the same `moshi-hook` daemon as the phone app.

The architecture follows the same pattern as everywhere else in the product: the daemon wraps the underlying Herdr/tmux sessions in a set of structured web APIs (workspaces, transcripts, a live PTY, approvals, dev-server ports), and the gateway binds to loopback only — reaching other machines happens over your own SSH, with no relay or middle server in the path. Moshi's own docs point out that Desktop is even more thoroughly relay-free than the phone app: push notifications, the inbox, and usage snapshots on mobile still route through Moshi's servers, because Apple's and Google's push services only deliver from a server, not from your dev box. Desktop needs none of that.

A few other details worth knowing:

- **It's free, with no Pro gate.** Moshi's own framing: "everyone who bought the app funded this, so Desktop is free for everyone."
- The terminal renders through [xterm.js](https://xtermjs.org/) with WebGL, and Moshi deliberately chose a web UI over an Electron app — "tiny footprint, and if a packaged app ever earns its keep, this same codebase becomes one."
- Browser preview works the same way on Desktop: dev-server ports the agent spins up are auto-detected, show up in a Web tab, and open in place — tunneled over the same SSH connection.
- Native Windows support is currently experimental; it also runs cleanly under WSL2.

Desktop rounds out Moshi's local-first pitch. Mobile can't fully escape Moshi's servers because of how push notifications work; Desktop removes that one remaining exception.

## How it differs from Claude Code's own Remote Control

Anthropic's own [Remote Control](https://getmoshi.app/compare/anthropic-remote-control) is free, first-party, and works out of the box with any Claude account. Moshi's own comparison page states the difference plainly: **Remote Control extends the Claude conversation; Moshi extends the whole machine.**

| Dimension | Claude Code Remote Control | Moshi |
|---|---|---|
| How it connects | Continues a Claude conversation through claude.ai/code | Connects directly over SSH/Mosh to your own machine, a real shell |
| Supported agents | Claude only | Claude Code, Codex, OpenCode, Grok, Cursor, and more |
| Persistence model | The Claude conversation itself continues | tmux/Zellij/Herdr sessions — the agent is just one process running inside them |
| Price | Free | Free tier is enough for casual use; deeper features need Pro |

The gap shows up most clearly after a turn ends. With Remote Control, the agent stays the center of the experience. With Moshi, you were already "at the machine" — you can inspect a log, restart a server, run a skipped test, open another repo, or hand the same problem to a different agent, all without switching remote-access tools. If your answer to "which agent do you use" is always Claude, Remote Control's focus is a real advantage. If the answer depends on the project, Moshi's cross-vendor layer is the point.

## Is the free tier enough: sessions vs. saved connections, and what Pro unlocks

Moshi's free tier isn't a stripped-down teaser — unlimited concurrent sessions, full SSH (key, password, jump hosts), biometric key protection, and agent usage tracking are all included for free. Two concepts are easy to conflate here:

- **Number of sessions**: the terminal windows you currently have open. You can run as many concurrently as you want, even on the free tier.
- **Number of saved connections**: the host profiles you've saved (host, port, username, auth method). Free is capped at 2; Pro is unlimited. If you only ever connect to one machine, this limit never matters. Once you're juggling a Mac, a VPS, and a friend's box, the third one needs Pro.

Pro ($7.99/mo, $69.99/yr, or a one-time $199 lifetime license — verified 2026-08, subscription pricing can change) unlocks the things that "heavy use" actually runs into:

| Feature | Free | Pro |
|---|---|---|
| Mosh transport (survives weak networks, network switches, lock screen) | ❌ | ✅ |
| Deep tmux/Zellij/Herdr integration | ❌ | ✅ |
| Diff viewer, browser preview | ❌ | ✅ |
| Image paste | ❌ | ✅ |
| Inbox actions | 5-action trial | Unlimited |
| Cloud dictation quota | 3 min/month | 60 min/month |

Moshi is fairly candid about this too: if you're occasionally dropping in to run a command or two, the free tier is enough. Pro only earns its keep once your phone becomes a daily coding-agent monitoring station.

## Security model: what stays local, what reaches Moshi's servers

Moshi's [privacy policy](https://getmoshi.app/privacy) and the `moshi-hook` docs draw a verifiable, specific boundary around data flow — not just a vague "we care about privacy":

- SSH private keys live in the iOS Keychain, gated by Face ID/Touch ID; copying a private key requires a second biometric confirmation.
- **Stays local, or travels over the direct connection only**: full Claude Code/Codex transcripts, diff contents, source code, and actual terminal traffic — all of it moves through the SSH-forwarded local gateway between phone and host, never through Moshi's servers.
- **What does reach Moshi's servers**: notification summaries only — the first 200 characters of a prompt, the first 80 characters of an assistant reply, up to 256 characters of the command or question behind an approval request, plus metadata like project name, session ID, agent, and model. In other words, exactly what you see in a push notification or inbox card, and nothing more.
- One exception worth flagging: local Whisper or Apple's on-device engine handle dictation entirely on-device with no quota, but if you opt into cloud dictation, audio is sent to OpenAI for transcription (3 min/month free, 60 min/month on Pro) — the one path in the privacy policy where actual content leaves the device.

## Getting started

1. On your phone: download Moshi from the App Store or Google Play — free, no account required.
2. On the machine you want to control:
   ```bash
   # macOS
   brew tap rjyo/moshi
   brew trust rjyo/moshi
   brew install moshi-hook
   brew install mosh tmux

   # Linux / WSL
   curl -fsSL https://getmoshi.app/install.sh | sh
   sudo apt install mosh tmux
   ```
3. Pair: run `moshi-hook host setup` on the host to print a QR code, then scan it with Easy Pair in the app.
4. Use tmux as your durable workspace: `moshi ~/projects/your-project` names the session after the directory and attaches you to it — start Claude Code or Codex inside as usual.
5. Turn on notifications: `moshi-hook install` writes the hook config into the agent's settings (e.g. `~/.claude/settings.json`), and `brew services start moshi-hook` keeps the daemon running so approvals actually reach your phone.

## Limits and a note of caution

Moshi is a young, independent-developer product — it launched around January–February 2026 (the App Store listing is dated 2026-02-24, and the Terms of Service were last updated in January 2026). The founder is credited on the site as "Joel" (X handle `@odd_joel`, company registered as Moshi Tech Ltd.) — worth flagging explicitly: **this is not** Stack Overflow co-founder Joel Spolsky. The shared first name makes the two easy to conflate in a search, and there's no independent source confirming this Joel's full background or team size. The moshi-hook agent list comes from a single source (the official docs), and there's no formal changelog to check feature history version by version. App Store ratings (4.8 stars, 487 ratings as of 2026-08) are solid, but as a new product it hasn't been through years of broad community scrutiny, and much of the language in its own comparison pages is written by Moshi itself — honest, but clearly not neutral, and not a substitute for independent review.

## The trade-off

Moshi is betting that the terminal comes first and the agent is just a process running inside it — the opposite of "agent first, terminal as an afterthought." That puts it up against two different kinds of competitors at once: traditional SSH clients (Termius, Blink Shell) and newer agent-specific clients (Happy, Claude Code Remote Control). Compared to a traditional SSH client, it adds an agent-aware inbox, approvals, and diffs. Compared to an agent-specific client, it keeps the integrity of "this is just the shell I already use" and a trust model where your data stays on your own machine. If you only use Claude and just want to approve the occasional prompt from your phone, Anthropic's free Remote Control is already enough. If you run several agents and live in tmux day to day, Moshi's free tier is worth trying — and Pro is worth paying for once it's actually part of your daily routine.

## References

- [Moshi](https://getmoshi.app/)
- [What Moshi does (official docs)](https://getmoshi.app/docs/introduction)
- [moshi-hook: Agent Approvals on Your Phone](https://getmoshi.app/docs/hooks)
- [Moshi Free vs Pro](https://getmoshi.app/docs/subscription)
- [Moshi pricing](https://getmoshi.app/pricing)
- [Moshi vs Claude Code Remote Control (official comparison)](https://getmoshi.app/compare/anthropic-remote-control)
- [Moshi privacy policy](https://getmoshi.app/privacy)
- [SSH, Mosh & ET Connections and Auth](https://getmoshi.app/docs/connections)
- [Mosh: The Mobile Shell (the underlying protocol)](https://mosh.org/)
- [Moshi Desktop](https://getmoshi.app/desktop)
