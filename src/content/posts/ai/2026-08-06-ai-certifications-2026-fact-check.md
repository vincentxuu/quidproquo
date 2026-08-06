---
title: "2026 工程師 AI 證照：哪些還能考，哪些已經停考或不存在"
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
tldr: "拿一份流傳的「2026 工程師 AI 證照推薦」逐條打官方頁面查核，抓到三個硬錯誤：AI-102 已於 2026/6/30 停考、Google 根本沒有 GenAI Engineer 認證（官方頁 404）、iPAS 中級證書效期是 5 年不是永久。另外 Google PMLE 整份考綱的產品名已從 Vertex AI 換成 Gemini Enterprise Agent Platform，2026 年 6 月前的教材全部作廢。"
description: "用官方一級來源逐條查核 2026 年工程師向 AI 證照清單：AWS AIP-C01 / MLA-C01、Google PMLE、微軟 AI-103 與 Agent 認證線、NVIDIA NCA-GENL、Databricks GenAI Engineer、Anthropic Claude 四張證照、iPAS AI 應用規劃師中級的實際價格、效期、報考門檻與考綱異動。"
glossary:
  - term: "Gemini Enterprise Agent Platform"
    aliases: ["Agent Platform"]
    definition: "Google Cloud 在 Cloud Next '26 發表的 agent 開發平台，整併並取代原本 Vertex AI 的品牌與服務名稱。"
    advanced: "包含 Agent Studio、Agent-to-Agent Orchestration、Agent Registry、Agent Identity、Agent Gateway、Agent Observability，原 Vertex AI 的 AutoML / Workbench / Feature Store / Model Registry / Pipelines 皆改掛 Agent Platform 前綴。"
    context: "本文用它說明 Google PMLE 考綱改版後，舊備考教材為何全數失效。"
    links:
      - label: "Welcome to Google Cloud Next '26"
        url: "https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)

一份「2026 工程師 AI 證照推薦」清單看起來很合理：AWS、Google Cloud、Azure、NVIDIA、Databricks 一路排下來，每張都標了價格，最後補一句台灣在地的 iPAS。問題是，把每一條拿去打官方頁面之後，**其中三條已經失效**——一張證照在兩個月前停考、一張從來就不存在、一張的效期寫反了。

這篇記錄逐條查核的結果。所有價格、效期、考科都以官方頁面為準，二手部落格只用來找線索、不用來下結論——這次查下來，錯得最離譜的幾筆全部來自二手整理。

## 為什麼二手來源在證照這件事上特別不可靠

證照資訊有個結構性問題：**內容農場的更新頻率遠低於原廠的改版頻率**。2026 上半年三家雲廠商同時大改 AI 證照線，但 SEO 排名前段的「2026 最佳 AI 證照」文章，很多是 2025 年寫好之後只改標題年份。

實際遇到的三種失效模式：

| 失效模式 | 這次抓到的例子 |
|---|---|
| 證照已停考，文章還在推 | 微軟 AI-102 |
| 證照根本不存在，被憑空創造 | 「Google Cloud GenAI Engineer」 |
| 規格寫反 | iPAS 中級「永久有效」 |

還有一種更隱蔽的：**證照還在、名字沒變，但考綱內容整個被換掉**。Google PMLE 就是這種，下面單獨講。

## 錯誤一：微軟 AI-102 已經停考

原始清單寫「AI-102 或新版 AI-103」，暗示兩者都能選。實際上 [Azure AI Engineer Associate 官方認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)頂端掛著警告：

> This certification and the renewal assessment are retired.

該頁 metadata 的更新時間是 `2026-06-30`，並已標記 `hidden: true` / `noindex`——微軟連搜尋引擎索引都撤掉了。已持證者的資格會留到自然到期，但**不能續證，也不能新考**。

接替的是 **AI-103**，對應 [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)。官方描述是「designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry」——核心平台是 **Microsoft Foundry**，不是原始清單猜的 Semantic Kernel。

這裡有個查核陷阱值得記一下：微軟 Q&A 上仍有回答說 AI-103 還在 beta。但認證頁的標題已經沒有 `(beta)` 後綴、`hidden: false`、更新於 `2026-07-23`——**它已經 GA 了**，Q&A 那筆是轉正前的舊資料。同一個官方網域內，不同頁面的新鮮度可以差好幾個月。

微軟這波退役規模比清單提到的大得多，整條 AI 線幾乎全換：

