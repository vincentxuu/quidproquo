---
title: "anydoc: 14 Office Formats to Markdown, Firecrawl's Rust Answer"
date: 2026-08-06
category: ai
type: deep-dive
tags: [anydoc, document-processing, rust, llm, markdown, open-source]
lang: en
tldr: "Firecrawl's open-source Rust conversion library turns 14 office formats (including legacy .doc / .ppt / .xls) into GFM at a 4.4ms median — two orders of magnitude faster than LibreOffice. The trade-off: it does no OCR at all."
description: "A breakdown of anydoc's shared Document model, its 14-format coverage, how credible its LLM-judge benchmark actually is, and where its design diverges from MarkItDown."
series:
  name: "文件解析實戰"
  order: 3
draft: false
glossary:
  - term: "GFM"
    aliases: ["GitHub-Flavored Markdown"]
    definition: "GitHub's Markdown dialect, adding tables, strikethrough, task lists, and autolinks on top of standard Markdown."
    context: "GFM is anydoc's output target, because table syntax is non-negotiable for office document conversion."
    links:
      - label: "GitHub Flavored Markdown Spec"
        url: "https://github.github.com/gfm/"
  - term: "OLE Compound File"
    aliases: ["CFB", "OLE 複合文件"]
    definition: "The binary container format Microsoft Office used before 2007. `.doc`, `.ppt`, and `.xls` are all OLE files, structurally unrelated to the later OOXML (zip + XML) formats."
    context: "Most converters only handle OOXML. Legacy OLE support is one of the main differences between anydoc and MarkItDown."
---

> 🌏 [中文版](/posts/ai/2026-08-06-anydoc-rust-document-markdown)

