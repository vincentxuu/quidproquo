---
title: "Claude 怎麼讀寫 PDF / DOCX / PPTX：拆解 skill + sandbox 的三層架構"
date: 2026-05-19
type: deep-dive
category: ai
tags: [claude, agent-skills, anthropic, code-interpreter, sandbox, document-skills]
lang: zh-TW
tldr: "Claude 沒有 docx_tool / pdf_tool — 它只用 bash + file tools，加上 SKILL.md 指令、容器內預裝的 pdfplumber / python-pptx 等 library，三層拼出檔案讀寫能力。"
description: "從 Anthropic 開源的 skills/docx 與 skills/pdf 拆解 Claude 處理檔案的設計：LLM 看到的通用 tool、SKILL.md 指令層、容器內預裝的 parser library 三層如何分工。"
draft: false
---

LLM 自己沒辦法解析 PDF 或 DOCX 的二進位格式，但 Claude 偏偏能讀能寫 — 從掃描件 OCR、表單填寫、跨頁表格抽取，到生成可下載 .pptx，都跑得起來。它不是靠某個神奇的 `pdf_tool`，而是把這些能力拆成三層：**LLM 看到的通用 tool、SKILL.md 指令、容器內預裝的 Python library**。這篇拆解這個架構，順便看 Anthropic 自己開源的 [`docx`](https://github.com/anthropics/skills/tree/main/skills/docx) / [`pdf`](https://github.com/anthropics/skills/tree/main/skills/pdf) / [`pptx`](https://github.com/anthropics/skills/tree/main/skills/pptx) / [`xlsx`](https://github.com/anthropics/skills/tree/main/skills/xlsx) skill 怎麼長。

> 本文「sandbox」與「container」互換使用。Claude 的做法是用 container 實作 sandbox — container 強調 Docker / gVisor 這層技術實作，sandbox 強調安全隔離（不能逃逸到主機）。實務上 Anthropic 很可能用 [gVisor](https://gvisor.dev/) 之類的 runtime，跟 MaiAgent Code Interpreter 用 `runsc` 是同個套路。

## 三層架構

依 [Anthropic 工程部落格](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)，Skill 是「organized folders of instructions, scripts, and resources that agents can discover and load dynamically」。對檔案處理來說，這套設計可以拆成三層：

```
┌─────────────────────────────────────────────────┐
│ Layer 1: LLM 看得到的通用 tool（少而通用）       │
│   bash / view / create_file / str_replace /     │
│   present_files                                 │
│   → 沒有 docx_tool、pdf_tool 這種東西            │
└─────────────────────────────────────────────────┘
                    ↓ 呼叫
┌─────────────────────────────────────────────────┐
│ Layer 2: SKILL.md + scripts（指令層）            │
│   skills/pdf/SKILL.md                           │
│   skills/pdf/scripts/extract_tables.py          │
│   skills/pdf/forms.md                           │
│   → 告訴 LLM「該用哪個 library 怎麼用」          │
└─────────────────────────────────────────────────┘
                    ↓ import
┌─────────────────────────────────────────────────┐
│ Layer 3: 容器內預裝的 library（執行層）          │
│   pdfplumber / pypdf / python-docx / openpyxl   │
│   python-pptx / reportlab / weasyprint          │
│   → 真正做 binary parsing 的程式碼               │
└─────────────────────────────────────────────────┘
```

Anthropic blog 原文直接點明：「Claude triggers the PDF skill **by invoking a Bash tool** to read the contents of pdf/SKILL.md」 — Claude 沒有「載入 skill」這種特殊動作，就是用 bash 去 cat 一個 markdown 檔。

## Layer 1：通用 tool 才是頂層介面

從目前已知的 Claude tool 介面看，跟「動檔案」相關的只有五個：

- `bash` — 在 sandbox container 跑指令
- `view` — 查看檔案、目錄、圖片
- `create_file` — 建立新檔案
- `str_replace` — 精準替換檔案內容
- `present_files` — 把檔案以下載卡片呈現給使用者

**沒有 `read_pdf`、`make_pptx`、`extract_tables` 這種專屬 tool**。所有跟「PDF」「DOCX」這類格式有關的動作都繞回去走 bash + Python，由 Layer 3 的 library 做事。

這設計的代價是 LLM 需要知道「處理 PDF 該叫哪個 library」、「pdfplumber.extract_tables() 的參數怎麼填」。Layer 2 就是來補這層 know-how。

## Layer 2：SKILL.md 是壓縮過的工程師 know-how

[github.com/anthropics/skills/tree/main/skills/pdf](https://github.com/anthropics/skills/tree/main/skills/pdf) 的 SKILL.md 範圍直接寫在描述裡：

> 「This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable.」

並且直接給 Python 範例，例如「用 pypdf 合併 PDF」：

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

SKILL.md 還會分檔：表單填寫的細節抽到 `forms.md`，平常不載入；只有 LLM 判斷「使用者要填表單」時才呼叫 bash `cat forms.md` 把那段拉進 context。Anthropic 把這叫「**progressive disclosure**」（漸進揭露），三層 token 預算大致是：

| 層級 | 載入時機 | 預算 |
|---|---|---|
| Frontmatter（name + description） | 啟動就載入所有 skill | ~100 tokens |
| SKILL.md body | 觸發該 skill 才載 | < 5000 tokens 建議 |
| 附屬檔（forms.md / scripts / templates） | LLM 判斷需要才讀 | 不限 |

[agentskills.io specification](https://agentskills.io/specification) 還規定了三個資料夾慣例：`scripts/` 放可執行碼、`references/` 放擴充說明、`assets/` 放範本與圖片。

## Layer 3：library 才是真的做事的人

SKILL.md 不會自己解析 PDF — 它只是告訴 LLM 「跑 `python -c "import pdfplumber; ..."`」。實際 parsing 由容器內預裝的 library 做。從 docx / pdf / pptx / xlsx 四個 skill 的範例看，Anthropic 至少依賴：

| Skill | 用的 library |
|---|---|
| [`docx`](https://github.com/anthropics/skills/tree/main/skills/docx) | python-docx / docx-js（[knightli.com 分析](https://www.knightli.com/en/2026/04/04/analyze-docx-agent-skill/)指出新建用 docx-js、編輯用「unpack→edit XML→repack→validate」） |
| [`pdf`](https://github.com/anthropics/skills/tree/main/skills/pdf) | pypdf（合併 / 拆分）、pdfplumber（抽文字 / 表格）、PyMuPDF（高效率渲染）、Tesseract（掃描件 OCR） |
| [`pptx`](https://github.com/anthropics/skills/tree/main/skills/pptx) | python-pptx + pptxgenjs（從 SKILL.md 內容看），讀檔走 `python -m markitdown` |
| [`xlsx`](https://github.com/anthropics/skills/tree/main/skills/xlsx) | openpyxl |

少了 Layer 3 的 library，Layer 2 的 SKILL.md 寫得再漂亮也只是文字。寫「請用 pdfplumber」但容器沒裝 → `ImportError` 直接爆。

## 為什麼這設計贏「每個格式做一個 tool」

把 PDF 處理做成 `parse_pdf` tool 看起來合理，但 Anthropic 不這樣設計。對照成本：

| 維度 | 「每格式一個 tool」 | 「skill + 共用 bash」 |
|---|---|---|
| 加新格式 | 寫 wrapper、定 JSON schema、寫 backend handler、deploy | 改 SKILL.md + 容器加 `pip install` |
| 跨格式組合 | 跨 tool 串接困難，要寫中間層 | bash 一行串完：`讀 xlsx → 算 → 生 pptx` |
| 處理特殊情境 | tool 不支援就卡死 | LLM 直接寫 Python，現場改 |
| Debug | 跨服務黑箱 | 錯誤訊息直接給 LLM，能改參數重跑 |
| 維護 | 改 layout 要 backend 重 deploy | 改 SKILL.md 即可 |

LangChain blog 在 [Using skills with Deep Agents](https://www.langchain.com/blog/using-skills-with-deep-agents) 點出一樣的觀察：「How can generalist agents get away with using a small number of tools? With bash and filesystem tools, agents can perform actions just as humans would without needing specialized bound tools for every task.」

換句話說，**Skill 是內容工作，不是工程工作**。寫一個新 skill = 寫一份 markdown + 準備幾個範例腳本 + 確認容器有對應 library。Claude 能短時間鋪那麼多 skill 就是因為這點。

## file-reading 用 markitdown：路由器模式

Claude.ai 介面上有個 `file-reading` skill 但沒開源（不在 [anthropics/skills](https://github.com/anthropics/skills)）。從 pptx SKILL.md 的內容可以看到線索：

> 「Read/analyze content：`python -m markitdown presentation.pptx`」

[markitdown](https://github.com/microsoft/markitdown) 是 Microsoft 開源的 universal converter，能把 PDF / DOCX / PPTX / XLSX / HTML / 圖片 / 音訊轉成統一的 Markdown。所以「file-reading」這個 skill 八成就是個薄包裝：「**不確定怎麼讀這個檔？先丟 markitdown 試試看**」。對「純文字 / CSV / JSON / 任意文件」這類簡單路由很合用。

## 想抄到自家 sandbox 的話要注意

把這套設計搬到自家 LLM 平台時，三層都不能少：

1. **Layer 1 tool 介面要齊全** — 至少要有 `bash` + `view` + `create_file` + `str_replace`。少了 `present_files` 的話，LLM 跑完只回「檔案在 /workspace」，使用者拿不到下載連結。
2. **Layer 2 的 SKILL.md 不只是描述** — 描述（description）寫得好決定 LLM 會不會觸發；指令層（body）寫得好決定觸發後做不做得對。兩件事都要寫，缺一個 skill 就跑壞。
3. **Layer 3 的 base image 要先補套件** — 至少裝齊 `python-docx`、`python-pptx`、`openpyxl`、`pdfplumber`、`pypdf`、`pymupdf`、`reportlab`、`weasyprint`、`pytesseract` + Tesseract 系統套件（含繁中／簡中模型）。**容器是 stateless 的話，不能依賴 on-demand `pip install`**，每次 tool call 都重新裝會炸延遲。

容器設計上也要學 Claude 的做法：session-scoped container（一個對話一個容器、多次 tool call 共用）+ warm pool（背景常駐幾個預熱容器，新對話直接撈），啟動延遲才壓得下來。

## 整體來說

Claude 處理檔案不是靠新發明的 tool，而是把舊有的「LLM 寫 Python 跑在 sandbox 裡」+「資料夾 + markdown 規格」組合起來。這設計讓「加一種格式」變成寫一份 markdown 的工作，而不是寫一個後端服務 — 也是為什麼 Anthropic 把 SKILL.md 拉成 [agentskills.io](https://agentskills.io/specification) 的開放標準後，整個生態能短時間長出幾百個 skill。

對自家平台想做類似事的，最大的隱性成本是 **base image** 的維護：容器要預裝對的 library、要鎖版本、要 OCR 系統套件。少了這層，SKILL.md 寫再多也只是 markdown 文件。

## 參考資料

- [Equipping agents for the real world with Agent Skills — Anthropic Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Agent Skills Specification — agentskills.io](https://agentskills.io/specification)
- [anthropics/skills — Public repository for Agent Skills](https://github.com/anthropics/skills)
- [skills/pdf/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/pdf/SKILL.md)
- [skills/docx/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/docx/SKILL.md)
- [skills/pptx/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md)
- [Analyzing Anthropic's docx Agent Skill — knightli.com](https://www.knightli.com/en/2026/04/04/analyze-docx-agent-skill/)
- [Using skills with Deep Agents — LangChain blog](https://www.langchain.com/blog/using-skills-with-deep-agents)
- [markitdown — Microsoft](https://github.com/microsoft/markitdown)
- [Agent Skills Overview — Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
