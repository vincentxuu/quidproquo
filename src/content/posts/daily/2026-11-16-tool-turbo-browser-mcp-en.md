---
title: "Tool Pick｜turbo-browser-mcp — 10 batched tools instead of 25 scattered ones"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "turbo-browser-mcp is a Playwright MCP server that replaces full-tree snapshots, field-by-field fills, and Base64 uploads with delta snapshots, one-call batch form filling, and direct disk uploads"
tldr: "turbo-browser-mcp merges @playwright/mcp's 25 fine-grained tools into 10 batched tools. Install: npx -y turbo-browser-mcp. It fixes the problem where every small browser action costs a full MCP round trip and the conversation history keeps growing."
series:
  name: "AI Tool of the Day"
  order: 80
---

> 🌏 [中文版](/posts/daily/2026-11-16-tool-turbo-browser-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | turbo-browser-mcp |
| Type | MCP server |
| GitHub | [Tthanh2k6/turbo-browser-mcp](https://github.com/Tthanh2k6/turbo-browser-mcp) |
| Stars | 101 (at time of writing; repo created 2026-11-14) |
| Language | JavaScript (Node.js, single dependency: `playwright-core`) |
| License | MIT |
| Install | `npx -y turbo-browser-mcp` (requires Node ≥ 20) |

## What Problem It Solves

Have you noticed how filling out one form with a browser agent can burn through a dozen tool calls? The standard pattern: snapshot the full ARIA tree, then `fill` one field at a time, `select_option` for dropdowns, a separate round for file uploads — and every single round resends the growing conversation history back to the model. A benchmark against a 10-field form took 11 turns and replayed over 70,000 tokens cumulatively, most of it the same barely-changed DOM tree being restated over and over.

turbo-browser-mcp's answer is to collapse `@playwright/mcp`'s 25 fine-grained tools (`browser_click`, `browser_type`, `browser_select_option`, and so on) and `chrome-devtools-mcp`'s 33 tools into 10 batched ones. `inspect_compact` returns a trimmed list of interactive elements by default, and with `onlyChanged: true` it returns only what changed since the last snapshot instead of rescanning the whole tree. `smart_fill_form` takes an entire list of fields at once — React-controlled inputs, Shadow DOM, fields inside iframes, `contenteditable` editors — fills them in one call, and validates the result in the same response. File uploads take a disk path directly, so a PDF never gets Base64-encoded into context. The README's own `tiktoken`-measured benchmark: the same 10-field form drops from 11 turns and 72,614 cumulative tokens to 1 turn and 811 tokens.

Just as important is the built-in human-in-the-loop submit guard: `allowSubmit` defaults to `false`, so anything that looks like a Submit, Publish, Send, or payment button gets blocked unless you explicitly pass `allowSubmit: true`. It's a good fit for agents that need to operate on web pages frequently and in many steps — scraping, automated testing, form-filling agents — especially when context window size or token cost is the bottleneck. It also suits workflows where an agent should fill out a form but a human needs to approve the actual submission.

```diagram
title: Collapsing four separate calls into two batched calls
desc: The standard approach splits work into snapshot, field-by-field fill, select_option, and upload calls; turbo-browser-mcp merges these into a delta snapshot plus one batch fill.
caption: Turn counts and token counts come from the README benchmark (10-field form, measured with tiktoken o200k_base); the call stages shown here are simplified.
---
<svg viewBox="0 0 640 500">
  <text class="dg-heading" x="20" y="28" dominant-baseline="central">Before</text>
  <text class="dg-sub" x="20" y="44" dominant-baseline="central">11 turns · 72,614 cumulative tokens</text>
  <text class="dg-heading" x="340" y="28" dominant-baseline="central">After</text>
  <text class="dg-sub" x="340" y="44" dominant-baseline="central">1 turn · 811 tokens</text>
  <line class="dg-rule" x1="316" y1="16" x2="316" y2="352"/>

  <path class="dg-line" d="M160 108V132" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 184V208" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 260V284" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 184V216" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--ghost" x="36" y="56" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="73" text-anchor="middle" dominant-baseline="central">snapshot</text>
  <text class="dg-sub" x="160" y="93" text-anchor="middle" dominant-baseline="central">full ARIA tree</text>

  <rect class="dg-box dg-box--ghost" x="36" y="132" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="149" text-anchor="middle" dominant-baseline="central">fill field</text>
  <text class="dg-sub" x="160" y="169" text-anchor="middle" dominant-baseline="central">one call per field ×10</text>

  <rect class="dg-box dg-box--ghost" x="36" y="208" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="225" text-anchor="middle" dominant-baseline="central">select_option</text>
  <text class="dg-sub" x="160" y="245" text-anchor="middle" dominant-baseline="central">dropdown needs its own turn</text>

  <rect class="dg-box dg-box--ghost" x="36" y="284" width="248" height="52" rx="6"/>
  <text class="dg-label" x="160" y="301" text-anchor="middle" dominant-baseline="central">upload</text>
  <text class="dg-sub" x="160" y="321" text-anchor="middle" dominant-baseline="central">inline Base64</text>

  <rect class="dg-box" x="356" y="56" width="248" height="128" rx="6"/>
  <text class="dg-label" x="480" y="111" text-anchor="middle" dominant-baseline="central">inspect_compact</text>
  <text class="dg-sub" x="480" y="131" text-anchor="middle" dominant-baseline="central">delta snapshot, onlyChanged</text>

  <rect class="dg-box dg-box--accent" x="356" y="216" width="248" height="120" rx="6"/>
  <text class="dg-label" x="480" y="267" text-anchor="middle" dominant-baseline="central">smart_fill_form</text>
  <text class="dg-sub" x="480" y="287" text-anchor="middle" dominant-baseline="central">batch fill + direct disk upload</text>

  <g class="dg-badge"><circle cx="20" cy="82" r="10"/><text x="20" y="82" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="20" cy="158" r="10"/><text x="20" y="158" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="20" cy="234" r="10"/><text x="20" y="234" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="20" cy="310" r="10"/><text x="20" y="310" text-anchor="middle" dominant-baseline="central">−</text></g>
  <g class="dg-badge"><circle cx="340" cy="120" r="10"/><text x="340" y="120" text-anchor="middle" dominant-baseline="central">+</text></g>
  <g class="dg-badge dg-badge--accent"><circle cx="340" cy="276" r="10"/><text x="340" y="276" text-anchor="middle" dominant-baseline="central">+</text></g>

  <line class="dg-rule" x1="20" y1="376" x2="620" y2="376"/>
  <text class="dg-tag" x="20" y="400" dominant-baseline="central">Changes</text>
  <g class="dg-badge"><circle cx="32" cy="428" r="10"/><text x="32" y="428" text-anchor="middle" dominant-baseline="central">−</text></g>
  <text class="dg-sub" x="52" y="428" dominant-baseline="central">Removed: 4 separate calls — snapshot, per-field fill, select, upload</text>
  <g class="dg-badge"><circle cx="32" cy="456" r="10"/><text x="32" y="456" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="456" dominant-baseline="central">Added inspect_compact: returns only what changed</text>
  <g class="dg-badge dg-badge--accent"><circle cx="32" cy="484" r="10"/><text x="32" y="484" text-anchor="middle" dominant-baseline="central">+</text></g>
  <text class="dg-sub" x="52" y="484" dominant-baseline="central">Added smart_fill_form: fills the form and uploads files in one call</text>
</svg>
```

## Quick Start

### Install

```bash
# Option 1: run directly with npx (fastest)
npx -y turbo-browser-mcp

# Option 2: local clone, with an environment check
git clone https://github.com/Tthanh2k6/turbo-browser-mcp.git
cd turbo-browser-mcp
npm install
npm run doctor   # prints Node / Playwright / Chromium / CDP diagnostics

# If no Chrome/Edge/Brave is installed, grab Playwright's bundled Chromium
npx playwright-core install chromium
```

MCP client config (same shape for Claude Code, Cursor, and Codex):

```json
{
  "mcpServers": {
    "turbo-browser": {
      "command": "npx",
      "args": ["-y", "turbo-browser-mcp"]
    }
  }
}
```

### Basic Usage

```
You: Open example.com/signup and fill out the registration form with this
     data, but don't submit it yet.

What the agent actually calls:
1. tabs_batch { operations: [{ op: "open", url: "https://example.com/signup" }] }
2. inspect_compact { mode: "forms" }                      → form elements only, ~1,000 tokens
3. smart_fill_form { fields: [...10 fields...], returnSnapshot: true }
   → fills text fields, dropdowns, and checkboxes in one call, returns the
     filled-in snapshot for confirmation
4. Submitting for real requires passing allowSubmit: true — otherwise
   clicking Submit gets blocked
```

### Advanced Usage

```json
// Turn off image/media loading before scraping a page — saves bandwidth
// and cuts the diagnostics noise that comes with unrelated requests
{
  "name": "network_session",
  "arguments": { "preset": "turbo" }
}
```

```json
// Hand off to a human when a login or bot check blocks the flow; the agent
// resumes in the same tab once the condition is met
{
  "name": "wait_for_human",
  "arguments": {
    "message": "Please finish logging in or pass the verification, then leave the window open.",
    "selector": "#account-menu",
    "timeoutMs": 120000
  }
}
```

## Comparison with Existing Tools

| | turbo-browser-mcp | `@playwright/mcp` | `chrome-devtools-mcp` |
|---|---|---|---|
| Tool count | 10 (batched) | 25 (fine-grained) | 33 (fine-grained) |
| Delta snapshots (only changed elements) | ✅ | ❌ (full ARIA tree every time) | ❌ |
| Fill an entire form in one call (React/Shadow DOM/iframe) | ✅ | ❌ (needs multiple calls) | Basic `fill_form` only |
| File upload without Base64 (direct disk path) | ✅ | Needs a separate `browser_file_upload` call | Needs a separate `upload_file` call |
| Default human-in-the-loop submit guard | ✅ | ❌ | ❌ |
| Lighthouse / performance tracing / heap snapshots | ❌ | ❌ | ✅ |

## Caveats

- **Still a new project.** The repo was created on 2026-11-14 and has 101 stars. It does have CI (400+ tests across Node 20/22), but a low issue count doesn't mean there are no edge cases — test it yourself before wiring it into anything that touches real money or real data.
- **The submit guard isn't an anti-detection mechanism.** The README is explicit that it does no stealth, doesn't patch `navigator.webdriver`, and doesn't solve CAPTCHAs. For sites that detect automation, use `--open-profile` to let a human log in or pass verification in a normal Chrome window first, then have the agent take over the same browser profile.
- **The network submit guard is off by default.** `TURBO_BROWSER_NETWORK_GUARD` defaults to `false` because multi-step wizards often POST on every "Next" click; turning it on without checking your flow first can block normal navigation.

## Today's Takeaway

I used to think MCP tools should be sliced as finely as possible, so an agent could call exactly what it needed. turbo-browser-mcp's benchmark makes the opposite case: the real cost of a tool call isn't just the tokens in that one call — it's that every round trip resends the entire conversation history. Ten rounds means ten history replays, and that adds up to far more than the output tokens of a single round. Batching actions that naturally happen together — filling every field in a form, opening several tabs — trades away call-by-call flexibility for savings that scale with the number of rounds. It's a useful check for anyone designing an agent's tool surface: ask whether a group of actions usually happens together before assuming every low-level operation deserves its own tool.

## References

- [Tthanh2k6/turbo-browser-mcp — GitHub](https://github.com/Tthanh2k6/turbo-browser-mcp)
- [turbo-browser-mcp README (raw)](https://raw.githubusercontent.com/Tthanh2k6/turbo-browser-mcp/main/README.md)
- [turbo-browser-mcp — npm package](https://www.npmjs.com/package/turbo-browser-mcp)
- [MCP server registry entry (server.json)](https://raw.githubusercontent.com/Tthanh2k6/turbo-browser-mcp/main/server.json)
