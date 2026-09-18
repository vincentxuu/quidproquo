---
title: "四種記憶與六個設計軸：Agent 記憶系統的設計空間"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, context-engineering, coala, design-taxonomy, ai-agent]
series:
  name: "AI Agent 記憶工程"
  order: 1
lang: zh-TW
tldr: "CoALA 框架把 agent 記憶分為 working、episodic、semantic、procedural 四種，但光靠四格分類不夠——同一種記憶在不同系統裡的設計選擇差很大。這篇用六個獨立設計軸（讀取形態、寫入時機、保真度、寫入權、遺忘、範圍）加一條光譜（檔案 ↔ 向量/圖），畫出 2026 年 agent 記憶系統的完整設計空間。"
description: "從 CoALA 四類記憶到六個獨立設計軸與設計哲學光譜，建立理解任何 agent 記憶系統的分析框架。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-19-agent-memory-taxonomy-en)

同一個問題——agent 要記住使用者的偏好——Claude Code 用 Markdown 檔解決，Mem0 用向量資料庫解決，GitHub Copilot 用 KV 儲存加引用驗證解決。三家都在做「記憶」，但底層的設計選擇完全不同。

這不是偶然。agent 記憶是一個六維的設計空間，不是單一技術問題。這篇建立一套分析框架，讓你能描述任何記憶系統的設計選擇，判斷它適不適合你的場景。

## 四種記憶：認知科學到 agent 系統

Princeton 的 CoALA 框架（[Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427)，TMLR 2024）把 agent 記憶分成四類。這個分類被後續幾乎所有記憶系統的論文和產品文件引用，已經是事實上的共同語言。

### Working memory：當前推理用的狀態

就是 context window 裡的東西。你跟 Claude Code 對話的每一輪、它讀過的檔案、跑過的指令輸出，全部都在這裡。

對應的系統元件：context window 本身、LangGraph checkpointer、OpenAI Agents SDK Session、AWS AgentCore events。

Working memory 的特徵是**有容量上限且昂貴**。一旦 context 滿了，就得壓縮或丟棄——這正是[本系列 order 2](/posts/ai/2026-08-21-context-full-seven-answers) 討論的問題。

### Episodic memory：特定時間發生的經驗

「上週二那次對話裡，使用者說他們的 API 在 us-east-1 部署」——這是一段帶時間戳的經驗記錄。

對應的系統元件：對話歷史、Codex 的 rollout summaries、Zep 的 episodes（帶 `created_at` / `expired_at` 時間邊）、AgentCore 的 episodic strategy（含 reflection）、Letta 的 recall memory。

Episodic memory 保留了「什麼時候發生的」這個資訊，這讓它可以做時間推理（「那是改版前還是改版後？」），但也讓它隨時間膨脹。

### Semantic memory：抽離時間的事實與知識

「這個使用者偏好 TypeScript」「公司的 CI 用 GitHub Actions」——從經驗中抽取出來的、不繫於特定時間點的事實。

對應的系統元件：LLM 自動抽取的 facts（Mem0 memories、Memory Bank topics、ChatGPT Saved memories）、知識圖中的實體與關係（Graphiti、Cognee）、Claude Code auto memory 裡的 `type: user` 和 `type: project` 條目。

