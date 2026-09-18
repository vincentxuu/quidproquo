---
title: "系列導讀：AI Agent 記憶工程"
date: 2026-09-19
category: ai
type: deep-dive
tags: [agent-memory, context-engineering, ai-agent, series-intro]
lang: zh-TW
tldr: "Agent 記憶不是一個功能，是至少四種不同的工程問題——working、episodic、semantic、procedural。這個十篇系列從分類框架到 coding agent 實作、平台 API、開源框架、安全攻擊面，再到 2026 的趨勢判斷，完整走一遍設計空間。"
description: "AI Agent 記憶工程系列導讀：為什麼記憶是 agent 工程的核心難題，這十篇各自解決什麼問題，以及建議的閱讀順序。"
series:
  name: "AI Agent 記憶工程"
  order: 0
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-19-agent-memory-engineering-series-intro-en)

你用 Claude Code 寫了一下午的程式，順手讓它記住「這個 repo 的測試要用 pytest 不要用 unittest」。隔天打開新 session，它又問你要用什麼測試框架。

你在公司的客服 chatbot 上聊了三輪，提到自己是企業方案的使用者。第四輪問帳單問題，它回你「請問您使用的是哪個方案？」

你的 coding agent 在一個 session 裡完美地修了五個 bug，但第六個 bug 的修法覆蓋了第三個。它不是不知道——那段對話還在 context 裡——但 context 已經太長，模型的注意力分散了。

這三個場景是 agent 記憶的三種不同「壞法」：

1. **跨 session 失憶**——上一次學到的東西，下一次不見了
2. **跨輪次失憶**——同一段對話裡，前面講過的資訊被忘記
3. **記憶干擾**——記住了，但被更多的 context 淹沒，產生錯誤行為

