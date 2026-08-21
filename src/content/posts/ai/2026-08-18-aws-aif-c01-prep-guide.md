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
tldr: "AIF-C01 的考綱在 2026 年 4 月 30 日更新到 v1.1，一口氣新增七條目標，把 MCP、多 agent 模式、context engineering、token 計價、幻覺偵測全部變成考點，in-scope 服務也加入 Bedrock AgentCore、Kiro、Strands Agents——網路上流傳的整理幾乎都是舊版。這篇以官方五章權重（20/24/28/14/14）為骨架給出四週路徑。官方規格：$100、90 分鐘、65 題（50 題計分）、及格 700、效期 3 年，而且是本系列唯一提供繁體中文的考試。"
description: "AWS Certified AI Practitioner（AIF-C01）備考指南，依官方 exam guide v1.1 的五章權重逐章拆解考點與準備材料，說明 v1.1 新增的七條目標與服務清單異動，附四週時程換算依據、重考與續期規則，以及這張證照適合誰、不適合誰。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)，所有「怎麼準備」都指回 AWS 官方訓練資源，不含考古題。查證日期：2026-08-18，對照的是 exam guide **v1.1**。

AIF-C01 是 AWS 認證體系裡最便宜的一張 AI 證照（$100），也是**最容易被舊資料誤導的一張** —— 因為它在 2026 年 4 月 30 日換版到 v1.1，而網路上絕大多數整理文寫的還是舊版內容。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

**AWS 自己講得很直白 —— 目標考生不是工程師。** 官方 exam guide 寫的建議經驗是：

> up to 6 months of exposure to AI/ML technologies on AWS. The target candidate uses but does not necessarily build AI/ML solutions on AWS.

「使用但不一定要會建」。它的排除清單更清楚，以下**全部不考**：寫模型或演算法、資料工程與特徵工程、超參數調校、建 AI/ML pipeline 或基礎設施、對模型做數學或統計分析、實作資安與合規協定、開發治理框架。

所以：

**適合** —— 需要跟 AI 團隊溝通的 PM、業務、行銷、法遵；或是剛接觸 AWS AI 服務、想先建立完整詞彙表的工程師。**這張是唯一提供繁體中文的**，對不想在英文術語上多花力氣的人是實際優勢。

**不適合** —— 想用它證明工程能力的人。它排除的每一項幾乎都是 MLA-C01 的 in-scope 任務，兩張的分界非常乾淨：**AIF 考「說得出來」，MLA 考「做得出來」**。

**一個工程師仍該考慮它的理由**：它是 AWS AI 線續期圖的底層。考過 MLA-C01 或 AIP-C01 都會自動把 AIF-C01 續三年，所以先拿 $100 這張並不會變成長期維護負擔。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | $100 |
| 時間 | 90 分鐘（母語非英文者考英文版可申請 **ESL +30 分鐘**） |
| 題數 | 65 題，其中 **50 題計分、15 題不計分**（不會標示是哪些） |
| 題型 | 單選、複選、**ordering（排序）**、**matching（配對）** |
| 及格 | 量尺分數 **700**（範圍 100–1,000），補償計分、單章不設門檻 |
| 效期 | 3 年 |
| 語言 | 12 種，**含繁體中文** |
| 先修 | 無 |

**題型要特別留意。** ordering 要你把 3–5 個步驟排成正確順序、matching 要把 3–7 組配對全對才給分 —— **這兩種題型部分答對不給分**，跟複選一樣是全有全無。許多整理文只寫「單選與複選」，照那個預期進考場會被排序題吃掉時間。

順帶一提，同屬 AWS AI 線的 AIP-C01 只有單選與複選，沒有這兩種題型。

## 五章權重

| 章節 | 比重 |
|---|---|
| 1. Fundamentals of AI and ML | 20% |
| 2. Fundamentals of GenAI | 24% |
| 3. Applications of Foundation Models | **28%** |
| 4. Guidelines for Responsible AI | 14% |
| 5. Security, Compliance, and Governance for AI Solutions | 14% |

**第 2、3 章合計 52%** —— 一半以上的分數在 GenAI 與基礎模型應用，傳統 ML 概念只佔 20%。把準備重心放在 RAG、prompt engineering、FM 評估與客製化，比背機器學習演算法有效。

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

**判斷教材是否過期的最快方法**：翻目錄找 MCP、AgentCore、Kiro、Strands Agents、context engineering。一個都沒有，就是 v1.1 之前的東西。

## 逐章準備

### 第 1 章：AI 與 ML 基礎（20%）

