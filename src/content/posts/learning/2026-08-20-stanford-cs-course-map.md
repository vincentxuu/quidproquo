---
title: "Stanford CS 課程導讀：按先修關係排一次，從 CS106A 到 CS336"
date: 2026-08-20
category: learning
tags:
  - stanford
  - cs-course
  - learning-path
  - ai-course
  - self-study
  - llm
lang: zh-TW
series:
  name: "Stanford CS 主線課程導讀"
  order: 1
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 1
type: guide
tldr: "Stanford CS 一年開三百多門課，但骨架只有五門：CS103、CS107、CS109、CS111、CS161——CS221 的先修欄位直接把其中四門列出來。這篇按官方先修關係排出從入門到研究級的階梯，五條分支各走一段，並處理兩件課表通常不講的事：自學會卡在哪四個地方（起始碼被鎖、錄影不外流、GPU 要錢、沒人改作業），以及有哪些被廣泛引用的進階課其實已經停開好幾年。"
description: "以 Stanford 官方核心課程要求與 ExploreCourses 先修條件為依據，排出 CS106A 到 CS336、CS329A 的完整修課階梯，涵蓋 NLP/LLM、視覺、強化學習、圖學、系統五條分支，並附上公開教材現況、自學限制與最近開課紀錄。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-20-stanford-cs-course-map-en)

Stanford 電腦科學系一年開出的課超過三百門，其中一大批把講義、作業、甚至考古題整包放在公開網址上，不必註冊、不必登入、不必付錢。問題是這件事對自學者幾乎沒有幫助——你不知道從哪一門開始，也不知道哪些課只是掛著網址、點進去其實拿不到東西。

這篇是那份地圖。它按**官方先修關係**排，從第一門程式課排到需要申請才修得到的 LLM 課，每一階標出這門課在教什麼、公開教材實際拿得到什麼。文章後半處理兩件課表通常不講的事：不修學分的人會在哪裡碰壁，以及**有些被廣泛引用的進階課，其實已經好幾年沒開了。**

範圍先講清楚：**這篇只收「教材公開到足以自學」的課**。Stanford CS 還有大量研討會型、實驗室型、跨系合開的課（HCI、圖學、生物計算、計算法律都各有一整排），它們或者只放一份 syllabus，或者材料全在 Canvas 後面，所以不進這份清單。另外，本站已經有兩個系列逐週拆解單一課程——[CS146S](/posts/ai/2026-08-16-cs146s-course-map) 和 [CS230](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)——這篇是它們上一層的入口，不重複那些內容。

## 先破一個誤會：課號不是難度

很多人以為 CS106B 比 CS103 簡單、CS336 比 CS229 難，因為數字比較小或比較大。這個推論在 Stanford 不成立，而且不成立是官方講的。學術輔導處的課程目錄說明頁寫得很直接：

> Stanford does not have a standardized course numbering system. This means that each department is free to number its courses in its own way.

同一頁給了一份「常見但非通用」的慣例（完整區間見文末附錄），大意是數字越大、預設你會的東西越多。CS 系大致照這個走，所以課號可以當成**「這門課預設你已經會什麼」的粗略指標**，但不能當成難度排序。

反例俯拾即是：CS221 掛在 200 系列卻是 AI 的入門課；CS124 掛在 100 系列，先修卻要求 CS109 加上接近 CS107 的程度；CS336 掛在研究生號段，門檻不在數學，在你敢不敢在沒有鷹架的情況下寫完五份作業。

所以這篇改用另一個判準：**每門課 ExploreCourses 條目裡的 `Prerequisites` 欄位怎麼寫。** 那是官方寫下來的依賴關係，比任何印象都可靠。

## 第一階：程式入門，兩門課換兩種語言

**CS106A: Programming Methodology** 教 Python，從 Karel 這隻只會前進、轉彎、撿東西的機器人開始。作業依序是 Karel、可汗學院風格的練習系統、影像處理、文字生成、最後一份寫搜尋引擎。這門課不預設任何程式背景，是整個系唯一一門真的從零開始的課。

**CS106B: Programming Abstractions** 換到 C++，也是大多數人真正「開始學電腦科學」的地方。它的講次表就是一份標準資料結構課綱：stack 與 queue、set 與 map、Big-O、遞迴與回溯、排序、指標與動態記憶體、linked list、二元搜尋樹、Huffman 編碼、雜湊、圖與 Dijkstra。修完這門，你手上就有寫得動大部分技術面試題的工具。

中間還夾了一門 **CS106L: Standard C++ Programming**，一學分、七份很短的作業、沒有考試、成績只有通過與不通過。它補的是 CS106B 為了教概念而刻意略過的東西：初始化、參考、迭代器、模板、lambda、move 語意、RAII 與智慧指標。如果你的目標是把 C++ 寫得像 C++ 而不是像有指標的 Java，這一學分的投報率很高。

