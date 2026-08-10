---
title: "context 與記憶：agent 失敗的真正位置"
date: 2026-08-10
category: ai
type: deep-dive
tags: [context-engineering, memory, ai-agent, llm, kv-cache]
lang: zh-TW
series:
  name: "Agent 生產線"
  order: 3
tldr: "Chroma 測了 18 個前沿模型，全部隨輸入變長而跳崖式退化。記憶失效多半是檢索失效偽裝的。而 KV cache 的真正成本是頻寬不是儲存——decoding 每產生一個 token 都要讀過整個 cache。"
description: "agent 失敗的三個機制：context rot 與 lost in the middle 的架構性限制、記憶的層級×型別兩軸拆法與四個取捨（含 memory poisoning），以及 KV cache 為什麼是頻寬成本。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-10-agent-context-memory-failure-en)

[上一篇](/posts/ai/2026-08-10-model-component-harness-system)的結論是「可靠性來自模型周圍的工程」。這一篇處理那個「周圍」裡最大的一塊：模型每一輪實際看到什麼。

開場先給一句最反直覺的：**給 LLM 更多資訊，會讓它變笨。**

## 三個不會因為模型變強而消失的限制

**context rot。** [Chroma 的研究](https://research.trychroma.com/context-rot)評測了 18 個前沿模型（含 GPT-4.1、Claude 4、Gemini 2.5、Qwen3），結論是所有模型都隨輸入變長而表現變差，而且**不是均勻使用 context**。原文的措辭是「models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows」。更麻煩的是退化的形狀——**是跳崖，不是斜坡**，而跳崖點因模型與任務而異，你沒辦法從一個模型的表現推另一個。

那份研究另外對 NIAH（needle in a haystack）這類 benchmark 提出了批評：它測的只是詞彙檢索這個很窄的能力，模型在上面表現好，導致大家誤以為長 context 問題已經解決了。

**lost in the middle。** 注意力集中在 context 的頭尾，中段最容易被忽略。成因與位置編碼有關（RoPE 的 decay effect），屬於架構層而非資料層的問題。實務上的意思是：把最關鍵的指令與資料放頭尾，中段要主動裁剪。

**stateless。** 模型呼叫之間零記憶。看起來「記得」的每一次，都是系統重新把東西注入進去的結果。這一條決定了記憶必須是外掛的工程，不是模型的內建能力。

三者疊起來，[ByteByteGo 那篇 context engineering 導讀](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for)的收束值得抄下來：

> 當模型夠強之後，多數失敗就不再是智力失敗，而是 context 失敗——模型本來做得對，但沒拿到需要的東西，或拿到太多不需要的東西。

## 四個策略：Write / Select / Compress / Isolate

對應的做法可以整理成四個動詞：

| 策略 | 做什麼 | 實例 |
|---|---|---|
| **Write** | 把東西存到 context 之外 | scratchpad、`CLAUDE.md`、外部檔案 |
| **Select** | 只挑相關的載進來 | RAG；**工具也要選擇性載入**，不是全部塞進去 |
| **Compress** | 壓縮已經在裡面的 | Claude Code 在 95% 容量觸發 auto-compact；[Cognition](https://cognition.com/blog/dont-build-multi-agents) 甚至為此微調了一個專用的小模型 |
| **Isolate** | 拆給多個 agent，各自乾淨的 context | 子 agent 各自處理一塊，只回傳摘要 |

Select 那一列的「工具也要選擇性載入」常被忽略。每個工具定義都佔 context，一個掛了幾十個 MCP 工具的 agent，可能在開始工作前就已經吃掉可觀的預算。第四篇會看到 Stripe 的做法是 host 了近 500 個工具但**預設只給一小組**。

## 記憶：兩個正交的軸

站內對記憶有好幾種互不相容的拆法（兩分、三分、四分都有），但專題文給了一個可用的版本，關鍵是它用**兩個正交的軸**而不是一個清單：

- **層級**（東西放哪）：context window → session → 長期儲存 → 冷歸檔。明確類比作業系統在 RAM 與磁碟之間分頁
- **型別**（東西是什麼）：**working**（當前任務）/ **episodic**（特定過往互動，有時間錨點）/ **semantic**（跨情境的事實與偏好）/ **procedural**（學會的做事方式）

episodic 那一型最常被漏掉，而它的缺席有具體後果：沒有「我試過什麼、失敗了、為什麼」的記錄，agent 在失敗迴圈裡會反覆嘗試同一個壞方法。

### 最重要的一句：記憶失效多半是檢索失效偽裝的

[記憶那篇](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid)提了一個很好的思想實驗：一個有完美資料庫但檢索很爛的 agent，對上一個記憶是空的、但誠實面對自己能力邊界的 agent——**前者往往輸**。因為它會自信地把過時或不相關的資訊當成 ground truth 往上疊，而後者至少會說「我不知道」。

四個必須自己拿捏的取捨：

1. **recency vs relevance**——最近的不一定最相關
2. **summarization vs fidelity**——**摘要的失真是不均勻的**：名字、日期、具體承諾會被抹平，籠統主題會留下，**而 agent 的自信度不變**。這是最陰險的一種，因為壓縮後的錯誤看起來跟正確的一樣有把握
3. **staleness**——「我吃素」在兩年後可能已經不成立，系統只有很鈍的啟發法能猜世界變了
4. **memory poisoning**——**長期記憶就是長期攻擊面**。六個月前被寫進去的惡意指令會一直影響每一次檢索，直到有人發現。這條會在[第五篇](/posts/ai/2026-08-10-agent-security-harness-layer)再展開

## 一個常被誤解的成本結構：KV cache 是頻寬不是儲存

長 context 貴，多數人知道。但貴在哪，多數說法是錯的。

KV cache 的大小可以直接算：

```
cache size = 2 × 層數 × KV head 數 × head 維度 × 每數位元組 × token 數 × batch size
```

隨 context 長度與 batch **線性**成長。具體量級：Llama 3 70B、128K context、單一請求約 **40 GB**——一個請求就能吃掉一張 80GB 卡的大半。

但真正關鍵的重新框定在這裡：**decoding 階段每產生一個 token，都要把整個 cache 從記憶體讀進計算單元。** 所以那是**頻寬成本，不只是儲存成本**。這解釋了一個很常見的困惑——為什麼一個請求「明明放得下」，卻還是慢。

理解了公式，各種優化就對得上號了，每一種都在打其中一項：

| 優化 | 打哪一項 | 效果 |
|---|---|---|
| **GQA**（grouped-query attention） | KV head 數 | Llama 2/3 70B 與 Mistral 7B 降到 8 個，約省 8 倍 |
| **MLA**（DeepSeek） | head 維度 | DeepSeek-V3 每 token 約 70 KB，對照 GQA 模型的 192–328 KB |
| **量化** | 每數位元組 | 8 bit 通常代價低於 1% 準確率；4 bit 在多針檢索這類任務開始有可測損失 |
| **eviction** | token 數 | 丟掉判斷為不重要的部分 |
| **paged attention** | 浪費 | 碎片化從 60–80% 降到 4% 以下，吞吐量提升 2–3 倍 |
| **prefix / prompt caching** | 重複計算 | 命中時成本與延遲降 50–90% |

最後一列有個安全但書值得記：**跨使用者共享 cache 已經開出 timing side-channel，可能洩漏他人 prompt 的資訊。** 便宜不是沒有代價的。

## 對本地工作流的一個推論

如果你也在用 `CLAUDE.md` / `AGENTS.md` 這類檔案，這一篇有個直接的推論：**它們是 config 層，不是 memory 層。**

差別在失效模式。memory 層的失效是「檢索錯了」，要修檢索；config 層每一輪都無條件載入，不管相不相關，所以它的失效是**「檔案越加越多造成稀釋」**——要修的是篇幅與作用域。兩者用同一套管線，但治法完全不同。第四篇會看到 Stripe 對這件事給了最具體的處方。

## 本系列

1. [概念界線：agent、workflow、RAG、MCP 到底差在哪](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries)
2. [模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
3. **context 與記憶：agent 失敗的真正位置**（本篇）
4. [上線才是工作的開始：企業案例橫向讀](/posts/ai/2026-08-10-enterprise-agent-case-studies)
5. [安全：prompt injection 只能在 harness 層做損害控制](/posts/ai/2026-08-10-agent-security-harness-layer)
6. [引用之前：把 19 份一手來源查一遍](/posts/ai/2026-08-10-verifying-agent-numbers)
7. [協定層：MCP、A2A、ACP、Skills 各解什麼問題](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)
8. [RAG 的三種形態與 evaluator paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants)

## 參考資料

- [Chroma Research — Context Rot](https://research.trychroma.com/context-rot)
- [ByteByteGo — A Guide to Context Engineering for LLMs](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for)
- [ByteByteGo — How AI Agents Manage Memory and Avoid Forgetfulness](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid)
- [ByteByteGo — Why An LLM's Memory Gets Expensive and How to Fix It](https://blog.bytebytego.com/p/why-an-llms-memory-gets-expensive)
- [ByteByteGo — The Memory Problem: Why LLMs Sometimes Forget Your Conversation](https://blog.bytebytego.com/p/the-memory-problem-why-llms-sometimes)
- [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)
