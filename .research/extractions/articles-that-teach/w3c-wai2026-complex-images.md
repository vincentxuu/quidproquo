# 抽取紀錄：W3C WAI，Images Tutorial: Complex Images（網頁，Status: Updated 08 April 2026）

- 書目：W3C Web Accessibility Initiative（WAI），Education and Outreach Working Group（EOWG）編製。〈Complex Images〉，Images Tutorial 的一頁。編者 Eric Eggert、Shadi Abou-Zahra（L325–327）；其他貢獻者見 Acknowledgements 頁（L329–330）。頁尾標「Status: Updated 08 April 2026」（L323）。WAI-ACT 計畫支援、歐盟 IST Programme 共同資助（L332）。沒有 DOI。
- 取得網址：https://www.w3.org/WAI/tutorials/images/complex/（檔頭 L3 的 URL Source；經 Jina reader 轉成 Markdown）。這是出版者 W3C 自己公開的頁面，合法公開版本；頁尾註明 W3C 授權規則與「Permission to Use WAI Material」（L352–353）。
- 原文檔：`.research/raw/learning-content/q5-social/w3c-complex-images.md`，353 行、18,797 字元（`wc -lc` 實查；最後一行無換行，Read 顯示到 L353）。
- 讀取日期：2026-10-14
- 版本：網頁現行版（2026-04-08 更新）。性質是 W3C 的「最佳實務教學」，不是規範文件：頁面自述「These tutorials provide best-practice guidance」（L306）。
- 供：order 23（誰讀不到這篇文章）

## 研究設計

不是研究，是標準組織的實作教學。沒有受試者、沒有資料。內容是：複雜圖片的定義、長描述的寫法原則、兩個範例（長條圖、孔雀頭照片）與四種 HTML 標記做法的程式碼與取捨。

## 結果（逐項：可引用的主張）

| # | 主張 | 所在節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 複雜圖片的定義：含有短語或一句話講不完的大量資訊 | Overview | L105 | 「Complex images contain substantial information – more than can be conveyed in a short phrase or sentence.」 |
| 2 | 典型三類：圖表（含流程圖、組織圖）；正文仰賴讀者看懂的示意圖與插圖；地圖 | Overview | L107–109 | 「graphs and charts, including flow charts and organizational charts; diagrams and illustrations where the page text relies on the user being able to understand the image; maps showing locations or other information such as weather systems.」 |
| 3 | 要用兩段式文字替代：短描述（辨識圖片，必要時指出長描述在哪）＋長描述（圖片傳達的必要資訊的文字版） | Overview | L111 | 「In these cases, a two-part text alternative is required. The first part is the short description to identify the image and, where appropriate, indicate the location of the long description. The second part is the long description – a textual representation of the essential information conveyed by the image.」 |
| 4 | 有時圖的構成本身也要寫進長描述，例如長條圖的顏色順序與柱子相對高度，不只數值與趨勢 | Long descriptions | L125 | 「the sequence of colors used and the relative heights of the columns in a bar chart may be relevant information about the structure of the chart, in addition to the actual values and trends that it depicts.」 |
| 5 | 複雜圖片對很多人都難懂，特別是低視能、學習障礙、領域經驗少的人；建議把長描述開放給所有人，例如放進正文 | Long descriptions | L127 | 「Complex images can be difficult to understand by many people – especially those with low vision, learning disabilities, and limited subject-matter experience. Make long descriptions available to everyone to reach a wider audience with your content. For example, show the description as part of the main content.」 |
| 6 | 也可以減少圖片不必要的複雜度，讓所有人都更好懂 | Long descriptions | L127 | 「It may also be possible to reduce unnecessary complexity in your images and make them easier to understand for everyone.」 |
| 7 | 好做法：在伴隨的正文裡提到並摘要複雜圖片，指出圖要呈現的重點 | Long descriptions | L129 | 「It is also good practice to refer to and summarize more complex images from the accompanying text. For example, a reference such as "The following graph shows that visitors were lost in the first quarter, but the numbers recovered in the second quarter" helps to point out the relevant information that the image is intended to present.」 |
| 8 | 範例一：長條圖的短描述放 alt；長描述含刻度、數值、關係與趨勢（例如 site 1 下降、site 2 持平、site 3 上升） | Example 1 | L133–137 | 「The long description provides detailed information, including scales, values, relationships and trends that are represented visually.」 |
| 9 | 做法一：圖旁放文字連結到長描述（另頁或同頁一節）；連結文字要說清楚目的地並與圖對應。所有瀏覽器與輔助科技都支援、對所有人可見，但連結和圖沒有語意關聯 | Approach 1 | L150、L164 | 「All web browsers and assistive technologies support this approach. The long descriptions are available to everyone, including search engines and other programs. However, the link is not associated with the image in a semantic way.」 |
| 10 | 做法一的語意版：用 `<figure role="group">` 與 `<figcaption>` 把圖與連結綁在一起 | Approach 1 子節 | L168–196 | 「The HTML5 <figure> and <figcaption> elements can be used to group image and link semantically.」 |
| 11 | 做法二：長描述在同頁時，可在 alt 裡寫出它的位置，位置資訊要清楚準確 | Approach 2 | L205–209、L217 | 「The location information needs to be clear and accurate to help users locate the content.」 |
| 12 | 做法三：用 `<figure>` 包住圖與長描述，長描述（標題、文字、表格）放在 `<figcaption>` | Approach 3 | L226–263 | 「The long description (presented as headings, text, and a table) is wrapped in the <figcaption> element.」 |
| 13 | 範例二：`aria-describedby` 指向同頁任一元素當描述；但被指向的內容會被當成一段連續文字，標題與表格等結構會遺失，所以只適用純文字的長描述 | Example 2 | L268–282 | 「The element referenced by aria-describedby is treated as one continuous paragraph of text. Screen readers and other assistive technology do not have access to structural information, such as any headings and tables. ... As a result, this approach only works for long descriptions that are text-only」 |
| 14 | 頁面自稱提供最佳實務，並列出相關 WCAG 資源；這一頁實際列出的只有 Technique C22（用 CSS 控制文字呈現），沒有列成功準則 | Related WCAG resources | L304–310 | 「These tutorials provide best-practice guidance on implementing accessibility in different situations.」「C22: Using CSS to control visual presentation of text」 |

