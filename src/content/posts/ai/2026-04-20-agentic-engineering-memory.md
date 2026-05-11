---
title: "Agentic Engineering 的記憶問題：從類型、實作到擁有權"
date: 2026-04-20
type: guide
category: ai
tags: [agentic-engineering, memory, langmem, agent-harness, context-engineering, multi-agent]
lang: zh-TW
tldr: "Agent 的記憶不是一個插件，而是 harness 本身的一部分。選對記憶類型、估算資料量、再決定用什麼技術——最後，也要搞清楚你是否真的擁有那份記憶。"
description: "從 Procedural/Episodic/Semantic 三種記憶類型出發，拆解 Agentic Engineering 的記憶實作選項，包含 LangMem 的優缺點、記憶量估算方式，以及開源 vs 封閉 harness 的擁有權問題。"
draft: false
series:
  name: "AI Agent 實戰"
  order: 7
---

Cisco 工程師今年四月在 LangChain blog 發了一篇文章，描述他們如何用多 agent 協作系統把 debug 工作流的 time-to-root-cause 縮短 93%，一個月省下 200 多人工小時。他們用的技術棧：LangGraph + LangSmith + LangMem。

其中最常被略過的是 **LangMem**。大家看到漂亮的數字就直接衝去看 LangGraph，但記憶系統才是讓 agent 能跨 session 積累知識的關鍵。沒有它，每次呼叫都是失憶的開始。

這篇想把 Agentic Engineering 的記憶問題從頭梳理一次——從類型、實作、到一個更根本的問題：**你擁有這份記憶嗎？**

---

## 記憶存在哪一層？

LangChain 創辦人 Harrison Chase 在最近的文章裡提出一個清晰的三層模型：

```
Model Layer    → 模型權重本身（需要微調才能改）
Harness Layer  → 驅動 agent 的程式碼與固定指令
Context Layer  → 外部可配置的指令與記憶  ← 大多數人說的「記憶」
```

以 Claude Code 為例：
- **Model**：claude-sonnet
- **Harness**：Claude Code 本身（原始碼洩漏時有 512k 行）
- **Context**：CLAUDE.md、/skills、mcp.json

大多數「記憶實作」都是在解決 **Context Layer** 的問題，不是 Model 或 Harness。這個層的記憶，可以讀、可以寫、可以隨時間演化——這也是 LangMem 等工具存在的原因。

---

## 三種記憶類型

在決定用什麼技術之前，先釐清你要存什麼：

| 類型 | 是什麼 | 例子 | 適合的檢索方式 |
|------|-------|------|--------------|
| **Procedural** | 行為規則與偏好 | 「這個 repo 不用 mock」、CLAUDE.md | 全部載入 system prompt |
| **Episodic** | 帶時間戳的事件 | 「上次 debug 結果是 DB timeout」 | recency + relevance |
| **Semantic** | 去脈絡化的事實 | 「這個團隊用 Postgres」 | 語意相似度 |

這三種類型的更新頻率和生命週期完全不同：
- **Procedural** 數量少、長期有效，幾乎不會過期
- **Episodic** 產生快、30–90 天後衰減
- **Semantic** 中量、被新資訊覆蓋時才更新

---

## 實作選項對照

| 方案 | 適合記憶類型 | 複雜度 | 擁有權 |
|------|------------|-------|-------|
| **純文字檔**（CLAUDE.md / progress.txt） | Procedural | 最低 | 完全 |
| **Redis / KV store** | Episodic（短期） | 低 | 完全 |
| **Postgres + pgvector** | 三種都行 | 中 | 完全 |
| **LangMem** | 三種都行 | 低（封裝好） | 完全（可換後端）|
| **封閉 API**（Claude Managed Agents 等） | 三種都行 | 最低 | **不擁有** |

選擇的決策點只有兩個：

**記憶量多大？**
- 幾百筆以內 → 純文字或 Redis 就夠
- 幾萬筆以上 → 需要向量搜尋

**需要語意理解嗎？**
- 「找跟這次 bug 類似的過去案例」→ 需要向量搜尋
- 「找上次這個 repo 的執行紀錄」→ key-value 就夠

---

## 記憶量估算

估算分三個維度：

**每筆大小**
- Procedural：100–500 bytes
- Episodic：1–5 KB
- Semantic：500B–2 KB

