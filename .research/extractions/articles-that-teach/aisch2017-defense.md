# 抽取紀錄：Aisch 2017，In Defense of Interactive Graphics（vis4.net 部落格）

- **書目**：Gregor Aisch (2017-03-31). In Defense of Interactive Graphics. 個人部落格 vis4.net。https://www.vis4.net/blog/2017/03/in-defense-of-interactive-graphics/ 。沒有 DOI。作者名與日期對過頁面（L27–29）。文中用「we」談紐約時報的作品，但**這篇文章本身沒有寫出作者的職稱或任職單位**。
- **網址更新（2026-10-14）**：原網址 `https://www.vis4.net/blog/2017/03/in-defense-of-interactive-graphics/` 現在回 404；同一篇搬到 https://www.vis4.net/blog/in-defense-of-interactive-graphics/ （回 200，標題、日期與「didn't ignore the graphic, they just didn't click the button」引文對得上）。舊網址在 Wayback 有 2023-12-14 的存檔可當備援。文章引用請用新網址。
- **版本**：作者個人網站上的原文。
- **原文檔**：`.research/raw/learning-content/q2-interactive/aisch2017-defense.txt`（87 行、6,776 字元／6,835 位元組），從同目錄的 `aisch2017-defense.html` 轉出。對過 HTML：正文的超連結與五張圖在文字檔裡都被拿掉了，連結目標另外從 HTML 抽出來核對（見下）。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 7（該不該做互動）#9（與 Tse 2016 合用，見 `tse2016-malofiej.md`）

## 研究設計

不是研究。是一篇部落格文章，作者澄清一個他自己講出去、後來被轉述走樣的數字，再舉三個自己做過的作品說明互動還有什麼用。

唯一的量測描述在註 1（L57）：

> 「The number comes from me measuring the percent of readers who clicked on a prominent button in a couple of graphics we published in 2015. I mentioned the number at a conference, from where it ended up in another talk, then on Medium and finally on FastCo.Design. However, the 85% of readers didn't ignore the graphic, they just didn't click the button.」

- 量的是什麼：**點了某個顯眼按鈕的讀者比例**。
- 量了哪些：「a couple of graphics we published in 2015」，沒有說是哪幾件、幾件、各自多少、樣本多大、怎麼記錄點擊。
- 沒有量：有沒有看圖、看了多久、有沒有捲動、有沒有用 tooltip。

HTML 裡這段的連結目標：conference → informationplusconference.com；Medium → Dominikus Baur〈The end of interactive visualizations〉；FastCo.Design → 〈The problem with interactive graphics〉。「another talk」沒有連結，文章沒有指名是誰的演講。

## 內容（逐項）

| # | 說了什麼 | 行號 | 原文一句 |
|---|---|---|---|
| 1 | 否認的說法 | L33 | 「It is also not true that "85% of the Times' page visitors online simply ignore interactive infographics altogether". But since I sort of helped creating[1] this confusion, I think it's time to set this straight」 |
| 2 | 實際的意思 | L57 | 「the 85% of readers didn't ignore the graphic, they just didn't click the button.」 |
| 3 | 作者承認的事實 | L37 | 「Knowing that the majority of readers doesn't click buttons … Knowing that many many people will ignore your tooltips」 |
| 4 | 作者從中得出的規則 | L37 | 「All it means is that you should not hide important content behind interactions. If some information is crucial, don't make the user click or hover to see it (unless you really want to).」括號裡的例外連到紐約時報的 You Draw It。 |
| 5 | 少數人不等於沒有人 | L37 | 「But not everything is crucial and 15% of readers isn't nobody.」 |
| 6 | 用途一：tooltip 讓最投入的讀者深挖 | L39–41 | 歐洲 20 國右翼政黨得票圖。重要的標籤直接顯示，tooltip 另外提供政黨名與得票率。「Our most passionate readers from many different countries went deep into the numbers and fact-checked the party affiliations and elections results, leading to a sad record number of corrections we had to add after first publication. It's safe to say that none of the errors would have been spotted without the tooltips」 |
| 7 | 用途二：讓讀者看到完整資料 | L43–45 | 蓋洛普民調圖：圖本來就是動態產生的，加一個瀏覽全部資料的功能「didn't cost us much」。「We didn't expect that a lot of readers would use the navigation. In fact, readers even had to stumble across the gray arrows which were hidden by default … the static version of the piece is great on its own, so missing out on the interaction doesn't do any harm.」註 2：後來改成捲到夠深就一直顯示箭頭。 |
| 8 | 用途三：讓讀者檢驗分析 | L47–51 | 2016 年共和黨初選代表席次計算器：模擬 100 種隨機結果，文末請讀者拉滑桿自己設情境。 |
| 9 | 結論 | L53–55 | 「there are still a lot of good reasons for making graphics interactive, even if only a small share of the audience will dig into it. … if interactive graphics are not just a fun addition but can actually increase the transparency of our work, open us for criticism, and thereby, hopefully, help re-build some trust in journalism, I think it they're worth it.」 |

