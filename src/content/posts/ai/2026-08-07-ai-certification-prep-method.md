---
title: "AI 證照怎麼準備：先算排考日，再排讀書順序"
date: 2026-08-07
category: ai
tags:
  - certification
  - career
  - aws
  - learning-path
  - azure
  - gcp
lang: zh-TW
type: guide
tldr: "多數準備指南從第一章開始念。這篇反過來：先用重考等待期與成績公布時間往回推算排考日（AWS 失敗要等 14 個日曆天、成績最多 5 個工作天），再照章節權重而不是章節編號排讀書順序，而且開念之前先做一次官方免費練習題定位。以 AIF-C01 為例：五章權重 28/24/20/14/14、及格線 700 分、compensatory scoring 讓弱章不必補滿。"
description: "AI 證照的準備方法：從期限往回推排考日的算法、照章節權重排讀書順序、開念前先做官方練習題定位、事先寫死中止線，並附 AWS AIF-C01 的五週範例與各家準備資源的落差。"
glossary:
  - term: "compensatory scoring"
    aliases: ["補償式計分"]
    definition: "只看總分是否達標的計分方式，不要求每個章節都個別及格。"
    advanced: "與之相對的是 conjunctive scoring（每個章節都要達到門檻）。採用 compensatory scoring 時，高權重章節多拿的分數可以補回低權重章節失去的分數，因此準備策略應該向權重傾斜，而不是平均分配時間。"
    context: "本文用它說明為什麼弱的章節不需要補到滿分。"
    links:
      - label: "AWS Certification: After Testing"
        url: "https://aws.amazon.com/certification/policies/after-testing/"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-07-ai-certification-prep-method-en)

決定一張證照考不考得過的，有兩件事發生在翻開教材之前：**排考日訂在哪一天**，以及**第一週該念哪一章**。多數準備指南跳過這兩件，直接從第一章開始教。

這篇講的是那兩件事的算法。貫穿範例用 [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner)（AIF-C01），因為它的官方數字最完整；方法本身五家都適用。要先決定考哪一張的話，看站內另一篇[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)。

## 第一步：從期限往回推排考日

如果你有任何期限 —— 限時折扣碼、考試券效期、公司報帳的截止日 —— 排考日不是「準備好的那天」，而是算出來的。

公式只有一條：

```
最晚的第一次考試日 = 期限 − 重考等待期 − 成績公布緩衝
```

三個數字都要查官方，因為各家差很多。

