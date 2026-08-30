---
title: "Design System 配色系統導讀：從 Tailwind 到 Material 3，網站配色不用自己發明"
date: 2026-06-05
category: design
type: deep-dive
tags: [design-system, color, tailwindcss, oklch, accessibility, ui]
lang: zh-TW
tldr: "整理 7 個主流 design system（Tailwind、Radix、Material 3、Carbon、Ant Design、Primer、Apple HIG）的配色架構：色階怎麼切、neutral 怎麼選、dark mode 三種流派，以及為什麼新專案該用 OKLCH 而不是 HSL。"
description: "比較主流 design system 的色彩系統設計：Tailwind 的 50–950 色階、Radix Colors 的 12 階語意、Material 3 的 HCT tonal palette，加上 WCAG/APCA 對比標準與配色生成工具，做網站配色時可以直接借用。"
draft: false
---

> 🌏 [English version](/posts/design/2026-06-05-design-system-color-palettes-en)

做網站配色的真正難點從來不是「挑一個好看的顏色」，而是挑完之後的工程問題：hover 跟 disabled 的變化色怎麼推、灰階要幾層、文字對比夠不夠 WCAG、dark mode 要不要重調一輪。主流 design system 已經把這些問題各自解過一遍，這篇整理 7 套系統的配色架構與它們收斂出的共同模式，做新網站時可以直接借用，不用從零發明。

## 七大系統總覽

| 系統 | 色階結構 | Neutral 策略 | Dark mode |
|---|---|---|---|
| Tailwind CSS | 11 階（50–950）× 22+ 色相 | slate / gray / zinc / neutral / stone 多種灰 | 手動 `dark:` variant |
| Radix Colors | 12 階，每階有定義好的用途 | 純灰 + 帶色調灰（mauve、sand…） | 內建，換 class 即生效 |
| Material 3 | Tonal palette 0–100（13 tones） | Neutral + Neutral Variant 兩條 | 同一套 color roles 自動對應 |
| IBM Carbon | Gray 10–100 為骨架 | 灰階主導，藍是唯一 action 色 | 4 themes：White / Gray 10 / Gray 90 / Gray 100 |
| Ant Design | 12 基色 × 10 階 = 120 色 | 黑白 + alpha 透明度 | 另套 dark 演算法 |
| GitHub Primer | Neutral 0–13 雙向反轉 | 雙 neutral scale | scale 反轉讓 light/dark 共用 token |
| Apple HIG | 無數字色階，semantic 動態色 | systemGray–systemGray6 | 每色內建 light/dark + 高對比共 4 變體 |

幾個各自的亮點：

**Tailwind** 是最普及的「拿來就用」色票，50 最淺、950 最深，v4 起官方色值全面改用 OKLCH 定義。**Material 3** 走全自動路線：一個 source color 經過 HCT 色彩空間推導出 5 個 key colors，再展開成 tonal palettes，最後對應到 26 個 color roles，並支援標準、3:1、7:1 三級對比。**Carbon** 用灰階層疊（layering model）表達介面深度，彩色用得極省，企業感最重。**Ant Design** 提供從單一基色一鍵生成 10 階色板的演算法，品牌藍是 `#1677ff`，官方建議取色階第 6 格當 primary。**Primer** 把 light scale 從白開始排、dark scale 從黑開始排，兩個方向相反的 neutral scale 讓多數 token 不需要為 dark mode 另外覆寫。

## 所有系統收斂出的共同架構

七套系統表面差異很大，底層卻收斂到幾乎相同的結構：

1. **三層 token**：primitive（`blue-500`）→ semantic（`text-default`、`bg-danger`）→ component（`button-primary-bg`）。UI 元素永遠引用 semantic 層，換主題只動對應關係。
2. **數字色階**：50/100–900/950 的編號慣例由 Material Design 在 2014 年帶起，Tailwind 發揚光大；數字越大越深，950 這個半階是後來為了 dark mode 的細微背景差異補的。
3. **最小色彩集合**：1 個 primary + 1 條 neutral 灰階 + semantic 四色（success 綠 / warning 黃橙 / error 紅 / info 藍）。所有系統都是這個公式的變體。
4. **Primary 取中段**：品牌色放在色階中段（Tailwind 的 500/600、Ant 的第 6 格），確保往上有 tint、往下有 shade 可推 hover 與 active 狀態。
5. **Neutral 帶色調**：帶一點 hue 的灰（Tailwind 的 slate、Radix 的 mauve/sand）跟同色相的 accent 搭起來，會比純灰更和諧。

## Radix 的 12 階語意：最值得直接抄的部分

多數系統只告訴你「有 10 階」，Radix Colors 是唯一把**每一階的用途**都定義清楚的系統：

| 階 | 用途 |
|---|---|
| 1–2 | App 背景、subtle 元件背景 |
| 3–5 | UI 元件背景（normal / hover / active） |
| 6–8 | 邊框（6 非互動、7 互動、8 強邊框 + focus ring） |
| 9–10 | 實色背景（9 是整條 scale 中 chroma 最高的純色，拿來做按鈕主色） |
| 11–12 | 文字（11 低對比、12 高對比） |

