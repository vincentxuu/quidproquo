---
title: "Parsing and Cleaning: What Quietly Breaks When PDFs, Tables and Scans Become Text"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, document-parsing, ocr, tables]
lang: en
tldr: "When documents become text, what breaks usually doesn't throw an error: multi-column paragraphs joined in the wrong order, merged table cells flattened, headers and footers mixed into the body, OCR typos in scans, images and strikethroughs gone. High OCR accuracy doesn't mean good RAG either: in one study, documents with strikethroughs and color marks scored 82.9% on OCR but only 52.8% on question answering. Chunking matters more than switching tools: from the same conversion output, chunking by heading hierarchy with the heading path attached raised table questions from 66.6% to 99.8%. So always spot-check parsed output against the originals for these failure types."
description: "Building Knowledge Bases, order 13: six common ways document-to-text conversion breaks and the evidence, what content can be ignored, why OCR scores and RAG results disagree, why structure and chunking matter more than the tool, what an intermediate format loses, research on skipping parsing and reading page images, and a spot-check method."
series:
  name: "Building Knowledge Bases"
  order: 13
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-parsing-cleaning)

A product spec PDF goes into the knowledge base, and the parser reports no errors. Someone asks, "How much storage does the Team plan include?" The AI answers, "The document doesn't say." In the original table, the Pro and Team plans share one cell reading "1 TB", a merged cell spanning two rows. After conversion, only the first row of the merged cell has a value, and the Team plan's cell is blank.

This is the third post in the AI part of "Building Knowledge Bases". [Order 12](/posts/learning/2026-10-22-ai-kb-source-inventory-en) decided which documents to collect; this post covers what quietly breaks when those documents are turned into text. Personal data and instructions hidden in documents are order 14, and how to chunk is order 16. This post doesn't rank tools; it only cites research on what tends to break. By the end you'll be able to spot-check parsed output and find these failures.

## Six common failures

Parsers fall roughly into three kinds: ones that only extract the text layer (e.g. PDFLoader), ones that run layout analysis first (e.g. Docling, or cloud services like Document Intelligence), and vision-language models that read the page directly. Layout analysis also identifies headings, tables, headers and footers and images, and most of the failures below either happen or are avoided at that step.

**1. Multi-column paragraphs joined in the wrong order.** For two-column reports, slides and newspapers, converting to text means deciding which column to read first. OmniDocBench compared many parsing tools in 2025 and found that every model lost accuracy noticeably on multi-column and complex layouts; some tools wrongly merged two columns' text into one paragraph ([Ouyang et al. 2025](https://arxiv.org/abs/2412.07626)).

