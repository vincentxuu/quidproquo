---
title: "深入 Codex Agent Loop：OpenAI 如何讓 AI Agent 持續迭代工作"
date: 2026-04-21
category: ai
tags: [codex, agent-loop, openai, responses-api, prompt-caching, context-window]
lang: zh-TW
tldr: "OpenAI 詳解 Codex 的 agent loop 設計：prompt 如何建構、multi-turn 對話如何管理、prompt caching 如何避免成本爆炸，以及 context window 自動壓縮的實作。"
description: "從 OpenAI 第一手工程文章拆解 Codex agent loop 的運作方式，涵蓋 prompt 建構順序、tool call 執行流程、prompt caching 策略，以及 auto-compact 機制，適合正在實作 AI agent 的工程師。"
draft: false
---

OpenAI 工程師 Michael Bolin 在 2026 年 1 月發表了一篇詳細的技術文章，解釋 Codex CLI 背後的 agent loop 是如何運作的。這篇文章整理了其中幾個工程上最有意思的設計決策：prompt 的建構順序、multi-turn 對話的管理方式、如何用 prompt caching 控制成本，以及當 context window 快撐不住時怎麼辦。如果你正在打造自己的 AI agent，這些設計思路值得認真看。

## Agent Loop 的基本結構

Codex 的 agent loop 並不複雜，可以用一個迴圈描述：

1. 收到 user input
2. 建構 prompt（把所有必要資訊組裝進去）
3. 呼叫 Responses API 做 inference
4. 如果模型回傳的是 tool call，執行它、把結果 append 到對話，回到步驟 3
5. 如果模型回傳的是 assistant message，這個 turn 結束

這個設計本身沒有什麼新鮮的，標準的 ReAct 架構都是這樣。但有趣的地方在於每個步驟的細節。

## Prompt 的建構順序

每次進入 agent loop，Codex 都會從頭把整個 prompt 組裝起來，順序是固定的：

**System message（instructions）**：放在最前面，內容是 model-specific 的指令。不同版本的 Codex 模型對格式和指令風格有不同的期望，所以這部分會依照使用的模型客製化。

**Tools 定義**：把所有可用工具的 schema 放進來，包括 `shell`（執行指令）、`update_plan`（更新任務計畫）、`web_search`，以及任何外掛的 MCP tools。

**Input items**：這是實際的對話內容，依序包含：
- `permissions message`（role 為 `developer`）：宣告模型在這個 sandbox 環境裡有哪些操作權限
- `developer_instructions`：從 `config.toml` 讀取的開發者設定
- `user instructions`：從專案目錄聚合的 `AGENTS.md` 內容，讓模型了解這個專案的慣例
- `environment_context`：目前的工作目錄和 shell 狀態
- `user message`：使用者實際輸入的內容

這個順序本身就是一種設計選擇。把 permissions 和 developer instructions 放在 user message 之前，確保模型在處理使用者請求時已經有足夠的 context。`AGENTS.md` 的聚合機制也很實用：它會往上找父目錄的 `AGENTS.md`，讓 monorepo 可以在 repo 根目錄放通用規則，各子專案再放自己的規則。

## Multi-Turn 的成本問題

Agent loop 每次 inference 都帶著整個對話歷史，這是正確的做法（模型需要 context），但代價是 prompt 會越來越長。如果是一個執行十幾個 tool call 的任務，到後面的幾次 inference，輸入 token 數可能已經是一開始的好幾倍。

Codex 選擇**不使用** `previous_response_id`（這是 Responses API 提供的有狀態對話管理功能）。原因是維持 stateless 可以支援 Zero Data Retention（ZDR）政策，這對企業客戶很重要。每次 inference 都完整帶上歷史，API 端不需要記住任何東西。

代價就是每次都要傳完整的 prompt，成本看起來是 O(n²)——第一輪 1 個 token，第二輪 2 個，第三輪 3 個……加起來是二次方級別的成長。

## Prompt Caching 如何拯救成本

這裡 prompt caching 就是關鍵的解法。Responses API 會對 prompt 的前綴做快取，如果相鄰兩次 inference 的 prompt 前綴完全相同，後面新增的部分才需要實際計算，之前的部分直接用快取。

這樣成本就從 O(n²) 降回 O(n)：每次 inference 只有新增的那段需要付完整的 token 費用，之前已經 cache 住的前綴幾乎是免費的。

**但前綴必須完全相同才能 cache hit**，這個限制帶出了幾個常見的陷阱：

- **Mid-conversation 修改 tools**：如果在對話中途插入或移除工具，tools 定義就變了，cache 就失效了。從那一刻起每次 inference 都要付完整費用。
- **切換 model**：不同模型的 instructions 不同，前綴不同，cache miss。
- **修改 sandbox 設定**：permissions message 或 environment_context 改變，同樣會破壞 cache。

Codex 的解法很優雅：任何 mid-conversation 的設定變更，都不修改已有的 message，而是 **append 一條新的 message** 來宣告這個變更。這樣 prompt 前綴保持不變，cache 繼續有效，只有最新 append 的部分是新的計算。

這個原則值得記住：**append-only，不要修改**。

## Context Window 滿了怎麼辦

再長的 context window 也有上限。當對話歷史累積到快超過 token 上限時，Codex 會呼叫一個特殊的 `/responses/compact` endpoint。

這個 endpoint 的工作是把現有的對話歷史壓縮成一個 **compaction item**。這個壓縮後的 item 裡面包含一個加密的 latent understanding——模型對目前對話狀態的「理解」，以一種緊湊的形式儲存起來。後續的 inference 用這個 compaction item 取代原本的長歷史，context window 就騰出空間了。

這個機制的設計重點是**對使用者透明**：壓縮發生在背景，agent 繼續工作，使用者不會感知到中斷。同時因為 compaction item 是加密的，它也支援 ZDR 政策——即使壓縮後的狀態儲存在某處，也無法被讀取或還原。

## 整體來說

Codex agent loop 的設計核心是在幾個互相競爭的目標之間找平衡：

- **Stateless vs. 成本**：不用 `previous_response_id` 換來 ZDR 支援，但靠 prompt caching 把 O(n²) 的成本壓回 O(n)
- **靈活性 vs. cache 效率**：允許 mid-conversation 設定變更，但要求用 append 而非修改的方式，確保 cache 前綴穩定
- **無限任務 vs. context 限制**：用 auto-compact 讓 agent 可以處理超長任務，同時維持 ZDR 相容性

對於要自己實作 AI agent 的工程師，這套架構有幾個值得直接借鑑的實踐：prompt 建構順序的固定化、append-only 的 mid-conversation 更新策略，以及把 compaction 做成背景透明操作而非使用者感知的中斷。

---

## 參考資料

- [Unrolling the Codex agent loop — OpenAI](https://openai.com/index/unrolling-the-codex-agent-loop/)（Michael Bolin，2026 年 1 月 23 日）
