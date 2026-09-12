---
title: "AWS 三張 AI 證照怎麼選：MLA-C02 beta 已開放後的最新分界"
date: 2026-08-19
type: guide
category: ai
tags: [certification, aws, career, generative-ai]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 21
tldr: "AIF-C01、MLA-C02、AIP-C01 不是難度階梯，是三個職能切面：AIF 考能否判斷 AI 的商業應用；MLA 考能否把傳統 ML、基礎模型與 agentic workflow 上線並維運；AIP 考能否整合基礎模型做 GenAI 系統。MLA-C02 的英文 beta 已開放報名，9/29 開始交付；正式版日期與非英文版本仍未公布。"
description: "AWS 三張 AI 證照（AIF-C01 / MLA-C02 / AIP-C01）的選擇指南：用官方 exam guide 的職能範圍與 domain 權重對照實際分界，說明 MLA-C02 beta 的報名、交付與正式版狀態，並更新續期關係與選擇路徑。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-19-aws-certifications-which-one-en)
>
> 本文是從官方資料建出來的選擇指南，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回官方 exam guide，所有規格都指回官方認證頁，不含考古題。最近查證：2026-09-12。

系列前面已經各出過 [AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide) 與 [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide) 的備考路徑，這篇處理它們之間的取捨，以及已更新為 MLA-C02 的 ML Engineer – Associate。

**先說結論**：這三張不是初級／中級／高級的階梯。它們的官方職能範圍幾乎不重疊，選錯的代價不是「考太簡單」，是**考了一張不證明你會做的事**。現在的變數是 MLA-C02 正在 beta：英文 beta 已開放報名，正式版與其他語言的日期仍未公布。

各家證照的價格與效期總表在站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 三張的官方規格對照

| | [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner/) | [MLA-C02](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/) | [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) |
|---|---|---|---|
| 等級 | Foundational | Associate | Professional |
| 費用 | $100 | beta $75；正式版 $150 | $300 |
| 時間 | 90 分鐘 | beta 170 分鐘；正式版規格見考綱 | 180 分鐘 |
| 題數 | 65（50 計分） | beta 85 題；正式版 65（50 計分） | 75（65 計分） |
| 及格 | 700 | 正式版 **720**；beta 不適用 | **750** |
| 題型 | 單選、複選、ordering、matching | 單選、複選 | 單選、複選 |
| 效期 | 3 年 | 3 年 | 3 年 |
| 語言 | 12 種，**含繁體中文** | beta 限英文；GA 後英、日、韓、簡中 | 英、日、韓、簡中 |
| 官方建議經驗 | 接觸 AI/ML 六個月以內，「使用但不一定要會建」 | **1 年 SageMaker AI、Bedrock 等 ML 服務 + 1 年相關角色** | 2 年生產級開發 + 1 年 GenAI 實作 |
| 現況 | 考綱 v1.1（2026-04-30） | 英文 beta 已可報名；9/29 開始交付 | 2026-03 refresh，已含 AgentCore |

正式版三張的及格線 700 / 720 / 750 是一路升高的，都用補償計分、單章不設門檻；MLA-C02 beta 不適用正式版的及格線。

**題型的分界已經改變**：AIF-C01 保留 ordering（排序）與 matching（配對），兩者都要全對才得分；[MLA-C02](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html) 與 [AIP-C01](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) 都只有單選與複選。考前的節奏演練仍不能三張共用，但理由不再是 MLA 題型較複雜。

## 時間分支：MLA-C02 beta 現在能不能考

[官方認證頁](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)已把狀態說清楚：MLA-C02 的英文 beta 已開放報名，代碼是 **ME1-C02**，9/29 開始交付；beta 售價 $75、170 分鐘、85 題。正式版的報名與交付日期仍是 TBD，正式上線後才會提供日、韓與簡中。

這也解開了舊文的代碼疑問：**MLA-C02 是新版認證的名稱，ME1-C02 是目前 beta 的考試代碼。** 考綱已公開，且新版維持四個 domain，但範圍擴到基礎模型、Bedrock、RAG、agentic workflow 與對這些工作流的可觀測性。

