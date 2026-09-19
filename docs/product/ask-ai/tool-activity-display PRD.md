# Ask AI 工具活動顯示（比照 claude.ai tool-use UI）

登錄：2026-09-19。狀態：已實作（Phase 1–3 一次做完，Phase 4 待 agentic pipeline），未 commit。前作：`agentic-pipeline PRD.md`（同目錄）。
參考畫面：使用者提供的 claude.ai 截圖 8 張（2026-09-19 session），觀察結果見 §1。

## 0. 現況診斷（截圖 + 程式對照）

現在的「思考過程」出現 `分析問題 → 規劃檢索策略 → 規劃檢索策略 → 分析問題 → 檢索站內文章 → 檢索站內文章…`，不是資料錯，是**同一個階段被送了三次、標籤又不一致**：

| 來源 | 事件 | 標籤 | 前端動作 |
|---|---|---|---|
| `src/pages/api/chat.ts:181` | `step_start` | 分析問題 | push 一筆 |
| `src/pages/api/chat.ts:185` | `tool_call planner` | 規劃檢索策略 | push 一筆 |
| `chat.ts:203`（每個 node） | `step_start` | `getStepLabel(agent)` → Planner=規劃檢索策略 | push 一筆 |
| `chat.ts:204`（每個 node） | `agent_step` | 前端 `labelMap` → Planner=分析問題 | **又 push 一筆** |
| `chat.ts:199/226` | `step_complete` | 依 label 比對 | 只改 status |

`src/components/Chat/ChatWidget.tsx:164-201` 的 reducer 對 `step_start`、`tool_call`、`agent_step` 一律 append，沒有 id 可對齊。伺服器端 `getStepLabel`（`chat.ts:456`）和前端 `labelMap`（`ChatWidget.tsx:189`）是兩份手抄表，Planner 的翻譯還不一樣。

畫面醜的兩個根因：

1. **公開頁沒載 Tailwind preflight**。`src/styles/chat.css` 只 import `theme` + `utilities`，shadcn／ai-elements 假設 preflight 存在。「思考過程」那列是 Radix `CollapsibleTrigger` 的 `<button>`，拿到瀏覽器原生按鈕樣式（灰底、深框、系統 padding）。admin 用的 `globals.css` 是全量 import，所以後台正常前台不正常。
2. **三套設計語言並存**（commit 6618b36c 刻意加的）：pills 用 inline style、ChainOfThought 用 Tailwind token、Reasoning 又一套；頭像是 dicebear 卡通機器人。沒有共用字級與間距。

症狀：五步印成十行；狀態灰階沒意義（跑完全灰，第一行更淡是孤兒 `pending` 事件）；`100% confidence` 英文小灰字孤零零飄在左上；每行同一顆腦袋 icon；捲底按鈕壓在內容上。

**這份 PRD 把三層收成一層，會推翻 6618b36c 的決定，實作前要使用者點頭。**

## 1. 參考畫面觀察：claude.ai 怎麼做

從 8 張截圖歸納出的規則，之後的設計全部照這些走：

