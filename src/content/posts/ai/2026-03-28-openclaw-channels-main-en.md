---
title: "OpenClaw's Main Channels: Where WhatsApp, Telegram, and Discord Each Get Stuck"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, whatsapp, telegram, discord, channels, pairing]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 14
tldr: "Each channel has one gotcha that stops you cold: WhatsApp's login is QR-only and hard to do remotely, Telegram bots ship with Privacy Mode on so they never see group messages (and you must remove and re-add the bot after changing it), and Discord needs Message Content Intent or it receives nothing from servers."
description: "The real setup traps in OpenClaw's three main chat channels: WhatsApp's on-demand plugin and QR login, Telegram's Privacy Mode and token resolution order, and Discord's Gateway Intents and pairing prerequisites."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-main)

These three are the most-used channels. The setup steps are all in the official docs, so this article picks out **the one thing per channel that stops you cold** — and what they have in common is that getting them wrong produces no error, just silence.

## WhatsApp

**Installation is on demand.** The WhatsApp runtime ships outside the core npm package. `openclaw onboard`, `channels add --channel whatsapp`, and `channels login --channel whatsapp` all offer to install it the first time you pick it. Manually:

```bash
openclaw plugins install clawhub:@openclaw/whatsapp
```

Stable and beta installs pull `@openclaw/whatsapp` from ClawHub first, falling back to npm. The bare npm package name is only for that registry fallback.

**The trap: login is QR-only, and QR codes expire.** On remote or headless hosts this needs planning — the docs say it outright: **before starting login, have a reliable path to deliver the live QR to the phone**, because terminal-rendered QRs, screenshots, and chat attachments can all expire in transit.

```bash
openclaw channels login --channel whatsapp
openclaw channels login --channel whatsapp --account work
```

Keep two things distinct: **the QR that links the account** and **approving whether someone may talk to your agent**. The latter is a DM access request — 1-hour expiry, capped at 3 pending per account.

**Runtime details worth knowing:**

- The Gateway owns the WhatsApp socket and reconnect loop. A watchdog tracks two signals independently — **raw transport activity** and **application-message activity**. A quiet-but-connected session is not restarted merely because no message arrived; it forces a reconnect only when transport frames stop for a fixed internal window, or application messages stay silent past 4× the normal message timeout
- Outbound sends require an active listener for the target account and **fail fast** otherwise
- Status and broadcast chats (`@status`, `@broadcast`) are ignored
- Group sends attach native mention metadata for `@+number` tokens when they match current participant metadata
- The transport honors standard proxy environment variables on the Gateway host (`HTTPS_PROXY` and friends) — **prefer host-level proxy config over per-channel settings**

A separate number is recommended (setup and metadata are optimized for it), but personal-number and self-chat setups are fully supported — onboarding has a dedicated personal-number mode that writes a self-chat-friendly baseline including `selfChatMode: true`.

**Experimental**: `whatsapp_call` can place a voice call to the current requester and play a TTS message. It is disabled by default and, by design, **has no destination-number parameter** — so a prompt cannot redirect the call somewhere else. That limitation is deliberate.

## Telegram

