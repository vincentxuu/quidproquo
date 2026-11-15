---
title: "Google Professional Agentic Architect（PAA）備考路徑：hybrid 兩部分考什麼、怎麼準備"
date: 2026-11-13
type: guide
category: ai
tags: [certification, gcp, agentic-ai, agent-architecture, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 31
tldr: "Google 的 Professional Agentic Architect 以 hybrid 兩部分的方式考驗：先過 Pearson 監考的選擇題，再過 Google Skills 的 hands-on labs。兩部分都是必修。官方 GA 規格是 2 小時、50-60 題選擇題、$200、英文、效期一年；beta（2026 年 9 月 8 日至 30 日）是 3 小時、約 80 題、$120。"
description: "Google Professional Agentic Architect（PAA）的備考指南：GA 後 hybrid 兩部分（Pearson 選擇題與 Google Skills labs）各自的準備方式、五章考證 domain 權重、與 PMLE 的關係，以及建議時程與坑。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-13-google-agentic-architect-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 exam guide](https://services.google.com/fh/files/misc/professional_agentic_architect_exam_guide_english.pdf)，所有「怎麼準備」都指回官方學習路徑或 Google Cloud 文件，不含考古題。查證日期：2026-11-13。

Google 的 AI 認證到 2026 年底多了一張：[Professional Agentic Architect](https://cloud.google.com/learn/certification/agentic-architect)（後稱 PAA）。這是 Google Cloud 最新的專業級認證，也是第一張把 agentic 工作流程本身當成考目標的官方證照——它考的不是「會不會用大模型」，而是「設計、部署與治理自主 agent 系統」。

PAA 從 2026 年 9 月 beta 起就架在 hybrid 兩部分的考法上，2026 年 11 月 2 日正式版（GA）開放報名。流程與 beta 相同：先過 Pearson 監考的選擇題，過完之後透過 CM Connect 拿到 Google Skills 的 hands-on labs；兩部分都過，才拿到 credential。

## 這張適合誰

**適合**：在 Google Cloud 上實際建過 agent，而且工作跨「建構 → 部署 → 治理」的工程師或架構師。官方建議經驗是 **3 年以上建構、測試、部署及管理雲端解決方案的實務經驗，其中 1 年以上使用 Google Cloud 建構 agentic 解決方案**。

**不適合**：只會寫提示詞（prompt）的工程師。PAA 第一章（低程式碼）本身就在驗證「會用流程編排工具做出可運行的工作流程」；第三章（自訂 agent）才進入 coding。只想證明自己會 LLM 應用的，應該先讀 [PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) 那張。

**與 PMLE 的關係**：[PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) 的考綱在 2026 年被重寫，agentic 內容已內嵌；PAA 把 agent 獨立成一張官方證。PMLE 的考綱骨架仍是傳統 ML 工程，不考多 agent 協調；PAA 第三章第三節才考 MCP、A2A 與多 agent 交接。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | $200（另計稅） |
| 時間 | 兩小時 |
| 題數與題型 | 50-60 題**選擇題** |
| 語言 | **英文** |
| 形式 | 線上或現場監考 |
| 先修條件 | 無 |
| 建議經驗 | 3 年以上 + 1 年 agentic on Google Cloud |
| 效期 | **一年** |

這張考的是「agentic 工作流程」而非「模型」。官方把它描述成：一個技術從業人員負責在 Google Cloud 中設計及管理 AI 導向自主代理工作流程，評估是否具備能力的五個面向是——用低程式碼工具建構代理、用程式設計代理開發應用程式、開發自訂代理、評估及部署代理工作流程、保護及管理代理工作流程。

考試是 hybrid 兩部分：

- **第 1 部分**：由 Pearson 監考的選擇題，評估概念知識、系統設計選擇與架構標準，涵蓋成本優化與安全治理。
- **第 2 部分**：通過第 1 部分後，於 CM Connect 收到指示，於 Google Skills 的實作實驗室完成；必須兩部分都過才取得 credential。

## 五章權重就是你的讀書計畫

| 章節 | 比重 | 主題 |
|---|---|---|
| 1. Building agents using low-code tools | ~13% | 低程式碼 agent |
| 2. Using coding agents for application development | ~17% | Coding agents |
| 3. Developing custom agents | ~33% | 自訂 agent |
| 4. Evaluating and deploying agentic workflows | ~22% | 評估與部署 |
| 5. Securing and governing agentic workflows | ~15% | 安全與治理 |

五章加起來約 100%。最重的是第三章（自訂 agent，33%），其次第四章（評估與部署，22%）。

### 第 1 章：低程式碼 agent（~13%）

**官方考什麼**：用 Gemini Enterprise Workflow Builder、CX Agent Studio 等低程式碼工具組 agentic workflow；state-based workflow、system instructions、in-console prompt templates；把企業資料接進 agent（Gemini Enterprise、Agent Search、multimodal ingest）。

**讀什麼**：官方低程式碼工具文件與官方學習路徑。

**練什麼**：用流程編排工具做出一個可運行的 agent workflow，而不是只寫 system prompt。

### 第 2 章：Coding agents（~17%）

**官方考什麼**：配置 coding agent（Antigravity、Claude Code on Google Cloud）的 MCP servers、custom skills、tools；在 GKE、Cloud Workstations、Antigravity 的 secure sandbox 中使用；refactor、optimize runtime、修補 application-layer vulnerabilities。自訂部分涵蓋 skills、plugins、extensions、hooks、rules、subagents，以及用 Agents CLI 擴充 Antigravity。

**讀什麼**：Agents CLI、Antigravity 文件。

**練什麼**：把 coding agent 帶進企業 codebase 的 workflow，而不是只當 autocomplete。

### 第 3 章：自訂 agent（~33%，最重）

**官方考什麼**：選 LLM vs small language model、self-hosted vs SaaS、open-source vs proprietary；用 Agent Development Kit（ADK）建 agent；設定 sessions 與 memory；RAG（Vector Search、Agent Retrieval）整合企業 domain knowledge；Agent Identity 與 Agent Registry 的權限邊界；orchestration 用 MCP、A2A，多 agent handoff（parallel、sequential、graph）。

**讀什麼**：Agent Development Kit、Agent Platform 文件。

**練什麼**：完整走一遍「自訂 agent → RAG → orchestration → handoff」。

### 第 4 章：評估與部署（~22%）

**官方考什麼**：test sets、golden data、continuous evaluation pipelines、eval tooling（ADK evalset、Agent Platform Gen AI evaluation service、custom autoraters）；部署 runtime（Agent Runtime、Cloud Run、GKE）、troubleshooting（drift、tool invocation latency、reasoning loops、system failures）、monitoring 與 optimization。

**練什麼**：為 agent 做 evaluation，再部署與監控。

### 第 5 章：安全與治理（~15%）

**官方考什麼**：authentication、secure tool execution（OAuth 2.0）、Principal Access Boundary（Agent Identity）、Agent Gateway、Agent Registry、Model Armor；safety frameworks、guardrails、human-in-the-loop、secure data access。

## 建議時程與它的依據

以每週投入 8-10 小時估算，約 8-10 週：

| 週次 | 內容 |
|---|---|
| 第 1 週 | 通讀官方 exam guide，對照官方 learning path |
| 第 2 週 | 第 1-2 章（低程式碼 + coding agents） |
| 第 3-4 週 | 第 3 章（自訂 agent，33% 最重） |
| 第 5-6 週 | 第 4 章（評估與部署） |
| 第 7 週 | 第 5 章（安全與治理） |
| 第 8 週 | 全章複習 + sample questions |

## 三個會讓你白花 $200 的坑

**第一，拿舊教材的產品名全部對不上。** Workflow Builder、Agent Runtime、Agent Search 這些新名詞，2026 年中以前的教材還用舊名（Agent Designer、Agent Engine、Vertex AI Search）。同一坑在 PMLE 那篇裡，舊教材的 Vertex AI 對不上重寫後的 Gemini Enterprise Agent Platform。

**第二，只過第 1 部分就以為拿到 credential。** 兩部分都是必修。GA 的結果 7-10 個 business days 出來後，過 labs 才能拿到正式 credential；labs 有 2 個月期限。

**第三，用官方建議的門檻壓時程。** 沒有 1 年以上 agentic on Google Cloud 的實務經驗，第 3-5 章會卡住。官方建議 3 年以上 + 1 年 agentic。

## 考完之後：效期一年與持續教育

PAA 的效期是 **一年**，而非其他 Google 專業級證照的兩年。官方說明是因為 agent 領域變化太快；官方提供持續教育路徑協助維持 active status。

## 會變動的資訊（報名前再確認）

| 項目 | 現況（2026-11-13 查證） | 什麼時候要重查 |
|---|---|---|
| 考證狀態 | GA（正式版 2026 年 11 月 2 日開放報名） | 每季 |
| 考試結構 | hybrid 兩部分：Pearson 選擇題 + Google Skills labs | 考綱更新 |
| 考試時間與題數 | 2 小時、50-60 題選擇題 | 每次考綱更新 |
| 費用 | $200 | 每季 |
| 效期 | 一年 | 官方說之後會擴展 |
| 語言 | 英文 | 若加開中文會影響備考 |
| 交付方式 | 線上或現場監考；results 7-10 business days | 政策頁標示 recently updated |

## 更新紀錄

- 2026-11-13：依 GA 頁面與官方 FAQ 更新官方規格（2 小時、50-60 題選擇題、$200、英文、線上或現場監考、效期一年）；beta 規格（9/8-9/30、3 小時、約 80 題、$120）移到對照。

## 參考資料

- [Professional Agentic Architect 官方認證頁](https://cloud.google.com/learn/certification/agentic-architect)
- [Professional Agentic Architect 官方 exam guide](https://services.google.com/fh/files/misc/professional_agentic_architect_exam_guide_english.pdf)
- [Professional Agentic Architect Certification FAQs（Google Cloud Certification Help）](https://support.google.com/cloud-certification/answer/18080541?hl=en)
- [Google Cloud Agentic Architect Certification（官方 blog）](https://cloud.google.com/blog/topics/training-certifications/google-cloud-agentic-architect-certification-dont-just-prompt-ai-design-it)
- [Machine Learning Engineer 官方學習路徑（Google Skills）](https://www.cloudskillsboost.google/paths/17)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Google Professional Machine Learning Engineer（PMLE）備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [多 agent 架構考點對照](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [AI 治理框架對照](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains)
