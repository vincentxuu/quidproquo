# quidproquo 設計系統

> 這份文件描述**目前已實作**的前台設計：token、字級／間距／圓角的級距、每個文章元件長什麼樣、什麼時候用。
> 程式碼才是正本；本文件的每個數值都附 `檔案:行號`，兩者不一致時以程式碼為準，並回頭修正本文件。
> 2026-03 的規格 `docs/superpowers/specs/2026-03-12-blog-redesign-design.md` 已經跟實作脫節，只當歷史參考。
>
> 範圍：全站。token（§2、§3）前台、後台、Chat 共用同一份 `src/styles/tokens.css`；§4 的元件規格目前只寫到文章頁（`src/layouts/PostLayout.astro`＋`src/pages/posts/[...slug].astro`），後台與通用元件見 §7。
>
> 這份文件會原樣渲染在站上的設計規範頁 [`/design/`](/design/)，同頁還有從 tokens.css 自動產生的 token 表、每個元件的實際範例，以及掃描 `src/components` 產生的元件清單。
>
> 行號以 2026-11-19 的工作目錄為準（§5 第二輪修正之後、尚未 commit）。

本文件常用的兩個檔案簡稱：

- **Layout**＝`src/layouts/PostLayout.astro`（全站共用版面；`<style is:global>` 在 162–1538 行，文章內文規則在 485–753 行，755 行以後是 About 頁）
- **Post**＝`src/pages/posts/[...slug].astro`（文章頁；scoped `<style>` 在 444–895 行，script 從 897 行起，global 樣式在 1275–1406、1408–1490 行）

---

## 1. 原則

1. **Editorial：靠字重與留白撐結構，不靠色塊。** 標題用 900／800／700 三級字重（Layout:491、494、506），段落之間靠 `margin` 分開；h2 用一條 1px 分隔線切段（Layout:492–505），不用色塊或卡片包段落。
2. **單一強調色＋中性灰。** 強調色是墨綠 `#1D6B4C`（深色模式 `#5FCB9A`），＝`--brand-700`／`--brand-500`；其餘一律中性灰（tokens.css:15–26）。強調色**只**用在這幾處（tokens.css:15–16 註解）：
   - 內文連結（§4.3）
   - logo（Layout:257）
   - 淺色模式的文章 hero（Post:452）
   - 目前／啟用狀態：hover、啟用中的篩選鈕、TOC／系列導覽／tag 的 hover、播放中的步驟（§4.13）
   - 主要按鈕
   - 小標記：提示框左框、清單與 details 標記、checkbox、focus 外框、閱讀進度條

   標題、分類與類型徽章、tag、TOC、系列導覽、行內程式碼、語言切換膠囊、Chat 使用者氣泡都是中性灰，平時不帶強調色；需要區分的東西靠文字，不靠顏色。黃（warning）與綠（tip）只表達提示種類；紅、黃、綠圓點只在狀態圖例裡保留色相（§4.24）。
3. **可讀優先。** 本文欄寬上限 760px（Post:602–604，註解：約 44 個全形字一行），行高 1.8（Layout:488）。文字色都要對底色 ≥ 4.5:1（tokens.css:18、26、151 的註解）。
4. **行動優先。** 所有元件要先在 390px 寬成立。頁面左右留白隨寬度遞減：1.5rem → 1rem（≤640px）→ 0.75rem（≤400px）（Layout:212、678、703）。
5. **元素不能比容器寬；放不下就給它自己的捲動容器。** 表格包在 `.table-scroll`（Layout:724–730）、長公式在 `.katex-display` 內捲動（Layout:539）、程式碼在 `pre code` 內捲動（Layout:566）、圖表在 `.dg__scroll`／`.flow-diagram__scroll` 內捲動（diagram.css:26、flowDiagram.css:4）。`html { overflow-x: hidden }`（Layout:206–208）只是最後一道保險，不是解法：被它切掉的內容讀者看不到。
6. **圖不放大超過設計尺寸。** 圖寬上限是 `min(分級上限, viewBox 寬)`，最多 1:1 顯示；空間不夠時先縮小到下限，再改成框內捲動（diagram.css:29–34、flowDiagram.css:7–8）。
7. **顏色、字級、間距、圓角都從 token 來。** 元件 CSS 用 `var(--token)`；token 只能在 tokens.css 宣告，別處重宣告會讓 `pnpm verify` 失敗（scripts/check-chat-style.mjs:31–35、77–84）。圖表 SVG 禁止寫字面色，建置時直接報錯（`src/plugins/remarkDiagram.ts:32`）。
8. **淺色、深色都要成立。** 有深色值的 token 寫在 `[data-theme="dark"]`（tokens.css:140–186）；刻意兩種主題共用的（媒體疊層、陰影、`--text-on-accent`、程式碼區塊等）在 tokens.css:46、73、179 註明。深色模式由 `[data-theme="dark"]` 切換（Layout:102–109）。
9. **元件由 Markdown 語法決定，不在文章裡寫樣式。** 文章裡沒有任何 `style="`；圖表 fence 也禁止 `style` 屬性與 `<style>`（remarkDiagram.ts:28–29）。需要新樣式就新增元件，不在文章裡臨時拼。
10. **介面與渲染後的文章不出現 emoji，一律用 koboyo 圖示。** 介面元件用 `Icons.astro`；文章原始 Markdown 不放 emoji（`pnpm check:no-emoji` 擋 commit），要圖示就寫 shortcode（`:globe:`、`:warning:`）或文字記號（✓ ✗ ★），由 `rehypeNoEmoji` 在建置時換成同一套 koboyo SVG（§4.24）。frontmatter 文字（標題、描述、TL;DR）用 `stripEmojiText` 轉成單色文字符號（src/plugins/rehypeNoEmoji.ts:515–533）。新增介面需要圖示時從 `src/components/icons/koboyo.ts` 挑，缺的就補一個 koboyo 圖示，不要貼 emoji。

---

## 2. Token

唯一來源：`src/styles/tokens.css`。由 Layout:7 與 `src/pages/chat.astro` 載入。tokens.css 宣告過的名稱不得在其他 `.astro`／`.css` 再宣告（`admin-tokens.css` 除外），由 `check:chat-style` 規則 1 擋下（scripts/check-chat-style.mjs:31–35）。

### 2.1 強調色（`--brand-*`）

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--brand-900` | `#0f3a29` | `#cdebdd` | 強調色最深／對深底最亮的一階：深色模式連結 hover 字、淺色 hero 漸層中段 | tokens.css:17／142 |
| `--brand-700` | `#1d6b4c` | `#5fcb9a` | **強調色本體**：內文連結字、logo、導覽 hover、TOC／系列／tag hover 字、淺色 hero 漸層兩端。對白底、`--bg-subtle`、`--brand-50/100` ≥ 4.5:1（tokens.css:18） | 18／143 |
| `--brand-500` | `#1d6b4c` | `#5fcb9a` | 與 `--brand-700` 同值；習慣用在框線、底線、標記：focus 外框、進度條、hover 邊框、提示框左框、details 標記、checkbox、圖表 accent | 19／144 |
| `--brand-300` | `#93c9b0` | `#2b5a45` | 淺色模式連結底線 | 20／145 |
| `--brand-100` | `#d9ede3` | `#14291f` | 強調色淡底：tag hover 底、術語標記 hover 底（Post:693）、`--mark-bg`、Mermaid 主色 | 21／146 |
| `--brand-50`  | `#eff7f3` | `#0f1e17` | 最淡底：目前／啟用狀態的底，例如 video-gallery 播放中的縮圖、video-practice 選中的句子與模式鈕（videoGallery.css:13、videoPractice.css:28、64）；flow-diagram accent 節點 | 22／147 |

深色模式的階層方向反過來：900＝對深底對比最強、50＝最深的淡底（tokens.css:141）。整組在兩種主題都是綠色系。

### 2.2 文字

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--text-primary` | `#1a1918` | `#e8e6e3` | 內文、**所有標題**、表格、提示框文字、行內程式碼 | tokens.css:24／149 |
| `--text-secondary` | `#67635d` | `#a09c96` | 中性灰的次要字：導覽連結、h5/h6、TOC、系列導覽、tag、語言切換膠囊。不再是品牌色（tokens.css:25） | 25／150 |
| `--text-muted` | `#67635d` | `#a09c96` | 圖說、footer、meta、回到頂端按鈕；目前與 `--text-secondary` 同值。對白底、`--bg-subtle`、`--bg-card`、`--brand-50/100` ≥ 4.5:1 | 26／151 |
| `--text-on-accent` | `#ffffff` | （同淺色） | 飽和色底上的字：分類徽章、hero、daily 標籤、程式碼複製鈕 | 74 |

### 2.3 背景與邊框

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--bg-page` | `#ffffff` | `#121212` | 頁面底色 | tokens.css:27／152 |
| `--bg-subtle` | `#f6f5f3` | `#1a1a1a` | 次層底：表頭、TL;DR、TOC、tag、行內程式碼、note 提示框、語言切換膠囊 | 28／153 |
| `--bg-card` | `#ffffff` | `#1e1e1e` | 卡片、details、圖表的紙面；深色 hero 漸層兩端 | 29／154 |
| `--bg-code` | `#1e1e2e` | `#0d1117` | 程式碼區塊底（實際被 Shiki 蓋掉，見 §4.5） | 30／155 |
| `--border` | `#e6e3de` | `#2e2e2e` | 所有 1px 邊框、h2 分隔線、表格格線、tag／膠囊外框、行內程式碼的內框線 | 23／148 |
| `--border-strong` | `#cfcbc4` | `#3d3d3d` | 表單控制項外框（shadcn `input`）、需要比一般分隔線更明顯的框 | tokens.css |
| `--bg-muted` | `#efedea` | `#262626` | 互動元件 hover／選取列的中性底（shadcn `accent`、後台導覽 hover）。強調色淡底 `--brand-50` 只留給「目前／啟用」狀態 | tokens.css |
| `--focus-ring` | 強調色 28% 外光暈 | （由 `--brand-500` 衍生，自動跟主題） | 表單與按鈕的 focus `box-shadow` | tokens.css |
| `--heading-accent` | `#1d6b4c` | `#5fcb9a` | 與強調色同值（tokens.css:31）；**目前沒有任何 `var(--heading-accent)`**（回到頂端按鈕已改 `--text-muted`），見 §5.2 | 31／156 |

