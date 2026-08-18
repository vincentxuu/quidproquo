---
title: "微軟 AI-500 備考路徑：考綱已經公布，官方教材還沒上線"
date: 2026-08-18
type: guide
category: ai
tags: [certification, azure, agents, multi-agent, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 7
tldr: "AI-500 是主流雲端業者裡少見的多 agent 系統專家級認證，四塊權重 15-20 / 30-35 / 20-25 / 20-25，官方點名 Agent Framework、LangGraph、Hugging Face Transformers、MCP server 架在 Azure Functions / Logic Apps / API Management、A2A、Key Vault、AI Red Teaming Agent。但它現在有三個限制要先知道：仍是 beta（成績要等重新計分）、必須先取得 AI-103 才能考、而且官方學習路徑尚未上線——考試頁列的四條路徑網址目前全部 404，講師課要等 2026/9/30。"
description: "微軟 AI-500（Multi-Agent AI Solutions Expert，beta）備考指南，依官方 study guide 的四塊權重逐條拆解多 agent 架構、開發、評估監控與資安治理部署，說明 AI-103 先修條件、beta 的成績與重考規則，以及官方教材尚未上線時的替代準備路徑。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)，不含考古題。查證日期：2026-08-18。

AI-500 是三大雲端業者裡**唯一專攻多 agent 系統的專家級認證**。它的考綱寫得非常具體 —— Agent Framework、LangGraph、Hugging Face Transformers、MCP server 架在 Azure Functions／Logic Apps／API Management、A2A、Key Vault、AI Red Teaming Agent、DTAP 與藍綠金絲雀部署。

但在你決定準備之前，**有三件事會直接影響可行性**，先講完再談內容。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 三個先決條件

**一、必須先有 AI-103。** [官方認證頁](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)的 Certification prerequisites 寫：

> To become a Microsoft Certified: Multi-Agent AI Solutions Expert (beta), you must earn the Microsoft Certified: Azure AI Apps and Agents Developer Associate certification.

頁面欄位另標 `Prerequisites: 1 certification`。所以實際路徑是 [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)（$165）→ AI-500（$165），總成本 $330，時間上要先花六週左右拿下 AI-103。

**二、還在 beta，成績要等。** 認證與考試頁都掛著「Beta exams are not scored immediately because we're gathering data on the quality of the questions and the exam」。實務影響是：考完不會當場知道結果，要等考試正式上線後重新計分。

**三、官方教材尚未上線。** 這點最容易誤判。考試頁的「Two ways to prepare」區塊在原始碼裡列了四條學習路徑的識別碼，但**四條的公開網址目前全部回 404**（我逐一測過）；認證頁自己也寫著「Learning paths or modules are not yet available for this certification」。講師課 [AI-500T00](https://learn.microsoft.com/en-us/training/courses/ai-500t00) 頁面則寫「**This course will be available on 9/30/2026**」。

換句話說：**考綱有了，官方教材還沒有。** 這決定了你的準備方式，下面「沒有教材怎麼準備」那節會處理。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | AI-500（Designing and Implementing Multi-Agent AI Solutions，beta） |
| 認證名稱 | Multi-Agent AI Solutions Expert（beta） |
| 費用 | **$165 USD**（依國家或地區定價） |
| 時間 | **官方未公布**；通用政策是 expert 級無 lab 100 分鐘、含 lab 120 分鐘 |
| 題數 | **官方未公布**；通用說明「typically contain between 40-60 questions」 |
| 及格 | **700** |
| 語言 | **僅英文** |
| 先修 | **必須持有 AI-103 的認證** |
| 效期 | 1 年（免費線上續期評量；專屬續期頁尚未上線） |
| 練習測驗 | **尚未提供** |

## 四塊權重

| 技能 | 比重 |
|---|---|
| Architect multi-agent solutions | 15–20% |
| **Develop multi-agent solutions in Azure** | **30–35%** |
| Evaluate, optimize, and monitor multi-agent solutions | 20–25% |
| Secure, govern, and deploy multi-agent solutions | 20–25% |

**這張的重心在「開發」而不是「架構」** —— 架構只佔 15–20%，開發佔 30–35%，而評估監控與資安治理各佔 20–25%。名字叫 expert，但考的不是紙上架構圖，是你有沒有真的把多 agent 系統送上線過。

## 逐塊準備

### Architect multi-agent solutions（15–20%）

**設計邏輯架構**：把目標拆解成工作流、agent 與工具；設計含 subagent、控制迴圈與 human-in-the-loop 的工作流；**指定 agent 的人格、範圍、邊界、自主程度與行為準則**；指定工具範圍、權限邊界與驗證方式；指定通訊協定（agent 之間、agent 與其他元件之間）；設計支援 **HAX（human-AI experience）** 與負責任 AI 的控制項；設計短期與長期記憶架構含 context 共享；**把任務需求對應到模型家族的能力**。

**指定技術元件**：協調 agent 對 agent、agent 對工具、agent 對知識來源路由的整合元件；**Zero Trust 多 agent 方案**（每個 agent 的身分範圍、防止橫向移動、法規部署的合規控制對應）；多層狀態持久化（session state、共享團隊狀態、長期語意記憶，含生命週期與租戶隔離）；運算元件；**可觀測性元件**（跨服務 trace 關聯、agent 推理路徑的結構化記錄、**agent replay 擷取以重現除錯**）；監控元件（跨 agent 協調追蹤、行為漂移與品質回歸偵測、失敗樣態的自動修復）；開發環境（dev container、VS Code 擴充、CLI、相依管理、AI instructions）。

**怎麼準備**：這塊雖然只佔 15–20%，卻是後面三塊的詞彙表。**Zero Trust 與 agent replay 這兩個是別家考綱沒有的**，值得單獨讀。

### Develop multi-agent solutions in Azure（30–35%，最重）

**進階 prompt 工程**：範例、**動態 context 注入**、防禦性準則、**prompt 生命週期管理**；context-aware 的多 agent 行為；agent 與模型的微調策略（資料與頻率）。

**記憶、context 管理與知識整合**：單一 agent 內與 agent 之間的 context 管理（累積、檢索、注入、**壓縮**）；記憶策略（安全、合規、生命週期、儲存、session 管理）；**多 agent RAG 架構**（chunking、embedding 品質、檢索精準度）；供多 agent 消費的知識整合（搜尋、RAG、**MCP 可取得的來源**、語意搜尋）。

**工具生態**：整合外部資源（function calling、指定工具使用、**動態工具使用**）；**設計並建置 MCP server 與 client，含 Azure Functions、Azure Logic Apps、Azure API Management**；工具的錯誤處理與 fallback；工具結果驗證與品質檢查。

**多 agent 編排**：編排模式 —— **hub-and-spoke、循序、平行、peer-to-peer、orchestrator-subagent**；human-in-the-loop（核可流程、覆寫、邊界案例）；快取策略（prompt caching、語意快取、回應快取）；**控制 agent 的生成、批次與並行執行**；用 **A2A 或 MCP** 安全地把既有 agent 併入；編排框架 —— **Agent Framework、LangChain、LangGraph**；**用 Hugging Face Transformers 實作進階多 agent 能力**；設計可重用的 middleware（記錄、授權、例外處理）。

**怎麼準備**：這塊是整張考試的核心，而且**幾乎每一條都要動手才會**。最小可行的練習：用 Agent Framework 或 LangGraph 做一個 orchestrator-subagent 架構，把其中一個工具做成 MCP server 部署到 Azure Functions，再加上 human-in-the-loop 的核可節點。站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)可以補協定與防護的實務脈絡。

### Evaluate, optimize, and monitor（20–25%）

**評估與驗證**：在 Foundry 裡設計人工審查流程；**針對記憶、知識、工具、prompt 分別做評估**。

**最佳化**：優化任務時長（平行度與速率限制）；**診斷 context window 問題 —— sliding-window amnesia、summary drift、vector-only recall、entity continuity**；持續改善（LLM-as-a-judge 框架、合成資料生成、語意優化迴圈、使用者回饋迴圈）。

**可觀測性與監控**：可靠性監控策略（agent 健康、工作流失敗、trace 關聯、漂移偵測、品質回歸、修復）；平台可用性與 SLA；**token 用量最佳化（token 上限、迴圈控制、工具呼叫）**；成本監控與管理（用量、配額、分配、chargeback）；在 Foundry 實作 tracing（token、prompt、correlation ID、告警、執行追蹤）。

**怎麼準備**：**那四個 context window 失效模式是這張最獨特的考點** —— 官方把它們逐一命名，代表題目會給你症狀要你判斷是哪一種。這四個詞在其他家的考綱裡都找不到，值得專門弄懂。

### Secure, govern, and deploy（20–25%）

**安全**：資源存取（身分存取、網路邊界、存取控制政策、RBAC）；驗證流程（**使用者模擬、on-behalf-of、API key、OAuth 2.0**）；用 **Azure Key Vault** 管理密鑰（secrets、憑證、金鑰輪替、角色存取、加密）；**shift-left 安全，含 Foundry 的 AI Red Teaming Agent**。

**Guardrails**：**多重介入的 guardrail 策略，涵蓋使用者輸入、工具呼叫、工具回應與輸出**；領域專用的自訂 guardrail；**用合成資料做 guardrail 測試與驗證**。

**部署**：發布方法（**DTAP、藍綠、金絲雀**）；多環境發布策略（回滾、發布管理、rollout）；測試策略（單元、回歸、整合、**自動化評估**）；CI/CD 需求（含 IaC 部署與測試）。

**怎麼準備**：這塊跟一般 Azure 資安考題的差別在於**「多重介入」那個框架** —— guardrail 不是只擋輸入輸出，而是四個介入點都要有。AI Red Teaming Agent 是 Foundry 特有的工具，官方點名了就值得實際跑一次。

## 沒有官方教材，怎麼準備

這是這張考試現在最實際的問題。四條學習路徑還沒上線、講師課要等 9/30、練習測驗沒有 —— 可用的官方材料只剩三樣：

1. **study guide 本身**（22 條子目標，就是上面那四節）—— 把每條當成檢核表，逐條問自己「我做過嗎」
2. **Microsoft Foundry 官方文件** —— study guide 的 Study resources 直接指向 [Foundry 文件](https://learn.microsoft.com/en-us/azure/foundry/)與[用 Agent Framework 建多 agent 工作流自動化方案](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation)這篇架構文
3. **exam sandbox** —— 熟悉介面

**替代路徑**：先把 AI-103 的四條學習路徑做完（那是先修條件，本來就要做），其中「Develop AI agents on Azure」那條與本張考試的第二塊重疊度最高。剩下的缺口用官方文件補。

**時程建議**：因為缺教材，這張的時程比同級證照更依賴你的既有經驗。**如果你沒有實際做過多 agent 上線**，我的建議不是排讀書計畫，而是**先等 9/30 的講師課或學習路徑上線**再開始 —— 用 22 條目標當檢核表自學，成本會高於等兩個月。

**如果你已經在做多 agent 系統**，那 study guide 的 22 條就是很好的自我盤點清單，四到六週足夠補齊缺口。

## beta 的規則

- **beta 期間只能考一次**，沒過要等考試正式上線才能重考
- 成績要等：官方寫重新計分在考試上線後開始，最終結果約再 10 天
- **通過 beta 就算數**，不需要在正式版重考
- 微軟另有規定，位於部分國家的考生不能參加 beta 考試（官方 beta 說明頁列出中國、印度、巴基斯坦與土耳其）
- 官方部落格寫 GA 預計在 **2026 年 10 月**（前瞻性說法，認證頁未載明）

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| beta 狀態 | 仍是 beta，GA 預計 2026/10 | 每月 |
| 四塊權重 | 15-20 / 30-35 / 20-25 / 20-25 | GA 之後 |
| 學習路徑 | 考試頁列了四條，**公開網址全部 404** | 每月 |
| 講師課 AI-500T00 | 標示 2026/9/30 開課 | 9 月底 |
| 練習測驗 | 尚未提供 | GA 後 8 週內 |
| 語言 | 僅英文 | GA 之後 |

## 參考資料

- [Multi-Agent AI Solutions Expert（beta）認證頁](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Exam AI-500 頁面](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-500/)
- [AI-500 官方 study guide（四塊權重與 22 條目標）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [課程 AI-500T00（標示 2026/9/30 開課）](https://learn.microsoft.com/en-us/training/courses/ai-500t00)
- [Microsoft Foundry 官方文件](https://learn.microsoft.com/en-us/azure/foundry/)
- [用 Agent Framework 建多 agent 工作流自動化方案](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/idea/multiple-agent-workflow-automation)
- [微軟 beta 考試說明](https://learn.microsoft.com/en-us/credentials/support/about-beta-exams)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [微軟 AI-103 備考路徑（AI-500 的先修）](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
- [微軟 AB-620 備考路徑](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide)
