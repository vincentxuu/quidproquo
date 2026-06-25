---
title: "How Claude Reads and Writes PDF / DOCX / PPTX: Deconstructing the Three-Layer Architecture of Skills + Sandbox"
date: 2026-05-19
type: deep-dive
category: ai
tags: [claude, agent-skills, anthropic, code-interpreter, sandbox, document-skills]
lang: en
tldr: "Claude has no docx_tool or pdf_tool -- it relies on bash + file tools, plus SKILL.md instructions and pre-installed libraries like pdfplumber / python-pptx inside the container, assembling file handling capabilities from three layers."
description: "Deconstructing how Claude handles files by examining Anthropic's open-source skills/docx and skills/pdf: how the three layers -- generic LLM tools, SKILL.md instruction layer, and pre-installed parser libraries inside the container -- divide the work."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-19-claude-file-handling-three-layers)

LLMs cannot parse the binary formats of PDFs or DOCX files on their own, yet Claude can read and write them -- from scanned document OCR, form filling, and cross-page table extraction, to generating downloadable .pptx files, everything just works. It doesn't rely on some magical `pdf_tool`. Instead, it splits these capabilities into three layers: **generic tools visible to the LLM, SKILL.md instructions, and Python libraries pre-installed in the container**. This article deconstructs that architecture and examines how Anthropic's own open-source [`docx`](https://github.com/anthropics/skills/tree/main/skills/docx) / [`pdf`](https://github.com/anthropics/skills/tree/main/skills/pdf) / [`pptx`](https://github.com/anthropics/skills/tree/main/skills/pptx) / [`xlsx`](https://github.com/anthropics/skills/tree/main/skills/xlsx) skills are structured.

> In this article, "sandbox" and "container" are used interchangeably. Claude's approach uses containers to implement sandboxing -- "container" emphasizes the Docker / gVisor technology layer, while "sandbox" emphasizes the security isolation (no escaping to the host). In practice, Anthropic likely uses a runtime like [gVisor](https://gvisor.dev/), following the same pattern as MaiAgent Code Interpreter's use of `runsc`.

## The Three-Layer Architecture

According to the [Anthropic Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills), a Skill is "organized folders of instructions, scripts, and resources that agents can discover and load dynamically." For file handling, this design can be broken down into three layers:

```
┌─────────────────────────────────────────────────┐
│ Layer 1: Generic tools visible to the LLM       │
│   (few and general-purpose)                     │
│   bash / view / create_file / str_replace /     │
│   present_files                                 │
│   → No docx_tool or pdf_tool exists             │
└─────────────────────────────────────────────────┘
                    ↓ calls
┌─────────────────────────────────────────────────┐
│ Layer 2: SKILL.md + scripts (instruction layer) │
│   skills/pdf/SKILL.md                           │
│   skills/pdf/scripts/extract_tables.py          │
│   skills/pdf/forms.md                           │
│   → Tells the LLM "which library to use & how"  │
└─────────────────────────────────────────────────┘
                    ↓ import
┌─────────────────────────────────────────────────┐
│ Layer 3: Pre-installed libraries in container   │
│   (execution layer)                             │
│   pdfplumber / pypdf / python-docx / openpyxl   │
│   python-pptx / reportlab / weasyprint          │
│   → The code that actually does binary parsing   │
└─────────────────────────────────────────────────┘
```

The Anthropic blog states directly: "Claude triggers the PDF skill **by invoking a Bash tool** to read the contents of pdf/SKILL.md" -- Claude has no special "load skill" action; it simply uses bash to `cat` a markdown file.

## Layer 1: Generic Tools Are the Top-Level Interface

Based on currently known Claude tool interfaces, there are only five tools related to "working with files":

- `bash` -- run commands in the sandbox container
- `view` -- inspect files, directories, and images
- `create_file` -- create new files
- `str_replace` -- precisely replace file contents
- `present_files` -- present files as download cards to the user

**There is no `read_pdf`, `make_pptx`, or `extract_tables` as dedicated tools**. All actions related to formats like "PDF" or "DOCX" route back through bash + Python, with Layer 3 libraries doing the actual work.

The cost of this design is that the LLM needs to know "which library to use for processing PDFs" and "how to fill in the parameters for `pdfplumber.extract_tables()`." Layer 2 exists to provide this know-how.

## Layer 2: SKILL.md Is Compressed Engineer Know-How

The scope of the SKILL.md at [github.com/anthropics/skills/tree/main/skills/pdf](https://github.com/anthropics/skills/tree/main/skills/pdf) is written directly in its description:

> "This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable."

It also provides Python examples directly, such as "merging PDFs with pypdf":

```python
from pypdf import PdfWriter, PdfReader
writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)
with open("merged.pdf", "wb") as output:
    writer.write(output)
```

SKILL.md also splits into separate files: the details for form filling are extracted into `forms.md` and not loaded by default. Only when the LLM determines "the user wants to fill a form" does it call bash `cat forms.md` to pull that section into context. Anthropic calls this "**progressive disclosure**," and the approximate token budgets across the three tiers are:

| Tier | When Loaded | Budget |
|---|---|---|
| Frontmatter (name + description) | All skills loaded at startup | ~100 tokens |
| SKILL.md body | Loaded only when that skill triggers | < 5000 tokens recommended |
| Supplementary files (forms.md / scripts / templates) | Loaded only when LLM determines it's needed | Unlimited |

The [agentskills.io specification](https://agentskills.io/specification) also defines three folder conventions: `scripts/` for executable code, `references/` for extended documentation, and `assets/` for templates and images.

## Layer 3: Libraries Are the Ones Actually Doing the Work

SKILL.md doesn't parse PDFs itself -- it only tells the LLM to "run `python -c "import pdfplumber; ..."`." The actual parsing is done by libraries pre-installed in the container. Looking at examples from the docx / pdf / pptx / xlsx skills, Anthropic relies on at least:

| Skill | Libraries Used |
|---|---|
| [`docx`](https://github.com/anthropics/skills/tree/main/skills/docx) | python-docx / docx-js ([knightli.com analysis](https://www.knightli.com/en/2026/04/04/analyze-docx-agent-skill/) notes that new documents use docx-js, while editing uses "unpack → edit XML → repack → validate") |
| [`pdf`](https://github.com/anthropics/skills/tree/main/skills/pdf) | pypdf (merge/split), pdfplumber (text/table extraction), PyMuPDF (high-performance rendering), Tesseract (scanned document OCR) |
| [`pptx`](https://github.com/anthropics/skills/tree/main/skills/pptx) | python-pptx + pptxgenjs (based on SKILL.md content), file reading via `python -m markitdown` |
| [`xlsx`](https://github.com/anthropics/skills/tree/main/skills/xlsx) | openpyxl |

Without the Layer 3 libraries, no matter how well-written the Layer 2 SKILL.md is, it's just text. Writing "please use pdfplumber" when the container doesn't have it installed results in an `ImportError` blowing up immediately.

## Why This Design Beats "One Tool Per Format"

Making PDF handling into a `parse_pdf` tool seems reasonable, but Anthropic didn't design it that way. Here's the comparison:

| Dimension | "One tool per format" | "Skill + shared bash" |
|---|---|---|
| Adding a new format | Write wrapper, define JSON schema, write backend handler, deploy | Edit SKILL.md + add `pip install` to container |
| Cross-format composition | Difficult to chain across tools, requires middleware | One bash line chains it all: `read xlsx → compute → generate pptx` |
| Handling edge cases | Stuck if the tool doesn't support it | LLM writes Python directly, adapts on the spot |
| Debugging | Cross-service black box | Error messages go directly to the LLM, which can adjust parameters and retry |
| Maintenance | Layout changes require backend redeployment | Just edit the SKILL.md |

The LangChain blog makes the same observation in [Using skills with Deep Agents](https://www.langchain.com/blog/using-skills-with-deep-agents): "How can generalist agents get away with using a small number of tools? With bash and filesystem tools, agents can perform actions just as humans would without needing specialized bound tools for every task."

In other words, **a Skill is content work, not engineering work**. Writing a new skill = writing a markdown file + preparing a few example scripts + confirming the container has the corresponding library. That's why Claude was able to roll out so many skills so quickly.

## file-reading Uses markitdown: The Router Pattern

The Claude.ai interface has a `file-reading` skill, but it's not open-sourced (not in [anthropics/skills](https://github.com/anthropics/skills)). Clues can be found in the pptx SKILL.md content:

> "Read/analyze content: `python -m markitdown presentation.pptx`"

[markitdown](https://github.com/microsoft/markitdown) is a universal converter open-sourced by Microsoft that can convert PDF / DOCX / PPTX / XLSX / HTML / images / audio into unified Markdown. So the "file-reading" skill is most likely a thin wrapper: "**Not sure how to read this file? Try markitdown first.**" This works well for simple routing cases like "plain text / CSV / JSON / arbitrary documents."

## Things to Watch Out for When Copying This to Your Own Sandbox

When porting this design to your own LLM platform, none of the three layers can be skipped:

1. **Layer 1 tool interface must be complete** -- You need at least `bash` + `view` + `create_file` + `str_replace`. Without `present_files`, the LLM finishes running and only responds with "the file is at /workspace," leaving users without a download link.
2. **Layer 2 SKILL.md is more than just a description** -- A well-written description determines whether the LLM will trigger the skill; well-written instructions (body) determine whether it executes correctly after triggering. Both must be written; missing either one breaks the skill.
3. **Layer 3 base image must have packages pre-installed** -- At minimum, install `python-docx`, `python-pptx`, `openpyxl`, `pdfplumber`, `pypdf`, `pymupdf`, `reportlab`, `weasyprint`, `pytesseract` + Tesseract system packages (including Traditional Chinese / Simplified Chinese models). **If containers are stateless, you cannot rely on on-demand `pip install`** -- reinstalling on every tool call will blow up latency.

Container design should also follow Claude's approach: session-scoped containers (one container per conversation, shared across multiple tool calls) + warm pool (a few pre-warmed containers kept running in the background, assigned to new conversations immediately), which is how startup latency gets kept under control.

## The Big Picture

Claude's file handling doesn't rely on newly invented tools. Instead, it combines the existing patterns of "LLM writes Python running in a sandbox" + "folders + markdown spec." This design turns "adding support for a new format" into a markdown writing task rather than a backend service project -- and it's precisely why, after Anthropic extracted the SKILL.md format into the [agentskills.io](https://agentskills.io/specification) open standard, the ecosystem was able to grow hundreds of skills in a short time.

For those wanting to build something similar on their own platform, the biggest hidden cost is **base image** maintenance: the container needs the right libraries pre-installed, versions pinned, and OCR system packages included. Without this layer, no matter how much SKILL.md you write, it's just markdown files.

## References

- [Equipping agents for the real world with Agent Skills -- Anthropic Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills Specification -- agentskills.io](https://agentskills.io/specification)
- [anthropics/skills -- Public repository for Agent Skills](https://github.com/anthropics/skills)
- [skills/pdf/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/pdf/SKILL.md)
- [skills/docx/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/docx/SKILL.md)
- [skills/pptx/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md)
- [Analyzing Anthropic's docx Agent Skill -- knightli.com](https://www.knightli.com/en/2026/04/04/analyze-docx-agent-skill/)
- [Using skills with Deep Agents -- LangChain blog](https://www.langchain.com/blog/using-skills-with-deep-agents)
- [markitdown -- Microsoft](https://github.com/microsoft/markitdown)
- [Agent Skills Overview -- Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
