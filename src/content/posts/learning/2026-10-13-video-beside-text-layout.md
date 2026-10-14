---
title: "讀到一半想看影片時，畫面怎麼排：並排、浮動，還是捲回去"
date: 2026-10-13
category: learning
type: deep-dive
tags: [learning-science, youtube, self-learning, blog, ux]
lang: zh-TW
description: "教學文章配一支影片時，讀者點了時間連結，畫面該怎麼安排：整理 Papeos、LectureScape、Visual Transcripts、Video Digests 四個研究介面的版面與實驗結果、五個學習網站的實測、split-attention 的證據與近年沒有重現的實驗、浮動播放器的廣告資料，以及本站從右下角浮動改成左右對照的經過。"
tldr: "研究介面的共同做法是讓影片和對應的文字同時看得到：影片放在文字旁邊，或直接出現在讀者正在讀的那一段。Papeos 的 16 人實驗裡，把影片片段掛在段落旁的那一組，心理負荷的平均最低（三種條件的整體檢定顯著）。沒有實驗直接比較過長篇導讀配講課影片的版面；手機上怎麼做，目前沒有研究可依。"
series:
  name: "教學文章怎麼寫"
  order: 4
draft: false
---

> 🌏 [English version](/posts/learning/2026-10-13-video-beside-text-layout-en)

[上一篇](/posts/learning/2026-10-13-instructional-video-in-articles)談的是影片放在頁面哪裡、文章怎麼寫才幫得上忙，結論之一是每一節要能跳到影片的對應時間。照做之後馬上碰到下一個問題：讀者讀到第七節，點了那一節的時間連結，接下來畫面該發生什麼事？

這篇記錄本站怎麼處理這件事，包括一個當場被否決的做法，以及我回頭查到的研究。

## 先看結論

| 情況 | 做法 | 依據 |
|---|---|---|
| 寬螢幕（本站取 1200px 以上） | 點時間連結後，文章留在左半邊，影片固定在右半邊；讀者原本在讀的那一行不動 | 四個研究介面都讓影片與對應的文字同時可見；Papeos 的實驗裡，影片連到段落的那一組比「各開一個視窗」更容易在影片裡找到位置、兩種格式之間切換得更多，心理負荷的平均也最低 |
| 窄螢幕與手機 | 捲到播放器，同時給一個「回到剛才讀的地方」的按鈕 | 沒有研究來源，是本站的判斷；量到的網站裡只有 TED 在窄視窗把播放器固定住，固定的區域佔畫面約三分之一 |
| 影片不允許嵌入 | 時間連結另開 YouTube 到那一秒 | 沒有別的選擇 |
| 任何螢幕 | 不用小視窗蓋在正文上 | 影片縮小後投影片看不清楚；浮動元素的資料來自廣告版位，證據力有限 |

先講清楚這張表的強度：沒有一篇研究用實驗比較過「長篇導讀配一支講課影片」的不同版面。上面是把相近情境的結果搬過來，再加上本站自己試過的經驗。

## 問題從哪裡來

本站的課程導讀多數是一篇文章配一支錄影，播放器放在文章最上面，Harvard CS50 AI 系列就是這樣。每一節開頭有時間連結，例如「錄影 1:36:30–1:43:59」。

連結原本只是一條 YouTube 網址，點了會另開分頁。我先把它改成控制頁面上的播放器：點了之後播放器跳到那一秒，頁面捲回最上面讓讀者看到它。使用者試用後的反應是：

> 我在想有一點不方便，我要看內容要一直往上滑？

文章有六百多行，從第七節捲回頂端看影片，看完再自己找回第七節，來回一次就不想再點第二次。

### 第一個做法：右下角浮動，當場被否決

我的第一個修法是新聞網站常見的那一種：讀者點連結時如果播放器不在畫面上，就把它縮成一個小視窗釘在右下角，寬度最多 420px，旁邊放一個關閉鈕。

這個改動還沒套用就被使用者擋下，他反問浮在右下角這樣合理嗎。我回頭想，問題有三個：

- 小視窗會蓋住正文和程式碼，手機上幾乎佔掉半個畫面。
- 講課影片的重點在投影片，縮到 420px 寬，上面的字看不清楚。
- 讀者沒有要求它跟著走，卻多了一個要手動關掉的東西。

我接著去找研究怎麼說。

## 研究介面怎麼排

我讀了四個把「文字」和「可跳轉的影片」放在一起的研究系統。它們的版面不一樣，但有一個共同點：讀者看影片的時候，對應的文字仍然在眼前。

