# quidproquo 設計系統

> 這份文件描述**目前已實作**的前台設計：token、字級／間距／圓角的級距、每個文章元件長什麼樣、什麼時候用。
> 程式碼才是正本；本文件的每個數值都附 `檔案:行號`，兩者不一致時以程式碼為準，並回頭修正本文件。
> 2026-03 的規格 `docs/superpowers/specs/2026-03-12-blog-redesign-design.md` 已經跟實作脫節，只當歷史參考。
>
> 範圍：文章頁（`src/layouts/PostLayout.astro`＋`src/pages/posts/[...slug].astro`）與它載入的樣式。後台 `src/styles/admin-tokens.css` 是另一套獨立介面，不在本文件範圍。
>
> 行號以 2026-11-19 的工作目錄為準（§5 那一批修正之後、尚未 commit）。

本文件常用的兩個檔案簡稱：

- **Layout**＝`src/layouts/PostLayout.astro`（全站共用版面；`<style is:global>` 在 162–1538 行，文章內文規則在 485–753 行，755 行以後是 About 頁）
- **Post**＝`src/pages/posts/[...slug].astro`（文章頁；scoped `<style>` 在 444–900 行，script 從 902 行起，global 樣式在 1280–1411、1413–1495 行）

---

## 1. 原則

1. **Editorial：靠字重與留白撐結構，不靠色塊。** 標題用 900／800／700 三級字重（Layout:489、492、504），段落之間靠 `margin` 分開；h2 用一條 1px 分隔線切段（Layout:490–503），不用色塊或卡片包段落。
2. **森林綠是唯一的品牌色。** 品牌色＝`--brand-*`（tokens.css:15–20）。引言框預設是品牌綠（Layout:576–584）；黃（warning）與另一種綠（tip）只表達提示種類，藍色只剩圖表的 `link` 色與 Mermaid 的次要色。
3. **可讀優先。** 本文欄寬上限 760px（Post:606–608，註解：約 44 個全形字一行），行高 1.8（Layout:486）。連結是深色字加淡綠底線（Layout:529–534），不把整段染成綠字。文字色都要對底色 ≥ 4.5:1（tokens.css:17、24、142 的註解）。
4. **行動優先。** 所有元件要先在 390px 寬成立。頁面左右留白隨寬度遞減：1.5rem → 1rem（≤640px）→ 0.75rem（≤400px）（Layout:212、672、697）。
5. **元素不能比容器寬；放不下就給它自己的捲動容器。** 表格包在 `.table-scroll`（Layout:718–724）、長公式在 `.katex-display` 內捲動（Layout:537）、程式碼在 `pre code` 內捲動（Layout:564）、圖表在 `.dg__scroll`／`.flow-diagram__scroll` 內捲動（diagram.css:26、flowDiagram.css:4）。`html { overflow-x: hidden }`（Layout:206–208）只是最後一道保險，不是解法：被它切掉的內容讀者看不到。
6. **圖不放大超過設計尺寸。** 圖寬上限是 `min(分級上限, viewBox 寬)`，最多 1:1 顯示；空間不夠時先縮小到下限，再改成框內捲動（diagram.css:29–34、flowDiagram.css:7–8）。
7. **顏色、字級、間距、圓角都從 token 來。** 元件 CSS 用 `var(--token)`；token 只能在 tokens.css 宣告，別處重宣告會讓 `pnpm verify` 失敗（scripts/check-chat-style.mjs:31–35、77–84）。圖表 SVG 禁止寫字面色，建置時直接報錯（`src/plugins/remarkDiagram.ts:32`）。
8. **淺色、深色都要成立。** 有深色值的 token 寫在 `[data-theme="dark"]`（tokens.css:132–184）；刻意兩種主題共用的（程式碼底以外的媒體疊層、陰影、`--text-on-accent` 等）在 tokens.css:177 註明。深色模式由 `[data-theme="dark"]` 切換（Layout:102–109）。
9. **元件由 Markdown 語法決定，不在文章裡寫樣式。** 文章裡沒有任何 `style="`；圖表 fence 也禁止 `style` 屬性與 `<style>`（remarkDiagram.ts:28–29）。需要新樣式就新增元件，不在文章裡臨時拼。

---

## 2. Token

唯一來源：`src/styles/tokens.css`。由 Layout:7 與 `src/pages/chat.astro` 載入。tokens.css 宣告過的名稱不得在其他 `.astro`／`.css` 再宣告（`admin-tokens.css` 除外），由 `check:chat-style` 規則 1 擋下（scripts/check-chat-style.mjs:31–35）。

### 2.1 品牌色

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--brand-900` | `#1a2e1a` | `#e8e8e8` | 最強的字色：標題、logo、啟用中的按鈕底、hero 漸層中段 | tokens.css:15／133 |
| `--brand-700` | `#2d4a2d` | `#c0c0c0` | 次強字色：連結、行內程式碼字、tag 字、語言切換膠囊；hero 漸層兩端 | 16／134 |
| `--brand-500` | `#2f7a4d` | `#5cb87a` | 品牌主色：focus 外框、進度條、hover 邊框與底線、引言框左框、圖表 accent。淺色值對白底、`--bg-subtle`、`--brand-50/100` ≥ 4.5:1（原 `#4a9e6a` 只有 3.29，tokens.css:17） | 17／135 |
| `--brand-300` | `#a7c4a0` | `#2d4a2d` | 淡綠：連結底線（淺色）、語言切換膠囊的框 | 18／136 |
| `--brand-100` | `#e8f5e8` | `#1c2833` | 淡底：行內程式碼底、tag 底、術語標記底、Mermaid 主色 | 19／137 |
| `--brand-50`  | `#f0f7f0` | `#151d26` | 最淡底：引言框（note）底、語言切換膠囊底、flow-diagram accent 節點 | 20／138 |

深色模式下 `--brand-900`／`--brand-700` 是灰色、`--brand-100`／`--brand-50` 是藍灰色，不是綠色。這組名稱表示「強度階層」，不保證色相；要綠色請用 `--brand-500`。這個語意問題還沒處理，見 §5.2。

### 2.2 文字

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--text-primary` | `#1a1a1a` | `#d1d5db` | 內文、表格、引言框文字 | tokens.css:22／140 |
| `--text-secondary` | `#2f7a4d` | `#5cb87a` | 導覽連結、h5/h6、TOC 標題；與 `--brand-500` 同值，「不再有第二個綠」（tokens.css:23） | 23／141 |
| `--text-muted` | `#6e6e6e` | `#8b929e` | 圖說、footer、meta；對白底、`--bg-subtle`、`--brand-50/100` ≥ 4.5:1 | 24／142 |
| `--text-on-accent` | `#ffffff` | （同淺色） | 飽和色底上的字：分類徽章、hero、daily 標籤、程式碼複製鈕 | 66 |

