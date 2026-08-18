---
title: "新產品的品牌色怎麼決定：從三個限制條件收斂，而不是從色票開始"
date: 2026-08-18
type: guide
category: design
tags: [brand-color, design-system, accessibility, wcag, design-tokens, product-design]
lang: zh-TW
tldr: "品牌色該在產品開頭就決定，但決策順序通常反了——不是先挑喜歡的顏色再檢查，是先用限制條件把選項收斂到剩三四個。三個限制：功能已佔走的色相、可及性的硬門檻、競品的差異位。文內附十類產品的色相佔用對照表（監控與地圖類佔最多，內容與社群類幾乎不佔）。第一個限制常被誤解：W3C 的 SC 1.4.1 明講，只要資訊依賴使用者精確辨色，**不論對比多少都必須另加視覺指示**——避開紅綠不是解法，加圖示才是。另外 APCA 常被說成「WCAG 3 的演算法」，但現行草案寫的是「尚未決定」。"
description: "用三個可驗證的限制條件（功能佔用的色相、WCAG 對比門檻、競品差異位）把品牌色的選項收斂到能決定的數量。含十類產品的色相佔用對照表、台股與歐美股市紅綠相反的跨市場案例、SC 1.4.1 對狀態色的真正要求、色盲盛行率數字的前提條件、APCA 與 WCAG 3 的實際關係，以及如何把定案的顏色鎖進 Tailwind v4 與 shadcn 的 token。"
draft: false
glossary:
  - term: "SC 1.4.1"
    aliases: ["Use of Color", "使用顏色"]
    definition: "WCAG 的成功準則之一（Level A）：顏色不能是傳達資訊、指示動作、提示回應或區分視覺元素的唯一手段。"
    definition_en: "A WCAG success criterion (Level A): color must not be the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
    advanced: "規範的註解區分兩種情況。若兩色除了色相不同、明度也差到對比 3:1 以上，明度差本身就算一項額外的視覺區隔；但若資訊「依賴使用者精確辨識某個顏色」（規範舉的例子是綠色外框代表有效、紅色代表無效），則不論對比多少都必須另加視覺指示。"
    advanced_en: "The criterion's notes draw a distinction. If two colors differ in hue *and* in lightness enough to reach a 3:1 contrast ratio, that luminance difference counts as an additional visual distinction. But where the information relies on the user accurately perceiving a particular color — the spec's own example is a green outline for valid versus red for invalid — an additional visual indicator is required regardless of the contrast ratio."
    context: "做答對／答錯、正常／故障、漲／跌這類狀態回饋時，這條決定了你必須加圖示或文字，換色相解決不了。"
    context_en: "For correct/incorrect or pass/fail state feedback, this is the criterion that forces an icon or text label; changing the hue does not satisfy it."
---

> 🌏 [English version](/posts/design/2026-08-18-brand-color-decision-constraints-en)

要推一個新產品，品牌色是開頭就該定下來的東西。它會綁著 logo、OG 圖、app icon、宣傳素材一起走，之後要改，改的不只是一行 CSS。

問題不在「該不該現在決定」，而在**決定的順序通常是反的**：多數人先打開配色工具挑一個喜歡的顏色，再回頭檢查對比、檢查跟競品像不像、檢查狀態色會不會撞。這個順序會讓你在「已經愛上某個顏色」之後才發現它不能用，然後開始說服自己那些問題沒那麼嚴重。

反過來做比較省事：**先用限制條件把選項收斂到剩三四個，最後那一步才動用喜好。** 這篇講三個限制條件分別是什麼、怎麼驗，以及其中一個常被誤解到做錯方向的地方。

限制的強度依產品類型差很多——監控台和地圖類幾乎沒得選，內容型和社群類整個色環都能用。所以限制一開頭會有一張對照表，先找到你的位置再往下走。

實作層（把定案的顏色接進 Tailwind v4 與 shadcn 的 token）在另一篇[設計資源網站盤點](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)裡。

## 限制一：哪些色相已經被功能佔走了

很多產品在你挑品牌色之前，已經先把幾個色相分配給功能了。使用者對這些配對的預期強到你改不動，所以第一步是**盤點你這一類產品佔走了幾個色相**——佔得多，你能選的就少；佔得少，整個色環都是你的。

### 先找到你在表上的位置

