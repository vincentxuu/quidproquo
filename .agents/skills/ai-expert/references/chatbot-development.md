# 聊天機器人應用開發參考

## 目錄

1. [對話狀態管理](#對話狀態管理)
2. [Streaming 實作](#streaming-實作)
3. [Guardrails 安全機制](#guardrails-安全機制)
4. [可觀測性](#可觀測性)
5. [技術棧選型](#技術棧選型)

---

## 對話狀態管理

### 狀態類型
- **Session State**：當前對話上下文（短期）
- **User State**：使用者偏好、歷史互動（長期）
- **Global State**：系統設定、知識庫版本

### 對話歷史策略

| 策略 | 做法 | 適用 |
|------|------|------|
| Sliding Window | 保留最近 N 輪 | 簡單場景 |
| Summary + Recent | 摘要舊對話 + 保留近幾輪 | 平衡方案 |
| Selective Memory | 只保留標記為重要的對話 | 精確但需額外邏輯 |

---

## Streaming 實作

- Content type: `text/event-stream`
- Chunk 格式：`data: {"content": "..."}\n\n`
- 結束：`data: [DONE]\n\n`
- 客戶端用 `EventSource` 或 `fetch` + `ReadableStream`
- 錯誤處理：stream 中斷時要能重連或顯示錯誤

---

## Guardrails 安全機制

| 層級 | 機制 |
|------|------|
| **Input** | Prompt Injection 偵測、PII 偵測遮蔽、內容分類、長度限制 |
| **Output** | Faithfulness Check、Toxicity Filter、格式驗證、Hallucination Detection |
| **System** | Rate Limiting、Token Budget、Fallback 降級策略 |

---

## 可觀測性

### 關鍵指標

| 指標 | 說明 | 目標 |
|------|------|------|
| TTFT | Time to First Token | < 500ms |
| Latency | 完整回應時間 | < 3s（簡單問題） |
| Faithfulness | 回答忠實度 | > 0.9 |
| User Satisfaction | 使用者滿意度 | > 4/5 |
| Token Cost | 每次對話成本 | 依預算設定 |

### 推薦工具
- **Langfuse**：開源，追蹤 LLM 呼叫、成本、品質、Session 級別追蹤
- **LangSmith**：LangChain 生態，視覺化 Agent 執行路徑
- **Braintrust**：評估 + 追蹤一體化

### 告警觸發
- Faithfulness 低於閾值 → 檢查 retrieval 品質
- Latency spike → 檢查 LLM provider 狀態
- Error rate 上升 → 檢查 tool calling 失敗率

---

## 技術棧選型

| 棧 | 組合 | 優勢 |
|----|------|------|
| **TS / Cloudflare** | Hono + AI SDK, Vectorize + D1 + Workers AI | 邊緣部署、低延遲 |
| **Python** | FastAPI + LangChain/LlamaIndex, Qdrant/Weaviate + PostgreSQL | ML 生態完整 |

**選型原則**：已有基礎設施跟著走；從零開始看團隊技能；需要 fine-tuning 必須 Python；純 RAG 兩者皆可
