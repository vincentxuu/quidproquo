---
title: "Context Engineering：為什麼你的 AI Agent 問題出在資訊，不在模型"
date: 2026-03-24
category: ai
tags: [context-engineering, prompt-engineering, ai-agents, rag, memory, agentic-ai]
lang: zh-TW
tldr: "Context Engineering 是 2025 年取代 Prompt Engineering 的核心概念：重點不再是「怎麼問」，而是「給什麼資訊」。把對的資訊在對的時機送進 context window，比換更強的模型更有效。這篇整理了定義、四大策略、實作技巧和常見失敗模式。"
description: "深入解析 Context Engineering 的定義、起源、核心策略（Write、Select、Compress、Isolate），以及 Anthropic、LangChain、Karpathy 等人的實作建議。"
draft: false
---

2025 年中，AI 工程圈突然集體換了一個詞。

Shopify CEO Tobi Lütke 先開槍：

> I really like the term 'context engineering' over prompt engineering. It describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM.

三天後 Andrej Karpathy 跟進：

> Context engineering is the delicate art and science of filling the context window with just the right information for the next step.

Simon Willison 最後補刀：prompt engineering 的「inferred definition」已經被大眾理解成「跟 chatbot 聊天的小技巧」，而 context engineering 這個名字自帶正確的暗示——這是一件嚴肅的工程。

名字變了，但重點是：**思維模型變了。**

---

## 從 Prompt 到 Context：到底差在哪

**Prompt Engineering** 的心智模型是：怎麼寫出一句好指令，讓模型給出最好的回答。你在調的是**措辭**。

**Context Engineering** 的心智模型是：怎麼在執行時建構出一整個資訊環境，讓模型在做決策時有足夠的背景。你在設計的是**系統**。

```
Prompt Engineering        Context Engineering
─────────────────        ──────────────────
一條指令                   一整個資訊環境
靜態文字                   動態組裝
一次呼叫                   多輪迴圈
手動調詞                   架構設計
```

Prompt engineering 現在是 context engineering 的一個子集——寫好 system prompt 仍然重要，但在生產級 agent 系統中，prompt 只占 context window 的一小部分。

LangChain CEO Harrison Chase 的診斷原則很直接：

> 如果你的 agent 表現不穩定，問一個問題就好——「LLM 在做這個決策的當下，有足夠的資訊和工具嗎？」十之八九，答案是沒有。

**大部分 agent 的失敗是 context 的失敗，不是模型的失敗。**

---

## Context Window 裡放什麼

一個 agent 的 context window 在任何一個時間點，大概長這樣：

```
┌──────────────────────────────────────────────┐
│               Context Window                  │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ System Prompt │  │ Tool Definitions      │ │
│  │ 角色、規則、   │  │ 工具名稱、描述、       │ │
│  │ 輸出格式      │  │ 參數 schema           │ │
│  └──────────────┘  └───────────────────────┘ │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Memory       │  │ RAG Results           │ │
│  │ 長期記憶、    │  │ 從知識庫檢索的         │ │
│  │ 使用者偏好    │  │ 相關文件片段           │ │
│  └──────────────┘  └───────────────────────┘ │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Conversation │  │ Task State            │ │
│  │ 對話歷史      │  │ 進度、中間結果、       │ │
│  │              │  │ scratchpad 筆記       │ │
│  └──────────────┘  └───────────────────────┘ │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Few-shot     │  │ Environment           │ │
│  │ Examples     │  │ 當前時間、使用者資訊、  │ │
│  │ 範例示範      │  │ 檔案系統狀態           │ │
│  └──────────────┘  └───────────────────────┘ │
└──────────────────────────────────────────────┘
```

每一個區塊都有工程決策：要放多少？什麼時候放？放哪個版本？超出預算時先砍哪個？

---

## 四大策略：Write、Select、Compress、Isolate

LangChain 把 context engineering 整理成四個操作：

### 1. Write — 把資訊存到 context window 外面

不是所有資訊都要即時放進 context。先存起來，需要時再拉。

**Scratchpad（草稿本）**
Agent 在執行過程中自己做筆記。例如 Claude Code 的 `TodoWrite` 就是一種 scratchpad——agent 把任務進度寫下來，後續步驟可以參考。

**Memory（記憶）**
跨 session 的持久記憶。三種類型：
- **Episodic**：發生過的事（「上次用戶要求 JSON 格式」）
- **Semantic**：事實知識（「這個專案用 TypeScript + Hono」）
- **Procedural**：怎麼做某件事（「部署流程是 build → test → push」）

關鍵原則：**Write 是延遲的 Select。** 你現在存的東西，是為了未來某個時刻能被精確地拉回 context。

### 2. Select — 把對的資訊拉進 context window

