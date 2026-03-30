# AI Agent 架構模式參考

## 目錄

1. [八種 Multi-Agent 模式](#八種-multi-agent-模式)
2. [Harness 設計](#harness-設計)
3. [LangGraph 工作流程](#langgraph-工作流程)
4. [Agent 設計原則](#agent-設計原則)

---

## 八種 Multi-Agent 模式

| 模式 | 說明 | 適用場景 |
|------|------|---------|
| **Sequential Pipeline** | 固定順序 `A → B → C → 結果` | ETL、文件處理 |
| **Coordinator/Dispatcher** | 根據任務類型動態路由到不同 Agent | 客服、分類問題 |
| **Parallel Fan-Out/Gather** | 多 Agent 同時執行，結果合併 | 多角度分析 |
| **Hierarchical Decomposition** | 遞迴拆解任務，Manager → Sub-Manager → Worker | 複雜專案規劃 |
| **Generator & Critic** | 對抗式精煉，Generator ↔ Critic 迴圈 | 程式碼生成、文案 |
| **Iterative Refinement** | 回饋驅動改善 Draft → Evaluate → Refine | 翻譯、摘要品質提升 |
| **Human-in-the-Loop** | 關鍵節點需人工審核 | 高風險決策 |
| **Composite Pattern** | 以上模式的組合，現實系統通常是複合的 | 生產環境 |

---

## Harness 設計

### Anthropic 雙代理架構

- **Initializer Agent**：讀取 `progress.txt`，規劃下一步
- **Executor Agent**：執行具體任務，更新 `progress.txt`
- 跨 session 狀態透過檔案持久化
- GAN 風格的 Generator-Evaluator 迴圈

### Phil Schmid 的 Harness 觀點

- **CPU/OS/App 類比**：Model → Harness → Agent
- Harness 是 Model 能力和應用行為之間的抽象層
- 今天的 workaround 會變成明天的 bug → 設計要可簡化
- Benchmark 和真實場景有落差，不要只看跑分

---

## LangGraph 工作流程

- 有向圖（DAG）表示工作流程，State 是型別化 dict 流經每個節點
- 條件邊（Conditional Edges）基於 state 判斷走向，支援迴圈、重試、動態路由
- 三種經典 RAG 模式：**Baseline**、**Agentic**、**Plan-Execute**

---

## Agent 設計原則

1. **最小工具集**：給 Agent 最少但足夠的工具，太多工具增加選擇錯誤的機率
2. **明確的停止條件**：設定最大步數、timeout、信心閾值
3. **可觀察性**：每一步都要可追蹤，用 Langfuse 等工具
4. **優雅降級**：工具失敗時有 fallback 策略
5. **狀態持久化**：長時間任務需要 checkpoint 機制
