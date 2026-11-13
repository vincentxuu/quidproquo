# 審稿報告：order 23〈教學文章誰讀不到〉（2026-10-14）

- 審的檔：`src/content/posts/learning/2026-10-14-accessibility-in-teaching-articles.md`（只有中文稿，未追蹤檔）
- sha256 審前（19:04）`97fd25de5b4c4ca28210627d13932c87a4164a2b889f111e2598e48765972e2e`；審後（19:11）相同，審稿期間沒人改檔。
- 對照的抽取紀錄（`.research/extractions/articles-that-teach/`）：sharif2021-sr-vis、lundgard2021-four-level、albusays2017-blind-devs、mealin2012-blind-devs、ali2024-math-a11y、almeqdad2023-udl-meta、guo2025-udl-fidelity、cast2024-udl-guidelines3、w3c2024-wcag22、w3c-wai2026-complex-images、webaim2024-sr-survey10、webaim2026-million，12 份全部讀完。抽查紀錄在 `_audit/group-16`～`group-20`（`grep` 命中），沒有 ⚠ 不得引用的檔頭。
- 回原文檔逐字核對的：WCAG 導言引文、CAST 兩句、Lundgard 63% 那句、Almeqdad 解釋那句（`.research/raw/learning-content/q5-social/` 下 grep，全部逐字相符，只差直引號／彎引號）；Mealin 圖表段（`mealin2012-blind-devs.md` L65）；WCAG 導言 L218–248。

## 必須修

1. **L123 Mealin「UML 這類圖多數人說不可及」原文撐不住。** 原文（raw `mealin2012-blind-devs.md` L65；紀錄 #12）：只有 P8 說拿到的 UML 圖「inaccessible」；P3、P8 工作上遇到但避開；P1、P2、P4 根本沒碰過；P5 說沒問題，因為同樣資訊在文件裡有；P7 請同事口述。8 人裡明說不可及的是 1 人。建議改成「8 位受訪者裡，只有一位明說拿到的 UML 圖讀不了，兩位遇到會避開，三位沒碰過；有人請同事口述圖的內容，有人說同樣資訊文件裡都有」。同一句「理由是圖必有詮釋上的歧義」漏了限定：原文是「描述複雜系統的圖」資訊太多，所以一定會有詮釋歧義（「diagrams that illustrated complicated systems … some ambiguity due to interpretation is always present」），要補上「描述複雜系統的」。
2. **L199、L241、L243 King-Sears 寫的超過「存在」。** 「只收有對照組研究的 UDL 統合分析」是 inclusion criteria，題名沒有，只能出自摘要（清單 `.research/2026-10-14-reading-list-order-20-24.md` L148 標「摘要與章節開頭」）。這和指派訊息「King-Sears 只寫存在」不合，而且放在「有對照組」的位置，等於暗示它會跟 Almeqdad 的 0.69 對照。改成只寫題名可撐的描述，例如「King-Sears 等人 2023 年的 UDL 學習成就統合分析」（題名 *Achievement of learners receiving UDL instruction: A meta-analysis*）。L241「三篇批評與有對照組的統合分析都只知道存在」也要跟著改：總共三篇，King-Sears 不是批評文，這句讀起來像四篇，還把 King-Sears 算成批評方。L197 節標題「批評的那一側」底下放 King-Sears，同樣會讓讀者以為它是批評文；建議節標題改成「批評與另一份統合分析，我只知道存在」，或把 King-Sears 移出這一節單獨寫一句。Boysen 兩篇的描述（「對 CAST 指引佐證研究的批判分析」「比較學習風格與 UDL」）跟題名一致，沒問題。
3. **L46「同一段說，認知、語言與學習障礙方面的準則…有限」位置寫錯。** L44 的引文在 WCAG 導言的「WCAG 2 Layers of Guidance」節最後一段（raw `wcag22.md` L248）；「Significant challenges were encountered in defining additional criteria …」是另一節「Background on WCAG 2」的第三段（L222）。內容沒錯，「同一段」改成「導言的另一段」就好。

## 建議修

