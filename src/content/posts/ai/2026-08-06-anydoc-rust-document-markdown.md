---
title: "anydoc：14 種辦公格式轉 Markdown，Firecrawl 用 Rust 給的另一個答案"
date: 2026-08-06
category: ai
type: deep-dive
tags: [anydoc, document-processing, rust, llm, markdown, open-source]
lang: zh-TW
tldr: "Firecrawl 開源的 Rust 轉檔函式庫，14 種辦公格式（含 .doc / .ppt / .xls 老格式）統一轉 GFM，中位耗時 4.4ms，比 LibreOffice 快兩個數量級。代價是完全不碰 OCR。"
description: "拆解 anydoc 的共用 Document model 架構、14 種格式的覆蓋範圍、LLM judge benchmark 的方法論與可信度，以及它跟 MarkItDown 在設計取捨上的路線分歧。"
series:
  name: "文件轉 Markdown 實戰"
  order: 3
draft: false
glossary:
  - term: "GFM"
    aliases: ["GitHub-Flavored Markdown"]
    definition: "GitHub 定義的 Markdown 方言，在標準語法之外加上表格、刪除線、任務清單、自動連結等擴充。"
    context: "anydoc 的輸出目標就是 GFM，因為表格語法是辦公文件轉換的剛需。"
    links:
      - label: "GitHub Flavored Markdown Spec"
        url: "https://github.github.com/gfm/"
  - term: "OLE 複合文件"
    aliases: ["OLE Compound File", "CFB"]
    definition: "微軟 Office 2007 以前使用的二進位容器格式，`.doc` / `.ppt` / `.xls` 都是它。內部結構跟後來的 OOXML（zip + XML）完全不同。"
    context: "多數轉檔工具只支援 OOXML 新格式，能不能吃 OLE 老格式是 anydoc 跟 MarkItDown 的主要差異之一。"
---

> 🌏 [English version](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en)

