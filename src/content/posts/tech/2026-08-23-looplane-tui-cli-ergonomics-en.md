---
title: "Looplane's TUI and CLI: how a run becomes visible in the terminal"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, cli, tui, ux, terminal]
lang: en
tldr: "Looplane's TUI and plain CLI are two interfaces over the same runtime paths. The CLI selects a presentation mode from TTY state and flags, runners emit events, and the TUI projects those events into thinking, tool, approval, verification, and terminal states. The screen distinguishes native and external runtimes without treating UI entry points as proof of backend maturity."
description: "A user-facing trace of Looplane's TUI and CLI: mode routing, runtime lanes, event projection, inline approvals, slash commands, and geometry tests."
series:
  name: "Looplane Architecture Notes"
  order: 1
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-tui-cli-ergonomics)

The first thing a Looplane user meets is the terminal interface. This is where you enter a task, choose a runtime, watch model and tool activity, approve actions when necessary, and receive a successful or failed result. This article stays at that visible interaction boundary. Prompts, workspaces, tool policy, journals, and provider protocols belong to later articles.

## An interaction starts with mode routing

`_terminal_supports_tui()` in `src/looplane/cli.py` checks stdin, stdout, `TERM`, and the environment variables that disable the TUI. Bare `looplane` launches the Textual application in a suitable terminal. `--plain`, `--print`, or piped input takes a text route. This split changes presentation; it does not create a second agent loop.

The user-visible path is roughly:

```text
prompt / slash command
        │
        ├─ CLI mode routing ──► plain console projection
        │
        └─ LooplaneApp ──► runtime selector
                           ├─ native Looplane lane
                           └─ external CLI lane
                                  │
                                  ▼
                         run events / runtime events
                                  │
                                  ▼
                    transcript + status + approval block
```

`LooplaneApp` does not infer what a runtime is doing from a spinner. The native runner emits `RunEvent` values, external runners emit `ExternalAgentEvent` values, and conversation runtimes have their own events. The TUI projects them into the transcript and status line. The plain CLI uses `LiveEventProjection` to turn related events into text. Seeing “tool started” therefore means the runtime emitted that state.

## The screen must distinguish native and external lanes

The interactive surface can select Looplane's native agent or hand the task to an external CLI such as Codex or Claude Code. The transcript may look consistent, but ownership differs:

- In the native lane, Looplane's runner produces model turns, tool calls, verification, and terminal reasons.
- In the external lane, the external runtime owns its conversation and tool lifecycle; Looplane receives events and reviews the returned workspace afterward.

The TUI should make the current runtime, model, usage, context, and run status visible. A shared visual surface must not collapse the two lanes into one loop. For product-level comparisons among Codex, Claude Code, and Pi, start with the [Codex CLI article in the Choosing an Agent CLI series](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en). The later ExternalCodingRunner article follows only Looplane's handoff contract.

## Approval is an interaction inside the transcript

When a runtime emits an `ApprovalRequest`, `InlineApprovalBlock` places the effect, reason, and preview in the transcript and shows only decisions supported by that request. Common outcomes include allow once, allow for the current session, deny, and cancel. After selection, the block is locked so the same request cannot be answered twice.

This is an important failure boundary. If no interactive terminal exists, an approval block is stale, or the request does not support a scope, the interface cannot silently elevate authority. Denial remains a runtime-visible outcome, while cancellation stops the current action; neither can be rewritten as success by the UI.

`test_tui_approval_is_attached_inline_and_maps_once_decision` in `tests/test_tui.py` verifies the inline block and the one-time decision. `test_plain_flag_never_launches_full_screen_tui` in `tests/test_cli.py` guards the other side: an explicit plain-mode request never launches the full-screen UI.

## Slash commands control interaction, not a feature inventory

The command palette, completion, help, and parser share slash-command metadata. Entries such as `/provider`, `/runtime`, `/usage`, `/context`, `/permissions`, `/compact`, `/remember`, and `/rewind` let users inspect or change the current session. Unknown commands are rejected locally instead of being forwarded as ordinary model prompts.

An entry point proves only that the interaction exists. `/permissions` changes the visible approval mode; authority precedence belongs to the permissions article. `/compact` presents compaction state; summarization and reinjection belong to the context article. `/remember` does not prove semantic long-term retrieval. The TUI is a projection of lower-level state, not a maturity checklist for every integration.

## Geometry tests prove layout, not daily-driver reliability

Alongside focused tests, the README requires TUI changes to render wide, narrow, and loading states with `scripts/render_tui_screenshot.py`. Those artifacts can expose a 60-column terminal wrapping an approval preview or pushing status out of view.

This is layout evidence: `tests/test_tui.py` can assert widgets under fixed geometry, and a reviewer can inspect rendered output. It does not prove live providers, OAuth, long-conversation rendering, every external runtime, or cross-session resume. Each of those paths still needs focused tests or real-runtime evidence.

## Where the series goes next

The UI lets a user identify run stages and distinguish native from external execution, but it has not yet explained the guarantees beneath the screen. The next article follows the disposable workspace and run bundle: where the task actually executes and which artifacts remain. Prompts, native loop behavior, providers, external runtimes, tools, and state follow after that.

---

## References

- [Looplane official repository](https://github.com/vincentxuu/looplane) — ground truth for the source and test paths in this article
- [Looplane README TUI workflow](https://github.com/vincentxuu/looplane#set-up-with-uv) — geometry-test and screenshot-review workflow
- [Textual](https://textual.textualize.io/) — the terminal UI framework used by Looplane
- [Typer](https://typer.tiangolo.com/) — the CLI command-routing framework
