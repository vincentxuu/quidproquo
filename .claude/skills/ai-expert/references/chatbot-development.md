# 聊天機器人應用開發參考

## 對話狀態管理

### 基本架構
```
使用者訊息 → 狀態更新 → 檢索（optional）→ LLM 生成 → 回應
     ↑                                              |
     └──────── 記憶更新 ←──────────────────────────┘
```

### 狀態類型
- **Session State**：當前對話的上下文（短期）
- **User State**：使用者偏好、歷史互動（長期）
- **Global State**：系統設定、知識庫版本

### 對話歷史管理策略
- **Sliding Window**：保留最近 N 輪（簡單，但會丟失早期重要資訊）
- **Summary + Recent**：摘要舊對話 + 保留近幾輪（平衡）
- **Selective Memory**：只保留被標記為重要的對話（精確但需要額外邏輯）

## 記憶機制

### 短期記憶（In-Context）
直接放在 context window 中。受 token 限制。

### 長期記憶（Persistent）
存在外部儲存（DB、向量資料庫），需要時檢索。
- 用 embedding 搜尋相關歷史
- 用 metadata filter 篩選時間、主題
- 定期壓縮和清理

### 個性化
- 記錄使用者偏好（語言、專業程度、偏好格式）
- 在 system prompt 中注入使用者 profile
- 注意隱私：使用者應該能查看和刪除記憶

## Streaming 實作（SSE）

### 基本流程
```
Client → POST /chat → Server
Server → SSE stream → Client（逐 token 回傳）
Server → [DONE] → Client
```

### 實作要點
- 用 `text/event-stream` content type
- 每個 chunk 格式：`data: {"content": "..."}\n\n`
- 結束時送 `data: [DONE]\n\n`
- 客戶端用 `EventSource` 或 `fetch` + `ReadableStream`
- 錯誤處理：stream 中斷時要能重連或顯示錯誤

## Guardrails 安全機制

### 輸入層
- **Prompt Injection 偵測**：檢查是否試圖覆蓋 system prompt
- **PII 偵測**：辨識並遮蔽個人資訊
- **內容分類**：用分類模型過濾不當內容
- **長度限制**：防止超大輸入攻擊

### 輸出層
- **Faithfulness Check**：回答是否基於提供的 context
- **Toxicity Filter**：過濾有害內容
- **格式驗證**：確保輸出符合預期結構
- **Hallucination Detection**：比對 context，標記可能的幻覺

### 系統層
- **Rate Limiting**：每使用者、每分鐘的請求限制
- **Token Budget**：每次對話的 token 上限
- **Fallback**：LLM 失敗時的降級策略

## 可觀測性

### Langfuse
- 追蹤每次 LLM 呼叫的 input/output/token/latency
- 標記品質分數（手動或自動）
- Session 級別的對話追蹤
- 成本分析：每次對話花多少錢

### 關鍵指標
| 指標 | 說明 | 目標 |
|------|------|------|
| TTFT | Time to First Token | < 500ms |
| Latency | 完整回應時間 | < 3s（簡單問題） |
| Faithfulness | 回答忠實度 | > 0.9 |
| User Satisfaction | 使用者滿意度 | > 4/5 |
| Token Cost | 每次對話成本 | 依預算設定 |

### 告警
- Faithfulness 低於閾值 → 檢查 retrieval 品質
- Latency spike → 檢查 LLM provider 狀態
- Error rate 上升 → 檢查 tool calling 失敗率

## 技術棧推薦

### TypeScript / Cloudflare Workers
- Hono + AI SDK 或 LangChain.js
- Cloudflare Vectorize + D1 + Workers AI
- 優勢：邊緣部署、低延遲、免管伺服器

### Python
- FastAPI + LangChain 或 LlamaIndex
- Qdrant / Weaviate + PostgreSQL
- 優勢：ML 生態系完整、模型選擇多

### 選型原則
- 已有基礎設施 → 跟著走，不要為了 AI 換技術棧
- 從零開始 → TypeScript 生態更統一，Python ML 工具更多
- 需要 fine-tuning → Python 必須
- 純 RAG 應用 → 兩者皆可，選團隊熟悉的
