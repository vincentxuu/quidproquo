---
title: "微軟 AI-901（Azure AI Fundamentals）備考路徑：入門級，但過半在考你會不會用 Foundry 做出東西"
date: 2026-10-08
type: guide
category: ai
tags: [certification, azure, microsoft-foundry, generative-ai, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 25
tldr: "AI-901 取代 2026 年 6 月 30 日退場的 AI-900，同樣叫 Azure AI Fundamentals，但考綱只剩兩塊：觀念 40–45%、用 Microsoft Foundry 實作 55–60%。官方要求會 Python，條目寫的是「用 Foundry SDK 做一個輕量 chat client」「建立並測試單一 agent」。官方規格：美國 $99、台灣 $50、45 分鐘、及格 700、13 種語言含繁體中文，而且入門級認證不會過期。"
description: "微軟 AI-901（Azure AI Fundamentals）備考指南，依官方 study guide 的兩塊技能權重拆解，說明它與退場的 AI-900 差在哪、兩條官方學習路徑怎麼配、三週時程的換算依據，以及入門級認證不過期的規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-08-microsoft-ai-901-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄，作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901)，所有「怎麼準備」都指回微軟官方訓練，不含考古題。查證日期：2026-10-08，對照的是「Skills measured as of **April 15, 2026**」那一版。

Azure AI Fundamentals 這張認證還在，但考試換了。**AI-900 已於 2026 年 6 月 30 日退場**，現在要拿這張認證只能考 AI-901。名字一樣，考綱不一樣：新版有一半以上在考「用 Microsoft Foundry 做出東西」，而且官方明寫要會 Python。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)。微軟其他幾張的取捨見[微軟這條線怎麼選](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)。

## 這張適合誰

官方 study guide 的 audience profile 很短：

> you're at the beginning of your career in AI solution development… You also need knowledge of Python coding syntax and programming techniques, and you should be familiar with Azure resources.

**適合**：剛開始寫 AI 應用、公司用 Azure、想用一張便宜的考試確認自己對 Foundry 有基本掌握的人。它也是 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide) 的暖身：AI-901 的四個實作主題（生成式與 agent、文字與語音、視覺、資訊擷取）對得上 AI-103 五塊裡的後四塊，只是深度不同；AI-103 另有一塊規劃與管理（25–30%）是 AI-901 沒有的。

**不適合**：完全不寫程式的人。舊的 AI-900 是純觀念考試，業務、PM 都能考；AI-901 的條目裡有「Create a lightweight chat client application by using the Foundry SDK」。不寫程式又想要一張 AI 入門認證的人，微軟另有商務線的 AB-730 與 AB-731，那兩張不在本文範圍。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AI-901（Microsoft Azure AI Fundamentals） |
| 認證名稱 | Microsoft Certified: Azure AI Fundamentals |
| 費用 | 美國 **$99 USD**、台灣 **$50 USD**（依考場所在國家定價，認證頁的國家選單可切換） |
| 時間 | **45 分鐘**（官方[考試時長表](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)的 Fundamentals 類，座位時間 65 分鐘） |
| 題數 | 官方不公布單一考試題數，通用說明是「typically contain between 40-60 questions」 |
| 及格 | **700**（量尺 1–1,000） |
| 效期 | **不會過期** |
| 語言 | 13 種，**含繁體中文** |
| 先修 | 無 |

台灣價只有美國的一半，這點值得先知道：同一張考試，在台灣考場報名是 $50。

## 兩塊技能權重

| 技能 | 比重 |
|---|---|
| Identify AI concepts and capabilities | 40–45% |
| **Implement AI solutions by using Microsoft Foundry** | **55–60%** |

第二塊的動詞是 implement、create、build、deploy。這是入門級考試少見的寫法，也是 AI-901 和 AI-900 最大的差別。

## 逐塊準備

### Identify AI concepts and capabilities（40–45%）

**官方考什麼**，分三組：

- **負責任 AI 的六項原則**：公平、可靠與安全、隱私與資安、包容、透明、問責，每項一條。
- **模型的組成與設定**：生成式模型怎麼運作、依能力挑對模型、挑對部署選項與設定參數。
- **辨識 AI 工作負載**：生成式與 agentic AI、文字分析、語音、電腦視覺、資訊擷取各自的情境；文字分析的常見技術（關鍵字擷取、實體偵測、情緒分析、摘要）；語音辨識與語音合成的功能；電腦視覺與影像生成模型的功能；從文字、圖片、音訊、影片擷取資訊的技術。

