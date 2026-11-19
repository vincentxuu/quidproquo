# quidproquo 設計系統

> 這份文件描述**目前已實作**的前台設計：token、字級與間距的實際用值、每個文章元件長什麼樣、什麼時候用。
> 程式碼才是正本；本文件的每個數值都附 `檔案:行號`，兩者不一致時以程式碼為準，並回頭修正本文件。
> 2026-03 的規格 `docs/superpowers/specs/2026-03-12-blog-redesign-design.md` 已經跟實作脫節（例如它寫 `--brand-500 #4a7c59`、`--text-muted #a7c4a0`，實際是 `#4a9e6a`、`#767676`），只當歷史參考。
>
> 範圍：文章頁（`src/layouts/PostLayout.astro`＋`src/pages/posts/[...slug].astro`）與它載入的樣式。後台 `src/styles/admin-tokens.css` 是另一套獨立介面，不在本文件範圍。
>
> 行號以 2026-11-19（commit `9a82ed2e8`）為準；Post 的行號已含同日 styleguide 頁替它加的 `noindex` 兩行。

本文件常用的兩個檔案簡稱：

- **Layout**＝`src/layouts/PostLayout.astro`（全站共用版面，`<style is:global>` 在 162–1515 行；870 行以後幾乎都是 About 頁專用樣式）
- **Post**＝`src/pages/posts/[...slug].astro`（文章頁；scoped `<style>` 在 440–982 行，global 樣式在 1373–1503、1505–1586 行）

---

## 1. 原則

1. **Editorial：靠字重與留白撐結構，不靠色塊。** 標題用 900／800／700 三級字重（Layout:489、492、512），段落之間靠 `margin` 分開；文章頁的 h2 用一條 1px 分隔線切段（Post:468–473），不用色塊或卡片包段落。
2. **森林綠是唯一的品牌色。** 品牌色＝`--brand-*`（tokens.css:15–20）。藍、黃、紅只拿來表達狀態（資訊／警告／錯誤），不當裝飾色。（目前引言框預設是藍色，這是已知的不一致，見 §5。）
3. **可讀優先。** 本文欄寬上限 760px（Post:650，註解：約 44 個全形字一行），行高 1.8（Layout:486）。文章頁的本文連結改成深色文字加細底線（Post:453–462），不用綠字，避免整段被連結染色。
4. **行動優先。** 所有元件要先在 390px 寬成立。頁面左右留白隨寬度遞減：1.5rem → 1rem（≤640px）→ 0.75rem（≤400px）（Layout:212、650、675）。
5. **元素不能比容器寬；放不下就給它自己的捲動容器。** 表格包在 `.table-scroll`（Layout:696–702）、長公式在 `.katex-display` 內捲動（Layout:542）、程式碼在 `pre code` 內捲動（Layout:569）、圖表在 `.dg__scroll`／`.flow-diagram__scroll` 內捲動（diagram.css:27、flowDiagram.css:4）。`html { overflow-x: hidden }`（Layout:206–208）只是最後一道保險，不是解法：被它切掉的內容讀者看不到。
6. **圖不放大超過設計尺寸。** 圖寬上限是 `min(分級上限, viewBox 寬)`，最多 1:1 顯示；空間不夠時先縮小到下限，再改成框內捲動（diagram.css:30–35、flowDiagram.css:7–8）。
7. **顏色只從 token 來。** 元件 CSS 用 `var(--token)`；圖表 SVG 禁止寫字面色，建置時直接報錯（`src/plugins/remarkDiagram.ts:32`）。
8. **淺色、深色都要成立。** 每個 token 都有深色值（tokens.css:67–95），除非刻意共用（例如程式碼區塊在兩種主題都是深底）。深色模式由 `[data-theme="dark"]` 切換（Layout:102–109）。
9. **元件由 Markdown 語法決定，不在文章裡寫樣式。** 目前 7,309 篇文章裡沒有任何 `style="`；圖表 fence 也禁止 `style` 屬性與 `<style>`（remarkDiagram.ts:28–29）。需要新樣式就新增元件，不在文章裡臨時拼。

---

## 2. Token

唯一來源：`src/styles/tokens.css`。由 Layout:7 與 `src/pages/chat.astro` 載入。

「用量」是 `src/` 內 `var(--token` 出現的次數（2026-11-19 grep），用來判斷哪些 token 實際上沒人用。

### 2.1 品牌色

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--brand-900` | `#1a2e1a` | `#e8e8e8` | 最強的字色：標題、logo、啟用中的按鈕底 | tokens.css:15／68 |
| `--brand-700` | `#2d4a2d` | `#c0c0c0` | 次強字色：行內程式碼字、tag 字 | 16／69 |
| `--brand-500` | `#4a9e6a` | `#5cb87a` | 品牌主色：focus 外框、閱讀進度條、hover 邊框、圖表 accent | 17／70 |
| `--brand-300` | `#a7c4a0` | `#2d4a2d` | 淡綠：連結底線、語言切換膠囊的框 | 18／71 |
| `--brand-100` | `#e8f5e8` | `#1c2833` | 淡底：行內程式碼底、tag 底、術語標記底 | 19／72 |
| `--brand-50`  | `#f0f7f0` | `#151d26` | 最淡底：語言切換膠囊底、flow-diagram accent 節點 | 20／73 |

注意：深色模式下 `--brand-900`／`--brand-700` 是灰色、`--brand-100`／`--brand-50` 是藍灰色，不是綠色。這組名稱表示「強度階層」，不保證色相；要綠色請用 `--brand-500`。

### 2.2 文字

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--text-primary` | `#1a1a1a` | `#d1d5db` | 內文、表格、引言框文字 | tokens.css:22／75 |
| `--text-secondary` | `#4a7c59` | `#5cb87a` | 導覽連結、h5/h6、TOC 標題 | 23／76 |
| `--text-muted` | `#767676` | `#8b929e` | 圖說、footer、meta；深色值對 `--bg-page`、`--bg-card` ≥ 4.5:1（tokens.css:77 註解） | 24／77 |