| # | 觀察 | 對我們的意義 |
|---|---|---|
| R1 | **工具活動是一行灰字，沒有框、沒有 icon、沒有 pills、沒有時間軸**。與正文同一左邊界，字色 muted，尾端一個 `›`。 | 刪掉 `AgentSteps` pills 與 `ChainOfThought` 時間軸。 |
| R2 | **連續工具呼叫合併成一行**：`Ran 7 commands, read 3 files ›`；單一檔案時直接寫檔名 `read user.controller.ts`。過去式、動詞開頭、帶數量。 | 我們的階段固定，可以寫死：`檢索了 6 篇文章 ›`、`檢索了 6 篇文章、推薦 3 篇延伸閱讀 ›`。 |
| R3 | **工具行穿插在正文段落之間**，照發生順序；不是集中在訊息頂端。 | 現在 Writer 一次吐整段（`graph.ts:179` 直接 `onToken(final_response)`），做不到穿插；先做「答案前一行」，等 `agentic-pipeline PRD` 的 tool loop 上線再穿插。 |
| R4 | **展開第一層**是一個有邊框的清單，每列是一句人話描述（`Audited enforced gates across repos ›`），每列還能再展開。 | 每列 = 一次工具呼叫：`檢索站內文章 「AI agent、入門」 · 6 篇 ›`。 |
| R5 | **展開第二層**是 `Request` / `Response` 兩段原始 JSON，語法上色、可捲動、截斷不美化。 | 用純 `<pre>`；`ai-elements/tool.tsx` 的 `CodeBlock` 綁 shiki，不值得為公開頁多載一個 highlighter。 |
| R6 | **思考中沒有 spinner**，是頭像旁一個會換的動詞（`Musing`、`Sifting`），muted 色。 | **使用者決定保留原本的軌道動畫＋三點**，只把字改成會換：`思考中`→`檢索中`→`整理中`。 |
| R7 | **工具執行中**：兩顆品牌色小點動畫 + 來源小徽章（`G`）+ 工具名 + `›`；完成後小點變三顆 muted，正文開始時整行輕微淡出。 | 同 R6 用原軌道動畫，標籤 `檢索中`，下方一行 `檢索站內文章 「關鍵字」`；不做徽章、不做小點。 |
| R8 | **沒有 confidence、沒有進度 pills、沒有驗證／評分步驟**。內部檢查不對讀者顯示。 | Validation／Critic 不顯示；`confidence` 從畫面拿掉（留在 `done` 事件給 admin／trace 用）；只有 Fallback 觸發時顯示一行 `找不到足夠來源，改用備援回答`。 |
| R9 | 頭像是一個小色塊記號（starburst），完成後出現在訊息尾端當簽名，沒有卡通臉。 | 換成站內 Ask AI 的 sparkle 方塊（header 已有），小尺寸、muted。 |
| R10 | 正文排版：段落 foreground、標題 serif、引用左線；工具行與正文字級相同只差顏色。 | **配色使用者指定沿用原 pills 那組**：文字 `brand-700` 粗體、hover `brand-50`、meta `text-muted`；不做 pill 底、不做圓點。 |

## 2. 使用者意圖

問問題的人想在等待時知道「它現在在幹嘛」，答案出來後想**一眼確認根據**（查了哪幾篇）就往下讀。過程是可查的附註，不是主角。

## 3. 設計（模式 C：融在回答流程裡的一行提示，不另開視窗）

### 3.1 訊息的四個狀態

```
[等待中]    ◐ 思考中 •••                                ← 原軌道動畫，字隨 node 換
[檢索中]    ◐ 檢索中 •••  ／ 檢索站內文章 「AI agent、入門」  ← 同上，下方補一行工具＋關鍵字
[已完成]    檢索了 6 篇文章、推薦 3 篇延伸閱讀 ›         ← 一行 muted 灰字，收合
            （正文開始）
[展開一層]  ┌────────────────────────────────────┐
            │ 分析問題 · 思考 1.2 秒             › │
            │ 檢索站內文章 「AI agent、入門」 · 6 篇 › │
            │ 推薦相關文章 · 3 篇                › │
            └────────────────────────────────────┘
[展開二層]  Request  { "keywords": ["AI agent", "入門"] }
            Response { "count": 6, "results": [ {title, url, type}, … ] }
```

- 等待中的動詞表：初始=`思考中`、Planner 完成後=`檢索中`、Research 完成後=`整理中`、Writer=`整理中`、Validation／Critic=`整理中`（不揭露）、Fallback=`改用備援中`。
- 已完成那一行的文案由 reducer 從 step 資料組出來，規則：`檢索了 N 篇文章`；有 related 再加 `、推薦 M 篇延伸閱讀`；N=0 時寫 `沒有找到相關文章`；Fallback 時寫 `找不到足夠來源，改用備援回答`。
- 一層展開的每列：`thinking` 列（Planner／Writer／Critic 有 reasoning 文字才出現）展開是 reasoning 全文；`tool` 列展開是 Request／Response。
- 展開狀態存在該 message 的 local state，不跨 message、不持久化。
- `error` 事件：目前 active 的列標成錯誤並顯示訊息；已完成行文案改 `中途發生錯誤`。

### 3.2 元件

| 元件 | 取代 | 內容 |
|---|---|---|
| `Activity.tsx`：`ActivityLine` | `AgentSteps` + `ChainOfThoughtHeader` | 四個狀態的那一行；`<button>` reset 寫在 `chat.css`（因為沒 preflight）；`aria-live="polite"` |
| `Activity.tsx`：`ActivityList` | `ChainOfThoughtContent/Step` | 有邊框清單，每列可再展開，右端 `›` 轉 90° |
| `Activity.tsx`：`ActivityDetail` | 三塊 `Reasoning` + `ChainOfThoughtSearchResults` | thinking 列→ reasoning 文字；tool 列→ `Request`／`Response` 純 `<pre>` JSON |
| `Activity.tsx`：`ThinkingIndicator` | 原 `ChatMessageRow` 內同名元件 | 原樣搬過來，CSS 移到 `chat.css` |
| `steps-reducer.ts` | `steps-adapter.ts` | `applyStepEvent`／`pendingActivity`／`summarizeActivity`／`visibleSteps`，全純函式有測試 |

