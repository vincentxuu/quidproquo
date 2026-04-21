---
title: "一本由 AI 自己寫的書，教你怎麼跟 AI 一起寫軟體"
date: 2026-04-18
category: ai
tags: [agentic-coding, design-patterns, llm, ai-agent, software-engineering, claude-code]
lang: zh-TW
tldr: "Encyclopedia of Agentic Coding Patterns 收錄 190 個 pattern，幫你在 AI 代寫程式的時代做出正確的軟體決策——而這本書本身就是由 AI agent 自主撰寫和維護的。"
description: "深入介紹 Encyclopedia of Agentic Coding Patterns：一本由 AI 自主維護的活文件，收錄 190 個 agentic 時代的設計模式，涵蓋從 product judgment 到 agent governance 的完整知識體系。"
draft: false
---

2025 年初，一位 Rakuten 的 ML 工程師 Kenta Naruse 給了一個 coding agent 一個任務：在 vLLM 裡實作一個特定的 activation vector extraction 方法。vLLM 是一個橫跨多語言、超過 1250 萬行程式碼的開源 inference library。

他輸入指令，按下 Enter，然後等待。

七小時後，agent 交出了一個有效的實作，數值精度達到 99.9%。整個過程 Naruse 沒有寫一行程式碼。他只是偶爾給一些引導。

兩年前，這個任務需要幾週的人工作業。四年前，沒有任何 AI 工具有辦法嘗試它。

這就是 agentic coding。

## Agent 是放大器，不是替代品

*Encyclopedia of Agentic Coding Patterns* 開頭有一句話，我覺得是整本書最核心的洞察：

> *Think of an agent as an amplifier. It makes your decisions louder. Give it a clear architecture and well-defined boundaries, and it produces clean, maintainable work. Give it a vague prompt with no structure, and it produces a mess at speed. The mess compiles. The mess might even pass a few tests. But it won't hold up when requirements change, users arrive, or a second agent tries to build on top of it.*

Agent 讓壞決策變得更快、更大、更難清除。這是一個很重要的認識，尤其在 vibe coding 盛行的現在。

AI coding 工具不是突然出現的，而是經歷了幾個層次的演進：

- **Autocomplete（2021）**：預測下一個 token。沒有專案目標，無法從錯誤中恢復。
- **Chat（2023）**：對話式問答。更靈活，但你仍然要驅動每一步。
- **Agents（2025）**：接受目標，自主規劃、執行、測試、修正，直到完成或卡住。

這個演進的意義在於：**你的工作從寫程式，變成指導一個會寫程式的系統**。你不再是在打字，你在做三件事：

1. **寫 prompt**：精確度直接決定輸出品質。「幫我加輸入驗證」和「驗證 email 格式、最短密碼 12 字元、拒絕空欄位、每個 case 都要有 unit test」，agent 產出的差距是巨大的。
2. **Review 輸出**：Agent 會誤讀需求、選錯方法、寫出能過測試但邏輯錯誤的程式碼。你要像 code review 同事的 PR 一樣審查它的輸出。
3. **驗證正確性**：Review 是看起來對不對，驗證是確認它做了它該做的事。跑測試、對照 spec、測邊界條件。

## 為什麼需要 Pattern Language

這是一本 pattern 書。在解釋這本書之前，值得先說清楚 pattern 是什麼，以及為什麼在 agent 時代更重要。

1977 年，建築師 Christopher Alexander 出版了 *A Pattern Language*。他發現，某些設計問題——怎麼在街道旁放置座位、怎麼讓自然光進入室內——在不同的建築物裡反覆出現，而且有效的解法也有固定的形式。他把 253 個這樣的問題和解法整理成一本書，每個 pattern 都包含 context（在什麼情況下）、problem（面對什麼張力）、solution（怎麼解）。

他的真正貢獻是「language」這個詞：pattern 不是孤立的，它們互相連結。一個尺度的解法，創造了另一個尺度 pattern 能夠存在的條件。

1994 年，Erich Gamma、Richard Helm、Ralph Johnson、John Vlissides（GoF）把這個框架應用到軟體。23 個 pattern，給了一整代工程師共同的語言。你說「這裡用 factory」，對方立刻知道你的意思。

*Encyclopedia of Agentic Coding Patterns* 把這個傳統延伸到 agentic 時代。但這本書有一個書中明確指出、而且很有說服力的觀點：**pattern language 在 agent 時代比以前更重要，不是更不重要**。

原因是這樣的。看這兩個給 agent 的指令：

> 「把這個拆成更小的部分，讓它更容易修改。」

