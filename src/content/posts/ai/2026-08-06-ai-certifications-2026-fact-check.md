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
tldr: "六張目前還能考的工程師向 AI 證照，價格與效期逐條打過官方頁面。三個廣為流傳的說法是錯的：微軟 AI-102 已於 2026/6/30 停考、Google 根本沒有 GenAI Engineer 認證（官方 URL 回 404）、iPAS 中級證書效期是 5 年而非永久。另外 Google PMLE 的考綱已把 Vertex AI 全面改名為 Gemini Enterprise Agent Platform，2026 年年中以前的備考教材等同作廢。"
description: "2026 年工程師向 AI 證照的實際規格：AWS AIP-C01 / MLA-C01 / AIF-C01、Google PMLE、微軟 AI-103 與 Agent 認證線、NVIDIA NCA-GENL、Databricks GenAI Engineer、Anthropic Claude 四張證照、iPAS AI 應用規劃師中級的價格、效期、報考門檻與考綱異動，全部對照官方頁面。"
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

工程師選 AI 證照最大的風險不是選錯，是**選到已經不存在的**。2026 上半年三家雲廠商同時改版 AI 認證線，但搜尋排名前段的推薦文很多是 2025 年寫好之後只改了標題年份。

這篇把常被推薦的證照逐條對照官方頁面，價格、效期、考科都以原廠公告為準。結論先講：**三個廣為流傳的說法已經失效**，還有一張證照名字沒變、考綱卻整個被換掉。

## 先看結論：六張還能考的證照

| 證照 | 費用 | 時長 / 題數 | 效期 |
|---|---|---|---|
| [AWS Certified Generative AI Developer – Professional](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) (AIP-C01) | $300 | 180 分 / 75 題 | 3 年 |
| [AWS Certified ML Engineer – Associate](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) (MLA-C01) | $150 | 130 分 / 65 題 | 3 年 |
| [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner) (AIF-C01) | $100 | 90 分 / 65 題 | 3 年 |
| [Google Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) | $200 | 120 分 / 50–60 題 | 2 年 |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | $125 | 60 分 / 50–60 題 | 2 年 |
| [Databricks GenAI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate) | $200 | 90 分 / 45 題 | 2 年 |