三個用途都沒有附使用率數字。用途一有一個可觀察的結果（刊出後被讀者抓出創紀錄數量的錯誤），但更正的次數沒有寫。

## 作者自己列的限制

文章沒有限制一節。作者自己設的界線：

1. 三個例子裡靜態版本身都要站得住，互動是加值：「Now we could have just published this graphic as it is and nothing would be wrong with it」（L41）、「missing out on the interaction doesn't do any harm」（L45）。
2. 他辯護的對象是少數讀者：「even if only a small share of the audience will dig into it」（L55）。
3. 信任那一條用的是「hopefully」。

原文沒有說的：那個數字的精確值與範圍；是哪幾件作品；按鈕的作用是什麼；桌機與手機有沒有分開。

## 與摘要說法不一致的地方

沒有摘要。標題是「為互動圖表辯護」，內文同時承認多數讀者不點按鈕、很多人不看 tooltip，並把結論收在「重要內容不要藏在互動後面」。逐段對過，標題與內文沒有矛盾，但標題沒有反映他承認的那一半。

## 與清單「要撐的結論」不合的地方

清單寫：「紐約時報的 10–15% 與它被誤讀的地方」。

1. **這篇文章裡沒有「10–15%」這個範圍。** 出現的數字只有兩個：被他否認的那句引文裡的「85%」，以及他自己那句「15% of readers isn't nobody」。能從這篇文章寫出來的是「約 85% 的讀者沒有點那個按鈕，也就是約 15% 點了」。「10–15%」如果來自他的研討會演講，那份演講不在手上的檔案裡，要引就得另外去拿並讀過。
2. **「紐約時報的」要加限定**：是「a couple of graphics we published in 2015」上「a prominent button」的點擊率，量的人是 Aisch 自己。不是紐約時報全站、不是所有互動形式、不是官方公布的統計。
3. **「被誤讀的地方」撐得住，而且是作者本人講的**：誤讀是把「沒有點按鈕」說成「完全無視互動圖表」。傳播路徑照他的說法是：他在研討會講 → 進了另一場演講 → Medium → FastCo.Design。
4. 這篇文章不能用來說「互動沒用」，也不能用來說「互動有用所以值得做」：它的主張是有條件的（重要內容不藏、靜態版先站得住、互動服務少數深入的讀者與透明度），而且三個例子都沒有量測。
5. 他談的是新聞資料圖表的讀者，不是學習者；講的好處是查核、完整資料、信任，沒有談學得比較好。

## 讀取紀錄

| 順序 | 行號起訖 | 內容 |
|---|---|---|
| 1 | L1–87（一次讀完） | 頁首導覽與目錄（L1–23）、標題與日期（L25–31）、正文四節（L33–55）、兩則註腳（L57–59）、頁尾（L61–87） |
| 對原檔 | `aisch2017-defense.html` | 抽出全部超連結目標核對；五張圖（三張靜態截圖、兩張 GIF）在文字檔裡沒有留下，圖本身沒有看 |
