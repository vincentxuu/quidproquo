---
title: "GitHub Agentic AI Developer（GH-600）備考路徑：考的是怎麼管 coding agent，不是怎麼寫"
date: 2026-10-08
type: guide
category: ai
tags: [certification, github, coding-agent, multi-agent, mcp, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 29
tldr: "GH-600 是 GitHub 的 agent 認證（官方標示 Intermediate），考在軟體開發流程裡營運、監督與治理 AI agent。六塊權重 15–20 / 20–25 / 10–15 / 15–20 / 15–20 / 10–15，最重的是工具與環境（MCP、權限、CI 觸發、錯誤處理）。條目最常見的動詞是 configure（65 條裡 15 條），其次是 identify 與 implement。官方規格：美國 $165、台灣 $83、120 分鐘、及格 700、效期 2 年、僅英文，沒有官方練習測驗，官方自學教材合計不到 6 小時。"
description: "GitHub Certified: Agentic AI Developer（GH-600）備考指南，依官方 study guide 的六塊技能權重拆解，說明每塊考什麼、兩條官方學習路徑各對應哪幾塊、五週時程的換算依據、教材偏薄時怎麼補，以及它與 GH-300 的分工。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-08-github-gh-600-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄，作者沒有報考這張考試。所有「考什麼」都指回[官方 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600)，所有「怎麼準備」都指回官方訓練與 GitHub 文件，不含考古題。查證日期：2026-10-08。

讓 coding agent 自己開分支、發 pull request 不難。難的是它做錯的時候你看不看得出來、擋不擋得住、救不救得回來。GH-600 整張考的就是這件事：官方說這張認證要證明你能在正式的開發流程裡「operating, integrating, supervising, and governing AI agents」，並以 GitHub 當作紀錄系統與控制平面。

它與 [GH-300](/posts/ai/2026-10-08-github-gh-300-prep-guide) 是上下兩層：GH-300 考會不會用 Copilot，GH-600 考能不能讓一群 agent 在團隊的流程裡安全地跑。

## 這張適合誰

官方 study guide 的 audience profile 列了五項職責：

- 在軟體開發生命週期（SDLC）裡營運 agent 工作流
- 用 GitHub 的控制機制監督自主行為
- 用掃描結果與產出物評估並調校 agent 的輸出
- 設定自訂 agent
- 安全地協調多 agent 執行

並要求有 SDLC、GitHub 工作流與控制、程式碼品質、資安與審查的經驗，以及用過 coding agent，包含「GitHub Copilot, MCP servers and agent customization such as custom instructions, custom agents, tools, and Copilot setup steps」。

**適合**：平台工程師、DevOps 工程師、技術主管，以及任何負責決定「agent 在我們的儲存庫裡可以做到哪一步」的人。

**不適合**：還沒在團隊流程裡跑過 agent 的人。這張的條目是維運視角，沒有實際處理過 agent 改壞東西、兩個 agent 改到同一個檔案的經驗，條目讀起來會很抽象。也不適合想考「怎麼從零寫一個 agent 框架」的人，那比較接近微軟的 [AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | GH-600 |
| 認證名稱 | GitHub Certified: Agentic AI Developer |
| 費用 | 美國 **$165 USD**、台灣 **$83 USD**（依考場所在國家定價） |
| 時間 | **120 分鐘** |
| 題數 | Microsoft Learn 的認證頁沒有列；GitHub 認證 FAQ 對旗下考試的通用說明是 60 題計分選擇題，另約 10–15 題不計分 |
| 題型 | 認證頁寫「You may have interactive components to complete as part of this exam」 |
| 及格 | **700**（[微軟技術類考試的通用及格線](https://learn.microsoft.com/en-us/credentials/certifications/exam-scoring-reports)，量尺 1–1,000；認證頁沒有另外列） |
| 效期 | **2 年** |
| 語言 | **僅英文** |
| 監考 | Pearson VUE |
| 先修 | 官方未列先修條件 |

價格比 GH-300 的 $99 高一級，和微軟 associate 級考試同價。

## 六塊技能權重

| 技能 | 比重 |
|---|---|
| Prepare agent architecture and SDLC processes | 15–20% |
| **Implement tool use and environment interaction** | **20–25%** |
| Manage memory, state, and execution | 10–15% |
| Perform evaluation, error analysis, and tuning | 15–20% |
| Orchestrate multi-agent coordination | 15–20% |
| Implement guardrails and accountability | 10–15% |

六塊分布平均，最重的也只有 20–25%。

## 逐塊準備

### Prepare agent architecture and SDLC processes（15–20%）

**官方考什麼**：

- **把 agent 整合進 SDLC**：辨識哪些步驟交給 agent；辨識並緩解 agent 的常見反模式；定義 agent 的輸入、輸出與成功條件。
- **劃清規劃、推理與行動的界線**：**把規劃設定成與執行分開**；讓 agent 輸出結構化的計畫；驗證計畫；**在檢查並核可之前不讓 agent 行動**（官方這條的原文不通順，寫的是「Prevent agent action until the agent checked and approved」，這裡照前後文解讀成計畫經過檢查與核可）。
- **可觀測性與控制**：規劃並實作 agent 的自主程度與 guardrail；讓 agent 在標準開發工具裡產出可檢查的產出物；**設定人工介入但不拖慢交付**。

**怎麼準備**：核心是「先計畫、核可後才執行」這個模式。練習：設定一個 agent 先把計畫寫成 issue 留言或檔案，人看過才讓它動手。study guide 為這塊列的文件是[為自訂 agent 做準備](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)，但那頁只講組織層級自訂 agent 要放在哪個儲存庫，不涵蓋計畫與核可流程。

### Implement tool use and environment interaction（20–25%，最重）

**官方考什麼**，分四組：

| 子題 | 條目重點 |
|---|---|
| 工具 | 辨識需要的工具；設定工具；**設定工具權限** |
| **MCP server** | 把 MCP server 加為 agent 的工具；設定 GitHub 的遠端 MCP server；**設定 MCP registry**；**設定 MCP allow list** |
| 開發環境整合 | 評估 agent 的執行情境；把 agent 的範圍限定在特定儲存庫；**在 CI workflow 裡觸發 agent**；以分支為範圍；讓 agent 自主建立分支與 pull request；處理環境限制 |
| 安全執行與錯誤處理 | 錯誤處理、**重試、回復（rollback）、升級處理路徑**；agent 行為的可追溯與問責 |

MCP 那組四條裡有兩條是管控（registry 與 allow list）。這張考的是組織怎麼限制 agent 能接哪些 server。

**怎麼準備**：實際設定一次。最小練習：為一個儲存庫設定一個自訂 agent，接一個 MCP server、限制它的工具權限、讓它在 CI 裡被觸發並自己開 pull request。study guide 為這塊列的文件是 [Copilot SDK 的自訂 agent 與 sub-agent 編排](https://docs.github.com/copilot/how-tos/copilot-sdk/use-copilot-sdk/custom-agents)，它涵蓋用程式碼設定 agent 的工具範圍與掛上 MCP server；儲存庫層級的設定、CI 觸發、開 pull request、MCP registry 與 allow list 要另外找 GitHub Copilot 的文件。

### Manage memory, state, and execution（10–15%）

**官方考什麼**：

- **記憶策略**：在短期、長期、外部記憶之間選擇；把記憶限定在與任務相關的資訊；**定義記憶的過期、修剪與重置規則**。
- **狀態與漂移**：把任務進度與決策記成可長久保存的產出物；**續做時不重複步驟、不偏離先前的決定**；偵測並修正長時間執行中的漂移。
- **跨工具的連續性**：共享 agent 狀態；防止互相衝突的 context；防止過期的 context。

**怎麼準備**：讀 GitHub 的 [Copilot memory 文件](https://docs.github.com/copilot/concepts/agents/copilot-memory)。練習：讓一個 agent 做到一半中斷，換一個 session 接手，看它靠什麼知道做到哪裡。要留意 Copilot Memory 存的是儲存庫層級的事實與個人偏好，沒用到的 28 天後自動刪除；它不存任務進度，接續工作靠的是 pull request、issue、檔案這類產出物。

### Perform evaluation, error analysis, and tuning（15–20%）

**官方考什麼**：

- **成功條件與評估訊號**：訂出預期結果與營運限制；辨識質化與量化的評估訊號；讓評估條件對齊開發意圖；**用自動化掃描工具產生評估訊號**。
- **失敗分析**：用記錄、計畫、追蹤、輸出與 workflow 產出物辨識失敗；**分類根因，官方舉的例子是推理錯誤、工具誤用、context 或環境問題**。
- **調校**：修改指示、工作流或限制；調整記憶用法；調整工具用法與工具存取。

**怎麼準備**：官方舉的三類根因可以當這塊的骨架。練習：蒐集三次 agent 失敗的案例，各歸到一類，再寫出對應的修法（改指示、改工具權限、補 context）。

### Orchestrate multi-agent coordination（15–20%）

**官方考什麼**，分四組：

- **營運多 agent 工作流**：套用編排模式；**為平行執行設定 agent 隔離**；**偵測並解決 agent 衝突，包含重疊的程式碼變更、重複的工作與互相矛盾的輸出**。
- **可觀測性**：讓多 agent 工作流產出可供審查與稽核的產出物；記錄 agent 之間的關鍵決策、交接與結果；事後分析。
- **失敗與降級**：辨識失敗、部分完成或卡住的執行；回應降級的行為或協調；**多 agent 的復原模式，包含回復與人在迴圈中**。
- **agent 的生命週期**：把 agent 加進既有工作流；**在不中斷進行中工作流的情況下更新、重新設定或替換 agent**；汰除 agent 並保留可稽核性與工作流的連續性。

第四組是其他證照少見的：它考 agent 的上線、換版與退役，把 agent 當成要維運的服務。

**怎麼準備**：多 agent 的共通概念（編排拓樸、交接、人在迴圈中）在站內的[多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)整理過。GH-600 特有的是「衝突」：兩個 agent 平行改同一個儲存庫時怎麼隔離、撞到了怎麼解。練習：讓兩個 agent 各在自己的分支上做相關的任務，然後處理合併衝突。

### Implement guardrails and accountability（10–15%）

**官方考什麼**：

- **自主程度**：依營運、資安與合規風險把 agent 的行為分類，決定人工介入的力道；指派自主程度，在符合組織資安與負責任 AI 標準的前提下讓交付盡量快。
- **Guardrail 與人在迴圈中**：辨識哪些行為需要人的判斷；擋下違反政策的行為；**用最小權限限定權限與執行情境**；**不可逆或涉及合規的變更，要求明確授權或受控路徑**；**盡量減少不會實質降低風險的核可，以維持執行速度**。

最後一條值得記住。這張的立場不是「核可越多越安全」，而是核可要花在真正降低風險的地方。同樣的句型在第一塊也出現過（人工介入但不拖慢交付）。

**怎麼準備**：對應文件是[建立 guardrail](https://docs.github.com/copilot/tutorials/cloud-agent/build-guardrails) 與[風險與緩解](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations)。練習：把你團隊裡 agent 可能做的十種行為列出來，各標上自主程度與需不需要核可，並寫出理由。

## 五週時程與換算依據

**換算方式**：官方有兩條學習路徑，各三個模組：

| 學習路徑 | 模組 | 對應考綱 |
|---|---|---|
| [Developing in Agentic AI Systems Part 1](https://learn.microsoft.com/en-us/training/paths/gh-developing-agentic-systems-1/) | Foundations of Agentic AI in GitHub；Designing Agent Architecture and SDLC Integration；Tooling, MCP, and Agent Execution Environments | 第一、二塊 |
| [Part 2](https://learn.microsoft.com/en-us/training/paths/github-agentic-systems-part-two/github-agentic-systems-part-two/) | Multi-Agent systems and orchestration；Memory, State, and Evaluation；Governance, guardrails, and operations | 第三到六塊 |

Microsoft Learn 課程目錄標示的時間合計約 5.8 小時，官方講師課 [GH-600T00-A](https://learn.microsoft.com/en-us/training/courses/gh-600t00) 是一天。**這個量對六塊考綱來說偏薄**：「Memory, State, and Evaluation」一個模組標 50 分鐘，卻對應第三、四兩塊合計 25–35% 的權重。所以時程的大半要留給動手，以每週 6–8 小時估算是五週。

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 study guide + Part 1 學習路徑 | 約 2.8 小時的教材 |
| 第 2 週 | **工具與環境（20–25%）**：自訂 agent、MCP、CI 觸發 | 最重，全部要實際設定 |
| 第 3 週 | Part 2 學習路徑 + 記憶與評估（合計 25–35%） | 教材最薄的兩塊，靠文件與練習補 |
| 第 4 週 | 多 agent 協調（15–20%）+ guardrail（10–15%） | 做一次平行 agent 與衝突處理 |
| 第 5 週 | 逐條對 study guide 自評 | 沒有官方練習測驗 |

**教材的一個缺口**：第二塊的重試、回復與升級處理路徑，兩條學習路徑的單元標題裡都沒有直接對應的單元，要從文件與實作補。

**失敗成本偏高**：認證頁連到微軟的[重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)，第一次沒過等 24 小時，之後每次間隔 14 天，12 個月內最多 5 次。每次 $165（台灣 $83），又沒有練習測驗可以先測準備程度，建議把時程抓寬。

## 這張的已知陷阱

1. **沒有官方練習測驗。** GH-300 的認證頁有「Practice for the exam」區塊，GH-600 的認證頁沒有。只有考試沙盒可以先看操作介面。
2. **study guide 只列了一半的教材。** 「Get trained」只列 Part 1 的三個模組；Part 2 要從講師課頁面進去。只照 study guide 走會漏掉多 agent、記憶、評估與治理四塊的教材。
3. **study guide 有一條文件連結是壞的。** 第六塊的連結把兩個網址黏成一個，點了到不了。正確的是兩個獨立頁面，就是上面第六塊列的那兩條。另外第二塊與第五塊連到同一個頁面。
4. **study guide 不在 Microsoft Learn 的側邊目錄裡。** 從其他考試的 study guide 頁面的目錄找不到 GH-600，要從認證頁的連結進去。
5. **續期說明是微軟的通用文字。** study guide 的「Useful links」寫認證每年到期，那是範本；GitHub 認證的效期是兩年，以認證頁為準。
6. **產品變動快。** 條目裡的 MCP registry、allow list、cloud agent 都是還在演進的功能。study guide 註明題目以正式發布（GA）的功能為主，但常用的預覽功能也可能出題。

## 考完之後：兩年效期，續期制度還在轉換

與 GH-300 相同。認證頁說 GitHub 認證效期兩年，正在轉換到微軟的續期流程，以後可以不用重考整張就維持認證。新流程上線前到期的認證延長 6 個月。細節見 [GH-300 那篇的續期段落](/posts/ai/2026-10-08-github-gh-300-prep-guide)。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-10-08 查證） | 什麼時候要重查 |
|---|---|---|
| 六塊權重 | 15–20 / 20–25 / 10–15 / 15–20 / 15–20 / 10–15 | 每次改版 |
| 費用 | 美國 $165、台灣 $83 | 每半年 |
| 練習測驗 | 無 | 每月 |
| 考試語言 | 僅英文（講師課有日、韓、葡、西文） | 每季 |
| study guide 的教材清單與壞連結 | 只列 Part 1；第六塊連結黏在一起 | GitHub 修好時 |
| 續期流程 | 轉換中，尚未上線 | 每季 |

## 參考資料

- [GitHub Certified: Agentic AI Developer 認證頁](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-developer/)
- [GH-600 官方 study guide（技能目標全文與權重）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600)
- [GH-600T00-A 講師課程頁（兩條學習路徑的來源）](https://learn.microsoft.com/en-us/training/courses/gh-600t00)
- [學習路徑：Developing in Agentic AI Systems Part 1 of 2](https://learn.microsoft.com/en-us/training/paths/gh-developing-agentic-systems-1/)
- [學習路徑：Developing in agentic AI systems part 2 of 2](https://learn.microsoft.com/en-us/training/paths/github-agentic-systems-part-two/github-agentic-systems-part-two/)
- [GitHub Docs：為自訂 agent 做準備](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/prepare-for-custom-agents)
- [GitHub Docs：自訂 agent](https://docs.github.com/copilot/how-tos/copilot-sdk/use-copilot-sdk/custom-agents)
- [GitHub Docs：Copilot memory](https://docs.github.com/copilot/concepts/agents/copilot-memory)
- [GitHub Docs：建立 guardrail](https://docs.github.com/copilot/tutorials/cloud-agent/build-guardrails)
- [GitHub Docs：cloud agent 的風險與緩解](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations)
- [微軟考試重考政策](https://learn.microsoft.com/en-us/credentials/support/retake-policy)

**站內相關**

- [GitHub Copilot 認證（GH-300）備考路徑](/posts/ai/2026-10-08-github-gh-300-prep-guide)
- [多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