文章頁會在 `article` 內把 `--text-secondary` 改成 `#555`／`#9ca3af`、`--brand-700` 改成 `#374151`／`#d1d5db`（Post:444–451）。這是 tokens.css 以外的第二個來源，見 §5。

### 2.3 背景

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--bg-page` | `#ffffff` | `#0f1419` | 頁面底色 | tokens.css:25／78 |
| `--bg-subtle` | `#f5f7f5` | `#151d26` | 次層底：表頭、TL;DR、TOC、表格 hover | 26／79 |
| `--bg-card` | `#ffffff` | `#1a2332` | 卡片與圖表的紙面 | 27／80 |
| `--bg-code` | `#1e1e2e` | `#0d1117` | 程式碼區塊底（兩種主題都是深底） | 28／81 |

### 2.4 邊框與強調

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--border` | `#d1e8d1` | `#2a3545` | 所有 1px 邊框、分隔線、表格格線 | tokens.css:21／74 |
| `--heading-accent` | `#e8657a` | `#f472b6` | h2 底下的短色條、回到頂端按鈕；文章頁的 h2 色條已被關掉（見 §4.1） | 29／82 |

### 2.5 狀態色

| Token | 淺色 | 深色 | 用途 | 用量 | 行號 |
|---|---|---|---|---|---|
| `--info-bg` | `#eef6ff` | `#151d26` | 引言框預設底色 | — | tokens.css:30／83 |
| `--info-border` | `#3b82f6` | `#3b82f6` | 引言框左框；圖表 `link` 色（diagram.css:12） | — | 31／84 |
| `--info-icon` | `#3b82f6` | `#60a5fa` | 預留給資訊圖示 | 0 | 32／85 |
| `--success-bg` | `#eefbf3` | `#151d26` | success 引言框底 | 1 | 33／86 |
| `--success-border` | `#22c55e` | `#22c55e` | success 引言框左框 | 1 | 34／87 |
| `--success-icon` | `#22c55e` | `#4ade80` | 預留 | 0 | 35／88 |
| `--warning-bg` | `#fffbeb` | `#1a1a0f` | 只用在搜尋元件與額度條，文章內沒有 warning 元件 | 2 | 36／89 |
| `--warning-border` | `#f59e0b` | `#f59e0b` | 同上 | 2 | 37／90 |
| `--danger` | `#b42318` | `#f87171` | 錯誤；圖表 `warn` 色（diagram.css:14、flowDiagram.css:2） | — | 38／91 |

### 2.6 陰影與光澤

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--shadow-card-hover` | `0 2px 12px rgba(0,0,0,0.08)` | `… 0.25` | 卡片 hover | tokens.css:40／93 |
| `--shadow-floating` | `0 2px 12px rgba(0,0,0,0.15)` | `… 0.4` | 浮動元素：回到頂端、術語彈窗 | 41／94 |
| `--shine` | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.08)` | 只用在 Chat 的載入光澤（chat.css:318） | 39／92 |

### 2.7 程式碼視窗圓點

`--code-dot-red #ff5f57`、`--code-dot-yellow #febc2e`、`--code-dot-green #28c840`（tokens.css:42–44），只有淺色值，兩種主題共用。用在程式碼區塊標題列（Layout:560–562）。

### 2.8 分類色

只有淺色值（tokens.css:47–64），兩種主題共用；由 `.cat-*` 類別套成分類徽章底色，字一律白色（Layout:404–431）。

| Token | 值 | Token | 值 |
|---|---|---|---|
| `--cat-tech` | `#1a1a1a` | `--cat-coffee` | `#92400e` |
| `--cat-ai` | `#6d28d9` | `--cat-investing` | `#047857` |
| `--cat-product` | `#0369a1` | `--cat-learning` | `#0d9488` |
| `--cat-education` | `#b45309` | `--cat-design` | `#a21caf` |
| `--cat-life` | `#15803d` | `--cat-policy` | `#475569` |
| `--cat-marketing` | `#be185d` | `--cat-anime` | `#e11d48` |
| `--cat-travel` | `#c2410c` | `--cat-career` | `#0c4a6e` |
| `--cat-climbing` | `#57534e` | `--cat-weather` | `#2563eb` |
| `--cat-surf` | `#0891b2` | `--cat-film` | `#292524` |

新增分類時：在 tokens.css 加 `--cat-<name>`，在 Layout 的 `.cat-*` 區塊（Layout:414–431）加一行。

### 2.9 圖表專用的衍生 token

`.dg` 從站上 token 衍生出圖表調色盤（diagram.css:3–17），圖表作者只用 `dg-*` 類別，不直接碰站上 token：

| 衍生 token | 來源 |
|---|---|
| `--dg-ink`／`--dg-muted` | `--text-primary`／`--text-muted` |
| `--dg-paper`／`--dg-paper-2` | `--bg-card`／`--bg-subtle` |
| `--dg-rule` | `--border` |
| `--dg-accent`、`--dg-active` | `--brand-500` |
| `--dg-accent-text` | `color-mix(--brand-500 70%, --text-primary)` |
| `--dg-link` | `--info-border` |
| `--dg-warn` | `--danger`（深色模式例外寫死 `#f97066`，diagram.css:24） |
| `--dg-s1`…`--dg-s5` | 資料圖的系列色，寫死在 diagram.css:114–115（淺深各一組） |

---

## 3. 字級、間距、圓角（目前未 token 化）

這三類**沒有 token**，以下是從 CSS 盤點出來的實際用值，當作事實上的級距。新增元件時從這些值裡挑，不要再發明新值。