Semantic memory 的核心操作是**抽取**——從對話中辨識出值得長期保留的事實。這個抽取過程本身就是一個 LLM 呼叫，會引入錯誤。依 Mem0 論文（[2504.19413](https://arxiv.org/abs/2504.19413)，ECAI 2025）的評測，即使在受控環境下，抽取後的記憶在 LoCoMo benchmark 上也只拿到 66.9–68.4 分，低於把完整對話塞進 context 的 72.9 分。抽取換來的是空間，犧牲的是完整性。

想看 semantic memory 的實際應用，可以參考〈[RAG 個性化：從對話中學習使用者偏好](/posts/ai/2026-03-12-memory-personalization)〉。

### Procedural memory：怎麼做事

「遇到 TypeScript 型別錯誤，先跑 `tsc --noEmit` 確認」「PR 標題用 conventional commits 格式」——不是事實，而是行為規則。

對應的系統元件：CLAUDE.md / AGENTS.md / GEMINI.md（人寫的規則檔）、Devin Playbooks、Voyager 的 skill library、Microsoft Foundry 的 procedural memory、OpenAI sandbox memory 的 `skills/` 目錄。

Procedural memory 在 2026 年有個值得注意的趨勢：它跟 Skills 合流了。Gemini CLI 的 Auto Memory 直接產出 SKILL.md 候選檔、Letta 用 skills 取代部分記憶工具、ACE 論文（[2510.04618](https://arxiv.org/abs/2510.04618)，ICLR 2026）用 Generator–Reflector–Curator 演化 playbook。「學會怎麼做」被視為與「記得什麼」同等重要的記憶類型，而承載形式就是可版本控制的 skill 檔。

## 四格分類不夠用

CoALA 的四類記憶告訴你「這是什麼種類的資訊」，但沒有告訴你「這個系統怎麼處理這種資訊」。

同樣是 semantic memory，Mem0 用向量資料庫自動抽取、Claude Code 用 Markdown 檔讓 agent 在 session 中自行決定要不要記。兩者都是 semantic memory，但設計選擇截然不同。

要描述這些差異，需要六個獨立的設計軸。

## 六個設計軸

### 軸一：讀取形態

| 左端 | 右端 |
|---|---|
| always-in-context（每輪都注入） | on-demand retrieval（需要時才檢索） |

CLAUDE.md 和 Letta 的 core memory blocks 永遠在 context 裡——穩定但佔空間。Mem0 和 Memory Bank 的記憶只在檢索命中時才出現——省空間但可能漏掉。

Claude Code 兩者兼有：`MEMORY.md` 索引每次 session 開始注入（always-in-context），主題檔按需讀取（on-demand）。這種混合模式正在成為主流。

### 軸二：寫入時機

| 左端 | 右端 |
|---|---|
| hot-path / inline（對話進行中即時寫入） | background（閒置或離線時批次處理） |

Mem0 的 `add()` 在對話進行時即時抽取。Claude Code 的 auto memory 也在 session 中寫入。

另一端，Codex 的 Memories 明確等閒置 6 小時後才開始抽取（依[官方文件](https://learn.chatgpt.com/docs/customization/memories)的 `min_rollout_idle_hours` 設定，預設 6，範圍 1–48）。OpenAI、Anthropic、Letta 在 2026 上半年不約而同採用「Dreaming」這個詞——指離線背景整併記憶，源自 Letta 的 [sleep-time compute](https://arxiv.org/abs/2504.13171) 概念。

背景寫入的好處是不影響回應延遲，壞處是記憶永遠落後於最新對話。

### 軸三：保真度 × 檢索

| 左端 | 右端 |
|---|---|
| lossless + exact（檔案、git） | lossy + approximate（LLM 抽取 + 向量檢索） |

檔案系統式記憶（CLAUDE.md、Letta MemFS）保留原文，可以 `grep`、可以 `git blame`。向量式記憶（Mem0、Memory Bank）經過 LLM 抽取再嵌入，原文已經不在了。

Zep/Graphiti 介於中間：它抽取實體和關係建成知識圖，但保留了 bi-temporal 時間邊（`created_at` / `expired_at` / `valid_at` / `invalid_at`），矛盾事實被標記失效而非刪除。

保真度的選擇直接影響可除錯性。檔案式記憶壞了你看得到為什麼，向量式記憶壞了你只知道「檢索沒命中」。

### 軸四：寫入權歸屬

| 左端 | 右端 |
|---|---|
| agent 自行管理 | 人類審核或外部程序控制 |

Claude Code 的 auto memory 由 agent 自行決定要不要記。Mem0 的 `add()` 由應用程式碼觸發。兩者都是程式端控制，人類不介入。

另一端，Gemini CLI 的 Auto Memory 把記憶候選放進 inbox，使用者核准才生效。LangSmith Fleet 要求逐條核准。Devin 的 Knowledge Suggestions 從對話回饋自動建議，但也需要使用者點頭。

這條軸在 2026 年變得特別重要，因為記憶是持久化的 prompt injection 攻擊面——MINJA 論文（[2503.03704](https://arxiv.org/abs/2503.03704)，NeurIPS 2025）證明只靠對話就能注入記憶，成功率 >95%。自動寫入越多，攻擊面越大。本系列 order 8 會深入討論。

### 軸五：遺忘機制

| 左端 | 右端 |
|---|---|
| 硬刪（立即移除） | 時態失效（保留歷史但標記過期） |

2025 年大部分系統只有「手動刪」，2026 年終於出現多種遺忘機制：

- **TTL / 未使用過期**：Copilot 28 天未被 JIT 驗證即刪、Codex 30 天未用即棄
- **時間失效**：Graphiti 的 bi-temporal 邊讓舊事實自動失效但保留歷史
- **排名衰減**：Mem0 的 recency decay 讓舊記憶在檢索排名中下沉
- **重新合成覆蓋**：Dreaming 背景整併時產出新版記憶，舊版被覆蓋
- **硬刪**：Mem0 的 `delete` / `batch_delete` / `delete_all`

但沒有任何系統實作了 MemoryBank 論文（[2305.10250](https://arxiv.org/abs/2305.10250)，AAAI 2024）提出的 Ebbinghaus 式遺忘曲線——根據記憶被存取的頻率動態調整衰減速率。

### 軸六：範圍

| 左端 | 右端 |
|---|---|
| per-thread（單一對話） | per-org（整個組織共享） |

```
per-thread → per-session → per-user → per-project → per-agent → per-org
```

Claude Code 的 auto memory 以 repo 為單位（per-project）、不跨使用者。GitHub Copilot 有 repo-level memory（有寫入權的貢獻者共享）和 user-level preferences。Devin 的 Knowledge 是 org scope。AWS AgentCore 用 namespace 模板 `{actorId}/{sessionId}/{memoryStrategyId}` 加最多 5 個自訂 key，搭配 IAM condition key 做租戶隔離。

跨使用者 / 團隊共享是 2026 年的分水嶺：Copilot repo-level memory、Devin org Knowledge、Gemini CLI repo GEMINI.md 走 git、Supermemory Company Brain 往共享走；消費端（ChatGPT / Claude.ai）嚴格個人。

## 設計哲學光譜

六個軸是分析工具，但實務上最常被問到的問題更簡單：**由誰掌握記憶的形態？**

從左（人類可讀、可版本控制的檔案）到右（全自動抽取的向量 / 圖，人類看不到中間態）：

```
檔案即記憶                                              全自動向量 / 圖記憶
（人可讀、git 可管）◄────────────────────────────────►（自動抽取、人看不到中間態）
```

| 位置 | 代表產品 | 特徵 |
|---|---|---|
| 最左 | CLAUDE.md / AGENTS.md / GEMINI.md、Devin Playbooks、Cursor Rules | 純人寫的 procedural memory，進 git、進 code review |
| 偏左 | Claude Code auto memory、Codex Memories、OpenAI sandbox memory、Letta MemFS | agent 寫、人可讀可改的 Markdown；Letta 甚至 git-backed |
| 中間偏左 | Gemini CLI Auto Memory inbox、LangSmith Fleet、Devin Knowledge Suggestions | agent 提案、人核准才生效 |
| 中間 | GitHub Copilot Memory、Anthropic memory tool | 結構化條目，附引用或檔案語意，可驗證來源 |
| 中間偏右 | LlamaIndex Memory blocks、LangGraph Store、Foundry memory、ChatGPT / Claude.ai memory | LLM 抽取 facts，使用者看得到結果、改得動，但看不到抽取過程 |
| 偏右 | Mem0、Memory Bank、AgentCore、Supermemory | 自動抽取 + 整併 + 向量檢索，dashboard / API 可管理 |
| 最右 | Zep / Graphiti、Cognee、MemOS | 自動建圖（實體 / 關係 / 時間邊），人幾乎不直接編輯記憶內容 |

2026 年一個出乎意料的趨勢是**主流方向往左走**。2024–2025 的敘事是「向量 / 圖記憶取代 context」，但 OpenAI、Anthropic、Letta、LangChain 在 2026 上半年不約而同選擇 Markdown 檔案 + 索引 + progressive disclosure。理由：人可讀可審、進得了 git、與 prompt cache 相容、不需要額外基礎設施。向量 / 圖記憶沒有消失，但退居「可插拔後端」。本系列 order 9 會詳細分析這個趨勢。

## 怎麼用這個框架

下次評估一個記憶系統時，試著填這張卡：

```
系統名：___
記憶類型：working / episodic / semantic / procedural（可複選）
讀取形態：always-in-context ←→ on-demand
寫入時機：hot-path ←→ background
保真度：  lossless ←→ lossy
寫入權：  agent 自管 ←→ 人類審核
遺忘：    硬刪 / TTL / 時態失效 / decay / 覆蓋 / 無
範圍：    per-thread / session / user / project / agent / org
光譜位置：檔案 ←————→ 向量/圖
```

同一家產品在不同軸上可能落在不同位置。比如 Claude Code：讀取形態同時有 always-in-context（MEMORY.md 索引）和 on-demand（主題檔按需讀）；寫入時機是 hot-path（session 中自動寫）；保真度是 lossless（Markdown 檔）；寫入權是 agent 自管；遺忘機制是無；範圍是 per-project。

這不是評分卡——沒有哪個位置客觀更好。檔案式記憶適合需要可審計、可除錯的場景（coding agent）；向量式記憶適合需要大規模語意檢索的場景（客服 agent 面對數千使用者）。框架的價值是讓你意識到這些選擇存在，而不是替你做選擇。

本系列接下來的文章會用這個框架逐一分析：[短期 context 管理](/posts/ai/2026-08-21-context-full-seven-answers)、coding agent 的長期記憶設計、雲平台記憶 API、開源框架選型，以及記憶安全。

## 參考資料

- [CoALA: Cognitive Architectures for Language Agents（arXiv 2309.02427，TMLR 2024）](https://arxiv.org/abs/2309.02427)
- [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory（arXiv 2504.19413，ECAI 2025）](https://arxiv.org/abs/2504.19413)
- [MINJA: Memory Injection Attacks on LLM Agents（arXiv 2503.03704，NeurIPS 2025）](https://arxiv.org/abs/2503.03704)
- [MemoryBank: Enhancing LLMs with Long-Term Memory（arXiv 2305.10250，AAAI 2024）](https://arxiv.org/abs/2305.10250)
- [ACE: Agentic Context Engineering（arXiv 2510.04618，ICLR 2026）](https://arxiv.org/abs/2510.04618)
- [Sleep-time Compute（arXiv 2504.13171）](https://arxiv.org/abs/2504.13171)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory（arXiv 2501.13956）](https://arxiv.org/abs/2501.13956)
- [Claude Code Memory 官方文件](https://code.claude.com/docs/en/memory)
- [Codex Memories 官方文件](https://learn.chatgpt.com/docs/customization/memories)
- [GitHub Copilot Memory 概念文件](https://docs.github.com/en/copilot/concepts/agents/copilot-memory)
- [Building an agentic memory system for GitHub Copilot — GitHub Engineering](https://github.blog/ai-and-ml/github-copilot/building-an-agentic-memory-system-for-github-copilot)
- [Gemini CLI Auto Memory 官方文件](https://geminicli.com/docs/cli/auto-memory)
- [Devin Knowledge 官方文件](https://docs.devin.ai/product-guides/knowledge)
- [AWS AgentCore Memory 開發者指南](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html)
- [Memory for agents — LangChain 部落格](https://blog.langchain.com/memory-for-agents/)
- [RAG 個性化：從對話中學習使用者偏好](/posts/ai/2026-03-12-memory-personalization)（站內）
- [Context 滿了怎麼辦：七種答案，沒有一種是共識](/posts/ai/2026-08-21-context-full-seven-answers)（站內）
