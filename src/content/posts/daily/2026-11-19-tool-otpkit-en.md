---
title: "Tool Pick｜otpkit — an API-key-free temp email/SMS MCP server that extracts OTPs for you"
date: 2026-11-19
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "otpkit is an MCP server that gives an agent free disposable email addresses and phone numbers, then automatically pulls OTP codes and verification links out of incoming mail and SMS — no API key needed"
tldr: "otpkit is an MCP server that lets an agent create a temp email/phone number, wait for mail, and extract the OTP itself. Install: uvx otpkit. It solves the hassle of manually checking an inbox to copy a verification code during signup testing."
series:
  name: "AI Tool of the Day"
  order: 83
---

> :globe: [中文版](/posts/daily/2026-11-19-tool-otpkit)

## Tool info

| Field | Value |
|---|---|
| Name | otpkit |
| Type | MCP server |
| GitHub | [SecFathy/otpkit](https://github.com/SecFathy/otpkit) |
| Stars | 60 (at review time; repo created 2026-11-17) |
| Language | Python 3.10+ (only `mcp` and `httpx` as dependencies) |
| License | MIT |
| Install | `uvx otpkit` |

## What problem it solves

When you ask an agent to test a signup flow, or to actually complete a sign-up on some site, it usually stalls right at "enter the verification code" — it has no inbox and no phone, so it can never receive the email or SMS. You end up doing the annoying part yourself: open a disposable-email site, copy the generated address into the form, wait for the mail, go back and copy the digits, paste them into the site. Every one of those steps hands a task the agent should finish on its own back to a human.

otpkit packages that whole sequence into one MCP server. It wires up four free email backends (grabmail, catchmail, guerrillamail, maildrop) and three SMS sources (one free shared number, two paid private ones), so the agent can call `create_temp_email` to get a usable address and `wait_for_email` to actually *wait* for a new message — not a single check-and-give-up, but built-in polling until the mail arrives or the call times out. Every message that comes in is automatically scanned with a regex: 4–8 digit OTP codes and links containing keywords like `verify`/`confirm`/`token` get pulled out and returned as structured JSON, so the agent never has to parse raw email content itself.

```diagram
title: How otpkit handles one signup verification code
desc: The agent creates a temp inbox and asks otpkit to wait for mail; otpkit polls the inbox, the verification email arrives, and otpkit returns the extracted OTP to the agent.
step: Agent creates a temporary inbox
step: otpkit returns the inbox address
step: Agent asks otpkit to wait for new mail
step: otpkit polls the inbox every 5 seconds
step: The verification email arrives
step: otpkit extracts the OTP and returns it to the agent
---
<svg viewBox="0 0 640 400">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="376"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="376"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="376"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="108" text-anchor="middle" dominant-baseline="central">create inbox</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 164H100" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="152" text-anchor="middle" dominant-baseline="central">inbox address</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 208H312" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="204" y="196" text-anchor="middle" dominant-baseline="central">wait for mail</text>
  </g>
  <g data-step="4">
    <path class="dg-line" d="M324 252H536" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="430" y="240" text-anchor="middle" dominant-baseline="central">poll every 5s</text>
  </g>
  <g data-step="5">
    <path class="dg-line dg-line--dashed" d="M540 296H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="284" text-anchor="middle" dominant-baseline="central">mail arrives</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 340H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="208" y="328" text-anchor="middle" dominant-baseline="central">return OTP</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="68" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="196" width="8" height="156" rx="2" data-step="3 4 5 6"/>
  <rect class="dg-box" x="540" y="240" width="8" height="68" rx="2" data-step="4 5"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Agent</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">otpkit</text>
  <rect class="dg-box dg-box--link" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Email service</text>
</svg>
```

Good fit for: QA/test-automation agents that need to spin up a throwaway test account, demoing a product's full signup flow without a human copying codes, or browser-use-style agents building a sign-up wizard end to end that get stuck at "receive the verification code."

## Getting started

### Install

```bash
# No install needed — run it straight from uvx (recommended, the README's own first choice)
uvx otpkit

# Or install from GitHub with pip
pip install git+https://github.com/secfathy/otpkit.git
```

Claude Code, one line:

```bash
claude mcp add otpkit -- uvx otpkit
```

Claude Desktop (or any client that reads JSON config), add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "otpkit": { "command": "uvx", "args": ["otpkit"] }
  }
}
```

### Basic usage

```
You: Sign me up for example.com and enter the verification code once it arrives

