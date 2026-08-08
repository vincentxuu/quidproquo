---
title: "2026 年工程師 AI 證照有哪些"
date: 2026-08-06
category: ai
tags:
  - certification
  - career
  - aws
  - gcp
  - azure
  - ipas
lang: zh-TW
type: deep-dive
tldr: "2026 年工程師能報名的 AI 證照逐張列出：AWS 三張（AIP-C01 / MLA-C01 / AIF-C01）、Google PMLE、微軟 AI-103 與 AI-500、NVIDIA NCA-GENL、Databricks GenAI Engineer、Anthropic Claude 四張、iPAS AI 應用規劃師中級，價格、效期、報考門檻全部對照官方頁面。兩個會影響荷包的重點：Google PMLE 的考試大綱已把 Vertex AI 全面改名為 Gemini Enterprise Agent Platform，2026 年年中以前的教材等同作廢；iPAS 中級證書效期是 5 年而非永久。"
description: "2026 年工程師能報名的 AI 證照完整規格：AWS AIP-C01 / MLA-C01 / AIF-C01、Google Professional ML Engineer、微軟 AI-103 與 Agent 認證線、NVIDIA NCA-GENL、Databricks GenAI Engineer、Anthropic Claude 四張證照、iPAS AI 應用規劃師中級的價格、效期、報考門檻與考試大綱異動，全部對照官方頁面。"
glossary:
  - term: "Gemini Enterprise Agent Platform"
    aliases: ["Agent Platform"]
    definition: "Google Cloud 在 Cloud Next '26 發表的 agent 開發平台，整併並取代原本 Vertex AI 的品牌與服務名稱。"
    advanced: "包含 Agent Studio、Agent-to-Agent Orchestration、Agent Registry、Agent Identity、Agent Gateway、Agent Observability，原 Vertex AI 的 AutoML / Workbench / Feature Store / Model Registry / Pipelines 皆改掛 Agent Platform 前綴。"
    context: "本文用它說明 Google PMLE 考試大綱改版後，舊教材為何全數失效。"
    links:
      - label: "Welcome to Google Cloud Next '26"
        url: "https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)

2026 上半年三家雲端業者同時改版 AI 認證線，能報名的證照跟一年前差很多。這篇把工程師現在能考的每一張逐條列出來，價格、效期、報考門檻都以原廠公告為準。

先講兩件直接影響荷包的事：**Google PMLE 的考試大綱已經把 Vertex AI 全面改名**，2026 年年中以前的教材等同作廢；**iPAS 中級證書效期是 5 年，不是網路上常寫的永久**。

## 總表：現在能報名的證照

| 證照 | 費用 | 時長 / 題數 | 效期 |
|---|---|---|---|
| [AWS Certified Generative AI Developer – Professional](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) (AIP-C01) | $300 | 180 分 / 75 題 | 3 年 |
| [AWS Certified ML Engineer – Associate](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) (MLA-C01) | $150 | 130 分 / 65 題 | 3 年 |
| [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner) (AIF-C01) | $100 | 90 分 / 65 題 | 3 年 |
| [Google Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) | $200 | 120 分 / 50–60 題 | 2 年 |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | $125 | 60 分 / 50–60 題 | 2 年 |
| [Databricks GenAI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate) | $200 | 90 分 / 45 題 | 2 年 |

微軟與 Anthropic 沒放進這張表：微軟整條認證線今年剛改版，代碼要單獨對；Anthropic 沒有公開價格。兩家在下面各自處理。iPAS 是台灣本地的，規則跟國際廠商不同，也單獨一節。

## 該考哪張

先確認你公司實際用的是哪一家雲端，再挑證照 —— 順序反過來的話，一張 AWS 證照在用 Azure 的公司幾乎沒有議價力。