從所有可用的資訊來源中，挑出當下最相關的。

**從記憶中選取**
用 embedding 搜尋相關的歷史記憶，注入 context。不是把所有記憶都塞進去，而是只選跟當前任務相關的。

**從工具中選取**
當你有 50 個工具，不需要每次都把 50 個工具的定義全塞進 context。可以用 RAG 對工具描述做語意搜尋，只掛載相關的工具。

**從知識庫中選取**
這就是 RAG 的核心——根據查詢從向量資料庫、知識圖譜中檢索相關文件片段。

**混合策略**
最有效的方式通常是「前置載入 + 執行時探索」：
- 前置載入：一開始就塞入的固定 context（system prompt、核心工具）
- 執行時探索：agent 根據需要動態拉取（RAG、記憶檢索、檔案讀取）

### 3. Compress — 只保留關鍵 token

Context window 有限。隨著對話進行，累積的 token 會越來越多。

**摘要壓縮**
Claude Code 的做法：當 context 使用量達到 95%，自動觸發壓縮，把舊的對話歷史摘要成更短的版本。保留架構決策和未解決的問題，丟棄冗餘的工具輸出。

**修剪規則**
用硬編碼的規則裁切——例如只保留最近 N 輪對話，或刪除工具呼叫的完整輸出只留摘要。

**為什麼壓縮很重要？**
Anthropic 指出一個反直覺的現象：context 越長，品質不一定越好。LLM 的注意力機制是 O(n²) 的——每多一個 token，它需要跟所有其他 token 計算相關性。**注意力是有預算的**，不相關的 token 會稀釋對重要資訊的關注。

> Find the smallest set of high-signal tokens that maximize likelihood of desired outcome.
> — Anthropic

### 4. Isolate — 把 context 隔離到不同的空間

當一個 context window 裝不下，或者不同任務需要不同的 context，就拆開。

**Multi-agent 隔離**
主 agent 把子任務委派給 sub-agent。每個 sub-agent 有自己乾淨的 context window，專注做一件事，完成後只回傳精簡的摘要（1,000-2,000 tokens）給主 agent。

**沙盒隔離**
程式碼執行放在 sandbox 裡（E2B、Docker），結果用結構化格式回傳，不把整個執行環境塞進 context。

**State Schema 隔離**
LangGraph 的做法：用 typed state fields 把不同類型的 context 分開管理，只在需要的節點才注入特定的 state。

---

## Anthropic 的實作建議

