---
title: "OpenClaw Enterprise Channels: Slack's Three Transports, and the 'Built-in' Column That No Longer Exists"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, slack, microsoft-teams, matrix, google-chat, feishu, enterprise]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 15
tldr: "Every enterprise channel is a plugin now, including Slack and Google Chat, which used to be built in. Slack has three transports — Socket Mode, HTTP Request URLs, and relay — and the docs say plainly that the first two have reached feature parity, so you pick by deployment shape, not by features."
description: "OpenClaw enterprise messaging channels: Slack's three transport modes and the selection matrix, Enterprise Grid org-wide installs, the trap of sharing one Slack app across gateways, and the plugin status of Teams, Matrix, Google Chat, and Feishu."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-enterprise)

There is a structural change to state first: **the "install: built-in" column no longer exists.** Slack, Google Chat, Microsoft Teams, Matrix, Feishu, Mattermost, and Nextcloud Talk are **all official plugins** now — one command, or installed on demand during onboarding, with a Gateway restart afterward.

```bash
openclaw plugins install @openclaw/<channel>
```

The only chat surface genuinely built into core is WebChat.

## Slack: three transports

Slack has the thickest documentation here because it offers three paths. The docs give a blunt criterion:

> Socket Mode and HTTP Request URLs **reach feature parity** for messaging, slash commands, App Home, and interactivity. **Pick by deployment shape, not features.**

| Concern | Socket Mode (default) | HTTP Request URLs |
|---|---|---|
| Public Gateway URL | Not required | **Required** (DNS, TLS, reverse proxy or tunnel) |
| Outbound network | Must reach `wss-primary.slack.com` | No outbound WS; inbound HTTPS only |
| Tokens | Bot token + App-Level Token with `connections:write` | Bot token + Signing Secret |
| Dev laptop / behind firewall | Works as-is | Needs a public tunnel (ngrok, Cloudflare Tunnel, Tailscale Funnel) |
| Horizontal scaling | One session per app per host; multiple Gateways need **separate Slack apps** | Stateless POST handler; replicas can share one app |
| Multi-account on one Gateway | Supported; each account opens its own WS | Supported, but each account needs a **unique `webhookPath`** (default `/slack/events`) to avoid collisions |
| Slash commands | Delivered over the WS; `slash_commands[].url` is ignored | Slack POSTs to `slash_commands[].url`, and **the field is required** or the command never dispatches |
| Request signing | Not used (auth is the App-Level Token) | Slack signs every request; verified with `signingSecret` |

The short version: **single Gateway, dev laptop, or an on-prem network that can reach out but cannot accept inbound HTTPS → Socket Mode**. **Multiple replicas behind a load balancer, outbound WSS blocked but inbound HTTPS allowed, or you already terminate Slack webhooks at a reverse proxy → HTTP.**

### The trap of sharing one Slack app across gateways

This one deserves its own heading because it produces genuinely hard-to-diagnose intermittency: **Slack can maintain multiple Socket Mode connections for one app and may deliver any given payload to any connection.**

So two separate OpenClaw gateways sharing one Slack app need **equivalent routing and authorization configuration**. Otherwise the same message is handled when it lands on gateway A and dropped when it lands on gateway B, which reads as random failure. Avoid it by choosing one of: a separate Slack app per gateway, a single relay ingress, or HTTP mode behind a load balancer.

### Relay mode

The third mode is for managed deployments: **separate Slack ingress from the Gateway**. A trusted router owns the single Socket Mode connection, picks a destination gateway, and forwards a typed event over an authenticated websocket. The gateway still uses its own bot token for outbound Slack Web API calls.

```json5
{
  channels: {
    slack: {
      mode: "relay",
      botToken: { source: "env", provider: "default", id: "SLACK_BOT_TOKEN" },
      relay: {
        url: "wss://router.example.com/gateway/ws",
        authToken: { source: "env", provider: "default", id: "SLACK_RELAY_AUTH_TOKEN" },
        gatewayId: "team-gateway",
      },
    },
  },
}
```

