---
title: "手繪風 SVG 圖示的三條路：9 萬個免費圖庫、把 Lucide 弄歪的生成器，還有那張沒人看的授權頁"
date: 2026-08-05
type: deep-dive
category: tech
tags: [svg, icons, hand-drawn, open-source, licensing, developer-tools, mcp]
lang: zh-TW
tldr: "Koboyo 放出 92,967 個免費手繪 SVG，但授權頁明文禁止拿去做圖示庫或畫布 app。想要手繪感其實有三條路：收圖庫、用程式把既有幾何弄歪（sketchyicons 把 Lucide 的每條直線轉成二次貝茲，用 icon 名稱當亂數種子確保 byte-for-byte 一致）、或 AI 生成。這篇比較七家圖庫的規模與授權、拆解 sketchyicons 與 tldraw 的生成演算法，並整理正在往 MCP 靠的圖示搜尋工具。"
description: "從 Koboyo Icons 的 92,967 個免費手繪 SVG 切入，比較 Khushmeen、Streamline Freehand、Icons8 Doodle、Iconro 等圖庫的規模與授權差異，拆解 sketchyicons 的 seeded 座標偏移與 tldraw 的多 pass 疊描邊演算法，並盤點 icons0.dev、theSVG 等提供 MCP server 的圖示搜尋工具。"
draft: false
glossary:
  - term: "二次貝茲曲線"
    aliases: ["quadratic Bézier", "quadratic curve"]
    definition: "由起點、終點與一個控制點決定的曲線。控制點不在曲線上，而是把線段往它的方向「拉」出弧度。"
    definition_en: "A curve defined by a start point, an end point, and a single control point. The control point does not sit on the curve — it pulls the segment toward itself to create the bend."
    advanced: "SVG path 語法中對應 `Q` 指令。相對於三次貝茲（`C`，兩個控制點），二次貝茲只有一個控制點，參數少、算得快，很適合用來對大量既有直線段做批次微調。"
    advanced_en: "Corresponds to the `Q` command in SVG path syntax. Compared to cubic Bézier (`C`, two control points), a quadratic curve has only one control point — fewer parameters, cheaper to compute, and well suited to batch-perturbing large numbers of existing straight segments."
    context: "本文用它說明 sketchyicons 怎麼把 Lucide 的直線段變成有手感的弧線。"
    context_en: "This article uses it to explain how sketchyicons turns Lucide's straight runs into hand-drawn-looking arcs."
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape-en)