`ChatMessageRow.tsx` 的 assistant 分支變成：`ActivityLine` → 正文 → 來源卡（既有 `LinkSection`）。`Avatar` 改用 sparkle 方塊；`messageHeader`／`confidence` 刪除。

### 3.3 資料契約：一個 step 一個 id

前端 `Step` 改成以 `id` 為 key 的 map，事件只做 upsert：

```ts
interface Step {
  id: string              // `${agent}` 或 `${agent}:${n}`（重試時 n 遞增）
  kind: 'thinking' | 'tool' | 'check'
  label: string           // 現在式（列用）：檢索站內文章
  status: 'active' | 'complete' | 'error'
  input?: { keywords?: string[]; query?: string }
  output?: { count?: number; results?: {title,url,type}[]; passed?: boolean }
  reasoning?: string
  duration_ms?: number
}
```

已完成行的過去式文案不放在 step 上，由 `summarizeActivity(steps)` 純函式產生（可測）。

後端改為送單一 `step` 事件（`{ id, kind, label, status, input?, output?, reasoning?, duration_ms? }`）。pipeline 的 `onStep` 是 node 完成後才觸發，所以只送 `complete`；「現在在做什麼」由前端依最後完成的階段推。同 id 可多次送（reasoning 先到、results 後到）由前端 upsert 合併。`step_start / step_complete / tool_call / tool_result` 已移除；`agent_step` 保留，因為 `evals/rag/providers/ask-ai.mjs` 與 `scripts/eval-rag-baseline.mjs` 靠它統計。

標籤表收成一份：新檔 `src/lib/conversation/step-labels.ts`（純 TS、無 server 依賴），伺服器 `getStepLabel/getStepDescription` 與前端都從這裡拿；`ChatWidget.tsx` 的 `labelMap/descMap` 刪除。

`search_keywords` 目前沒送到前端：`graph.ts:170` 與 `pipelines/manual.ts:72` 的 Research `onStep` extra 補 `search_keywords: state.plan.search_keywords`，`chat.ts` 轉成 `step.input.keywords`。

### 3.4 Feature flag：不做

使用者要求一次做完，且前後端同一次部署、事件契約只有 `ChatWidget` 一個消費者，退回方式是 git revert，不另立 settings key。這是 UI 顯示契約，不屬於 CLAUDE.md 要求必掛 flag 的「進階／實驗技術」。

### 3.5 i18n

- 字串表 `src/i18n/chat.ts`（`chatStrings['zh-TW'|'en']` + `chatT(lang)`，取法同 `console.ts`），涵蓋活動列、header、建議題、quota、錯誤、InlineAsk 全部 UI 字串；英文建議題另列 `SUGGESTED_QUESTIONS_EN`。
- 語言來源：`PostLayout.astro` 的 `lang` → `ChatFloating lang` → `ChatWidget lang` → `ChatLocaleProvider`（`src/components/Chat/locale.tsx`）；`[...slug].astro` 同樣把 `lang` 給 `InlineAsk`；`/chat` 頁只有中文版，走預設。
- step 標籤：`step-labels.ts` 的 `getStepLabel(agent, lang)` 雙語；伺服器仍送中文 `label` 當備援，前端一律依 id＋語言重取（`stepLabel()`），所以 SSE 契約不必帶語言。
- 回答本身的語言不由 UI 決定：planner 偵測問題語言、writer 依 `state.language` 作答，本次未動。

## 4. 可控性檢查

- [x] 使用者介入點：展開／收合兩層、點結果開文章、停止生成（既有 `AbortController`）。
- [x] 結果可預期：step 詞彙固定，已完成行文案只有四種句型。
- [x] 失敗路徑：`error` 事件有對應顯示，不留在動畫狀態。
- [x] 不另開視窗：全部在 assistant 訊息內，且比現在少佔七成高度。
- [ ] 「重新生成」不在本次範圍。
- [ ] 工具行穿插正文（R3）等 agentic pipeline 上線後再做。

## 5. 相關既有程式