| 舊 | 新 | 退休日 |
|---|---|---|
| AI-900 Azure AI Fundamentals | AI-901 | 2026/6/30 |
| AI-102 Azure AI Engineer | AI-103 Azure AI Apps and Agents Developer | 2026/6/30 |
| DP-100 Azure Data Scientist | AI-300 MLOps Engineer | 2026/6/1 |
| AZ-204 Azure Developer | AI-200 Azure AI Cloud Developer | 2026/7/31 |
| AZ-500 Azure Security Engineer | SC-500 Cloud and AI Security Engineer | 2026/8/31 |

原始清單說「2026 年微軟大推 Agent 相關證照」，這句是對的，而且低估了。除了已 GA 的 AB-620（AI Agent Builder Associate），還有兩張**專家級**的：

- [Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)（AI-500，beta）——官方定位是「designing, building, and optimizing scalable, production-ready, multi-agent AI systems」
- [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)（AB-100）

**AI-500 是這次查核裡最值得注意的一張。** 主流雲廠商目前沒有第二張專攻「多 agent 系統架構」的專家級認證。想往 Agent 方向走，它的鑑別度比 associate 級的 AI-103 高一階。代價是 beta 階段出分慢，且考題會隨正式版調整。

## 錯誤二：Google 沒有 GenAI Engineer 認證

原始清單建議「Google Cloud → Professional ML Engineer 或 Cloud GenAI Engineer」。後者不存在。三種方式交叉驗證：

