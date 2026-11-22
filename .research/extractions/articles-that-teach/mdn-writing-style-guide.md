# 抽取紀錄：MDN Web Docs，Writing style guide（社群文件的寫作規範頁）

書目：MDN contributors，〈Writing style guide〉，MDN Web Docs › MDN › Writing guidelines。沒有個人署名；頁尾「This page was last modified on Sep 10, 2026 by MDN contributors」（L912）。沒有 DOI。
網址：https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide
原文檔：`.research/raw/learning-content/q1-learner/mdn_writing_learn.txt`（915 行、53,407 位元組）；同目錄有 `mdn_writing_learn.html`（227,758 位元組，原頁）。同目錄另有 `mdn_learn.txt`（5,443 位元組），是另一頁，不在本批範圍，沒讀。
讀取日期：2026-10-14
版本：2026-10-13 存下的網頁文字版，頁面自標最後修改 2026-09-10。
供哪幾篇使用：order 12（先備知識）。
文件性質：開放社群文件站給投稿者的寫作規範，**不是研究**。全頁沒有引用任何研究；末尾「Further reading」列的是其他風格指南與英文用法書（L885–901）。

## 研究設計

不適用。頁面結構（依序）：前言（L9–18）→ General writing guidelines 七個小節（L20–224）→ Writing style 十一個小節（L226–546，縮寫、大小寫、縮約、數字、複數、引號、逗號、連字號、拼字、術語、語態）→ Page components 十一個小節（L548–869，程式範例、交叉引用、外部連結、短網址、標題層級、圖片、清單、See also、子頁、slug、標題）→ See also 與 Further reading（L871–901）。

與「教學文怎麼寫」有關的內容集中在 General writing guidelines 與 Page components 的 Code examples、Heading levels、Lists、Titles；Writing style 那一大段是英文標點、拼字與格式規定，與教學設計無關，下面只記有關的條目。

## 結果（逐項）

這裡列的是「規範要求了什麼」，不是研究發現。

### 讀者與先備知識

| # | 規定 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 1 | 規範的整體目標：頁面要含讀者理解該主題可能需要的所有資訊 | General writing guidelines | L22 | 「The goal is to write pages that include all the information that readers may need for understanding the topic at hand.」 |
| 2 | 心裡要有目標讀者；進階主題的頁面不必像一般頁面那樣細講基礎概念 | Consider your target audience | L40 | 「a page on advanced network techniques likely doesn't need to go into as much detail about basic networking concepts as the typical page on networking.」 |
| 3 | 同一段緊接著說這些只是指引，不一定每個情況都適用 | 同上 | L40 | 「Keep in mind that these are guidelines. Some of these tips may not apply in every case.」 |
| 4 | 新術語在使用前先定義，並考慮目標讀者（原文此句有漏字） | Three Cs／Clear | L46 | 「Define new terms, keeping the target audience in, before using them.」 |
| 5 | 寫多少要拿捏：細節過多，頁面讀起來乏味而且很少被用 | Three Cs／Concise | L48 | 「If you provide excessive detail, the page becomes tedious to read and it will rarely be used.」 |
| 6 | 第一個標題之前的開頭段落要摘要本頁涵蓋什麼，「也許」再說讀者讀完能做到什麼，讓讀者很快判斷這頁是否與自己有關 | Provide a descriptive introduction | L61 | 「This way a reader can determine quickly whether the page is relevant to their concerns and desired learning outputs.」 |
| 7 | **guide 或 tutorial 的開頭段落要告知會涵蓋的主題，以及預期讀者具備的先備知識（如果有）** | 同上 | L63 | 「In a guide or tutorial, the introductory paragraph(s) should inform the reader about the topics that will be covered as well as the prerequisite knowledge the reader is expected to have, if any.」 |
| 8 | 開頭段落還要提到所談的技術或 API 並連到相關資訊，並提示本文內容在什麼情況下有用 | 同上 | L63 | 「The opening paragraph should mention the technologies and/or APIs that are being documented or discussed, with links to the related information, and it should offer hints to situations in which the article's contents might be useful.」 |
| 9 | 開頭太短、太長、適中的三個示範（都以 `strokeText()` 參考頁為例）：太短的只有一句；太長的把其他方法與屬性也講進去；適中的兩句定義加一句「更多細節見某頁」 | 同上 | L65–95 | 「Instead, the introduction should focus on the strokeText() method and should refer to the appropriate guides where the other details are described.」 |
| 10 | 首次出現、讀者可能不熟的縮寫要展開；拿不準就展開，更好是連到說明該技術的文章或詞彙表條目 | Abbreviations and acronyms | L256 | 「When in doubt, expand the term. Better yet, link it to the article or glossary entry describing the technology.」 |

