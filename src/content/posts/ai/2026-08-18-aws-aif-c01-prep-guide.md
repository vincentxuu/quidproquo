---
title: "AWS AI Practitioner（AIF-C01）備考路徑：v1.1 把它變成 agentic AI 考試"
date: 2026-08-18
type: guide
category: ai
tags: [certification, aws, generative-ai, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 1
tldr: "AIF-C01 考綱在 2026 年 4 月 30 日更新到 v1.1，新增七條目標——MCP、多 agent 模式、context engineering、token 計價、幻覺偵測全變成考點，in-scope 服務加入 Bedrock AgentCore、Kiro、Strands Agents，網路上的整理幾乎都是舊版。這篇依 v1.1 五章權重逐章拆解考點，整合 AWS 官方四步準備法、10+ 位考生的實戰心得與教材推薦。$100、90 分鐘、65 題、及格 700、效期 3 年，本系列唯一提供繁體中文。"
description: "AWS Certified AI Practitioner（AIF-C01）備考指南，依官方 exam guide v1.1 逐章拆解考點，綜合 10+ 位考生的實戰經驗整理教材選擇、AI 輔考策略、考場踩坑與解題技巧，附 Skill Builder 資源一覽與續期規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
>
> 本文是從官方資料與考生實戰心得建出來的備考路徑，不是應考實錄。所有「考什麼」都指回[官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)，「怎麼準備」整合 AWS 官方訓練資源與多位考生分享。查證日期：2026-08-18，對照的是 exam guide **v1.1**。

AIF-C01 是 AWS 認證體系裡最便宜的一張 AI 證照（$100），也是**最容易被舊資料誤導的一張** —— 因為它在 2026 年 4 月 30 日換版到 v1.1，而網路上絕大多數整理文寫的還是舊版內容。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

**目標考生不是工程師。** 官方 exam guide 寫的建議經驗是：

> up to 6 months of exposure to AI/ML technologies on AWS. The target candidate uses but does not necessarily build AI/ML solutions on AWS.

以下**全部不考**：寫模型或演算法、資料工程與特徵工程、超參數調校、建 AI/ML pipeline 或基礎設施、對模型做數學或統計分析、實作資安與合規協定、開發治理框架。

**適合** —— 需要跟 AI 團隊溝通的 PM、業務、行銷、法遵；或是剛接觸 AWS AI 服務、想先建立完整詞彙表的工程師。**這張是唯一提供繁體中文的**，對不想在英文術語上多花力氣的人是實際優勢。多位台灣考生選繁體中文測驗，反映翻譯品質可接受，考試介面也可以隨時切回英文原文對照。

**不適合** —— 想用它證明工程能力的人。**AIF 考「說得出來」，MLA 考「做得出來」**，兩張分界乾淨。

**工程師仍該考慮它的理由**：考過 MLA-C01 或 AIP-C01 會自動把 AIF-C01 續三年，先拿 $100 這張不會變成長期維護負擔。如果你上過台大李宏毅老師的機器學習或生成式 AI 課程，依考生 changken 的說法：「ML 基礎通用、不需重學，只要多學 AWS 的 AI 服務（Bedrock、SageMaker 等），[應該可以輕鬆考取](https://changken.org/1688/aws-aif-c01-pass/)。」

### 前置知識

官方 exam guide 列出四項 recommended AWS knowledge，**不是先修門檻但會影響讀題速度**：

- 熟悉核心 AWS 服務（EC2、S3、Lambda、Bedrock、SageMaker AI）
- 理解 AWS shared responsibility model
- 會用 IAM 管理存取權限
- 知道 AWS 基本計價模式

以上都不熟 → 先跑完 [Cloud Practitioner Essentials](https://skillbuilder.aws/course/cloud-practitioner-essentials) 或 [Technical Essentials](https://skillbuilder.aws/course/aws-technical-essentials)（都免費）。日本考生也建議：「AWS 實務未經驗的場合は、AIF-C01 より先に Cloud Practitioner から取得する方が無難」（[Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d)）。

## 官方規格

| 項目 | 內容 |
|---|---|
| 費用 | $100 |
| 時間 | 90 分鐘（母語非英文者考英文版可申請 **ESL +30 分鐘**） |
| 題數 | 65 題，其中 **50 題計分、15 題不計分**（不會標示是哪些） |
| 題型 | 單選、複選、**ordering（排序）**、**matching（配對）** |
| 及格 | 量尺分數 **700**（範圍 100–1,000），補償計分、單章不設門檻 |
| 效期 | 3 年 |
| 語言 | 12 種，**含繁體中文**（義大利文與德文版 2026-10-15 後退場） |
| 先修 | 無 |

**題型要特別留意。** ordering 要你把 3–5 個步驟排成正確順序、matching 要把 3–7 組配對全對才給分 —— **這兩種題型部分答對不給分**，跟複選一樣是全有全無。很多整理文只寫「單選與複選」，多位考生反映配對題和排序題比預期花更多時間。日本考生特別提到一種「設問の中に複数の空欄があり、それぞれの空欄について用意された選択肢群から1つずつ選ぶマッチング形式」——這在 Udemy 模擬題裡沒出現過（[Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d)）。

**考試當天實用提醒**（綜合多位考生經驗）：

- **申請 ESL +30 分鐘**：即使選繁體中文考試也建議申請。台灣考生 KyleLu 表示「答完還剩 40 分鐘，有餘裕再檢查一遍答案」
- **雙證件**：需要有照片的雙證件，英文姓名要跟報名一致，帶護照最穩
- **成績不會馬上出**：不同於 Cloud Practitioner 當場出分，AIF-C01 要等 **6–8 小時**甚至隔天。changken 的時間線：9:30 考完 → 19:00 查到成績 → 19:22 收到 Credly 標章 → 隔天 04:26 收到祝賀 email。官方 SLA 寫 5 個工作天
- **考場溫度低**：多位考生提醒「體感溫度 18–20 度，帶薄外套」
- **台灣考場**：台北恆毅（捷運南京復興站）場次多、交通方便，是最多人推薦的考場；台南公園路也有場次
- **線上監考也可以**：Eason 選擇在家考，需要整潔環境、拔掉多餘螢幕。他[一小時就答完](https://easontechtalk.com/tw/aws-ai-practitioner-exam-in-24-hours/)
- **考場會發塑膠板和白板筆**：混淆矩陣（Confusion Matrix）是少數需要寫下來推理的地方

## 五章權重與逐章準備

| 章節 | 比重 |
|---|---|
| 1. Fundamentals of AI and ML | 20% |
| 2. Fundamentals of GenAI | 24% |
| 3. Applications of Foundation Models | **28%** |
| 4. Guidelines for Responsible AI | 14% |
| 5. Security, Compliance, and Governance for AI Solutions | 14% |

**第 2、3 章合計 52%** —— 一半以上的分數在 GenAI 與基礎模型應用。多位考生確認：準備時間有限的話，優先順序是 `GenAI → FM 應用 → Bedrock → Prompt → RAG → Responsible AI → Security`。

### 第 1 章：AI 與 ML 基礎（20%）

**官方考什麼**：AI／ML／深度學習／神經網路／CV／NLP／模型／演算法／訓練與推論／偏誤／公平性／擬合／LLM／GenAI／**agentic AI** 的定義與彼此差異；推論型態（批次、即時、**非同步、serverless**）；資料型態與學習方式；AI 適合與不適合的場景；**傳統 ML 與 FM 的取捨**；AWS 託管 AI 服務的能力（SageMaker AI、Transcribe、Translate、Comprehend、Lex、Polly）；AI/ML pipeline 各階段對應的服務（Bedrock、Amazon Q、Amazon Quick、**Kiro**、SageMaker AI）；MLOps 概念；模型指標（accuracy、**precision、recall**、F1）與商業指標（每使用者成本、開發成本、ROI）。

**怎麼準備**：純概念，每個名詞能用一句話解釋就夠。但 TechCerted 的考生警告：「這章的 ML 理論比 practitioner 這個字暗示的更深。」考題不會問你定義，而是問你**在特定場景下選哪個指標**——「假陰性代價遠高於假陽性，該優化哪個指標？」→ recall。「文字摘要模型要評估品質，該用哪個指標？」→ ROUGE。只背 F1 的定義會卡住。

**考生提醒**：題目常問「該用傳統 ML 還是 FM」，答案取決於法規、可解釋性、營運限制，不是技術先進度。另外，考試對 AWS 各服務的考法是**「情境 → 配對服務」**而不是「定義 → 填空」。rasee anwar 的心得：「我不再記每個服務『是什麼』，改成學每個服務『解決什麼問題』。考試測的就是這個。」

### 第 2 章：GenAI 基礎（24%）

**官方考什麼**：token、chunking、embedding、向量、prompt engineering、transformer、FM、多模態、擴散模型；GenAI 用例；**FM 生命週期**（資料選擇 → 模型選擇 → 預訓練 → 微調 → 評估 → 部署 → 回饋）；**token 計價與成本效能關係**；**context engineering**；**agentic AI 概念與 MCP**；GenAI 的優勢與限制（幻覺、可解釋性、不確定性）；模型選擇因素（含**成本、延遲、模型複雜度**）；AWS GenAI 服務（Bedrock、SageMaker AI、JumpStart、Amazon Quick、Kiro、**Strands Agents**、**Bedrock AgentCore**）。

**怎麼準備**：v1.1 新內容有一半集中在這章。MCP 與多 agent（2.1.6）建議實際看一次 MCP 的運作，站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)有實務脈絡。token 計價要能算：換模型或壓縮 prompt 之後成本差多少。

**考生提醒**：容易混淆的概念要**放在一起比較**，而不是各背各的。CCChen 的做法是把內容改寫成「判斷規則」：最新企業知識 → RAG、FM 快速整合 → Bedrock、自行訓練管理 ML 模型 → SageMaker、文字切分 → Tokenization、語意向量 → Embedding。這比背定義更貼近考題邏輯。

### 第 3 章：基礎模型的應用（28%，最重）

**官方考什麼**：FM 選擇準則（成本、模態、延遲、多語言、模型大小、複雜度、客製化、輸入輸出長度、**prompt caching**）；推論參數（temperature、長度）；**RAG 與 Bedrock Knowledge Bases**；向量儲存服務（OpenSearch Service、Aurora、Neptune、RDS for PostgreSQL）；客製化方式的成本取捨（預訓練、微調、in-context learning、RAG、**模型蒸餾**）；AI agent 的角色與商業應用；prompt 技巧（chain-of-thought、zero/single/few-shot、模板）與風險（曝露、poisoning、hijacking、jailbreaking）；**Bedrock Prompt Management 做版本管理**；訓練與微調方法（instruction tuning、domain adaptation、transfer learning、持續預訓練、**RLHF**）；FM 評估（**human-in-the-loop**、benchmark、Bedrock Model Evaluation、ROUGE／BLEU／BERTScore／**LLM-as-a-judge**）、**評估用 FM 建的應用（RAG、agent、workflow）**、**業務對齊指標**。

**怎麼準備**：四種客製化方式的**成本與適用情境排序**是高頻考點。評估指標建議搭配站內的 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)，弄清楚 ROUGE、BLEU、BERTScore、LLM-as-a-judge 各自量什麼。

**考生共識：這是最容易低估的一章。** TechCerted 的考生指出：「如果你把 AIF-C01 當成術語測驗走進考場，Domain 3 會懲罰這個假設。」題目給商業情境問「該用 RAG、fine-tuning 還是 continued pre-training」，要能依成本、資料新鮮度、客製化程度判斷。KodeKloud 的指南也強調：「考試幾乎總是偏好 Bedrock（快速整合、不需自己管模型），除非題目明確要求自訓模型才選 SageMaker。」另外，Bedrock Guardrails 的 ApplyGuardrail API 可以對**任何**模型端點呼叫，不限 Bedrock 模型——多數教材漏講這點。

### 第 4 章：負責任 AI（14%）

**官方考什麼**：負責任 AI 的面向（偏誤、公平性、包容性、穩健性、安全、真實性）；**Bedrock Guardrails**；模型選擇的環境與永續考量；GenAI 的法律風險（IP 侵權、偏誤輸出、信任流失、幻覺）；資料集特性；偏誤與變異的影響（過擬合、欠擬合）；偵測工具（標註品質分析、人工稽核、子群分析）；透明與可解釋（SageMaker Model Cards、**SageMaker Clarify**、Bedrock Model Evaluations）；可解釋性與效能的取捨；**以人為本的設計（使用者回饋機制、AI 決策透明度）**。

**怎麼準備**：概念題為主，但要能區分「偏誤」「變異」「過擬合」「欠擬合」四個詞 —— 這是最常被混用的一組。

**考生提醒**：Fairness、Transparency、Explainability、Safety 四個原則各有明確適用情境，考試會畫非常精確的分界線。rasee anwar：「它們聽起來相關，但考試會分得很細。仔細讀情境，配對到正確的原則。」另外，KodeKloud 總結：偏誤偵測問題的答案幾乎總是 **SageMaker Clarify**，有害內容過濾幾乎總是 **Bedrock Guardrails**。

### 第 5 章：安全、合規與治理（14%）

**官方考什麼**：IAM 角色與政策、加密、Macie、PrivateLink、責任共擔模型、**Bedrock AgentCore Identity 與 Policy in AgentCore**、**Bedrock Guardrails**；資料來源與血緣（data lineage、cataloging、Model Cards）；安全資料工程；安全與隱私考量（應用安全、威脅偵測、漏洞管理、**prompt injection**、傳輸與靜態加密、**資料外洩防護、輸出過濾與驗證、AI 互動的稽核軌跡與日誌、毒性內容**）；**幻覺偵測與 grounding**；治理與合規（AWS Config、Inspector、Artifact、CloudTrail、Trusted Advisor、資料生命週期與駐留、**Generative AI Security Scoping Matrix**）。

**怎麼準備**：與第 4 章合計 28%，多數人準備最少。**Generative AI Security Scoping Matrix** 是 AWS 自己的框架，官方點名進考綱，值得專門讀一次。Bharat Singh 提到他在 Udemy 課程中花了兩小時在 AWS Security Systems、兩小時在 Bedrock，相較之下 prompt engineering 只有 25 分鐘——安全與 Bedrock 的投資報酬率最高。

## v1.1 改了什麼（這節決定你的教材能不能用）

[官方 revisions 頁](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)列出改版歷史：v1.0 是 2026 年 3 月 26 日，**v1.1 是 4 月 30 日**。同頁註明「Exam guide updates will be published approximately one month before updates will be reflected on your exam」—— 也就是大約五月底起，考題就照 v1.1 出。

**新增七條目標**，全部是 2024 年那版沒有的：

| 目標 | 內容 |
|---|---|
| 1.2.6 | 什麼時候該用傳統 ML、什麼時候該用基礎模型（法規、可解釋性、營運限制） |
| 2.1.4 | **token 計價模型**及其對成本與推論效能的影響 |
| 2.1.5 | **context engineering** 在 FM 應用中的角色 |
| 2.1.6 | **agentic AI 基礎概念**：多 agent 系統模式、**MCP** 及其連接外部系統的角色、多 agent 溝通模式、記憶管理、工具使用、工作流編排 |
| 3.2.5 | 用 **Bedrock Prompt Management** 做 prompt 版本管理 |
| 3.4.5 | 業務目標對齊指標（任務完成率、使用者滿意度、每次互動成本） |
| 5.1.5 | **幻覺偵測與 grounding**（RAG grounding、輸出驗證、信心分數） |

**服務清單也動了。** 新增進 in-scope：Amazon Aurora、**Bedrock AgentCore**、**Kiro**、**Strands Agents**、Amazon Q、SageMaker JumpStart、AWS Transform；移除：Amazon MemoryDB。目標 2.3.1 原本點名 Bedrock PartyRock 與 Bedrock Data Automation，**v1.1 把這兩個換掉了**。

還有一個容易吃虧的細節：目標 1.3.6 的模型指標，v1.0 列的是 **AUC**，v1.1 換成 **precision 與 recall**。市面上的單字卡還在背 AUC。

**判斷教材是否過期的最快方法**：翻目錄找 MCP、AgentCore、Kiro、Strands Agents、context engineering。一個都沒有，就是 v1.1 之前的東西。TechCerted 的考生也確認：「prep courses last updated before mid-2026 have gaps across all of these」。

## 準備方式

AWS 官方認證頁建議四步：了解考試 → 補強知識 → 複習練習 → 評估準備度。以下按這個框架整理，並在每一步嵌入考生驗證過的具體做法。

### 需要多少時間？

| 考生背景 | 準備時間 | 分數 | 來源 |
|---|---|---|---|
| AWS 實務 5 年、有 SAA | 一個週末（10–15 小時） | 734 | [Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d) |
| 雲端工程師、一年 Bedrock 經驗 | 2 週 | 未公開 | [TechCerted](https://www.techcerted.com/learn/aws-ai-practitioner-field-report-2026) |
| 雲端 + ML 實務經驗 | 24 小時密集 | 通過 | [Eason Tech Talk](https://easontechtalk.com/tw/aws-ai-practitioner-exam-in-24-hours/) |
| 有刷題習慣、用免費 voucher | 約 2 週 | 828 | [changken](https://changken.org/1688/aws-aif-c01-pass/) |
| 非技術背景、有 AI 陪跑計畫 | 約 3–4 週 | 未公開 | [KyleLu](https://kylelu.com/aws-aif-preparation/) |
| AWS Community Builder | 每天 1 小時、共 4 週 | 未公開 | [rasee anwar](https://medium.com/@raseanwar/how-i-passed-the-aws-ai-practitioner-exam-aif-c01-tips-from-someone-who-just-did-it-4e20cf3bdd69) |
| 解決方案架構師、四層學習法 | 6 週 | **1000（滿分）** | [DEV Community](https://dev.to/dale-rose/i-scored-10001000-on-aws-certified-ai-practitioner-aif-c01-heres-every-resource-i-used-4alf) |
| 軟體開發 + AI 學習者 | 8 週 | 通過 | [Bharat Singh](https://bharat-singh-06.medium.com/how-to-pass-aws-certified-ai-practitioner-in-2026-using-ai-for-smarter-preparation-6f22723704bf) |
| AI 學習者、用 AI 工具輔考 | 4 天密集衝刺 | 721（險過） | [CCChen](https://vocus.cc/article/6a991abefd897800011bfecd) |

有 AWS 基礎 → 一到兩週；零基礎 → 三到四週。721 分險過說明四天衝刺可行但風險高；滿分考生花六週用四層系統準備。重考政策是沒過等 14 天、次數無上限（每次 $100）——失敗成本可控。

### 第一步：了解考試

- 讀完[官方 exam guide v1.1 全文](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)，確認手上的教材不是舊版
- 做 **Official Practice Question Set**（免費，20 題，AWS 官方出題）。GitHub 考生 vicsz 表示「官方練習題難度跟真實考試差不多，甚至稍難一點」
- 可選做 **Official Pretest** 找出弱項（需 [Skill Builder 付費訂閱](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)，$29/月起）
- Eason 的反向學習法：不先讀教材，直接做練習題找出不會的地方，再針對性補知識。他認為「這比從第一頁讀到最後一頁有效」

### 第二步：補強知識

**免費資源**：

- [AI Practitioner Learning Plan](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)（免費，約 8 小時）—— 官方課程，一定要看
- [ExamPro Andrew Brown（FreeCodeCamp YouTube）](https://www.youtube.com/results?search_query=freecodecamp+aws+aif-c01) —— 15 小時完整免費影片，滿分考生的第一層學習
- [vicsz/aif-c01-study-notes（GitHub）](https://github.com/vicsz/aif-c01-study-notes) —— 開源筆記，211 stars，按 Domain 整理
- [KodeKloud AIF-C01 Study Guide](https://kodekloud.com/blog/the-complete-aws-certified-ai-practitioner-aif-c01-study-guide/) —— 按 Domain 拆解的免費學習指南

**付費但高回報**：

- [Stephane Maarek AIF-C01（Udemy）](https://www.udemy.com/course/aws-ai-practitioner-certified/) —— **最多考生推薦的主課程**，從註冊 AWS 帳號開始教，帶你實際操作 Bedrock 和 SageMaker。KyleLu：「花不到台幣 50 元就可以玩到業界熱門的雲服務。」多位考生反映他的模擬題比真實考試難，當正向壓力用。省錢技巧：開 Udemy 月訂閱（$35/月）而不是單買課程（$95），一個月內讀完就退訂
- **Jayendra Patil Learning Path** —— 滿分考生推薦的免費筆記，覆蓋多數教材忽略的技術細節
- **Exam Prep Plan**（Skill Builder 上 19 個項目、22 小時 50 分）—— AWS 推薦的備考全路徑

**動手玩**：在 AWS Free Tier 開 Amazon Bedrock 跑幾次 prompt、看 SageMaker JumpStart 的模型清單。不需要建模型，但**碰過介面比純背服務名稱有效**。滿分考生特別強調：「即使只花一小時在 PartyRock 或 AWS Workshop，碰過介面後場景題明顯變簡單。」Skill Builder 上的 **Builder Labs、Cloud Quest、Jam** 都有引導式實作。

**繁體中文資源**：[ExamLab 中文模擬試題](https://examlab.net/zh-tw/certs/aws/aif-c01)（計時模擬考模式）、[AWS 陪跑計畫](https://kylelu.com/aws-aif-preparation/)（線上直播課 + 工作坊）、[AWS AI 人才就緒計畫](https://ithelp.ithome.com.tw/articles/10394512)（通過測驗有證書，還能拿半價 voucher）。

### 第三步：複習與練習

重點放 **Domain 2 + 3**（合計 52%），練習方向：

- 多練**「商業場景 → 該用什麼技術/服務」**的判斷題 —— 這是 AIF-C01 最核心的題型模式，跨五章都會出
- 四種 FM 客製化方式（預訓練／微調／in-context learning／RAG）的**成本與適用情境**要能排序
- 用 **SimuLearn**（模擬客戶對話 + 動手建方案）、**Escape Room**、**flashcards** 做複習
- Domain 4 + 5 容易被忽略但合計也有 28%，不要完全跳過

**模擬題推薦**：[Tutorials Dojo](https://portal.tutorialsdojo.com/courses/aws-certified-ai-practitioner-aif-c01-practice-exams/)（被評為跟實際考題風格最接近）、Stephane Maarek Udemy 模擬題（比真實考試難）。changken 的策略是「能夠刷題就往死裡刷」——他去 YouTube 找標注 AIF-C01 的模擬考來補。

**長題幹的閱讀技巧**：多位考生回報題目很長但真正的問題在最後兩句。wAlobdulla 的建議：「從倒數第二句開始讀，確認問的是什麼，再回頭看情境——你會發現最後兩句通常就有足夠的資訊作答。」

### 第四步：評估準備度

- 做 **Official Practice Exam**（付費訂閱，模擬真實考試體驗，最接近實際難度）
- 滿分考生的門檻：「穩定 85% 以上才報名考試」。他的原則：「複習錯題比看分數更重要——每一題答錯都是學習機會，連猜對的題也要看解釋」
- rasee anwar 的錯題習慣：每答錯一題，不只記答案，要問自己「為什麼我選了錯的那個？」這個單一習慣比讀任何 study guide 都更快提升分數

### AI 輔考策略（2026 年考生的新趨勢）

多位考生分享了用 AI 工具加速備考的方法：

- **ChatGPT / Claude 生成模擬題**：直接下 prompt「給我十道 AIF-C01 模擬題」，比翻課本更快找到盲點。Bharat Singh 的 prompt 範例：`"Explain AWS Textract vs Polly with examples"` / `"Give me scenario-based AIF-C01 questions around Bedrock"` / `"AWS Audit Manager vs Artifacts vs Trusted Advisor"`
- **NotebookLM 整理講義**：把官方 Student Guide（200+ 頁 PDF）丟進去，自動生成重點摘要、語音複習、測驗題。即使是截圖 PDF 也能 OCR 辨識
- **HeptaBase 心智圖**：搭配卡片盒筆記法，考前通勤時用手機複習。KyleLu：「考前一小時看心智圖比重翻課程有效」
- **知識蒸餾法**（CCChen）：把完整教材壓成 A4 → 壓成知識卡 → 壓成一條知識鏈：`AI/ML → GenAI → FM → Bedrock → Prompt → RAG → Responsible AI → Security`。他的解題鏈：`需求 → AI 類型 → AWS 服務 → 限制條件 → 成本/維運 → Security/Governance`
- 日本考生用 **Claude** 輔考，把不會的問題整理成[按 Domain 分類的 cheatsheet](https://zenn.dev/ryno33/articles/7151754dbc769d)

### Skill Builder 練習資源一覽

以下資源都在 [AWS Skill Builder](https://skillbuilder.aws) 上，免費帳號可用部分內容，完整存取需付費訂閱（$29/月或 $449/年）。

| 資源 | 是什麼 | 適合階段 |
|---|---|---|
| **Official Practice Question Set** | AWS 官方出的 20 題免費練習，題型與風格跟真實考試一致 | 第一步：熟悉題型 |
| **Official Pretest** | 診斷測驗，幫你找出哪些章節需要加強（付費） | 第一步：定位弱項 |
| **Exam Prep Plan** | 19 個項目、22 小時 50 分的完整備考路徑，AWS 自己推薦的主線 | 第二步：系統學習 |
| **Builder Labs** | 200+ 個引導式實作，在安全的 AWS Console 沙箱中跟著步驟操作，內建 AI 助手可即時問問題（付費） | 第二步：動手熟悉服務 |
| **Cloud Quest** | 3D 城市情境，扮演特定雲端角色解決商業挑戰，完成後拿數位徽章（部分免費） | 第二步：情境式學習 |
| **Jam** | 開放式挑戰，沒有步驟指引，直接在 AWS Console 排錯和解題，有計分和排行榜（付費） | 第三步：測試實戰能力 |
| **SimuLearn** | 先跟 AI 模擬客戶對話蒐集需求，再到 AWS 環境動手建方案，練的是「聽懂問題 → 選對服務」的判斷力（付費） | 第三步：場景判斷練習 |
| **Escape Room** | 限時解謎式練習，團隊或個人皆可（付費） | 第三步：複習衝刺 |
| **Flashcards** | 各 Domain 的重點術語卡片，快速複習用 | 第三步：零碎時間複習 |
| **Official Practice Exam** | 模擬完整考試體驗，題數、時間、難度最接近真實考試（付費） | 第四步：最終評估 |

## 續期與重考

**效期 3 年，三條續期路徑**（依[官方 recertification 頁](https://aws.amazon.com/certification/recertification/)）：重考 AIF-C01、考過 MLA-C01、或考過 AIP-C01，任一種 +3 年，都能用 AWS Certification Account 的**五折券**。

AIF-C01 **沒有「上課換效期」這條路**（maintain 機制只開放給 SAA、Developer 等），且**考過後兩年內不能重考同一張**。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 考綱版本 | v1.1（2026-04-30 發布） | revisions 頁每次更新 |
| 五章權重 | 20 / 24 / 28 / 14 / 14 | 每次改版 |
| in-scope 服務 | 新增 AgentCore、Kiro、Strands Agents、Aurora、Amazon Q、JumpStart、AWS Transform | 每次改版 |
| 費用與題數 | $100、65 題（50 計分）、90 分鐘 | 每季 |
| 續期路徑 | 三條，皆可用五折券 | 每半年 |
| 語言 | 12 種含繁體中文（義大利文、德文 2026-10-15 後退場） | 每半年 |

## 更新紀錄

- 2026-09-10：全面改版——重整為官方四步準備法，綜合 10+ 位考生實戰心得融入各章節（教材推薦、AI 輔考策略、滿分考生四層學習法、解題技巧、考場踩坑），新增 Skill Builder 練習資源一覽表、前置知識建議與語言退場資訊

## 參考資料

- [AWS Certified AI Practitioner 官方認證頁](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 官方 exam guide（HTML）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide 改版紀錄（v1.0 → v1.1 逐條對照）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS Skill Builder — AIF-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)
- [AWS Recertification（續期路徑與五折券）](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing（重考政策）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification — Before Testing（ESL +30 分鐘與報考規則）](https://aws.amazon.com/certification/policies/before-testing/)
- [AWS Cloud Practitioner Essentials（免費基礎課程）](https://skillbuilder.aws/course/cloud-practitioner-essentials)

**考生心得與第三方教材**

- [I Passed AIF-C01 in 2 Weeks — TechCerted](https://www.techcerted.com/learn/aws-ai-practitioner-field-report-2026) — v1.1 改版後的詳細考場報告
- [I Scored 1000/1000 — DEV Community](https://dev.to/dale-rose/i-scored-10001000-on-aws-certified-ai-practitioner-aif-c01-heres-every-resource-i-used-4alf) — 滿分考生的四層學習法與完整免費/付費資源清單
- [24 小時通過 — Eason Tech Talk](https://easontechtalk.com/tw/aws-ai-practitioner-exam-in-24-hours/) — 反向學習法（先刷題再補知識）
- [4 天挑戰 — CCChen 學習日誌](https://vocus.cc/article/6a991abefd897800011bfecd) — AI 知識蒸餾法與考前壓縮策略
- [KyleLu 考試準備心得](https://kylelu.com/aws-aif-preparation/) — 非技術背景考生的完整學習資源整理
- [changken 通過紀錄](https://changken.org/1688/aws-aif-c01-pass/) — 刷題戰術與考場時間線
- [日本考生合格體驗記 — Zenn](https://zenn.dev/ryno33/articles/7151754dbc769d) — Claude 輔考 + 按 Domain 整理 cheatsheet
- [How I Passed — rasee anwar](https://medium.com/@raseanwar/how-i-passed-the-aws-ai-practitioner-exam-aif-c01-tips-from-someone-who-just-did-it-4e20cf3bdd69) — 每天一小時四週通過的時間分配法
- [How I studied and passed — wAlobdulla](https://blog.newmathdata.com/how-i-studied-for-and-passed-the-aws-ai-practitioner-aif-c01-exam-b7abf471fa0f) — Udemy 省錢技巧與長題幹閱讀策略
- [8 Weeks Using AI — Bharat Singh](https://bharat-singh-06.medium.com/how-to-pass-aws-certified-ai-practitioner-in-2026-using-ai-for-smarter-preparation-6f22723704bf) — AI 輔考 prompt 範例
- [vicsz/aif-c01-study-notes（GitHub）](https://github.com/vicsz/aif-c01-study-notes) — 開源考試筆記，211 stars
- [ExamLab 中文模擬試題](https://examlab.net/zh-tw/certs/aws/aif-c01) — 繁體中文計時模擬考
- [Stephane Maarek AIF-C01 Udemy 課程](https://www.udemy.com/course/aws-ai-practitioner-certified/) — 最多考生推薦的主課程
- [ExamPro Andrew Brown FreeCodeCamp（YouTube）](https://www.youtube.com/results?search_query=freecodecamp+aws+aif-c01) — 完整免費影片課程
- [Tutorials Dojo AIF-C01 模擬題](https://portal.tutorialsdojo.com/courses/aws-certified-ai-practitioner-aif-c01-practice-exams/) — 被評為最接近真實考題風格
- [KodeKloud AIF-C01 Study Guide](https://kodekloud.com/blog/the-complete-aws-certified-ai-practitioner-aif-c01-study-guide/) — 按 Domain 拆解的免費學習指南

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [Claude Certified Architect Foundations 備考指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
