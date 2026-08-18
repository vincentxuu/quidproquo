---
title: "Google PMLE 備考路徑：考綱重寫後怎麼準備"
date: 2026-08-18
type: guide
category: ai
tags: [certification, gcp, machine-learning, mlops, career]
lang: zh-TW
tldr: "Google Professional ML Engineer 的考綱在 2026 年被重寫，Vertex AI 全面改名為 Gemini Enterprise Agent Platform，舊教材的產品名對不上題目。這篇以官方 exam guide 的六章權重為骨架，逐章列出考什麼、配哪些官方材料、練什麼，並換算成一份看得懂依據的時程。官方規格：$200、兩小時、50–60 題單選加複選、效期兩年、建議 3 年以上業界經驗含 1 年以上 Google Cloud。"
description: "Google Professional Machine Learning Engineer（PMLE）的備考指南，以官方 exam guide 的六章權重（13/16/21/20/18/13）為骨架，逐章對應官方學習路徑、文件與動手練習，附時程換算依據、考綱改名對照，以及續期成本與五折碼規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-google-pmle-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回 [官方 exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)，所有「怎麼準備」都指回官方學習路徑或 Google Cloud 文件，不含考古題。查證日期：2026-08-18。

Google 的 AI 認證只有兩張，工程師能證明能力的只有 Professional Machine Learning Engineer（PMLE）這一張 —— 另一張 Generative AI Leader 官方自己說「for anyone in any job role, with or without hands-on technical experience」，對寫程式的人鑑別度太低。

而 PMLE 現在有個特殊狀況：**名字沒變、價格沒變、官網長得一樣，但考綱被重寫過**。認證頁頂端掛著一行警語：

> This exam was updated to reflect the transition from Vertex AI to Gemini Enterprise Agent Platform, updates to Google Cloud's data and analytics stack, and prioritizes Google Cloud native solutions.

拿 2026 年中以前的教材去考，你會在題目上看到一堆沒學過的產品名。這篇就是照重寫後的考綱，把六章逐一拆成「考什麼、讀什麼、練什麼」。

各家證照的價格、效期與門檻對照，見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

**適合**：公司主力在 Google Cloud，而且你的工作橫跨訓練與上線 —— 不只是把 notebook 跑出結果，還要處理 pipeline、部署、監控。官方建議的經驗值是 **3 年以上業界經驗，其中 1 年以上在 Google Cloud 上設計與管理方案**，這個門檻是認真的：六章裡有 59% 的比重（第 3、4、5 章）落在「把原型變成上線系統」。

**不適合**：想用一張證照證明自己會 GenAI 的人。PMLE 確實把 agentic 與 GenAI 考點塞進來了，但它的骨架仍是傳統 ML 工程 —— 特徵工程、分散式訓練、model registry、training-serving skew 這些都要會。只想學 LLM 應用開發的話，這張的投報率不高。

**也不適合**：公司不在 GCP 的人。這是廠商證照，跨生態系幾乎不加分。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | $200（另計稅） |
| 時間 | 兩小時 |
| 題數與題型 | 50–60 題，**單選與複選混合** |
| 語言 | **英文、日文**（沒有中文） |
| 形式 | 線上監考或 Pearson 考場 |
| 先修條件 | 無 |
| 建議經驗 | 3 年以上業界經驗，含 1 年以上 Google Cloud |
| 效期 | 2 年 |

沒有中文版這件事值得先算進去：六章的 considerations 清單全是英文專有名詞，讀官方 guide 本身就是備考的一部分。

## 六章權重就是你的讀書計畫

| 章節 | 比重 |
|---|---|
| 1. Architecting low-code AI solutions | ~13% |
| 2. Collaborating within and across teams to manage data and models | ~16% |
| 3. Scaling prototypes into ML models | ~21% |
| 4. Serving and scaling models | ~20% |
| 5. Automating and orchestrating ML pipelines | ~18% |
| 6. Monitoring AI solutions | ~13% |

這張表要當成讀書計畫用，不是背下來就好。**第 3、4、5 章合計 59%** —— 訓練、服務、pipeline 自動化，也就是 MLOps 那一塊。很多人把時間花在第 1 章的 BigQuery ML 與 AutoML（只有 13%），因為那部分最容易上手，結果考試時在佔比最高的三章失血。