1. 直接請求 `cloud.google.com/learn/certification/generative-ai-engineer` → **HTTP 404**
2. [Google Cloud 認證總覽頁](https://cloud.google.com/learn/certification)的 AI 相關項目只有兩個：Generative AI Leader（基礎級）與 Professional Machine Learning Engineer（專業級）
3. 多份第三方完整清單交叉比對，Professional 級共 9 張——Cloud Architect、Cloud Database Engineer、Cloud Developer、Data Engineer、Cloud DevOps Engineer、Cloud Security Engineer、Cloud Network Engineer、Workspace Administrator、Machine Learning Engineer。沒有 GenAI 或 Agent 工程師認證。

Google 的策略是**把 agentic 內容塞進既有的 PMLE，而不是另開證照**。所以在 Google 生態裡想證明 GenAI / Agent 能力，PMLE 就是唯一那張。

順帶把常被誤推的 [Generative AI Leader](https://cloud.google.com/learn/certification/generative-ai-leader) 規格釘住：$99、90 分鐘、50–60 題、**效期 3 年**、無先修條件。官方對適用對象講得很白：

> This certification is for anyone in any job role, with or without hands-on technical experience.

對有程式基礎的工程師來說鑑別度太低，原始清單把它歸為「跳過」是對的。另外它的考試語言是英文、日文、西班牙文、葡萄牙文——**沒有中文**。

## 錯誤三：iPAS 中級不是永久有效

這條在台灣的中文資料裡錯得最普遍，連 104 的文章都寫「證書永久有效」。[115 年度 AI 應用規劃師能力鑑定簡章](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)寫得很清楚：

| 級等 | 證書效期 | 換發標準 |
|---|---|---|
| 初級 | 永久有效 | 不需換發 |
| **中級** | **5 年** | 取得證書後 5 年內接受 AI 相關訓練合計 48 小時以上 |

換證還有一條友善設計：**從事 AI 相關工作，每一年工作年資可折抵 8 小時訓練時數**。工程師如果本職就在做 AI，五年年資折 40 小時，只要再補 8 小時課程就能換證。

「永久有效」這個說法會流傳，大概是因為初級確實永久，被籠統套用到整張證照上。

其餘規格查核結果都對得上：中級科目 1「人工智慧技術應用與規劃」必考，科目 2「大數據處理分析與應用」與科目 3「機器學習技術與應用」擇一，兩科都要 ≥70 分。費用是 115–116 年度優惠價 **500 元/科**（原價 1,500 元），兩科合計 1,000 元，117 年起恢復原價。

原始清單提到「含約 25% Python 程式閱讀題」也屬實，而且有官方依據——iPAS 發過[中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)，自 114 年第二梯次起，科目 2 與科目 3 加入程式碼判讀題。

時間上有個實際的門：115 年度中級只考兩場（5/23、11/14），第二場的個人報名到 **2026/9/22 中午 12 點**截止。

## Google PMLE：證照沒變，但整份考綱的產品名被換掉了

這是這次查核裡最有實質影響、卻最少人講的一條。原始清單說 PMLE「涵蓋 Vertex AI、MLOps、模型部署與監控」——**Vertex AI 這個詞在現行考綱裡幾乎已經消失**。

把[官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)全文抓下來對照，服務名稱是這樣對應的：

| 舊名（多數教材仍在用） | 現行考綱用詞 |
|---|---|
| Vertex AI | Gemini Enterprise Agent Platform |
| Vertex AI AutoML | Agent Platform AutoML |
| Vertex AI Workbench | Agent Platform Workbench |
| Vertex AI Feature Store | Agent Platform Feature Store |
| Vertex AI Model Registry | Agent Platform Model Registry |
| Vertex AI Pipelines | Agent Platform Pipelines |
| Vertex AI Prediction | Agent Platform Inference |
| Model Garden | Model Garden（唯一沒改的）|

這不是換皮而已。Google 在 Cloud Next '26 把 Vertex AI 整併進 [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)，官方說法是「brings together the best of Vertex AI with transformational new features, including Agent Studio, Agent-to-Agent Orchestration, Agent Registry, Agent Identity, Agent Gateway, Agent Observability」。認證總覽頁也掛了公告，說考試正在更新以反映 Cloud Next '26 的產品異動。

**實務影響**：2026 年年中以前出版的所有 PMLE 教材、Udemy 課程、題庫，用的都是舊名詞。考題會直接用新名字問你，只認得 Vertex AI 舊術語的人，看到「Agent Platform Feature Store」會愣在那裡。這是原始清單裡最容易讓人白白丟掉 $200 的坑。

各章配分也重排過（官方考綱現行版）：

| 章節 | 比重 |
|---|---|
| 1. Architecting low-code AI solutions | ~13% |
| 2. Collaborating within and across teams to manage data and models | ~16% |
| 3. Scaling prototypes into ML models | ~21% |
| 4. Serving and scaling models | ~20% |
| 5. Automating and orchestrating ML pipelines | ~18% |
| 6. Monitoring AI solutions | 其餘 |

幾個新塞進來、傳統 ML 教材不會教的考點：**LLM-as-a-judge 評估**、**prompt and context engineering**（寫在候選人描述裡）、**Gemini 應用的 cost / latency / availability 最佳化**、**用 BigQuery fine-tune Gemini 模型**。這已經不是純傳統 ML 的考試。

效期也要算進成本：Google 官方[考試條款](https://cloud.google.com/certification/terms)明訂 Professional 認證有效期兩年，續證**必須重考**（不像微軟有免費線上 renewal assessment），可在到期前 60 天開始。以 Google 改名字的頻率，每兩年 $200 加一次重新準備改版考綱，維護成本不低。

## Claude 證照：規格對了，但報考門檻沒人提

原始清單寫「Anthropic Claude Certified（Developer / Architect – Foundations）$99–$175」。價格區間對，但把四張證照混成一團。實際規格：

| 證照 | 代碼 | 價格 | 對象 |
|---|---|---|---|
| Claude Certified Associate – Foundations | CCAO-F | $99 | 非技術職 |
| Claude Certified Developer – Foundations | CCDV-F | $125 | 工程師 |
| Claude Certified Architect – Foundations | CCAR-F | $125 | 架構師 |
| Claude Certified Architect – Professional | CCAR-P | $175 | 資深架構師 |

工程師要的是 **CCDV-F，$125**，不是 $99（那是非技術職的 Associate）。

兩個原始清單完全沒提、但會直接影響能不能考的點：

**第一，效期只有 12 個月。** 其他家都是 2–3 年，Claude 證照一年就要重新處理。

**第二，報考走 Partner Network。** [Pearson VUE 官方頁面](https://www.pearsonvue.com/us/en/anthropic.html)（最後更新 2026-07-08）寫：

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

備考訓練也一樣：「Training is available to members of the Claude Partner Network」。網路上聲稱個人可自由報名的說法，我找不到任何官方來源支持——**規劃時請當作需要透過 partner 組織**。備考課程本身是免費公開的，這點沒有門檻。

重考政策：第一次沒過等 14 天、第二次 30 天、第三次 90 天，滾動 12 個月內最多 4 次。

考試內容的細節可以參考站內的 [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)——不過那篇寫於 2026 年 3 月，當時只有 Architect 一張，7 月擴編成四張後的價格與代碼以本文為準。

## 查核通過的部分

清單其餘項目對照官方頁面都成立，一併把準確規格記下來：

| 證照 | 費用 | 時長 / 題數 | 效期 |
|---|---|---|---|
| [AWS Certified Generative AI Developer – Professional](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) (AIP-C01) | $300 | 180 分 / 75 題 | 3 年 |
| [AWS Certified ML Engineer – Associate](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) (MLA-C01) | $150 | 130 分 / 65 題 | 3 年 |
| [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner) (AIF-C01) | $100 | 90 分 / 65 題 | 3 年 |
| [Google Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) | $200 | 120 分 / 50–60 題 | 2 年 |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | $125 | 60 分 / 50–60 題 | 2 年 |
| [Databricks GenAI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate) | $200 | 90 分 / 45 題 | 2 年 |

幾個細節修正：

- **AIP-C01 及格線 750/1000**，75 題中有 10 題是不計分的試題，實際計分 65 題。
- **NVIDIA NCA-GENL 是 $125**，不是某些部落格寫的 $135。官方 blueprint 配分：Core ML 30%、Software Development 24%、Experimentation 22%、Data Analysis & Visualization 14%、Trustworthy AI 10%。
- **AWS ML Specialty 確實已退休**，最後考試日 2026/3/31，已持證者資格保留 3 年。原始清單說 MLA-C01「取代舊的 ML Specialty」，方向正確。
- **Databricks 那張的重心在應用開發**：Application Development 30% + Assembling and Deploying 22%，加起來過半，不是理論考試。

至於原始清單那句「Google Cloud PMLE 目前就業市場提及頻率最高之一」——**查不到可信的職缺統計來源支撐**。當參考，別當事實。

## 兩個能省錢的東西

查 Google 這條時順手撈到的，原始清單沒提：

**Get Certified program**——Google Cloud 客戶可免費參加認證備考計畫。如果公司是 GCP 客戶，先問內部有沒有名額，$200 可以省下來。

**GEAR program**——Cloud Next '26 發表、跑在 Google Skills 上的 agent 實作訓練，新學習路徑包含 *Introduction to Agents and Google's Agent Ecosystem* 與 *Develop Agents with Agent Development Kit (ADK)*。這對補 PMLE 新增的 agentic 考點很直接，而且 ADK 的實作可以直接變成作品集——比單純刷題划算。

## 整體來說

查完之後，對這份清單的修正版判斷是這樣：

**證照的半衰期比想像中短。** 這次查到的三個錯誤全部發生在 2026 上半年——AI-102 停考、PMLE 換名、Claude 從一張變四張，都在半年內。任何超過三個月的證照推薦文，預設它至少有一條已經失效。

**先確認雲，再挑證照，順序不能反。** 一張 AWS 證照在跑 Azure 的公司幾乎沒有議價力。原始清單這個建議是整份最有價值的一句。

**準備教材的新鮮度比證照本身重要。** PMLE 是最好的例子：證照名字沒變、價格沒變、官網長得一樣，但拿舊教材去考會直接撞牆。報名前先花十分鐘打開官方 exam guide 對一遍服務名稱，這十分鐘的 ROI 遠高於多刷一百題。

**台灣在地的 iPAS 中級仍然划算**，兩科 1,000 元、國家級認證、對本地職場和政府標案有加分——但要把 5 年換證的維護成本算進去，別以為考完就一勞永逸。

想看課程而非證照的選項，站內另有一篇 [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)，把 OpenAI、Anthropic、Google 三家官方課程按能力層級重排過。

## 參考資料

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified Machine Learning – Specialty（退休公告）](https://aws.amazon.com/certification/certified-machine-learning-specialty)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)

**Google Cloud**

- [Professional ML Engineer 官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer 認證頁](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader 認證頁](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud 認證總覽](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions（效期與續證條款）](https://cloud.google.com/certification/terms)
- [Welcome to Google Cloud Next '26（Gemini Enterprise Agent Platform 發表）](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR program 與 AI 學習路徑](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Engineer Associate（AI-102，已退休）](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)
- [Azure AI Apps and Agents Developer Associate（AI-103）](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [Multi-Agent AI Solutions Expert（AI-500，beta）](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Agentic AI Business Solutions Architect（AB-100）](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Microsoft Credentials roundup: June 2026](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)
- [Pearson VUE — Microsoft Exam Updates](https://www.pearsonvue.com/us/en/microsoft/updates.html)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA NCA-GENL 官方頁面](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Pearson VUE — Claude Certification Program](https://www.pearsonvue.com/us/en/anthropic.html)

**iPAS**

- [iPAS AI 應用規劃師考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)
- [115 年度 AI 應用規劃師能力鑑定簡章（初、中級）](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)
- [AI 應用規劃師中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)
- [iPAS 考試報名說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration)

**站內相關**

- [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)
- [2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production](/posts/ai/2026-07-10-ai-courses-2026-guide)
