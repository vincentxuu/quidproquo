---
title: "agent-browser and the CLI + Skill Route: Why Coding Agents Drive Browsers from the Command Line"
date: 2026-11-19
category: ai
type: deep-dive
tags: [agent-browser, playwright, browser-automation, mcp, claude-code, agent-skills]
lang: en
tldr: "agent-browser, Playwright CLI, and Browserbase's browse all let a coding agent drive a long-lived browser through shell commands, with a skill teaching the agent how. \"CLI uses fewer tokens than MCP\" is only half true: tool definitions no longer have to load up front, but independent measurements find most of the gap comes from whether page state is pushed back into context automatically, and in one measurement the CLI needed 2–3x more tool calls. The more practical difference is permissions: a CLI needs a shell, and agent-browser turns a domain allowlist, an action policy, and a credential vault into flags, at the cost that the allowlist can't be used with your own logged-in Chrome."
description: "The CLI + skill route for coding agents driving a browser: agent-browser's snapshot + ref loop and Rust daemon, how it differs from Playwright CLI and Browserbase's browse, how to read the evidence behind \"CLI uses fewer tokens than MCP\", and agent-browser's domain allowlist, action policy, and credential vault, including why they can't be combined with your own Chrome."
draft: false
series:
  name: "AI Browser Automation"
  order: 6
---

> :globe: [中文版](/posts/ai/2026-11-19-agent-browser-cli)

