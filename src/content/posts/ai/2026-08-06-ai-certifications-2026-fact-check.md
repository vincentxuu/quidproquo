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
tldr: "2026 年工程師能報名的 AI 證照逐張列出：AWS 三張（AIP-C01 / MLA-C01 / AIF-C01）、Google PMLE、微軟 AI-103 與 AI-500、NVIDIA 目錄十二張、Databricks、Snowflake、Oracle Agentic AI、IBM watsonx、Salesforce Agentforce、GitHub GH-300、Anthropic Claude 四張、iPAS AI 應用規劃師初中級，另有 IAPP AIGP 與 ISACA AAISM / AAIA 這條治理稽核線，價格、效期、報考門檻全部對照官方頁面。兩個會影響荷包的重點：Google PMLE 的考試大綱已把 Vertex AI 全面改名為 Gemini Enterprise Agent Platform，2026 年年中以前的教材等同作廢；iPAS 中級證書效期是 5 年而非永久。"
description: "2026 年工程師能報名的 AI 證照完整規格：AWS AIP-C01 / MLA-C01 / AIF-C01、Google Professional ML Engineer、微軟 AI-103 與 Agent 認證線、NVIDIA 十二張證照、Databricks、Snowflake、Oracle、IBM、Salesforce、GitHub Copilot GH-300、Anthropic Claude 四張、iPAS 初中級，以及 IAPP AIGP、ISACA AAISM / AAIA、CertNexus CAIP 的治理稽核線，價格、效期、報考門檻與考試大綱異動全部對照官方頁面。"
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

微軟與 Anthropic 沒放進這張表：微軟整條認證線今年剛改版，代碼要單獨對；Anthropic 沒有公開價格。兩家在下面各自處理。iPAS 是台灣本地的，規則跟國際廠商不同，也單獨一節。NVIDIA 這格只列了入門的 NCA-GENL，它的目錄實際上有十二張，往下有完整表；Snowflake、Oracle、IBM、Salesforce、GitHub 這幾家在「其他生態系」一節；治理與稽核那條線（IAPP、ISACA、CertNexus）跟工程師證照是兩回事，也單獨一節。

## 該考哪張

先確認你公司實際用的是哪一家雲端，再挑證照 —— 順序反過來的話，一張 AWS 證照在用 Azure 的公司幾乎沒有議價力。

| 你的環境 / 目標 | 建議路徑 |
|---|---|
| AWS，想快速起步 | AIF-C01（$100）→ MLA-C01（$150） |
| AWS，做 GenAI 應用 | 直接 AIP-C01（$300），需 2 年 AWS + 1 年 GenAI 經驗 |
| Google Cloud | PMLE（$200），且**只用 2026 年中之後的教材** |
| Azure / 微軟生態 | AI-103（associate）；想做 agent 再加 AI-500（expert，beta） |
| 資料平台 + LLM | Databricks GenAI Engineer Associate（$200） |
| 想碰 GPU / 模型層 | NVIDIA NCA-GENL（$125） |
| 要證明 agent 系統能力 | NVIDIA NCP-AAI（$200，professional）或微軟 AI-500（expert，beta） |
| Snowflake / Oracle / Salesforce 生態 | 見「其他生態系」一節，各家都有自己的 GenAI / agent 證照 |
| 天天用 Copilot 寫程式 | GitHub GH-300，是這批裡門檻最低的監考考試 |
| 做 AI 治理、稽核、資安合規 | IAPP AIGP 或 ISACA AAISM / AAIA，見「治理、稽核、資安」一節 |
| 台灣求職 / 接案 | iPAS 中級，兩科 1,000 元 |

單純想補基礎而不是拿證照的話，站內另有一篇 [2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)，把 OpenAI、Anthropic、Google 三家官方課程按能力層級重排過。

## AWS：三張差在價位與經驗門檻

三張都能直接報名，差別在深度與價格：[AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner) $100、90 分鐘、65 題，是入門那張；[MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) $150、130 分鐘、65 題，往 ML 工程實作走；最上面是 [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) $300、180 分鐘、75 題，官方建議先有 **2 年 AWS 經驗加 1 年 GenAI 開發經驗**，是三張裡唯一專攻 GenAI 應用開發的。

**MLA-C01 剩不到六週，別現在開始準備。** [官方認證頁](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)頂端掛著改版公告：

