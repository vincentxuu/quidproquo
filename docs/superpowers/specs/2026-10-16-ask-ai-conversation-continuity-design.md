# Ask AI 對話連續性設計

日期：2026-10-16

## Goal

讓讀者跟 Ask AI 的對話**不要斷**：重新整理、關掉側欄再打開、換頁之後，同一段對話還在；追問時 AI 記得前面幾輪在講什麼。

技術前提：**對話逐字稿存在讀者自己的瀏覽器，不存在伺服器。** 清除權在使用者手上。

實作狀態（2026-10-16）：階段 1 與階段 2 都已實作，見下方 Steps 與 Verification。

## Non-goals

- **不做「歷史對話清單」**（可切回多條舊對話）。理由見下方「為什麼不做清單」；這是有紀錄的決定，不是忘了做。
- 不新增讀者帳號或登入。
- 不動 `chat_logs` 的寫入內容，不新增 D1 表或 migration。
- 不把逐字稿送上伺服器儲存（維持伺服器端沒有任何「使用者對話」資料面）。請求會帶最近幾輪，但伺服器只用在當下這一輪的提示，不落地。
- 不改文章頁的頁面脈絡 chip 行為。
- 不顯示「記得前面 N 輪」chip：記憶的證據就是畫面上的對話本身，多一顆 chip 是重複的 UI（原 Open question 2 的決定）。

## Current context

現況（皆為 code 事實）：

- 訊息只存在 React state，初始值只有一句 welcome：`src/components/Chat/ChatWidget.tsx:133`。
- 只有 `chat_thread_id` 落 localStorage：`ChatWidget.tsx:143-167`。
- 關掉面板就 unmount，訊息直接消失：`ChatSidebar.tsx:42`、`ChatFloating.tsx:13` 都是 `{open && <ChatWidget />}`；`/chat` 頁重整同理（`src/pages/chat.astro:38`）。
- 每輪只送 `{ message, thread_id }`：`ChatWidget.tsx:195-199`。
- 伺服器端唯一的「記憶」是 checkpoint 摘要，且要 token 超過門檻才寫入：`src/lib/conversation/checkpoints.ts:19-57`、`src/pages/api/chat.ts:125`。
- 伺服器有寫 `chat_logs`（一列 = 一問一答），但沒有任何地方讀回來：`src/pages/api/chat.ts:355`、`migrations/0002_rag_phase1.sql:22`。

站內既有的第一方描述（動這個 widget 時必須保持一致）：

- `ai/2026-08-30-ask-ai-pipeline-overview.md:26,38`：`thread_id` 是對話鍵，checkpoint 每輪載入。
- `ai/2026-08-30-ask-ai-runtime-observability.md:106`：checkpoint 只能回答「哪段歷史摘要進入下一輪」，**不能**回答「完整原始對話重播」。
- 同篇 `:20`：「Ask AI 沒有一份檔案能還原全部過程。」
- 同篇 `:61`：短問題「那正2呢？」不能只拿 query string 重現——這個例子就是本 spec 要解的苦工。

## 苦工（現況）

| # | 苦工 | 類型 | 為什麼累 |
|---|---|---|---|
| 1 | 問第二輪時要自己把上一輪的脈絡重講一次 | 記憶負擔 | 模型只聽得見最後一句；短對話不會有 checkpoint |
| 2 | 關掉側欄／重整，整段歸零 | 重複勞動 | 元件 unmount 就歸零，讀者得重問一次 |
| 3 | 每次重開都面對 welcome ＋一排建議問題 | 空白恐懼（輕） | 對話沒被清掉就不算苦工 |

## Design

### 階段 1（本 spec 實作）：前端持有逐字稿 + 手動清除

**資料形狀**

localStorage key `chat_transcript_v1`，值為：

```json
{ "threadId": "<uuid>", "messages": [ /* Message[]，不含 welcome */ ] }
```

- 只存**已經結束**的訊息。`streaming === true` 的訊息不存（重整後會變空白泡泡）。
- welcome 不存：它是 i18n 字串（`chat.welcome`），換語言／換頁要重新產生，不該被舊語言的字串定型。
- 上限：最多 40 則、序列化後 ≤ 64KB，超過就從最舊的一對開始丟。
- 讀回時驗證 `threadId` 相符才採用；不符（換過新對話）就丟棄。

