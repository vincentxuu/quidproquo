# Agent UX 體檢報告 — Ask AI 浮動視窗 — 2026-09-19

## 摘要
- 掃描範圍：`src/components/Chat/`（ChatFloating、ChatWidget、ChatHeader、ChatThread、ChatMessageRow、Activity、InlineAsk、FloatButton）、`src/components/ai-elements/prompt-input.tsx`、`src/pages/api/chat.ts`、`src/pages/posts/[...slug].astro`（glossary 串接）
- 判準：`agent-ux-design/principles.md` 五則心法 ＋ 業界慣例研究（`.research/2026-09-19-chat-header.md`、`.research/2026-09-19-chat-body-layout.md`）
- 發現：9 個（高 3／中 3／低 3），另 1 個待拍板決策
- 已做得好的：工具活動一行摘要＋兩層展開（f090b57f）、IME 基本處理、`role="log"`＋黏底捲動、文章內 glossary 名詞解釋已帶文章脈絡（`/api/glossary/explain` 送 `term/context/slug`）

## 讀者意圖（心法 5 起點）
部落格讀者開 Ask AI 的意圖大致三種：
1. **看懂眼前這篇**：這段在說什麼、這名詞是什麼、跟 X 差在哪
2. **找相關文章**：本站有沒有寫過 Y
3. **快速查證概念**

現況只服務好第 2 種：建議問題池（`ChatWidget.tsx:21-50`）幾乎都是「有哪些 X 文章？」，`/api/chat` 只收 `message` 與 `thread_id`（`chat.ts:28-29`），AI 不知道讀者正在看哪篇。

---

## 發現 1：Ask AI 不知道讀者在看哪篇文章
- **違反心法**：#4 融進流程、#5 意圖優先
- **訊號**：`ChatWidget.tsx:138` 請求 body 只有 `{ message, thread_id }`；建議問題是全站固定池，與目前頁面無關
- **影響**：讀者在文章頁想問「這段是什麼意思」，得自己把標題或段落打進去；每日只有 5 次額度（`DAILY_LIMIT = 5`），浪費一次就少一次
- **嚴重度**：高
- **業界參照**：Mintlify 依頁面產生建議問題、Stripe 在輸入框上方放可移除的「目前頁面」chip、Gemini in Chrome 預設分享目前分頁（見 body 研究 §空狀態、§輸入區）
- **改造建議**：
  - 模式：意圖按鈕（每顆按鈕 = 一個 sub-prompt slot，心法 2）
  - 做法：文章頁把 `slug` 帶進 `/api/chat`，檢索時優先該篇；建議問題改為「這篇的重點」「解釋文中的〈glossary 詞〉」「延伸閱讀」＋ 1 題全站題；輸入框上方顯示可移除的「📖 目前文章」chip
  - 成本：中（前端 + API + 檢索偏置）｜風險：中 → **必須 feature flag**（CLAUDE.md 規定），並用評測確認不傷全站問題品質
  - 預期效果：第一個問題不用打字、答案落在讀者預期內（心法 3）

## 發現 2：AI 能力散在三個入口，彼此不相通
- **違反心法**：#4 融進流程
- **訊號**：浮動 Ask AI（`PostLayout.astro:132`）、文末 InlineAsk（`[...slug].astro:219`）、文中 glossary 名詞解釋（`[...slug].astro:1274`）是三個獨立入口；glossary 解釋完不能接著問，選取文字也不能直接問
- **影響**：讀到卡住的那一刻（最有動機問的時候），要自己跳到右下角、重打問題
- **嚴重度**：高
- **改造建議**：
  - 模式：流程內小助手
  - 做法：(a) 選取文章文字 → 浮出「問 AI」小按鈕 → 開浮窗並把選取段落變成引用 chip；(b) glossary tooltip 加「繼續問」→ 帶著詞與解釋開 Ask AI；(c) 評估 InlineAsk 與浮窗是否合併為同一個對話（同 thread）
  - 成本：中｜風險：中（動到文章頁腳本；flag 控制）