AWS 三張的效期來自[官方 recertification 政策](https://aws.amazon.com/certification/policies/recertification/)：「Certification through AWS is valid for three years from the date it was earned.」續證只能重考，AWS 明文不接受繼續教育學分。

微軟與 Anthropic 沒放進這張表，因為前者整條線剛換代、後者價格沒有官方公開版本，各自在下面單獨處理。

## 該考哪張

先確認你公司實際在跑哪朵雲，再挑證照 —— 順序反過來的話，一張 AWS 證照在跑 Azure 的公司幾乎沒有議價力。

| 你的環境 / 目標 | 建議路徑 |
|---|---|
| AWS，想快速起步 | AIF-C01（$100）→ MLA-C01（$150） |
| AWS，做 GenAI 應用 | 直接 AIP-C01（$300），需 2 年 AWS + 1 年 GenAI 經驗 |
| Google Cloud | PMLE（$200），且**只用 2026 年中之後的教材** |
| Azure / 微軟生態 | AI-103（associate）；想做 agent 再加 AI-500（expert，beta） |
| 資料平台 + LLM | Databricks GenAI Engineer Associate（$200） |
| 想碰 GPU / 模型層 | NVIDIA NCA-GENL（$125） |
| 台灣求職 / 接案 | iPAS 中級，兩科 1,000 元 |

單純想補基礎而不是拿證照的話，站內另有一篇 [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)，把 OpenAI、Anthropic、Google 三家官方課程按能力層級重排過。

## 微軟：AI-102 已停考，整條 AI 線換代

很多推薦文還在寫「考 AI-102」。實際上 [Azure AI Engineer Associate 官方認證頁](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)頂端掛著警告：

> This certification and the renewal assessment are retired.

該頁 metadata 更新時間是 `2026-06-30`，並標記 `hidden: true` / `noindex` —— 微軟連搜尋引擎索引都撤掉了。已持證者的資格會留到自然到期，但**不能續證，也不能新考**。

接替的是 **AI-103**，對應 [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)。官方描述是「designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry」—— 核心平台是 **Microsoft Foundry**。

退役規模比多數文章提到的大，整條 AI 線幾乎全換（依 [Pearson VUE 的微軟考試異動表](https://www.pearsonvue.com/us/en/microsoft/updates.html)與 [Microsoft Credentials roundup](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)）：

| 舊 | 新 | 退休日 |
|---|---|---|
| AI-900 Azure AI Fundamentals | AI-901 | 2026/6/30 |
| AI-102 Azure AI Engineer | AI-103 Azure AI Apps and Agents Developer | 2026/6/30 |
| DP-100 Azure Data Scientist | AI-300 MLOps Engineer | 2026/6/1 |
| AZ-204 Azure Developer | AI-200 Azure AI Cloud Developer | 2026/7/31 |
| AZ-500 Azure Security Engineer | SC-500 Cloud and AI Security Engineer | 2026/8/31 |

Agent 這條線微軟給得比其他家完整。除了已 GA 的 AB-620（AI Agent Builder Associate），還有兩張**專家級**：[Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)（AI-500，beta，官方定位是「designing, building, and optimizing scalable, production-ready, multi-agent AI systems」）與 [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)（AB-100）。

**AI-500 值得單獨留意。** 主流雲廠商目前沒有第二張專攻多 agent 系統架構的專家級認證，想往 Agent 方向走，鑑別度比 associate 級的 AI-103 高一階。代價是 beta 階段出分慢、考題會隨正式版調整。

## Google：沒有 GenAI Engineer，而 PMLE 的考綱被換掉了

「Google Cloud GenAI Engineer」這張證照不存在。三種方式交叉驗證：直接請求 `cloud.google.com/learn/certification/generative-ai-engineer` 回 **HTTP 404**；[官方認證總覽頁](https://cloud.google.com/learn/certification)的 AI 認證項目只有 Generative AI Leader（基礎級）與 Professional ML Engineer（專業級）；Professional 級共 9 張，沒有任何 GenAI 或 Agent 工程師認證。

Google 的策略是**把 agentic 內容塞進既有的 PMLE，而不是另開證照**。所以在 Google 生態要證明 GenAI / Agent 能力，PMLE 是唯一那張。

順帶釘住常被誤推的 [Generative AI Leader](https://cloud.google.com/learn/certification/generative-ai-leader)：$99、90 分鐘、50–60 題、效期 3 年。官方對適用對象講得很白：

> This certification is for anyone in any job role, with or without hands-on technical experience.

對有程式基礎的人鑑別度太低。考試語言是英文、日文、西班牙文、葡萄牙文 —— 沒有中文。

### PMLE 的產品名全部換過

這是本文最有實質影響的一條。多數推薦文說 PMLE「涵蓋 Vertex AI」—— **Vertex AI 這個詞在現行考綱裡幾乎已經消失**。把[官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)全文對照：

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

Google 在 Cloud Next '26 把 Vertex AI 整併進 [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)，官方說法是它「brings together the best of Vertex AI with transformational new features, including Agent Studio, Agent-to-Agent Orchestration, Agent Registry, Agent Identity, Agent Gateway, Agent Observability」。

**實務影響**：2026 年年中以前出版的 PMLE 教材、線上課、題庫，用的都是舊名詞。考題直接用新名字問你，只認得 Vertex AI 舊術語的人會愣在「Agent Platform Feature Store」上。這是最容易白丟 $200 的坑。

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

效期要算進成本：官方[考試條款](https://cloud.google.com/certification/terms)明訂 Professional 認證兩年有效，續證**必須重考**（不像微軟有免費線上 renewal assessment），可在到期前 60 天開始。以 Google 改名字的頻率，每兩年 $200 加一次重新準備，維護成本不低。

### 兩個能省錢的 Google 資源

[Get Certified 計畫](https://cloud.google.com/learn/certification)讓 Google Cloud **客戶**免費參加認證備考。公司是 GCP 客戶的話，先問內部有沒有名額，$200 可以省下來。

[GEAR 計畫](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)是 Cloud Next '26 發表、跑在 Google Skills 上的 agent 實作訓練，新學習路徑包含 *Introduction to Agents and Google's Agent Ecosystem* 與 *Develop Agents with Agent Development Kit (ADK)*。這對補 PMLE 新增的 agentic 考點很直接，ADK 的實作還能直接變成作品集。

## Claude：四張證照，但價格沒有官方公開版本

[Anthropic 於 2026 年 7 月 23 日公告](https://claude.com/blog/four-role-based-claude-certifications)把認證擴編成四張，涵蓋 Associate、Developer、Architect 三種角色。同一篇公告提到，自 3 月推出以來「more than 36,000 consultants have received certification across more than 1,300 organizations」。

工程師對應的是 **Claude Certified Developer: Foundations**，官方描述為「for engineers building applications with Claude, and includes training on the Claude API, tool use, and agent development」。

**價格這裡要誠實說明**：Anthropic 沒有在公開頁面列出考試費用。[Pearson VUE 的官方頁](https://www.pearsonvue.com/us/en/anthropic.html)只列出四張證照的名稱與代碼，沒有價格。以下數字來自第三方彙整，**且彼此不一致**：

| 證照 | 代碼 | 第三方報價 | 對象 |
|---|---|---|---|
| Claude Certified Associate: Foundations | CCAO-F | $99 | 非技術職 |
| Claude Certified Developer: Foundations | CCDV-F | $125 | 工程師 |
| Claude Certified Architect: Foundations | CCAR-F | $125 或 $175（來源分歧） | 架構師 |
| Claude Certified Architect: Professional | CCAR-P | $175 | 資深架構師 |

效期同樣沒有官方公開數字，第三方普遍說 12 個月、到期前可免費做一次非監考的續證評量。**報名前請以 Partner Academy 結帳頁顯示的金額為準。**

報考門檻則有官方依據。Pearson VUE 頁面（最後更新 2026-07-08）寫：

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

備考訓練也一樣限 Partner Network 成員。網路上聲稱個人可自由報名的說法，我找不到官方來源支持 —— **規劃時請當作需要透過 partner 組織**。備考課程本身免費公開，這點沒有門檻。

考試內容細節可參考站內的 [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)，不過那篇寫於 2026 年 3 月、當時只有 Architect 一張，代碼與價格以本文為準。

## iPAS 中級：不是永久有效

這條在台灣的中文資料裡錯得最普遍，連 [104 的證照指南](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617)都寫「證書永久有效」。[115 年度 AI 應用規劃師能力鑑定簡章](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)寫得很清楚：

| 級等 | 證書效期 | 換發標準 |
|---|---|---|
| 初級 | 永久有效 | 不需換發 |
| **中級** | **5 年** | 取得證書後 5 年內接受 AI 相關訓練合計 48 小時以上 |

換證有一條對工程師友善的設計：**每一年 AI 相關工作年資可折抵 8 小時訓練時數**。本職就在做 AI 的話，五年年資折 40 小時，再補 8 小時課程就能換證。

其餘規格都對得上。依[官方考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)，中級科目 1「人工智慧技術應用與規劃」必考，科目 2「大數據處理分析與應用」與科目 3「機器學習技術與應用」擇一，兩科都要 ≥70 分。費用是 115–116 年度優惠價 **500 元/科**（原價 1,500 元），兩科合計 1,000 元，117 年起恢復原價。

「約 25% Python 程式閱讀題」的說法屬實且有官方依據 —— iPAS 發過[中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)，自 114 年第二梯次起，科目 2 與科目 3 加入程式碼判讀題。

時間上有個實際的門：依[官方報名說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration)，115 年度中級只考兩場（5/23、11/14），第二場個人報名到 **2026/9/22 中午 12 點**截止。

## 這些說法為什麼會錯

三個失效模式，都不是作者亂寫，而是結構性的：

| 失效模式 | 例子 | 成因 |
|---|---|---|
| 證照已停考，文章還在推 | AI-102 | 內容農場更新頻率遠低於原廠改版頻率 |
| 證照不存在，被憑空創造 | 「Google Cloud GenAI Engineer」 | 從「Google 有 GenAI 認證」推論出一個合理但虛構的名字 |
| 規格寫反 | iPAS 中級「永久有效」 | 初級確實永久，被籠統套用到整張證照 |

還有一個查核陷阱值得記：**同一個官方網域內，不同頁面的新鮮度可以差好幾個月**。微軟 Q&A 上仍有回答說 AI-103 在 beta，但認證頁早已拿掉 `(beta)` 後綴、標記 `hidden: false`、更新於 `2026-07-23`。官方來源也要看是哪一頁、什麼時候更新的。

順帶一提，常見的「PMLE 是就業市場提及頻率最高的 AI 證照」這類說法，**查不到可信的職缺統計來源支撐**。當參考，別當事實。

## 整體來說

**證照的半衰期比想像中短。** 本文抓到的三個錯誤全部發生在 2026 上半年 —— AI-102 停考、PMLE 換名、Claude 從一張擴成四張，都在半年內。任何超過三個月的證照推薦文，預設它至少有一條已經失效。

**準備教材的新鮮度比證照本身重要。** PMLE 是最好的例子：名字沒變、價格沒變、官網長得一樣，但拿舊教材去考會直接撞牆。報名前花十分鐘打開官方 exam guide 對一遍服務名稱，ROI 遠高於多刷一百題。

**廠商不公開的資訊，不要當成已知。** Claude 證照的價格與效期在網路上被寫得斬釘截鐵，實際上 Anthropic 從未公開，第三方之間還互相矛盾。遇到這種情況，正確做法是去結帳頁看，不是相信整理文。

**iPAS 中級仍然划算**，兩科 1,000 元、國家級認證、對本地職場與政府標案有加分 —— 但要把 5 年換證的維護成本算進去。

## 參考資料

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AWS Certified Machine Learning – Specialty（退休公告，最後考試日 2026/3/31）](https://aws.amazon.com/certification/certified-machine-learning-specialty)
- [AWS Recertification 政策（三年效期）](https://aws.amazon.com/certification/policies/recertification/)

**Google Cloud**

- [Professional ML Engineer 官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer 認證頁](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader 認證頁](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud 認證總覽（含 Get Certified 計畫）](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions（效期與續證條款）](https://cloud.google.com/certification/terms)
- [Welcome to Google Cloud Next '26（Gemini Enterprise Agent Platform 發表）](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR 計畫與 AI 學習路徑](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

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
- [Anthropic：Four role-based certifications（2026/7/23 公告）](https://claude.com/blog/four-role-based-claude-certifications)
- [Pearson VUE — Claude Certification Program](https://www.pearsonvue.com/us/en/anthropic.html)

**iPAS**

- [iPAS AI 應用規劃師考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)
- [115 年度 AI 應用規劃師能力鑑定簡章（初、中級）](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)
- [AI 應用規劃師中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)
- [iPAS 考試報名說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration)
- [104：非工程師也能考！2026 最新 AI 證照指南](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617)

**站內相關**

- [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide)
- [2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production](/posts/ai/2026-07-10-ai-courses-2026-guide)
