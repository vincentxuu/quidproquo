---
title: "How Screenpipe Gives Agents Screen Memory: Capture, MCP, Pipes, and the License and Privacy Trade-offs"
date: 2026-10-24
category: ai
type: deep-dive
tags: [screenpipe, agent-memory, mcp, context-engineering, ai-agent, privacy]
lang: en
tldr: "Screenpipe continuously captures your screen and audio locally, stores it in SQLite, and lets agents ask what you just did through MCP and a localhost API. It is source-available rather than open source, commercial use needs a separate license, and usage analytics are on by default."
description: "A guide to Screenpipe's event-driven capture, SQLite storage, MCP server, and Pipes scheduled agents, plus the license, telemetry, and permission-scope issues to check before adopting it."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-24-screenpipe-local-screen-memory)

Your agent does not know which document you were reading, which meeting you just left, or what code you copied a minute ago. [Screenpipe](https://github.com/screenpipe/screenpipe) lets the computer remember for it: it captures screen and audio locally, stores them in SQLite, and lets tools like Claude and Cursor query the history over MCP. This guide covers how it works, how to connect it to an agent, and three things to settle before installing it: the license, the default telemetry, and how far its permissions reach.

## What it is

Screenpipe is a Rust desktop application for macOS, Windows, and Linux, built by Negentropy Labs (YC S26). Its README now leads with "record your company's computer work, map workflows, find work worth automating, and power agents' context," while also listing individual developers and knowledge workers as users.

It covers one specific slice of agent memory: **your operation history on the computer**. That differs from conversation memory. Conversation memory holds what you told the model; Screenpipe holds what you saw, heard, and typed across every application. If you are still sorting out those kinds of memory, start with the [Agent Memory Engineering series intro](/posts/ai/2026-09-19-agent-memory-engineering-series-intro) (in Chinese).

## Who it is for

It fits individual developers who want a coding agent or chat assistant to know what they were just doing, and people who want automated daily summaries, standup reports, or time logs. You need to be comfortable on a command line and understand MCP basics.

It does not fit environments where screen recording is not allowed, nor anyone about to install it on a work computer without having read the license. Both points are in the Limits section.

## Content map

The system is a one-way pipeline, and each stage has a clear output:

| Stage | What it does | Details |
|---|---|---|
| Capture | Screenshot on events | App switch, window focus, click or scroll, typing pause, and clipboard copy all trigger it; when nothing changes it takes a fallback capture about every 5 seconds |
| Text extraction | Reads on-screen text | Prefers the OS accessibility tree (structured text for buttons, labels, fields); falls back to OCR when that is empty (Apple Vision on macOS, native OCR on Windows, Tesseract on Linux) |
| Audio | Microphone and system audio | 30-second chunks by default, transcribed locally with Whisper or optionally with cloud Deepgram; includes speaker identification |
| Storage | Everything on disk locally | Text and indexes in `~/.screenpipe/db.sqlite` (with FTS5 full-text search); screenshots and audio in `~/.screenpipe/data/` |
| Interfaces | REST and MCP | A REST API on `localhost:3030`, including `/search` and `/raw_sql`; an MCP server for agents to query directly |
| Scheduling | Pipes | One `pipe.md` file is one scheduled agent |

Event-triggered capture instead of a fixed frame rate is the central design choice. Unchanged screens are not stored, so storage and CPU cost less than continuous video; the official estimate is roughly 5% to 20% CPU, with RAM and storage varying by settings and activity, so measure a representative day yourself.

The app now calls Pipes "Scheduled tasks," but the CLI commands, API paths, and config file keep the names `pipe` and `pipe.md`, so you will see both in the docs.

## A concrete example

Install it and connect Claude Code:

```bash
npx screenpipe record
claude mcp add screenpipe -- npx -y screenpipe-mcp@latest
```

Then ask `what did i see in the last 5 mins?`. To see raw data, call the local API directly:

```bash
export SCREENPIPE_LOCAL_API_KEY="$(npx -y screenpipe@latest auth token)"

curl -H "Authorization: Bearer $SCREENPIPE_LOCAL_API_KEY" \
  "http://localhost:3030/search?q=budget&content_type=audio&limit=10"
```

Next, a scheduled task. This `pipe.md` is adapted from the official standup and time-report examples; it drafts a daily summary with permissions set to `reader` (which restricts the Screenpipe API calls it can make; see Limits):

```markdown
---
schedule: daily
enabled: false
permissions: reader
---

Using the time range from the context header, summarize yesterday's work from /search and /activity-summary:
what I did, what is next, and what is blocked.
Write it to ./output/<date>.md. Do not send it or update any external service.
```

`enabled: false` is deliberate: run it once by hand with `npx -y screenpipe@latest pipe run <name>`, check the output, then turn the schedule on.

## Limits

**The license is not open source.** The README calls it source-available, and the LICENSE is the Screenpipe Commercial License. Personal non-commercial use, non-profit, educational, and research use are free, plus a 7-day evaluation period. The commercial rule is direct:

> Any Commercial Use of the Licensed Work, including source code you modify and binaries you or a third party compile from source, requires a paid Screenpipe Enterprise plan and a commercial license from the Licensor expressly covering that use.

The project moved its source from MIT to this license on 2026-06-09; earlier versions released under MIT stay under MIT. Official builds fall under a separate terms of service: up to four individual licenses per company, and five or more users need a Team or Enterprise plan. Before adopting it at work, read LICENSE.md and the terms of service rather than relying on repo stars.

**"Local-first" does not mean nothing leaves the machine.** Screenshots, audio, transcripts, and the index stay local by default, but the README FAQ says the desktop app has PostHog analytics and Sentry error reporting enabled by default; cloud transcription, cloud AI, sync, and integrations send the data each feature needs to the corresponding service. To stay fully local, turn off the analytics (telemetry) option under Settings → Privacy, choose local transcription plus a local model such as Ollama, and turn off cloud media analysis. The official docs call local capture, local search, and local Ollama the safest setup.

**Permissions only cover Screenpipe's own API.** Pipes have full API access by default. Adding `permissions: reader` or custom `allow` and `deny` rules (apps, windows, content types, API paths; deny wins) narrows that, but the docs state it does not sandbox the agent's shell, files, or external tools. `reader` is also not read-only: it blocks deletion and raw SQL, yet still allows notifications, output submissions, and reading credentials for connected services. The field names in the README (`allow-apps`, `deny-windows`, and so on) also differ from the `permissions` syntax on the docs page, so follow the docs for the version you installed.

**On-screen content becomes agent input.** Malicious instructions in a web page, message, or document could influence a pipe that has write access. For tasks that only read, start at `reader`, then use `allow` to narrow it to the endpoints actually needed, such as `GET /search`, and review write actions separately. The docs also advise trusting only scheduled tasks from the official library, or auditing custom ones before installing. For authorization design, see the [tool authorization](/posts/ai/2026-10-22-ai-security-tool-authorization) and [MCP trust](/posts/ai/2026-10-22-ai-security-mcp-trust) posts in the AI security series (in Chinese).

**The main branch moves fast.** The README says outright that main is "moving fast and breaking things"; use releases for stability, and some features of the production app are in paid plans.

**Enterprise deployments take a different data path.** Organization-managed shared storage, sync, and exports can make captured content visible to authorized administrators. Settle storage location, access scope, and retention first, and tell employees.

## How to use it

1. **Decide where data may go.** Turn off analytics under Settings → Privacy and pick local transcription and a local model. If you need a cloud feature, enable one and confirm what it sends.
2. **Narrow capture first.** Under Settings → Recording, add password managers, banking, and private messaging to the ignored windows before you start recording. The docs advise testing the rule with harmless content, and checking already-recorded content and other data sources separately.
3. **Check value through MCP.** Connect Claude Code and ask "what did I do yesterday in X" for three days. If the answers do not help you, you do not need Pipes.
4. **Start Pipes at `reader`.** Run once by hand, check what it accessed with `pipe logs <name>`, then enable the schedule; raise permissions separately when a task must write files or call external services.
5. **Measure your own day.** Note CPU, RAM, and the size of `~/.screenpipe`, and use them to decide retention.
6. **At work, read the license first.** Beyond personal non-commercial use, contact the vendor before installing.

## References

- [screenpipe/screenpipe (README)](https://github.com/screenpipe/screenpipe)
- [LICENSE.md: Screenpipe Commercial License](https://github.com/screenpipe/screenpipe/blob/main/LICENSE.md)
- [Screenpipe architecture (official docs)](https://docs.screenpi.pe/architecture)
- [Build and manage scheduled tasks (official docs)](https://docs.screenpi.pe/pipes)
- [Scheduled task permissions (official docs)](https://docs.screenpipe.com/task-permissions.md)
- [Privacy data flow (official docs)](https://docs.screenpipe.com/privacy-data-flow.md)
- [An update to screenpipe's license (official blog, 2026-06-09)](https://screenpipe.com/blog/screenpipe-license-update)
- [Agent Memory Engineering series intro](/posts/ai/2026-09-19-agent-memory-engineering-series-intro) (in Chinese)
- [AI security: tool authorization](/posts/ai/2026-10-22-ai-security-tool-authorization) (in Chinese)
- [AI security: MCP trust](/posts/ai/2026-10-22-ai-security-mcp-trust) (in Chinese)
