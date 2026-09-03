---
title: "AI Agent GitHub Digest — 2026-08-23"
date: 2026-08-23
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, mcp-server, coding-agent, computer-use-agent]
lang: en
description: "Today's theme: the community moves faster than the vendor — Bruno's community MCP server shipped two months before the official one, and opencode's star count has overtaken Anthropic's own Claude Code"
tldr: "CopilotKit/OpenBot ships an AG-UI-based 'AI coworker' framework where each agent gets its own computer, hitting 2,289 stars in a week; Bruno's official MCP server (usebruno/bruno-mcp) arrives two months after the community version (Ostico/bruno-mcp-studio); the browser-use team spins off a macOS Harness project that gives LLMs six accessibility primitives to control a Mac directly; opencode, now under Anomaly, has ~199K stars — surpassing Anthropic's Claude Code at ~142K. On the framework side, the MCP TypeScript SDK v2 splits the monolith into 8 sub-packages and follows the protocol's stateless redesign, dropping the session handshake entirely."
series:
  name: "AI Agent GitHub Digest"
  order: 8
---

> 🌏 [中文版](/posts/daily/2026-08-23-ai-agent-github-digest)

## Today's Highlights

Today's thread is "who ships faster than the vendor" — Bruno's community MCP server went live two months before the official one, and opencode (formerly under SST, now under Anomaly) has overtaken Anthropic's own Claude Code in star count. Meanwhile, the MCP TypeScript SDK quietly split its monolith into eight sub-packages mid-month, following the protocol's shift from session-based to fully stateless.

## Trending Repos

