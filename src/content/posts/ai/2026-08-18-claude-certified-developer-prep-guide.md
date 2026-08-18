---
title: "Claude Certified Developer（CCDV-F）備考路徑：三分之一考的是普通軟體工程"
date: 2026-08-18
type: guide
category: ai
tags: [certification, claude, agents, mcp, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 8
tldr: "CCDV-F 是 Anthropic 四張認證裡對應工程師的那張。官方 blueprint 有八個領域，最重的 Applications and Integration 佔 33.1%——而它底下最大的兩塊是 Claude Application Design 8.6% 與 Software Engineering Foundations 7.4%，也就是說三分之一的考試在考 API 機制與普通軟體工程。反直覺的是 Claude Code 只佔 3.1%、Eval 只佔 2.6%，而同家族的 Architect 那張光 Claude Code 就佔 20%。官方規格：$125、53 題、120 分鐘、及格 720、效期 12 個月，報考限 Claude Partner Network 組織。"
description: "Claude Certified Developer – Foundations（CCDV-F）備考指南，依官方 exam guide 的八個領域與子領域權重逐項拆解，說明它與 Architect Foundations 的考點差異、五週時程換算依據、partner 報考門檻，以及 12 個月效期與免費續期規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回官方 **Claude Certified Developer – Foundations Exam Guide**，不含考古題。查證日期：2026-08-18。

Anthropic 的四張認證裡，**CCDV-F 是給工程師的那張**。它跟站內已有的 [Architect Foundations（CCAR-F）](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)同價、同時長，但考的東西差很多 —— 差多少，看完權重表就知道。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

官方 exam guide 的 Intended Audience 寫得很具體：

> These professionals typically have one to five years of experience in software engineering, along with at least six months of hands-on experience with Claude or comparable LLM-based systems.

並列出應具備的能力：用 Claude Agent SDK 與 agentic 框架建 agent 與工作流、透過 API 與 SDK 整合 Claude、用 Claude Code 做程式碼現代化、寫 prompt 與 context engineering、設計並執行 eval、建自訂工具與 MCP server。技術面要求 **Python 和／或 TypeScript**、熟 REST API 與 CLI。

**適合**：已經在用 Claude API 出貨的人。**不適合**：只用 claude.ai 對話、沒寫過整合的人 —— 這張假設你有六個月以上的實作。

**先決條件**：跟其他三張一樣，**報考限 Claude Partner Network 的組織**，個人無法自行報名。細節見 [CCAR-F 那篇](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)的報考一節。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 考試代碼 | CCDV-F |
| 題數 | **53 題** |
| 時間 | 120 分鐘 |
| 費用 | **$125 USD** |
| 及格 | **720**（量尺 100–1,000） |
| 效期 | **12 個月** |
| 題型 | 單選與複選 |
| 形式 | 線上監考或 Pearson 考場 |

比較一下同家族：CCAO-F $99 / 60 題、**CCDV-F $125 / 53 題**、CCAR-F $125 / 60 題、CCAR-P $175 / 63 題。CCDV-F 是四張裡題數最少的，但時間一樣 120 分鐘 —— 平均每題 2 分 15 秒，是四張裡最寬裕的。

## 八個領域的權重

| 領域 | 比重 |
|---|---|
| **Applications and Integration** | **33.1%** |
| Model Selection and Optimization | 16.8% |
| Agents and Workflows | 14.7% |
| Prompt and Context Engineering | 11.0% |
| Tools and MCPs | 10.6% |
| Security and Safety | 8.1% |
| Claude Code | **3.1%** |
| Eval, Testing, and Debugging | **2.6%** |

**兩個數字會讓多數人意外**：Claude Code 只有 3.1%、Eval 只有 2.6%。對照 CCAR-F 的權重 —— 那張的 Claude Code Configuration & Workflows 佔 **20%** —— 可以看出 Anthropic 對兩個角色的定位分得很開：**架構師考「怎麼把 Claude Code 導入團隊流程」，開發者考「怎麼用 API 把東西建出來」。**

## 逐領域準備

官方把每個領域再拆成帶權重的子領域，這是這份 blueprint 最好用的地方 —— 可以精確到 1% 決定時間分配。

### Applications and Integration（33.1%，最重）

子領域與權重：**Claude Application Design 8.6%**、**Software Engineering Foundations 7.4%**、**Claude API Mechanics 6.8%**、Understanding Requirements 3.4%、Systems Life Cycle 2.8%（其餘為設定管理）。

**官方考什麼**：Claude API 的行為與機制 —— messages、tools、streaming、vision、thinking、**caching**、透過第三方廠商呼叫 Claude、Messages API 的資料存取模式、**batch API 的使用與即時／批次的取捨**；核心軟體工程 —— REST API、JSON、非同步程式設計、版控、SDLC 整合、code review、大小規模重構；Claude 應用設計 —— **Claude 在不同介面（Claude Code、Desktop、claude.ai、API、SDK）如何解讀指令**、內容邊界、schema 設計、session 衛生、plugin 管理；設定管理 —— **CLAUDE.md、settings.json、模型版本釘選、prompt 版控、plugin 相依**。

**怎麼準備**：這塊有一半是**普通軟體工程**（Software Engineering Foundations 7.4% + Systems Life Cycle 2.8% + Understanding Requirements 3.4% ≈ 13.6%），有經驗的人幾乎不用準備。真正要補的是 **API 機制那 6.8%** —— 特別是 batch API 與即時 API 的取捨、prompt caching 的行為。這些站內的 [Claude API 相關文章](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)之外，直接讀官方 API 文件最快。

### Model Selection and Optimization（16.8%）

子領域：**Technical Fundamentals 6.1%**、**LLM Fundamentals 5.2%**、Model Selection and Tradeoffs 2.7%（其餘為最佳化）。

**官方考什麼**：LLM 基礎（token、context window、取樣、非決定性、下一個 token 生成）、**模型選項（fast mode、extended thinking、adaptive thinking、effort levels）**、基本 prompting；**Opus / Sonnet / Haiku 的適用情境與 adaptive thinking 支援**、品質／延遲／成本的取捨、**模型改版時的破壞性行為變更**。

**怎麼準備**：「模型改版會帶來破壞性行為變更」這條是實務痛點也是考點，值得特別注意。三個模型的取捨要能用一句話講清楚，不要背規格。

### Agents and Workflows（14.7%）

**官方考什麼**：**什麼時候該用 workflow、什麼時候該用 agent** 的判準；manager／supervisor 階層結構；subagent 對任務執行的作用；**Agent Construction with Claude（5.3%）** —— 自訂 agent loop 與 harness、託管部署模式（**自架 vs Anthropic 託管**）、用 hooks 做決定性動作；常見設計模式（tool-use loop、subagent、記憶、context window 管理）與 agentic 抽象框架（**Strands、LangGraph、PydanticAI**）。

**怎麼準備**：官方點名了三個第三方框架，代表考題不會限定在 Anthropic 自家 SDK。站內的 [Agent 安全的 harness 層](/posts/ai/2026-08-10-agent-security-harness-layer)對 harness 與 hooks 那段有實務脈絡。

### Prompt and Context Engineering（11.0%）

**官方考什麼**：**token 預算與成本管理**（用量追蹤、成本建模、prompt caching 與 cache check-pointing）；**防止 context 漂移與膨脹**（工具輸出修剪、compaction）；**用 subagent 或多步流程做 context 隔離**；prompt 原則（指令清晰度、few-shot、system 與 user 的放置、輸出限制、跨元件的指令放置、迭代修正、輸入清洗）。

**怎麼準備**：這領域的重心其實在**成本與 context 管理**，不是「怎麼寫出漂亮 prompt」。compaction 與 context 隔離這兩個詞要能對應到具體做法。

### Tools and MCPs（10.6%）

子領域：**Tool Implementation 4.4%**、**Agentic Customization 4.1%**（其餘為 MCP server 開發）。

**官方考什麼**：**MCP server 開發**（撰寫、部署、與 Claude 應用整合、MCP 的 resources / tools / prompts、**通訊模式 stdio 與 socket、client 與 server 的分野**）；工具實作（外部系統互動的設定、**工具描述的寫法**、錯誤處理、工具使用）；**內建工具、自訂工具、Skills、MCP 四者的取捨**。

**怎麼準備**：最後那條「四者取捨」是這領域的核心判斷題型。實作上建議自己寫一個 MCP server 走 stdio，再接進 Claude Code —— 一次就能把通訊模式與工具描述兩件事都摸熟。

### Security and Safety（8.1%）

子領域：**AI Application Security 3.2%**、Guardrails and Safe Deployment 2.3%、**Identity, Secrets, and Key Management 1.6%**、**Claude Hooks 1.0%**。

**官方考什麼**：**prompt injection 的認知與緩解**、jailbreak 防禦、不可信輸入處理、資料外洩防護、PII 處理；內容政策與 **guardrail 分層**、secure-by-design（隱私、IAM、最小權限）；跨開發與正式環境的密鑰管理；**用 hooks 做 guardrail、防止破壞性動作**。

**怎麼準備**：Claude Hooks 只佔 1.0% 但很具體 —— 官方寫的是「prevent destructive actions」，也就是那個「刪檔前攔下來」的用途。

### Claude Code（3.1%）與 Eval, Testing, and Debugging（2.6%）

這兩個加起來只有 5.7%，但別完全跳過。

**Claude Code**：核心元件（**Rules、Skills、Commands、Agents、Agent Memory**）、功能（session 管理、內建與自訂 slash command、**headless mode、streaming mode、auto-mode**）、**CLAUDE.md 階層**、repo 初始化、settings.json。

**Eval / Debugging**：錯誤類型辨識、復原策略選擇、**用 trace 分析找失效模式**、**區分問題出在整合層還是模型輸出**。

**怎麼準備**：兩個領域各花半天讀過即可。最後那條「區分整合層與模型輸出」很實用，日常除錯就在做。

## 五週時程與換算依據

**換算方式**：官方假設你有 1–5 年軟體工程經驗加六個月 Claude 實作，所以**佔 33.1% 的第一領域裡有大約 13.6% 是你已經會的普通軟體工程**。扣掉那部分，實際要準備的內容大約是七成，因此比同價的 CCAR-F 略短。

以每週 6–8 小時、共五週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 exam guide + 做 Section 8 的官方 sample questions | 先確認自己在哪些子領域是空的 |
| 第 2 週 | Applications and Integration 的 Claude 部分（API 機制 6.8% + 應用設計 8.6%） | 最重的一塊，但只補 Claude 相關的部分 |
| 第 3 週 | Model Selection（16.8%）+ Prompt and Context（11.0%） | 兩者都圍繞 token 與成本，一起讀較有連貫性 |
| 第 4 週 | Agents and Workflows（14.7%）+ Tools and MCPs（10.6%） | 實作週：寫一個 MCP server 並接進 agent |
| 第 5 週 | Security（8.1%）+ Claude Code（3.1%）+ Eval（2.6%）+ 複習 | 剩下的 13.8% 收尾 |

**官方對準備方式的態度很明確**，exam guide 第 7 節寫：

> There is no single required course. Anthropic does not guarantee that any particular resource ensures a passing result.

它建議的核心動作是：**建一個真的 Claude 應用**，要用到 API、整合至少一個工具、套用基本的 prompt 與 context engineering，並包含簡單的安全與評估實踐。這句話本身就是最好的備考計畫 —— 上面五週的第 2 到 4 週其實就是在做這件事。

Anthropic Academy 上另有免費的 **Claude Certified Developer – Foundations Prep Course**，以及 Building with the Claude API、Claude Code in Action、Introduction to MCP 等課程。

## 12 個月效期與續期

exam guide 第 14 節寫得很清楚：

> The Claude Certified Developer – Foundations credential is valid for 12 months from the date it is awarded… To renew on time, you review what has changed since you certified and complete a free, non-proctored assessment on the Anthropic Partner Academy. There is no fee for on-time renewal. If your credential lapses, you must retake the full exam at the full fee to regain certified status.

**準時續期免費且非監考，過期就要付全額重考 $125。** 這個結構跟微軟一樣 —— 維護成本低但要記得，忘記一次就重來。

重考規則（[Pearson VUE 頁](https://www.pearsonvue.com/us/en/anthropic.html)）：沒過等 14 天、第二次 30 天、第三次 90 天，**同一張考試 12 個月內最多 4 次**。

## 這張與 Architect Foundations 怎麼選

| | CCDV-F（本文） | CCAR-F |
|---|---|---|
| 費用 / 題數 | $125 / 53 題 | $125 / 60 題 |
| 最重領域 | Applications and Integration 33.1% | Agentic Architecture & Orchestration 27% |
| Claude Code 比重 | **3.1%** | **20%** |
| 考試結構 | 一般題 | **六情境抽四個** |
| 適合 | 寫程式整合 Claude 的人 | 設計方案、導入團隊流程的人 |

**兩張沒有先後關係**，Anthropic 沒有把 Foundations 設成階梯。選擇標準是你的工作內容：**天天呼叫 API 的選 CCDV-F，替客戶設計方案的選 CCAR-F。**

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 八領域權重 | 33.1 / 16.8 / 14.7 / 11.0 / 10.6 / 8.1 / 3.1 / 2.6 | 每季 |
| 規格 | $125、53 題、120 分鐘、及格 720、12 個月 | 每季 |
| 報考門檻 | 限 Claude Partner Network 組織 | 每半年 |
| 官方點名的框架 | Strands、LangGraph、PydanticAI | 每次 guide 改版 |

## 參考資料

- [Claude Certified Developer – Foundations 官方認證頁（含 exam guide 下載）](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [Pearson VUE — Claude Certification Program（重考與報考規則）](https://www.pearsonvue.com/us/en/anthropic.html)
- [Anthropic：四張角色制認證公告](https://claude.com/blog/four-role-based-claude-certifications)
- [Claude Academy FAQ（免費課程證書與監考認證的差別）](https://academy.claude.com/help/faq)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [Claude Certified Architect Foundations 備考指南](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide)
- [微軟 AI-103 備考路徑](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide)