### 2.4 狀態色（提示框）

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--info-bg` | `#f6f5f3` | `#1a1a1a` | 中性，不再是藍（tokens.css:32）；Mermaid 次要色 | tokens.css:32／157 |
| `--info-border` | `#8a857e` | `#77726b` | 圖表 `link` 色（diagram.css:12）、Mermaid 次要框；中性灰 | 33／158 |
| `--success-bg` | `#eefbf3` | `#112419` | tip 提示框底 | 34／159 |
| `--success-border` | `#22c55e` | `#22c55e` | tip 提示框左框、綠色狀態圓點（§4.24） | 35／160 |
| `--warning-bg` | `#fffbeb` | `#1a1a0f` | warning 提示框底、Mermaid 第三色與 note | 36／161 |
| `--warning-border` | `#f59e0b` | `#f59e0b` | warning 提示框左框、黃／橘狀態圓點 | 37／162 |
| `--danger` | `#b42318` | `#f87171` | 錯誤；`--diagram-warn` 的淺色值、flow-diagram warn、紅色狀態圓點 | 38／163 |
| `--success` | `#067647` | `#4ade80` | 成功狀態的字色：後台狀態徽章、表單成功訊息、toast | tokens.css |
| `--warning` | `#b54708` | `#fbbf24` | 警告／進行中狀態的字色 | tokens.css |
| `--danger-bg` | `#fef3f2` | `#2a1615` | 錯誤狀態的淡底：錯誤徽章、錯誤訊息框 | tokens.css |

狀態字色對同色淡底與 `--bg-card` 都 ≥ 4.5:1。狀態色只表達狀態；info 一律中性（`--info-*`＋`--text-secondary`），不用藍。

### 2.5 徽章與螢光標記

| Token | 淺色 | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--cat-neutral` | `#57534e` | `#3a3835` | **所有分類徽章的底色**；`--cat-tech`…`--cat-weather` 18 個名稱都指向它（tokens.css:53–70）。分類靠徽章上的文字區分，不靠顏色；白字 ≥ 4.5:1 | 52／169 |
| `--type-debug`／`-deep-dive`／`-guide`／`-project` | `#67635d` | `#a09c96` | 類型徽章字色與同色框（Layout:445–448），四個同值，類型靠文字區分 | 76–79／171–174 |
| `--mark-bg` | `#d9ede3`（＝`--brand-100`） | `#14291f` | `<mark>` 底：強調色淡底 | 81／175 |
| `--mark-text` | `#1a1918`（＝`--text-primary`） | `#e8e6e3` | `<mark>` 字 | 82／176 |

保留 18 個 `--cat-*` 名稱是為了不動 `.cat-*` 類別（Layout:414–431）；新增分類時加一個指向 `--cat-neutral` 的名稱即可。

### 2.6 陰影、遮罩、光澤

| Token | 值（淺色） | 深色 | 用途 | 行號 |
|---|---|---|---|---|
| `--shadow-card-hover` | `0 2px 12px rgba(0,0,0,0.08)` | `… 0.25` | 卡片 hover | tokens.css:40／165 |
| `--shadow-floating` | `0 2px 12px rgba(0,0,0,0.15)` | `… 0.4` | 浮動元素：回到頂端、術語彈窗、影片返回鈕 | 41／166 |
| `--shadow-card-soft` | `0 10px 24px rgba(26,46,26,0.05)` | 同 | About 頁手機版專案卡 | 42 |
| `--shadow-hairline` | `0 1px 3px rgba(0,0,0,0.06)` | 同 | Chat 問題建議按鈕 | 115 |
| `--shadow-raised` | `0 6px 20px rgba(0,0,0,0.12)` | 同 | Chat 側欄觸發鈕 hover | 116 |
| `--shadow-panel` | `-6px 0 32px rgba(0,0,0,0.10)` | 同 | Chat 右側滑出面板 | 117 |
| `--shadow-control` | `0 1px 4px rgb(0 0 0 / .15)` | 同 | 影片輪播左右鈕 | 118 |
| `--shadow-modal` | `0 16px 60px rgb(0 0 0 / .18)` | 同 | 投影片對照面板 | 119 |
| `--scrim` | `rgb(0 0 0 / .6)` | 同 | `dialog::backdrop` 遮罩 | 120 |
| `--shine` | `rgba(255,255,255,0.55)` | `… 0.08` | Chat 載入光澤 | 39／164 |

陰影不用 `--shadow-sm/md/lg/xl` 這類名稱，因為那是 Tailwind `@theme` 的命名空間，會被 chat.css 的 theme 輸出蓋掉（tokens.css:114）。

### 2.7 媒體、投影片、程式碼區塊

兩種主題共用（tokens.css:46、121、128、179）：

| Token | 值 | 用途 | 行號 |
|---|---|---|---|
| `--bg-video` | `#000` | 播放器載入前的底色（YouTube、video-practice、video-gallery） | tokens.css:122 |
| `--on-video` | `#fff` | 疊在畫面上的字 | 123 |
| `--video-badge-bg` | `rgb(0 0 0 / .78)` | 片長膠囊 | 124 |
| `--video-scrim` | `rgb(0 0 0 / .18)` | 外部連結縮圖的變暗層 | 125 |
| `--video-scrim-soft` | `rgb(0 0 0 / .15)` | 路線影片播放鈕疊層 | 126 |
| `--video-text-shadow` | `0 1px 4px #000` | 畫面上的白字陰影 | 127 |
| `--slide-backdrop` | `#e5e7eb` | PDF 檢視器載入前的底色 | 129 |
| `--code-dot-red`／`-yellow`／`-green` | `#ff5f57`／`#febc2e`／`#28c840` | 程式碼標題列三顆圓點（Layout:557–559） | 43–45 |
| `--code-text` | `#d4d4d4` | 程式碼區塊字色（Layout:545）；**有語法上色的區塊會被 Shiki 的 inline style 蓋掉**，見 §4.5 | 47 |
| `--code-bar` | `rgba(0,0,0,0.15)` | 標題列的加深層（Layout:556） | 48 |
| `--code-bar-divider` | `rgba(255,255,255,0.05)` | 標題列與程式碼之間的分隔線（Layout:561） | 49 |

### 2.8 圖表

tokens.css 提供圖表的原始色，`diagram.css` 再衍生成作者用的 `--dg-*`（diagram.css:3–17、113）。圖表作者只用 `dg-*` 類別，不直接碰站上 token。

| Token | 淺色 | 深色 | 衍生為 | 行號 |
|---|---|---|---|---|
| `--diagram-warn` | `var(--danger)` | `#f97066` | `--dg-warn`、`--dg-warn-tint` | tokens.css:131／180 |
| `--diagram-s1`…`s5` | `#5e7a9b` `#b8915a` `#9c6b50` `#6e6479` `#7c8f6f` | `#82a0c0` `#d3ad7a` `#b88670` `#8d8298` `#9caf8f` | `--dg-s1`…`s5`（資料圖系列色，刻意低飽和，accent 留給焦點系列） | 132–136／181–185 |
| `--diagram-on-heat` | `#10261a` | 同 | `dg-text--on-heat` 字色（dg-heat-4/5 上 ≥ 4.2:1） | 137 |

其餘 `--dg-*` 直接由站上 token 衍生：`--dg-ink`／`--dg-muted`＝`--text-primary`／`--text-muted`，`--dg-paper`／`--dg-paper-2`＝`--bg-card`／`--bg-subtle`，`--dg-rule`＝`--border`，`--dg-accent`、`--dg-active`＝`--brand-500`，`--dg-link`＝`--info-border`（現在是中性灰）；`--dg-warn` 與 `--dg-warn-tint` 都由 `--diagram-warn` 衍生（diagram.css:4–16）。

### 2.9 字級、間距、圓角

見 §3。

---

## 3. 字級、間距、圓角

這三類現在是 token（tokens.css:84–111）。文章內文（Layout:487–759）全部改用；文章頁、外掛元件的 CSS 檔（diagram、flow-diagram、video-gallery、video-practice、slide-reader）、導覽列與 About 頁在**值剛好對上級距**的地方也已改用，對不上的值刻意保留字面值（不為了套 token 而改變外觀），清單見 §5.2。新增元件一律用 token，不要再寫字面值。

`html`／`body` 沒有設定 `font-size`，所以 `1rem` = 瀏覽器預設 16px。

### 3.1 字級 token

| Token | 值 | 用途 | 行號 |
|---|---|---|---|
| `--fs-2xs` | 0.65rem | 分類／類型徽章 | tokens.css:93 |
| `--fs-xs` | 0.75rem | 圖說、tag、篩選鈕、RSS 連結 | 94 |
| `--fs-sm` | 0.875rem | 表格、程式碼區塊、footer、語言切換膠囊、h5/h6 | 95 |
| `--fs-md` | 1rem | 1rem 的元件字級（外掛 CSS、About 頁） | 96 |
| `--fs-h4` | 1rem | 內文 h4 | 97 |
| `--fs-h3` | 1.05rem | 內文 h3 | 98 |
| `--fs-h2` | 1.3rem | 內文 h2 | 99 |
| `--fs-h1` | 1.7rem | 內文 h1 | 100 |