**重考等待期。** [AWS 的 After Testing 政策](https://aws.amazon.com/certification/policies/after-testing/)寫：

> If you fail an exam, you must wait **14 calendar days** before you are eligible to retake the exam. There is no limit on exam attempts. However, you must pay the full registration fee for each exam attempt.

微軟寬鬆得多，[AI-103 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)寫：

> If you fail a certification exam, don't worry. You can retake it **24 hours** after the first attempt. For subsequent retakes, the amount of time varies.

同一件事，AWS 是 14 天、微軟是 24 小時。差了兩週的緩衝，排考日自然不一樣。其他廠商的重考規則要各自查，不要套用。

**成績公布緩衝。** AWS 同一頁寫「Final results will be posted to your AWS Certification Account within five business days」。如果你的期限是「必須通過」而不是「必須考完」，這五個工作天也要算進去。

**實際算一次。** 假設某個優惠要求 9 月 30 日前通過 AIF-C01：

| 項目 | 天數 | 往回推 |
|---|---|---|
| 期限 | — | 9/30 |
| 重考等待期 | 14 個日曆天 | 9/16 |
| 成績與排程的緩衝 | 約 4 天 | **9/12** |

所以第一次考試排 9/12，而不是「差不多九月底」。差一週，結果是「沒過還有一次機會」與「沒過就出局」的差別。

**沒有期限的人也要算一次**，因為重考不只花時間還花錢：AWS 明文每次都付全額。把「重考一次的總成本」寫在計畫最上面，後面決定要不要提前排考時會用到。

## 第二步：開念之前，先做一次官方練習題

這步最違反直覺，也最常被跳過：**在還沒念任何東西之前，先做一次官方的免費練習題。**

目的不是練習，是**定位**。你要的不是分數，是「五個章節各錯幾題」這張表 —— 它決定後面幾週的時間怎麼分配。少了這步，讀書計畫的順序就只是照抄別人的建議。

各家給的資源不對稱，這會直接影響你能不能做這件事：

| 廠商 | 開念前可用的免費定位工具 |
|---|---|
| AWS | Official Practice Question Set（20 題，附詳解與推薦資源） |
| Google | 官方 sample questions |
| 微軟 | 只有 Exam Sandbox（體驗考試介面，不是題目）；AI-103 目前**沒有**免費 practice assessment |
| NVIDIA | Exam Blueprint 把每個主題對應到相應課程，可當自評清單 |
| Databricks | exam guide 的 task statement 清單 |

微軟那格是實務上的坑：官方說明寫「Practice Assessments are usually available within 8 weeks of the exam being out of beta and generally available」，所以剛改版的認證會有一段空窗期。這種情況只能退而求其次，拿 exam guide 的 task statement 逐條自問「這條我會不會」。

## 第三步：照權重排，不要照章節編號排

考試指南的章節編號是出題方的分類邏輯，不是你的學習順序。**照權重排。**

AIF-C01 的[官方考試指南](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf)（Version 1.4）列出五章：

| 原始編號 | 章節 | 權重 |
|---|---|---|
| Domain 3 | Applications of Foundation Models | **28%** |
| Domain 2 | Fundamentals of Generative AI | **24%** |
| Domain 1 | Fundamentals of AI and ML | 20% |
| Domain 4 | Guidelines for Responsible AI | 14% |
| Domain 5 | Security, Compliance, and Governance | 14% |

照編號念的人第一週會念 Domain 1（20%），照權重念的人第一週念 Domain 3（28%）。差別在於：**如果計畫中途被工作打斷，你希望已經念完的是哪一章。**

排序還有第二條規則：**記憶型的章節往後放。** Domain 4 和 Domain 5 加起來 28%，內容是責任 AI 與治理 —— 讀起來像法遵文件，工程師本能會略過，但它們是純記憶、投報率最高的部分。把它們排在最靠近考試的兩週，記憶最新鮮。

第三條規則來自計分方式。AWS 的 After Testing 政策寫：

> The exam uses a **compensatory scoring model**, which means that you do not need to achieve a passing score in each section. You need to pass only the overall exam.

及格線是 700 分（滿分 1000）；同一頁列出 Associate 級是 720、Professional 與 Specialty 級是 750。既然只看總分，**弱的章節不需要補到滿**。定位測驗如果顯示某個 14% 的章節特別差，正確做法不是花整週補它，而是把時間投在 28% 那章 —— 同樣的時間，總分回收更快。

## 第四步：事先把中止線寫死

計畫最後一項不是「考試」，是**判斷要不要考的三條線**，而且要在開念之前就寫下來。

以五週計畫為例：

- **第四週模擬考 < 55%** → 落差太大，延後兩週，回頭補權重最高的兩章
- **第五週模擬考 < 70%** → 延一週，只補模擬考標出的弱項
- **第五週模擬考 ≥ 80%** → 照原訂日期考，**不要再多念**

為什麼要事先寫：考前三天的自我評估幾乎一定過度樂觀。那時候你已經投入五週，沉沒成本會推著你去考。事先寫下的數字是唯一能對抗它的東西。

第三條同樣重要。超過 80% 之後繼續刷題的邊際效益很低，而多出來的焦慮會直接影響考試當天的表現。

## 完整範例：AIF-C01 五週計畫

把上面四步合起來，假設每週投入 7 小時、考試日 9/12：

| 週 | 內容 | 產出 |
|---|---|---|
| 第 0 週 | 排考位並確認金額 → 下載 exam guide（記下版本號）→ 註冊免費帳號 → **先做 20 題定位** | 五章的落差表 |
| 第 1 週 | Domain 3 應用 FM（28%） | 「概念 → AWS 服務名」對照表 |
| 第 2 週 | Domain 2 生成式 AI 基礎（24%） | 對照表第二版 |
| 第 3 週 | Domain 1 基礎（20%）+ Domain 4 責任 AI（14%） | 名詞卡 |
| 第 4 週 | Domain 5 安全治理（14%）+ 全範圍複習 + **模擬考第一次** | 弱點清單 |
| 第 5 週 | 補洞 + 模擬考第二次 → 對照中止線 → 考試 | — |

第 0 週把排考放在下載教材之前，是因為考位與價格是外部條件 —— 早一週知道有問題，就多一週可以調整。

那張「概念 → AWS 服務名」對照表值得特別說。已經做過 RAG 或 LLM 應用的人，Domain 2、3 的概念層大多已經有了，真正要補的是廠商的命名：托管基礎模型叫 Amazon Bedrock、托管 RAG 叫 Bedrock Knowledge Bases、輸出過濾叫 Guardrails、偏誤檢測叫 SageMaker Clarify、漂移監控叫 Model Monitor、人工覆核叫 Amazon Augmented AI（後四項是 exam guide 的 Domain 4 明列的服務）。對這類讀者，每週的產出應該是一張對照表，而不是筆記 —— 念法是「這個我會了，AWS 叫它什麼」，不是從零學概念。

## 幾個常見錯誤

**用舊教材。** 這是最貴的一種錯誤，因為它到考場才會發現。Google 的 PMLE 是現成例子：認證頁明寫「This exam was updated to reflect the transition from Vertex AI to Gemini Enterprise Agent Platform」，所有 2026 年中以前的教材用的都是舊名詞。報名前花十分鐘把官方 exam guide 的服務名稱對一遍，比多刷一百題有用。

**先買課再看大綱。** 順序反了。免費資源在多數情況下已經足夠；真正值得付錢的通常只有完整模擬考。

**把年資當報名資格。** [AWS 的 Before Testing 政策](https://aws.amazon.com/certification/policies/before-testing/)寫「All AWS Certifications may be earned without completing specific prerequisites」—— 那些「建議 2 年經驗」是難度標籤，不是門檻。反過來說，也別因為年資夠就跳過定位測驗。

**忘記查考試語言。** 同一家的不同證照語言清單可能不同，讀題速度的影響比多念一週大。

## 這套方法的邊界

它處理的是「時間怎麼分配」，不處理「內容夠不夠」。如果定位測驗顯示你對整個領域都陌生，那不是排程問題 —— 該做的是先累積實作，而不是把五週壓成三週。

考操作細節的證照（例如 AWS 的 MLA-C01 要求實際用過 Amazon SageMaker）尤其如此：沒動手做過就靠刷題硬過，性價比很低，而且證照的意義本來就在那些手感上。

## 參考資料

- [AWS Certification：After Testing 政策（重考等待期、及格線、compensatory scoring、成績公布時間）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification：Before Testing 政策（無先修門檻）](https://aws.amazon.com/certification/policies/before-testing/)
- [AWS Certified AI Practitioner（AIF-C01）認證頁](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AIF-C01 官方考試指南 PDF（Version 1.4，五章權重 28/24/20/14/14）](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf)
- [AWS 考前準備資源總覽（免費練習題集與 Exam Prep 課程）](https://aws.amazon.com/certification/certification-prep/)
- [Microsoft AI-103 考試頁（重考規則、practice assessment 狀態）](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)
- [Google Professional ML Engineer 認證頁（sample questions 與改版說明）](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [NVIDIA NCA-GENL 認證頁（Exam Blueprint）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)