`html`／`body` 沒有設定 `font-size`，所以 `1rem` = 瀏覽器預設 16px。

### 3.1 文章字級

| 元素 | 字級 | 字重 | 行高 | 出處 |
|---|---|---|---|---|
| 文章標題（hero h1） | 1.8rem | 900 | 1.25 | Post:511–518 |
| 內文 h1 | 1.7rem | 900 | 繼承 1.8 | Layout:489 |
| h2 | 1.3rem | 800 | 繼承 | Layout:490–501 |
| h3 | 1.05rem | 700 | 繼承 | Layout:512 |
| h4 | 0.95rem | 700 | 繼承 | Layout:513 |
| h5／h6 | 0.9rem | 600 | 繼承 | Layout:514 |
| 內文 | 1rem（未設定） | 瀏覽器預設 | 1.8 | Layout:486 |
| 程式碼區塊 | 0.88rem | — | 1.6 | Layout:570–571 |
| 行內程式碼 | 0.9em | — | — | Layout:575 |
| `kbd` | 0.85em | — | — | Layout:576 |
| 表格 | 0.9rem | 表頭 700 | — | Layout:710、715 |
| TL;DR | 0.88rem；標籤 0.68rem | 標籤 700 | 1.6 | Post:577–578、582 |
| 語言切換膠囊 | 0.85rem | 連結 600 | 1.5 | Layout:609–610、615 |
| 圖表標題 | 0.95rem | 700 | — | diagram.css:25、flowDiagram.css:3 |
| 圖說（img、圖表） | 0.8rem | — | — | Layout:646、diagram.css:26、flowDiagram.css:49 |
| 文章 meta（日期、閱讀時間） | 0.82rem | — | — | Post:524 |
| 麵包屑 | 0.82rem | 分類 600 | — | Post:551、566 |
| 分類／類型徽章 | 0.62rem 大寫 | 700 | — | Layout:405、435 |
| tag | 0.72rem | — | — | Layout:477 |

字型堆疊：`'Latin Quotes', 'Noto Sans TC Local', 'PingFang TC', 'Microsoft JhengHei', system-ui, -apple-system, sans-serif`（Layout:211）。`Latin Quotes` 只負責 U+2018–2019、U+201C–201D 四個彎引號（Layout:172–176），避免中文字型把英文縮寫的撇號畫成全形。

事實上的字級階梯（rem）：0.62／0.68／0.72／0.8／0.82／0.85／0.88／0.9／0.95／1／1.05／1.3／1.7／1.8。

### 3.2 間距

文章元素的垂直間距（`margin`）：

| 元素 | 值 | 出處 |
|---|---|---|
| 段落 | 下 1rem | Layout:531 |
| h2（一般） | 上 2.5rem、下 0.75rem | Layout:493 |
| h2（文章頁覆寫） | 上 3rem＋上內距 1.5rem＋1px 分隔線；第一個 h2 歸零 | Post:468–479 |
| h3 | 上 1.5rem、下 0.5rem | Layout:512 |
| h4 | 上 1.25rem、下 0.4rem | Layout:513 |
| 清單 | 下 1rem；`li` 下 0.35rem；巢狀清單上下 0.25rem | Layout:629–633 |
| 程式碼區塊 | 下 1.25rem | Layout:552 |
| 引言框 | 上下 1.25rem | Layout:585 |
| 表格（`.table-scroll`） | 下 1.5rem | Layout:701 |
| 圖片 | 上下 1rem | Layout:644 |
| figure | 上下 1.5rem | Layout:645 |
| 水平線 | 上下 2.5rem | Layout:640 |
| diagram／flow-diagram／Mermaid／YouTube／slide-reader | 上下 1.5rem | diagram.css:18、flowDiagram.css:2、Post:1492、Post:1511、slideReader.css:1 |
| video-gallery | 上下 1.75rem | videoGallery.css:1 |
| 本文容器結尾 | 下 3rem | Layout:486 |

事實上的間距階梯（rem）：0.25／0.35／0.4／0.5／0.75／1／1.25／1.5／2／2.5／3。不在階梯上的值見 §5。

框內距（`padding`）常見值：引言框 `1rem 1.25rem`（Layout:583）、TL;DR `0.75rem 1rem`（Post:574）、表頭 `0.7rem 1rem`／儲存格 `0.65rem 1rem`（Layout:717、722）、程式碼 `1rem 1.5rem`（Layout:568）、圖表 `1rem 1rem .75rem`（diagram.css:19、flowDiagram.css:2）。

### 3.3 圓角

| 值 | 用在 | 出處 |
|---|---|---|
| 2px | 分類／類型徽章、h2 色條、`mark` | Layout:409、438、510、535 |
| 3px | 行內程式碼、`kbd`、tag、篩選按鈕、頁首語言徽章 | Layout:575、576、479、460、330 |
| 4px | skip link、複製按鈕、daily 標籤徽章 | Layout:189、Post:1480、Post:858 |
| 6px | TL;DR、daily 卡片、術語彈窗切換鈕 | Post:575、831、1421 |
| 8px | 程式碼區塊、引言框（右側）、圖片、表格、TOC、系列框、Mermaid、YouTube | Layout:550、582、644、700、711；Post:597、680、1495、1517 |
| 0.75rem（12px） | diagram、flow-diagram、video-gallery、video-practice | diagram.css:21、flowDiagram.css:2、videoGallery.css:1、videoPractice.css:1 |
| 999px | 語言切換膠囊、搜尋鈕、影片返回鈕 | Layout:608、296、Post:1565 |
| 50% | 頁首圓形圖示鈕 | Layout:277 |

### 3.4 斷點