**2. Tables flattened.** What breaks most easily in tables is merged cells. Docling's documentation is explicit: Markdown tables have no syntax for spans, so when exporting to Markdown, a merged cell's text is written only in its first position and every other cell it covers comes out empty ([Docling: Serialization](https://docling-project.github.io/docling/concepts/serialization/)). Its advice is to export to HTML or JSON instead if anything downstream depends on accurate table structure. OmniDocBench also found that rotated tables defeat almost every tool.

**3. Headers, footers and page numbers mixed into the body.** A line repeated on every page, such as "Confidential, do not distribute, page 3", gets inserted mid-sentence or chunked piece by piece into the index. Azure's RAG guide lists elements to decide about before chunking: tables of contents, headers and footers, copyright notices and disclaimers, footnotes, watermarks, and comments ([Azure: RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)). The point is to decide case by case, not to delete them all: a header carrying the document's name and version can be useful context.

**4. OCR typos in scans.** OCR misreads characters, sometimes in ways that change the meaning. Working with Portuguese Army personnel documents, Santos and colleagues found in 2026 that the Portuguese letter "ç" is often misread by conversion tools; their example is "caça" (game, as in hunted animals) turning into "caca" (excrement), and errors like this also stop retrieval from matching the passage ([Santos et al. 2026](https://doi.org/10.3390/app16105069)). The OHRBench study found that even the best OCR scored about 14% lower on question answering than using the ground-truth text ([Zhang et al. 2025](https://arxiv.org/abs/2412.02592)).

**5. Information in images disappears.** Many text pipelines keep only text by default. The ColPali study notes that a common Unstructured text-only configuration filters out figures, images and tables as noise ([Faysse et al. 2025](https://arxiv.org/abs/2407.01449)). Docling's FAQ also notes that embedded WMF images are handled only on Windows and ignored on other systems. Whatever was in flowcharts, architecture diagrams and screenshots is gone after conversion.

**6. Meaningful formatting disappears.** Strikethroughs, color highlights and underlines often carry meaning. In 2026 Sun and colleagues gave a contract example: the original struck out "90 days" and "$5,000" and replaced them with "60 days" and "$2,000". Once OCR dropped the strikethroughs, old and new numbers appeared side by side, and the model explained the contradiction as a "drafting error" ([Sun et al. 2026](https://arxiv.org/abs/2605.00911)).

These six failures have one thing in common: the tools don't report errors. Docling's documentation even says that when it lacks the font information needed to infer heading levels, style inference is skipped "silently": "no error, just fewer levels".

## High OCR scores don't mean good RAG

When choosing a parser, people often look at OCR accuracy. But two studies found that this score doesn't line up with final question-answering performance.

OHRBench's example: MinerU makes fewer text errors than Marker, yet scores lower on retrieval ([Zhang et al. 2025](https://arxiv.org/abs/2412.02592)). The authors' wording is that the two "do not always align". Sun and colleagues' 2026 InduOCRBench shows it more starkly: documents with strikethroughs and color marks scored 82.9% on OCR but only 52.8% on question answering, because most of the characters were right but the meaningful formatting was lost.

It goes the other way too: for documents with watermarks or busy backgrounds, OCR scores were lower than question-answering scores, because the model could use context to repair scattered typos. The authors' summary is that models can repair scattered character errors, but structural errors are much harder: misaligned columns and scrambled reading order barely recover, tables split across pages recover only partly, and lost formatting like the strikethroughs above is hardest of all.

## Structure and chunking matter more than the tool

In 2026 Santos and colleagues used one set of documents to compare four conversion tools and several chunking methods ([Santos et al. 2026](https://doi.org/10.3390/app16105069)). Two results are worth remembering:

- **Switching only the tool, with chunking held fixed, the simplest tool did best.** When three of the automated tools used the same recursive chunking with no other transformations, the simplest, PDFLoader, scored highest (86.2%), followed by Docling (84.7%). The authors' explanation is that if chunking doesn't use the structural information a conversion tool works hard to extract, that work is wasted.
- **From the same conversion output, changing the chunking made the biggest difference.** With the same Docling output, switching from recursive chunking to chunking by heading hierarchy, with each chunk carrying its heading path (e.g. "Chapter 3 > 3.2 Application process"), raised accuracy from 84.7% to 91.2%, the largest single improvement in the experiment. Table questions moved even more: from 66.6% to 99.8%.

Some caveats:

- The whole test had only 50 questions, only 9 of them about tables.
- Hierarchical chunking and the heading path were switched on together, so their separate contributions weren't measured.
- Of the automated tools, only Docling was run with hierarchical chunking.

So the safer statement is that changing the chunking of the same conversion output made a bigger difference than changing the tool. Order 15 covers metadata like heading paths, and order 16 covers chunking.

**Avoid an extra intermediate format.** Azure's chunking guide advises that if you separate loading and chunking into two steps, don't convert documents into an intermediate format first: "This type of operation can result in data loss" ([Azure: RAG chunking phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase)). The Docling example above is a case in point: export to Markdown first and then chunk, and the merged cells are gone. Docling itself also offers chunking directly on its document structure, attaching headings and captions.

## Can you skip parsing and read the page images?

One approach skips parsing and retrieves each page as an image. ColPali beat "parsing plus OCR" by more than ten points on its own benchmark ([Faysse et al. 2025](https://arxiv.org/abs/2407.01449); this site has [an introduction](/posts/ai/2026-09-03-colpali-visual-document-retrieval-en)). But when Most and colleagues switched in 2025 to degraded scans the model hadn't seen, the result reversed and a good OCR pipeline won ([Most et al. 2025](https://arxiv.org/abs/2505.05666)); InduOCRBench also had GPT-5 answer from page images directly, and it did no better.

My reading: visual retrieval is strong on the document types it was trained on, and how well it generalizes is still unsettled. For most teams' knowledge bases, getting text parsing right and spot-checking it is still the safer starting point.

## How to spot-check

No errors from the parser doesn't mean the content is right. Azure's guide suggests saving the output after loading and preprocessing so it can be inspected before chunking; Docling also provides per-document confidence scores for finding documents that need manual review, though the table score isn't implemented yet.

My spot-check method:

1. **Pick a few documents of each type.** Single-column text, two-column reports, specs with tables, scans, slides: two or three of each. Azure's guide also recommends at least two test items per format.
2. **Put the original and the parsed output side by side.** Don't just check that there's output; compare paragraph by paragraph.
3. **Check each of the six failures.** Is the paragraph order right? Is every table cell's value still there and in the right column? Have headers or footers been inserted into sentences? Are numbers, names and terms spelled correctly? Has information in images disappeared? Are strikethroughs and marks still there?
4. **Work backwards from order 11's test questions.** Can each question's source passage be found in the parsed output, and does it look the same as in the original?
5. **Record which failures you find.** If the same failure keeps showing up in one kind of document, change how that kind is processed rather than fixing files one by one.

## Example: a PDF with a table, before and after parsing

The original table:

| Plan | Storage | Monthly price |
|---|---|---|
| Basic | 100 GB | $10 |
| Pro | 1 TB | $30 |
| Team | (merged with the cell above) | $50 |

Pro and Team share one "1 TB" cell.

After exporting to Markdown:

```text
| Plan | Storage | Monthly price |
|---|---|---|
| Basic | 100 GB | $10 |
| Pro | 1 TB | $30 |
| Team |  | $50 |

Confidential, do not distribute    page 3
```

The Team row's storage is now blank, so the model can only guess, and the footer line has come into the body too. A spot-check should flag both. Fixes include exporting to HTML or JSON, filling the merged cell's value into each row during chunking, and moving the footer out of the body. The site's post on [Table Serialization](/posts/ai/2026-09-03-table-serialization-rag-en) covers several ways to turn tables into text.

## Limits of the research

These studies use different documents: Santos used 36 Portuguese administrative documents and 50 questions; most of OHRBench's and InduOCRBench's questions were generated by an LLM from the ground-truth text, which favors the ground truth, though InduOCRBench's strikethrough and color-mark category used hand-written questions; OmniDocBench measures only parsing output, not downstream question answering, and excludes headers and footers from scoring. The ColPali and Most 2025 comparisons use unequal conditions and reach opposite conclusions. Docling and Azure are official documentation. Tools change quickly, and these numbers reflect the versions at the time of each study.

## What you can do tonight

1. **From order 12's inventory, pick two documents of each format.** Especially ones with tables, two columns or scans.
2. **Save their parsed output to files and compare with the originals side by side.** Tick off the six failures one by one.
3. **Check one table with merged cells.** See whether every cell's value is still there.
4. **Decide what to do with headers and footers.** Keep ones with the document's name and version as context; move plain "page 3" or "confidential" lines out of the body.

## Self-check

**Q:** If the parser reports no errors, is the content correct?

**How to judge:** No. None of this post's six failures, including wrong multi-column order, flattened tables, headers and footers mixed in, typos, missing images and lost formatting, produce errors; some tools even skip a step silently when they lack the information they need. The only way to confirm the content is right is to spot-check: pick documents of each type, compare the parsed output with the original paragraph by paragraph, and then work back from the test questions' source passages.

## References

- [Ouyang et al. 2025, OmniDocBench: Benchmarking Diverse PDF Document Parsing with Comprehensive Annotations (arXiv)](https://arxiv.org/abs/2412.07626)
- [Docling documentation](https://docling-project.github.io/docling/)
- [Docling: Serialization](https://docling-project.github.io/docling/concepts/serialization/)
- [Microsoft Azure Architecture Center, RAG preparation phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-preparation-phase)
- [Microsoft Azure Architecture Center, RAG chunking phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-chunking-phase)
- [Santos et al. 2026, From PDF to RAG-Ready: Evaluating Document Conversion Frameworks for Domain-Specific Question Answering (Applied Sciences)](https://doi.org/10.3390/app16105069)
- [Zhang et al. 2025, OCR Hinders RAG: Evaluating the Cascading Impact of OCR on Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2412.02592)
- [Sun et al. 2026, When Good OCR Is Not Enough: Benchmarking OCR Robustness for Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2605.00911)
- [Faysse et al. 2025, ColPali: Efficient Document Retrieval with Vision Language Models (ICLR 2025)](https://arxiv.org/abs/2407.01449)
- [Most et al. 2025, Lost in OCR Translation? Vision-Based Approaches to Robust Document Retrieval (DocEng 2025, arXiv)](https://arxiv.org/abs/2505.05666)
- On this site: [ColPali: Skip OCR, Retrieve Documents Directly from Images](/posts/ai/2026-09-03-colpali-visual-document-retrieval-en)
- On this site: [Table Serialization: How Format Choice Shapes RAG Retrieval for Tabular Data](/posts/ai/2026-09-03-table-serialization-rag-en)