## 作者自己列的限制

頁面沒有限制段。唯一的取捨說明是各做法的優缺點（#9 的「連結沒有語意關聯」、#13 的「aria-describedby 會丟掉結構」）。

## 與摘要說法不一致的地方

網頁沒有摘要。Overview 段的「two-part text alternative is required」用了 required，但頁面自述性質是 best-practice guidance（L306），「Related WCAG resources」也沒有列出任何成功準則（只列 C22，且 C22 與長描述無直接關係）。所以「required」是教學頁的用語，不是本頁引用的 WCAG 條文要求。引用時不要寫成「WCAG 規定複雜圖片必須有長描述」；要寫 WCAG 條文得去讀 1.1.1（批次 F23a）。

## 與清單「要撐的結論」不合的地方

清單：「複雜圖片要短描述加長描述」。撐得住（#3，L111），但要補兩點：
1. 出處是 WAI 的教學頁，性質是最佳實務，不是規範（見上節）。
2. 頁面不只說「給螢幕閱讀器的替代文字」，還主張把長描述給所有人看、放進正文（#5），以及正文要主動提到並摘要圖的重點（#7）——這兩點對「教學文章怎麼寫」比「短＋長描述」更直接相關，且對象明寫包含學習障礙與領域經驗少的讀者。

## 讀取紀錄

- 依序讀 L1–98（頁首導覽與網站選單，雜訊）、L99–122（標題、Overview、頁內目錄）、L123–129（Long descriptions）、L131–264（Example 1 與三種做法）、L266–302（Example 2）、L304–313（Related WCAG resources、上下頁）、L315–353（意見回饋、狀態、編者、頁尾）。涵蓋 L1–353 全文。
- 沒有表格。範例長描述另頁（https://www.w3.org/WAI/tutorials/images/examples/long-description/）不在本檔，沒有讀。
