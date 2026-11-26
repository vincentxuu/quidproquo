---
title: "Tool Pick｜catscan — read screenshot text with Apple Vision in milliseconds, catch truncation, overlap and missing translations across 61 locales"
date: 2026-11-27
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "catscan is a macOS CLI and MCP server that OCRs app screenshots and recordings with Apple's Vision framework, checking for truncated or overlapping text, untranslated strings and format mistakes — so an agent reads a short verdict instead of opening the image"
tldr: "catscan is a CLI plus MCP server that OCRs screenshots locally with Apple Vision, catching truncation, overlap, untranslated strings and format bugs across 61 locales. Install: npm install --save-dev @catscan/cli. It fixes the problem of agents burning tokens to open every screenshot just to judge whether a screen looks right."
series:
  name: "AI Tool of the Day"
  order: 91
---

> :globe: [中文版](/posts/daily/2026-11-27-tool-catscan)

## Tool Info

| Field | Value |
|---|---|
| Name | catscan |
| Type | CLI / MCP server / Playwright matcher |
| GitHub | [gatalifeltd/catscan](https://github.com/gatalifeltd/catscan) |
| Stars | 2 (checked 2026-11-27, released the day before) |
| Language | JavaScript (CLI) + Apple Vision framework |
| License | Apache-2.0 |
| Install | `npm install --save-dev @catscan/cli` |

## What Problem It Solves

Your UI tests already save a screenshot of every screen, but nobody has the time to eyeball each one for clipped text, two labels drawn on top of each other, a translation someone forgot to fill in, or a price formatted the wrong way. Letting an agent open every screenshot itself isn't cheap either: a multimodal model call for one image can run into thousands of tokens and take anywhere from one to over ten seconds, and the verdict isn't guaranteed to be the same the second time you ask.

catscan turns "look at the screenshot" into "read the screenshot." It runs OCR with Apple's Vision framework on the Neural Engine — about 25ms per image, entirely local, free — then checks what it read against your string catalogs (JSON, `.strings`, `strings.xml` are all supported), the locale the screen was taken in, and the element boxes your UI test dumped. The result is a `PASS`/`FAIL` with the exact key, line and coordinate behind it, not a picture. For the 22 languages Vision can't read well (Greek, Hebrew and others), it falls back to Tesseract; only when neither reader can decide does it hand the image to the agent's own model — and every result says which reader actually read it.

It fits teams shipping an app or game across many languages, anyone running Playwright, Maestro, XCUITest or UIAutomator who wants to catch localization and layout bugs automatically after a test run, and anyone who wants a coding agent to verify its own UI change without stuffing a full screenshot into context every time.

```diagram
title: How catscan decides who reads the screenshot text
desc: catscan tries Vision first, falls back to Tesseract if it can't read the text, and only hands the image to the agent's own model when neither reader can decide.
caption: Simplified from the official README's "When catscan cannot decide" section; details like the needs-reader exit code are left out.
---
<svg viewBox="0 0 640 568">
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 124V156" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 200H496Q504 200 504 208V280" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M280 244V276" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M280 340V372" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M376 416H496Q504 416 504 408V336" marker-end="url(#arrow-accent)"/>
  <path class="dg-line dg-line--warn" d="M280 460V492" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="280" cy="28" r="6"/>

  <rect class="dg-box" x="184" y="60" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="83" text-anchor="middle" dominant-baseline="central">Vision reads it</text>
  <text class="dg-sub" x="280" y="103" text-anchor="middle" dominant-baseline="central">built-in・free・local</text>

  <path class="dg-box" d="M280 156L376 200L280 244L184 200Z"/>
  <text class="dg-label" x="280" y="190" text-anchor="middle" dominant-baseline="central">Read OK?</text>
  <text class="dg-sub" x="280" y="212" text-anchor="middle" dominant-baseline="central">Vision</text>

  <rect class="dg-box dg-box--accent" x="432" y="284" width="180" height="48" rx="6"/>
  <text class="dg-label" x="522" y="308" text-anchor="middle" dominant-baseline="central">Return PASS／FAIL</text>

  <rect class="dg-box" x="184" y="276" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="299" text-anchor="middle" dominant-baseline="central">Tesseract reads it</text>
  <text class="dg-sub" x="280" y="319" text-anchor="middle" dominant-baseline="central">22-language fallback</text>

  <path class="dg-box" d="M280 372L376 416L280 460L184 416Z"/>
  <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">Read OK?</text>
  <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">Tesseract</text>

  <rect class="dg-box dg-box--warn" x="184" y="492" width="192" height="64" rx="6"/>
  <text class="dg-label" x="280" y="515" text-anchor="middle" dominant-baseline="central">Hand to the agent's model</text>
  <text class="dg-sub" x="280" y="535" text-anchor="middle" dominant-baseline="central">opens the image itself</text>

  <text class="dg-edge" x="436" y="188" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge" x="290" y="260" text-anchor="start" dominant-baseline="central">No</text>
  <text class="dg-edge" x="436" y="404" text-anchor="middle" dominant-baseline="central">Yes</text>
  <text class="dg-edge dg-text--warn" x="290" y="476" text-anchor="start" dominant-baseline="central">No</text>
</svg>
```

## Getting Started

### Install

```bash
npm install --save-dev @catscan/cli   # requires an Apple Silicon Mac, macOS 15+, Node 22+
npx catscan doctor                    # confirms Vision/Tesseract are available, tells you what's missing
```

### Basic usage

```bash
# Read a screenshot and see what text it recognized
npx catscan read ~/Desktop/Screenshot.png

# Check whether a string shows up on screen
npx catscan check ~/Desktop/Screenshot.png --present "Sign in"

# Batch-check a locale folder: untranslated strings, raw keys, unfilled {placeholders}
npx catscan untranslated shots/de --locale de --base locales/en.json --catalog locales/de.json

# Catch truncated or overlapping text and generate an HTML report
npx catscan truncated shots/de --locale de --boxes shots/de --report catscan-report.html
```

### Advanced usage (optional)

```bash
# Let a coding agent ask catscan directly instead of opening the screenshot itself
claude mcp add catscan -- npx @catscan/mcp
```

```ts
// Assert screen text inline in Playwright (@catscan/playwright)
await expect(page).toShowText("Checkout");
await expect(page).toHaveNoTruncation();
await expect(page).toHaveNoUntranslated();
```

## How It Compares

| | catscan | Manual screenshot review | Letting the agent's multimodal model open the image |
|---|---|---|---|
| Runs locally, screenshots never leave the machine | ✓ | ✓ | Depends on the agent/model |
| Token cost per verdict | A few dozen tokens for a PASS/FAIL | — | A full image — the README measures 36x more than catscan |
| Plugs into CI to block a commit | ✓ (exit code / JUnit / SARIF / GitHub annotations) | ✗ | Needs its own wiring |
| Language coverage | 61 locales: 38 read by Vision, 23 by the Tesseract fallback | Whatever languages the reviewer knows | No published accuracy numbers |
| Time per image (measured) | ~25ms with Vision, ~105ms with Tesseract | Tens of seconds to minutes | 1.3–15 seconds, depending on the model |

## Things to Watch

- **Apple Silicon Mac only**: macOS 15+, Node 22+. Vision framework is macOS-exclusive, so wiring this into CI means finding an Apple Silicon Mac runner (the README lists a few options); it won't run at all on Windows or Linux.
- **The accuracy numbers in the README are self-measured**: the "reproducible" set comes from synthetic images rendered with Core Text, which anyone can rerun and verify; the "study" set (real screenshots) is private and can't be reproduced independently. Treat the numbers as a starting point and measure against your own screenshots before adopting it.
- The maintainer's company (gatalife) also sells custom QA/localization consulting; the commercial-services link at the end of the README is a pitch, separate from the open-source tool itself.
- Released 2026-11-26, just one day before this post. GitHub shows only 2 stars and 0 issues — no outside users have reported problems yet. This is the newest, least-battle-tested pick in this series so far; evaluate carefully before putting it in a production pipeline.

## Today's Takeaway

Swapping "dump the whole screenshot into context and let a multimodal model look at it" for "read it locally with a dedicated reader and return a one-line PASS/FAIL with a coordinate-level reason" doesn't just save tokens — it turns an uncertain judgment call into a deterministic, replayable result. That's the same bet as yesterday's pick, Bernstein, which keeps its scheduler as plain Python that never touches an LLM: let ordinary code make the calls it can make cleanly, and only bring in a model for the part that genuinely can't be decided any other way.

## References

- [gatalifeltd/catscan — GitHub](https://github.com/gatalifeltd/catscan)
- [gatalifeltd/catscan — README](https://github.com/gatalifeltd/catscan/blob/main/README.md)
- [@catscan/cli — npm](https://www.npmjs.com/package/@catscan/cli)
- [catscan — Benchmarks](https://github.com/gatalifeltd/catscan/blob/main/docs/BENCHMARKS.md)
