---
title: "Plan-and-Execute：先規劃再執行的 RAG 模式"
date: 2026-03-12
category: ai
tags: [rag, plan-execute, agentic, multi-step, reasoning]
lang: zh-TW
tldr: "對複雜問題，先讓 LLM 規劃出需要哪些資訊、分幾步取得，再按計畫執行，比邊搜邊想更系統化。"
description: "Plan-and-Execute RAG 的設計：LLM 先生成執行計畫，再按計畫分步驟搜尋和整合，與 ReAct 迴圈的差異，以及適合的使用場景。"
draft: false
---

Agentic RAG 的 ReAct 迴圈是「邊想邊做」——執行一步，評估結果，決定下一步。這個模式靈活，但對非常複雜的問題，每一步的決策可能因為缺乏全局視野而走彎路。

Plan-and-Execute 是另一種思路：**先讓 LLM 把整個執行計畫想清楚，再按計畫執行**。就像先畫出地圖，再出發，而不是邊走邊問路。

## 兩個階段

**Phase 1：Planner**

LLM 分析查詢，生成一個結構化的執行計畫：

```json
{
  "goal": "推薦適合台北初學者的攀岩路線",
  "steps": [
    {
      "step": 1,
      "action": "retrieve",
      "query": "台北附近攀岩岩場",
      "purpose": "找出台北可去的岩場清單"
    },
    {
      "step": 2,
      "action": "retrieve",
      "query": "初學者適合的難度範圍和特性",
      "purpose": "確認初學者的定義和需求"
    },
    {
      "step": 3,
      "action": "retrieve_conditional",
      "query": "{岩場名稱} 入門路線",
      "depends_on": "step_1",
      "purpose": "針對找到的岩場查詢入門路線"
    },
    {
      "step": 4,
      "action": "synthesize",
      "purpose": "整合以上資訊，生成推薦"
    }
  ]
}
```

**Phase 2：Executor**

按計畫逐步執行，每個 `retrieve` step 執行一次搜尋，`retrieve_conditional` 等上一步的結果再執行，`synthesize` 整合所有 context 生成最終回答。

## 與 ReAct 的差異

| | ReAct | Plan-and-Execute |
|---|------|-----------------|
| 思考模式 | 即時決策 | 先規劃後執行 |
| 全局視野 | 局部（每步只看當前） | 完整（開始就知道全貌） |
| 靈活性 | 高（可隨時調整方向） | 低（計畫制定後不易更改） |
| 適合查詢 | 不確定需要幾步 | 複雜但結構清晰的問題 |
| 延遲 | 不確定（依步驟數） | 較確定（計畫明確） |

ReAct 更適合探索型問題（「這個岩場有什麼特色」），Plan-and-Execute 更適合目標明確的複雜問題（「幫我規劃一次攀岩行程」）。

## 計畫生成 Prompt

```
你是一個攀岩知識助理的規劃員。請分析以下查詢，並生成一個結構化的執行計畫。
計畫應該分解為 2-5 個具體步驟，每步說明需要檢索什麼資訊和為什麼。

查詢：{query}

請以 JSON 格式輸出執行計畫，包含 goal 和 steps 陣列。
```

## 依賴處理

計畫中的步驟可能有依賴關係（`depends_on`）：

```typescript
async function executePlan(plan: ExecutionPlan): Promise<string[]> {
  const results: Map<number, string> = new Map();

  for (const step of plan.steps) {
    if (step.depends_on) {
      // 等待依賴步驟的結果
      const depResult = results.get(step.depends_on);
      step.query = step.query.replace('{結果}', depResult ?? '');
    }

    if (step.action === 'retrieve') {
      const docs = await hybridSearch(step.query);
      results.set(step.step, formatDocs(docs));
    } else if (step.action === 'synthesize') {
      // 整合所有 results，生成最終回答
      const allContext = [...results.values()].join('\n\n');
      return generateAnswer(plan.goal, allContext);
    }
  }
}
```

沒有依賴的步驟可以並行執行，有依賴的必須等待。這個設計讓執行效率接近最優（不互相依賴的搜尋同時跑）。

## 適用場景

Plan-and-Execute 在以下場景最有價值：

1. **行程規劃**：「安排一次台北到花蓮的攀岩旅行」
2. **比較分析**：「比較龍洞和新店的適合新手程度」
3. **多維度推薦**：「找一個難度適合我、風景好、交通方便的岩場」
4. **結構化報告**：「給我一份完整的抱石入門指南」

對這類問題，提前規劃比邊跑邊看更能產出系統性的完整回答。

## 系統中的配置

```typescript
// rag_strategy === 'plan-execute' 時啟用
const effectiveStrategy =
  config.rag_strategy === 'auto'
    ? detectStrategy(queryType, queryComplexity)
    : config.rag_strategy;

if (effectiveStrategy === 'plan-execute') {
  await planAndExecute(ctx);
} else if (effectiveStrategy === 'agentic') {
  await agenticRetrieve(ctx);
} else {
  await standardRetrieve(ctx);
}
```

三種策略可以在 Admin UI 動態切換，不需要重新部署。`auto` 模式根據查詢特徵自動選擇。

## 整體來說

Plan-and-Execute 把「思考」和「執行」分開。Planner 做全局規劃，Executor 專注執行，兩個角色分離讓複雜問題的處理更系統化。

代價是多一次 LLM 呼叫（生成計畫），以及計畫一旦生成就缺乏彈性。對結構清晰的複雜查詢，這個代價是值得的；對開放性的探索查詢，ReAct 的靈活性更合適。選擇哪種策略，取決於問題的性質，而不是一概而論。