行內元素用 `em`，跟著所在段落或標題縮放（Layout:524 註解）：行內 `code` 0.9em（Layout:572）、`kbd` 0.9em（573）、標題錨點 0.85em（516）。

對不上級距、仍是字面值的字級：文章標題 hero h1 1.8rem（Post:465）、meta 與麵包屑 0.82rem（Post:477、504）、圖表標題 .95rem 與圖說 .8rem（diagram.css:24–25、flowDiagram.css:3、49）、FAQ 1.15／0.95／0.92rem（Post:658–661）、daily 論文標題 1.2rem 與 metadata 0.75rem（Post:738、744）、術語彈窗 0.86rem 等（Post:1290）、影片返回鈕 0.85rem（Post:1473）。YouTube 圖說 0.875rem（Post:1489）與 `--fs-sm` 同值但沒有改用 token。

字型堆疊：`'Latin Quotes', 'Noto Sans TC Local', 'PingFang TC', 'Microsoft JhengHei', system-ui, -apple-system, sans-serif`（Layout:211）。`Latin Quotes` 只負責 U+2018–2019、U+201C–201D 四個彎引號（Layout:172–176），避免中文字型把英文縮寫的撇號畫成全形。

### 3.2 間距 token（4px 基準）

| Token | 值 | Token | 值 |
|---|---|---|---|
| `--space-1` | 0.25rem | `--space-6` | 1.5rem |
| `--space-2` | 0.5rem | `--space-8` | 2rem |
| `--space-3` | 0.75rem | `--space-10` | 2.5rem |
| `--space-4` | 1rem | `--space-12` | 3rem |
| `--space-5` | 1.25rem | | |

（tokens.css:103–111）

文章元素的垂直間距：

| 元素 | 值 | 出處 |
|---|---|---|
| 段落 | 下 `--space-4` | Layout:525 |
| h2 | 上 `--space-12`＋上內距 `--space-6`＋1px 分隔線，下 `--space-3`；第一個 h2 歸零 | Layout:495–498、505 |
| h3 | 上 `--space-6`、下 `--space-2` | Layout:506 |
| h4 | 上 `--space-5`、下 `--space-2` | Layout:507 |
| 清單 | 下 `--space-4`；`li` 下 `--space-2`；巢狀清單上下 `--space-1` | Layout:657–661 |
| 程式碼區塊 | 下 `--space-5` | Layout:549 |
| 引言框、details | 上下 `--space-5` | Layout:584、641 |
| 表格（`.table-scroll`） | 下 `--space-6` | Layout:729 |
| 圖片 | 上下 `--space-4` | Layout:672 |
| figure | 上下 `--space-6` | Layout:673 |
| 水平線 | 上下 `--space-10` | Layout:668 |
| 本文容器結尾 | 下 `--space-12` | Layout:488 |
| diagram／flow-diagram／video-practice／slide-reader | 上下 `--space-6` | diagram.css:18、flowDiagram.css:2、videoPractice.css:1、slideReader.css:1 |
| Mermaid／YouTube | 上下 1.5rem（字面值，與 `--space-6` 同值） | Post:1395、1414 |
| video-gallery | 上下 1.75rem（字面值，不在級距上） | videoGallery.css:1 |

### 3.3 圓角 token

| Token | 值 | 用途 | 行號 |
|---|---|---|---|
| `--corner-sm` | 3px | 徽章、行內 code、kbd、tag、篩選鈕、`mark`、術語標記、daily 標籤、複製鈕、術語彈窗按鈕 | tokens.css:87 |
| `--corner-md` | 8px | 所有卡片類容器：程式碼、表格、引言框、details、TL;DR、圖片、TOC、系列框、Mermaid、YouTube、影片播放器內框、slide-reader | 88 |
| `--corner-lg` | 12px | 大型嵌入：diagram、flow-diagram、video-gallery、video-practice 外框、投影片對照面板 | 89 |
| `--corner-pill` | 999px | 語言切換膠囊、影片返回鈕 | 90 |

名稱不用 `--radius-*`，因為那是 Tailwind `@theme` 的命名空間，chat.css／globals.css 會在 `:root` 輸出同名變數（tokens.css:84）。

### 3.4 斷點

| 寬度 | 作用 | 出處 |
|---|---|---|
| ≤400px | 左右留白 `--page-gutter` 0.75rem、導覽縮字；hero 跟著 `--page-gutter` 走，不另設斷點（Post:454–456） | Layout:702 |
| ≤480px | 上下篇導覽改單欄 | Post:644 |
| ≤520px | 術語彈窗貼齊左右 | Post:1366 |
| ≤640px | 左右留白 `--page-gutter` 1rem、Mermaid 改捲動 | Layout:677；Post:1404 |
| ≥1000px | 文章頁加寬到 1180px、TOC 側欄 | Layout:225；Post:594 |
| 1140–1519px | Ask AI 開啟時收起 TOC | Post:613 |
| ≥1200px | 影片分割檢視 | Post:1434 |

斷點不是 token（CSS 變數不能用在 media query）。

---

## 4. 文章元件

每個元件列出：長相（關鍵 CSS 與 token）、何時用、何時不用、Markdown 寫法、CSS 位置。用量是 `src/content/posts/` 內含該語法的檔案數（2026-11-19，共 7,309 篇，含中英兩版）。

除非特別註明，選擇器都在 `.content` 底下（Post:330 的 `<div class="content">` 包住整篇 Markdown 輸出）。`/styleguide/` 會把下列每個元件渲染一次。

### 4.1 標題

- **長相**：h1–h4 字色 `--text-primary`（標題不帶強調色），字級 `--fs-h1`…`--fs-h4`（Layout:491–507）。h2 上方 1px `--border` 分隔線＋`--space-6` 上內距，第一個 h2 不畫線（Layout:492–505）。h5／h6 `--fs-sm`、`--text-secondary`（508）。h2、h3 hover 時顯示錨點，`--text-muted`（511–522）。
- **何時用**：h2 切大段落（會出現在 TOC），h3 切段內小節，h4 偶爾用於小節內的條列標題（228 篇）。
- **何時不用**：不要用 `#`（h1），文章標題已經由 hero 顯示（Post:181）；不要用 h5／h6（0 篇）；不要為了「讓字變大」用標題。h2 前面不要再放 `---`，會變成兩條線。
- **寫法**：`## 標題`、`### 小節`。
- **CSS**：Layout:490–522。daily 分類只對論文標題與 h4 另有樣式（Post:737–740、866–873），其他字級、行高、段距與一般文章相同（Post:734）。

### 4.2 段落與行內樣式

- **長相**：段落下 `--space-4`（Layout:525）。`strong` 700＋`--text-primary`（526）；`del` 刪除線＋`--text-muted`（528）；`mark` 底 `--mark-bg`（＝強調色淡底 `--brand-100`）、字 `--mark-text`（＝內文色）、圓角 `--corner-sm`（529）。
- **何時用**：`**粗體**` 標出段落關鍵詞。`<mark>` 只在需要「螢光筆」語意時用（4 篇）。
- **何時不用**：不要整句加粗；不要用 `<mark>` 當裝飾。
- **寫法**：`**粗體**`、`*斜體*`、`~~刪除~~`、`<mark>…</mark>`。
- **CSS**：Layout:524–529。

### 4.3 連結

- **長相**：內文連結是強調色的主要用途：字 `--brand-700`（墨綠）、底線 `--brand-300`、位移 3px；hover 底線轉 `--brand-500`（Layout:532–533）。深色模式 `--brand-300` 底線對頁面太暗，平時就用 `--brand-500` 底線，hover 字轉 `--brand-900`（Layout:534–536）。TOC 與系列導覽**平時是中性灰** `--text-secondary`，hover 才轉 `--brand-700` 並出現 `--brand-500` 底線（Post:580、584、639–640）；VocabularyCapture 的連結跟內文連結同一套（§4.23）。外部連結（`https?://`）自動加 `target="_blank" rel="noopener noreferrer"`（astro.config.mjs:24–40）。
- **何時用**：引用來源、站內交叉連結。
- **何時不用**：不要把整句或整段做成連結；連結文字要能單獨看懂（不要寫「這裡」）。
- **寫法**：`[文字](網址)`。
- **CSS**：Layout:531–536。

### 4.4 行內程式碼與 `kbd`

- **長相**：行內 `code` 中性：底 `--bg-subtle`、1px `--border` 內框線（`box-shadow: inset`）、字 `--text-primary`、內距 `0.1em 0.35em`、`--corner-sm`、0.9em（Layout:572）。`kbd` 底 `--bg-subtle`、1px `--border`、`--corner-sm`、0.9em、monospace（573）。
- **何時用**：指令、檔名、識別字、設定值。
- **何時不用**：不要拿來強調一般詞彙（用粗體）。`kbd` 目前 0 篇使用。
- **寫法**：`` `code` ``、`<kbd>Ctrl</kbd>`。
- **CSS**：Layout:572–573。

### 4.5 程式碼區塊