| 寬度 | 作用 | 出處 |
|---|---|---|
| ≤400px | 左右留白 0.75rem、導覽縮字 | Layout:674；Post:504 |
| ≤480px | 上下篇導覽改單欄 | Post:690 |
| ≤520px | 術語彈窗貼齊左右 | Post:1464 |
| ≤640px | 左右留白 1rem、Mermaid 改捲動 | Layout:649；Post:501、1501 |
| ≥1000px | 文章頁加寬到 1180px、TOC 側欄 | Layout:225；Post:640 |
| 1140–1519px | Ask AI 開啟時收起 TOC | Post:659 |
| ≥1200px | 影片分割檢視 | Post:1530 |

---

## 4. 文章元件

每個元件列出：長相（關鍵 CSS 與 token）、何時用、何時不用、Markdown 寫法、CSS 位置。用量是 `src/content/posts/` 內含該語法的檔案數（2026-11-19，共 7,309 篇，含中英兩版）。

除非特別註明，選擇器都在 `.content` 底下（Post:327 的 `<div class="content">` 包住整篇 Markdown 輸出）。

### 4.1 標題

- **長相**：h1–h4 字色 `--brand-900`，字級見 §3.1。h2 在 Layout 有一條 3rem × 3px 的 `--heading-accent` 色條（Layout:502–511），但**文章頁把它關掉**（Post:464–466），改成上方 1px `--border` 分隔線＋3rem 上外距（Post:468–473），第一個 h2 不加線（Post:474–479）。h2、h3 hover 時顯示錨點連結，字色 `--text-muted`（Layout:517–528）。
- **何時用**：h2 切大段落（會出現在 TOC），h3 切段內小節，h4 偶爾用於小節內的條列標題（228 篇用到 h4）。
- **何時不用**：不要用 `#`（h1），文章標題已經由 hero 顯示（Post:178）；不要用 h5／h6（0 篇使用）；不要為了「讓字變大」用標題。
- **寫法**：`## 標題`、`### 小節`。
- **CSS**：Layout:488–528；Post:463–479。daily 分類另有覆寫（Post:788–808、816–822、954–961）。

### 4.2 段落與行內樣式

- **長相**：段落下外距 1rem（Layout:531）。`strong` 700＋`--text-primary`（532）；`del` 刪除線＋`--text-muted`（534）；`mark` 黃底 `#fef08a`、字 `#1a1a1a`（535，寫死色，深色模式不變）。
- **何時用**：`**粗體**` 標出段落關鍵詞。`<mark>` 目前只有 4 篇用。
- **何時不用**：不要整句加粗；不要用 `<mark>` 當裝飾（它在深色模式下是一塊亮黃）。
- **寫法**：`**粗體**`、`*斜體*`、`~~刪除~~`、`<mark>…</mark>`。
- **CSS**：Layout:530–535。

### 4.3 連結

- **長相**：兩層規則疊在一起。
  - Layout 的預設：`--brand-500` 綠字、`--brand-300` 底線、底線位移 2px（Layout:538–539）。
  - **文章頁實際看到的**：`--text-primary` 深色字、`--border` 底線、位移 3px，hover 時底線轉成字色（Post:453–462）。
  - 外部連結（`https?://`）自動加 `target="_blank" rel="noopener noreferrer"`（`astro.config.mjs:21–37`）。
- **何時用**：引用來源、站內交叉連結。
- **何時不用**：不要把整句或整段做成連結；連結文字要能單獨看懂（不要寫「這裡」）。
- **寫法**：`[文字](網址)`。
- **CSS**：Layout:537–539；Post:452–462。

### 4.4 行內程式碼與 `kbd`

- **長相**：行內 `code` 底 `--brand-100`、字 `--brand-700`、內距 `0.1em 0.35em`、圓角 3px、0.9em（Layout:575）。注意文章頁把 `--brand-700` 改成灰色（Post:446），所以文章裡的行內程式碼字是 `#374151`。`kbd` 底 `--bg-subtle`、1px `--border`、0.85em、monospace（Layout:576）。
- **何時用**：指令、檔名、識別字、設定值。
- **何時不用**：不要拿來強調一般詞彙（用粗體）。`kbd` 目前 0 篇使用。
- **寫法**：`` `code` ``、`<kbd>Ctrl</kbd>`。
- **CSS**：Layout:575–576。

### 4.5 程式碼區塊

- **長相**：macOS 視窗風格。底 `--bg-code`，字 `#d4d4d4`（寫死），1px `--border`，圓角 8px，`overflow: hidden`（Layout:545–554）。上方標題列由 `::before` 畫出三顆 `--code-dot-*` 圓點（Layout:555–565）。程式碼本體內距 `1rem 1.5rem`、0.88rem、行高 1.6、**橫向捲動在 `code` 上**（Layout:566–573）。語法上色由 Shiki 以 inline style 產生，主題沿用 Astro 預設的 github-dark（`astro.config.mjs` 的 `shikiConfig` 沒有指定 `theme`）。唯一的調整是 `readable-comments` transformer：把註解色 `#6A737D`（在程式碼底色上約 3:1）換成 `#8B949E`，達到 WCAG 4.5:1，其他語法色不動（astro.config.mjs:432–442）。要改語法色請用同樣的 transformer 做法，改完看 `/styleguide/` 的對比測試。右上角的複製按鈕由文章頁的 script 加上（Post:1093 起），樣式在 Post:1473–1488。
- **何時用**：任何超過一行的程式碼、指令、設定檔、純文字輸出。最常見的 fence 語言：`text`、`bash`、`typescript`、`python`、`json`。
- **何時不用**：不要拿 ` ```text ` 畫 ASCII 圖，改用 ` ```diagram `（§4.12）；不要放一行就能寫完的東西（用行內 code）。
- **寫法**：三個反引號加語言名。
- **CSS**：Layout:544–573；Post:1472–1488。

### 4.6 清單