**官方考什麼**：AI／ML／深度學習／神經網路／CV／NLP／模型／演算法／訓練與推論／偏誤／公平性／擬合／LLM／GenAI／**agentic AI** 的定義與彼此差異；推論型態（批次、即時、**非同步、serverless**）；資料型態與學習方式；AI 適合與不適合的場景；**傳統 ML 與 FM 的取捨**；AWS 託管 AI 服務的能力（SageMaker AI、Transcribe、Translate、Comprehend、Lex、Polly）；AI/ML pipeline 各階段對應的服務（Bedrock、Amazon Q、Amazon Quick、**Kiro**、SageMaker AI）；MLOps 概念；模型指標（accuracy、**precision、recall**、F1）與商業指標（每使用者成本、開發成本、ROI）。

**怎麼準備**：這章是純概念，把官方 guide 的名詞逐個能用一句話解釋就夠。**重點不是深度而是分界** —— 題目常問「這個情境該用 AI 嗎」「該用傳統 ML 還是 FM」，答案取決於法規、可解釋性、營運限制，不是取決於技術先進度。

### 第 2 章：GenAI 基礎（24%）

**官方考什麼**：token、chunking、embedding、向量、prompt engineering、transformer、FM、多模態、擴散模型；GenAI 用例；**FM 生命週期**（資料選擇 → 模型選擇 → 預訓練 → 微調 → 評估 → 部署 → 回饋）；**token 計價與成本效能關係**；**context engineering**；**agentic AI 概念與 MCP**；GenAI 的優勢與限制（幻覺、可解釋性、不確定性）；模型選擇因素（含**成本、延遲、模型複雜度**）；AWS GenAI 服務（Bedrock、SageMaker AI、JumpStart、Amazon Quick、Kiro、**Strands Agents**、**Bedrock AgentCore**）。

**怎麼準備**：v1.1 的新內容有一半集中在這章。MCP 與多 agent 那條（2.1.6）建議實際看一次 MCP 的運作 —— 站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)有實務脈絡。token 計價那條則要能算：同樣一個任務，換模型或壓縮 prompt 之後成本差多少。

### 第 3 章：基礎模型的應用（28%，最重）

**官方考什麼**：FM 選擇準則（成本、模態、延遲、多語言、模型大小、複雜度、客製化、輸入輸出長度、**prompt caching**）；推論參數（temperature、長度）；**RAG 與 Bedrock Knowledge Bases**；向量儲存服務（OpenSearch Service、Aurora、Neptune、RDS for PostgreSQL）；客製化方式的成本取捨（預訓練、微調、in-context learning、RAG、**模型蒸餾**）；AI agent 的角色與商業應用；prompt 技巧（chain-of-thought、zero/single/few-shot、模板）與風險（曝露、poisoning、hijacking、jailbreaking）；**Bedrock Prompt Management 做版本管理**；訓練與微調方法（instruction tuning、domain adaptation、transfer learning、持續預訓練、**RLHF**）；FM 評估（**human-in-the-loop**、benchmark、Bedrock Model Evaluation、ROUGE／BLEU／BERTScore／**LLM-as-a-judge**）、**評估用 FM 建的應用（RAG、agent、workflow）**、**業務對齊指標**。

**怎麼準備**：這是最重也最值得投資的一章。四種客製化方式（預訓練／微調／in-context learning／RAG）的**成本與適用情境**要能排序，這是本章的高頻考點。評估那段建議搭配站內的 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)，把 ROUGE、BLEU、BERTScore、LLM-as-a-judge 各自量什麼弄清楚。

### 第 4 章：負責任 AI（14%）

**官方考什麼**：負責任 AI 的面向（偏誤、公平性、包容性、穩健性、安全、真實性）；**Bedrock Guardrails**；模型選擇的環境與永續考量；GenAI 的法律風險（IP 侵權、偏誤輸出、信任流失、幻覺）；資料集特性；偏誤與變異的影響（過擬合、欠擬合）；偵測工具（標註品質分析、人工稽核、子群分析）；透明與可解釋（SageMaker Model Cards、**SageMaker Clarify**、Bedrock Model Evaluations）；可解釋性與效能的取捨；**以人為本的設計（使用者回饋機制、AI 決策透明度）**。

**怎麼準備**：概念題為主，但要能區分「偏誤」「變異」「過擬合」「欠擬合」四個詞 —— 這是最常被混用的一組。

### 第 5 章：安全、合規與治理（14%）

