---
title: "Tool Pick｜noteful-mcp — An MCP Server That Reads and Writes the iPad Handwriting App Noteful"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server lets an agent read notebooks from the iPad handwriting app Noteful and write back editable handwritten ink — not plain text, not a screenshot"
tldr: "noteful-mcp is an MCP server that lets an agent read and write notebooks in Noteful, an iPad handwriting app, writing back editable handwritten ink instead of plain text or an image. Install: `claude mcp add -s user noteful -- uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp`. It solves the problem that most note-taking MCP tools can only read plain text or a read-only screenshot, with no way to write editable handwritten content back."
series:
  name: "AI Tool of the Day"
  order: 66
---

> 🌏 [中文版](/posts/daily/2026-10-28-tool-noteful-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | noteful-mcp |
| Type | MCP server (stdio, Python) |
| GitHub | [openninoor/noteful-mcp](https://github.com/openninoor/noteful-mcp) |
| Stars | 13 (created 2026-10-26, marked beta) |
| Language | Python (needs uv, bundles Python 3.12+) |
| License | MIT (bundled fonts under the SIL Open Font License) |
| Install | `claude mcp add -s user noteful -- uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp` |

## What Problem It Solves

You take handwritten notes on an iPad with Noteful — highlighting key points in a lecture, tagging pages, circling questions with a highlighter. To an agent, all of that is stranded: an OCR-style tool might pull the text out so you can search it, but nothing writes back into the notebook itself. And if what gets written back is an image or a block of plain text, it doesn't look like something you wrote, and it can't sit on the original page as something you keep interacting with.

noteful-mcp wires Noteful's notebooks into MCP. The read side — `render_page`, `search_text`, `page_marks` — renders a page as an image, searches the handwritten and PDF text Noteful has already indexed, and finds where you highlighted or taped a page. The write side is where it actually differs: `create_notebook`, `add_pages`, and `write_on_page` don't output a screenshot or paste in a block of text — they draw real, editable handwritten ink strokes using a Markdown-like syntax with color markers (for example, `>> [coral] Systole → high pressure: muscle contracts || [sky] Diastole → low pressure: the ventricle refills`), rendered with the project's own bundled fonts. What comes out opens in Noteful as the same kind of data as a page you wrote by hand. Without a Mac, you export `.noteful` files from the iPad into a synced folder and point the server at them manually; only a live Noteful for Mac library, signed into the same Apple ID, lets the agent write something and have you see it on the iPad right away.

Good fit: active recall. You've already highlighted and tagged a notebook, and you want an agent to turn those marks into a quiz, write the quiz in ink, let you answer it by hand, then grade it and mark up the same page. Also worth a look if you're curious how far "AI writes into a handwriting format" can go — the README lays its own limits out plainly: which platform gets live sync, and when an external image model gets involved.

```diagram
title: Four steps from spotting questions to grading answers
desc: The agent reads marks already made on the page to find what to quiz you on, writes a new handwritten quiz, you answer it by hand, and the agent grades what you wrote on the page.
caption: Simplified from the example flow in noteful-mcp's README; the full tool list is longer — this keeps only the four tools tied directly to this exercise.
step: Agent reads marks already made on the notebook to find what to quiz you on
step: Writes those questions into a new, editable handwritten-ink quiz
step: You answer by hand on the iPad — this step doesn't touch the agent
step: Agent grades what you wrote on the page, adding marks and a score
---
<svg viewBox="0 0 640 368">
  <circle class="dg-dot" cx="320" cy="8" r="6" data-step="1"/>
  <path class="dg-line" d="M320 14V24" marker-end="url(#arrow)" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="120" y="24" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="43" text-anchor="middle" dominant-baseline="central">page_marks</text>
    <text class="dg-sub" x="320" y="63" text-anchor="middle" dominant-baseline="central">Finds highlighted and taped questions on the page</text>
  </g>

  <path class="dg-line" d="M320 80V112" marker-end="url(#arrow)" data-step="2"/>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="120" y="112" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="131" text-anchor="middle" dominant-baseline="central">create_notebook</text>
    <text class="dg-sub" x="320" y="151" text-anchor="middle" dominant-baseline="central">Writes a new quiz in editable ink, not a screenshot</text>
  </g>

  <path class="dg-line dg-line--dashed" d="M320 168V200" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="3">
    <rect class="dg-box dg-box--ghost" x="120" y="200" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="219" text-anchor="middle" dominant-baseline="central">You answer by hand on the iPad</text>
    <text class="dg-sub" x="320" y="239" text-anchor="middle" dominant-baseline="central">Happens inside Noteful, not through the agent</text>
  </g>

  <path class="dg-line dg-line--dashed" d="M320 256V288" marker-end="url(#arrow)" data-step="4"/>

  <g data-step="4">
    <rect class="dg-box" x="120" y="288" width="400" height="56" rx="6"/>
    <text class="dg-label" x="320" y="307" text-anchor="middle" dominant-baseline="central">write_on_page</text>
    <text class="dg-sub" x="320" y="327" text-anchor="middle" dominant-baseline="central">Grades: ticks, crosses, circled marks, and a score</text>
  </g>
</svg>
```

## Quick Start

### Install

```bash
# Requires uv (bundles its own Python; README specifies 3.12+)
claude mcp add -s user noteful -- uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp

# Health check: see what Noteful data the server can actually reach
uvx --from git+https://github.com/openninoor/noteful-mcp noteful-mcp doctor
```

Live-library access needs an Apple silicon Mac signed into Noteful for Mac with the same Apple ID. Otherwise, export `.noteful` files from the iPad into a folder that syncs, and point the server at it with the `NOTEFUL_ROOTS` environment variable.

### Basic Usage

Tell the agent, for example:

> Look at the questions I highlighted and tagged in my "Cardiac Physiology" notebook, and write me a short quiz in the same handwriting style as my lecture notes.

The agent calls `page_marks` to find the marked passages, then `create_notebook` to write the quiz using color-marked Markdown:

```markdown
# Cardiac Physiology · Quiz
>> [coral] Systole → high pressure: muscle **contracts** || [sky] Diastole → low pressure: the ventricle **refills**
1. Which heart valve opens during systole?
2. Draw the four main structures of the cardiac conduction system, numbered in order.
```

The finished quiz opens in Noteful as editable ink. You answer it by hand on the iPad, then have the agent call `write_on_page` to grade it and add a score.

### Advanced Usage (optional)

```bash
# Let an image model sketch a page first, then have the server redraw it as Noteful ink
# Needs your own Google AI Studio key or Vertex AI project
export GEMINI_API_KEY="your-key"
```

`design_mockup` produces a page sketch first, `mockup_grid` overlays a pixel grid to pin down positions, and `design_page` redraws the matching layout in ink. The README states that only the page's text description is sent to Google for this step — nothing else leaves your machine.

## How It Compares

| | noteful-mcp | goodnotes-mcp (withsivram) | Goodnotes official remote MCP |
|---|---|---|---|
| Platform | iPad app Noteful; live library on Mac, manual export elsewhere | macOS only (reads local SQLite) | Cloud-hosted endpoint, reachable from any client |
| Reading | Page rendering, OCR/PDF text search, highlight and tape mark detection | GoodNotes OCR text search (read-only) | No documented tool for reading existing notes |
| Writing | Editable handwritten ink (real strokes, not an image) | Barely writes anything, beyond its own processing-state file | Formatted text / interactive widgets, not ink strokes |
| Needs a cloud account | No — runs locally; only the optional mockup feature calls Google | No | Yes — connects to Goodnotes' hosted MCP endpoint |
| Status | Beta, solo project, 13 stars | 1 star, solo project | Officially maintained |

The other common path, like apple-notes-mcp, widens the search to the OCR'd handwriting text already inside Apple Notes — that solves "can I find it," not "can I write it back." noteful-mcp is one of the few tools actually tackling the write-back half.

## Things to Watch For

- **Beta, and the format is reverse-engineered.** The README says so directly: Noteful's format was reverse-engineered, so an app update could break reading or writing at any time, with no official API guaranteeing compatibility.
- **Live sync only works on an Apple silicon Mac.** Without one (or on an Intel Mac, Windows, or Linux), you're stuck exporting `.noteful` files from the iPad by hand and re-exporting after every change — not actually live.
- **Mockup generation sends your page description to Google.** This only happens if you enable the optional `design_mockup` path; the README states "only the page content you describe is sent, nothing else" — but if your notes are sensitive, that's reason enough to leave this path off.
- **Unofficial project.** The README states it isn't affiliated with or endorsed by Noteful, and the study-notes look was adapted from a specific third-party video. Long-term maintenance is an open question.

## Today's Takeaway

Most "AI meets notes" integrations hit the same wall: the read side gets OCR-to-text right, but the write side tops out at pasting back plain text or a rendered image — and that never looks like the notebook you actually wrote. noteful-mcp picks the harder path: it makes the write side real, editable handwritten ink, not a picture pretending to be handwriting. That turns an agent from "reads your notes and generates a text answer" into "can actually put pen to your notebook" — and the gap between those two isn't about feature count, it's about whether what comes out is the same kind of data you can keep writing on and editing yourself.

## References

- [openninoor/noteful-mcp — GitHub](https://github.com/openninoor/noteful-mcp)
- [noteful-mcp README (raw)](https://raw.githubusercontent.com/openninoor/noteful-mcp/main/README.md)
- [withsivram/goodnotes-mcp — GitHub (comparison target, read-only)](https://github.com/withsivram/goodnotes-mcp)
- [Goodnotes official Remote MCP Server — mcpservers.org (comparison target)](https://mcpservers.org/remote-mcp-servers/goodnotes)
- [xiaofeng-han/apple-notes-mcp — GitHub (the OCR-search alternative mentioned above)](https://github.com/xiaofeng-han/apple-notes-mcp)
