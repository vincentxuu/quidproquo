---
title: "ADE Workspace Showdown: ADE vs Superset vs Herdr vs Orca"
date: 2026-08-26
category: ai
type: deep-dive
tags: [ade, agent-workspace, herdr, superset, claude-code]
lang: en
tldr: "Four philosophies of ADE workspaces: arul28/ADE's Brain+Lane, Superset's 100-agent IDE, Herdr's Rust-native runtime, and Kadro/Orca's pane and Fleet angles — compared in one table with a decision tree for when to pick a workspace over an Omnigent-style control plane."
description: "All called ADE, but arul28/ADE, Superset, Herdr, Kadro ADE and Orca make very different bets on Lane/worktree, parallel execution, PR review, mobile sync and licensing — contrasted with Omnigent's control plane to help you choose."
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 5
glossary:
  - term: "ADE"
    aliases: ["Agentic Development Environment"]
    definition: "以平行 worktree 與終端機為核心、讓多個 coding agent 同時跑的開發工作台。"
    definition_en: "An agentic development environment that runs multiple coding agents in parallel worktrees and terminals."
    links:
      - label: "arul28/ADE"
        url: "https://github.com/arul28/ADE"
  - term: "Lane"
    definition: "ADE 對 git worktree 的命名：一個隔離分支與工作目錄，含獨立的對話、終端機與 PR。"
    definition_en: "ADE's name for a git worktree — an isolated branch and working copy with its own chat, terminal and PR."
    links:
      - label: "ADE Lanes"
        url: "https://www.ade-app.dev/docs/lanes/overview"
  - term: "Brain"
    definition: "arul28/ADE 的常駐 daemon，擁有專案清單、同步 websocket 與執行權限。"
    definition_en: "The always-on daemon in arul28/ADE that owns the project catalog, sync websocket and execution authority."
    links:
      - label: "ADE Quickstart"
        url: "https://www.ade-app.dev/docs/quickstart"
---

> 🌏 [中文版](/posts/ai/2026-08-26-ade-workspace-showdown)

