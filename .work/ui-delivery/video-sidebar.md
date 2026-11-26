# UI delivery record：影片文章側欄停靠、章節時間、小視窗

## Scope and design

- Task / source revision：參考 BigGo Finance podcast 頁（右欄影片＋Timestamp、捲動後浮動小播放器）。分支 `feat/video-sidebar`，基於 origin/main `6c1f5169e`。
- Design source and controls reused：`tokens.css`（`--brand-700`、`--fs-xs`、`--corner-md/pill`、`--shadow-floating`）；沿用既有 `.video-embed` 結構、`seekEmbeddedYoutube`、分割檢視。
- Feature flag：`src/data/ui-features.ts`（`videoSidebar`、`videoChapters`、`videoMiniPlayer`，build 時常數）。
- Tool restrictions：無；用 Playwright（headless Chromium）對 dev server（port 4333）實測。

| Screen / consumer | Relevant state or flow | Viewport / theme | Expected outcome |
|---|---|---|---|
| 影片在文末的課程文（MIT 6.S184 L1） | 載入 | 1440 淺 | 影片停靠側欄、目錄在下、原位留提示 |
| 有章節的課程文（CS329Z L1、CS50AI W3） | 載入、點目錄時間 | 1440 淺/深 | 目錄出現時間；點了捲到該節、播放器留在側欄、不進分割檢視 |
| 同上 | 1440→900 縮窗 | 900 深 | 影片回文章原位；播放中捲走 → 左下小視窗；關閉 → 收起 |
| 同上 | 手機 | 390 | 不停靠、不浮動、無水平捲動 |
| 嵌入被拒的影片（CS329Z L1） | 載入、點時間 | 1440 | 側欄顯示原有「請前往 YouTube」提示；點時間開 YouTube 該秒 |
| /styleguide/ | 載入 | 1440 | 其 YouTube 範例改為停靠側欄（截圖基線會有 diff） |

## Evidence

| Gate | Status | Evidence / revision | Remaining work |
|---|---|---|---|
| Source and automated checks | pass | `vitest run src/lib/videoChapters.test.ts src/lib/youtubeClipLoop.test.ts` 27/27；`pnpm lint` 0；`astro check` 新檔 0 error（初次 5 個 DOM `after/before/prepend` 型別錯誤已改 `insertBefore`）；`pnpm verify` 見 commit 前紀錄 | CI visual job |
| Interaction | pass（播放狀態為模擬） | 停靠／縮窗回原位／小視窗浮出與關閉／目錄時間點擊（scrollY 移到該節、無 `video-split`、aria-label「從 17:46 播放：…」）／390 不浮動 | 真實 YouTube 播放觸發小視窗、停靠後再移動 iframe 時 IFrame API 綁定是否仍有效：需真人瀏覽器確認 |
| Visual review | pass（本機） | 截圖：scratchpad/shots/mit-desktop-light、cs329z-desktop-scrolled、mini-player-900-dark、mini-player-900-left、cs50-desktop-dark | 使用者看過；CI screenshots diff（styleguide 預期會變） |
| Deployment confirmation | not applicable | 未 push | — |

## Review findings

- 修正：初版小視窗在停靠之後才綁定，曾停靠過的影片（縮窗、開 Ask AI）就不會浮出；已改為先綁定小視窗再停靠。
- 修正：小視窗初放右下，與 Ask AI、回到頂端、重點摘要鈕重疊；改左下。
- 修正：嵌入被拒時目錄時間點了無反應；改開 YouTube 該秒。
- 修正：「錄影 00:00–07:35」無 `&t=` 的連結也算第一章。
- 樣式可達性：所有節點為執行時建立／移動，樣式放全域 `videoChapters.css`，不依賴 Astro scoped CSS；停靠後原 `article .content .video-embed` 規則不再命中，側欄另有規則。
- 已知限制：移動 iframe 會重新載入；只在版面切換（跨 1000px、Ask AI 開關）時發生，播放中切換會中斷播放。
- 既有問題（非本次）：CS329Z L1 影片在正式站同樣顯示禁止嵌入（headless 觀察）；右下浮動「重點摘要／相關文章」鈕本來就蓋住側欄底部。

## Delivery decision

- Ready stages：本機程式與互動檢查完成，待使用者看過畫面再 commit、開 PR。
- Pending acceptance / owner：使用者（真人瀏覽器播放實測）。
- Published revision：無。

## 第二輪（使用者要求：影片可調大小 → 選 YouTube 做法）

- 競品依據：YouTube 說明 answer/6052392（主播放器跟視窗大小走＋劇院模式鈕，不可拖曳）、answer/9162927（小視窗拖角縮放、拖到四角、Esc 關閉）。Udemy 說明頁需登入未讀到。
- 側欄：拿掉自由拖曳，改「放大影片／還原大小」兩段（340 ↔ 畫面一半）。使用者回饋「放大了還是有點小」後由 560 改為畫面一半。
- 修正：放大時 `.post-main` 仍是 760 寬，滑到影片底下 64px；加規則讓它隨欄寬縮（1440 時 24–680，側欄 720 起）。
- 小視窗：拖曳角縮放、拖到四角吸附、方向鍵換角、Esc 關閉；控制列與縮放角跟著角落翻面。實測（合成 pointer 事件）：拖到右上 → corner=tr、控制列在影片下方、縮放角在左下；Esc 後收起。
- 檢查：vitest 33/33（含 nearestCorner、cornerAfterKey、sidebarWidth）、lint 0、astro check 0 errors。
- 待驗：真實滑鼠拖曳與真實播放（使用者瀏覽器）。

