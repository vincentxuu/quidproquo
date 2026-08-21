---
title: "Composio: Who Holds Every User's Token When Your Agent Connects a Hundred SaaS Apps"
date: 2026-08-21
category: ai
type: deep-dive
tags: [composio, ai-agent, oauth, mcp, tool-use, multi-tenant]
lang: en
tldr: "This site covers MCP thoroughly but has never written about the layer underneath it: when your agent acts for ten thousand end users reading their own Gmail, whose database holds those refresh tokens, who rotates them, who revokes them. Composio is currently the most complete answer — MIT-licensed SDKs, a commercial hosted execution and OAuth layer. It claims 1,000+ toolkits; the managed-auth page actually lists 121 with a Composio OAuth app and 96 that require your own credentials. New pricing effective 2026-08-15: 100K free tool calls, $29/mo Pro. This post takes the authorization model down to an operational level and draws the line between wiring up MCP servers yourself and buying an integration platform."
description: "A deep dive on Composio: the user ID / auth config / connected account model, managed versus bring-your-own OAuth apps, revocation and exit paths, the Connect Link OAuth session fixation defense, and pricing verified 2026-08."
series:
  name: "Technology Choices in the AI Era"
  order: 14
draft: false
---

🌏 [中文版](/posts/ai/2026-08-21-composio-agent-tool-integration)

This site's MCP coverage is fairly complete: [the protocol itself](/posts/ai/2026-03-22-mcp-model-context-protocol-en), the [Playwright](/posts/tech/2026-06-20-playwright-mcp-en) and [Chrome DevTools](/posts/tech/2026-06-20-chrome-devtools-mcp-en) browser servers, [wrapping your own scraper as an MCP server](/posts/tech/2026-03-20-mcp-server-job-scraper-en), [how to mount them in Claude Code](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en), and [how the protocol layers divide the work](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en).

Every one of those posts is about **your agent connecting to your own tools**. One layer has never appeared here.

Suppose your product has ten thousand end users, and the agent has to read *their* Gmail, write *their* Notion, post as *them* in Slack. Whose database holds those ten thousand OAuth refresh tokens? Who rotates them when they expire? Which button does the user press to revoke?

That layer is not an "how do I call an API" problem. Calling the API is the easy part.

## What Composio Is