### 2.3 背景

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--bg-page` | `#ffffff` | `#0f1419` | 頁面底色 | tokens.css:25／143 |
| `--bg-subtle` | `#f5f7f5` | `#151d26` | 次層底：表頭、TL;DR、TOC、表格 hover | 26／144 |
| `--bg-card` | `#ffffff` | `#1a2332` | 卡片、details、圖表的紙面；深色 hero 漸層兩端 | 27／145 |
| `--bg-code` | `#1e1e2e` | `#0d1117` | 程式碼區塊底（兩種主題都是深底） | 28／146 |

### 2.4 邊框與強調

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--border` | `#d1e8d1` | `#2a3545` | 所有 1px 邊框、h2 分隔線、表格格線 | tokens.css:21／139 |
| `--heading-accent` | `#e8657a` | `#f472b6` | 目前只剩回到頂端按鈕（Layout:361）；h2 色條已移除 | 29／147 |

### 2.5 狀態色（提示框）

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--info-bg` | `#eef6ff` | `#151d26` | Mermaid 次要色（Post:919） | tokens.css:30／148 |
| `--info-border` | `#3b82f6` | `#3b82f6` | 圖表 `link` 色（diagram.css:12）、Mermaid 次要框 | 31／149 |
| `--success-bg` | `#eefbf3` | `#112419` | tip 提示框底；深色是帶綠的深底，跟 note 的 `--brand-50` 分得出來（tokens.css:150） | 32／150 |
| `--success-border` | `#22c55e` | `#22c55e` | tip 提示框左框 | 33／151 |
| `--warning-bg` | `#fffbeb` | `#1a1a0f` | warning 提示框底、Mermaid 第三色與 note | 34／152 |
| `--warning-border` | `#f59e0b` | `#f59e0b` | warning 提示框左框 | 35／153 |
| `--danger` | `#b42318` | `#f87171` | 錯誤；圖表 warn 的淡底（diagram.css:15）、flow-diagram warn（flowDiagram.css:2） | 36／154 |

`--info-icon`、`--success-icon`、`--slide-page` 已移除（沒有使用者）。

### 2.6 類型徽章與螢光標記

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--type-debug` | `#b45309` | `#f59e0b` | 類型徽章字色與同色框（Layout:445–448），對 `--bg-page` ≥ 4.5:1 | tokens.css:68／169 |
| `--type-deep-dive` | `#4f46e5` | `#818cf8` | 同上 | 69／170 |
| `--type-guide` | `#0f766e` | `#2dd4bf` | 同上 | 70／171 |
| `--type-project` | `#64748b` | `#94a3b8` | 同上 | 71／172 |
| `--mark-bg` | `#fef08a` | `#713f12` | `<mark>` 底 | 73／173 |
| `--mark-text` | `#1a1a1a` | `#fef3c7` | `<mark>` 字 | 74／174 |

### 2.7 分類色

由 `.cat-*` 類別套成分類徽章底色，字一律 `--text-on-accent`（Layout:404–431）。淺色值在 tokens.css:45–62；深色只覆寫「淺色值在 `--bg-page` 上低於 3:1」的那幾個，白字仍 ≥ 4.5:1（tokens.css:159–167）。

| Token | 淺色 | 深色 | Token | 淺色 | 深色 |
|---|---|---|---|---|---|
| `--cat-tech` | `#1a1a1a` | `#636a78` | `--cat-coffee` | `#92400e` | `#a3540f` |
| `--cat-ai` | `#6d28d9` | `#7c3aed` | `--cat-investing` | `#047857` | — |
| `--cat-product` | `#0369a1` | — | `--cat-learning` | `#0f766e` | — |
| `--cat-education` | `#b45309` | — | `--cat-design` | `#a21caf` | `#b62ac0` |
| `--cat-life` | `#15803d` | — | `--cat-policy` | `#475569` | `#5d6b7f` |
| `--cat-marketing` | `#be185d` | — | `--cat-anime` | `#e11d48` | — |
| `--cat-travel` | `#c2410c` | — | `--cat-career` | `#0c4a6e` | `#1d6fa0` |
| `--cat-climbing` | `#57534e` | `#6b6560` | `--cat-weather` | `#2563eb` | — |
| `--cat-surf` | `#0e7490` | — | `--cat-film` | `#292524` | `#7c6a5f` |

「—」＝沿用淺色值。`--cat-surf`、`--cat-learning` 原本的 `#0891b2`、`#0d9488` 白字只有 3.7:1，已換掉（tokens.css:53、57）。daily 分類的標籤也借用分類色（`--cat-investing`、`--cat-ai`、`--cat-policy`，Post:776、802、825）。

新增分類時：在 tokens.css 加 `--cat-<name>`（深色底上低於 3:1 就在 dark 區塊補值），在 Layout 的 `.cat-*` 區塊（Layout:414–431）加一行。

### 2.8 陰影、遮罩、光澤

| Token | 值（淺色） | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--shadow-card-hover` | `0 2px 12px rgba(0,0,0,0.08)` | `… 0.25` | 卡片 hover | tokens.css:38／156 |
| `--shadow-floating` | `0 2px 12px rgba(0,0,0,0.15)` | `… 0.4` | 浮動元素：回到頂端、術語彈窗、影片返回鈕 | 39／157 |
| `--shadow-hairline` | `0 1px 3px rgba(0,0,0,0.06)` | 同 | Chat 問題建議按鈕 | 107 |
| `--shadow-raised` | `0 6px 20px rgba(0,0,0,0.12)` | 同 | Chat 側欄觸發鈕 hover | 108 |
| `--shadow-panel` | `-6px 0 32px rgba(0,0,0,0.10)` | 同 | Chat 右側滑出面板 | 109 |
| `--shadow-control` | `0 1px 4px rgb(0 0 0 / .15)` | 同 | 影片輪播左右鈕 | 110 |
| `--shadow-modal` | `0 16px 60px rgb(0 0 0 / .18)` | 同 | 投影片對照面板 | 111 |
| `--scrim` | `rgb(0 0 0 / .6)` | 同 | `dialog::backdrop` 遮罩 | 112 |
| `--shine` | `rgba(255,255,255,0.55)` | `… 0.08` | Chat 載入光澤 | 37／155 |

陰影不用 `--shadow-sm/md/lg/xl` 這類名稱，因為那是 Tailwind `@theme` 的命名空間，會被 chat.css 的 theme 輸出蓋掉（tokens.css:106）。

### 2.9 媒體、投影片、程式碼圓點

兩種主題共用（tokens.css:177）：

| Token | 值 | 用途 | 行號 |
|---|---|---|---|
| `--bg-video` | `#000` | 播放器載入前的底色（YouTube、video-practice、video-gallery） | tokens.css:114 |
| `--on-video` | `#fff` | 疊在畫面上的字 | 115 |
| `--video-badge-bg` | `rgb(0 0 0 / .78)` | 片長膠囊 | 116 |
| `--video-scrim` | `rgb(0 0 0 / .18)` | 外部連結縮圖的變暗層 | 117 |
| `--video-scrim-soft` | `rgb(0 0 0 / .15)` | 路線影片播放鈕疊層 | 118 |
| `--video-text-shadow` | `0 1px 4px #000` | 畫面上的白字陰影 | 119 |
| `--slide-backdrop` | `#e5e7eb` | PDF 檢視器載入前的底色 | 121 |
| `--code-dot-red`／`-yellow`／`-green` | `#ff5f57`／`#febc2e`／`#28c840` | 程式碼標題列三顆圓點（Layout:555–557） | 40–42 |

