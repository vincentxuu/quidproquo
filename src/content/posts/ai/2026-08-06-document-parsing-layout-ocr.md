---
title: "解析層：當結構要用模型推斷——而授權才是真正的選型軸"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-parsing, ocr, vision-language-model, open-source, rag]
lang: zh-TW
tldr: "掃描件與複雜版面只能靠模型推斷結構。2026 年下半，1B 上下的專用 OCR 模型把 OmniDocBench v1.6 擠到 96～97 分，前幾名差距不到 1 分，技術差距遠小於授權差距：PaddleOCR-VL、MiniCPM-OCR、GLM-OCR、Unlimited OCR 2 是乾淨的 Apache 或 MIT；dots.ocr 在 MIT 上加了禁止用途；Datalab 的 Chandra、Marker／Surya、Indra 權重門檻分別是 $2M、$5M、$20M；騰訊 Youtu-Parsing 排除歐盟；MinerU 要揭露使用。選型先看 LICENSE，再看 benchmark。"
description: "文件解析三層階梯的第三層：pipeline 式（MinerU／Marker／Docling）與端到端 VLM 的取捨、2026-11 在架的開源 OCR 模型與授權對照（PaddleOCR-VL-1.6、MinerU2.5-Pro、MiniCPM-OCR、GLM-OCR、Xiaomi-OCR-0、Youtu-Parsing-Omni、Unlimited OCR 2、DeepSeek-OCR 2、dots.ocr、olmOCR 2、Chandra 2、Surya 2.5），OmniDocBench 與 olmOCR-bench 怎麼讀，以及商業 API 的定位。"
series:
  name: "文件解析實戰"
  order: 5
draft: false
glossary:
  - term: "olmOCR-bench"
    definition: "Allen AI 提出的文件解析評測基準，用單頁層級的判定規則檢查輸出是否保留了正確內容與結構。"
    context: "解析層工具最常引用的公開基準之一，但引用者多半是被評工具的作者。"
  - term: "OmniDocBench"
    definition: "OpenDataLab 維護的文件解析評測集與官方排行榜，Overall 由文字編輯距離、公式 CDM 與表格 TEDS 三項平均而成。"
    context: "2026 年各家 OCR 模型發表時最常報的分數；維護者 OpenDataLab 也是 MinerU 的開發團隊。"
  - term: "OpenRAIL-M"
    aliases: ["Responsible AI License"]
    definition: "一種模型權重授權，允許使用與再散布，但附帶使用限制條款；各家常再加上自己的商業門檻。"
    context: "Marker、Surya、Chandra 的程式碼是 Apache-2.0，模型權重卻走改過的 OpenRAIL-M，兩者授權不同是最容易踩到的坑。"
---

> :globe: [English version](/posts/ai/2026-08-06-document-parsing-layout-ocr-en)

[三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)走到最後一層：檔案裡沒有可用的結構，甚至沒有文字。掃描的合約、拍照的發票、雙欄加公式的論文、巢狀儲存格的財報——這些只能靠模型從視覺訊號推斷。

這一層工具很多、benchmark 很吵，但我認為**選型的第一順位不是準確度，是 LICENSE 檔案**。理由下面會講清楚。

## 兩種取向