以下逐章拆。每章的「官方考什麼」直接取自 exam guide 的 considerations 清單。

### 第 1 章：低程式碼 AI 方案（~13%）

**官方考什麼**：用 BigQuery ML 或 Agent Platform AutoML 做分類、迴歸、預測、分群；用 BigQuery ML 做特徵工程與預測；**用 BigQuery fine-tune Gemini 模型**；從 Model Garden 選模型；用 Document AI、Vision、Translate 這類產業 API 建方案；**針對成本、延遲、可用性最佳化 Gemini 應用**。

**讀什麼**：BigQuery ML 的官方文件（`CREATE MODEL` 語法與支援的模型類型）、Model Garden 的模型選擇說明。

**練什麼**：在 BigQuery 裡用 SQL 建一個分類模型並產生預測 —— 這章的題目常在「這個情境該用 BigQuery ML 還是 AutoML」上打轉，動手做過一次就分得出來。另外把一個 Gemini 應用的成本與延遲實際量一次，那是新增考點，光讀不會有感覺。

### 第 2 章：跨團隊管理資料與模型（~16%）

**官方考什麼**：不同資料型態（表格、文字、影像）的組織與探索；**依規模與複雜度選前處理工具**（BigQuery SQL、Dataflow、Apache Spark、記憶體內的 Python 框架）；在 Agent Platform Feature Store 建立與整併特徵；PII 處理；用 Workbench 或 Colab Enterprise 做原型；**用 LLM-as-a-judge 評估 GenAI 方案**；用 Experiments 與 ML Metadata 追蹤模型版本與 lineage。

**讀什麼**：Dataflow 與 BigQuery 的選型指南、Feature Store 文件、Experiments 的 lineage 追蹤。

**練什麼**：**這章最該練的是「選型判斷」而不是操作**。官方 considerations 明寫「choosing the right tool for data preprocessing based on scale and complexity」，題目就是給你一個規模與複雜度的情境要你選 —— 自己整理一張表，把四種前處理工具在資料量、延遲要求、是否需要串流上的分界寫清楚。

LLM-as-a-judge 是新考點，站內的 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks) 有評估方法的細節，可以補這塊的直覺。

### 第 3 章：把原型變成 ML 模型（~21%，最重）

**官方考什麼**：依成本、複雜度、延遲、擴展性選模型型態（ARIMA、DNN、LLM）與產品；**依可解釋性需求選建模技術**；訓練資料的組織與擷取；用不同 SDK 訓練（Agent Platform 自訂訓練、GKE 上的 Kubeflow、AutoML、Tabular Workflows）；**排除訓練失敗**；超參數調校；**fine-tune 基礎模型以及什麼時候該調校**；評估 CPU / GPU / TPU；**用資料平行與模型平行做分散式訓練**。

**讀什麼**：Agent Platform 自訂訓練文件、分散式訓練策略（data parallelism vs model parallelism 的差別與適用時機）、TPU 與 GPU 的選擇指南。

**練什麼**：這章是唯一需要真的訓練東西的部分。找一個自己的資料集走完「notebook 原型 → 自訂訓練 job → 超參數調校 → 註冊進 Model Registry」。**特別練「訓練失敗怎麼查」** —— 官方把 troubleshooting 單獨列成一條 consideration，代表題目會給你錯誤情境要你判斷原因。

### 第 4 章：服務與擴展（~20%）

**官方考什麼**：批次與線上推論的部署（Agent Platform、Model Garden、Cloud Run、GKE）；用預建與自訂容器打包 PyTorch、XGBoost 模型；在 Model Registry 組織與版控模型；**A/B 測試與 canary 部署**；推論前後處理；用 Feature Store 服務特徵；公開與私有 endpoint；**依吞吐量擴展服務後端**；正式環境的模型調校。

**讀什麼**：Agent Platform Inference 的部署與擴展文件、自訂容器的規格要求。

**練什麼**：把第 3 章訓練出來的模型部署成 endpoint，然後做一次版本切換（canary 或 A/B）。**四個部署選項的分界是這章的核心** —— Agent Platform、Cloud Run、GKE、批次推論各自的適用情境，自己寫成一張決策表。

### 第 5 章：pipeline 自動化與編排（~18%）

