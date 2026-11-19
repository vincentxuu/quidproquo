---
title: "Tool of the Day｜Copper — an AI agent that designs orderable PCBs inside KiCad"
date: 2026-11-15
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "Copper is an open-source MCP server that drives KiCad: it sources parts, routes traces, runs ERC/DRC, and exports JLCPCB-ready fab files — turning PCB design into something you can do by conversation"
tldr: "Copper is an MIT-licensed KiCad MCP server with 31 tools covering the whole PCB design pipeline, from parts search to fab-file export. Install: npx -y copper-kicad setup (KiCad 10 required first). It fixes the gap where AI coding agents can write firmware but can't touch board layout, which still means opening an EDA tool by hand."
series:
  name: "AI Tool of the Day"
  order: 79
---

> 🌏 [中文版](/posts/daily/2026-11-15-tool-copper-kicad-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | Copper (copper-kicad-mcp) |
| Type | MCP server |
| GitHub | [claynicholson/copper-kicad-mcp](https://github.com/claynicholson/copper-kicad-mcp) |
| Stars | 84 (at review time; repo created 2026-11-12) |
| Language | Python |
| License | MIT |
| Install | `npx -y copper-kicad setup` (install [KiCad 10](https://www.kicad.org/download/) first) |

## What problem it solves

Coding agents can already write code, run tests, and open pull requests — but hand one a circuit board and it stalls. Drawing the schematic, picking parts, routing traces, running electrical and design-rule checks (ERC/DRC), and exporting the Gerber files a factory like JLCPCB needs: all of that still means opening KiCad yourself and clicking through it. For hobbyists and small teams, this step demands more hard-won judgment than writing code does — swap a part that's out of stock, size trace width to the current it carries, length-match a differential pair — get any of it wrong and the board is simply dead on arrival.

Copper wires that whole KiCad pipeline up to an AI agent through MCP. Tell it "design a USB-C powered ESP32-C3 board, 30×40mm, with a status LED," and the agent works through it the way an engineer would: it connects pins by net name (`U1.PA9 → USB_DP`), never by blindly guessing coordinates; it searches LCSC and JLCPCB for parts that actually have stock and imports each one's symbol and footprint (plus a 3D model, when EasyEDA has one); it reruns ERC and DRC after every change and attaches a fix for whatever fails; it routes the board with a staged router that handles length matching, differential pairs, width classes, and copper pours; it renders the schematic, layer views, and a 3D model so it can inspect its own work; and it packages the Gerbers, drill files, BOM, and placement files JLCPCB (or PCBWay, OSH Park) expects.

Copper itself never calls a language model — it uses whatever model your AI app already talks to, and just wraps KiCad as a set of tools. It fits hobbyists who want to run an entire PCB design loop in plain language, small product teams turning around prototypes fast, and teaching contexts where students can watch an AI satisfy ERC/DRC step by step.

The loop itself is the interesting part:

```diagram
title: Copper's design loop — ERC/DRC gates every export
desc: The agent sources parts, then enters layout and auto-routing, rerunning ERC/DRC after every change. A failure sends it back to routing with a fix attached; a pass moves on to exporting fab files.
caption: Simplified; the real flow also includes rendering and repeated part swaps.
---
<svg viewBox="0 0 680 420">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 108V152" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 204V228" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn" d="M280 320V352" marker-end="url(#arrow-warn)"/>
  <path class="dg-line dg-line--accent" d="M410 276H444" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M170 382H98Q90 382 90 374V186Q90 178 98 178H166" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <g>
    <rect class="dg-box" x="170" y="56" width="220" height="52" rx="6"/>
    <text class="dg-label" x="280" y="73" text-anchor="middle" dominant-baseline="central">Source parts</text>
    <text class="dg-sub" x="280" y="93" text-anchor="middle" dominant-baseline="central">LCSC &amp; JLCPCB stock</text>
  </g>

  <g>
    <rect class="dg-box" x="170" y="152" width="220" height="52" rx="6"/>
    <text class="dg-label" x="280" y="169" text-anchor="middle" dominant-baseline="central">Layout &amp; auto-route</text>
    <text class="dg-sub" x="280" y="189" text-anchor="middle" dominant-baseline="central">trace &amp; pour routing</text>
  </g>

  <g>
    <path class="dg-box" d="M280 232L410 276L280 320L150 276Z"/>
    <text class="dg-label" x="280" y="266" text-anchor="middle" dominant-baseline="central">ERC/DRC clean?</text>
    <text class="dg-sub" x="280" y="288" text-anchor="middle" dominant-baseline="central">every change</text>
  </g>

  <g>
    <rect class="dg-box dg-box--warn" x="170" y="356" width="220" height="52" rx="6"/>
    <text class="dg-label" x="280" y="382" text-anchor="middle" dominant-baseline="central">Report error + fix</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="444" y="252" width="220" height="52" rx="6"/>
    <text class="dg-label" x="554" y="269" text-anchor="middle" dominant-baseline="central">Export fab files</text>
    <text class="dg-sub" x="554" y="289" text-anchor="middle" dominant-baseline="central">Gerber/BOM/placement</text>
  </g>

  <text class="dg-edge dg-text--warn" x="290" y="336" text-anchor="start" dominant-baseline="central">no</text>
  <text class="dg-edge" x="427" y="264" text-anchor="middle" dominant-baseline="central">yes</text>
  <text class="dg-edge dg-text--warn" x="100" y="280" text-anchor="start" dominant-baseline="central">retry</text>
</svg>
```

## Quickstart

### Install

Install [KiCad 10](https://www.kicad.org/download/) first, then pick the path for your AI app:

```bash
# Cursor / VS Code / Windsurf / Codex / Zed, etc. (Node.js 18+)
npx -y copper-kicad setup

# Claude Code
claude plugin marketplace add claynicholson/copper-kicad-mcp
claude plugin install copper@copper

# macOS / Linux one-liner
curl -LsSf https://raw.githubusercontent.com/claynicholson/copper-kicad-mcp/main/installer/install.sh | sh
```

Or add this entry to your MCP config by hand (Cursor, Claude Desktop, and Windsurf all take the same shape):

```json
{ "mcpServers": { "copper": { "command": "npx", "args": ["-y", "copper-kicad"] } } }
```

### Basic usage

Once it's installed, just ask in plain language — the agent calls Copper's 31 tools in sequence:

```
You: Design a USB-C powered ESP32-C3 board with a status LED, 30 x 40 mm

What the agent actually does:
1. Searches LCSC/JLCPCB for an ESP32-C3 module, USB-C connector and LED that are in stock, imports each symbol/footprint
2. Wires pins together by net name, not by dragging coordinates
3. Lays out the board and auto-routes it, reruns ERC/DRC, reports every error with a fix
4. Produces schematic, layer and 3D renders for you to check
5. Exports the Gerbers, drill files, BOM and placement files JLCPCB needs, zipped up
```

### Advanced usage

```bash
# Try it in a throwaway folder before touching a real project
npx -y copper-kicad setup --demo

# If something's broken, ask the doctor tool what to fix
npx -y copper-kicad doctor
```

## How it compares

| | Copper | KiCAD-MCP-Server (another community option) | tscircuit |
|---|---|---|---|
| Works natively on KiCad projects | ✅ | ✅ (mostly read/write, no auto-routing or part import) | ❌ (circuits defined as code, not native KiCad) |
| Auto-search + import in-stock parts | ✅ (live LCSC/JLCPCB stock) | ❌ | Partial (parts looked up separately) |
| Auto-routing (length match/diff pairs/pours) | ✅ | ❌ | Handled separately |
| Reruns ERC/DRC on every change | ✅ | Depends on the implementation | — |
| Exports factory-ready fab files (Gerber/BOM) | ✅ | Partial | ✅ (exports Circuit JSON/Gerber) |
| Locked to a specific AI model | ❌ (uses whatever model your AI app already connects to) | Depends on the implementation | ❌ |

## Caveats

- **macOS/Linux install paths are newer.** The README says Windows is "tested end to end," while the macOS/Linux one-line installers are new — file an issue directly if one fails.
- **It does reach outside services.** Parts search hits LCSC/JLCPCB/EasyEDA (with a jlcsearch.tscircuit.com mirror as fallback), and auto-routing downloads Freerouting plus a Java runtime (about 120MB, once). Your design files themselves aren't uploaded, and there's no telemetry.
- **It's still a young project.** The repo was created on 2026-11-12 and has just 84 stars; a low issue count doesn't mean there are no rough edges. Re-check the Gerbers and BOM yourself before actually ordering a production run.

## Today's takeaway

I'd assumed "AI doing hardware" stopped at drawing a block diagram or writing firmware, and that an actually orderable PCB still meant going back to manual work. Copper's real insight is wiring a hard feedback loop like ERC/DRC straight into the agent's tool calls — every change gets bounced back by a rule check immediately, so the agent can revise its way to "valid" the way a person does, instead of committing to one generation pass. That's a pattern that generalizes to any agent work with hard constraints — hardware, regulation, a database schema: the tool has to judge right from wrong in real time before the agent can be trusted to run the whole loop on its own.

## References

- [claynicholson/copper-kicad-mcp — GitHub](https://github.com/claynicholson/copper-kicad-mcp)
- [Copper README](https://raw.githubusercontent.com/claynicholson/copper-kicad-mcp/main/README.md)
- [coppereda.com — example boards and fab files](https://coppereda.com)
- [copper-kicad — npm package](https://www.npmjs.com/package/copper-kicad)
- [KiCad 10 official download page](https://www.kicad.org/download/)
