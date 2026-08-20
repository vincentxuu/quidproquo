---
title: "Stanford CS 課程導讀：哪些課真的能自學，該按什麼順序上"
date: 2026-08-20
category: learning
tags:
  - stanford
  - cs-course
  - learning-path
  - self-study
  - ai-course
  - computer-systems
lang: zh-TW
type: guide
series:
  name: "Stanford CS 課程導讀"
  order: 1
tldr: "Stanford CS 系的課多到會讓人不知道從哪開始，但學位的骨架只有五門：CS103、CS107、CS109、CS111、CS161。這篇按階梯排出二十幾門有公開教材的課，標出每一門實際拿得到什麼（講義？作業？影片？），並講清楚自學真正會卡住的四個地方——不是難度，是起始碼被鎖、影片不外流、GPU 要錢、沒有人改你的作業。"
description: "以 Stanford CS 官方核心課程要求為骨架，整理 CS106A 到 CS336 共二十餘門課的公開教材現況、先後順序與自學限制，並依「轉職工程師 / 補系統底 / 追 LLM」三條路線給出選課建議。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-20-stanford-cs-course-map-en)

Stanford 電腦科學系一年開出的課超過三百門，其中有一大批把講義、作業、甚至考古題整包放在公開網址上，不必註冊、不必登入、不必付錢。問題是這件事對自學者幾乎沒有幫助——因為你不知道該從哪一門開始，也不知道哪些課只是掛著網址、點進去其實什麼都拿不到。

這篇是那份地圖。它按「上課順序」排，從第一門程式課排到 2026 年才開的 LLM 課，每一階標出三件事：這門課在教什麼、公開教材實際拿得到什麼、以及不修學分的人會在哪裡碰壁。

範圍先講清楚：**這篇只收「教材公開到足以自學」的課**。Stanford CS 還有大量研討會型、實驗室型、跨系合開的課（HCI、圖學、生物計算、計算法律都各有一整排），它們或者只放一份 syllabus，或者材料全在 Canvas 後面，自學者拿不到東西，所以不進這份清單。另外，本站已經有兩個系列逐週拆解單一課程——[CS146S](/posts/ai/2026-08-16-cs146s-course-map) 和 [CS230](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)——這篇是它們上一層的入口，不重複那些內容。

## 先破一個誤會：課號不是難度

很多人以為 CS106B 比 CS103 簡單、CS336 比 CS229 難，因為數字比較小／比較大。這個推論在 Stanford 不成立，而且不成立是官方講的。學術輔導處的課程目錄說明頁寫得很直接：

> Stanford does not have a standardized course numbering system. This means that each department is free to number its courses in its own way.

同一頁給了一份「常見但非通用」的慣例（完整區間見文末附錄），大意是數字越大、預設你會的東西越多。CS 系大致照這個走，所以課號可以當成**「這門課預設你已經會什麼」的粗略指標**，但不能當成難度排序。實例：CS106B 是入門的第二門課，CS103 是核心課之一，兩者常常同一學期修；而 CS336 雖然掛在研究生的號段，它的門檻不在數學，在你敢不敢在沒有鷹架的情況下寫完五份作業。

真正該當成骨架看的不是課號，是下面這五門。

## 第一階：程式入門，兩門課換兩種語言

**CS106A: Programming Methodology** 教 Python，從 Karel 這隻只會前進、轉彎、撿東西的機器人開始。作業依序是 Karel、可汗學院風格的練習系統、影像處理、文字生成、最後一份寫搜尋引擎。這門課不預設任何程式背景，是整個系唯一一門真的從零開始的課。

**CS106B: Programming Abstractions** 換到 C++，也是大多數人真正「開始學電腦科學」的地方。它的講次表就是一份標準資料結構課綱：stack 與 queue、set 與 map、Big-O、遞迴與回溯、排序、指標與動態記憶體、linked list、二元搜尋樹、Huffman 編碼、雜湊、圖與 Dijkstra。修完這門，你手上就有寫得動大部分技術面試題的工具。

中間還夾了一門 **CS106L: Standard C++ Programming**，一學分、七份很短的作業、沒有考試、成績只有通過與不通過。它補的是 CS106B 為了教概念而刻意略過的東西：初始化、參考、迭代器、模板、lambda、move 語意、RAII 與智慧指標。如果你的目標是把 C++ 寫得像 C++ 而不是像有指標的 Java，這一學分的投報率很高。

