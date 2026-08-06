---
title: "anydoc：14 種辦公格式轉 Markdown，Firecrawl 用 Rust 給的另一個答案"
date: 2026-08-06
category: ai
type: deep-dive
tags: [anydoc, document-processing, rust, llm, markdown, open-source]
lang: zh-TW
tldr: "Firecrawl 開源的 Rust 轉檔函式庫，14 種辦公格式（含 .doc / .ppt / .xls 老格式）統一轉 GFM，中位耗時 4.7ms，同樣計時條件下比 Docling 快 109 倍。代價是完全不碰 OCR。"
description: "拆解 anydoc 的共用 Document model 架構、14 種格式的覆蓋範圍、LLM judge benchmark 的方法論與可信度，以及它跟 MarkItDown 在設計取捨上的路線分歧。"
series:
  name: "文件解析實戰"
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

[Firecrawl](https://github.com/firecrawl) 開源了 [anydoc](https://github.com/firecrawl/anydoc)，一個用 Rust 寫的文件轉 Markdown 函式庫，MIT 授權。它支援 14 種辦公室格式，中位轉換耗時 4.7 毫秒。

先講一個影響閱讀方式的事實：這個 repo 建立於 2026-08-03，寫這篇時只有三天大，746 stars（GitHub API 查詢於 2026-08-06）。所有數字都還在動——我第一次讀 README 到第二次查證之間，benchmark 表就換過一輪。下面引的每個數字都標了查詢時間，你讀到時請當快照看。

這個賽道已經很擠了——[MarkItDown](/posts/ai/2026-04-18-markitdown-intro)、[Docling](https://github.com/docling-project/docling)、MinerU、Marker 各有擁護者。anydoc 值得看的原因不是「又快又好」這種行銷語言，而是它在一個大家都以為沒得選的地方做了明確取捨：**放棄模態廣度，換格式深度與可預測性**。

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

README 附了一張跟六個競品的對照表（2026-08-06 查詢）：

| 工具 | 格式覆蓋 | 中位耗時 | 判過的文件數 | 綜合分數 |
|---|---|---|---|---|
| [anydoc](https://github.com/firecrawl/anydoc) | 14/14 | 4.7 ms | 94 | 80 |
| [mammoth](https://github.com/mwilliamson/mammoth.js) | 1/14 | 52.5 ms | 8 | 70 |
| [markitdown](https://github.com/microsoft/markitdown) | 6/14 | 134.8 ms | 33 | 65 |
| [unstructured](https://github.com/Unstructured-IO/unstructured) | 8/14 | 572.9 ms | 58 | 65 |
| [pandoc](https://pandoc.org/) | 5/14 | 102.1 ms | 34 | 57 |
| [docling](https://github.com/docling-project/docling) | 4/14 | 513.6 ms | 21 | 57 |
| [libreoffice](https://www.libreoffice.org/) | 12/14 | 1129.5 ms | 87 | 40 |

速度差距是真的，但要挑對比較對象。README 說明計時方式時講得很清楚：

> anydoc and the Python libraries are timed with process spawn excluded; the CLI tools include it, since that is how they are used.

所以 anydoc 的 4.7ms 跟 Docling 的 513.6ms 是同一個基準（兩者都排除 process 啟動），**109 倍的差距是實打實的**。但拿它跟 LibreOffice 的 1129.5ms 比出「240 倍」就不公平了——LibreOffice 和 pandoc 是 CLI，計時含 process 啟動開銷。硬體是 Ryzen 9 9950X3D。

品質分數則要更小心。方法論本身交代得比多數自評 benchmark 清楚：LLM judge（Claude Sonnet 5）「compares two tools' outputs blind against ground truth: the document's first six pages, rendered to images by LibreOffice」，從 completeness、structure、formatting、cleanliness 四個維度打分，語料是 100 份真實文件、共 479 個 verdict，而且「every pair is judged twice with the outputs swapped to cancel position bias」。盲測、雙向對調消位置偏誤、多維度拆分——這些設計都是對的。

但**那個「綜合分數」欄位不能拿來排名，README 自己說了**：

> each row averages a different set of formats (mammoth's 70 is docx alone, while anydoc's 80 spans all fourteen), so the per-format table is the fair comparison

配上「判過的文件數」那一欄看更清楚：anydoc 被判了 94 份，mammoth 只有 8 份（它只支援 docx）。mammoth 的 70 分是「在 docx 這一項拿 70」，anydoc 的 80 分是「十四種格式的平均」。兩個數字放在同一欄裡，本來就不是同一件事。README 附了 per-format 對照表，那才是該看的東西。

再加上兩件事：

1. **這是廠商自評**。設計 benchmark 的人跟被評的工具是同一方，選題與維度定義本身就會帶偏好。
2. **測試集不公開**（README 說 not redistributable），所以無法獨立複現。

我的讀法：格式覆蓋率跟同基準下的耗時是硬事實，可以信；綜合分數欄當成「作者自己都說別這樣用」的東西，跳過。真要選型，拿你自己的 20 份代表性文件跑一遍比什麼 benchmark 都準。

## 綁定：三種語言 + 瀏覽器

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

**但 PDF 例外**。README 明說 PDF 走的是 pdf-inspector 直接產 Markdown 的捷徑，所以對 PDF 要用 `to_markdown` / `to_markdown_bytes`，不要用 `to_document`。想從 PDF 拿結構化模型的話，這條路是不通的。

沒有官方的 `npx` 一行式 CLI。README 提供的是 `examples/` 裡的三份轉檔範例腳本：

```bash
cargo run --release --example convert -- file.docx [-f csv] [-o out.md] [--assets dir]
node examples/convert.mjs file.docx [-f csv] [-o out.md] [--assets dir]
python examples/convert.py file.docx [-f csv] [-o out.md] [--assets dir]
```

另外有 **WebAssembly 版**（[`@firecrawl/anydoc-wasm`](https://www.npmjs.com/package/@firecrawl/anydoc-wasm)，同樣 MIT），可以在瀏覽器裡本地轉檔，檔案完全不離開使用者的機器。對法務、醫療、財務這類不能上傳文件的場景，這是 Python 生態給不了的東西。

對 agent 場景來說，真正的優勢不是有沒有 skill 包，而是**它是預編好的原生 binary**：Node 綁定跑在 libuv thread pool 上不擋 event loop，Python 綁定會釋放 GIL。沒有 Python 環境、沒有系統依賴、沒有模型權重要下載——這比在 sandbox 裡 `pip install` 一堆東西可靠太多。

## 限制：它明確不做 OCR

這是選型時最重要的一條線。

- **PDF 只做 text-based 抽取**。掃描件、純圖片 PDF 不會硬吐半成品，而是**直接回傳 unsupported error**——README 建議把這些檔案改送 Firecrawl 託管的 `/parse` endpoint 做 OCR。如果你的主要痛點是掃描文件，anydoc 本身不是解方，要看的是 MinerU 或 [DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression) 那一類方案。
- **不做版面理解**。沒有 ML 模型，也就沒有多欄排版還原、閱讀順序推斷、圖表語義化。Docling 跟 unstructured 在這塊做的事 anydoc 一件都不做。
- **嵌入資源只保留 bytes + media type**，外部圖片轉成一般 Markdown 連結。不會幫你描述圖片內容。
- **幾乎沒有可調參數**。README 沒有列出 sheet 處理策略、footnote 樣式、圖片處理方式等任何設定項。要客製化行為，目前只能改 Rust 原始碼。

錯誤設計倒是很務實：不確定的時候不硬猜，直接讓呼叫端知道這個檔案要換條路走。掃描 PDF 回 unsupported 就是最好的例子——這讓「快速路徑 + OCR fallback」變成可以直接照著寫的分流邏輯，而不是要自己判斷輸出是不是壞掉。

## 跟 MarkItDown 怎麼選

兩者是同一個問題的兩種答案，取捨方向剛好相反：

| | anydoc | MarkItDown |
|---|---|---|
| 語言 / 交付 | Rust，單一 binary、零外部依賴 | Python，一堆 optional extras |
| 格式深度 | 14 種，含 OLE 老格式 | 較少辦公格式，但涵蓋 OOXML 主流 |
| 模態廣度 | 只做文件 | 圖片 OCR、音訊轉文字、YouTube 字幕、ZIP |
| 速度 | 4.7ms 中位 | 134.8ms 中位 |
| 輸出一致性 | 共用 Document model，14 種格式一致 | 依賴各自的 parser library |
| OCR | 不做 | 有（可接 Azure Document Intelligence） |

決策其實很簡單：

- **來源是純數位辦公文件、量大、要跑在容器或 edge 上** → anydoc。特別是有 `.doc` / `.xls` 老格式的時候。
- **來源雜、有圖片有音訊、要一個工具吃到底** → MarkItDown。它的 [Azure Document Intelligence 後端](/posts/ai/2026-04-18-markitdown-intro)對複雜 PDF 也更有辦法。
- **要精確保留版面結構、輸出 JSON schema** → Docling。
- **兩個一起用也完全合理**：anydoc 當快速路徑，遇到 unsupported error 再 fallback 到帶 OCR 的方案。README 自己就是這樣建議的（掃描 PDF 改送 `/parse`）。

## 整體來說

anydoc 沒有試圖成為文件處理的萬用解，它把範圍縮得很窄——**純數位辦公文件轉 Markdown**——然後在這個範圍內把速度、格式覆蓋率跟輸出一致性推到目前少有對手的程度。

這個取捨在 LLM pipeline 的脈絡下是划算的。轉檔本來就該是管線裡最無聊、最不該出意外的一環：吃進去、吐出來、不要依賴、不要慢、不要每種格式行為都不一樣。OCR 和版面理解是另一個問題，值得用另一個工具（和另一份預算）去解。

它不是 MarkItDown 的替代品，是那條管線的前段。

如果你還沒決定該用哪一層，先看系列的第一篇：[文件解析的三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)。

## 參考資料

- [firecrawl/anydoc — GitHub](https://github.com/firecrawl/anydoc)
- [@firecrawl/anydoc — npm](https://www.npmjs.com/package/@firecrawl/anydoc)
- [@firecrawl/anydoc-wasm — npm](https://www.npmjs.com/package/@firecrawl/anydoc-wasm)
- [firecrawl-anydoc — PyPI](https://pypi.org/project/firecrawl-anydoc/)
- [anydoc — crates.io](https://crates.io/crates/anydoc)
- [microsoft/markitdown — GitHub](https://github.com/microsoft/markitdown)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [Unstructured-IO/unstructured — GitHub](https://github.com/Unstructured-IO/unstructured)
- [mwilliamson/mammoth.js — GitHub](https://github.com/mwilliamson/mammoth.js)
- [Pandoc — 官方網站](https://pandoc.org/)
- [LibreOffice — 官方網站](https://www.libreoffice.org/)
- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [文件解析的三層階梯：轉換、抽取、解析](/posts/ai/2026-08-06-document-parsing-three-layers)
- [MarkItDown：把任何檔案餵給 LLM 之前，先讓它變成 Markdown](/posts/ai/2026-04-18-markitdown-intro)
- [AI 爬蟲工具全景圖：34 個開源專案的五大分類與選型指南](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)
- [上傳檔案就自動 embedding 是個壞預設](/posts/ai/2026-05-24-agentic-attachment-rag-survey)
- [DeepSeek-OCR：把長上下文壓成圖片的 10× 壓縮實驗](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression)
