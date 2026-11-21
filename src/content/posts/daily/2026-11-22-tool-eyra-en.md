---
title: "Tool of the Day: EYRA — Let Agents Read the Windows UI Tree Instead of Guessing Screen Coordinates"
date: 2026-11-22
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "EYRA is a Rust-built MCP server for Windows that reads windows as a text coordinate map via UI Automation and OCR, replacing the screenshot-and-guess approach most computer-use agents rely on"
tldr: "EYRA is a ~1.9MB Windows MCP server that lets an agent read a window's UI Automation tree, listen to system audio, and drive the mouse and keyboard. Download eyra.exe and point your MCP config at it. It solves the problem of agents burning huge amounts of tokens guessing coordinates from screenshots on every step."
series:
  name: "AI Tool of the Day"
  order: 86
---

> :globe: [中文版](/posts/daily/2026-11-22-tool-eyra)

## Tool Info

| Item | Value |
|---|---|
| Name | EYRA |
| Type | MCP server + CLI + agent skill |
| GitHub | [layer8labs8/EYRA](https://github.com/layer8labs8/EYRA) |
| Stars | 2 (repo created 2026-11-21, number as of this check) |
| Language | Rust |
| License | Apache-2.0 |
| Install | Download `eyra.exe` from the [latest release](https://github.com/layer8labs8/EYRA/releases/latest) and point your MCP config at it |

## What Problem It Solves

Getting an agent to drive native Windows programs — File Explorer, Office, an internal Electron tool — usually means the old "computer use" approach: screenshot every step, hand it to the model, and let the model guess from pixels where the button is and roughly what coordinates to click. Guess right and you're fine; guess wrong and you re-screenshot, re-guess, and burn through tens of thousands of tokens on a 20-step task just on screenshots. Coordinates also drift on multi-monitor or 150% DPI setups.

EYRA takes a lower-level approach instead: Windows UI Automation (UIA) already keeps a tree of every button, input field and checkbox on screen, with name, state and exact pixel coordinates. EYRA reads that tree directly and prints a numbered text map (`#51 inp "Repository name *" (focused) [496,333,530,32]`), so an agent can call `click(id=51)` and hit the right control without guessing. The measured numbers back up the approach: the first `see` of a window costs about the same as a screenshot (~1,137 vs ~969 tokens), but the real savings show up afterward — `see_diff` returns only what changed, usually under 40 tokens per step, and the author estimates a 20-step task using `see_diff` costs around 1.7k tokens versus 19–26k with screenshots, a 90%+ reduction. Windows without a UIA tree (games, canvases, remote desktops) fall back to OCR automatically, at the cost of latency climbing from ~22ms to ~80ms. The whole thing is a single ~1.9MB Rust binary with zero runtime dependencies — no Python, FFmpeg, Whisper or API keys, just native Windows APIs: UI Automation, WinRT OCR, WASAPI and SendInput.

```diagram
title: EYRA's local MCP architecture: Eye / Ear / Hand wrapping Windows APIs
desc: EYRA sits as a local MCP server in the middle, wrapping Windows' built-in UI Automation, WASAPI and SendInput into Eye, Ear and Hand tool groups so any MCP agent can read and control local windows directly, without screenshotting and guessing coordinates.
caption: Simplified: omits the optional HTTP bridge (`eyra serve`) and direct CLI invocation path.
---
<svg viewBox="0 0 720 420">
  <rect class="dg-zone" x="172" y="40" width="528" height="360" rx="8"/>
  <text class="dg-tag" x="188" y="62" dominant-baseline="central">WINDOWS 10/11</text>

  <path class="dg-line" d="M140 224H204" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M336 206H356Q364 206 364 198V112Q364 104 372 104H392" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M336 224H392" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M336 242H356Q364 242 364 250V336Q364 344 372 344H392" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M532 104H550Q558 104 558 112V150Q558 158 566 158H584" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M532 224H584" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M532 344H550Q558 344 558 336V298Q558 290 566 290H584" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="192" width="120" height="64" rx="6"/>
  <text class="dg-label" x="80" y="224" text-anchor="middle" dominant-baseline="central">MCP client</text>

  <rect class="dg-box dg-box--accent" x="204" y="188" width="132" height="72" rx="6"/>
  <text class="dg-label" x="270" y="214" text-anchor="middle" dominant-baseline="central">EYRA</text>
  <text class="dg-sub" x="270" y="236" text-anchor="middle" dominant-baseline="central">MCP server</text>

  <rect class="dg-box" x="392" y="76" width="140" height="56" rx="6"/>
  <text class="dg-label" x="462" y="94" text-anchor="middle" dominant-baseline="central">Eye</text>
  <text class="dg-sub" x="462" y="116" text-anchor="middle" dominant-baseline="central">UIA + OCR</text>

  <rect class="dg-box" x="392" y="196" width="140" height="56" rx="6"/>
  <text class="dg-label" x="462" y="214" text-anchor="middle" dominant-baseline="central">Ear</text>
  <text class="dg-sub" x="462" y="236" text-anchor="middle" dominant-baseline="central">WASAPI</text>

  <rect class="dg-box" x="392" y="316" width="140" height="56" rx="6"/>
  <text class="dg-label" x="462" y="334" text-anchor="middle" dominant-baseline="central">Hand</text>
  <text class="dg-sub" x="462" y="356" text-anchor="middle" dominant-baseline="central">SendInput</text>

  <rect class="dg-box" x="584" y="92" width="104" height="264" rx="6"/>
  <text class="dg-label" x="636" y="224" text-anchor="middle" dominant-baseline="central">Target window</text>

  <text class="dg-edge" x="166" y="212" text-anchor="end" dominant-baseline="central">MCP</text>
</svg>
```

Good fit: you need an agent to operate native Windows apps (Explorer, Office, internal WinForms/WPF tools) or Electron desktop apps (VS Code, Slack, Discord) without burning tokens on screenshots; you need to repeatedly watch the same window for a change (a progress bar finishing, a dialog popping up); or you want a model that accepts audio input to "listen" to system audio or the microphone before deciding what to do next. EYRA can't see anything below the rendered surface — hidden DOM, network traffic, JS state — so deep web automation still belongs to a browser-extension tool.

## Getting Started

### Install

```powershell
# Download eyra.exe from the latest release (the .zip also bundles SKILL.md, an example config and the license)
Invoke-WebRequest https://github.com/layer8labs8/EYRA/releases/latest/download/eyra.exe -OutFile eyra.exe

# Verify against the SHA256SUMS.txt published with the release
Get-FileHash .\eyra.exe -Algorithm SHA256
```

Add it to Claude Code:

```powershell
claude mcp add eyra -- C:\path\to\eyra.exe mcp
```

Claude Desktop users can download `eyra-<version>.mcpb` and double-click to install; Gemini CLI users get it in one line with `gemini extensions install https://github.com/layer8labs8/EYRA`.

### Basic Usage

```powershell
eyra windows                                        # list currently visible windows
eyra see --window Chrome --interactive-only --coords center
eyra click --id 51
eyra type "octocat" --id 49
eyra hotkey ctrl+l
```

The MCP interface exposes the same tools: `list_windows`, `see`, `see_diff`, `click`, `type_text`, `hotkey`, `scroll`, `drag` and more. The typical agent flow is one `see` to get the numbered map, then `see_diff` on every subsequent step to see only what changed.

### Advanced Usage

Expose only the observation tools, with no mouse or keyboard access at all:

```json
{
  "mcpServers": {
    "eyra": { "command": "C:\\path\\to\\eyra.exe", "args": ["mcp", "--read-only"] }
  }
}
```

Every call is logged to `%LOCALAPPDATA%\eyra\audit.jsonl` (timing, token estimate, password fields redacted automatically). To audit exactly what an agent clicked and typed afterward, that file is the full record.

## How It Compares

| | EYRA | Traditional screenshot-based computer use | pywinauto and similar UIA scripting libraries |
|---|---|---|---|
| Where coordinates come from | OS accessibility tree, exact ids/coordinates | Model guesses from screen pixels | Hand-written selectors, known in advance |
| Cost of repeated observation | `see_diff` usually under 40 tokens per step | Full screenshot every step (README measured ~1,137 tokens on a dense page) | No LLM call, no token cost, but the script has to be hand-written first |
| What it can drive | The whole Windows desktop: native apps, Electron, OCR fallback for canvas/games | Whatever the model can visually parse — in theory anything | Only apps that expose Win32/UIA; limited Electron support |
| Works across MCP hosts | Standard MCP — the same binary plugs into Gemini, Claude, Cursor, VS Code | Needs the host to natively support that tool (e.g. Claude's computer use) | Needs a custom wrapper to plug into any agent |
| Built-in safety guards | Read-only mode, failsafe corner, `Ctrl+Alt+Esc` kill switch, password masking, audit log | Depends on each host's own implementation, usually fewer | None — all on you to build |

## Things to Watch

- **Windows 10/11 only.** Mac and Linux aren't supported, and the README doesn't mention any cross-platform plans.
- **The binary isn't code-signed yet.** Windows SmartScreen will warn on first run; choose "Run anyway," and check the download against the `SHA256SUMS.txt` published with the release first.
- **Screens without a UIA tree fall back to OCR.** Games, canvases and remote desktops push latency from ~22ms to roughly 80ms, and OCR text recognition itself can be imperfect — don't expect native-app precision there.
- **This project is brand new.** Created 2026-11-21, 2 stars, 0 open issues — its long-term maintenance and community track record haven't been tested by time. Run it with `--read-only` for a while before trusting it in production.

## Today's Takeaway

Most people frame the bottleneck in computer-use agents as "can the model understand the screen." EYRA is a reminder that Windows' own accessibility tree already has that information structured — the real cost isn't understanding the screen once, it's re-understanding it on every single step. That's exactly why `see_diff` can keep repeated observation under 40 tokens: it doesn't save money on the first `see` (which costs about as much as a screenshot), it saves money on the dozen-plus steps after that, where you'd otherwise be recomputing the whole screen from scratch.

## References

- [layer8labs8/EYRA — GitHub](https://github.com/layer8labs8/EYRA)
- [EYRA README (raw)](https://raw.githubusercontent.com/layer8labs8/EYRA/main/README.md)
- [EYRA CHANGELOG](https://github.com/layer8labs8/EYRA/blob/main/CHANGELOG.md)
- [EYRA latest release (v0.3.2)](https://github.com/layer8labs8/EYRA/releases/latest)
- [Model Context Protocol official docs](https://modelcontextprotocol.io)
- [Computer use tool — Claude platform docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool)