### 範例與程式碼

| # | 規定 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 11 | 一般而言要加範例或真實情境，讓概念性與程序性資訊更具體 | Include relevant examples | L54 | 「This helps readers to understand conceptual and procedural information in a more tangible and practical way.」 |
| 12 | 用範例說明每個參數的用途與邊界情況；也可示範常見任務與可能出現的問題的解法 | 同上 | L56–57 | 「You should use examples to clarify what every parameter is used for and to clarify any edge cases that may exist.」 |
| 13 | 每段範例程式要有三樣：一個 h3 標題說明示範的情境、程式前的簡短描述（指出要讀者留意什麼）、程式後的結果說明（結果是什麼、程式怎麼運作） | Code examples | L578–584 | 「Result explanation: An explanation after the example code that describes the result and how the code works.」 |
| 14 | 範例不只示範語法，還要點出用途與什麼情況下會需要 | Code examples | L586 | 「the code example should not only demonstrate the syntax of the feature and how it is used, but also highlight the purpose and situations in which a web developer might want or need to use the feature.」 |
| 15 | 大段範例程式可拆成較小的邏輯段落分別說明 | Code examples | L588 | 「it may make sense to break it up into smaller logical parts so that they can be described individually.」 |
| 16 | （出現在 SEO 小節）每個範例前要有概述：範例做什麼、理解它可能需要哪些額外知識；範例後或穿插其間要解釋程式怎麼運作；不要省略錯誤處理，因為讀者會複製貼上到正式站 | Write with SEO in mind／Add examples | L214 | 「Each example should be preceded with an overview of what the example will do, what additional knowledge might be needed to understand it, and so forth.」 |
| 17 | （同在 SEO 小節）範例應涵蓋所有參數，或至少涵蓋初學到中階使用者可能用到的，加上需要額外解釋的進階參數 | 同上 | L214 | 「at least the parameters (or properties, or attributes) that users from the beginner-through-intermediate range are likely to use」 |
| 18 | （同在 SEO 小節）常見使用情境要明寫成一節，不要假設讀者自己會想到 | Explain use cases | L216 | 「Instead of assuming that a user will figure out that the method being documented can be used to solve a common development problem, actually add a section about that use case」 |
| 19 | （同在 SEO 小節）範例說明的詳細程度要配合主題複雜度與目標讀者 | Add descriptions for examples | L198 | 「in an appropriate level of detail given the complexity of the topic and the target audience」 |

### 結構與順序

