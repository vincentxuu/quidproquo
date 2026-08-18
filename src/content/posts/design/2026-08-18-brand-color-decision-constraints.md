---
title: "新產品的品牌色怎麼決定：從三個限制條件收斂，而不是從色票開始"
date: 2026-08-18
type: guide
category: design
tags: [brand-color, design-system, accessibility, wcag, design-tokens, product-design]
lang: zh-TW
tldr: "品牌色該在產品開頭就決定，但決策順序通常反了——不是先挑喜歡的顏色再檢查，是先用限制條件把選項收斂到剩三四個。三個限制：功能已佔走的色相、可及性的硬門檻、競品的差異位。其中第一個常被誤解：W3C 的 SC 1.4.1 明講，只要資訊「依賴使用者精確辨色」（規範自己舉的例子就是綠色代表有效、紅色代表無效），**不論對比多少都必須另加視覺指示**——所以避開紅綠不是解法，加圖示才是。另外 APCA 常被說成「WCAG 3 的演算法」，但現行草案寫的是「尚未決定」。"
description: "用三個可驗證的限制條件（功能佔用的色相、WCAG 對比門檻、競品差異位）把品牌色的選項收斂到能決定的數量，並說明 SC 1.4.1 對狀態色的真正要求、色盲盛行率數字的前提條件、APCA 與 WCAG 3 的實際關係，最後把定案的顏色鎖進 Tailwind v4 與 shadcn 的 token。"
draft: false
glossary:
  - term: "SC 1.4.1"
    aliases: ["Use of Color", "使用顏色"]
    definition: "WCAG 的成功準則之一（Level A）：顏色不能是傳達資訊、指示動作、提示回應或區分視覺元素的唯一手段。"
    definition_en: "A WCAG success criterion (Level A): color must not be the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
    advanced: "規範的註解區分兩種情況。若兩色除了色相不同、明度也差到對比 3:1 以上，明度差本身就算一項額外的視覺區隔；但若資訊「依賴使用者精確辨識某個顏色」（規範舉的例子是綠色外框代表有效、紅色代表無效），則不論對比多少都必須另加視覺指示。"
    advanced_en: "The criterion's notes draw a distinction. If two colors differ in hue *and* in lightness enough to reach a 3:1 contrast ratio, that luminance difference counts as an additional visual distinction. But where the information relies on the user accurately perceiving a particular color — the spec's own example is a green outline for valid versus red for invalid — an additional visual indicator is required regardless of the contrast ratio."
    context: "做答對／答錯、通過／失敗這類狀態回饋時，這條決定了你必須加圖示或文字，換色相解決不了。"
    context_en: "For correct/incorrect or pass/fail state feedback, this is the criterion that forces an icon or text label; changing the hue does not satisfy it."
---

> 🌏 [English version](/posts/design/2026-08-18-brand-color-decision-constraints-en)

要推一個新產品，品牌色是開頭就該定下來的東西。它會綁著 logo、OG 圖、app icon、宣傳素材一起走，之後要改，改的不只是一行 CSS。

問題不在「該不該現在決定」，而在**決定的順序通常是反的**：多數人先打開配色工具挑一個喜歡的顏色，再回頭檢查對比、檢查跟競品像不像、檢查狀態色會不會撞。這個順序會讓你在「已經愛上某個顏色」之後才發現它不能用，然後開始說服自己那些問題沒那麼嚴重。

反過來做比較省事：**先用限制條件把選項收斂到剩三四個，最後那一步才動用喜好。** 這篇講三個限制條件分別是什麼、怎麼驗，以及其中一個常被誤解到做錯方向的地方。

實作層（把定案的顏色接進 Tailwind v4 與 shadcn 的 token）在另一篇[設計資源網站盤點](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)裡。

## 限制一：哪些色相已經被功能佔走了

任何有「狀態」的產品——學習平台的答對答錯、監控台的正常異常、表單的有效無效——都會先把幾個色相分配給功能。使用者對這些配對的預期強到你改不動：綠是通過，紅是失敗。

常見的建議是「品牌色避開紅綠」。這個建議方向對，但它其實抓錯了規範真正要求的東西。

[W3C 的 SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)（Level A）本文只有一句：

> Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.

真正要讀的是它的兩則註解。第一則給了一條退路：

> If content is conveyed through the use of colors that differ not only in their hue, but that also have a significant difference in lightness, then this counts as an additional visual distinction, as long as the difference in relative luminance between the colors leads to a contrast ratio of 3:1 or greater.

也就是說，兩個顏色如果不只色相不同、明度也差到對比 3:1 以上，明度差本身就能算成第二個線索。

但第二則註解立刻把這條退路收回去，而且它舉的例子就是你的狀態色：

