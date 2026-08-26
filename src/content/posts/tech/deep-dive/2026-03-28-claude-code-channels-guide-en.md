---
title: "Claude Code Channels: External Events, Reply Tools, and Sender Gating"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, channels, mcp, webhooks]
lang: en
tldr: "Channels are a special kind of MCP server that push CI failures, monitoring alerts, and Telegram messages directly into a running Claude Code session — and Claude can answer back through the same channel via a reply tool. This post breaks down the channel contract, two-way replies, security gates, and install requirements."
description: "A deep dive into Claude Code Channels: how an MCP server declares a channel capability, pushes notification events, lets Claude reply, and how sender gating and permission relay keep the session secure."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 21
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide)

This is part of the automation cluster of the [Claude Code Deep Dives series](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works). Earlier posts covered hooks — scripts injected at specific points in the agentic loop. But those points are all events the loop generates itself. If you're away from the terminal and something happens outside the loop — a build fails, a monitor fires an alert, you think of a new instruction on your phone — Claude has no way to know. Channels fill exactly that gap.

## What Problem Do Channels Solve?

From the official docs:

> A channel is an MCP server that pushes events into your running Claude Code session, so Claude can react to things that happen while you're not at the terminal.

The keyword is "push". A standard MCP server is passive: Claude queries it during a task. A channel works the other way around — the moment an external system produces an event, the message is pushed into the session you **already have open**, and Claude reads it and acts on its next turn. Events arrive in Claude's context wrapped in a `<channel>` tag:

```text
<channel source="webhook" path="/" method="POST">build failed on main</channel>
```

Note the catch: events only arrive while the session is open. For an always-on setup, run Claude Code in a background process or a persistent terminal.

## How Channels Differ from Hooks and MCP

All three extend a session, but they point in different directions:

| Feature | Event source | Direction |
|---------|--------------|-----------|
| [Hooks](/posts/tech/deep-dive/2026-03-27-claude-code-hooks-guide) | Built-in agentic loop events | The loop triggers your script |
| [MCP server](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration) | Claude actively queries | Claude pulls |
| **Channels** | External systems | The outside pushes in |

In one sentence: hooks handle events the loop itself generates; channels handle events from the world outside the loop — and outside you — that come looking for the agent. They also differ from Claude Code on the web or Claude in Slack: those spawn a fresh cloud session, while channels deliver events into your local session that already has your files loaded and conversation history in context.

## The Channel Contract: Capability Declaration and Notification Events

A channel is a regular MCP server plus three things:

1. Declare `claude/channel` in the Server constructor's capabilities — this key is what makes Claude Code register a notification listener.
2. Emit events with the `notifications/claude/channel` method; `content` is the body, and each key in `meta` becomes an attribute on the `<channel>` tag.
3. Connect over stdio transport — Claude Code spawns it as a subprocess.

A minimal channel server looks like this:

```ts
const mcp = new Server(
  { name: 'webhook', version: '0.0.1' },
  {
    capabilities: { experimental: { 'claude/channel': {} } },
    instructions: 'Events arrive as <channel source="webhook" ...>. One-way: read them and act.',
  },
)
await mcp.connect(new StdioServerTransport())

Bun.serve({
  port: 8788,
  hostname: '127.0.0.1',
  async fetch(req) {
    await mcp.notification({
      method: 'notifications/claude/channel',
      params: { content: await req.text(), meta: { path: new URL(req.url).pathname } },
    })
    return new Response('ok')
  },
})
```

The `instructions` string goes into Claude's system prompt, telling it what events look like, whether to reply, and how. The docs also flag an easy pitfall: being listed in `.mcp.json` isn't enough — the server must also be named in the `--channels` flag for messages to get through.

## Letting Claude Reply: Reply Tools

Push-only is a one-way channel (an alert forwarder). To build a chat bridge, add a standard MCP tool: put `tools: {}` in capabilities and register a `reply` tool with `setRequestHandler`. When Claude wants to respond, it calls the tool and the server POSTs the text back to your chat platform. Nothing about the tool registration is channel-specific — it's just a regular MCP tool.

One usage detail: when Claude replies through a channel, your terminal shows only the tool call and a "sent" confirmation — the actual reply appears on the other platform.

## Security: Sender Gating and Permission Relay

An ungated channel is a prompt injection vector — anyone who can reach your endpoint can put text in front of Claude. So the contract requires the server to check a **sender allowlist** before emitting any notification, and to gate on the sender's identity, not the room's: gating on the chat room in a group would let anyone in that group inject messages.

Telegram and Discord bootstrap the allowlist with pairing codes: DM the bot, it replies with a code, you approve it in the session, and your account joins the list — everyone else is silently dropped. iMessage works differently: texting yourself bypasses the gate automatically, and other contacts are added one by one by handle.

The second layer is **permission relay**: when Claude calls a tool that needs approval, the session pauses at the local dialog. A two-way channel declaring the `claude/channel/permission` capability can forward that same prompt to your phone; replying `yes <id>` approves it remotely. Both ends stay live, and whichever answer arrives first wins. Because anyone who can reply through the channel can approve tool use, the docs state plainly: only declare the capability if your channel authenticates senders.

Enterprises get a master switch on top: Team/Enterprise orgs block channels by default until an Owner enables `channelsEnabled`, and can restrict which channel plugins may run with `allowedChannelPlugins`. Pro/Max users without an organization skip these checks entirely and opt in per session with `--channels`.

## Installation: Channel Plugins Require Bun

The research preview ships official channel plugins for Telegram, Discord, and iMessage, plus a fakechat demo that runs in a local browser. Each plugin is a Bun script, so install [Bun](https://bun.sh) first. Using Telegram as an example:

```
/plugin install telegram@claude-plugins-official
/telegram:configure <token>
```

Exit, restart with `claude --channels plugin:telegram@claude-plugins-official`, complete pairing, done.

For your own channels, the runtime isn't restricted — the hard requirement is just the MCP SDK and a Node-compatible environment; Bun, Node, and Deno all work. Custom channels test through the `--dangerously-load-development-channels` development flag, which bypasses the allowlist locally.

## Typical Scenarios

- **CI result forwarding**: a build fails and a webhook pushes straight into the session where Claude already has your repo open — it can dig into logs, fix code, and rerun tests immediately.
- **Phone chat bridge**: ask Claude questions from Telegram while it works on your machine against your real files, with answers coming back to the same chat window.
- **Monitoring events**: error tracker or deploy pipeline events pushed as a one-way channel — Claude reads them and acts, no reply needed.

Channels are currently in research preview, and both the flag syntax and protocol contract may change. But the position they occupy — letting the outside world reach a running agent — is a slot that neither scheduled polling nor Remote Control fills.

## References

- [Push events into a running session with channels — Claude Code Docs](https://code.claude.com/docs/en/channels.md) — Channels positioning, Telegram/Discord/iMessage setup flows, security and Enterprise controls, comparison with other integrations
- [Channels reference — Claude Code Docs](https://code.claude.com/docs/en/channels-reference.md) — Full channel contract spec: capability declaration, notification format, reply tools, sender gating, permission relay, with a complete webhook receiver example

## Changelog

- 2026-08-26: Initial version, based on current code.claude.com documentation (research preview).