- **長相**：左內距 1.5rem，`ul` 實心圓點、`ol` 數字（Layout:629–631）。`li` 下外距 0.35rem（624）。任務清單的 checkbox 用 `accent-color: var(--brand-500)`（626）。
- **何時用**：三項以上平行的項目；步驟用有序清單。任務清單（46 篇）用在檢核表。
- **何時不用**：只有一兩項、或項目之間有因果關係時，寫成段落。
- **寫法**：`- 項目`、`1. 步驟`、`- [ ] 待辦`。
- **CSS**：Layout:628–634。

### 4.7 表格與 `.table-scroll`

- **長相**：文章頁的 script 把每個 `.content table`（`.route-videos__table` 除外）包進 `<div class="table-scroll">`（Post:1085–1091）。外框負責邊框、圓角 8px 與橫向捲動（Layout:696–702）。表格本身 `width: 100%`、0.9rem（Layout:706–712）；表頭底 `--bg-subtle`、700、下框 2px `--border`（705–712）；儲存格下框 1px、欄間 1px 右框（713–723）；列 hover 底 `--bg-subtle`（719）。
- **寬度規則**：寬度是 `100%`，讓儲存格換行；**不要改回 `max-content`**。2026-11-19 之前用 `max-content`，一格字長就讓整張表超寬，連桌機都要橫向捲動（Layout:703–705 註解）。真的塞不下的表（欄位多、長字串不能斷）才由 `.table-scroll` 橫向捲動。
- **何時用**：兩個以上維度的比較、規格表、對照表。
- **何時不用**：只有兩欄的「名稱：說明」用清單更好讀；不要在儲存格裡塞長段落或程式碼區塊。
- **寫法**：GFM 表格（5,430 篇使用）。
- **CSS**：Layout:695–731；包裝 script Post:1085–1091。daily 詞彙表另有覆寫（Post:972–982）。

### 4.8 引言框（blockquote，預設 info 樣式）

- **長相**：所有 blockquote 預設都是資訊提示框：底 `--info-bg`、左框 4px `--info-border`（藍）、右側圓角 8px、內距 `1rem 1.25rem`、字 `--text-primary`、不斜體（Layout:579–587）。框內段落間距縮成 0.35rem，最後一段歸零（588–589）。
- **何時用**：版本說明、閱讀前提醒、「注意」與補充說明。實際用法常以粗體開頭：`> **版本說明**：…`、`> **注意：**…`、`> **Self-check**…`。
- **何時不用**：不要用來引用他人原文以外的長段落；不要連續堆好幾個框；警告類內容目前沒有專屬樣式（見 §5），一樣會是藍框。
- **寫法**：`> 內容`。
- **CSS**：Layout:578–589。

### 4.9 success 引言框（目前無法從 Markdown 產生）

- **長相**：底 `--success-bg`、左框 `--success-border`（Layout:622–626）。
- **現況**：觸發條件是 `blockquote.callout-success` 或 `strong[data-type="success"]`，兩者 Markdown 都產生不出來，全站 0 篇使用。這段 CSS 目前是死碼；不要以為寫 `> [!TIP]` 會變綠框（0 篇使用，也沒有外掛處理它）。
- **CSS**：Layout:621–626。

### 4.10 語言切換膠囊

- **長相**：文章第一個元素若是「只含一個連結的 blockquote」，就不套藍框，改成小膠囊。分兩層：
  - 外層 blockquote 退回一般區塊：無底色、無框、無圓角、無內距，上外距 0、下外距 1.25rem（Layout:593–600）。保持區塊是為了在寬版版面跟內文欄對齊（Layout:592 註解）。
  - 膠囊畫在裡面的 `> p` 上：`display: inline-block`、內距 `0.3rem 0.9rem`、底 `--brand-50`、1px `--brand-300` 框、圓角 999px、0.85rem、行高 1.5、字 `--brand-700`（Layout:601–612）。**不要改成 `inline-flex`**：flex 會吃掉 🌏 與連結之間的空白（Layout:602 註解）。
  - 連結 `--brand-700`、600、無底線，hover 才出現底線（Layout:613–619）。文章頁把 `--brand-700` 改成灰色 `#374151`（Post:446），所以實際看到的是深灰字。
- **判斷條件**：`.content > blockquote:first-child:has(> p:only-child > a:only-child)`（Layout:593）。只有「整篇第一個元素」且「段落裡只有一個連結元素」才會中；前面多一個標題、或同段多一個連結，就會退回藍色資訊框。表情符號 🌏 是文字節點，不影響判斷。
- **何時用**：每篇雙語文章的第一行（6,439 篇）。
- **何時不用**：不要拿這個寫法做其他提示；第一行以外的位置不會套用。
- **寫法**：`> 🌏 [English version](/posts/<category>/<slug>-en)`（英文版寫 `> 🌏 [中文版](…)`）。
- **CSS**：Layout:591–619。

### 4.11 水平線

- **長相**：上框 2px 虛線 `--border`、上下 2.5rem（Layout:637–641）。daily 分類把它壓成 0 高（Post:844–848）。
- **何時用**：主題明顯轉換、但不值得一個 h2 時。
- **何時不用**：不要放在 h2 前面（文章頁的 h2 已經自帶分隔線，會變成兩條線）。
- **寫法**：獨立一行 `---`（frontmatter 的 `---` 不算）。
- **CSS**：Layout:636–641。

### 4.12 diagram（```diagram）