- **長相**：macOS 視窗風格。CSS 寫的是底 `--bg-code`、字 `--code-text`、1px `--border`、`--corner-md`、`overflow: hidden`（Layout:542–551）；上方標題列由 `::before` 畫出：加深層 `--code-bar`、三顆 `--code-dot-*` 圓點、下緣 `--code-bar-divider`（552–562）。程式碼本體內距 `--space-4 --space-6`、`--fs-sm`、行高 1.6、**橫向捲動在 `code` 上**（563–570）。
- **實際的底色與字色來自 Shiki，不是 token**：Shiki 在 `pre.astro-code` 上寫 inline `style="background-color:#24292e;color:#e1e4e8"`（github-dark 主題），inline style 蓋過 `.content pre` 的 `background`／`color`。所以有語法上色的區塊，改 `--bg-code`／`--code-text` 不會有效果，兩種主題下都是 `#24292e` 底；**只有標題列（`::before`）真的吃 token**。這是已知問題，見 §5.2。
- **語法上色**：主題沿用 Astro 預設的 github-dark（`shikiConfig` 沒有指定 `theme`），每個 token 是 inline style 的字色。唯一的調整是 `readable-comments` transformer：把註解色 `#6A737D`（約 3:1）換成 `#8B949E`，達到 4.5:1，其他語法色不動（astro.config.mjs:435–445）。
- **複製按鈕**：由文章頁 script 加在每個非 Mermaid 的 `pre` 上（Post:994 起），字色是淡化的 `--text-on-accent`（Post:1375–1391）。
- **何時用**：任何超過一行的程式碼、指令、設定檔、純文字輸出。最常見的 fence 語言：`text`、`bash`、`typescript`、`python`、`json`。
- **何時不用**：不要拿 ` ```text ` 畫 ASCII 圖，改用 ` ```diagram `（§4.12）；一行就能寫完的用行內 code。
- **寫法**：三個反引號加語言名。
- **CSS**：Layout:541–570；Post:1374–1391。

### 4.6 清單

- **長相**：左內距 `--space-6`，`ul` 實心圓點、`ol` 數字（Layout:657–659）。`li` 下 `--space-2`（660）。任務清單的 checkbox 用 `accent-color: var(--brand-500)`（662）。
- **何時用**：三項以上平行的項目；步驟用有序清單；任務清單（46 篇）用在檢核表。
- **何時不用**：只有一兩項、或項目之間有因果關係時，寫成段落。
- **寫法**：`- 項目`、`1. 步驟`、`- [ ] 待辦`。
- **CSS**：Layout:656–662。

### 4.7 表格與 `.table-scroll`

- **長相**：文章頁的 script 把每個 `.content table`（`.route-videos__table` 除外）包進 `<div class="table-scroll">`（Post:986–992）。外框負責 1px `--border`、`--corner-md` 與橫向捲動（Layout:724–730）。表格本身 `width: 100%`、`--fs-sm`（734–740）；表頭底 `--bg-subtle`、700、下框 2px（741–748）；表頭與儲存格內距都是 `--space-3 --space-4`（745、750）；欄間 1px 右框（756–759）；列 hover 底 `--bg-subtle`（755）。
- **寬度規則**：寬度是 `100%`，讓儲存格換行；**不要改回 `max-content`**：一格字長就會讓整張表超寬，連桌機都要橫向捲動（Layout:731–733 註解）。真的塞不下的表（欄位多、長字串不能斷）才由 `.table-scroll` 橫向捲動。`/styleguide/` 的版面測試會檢查窄表格不溢出（§6）。
- **何時用**：兩個以上維度的比較、規格表、對照表（5,430 篇）。
- **何時不用**：只有兩欄的「名稱：說明」用清單更好讀；不要在儲存格裡塞長段落或程式碼區塊。
- **寫法**：GFM 表格。
- **CSS**：Layout:723–759；包裝 script Post:986–992。daily 詞彙表另有覆寫（Post:883–894）。

### 4.8 提示框（blockquote 與 callout）

所有 blockquote 都是提示框，分三種。`src/plugins/remarkCallout.ts` 依內容加上 `callout callout-<kind>` 類別（remarkCallout.ts:55–61），沒有辨識到的 blockquote 不加類別、維持預設 note 樣式。

| 種類 | 長相 | 觸發方式 | CSS |
|---|---|---|---|
| **note**（預設） | 底 `--bg-subtle`（中性）、左框 4px `--brand-500`（強調色當小標記）、右側 `--corner-md` 圓角、內距 `--space-4 --space-5`、字 `--text-primary`、不斜體 | 一般 `> …`；`> [!NOTE]`、`> [!IMPORTANT]`；開頭粗體 `**注意**`、`**Note**` | Layout:578–586 |
| **warning** | 底 `--warning-bg`、左框 `--warning-border` | `> [!WARNING]`、`> [!CAUTION]`；開頭粗體 `**警告**`、`**Warning**`、`**Caution**` | Layout:590–593 |
| **tip** | 底 `--success-bg`、左框 `--success-border` | `> [!TIP]`；開頭粗體 `**提示**`、`**小提醒**`、`**Tip**` | Layout:594–597 |

- **兩種寫法的差別**：
  - GitHub alert 語法（第一行 `[!KIND]`）：標記會被移除，換成一段在地化的粗體標題 `.callout-title`（remarkCallout.ts:69–88）。zh-TW 標題：說明／重要／提示／注意／小心；en：Note／Important／Tip／Warning／Caution（remarkCallout.ts:29–35）。標題讓種類不只靠顏色傳達。
  - 開頭粗體：粗體字本身就是標題，不移除任何東西；比對時忽略結尾的全形或半形冒號，英文不分大小寫（remarkCallout.ts:37–47、91–98）。
  - 注意：`**注意**` 是 **note** 不是 warning（中英對照文章裡「注意」對應 Note，remarkCallout.ts:11–12）。要黃框請寫 `**警告**` 或 `> [!WARNING]`。
- **框內段落**：上外距歸零、下 `--space-2`，最後一段歸零（Layout:587–589；瀏覽器預設的 p 上方 1em 在有內距的框裡不會摺疊，框頂會多一行空白）。標題段下 `--space-1`（598）。
- **何時用**：note＝版本說明、閱讀前提醒、補充；warning＝會出錯、會花錢、會失去資料的事；tip＝可選的捷徑或建議。
- **何時不用**：不要連續堆好幾個框；不要把整段正文放進框；引用他人原文時也會是 note 框，引文短就直接寫在段落裡加引號。
- **寫法**：

  ```markdown
  > [!WARNING]
  > 這個指令會刪掉整個資料夾。

  > **提示**：先跑 `--dry-run` 看看會改哪些檔案。
  ```

- **CSS**：Layout:575–598；外掛 `src/plugins/remarkCallout.ts`（astro.config.mjs:449 的 `remarkPlugins` 最後一個）。

### 4.9 語言切換膠囊

- **長相**：文章第一個元素若是「只含一個連結的 blockquote」，就不套提示框，改成小膠囊。分兩層：
  - 外層 blockquote 退回一般區塊：無底色、無框、無圓角、無內距，上外距 0、下 `--space-5`（Layout:604–611）。保持區塊是為了在寬版版面跟內文欄對齊（Layout:602 註解）。
  - 膠囊畫在裡面的 `> p` 上，中性灰：`display: inline-block`、內距 `0.3rem 0.9rem`、底 `--bg-subtle`、1px `--border` 框、`--corner-pill`、`--fs-sm`、行高 1.5、字 `--text-secondary`（Layout:612–623）。**不要改成 `inline-flex`**：flex 會吃掉地球圖示與連結文字之間的空白（Layout:613 註解）。
  - 連結 `--brand-700`、600、無底線，hover 才出現底線（Layout:624–630）。
  - 🌏 由 `rehypeNoEmoji` 換成 koboyo `globe` 圖示，並搬進連結裡當第一個子元素（`moveLeadingIconIntoLink`，src/plugins/rehypeNoEmoji.ts:472–490），所以段落裡仍然只有一個連結元素，下面的判斷條件照樣成立（Layout:601 註解）。
- **判斷條件**：`.content > blockquote:first-child:has(> p:only-child > a:only-child)`（Layout:604）。只有「整篇第一個元素」且「段落裡只有一個連結元素」才會中；前面多一個標題、或同段多一個連結，就會退回 note 框。這組選擇器的特異性必須高於 callout 規則（Layout:603 註解）。
- **何時用**：每篇雙語文章的第一行（6,439 篇）。
- **何時不用**：不要拿這個寫法做其他提示；第一行以外的位置不會套用。
- **寫法**：`> 🌏 [English version](/posts/<category>/<slug>-en)`（英文版寫 `> 🌏 [中文版](…)`）。
- **CSS**：Layout:600–630。

### 4.10 摺疊區塊 details／summary

- **長相**：1px `--border` 框、`--corner-md`、底 `--bg-card`、左右內距 `--space-4`、上下外距 `--space-5`（Layout:636–642）。`summary` 600、`--text-primary`、上下內距 `--space-3`，三角形標記 `--brand-500`（643–649）。展開時 summary 下方出現 1px 分隔線（650–654）。
- **何時用**：習題答案（`<details><summary>答案</summary>`，431 篇；英文版 `Answer`）、選讀的推導、補充數字。共 609 篇使用。
- **何時不用**：不要把正文主線藏進去。
- **寫法**：`<details><summary>答案</summary>`，空一行後寫 Markdown，再空一行 `</details>`。
- **CSS**：Layout:635–654。（TOC 與 FAQ 的 `details` 各有自己的樣式，只套在 `.toc`、`.faq-item`。）

### 4.11 水平線

- **長相**：上框 2px 虛線 `--border`、上下 `--space-10`（Layout:665–669）。daily 分類把它壓成 0 高（Post:761–765）。
- **何時用**：主題明顯轉換、但不值得一個 h2 時。
- **何時不用**：不要放在 h2 前面（h2 已經自帶分隔線）。
- **寫法**：獨立一行 `---`（frontmatter 的 `---` 不算）。
- **CSS**：Layout:664–669。

### 4.12 diagram（```diagram）

- **長相**：`<figure class="dg dg--{s|m|l}">`，紙面 `--bg-card`、1px `--border`、`--corner-lg`、內距 `--space-4 --space-4 --space-3`、上下 `--space-6`（diagram.css:3–23）。上方標題 .95rem／700、下外距 `--space-2`（24），下方圖說 .8rem `--text-muted`（25）。SVG 包在可聚焦的 `.dg__scroll` 內，寬圖在框內橫向捲動（26–27）。所有顏色來自 `dg-*` 類別（diagram.css:36–159），淺深色自動切換。
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

