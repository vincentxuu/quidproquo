---
title: "設計資源網站盤點：Tailwind v4 把 token 搬進 CSS 之後，哪些工具的輸出還能直接用"
date: 2026-08-18
type: deep-dive
category: tech
tags: [design-system, tailwindcss, shadcn-ui, design-tokens, licensing, developer-tools]
lang: zh-TW
tldr: "Tailwind v4 只認 namespace：顏色變數要叫 `--color-*` 才會生 utility。用這條規則去對帳，hextodesign 吐的 `--brand-500` 與 v3 `theme.extend` 兩種都接不上，它宣稱已發佈到 npm 的 `@halcyon/ui` 與 `@halcyon/tailwind` 在 registry 都回 404。真正對得上的是 shadcn 官方的兩層 token（`:root` + `@theme inline`）與 `shadcn/create` preset。靈感庫那邊 Mobbin 免費層只給「Latest 4」個 app，學生方案 $5/月才是能用的入口；Tailwind Plus $299 明文禁止拿它的元件做成 UI library。"
description: "從 Tailwind v4 的 theme namespace 規則出發，逐一對帳 2026 常見設計資源網站：色彩／token 產生器（hextodesign、tweakcn、Realtime Colors、Radix Colors）的輸出格式、UI 靈感庫（Mobbin、Landbook、Recent）的免費層真實限制、元件庫（Tailwind Plus、Aceternity）的授權邊界，以及字型授權與大廠設計系統一手文件的現況。"
draft: false
glossary:
  - term: "theme namespace"
    aliases: ["namespace", "主題命名空間"]
    definition: "Tailwind v4 用變數名的前綴決定它會生出哪一類 utility。`--color-*` 生顏色類、`--font-*` 生字體類、`--breakpoint-*` 生響應式變體。前綴不對，變數就只是普通 CSS 變數，不會產生任何 class。"
    definition_en: "In Tailwind v4, a theme variable's name prefix determines which family of utilities it generates. `--color-*` produces color utilities, `--font-*` font-family utilities, `--breakpoint-*` responsive variants. Get the prefix wrong and the variable is just an ordinary CSS custom property that generates no classes at all."
    advanced: "官方文件列了 20 個 namespace。namespace 也支援用 `--color-*: initial` 清空整組預設值，或用 `--*: initial` 清掉整份預設 theme，只留自訂值。"
    advanced_en: "The official docs list 20 namespaces. A namespace can also be cleared wholesale with `--color-*: initial`, or the entire default theme discarded with `--*: initial`, leaving only your own values."
    context: "本文用它當判斷標準：一個色彩產生器的輸出能不能直接用，先看變數名有沒有落在 namespace 內。"
    context_en: "This article uses it as the test: whether a color generator's output is directly usable comes down to whether its variable names land inside a namespace."
  - term: "OKLCH"
    definition: "一種以人眼感知為基礎的色彩表示法，用亮度（L）、彩度（C）、色相（H）三個值描述顏色。相較 HSL，改動色相時亮度不會亂跳，所以同一組色階看起來的深淺變化比較均勻。"
    definition_en: "A perceptual color notation describing a color by lightness (L), chroma (C), and hue (H). Unlike HSL, shifting the hue does not swing the perceived lightness, so a generated scale reads as evenly stepped."
    advanced: "Tailwind v4 的預設色盤改用 OKLCH，並藉此支援 P3 廣色域。代價是編輯時直覺較差——調整色相與彩度都會改變 WCAG 對比值，這是 HSLuv 之類的色彩空間不會發生的。"
    advanced_en: "Tailwind v4 ships its default palette in OKLCH, which also unlocks the P3 wide gamut. The cost is editing ergonomics: adjusting hue or chroma shifts the WCAG contrast ratio, which does not happen in spaces like HSLuv."
    context: "2026 年的 shadcn 主題產生器幾乎都以 OKLCH 為輸出格式，只吐 hex 或 HSL 的舊工具會跟預設色盤對不齊。"
    context_en: "By 2026 nearly every shadcn theme generator emits OKLCH; older tools that only speak hex or HSL no longer line up with the default palette."
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4-en)

