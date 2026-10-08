---
title: "微軟 AI-200（Azure AI Cloud Developer）備考路徑：名字有 AI，考的是後端工程師怎麼把 AI 應用撐起來"
date: 2026-10-08
type: guide
category: ai
tags: [certification, azure, rag, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 26
tldr: "AI-200（Azure AI Cloud Developer Associate）接替 2026 年 7 月 31 日退場的 AZ-204。四塊權重 20–25 / 25–30 / 20–25 / 20–25：容器、資料服務、訊息與 serverless、資安與監控。整份考綱沒有一條在考模型部署、prompt 或 agent，跟 AI 最直接相關的是 Cosmos DB、PostgreSQL pgvector、Managed Redis 三種向量搜尋。官方規格：美國 $165、台灣 $83、120 分鐘、及格 700、13 種語言含繁體中文、效期一年，練習測驗尚未開放。"
description: "微軟 AI-200（Azure AI Cloud Developer Associate）備考指南，依官方 study guide 的四塊技能權重拆解，說明它與 AI-103 的分工、九條官方學習路徑怎麼對應、八週時程的換算依據，以及 study guide 裡殘留的 AZ-204 內容。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-08-microsoft-ai-200-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄，作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)，所有「怎麼準備」都指回微軟官方訓練，不含考古題。查證日期：2026-10-08。

看到「Azure AI Cloud Developer」這個名字，多數人會以為它考的是呼叫模型、寫 prompt、做 agent。打開考綱會發現不是：四塊分別是容器、資料庫、訊息佇列與 serverless、資安與監控。它考的是 AI 應用底下那一層後端。

這張接替的是 **2026 年 7 月 31 日退場的 AZ-204**（Azure Developer Associate），依微軟的[認證退場公告](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)。微軟其他幾張的取捨見[微軟這條線怎麼選](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)。

## 這張適合誰

官方 study guide 的 audience profile：

> you're responsible for contributing to all phases of implementing AI solutions on Azure, with an emphasis on back-end services and components.

接著列了七項要熟的東西：Azure SDK 與在 Azure 上用的第三方 SDK、資料管理服務、監控與除錯、訊息與事件、**向量資料庫**、**Python**、容器化應用。

**適合**：在 Azure 上寫後端、團隊正在把 RAG 或 agent 推上線的工程師。你負責的是讓它跑得穩、查得快、出事看得到，而不是調 prompt。原本打算考 AZ-204 的人，這張就是你現在該看的。

**不適合**：想證明自己會用模型做應用的人，那是 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide) 的範圍。兩張在服務層面幾乎不重疊：AI-103 的考綱裡沒有 AKS、Service Bus、KQL；AI-200 的考綱裡沒有 Foundry、agent、模型評估。RAG 與向量搜尋兩邊都有，但 AI-103 從 Foundry 做，AI-200 從資料庫做。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AI-200 |
| 認證名稱 | Microsoft Certified: Azure AI Cloud Developer Associate |
| 費用 | 美國 **$165 USD**、台灣 **$83 USD**（依考場所在國家定價） |
| 時間 | 120 分鐘 |
| 題數 | 官方不公布單一考試題數，通用說明是「typically contain between 40-60 questions」 |
| 題型 | 認證頁寫「You may have interactive components to complete as part of this exam」 |
| 及格 | **700**（量尺 1–1,000） |
| 效期 | **1 年**，免費線上續期 |
| 語言 | 13 種，**含繁體中文** |
| 先修 | 無 |

120 分鐘在微軟的[考試時長表](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)裡對應「可能含 lab 的 associate 與 expert 考試」。官方不事先說這張有沒有 lab，但時長是照有 lab 的規格給的。

## 四塊技能權重

| 技能 | 比重 |
|---|---|
| Develop containerized solutions on Azure | 20–25% |
| **Develop AI solutions by using Azure data management services** | **25–30%** |
| Connect to and consume Azure services | 20–25% |
| Secure, monitor, and troubleshoot Azure solutions | 20–25% |

四塊幾乎等重，沒有哪一塊可以放掉。

## 逐塊準備

### Develop containerized solutions on Azure（20–25%）

**官方考什麼**：

- **映像檔與託管**：用 Azure Container Registry 建置、儲存、版本管理映像檔；用 ACR Tasks 建置與執行；把容器部署到 App Service，包含用 App Service 提供環境變數與密鑰。
- **容器編排**：部署到 Azure Container Apps（環境設定與 revision 管理）；在 Container Apps 裡用 **KEDA** 做事件驅動的自動擴展；用 manifest 檔部署到 **AKS**；檢查記錄、事件與端到端連線，監控並除錯 AKS 與 Container Apps 上的方案。

