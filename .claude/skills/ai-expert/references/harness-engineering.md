# Harness Engineering 參考

## 目錄

1. [核心組件](#核心組件)
2. [設計模式](#設計模式)
3. [狀態持久化策略](#狀態持久化策略)
4. [錯誤處理](#錯誤處理)
5. [可觀測性](#可觀測性)
6. [設計原則](#設計原則)

---

Harness 是 LLM 和應用之間的控制層，負責管理 Agent 的生命週期、狀態、工具呼叫、錯誤處理和回饋迴路。

與 Prompt/Context Engineering 的差異：Prompt 優化單次呼叫輸入；Context 決定送什麼資訊；**Harness 設計整個 Agent 執行系統的架構**。

---

## 核心組件

| 組件 | 職責 | 關鍵設計 |
|------|------|---------|
| **Orchestrator** | 控制執行流程 | Loop Controller、Router、Scheduler、Circuit Breaker |
| **State Manager** | 管理三層狀態 | Ephemeral（記憶體）→ Session（快取/DB）→ Persistent（檔案/DB） |
| **Tool Registry** | 工具註冊與管理 | MCP 標準化、動態載入、建議 < 20 個工具 |
| **Guard System** | 護欄系統 | Input Guards → Output Guards → Tool Guards → Budget Guards |

---

## 設計模式

### Initializer-Executor（Anthropic）
- **Initializer**：讀 `progress.txt` → 規劃下一步
- **Executor**：執行任務 → 更新 `progress.txt`
- 跨 session 靠檔案傳遞狀態，適合長期運行的開發任務

### Generator-Evaluator 迴圈
- GAN 風格：Generator 產出 → Evaluator 評估 → 不通過則回饋重來
- Evaluator 可以是另一個 LLM 或規則引擎
- 設定最大迭代次數防止無限迴圈

### Checkpoint-Resume
- 每完成子任務就儲存進度，失敗從最近 checkpoint 恢復
- 適合多步驟、長時間工作流程

### Escalation
- 先用便宜模型 → 失敗升級更強模型 → 最後 Human-in-the-Loop
- 記錄每次升級原因用於改進

---

## 狀態持久化策略

### 檔案系統模式
```
project/
├── progress.txt      # 當前進度和下一步
├── context.json      # 累積的上下文
├── checkpoints/      # 各步驟快照
└── logs/             # 執行日誌
```
簡單、可讀、Git 友善。適合單 Agent、開發任務。不支援並發。

### 資料庫模式
```sql
sessions (id, user_id, created_at, state)
messages (id, session_id, role, content, tokens)
tool_calls (id, message_id, tool_name, args, result, latency)
checkpoints (id, session_id, step, state_snapshot)
```
支援並發、可查詢、可分析。適合多使用者、生產環境。

---

## 錯誤處理

| 層級 | 錯誤類型 | 處理方式 |
|------|---------|---------|
| LLM | API timeout / rate limit | 指數退避重試 |
| LLM | 輸出格式錯誤 | 重新生成 + 更嚴格 prompt |
| Tool | 工具執行失敗 | 重試 → 替代工具 → 跳過 |
| Logic | Agent 進入死迴圈 | 步數上限 + 強制退出 |
| Budget | Token/成本超限 | 降級模型 → 摘要壓縮 → 停止 |

### 死迴圈防護
```python
MAX_ITERATIONS = 10
SIMILARITY_THRESHOLD = 0.95
for i in range(MAX_ITERATIONS):
    result = agent.step()
    if result.done or similarity(result, prev) > SIMILARITY_THRESHOLD:
        break
    prev = result
```

---

## 可觀測性

| 指標 | 說明 | 告警閾值 |
|------|------|---------|
| Steps per task | 完成任務平均步數 | > 預期 2x |
| Tool error rate | 工具呼叫失敗率 | > 10% |
| Loop detection | 死迴圈觸發次數 | 任何觸發都要調查 |
| Token efficiency | 有效 token / 總 token | < 50% 需優化 |
| Task completion | 任務成功完成率 | < 90% |

推薦工具：**Langfuse**（開源）、**LangSmith**（LangChain 生態）、**Braintrust**（評估+追蹤）、**OpenTelemetry**（通用標準）

---

## 設計原則

1. **隨模型進步可簡化**：今天的 workaround 明天可能不需要，設計要能逐步拆除
2. **狀態最小化**：只持久化恢復執行所需的最少資訊
3. **失敗即可見**：每個錯誤都要被記錄和分類，沉默失敗是最大的敵人
4. **人工介入是功能不是 bug**：設計明確的升級路徑
5. **成本意識**：便宜模型做篩選，貴的模型做精煉
6. **可測試性**：每個組件都應可獨立測試，不依賴 LLM