The [previous post](https://github.com/omnigent-ai/omnigent) framed [Omnigent](https://github.com/omnigent-ai/omnigent) as a **control plane** above harnesses — unifying access, governance and cross-device Sessions. This one stays on the **workspace** layer. Four projects that all call themselves an ADE — [arul28/ADE](https://github.com/arul28/ADE), [superset-sh/superset](https://github.com/superset-sh/superset), [herdrdev/herdr](https://github.com/herdrdev/herdr) and [Kadro ADE](https://kadrotools.ai/ade)/[Orca](https://github.com/stablyai/orca) — solve the same local problem (run many agents in the same repo in parallel, keep them visible, merge cleanly), but with very different abstractions. Pick the right workspace and you won't need to fight worktree conflicts with Policies.

## Why ADE deserves its own category: workspace vs control plane

Borrowing the [four-layer split from the previous post](https://codepick.dev/en/guides/meta-harness-2026/), a control plane solves "you ↔ a fleet of harnesses", a workspace solves "you ↔ a fleet of worktrees + agent processes in the same repo".

- **Omnigent**: `Runner + Server + Omnibox + Policy`, value in portability, governance and collaboration across harnesses.
- **ADE family**: `Brain/daemon + Lane/worktree + PR/diff + sync`, value in parallelism, visibility and mergeability of the local dev loop.

Simple boundary: if you need to swap Claude/Codex across vendors in one shareable Session with auditable cost and credential brokering, reach for the Omnigent control plane. If you just need several [Claude Code](https://code.claude.com/) / [Codex](https://developers.openai.com/codex) / [OpenCode](https://opencode.ai/) sessions working in the same repo at once, each on its own branch with isolated ports, a workspace gets you there faster.

## arul28/ADE: the canonical Brain + Lane

[arul28/ADE](https://github.com/arul28/ADE) ([ade-app.dev](https://www.ade-app.dev/docs)) is the clearest statement of what a "workspace" means. It is **local-first with an always-on Brain**: the Brain is a per-machine daemon that owns the project catalog, the sync websocket, and the authority to actually execute things. Four clients attach to it — Desktop (Electron), Web, Terminal (`ade code`), and iOS — plus the same `ade` CLI.

The unit of work is a **Lane**, [ADE's name for a git worktree](https://www.ade-app.dev/docs/lanes/overview): one isolated branch and working copy per task, each with its own files, chat/terminal sessions, process pool, diff and PR. Three commands tell the story:

```bash
curl -fsSL https://ade-app.dev/install.sh | sh  # install Brain, optionally Desktop
ade lanes create --name fix-checkout-flow        # one Lane = one worktree
ade lanes list --text
```

Lanes support stacking: branch from `main` or from another Lane to form child lanes (dependency chains), import an existing branch, or attach an external `git worktree`. Sync is LAN → Tailscale → relay, with the account only for discovery — LAN/SSH pairing works without one. Best as the first stop once you need 3-5 agents in parallel but haven't decided on a control plane yet.

Limits: Linux gets Brain only (no desktop app); the richest experience is macOS. Compared with control planes, there is no Policy engine / spend kernel / credential proxy — governance comes from Lane isolation and approval gates.

## superset-sh/superset: an IDE for 100 agents

[Superset](https://github.com/superset-sh/superset) ([superset.sh](https://superset.sh/), [docs.superset.sh](https://docs.superset.sh/)) turns the workspace into a full **agentic IDE**. The pitch is "Run 100+ coding agents in parallel", each task again an isolated git worktree with its own terminal, but the workspace itself is the IDE: built-in terminals, diff viewer, in-app browser, automations, and one-click handoff to [Cursor](https://cursor.com/) / VS Code.

Three differences from ADE:

1. **Scale narrative**: stable at 5-7 parallel agents today, aiming for 100 by end of 2026 ([roadmap](https://superset.sh/blog/roadmap-to-100-agents)).
2. **Many surfaces**: Desktop plus `superset` CLI, TypeScript SDK (`@superset_sh/sdk`), and an MCP server so other agents can drive the workspace.
3. **License**: source-available under [Elastic License 2.0](https://github.com/superset-sh/superset/blob/main/LICENSE.md), not OSI open source.

Coverage is broad: Claude Code, Codex, Cursor Agent, [Pi](https://github.com/badlogic/pi-mono), OpenCode, Grok and any CLI agent that runs a command. Good fit when you want parallel review and automations as IDE features.

## herdrdev/herdr: a single Rust binary as runtime

[Herdr](https://github.com/herdrdev/herdr) ([herdr.dev](https://herdr.dev/), ~32k stars, Apache 2.0) calls itself **the runtime your coding agents live on**. No IDE, no Electron — just one Rust binary: a background server that owns every terminal. Clients are whatever terminal you already use, attached via the `herdr` CLI or `herdr --remote` over SSH.

Philosophy in contrast: ADE and Superset make the workspace thick, Herdr makes the runtime durable.

- **Always running**: terminals live inside the server; close the lid, drop the network, even reboot — agents keep running and the layout comes back.
- **Blocked / working / idle**: reads every pane (plus optional integrations) and marks the one agent stuck waiting for you, so you don't poll pane by pane.
- **Agent-native API**: CLI + socket API that agents can drive — spawn panes, prompt each other, `wait until blocked` instead of blind keystrokes.

Herdr doesn't wrap your agent CLIs — Claude Code, Codex, Cursor, OpenCode keep running as before, just with their terminals owned by a persistent multiplexer. Ideal if you already live in a terminal/tmux world and want "a multiplexer that never dies + agent state".

## Kadro ADE and Orca: pane and Fleet extensions

**[Kadro ADE](https://kadrotools.ai/ade)** ([kadrotools.ai](https://kadrotools.ai/docs)) bets on **panes**: a workspace is a color-coded tab holding a grid of up to 16 panes, each a real terminal (xterm.js + WebGL, [Tauri 2 + React 19](https://kadrotools.ai/ade)). 20+ launchers, everything behind `⌘K`. Worktrees are optional; workspace/pane is the protagonist. Suited to IDE users who want a visual tiling of many agents.

**[Orca](https://github.com/stablyai/orca)** ([onorca.dev](https://www.onorca.dev/), YC-backed) extends to **Fleet**: still one isolated worktree per task, but natively wired to GitHub and Linear — browse PRs/issues in-app, open a worktree from any task, review PRs, with desktop + mobile + VPS coverage and "any CLI agent" support. Best when Linear/GitHub is already your task source and you want the workspace tightly coupled to collaboration.

Both sit at the same ADE layer as ADE/Herdr/Superset; choice comes down to whether you value "pane control" or "task → worktree wiring" more.

## Side-by-side

| Dimension | [arul28/ADE](https://github.com/arul28/ADE) | [Superset](https://github.com/superset-sh/superset) | [Herdr](https://github.com/herdrdev/herdr) | [Kadro ADE](https://kadrotools.ai/ade) / [Orca](https://github.com/stablyai/orca) |
|---|---|---|---|---|
| One-liner | Local-first canonical: Brain + Lane | Agentic IDE for 100+ agents | Rust-native persistent runtime / multiplexer | Pane-optimized workspace / Fleet with GitHub·Linear |
| Parallel unit | Lane (isolated git worktree + per-lane process pool + agent session), stackable child lanes | Workspace (isolated worktree + branch + terminal), fan-out via CLI/SDK/MCP | Workspace → Tab → Pane (pane is a real terminal) | Kadro: Workspace → Pane grid (1-16); Orca: worktree per task |
| PR / Review | Built-in diff, conflict risk and PR inside the workspace | Built-in diff viewer + open-in-editor, watch all agents | Light: rely on git/PR itself, no built-in review surface | Kadro: external git; Orca: in-app GitHub/Linear browsing & review |
| Sync & mobile | Three-tier Brain sync (LAN → Tailscale → relay) + iOS app | Remote hosts + CLI/SDK/MCP, no bundled mobile app | Server + `herdr --remote` (including Windows → Linux/macOS), no mobile app | Kadro: desktop-centric; Orca: desktop + mobile + VPS |
| Platform / License | macOS/Windows + Linux (Brain only) | macOS primary + Linux AppImage experimental, ELv2 | macOS/Linux/Windows single Rust binary, Apache 2.0 | Kadro: macOS/Windows; Orca: desktop + mobile + VPS |
| Extensibility | `ade code` / CLI service actions | SDK + MCP + Automations (cron) | Socket API + plugins + marketplace | Mostly built-in launchers + custom commands |
| Best for | Teams validating "parallel Lanes are worth it" | Teams treating parallel review as an IDE feature | Terminal/tmux natives wanting a never-die runtime | Visual tiling (Kadro) or GitHub/Linear wiring (Orca) |

> Underneath, all four are `git worktree` isolation — commit / push / PR semantics don't change. The workspace just glues worktrees, terminals and review together and handles port/env conflicts.

## When to pick a workspace vs a control plane

Two questions form the decision tree:

1. **Does governance need to be centralized across harnesses?** If you need one-line Claude/Codex swapping, cross-vendor reviewer routing, and auditable cost/credential brokering — pick an [Omnigent](https://github.com/omnigent-ai/omnigent)-style control plane. If you just need several agents in the same repo at once, a workspace is enough.
2. **Is the collaboration unit a "shareable live Session" or a "mergeable PR"?** The former (share a Session URL, teammates watch/comment/take over) is the control plane's strength; the latter (each Lane opens its own PR, review and merge inside the workspace) is the workspace's strength.

Our recommended stacking: validate the parallel dev rhythm with ADE or Herdr first, then promote proven Lane patterns onto a shared host via Omnigent's Runner, letting Policy and cross-device Sessions take over. Superset's and Orca's SDK/MCP surfaces are natural bridges for a control plane driving a workspace.

## Overall

The division is settling: control planes govern "how a fleet of harnesses is swapped and governed", workspaces handle "how many worktrees and agents run in parallel inside one repo and get merged". If you're still in the single-machine, single-repo exploration phase, pick a workspace, cut work by Lane/Workspace, and wire mobile or remote sync. When the pain shifts to "cost and permissions must be audited outside prompts", fold the workspace into Omnigent's unified Session and Policy.

Next in the series: persistent design for background agents and session collaboration (order 6).

## References

- [arul28/ADE](https://github.com/arul28/ADE) · [ADE Docs — ade-app.dev](https://www.ade-app.dev/docs) · [Lanes overview](https://www.ade-app.dev/docs/lanes/overview) · [Quickstart](https://www.ade-app.dev/docs/quickstart)
- [superset-sh/superset](https://github.com/superset-sh/superset) · [Superset](https://superset.sh/) · [Superset Docs](https://docs.superset.sh/) · [Roadmap to 100 Agents](https://superset.sh/blog/roadmap-to-100-agents)
- [herdrdev/herdr](https://github.com/herdrdev/herdr) · [herdr.dev](https://herdr.dev/) · [Herdr Docs: Concepts](https://herdr.dev/docs/concepts/) · [Supported Agents](https://herdr.dev/docs/agents/)
- [Kadro ADE](https://kadrotools.ai/ade) · [Kadro Docs: Workspaces & Panes](https://kadrotools.ai/docs/workspaces)
- [stablyai/orca](https://github.com/stablyai/orca) · [onorca.dev](https://www.onorca.dev/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent) · [Omnibox / Shared Server docs](https://omnigent.ai/docs/policies/os-sandbox)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