**怎麼準備**：三條官方學習路徑各對一個主題：[Implement container application hosting on Azure](https://learn.microsoft.com/en-us/training/paths/implement-container-app-hosting-azure/)、[Deploy and manage apps on Azure Container Apps](https://learn.microsoft.com/en-us/training/paths/deploy-manage-apps-azure-container-apps/)、[Deploy and monitor applications on Azure Kubernetes Service](https://learn.microsoft.com/en-us/training/paths/deploy-monitor-apps-azure-kubernetes-service/)。動手的最小練習：同一個 API 服務分別部署到 App Service、Container Apps、AKS 三處，然後在 Container Apps 上設一條 KEDA 規則讓它依佇列長度擴展。

### Develop AI solutions by using Azure data management services（25–30%，最重）

這是全卷唯一直接碰到 AI 的一塊，內容是三種資料服務各自的向量搜尋：

| 服務 | 條目重點 |
|---|---|
| **Azure Cosmos DB for NoSQL** | SDK 連線與查詢；用索引政策與一致性等級最佳化查詢效能與 RU 消耗；**儲存 embedding 並執行向量相似度搜尋**；實作 change feed processor |
| **Azure Database for PostgreSQL** | SDK 連線與查詢；schema 與索引策略；**降低 pgvector 的運算負擔**；為向量工作負載設定運算、記憶體與儲存；**向量相似度搜尋，含用 metadata filter 實作 RAG 模式**；連線最佳化 |
| **Azure Managed Redis** | 快取、過期與失效；**向量索引以支援相似度搜尋** |

PostgreSQL 那組有六條，是三者裡最細的，而且是整份考綱唯一出現「RAG」這個詞的地方。

**怎麼準備**：三條學習路徑：[Cosmos DB for NoSQL](https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-cosmos-db/)、[Azure Database for PostgreSQL](https://learn.microsoft.com/en-us/training/paths/develop-ai-solutions-azure-database-postgresql/)、[Azure Managed Redis](https://learn.microsoft.com/en-us/training/paths/enhance-ai-solutions-azure-managed-redis/)。最有效的練習是**把同一批 embedding 分別放進三個服務，各跑一次相似度搜尋**，然後回答三個問題：索引怎麼建、帶 metadata 篩選時查詢怎麼寫、成本單位是什麼（RU、運算規格、記憶體）。考綱把三種服務各列一組條目。三種都做過，才有把握應付跨服務的題目；這是我的推測，官方沒有說會出比較題。

檢索品質本身怎麼評估，這張不考。那部分見站內的[RAG 與檢索評估的考點交集](/posts/ai/2026-08-18-rag-evaluation-exam-domains)。

### Connect to and consume Azure services（20–25%）

**官方考什麼**：

- **訊息與事件**：用 Azure Service Bus 排入並處理後端作業，含 dead-letter queue、訊息、topic 與 subscription；用 Azure Event Grid 做事件驅動流程，含篩選、自訂事件與重試。
- **Azure Functions**：做 serverless API，含 trigger 與 binding；設定與部署 function app。

**怎麼準備**：一條學習路徑 [Integrate backend services for AI solutions](https://learn.microsoft.com/en-us/training/paths/integrate-backend-services-ai-solutions/)（4 個模組）。練習建議做一條完整的非同步流程：HTTP 觸發的 Function 把工作丟進 Service Bus，另一個 Function 消費，失敗三次進 dead-letter queue，完成後發 Event Grid 事件。文件擷取、embedding 產生這類耗時的 AI 作業，實務上就是這樣排的。

### Secure, monitor, and troubleshoot Azure solutions（20–25%）

**官方考什麼**，只有四條：

- 用 **Azure Key Vault** 保護密鑰，含輪替與取用
- 用 **Azure App Configuration** 存取應用設定
- 用 **OpenTelemetry SDK** 追蹤分散式系統
- 寫 **KQL** 查詢分析記錄與指標

這一塊和前一塊一樣只列四條、佔 20–25%，是條目最少的兩塊。官方說條目只是舉例，相關主題也可能出題，所以別只準備這四條的字面。

**怎麼準備**：兩條學習路徑：[Manage application secrets and configuration for AI solutions](https://learn.microsoft.com/en-us/training/paths/manage-app-secrets-configuration/) 與 [Observe and troubleshoot apps on Azure](https://learn.microsoft.com/en-us/training/paths/observe-troubleshoot-apps/)。KQL 一定要自己寫過：把前一塊做的非同步流程接上 OpenTelemetry，然後用 KQL 查出「哪一步最慢」「哪些請求失敗」。

## 八週時程與換算依據

**換算方式**：九條官方學習路徑共 27 個模組，Microsoft Learn 課程目錄標示的時間合計約 36 小時；對應的官方講師課 [AI-200T00-A](https://learn.microsoft.com/en-us/training/courses/ai-200t00) 是五天（AI-103 的講師課是四天）。每一塊都要動手，以每週 6–8 小時估算是八週。

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 study guide + exam sandbox | 先看過互動題型的操作介面 |
| 第 2–3 週 | 容器（20–25%）：三條路徑 | 三種託管方式各做一次 |
| 第 4–5 週 | **資料服務（25–30%）**：三條路徑 | 最重，且三種向量搜尋要並排比較 |
| 第 6 週 | 訊息與 Functions（20–25%） | 一條路徑，做一條完整的非同步流程 |
| 第 7 週 | 資安與監控（20–25%） | 兩條路徑，KQL 要實寫 |
| 第 8 週 | 全面複習 | 練習測驗尚未開放，只能回頭對 study guide 逐條自評 |

已經在 Azure 上維運容器化服務的人，容器與監控兩塊可以壓縮，五到六週可行。

**失敗成本中等**：依微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)，第一次沒過等 24 小時，之後每次間隔 14 天，同一張考試 12 個月內最多 5 次，每次重新付費。

## 這張的已知陷阱

1. **沒有練習測驗。** 認證頁寫「The Practice Assessment for this exam is not currently available」，並說通常在考試結束 beta、正式上線後八週內提供。微軟在 [2026 年 5 月的介紹文](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-azure-ai-cloud-developer-associate-certification/4494116)寫這張當時是 beta、預計 7 月正式上線；認證頁目前沒有標 beta，但也沒有任何官方頁面明說已正式上線，練習測驗也還沒出現。如果仍在 beta，重考規則會不同：beta 期間只能考一次。
2. **study guide 還留著 AZ-204 的內容。** 「Get trained」的連結指向 AZ-204 的考試頁；「Find documentation」列了 Container Instances、Blob Storage、Microsoft Entra ID、API Management、Event Hubs、Queue Storage，這些在技能條目裡一個都沒有，Redis 的連結也還是舊名 Azure Cache for Redis。**以技能條目為準，文件連結區不是考綱。**
3. **AZ-204 的教材只能用一部分。** 從上面殘留的連結可以看出舊考試的範圍；新考綱沒有列的服務就不用讀，新加的三種向量搜尋舊教材不會有。
4. **不要把它當成 AI-103 的替代。** 職缺寫「Azure AI」時多半指的是 AI-103 那種能力。這張證明的是後端與平台能力，履歷上要搭配說明。

## 考完之後：一年效期與免費續期

Associate 級的效期是一年。依[官方續期說明](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)，續期是免費、線上、非監考、開書的評量，只在到期前六個月的窗口內開放；依[續期 FAQ](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification-faq)，過期就得重考正式考試。完整規則在 [AI-103 那篇的續期段落](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)寫過，這裡不重複。

要留意的是它與 AI-103 是兩張獨立的認證，各自有一年效期、各自要續。兩張都拿的人，每年要做兩次續期評量。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-10-08 查證） | 什麼時候要重查 |
|---|---|---|
| 四塊權重 | 20–25 / 25–30 / 20–25 / 20–25 | 每次改版 |
| 費用 | 美國 $165、台灣 $83 | 每半年 |
| 練習測驗 | 尚未開放 | 每月 |
| study guide 的殘留連結 | 訓練連結指向 AZ-204、文件區為舊服務 | 微軟修好時 |
| 學習路徑數量 | 九條、27 個模組 | 每季 |

## 參考資料

- [Azure AI Cloud Developer Associate 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/)
- [AI-200 官方 study guide（技能目標全文與權重）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200)
- [AI-200T00-A 講師課程頁（九條學習路徑的來源）](https://learn.microsoft.com/en-us/training/courses/ai-200t00)
- [Azure Developer Associate（AZ-204）認證頁，已標示退場](https://learn.microsoft.com/en-us/credentials/certifications/azure-developer/)
- [微軟認證退場公告（AZ-204 → AI-200 對照表）](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)
- [微軟認證續期規則](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [考試時長與考場體驗說明](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)

**站內相關**

- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [微軟 AI-901 備考路徑](/posts/ai/2026-10-08-microsoft-ai-901-prep-guide)
- [微軟這條線怎麼選](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)
- [RAG 與檢索評估的考點交集](/posts/ai/2026-08-18-rag-evaluation-exam-domains)