## 發現 3：答案產出後無法控制與回饋
- **違反心法**：#3 結果可預期（可微調、可退回）
- **訊號**：`ChatMessageRow.tsx` 無任何逐則動作（複製、重新回答、👍👎）；錯誤直接寫進 content（`ChatWidget.tsx:145,192,217`）沒有重試；sources 與 related 兩段 `LinkSection` 全展開、與句子無對應
- **影響**：不滿意只能重打；錯誤要手動重問又扣額度；你拿不到答案品質訊號
- **嚴重度**：高
- **業界參照**：答案下方動作列、串流結束才出現、重新回答只在最後一則；來源收合成「參考了 N 篇」；錯誤是串內 alert + 重試（body 研究 §訊息區）
- **改造建議**：
  - 做法：動作列（複製、重新回答最後一則）；錯誤改 alert + 重試（重試不應重複扣額度，需確認 API 計次邏輯）；來源收合、顯示文章標題；👍👎 需要存資料 → **D1 schema 變更屬 Tier 2，先問**；可先送到既有 trace/analytics 作為過渡
  - 成本：低（複製、收合、重試 UI）／中（👍👎 儲存）｜風險：低

## 發現 4：回答中整個輸入區被鎖住，停止鈕放在 header
- **違反心法**：#3（使用者失去控制感）
- **訊號**：`ChatThread.tsx:88-97` 串流時 textarea 與送出鈕都 `disabled`；`PromptInputSubmit` 已支援 `onStop`（`prompt-input.tsx:1213-1256`）但沒接；停止鈕在 `ChatHeaderToolbar`
- **影響**：等回答時不能先打下一題；停止鈕離視線太遠，header 在串流時還會多一顆按鈕
- **嚴重度**：中
- **改造建議**：傳 `onStop` 給 `PromptInputSubmit`，textarea 串流中可輸入（只擋送出），header 移除停止鈕｜成本：低｜風險：低

## 發現 5：Header 過高且功能擺放不符慣例
- **違反心法**：無（純版面），但影響第一印象
- **訊號**：`chat.css` 未載 Tailwind preflight，header `<h2>`/`<p>` 吃瀏覽器預設 margin，實高約 102px（預期約 56px）；「新對話」藏在 ⋯
- **嚴重度**：中
- **改造建議**：h2/p 加 `m-0`；新對話拉出成獨立按鈕（空對話時隱藏）；⋯ 只留複製、下載、清除；副標改寫成身分＋範圍｜成本：低｜風險：低

## 發現 6：空狀態排列與範圍說明
- **違反心法**：#1 純 Chat（部分）——已有建議問題，所以不是空白恐懼，但缺「能問什麼、不能問什麼」
- **訊號**：建議區塊夾在 header 與訊息區之間（`ChatWidget.tsx:271-300`），2 欄 grid；無範圍／免責文字
- **嚴重度**：中
- **改造建議**：建議問題移到輸入框正上方、直列 3–4 題、開始輸入就收起；加一行灰字「只根據本站文章回答，AI 可能出錯」｜成本：低｜風險：低

## 發現 7：頭像外連第三方、佔寬
- **訊號**：`ChatMessageRow.tsx:61-62` 從 `api.dicebear.com` 載 SVG
- **影響**：每次開聊天對第三方發請求（隱私、載入）；窄視窗損失約 40px 寬
- **嚴重度**：低
- **決定（2026-09-19）**：使用者要**保留頭像**。
- **改造建議**：頭像保留；可選把兩張 dicebear SVG 存成本地靜態檔（外觀不變、去掉第三方請求）｜成本：低｜風險：低

## 發現 8：`FloatButton.tsx` 是死碼且攔截 ⌘C／Ctrl+C
- **訊號**：全 repo 沒有地方 import；`FloatButton.tsx:8-10` 在 ⌘C 時 `preventDefault()` 開聊天；`:57` aria-label 是字面字串 `"{isExpanded ? ...}"`
- **影響**：目前沒掛載所以無害，但任何人日後引用就會讓讀者無法複製文字
- **嚴重度**：低（潛在高）
- **改造建議**：刪除檔案（需使用者確認）；若要快捷鍵，改用 ⌘I（⌘K 通常是搜尋）並在按鈕上顯示 kbd 提示