它們的根源不同，解法也不同。把全部對話塞進 context window 不是答案——依 [Chroma 2025 年的對照實驗](https://research.trychroma.com/evaluating-chunking)，就算塞得下，塞滿也會讓模型表現變差。而依 [Princeton 的 CoALA 框架](https://arxiv.org/abs/2309.02427)（TMLR 2024），agent 的記憶至少要分成四種來設計：working（當前推理狀態）、episodic（特定時間的經驗）、semantic（抽離時間的事實）、procedural（怎麼做事的知識）。

這個系列用十篇文章走完 agent 記憶的設計空間。

## 系列路線圖

| 篇 | 主題 | 你會得到什麼 |
|---|---|---|
| **0（本篇）** | 系列導讀 | 問題意識與閱讀地圖 |
| **1** | 四種記憶與六個設計軸 | 分類框架——用 CoALA 四類記憶和六個獨立設計軸（讀取形態、寫入時機、保真度、寫入權歸屬、遺忘機制、範圍）描述任何記憶系統的設計選擇 |
| **2** | [Context 滿了怎麼辦：七種答案，沒有一種是共識](/posts/ai/2026-08-21-context-full-seven-answers) | 短期記憶（working memory）——Anthropic、Amp、Cursor、Manus 等八家對 context 管理的策略比較 |
| **3** | 六家 Coding Agent 怎麼記東西 | 長期記憶的工具端——Claude Code、Codex、Gemini CLI、Cursor、GitHub Copilot、Devin 各自的記憶設計與取捨 |
| **4** | 五朵雲的記憶 API | 長期記憶的平台端——OpenAI Agents SDK、Anthropic Managed Agents、Google Memory Bank、AWS AgentCore、Microsoft Foundry 五家拆解 |
| **5** | 開源記憶框架選型 | 長期記憶的開源端——Mem0、Zep/Graphiti、Letta、LangGraph、LlamaIndex Memory、Cognee、Supermemory 的定位與選型決策 |
| **6** | [Mem0 完整介紹](/posts/ai/2026-08-22-mem0-agent-memory) | 深潛——向量抽取派代表，從寫入管線到租戶隔離 |
| **7** | [OpenViking：Agent 記憶做成虛擬檔案系統](/posts/ai/2026-08-22-openviking-agent-memory) | 深潛——檔案系統派代表，三層載入與 550 tokens 平均檢索 |
| **8** | Agent 記憶的攻擊面 | 安全——SpAIware 持久化外洩、MINJA 對話注入（>95% 成功率）、Bedrock 記憶投毒，以及業界兩派防線 |
| **9** | 2026 記憶系統往哪走 | 趨勢——檔案贏了向量、寫入權交還人類、Dreaming 成為新名詞、benchmark 被玩壞的現實 |

## 閱讀建議

**順序讀**：從 0 到 9 是設計過的學習弧線——先拿到分類語言（1），再從短期到長期走一遍（2-5），深潛兩個代表方案（6-7），最後考慮安全和趨勢（8-9）。

**跳著讀**：如果你已經知道記憶分哪幾種，直接跳到你關心的層次：
- 在**用** coding agent → 第 3 篇
- 在**建** agent 應用 → 第 4、5 篇
- 在**選** 記憶框架 → 第 5、6、7 篇
- 在**評估** 安全風險 → 第 8 篇
- 想知道**方向** → 第 9 篇

## 這系列不講什麼

- 不講 RAG 的檢索策略和 chunking 細節（那是另一個主題；個人化 RAG 與記憶的交集可以看[〈RAG 個性化：從對話中學習使用者偏好〉](/posts/ai/2026-03-12-memory-personalization)）
- 不講模型架構層的記憶（Titans、MIRAS 那類「在模型內部加記憶模組」的研究方向），聚焦在系統層的記憶工程
- 不講 session 持久化的底層實作（JSONL 格式、crash recovery 等），那些在[〈Session 持久化與 crash recovery〉](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)已經寫過

## 一個提前劇透的結論

2026 年 agent 記憶最出人意料的趨勢是**往左走**。2024-2025 的敘事是「向量資料庫和知識圖取代 context window」，但 OpenAI（Codex Memories、sandbox memory）、Anthropic（auto memory、memory tool）、Letta（Context Repositories）在 2026 上半年不約而同選擇了 Markdown 檔案加索引加 progressive disclosure。理由很實際：人可讀可審、進得了 git、跟 prompt cache 相容、不需要額外基礎設施。

向量和圖記憶沒有消失，但退居「可插拔後端」。這件事值得一篇完整的分析——那是第 9 篇的事。

先從第 1 篇的分類框架開始。

## 參考資料

- [CoALA: Cognitive Architectures for Language Agents（arXiv 2309.02427，TMLR 2024）](https://arxiv.org/abs/2309.02427)
- [Chroma — Evaluating Chunking Strategies for Retrieval（2025）](https://research.trychroma.com/evaluating-chunking)
- [MINJA: Memory Injection Attacks on LLM Agents（arXiv 2503.03704，NeurIPS 2025）](https://arxiv.org/abs/2503.03704)
- [SpAIware: Persistent Data Exfiltration via ChatGPT Memory — Johann Rehberger（2024-09）](https://embracethered.com/blog/posts/2024/chatgpt-macos-app-persistent-data-exfiltration/)
- [Anthropic — Effective context engineering for AI agents（2025-09）](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [OpenAI — Building reliable agents: memory & compaction cookbook（2026-05-01）](https://developers.openai.com/cookbook/examples/agents_sdk/building_reliable_agents_memory_compaction)
- [Letta — Context Repositories / Next Phase 部落格（2026-02/03）](https://www.letta.com/blog)
- [站內：Context 滿了怎麼辦：七種答案](/posts/ai/2026-08-21-context-full-seven-answers)
- [站內：Mem0 完整介紹](/posts/ai/2026-08-22-mem0-agent-memory)
- [站內：OpenViking：Agent 記憶做成虛擬檔案系統](/posts/ai/2026-08-22-openviking-agent-memory)
- [站內：RAG 個性化：從對話中學習使用者偏好](/posts/ai/2026-03-12-memory-personalization)
- [站內：Session 持久化與 crash recovery](/posts/ai/2026-08-25-coding-agent-session-persistence-crash-recovery)
