# 抽取紀錄：Conlen、Kale、Heer 2019，Capture & Analysis of Active Reading Behaviors for Interactive Articles on the Web（EuroVis 2019）

- **書目**：Matthew Conlen、Alex Kale、Jeffrey Heer（三人都是 Paul G. Allen School of Computer Science & Engineering, University of Washington）。Capture & Analysis of Active Reading Behaviors for Interactive Articles on the Web. Eurographics Conference on Visualization (EuroVis) 2019，Computer Graphics Forum 38(3)。doi 10.1111/cgf.13720（DOI 取自清單，檔案內文沒有印 DOI；卷期與作者照首頁 L1–15）。
- **版本**：出版者版面（頁尾印「Computer Graphics Forum © 2019 The Eurographics Association and John Wiley & Sons Ltd.」），沒有印頁碼。PDF 共 12 頁，正文 10 頁、參考文獻 2 頁。
- **原文檔**：`.research/raw/learning-content/q2-interactive/conlen2019-idyll-analytics.txt`（906 行、67,821 字元；不帶 `-layout` 的 pdftotext，我重轉一次比對長度相同）。PDF 在 `.work/learning-visualization-research/src/conlen2019-idyll-analytics.pdf`。
- **讀取日期**：2026-10-14
- **供哪幾篇用**：order 7（該不該做互動）
- **沒有讀到的**：補充材料（各變數使用分布圖、「所有觀察到的重複行為清單」）；公開的原始記錄檔 `data.zip`（L722–723）沒有下載。

## 研究設計

- **類型**：工具論文＋三個個案的觀察性記錄分析。**沒有對照組、沒有隨機分派、沒有量學習成效或理解**。論文的貢獻自述是記錄工具（Idyll 的擴充）與兩個視覺分析工具（HopScroll／ScrollHop、Readuction）。兩個工具名稱在文中混用：摘要與圖 1 寫 HopScroll，第 5 節標題與內文寫 ScrollHop。
- **研究對象的定義**（L91–95）：interactive article 指文字與互動元件穿插、帶讀者走一條大致線性敘事的網頁內容；讀者是匿名、與作者沒有直接聯絡的一般網路讀者。作者明說這和課堂或 MOOC 不同：「we are interested in content published to broad audiences who are not externally motivated, for example, by being enrolled in a class」（L100–102）。
- **三篇文章**（都用 Idyll 寫，L176–181）：
  1. *Beat Basics*：一位資訊系大學生寫，投 2018 Explorables Jam。講 3/4 與 6/8 拍的差別，7 節。互動多半是滑鼠滑過圖形觸發聲音與動畫，另有按鈕可展開更多資訊（L193–200）。
  2. *The Beginner's Guide to Dimensionality Reduction*：兩位資訊博士生寫（參考文獻列 Conlen 與 Hohman），投 2018 VISxAI 工作坊。7 節。捲動時圖自動更新；可滑過藝術品看細節、有一個調參數的滑桿、一個顯示技術細節的按鈕、三個切換演算法的按鈕（L205–213）。
  3. *How To: Tune a Guitar*：**本論文的兩位共同作者寫的**（L215–216）。13 節，三篇中最長。有可互動的吉他元件：撥弦、轉弦鈕、播放按鈕、失真與拍頻參數（L219–226）。
- **資料怎麼收**（L228–237）：載入時記瀏覽器、裝置、螢幕尺寸；記捲動位置的時間序列；記停留時間；記 Idyll 反應式變數的每一次狀態改變。Google Firebase 存資料，匿名但同一瀏覽器的識別碼固定。
- **收了多久**：每篇收了幾個星期，「the vast majority of reader sessions came within the first two days of the articles' publication」（L180–181）。
- **流量來源與規模**：

| 文章 | 來源 | 工作階段 | 讀者 | 桌機工作階段 | 行號 |
|---|---|---|---|---|---|
| Beat Basics | Twitter、Hacker News、Reddit 音樂教育社群 | 10,000 | 8,368 | 4,456（原文句子是「4,456 of which viewed the desktop version」，指工作階段還是讀者不明確） | L362–364 |
| Dimensionality Reduction | VISxAI、Twitter、Reddit 資料科學社群、datacamp.com | 7,055 | 4,549 | 3,170 | L448–451 |
| Tune a Guitar | Twitter、Hacker News、GIGAZINE、Codedrops Collective、Google 搜尋結果 | 55,193 | 46,347 | 27,603 | L535–539 |

  三篇合計 72,248 個工作階段（我加的）。摘要寫「over 50,000 reader sessions」（L27），前言寫「visited more than 50,000 times」（L79）。