### 2.10 圖表

tokens.css 提供圖表的原始色，`diagram.css` 再衍生成作者用的 `--dg-*`（diagram.css:3–17、113）。圖表作者只用 `dg-*` 類別，不直接碰站上 token。

| Token | 淺色 | 深色 | 衍生為 | 行號 |
|---|---|---|---|---|
| `--diagram-warn` | `var(--danger)` | `#f97066` | `--dg-warn` | tokens.css:123／178 |
| `--diagram-s1`…`s5` | `#5e7a9b` `#b8915a` `#9c6b50` `#6e6479` `#7c8f6f` | `#82a0c0` `#d3ad7a` `#b88670` `#8d8298` `#9caf8f` | `--dg-s1`…`s5`（資料圖系列色，刻意低飽和，accent 留給焦點系列） | 124–128／179–183 |
| `--diagram-on-heat` | `#10261a` | 同 | `dg-text--on-heat` 字色（dg-heat-4/5 上 ≥ 4.2:1） | 129 |

其餘 `--dg-*` 直接由站上 token 衍生：`--dg-ink`／`--dg-muted`＝`--text-primary`／`--text-muted`，`--dg-paper`／`--dg-paper-2`＝`--bg-card`／`--bg-subtle`，`--dg-rule`＝`--border`，`--dg-accent`、`--dg-active`＝`--brand-500`，`--dg-link`＝`--info-border`（diagram.css:4–16）。

### 2.11 字級、間距、圓角

見 §3。

---

## 3. 字級、間距、圓角

這三類現在是 token（tokens.css:76–103）。文章內文（Layout:485–753）與文章頁的多數容器已改用它們；外掛元件的 CSS 檔與文章頁的部分版面還是字面值，見 §5.2。新增元件一律用 token，不要再寫字面值。

`html`／`body` 沒有設定 `font-size`，所以 `1rem` = 瀏覽器預設 16px。

### 3.1 字級 token

| Token | 值 | 用途 | 行號 |
|---|---|---|---|
| `--fs-2xs` | 0.65rem | 分類／類型徽章 | tokens.css:85 |
| `--fs-xs` | 0.75rem | 圖說、tag、篩選鈕、RSS 連結 | 86 |
| `--fs-sm` | 0.875rem | 表格、程式碼區塊、footer、語言切換膠囊、h5/h6 | 87 |
| `--fs-md` | 1rem | 預留（目前沒有使用者） | 88 |
| `--fs-h4` | 1rem | 內文 h4 | 89 |
| `--fs-h3` | 1.05rem | 內文 h3 | 90 |
| `--fs-h2` | 1.3rem | 內文 h2 | 91 |
| `--fs-h1` | 1.7rem | 內文 h1 | 92 |

行內元素用 `em`，跟著所在段落或標題縮放（Layout:522 註解）：行內 `code` 0.9em（Layout:570）、`kbd` 0.9em（571）、標題錨點 0.85em（514）。

尚未 token 化的字級：文章標題 hero h1 1.8rem（Post:469）、TL;DR 0.88rem／標籤 0.68rem（Post:534、539）、meta 與麵包屑 0.82rem（Post:481、508）、圖表標題 .95rem 與圖說 .8rem（diagram.css:24–25、flowDiagram.css:3、49）、YouTube 圖說 0.875rem（Post:1492）。

字型堆疊：`'Latin Quotes', 'Noto Sans TC Local', 'PingFang TC', 'Microsoft JhengHei', system-ui, -apple-system, sans-serif`（Layout:211）。`Latin Quotes` 只負責 U+2018–2019、U+201C–201D 四個彎引號（Layout:172–176），避免中文字型把英文縮寫的撇號畫成全形。

### 3.2 間距 token（4px 基準）

| Token | 值 | Token | 值 |
|---|---|---|---|
| `--space-1` | 0.25rem | `--space-6` | 1.5rem |
| `--space-2` | 0.5rem | `--space-8` | 2rem（目前沒有使用者） |
| `--space-3` | 0.75rem | `--space-10` | 2.5rem |
| `--space-4` | 1rem | `--space-12` | 3rem |
| `--space-5` | 1.25rem | | |

（tokens.css:95–103）

文章元素的垂直間距：

| 元素 | 值 | 出處 |
|---|---|---|
| 段落 | 下 `--space-4` | Layout:523 |
| h2 | 上 `--space-12`＋上內距 `--space-6`＋1px 分隔線，下 `--space-3`；第一個 h2 歸零 | Layout:493–496、503 |
| h3 | 上 `--space-6`、下 `--space-2` | Layout:504 |
| h4 | 上 `--space-5`、下 `--space-2` | Layout:505 |
| 清單 | 下 `--space-4`；`li` 下 `--space-2`；巢狀清單上下 `--space-1` | Layout:651–655 |
| 程式碼區塊 | 下 `--space-5` | Layout:547 |
| 引言框、details | 上下 `--space-5` | Layout:582、635 |
| 表格（`.table-scroll`） | 下 `--space-6` | Layout:723 |
| 圖片 | 上下 `--space-4` | Layout:666 |
| figure | 上下 `--space-6` | Layout:667 |
| 水平線 | 上下 `--space-10` | Layout:662 |
| 本文容器結尾 | 下 `--space-12` | Layout:486 |
| diagram／flow-diagram／Mermaid／YouTube | 上下 1.5rem（字面值） | diagram.css:18、flowDiagram.css:2、Post:1398、1417 |
| video-gallery | 上下 1.75rem（字面值） | videoGallery.css:1 |

### 3.3 圓角 token

| Token | 值 | 用途 | 行號 |
|---|---|---|---|
| `--corner-sm` | 3px | 徽章、行內 code、kbd、tag、篩選鈕、`mark`、術語標記 | tokens.css:79 |
| `--corner-md` | 8px | 所有卡片類容器：程式碼、表格、引言框、details、TL;DR、圖片、TOC、系列框、Mermaid、YouTube | 80 |
| `--corner-lg` | 12px | 大型嵌入（diagram、影片）；**目前沒有任何 `var(--corner-lg)`**，那些檔案仍寫 `.75rem` | 81 |
| `--corner-pill` | 999px | 語言切換膠囊、影片返回鈕 | 82 |