## 第三輪（使用者要求：左文字、右上影片、右下投影片）

- 範圍：同時有影片與 `data-slide-reader` 的文章（CS329Z 第 1–10 講中英，20 篇）。`slideReader.ts` 加 `showDockedSlides()`；面板在側欄內時不開 modal、不加 `has-slide-reader`、Esc 與視窗縮放不關它。
- 章節：每節開頭三個區塊內的 `data-slide-page` 記為該章投影片頁；點目錄時間同時翻頁。
- 實測（1440）：側欄 852 高＝影片 392＋投影片 368＋目錄一行；文章 24–680 不重疊；點正文投影片連結不開 modal、版面不變。900：投影片回到 body、點連結開回原本 modal、目錄恢復展開。
- 未驗：PDF.js 在 headless Chromium 不初始化（正式站原本彈出面板在同環境也一樣 `initialized:false`），投影片內容與實際翻頁需使用者瀏覽器確認。
- 本機預覽：R2 不可用，`astro.worktree.config.mjs`（不 commit）把 `/api/slides` proxy 到正式站。

## 第四輪（使用者：「不太方便」「投影片好小」，附 1288×675 截圖）

- 原因：影片全寬 640×360，投影片只剩約 170px 高且用 page-width 裁切；Ask AI 快捷鈕蓋住投影片右下。
- 改為投影片為主：上排半寬影片＋目錄，下排投影片全寬、page-fit；切換鈕改「放大影片／放大投影片」。欄高停在 Ask AI 上方，期間隱藏快捷鈕與回到頂端。
- 實測 1288×675：投影片 580×371（扣工具列可容 16:9 整張 580×326）、影片 284×160、目錄 284×196；欄底 603、Ask AI 623 起；無水平捲動。切到影片為主：影片 385×217、投影片 385×269、目錄一行。
- 待驗：PDF.js 實際渲染與翻頁（headless 不初始化，正式站原面板同樣）。

## 第五輪（使用者：「影片可以大一點嗎」「兩邊還有空間」）

- 有投影片時頁面改用滿視窗寬（原本置中 max-width 留兩側空白）。
- 影片為主：改以寬度優先，投影片保留至少 140px。1288×620 實測：影片 548×308、投影片 548×140、目錄一行；文章 24–676。投影片為主：影片 251×141、投影片 514×335。無水平捲動，Ask AI 不重疊。

## 第六輪（使用者：「投影片太小」→ 查競品後選子母畫面）

- 競品：Kaltura dual screen（官方 knowledge.kaltura.com/help/dual-screen-plugin：預設 PiP、可對調、拖到四角、隱藏小窗、切並排；小窗預設 0.3 倍）、Panopto（UB 指南：PiP／只影片／只投影片／並排四種，可對調）、SlidesLive（官方部落格：可調整雙視窗；固定 PiP 小窗看不清、來回切換打斷學習）。
- 改為子母畫面：大的佔滿 16:9 舞台，小的 30% 疊角落；控制列對調／移動／隱藏；目錄填滿剩餘高度。
- 實測 1288×620：投影片大 587×364（可容 16:9 整張）、影片小窗 176×99 右下；對調後影片 587×330、投影片小窗 176×99 且工具列移出；移動 → bl；隱藏 → visibility hidden、移動鈕停用；偏好寫入 localStorage。900 寬：投影片回 body、控制列移除、影片回文章。無水平捲動、Ask AI 不重疊。
- 待驗：PDF.js 實際渲染（headless 不初始化）、真實播放時小窗聲音與隱藏。

## 第七輪（使用者：「為什麼不能自由移動」→ 確認兩個小窗都改自由拖曳）

- 位置模型：`Spot`（可移動範圍的 0–1 比例）＋ `placeBox`／`spotFromBox`／`parseSpot`（相容舊的角落偏好）／`spotAfterKey`，單元測試 5 則（共 40/40）。
- 子母畫面：小窗上緣加 `.video-pip__handle` 拖曳條（iframe 接不到 pointer），用 `translate: var(--pip-x) var(--pip-y)` 定位，取代四角 grid 對齊；投影片大時保留 PDF.js 工具列 34px。控制列按鈕改「↻ 換角落」。
- 浮動小視窗：`--mini-left/--mini-top` 取代四角規則，放開不再吸附；`data-corner` 改為所在象限，只在放開時更新（避免拖曳中控制列跳走）；視窗 resize 重算。
- 驗證（Playwright 1288×620、900×620，合成 pointer 事件）：拖曳位移與指標一致（-200/-120）；拖過頭貼齊舞台內緣（+8px）與投影片工具列下方；對調後位置照比例套用；換角、方向鍵、偏好儲存正常；浮動小視窗拖到中央、貼齊右下（右/下各留 24px）；無橫向捲動。lint 0、astro check 0 errors。
- 未驗證：真實滑鼠拖曳手感、PDF 實際渲染。已知取捨：浮動小視窗可被拖到右下而蓋住 Ask AI 鈕（使用者自選位置）。