Anthropic 發了一篇 [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，提出幾條實戰原則：

### System Prompt 架構化

不要寫一大段自然語言。用 XML tags 或 Markdown headers 分成清晰的區塊：

```markdown
## 角色
你是一個資深的全端工程師...

## 行為規則
- 修改檔案前先讀取完整內容
- 不確定時問使用者，不要猜
- ...

## 輸出格式
回答包含：結論、程式碼、注意事項

## 工具使用指南
- 搜尋檔案用 Glob，不用 find
- 讀取檔案用 Read，不用 cat
```

關鍵是「right altitude」——既要夠具體能引導行為，又要夠靈活讓 agent 有判斷空間。避免寫成窮舉式的 if-else。

### 工具設計是 Context Engineering

工具的名稱、描述、參數 schema 全都是 context 的一部分。設計原則：

- **自包含**：每個工具的描述應該足以讓 agent 知道「什麼時候用」和「怎麼用」
- **最小重疊**：工具之間功能不要太接近，否則 agent 會選錯
- **錯誤友善**：回傳清楚的錯誤訊息，讓 agent 能自我修正
- **數量克制**：超過 20 個工具會明顯增加選擇錯誤的機率

### Just-In-Time 載入

不要預先塞進所有可能需要的資訊。保留輕量的指標（檔案路徑、URL、查詢語句），讓 agent 在需要時自己去拉。

```
❌ 把整個 API 文件塞進 system prompt
✅ 告訴 agent 文件在哪，讓它用工具查
```

這就是 **progressive disclosure（漸進式揭露）**——讓 agent 像開發者一樣自主探索，而不是一開始就信息轟炸。

### Agent 自己做筆記

對於長時間任務，讓 agent 維護結構化的外部筆記：

```
project/
├── progress.txt      # 當前進度和下一步
├── decisions.md      # 重要的架構決策和原因
└── context.json      # 累積的上下文
```

這跟 [Anthropic 的 Harness Design](/posts/ai/2026-03-28-anthropic-harness-design) 中 `claude-progress.txt` 的做法一致——把狀態外部化到檔案系統。

---

## Context 的六種類型

整理一下 context window 裡的資訊分類：

| 類型 | 說明 | 範例 |
|------|------|------|
| **Instructional** | 規則和約束 | System prompt、行為指南 |
| **Dynamic** | 即時資訊 | 當前時間、使用者輸入、API 回應 |
| **Historical** | 歷史紀錄 | 對話歷史、之前的決策 |
| **Retrieval-based** | 檢索結果 | RAG 文件片段、知識庫 |
| **Environmental** | 環境狀態 | 工具定義、檔案系統、可用 API |
| **Exemplary** | 範例示範 | Few-shot examples |

每種類型的管理策略不同：Instructional 相對靜態，Dynamic 每次都更新，Historical 需要定期壓縮，Retrieval-based 依賴搜尋品質。

---

## 常見失敗模式

| 失敗模式 | 症狀 | 修復 |
|---------|------|------|
| **Context 超載** | Agent 忽略重要指令、回答品質下降 | 壓縮、隔離、JIT 載入 |
| **Context 不足** | Agent 缺乏背景、反覆問已知資訊 | 加入 memory、改善 RAG |
| **Context 噪音** | 找到文件但不相關、推理走偏 | Reranking、metadata filter |
| **Context 衝突** | 多個來源互相矛盾 | 標記來源和可信度、排序 |
| **Context 過期** | 用了舊資訊做決策 | Timestamp 機制、定期更新 |
| **工具描述模糊** | Agent 不知道何時用什麼工具 | 重寫工具描述、加範例 |
| **記憶缺失** | 每次對話都從零開始 | 加入 episodic memory |

最常見的反模式是「Context 超載」——直覺認為「給越多資訊越好」，但實際上不相關的 token 會稀釋注意力，降低整體品質。**少即是多，精準即是力量。**

---

## 跟三階段演化的關係

Context Engineering 在 [AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)中處於承先啟後的位置：

```
Phase 1: Prompt Engineering（2022-2024）
   └─ 優化「怎麼問」
   └─ 解決：模型聽不懂 → 換個說法

Phase 2: Context Engineering（2025）    ← 你在這裡
   └─ 優化「給什麼資訊」
   └─ 解決：模型缺資訊 → 補上相關知識

Phase 3: Harness Engineering（2026）
   └─ 優化「整個執行環境」
   └─ 解決：模型長時間失控 → 設計約束和回饋系統
```

Context Engineering 是 Harness Engineering 的基石。你可以有最精密的 harness 架構，但如果每一步的 context 品質不好，agent 的每一個決策都會偏差。

---

## 實作 Checklist

如果你正在建 agent 系統，按這個順序檢查：

1. **System prompt 有結構嗎？** 用 sections 分區，不要寫成流水帳
2. **工具描述夠清楚嗎？** 每個工具的「什麼時候用」和「怎麼用」都明確
3. **有 memory 機制嗎？** 至少有跨 turn 的 scratchpad，理想上有跨 session 的長期記憶
4. **RAG 檢索品質如何？** 有 reranking 嗎？chunk size 合理嗎？
5. **有壓縮策略嗎？** 長對話不會把 context window 撐爆？
6. **有隔離機制嗎？** 複雜任務有 sub-agent 分擔？
7. **Token 預算有管理嗎？** 預留足夠空間給生成（至少 30%）
8. **有 JIT 載入嗎？** 不是一開始就把所有東西塞進去？

---

## 整體來說

Context Engineering 不是一個新潮的名詞替換，而是一次思維模型的升級。

Prompt engineering 教你寫好一句話。Context engineering 要你設計一整個資訊系統——什麼資訊從哪裡來、什麼時候進入 context、以什麼格式呈現、什麼時候該壓縮或丟棄。

Karpathy 的比喻最到位：LLM 是 CPU，context window 是 RAM。你不會把硬碟裡所有東西都載入記憶體，你會精心管理什麼時候載入什麼。Context engineering 就是這個記憶體管理的藝術。

如果你的 agent 表現不穩定，先別急著換模型。回頭看看它在做決策的那個時刻，context window 裡到底有什麼——答案幾乎都在那裡。

---

## 延伸閱讀

- [AI Agent 的三個核心支柱：Context、Cognition、Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — Context 在 Agent 架構中的角色
- [從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution) — Context Engineering 在演化中的定位
- [Anthropic 的 Harness Design：讓 AI Agent 像工程師一樣工作](/posts/ai/2026-03-28-anthropic-harness-design) — Anthropic 的 context 持久化實作
- [Andrej Karpathy on Context Engineering](https://x.com/karpathy/status/1937902205765607626) — 原始推文
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — 四大策略的完整版
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — 實作指南
- [Simon Willison — Context Engineering](https://simonwillison.net/2025/jun/27/context-engineering/) — 為什麼這個名字比 prompt engineering 好
- [Prompting Guide — Context Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide) — 系統性教程