名稱不用 `--radius-*`，因為那是 Tailwind `@theme` 的命名空間，chat.css／globals.css 會在 `:root` 輸出同名變數（tokens.css:76）。

### 3.4 斷點

| 寬度 | 作用 | 出處 |
|---|---|---|
| ≤400px | 左右留白 0.75rem、導覽縮字 | Layout:696；Post:461 |
| ≤480px | 上下篇導覽改單欄 | Post:648 |
| ≤520px | 術語彈窗貼齊左右 | Post:1369 |
| ≤640px | 左右留白 1rem、Mermaid 改捲動 | Layout:671；Post:458、1407 |
| ≥1000px | 文章頁加寬到 1180px、TOC 側欄 | Layout:225；Post:598 |
| 1140–1519px | Ask AI 開啟時收起 TOC | Post:617 |
| ≥1200px | 影片分割檢視 | Post:1437 |

斷點不是 token（CSS 變數不能用在 media query）。

---

## 4. 文章元件

每個元件列出：長相（關鍵 CSS 與 token）、何時用、何時不用、Markdown 寫法、CSS 位置。用量是 `src/content/posts/` 內含該語法的檔案數（2026-11-19，共 7,309 篇，含中英兩版）。

除非特別註明，選擇器都在 `.content` 底下（Post:329 的 `<div class="content">` 包住整篇 Markdown 輸出）。`/styleguide/` 會把下列每個元件渲染一次。

### 4.1 標題

- **長相**：h1–h4 字色 `--brand-900`，字級 `--fs-h1`…`--fs-h4`（Layout:489–505）。h2 上方 1px `--border` 分隔線＋`--space-6` 上內距，第一個 h2 不畫線（Layout:490–503）。h5／h6 `--fs-sm`、`--text-secondary`（506）。h2、h3 hover 時顯示錨點，`--text-muted`（509–520）。
- **何時用**：h2 切大段落（會出現在 TOC），h3 切段內小節，h4 偶爾用於小節內的條列標題（228 篇）。
- **何時不用**：不要用 `#`（h1），文章標題已經由 hero 顯示（Post:180）；不要用 h5／h6（0 篇）；不要為了「讓字變大」用標題。h2 前面不要再放 `---`，會變成兩條線。
- **寫法**：`## 標題`、`### 小節`。
- **CSS**：Layout:488–520。daily 分類只對論文標題與 h4 另有樣式（Post:741–744、870–877），其他字級、行高、段距與一般文章相同（Post:738）。

### 4.2 段落與行內樣式

- **長相**：段落下 `--space-4`（Layout:523）。`strong` 700＋`--text-primary`（524）；`del` 刪除線＋`--text-muted`（526）；`mark` 底 `--mark-bg`、字 `--mark-text`、圓角 `--corner-sm`（527），深色模式是深黃底淡黃字。
- **何時用**：`**粗體**` 標出段落關鍵詞。`<mark>` 只在需要「螢光筆」語意時用（4 篇）。
- **何時不用**：不要整句加粗；不要用 `<mark>` 當裝飾。
- **寫法**：`**粗體**`、`*斜體*`、`~~刪除~~`、`<mark>…</mark>`。
- **CSS**：Layout:522–527。

### 4.3 連結

- **長相**：字 `--brand-700`、底線 `--brand-300`、位移 3px；hover 底線轉 `--brand-500`（Layout:530–531）。深色模式下 `--brand-700` 跟內文只差 1.23:1、`--brand-300` 底線對頁面只有 1.88:1，所以平時就用 `--brand-500` 底線，hover 字轉 `--brand-900`（Layout:532–534）。TOC 與系列導覽的連結 hover 用同一套底線規則（Post:588、644）。外部連結（`https?://`）自動加 `target="_blank" rel="noopener noreferrer"`（astro.config.mjs:23–39）。
- **何時用**：引用來源、站內交叉連結。
- **何時不用**：不要把整句或整段做成連結；連結文字要能單獨看懂（不要寫「這裡」）。
- **寫法**：`[文字](網址)`。
- **CSS**：Layout:529–534。

### 4.4 行內程式碼與 `kbd`

- **長相**：行內 `code` 底 `--brand-100`、字 `--brand-700`、內距 `0.1em 0.35em`、`--corner-sm`、0.9em（Layout:570）。`kbd` 底 `--bg-subtle`、1px `--border`、`--corner-sm`、0.9em、monospace（571）。
- **何時用**：指令、檔名、識別字、設定值。
- **何時不用**：不要拿來強調一般詞彙（用粗體）。`kbd` 目前 0 篇使用。
- **寫法**：`` `code` ``、`<kbd>Ctrl</kbd>`。
- **CSS**：Layout:570–571。

### 4.5 程式碼區塊

- **長相**：macOS 視窗風格。底 `--bg-code`、字 `#d4d4d4`（寫死，見 §5.2）、1px `--border`、`--corner-md`、`overflow: hidden`（Layout:540–549）。上方標題列由 `::before` 畫出三顆 `--code-dot-*` 圓點（550–560）。程式碼本體內距 `--space-4 --space-6`、`--fs-sm`、行高 1.6、**橫向捲動在 `code` 上**（561–568）。
- **語法上色**：Shiki 以 inline style 上色，主題沿用 Astro 預設的 github-dark（`shikiConfig` 沒有指定 `theme`）。唯一的調整是 `readable-comments` transformer：把註解色 `#6A737D`（約 3:1）換成 `#8B949E`，達到 4.5:1，其他語法色不動（astro.config.mjs:434–444）。
- **複製按鈕**：由文章頁 script 加在每個非 Mermaid 的 `pre` 上（Post:998 起），字色是淡化的 `--text-on-accent`（Post:1377–1394）。
- **何時用**：任何超過一行的程式碼、指令、設定檔、純文字輸出。最常見的 fence 語言：`text`、`bash`、`typescript`、`python`、`json`。
- **何時不用**：不要拿 ` ```text ` 畫 ASCII 圖，改用 ` ```diagram `（§4.12）；一行就能寫完的用行內 code。
- **寫法**：三個反引號加語言名。
- **CSS**：Layout:539–568；Post:1376–1394。

### 4.6 清單

- **長相**：左內距 `--space-6`，`ul` 實心圓點、`ol` 數字（Layout:651–653）。`li` 下 `--space-2`（654）。任務清單的 checkbox 用 `accent-color: var(--brand-500)`（656）。
- **何時用**：三項以上平行的項目；步驟用有序清單；任務清單（46 篇）用在檢核表。
- **何時不用**：只有一兩項、或項目之間有因果關係時，寫成段落。
- **寫法**：`- 項目`、`1. 步驟`、`- [ ] 待辦`。
- **CSS**：Layout:650–656。

