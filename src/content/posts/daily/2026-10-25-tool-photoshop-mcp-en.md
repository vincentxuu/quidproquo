---
title: "Tool Pick｜photoshop-mcp — Let Claude Drive Your Local Photoshop, With Every Edit a Checkpoint Away From Undo"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A newly released open-source MCP server lets Claude Code, Cursor, and Codex drive the Photoshop running on your Mac: every edit is one undoable step, a checkpoint is saved before the first change, and a session never touches the wrong document"
tldr: "photoshop-mcp is an MCP server that lets Claude (or Cursor, Codex) drive the Photoshop running on your Mac over AppleScript — layers, grading, cutouts, export. Install: `git clone` then run `./scripts/install.sh --client claude-code`. It solves the question every 'AI edits Photoshop for you' idea has to answer eventually: what happens to your original file when the agent gets it wrong — built-in checkpoints, document pinning, and step-by-step rollback."
series:
  name: "AI Tool of the Day"
  order: 64
---

> 🌏 [中文版](/posts/daily/2026-10-25-tool-photoshop-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | photoshop-mcp |
| Type | MCP server (stdio) |
| GitHub | [kathan3009/photoshop-mcp](https://github.com/kathan3009/photoshop-mcp) |
| Stars | 0 (released 2026-10-23; no community adoption on record yet as of this post) |
| Language | JavaScript (Node.js, ESM) |
| License | MIT |
| Install | `git clone https://github.com/kathan3009/photoshop-mcp.git && cd photoshop-mcp && ./scripts/install.sh --client claude-code` |

## What Problem It Solves

You ask Claude to run a batch of grading, background removal, and cropping in Photoshop. What you're actually worried about isn't whether the agent knows how to drive Photoshop — it's whether it wrecks an original PSD you never backed up, or applies an edit to the wrong document after you've switched tabs to look at something else. Most "let AI control Photoshop" projects stop at "it can call a handful of APIs" and never get to the failure modes that actually destroy real work.

photoshop-mcp bridges to the Photoshop running on your Mac over AppleScript and wraps every operation as an ExtendScript transaction: a failure rolls back automatically into a single undo step, never leaving a half-applied edit behind. More importantly, it layers on three safety mechanisms. Each MCP session pins itself to the document it first touched — even if you manually switch to another file, the agent's next call still targets the original one. Before the first edit of a session, it silently saves a history snapshot plus a layered backup copy on disk (`~/Library/Application Support/photoshop-mcp/checkpoints`, keeping the newest 20 or 7 days by default). Saving over an existing file needs an explicit `overwrite: true`, and closing an unsaved document needs `discard: true`. Before acting, tools like `ps_render` convert the canvas to an sRGB image so the agent can actually *see* the result instead of guessing at Photoshop's internal state. The README ships a table of "quirks this version of Photoshop has" — a new layer silently nesting inside a selected group, pixel-to-point conversion breaking on non-72-ppi documents — each one found and fixed while running the server through forty real documents on Photoshop 27.11.

Good fit for: photographers or designers who want an agent to run repetitive grading, cutout, cropping, and export jobs without risking the original files; also worth a look if you're curious how an MCP tool can design real safety boundaries — this one puts far more care into rollback, pinning, and verification than "it technically works."

```diagram
title: What one edit request passes through
desc: An agent's edit request first pins the target document, takes a checkpoint on first touch, then rolls back automatically to one undo step if execution fails.
caption: Simplified; omits the extra checkpoint and timeout detection around ps_exec.
step: The agent sends an edit request; the target document gets pinned first
step: If this is the document's first edit, a checkpoint is created first
step: If not, execution proceeds directly
step: The whole operation runs as a single ExtendScript transaction
step: On success, render verifies the result and returns it; on failure, it auto-rolls back to one undo step
---
<svg viewBox="0 0 640 576">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 112V144" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M376 192H428" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 236V268" data-step="3"/>
  <path class="dg-line" d="M520 216V260Q520 268 512 268H288" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 272V292" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M280 348V372" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M376 416H428" marker-end="url(#arrow-accent)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 460V492" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="196" y="60" width="168" height="52" rx="6"/>
    <text class="dg-label" x="280" y="80" text-anchor="middle" dominant-baseline="central">Pin target document</text>
    <text class="dg-sub" x="280" y="98" text-anchor="middle" dominant-baseline="central">docId pinning</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 148L376 192L280 236L184 192Z"/>
    <text class="dg-label" x="280" y="182" text-anchor="middle" dominant-baseline="central">First edit?</text>
    <text class="dg-sub" x="280" y="204" text-anchor="middle" dominant-baseline="central">of this document</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="432" y="168" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="188" text-anchor="middle" dominant-baseline="central">Create checkpoint</text>
    <text class="dg-sub" x="520" y="206" text-anchor="middle" dominant-baseline="central">snapshot + layered backup</text>
  </g>

  <circle class="dg-dot" cx="280" cy="270" r="4" data-step="2 3"/>

  <g data-step="4">
    <rect class="dg-box" x="100" y="292" width="360" height="56" rx="6"/>
    <text class="dg-label" x="280" y="312" text-anchor="middle" dominant-baseline="central">Run ExtendScript transaction</text>
    <text class="dg-sub" x="280" y="332" text-anchor="middle" dominant-baseline="central">whole op = one undo step</text>
  </g>

  <g data-step="5">
    <path class="dg-box" d="M280 372L376 416L280 460L184 416Z"/>
    <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">Succeeded?</text>
    <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">per ps_history</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="432" y="392" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="416" text-anchor="middle" dominant-baseline="central">Render + return</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="192" y="492" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="512" text-anchor="middle" dominant-baseline="central">Auto-rollback</text>
    <text class="dg-sub" x="280" y="532" text-anchor="middle" dominant-baseline="central">reverts to one undo step</text>
  </g>

  <text class="dg-edge" x="402" y="180" text-anchor="middle" dominant-baseline="central" data-step="2">Yes</text>
  <text class="dg-edge" x="290" y="256" text-anchor="start" dominant-baseline="central" data-step="3">No</text>
  <text class="dg-edge dg-text--accent" x="402" y="404" text-anchor="middle" dominant-baseline="central" data-step="5">Yes</text>
  <text class="dg-edge dg-text--warn" x="290" y="480" text-anchor="start" dominant-baseline="central" data-step="5">No</text>
</svg>
```

## Quick Start

### Install

```bash
# macOS only; requires a licensed Photoshop install and Node.js 18+
git clone https://github.com/kathan3009/photoshop-mcp.git
cd photoshop-mcp
./scripts/install.sh --client claude-code   # or claude-desktop / cursor / codex

# Restart the client, open Photoshop, and ask the agent to run ps_status
# macOS will prompt for an Automation permission — allow it
```

### Basic Usage

```bash
# Test directly with the bundled psctl CLI, no agent in the loop
psctl status                                    # docs, history, EXIF
psctl snapshot depth=2                          # layer tree with stable ids
psctl render out=/tmp/look.jpg maxSize=1200     # sRGB preview the agent can "see"
psctl adjustment type=hueSaturation \
  params='{"reds":{"saturation":25}}'           # create a hue/saturation adjustment layer
psctl history action=undo                       # roll back one step
```

The MCP tools an agent gets (`ps_status`, `ps_snapshot`, `ps_render`, `ps_adjustment`, `ps_mask`, `ps_history`, …) behave identically — you're just issuing the same commands in natural language.

### Advanced Usage

```bash
# Bundle several operations into one atomic undo step (any failure rolls back everything)
psctl batch @grade.json

# The ExtendScript escape hatch is off by default; it must be enabled explicitly
PS_MCP_ALLOW_EXEC=1 ./scripts/install.sh --client claude-code --exec
```

## Comparison with Existing Tools

Photoshop MCP integrations aren't a new idea — the community already has more mature options like [alisaitteke/photoshop-mcp](https://github.com/alisaitteke/photoshop-mcp) (128 tools, cross-platform, built-in chat UI). photoshop-mcp takes a different angle: it trades platform coverage for depth on the one failure mode that actually hurts — a wrecked file.

| | photoshop-mcp | alisaitteke/photoshop-mcp |
|---|---|---|
| Platform | macOS only | Windows + macOS |
| Tool count | ~20 (covers common editing operations) | 128 (includes one-shot "recipes") |
| Auto checkpoint before edits | ✅ (history snapshot + layered disk backup) | Relies on Photoshop's native undo |
| Document pinning (prevents wrong-file edits) | ✅ | Not documented |
| Telemetry/analytics by default | None | Anonymous usage analytics on by default (can be disabled) |
| Built-in chat UI | None — needs an MCP client | Yes (`npx ... ui`) |
| Community adoption | Just released, 0 stars | Listed on the MCP Registry, multilingual docs and contributors |

## Things to Watch For

- **Only one commit since release, 0 stars**: this project went live this week. Its CHANGELOG shows real iteration going back to 2026-10-08, but it hasn't had much community use yet — test on disposable files before trusting it with anything that matters.
- **macOS only**: it drives Photoshop over AppleScript; Windows support would need the UXP-plugin approach the author mentions as a possible future direction.
- **`ps_exec` (arbitrary ExtendScript execution) is off by default**: this is a deliberate safety boundary. Don't set `PS_MCP_ALLOW_EXEC=1` unless you fully trust the scripts being passed in.
- **Only verified against Photoshop 27.11**: other versions are untested; `ps_status` and `doctor` flag an unverified version rather than failing outright.

## Today's Takeaway

Most "let AI control some piece of software" MCP servers compete on tool count and feature coverage. photoshop-mcp took the other path: solve the easy-to-overlook, actually-fatal-in-production question of "what happens to the user's file when an edit fails" before shipping anything else. Fewer tools isn't automatically a downside — sometimes it means the author thought through the safety boundary first.

## References

- [kathan3009/photoshop-mcp — GitHub](https://github.com/kathan3009/photoshop-mcp)
- [photoshop-mcp CHANGELOG](https://github.com/kathan3009/photoshop-mcp/blob/main/CHANGELOG.md)
- [Claude AI Now Controls Photoshop via MCP Integration — emergent.sh](https://emergent.sh/news/claude-ai-now-controls-photoshop-via-mcp)
- [alisaitteke/photoshop-mcp — GitHub (cross-platform comparison)](https://github.com/alisaitteke/photoshop-mcp)