**怎麼做**：打開 CS106B 的講次索引，找到「Big O and Algorithmic Analysis」那一講，把投影片讀完，然後闔上，拿張紙寫下你能想起來的每一個複雜度等級與對應的例子。寫不出來的地方就是你以為自己懂的地方。

## 第二階：學位的骨架，是這五門

這是整篇最重要的一節。Stanford CS 系官網的核心要求頁把大學部的骨架寫死成五門課，而且附了一條硬規定：**CS103、CS107、CS109、CS111、CS161 必須以五學分修習**。不是「建議」，是不接受降學分的版本。

| 課號 | 課名 | 這門課換掉你哪個直覺 |
|---|---|---|
| CS103 | Mathematical Foundations of Computing | 「程式寫得出來就是對的」→ 你得證明它對 |
| CS107 | Computer Organization and Systems | 「變數是個盒子」→ 變數是一段有位址的位元組 |
| CS109 | Probability for Computer Scientists | 「平均值就夠了」→ 分布、獨立性、貝氏 |
| CS111 | Principles of Computer Systems | 「程式從頭跑到尾」→ 行程、排程、虛擬記憶體 |
| CS161 | Design and Analysis of Algorithms | 「跑得動就好」→ 為什麼跑得動、多快、能不能更快 |

幾件值得知道的事：

**CS111 就是以前的 CS110。** 官方頁面自己標了「Formerly known as CS110」。網路上大量「Stanford CS110 自學指南」講的是同一門課，資源沒有失效，只是名字換了。

**CS103 的後半段比前半段重要。** 前半是離散數學與證明技巧，後半直接進有限自動機、正規表達式、上下文無關文法、圖靈機、可判定性、停機問題，最後收在 P 對 NP。它是把「電腦能算什麼」這件事講清楚的那門課。

**CS107 是最痛也最值得的一門。** 作業從 Unix 與 C 入門，一路做到 C 字串、堆積、`void *` 泛型操作、函式指標、x86-64 組合語言，最後一份是自己寫一個記憶體配置器。它的實驗課講義連解答都公開。

**CS111 的作業表就是一部作業系統。** 從 lambda 與執行緒開始，做同步、執行緒排程器、自己實作 lock 與 condition variable、記憶體映射的加密檔案、時鐘演算法的分頁替換、讀 Unix v6 檔案系統、最後是日誌式檔案系統。

**CS109 的 2026 年版本多了一個東西。** 每一講的「課外」欄位除了投影片，還掛著一份「LLM Learning Guide」。一門機率課把「怎麼用語言模型讀這一講」做成官方教材的一部分——這件事本身就是訊號。

**CS161 有個小陷阱。** 系上核心要求頁把它叫做「Data Structures and Algorithms」，但 ExploreCourses、暑期部、以及課程自己的網站都叫它「Design and Analysis of Algorithms」。以課程網站為準，同一所學校的兩個官方頁面對不上是常態，找資料的時候用後者才搜得到東西。

**怎麼做**：如果你已經會寫程式但沒修過系統課，直接下載 CS107 的第一份作業講義，把 `Assign0` 做完。它會很快告訴你，你對「一個整數在記憶體裡長什麼樣」的理解有多少是猜的。

## 第三階：系統與理論的選修，三門特別適合自學

核心五門之後，選修課多到沒辦法逐一講。以「公開教材完整度」為標準，這三門明顯突出：

**CS143: Compilers** 是自學友善度的天花板。五份程式作業、四份筆記型作業（附解答）、Cool 語言的參考手冊與執行期說明、十八講的投影片，連近三年的期中期末考題與解答都掛在同一頁上。課程專案是用 Cool 這個為教學設計的語言，從語彙分析、剖析、語意分析、型別檢查一路寫到程式碼產生與最佳化。

**CS144: Introduction to Computer Networking** 的作業設計是它出名的原因。七個檢查點，你會從「用不可靠的東西做出可靠傳輸」開始，一路實作 TCP、往下做網路介面、做一台 IP 路由器，最後一關叫「做一個網際網路」。講義與投影片公開，實驗說明在獨立網站上。

**CS149: Parallel Computing** 的內容涵蓋多核 CPU、GPU 與 CUDA、DNN 在 GPU 上的排程、硬體特化。五份程式作業從四核心效能分析做到「寫出世界最快的 CUDA kernel」，其中一份跑在 Trainium2 加速器上。但這門課有個要注意的限制，見下一節。