[Firecrawl](https://github.com/firecrawl) 開源了 [anydoc](https://github.com/firecrawl/anydoc)，一個用 Rust 寫的文件轉 Markdown 函式庫，MIT 授權，目前約 6.2k stars。它支援 14 種辦公室格式，中位轉換耗時 4.4 毫秒。

這個賽道已經很擠了——[MarkItDown](/posts/ai/2026-04-18-markitdown-intro)、[Docling](https://github.com/DS4SD/docling)、MinerU、Marker 各有擁護者。anydoc 值得看的原因不是「又快又好」這種行銷語言，而是它在一個大家都以為沒得選的地方做了明確取捨：**放棄模態廣度，換格式深度與可預測性**。

## 一個共用的 Document model

anydoc 的轉換管線是一條直線：

```
document bytes → format detection → format parser → Document → GFM serializer → Markdown
```

關鍵在中間的 `Document`——一個涵蓋 blocks、inlines、tables、footnotes、assets 的共用文件模型。所有格式先解析成這個模型，再由**同一個** GFM serializer 輸出。README 對這個設計的說法是「one consistent output no matter which format goes in」。

這不只是架構潔癖。實務上的意義是：escaping 規則、表格對齊、heading anchor 生成、footnote 編號，在 14 種格式之間行為完全一致；而且修一次 bug，所有格式同時受惠。相對地，走「一種格式一個 library」路線的工具（MarkItDown 底層是 pdfminer、python-docx、python-pptx 一堆各自為政的套件），同樣一張表格從 `.docx` 跟從 `.xlsx` 進來，輸出很可能長得不一樣。

PDF 是唯一的例外，它繞過標準 parser，走 `pdf-inspector` 直接轉 Markdown。

另一個細節：**格式判定讀檔案內容的 magic bytes，不看副檔名**。副檔名寫錯、或從 HTTP response 拿到沒有檔名的 bytes，都不影響判斷。

## 14 種格式：老格式才是差異所在

| 類別 | 副檔名 |
|---|---|
| Word | `.doc` `.docx` `.docm` |
| PowerPoint | `.ppt` `.pps` `.pot` `.pptx` `.pptm` `.ppsx` `.ppsm` |
| Excel | `.xls` `.xlsx` `.xlsm` `.xlsb` |
| OpenDocument | `.odt` `.ods` `.odp` |
| 其他 | `.rtf` `.epub` `.csv` `.pdf` |

真正的差異點是 `.doc` / `.ppt` / `.xls` 這三個 [OLE 複合文件](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-cfb/53989ce4-7b05-4f8d-829b-d08d6148375b)老格式，還有 `.xlsb`（Excel 二進位活頁簿）。這些格式的內部結構跟 2007 之後的 OOXML 完全不同，多數 Python 生態的工具直接放棄——MarkItDown 支援 6/14、[pandoc](https://pandoc.org/) 5/14、Docling 4/14。

如果你的來源是企業內部文件庫、政府公開資料或律所檔案，`.doc` 的比例會高到你不敢相信。這是 anydoc 最實際的價值。

## Benchmark：數字漂亮，但要看方法論

README 附了一張跟六個競品的對照表：

| 工具 | 格式覆蓋 | 中位耗時 | 綜合品質 |
|---|---|---|---|
| [anydoc](https://github.com/firecrawl/anydoc) | 14/14 | 4.4 ms | 81 |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | 1/14 | 52.5 ms | 69 |
| [markitdown](https://github.com/microsoft/markitdown) | 6/14 | 134.8 ms | 64 |
| [unstructured](https://github.com/Unstructured-IO/unstructured) | 8/14 | 572.9 ms | 62 |
| [docling](https://github.com/DS4SD/docling) | 4/14 | 513.6 ms | 57 |
| [pandoc](https://pandoc.org/) | 5/14 | 102.1 ms | 56 |
| [libreoffice](https://www.libreoffice.org/) | 12/14 | 1129.5 ms | 39 |

4.4ms vs LibreOffice 的 1129.5ms，是 256 倍。這個量級差距在單檔轉換上感覺不到，但在「一次處理十萬份文件」的 ingestion pipeline 裡就是幾小時 vs 幾分鐘的差別。

品質分數的部分，方法論算是交代得比多數自評 benchmark 清楚。README 描述判分方式是由一個 LLM judge（Claude Sonnet 5）「compares two tools' outputs blind against ground truth: the document's first six pages, rendered to images by LibreOffice」，從 completeness、structure、formatting、cleanliness 四個維度打分，語料是 100 份真實文件、共 481 個 verdict，而且「every pair is judged twice with the outputs swapped to cancel position bias」。

盲測、雙向對調消位置偏誤、多維度拆分——這些設計是對的。但要誠實看待兩件事：

1. **這是廠商自評**。設計 benchmark 的人跟被評的工具是同一方，選題本身就會帶偏好。
2. **測試集不公開**（README 說 not redistributable），所以沒辦法獨立複現。

我的讀法是：格式覆蓋率跟耗時這兩欄是硬事實，可以信；品質分數當成「方向性參考」而不是「精確排名」。真要選型，拿你自己的 20 份代表性文件跑一遍比什麼 benchmark 都準。

## 綁定：四種語言 + 瀏覽器 + Agent Skill

```bash
# CLI，不用先安裝
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

三種語言的 API 面幾乎一模一樣：`to_markdown` / `to_markdown_bytes` / `to_document`。`to_document` 回傳的是前面那個共用文件模型，如果你要自己做 chunking 或抽取結構，這比拿到一坨 Markdown 再反解好用得多——這點呼應了[《上傳檔案就自動 embedding 是個壞預設》](/posts/ai/2026-05-24-agentic-attachment-rag-survey)裡的論點：parser 應該把結構交出來，而不是提前替下游做決定。

還有兩個交付形式值得注意：

**WebAssembly 版**（`@firecrawl/anydoc-wasm`）可以在瀏覽器裡本地轉檔，檔案完全不離開使用者的機器。對法務、醫療、財務這類不能上傳文件的場景，這是 Python 生態給不了的東西。

**Agent Skill**：`npx skills add firecrawl/anydoc` 一行安裝，支援 Claude Code、Codex、Cursor、OpenCode。Agent 拿到的是一個純 binary CLI，沒有 Python 環境、沒有系統依賴、沒有模型權重要下載——這比在 sandbox 裡 `pip install` 一堆東西可靠太多。

## 限制：它明確不做 OCR

這是選型時最重要的一條線。

- **PDF 只做 text-based 抽取**。掃描件、純圖片 PDF 完全沒有輸出，README 直說 image-only PDF 需要外接 OCR。如果你的主要痛點是掃描文件，anydoc 不是解方，你要看的是 MinerU 或 [DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression) 那一類方案。
- **不做版面理解**。沒有 ML 模型，也就沒有多欄排版還原、閱讀順序推斷、圖表語義化。Docling 跟 unstructured 在這塊做的事 anydoc 一件都不做。
- **嵌入資源只保留 bytes + media type**，外部圖片轉成一般 Markdown 連結。不會幫你描述圖片內容。
- **幾乎沒有可調參數**。README 沒有列出 sheet 處理策略、footnote 樣式、圖片處理方式等任何設定項。要客製化行為，目前只能改 Rust 原始碼。

錯誤設計倒是很克制——只在「no meaningful Markdown could come out of the file」時才失敗，而且錯誤碼分得夠細，方便在 pipeline 裡分流處理：

| 錯誤碼 | 意義 |
|---|---|
| `Unsupported` | 未知格式或不可轉換的類型 |
| `Malformed` | 結構損毀且無可擷取內容 |
| `Encrypted` | 密碼保護或加密文件 |
| `ResourceLimit` | 超出安全上限 |
| `MissingPart` | 必要元件缺失 |
| `Io` | 檔案讀取失敗 |

## 跟 MarkItDown 怎麼選

兩者是同一個問題的兩種答案，取捨方向剛好相反：

| | anydoc | MarkItDown |
|---|---|---|
| 語言 / 交付 | Rust，單一 binary、零外部依賴 | Python，一堆 optional extras |
| 格式深度 | 14 種，含 OLE 老格式 | 較少辦公格式，但涵蓋 OOXML 主流 |
| 模態廣度 | 只做文件 | 圖片 OCR、音訊轉文字、YouTube 字幕、ZIP |
| 速度 | 4.4ms 中位 | 134.8ms 中位 |
| 輸出一致性 | 共用 Document model，14 種格式一致 | 依賴各自的 parser library |
| OCR | 不做 | 有（可接 Azure Document Intelligence） |

決策其實很簡單：

- **來源是純數位辦公文件、量大、要跑在容器或 edge 上** → anydoc。特別是有 `.doc` / `.xls` 老格式的時候。
- **來源雜、有圖片有音訊、要一個工具吃到底** → MarkItDown。它的 [Azure Document Intelligence 後端](/posts/ai/2026-04-18-markitdown-intro)對複雜 PDF 也更有辦法。
- **要精確保留版面結構、輸出 JSON schema** → Docling。
- **兩個一起用也完全合理**：anydoc 當快速路徑，遇到 `Unsupported` 或空輸出再 fallback 到帶 OCR 的方案。錯誤碼分得夠細，正是為了讓你這樣接。

## 整體來說

anydoc 沒有試圖成為文件處理的萬用解，它把範圍縮得很窄——**純數位辦公文件轉 Markdown**——然後在這個範圍內把速度、格式覆蓋率跟輸出一致性推到目前少有對手的程度。

這個取捨在 LLM pipeline 的脈絡下是划算的。轉檔本來就該是管線裡最無聊、最不該出意外的一環：吃進去、吐出來、不要依賴、不要慢、不要每種格式行為都不一樣。OCR 和版面理解是另一個問題，值得用另一個工具（和另一份預算）去解。

它不是 MarkItDown 的替代品，是那條管線的前段。

## 參考資料

- [firecrawl/anydoc — GitHub](https://github.com/firecrawl/anydoc)
- [microsoft/markitdown — GitHub](https://github.com/microsoft/markitdown)
- [DS4SD/docling — GitHub](https://github.com/DS4SD/docling)
- [Unstructured-IO/unstructured — GitHub](https://github.com/Unstructured-IO/unstructured)
- [mwilliamson/mammoth.js — GitHub](https://github.com/mwilliamson/mammoth.js)
- [Pandoc — 官方網站](https://pandoc.org/)
- [LibreOffice — 官方網站](https://www.libreoffice.org/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [MarkItDown：把任何檔案餵給 LLM 之前，先讓它變成 Markdown](/posts/ai/2026-04-18-markitdown-intro)
- [AI 爬蟲工具全景圖：34 個開源專案的五大分類與選型指南](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)
- [上傳檔案就自動 embedding 是個壞預設](/posts/ai/2026-05-24-agentic-attachment-rag-survey)
- [DeepSeek-OCR：把長上下文壓成圖片的 10× 壓縮實驗](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression)