### 4.7 表格與 `.table-scroll`

- **長相**：文章頁的 script 把每個 `.content table`（`.route-videos__table` 除外）包進 `<div class="table-scroll">`（Post:990–996）。外框負責 1px `--border`、`--corner-md` 與橫向捲動（Layout:718–724）。表格本身 `width: 100%`、`--fs-sm`（728–734）；表頭底 `--bg-subtle`、700、下框 2px（735–742）；表頭與儲存格內距都是 `--space-3 --space-4`（739、744）；欄間 1px 右框（750–753）；列 hover 底 `--bg-subtle`（749）。
- **寬度規則**：寬度是 `100%`，讓儲存格換行；**不要改回 `max-content`**：一格字長就會讓整張表超寬，連桌機都要橫向捲動（Layout:725–727 註解）。真的塞不下的表（欄位多、長字串不能斷）才由 `.table-scroll` 橫向捲動。`/styleguide/` 的版面測試會檢查窄表格不溢出（§6）。
- **何時用**：兩個以上維度的比較、規格表、對照表（5,430 篇）。
- **何時不用**：只有兩欄的「名稱：說明」用清單更好讀；不要在儲存格裡塞長段落或程式碼區塊。
- **寫法**：GFM 表格。
- **CSS**：Layout:717–753；包裝 script Post:990–996。daily 詞彙表另有覆寫（Post:887–898）。

### 4.8 提示框（blockquote 與 callout）

所有 blockquote 都是提示框，分三種。`src/plugins/remarkCallout.ts` 依內容加上 `callout callout-<kind>` 類別（remarkCallout.ts:55–61），沒有辨識到的 blockquote 不加類別、維持預設 note 樣式。

| 種類 | 長相 | 觸發方式 | CSS |
|---|---|---|---|
| **note**（預設） | 底 `--brand-50`、左框 4px `--brand-500`、右側 `--corner-md` 圓角、內距 `--space-4 --space-5`、字 `--text-primary`、不斜體 | 一般 `> …`；`> [!NOTE]`、`> [!IMPORTANT]`；開頭粗體 `**注意**`、`**Note**` | Layout:576–584 |
| **warning** | 底 `--warning-bg`、左框 `--warning-border` | `> [!WARNING]`、`> [!CAUTION]`；開頭粗體 `**警告**`、`**Warning**`、`**Caution**` | Layout:588–591 |
| **tip** | 底 `--success-bg`、左框 `--success-border` | `> [!TIP]`；開頭粗體 `**提示**`、`**小提醒**`、`**Tip**` | Layout:592–595 |

- **兩種寫法的差別**：
  - GitHub alert 語法（第一行 `[!KIND]`）：標記會被移除，換成一段在地化的粗體標題 `.callout-title`（remarkCallout.ts:69–88）。zh-TW 標題：說明／重要／提示／注意／小心；en：Note／Important／Tip／Warning／Caution（remarkCallout.ts:29–35）。標題讓種類不只靠顏色傳達。
  - 開頭粗體：粗體字本身就是標題，不移除任何東西；比對時忽略結尾的全形或半形冒號，英文不分大小寫（remarkCallout.ts:37–47、91–98）。
  - 注意：`**注意**` 是 **note** 不是 warning（中英對照文章裡「注意」對應 Note，remarkCallout.ts:11–12）。要黃框請寫 `**警告**` 或 `> [!WARNING]`。
- **框內段落**：上外距歸零、下 `--space-2`，最後一段歸零（Layout:585–587；瀏覽器預設的 p 上方 1em 在有內距的框裡不會摺疊，框頂會多一行空白）。標題段下 `--space-1`（596）。
- **何時用**：note＝版本說明、閱讀前提醒、補充；warning＝會出錯、會花錢、會失去資料的事；tip＝可選的捷徑或建議。
- **何時不用**：不要連續堆好幾個框；不要把整段正文放進框；引用他人原文時也會是 note 框，引文短就直接寫在段落裡加引號。
- **寫法**：

  ```markdown
  > [!WARNING]
  > 這個指令會刪掉整個資料夾。

  > **提示**：先跑 `--dry-run` 看看會改哪些檔案。
  ```

- **CSS**：Layout:573–596；外掛 `src/plugins/remarkCallout.ts`（astro.config.mjs:448 的 `remarkPlugins` 最後一個）。

### 4.9 語言切換膠囊

- **長相**：文章第一個元素若是「只含一個連結的 blockquote」，就不套提示框，改成小膠囊。分兩層：
  - 外層 blockquote 退回一般區塊：無底色、無框、無圓角、無內距，上外距 0、下 `--space-5`（Layout:601–608）。保持區塊是為了在寬版版面跟內文欄對齊（Layout:599 註解）。
  - 膠囊畫在裡面的 `> p` 上：`display: inline-block`、內距 `0.3rem 0.9rem`、底 `--brand-50`、1px `--brand-300` 框、`--corner-pill`、`--fs-sm`、行高 1.5、字 `--brand-700`（Layout:609–620）。**不要改成 `inline-flex`**：flex 會吃掉 🌏 與連結之間的空白（Layout:610 註解）。
  - 連結 `--brand-700`、600、無底線，hover 才出現底線（Layout:621–627）。
- **判斷條件**：`.content > blockquote:first-child:has(> p:only-child > a:only-child)`（Layout:601）。只有「整篇第一個元素」且「段落裡只有一個連結元素」才會中；前面多一個標題、或同段多一個連結，就會退回 note 框。🌏 是文字節點，不影響判斷。這組選擇器的特異性必須高於 callout 規則（Layout:600 註解）。
- **何時用**：每篇雙語文章的第一行（6,439 篇）。
- **何時不用**：不要拿這個寫法做其他提示；第一行以外的位置不會套用。
- **寫法**：`> 🌏 [English version](/posts/<category>/<slug>-en)`（英文版寫 `> 🌏 [中文版](…)`）。
- **CSS**：Layout:598–627。

### 4.10 摺疊區塊 details／summary

- **長相**：1px `--border` 框、`--corner-md`、底 `--bg-card`、左右內距 `--space-4`、上下外距 `--space-5`（Layout:630–636）。`summary` 600、`--brand-900`、上下內距 `--space-3`，三角形標記 `--brand-500`（637–643）。展開時 summary 下方出現 1px 分隔線（644–648）。
- **何時用**：習題答案（`<details><summary>答案</summary>`，431 篇；英文版 `Answer`）、選讀的推導、補充數字。共 609 篇使用。
- **何時不用**：不要把正文主線藏進去。
- **寫法**：`<details><summary>答案</summary>`，空一行後寫 Markdown，再空一行 `</details>`。
- **CSS**：Layout:629–648。（TOC 與 FAQ 的 `details` 各有自己的樣式，只套在 `.toc`、`.faq-item`。）

### 4.11 水平線

