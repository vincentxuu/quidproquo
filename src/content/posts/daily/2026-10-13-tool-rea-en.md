---
title: "Tool Pick｜REA — let an agent understand any software without its source code"
date: 2026-10-13
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that wraps Ghidra, Hopper, IDA and other reverse-engineering backends into one toolset, so an agent can ask in plain language how a feature works and get back pseudocode with evidence it can build a real implementation from"
tldr: "REA is an open-source MCP server that wraps native-binary, JS/Electron, .NET, and APK reverse-engineering backends behind one interface. Install: npx rea-agents setup. It solves the problem of wanting to build a feature you've only seen in someone else's app, with no source code to learn from."
series:
  name: "AI Tool of the Day"
  order: 53
---

> 🌏 [中文版](/posts/daily/2026-10-13-tool-rea)

## Tool Info

| Field | Value |
|---|---|
| Name | REA (Reverse Engineer Anything) |
| Type | MCP server + CLI |
| GitHub | [morluto/rea](https://github.com/morluto/rea) |
| Stars | 147,000+ (checked 2026-10-13; went from 0 to the top of GitHub trending two days running within ten days of its Oct 7 launch) |
| Language | TypeScript (Node.js) |
| License | MIT |
| Install | `npx rea-agents setup` |

## What problem it solves

You see a feature in someone else's app or website that you want in your own product, but it isn't open source. You can see what it does, not how it's built. The usual move is to open Ghidra or IDA yourself, hunt down the relevant function, and read assembly or decompiled pseudocode line by line, guessing at the logic from experience — slow, and most developers' agent workflows have no path into this at all. You end up guessing an implementation that looks roughly right.

REA wraps native-binary analysis engines (Hopper, Ghidra, IDA) together with static JavaScript/Electron parsing, .NET CIL inspection, APK decompilation, SQLite/WASM/EVM bytecode inspection, browser network capture, and a dozen other reverse-engineering capabilities behind one set of MCP tools. An agent asks in plain language how some feature in a target app works, and REA locates the relevant code and returns evidence — pseudocode, assembly, call relationships — so the agent explains the mechanism, or writes a working, testable implementation, grounded in that evidence rather than guessed from memory.

It's a good fit for building a feature a competitor already has, studying the algorithm behind an old game or piece of software with no surviving source, debugging a legacy binary you have no source for, or inspecting the behavior of an unencrypted APK. The README's own three showcases: reconstructing the sound-pan calculation in the tile-matching game DX-Ball, tracing the clipboard bridge inside Notion's Electron desktop app, and recovering the bullet-ring calculation from a 1990s PC-98 shoot-'em-up called TH04.

## Quick Start

### Install

```bash
npx rea-agents setup
```

Pick which agents to wire up interactively (Claude Code, Codex, Cursor, Gemini CLI, Grok Build, and others are supported), review the proposed configuration changes, and approve them — existing config is backed up first. Restart the agent once it's done.

### Basic usage

Once set up, just ask your agent in plain language:

```
Understand how search works in the Notes app, show me the evidence, and build a
similar feature for my project.
```

The agent calls REA's MCP tools to locate the code path behind the Notes app's search, returns the evidence it found (the relevant functions, the call chain), explains the mechanism from that evidence, and writes the corresponding implementation for your own project.

### Advanced usage

Analyze an extracted JavaScript/Electron app directory or ASAR archive directly from the CLI, no agent involved:

```bash
npx -y rea-agents@latest analyze-javascript-application /absolute/path/to/app --json
```

The JSON result lists modules, their imports, and the boundary between Electron's renderer and main process. For regular use, install it globally instead:

```bash
npm install --global rea-agents
rea --help
```

Native-binary analysis needs an existing Hopper, Ghidra, or IDA installation as the backend engine (setup can install Hopper for you, with approval).

## Compared to existing approaches

| | REA | Manually opening Ghidra/IDA | Pasting disassembly straight into an LLM |
|---|---|---|---|
| Native agent integration (MCP) | ✅ | ❌ | Manual copy-paste each time |
| Format coverage (binary / JS / .NET / APK / WASM...) | ✅ one interface for a dozen+ formats | Depends on the engine; switch tools between formats | Format-agnostic, but quality depends entirely on what you paste in |
| Returns evidence (matching code, call chain) | ✅ | You assemble it yourself | ❌ prone to plausible-sounding but fabricated explanations |
| Reverse-engineering experience required | Lowered, but you still need to understand the output | ✅ required | Almost none, but also the easiest way to get burned |
| Runs locally, target file never leaves your machine | ✅ | ✅ | Fragments go to the LLM provider |

## Things to watch out for

- **You own the legal line, REA won't draw it for you**: the project's own [DISCLAIMER.md](https://github.com/morluto/rea/blob/main/DISCLAIMER.md) is explicit — REA is built for lawful security research, incident analysis, CTFs, education, interoperability, software preservation, and analyzing software you own or are authorized to examine, and it explicitly will not help with circumventing DRM or license checks, building cheats, bypassing authentication you aren't authorized to test, or copying proprietary code and assets. Before "borrowing" a feature from someone else's app, make sure you're on the authorized or fair-use side of that line.
- **You still need to legally own the commercial engines**: deep native analysis routes through IDA Pro / Hex-Rays decompilers, Hopper, or JEB — all paid commercial tools. REA grants no license, key, or activation of its own, and cracked copies or shared keys are explicitly out of bounds.
- **Analysis results can be incomplete or wrong**: both the README and the disclaimer are upfront that decompilation, reconstruction, and AI-assisted analysis don't guarantee accuracy or completeness — check the underlying evidence (pseudocode, assembly) before trusting a consequential conclusion, rather than taking the agent's explanation at face value.
- **Some analysis has real side effects**: certain workflows actually run or interact with the target program (process capture, device operations), which can affect application state, files, or connected devices. Use an isolated environment for anything you don't trust, and review the agent's proposed plan before letting it run.

## Today's takeaway

I used to think of reverse engineering as a skill you build slowly through hands-on time in Ghidra or IDA. Seeing REA made it click that it can be repackaged as an agent workflow with a unified tool interface and a traceable evidence chain — the entry barrier drops, but verifiability doesn't, because every conclusion comes with a pseudocode snippet or call path you can go check, instead of the agent just making up a plausible-sounding story.

## References

- [morluto/rea — GitHub repo](https://github.com/morluto/rea)
- [REA README](https://raw.githubusercontent.com/morluto/rea/main/README.md)
- [rea-agents — npm package](https://www.npmjs.com/package/rea-agents)
- [REA DISCLAIMER.md — lawful-use boundaries and third-party tool licensing](https://github.com/morluto/rea/blob/main/DISCLAIMER.md)
- [Startup Fortune — An AI agent that reverse engineers any software just hit number one on GitHub](https://startupfortune.com/an-ai-agent-that-reverse-engineers-any-software-just-hit-number-one-on-github/)
