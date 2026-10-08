---
title: "微軟 AI-300（Machine Learning Operations Engineer）備考路徑：一張考試考兩套維運，MLOps 與 GenAIOps 各佔一半"
date: 2026-10-08
type: guide
category: ai
tags: [certification, azure, mlops, machine-learning, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 27
tldr: "AI-300（Machine Learning Operations Engineer Associate）接替 2026 年 6 月 1 日退場的 DP-100。五塊權重 15–20 / 25–30 / 20–25 / 10–15 / 10–15：前兩塊是 Azure Machine Learning 上的傳統 MLOps，合計 40–50%；後三塊是 Microsoft Foundry 上的 GenAIOps，合計 40–55%。官方點名 MLflow、Bicep、Azure CLI、GitHub Actions。官方規格：美國 $165、台灣 $83、120 分鐘、及格 700、效期一年，考試只有英文。"
description: "微軟 AI-300（Machine Learning Operations Engineer Associate）備考指南，依官方 study guide 的五塊技能權重拆解，說明傳統 MLOps 與 GenAIOps 兩半各考什麼、兩條官方學習路徑怎麼配、六週時程的換算依據，以及它與退場的 DP-100 的關係。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-08-microsoft-ai-300-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄，作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-300)，所有「怎麼準備」都指回微軟官方訓練，不含考古題。查證日期：2026-10-08。

微軟的 Azure Data Scientist Associate（DP-100）已於 **2026 年 6 月 1 日退場**，依[認證退場公告](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)，接手的是 AI-300。認證名稱從「Data Scientist」變成「Machine Learning Operations Engineer」，這個改名已經說明了方向：它考的是把模型送上線並維持運作，而且同時涵蓋傳統機器學習與生成式 AI 兩種。

微軟其他幾張的取捨見[微軟這條線怎麼選](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)。

## 這張適合誰

官方 study guide 的 audience profile 要求三種背景同時成立：

> You should have a data science background with experience in Python programming and an entry-level understanding of DevOps practices, including using tools like GitHub Actions and working with command-line interfaces (CLIs).

資料科學背景、Python、入門程度的 DevOps。它還列了四項要有經驗的工具：Azure Machine Learning、Foundry、GitHub Actions、用 Bicep 與 Azure CLI 做基礎架構即程式碼（IaC）。

**適合**：ML 工程師、平台工程師，以及正在從「訓練模型」轉向「維運模型」的資料科學家。公司同時有傳統 ML 模型與生成式 AI 應用要顧的人，這張的範圍剛好對上。

**不適合**：只做生成式 AI 應用開發的人，那是 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)；這張有四到五成在考 AutoML、超參數調整、分散式訓練、資料漂移，沒碰過傳統 ML 會很吃力。它也不適合想證明建模與統計能力的人，考綱裡沒有演算法選擇或特徵工程的條目。

其他雲的對應考試是 [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) 與 AWS 的 MLA（見 [AWS 三張怎麼選](/posts/ai/2026-08-19-aws-certifications-which-one)）。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AI-300（Operationalizing Machine Learning and Generative AI Solutions） |
| 認證名稱 | Microsoft Certified: Machine Learning Operations Engineer Associate |
| 費用 | 美國 **$165 USD**、台灣 **$83 USD**（依考場所在國家定價） |
| 時間 | 120 分鐘 |
| 題數 | 官方不公布單一考試題數，通用說明是「typically contain between 40-60 questions」 |
| 題型 | 認證頁寫「You may have interactive components to complete as part of this exam」 |
| 及格 | **700**（量尺 1–1,000） |
| 效期 | **1 年**，免費線上續期 |
| 語言 | **僅英文** |
| 先修 | 無 |

考試只有英文，但講師課 AI-300T00-A 的課程頁列了 12 種語言含繁體中文，所以教材有中文、考試沒有。

## 五塊技能權重

| 技能 | 比重 | 平台 |
|---|---|---|
| Design and implement an MLOps infrastructure | 15–20% | Azure Machine Learning |
| **Implement machine learning model lifecycle and operations** | **25–30%** | Azure Machine Learning |
| Design and implement a GenAIOps infrastructure | 20–25% | Microsoft Foundry |
| Implement generative AI quality assurance and observability | 10–15% | Microsoft Foundry |
| Optimize generative AI systems and model performance | 10–15% | Microsoft Foundry |

前兩塊合計 **40–50%**，後三塊合計 **40–55%**。兩個平台、兩套工具、兩種思維，各佔約一半。只熟其中一邊，另一半的分數足以讓你不及格。

## 逐塊準備

### Design and implement an MLOps infrastructure（15–20%）

**官方考什麼**：

