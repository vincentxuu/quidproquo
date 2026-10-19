---
title: "Tool Pick｜GenOffice — Letting Agents Edit Real Word/Excel/PowerPoint Files"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that lets Claude Code, Cursor and other agents produce real Word/Excel/PowerPoint files that keep their original formatting, instead of a converted approximation"
tldr: "GenOffice is an open-source AI Office suite whose genoffice MCP server exposes 29 tools so an agent can edit real .docx/.xlsx/.pptx files directly, preserving everything it didn't touch. Install: `claude mcp add --transport stdio genoffice -- genoffice mcp`. It solves the problem of agents that can only hand back Markdown approximations, and Excel formulas that turn into dead numbers."
series:
  name: "AI Tool of the Day"
  order: 59
---

> 🌏 [中文版](/posts/daily/2026-10-19-tool-genoffice)

## Tool Info

| Item | Value |
|---|---|
| Name | GenOffice |
| Type | MCP server (plus desktop app / CLI / agent skill) |
| GitHub | [genspark-ai/genoffice](https://github.com/genspark-ai/genoffice) |
| Stars | 9,945 |
| Language | TypeScript |
| License | Apache-2.0 |
| Install | `claude mcp add --transport stdio genoffice -- genoffice mcp` |

## What Problem It Solves

Ask an agent to put together an investor deck or a report, and what comes back is usually Markdown — you paste it into PowerPoint and fix the formatting yourself. Ask it to edit an existing Word document, and the whole thing often comes back with styles, headers and tracked changes blown away, because under the hood it rewrote the entire file and converted it back. Spreadsheets make the problem obvious: the agent hands you computed numbers, not formulas, so the moment your data changes, the table is dead.

GenOffice turns every command into both a CLI call and an MCP tool — `genoffice mcp` exposes 29 tools in one go — so an agent works directly on a real `.docx`/`.xlsx`/`.pptx` file instead of generating an approximation and converting it. The core mechanism is a narrow patch: opening a file parses the original XML into a block tree, with every block anchored back to its source XML; saving only re-serializes the blocks that were actually touched, and copies everything else back byte-for-byte. That's why the file still opens cleanly in Word or Excel afterward, instead of looking right but being structurally a different document underneath. Formulas in Sheets (like `=SUM(B2:B9)`) stay live, and Slides runs a per-page `check`/`audit` step that catches layout overflow and overlap before anything gets assembled.

It's a good fit when you need a Word report you can hand straight to a non-technical colleague, an Excel analysis that has to keep its formulas, or a PowerPoint deck that's genuinely editable rather than a collage of pasted images.

## Quickstart

### Install

```bash
# 1. Download and install the GenOffice desktop app from GitHub Releases
#    (macOS dmg / Windows exe / Linux deb·rpm·AppImage) — it ships the genoffice CLI
# https://github.com/genspark-ai/genoffice/releases/latest

# 2. Register the genoffice MCP server with Claude Code
claude mcp add --transport stdio genoffice -- genoffice mcp
```

### Basic Usage

```bash
# Keeps the original formatting, only rewrites what actually changed
genoffice docs read report.docx --range 0-9 --json
genoffice docs apply report.docx --ops edits.json

# Excel formulas stay live instead of becoming pasted numbers
genoffice create --type xlsx --from table.json --out sales.xlsx

# Converts between Markdown/HTML/docx/xlsx/pptx, and to/from PDF
genoffice convert report.md --to pdf
```

### Advanced Usage

```bash
# Build a deck in stages: lock the style and outline first, check each page, then assemble
genoffice slides check deck/outline.json --json
genoffice create --type pptx --spec deck/pages --outline deck/outline.json \
  --out deck/solar-system.pptx --json
genoffice slides audit deck/solar-system.pptx --json   # checks for overflow/overlap
genoffice slides render deck/solar-system.pptx --out shots/   # one PNG per slide to review
```

## Compared to Existing Approaches

| | GenOffice MCP | LLM outputs Markdown, converted after | python-docx / openpyxl scripts |
|---|---|---|---|
| Preserves formatting of untouched parts of the file | ✅ (narrow patch) | ❌ (conversion usually loses styling) | Must handle it yourself |
| Excel formulas stay live | ✅ | ❌ (usually becomes dead numbers) | ✅, but you write it |
| Agent calls it directly, no scripting needed | ✅ (MCP tools / CLI) | Partial | ❌ requires writing Python |
| Built-in per-page layout checking | ✅ (`slides_audit`) | ❌ | Must build it yourself |
| Runs locally, files stay on-device | ✅ (only the AI call itself leaves the machine) | Depends on the tool | ✅ |

## Caveats

- **Not a lightweight npm package.** Using the MCP/CLI requires installing the full GenOffice desktop app (Electron plus a Rust xlsx sidecar), which is heavier than a tool you'd pull in with a single `npx` call — first-time setup takes a few extra minutes to download.
- **PDF-related commands need a display.** `render`, converting to PDF, and `create_pdf` all spin up a hidden GenOffice process behind the scenes; on a headless server you need a virtual display (`xvfb-run`) or these commands will hang.
- **The enterprise module ships under a different license.** The project overall is Apache-2.0, but the `ee/` directory (reserved for future enterprise features) is covered by a separate GenOffice Enterprise License — don't assume the whole repo is Apache-2.0 when mixing it into another project.

## Takeaway

It's easy to assume that an agent producing a document always ends with Markdown that gets converted into an Office format afterward. Looking closer, the real difference is which bytes actually changed — GenOffice collapses every AI edit into a narrow patch against the OOXML tree, copies back everything it didn't touch byte-for-byte, and that's what makes the saved file actually usable in Word or Excel, rather than something that looks similar on the surface while being a structurally different document underneath.

## References

- [genspark-ai/genoffice — GitHub](https://github.com/genspark-ai/genoffice)
- [GenOffice official site](https://genoffice.ai/)
- [GenOffice MCP server docs (README #10)](https://github.com/genspark-ai/genoffice#mcp-server)
- [GenOffice CLI and agent skill docs (README)](https://github.com/genspark-ai/genoffice#command-line-and-agent-skill)
- [LICENSE — Apache-2.0](https://github.com/genspark-ai/genoffice/blob/main/LICENSE)