這四個不是系統性搜尋的結果。Video Digests 是上一篇就讀過的；另外三個來自兩組搜尋詞的結果，再沿著它們互相引用的關係補上。搜尋結果與這幾篇的相關研究裡還有 NoteVideo、VideoDoc、Codemotion、ViDeX、DynamicSlide、SmartLearn、NoteIt 等同類系統，我沒有讀。四篇都出自人機互動領域的研討會或期刊，教育領域的做法可能沒被涵蓋。

讀取範圍也不一樣：Papeos 讀了正文全部與附錄；Visual Transcripts 讀了演算法以外的各節；LectureScape 讀了介面、研究設計、結果與限制；Video Digests 這裡只用到摘要與導言裡的版面描述。

### Video Digests（2014）：每一章自己帶一個播放器

Amy Pavel 等人的 [Video Digests](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf) 把講課影片切成章與節。論文對版面的描述是：每一章由一個嵌入的播放器、一個章標題和一串小節組成，每個小節有一段文字摘要與一張代表畫面，點小節就從那一段開始播。影片跟著章走，讀者不必離開正在讀的那一章。它的瀏覽實驗結果上一篇已經寫過，這裡不重複。

### LectureScape（2014）：播放器在中間，可點的逐字稿在右側欄

Juho Kim 等人的 [LectureScape](https://www.eecs.harvard.edu/~kgajos/papers/2014/kim-uist14-lecturescape.pdf) 是一個講課影片播放器。論文描述的版面是：播放器在主畫面，時間軸在影片下方，關鍵字雲在上方，互動逐字稿在右側欄，重點畫面排在最下面；每個元件都可以收起來。

要注意它的實驗比的不是版面。12 位正在修那門入門程式課的學生，各用 LectureScape 和一個對照介面做八個任務。對照介面拿掉了「其他學生的觀看紀錄」相關功能，但保留互動逐字稿，版面與外觀也刻意做成一樣；論文說這是為了模擬 edX 或 YouTube 當時就有的功能。結果是：

- 找答案的任務，LectureScape 平均 96 秒、對照介面 106 秒，差異不顯著（p = 0.8）。
- 受試者自認用 LectureScape 比較快、比較有效率（7 點量表 5.8 對 4.8、6.1 對 4.8，p < 0.05）。
- 他們也覺得它比較難用（易用性 4.7 對 6.3），有人說畫面太複雜。

所以這篇能說的是「影片在主畫面、逐字稿在旁邊」是當時研究者與平台都採用的排法，不能說這個排法被實驗證明比較好。另一個值得記下的數字：在對照介面做找答案任務時，12 人裡有 11 人靠點逐字稿的文字來定位。

### Visual Transcripts（2015）：把講課內容排成一份講義，點了才播

Hijung Valentina Shin 等人的 [Visual Transcripts](https://dl.acm.org/doi/10.1145/2816795.2818123) 處理的是黑板式講課影片（可汗學院那一類）。系統把老師寫下的每一組筆畫切出來，和同一時間的口述文字交錯排成一份由上往下讀的文件。這份文件可以單獨讀，也可以連回影片：點任何一張圖或一句話，影片就從那裡播，播放時對應的圖文會被標示出來。

使用者研究有 9 人，三支 7 到 8 分鐘的大學數學講課，比較三種介面：YouTube 播放器加互動逐字稿、NoteVideo（把整塊黑板合成一張圖當導覽）、Visual Transcripts。

- 給 3 分鐘寫摘要，涵蓋的重點比例是 0.83、0.81、0.87，差異不顯著（p = 0.79）。
- 搜尋任務分三類。找文字和找圖文關係這兩類，三種介面的完成時間差異不顯著（p = 0.676）；只找畫面的那一類 NoteVideo 最快。把搜尋任務合起來看，Visual Transcripts 顯著快於 YouTube 播放器加逐字稿（p = 0.02），和 NoteVideo 沒有顯著差異（p = 0.12）。
- 兩種介面給的是同一份逐字稿文字，受試者對它的評價卻差很多：7 點量表上 Visual Transcripts 的逐字稿 6.3 分，YouTube 播放器旁的 4.7 分。用後者時，受試者多半改拖時間軸來找。
- 問到學習時偏好哪一個，9 人裡 7 人選 Visual Transcripts，理由包括「整份文字和算式都在」。

也就是說，寫摘要時三者分不出高下；找東西時，排成文件的版本贏過「播放器加一長串逐字稿」；偏好上也明顯傾向圖文交錯的文件。作者自己列的限制是只處理黑板式影片，而且靜態版面無法還原老師用游標指著說「這裡」的那種指涉。

### Papeos（2023）：影片片段掛在對應段落旁邊

Tae Soo Kim 等人的 [Papeos](https://arxiv.org/abs/2308.15224) 做的是「論文配作者的演講影片」，是我找到最接近「長文字配一支影片」的研究。

**先觀察讀者怎麼做。** 在一個前導測試裡，4 位研究者拿到並排的論文與影片，可以自由決定怎麼看。四個人都先把影片整支看完，才開始讀論文。他們說想過中途跳去讀論文，但在兩種格式之間對照的成本太高。

研究團隊接著做了一個探針介面，把影片片段預先連到論文段落並用顏色對應，找 14 位研究者來用。這次行為分成兩種：5 人以讀論文為主、偶爾切到影片，9 人跟著影片走、不時停下來讀論文。影片播到下一段時論文會自動捲到對應段落，這個設計有 3 人說打斷閱讀，6 人說害他們迷路。

同一批人接著以作者的身分設計自己想要的組合方式。14 人裡有 7 人反對用影片內容取代論文段落，理由是影片很少和論文一一對應，取代會漏掉資訊。團隊據此訂了五條設計目標，其中兩條和版面直接有關：讓讀者能專心看其中一種，也能隨時切換；不要用一種格式遮住或取代另一種。

**最後的介面。** 影片片段變成「影片筆記」，排在論文頁面右側、大致對齊它對應的段落，旁邊的色條標出相連的段落。點色條或筆記，縮圖就在原地變成播放器並放大，同時顯示那一段的逐字稿。每則筆記只播自己那一段，播完就停，不會自動接下一段，為的是不打斷已經回去讀論文的人。讀者如果想連續看影片，可以開自動播放，這時筆記固定在畫面上的同一個位置，換論文自己捲到下一個對應段落。

**比較實驗。** 16 位剛入行的人機互動研究者（12 位博士班一到三年級、4 位碩士生），每人讀三篇系統論文的系統章節，各有 15 分鐘邊讀邊寫摘要，三篇分別用三種條件：只有論文、論文加影片（各開一個分頁或視窗）、Papeos。

| 量測 | 只有論文 | 論文＋影片 | Papeos | 檢定 |
|---|---|---|---|---|
| 心理負荷（NASA-TLX，7 點） | 5.50 | 5.31 | 4.50 | p = 0.002（三種條件的整體檢定） |
| 摘要的涵蓋面 | 三者中 Papeos 最高，另兩者相近 | | | p = 0.043 |
| 摘要的細節數、連貫性 | 沒有差異 | | | p = 0.368、0.250 |

原文對心理負荷只報了三種條件一起的檢定，沒有報 Papeos 對「論文＋影片」的成對比較。時間壓力、費力程度、挫折感、自評表現四項在三種條件之間沒有顯著差異。操作紀錄顯示，用 Papeos 時受試者在兩種格式之間切換的次數顯著多於「論文＋影片」；後者的多數人還是先把影片看完，剩下的時間只讀論文，和前導測試看到的一樣。

這個結果對本站的意義，以下是我的解讀：把影片另外放一個地方、讓讀者自己去對照，效果和沒有影片差不多；把影片連到讀者正在讀的位置，兩種格式才會真的被交替使用。它沒有比較「影片放旁邊」和「影片浮在角落」，所以不能拿來直接否定浮動播放器。

作者列的限制：實驗只用了人機互動領域的系統論文，只讀一個章節，整場 90 分鐘。

## 實際的學習網站怎麼排

研究系統多半沒有上線。我另外用瀏覽器實際打開幾個有「影片配逐字稿或文字」的頁面，量播放器與文字的位置、捲動時播放器的行為，以及點逐字稿之後發生什麼事。量測日期是 2026-10-13，每個網站只量一頁，沒有登入。

挑選的理由：MIT OCW、Khan Academy、Coursera、edX 是課程平台；YouTube 是本站影片的來源；TED 的逐字稿頁是「長文字配一支影片」；freeCodeCamp 是文字題目配影片。Frontend Masters 的課程頁要登入，沒有量。

| 網站（量的頁面） | 1440 × 900 | 390 × 844 | 捲動時播放器 | 點逐字稿或時間標記 |
|---|---|---|---|---|
| [MIT OCW](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/)（6.006 第 1 堂影片頁） | 播放器 804 × 452 置中，逐字稿在正下方的分頁裡 | 播放器 284 × 160，逐字稿在下方 | 跟著頁面捲走 | 影片還沒播放時點逐字稿沒有反應；腳本按不到嵌入播放器裡的播放鍵，播放中的行為量不到 |
| [Khan Academy](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:solve-equations-inequalities/x2f8bb11595b61c86:linear-equations-variables-both-sides/v/why-we-do-the-same-thing-to-both-sides-multi-step-equations)（一支代數影片） | 播放器 960 × 540（左邊的課程清單收起時；清單展開的那一次量到 927 × 521）；逐字稿是影片下方的分頁，逐字稿那一塊高 250px、自己捲動 | 播放器 390 × 219，逐字稿分頁在下方 | 跟著內容捲走 | 點 1:40 那一句，影片跳到 104 秒並開始播放，頁面沒有移動；兩種寬度都一樣 |
| [YouTube](https://www.youtube.com/watch?v=WbzNRTTrX0g)（CS50 AI 第 0 週的觀看頁） | 播放器 996 × 560 在左，逐字稿面板在右、寬 396px | 播放器 390 × 240 在最上面 | 跟著頁面捲走 | 逐字稿面板在自動化瀏覽器裡一直載入中，量不到；改點說明欄的章節時間 00:54:29，影片跳到 3,269 秒並播放，頁面留在頂端 |
| [TED](https://www.ted.com/talks/sal_khan_let_s_use_video_to_reinvent_education/transcript)（一場演講的逐字稿頁） | 播放器 776 × 437 在左；逐字稿在右欄，寬 536px，是固定在畫面上、自己捲動的一欄 | 播放器 390 × 219 固定在 56px 的導覽列下方；逐字稿在下方一個可以關掉的面板裡捲動 | 寬視窗：播放器隨左欄捲走，右邊的逐字稿欄留著；窄視窗：播放器固定 | 點一段逐字稿，影片跳到 104 秒；寬視窗的頁面移動了 56px，窄視窗沒有動 |
| [freeCodeCamp](https://www.freecodecamp.org/learn/machine-learning-with-python/tensorflow/introduction-machine-learning-fundamentals)（一題影片題） | 播放器 945 × 532 在上，題目在下，沒有逐字稿 | 播放器 330 × 186 | 跟著頁面捲走 | 頁面上沒有可點的時間標記 |
| Coursera | 量不到：講課網址被導回課程介紹頁，沒登入看不到播放器 | | | |
| edX | 量不到：課程介紹頁沒有課程影片的播放器，課程內容要登入 | | | |

從這五個量得到的頁面可以看到三件事：

- 文字都緊鄰播放器，在正下方或右邊。沒有一個頁面在捲動時把播放器縮到角落。
- Khan Academy 和 TED 把逐字稿放進一個自己捲動的區塊。讀者捲的是逐字稿，播放器留在原處，所以點了之後頁面不必移動。這和左右對照是同一個想法：讓會變長的那一半自己捲。
- 窄視窗裡只有 TED 把播放器固定住。播放器本身佔 844px 高的畫面約 26%，連同上方的導覽列是 275px，約 33%。

這些量測的限制：每個網站只看一頁；窄視窗是把桌機版 Chrome 的視窗縮到 390 × 844，沒有模擬手機的瀏覽器識別與觸控，會另外提供手機版網站或 App 的服務（例如 YouTube）量到的不是手機使用者實際看到的畫面；沒有登入；截圖與原始數字在本站 repo 的工作目錄，沒有公開。

## 文字和畫面離多遠有沒有差

教育心理學有一個相關的概念叫 split-attention（注意力分散）：互相參照的文字和圖如果分開放，學習者要自己在兩者之間來回對照，這份功夫會佔掉本來可以拿來理解內容的心力。對應的設計原則叫空間鄰近（spatial contiguity）。

**彙整多篇研究的回顧支持這個原則。** Noetel 等人彙整 29 篇系統性回顧的[總覽](https://doi.org/10.31234/osf.io/pynzr)（我讀的是預印本）把空間與時間鄰近列為效果最大的幾項原則之一。它轉引 Schroeder 與 Cenkci 2018 年的統合分析：58 個比較裡，把相關的文字和圖放近，學習成果優於分開放，效果量 g = 0.63。這個數字是 Noetel 轉引的，原論文我沒有取得全文。

同一份總覽有一個和網頁直接相關的調節變項：設計原則在「系統控制步調」的教材上效果較大（g = 0.41，例如講課），在「學習者自己控制步調」的教材上較小（g = 0.27，例如網站），兩者差異顯著（p = 0.02）。作者的解釋是，能自己控制步調的學習者比較容易用自己的方法應付負荷。讀文章、隨時可以暫停影片的讀者屬於後者，版面好壞造成的差別可能沒有課堂研究裡那麼大。最後這一句是我的推論。

**近年的實驗沒有穩定重現。** Zhang、de Koning 與 Paas 2024 年的[實驗](https://pure.tudelft.nl/ws/portalfiles/portal/213485394/Applied_Cognitive_Psychology_-_2024_-_Zhang_-_Does_presentation_size_of_instructional_materials_influence_the.pdf)找了 146 名大學生讀一份講腎元的圖文教材，分成四組：文字和圖分開或整合，乘上版面大或小。記憶測驗、理解測驗和自評的外在認知負荷，都沒有發現格式、大小或兩者交互作用的效果，貝氏分析也偏向支持「沒有差別」。作者提到他們先前用同一份教材的兩個研究，一個有效果、一個沒有，並說這個效果在什麼條件下出現還需要釐清。

另外有一篇實驗比較「在單一螢幕上切換影片與軟體」和「兩個螢幕並排」（Kueker 與 Moore，2023，Journal of Computer Assisted Learning）。我只讀到摘要，沒有取得全文，所以這裡只交代有這篇研究，不引它的結果，也不拿它當依據。

上面我讀過的兩份證據裡，Zhang 等的實驗測的是文字配圖，Noetel 的總覽彙整的是各種多媒體教材的設計原則；沒有一個專門測文章配講課影片。

## 浮動播放器的資料來自廣告

我找不到研究學習成效的人測過浮動播放器。找得到的資料來自廣告業。

廣告代管商 CafeMedia 在 [2021 年的文章](https://cafemedia.com/best-practices-for-sticky-elements-in-ux-design/)裡寫，看旗下數千個網站的資料：

- 桌機上，浮動影片播放器離內容比較遠，只在不到一成的瀏覽中被關掉。
- 手機上，固定在畫面的元素合計超過螢幕三成的網站，播放器被關掉的比例明顯上升。
- 讀者不分那是廣告還是一般內容，只要干擾到閱讀，關掉的頻率一樣。
- 以它舉例的手機尺寸，一個不帶標題列的浮動播放器（272 × 153 px）佔螢幕 17%。

三成這個數字出自 Coalition for Better Ads。它的[標準頁](https://www.betterads.org/standards/)把「大型固定廣告」列為手機網頁上讀者最不能接受的廣告體驗之一，[定義](https://www.betterads.org/mobile-large-sticky-ad/)是固定在頁面一側、佔螢幕超過 30%、不隨捲動離開的廣告。該組織說到目前為止有超過 15 萬名消費者參與過它的研究。

這些資料的限制很明顯：CafeMedia 賣的是廣告版位，量的是「播放器有沒有被關掉」，播放的是廣告影片；Better Ads 量的是消費者對廣告的反感程度。讀者自己點連結叫出來的教學影片，和自動跳出來的廣告不是同一回事。我只把它當成兩個提醒：固定在畫面上的東西在手機上很快就佔掉太多空間，以及一定要給讀者關掉它的方法。

## 近年的整理怎麼說

**可點的目錄和時間軸大致有幫助，但證據零散。** Navarrete 等人 2025 年的[回顧](https://link.springer.com/article/10.1007/s40593-025-00481-x)整理了 2016 到 2021 年間 257 篇影片學習的研究（我讀了摘要、方法、工具分類、對照實驗與限制等章節，沒有讀完全文）。其中 57% 是做工具，25% 是對照實驗。導覽工具裡很多是可點的目錄，另外也有用關鍵字與畫面縮圖導覽的。談到效果時，回顧寫的是：用目錄導覽或可點時間軸的實驗「大致上」發現對學習成果有正面效果，但不一定顯著，或者是和其他功能綁在一起測的。作者說因為各研究的設定差異太大，沒辦法做統合分析；另一個限制是只搜了電腦科學領域的三個資料庫。

另有一篇針對影片互動功能的統合分析（Ploetzner，2022，Interactive Learning Environments），我只讀到摘要，沒有取得全文，所以只交代有這篇研究，不引它的結果。

我的推論：時間連結的用處是讓讀者找得到位置，這一點有 Navarrete 的整理支持；要學得比較好，還是得靠讀者動手作答，這一點的依據是[上一篇](/posts/learning/2026-10-13-instructional-video-in-articles)讀過的暫停寫解釋實驗，這一篇沒有新的全文證據。

## 本站最後的做法

### 寬螢幕：左右對照

本站有 242 個文章檔（中英各 121）嵌了兩支以上的影片，最多 5 支；其餘 640 個有嵌影片的檔案各只有一支。先講一支的情況。

最直接的想法是把播放器放進文章頁現有的側欄。量了之後發現側欄只有 340px 寬，比被否決的浮動視窗還小，所以沒有這樣做。

現在的做法是：視窗寬度在 1200px 以上時，讀者點任何一個時間連結，頁面切成左右兩半。

- 左半是文章，照常捲動；側欄的目錄暫時收起來。
- 右半是播放器，固定在畫面垂直置中的位置。
- 播放器上方有一個「結束對照 ×」按鈕，按了回到原本的版面。
- 視窗被拉窄到 1200px 以下時自動結束對照。

在 1440 × 900 的視窗實測，文字欄從 752px 變成 688px，播放器從 750 × 421 變成 678 × 381，兩者都只縮了約一成。點連結前後，被點的那一行在畫面上的位置差 0.2 個像素；結束對照時，畫面中間那個段落的位置差 0.1 個像素。

一篇嵌了好幾支影片時，程式的做法是：讀者點哪一支影片的時間連結，固定在右邊的就換成那一支，其他已經在播的播放器會被暫停。站上目前沒有一篇文章的兩支影片都帶時間連結，所以這個切換我只讀了程式，沒有在瀏覽器裡實測。

這個版面最像 LectureScape（影片與文字各佔一塊、同時可見）。它和 Papeos 的差別是影片固定在一處，沒有出現在段落旁邊；課程導讀多半一篇只配一支長錄影，要在每一節旁邊各放一個播放器，等於改掉整個嵌入方式。

### 窄螢幕與手機：捲過去，但給一條回來的路

視窗不夠寬時維持原本的行為：捲到播放器。差別是畫面下方會出現一個「↩ 回到剛才讀的地方」按鈕，按了捲回點連結時的位置，按鈕自己消失。如果點連結時播放器本來就在畫面上，就什麼都不捲。

這一半沒有研究支持。我考慮過讓播放器固定在手機畫面上方，上面量到的 TED 逐字稿頁就是這樣做的：390 × 844 的視窗裡，全寬的 16:9 播放器高 219px，加上它上方 56px 的導覽列，固定不動的區域共 275px，佔畫面約 33%，已經超過 Better Ads 那條 30% 的線。那條線是替廣告訂的，能不能套到讀者自己叫出來的影片，是我的推論。TED 把逐字稿放在一個可以關掉的面板裡，本站的正文沒辦法關掉，所以先選比較保守的做法。

### 實作時守住的四件事

1. **切換版面時，讀者正在讀的那一行不能動。** 版面一變寬度就變，文字會重排，頁面高度跟著變。做法是切換前記下一個參考元素在畫面上的位置，切換後量它的新位置，把差距捲回來。進入對照用被點的連結當參考；結束對照用畫面左半中間的那個段落。
2. **要有明顯的關閉方式。** 按鈕寫字，不只放一個叉。
3. **不遮住正文。** 文章和影片各佔一半，沒有重疊。
4. **只改樣式，不搬動 iframe。** [HTML 標準](https://html.spec.whatwg.org/multipage/iframe-embed-object.html)規定 iframe 從文件中移除時，它裡面的文件會被銷毀，重新插入時建立新的。把播放器搬到別的容器等於重新載入，播放進度就沒了。所以固定位置只靠 CSS 的 `position: fixed`，元素留在原地。

另外兩個細節：按住 Cmd 或 Ctrl 點連結，仍然照瀏覽器預設另開 YouTube；播放器還沒被捲進畫面過的時候，第一次點連結只能讓它從那一秒重新載入，讀者要自己按一次播放，之後再點才是直接跳過去並播放。

### 做不到的情況：影片不允許嵌入

以上都建立在影片能在頁面上播放。本站的 Stanford CS229 Spring 2026 系列做不到：我用 yt-dlp 查第 2 堂的影片，`playable_in_embed` 是 `False`；正式站上第 2、3 堂原本該是播放器的位置，顯示的是「此影片禁止站內嵌入，請前往 YouTube 觀看」。這類文章的時間連結只能另開 YouTube 到那一秒。同系列其餘各堂我沒有逐支查。

Harvard CS50 AI 的七支講課影片用同一個方法查都允許嵌入，上面的實測是在那個系列的第 0 週做的。

## 這些證據的限制

- **沒有研究直接比較過這個情境的版面。** 長篇導讀配一支講課影片，影片該固定在旁邊、出現在段落裡，還是浮在角落，我沒有讀到任何對照實驗。
- **四個研究介面比的是「新介面對一般播放器」。** 樣本是 9、12、16 人和一次群眾外包；LectureScape 的兩個條件版面相同；Visual Transcripts 只有「搜尋任務合計、對一般播放器」這一項顯著，摘要任務與其他比較都不顯著。四個系統也不是系統性搜尋選出來的。
- **Papeos 的材料是論文配作者的研討會演講影片**，原文沒有給影片長度，只說這類影片長度受限；讀者是研究生，任務是 15 分鐘內寫摘要。搬到 80 分鐘的課堂錄影是我的延伸。
- **split-attention 的實驗測的是文字配圖**，而且近年有樣本不小的實驗沒有重現效果；統合分析的數字是 Noetel 轉引的，原論文沒有讀到。統合分析的結論與單一實驗不一致時，我沒有能力判斷誰對。
- **浮動播放器的資料是廣告業的**，量的是關閉率，不是學習。
- **手機的做法沒有研究來源。** 量到的網站裡只有 TED 在窄視窗把播放器固定住，而那是把桌機瀏覽器縮窄量到的。
- **實際網站只各量了一頁**，Coursera 與 edX 因為要登入而量不到，YouTube 的逐字稿面板在自動化瀏覽器裡載不出來。
- **我的推論有四處**：Papeos 的結果代表「影片要連到讀者所在的位置」；自控步調的讀者受版面影響較小；Better Ads 替廣告訂的 30% 可以拿來衡量讀者自己叫出來的影片；時間連結的價值在定位、學習靠作答。正文都當場標了。
- **沒有取得全文的三篇**：Schroeder 與 Cenkci（2018）、Kueker 與 Moore（2023）、Ploetzner（2022）。出版社頁面、OpenAlex 登記的開放取用位置、Exa 都試過，只拿到摘要。前一篇的數字改用 Noetel 的轉引，後兩篇只交代有這篇研究，不寫結果，也不列進參考資料。Noetel 等讀的是預印本，Navarrete 等沒有讀完。
- **多支影片的切換沒有實測**，只讀了程式。
- **本站的實測只在桌機版 Chrome 上做過**（1440 × 900、1199 × 900、390 × 844 三種視窗），沒有量過讀者實際點了幾次、看了多久。

## 附錄：各研究的設計與數字

**Pavel、Reed、Hartmann、Agrawala（2014）**，UIST。版面與瀏覽實驗見[上一篇的附錄](/posts/learning/2026-10-13-instructional-video-in-articles)。

**Kim、Guo、Cai、Li、Gajos、Miller（2014）**，UIST，LectureScape。受試者 12 人（5 男，平均 25.6 歲），都正在修影片所屬的入門電腦科學課，其中 4 人是 edX 學生。每場 75 分鐘，酬金 30 美元。八個任務：四個找畫面、兩個找答案、兩個寫摘要，介面順序與影片分配做了平衡。對照介面做找答案任務時，10 人用關鍵字搜尋、11 人點逐字稿；用 LectureScape 時各降到 6 人，另有 6 人改點時間軸上的高峰。問到功能是否齊全，LectureScape 6.4 分、對照 4.3 分。作者說單場實驗看不出個人書籤這類功能的用處。

**Shin、Berthouzoz、Li、Durand（2015）**，ACM Transactions on Graphics 34(6)。系統共產生 20 份 Visual Transcripts，10 份來自可汗學院。受試者 9 人（2 女 7 男，20 到 35 歲），熟悉該科目但沒看過那三支影片。三支影片長 8、7.2、8 分鐘。摘要任務的細節點涵蓋比例是 0.50、0.56、0.58（p = 0.62）。只找畫面的搜尋任務 NoteVideo 最快，因為它把所有畫面放在同一個畫面裡。搜尋任務合計：Visual Transcripts 對一般播放器 Z = −2.1、p = 0.02，對 NoteVideo Z = 1.2、p = 0.12。找錯的比例是 0.06（Visual Transcripts）、0.07（NoteVideo）、0.15（一般播放器），差異不顯著。問到寫摘要時偏好哪個，5 人選 NoteVideo、4 人選 Visual Transcripts。

**Kim、Latzke、Bragg、Zhang、Chang（2023）**，UIST，Papeos。形成性研究 14 人：10 位博士生、2 位碩士生、1 位博士後、1 位大學部學生，多數是人機互動領域。比較實驗 16 人，每場 90 分鐘，酬金 45 美元；三篇論文順序固定、條件順序平衡；摘要最多 14 句，不能複製貼上。摘要由兩位沒看過實驗過程的作者盲評（細節標註的 Cohen's kappa 0.712）。自評「任務容易」受條件影響（p = 0.030）；在論文內導覽的容易度受條件影響（p = 0.035）；在影片內定位，Papeos 優於論文＋影片（p = 0.034）。論文內的捲動次數，Papeos 與只有論文相近，論文＋影片較少（p = 0.003）。共同設計階段，14 位作者畫出的組合方式有八類，其中一類是可調整比例的左右並排。蒐集到的 Papeos 平均每份有 20.6 組連結，每段連結的影片平均 24.3 秒。另有一次實地部署：CSCW 2022 會議兩週內 288 位不重複使用者，共 12 份 Papeos，平均每次使用 5.74 分鐘。

**Noetel 等（預印本，正式版刊於 Review of Educational Research）**。它轉引 Schroeder 與 Cenkci（2018）的空間鄰近效果：g = 0.63，95% CI 0.55–0.71，58 個比較。摘要寫 29 篇回顧、1,189 個研究、78,177 名受試者；預印本內文的流程說明寫的是 79,415 人，兩處不一致，我照摘要。步調的調節效果：系統控制 g = 0.41（95% CI 0.33–0.49），學習者控制 g = 0.27（0.19–0.35）。教材越複雜，設計原則越重要（複雜 g = 0.70，簡單 g = 0.20）。

**Zhang、de Koning、Paas（2024）**，Applied Cognitive Psychology 38。146 名大學生（平均 20.9 歲，88% 母語不是英語），四組各 35 到 37 人。事前檢定力分析要求 128 人。教材在螢幕上呈現，大的版本 1700 × 1002 像素、小的 1100 × 648 像素，學習時間固定 12 分鐘。記憶測驗 10 題配對，理解測驗 24 題選擇。作者說這次沒有重現他們 2023 年用同一份教材、在紙本上得到的效果，並轉引 Schroeder 與 Cenkci（2018）：紙本研究的效果比電腦螢幕上的研究大。作者列的限制包括媒介從紙本換成螢幕、兩種大小可能差得不夠多、時間給得夠長時學習者也許能自己消化多出來的負荷。

**Navarrete、Nehring、Schanze、Ewerth、Hoppe（2025）**，International Journal of Artificial Intelligence in Education。依 PRISMA 流程，搜尋 SpringerLink、ACM Digital Library 與 DBLP。對照實驗約八成用 STEM 領域的影片，最常見的製作形式是投影片式。

## 參考資料

- [Kim, Latzke, Bragg, Zhang & Chang (2023), Papeos: Augmenting Research Papers with Talk Videos](https://arxiv.org/abs/2308.15224)：讀了 arXiv 版的正文全部與附錄。
- [Kim, Guo, Cai, Li, Gajos & Miller (2014), Data-Driven Interaction Techniques for Improving Navigation of Educational Videos](https://www.eecs.harvard.edu/~kgajos/papers/2014/kim-uist14-lecturescape.pdf)：讀了介面、研究設計、結果與限制。
- [Shin, Berthouzoz, Li & Durand (2015), Visual Transcripts: Lecture Notes from Blackboard-Style Lecture Videos](https://dl.acm.org/doi/10.1145/2816795.2818123)：讀了摘要、導言、相關研究、設計原則、成果、使用者研究、限制與結論；第 4 節的演算法只看了各小節開頭。
- [Pavel, Reed, Hartmann & Agrawala (2014), Video Digests](http://vis-ucb-maneesh.stanford.edu/papers/videodigests/videodigests_small.pdf)：版面描述出自摘要與導言。
- [Noetel et al., Multimedia Design for Learning: An Overview of Reviews With Meta-Meta-Analysis（預印本）](https://doi.org/10.31234/osf.io/pynzr)：讀了摘要、方法、鄰近原則與調節變項、限制。
- [Zhang, de Koning & Paas (2024), Does presentation size of instructional materials influence the split-attention effect?](https://pure.tudelft.nl/ws/portalfiles/portal/213485394/Applied_Cognitive_Psychology_-_2024_-_Zhang_-_Does_presentation_size_of_instructional_materials_influence_the.pdf)：讀了摘要、方法、結果、討論與限制；導言只讀了摘錄。
- [Navarrete, Nehring, Schanze, Ewerth & Hoppe (2025), A Closer Look into Recent Video-based Learning Research](https://link.springer.com/article/10.1007/s40593-025-00481-x)：讀了摘要、方法、導覽與互動工具、對照實驗、效果整理與限制。
- [CafeMedia (2021), Best practices for sticky elements in UX design](https://cafemedia.com/best-practices-for-sticky-elements-in-ux-design/)：讀了全文。
- [Coalition for Better Ads: Better Ads Standards](https://www.betterads.org/standards/)與 [Large Sticky Ads 的定義](https://www.betterads.org/mobile-large-sticky-ad/)。
- 實際量測的五個頁面（2026-10-13，Playwright 驅動的 Chrome）：[MIT OCW 6.006 第 1 堂](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-1-algorithms-and-computation/)、[Khan Academy 影片頁](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:solve-equations-inequalities/x2f8bb11595b61c86:linear-equations-variables-both-sides/v/why-we-do-the-same-thing-to-both-sides-multi-step-equations)、[YouTube 觀看頁](https://www.youtube.com/watch?v=WbzNRTTrX0g)、[TED 逐字稿頁](https://www.ted.com/talks/sal_khan_let_s_use_video_to_reinvent_education/transcript)、[freeCodeCamp 影片題](https://www.freecodecamp.org/learn/machine-learning-with-python/tensorflow/introduction-machine-learning-fundamentals)。
- [HTML Standard: The iframe element](https://html.spec.whatwg.org/multipage/iframe-embed-object.html)：iframe 插入與移除時的處理步驟。
- 本站文章：[教學文章搭配影片怎麼做](/posts/learning/2026-10-13-instructional-video-in-articles)、[Harvard CS50 AI 第 0 週導讀](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)（實測用的頁面）、[Stanford CS229 第 2 堂導讀](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression)（影片不允許嵌入的例子）。