對英文考生而言，現在不必為 9/28 的 C01 截止日壓縮讀書計畫；應在兩條路之間選擇：已具備官方建議的兩年相關經驗，且願意接受 beta 的 85 題與成績流程，就考 ME1-C02 beta；否則依 C02 考綱準備，等 GA 日期公布再報名。日、韓、簡中考生則仍可選 C01，直到 C02 GA，但不要把「尚未公布」當成沒有截止日。

MLA-C02 仍是需要實作的 associate 考試。它要求至少一年使用 SageMaker AI、Bedrock 等 AWS ML 服務，以及一年後端、DevOps、資料工程或資料科學等相關經驗；官方也明確把傳統 ML 與 GenAI 經驗都列為目標考生條件。從零開始者應先累積實作，再把考試排進時程。

## 那三張到底分別考什麼

新版 MLA-C02 讓 MLA 與 AIP 的邊界多了 GenAI 的交集，但職能仍然不同：MLA 把模型、基礎模型與 agentic workflow 放進可營運的 ML 系統；AIP 聚焦把既有基礎模型整合成 GenAI 應用。

| | AIF-C01 | MLA-C02 | AIP-C01 |
|---|---|---|---|
| 一句話 | 說得出來 | 把 ML 上線 | 把別人的模型整合成系統 |
| Domain 權重 | 20 / 24 / 28 / 14 / 14 | 28 / 24 / 24 / 24 | 31 / 26 / 20 / 12 / 11 |
| 最重的一塊 | 基礎模型的應用（28%） | AI 與 ML 的資料準備（28%） | FM 整合、資料管理與合規（31%） |
| 官方明確**不考** | 寫模型或演算法、資料與特徵工程、超參數調校、建 pipeline 與基礎設施、模型的數學統計分析、實作資安合規協定、開發治理框架 | 設計完整端到端 AI／ML 架構、制定 ML 策略與最佳實務、整合大量服務或新技術、深入兩個以上 ML 領域 | 模型開發與訓練、進階 ML 技術、資料工程與特徵工程 |

三份 out-of-scope 讀在一起，分界就出來了：

- **AIF-C01 排除的每一項，幾乎都是 MLA-C02 的 in-scope 任務。** 超參數調校、pipeline、特徵工程 —— AIF 不考，MLA 考。
- **AIP-C01 排除的模型開發、訓練、資料與特徵工程，仍是 MLA-C02 的核心。** 不過 MLA-C02 已加入 Bedrock、RAG 和 agentic workflow，因此不是只考傳統 SageMaker。
- **所以 MLA 與 AIP 不是上下級，是左右兩邊。** MLA 是「建、部署並營運 AI／ML 工作流」；AIP 是「整合基礎模型做 GenAI 應用」。兩者都會碰到 GenAI，但前者仍要求模型生命週期、資料與 MLOps 能力。
- **AIF 與另外兩張的關係則是真的上下級**：它的排除清單就是另外兩張的工作內容，所以它是唯一一張「三種人都可以先拿」的。

一個判斷小技巧：看到「我要證明我會做 RAG／agent／LLM 應用」就往 AIP；看到「我要證明我會訓練模型、把 ML pipeline 上線」就往 MLA；看到「我要能跟 AI 團隊對話、看懂術語」就往 AIF。**三句話對應不到同一張。**

## 續期圖會反過來決定考試順序