**Telegram is the only chat channel you do not install** (bundled plugin), and it does not use `openclaw channels login` — set the token and start the Gateway.

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123:abc",
      dmPolicy: "pairing",
      groups: { "*": { requireMention: true } },
    },
  },
}
```

**The trap: Telegram bots default to Privacy Mode**, which limits which group messages they receive. Your agent looks unresponsive in groups when it is simply never being handed the messages.

Two fixes: disable it with `/setprivacy` via BotFather, or make the bot a group admin. **The part people miss comes next: after toggling, remove and re-add the bot in each group so Telegram applies the change.** Skip that and the fix does nothing.

**Other things that bite:**

- **Token resolution is account-aware**: `tokenFile` beats `botToken` beats env, and `TELEGRAM_BOT_TOKEN` **only resolves for the default account** — named accounts must use `botToken` or `tokenFile`
- After a successful startup the bot identity is cached for up to 24 hours (skipping a `getMe`); changing or removing the token clears it
- **Negative supergroup IDs starting with `-100` are group chat IDs**. They belong under `channels.telegram.groups`, **not** `groupAllowFrom`
- `allowFrom` takes numeric Telegram user IDs (`telegram:` / `tg:` prefixes are normalized)
- Forum topics each get their own session (the session key gains a `:topic:<id>` segment)

**The Dashboard Mini App** came later: `/dashboard` in a DM opens the full Control UI as a Telegram WebApp. Two prerequisites — `gateway.tailscale.mode` must be `serve` or `funnel` (a published HTTPS URL is required), and your numeric user ID must be in that account's effective `allowFrom` or in `commands.ownerAllowFrom`. **Wildcards and usernames do not grant access.** It verifies Telegram's signed `initData` and rejects missing, invalid, expired, or replayed data.

## Discord

**The trap: Privileged Gateway Intents.** On the Bot page in the Developer Portal:

- **Message Content Intent** — **required for normal guild messages**; without it you receive nothing
- **Server Members Intent** — recommended; required for role allowlists, name-to-ID matching, and channel-audience access groups
- **Presence Intent** — optional

Without Message Content Intent, OpenClaw still works in DMs — so the symptom is "DMs answer, servers do not," which is easy to misdiagnose as a permissions or allowlist problem.

**The second trap comes before pairing**: Discord must let the bot DM you. Right-click the server icon → **Privacy Settings** → enable **Direct Messages**.

**The third is a naming problem**: the **Reset Token** button generates your first token. Despite the name, nothing is being reset.

The OAuth2 baseline is View Channels, Send Messages, Read Message History, Embed Links, and Attach Files; posting in threads (including forum and media channel workflows) also needs **Send Messages in Threads**.

**If your host is blocked or rate-limited** by Discord's startup application lookup, set `channels.discord.applicationId` so startup can skip that REST call. For multiple bots, keep each token and application ID under its account — a top-level `applicationId` is inherited, so only set it there when every account shares one.

## How the three actually differ

| | WhatsApp | Telegram | Discord |
|---|---|---|---|
| Install | official plugin (on demand) | bundled, nothing to install | official plugin |
| Login | QR, interactive only | paste a token | paste a token |
| Most common blocker | getting the QR to the phone | Privacy Mode (and the re-add step) | Message Content Intent |
| Transport | WhatsApp Web (Baileys) | long polling (default) / webhook | Discord gateway |
| Pairing code lifetime | 1 hour | 1 hour | 1 hour |

## The big picture

These three traps share a shape: **the failure is silent**. An expired QR, Privacy Mode left on, an unset Intent — all present as "it just doesn't answer," never as an error message. So verify actively after setup: mention it in a group and watch `openclaw logs --follow` for the inbound message. That beats re-reading your config.

Enterprise channels are next.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Corrected the install model**: WhatsApp and Discord are both official plugins now (WhatsApp is install-on-demand with its runtime outside the core package), and only Telegram is bundled. Refocused the article: the unverified capacity tables (message chunk sizes, media limits, group history counts) were removed in favor of each channel's real silent-failure mode. Added: WhatsApp's remote-QR warning, the dual-signal watchdog, ignored status/broadcast chats, proxy environment variables, and the experimental `whatsapp_call` with its deliberate lack of a destination parameter; Telegram's Privacy Mode and the remove-and-re-add step, token resolution order and the default-account-only env var, where `-100` group IDs belong, and the Dashboard Mini App's Tailscale prerequisites; Discord's three privileged intents, the DM prerequisite for pairing, the misleading Reset Token label, and `applicationId` as a rate-limit workaround.

## References

This article draws on the following official OpenClaw documentation:

- [WhatsApp](https://docs.openclaw.ai/channels/whatsapp) — plugin install, QR login, runtime model, and `whatsapp_call`
- [Telegram](https://docs.openclaw.ai/channels/telegram) — token resolution, Privacy Mode, Dashboard Mini App
- [Discord](https://docs.openclaw.ai/channels/discord) — gateway intents, OAuth2 permissions, multi-account config
- [Chat channels](https://docs.openclaw.ai/channels/) — plugin classes
- [Groups](https://docs.openclaw.ai/channels/groups) — group policy and session keys
