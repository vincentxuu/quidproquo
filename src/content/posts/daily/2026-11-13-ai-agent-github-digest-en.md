---
title: "AI Agent GitHub Digest — 2026-11-13"
date: 2026-11-13
category: daily
tags: [ai-agent, github, open-source, daily, agno, pydantic-ai, human-in-the-loop, mcp]
lang: en
description: "Pinky lets an agent drive your real phone, Studsmith lets one write your Roblox game — while Agno v3.2 ships a major version bump tightening who can approve an agent's actions"
tldr: "DIYgod's Pinky lets Claude Code and other agents control a real iPhone or Android through a gateway kept separate from the agent itself; Agno v3.2 is today's biggest framework update, moving A2A to the official 1.0 protocol and rewriting the Slack interface on Bolt — both breaking changes."
series:
  name: "AI Agent GitHub Digest"
  order: 90
---

> 🌏 [中文版](/posts/daily/2026-11-13-ai-agent-github-digest)

## Today's Highlight

Today's trending repos are all extending an agent's reach into new places: Pinky lets an agent operate a real iPhone or Android, Studsmith lets one write Luau code directly inside Roblox Studio, and Download Anything lets one fetch papers and videos and turn them into Obsidian-ready notes. The framework side moved in the opposite direction on the same day — Agno v3.2 ships a major version bump that tightens who gets to approve an agent's actions: the rewritten Slack interface now defaults to letting only the person who started a run click Approve, and A2A itself was upgraded to the official 1.0 protocol to standardize how agents talk to each other. Execution scope is widening while approval gates are tightening — two signals pointing opposite ways on the same day.

```diagram
title: Four signals today: wider execution, tighter approval
desc: Three trending repos push what an agent can touch outward, while Agno v3.2 tightens who can approve its actions
caption: Illustrative grouping for this digest, not an industry-standard taxonomy
---
<svg viewBox="0 0 480 300">
  <rect class="dg-box dg-box--accent" x="16" y="16" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="36" dominant-baseline="central">Phone</text>
  <text class="dg-label" x="104" y="36" dominant-baseline="central">Real iPhone / Android</text>
  <text class="dg-sub" x="104" y="58" dominant-baseline="central">Pinky · approval gateway kept apart from the agent</text>

  <rect class="dg-box" x="16" y="80" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="100" dominant-baseline="central">Game engine</text>
  <text class="dg-label" x="104" y="100" dominant-baseline="central">Roblox Studio + Luau</text>
  <text class="dg-sub" x="104" y="122" dominant-baseline="central">Studsmith · plan → write code → diff → playtest</text>

  <rect class="dg-box" x="16" y="144" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="164" dominant-baseline="central">Archiving</text>
  <text class="dg-label" x="104" y="164" dominant-baseline="central">Download + structured notes</text>
  <text class="dg-sub" x="104" y="186" dominant-baseline="central">Download Anything · subtitles/citations/metadata alongside</text>

  <rect class="dg-box dg-box--warn" x="16" y="208" width="448" height="56" rx="6"/>
  <text class="dg-tag" x="32" y="228" dominant-baseline="central">Tighter approval</text>
  <text class="dg-label" x="104" y="228" dominant-baseline="central">A2A 1.0 + Slack Bolt</text>
  <text class="dg-sub" x="104" y="250" dominant-baseline="central">Agno v3.2 · breaking change</text>
</svg>
```

## Trending Repos

### DIYgod/pinky ⭐ 1,992 (1 week old)