- **長相**：`<figure class="dg dg--{s|m|l}">`，紙面 `--bg-card`、1px `--border`、圓角 0.75rem、內距 `1rem 1rem .75rem`、上下 1.5rem（diagram.css:3–23）。上方標題 0.95rem／700（25），下方圖說 0.8rem `--text-muted`（26）。SVG 包在可聚焦的 `.dg__scroll` 內，寬圖在框內橫向捲動（27–28）。所有顏色來自 `dg-*` 類別（diagram.css:37–162），淺深色自動切換。
- **尺寸分級**：由 SVG `viewBox` 寬度自動決定，**作者不用指定**（remarkDiagram.ts:76）：

  | 等級 | viewBox 寬 | 最大顯示寬 | 最小顯示寬（之下改捲動） | 出處 |
  |---|---|---|---|---|
  | `s` | ≤ 440 | `min(560px, 原寬)` | 無 | diagram.css:33 |
  | `m` | 441–640 | `min(720px, 原寬)` | `min(480px, 原寬)` | diagram.css:34 |
  | `l` | 641–800 | `min(840px, 原寬)` | `min(600px, 原寬)` | diagram.css:35 |

  「原寬」是外掛寫在 figure 上的 `--dg-w`（remarkDiagram.ts:93）。**最大規則：圖最多 1:1 顯示，不會放大**。2026-11-19 之前一張 340 寬的圖會被拉到 560px，15px 的字變成約 25px（diagram.css:30–32 註解）。`max-height: 85vh`（29）。
- **限制**（建置時報錯）：`viewBox` 寬 200–800、高 80–1600（remarkDiagram.ts:56）；必填 `title`、`desc`（50–51）；不得有 `<script>`、`style`、`font-family`、字面色、外部參照（22–33）。
- **字級**（viewBox 單位）：`dg-label` 15px／600、`dg-sub` 12.5px、`dg-small` 11.5px、`dg-heading` 17px、`dg-big` 26px（diagram.css:76–81）。
- **分步播放**：header 寫 `step:` 行、SVG 元素加 `data-step`，就會出現上一步／播放／下一步控制列（remarkDiagram.ts:96–97；樣式共用 flowDiagram.css:42–45）。
- **何時用**：架構、流程、比較、資料圖，任何需要「看形狀」才懂的東西（440 篇使用）。
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
- **CSS**：`src/styles/diagram.css`（全檔）；外掛 `src/plugins/remarkDiagram.ts`。

### 4.13 flow-diagram（```flow-diagram）

- **長相**：外框與 diagram 相同（flowDiagram.css:2）。節點底 `--bg-subtle`、框 `--text-muted`（10）；accent 節點底 `--brand-50`、框 `--brand-500`（14）；連線是 1.6px 虛線（20）。播放時目前步驟轉 `--brand-500`，其他步驟淡出（27–36）。
- **尺寸**：`max-width: min(680px, 原寬)`、`min-width: min(500px, 原寬)`，原寬＝`--flow-w`（flowDiagram.css:8；remarkFlowDiagram.ts:204）。同樣最多 1:1。
- **何時用**：有先後順序、需要逐步播放的請求流程（18 篇）。節點與連線由 JSON 描述，版面由外掛計算。
- **何時不用**：靜態圖或需要自由排版時，用 ```diagram。
- **寫法**：fence 內是 JSON，必填 `title`、`lang`、`width`／`height`（100–2000）、`nodes`、`edges`、`steps`（remarkFlowDiagram.ts:50–60）。
- **CSS**：`src/styles/flowDiagram.css`；外掛 `src/plugins/remarkFlowDiagram.ts`。

### 4.14 Mermaid（```mermaid）

- **長相**：瀏覽器端把 `pre[data-language="mermaid"]` 換成 `.mermaid-diagram` 再渲染（Post:986 起）。框：上下 1.5rem、內距 1rem、1px `--border`、圓角 8px、底 `--bg-subtle`、置中（Post:1491–1499）。≤640px 時 SVG 保持原寬、框內捲動（1499–1502）。顏色由 `themeVariables` 手寫 hex（Post:997–1037），不是 token。
- **何時用**：既有文章（365 篇）。
- **何時不用**：新圖優先用 ```diagram：Mermaid 在瀏覽器端渲染、要載入 mermaid 套件，顏色也不跟 token 走。
- **寫法**：` ```mermaid `。
- **CSS**：Post:1490–1504。

### 4.15 圖片、figure、圖說

- **長相**：`img` 最大寬 100%、圓角 8px、上下 1rem、block（Layout:644）；自動加 `loading="lazy" decoding="async"`（astro.config.mjs:40–56）。`figure` 上下 1.5rem（637）；`figcaption` 0.8rem、`--text-muted`、置中（638）。
- **何時用**：截圖、照片。目前只有 12 篇用 Markdown 圖片、4 篇用 `<figure>`。
- **何時不用**：示意圖不要用點陣圖，改用 ```diagram（跟主題切換、可縮放）。
- **寫法**：`![替代文字](路徑)`；需要圖說時寫 `<figure><img …><figcaption>…</figcaption></figure>`。
- **CSS**：Layout:643–646。

### 4.16 數學（KaTeX）

- **長相**：KaTeX 預設樣式（Layout:14 載入 `katex.min.css`）；獨立公式 `.katex-display` 在自己的區塊內橫向捲動、上下內距 0.25rem（Layout:542）。
- **何時用**：frontmatter 設 `math: true` 的文章（126 篇）。
- **何時不用**：沒設 `math: true` 時 `$` 只是一般字元。全站不開數學解析，是因為上千篇文章用 `$5 … $20` 寫價格（remarkMathOptIn.ts:19–23）。
- **寫法**：frontmatter `math: true`，行內 `$…$`、獨立 `$$…$$`。交稿前要看實際渲染頁面。
- **CSS**：Layout:541–542；外掛 `src/plugins/remarkMathOptIn.ts`＋`rehype-katex`（astro.config.mjs:446–447）。

### 4.17 details／summary

- **長相**：**本文內沒有任何樣式**，是瀏覽器預設的三角形展開。（TOC 與 FAQ 的 `details` 有各自樣式，但只套在 `.toc`、`.faq-item`。）
- **何時用**：習題答案（`<details><summary>答案</summary>`，431 篇；英文版 `Answer`）、選讀的推導、補充數字。共 609 篇使用。
- **何時不用**：不要把正文主線藏進去。
- **寫法**：`<details><summary>答案</summary>` 空一行後寫 Markdown，再空一行 `</details>`。
- **CSS**：無（見 §5）。

### 4.18 註腳

- **現況**：0 篇使用、沒有任何 CSS。要用之前先在 `/styleguide/` 確認渲染結果；目前的慣例是把來源寫成行內連結或文末參考資料。

### 4.19 TL;DR 方塊（frontmatter）

- **長相**：不是本文元件，由 frontmatter `tldr` 產生，位置在麵包屑下方、本文之前（Post:211–216）。底 `--bg-subtle`、1px `--border`、圓角 6px、內距 `0.75rem 1rem`、0.88rem、行高 1.6；上方「TL;DR」標籤 0.68rem 大寫 700 `--text-muted`（Post:571–589）。
- **何時用**：一兩句話講完全文結論。`description` 不會顯示在頁面上，只進 `<meta>`（Layout:79、81）；沒有 `description` 時 meta 改用 `tldr`（Post:91、155）。
- **何時不用**：不要在本文開頭再手寫一個 TL;DR 段落（daily 分類例外，見 §4.24）。
- **CSS**：Post:570–589。

### 4.20 FAQ（frontmatter）

- **長相**：frontmatter `faq` 產生本文之後的問答區（Post:331–341）：上框 1px、每題 1px `--border` 框、圓角 8px；問題 600／0.95rem，答案 0.92rem `--text-secondary`（Post:702–707）。
- **CSS**：Post:702–707。

### 4.21 YouTube 嵌入（```youtube）