- **長相**：外框與 diagram 相同（`--corner-lg`、`--space-*`，flowDiagram.css:2）。節點底 `--bg-subtle`、框 `--text-muted`（10）；accent 節點底 `--brand-50`、框 `--brand-500`（14）；連線 1.6px 虛線（20）。播放時目前步驟轉 `--brand-500`，其他步驟淡出（27–36）。
- **尺寸**：`max-width: min(680px, 原寬)`、`min-width: min(500px, 原寬)`，原寬＝`--flow-w`（flowDiagram.css:8；remarkFlowDiagram.ts:204）。同樣最多 1:1。
- **何時用**：有先後順序、需要逐步播放的請求流程（18 篇）。節點與連線由 JSON 描述，版面由外掛計算。
- **何時不用**：靜態圖或需要自由排版時，用 ```diagram。
- **寫法**：fence 內是 JSON，必填 `title`、`lang`、`width`／`height`（100–2000）、`nodes`、`edges`、`steps`（remarkFlowDiagram.ts:50–60）。
- **CSS**：`src/styles/flowDiagram.css`；外掛 `src/plugins/remarkFlowDiagram.ts`。

### 4.14 Mermaid（```mermaid）

- **長相**：瀏覽器端把 `pre[data-language="mermaid"]` 換成 `.mermaid-diagram` 再渲染（Post:899–981）。框：上下 1.5rem、內距 1rem、1px `--border`、`--corner-md`、底 `--bg-subtle`、置中（Post:1394–1402）。≤640px 時 SVG 保持原寬（script 寫入 `--natural-w`，Post:962–965）、框內捲動（1404–1407）。
- **顏色**：Mermaid 的 `themeVariables` 只吃字面色，所以 script 在渲染時用 `getComputedStyle` 讀 token 的實際值（`themeTokenMap`，Post:907–941），每次切換主題都重新渲染。對應：主色 `--brand-100`／`--brand-500`、次要 `--info-*`、第三色與 note `--warning-*`、線 `--text-muted`、群組 `--bg-subtle`／`--border`。改 token 就會跟著變，不用手改 hex。
- **何時用**：既有文章（365 篇）。
- **何時不用**：新圖優先用 ```diagram：Mermaid 在瀏覽器端渲染、要載入 mermaid 套件，版面也比較難控制。
- **寫法**：` ```mermaid `。
- **CSS**：Post:1393–1407。

### 4.15 圖片、figure、圖說

- **長相**：`img` 最大寬 100%、`--corner-md`、上下 `--space-4`、block（Layout:672）；自動加 `loading="lazy" decoding="async"`（astro.config.mjs:43–61）。`figure` 上下 `--space-6`（673）；`figcaption` `--fs-xs`、`--text-muted`、置中（674）。
- **何時用**：截圖、照片。目前只有 12 篇用 Markdown 圖片、4 篇用 `<figure>`。
- **何時不用**：示意圖不要用點陣圖，改用 ```diagram（跟主題切換、可縮放）。
- **寫法**：`![替代文字](路徑)`；需要圖說時寫 `<figure><img …><figcaption>…</figcaption></figure>`。
- **CSS**：Layout:671–674。

### 4.16 數學（KaTeX）

- **長相**：KaTeX 預設樣式（Layout:14 載入 `katex.min.css`）；獨立公式 `.katex-display` 在自己的區塊內橫向捲動、上下內距 `--space-1`（Layout:539）。
- **何時用**：frontmatter 設 `math: true` 的文章（126 篇）。
- **何時不用**：沒設 `math: true` 時 `$` 只是一般字元。全站不開數學解析，是因為上千篇文章用 `$5 … $20` 寫價格（remarkMathOptIn.ts:19–23）。
- **寫法**：frontmatter `math: true`，行內 `$…$`、獨立 `$$…$$`。交稿前要看實際渲染頁面。
- **CSS**：Layout:538–539；外掛 `src/plugins/remarkMathOptIn.ts`＋`rehype-katex`（astro.config.mjs:449–451）。

### 4.17 註腳

- **長相**：GFM 註腳的預設輸出（文末 `<section>`、上標編號），沒有專屬 CSS。`src/plugins/rehypeFootnoteLabel.ts` 把 zh-TW 頁的註腳標題 `Footnotes` 換成「註腳」、返回連結的 `aria-label` 換成「回到引用處 N」；英文頁不動（rehypeFootnoteLabel.ts:23、30–48）。它必須是 rehype 外掛，因為 Astro 在使用者 rehype 外掛之後才收集標題，TOC 才會拿到在地化的標籤（rehypeFootnoteLabel.ts:9–10）。
- **何時用**：需要附註但不想打斷正文的補充、出處細節。目前 0 篇使用；慣例仍是把來源寫成行內連結或文末參考資料。
- **寫法**：正文 `文字[^1]`，文末 `[^1]: 說明`。
- **CSS**：無；外掛在 astro.config.mjs:451 的 `rehypePlugins` 最後一個。

### 4.18 TL;DR 方塊（frontmatter）

- **長相**：不是本文元件，由 frontmatter `tldr` 產生，位置在麵包屑下方、本文之前（Post:214–219）。底 `--bg-subtle`、1px `--border`、`--corner-md`、內距 `--space-3 --space-4`、`--fs-sm`、行高 1.6；上方「TL;DR」標籤 `--fs-2xs` 大寫 700 `--text-muted`（Post:524–542）。
- **何時用**：一兩句話講完全文結論。`description` 不顯示在頁面上，只進 `<meta>`（Layout:79、81）；沒有 `description` 時 meta 改用 `tldr`（Post:94、158）。
- **何時不用**：不要在本文開頭再手寫一個 TL;DR 段落（daily 分類例外，見 §4.23）。
- **CSS**：Post:523–542。

### 4.19 FAQ（frontmatter）

- **長相**：frontmatter `faq` 產生本文之後的問答區（Post:334–344）：上框 1px、每題 1px `--border` 框、`--corner-md`；問題 600／0.95rem，答案 0.92rem `--text-primary`（Post:656–661）。
- **CSS**：Post:656–661。

### 4.20 YouTube 嵌入（```youtube）

- **長相**：`<figure class="video-embed">` 內 16:9 框，1px `--border`、`--corner-md`、載入前底色 `--bg-video`（Post:1413–1424）；圖說 0.875rem `--text-muted`（1487–1491）。寬螢幕（≥1200px）點時間連結會進入分割檢視（1432–1463）；返回鈕 `--corner-pill`、`--shadow-floating`（1464–1486）。
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
- **CSS**：Post:1410–1492；外掛 `src/plugins/remarkYoutubeEmbed.ts`。
- **側欄停靠、章節時間、小視窗**（`src/lib/videoChapters.ts`、`src/styles/videoChapters.css`；開關在 `src/data/ui-features.ts`）：
  - **側欄停靠（≥1000px）**：文章的主影片（章節指向的那支，沒有章節就取第一支非片段循環的嵌入）移到右側固定欄、目錄上方，不管它原本嵌在文章哪裡；原位留一行 `--fs-sm` `--text-muted` 的「影片在右側欄播放」。側欄改成上限一個視窗高，目錄在欄內捲動。停靠的影片不進入分割檢視。已有 `relatedVideo` 卡片、英文口說練習頁、或側欄被 Ask AI 面板收起時不停靠。
  - **放大影片**：圖說上方「⤢ 放大影片／⤡ 還原大小」膠囊鈕（`--corner-pill`、`--fs-xs`，`aria-pressed`），比照 YouTube 劇院模式只給兩種大小、不做自由拖曳：一般 340px；放大為畫面一半，文章欄至少留約 600px，視窗太窄放不大時隱藏按鈕。選擇記在 localStorage。
  - **影片＋投影片（有 `data-slide-reader` 的課程導讀，如 CS329Z）**：比照 Kaltura、Panopto 的雙畫面播放器，用子母畫面。寬螢幕左文字；右欄一個 16:9 舞台，大的佔滿、小的 30% 疊在角落（`--shadow-floating`、`--corner-md`）。預設投影片大、影片小（右下）。小窗上緣有一條「⠿」拖曳條（`--bg-page`、1px `--border`、`--corner-sm` 上圓角；小窗本身是 iframe 接不到拖曳），可拖到舞台內任何位置，方向鍵每次移動 10%、Shift＋方向鍵貼邊；投影片大時不會蓋到 PDF.js 工具列。位置存成可移動範圍的比例，舞台變大變小都留在原處、不會出界。舞台下方控制列有「⇄ 影片放大／投影片放大」「↻ 換角落」（依順時針換角，方向鍵直接選角）「隱藏小窗」（隱藏時聲音照常）；選擇與位置記在 localStorage。投影片小窗時把 PDF.js 工具列推出視窗外，只留頁面。目錄在控制列下方填滿剩餘高度、欄內捲動。整欄一個畫面高、停在 Ask AI 鈕上方，期間頁面用滿視窗寬、隱藏 Ask AI 快捷鈕與回到頂端。欄寬 `pipSidebarWidth` 依視窗寬高算，文章至少留約 600px。投影片面板 `.slide-reader-panel--docked` 非 modal、隱藏自身標題列。正文「投影片第 N 頁」與目錄章節時間都會翻到該頁。窄於 1000px 或側欄收起時回到原本的彈出面板。
  - **章節時間**：某節標題後三個區塊內有指向本頁影片的時間連結（`&t=`，或文字以 00:00 起算的連結），就算一個章節；同一支影片至少兩章才顯示。目錄項目旁加 `--brand-700`、`--fs-xs`、等寬數字的時間鈕，點了跳到該節並從那一秒播放；嵌入被拒（顯示「請前往 YouTube 觀看」）時改開 YouTube 該秒。分割檢視時側欄隱藏，章節清單改顯示在固定播放器下方（1px `--border`、`--corner-md`）。
  - **小視窗（≥700px）**：播放中的嵌入捲出畫面時，縮成浮動播放器（`--shadow-floating`），原位用 `::before` 保留高度不讓內文跳動。預設左下角（右下已有 Ask AI、回到頂端與重點摘要鈕）。影片外側的控制列有「⠿ 移動」（可拖到畫面任何位置，四周留 `--space-6`、上方讓出頁首；位置存成比例，視窗縮放後不出界；方向鍵每次 10%、Shift＋方向鍵貼邊；控制列與縮放角依所在象限放在朝畫面中央那側）與「關閉 ×」（Esc 也可關，暫停並收起，下次播放才再浮出）；朝畫面中央的那個角有縮放拖曳角（240–720px，↑↓ 也可調）。位置與大小記在 localStorage。

