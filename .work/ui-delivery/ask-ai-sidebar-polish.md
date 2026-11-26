# UI delivery record — Ask AI 側欄加寬與樣式統一

## Scope and design

- Task / source revision: 使用者截圖（文章頁 Ask AI 側欄、深色、有一則帶清單的回答）反映「太窄、UI 不統一」。最初在主工作區 feature/collection 改；19:28 另一個工具（Teleport）把未 commit 改動 stash 並切到別的 branch，改動移到 worktree `../quidproquo-ask-ai-ui`、branch `ui/ask-ai-sidebar-polish`（base origin/main 3b4916440 時點），只套 9 個 src 檔。
- Design source and controls reused: `src/styles/tokens.css`（--bg-card / --bg-subtle / --brand-500 / --corner-*）、既有 `.chat-icon-btn`、shadcn InputGroup。新樣式全放 `src/styles/chat.css`、`chat-history-menu.css`，不新增依賴。
- Tool restrictions: 使用者第二輪允許瀏覽器驗收。

問題盤點（截圖）：
1. 面板 380px，回答前面還有 avatar 欄（32px＋gap）＋卡片 padding／邊框，實際文字欄不到 300px。
2. Header 動作不一致：「＋」「×」是 28px 圖示鈕，「對話紀錄」是 44px 高的圖示＋文字鈕。
3. Header 標題重複文章標題，下方「目前文章」列又再列一次。
4. 目前文章列是一條無樣式文字列，× 很小。
5. 送出鍵是 input-group 的直接子項、無右邊距，被 overflow:hidden 的外框切掉一彎；focus ring 3px 半透明綠太重。
6. 巢狀清單縮排疊加、標題／段落沒有一致節奏。

| Screen / consumer | Relevant state or flow | Viewport / theme | Expected outcome |
|---|---|---|---|
| 文章頁 ChatSidebar（PostLayout，有 articleSlug） | 開啟、空狀態建議問題、有回答（清單／來源）、chip 移除 | 1140 / 1400 / 1519 / 1520 / 1920；淺深 | 面板 400–600px；本文與面板間 24px；無 avatar／卡片框；header 三顆 32px 圖示鈕 |
| 文章頁 < 1140 bottom sheet | 開啟、輸入聚焦 | 390 / 1139；淺深 | 寬 100%；送出鍵與圖示鈕 44px |
| 非文章頁 ChatFloating | 開啟、展開、對話紀錄選單 | 390 / 1280 | 520px 窄版同側欄樣式；展開後 >600px 回到 avatar＋卡片 |
| /chat（ChatWidget 非 embedded，860px） | 空狀態、對話、對話紀錄 | 390 / 1280 | 寬版保留 avatar＋卡片；對話紀錄改為圖示鈕（aria-label 不變） |

## Evidence

| Gate | Status | Evidence / revision | Remaining work |
|---|---|---|---|
| Source and automated checks | pass（新增失敗 0） | oxlint 0/0；vitest Chat 46 passed；`pnpm verify` 3 紅（check:references / post-quality / no-emoji），把 src 改動 stash 掉在 origin/main 上同樣 3 紅 → 既有內容問題，非本次 | 既有紅燈另案處理 |
| Interaction | pass | worktree dev server（NODE_OPTIONS=--max-old-space-size=6144，同 CI）跑 `pnpm test:visual` 72/72 passed（含 chat / personal-chat / three-column 7 寬度×淺深 / mobile-chat 320–430）。Mock SSE 送出問題、展開來源、chip 存在 | 注意：先前一輪借用 :4399 舊 server 跑的 54 項實際測的是舊碼，作廢 |
| Visual review | pass（agent 自審） | `evidence/ask-ai-polish/*.png`：sidebar 1140/1440/1920 淺深、bottom sheet 390、floating 1280、/chat 1280。量測：面板 400/520/600px；header 鈕 32px（≤640 為 44px）；送出 36px（手機 44）且在輸入框內；無水平溢出 | 使用者確認觀感；PR 上用 visual-baselines workflow 重產 -linux 基線（sidebar、three-col open、chat 會變）並逐張看 |
| Deployment confirmation | not applicable | 未 commit、未部署 | — |

