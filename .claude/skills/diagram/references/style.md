# 樣式詞彙（dg-* class）

圖裡的顏色、字級、字型全部由 class 決定，定義在 `src/styles/diagram.css`，色值來自 `src/styles/tokens.css`。這樣深淺色切換時圖會跟著變，作者不用畫兩份。

**硬性規定（build 會擋）：** 不寫 `fill="#…"`／`stroke="red"` 這類顏色值（只准 `none`、`transparent`、`currentColor`、`url(#…)`）、不寫 `style`、`<style>`、`font-family`、`<script>`、`on*`、`<image>`、`<use>`、`<foreignObject>`，`href` 只能指向圖內 `#id`。

## 語意角色

| 角色 | 用在 | 對應 token |
|---|---|---|
| ink | 主要文字、強調線 | `--text-primary` |
| muted | 預設線條、外框、次要文字 | `--text-muted` |
| paper／paper-2 | 節點底色／帶狀底色 | `--bg-card`／`--bg-subtle` |
| rule | 細分隔線、邊界框 | `--border` |
| accent | **全圖 1–2 個**焦點元素 | `--brand-500`（綠） |
| link | 外部呼叫、HTTP/API | `--info-border`（藍） |
| warn | 失敗、風險、回頭路 | `--danger`（紅） |

**焦點規則：** accent 只給 1–2 個元素。想把 4 個東西都標 accent，代表還沒決定哪個才是重點。

## 形狀

| class | 外觀 | 用途 |
|---|---|---|
| `dg-box` | 卡片底＋灰框 | 一般節點（服務、步驟、元件） |
| `dg-box dg-box--accent` | 淡綠底＋綠框 | 焦點節點 |
| `dg-box dg-box--store` | 灰底＋灰框 | 資料庫、儲存、狀態 |
| `dg-box dg-box--link` | 淡藍底＋藍框 | 外部系統、第三方 |
| `dg-box dg-box--warn` | 淡紅底＋紅框 | 失敗狀態、風險 |
| `dg-box dg-box--ghost` | 虛線框 | 選配、非同步、尚未存在 |
| `dg-box dg-box--solid` | 實心深色 | 極少用：起點／終點標記（文字配 `dg-text--invert`） |
| `dg-zone`（`--accent`、`--solid` 改實線） | 虛線框、無填色 | 部署邊界、信任邊界、分組；外部來源用虛線、自己掌控的範圍用實線時加 `--solid` |
| `dg-band`（`--accent`、`--warn`） | 淡色底、無框 | 泳道、分層、時間區段的背景 |
| `dg-area`（`--accent`、`--link`） | 半透明填色＋框 | 韋恩圖的集合、象限中的區塊 |
| `dg-dot`（`--accent`、`--muted`、`--hollow`） | 實心點 | 時間軸事件、散點、狀態起點 |

形狀不限 `<rect>`：判斷用的菱形、金字塔的梯形寫成 `<path class="dg-box" d="…"/>` 或 `<polygon class="dg-box" points="…"/>`，修飾 class 一樣適用；流程的起點用 `dg-dot`，不用橢圓。預覽腳本對這些形狀也會檢查文字有沒有超出邊。

節點圓角一律 `rx="6"`（小標籤 `rx="2"`），**不用陰影、不用大圓角**。

## 線條

| class | 用途 |
|---|---|
| `dg-line` | 預設連線（灰） |
| `dg-line dg-line--accent` | 主路徑（綠、較粗） |
| `dg-line dg-line--link` | HTTP/API、外部呼叫（藍） |
| `dg-line dg-line--warn` | 失敗、重試、回頭路（紅） |
| `dg-line dg-line--dashed` | 回應、非同步、選配（可和上面任一個疊加） |
| `dg-line dg-line--strong` | 時間軸主軸、生命線 |
| `dg-rule` | 細分隔線、圖例上方的線 |
| `dg-axis` | 座標軸 |

箭頭：`marker-end="url(#arrow)"`，另有 `#arrow-accent`、`#arrow-link`、`#arrow-warn`，顏色要和線一致。雙向用 `marker-start` 加 `marker-end`。marker 由元件注入，**不要自己寫 `<marker>`**。

## 文字（字級是 viewBox 單位）

| class | 字級 | 用途 |
|---|---|---|
| `dg-heading` | 17 粗 | 欄位標題、分區標題 |
| `dg-label` | 15 半粗 | 節點名稱 |
| `dg-sub` | 12.5 灰 | 節點副標（技術名、一句說明） |
| `dg-edge` | 12.5 灰＋描邊遮罩 | 連線標籤（自帶底色描邊，壓到線也讀得到，但仍要留間距） |
| `dg-edge dg-edge--on-band` | 同上 | 標籤放在 `dg-band` 上時用，描邊換成帶狀底色，才不會多出一塊白底 |
| `dg-small` | 11.5 灰 | 座標軸刻度、註腳 |
| `dg-tag` | 11.5 粗、字距 | 英文大寫小標（`CLOUDFLARE`、`PHASE 1`） |
| `dg-big` | 26 粗 | 漏斗／金字塔裡的數字 |
| `dg-mono` | 等寬 | 只給技術內容：指令、port、URL、檔名 |
| `dg-em` | 斜體 | 編輯註記 |

顏色修飾：`dg-text--accent`、`dg-text--warn`、`dg-text--link`、`dg-text--invert`（深色底上的字）。