| # | 規定 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|
| 20 | 先講簡單概念再講複雜進階的；先講概念性資訊再講行動導向的主題 | Titles／General guidelines | L849 | 「Cover simple concepts first and then go on to more complicated and advanced concepts. Cover conceptual information first and then move on to action-oriented topics.」 |
| 21 | 標題層級不超過三層（##、###、####）；想加第四層時考慮拆成數篇較小的文章加一個入口頁，或改用條列 | Heading levels | L675–678 | 「If you feel the need for adding the fourth header level, consider breaking up the article into several smaller articles with a landing page.」 |
| 22 | 不要標題緊接子標題而中間沒有文字 | Heading levels | L687–688 | 「leaves readers without any explanatory text at the beginning of the outer section.」 |
| 23 | 標題之後加引導文字說明這一節會講什麼 | Titles | L869 | 「After a title, add some introductory text to explain what will be covered in the section.」 |
| 24 | 標題要具體（用「HTML elements」，不用「Introduction」「Overview」）、只講一件事（盡量不用 and） | Titles | L859–861 | 「use the title "HTML elements" instead of "Introduction" or "Overview".」 |
| 25 | 編號清單主要用來列步驟；清單前要有標題或短段落交代脈絡，清單後接一小段收尾說明預期結果；一步一項 | Lists | L732–747 | 「It's important to provide the user with context before beginning the instructions.」 |
| 26 | 一個主題有多篇文章時，建入口頁，開頭一兩段介紹主題，再列出子頁與各頁說明 | Subpages | L809–810 | 「The landing page should open with a paragraph or two describing the topic or technology, then provide a list of the subpages with descriptions of each page.」 |
| 27 | 不用「above／below／here」這類方位詞指涉頁內位置，改用章節標題或描述 | Use accessible language | L153–169 | 「Refer to sections by their titles or headings, and refer to examples or code snippets by what they demonstrate or contain.」 |
| 28 | 頁面不要短於約 300 字（理由是搜尋引擎收錄，不是學習效果） | Write with SEO in mind | L202 | 「ensure that pages on MDN Web Docs are not shorter than around 300 words or so.」 |

其餘沒有逐條列的段落（都讀過）：包容性用語與性別中立（L97–149）、SEO 的頁面相似度與關鍵字（L181–224 其餘部分）、縮寫與拉丁縮寫表（L252–339）、大小寫（L341–364）、縮約（L366–368）、數字與日期（L370–400）、複數（L402–408）、引號（L410–416）、逗號（L418–490）、連字號（L492–498）、拼字與 cSpell（L500–517）、術語（L519–541）、語態（L543–546）、交叉引用格式（L594–614）、外部連結的取捨（L616–662）、短網址（L664–670）、圖片（L690–700）、See also 的格式（L749–805）、slug（L825–833）。

頁面沒有談到的事（讀完全頁確認）：沒有規定先備知識要寫成清單或放在特定區塊；沒有說先備知識要連到哪裡；沒有談怎麼處理程度不同的讀者同時讀一頁；沒有任何一條附上效果的證據。

## 作者自己列的限制

- 內容比格式重要，不必先學完整份規範才投稿（L13）。
- 語言相關的規定主要適用英文文件，其他語言可以自訂（L16）。
- 「Consider your target audience」一節自己說這些是指引，不一定每個情況都適用（L40）。

## 與摘要說法不一致的地方

頁面沒有摘要，只有開頭一句定位（L11：「describes how content should be written, organized, spelled, and formatted on MDN Web Docs」）。與正文逐節對過，沒有不一致。

一個值得記下的內部落差：與教學寫法最相關的幾條（範例前要交代「理解它可能需要哪些額外知識」、要寫使用情境）放在「Write with SEO in mind」小節底下，理由框成「頁面不要太短」，不是框成教學考量（L204–216）。引用時要照實說它出現在 SEO 小節。

## 與清單「要撐的結論」不合的地方

清單寫：「實務做法：教學文開頭要寫明先備知識與涵蓋範圍」。

- 撐得住，出處是 L63 一句。
- 要保留的精確度有三點：(1) 原文適用對象是「a guide or tutorial」，不是所有頁面；(2) 先備知識後面有「if any」，是「有的話才寫」；(3) 原文說的是寫在「introductory paragraph(s)」裡，沒有要求列成清單或獨立區塊。
- 整頁談先備知識的就這一句，加上 L214 談範例前要交代額外知識的半句。把它說成「MDN 的規範花了篇幅談先備知識」會言過其實。
- 這一頁只能當「MDN 這樣規定」的出處，不能當「這樣做有效」的證據。

## 讀取紀錄

- L1–18：頁首與前言。
- L20–95：General writing guidelines 開頭、目標讀者、三個 C、範例、開頭段落（含三個示範）。
- L97–179：包容性用語、無障礙用語。
- L181–224：SEO。
- L226–546：Writing style 全部十一小節（含 L288–320 拉丁縮寫表，三欄七列，文字檔一格一行，內容單純，沒有另外對 HTML）。
- L548–869：Page components 全部十一小節。
- L871–915：See also、Further reading、頁尾。

全檔 915 行依序讀完。