Agent calls, in order:
1. create_temp_email(provider="grabmail")
   → {"address": "tmp1794926042@grabmail.io"}

2. [fills out example.com's signup form with that address]

3. wait_for_email(address="tmp1794926042@grabmail.io", timeout=60)
   → {
       "status": "received",
       "otps": ["847291"],
       "links": ["https://example.com/verify?token=abc123def"]
     }

4. [enters 847291 into the site's verification field]
```

### Advanced usage

Free SMS numbers are publicly shared. If you actually need SMS verification for a service where privacy matters (WhatsApp, say), switch to a paid private number instead:

```
You: Buy a US number and get the WhatsApp verification code

Agent calls, in order:
1. get_sms_providers()
   → [..., {"name": "5sim", "ready": true}]

2. buy_temp_number(country="usa", service="whatsapp", provider="5sim")
   → {"order_id": "12345", "phone": "+12025551234"}

3. [completes WhatsApp verification with that number]

4. check_paid_sms(order_id="12345")
   → {"status": "RECEIVED", "otps": ["583921"]}
```

A paid number just swaps the `provider` argument away from the default free source — the API shape is identical. The only extra step is setting the matching environment variable for `5sim`/`smspool` (`FIVESIM_API_KEY`/`SMSPOOL_API_KEY`).

## Compared to the alternatives

| | otpkit | manual temp-mail site | self-hosted IMAP test inbox | wiring up an SMS API directly |
|---|---|---|---|---|
| Works without an API key | ✓ | ✓ | depends on the mail server | ✗ |
| Agent calls it directly, no browser | ✓ | ✗ | partial (you write the polling) | partial (you write the client) |
| Auto-extracts OTP/verification link | ✓ (regex) | ✗ you hunt for it | ✗ you write it | depends on the provider's format |
| Multiple email/SMS sources to switch between | ✓ 4 email + 3 SMS | one site | one inbox | one provider |
| Paid plan required for a private number | optional (5sim/smspool) | — | — | required |

## Things to watch for

- **maildrop is a public inbox**: anyone can read mail sent to the same username. Use it only for non-sensitive tests, never for a real account's verification mail.
- **guerrillamail addresses expire in about an hour**: create a fresh one for anything that runs longer.
- **Free SMS numbers are publicly shared**: the README says so itself — anyone can read the content, so never use them for a real account.
- **No persistence**: session state lives in memory only. Restart the MCP server and every temp email address or number created so far is gone; you'll need to create new ones.
- **Still very new**: 60 stars, repo created 2026-11-17. Run through a full flow by hand before wiring it into CI or any automated test pipeline.

## Today's takeaway

I used to think the reason an agent stalls out on OTP during a signup flow is that email and SMS are inherently external, asynchronous, wait-for-it channels — unlike a normal API call that returns synchronously, so this step always has to go back to a human. What otpkit shows is that "waiting" itself can just be a blocking MCP tool call (`wait_for_email`/`wait_for_sms`) instead of a one-shot check tool — the agent doesn't need to write its own polling loop or guess how long to wait. The one step that used to require a human gets folded into a single tool call.

## References

- [SecFathy/otpkit — GitHub](https://github.com/SecFathy/otpkit)
- [otpkit README (raw source)](https://raw.githubusercontent.com/SecFathy/otpkit/main/README.md)
- [otpkit — pyproject.toml](https://raw.githubusercontent.com/SecFathy/otpkit/main/pyproject.toml)
- [Model Context Protocol docs](https://modelcontextprotocol.io)
