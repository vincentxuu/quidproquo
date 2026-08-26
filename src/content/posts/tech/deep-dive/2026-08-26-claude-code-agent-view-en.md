---
title: "Managing Multiple Claude Code Sessions: Agent View, Dispatch, State Monitoring, and Cross-Session Messaging"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, agent-view, cross-session-messaging]
lang: en
tldr: "`claude agents` gives you one screen listing every background session, grouped by state — Working / Needs input / Completed. Press Space to peek, Enter to attach. Combined with cross-session messaging (ListAgents / SendMessage, v2.1.224+), sessions can also message each other directly, with same-machine traffic never touching Anthropic servers."
description: "A deep dive into Claude Code's Agent View: dispatching background sessions, reading the six state icons and Haiku-generated row summaries, getting notified when sessions need input, plus the same-machine and cross-machine mechanics of cross-session messaging and its security design."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 26
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-agent-view)

By this point in the series you've seen the [multi-agent overview](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview): subagents share the work inside a single session, and [agent teams](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide) let multiple teammates collaborate within one team. But neither solves a more everyday problem — **you have five Claude Code sessions open across five terminal tabs, all running at once, and there is no way to keep up**. Which one is waiting on your answer? Which finished ages ago? You'd have to switch through every tab and scroll the transcripts to find out.

That's exactly what Agent View is for: one screen for the state and needs of every session. It's a distinct piece of the official multi-agent landscape — complementary to subagents and agent teams, not overlapping them. The docs currently flag it as research preview; the interface and keyboard shortcuts may change.

## What agent view is

Run `claude agents` and the whole terminal becomes one table: each row is a background session showing its name, current activity, and age, grouped by state — whatever needs you sits at the top. Press `Esc` to return to your shell; the sessions keep running in the background, and they're all still there next time you open the view.

The key concept is what "background session" means: each one is a full Claude Code conversation carried by a separate supervisor process, **able to keep working without any terminal open**. Close agent view, close your shell, start new interactive sessions — dispatched work keeps going. If your machine sleeps, session processes resume on wake; shutting down still stops running sessions.

By default the list shows every background session you've started across all projects — one session in repo A and another in a worktree both appear on the same table. To narrow it down, pass `--cwd`:

```bash
claude agents --cwd ~/projects/my-app
```

Know the boundaries: interactive sessions you have open in other terminals don't appear until you background them with `/bg`, and subagents or teammates a session spawns aren't listed as separate rows.

## Dispatching new sessions

Agent view has an input at the bottom. Type a prompt describing a task and press Enter — a new background session starts, automatically named from the prompt (by a Haiku-class model; rename later with `Ctrl+R`). One thing to internalize: **every prompt here starts a brand-new session**. Typing another line launches a second session, not a follow-up to the first.

The input supports prefixes that control how a session starts: if the first word matches one of your defined subagents, that subagent runs as the main agent; `@<repo>` dispatches into a sibling repository; `! <command>` runs a background shell job that also appears as a row. `Shift+Enter` dispatches and immediately attaches.

Besides dispatching from agent view, two more paths move work into the background:

```bash
# Start a background session straight from the shell
claude --bg "investigate the flaky SettingsChangeDetector test"

# From inside an existing session
/bg    # Move the current conversation to the background, freeing the terminal
/fork  # Copy the conversation into a new background session; original keeps running
```

A `/fork` copy is instructed to create its own worktree before making code changes, so the copy and the original never touch each other's files. It works the other way too: press `←` on an empty prompt in any foreground session and it moves to the background while agent view opens — switching sessions without leaving the terminal.

## Monitoring state and the "needs input" signal

Each row starts with an icon that encodes two things at once. Color and animation carry the task state: animated means Working, yellow means Needs input (waiting on an answer, a permission decision, or something only you can provide), dimmed is Idle, green Completed, red Failed, grey Stopped. Shape carries process liveness: a solid symbol means the process is alive and responds immediately; `∙` means the process has exited but you can still peek, reply, and attach — Claude restarts from where it left off.