- **工作區資源**：建立與管理工作區、資料存放區（datastore）、運算目標；設定工作區的身分與存取管理。
- **工作區資產**：資料資產、環境、元件（component）；**用 registry 跨工作區共用資產**。
- **IaC**：設定 GitHub 與 Azure Machine Learning 的安全整合；**用 Bicep 與 Azure CLI 部署工作區與資源**；用 GitHub Actions 自動化資源佈建；限制工作區的網路存取；用 Git 管理 ML 專案的原始碼。

**怎麼準備**：這塊要的是「不點入口網站也建得出整套環境」。練習方式是寫一份 Bicep 範本建立工作區、運算與資料存放區，再寫一條 GitHub Actions workflow 去部署它。

### Implement machine learning model lifecycle and operations（25–30%，最重）

**官方考什麼**，照模型的生命週期分四段：

| 階段 | 條目重點 |
|---|---|
| 訓練編排 | **用 MLflow 設定實驗追蹤**；AutoML；notebook 實驗；自動化超參數調整；執行訓練腳本；**大型與深度學習模型的分散式訓練**；訓練 pipeline；跨 job 比較模型表現 |
| 註冊與版本 | **把特徵擷取規格與模型成品一起封裝**；註冊 MLflow 模型；依負責任 AI 原則評估模型；管理模型生命週期含封存 |
| 部署 | 部署成即時或批次端點；測試與除錯端點；**漸進式推出與安全回復** |
| 監控 | **偵測與分析資料漂移**；監控上線模型的效能指標；超過門檻時觸發重新訓練或告警 |

