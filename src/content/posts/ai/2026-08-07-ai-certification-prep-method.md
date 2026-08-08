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
  - ipas
lang: zh-TW
type: guide
tldr: "多數準備指南從第一章開始念。這篇反過來：先用重考規則往回推排考日（AWS 等 14 個日曆天、Google 是 14→60→365 天遞增、微軟 24 小時、iPAS 根本沒有重考、要等半年後的下一梯次），再照章節權重而不是章節編號排讀書順序，而且開念之前先做一次官方免費練習題定位。附七張證照的權重對照與 AIF-C01 五週範例。"
description: "AI 證照的準備方法：各家重考規則的差異與排考日的算法、照章節權重排讀書順序、開念前先做官方練習題定位、事先寫死中止線，涵蓋 AWS、Google、微軟、NVIDIA、Databricks 與 iPAS 的準備資源落差。"
glossary:
  - term: "compensatory scoring"
    aliases: ["補償式計分"]
    definition: "只看總分是否達標的計分方式，不要求每個章節都個別及格。"
    advanced: "與之相對的是 conjunctive scoring（每個章節都要達到門檻）。採用 compensatory scoring 時，高權重章節多拿的分數可以補回低權重章節失去的分數，因此準備策略應該向權重傾斜，而不是平均分配時間。iPAS 中級走的則是相反邏輯：兩科都要各自達到 70 分。"
    context: "本文用它說明為什麼 AWS 證照裡弱的章節不需要補到滿分，而 iPAS 不能這樣算。"
    links:
      - label: "AWS Certification: After Testing"
        url: "https://aws.amazon.com/certification/policies/after-testing/"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-07-ai-certification-prep-method-en)

決定一張證照考不考得過的，有兩件事發生在翻開教材之前：**排考日訂在哪一天**，以及**第一週該念哪一章**。多數準備指南跳過這兩件，直接從第一章開始教。

這篇講那兩件事的算法，涵蓋 AWS、Google、微軟、NVIDIA、Databricks 與 iPAS。要先決定考哪一張的話，看站內另一篇[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)。

## 第一步：從「沒過會怎樣」往回推排考日

排考日不是「準備好的那天」，是算出來的。而算法取決於一件事：**這張證照沒過之後，下一次能在什麼時候考。**

各家差距大到不能互相套用：

| 廠商 | 沒過之後 |
|---|---|
| **微軟** | **24 小時**後就能重考；之後每次間隔 **14 天**，一年最多 5 次 |
| **AWS** | 等 **14 個日曆天**，次數不限，每次付全額 |
| **Google（基礎級）** | 等 **14 天**，一年最多 10 次 |
| **Google（Associate / Professional）** | 第一次沒過等 **14 天**、第二次等 **60 天**、第三次等 **365 天**；兩年最多 4 次 |
| **Databricks** | 等 **14 天**，每次付全額 |
| **NVIDIA** | 等 **14 天**，一年最多 5 次，每次重新購買 |
| **iPAS 中級** | 沒有重考機制，**等下一梯次**（半年） |

**14 天是業界標準** —— AWS、Google、Databricks、NVIDIA 四家都是這個數字。真正的例外是兩端：微軟的 24 小時，和 iPAS 的半年。

