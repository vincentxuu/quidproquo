# 讀文章時的 Ask AI（page context）PRD

- 狀態：草稿（2026-09-21），待拍板後實作
- 來源：`docs/product/reviews/agent-ux-2026-09-19-ask-ai.md` 發現 1（P1）
- 方法：`agent-ux-design` 五步驟

## 1. 使用者意圖

讀者在文章頁開 Ask AI，最常見的意圖是**看懂眼前這篇**：這段在說什麼、這個名詞是什麼、跟 X 差在哪。不是「搜尋全站」。

現況只服務「找相關文章」：`/api/chat` 的 `ChatBody` 只有 `message` 與 `thread_id`，AI 不知道讀者在看哪篇；建議問題是全站固定池（`ChatWidget.tsx` `SUGGESTED_QUESTIONS`），與頁面無關。

## 2. 現況苦工

- **空白恐懼**：想問「這篇」卻得自己把標題或段落打進輸入框。
- **額度浪費**：訪客每日額度有限（`visitor_daily_limit`），問一句「這篇在講什麼」若沒帶脈絡，檢索落到別篇，一次額度就沒了。
- **結果不可預期**：讀者以為 AI 看得到眼前的文章，實際看不到，答案常落在預期外。

## 3. Agent 介入設計（模式 A＋C）

模式 A（AI 提案、讀者挑）用在建議問題；模式 C（流程中自動帶入）用在頁面脈絡。不新增對話以外的介面。

### UI 流程

1. **目前文章 chip**（輸入框正上方，可移除）
   - 文章頁開啟 Ask AI 時顯示「📖 〈文章標題〉」，右側 ✕。
   - 移除後該 thread 回到全站模式；「新對話」時 chip 重新出現。
   - 非文章頁（首頁、分類頁）不顯示，行為與現在相同。
2. **依文章產生的建議問題**（取代全站池的前 3 格，第 4 格保留全站題）
   - 「這篇的重點是什麼？」
   - 「解釋〈glossary 詞〉」——取該篇 frontmatter `glossary` 第一個詞；沒有就換成「這篇適合誰讀？」
   - 「有哪些延伸閱讀？」
   - 1 題全站題（沿用現有池，保留「換題目」）
   - 每顆按鈕就是一個 sub-prompt slot：點下去送出的是完整問句，讀者不用打字。
3. **答案來源標示**：`LinkSection` 的來源清單中，目前文章排第一並加「目前文章」標記，讓讀者確認 AI 確實讀了這篇。

建議問題由 frontmatter（`title`、`glossary`、`tldr`）套模板在頁面渲染時產生，**不呼叫 LLM**，零額外成本。字串進 `src/i18n/chat.ts`，zh-TW／en 都要有。

### 後端包裝

- `ChatBody` 新增 `page_context?: { slug: string; lang: 'zh-TW' | 'en' }`。
- **伺服器只信 slug**：用 slug 從 D1 查文章是否存在、取標題；查不到就丟棄 `page_context`，當全站問題處理。前端傳來的標題不進 prompt（避免注入）。
- **檢索偏置，不是過濾**：把該篇的 chunk 當作保證候選併入既有檢索結果，全站檢索照跑。這樣「這篇跟 LangGraph 差在哪」仍能取到別篇。
- **planner 判斷是否指涉本篇**：問題含「這篇／這段／文中／本文」或為建議問題時，writer prompt 註明「讀者正在閱讀〈標題〉」；明顯與本篇無關的問題（例如「本站有哪些 RAG 文章」）不加註，行為同現在。
- 控制邊界：
  - **semantic cache 必須分流**：帶 `page_context` 的請求，cache key 要含 slug，或直接略過 semantic cache。否則 A 文章的「這篇的重點」會命中 B 文章的快取。這是本功能最容易出錯的地方，必須有測試。
  - trace 要記錄 `page_context.slug` 與「是否實際採用」，evals 才能切片。

### Feature flag

