---
title: "跨週整理（二）：十二個專案各用到哪一段講課｜Harvard CS50 AI 主題單元"
date: 2026-08-30
category: tech
type: deep-dive
tags: [harvard-cs50ai, cs50, ai, projects, python]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 9
tldr: "把十二個專案放在一起看：每個專案要寫哪些函式、用到哪一節講課、規格頁給了什麼可以對答案的例子；哪些專案用的是同一種做法（列舉、搜尋、馬可夫鏈、從資料學）、哪些專案要用的東西講課沒有教。附三個算到底的例子與五題自我檢查。官方沒有標難度與時數，本文也不給。"
description: "Harvard CS50 AI 系列的跨週整理第二篇：十二個專案（Degrees、Tic-Tac-Toe、Knights、Minesweeper、Heredity、PageRank、Crossword、Shopping、Nim、Traffic、Parser、Attention）的對照。每個專案要實作的函式與規格頁的檢查點依官方規格與 distribution code，用到的講課小節連到各週導讀；專案之間的分類是本站的歸納。三個例子（Heredity 要算幾次聯合機率、Shopping 為什麼不看準確率、PageRank 的轉移模型）算到底，另有五題附答案的自我檢查，其中三題橫跨兩週以上。這一篇是本站的整理，不是課程某一週的講課。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en)