- **長相**：`<figure class="video-embed">` 內 16:9 框，1px `--border`、圓角 8px、底 `--bg-subtle`（Post:1510–1527）；圖說 0.875rem `--text-muted`（1581–1585）。寬螢幕（≥1200px）點時間連結會進入分割檢視（1526–1557）。
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
- **CSS**：Post:1507–1588；外掛 `src/plugins/remarkYoutubeEmbed.ts`。

### 4.22 video-gallery（```video-gallery）

- **長相**：一個播放器加一排可橫向捲動的縮圖；外框 1px `--border`、圓角 0.75rem、底 `--bg-card`、上下 1.75rem（videoGallery.css:1）。
- **何時用**：岩場文章的路線影片（102 篇）。影片清單寫在 `src/data/climbing-videos.ts`。
- **寫法**：fence 內 `key:` 與 `lang:`（remarkVideoGallery.ts:6–14）。
- **CSS**：`src/styles/videoGallery.css`。

### 4.23 video-practice（```video-practice）

- **長相**：英文口說練習卡，外框 1px `--border`、圓角 0.75rem、底 `--bg-card`、上下 1.5rem（videoPractice.css:1）。內含播放器、雙語字幕清單、片語 `details`。
- **何時用**：英文口說文章（4 篇）。
- **CSS**：`src/styles/videoPractice.css`；外掛 `src/plugins/remarkVideoPractice.ts`。

### 4.24 其他

- **slide-reader**（32 篇，課程筆記的投影片閱讀器）：文章裡寫 `<div class="slide-reader" data-slide-reader data-pdf-src="…">`，由 `src/lib/slideReader.ts` 接手。框 1px `--border`、圓角 8px、底 `--bg-subtle`（slideReader.css:1）。樣式檔是單行壓縮格式，fallback 色與 token 不同（見 §5）。
- **術語標記**（`.glossary-term`，由 script 標在本文上）：點狀底線 `--brand-500`、底色 `--brand-100` 55%（Post:727–741），文章頁再覆寫成 `--border` 底線、`--bg-subtle` 底（Post:487–490）。彈窗樣式 Post:1377–1470。
- **daily 分類專用**：`article[data-category="daily"]` 會把特定 h3（`tldr`、`read-priority`、`reviewer`、`take-away`）變成彩色小標籤，下一段變成卡片（Post:850–951）；內文改成 0.95rem、行高 2（Post:781–784）。標籤底色是寫死的 `#065f46`、`#312e81`、`#4b5563`（Post:855、881、909）。`daily-brief` 版型排除在這些覆寫之外。

---

## 5. 已知不一致與待辦

依影響排序。這一節只記錄，不在本文件範圍內修。

### P1：會讓下一個修改者做錯

1. **文章頁有第二個 token 來源。** `article { --text-secondary: #555; --brand-700: #374151 }`（Post:444–451）在 tokens.css 之外改了兩個 token。後果：語言切換膠囊的字與連結（Layout:611、614）、行內程式碼（Layout:575）、tag（Layout:480）在文章頁都是灰色而不是綠色，只看 Layout 的人會誤判。`scripts/check-chat-style.mjs` 的規則 1 只檢查 `--brand-900:`，抓不到這種重定義。
2. **連結有三套顏色。** Layout 定義綠色連結（Layout:538），文章頁改成深色字（Post:453–462），系列導覽與 TOC 的 hover 又寫死藍色 `#1d4ed8`（Post:482、485），不在 token 裡，也跟品牌色無關。
3. **引言框預設是藍色，且只有一種。** 所有 blockquote 都是 `--info-*` 藍框（Layout:579–587），跟森林綠品牌色衝突；`> **注意：**` 這類警告內容（11 篇）也是藍框，`--warning-*` token 存在卻沒有對應的文章元件；success 變體（Layout:622–626）Markdown 產生不出來，是死碼。
4. **Mermaid 顏色手抄 hex。** `lightThemeVariables`／`darkThemeVariables`（Post:997–1037）把 token 值手抄一份，註解還指向舊位置「PostLayout.astro」（Post:995–996）；已經漂移：深色 `lineColor: '#6b7280'`（Post:1030）≠ `--text-muted` `#8b929e`（tokens.css:77）。
5. **h2 色條定義了又關掉。** Layout:502–511 畫 `--heading-accent` 色條，文章頁 Post:464–466 隱藏、改用分隔線。改 Layout 的 h2 樣式在文章頁看不到效果。