[GitHub](https://github.com/DIYgod/pinky) · Go · Apache-2.0

- **What it is**: Lets Claude Code, Claude Desktop, Codex, Cursor, or any MCP-capable agent operate a real iPhone or Android phone over MCP, while you watch the screen live on your computer, approve risky steps, and take over at any time.
- **Why it's worth watching**: The approval logic is deliberately kept out of the agent's reach — risky actions (payments, transfers, trades) wait for your click, and that rule runs inside Pinky's own gateway rather than relying on a prompt telling the agent to behave; even if on-screen text tries to talk the agent into approving itself, the gateway doesn't budge. Banking, wallet, and password-manager apps are invisible to the agent by default, and the agent can't type into password or one-time-code fields. The app skips Electron entirely — the native window idles at about 70 MB of memory and 0% CPU. It's still pre-alpha; Claude Code has already run full tasks on real devices (an Android phone over USB, an iPhone on iOS 27).
- **Tech stack**: Go + native GPU rendering (MyGo, no Electron/webview) + MCP server + Android/iOS device drivers
- **Getting started**: Medium — standalone installers exist for macOS/Windows/Linux, but you still need to connect an agent under Settings › Agents, and it's pre-alpha

---

### RapidSailorFreeze/studsmith ⭐ 95 (5 days old)

[GitHub](https://github.com/RapidSailorFreeze/studsmith) · Windows app · Free

- **What it is**: An AI coding agent built specifically for Roblox Studio — describe the feature you want in plain language, and it plans, writes the Luau code, shows you a diff before applying anything, and runs its own playtest loop that reads error messages and fixes them.
- **Why it's worth watching**: Unlike a general-purpose coding agent, it narrows its scope to one vertical — Roblox game development — and gets deeper engine integration in return: it can create and arrange objects directly inside your game, every change gets its own restore point you can undo individually, and you can bring your own API key or a local model. The app isn't code-signed yet, so Windows SmartScreen throws a warning, but every release ships a SHA-256 hash so you can verify the download yourself.
- **Tech stack**: Windows desktop app + Luau code generation + Roblox Studio integration + built-in playtest loop
- **Getting started**: Low — download the zip, unzip, run `Studsmith.exe`, but Windows only for now

---

### nengong/download-anything ⭐ 221 (9 days old)

[GitHub](https://github.com/nengong/download-anything) · Python · README states MIT

- **What it is**: A downloader that doubles as a CLI and an AI Agent Skill — hand it a share link, a raw URL, a DOI, or an ISBN, and it downloads videos, articles, papers, ebooks, or cloud-drive files, then organizes the supporting material around them.
- **Why it's worth watching**: The point isn't that it can download things — it's that what comes out is immediately usable. Alongside the main file it pulls subtitles, cover art, a standalone audio track, a BibTeX citation, de-hotlinked images, and structured metadata, formatted so an AI agent can summarize it or file it straight into Obsidian. Integrity checking is thorough too: it verifies audio/video tracks and duration with `ffprobe`, and documents/archives with `pypdf`/`Pillow`/`zipfile`, so an HTML error page or a corrupted file never gets mistaken for a successful download. Installation follows the usual Agent Skill pattern — hand the repo URL to Claude Code or Codex and it installs itself.
- **Tech stack**: Python 3.10+ CLI + Claude Code/Codex Agent Skill wrapper + ffprobe/pypdf/Pillow integrity checks
- **Getting started**: Low — hand the install instructions to an agent and it clones, installs dependencies, and links the skill directory on its own

## Notable Releases

### Agno v3.2.0

[Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)

- **Key changes**: Super Agent now does the work itself instead of routing through manager members, with Platform Builder as its only member; Company OS gains Task coordination (`last_run`, API-computed `allowed_transitions`, durable attempt state) and a restricted Mini Agent dedicated to running Routines (hidden from agent discovery, MCP, and A2A); AgentOS gets database-backed homepage metrics (daily aggregates for sessions, runs, tokens, cost, and latency).
- **Breaking changes**: A2A moved onto the official `a2a-sdk` 1.x — the `/v1/message:*` and `/v1/tasks:*` routes are gone, replaced by each entity's own A2A endpoint; the Slack interface was rewritten on the Slack Bolt SDK, and by default only the person who started a run can click Approve/Deny unless they're listed in `approvers=` or mapped to the same user via `users=`; `OSManager.tool_call_limit` now defaults to 24 (was 8), and `num_history_runs` defaults to 5 (was 7).
- **What it means for you**: If you're on A2A or the Slack interface, this isn't a plain `pip install -U` — the A2A client and server need to upgrade together, Slack needs `slack_bolt>=1.29,<2` and `slack_sdk>=3.43,<4`, and your existing approver list needs a second look, or people who could approve runs before may suddenly find the button greyed out.

---

### pydantic-ai v2.68.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)

- **Key changes**: Added `RequestInput`, letting an agent ask for approval or an answer partway through a run; `AskUser` moved onto the deferred pipeline, and deferred calls now carry `kind` and `answered_by`; added `OutputTokenLimitExceeded`, so `ModelFallback` automatically retries with the next model when a response is cut off at `max_tokens`; `PromptInjectionDefender`'s semantic classification now runs as durable operations, so it works on Temporal.
- **Breaking changes**: Text in user/tool content that looks like an application frame is now treated as plain text instead of being auto-escaped, which can change the shape of existing output; sub-agent task-control events were renamed with an `Event` suffix and past-participle naming, plus new `agent_name` and `parent_task_id` fields, with the old names kept as deprecated aliases.
- **What it means for you**: If you're building a pydantic-ai agent flow that needs a human to approve something mid-run, `RequestInput` now gives you that directly instead of hand-rolling a deferred tool; code still using the old task-control event names keeps working, but it's worth switching to the new names while you're in there.

## Today's Takeaway

I used to think "what devices can an agent operate" and "how strict is its approval mechanism" were two separate technical tracks, each advancing on its own. Seeing today's updates side by side made it click: Pinky pulls approval authority entirely out of the agent and into an independent gateway, while Agno v3.2 narrows Slack approval down to "only the person who started it." Two unrelated projects, on the same day, answering the same question with different implementations — the wider an agent's execution scope gets, the harder its approval step has to be for the agent itself to route around.

## References

- [DIYgod/pinky — GitHub repo](https://github.com/DIYgod/pinky)
- [RapidSailorFreeze/studsmith — GitHub repo](https://github.com/RapidSailorFreeze/studsmith)
- [nengong/download-anything — GitHub repo](https://github.com/nengong/download-anything)
- [Agno v3.2.0 — Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.0)
- [Agno PR #11572 — Super Agent and Company OS](https://github.com/agno-agi/agno/pull/11572)
- [Agno PR #10956 — A2A v1.0 upgrade](https://github.com/agno-agi/agno/pull/10956)
- [Agno PR #11599 — Slack Bolt SDK rewrite](https://github.com/agno-agi/agno/pull/11599)
- [pydantic-ai v2.68.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.68.0)
- [pydantic-ai PR #12757 — RequestInput / AskUser deferred pipeline](https://github.com/pydantic/pydantic-ai/pull/12757)
- [pydantic-ai PR #12407 — OutputTokenLimitExceeded / ModelFallback](https://github.com/pydantic/pydantic-ai/pull/12407)