**影片狀態：僅附官方入口或錄影清單。** 這一篇是本站的跨週整理，不是課程某一週的講課，官方沒有對應的影片；各週的講課錄影沒有介紹專案，專案的規格與實作在各週導讀的後半。[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：專案規格、distribution code、check50 slug 均以 2026 年課程官網為準；第 6 週的專案是 Parser 與 Attention。

## TL;DR

十二個專案都不是從空白檔案寫起：官方給 distribution code，你補上規格指定的函式。這一篇把它們放在一起，回答三個問題：

- 每個專案要寫什麼、用到哪一節講課、規格頁給了什麼可以對答案的例子（下面的對照表）。
- 哪些專案其實是同一種做法（本站的歸納）。
- 哪些專案要用的東西講課沒有教，要從規格頁學。

怎麼分辨這篇裡的兩種內容：「要寫的函式」與「規格頁的檢查點」是官方規格寫的；「用到的講課小節」連到各週導讀；標明「本站的歸納」「本站自擬」的是本站把專案放在一起看之後整理的。各專案的 distribution code、參考實作與實跑結果在各週導讀，這裡不重貼。

官方的規格頁沒有標難度，也沒有說每個專案要花多久；本系列沒有實測一個初學者要多久，所以這一篇不分難度、不估時數。

## 十二個專案對照表

| 專案 | 要寫的部分 | 用到的講課小節 | 規格頁給的檢查點 |
|---|---|---|---|
| [Degrees](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#專案-0adegrees--bfs-找演員六度人脈) | `shortest_path` | [節點、frontier 與通用搜尋流程](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#節點frontier-與通用搜尋流程)、[DFS 與 BFS](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#dfs-與-bfs差別只在從-frontier-拿哪一個) | 範例輸出：Emma Watson 到 Jennifer Lawrence 是 3 度 |
| [Tic-Tac-Toe](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#專案-0btic-tac-toe--minimax-最佳策略) | 七個函式，最後是 `minimax`；Alpha-Beta 剪枝是選做 | [Minimax](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#對弈搜尋minimax)、[Alpha-Beta 剪枝](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#alpha-beta-剪枝) | 雙方都下得最好時是平手，所以你應該贏不了自己寫的 AI |
| [Knights](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#專案-1aknights--邏輯謎題求解器) | 四個謎題的知識庫 | [命題邏輯](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#命題邏輯符號與五個連結詞)、[model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#model-checking把所有可能的世界列出來)、[知識工程](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#知識工程把-clue-寫成命題邏輯) | 這一題要 100% 正確才算通過，其他專案是 70% |
| [Minesweeper](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#專案-1bminesweeper--踩地雷-ai) | `Sentence` 的四個方法、`MinesweeperAI` 的三個方法 | [從已知事實推出新事實](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#從已知事實推出新事實)（句子的形式是專案自訂的） | 規格提醒 AI 不會每次都贏：資訊不夠時只能用猜的 |
| [Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2aheredity--用貝氏網路推斷基因與性狀) | `joint_probability`、`update`、`normalize` | [貝氏網路](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#貝氏網路用箭頭表示誰影響誰)、[推論](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#推論從證據算出其他變數的分佈)、[聯合機率與正規化](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#聯合機率正規化與四條規則) | 一個聯合機率的例子（0.0026643247488）與 `family0.csv` 的完整預期輸出 |
| [PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2bpagerank--取樣與迭代兩種演算法) | `transition_model`、`sample_pagerank`、`iterate_pagerank` | [馬可夫鏈](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#馬可夫鏈隨時間變化的狀態) | `transition_model` 的例子（0.05、0.475、0.475）；回傳的值加總要是 1 |
| [Crossword](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#專案-3crossword--csp-生成填字遊戲) | `generate.py` 的八個函式 | [約束滿足問題](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#約束滿足問題變數domain-與約束)、[AC-3](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#node-consistencyarc-consistency-與-ac-3)、[回溯搜尋](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#把-csp-當搜尋問題回溯搜尋)、[heuristic](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#選變數與排值的-heuristicmrvdegreeleast-constraining-value) | 執行指令與輸出圖檔的方式；提示可以先不寫 heuristic |
| [Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4ashopping--k-nn-預測購買意願) | `load_data`、`train_model`、`evaluate` | [最近鄰](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#監督式學習分類與最近鄰)、[scikit-learn 實測](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#用-scikit-learn-實測紙鈔真偽資料) | 第一列 evidence 的 17 個值；範例輸出 41.02% 與 90.55% |
| [Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4bnim--q-learning-學會玩遊戲) | `NimAI` 的四個方法 | [Q-learning 與 ε-greedy](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#q-learning-與-ε-greedy)、[Nim 的示範](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#讓-ai-自己學會玩-nim以及-function-approximation) | Q-learning 的更新式與三種 reward（−1、1、0） |
| [Traffic](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#專案-5traffic--cnn-訓練分類交通號誌) | `load_data`、`get_model`，另交 `README.md` | [卷積](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#影像當輸入卷積與-kernel)、[pooling 與 CNN](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#pooling-與卷積神經網路的結構)、[`handwriting.py`](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#handwritingpy用-cnn-辨識手寫數字) | 沒有訂 accuracy 門檻；規格頁的範例輸出是 0.9535 |
| [Parser](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6aparser--用-cfg-剖析句子並抽出名詞片語) | `NONTERMINALS` 文法、`preprocess`、`np_chunk` | [context-free grammar](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#把語法寫成規則context-free-grammar) | 提示裡三個該接受的句子與兩個不該接受的句子 |
| [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6battention--用-bert-預測被遮住的詞並畫出每個-attention-head) | `mask.py` 的三個函式，另寫 `analysis.md` | [attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#attention讓-decoder-自己決定看輸入的哪裡)、[self-attention 與 multi-headed attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#transformer-的-encoder平行處理positional-encoding-與-self-attention) | 開頭兩個示範句各三個預測；0.25 的顏色可以是 63 或 64 |

「規格頁給的檢查點」只列規格頁上寫明的例子或要求。check50 實際測哪些項目，本系列沒有跑 check50（它要用 GitHub 帳號登入），不列。

## 專案之間的關係

這一節的分類是本站的歸納，課程沒有這樣分。每一類後面說明分在一起的理由，理由本身查得到出處。

**把所有可能走一遍：Knights、Heredity。** Knights 把謎題寫成知識庫後，交給 `logic.py` 的 `model_check`，它列舉所有命題符號的真假組合。Heredity 官方的 `main` 把「誰有性狀、誰有一份基因、誰有兩份基因」的所有組合走一遍，你寫的 `joint_probability` 算每一個組合的機率。兩個專案你都不用寫列舉本身，你寫的是「一種情況要怎麼描述或怎麼算」。講課對這種做法的評語是算得對但會隨變數變多而變慢（[model checking 的極限](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#邏輯謎題mastermind-與-model-checking-的極限)、[推論](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#推論從證據算出其他變數的分佈)）；兩個專案的規模都小到列舉得完。

**在一棵樹或一張圖上找：Degrees、Tic-Tac-Toe、Crossword。** Degrees 用 BFS 在演員與電影構成的圖上找最短路徑；Tic-Tac-Toe 用 Minimax 走完整棵對局樹；Crossword 用回溯搜尋一個變數一個變數指派。三個都是第 0 週搜尋框架的應用，第 3 週講者把 CSP 套進搜尋問題的格式時說明了這一點（[把 CSP 當搜尋問題](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#把-csp-當搜尋問題回溯搜尋)）。

**同一條馬可夫鏈的兩種做法：PageRank。** 規格把隨機點連結的瀏覽者描述成馬可夫鏈。`sample_pagerank` 照轉移模型一步一步抽樣，是講課教過的做法；`iterate_pagerank` 用的迭代公式講課沒有教，寫在規格頁。

**從資料或經驗學：Shopping、Nim、Traffic。** Shopping 與 Traffic 是監督式學習，資料有標籤；Nim 是強化學習，AI 靠自我對弈的輸贏學。Shopping 與 Traffic 官方的 `main` 都用 `train_test_split` 留 40% 當測試集。

**手寫規則：Knights、Parser。** 兩個專案都是把人的知識寫成形式化的規則，再交給現成的程式去推：Knights 交給 `model_check`，Parser 交給 NLTK 的 `ChartParser`。第 6 週講者說手寫語法規則寫不完，所以後面改用統計；Parser 讓你親手碰到這個限制，規格要你的文法能剖析十個句子，又不能鬆到接受「Holmes sat in the the armchair.」。

**用訓練好的模型：Attention。** 十二個專案裡只有它用的是別人訓練好的模型：載入預訓練的 BERT，觀察它的輸出與 attention。BERT 這個模型講課沒有提到，規格頁有介紹。

**專案和講課的示範程式。** 有九個專案可以直接對照講課示範過的程式或講課的定義，這是讀規格與各週導讀整理出來的：

| 專案 | 講課的示範程式 | 關係 |
|---|---|---|
| Degrees | `maze.py` | 專案的 `util.py` 就是講課的 `Node`、`StackFrontier`、`QueueFrontier`（規格頁寫明） |
| Tic-Tac-Toe | 講課用井字遊戲定義 Minimax | 講課定義的 player、actions、result、terminal、utility，和專案要寫的函式同名 |
| Knights | `logic.py` | 專案附的 `logic.py` 與講課那一份幾乎相同 |
| PageRank | `chain/model.py` | 講課從天氣的馬可夫鏈抽 50 個狀態；`sample_pagerank` 是同一件事 |
| Crossword | `schedule0.py` | 講課用它示範回溯搜尋 |
| Shopping | 紙鈔真偽的 scikit-learn 示範 | 講課用同一個 `KNeighborsClassifier` |
| Nim | 講者自己寫的 Nim AI | 同樣自我對弈 10,000 局、開局 1、3、5、7 |
| Traffic | `handwriting.py` | 規格的提示說講課原始碼會有幫助；官方 `main` 的流程和它幾乎相同 |
| Parser | `cfg0.py`、`cfg1.py` | 規格的提示說講課的規則刻意寫得很簡化，要你自己改 |

**講課沒有教、要從規格頁學的東西。** 下面幾項本系列在講課字幕裡找不到，各週導讀的專案節依規格頁說明：

- Minesweeper 的句子形式（一組格子加地雷數）與子集推論。
- Heredity 的遺傳規則與突變機率。
- PageRank 的迭代公式與 damping factor。
- Shopping 的 sensitivity 與 specificity。
- Attention 的 BERT 與 masked language model。

## 例子一：Heredity 要算幾次聯合機率

官方 `main` 的迴圈結構取自 `heredity.py`，資料是官方的 `family0.csv`；次數是本站算的。

**條件。** `family0.csv` 有三個人：Harry、James、Lily。已知 James 有性狀、Lily 沒有、Harry 未知。`main` 的迴圈是：

1. 對「誰有性狀」的每一種組合（三個人的所有子集），與已知性狀矛盾的跳過。
2. 對「誰有一份基因」的每一種組合。
3. 對「剩下的人裡誰有兩份基因」的每一種組合，呼叫一次 `joint_probability`。

**計算。** 第 1 層：James 一定在、Lily 一定不在，只有 Harry 可在可不在，留下 2 種。第 2、3 層合起來，等於每個人各自選 0、1 或 2 份基因，3 × 3 × 3 = 27 種。所以一共呼叫 2 × 27 = 54 次。

如果三個人的性狀都未知，第 1 層是 2 × 2 × 2 = 8 種，一共 8 × 27 = 216 次。

**結果的意思。** 每多一個人，基因的組合乘以 3，性狀未知的話再乘以 2。三個人是 216，十個人、性狀都未知就是 6 的 10 次方，約六千萬。這就是第 2 週講課說列舉推論「精確但慢」的實際樣子；專案的家族很小，所以列舉得完。已知的證據會減少要算的組合：`family0.csv` 知道兩個人的性狀，次數從 216 降到 54。

## 例子二：Shopping 為什麼不看準確率

資料筆數取自第 4 週導讀對 `shopping.csv` 的實測；「永遠猜不買」的分類器是規格頁舉的例子，下面用實際筆數把它算出來。

**條件。** `shopping.csv` 有 12,330 列，其中 1,908 列最後有購買，10,422 列沒有。假設有一個分類器不看任何資料，永遠回答「不買」。

**計算。**

```text
準確率      = 猜對的 ÷ 全部       = 10,422 ÷ 12,330 ≈ 84.5%
sensitivity = 有買的裡面猜對的比例 = 0 ÷ 1,908       = 0
specificity = 沒買的裡面猜對的比例 = 10,422 ÷ 10,422 = 1
```

**結果的意思。** 84.5% 的準確率看起來不差，但這個分類器一個會買的人都認不出來。把準確率拆成 sensitivity 與 specificity 兩個數字，這件事才看得到。第 4 週導讀把參考實作（k = 1 的最近鄰）放進官方檔案實跑過，兩個數字都不是 0 也不是 1：它確實認得出一部分會買的人，代價是把一些不會買的人猜錯。實跑的次數與數字範圍見[第 4 週導讀的 Shopping 一節](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4ashopping--k-nn-預測購買意願)，這裡不重抄。

## 例子三：PageRank 的轉移模型

Corpus 是官方的 `corpus0`，公式依規格頁；這一頁的數字是本站算的。

**條件。** `corpus0` 有四頁：`1.html` 連到 `2.html`；`2.html` 連到 `1.html` 與 `3.html`；`3.html` 連到 `2.html` 與 `4.html`；`4.html` 連到 `2.html`。Damping factor `d` 是 0.85。瀏覽者現在在 `2.html`，下一步到每一頁的機率是多少？

**計算。** 規格的規則：以機率 `d` 從目前頁面的連結裡隨機選一個，以機率 `1 − d` 從所有頁面裡隨機選一個。

- 每一頁先分到 (1 − 0.85) ÷ 4 = 0.0375。
- `2.html` 有兩個連結，各再分到 0.85 ÷ 2 = 0.425。

所以 `1.html` 與 `3.html` 各是 0.0375 + 0.425 = 0.4625，`2.html` 與 `4.html` 各是 0.0375。四個加起來：0.4625 × 2 + 0.0375 × 2 = 1。

**結果的意思。** 這一列就是第 2 週轉移模型表裡「今天在 `2.html`」的那一列，只是狀態從兩種天氣變成四個網頁。`transition_model` 對每一頁各算出一列，合起來就是整張表；`sample_pagerank` 做的事和講課從天氣的馬可夫鏈抽 50 個狀態一樣，只是抽 10,000 個，再數每一頁出現的比例。

## 自我檢查

五題都是本站自擬的；第一、四、五題要用到不只一週的內容。

**自我檢查｜先寫下答案，再展開。** Knights 的 Puzzle 3 用到六個命題符號（A、B、C 各有「是 Knight」「是 Knave」兩個）。`model_check` 最多要檢查幾種真假組合？Heredity 的 `family0.csv` 要算 54 次聯合機率。這兩個專案為什麼都不用擔心講課說的「列舉太慢」？

<details>
<summary>答案</summary>

2 的 6 次方，64 種。

兩個專案的規模都很小：64 種組合與 54 次計算，電腦一下子就算完。講課說的問題出在變數變多的時候：命題符號每多一個，組合數乘以 2；Heredity 每多一個性狀未知的人，次數乘以 6。專案選的規模讓你可以先把「一種情況怎麼描述、怎麼算」寫對，不必處理效率。

對應的小節：[model checking](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#model-checking把所有可能的世界列出來)、[model checking 的極限](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#邏輯謎題mastermind-與-model-checking-的極限)、[專案 Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2aheredity--用貝氏網路推斷基因與性狀)

</details>

**自我檢查｜先寫下答案，再展開。** 沿用例子三的 `corpus0` 與 `d` = 0.85，瀏覽者現在在 `1.html`（只連到 `2.html`）。下一步到四頁的機率各是多少？

<details>
<summary>答案</summary>

每一頁先分到 0.15 ÷ 4 = 0.0375。`1.html` 只有一個連結，0.85 全部給 `2.html`。所以 `2.html` 是 0.0375 + 0.85 = 0.8875，其餘三頁各是 0.0375。加起來 0.8875 + 0.0375 × 3 = 1。

對應的小節：[馬可夫鏈](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#馬可夫鏈隨時間變化的狀態)、[專案 PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#專案-2bpagerank--取樣與迭代兩種演算法)

</details>

**自我檢查｜先寫下答案，再展開。** 一個分類器在例子二的資料上，把 1,908 個有買的人認出 800 個，把 10,422 個沒買的人猜對 9,422 個。它的準確率、sensitivity、specificity 各是多少？和「永遠猜不買」比，哪一個數字變差了？

<details>
<summary>答案</summary>

準確率 = (800 + 9,422) ÷ 12,330 = 10,222 ÷ 12,330 ≈ 82.9%。Sensitivity = 800 ÷ 1,908 ≈ 41.9%。Specificity = 9,422 ÷ 10,422 ≈ 90.4%。

準確率從 84.5% 降到 82.9%，specificity 從 1 降到 0.904，但 sensitivity 從 0 升到 0.419。只看準確率會以為它比「永遠猜不買」差，其實它是兩個裡面唯一有用的。

對應的小節：[專案 Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4ashopping--k-nn-預測購買意願)

</details>

**自我檢查｜先寫下答案，再展開。** 十二個專案裡，哪些要用的做法在講課錄影裡有示範程式或講課的定義可以對照？挑一個說出對照的是哪一支程式，或講課定義的是什麼。哪一個專案用到的模型講課完全沒有提到？

<details>
<summary>答案</summary>

本文整理出九個：Degrees（`maze.py` 的 frontier 類別）、Tic-Tac-Toe（講課用井字遊戲定義的 player、actions、result、terminal、utility）、Knights（`logic.py`）、PageRank（`chain/model.py`）、Crossword（`schedule0.py`）、Shopping（紙鈔的 scikit-learn 示範）、Nim（講者的 Nim AI）、Traffic（`handwriting.py`）、Parser（`cfg0.py`、`cfg1.py`）。答出其中任何一個，並說得出程式名稱或講課的定義（Tic-Tac-Toe 對照的是定義，不是程式）就算對。

Attention 用的 BERT 講課沒有提到。講課教了 attention 與 Transformer 的架構，BERT 是規格頁介紹的。

對應的小節：[迷宮程式](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#迷宮程式換一個類別就從-dfs-變成-bfs)、[`handwriting.py`](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#handwritingpy用-cnn-辨識手寫數字)、[專案 Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#專案-6battention--用-bert-預測被遮住的詞並畫出每個-attention-head)

</details>

**自我檢查｜先寫下答案，再展開。** Nim 只剩一堆、裡面有 2 個，輪到你（拿走最後一個的人輸）。先用第 0 週 Minimax 的想法：把「你贏」記成 1、「你輸」記成 −1，兩個動作的值各是多少，該選哪一個？再看第 4 週：Nim 專案用 Q-learning 訓練 10,000 局後，第 4 週導讀實跑查到這個 state 兩個動作的 Q 值是 1.0 與貼近 −1。兩種做法選的動作一樣嗎？它們各需要什麼？

<details>
<summary>答案</summary>

照 Minimax 來算：拿 1 個之後剩 1 個，對手只有一個動作，就是拿走最後一個，對手輸，所以這個動作的值是 1。拿 2 個是你自己拿了最後一個，值是 −1。取最大值，選拿 1 個。

Q-learning 學到的 Q 值是 1.0 與貼近 −1，選 Q 值最高的動作，也是拿 1 個。兩種做法選的一樣。

差別在需要的東西。Minimax 要知道規則，並且把後面的走法走到終局，不需要任何對局經驗；Tic-Tac-Toe 專案用的是這一種。Q-learning 不往後搜尋，靠很多局的 reward 一次一次修正估計值，局數不夠時估計會不準；Nim 專案用的是這一種。把兩個專案這樣對照是本站做的，講課沒有拿 Minimax 來解 Nim。

對應的小節：[Minimax](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#對弈搜尋minimax)、[讓 AI 自己學會玩 Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#讓-ai-自己學會玩-nim以及-function-approximation)、[專案 Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#專案-4bnim--q-learning-學會玩遊戲)

</details>

## 各專案最容易出錯的地方

下表整理自各週導讀的專案節：有的是規格明文的要求，有的是把程式放進官方檔案實跑時遇到的錯誤。細節與可執行的寫法在各週導讀。

| 專案 | 現象 | 原因 |
|---|---|---|
| Degrees | 回傳格式不對 | 規格要的是一串 `(movie_id, person_id)`；沒有路徑時回傳 `None` |
| Tic-Tac-Toe | 棋盤在計算途中被改掉 | `result` 直接改了傳進來的 board。規格要求不能改原 board，建議先做 deep copy |
| Knights | Puzzle 3 推不出任何人的身分 | 沒有把「A 說了哪一句」本身寫成句子 |
| Minesweeper | `add_knowledge` 的迴圈不結束 | 自己重寫 `Sentence` 時漏了 `__eq__`，同一個句子被一再加進知識庫 |
| Minesweeper | 把安全格標成地雷 | 建立新句子時，已知的地雷沒有從 `count` 扣掉 |
| Heredity | 數字和規格頁對不上 | 沒有父母的人要用無條件機率，有父母的人要用傳遞機率（0.99、0.5、0.01） |
| PageRank | 所有頁面加總不是 1 | 沒有連結的頁面要當成連到所有頁面；取樣的第一個樣本也算一個 |
| Crossword | 放進官方檔案就出錯 | `overlaps` 的鍵是一對變數；`neighbors` 是方法，要呼叫 |
| Shopping | `main` 呼叫 `predict` 時出錯 | `train_model` 要回傳模型本身 |
| Nim | 存取 `self.q` 時出錯 | State 是 list，要先轉成 tuple。規則是拿走最後一個的人輸 |
| Traffic | Accuracy 停在 0.055 上下 | 像素值沒有縮放到 0–1；第 5 週導讀拿掉縮放的 13 次執行裡有 5 次這樣 |
| Parser | 接受了不該接受的句子 | 文法寫得太鬆，例如讓限定詞可以連續出現 |
| Attention | 匯入 `TFBertForMaskedLM` 失敗 | 套件版本太新。第 6 週導讀 2026-10-13 實測能跑的組合是 transformers 4.44.2、tensorflow 2.21.0、tf-keras 2.21.0 |

做的順序照週次。能確定會影響排程的事只有這幾件：第 3 週只有 Crossword 一個專案，要寫八個函式；Traffic 的資料集要另外下載；Attention 第一次執行會下載模型；規格頁註明這門課最高支援到 Python 3.12。

## 系列連結

- [課程總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide)
- [第 0 週 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)
- [第 1 週 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge)
- [第 2 週 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)
- [第 3 週 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization)
- [第 4 週 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning)
- [第 5 週 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks)
- [第 6 週 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language)
- [跨週整理一：想法怎麼銜接與取代](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1)
- **跨週整理二：十二個專案各用到哪一段講課（本文）**
- [課程回顧與後續路線](/posts/tech/2026-08-30-harvard-cs50ai-wrapup)

## 課程影片來源

這一篇是本站寫的跨週整理，沒有對應的那一週，不嵌影片。七週的講課錄影都沒有介紹該週的專案作業（第 4 週示範過 Nim，但沒有提到作業），本篇的專案內容來自課程官網的規格頁與官方發佈的程式檔。官方 CS50 YouTube 播放清單（8 支：導論加第 0–6 週講課）已於 2026-10-10 即時核對。

課程與錄影入口：

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方播放清單，沒有對應本篇的單一講次錄影，狀態維持僅附官方入口。
- 2026-10-13：第 6 週的專案改為與現行課程一致：第十二個專案是 Attention（原寫 2020 年版的 Questions），Parser 的說明改成官方實際要求的 CFG 文法、`preprocess` 與 `np_chunk`（原寫 CYK 與句子生成）。
- 2026-10-13：依官方 distribution code、規格頁與重寫後的各週導讀整篇重寫，角色改為跨週整理。拿掉沒有依據的內容：每個專案的預估行數、星號難度分級、預估時數與「總計 60–100 小時」、「check50 關鍵驗收點」一欄（本系列沒有跑 check50）、技能遷移地圖。改掉錯的專案描述：Heredity 是列舉所有組合再正規化（原寫概似加權取樣）；Shopping 沒有 `StandardScaler`（原寫「必須用」）；Nim 沒有折扣參數（原寫 γ=1）；Crossword 的 `add_constraints`、`forward_check`、`count_conflicts` 與 `structure3.txt` 官方檔案裡都沒有；Traffic 的 `load_data` 要自己寫，規格沒有 accuracy 門檻（原寫 check50 載入 `traffic_model.h5`、門檻約 95%）；Tic-Tac-Toe 的 Alpha-Beta 剪枝是選做。新內容：每個專案連到用到的講課小節、專案之間的六種關係與九個可對照的講課示範、三個算到底的例子、五題附答案的自我檢查。標題的範圍標示由「課程總覽」改為「主題單元」，主題改成這篇實際做的事。用語：「Week N」改「第 N 週」，「算法」改「演算法」，「播放列表」改「播放清單」。
- 2026-10-13：依獨立審稿修正：例子二不再抄第 4 週導讀的實跑次數與範圍，改成連過去；可對照講課示範的專案補上 Tic-Tac-Toe 與 PageRank，共九個；Attention 的檢查點是兩個示範句；「只有它不訓練也不推理」改為「只有它用別人訓練好的模型」；PageRank 一列拿掉連到貝氏網路取樣的連結；check50 的帳號說法統一為 GitHub 帳號；tags 拿掉 difficulty 與 portfolio。
- 2026-10-14：依複審修正：自我檢查第四題的題幹與判準改成涵蓋「講課的定義」，Tic-Tac-Toe 對照的是定義，不是程式。tags 再拿掉 comparison。

## 參考資料

- [CS50 AI Projects 總覽](https://cs50.harvard.edu/ai/projects/) — 十二個專案規格頁的入口；各專案規格頁的連結在各週導讀的參考資料
- [Knights 專案規格](https://cs50.harvard.edu/ai/projects/1/knights/) — 100% 才算通過的例外
- [CS50 Certificate 說明](https://cs50.harvard.edu/ai/certificate/) — 每個專案 70% 以上的條件
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- 站內：[Harvard CS50 AI 課程總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
