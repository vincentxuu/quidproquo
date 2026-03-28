---
title: "LangGraph：用圖結構管理 Agent 工作流程"
date: 2026-03-27
category: ai
tags: [langgraph, agent, orchestration, rag, workflow]
lang: zh-TW
tldr: "LangGraph 把 LLM 工作流程建模成有向圖，解決多輪迭代、條件分支、平行執行這些用線性 pipeline 做很痛的問題。"
description: "LangGraph 是什麼、為什麼比 plain pipeline 好用、nobodyclimb 怎麼用它管理三種 RAG 策略圖（Baseline / Agentic / Plan-Execute），以及什麼時候用它反而是 overkill。"
draft: false
---

大多數 RAG 教學範例都是線性的：query → embed → retrieve → generate。但真實系統很快就會遇到問題：「答案品質不夠好，要重新檢索」、「這個查詢需要先拆成子任務再合併」、「簡單問題直接走 LLM，不用跑完整 pipeline」。

線性 pipeline 加這些邏輯，最終變成一堆 if/else 散落在各處。LangGraph 的核心主張是：把這些流程控制結構明確建模成圖。

## LangGraph 是什麼

LangGraph 是 LangChain 生態系的一個子框架，核心概念是把 LLM 工作流程表示成 **有向圖（directed graph）**，節點是執行單元（可以是 LLM 呼叫、工具呼叫、任何 function），邊是節點之間的轉移，支援條件邊（conditional edges）決定要走哪條路。

狀態（state）是一個 typed dict，在圖中流動，每個節點接收當前狀態、做事、回傳更新後的狀態。

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class State(TypedDict):
    query: str
    documents: list[str]
    answer: str
    loop_count: int

def retrieve(state: State) -> State:
    # 向量搜尋邏輯
    docs = vector_store.search(state["query"])
    return {"documents": docs}

def generate(state: State) -> State:
    answer = llm.invoke(f"Based on: {state['documents']}\nAnswer: {state['query']}")
    return {"answer": answer.content}

def should_retry(state: State) -> str:
    if groundedness_score(state["answer"]) < 0.5 and state["loop_count"] < 2:
        return "retrieve"
    return END

graph = StateGraph(State)
graph.add_node("retrieve", retrieve)
graph.add_node("generate", generate)
graph.add_edge("retrieve", "generate")
graph.add_conditional_edges("generate", should_retry)
graph.set_entry_point("retrieve")

app = graph.compile()
```

這段程式碼明確表達了「生成後評估，品質不夠就重試」的邏輯，不需要在函式內部塞控制流程。

## 為什麼不用 plain pipeline

線性 pipeline 的問題不是無法實作這些功能，而是實作後維護成本高：

**條件路由**：線性 pipeline 裡要跳過某些 step，通常靠 step 內部判斷或在 engine 層加 `skipWhen` 條件。當條件多起來，哪個 step 會跑、哪個不跑，光看程式碼很難一眼看出。LangGraph 把路由邏輯集中在 edges，圖的結構即是文件。

**迴圈**：pipeline 通常假設單次執行。要加重試迴圈，要麼在 engine 層加全域 loop 控制，要麼讓 step 自己呼叫回去，兩種都是 workaround。LangGraph 的 cyclic graph 是一等公民。

**平行執行**：LangGraph 支援 `Send` API 做 map-reduce，可以把一個任務拆成多個並行分支再合併，不需要手寫 `Promise.all`。

## nobodyclimb 的三種策略圖

nobodyclimb 的 AI 問答系統在 pipeline engine（14 個基礎 step）之上，用 LangGraph 加了一層策略選擇。根據查詢複雜度自動路由到三種圖：

### Baseline Graph（15 nodes）

適合大多數查詢的標準流程。14 個 pipeline step 順序執行，加上 `memoryExtractor`——從對話中萃取使用者偏好（常去的岩場、慣用的難度範圍），寫入長期記憶。

```
query → semantic-cache → tool-selection → [RAG steps] → generation → evaluation → memoryExtractor
```

### Agentic Graph（12 nodes）

適合「我不確定這些資訊夠不夠回答這個問題」的複雜查詢。核心是 `agenticDecision` 節點：LLM 讀取目前已取得的文件，判斷是否足夠回答問題。不夠的話觸發 `agenticRetrieve` 重新檢索，最多循環 5 次。

```
query → retrieve → agenticDecision ──(夠用)──→ generate
                       ↑
                       └──(不夠)── agenticRetrieve ──┘
```

### Plan-Execute Graph（8 nodes）

適合複合查詢，例如「比較龍洞和北投的 5.10 路線，哪邊更適合初學者」。`planning` 節點先把問題拆成子任務，`executePlanStep` 逐一執行，`synthesis` 合併多個子結果成一個回答。

```
query → planning → executePlanStep（x N）→ synthesis → generate
```

這三種圖共享同一組基礎 step 實作，差異只在圖的結構和幾個 LangGraph 專屬節點。

## 什麼時候用 LangGraph，什麼時候 overkill

**值得用的情境：**

- 有多種執行路徑，根據狀態動態決定走哪條
- 需要迴圈（self-correction、multi-turn retrieval）
- 任務可以拆解成子任務平行執行
- 流程複雜到線性 pipeline 的 if/else 讓人看不懂

**可能 overkill 的情境：**

- 流程是固定的 query → retrieve → generate，沒有分支
- 團隊不熟悉圖的抽象，learning curve 比帶來的好處高
- 只需要「如果品質差就重試一次」，一個簡單的 retry loop 就夠了
- 在意 dependency 大小（LangGraph 拉進來的依賴不小）

判斷標準很直接：如果你的 pipeline 有超過一個條件分支，或需要任何形式的迴圈，LangGraph 值得考慮。如果你的流程可以用一張線性清單描述完，不需要它。

## 主要取捨

**好處：**
- 流程圖即文件，`.get_graph().draw_mermaid()` 可以直接輸出可視化
- 狀態管理統一，不需要在函式之間傳遞一堆參數
- Checkpointing 內建，可以 resume 中斷的執行（對 long-running agent 很重要）
- LangSmith 整合，trace 和 observability 開箱即用

**壞處：**
- 抽象層增加，debug 比直接呼叫函式麻煩
- 狀態型別需要維護，狀態欄位一多容易失控
- 版本迭代快，API 有時不穩定
- 如果只用 LangGraph 不用 LangChain 其他部分，單純為了圖結構引入整個生態系的成本要考慮

## 參考資料

- [LangGraph 官方文件](https://langchain-ai.github.io/langgraph/)
- [LangGraph 概念：Graphs](https://langchain-ai.github.io/langgraph/concepts/low_level/)
- [LangGraph 概念：State Management](https://langchain-ai.github.io/langgraph/concepts/low_level/#state)
- [LangGraph How-to Guides](https://langchain-ai.github.io/langgraph/how-tos/)
- [NobodyClimb RAG Pipeline 架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — 完整的 20 節點設計與三種策略圖
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — 平台整體架構與 Cloudflare-first 策略