## 第四階：AI 主力課，十門裡先挑兩門

這一階的課最多人問，也最容易一次貪多。先把它們的定位排開：

| 課號 | 課名 | 適合什麼時候上 |
|---|---|---|
| CS221 | Artificial Intelligence: Principles and Techniques | 想知道深度學習以外的 AI 還有什麼 |
| CS229 | Machine Learning | 想把數學補起來 |
| CS230 | Deep Learning | 想快速上手、能接受用 Coursera 當教材 |
| CS231n | Deep Learning for Computer Vision | 想從視覺入門、想要有講義可讀 |
| CS224n | NLP with Deep Learning | 想理解語言模型的來歷 |
| CS234 | Reinforcement Learning | 已經懂監督式學習，要補 RL |
| CS236 | Deep Generative Models | 想搞懂 diffusion 與 VAE 的數學 |
| CS224W | Machine Learning with Graphs | 手上的資料是關係網路 |
| CS246 | Mining Massive Data Sets | 資料大到單機放不下 |
| CS330 | Deep Multi-Task and Meta Learning | 想做少樣本、多任務 |

實務上的建議是**只挑兩門**：一門補基礎（CS229 或 CS221），一門補你實際會碰的領域（多半是 CS224n 或 CS231n）。理由很簡單，這些課的作業份量都是以「一學期只修三門課」設計的，而你不是全職學生。

四門特別值得展開：

**CS229** 有一份幾百頁的公開講義 PDF，內容從線性迴歸一路寫到自監督學習與基礎模型。Stanford Online 的 YouTube 頻道除了長年掛著 Andrew Ng 在 2018 年那版（那是全網最多人看過的機器學習課之一），2026 年春季那一版也已經整批上架。想要「有講義、有影片、有作業」三件套的人，這門最完整。

**CS231n** 的講義網站是很多人第一次真正看懂反向傳播的地方。2026 年春季的作業已經更新到第三份包含擴散模型與 CLIP、DINO——這門課的名字雖然還叫電腦視覺，內容早就不只電腦視覺了。

**CS224n** 的網站有個少見的價值：它把 2000 年以來每一屆的課程網站都留著。你可以打開 2019 年那版，看看 Transformer 剛出現時這門課怎麼教它，再對照現在的版本——同一門課、同一群人，教法差多少一目了然。

**CS230** 的形式跟其他課不一樣，它是翻轉教室：影片與程式作業在 Coursera 的深度學習專項課程上，實體課堂只留下講座與專案討論。這代表兩件事——自學者能拿到的核心教材反而最齊全（因為本來就在 Coursera 上），但你拿不到那個真正的差異化部分，也就是課堂上的專案回饋。本站的 [CS230 導讀系列](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)逐講拆解了那些講座內容。

## 第五階：2026 年才有的三門

這三門課的共同點是，它們教的東西在五年前不存在。

**CS336: Language Modeling from Scratch**（Tatsunori Hashimoto、Percy Liang）是目前最硬的一門。五份作業，你會自己實作 tokenizer、寫 Transformer、寫 Triton kernel、做多機平行、跑 scaling law、做評測、處理資料、最後做 SFT 與 RLVR 的後訓練。課程網站對先修條件講得毫不客氣：

> The amount of code you will write will be at least an order of magnitude greater than for other classes.

它的講義用一種少見的形式發布——**可執行的講義**。GitHub 上的 `lectures` repo 裡，講次是 `lecture_01.py` 這樣的 Python 檔，跑一次會產生完整的追蹤紀錄再渲染成網頁。那個 repo 目前有數千顆星，而且作業的起始碼與說明都公開。

**CS25: Transformers United** 是研討會，不是課。每週請一位業界或研究界的人來講最新的東西，2026 年春季那批講者來自 Mistral AI、Hugging Face、DeepMind，主題涵蓋預訓練資料排序、五維平行化、多代理科學研究系統。它沒有作業、沒有先修、影片全部公開，適合當成「追進度」而不是「學基礎」的來源。

**CS146S: The Modern Software Developer** 是三學分的正式學分課，教的不是寫程式，是怎麼指揮 coding agent 寫程式：MCP、agent skills、規格驅動開發、loop engineering、software factory。先修寫的是 CS111/CS161 等同的程式經驗，建議修過 CS221 或 CS229。本站有[逐週拆解的系列](/posts/ai/2026-08-16-cs146s-course-map)，包含兩版大綱的差異對照。

## 自學真正會卡在哪裡

