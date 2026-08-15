---
title: "文件解析的三層階梯：轉換、抽取、解析，先選對層再選工具"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-processing, document-parsing, rag, llm, ocr, open-source]
lang: zh-TW
tldr: "把文件餵給 LLM 之前，最常見的錯誤不是選錯工具，是選錯層。結構已經在檔案裡的用轉換層（毫秒級），有文字沒結構的用抽取層，連文字都要推斷的才用解析層——anydoc 的 4.7ms 到 Docling 的 513.6ms 差 109 倍，多數人卻直接跳最貴的那層。"
description: "文件轉 LLM 可讀內容的三層決策架構：轉換層（MarkItDown、anydoc）、抽取層（PyMuPDF、pdfplumber）、解析層（MinerU、Docling、OCR-VLM）各自解什麼問題、成本差多少，以及一張可以照著走的選型決策樹。"
series:
  name: "文件解析實戰"
  order: 1
draft: false
glossary:
  - term: "OOXML"
    aliases: ["Office Open XML"]
    definition: "微軟 Office 2007 之後的檔案格式標準，本質是一個 zip 壓縮檔，裡面裝著描述文件結構的 XML。`.docx` / `.pptx` / `.xlsx` 都是。"
    context: "OOXML 的結構是明寫在 XML 裡的，所以轉換層工具不需要推斷任何東西。"
  - term: "版面分析"
    aliases: ["layout analysis", "layout understanding"]
    definition: "從頁面的視覺配置推斷語義結構的過程：哪些區塊是標題、哪些是正文、多欄怎麼切、閱讀順序是什麼、表格的框線在哪。"
    context: "這是解析層跟前兩層的根本差異——前兩層讀既有結構，解析層推斷不存在的結構。"
---

> 🌏 [English version](/posts/ai/2026-08-06-document-parsing-three-layers-en)

「把文件轉成 LLM 讀得懂的東西」看起來是一個問題，實際上是三個。我看過太多人在選型時直接比較 MarkItDown 跟 MinerU 的星數，然後挑星數高的——這就像比較螺絲起子跟電鑽哪個好。

真正該問的第一個問題不是「用哪個工具」，而是**「我的檔案裡，結構到底存不存在」**。答案有三種，對應三個層次，成本差兩個數量級。

## 三層是什麼

| | 結構的狀態 | 工作內容 | 代表工具 | 量級 |
|---|---|---|---|---|
| **轉換層** | 明寫在檔案裡 | 重新序列化 | [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown)、[MarkItDown](/posts/ai/2026-04-18-markitdown-intro)、pandoc | 個位數毫秒 |
| **抽取層** | 有文字，結構要靠啟發式規則 | 座標分析、規則判斷 | PyMuPDF、pdfplumber、Trafilatura | 十毫秒 |
| **解析層** | 沒有結構，甚至沒有文字 | 用模型推斷 | MinerU、Docling、OCR-VLM | 百毫秒到秒 |

這條階梯是單向的：**能用低層解決的，用高層一定更慢更貴，而且更容易出錯**。反過來則是完全不行——拿轉換層去處理掃描件，輸出是空的。

## 第一層：轉換——結構已經在檔案裡