**線和它的標籤同色：** 紅線（`dg-line--warn`）的標籤加 `dg-text--warn`，藍線（`dg-line--link`）的標籤加 `dg-text--link`。逐步播放時只有灰線和框線會變綠，紅線、藍線和所有文字都保持原色，所以顏色要在這裡標清楚。

**最小字級 11.5；寬度 ≤ 440 的圖最小 12.5。** 441 以上的圖在手機上最多縮到 0.75 倍（再寬就改成框內左右捲動）；≤ 440 的圖會整張縮進螢幕，約 0.7 倍，11.5 的字只剩 8px 讀不了。預覽腳本會抓手機上小於 8.5px 的字。

對齊用 SVG 屬性：`text-anchor="middle"`、`dominant-baseline="central"`；多行用 `<tspan x="…" dy="1.3em">`。

## 步驟徽章

```svg
<g class="dg-badge"><circle cx="120" cy="80" r="10"/><text x="120" y="80" text-anchor="middle" dominant-baseline="central">1</text></g>
```

`dg-badge--accent` 把底色換成綠色。

## 寬度分級

元件依 viewBox 寬度自動決定手機行為：

| viewBox 寬 | 桌機上限 | 手機 |
|---|---|---|
| ≤ 440 | 560px | 縮到螢幕寬（375px 手機的可用寬度約 309px，約 0.7 倍）；**這種寬度的圖最小字用 `dg-sub`（12.5），不要用 `dg-small`、`dg-tag`** |
| 441–640 | 720px | 最窄 480px，超過就框內捲動 |
| 641–800 | 840px | 最窄 600px，超過就框內捲動 |

能塞進 640 就不要用 800；想讓手機不用左右捲，就把圖收進 440 寬（最小字 12.5）（適合直式的分層、樹狀、時間軸）。

## 資料圖表與特殊圖型

數據圖表（長條、折線、散點、熱力圖、桑基…）和等軸測圖用下面這組 class。**資料直接寫成 SVG 座標**：先把數值換算成座標再畫，數值和換算比例寫在圖說或 `desc` 裡，讀者才能核對。

### 顏色：`--dg-c`

標記本身不帶顏色，顏色由一個 `dg-c-*` class 決定，可以放在標記上，也可以放在包住一組標記的 `<g>` 上（整組同色）：

| class | 顏色 | 用途 |
|---|---|---|
| `dg-c-accent` | 綠 | **唯一**焦點系列（一張圖最多一個） |
| `dg-c-s1`～`dg-c-s5` | 藍灰、芥末、鏽紅、灰紫、鼠尾草綠 | 非焦點系列，依序使用；超過 5 個系列就該拆圖 |
| `dg-c-muted` | 灰 | 背景系列、對照組 |
| `dg-c-warn`／`dg-c-link`／`dg-c-ink` | 紅／藍／墨色 | 負值、外部、強調 |

系列色是刻意降飽和的，深淺色各有一組；焦點規則照舊：其他系列都退到 s1–s5 或 muted，只有一個 accent。

### 標記

| class | 用途 |
|---|---|
| `dg-bar`（`--soft` 變淡、`--hollow` 只留框） | 長條、甘特條、瀑布段、treemap 方塊 |
| `dg-plot-line`（`--thin`） | 折線、斜率圖、bump |
| `dg-plot-area` | 面積、雷達多邊形、ridgeline、streamgraph |
| `dg-point`（`--hollow`） | 散點、泡泡、蜂群、折線上的資料點 |
| `dg-flow` | 桑基的流帶 |
| `dg-grid` | 背景格線（虛線、最淡） |
| `dg-swatch` | 圖例色塊（要對應淡色或空心長條時，直接用同樣的 `dg-bar dg-bar--soft`／`--hollow` 小方塊） |
| `dg-text--series` | 文字跟著系列色（直接標在線尾的系列名） |
| `dg-heat-0`～`dg-heat-5` | 熱力圖格子，0 最淡、5 最深（綠色深淺）；格子裡一定要另外寫數字或符號，不能只靠顏色 |
| `dg-face dg-face--top`／`--left`／`--right`（加 `dg-face--accent`） | 等軸測方塊的三個面，光從左上來 |

**直接標註勝過圖例**：系列不多時，把系列名寫在線尾或長條旁（`dg-text--series`），比底部圖例好讀。

### 小零件

| class | 用途 |
|---|---|
| `dg-chip`（`--accent`、`--warn`） | 小標籤方塊：版本號、`×N` 副本數、PK／FK、WIP 上限、資料型別。寫 `rx="2"`，裡面放 `dg-tag` 或 `dg-sub` |
| `dg-outline--accent` | 疊在格子上的綠色外框，標出熱力圖、權限矩陣裡的焦點格（底色照原本的 heat 等級） |
| `dg-bubble` | 不透明的泡泡（淡色填滿＋系列色外框），配 `dg-c-*`，一個圓就夠，不用另外墊底 |
| `dg-text--ink` | 小字但要用主文字色（欄位名、成員名，跟灰色的型別區分） |
| `dg-text--on-heat` | 寫在 `dg-heat-4`、`dg-heat-5` 上的數字，深淺色都讀得到；`dg-heat-0`～`3` 用一般文字即可 |

`dg-tag` 原本給英文大寫小標，中文短標（「圖例」「變更清單」）也可以用。
