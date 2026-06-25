---
title: "Claude Code Remote Control: Continue Your Local Dev Session from Any Device"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, remote-control, mobile, cross-device, dx]
lang: en
tldr: "Remote Control lets you pick up a locally running Claude Code session from your phone, tablet, or any browser. Code executes on your own machine — MCP servers and local tools are all available. Supports QR code quick-connect and multi-device conversation sync."
description: "A guide to Claude Code's Remote Control feature: connection methods (server mode / interactive / existing session), security model, differences from Claude Code on the web, and a comparison of remote workflows including Dispatch, Channels, and Slack."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 22
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide)

<!-- TODO: Pending write-up -->
<!-- Reference official docs: https://code.claude.com/docs/en/remote-control.md -->

## Planned Outline

### What Is Remote Control?
- Continue a local session from your phone, tablet, or another computer
- Claude runs on your machine (not in the cloud)
- Local MCP servers, tools, and project configs are all available
- Multi-device sync: switch freely between terminal, browser, and mobile

### Three Ways to Start

#### Server Mode
```bash
claude remote-control
```
- Dedicated server mode that waits for remote connections
- Supports `--name`, `--spawn` (same-dir / worktree), and `--capacity` flags

#### Interactive Session
```bash
claude --remote-control
```
- Normal interactive session with remote control enabled
- Both local and remote can type simultaneously

#### From an Existing Session
```
/remote-control
```
- Pick up with the full conversation history intact

### Connection Methods
- Open a session URL directly
- Scan a QR code (on mobile)
- Find the session via claude.ai/code or the Claude app

### Security Model
- Outbound HTTPS only — no inbound ports opened
- All traffic flows through the Anthropic API over TLS
- Multiple short-lived credentials, each expiring independently

### Remote Control vs. Claude Code on the Web
| | Remote Control | Claude Code on the Web |
|---|---|---|
| Runs on | Your machine | Anthropic cloud |
| Local files | ✅ | ❌ (fresh clone each time) |
| MCP servers | ✅ | ❌ |
| Best for | Continuing in-progress local work | Standalone tasks that need no local environment |

### Five Remote Workflow Options Compared
| Method | Triggered via | Claude runs on | Best for |
|--------|--------------|----------------|----------|
| Dispatch | Claude mobile app | Desktop | Handing off tasks when you step away |
| Remote Control | claude.ai/code or mobile | Your local CLI | Controlling in-progress work remotely |
| Channels | Telegram / Discord / iMessage | Your local CLI | Reacting to external events |
| Slack | @Claude | Anthropic cloud | Starting tasks from a team conversation |
| Scheduled Tasks | Cron | Cloud or local | Recurring automation |

## References

- [Claude Code Remote Control — Official Docs](https://docs.anthropic.com/en/docs/claude-code/remote-control) — Complete setup guide for Remote Control, including connection methods, security, and troubleshooting
- [Claude Code on the Web — Official Docs](https://docs.anthropic.com/en/docs/claude-code/claude-code-on-the-web) — Overview of the cloud-hosted Claude Code, useful for comparing use cases with Remote Control
- [Claude Code CLI Reference — remote-control command](https://docs.anthropic.com/en/docs/claude-code/cli-reference) — All flags for `claude remote-control`, including `--name`, `--spawn`, and `--capacity`
- [Claude Code in Slack — Official Docs](https://docs.anthropic.com/en/docs/claude-code/slack) — Another way to trigger remote tasks from Slack
- [Claude Code Channels — Official Docs](https://docs.anthropic.com/en/docs/claude-code/channels) — Trigger local Claude Code sessions via Telegram, Discord, and other external messaging platforms
- [Claude iOS/Android App](https://claude.ai/download) — The Claude mobile app needed to control Remote Control sessions from your phone
- [Claude Code Scheduled Tasks](https://docs.anthropic.com/en/docs/claude-code/scheduled-tasks) — Set up recurring automated tasks, complementing remote workflows