[Composio](https://composio.dev/) sells a hosted tool catalog plus an authorization layer underneath it. You call its SDK from your own backend, it hands back tool definitions already wired to authentication that you can feed to any agent framework, and when a tool actually runs, Composio uses that specific user's credentials against the upstream API.

The [SDK monorepo on GitHub is MIT licensed](https://github.com/ComposioHQ/composio), at 29,788 stars when read on 2026-08-21. What is open source: the TypeScript and Python SDKs, the CLI, and provider adapters for OpenAI Agents, the Claude Agent SDK, Vercel AI SDK, LangChain, LlamaIndex, Mastra, and CrewAI.

**What is not open source is the execution side.** Managed OAuth, credential storage, the tool catalog, the dashboard, and the sandbox all live on Composio's cloud, and I found no self-hosting path in the official docs.

The scale numbers come in two tiers. "1,000+ toolkits" appears on the homepage, the README, and the pricing page — that is a vendor claim. What you can independently check is the [managed auth page](https://docs.composio.dev/toolkits/managed-auth). It lists **121** toolkits where Composio has already registered an OAuth app for you: Gmail, Slack, GitHub, Notion, Salesforce, and HubSpot are all there. Another **96** require your own credentials, including Shopify, Snowflake, ServiceNow, Twitter, and Xero.

That page only covers toolkits that have an authentication concept, so it is not the whole catalog. But it is the only figure you can count line by line.

Three nouns decide the entire model, and mixing them up early breaks everything later:

- **user ID**: the identifier for a person in your system. The docs are blunt about it — use a database primary key, a unique username is acceptable, **avoid email** (it changes), and **never use `default` in production**, which the docs say outright "exposes other users' data."
- **auth config**: the blueprint for how one toolkit authenticates — one of four schemes (OAuth2 / API key / Bearer token / Basic), which scopes it requests, and whether it uses Composio's OAuth app or yours. One auth config serves all your users.
- **connected account**: one user's authorization to one toolkit. The tokens live here, keyed to the user ID.

In one line: the auth config is the mold, and a connected account is the part each user stamps out of it.

## What the Authorization Flow Actually Looks Like

Every session ships with a `COMPOSIO_MANAGE_CONNECTIONS` meta tool. When the agent needs a tool that this user has not authorized yet, it reads that toolkit's auth config, creates a connection, and returns a **Connect Link** — a Composio-hosted sign-in page. The user completes OAuth there and Composio takes the tokens. The docs explain the design this way: "Credentials never pass through your app or the model, so it's safe to surface the link right in the chat."

If you would rather not wait for the agent to trigger it, call `session.authorize()` during onboarding or from a settings page to generate the link up front.

```python
from composio import Composio

composio = Composio()

# The session binds to a person in your system, not to your API key
session = composio.create(
    user_id="user_123",
    manage_connections={"callback_url": "https://yourapp.com/chat"},
)

tools = session.tools()   # hand these to any agent framework
```

The session concept exists for context reasons too: instead of loading hundreds of tool definitions, it gives the agent a small set of meta tools that search with `COMPOSIO_SEARCH_TOOLS` and run with `COMPOSIO_MULTI_EXECUTE_TOOL` at runtime. That is exactly the problem covered in [the tool-selection collapse curve](/posts/ai/2026-06-04-tool-selection-at-scale-en); Composio's answer is runtime retrieval. Sessions live server-side and do not expire, so multi-turn conversations should store the session ID and resume with `composio.use()`.

## Who Actually Holds the Token

This is the question to settle before you commit, and the answer depends on which kind of auth config you use.

**Composio's managed OAuth app** (the default): the client ID and secret belong to Composio, the access and refresh tokens live at Composio, and Composio does the rotation. Your backend never touches a credential. The price is four things, all listed plainly in the docs:

1. On the Google or GitHub consent screen, users read "**Composio** wants to access your account," not your product name.
2. Rate limits come from a quota shared across all Composio customers.
3. Trigger polling has a **15-minute** minimum interval; only your own OAuth app can poll faster.
4. The default scopes are Composio's choice.

**Bring your own OAuth app**: you register an app in Google's or GitHub's developer portal, point its redirect URI at Composio's callback, and hand Composio the client ID and secret. The consent screen carries your name, the quota is yours, and you choose the scopes (passed as a comma-separated `scopes` string). The tokens still live at Composio.

**If you need Composio itself never to see a plaintext token**, there is exactly one path: the Enterprise KMS proxy, where you hold the keys, secrets are encrypted before they reach Composio, and only ciphertext is stored. The docs draw the boundary in the same breath: "It covers secret storage, not full data residency."

There is also a hybrid path worth knowing. You can import an **access token you obtained through your own OAuth flow** as a connected account under the `BEARER_TOKEN` scheme, and it works with every toolkit supporting OAuth2. The cost is stated in the docs: "Since you're providing your own token, Composio won't handle OAuth refresh. You're responsible for refreshing the token on your end and pushing the updated value to Composio via the PATCH method whenever it changes." In other words, **you can buy the tool catalog without buying the managed authorization** — but then you carry the refresh loop yourself.

**What to do**: something you can settle tonight — list the first five toolkits you need and check each one against the [managed auth page](https://docs.composio.dev/toolkits/managed-auth) to see whether it falls in the 121 group or the 96. Anything in the 96 requires you to register your own OAuth app anyway, which means managed auth's convenience advantage does not actually apply to your project.

## Revocation, Expiry, and the Exit

Multi-tenant authorization breaks in the lifecycle, not on the first connection.

**Expiry**: Composio refreshes OAuth tokens before they expire, and a connection is only marked `EXPIRED` after refresh attempts have failed. Only `ACTIVE` connections can execute tools; anything else has to be handled first.

**Revocation**: the API separates two things, and the distinction matters.

| Action | Endpoint | Effect |
|---|---|---|
| Revoke | `POST /connected_accounts/{nanoid}/revoke` | Revokes the grant at the upstream provider |
| Delete | `DELETE /connected_accounts/{nanoid}` | Removes the connection from Composio |
| Disable | `PATCH /connected_accounts/{nanoid}/status` | Keeps the record, turns it off |

If you only `DELETE` and never `revoke`, the grant is still live on Google's side. This is the part your GDPR or data-deletion flow has to get right.

**Scope changes do not apply retroactively**: changing scopes on an auth config affects **new** connections only. Users who already authorized keep the scopes they granted until they reconnect. Anyone tightening permissions needs to internalize this — editing the config does not narrow what existing users' tokens can do.

**Exit cost**: when you switch to your own OAuth app, existing connected accounts stay bound to the original auth config and keep refreshing with the original credentials. To actually migrate, the documented path is to delete the old connected account and have the user re-authenticate, or import credentials where supported. Which means **leaving managed auth costs you a batch of users clicking through a consent screen again** — not a rounding error at ten thousand users.

## A Real Attack Surface: Connect Link Session Fixation

This is the section I most wanted to pull out after reading the full authentication docs, because it admits a vulnerability inherent to hosted authorization rather than hiding it.

The docs state the problem directly:

> Anyone who opens a Connect Link and consents becomes the account attached to that flow. On its own that is exploitable: someone starts a connection under their own user, copies the authorization URL before consenting, and gets a different person to finish it, attaching that person's provider account under the attacker's identity. This is OAuth session fixation.

The defense is **callback identity verification**, opt-in per project. With it on, every OAuth connection is held until your server confirms who came back:

1. After the provider callback, Composio redirects the browser to an endpoint you host, carrying one query parameter, `session_uri` — **no connection id, no user id, no toolkit name**.
2. Your server, authenticating with the project API key, posts the `session_uri` plus the signed-in `user_id` to the complete auth endpoint.
3. On a match the connection activates; on a mismatch it returns `400`, the connection moves to `FAILED`, and `status_reason` reads `Callback identity verification failed`.

The `session_uri` is single-use and valid for ten minutes; redeeming it spends the session whatever the outcome, and a repeat call returns `404`. One practical trap: once a verifier URL is set, **connections started from the dashboard cannot complete** — a dashboard connection belongs to a Composio dashboard user, not one of your app's users, so your endpoint cannot report a matching `user_id`. Test from your own app, or clear the verifier while you work in the dashboard.

**What to do**: if your agent is multi-tenant and Connect Links appear in a chat window or an email — anywhere a link can be forwarded — turn this on. It is off by default.

## It Is Also an MCP Server Now

This is the 2026 change, and the seam with this site's existing MCP posts. Composio now has two front doors onto the same authorization backend.

**SDK mode**: `composio.create(user_id)` returns a session you feed to your framework through a provider adapter. For MCP, pass `mcp: true` when creating the session and point any MCP client at `session.mcp.url`.

**Composio Connect**: a shared remote MCP server at `https://connect.composio.dev/mcp`, with official setup steps for Claude Code, Claude Desktop, Cursor, ChatGPT, VS Code, and n8n.

```bash
claude mcp add --scope user --transport http composio \
  https://connect.composio.dev/mcp \
  --header "x-consumer-api-key: YOUR_API_KEY"
```

The key design decision is that it **does not lay out a thousand app tools**. It exposes 7 meta tools: search tools, fetch schemas, execute in parallel (up to 50 per call), manage connections, wait for connections, and Python plus bash in a remote workbench. The first time your agent needs an app, Composio generates an OAuth link for you to approve in the browser, and the connection persists across sessions afterward.

What that means for a reader: if you only want your own Claude Code to reach Gmail and Linear, this path takes two minutes and needs no backend at all. **But that is the single-user case** — you are the user ID. The multi-tenant complexity is in the sections above, not here. This site's post on [why one person connecting MCP is fine and three hundred need a gate](/posts/ai/2026-08-16-cs146s-ai-native-team-en) covers the organizational side of the same problem; this post covers its authorization side.

## Pricing (Effective 2026-08-15)

Composio changed its pricing on 2026-08-15. Here is the [official pricing page](https://composio.dev/pricing) as read:

| Item | Free | Pro ($29/mo) | Overage |
|---|---|---|---|
| Tool calls (own app / API key / MCP) | 100K / mo | Everything in Free, plus $29 usage credit | $0.0003 / call |
| Trigger events | 50K / mo | Same | $0.003 / event |
| Connected accounts (own app) | Unlimited, free | Free | — |
| Sandbox LLM tokens | 1M / mo | Same | $3.75 / M |
| Team members | 3 | Unlimited | — |
| Log retention | 7 days | 30 days | Custom on Enterprise |

Two dates to keep: existing customers stay on their current plan through 2026-12-31, and premium tool billing applies to everyone from 2026-09-01.

Composio-managed OAuth apps have a separate, **more expensive rate that eats the same free allowance**. At most 20K of your 100K free tool calls can run through managed apps, then $0.0005 per call; connections are free up to a thousand, then $0.10 each. That design puts a price tag on convenience — skip registering your own OAuth app and your free allowance drops to a fifth.

Two add-ons are easy to miss. Zero data retention is a Pro-and-above add-on charged per tool call and per trigger event, and direct execution outside a session costs extra too. The Free tier is hard-capped: hit the ceiling and usage pauses until next month rather than generating a bill.

Premium tools are pass-through. Composio says it passes "the provider's price straight through with a 5% platform fee — no markup on top." The list includes Browser Use, Veo video generation, and search from [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents-en) and Tavily. Exa is the one you can reconcile: Composio quotes about $0.008 a search, and the previous post in this series priced Exa directly at $7 per 1,000 — the 5% checks out.

## Build It Yourself or Buy the Platform

My read splits three ways.

**Single user, personal use, a handful of apps**: do not buy an integration platform. Install off-the-shelf MCP servers or write a few API calls. You have one token, it sits in `.env` or the system keychain, and there is no lifecycle problem at all. A cloud service here is just one more failure point and one more party holding a credential.

**A product with end users and three or more services needing OAuth**: this is where integration platforms actually earn their keep. The criterion is not "can you write OAuth" — the authorization code flow itself is a day's work. What consumes the time is the **multiplication**: every additional service brings its own scope semantics, token lifetimes, revocation behavior, and rate limits, multiplied again by per-user encrypted storage, refresh scheduling, and audit trails. That multiplication is the product being sold.

**The middle ground — one or two OAuth services**: write it. One refresh loop and one encrypted token table is controllable, testable, and keeps your users' credentials out of a third party's hands. I would draw that line around three services.

Two situations override all of the above. First, **compliance forbidding a third party from holding plaintext credentials** leaves you the Enterprise KMS proxy or a build. Second, **if integration is your core product** (you sell an iPaaS), outsourcing it makes no strategic sense.

Whichever route you take, every mechanism question in this post still needs an answer: where the token lives, who rotates it, which endpoint revokes it, and what happens to existing users when scopes change. **Buying a platform means someone else answered those questions, not that they went away.** The open question left by [WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools-en), part 8 of this series — who is accountable once an agent inherits a user's permissions — gets a priced answer at this layer, not a safer one.

## Who Else Is in This Layer

Competitors are background here; this post does not score them.

[Arcade](https://docs.arcade.dev/en/get-started/about-arcade) positions itself as an "enterprise-ready actions runtime for AI agents," with the pitch centered on authorization for every action and central governance, on an MCP-first line.

[Pipedream](https://pipedream.com/docs) sells the same layer through its Connect product, self-described as one-click OAuth and managed auth for over three thousand APIs. But its ownership changed: Workday [announced a definitive agreement to acquire it on 2025-11-19](https://newsroom.workday.com/2025-11-19-Workday-Signs-Definitive-Agreement-to-Acquire-Pipedream), expected to close in Workday's fiscal 2026 fourth quarter. Factoring in "whose roadmap does this company serve" is fair in a decision like this.

Toolhouse and Zapier MCP also sit in this layer; I did not verify their current state, so I am not commenting on them.

## Overall

Composio has not pivoted and has not been acquired. It is currently the most complete option in this layer and the most candid on documentation — putting session fixation in its own docs, listing the four costs of managed auth line by line. Neither is common in this space.

But be clear about what is being sold: **the SDKs are open source; the moat is custody and rotation of a hundred million tokens.** You are not buying "you don't have to understand OAuth." You are buying "you don't have to multiply OAuth operations by integration count by user count." The difference between those two sentences shows up the first time someone asks you to revoke every grant belonging to one user.

## References

- [Composio](https://composio.dev/)
- [Composio pricing](https://composio.dev/pricing) (read 2026-08-21; new pricing effective 2026-08-15)
- [ComposioHQ/composio (GitHub, MIT)](https://github.com/ComposioHQ/composio)
- [Authentication — Composio Docs](https://docs.composio.dev/docs/authentication)
- [What is a session? — Composio Docs](https://docs.composio.dev/docs/how-composio-works)
- [Composio Managed Auth toolkit list](https://docs.composio.dev/toolkits/managed-auth)
- [When to use your own developer credentials — Composio Docs](https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app)
- [Connected Accounts API reference (incl. callback identity verification)](https://docs.composio.dev/reference/api-reference/connected-accounts)
- [Controlling scopes — Composio Docs](https://docs.composio.dev/docs/authentication/controlling-scopes)
- [White-labeling authentication — Composio Docs](https://docs.composio.dev/docs/authentication/white-labeling-authentication)
- [Importing existing connections — Composio Docs](https://docs.composio.dev/docs/authentication/importing-existing-connections)
- [Composio Connect (MCP endpoint) — Composio Docs](https://docs.composio.dev/docs/composio-connect)
- [About Arcade — Arcade Docs](https://docs.arcade.dev/en/get-started/about-arcade)
- [Introduction to Pipedream](https://pipedream.com/docs)
- [Workday Signs Definitive Agreement to Acquire Pipedream (2025-11-19)](https://newsroom.workday.com/2025-11-19-Workday-Signs-Definitive-Agreement-to-Acquire-Pipedream)
- Related on this site: [WebMCP](/posts/tech/2026-08-21-webmcp-browser-tools-en), [Exa](/posts/ai/2026-08-21-exa-neural-search-for-agents-en), [MCP](/posts/ai/2026-03-22-mcp-model-context-protocol-en), [the protocol layer](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en), [tool selection at scale](/posts/ai/2026-06-04-tool-selection-at-scale-en), [three hundred people connecting MCP](/posts/ai/2026-08-16-cs146s-ai-native-team-en)