> 「用 Decomposition 把資料獲取邏輯和顯示邏輯分開，並讓兩個 component 之間的 Coupling 保持低。」

兩個指令要求的是同一件事。但第二個指令產出更好的工作，而且是穩定地更好——因為它精確。Agent 知道 decomposition 在結構上是什麼意思，知道 low coupling 需要什麼條件。它不需要猜測。

Patterns 給你的，是更快抵達判斷的路徑。你更快認出眼前的情況，更快想起有效的解法，而且當輸出有問題，你有語言去說清楚問題是什麼。

## 一本有 190 個條目的地圖

這本書收錄約 190 個 pattern、antipattern 和概念，從最上層的產品策略，到最底層的 agent 控制機制，分為 13 個章節。章節的順序是刻意設計的：每個章節建立下一個章節需要的詞彙。

**Product Judgment and What to Create** 從問題本身開始：要建什麼？為誰？為什麼重要？書裡有一句話說得直白——「跳過這些問題是軟體裡最貴的錯誤」。這個章節的 pattern 包括 Problem、Customer、Value Proposition、User Story、Build-vs-Don't-Build Judgment。

**Intent, Scope, and Decision-Making** 把模糊的目標變成可以執行的任務。Requirement、Acceptance Criteria、Spec-Driven Development、Architecture Decision Record。沒有明確的 acceptance criteria，你無法告訴 agent「完成」是什麼樣子，也無法評估它的輸出。

**Structure and Decomposition** 涵蓋 Architecture、Boundary、Cohesion、Coupling、Separation of Concerns。這是軟體建構的骨架。這些概念在 agent 時代依然適用——甚至更重要，因為 agent 需要任務切得夠小、邊界定得夠清，才能有效執行。

**Data, State, and Truth** 說明資訊怎麼被表示、儲存、保持一致。Source of Truth、DRY、Domain Model、Bounded Context。書裡有一句話：「大多數 bug 住在這裡。」

**Correctness, Testing, and Evolution** 從如何確認系統做了它應該做的事，到如何在不破壞現有行為的情況下演化它。TDD、Test Pyramid、Invariant、Regression、Technical Debt、Strangler Fig、Parallel Change。

**Security and Trust** 是這本書特別值得關注的章節。除了傳統的安全概念（Threat Model、Least Privilege、Input Validation），這裡有 agentic 時代才有的攻擊面：

- **Prompt Injection**：攻擊者在 agent 會讀到的內容裡嵌入指令，讓 agent 執行非預期的操作。
- **Tool Poisoning**：在 agent 可用的工具的描述裡注入惡意指令。
- **RAG Poisoning**：污染 agent 檢索的知識庫。
- **Adversarial Cloaking**：用對人類不可見但 LLM 可讀的方式隱藏惡意內容。

**Agentic Software Construction** 是這本書最獨特的章節，描述 agentic 工作流程特有的概念：Context Window、Context Rot（context 隨著對話拉長而漂移）、Context Engineering（主動管理 context 品質）、Subagent、Parallelization、Worktree Isolation、Verification Loop、Steering Loop。

**Agent Governance and Feedback** 處理一個核心問題：agent 自主執行時，人的角色是什麼？Approval Policy、Human in the Loop、Bounded Autonomy，以及幾個重要的 antipattern：

- **Approval Fatigue**：agent 頻繁要求人工確認，人開始自動按 yes，安全機制形同虛設。
- **Dark Factory**：完全不需要人工介入的 agent 系統，聽起來很酷，但沒有任何人知道它在做什麼。
- **Agent Sprawl**：越來越多 agent 跑起來，但沒有人知道全貌。

## 五條學習軌道

書裡提供了五條 curated 的閱讀路徑，針對不同背景的人：

**Track 1：Your First Day with an AI Agent**（8 個條目）從 Model 開始，然後 Prompt、Context Window、Agent、Tool、Instruction File、Verification Loop、Human in the Loop。建立對 agent 是什麼、怎麼工作的基本心智模型。

**Track 2：Building Things That Work**（12 個條目）Problem → Requirement → Architecture → Component → Interface → Boundary → Cohesion → Coupling → Abstraction → Separation of Concerns → Decomposition → Test。給從來沒有系統學過軟體設計基礎的人。

**Track 3：Keeping Software Honest**（10 個條目）從 Invariant 到 Sandbox，涵蓋測試與安全。「Correctness isn't just about bugs」是這條軌道的關鍵洞察。