### CopilotKit/OpenBot ⭐ 2,289

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **What it is**: An open-source AI coworker framework from the CopilotKit team — each agent gets its own browser, filesystem, and toolset, connected to any frontend via the AG-UI protocol.
- **Why it matters**: Most agent frameworks treat user interaction as a chat-window add-on. OpenBot flips this by making it a protocol layer — every action goes through a decide-before-execute, log-after-execute cycle, making each step replayable and auditable. As long as the frontend speaks AG-UI (CopilotKit's Agent-User Interaction Protocol), it can plug into any conforming agent backend without framework lock-in. Hitting 2,289 stars in its first week suggests real market demand for the "AI coworker" positioning.
- **Tech stack**: TypeScript + AG-UI protocol (bidirectional event stream covering messages, tool calls, state patches, lifecycle signals)
- **Getting started**: Medium — alpha stage; protocol docs are solid but examples are still being fleshed out.

---

### Bruno MCP: Official vs Community

[Official GitHub](https://github.com/usebruno/bruno-mcp)　·　[Community GitHub](https://github.com/Ostico/bruno-mcp-studio)

- **What it is**: MCP servers that let AI agents read, write, and execute Bruno (open-source API client) `.bru` collections — but today we see two versions side by side: `usebruno/bruno-mcp` just published mid-month by the Bruno team, and `bruno-mcp-studio` by community developer Ostico, which has been live since two months ago.
- **Why it matters**: A concrete case showing that for peripheral tooling like MCP servers, the community often ships faster than the vendor. `bruno-mcp-studio` had a working version — no bru CLI dependency, behavior parity with Bruno itself — as early as 2026-06-07. The official version arrived two months later and currently has fewer stars (2) than the community version (5). The practical takeaway: don't pick an MCP server just because it's "official" — compare who solved your problem first.
- **Tech stack**: Both TypeScript; the official version emphasizes "data never leaves your machine," while the community version parses `.bru`/`.yml` files directly without relying on the CLI.
- **Getting started**: Easy — both are standard MCP servers, connectable from any MCP client.

---

### browser-use/macos-harness ⭐ 8 (just launched, growing)

[GitHub](https://github.com/browser-use/macos-harness)　·　Python　·　MIT

- **What it is**: A new project from browser-use co-founder Gregor Žunič — a deliberately thin harness that gives LLMs just six primitives (`mac.see/key/type/click/ax/script`) to control a Mac desktop, falling back to the original Browser Harness for browser tasks.
- **Why it matters**: Unlike most "computer-use agents" that rely on screenshots + coordinate clicking, this harness prioritizes the accessibility tree and AppleScript, resorting to screenshots only when necessary — theoretically more stable and more token-efficient. Published on 8/17 with only 8 stars and 1 fork, it's nowhere near "trending" scale, but the design approach is worth noting early — if validated, it could be folded back into the main project.
- **Tech stack**: Python, accessibility API + AppleScript, falls back to browser-use's Browser Harness
- **Getting started**: Medium — macOS only, requires granting accessibility permissions.

---

### anomalyco/opencode (formerly sst/opencode) ⭐ ~199,000

[GitHub](https://github.com/anomalyco/opencode)　·　TypeScript

- **What it is**: The open-source terminal coding agent opencode, formerly under SST, recently moved to the new Anomaly organization (`sst/opencode` now redirects to `anomalyco/opencode`).
- **Why it matters**: Post-move, opencode's star count (~199K) has overtaken Anthropic's own Claude Code (~142K). An unofficial, community-driven terminal coding agent outpacing the vendor's own tool in open-source popularity is a milestone worth remembering in this wave of "terminal agent" competition. (Note: star counts are changing rapidly; these are point-in-time figures at the time of verification.)
- **Tech stack**: TypeScript, native terminal UI
- **Getting started**: Easy — single CLI install.

## Notable Releases

### MCP TypeScript SDK v2 (`@modelcontextprotocol/server@2.0.0`)

[Release Notes](https://github.com/modelcontextprotocol/typescript-sdk/releases)

- **Key changes**: The former monolithic `@modelcontextprotocol/sdk` has been split into eight sub-packages (`client`, `server`, `core`, `node`, `express`, `hono`, `fastify`, `codemod`), with dual ESM and CJS builds. It also follows the new MCP protocol published on 2026-07-28, replacing the session-based design (`initialize`/`initialized` handshake, `Mcp-Session-Id` header) with a fully stateless model — no handshake, per-request headers instead, and a new `server/discover` RPC for capability discovery.
- **Breaking Changes**: Yes. Any server/client code relying on session handshake or `Mcp-Session-Id` needs to be rewritten to match the new protocol. All import paths must be updated to the new sub-package names. Licensing is also now mixed — existing code stays MIT, new contributions are Apache-2.0.
- **Impact on you**: If your MCP server or client was built with the old TS SDK, check whether you depend on session state (e.g., storing user data in a session for cross-request access) before upgrading — under the new stateless model, you'll need a different approach to maintain state. Import paths also need to be updated to match the package split.

## Today's Takeaway

I had assumed "official" releases typically lead the ecosystem, with the community filling in plugins and integrations around them. But today's three stories show the reverse — Bruno's community MCP server shipped two months before the official one, and opencode, an unofficial fork, has overtaken Anthropic's own Claude Code in stars. Where things actually converge is at the protocol layer — MCP's move from sessions to stateless is a change every MCP server and client has to reckon with, official or community alike. Competition in the tooling ecosystem seems to be shifting from "who ships the feature first" to "who keeps up with the protocol first."

## References

- [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot)
- [AG-UI Protocol](https://www.copilotkit.ai/ag-ui)
- [usebruno/bruno-mcp (official)](https://github.com/usebruno/bruno-mcp)
- [Ostico/bruno-mcp-studio (community)](https://github.com/Ostico/bruno-mcp-studio)
- [browser-use/macos-harness](https://github.com/browser-use/macos-harness)
- [anomalyco/opencode](https://github.com/anomalyco/opencode)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [MCP TypeScript SDK Releases](https://github.com/modelcontextprotocol/typescript-sdk/releases)
- [MCP Protocol 2026-07-28 Announcement](https://blog.modelcontextprotocol.io/posts/2026-07-28)