The one-line summary on each row is written by a [Haiku-class model](https://code.claude.com/docs/en/model-config), so you can tell what a session is doing, blocked on, or produced without opening the transcript. While working, the row text updates at most once every 15 seconds — reusing the session's own output without sending a model request — and gets rewritten by the model when each turn ends. If a session opens a pull request, a `#1234` label appears at the right edge linking to it, colored by review status: green means checks passed and it's ready to merge.

"Not needing to watch" only works if sessions reliably tell you when they do need watching. Agent view has three layers of notification for the moment a session blocks on you: the row moves into the Needs input group at the top; the terminal tab title becomes `2 awaiting input · claude agents`; and a notification fires through your configured terminal notification channel, alongside a Notification hook carrying an `agent_needs_input` or `agent_completed` type.

Handling it comes in two grades. Select a row and press `Space` to open the peek panel: it shows the exact question the session is asking or its latest result, and typing a reply plus Enter sends it without leaving agent view; questions with numbered choices are answered with a number key. When you need the full conversation, press `Enter` or `→` to attach — the session takes over the terminal as a normal interactive session — then press `←` to detach back to the table. Detaching never stops a background session.

## Session-to-session messaging: cross-session messaging

Agent view solves "you watch every session." Cross-session messaging goes one step further: **sessions talk to each other**. When one session discovers its changes broke what another is building, it can warn that session proactively — no need for you to relay messages between terminals. This requires Claude Code v2.1.224+ (macOS/Linux/WSL 2; v2.1.234+ on native Windows), and it's simply on once you meet the version requirement.

Claude does this with two tools: `ListAgents` discovers which sessions it can reach, and `SendMessage` delivers a message to one of them. You never invoke either yourself — plain language is enough: "ask the session in my other terminal whether the migration finished." To name a recipient, use an `@` mention of the session name; run `/list-agents` to see this session's own name plus everything it can reach.

How the message travels depends on the destination:

| Where the other session runs | How it travels |
|---|---|
| Same machine | Over a per-session Unix socket (named pipe on Windows), **never through Anthropic servers** |
| Another of your machines | Through Anthropic servers, arriving over that machine's Remote Control connection |
| Claude Code on the web | Through Anthropic servers, straight to the cloud session |

Long-running tasks get one more convenience: Claude can ask another session on this machine to send a single notice when it next goes idle or exits (`notify_when_idle`, v2.1.236+). It's one-shot — the subscription tears itself down after firing, expires after 12 hours if no notice arrives, and neither side polls the other.

### The security design: a session's word isn't yours

This is the most consequential decision in the whole mechanism. When session A messages session B, Claude Code tells B's Claude explicitly: **this message came from another session, not from you**. Four concrete limits follow: the message can never count as your consent on a pending permission prompt; the receiving Claude is instructed to never change permission settings, CLAUDE.md, or other configuration because another session asked; commands written in the message text (like `/compact`) arrive as plain text and are never executed; and if acting on the message requires a permission the receiving session lacks, you see the same permission prompt you'd see for any other work.

You can tighten the inbound side further: set `crossSessionInbound` to `accept` / `hold` / `refuse` — deliver normally, hold for your approval, or drop outright. To require approval before anything leaves the machine, set `isolatePeerMachines` to `true` — it holds even in bypassPermissions mode.

## When agent view vs. agent teams

The test is simple: **are you the only coordinator?**

- Independent tasks that finish and hand results back to you (bug fix, PR review, flaky-test investigation) → agent view. You dispatch, peek occasionally, attach where input is needed.
- Tasks that need continuous coordination toward a shared goal → agent teams. Teammates message point-to-point and know what the others are doing.
- Just offloading work within one session (search, exploration) → subagents suffice; see the [overview post](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview).
- Two or three sessions that only occasionally need to swap a finding → cross-session messaging alone, no need to move into a team.

My takeaway: treat it as a multitasking operating system. Agent view is the task manager — one glance shows which processes are running and which are blocked on I/O. Cross-session messaging is IPC between processes. You're still the scheduler — you just no longer act as the eyes by switching terminal tabs.

## References

- [Manage multiple agents with agent view — Claude Code Docs](https://code.claude.com/docs/en/agent-view) — official documentation on dispatch methods, the six state icons, the peek panel, the supervisor process, and pull request status labels
- [Message your other Claude Code sessions — Claude Code Docs](https://code.claude.com/docs/en/cross-session-messaging) — the ListAgents/SendMessage tools, same-machine socket vs. cross-machine Remote Control delivery paths, inbound-message security limits, and the `crossSessionInbound` control

## Changelog

- 2026-08-26: Initial version, based on official docs from August 2026 (agent view is in research preview; messaging requires v2.1.224+, `notify_when_idle` requires v2.1.236+).
