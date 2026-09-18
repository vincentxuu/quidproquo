# Ask AI Agentic Pipeline

## 1. 使用者意圖

問站內問題的人，想「很快拿到有根據的答案」：目錄型問題要清單與連結、存在查詢要一句話答覆、比較型問題要跨篇觀點、深挖型問題要完整脈絡。不是想看 pipeline 的中間過程。

## 2. 現況苦工（pipeline 視角）

- 固定 Planner→Research→Writer→Validation→Critic，簡單問題（q15 存在查詢）也付全額延遲
- 重試由程式寫死：Critic 打回 → 換詞重搜 → 草稿重寫，q21 事故中 3 輪 pass、51 秒、多份草稿被 SSE 串接
- Writer 不會主動讀文章全文，metadata 不夠時容易被 Critic 打回
- 目錄型 / 推薦型 / 比較型共用同一套 rubric，q21 需要特例 hack（catalog rubric）

## 3. Agent 介入設計（模式：單一 agent + 唯讀工具 + skill）

### UI 流程

UI 不變：`/api/chat` 入口、SSE 事件、InlineAsk / ChatFloating / chat 頁皆不動。改的是 `/api/chat` 內呼叫的 pipeline。

### 後端包裝

- 引擎：重用 `src/lib/agent/kernel.ts` 的 `defineAgent`（`toolCallLimit`、`timeoutSeconds` 已內建）
- Agent：`ask-ai` 單一 agent，唯讀權限
- Tools（皆為已註冊 syscall）：
  - `search_posts`（`src/lib/retrieval/tools/search-posts.ts`）— 混合檢索
  - `post.get-detail`（`src/lib/tool-registry/definitions/get-post-detail.ts`）— 讀全文
- Skill：站內問答規則（何時補搜、讀全文、附來源、不足時誠實說），以 system prompt 注入，不是獨立 agent
- 控制邊界：工具唯讀、toolCallLimit ≤ 8、timeout、引用成員檢查（沿用 citation membership）、每步 tool call 記為 trace step
- 語意快取：agent 流程啟用時 bypass 或升 cache generation，避免舊答案污染

## 4. 可控性檢查

- [x] 每個 agent 動作前後都有控制點：工具唯讀 + 步數/時間上限 + 引用檢查（程式控制，非 agent 自律）
- [x] 結果落在使用者預期內：skill 規範四種任務原型（目錄清單／存在查找／跨篇比較／單篇深挖）的答覆形式
- [x] 失敗路徑保留：超限或引用檢查不過 → 退回現有固定 pipeline 或 fallback，不回空答案
- [x] 不是右邊 chat 視窗，是融進流程：使用者完全無感，只有答案品質與速度變化

## 5. 相關既有程式與文件

- 入口：`src/pages/api/chat.ts`（SSE、快取、trace、rate limit 皆在此）
- 引擎：`src/lib/agent/kernel.ts`（`defineAgent`、`toolCallLimit`、`timeoutSeconds`）
- 工具：`src/lib/retrieval/tools/search-posts.ts`、`src/lib/tool-registry/definitions/get-post-detail.ts`
- 現有 pipeline：`src/lib/conversation/pipeline.ts` → `engines/langgraph` / `engines/manual`（保留為 fallback 與 shadow baseline）
- 驗收與評估：`docs/rag-golden-dataset.json`（q01–q21）、`docs/rag-evaluation-runbook.md`（live eval 需 admin cookie + `cacheMode: bypass`）
- 歷史事故：runbook q21（51 秒、3 輪 pass、草稿串接）

## 6. 驗收案例

- A（q21 目錄型）：4 篇 course map 齊全、延遲 ≤ 15 秒、單一版本回答、無無關來源
- C（q02 比較型）：兩篇皆在引用、trace 可見自主補搜或 read_post、先分述後比較
- 回歸：現有 q21 retrieval contract（8 項）與 offline fixture 仍須通過

## 7. 下一步

- [ ] 實作 `/api/chat` SSE 新增事件：`step_start`、`tool_call`、`tool_result`、`step_complete`
- [ ] 前端用 `ChainOfThought` + `ChainOfThoughtStep` + `ChainOfThoughtSearchResults` 呈現上述事件
- [ ] 先跑 shadow 對照（現有 pipeline vs agent）再決定切換比例

## 8. 最佳實踐（Chain of Thought UI 回饋）

原則：**可觀察、不擾民、來源可追蹤**。使用者展開折疊後，看到 agent 做了什麼、用了哪些工具、結果多少；不暴露 prompt、原始 chunk 或中間草稿。

### SSE 事件設計（不改 `/api/chat` 入口，只補事件類型）

```
event: step_start    <- 步驟開始，前端設為 pending
data: {"label":"檢索站內文章","description":"search_posts(query='課程文章')"}

event: tool_call     <- 工具實際調用
data: {"tool":"search_posts","label":"搜尋工具調用","args":{"query":"課程文章"}}

event: tool_result   <- 工具結果，對應 ChainOfThoughtSearchResults
data: {"tool":"search_posts","label":"檢索結果","count":4,"results":[{"title":"...","url":"...","slug":"..."}]}

event: step_complete <- 步驟完成，前端設為 complete
data: {"label":"檢索站內文章","status":"complete"}
```

對應關係：

- `step_start` + `step_complete` → 一個 `ChainOfThoughtStep`（`label`、`description`、`status: pending → active → complete`）
- `tool_call` → 該步驟內的「工具」小標題
- `tool_result` → `ChainOfThoughtSearchResults` 內的 `ChainOfThoughtSearchResult` badge（可點擊連到原文）
- `token` + 最終 `sources` 仍走既有流程，但建議最終答案包在 `ChainOfThoughtContent` 區塊

### UI 渲染結構（建議）

```jsx
<ChainOfThought defaultOpen={true}>
  <ChainOfThoughtHeader>思考過程</ChainOfThoughtHeader>
  {message.steps.map((s, i) => (
    <ChainOfThoughtStep
      key={s.id}
      label={s.label}
      description={s.description}
      status={s.status}
      icon={s.icon}
    >
      {s.tool && <ToolBadge name={s.tool} />}
      {s.results?.length > 0 && (
        <ChainOfThoughtSearchResults>
          {s.results.map(r => (
            <a key={r.url} href={r.url} target="_blank" rel="noreferrer">
              <ChainOfThoughtSearchResult>{r.title}</ChainOfThoughtSearchResult>
            </a>
          ))}
        </ChainOfThoughtSearchResults>
      )}
      {i === message.steps.length - 1 && (
        <ChainOfThoughtContent>{finalAnswer}</ChainOfThoughtContent>
      )}
    </ChainOfThoughtStep>
  ))}
</ChainOfThought>
```

### 設計約定

- **狀態機**：每步驟只有 `pending → active → complete / error`，不展示虛假進度百分比。
- **標籤**：用使用者易懂名詞（「檢索站內文章」），不是程式階段名（`Research`）。
- **描述**：只放關鍵參數（搜的詞、讀的 slug）；不暴露完整 prompt / API payload。
- **來源**：搜尋結果以 badge 呈現，點擊可到原文；引用成員檢查沿用既有 citation membership。
- **錯誤**：工具失敗顯示該步驟 `error` + 簡短原因，不中斷整個鏈。
- **首預設**：`ChainOfThought` 折疊，使用者主動展開；不一開始占滿畫面。
- **不變動**：InlineAsk / ChatFloating / chat 頁佈局；SSE 入口與事件基礎格式。