這個對照表本身就是一套可以套在任何色相上的 mental model。一個細節：step 9 多數顏色設計給白色前景字，但 Sky、Mint、Lime、Yellow、Amber 例外，官方文件明確標注這五色要配深色文字。另外 Radix 官方文件直接寫明「Radix Colors are not intended to be customised」——色值是手工校過對比的，要客製品牌色該用它的 custom palette 工具另外生一條，而不是改現成的。

## 色彩科學：為什麼新專案用 OKLCH 不用 HSL

HSL 的 lightness 在不同色相下視覺亮度不一致——同樣 50% lightness 的黃色看起來遠比藍色亮，所以用 HSL 推色階每個色相都要手動修。OKLCH（Björn Ottosson 於 2020 年提出）是感知均勻的色彩空間：改 lightness 不會偏移 hue 和飽和度，等量的數值變化帶來等量的視覺變化。2023 年起所有主流瀏覽器原生支援 `oklch()`，並涵蓋 Display P3 廣色域。Evil Martians 的實務總結很直接：「Designers can define a formula, choose a few colors, and an entire design system palette is automatically generated.」Material 3 的 HCT 是 Google 自研的同類方案，特點是 tone 值直接對應對比度，這是 M3 能自動保證無障礙配色的基礎。

對比標準方面，WCAG 2.x AA 要求一般文字 4.5:1、大字（24px 或 18.66px 粗體以上）3:1、UI 元件與圖形 3:1；AAA 提高到 7:1。APCA 是 WCAG 3 的候選演算法，會考慮字級、字重與明暗極性，但目前還不是正式標準——Radix 已經率先用 APCA 來定它的文字對比目標。

## 實務上的三條路

**路徑一：直接用現成色票（最快）。** 用 Tailwind 就選 1 個 accent 色相 + 1 條灰（介面偏冷選 slate、偏暖選 stone）+ red/green/amber 做 semantic。用 Radix 就選 brand scale + 對應的帶色調灰 + semantic scales，照 12 階語意表套，dark mode 直接免費。

**路徑二：品牌色客製。** 已有指定品牌色時，丟進 [Radix custom palette 工具](https://www.radix-ui.com/colors/custom)或 [uicolors.app](https://uicolors.app/generate) 生成整條色階，再照原系統的階層語意使用。要 OKLCH 原生編輯與 easing 曲線控制可以用 [Atmos](https://atmos.style)。

**路徑三：全自動生成。** Material Theme Builder（Figma plugin）從一個 source color 生出整套 M3 color roles，適合想要「演算法保證無障礙」的情境。

另外有三個不綁 UI framework 的開源獨立色票：**Open Color**（13 色相 × 10 階，UI 最佳化的老牌經典）、**Reasonable Colors**（以無障礙對比為核心設計）、**Flexoki**（Obsidian CEO Steph Ango 做的墨水感配色，由 Oklab 推導、為螢幕閱讀校準，內容型網站的好選擇）。

## 風格取向對照

| 想要的感覺 | 參考 |
|---|---|
| 中性、現代、SaaS 感 | Tailwind（slate/zinc）、Radix |
| 企業、穩重、資料密集 | IBM Carbon、Ant Design |
| 鮮明、個人化 | Material 3 dynamic color |
| 開發者工具 | GitHub Primer |
| 內容、閱讀型網站 | Flexoki、Apple HIG 的 label 階層 |

## 整體來說

配色系統的核心取捨是「客製自由度」對「工程保證」：Tailwind 給你最大自由但對比與 dark mode 自己負責；Radix 犧牲客製空間換來每一階的語意保證與 APCA 對比；Material 3 把整件事交給演算法。做一般網站，最划算的組合是抄 Radix 的 12 階 mental model、用 Tailwind 或生成工具產色階、用 OKLCH 定義色值——三件事各取一家之長，配色就從美感問題變成查表問題。

## 參考資料

- [Tailwind CSS — Colors](https://tailwindcss.com/docs/colors)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Radix Colors — Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- [Material Design 3 — How the color system works](https://m3.material.io/styles/color/system/how-the-system-works)
- [IBM Carbon Design System — Color](https://carbondesignsystem.com/elements/color/overview/)
- [Ant Design — Colors](https://ant.design/docs/spec/colors)
- [GitHub Primer — Color usage](https://primer.style/product/getting-started/foundations/color-usage/)
- [Apple Human Interface Guidelines — Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Evil Martians — OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Section508.gov — Making Color Usage Accessible](https://www.section508.gov/create/making-color-usage-accessible/)
- [Open Color](https://yeun.github.io/open-color/)
- [Reasonable Colors](https://www.reasonable.work/colors/)
- [Flexoki](https://stephango.com/flexoki)
- [uicolors.app — Tailwind palette generator](https://uicolors.app/generate)
- [Atmos — color palette tool](https://atmos.style)