**流程**

1. 掛載後讀 `chat_transcript_v1` → 驗證 threadId → 還原 `messages`（前面補上當前語言的 welcome）。
2. `messages` 一變就寫回（還原完成前不寫，避免用初始的 welcome 蓋掉存檔）。
3. 按「新對話」（`ChatHeaderToolbar`）＝ 產生新 `thread_id` **＋ 清掉存檔**，兩件事一起做。「新對話」因此同時是使用者手上的「清除」控制項。
4. 三個入口（文章頁側欄／浮動鈕／`/chat` 頁）共用同一個 `ChatWidget`，行為自動一致。

**為什麼存前端而不是讀回 `chat_logs`**

前端手上的資料**比 `chat_logs` 完整**：`chat_logs` 只記成功的那一輪（寫入在串流完成之後），沒有 sources／related；前端看得到每一輪的答案、參考來源、延伸閱讀，連失敗與中斷的那一輪都在。用前端存，等於用更完整的資料換更小的伺服器資料面。

**為什麼不做清單**

1. 清單的前提是帳號。參考產品（BigGo、Cloudflare、claude.ai/code）都有帳號（`.research/biggo-agent-conversation.md:33-34`、`.research/2026-09-18-cloudflare-askai-walkthrough.md:51`）。我們只有 localStorage 一個 UUID，清單實際上只代表「這個瀏覽器」，UI 卻會被讀成「我的對話」——做出一個會誤導人的功能比沒有更糟。
2. 清單是在補自己造成的破洞。BigGo 需要清單，是因為它每次開面板就建一個新會話（`.research/biggo-agent-conversation.md:26`）。讓同一條線不要斷，需求就萎縮。
3. 清單會把 `chat_logs` 從內部 trace 升級成使用者可見資料，隨即要交出 retention、刪除路徑、揭露文案，還要處理 `ip` 欄位。站上自己的立場是「透明度和控制權比檢索技巧重要」（`ai/2026-03-19-agent-memory-systems.md:941`），做半套等於自打嘴巴。

### 階段 2（本 spec 一併實作）：滑動視窗，前端把最近幾輪一起送出去

**請求契約**

`POST /api/chat` 新增選填的 `history: [{ role: 'user' | 'assistant', content: string }]`。

- 前端只送最近 **6 則**（3 組問答），每則最多 **400 字**（`src/lib/conversation/recent-turns.ts` 的 `MAX_RECENT_TURNS` / `MAX_TURN_CHARS`，兩端共用同一組常數）。
- 失敗的那一輪不送（`error: true` 是錯誤訊息，對上下文沒有價值）；重試時把已經從畫面拿掉的那組問答排除。
- 400 字是刻意的：舊答案只需要「前面在講什麼」的指涉，不是全文重播。全文由檢索與 checkpoint 摘要負責，這也讓注入量維持在約 600 token 的量級（遠低於 70% 預算）。

**伺服器端**

1. `parseRecentTurns` 把 `history` 當**不可信輸入**重新驗證：只收 `user`／`assistant`、字串、非空；超量丟最舊；超長截斷。畸形項目跳過，不讓整個請求失敗。
2. `renderRecentTurns` 產生 prompt 用的純文字（`Reader:` / `Assistant:`，最舊在前）。
3. 注入點只有三處，全部是「背景」而非檢索輸入：
   - Planner prompt（`planner.ts`），影響意圖判斷（短追問不再被當成離題或需澄清）。
   - Writer prompt（`writer.ts`）。
   - agent 引擎的第一個 human message（`agent/loop.ts`），摘要與逐字稿都接在問題前面。
   - `state.messages` 仍是 `[HumanMessage(當前問題)]`，所以檢索查詢、`.at(-1)` 的語意完全沒變。
4. **語意快取的命名空間要併入這幾輪**（`recentTurnsCacheNamespace`，做法同 `pageCacheNamespace`）：同一句「那正2呢？」在不同上下文是不同問題，共用快取會回錯答案。
5. **不進 checkpoint 的 token 估算**（`checkpoints.ts` 的 `Pick<>` 刻意不列 `recent_turns`）：逐字稿每輪都會重送，算進來會讓門檻每輪都跨過、多寫一筆摘要。

