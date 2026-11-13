# 抽取紀錄：Red Blob Games（Amit Patel）三頁製作筆記，2014／2017／2018

三頁同一作者、同一網站，清單列為一列（order 7 #11），合寫一份。

- **作者**：三頁的頁面正文都只署「Red Blob Games」，沒有印作者姓名。作者名 Amit J. Patel 出現在三份 HTML 原始碼的註解裡（`amitp@cs.stanford.edu (Amit J. Patel)`），About 連結指向 `~amitp/`。引用時寫「Amit Patel（Red Blob Games）」要知道姓名不是從頁面正文來的。
- **版本**：作者個人網站上的原頁。都沒有 DOI。
- **讀取日期**：2026-10-14
- **供哪幾篇使用**：order 7（該不該做互動）#11

| 代號 | 題名 | 網址（HTML 的 canonical） | 頁面日期 | 原文檔與長度 |
|---|---|---|---|---|
| A | Making of: Introduction to A* | https://www.redblobgames.com/pathfinding/a-star/making-of.html | 頁首 2 Sep 2014；頁尾「Created 30 Aug 2014」「Last modified: 12 Nov 2020」 | `.research/raw/learning-content/q2-interactive/redblob-astar-making.txt`，181 行、10,335 字元／10,453 位元組 |
| B | Making of: Line drawing tutorial | https://www.redblobgames.com/making-of/line-drawing/ | 頁首 15 May 2017；頁尾「Created May 2017」「Page last modified 2026-09-29」 | `…/redblob-making-line.txt`，620 行、22,696 字元／22,892 位元組 |
| C | Diagram structure (blog post) | https://www.redblobgames.com/making-of/diagram-structure/ | 頁面沒有印日期。開頭註明同文也貼在作者的部落格，兩個連結的網址路徑是 2018/02 與 2018/03（L119–121） | `…/redblob-diagram-structure.txt`，142 行、9,702 字元／9,806 位元組 |

三份文字檔都是從同目錄的 `.html` 轉出的。**互動圖、截圖與示意圖在文字檔裡全部沒有留下**，只剩圖說；A 頁列出的二十幾張圖只有標題（L77–117），B 頁每一步的可操作範例都不在，C 頁的流程圖（「The flow is:」之後，L25–27、L35、L57）是空的。

## 研究設計

不是研究。是一位長期寫互動教學的作者寫給同行的製作筆記：A 是過程自述（自稱「these notes are rough」，原本寫給幾位同事，L17），B 是一步一步重做一篇教學前半的示範，C 是談圖的程式怎麼組織。沒有量測、沒有工時紀錄、沒有讀者資料。

## 內容（逐項）

### A：Making of: Introduction to A*（2014）