### P2：違反「顏色只從 token 來」

6. **寫死的顏色**（`#hex` 或 `rgb()/rgba()` 出現的行數，只算 CSS 區塊）：

   | 檔案 | 行數 | 例子 |
   |---|---|---|
   | `src/styles/chat.css` | 34 | — |
   | Post 的 `<style>` 區塊 | 23 | hero 漸層（495、508）、daily 標籤（855、881、892、909、935）、連結 hover `#1d4ed8`（482、485） |
   | `src/styles/slideReader.css` | 22 | `var(--brand-500,#176d4b)` 等 fallback 跟 token 值不同（26、27、64） |
   | Layout | 13 | 徽章白字（411）、類型徽章（445–448）、`mark`（535）、程式碼字色與標題列（548、559、564）；其餘在 About 頁（1360、1395、1404、1440） |
   | `src/styles/videoGallery.css` | 5 | 播放器黑底（3） |
   | `src/styles/diagram.css` | 4 | 深色 warn `#f97066`（24）、系列色（114–115）、`dg-text--on-heat`（162） |
   | `src/styles/videoPractice.css` | 1 | 播放器黑底（8） |

   另外 Post 的 script 裡 Mermaid 主題有 40 個以上的 hex（見第 4 點）。
7. **類型徽章色不是 token。** `.type-debug` 等四個（Layout:445–448）寫死色，而分類色有 token（tokens.css:47–64）。
8. **`mark` 不跟深色模式。** `#fef08a` 底＋`#1a1a1a` 字（Layout:535），深色頁面上是一塊亮黃。
9. **分類色沒有深色值。** `--cat-tech #1a1a1a`、`--cat-film #292524` 在深色底 `#0f1419` 上幾乎看不出徽章邊界。

### P3：未 token 化造成的漂移

10. **卡片類容器有三種圓角。** TL;DR 6px（Post:575）、程式碼／表格／引言框 8px（Layout:550、700、582）、diagram／影片 0.75rem＝12px（diagram.css:21、videoGallery.css:1）。圓角總共 2／3／4／6／8px、0.4／0.5／0.75rem、999px、50% 十種。
11. **字級單位混用。** rem（多數）、em（行內程式碼 Layout:575、slideReader.css）、px（slideReader.css:70 的 `font-size:13px`、diagram 的 viewBox 單位）。字級有 14 階（§3.1），0.8／0.82／0.85／0.88／0.9 這幾階差距小到看不出來。
12. **間距零星值。** 表頭 `0.7rem` vs 儲存格 `0.65rem`（Layout:717、722）；video-gallery 上下 1.75rem（videoGallery.css:1），其他嵌入元件都是 1.5rem。
13. **daily 分類分叉一套字級。** daily 的 h3 是 1.1rem（Post:791），大於一般 h3 的 1.05rem；內文 0.95rem、行高 2（Post:782–783）。
14. **本文 `details` 沒有樣式**，609 篇使用卻是瀏覽器預設外觀，跟其他有框的元件不一致。
15. **沒用到的 token**：`--info-icon`、`--success-icon` 用量 0；`--success-bg`／`--success-border` 只用在死碼（第 3 點）。
16. **2026-03 規格與實作脫節**：`docs/superpowers/specs/2026-03-12-blog-redesign-design.md` 的 token 表（第 46–69 行）是舊值；已在該文件開頭加註，以本文件為準。

---

## 6. 怎麼改設計

1. **先找到元件在這份文件的哪一節**，照「CSS」欄的行號去改；Markdown 內文通用的樣式在 Layout 的 `.content` 區段（Layout:485–731），外掛產生的元件各有自己的 CSS 檔（`src/styles/diagram.css`、`flowDiagram.css`、`videoGallery.css`、`videoPractice.css`、`slideReader.css`，由 Layout:7–14 載入），只在文章頁出現的在 Post 的 `<style>`。
2. **改顏色只改 `src/styles/tokens.css`。** 淺色在 `:root`、深色在 `[data-theme="dark"]`，兩邊一起改。不要在別處另起 `:root` 或在元件裡重定義 token；`scripts/check-chat-style.mjs` 規則 1 會擋下 tokens.css 與 admin-tokens.css 以外的 `--brand-900:` 定義（但只檢查這一個名稱，見 §5 第 1 點）。
3. **新增元件**：先確認既有元件真的不夠用。顏色用 token、間距與圓角從 §3 的階梯挑；寬度遵守原則 5（放不下就給自己的捲動容器）；在 390px 與 1280px、淺色與深色四種組合都看過。
4. **看 `/styleguide/`。** 這個頁面把本文件列的每個元件都渲染一次，改完 CSS 直接在這裡比對，不用翻文章找範例。
5. **跑 `pnpm verify`。** 它包含 `check:chat-style`、`check:diagram-text` 等檢查；紅燈就修真正的問題，不弱化檢查。
6. **版面測試會擋。** `tests/visual/styleguide.spec.ts` 在 CI 的 `pnpm test:visual` 裡跑，對 `/styleguide/` 檢查：頁面沒有橫向溢出、文字對比足夠、語言切換膠囊精簡且與內文對齊、窄表格不溢出、圖表顯示寬度不超過 viewBox。這些就是 §1 原則 3–6 的自動化版本；新增元件時把它加進 `/styleguide/`，測試才會涵蓋到。依專案規則，本機跑測試前要先取得同意，否則以 CI 結果為準。
7. **回頭更新這份文件。** 改了值或行號就同步更新對應的段落；新增元件就在 §4 補一節（長相、何時用、何時不用、寫法、CSS 位置）；修掉 §5 的項目就把它刪掉。