**怎麼做**：打開 CS106B 的講次索引，找到「Big O and Algorithmic Analysis」那一講，把投影片讀完，然後闔上，拿張紙寫下你能想起來的每一個複雜度等級與對應的例子。寫不出來的地方就是你以為自己懂的地方。

## 第二階：學位的骨架，是這五門

這是整篇最重要的一節。Stanford CS 系官網的核心要求頁把大學部的骨架寫死成五門課，而且附了一條硬規定：**CS103、CS107、CS109、CS111、CS161 必須以五學分修習**。不是「建議」，是不接受降學分的版本。

更能說明它們地位的是另一件事：**CS221 的先修欄位，直接把其中四門列了出來**——CS103、CS106B、CS109、CS161，後面還補一句「我們強烈建議在修課前先熟悉這些概念」。想走 AI 的人常常想跳過這一階，但 AI 的入門課自己不同意。

| 課號 | 課名 | 這門課換掉你哪個直覺 |
|---|---|---|
| CS103 | Mathematical Foundations of Computing | 「程式寫得出來就是對的」→ 你得證明它對 |
| CS107 | Computer Organization and Systems | 「變數是個盒子」→ 變數是一段有位址的位元組 |
| CS109 | Probability for Computer Scientists | 「平均值就夠了」→ 分布、獨立性、貝氏 |
| CS111 | Principles of Computer Systems | 「程式從頭跑到尾」→ 行程、排程、虛擬記憶體 |
| CS161 | Design and Analysis of Algorithms | 「跑得動就好」→ 為什麼跑得動、多快、能不能更快 |

幾件值得知道的事：

**CS111 跟 CS110 的關係是替代，不是改名。** 已下線的核心要求頁確實標過「Formerly known as CS110」，本文原本據此說兩者是同一門課、CS110 的自學資源照樣可用。**那句話會誤導人。** 現行 ExploreCourses 上 CS111 的官方描述寫的是「Available as a substitute for CS110 that fulfills any requirement satisfied by CS110」——替代，不是等同；而 CS110 的課號至今還活著，2026-27 學年還掛著它的補充實驗課 CS110L。

差別是實質的：CS110 的作業有 Stanford Shell、HTTP 代理與 MapReduce，講次表裡有三堂網路；今天的 CS111 一堂網路都沒有，換成虛擬記憶體、按需分頁、頁面置換與崩潰復原。兩門共有的只剩並行那一段。所以跟著 CS110 自學指南走的人會做到一批不在 CS111 裡的東西，同時錯過今天 CS111 的一半。兩份材料都有價值，但它們不是同一門課的兩個版本。

**CS103 的後半段比前半段重要。** 前半是離散數學與證明技巧，後半直接進有限自動機、正規表達式、上下文無關文法、圖靈機、可判定性、停機問題，最後收在 P 對 NP。它是把「電腦能算什麼」這件事講清楚的那門課。

**CS107 是最痛也最值得的一門。** 作業從 Unix 與 C 入門，一路做到 C 字串、堆積、`void *` 泛型操作、函式指標、x86-64 組合語言，最後一份是自己寫一個記憶體配置器。它的實驗課講義連解答都公開。

**CS111 的作業表就是一部作業系統。** 從 lambda 與執行緒開始，做同步、執行緒排程器、自己實作 lock 與 condition variable、記憶體映射的加密檔案、時鐘演算法的分頁替換、讀 Unix v6 檔案系統、最後是日誌式檔案系統。

**CS109 是這一階裡最不能跳的一門。** 它的 2026 年版本還多了一個東西：每一講的「課外」欄位除了投影片，還掛著一份「LLM Learning Guide」。一門機率課把「怎麼用語言模型讀這一講」做成官方教材的一部分，這件事本身就是訊號。

跳過 CS109 的代價不會在下一門課出現，會在你之後修的每一門課出現：CS224W 的先修是 CS109 加任一門入門機器學習，CS234 要求基本機率，CS336 要求 CS109 等級的機率統計。