## 發現 9：輸入與無障礙細節
- **訊號**：IME 未檢查 `keyCode === 229`（Safari 選字 Enter 可能誤送，未真機驗證）；未設 `enterKeyHint="send"`；輸入字級未確認 ≥16px（iOS 聚焦會放大）；log 無 aria-label；無 `role="status"` 回報「回覆中／完成」
- **嚴重度**：低
- **改造建議**：逐項補上，Safari／iOS 真機驗證｜成本：低｜風險：低

## 待拍板：串流時捲動策略
- A：維持黏底（元件庫預設），上捲後出現 ↓
- B：停在新回答開頭（NN/g 建議，長答案較好讀）
- 建議先 B 做成 flag，觀察讀者行為再定

---

## 優先改造排序

| 階段 | 內容 | 發現 | 成本 | 風險 | 需要先問 |
|---|---|---|---|---|---|
| **P0 快修（一個 PR）** | header margin、停止鈕移進輸入框＋串流中可打字、複製／重試、來源收合、空狀態重排＋範圍灰字、IME／a11y 小修（頭像保留） | 3(部分)、4、5、6、9 | 低 | 低 | 否 |
| **P1 讀文章時的 Ask AI** | 帶 slug、文章建議問題、目前文章 chip | 1 | 中 | 中 | flag 必備 |
| **P2 流程內入口** | 選取文字問 AI、glossary「繼續問」、InlineAsk／浮窗整併 | 2 | 中 | 中 | flag 必備 |
| **P2 回饋資料** | 👍👎 儲存與後台 | 3 | 中 | 中 | **是（D1 schema，Tier 2）** |
| 清理 | 刪 FloatButton 死碼 | 8 | 低 | 低 | 是（刪檔） |

理由：P0 全是前端、可逆、不動資料與 API，立即改善每次使用；P1 命中未被服務的主要意圖（看懂這篇），價值最高但要 flag 和評測；P2 依賴 P1 的頁面脈絡管道。

## 進度核對（2026-09-21，對照程式碼）

P0 已由 `d46ce901`、`0cd3dd59` 落地，逐項核對如下：

| 發現 | 項目 | 狀態 | 證據 |
|---|---|---|---|
| 3 | 複製答案 | 已做 | `ChatMessageRow.tsx` `MessageActions` |
| 3 | 錯誤後重試 | 已做，**但重試仍扣額度** | `ChatWidget.tsx` `handleRetry` 註解「伺服器照常計次」 |
| 3 | 對正常答案「重新回答」 | 未做 | `onRetry` 只在 `msg.error` 時傳入（`ChatThread.tsx`） |
| 3 | 來源收合 | 已做 | `LinkSection` 改 `<details>` |
| 4 | 停止鈕進輸入框、串流中可打字 | 已做 | `ChatThread.tsx` `PromptInputSubmit onStop`，textarea 不再 `disabled` |
| 5 | header margin、新對話獨立按鈕、移除 ⋯ | 已做 | `ChatHeader.tsx` `margin: 0`、`onNewChat` |
| 6 | 建議問題移到輸入框上方、免責灰字 | 已做 | `beforeComposer={suggestions}`、`chat.disclaimer` |
| 7 | 頭像改本地靜態檔 | 已做 | `/chat/avatar-*.svg`，repo 內已無 dicebear |
| 8 | 刪 `FloatButton.tsx` | 已做 | 檔案已不存在 |
| 9 | IME `keyCode 229`、`enterKeyHint`、16px、log aria-label | 已做 | `prompt-input.tsx:979`、`ChatThread.tsx` |
| 9 | `role="status"` 回報「回覆中／完成」 | 未做 | 目前只有複製成功的 status |

P0 剩餘三個小缺口：重試扣額度、正常答案無「重新回答」、串流狀態無 `role="status"`。

## 後續行動
- [x] P0 快修直接實作（前端，限 `src/components/Chat/`、`chat.css`、`prompt-input.tsx`）——剩餘缺口見上表
- [x] 用 `agent-ux-design` 規劃 P1「讀文章時的 Ask AI」（含 flag 與評測設計）→ `docs/product/ask-ai/page-context PRD.md`（草稿，有 3 項待拍板）
- [ ] 拍板：捲動策略、👍👎 儲存方式、是否刪 FloatButton
- [ ] 轉 OpenSpec change 或登錄 `docs/governance/escalation-queue.md`（需人拍板項）