Understand the security implication: **treat the bearer token and the router's route table as part of the Slack authorization boundary** — routed events enter the normal Slack message handler as authorized activations. The relay URL must use `wss://` unless it targets localhost.

### Enterprise Grid org-wide installs

One Slack account can receive messages and interactions from **every workspace** covered by an Enterprise Grid org-wide installation. This path supports Socket Mode or HTTP only — **relay mode is not supported for enterprise accounts**.

The process needs humans: an Enterprise Grid Org Admin or Org Owner must approve the app, install it at the organization level, and choose which workspaces it covers — and **you should confirm the app actually appears in every intended workspace before starting OpenClaw**.

The docs publish least-privilege manifests for both Socket and HTTP, covering the message, mention, reaction, pin, channel-created, and channel-renamed event paths plus interactivity and a single `/openclaw` slash command. Copy theirs rather than assembling scopes yourself.

### One routing behavior that is easy to miss

**Slack multi-person DMs (MPIMs) route as group chats** — so group policy, mention behavior, and group-session rules all apply to them. If you set `groupPolicy: "allowlist"` and then find that group DMs get no response, this is why.

## The other enterprise channels

What they share is that **they have all become plugins**; setup details live on their own pages:

| Channel | Class | Docs focus |
|---|---|---|
| Microsoft Teams | official plugin | Support status, capabilities, configuration |
| Google Chat | official plugin | App support status and capabilities |
| Matrix | official plugin | Support status and configuration examples |
| Feishu | official plugin | Bot overview, features, configuration |
| Mattermost | official plugin | Bot setup (open-source Slack alternative) |
| Nextcloud Talk | official plugin | Support status and configuration |

Group behavior is **shared across these channels** — the docs explicitly list Discord, iMessage, Matrix, Teams, QQBot, Signal, Slack, Telegram, WhatsApp, and Zalo as applying the same group rules, so `groupPolicy`, mention gating, and `contextVisibility` knowledge transfers rather than needing to be relearned per channel.

Feishu, Matrix, Teams, and Slack are all on the list of channels that **fetch supplemental context**, which makes `contextVisibility` a meaningful setting for them: the `"all"` default injects quotes, thread history, and forwarded metadata into the model **regardless of whether the source is allowlisted**. In enterprise environments that usually deserves tightening.

## The big picture

Choosing an enterprise channel is not really a feature comparison. It answers two deployment questions: **can your Gateway accept inbound HTTPS** (Socket vs. HTTP for Slack), and **should ingress be separated from the Gateway** (whether you want relay).

On the security side, the setting most worth making deliberately is `contextVisibility` — in a corporate space, the gap between "who can trigger the agent" and "whose text reaches the model's context" is much wider than it is in a private group.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Corrected the install column across the comparison**: Slack and Google Chat are no longer built in, every enterprise channel is now an official plugin, and WebChat is the only chat surface left in core. The Slack section was expanded to the current three transports (Socket / HTTP / relay) with the official selection matrix, and gained: the trap where one Slack app across gateways delivers payloads to any connection, the authorization boundary implied by relay mode, Enterprise Grid org-wide installs (no relay support, Org Admin approval required), and the routing of Slack multi-person DMs as group chats. Unverified per-channel capability rows (thread, E2EE, streaming) were removed in favor of the official pages, and the relevance of `contextVisibility` to these channels was added.

## References

This article draws on the following official OpenClaw documentation:

- [Slack](https://docs.openclaw.ai/channels/slack) — the three transports, Enterprise Grid manifests, relay config
- [Chat channels](https://docs.openclaw.ai/channels/) — plugin classes and delivery notes
- [Groups](https://docs.openclaw.ai/channels/groups) — shared group rules and `contextVisibility`
- [Microsoft Teams](https://docs.openclaw.ai/channels/msteams), [Google Chat](https://docs.openclaw.ai/channels/googlechat), [Matrix](https://docs.openclaw.ai/channels/matrix), [Feishu](https://docs.openclaw.ai/channels/feishu) — per-channel setup