**官方考什麼**：資料與模型驗證；用受管或非受管服務建 pipeline（Agent Platform Pipelines、Managed Service for Apache Airflow、Agent Platform 上的 Ray）；**確保訓練與服務的前處理一致**；決定重訓練策略；把模型放進 CI/CD/CT pipeline（例如 Cloud Build）。

**讀什麼**：Agent Platform Pipelines 文件、Cloud Build 與 CT（continuous training）的整合。

**練什麼**：把前兩章的東西串成一條 pipeline，並刻意製造一次「訓練與服務前處理不一致」再抓出來 —— 這是 MLOps 的經典錯誤，官方把它列進 considerations，而且第 6 章的 training-serving skew 監控與它是同一件事的兩面。

### 第 6 章：監控 AI 方案（~13%）

**官方考什麼**：**AI 系統的安全**（防資料外流、惡意 prompt、把敏感資料送進 LLM，用 Regex、safety filter、**Model Armor**）；負責任 AI 實踐（偏誤監控）；模型可解釋性；用 Model Monitoring 建立持續評估指標；**監控 training-serving skew、data drift、concept drift、feature attribution drift**；GenAI 方案的監控、測試與評估。

**讀什麼**：Model Monitoring 文件、Model Armor（這是改版後才進考綱的產品，舊教材不會有）。

**練什麼**：四種 drift 的差別要能一句話講清楚，這是考點密度最高的地方。搭配站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer) 可以補 prompt 攻擊那一塊的實務理解。

## 建議時程與它的依據

**換算方式**：以權重直接對應時間配比，再對「需要動手」的章節加權。第 3、4 章要實際訓練與部署，操作時間本身就長，所以各多給半週；第 1、6 章偏概念與選型，讀完文件加練習題即可。

以每週投入 8–10 小時、總共 8 週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀官方 exam guide 全文，做官方 sample questions | 先知道題目長怎樣，避免整個方向讀偏 |
| 第 2 週 | 第 1 章（13%）+ 第 2 章前半 | 低程式碼與資料前處理選型，入門段 |
| 第 3 週 | 第 2 章後半（16%）：Feature Store、Experiments、LLM-as-a-judge | 新考點集中在這裡 |
| 第 4–5 週 | **第 3 章（21%）** | 唯一要動手訓練的章節，兩週 |
| 第 6 週 | **第 4 章（20%）** | 部署與擴展，含一次版本切換實作 |
| 第 7 週 | 第 5 章（18%） | 把前面串成 pipeline |
| 第 8 週 | 第 6 章（13%）+ 全書複習 + 再做一次 sample questions | 監控與安全，收尾 |