### 4.21 video-gallery（```video-gallery）

- **長相**：一個播放器加一排可橫向捲動的縮圖；外框 1px `--border`、`--corner-lg`、底 `--bg-card`、上下 1.75rem（videoGallery.css:1）；播放器底 `--bg-video`、`--corner-md`（videoGallery.css:3）。縮圖上的片長膠囊、變暗層與白字用 §2.7 的 `--video-*` token。
- **何時用**：岩場文章的路線影片（102 篇）。影片清單寫在 `src/data/climbing-videos.ts`。
- **寫法**：fence 內 `key:` 與 `lang:`（remarkVideoGallery.ts:6–14）。
- **CSS**：`src/styles/videoGallery.css`。

### 4.22 video-practice（```video-practice）

- **長相**：英文口說練習卡，外框 1px `--border`、`--corner-lg`、底 `--bg-card`、上下 `--space-6`（videoPractice.css:1）；播放器底 `--bg-video`、`--corner-md`（videoPractice.css:8）。內含播放器、雙語字幕清單、片語 `details`。
- **何時用**：英文口說文章（4 篇）。
- **CSS**：`src/styles/videoPractice.css`；外掛 `src/plugins/remarkVideoPractice.ts`。

### 4.23 其他

- **slide-reader**（32 篇，課程筆記的投影片閱讀器）：文章裡寫 `<div class="slide-reader" data-slide-reader data-pdf-src="…">`，由 `src/lib/slideReader.ts` 接手。框 1px `--border`、`--corner-md`、底 `--bg-subtle`、內距 `--space-4`、上下 `--space-6`（slideReader.css:1）；對話框遮罩 `--scrim`（slideReader.css:6）、PDF 載入前底色 `--slide-backdrop`。樣式檔是單行壓縮格式。
- **術語標記**（`.glossary-term`，由 script 標在本文上）：平時只有點狀底線 `--brand-500`、底透明；hover／focus 底 `--brand-100`、字 `--text-primary`（Post:681–695）。彈窗樣式 Post:1277–1373。
- **VocabularyCapture**（文章本文上方的單字收藏列）：連結跟本文連結同一套規則（`--brand-700` 字、`--brand-300`／`--brand-500` 底線，深色模式同 §4.3），寫在 `src/components/VocabularyCapture.astro` 的 scoped style。
- **daily 分類專用**：`article[data-category="daily"]` 把特定 h3（`tldr`、`read-priority`、`reviewer`、`take-away`）變成小標籤，下一段變成卡片（Post:767–863）。標籤底色借用分類色 token（現在都是 `--cat-neutral` 中性灰）、字 `--text-on-accent`、`--corner-sm`、`--fs-2xs`（Post:772–776、798–802、821–825、847–851）。論文標題 1.2rem、論文 metadata 卡片 0.75rem（Post:737–758）。`daily-brief` 版型只調 TOC（Post:697–728）。

### 4.24 emoji 與 koboyo 圖示

站上不顯示 emoji，文章原始稿也不放（原則 10）。原始稿寫 shortcode 或文字記號，建置時由 `src/plugins/rehypeNoEmoji.ts` 改寫；外掛仍認得 emoji 本身，所以舊資料（例如 video-gallery 的影片標題）照樣會被換掉。它是 `rehypePlugins` 的最後一個（astro.config.mjs:450–451），因為 Astro 在使用者 rehype 外掛之後才收集標題，TOC 與標題 id 才會用改寫後的文字（rehypeNoEmoji.ts:26–27 註解）。`pre`、`code`、`kbd`、`samp`、`svg`、`math` 等裡面的文字不動（rehypeNoEmoji.ts:44）。

- **圖示的長相**：與介面同一套 koboyo SVG，加粗算法共用（`fattenStroke`，render.ts:39；把填色外框再描 0.9px 邊，`FATTEN_PX`，render.ts:15，小尺寸才不會像細線）。`Icons.astro` 用 `renderIconSvg`（render.ts:47）輸出完整的 SVG。
- **文章裡用 sprite**：每個圖示只輸出 `<svg class="inline-icon" width="1em" height="1em"><use href="#ki-<name>"/></svg>`（renderIconUse，render.ts:71）。外掛把這篇用到的圖示名稱寫進 `remarkPluginFrontmatter.inlineIcons`（rehypeNoEmoji.ts:514），文章頁在 `<Content />` 後面輸出一個隱藏的 sprite，每個 `<symbol id="ki-<name>">` 只出現一次（renderIconSprite，render.ts:80；Post:337）。sprite 是 `width="0" height="0" style="position:absolute"`，不用 `display:none`（有些瀏覽器會因此畫不出 `<use>`），也是 `.content` 的最後一個子元素，不影響 `:first-child` 類選擇器。sprite 不放進 Markdown 渲染結果，是因為那份 HTML 會存進 Astro 的 content store：每篇都有的地球圖示路徑約 2 KB，六千多篇就是 14 MB，曾讓 CI 的 dev server 記憶體用完。改成 sprite 後，content store 裡的圖示相關字串從約 17.4 MB 降到約 2 MB。**限制**：只有文章頁會輸出 sprite；把渲染後的文章 HTML 拿到別處用的地方（目前沒有：RSS 與 llms.txt 只用 frontmatter，D1 同步與 Ask AI 用原始 Markdown，Pagefind 讀的是完整頁面）要自己補 sprite，否則圖示會是空的。內文裡的圖示帶 `class="inline-icon"`，寬高 1em、`vertical-align: -0.125em`、顏色跟著文字（Layout:632–633），所以在標題、表格、連結裡都跟字一樣大、一樣色。
- **原始稿怎麼寫**：shortcode 先展開成對應的 emoji，再走同一套規則，所以 `:globe:` 與 🌏 的輸出完全相同（SHORTCODES、expandShortcodes，rehypeNoEmoji.ts）。是／否寫 `✓`／`✗`，與 ✅／❌ 畫成同一個 `check`／`x` 圖示、同樣有「是」「否」報讀；星等與數量寫 `★`／`☆`。shortcode 一覽：`globe` `file` `pencil` `book` `warning` `question` `target` `pin` `clock` `hourglass` `compass` `film` `bulb` `lock` `construction` `search` `refresh` `coin` `receipt` `puzzle` `shield` `wrench` `settings` `link` `checklist` `home`，色點 `red-circle` `orange-circle` `yellow-circle` `green-circle` `blue-circle` `purple-circle` `brown-circle` `black-circle` `white-circle`，色塊把 `-circle` 換成 `-square`。code 區塊與 inline code 裡的 emoji 照原樣顯示，檢查也不擋。舊稿或貼進來的內容含 emoji 時，`pnpm emoji:fix <檔案>`（scripts/convert-emoji-to-source.ts）換成渲染結果相同的寫法；2026-11-20 全站 6,741 篇就是用它轉換的，轉換前後經同一條 Markdown → HTML 管線比對，只有 6 篇差在不可見的行尾空白；另 79 篇本來就有其他逐篇檢查的問題（process-leak、diagram-preview），暫列 `scripts/config/no-emoji-baseline.json`，全站檢查不擋，改到時 `--staged` 會要求一起轉換。
- **對照表**（EMOJI_ICONS，rehypeNoEmoji.ts）：

  | emoji | koboyo 圖示 | 螢幕報讀 |
  |---|---|---|
  | 🌏 🌍 🌎 🌐 | `globe` | 裝飾（`aria-hidden`） |
  | 📄 📃 | `file-text` | 裝飾 |
  | 📝 ✏️ | `pencil` | 裝飾 |
  | 📖 📚 | `book-open` | 裝飾 |
  | ✅ ✔️ ☑️ ✓ | `check` | 「是」／Yes |
  | ❌ ❎ ✖️ ⛔ ✗ | `x` | 「否」／No |
  | ⚠️ 🚨 | `alert-triangle` | 「注意」／Caution |
  | ❓ ❔ | `help-circle` | 「待確認」／Unclear |
  | ⭐ 🌟 | 先當成 `★`，照下面「星號」的規則處理 | 依用法 |
  | 🎯 | `target` | 裝飾 |
  | 📌 📍 | `pin` | 裝飾 |
  | ⏰ ⏱️ 🕒 | `clock` | 裝飾 |
  | ⏳ ⌛ | `hourglass` | 裝飾 |
  | 🧭 | `compass` | 裝飾 |
  | 🎬 🎥 | `clapperboard` | 裝飾 |
  | 💡 | `lightbulb` | 裝飾 |
  | 🔒 🔐 | `lock` | 裝飾 |
  | 🚧 | `construction` | 裝飾 |
  | 🔎 🔍 | `search` | 裝飾 |
  | 🔄 🔁 | `refresh-cw` | 裝飾 |
  | 💰 💸 🪙 | `coin` | 裝飾 |
  | 🧾 | `receipt` | 裝飾 |
  | 🧩 | `puzzle` | 裝飾 |
  | 🛡️ | `shield` | 裝飾 |
  | 🛠️ 🔧 | `wrench` | 裝飾 |
  | ⚙️ | `settings` | 裝飾 |
  | 🔗 | `link` | 裝飾 |
  | 📋 | `list-checks` | 裝飾 |
  | 🏠 | `home` | 裝飾 |

  有報讀文字的是狀態標記，輸出 `role="img"` 加 `aria-label`，語言依 frontmatter `lang` 選中文或英文（LABELS，rehypeNoEmoji.ts:55–61）；其餘是裝飾，輸出 `aria-hidden="true"`。這次新增的 koboyo 圖示：globe、x、alert-triangle、star、star-solid（由 `star` 拿掉內圈輪廓得到，不是手畫的，koboyo.ts:166–172）、target、help-circle、hourglass、compass、clapperboard、lightbulb、lock、construction、coin、receipt、puzzle、shield、wrench、pencil（`src/components/icons/koboyo.ts`）。