- 事件發送：`src/pages/api/chat.ts:179-228`、`:456-481`
- Pipeline 回呼：`src/lib/conversation/graph.ts:167-197`、`src/lib/conversation/pipelines/manual.ts:67-98`、`src/lib/retrieval/state.ts:131-137`
- 前端 reducer：`src/components/Chat/ChatWidget.tsx:149-238`
- 渲染：`src/components/Chat/ChatMessageRow.tsx:49-120`、`AgentSteps.tsx`、`steps-adapter.ts`（+ test）
- 可重用：`src/components/ai-elements/tool.tsx`（`ToolInput`／`ToolOutput`／`CodeBlock`，目前只有 `assistant-ui/thread.tsx` 用）、`shimmer.tsx`
- 要刪：`chain-of-thought.tsx` 與 `reasoning.tsx` 在 Chat 內的用法（元件檔留著給 assistant-ui）
- 樣式：`src/styles/chat.css`（無 preflight；新元件的 `<button>` 要自帶 reset）
- 其他掛載點：`ChatFloating.tsx`、`ChatThread.tsx`、`src/pages/chat.astro`、`src/layouts/PostLayout.astro`（都經由 `ChatMessageRow`，一處改全部生效）

## 6. 實作分期（Phase 1–3 已於 2026-09-19 一次完成）

### Phase 1：止血（一個 PR，不需 flag）
1. 把 `ChatWidget.tsx` 的 SSE step 處理抽成純函式 `src/components/Chat/steps-reducer.ts`，以 `tool ?? agent ?? label` 為 key upsert；`agent_step` 只合併 `sources_found`，不再 append。
2. `chat.ts:181-185` 刪掉開頭那組 `step_start 分析問題 + tool_call planner`。
3. 建 `step-labels.ts` 單一標籤表，兩端共用。
4. `chat.css` 對 `.assistant-message button` 補 reset（`background:none; border:0; padding:0; font:inherit; color:inherit; cursor:pointer`），黑框先消失。
5. vitest：`steps-reducer.test.ts` 用現況那串事件序列當 fixture，斷言輸出 5 筆不重複。

### Phase 2：新 UI（沿用現有事件）
1. `ActivityLine` / `ActivityList` / `ActivityDetail` 三個元件 + `summarizeActivity()`（含 test：四種句型）。
2. `ChatMessageRow.tsx` 換成 §3.2 的結構；刪 `AgentSteps.tsx`、`steps-adapter.ts` 與 test、`ThinkingIndicator` 與其 CSS 動畫、`messageHeader/confidence`；`Avatar` 換 sparkle。
3. 存 `duration_ms`。
4. 驗收用 `verify-real-surface`：桌機／手機寬度、深色模式（`chat.css` 的 `@custom-variant dark`）、`prefers-reduced-motion`（小點動畫停止）、螢幕閱讀器讀到 aria-live 的動詞變化。
5. 對照本文件 §1 的 R1–R10 逐條勾。

### Phase 3：事件契約 v2（後端，`chat_step_events_v2` flag）
1. `chat.ts` 送 `meta` + 統一 `step` 事件；Research extra 帶 `search_keywords`。
2. 前端 v2 reducer；v1 保留到 flag 在 production 開滿一週。
3. 移除 legacy 事件與 v1 reducer。

### Phase 4（依賴 agentic-pipeline PRD）
- agent 引擎已於 2026-09-19 落地（`rag_pipeline_engine = agent`，預設關）。多次工具呼叫已各自成列（`Research:1`、`ReadPost`），摘要行會寫「檢索了 N 篇文章、讀了 M 篇全文」。
- 尚未做的是穿插：agent 仍在最後一次吐整段答案。要達成 R3 需讓中間輪的 `onToken` 放行，`ChatMessageRow` 改成依事件順序渲染 parts。

Tier 2 事項：刪除 6618b36c 的三層顯示與 confidence 顯示——使用者於 2026-09-19 以「一次做好」核准。settings key／flag 未新增（見 §3.4）。另動了 `vitest.config.ts`（加 `oxc: { jsx: { runtime: 'automatic' } }`），否則 `.tsx` 元件測試載不進來（tsconfig 為 Astro 設 `jsx: preserve`）。

## 7. 已解／未解的假設

- ~~claude.ai 畫面憑印象~~ → 已用 8 張截圖對照，規則見 §1。
- 截圖是深色主題；淺色下 muted 灰字與 brand 小點的對比要在 Phase 2 實測，不能照抄色值。
- `Normalize` node 有標籤但 `graph.ts` 沒對它呼叫 `onStep`，v2 是否要顯示，待實作時看實際事件流決定。