**怎麼準備**：走第一條官方學習路徑 [Operationalize machine learning models (MLOps)](https://learn.microsoft.com/en-us/training/paths/build-first-machine-operations-workflow/)（7 個模組，官方標示約 5.7 小時）。最有效的練習是把一個模型完整走一輪：MLflow 追蹤訓練、註冊、部署成 managed online endpoint、用兩個 deployment 做流量切分再回復、最後設一個資料漂移監控。四段缺任何一段，這塊都會有整組題目答不出來。

### Design and implement a GenAIOps infrastructure（20–25%）

**官方考什麼**：

- **Foundry 環境**：建立與設定 Foundry 資源與專案；用 managed identity 與 RBAC 管身分；網路安全與私有網路；用 Bicep 範本與 Azure CLI 部署。
- **基礎模型的部署與管理**：用 serverless API 端點與 managed compute 部署；依情境選模型；模型版本與正式環境部署策略；**為高流量工作負載設定 provisioned throughput units**。
- **Prompt 版本管理**：設計與開發 prompt；建立 prompt 變體並比較表現；**用 Git 儲存庫做 prompt 版本控制**。

第三組值得注意：這張把 prompt 當成需要版本控制、需要比較變體的工程產物來考。同一個主題在其他證照怎麼考，見站內的[prompt 與 context engineering 的考法](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains)。

**怎麼準備**：這塊和後兩塊共用第二條官方學習路徑 [Operationalize generative AI applications (GenAIOps)](https://learn.microsoft.com/en-us/training/paths/operationalize-gen-ai-apps/)（6 個模組，約 6.1 小時）。部署選項要整理成自己的對照表：serverless API、managed compute、provisioned throughput 各自的計費方式與適用流量。

### Implement generative AI quality assurance and observability（10–15%）

**官方考什麼**：

- **評估**：建立測試資料集與資料對應；實作 AI 品質指標，官方點名 **groundedness、relevance、coherence、fluency** 四項；設定風險與安全評估以偵測有害內容；用內建與自訂指標建立自動化評估流程。
- **可觀測性**：Foundry 的持續監控；延遲、吞吐量、回應時間；**token 消耗與資源用量的成本追蹤**；記錄、追蹤與除錯。

**怎麼準備**：四個品質指標要能各說出「量的是什麼、分數低代表什麼問題」。練習：拿一個 RAG 應用跑一次內建評估，再寫一個自訂指標。

### Optimize generative AI systems and model performance（10–15%）

**官方考什麼**：

- **RAG 最佳化**：調整相似度門檻、chunk 大小與檢索策略；為特定領域挑選並微調 embedding 模型；結合語意與關鍵字的混合搜尋；用相關性指標與 **A/B 測試框架**評估並改善。
- **微調**：設計與實作進階微調方法；**建立與管理微調用的合成資料**；監控微調模型的表現；把微調模型從開發管到正式部署。

**怎麼準備**：RAG 那半段與站內的[RAG 與檢索評估的考點交集](/posts/ai/2026-08-18-rag-evaluation-exam-domains)重疊度高；成本與延遲的取捨見[成本、延遲與可用性的考點交集](/posts/ai/2026-08-18-genai-cost-latency-exam-domains)。微調那半段至少要跑過一次完整流程，包含準備資料這一步。

## 六週時程與換算依據

**換算方式**：兩條官方學習路徑共 13 個模組，Microsoft Learn 課程目錄標示的時間合計約 11.8 小時；官方講師課 [AI-300T00-A](https://learn.microsoft.com/en-us/training/courses/ai-300t00) 是四天。讀的時數不多，但兩個平台都要動手，以每週 6–8 小時估算是六週。

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 study guide + MLOps 基礎架構（15–20%） | Bicep 與 GitHub Actions 是後面兩邊共用的基礎 |
| 第 2–3 週 | **ML 模型生命週期（25–30%）** | 最重，四個階段要完整走一輪 |
| 第 4 週 | GenAIOps 基礎架構（20–25%） | 部署選項與 prompt 版本管理 |
| 第 5 週 | 評估與可觀測性 + 最佳化（合計 20–30%） | 兩塊共用同一條學習路徑 |
| 第 6 週 | 練習測驗 + 補弱 | 見下方 |

只熟其中一半的人，時間要重新分配：做傳統 ML 的把第 2–3 週壓成一週、多給 Foundry 一週；做生成式 AI 的反過來。

**失敗成本中等**：依微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)，第一次沒過等 24 小時，之後每次間隔 14 天，同一張考試 12 個月內最多 5 次，每次重新付費。

**練習測驗**：認證頁說 practice assessment 在 AI Skills Navigator 上，要登入才能啟動。頁面沒有說明是否免費。

## 這張的已知陷阱

1. **DP-100 的教材只對得上一半。** 舊認證叫 Data Scientist，新認證叫 MLOps Engineer；Foundry 那三塊（40–55%）是舊教材不會有的。
2. **study guide 的文件連結區放錯了。** 「Find documentation」列的是 Microsoft 365 Copilot 文件、Microsoft 365 文件；社群連結也指向 Microsoft 365 Copilot 社群。這些與 Azure Machine Learning、Foundry 都無關，是套錯範本。**文件請直接找 Azure Machine Learning 與 Microsoft Foundry 的官方文件。**
3. **「AIOps」在這裡的意思不同。** 官方把 MLOps 加 GenAIOps 合稱 AI operations（AIOps）。業界講 AIOps 通常指「用 AI 做 IT 維運」，是另一件事，搜尋教材時會混在一起。
4. **考試只有英文。** 課程教材有繁體中文，但考試沒有。依微軟的規定，考試沒有你偏好的語言時可以申請多 30 分鐘。

## 考完之後：一年效期與免費續期

Associate 級的效期是一年。依[官方續期說明](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)，續期是免費、線上、非監考、開書的評量，只在到期前六個月的窗口內開放，過期就得重考正式考試。完整規則在 [AI-103 那篇的續期段落](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)寫過。

已經持有 DP-100 的人要注意：依退場公告，DP-100 的認證與續期評量都已退場，舊認證到期後沒有續期這條路，要維持就得考 AI-300。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-10-08 查證） | 什麼時候要重查 |
|---|---|---|
| 五塊權重 | 15–20 / 25–30 / 20–25 / 10–15 / 10–15 | 每次改版 |
| 費用 | 美國 $165、台灣 $83 | 每半年 |
| 考試語言 | 僅英文 | 每季 |
| 練習測驗是否免費 | 官方未說明（在 AI Skills Navigator） | 登入即可確認 |
| study guide 文件連結區 | 指向 Microsoft 365 Copilot | 微軟修好時 |

## 參考資料

- [Machine Learning Operations Engineer Associate 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/operationalizing-machine-learning-and-generative-ai-solutions/)
- [AI-300 官方 study guide（技能目標全文與權重）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-300)
- [AI-300T00-A 講師課程頁](https://learn.microsoft.com/en-us/training/courses/ai-300t00)
- [學習路徑：Operationalize machine learning models (MLOps)](https://learn.microsoft.com/en-us/training/paths/build-first-machine-operations-workflow/)
- [學習路徑：Operationalize generative AI applications (GenAIOps)](https://learn.microsoft.com/en-us/training/paths/operationalize-gen-ai-apps/)
- [Azure Data Scientist Associate（DP-100）認證頁，已標示退場](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/)
- [微軟認證退場公告（DP-100 → AI-300 對照表）](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)
- [微軟認證續期規則](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**站內相關**

- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [微軟 AI-200 備考路徑](/posts/ai/2026-10-08-microsoft-ai-200-prep-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [RAG 與檢索評估的考點交集](/posts/ai/2026-08-18-rag-evaluation-exam-domains)
- [微軟這條線怎麼選](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)