- **長相**：上框 2px 虛線 `--border`、上下 `--space-10`（Layout:659–663）。daily 分類把它壓成 0 高（Post:765–769）。
- **何時用**：主題明顯轉換、但不值得一個 h2 時。
- **何時不用**：不要放在 h2 前面（h2 已經自帶分隔線）。
- **寫法**：獨立一行 `---`（frontmatter 的 `---` 不算）。
- **CSS**：Layout:658–663。

### 4.12 diagram（```diagram）

- **長相**：`<figure class="dg dg--{s|m|l}">`，紙面 `--bg-card`、1px `--border`、圓角 .75rem、內距 `1rem 1rem .75rem`、上下 1.5rem（diagram.css:3–23）。上方標題 .95rem／700（24），下方圖說 .8rem `--text-muted`（25）。SVG 包在可聚焦的 `.dg__scroll` 內，寬圖在框內橫向捲動（26–27）。所有顏色來自 `dg-*` 類別（diagram.css:36–159），淺深色自動切換。
- **尺寸分級**：由 SVG `viewBox` 寬度自動決定，**作者不用指定**（remarkDiagram.ts:76）：

  | 等級 | viewBox 寬 | 最大顯示寬 | 最小顯示寬（之下改捲動） | 出處 |
  |---|---|---|---|---|
  | `s` | ≤ 440 | `min(560px, 原寬)` | 無 | diagram.css:32 |
  | `m` | 441–640 | `min(720px, 原寬)` | `min(480px, 原寬)` | diagram.css:33 |
  | `l` | 641–800 | `min(840px, 原寬)` | `min(600px, 原寬)` | diagram.css:34 |

  「原寬」是外掛寫在 figure 上的 `--dg-w`（remarkDiagram.ts:93）。**最大規則：圖最多 1:1 顯示，不會放大**；之前一張 340 寬的圖會被拉到 560px，15px 的字變成約 25px（diagram.css:29–31 註解）。`max-height: 85vh`（28）。`/styleguide/` 的版面測試會檢查圖的顯示寬度不超過 viewBox（§6）。
- **限制**（建置時報錯）：`viewBox` 寬 200–800、高 80–1600（remarkDiagram.ts:56）；必填 `title`、`desc`（50–51）；不得有 `<script>`、`style`、`font-family`、字面色、外部參照（22–33）。
- **字級**（viewBox 單位）：`dg-label` 15px／600、`dg-sub` 12.5px、`dg-small` 11.5px、`dg-heading` 17px、`dg-big` 26px（diagram.css:75–80）。
- **分步播放**：header 寫 `step:` 行、SVG 元素加 `data-step`，就會出現上一步／播放／下一步控制列（remarkDiagram.ts:96–97；樣式共用 flowDiagram.css:42–45）。
- **何時用**：架構、流程、比較、資料圖，任何需要「看形狀」才懂的東西（440 篇）。
- **何時不用**：純文字就講得清楚時；需要讀者和精確資料互動時。
- **寫法**：

  ````
  ```diagram
  title: 圖標題
  desc: 一句話說明這張圖在表達什麼
  caption: （選填）圖說
  ---
  <svg viewBox="0 0 560 240">…只用 dg-* 類別…</svg>
  ```
  ````

  完整詞彙與範本見 `.agents/skills/diagram/references/style.md`。改完要跑 `pnpm check:diagram-text`（字疊字檢查）。
- **CSS**：`src/styles/diagram.css`；外掛 `src/plugins/remarkDiagram.ts`。

### 4.13 flow-diagram（```flow-diagram）

- **長相**：外框與 diagram 相同（flowDiagram.css:2）。節點底 `--bg-subtle`、框 `--text-muted`（10）；accent 節點底 `--brand-50`、框 `--brand-500`（14）；連線 1.6px 虛線（20）。播放時目前步驟轉 `--brand-500`，其他步驟淡出（27–36）。
- **尺寸**：`max-width: min(680px, 原寬)`、`min-width: min(500px, 原寬)`，原寬＝`--flow-w`（flowDiagram.css:8；remarkFlowDiagram.ts:204）。同樣最多 1:1。
- **何時用**：有先後順序、需要逐步播放的請求流程（18 篇）。節點與連線由 JSON 描述，版面由外掛計算。
- **何時不用**：靜態圖或需要自由排版時，用 ```diagram。
- **寫法**：fence 內是 JSON，必填 `title`、`lang`、`width`／`height`（100–2000）、`nodes`、`edges`、`steps`（remarkFlowDiagram.ts:50–60）。
- **CSS**：`src/styles/flowDiagram.css`；外掛 `src/plugins/remarkFlowDiagram.ts`。

### 4.14 Mermaid（```mermaid）

- **長相**：瀏覽器端把 `pre[data-language="mermaid"]` 換成 `.mermaid-diagram` 再渲染（Post:903–985）。框：上下 1.5rem、內距 1rem、1px `--border`、`--corner-md`、底 `--bg-subtle`、置中（Post:1397–1405）。≤640px 時 SVG 保持原寬、框內捲動（1407–1410）。
- **顏色**：Mermaid 的 `themeVariables` 只吃字面色，所以 script 在渲染時用 `getComputedStyle` 讀 token 的實際值（`themeTokenMap`，Post:911–945），每次切換主題都重新渲染。對應：主色 `--brand-100`／`--brand-500`、次要 `--info-*`、第三色與 note `--warning-*`、線 `--text-muted`、群組 `--bg-subtle`／`--border`。改 token 就會跟著變，不用手改 hex。
- **何時用**：既有文章（365 篇）。
- **何時不用**：新圖優先用 ```diagram：Mermaid 在瀏覽器端渲染、要載入 mermaid 套件，版面也比較難控制。
- **寫法**：` ```mermaid `。
- **CSS**：Post:1396–1410。

### 4.15 圖片、figure、圖說

