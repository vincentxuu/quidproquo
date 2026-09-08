---
title: "Tool Pick | BankMCP — Let Your AI Assistant Read Your Own European Bank Account, Read-Only"
date: 2026-09-09
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A self-hosted, read-only MCP server that lets Claude, ChatGPT, and other AI assistants query European bank balances and transactions through the PSD2 Open Banking API"
tldr: "BankMCP is a self-hosted, read-only MCP server that wraps 2,700+ European banks behind Enable Banking's PSD2 API, so an AI assistant can directly answer things like \"has the Acme invoice been paid\" or \"what did I spend on subscriptions.\" Install: `claude mcp add bankmcp -- npx -y bankmcp`. It addresses the problem that letting an AI assistant help with money has never had a safe, read-only channel into real account data."
series:
  name: "AI Tool of the Day"
  order: 25
---

> 🌏 [中文版](/posts/daily/2026-09-09-tool-bankmcp)

## Tool Info

| Field | Value |
|---|---|
| Name | BankMCP |
| Type | MCP server (local stdio, or self-hosted as a remote HTTP connector) |
| GitHub | [noskillish/bankmcp](https://github.com/noskillish/bankmcp) |
| Stars | 154 |
| Language | TypeScript |
| License | MIT |
| Install | `claude mcp add bankmcp -- npx -y bankmcp` |

## What Problem It Solves

Have you ever wished you could just ask an AI assistant "how much did my subscriptions cost this month" or "has the Acme invoice been paid" instead of reconciling a statement line by line? The catch is that bank data is about as sensitive as personal data gets — pasting a screenshot of your online banking into an LLM, or handing your credentials to some third-party "smart finance" SaaS, both mean exposing exactly the thing you least want leaked, to something you don't control. Most people just give up and keep reconciling by hand.

BankMCP solves that trust problem by leaning on Europe's existing PSD2 open-banking regulation instead of building its own data-custody model. It isn't a cloud service that holds your data for you — it's a server you deploy and hold the keys to yourself, which talks to a licensed provider, Enable Banking, that wraps 2,700+ European banks behind one PSD2 API. Your server only stores Enable Banking's application key, the bank consents, and account IDs — it never persists balances or transaction data to disk; every query pulls live from Enable Banking on demand, and your bank password is entered only on your own bank's website, never passed through BankMCP or any AI vendor. Externally it's a plain MCP server exposing read-only tools only — there is no tool that can move money.

Good fit for: letting Claude Code, Claude Desktop, or Cursor answer account questions directly (balance, a specific transaction, total subscription spend); producing a monthly summary, flagging unusually large transactions, or setting background rules like "notify me if the balance drops below 5,000"; or simply having a European bank account already covered by Enable Banking and wanting to hand the repetitive job of "check the account" to an agent instead of opening the banking app yourself.

## Quick Start

### Install

```bash
# Requires Node 24+
# Sign up for a free account at https://enablebanking.com first — you'll need it during setup

claude mcp add bankmcp -- npx -y bankmcp

# Ask the assistant any bank-related question afterward and it replies
# with a localhost setup URL. Open it and follow the instructions to
# create an application at Enable Banking, then paste in the
# application id and the downloaded .pem key file
```

Claude Desktop users can instead download [`bankmcp.mcpb`](https://github.com/noskillish/bankmcp/releases/latest/download/bankmcp.mcpb) and install it as an extension, no command line required.

### Basic Usage

Once set up and after saying "connect my bank" (the `connect-bank` prompt) to walk through a bank login/consent flow, the agent gets a set of read-only tools:

```
list_accounts        → lists all connected accounts (with your own custom labels, e.g. "Everyday", "Joint")
get_balances          → current booked/available balance for one account
get_transactions       → paginated transaction history (amount, counterparty, description)
create_watch / list_watches → create/inspect background monitoring rules
```

```
User: Has the Acme invoice been paid?
Agent: (calls get_transactions filtering counterparty "Acme")
       → Debited NT$12,400 (EUR 380 original) on Sep 3
```

### Advanced Usage

```bash
# Background watch rules notify via webhook on a low balance or a large debit
create_watch(type: "balance_below", account: "Everyday", threshold: 5000)
create_watch(type: "single_debit_over", account: "Everyday", threshold: 10000)

# Or install it as a Claude Code plugin with three built-in skills
# (/bank:setup for local install, /bank:deploy for hosting, bank for reconciliation rules)
/plugin marketplace add noskillish/bankmcp
/plugin install bank@bank
```

## Comparison with Existing Tools

| | BankMCP | Screenshotting a statement to an LLM | Traditional budgeting app (manual entry) |
|---|---|---|---|
| Read-only, no persisted transaction data | ✅ | ❌ (the screenshot content enters the chat log) | Depends on the app |
| Bank password entered only on the bank's own site | ✅ | ❌ (credentials may end up pasted into chat) | ✅ |
| Self-hosted, you hold your own keys | ✅ | — | ❌ (mostly cloud SaaS) |
| MCP-native, agent can query autonomously | ✅ | ❌ | ❌ |
| Background monitoring rules + webhook alerts | ✅ | ❌ | Partial |

## Things to Watch Out For

- **European banks only**: it depends on Enable Banking's PSD2 API underneath, which covers roughly 2,700 European banks — a Taiwanese or US bank account can't be connected today.
- **The admin password is your only line of defense**: the README says plainly that "anyone with the admin password can read your accounts," so a remote deployment needs a genuinely long password plus the sign-in notification webhook enabled; changing the password and restarting is the only "log everyone out" kill switch.
- **Data is polled, not real-time**: PSD2 limits unattended background access to at most 4 checks a day, so watch rules are delayed periodic checks, not instant pushes; the docs are also upfront that a small local model (an 8B model) isn't yet trustworthy for computing totals correctly.

## Today's Takeaway

Most "AI reads your financial data" setups I've seen sit at one of two extremes: dump a whole screenshot or export into the conversation (and your data ends up with a model vendor), or don't touch it at all and keep reconciling by hand. BankMCP points at a third option — lean on a regulatory data layer (PSD2) and a licensed intermediary that already exist, let them own the compliance burden of "regulated read-only access," and keep your own piece a thin, open-source, auditable MCP bridge on top. It's a reminder that giving an agent access to sensitive data doesn't have to be a choice between "trust an opaque SaaS completely" and "don't do it at all" — when a regulated data layer already exists underneath, the MCP layer can stay thin and transparent.

## References

- [BankMCP GitHub repo](https://github.com/noskillish/bankmcp): README, stars, language, and license (MIT) are from the official repo and the GitHub API.
- [README "Security notes" section](https://github.com/noskillish/bankmcp#security-notes): the admin-password model, OAuth implementation, and what data is (and isn't) persisted.
- [README "What you get" section](https://github.com/noskillish/bankmcp#what-you-get): the full list of read-only tools and prompts.
- [Enable Banking](https://enablebanking.com): the PSD2 Open Banking API provider — bank coverage and terms.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): introduction to the MCP protocol.