- L22、L273「每一份都讀完手上取得的那一版並留有抽取紀錄」是查證過程，writing-guide「查證過程不寫進正文」不收這種句子（L59 的「本文依據…全部打開核對」同型）。系列第 1 篇 L26、L256 有同樣的句子，所以這篇是跟著系列寫的。要拿掉的話整個系列一起處理；參考資料區的版本括號可以留著。
- L195「我逐條對過引言，有多處引用對不到參考文獻」：刪掉「我逐條對過」，直接寫「引言有多處引用對不到參考文獻」。後面「這些都是可以回原文查的事實」可以保留，紀錄要求寫成可查證的事實而不是指控，這裡做到了。
- L148「我把焦點放在 `<pre>` 上按十次右方向鍵」是操作流水帳。建議收成結果：「焦點停在 `<pre>` 上時，方向鍵捲不動裡面的 `<code>`」。我回建置輸出確認了機制：`<pre tabindex="0">`，但 `.content pre{overflow:hidden}`、`.content pre code{display:block;overflow-x:auto}`，實際捲動的是 `code`。
- L65 表格 3.1.2「成段的其他語言要標語言」：條文是「each passage **or phrase**」，例外是專有名詞、技術詞彙、無法判定語言的詞、已融入周圍語言的詞。不是只有成段才要標，非術語的英文片語也要標。L163、L223 同樣把範圍寫成「成段」。建議改成「其他語言的段落與片語要標；專有名詞與技術詞彙不必」。
- L184「g = 3.56，也就是平均高出三個半標準差」：13 篇裡 10 篇的分母是前測標準差（單組公式）。建議改成「以前測標準差計，平均高出三個半」，或刪掉這句白話。
- L189 括號「這是我依它的表判讀的，作者沒有這樣統計」掛在整句後面。但「8 篇對象是老師」是原文 §9.1.2 自己說的，判讀只有「成果多半是老師的知識或教案」這一半，括號要往後移。
- L282 Mealin 的參考資料連結 `ciigar.csc.ncsu.edu` 我這裡 curl 回 000，抽取紀錄也記錄了直連失敗，實際讀的是 Wayback 2024-08-28 快照。建議參考資料改附 Wayback 網址，或兩個都附。
- L263 Ali「巴基斯坦三所盲校」：原文是「government institutes for the blind at Peshawar, Abbottabad, and Swat」，沒說幾所。改成「三地的公立盲校」比較穩。
- L81 泛指的螢幕閱讀器使用者用了「他」（「直接決定他能不能先看全貌」）。這裡不是研究者，不違反代名詞規則，但改成「讀者」比較中性。
- tldr 塞了 72、34%、87%、73%、192、1、3.56、13、10 九個數字，偏密。建議留 34% 對 87%、73%、192 張只有 1 張、3.56 這幾個，其餘交給正文。
- L147「CS50 AI 第 0 週一篇就有 18 處被 axe 標出」：靜態 HTML 裡註解色（#6A737D）的 span 有 23 個，差額可能落在摺疊的 `<details>` 裡（axe 不檢查隱藏內容），我沒有重跑 axe，無法確認。可以保留。
- tag `blog`：`check-post-quality.mjs` 給了 WARN（正文沒有對應詞），不擋。

## 沒問題的項目