| 產品類型 | 被功能佔走的色相 | 剩下多少 |
|---|---|---|
| 測驗 / 學習 / 語言 | 綠（對）、紅（錯） | 多 |
| 監控 / DevOps / IT 維運 | 綠（正常）、黃或琥珀（警告）、紅（故障） | 少 |
| 金融 / 交易 / 看盤 | 紅與綠**都**被佔，且方向依市場反轉（見下） | 少 |
| 表單密集型（B2B SaaS、政府、保險） | 紅（錯誤）、黃（警告）、綠（成功） | 少 |
| 醫療 / 健康 / 檢測 | 紅（異常、急件）、綠（正常） | 中 |
| 電商 / 零售 | 紅或橘（促銷、限時、缺貨）、綠（有貨、已出貨） | 中 |
| 地圖 / 導航 / 物流追蹤 | 綠黃紅（路況）、藍（水域與路線） | 最少 |
| 內容 / 媒體 / 部落格 | 幾乎沒有 | 全部 |
| 設計 / 寫作 / 創作工具 | 幾乎沒有，但介面本身要退到背景去 | 全部（但要低飽和） |
| 社群 / 社交 | 幾乎沒有 | 全部 |

另外有三個色相是**不分類型都會被佔掉一部分**的，先扣掉再算：

- **紅**：破壞性動作（刪除、取消訂閱、終止）。shadcn 的 token 集本來就內建 `--destructive`，你不設計它也存在。
- **藍**：超連結。即使你的品牌是藍的，內文連結仍需與品牌色可區分。
- **黃 / 琥珀**：警示與「注意看這裡」。這個色相很難拿來當大面積品牌色，因為它當文字、當按鈕背景配白字幾乎都過不了對比門檻（見限制二）。

**如果你落在表格下半部**（內容型、工具型、社群），限制一對你幾乎不成立——直接跳到限制二，你的可選範圍會比多數人大很多。這不是壞消息，是你少了一層約束。

### 同一個色相，在不同市場意思相反

最值得注意的一格是金融類，因為它示範了一件多數配色指南不會講的事：**色相的語意不是全球統一的**。

