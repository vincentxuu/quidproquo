---
title: "掃描 PDF 實測：10 種解析工具丟進考古題，結果差多少？"
date: 2026-08-16
category: ai
type: deep-dive
tags: [document-parsing, ocr, vision-language-model, benchmark, open-source]
lang: zh-TW
tldr: "用 4 份台大碩班掃描考古題實測 10 種開源 PDF 解析工具。VLM 類（Firecrawl、MinerU 3.4、Marker v2）在公式和程式碼上全面碾壓傳統 OCR，但安裝踩坑才是真正的門檻——MinerU 舊包名會進依賴地獄、Marker 首次模型下載要 10 分鐘、PaddleOCR 缺引擎。實務推薦兩階段策略：RapidOCR 粗篩 + MinerU/Firecrawl 精查。"
description: "用台大碩班掃描考古題（程式碼、公式、中英混排）實測 Firecrawl、MinerU、Marker、Surya、PaddleOCR、RapidOCR、Docling、Tesseract 等 10 種工具的 OCR 品質、速度與安裝門檻，附踩坑修復紀錄與兩階段驗證策略。"
series:
  name: "文件解析實戰"
  order: 6
draft: false
glossary:
  - term: "VLM"
    aliases: ["Vision Language Model", "視覺語言模型"]
    definition: "能同時處理圖片和文字的大型模型。跟傳統 OCR 的差別在於它不只認字，還能理解版面結構並產出格式化輸出（如 LaTeX 公式）。"
    context: "本次實測中，所有用了 VLM 的工具在公式與程式碼場景都大幅領先傳統 OCR。"
  - term: "BM25 short circuit"
    aliases: ["BM25 短路"]
    definition: "搜尋系統中的一種優化：如果關鍵字全文搜尋（BM25）已經找到足夠多的高品質結果，就跳過較慢的向量搜尋，節省延遲。"
    context: "quidproquo 的搜尋 API 用這個策略避免每次查詢都呼叫 Vectorize。"
---

> 🌏 [English version](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en)

[上一篇](/posts/ai/2026-08-06-document-parsing-layout-ocr)討論了[解析層](/posts/ai/2026-08-06-document-parsing-three-layers)的工具選型邏輯：先看授權、再看語料類型、最後才看 benchmark 總分。但那些都是別人的 benchmark。這篇把工具拿來實際跑一遍，用的是我自己手上的素材——台大碩班掃描考古題。

## 測試素材

4 份考卷，全部是掃描影像 PDF，沒有可提取的文字層：

- **資工演算法 108**：程式碼 + 公式混排
- **資管 IT 113**：中英混合選擇題
- **資管英文 115**：純英文閱讀測驗
- **資工數學 114**：密集數學公式 + 圖形（有向圖、heap tree）

這四份刻意挑了不同難度：純文字、中英混排、程式碼、公式、圖形。數學卷是最難的——所有工具在這份的表現都明顯下降。

## 結論先說

| 排名 | 工具 | 定位 |
|---|---|---|
| 品質最佳 | **Firecrawl** | 雲端 VLM，LaTeX 完整、程式碼保留、零亂碼，按頁計費 |
| 免費最佳 | **MinerU 3.4** | 本地 pipeline，LaTeX 公式完整，`pip install "mineru[all]"` |
| 並列第二 | **Marker v2** / **Claude 視覺** | Marker 含 LaTeX；Claude 能讀懂圖形內容 |
| 實用首選 | **RapidOCR** | 1.5s/頁、零配置、免費，公式降為純文字但文字準確率高 |

## 完整比較

| 工具 | 類型 | 演算法卷 | IT 選擇題 | 英文卷 | 數學卷 | 速度 | 安裝 | 成本 |
|---|---|---|---|---|---|---|---|---|
| **Firecrawl** | 雲端 VLM | 優秀 | 優秀 | 優秀 | 優秀 | 3–5s | 不用裝 | 按頁計費 |
| **MinerU 3.4** | 本地 pipeline | 優秀 7938c | 優秀 11611c | 優秀 21519c | 良好 5752c | 21–30s | pip | 免費* |
| **Claude 視覺** | VLM | 優秀 | 優秀 | 優秀 | 優秀 | ~10s/頁 | 不用裝 | API 費 |
| **Marker v2** | 本地 VLM pipeline | 優秀 7331c | 優秀 11949c | 優秀 21922c | 中等 3143c | 125–538s | pip + 模型 | 免費* |
| **Surya 0.22** | 本地 VLM OCR | 良好 3645c/p | — | — | — | ~30s/頁 | pip | 免費* |
| **PaddleOCR v3.7** | 本地 OCR | 良好 7398c | 良好 11310c | 良好 21290c | 中等 1865c | 56–253s | pip + paddlepaddle | 免費 |
| **RapidOCR** | 本地 OCR | 良好 2477c/p | 良好 3682c/p | 良好 | 中等 415c/p | 1–2s/頁 | pip | 免費 |
| **Docling** | 本地 pipeline | 中等 | 良好 | 良好 | 差 | 6–45s | pip | 免費 |
| **pdf-inspector** | 分類路由 | — | — | — | — | 2ms | cargo | 免費 |
| **Tesseract** | 傳統 OCR | 0 chars | — | — | — | — | brew | 免費 |