**Pipeline 式**把工作拆成多階段：版面偵測 → 區塊分類 → 閱讀順序 → 各區塊內容識別（OCR／表格結構／公式）。每階段可替換、可單獨除錯、可只跑其中幾段。[MinerU](https://github.com/opendatalab/MinerU)（[專篇](/posts/tech/2026-09-05-mineru-ocr-doc-parsing)；準確度模型是 1.2B 的 MinerU2.5-Pro，目前版本 2605）、[Marker](https://github.com/datalab-to/marker)、[Docling](https://github.com/docling-project/docling)（[專篇](/posts/tech/2026-09-06-docling-document-parsing)；2026 年初捐贈 Linux Foundation AI & Data，也提供 VlmPipeline／Granite-Docling 選項）都屬於這一類。

**端到端 VLM** 直接把整頁圖片餵給視覺語言模型，讓它一次吐出 Markdown。[olmOCR 2](https://huggingface.co/allenai/olmOCR-2-7B-1025)、[dots.ocr／dots.mocr](/posts/tech/2026-10-10-ai-model-family-dots-studio)、[Chandra OCR 2](https://github.com/datalab-to/chandra)、[DeepSeek-OCR 2](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2) 走這條路。優點是不需要維護多階段管線、對怪異版面適應性好；缺點是難以局部除錯，而且會產生 pipeline 不會有的失敗模式——幻覺。站內的 [DeepSeek-OCR](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression) 那篇拆過這條路線的極端版本。

界線已經很模糊。2026 年分數最高的一批「OCR 模型」其實是兩段式：[MiniCPM-OCR 1.0](/posts/tech/2026-11-23-ai-model-family-minicpm) 與 [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR) 都先用 PaddlePaddle 的 PP-DocLayoutV3 切版面，再把每個區塊交給約 1B 的辨識模型；PaddleOCR-VL 也是版面模型加 VLM 的組合。Marker 2.2 的 `balanced` 模式則反過來，乾淨的文字頁留在 CPU 讀文字層，只把公式、複雜表格、非拉丁文字和掃描頁送給 0.69B 的 Surya 2.5。與其糾結分類，不如看兩件事——**要不要 GPU**、**能不能只跑一部分**。

## 開源陣營現況

### 工具

星數、授權、最新 release 為 2026-11-23 GitHub API 值：

| 工具 | Stars | 程式碼授權 | 最新 release |
|---|---|---|---|
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | 93,046 | Apache-2.0 | v3.7.0（2026-06） |
| [MinerU](https://github.com/opendatalab/MinerU) | 84,169 | Apache-2.0＋附加條款 | 4.2.3（2026-11） |
| [Docling](https://github.com/docling-project/docling) | 70,896 | MIT | v2.151.1（2026-11） |
| [Marker](https://github.com/datalab-to/marker) | 41,024 | Apache-2.0（僅程式碼） | v2.2.0（2026-11） |
| [Surya](https://github.com/datalab-to/surya) | 21,613 | Apache-2.0（僅程式碼） | v0.24.0（2026-11） |
| [olmOCR](https://github.com/allenai/olmocr) | 19,842 | Apache-2.0 | v0.4.27（2026-03） |
| [Chandra](https://github.com/datalab-to/chandra) | 12,744 | Apache-2.0（僅程式碼） | v0.3.0（2026-11） |
| [dots.ocr](https://github.com/studio-dots-ai/dots.ocr) | 9,237 | MIT（GitHub 標示） | 無 release |

三個 repo 搬過家：Marker 從 `VikParuchuri` 移到 `datalab-to`，Docling 從 `DS4SD` 移到 `docling-project`，dots.ocr 從 `rednote-hilab` 移到 `studio-dots-ai`。舊網址都會轉址，但新專案該用新的。

### 模型

2026 年真正的變化在模型這一側：中國廠商與研究機構密集釋出 1B 上下的專用 OCR 模型。下表是 2026-11 在架、下載量或分數有代表性的開放權重模型。OmniDocBench v1.6 欄標「官方榜」的是 [OmniDocBench 官方排行榜](https://github.com/opendatalab/OmniDocBench)的數字，標「自報」的只出現在廠商模型卡；HF 下載數是 Hugging Face 顯示的近 30 天下載量（2026-11-23）。

| 模型 | 參數 | 權重授權 | OmniDocBench v1.6 | HF 30 天下載 | 備註 |
|---|---|---|---|---|---|
| [PaddleOCR-VL-1.6](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6) | 0.96B | Apache-2.0 | 96.34（官方榜） | 9.5 萬 | 2026-05；版面模型＋VLM |
| [MiniCPM-OCR 1.0](https://huggingface.co/openbmb/MiniCPM-OCR-1.0) | 1.3B | Apache-2.0 | 96.44（官方榜） | 29.9 萬 | 2026-10；PP-DocLayoutV3＋區塊辨識 |
| [MinerU2.5-Pro-2605](https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B) | 1.2B | Apache-2.0（HF 標示） | 95.75（官方榜） | 3.3 萬 | 2026-05；MinerU 工具另有附加條款 |
| [GLM-OCR](https://huggingface.co/zai-org/GLM-OCR) | 1.3B | MIT（版面模型 Apache-2.0） | 95.22（官方榜） | 205.8 萬 | 2026-01；本表下載量最高 |
| [Xiaomi-OCR-0](https://huggingface.co/xiaomi-research/Xiaomi-OCR-0) | 0.87B | Apache-2.0 | 96.83（自報） | 3.7 萬 | 2026-09；同時做文件 VQA |
| [Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni) | 5.3B | 騰訊自訂，排除歐盟 | 96.96（自報） | 0.2 萬 | 2026-10；文件之外也吃圖表、音訊、影片 |
| [Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2) | 3.34B | MIT | 未上榜（前代 94.00） | 63.2 萬 | 2026-10；百頁級長文件一次解析 |
| [DeepSeek-OCR 2](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2) | 3.4B | Apache-2.0 | 90.25（官方榜） | 16.8 萬 | 2026-01 |
| [dots.ocr](https://huggingface.co/dots-studio/dots.ocr)／[dots.mocr](https://huggingface.co/dots-studio/dots.mocr) | 3B | MIT＋附加協議 | 90.77（官方榜，dots.ocr） | 31.5 萬／5.4 萬 | dots.mocr 2026-03，能把圖表轉成 SVG |
| [olmOCR 2](https://huggingface.co/allenai/olmOCR-2-7B-1025) | 8.3B | Apache-2.0 | 未標版本（榜上 olmOCR 85.74） | 8.3 萬＋FP8 版 17.7 萬 | 2025-10，Qwen2.5-VL-7B 底座 |
| [Chandra OCR 2](https://huggingface.co/datalab-to/chandra-ocr-2) | 4B 級 | OpenRAIL-M 修改版（$2M 門檻） | 未上榜 | 127.4 萬 | 2026-03 |
| [Surya OCR 2.5](https://huggingface.co/datalab-to/surya-ocr-2.5) | 0.69B | OpenRAIL-M 修改版（$5M 門檻） | 未上榜 | 15.0 萬 | 2026-10；Marker 預設 VLM |
| [Granite-Docling 258M](https://huggingface.co/ibm-granite/granite-docling-258M) | 258M | Apache-2.0 | 未上榜 | 42.3 萬 | Docling VLM 路徑預設模型 |

一句話看版圖：**參數往下掉、分數往上擠**。官方榜前五名全在 1.3B 以下，分數落在 96.3～97.0；同一張榜上 7B 的 olmOCR 是 85.74，DeepSeek-OCR 2（3B）是 90.25。各家細節見站內家族文與模型卡：[olmOCR 2](/posts/tech/2026-11-23-ai-model-family-olmo)、[Unlimited OCR 2](/posts/tech/2026-11-23-ai-model-family-ernie)、[Granite-Docling](/posts/tech/2026-11-23-ai-model-family-granite)。

## 授權：真正的分水嶺

這一層的技術差距在收斂，授權差距卻在擴大。GitHub 頁面上那個 license badge **會騙你**，因為程式碼與模型權重可以是兩套授權，而且同一家廠商的不同模型門檻也不一樣。

先看全貌：

| 類型 | 模型／工具 | 要注意的條款 |
|---|---|---|
| 乾淨的 Apache-2.0／MIT | PaddleOCR-VL-1.6、MiniCPM-OCR 1.0、GLM-OCR、Xiaomi-OCR-0、Unlimited OCR 2、DeepSeek-OCR 2、Granite-Docling、Docling | 兩段式模型要一併看版面模型（PP-DocLayoutV3 為 Apache-2.0） |
| Apache-2.0 附使用指引 | olmOCR 2 | 模型卡寫「intended for research and educational use」並連到 Ai2 Responsible Use Guidelines |
| 寬鬆授權＋附加條款 | MinerU、dots.ocr／dots.mocr | 揭露義務、禁止用途，違反即自動終止 |
| 營收／募資門檻 | Marker、Surya、Chandra、Indra（Datalab） | 門檻依模型不同，另有競品條款 |
| 地區排除 | Youtu-Parsing／Youtu-Parsing-Omni（騰訊） | 不得在歐盟境內使用 |

**MinerU** 的 GitHub API 回傳 `NOASSERTION`，因為它用的是「MinerU Open Source License」：以 Apache-2.0 為底，再加附加條款。翻開 [repo 裡的 LICENSE.md](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)：

> MinerU may be used for commercial purposes without a separate commercial license. However, if you and your Affiliates, on a consolidated basis, meet either of the following thresholds, you must obtain a separate commercial license from [MinerU Team] before continuing such use: a. monthly active users (MAU) exceed 100 million; or b. total monthly revenue exceeds USD 20 million.

門檻遠在天邊，對絕大多數團隊不構成問題。但**第二條與第三條才是實際會踩到的**：基於 MinerU 提供線上服務，必須在產品介面或公開文件的顯著位置標明使用了 MinerU；沒做到揭露義務、或超過門檻卻未取得授權，「本許可及本許可項下授予您的全部權利將自動終止，且許可方無須另行通知」。是自動終止，不是先寄警告信。要注意 MinerU2.5-Pro 權重在 Hugging Face 上標的是 Apache-2.0，附加條款寫在 MinerU 工具的 repo；直接拿權重、不用 MinerU 工具時套哪一份，兩邊都沒交代，商用前值得問清楚。

**dots.ocr／dots.mocr** 是 GitHub 與 Hugging Face 都標 MIT，但 Hugging Face repo 裡另有一份「dots.ocr LICENSE AGREEMENT」（dots.mocr 是同一份換名字）。它寫明「subject to the MIT License」，商用、SaaS、地端部署都明文允許，但第 3.3 條列了禁止用途，違反即自動終止授權。其中兩條跟文件解析場景直接相關：未經授權不得把出版品數位化或大量掃描；未經合法授權不得抽取身分證號、病歷等敏感個資。做合約、病歷、書籍掃描的團隊，光看 MIT badge 會漏掉這兩條。

**Marker／Surya／Chandra／Indra**（Datalab 出品）的結構是 repo 裡兩個檔案：`LICENSE` 是標準 Apache-2.0（管程式碼），模型權重另走改過的 AI Pubs OpenRAIL-M。只看 GitHub 頁面上那個 Apache-2.0 badge，會完全錯過後者。逐一讀過各模型的授權全文，免費門檻（上一年度總營收**與**累計募資都要低於門檻；個人與研究用途不受限）依模型不同：

| 模型 | 免費門檻 | 授權全文 |
|---|---|---|
| Chandra OCR 2 | **$2M** | [chandra-ocr-2 LICENSE](https://huggingface.co/datalab-to/chandra-ocr-2/blob/main/LICENSE) |
| Marker、Surya OCR 2.5 | **$5M** | [Marker MODEL_LICENSE](https://github.com/datalab-to/marker/blob/master/MODEL_LICENSE)、[surya-ocr-2.5 LICENSE](https://huggingface.co/datalab-to/surya-ocr-2.5/blob/main/LICENSE) |
| Indra OCR（CPU 用的小型 ONNX 模型） | **$20M** | [indra-ocr LICENSE](https://huggingface.co/datalab-to/indra-ocr/blob/main/LICENSE) |

這一版的 [Datalab on-prem 文件](https://documentation.datalab.to/docs/on-prem/overview)已改成跟授權檔一致的說法（Chandra $2M、Marker 與 Surya $5M，程式碼 Apache 2.0）。之前 README 寫 $5M、on-prem 文件寫 $2M 又寫成 GPL 的矛盾，其實是把不同模型的門檻混在一起講。另外三份授權都有同一條競品條款：只要你（或你的雇主、關係企業）提供跟 Datalab 競爭的產品或服務，不論營收多少都不在免費範圍。做文件解析 API 的公司，這條比金額門檻更早踩到。

**Youtu-Parsing／Youtu-Parsing-Omni**（騰訊優圖）的 [LICENSE](https://huggingface.co/tencent/Youtu-Parsing-Omni/blob/main/LICENSE) 正文是 Apache-2.0 的結構，但第 0 條寫明「Youtu-Parsing IS NOT INTENDED FOR USE WITHIN THE EUROPEAN UNION」，並規定衝突時以這條為準。有歐盟客戶或歐盟機房的團隊直接排除。

**Docling** 是 MIT，預設 VLM Granite-Docling 是 Apache-2.0。對商業部署來說，這仍是工具清單裡最乾淨的一個——IBM Research 出品，這點不意外。

順帶提醒：[上一篇](/posts/ai/2026-08-06-pdf-text-extraction-libraries)講的 PyMuPDF 是 AGPL-3.0。整條 pipeline 裡只要有一個 AGPL 元件，SaaS 場景就得重新評估。

## Benchmark 怎麼讀

### OmniDocBench：前段已經擠在一起

OmniDocBench v1.6 是 2026 年各家發表 OCR 模型時最常報的分數。官方榜前五名：OXR-1.0 97.03、TeleOCR 96.91、OvisOCR2 96.47、MiniCPM-OCR 1.0 96.44、PaddleOCR-VL-1.6 96.34——五個模型差 0.69 分，全在 1.3B 以下。Youtu-Parsing-Omni（96.96）與 Xiaomi-OCR-0（96.83）的分數只出現在自家模型卡，沒有進官方榜。

讀這張榜要打三層折：

1. **分數已經接近飽和。** 前段差距小於子項之間的差距，例如 MiniCPM-OCR 的公式 CDM 98.08 最高、表格 TEDS 94.40 卻落後 TeleOCR 的 96.82。你的語料以表格為主還是公式為主，挑出來的模型會不一樣。
2. **出題的人也有產品。** OmniDocBench 由 OpenDataLab 維護，也就是 MinerU 的團隊；官方榜上 MinerU2.5-Pro 排第六，沒有獨占榜首，但結構性關係存在。
3. **自報與官方榜要分開看。** 自報分數用的是廠商自己的推論設定，榜上數字是官方用統一腳本跑的。

### olmOCR-bench 與 OmniParseBench：Datalab 的兩把尺

olmOCR-bench 仍是英文 PDF 場景最常引用的基準。依 [Marker README](https://github.com/datalab-to/marker) 用官方 checker 跑出的數字，Marker 2.2 的 `vllm` 模式 83.7、`balanced` 76.0、純 CPU 的 `fast` 66.6，Docling 50.3；Chandra OCR 2 自報 85.8，olmOCR 2 自報 82.4。Datalab 這一輪還推出自己的 OmniParseBench（2,937 頁、16,288 項判定、92 種語言），Marker `vllm` 85.9、`balanced` 80.5、Docling 67.5。

看起來很清楚，但同樣要打兩層折：

1. **這是 Datalab 自己的 benchmark，Marker 是他們的產品。** 跟[前面對 anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown) 與 ParseBench 用的是同一把尺——作者的產品拿第一，結構性偏誤存在。olmOCR-bench 本身是 Ai2 的，但 Ai2 README 上的官方表格停在 olmOCR v0.4.0 那一輪，之後的新分數幾乎都是各家自己跑的。
2. **模式決定失敗形態，不只是分數高低。** 同一份 README 的分類分數，arXiv 數學類別 `balanced` 83.9、`fast` 23.4、`no_ocr` 直接 0.0。README 也證實了機制——`--disable_ocr`（等同 `no_ocr`）「Never call the VLM - pure text-layer extraction (equations and scanned pages are skipped)」。也就是說「快幾倍」的代價不是均勻掉幾分，而是某一整類文件完全失效。

順帶一提，這也讓 Marker 的 `no_ocr` 模式在架構上其實掉回了[抽取層](/posts/ai/2026-08-06-pdf-text-extraction-libraries)——關掉 VLM 之後它就是在讀文字層。這不是缺點，是印證了三層階梯的邏輯：便宜的路徑之所以便宜，就是因為它沒在做推斷。

這正是解析層 benchmark 最容易誤導的地方：**總分接近的兩個工具，失敗的地方可能完全不同**。你的語料如果全是掃描的舊文件，該看的是那個分類的分數，不是總分。

## 商業 API

LlamaParse、Azure Document Intelligence、Google Document AI、AWS Textract、Reducto、Mistral OCR 都在這一層，邏輯是付費買準確度與免維護。Mistral OCR 至今只有 API，Hugging Face 上沒有開放權重。各家價格與能力的完整比較見[商業文件解析 API 比較](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison)。

依 [ParseBench](https://github.com/run-llama/ParseBench)（arXiv [2604.08538](https://arxiv.org/abs/2604.08538)）的 leaderboard，LlamaParse Agentic 總分 84.88、每頁約 1.25¢，領先 Azure Document Intelligence 的 73.8（2026-08 的 v1 分數；v1 之後重新計分，2026-11 改看 ParseBench 2，見[商業 API 橫評](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison)）。但同樣的警告要再說一次：ParseBench 由 LlamaIndex 製作，榜首正是他們自家產品。

比較實際的判準是**你的量體**。每頁 1¢ 在一萬頁的專案是 $100，可以不用想；在一千萬頁的 ingestion 是 $100,000，那就該自己養 GPU。開源方案的成本是工程時間加硬體，商業 API 的成本是每頁單價——交叉點通常落在幾十萬頁的量級。1B 級模型把自建的硬體門檻拉低到單張消費級 GPU，這個交叉點正在往下移。

## 選型

1. **先讀 LICENSE，而且要讀到權重那一份**（`LICENSE` 管程式碼、`MODEL_LICENSE` 或 Hugging Face repo 裡的授權檔管權重）。閉源 SaaS 且營收會成長 → 工具選 Docling（MIT），模型從 PaddleOCR-VL、MiniCPM-OCR、GLM-OCR 這群 Apache／MIT 裡挑；MinerU 記得揭露義務；dots.ocr 看清楚禁止用途；Datalab 系列先對照自己的營收、募資與是否算競品；有歐盟業務避開 Youtu-Parsing。
2. **再看你的語料類型**。學術 PDF（公式、雙欄）→ MinerU 或公式分數高的 1B 模型；一般商業文件要吞吐 → Marker `balanced`；要結構化 JSON 而不只 Markdown → Docling；中文、掃描或翻拍的文件 → PaddleOCR-VL、MiniCPM-OCR、Xiaomi-OCR-0 這群在 Real5-OmniDocBench（掃描、彎曲、翻拍、光照、歪斜）上分數高的模型；上百頁的長文件 → Unlimited OCR 2。
3. **量體決定自建或買**。幾十萬頁以下先用商業 API 把產品做出來，成本可預測；超過再考慮自建。
4. **不要只跑總分**。拿你自己語料裡最難的那 20 份跑一遍，看它們壞在哪——[掃描 PDF 實測](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)就是這樣做的：2026-08 用 4 份掃描考古題跑 10 種工具，結果 VLM 類在公式場景全面碾壓，但安裝踩坑才是真正的門檻。那次實測早於本文表格裡多數新模型，它們沒有納入。

## 整體來說

這一層是三層階梯裡最貴、最慢、最不確定的一層，所以最重要的決定其實是**盡量少用它**——[抽取層](/posts/ai/2026-08-06-pdf-text-extraction-libraries)能解的別送上來，[轉換層](/posts/ai/2026-08-06-anydoc-rust-document-markdown)能解的更不用說。

真的走到這裡時，順序是：LICENSE → 你的語料 → benchmark 的分類分數 → 自己跑一遍。把 benchmark 總分排名放在第一位，是這一層最常見的選型錯誤——尤其在前五名差不到 1 分的現在。

技術會繼續收斂，但授權條款不會自己變好。

## 更新紀錄

- 2026-11-23：模型清單更新到 2026-11。新增「模型」對照表（PaddleOCR-VL-1.6、MiniCPM-OCR 1.0、MinerU2.5-Pro-2605、GLM-OCR、Xiaomi-OCR-0、Youtu-Parsing-Omni、Unlimited OCR 2、DeepSeek-OCR 2、dots.ocr／dots.mocr、olmOCR 2、Chandra OCR 2、Surya OCR 2.5、Granite-Docling），工具表改為 2026-11-23 的 GitHub 數字與最新 release；授權段補上授權類型總表、dots.ocr 附加協議的禁止用途、Youtu-Parsing 的歐盟排除，並依各模型授權全文改寫 Datalab 門檻（Chandra $2M、Marker／Surya $5M、Indra $20M，加競品條款），Datalab on-prem 文件與 README 的矛盾已由官方文件更正；benchmark 段改用 Marker README 一手數字（Marker 2.2 四種模式），新增 OmniDocBench v1.6 官方榜的讀法；MinerU 改為 2605 版且移除未能重新核對的舊分數；標明掃描 PDF 實測為 2026-08 結果。

## 參考資料

- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [MinerU Open Source License 原文（LICENSE.md）](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)
- [opendatalab/MinerU2.5-Pro-2605-1.2B — Hugging Face 模型卡](https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [ibm-granite/granite-docling-258M — Hugging Face 模型卡](https://huggingface.co/ibm-granite/granite-docling-258M)
- [datalab-to/marker — GitHub（README 含 OmniParseBench 與 olmOCR-bench 數字）](https://github.com/datalab-to/marker)
- [Marker MODEL_LICENSE](https://github.com/datalab-to/marker/blob/master/MODEL_LICENSE)
- [datalab-to/surya — GitHub](https://github.com/datalab-to/surya)
- [datalab-to/surya-ocr-2.5 — Hugging Face 模型卡](https://huggingface.co/datalab-to/surya-ocr-2.5)
- [datalab-to/chandra — GitHub](https://github.com/datalab-to/chandra)
- [datalab-to/chandra-ocr-2 — Hugging Face 模型卡與 LICENSE](https://huggingface.co/datalab-to/chandra-ocr-2)
- [datalab-to/indra-ocr — Hugging Face 模型卡與 LICENSE](https://huggingface.co/datalab-to/indra-ocr)
- [Datalab On-Prem 概覽（含免費層門檻說明）](https://documentation.datalab.to/docs/on-prem/overview)
- [allenai/olmocr — GitHub（olmOCR-bench）](https://github.com/allenai/olmocr)
- [allenai/olmOCR-2-7B-1025 — Hugging Face 模型卡](https://huggingface.co/allenai/olmOCR-2-7B-1025)
- [studio-dots-ai/dots.ocr — GitHub](https://github.com/studio-dots-ai/dots.ocr)
- [dots-studio/dots.ocr — Hugging Face（含 dots.ocr LICENSE AGREEMENT）](https://huggingface.co/dots-studio/dots.ocr)
- [dots-studio/dots.mocr — Hugging Face 模型卡](https://huggingface.co/dots-studio/dots.mocr)
- [PaddlePaddle/PaddleOCR — GitHub](https://github.com/PaddlePaddle/PaddleOCR)
- [PaddlePaddle/PaddleOCR-VL-1.6 — Hugging Face 模型卡](https://huggingface.co/PaddlePaddle/PaddleOCR-VL-1.6)
- [openbmb/MiniCPM-OCR-1.0 — Hugging Face 模型卡](https://huggingface.co/openbmb/MiniCPM-OCR-1.0)
- [zai-org/GLM-OCR — Hugging Face 模型卡](https://huggingface.co/zai-org/GLM-OCR)
- [xiaomi-research/Xiaomi-OCR-0 — Hugging Face 模型卡](https://huggingface.co/xiaomi-research/Xiaomi-OCR-0)
- [tencent/Youtu-Parsing-Omni — Hugging Face 模型卡與 LICENSE](https://huggingface.co/tencent/Youtu-Parsing-Omni)
- [baidu/Unlimited-OCR-2 — Hugging Face 模型卡](https://huggingface.co/baidu/Unlimited-OCR-2)
- [deepseek-ai/DeepSeek-OCR-2 — Hugging Face 模型卡](https://huggingface.co/deepseek-ai/DeepSeek-OCR-2)
- [opendatalab/OmniDocBench — GitHub（v1.6 官方排行榜）](https://github.com/opendatalab/OmniDocBench)
- [ParseBench: A Document Parsing Benchmark for AI Agents（arXiv 2604.08538）](https://arxiv.org/abs/2604.08538)
- [run-llama/ParseBench — leaderboard](https://github.com/run-llama/ParseBench)
- [文件解析的三層階梯：轉換、抽取、解析](/posts/ai/2026-08-06-document-parsing-three-layers)
- [確定性抽取層：不用任何模型，先解決八成的 PDF](/posts/ai/2026-08-06-pdf-text-extraction-libraries)
- [DeepSeek-OCR：把長上下文壓成圖片的 10× 壓縮實驗](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression)
- [掃描 PDF 實測：10 種解析工具丟進考古題，結果差多少？](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)
- [商業文件解析 API 比較](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison)
- [模型卡｜Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni)
- [模型卡｜Baidu Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2)