- 新增 `rag_flag_page_context`（`src/lib/retrieval/settings.ts` 的 `SETTINGS_KEYS`／`DEFAULTS`，預設 `false`），與既有 `rag_flag_*` 同一套，D1 `settings` 鍵值，**不需 schema 變更**。
- flag 關閉時：伺服器忽略 `page_context`；前端不顯示 chip 與文章建議問題，全部行為與現在一致。
- 文章頁是預先產生的靜態頁，前端無法在渲染時讀 flag，取得方式見「待拍板」第 1 項。
- 正式區開啟屬 Tier 2（production flag flip），先問再做。

## 4. 評測設計

沿用 `pnpm eval:rag`（`docs/rag-golden-dataset.json`）與 `evals/rag` promptfoo。新增一個 page-context 切片，三組：

| 組別 | 內容 | 通過條件 |
|---|---|---|
| A 指涉本篇 | 約 15 題「這篇的重點」「解釋文中的 X」，各帶一個 slug | 該 slug 出現在來源的比例 ≥ 90%；flag 關閉時同題的比例作為對照基準 |
| B 全站題帶無關 slug | 從現有 golden 題抽約 20 題，各配一個無關文章的 slug | 既有指標相對 flag 關閉時的退步不超過既有 `RAG_EVAL_ENFORCE` 門檻 |
| C 不帶 slug | 現有 golden 全量 | 與 flag 關閉時結果一致（確認沒帶脈絡時零影響） |

另加單元測試：semantic cache 在不同 slug 下不互相命中；slug 不存在時 `page_context` 被丟棄。

選題遵循 `research-case-selection-framework`：A 組的 slug 要涵蓋不同 category、`type`（debug／deep-dive／guide／project）、有無 `glossary`、zh-TW／en，不能只挑熟悉的幾篇。

## 5. 可控性檢查

- [x] 每個 agent 動作前後都有讀者可介入點——chip 可移除；建議問題是挑選而非自動送出
- [x] 結果落在讀者預期內——chip 明示 AI 知道哪一篇；來源清單標出「目前文章」
- [x] 可重來——移除 chip 即回全站模式；既有錯誤重試保留
- [x] 融進流程——沿用既有浮窗，無新增介面

## 6. 實作切分

1. **管道**（flag 關閉狀態可合併）：`PostLayout.astro` → `ChatFloating` → `ChatWidget` 傳 `slug`／標題／glossary 首詞；`ChatBody` 加 `page_context`；伺服器驗證 slug；flag 讀取。
2. **檢索偏置＋cache 分流＋trace 欄位**，含單元測試。
3. **前端 chip 與文章建議問題**，i18n，視覺回歸基線更新。
4. **評測切片**：補題、跑 A／B／C 三組，結果寫回本文件。
5. **正式區開 flag**（Tier 2，拿評測結果來問）。

預估影響檔案少於 20 個，不需新 dependency。

## 7. 待拍板

1. **前端如何得知 flag**：文章頁是 `prerender = true`（`src/pages/posts/[...slug].astro:3`），渲染時讀不到 D1，所以 slug／標題／glossary 首詞可在 build 時寫進 prop，但 flag 狀態必須在執行期取得。目前 widget 只呼叫 `/api/chat`，沒有現成的設定端點。兩個做法：
   - (a) 新增輕量 `GET /api/chat/config` 回 `{ pageContext: boolean }`，浮窗第一次展開時才打、結果存 `sessionStorage`。單一事實來源，正式區切 flag 立即生效。**建議。**
   - (b) UI 用 build-time 的 `PUBLIC_` 環境變數、伺服器用 D1 flag。少一支端點，但兩個開關會漂移，切 UI 還得重新 deploy。
2. **建議問題按鈕是否扣額度**：建議照扣（與手打同等），但 chip 讓第一題命中率提高，實際上是省額度。
3. **InlineAsk（文末）是否一併帶 `page_context`**：建議一併帶，成本極低；與浮窗整併屬 P2，不在本次範圍。

## 8. 不在範圍

- 選取文字問 AI、glossary「繼續問」、InlineAsk／浮窗整併（P2）
- 👍👎 回饋儲存（P2，需 D1 schema 變更）
- 以 LLM 產生建議問題
