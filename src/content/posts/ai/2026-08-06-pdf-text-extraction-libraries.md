---
title: "確定性抽取層：不用任何模型，先解決八成的 PDF"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-processing, document-parsing, pdf, python, open-source]
lang: zh-TW
tldr: "數位原生 PDF 的文字是讀得到的，缺的只是結構。PyMuPDF、pdfplumber、pypdf、Tika 這一層用啟發式規則就能還原段落與表格，零 GPU、零推論成本。最大的選型陷阱不是準確度，是 PyMuPDF 的 AGPL-3.0 授權。"
description: "文件解析三層階梯的第二層：PyMuPDF / pymupdf4llm、pdfplumber、pypdf、Apache Tika、Xberg、extractous 的定位差異、授權地雷與選型判準，以及什麼訊號代表你該往解析層走。"
series:
  name: "文件解析實戰"
  order: 4
draft: false
glossary:
  - term: "文字層"
    aliases: ["text layer"]
    definition: "PDF 內部實際儲存的字元繪製指令。有文字層的 PDF 可以直接複製文字；掃描件只有圖片，沒有文字層。"
    context: "`pdftotext` 有沒有輸出，就是判斷該用抽取層還是解析層最快的訊號。"
  - term: "AGPL-3.0"
    aliases: ["GNU Affero General Public License"]
    definition: "一種 copyleft 授權。用它提供網路服務時，你的整合程式碼也必須以相同授權開源。"
    context: "PyMuPDF 採 AGPL-3.0，這讓「效能最好」的選項在商業 SaaS 場景反而最貴。"
---

> 🌏 [English version](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)

[三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)裡最常被跳過的就是這一層。使用者看到 PDF 就想到 OCR，看到 OCR 就去找 VLM——但數位原生 PDF 的文字本來就讀得到，缺的只是結構，而結構可以用規則推。

判斷方法只要一行：

```bash
pdftotext report.pdf - | head
```