- **分析的母群**：除非明寫 mobile，**所有統計都只算桌機讀者**（L354–359「throughout the analysis that follows statistics refer to desktop users, except where we explicitly refer to mobile users. Many of the article features were disabled or shown in a static format for mobile readers」）。
- **分析方法**：彙總統計（中位數與四分位距）；請文章作者提問題再寫查詢回答（Q1–Q7）；用 ScrollHop 看捲動軌跡；用 UMAP 降維的 Readuction 看讀者群。沒有任何推論統計。

## 結果（逐項）

IQR 照原文寫法（第 25–75 百分位）。除標明「手機」的列，都是桌機讀者。

### Beat Basics

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 1 | 停留時間 | 中位數 86 秒（IQR 36–183） | 6.1.1 | L387 | 「The median time spent on the page was 86 seconds (36-183 IQR)」 |
| 2 | 有動手的比例 | 85% 的讀者操作互動內容播放節拍；中位數 16 次互動（IQR 6–27） | 6.1.1 | L388 | 「85% of readers interacted with the interactive content to playback the beats (median 16 interactions, 6-27 IQR)」 |
| 3 | 文末兩首範例曲 | 3/4 與 6/8 兩首的播放次數中位數都是 2 | 6.1.1 | L388–391 | 「both the 3/4 and 6/8 songs were played a median of two times」 |
| 4 | 手機停留時間 | 中位數 20 秒（IQR 6–57） | 6.1.1 | L391–392 | 「Mobile readers spent less time on the page (median 20 seconds, 6-57 IQR).」 |
| 5 | 平均停留時間被離群值拉高 | 桌機平均 3,224 秒、手機 510 秒 | 6.1.1 | L392–394 | 「likely due to readers leaving the page open while they performed other tasks」 |
| 6 | 手機互動 | 音訊元件互動次數中位數 1，前 25% 為 3 次以上；只有 10% 觸發文末範例音訊 | 6.1.1 | L394–396 | 「Only 10% of mobile readers triggered one of the example audio clips at the article's end.」 |
| 7 | 大圖對文內連結 | 75% 的讀者操作過兩個節奏圓之一，54% 滑過文內兩個連結之一 | 6.1.1 | L405–408 | 「75% of readers interacted with one of the two rhythm circles, while 54% hovered over one of the two links in the text」 |
| 8 | 上下兩個圓 | 上方 3/4 圓中位數 8 次（IQR 4–14），下方 6/8 圓中位數 8 次（IQR 2–12） | 6.1.1 | L402–404 | 「skews slightly higher」 |
| 9 | 在兩種節奏間切換 | 中位數 6 次（IQR 2–9） | 6.1.1 | L413–414 | 「indicating that most readers were following along with the content and were completing the tasks setup by the author in the manner that she expected」 |
| 10 | 讀到文末 | 73% | 6.1.2 | L418–419 | 「About three quarters (73%) of Beat Basics readers reached the end of the article.」 |
| 11 | 快速捲到底就走 | 沒有給比例 | 6.1.2 | L420–424 | 「many readers simply scroll through to the end of the content very quickly and leave the page. Many of these readers interact with various interactive components, although the length of time that they spend doing so suggests a very superficial level of engagement.」 |