驗收中另修 2 個問題（公開頁無 preflight 造成）：全域 `:focus-visible` outline 畫在 textarea 上、被 overflow 裁成送出鍵左側一條直線；送出鍵留 UA 2px 邊框（原截圖圓外那圈）。

## Review findings

- 寬度單一來源：`--ask-ai-sidebar-width`（PostLayout body），面板 `width` 與 body `padding-right`、scroll-top 位置都讀它；移除 ChatSidebar.tsx 的 inline 380。1140–1519：`clamp(400px, 100vw - 808px, 520px)`（本文 ≥ ~692px）；≥1520：`clamp(400px, 100vw - 1108px, 600px)`（本文＋TOC ≥ ~1060px）。
- 窄版判斷用 `@container chat-log (max-width: 600px)`（對話區寬），不是視窗寬；/chat 寬版與浮動窗展開維持原樣。
- ChatMessageRow 版面與 p/ul/ol/li/h1–3 從 inline style 搬到 class，container query 才蓋得掉；表格、程式碼、連結卡片 inline 樣式未動。
- 公開頁沒 Tailwind preflight：新按鈕（chip ×、history trigger）都自己 reset appearance/border/background。
- details marker 改成 CSS chevron，`prefers-reduced-motion` 關掉轉場。

## 第二輪（使用者回饋後）

- 頭像：窄版改為選項 B——24px 頭像＋「Ask AI」放在回答上方一行，正文仍鋪滿；寬版（/chat）維持左欄頭像。
- 寬度上限：≥1520 由 600 收到 540（15px 中文一行約 34 字）。
- 導覽列：加寬後 1230–1409（英文到 1440）打開側欄時 nav 拆成三行。修法：
  - 1140–1519 側欄公式改 `clamp(400px, 100vw - 890px, 520px)`，中文 nav 一行需約 842px，先保住它。
  - 連結包成 `.nav-links`，平常 `display: contents`（版面、手機規則不變）；側欄開啟時 nav 固定 logo｜連結｜按鈕三欄、只有連結換行、間距 16px。
  - 量測（`nav-measure*.mjs`）：中文 1140–1228 兩行、≥1229 一行；英文 1140–1440 兩行、≥1519 一行；最多兩行、按鈕都在第一行。關閉側欄與 390 手機與修改前相同。
- 競品實測（headless Chromium，開關面板前後量主內容與面板寬）：Vercel／Next.js 400 擠壓（1000 改全螢幕覆蓋）、Mintlify 368 擠壓、Stripe 344 擠壓（1100 改覆蓋）、GitBook 384 擠壓（1100 正文剩 316）、Supabase 置中 modal、Microsoft Learn 被 onboarding 擋住未測。已寫入 research pool `design/ui`（run 2026-11-26-ask-ai-panel-competitors）。截圖為第三方畫面，只留本機 `.work/ui-delivery/evidence/competitors/`，不入版控。

| Gate | Status | Evidence |
|---|---|---|
| Source and automated checks | pass | oxlint 0/0；vitest Chat 46 passed；`pnpm verify` 在本 branch 仍有 3 紅，全部來自 origin/main 既有內容（main 自 11-26 19:28 Deploy 連續失敗）；修正另開 `fix/main-content-gates` |
| Interaction | pass | `pnpm test:visual` 72/72（worktree dev server，NODE_OPTIONS 6144） |
| Visual review | pass（agent 自審）／待使用者確認 | `evidence/ask-ai-polish/*.png`（本機） |
| Deployment confirmation | pending | 待 PR 合併、-linux 基線重產與部署後檢查 |

後續（已與使用者約定，另開 PR）：右下角快捷卡片換成文章內「問 AI 這篇」＋側欄展開按鈕；導覽列收斂（需使用者決定收哪些連結）。