| 你的環境 / 目標 | 建議路徑 |
|---|---|
| AWS，想快速起步 | AIF-C01（$100）→ MLA-C01（$150） |
| AWS，做 GenAI 應用 | 直接 AIP-C01（$300），需 2 年 AWS + 1 年 GenAI 經驗 |
| Google Cloud | PMLE（$200），且**只用 2026 年中之後的教材** |
| Azure / 微軟生態 | AI-103（associate）→ AI-500（expert，beta；**必須先取得 AI-103**） |
| 資料平台 + LLM | Databricks GenAI Engineer Associate（$200） |
| 想碰 GPU / 模型層 | NVIDIA NCA-GENL（$125） |
| 台灣求職 / 接案 | iPAS 中級，兩科 1,000 元 |

單純想補基礎而不是拿證照的話，站內另有一篇 [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)，把 OpenAI、Anthropic、Google 三家官方課程按能力層級重排過。已經選好要考哪張、想知道怎麼排讀書計畫的話，看 [AI 證照怎麼準備：先算排考日，再排讀書順序](/posts/ai/2026-08-07-ai-certification-prep-method)。

## AWS：三張差在價位與經驗門檻

三張都能直接報名，差別在深度與價格：[AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner) $100、90 分鐘、65 題，是入門那張；[MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) $150、130 分鐘、65 題，往 ML 工程實作走；最上面是 [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) $300、180 分鐘、75 題，官方建議先有 **2 年 AWS 經驗加 1 年 GenAI 開發經驗**，是三張裡唯一專攻 GenAI 應用開發的。

