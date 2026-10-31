---
title: "Tool of the Day｜mcp4mail — lets an AI assistant read your inbox safely, and was almost entirely built by AI agents itself"
date: 2026-11-01
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A self-hostable IMAP mailbox MCP server: OAuth 2.1, read-only by default, and sending mail needs a human click — built by autonomous AI agents under CI gatekeeping almost the whole way"
tldr: "mcp4mail is an MIT-licensed, self-hostable MCP server that lets an AI assistant read and search your IMAP mailbox over OAuth 2.1. Install: `docker compose up -d` (or just use the hosted instance at https://mcp4mail.online/mcp). It solves two problems: handing your IMAP password to some third party just so an agent can read mail, and rewriting the same mailbox-access glue code for every project. Every write action — sending, deleting, moving mail — is off by default; the mailbox owner has to switch each one on individually, and sending still requires a human to press Send before anything actually goes out."
series:
  name: "AI Tool of the Day"
  order: 70
---

> 🌏 [中文版](/posts/daily/2026-11-01-tool-mcp4mail)

## Tool info

| Item | Value |
|---|---|
| Name | mcp4mail |
| Type | MCP server (remote, OAuth 2.1; self-hostable or hosted) |
| GitHub | [jchsoft/mcp4mail](https://github.com/jchsoft/mcp4mail) |
| Stars | 0 (created 2026-09-17, an early-stage project run by a two-person team, with the hosted instance at mcp4mail.online already live) |
| Language | Ruby (Rails 8.1) |
| License | MIT |
| Install | `git clone https://github.com/jchsoft/mcp4mail.git && cd mcp4mail && docker compose up -d` |

## What problem it solves

You want an AI assistant to dig through your inbox — find an invoice, check what someone last replied, summarize a thread — but most approaches stall right there. Either you hand your IMAP password to some SaaS connector (so your password now lives on someone else's server), or you write your own Gmail API glue code, which only works for Gmail and has to be redone for every other provider. And once an agent can reach a mailbox at all, it usually gets full read-write access in one shot — if it misreads the task or hallucinates a command, deleting, moving, or even sending mail becomes a real possibility.

mcp4mail redesigns that whole flow. It speaks plain IMAP with an app password, so Gmail, iCloud, Fastmail, Outlook.com, Yahoo, or your own self-hosted Dovecot/Cyrus server all work the same way — no provider-specific OAuth required. An AI client connects over OAuth 2.1 and gets 14 MCP tools: list accounts, list folders, search by subject/sender/attachment name/date, read a message, download an attachment, look up contacts. Every mailbox is read-only by default — any tool that would change it (flag, move, create a folder, save a draft, send, trash) is refused unless the mailbox owner opens the settings page, flips "Allow the AI to make changes," and ticks exactly which actions are allowed. Even with send permission on, `send_message` never fires off an email on its own: it stores the message as pending, emails the owner a preview with a single-use, 24-hour link, and only sends once that link is clicked. Self-hosted, the IMAP password is encrypted with AES-256-GCM and stored in your own PostgreSQL, with the decryption keys in your hands — the password never leaves your machine.

Who it's for: anyone building a personal productivity agent that needs to search and read mail but doesn't want to hand over full write access; teams that want a default-deny mail tool rather than writing bespoke access logic for every agent project; and anyone on a non-Gmail, non-Outlook provider — self-hosted mail, Fastmail, iCloud, Zoho — since it talks generic IMAP instead of being locked to one vendor's API.

```diagram
title: What a send request has to clear
desc: An agent asking to send mail first has to pass a check for whether the mailbox allows AI changes; even after that, nothing goes out immediately — the message is stored as pending, a preview email with a link goes to the mailbox owner, and only a click on Send actually sends it.
caption: Simplified from mcp4mail's README and self-hosting.md, specifically for send_message. Other write actions (flag, move, create folder, trash) still need the first "Allow AI changes" switch, but don't need a human approval click to execute.
step: Agent calls send_message, asking to send a message
step: Check whether this mailbox has "Allow AI changes" on, with send permission ticked
step: If not, refuse outright and log a denied entry in the audit log
step: If it passes, store the message as pending — not sent yet
step: Email a preview to the mailbox owner, with a 24-hour single-use link
step: Owner clicks Send — only then does the message actually go out
---
<svg viewBox="0 0 640 512">
  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="140" y="60" width="280" height="48" rx="6"/>
    <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">Agent calls send_message</text>
  </g>

  <path class="dg-line" d="M280 108V140" marker-end="url(#arrow)" data-step="2"/>

  <g data-step="2">
    <path class="dg-box" d="M280 140L404 184L280 228L156 184Z"/>
    <text class="dg-label" x="280" y="174" text-anchor="middle" dominant-baseline="central">Send allowed?</text>
    <text class="dg-sub" x="280" y="196" text-anchor="middle" dominant-baseline="central">off by default</text>
  </g>

  <path class="dg-line" d="M404 184H444" marker-end="url(#arrow)" data-step="3"/>
  <text class="dg-edge dg-text--warn" x="424" y="172" text-anchor="middle" dominant-baseline="central" data-step="3">no</text>

  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="444" y="152" width="176" height="64" rx="6"/>
    <text class="dg-label" x="532" y="174" text-anchor="middle" dominant-baseline="central">Refused</text>
    <text class="dg-sub" x="532" y="196" text-anchor="middle" dominant-baseline="central">logged as denied</text>
  </g>

  <path class="dg-line" d="M280 228V260" marker-end="url(#arrow)" data-step="4"/>
  <text class="dg-edge" x="290" y="244" text-anchor="start" dominant-baseline="central" data-step="4">yes</text>

  <g data-step="4">
    <rect class="dg-box" x="160" y="260" width="240" height="56" rx="6"/>
    <text class="dg-label" x="280" y="280" text-anchor="middle" dominant-baseline="central">Message stored as pending</text>
    <text class="dg-sub" x="280" y="300" text-anchor="middle" dominant-baseline="central">not sent yet</text>
  </g>

  <path class="dg-line" d="M280 316V348" marker-end="url(#arrow)" data-step="5"/>

  <g data-step="5">
    <rect class="dg-box" x="140" y="348" width="280" height="56" rx="6"/>
    <text class="dg-label" x="280" y="368" text-anchor="middle" dominant-baseline="central">Preview email sent to owner</text>
    <text class="dg-sub" x="280" y="388" text-anchor="middle" dominant-baseline="central">24-hour single-use link</text>
  </g>

  <path class="dg-line dg-line--accent" d="M280 404V436" marker-end="url(#arrow-accent)" data-step="6"/>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="160" y="436" width="240" height="56" rx="6"/>
    <text class="dg-label" x="280" y="456" text-anchor="middle" dominant-baseline="central">Owner clicks Send</text>
    <text class="dg-sub" x="280" y="476" text-anchor="middle" dominant-baseline="central">message actually goes out</text>
  </g>
</svg>
```

## Getting started

### Install

```bash
# Option 1: use the hosted instance, no ops required
# Sign up at https://mcp4mail.online and connect an IMAP account

# Option 2: self-host, so the password stays on your own machine
git clone https://github.com/jchsoft/mcp4mail.git
cd mcp4mail
cp .env.example .env   # fill in HITCH_RESOURCE_URI (your public URL, must match exactly what the MCP client is given), SECRET_KEY_BASE, etc.
docker compose up -d   # starts app (Rails/Puma) + db (PostgreSQL 17), listening on http://localhost:8080 by default
# Put a TLS-terminating reverse proxy in front before going live (Caddy/nginx/Traefik/Cloudflare tunnel) — OAuth 2.1 requires https
```

### Basic usage

```bash
# Claude Code: add the remote MCP server
claude mcp add --transport http mcp4mail https://mcp4mail.online/mcp   # swap in your own /mcp URL if self-hosted
claude mcp login mcp4mail   # opens a browser for the OAuth 2.1 flow; once approved, the tools are listed
```

```text
# Tools the agent can call (all read-only by default):
list_mail_accounts    # list the mailboxes you connected
list_folders           # list folders
search_messages        # search by subject/sender/recipient/attachment name/date
get_message             # read one message
get_attachment           # download an attachment (up to 5MB can come back inline)
search_contacts           # find addresses you've corresponded with
```

### Advanced usage (optional)

```text
# On the mcp4mail "Mailboxes" page, turn on
# "Allow the AI to make changes to this mailbox" for one mailbox,
# then tick exactly which actions to open:
# - set_flags / move_message (mark as read, move to a folder)
# - create_draft (save a draft)
# - send_message (only prepares a message — a human always has to press Send)
# - trash_message (moves to Trash, not a hard delete)
```

```bash
# When self-hosting, generate the encryption keys separately instead of
# letting them derive from SECRET_KEY_BASE alone
docker compose run --rm --no-deps app bin/rails db:encryption:init
# Write the three ACTIVE_RECORD_ENCRYPTION_* values back into .env, so
# rotating SECRET_KEY_BASE later doesn't make every stored mailbox password unreadable
```

## Comparison with existing tools

| | mcp4mail | Writing your own Gmail API integration | Handing the agent your IMAP password / a mailbox export |
|---|---|---|---|
| Works with any standard IMAP provider, not just Gmail/Outlook | ✅ | ❌ Gmail only | ✅ but with zero access control |
| Write actions off by default, enabled per-action | ✅ | You build it yourself | ❌ full access from the start |
| Password can stay entirely on your own machine | ✅ (self-hosted) | Depends how you store the token | Sort of, but no encryption or auditing |
| Sending mail requires human approval | ✅ | You build it yourself | ❌ |
| Built-in call audit log (who, which tool, how many rows) | ✅ | You build it yourself | ❌ |
| Works directly with multiple AI clients (Claude, ChatGPT, Cursor, VS Code) | ✅ standard MCP + OAuth 2.1 | Separate integration per client | — |

## Things to watch out for

- It's plain IMAP with an app password, not Gmail/Microsoft Graph OAuth — for Gmail you need two-step verification plus an app password turned on yourself, and a Google Workspace admin can disable IMAP or app passwords entirely for the org, which would block it completely.
- Search runs against mcp4mail's own header index, refreshed every 15 minutes — not a live query against the mailbox — so a message you just received might not be searchable yet. `list_mail_accounts` returns `indexed_at` so you can check how stale it is.
- When self-hosting, the `HITCH_RESOURCE_URI` environment variable has to match the URL given to the MCP client exactly (scheme, host, port, path). Get it wrong and the web UI still works fine, but no MCP client can connect — the docs call this out as the single most common failure.
- This is a very new, very small project (0 stars, a two-person team, started mid-September). The README and docs are reasonably complete, but there's no large-scale production track record yet: the IMAP compatibility list marks Fastmail, iCloud, Zoho, Seznam, Cyrus, and Courier all as "untested," with only Dovecot's behavior actually verified against the fake test server.

## Today's takeaway

What's more worth remembering than the tool itself is how it got built: the developer stepped in at exactly two points — planning the task list, and deploying the first version to production. Everything in between — 42 days, 182 finished tasks, 146 merged pull requests, 140 logged hours — was done by an autonomous coding agent (Claude Code running on the team's own machine), with 90% of pull requests passing CI on the first try. What stands out more is how it handles CI failures unrelated to the task at hand: the agent doesn't quietly slip an unrelated fix into the current pull request. Instead it opens a new, high-priority task, jumps it to the front of the queue, fixes it, merges once CI is green, and only then goes back to finish what it was originally doing. That pattern — small tasks, a protected main branch, and CI that actually blocks merges — reads a lot like how a team would onboard a junior engineer. Whether an AI agent can produce production code you can trust seems to depend less on how capable the model is, and more on whether that process is actually enforced.

## References

- [jchsoft/mcp4mail — GitHub](https://github.com/jchsoft/mcp4mail)
- [mcp4mail — connecting an MCP client (docs/mcp-clients.md)](https://github.com/jchsoft/mcp4mail/blob/main/docs/mcp-clients.md)
- [mcp4mail — self-hosting guide (docs/self-hosting.md)](https://github.com/jchsoft/mcp4mail/blob/main/docs/self-hosting.md)
- [An open-source MCP server built by autonomous AI developers: the numbers — dev.to](https://dev.to/pepan/an-open-source-mcp-server-built-by-autonomous-ai-developers-the-numbers-33b2)
- [mcp4mail hosted service](https://mcp4mail.online)
- [mcptask.online live task board](https://mcptask.online/live)