台股市場的慣例是紅漲綠跌——[Yahoo 奇摩股市的說明頁](http://tw.help.yahoo.com/kb/SLN35897.html)直接寫著「台股市場紅色代表股票上漲，綠色代表股票下跌」。中國、日本同樣是紅漲。但歐美市場相反，綠是漲、紅是跌，這也是 Google Finance、Bloomberg 一類產品的預設。[BBC News 專門做過一支解釋這個差異的短片](https://www.bbc.com/news/av/business-33464903)。

實務含意有兩層。第一，如果你的產品跨市場，這組顏色不能寫死在元件裡，必須是可依地區切換的 token——這正好是[語意命名](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)派得上用場的地方（`--price-up` 而不是 `--green`）。第二，任何「紅＝負面」的通則在你決定品牌色時都要先確認適用範圍，別把單一文化的直覺當成常識。

### 然後是規範真正要求的東西

盤點完之後，常見的下一句建議是「品牌色避開被佔走的色相」。方向對，但它抓錯了規範真正要求的東西。

[W3C 的 SC 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)（Level A）本文只有一句：

> Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.

真正要讀的是它的兩則註解。第一則給了一條退路：

> If content is conveyed through the use of colors that differ not only in their hue, but that also have a significant difference in lightness, then this counts as an additional visual distinction, as long as the difference in relative luminance between the colors leads to a contrast ratio of 3:1 or greater.

也就是說，兩個顏色如果不只色相不同、明度也差到對比 3:1 以上，明度差本身就能算成第二個線索。

但第二則註解立刻把這條退路收回去，而且它舉的例子就是你的狀態色：

> However, if content relies on the user's ability to accurately perceive or differentiate a particular color an additional visual indicator will be required regardless of the contrast ratio between those colors. For example, knowing whether an outline is green for valid or red for invalid.

**「不論對比多少」。** 所以任何要求使用者精確辨色的資訊——答對答錯、正常故障、漲跌、有效無效、通過未通過——規範的要求不是「換一個色相」，是**一定要有圖示或文字**。✓ 和 ✗、▲ 和 ▼、「已通過」和「需修正」。沒有這個，你換成藍配橘一樣不合格。

這件事改變了限制一的形狀：

- **必做**：狀態回饋一定要有非顏色的線索。這是 Level A，不是加分項，而且跟你選什麼品牌色無關。
- **仍然建議**：品牌色避開被功能佔走的色相。理由不再是可及性合規，而是**認知負擔**——當「送出」按鈕跟「成功」是同一種綠，使用者每次都要多花半秒判斷這抹綠在說什麼。這是體驗問題，不是合規問題，但一樣值得避開。

分清楚這兩件事之後，有一條路重新開了：**如果你的品牌非用那個色相不可**（Duolingo 的綠、金融產品的紅），你不是不能做。你只是必須把圖示、位置、面積、動效的差異化做足——反正依 SC 1.4.1 那些圖示本來就得加。這條路成立，只是工作量大。

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

絕大多數類別跑完都會看到明顯的集中——同業互相參考久了就會這樣。空白區就是你的機會，而且它是量出來的，不是判斷出來的。

兩個提醒。第一，**相信你自己的量測，不要相信別人（包括我）對「你那一類通常是什麼顏色」的印象**，這種印象很容易來自幾個知名度高的樣本。第二，如果你落在限制一表格的下半部（內容型、工具型、社群），這一步的重要性會上升——你少了功能佔用那層約束，差異化就得靠這裡撐。

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

顏色定了就立刻變成語意 token，而且**用途命名，不要用顏色命名**。下面用限制一表格裡幾種產品各舉一組，你照自己的領域換掉名稱就好：

```css
:root {
  --primary: oklch(0.55 0.19 265);        /* 品牌色，所有產品都有 */
  --primary-foreground: oklch(0.99 0 0);

  /* 測驗類：--correct / --incorrect      不要叫 --green / --red   */
  /* 監控類：--healthy / --degraded / --down                        */
  /* 金融類：--price-up / --price-down    可依市場對調，見限制一    */
  /* 電商類：--in-stock / --sold-out / --promo                      */
  --healthy: oklch(0.72 0.15 155);
  --healthy-foreground: oklch(0.98 0 0);
  --down: oklch(0.63 0.20 25);
  --down-foreground: oklch(0.98 0 0);
}
.dark { /* 同一組，重新調值，不是把亮度反過來 */ }

@theme inline {
  --color-primary: var(--primary);
  --color-healthy: var(--healthy);
  --color-healthy-foreground: var(--healthy-foreground);
  /* 其餘照抄 */
}
```

三件事值得強調：

- **`@theme inline` 那層不能漏。** Tailwind v4 只認 namespace，只寫 `:root` 的話 `bg-healthy` 這個 class 不會存在。細節在[另一篇](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)。
- **叫 `healthy` 不叫 `green`。** 之後要換色、做高對比模式、或補上圖示以外的第二線索，都只改一處。而依 SC 1.4.1，那個圖示是遲早要加的。
- **跨市場的產品尤其需要語意命名。** `--price-up` 在台灣指向紅、在美國指向綠，是同一個 token 換值；如果當初寫的是 `--green`，你等於要把整套元件重寫一次。

## 整體來說

品牌色確實該在新產品開頭就決定——但它是一個**收斂問題**，不是一個品味問題。先刪掉功能佔走的、刪掉過不了對比門檻的、刪掉跟競品撞的，剩下的裡面挑哪個，多半怎麼選都不會錯。

收斂的力道依產品類型差很多。監控台、地圖、金融看盤這類，三個色相以上先被功能佔走，剩下的選擇少而明確；內容型、工具型、社群這類幾乎不受限制一約束，這時差異化的重量會全部壓到限制三，競品盤點那步就不能省。

三個限制裡只有一個是必須遵守的規範（SC 1.4.1 與 1.4.3 / 1.4.11 的門檻），另外兩個是讓產品不至於平庸的工程。而最容易做錯方向的，是把「避開紅綠」當成無障礙的解法——規範要的從來不是換色相，是**顏色以外的第二個線索**。這件事你避開紅綠也還是得做。

最後一個提醒，來自紅綠在台股與歐美股市意思相反這件事：**顏色的語意不是普世的。** 任何配色指南（包括這篇）給的通則，都要先確認它適用於你的使用者，而不是適用於寫指南的人。

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
- [Yahoo 奇摩股市說明 — 連漲連跌訊號顏色如何分辨？](http://tw.help.yahoo.com/kb/SLN35897.html)（台股紅漲綠跌的慣例）
- [BBC News — Red v Green: China's stock markets explained](https://www.bbc.com/news/av/business-33464903)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Realtime Colors](https://realtimecolors.com/)
- [shadcn/create](https://ui.shadcn.com/create)
- [shadcn/ui — Theming 文件](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS — Theme variables 文件](https://tailwindcss.com/docs/theme)
- 站內：[設計資源網站盤點：Tailwind v4 把 token 搬進 CSS 之後](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)