**CS161 曾經有兩個官方課名，現在只剩一個。** 系上的核心要求頁一度把它叫做「Data Structures and Algorithms」，而 ExploreCourses、暑期部與課程自己的網站都叫「Design and Analysis of Algorithms」。那個矛盾現在消失了——不是因為兩邊談攏，是因為**掛著舊課名的那個頁面整個下線了**（見下方更新紀錄）。現行的官方來源一律寫 Design and Analysis of Algorithms，舊說法只剩 [Wayback 快照](https://web.archive.org/web/20260510054742/https://www.cs.stanford.edu/bs-core-requirements)讀得到。找資料時用現行課名就對了。

**怎麼做**：如果你已經會寫程式但沒修過系統課，直接下載 CS107 的第一份作業講義，把 `Assign0` 做完。它會很快告訴你，你對「一個整數在記憶體裡長什麼樣」的理解有多少是猜的。

## 第三階：三個入口，建議至少走兩個

過了地基，AI 這條線的入口不是單一一門課，是三個方向不同的門。

**CS221: Artificial Intelligence: Principles and Techniques** 是最標準的那個。它把 AI 定義成「在資訊不完整（所以需要機率）與計算有限（所以需要演算法）的情況下做出好決策」，涵蓋搜尋、約束滿足、賽局、馬可夫決策過程、圖模型、機器學習與邏輯。這是唯一一門會讓你看見「深度學習以外的 AI」的入門課。

**CS124: From Languages to Information** 是語言與資訊的入口，也是 NLP 線的正式起點。官方描述已經把方法從正規表達式、邏輯迴歸、梯度下降一路寫到 transformer 與大型語言模型，應用涵蓋聊天機器人、資訊檢索、社群運算與推薦系統。它的先修比課號看起來嚴格得多：CS106B、CS106A 等級的 Python、CS109，外加 CS107 等級的 UNIX 與程式成熟度。

**CS238: Decision Making under Uncertainty**（與 AA228 合開）是決策與不確定性的入口，走強化學習、規劃、自主系統的人從這裡進去最順。

## 第四階：主幹，CS229 與 CS230

過了入口就是建立模型能力的主幹。

**CS229** 是理論那一側，把統計假設攤開來推。它有一份幾百頁的公開講義 PDF，從線性迴歸一路寫到自監督學習與基礎模型；Stanford Online 的 YouTube 頻道除了長年掛著 Andrew Ng 在 2018 年那版，2026 年春季那一版也已經整批上架。想要「有講義、有影片、有作業」三件套的人，這門最完整。

**CS230** 是實作那一側，走翻轉教室：影片與程式作業在 Coursera 的深度學習專項課程上，實體課堂只留下講座與專案討論。這代表兩件事——自學者能拿到的核心教材反而最齊全（因為本來就在 Coursera 上），但你拿不到那個真正的差異化部分，也就是課堂上的專案回饋。本站的 [CS230 導讀系列](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)逐講拆解了那些講座內容。

兩門的關係不是二選一，是互補。

**CS228: Probabilistic Graphical Models** 補的是機率推理那條線：貝氏網路、馬可夫網路、隱藏馬可夫模型、動態貝氏網路、精確與近似推論。它的先修只寫「基本機率理論與演算法設計分析」，比大多數人以為的低。

**怎麼做**：如果你不確定該從 CS229 還是 CS230 開始，去讀 CS229 的公開講義 PDF 第一章，讀不動就先修 CS230。這比任何自我評估都準。

## 第五階：五條分支

### A. NLP / LLM / Agent

這條線的先修鏈是五條分支裡最完整的，可以一路串到底。

| 課號 | 課名 | 官方先修 |
|---|---|---|
| CS124 | From Languages to Information | CS106B、Python、CS109、CS107 等級 |
| CS224N | Natural Language Processing with Deep Learning | 微積分與線性代數；CS124、CS221 或 CS229 |
| CS224U | Natural Language Understanding | CS224N 或 CS224S |
| CS224V | Agentic AI | LINGUIST 180/280、CS124、CS224N、CS224S、CS224U 擇一 |
| CS329X | Human Centered NLP | — |
| CS329A | Self-Improving AI Agents | CS224N 或 CS229S |
| CS336 | Language Modeling from Scratch | Python、PyTorch、系統概念、微積分與線性代數、CS109 等級機率 |

**CS224N 的網站有個少見的價值**：它把 2000 年以來每一屆的課程網站都留著。你可以打開 2019 年那版，看看 Transformer 剛出現時這門課怎麼教它，再對照現在的版本——同一門課、同一群人，教法差多少一目了然。

**CS224V 現在叫 Agentic AI**，這是 2026 年才有的名字。內容直接處理 RAG 與形式化任務描述、跨資料庫與知識庫的混合推理、AI 驅動的科學知識探索、用形式方法提升決策 agent 的準確度與可解釋性、以及長時程 agent 的效率。想做 agent 又想要有正課可上的人，這門的優先序被低估了。

**CS329X: Human Centered NLP** 談人本設計、human-in-the-loop、公平性與可及性。它容易被當成軟性選修跳過，但它處理的正是把模型變成產品時最先炸開的那一類問題。

### B. 視覺

**CS231A: Computer Vision** 講相機與投影模型、濾波與邊緣偵測、分割與分群、立體重建、物體與場景辨識。它的舊課號是 CS223B，先修只要線性代數與基本機率統計。

**CS231N: Deep Learning for Computer Vision** 才是深度學習那一側。它的講義網站是很多人第一次真正看懂反向傳播的地方，2026 年春季的作業已經更新到第三份包含擴散模型與 CLIP、DINO——這門課的名字雖然還叫電腦視覺，內容早就不只電腦視覺了。順帶一提，它的課名已經不是很多整理裡寫的「Convolutional Neural Networks for Visual Recognition」，那是舊名字。

順序上，先有 CS229 或 CS230 的模型基礎再進 CS231N 會順很多，CS231A 則可以並行或之後補。

### C. 強化學習與機器人

`CS221 → CS238 → CS234 → CS223A → CS333`。

**CS234: Reinforcement Learning** 的先修寫得很直接：Python 熟練、CS229 或同等、線性代數、基本機率。**CS223A** 是機器人的基礎課，由 Oussama Khatib 授課。**CS333** 是專案導向的研究所課，把機器人、機器學習與控制理論拉到人機互動的場景，官方只寫「建議修過 AI 入門課」。

### D. 圖與網路

**CS224W: Machine Learning with Graphs** 的先修是 CS109 加任一門入門機器學習，門檻在這一階裡算低的。內容涵蓋表示學習與圖神經網路、Web 演算法、知識圖譜推理、影響力最大化、社群網路分析。旁邊的 **CS246: Mining Massive Data Sets** 處理的是資料大到單機放不下的情況。

### E. 系統與效能

這條分支不長在 AI 上，長在 CS107 上，但做 AI 工程而不只是讀模型的人會需要它。以公開教材完整度來說，這三門明顯突出：

**CS143: Compilers** 是自學友善度的天花板。五份程式作業、四份筆記型作業（附解答）、Cool 語言的參考手冊與執行期說明、十八講的投影片，連近三年的期中期末考題與解答都掛在同一頁上。

**CS144: Introduction to Computer Networking** 的作業設計是它出名的原因。七個檢查點，你會從「用不可靠的東西做出可靠傳輸」開始，一路實作 TCP、往下做網路介面、做一台 IP 路由器，最後一關叫「做一個網際網路」。

**CS149: Parallel Computing** 涵蓋多核 CPU、GPU 與 CUDA、DNN 在 GPU 上的排程、硬體特化。五份程式作業從四核心效能分析做到「寫出世界最快的 CUDA kernel」，其中一份跑在 Trainium2 加速器上。

## 第六階：研究級的那一層

這一層的共同點不是「再教一次模型」，是要求你能做研究、建系統，或從零把整條流程走完。

**CS336: Language Modeling from Scratch**（Tatsunori Hashimoto、Percy Liang）是唯一標注 **Application required**（需要申請）的一門。五份作業，你會自己實作 tokenizer、寫 Transformer、寫 Triton kernel、做多機平行、跑 scaling law、做評測、處理資料、最後做 SFT 與 RLVR 的後訓練。課程網站對先修條件講得毫不客氣：

> The amount of code you will write will be at least an order of magnitude greater than for other classes.

它的講義用一種少見的形式發布——**可執行的講義**。GitHub 上的 `lectures` repo 裡，講次是 `lecture_01.py` 這樣的 Python 檔，跑一次會產生完整的追蹤紀錄再渲染成網頁。那個 repo 目前有數千顆星，作業的起始碼與說明也都公開。

**CS312** 走的是另一條路：它主張光有知識與數學能力不夠，發明下一代架構需要的是跑過非常多次實驗，所以整門課帶學生在可計算的領域裡練「高效實驗與預測實驗結果」的能力。授課的是 Hashimoto——也就是 CS336 的講師之一。

**CS329A: Self-Improving AI Agents** 是研究所研討課，主題涵蓋 constitutional AI、學習型驗證器、擴展測試時計算、把搜尋與 LLM 結合、工具使用與檢索、多模態網頁互動、多步推理與規劃，以及評估與編排框架。九講的錄影已經公開在 Stanford Online 的 YouTube 頻道上。

**CS329Z: Engineering AI Agents** 教複合式 AI 系統：學生先從零手刻 RAG、工具使用、agent loop 這些核心元件，再學 DSPy 這類框架怎麼把這些模式抽象掉。

安全與可靠性那一組是這一層裡最值得注意的變化，因為它們已經不是外圍：**CS221M: Mechanistic Interpretability** 講探測、steering、因果抽象與稀疏自編碼器，特別強調因果方法與大型語言模型；**CS329H: Machine Learning from Human Preferences** 處理偏好異質性、偏好聚合、人類回饋的詮釋與隱私；**CS329T** 則從基礎模型、prompting、RAG 講到 agent 架構與評估。

最後補一門不在這條線上、但值得單獨知道的課：**CS146S: The Modern Software Developer** 是三學分的正式學分課，教的不是寫程式，是怎麼指揮 coding agent 寫程式。先修寫的是 CS111/CS161 等同的程式經驗，建議修過 CS221 或 CS229。本站有[逐週拆解的系列](/posts/ai/2026-08-16-cs146s-course-map)。

## 自學真正會卡在哪裡

前面六階都在講「有什麼」。這一節講「拿不到什麼」，而這四個障礙沒有一個跟你的能力有關。

**一、起始碼會被鎖在課堂流程後面。** CS106B 2025 年春季那版的公告寫得很清楚：第四份作業的起始碼要先填完期中問卷才會開放。這類設計在入門課特別常見，因為助教要靠它掌握進度。自學者的解法是往回找——舊學期的封存版通常已經解鎖。

**二、影片是最不穩定的一項。** CS149 的課程網站直接寫了「今年無法對外散布課程錄影」，但同時附上 2023 年那版在 Stanford 官方 YouTube 頻道的連結。CS330 也是類似安排：當屆錄影在 Canvas 裡，往屆的公開。所以「這門課沒有影片」多半是錯的判斷，正確的問法是「哪一屆有影片」。

**三、有些課的作業需要你買 GPU 時數。** CS336 是最明顯的例子，它整門課的重點就是讓模型在多張 GPU 上跑得快。這不是能靠免費 Colab 繞過去的限制，得先算清楚預算再決定要不要開始。

**四、沒有人會改你的作業。** 這是最容易被低估的一項。多數課的自動評分器綁在 Gradescope 上，自學者拿不到。CS143 是少數的例外——它把考題與解答都公開了，所以你至少可以自己對答案。

**怎麼做**：Stanford 的課程網站有封存機制，網址長成 `web.stanford.edu/class/archive/cs/<課號>/<課號>.<學期代碼>/` 這樣。它沒有可以瀏覽的總索引頁（我試過，那層目錄直接回 404），所以最實際的方法是從現行課程網站找「Previous offerings」那一區的連結——CS224N、CS224W、CS246 都把歷屆網址整排列在首頁上。

那串學期代碼有規律，值得記：末碼 2、4、6、8 分別是秋、冬、春、夏，前面三碼是學年。所以 `1262` 是 2025 秋、`1264` 是 2026 冬、`1266` 是 2026 春、`1268` 是 2026 夏；而 `1256` 屬於上一個學年，是 **2025 春**，不是 2025 秋。這個差一格的誤讀很容易發生，本文自己就犯過（見更新紀錄）。不確定的時候別推算——封存頁自己會在最上面寫「This page is not current. It is an archive from X Quarter YYYY.」，打開看一眼最快。

## 先查有沒有開，再查先修

還有一個障礙比前面四個更早發生，而且最容易整份計畫報廢：**你排進計畫的課，可能已經好幾年沒開了。**

網路上流傳的 Stanford AI 修課地圖，常把一批進階課列成「本學年有開」。逐門對過 ExploreCourses 之後，其中幾門的最後一次開課紀錄是這樣：

| 課號 | 課名 | ExploreCourses 上的最後一次開課 |
|---|---|---|
| CS329S | Machine Learning Systems Design | 2022 冬 |
| CS324 | Advances in Foundation Models | 2023 冬 |
| CS329D | Machine Learning Under Distributional Shifts | 2023 春 |
| CS229S | Systems for Machine Learning | 2024 秋 |
| CS329A | Self-Improving AI Agents | 2025 秋 |
| CS228 | Probabilistic Graphical Models | 2024 冬 |
| CS124 | From Languages to Information | 2026 冬 |
| CS224U | Natural Language Understanding | 2023 春 |

這裡面藏了一個小小的死結：**CS329A 指定的先修是 CS224N 或 CS229S，而 CS229S 自己已經兩年沒開。** 對校內學生來說這只是「走 CS224N 那條」，但對照著網路整理排計畫的自學者來說，這種細節就是計畫報廢的來源。

表格最後三列是後來補的，而且補的過程本身就是這一節的最好例子——**它們用本節原本教的查法查不出來**。CS228 在 2026-2027 冬季有一筆條目，掛著課號，看起來就是有開；但它的上課時間顯示為空、講師欄整個空白，而切到 2024-2025 學年的分頁才會看到那行「Last offered: Winter 2024」。CS124 與 CS224U 也是同一類：現行分頁不會告訴你它們停了多久。

停開不等於材料沒用。CS324 的課程網站與 CS329A 的九講錄影都還在，內容也還沒過時到不能讀。但**「這門課還開不開」和「這門課的材料還能不能學」是兩個問題，混在一起就會排出一份修不到的課表。**

**怎麼做**：在 ExploreCourses 搜課號，看它顯示「2026-2027 Autumn/Winter/Spring」還是「Last offered: ⋯⋯」。**但只做這一步會漏掉一整類課**——排了課卻沒有真的開的那類，因為現行學年的分頁上，一筆佔位條目跟一筆真的會開的課長得一模一樣。

補兩步就能補起來。第一步，看那筆條目的**上課時間與講師欄**：真的要開的課會有時段和人名，佔位的兩欄都是空的。第二步，點頁面頂端的**舊學年分頁**（2024-2025、2025-2026），停開的課會在那裡露出「Last offered」那行。

要一次查完，ExploreCourses 有個公開的 XML 介面比點頁面快得多：

```
https://explorecourses.stanford.edu/search?view=xml-20200810&academicYear=20252026&q=CS228&filter-departmentcode-CS=on
```

把 `academicYear` 換成各學年逐年拉一遍，看那一年的條目裡有沒有 `<term>` 元素——**沒有 `<term>` 就是那學年沒開**。這比讀網頁可靠，因為那頁是 JavaScript 算出來的，抓網頁原始碼常常只拿到「Loading…」。

## 五條路線，各挑一條走

**如果你要轉職當軟體工程師**：CS106B → CS107 → CS161。三門就好。CS106B 給你資料結構，CS107 給你「程式在機器上到底怎麼跑」，CS161 給你面試時被問到演算法不會慌的底氣。CS103 可以之後補，先跳過不影響前三門。

**如果你已經在寫程式，但覺得自己少了一塊底**：CS111 加上 CS143 或 CS144 選一門。判斷方式是看你平常在 debug 什麼——如果常常在追效能與記憶體，選 CS143 讓你看懂編譯器對你的程式做了什麼；如果常常在追連線、逾時、重試，選 CS144，那七個檢查點會讓你對 TCP 的理解從「知道有這個東西」變成「自己寫過一個」。

**如果你要走通用 AI 研究**：地基五門 → CS221 → CS229 → CS230 → CS228 → 挑一條分支 → CS312 或 CS221M。這條最像先打全科底再走研究導向。

**如果你的目標是 LLM 與 agent**：地基五門 → CS124 → CS221 → CS229 → CS224N → CS224U 或 CS224V → CS329X → CS329Z → CS336。每一步都有官方先修關係撐著，是五條裡依賴鏈最完整的一條。中間那些課想跳可以，但 CS336 的先修條件要老實面對——它要求的不是修過幾門課，是你能不能在沒有鷹架的情況下寫出大量 PyTorch。如果對這一點沒把握，先把 CS231N 的作業做完，那份作業的鷹架密度剛好是 CS336 的相反面。

**如果你走視覺或機器人**：視覺是地基五門 → CS229 → CS230 → CS231A → CS231N；機器人是地基五門 → CS221 → CS238 → CS234 → CS223A → CS333。

五條路線的共同前提只有一個：**選一條，做完它的作業。** 把二十幾門課的講義都下載下來，是這份地圖最容易導致的失敗方式。

還有一句提醒：**不要把 CS329A、CS329Z、CS336 當第一站。** 從先修結構看，這些課預設你已經有機器學習、深度學習、NLP 或 LLM、以及系統與評估的底子。地基那五門看起來離 AI 很遠，但它們是唯一沒有捷徑的部分。

## 附錄：數字與查證方式

本文的課程資訊來自 2026-08-20 當天實際抓取的官方課程網站與 Stanford ExploreCourses 2026-2027 學年條目，先修條件與開課紀錄以該頁面顯示的內容為準，不採信二手整理。以下是正文為了可讀性而收在這裡的數字：

- **學分**：核心五門各五學分（且不接受降學分）；CS106L 一學分；CS146S 三學分；CS221M、CS329H、CS329X、CS329T、CS329Z 各三學分；CS224V、CS224W、CS228、CS231A 各 3–4；CS312、CS336 各 3–5。
- **CS221 官方先修**：CS103（或 CS103B/X）、CS106B（或 CS106X）、CS109、CS161。
- **付費修習的價格**：Stanford Online 的遠距學分版本，CS107 學費 8,110 美元、CS161 與 CS336 各 7,875 美元，都是五學分。教材免費、學分很貴，這個落差是這份地圖的前提。
- **CS231N 評分比重**：作業 45%、期中 20%、期末專案 35%。
- **CS336 講義 repo**：GitHub 上約 3.6k 顆星、757 個 fork（2026-08-20 讀數）。
- **2026-27 學年有開的進階課**：CS221M（春）、CS224N（冬）、CS224U（春）、CS224V（秋）、CS224W（秋）、CS223A（冬）、CS231A（冬）、CS329H（秋）、CS329T（春）、CS329X（秋）、CS329Z（秋）、CS312（秋）、CS333（冬）、CS336（春，需申請）。**CS228 原本也列在這裡，現已移除**：它在 2026-2027 冬季確實有一筆條目，但上課時間與講師欄皆空，且 2024-2025 學年的分頁顯示「Last offered: Winter 2024」，屬於上一節講的佔位條目。
- **課號慣例**：1–99 全校入門、100–199 本系大學部、200–299 高年級與研究所新生、300 以上研究生。官方明講這不是標準，只是常見慣例。
- **CS231A 舊課號**：CS223B。**CS111 前身**：CS110。

有三項未能完全確認，都不是查得不夠，是結構性拿不到：Stanford 課程封存區沒有公開的索引頁，因此無法列出「總共有幾門課保留了歷屆網站」；CS312 的課程名稱在 ExploreCourses 的搜尋結果中沒有完整渲染出標題列，但以「Deep Learning Alchemy」為關鍵字搜尋會命中該條目；CS238 的獨立條目同樣沒有渲染成功，其存在與 AA228 的合開關係是從 CS239 的先修欄位「AA 228/CS 238 or CS 221」反推的。後兩項不影響階梯的排序結論。

## 更新紀錄

- 2026-08-21：把主線課程逐門展開成獨立導讀之後，回頭修正本文六處。**（一）** 五學分規定原本引的 `www-cs.stanford.edu/bs-core-requirements` 已下線（301 轉址後 404），改引現行的 BS Degree Requirements 頁，舊頁補上 Wayback 快照。**（二）** CS106B 封存版誤標為 Fall 2025，實為 Spring 2025；同時補上學期代碼的解讀規律。**（三）** CS161「兩個官方課名」的矛盾已不成立——掛舊課名的頁面隨上述下線一併消失。**（四）** 停開表補上 CS228（2024 冬）、CS124（2026 冬）、CS224U（2023 春）。**（五）** CS228 自「2026-27 有開」清單移除，它那筆冬季條目沒有時段也沒有講師。**（六）** 「先查有沒有開」那節原本的查法會漏掉佔位條目，補上看時段與講師欄、切舊學年分頁、以及 ExploreCourses XML 介面三種做法。**（七）** 原本寫「CS111 就是以前的 CS110、CS110 自學資源照樣可用」，但現行官方描述寫的是「substitute for CS110」而非改名，且兩門課的作業與講次表差異很大（CS110 有 shell、HTTP 代理、MapReduce 與三堂網路，CS111 都沒有），該段已改寫。

## 參考資料

- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — 核心五門五學分規定的現行出處（原文：「all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units」）
- [舊版 CS BS Core Requirements（Wayback 2026-05-10 快照）](https://web.archive.org/web/20260510054742/https://www.cs.stanford.edu/bs-core-requirements) — 已下線的舊頁，「CS111 前身為 CS110」與 CS161 舊課名「Data Structures and Algorithms」唯一還讀得到的出處
- [Understanding the Course Catalog | Stanford Academic Advising](https://advising.stanford.edu/current-students/advising-student-handbook/course-catalog) — 課號慣例與「Stanford 沒有標準編號系統」的原文
- [Stanford Explore Courses](https://explorecourses.stanford.edu/) — 本文所有先修條件、學分數與開課紀錄的來源
- [Stanford Explore Courses: Course Catalog Numbering](https://explorecourses.stanford.edu/about) — 編號規則的第二個官方出處
- [CS106A: Programming Methodology](https://web.stanford.edu/class/cs106a/) — Summer 2026 講次與作業列表
- [CS106B: Programming Abstractions](https://web.stanford.edu/class/cs106b/) — Summer 2026 課程概述與講次索引
- [CS106B Spring 2025 封存版](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1256/) — 起始碼需填問卷解鎖的公告，也是封存網址格式的實例（該頁自己標「an archive from Spring Quarter 2025」）
- [CS106L: Standard C++ Programming](https://web.stanford.edu/class/cs106l/) — 一學分、七份作業、S/NC 的課程設計
- [CS103: Mathematical Foundations of Computing](https://web.stanford.edu/class/cs103/) — 課程概述與講次表
- [CS107: Computer Organization & Systems](https://web.stanford.edu/class/cs107/) — 作業、實驗與解答
- [CS109: Probability for Computer Scientists](https://web.stanford.edu/class/cs109/) — 每講附 LLM Learning Guide 的講次表
- [CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/) — 九份作業的完整列表
- [CS161: Design and Analysis of Algorithms (Winter 2026)](https://stanford-cs161.github.io/winter2026) — 官方課名與課程描述
- [CS 221: Artificial Intelligence: Principles and Techniques](https://explorecourses.stanford.edu/search?q=Artificial+Intelligence+Principles+and+Techniques&view=catalog) — 四門先修課的官方明列
- [CS 124: From Languages to Information](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) — 從正規表達式到大型語言模型的課程描述與先修
- [CS143: Compilers](https://web.stanford.edu/class/cs143/) — 程式作業、筆記作業解答、歷屆考題與 Cool 語言手冊
- [CS144: Introduction to Computer Networking](https://cs144.github.io/) — 七個檢查點的實驗設計
- [CS149: Parallel Computing (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25) — 五份作業，以及「今年不對外散布錄影」的說明
- [CS229: Machine Learning](https://cs229.stanford.edu/) — 課程描述與公開講義
- [CS229 講義 PDF](https://cs229.stanford.edu/main_notes.pdf) — 從線性迴歸到基礎模型的完整筆記，也是自我評估用的第一章
- [Stanford CS229 Spring 2026 Lecture 1（YouTube）](https://www.youtube.com/watch?v=DATnpGoGhM8) — 2026 年春季版本的公開錄影
- [CS 229S: Systems for Machine Learning](https://explorecourses.stanford.edu/search?q=CS+229S&view=catalog) — 課程描述與「最後一次開課：2024 秋」
- [CS230: Deep Learning](https://cs230.stanford.edu/) — 翻轉教室形式與 Coursera 專項課程的關係
- [CS 228: Probabilistic Graphical Models](https://explorecourses.stanford.edu/search?q=Probabilistic+Graphical+Models&view=catalog) — 課程範圍與先修
- [CS231n: Deep Learning for Computer Vision](https://cs231n.stanford.edu/) — Spring 2026 課程資訊與評分比重
- [CS231n 講義網站](https://cs231n.github.io/) — Spring 2026 作業內容
- [CS 231A: Computer Vision](https://explorecourses.stanford.edu/search?q=CS+231A&view=catalog) — 舊課號 CS223B 與先修
- [CS224n: NLP with Deep Learning](https://web.stanford.edu/class/cs224n/) — 歷屆課程網站與錄影索引
- [CS 224N 官方條目](https://explorecourses.stanford.edu/search?q=Natural+Language+Processing+with+Deep+Learning&view=catalog) — 2026-27 冬季開課與先修
- [CS 224U: Natural Language Understanding](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — 先修 CS224N 或 CS224S
- [CS 224V: Agentic AI](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — 更名後的課程描述與先修清單
- [CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) — 歷屆封存網站列表
- [CS 224W 官方條目](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) — 先修 CS109 加任一入門 ML
- [CS234: Reinforcement Learning (Winter 2026)](https://web.stanford.edu/class/cs234/) — 課程排程與作業
- [CS 234 官方條目](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) — 先修與課程範圍
- [CS236: Deep Generative Models](https://deepgenerativemodels.github.io/) — 先修條件與自編講義說明
- [CS246: Mining Massive Data Sets](https://web.stanford.edu/class/cs246/) — 歷屆網站與 Colab 作業
- [CS330: Deep Multi-Task and Meta Learning](https://cs330.stanford.edu/) — 先修條件與錄影取得方式
- [CS 312](https://explorecourses.stanford.edu/search?q=Deep+Learning+Alchemy&view=catalog) — 以實驗取得掌握度的課程立場與授課者
- [CS 324: Advances in Foundation Models](https://explorecourses.stanford.edu/search?q=CS+324&view=catalog) — 課程描述與「最後一次開課：2023 冬」
- [CS 329A: Self-Improving AI Agents](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog) — 完整主題清單、先修 CS224N 或 CS229S、「最後一次開課：2025 秋」
- [Stanford CS329A Self-Improving AI Agents, Part 1（YouTube）](https://www.youtube.com/watch?v=6YnLB0XbTnI) — 公開的九講錄影
- [CS 329D](https://explorecourses.stanford.edu/search?q=CS+329D&view=catalog)、[CS 329S](https://explorecourses.stanford.edu/search?q=CS+329S&view=catalog) — 「最後一次開課」分別為 2023 春與 2022 冬
- [CS 329H: Machine Learning from Human Preferences](https://explorecourses.stanford.edu/search?q=CS+329H&view=catalog) — 課程描述與 2026-27 秋季開課
- [CS 329T](https://explorecourses.stanford.edu/search?q=CS+329T&view=catalog) — 先修 CS229 等級 ML 加深度學習
- [CS 329X: Human Centered NLP](https://explorecourses.stanford.edu/search?q=CS+329X&view=catalog) — 課程描述與 2026-27 秋季開課
- [CS 329Z: Engineering AI Agents](https://explorecourses.stanford.edu/search?q=Engineering+AI+Agents&view=catalog) — 複合式 AI 系統與 DSPy 的課程描述
- [CS 333](https://explorecourses.stanford.edu/search?q=CS+333&view=catalog) — 人機互動場景的專案導向課程
- [CS221M: Mechanistic Interpretability](https://explorecourses.stanford.edu/search?q=CS+221M&view=catalog) — 探測、steering、因果抽象與稀疏自編碼器
- [CS336: Language Modeling from Scratch](https://cs336.stanford.edu) — Spring 2026 講次、作業與先修條件原文
- [CS 336 官方條目](https://explorecourses.stanford.edu/search?q=Language+Modeling+from+Scratch&view=catalog) — 需申請的標注與 2026-27 春季開課
- [CS336 講義 repo](https://github.com/stanford-cs336/lectures) — 可執行講義的格式與星數
- [CS25: Transformers United V6](https://web.stanford.edu/class/cs25/) — 2026 年春季講者與主題
- [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) — 學分數、先修條件與課程描述
- [Stanford Online: CS107](https://online.stanford.edu/courses/cs107-computer-organization-and-systems)、[CS161](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms)、[CS336](https://online.stanford.edu/courses/cs336-language-modeling-scratch) — 遠距學分版本的學費與開課時程
- 站內延伸：[2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)、[CS146S 兩版大綱對照](/posts/ai/2026-08-16-cs146s-course-map)、[CS230 導讀系列第一篇](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)