**怎麼準備**：這塊是觀念題，走第一條官方學習路徑 [AI concepts for developers and technology professionals](https://learn.microsoft.com/en-us/training/paths/ai-concepts/)（7 個模組，官方標示約 3.9 小時）即可。六項原則建議各配一個自己想得出來的反例：條目的寫法是「描述某項原則在 AI 方案裡的考量」，能舉例比能背定義有用。

### Implement AI solutions by using Microsoft Foundry（55–60%）

**官方考什麼**，四組各對應一種工作負載：

| 子題 | 條目重點 |
|---|---|
| 生成式 AI 應用與 agent | 寫有效的 system 與 user prompt；在 Foundry 入口網站部署模型並互動；**用 Foundry SDK 做輕量 chat client**；**在入口網站建立並測試單一 agent**；為 agent 做輕量用戶端 |
| 文字與語音 | 做含文字分析的輕量應用；用已部署的多模態模型回應語音提示；用 Azure Speech in Foundry Tools 做輕量應用 |
| 視覺與影像生成 | 用多模態模型解讀提示裡的視覺輸入；用生成式模型產生新的視覺輸出；做含視覺能力的輕量應用 |
| 資訊擷取 | 用 Azure Content Understanding in Foundry Tools 從文件與表單、圖片、音訊與影片擷取資訊；做含資訊擷取能力的輕量應用 |

條目反覆出現「lightweight application」。從條目的寫法看，重點不在設計架構，而在真的把 SDK 接起來跑過一次。

**怎麼準備**：走第二條官方學習路徑 [Get started with AI applications and agents on Azure](https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/)（7 個模組，約 5.6 小時），而且每個模組的練習都要動手做完。最有效的檢查方式是照上表四列各做一個最小程式：一個 chat client、一個語音回應、一個影像解讀、一個文件擷取。四個都跑得起來，這塊就夠了。

## 三週時程與換算依據

**換算方式**：兩條官方學習路徑合計約 9.5 小時（231 分鐘加 337 分鐘，取自 Microsoft Learn 的課程目錄），官方講師課 [AI-901T00-A](https://learn.microsoft.com/en-us/training/courses/ai-901t00) 是一天。把動手練習與複習算進去，以每週 5–6 小時估算是三週。已經在 Foundry 上寫過應用的人，一週足夠。

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 study guide + 第一條學習路徑（觀念） | 觀念題佔 40–45%，先建立名詞 |
| 第 2 週 | 第二條學習路徑 + 四個最小程式 | 實作佔 55–60%，條目要求做出輕量應用 |
| 第 3 週 | 練習測驗 + 補弱 | 見下方關於練習測驗的說明 |

**失敗成本低**：依微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)，第一次沒過等 24 小時，之後每次間隔 14 天，同一張考試 12 個月內最多 5 次。每次都要重新付費，但在台灣是 $50，與 GitHub 的 GH-300 並列本系列失敗成本最低。

**練習測驗**：官方的 practice assessment 已搬到 AI Skills Navigator，要登入才能啟動。study guide 的實用連結表有一列寫「Take a free Practice Assessment」，但那是純文字、沒有連結，退場的 AI-900 指南也有同一列；實際入口的說明沒有提到是否免費，登入後才能確認。

## 這張的已知陷阱

1. **AI-900 的教材不能用。** 舊版五塊（AI 工作負載、機器學習基礎、電腦視覺、NLP、生成式 AI）在新版被重組成兩塊，而且多了實作。教材如果沒有 Foundry SDK 的程式碼，就是舊版的。
2. **認證頁的簡介還是舊的。** [認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/)上 AI-901 的考試描述仍寫「fundamental principles of machine learning on Azure… features of computer vision workloads…」，那是 AI-900 的五塊；同一頁往下的「Assessed on this exam」才是新的兩塊。以 study guide 為準。
3. **study guide 的文件連結區也是舊的。** 「Find documentation」列的是 Anomaly Detector、Language Understanding（LUIS）、Azure Bot Service，這些名詞在技能條目裡一個都沒有。同樣的狀況在 AI-103 的 study guide 也出現過。
4. **繁體中文版會晚更新。** 官方說在地化版本通常在英文版更新後約八週跟上，但不保證。考中文版的人要留意題目用的產品名可能和最新的英文文件有落差。

## 考完之後：不用續期

微軟的[效期政策](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)寫得很直接：

> Microsoft fundamentals Certifications do not expire.

Associate、expert、specialty 級每年要做一次續期評量，入門級不用。這也表示它不會隨考綱更新而失效，但履歷上的價值會隨時間自然遞減：兩年後的面試官看到 2026 年考的 AI-901，看到的是「當時學過」。

下一步通常是 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)。四個實作主題接得上，AI-901 練過的四個最小程式可以直接長成 AI-103 第二塊要的 agent。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-10-08 查證） | 什麼時候要重查 |
|---|---|---|
| 技能目標版本 | Skills measured as of 2026-04-15 | 每季 |
| 兩塊權重 | 40–45 / 55–60 | 每次改版 |
| 費用 | 美國 $99、台灣 $50 | 每半年 |
| 認證頁簡介 | 仍是 AI-900 的五塊描述 | 微軟修好時 |
| 練習測驗 | 在 AI Skills Navigator，需登入；是否免費未確認 | 每半年 |

## 參考資料

- [Azure AI Fundamentals 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-fundamentals/)
- [AI-901 考試頁](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/)
- [AI-901 官方 study guide（技能目標全文與權重）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901)
- [AI-901T00-A 講師課程頁](https://learn.microsoft.com/en-us/training/courses/ai-901t00)
- [學習路徑：AI concepts for developers and technology professionals](https://learn.microsoft.com/en-us/training/paths/ai-concepts/)
- [學習路徑：Get started with AI applications and agents on Azure](https://learn.microsoft.com/en-us/training/paths/get-started-ai-apps-agents/)
- [微軟認證效期政策](https://learn.microsoft.com/en-us/credentials/support/certification-expiration-policy)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [考試時長與考場體驗說明](https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience)
- [微軟認證退場公告（AI-900 → AI-901 對照表）](https://techcommunity.microsoft.com/blog/skills-hub-blog/the-ai-job-boom-is-here-are-you-ready-to-showcase-your-skills/4494128)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [微軟這條線怎麼選](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
