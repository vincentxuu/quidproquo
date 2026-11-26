---
title: "MarkItDown: Convert Any File to Markdown Before Feeding It to an LLM"
date: 2026-04-18
type: guide
category: ai
tags: [markitdown, llm, rag, document-processing, python]
lang: en
tldr: "A lightweight open-source tool from Microsoft that converts PDF, Office, images, audio, and more into Markdown — purpose-built for LLM pipelines."
description: "An introduction to Microsoft MarkItDown's design philosophy, supported formats, installation, usage, and practical applications in RAG and LLM preprocessing scenarios."
series:
  name: "Document Parsing in Practice"
  order: 2
draft: false
---

> :globe: [中文版](/posts/ai/2026-04-18-markitdown-intro)

Before feeding documents in various formats to an LLM, you always face the same problem: PDFs have layout noise, Word files have hidden styles, images contain no text, and Excel files are in binary format. MarkItDown is a Microsoft open-source Python tool that does exactly one thing — converts all these formats into unified Markdown so LLMs can read them directly.

## Design Philosophy: Built for Machines, Not Humans

MarkItDown's documentation states this upfront: its output target is not "aesthetically pleasing for human readers" but rather **machine consumption**.

This orientation drives its design choices. It doesn't try to reproduce pixel-perfect PDF layouts. Instead, it preserves **semantic structures** like headings, lists, tables, and links while discarding decorative elements. For LLMs, semantic structure is what matters — page layout is meaningless.

Compared to common alternatives:

- **PyMuPDF / pdfplumber**: Only handles PDFs, outputs plain text, and structural information is easily lost
- **python-docx**: Only handles Word documents, and you need to parse XML structures yourself
- **Unstructured.io**: Similar in capability, but focuses more on splitting unstructured text; MarkItDown is more focused on format conversion itself
- **MarkItDown**: One interface for multiple formats, with structured Markdown output

If your use case is "convert all the company's PDFs, PPTs, and Excel files into a format that can be fed to an LLM," MarkItDown saves you the hassle of finding a different parser for each format.

## Supported Formats

| Category | Formats |
|----------|---------|
| Office Documents | PDF, Word (docx), PowerPoint (pptx), Excel (xlsx/xls) |
| Web / Structured Data | HTML, CSV, JSON, XML |
| Media | Images (EXIF metadata + OCR), Audio (speech-to-text) |
| Other | ZIP archives, ePub, YouTube video subtitles |

Image and audio conversion require additional dependencies. Images use OCR or connect to an LLM for generating descriptions. Audio uses speech-to-text (requires installing the corresponding extras).

## Installation

```bash
# Full installation with support for all formats
pip install 'markitdown[all]'

# Install only the formats you need to reduce dependencies
pip install 'markitdown[pdf,docx,pptx]'
```

Supported extras include: `pdf`, `docx`, `pptx`, `xlsx`, `xls`, `outlook`, `audio-transcription`, `youtube-transcription`, `az-doc-intel`, `az-content-understanding`. Python 3.10–3.14 is required.

## Usage

### CLI

```bash
markitdown document.pdf > output.md
markitdown document.pdf -o output.md
cat document.pdf | markitdown
```

The CLI is suitable for quick testing or batch processing in shell scripts.

### Python API

Basic usage is straightforward:

```python
from markitdown import MarkItDown

md = MarkItDown()
result = md.convert("report.pdf")
print(result.text_content)
```

Connecting an LLM for image descriptions:

```python
from markitdown import MarkItDown
from openai import OpenAI

client = OpenAI()
md = MarkItDown(llm_client=client, llm_model="gpt-4o")
result = md.convert("screenshot.png")
print(result.text_content)  # Contains AI-generated image description
```

It also supports converting URLs and YouTube subtitles directly:

```python
result = md.convert("https://www.youtube.com/watch?v=xxxxx")
```

## Practical Scenarios

**RAG preprocessing** is the most typical scenario. Convert all internal company PDFs, Word documents, and PPTs into Markdown, then chunk them, generate embeddings, and store them in a vector database:

```python
from markitdown import MarkItDown
from pathlib import Path

md = MarkItDown()
for pdf in Path("./docs").glob("**/*.pdf"):
    out = pdf.with_suffix(".md")
    out.write_text(md.convert(str(pdf)).text_content, encoding="utf-8")
```

**Feeding directly to Claude**:

```python
import anthropic
from markitdown import MarkItDown

text = MarkItDown().convert("contract.docx").text_content

client = anthropic.Anthropic()
msg = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": f"Please summarize the following contract:\n\n{text}"}],
)
```

## Limitations

- **Limited effectiveness with scanned PDFs**: If a PDF consists of scanned images, the built-in converters' text extraction fails. The official `markitdown-ocr` plugin (`pip install markitdown-ocr`, enabled with `enable_plugins=True`) sends images inside PDF, DOCX, PPTX, and XLSX files to an LLM vision model you specify for OCR; without an `llm_client` it doesn't error, it silently skips OCR. If you don't want content going to an LLM, use one of the cloud Azure backends or another OCR solution
- **Complex layouts are hard to reproduce**: Multi-column layouts, nested tables, and other complex formatting may produce broken conversion results
- **Media conversion requires system dependencies**: Audio-to-text requires `ffmpeg`; OCR requires corresponding libraries

The Azure Document Intelligence backend works better for complex PDFs:

```python
md = MarkItDown(docintel_endpoint="https://<your-endpoint>.cognitiveservices.azure.com/")
```

v0.1.6 (May 2026) added an Azure Content Understanding backend (`--use-cu --cu-endpoint`), which handles audio and video as well as document layout and OCR, and writes extracted fields as YAML front matter. Both Azure backends are pay-per-call cloud APIs.

## Overall

MarkItDown has a clear positioning: a Swiss Army knife for format conversion. It doesn't do chunking, embedding, or anything beyond parsing. It solves the problem of "turning various files into something an LLM can read" well enough, then lets you decide how to handle the rest.

Good fit: batch processing of heterogeneous document formats, RAG pipeline preprocessing, quickly converting company documents into a queryable format. Not a good fit: cases requiring pixel-perfect PDF layout reproduction, or processing large volumes of scanned documents (which need a dedicated OCR solution).

## Update Log

- 2026-11-23: Added the official `markitdown-ocr` plugin, the Azure Content Understanding backend, the `az-content-understanding` extra, and the Python 3.10–3.14 requirement. v0.1.8 and v0.1.9 (September and October 2026) were mostly fixes; the rest of the post is unchanged.

## References

- [microsoft/markitdown — Microsoft Open-Source Markdown Document Conversion Tool on GitHub](https://github.com/microsoft/markitdown)
- [MarkItDown PyPI — pip install markitdown Installation Guide](https://pypi.org/project/markitdown/)
- [Anthropic Claude API — Integrating MarkItDown with LLM Document Preprocessing](https://docs.anthropic.com/en/api/getting-started)
- [Azure Document Intelligence — MarkItDown Complex PDF Processing Backend](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/overview)
- [markitdown-ocr plugin — GitHub](https://github.com/microsoft/markitdown/tree/main/packages/markitdown-ocr)
- [MarkItDown v0.1.6 release note — OCR and Content Understanding](https://github.com/microsoft/markitdown/releases/tag/v0.1.6)
- [Azure Content Understanding — Microsoft Learn](https://learn.microsoft.com/azure/ai-services/content-understanding/)
