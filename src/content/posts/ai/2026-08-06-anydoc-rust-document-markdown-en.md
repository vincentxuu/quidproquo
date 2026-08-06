---
title: "anydoc: 14 Office Formats to Markdown, Firecrawl's Rust Answer"
date: 2026-08-06
category: ai
type: deep-dive
tags: [anydoc, document-processing, rust, llm, markdown, open-source]
lang: en
tldr: "Firecrawl's open-source Rust conversion library turns 14 office formats (including legacy .doc / .ppt / .xls) into GFM at a 4.7ms median — 109× faster than Docling under the same timing basis. The trade-off: it does no OCR at all."
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

[Firecrawl](https://github.com/firecrawl) has open-sourced [anydoc](https://github.com/firecrawl/anydoc), a Rust library that converts documents to Markdown. MIT licensed, 14 supported office formats, and a median conversion time of 4.7 milliseconds.

One fact up front that should shape how you read this: the repo was created on 2026-08-03 and is three days old as I write, with 746 stars (GitHub API, queried 2026-08-06). Every number here is still moving — the benchmark table changed between my first read of the README and my fact-check pass. Each figure below is timestamped; treat them as snapshots.

This is a crowded space — [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en), [Docling](https://github.com/docling-project/docling), MinerU, and Marker all have their followings. What makes anydoc worth a look is not "fast and good" marketing language, but a deliberate trade-off in a place most people assume there is no choice: **it gives up modality breadth to buy format depth and predictability**.

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

The README ships a comparison against six competitors (queried 2026-08-06):

| Tool | Formats | Median time | Docs judged | Score |
|---|---|---|---|---|
| [anydoc](https://github.com/firecrawl/anydoc) | 14/14 | 4.7 ms | 94 | 80 |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | 1/14 | 52.5 ms | 8 | 70 |
| [markitdown](https://github.com/microsoft/markitdown) | 6/14 | 134.8 ms | 33 | 65 |
| [unstructured](https://github.com/Unstructured-IO/unstructured) | 8/14 | 572.9 ms | 58 | 65 |
| [pandoc](https://pandoc.org/) | 5/14 | 102.1 ms | 34 | 57 |
| [docling](https://github.com/docling-project/docling) | 4/14 | 513.6 ms | 21 | 57 |
| [libreoffice](https://www.libreoffice.org/) | 12/14 | 1129.5 ms | 87 | 40 |

The speed gap is real, but pick your comparison carefully. The README is explicit about how timing was done:

> anydoc and the Python libraries are timed with process spawn excluded; the CLI tools include it, since that is how they are used.

So anydoc's 4.7ms and Docling's 513.6ms share a basis — both exclude process startup — and **that 109× gap is genuine**. Comparing against LibreOffice's 1129.5ms for a "240×" headline is not fair: LibreOffice and pandoc are CLI tools whose timings include process spawn. Hardware was a Ryzen 9 9950X3D.

The quality score needs more care. The methodology itself is spelled out more clearly than most vendor benchmarks: an LLM judge (Claude Sonnet 5) "compares two tools' outputs blind against ground truth: the document's first six pages, rendered to images by LibreOffice," scoring completeness, structure, formatting, and cleanliness over 100 real-world documents and 479 total verdicts, with "every pair is judged twice with the outputs swapped to cancel position bias." Blind comparison, swapped-order judging, multi-dimensional scoring — all the right choices.

But **that aggregate score column cannot be used as a ranking, and the README says so**:

> each row averages a different set of formats (mammoth's 70 is docx alone, while anydoc's 80 spans all fourteen), so the per-format table is the fair comparison

The "docs judged" column makes it concrete: anydoc was judged on 94 documents, mammoth on 8 (it only supports docx). Mammoth's 70 means "scores 70 on docx"; anydoc's 80 means "averages 80 across fourteen formats." Putting those in one column compares different things. The README includes a per-format table — that is the one to read.

Two more caveats:

1. **It is a vendor self-evaluation.** The people who designed the benchmark are the people whose tool is being measured, and the choice of formats and dimensions carries that bias.
2. **The test set is not public** (the README says it is not redistributable), so nobody can independently reproduce it.

My reading: format coverage and same-basis timings are hard facts you can trust; the aggregate score column is something even its author tells you not to use that way, so skip it. For an actual selection decision, running your own 20 representative documents through each tool beats any published benchmark.

## Bindings: three languages and the browser

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

**PDF is the exception.** The README states that PDFs take a shortcut through pdf-inspector, which emits Markdown directly — so for PDFs you use `to_markdown` / `to_markdown_bytes`, not `to_document`. Getting a structured model out of a PDF is not on the table.

There is no official one-line `npx` CLI. What the README provides is three convert scripts under `examples/`:

```bash
cargo run --release --example convert -- file.docx [-f csv] [-o out.md] [--assets dir]
node examples/convert.mjs file.docx [-f csv] [-o out.md] [--assets dir]
python examples/convert.py file.docx [-f csv] [-o out.md] [--assets dir]
```

There is also a **WebAssembly build** ([`@firecrawl/anydoc-wasm`](https://www.npmjs.com/package/@firecrawl/anydoc-wasm), also MIT) that converts files locally in the browser, so nothing ever leaves the user's machine. For legal, medical, and financial contexts where documents cannot be uploaded, that is something the Python ecosystem cannot offer.

For agent use cases, the real advantage is not whether a skill package exists but that **this is a prebuilt native binary**: the Node binding runs on the libuv thread pool without blocking the event loop, and the Python binding releases the GIL. No Python environment, no system dependencies, no model weights to download — far more reliable than `pip install`-ing a pile of packages inside a sandbox.

## The limits: it explicitly does no OCR

This is the most important line to draw when choosing.

- **PDF handling is text extraction only.** Scanned and image-only PDFs do not produce half-broken output — they **return an unsupported error**, and the README suggests routing those files to Firecrawl's hosted `/parse` endpoint for OCR instead. If scanned documents are your main pain point, anydoc itself is not the answer — look at MinerU or something like [DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en).
- **No layout understanding.** No ML models means no multi-column reconstruction, no reading-order inference, no chart semantics. Everything Docling and unstructured do in this area, anydoc does not do at all.
- **Embedded assets are kept as bytes plus a media type**, and external images become plain Markdown links. Nothing describes image content for you.
- **Almost no tunable parameters.** The README documents no options for sheet handling, footnote style, image strategy, or anything else. Customizing behavior currently means patching the Rust source.

Error handling, by contrast, is pragmatic: when in doubt it does not guess, it tells the caller this file needs a different route. Scanned PDFs returning unsupported is the best example — it turns "fast path plus OCR fallback" into branching logic you can write directly, instead of having to inspect output and decide whether it looks broken.

## anydoc or MarkItDown

They are two answers to the same question, trading off in opposite directions:

| | anydoc | MarkItDown |
|---|---|---|
| Language / delivery | Rust, single binary, zero external deps | Python, a stack of optional extras |
| Format depth | 14 formats, including legacy OLE | Fewer office formats, mainstream OOXML |
| Modality breadth | Documents only | Image OCR, audio transcription, YouTube captions, ZIP |
| Speed | 4.7ms median | 134.8ms median |
| Output consistency | Shared Document model, identical across formats | Depends on each underlying parser library |
| OCR | None | Yes (can use Azure Document Intelligence) |

The decision is straightforward:

- **Digital-native office documents, high volume, running in containers or at the edge** → anydoc. Especially when legacy `.doc` / `.xls` files are in the mix.
- **Mixed sources with images and audio, one tool for everything** → MarkItDown. Its [Azure Document Intelligence backend](/posts/ai/2026-04-18-markitdown-intro-en) also handles complex PDFs better.
- **Precise layout preservation with JSON schema output** → Docling.
- **Using both is entirely reasonable**: anydoc as the fast path, falling back to an OCR-capable tool on an unsupported error. That is exactly what the README recommends (route scanned PDFs to `/parse`).

## Overall

anydoc does not try to be a universal document processing solution. It narrows its scope hard — **digital-native office documents to Markdown** — and inside that scope pushes speed, format coverage, and output consistency to a level with few current rivals.

In an LLM pipeline that trade-off pays off. Conversion should be the most boring, least surprising stage in the pipeline: take bytes in, emit text out, no dependencies, no latency, no per-format behavioral drift. OCR and layout understanding are a different problem, worth solving with a different tool and a different budget.

It is not a MarkItDown replacement. It is the front end of that pipeline.

If you haven't yet decided which layer you need, start with the first post in this series: [The Three-Layer Ladder of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en).

## References

- [firecrawl/anydoc — GitHub](https://github.com/firecrawl/anydoc)
- [@firecrawl/anydoc — npm](https://www.npmjs.com/package/@firecrawl/anydoc)
- [@firecrawl/anydoc-wasm — npm](https://www.npmjs.com/package/@firecrawl/anydoc-wasm)
- [firecrawl-anydoc — PyPI](https://pypi.org/project/firecrawl-anydoc/)
- [anydoc — crates.io](https://crates.io/crates/anydoc)
- [microsoft/markitdown — GitHub](https://github.com/microsoft/markitdown)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
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