- **長相**：`img` 最大寬 100%、`--corner-md`、上下 `--space-4`、block（Layout:666）；自動加 `loading="lazy" decoding="async"`（astro.config.mjs:42–60）。`figure` 上下 `--space-6`（667）；`figcaption` `--fs-xs`、`--text-muted`、置中（668）。
- **何時用**：截圖、照片。目前只有 12 篇用 Markdown 圖片、4 篇用 `<figure>`。
- **何時不用**：示意圖不要用點陣圖，改用 ```diagram（跟主題切換、可縮放）。
- **寫法**：`![替代文字](路徑)`；需要圖說時寫 `<figure><img …><figcaption>…</figcaption></figure>`。
- **CSS**：Layout:665–668。

### 4.16 數學（KaTeX）

- **長相**：KaTeX 預設樣式（Layout:14 載入 `katex.min.css`）；獨立公式 `.katex-display` 在自己的區塊內橫向捲動、上下內距 `--space-1`（Layout:537）。
- **何時用**：frontmatter 設 `math: true` 的文章（126 篇）。
- **何時不用**：沒設 `math: true` 時 `$` 只是一般字元。全站不開數學解析，是因為上千篇文章用 `$5 … $20` 寫價格（remarkMathOptIn.ts:19–23）。
- **寫法**：frontmatter `math: true`，行內 `$…$`、獨立 `$$…$$`。交稿前要看實際渲染頁面。
- **CSS**：Layout:536–537；外掛 `src/plugins/remarkMathOptIn.ts`＋`rehype-katex`（astro.config.mjs:448–449）。

### 4.17 註腳

- **長相**：GFM 註腳的預設輸出（文末 `<section>`、上標編號），沒有專屬 CSS。`src/plugins/rehypeFootnoteLabel.ts` 把 zh-TW 頁的註腳標題 `Footnotes` 換成「註腳」、返回連結的 `aria-label` 換成「回到引用處 N」；英文頁不動（rehypeFootnoteLabel.ts:23、30–48）。它必須是 rehype 外掛，因為 Astro 在使用者 rehype 外掛之後才收集標題，TOC 才會拿到在地化的標籤（rehypeFootnoteLabel.ts:9–10）。
- **何時用**：需要附註但不想打斷正文的補充、出處細節。目前 0 篇使用；慣例仍是把來源寫成行內連結或文末參考資料。
- **寫法**：正文 `文字[^1]`，文末 `[^1]: 說明`。
- **CSS**：無；外掛在 astro.config.mjs:449 的 `rehypePlugins` 最後一個。

### 4.18 TL;DR 方塊（frontmatter）

- **長相**：不是本文元件，由 frontmatter `tldr` 產生，位置在麵包屑下方、本文之前（Post:213–218）。底 `--bg-subtle`、1px `--border`、`--corner-md`、內距 `0.75rem 1rem`、0.88rem、行高 1.6；上方「TL;DR」標籤 0.68rem 大寫 700 `--text-muted`（Post:528–546）。
- **何時用**：一兩句話講完全文結論。`description` 不顯示在頁面上，只進 `<meta>`（Layout:79、81）；沒有 `description` 時 meta 改用 `tldr`（Post:93、157）。
- **何時不用**：不要在本文開頭再手寫一個 TL;DR 段落（daily 分類例外，見 §4.23）。
- **CSS**：Post:527–546。

### 4.19 FAQ（frontmatter）

- **長相**：frontmatter `faq` 產生本文之後的問答區（Post:333–343）：上框 1px、每題 1px `--border` 框、`--corner-md`；問題 600／0.95rem，答案 0.92rem `--text-primary`（Post:660–665）。
- **CSS**：Post:660–665。

### 4.20 YouTube 嵌入（```youtube）

- **長相**：`<figure class="video-embed">` 內 16:9 框，1px `--border`、`--corner-md`、載入前底色 `--bg-video`（Post:1416–1433）；圖說 0.875rem `--text-muted`（1490–1494）。寬螢幕（≥1200px）點時間連結會進入分割檢視（1435–1466）；返回鈕 `--corner-pill`、`--shadow-floating`（1467–1489）。
- **何時用**：引用影片或演講片段（970 篇）。
- **寫法**：

  ````
  ```youtube
  url: https://www.youtube.com/watch?v=…
  title: 影片標題
  start: 91
  ```
  ````

  `url`、`title` 必填；`start`、`end`、`loop`、`captions`、`embed: false` 選填（remarkYoutubeEmbed.ts:4–24）。
- **CSS**：Post:1413–1495；外掛 `src/plugins/remarkYoutubeEmbed.ts`。

### 4.21 video-gallery（```video-gallery）

- **長相**：一個播放器加一排可橫向捲動的縮圖；外框 1px `--border`、圓角 .75rem、底 `--bg-card`、上下 1.75rem（videoGallery.css:1）；播放器底 `--bg-video`（videoGallery.css:3）。縮圖上的片長膠囊、變暗層與白字用 §2.9 的 `--video-*` token。
- **何時用**：岩場文章的路線影片（102 篇）。影片清單寫在 `src/data/climbing-videos.ts`。
- **寫法**：fence 內 `key:` 與 `lang:`（remarkVideoGallery.ts:6–14）。
- **CSS**：`src/styles/videoGallery.css`。

### 4.22 video-practice（```video-practice）

- **長相**：英文口說練習卡，外框 1px `--border`、圓角 .75rem、底 `--bg-card`、上下 1.5rem（videoPractice.css:1）；播放器底 `--bg-video`（videoPractice.css:8）。內含播放器、雙語字幕清單、片語 `details`。
- **何時用**：英文口說文章（4 篇）。
- **CSS**：`src/styles/videoPractice.css`；外掛 `src/plugins/remarkVideoPractice.ts`。

### 4.23 其他

- **slide-reader**（32 篇，課程筆記的投影片閱讀器）：文章裡寫 `<div class="slide-reader" data-slide-reader data-pdf-src="…">`，由 `src/lib/slideReader.ts` 接手。框 1px `--border`、圓角 8px、底 `--bg-subtle`（slideReader.css:1）；對話框遮罩 `--scrim`（slideReader.css:6）、PDF 載入前底色 `--slide-backdrop`。樣式檔是單行壓縮格式。
- **術語標記**（`.glossary-term`，由 script 標在本文上）：點狀底線 `--brand-500`、底 `--brand-100` 55%、`--corner-sm`（Post:685–699）。彈窗樣式 Post:1281–1376。
- **daily 分類專用**：`article[data-category="daily"]` 把特定 h3（`tldr`、`read-priority`、`reviewer`、`take-away`）變成小標籤，下一段變成卡片（Post:771–867）。標籤底色借用分類色、字 `--text-on-accent`（Post:776–777、802–803、825–826、851–852）。論文標題 1.2rem、論文 metadata 卡片 0.75rem（Post:741–762）。`daily-brief` 版型只調 TOC（Post:701–732）。

---

## 5. 已知不一致與待辦

2026-11-19 修了一大批；本節先簡列已解決的，再列還沒解決的。

### 5.1 已解決（2026-11-19）