> However, if content relies on the user's ability to accurately perceive or differentiate a particular color an additional visual indicator will be required regardless of the contrast ratio between those colors. For example, knowing whether an outline is green for valid or red for invalid.

**「不論對比多少」。** 所以答對／答錯這種要求使用者精確辨色的資訊，規範的要求不是「換一個色相」，是**一定要有圖示或文字**。✓ 和 ✗、「答對了」和「再看一次」——沒有這個，換成藍色配橘色一樣不合格。

這件事改變了限制一的形狀：

- **必做**：狀態回饋一定要有非顏色的線索。這是 Level A，不是加分項。
- **仍然建議**：品牌色避開狀態色相。理由不再是可及性合規，而是**認知負擔**——當「送出」按鈕跟「答對」是同一種綠，使用者每次都要多花半秒判斷這抹綠在說什麼。這是體驗問題，不是合規問題，但它一樣值得避開。

分清楚這兩件事的意義是：如果你的品牌走 Duolingo 那條路、非綠不可，你不是不能做，你只是必須把圖示、位置、面積、動效的差異化做足。這條路走得通，只是工作量大。

## 限制二：可及性的硬門檻（這段是算出來的）

品牌色不是拿來看的，是拿來當按鈕、當連結、當焦點框。它得在四個位置都成立，每個位置都有數字：