- **色點與色塊**（SWATCHES，rehypeNoEmoji.ts:144–163）：🔴🟠🟡🟢、🟥🟧🟨🟩 換成小的實心圓／方塊 SVG，紅、黃橘、綠保留色相（`--danger`、`--warning-border`、`--success-border`），因為它們通常是嚴重度或負責人的圖例；🔵🟣🟤⚫、🟦🟪🟫⬛ 用文字色；⚪⬜ 是空心。
- **換成文字**（EMOJI_TEXT，rehypeNoEmoji.ts:124–140）：🥇🥈🥉 → 1／2／3；❗❕ → !、‼ → !!、⁉ → !?；🔶🔸 → △、🔷🔹 → ◆；⬆⬇⬅➡ → ↑↓←→；keycap（1️⃣）→ 數字。
- **星號 ★ ☆**（rehypeNoEmoji.ts:293–391）：不是 emoji，但站上一樣畫成 koboyo 星星——★ 用 `star-solid`、☆ 用外框 `star`（koboyo 只有外框星，`star-solid` 是同一條路徑拿掉內圈）。同一個符號在文章裡有三種意思，報讀文字跟著意思走：
  - **評分**：連續 2 顆以上的 ★／☆（中間不能有空格，可帶 VS15／VS16），或後面接 `½`／`⯨` 的半顆，包成一個 `span.star-rating`，`role="img"` 加 `aria-label`，裡面每顆星都 `aria-hidden`。有空心星時寫「N / M」（英文 `N out of M`，例如 `★★☆` →「2 / 3」）；全是實心星時只寫顆數「N 星」（英文 `N stars`；`★★½` →「2.5 星」），因為文章沒寫滿分是 3（theCrag）還是 4（Mountain Project），不替它補一個滿分（ratingLabel，rehypeNoEmoji.ts:316）。單獨一顆 ★ 在表格儲存格開頭（儲存格只有它，或後面接 `;`／`、`），或緊接在 `theCrag` 後面，也算一星評分「1 星」。樣式：`inline-flex`、間距 0.05em、不換行（Layout:634–636）。
  - **數量**：★ 緊貼數字（`23.2k★`、`★ 1.2k`、`MP 2.5★`），或表頭只有一顆 ★（GitHub 星數欄），輸出一顆帶 `role="img"`、`aria-label`「星」／`stars` 的實心星。
  - **記號**：其他單獨的 ★（`★ 人類看得懂嗎`）與單獨的 ☆（`スター☆トレック` 這種名字裡的）是裝飾，`aria-hidden`。
  - remark 外掛輸出成原始 HTML 的內容（例如 video-gallery 的路線表）在 rehype-raw 之前還是字串，外掛會對標籤之間的文字做同樣的改寫，`code`、`pre` 等裡面照樣不動（rewriteRawHtml，rehypeNoEmoji.ts:394）。
- **保留原樣**：本來就是單色文字的符號 `© ® ™`、箭頭 `←`…`⇿`、`☐ ☒`，只去掉後面的 VS16（`✓ ✗` 從 2026-11-20 起改畫成圖示，見對照表）（KEEP_TEXT_RE，rehypeNoEmoji.ts:170）。frontmatter 裡的 ★ ☆ 經 `stripEmojiText` 仍是文字。
- **移除**：以上都沒有對應的 emoji（例如 🚀、🔥、👉、表情臉、旗幟、ZWJ 組合）連同後面那個空格一起刪掉。刪掉後若整個元素變空（例如表格儲存格），補一個 `•`；🆕 單獨出現時補 `NEW`；`（🚀）` 這類只剩括號的會連括號一起刪（rehypeNoEmoji.ts:166–167、239–256）。
- **frontmatter 文字**：標題、描述、TL;DR 不經過 Markdown 樹，顯示時用 `stripEmojiText` 轉成純文字：狀態標記變成單色符號（`✅` → `✓`、`❌` → `✗`、`⚠️` → `⚠︎`、`❓` → `?`、`⭐` → `★`），色點變 `●`／`■`（空心 `○`／`□`），其餘刪掉（rehypeNoEmoji.ts:515–533）。目前用在 TL;DR 方塊（Post:217）、文章卡片摘要（src/components/PostCard.astro:26）、video-gallery 的影片標題與頻道名（src/plugins/remarkVideoGallery.ts:69–70）。
- **何時用**：要表達狀態時用有報讀文字的那幾個（`✓`、`✗`、`:warning:`、`:question:`），意思才不會丟；其他圖示用 shortcode。介面元件一律直接用 `Icons.astro`，不要放 emoji。
- **何時不用**：不要為了裝飾在標題前加 emoji，多半會被刪掉；需要新的圖示對應時，先在 `koboyo.ts` 補圖示、再加進 EMOJI_ICONS 與 SHORTCODES。
- **CSS**：Layout:632–633；外掛 `src/plugins/rehypeNoEmoji.ts`；渲染 `src/components/icons/render.ts`。

---

## 5. 已知不一致與待辦

2026-11-19 分兩輪修了大部分；本節先簡列已解決的，再列還沒解決的。

### 5.1 已解決（2026-11-19）

第一輪：

- **第二個 token 來源**：文章頁 `article { --text-secondary; --brand-700 }` 的覆寫已刪（Post:446 註解）。`check:chat-style` 規則 1 改成「tokens.css 宣告的任何名稱都不准在別處再宣告」（scripts/check-chat-style.mjs:31–35、77–84），並有 `--self-test` 接進 `pnpm verify`（scripts/verify.mjs:168）。
- **三套連結色**：統一成 Layout 一套（`--brand-700` 字＋`--brand-300`／`--brand-500` 底線，Layout:531–536）；寫死的 hover 藍 `#1d4ed8` 已移除，TOC 與系列導覽改用同一套底線（Post:584、640）。
- **引言框只有藍色一種**：預設改成品牌綠 note，新增 warning、tip；由 `remarkCallout.ts` 支援 GitHub alert 語法與開頭粗體（§4.8）。原本產生不出來的 success 死碼已移除。
- **Mermaid 手抄 hex**：改成渲染時讀 token（Post:907–941），淺深色不會再漂移。
- **h2 色條定義又關掉**：色條移除，h2 分隔線統一寫在 Layout（Layout:492–505），文章頁不再覆寫。
- **寫死的顏色**：Post、chat.css、videoGallery.css、videoPractice.css、diagram.css 的字面色都已換成 token（§2.5–2.8）；hero 漸層改用 `--brand-*`／`--bg-*`（Post:452、460–462）；daily 標籤改用分類色；YouTube 播放器底色統一為 `--bg-video`（Post:1423）。
- **類型徽章、`mark` 不跟深色模式**：新增 `--type-*`、`--mark-*`，都有深色值。
- **分類色沒有深色值**：低對比的 8 個已補深色值；`--cat-surf`、`--cat-learning` 換成白字 ≥ 4.5:1 的淺色值。
- **對比不足**：`--brand-500`／`--text-secondary` 淺色改 `#2f7a4d`、`--text-muted` 改 `#6e6e6e`，都 ≥ 4.5:1；程式碼註解色提亮（§4.5）。
- **字級、間距、圓角未 token 化**：新增 `--fs-*`、`--space-*`、`--corner-*`，文章內文全部改用（§3）。
- **daily 分叉一套字級**：daily 的內文字級、行高、段距、h2／h3 已與一般文章相同（Post:734）。
- **本文 details 沒有樣式**：補上框、標題與展開分隔線（§4.10）。
- **註腳**：zh-TW 頁的註腳標題與返回連結已在地化（§4.17）。
- **提示框框頂多一行空白**：框內段落上外距歸零（Layout:587–588）。
- **沒用到的 token**：`--info-icon`、`--success-icon`、`--slide-page` 已刪。

第二輪：

- **外掛 CSS 的字級、間距、圓角**：diagram、flow-diagram、video-gallery、video-practice、slide-reader 在值對得上級距的地方改用 `--fs-*`／`--space-*`／`--corner-*`；大型嵌入外框統一 `--corner-lg`（diagram.css:21、flowDiagram.css:2、videoGallery.css:1、videoPractice.css:1、slideReader.css:50）。`--fs-md`、`--space-8`、`--corner-lg` 因此都有使用者了。
- **`--dg-warn-tint` 與 `--dg-warn` 不同源**：淡底改由 `--diagram-warn` 調出（diagram.css:15）。
- **文章頁的零星圓角**：daily 標籤、複製鈕、術語彈窗按鈕的 4／5／6px 改成 `--corner-sm`（Post:775、801、824、850、1383、1294、1323、1356）；TL;DR、TOC、上下篇導覽、系列框、FAQ 外框、麵包屑等的間距與字級對齊到 token（例如 Post:502–504、524–542、548–554、649–654、657）。
- **hero 的左右負外距**：改成跟著 `--page-gutter` 走（Post:454–456），刪掉兩個重複的斷點。
- **程式碼區塊與 About 頁的寫死顏色**：新增 `--code-text`、`--code-bar`、`--code-bar-divider`（Layout:545、556、561）與 `--shadow-card-soft`；PostLayout 的 `<style>` 裡已經沒有任何 `#hex`／`rgba()`。（程式碼區塊實際的底色與字色仍由 Shiki 決定，見 §5.2 第 1 點。）
- **導覽列與 About 頁**：footer、徽章、篩選鈕、tag 等改用 token（Layout:383–485），About 頁部分改用。
- **VocabularyCapture 連結**：改跟本文連結同一套規則（§4.23）。

