# AI Agent 架構模式參考

## Agent 三支柱模型

### Context（上下文）
- Context window 是 Agent 的工作記憶（100K-200K tokens）
- Context Engineering：把對的資訊在對的時間送到 Agent 面前
- 包含：system prompt、tool definitions、conversation history、retrieved documents
- 跨 session 記憶是未解難題：需要持久化策略

### Cognition（認知）
- 推理框架：ReAct、Chain-of-Thought、Tree-of-Thought
- 決策能力：什麼時候用什麼工具、什麼時候停下來
- 自我修正：發現錯誤後重新規劃

### Action（行動）
- Tool Use：MCP 協定標準化工具呼叫
- 執行能力：程式碼執行、API 呼叫、檔案操作
- 回饋迴路：觀察結果 → 調整策略

## AI 工程三階段演化

### Phase 1: Prompt Engineering（2022-2024）
- 單輪語法最佳化：CoT、Few-shot、Role-playing
- 限制：無法處理需要外部知識的問題

### Phase 2: Context Engineering（2025）
- RAG、記憶管理、Tool Definitions
- 重點從「怎麼問」轉向「給什麼資訊」

### Phase 3: Harness Engineering（2026）
- 生命週期管理、狀態持久化、回饋迴路
- Agent 不再是一次性對話，而是長期運行的系統
- 設計原則：隨模型進步可以簡化的 harness

## Google 八種 Multi-Agent 模式

### 1. Sequential Pipeline（順序管線）
固定順序處理。適合 ETL、文件處理。
```
Agent A → Agent B → Agent C → 結果
```

### 2. Coordinator/Dispatcher（協調器）
根據任務類型動態路由。適合客服、分類問題。
```
Coordinator → [Agent A | Agent B | Agent C]
```

### 3. Parallel Fan-Out/Gather（平行扇出）
多個 Agent 同時執行，結果合併。適合多角度分析。
```
Task → [Agent A, Agent B, Agent C] → Synthesizer
```

### 4. Hierarchical Decomposition（階層分解）
遞迴拆解任務。適合複雜專案規劃。
```
Manager → [Sub-Manager A → [Worker 1, Worker 2], Sub-Manager B → [Worker 3]]
```

### 5. Generator & Critic（生成-評審）
對抗式精煉。適合程式碼生成、文案撰寫。
```
Generator → Critic → Generator → Critic → ... → 通過
```

### 6. Iterative Refinement（迭代精煉）
回饋驅動的改善。適合翻譯、摘要品質提升。
```
Draft → Evaluate → Refine → Evaluate → ... → 達標
```

### 7. Human-in-the-Loop（人在迴圈中）
關鍵節點需要人工審核。適合高風險決策。
```
Agent → Checkpoint → Human Approval → Continue
```

### 8. Composite Pattern（複合模式）
以上模式的組合。現實系統通常是複合的。

## Harness 設計

### Anthropic 雙代理架構
- **Initializer Agent**：讀取 progress.txt，規劃下一步
- **Executor Agent**：執行具體任務，更新 progress.txt
- 跨 session 狀態透過檔案持久化
- GAN 風格的 Generator-Evaluator 迴圈

### Phil Schmid 的 Harness 觀點
- CPU/OS/App 類比：Model → Harness → Agent
- Harness 是 Model 能力和應用行為之間的抽象層
- 今天的 workaround 會變成明天的 bug → 設計要可簡化
- Benchmark 和真實場景有落差，不要只看跑分

### LangGraph 工作流程
- 有向圖（DAG）表示工作流程
- State 是型別化的 dict，流經圖的每個節點
- 條件邊（Conditional Edges）基於 state 判斷走向
- 支援迴圈、重試、動態路由
- 三種經典 RAG 模式：Baseline、Agentic、Plan-Execute

## Agent 設計原則

1. **最小工具集**：給 Agent 最少但足夠的工具，太多工具增加選擇錯誤的機率
2. **明確的停止條件**：設定最大步數、timeout、信心閾值
3. **可觀察性**：每一步都要可追蹤，用 Langfuse 等工具
4. **優雅降級**：工具失敗時有 fallback 策略
5. **狀態持久化**：長時間任務需要 checkpoint 機制
