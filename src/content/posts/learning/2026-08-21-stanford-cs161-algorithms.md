---
title: "Stanford CS161 導讀：一門把「寫清楚」列為第三個學習目標的演算法課"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, ai-course, stanford, algorithms, self-study, cs-course]
lang: zh-TW
series:
  name: "Stanford CS161 導讀"
  order: 1
additionalSeries:
  - name: "Stanford CS 主線課程導讀"
    order: 6
tldr: "CS161 第一堂投影片寫下的課程目標有三個：設計、分析、溝通。第三個才是作業不准手寫、要求寫得像給同事的備忘錄的原因。八份作業裡 HW2 是分水嶺，講義的 Python notebook 用來示範「量時間看不出誰比較快」，而暑期班是同課號、同課名、完全另寫一套的另一門課。"
description: "逐份讀完 Stanford CS161 Winter 2026 的十八講講義、八份作業與課程政策後的完整導讀：課名矛盾的來龍去脈、notebook 在演算法課裡的真實用途、嵌入式倫理題、LLM 政策原文，以及自學者實際拿得到與拿不到的東西。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-21-stanford-cs161-algorithms-en)

[CS 161](https://stanford-cs161.github.io/winter2026/) 是 Stanford 電腦科學系大學部的演算法必修。它也是這個系裡最常被當成先修條件的一門。從 AI 入門的 [CS 221](https://explorecourses.stanford.edu/search?q=CS+161&view=catalog) 到資料庫、組合最佳化、隨機演算法，先修欄位都指向它（清單見附錄）。本站的 [Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)把它放在「學位骨架五門」那一格。這篇要回答的是進去之後會發生什麼事。

先講最反直覺的一件事：這門課的官方目標有三個，第三個是「溝通」。第一堂的投影片把它跟設計、分析並列寫在同一頁——**Communication: Learn to communicate clearly about algorithms**。這不是場面話，它是整套作業規則的來源，包括為什麼從第二份作業起手寫一律零分。

這篇涵蓋 Winter 2026 那一輪的十八講講義、八份作業 PDF、課程政策與嵌入式倫理教材，以及一手材料裡跟外界印象對不上的地方。**不包含**演算法本身的教學——那是講義自己的工作，而且它們全部公開。

## 這門課的硬事實

Winter 2026 由 [Moses Charikar](https://profiles.stanford.edu/moses-charikar) 與 [Ellen Vitercik](https://profiles.stanford.edu/ellen-vitercik) 合開。前者是 Donald E. Knuth 講座教授，研究高維資料的檢索與索引演算法；後者是管理科學與工程系暨資工系助理教授。兩人輪流上台，一人一堂交錯排。課堂在 STLC 111，每週一、三下午各一堂。

學分掛的是彈性區間，但系上規定寫死：大學部學生無論主修什麼，這門課都必須以五學分修習。這條[現在還掛在 BS 學位要求頁上](https://www.cs.stanford.edu/bs-degree-requirements)。先修有三門：程式與資料結構、離散數學與證明、機率（原文見附錄）——機率是硬列的，這門課用到的機率比課名看起來多。

成績由作業、期中、期末三塊構成，作業會丟掉最低的一份。

開課頻率看起來在收斂。ExploreCourses 上，這門課在上一個學年一年開四次；下一個學年目前只掛出冬季與春季兩次，冬季由 Aviad Rubinstein 上，春季由 Vitercik 上。

不能旁聽，也沒有公開錄影。講義頁寫的是「Lectures will be recorded and accessible in Canvas」，實際的 Panopto 連結點下去會被導到登入頁。

有一個小矛盾值得先解掉：註冊組系統把 Winter 2026 的上課時間登記成「一、三、五」，但課程網站只排了一、三。週五那格是[複習課與倫理課](https://stanford-cs161.github.io/winter2026/schedule/)在用——期中期末前的 review session、以及唯一那堂 EthiCS 都排在週五同一間教室。

## 那個課名矛盾，現在已經被修掉了

網路上（包括本站的地圖文）流傳一件事：系上的大學部核心要求頁把 CS161 叫做 Data Structures and Algorithms，跟課程自己的名字對不上。查證的結果是——**這個矛盾曾經成立，但現在不成立了。**

目前還開著的官方來源全部一致，寫的都是 Design and Analysis of Algorithms。這包括課程官網、[ExploreCourses 課程條目](https://explorecourses.stanford.edu/search?q=CS+161&view=catalog)、[Stanford 公報的 CS161 課程頁](https://bulletin.stanford.edu/courses/1056871)、[Stanford Online 的遠距學分版](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms)，以及第一堂投影片自己的封面。

帶另一個名字的那頁已經不在了。它現在回 404，訊息是「We have a new site and things have moved around a bit」。取代它的[學位要求頁](https://www.cs.stanford.edu/bs-degree-requirements)只保留五學分那條規定，不再列課名。我把新站的學位要求、BS 學程分軌、大學部總覽三頁都掃過一遍，兩個課名一個都沒出現。舊說法只剩 [Wayback Machine 的 2026 年 5 月快照](http://web.archive.org/web/20260510054742/https://www.cs.stanford.edu/bs-core-requirements)。

不過那頁值得看一眼，因為問題不只在課名。它說這門課教「several different classes of algorithms and data structures, including randomized algorithms, divide and conquer strategies, greedy algorithms, hashing, heaps, graph algorithms, and search algorithms (including blind and A\* search)」。A\* 搜尋在課表上一講都沒有，那是 CS 221 的內容。

**帶走的不是「有兩個課名」，是「系上的輔導頁跟課程實際教的內容可以差很遠」。** 要知道這學期到底上什麼，看課程網站的講次索引，不要看系上的課程簡介。

至於還活著的命名不一致，我只找到一處，在那門一學分的輔導課上。ExploreCourses 把它登記成 **CS 161ACE**（Problem-Solving Lab for CS161），課程網站的導覽列則叫它 [CS 161A](https://stanford-cs161.github.io/winter2026/cs161a/)。它屬於工學院的 ACE 計畫，週四下午兩小時，強制出席，需要申請且名額有限。

## 第三個目標：這其實是一門寫作課

回到開場那件事。設計與分析是任何演算法課都會寫的目標，溝通不是。而 CS161 把它兌現成了可執行的規則。

課程的[資源頁](https://stanford-cs161.github.io/winter2026/resources/)這樣定義作業該長什麼樣：

> 「把它們想成你寫給同事的備忘錄。更好的想法是：想成你寫給一群同事的備忘錄，他們手上事情很多，而且他們掌握你的分數。」

配套的規則很硬。手寫作業第一份還會酌收（扣 5%），從第二份起零分，且官網加註「不會有例外」。課程強烈建議用 LaTeX，並且把每份作業的 LaTeX 原始碼一起釋出，讓學生可以直接借用題目敘述的排版。

更能說明這件事的是題目本身的格式。每一小題結尾都掛一個 `[We are expecting: ...]` 區塊，逐字說明會拿什麼標準來改。要虛擬碼的地方會直接寫出判準。要清楚到「一個 CS 106B 的學生（當然也包括助教）看得懂你的演算法在做什麼，而且能用自己選的語言實作出來，不必想太久」。

這條線一路貫穿到證明題。第二份作業有一小題直接寫「我們期待的是一個形式化的歸納論證。請確保你的歸納假設、基底情形、歸納步驟與結論都能明確辨認」——評分的對象是論證的結構，不是最後那個答案對不對。

## Notebook 在這門課裡的真實用途

演算法課配 Python notebook 不常見，所以值得看清楚它到底怎麼用。

答案有點反直覺：**notebook 不是拿來寫作業的，它是拿來示範「量執行時間看不出誰比較快」的。**

第一堂的 [Karatsuba notebook](https://github.com/stanford-cs161/winter2025-extra/blob/main/notebooks/lecture1_karatsuba/lecture1_karatsuba.ipynb) 依序實作三個乘法：小學直式、四路遞迴分治、Karatsuba，每一個都跑一輪計時並畫圖。跑到第二個的時候，notebook 自己下了這個結論：

> 「嗯……從這張圖很難看出哪一個漸近上比較好。（而且上面那個分治實作在 2 的次方附近顯然有點怪怪的。）我們得轉向數學分析，才能理解這個演算法在 n 變大時的行為。」

也就是說，notebook 的功能是先讓你看見經驗量測失效，再交棒給漸近分析。雜湊那一堂用同樣的手法。先寫一個「均勻隨機的雜湊函數」，跑出錯誤結果，接著跳出一格大字「Whoops!」。然後才解釋：那東西根本不是函數，它每次呼叫都給不同的值。

這批 notebook 的來歷也有訊息。它們住在課程 GitHub 組織下的 [winter2025-extra](https://github.com/stanford-cs161/winter2025-extra) 這個公開 repo，採 MIT 授權，附一份 ATTRIBUTION 檔註明「originally developed by Mary Wootters」。

值得注意的是 Winter 2026 沒有另開一個 2026 版：所有 notebook 連結都指回前一年那個 repo。而那個 repo 的 README 第一行到現在還寫著 `# winter2021-extra`，是逐年複製沿用留下的痕跡。第一堂的投影片頁尾同樣標著「Slides originally created by Mary Wootters」。

最後有一條容易被忽略的但書寫在資源頁上：那份示範用的 Homework 0 範例裡有程式題，但課程明說「這一季我們不會使用 iPython notebook」。**notebook 是講義的附屬品，從來不是作業的一部分。** 這也對得上暑期班負責人的說法：這門課「基本上沒有真正的程式撰寫部分」。

## 一堂倫理課，四份作業的倫理題

課表上的 EthiCS 只有一堂，週五那格，由 Justin Shin 上，投影片公開，錄影在 Canvas。看起來像個附掛的合規動作。

看作業就不是了。八份作業裡有四份帶倫理小題，而且是計分的：

- **HW4**：用論文篇數與教學評鑑分數排序教授候選人時，哪一個是不完美的代理指標？
- **HW6**：一個捷運轉乘的動態規劃題後面，接著問這個演算法對「所有乘客轉乘能力相同」做了什麼理想化，哪個群體會因此受害。
- **HW5**：把「設計能容納最寬的獾的隧道網路」對應到都市的道路規劃，然後要求說明只為汽車最佳化的道路忽略了誰。題目附了四篇外部報導當閱讀材料。
- **HW8**：最大流的脈絡下，光纖公司把頻寬與預估營收相加當邊權會有什麼下游後果？以及，數位落差為什麼缺乏停止準則？

最後一堂的回顧投影片把這條線的詞彙整理成一頁：理想化、抽象、量測，以及棘手問題與良性問題的區分。這是有自己術語體系、會被考的內容，不是感想題——HW4 那小題就明寫要用「課堂上介紹過的術語」作答，並要求先把術語定義出來。

## 那條 LLM 政策

課程政策頁有一節專講語言模型，措辭比多數學校的版本強硬得多。規則本身是常見的：把模型輸出貼進作業算違反榮譽準則，例外只有一項——可以用它修 LaTeX 語法，只要不涉及解答的實質內容。考試一律禁止。

值得逐字讀的是後面那段建議：

> 「就這門課而言，我們強烈建議你忽略 LLM，改成來 office hour 或發文到 Ed 求助。為什麼？因為雇主越來越看重那些深入理解基礎、推理能力強、能夠**和** AI 一起工作（而不是**被** AI 取代）的人選。如果你太早依賴 AI，你不會發展出推理能力，在真實世界的問題解決上會很吃力。」

這是一個有立場的判斷，措辭本身也會有人不同意，所以這裡附原文讓你自己看。有意思的是它跟課程的收尾對得起來。最後一堂在講「ML 用於演算法設計」時，投影片放上了 [AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/)，那是一個以 Gemini 驅動的演算法設計 agent。然後它把整學期的提問原封不動擺回去——Does it work? Is it fast?——底下接一句「Still need formal guarantees!」

**如果你在評估 AI 生成的演算法，這門課給的尺就是那三句話。** 它沒有說模型設計不出演算法，它說的是形式保證那一段還得有人補上。

## 作業長什麼樣

八份作業，週三發、下週三晚上十一點五十九分交，一路排到期末前一週。每份分成 Exercises（建議自己做）與 Problems（可以討論）兩區。前三份必須獨立繳交，從第四份起允許兩人一組交一份。逐份看下來，工作量的曲線不是線性的：

| 作業 | 主題 | 配分 | 值得注意的事 |
|---|---|---|---|
| HW1 | 複雜度階級、大 O 證明、二維地形搜尋 | 43 | 兩分是「你讀過課程政策了嗎」與「你做過先修測驗了嗎」 |
| HW2 | 遞迴式、Fibonacci 歸納、快速冪、quagga | 60 | **分水嶺**，見下 |
| HW3 | 隨機化演算法、排序下界 | 42 | 回到常態 |
| HW4 | 紅黑樹、樹的操作 | 38 | 開始可以配對；首度出現倫理題 |
| HW5 | 圖與 BFS/DFS、最寬路徑 | 40 | 期中後第一份 |
| HW6 | Floyd-Warshall、動態規劃、負權邊 | 65 | 全學期配分最高、篇幅最長 |
| HW7 | 動態規劃三種寫法對照 | 38 | 同一題要求分治、由上而下、由下而上各寫一次 |
| HW8 | 最小生成樹、最大流、邊不重複路徑 | 49 | 期末前最後一份 |

**分水嶺是第二份。** 三個獨立證據指向同一件事。它的配分比第一份高出將近一半。全學期唯一被課程自己標記難度的題目在這裡。而且它還落在「必須獨立完成」的區間內，沒有隊友可以分攤。

那題叫 quagga。動物園裡有一群動物，超過一半是斑馬。斑馬永遠說得出對方是不是斑馬，quagga 則可能亂說，而你只能兩兩配對讓牠們互評。目標是把所有 quagga 找出來。七個小題從平方時間的暴力解一路走到線性時間的遞迴解，中間要求用歸納法形式化證明正確性，還特別註明計數那一步「不要用 Master Theorem，從頭論證」。

其中一個小題底下掛了一句腳註：「這是整份作業裡最難的一部分！你可能得想上一陣子。」這是全學期唯一一句這樣的話。同一份作業裡還有兩題零分的加碼題（Fibonacci 的黃金比例緊界、以及一個排除 O(log log b) 的論證），也是唯一出現這種設計的一份。

第六份是另一種意義上的高峰——配分最高、頁數最長、六大題，但它的難度來自量而不是單題的深度，而且那時候已經可以配對交。

## 自學者實際拿得到什麼

這門課的公開程度在 Stanford CS 主線課裡屬於偏高的，但界線很清楚。

**拿得到：**

- **十八講的講義、投影片與課前練習**，全部是課程網站上的直接 PDF 連結，不需登入。多數講次同時提供 notes 與 slides 兩份，內容不重疊——slides 省略的數學細節在 notes 裡。
- **八份作業的題目 PDF 與 LaTeX 模板**。注意每份 PDF 的頁首都有一行「Please do not distribute this material on any public forum」，那是給修課學生的規定；自己下載來做不受影響。
- **九次討論課的題目與解答**。這是最有價值的一項——作業沒有公開解答，但 section 的問題與 solutions 成對釋出。
- **先修測驗與它的解答**，四頁，分歸納、機率、漸近分析三段。
- **概念檢核題庫**，住在 [winter2025-bank](https://github.com/stanford-cs161/winter2025-bank) 這個公開 repo 裡，每個主題一組互動 SVG 加一份附解答的 PDF（例如[漸近分析那一組](https://stanford-cs161.github.io/winter2025-bank/asymptotics.pdf)）。沒有索引頁，只能從講次頁的連結進去。
- **十三份 Python notebook**，MIT 授權，Colab 一鍵開啟。
- **課程網站的完整 git 歷史**，因為整個站就是 [GitHub 上的公開 repo](https://github.com/stanford-cs161/winter2026)。

**拿不到：**

- **所有錄影。** Panopto 連結會導向 Stanford 登入。課程資源頁自己給了替代品：指定教材 [Algorithms Illuminated](https://www.algorithmsilluminated.org/)（Tim Roughgarden 著，講義的「Additional reading」欄大量引用它）在 YouTube 上有作者自己的完整影片系列，而且是免費的。
- **作業解答。** 只在 Gradescope 裡，自學者沒有帳號。
- **考卷。** 只有複習講義是公開的。
- **Ed 討論區與 office hour。** 沒有人會改你的證明，這對一門評分對象是論證品質的課來說是最實際的損失。

## 暑期班是另一門課

這是最容易踩到的一個坑。

`web.stanford.edu/class/cs161/` 這個看起來最像官方入口的網址，現在放的不是課程網站，而是一份 [CS 161 Summer 2026 Temporary FAQ](https://web.stanford.edu/class/cs161/)，由 Matthew Sotoudeh 維護。那份 FAQ 有一段直說：

暑期班「不是冬季班減掉某幾講，也不是冬季班加上某幾講。它是基於完全不同的講義、作業等等」。連時間結構都不同——每週三堂、每堂一小時四十五分，壓縮在八週內上完，而不是每週兩到三堂、每堂八十分鐘、上滿十週。內容重心也不同：暑期班更偏分析而非設計，更偏排序與搜尋而非圖論。

同一份 FAQ 還說明了遠距的唯一合法路徑：透過 SCPD / CGOE / Stanford Online 註冊的人可以完全遠距修，但要自己找到符合規定的監考人；其他人必須到場。Stanford Online 那個版本掛的價格是 7,875 美元，八週、每週十到二十小時、五學分、給正式成績單。

所以「CS161 的教材」這句話在自學的語境下是有歧義的。網路上找得到的那一套——GitHub Pages 上的講義、notebook、section 解答——是冬季／春季那一脈的。暑期那一脈的材料在 Canvas 裡。

## 怎麼開始

今晚做一件事就好：下載[先修測驗 PDF](https://stanford-cs161.github.io/winter2026/assets/files/prereq_quiz_wi26.pdf)，只做第一節「Induction」的八題，一題都不要看解答。

其中第 1.5 題是這樣的：一群 n 個人，有些兩兩是朋友，證明「朋友數為奇數的人」的個數是偶數。它不需要任何演算法知識，只需要你會挑對歸納的量。做完之後打開[解答 PDF](https://stanford-cs161.github.io/winter2026/assets/files/prereq_quiz_solution_wi26.pdf) 對——但不是對答案對不對，是對**你的寫法能不能被一個陌生人讀懂**。基底情形、歸納假設、歸納步驟、結論，四個部件在你的紙上分得出來嗎？

分不出來的話，你要補的不是 CS161，是 CS 103。這門課從第一份作業起就假設你已經會寫證明，它教的是拿證明去分析演算法。

## 附錄：數字與查證方式

- **成績組成**：八份作業共 40%，期中 25%，期末 35%。最低的一份作業會被丟掉，所以每份計分的作業佔 5.714%——這個數字是課程官網自己算好寫上去的。
- **先修條件原文**：「CS 106B or CS 106X; CS 103 or CS 103B; CS 109 or STATS 116」。
- **以 CS161 為先修的下游課程**（取自 ExploreCourses 2026–2027 學年的搜尋結果）：CS 221、CS 245、CS 256、CS 261、CS 265／CME 309、CS 354、CS 366。其中四門目前顯示停開，最後開課依序是 CS 261（2026 年冬季）、CS 256（2025 年秋季）、CS 366（2024 年冬季）、CS 354（2022 年冬季）。
- **遲交**：全學期六個 late day，單份作業最多用兩個，超過 48 小時不給分。HW4 與 HW8 因為要在考前及時釋出解答，即使是 OAE 的展延也最多兩天。
- **考試時間**：期中 Winter 2026 排在 2 月 11 日晚間六點到九點，期末 3 月 18 日下午三點半到六點半。這一輪參加了 Stanford 學術誠信工作小組（AIWG）的監考試辦計畫。
- **作業配分逐份**：43 / 60 / 42 / 38 / 40 / 65 / 38 / 49，全學期合計 375 分。這是我從八份 PDF 的每小題標示逐項加總得到的，課程網站沒有公布這張表。倫理小題合計 22 分，約佔 6%（HW4 佔 8 分、HW5 與 HW6 各 4 分、HW8 佔 6 分）。
- **講次與教材數量**：正課十八講加一堂 EthiCS，九次討論課外加三次複習課，十三份 Python notebook。
- **課程人力**：兩位授課者、一位課程經理、一位 head CA、七位 CA，另有一位 ACE 專屬 CA。
- **Stanford Online 版本**：五學分，八週，每週建議十到二十小時，學費 7,875 美元（頁面註明可能變動），2026 年的檔期是 6 月 22 日到 8 月 15 日，我查證當下顯示未開放報名。
- **未能確認的項目**：一、修課人數。課程網站與 ExploreCourses 都沒有公布，我沒有找到可引用的來源。二、2026–2027 學年是否會再開秋季與夏季班——ExploreCourses 目前只掛冬季與春季，但未來學年的資料會陸續補，現在下「減開」的結論太早。三、Winter 2026 之前各屆的完整課程網站是否還開著。`web.stanford.edu/class/archive/cs/cs161/` 這層目錄直接回 404，我沒有找到可瀏覽的封存索引；能確認還在的舊材料只有 GitHub 上逐年的 notebook repo（最早到 2021 年冬季）。

## 參考資料

- [Stanford CS 161 Winter 2026 課程官網](https://stanford-cs161.github.io/winter2026/) — 課名、授課者、成績組成、先修條件的第一手來源
- [CS 161 講次索引](https://stanford-cs161.github.io/winter2026/lectures/) — 十八講的講義、投影片、課前練習與 notebook 連結，也標明錄影只在 Canvas
- [CS 161 作業頁](https://stanford-cs161.github.io/winter2026/homework/) — 八份作業的 PDF 與 LaTeX 模板、發布與截止日期
- [CS 161 課程政策頁](https://stanford-cs161.github.io/winter2026/policies/) — 手寫零分、遲交規則、以及 LLM 政策的原文
- [CS 161 資源頁](https://stanford-cs161.github.io/winter2026/resources/) — 「寫給同事的備忘錄」原文、指定教材清單、以及「這一季不使用 iPython notebook」那句話
- [CS 161 EthiCS 講次頁](https://stanford-cs161.github.io/winter2026/ethics/) — 證明整學期只有一堂倫理課
- [CS 161A / ACE 說明頁](https://stanford-cs161.github.io/winter2026/cs161a/) — 一學分輔導課的內容與強制出席規定
- [ExploreCourses CS 161 條目](https://explorecourses.stanford.edu/search?q=CS+161&view=catalog) — 官方課名、3–5 學分、開課學期，以及下游課程的先修欄位
- [Stanford CS BS 學位要求頁（現行）](https://www.cs.stanford.edu/bs-degree-requirements) — 五門核心必須以五學分修習
- [Stanford 公報：CS161 課程頁](https://bulletin.stanford.edu/courses/1056871) — 官方公報現行的課名寫的是 Design and Analysis of Algorithms
- [Stanford CS BS 核心要求頁（Wayback 2026-05-10 快照）](http://web.archive.org/web/20260510054742/https://www.cs.stanford.edu/bs-core-requirements) — 已下線的舊頁，「Data Structures and Algorithms (CS161)」與 A\* 搜尋那段敘述的唯一存證
- [Stanford Online：CS161 遠距學分版](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms) — 學費、學分、時數與檔期
- [CS 161 Summer 2026 FAQ](https://web.stanford.edu/class/cs161/) — 暑期班是另寫一套課、遠距條件、以及「沒有真正的程式撰寫部分」
- [winter2025-extra（notebook 原始碼）](https://github.com/stanford-cs161/winter2025-extra) — MIT 授權、Mary Wootters 原著的註記、以及沿用五年的 README
- [winter2026（課程網站原始碼）](https://github.com/stanford-cs161/winter2026) — 整個站的公開 git 歷史
- [概念檢核題庫 winter2025-bank](https://github.com/stanford-cs161/winter2025-bank) — 逐主題的互動題與附解答 PDF
- [Algorithms Illuminated](https://www.algorithmsilluminated.org/) — 課程指定教材，作者提供免費影片
- [Moses Charikar 教授頁](https://profiles.stanford.edu/moses-charikar)、[Ellen Vitercik 教授頁](https://profiles.stanford.edu/ellen-vitercik) — 兩位授課者的職稱與研究方向
- 站內：[Stanford CS 課程導讀地圖](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 深度導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