**官方考什麼**：IAM 角色與政策、加密、Macie、PrivateLink、責任共擔模型、**Bedrock AgentCore Identity 與 Policy in AgentCore**、**Bedrock Guardrails**；資料來源與血緣（data lineage、cataloging、Model Cards）；安全資料工程；安全與隱私考量（應用安全、威脅偵測、漏洞管理、**prompt injection**、傳輸與靜態加密、**資料外洩防護、輸出過濾與驗證、AI 互動的稽核軌跡與日誌、毒性內容**）；**幻覺偵測與 grounding**；治理與合規（AWS Config、Inspector、Artifact、CloudTrail、Trusted Advisor、資料生命週期與駐留、**Generative AI Security Scoping Matrix**）。

**怎麼準備**：這章與第 4 章合計 28%，跟第 3 章一樣重，但多數人準備得最少。**Generative AI Security Scoping Matrix** 是 AWS 自己的框架，官方點名進考綱，值得專門讀一次。

## 四週時程與換算依據

**換算方式**：這張是知識型考試，官方預設考生「使用但不建置」，沒有需要動手訓練或部署的章節，所以時程主要由**內容量**決定，而不是實作時間。以權重配比，第 3 章給最多，第 4、5 章合併處理。

以每週 5–8 小時、共四週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀官方 exam guide v1.1 全文 + 第 1 章（20%） | 先確認自己的既有認知是不是舊版 |
| 第 2 週 | 第 2 章（24%），重點放在 v1.1 新增的四條（token 計價、context engineering、agentic AI／MCP、FM 生命週期） | 新考點密度最高 |
| 第 3 週 | **第 3 章（28%）** | 最重的一章，單獨一週 |
| 第 4 週 | 第 4 + 5 章（合計 28%）+ 官方 practice question set + 全書複習 | 兩章都偏概念，可合併 |

**為什麼是四週而不是八週**：對照站內的 [PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)，那張是 professional 級、官方建議 3 年經驗、且第 3 到 5 章需要實際訓練與部署，所以八週。AIF-C01 官方預設的經驗值是「六個月接觸」，沒有實作章節，內容量大約是前者的一半。

**失敗成本低，時程可以積極一點。** AWS 的[重考政策](https://aws.amazon.com/certification/policies/after-testing/)是沒過等 14 天、**次數無上限**（每次全額付費）。這跟 Google 的「兩年 4 次、第三次沒過等一年」是完全不同的風險結構 —— 在 AWS 這邊，$100 的試錯成本是可以接受的。

**官方材料優先序**：[Exam Prep Plan（AIF-C01）](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)（19 個項目、22 小時 50 分，AWS 自己推薦的完整路徑）→ **Official Practice Question Set**（免費，20 題，官方寫「developed by AWS, demonstrate the style of our certification exams」）→ AI Practitioner Learning Plan（8 小時）。Official Pretest 與 Official Practice Exam 標示為 **Subscription**，需要付費訂閱，官方頁寫「The Individual subscription starts at $29 USD per month」。

## 考完之後：續期與重考

**效期 3 年，三條續期路徑**（依[官方 recertification 頁](https://aws.amazon.com/certification/recertification/)）：重考 AIF-C01、**或考過 MLA-C01**、**或考過 AIP-C01**，任一種都 +3 年，而且都能用 AWS Certification Account 裡的**五折券**。

**沒有「上課換效期」這條路。** AWS 有 maintain（+1 年，Skill Builder 付費訂閱）機制，但只開放給 SAA、Developer、CloudOps、SAP、DOP —— AIF-C01 的選項欄裡只有考試。

**考過之後兩年內不能重考同一張。** 所以想靠重考提前續期是行不通的，除非它改版換了代碼。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 考綱版本 | v1.1（2026-04-30 發布） | revisions 頁每次更新 |
| 五章權重 | 20 / 24 / 28 / 14 / 14 | 每次改版 |
| in-scope 服務 | 新增 AgentCore、Kiro、Strands Agents、Aurora、Amazon Q、JumpStart、AWS Transform | 每次改版 |
| 費用與題數 | $100、65 題（50 計分）、90 分鐘 | 每季 |
| 續期路徑 | 三條，皆可用五折券 | 每半年 |
| 語言 | 12 種含繁體中文 | 每半年 |

## 參考資料

- [AWS Certified AI Practitioner 官方認證頁](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIF-C01 官方 exam guide（HTML）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide 改版紀錄（v1.0 → v1.1 逐條對照）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS Skill Builder — AIF-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)
- [AWS Recertification（續期路徑與五折券）](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing（重考政策）](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification — Before Testing（ESL +30 分鐘與報考規則）](https://aws.amazon.com/certification/policies/before-testing/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [Claude Certified Architect Foundations 備考指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
