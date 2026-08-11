---
title: "The Deterministic Extraction Layer: Solve 80% of Your PDFs With No Model At All"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-processing, document-parsing, pdf, python, open-source]
lang: en
tldr: "Digital-native PDFs already contain readable text — what's missing is structure, and heuristics can recover it. PyMuPDF, pdfplumber, pypdf, and Tika do this with zero GPU and zero inference cost. The biggest selection trap isn't accuracy; it's PyMuPDF's AGPL-3.0 license."
description: "The second rung of the document parsing ladder: how PyMuPDF / pymupdf4llm, pdfplumber, pypdf, Apache Tika, Kreuzberg, and extractous differ, which licenses will bite you, and the signals that mean you need to escalate to the parsing layer."
series:
  name: "Document Parsing in Practice"
  order: 4
draft: false
glossary:
  - term: "Text layer"
    aliases: ["文字層"]
    definition: "The character-drawing instructions actually stored inside a PDF. A PDF with a text layer lets you select and copy text; a scan contains only images and has no text layer."
    context: "Whether `pdftotext` produces output is the fastest signal for choosing between the extraction and parsing layers."
  - term: "AGPL-3.0"
    aliases: ["GNU Affero General Public License"]
    definition: "A copyleft license. If you use the software to provide a network service, your integrating code must also be released under the same license."
    context: "PyMuPDF is AGPL-3.0, which makes the best-performing option the most expensive one in a commercial SaaS setting."
---

> 🌏 [中文版](/posts/ai/2026-08-06-pdf-text-extraction-libraries)

This is the rung of the [three-layer ladder](/posts/ai/2026-08-06-document-parsing-three-layers-en) people skip most often. They see a PDF, think OCR, and go shopping for a VLM — but a digital-native PDF already has readable text. What is missing is structure, and structure can be recovered with rules.

The test is one line:

```bash
pdftotext report.pdf - | head
```

