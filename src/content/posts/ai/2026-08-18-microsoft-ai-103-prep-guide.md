---
title: "微軟 AI-103 備考路徑：Foundry 換代之後，舊 Azure AI 教材全部作廢"
date: 2026-08-18
type: guide
category: ai
tags: [certification, azure, generative-ai, agents, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 5
tldr: "AI-103 取代 2026 年 6 月 30 日退場的 AI-102，考綱完全重寫成 Microsoft Foundry 體系——prompt flow、Azure AI Studio、Azure OpenAI Service、Azure AI Agent Service 這些名詞在目標裡一個都沒有。五塊技能權重 25-30 / 30-35 / 10-15 / 10-15 / 10-15，生成式與 agent 佔最大宗。官方規格：$165、120 分鐘、及格 700、有繁體中文、含互動題型，而且效期只有一年——但續期是免費、開書、非監考的線上評量。"
description: "微軟 AI-103（Azure AI Apps and Agents Developer Associate）備考指南，依官方 study guide 的五塊技能權重逐項拆解，說明 Foundry 換代造成的教材失效、六週時程換算依據、一年效期與免費續期評量的規則，以及與退場的 AI-102 的關係。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)，所有「怎麼準備」都指回微軟官方訓練，不含考古題。查證日期：2026-08-18，對照的是「Skills measured as of **April 16, 2026**」那一版。

如果你在找「Azure AI Engineer 認證」，那張已經沒了 —— **AI-102 於 2026 年 6 月 30 日退場**，接手的是 AI-103。而且這不是換個代碼而已：**考綱是整份重寫的**，寫在目標裡的平台叫 Microsoft Foundry。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

官方 study guide 的 audience profile 寫得很具體：

> you're an Azure AI engineer who builds, manages, and deploys agents and AI solutions that take advantage of Microsoft Foundry… you should have experience developing apps by using Python, and you need to be familiar with the capabilities of general AI, generative AI, and Azure services.

**要會 Python**，而且是實際在 Foundry 上建東西的人。這跟 AWS 的 AIF-C01（明講「使用但不一定要會建」）是完全不同的定位。

**適合**：公司用 Azure、你在寫 AI 應用或 agent 的人。**這張有繁體中文**，是本系列裡除了 AWS AIF-C01 之外唯一提供繁中的。

**不適合**：不碰 Azure 的人，以及想證明 ML 建模能力的人 —— 這張沒有模型訓練、特徵工程那一塊，它考的是在 Foundry 上組裝、部署、治理。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AI-103（Developing AI Apps and Agents on Azure） |
| 認證名稱 | Azure AI Apps and Agents Developer Associate |
| 費用 | **$165 USD**（依考試所在國家或地區定價） |
| 時間 | 120 分鐘 |
| 題數 | **官方不公布單一考試的題數**，通用說明是「typically contain between 40-60 questions」 |
| 題型 | **官方不事先揭露**；認證頁只寫「You may have interactive components to complete as part of this exam」 |
| 及格 | **700**（量尺 1–1,000，官方註明「it may not equal 70% of the points」） |
| 效期 | **1 年** |
| 語言 | 10 種，**含繁體中文** |

**效期一年是這張最需要留意的地方**，跟 AWS 的三年、Google 與 NVIDIA 的兩年差一個量級。續期規則在最後一節，先講結論：**續期免費、開書、非監考，但有六個月的窗口，錯過就得整張重考。**

## 五塊技能權重

| 技能 | 比重 |
|---|---|
| Plan and manage an Azure AI solution | 25–30% |
| **Implement generative AI and agentic solutions** | **30–35%** |
| Implement computer vision solutions | 10–15% |
| Implement text analysis solutions | 10–15% |
| Implement information extraction solutions | 10–15% |

**前兩塊合計 55–65%** —— 規劃管理加上生成式與 agent，佔了三分之二。後面三塊（視覺、文字分析、資訊擷取）各只有 10–15%，是傳統 Azure AI 服務的殘留部分。

## Foundry 換代：這節決定你的教材能不能用

微軟這次不是加考點，是**換了整個平台命名體系**。目標裡出現的是：

- **Microsoft Foundry** —— 平台本身（Foundry projects、Foundry SDKs and connectors、Foundry services）
- **Foundry Tools** —— 取代原本個別點名的 cognitive services
- **Azure Content Understanding in Foundry Tools** —— 含「single-task and pro-mode Content Understanding pipelines」與 analyzers
- **Azure Translator in Foundry Tools**

而以下這些名詞，**在整份技能目標裡一次都沒有出現**：prompt flow、Azure AI Studio、Azure OpenAI Service、Azure AI Agent Service、Azure Cognitive Services、LUIS、Semantic Kernel。

**判斷法**：教材如果主要圍繞 Azure AI Studio、prompt flow 或 Azure AI Agent Service 打轉，它講的是 Foundry 之前的世界。

有個諷刺的細節值得知道：**同一頁 study guide 的「Find documentation」連結區塊自己還沒更新** —— 那裡仍然連到 Azure AI services、Azure AI Vision、Azure AI Language（連結甚至指向 `/azure/cognitive-services/luis/`）、Azure OpenAI 等舊命名。**同一頁的目標區與文件連結區不同步**，別把文件連結當成考綱的權威。

另外，這張的 study guide 目前**只有一個版本**（Skills measured as of April 16, 2026），沒有 change log —— 頁面上那句「We have included two versions of the Skills Measured objectives」是模板文字，不是漏掉的區塊。所以判斷教材新舊的方法不是比對版本，而是看它用哪一套產品名。

## 逐塊準備

### Plan and manage an Azure AI solution（25–30%）

**官方考什麼**：為各任務挑對模型（LLM、小型語言模型、多模態、Foundry Tools）；挑對服務做生成、grounding、向量搜尋、agent 工作流、多模態處理；選檢索與索引方式；為 agent 方案選記憶、工具、知識整合服務；設計 AI 應用的 Azure 基礎架構與部署選項；**把 Foundry 專案接進 CI/CD**；管理配額、擴展、速率限制與成本；監控模型效能、drift、安全事件與 grounding 品質；監控資料擷取品質與索引健康度；設定 managed identity、私有網路、**keyless credentials**、角色政策；負責任 AI（安全過濾器、guardrails、風險偵測、內容審核、evaluators、trace logging、provenance metadata、核可流程、**用 oversight modes 與 tool-access controls 治理 agent 行為**）。

**怎麼準備**：這塊表面是「規劃」，實際上考的是**選型判斷**。建議把「什麼情境用哪個 Foundry 服務」整理成自己的決策表，尤其是檢索與索引方式的分界。

### Implement generative AI and agentic solutions（30–35%，最重）

**官方考什麼**：部署與呼叫 LLM、小模型、程式碼模型、多模態模型；**在應用裡實作 RAG**；設計工作流、工具增強流程與多步推理管線；評估模型與應用（偵測 fabrication、相關性、品質、安全）；用 Foundry SDK 與 connector 把生成流程接進應用。

Agent 那半段更具體：定義 agent 角色、目標、對話追蹤方式與**工具 schema**；建立整合檢索、function calling 與對話記憶的 agent；整合 agent 工具（API、知識庫、搜尋、content understanding、自訂函式）；**實作多 agent 編排**；建立帶有防護與核可流程的自主或半自主工作流；把監控接進已部署的 agent，評估行為並做錯誤分析。

最後是最佳化與維運：調整生成行為（prompt 工程、模型參數）；**model reflection、chain-of-thought 評估、self-critique 迴圈**；建立可觀測性（tracing、token 分析、安全訊號、延遲拆解）；編排多模型或 LLM 與規則引擎的混合架構。

**怎麼準備**：這塊要動手。最有效的練習是**在 Foundry 上做一個帶工具的 agent，然後把它的 trace 與 token 分析打開來看** —— 「integrate monitoring into deployed agents」是官方明列的技能，光讀不會。

### 視覺、文字分析、資訊擷取（各 10–15%）

**視覺**這塊在 AI-103 是生成導向的：文字生成圖片與影片、**inpainting 與 mask-based 編輯**、多模態理解與影像問答、**產生符合無障礙規範的 alt-text**、影片分析、用 Content Understanding 擷取視覺特徵；還有多模態的負責任 AI —— 包含**偵測藏在圖片文字裡的間接 prompt injection**。

**文字分析**：用生成式 prompting 與 Foundry Tools 擷取實體、主題、摘要與結構化 JSON；偵測情緒、語氣、安全問題與敏感內容；用 Azure Translator 或 LLM 翻譯；語音（STT、TTS、自訂語音模型、**把語音當成 agent 的一種模態**、音訊多模態推理）。

**資訊擷取**：內容擷取與索引（文件、圖片、音訊、影片）；語意、混合、向量搜尋；用內建或自訂 skill 做 enrichment；**RAG 擷取流程含 OCR**；把檢索管線直接接上工作流與 agent 工具；用多模態管線（OCR + 版面分析 + 欄位擷取）擷取文件；用 Content Understanding 產生結構化或 markdown 輸出。

**怎麼準備**：這三塊合計 30–45%，但每塊個別只有 10–15%，投資報酬比前兩塊低。建議策略是**確保每塊都能過及格線，不追求精通**：把官方學習路徑跑完、對每個服務知道「它解決什麼問題、輸入輸出是什麼」即可。

## 六週時程與換算依據

**換算方式**：這是 associate 級但**要求 Python 實作能力**，第二塊（30–35%）必須動手做 agent。所以時程比純知識型的 [AWS AIF-C01 四週](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)長，但比 professional 級的 [AIP-C01 十週](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)短。

以每週 6–8 小時、共六週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀官方 study guide + 跑 exam sandbox 熟悉互動題型 | 官方不揭露題型，但 sandbox 免費且不用登入 |
| 第 2 週 | Plan and manage（25–30%）：選型與治理 | 選型判斷先建立，後面才有框架掛 |
| 第 3–4 週 | **Implement generative AI and agentic（30–35%）** | 最重且要動手，兩週 |
| 第 5 週 | 視覺 + 文字分析（合計 20–30%） | 兩塊都靠官方學習路徑帶過 |
| 第 6 週 | 資訊擷取（10–15%）+ 全面複習 | RAG 與 OCR 收尾，與第 3–4 週呼應 |

**失敗成本中等**：微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)是第一次沒過等 **24 小時**（比 AWS 的 14 天寬鬆很多），之後每次間隔 **14 天**，**同一張考試 12 個月內最多 5 次**。第一次的門檻低，但別把它當免費試考 —— 每次都要付費。

