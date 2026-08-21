---
title: "Stanford CS103 導讀：一門數學課，開學第一件事是裝 C++ 編譯器"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs103, ai-course, stanford, discrete-math, theory-of-computation, self-study]
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 1
tldr: "CS103 前半教怎麼寫證明、後半教什麼證不出來，但外界最少提到的是它有 C++ 程式作業：PS0 就是裝 Qt Creator。它的真正資產是一整排自製的『Guide to X』講義與一份會拿來扣分的 Proofwriting Checklist，全部公開；解答與練習考題全部鎖在 Stanford 登入後面，而且鎖的理由寫在 Honor Code 裡。"
description: "Stanford CS103: Mathematical Foundations of Computing 完整導讀，讀完現行課程網站、八份 problem set、二十多份自製講義與封存學期版：課程軸心、程式作業的存在、難度轉折落在哪一份作業、暑期版與正規學期版的差距，以及自學者實際拿得到與拿不到什麼。"
draft: false
---

[CS103: Mathematical Foundations of Computing](https://web.stanford.edu/class/cs103/) 是 Stanford 電腦科學系大學部骨架裡的第一門理論課。它的名字聽起來像一門離散數學課，前半段也確實是——邏輯、集合、函數、圖、歸納法。但它的後半段整個換軌，講的是有限自動機、正規語言、上下文無關文法、圖靈機、可判定性、停機問題，最後停在 P 對 NP。

用課程自己在 syllabus 裡的說法，這是一門關於「computing 有沒有物理定律」的課。它把前半段當成工具，並且把整門課形容成「a course in both art appreciation and practice」：先帶你逛過去一百五十年最漂亮的幾個結果，再要你自己拿起畫筆。

這篇是把現行課程網站、八份 problem set、二十多份自製講義、Honor Code 頁面與兩個封存學期版逐頁讀完之後寫的。要處理的是「進去之後會發生什麼事」：課程真正的軸心、作業實際長什麼樣、難度在哪一份轉折、以及沒修課的人拿得到什麼。它在整份修課階梯上的位置，[Stanford CS 課程導讀](/posts/learning/2026-08-20-stanford-cs-course-map)那篇已經排過，這裡不重複。**不包含**逐題解法——解答本身也不公開，原因下面會講。

## 這門課的硬事實

先修條件是 CS106B（或 CS106X、或同等背景），而且**可以同時修**。ExploreCourses 的條目寫得很直接：`Prerequisite: CS106B or equivalent. CS106B may be taken concurrently with CS103.`

數學先修低到會讓人不敢相信。課程自己的「Mathematical Prerequisites」講義第一句就把門檻寫死：「The most advanced level of mathematics you'll need for this course is high school algebra.」三角函數、複數、微積分、極限，還有「especially」在座標軸上畫函數圖形，全部用不到。它列出的先修技能只有兩項：把多項式乘開，以及移項。

課號在 100 系列，但它是研究生也在修的課。syllabus 補了一條學分下限：大學部與 CGOE（線上）學生必須以五學分修，不接受降學分，理由是系上與學校政策。只有已入學的研究生可以彈性選學分數，而且課程內容與要求完全一樣，彈性純粹是為了選課帳面方便。

最反直覺的一條寫在課程描述最後：**這門課會勸一部分人不要修它。**

> Students with significant proofwriting experience are encouraged to instead take [CS154](https://explorecourses.stanford.edu/search?view=catalog&q=CS154).

也就是說，如果你已經會寫證明，官方建議你直接去修 [CS154: Introduction to the Theory of Computation](https://explorecourses.stanford.edu/search?view=catalog&q=CS154)。後者的先修條件正是這門課，但兩者的計算理論部分大量重疊。差別在於這門課額外花了半個學期，教你怎麼把證明寫成別人看得懂的樣子。

授課者不是固定的一位。2026 年暑期版由 Robyn Reiss 開，2026–27 學年秋季是 Sean Szumlanski、春季是 Keith Schwarz。這件事對自學者有實際影響，下面「拿得到什麼」那節會回來講。

## 前半教怎麼證明，後半教什麼證不出來

講次表的轉折點很好認。以現行的暑期版為例，開頭七講是集合論與證明入門、否定、命題邏輯與量詞、函數、圖、鴿籠原理、數學歸納法。接著整個換軌：有限自動機、正規表達式、NFA 轉換、上下文無關文法、圖靈機、R 與 RE、可判定性與停機問題，最後一講收在 P 對 NP 與複雜度理論。

課程自己在 problem set 的導言裡標記了這個轉折，而且標得很清楚。第四份作業的第一句話是「這份是最後一份純離散數學的作業」，第五份的第一句話是「這將是你第一次踏進計算理論」。

這個結構決定了課程真正的軸心。**前半段教的不是離散數學本身，是把「你相信某件事是對的」翻譯成「你能讓別人不得不同意」的能力。** 後半段把這個能力轉向一類新問題——不是「這個程式怎麼寫」，而是「這個程式存不存在」。停機問題不是難題，是**沒有解**的問題，而你要能證明它沒有解。

實用上的用法是這樣。如果你的目標只是把離散數學補起來——面試前複習 Big-O、圖、遞迴——那麼這門課的前半段就夠了，後半段是另一門課。反過來，如果你真正想要的是計算理論，那麼比較該修的其實是 CS154，而 CS103 前半段是你缺的那塊墊腳石。

## 一門數學課，開學第一件事是裝 C++ 編譯器

這是外界介紹 CS103 時幾乎不會提的一件事：**它有程式作業。**

第零份作業（Problem Set 0）沒有任何數學。它要你下載安裝 [Qt Creator](https://web.stanford.edu/dept/cs_edu/resources/qt/)，匯入課程提供的 ZIP 專案，編譯執行一個 Honor Code 小測驗程式。程式會產生一個完成碼檔案，你把那個檔案交上去。syllabus 寫得很白：「You will need to download and install Qt Creator to complete the coding assignments.」

程式作業不是點綴，它貫穿整學期，而且形式一直在變：

- **第一、二份**用 C++ 當一階邏輯的執行環境。你會拿到 `Person`、`Cat`、`Robot`、`Loves` 四個布林函式，然後被要求把 `∃x. (Person(x) ∧ Loves(x, x))` 這種公式實作成一個吃 `std::set<Entity>` 回傳 `bool` 的 C++ 函式。這是把「你以為你看懂了這條公式」變成「編譯器同意你看懂了」的裝置。
- **第五、六份**改成圖形工具。starter 專案裡帶一個自動機編輯器，你在裡面拉狀態、拉轉移邊設計 DFA 與 NFA，存檔交出去自動評分。正規表達式與 CFG 也各有自己的答案檔格式與本機測試器。
- **第七份**在圖靈機那一段還是有程式題，而且是那份作業裡唯一照常給分的部分。

所以 CS103 的實際體驗不是「一學期寫紙筆證明」，而是**一半的題目有自動評分器可以先打臉你，另一半沒有**。這個落差本身就是課程設計：syllabus 在講評分標準時特別提醒，證明沒有編譯器，所以送出前要自己讀過。

## 講義才是主體，題目只是入口

CS103 課程網站首頁的側欄裡，掛著一整排以「Guide to」開頭的自製講義。這不是補充教材，是課程的骨幹——每一份 problem set 的導言都會指定你先讀哪幾份，然後才准動筆。

它們大致分三類。**一類是寫作指南**：Guide to Proofs、Guide to Proofs on Sets、Guide to Proofs on Discrete Structures、Guide to Induction。**一類是逐條檢查表**：Proofwriting Checklist、Induction Proofwriting Checklist、Discrete Structures Proofwriting Checklist、Logic Translation Checklist。**一類是動畫式的單一定理拆解**，做成逐頁展開的 PDF。這一類包括 Guide to Negation、Guide to the Subset Construction、Guide to Self-Reference、Guide to Cantor's Theorem 與 Guide to the Lava Diagram。

其中最值得單獨拿出來講的是 [Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/proofwriting_checklist)。它不是一頁清單，是一份長度接近一篇論文的文件，列出八條準則、每一條都附反例與練習題。而且第三份作業的導言把它的地位講死了：「We will be applying the items on this checklist when grading your work」——這是評分規準，不是建議。

那八條分別處理：把假設與待證明的東西清楚寫出來、每個句子都要承重、變數要正確引入與界定範圍、對特定變數做特定主張、不要複述定義而要使用定義、寫成完整句子與段落、正文不要出現量詞與邏輯連接詞符號，以及一個我沒在別處看過的命名——**「Contradiction Sandwich」**：整份證明外面包一層「假設反面成立⋯⋯與假設矛盾」，但中間那一大塊其實是一個完整的直接證明，把頭尾兩句拿掉照樣成立。課程的判定是：這種證明邏輯正確，但風格很差，因為那層外殼沒有做任何事。

對自學者來說，這一批講義的價值比講次投影片高得多。投影片你可以在任何一本教科書找到替代品；「一個教了十幾年這門課的人，逐條寫下學生會怎麼寫壞一份證明」你找不到替代品。

## 它明令禁止生成式 AI，而理由跟解答被鎖起來是同一條

2026 年還在明文全面禁用 AI 的正課不多，CS103 是其中一門。Honor Code 頁面寫得沒有轉圜空間：

> University guidance on the use of generative AI in classroom settings treats use of generative AI analogously to receiving assistance from another human. As a result, using ChatGPT or other generative AI tools on any graded work is a violation of the Honor Code, regardless of whether that use is disclosed.

「regardless of whether that use is disclosed」這一句是關鍵——不是揭露就沒事，是用了就違規。

更值得注意的是，這條規定跟另一件事共用同一個理由。同一頁的 Rule 1 把「看不屬於你的解答」定義成違規，並且特別點名往屆的解答集：課程明說他們見過的違規案例裡有很多是使用舊解答，所以連「拿別人的解法來確認自己的想法」都算。而在 CS103 的世界觀裡，AI 和往屆解答是同一類東西——都是**替你完成那個從卡住到想通的過程**，而那個過程就是這門課本身。

配套的還有一條相對少見的補救條款，明說是仿照 [Harvard CS50](https://www.thecrimson.com/article/2019/12/18/computer-science-50-report/) 的做法：如果你真的違規了，在該次作業的遲交期限後 72 小時內自首，唯一的懲罰是該次作業零分，不會再降成績、也不會送到學校的 Community Standards 辦公室。這條只適用作業，不適用考試。

## 作業長什麼樣

以現行的暑期版（八份，PS0 到 PS7）為例，逐份看下來的難度曲線是這樣：

| 作業 | 主題 | 特徵 |
|---|---|---|
| PS0 | 開發環境 | 沒有數學，裝 Qt Creator、跑 Honor Code 測驗，強制個人完成 |
| PS1 | 集合論與證明入門 | 分五部分，導言直接排好「哪一部分星期幾之前做完」 |
| PS2 | 命題邏輯與一階邏輯 | 題數最多的一份，含 C++ 實作、邏輯翻譯、Yablo 悖論 |
| PS3 | 函數與圖 | 單射／滿射／雙射、獨立集與支配集、左右反函數、二部圖 |
| PS4 | 歸納法 | 「最後一份純離散數學」，考完期中後放寬評分 |
| PS5 | 有限自動機 | 「第一次踏進計算理論」，改用自動機編輯器交作業 |
| PS6 | 正規表達式與 CFG | 要下載兩套 starter 專案，含 Myhill-Nerode 與 Brzozowski 定理 |
| PS7 | 圖靈機與不可判定性 | 不准用遲交額度；筆試題只看有沒有認真做，程式題照常給分 |

真正的分水嶺有兩個，而它們不是同一個。**內容上的分水嶺在 PS5**，因為那是主題整個換軌的地方。**工作量上的分水嶺在 PS2**——那份作業有九道必做題加一道選做題，同時要求你寫 C++、把英文句子翻成一階邏輯公式、還要證明 Yablo 悖論裡每一條敘述既非真也非假。前面兩份作業有大量鷹架，到 PS2 鷹架就撤了。

另外兩件從作業頁面才看得到的事：

**課程會用調整評分規則來替學生擋考試週。** PS4 落在期中考之後、PS7 落在期末考之前，兩份都掛了專屬的評分公告。PS7 的做法特別明確：筆試部分只要有誠意作答就給滿分，但同一頁提醒你那些內容仍在期末考範圍內，「we recommend treating it as you would any other problem set」。

**每份作業都附一份逐日進度表。** 正規學期版的作業頁面有一節就叫 Timeline，直接寫「第一題星期六晚上前、第二題星期日晚上前⋯⋯第七題星期四晚上前」。這是這門課對「一份作業要花多久」最誠實的官方答案：一份 problem set 的預期跨度是六天，不是一個晚上。

還有一個彩蛋值得知道。正規學期版最後一份作業的最後一題叫 Grand Challenge Problem，題目是「證明或推翻 P = NP」，標注是：

> (Worth an A+, $1,000,000, and a Ph.D)

下面接著寫「認真花十五分鐘試試看」，然後說解不出來就交你想得到最好笑的答案。

## 同一門課，暑期版跟正規學期版差了快一倍

這是自學者最容易踩的坑，而且它不會有任何錯誤訊息提醒你。

`web.stanford.edu/class/cs103/` 這個網址永遠指向**當下正在開的那一屆**。我讀的時候它指向 2026 年暑期班：十五講、八份作業、一次期中一次期末。但同一年春季那屆是二十八講、十份作業，講次拆得細得多——光「有限自動機」就分三講，「圖靈機」三講，「不可解問題」三講，最後還有一堂 Wrap-Up。

換句話說，**如果你照著今天首頁看到的講次表排自學進度，你可能拿到的是一份壓縮過的版本。** 兩個版本的主題集合幾乎一樣，但拆解密度差很多，而拆解密度正是這種課最要緊的東西。

判斷方法很簡單：封存網址結尾那組代碼的最後一位就是季別，暑期班的尾數是 8。**要排進度，就挑尾數 2（秋季）或 6（春季）的那一屆。** 完整的代碼對照放在文末附錄。

順帶一提，暑期版反而多了幾份正規學期版沒有的講義（Guide to Elements and Subsets、Guide to Cantor's Theorem，以及一份把課程涵蓋的定理按年代排開的 Timeline of CS103 Results，從西元前一五五〇年的萊因德紙草書排到現代）。所以最合理的做法是：**講次表用正規學期版，講義清單用現行版**。

## 自學者實際拿得到什麼

逐項講，拿得到的和拿不到的分得很開。

**拿得到：**

- **全部講次投影片。** 每一講的頁面掛著 PDF，直接下載，不需要登入。
- **全部作業題目。** 八到十份，題目、提示、以及每題後面那句「想深入的話去修哪門課」都在。
- **全部 starter 檔案。** ZIP 檔公開下載，包含自動機編輯器與本機測試器。這代表**自動評分的那些題目，你可以自己判分**——DFA、正規表達式、CFG、一階邏輯翻譯這幾類都在本機跑測試。
- **全部自製講義與檢查表。** 上面講的那一整排。
- **十六屆的封存版本，附授課者自己的改版說明。** 這是我認為最被低估的一項：Keith Schwarz 在 [keithschwarz.com/cs103](https://www.keithschwarz.com/cs103/) 維護了一個個人封存頁，收錄他教過的每一屆 CS103 網站，並且**在每一屆下面寫一段他當年為什麼那樣改**。例如 2021 年秋季那屆的說明裡，他描述自己發現學生的兩個共同盲點——分不清「假設一個全稱敘述」與「證明一個全稱敘述」的差別，以及第一次學寫證明的同時又要處理集合論定義——然後解釋他怎麼重排課程來對付這兩件事。一門課的講師公開自己的教學設計檢討，這種東西不好找。
- **一份已經從現行網站消失的講義。** 2020 年秋季那屆的教材目錄是**開放的目錄列表**（`cs103.1212/materials/`），裡面有一份現在的網站上找不到的 handout，叫 [Ten Techniques to Get Unstuck](https://web.stanford.edu/class/archive/cs/cs103/cs103.1212/materials/Handouts/060%20Ten%20Techniques%20to%20Get%20Unstuck.pdf)。它先拆穿一個迷思——新手以為寫證明是「讀題、沉思、靈光一閃、寫出傑作」，而真實流程是「讀題、慌一下、列出假設與待證、揉掉一堆紙、回到第三步」——然後給十招：釐清起點與終點、寫下相關定義、畫圖、試小案例、倒著推、找一個類似的證明、動假設、動結論、換證明技巧、去睡一覺。同一個目錄裡還躺著那一屆的四次期中考題與每週的 tutorial 講義。

**拿不到：**

- **解答。** 所有 `restricted/` 底下的東西——每份作業的解答、練習期中考、練習期末考——一律導向 Stanford 的 WebLogin，非在校生打不開。這不是疏漏，是 Honor Code Rule 1 的直接後果。我也試過更早的封存版本（例如 2019 年秋季那屆），解答 PDF 同樣鎖住。
- **上課錄影。** 每一講的頁面都寫著同一句話：「The complete archive of this quarter's lecture recordings is available on Canvas.」影片走 Panopto、掛在 Canvas 裡，校外進不去。我沒有找到任何一屆的官方公開錄影；2012 年那屆的頁面上有一條影片連結，但它指向的是 Stanford 早年那套已經下線的線上課程系統。
- **人改你的證明。** 這是這門課最無法自助的一項，而且它剛好就是課程的重心：學期成績有四分之三來自兩次閉卷考試，作業只佔五分之一。你可以自己判分的都是自動評分的那半，需要人讀的那半沒有人讀。

**怎麼補上第三項**：課程自己在 How to Succeed 講義裡給了一個不需要別人的做法——寫完一份證明，放一天，隔天再讀一次；如果你自己都看不懂自己寫了什麼，那助教也不會看懂。它另外建議一個純自測的練習：把講義裡的定理蓋住證明，自己重寫一遍。

## 怎麼開始

今晚就能做的一件事：打開 [Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/guide_to_proofs)，讀到「直接證明」那一節，然後拿一張白紙分成兩欄，左邊寫「我假設什麼」、右邊寫「我要證明什麼」，用它去處理第一份 problem set 裡任何一道證明題。

先不要管證明寫不寫得完。這個兩欄動作本身就是課程第一份講義教的第一招，而多數人卡住的原因不是不會證，是根本沒有把「起點」跟「終點」分開寫下來過。寫完之後再打開 Proofwriting Checklist，拿那八條去掃你剛寫的東西——你會在第一次就抓到至少一項。

## 附錄：數字與查證方式

- **學分**：ExploreCourses 條目標示 3–5 學分。syllabus 另外規定，大學部與 CGOE 學生必須以五學分修，只有已入學研究生可以在 3 到 5 之間選；課程內容與要求不隨學分數改變。
- **成績組成**（2026 暑期版 syllabus）：作業 20%、考試 75%、課堂參與 5%。作業分數採「各次分數開根號後加總，除以各次滿分開根號後加總」，效果是把 81% 抬成 90%；不丟掉最低一次。考試分數的權重是高分那次 7/15、低分那次 5/15、期末再額外 3/15，因此期末的實質權重高於期中。課堂參與靠 PollEV 點名，可以缺三次仍拿滿分；線上學生免計，權重按比例重新分配。
- **及格門檻**：作業與考試兩塊必須「各自」達到及格水準才算通過，syllabus 給的粗估是作業約 60%、考試約 50%，並聲明最終標準由授課者在學期結束後決定。歷年成績中位數落在 B/B+ 交界附近。
- **遲交**：三天免罰遲交額度，每份作業最多用一天；用完後遲交乘 0.7；超過 24 小時一律不收。PS7 不得使用遲交額度。
- **講次與作業數**：2026 暑期版 15 講、8 份作業（PS0–PS7）、1 次期中 1 次期末；2026 春季版 28 講、10 份作業（PS0–PS9）。2020 秋季版的封存目錄裡有 4 份期中考題。
- **講義長度**：Proofwriting Checklist 的網頁版約一萬四千字、八條準則各附練習；Guide to Proofs on Sets、Guide to Induction、Guide to the Myhill-Nerode Theorem 各約一萬字上下。這些是我抓取網頁後計字的粗估，不是官方數字。
- **封存網址編碼**：`cs103.1268` → 學年結束於 2026、季別碼 8（暑期）。季別碼 2=秋、4=冬、6=春、8=暑。此規則由我逐一測試 `1212` 到 `1268` 各代碼並比對頁面自述的學期得出，Stanford 沒有公開說明頁。
- **未能確認的三項**：（一）我沒有找到任何一屆 CS103 的官方公開上課錄影，但「找不到」不等於「不存在」，不排除有非官方轉載。（二）Stanford 的課程封存區沒有可瀏覽的索引頁（`web.stanford.edu/class/archive/cs/cs103/` 回 404），所以「最早的封存版本是哪一屆」我只能逐碼測試，測到 2020 年秋季仍存在就停了，更早的沒有窮舉。（三）ExploreCourses 的 CS 103 描述叫讀者去加選 CS103A，但以 CS103A 搜尋只會搜到 CS 103 本身；目錄裡實際存在的伴隨課是 CS 103ACE（一學分、Satisfactory/No Credit、與 CS103 同修）。這兩個代碼之間的關係我沒有查到官方說明。

## 參考資料

- [CS103 課程官網（永遠指向當屆）](https://web.stanford.edu/class/cs103/)——講次表、作業、講義的入口；證明它指向的是當下開課的那一屆
- [CS103 Summer 2026 封存版（cs103.1268）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/)——15 講 8 份作業的壓縮版，本文引用的 syllabus 與作業頁均出自此
- [CS103 Spring 2026 封存版（cs103.1266）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)——28 講 10 份作業的正規學期版，證明兩版差距
- [CS103 Syllabus（Summer 2026）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/syllabus)——學分硬規定、成績公式、遲交政策、Qt Creator 要求
- [CS103 and the Honor Code](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/honor_code)——生成式 AI 全面禁用、往屆解答禁看、Regret Clause 的原文
- [Mathematical Prerequisites](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/prereqs)——證明數學先修只到高中代數
- [How to Succeed in CS103](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/how_to_succeed)——課程對讀書方法的官方立場，以及歷屆學生的建議彙整
- [Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/proofwriting_checklist)——八條評分準則與「Contradiction Sandwich」的原始出處
- [Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/guide_to_proofs)——本文「怎麼開始」那節建議的起點
- [Problem Set 4（Summer 2026）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/psets/ps4/)——「最後一份純離散數學」與考後放寬評分的公告
- [Problem Set 5（Summer 2026）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/psets/ps5/)——「第一次踏進計算理論」與自動機編輯器
- [Problem Set 7（Summer 2026）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/psets/ps7/)——不得使用遲交額度、筆試題改為完成度計分
- [Problem Set 9（Spring 2026）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps9/)——P 對 NP 的 Grand Challenge 原文
- [ExploreCourses：CS 103](https://explorecourses.stanford.edu/search?q=CS+103&view=catalog)——先修條件、學分區間、開課學期與授課者，以及「有證明經驗者請改修 CS154」那句
- [Keith Schwarz 的 CS103 封存頁](https://www.keithschwarz.com/cs103/)——十六屆課程網站與授課者自己的改版說明
- [Ten Techniques to Get Unstuck（Fall 2020）](https://web.stanford.edu/class/archive/cs/cs103/cs103.1212/materials/Handouts/060%20Ten%20Techniques%20to%20Get%20Unstuck.pdf)——已從現行網站消失的十招卡關對策
- [Stanford Qt Creator 安裝指南](https://web.stanford.edu/dept/cs_edu/resources/qt/)——程式作業的開發環境
- 站內：[Stanford CS 課程導讀：按先修關係排一次](/posts/learning/2026-08-20-stanford-cs-course-map)
- 站內：[Stanford CS329A 導讀](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents)
