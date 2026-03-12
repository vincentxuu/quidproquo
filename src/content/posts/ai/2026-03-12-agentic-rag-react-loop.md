---
title: "Agentic RAG：讓 LLM 自己決定要不要再搜尋一次"
date: 2026-03-12
category: ai
tags: [rag, agentic-rag, react, multi-hop, llm-agent]
lang: zh-TW
tldr: "複雜多跳問題，RAG 一次搜尋不夠。Agentic RAG 讓 LLM 評估結果是否充分，不夠就改寫查詢再搜一次，形成 ReAct 迴圈。"
description: "Agentic RAG 的 ReAct 迴圈設計、觸發條件、決策邏輯、與 Baseline RAG 的取捨，以及在攀岩推薦場景的應用。"
draft: false
---

標準 RAG 是單次搜尋：查詢 → 檢索 → 生成。這個流程對大多數問題夠用，但碰到需要多跳推理的複雜問題就不行了。

「幫我規劃一條從台中出發、適合中級攀岩者、週末去得了、有不同難度適合不同夥伴的攀岩行程」

這個問題涉及：
1. 台中附近有哪些岩場？（地理位置）
2. 每個岩場的難度分布是什麼？（路線資訊）
3. 中級攀岩者的難度範圍是什麼？（程度判斷）
4. 週末交通方便性如何？（實用資訊）

一次搜尋很難同時涵蓋這些維度。Agentic RAG 讓 LLM 在執行過程中**評估當前 context 是否足夠**，不夠就主動決定再搜尋什麼。

## ReAct 迴圈

ReAct（Reasoning + Acting）是 Agentic RAG 的核心模式：

```
Reason: 評估當前 context，決定下一步
Act: 執行決策（搜尋 / 回答 / 放寬）
Observe: 取得搜尋結果，更新 context
Reason: 再次評估...（迴圈）
```

系統中的實作：

```typescript
async function agenticRetrieve(ctx: PipelineContext): Promise<void> {
  let step = 0;

  while (step < ctx.config.agentic_max_steps) {
    const candidates = ctx.candidateMatches;

    // 評估是否充分
    if (candidates.length >= ctx.config.agentic_min_docs_to_answer) {
      ctx.agenticDecision = 'ANSWER';
      break;
    }

    // LLM 決策：改寫查詢 / 放寬條件
    const decision = await agentDecide(ctx.currentQuery, candidates, ctx.config);

    if (decision.action === 'RETRIEVE') {
      // 用改寫後的查詢重新搜尋
      ctx.currentQuery = decision.rewrittenQuery;
      const newResults = await hybridSearch(ctx);
      mergeResults(ctx, newResults);
    } else if (decision.action === 'BROADEN') {
      // 放寬過濾條件
      ctx.vectorFilter = relaxFilter(ctx.vectorFilter);
      const newResults = await hybridSearch(ctx);
      mergeResults(ctx, newResults);
    } else {
      break; // ANSWER
    }

    step++;
  }
}
```

`agentic_max_steps` 防止無限迴圈。預設是 3 步，可以調整。

## 決策 Prompt

Agent 的決策 LLM 收到：

```
當前查詢：{query}
已找到的文件（{n} 篇）：{document_summaries}

請決定：
ANSWER - 文件已足夠，可以生成回答
RETRIEVE - 需要更多資訊，請改寫查詢（提供新查詢）
BROADEN - 過濾條件太嚴，需要放寬搜尋範圍
```

LLM 輸出結構化決策：

```json
{
  "action": "RETRIEVE",
  "rewrittenQuery": "台中攀岩岩場交通方式",
  "reasoning": "目前的文件缺乏交通資訊，需要補充"
}
```

## 觸發條件

Agentic RAG 不是預設啟動的。需要：
1. `rag_strategy === 'agentic'` 或 `rag_strategy === 'auto'`（auto 模式下根據 queryType 選擇）
2. `queryType === 'complex'`

原因很簡單：Agentic RAG 的延遲比標準 RAG 高很多（多次 LLM 呼叫 + 多次搜尋），不適合所有查詢。

```
Standard RAG: 5-8 秒
Agentic RAG:  10-20 秒（視步驟數）
```

使用者願意等更久換取更完整的回答嗎？取決於查詢的複雜度。`auto` 模式讓系統自己判斷。

## 與 CRAG 的差異

CRAG 是**零結果時的規則型修正**，Agentic RAG 是**有結果但不夠好時的 LLM 主動介入**：

| | CRAG | Agentic RAG |
|---|------|-------------|
| 觸發 | 零候選文件 | LLM 評估 context 不足 |
| 決策 | 規則（移除 filter） | LLM（改寫查詢 / 放寬） |
| 複雜度 | 低 | 高 |
| 延遲 | +0.5s（多一次搜尋） | +5-15s（多次 LLM 呼叫） |

兩者可以同時啟用：CRAG 作為基礎防護，Agentic RAG 作為高品質選項。

## 多跳推理的效果

對需要整合多個來源的查詢，Agentic RAG 的效果顯著優於標準 RAG：

**標準 RAG**：搜尋「台中攀岩行程」→ 找到幾個岩場介紹 → LLM 用這些資訊生成有限的建議

**Agentic RAG**：
- Step 1：搜尋「台中附近岩場」→ 找到大坑、谷關
- Step 2：LLM 評估缺乏難度資訊 → 搜尋「大坑岩場路線難度」
- Step 3：LLM 評估缺乏交通資訊 → 搜尋「大坑岩場交通方式」
- 整合三步的資訊 → 生成更完整的行程建議

每一步都針對性地補充缺失的資訊，而不是一次性搜尋碰運氣。

## 整體來說

Agentic RAG 代表 RAG 系統從「被動檢索」向「主動推理」的演進。它不適合高流量、對延遲敏感的場景，但對複雜的規劃型和多跳推理型查詢，品質提升是顯著的。

核心設計原則：**給 LLM 充分的資訊而不是讓它猜**。與其讓 LLM 從不完整的 context 中瞎猜，不如讓它多搜幾次拿到足夠的資訊再回答。Agentic RAG 就是把這個判斷權還給 LLM。