**官方材料**：四條免費的 Microsoft Learn 學習路徑就是官方講師課 **AI-103T00-A（四天）** 的教材，自學走這四條即可 —— [Develop generative AI apps in Azure](https://learn.microsoft.com/en-us/training/paths/develop-generative-ai-apps/)（6 個模組）、[Develop AI agents on Azure](https://learn.microsoft.com/en-us/training/paths/develop-ai-agents-azure/)（9 個）、[Develop natural language solutions in Azure](https://learn.microsoft.com/en-us/training/paths/develop-language-solutions-azure-ai/)（7 個）、[Extract insights from visual data on Azure](https://learn.microsoft.com/en-us/training/paths/insight-visual-data/)（8 個）。

**練習測驗要注意**：AI-103 的 practice assessment **已經搬離 Microsoft Learn**，改到 AI Skills Navigator，而且要登入才能啟動。**官方頁面沒有說明它是否免費** —— 微軟通用政策說「Some exams have free Practice Assessments… delivered through Learn」，但這張已經不在 Learn 上，所以那句話不適用。想確認只能登入去看。

## 一年效期與免費續期

這是微軟跟其他家最大的制度差異，值得完整讀一次[官方續期說明](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)：

**好的部分**：續期**完全免費**，形式是線上、非監考、**開書**的評量，官方說大約 **45 分鐘**。沒過可以立刻再試，第二次之後才需要間隔 24 小時，**次數無上限**。

**要注意的部分**：

- **效期只有一年**，而且續期評量**只在到期前六個月的窗口內開放**，官方明講不能更早：「Can I renew my certification more than six months before it expires? **No.**」
- 續期成功是**從原到期日往後加一年**，不是從你考的那天算 —— 所以早點考不會吃虧，但也不能提前開始。
- **過期就沒有續期這條路**：「If your certification expires, you must earn the certification again by passing the required exam(s).」而且官方對這條的態度是「**There are no exceptions to this policy.**」
- 通過 beta 考試或重考正式考試**都不能代替續期評量**。

**實際成本模型**：AI-103 是 $165 拿到，之後每年花 45 分鐘做一次免費評量就能一直維持。跟 AWS（三年、重考但有五折券）或 Google（兩年、只能重考 $200）相比，**微軟的長期維護成本最低，但要求你每年記得做這件事** —— 忘記一次就要重付 $165 重考。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 技能目標版本 | Skills measured as of 2026-04-16，尚無 change log | 每季 |
| 五塊權重 | 25-30 / 30-35 / 10-15 / 10-15 / 10-15 | 每次改版 |
| 費用 | $165 USD（美國） | 每半年 |
| 練習測驗是否免費 | **官方未說明**（已搬到 AI Skills Navigator） | 登入即可確認 |
| Foundry 命名 | 目標區已全面改用；同頁文件連結區仍是舊名 | 微軟修好時 |

## 參考資料

- [Azure AI Apps and Agents Developer Associate 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [AI-103 官方 study guide（技能目標全文與權重）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-103)
- [AI-103T00-A 講師課程大綱](https://learn.microsoft.com/en-us/training/courses/ai-103t00)
- [微軟認證續期規則](https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification)
- [微軟認證效期政策](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [考試時長與考場體驗說明（題數與題型的通用說明）](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)
- [微軟認證退場公告（AI-102 → AI-103 對照表）](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS GenAI Developer Professional（AIP-C01）備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