**產生速率**（保守估算）
```
日活 100 users × 3 sessions/user × 5 筆/session
= 1,500 筆/天 = 45,000 筆/月
```

**向量儲存換算**
```
1 筆記憶 ≈ 1 個向量（1536 維）= 6 KB（向量）+ 2 KB（原文）≈ 8 KB
500K 筆 = 4 GB
```

這個量級用 pgvector 完全夠，不需要 Pinecone 或 Qdrant 等專屬向量 DB。

**最容易忽略的問題不是空間，是檢索精度隨量下降。** 記憶超過 10K 筆後，向量搜尋的結果開始混入不相關記憶，這時候需要：
- metadata filter（限定 user_id、時間範圍）
- 記憶衰減（Episodic 舊記憶降低權重）
- 摘要壓縮（多筆 Episodic 合併成一筆 Semantic）

---

## LangMem 能解決什麼？

LangMem 是開源函式庫（Apache 2.0，免費），本質是**向量 DB + 自動摘要的封裝**。

它幫你解決的：
- 語意搜尋（內建向量 store，可換後端）
- 自動去重與合併
- 用 LLM 從對話中自動萃取記憶
- 多筆 Episodic 壓縮成 Semantic

它解決不了的：
- metadata filter 的 schema 設計（要自己來）
- 記憶衰減權重（沒有內建機制）
- 多 agent 並發寫入的一致性問題

**實際適用規模**：< 50K 筆、單一 user/agent 的情境，LangMem 開箱即用已經夠。超過這個量或需要多 tenant，還需要在上層自建治理邏輯。

費用方面，LangMem 本身免費，但每次 session 結束後會呼叫 LLM 萃取記憶：

```
100 users × 3 sessions/天 × ~1K tokens/次
= 300K tokens/天
≈ Claude Haiku 約 $0.1/天
```

用便宜模型做記憶萃取、貴的模型做主要任務，是標準做法。

---

## 記憶的更新時機

記憶不只是被動存取，它可以主動演化：

**線上更新（hot path）**：agent 執行中途決定更新記憶，適合 Episodic（即時事件）。

**離線更新（offline job）**：跑完一批 traces 後批次萃取洞見，適合 Procedural（規則更新）。OpenClaw 稱之為「Dreaming」——agent 閒置時自動回顧歷史、更新自己的長期記憶，下次啟動就更聰明。

---

## 記憶的擁有權問題

這是 Harrison Chase 在「Your harness, your memory」裡提出的核心警告，也是最容易被忽略的一點：

> 「記憶不是插件，它是 harness 本身的一部分。」

問題在這裡：
- 用 **Claude Managed Agents**（Anthropic API）→ 記憶完全在 Anthropic 伺服器，你看不到、帶不走
- 用 **Codex**（OpenAI）→ 壓縮摘要加密，無法在 OpenAI 生態外使用
- 用**開源 harness**（LangGraph + 自建 store）→ 記憶完全在你手上

這不只是技術選擇，而是商業決策。記憶是讓 agent 越用越好的資產，是你的用戶偏好、工作習慣、過去決策的累積。**把這份資產放在別人的平台上，就是讓對方握有你最深的鎖定籌碼。**

封閉 API 讓你快速上手，但記憶被鎖定；開源 harness 需要自己維護，但記憶真正屬於你。

---

## 整體來說

Agentic Engineering 的記憶問題，不是選一個記憶函式庫就結束的事。

正確的思考順序是：

1. **決定記憶類型**：要存規則（Procedural）、事件（Episodic）還是事實（Semantic）？
2. **估算資料量**：幾百筆用文字檔，幾萬筆以上才需要向量搜尋
3. **選擇實作方案**：LangMem 是好的起點，但不是終點
4. **考慮擁有權**：你選的 harness 決定你對記憶有多少控制權

記憶讓 agent 越用越好，但前提是你真的擁有它。

---

## 參考資料

- [Agentic Engineering: How Swarms of AI Agents Are Redefining Software Engineering](https://www.langchain.com/blog/agentic-engineering-redefining-software-engineering)
- [Your harness, your memory — Harrison Chase](https://www.langchain.com/blog/your-harness-your-memory)
- [Continual learning for AI agents — Harrison Chase](https://www.langchain.com/blog/continual-learning-for-ai-agents)
- [Building effective agents — Anthropic](https://www.anthropic.com/research/building-effective-agents)