Output means a [text layer](https://pymupdf.readthedocs.io/) exists, and this layer will handle roughly eight cases in ten. No output is what sends you up a rung.

## What this layer actually does

A PDF has no internal concept of a paragraph. It stores a stream of drawing instructions: draw character `A` at coordinate (72, 480) in 11pt Times. All the text is there, but paragraph boundaries, reading order, and table borders are not.

The extraction layer's job is to **reconstruct semantic structure from that coordinate stream using heuristics**: character spacing past a threshold is a word boundary, a jump in line spacing is a paragraph break, a larger font is a heading, intersecting horizontal and vertical rules are a table.

No model, no training data, no uncertainty — run the same file a hundred times and get identical output. That determinism is undervalued in production pipelines.

## PyMuPDF: fastest option, most expensive license

[PyMuPDF](https://github.com/pymupdf/PyMuPDF) (10,414 stars, queried 2026-08-06) is the Python binding for MuPDF, C underneath, and nothing at this layer touches it for speed. It also ships `pymupdf4llm`, which emits LLM-friendly Markdown directly:

```python
import pymupdf4llm
md = pymupdf4llm.to_markdown("report.pdf")
```

One line to usable output — which is exactly why so many people skip the parsing layer entirely.

**But it is AGPL-3.0.** That is the most important sentence in this post. AGPL does not forbid commercial use, but if you use it to provide a network service, the code integrating it must be released under the same license too. Closed-source commercial use requires buying a commercial license from Artifex.

PyMuPDF's position is therefore slightly ironic: technically the best answer at this layer, yet the most expensive option in the single most common scenario — building SaaS on it. Internal tools, offline batch processing, open-source projects: fine. Closed-source SaaS: talk to legal first.

## pdfplumber: it shows you its work

[pdfplumber](https://github.com/jsvine/pdfplumber) (10,633 stars, MIT) builds on pdfminer.six. It is slower than PyMuPDF, but it does one thing nobody else does: **it exposes the coordinates of every character, line, and rectangle**.

```python
import pdfplumber
with pdfplumber.open("report.pdf") as pdf:
    page = pdf.pages[0]
    page.extract_table()
    page.chars[0]        # {'text': 'A', 'x0': 72.0, 'top': 480.2, ...}
    page.to_image().debug_tablefinder()   # draw the detected table grid
```

`debug_tablefinder()` overlays what it thinks the table borders are onto the page image. When a table extracts badly you can see exactly where the heuristic went wrong and tune it — something the parsing layer cannot offer, where a bad extraction leaves you only the option of swapping models.

**MIT licensed, no commercial concerns.** If your documents are table-heavy and debuggability matters, this is the default.

## pypdf: manipulation, not extraction

[pypdf](https://github.com/py-pdf/pypdf) (10,145 stars) is pure Python with no compiled dependencies, but its strength is **manipulation** rather than extraction — merging, splitting, rotating, encrypting, filling forms. Its text extraction is basic and structure recovery is essentially absent.

Treat it as an extraction tool and you will be disappointed; treat it as the Swiss army knife of PDF operations and it is excellent. Being pure Python is decisive in constrained environments where compiled extensions cannot be built.

## Apache Tika: not just PDF

[Apache Tika](https://github.com/apache/tika) (3,948 stars, Apache-2.0, Java) is the oldest and broadest entry here — over 1,000 formats, of which PDF is one. It is invisible infrastructure inside a great many enterprise content pipelines.

The cost is the JVM. Using it from a Python service usually means running tika-server and talking HTTP to it, which is one more process to operate. But when your input formats are genuinely unpredictable (email archives, containers, CAD, legacy formats), nothing matches Tika's coverage.

## Rust newcomers: Kreuzberg and extractous

Both aim to be "Tika in Rust," but they are in very different states.

[Kreuzberg](https://github.com/Goldziher/kreuzberg) (8,911 stars, MIT, still pushing as of 2026-08-06) has been rewritten from Python into Rust and now ships bindings for Rust, Python, Ruby, Java, Go, PHP, Elixir, C#, and TypeScript, plus a CLI, a REST API, and an MCP server. Multi-language bindings over a native binary is the same play [anydoc makes](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en).

[extractous](https://github.com/yobix-ai/extractous) (1,769 stars, Apache-2.0) heads in a similar direction, but its **`pushed_at` is stuck at 2024-12-21** (queried 2026-08-06) — nearly twenty months without a commit. Interesting design, but do not put it on the critical path of a new project.

## Selection table

Stars and licenses below are GitHub API values queried 2026-08-06:

| Tool | Stars | License | Language | Why pick it |
|---|---|---|---|---|
| [PyMuPDF](https://github.com/pymupdf/PyMuPDF) | 10,414 | **AGPL-3.0** | Python/C | Fastest; `pymupdf4llm` gives Markdown in one line |
| [pdfplumber](https://github.com/jsvine/pdfplumber) | 10,633 | MIT | Python | Tables plus visual debugging; no commercial concerns |
| [pypdf](https://github.com/py-pdf/pypdf) | 10,145 | BSD-3 family | Python | Pure Python, no compilation; manipulation not extraction |
| [Apache Tika](https://github.com/apache/tika) | 3,948 | Apache-2.0 | Java | 1,000+ formats; you carry a JVM |
| [Kreuzberg](https://github.com/Goldziher/kreuzberg) | 8,911 | MIT | Rust | Many bindings plus CLI and MCP server |
| [extractous](https://github.com/yobix-ai/extractous) | 1,769 | Apache-2.0 | Rust | ⚠️ No commits since 2024-12 |

The decision order I would follow:

1. **Building closed-source SaaS?** PyMuPDF is out (or budget for the commercial license). Start with pdfplumber.
2. **Are tables the main pain?** pdfplumber, tuned with `debug_tablefinder()`.
3. **Are inputs messier than just PDF?** Tika (if you can host a JVM) or Kreuzberg (if you want one binary).
4. **Just merging / splitting / encrypting?** pypdf. Do not use an extraction tool for manipulation work.

## Signals that you need the next layer up

Extraction-layer failure has clear symptoms. When you see these, stop tuning parameters:

- **Multi-column layouts read as interleaved nonsense.** The heuristics scan left-to-right, top-to-bottom by coordinate, so a two-column paper splices the left column's first line onto the right column's.
- **Tables lose column alignment across pages.** Nothing in the coordinate stream indicates a cell merged across a page break.
- **Formulas become scattered characters.** Superscripts, radicals, and fraction bars are just independent glyphs at the coordinate level.
- **`pdftotext` produces nothing.** That is a scan, and this layer never applied.

The first three call for the [parsing layer](/posts/ai/2026-08-06-document-parsing-three-layers-en). The fourth is an OCR problem, not an extraction problem.

## Overall

The value of this layer is not capability, it is being **cheap and predictable**. No GPU, no API bill, no cold start, no randomness — the same file always yields the same result.

The best architecture in practice treats it as the pipeline's default path: run extraction first, and use signals like "output word count too low," "columns misaligned," or "multi-column layout detected" to decide whether to escalate. Eight documents in ten take the free path, and only the two that need it pay for a model.

Skipping this layer and going straight to a VLM is the most common — and most expensive — architectural mistake I see.

## References

- [pymupdf/PyMuPDF — GitHub](https://github.com/pymupdf/PyMuPDF)
- [PyMuPDF documentation (including pymupdf4llm)](https://pymupdf.readthedocs.io/)
- [jsvine/pdfplumber — GitHub](https://github.com/jsvine/pdfplumber)
- [py-pdf/pypdf — GitHub](https://github.com/py-pdf/pypdf)
- [apache/tika — GitHub](https://github.com/apache/tika)
- [Apache Tika official site](https://tika.apache.org/)
- [Goldziher/kreuzberg — GitHub](https://github.com/Goldziher/kreuzberg)
- [yobix-ai/extractous — GitHub](https://github.com/yobix-ai/extractous)
- [The Three-Layer Ladder of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en)
- [anydoc: 14 Office Formats to Markdown](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en)
- [MarkItDown: Convert Any File to Markdown Before Feeding It to an LLM](/posts/ai/2026-04-18-markitdown-intro-en)