| # | 說了什麼 | 行號 | 原文一句 |
|---|---|---|---|
| A1 | **一篇教學要多久** | L21 | 「I need to learn the algorithm and data structures I want to demonstrate. Sometimes I already know them. Sometimes I know nothing about them. It varies a lot. **It can take 1 to 5 months to make a tutorial.** It's slow, but the more I make, the faster I am getting.」 |
| A2 | 先決定要畫什麼 | L23 | 從演算法的輸入、輸出、內部變數找「the main idea to visualize」；A* 是 frontier（open set）。「Sometimes the thing I want to visualize is one of the algorithm's internal variables, but not always.」 |
| A3 | 頁面結構 | L25 | 通常先放問題的描述與示範；之後或者從基礎往上疊（機率、A*、noise），或者從一個直覺的答案開始再改進（curved roads、visibility），或者混用（hexagons）。 |
| A4 | 工具 | L27 | 通常用 d3.js，把它當「a visualization construction kit」；每個專案寫一個小函式庫。 |
| A5 | 推翻上一段的整齊說法 | L29–33 | 「Actually that last part is not true. It's not true at all. … It's more of a wibbly wobbly timey wimey mess. I take a stab at something, then learn from it, then add hack upon hack until it works, or it becomes too unwieldy and I come with a better approach. I do a lot on paper. I go on nature walks. I sleep on ideas. It's not structured at all, which might be why it takes so long.」 |
| A6 | 目標是頁面，不是程式 | L35 | 「I'm trying to make a beautiful page, not beautiful code.」 |
| A7 | 圖用圖層組成 | L37–69 | 頁首那張圖的圖層：可拖曳的終點、可拖曳的起點、最短路徑（算出來的輸出）、地圖（輸入）、一個看不見的編輯圖層。附一段建構 Diagram 的程式。 |
| A8 | 重畫策略 | L71 | 任何東西改了就全部重畫，有效能問題才最佳化。 |
| A9 | 這一頁的圖的數量 | L75 | 「It's not worth building an abstraction for approx. 20 diagrams.」L77–117 列了 6 張加 13 張圖的標題。 |
| A10 | **事前不知道自己要什麼** | L119–127 | 「What really happens is that I don't know what I want until after I try something.」先做 frontier 的圖 → 發現想要暫停、前進、後退 → 量了時間發現搜尋很快、慢的是畫圖，所以每次重跑搜尋就好；做前進（容易）、不做後退（較難）→ 重寫圖的系統 → 寫到後面發現要並排比較 → 再重寫一次。「It's only through the process of writing that I figure out what I want to write, and what my diagram code needs to support that. … I don't want to invest a lot into the first few versions of the code because it's likely I'm going to change everything.」 |
| A11 | 沒有通用做法 | L129 | 「so far I haven't come up with one universal approach that I can use for all the tutorials. Each one gets its own approach, and I occasionally reuse code from one project to the next.」 |
| A12 | 作者自己還沒想清楚的事（原文是問句清單） | L131–151 | 見下一節。 |
| A13 | 頁尾的過期註記 | L153 | 「Note: this page describes the diagrams I implemented in 2014, but I redesigned them in 2020 and this page does not reflect the new design.」 |

### B：Making of: Line drawing tutorial（2017）

| # | 說了什麼 | 行號 | 原文一句 |
|---|---|---|---|
| B1 | 這頁在做什麼 | L45–55 | 重做 line drawing 教學的前半，用 D3.js v4 與 SVG。「The line drawing tutorial was a medium sized project for me, with multiple diagrams, multiple layers in each diagram, draggable handles, and scrubbable numbers.」「This is an interactive tutorial about making interactive tutorials.」**沒有說這篇花了多久。** |
| B2 | 圖與文字的先後 | L100 | 「Sometimes I'll add a diagram first and then add some text; other times I'll start with the text and then figure out the diagrams.」 |
| B3 | 先寫死、需要時才算 | L120 | 「often times I will hard-code it when I'm just starting out, and only calculate it if I need to.」 |
| B4 | 先有能動的演算法與圖 | L141–143 | 「It's a working implementation of the algorithm and a working diagram. But it's not interactive.」 |
| B5 | **互動的基本型：讓讀者改輸入、顯示輸出** | L147 | 「What I most often do for interaction is let the reader change the inputs to the algorithm and then I show the outputs.」 |
| B6 | 讓讀者看得出哪裡能動 | L173、L378、L577 | 可拖曳的圓設 `cursor:move`、可拖動的數字設 `cursor:col-resize`、加陰影：「The combination makes the interactive elements respond immediately, telling the reader that they're the right things to click on.」 |
| B7 | **能互動不等於有解釋** | L233 | 「Great! Now I have an interactive diagram. But this isn't an explanation.」 |
| B8 | 怎麼把演算法拆開來講 | L237 | 「To explain how an algorithm works, I sometimes break it down into the steps of the execution and sometimes into the steps of the code. For a tutorial like my introduction to A*, I showed the execution. For line drawing, I want to show the steps of the code」：數字的線性內插 → 點的線性內插 → 線上的步數 → 對齊格線。為了分段展示，原本寫成一個函式的演算法也要跟著拆開（L384、L474）。 |
| B9 | 可拖動的數字 | L328–340 | 參考 Bret Victor 的 Tangle；「Scrubbable numbers are cool but a little bit tricky.」 |
| B10 | 一次性的例外就留著 | L380 | 「Sometimes it's easier to keep the hack than to try to build a general abstraction that's only used once.」 |
| B11 | 做第二張圖時弄壞第一張 | L429 | 「I broke the first diagram while making the second one work.」之後才引入圖層。 |
| B12 | 圖層系統不跨教學共用 | L470 | 「I don't have a generic layer system that I use across my tutorials. I make one specific for each tutorial that needs it. … The one here is only 8 lines of code」 |
| B13 | 收尾的十二項 | L551–579 | 「Although I have the essentials working, I usually spend some time making the diagrams look good and feel good.」特殊情況（起點終點相同）、邊界檢查、樣式放 CSS、用 HSL 選色、主次分明、格線樣式、軌道線、中間點、畫出的線半透明、**拖曳把手用一個小的可見圓加一個大的隱形圓接事件**、**可拖動數字太小、觸控裝置上特別難按，所以放大並固定寬度**、互動回饋。「There are lots more ways to make the page better but these will give a lot of benefit for little effort.」 |
| B14 | 原始碼公開 | L585 | 範例教學的原始碼是公眾領域，請讀者拿去改。 |