| 位置 | 依據 | 門檻 |
|---|---|---|
| 按鈕背景配白字 | [SC 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 4.5:1 |
| 純文字連結配白底 | SC 1.4.3 | 4.5:1（大字 3:1） |
| 按鈕邊框、焦點框、圖示 | [SC 1.4.11](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html) | 3:1（對相鄰色） |
| 深色模式的對應版本 | 同上，重算一次 | 同上 |

這四格會刷掉很多「看起來很漂亮」的顏色。最典型的是中間調的鮮豔色——飽和的青綠、亮橘、中黃——當按鈕背景配白字過不了 4.5:1，配黑字又跟品牌調性不合。

實務上的處理方式不是放棄那個色相，而是**同一個色相準備兩個值**：一個亮的給大面積與品牌識別，一個暗的給文字與需要對比的地方。shadcn 的 token 模型本來就分得開（`--primary` 與 `--primary-foreground` 是一組），所以這不算額外工作。

順帶提醒一個容易誤讀的地方：SC 1.4.3 明文豁免 logo——「Text used as part of a logo or logotype is exempted from contrast requirements」。所以 logo 用了低對比的顏色不算違規，但**那個顏色一旦當成按鈕或連結用，豁免就沒了**。品牌色與 UI 主色可以是同一個，也可以刻意分開，這是你要有意識做的決定。

### 插曲：APCA 不是「WCAG 3 的演算法」

挑色工具很愛把 APCA（Advanced Perceptual Contrast Algorithm）寫成「更現代、取代 WCAG 2 的對比演算法」，[Radix Colors](https://www.radix-ui.com/colors) 就用它當對比目標。APCA 本身是認真的研究，但它的地位常被講得太滿。

[Adrian Roselli 在 2026 年 4 月整理過現況](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html)：APCA 早在 2023 年初就被標記從草案移除，而現行 WCAG 3 草案對比項的編者註寫的是「The contrast algorithm used in WCAG 3 is yet to be determined.」。APCA 作者 Andrew Somers 本人也在該文留言澄清：

> I want to be completely clear: APCA is draft guidance we are actively testing and evaluating. This is not a final standard, and no one should be calling it "WCAG 3".

實務結論：**要合規就用 WCAG 2 的 4.5:1 / 3:1 去驗**，那是現行標準也是各國法規引用的版本。APCA 可以拿來當第二意見（它對深色底上的細字判斷確實更接近實感），但不要拿它的通過當成合規證明。

## 限制三：競品的差異位

前兩個限制刪掉不能用的，第三個決定剩下的裡面選哪個。方法很土但有效，而且不需要美感：

1. 列出你所在類別的 10–15 個既有產品（含國內外）。
2. 打開每一家的首頁，用檢查工具取主要按鈕的背景色。
3. 把這些色相角度記下來，畫在一條 0–360 的線上。
4. 找**空白的那一段**。

做完你通常會看到色相高度集中——SaaS 擠在藍到靛之間，健康類擠在綠，金融擠在深藍。空白區就是你的機會，而且這是觀察結果不是品味判斷。

這一步也順便回答「我不懂設計怎麼辦」：你不需要懂，你只需要會數。

## 補一個常被引錯的數字

談狀態色時很常看到「8% 的男性有紅綠色盲」。這個數字大致對，但**它帶著前提**。

[美國國家眼科研究所](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness)寫的是「About 1 in 12 men have color vision deficiency」；[Colour Blind Awareness](https://www.colourblindawareness.org/colour-blindness/) 給的是男性約 1/12（8%）、女性約 1/200。但多數來源在引用時會漏掉一件事：這組數字通常指**北歐血統族群**，而盛行率在不同族群間差異不小。一份[北印度六個族群的研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC6150100/)在文獻回顧裡列出的男性盛行率就從利比亞 2.2%、沙烏地 2.9%、尼泊爾 3.9%、新加坡 5.3%、泰國 5.6%、韓國 5.9%，一路到約旦 8.7%、東印度 8.73%。

（Jennifer Birch 的 [Worldwide prevalence of red-green color deficiency](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-29-3-313)，JOSA A 2012，有專門一張台灣、韓國、新加坡的表——但正文在付費牆後，我只讀到摘要與表格標題，沒有取得數值，所以這裡不引用它的數字。）

實務上這不改變你要做的事——SC 1.4.1 是 Level A，不管盛行率是 3% 還是 9% 都得做。但寫規格或說服團隊時，把數字連著前提一起講，比丟一個「8%」更站得住。

## 收斂之後，最後一步才是挑

三個限制跑完，你手上通常剩三到四個候選色相。這時候才輪到喜好，而且有個很簡單的做法能避免「盯久了就覺得怪」：

**把候選色各套在真的介面上，截圖，隔天早上再看。** 不要當天決定。當天決定的品牌色，隔週有很高機率會想改。

「真的介面」是關鍵字——不是色票排排站，是主要按鈕、次要按鈕、連結、一張卡片、一個狀態回饋，全部渲染出來。[Realtime Colors](https://realtimecolors.com/) 這類工具就是幹這個的，或者直接在 [shadcn/create](https://ui.shadcn.com/create) 的預覽上比。

## 定案之後：鎖進 token，不要散在元件裡

顏色定了就立刻變成語意 token，而且**用途命名，不要用顏色命名**：

```css
:root {
  --primary: oklch(0.55 0.19 265);      /* 品牌色 */
  --primary-foreground: oklch(0.99 0 0);
  --correct: oklch(0.72 0.15 155);      /* 不要叫 --green */
  --correct-foreground: oklch(0.98 0 0);
  --incorrect: oklch(0.63 0.20 25);
  --incorrect-foreground: oklch(0.98 0 0);
}
.dark { /* 同一組，重新調值，不是把亮度反過來 */ }

@theme inline {
  --color-primary: var(--primary);
  --color-correct: var(--correct);
  --color-correct-foreground: var(--correct-foreground);
  /* 其餘照抄 */
}
```

兩件事值得強調：

- **`@theme inline` 那層不能漏。** Tailwind v4 只認 namespace，只寫 `:root` 的話 `bg-correct` 這個 class 不會存在。細節在[另一篇](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)。
- **叫 `correct` 不叫 `green`。** 之後要換色、做高對比模式、或補上圖示以外的第二線索，都只改一處。而依 SC 1.4.1，那個圖示是遲早要加的。

## 整體來說

品牌色確實該在新產品開頭就決定——但它是一個**收斂問題**，不是一個品味問題。先刪掉功能佔走的、刪掉過不了對比門檻的、刪掉跟競品撞的，剩下的裡面挑哪個，多半怎麼選都不會錯。

三個限制裡只有一個是必須遵守的規範（SC 1.4.1 與 1.4.3 / 1.4.11 的門檻），另外兩個是讓產品不至於平庸的工程。而最容易做錯方向的，是把「避開紅綠」當成無障礙的解法——規範要的從來不是換色相，是**顏色以外的第二個線索**。這件事你避開紅綠也還是得做。

## 參考資料

- [W3C — Understanding SC 1.4.1: Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C — Understanding SC 1.4.3: Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C — Understanding SC 1.4.11: Non-text Contrast](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [Adrian Roselli — WCAG3 Contrast as of April 2026](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html)
- [National Eye Institute — Color Blindness](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/color-blindness)
- [Colour Blind Awareness — About Colour Blindness](https://www.colourblindawareness.org/colour-blindness/)
- [Prevalence and gene frequency of color vision impairments among children of six populations from North Indian region](https://pmc.ncbi.nlm.nih.gov/articles/PMC6150100/)
- [Jennifer Birch — Worldwide prevalence of red-green color deficiency (JOSA A, 2012)](https://opg.optica.org/josaa/abstract.cfm?uri=josaa-29-3-313)（只讀到摘要，未取得全文）
- [Radix Colors](https://www.radix-ui.com/colors)
- [Realtime Colors](https://realtimecolors.com/)
- [shadcn/create](https://ui.shadcn.com/create)
- [shadcn/ui — Theming 文件](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS — Theme variables 文件](https://tailwindcss.com/docs/theme)
- 站內：[設計資源網站盤點：Tailwind v4 把 token 搬進 CSS 之後](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)