\* 授權注意：Marker 的模型權重過營收門檻要付費（$2M–$5M 區間有爭議，見[上一篇分析](/posts/ai/2026-08-06-document-parsing-layout-ocr)）；MinerU 過 $20M 月營收要另談授權，且有揭露義務。Docling 是乾淨的 MIT。

olmOCR、Chandra-OCR、dots.ocr 需要 GPU 或 vLLM backend，CPU Mac 無法本地測。

## 試金石：第 3 題（min-heap）

這題在 Docling 輸出中完全亂碼，是最能區分工具品質的測試案例。

**Firecrawl / MinerU 3.4**（完美還原）：

```
3. (10%) Draw the final min-heap tree after the following operations:
insert 7, insert 4, insert 3, insert 1, delete min, insert 9,
insert 2, insert 5, delete min, delete min.
```

**Docling**（亂碼）：

```
'In oor  t  se Dmt e t ote  ie  s  ote  te f t e t t t t rt ts
delete min, delete min.
```

Marker v2 和 RapidOCR 都正確辨識了文字，差別在 Marker 保留了 LaTeX 格式。

## 數學公式：VLM 的分水嶺

資工數學 114 是所有工具表現最差的一份。Firecrawl 靠 VLM 拿到完整的矩陣和向量 LaTeX（`\begin{pmatrix}`），MinerU 拿到 5752 chars 但公式偶有雜訊，Marker 只有 3143 chars（其他卷都超過 7000），PaddleOCR 剩 1865 chars。

傳統 OCR（RapidOCR、PaddleOCR）把公式讀成純文字——`$a_n$` 變成 `an`、矩陣消失——但在純文字場景完全夠用，而且快 10 到 100 倍。

圖形（有向圖、heap tree）則只有 Claude 視覺能「看懂」。其他所有工具都只是辨認圖形旁邊的文字標註，無法理解圖形本身的語義。

## 踩坑紀錄

### MinerU：包名已改，舊名會進依賴地獄

PyPI 上 `magic-pdf`（v1.3.12）是舊版。它需要的模型包 `PDF-Extract-Kit-1.0` 裡的 OCR 模型版本（v4/v5）跟程式碼期望的（v3）不匹配，加上 `transformers` 版本衝突和 tokenizer 格式不相容，形成無法解開的依賴死結。

正確做法：`pip install -U "mineru[all]"`。包名是 `mineru`，目前 v3.4.5，官方已全面遷移。

### Marker v2：初次測試輸出 0 chars

實際是程式讀取 bug——`result.markdown` 確實有 7331 chars 含 LaTeX。模型需約 10 分鐘下載（surya-ocr 依賴），`pip install marker-pdf` 即可。

### PaddleOCR v3.7：API 改了

需額外安裝 `paddlepaddle` 引擎（`pip install paddlepaddle`），API 從 `ocr()` 改為 `predict()`，返回值結構也改了。

### Surya 0.22：API 變更大

需用 `LayoutPredictor`（不是 `DetectionPredictor`）+ `RecognitionPredictor`，結果從 `text_lines` 改為 `blocks`（含 HTML 輸出）。有間歇性 connection error，透過 Marker v2 間接使用最穩定。

### dots.ocr：需要 vLLM backend

PyPI 包名是 `dots_ocr`，從 GitHub 安裝：`pip install git+https://github.com/studio-dots-ai/dots.ocr.git`，但它需要 vLLM backend，CPU 環境無法跑。

### Tesseract：0 chars

對這批掃描 PDF 輸出 0 chars。可能是掃描解析度或影像前處理問題。

## 為什麼 VLM 類工具效果最好？