前面五階都在講「有什麼」。這一節講「拿不到什麼」，而這四個障礙沒有一個跟你的能力有關。

**一、起始碼會被鎖在課堂流程後面。** CS106B 2025 年秋季那版的公告寫得很清楚：第四份作業的起始碼要先填完期中問卷才會開放。這類設計在入門課特別常見，因為助教要靠它掌握進度。自學者的解法是往回找——舊學期的封存版通常已經解鎖。

**二、影片是最不穩定的一項。** CS149 的課程網站直接寫了「今年無法對外散布課程錄影」，但同時附上 2023 年那版在 Stanford 官方 YouTube 頻道的連結。CS330 也是類似安排：當屆錄影在 Canvas 裡，往屆的公開。所以「這門課沒有影片」多半是錯的判斷，正確的問法是「哪一屆有影片」。

**三、有些課的作業需要你買 GPU 時數。** CS336 是最明顯的例子，它整門課的重點就是讓模型在多張 GPU 上跑得快。這不是能靠免費 Colab 繞過去的限制，得先算清楚預算再決定要不要開始。

**四、沒有人會改你的作業。** 這是最容易被低估的一項。多數課的自動評分器綁在 Gradescope 上，自學者拿不到。CS143 是少數的例外——它把考題與解答都公開了，所以你至少可以自己對答案。

**怎麼做**：Stanford 的課程網站有封存機制，網址長成 `web.stanford.edu/class/archive/cs/<課號>/<課號>.<學期代碼>/` 這樣。它沒有可以瀏覽的總索引頁（我試過，那層目錄直接回 404），所以最實際的方法是從現行課程網站找「Previous offerings」那一區的連結——CS224n、CS224W、CS246 都把歷屆網址整排列在首頁上。

## 三條路線，各挑一條走

**如果你要轉職當軟體工程師**：CS106B → CS107 → CS161。三門就好。CS106B 給你資料結構，CS107 給你「程式在機器上到底怎麼跑」，CS161 給你面試時被問到演算法不會慌的底氣。CS103 可以之後補，先跳過不影響前三門。

**如果你已經在寫程式，但覺得自己少了一塊底**：CS111 加上 CS143 或 CS144 選一門。判斷方式是看你平常在 debug 什麼——如果常常在追效能與記憶體，選 CS143 讓你看懂編譯器對你的程式做了什麼；如果常常在追連線、逾時、重試，選 CS144，那七個檢查點會讓你對 TCP 的理解從「知道有這個東西」變成「自己寫過一個」。

**如果你的目標是 LLM**：CS229 或 CS224n 選一門打底，接著直接進 CS336。中間那些課可以先跳，但 CS336 的先修條件要老實面對——它要求的不是修過幾門課，是你能不能在沒有鷹架的情況下寫出大量 PyTorch。如果你對這一點沒把握，先把 CS231n 的作業做完，那份作業的鷹架密度剛好是 CS336 的相反面。

三條路線的共同前提只有一個：**選一條，做完它的作業**。把二十幾門課的講義都下載下來，是這份地圖最容易導致的失敗方式。

## 附錄：數字與查證方式

本文的課程資訊來自 2026-08-20 當天實際抓取的官方課程網站，不用印象補完。以下是正文為了可讀性而收在這裡的數字：

- **學分**：核心五門各五學分（且不接受降學分）；CS106L 一學分；CS146S 三學分。
- **付費修習的價格**：Stanford Online 的遠距學分版本，CS107 學費 8,110 美元、CS161 與 CS336 各 7,875 美元，都是五學分。教材免費、學分很貴，這個落差是這份地圖的前提。
- **CS231n 評分比重**：作業 45%、期中 20%、期末專案 35%。
- **CS336 講義 repo**：GitHub 上約 3.6k 顆星、757 個 fork（2026-08-20 讀數）。
- **課號慣例**：1–99 全校入門、100–199 本系大學部、200–299 高年級與研究所新生、300 以上研究生。官方明講這不是標準，只是常見慣例。

有一項確認不到：Stanford 課程封存區沒有公開的索引頁，因此無法列出「總共有幾門課保留了歷屆網站」。這是結構性的限制，不是查得不夠。

## 參考資料