### C：Diagram structure（2018）

| # | 說了什麼 | 行號 | 原文一句 |
|---|---|---|---|
| C1 | 圖的資料流 | L25–27 | 控制項與視覺化是讀者看到的；輸入、演算法、輸出在背後跑。 |
| C2 | 機率頁（最早的互動文章之一） | L31–37 | 每一節先建好圖，任何控制項動了就更新全部的圖。 |
| C3 | 六角格頁的教訓 | L39–45 | 方向切換會影響整頁的圖，要手動記哪些圖依賴它：「If I added a diagram that depended on it, and forgot to change the code on those buttons, the diagram wouldn't be drawn when it should be.」「This worked but it wasn't great.」 |
| C4 | A* 頁 | L47–55 | 兩張並排的圖共用地圖與滑桿、各自跑搜尋；用 Observer pattern。「However, as I added more features it still felt like I was manually linking things up. I ended up redrawing everything any time anything changed.」 |
| C5 | **建議從最笨的做法開始** | L65–71 | 「Erase everything and draw from scratch! Run the algorithm again each time! … I like easy. I recommend starting with this approach. Some of my pages were too slow when I did this, so I had to use more complicated approaches.」 |
| C6 | 最難的不是畫圖 | L83 | 「At the time I thought data visualization was the hardest part of what I was doing … I've realized that the visualization isn't the hardest part of what I'm trying to do.」兩個大問題是「怎麼更新視覺化」與「哪些演算法要重跑」。 |
| C7 | 更新視覺化的三種做法 | L89–97 | 全部重畫；d3 的 data join（「a bit overkill for most of my projects」）；虛擬 DOM。「I've been using approach 2 but will be trying approach 3 for future projects.」 |
| C8 | 重跑演算法的四種做法 | L99–111 | 全部重跑；依控制項手動決定（「error prone」）；演算法標明依賴的輸入；系統自動追蹤依賴（ObservableHQ、Vue）。「Tracking dependencies manually, even if using the Observer pattern, is error prone.」 |
| C9 | 寫的是文件不是應用程式 | L97 | 「since I am writing documents instead of web applications, I prefer to describe the output in document form (html/svg) instead of code form (javascript). However, this is just a preference」 |
| C10 | 目的是做得更快 | L113 | 「Every once in a while to I like to pause to examine my work and try to figure out what's time consuming or error prone. I'm hoping switching to a more functional+declarative style will allow me to make interactive tutorials more quickly in the future.」是期望，沒有說結果。 |

## 作者自己列的限制與未解的問題

A 頁「Things I'm thinking about」（L131–151）全部是作者自己提的問題，沒有答案：

1. 「I don't believe all problems lend themselves to this kind of explanation. What kinds of problems do?」
2. 要不要給程式碼：「I find that I learn best by implementing the algorithm myself, so I fear that by giving out code, people won't learn it as well.」
3. **讀者只能動資料、不能動程式**：「I let the reader manipulate the data but not the code. But when I'm implementing the page, I'm manipulating the code, and I feel I understand the problem much better after I work with the code. Am I shortchanging my readers?」
4. **怎麼把讀者帶到參數空間裡有教育意義的點**：「There are points in that parameter space that are more interesting or educational than other points. How do I guide the reader to those points?」
5. 手機、平板、桌機的版面，連文字都要配合：「It's not just the html/css but I also need the text to match.」
6. 觸控與滑鼠：「Using the default emulated mouse events hasn't worked well for some of my diagrams.」
7. 要不要有不靠 JavaScript 的備援版：「That seems to conflict with my goal of making the diagram essential for understanding the page.」
8. 圖用的程式（要能中斷、要露出內部變數）與給讀者看的範例程式（要盡量簡單）是分開寫的兩份。
9. 「How do I write these pages faster? What's taking the most time?」