有輸出，就代表[文字層](https://pymupdf.readthedocs.io/)存在，這一層八成夠用。沒輸出才需要往上走。

## 這一層到底在做什麼

PDF 內部沒有「段落」這個概念。它存的是一串繪製指令：在座標 (72, 480) 用 11pt Times 畫出字元 `A`。文字全都在，但段落邊界、閱讀順序、表格框線，全部不存在。

抽取層的工作就是**用啟發式規則把座標流還原成語義結構**：字元間距超過某個閾值就是詞邊界、行距突變就是段落邊界、字級變大就是標題、偵測到水平與垂直線段的交點就是表格。

沒有模型、沒有訓練資料、沒有不確定性——同一份檔案跑一百次結果完全一樣。這個確定性在 pipeline 裡的價值被低估了。

## PyMuPDF：最快的選項，最貴的授權

[PyMuPDF](https://github.com/pymupdf/PyMuPDF)（10,414 stars，2026-08-06 查詢）是 MuPDF 的 Python 綁定，C 底層，速度在這一層沒有對手。它另外提供 `pymupdf4llm`，直接吐 LLM 友善的 Markdown：

```python
import pymupdf4llm
md = pymupdf4llm.to_markdown("report.pdf")
```

一行就有堪用輸出，這是很多人跳過整個解析層的理由。

**但它是 AGPL-3.0。** 這是這篇最重要的一句話。AGPL 不禁止商業使用，但如果你拿它提供網路服務，整合它的程式碼也必須以相同授權開源。要閉源商用，得向 Artifex 買商業授權。

所以 PyMuPDF 的處境有點諷刺：技術上是這一層的最佳解，卻在「用它做 SaaS」這個最常見的場景裡是最貴的選項。內部工具、離線批次處理、開源專案——沒問題；閉源 SaaS——先問法務。

## pdfplumber：把中間結果攤開給你看

[pdfplumber](https://github.com/jsvine/pdfplumber)（10,633 stars，MIT）建在 pdfminer.six 上，速度不如 PyMuPDF，但它做對了一件別人沒做的事：**把每個字元、每條線段、每個矩形的座標都暴露出來**。

```python
import pdfplumber
with pdfplumber.open("report.pdf") as pdf:
    page = pdf.pages[0]
    page.extract_table()
    page.chars[0]        # {'text': 'A', 'x0': 72.0, 'top': 480.2, ...}
    page.to_image().debug_tablefinder()   # 把表格偵測結果畫出來
```

`debug_tablefinder()` 會把它認為的表格框線疊在頁面圖上。當某張表抽壞了，你可以直接看到規則在哪裡判斷錯，然後調參數——這在解析層是做不到的，模型抽壞了你只能換模型。

**MIT 授權，商業使用零顧慮**。如果你的場景是表格密集、需要可除錯性，這是預設選擇。

## pypdf：操作導向，不是抽取導向

[pypdf](https://github.com/py-pdf/pypdf)（10,145 stars）純 Python、零編譯依賴，但它的強項不是抽取而是**操作**——合併、分割、旋轉、加密、填表單。文字抽取能力相對陽春，結構還原基本上沒有。

當作抽取工具會失望；當作「PDF 的瑞士刀」很好用。純 Python 這點在受限環境（無法編譯原生擴充的 sandbox）是決定性優勢。

## Apache Tika：不只 PDF

[Apache Tika](https://github.com/apache/tika)（3,948 stars，Apache-2.0，Java）是這份清單裡最老也最廣的——1,000 種以上格式，PDF 只是其中之一。它是很多企業內容管線的隱形基礎設施。

代價是 JVM。要在 Python 服務裡用它，通常得跑 tika-server 再走 HTTP，多一個行程要顧。但如果你的來源格式雜到不可預測（郵件、壓縮檔、CAD、老格式），Tika 的覆蓋率沒有對手。

## Rust 新血：Xberg（原 Xberg）與 extractous

兩個都想做「Tika 的 Rust 版」，但狀態差很多。

[Xberg](https://github.com/xberg-io/xberg)（原名 Xberg，9.1k stars，MIT，2026-08-06 仍在更新）已經從 Python 重寫成 Rust，並提供 Rust / Python / Ruby / Java / Go / PHP / Elixir / C# / TypeScript 等多語綁定，外加 CLI、REST API 與 MCP server。多語綁定 + 原生 binary 這個組合，跟[前一篇的 anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown) 是同一個思路。

[extractous](https://github.com/yobix-ai/extractous)（1,769 stars，Apache-2.0）方向類似，但 **`pushed_at` 停在 2024-12-21**（2026-08-06 查詢）——快二十個月沒有新 commit。技術構想不錯，但別把它放進新專案的關鍵路徑。

## 選型速查

以下星數與授權皆為 2026-08-06 GitHub API 查詢值：

| 工具 | Stars | 授權 | 語言 | 選它的理由 |
|---|---|---|---|---|
| [PyMuPDF](https://github.com/pymupdf/PyMuPDF) | 10,414 | **AGPL-3.0** | Python/C | 最快；`pymupdf4llm` 一行出 Markdown |
| [pdfplumber](https://github.com/jsvine/pdfplumber) | 10,633 | MIT | Python | 表格 + 可視化除錯；商用無顧慮 |
| [pypdf](https://github.com/py-pdf/pypdf) | 10,145 | BSD-3 系 | Python | 純 Python、零編譯；操作而非抽取 |
| [Apache Tika](https://github.com/apache/tika) | 3,948 | Apache-2.0 | Java | 1,000+ 格式覆蓋；要扛 JVM |
| [Xberg](https://github.com/xberg-io/xberg)（原 Xberg） | 9.1k | MIT | Rust | 多語綁定 + CLI + MCP server |
| [extractous](https://github.com/yobix-ai/extractous) | 1,769 | Apache-2.0 | Rust | ⚠️ 2024-12 起無更新 |

決策順序我會這樣走：

1. **要做閉源 SaaS？** → PyMuPDF 出局（或編列商業授權預算），從 pdfplumber 開始。
2. **表格是主要痛點？** → pdfplumber，用 `debug_tablefinder()` 調到滿意。
3. **來源格式雜到不只 PDF？** → Tika（吃得下 JVM）或 Xberg（要單一 binary）。
4. **只是要合併／分割／加密？** → pypdf，別用抽取工具做操作的事。

## 什麼訊號代表該往上一層

抽取層失效有幾個很明確的徵兆，看到就別再調參數了：

- **多欄排版讀成交錯的亂句**。規則是照座標由左至右、由上至下掃，雙欄論文會把左欄第一行接右欄第一行。
- **表格跨頁後欄位對不齊**。跨頁合併儲存格沒有任何線索留在座標裡。
- **數學公式變成散落字元**。上下標、根號、分數線在座標流裡就是一堆獨立字元。
- **`pdftotext` 完全沒輸出**。那是掃描件，這一層從頭到尾都不適用。

前三項要往[解析層](/posts/ai/2026-08-06-document-parsing-three-layers)走；第四項是 OCR 的問題，不是抽取的問題。

## 整體來說

這一層的價值不在功能強，在**便宜而且可預測**。沒有 GPU、沒有 API 費用、沒有冷啟動、沒有隨機性，同一份檔案永遠出同樣的結果。

實務上最好的架構是把它當成 pipeline 的預設路徑：先跑抽取層，用「輸出字數過少」「欄位對不齊」「偵測到多欄」這類訊號決定要不要升級到解析層。這樣八成的文件走零成本路徑，只有真正需要的那兩成付模型的錢。

跳過這一層直接上 VLM，是我看過最常見也最貴的架構錯誤。

## 參考資料

- [pymupdf/PyMuPDF — GitHub](https://github.com/pymupdf/PyMuPDF)
- [PyMuPDF 官方文件（含 pymupdf4llm）](https://pymupdf.readthedocs.io/)
- [jsvine/pdfplumber — GitHub](https://github.com/jsvine/pdfplumber)
- [py-pdf/pypdf — GitHub](https://github.com/py-pdf/pypdf)
- [apache/tika — GitHub](https://github.com/apache/tika)
- [Apache Tika 官方網站](https://tika.apache.org/)
- [Goldziher/kreuzberg — GitHub](https://github.com/Goldziher/kreuzberg)
- [yobix-ai/extractous — GitHub](https://github.com/yobix-ai/extractous)
- [文件解析的三層階梯：轉換、抽取、解析](/posts/ai/2026-08-06-document-parsing-three-layers)
- [anydoc：14 種辦公格式轉 Markdown](/posts/ai/2026-08-06-anydoc-rust-document-markdown)
- [MarkItDown：把任何檔案餵給 LLM 之前，先讓它變成 Markdown](/posts/ai/2026-04-18-markitdown-intro)