- **第二個 token 來源**：文章頁 `article { --text-secondary; --brand-700 }` 的覆寫已刪（Post:445 註解）。`check:chat-style` 規則 1 改成「tokens.css 宣告的任何名稱都不准在別處再宣告」（scripts/check-chat-style.mjs:31–35、77–84），並有 `--self-test` 接進 `pnpm verify`（scripts/verify.mjs:168）。
- **三套連結色**：統一成 Layout 一套（`--brand-700` 字＋`--brand-300`／`--brand-500` 底線，Layout:529–534）；寫死的 hover 藍 `#1d4ed8` 已移除，TOC 與系列導覽改用同一套底線（Post:588、644）。
- **引言框只有藍色一種**：預設改成品牌綠 note，新增 warning、tip；由 `remarkCallout.ts` 支援 GitHub alert 語法與開頭粗體（§4.8）。原本產生不出來的 success 死碼已移除。
- **Mermaid 手抄 hex**：改成渲染時讀 token（Post:911–945），淺深色不會再漂移。
- **h2 色條定義又關掉**：色條移除，h2 分隔線統一寫在 Layout（Layout:490–503），文章頁不再覆寫。
- **寫死的顏色**：Post、chat.css、videoGallery.css、videoPractice.css、diagram.css 的字面色都已換成 token（§2.6–2.10）；hero 漸層改用 `--brand-*`／`--bg-*`（Post:451、465）；daily 標籤改用分類色；YouTube 播放器底色統一為 `--bg-video`（Post:1426）。
- **類型徽章、`mark` 不跟深色模式**：新增 `--type-*`、`--mark-*`，都有深色值。
- **分類色沒有深色值**：低對比的 8 個已補深色值；`--cat-surf`、`--cat-learning` 換成白字 ≥ 4.5:1 的淺色值。
- **對比不足**：`--brand-500`／`--text-secondary` 淺色改 `#2f7a4d`、`--text-muted` 改 `#6e6e6e`，都 ≥ 4.5:1；程式碼註解色提亮（§4.5）。
- **字級、間距、圓角未 token 化**：新增 `--fs-*`、`--space-*`、`--corner-*`，文章內文全部改用（§3）。
- **daily 分叉一套字級**：daily 的內文字級、行高、段距、h2／h3 已與一般文章相同（Post:738）。
- **本文 details 沒有樣式**：補上框、標題與展開分隔線（§4.10）。
- **註腳**：zh-TW 頁的註腳標題與返回連結已在地化（§4.17）。
- **提示框框頂多一行空白**：框內段落上外距歸零（Layout:585–586）。
- **沒用到的 token**：`--info-icon`、`--success-icon`、`--slide-page` 已刪。

### 5.2 還沒解決

依影響排序。

1. **深色模式下品牌色階沒有綠色**：`--brand-900/700` 深色是灰、`--brand-100/50` 是藍灰（tokens.css:133–138），名稱跟顏色對不上，元件作者容易選錯。改成語意層 token（例如 `--link`、`--callout-note-bg`、`--accent`，再對應到色階）的提案**還在等決定**，目前沒有實作。
2. **外掛元件的 CSS 檔還是字面值的字級、間距、圓角**：`diagram.css`、`flowDiagram.css`、`videoGallery.css`、`videoPractice.css`、`slideReader.css` 沒有用 `--fs-*`／`--space-*`／`--corner-*`。`--corner-lg` 本來是給 diagram 與影片用的，但目前 0 個 `var(--corner-lg)`，它們仍寫 `.75rem`（diagram.css:21、flowDiagram.css:2、videoGallery.css:1、videoPractice.css:1）；影片內層還有 .5／.4／.3／.25rem 等圓角（videoGallery.css:3、16、18、48；videoPractice.css:8、12）。slideReader.css 有 5／8／10／12px（slideReader.css:1、2、4、50）。
3. **文章頁還有零星字面值**：daily 標籤 4px 圓角（Post:779、805、828、854）、複製鈕 4px（Post:1386）、術語彈窗按鈕 5px／6px／4px（Post:1298、1327、1360）；hero、麵包屑、TOC、上下篇導覽、FAQ 等版面的字級與間距仍是 rem 字面值（例如 Post:469、481、508、534、539、584）。
4. **程式碼區塊的字色與標題列**：字 `#d4d4d4`、標題列 `rgba(0,0,0,0.15)`、分隔線 `rgba(255,255,255,0.05)` 寫死（Layout:543、554、559）。
5. **About 頁與導覽列沒有 token 化**：導覽列與頁首（Layout:241–380）、About 頁（Layout:755–1537）仍是字面值的字級、間距、圓角，About 頁還有寫死的 rgba（Layout:1383、1418、1427、1463）。
6. **沒有使用者的新 token**：`--fs-md`、`--space-8`、`--corner-lg` 用量 0。等外掛 CSS 改用 token（第 2 點）時再決定是否保留。
7. **`--dg-warn-tint` 用 `--danger` 而不是 `--diagram-warn`**（diagram.css:15）：深色模式下 warn 線是 `#f97066`、淡底卻由 `#f87171` 調出，兩者接近但不同源。
8. **後台**：`admin-tokens.css` 是獨立系統，本文件不涵蓋。

---

## 6. 怎麼改設計

1. **先找到元件在這份文件的哪一節**，照「CSS」欄的行號去改。Markdown 內文通用的樣式在 Layout 的 `.content` 區段（Layout:485–753），外掛產生的元件各有自己的 CSS 檔（`src/styles/diagram.css`、`flowDiagram.css`、`videoGallery.css`、`videoPractice.css`、`slideReader.css`，由 Layout:7–14 載入），只在文章頁出現的在 Post 的 `<style>`。Markdown 語法層的行為（提示框種類、註腳文字）在 `src/plugins/`。
2. **改顏色、字級、間距、圓角只改 `src/styles/tokens.css`。** 淺色在 `:root`、深色在 `[data-theme="dark"]`，有深色值的兩邊一起改；新的文字色要對它的底色 ≥ 4.5:1。不要在別處重宣告 token，`check:chat-style` 規則 1 會讓 verify 失敗（scripts/check-chat-style.mjs:31–35）。
3. **新增元件**：先確認既有元件真的不夠用。顏色、字級、間距、圓角都用 token；寬度遵守原則 5（放不下就給自己的捲動容器）；在 390px 與 1280px、淺色與深色四種組合都看過。
4. **看 `/styleguide/`。** 這個頁面把本文件列的每個元件都渲染一次，改完 CSS 直接在這裡比對，不用翻文章找範例。新增元件要把範例加進 `src/content/styleguide/styleguide.md`。
5. **跑 `pnpm verify`。** 它包含 `check:chat-style`（含 `--self-test`）、`check:diagram-text` 等檢查；紅燈就修真正的問題，不弱化檢查。
6. **版面測試會擋。** `tests/visual/styleguide.spec.ts` 在 CI 的 `pnpm test:visual` 裡跑，對 `/styleguide/` 檢查：頁面沒有橫向溢出、文字對比足夠、語言切換膠囊精簡且與內文對齊、窄表格不溢出、圖表顯示寬度不超過 viewBox。這些是 §1 原則 3–6 的自動化版本；新元件要加進 `/styleguide/` 才會被涵蓋。依專案規則，本機跑測試前要先取得同意，否則以 CI 結果為準。
7. **回頭更新這份文件。** 改了值或行號就同步更新對應段落；新增元件就在 §4 補一節（長相、何時用、何時不用、寫法、CSS 位置）；修掉 §5.2 的項目就移到 §5.1。