第三輪（配色與圖示）：

- **配色重新設計**：改成單一強調色墨綠 `#1D6B4C`（深色 `#5FCB9A`）＋中性灰（§2）。標題改 `--text-primary`；所有分類徽章指向 `--cat-neutral`、類型徽章同一個灰；`--info-*` 不再是藍；`--mark-*` 由強調色淡底衍生；tag、TOC、系列導覽、語言切換膠囊、行內程式碼、note 提示框底、Chat 使用者氣泡平時中性，hover／啟用才轉強調色。強調色的使用範圍寫成原則 2。
- **深色模式品牌色階不是綠色**：深色 `--brand-*` 整組改成綠色系（tokens.css:142–147），名稱與色相對得上了。
- **emoji**：介面與渲染後的文章不再出現 emoji，改由 koboyo 圖示、文字或移除（原則 10、§4.24）。

### 5.2 還沒解決

依影響排序。

1. **程式碼區塊的底色與字色不吃 token**：Shiki 在 `pre.astro-code` 寫 inline `style="background-color:#24292e;color:#e1e4e8"`，蓋過 `.content pre` 的 `--bg-code`／`--code-text`（Layout:544–545）。結果是有語法上色的區塊在淺色、深色模式都是 github-dark 的 `#24292e` 底，tokens.css 的 `--bg-code`（淺 `#1e1e2e`、深 `#0d1117`）與 `--code-text` 只對沒有經過 Shiki 的 `pre` 有效。修法方向：在 `shikiConfig` 設 `defaultColor: false`（只輸出 CSS 變數、不寫 inline 色），或改用 `css-variables` 主題，讓底色與字色回到 CSS 控制；改之前要確認語法色在兩種主題的對比。
2. **語意層 token 還沒有**：`--brand-700` 與 `--brand-500` 同值、`--text-secondary` 與 `--text-muted` 同值、`--heading-accent` 與強調色同值且沒有任何使用者（tokens.css:18–19、25–26、31）。元件作者仍要自己判斷「這裡算不算強調色的用途」。改成語意層 token（例如 `--link`、`--accent`、`--callout-note-bg`）的提案還在等決定；在那之前照原則 2 的清單選 token。
3. **daily 標籤與 `--cat-*` 的耦合**：daily 的 TL;DR、read-priority 等標籤底色借用 `--cat-investing`、`--cat-ai`、`--cat-policy`（Post:772、798、821），分類色改成全灰後它們也一起變灰。這是配色改動的副作用，要不要給 daily 標籤自己的 token 還沒決定。
4. **對不上級距、保留字面值的圓角與間距**：
   - 外掛 CSS：flow-diagram 控制鈕 .4rem（flowDiagram.css:43）；video-gallery 內層 .4rem／.3rem（videoGallery.css:16、48、56、96、110）與外框上下 1.75rem（videoGallery.css:1）；video-practice 按鈕 .4rem（videoPractice.css:12、22）；slide-reader 5px／10px（slideReader.css:2、4）。
   - 文章頁：Mermaid 與 YouTube 的上下 1.5rem 與 YouTube 圖說 0.875rem 跟 token 同值卻沒有改用（Post:1395、1414、1489）；§3.1 列出的字級。
   - 這些要嘛新增級距、要嘛改外觀對齊，需要設計決定，不是機械替換。
5. **導覽列與 About 頁只部分 token 化**：導覽列與頁首（Layout:241–380）仍多是字面值（例如 skip link 4px 圓角 Layout:189、nav 字級 0.8／0.78／0.7rem）；About 頁（Layout:761–1543）有 10／6／2／14px 圓角（Layout:908、1059、1119、1193、1226）與大量字面值字級、間距。
6. **後台元件規格還沒寫進 §4**：後台顏色已統一到 tokens.css（§7），但面板、表格、表單、狀態的長相與何時用只有 `/design/` 的範例，還沒有逐一寫成 §4 那樣的規格。
7. **兩份 shadcn 對應**：`src/styles/chat.css` 與 `src/styles/globals.css` 各有一份 `@theme inline`，對應略有不同（Chat 的 `background` 是 `--bg-card`、`accent` 是 `--brand-100`；後台是 `--bg-page`、`--bg-muted`）。要不要合成一份、Chat 的 hover 要不要改中性，還沒決定。
8. **flow builder 節點分類色**：`src/components/admin/console/flow-builder/step-fields.ts` 與 `FlowEditor.tsx` 的 `STEP_COLORS` 是 9 色分類色盤，仍是字面值；圖表色盤 `--diagram-s1`～`s5` 只有 5 色，要不要擴充成共用的分類色 token 還沒決定。

---

## 6. 怎麼改設計

1. **先找到元件在這份文件的哪一節**，照「CSS」欄的行號去改。Markdown 內文通用的樣式在 Layout 的 `.content` 區段（Layout:487–759），外掛產生的元件各有自己的 CSS 檔（`src/styles/diagram.css`、`flowDiagram.css`、`videoGallery.css`、`videoPractice.css`、`slideReader.css`，由 Layout:7–14 載入），只在文章頁出現的在 Post 的 `<style>`。Markdown 語法層的行為（提示框種類、註腳文字）在 `src/plugins/`。
2. **改顏色、字級、間距、圓角只改 `src/styles/tokens.css`。** 淺色在 `:root`、深色在 `[data-theme="dark"]`，有深色值的兩邊一起改；新的文字色要對它的底色 ≥ 4.5:1。不要在別處重宣告 token，`check:chat-style` 規則 1 會讓 verify 失敗（scripts/check-chat-style.mjs:31–35）。
3. **新增元件**：先確認既有元件真的不夠用。顏色、字級、間距、圓角都用 token；寬度遵守原則 5（放不下就給自己的捲動容器）；在 390px 與 1280px、淺色與深色四種組合都看過。
4. **看 `/styleguide/`。** 這個頁面把本文件列的每個元件都渲染一次，改完 CSS 直接在這裡比對，不用翻文章找範例。新增元件要把範例加進 `src/content/styleguide/styleguide.md`。
5. **跑 `pnpm verify`。** 它包含 `check:chat-style`（含 `--self-test`）、`check:diagram-text` 等檢查；紅燈就修真正的問題，不弱化檢查。
6. **版面測試會擋。** `tests/visual/styleguide.spec.ts` 在 CI 的 `pnpm test:visual` 裡跑，對 `/styleguide/` 檢查：頁面沒有橫向溢出、文字對比足夠、語言切換膠囊精簡且與內文對齊、窄表格不溢出、圖表顯示寬度不超過 viewBox。這些是 §1 原則 3–6 的自動化版本；新元件要加進 `/styleguide/` 才會被涵蓋。依專案規則，本機跑測試前要先取得同意，否則以 CI 結果為準。
7. **看 `/design/`。** 後台與通用元件（`src/components/ui/`、`src/components/admin/`）的範例在這頁；新增元件要在 `src/components/design/UiShowcase.tsx`（React）或 `src/pages/design/index.astro`（Astro）補範例，否則元件清單會標「沒有範例」。
8. **回頭更新這份文件。** 改了值或行號就同步更新對應段落；新增元件就在 §4 補一節（長相、何時用、何時不用、寫法、CSS 位置）；修掉 §5.2 的項目就移到 §5.1。

---

## 7. 全站分層與後台

全站 UI 分四層，參考 Ghost Admin 的 Shade 設計系統。引用只能往下：頁面用 Pattern，Pattern 用通用元件，元件只用 token。

| 層 | 位置 | 放什麼 |
|---|---|---|
| Token | `src/styles/tokens.css` | 顏色、字級、間距、圓角、陰影；淺色與深色各一組值 |
| 通用元件 | `src/components/ui/`（shadcn/ui，React） | 按鈕、輸入框、對話框等，不懂任何業務 |
| Pattern | `src/components/admin/`、`src/components/ai-elements/` 等 | 懂業務的組合：後台面板、狀態徽章、表格、session 訊息 |
| 頁面 | `src/pages/` | 組合 Pattern，不自己定顏色 |

新東西放哪一層：只是一個值 → token；通用控制項 → 先找 `ui/`，沒有才新增；懂業務且在兩個以上頁面重複 → Pattern；只出現一次就先留在頁面裡。

後台的接法：

- `src/styles/admin-tokens.css` 第一行 `@import "./tokens.css"`，自己只宣告後台版面尺寸（`--sidebar-width`），不宣告任何顏色。後台各頁的樣式 class 仍在這個檔。
- shadcn 元件與 Tailwind 語意 class（`bg-primary`、`text-muted-foreground`、`border-border`）透過 `src/styles/globals.css` 的 `@theme inline` 取 token；那裡不寫字面色。
- 深色：後台與前台共用 `localStorage` 的 `theme` 偏好與 `[data-theme="dark"]`；`globals.css` 用 `@custom-variant dark` 讓 Tailwind 的 `dark:` 跟著 `data-theme` 走。元件不需要寫 `dark:` 顏色變體，token 會自己換值。
- Astro 版（`AdminButton.astro` 等）與 React 版（`ui/button.tsx`）並存：不需要 hydrate 的頁面用 Astro 版，互動 island 用 React 版；兩者顏色都只來自 token。