**Track 4：Mastering the Agentic Workflow**（12 個條目）給已經有基礎、想更有效使用 agent 的人。從 Context Engineering（書裡說這是「agentic 工作中最高槓桿的單一技能」）開始，經過 Compaction、Thread-per-Task、Subagent、Parallelization、Plan Mode、Skill、Hook、Memory、Worktree Isolation，到 Approval Policy 和 Eval。

**Track 5：From Idea to Product**（10 個條目）從 Problem 到 Observability，橫切整本書，追蹤一個 raw idea 變成 deployed software 的完整路徑。

## 這本書本身就是一個示範

有一件事讓這本書與眾不同：**它是由它自己描述的那些 pattern 所建造的**。

一個自主改進引擎負責研究主題、撰寫文章、編輯現有內容，並把更新部署到 live site——全部在一個持續的迴圈裡自動運行，不需要任何人按下按鈕。

這個引擎的架構就是書裡教的那些東西：

- **Steering Loop**：每個 cycle 觀察書的狀態，決定最有用的下一步（研究新主題、撰寫文章、編輯舊文、重組結構、部署），然後執行，然後繼續。
- **Feedforward**：每個 cycle 開始前，引擎載入最新的 style guide、文章模板、當前任務相關的 context。它每次都重新讀規則，不是從記憶裡取。
- **Feedback Sensor**：引擎追蹤什麼工作做了、什麼沒做、什麼最久沒被碰到，用來決定優先順序。
- **Verification Loop**：每次部署前，build 網站並檢查 broken links。如果 build 失敗，修好再 commit。
- **Instruction File + Memory**：規則用版本控制的文件記錄，知識在 cycle 之間用 memory 保持。
- **Eval**：引擎對自己的文章做品質評估，用和書裡描述相同的方法。

最不尋常的部分不是它會寫和編輯，而是**它會評估自己的過程，然後改變它**。引擎定期讀取自己的 activity log，檢查各類工作是否均衡，找出問題——research 積壓、文章沒被 review、某類任務已經沒有東西可以做。當它找到問題，它診斷原因，然後改寫它未來 cycle 會遵循的 procedure。

書裡記錄了幾個這樣的歷史：引擎早期花太多時間 research，idea 積壓比寫作快，它發現不平衡，調整優先順序，然後矯枉過正，idea pipeline 乾涸，再次評估，再平衡——兩次才找到均衡。還有一次它寫了一個規則，但規則裡有一個指向錯誤 step 的 mislabeled reference，規則從來沒有正確觸發，下一個 evaluation cycle 發現了錯誤，追蹤到 mislabel，改寫規則，並加了一個 logging requirement，確保這類錯誤未來可以被發現。

這不是 gimmick。它是把書本身當作 proof of concept。

## 這本書適合誰

書裡說有三種人正在聚合到同一個需求：

**Nontraditional builders**：第一次有機會參與軟體建造。你不需要會寫 for loop，但你需要理解為什麼 separation of concerns 重要，什麼是 test，以及如何評估 agent 交出來的東西是否解決了你問的問題。

**Developers whose role is shifting**：你已經知道這些材料的大部分。改變的是工作流程——你在 directing agents、在更高的抽象層設計系統，讓實作在你下面發生。這本書把你已有的基礎連接到 agentic 工作流，並填補你在工作中學到的、而非從第一原理學到的那些空缺。

**Team leads, product managers, founders**：你在指導和評估工作。在 agent loop 裡，指導的品質直接決定輸出的品質。一個能用 boundary、invariant、acceptance criteria 表達需求的 PM，會從 agent-augmented 的團隊拿到更好的結果。

## 整體來說

這本書的核心取捨是廣度換深度。190 個條目意味著每個條目不會有完整的實作細節，更多是概念定義、力量分析、橫向連結。它的價值在於給你一張地圖：知道有哪些問題值得問，有哪些 pattern 值得認識，有哪些 antipattern 值得避開。

Agent 是放大器。這本書的目標，是讓被放大的東西值得被放大。

---

## 參考資料

- [Encyclopedia of Agentic Coding Patterns — 190 個 Agentic Coding 設計模式完整指南](https://aipatternbook.com/)
- [A Pattern Language — Christopher Alexander (1977)](https://en.wikipedia.org/wiki/A_Pattern_Language) — Agentic Coding Patterns 的設計哲學來源
- [Design Patterns: Elements of Reusable Object-Oriented Software (GoF)](https://en.wikipedia.org/wiki/Design_Patterns) — Agentic Coding Pattern Language 的軟體工程前身
- [Claude Code — Anthropic 的 Agentic Coding CLI 工具](https://docs.anthropic.com/en/docs/claude-code/overview)