**為什麼用摘要與逐字稿兩層，而不是把逐字稿併進 `conversation_summary`**

`conversation_summary` 同時是 checkpoint 的輸入與估算依據，把逐字稿塞進去會形成迴路（見上一點的後果）。所以新增獨立的 `recent_turns` 欄位，兩層分工：**摘要涵蓋較舊的對話，逐字稿是最近的**，這也是站上既有的建議升級路徑（`ai/2026-03-13-chatbot-development-guide.md:213-214` 的 Sliding Window → Summary + Recent）。

- checkpoint 摘要退居配角：**原始逐字稿留著，摘要只是衍生視圖，不覆寫**（站上已評論此做法為對，`daily/2026-10-10-framework-agno-3.1.2.md:31,70`；反例是壓縮時物理刪除舊訊息，`daily/2026-09-21-tool-session-relay.md:33`）。
- 注入預算依站上既有建議：不超過 context window 的 70%、優先保留最近的問答對（`ai/2026-03-13-chatbot-development-guide.md:396-402`）。
- `visitor_daily_limit` 的影響：每輪多約 600 token 的輸入，配額仍以「幾次請求」計（`chat_logs` 依據不變）。

## 可控性檢查

- [x] 使用者看得到 AI 記得什麼：逐字稿就在畫面上，不是隱藏的記憶層。
- [x] 使用者能一句話收回：按「新對話」同時清掉畫面與存檔。
- [x] 不是新增一個「歷史面板」入口，而是讓既有對話不要斷（心法 4）。
- [x] 清除是使用者的動作，不是我們在背景決定保留多久。

## Risks

| 風險 | 處置 |
|---|---|
| 同一台電腦的其他人看得到前一位的對話 | 這是既有的 `chat_thread_id` 就有的性質；本 spec 沒有新增跨使用者的資料，但也沒有解決它。列為已知限制，UI 不放「已登入」暗示 |
| 同一個瀏覽器開兩個分頁交錯對話 | 兩邊共用同一個 `thread_id` 與同一份逐字稿存檔，後寫入的覆蓋前一個，伺服器端 checkpoint 本來也會互相污染。列為已知限制（要解就得引入每分頁的 thread，會犧牲跨頁連續性） |
| localStorage 寫入失敗（無痕／配額） | 全部包 try/catch，失敗就維持現況（不還原、不清除），不得讓 widget 壞掉 |
| 存檔內容過大 | 40 則 / 64KB 上限，超過丟最舊（至少保留最後一組問答）；串流中不寫，避免每個 token 寫一次 |
| 中斷的那一輪被還原成空白泡泡 | 序列化時就不存「沒有內容」的訊息 |
| `history` 是前端可控輸入，可能被塞進 prompt 當背景 | 只收合法角色與純文字、截長度上限，且它與使用者自己打的那句話同一個信任層級，沒有提高權限邊界；不進 D1、不進 log |

## Steps

### 階段 1（前端逐字稿）

1. 新增 `src/components/Chat/transcript.ts`：純函式 `serializeTranscript` / `parseTranscript` / `trimTranscript`，含 threadId 驗證、上限、畸形資料防護，以及送請求用的 `toRequestHistory`。
2. 新增 `src/components/Chat/transcript.test.ts`：round-trip、threadId 不符、丟棄串流中訊息、超量裁剪、畸形 JSON、localStorage 例外。
3. 接線 `ChatWidget.tsx`：掛載後還原、`messages` 變動即寫回（還原前與串流中不寫）、`handleNewChat` 清存檔。

### 階段 2（多輪記憶）