> This exam is being updated. Registration for the updated version (MLA-C02) opens September 1, 2026. The last day to take the current exam (MLA-C01) in English is September 28, 2026. The current exam in other languages (Korean, Japanese, and Simplified Chinese) will remain available until general availability of MLA-C02.

也就是說：**英文版最後考試日 2026/9/28**，日韓與簡中版可撐到 C02 正式上線。C02 的 exam guide 目前**還沒公布**（`machine-learning-engineer-associate-02` 的官方文件網址回 404），所以現在沒人知道它考什麼。想考 associate 這級的，理性選擇是等 9/1 看 C02 的規格，而不是花八週準備一張九月底就停考的考試。

**AIF-C01 有繁體中文。** 這張的考試語言有 12 種，含 Traditional Chinese —— 是本文所有證照裡唯一提供繁中的。相對地 MLA-C01 與 AIP-C01 只有英文、日文、韓文、簡體中文，Google PMLE 只有英文與日文。母語考試對閱讀速度的影響值得算進去。

三張效期都是 3 年，但續期規則比多數整理文寫得複雜，[官方 recertification 頁](https://aws.amazon.com/certification/recertification/)列得很清楚：

**AI 這三張沒有「上課換效期」的選項。** AWS 整體上有兩條路 —— renew（+3 年）與 maintain（+1 年，在 AWS Skill Builder 上完成，需付費訂閱）—— 但 maintain 只開放給 SAA、Developer、CloudOps/SysOps、SAP、DOP 那幾張。AIF-C01、MLA-C01、AIP-C01 的 Options 欄位裡沒有 maintain，只有考試。

**但考高階的會把低階一起續掉。** 這條最省錢，也最少人寫：

| 你持有的 | 續期方式（皆 +3 年） |
|---|---|
| AI Practitioner（AIF-C01） | 重考 AIF-C01、**或考過 MLA-C01**、**或考過 AIP-C01** |
| ML Engineer – Associate（MLA-C01） | 重考 MLA-C01、**或考過 AIP-C01** |
| GenAI Developer – Professional（AIP-C01） | 只能重考 AIP-C01 |

也就是說，考一張 AIP-C01 同時把 AIF-C01、MLA-C01 與 Data Engineer – Associate 全部往後推三年。

**續期有五折券。** 官方頁三張的 Cost 欄都寫「Use the 50% discount voucher in your AWS Certification Account」—— 三年後的續期成本是 $50 / $75 / $150，不是原價。

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

效期要算進成本：官方[考試條款](https://cloud.google.com/certification/terms)明訂 Professional 認證兩年有效，可在到期前 60 天開始續期。

續期規則 2026 年動過，兩個細節會影響你算的錢。[官方續期說明頁](https://support.google.com/cloud-certification/answer/9907853)寫，Google 已開放用 Google Skills 的繼續教育換一年效期，Foundational、Associate、Professional 三級都在表上 —— **但同頁的但書寫明，目前只有 CDL、ACE、PCA、PDE 四張有這個選項**，PMLE 不在內，官方說「plan to add the Google Skills renewal option to the other certifications at a later date」。所以 PMLE 現在仍然只能重考，只是這條限制看得出是暫時的。

另一個常被漏掉的是折扣：同頁寫初次取得認證時會給一組**續期五折折扣碼**，登入 CM Connect profile 查得到。$200 的續期成本實際上可以砍半，前提是你沒讓證照過期超過 30 天 —— 超過就得付全額重考。

### 兩個能省錢的 Google 資源

[Get Certified 計畫](https://cloud.google.com/learn/certification)讓 Google Cloud **客戶**免費參加認證的考前訓練。公司是 GCP 客戶的話，先問內部有沒有名額，$200 可以省下來。

[GEAR 計畫](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)是 Cloud Next '26 發表、跑在 Google Skills 上的 agent 實作訓練，新學習路徑包含 *Introduction to Agents and Google's Agent Ecosystem* 與 *Develop Agents with Agent Development Kit (ADK)*。這對補 PMLE 新增的 agentic 考點很直接，ADK 的實作還能直接變成作品集。

## 微軟：AI-103 打底，想做 agent 再往上加

現在的 associate 級是 **AI-103**，對應 [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)。官方描述是「designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry」—— 核心平台是 **Microsoft Foundry**，準備方向跟舊的 Azure AI 服務組合已經不一樣。

Agent 這條線微軟給得比其他家完整。除了已 GA 的 AB-620（AI Agent Builder Associate），還有兩張**專家級**：[Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)（AI-500，beta，官方定位是「designing, building, and optimizing scalable, production-ready, multi-agent AI systems」）與 [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)（AB-100）。

**AI-500 有一個硬性先修條件，多數整理文都沒寫。** [官方認證頁](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)的「Certification prerequisites」寫：

> To become a Microsoft Certified: Multi-Agent AI Solutions Expert (beta), you must earn the Microsoft Certified: Azure AI Apps and Agents Developer Associate certification.

也就是**必須先拿到 AI-103**，頁面欄位另標 `Prerequisites: 1 certification`。想直接考 AI-500 是不行的，實際成本是 $165（AI-103）加 $165（AI-500）。它目前**仍是 beta、只提供英文**，官方頁面還寫著「Learning paths or modules are not yet available for this certification」。

**AI-500 值得單獨留意。** 三大雲端業者裡只有微軟開了專攻多 agent 系統架構的專家級認證，想往 Agent 方向走，鑑別度比 associate 級的 AI-103 高一階。代價是 beta 階段成績出得慢、考題會隨正式版調整。要注意它不是市面上唯一的 agent 進階證照 —— NVIDIA 的 NCP-AAI 與 Oracle 的 Agentic AI track 都在同一個方向上，差別在綁的是誰的平台。

微軟這邊還有一個別家沒有的好處：續期有**免費線上 renewal assessment**，不用像 AWS、Google 那樣重考正式考試。這個好處也涵蓋掛在微軟認證傘下的 [GitHub Copilot 認證（GH-300）](https://learn.github.com/certification/COPILOT)：100 分鐘、效期 24 個月、Pearson VUE 監考，考的是 Copilot 的責任使用、prompt 設計、agent mode 與 MCP、內容排除與稽核。官方頁面只寫「價格依考試所在國家或地區而定」，**沒有列出金額**，網路上流傳的 $99 是第三方數字，報名頁才算數。

## NVIDIA：目錄有十二張，不是只有 NCA-GENL

前面總表只放了入門那張，[官方認證總覽頁](https://www.nvidia.com/en-us/learn/certification/)實際列了十二張，價格與時長如下：

| 證照 | 代碼 | 費用 | 時長 |
|---|---|---|---|
| Agentic AI（Professional） | NCP-AAI | $200 | 2 小時 |
| Generative AI LLMs（Professional） | NCP-GENL | $200 | 2 小時 |
| Generative AI LLM（Associate） | NCA-GENL | $125 | 1 小時 |
| Generative AI Multimodal（Associate） | NCA-GENM | $125 | 1 小時 |
| AI Infrastructure and Operations（Associate） | NCA-AIIO | $125 | 1 小時 |
| AI Infrastructure（Professional） | NCP-AII | $400 | 2 小時 |
| AI Networking（Professional） | NCP-AIN | $400 | 2 小時 |
| AI Rack and Interconnect（Professional） | NCP-ARI | $400 | 2 小時 |
| AI Operations（Professional） | NCP-AIO | $500 | 2 小時 |
| Accelerated Data Science（Professional） | NCP-ADS | $200 | 2 小時 |
| Accelerated Data Science（Associate） | NCA-ADS | $125 | 1 小時 |
| OpenUSD Development（Professional） | NCP-OUSD | $200 | 2 小時 |

兩張值得挑出來講。**NCP-AAI（Agentic AI）**是廠商證照裡少數直接以「多 agent 互動、規模化、倫理防護」為主軸的 professional 級，$200 的價位比微軟那條 expert 線好入手。**NCA-GENM（Generative AI Multimodal）**則是這批唯一專門考跨文字／影像／音訊系統的，做多模態應用的話比 NCA-GENL 對題。

另一個現實面：NCP-AII / NCP-AIN / NCP-ARI / NCP-AIO 這四張走的是機房與網路，$400 到 $500，考的是 GPU 叢集部署、監控與互連 —— 那是 infra 團隊的證照，不是應用工程師的。挑錯層級會花四倍的錢考一張用不到的。

## 其他生態系：Snowflake、Oracle、IBM、Salesforce

公司用的不是前面那幾家的話，這幾張才是對的那張：

| 證照 | 規格 | 備註 |
|---|---|---|
| [SnowPro Specialty: Gen AI](https://learn.snowflake.com/en/certifications/) | 現行代碼 **GES-C02**，Specialty 級一律 **$225** | 認代碼再買教材，同體系另有 Advanced: MLOps Engineer（MLA-B01）與 Data Scientist（DSA-C03） |
| Oracle **Agentic AI track**（四張） | Agentic AI Foundations（**免費**）、OCI Enterprise AI Professional、Agentic AI for Oracle AI Database Professional、for Oracle Data Platform Professional | 2026 年 8 月新開的整條線 |
| [IBM Certified watsonx Generative AI Engineer – Associate](https://www.ibm.com/training/certification/ibm-certified-watsonx-generative-ai-engineer-associate-C9007000) | 考試代碼 C1000-185 | **官方頁未列價格**，以 Pearson VUE 結帳頁為準 |
| [Salesforce Certified Agentforce Specialist](https://trailheadacademy.salesforce.com/certificate/exam-agentforce-specialist---AI-201) | AI-201，60 題 / 105 分鐘，**$200**（重考 $100），無先修 | 考 Prompt Builder、agent 生命週期、Testing Center、Data Library |

Oracle 這條線今年改了兩件事會影響你怎麼查資料：[官方公告](https://blogs.oracle.com/oracleuniversity/oci-certification-learning-paths-and-exams-2026-updates-now-available)寫，證照名稱與徽章**不再冠年份**（是「OCI Architect Associate」而不是「OCI 2026 Architect Associate」），而且 **Foundations 級課程與認證維持免費、Professional 級課程改為付費**。搜到的舊教學文多半還在講已經換掉的舊代碼，對照官方頁面就會發現名稱對不上。

## Claude：四張，官方規格都在 exam guide 裡

[Anthropic 於 2026 年 7 月 23 日公告](https://claude.com/blog/four-role-based-claude-certifications)把認證擴編成四張，涵蓋 Associate、Developer、Architect 三種角色。同一篇公告提到，自 3 月推出以來「more than 36,000 consultants have received certification across more than 1,300 organizations」。

工程師對應的是 **Claude Certified Developer: Foundations**，官方描述為「for engineers building applications with Claude, and includes training on the Claude API, tool use, and agent development」。

**四張的價格與效期官方都有公開**，只是路徑很深：Pearson VUE 頁 → [Anthropic Partner Academy](https://anthropic-partners.skilljar.com/) 的各證照頁 → 每張自己的 exam guide PDF。PDF 裡有「Exam Details at a Glance」表，逐字寫著費用與效期：

| 證照 | 代碼 | 題數 | 時間 | 費用 | 效期 |
|---|---|---|---|---|---|
| [Claude Certified Associate – Foundations](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification) | CCAO-F | 60 | 120 分 | **$99** | 12 個月 |
| [Claude Certified Developer – Foundations](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification) | CCDV-F | 53 | 120 分 | **$125** | 12 個月 |
| [Claude Certified Architect – Foundations](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) | CCAR-F | 60 | 120 分 | **$125** | 12 個月 |
| [Claude Certified Architect – Professional](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification) | CCAR-P | 63 | 120 分 | **$175** | 12 個月 |

四張的及格線都是 **720（量尺分數 100–1,000）**，題型都是單選加複選，線上監考或 Pearson 考場二選一，成績報告會附各 domain 的答對率。CCAR-F 另有一個特別的結構：**六個情境題庫抽四個**。

各證照頁也公開了 domain 權重，例如 CCAR-F 是 Agentic Architecture & Orchestration 27%、Claude Code Configuration & Workflows 20%、Prompt Engineering & Structured Output 20%、Tool Design & MCP Integration 18%、Context Management & Reliability 15%；CCDV-F 則以 Applications and Integration 33.1% 為最大宗。

重考規則在 [Pearson VUE 頁](https://www.pearsonvue.com/us/en/anthropic.html)：第一次沒過等 14 天、第二次 30 天、第三次 90 天，**同一張考試在任何 12 個月內最多 4 次**。

報考門檻則有官方依據。Pearson VUE 頁面（最後更新 2026-07-08）寫：

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

網路上聲稱個人可自由報名考試的說法，我找不到官方來源支持 —— **規劃時請當作需要透過 partner 組織**。

考試內容細節可參考站內的 [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)，

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

### 中級拿到的是分流證書，而且單科成績可以留

依[115 年度簡章](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0410_20260410115646.pdf)，中級不是一張通用證書：科目 1 + 科目 2 都達 70 分拿的是「AI 應用規劃師（**數據分析**）」，科目 1 + 科目 3 拿的是「AI 應用規劃師（**機器學習**）」。履歷上會看到括號，先想清楚要哪一個。

兩條省錢規則常被漏掉：

- **單科及格成績保留三年度**。115 年考過的單科，成績可留到 118/12/31，下次只補另一科即可。
- **舊證照可抵免**。原「機器學習工程師（初級）」科目 2 過的人可抵免中級科目 3；原「巨量資料分析師（中級）」科目 1 過的人可抵免中級科目 2 或科目 3（擇一）。也就是只要再考科目 1「人工智慧技術應用與規劃」達 70 分就能獲證。**抵免資格只保留到 116 年底**。

### 初級：永久有效，適合先卡一張

初級考「人工智慧基礎概論」與「生成式 AI 應用與規劃」兩科，各 75 分鐘、每科 70 分及格，115 年度考四場（3/21、5/16、8/15、11/7），場次比中級多三倍。**初級證書永久有效、不需換發**，跟中級的 5 年效期是不同規則 —— 前面那張效期表兩級都有列，別記混了。

想更快拿到本地紙本的話，還有兩個非 iPAS 的選項：財團法人電腦技能基金會的 **TQC 人工智慧應用與技術**（實用級 AI1 / 進階級 AI2 / 專業級 AI3，各 **1,000 元**、50 題純學科），以及 **TQC+ 人工智慧：機器學習 Python 3**（PML3，**1,800 元**、60 分鐘、純上機操作題）。PML3 是這批本地證照裡唯一考實作的，但認受度遠不如 iPAS 的經濟部發證。

## 治理、稽核、資安：另一條完全不同的線

前面全部是「你會不會做」，這一節是「你能不能簽字負責」。導入 AI 的公司開始要有人管風險，這條線的證照跟工程師證照幾乎不重疊，門檻長相也不同 —— 兩張要先有其他證照才能考。

| 證照 | 費用 | 規格與門檻 |
|---|---|---|
| [IAPP AIGP](https://store.iapp.org/aigp-exam/)（AI Governance Professional） | 會員 $649 / 非會員 **$799** | 100 題 / 2.75 小時，證期 **2 年**，每期需 20 學分繼續教育；非會員續證另收 $250 |
| [ISACA AAISM](https://www.isaca.org/credentialing/aaism)（Advanced in AI Security Management） | 會員 $459 / 非會員 $599，另加 $50 申請費 | **必須先持有 CISM 或 CISSP**；每年需 10 小時 AI 領域 CPE |
| [ISACA AAIA](https://www.isaca.org/credentialing/aaia)（Advanced in AI Audit） | 同上 | **必須先持有 CISA**，或 CIA / 美國 CPA / ACCA 等合格會計稽核資格 |
| [CertNexus CAIP](https://certnexus.com/certified-artificial-intelligence-practitioner-caip/)（AIP-210） | 官方頁未列價 | 80 題 / 120 分鐘，效期 3 年，可用 60 小時繼續教育續期 |

**CAIP 的特別之處不在內容，在認可制度。** 它通過 **ISO/IEC 17024 人員認證標準**的 ANAB 認可，是這整篇裡唯一一張 —— 廠商證照的效力來自廠商本身，CAIP 的效力來自第三方稽核過它的出題與評分流程。投標、稽核、法遵場合看重的是後者。內容則是廠商中立的 ML 全流程（問題定義 26%、特徵工程 20%、訓練調校 24%、上線維運 30%）。

ISACA 那兩張的門檻要看清楚：**它們是加掛在既有證照上的進階資格，不是入門磚**。沒有 CISM / CISSP / CISA 就不能考，先修那張本身就是幾年的工作年資加一次考試。反過來說，已經持有的人加考一張的邊際成本很低，而且 CPE 可以互相計入。

AIGP 則是這幾張裡最偏法規與政策的一張，考的是 AI 系統的負責任開發、部署與治理框架，適合法務、風控、PM 兼治理的角色，不適合拿來證明工程能力。

## 三個常被誤列的，但錯的地方各不相同

搜尋排名前段的推薦文很多是 2025 年寫好之後只改了標題年份。除了推已經換掉的舊代碼，這三個常出現在清單上的東西也不該被當成「你可以去考的 AI 證照」—— 但它們錯的地方完全不同：一個不存在，一個不是發給個人的，一個存在且現在就能拿、只是它不是認證。

**「Google Cloud GenAI Engineer」從來不存在。** 這是被憑空創造出來的名字，三種方式交叉驗證：直接請求 `cloud.google.com/learn/certification/generative-ai-engineer`，頁面內容是「404. Page Not Found — The requested URL was not found on this server」（HTTP 狀態碼實際回 200，是軟性 404，所以「連結沒壞」不能當成這張證照存在的證據）；官方認證總覽頁的 AI 項目只有 Generative AI Leader 與 Professional ML Engineer；Professional 級 9 張裡沒有任何 GenAI 或 Agent 工程師認證。

**OpenAI 與 Anthropic 的免費課程證書不是認證。** 兩家官方都把界線寫死：[OpenAI Academy 說明頁](https://help.openai.com/en/articles/20001270-openai-academy-courses)寫課程完成證書「are not OpenAI Certifications, do not represent a formal OpenAI credential」；[Claude Academy FAQ](https://academy.claude.com/help/faq) 對「這跟認證是不是同一件事」的回答是「No — they're two different things」。這些課程本身值得上，但它們證明的是你上完課，不是通過鑑定，**不該被寫進要求「AI / ML 專業認證」的欄位**。OpenAI 那套真正的監考認證則仍在雇主 pilot 階段，沒有公開報名、價格與日期。

**CNCF「Certified Kubernetes AI Conformance」是真的認證，但不是發給人的。** 它是[發給平台與廠商的相容性認證](https://www.cncf.io/announcements/2025/11/11/cncf-launches-certified-kubernetes-ai-conformance-program-to-standardize-ai-workloads-on-kubernetes/)，證明某個 Kubernetes 發行版能可靠跑 AI 工作負載，由廠商提交自評清單取得。CNCF 給個人的證照清單（CKA、CKAD、CKS、KCNA、CNPA、CNPE 等）裡**目前沒有任何 AI 專屬證照**。被寫進「AI 證照推薦」是分類錯誤。

## 報名前的三個提醒

**教材的新鮮度比證照本身重要。** PMLE 是最好的例子：名字沒變、價格沒變、官網長得一樣，但拿舊教材去考會直接撞牆。報名前花十分鐘打開官方 exam guide 對一遍服務名稱，ROI 遠高於多刷一百題。

**找不到不等於不存在。** 這篇初版寫「Anthropic 沒有公開 Claude 認證的價格與效期」，那是錯的 —— 官方公開了，資料在 Pearson 頁往下兩層的 exam guide PDF 裡，四張的費用、題數、效期、domain 權重一應俱全。我當時只看了 Pearson 那一頁就下結論。查廠商規格時，官網首頁沒有不代表沒有，要往「認證頁 → exam guide / blueprint 下載」這條路徑點到底。

**同一個官方網域內，不同頁面的新鮮度可以差好幾個月。** 微軟 Q&A 上仍有回答說 AI-103 在 beta，但認證頁早已拿掉 `(beta)` 後綴、標記 `hidden: false`、更新於 `2026-07-23`。看官方來源也要看是哪一頁、什麼時候更新的。

順帶一提，常見的「PMLE 是就業市場提及頻率最高的 AI 證照」這類說法，**查不到可信的職缺統計來源支撐**。當參考，別當事實。

## 整體來說

**先對雲，再對證照。** 這些廠商的證照沒有通用的，選錯生態系的那張在履歷上幾乎不加分。唯一的例外是 CertNexus CAIP —— 它走 ISO/IEC 17024 認可、廠商中立，代價是不會證明你會用任何一家的平台。

**把效期算進總成本。** AWS 三年、Google 兩年、NVIDIA 與 Databricks 兩年。AWS 的 AI 三張只能靠考試續期，但有五折券、而且考高階會連帶續掉低階；Google 的 PMLE 目前也只能重考，但有續期五折碼，而且繼續教育續期已經開給另外四張證照、官方說之後會擴大。微軟的免費線上更新評量仍是這幾家裡最省的一個。

**證照的半衰期比想像中短。** 微軟整條 AI 認證線換代碼、PMLE 考綱換掉所有產品名、Claude 從一張擴成四張，全部發生在 2026 上半年。任何超過三個月的證照推薦文，預設它至少有一條已經失效 —— 包括這篇，報名前還是打開官方頁面對一次。

**iPAS 中級仍然划算**，兩科 1,000 元、國家級認證、對本地職場與政府標案有加分 —— 但要把 5 年換證的維護成本算進去。

**治理那條線的門檻在別的地方。** AIGP、AAISM、AAIA 不是「更難的 AI 證照」，是要求你先有法遵或資安身分的加掛資格。沒有 CISM / CISSP / CISA 的人考不了 ISACA 那兩張，這跟考不考得過無關。

## 更新紀錄

- 2026-08-18：大幅擴充收錄範圍。NVIDIA 從單張補成官方目錄十二張（含 Agentic AI NCP-AAI 與多模態 NCA-GENM），並修正原文「只有微軟有 agent 專家級認證」的說法；新增「其他生態系」一節（Snowflake GES-C02、Oracle 新開的 Agentic AI track、IBM watsonx C1000-185、Salesforce Agentforce Specialist AI-201）與 GitHub Copilot GH-300；新增「治理、稽核、資安」一節（IAPP AIGP、ISACA AAISM / AAIA、CertNexus CAIP）；iPAS 補上初級規格、中級的分流證書與單科保留／舊證抵免規則，以及 TQC / TQC+ 兩張本地證照；另補上 AI-500 必須先取得 AI-103 的硬性先修條件（官方 Certification prerequisites 逐字）、其 beta 與英文限定狀態；補上 MLA-C01 的改版公告（英文版最後考試日 2026/9/28、C02 於 9/1 開放報名但考綱未公布）與各張的考試語言（AIF-C01 是唯一有繁中的）；修正 AWS 續期段落：原文寫「只能重考、不接受繼續教育學分」，官方 recertification 頁實際上有 renew／maintain 兩條路（maintain 僅開放給 SAA、Developer、CloudOps、SAP、DOP），且 AI 三張可用高階考試互相續期、續期一律可用五折券。並新增「常被誤列的三個」一節：Google Cloud GenAI Engineer（不存在）、OpenAI（課程證書免費全球開放但不是認證，正式認證仍在雇主 pilot）、CNCF Kubernetes AI Conformance（發給平台不是個人）—— 三者錯的地方不同，不併成同一個理由。依「只收 AI / ML 專業認證」的判準，OpenAI Academy 與 Claude Academy 的免費課程完成證書不列為證照，只在誤列一節保留一句提醒與官方出處。另修正 Claude 段落的重大錯誤：原文寫「官方未公開價格與效期」，實際上四張的 exam guide PDF 都公開了費用（$99 / $125 / $125 / $175）、題數、12 個月效期與 domain 權重，一併補上重考規則；「廠商不公開的資訊不要當已知」那條提醒改寫為「找不到不等於不存在」。同時把已退場證照從文章移除，現在列出的每一張都還能報名。另外重驗了三條原有事實：Google 認證總覽頁（Foundational 2 張、Associate 3 張、Professional 9 張）確認 AI 只有 Generative AI Leader 與 PMLE 兩張，原結論成立；修正 `generative-ai-engineer` 那條證據——該網址是軟性 404（頁面寫 404，HTTP 狀態碼回 200），原文寫「回 HTTP 404」不準確；補上 Google 續期規則的兩個變動：初次認證附續期五折碼，繼續教育續期目前只開放 CDL / ACE / PCA / PDE，PMLE 仍只能重考。

## 參考資料

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AWS Recertification 政策（三年效期）](https://aws.amazon.com/certification/policies/recertification/)

**Google Cloud**

- [Professional ML Engineer 官方考試指南](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer 認證頁](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader 認證頁](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud 認證總覽（含 Get Certified 計畫）](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions（效期與重新認證條款）](https://cloud.google.com/certification/terms)
- [Google Cloud Certification Renewal（續期方式、五折碼、繼續教育適用範圍）](https://support.google.com/cloud-certification/answer/9907853)
- [Welcome to Google Cloud Next '26（Gemini Enterprise Agent Platform 發表）](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR 計畫與 AI 學習路徑](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Apps and Agents Developer Associate（AI-103）](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [Multi-Agent AI Solutions Expert（AI-500，beta）](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Agentic AI Business Solutions Architect（AB-100）](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA 認證總覽（十二張證照與價格）](https://www.nvidia.com/en-us/learn/certification/)
- [NVIDIA NCA-GENL 官方頁面](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA NCP-AAI（Agentic AI Professional）](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NVIDIA NCA-GENM（Generative AI Multimodal Associate）](https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Anthropic：Four role-based certifications（2026/7/23 公告）](https://claude.com/blog/four-role-based-claude-certifications)
- [Pearson VUE — Claude Certification Program（重考與間隔規則）](https://www.pearsonvue.com/us/en/anthropic.html)
- [Anthropic Partner Academy — 四張認證頁與 exam guide 下載](https://anthropic-partners.skilljar.com/page/partner-certifications)
- [Claude Academy FAQ（免費課程證書與監考認證的差別）](https://academy.claude.com/help/faq)

**其他生態系**

- [Snowflake SnowPro 認證總覽（含 GES-C02 與各級費用）](https://learn.snowflake.com/en/certifications/)
- [Oracle：OCI Certification Learning Paths and Exams 2026 Updates](https://blogs.oracle.com/oracleuniversity/oci-certification-learning-paths-and-exams-2026-updates-now-available)
- [IBM Certified watsonx Generative AI Engineer – Associate（C1000-185）](https://www.ibm.com/training/certification/ibm-certified-watsonx-generative-ai-engineer-associate-C9007000)
- [Salesforce Certified Agentforce Specialist（AI-201）](https://trailheadacademy.salesforce.com/certificate/exam-agentforce-specialist---AI-201)
- [GitHub Copilot 認證（GH-300）考試細節](https://learn.github.com/certification/COPILOT)
- [Exam GH-300 study guide（Microsoft Learn）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

**治理 / 稽核 / 資安**

- [IAPP AIGP 考試頁（價格與續證規則）](https://store.iapp.org/aigp-exam/)
- [ISACA AAISM 認證頁](https://www.isaca.org/credentialing/aaism)
- [ISACA AAIA 認證頁](https://www.isaca.org/credentialing/aaia)
- [CertNexus CAIP（AIP-210）認證頁](https://certnexus.com/certified-artificial-intelligence-practitioner-caip/)
- [CAIP AIP-210 Exam Blueprint（domain 權重與續證規則）](https://certnexus.com/wp-content/uploads/2023/08/CertNexus-Certified-Artificial-Intelligence-Practitioner-Exam-AIP-210-blueprint.pdf)

**兩個常見誤列**

- [OpenAI Academy 課程說明（免費全球開放、完成證書不等於認證）](https://help.openai.com/en/articles/20001270-openai-academy-courses)
- [OpenAI：Launching our first OpenAI Certifications courses](https://openai.com/index/openai-certificate-courses/)
- [CNCF Launches Kubernetes AI Conformance Program（平台認證，非個人證照）](https://www.cncf.io/announcements/2025/11/11/cncf-launches-certified-kubernetes-ai-conformance-program-to-standardize-ai-workloads-on-kubernetes/)
- [CNCF 個人證照清單](https://www.cncf.io/training/certification/)

**iPAS 與台灣本地**

- [iPAS AI 應用規劃師考試資訊](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info)
- [115 年度 AI 應用規劃師能力鑑定簡章（初、中級）](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf)
- [AI 應用規劃師中級程式題型比重說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e)
- [iPAS 考試報名說明](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration)
- [115 年度 AI 應用規劃師能力鑑定簡章（0410 版，含分流證書與抵免規則）](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0410_20260410115646.pdf)
- [TQC 人工智慧應用與技術認證](https://www.tqc.org.tw/TQCNet/CertificateDetail.aspx?CODE=ijqo8mJkRJo%3D)
- [TQC+ 人工智慧：機器學習 Python 3（PML3）](https://www.tqcplus.org.tw/CertificateDetail.aspx?CODE=XgSlxg3TL8Q%3D)
- [104：非工程師也能考！2026 最新 AI 證照指南](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617)

**站內相關**

- [Claude Certified Architect Foundations 考試完整指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
- [2026 年該上哪些 AI 課程：從不懂 AI、vibe coding，到能上 production](/posts/ai/2026-07-10-ai-courses-2026-guide)