### The Beginner's Guide to Dimensionality Reduction

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 12 | 停留時間 | 中位數 116 秒（IQR 33–386） | 6.2.1 | L453 | 「The median time spent on the page was 116 seconds (33-386 IQR).」 |
| 13 | 讀到文末 | 76% | 6.2.1 | L454 | 「76% of readers reached the end of the article.」 |
| 14 | 讀到文末的人裡點了切換演算法按鈕 | 59%；也就是 41% 沒看到按鈕後面的內容 | 6.2.1 | L454–456 | 「Of the readers who reached the end, 59% clicked one of the buttons to select an additional algorithm. This means that 41% of the readers who "finished the article" did not read all of the content.」 |
| 15 | 作者對 #14 的補充 | 那些內容不影響高層次重點，但實際應用需要 | 6.2.1 | L456–458 | 「The details of the other algorithms weren't necessary for the high-level takeaways of the articles, but they were needed for informed application of the technique in practice.」 |
| 16 | 各元件的互動次數中位數 | 滑過藝術品 4 次；演算法細節按鈕 **0** 次；滑桿 **0** 次 | 6.2.1 | L458–460 | 「the median number of interactions with the algorithm details button and with the slider was zero」 |
| 17 | 手機停留時間 | 中位數 40 秒（IQR 10–131） | 6.2.1 | L462–463 | 「The median time that mobile readers spent on the page was 40 seconds (10-131 IQR).」 |
| 18 | 手機讀到文末與點按鈕 | 48% 讀到最後的內容，其中 38% 用了看其他演算法細節的功能 | 6.2.1 | L463–464 | 「48% of mobile readers reached the final content of the article, and of those 38% utilized the functionality to observe details of the other algorithms.」 |
| 19 | 手機讀者讀完文字但不動互動 | 沒有給比例 | 6.2.1 | L464–465 | 「many mobile readers would consume all of the textual content even though they did not engage with interactive features」 |
| 20 | 滑桿怎麼被用 | 滑桿到過的最小值呈雙峰：很多人沒碰，其餘的人一路拉到最左（圖 7，圖上沒有刻度數字） | 6.2.1／Fig. 7 | L488–493、L470–473 | 「there is clearly a bimodal distribution. This indicates that very few readers left the slider in the middle without first moving it to the lower end of the range.」 |
| 21 | 交替使用滑桿與滑過藝術品 | 約 5% 的讀者 | 6.2.1 | L493–496 | 「only ~5% of readers did this—indicating that readers weren't spending time examining the consequences of moving the slider, and that this presentation was not as effective as intended.」 |
| 22 | 演算法細節按鈕（全體桌機讀者） | 約 45% 用過；用了之後又去操作圖的只有約 15% | 6.2.1 | L496–498 | 「Overall about 45% the readers engaged with the algorithm details buttons. Only about 15% of readers used one of these buttons and subsequently engaged with the visualization.」 |
| 23 | 捲動型態 | 多半線性往下，少跳節；作者給了兩種解釋，沒有判定 | 6.2.2 | L505–516 | 「This may imply that the content was well motivated and well matched to the audience, or it may be an artifact of our design choice to use scroll-based waypoints and animations, perhaps making the process of switching sections more burdensome than free-scrolling.」 |

### How To: Tune a Guitar

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 24 | 停留時間 | 中位數 78 秒（IQR 27–210） | 6.3.1 | L541 | 「The median time spent on the page was 78 seconds (27-210 IQR)」 |
| 25 | 撥弦與調音 | 撥弦中位數 22 次（IQR 6–56）；調音動作 42 次（IQR 6–119） | 6.3.1 | L542–543 | 「readers performed a median of 22 "plucks" of the guitar string (6-56 IQR), and 42 tuning adjustments (6-119 IQR)」 |
| 26 | 六條弦都調好 | 23% | 6.3.1 | L543 | 「23% of readers tuned all six strings of the guitar.」 |
| 27 | 較細的互動功能 | 14% 點了拍頻範例的播放鈕；2% 改了拍頻播放參數 | 6.3.1 | L543–553 | 「Usage of the more detailed interactive features was relatively low: just 14% of readers clicked the button to play an example of beat frequencies, 2% modified the beat frequency playback.」 |
| 28 | 手機停留時間 | 中位數 41 秒（IQR 10–131） | 6.3.1 | L553–554 | 「For mobile readers, the median time on page was 41 seconds (10-131 IQR).」 |
| 29 | 手機讀者 | 82% 至少往下讀了一部分（要先關掉一則下載大小警告）；34% 嘗試調音；6% 六條弦都調好 | 6.3.1 | L554–557 | 「82% of mobile readers advanced through at least some of the content, even though they needed to dismiss a warning about download size; however, only 34% attempted to tune the guitar and just 6% tuned all six strings.」 |
| 30 | 刷弦 | 中位數 1 次（IQR 0–3） | 6.3.1 | L574–576 | 「median 1 strum, 0-3 IQR」 |
| 31 | 調音「回合」數 | 中位數 1（IQR 0–4） | 6.3.1 | L579–587 | 「This suggests that most readers did interact with the tuners when prompted initially, but only the most engaged readers continued to follow along through the rest of the content, including attempting to tune by beat frequency. This content may have been too advanced for readers without musical experience, or users may have been less inclined to continue interacting after the novelty wore off.」 |
| 32 | 讀到最後一節 | **45%** | 6.3.2 | L589–591 | 「Only 45% of readers reached the final section. This completion rate is considerably lower than the other two articles; this article had the most content, it also was shared with the largest and most general audience.」 |
| 33 | 疑似程式錯誤造成的一群人 | 沒有給人數 | 6.3.3 | L608–610 | 「we believe that these users may have hit a bug related to the Chrome WebAudio API that some users had reported」 |

