---
title: "解析層：當結構要用模型推斷——而授權才是真正的選型軸"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-parsing, ocr, vision-language-model, open-source, rag]
lang: zh-TW
tldr: "掃描件與複雜版面只能靠模型推斷結構。但 MinerU、Marker、Docling 的技術差距遠小於授權差距——MinerU 過 $20M 月營收要另談授權、Marker 的模型權重過門檻要付費、只有 Docling 是乾淨的 MIT。選型先看 LICENSE，再看 benchmark。"
description: "文件解析三層階梯的第三層：pipeline 式（MinerU / Marker / Docling）與端到端 VLM（olmOCR / dots.ocr / Chandra）的取捨、各家授權條款的實際限制、olmOCR-bench 數字怎麼讀，以及商業 API 的定位。"
series:
  name: "文件解析實戰"
  order: 5
draft: false
glossary:
  - term: "olmOCR-bench"
    definition: "Allen AI 提出的文件解析評測基準，用單頁層級的判定規則檢查輸出是否保留了正確內容與結構。"
    context: "目前解析層工具最常引用的公開基準，但引用者多半是被評工具的作者。"
  - term: "OpenRAIL-M"
    aliases: ["Responsible AI License"]
    definition: "一種模型權重授權，允許使用與再散布，但附帶使用限制條款；各家常再加上自己的商業門檻。"
    context: "Marker 的程式碼是 Apache-2.0，模型權重卻走改過的 OpenRAIL-M，兩者授權不同是最容易踩到的坑。"
---

> 🌏 [English version](/posts/ai/2026-08-06-document-parsing-layout-ocr-en)

[三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)走到最後一層：檔案裡沒有可用的結構，甚至沒有文字。掃描的合約、拍照的發票、雙欄加公式的論文、巢狀儲存格的財報——這些只能靠模型從視覺訊號推斷。

這一層工具很多、benchmark 很吵，但我認為**選型的第一順位不是準確度，是 LICENSE 檔案**。理由下面會講清楚。

## 兩種取向