[Firecrawl](https://github.com/firecrawl) has open-sourced [anydoc](https://github.com/firecrawl/anydoc), a Rust library that converts documents to Markdown. MIT licensed, roughly 6.2k stars, 14 supported office formats, and a median conversion time of 4.4 milliseconds.

This is a crowded space — [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en), [Docling](https://github.com/DS4SD/docling), MinerU, and Marker all have their followings. What makes anydoc worth a look is not "fast and good" marketing language, but a deliberate trade-off in a place most people assume there is no choice: **it gives up modality breadth to buy format depth and predictability**.

## One shared Document model

anydoc's conversion pipeline is a straight line:

```
document bytes → format detection → format parser → Document → GFM serializer → Markdown
```

The key is `Document` in the middle — a shared document model covering blocks, inlines, tables, footnotes, and assets. Every format parses into this model first, then **one and the same** GFM serializer renders it. The README's phrasing for this design is "one consistent output no matter which format goes in."

This is not just architectural tidiness. In practice it means escaping rules, table alignment, heading anchor generation, and footnote numbering behave identically across all 14 formats — and fixing a bug once fixes it everywhere. Tools that take the "one library per format" route (MarkItDown sits on top of pdfminer, python-docx, python-pptx, and friends, each doing its own thing) will often render the same table differently depending on whether it arrived from `.docx` or `.xlsx`.

PDF is the one exception: it bypasses the standard parser and converts directly via `pdf-inspector`.

One more detail: **format detection reads content markers, not file extensions**. A wrong extension, or bytes pulled straight from an HTTP response with no filename, changes nothing.

## 14 formats: the legacy ones are the differentiator

| Category | Extensions |
|---|---|
| Word | `.doc` `.docx` `.docm` |
| PowerPoint | `.ppt` `.pps` `.pot` `.pptx` `.pptm` `.ppsx` `.ppsm` |
| Excel | `.xls` `.xlsx` `.xlsm` `.xlsb` |
| OpenDocument | `.odt` `.ods` `.odp` |
| Other | `.rtf` `.epub` `.csv` `.pdf` |

The real differentiator is `.doc` / `.ppt` / `.xls` — the three [OLE Compound File](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/53989ce4-7b05-4f8d-829b-d08d6148375b) legacy formats — plus `.xlsb` (Excel binary workbook). Their internal structure has nothing to do with post-2007 OOXML, and most of the Python ecosystem simply skips them: MarkItDown covers 6/14, [pandoc](https://pandoc.org/) 5/14, Docling 4/14.

If your sources are enterprise document stores, government open data, or law firm archives, the share of `.doc` files will be higher than you would believe. That is anydoc's most practical value.

## The benchmark: good numbers, but read the methodology

The README ships a comparison against six competitors:

| Tool | Formats | Median time | Quality score |
|---|---|---|---|
| [anydoc](https://github.com/firecrawl/anydoc) | 14/14 | 4.4 ms | 81 |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | 1/14 | 52.5 ms | 69 |
| [markitdown](https://github.com/microsoft/markitdown) | 6/14 | 134.8 ms | 64 |
| [unstructured](https://github.com/Unstructured-IO/unstructured) | 8/14 | 572.9 ms | 62 |
| [docling](https://github.com/DS4SD/docling) | 4/14 | 513.6 ms | 57 |
| [pandoc](https://pandoc.org/) | 5/14 | 102.1 ms | 56 |
| [libreoffice](https://www.libreoffice.org/) | 12/14 | 1129.5 ms | 39 |

4.4ms against LibreOffice's 1129.5ms is a 256× gap. You will never feel that on a single file, but in an ingestion pipeline processing a hundred thousand documents it is the difference between hours and minutes.

On the quality score, the methodology is spelled out more clearly than most vendor benchmarks. The README describes an LLM judge (Claude Sonnet 5) that "compares two tools' outputs blind against ground truth: the document's first six pages, rendered to images by LibreOffice," scoring across completeness, structure, formatting, and cleanliness, over a corpus of 100 real-world documents and 481 total verdicts — and "every pair is judged twice with the outputs swapped to cancel position bias."

Blind comparison, swapped-order judging to cancel position bias, multi-dimensional scoring — these are the right design choices. But two things deserve honesty:

1. **It is a vendor self-evaluation.** The people who designed the benchmark are the people whose tool is being measured, and the choice of what to measure carries that bias.
2. **The test set is not public** (the README says it is not redistributable), so nobody can independently reproduce it.

My reading: format coverage and timing are hard facts you can trust; the quality score is directional, not a precise ranking. For an actual selection decision, running your own 20 representative documents through each tool beats any published benchmark.

## Bindings: four languages, the browser, and an Agent Skill

```bash
# CLI, no install needed
npx @firecrawl/anydoc report.docx
npx @firecrawl/anydoc slides.pptx -o slides.md
npx @firecrawl/anydoc - --format csv < data.csv
```

```js
// Node: npm install @firecrawl/anydoc
import { toMarkdown, toMarkdownBytes, toDocument } from '@firecrawl/anydoc';
const markdown = await toMarkdown('report.docx');
const fromBytes = await toMarkdownBytes(bytes);
```

```python
# Python: pip install firecrawl-anydoc
import anydoc
markdown = anydoc.to_markdown("report.docx")
document = anydoc.to_document(data)
```

```rust
// Rust: cargo add anydoc
let markdown = anydoc::to_markdown("report.docx")?;
let document = anydoc::to_document(&bytes, None)?;
```

All three language APIs present nearly the same surface: `to_markdown` / `to_markdown_bytes` / `to_document`. `to_document` returns that shared document model, which is far more useful than re-parsing a blob of Markdown if you want to do your own chunking or structure extraction — echoing the argument in [Auto-embedding on upload is a bad default](/posts/ai/2026-05-24-agentic-attachment-rag-survey-en): a parser should hand over structure rather than making downstream decisions on your behalf.

Two more delivery formats are worth noting:

**The WebAssembly build** (`@firecrawl/anydoc-wasm`) converts files locally in the browser, so nothing ever leaves the user's machine. For legal, medical, and financial contexts where documents cannot be uploaded, that is something the Python ecosystem cannot offer.

**The Agent Skill**: `npx skills add firecrawl/anydoc` installs in one line, supporting Claude Code, Codex, Cursor, and OpenCode. What the agent gets is a pure binary CLI — no Python environment, no system dependencies, no model weights to download. That is far more reliable than `pip install`-ing a pile of packages inside a sandbox.

## The limits: it explicitly does no OCR

This is the most important line to draw when choosing.

- **PDF handling is text extraction only.** Scanned and image-only PDFs produce nothing; the README states plainly that image-only PDFs require external OCR. If scanned documents are your main pain point, anydoc is not the answer — look at MinerU or something like [DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en).
- **No layout understanding.** No ML models means no multi-column reconstruction, no reading-order inference, no chart semantics. Everything Docling and unstructured do in this area, anydoc does not do at all.
- **Embedded assets are kept as bytes plus a media type**, and external images become plain Markdown links. Nothing describes image content for you.
- **Almost no tunable parameters.** The README documents no options for sheet handling, footnote style, image strategy, or anything else. Customizing behavior currently means patching the Rust source.

Error handling, by contrast, is admirably restrained — conversion only fails when "no meaningful Markdown could come out of the file," and the error codes are granular enough to route on inside a pipeline:

| Error | Meaning |
|---|---|
| `Unsupported` | Unknown format or non-convertible type |
| `Malformed` | Structurally unusable, no extractable content |
| `Encrypted` | Password-protected or encrypted |
| `ResourceLimit` | Exceeded fixed safety limits |
| `MissingPart` | A required component is absent |
| `Io` | File read failure |

## anydoc or MarkItDown

They are two answers to the same question, trading off in opposite directions:

| | anydoc | MarkItDown |
|---|---|---|
| Language / delivery | Rust, single binary, zero external deps | Python, a stack of optional extras |
| Format depth | 14 formats, including legacy OLE | Fewer office formats, mainstream OOXML |
| Modality breadth | Documents only | Image OCR, audio transcription, YouTube captions, ZIP |
| Speed | 4.4ms median | 134.8ms median |
| Output consistency | Shared Document model, identical across formats | Depends on each underlying parser library |
| OCR | None | Yes (can use Azure Document Intelligence) |

The decision is straightforward:

- **Digital-native office documents, high volume, running in containers or at the edge** → anydoc. Especially when legacy `.doc` / `.xls` files are in the mix.
- **Mixed sources with images and audio, one tool for everything** → MarkItDown. Its [Azure Document Intelligence backend](/posts/ai/2026-04-18-markitdown-intro-en) also handles complex PDFs better.
- **Precise layout preservation with JSON schema output** → Docling.
- **Using both is entirely reasonable**: anydoc as the fast path, falling back to an OCR-capable tool on `Unsupported` or empty output. The granular error codes exist precisely so you can wire it up that way.

## Overall

anydoc does not try to be a universal document processing solution. It narrows its scope hard — **digital-native office documents to Markdown** — and inside that scope pushes speed, format coverage, and output consistency to a level with few current rivals.

In an LLM pipeline that trade-off pays off. Conversion should be the most boring, least surprising stage in the pipeline: take bytes in, emit text out, no dependencies, no latency, no per-format behavioral drift. OCR and layout understanding are a different problem, worth solving with a different tool and a different budget.

It is not a MarkItDown replacement. It is the front end of that pipeline.

If you haven't yet decided which layer you need, start with the first post in this series: [The Three-Layer Ladder of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en).

## References

- [firecrawl/anydoc — GitHub](https://github.com/firecrawl/anydoc)
- [microsoft/markitdown — GitHub](https://github.com/microsoft/markitdown)
- [DS4SD/docling — GitHub](https://github.com/DS4SD/docling)
- [Unstructured-IO/unstructured — GitHub](https://github.com/Unstructured-IO/unstructured)
- [mwilliamson/mammoth.js — GitHub](https://github.com/mwilliamson/mammoth.js)
- [Pandoc — official site](https://pandoc.org/)
- [LibreOffice — official site](https://www.libreoffice.org/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [The Three-Layer Ladder of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en)
- [MarkItDown: Convert Any File to Markdown Before Feeding It to an LLM](/posts/ai/2026-04-18-markitdown-intro-en)
- [The AI Web Scraping Landscape: 34 Open Source Projects](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en)
- [Auto-embedding on upload is a bad default](/posts/ai/2026-05-24-agentic-attachment-rag-survey-en)
- [DeepSeek-OCR: Compressing Long Context Into Images](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en)