The previous post compared three browser MCP servers. But the top of [Playwright MCP's own README](https://github.com/microsoft/playwright-mcp) says something else:

> If you are using a **coding agent**, you might benefit from using the CLI+SKILLS instead.

The reason given is that "CLI invocations are more token-efficient": no large tool schemas or accessibility trees stuffed into the model's context. Since 2026, [agent-browser](https://github.com/vercel-labs/agent-browser) (Vercel Labs), [Playwright CLI](https://github.com/microsoft/playwright-cli) (Microsoft), and Browserbase's [`browse`](https://github.com/browserbase/stagehand/tree/main/packages/cli) have all taken this route, and Chrome DevTools and Browser Use each ship a CLI too.

This post answers two questions: **how the CLI + skill route works and what "more efficient" actually saves; and how to choose among the three CLIs and set up their security options.**

## The CLI + skill loop

Coding agents (Claude Code, Codex, and the like) already run shell commands. The CLI route lets them drive a browser the same way:

```bash
agent-browser open example.com
agent-browser snapshot -i       # interactive elements only, each with a ref
agent-browser click @e1         # act on a ref from that snapshot
agent-browser get url           # check the result
agent-browser close
```

Three parts make it work:

- **A long-lived daemon.** The first command starts a background daemon, and every later command talks to the same browser, so cookies, tabs, and refs survive between commands. All three CLIs work this way. agent-browser and Playwright CLI shut a headless browser down after an hour without commands.
- **Snapshot + ref.** A snapshot prints the page as a compact text tree with a ref for each element (for example `- link "Learn more" [ref=e1]`); the agent reads it and picks a ref to act on (`click @e1`). A ref describes the page at the moment of the snapshot, so after navigation or a DOM change you take a new one. It's the same idea as the accessibility snapshot in the [Playwright MCP post](/posts/tech/2026-06-20-playwright-mcp-en), fetched from the command line instead.
- **A skill.** A `SKILL.md` tells the agent which commands exist and when to use them. It's read into context when needed, unlike MCP tool definitions, which sit there from the start of the conversation.

```diagram
title: MCP vs CLI + skill
desc: Top row, MCP: the coding agent calls an MCP server over the MCP protocol and the server controls the browser; tool definitions load at the start of the conversation. Bottom row, CLI: the coding agent runs shell commands, the CLI hands them to a long-lived daemon, and the daemon controls the browser; the skill is read only when needed.
caption: Both routes have a long-lived process holding the browser. The difference is two moments: when tool instructions enter the context, and whether page state comes back automatically after each step or the agent has to ask for it.
---
<svg viewBox="0 0 640 244">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">MCP</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="68" text-anchor="middle" dominant-baseline="central">coding agent</text>
  <text class="dg-sub" x="100" y="88" text-anchor="middle" dominant-baseline="central">tools load up front</text>
  <rect class="dg-box" x="244" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">MCP server</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">holds the browser</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="76" text-anchor="middle" dominant-baseline="central">Browser</text>
  <path class="dg-line" d="M176 76H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="62" text-anchor="middle" dominant-baseline="central">MCP</text>

  <text class="dg-tag" x="24" y="148" dominant-baseline="central">CLI + SKILL</text>
  <rect class="dg-box dg-box--accent" x="24" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="184" text-anchor="middle" dominant-baseline="central">coding agent</text>
  <text class="dg-sub" x="100" y="204" text-anchor="middle" dominant-baseline="central">skill read on demand</text>
  <rect class="dg-box" x="244" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="184" text-anchor="middle" dominant-baseline="central">CLI → daemon</text>
  <text class="dg-sub" x="320" y="204" text-anchor="middle" dominant-baseline="central">holds the browser</text>
  <rect class="dg-box" x="464" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="192" text-anchor="middle" dominant-baseline="central">Browser</text>
  <path class="dg-line dg-line--accent" d="M176 192H240" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M396 192H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="178" text-anchor="middle" dominant-baseline="central">shell</text>
</svg>
```

## How the three CLIs differ

| | agent-browser | Playwright CLI | browse |
|---|---|---|---|
| Maker | Vercel Labs, Apache-2.0 | Microsoft | Browserbase, MIT |
| Underneath | Rust daemon, raw CDP | playwright-core, same as Playwright MCP | Stagehand v4 (CDP) |
| Browsers | Chrome for Testing; optionally Lightpanda, Safari in the iOS Simulator, cloud providers | Chromium, Firefox, WebKit | Local Chrome or remote Browserbase |
| Ref format | `@e1` | `e15` | `@0-12` |
| How snapshots come back | Printed directly; `-i` keeps interactive elements only | Written to a yml file, path returned; `find` to search | Printed tree; `--filter`, `--max-depth` |
| Attach to your Chrome | `--cdp`, `--auto-connect` | `attach --cdp=chrome`, `attach --extension=chrome` | `--auto-connect`, `--cdp` |
| Skill | `npx skills add vercel-labs/agent-browser` | `playwright-cli install --skills` | `npx skills add browserbase/skills` |
| Security options | Credential vault, domain allowlist, action policy, confirmations, output cap | `allowedOrigins`, documented as not a security boundary | None documented |

A few differences the table can't hold:

- **agent-browser is on the "drop Playwright" side.** When it shipped in January 2026 it ran a Node.js + Playwright daemon; [0.20.0](https://github.com/vercel-labs/agent-browser/blob/main/CHANGELOG.md) in March replaced all of it with Rust talking CDP directly. That's the trade-off from the [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en): it gains a single binary with no Node.js install and gives up Playwright's cross-browser support: the early Node.js version could open Firefox, and the current list doesn't include it.
- **agent-browser's skill is just a pointer.** The installed `SKILL.md` only tells the agent to run `agent-browser skills get core`; the real instructions are printed by the CLI for its own version ([docs](https://github.com/vercel-labs/agent-browser/blob/main/docs/content/docs/skills.mdx)). Upgrading the CLI can't leave the skill describing commands that no longer match. [Chrome DevTools' CLI](https://github.com/ChromeDevTools/chrome-devtools-mcp), by contrast, asks you to reinstall the skill on every upgrade.
- **Playwright CLI and Playwright MCP are two front doors to the same engine.** The commands map almost one to one; the difference is how results come back. After each step the snapshot goes to a file, and the agent has to `grep` or read it. It keeps Playwright's testing ecosystem: `generate-locator` turns a ref into a locator such as `getByRole(...)`, and tracing is there too, which suits anyone who ends up producing test code.
- **browse is Stagehand underneath.** It pins one Stagehand version (currently 4.4.0) and switches to Browserbase's remote browsers when `BROWSERBASE_API_KEY` is set, which brings proxies, CAPTCHA handling, and persistent sessions. `browse skills add <site>` installs a site-specific skill from [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills-en), which the other two don't have.

## What "the CLI uses fewer tokens" really saves

Playwright MCP's "more token-efficient" line comes with no numbers. A CLI does save in two places: tool definitions don't have to sit in context from the start, and the whole page isn't pushed back after every step. But the second one is an interface choice, not a property of CLI versus MCP. Some measurements:

- **[Ranger](https://outpost.ranger.net/post/the-hidden-cost-of-fewer-tokens/) (published April 2026)** ran the same testing agent on Claude Sonnet 4.6 against Playwright MCP, Playwright CLI, and agent-browser on two scenarios of about 10 steps each. All three got the right verdicts. In the first scenario, the two CLIs ended with about 22k–24k tokens of context, MCP with about 50k. But the CLIs made 2–3x more tool calls, because the snapshot sits in a file that has to be read, and agent-browser needs a separate snapshot after each click. MCP finished in half the time and cost slightly less. The post doesn't give the MCP version; Playwright MCP at the time returned a full snapshot after every click, which later changed (see Gary Parker below). The author's conclusion: "What emerged is not really a comparison of MCPs vs CLIs – it's a comparison of the specific interface choices".
- **[ThinkRun](https://thinkrun.ai/blog/playwright-cli-vs-mcp) (November 2026)** compared Playwright MCP and Playwright CLI on three models, five runs per task. The CLI used 15%–37% fewer tokens on two models and anywhere from equal to 58% more on the third; "Playwright CLI was not 4x cheaper than Playwright MCP on any of three models". The official skill alone was about 6,000 tokens when it loaded.
- **[Gary Parker](https://dev.to/garyparker/playwright-mcp-vs-cli-token-cost-per-step-is-now-the-same-1kj7) (November 2026)** called both sides from a fixed script, no model involved, and found that since 0.0.69 Playwright MCP no longer puts the whole page into its navigate response; for the same steps, the two now return content within 25 tokens of each other. What's left is fixed cost: MCP's tool definitions at 4,568 tokens versus the CLI's `SKILL.md` at 3,760.
- **[Browser Use](https://browser-use.com/posts/best-mcp-servers-to-control-a-browser) (October 2026, vendor self-evaluation)** used 100 tasks and one agent to compare its own Browser Harness (a CLI where the agent writes Python against CDP directly, with no built-in snapshot), agent-browser, Playwright MCP, and Chrome DevTools MCP, one run per task. None of the score differences were significant; the author writes "Nobody won on score". Median token use varied widely (Browser Harness 2.1M, agent-browser 3.3M, Playwright MCP 4.4M, DevTools MCP 6.7M), but only medians were reported, with no confidence intervals, and each comparison changed the tool as well as the transport. The author also notes that agent-browser is a CLI too and still used 1.6x Browser Harness's tokens: "being a CLI is not the whole story".

How to read these numbers: **savings depend on the interface, not the transport.** Whether a tool returns the whole page after each step, whether a snapshot can be limited to interactive elements, and whether there's a `find`-style command that fetches only the part you need all matter more than CLI versus MCP. Saving context doesn't necessarily save time or money either; extra tool calls eat it back. If your agent does a lot in one session and you're worried about filling the context, pick a tool that doesn't push the whole page back. If you care how fast each task runs, a tool that returns state after each step means fewer detours. Compare how the version in front of you behaves, not the labels CLI and MCP.

## The more practical difference: permissions

More practical than tokens is what permissions the agent needs.

- **A CLI needs a shell.** Clients without one, like Claude Desktop or claude.ai, can only use MCP. Chrome may also fail to start inside Codex's sandbox, so it needs full shell access.
- **A shell is broader than a fixed set of tools.** MCP tool arguments are typed fields (`url`, `selector`, `text`), so the client's approval prompt shows what the agent is about to do. A CLI call is a command string; agent-browser's skill declares `allowed-tools: Bash(agent-browser:*)`, which is prefix matching: approving it also lets through `agent-browser eval`, which runs arbitrary JavaScript in the page.
- **Some see the CLI as the smaller attack surface.** [GitHub Agentic Workflows](https://github.github.com/gh-aw/blog/2026-09-01-why-playwright-cli-replaces-playwright-mcp/) removed its built-in Playwright MCP in v0.88.0 and moved to the CLI, citing tool-schema tokens and a smaller, more auditable attack surface without a separate Docker container. It published no measurements.

These vendors all still keep an MCP entrance: agent-browser has `agent-browser mcp` and Browser Use has `--cli-mcp`; Browserbase archived its self-hosted MCP server and kept only the hosted endpoint. The two routes will coexist; which one you pick depends on where your agent runs and how much access you give it.

## agent-browser's security options

The pages an agent reads are untrusted input: text on a page can tell the agent to visit another site or paste credentials (one of the cross-layer security issues listed in the [overview](/posts/ai/2026-11-18-ai-browser-automation-layers-en)). agent-browser turns several defenses into flags. [**All of them are off by default**](https://agent-browser.dev/security); you turn them on yourself:

```bash
# Run this once yourself in your own terminal, not through the agent; afterwards the agent logs in by name
echo "$PASS" | agent-browser auth save github --url https://github.com/login --username me --password-stdin
agent-browser auth login github

# Only these domains; only the action types in the policy; mark page output and cap its length
agent-browser --allowed-domains "github.com,*.github.com" \
  --action-policy ./policy.json \
  --content-boundaries --max-output 50000 \
  open https://github.com
```

`policy.json` can default to deny: `{"default": "deny", "allow": ["navigate", "snapshot", "click", "scroll", "wait", "get"]}`.

What each defense blocks and what it doesn't:

- **Credential vault**: credentials are stored encrypted with AES-256-GCM in `~/.agent-browser/auth/` and handled locally by the CLI, never passing through the daemon. As long as you ran `auth save` yourself, the model only knows the name `github`; have the agent save it and the password passes through its context.
- **Domain allowlist**: blocks navigation as well as subresources, WebSocket, EventSource, and `sendBeacon`, and disables WebRTC. The docs admit WebSocket blocking is best-effort: if `eval` is allowed, page scripts could in theory restore the original constructors. It also isn't an operating-system firewall.
- **Action policy and confirmations**: the policy is enforced by the daemon; denied actions fail immediately. For actions you'd rather gate one at a time than ban outright, `--confirm-actions eval,download` requires a human to confirm; pending confirmations auto-deny after 60 seconds.
- **Content boundaries**: wrap page output in nonce-tagged markers so the model can tell page content apart. The docs call this defense in depth that relies on the model and your orchestrator respecting the markers. `--max-output` caps the length of each output so one huge page can't fill the context.

The most important limitation: **the domain allowlist can't be used with your own browser.** From the [official docs](https://agent-browser.dev/security):

> agent-browser rejects `--allowed-domains` with `--cdp`, `--auto-connect`, `--profile`, `--restore`, `--state`, `state load`, and raw Chrome args that select profiles, restore sessions, or open startup pages because pages or saved origins may run before agent-browser can verify containment.

The reason is ordering. The allowlist depends on agent-browser installing network interception before any page script runs. When it attaches to a Chrome that's already open, or loads an old profile or state, pages inside may already be running and it can't guarantee containment, so it fails with an error instead of silently degrading.

In practice it's a choice: either use your logged-in Chrome (convenient, no allowlist), or start a clean browser, log in through the vault, and turn on the allowlist. When an agent reads unfamiliar pages unattended, pick the latter.

Playwright CLI also has `allowedOrigins` and `blockedOrigins`, but [its docs](https://github.com/microsoft/playwright-cli) state the setting "does not serve as a security boundary and does not affect redirects", so treat it as a convenience filter, not a defense. browse's docs list no equivalent settings.

## How to choose

- **Your agent has no shell (Claude Desktop, claude.ai)**: use MCP; see the [previous post](/posts/tech/2026-06-20-browser-mcp-comparison-en).
- **You have a shell; CLI or MCP?** If you want the approval prompt to show each action's arguments, or don't want to give the agent a full shell, use MCP. If sessions run long and you're worried about filling the context, or you want flags like an allowlist and action policy, use a CLI.
- **You'll end up producing Playwright tests, or need Firefox or WebKit**: Playwright CLI. Refs convert to locators, tracing is there, and it's the same engine as Playwright MCP, so switching entrances later is easy.
- **An agent reads untrusted pages unattended**: agent-browser with a clean browser, allowlist, action policy, and credential vault; don't attach your own Chrome.
- **You need Browserbase's remote browsers, proxies, CAPTCHA handling, or browse.sh's site skills**: browse.
- **You just want fewer tokens**: switching transport alone won't save much. Try commands that fetch only what's needed, like `snapshot -i` and `find`, and measure your own tasks; the context you save may be eaten by extra tool calls.

## Going deeper

- Of the three CLIs here, agent-browser and browse aren't built on Playwright. For why some teams dropped Playwright, see the [driver post](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en).
- The next post, [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills-en), covers the site-skill catalog behind the browse CLI: saving what an agent learned about a site so it doesn't have to figure it out again.

## References

- [vercel-labs/agent-browser README](https://github.com/vercel-labs/agent-browser)
- [agent-browser: Security](https://agent-browser.dev/security)
- [agent-browser: CDP mode](https://github.com/vercel-labs/agent-browser/blob/main/docs/content/docs/cdp-mode.mdx)
- [agent-browser: Skills](https://github.com/vercel-labs/agent-browser/blob/main/docs/content/docs/skills.mdx)
- [agent-browser CHANGELOG](https://github.com/vercel-labs/agent-browser/blob/main/CHANGELOG.md)
- [microsoft/playwright-cli README](https://github.com/microsoft/playwright-cli)
- [microsoft/playwright-mcp README](https://github.com/microsoft/playwright-mcp)
- [Browserbase browse CLI (stagehand/packages/cli)](https://github.com/browserbase/stagehand/tree/main/packages/cli)
- [browserbase/skills](https://github.com/browserbase/skills)
- [ChromeDevTools/chrome-devtools-mcp README](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Ranger: The Hidden Cost of Fewer Tokens](https://outpost.ranger.net/post/the-hidden-cost-of-fewer-tokens/)
- [ThinkRun: Playwright CLI vs MCP](https://thinkrun.ai/blog/playwright-cli-vs-mcp)
- [Gary Parker: Playwright MCP vs CLI: token cost per step is now the same](https://dev.to/garyparker/playwright-mcp-vs-cli-token-cost-per-step-is-now-the-same-1kj7)
- [Browser Use: Best MCP servers to control a browser](https://browser-use.com/posts/best-mcp-servers-to-control-a-browser)
- [browser-use/browser-harness README](https://github.com/browser-use/browser-harness)
- [GitHub Agentic Workflows: Why Playwright CLI replaces Playwright MCP](https://github.github.com/gh-aw/blog/2026-09-01-why-playwright-cli-replaces-playwright-mcp/)