**Pipeline 式**把工作拆成多階段：版面偵測 → 區塊分類 → 閱讀順序 → 各區塊內容識別（OCR／表格結構／公式）。每階段可替換、可單獨除錯、可只跑其中幾段。[MinerU](https://github.com/opendatalab/MinerU)、[Marker](https://github.com/datalab-to/marker)、[Docling](https://github.com/docling-project/docling) 都屬於這一類。

**端到端 VLM** 直接把整頁圖片餵給視覺語言模型，讓它一次吐出 Markdown。[olmOCR](https://github.com/allenai/olmocr)、[dots.ocr](https://github.com/rednote-hilab/dots.ocr)、[Chandra](https://github.com/datalab-to/chandra) 走這條路。優點是不需要維護多階段管線、對怪異版面適應性好；缺點是難以局部除錯，而且會產生 pipeline 不會有的失敗模式——幻覺。站內的 [DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression) 那篇拆過這條路線的極端版本。

實務上界線正在模糊：Marker 已經在管線裡嵌 VLM，MinerU 也提供 VLM backend。與其糾結分類，不如看兩件事——**要不要 GPU**、**能不能只跑一部分**。

## 開源陣營現況

星數、授權、最後推送皆為 2026-08-06 GitHub API 查詢值：

| 工具 | Stars | 授權 | 最後推送 |
|---|---|---|---|
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | 86,967 | Apache-2.0 | 2026-07-22 |
| [MinerU](https://github.com/opendatalab/MinerU) | 76,853 | MinerU 自訂授權 | 2026-08-05 |
| [Docling](https://github.com/docling-project/docling) | 64,238 | MIT | 2026-08-03 |
| [Marker](https://github.com/datalab-to/marker) | 38,077 | Apache-2.0（僅程式碼） | 2026-07-20 |
| [Surya](https://github.com/datalab-to/surya) | 21,215 | Apache-2.0（僅程式碼） | 2026-07-23 |
| [olmOCR](https://github.com/allenai/olmocr) | 19,231 | Apache-2.0 | 2026-03-25 |
| [Chandra](https://github.com/datalab-to/chandra) | 11,917 | Apache-2.0 | 2026-06-26 |
| [dots.ocr](https://github.com/rednote-hilab/dots.ocr) | 9,056 | MIT | 2026-03-24 |

兩個 repo 已經搬家：Marker 從 `VikParuchuri` 移到 `datalab-to`，Docling 從 `DS4SD` 移到 `docling-project`。舊網址會轉址，但新專案該用新的。

## 授權：真正的分水嶺

這一層的技術差距在收斂，授權差距卻在擴大。GitHub 頁面上那個 license badge **會騙你**，因為程式碼與模型權重可以是兩套授權。

**MinerU** 的 API 回傳 `NOASSERTION`，因為它用的是自訂的「MinerU Open Source License」——以 Apache-2.0 為底，加上額外條件：超過一定規模（依 [MarkTechPost 2026-07 的整理](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/amp)為 100M MAU 或 $20M 月營收）需另談商業授權，且基於它建的線上服務必須揭露此事。對絕大多數團隊這個門檻遠在天邊，但對平台型產品要先看清楚。

**Marker / Surya**（Datalab 出品）是最容易踩的坑：**程式碼 Apache-2.0，模型權重走改過的 AI Pubs OpenRAIL-M**，對研究、個人使用與未達營收門檻的新創免費，超過就要付費授權。門檻數字在不同來源不一致（同一份整理寫 $5M 融資／營收，Datalab 較早的合作公告寫 $2M），**這種數字一定要自己去讀 repo 裡的 LICENSE 與官網條款，不要信二手整理，包括這一篇**。

**Docling** 是 MIT，模型授權各自獨立追蹤。對商業部署來說，這是清單裡最乾淨的一個——IBM Research 出品，這點不意外。

順帶提醒：[上一篇](/posts/ai/2026-08-06-pdf-text-extraction-libraries)講的 PyMuPDF 是 AGPL-3.0。整條 pipeline 裡只要有一個 AGPL 元件，SaaS 場景就得重新評估。

## Benchmark 怎麼讀

現在最常被引用的是 olmOCR-bench。依 MarkTechPost 2026-07-24 對 Datalab 官方數據的整理，Marker v2 balanced 模式在 olmOCR-bench 拿 76.0%、吞吐 2.9 pg/s，Docling 為 50.3% / 2.1 pg/s；Marker 的 fast 模式加 `--disable_ocr` 可以純 CPU 跑到 23.7 pg/s。

看起來很清楚，但要打兩層折：

1. **這是 Datalab 自己的 benchmark，Marker 是他們的產品。** 跟[前面對 anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown) 與 ParseBench 用的是同一把尺——作者的產品拿第一，結構性偏誤存在。
2. **模式決定失敗形態，不只是分數高低。** 同一份整理指出 fast 模式會改從 PDF 文字層讀公式，arXiv 數學類別因此從 83.9 掉到 23.4，而 `--disable_ocr` 在該類別直接是 0.0。也就是說「快 8 倍」的代價不是均勻掉幾分，而是某一整類文件完全失效。

這正是解析層 benchmark 最容易誤導的地方：**總分接近的兩個工具，失敗的地方可能完全不同**。你的語料如果全是掃描的舊文件，該看的是那個分類的分數，不是總分。

## 商業 API

LlamaParse、Azure Document Intelligence、Google Document AI、AWS Textract、Reducto 都在這一層，邏輯是付費買準確度與免維護。

依 [ParseBench](https://github.com/run-llama/ParseBench)（arXiv [2604.08538](https://arxiv.org/abs/2604.08538)）的 leaderboard，LlamaParse Agentic 總分 84.88、每頁約 1.25¢，領先 Azure Document Intelligence 的 73.8。但同樣的警告要再說一次：ParseBench 由 LlamaIndex 製作，榜首正是他們自家產品。

比較實際的判準是**你的量體**。每頁 1¢ 在一萬頁的專案是 $100，可以不用想；在一千萬頁的 ingestion 是 $100,000，那就該自己養 GPU。開源方案的成本是工程時間加硬體，商業 API 的成本是每頁單價——交叉點通常落在幾十萬頁的量級。

## 選型

1. **先讀 LICENSE**。閉源 SaaS 且營收會成長 → Docling（MIT）最安全；能接受條件或量體不大 → MinerU / Marker 都可以。
2. **再看你的語料類型**。學術 PDF（公式、雙欄）→ MinerU；一般商業文件要吞吐 → Marker；要結構化 JSON 而不只 Markdown → Docling；純中文場景 → PaddleOCR 生態最厚。
3. **量體決定自建或買**。幾十萬頁以下先用商業 API 把產品做出來，成本可預測；超過再考慮自建。
4. **不要只跑總分**。拿你自己語料裡最難的那 20 份跑一遍，看它們壞在哪。

## 整體來說

這一層是三層階梯裡最貴、最慢、最不確定的一層，所以最重要的決定其實是**盡量少用它**——[抽取層](/posts/ai/2026-08-06-pdf-text-extraction-libraries)能解的別送上來，[轉換層](/posts/ai/2026-08-06-anydoc-rust-document-markdown)能解的更不用說。

真的走到這裡時，順序是：LICENSE → 你的語料 → benchmark 的分類分數 → 自己跑一遍。把 benchmark 總分排名放在第一位，是這一層最常見的選型錯誤。

技術會繼續收斂，但授權條款不會自己變好。

## 參考資料

- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)
- [datalab-to/surya — GitHub](https://github.com/datalab-to/surya)
- [datalab-to/chandra — GitHub](https://github.com/datalab-to/chandra)
- [allenai/olmocr — GitHub](https://github.com/allenai/olmocr)
- [rednote-hilab/dots.ocr — GitHub](https://github.com/rednote-hilab/dots.ocr)
- [PaddlePaddle/PaddleOCR — GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- [Datalab Marker v2 vs MinerU, Docling, LiteParse 授權與 benchmark 整理（MarkTechPost, 2026-07-24）](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/amp)
- [ParseBench: A Document Parsing Benchmark for AI Agents（arXiv 2604.08538）](https://arxiv.org/abs/2604.08538)
- [run-llama/ParseBench — leaderboard](https://github.com/run-llama/ParseBench)
- [文件解析的三層階梯：轉換、抽取、解析](/posts/ai/2026-08-06-document-parsing-three-layers)
- [確定性抽取層：不用任何模型，先解決八成的 PDF](/posts/ai/2026-08-06-pdf-text-extraction-libraries)
- [DeepSeek-OCR：把長上下文壓成圖片的 10× 壓縮實驗](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression)