[AWS 的 After Testing 政策](https://aws.amazon.com/certification/policies/after-testing/)寫：

> If you fail an exam, you must wait **14 calendar days** before you are eligible to retake the exam. There is no limit on exam attempts. However, you must pay the full registration fee for each exam attempt.

[Google 的考試條款](https://cloud.google.com/certification/terms)則是遞增的：

> If you don't pass the exam, you can take it again after **14 days**. If you don't pass the second time, you must wait **60 days** before you can take it a third time. If you don't pass the third time, you must wait **365 days** before taking it a fourth time.

微軟第一次最寬鬆，但只有第一次。[官方重考政策頁](https://learn.microsoft.com/en-us/credentials/support/retake-policy)寫：

> If you don't pass an exam the first time, you must wait **24 hours** before retaking it. A **14-day waiting period** is imposed between all subsequent attempts (up to 5).

[Databricks 的考試條款](https://www.databricks.com/learn/certification/terms-and-conditions)是「There is a 14-day wait between all attempts. Payment is required each time you take an exam」；[NVIDIA 的認證 FAQ](https://www.nvidia.com/en-us/learn/certification) 同樣是 14 天，並限制「no more than five times per year」。

### 三種期限結構，三種算法

**一、隨時可考，但有外部期限**（限時折扣碼、考試券效期、公司報帳截止日）。這種要往回推：

```
最晚的第一次考試日 = 期限 − 重考等待期 − 成績公布緩衝
```

以 AWS 為例，假設期限是 9 月 30 日前必須「通過」：

| 項目 | 天數 | 往回推 |
|---|---|---|
| 期限 | — | 9/30 |
| 重考等待期 | 14 個日曆天 | 9/16 |
| 成績與重新排程的緩衝 | 約 4 天 | **9/12** |

成績緩衝是因為 AWS 同一頁寫「Final results will be posted to your AWS Certification Account within five business days」。期限若是「必須通過」而非「必須考完」，這五個工作天要算進去。

結論是第一次考試排 9/12，不是「差不多九月底」。差一週，就是「沒過還有一次機會」與「沒過就出局」的差別。

**二、固定梯次**（iPAS）。這種沒有天數可以推，緩衝的單位是「梯次」。依[官方考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)，115 年度中級只考兩場（5/23 與 11/14），第二場個人報名到 9/22 中午 12 點截止。也就是說**這一梯沒過，下一次是半年後**。

固定梯次的準備策略因此完全不同：沒有「延一週再考」這個選項，中止線要提早到報名截止日之前判斷，而不是考前一週。

**三、隨時可考，也沒有外部期限。** 這種人容易覺得不用算，但重考仍要付全額（AWS、Google 都明文如此）。把「重考一次的總成本」寫在計畫最上面，後面決定要不要提前排考時會用到。

## 第二步：開念之前，先做一次官方練習題

這步最違反直覺，也最常被跳過：**在還沒念任何東西之前，先做一次官方的免費題目。**

目的不是練習，是**定位**。你要的不是分數，是「各章節各錯幾題」這張表 —— 它決定後面幾週的時間怎麼分配。少了這步，讀書計畫的順序只是照抄別人的建議。

各家給的資源不對稱，這會直接影響你能不能做這件事：

| 廠商 | 開念前可用的免費定位工具 |
|---|---|
| **iPAS** | **歷屆完整試題 PDF**（官網「[學習資源](https://ipd.nat.gov.tw/ipas/certification/AIAP/learning-resources)」公開到 115 年第一次中級三科），另有官方學習指引與勘誤表 |
| AWS | Official Practice Question Set（20 題，附詳解與推薦資源） |
| Google | 官方 sample questions |
| NVIDIA | Exam Blueprint 把每個主題與權重對應到相應課程，可當自評清單 |
| Databricks | exam guide 的 task statement 清單 |
| 微軟 | 只有 Exam Sandbox（體驗考試介面，不是題目）；AI-103 目前**沒有**免費 practice assessment |

**iPAS 在這格是最大方的一家**，而且多數人不知道：官網「學習資源」頁把歷屆完整試題以 PDF 公開，中級三科都有，還附三科的官方學習指引與勘誤表。用最近一梯的真題當定位測驗，準確度遠高於任何模擬題。

微軟那格則是實務上的坑：官方說明寫「Practice Assessments are usually available within 8 weeks of the exam being out of beta and generally available」，所以剛改版的認證會有一段空窗期。這種情況只能退而求其次，拿 exam guide 的 task statement 逐條自問「這條我會不會」。

## 第三步：照權重排，不要照章節編號排

考試指南的章節編號是出題方的分類邏輯，不是你的學習順序。**照權重排。**

七張證照的官方權重（依各自最新考試指南）：

| 證照 | 各章權重 |
|---|---|
| [AWS AIF-C01](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf) | 應用基礎模型 28、生成式 AI 基礎 24、AI/ML 基礎 20、責任 AI 14、安全與治理 14 |
| [AWS MLA-C01](https://d1.awsstatic.com/training-and-certification/docs-machine-learning-engineer-associate/AWS-Certified-Machine-Learning-Engineer-Associate_Exam-Guide.pdf) | 資料準備 28、模型開發 26、監控維運與安全 24、部署與編排 22 |
| [AWS CLF-C02](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf) | 雲端技術與服務 34、安全與合規 30、雲端概念 24、計費與支援 12 |
| [Google PMLE](https://cloud.google.com/learn/certification/guides/machine-learning-engineer) | 擴展原型 21、服務與擴展模型 20、自動化與編排 18、跨團隊協作 16、低程式碼方案 13、監控 13 |
| [Databricks GenAI Engineer](https://www.databricks.com/learn/certification/genai-engineer-associate) | 應用開發 30、組裝與部署 22、應用設計 14、資料準備 14、評估與監控 12、治理 8 |
| [微軟 AI-103](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/) | 官方只公布五個評測領域，未公布百分比 |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | Exam Blueprint 有列權重，並直接對應到訓練課程 |

照編號念 AIF-C01 的人第一週念 20% 那章，照權重念的人第一週念 28% 那章。差別在於：**如果計畫中途被工作打斷，你希望已經念完的是哪一章。**

排序還有第二條規則：**記憶型的章節往後放。** AIF-C01 的責任 AI 與安全治理加起來 28%，內容讀起來像法遵文件，工程師本能會略過 —— 但它們是純記憶、投報率最高的部分。排在最靠近考試的兩週，記憶最新鮮。

第三條規則來自計分方式，而且**這條會因證照而異**。AWS 的 After Testing 政策寫：

> The exam uses a **compensatory scoring model**, which means that you do not need to achieve a passing score in each section. You need to pass only the overall exam.

及格線是基礎級 700、Associate 級 720、Professional 與 Specialty 級 750（滿分 1000）。既然只看總分，**弱的章節不需要補到滿**。定位測驗如果顯示某個 14% 的章節特別差，正確做法不是花整週補它，而是把時間投在 28% 那章 —— 同樣的時間，總分回收更快。

**iPAS 中級不能這樣算。** 它的規則是科目 1 與另一科**各自**都要達到 70 分，任一科沒過就整個沒過。這是 conjunctive 而非 compensatory：弱科必須補到門檻，沒有用強科去補的空間。同一套「向權重傾斜」的策略套到 iPAS 上會出事。

## 第四步：事先把中止線寫死

計畫最後一項不是「考試」，是**判斷要不要考的三條線**，而且要在開念之前就寫下來。

以五週計畫為例：

- **第四週模擬考 < 55%** → 落差太大，延後兩週，回頭補權重最高的兩章
- **第五週模擬考 < 70%** → 延一週，只補模擬考標出的弱項
- **第五週模擬考 ≥ 80%** → 照原訂日期考，**不要再多念**

為什麼要事先寫：考前三天的自我評估幾乎一定過度樂觀。那時候你已經投入五週，沉沒成本會推著你去考。事先寫下的數字是唯一能對抗它的東西。

第三條同樣重要。超過 80% 之後繼續刷題的邊際效益很低，而多出來的焦慮會直接影響考試當天的表現。

**固定梯次的證照要把這三條線整個往前移。** iPAS 沒有「延一週」這個選項，所以判斷點應該落在報名截止日之前 —— 用當時的模擬成績決定這一梯要不要報，而不是報了之後再猶豫。報名費不退，但省下的是半年的期待落空。

## 完整範例：AIF-C01 五週計畫

把四步合起來，假設每週投入 7 小時、考試日 9/12：

| 週 | 內容 | 產出 |
|---|---|---|
| 第 0 週 | 排考位並確認金額 → 下載 exam guide（記下版本號）→ 註冊免費帳號 → **先做 20 題定位** | 五章的落差表 |
| 第 1 週 | 應用基礎模型（28%） | 「概念 → AWS 服務名」對照表 |
| 第 2 週 | 生成式 AI 基礎（24%） | 對照表第二版 |
| 第 3 週 | AI/ML 基礎（20%）+ 責任 AI（14%） | 名詞卡 |
| 第 4 週 | 安全與治理（14%）+ 全範圍複習 + **模擬考第一次** | 弱點清單 |
| 第 5 週 | 補洞 + 模擬考第二次 → 對照中止線 → 考試 | — |

第 0 週把排考放在下載教材之前，是因為考位與價格是外部條件 —— 早一週知道有問題，就多一週可以調整。

那張「概念 → AWS 服務名」對照表值得特別說。已經做過 RAG 或 LLM 應用的人，前兩章的概念層大多已經有了，真正要補的是廠商的命名：托管基礎模型叫 Amazon Bedrock、托管 RAG 叫 Bedrock Knowledge Bases、輸出過濾叫 Guardrails、偏誤檢測叫 SageMaker Clarify、漂移監控叫 Model Monitor、人工覆核叫 Amazon Augmented AI（後四項是 exam guide 責任 AI 那章明列的服務）。對這類讀者，每週的產出應該是一張對照表，而不是筆記 —— 念法是「這個我會了，AWS 叫它什麼」，不是從零學概念。

## 各家準備方式的差異

四個步驟通用，但每家有各自要注意的重點。

**AWS**：官方的四步流程是 exam guide → 免費練習題 → 補課與動手實驗 → Official Pretest。免費那層（20 題問答集加 2 小時課程）先跑完再決定要不要訂閱。三張的難度差在「有沒有動手做過」，不在年資。

**Google（PMLE）**：最大的風險不是難度，是教材過期。認證頁明寫「This exam was updated to reflect the transition from Vertex AI to Gemini Enterprise Agent Platform」，2026 年中以前的所有教材用的都是舊名詞。準備時筆記一律用新名稱。另外官方註明「The exam does not directly assess coding skill」，時間該花在架構取捨與服務選型。

**微軟（AI-103）**：課程給得最多（AI-103T00 四條學習路徑約 29.5 小時全免費），但沒有免費 practice assessment，自我檢測要靠自己在 Microsoft Foundry 上動手。想再往上走的話，AI-500 的認證要求是**必須先取得 AI-103**，不是平行的兩張。

**NVIDIA（NCA-GENL）**：50 題 60 分鐘，平均 72 秒一題 —— 這張考的是熟練度不是深度。Exam Blueprint 把每個主題直接對應到訓練課程，照著逐列打勾是五家裡最省事的準備路徑。但有一個限制要先知道：官方 FAQ 寫「NVIDIA certification exams are **pass/fail. You won't receive a score**」—— 沒有成績單，所以沒過的話拿不到弱項報告，第二次準備只能靠自己回想。這反過來提高了考前自我定位的重要性。

**Databricks**：權重集中在「應用開發 30% + 組裝部署 22%」，超過一半是實作導向，所以準備方式應該是在平台上把一條 RAG 鏈從向量檢索、模型服務、生命週期管理到資料治理完整走一次，而不是讀文件。官方建議 6 個月以上實作經驗。

**iPAS 中級**：三個特點決定準備方式。第一，歷屆完整試題公開，直接拿真題定位。第二，科目 2 與科目 3 自 114 年第二梯次起加入**程式碼判讀題**，官方[公告](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)寫「程式類型題目預計約占整體試題之 25%，題型形式包含單選題及題組題」—— 注意有**題組題**，一段程式碼配多題，讀錯一次連錯好幾題。這種題型讀過不等於會，要把片段印出來手動追值。第三，開始念之前先看官網「檔案下載」的**中級科目抵免辦法**，有機會直接省掉一科的準備時間。

## 幾個常見錯誤

**用舊教材。** 最貴的一種錯誤，因為它到考場才會發現。報名前花十分鐘把官方 exam guide 的服務名稱對一遍，比多刷一百題有用。

**先買課再看大綱。** 順序反了。免費資源在多數情況下已經足夠；真正值得付錢的通常只有完整模擬考。

**把年資當報名資格。** [AWS 的 Before Testing 政策](https://aws.amazon.com/certification/policies/before-testing/)寫「All AWS Certifications may be earned without completing specific prerequisites」—— 那些「建議 2 年經驗」是難度標籤，不是門檻。反過來說，也別因為年資夠就跳過定位測驗。

**把 A 家的重考規則套到 B 家。** 微軟 24 小時、AWS 14 天、Google 第二次就跳到 60 天、iPAS 是半年。同樣一句「大不了再考一次」，代價差了兩百倍。

**忘記查考試語言。** 同一家的不同證照語言清單可能不同，讀題速度的影響比多念一週大。

## 這套方法的邊界

它處理的是「時間怎麼分配」，不處理「內容夠不夠」。如果定位測驗顯示你對整個領域都陌生，那不是排程問題 —— 該做的是先累積實作，而不是把五週壓成三週。

考操作細節的證照尤其如此：AWS 的 MLA-C01 期待你實際用過 Amazon SageMaker、Databricks 那張期待你在平台上部署過。沒動手做過就靠刷題硬過，性價比很低，而且證照的意義本來就在那些手感上。

## 參考資料

- [AWS Certification：After Testing 政策（重考等待期、及格線、compensatory scoring、成績公布時間）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification：Before Testing 政策（無先修門檻）](https://aws.amazon.com/certification/policies/before-testing/)
- [AWS Certified AI Practitioner（AIF-C01）認證頁](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AIF-C01 官方考試指南 PDF（Version 1.4，五章權重 28/24/20/14/14）](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf)
- [AWS MLA-C01 官方考試指南 PDF](https://d1.awsstatic.com/training-and-certification/docs-machine-learning-engineer-associate/AWS-Certified-Machine-Learning-Engineer-Associate_Exam-Guide.pdf)
- [AWS CLF-C02 官方考試指南 PDF](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf)
- [AWS 考前準備資源總覽（免費練習題集與 Exam Prep 課程）](https://aws.amazon.com/certification/certification-prep/)
- [Google Cloud Exam Terms & Conditions（重考等待期 14 / 60 / 365 天）](https://cloud.google.com/certification/terms)
- [Google Cloud Certification：Retake Policy](https://support.google.com/cloud-certification/answer/9749448)
- [Google Professional ML Engineer 官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Microsoft 重考政策（24 小時後首次重考、之後每次 14 天、一年最多 5 次）](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Microsoft AI-103 考試頁（practice assessment 狀態、五個評測領域）](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)
- [Microsoft AI-103T00 課程](https://learn.microsoft.com/en-us/training/courses/ai-103t00/)
- [NVIDIA NCA-GENL 認證頁（Exam Blueprint）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA Certification FAQ（重考 14 天、一年 5 次、pass/fail 不給分數）](https://www.nvidia.com/en-us/learn/certification)
- [Databricks Certified Generative AI Engineer Associate（各章權重）](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Databricks Certification Terms & Conditions（重考 14 天、每次付費）](https://www.databricks.com/learn/certification/terms-and-conditions)
- [iPAS AI 應用規劃師 學習資源（歷屆試題與官方學習指引）](https://ipd.nat.gov.tw/ipas/certification/AIAP/learning-resources)
- [iPAS AI 應用規劃師 考試資訊（梯次、科目與獲證條件）](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)
- [iPAS 中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)