`.docx` 的表格就是 `<w:tbl>`，`.pptx` 的標題就是 placeholder type 為 title 的那個 shape，EPUB 的章節就是 `<h1>`。這些 [OOXML](https://learn.microsoft.com/en-us/openspecs/office-standards/ms-oi29500/) 系列格式**本身就是結構化資料**，只是換了一種序列化方式。

所以轉換層的工作不是「理解」，是「翻譯」。不需要模型、不需要 GPU、不需要推斷，讀 XML、對映到 Markdown、輸出。這也是為什麼它可以快到 [anydoc benchmark](https://github.com/firecrawl/anydoc) 裡的 4.7 毫秒中位耗時（2026-08-06 查詢）——同一份 benchmark 裡走 ML 路線的 Docling 是 513.6 毫秒，差 109 倍。兩者都是函式庫、計時都排除了 process 啟動，這個比較是同基準的。

**什麼時候用**：來源是 Office 檔、EPUB、CSV、HTML 這類格式化文件。企業內部文件庫有超過一半屬於這類，卻常常被整批丟進 OCR pipeline。

**怎麼選**：格式深度看 [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown)（14 種、含 `.doc` / `.ppt` / `.xls` 老格式），模態廣度看 [MarkItDown](/posts/ai/2026-04-18-markitdown-intro)（含圖片 OCR、音訊轉文字）。

## 第二層：抽取——有文字，但沒結構

PDF 是特例，它是唯一橫跨三層的格式。

一份數位原生的 PDF 內部沒有「段落」或「表格」這種概念，它存的是「在座標 (72, 480) 用 11pt Times 畫出字元 A」這樣的指令流。文字是可以直接讀出來的，但**結構完全不存在**——段落邊界、閱讀順序、表格框線，全都得從座標關係反推。

這就是抽取層做的事：用啟發式規則（字元間距、行距、字型大小變化、線條位置）把座標流還原成語義結構。[PyMuPDF](https://pymupdf.readthedocs.io/)（以及專為 LLM 場景設計的 `pymupdf4llm`）、[pdfplumber](https://github.com/jsvine/pdfplumber) 都屬於這一層。網頁那邊的對應物是 [Trafilatura](https://github.com/adbar/trafilatura) 跟 Readability——HTML 有標籤但充滿雜訊，要靠規則把正文從導覽列和廣告裡挑出來。

**什麼時候用**：PDF 選得到文字（`pdftotext` 有輸出），而且版面單純——單欄、標準表格、沒有跨頁合併儲存格。

這一層被嚴重低估。很多團隊跳過它直接上 VLM，但數位原生 PDF 佔多數場景的大宗，`pymupdf4llm` 一行就能出堪用的 Markdown，成本是零。

**什麼時候失效**：多欄排版（規則會把兩欄的文字交錯讀成一行）、跨頁表格、數學公式、複雜的合併儲存格。這些就要往上一層。

## 第三層：解析——結構要推斷出來

到這一層，要嘛沒有文字（掃描件、拍照的合約、圖片型 PDF），要嘛有文字但版面複雜到規則救不回來（學術論文的雙欄加公式、財報的巢狀表格）。

共同點是：**結構不存在於檔案裡，必須用模型從視覺訊號推斷**。這是[版面分析](https://github.com/opendatalab/MinerU)的領域——先偵測區塊、分類區塊類型、決定閱讀順序，再對每個區塊做內容識別。

這一層又分兩種取向：

- **pipeline 式**：[MinerU](https://github.com/opendatalab/MinerU)、[Marker](https://github.com/datalab-to/marker)、[Docling](https://github.com/docling-project/docling) 把版面偵測、OCR、表格識別串成多階段管線，每階段可替換、可除錯。Docling 特別強調輸出結構化 JSON 而不只是 Markdown。
- **端到端 VLM**：直接讓視覺語言模型看整頁、吐出 Markdown。[DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression) 那篇拆過這條路線的極端版本——它甚至反過來用「把文字渲染成圖片」做上下文壓縮。

商業 API（LlamaParse、Azure Document Intelligence、Google Document AI、AWS Textract、Reducto）也在這一層，邏輯是付費買準確度與免維護。付錢不代表自動勝出：[ParseBench](https://github.com/run-llama/ParseBench)（arXiv [2604.08538](https://arxiv.org/abs/2604.08538)，約 2,000 頁人工校驗的企業文件、五個能力維度）的 leaderboard 上，LlamaParse Agentic 總分 84.88 領先，Azure Document Intelligence 73.8——**同樣是付費方案，差距來自多步驟策略而非預算**。

不過這份 benchmark 要跟 anydoc 那份用同一把尺看：**ParseBench 由 LlamaIndex（run-llama）製作，而榜首 LlamaParse 正是他們自家產品**。方法論公開、資料集與評測程式碼都上了 HuggingFace 跟 GitHub，這點比多數自評好；但「作者自己的產品拿第一」這個結構性偏誤依然存在。看它的 per-dimension 分數（表格、圖表、內容忠實度、語義格式、視覺定位）比看總分排名有用。

**代價**：需要 GPU（或按頁付費）、延遲從毫秒變成秒、輸出有不確定性（同一份檔案跑兩次可能不一樣）、除錯困難。

## 決策樹

```
檔案進來
   │
   ├─ 格式本身帶結構？（.docx / .pptx / .xlsx / .epub / .odt / .csv）
   │     └─ 是 ──────────────────► 【轉換層】anydoc / MarkItDown
   │
   ├─ 是 PDF？
   │     ├─ 選得到文字？（pdftotext 有輸出）
   │     │     ├─ 版面單純（單欄、標準表格）
   │     │     │     └─────────────► 【抽取層】pymupdf4llm / pdfplumber
   │     │     └─ 版面複雜（多欄、跨頁表格、公式）
   │     │           └─────────────► 【解析層】MinerU / Marker / Docling
   │     └─ 選不到文字（掃描件、純圖片）
   │           └───────────────────► 【解析層】OCR-VLM / 商業 API
   │
   └─ 網頁 HTML？
         └─────────────────────────► 【抽取層】Trafilatura / Readability
```

實務上這棵樹該做成 fallback 鏈而不是一次性判斷：先跑轉換層，遇到 unsupported error 或空輸出再往上掉。anydoc 對掃描 PDF 就是直接回 unsupported 而不硬吐半成品，正是為了讓你這樣接。

## 三個常見的選錯

**把數位原生 PDF 送進 VLM**。最貴的錯誤。先跑一次 `pdftotext`，有輸出就代表文字層存在，八成的情況抽取層就夠了。

**用轉換層處理掃描件然後以為壞了**。輸出是空的不是 bug，是那份 PDF 裡真的沒有文字。這時候需要的是 OCR，不是換一個轉換工具。

**在解析層追求 100% 準確**。這一層的輸出本質上有不確定性，與其花三個月調參數，不如接受 90% 然後在下游加驗證——這也是[《agentic parsing》](/posts/ai/2026-05-24-agentic-attachment-rag-survey)那條研究線的主張：把 parser 包成 tool 讓 agent 在需要時重跑、換策略，比在 ingestion 階段一次做對更務實。

## 整體來說

選層比選工具重要一個數量級。層選對了，同層工具之間的差異多半是格式覆蓋率和 API 手感；層選錯了，再好的工具都在解錯的問題。

這個系列沿著這三層往下走：轉換層是 [MarkItDown](/posts/ai/2026-04-18-markitdown-intro) 與 [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown)，抽取層是 [PyMuPDF / pdfplumber / Tika 那一組](/posts/ai/2026-08-06-pdf-text-extraction-libraries)（注意 PyMuPDF 的 AGPL 授權），解析層是 [MinerU / Marker / Docling 與 OCR-VLM](/posts/ai/2026-08-06-document-parsing-layout-ocr)（那一層真正的選型軸是授權，不是準確度）。最後用[掃描考古題實測 10 種工具](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)驗證選型框架。

## 參考資料

- [firecrawl/anydoc — GitHub](https://github.com/firecrawl/anydoc)
- [microsoft/markitdown — GitHub](https://github.com/microsoft/markitdown)
- [PyMuPDF 官方文件](https://pymupdf.readthedocs.io/)
- [jsvine/pdfplumber — GitHub](https://github.com/jsvine/pdfplumber)
- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [adbar/trafilatura — GitHub](https://github.com/adbar/trafilatura)
- [確定性抽取層：不用任何模型，先解決八成的 PDF](/posts/ai/2026-08-06-pdf-text-extraction-libraries)
- [解析層：當結構要用模型推斷](/posts/ai/2026-08-06-document-parsing-layout-ocr)
- [Office Open XML (OOXML) 標準文件 — Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/office-standards/ms-oi29500/)
- [ParseBench: A Document Parsing Benchmark for AI Agents（arXiv 2604.08538）](https://arxiv.org/abs/2604.08538)
- [run-llama/ParseBench — GitHub leaderboard](https://github.com/run-llama/ParseBench)
- [anydoc：14 種辦公格式轉 Markdown](/posts/ai/2026-08-06-anydoc-rust-document-markdown)
- [MarkItDown：把任何檔案餵給 LLM 之前，先讓它變成 Markdown](/posts/ai/2026-04-18-markitdown-intro)
- [上傳檔案就自動 embedding 是個壞預設](/posts/ai/2026-05-24-agentic-attachment-rag-survey)
- [DeepSeek-OCR：把長上下文壓成圖片的 10× 壓縮實驗](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression)
- [掃描 PDF 實測：10 種解析工具丟進考古題，結果差多少？](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)