三張效期都是 3 年。[官方 recertification 政策](https://aws.amazon.com/certification/policies/recertification/)寫：

> Certification through AWS is valid for three years from the date it was earned.

AWS 明文不接受繼續教育學分，但「只能重考」有一個例外：**考到更高階的那張，會自動把下層那張一起續掉**。[AWS 繁中的 AIF-C01 認證頁](https://aws.amazon.com/tw/certification/certified-ai-practitioner)寫，到期前可以重考最新版，「或取得 AWS Certified Machine Learning Engineer - Associate，該認證將自動重新認證此認證」。所以 AIF-C01 → MLA-C01 這條路線，第二張同時解決了第一張的續證。

沒考過的成本也要先知道。[官方 After Testing 政策](https://aws.amazon.com/certification/policies/after-testing/)寫：

> If you fail an exam, you must wait 14 calendar days before you are eligible to retake the exam. There is no limit on exam attempts. However, you must pay the full registration fee for each exam attempt.

**重考要等 14 個日曆天，而且每次都付全額。** 手上有考試券或限時優惠時，這條會直接決定排考日要提前多久 —— 想留一次重考機會，第一次就得排在期限前 14 天以上。同一頁還有兩個數字：及格線是基礎級 **700**、Associate 級 **720**、Professional 與 Specialty 級 **750**（滿分 1000），成績最多 **5 個工作天**公布。

考試語言三張不一樣：AIF-C01 有**繁體中文**（另有阿拉伯、英、法、德、義、日、韓、葡、西、簡中）；MLA-C01 與 AIP-C01 只有英、日、韓與**簡體中文**。

## Google：只有 PMLE 一張，但教材要挑 2026 年中之後的

Google 的 AI 認證只有兩張：[Generative AI Leader](https://cloud.google.com/learn/certification/generative-ai-leader)（基礎級）與 [Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer)（專業級），[官方認證總覽頁](https://cloud.google.com/learn/certification)的 Professional 級共 9 張，沒有任何 GenAI 或 Agent 工程師認證。Google 的策略是**把 agentic 內容塞進既有的 PMLE，而不是另開證照** —— 所以在 Google 生態要證明 GenAI / Agent 能力，**PMLE 就是唯一那張**。

Generative AI Leader 不建議工程師花這 $99。官方對適用對象講得很白：

> This certification is for anyone in any job role, with or without hands-on technical experience.

對有程式基礎的人鑑別度太低。考試語言是英文、日文、西班牙文、葡萄牙文 —— 沒有中文。

### 考試大綱的產品名全部換過

這是報名 PMLE 之前一定要知道的一條。多數推薦文說 PMLE「涵蓋 Vertex AI」—— **Vertex AI 這個詞在現行考試大綱裡幾乎已經消失**。把[官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)全文對照：

| 舊名（多數教材仍在用） | 現行大綱用詞 |
|---|---|
| Vertex AI | Gemini Enterprise Agent Platform |
| Vertex AI AutoML | Agent Platform AutoML |
| Vertex AI Workbench | Agent Platform Workbench |
| Vertex AI Feature Store | Agent Platform Feature Store |
| Vertex AI Model Registry | Agent Platform Model Registry |
| Vertex AI Pipelines | Agent Platform Pipelines |
| Vertex AI Prediction | Agent Platform Inference |
| Model Garden | Model Garden（唯一沒改的）|

Google 在 Cloud Next '26 把 Vertex AI 整併進 [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)，官方說法是它「brings together the best of Vertex AI with transformational new features, including Agent Studio, Agent-to-Agent Orchestration, Agent Registry, Agent Identity, Agent Gateway, Agent Observability」。

**實務影響**：2026 年年中以前出版的 PMLE 教材、線上課、題庫，用的都是舊名詞。考題直接用新名字問你，只認得 Vertex AI 舊術語的人會愣在「Agent Platform Feature Store」上。這是最容易白花 $200 的坑。

各章配分也重排過：

| 章節 | 比重 |
|---|---|
| 1. Architecting low-code AI solutions | ~13% |
| 2. Collaborating within and across teams to manage data and models | ~16% |
| 3. Scaling prototypes into ML models | ~21% |
| 4. Serving and scaling models | ~20% |
| 5. Automating and orchestrating ML pipelines | ~18% |
| 6. Monitoring AI solutions | 其餘 |

幾個傳統 ML 教材不會教的新考點：**LLM-as-a-judge 評估**、**prompt and context engineering**、**Gemini 應用的 cost / latency / availability 最佳化**、**用 BigQuery fine-tune Gemini 模型**。

效期要算進成本：官方[考試條款](https://cloud.google.com/certification/terms)明訂 Professional 認證兩年有效，到期要**重考**才能延續（不像微軟有免費線上 renewal assessment），可在到期前 60 天開始。不過續證那次有折扣 —— 官方[Vouchers & Discounts 說明](https://support.google.com/cloud-certification/answer/10055456)寫，取得認證後 CM Connect 帳號的 Benefits 區會出現一張 **50% 折扣碼**，可套用在續證的那次報名。所以兩年後是 $100 而非 $200，但折扣碼之間不可疊加。以 Google 改名字的頻率，真正的成本是那次重新準備的時間，不是考試費。

PMLE 的考試語言只有**英文與日文**，沒有任何中文。認證頁另外寫了建議經驗是「3+ years of industry experience including 1 or more years designing and managing solutions using Google Cloud」，但也註明「The exam does not directly assess coding skill」—— 準備時間該花在架構取捨與服務選型，不是刷程式題。

### 兩個能省錢的 Google 資源

[Get Certified 計畫](https://cloud.google.com/learn/certification)讓 Google Cloud **客戶**免費參加認證的考前訓練。公司是 GCP 客戶的話，先問內部有沒有名額，$200 可以省下來。

[GEAR 計畫](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)是 Cloud Next '26 發表、跑在 Google Skills 上的 agent 實作訓練，新學習路徑包含 *Introduction to Agents and Google's Agent Ecosystem* 與 *Develop Agents with Agent Development Kit (ADK)*。這對補 PMLE 新增的 agentic 考點很直接，ADK 的實作還能直接變成作品集。

## 微軟：AI-103 打底，想做 agent 再往上加

現在的 associate 級是 **AI-103**，對應 [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)。官方描述是「designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry」—— 核心平台是 **Microsoft Foundry**，準備方向跟舊的 Azure AI 服務組合已經不一樣。（它取代的是 AI-102，那張已在 2026/6/30 退場，細節見下面「已經不用再找的幾張」。）

Agent 這條線微軟給得比其他家完整。除了已 GA 的 AB-620（AI Agent Builder Associate），還有兩張**專家級**：[Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)（AI-500，beta，官方定位是「designing, building, and optimizing scalable, production-ready, multi-agent AI systems」）與 [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)（AB-100）。

**AI-500 值得單獨留意，但它不是「加考一張」，是「同一條路線的下一階」。** 微軟的[認證公告](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-multi-agent-ai-solutions-expert-certification/4494122)寫得很清楚：

> To earn the Microsoft Certified: Multi-Agent AI Solutions Expert (AI-500) certification, candidates **must also earn** the Microsoft Certified: Azure AI Apps and Agents Developer Associate (Exam AI-103) certification.

也就是說 AI-103 是 AI-500 的必要條件，不能跳過。

主流雲端業者目前沒有第二張專攻多 agent 系統架構的專家級認證，想往 Agent 方向走，鑑別度比 associate 級的 AI-103 高一階。代價是 beta 階段成績出得慢（rescoring 要等 GA、之後約 10 天才出正式成績）、考題會隨正式版調整。同一篇公告寫 GA 預計在 2026 年 10 月。

微軟這邊還有一個別家沒有的好處：續期有**免費線上 renewal assessment**，不用像 AWS、Google 那樣重考正式考試。

價格與語言：[AI-103 考試頁](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)標示 **$165 USD**（依考試所在國家或地區計價）、120 分鐘。語言清單則是本文第三個提醒的活教材 —— 同一張認證，**認證總覽頁只列 English，考試頁列了 10 種語言且含繁體中文**。兩頁不一致，以你報名時看到的那頁為準。

還有一個會影響準備的缺口：AI-103 目前**沒有免費的 practice assessment**，官方說明是「Practice Assessments are usually available within 8 weeks of the exam being out of beta and generally available」。微軟的 [AI-103T00 課程](https://learn.microsoft.com/en-us/training/courses/ai-103t00/)給了四條學習路徑、合計約 29.5 小時全免費，但自我檢測的工具比 AWS 少一截 —— 課給你上，不給你測。

## Claude：四張，價格要到結帳頁看

[Anthropic 於 2026 年 7 月 23 日公告](https://claude.com/blog/four-role-based-claude-certifications)把認證擴編成四張，涵蓋 Associate、Developer、Architect 三種角色。同一篇公告提到，自 3 月推出以來「more than 36,000 consultants have received certification across more than 1,300 organizations」。

工程師對應的是 **Claude Certified Developer: Foundations**，官方描述為「for engineers building applications with Claude, and includes training on the Claude API, tool use, and agent development」。

**價格這裡要誠實說明**：Anthropic 沒有在公開頁面列出考試費用。[Pearson VUE 的官方頁](https://www.pearsonvue.com/us/en/anthropic.html)只列出四張證照的名稱與代碼，沒有價格。以下數字來自第三方彙整，**且彼此不一致**：

| 證照 | 代碼 | 第三方報價 | 對象 |
|---|---|---|---|
| Claude Certified Associate: Foundations | CCAO-F | $99 | 非技術職 |
| Claude Certified Developer: Foundations | CCDV-F | $125 | 工程師 |
| Claude Certified Architect: Foundations | CCAR-F | $125 或 $175（來源分歧） | 架構師 |
| Claude Certified Architect: Professional | CCAR-P | $175 | 資深架構師 |

效期同樣沒有官方公開數字，第三方普遍說 12 個月、到期前可免費做一次非監考的更新評量。**報名前請以 Partner Academy 結帳頁顯示的金額為準。**

報考門檻則有官方依據。Pearson VUE 頁面（最後更新 2026-07-08）寫：

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

考前訓練也一樣限 Partner Network 成員。[Pearson VUE 頁](https://www.pearsonvue.com/us/en/anthropic.html)寫：

> Prepare for your certification exam with self-paced preparation training courses available in Anthropic Partner Academy. **Training is available to members of the Claude Partner Network.**

所以「訓練免費」跟「訓練公開」是兩件事：公告把 Partner Academy 描述成「our free training platform for **partners**」—— 不收費，但有門檻。門檻本身倒是免費的，同一篇公告寫「Firms can join the Claude Partner Network and register practitioners... **Membership is free**」。

實務順序因此是：**公司先免費加入 Partner Network → 才能上課、才能排考**。網路上聲稱個人可自由報名的說法，我找不到官方來源支持。工程師要規劃這張，第一步不是念書，是去確認自家公司在不在 Partner Network 裡。

考試內容細節可參考站內的 [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)，不過那篇寫於 2026 年 3 月、當時只有 Architect 一張，代碼與價格以本文為準。

## iPAS 中級：台灣本地這張，效期 5 年

依[官方考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)，中級科目 1「人工智慧技術應用與規劃」必考，科目 2「大數據處理分析與應用」與科目 3「機器學習技術與應用」擇一，兩科都要 ≥70 分。費用是 115–116 年度優惠價 **500 元/科**（原價 1,500 元），兩科合計 1,000 元，117 年起恢復原價。

「約 25% Python 程式閱讀題」的說法屬實且有官方依據 —— iPAS 發過[中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)，自 114 年第二梯次起，科目 2 與科目 3 加入程式碼判讀題。

**效期是最常被寫錯的一條**，連 [104 的證照指南](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617)都寫「證書永久有效」。[115 年度 AI 應用規劃師能力鑑定簡章](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)寫得很清楚：

| 級等 | 證書效期 | 換發標準 |
|---|---|---|
| 初級 | 永久有效 | 不需換發 |
| **中級** | **5 年** | 取得證書後 5 年內接受 AI 相關訓練合計 48 小時以上 |

換證有一條對工程師友善的設計：**每一年 AI 相關工作年資可折抵 8 小時訓練時數**。本職就在做 AI 的話，五年年資折 40 小時，再補 8 小時課程就能換證。

時間上有個硬期限：依[官方報名說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration)，115 年度中級只考兩場（5/23、11/14），第二場個人報名到 **2026/9/22 中午 12 點**截止。

## 已經不用再找的幾張

搜尋排名前段的推薦文很多是 2025 年寫好之後只改了標題年份，還在推這些：

| 你可能看到的 | 現在的狀況 |
|---|---|
| 微軟 AI-102 Azure AI Engineer | 2026/6/30 退場，改考 AI-103 |
| 微軟 AI-900 Azure AI Fundamentals | 2026/6/30 退場，改考 AI-901 |
| 微軟 DP-100 Azure Data Scientist | 2026/6/1 退場，改考 AI-300 MLOps Engineer |
| 微軟 AZ-204 Azure Developer | 2026/7/31 退場，改考 AI-200 Azure AI Cloud Developer |
| 微軟 AZ-500 Azure Security Engineer | 2026/8/31 退場，改考 SC-500 Cloud and AI Security Engineer |
| AWS ML – Specialty | 最後考試日 2026/3/31 |
| 「Google Cloud GenAI Engineer」 | **這張證照從來不存在** |

微軟的退場有官方明證：[Azure AI Engineer Associate 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)頂端掛著警告：

> This certification and the renewal assessment are retired.

該頁 metadata 更新時間是 `2026-06-30`，並標記 `hidden: true` / `noindex` —— 微軟連搜尋引擎索引都撤掉了。已持證者的資格會留到自然到期，但**不能更新，也不能重新報考**。完整對照見 [Pearson VUE 的微軟考試異動表](https://www.pearsonvue.com/us/en/microsoft/updates.html)與 [Microsoft Credentials roundup](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)。

「Google Cloud GenAI Engineer」則是被憑空創造出來的名字，三種方式交叉驗證：直接請求 `cloud.google.com/learn/certification/generative-ai-engineer` 回 **HTTP 404**；官方認證總覽頁的 AI 項目只有 Generative AI Leader 與 Professional ML Engineer；Professional 級 9 張裡沒有任何 GenAI 或 Agent 工程師認證。

## 課程要花多少：五家的免費那層夠不夠

上面列的都是考試費。實際上每家還有第二筆錢：課程費。**兩筆互不相干** —— 不用先上課才能報考，廠商也不會查你上過什麼課。搞混這兩筆，是預算會抓錯的主因。

| 廠商 | 官方免費的部分 | 要付費才有的 |
|---|---|---|
| AWS | Skill Builder 免費帳號：1,000+ 學習資源、20 題 Official Practice Question Set（附詳解與推薦資源）、2 小時 Exam Prep 課 | 訂閱 **$29/月**或 **$449/年**：Official Pretest 與完整模擬考、Guided Builder Labs；年費版多 Digital Classroom |
| Google | Google Skills（原 Cloud Skills Boost）上的 ML Engineer 學習路徑與官方 sample questions | 動手 lab 要消耗 credits，GEAR 計畫每月給 35 點免費額度 |
| 微軟 | AI-103T00 的四條學習路徑，合計約 29.5 小時 | 講師班、Exam Replay 重考券 |
| NVIDIA | Free Self-Paced Courses 專區；Exam Blueprint 把每個主題直接對應到相應課程 | 講師帶領的 workshop |
| Databricks | Academy 三門免費隨選課（Databricks Fundamentals、AI Agent Fundamentals、Generative AI Fundamentals，各約 1.5 小時，完成有徽章） | Instructor-Led 課程標示 PAID，8–18 小時 |
| Claude | Partner Academy 的考前訓練（免費，但限 Partner Network 成員） | — |

**五家裡只有一筆值得付：AWS 的 $29 月費。** 理由不是課程內容，是**完整模擬考只在付費層** —— 免費那 20 題不足以判斷自己會不會過。買法是考前一個月訂、考完退訂：$29 換一次「知道自己會不會過」，比裸考失手後再付一次全額便宜，而且 AWS 重考還要等 14 天。不要買 $449 年費。

免費給最多的是微軟那 29.5 小時，但它同時是唯一沒有免費 practice assessment 的 —— 課給你上，不給你測。

## 省錢管道：哪些是機制，哪些是碰運氣

限時折扣碼寫進文章就會過期，但幾家的**省錢機制**是穩定的，值得先知道規則再決定什麼時候報名。

**AWS：專業級與專家級的考試券含免費重考。** 依[繁中優惠券活動條款](https://aws.amazon.com/tw/certification/bulk-voucher/terms-and-conditions)，2026/4/15 至 12/31 期間報名任何 Professional 或 Specialty 考試，預付考試優惠券全額支付初次費用，重考時系統自動套用促銷代碼、**第二次不收費**（初考未通過者可考到 2027/4/30）。要考 AIP-C01 的話，這條省下的是失敗那次的 $300。基礎級與 Associate 級不在這個檔期內。

**Google：通過認證後會拿到一張續證用的 5 折碼**（見上一節）。

**微軟：beta 考試前 300 名八折。** 每張新認證在 GA 之前都有 beta 期，前 300 名用公開折扣碼可享 **80% off**，碼公布在 Microsoft Learn Blog 的新認證公告裡。通過 beta 即取得認證、不必再考正式版，而且用過八折碼的人之後還會收到一張 25% 折扣券。代價是成績要等 rescoring。想撿這個便宜，就要盯著新認證公告 —— 微軟今年改版密集，beta 檔期不少。

**Databricks：每季一次的 Virtual Learning Festival。** 活動期間在 Academy 完成任一 self-paced 學習路徑，可拿任一 Databricks 認證的 **5 折券**（$200 → $100）加 Academy Labs 8 折券。每人限一張、券效期約 90 天。2026 年的檔期是 1/9–1/30、3/16–4/3、6/15–7/6，[官方 community 的 FAQ](https://community.databricks.com/t5/training-offerings/faq-for-virtual-learning-festival-16-march-03-april-2026/td-p/150220) 會公告下一輪。

**NVIDIA：webinar 與 GTC 現場。** webinar 偶有 5 折考試碼；[GTC 現場](https://www.nvidia.com/en-us/training/)參加者的監考認證考試免費，官方標示價值 €115–€425。

**問公司比找折扣碼有效。** Google 的 Get Certified 限客戶、微軟的 ESI（Enterprise Skills Initiative）限已加入的組織、AWS 與 Databricks 的團隊考試券都要公司採購。這幾條的金額都比個人能撿到的折扣大 —— 報名前先問內部有沒有名額，比在網路上找碼划算。

## 報名前的三個提醒

**教材的新鮮度比證照本身重要。** PMLE 是最好的例子：名字沒變、價格沒變、官網長得一樣，但拿舊教材去考會直接撞牆。報名前花十分鐘打開官方 exam guide 對一遍服務名稱，ROI 遠高於多刷一百題。

**廠商不公開的資訊，不要當成已知。** Claude 證照的價格與效期在網路上被寫得斬釘截鐵，實際上 Anthropic 從未公開，第三方之間還互相矛盾。遇到這種情況，正確做法是去結帳頁看，不是相信整理文。

**同一個官方網域內，不同頁面的新鮮度可以差好幾個月。** 微軟 Q&A 上仍有回答說 AI-103 在 beta，但認證頁早已拿掉 `(beta)` 後綴、標記 `hidden: false`、更新於 `2026-07-23`。看官方來源也要看是哪一頁、什麼時候更新的。

順帶一提，常見的「PMLE 是就業市場提及頻率最高的 AI 證照」這類說法，**查不到可信的職缺統計來源支撐**。當參考，別當事實。

## 整體來說

**先對雲，再對證照。** 這七家的證照沒有通用的，選錯生態系的那張在履歷上幾乎不加分。

**把效期算進總成本。** AWS 三年、Google 兩年、NVIDIA 與 Databricks 兩年。Google 只能重考；AWS 原則上也是重考，但往上考一階會自動續掉下層那張；微軟的免費線上更新評量仍是這幾家裡最省的一個。另外別忘了失敗成本 —— AWS 重考要等 14 天並再付一次全額。

**證照的半衰期比想像中短。** AI-102 退場、PMLE 換名、Claude 從一張擴成四張，全部發生在 2026 上半年。任何超過三個月的證照推薦文，預設它至少有一條已經失效 —— 包括這篇，報名前還是打開官方頁面對一次。

**iPAS 中級仍然划算**，兩科 1,000 元、國家級認證、對本地職場與政府標案有加分 —— 但要把 5 年換證的維護成本算進去。

## 更新紀錄

- 2026-08-07：新增「課程要花多少」一節。原文只列考試費，沒有課程費那一層，而兩筆是分開的（不用先上課才能報考）。五家的免費／付費分界對照，結論是只有 AWS 的 $29 月費值得付 —— 因為完整模擬考只在付費層。
- 2026-08-07：新增「省錢管道」一節（AWS 專業級考試券含免費重考、微軟 beta 前 300 名八折、Databricks 季度 Learning Festival 5 折券、NVIDIA 的 webinar 與 GTC 現場、以及公司端的 Get Certified / ESI / 團隊考試券）。同時補上兩處遺漏：**AI-500 認證要求必須先取得 AI-103**，以及 Google 認證通過後會拿到一張續證用的 50% 折扣碼（原文把續證成本寫成全額 $200）。
- 2026-08-07：補齊四處。AWS 段補上重考政策（14 個日曆天等待、每次全額付費）、及格線（700 / 720 / 750）與成績公布時間，並修正「重新認證只能重考」—— 考到 MLA-C01 會自動續掉 AIF-C01。Google 段補 PMLE 的考試語言與「不直接考程式能力」的官方說明。微軟段補 AI-103 的 $165 價格、免費課程時數，以及目前沒有 practice assessment；同時記下它的語言清單在兩個官方頁上不一致。Claude 段修正「訓練課程本身免費公開」—— 訓練不收費但限 Partner Network 成員，門檻是公司加入（加入本身免費）。

## 參考資料

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AWS Certified Machine Learning – Specialty（退場公告，最後考試日 2026/3/31）](https://aws.amazon.com/certification/certified-machine-learning-specialty)
- [AWS Recertification 政策（三年效期）](https://aws.amazon.com/certification/policies/recertification/)
- [AWS Certification「After Testing」政策（重考等待期、及格線、成績公布時間）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certified AI Practitioner 繁中認證頁（自動重新認證的說明）](https://aws.amazon.com/tw/certification/certified-ai-practitioner)
- [AWS 優惠券活動條款與條件（專業級／專家級含免費重考）](https://aws.amazon.com/tw/certification/bulk-voucher/terms-and-conditions)

**Google Cloud**

- [Professional ML Engineer 官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer 認證頁](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader 認證頁](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud 認證總覽（含 Get Certified 計畫）](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions（效期與重新認證條款）](https://cloud.google.com/certification/terms)
- [Google Cloud Certification — Vouchers & Discounts（續證 50% 折扣碼）](https://support.google.com/cloud-certification/answer/10055456)
- [Welcome to Google Cloud Next '26（Gemini Enterprise Agent Platform 發表）](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR 計畫與 AI 學習路徑](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Apps and Agents Developer Associate（AI-103）](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [AI-103 考試頁（價格、語言清單、practice assessment 狀態）](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)
- [AI-103T00 課程：Develop AI apps and agents on Azure](https://learn.microsoft.com/en-us/training/courses/ai-103t00/)
- [Multi-Agent AI Solutions Expert（AI-500，beta）](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [微軟官方公告：AI-500 認證要求與 beta 折扣機制](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-multi-agent-ai-solutions-expert-certification/4494122)
- [Agentic AI Business Solutions Architect（AB-100）](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Azure AI Engineer Associate（AI-102，已退場）](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)
- [Microsoft Credentials roundup: June 2026](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)
- [Pearson VUE — Microsoft Exam Updates](https://www.pearsonvue.com/us/en/microsoft/updates.html)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA NCA-GENL 官方頁面](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA Deep Learning Institute（免費自學課程與 GTC 現場考試）](https://www.nvidia.com/en-us/training/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Databricks Virtual Learning Festival FAQ（5 折券規則與效期）](https://community.databricks.com/t5/training-offerings/faq-for-virtual-learning-festival-16-march-03-april-2026/td-p/150220)
- [Anthropic：Four role-based certifications（2026/7/23 公告）](https://claude.com/blog/four-role-based-claude-certifications)
- [Pearson VUE — Claude Certification Program](https://www.pearsonvue.com/us/en/anthropic.html)

**iPAS**

- [iPAS AI 應用規劃師考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)
- [115 年度 AI 應用規劃師能力鑑定簡章（初、中級）](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)
- [AI 應用規劃師中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)
- [iPAS 考試報名說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration)
- [104：非工程師也能考！2026 最新 AI 證照指南](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617)

**站內相關**

- [AI 證照怎麼準備：先算排考日，再排讀書順序](/posts/ai/2026-08-07-ai-certification-prep-method)
- [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)
- [2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production](/posts/ai/2026-07-10-ai-courses-2026-guide)