**時程寧寬勿緊，因為 PMLE 的失敗成本特別高。** [官方重考政策](https://support.google.com/cloud-certification/answer/9749448)寫，Associate 與 Professional 級**兩年內最多四次**，而且間隔遞增：第一次沒過等 **14 天**，第二次等 **60 天**，第三次沒過要等 **365 天**才能考第四次。換考試語言或改成考場應試都算同一個額度。

這條規則直接改變備考策略：**PMLE 沒有「先去考一次試水溫」這個選項**。對比之下 AWS 的政策是無限次重考、間隔 14 天（代價是每次全額付費），Claude 是 12 個月內 4 次、間隔 14 / 30 / 90 天。三家裡 Google 對「考不過」的懲罰最重，所以上面那張八週表如果你覺得吃力，正確反應是拉長到十週，不是照表硬考。

**這個時程的前提是你已經有官方建議的經驗值。** 沒有 1 年以上 Google Cloud 實務的話，第 3 到 5 章會卡住 —— 那不是多讀兩週能補的，先在專案裡實際跑過一輪比較快。

**官方材料的優先序**：[Machine Learning Engineer 學習路徑](https://www.cloudskillsboost.google/paths/17)（Google Skills 上的官方路徑，含實作 lab）→ [官方 sample questions](https://docs.google.com/forms/d/e/1FAIpQLSeYmkCANE81qSBqLW0g2X7RoskBX9yGYQu-m1TtsjMvHabGqg/viewform) → Google Cloud 產品文件。第三方題庫的風險在下一節。

## 三個會讓你白花 $200 的坑

**第一，舊教材的產品名全部對不上。** 這是這張考試現在最大的風險。考綱裡 Vertex AI 這個詞幾乎消失了：

| 舊名（多數教材仍在用） | 現行考綱用詞 |
|---|---|
| Vertex AI | Gemini Enterprise Agent Platform |
| Vertex AI AutoML | Agent Platform AutoML |
| Vertex AI Workbench | Agent Platform Workbench |
| Vertex AI Feature Store | Agent Platform Feature Store |
| Vertex AI Model Registry | Agent Platform Model Registry |
| Vertex AI Pipelines | Agent Platform Pipelines |
| Vertex AI Prediction | Agent Platform Inference |
| Model Garden | Model Garden（唯一沒改的） |

注意官方連自己的推薦教材都還沒跟上 —— 認證頁「Additional resources」列的 Wiley 官方 study guide，描述裡仍寫著「how to use the Vertex AI platform」。**官方推薦不等於內容是新的**，這條要自己把關。

**第二，把「不直接考程式」誤解成「不用會寫」。** exam guide 的註腳寫「The exam does not directly assess coding skill. If you have a minimum proficiency in Python and SQL, you should be able to interpret any questions with code snippets.」—— 意思是題目裡會出現程式片段要你讀，不是不用會 Python 和 SQL。

**第三，權重反著讀。** 第 1 章最好準備但只有 13%，第 3、4、5 章合計 59% 卻最花時間。時間分配照權重走，不要照舒適度走。

## 考完之後：兩年效期與五折碼

PMLE 是 Professional 級，**效期兩年**，可在到期前 **60 天**開始續期。

續期方式在 2026 年動過，有兩件事會影響你的成本：

**繼續教育續期目前輪不到 PMLE。** [官方續期說明頁](https://support.google.com/cloud-certification/answer/9907853)寫，用 Google Skills 的繼續教育可以加一年效期，表格上 Foundational、Associate、Professional 三級都列了 —— **但同頁但書明確限定只有 CDL、ACE、PCA、PDE 四張有這個選項**，PMLE 不在內。官方說「We plan to add the Google Skills renewal option to the other certifications at a later date」，所以現在仍然只能重考，但這個限制看得出是暫時的。

**續期有五折碼。** 同一頁寫，初次取得認證時會發一組續期五折折扣碼，登入 CM Connect profile 查得到。$200 的續期實際上可以砍半 —— 前提是**別讓證照過期超過 30 天**，超過就得付全額重考。

以 Google 改產品名的頻率，兩年後大概率又是一輪新名詞。把「每兩年 $100（用折扣碼）加一次重新熟悉考綱」算進總成本，再決定這張值不值得。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 考綱版本 | 已反映 Gemini Enterprise Agent Platform 改名 | Google Cloud Next 之後 |
| 六章權重 | 13 / 16 / 21 / 20 / 18 / 13 | 每次考綱更新 |
| 費用與題數 | $200、50–60 題、兩小時 | 每季 |
| 繼續教育續期 | 只開放 CDL / ACE / PCA / PDE | 官方說之後會擴大，值得追 |
| 重考政策 | 兩年 4 次、間隔 14 / 60 / 365 天 | 政策頁標示「recently updated」，會再變 |
| 考試語言 | 英文、日文 | 若加開中文會影響備考難度評估 |

## 參考資料

- [Professional ML Engineer 官方考試指南（六章權重與 considerations 全文）](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer 認證頁（費用、題型、建議經驗）](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [官方 sample questions](https://docs.google.com/forms/d/e/1FAIpQLSeYmkCANE81qSBqLW0g2X7RoskBX9yGYQu-m1TtsjMvHabGqg/viewform)
- [Machine Learning Engineer 官方學習路徑（Google Skills）](https://www.cloudskillsboost.google/paths/17)
- [Google Cloud Certification Renewal（續期方式、五折碼、繼續教育適用範圍）](https://support.google.com/cloud-certification/answer/9907853)
- [Introducing Gemini Enterprise Agent Platform](https://cloud.google.com/blog/products/ai-machine-learning/introducing-gemini-enterprise-agent-platform)
- [Google Cloud Exam Terms & Conditions](https://cloud.google.com/certification/terms)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Claude Certified Architect Foundations 備考指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