- [Stanford CS BS Core Requirements](https://www-cs.stanford.edu/bs-core-requirements) — 核心五門的官方定義與五學分規定、CS111 前身為 CS110 的說明
- [Understanding the Course Catalog | Stanford Academic Advising](https://advising.stanford.edu/current-students/advising-student-handbook/course-catalog) — 課號慣例與「Stanford 沒有標準編號系統」的原文
- [Stanford Explore Courses: Course Catalog Numbering](https://explorecourses.stanford.edu/about) — 編號規則的第二個官方出處
- [CS106A: Programming Methodology](https://web.stanford.edu/class/cs106a/) — Summer 2026 講次與作業列表
- [CS106B: Programming Abstractions](https://web.stanford.edu/class/cs106b/) — Summer 2026 課程概述與講次索引
- [CS106B Fall 2025 封存版](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1256/) — 起始碼需填問卷解鎖的公告，也是封存網址格式的實例
- [CS106L: Standard C++ Programming](https://web.stanford.edu/class/cs106l/) — 一學分、七份作業、S/NC 的課程設計
- [CS103: Mathematical Foundations of Computing](https://web.stanford.edu/class/cs103/) — 課程概述與講次表
- [CS107: Computer Organization & Systems](https://web.stanford.edu/class/cs107/) — 作業、實驗與解答
- [CS109: Probability for Computer Scientists](https://web.stanford.edu/class/cs109/) — 每講附 LLM Learning Guide 的講次表
- [CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/) — 九份作業的完整列表
- [CS161: Design and Analysis of Algorithms (Winter 2026)](https://stanford-cs161.github.io/winter2026) — 官方課名與課程描述
- [CS143: Compilers](https://web.stanford.edu/class/cs143/) — 程式作業、筆記作業解答、歷屆考題與 Cool 語言手冊
- [CS144: Introduction to Computer Networking](https://cs144.github.io/) — 七個檢查點的實驗設計
- [CS149: Parallel Computing (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25) — 五份作業，以及「今年不對外散布錄影」的說明
- [CS221: Artificial Intelligence: Principles and Techniques](https://stanford-cs221.github.io/) — 歷屆課程網站索引
- [CS229: Machine Learning](https://cs229.stanford.edu/) — 課程描述與公開講義
- [CS229 講義 PDF](https://cs229.stanford.edu/main_notes.pdf) — 從線性迴歸到基礎模型的完整筆記
- [Stanford CS229 Spring 2026 Lecture 1 (YouTube)](https://www.youtube.com/watch?v=DATnpGoGhM8) — 2026 年春季版本的公開錄影
- [CS230: Deep Learning](https://cs230.stanford.edu/) — 翻轉教室形式與 Coursera 專項課程的關係
- [CS231n: Deep Learning for Computer Vision](https://cs231n.stanford.edu/) — Spring 2026 課程資訊與評分比重
- [CS231n 講義網站](https://cs231n.github.io/) — Spring 2026 作業內容
- [CS224n: NLP with Deep Learning](https://web.stanford.edu/class/cs224n/) — 歷屆課程網站與錄影索引
- [CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) — 歷屆封存網站列表
- [CS234: Reinforcement Learning (Winter 2026)](https://web.stanford.edu/class/cs234/) — 課程排程與作業
- [CS236: Deep Generative Models](https://deepgenerativemodels.github.io/) — 先修條件與自編講義說明
- [CS246: Mining Massive Data Sets](https://web.stanford.edu/class/cs246/) — 歷屆網站與 Colab 作業
- [CS330: Deep Multi-Task and Meta Learning](https://cs330.stanford.edu/) — 先修條件與錄影取得方式
- [CS336: Language Modeling from Scratch](https://cs336.stanford.edu) — Spring 2026 講次、作業與先修條件原文
- [CS336 講義 repo](https://github.com/stanford-cs336/lectures) — 可執行講義的格式與星數
- [CS25: Transformers United V6](https://web.stanford.edu/class/cs25/) — 2026 年春季講者與主題
- [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) — 學分數、先修條件與課程描述
- [Stanford Online: CS107](https://online.stanford.edu/courses/cs107-computer-organization-and-systems)、[CS161](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms)、[CS336](https://online.stanford.edu/courses/cs336-language-modeling-scratch) — 遠距學分版本的學費與開課時程
- 站內延伸：[2026 年該上哪些 AI 課程](/posts/ai/2026-07-10-ai-courses-2026-guide)、[CS146S 兩版大綱對照](/posts/ai/2026-08-16-cs146s-course-map)、[CS230 導讀系列第一篇](/posts/ai/2026-08-16-cs230-when-prompting-stops-working)