[Koboyo Icons](https://koboyo.com/icons) 現在掛著 92,967 個免費手繪風 SVG 圖示，免費商用、免署名、不用註冊。這個數字在免費圖庫裡是離譜的——[Streamline](https://www.streamlinehq.com/) 號稱業界最大的手繪集 Freehand 是 11,171 個，而且要錢。

但在下載之前值得先讀[授權頁](https://koboyo.com/icons/license)，因為那裡有一段話會直接決定你能不能用。

而且「我想要手繪感的圖示」在 2026 年其實不只有「去找一個手繪圖庫」這一個答案。這篇拆三條路：**收現成的圖庫**、**用程式把既有幾何弄歪**、**AI 生成**。第二條路的技術細節最有意思，也最少人講。

如果你要的是向量**動畫**而不是靜態圖示，站上另有一篇 [Text / Image to Lottie 全景導讀](/posts/ai/2026-06-09-text-image-to-lottie-open-source)；要 3D 資產的話是 [2026 做 3D 模型的工具地圖](/posts/ai/2026-07-27-3d-modeling-tools-landscape)。這篇補的是靜態 2D 向量這一塊。

```
你要什麼？
├── 覆蓋率最高，能接受授權限制 ────→ Koboyo（92,967）
├── 授權要最乾淨（CC0）───────────→ Khushmeen（400+）
├── 品質一致、願意付費 ───────────→ Streamline Freehand（11,171，$19/月起）
├── 已經在用 Lucide，想換個調性 ──→ sketchyicons（生成，MIT）
├── 要自己畫的東西也有手感 ───────→ Rough.js / tldraw 的做法
└── 給 AI agent 自己找圖 ─────────→ icons0.dev / theSVG（MCP）
```

## 第一條路：現成圖庫，真正的變數是授權不是數量

### Koboyo 那段容易漏掉的限制

Koboyo 授權頁的「You can't」寫得很白：

> Resell or redistribute the library (or any substantial part of it) as an icon collection, on a stock/marketplace site, or as a competing icon product, modified or not.
>
> Build a competing product with them, such as an icon library, or a canvas, whiteboard, diagramming, presentation or drawing app like koboyo.com.
>
> Bundle the icons into any app where they are the feature, or where users can pick, extract, download or re-share them.

第一條是所有圖庫都有的防轉售條款，沒問題。第二、三條才是重點：**做白板、圖表、簡報或繪圖 app 不能用**（Koboyo 本體就是一個[無限畫布](https://koboyo.com/)），而且**只要你的使用者能在你的 app 裡挑選圖示、抽取或下載，就踩線了**。

翻成人話：拿去當自己網站或產品的 UI 圖示，沒問題；做一個讓使用者挑圖示插到文件裡的編輯器，不行。這跟 CC0 的差距非常大，而它偏偏是免署名、看起來最沒有負擔的那一種授權文案。

授權頁對圖示來源的說法是「The icons are curated, corrected and organised by hand」——講的是整理校正的過程，沒有說明繪製方式。（實際瀏覽會看到大量系統性變體，例如同一個概念有 `drawn boldly` / `hand drawn loosely` / `at a slight angle` / `with a soft shadow` 四種版本，interface 分類則是 `A card of` / `A grid of` / `A list of` / `A panel of` 乘上 activity、calendar、comments 等等的笛卡兒積。這種命名結構通常來自批次生成，但這是我從命名模式的推論，官方沒有明說。）

### 七家的規模與授權

| 圖庫 | 數量 | 授權 | 要注意的地方 |
|---|---|---|---|
| [Koboyo Icons](https://koboyo.com/icons) | 92,967 | 免費商用免署名，**禁止競品與「圖示為主體」的 app** | 覆蓋率無敵，但用途邊界要自己判斷 |
| [Khushmeen Doodle Icons](https://khushmeen.com/icons.html) | 400+ | **CC0，免署名** | 授權最乾淨。附 Figma 檔與動畫版 |
| [Streamline Freehand](https://www.streamlinehq.com/icons/streamline-freehand) | 11,171 | 付費 $19/月起，或買斷；免費 set 需署名 | **每專案 100 個圖示的用量上限** |
| [Icons8 Doodle](https://icons8.com/icons/doodle) | 2,200（57 分類） | Freemium，免費需署名 | 彩色麥克筆風，偏簡報而非 UI |
| [Iconro Hand Drawn](https://iconro.com/icons/hand-drawn) | 1,010 | 免費商用，**強制回連署名** | 每個圖示頁內建顏色／描邊即時編輯器 |
| [doo-iconik](https://github.com/ajentik/doo-iconik) | 595 | 開源 | 打包成 15 種框架，含 Rails / Laravel / Flutter |
| [Duma Icons](https://duma-icons.dudych.cc/) | 451 | 免費 | SVG + React |

Streamline 的定位跟其他家不同：它是唯一由真人團隊長期維護的商業選項，[官方頁面](https://www.streamlinehq.com/icons/streamline-freehand)說 Freehand 建在 24px grid 上、「varying stroke thickness creates an artistic look」。要一整套風格一致到可以撐起產品的手繪圖示，這仍然是最穩的答案——代價是那個每專案 100 個的 allowance 上限，做大型設計系統前要先算清楚。

Khushmeen 則是另一個極端：只有 400 多個，但 **CC0、免署名、零限制**，還有 Figma 檔。[react-doodle-icons](https://github.com/agilek/react-doodle-icons) 把其中 439 個包成 MIT 授權的 React 元件，單一 icon 約 200 bytes。如果你的需求是「常用 UI 圖示換成手繪風」而不是「什麼冷門概念都要有」，這個組合的麻煩最少。

## 第二條路：不收圖，把幾何弄歪

這條路的前提反過來：**不去找手繪圖示，而是拿一套幾何嚴謹的圖示，用程式在渲染前把座標打亂**。好處是覆蓋率等於來源圖庫（Lucide 有 1,500+ 個）、授權跟著來源走、而且風格強度可以調參數。

### sketchyicons：拿 Lucide 的幾何，用名稱當種子

[sketchyicons](https://sketchyicons.com/) 有 1,500+ 個圖示，但它對自己的描述是「Nobody drew them」：

> A generator takes Lucide's geometry and bends every line, seeded per icon so your build and mine produce it byte for byte.

演算法是兩趟 pass，官網講得很清楚：

> Every straight run becomes a quadratic whose control point sits off the midpoint by a fraction of the run's own length. Then every coordinate moves. Both are seeded from the icon name, so the result is identical on every machine.

拆開來就三件事：

1. **每段直線變成一條二次貝茲曲線**，控制點從中點偏移，偏移量是**該線段自身長度的一個比例**——不是固定像素值。
2. **所有座標再整體位移一次**。
3. 兩趟的亂數都用 **icon 名稱當種子**，所以是 deterministic 的：同一個 icon 在任何機器、任何次 build 產出完全相同的 path data。

第 1 點的「按線段長度比例」是整個設計的關鍵，它讓緊湊的形狀自動收斂：

> A coordinate cannot wander further than the run it belongs to and still be that run, so tight shapes barely move. That is the point rather than a limitation: everybody knows exactly what a chevron looks like, so a shaky one reads as broken, while a feather can wander and still look deliberate.

這句話點出手繪風圖示真正的難處：**抖動要放在哪裡是有語意的**。chevron 抖了讀起來像壞掉，feather 抖了才像刻意。用比例而非絕對值當偏移上限，等於免費得到這個判斷。

另一個容易被忽略的實務問題是尺寸。sketchyicons 的規格是必須在 **15px** 撐得住：

> That is the size an interface actually uses inside a control, and it is where a wobbly stroke turns to mud. An icon that only reads at 24 is not finished.

這是很多手繪圖示集在 demo 頁好看、放進真實 UI 就糊掉的原因——demo 都是 48px 或更大。

授權上 sketchyicons 也交代得乾淨，官網頁尾寫著：geometry 衍生自 **Lucide 1.27.0（[ISC](https://lucide.dev/license)）**，[generator 與 npm packages 本身是 MIT](https://github.com/Fantomiald/sketchyicons)，並註明未獲 Lucide 背書。API 完全對齊 Lucide（`size` / `color` / `strokeWidth` / `absoluteStrokeWidth`），所以既有專案切換只要改 import 那一行。它按框架拆成獨立套件（`@sketchyicons/react` 492 B、`@sketchyicons/vue` 466 B、`@sketchyicons/data` 250 B），Vue 專案不會在依賴樹裡看到 React。

### tldraw：用 shape ID 當種子，兩趟疊描邊

同一個問題，[tldraw 在畫布上的解法](https://tldraw.dev/blog/engineering-imperfection-with-draw-shapes)更複雜，因為它的形狀會被使用者拖拉縮放——抖動必須**在變形之後仍然穩定**，否則每次 resize 圖形都在重新抽搐。

他們的做法同樣是找一個穩定的種子：

> Since every shape has a unique and stable ID, we can use this ID as the seed for the generator.

在這之上還加了兩層：

- **多趟疊描邊模擬墨水**：「we render each path multiple times, with each pass using slightly different random offsets」，每趟改一次種子，預設兩趟。單一條抖動的線看起來還是電腦畫的，疊兩趟才有筆尖壓過紙的厚度。
- **依轉角角度動態圓角**：「A sharp 90° corner needs significant rounding to look hand-drawn, and a corner closer to 180° needs far less.」尖角要大幅倒圓才像手畫，鈍角則幾乎不用——而且圓角量還要依線段長度 clamp，免得短邊被整個吃掉。

這兩個細節解釋了為什麼 [Excalidraw](https://github.com/excalidraw/excalidraw) 和 tldraw 的手繪感看起來「不假」，而很多同類工具只是加了一層抖動 filter。

### 這條路的地基：Rough.js

上面兩者的共同祖先是 [Rough.js](https://roughjs.com/)——小於 9 kB gzipped、MIT 授權，提供線、弧、多邊形、圓、以及 SVG path 的 sketchy 渲染，`roughness` 和 `bowing` 兩個參數直接控制潦草程度。Excalidraw 就是建在它上面，也是它的 sponsor。

同一位作者（Preet Shihn）還做了 [Wired Elements](https://wiredjs.com/)（MIT，GitHub 10,807 stars），把 Rough.js 包成一整套手繪風的 web components——button、input、slider 那些。官網那句話是這條路線的精神註腳：

> The elements are drawn with enough randomness that no two renderings will be exactly the same — just like two separate hand-drawn shapes.

值得注意的是它跟 sketchyicons / tldraw 的取捨方向相反：Wired Elements 刻意讓每次渲染都不同，適合 wireframe 和 mockup；而要進 production 的圖示則需要 deterministic，否則 diff 和快照測試會一直紅。

## 第三條路：AI 生成，目前最弱的一環

[Clearly](https://www.clearly.sh/free/svg-icons) 提供六種 style pack（line、filled、duotone、brutalist、hand-drawn、isometric），走 BYOK 模式——自己帶 Claude 或 OpenAI 的 API key，由模型直接寫出 SVG code。它對自己的定位講得很誠實：固定圖庫在「你需要一個 search-without-magnifier 這種領域特定圖示」時就沒轍了，生成才能補這一段。[Vexura](https://www.vexura.io/) 則是純線上工具，每天 3 個免費 credit。

但這條路現在的問題不是畫得像不像，而是**一致性**。圖示的價值有一大半來自「同一套裡每個 icon 的筆畫粗細、留白、視覺重量都一樣」，而逐個 prompt 生成天生就會漂移。Clearly 用 brand kit 想解這題（付費層），但目前沒有任何 AI 生成方案能達到 Streamline 那種一致度。

**比較實際的用法是混搭**：主體用固定圖庫或生成器保證一致性，只在缺特定概念時用 AI 補幾個。另外注意 Clearly 的授權分層——免費層輸出僅限個人用途，商用要 Pro。

## 順帶一提：圖示搜尋正在集體往 MCP 靠

查資料時最明顯的趨勢是，新一代的圖示聚合器全部在做 AI agent 入口：

| 服務 | 規模 | agent 介面 |
|---|---|---|
| [icons0.dev](https://icons0.dev/)（[i0](https://github.com/marcoripa96/i0)，MIT） | 223 個 collection、303k+ 圖示 | MCP server，4 個 tool |
| [theSVG](https://thesvg.org/) | 6,400+（其中 4,487 個品牌圖示） | MCP + Figma plugin + VS Code + Raycast |
| [IconVaultKit](https://iconvaultkit.com/) | 200,000+，92+ 個庫 | MCP + npm 套件 |
| [Iconstack](https://iconstack.io/) | 51,378 | API + MCP |
| [All SVG Icons](https://allsvgicons.com/) | 286,000+，220+ 個庫 | 網頁為主 |

其中 i0 的檢索設計值得單獨看：依其 [GitHub repo](https://github.com/marcoripa96/i0) 說明，它把 303k 個圖示的 SVG body 全部存進 Turso（libSQL），**FTS5 關鍵字檢索（porter stemming）與 DiskANN 向量索引平行跑，再用 RRF 融合**；embedding 是 `gemini-embedding-001` 的 256 維。這正好是站上 [Hybrid Search：BM25 + 向量 + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) 那套架構的一個具體應用——圖示搜尋其實非常吃這個組合，因為「一個表示『刪除但可復原』的圖示」這種查詢純關鍵字打不中，而「trash」這種精確詞又是純向量容易漂掉的。

實務上的意義是：如果你用 Claude Code 或 Cursor 寫前端，讓 agent 自己去 MCP 找圖示、直接產出 React 元件，比你切到瀏覽器搜尋再複製貼上快得多。

## 怎麼選

- **要授權最乾淨、不想讀條款** → [Khushmeen](https://khushmeen.com/icons.html)（CC0）
- **要覆蓋率最高，而且你的產品不是畫布／編輯器類** → [Koboyo](https://koboyo.com/icons)，但先確認使用者不能在你的 app 裡挑選或下載這些圖示
- **已經在用 Lucide** → [sketchyicons](https://sketchyicons.com/)，換一行 import
- **要做整套設計系統、風格一致度優先** → [Streamline Freehand](https://www.streamlinehq.com/icons/streamline-freehand)，先算每專案 100 個的上限夠不夠
- **要在自己的畫布／白板產品裡畫手繪圖形** → [Rough.js](https://roughjs.com/)，並參考 tldraw 的穩定種子與多 pass 做法
- **要讓 AI agent 自己找圖** → [icons0.dev](https://icons0.dev/) 或 [theSVG](https://thesvg.org/) 的 MCP server

最後一句提醒：這個題目最容易翻車的地方不是選錯風格，是**沒讀授權**。手繪風圖庫的授權離散度遠高於一般 UI 圖示集——同樣寫著「免費商用」，CC0、強制回連、禁止競品這三種的實際約束天差地遠，而它們的首頁看起來都一樣友善。

## 參考資料

- [Koboyo Icons](https://koboyo.com/icons) — 92,967 個免費手繪 SVG
- [Koboyo Icons 授權條款](https://koboyo.com/icons/license) — 禁止競品與「圖示為主體」app 的原文
- [Koboyo 無限畫布](https://koboyo.com/) — 圖庫所屬的本體產品
- [sketchyicons](https://sketchyicons.com/) — 1,500+ 個由 Lucide 幾何生成的手繪圖示，含演算法說明
- [sketchyicons GitHub](https://github.com/Fantomiald/sketchyicons) — generator 原始碼（MIT）
- [Lucide License](https://lucide.dev/license) — ISC，Feather 衍生的部分為 MIT
- [Engineering imperfection with draw shapes · tldraw](https://tldraw.dev/blog/engineering-imperfection-with-draw-shapes) — shape ID 當種子、多 pass 疊描邊、動態圓角
- [Rough.js](https://roughjs.com/) — sketchy 渲染函式庫（MIT，< 9 kB gzipped）
- [Wired Elements](https://wiredjs.com/) — 建在 Rough.js 上的手繪風 web components
- [Excalidraw](https://github.com/excalidraw/excalidraw) — 開源手繪風無限畫布
- [Khushmeen Doodle Icons](https://khushmeen.com/icons.html) — 400+ 個 CC0 手繪圖示
- [react-doodle-icons](https://github.com/agilek/react-doodle-icons) — Khushmeen 圖示的 MIT React 封裝
- [Streamline Freehand](https://www.streamlinehq.com/icons/streamline-freehand) — 11,171 個商業手繪圖示
- [Streamline 定價與授權](https://home.streamlinehq.com/pricing) — 每專案 100 個圖示的 allowance 說明
- [Icons8 Doodle](https://icons8.com/icons/doodle) — 2,200 個彩色塗鴉圖示
- [Iconro Hand Drawn](https://iconro.com/icons/hand-drawn) — 1,010 個需署名的手繪圖示
- [doo-iconik](https://github.com/ajentik/doo-iconik) — 595 個圖示，15 種框架封裝
- [Duma Icons](https://duma-icons.dudych.cc/) — 451 個手繪 SVG / React 圖示
- [Clearly](https://www.clearly.sh/free/svg-icons) — BYOK 的 AI SVG 圖示生成
- [Vexura](https://www.vexura.io/) — 線上 AI SVG 生成工具
- [icons0.dev](https://icons0.dev/) — 223 個 collection 的圖示搜尋
- [i0 GitHub](https://github.com/marcoripa96/i0) — FTS5 + 向量混合檢索與 MCP server 的實作
- [theSVG](https://thesvg.org/) — 6,400+ 個品牌與雲端架構圖示
- [IconVaultKit](https://iconvaultkit.com/) — 200,000+ 圖示聚合搜尋
- [Iconstack](https://iconstack.io/) — 51,378 個圖示，附 API 與 MCP
- [All SVG Icons](https://allsvgicons.com/) — 286,000+ 圖示、220+ 個庫
- [Text / Image to Lottie：AI 動畫生成工具全景導讀](/posts/ai/2026-06-09-text-image-to-lottie-open-source) — 向量動畫那一塊
- [2026 做 3D 模型的工具地圖](/posts/ai/2026-07-27-3d-modeling-tools-landscape) — 3D 資產那一塊
- [Hybrid Search：用 BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf) — i0 檢索設計的架構背景