- **數字逐項對過抽取紀錄**：Sharif（34%／87%、109/324、73／17／11%、84.6 秒對 27.2 秒、χ²、F、ηp²、50 歲以上多 12%、相對差 61.48% 的解釋）；Lundgard（30／90 人、15 張、101 次、40%、63% 與引文、Nemenyi p 值、語料 9.1／35.1／42.9／12.9%、6.83、53%）；Albusays（24／23／22／20、5 人腳本、4 人點字、19／26／16、67%、22–52 歲、美國 22）；Mealin（7/8 API 文件、2 位數學式、JAWS 7、點字 4、暫存視窗 7、脫離脈絡編輯 5）；Ali（15 位老師、94 名學生、α 0.81／0.91、86.7%／91.43%）；Almeqdad（13、10、304、3.56 [1.03, 6.08]、4.42、0.69、0.33–13.18、I² 99.8、τ² 20.17、Q 343.8、學生 5.63、老師 2.76、介入 4.59、培訓 2.78、771／7–254／143、美國 8／9）；Guo（87 個機構、2,473、342、18／23／31／28%、6.8／18.2／37.4／45.5%、42.3／12.1%）；WebAIM 兩份；WCAG 等級計數 31／24／31、2.5.8、1.4.8。全部相符，沒有從記憶或摘要補數字。
- **抽取紀錄要求的限定都寫進去了**：Sharif 的 61.48% 是相對差；圖是作者自己做的；兩組計時定義不同。Lundgard 的組間沒有檢定，正文 L113 交代得很清楚；第 1 層是「不要只寫」。Albusays 的「顏色」那一半原文沒有撐，L121 主動澄清。WebAIM 的 71.6% 寫成 1,511 人作答，不是 1,539；也交代了偏向熟練使用者，另一個 71.6% 沒有混用。WebAIM Million 的 96% 寫成錯誤數的 96%。CAST「神經科學」限定在三原則。複雜圖片教學的「required」不是 WCAG 規定。Guo 的問題都寫成可查證的事實，附 Crossref 日期。
- **不顯著的寫法**：全文用「沒有測到差異」「與 0 分不開」，沒有寫成「沒有效果」；L201 明說「UDL 有效」與「UDL 沒有效」都不是這批材料能下的結論。
- **3.1.5**：L67、L69 寫明是 AAA，WCAG 不建議全站要求 AAA（出處是 5.2.1 Note 2），要求的是「另外提供補充內容或較淺版本」，不是正文寫淺。正確。
- **Almeqdad g = 3.56 的解讀**：L191「是我從它的表讀出來的，不是作者承認的」，並引作者自己的解釋（「minimises the standardised errors」，逐字相符）；L242 把它列進推論。沒有寫成作者承認。
- **Boysen**：兩篇都只寫題名層級的描述，不引結論與數字，沒列進參考資料（只在限制節列「只知道存在」，附 DOI）。DOI 都能解析（302 轉到出版者）。
- **研究者代名詞**：全文沒有替任何研究者用「他／她」。Mealin 的 P6 寫成「一位帶團隊的受訪者」。
- **英文引文**：五段全部逐字相符（WCAG L248；CAST research 兩句；Lundgard seq.txt；Almeqdad L653）。
- **開頭取樣偏誤**（L22–24）、「來源說法不同的地方」並列不選邊、推論逐一標明（L242 列六處）。這些都符合寫稿說明。
- **用語**：`check-tw-terms.mjs` 0 blocking，`check-process-leak.mjs` 通過。我讀的時候沒看到替換表上的用語。
- **站內連結**：6 個全都存在、已追蹤、`draft: false`。order 24 未發佈，正文寫「之後的篇會談」，沒放連結，正確。目前同系列沒有英文稿的篇都沒有放 English version 行，這篇一致。
- **外部連結**（curl，19:05 左右）：26 個裡 18 個回 200／202。6 個 doi.org 被出版者擋，回 403，但 resolver 本身會 302 轉到正確頁，算正常。Mealin 的 ciigar 回 000，見建議修。
- **系列位置**：第五部分第四篇，與規劃檔一致。

## 本站實測一節：重驗結果（審稿當下 19:05–19:10）