### 跨文章（第 7 節）

| # | 結果 | 數字 | 節 | 行號 | 原文一句 |
|---|---|---|---|---|---|
| 34 | 手機對桌機的停留時間 | 手機中位數是桌機中位數的 23–52% | 7.1 | L672–675 | 「The median time spent on page for mobile users was 23-52% of the median time of desktop users.」 |
| 35 | 藏在點擊後面的內容 | 降維那篇讀到文末的人裡，桌機「約一半」、手機 38% 點開 | 7.1 | L650–654 | 「we similarly saw that if details were only revealed after a click, readers may never see it. In Beginner's Guide to Dimensionality Reduction, roughly half of desktop readers and 38% of mobile readers who made it to the end of the article clicked to reveal more details about the projection algorithms.」 |
| 36 | 作者對 #35 的兩種解釋 | — | 7.1 | L653–655 | 「This may indicate that some readers were not aware of the functionality, or that they were content with more high-level information.」 |
| 37 | 位於敘事中心的元件用得多 | 沒有新數字，舉吉他元件、藝術品、節奏圓為例 | 7.1 | L655–660 | 「This indicates that users are willing to engage with interactive content on the page, but most are focused on content that is crucial to the central narrative.」 |
| 38 | 手機讀者人數 | 「常常和桌機一樣多或更多」；依上表桌機工作階段占 44.6%、44.9%、50.0%（比例是我算的） | 7.1 | L678–682 | 「the majority (86%) are willing to click through a warning note about application download size … noting that they are often equal to or greater in number than desktop readers」 |
| 39 | 給設計者的結論 | — | 7.1 | L682–684 | 「Mobile readers utilized fewer of the available interactive features than their desktop counterparts, but still largely followed the presented narratives. This result indicates that designers should ensure that the narrative is intact and comprehensible even if a reader chooses not to engage with the interactive widgets.」 |
| 40 | 讀者行為是連續的 | 沒有數字 | 7.1 | L630–631 | 「readers who do interact display a continuum of behaviors and do not necessarily fall into clearly separable groups」 |
| 41 | 先掃過再讀 | 沒有給比例 | 7.1、5.1 | L627–630、L316–320 | 「Users who scroll & bounce were the most prominent group, moving quickly through the webpage and exiting after a short time.」 |

### 前言與相關研究裡的說法（背景，本篇沒有驗證）

- L36–38：互動內容「may more effectively communicate complex topics [May02]」——引的是 Mayer 的多媒體學習，不是互動文章的研究。
- L38–41：「these articles are seldom analyzed to see if their interactive features are effective at engaging readers and delivering the desired message. Interactive articles suffer from the additional issue that there are no clearly defined metrics or evaluation methods to measure their effectiveness.」
- L46–47：從業者對互動元件值不值得花那麼大的力氣與費用有爭論，引 Tse16、Bau17、Ais18。本篇沒有引用紐約時報的任何百分比。
- L65–66：Explorable explanations「have not been widely studied」。

## 作者自己列的限制

論文**沒有限制一節**。散在各處、算得上限制的說法：

1. 三篇文章為桌機設計，手機版很多功能被關掉或改成靜態，手機體驗不精緻（L355–359、L465–477）。手機與桌機的差別因此混著「裝置」與「拿到的是不同版本」兩件事。
2. 平均停留時間被把頁面開著不管的人拉高（L392–394）。
3. 吉他那篇有一群桌機讀者可能撞到 Chrome WebAudio 的程式錯誤（L608–610）。
4. 文章作者可以在元件裡定義不被記錄的私有狀態，這三篇沒有這種情況（L247–251）。
5. 群眾外包工作者的行為未必等同出於興趣的讀者（L709–710）——這是作者用來支持實地研究的理由。
6. 「controlled comparisons of article variants」是未來工作（L719–720）；本篇沒有做任何版本比較。

作者沒寫、但讀得出來的：樣本是三篇文章，其中一篇是論文作者自己寫的；讀者來自 Hacker News、Reddit、Twitter 等管道，不代表一般讀者；絕大多數流量集中在發表後兩天；沒有任何理解或學習的測量，「following along」是從點擊次數推的。

## 與摘要說法不一致的地方