其他保留：A 頁自稱筆記粗略，而且描述的是 2014 年的做法，2020 年重做後沒有更新（A13）；B 頁只重做教學的前半，而且為了示範做了簡化（L122「I did this in the original article but I didn't for this tutorial」）；C 頁的偏好作者自己說「this is just a preference, and you should follow your own preference」。

## 與摘要說法不一致的地方

三頁都沒有摘要。逐頁對過開頭與內文：

- A 頁在第 27 行先給了一個整齊的說法（先設計好 Diagram 類別），第 29 行自己推翻（「Actually that last part is not true」）。這是作者刻意的寫法，不是矛盾；但只引 L27 會引到他自己否定的版本。
- B、C 兩頁開頭與內文一致。

## 與清單「要撐的結論」不合的地方

清單寫：「一位熟手一篇要多久、怎麼做」。

1. **「要多久」只有一句話可用，而且很粗**：「It can take 1 to 5 months to make a tutorial.」（A 頁 L21，2014 年）。要連著寫的條件：
   - 這 1 到 5 個月**包含學會那個演算法**的時間（同一段的上下文），不只是做圖與寫字。
   - 沒有說是全職還是業餘、每週幾小時，所以換算不成工時。
   - 是 2014 年的說法；同一句後半說「the more I make, the faster I am getting」，之後有沒有變快，三頁都沒有新數字。C 頁（2018）仍在找讓自己做快一點的方法。
   - B 頁說 line drawing 教學是「a medium sized project」，沒有給時間。
   - 作者自己對慢的歸因是過程沒有結構、邊做邊改：「It's not structured at all, which might be why it takes so long.」
2. **「熟手」是清單加的形容，頁面沒有自稱**。頁面能支持的是：作者在 2014 年已經寫過機率、A*、noise、curved roads、visibility、hexagons 等多篇互動教學（A 頁 L25），到 2018 年提到「one of my earliest interactive articles」。
3. **「怎麼做」撐得住，可寫的重點**：先找出要視覺化的主要概念；互動的基本型是讓讀者改輸入、看輸出；圖用圖層疊；先全部重畫與全部重跑，慢了再最佳化；圖的程式每篇各寫、不追求通用；事前不知道要什麼，寫到一半會重寫圖的系統兩三次；收尾花時間在看得出哪裡能動與觸控好不好按。
4. 對 order 7 最直接有用、清單沒有點出的兩句：B 頁「Now I have an interactive diagram. But this isn't an explanation.」（做出互動不等於有解釋，還要把演算法拆成步驟）；A 頁作者自己的疑問「讀者只能動資料、我做的時候動的是程式而且因此懂得更多，我是不是虧待了讀者」。兩者都是作者的自述與疑問，不是證據。
5. 這三頁談的是演算法教學（尋路、畫線、六角格）加可拖曳的 SVG 圖，成本說法不能直接套到「一張可調參數的簡單圖」。清單「找不到來源」那一段已經寫了這個缺口，這裡確認原文沒有補上。
6. 三頁都沒有任何關於讀者有沒有用互動、學得好不好的資料。

## 讀取紀錄

| 順序 | 檔案與行號 | 內容 |
|---|---|---|
| 1 | A：L1–181（一次讀完） | 頁首、日期與說明、製作過程自述、圖層與程式片段、其他圖的清單、實際過程、未解問題清單、過期註記、連結清單、頁尾 |
| 2 | B：L1–620（一次讀完） | 頁首、目錄、前言、第 1–13 節全部（含每一段程式碼）、連結清單、頁尾 |
| 3 | C：L1–142（一次讀完） | 頁首、目錄、Part 1（三個例子、兩個問題）、Part 2（更新與重跑的各種做法）、連結清單、頁尾 |
| 對原檔 | 三份 `.html` | 只查了 canonical 網址、作者註解與建立／修改日期。互動圖與截圖沒有看；Disqus 留言沒有載入也沒有讀 |