[Firecrawl](https://github.com/mendableai/firecrawl) 先用 [pdf-inspector](https://github.com/firecrawl/pdf-inspector)（Rust）在 2ms 內判斷 PDF 是掃描還是文字，做路由分流。對掃描 PDF 使用 Vision Language Model 而非傳統 OCR。從輸出的 LaTeX 公式（`$b_n$`、`$O(n)$`、`\begin{pmatrix}`）可以確認——傳統 OCR 不可能產生這種格式。

Marker v2 在 pipeline 中嵌入了 [Surya OCR](https://github.com/datalab-to/surya)（VLM-based），所以也能產出 LaTeX。MinerU 3.4 用 UniMERNet 做公式辨識，同屬模型推斷路線。

這也驗證了[上一篇](/posts/ai/2026-08-06-document-parsing-layout-ocr)的觀察：pipeline 式和端到端 VLM 的界線正在模糊。

## 場景選型

| 你要做什麼 | 用這個 | 為什麼 |
|---|---|---|
| 快速驗證大量文件 | **RapidOCR** | 1.5s/頁、免費、零配置，文字準確率夠用 |
| 重建含公式的文件 | **MinerU 3.4** | 免費、本地、LaTeX 完整 |
| 不想裝東西、品質最優先 | **Firecrawl** | 雲端 VLM，零安裝零踩坑，按頁計費 |
| 需要看懂圖形語義 | **Claude 視覺** | 唯一能理解有向圖、heap tree、形狀符號的方案 |
| 商業產品、授權要乾淨 | **Docling** | MIT 授權，掃描件品質中等但授權零風險 |
| 有 GPU、要最高準確度 | **olmOCR / Chandra** | 端到端 VLM，需 GPU 或遠端推論伺服器 |

## 兩階段驗證策略

實際跑了 61 份考古題驗證，這個策略最划算：

**第一輪（粗篩）**：RapidOCR 跑全部 61 份，約 5 分鐘完成。自動比對題庫 JSON，標出不匹配的考卷。

**第二輪（精查）**：只對粗篩標出的 18 份用 MinerU 做完整解析，逐題比對修正。

結果：50 份直接通過、10 份需要重建（3 份裝錯科目、5 份來自錯誤年份、2 份 OCR 比對不過），全部修復完成。總題數 1449 題。

## 對應三層階梯

回到[系列第一篇](/posts/ai/2026-08-06-document-parsing-three-layers)的框架：

| 層 | 適用場景 | 本次測試涵蓋 |
|---|---|---|
| 轉換層 | Office/HTML（結構已在檔案裡） | 不適用——考古題是掃描 PDF |
| 抽取層 | 數位原生 PDF（有文字沒結構） | pdf-inspector（路由）、Tesseract |
| 解析層 | 掃描件（連文字都要推斷） | Firecrawl、MinerU、Marker、Surya、Docling、RapidOCR、PaddleOCR、Claude 視覺 |

掃描考古題全部落在解析層，沒有捷徑。但兩階段策略的精髓在於：用便宜的工具（RapidOCR）先決定哪些檔案需要解析層的完整火力，而不是每份都用最貴的。

## 整體來說

技術已經收斂到「都能用」的程度，差異在速度、成本、安裝門檻。安裝踩坑（MinerU 改名、Marker 模型下載、PaddleOCR 缺引擎、Surya API 跨版本不相容）吃掉的時間，比工具之間品質差異造成的影響大得多。只有 RapidOCR 和 Docling 做到 `pip install` 即用。

如果你只記一件事：**不要先選工具，先選策略**。兩階段策略讓 61 份考卷的處理時間從「全部用 MinerU 跑 30 分鐘」壓縮到「RapidOCR 5 分鐘 + MinerU 精查 18 份」。

---

## 參考資料

- [mendableai/firecrawl — GitHub](https://github.com/mendableai/firecrawl)
- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)
- [datalab-to/surya — GitHub](https://github.com/datalab-to/surya)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [PaddlePaddle/PaddleOCR — GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- [RapidAI/RapidOCR — GitHub](https://github.com/RapidAI/RapidOCR)
- [allenai/olmocr — GitHub](https://github.com/allenai/olmocr)
- [datalab-to/chandra — GitHub](https://github.com/datalab-to/chandra)
- [studio-dots-ai/dots.ocr — GitHub](https://github.com/studio-dots-ai/dots.ocr)
- [firecrawl/pdf-inspector — GitHub](https://github.com/firecrawl/pdf-inspector)
- [解析層：當結構要用模型推斷——而授權才是真正的選型軸](/posts/ai/2026-08-06-document-parsing-layout-ocr)
- [文件解析的三層階梯：轉換、抽取、解析](/posts/ai/2026-08-06-document-parsing-three-layers)
- [確定性抽取層：不用任何模型，先解決八成的 PDF](/posts/ai/2026-08-06-pdf-text-extraction-libraries)
