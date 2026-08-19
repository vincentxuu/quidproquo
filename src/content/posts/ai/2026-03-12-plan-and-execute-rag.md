---
title: "Plan-and-Execute：先規劃再執行的 RAG 模式"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, plan-execute, agentic, multi-step, reasoning]
lang: zh-TW
tldr: "對複雜問題，先讓 LLM 規劃出需要哪些資訊、分幾步取得，再按計畫執行，比邊搜邊想更系統化。"
description: "Plan-and-Execute RAG 的設計：LLM 先生成執行計畫，再按計畫分步驟搜尋和整合，與 ReAct 迴圈的差異，以及適合的使用場景。"
draft: false
series:
  name: "RAG 技法大全"
  order: 22
---

> 🌏 [English version](/posts/ai/2026-03-12-plan-and-execute-rag-en)

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
      "query": "{dep_result} 入門路線",
      "depends_on": 1,
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
type PlanStep = {
  step: number;
  action: 'retrieve' | 'retrieve_conditional' | 'synthesize';
  query?: string;
  depends_on?: number;  // 步驟編號（數字），要跟 results 的 key 型別一致
  purpose: string;
};

async function executePlan(plan: ExecutionPlan): Promise<string> {
  const results = new Map<number, string>();

  for (const step of plan.steps) {
    if (step.action === 'synthesize') {
      // 整合所有 results，生成最終回答
      const allContext = [...results.values()].join('\n\n');
      return generateAnswer(plan.goal, allContext);
    }

    // retrieve 與 retrieve_conditional 走同一條路徑，
    // 差別只在後者有 depends_on，要先把前一步的結果代進佔位符
    let query = step.query ?? '';
    if (step.depends_on !== undefined) {
      const depResult = results.get(step.depends_on);
      if (depResult === undefined) {
        throw new Error(`step ${step.step} 依賴的 step ${step.depends_on} 沒有結果`);
      }
      query = query.replace('{dep_result}', depResult);
    }

    const docs = await hybridSearch(query);
    results.set(step.step, formatDocs(docs));
  }

  throw new Error('計畫缺少 synthesize 步驟');
}
```

這段有三個容易寫錯的地方，都會靜默失效而不是報錯：

1. **佔位符字串要跟 Planner 產出的計畫對得上**。計畫裡寫 `{dep_result}`，executor 就得 replace `{dep_result}`；兩邊不一致的話 `replace` 什麼都不會做，query 帶著一個沒被代換的佔位符去搜尋，結果一團糟但程式不會丟例外。
2. **`depends_on` 的型別要跟 `results` 的 key 一致**。計畫是 LLM 產的 JSON，很容易吐出 `"step_1"` 這種字串，拿去 `results.get()` 只會拿到 `undefined`。收到計畫後先做一次 schema 驗證與正規化。
3. **`retrieve_conditional` 要有人處理**。只 match `'retrieve'` 的話，條件式步驟會被整個跳過，最後 synthesize 少了一段 context，回答看起來卻仍然「正常」。

至於並行：上面這個 for 迴圈是循序的——它保證依賴順序，但也把沒有依賴的步驟一起排隊了。要真的並行，得先依 `depends_on` 把步驟分層，同一層用 `Promise.all` 一起跑，下一層再等上一層完成。這段排程要自己寫，而計畫通常只有 2-5 步，循序版多半已經夠用；等到步驟數真的變多、延遲被使用者感覺到，再加也不遲。

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

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models (2023)](https://arxiv.org/abs/2305.04091)
- [ReAct: Synergizing Reasoning and Acting in Language Models (2022)](https://arxiv.org/abs/2210.03629)
- [NobodyClimb 系統架構：Cloudflare 全端攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI 架構：20 節點 RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