4. 新增 `src/lib/conversation/recent-turns.ts`（型別、上限、驗證、渲染、快取命名空間）與 `recent-turns.test.ts`。
5. 貫穿 `recentTurns`：`api/chat.ts` → `pipeline.ts` → `engines/contract.ts` → 三個 engine（`langgraph/query-graph.ts`、`manual/query.ts`、`agent/query.ts`）→ `graph.ts` / `pipelines/manual.ts` / `state.ts` / `normalizers.ts`。
6. 注入 prompt：`planner.ts`、`writer.ts`、`agent/loop.ts`；`graph.ts` 新增 channel、`state.ts` 新增 `recent_turns`。
7. 語意快取命名空間併入最近幾輪（`api/chat.ts`）；checkpoint 估算排除 `recent_turns`（`checkpoints.ts`）。
8. 測試：`loop.test.ts` 的首則 human message、`planner.parity.test.ts` / `writer.parity.test.ts` 的 prompt 內容、`registry.test.ts` 的 normalizer 貫穿。

### 文件同步

9. 依 `AGENTS.md` 更新兩篇已發表的 Ask AI 系列文章（中英各一，共 4 檔）：`ai/2026-08-30-ask-ai-runtime-observability.md`（逐字稿邊界、兩層背景、快取命名空間、證據邊界表）與 `ai/2026-08-30-ask-ai-pipeline-overview.md`（請求契約多了最近幾輪），各加 `## 更新紀錄`。
10. 跑 `pnpm verify`、`pnpm test`。

## Verification

實測（2026-10-16）：

- `npx vitest run`：116 檔 / 780 測試全綠；`npx tsc --noEmit` 無錯誤；`pnpm lint` 0 warning；`astro check` 在排除**他人未完成的 WIP 內容檔**後 0 error。
- `check:references`、`check:tw`、`check:lang-parity`：本次四個檔案沒有任何問題（報告中的 40 個錯誤、8 個 parity 問題全在 `tech/bug-bounty-*` 系列，與本 spec 無關）。
- 見下方「未完成的驗收」：需要真人瀏覽器操作的部分尚未跑。

待補的瀏覽器驗收（三個入口各測）：

- 送出 2 輪 → 重整 → 對話還在；關掉側欄／浮動鈕再打開 → 還在；按「新對話」→ 清空且存檔被刪。
- 追問驗證：「那正2呢？」能接上前一輪。
- 無痕模式：不還原、不報錯。
- 既有的聊天視覺回歸（`playwright.config.ts` 註記的 Chat UI 測試）不受影響。

## 未完成的驗收

- 上述瀏覽器情境需要真人（或 Playwright）在 `pnpm dev` 下實跑，本次只完成自動化層。
- `pnpm verify` 目前紅燈，原因是**其他未完成的工作**：`tech/bug-bounty-*` 系列有 26 檔 frontmatter 不符 schema（`difficulty: intermediate`／`beginner`／`advanced`，schema 只收 `入門|進階|深度`）、1 檔標題行夾了日期又缺 `date`、8 組中英配對缺英文版、40 個站內連結指向不存在的 `-en` 文章。這些檔案在 `main` 上就已如此，不是本 spec 造成的，但**擋住 deploy**，需要另開一張單處理（屬 `escalation-queue.md` 等級）。

## Open questions

1. 要不要一顆**明確寫著「清除對話紀錄」**的控制項，而不是讓「新對話」兼任？（**已決定**：由「新對話」兼任，避免 header 多一顆意思重複的按鈕。）
2. 階段 2 的注入輪數 N 與是否顯示「記得前面 N 輪」chip？（**已決定**：6 則 / 每則 400 字；不顯示 chip，畫面上的對話本身就是記憶的證據。）
3. `chat_logs` 的 `ip` 欄位與沒有 TTL 是既有問題，與本 spec 無關，建議另開一張單處理。
4. 中斷（按停止）的那一輪要不要進存檔？**已決定**：存（使用者看過它），但不存「串流中且無內容」的空殼。
5. 還原後是否要把「已經在對話中」的建議問題收起？（**已決定**：是，沿用既有 `messages.length === 1` 判斷。）

## 參考

- `ai/2026-08-30-ask-ai-runtime-observability.md`
- `ai/2026-08-30-ask-ai-pipeline-overview.md`
- `ai/2026-03-13-chatbot-development-guide.md`
- `ai/2026-03-19-agent-memory-systems.md`
- `.research/biggo-agent-conversation.md`
- `.research/2026-09-18-cloudflare-askai-walkthrough.md`
- `.research/2026-09-19-chat-body-layout.md`
