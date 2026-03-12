---
title: "Self-Reflection + LLM-as-Judge：讓 AI 評估自己的回答"
date: 2026-03-12
category: ai
tags: [rag, llm-judge, self-reflection, groundedness, quality-assurance]
lang: zh-TW
tldr: "用另一個 LLM 評估回答的準確度和品質，分數太低就重新生成，並自動加上適當的免責聲明。"
description: "LLM-as-Judge 的評分機制、Groundedness 計算、Self-Reflection 重生成決策，以及如何把品質評估整合進 RAG pipeline。"
draft: false
---

RAG 系統生成答案後，怎麼知道這個答案是不是在胡說？

最直覺的方式是人工標記，但無法 scale。另一個方式是用另一個 LLM 來評估——**LLM-as-Judge**（LLM 當評審員）。這是目前業界評估生成品質的主流手段，用在 RAG 系統裡特別有用，因為我們有 context 可以當參考答案。

## LLM-as-Judge 的評分維度

系統評估兩個維度：

**Groundedness（0.0 – 1.0）**：回答有多少比例基於提供的 context
- 1.0：完全基於 context，沒有額外推測
- 0.8：主要基於 context，有少量合理推論
- 0.5：一半基於 context，一半是 LLM 自己補充的
- 0.2：主要是 LLM 自己的知識，context 只是點綴

**Quality（1 – 4）**：回答的整體品質
- 4：高品質，直接回應問題，資訊完整
- 3：普通，有回應但有明顯缺失
- 2：低品質，不相關或資訊不足
- 1：極低，完全沒有回答問題

## Judge Prompt

Judge LLM 收到的 prompt：

```
你是一個攀岩知識品質評審員。請評估以下 RAG 系統的回答品質。

[檢索到的 Context]
{context}

[系統回答]
{answer}

[原始問題]
{query}

請輸出 JSON：
{
  "groundedness": 0.0-1.0,  // 回答基於 context 的程度
  "quality": 1-4,            // 整體品質
  "reasoning": "評分理由"
}
```

使用輕量模型 `llama-3.1-8b-instruct` 做 Judge，不需要複雜推理，8B 夠用，成本低。

## Groundedness 的使用

Groundedness 分數決定是否在回答中加入免責聲明：

```typescript
function annotateGroundedness(answer: string, score: number): string {
  if (score >= 0.8) return answer;                    // 高可信，不加

  if (score >= 0.6) {
    return `⚠️ 部分內容可能超出現有資料\n\n${answer}`;  // 加警告
  }

  return `❓ 此回答資料不足，請謹慎參考\n\n${answer}`; // 加免責
}
```

這個設計讓使用者知道什麼時候該信任系統，什麼時候應該再查一下。比起完全隱藏不確定性，透明度更重要。

## Self-Reflection（自我反思重生成）

Quality ≤ 2 時觸發重生成：

```typescript
async function selfReflect(ctx: PipelineContext): Promise<void> {
  const { quality, groundedness } = ctx.judgeResult;

  // 觸發條件：品質低 + 回答不是太短（太短說明 context 本來就空）
  if (quality <= 2 && ctx.response.answer.length >= 50) {

    // 重新生成（使用相同的 messages）
    const regenerated = await generateAnswer(ctx.messages, ctx.config);

    // 對重生成結果重跑 Judge
    const regenJudge = await judgeAnswer(regenerated, ctx.context, ctx.query);

    // 選 groundedness 較高者
    if (regenJudge.groundedness > groundedness) {
      ctx.response.answer = regenerated;
      ctx.judgeResult = regenJudge;
      ctx.trace.selfReflection.accepted = true;
    } else {
      ctx.trace.selfReflection.accepted = false; // 保留原始
    }
  }
}
```

重生成不是無條件替換，而是**比較 groundedness，取更高的那個**。這避免了「越重生成越差」的問題——如果重生成反而幻覺更多，就保留原始回答。

重生成只在 `queryType === 'complex'` 觸發。Simple 查詢和 SQL 查詢的低品質通常是資料不足，重生成沒有意義。

## 自動標記不良回答

Groundedness < 0.5 的回答自動寫入 `ai_flagged_responses` 表：

```typescript
if (groundedness < 0.5) {
  await db.insert(aiFlaggedResponses).values({
    query_log_id: ctx.queryLogId,
    flag_reason: 'low_groundedness',
    auto_score: groundedness,
    created_at: Date.now(),
  });
}
```

管理員可以在後台查看被標記的回答，手動確認是否有系統性的問題（某類查詢 groundedness 持續低）。這是個持續改善系統的資料來源。

## Judge 的盲點

LLM-as-Judge 不是萬能的，有幾個已知問題：

1. **Position Bias**：Judge 傾向給更長、排列更早的文件更高分
2. **Verbosity Bias**：更長的回答傾向得到更高 quality 分
3. **Self-Enhancement Bias**：同一系列的模型互評時可能過於寬容

對這些偏差，系統的做法是：把 Judge 的結果當參考而非絕對真相，搭配使用者回饋（thumbs up/down）做補充校正。使用者回饋與 auto_score 差異 ≥ 2 時，也會觸發標記，等待人工審查。

## 整體來說

LLM-as-Judge 是 RAG 品質保證的核心機制。Groundedness 讓系統知道什麼時候該謙虛，Self-Reflection 提供一次自我修正的機會，自動標記建立了持續改善的回饋迴路。

最重要的設計原則：**不信任任何單一評估**。Judge 分數低 → 標記等待人工。使用者評分差 → 也觸發標記。兩者一致才算真正確認有問題。多重信號比單一信號可靠。