這是最少被寫、但最省錢的一段。依[官方 recertification 頁](https://aws.amazon.com/certification/recertification/)：

| 你持有的 | 續期方式（皆 +3 年） |
|---|---|
| AIF-C01 | 重考 AIF-C01、**或考過最新版 MLA**、**或考過 AIP-C01** |
| MLA | 重考最新版 MLA、**或考過 AIP-C01** |
| AIP-C01 | 只能重考 AIP-C01 |

而且[考過 AIP-C01 會同時把 AIF-C01、MLA 與 Data Engineer – Associate 各續三年](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)。這張續期圖有兩個方向性的後果：

**一、如果你遲早會考 AIP-C01，AIF-C01 就該早點拿。** $100 這張不會變成長期維護負擔 —— 三年內考過 AIP，AIF 自動續期。反過來「先撐著不考 AIF、等有空一起考」沒有任何節省，只是晚三年才拿到那張。

**二、AIP-C01 是唯一沒有下家的那張。** 它續掉三張，自己只能靠重考續（可用 AWS Certification Account 的五折券，$150）。所以規劃長期成本時，AIP 是每三年的固定支出，另外幾張是它的附贈品。

**三、MLA 仍能續 AIF。** 官方現在寫的是「考過最新版 Machine Learning Engineer – Associate」，所以 C02 正式版上線後同樣走這條。不要為了續期去趕已接近結束的 C01；把它當成你原本就需要的 ML 工程能力驗證。

另外提醒兩條全域規則：**三張都沒有「上課換效期」的選項**（AWS 的 maintain 只開放給 SAA、Developer、CloudOps、SAP、DOP），**考過之後兩年內不能重考同一張**，所以想靠重考提前續期也行不通。

## 決策：2026 年 9 月的建議路徑

把上面幾段收成可執行的分支。

**如果你要做 GenAI 應用（RAG、agent、LLM 整合）**
→ AIP-C01。不受停考影響，考綱已含 AgentCore。經驗不足的話先補實作，[十週時程](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)裡有換算依據。想先拿一張墊底就順手加 AIF-C01（$100，而且 AIP 會把它續掉）。

**如果你要做 ML 工程（訓練、部署、pipeline、監控）**
→ MLA-C02。英文讀者若已符合官方經驗條件，可直接評估 ME1-C02 beta；其餘讀者用現行考綱準備並等 GA。它現在同時涵蓋傳統 ML、基礎模型與 agentic workflow，不能只把它當成舊版 SageMaker 證照。

**如果你考日／韓／簡中版**
→ C01 仍可選到 C02 GA；但正式版日期未公布，計畫要把約考排在前段。若要考新版，需等相應語言的 GA。

**如果你是 PM／業務／法遵，或工程師想先建詞彙表**
→ AIF-C01。三張裡唯一有繁體中文，$100，v1.1 之後連 MCP 與 agentic AI 都進了考綱（見[備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)裡的 v1.1 異動表）。

**如果你的目標是「證明會做多 agent 系統」**
→ 這三張都不是最直接的答案。AWS 線上最接近的是 AIP-C01 第 2 章的 agentic AI（26% 那塊裡的 7 個技能點），但跨廠商的比對見[多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)。

**如果你的公司主力不是 AWS**
→ 先確認雲端廠商再挑證照。Google 生態只有 [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) 一張，規則（尤其是重考罰則）跟 AWS 差很多。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-09-12 查證） | 什麼時候要重查 |
|---|---|---|
| MLA-C01 英文版停考日 | 2026-09-28 | 2026-09-28 後移除 |
| MLA-C02 beta | 已開放報名；ME1-C02、英文、$75 | beta 結束與 GA 公告時 |
| MLA-C02 正式版 | 報名與交付日期均 TBD | AWS 公告時 |
| MLA-C02 exam guide | 已公開；四 domain 為 28 / 24 / 24 / 24 | 每次 revision |
| MLA-C02 GA 語言 | GA 後英、日、韓、簡中；日期未公布 | AWS 公告時 |
| 續期圖 | AIP 續 AIF／最新版 MLA／DEA | 每次認證改版 |
| 三張費用 | $100 / $150 / $300 | 每季 |
| 及格線 | 700 / 720 / 750 | 每次改版 |

## 更新紀錄

- 2026-09-12：MLA-C02 英文 beta 已開放報名後，更新 MLA 規格、考綱範圍、代碼關係、續期表與選擇路徑。

## 參考資料

- [AWS Certified Machine Learning Engineer – Associate 官方認證頁（MLA-C02 beta 與 GA 狀態）](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [MLA-C02 官方 exam guide（新版範圍、四 domain 權重、題型與及格線）](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html)
- [AWS Certified AI Practitioner 官方認證頁](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AWS Certified Generative AI Developer – Professional 官方認證頁](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Recertification（續期路徑與五折券）](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing（重考政策）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Skill Builder — MLA-C02 Exam Prep](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02)

**站內相關**

- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS GenAI Developer Professional（AIP-C01）備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