摘要本身只說做了工具、三個個案、五萬多個工作階段，沒有下行為結論，所以摘要與正文沒有矛盾。正文內部有四處對不上：

1. **59% 對「約一半」**：6.2.1 說讀到文末的桌機讀者有 59% 點了演算法按鈕（L454–455），7.1 的討論寫成「roughly half of desktop readers … who made it to the end」（L652–653）。全體桌機讀者的比例是約 45%（L496–497，與 76% × 59% ≈ 45% 相符）。引用時要講清楚分母：讀到文末的人是 59%，全體是約 45%。
2. **82% 對 86%**：6.3.1 說 82% 的手機讀者關掉警告後往下讀了一部分（L554–556），7.1 說「the majority (86%) are willing to click through a warning note」（L679–680）。兩個數字可能量的是不同的事（點掉警告對往下讀），原文沒有說明。
3. **手機停留時間的 IQR 重複**：降維那篇手機中位數 40 秒（IQR 10–131）（L463），吉他那篇手機中位數 41 秒（IQR 10–131）（L554）。兩篇不同文章的四分位距一模一樣，可能是筆誤，原文無從判斷。
4. **85% 對 75%**：Beat Basics 有 85% 的讀者操作互動內容播放節拍（L388），75% 操作過兩個節奏圓之一、54% 滑過文內連結（L405–406）。分母與定義不同，不算矛盾，但引用時不能混。

另外，工具名稱 HopScroll／ScrollHop 混用；Beat Basics 的「4,456」沒說是工作階段還是讀者。

## 與清單「要撐的結論」不合的地方

清單寫：「真實讀者有多少人動手、手機與桌機的差別」。

- 撐得住，但「多少人動手」沒有單一答案，隨元件差非常多。同一批桌機讀者：
  - 位於敘事中心、滑過就有反應的元件：85%（Beat Basics 播放節拍）、吉他撥弦中位數 22 次。
  - 需要點擊才展開的內容：全體約 45%，讀到文末的人 59%。
  - 滑桿與細節按鈕：互動次數中位數 0。
  - 進階功能：14% 與 2%。
  - 「照作者設想的方式用」：滑桿加上觀察結果只有約 5%；按了按鈕再去看圖約 15%。
  所以文章若寫「大多數讀者不會去動互動元件」，這篇**不支持**——Beat Basics 有 85% 動手。能寫的是「會動的是一碰就有反應、站在敘事正中間的那個元件；放在點擊後面或需要自己想到去調的，一半以上的人沒碰」。
- 「手機與桌機的差別」：停留時間是桌機的 23–52%；讀到文末 48% 對 76%；調好六條弦 6% 對 23%。但手機版本身功能較少，這個差別不能全算在裝置上。
- 必須連著寫的條件：
  1. 三篇文章、一個作者圈（Idyll 社群），其中一篇是論文作者自己寫的；讀者來自科技社群。
  2. 量的是**行為**，沒有量理解或學習。「讀者有沒有動手」和「動手有沒有學得比較好」是兩回事，這篇只回答前者。
  3. 沒有靜態版對照，無法說互動讓人讀比較久或比較多人讀完。
- 清單沒寫、但對 order 7 有用的：
  - 完讀率 73%、76%、45%（13 節的最長那篇最低）。
  - 作者給設計者的話：即使讀者不碰互動元件，敘事也要完整看得懂（L683–684）。
  - 最大的一群人是「捲過就走」（scroll & bounce），但原文沒有給比例。
  - 紐約時報 Tse 的說法在本篇只被引為「核心內容不該藏在點擊後面」（L651），沒有 10–15% 這個數字。

## 讀取紀錄

依序讀過原文檔 L1–460（首頁、摘要、第 1–5 節、6.1、6.2.1 前半）、L460–906（6.2.1 後半、6.2.2–6.3.3、第 7 節、參考文獻）。雙欄交錯的段落（第 1 節／第 2 節開頭、5.1／5.2、6.1.1 的 Q1–Q3、7.1／7.2）對照上下文接回；6.1.1–7.1 另外對著 PDF 第 6–9 頁讀了一次，確認百分比與 IQR 沒有錯位。

本篇沒有表格。圖 5、6、7、8、9、10 在 PDF 上看過：圖 7（滑桿最小值分布）沒有座標刻度，讀不出比例；圖 5、9、10 的 UMAP 只有文字標註，沒有人數。圖 1–4 只讀了圖說，沒有看 PDF 圖面。參考文獻只掃過。