| 文章說法 | 我怎麼驗 | 結果 |
|---|---|---|
| 中文文章 123 篇用 mermaid、192 張、`accTitle` 只有 1 張（談圖那篇） | 掃 `src/content/posts/**`，排除 `lang: en`，數 ```` ```mermaid ```` 區塊 | **123／192／1，在 `2026-10-13-diagrams-in-teaching-articles.md` L360** ✔ |
| 註解 #6a737d 在 #24292e 上 3.04:1 | 建置輸出 `.work/video-guide-research/dist/client`（18:04 建置）的 `<pre class="astro-code github-dark" style="background-color:#24292e">` 與 `color:#6A737D` span；用 WCAG 公式算 | **3.046:1** ✔（axe 報的是截到小數兩位的 3.04；四捨五入是 3.05） |
| 第 0 週 21 個程式碼區塊；`<pre>` 可聚焦、實際捲動的是 `<code>` | 數 `<pre data-language>`：python 11、text 6、bash 4、mermaid 3；`pre` 都有 `tabindex="0"`；CSS `.content pre{overflow:hidden}`、`.content pre code{display:block;overflow-x:auto}` | 24 − 3 = **21** ✔；機制成立 ✔（沒有用 Playwright 實按方向鍵） |
| 表格捲動容器不能被鍵盤聚焦 | slug 頁 script 動態包 `div.table-scroll`，沒有設 tabindex；CSS `.content .table-scroll{overflow-x:auto}` | ✔；第 0 週 8 張表、基石那篇 17 張 ✔ |
| 基石那篇 768 個公式全部有 MathML，看得到的那份對輔助科技隱藏；27 個獨立成行 | 數 `class="katex"`、`<math`、`class="katex-html" aria-hidden="true"`、`katex-display` | **768／768／768／27** ✔（「17 個要橫向捲動」沒有驗） |
| 第 0 週 6 個核取方塊 | 數 `type="checkbox"` | 6 ✔ |
| YouTube 嵌入 1,312 個、80 個設了 `captions` | 掃全站 ```` ```youtube ```` 區塊 | **1312／80** ✔ |
| iframe 標題來自 `title` 欄位 | `src/plugins/remarkYoutubeEmbed.ts` | ✔ |
| 沒有用 Markdown 圖片語法放圖 | 掃全站，排除 code fence 後找 `![…](…)` | 0 ✔ |
| axe 測試只涵蓋管理後台 | `tests/console/a11y.spec.ts` 只有 `/admin/console/*`；`@axe-core/playwright ^4.11.3` | ✔ |

沒有重驗的：無障礙樹的節點順序（L137 那串）、axe 的 18 處與 YouTube 三個問題、320px 下的捲動數字、深淺色兩輪。這些要開瀏覽器才能驗。

## 指派訊息要我判斷的事

**1.「本站實測」算不算把查證過程寫進正文？** 我的判斷是不算，這一節應該保留。writing-guide 管的是「作者為了確認來源做了什麼」（哪天打開、哪頁 404、試了哪些工具）。這一節寫的是本站文章在無障礙上的現況，是讀者（寫文章的人）要的結果，性質和評測文的發現一樣；規劃檔 L47、L91 也把「Mermaid 螢幕閱讀器實測」列為這篇的必要內容。L129 用一段交代方法，並說明無障礙樹不等於實際語音，這屬於「會改變讀者判斷的限制」，符合 guide 的「方法論一段帶過」。要收的是零星的操作細節：L148「按十次右方向鍵」、L195「我逐條對過」，見建議修。L22／L273 的「留有抽取紀錄」才是真正的查證過程句，但這是系列的寫法，要改就全系列一起改。

**2.`<span lang="en">` 在 Astro markdown 能不能正常渲染？該不該成為慣例？** 能正常渲染。我用專案裝的 `@astrojs/markdown-remark` `createMarkdownProcessor` 跑了 blockquote、清單項、句中三種位置，輸出都是完整的 `<span lang="en">…</span>`。smartypants 會把直引號轉成彎引號，不影響逐字。專案的 rehype plugin（katex、external links、lazy images）不會動 span。本站目前只有這一篇這樣用。

建議成為慣例，但範圍要說清楚：
- (a) 中文文章裡的英文原文引文（blockquote 或句中引號）一律包 `<span lang="en">`，依據是 WCAG 3.1.2（AA），而且引文本來就是逐字原文，標記成本很低。
- (b) 術語、專有名詞、課名、程式識別字不包（3.1.2 明列例外）。
- (c) 英文稿裡引用的中文原文對稱地包 `lang="zh-TW"`。
- (d) 整段 blockquote 可以把 `lang` 放在 `<blockquote>` 上，但 markdown 的 `>` 做不到，只能用 span，現在的寫法是可行的最小方案。

要變成慣例得寫進 `.agents/skills/post/references/writing-guide.md`（再 `pnpm skills:sync`）。是否加檢查器（例如偵測中文稿裡超過 N 個英文字、在引號內、沒有包 span 的片段）屬 Tier 2 範圍外的判斷，交給 team-lead。另外，這篇 L163 說站上「成段的英文引文沒有標語言」，L223 又說「這篇就是這樣做的」，兩句並存沒有矛盾，但慣例化之後 L163 的描述要改成過去式或刪掉。

**3. 其他指定項目**：
- Boysen：只寫存在，沒問題。King-Sears 寫超過存在，列在必須修 2。
- WCAG 3.1.5：沒問題。
- g = 3.56：沒有寫成作者承認，沒問題。
- 不顯著：沒問題。
- 英文引號逐字：沒問題。
- 研究者代名詞：沒問題。

## 我沒做的事

- 沒有開瀏覽器或跑 axe／Playwright，無障礙樹內容、方向鍵實測、320px 捲動數字、深淺色兩輪都沒有重現。只用建置輸出的靜態 HTML 與 CSS 驗證機制。
- 建置輸出是 18:04 的版本，不保證和現在的 `src` 完全一致。
- 外部連結只看狀態碼，沒有重讀頁面內容。
- 沒有回 PDF 頁面影像核對表格，以抽取紀錄的頁面核對為準。Mealin、WCAG、CAST、Lundgard、Almeqdad、Ali 有回原文文字檔抽查（見檔頭）。
- 沒有核對英文稿（不存在）。

## 2026-10-14 複審（19:32）

- 審的檔 sha256：`ea46463ad6f274a4ebb88d9db1f0295398b1263f10fac64e1b853eca404167f8`（287 行）。`check-tw-terms` 0 blocking，`check-process-leak` 通過。

### 必須修三項：都已修好
1. **Mealin（L123）**：回 raw `mealin2012-blind-devs.md` L65 核對。改成「只有一位明說讀不了，兩位遇到會避開，三位沒碰過；有人請同事口述，有人說文件裡都有」，與原文的 P8、P3／P8、P1／P2／P4、P7、P5 對得上；並補上「描述複雜系統的圖資訊太多，一定會有詮釋上的歧義」，與原文「try to communicate so much information … ambiguity … always present」一致。✔
2. **King-Sears（L197、L199、L241、L243）**：
   - 改成「UDL 學習成就統合分析」，對應題名 *Achievement of learners receiving UDL instruction: A meta-analysis*；「只收有對照組」已刪。
   - 節標題改為「批評與另一份統合分析，我只知道存在」；L241 改成「Boysen 的兩篇批評與 King-Sears 等人的統合分析，三篇」，篇數正確，也不再把 King-Sears 算成批評方。
   - 「它不是批評文」是從題名的中性描述推得的，可以接受。✔
3. **L46**：改成「導言的另一段」。✔

### 建議修：已改的
- L195 刪了「我逐條對過」。
- L148 收成結果句。
- 3.1.2 範圍改成「段落與片語」（L65、L163、L223）。
- L184 補了「前測的標準差」。
- L189 判讀括號改成「後半是我依它的研究清單判讀的」。
- Ali 改成「三地（Peshawar、Abbottabad、Swat）的公立盲校」。
- L81 改成「讀者」。
- tldr 精簡了，「納入的研究多數沒有對照組」與 13 篇裡 10 篇相符。
- Mealin 的參考資料加了 Wayback 連結，curl 回 200。

L22、L273「留有抽取紀錄」沒改，這是系列層級的決定，維持原判。

### 新的 lang 標記
共 12 處：
- 5 段完整引文：L44、L111、L175、L176、L191。
- 7 處非術語片語：L34、L119 的 space；L69、L209 的 required；L87 的 graphic、object；L123 的 simple English。

都是螢幕閱讀器念出的英文字、原文用語或口語片語，沒有包到術語或專有名詞（WCAG、UML、mermaid、accTitle、API 等都沒包）。另外用腳本掃了正文 L1–270，排除連結與行內程式碼後，引號裡沒有包到的英文片語是 0。✔

### 新發現（建議修，不擋）
- L282 Mealin 的參考資料括號裡「讀的是」出現兩次（「讀的是作者研究群網站上的刊出版；這個網址目前連不上，讀的是 Wayback…的存檔」），讀起來像兩個版本。建議改成「作者研究群網站上的刊出版；原網址目前連不上，連結改附 Wayback 2024-08-28 的存檔」。
- L184「以這個標準差計，平均高出三個半」語意可以，但句子有點擠。可改成「13 篇裡有 10 篇以前測標準差當分母；照這個算法，平均高出三個半標準差」。

### 結論
三項必須修全部通過，沒有新的必須修，可以進英文稿。

## 2026-10-14 英文稿（19:53）

- sha256：中文稿 `2908feae4841a62dc4c229889d2be103060be826893103464b061c19e00f20a7`（289 行）；英文稿 `2353750ee9cb9887cd44060020f8ba8ef1b71b6a898ddc9b0154a98ed78e4230`（291 行）。
- `check-post-quality` OK，`check-process-leak` 通過。站內連結 10 個全部存在。

### 中文稿兩處措辭修正

兩處都已修好。
- L186：改成「13 篇裡有 10 篇拿前測的標準差當分母，換算下來，後測平均比前測高出三個半前測標準差」。
- L284：改成「這個網址目前連不上，實際讀的是 Wayback 存檔」，Wayback 連結 200。

（小提醒，不擋：3.56 是單組與兩組合併的值，「後測比前測高三個半」嚴格說只適用單組那 10 篇。若要更精確，可在前面加「大致」。）

### 必須修

1. **英文稿 L173 CAST 細項名稱引號內不逐字。** 原文（`cast-udl3-representation.txt` L101、L246、L344）是「Highlight **and explore** patterns, critical features, big ideas, and relationships」，英文稿寫成「highlight patterns, critical features, big ideas, and relationships」，少了「and explore」。同句另兩個名稱逐字相符（只有句首大小寫不同，可接受）。中文稿是意譯、不加英文引號，所以不受影響。

### 建議修

- L35 表格把「"statistical and relational"」「"overall trend"」都加了引號。前者是論文第 2 層的層名，後者不是：第 3 層原名是「perceptual and cognitive」。建議兩者都去掉引號，或第 3 層改用原名。
- L211「from the low teens to 73%」：原值是 11% 與 17%，17% 不算 low teens。改成「from 11–17% to 73%」，或「from under a fifth」。
- 中文式的主題前置句，英文讀起來不順：
  - L65「Whether code counts as an exception, the text doesn't say」
  - L152「Whether code counts as an exception under 1.4.10…, the text doesn't say」
  - L160「whether they count as…, the text doesn't say」
  
  建議改成「The text doesn't say whether …」。
- L83「A screen reader is a single line that reads one thing at a time」：語意不通，可改成「A screen reader works in a single line, reading one thing at a time」。
- L245「Boysen's two critiques and King-Sears and colleagues' meta-analysis, three papers in all, I only know exist.」語序生硬。改成「I know only that three papers exist: Boysen's two critiques and King-Sears and colleagues' meta-analysis.」
- L16「中文版」連結文字沒有包 `lang="zh-TW"`。這是全站英文稿的共用格式，要處理就全站一起處理，不是這篇的問題。

### 兩處與中文稿不同的地方：判斷可以

1. 第 7 項多一句「(or `<span lang="zh-TW">…</span>` for Chinese quoted in an English article, as this version does)」。這是英文稿實際做的事，與 3.1.2 一致，屬於合理的在地化。
2. accDescr 例子改成英文：對英文讀者有用，內容與中文例子逐句對應（initial state、每輪 remove、是目標就回傳、否則展開並加入沒看過的鄰居、frontier 空就沒有解）。實際的圖在中文頁，但這裡是「可以這樣寫」的示範，不是描述現況，所以不誤導。

### 其他核對：沒問題

- **中英一致**：逐節對過標題、先看結論表、WCAG 表、各研究數字、本站實測數字、UDL 三節、來源分歧、可以做的事、限制、附錄、參考資料。數字全部一致；King-Sears、Mealin 的新寫法也同步過來了。本站實測一節連到中文頁並註明「(in Chinese)」，是正確的，因為實測的對象就是中文頁。
- **英文引文逐字**：已回原文 grep 核對以下各句，都相符：
  - WCAG 引文
  - 1.1.1「text alternative that serves the equivalent purpose」
  - WebAIM「Navigate through the headings on the page」
  - Million「certainly lower than 4.1%」
  - Sharif「61.48% less accurately」
  - Lundgard「differ significantly」與 63% 那句
  - CAST 兩句與「Learning, and transfer of learning, …」
  - W3C 範例句
  - Almeqdad 解釋句
  - Albusays「space, space, space」「three spaces」
  - Mealin「simple English」
- **lang 標記**：英文稿裡的中文都包在 `<span lang="zh-TW">` 內，共三處：無障礙樹那串、Alpha-Beta 標題、「不必看」。每處後面都附英文意譯。腳本掃過，span 以外的中文只剩 L16 的「中文版」連結。
- **代名詞**：沒有替研究者用性別代名詞。L125 的「he was given」指 Mealin 的 P8：原文對 P8 用 he，論文也明說受訪者全是男性，不是從名字推測的，可以保留。
- **英文自然度**：整體通順，用語一致，例如 part／section、screen-reader group、no difference detected。除了上面列出的幾句，沒有明顯的翻譯腔。

## 2026-10-14 英文稿修正確認（20:14）

- sha256：中文稿 `70aa58bf897957ffba9e7fab874ee2510cb0c7630b4f99a147178c2c7ad9ebf7`；英文稿 `333adb4beaaa608c8c2e9636a0029aff06e95af0beb2865b6d8db0f4cb45b927`。中文稿 `check-tw-terms` 0 blocking。

### 必須修（新引入）

- **中文稿 L186、英文稿 L188：「三個半」套錯了數字。**
  - 現在的寫法：中文是「對這 10 篇來說，3.56 大致是後測比前測高出三個半前測標準差（這 10 篇自己的合併估計是 4.42）」；英文是「for those ten, 3.56 roughly means … three and a half pretest standard deviations … (their own pooled estimate is 4.42)」。
  - 為什麼錯：3.56 是 13 篇（單組加兩組）合併的值，不是那 10 篇的值。那 10 篇的合併估計是 4.42，所以「對這 10 篇來說，3.56 是……」前後矛盾。照 4.42 解讀，應該是「高出四個多前測標準差」。
  - 建議中文改成：「合併效果 g = 3.56，混合了單組與有對照組的研究。13 篇裡 10 篇是單組研究、拿前測標準差當分母，它們自己的合併估計是 4.42，大致是後測比前測高出四個多前測標準差。」英文照改。
  - 4.42 本身核對無誤：`almeqdad2023-udl-meta.md` 第 44 行，Table 4 單組 4.4227（SE 1.4032，p .0016）。

### 已確認修好

- **CAST 細項名**：「Clarify…」「Support decoding…」「Highlight and explore patterns, critical features, big ideas, and relationships」三個都與 `cast-udl3-representation.txt` 逐字相同，首字大寫也照原文。✔
- **L35**：去掉了引號，改寫成 statistical-and-relational 與 overall-trend levels，不再冒充原文層名。✔
- **L211**：改成「to 73%, against 11% with ChartJS and 17% with D3」，數字正確，中英一致（中文是「一兩成」）。✔
- **L65、L152、L160**：都已改成「the text doesn't say whether…」或「WCAG doesn't say whether…」的句型。✔
- **L245**：改成「I only know that three papers exist: …」。✔
- **中英一致**：以上修改兩邊同步，4.42 兩稿都有，也和各自的附錄一致。

### 仍可改（不擋）

- 英文稿 L83「A screen reader is a single line that reads one thing at a time」沒有改，中文的「是一條線」也還在。可以改成「A screen reader works in a single line, reading one thing at a time」。