要決定一個專案的設計系統，網路上不缺清單文——「10 個最好的配色工具」「設計師都在用的靈感網站」。這些清單通常只比較兩件事：好不好看、要不要錢。但實際把工具的輸出貼進專案時，會卡住的往往是第三件事：**它產出的東西，格式對不對得上你的建置流程**。

自 [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)（npm registry 記錄的 `4.0.0` 發佈時間是 2025-01-21，本文寫作時的 `latest` 是 2026-07-16 的 `4.3.3`）把主題設定從 `tailwind.config.js` 搬進 CSS 之後，這個「對不對得上」有了一條非常好驗的標準。這篇就用那條標準，把常見的設計資源網站逐一對一次帳。

站上另有一篇[手繪風 SVG 圖示的三條路](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape)，處理的是圖示這一格；這篇補的是色彩、字型、靈感庫與 token 產生器。

## 那條標準：v4 只認 namespace

v4 最常被轉述的一句是「不用 `tailwind.config.js` 了」。這句話沒錯但不完整——重點不是設定檔換位置，而是**變數名本身變成了 API**。

[Tailwind 的 theme variables 文件](https://tailwindcss.com/docs/theme)寫得很直白：

> Theme variables are defined in *namespaces* and each namespace corresponds to one or more utility class or variant APIs.

文件列了 20 個 namespace。顏色的是 `--color-*`，字體家族是 `--font-*`，字級是 `--text-*`，圓角是 `--radius-*`，斷點是 `--breakpoint-*`。定義 `--font-poppins: Poppins, sans-serif;`，你就得到 `font-poppins` 這個 class；定義 `--color-brand-500`，你就得到 `bg-brand-500`、`text-brand-500`、`border-brand-500` 一整組。

反過來說，一個變數叫 `--brand-500`，它就只是一個普通的 CSS 自訂屬性。你可以在 CSS 裡 `var(--brand-500)` 用它，但 Tailwind 完全不知道它存在，不會生出任何 utility。

這就是那條檢查點。看一個色彩產生器的輸出，不必先看配色好不好看：

```
它給你的是什麼？
├── @theme { --color-brand-500: ... }   → 直接可用
├── :root { --brand-500: ... }          → 只是 CSS 變數，不生 utility
├── theme.extend.colors 的 JS 物件      → v3 格式，v4 要靠 @config 才吃得到
└── 只有 hex 色票圖                     → 你自己轉
```

第三種不是不能用——v4 仍保留 `@config` 指令載入舊的 JS 設定檔，[官方 discussion #16803](https://github.com/tailwindlabs/tailwindcss/discussions/16803) 裡維護者也確認過這條相容路徑還在。但那是遷移用的橋，不是新專案該走的路。

## shadcn 的兩層 token，以及官方已經自己做了產生器

如果專案用 [shadcn/ui](https://ui.shadcn.com/)，情況再多一層。[官方 theming 文件](https://ui.shadcn.com/docs/theming)的預設 CSS 是這樣切的：語意變數放在 `:root` 與 `.dark`，然後**另外**用 `@theme inline` 把它們映射進 Tailwind 的 namespace：

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  /* ...共 31 個顏色 token */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
}
```

兩層的意義是：深色模式只要在 `.dark` 覆蓋 `--primary`，不必碰 `@theme`；而 `bg-primary` 這個 class 之所以存在，是因為 `@theme inline` 那行把它接進了 `--color-*`。要新增自訂 token（例如 `warning`），官方文件明講要**兩邊都寫**——`:root`/`.dark` 定義值，`@theme inline` 補上 `--color-warning: var(--warning);`——漏掉第二步，`bg-warning` 就不會存在。

這裡有個 2026 年才成立、但足以改寫整份工具清單的事實：**shadcn 官方自己做了視覺化主題產生器**。[shadcn/create](https://ui.shadcn.com/create) 讓你在頁面上選 Style、Base Color、Theme、Chart Color、標題字、內文字、Icon Library、Radius、Menu 與 Menu Accent，即時預覽，最後給你一組 preset 代碼（預設那組是 `--preset b0`）。CLI（npm 上的 `shadcn` 本文寫作時是 `4.18.0`）有一整組對應指令：

```bash
pnpm dlx shadcn@latest init --preset b5Kc6P0Vc   # 新專案帶著 preset 開
pnpm dlx shadcn@latest preset resolve            # 反推現有專案的 preset
pnpm dlx shadcn@latest apply --only theme,font   # 只套主題與字型到既有專案
pnpm dlx shadcn@latest migrate icons --from lucide --to tabler
```

`--only theme,font` 這個旗標很關鍵：它讓「換配色」變成一個可逆的、不動元件程式碼的操作。官方支援的 base color 有 Neutral、Stone、Zinc、Mauve、Olive、Mist、Taupe 七種，`components.json` 的 `style` 欄位現在長得像 `"base-nova"`。

結論很直接：**如果你的專案是 shadcn，第三方主題產生器在 2026 年已經從「必要」降級成「補強」**。它們仍有價值——逐變數微調、社群主題庫、從圖片生成配色——但「產生一整套 token」這件事，官方路徑更短也更不會走偏。

## 色彩／token 產生器：三個對得上，一個對不上

### tweakcn：目前最完整的第三方選項

[tweakcn](https://tweakcn.com/) 是開源的 shadcn 主題編輯器（Guillermo Rauch 與 shadcn 本人都公開推過）。[定價頁](https://tweakcn.com/pricing)寫得很清楚，免費層包含完整主題自訂、5 次 AI 生成主題、儲存與分享上限 10 個主題、用 CSS 變數匯入既有主題、以 CSS 變數或 **shadcn registry 指令**匯出，以及對比檢查器。Pro 是 $8/月，解鎖無限主題、無限 AI 生成、從圖片生成配色。

「用 registry 指令匯出」是它跟一般產生器的分水嶺——輸出的不是要你手動貼的一段 CSS，而是 `shadcn` CLI 直接吃得下的東西。

### Radix Colors：不是產生器，是現成的色彩系統

[Radix Colors](https://www.radix-ui.com/colors)（現由 WorkOS 維護）走的是另一條路：不幫你從品牌色生色階，而是直接給你 30 個調校好的色相，每個 12 階，外加黑白的 alpha 變體。每一階都有指定用途——背景、互動元件、邊框、實色、可讀文字——文字色保證通過對應背景的對比目標。

兩個技術取捨值得注意：它用 **APCA** 而不是 WCAG 2.x 的對比演算法，理由是 APCA 更貼近人眼實際感知；並且支援 P3 廣色域。深色模式的做法是在容器套一個 class 就換整組。

適合的情境：你沒有非用不可的品牌色，或者品牌色只用在少數強調處，其餘介面希望有一套經得起用的中性系統。不適合的情境：品牌規範要求整個介面都跟著企業識別色走。

### Realtime Colors 與 HueType：預覽型工具，以及一個要小心的陷阱

[Realtime Colors](https://realtimecolors.com/) 的價值在於它把你的顏色與字型直接鋪在一個成品版型上，而不是給你一排色票。它完全免費，FAQ 也把授權講清楚了：

> Yes! You can use the colors you generate here however you'd like, commercially or non-commercially (I don't own the colors/fonts). The license only applies to the source code and materials specific to this website.

[HueType](https://huetype.dev/) 是同一類，但版型更多——本文抓取時是 17 組預設、23 個版型（涵蓋 landing page、dashboard、pricing、blog、電商等），可匯出 CSS 變數、Tailwind config 或 design tokens。

這類工具有個容易踩的陷阱：**整個畫面就是預覽畫布**。你在 HueType 上看到的「Sarah Chen, Head of Design, Northwind」與頁尾的「182 Fictional Street, Sim City」不是這個產品的客戶見證與公司地址，那是示範版型裡的假資料。Realtime Colors 更乾脆，直接在自己的定價區標「This is just a generic section」、見證區標「What (imaginary) people are saying about this site」。人眼掃一下就知道，但如果你叫 AI agent 去「查一下這個工具多少錢、有哪些客戶」，它很可能把示範資料當成事實回報給你。

### hextodesign：宣稱與實際對不上的地方

[hextodesign](https://hextodesign.com/) 的賣點是「貼一個 hex，30 秒產生完整設計系統」。概念很好，但把它的輸出跟前面那條 namespace 標準對一次，有三處對不上。

**第一，變數名不在 namespace 內。** 它首頁即時輸出的 CSS 是這個形狀：

```css
:root {
  --brand-50:  oklch(0.96 0.030 286.0);
  --brand-500: oklch(0.563 0.200 286.0);
  --radius: 6px;
}
```

沒有 `--color-` 前綴，所以在 v4 專案裡這些不會生出任何 utility class。

**第二，Tailwind 範例是 v3 格式。** 同一頁展示的 Tailwind 產出是 `theme: { extend: { colors: { brand: { ... } } } }` 的 JS 物件，而 FAQ 宣稱「The Tailwind config works with v3 and v4」。嚴格說這句不算假——透過 `@config` 確實載得進去——但那是相容層，不是 v4 的原生寫法。

**第三，兩個「產生的」程式碼區塊色相不一致。** 上面那段 CSS 的色相是 286，同一頁的 Tailwind config 區塊寫的卻是 `oklch(78% .17 65)`，色相 65。同一次「生成」的兩個輸出不可能是不同顏色，這比較像行銷頁上的靜態範例，而不是即時產出。

還有一項更硬的：它的 Deliverables 區宣稱有 64 個「published to npm」的 React 元件，並給出安裝指令 `npm i -D @halcyon/tailwind`。查 npm registry，`@halcyon/ui` 與 `@halcyon/tailwind` **都回 404**。（scoped 套件設為私有也會回 404，但私有套件同樣不是訪客裝得起來的東西，指令照樣跑不動。）

定價也自相矛盾：頁面同時列出 Free / Starter $19 / Pro $39 / Studio $69 四層並標示各層功能差異，但四層全部被劃掉標成 Free「for early users」，FAQ 則寫「fully free right now. No signup, no payment, no limits」。要判斷未來哪些功能會收費，這頁給不出答案。

結論不是「不能用」——它的 W3C DTCG 格式 tokens.json 與 OKLCH 色階本身是有用的東西。結論是：**把它當色階靈感來源，不要當生產管線的一環**，而且別照著它的 npm 指令跑。

## UI 靈感庫：免費層限的不是次數，是新鮮度

### Mobbin

[Mobbin](https://mobbin.com/) 是真實 app 的截圖與流程庫，做競品研究時很難被取代。但它的[定價比較表](https://mobbin.com/pricing)有一格常被清單文略過：免費層的 Apps 與 Sites 都只給 **「Latest 4」**。不是「每月 4 次」，是只看得到最新的四個 app 與四個網站；flows、animations、搜尋結果與 app 歷史版本全部標 Limited，collections 上限 3 個。

也就是說，「先用免費版看看 Duolingo 怎麼做」這個常見建議，在 2026 的 Mobbin 上多半行不通——除非 Duolingo 剛好在最新四個裡面。Pro 是年繳 $10/月，Team 是年繳 $16/席/月。

真正值得知道的是[學生方案](https://mobbin.com/education)：在學期間 **$5/月**，用學校信箱與學生證驗證（官方說流程約 2 分鐘），拿到的是完整 Pro 權限——官方頁寫的是 1,000+ 個 app、149,900+ 個 flow、無限 collections。如果你或團隊成員符合資格，這是唯一能讓 Mobbin 真的可用又不貴的入口。

### Landbook

[Landbook](https://land-book.com/) 偏網頁與 landing page，強項是把 20,000+ 個網站再切成 200,000+ 個「區塊」（Hero、Pricing、Testimonial、Footer 等），卡在某一段版面時可以只看那一段。

它的定價有個容易記錯的地方：首頁寫「It's just $6 per month」，[定價頁](https://land-book.com/pro)卻寫 $9/月。兩個都對——**$9 是月繳，$6 是年繳（實收 $72/年）的等效月費**。免費層一樣是各面向 limited、boards 上限 3。

### Godly 已經改名為 Recent

不少 2026 年的清單文還在寫「godly.website」。這個網域還在，但抓下來的頁面標題已經是「Recent — Design Inspiration」，資產走 `cdn.recent.design`。內容取向沒變（偏實驗性、視覺強烈的網站），只是名字換了。

## 元件庫：真正的變數是授權

免費與付費的差別很好查，難查的是**你被允許拿它做什麼**。[Tailwind Plus](https://tailwindcss.com/plus/ui-blocks)（原 Tailwind UI）是這一類裡授權寫得最清楚的，值得當標竿讀。價格是單包 $149（Marketing／Application UI／Ecommerce 三選一）或全包 $299，一次付清、終身更新。

[授權頁](https://tailwindcss.com/plus/license)的「允許」相當寬鬆：無限 End Product、可交付給無限客戶、可用在賣錢的 SaaS、甚至可以用在原始碼公開的開源專案。但「不允許」那份清單值得逐條看：

> - Creating a repository of your favorite Tailwind Plus components, templates, or libraries (or derivatives of them) and publishing it publicly.
> - Creating a UI library using Tailwind Plus components, templates, or libraries and making it available either for sale or for free.
> - Converting a Tailwind Plus template to another framework and making it available either for sale or for free.
> - Creating a Figma or Sketch UI kit based on the Tailwind Plus component designs.
> - Creating a "website builder" project where end users can build their own websites using components, templates, or libraries included with or derived from Tailwind Plus.

用一句話總結官方自己的說法：「use Tailwind Plus for anything you like as long as it doesn't compete with Tailwind Plus.」實務上會踩線的三種情境是：把買來的元件整理成公司內部的共用 UI 套件並開源出去、拿它的設計做成 Figma kit、做讓使用者自己拼版面的產品。團隊授權上限是 25 位員工與約聘。

同一格的其他選項：[Magic UI](https://magicui.design/) 免費層是 MIT 開源，另有付費產品；[Aceternity UI](https://ui.aceternity.com/) 是免費核心加付費 All-Access。這兩家的具體金額我只查到二手來源（Aceternity 官方部落格自述付費側有 166 個 block 與 17 個 template，但沒直接列價），所以這裡不寫數字。[Subframe](https://subframe.com/) 情況更麻煩——官方 `/pricing` 直接 404，兩份二手資料對免費層的頁數上限一份說 3 頁、一份說 5 頁，我無法覆核，所以不當事實引用。

## 字型：分界線在「能不能再散佈」

[Google Fonts](https://fonts.google.com/) 絕大多數字型採 **SIL Open Font License 1.1**，可商用、可自架、可改。實務上唯一常見的疑問是自架要不要附授權文字，[SIL 官方社群的回覆](https://community.software.sil.org/t/ofl-license-requirements-for-self-hosting-google-fonts/3769)是：單純把字型當 webfont 用不需要，除非你另外把字型包當成可下載檔案散佈出去。

[Fontshare](https://www.fontshare.com/)（Indian Type Foundry）品質更整齊、更容易做出差異感，但用的是 ITF 自己的 Free Font License 而非 OFL——同樣可商用，但**不得轉售字型檔，也不得再散佈基於 ITF 設計的衍生字型**。

對絕大多數專案，這條差異碰不到。會碰到的是兩種情況：你想改造字型再發佈，或你的產品本身讓使用者下載字型資產。這兩種要回去讀原始授權，不要靠比較文。

## 決定設計系統，一手文件仍然是最好的材料

最後回到「決定設計系統」這件事本身。前面所有工具解的都是**執行層**——顏色怎麼生、元件從哪來。決定層的材料還是大廠自己寫的那幾份文件：[Material Design 3](https://m3.material.io/)（Google，開源；2026 I/O 主推 M3 Expressive，Android 端轉為 Compose-first）、[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)、[IBM Carbon](https://carbondesignsystem.com/)、[Shopify Polaris](https://polaris.shopify.com/)。它們的價值不在元件長什麼樣，而在**為什麼這樣切**——什麼時候該用 dialog 而不是 sheet、密度該怎麼分級、狀態該怎麼命名。

值得一提的是 Carbon 走在最前面：[Carbon MCP](https://carbondesignsystem.com/developing/carbon-mcp/overview) 已進入公開預覽，提供 `docs_search` 與 `code_search` 等工具，讓 Claude Code、Cursor 這類 coding agent 直接查詢設計系統的元件指引與程式碼範例，而不是靠模型記憶猜。這跟[圖示那篇](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape)觀察到的趨勢是同一條：設計資源正在從「人來瀏覽的網站」變成「agent 可查詢的結構化知識」。

（IBM 方面有人在 LinkedIn 宣稱搭配 Anthropic 模型可讓團隊「快 3.7 倍」。這是廠商說法，沒有公布可重現的測法，不列為事實。）

## 怎麼選

```
你要解決什麼？
├── 建立整套 token（專案是 shadcn）──→ shadcn/create + preset apply（官方路徑最短）
├── 建立整套 token（不是 shadcn）───→ 自己寫 @theme，色階可從產生器抄
├── 逐變數微調 / 社群主題庫 ────────→ tweakcn（免費層 10 個主題，Pro $8/月）
├── 不想自己配色，要中性系統 ──────→ Radix Colors（12 階 × 30 色相，APCA）
├── 想先看顏色鋪在真版面上 ────────→ Realtime Colors（免費）／HueType
├── 看真實 app 怎麼做 ───────────→ Mobbin（免費層只有 Latest 4；學生 $5/月）
├── 看網頁版面與區塊 ────────────→ Landbook（月繳 $9／年繳等效 $6）
├── 買現成元件 ─────────────────→ Tailwind Plus $149/包、$299 全包（不可再做成 UI library）
└── 決定系統該長什麼樣 ──────────→ Material 3 / HIG / Carbon / Polaris 一手文件
```

## 整體來說

這一輪盤點下來，最實用的一條不是任何一個網站，而是那個檢查點：**看它輸出的變數名有沒有落在 Tailwind 的 namespace 裡**。這一條可以在 30 秒內篩掉一半還停在 v3 心智模型的工具，而且不需要註冊、不需要試用。

第二條是圖示那篇也適用的老話：**授權比功能難查，但更容易讓你事後翻車**。Tailwind Plus 那份「不允許」清單、Fontshare 與 OFL 的差異、Mobbin 的「Latest 4」，都不在任何一篇「10 個最佳工具」裡面，但每一條都可能在你已經投入之後才浮出來。

最後一句自我提醒。這篇的起點，是我自己先用「免費、貼個 hex 就能起步」把 hextodesign 排在推薦清單第一位——查證之後才發現它的 npm 指令跑不動、Tailwind 範例是舊格式、定價頁自相矛盾。落差不在於那個工具爛，而在於**行銷頁看起來的完成度，跟輸出實際接不接得上，是兩個獨立的變數**。清單文之所以幫不上忙，正是因為它們只評估前者。

## 參考資料

- [Tailwind CSS v4.0 官方公告](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS — Theme variables 文件](https://tailwindcss.com/docs/theme)
- [Tailwind CSS Discussion #16803 — v4 的 tailwind.config.js 與 @config](https://github.com/tailwindlabs/tailwindcss/discussions/16803)
- [Tailwind Plus — UI Blocks 定價](https://tailwindcss.com/plus/ui-blocks)
- [Tailwind Plus — License](https://tailwindcss.com/plus/license)
- [shadcn/ui — Theming 文件](https://ui.shadcn.com/docs/theming)
- [shadcn/ui — CLI 文件](https://ui.shadcn.com/docs/cli)
- [shadcn/create](https://ui.shadcn.com/create)
- [tweakcn — 定價](https://tweakcn.com/pricing)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Realtime Colors](https://realtimecolors.com/)
- [HueType](https://huetype.dev/)
- [hextodesign](https://hextodesign.com/)
- [Mobbin — 定價](https://mobbin.com/pricing)
- [Mobbin for Education](https://mobbin.com/education)
- [Landbook PRO](https://land-book.com/pro)
- [Recent（原 Godly）](https://godly.website/)
- [Magic UI](https://magicui.design/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Google Fonts](https://fonts.google.com/)
- [Fontshare](https://www.fontshare.com/)
- [SIL 社群 — 自架 Google Fonts 的 OFL 要求](https://community.software.sil.org/t/ofl-license-requirements-for-self-hosting-google-fonts/3769)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Carbon MCP（公開預覽）](https://carbondesignsystem.com/developing/carbon-mcp/overview)
- [Shopify Polaris](https://polaris.shopify.com/)
- 站內：[手繪風 SVG 圖示的三條路](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape)
- 站內：[TailwindCSS：utility-first 不只是風格偏好](/posts/tech/2026-03-27-tailwindcss-utility-first-css)
- 站內：[shadcn/ui：不是套件，是複製貼上的元件原始碼](/posts/tech/2026-03-27-shadcn-ui-component-library)
