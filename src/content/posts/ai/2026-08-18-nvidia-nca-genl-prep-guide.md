---
title: "NVIDIA NCA-GENL 備考路徑：名字寫 LLM，考綱有一半是傳統 ML"
date: 2026-08-18
type: guide
category: ai
tags: [certification, nvidia, generative-ai, llm, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 9
tldr: "NCA-GENL 是職缺點名「NVIDIA Generative AI / LLM 相關認證」時最常指的那張。但官方 blueprint 的權重跟名字落差很大——Core Machine Learning and AI Knowledge 30%、Software Development 24%、Experimentation 22%、Data Analysis 14%、Trustworthy AI 10%，LLM 與 RAG 的內容散在條目層而不是自成一塊，spaCy、NumPy、Keras、cross validation 都在考。另一個要先知道的：NVIDIA 官方備考課程全部要付費（$30 到 $500），是本系列唯一沒有免費官方學習路徑的廠商。官方規格：$125、1 小時、50–60 題、效期兩年、僅英文、pass/fail 不給分數。"
description: "NVIDIA NCA-GENL（Generative AI LLMs Associate）備考指南，依官方 exam blueprint 的五塊權重逐項拆解，說明名稱與考綱的落差、DLI 課程的付費結構與取捨、三週時程換算依據，以及兩年效期只能重考的續期規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回 [NVIDIA 官方認證頁](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)與官方 Exam Study Guide，不含考古題。查證日期：2026-08-18。

如果你看到的職缺寫「NVIDIA Generative AI / LLM 相關認證」，多半指的就是這張 NCA-GENL —— 它是 NVIDIA 生成式 AI 線的入門級，$125、一小時。

但它有兩件事跟直覺不同，而且都會影響你怎麼準備。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 第一個落差：名字寫 LLM，考綱一半是傳統 ML

官方 Exam Study Guide 的權重表：

| 主題 | 比重 |
|---|---|
| **Core Machine Learning and AI Knowledge** | **30%** |
| Software Development | 24% |
| Experimentation | 22% |
| Data Analysis | 14% |
| Trustworthy AI | 10% |

**沒有任何一塊叫做「LLM」或「RAG」。** 生成式的內容散在條目層 —— 例如 Core ML 那 30% 底下才會看到「建 RAG、chatbot、summarizer 這類 LLM 用例」「為 RAG 整理與嵌入內容資料集」「選模型做文字嵌入」「用 prompt engineering 原則寫 prompt」。

同一塊裡並列的還有：**熟悉機器學習基礎（特徵工程、模型比較、交叉驗證）**、**熟悉 Python 的自然語言套件（spaCy、NumPy、向量資料庫）**、**用 Python 套件（spaCy、NumPy、Keras）實作傳統 ML 分析**。

也就是說：**抱著「我會用 Claude API，這張應該很快」的心態去考，會在傳統 ML 與資料分析那 36%（Data Analysis 14% + Experimentation 22%）上失血。** 這是本系列裡名稱與內容落差最大的一張。

## 第二個落差：官方備考材料全部要付費

其他廠商的官方學習路徑幾乎都免費 —— AWS Skill Builder 的 Exam Prep Plan、微軟的 Microsoft Learn 路徑、Google Skills、Anthropic Academy 都是。**NVIDIA 不是。**

官方在 blueprint 表格裡直接列出建議課程與價格，每一門都標價：

| 官方建議課程 | 自學版 | 講師課 |
|---|---|---|
| Getting Started With Deep Learning ／ Fundamentals of Deep Learning | 8 小時 **$90** | 8 小時 **$500** |
| Accelerating End-to-End Data Science Workflows ／ Fundamentals of Accelerated Data Science | 8 小時 **$90** | 8 小時 **$500** |
| Introduction to Transformer-Based NLP ／ Building Transformer-Based NLP Applications | 6 小時 **$30** | 8 小時 **$500** |
| Building LLM Applications with Prompt Engineering | 8 小時 **$90** | 8 小時 **$500** |
| Rapid Application Development With LLMs | 8 小時 **$90** | 8 小時 **$500** |

自學版全買是 **$390**，是考試費的三倍。官方另外列了五項免費的補充材料（NVIDIA 部落格與隨選影片，含「What Is Retrieval-Augmented Generation, aka RAG?」與 Trustworthy AI 頁面）。

**實務建議**：不要全買。照權重挑 —— 如果你已經在做 LLM 應用，缺的通常是 Core ML 那 30% 與 Data Analysis 那 14%，對應的是前兩門（$180）；Transformer 那門 $30 CP 值最高。剩下的用免費材料與官方文件補。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | **$125** |
| 時間 | **1 小時** |
| 題數 | 官方頁面同時寫「includes 50 questions」與「50-60 multiple-choice」——**兩個數字並存於同一頁** |
| 及格 | **不公布**。官方 FAQ 寫「NVIDIA certification exams are pass/fail. You won't receive a score.」 |
| 效期 | **2 年**，且**只能靠重考續期** |
| 語言 | 僅英文 |
| 形式 | 線上遠端監考 |
| 先修 | 「A basic understanding of generative AI and large language models」 |

**一小時 50–60 題**代表平均每題約一分鐘，是本系列裡節奏最快的考試之一 —— 這會影響你的練習方式：要練到看題就有判斷，沒有時間慢慢推導。

**不給分數**這點也值得注意：沒過就是沒過，官方不會告訴你哪塊弱。所以自我評估要在考前做完，考完拿不到診斷資訊。

## 逐塊準備

### Core Machine Learning and AI Knowledge（30%）

**官方考什麼**：在資深成員指導下協助部署與評估模型的擴展性、效能與可靠性；從大型資料集擷取洞察的認知；**建立 LLM 用例（RAG、chatbot、summarizer）**；**為 RAG 整理與嵌入內容資料集**；熟悉機器學習基礎（**特徵工程、模型比較、交叉驗證**）；熟悉 Python 的 NL 套件（**spaCy、NumPy、向量資料庫**）；**讀研究論文以掌握新興 LLM 趨勢**；選模型建立文字嵌入；用 prompt engineering 原則寫 prompt；**用 Python 套件（spaCy、NumPy、Keras）實作傳統 ML 分析**。

**怎麼準備**：這塊是整張考試的重心，而且**橫跨兩個世界**。做 LLM 的人要補交叉驗證、特徵工程那半；做傳統 ML 的人要補 RAG 與嵌入那半。兩邊都缺的人，這張不適合當第一張證照。

### Software Development（24%）

**官方考什麼**：在指導下協助部署與評估；建立 LLM 用例；熟悉 Python NL 套件；**辨識滿足使用者需求所需的系統資料、硬體或軟體元件**；**監控資料蒐集、實驗與其他軟體流程的運作**；用 Python 套件實作傳統 ML 分析；**在指導下撰寫軟體元件或腳本**。

**怎麼準備**：注意這塊的條目與 Core ML 那塊**高度重疊**（同樣的 spaCy／NumPy、同樣的 LLM 用例、同樣的部署協助）。這不是我歸納錯，是官方 blueprint 本身就這樣寫。實務上代表：**這 24% 不需要另外準備**，把 Core ML 那塊讀熟就同時涵蓋。

### Experimentation（22%）

**官方定義**：「如何執行、評估與詮釋實驗，包含 AI 模型評估，以及在標註或 RLHF 中使用人類受試者」。

**官方考什麼**：擷取洞察；**用統計效能指標（損失函數、可解釋變異比例）比較模型**；在指導下進行資料分析；用專門軟體製作圖表與視覺化；辨識關聯與趨勢。

**怎麼準備**：這塊的定義提到 RLHF 與人類標註，但條目本身偏統計與資料分析。**準備重點放在「怎麼比較兩個模型」** —— 損失函數與可解釋變異比例是官方點名的兩個指標。

### Data Analysis（14%）與 Trustworthy AI（10%）

**Data Analysis** 的條目與 Experimentation 幾乎相同（官方 blueprint 就是這樣重複的），準備一次即可涵蓋兩塊 36%。

**Trustworthy AI**：**描述可信 AI 的倫理原則**、**資料隱私與資料同意之間的平衡**、**如何用 NVIDIA 與其他技術提升 AI 可信度**、**如何降低 AI 系統的偏誤**。這塊只有四條，且都是「描述」層級，官方免費材料裡的 Trustworthy AI 頁面就足夠。

## 三週時程與換算依據

**換算方式**：一小時 50–60 題的入門級考試，內容量本身不大 —— 難的是橫跨傳統 ML 與 LLM 兩塊。時程主要取決於你原本站在哪一邊，所以下面分成兩種情境。

**情境 A：你已經在做 LLM 應用，缺傳統 ML**（多數讀者）

| 週次 | 內容 |
|---|---|
| 第 1 週 | Core ML 的傳統 ML 半邊：特徵工程、模型比較、交叉驗證、用 spaCy／NumPy／Keras 做基本分析 |
| 第 2 週 | Experimentation + Data Analysis（合計 36%）：模型比較指標與視覺化 |
| 第 3 週 | Trustworthy AI（10%）+ 全書複習 + 限時練習（每題一分鐘） |

**情境 B：你做傳統 ML，缺 LLM**

把第 1 週換成 RAG、嵌入、prompt engineering 與向量資料庫；官方那門 $30 的 Transformer 入門課在這裡最划算。

**限時練習是這張特別需要的**：平均每題一分鐘，而且**考完不會給你分數診斷**，所以節奏要在考前練出來。

**失敗成本**：依官方 FAQ，沒過可以再買考一次，**間隔 14 天**，且**同一張考試 12 個月內最多五次**。

## 兩年效期，只能重考

四張 NVIDIA 證照的頁面都是同一句話：

> This certification is valid for two years from issuance. Recertification may be achieved by retaking the exam.

官方 FAQ 更直接：「NVIDIA certifications are valid for two years, after which you must retake the exam to be recertified.」**沒有繼續教育路徑、沒有續期折扣、沒有像微軟那樣的免費線上評量。** 兩年後就是再付一次 $125。

把這條算進總成本：$125 考試 +（依需要）DLI 課程 + 每兩年 $125 續期。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 五塊權重 | 30 / 24 / 22 / 14 / 10 | 每季 |
| 費用與時長 | $125、1 小時 | 每半年 |
| 題數 | 官方頁面自己寫了兩個數字（50 與 50–60） | 每半年 |
| DLI 課程價格 | 自學 $30–$90、講師課 $500 | 每季 |
| 語言 | 僅英文（官方 FAQ 說「some exams」有簡中，未指名哪幾張） | 每半年 |

## 參考資料

- [NCA-GENL 官方認證頁（規格與 blueprint）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA 認證總覽與 FAQ（計分方式、重考規則、續期）](https://www.nvidia.com/en-us/learn/certification/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Claude Certified Developer（CCDV-F）備考路徑](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
