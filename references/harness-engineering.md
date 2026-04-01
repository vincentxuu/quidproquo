# Harness Engineering 參考

## 什麼是 Harness Engineering

Harness 是 LLM 和應用之間的控制層，負責管理 Agent 的生命週期、狀態、工具呼叫、錯誤處理和回饋迴路。

```
使用者 → Harness → LLM → Tool Calls → Harness → 結果
              ↑                              |
              └── 狀態管理 / 記憶 / 日誌 ←──┘
```

### 與 Prompt Engineering 的差異
- **Prompt Engineering**：優化單次 LLM 呼叫的輸入
- **Context Engineering**：決定送什麼資訊給 LLM
- **Harness Engineering**：設計整個 Agent 執行系統的架構

## 核心組件

### 1. Orchestrator（編排器）
控制 Agent 的執行流程：
- **Loop Controller**：ReAct loop 的進入/退出條件
- **Router**：根據意圖分派到不同 Agent 或工具
- **Scheduler**：多步任務的排程和優先級
- **Circuit Breaker**：連續失敗時中斷，避免無限迴圈

### 2. State Manager（狀態管理）
```
┌─────────────────────────────────┐
│ Ephemeral State（記憶體）        │ ← 當前 turn 的中間結果
├─────────────────────────────────┤
│ Session State（快取/DB）         │ ← 對話歷史、context window
├─────────────────────────────────┤
│ Persistent State（檔案/DB）      │ ← 跨 session 的進度、記憶
└─────────────────────────────────┘
```
- 檔案系統是最簡單的持久化（progress.txt 模式）
- 資料庫適合多使用者、需要查詢的場景
- 狀態要可序列化，支援 checkpoint 和恢復

### 3. Tool Registry（工具註冊）
- 每個工具需要：名稱、描述、參數 schema、執行函數
- MCP（Model Context Protocol）標準化工具定義
- 動態載入：根據任務類型只掛載需要的工具
- 工具太多會降低選擇準確率（建議 < 20 個）

### 4. Guard System（護欄系統）
```
Input Guards → LLM → Output Guards → Tool Guards → 執行
```
- **Input Guards**：PII 偵測、injection 防護、長度限制
- **Output Guards**：格式驗證、幻覺偵測、毒性過濾
- **Tool Guards**：權限檢查、參數驗證、速率限制
- **Budget Guards**：token 預算、API 成本、時間限制

## 設計模式

### Initializer-Executor 模式（Anthropic）
```
Session Start
    → Initializer Agent：讀 progress.txt → 規劃下一步
    → Executor Agent：執行任務 → 更新 progress.txt
Session End
    → 狀態持久化到檔案
```
- 分離「規劃」和「執行」的關注點
- 跨 session 靠檔案傳遞狀態
- 適合長期運行的開發任務

### Generator-Evaluator 迴圈
```
Generator → 產出 → Evaluator → 通過？
    ↑                           | No
    └───── 回饋 ←──────────────┘
```
- GAN 風格的品質控制
- Evaluator 可以是另一個 LLM 或規則引擎
- 設定最大迭代次數防止無限迴圈

### Checkpoint-Resume 模式
```
Task 1 ✓ → checkpoint → Task 2 ✓ → checkpoint → Task 3 ...
                                                    ↓ 失敗
                                              從 checkpoint 恢復
```
- 每完成一個子任務就儲存進度
- 失敗時從最近的 checkpoint 恢復
- 適合多步驟、長時間的工作流程

### Escalation 模式
```
Agent 嘗試 → 成功？→ 完成
                | No
          重試（不同策略）→ 成功？→ 完成
                              | No
                    升級到人工 / 更強模型
```
- 先用便宜的模型，失敗再升級
- 最後一層是 Human-in-the-Loop
- 記錄每次升級的原因，用於改進

## 狀態持久化策略

### 檔案系統模式
```
project/
├── progress.txt      # 當前進度和下一步
├── context.json      # 累積的上下文
├── checkpoints/      # 各步驟的快照
│   ├── step-01.json
│   └── step-02.json
└── logs/             # 執行日誌
    └── session-xxx.log
```
- 優點：簡單、可讀、Git 友善
- 缺點：不支援並發、查詢能力弱
- 適合：單 Agent、開發任務

### 資料庫模式
```sql
-- 核心表
sessions (id, user_id, created_at, state)
messages (id, session_id, role, content, tokens)
tool_calls (id, message_id, tool_name, args, result, latency)
checkpoints (id, session_id, step, state_snapshot)
```
- 優點：支援並發、可查詢、可分析
- 缺點：複雜度高
- 適合：多使用者、生產環境

## 錯誤處理

### 分層錯誤策略
| 層級 | 錯誤類型 | 處理方式 |
|------|---------|---------|
| LLM | API timeout / rate limit | 指數退避重試 |
| LLM | 輸出格式錯誤 | 重新生成 + 更嚴格的 prompt |
| Tool | 工具執行失敗 | 重試 → 替代工具 → 跳過 |
| Logic | Agent 進入死迴圈 | 步數上限 + 強制退出 |
| Budget | Token/成本超限 | 降級模型 → 摘要壓縮 → 停止 |

### 死迴圈防護
```python
MAX_ITERATIONS = 10
SIMILARITY_THRESHOLD = 0.95

for i in range(MAX_ITERATIONS):
    result = agent.step()
    if result.done:
        break
    if similarity(result, previous_result) > SIMILARITY_THRESHOLD:
        # Agent 在重複自己，強制退出
        break
    previous_result = result
```

## 可觀測性

### 追蹤層級
```
Trace（一次完整任務）
  └── Span（一個 Agent turn）
       ├── LLM Call（模型呼叫）
       ├── Tool Call（工具呼叫）
       └── Guard Check（護欄檢查）
```

### 關鍵指標
| 指標 | 說明 | 告警閾值 |
|------|------|---------|
| Steps per task | 完成任務平均步數 | > 預期 2x |
| Tool error rate | 工具呼叫失敗率 | > 10% |
| Loop detection | 死迴圈觸發次數 | 任何觸發都要調查 |
| Token efficiency | 有效 token / 總 token | < 50% 需優化 |
| Task completion | 任務成功完成率 | < 90% |
| Cost per task | 每次任務平均成本 | 依預算設定 |

### 推薦工具
- **Langfuse**：開源，追蹤 LLM 呼叫、成本、品質
- **LangSmith**：LangChain 生態，視覺化 Agent 執行路徑
- **Braintrust**：評估 + 追蹤一體化
- **OpenTelemetry**：通用追蹤標準，可接入現有監控

## 設計原則

1. **隨模型進步可簡化**：今天的 workaround 明天可能不需要，Harness 設計要能逐步拆除
2. **狀態最小化**：只持久化恢復執行所需的最少資訊
3. **失敗即可見**：每個錯誤都要被記錄和分類，沉默失敗是最大的敵人
4. **人工介入是功能不是 bug**：設計明確的升級路徑，不要試圖全自動
5. **成本意識**：每個 LLM 呼叫都有成本，用便宜的模型做篩選，貴的模型做精煉
6. **可測試性**：Harness 的每個組件都應該可以獨立測試，不依賴 LLM
