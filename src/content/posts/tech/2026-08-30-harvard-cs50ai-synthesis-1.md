---
title: "跨週整理（一）：七週的想法怎麼互相銜接與取代｜Harvard CS50 AI 主題單元"
date: 2026-08-30
category: tech
type: deep-dive
tags: [harvard-cs50ai, cs50, ai, synthesis]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 8
tldr: "把七週放在一起看的三種關係：同一個想法在後面的週再出現（馬可夫鏈從第 2 週用到第 4、第 6 週，權重的線性組合從第 4 週變成第 5 週的 unit）；前一週的工具是後一週的前提；講課先教一個做法、指出它不夠用、再換下一個。附三個跨週例子與四題跨週自我檢查。"
description: "Harvard CS50 AI 系列的跨週整理第一篇：不重講各週內容，只整理週與週之間的關係。哪些想法重複出現、哪一週是哪一週的前提、講課自己換掉了哪些做法，每一條都連到對應那一週導讀的小節。三個跨週例子（馬可夫鏈的三種用法、用第 4 週的學習規則訓練第 5 週的 unit、貝氏法則到 Naive Bayes）都算到底，另有四題附答案的跨週自我檢查。這一篇是本站的整理，不是課程某一週的講課。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en)

**影片狀態：僅附官方入口或錄影清單。** 這一篇是本站的跨週整理，不是課程某一週的講課，官方沒有對應的影片；各週的講課錄影與時間連結在各週導讀。[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本系列的講課錄影，第 0–5 週片名標示 **2020**，第 6 週片名標示 **2023**；專案規格以 2026 年課程官網為準。

## TL;DR

七週各自的內容在各週導讀裡，這一篇只講週與週之間的關係，分三種：

- **同一個想法再出現**：第 2 週的馬可夫鏈，第 4 週加上 action 與 reward 變成 Markov decision process，第 6 週拿來產生文字。
- **前一週是後一週的前提**：沒有第 4 週「輸入乘權重、過門檻」的分類器，第 5 週的 unit 就沒有東西可接。
- **做法互相取代**：講課常常先教一個做法，指出它在哪裡不夠用，再教下一個。

怎麼分辨這篇裡的兩種內容：寫「講課」「講者」並附連結的，是課程講的，點連結可以到那一週導讀的對應小節，那裡有錄影的時間連結。寫「本站的歸納」「本站自擬」的，是本站把幾週放在一起看之後整理或編出來的，課程沒有這樣講。

## 同一個想法在不同週再出現

下面每一條，都是後面那一週用到前面那一週教過的東西。週次的對應是本站依各週導讀整理的；講者當場說明「這是之前講過的」的地方，連過去的那一節會寫明。

**搜尋問題的格式（第 0 週 → 第 3 週）。** 第 0 週把問題寫成 initial state、actions、transition model、goal test、path cost 五樣東西（[搜尋問題怎麼定義](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#搜尋問題怎麼定義)）。第 3 週講約束滿足問題時，講者先把它套進同一個格式：initial state 是空的指派，action 是加一組「變數 = 值」，goal test 是所有變數都指派了而且約束都滿足（[把 CSP 當搜尋問題](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#把-csp-當搜尋問題回溯搜尋)）。同一週前面講局部搜尋時，也是拿第 0 週的 BFS 與 A\* 來對照：那些演算法同時維護很多條路徑，局部搜尋只記一個 state（[最佳化與局部搜尋](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#最佳化與局部搜尋只在乎答案不在乎路徑)）。

**曼哈頓距離（第 0 週 → 第 3 週）。** 第 0 週把它當走迷宮的啟發式（[greedy best-first search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#有資訊搜尋greedy-best-first-search)），第 3 週拿它算房子到醫院的距離，加起來當成本（[最佳化與局部搜尋](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#最佳化與局部搜尋只在乎答案不在乎路徑)）。

**馬可夫鏈（第 2 週 → 第 4 週 → 第 6 週）。** 第 2 週用轉移模型描述天氣一天一天怎麼變（[馬可夫鏈](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#馬可夫鏈隨時間變化的狀態)）。第 4 週的 Markov decision process 從它講起，加上 agent 可以選的 action 與每次轉移附帶的 reward（[強化學習與 Markov decision process](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#強化學習與-markov-decision-process)）。第 6 週用它產生文字：知道哪些詞常跟在哪些詞後面，就能一個詞接一個詞預測下去（[n-gram、斷詞與 Markov chain](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#改用統計n-gram斷詞與-markov-chain)）。

**貝氏法則（第 2 週 → 第 6 週）。** 第 2 週推出 `P(b | a) = P(a | b) P(b) / P(a)`（[貝氏法則](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#貝氏法則把條件機率反過來)），第 6 週的 Naive Bayes 分類器用它從「正面評論裡這個詞出現的比例」反推「出現這些詞的評論是正面的機率」（[bag-of-words 與 Naive Bayes](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#文字分類bag-of-words-與-naive-bayes)）。

**輸入乘權重（第 4 週 → 第 5 週）。** 第 4 週的分類器是 `w₀ + w₁x₁ + w₂x₂ ≥ 0`（[用一條線分類](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#用一條線分類權重perceptron-learning-rule-與兩種門檻)）。第 5 週一開始就接回這條式子，把它畫成一個 unit：輸入乘上權重、加 bias、過 activation function（[一個 unit 在算什麼](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#一個-unit-在算什麼)）。

**Loss（第 4 週 → 第 5 週）。** 第 4 週定義損失函數來替一個假說打分數（[迴歸與損失函數](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#迴歸與損失函數怎麼替一個假說打分數)），第 5 週的梯度下降要降低的就是這個數字（[梯度下降](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#梯度下降讓電腦自己找權重)）。

**Overfitting（第 4 週 → 第 5 週）。** 第 4 週用 regularization 與 cross-validation 對付它（[overfitting、regularization 與 cross-validation](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#overfittingregularization-與-cross-validation)），第 5 週在神經網路上換成 dropout（[隱藏層、backpropagation 與 dropout](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#隱藏層backpropagation-與-dropout)）。

**RNN（第 5 週 → 第 6 週）。** 第 5 週結尾介紹會把輸出餵回自己的網路（[recurrent neural network](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#feed-forward-的限制與-recurrent-neural-network)），第 6 週的 encoder–decoder 直接用它處理整個句子（[RNN 的 encoder–decoder](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#序列進序列出rnn-的-encoderdecoder)）。

## 哪一週是哪一週的前提

上一節的每一條都是一個先後關係。把它們排成表，可以看出哪幾週不能跳：

| 後面這一週的內容 | 要先讀過 |
|---|---|
| 第 3 週：回溯搜尋 | 第 0 週：搜尋問題的五樣東西 |
| 第 4 週：Markov decision process | 第 2 週：馬可夫鏈與轉移模型 |
| 第 5 週：unit、梯度下降 | 第 4 週：權重、損失函數 |
| 第 6 週：n-gram 產生文字、Naive Bayes | 第 2 週：馬可夫鏈、貝氏法則 |
| 第 6 週：encoder–decoder、attention | 第 5 週：神經網路與 RNN |

第 1 週（邏輯）是七週裡後面最少直接引用的一週，這是本站的歸納：上表沒有任何一列以它為前提。講者後來點名回頭提到它的地方，本系列找到一處：第 5 週用一個 unit 算 OR 時，說這是命題邏輯裡看過的 or（[一個 unit 在算什麼](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#一個-unit-在算什麼)）。第 3 週講 maintaining arc consistency 時，講者說要回到推論（inference）的想法（[搜尋與推論交錯](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#搜尋與推論交錯maintaining-arc-consistency)），但沒有點名是第 1 週；把它對到第 1 週是本站的推測。它和第 2 週的關係比較像對照，同樣是「從已知推出未知」，第 1 週處理確定的事實，第 2 週處理只有幾成把握的事。

## 講課自己換掉的做法

這門課的講法常常是先教一個做法，指出限制，再換下一個。下表每一列的限制都是講課自己說的。第三欄的連結指向接著教的那一節；限制是在更前面一節說的那四列，第二欄另外附了連到那一節的連結。

| 先教的做法 | 講課指出的限制 | 接著教的 |
|---|---|---|
| Minimax 搜尋整棵樹 | 西洋棋這種遊戲算不到終局 | [Depth-limited Minimax 加 evaluation function](/posts/tech/2026-08-27-harvard-cs50ai-w00-search#樹太大的時候depth-limited-minimax) |
| Model checking | 要列舉全部 2 的 n 次方種真假組合（[說在這一節](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#邏輯謎題mastermind-與-model-checking-的極限)） | [推論規則](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#推論規則不列舉世界直接改寫句子)與 [resolution](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#resolution子句與-cnf) |
| 列舉推論 | 算得精確但慢 | [拒絕取樣、概似加權](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#近似推論取樣拒絕取樣與概似加權) |
| Hill climbing | 會卡在局部極值（[說在這一節](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#hill-climbing一直往更好的鄰居走)） | [Random restart](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#hill-climbing-的變形與-hospitalspy-實測)、[模擬退火](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#模擬退火與旅行推銷員問題) |
| 只檢查有沒有違反約束的回溯搜尋 | 會走進不必走的死路 | [Maintaining arc consistency](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization#搜尋與推論交錯maintaining-arc-consistency) |
| 替每個 state 與 action 記一個 Q 值 | State 太多時記不完 | [Function approximation](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#讓-ai-自己學會玩-nim以及-function-approximation) |
| 單一 perceptron | 只能學線性可分的邊界（[說在這一節](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#多個輸出以及一個-unit-的極限)） | [隱藏層與 backpropagation](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#隱藏層backpropagation-與-dropout) |
| 手寫 context-free grammar | 規則寫不完（[說在這一節](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#把語法寫成規則context-free-grammar)） | [從大量文字統計](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#改用統計n-gram斷詞與-markov-chain) |
| One-hot 表示詞 | 向量很長，而且意思相近的詞向量並不相近 | [word2vec](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#把詞變成向量one-hot分散式表示與-word2vec) |
| RNN 的 encoder–decoder | 整個輸入壓進一份 hidden state | [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#attention讓-decoder-自己決定看輸入的哪裡) |
| RNN | 必須逐字依序計算，難以平行 | [Transformer](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#transformer-的-encoder平行處理positional-encoding-與-self-attention) |

把這張表從上往下讀，有一個模式重複了三次，這是本站的歸納：**算不完的時候改用估計**。第 0 週用 evaluation function 估計還沒結束的盤面，第 2 週用取樣估計算不完的機率，第 4 週用 function approximation 估計記不完的 Q 值。三個裡面，講者自己點明關聯的只有一處：他講 function approximation 時拿 depth-limited Minimax 來比。

## 跨週例子一：一條馬可夫鏈的三種用法

這個例子的數字來自第 2 週講課的轉移模型，三種用法分別對應第 2、4、6 週；把它們並排是本站做的。

**條件。** 天氣只有晴與雨。起始分佈是晴 0.5、雨 0.5。轉移模型：

| 今天 | 明天晴 | 明天雨 |
|---|---|---|
| 晴 | 0.8 | 0.2 |
| 雨 | 0.3 | 0.7 |

**用法一：算一串狀態的機率（第 2 週）。** 「晴、晴、雨」這三天的機率，第一天用起始分佈，之後每一天查「給定前一天」的那一格：

```text
P(晴) × P(晴 | 晴) × P(雨 | 晴) = 0.5 × 0.8 × 0.2 = 0.08
```

**用法二：加上 action 就是 MDP（第 4 週）。** 馬可夫鏈裡沒有人做決定，轉移模型是 `P(明天 | 今天)`，一張 2 × 2 的表就夠了。Markov decision process 讓 agent 在每個 state 選 action，轉移模型變成 `P(s' | s, a)`：每個 action 各要一張表。如果這個世界有 2 個 state、每個 state 有 3 個 action，就要 3 張 2 × 2 的表，另外還要一個 reward function 說每次轉移得幾分。「2 個 state、3 個 action」是本站自擬的數字，講課的例子是格子世界。

**用法三：把 state 換成詞（第 6 週）。** 把「今天的天氣」換成「前一個詞」，轉移模型就變成「這個詞後面接各個詞的機率」，從語料庫數出來。照著它一個詞接一個詞抽樣，就是講課用莎士比亞作品產生句子的做法。講者當場指出限制：這樣產生的句子只保證符合統計規律，不保證有意思。

**結果的意思。** 三週用的是同一個假設：下一個狀態只看前面固定幾個狀態。差別在轉移模型多看什麼（第 4 週多看 action）、狀態是什麼（第 6 週是詞）。

## 跨週例子二：用第 4 週的規則訓練第 5 週的 unit

第 5 週講者直接報出算 OR 與 AND 的權重，沒有示範這些權重怎麼學出來；第 4 週教了 perceptron learning rule，用的例子是天氣。下面把第 4 週的規則用在第 5 週的 unit 上。兩邊的式子是講課的，這個組合與算式是本站自擬的。

**條件。** 第 5 週算 AND 的 unit：兩個權重都是 1，bias 是 −2，activation function 是 step function（加權和大於等於 0 輸出 1）。用第 4 週的寫法，權重向量是 **w** = (w₀, w₁, w₂) = (−2, 1, 1)，輸入向量是 **x** = (1, x₁, x₂)。

現在想讓它改算 OR。給它一筆資料：輸入 (1, 0)，正確答案 y = 1。

**計算。** 先看它目前怎麼答：−2 + 1 × 1 + 1 × 0 = −1，小於 0，輸出 0。答錯了。

套第 4 週的規則 `wᵢ ← wᵢ + α × (y − h(x)) × xᵢ`，取 `α` = 1。誤差 y − h(x) = 1 − 0 = 1，輸入向量是 (1, 1, 0)：

```text
w₀ ← −2 + 1 × 1 × 1 = −1
w₁ ←  1 + 1 × 1 × 1 =  2
w₂ ←  1 + 1 × 1 × 0 =  1
```

新的權重是 (−1, 2, 1)。四種輸入各算一次：

| x₁ | x₂ | −1 + 2x₁ + x₂ | 輸出 |
|---|---|---|---|
| 0 | 0 | −1 | 0 |
| 1 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 |
| 1 | 1 | 2 | 1 |

**結果的意思。** 更新一次之後，這個 unit 算的是 OR。它和講課報的 OR 權重（bias −1、兩個權重都是 1）不一樣，但四種輸入的輸出相同：能算出同一個函數的權重不只一組。這也說明第 5 週的 unit 和第 4 週的分類器是同一個東西，第 4 週的學習規則可以原封不動拿來用。只更新一次就成功是這組數字湊巧，一般要把資料看很多輪。

## 跨週例子三：從貝氏法則到 Naive Bayes

第 2 週那一組數字是講者報的。第 6 週的比例裡，正負面各佔 49% 與 51% 是講者報的，loved 與 it 兩列講者沒有唸出數字，第 6 週導讀取自官方筆記的圖，這裡沿用。只用兩個詞來算是本站為了縮短例子做的簡化。

**第 2 週的用法：一個證據。** 下午下雨的日子裡 80% 早上多雲，40% 的日子早上多雲，10% 的日子下午下雨。早上多雲時下午下雨的機率：

```text
P(下雨 | 多雲) = P(多雲 | 下雨) × P(下雨) ÷ P(多雲) = 0.8 × 0.1 ÷ 0.4 = 0.2
```

**第 6 週的用法：很多個證據。** 一則評論裡出現 loved 與 it 兩個詞，它是正面評論的機率是多少？資料取自第 6 週導讀的表：49% 的評論是正面、51% 是負面；正面評論有 32% 含 loved、30% 含 it；負面評論有 8% 含 loved、40% 含 it。

第 6 週在貝氏法則上多做了兩件事。一是假設每個詞出現與否彼此獨立，所以「兩個詞都出現」的機率可以拆成各自的機率相乘。二是不算分母，先算出兩個正比的數，最後正規化：

```text
正面：0.49 × 0.32 × 0.30 = 0.04704
負面：0.51 × 0.08 × 0.40 = 0.01632

P(正面 | loved, it) = 0.04704 ÷ (0.04704 + 0.01632) = 0.04704 ÷ 0.06336 ≈ 0.742
```

**結果的意思。** 只看這兩個詞，評論比較可能是正面（約 74%）。it 在負面評論裡比較常出現，但 loved 在正面評論裡出現的比例是負面的四倍，影響大得多。講課的例子用了四個詞（另外兩個是 my 與 grandson），算出來是 0.68；完整的計算在[第 6 週導讀](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#文字分類bag-of-words-與-naive-bayes)，那一節的自我檢查算的是另外兩個詞。

「最後正規化」這一步也不是第 6 週才有的：第 2 週講聯合機率時就用過同一招，先算出正比的數，再除以總和（[聯合機率、正規化與四條規則](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#聯合機率正規化與四條規則)）。

## 跨週自我檢查

四題都是本站自擬的，每一題要用到不只一週的內容。

**自我檢查｜先寫下答案，再展開。** 用例子一的起始分佈與轉移模型，「雨、雨、晴」這三天的機率是多少？如果改成 Markov decision process，轉移模型要多看哪一樣東西？

<details>
<summary>答案</summary>

0.5 × 0.7 × 0.3 = 0.105。第一天雨用起始分佈的 0.5，第二天查「今天雨、明天雨」的 0.7，第三天查「今天雨、明天晴」的 0.3。

改成 MDP 之後，轉移模型是 `P(s' | s, a)`，要多看 agent 選的 action；另外每次轉移還有一個 reward。

對應的小節：[馬可夫鏈](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#馬可夫鏈隨時間變化的狀態)、[強化學習與 Markov decision process](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#強化學習與-markov-decision-process)

</details>

**自我檢查｜先寫下答案，再展開。** 例子二更新後的權重是 (−1, 2, 1)。再給它一筆資料：輸入 (0, 0)，正確答案 y = 0，`α` 仍是 1。權重會怎麼變？

<details>
<summary>答案</summary>

不會變。目前的輸出是 −1 + 0 + 0 = −1，小於 0，輸出 0，和正確答案相同。誤差 y − h(x) = 0，更新式後面整項是 0。第 4 週講的三種情況裡，這是「估對了，權重不變」的那一種。

對應的小節：[用一條線分類](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning#用一條線分類權重perceptron-learning-rule-與兩種門檻)、[一個 unit 在算什麼](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks#一個-unit-在算什麼)

</details>

**自我檢查｜先寫下答案，再展開。** 第 1 週的 model checking 與第 2 週的列舉推論，講課各自說它們的問題是什麼、各自換成什麼？兩者有什麼共同點？

<details>
<summary>答案</summary>

Model checking 要列舉全部 2 的 n 次方種真假組合，符號一多就列不完，講課換成推論規則與 resolution，直接操作句子。列舉推論要把沒觀察到的變數的所有取值加總，算得精確但慢，講課換成拒絕取樣與概似加權。

共同點是兩者都把所有可能的情況走一遍，所以都對，也都隨變數個數快速變慢；10 個命題符號是 1,024 種組合，20 個就超過一百萬。這個共同點是本站的歸納。兩者換掉的方向不同：第 1 週換成另一種同樣精確的方法，第 2 週換成近似。

對應的小節：[model checking 的極限](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#邏輯謎題mastermind-與-model-checking-的極限)、[推論規則](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge#推論規則不列舉世界直接改寫句子)、[推論](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#推論從證據算出其他變數的分佈)、[近似推論](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#近似推論取樣拒絕取樣與概似加權)

</details>

**自我檢查｜先寫下答案，再展開。** 例子三裡，如果負面評論含 loved 的比例從 8% 改成 32%（和正面一樣），其他數字不變，`P(正面 | loved, it)` 是多少？

<details>
<summary>答案</summary>

正面：0.49 × 0.32 × 0.30 = 0.04704。負面：0.51 × 0.32 × 0.40 = 0.06528。正規化：0.04704 ÷ (0.04704 + 0.06528) = 0.04704 ÷ 0.11232 ≈ 0.419。

loved 在兩邊的比例一樣時，它對結果沒有影響，等於只看 it：0.49 × 0.30 = 0.147 對 0.51 × 0.40 = 0.204，同樣是 0.419。結論從偏正面（0.742）變成偏負面。一個詞要能幫忙分類，它在兩類裡出現的比例必須不同。

對應的小節：[貝氏法則](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty#貝氏法則把條件機率反過來)、[bag-of-words 與 Naive Bayes](/posts/tech/2026-08-30-harvard-cs50ai-w06-language#文字分類bag-of-words-與-naive-bayes)

</details>

## 系列連結

- [課程總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide)
- [第 0 週 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)
- [第 1 週 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge)
- [第 2 週 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)
- [第 3 週 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization)
- [第 4 週 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning)
- [第 5 週 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks)
- [第 6 週 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language)
- **跨週整理一：想法怎麼銜接與取代（本文）**
- [跨週整理二：十二個專案各用到哪一段講課](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2)
- [課程回顧與後續路線](/posts/tech/2026-08-30-harvard-cs50ai-wrapup)

## 課程影片來源

這一篇是本站寫的跨週整理，沒有對應的那一週，不嵌影片。文中談到某一週內容的地方都連到那一週導讀的小節，錄影的播放器與時間連結在那裡。官方 CS50 YouTube 播放清單（8 支：導論加第 0–6 週講課）已於 2026-10-10 即時核對，其中沒有跨週綜論的影片。

課程與錄影入口：

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方播放清單，沒有對應本篇的單一講次錄影，狀態維持僅附官方入口。
- 2026-10-13：第 6 週的描述改為與現行課程一致：專案是 Parser 與 Attention（原寫 Questions），2023 年版講課沒有 TF-IDF（改列 Naive Bayes、word2vec），Parser 是寫 CFG 文法並用 NLTK 剖析（原寫 CYK 與生成）。
- 2026-10-13：依重寫後的七週導讀整篇重寫，角色改為跨週整理。原本的知識弧線圖、三階段表格與「核心抽象遞進」圖拿掉，其中有不少講課沒有講的內容（條件獨立與變數消去、PageRank 的平穩分佈、SVM 的核技巧、Q-learning 的「無模型、離線策略、收斂」、反向傳播的鏈式法則、CNN 的平移不變性、「符號主義到連結主義」的說法）與錯的專案描述（Heredity 寫成概似加權取樣、Shopping 寫成要標準化）。新內容是三種跨週關係，每一條連到各週導讀的小節；三個算到底的跨週例子；四題附答案的跨週自我檢查。專案對照表移到跨週整理二。原本沒有依據的數學補強清單與書單拿掉。標題的範圍標示由「課程總覽」改為「主題單元」，避免和真正的課程總覽撞同一個角色。用語：「Week N」改「第 N 週」，「播放列表」改「播放清單」。
- 2026-10-13：依獨立審稿修正：「講課自己換掉的做法」表有四列的限制是在前一節說的，各補一個連到那一節的連結，說明句同步改寫；例子三與最後一題自我檢查改用 loved 與 it 兩個詞，避免和第 6 週導讀的自我檢查重複；補上講者回頭提到第 1 週的地方；tags 從 12 個整理成 5 個。
- 2026-10-14：依複審修正：講者點名回頭提到第 1 週的只有第 5 週一處；第 3 週那一句講者沒有點名第 1 週，改標為本站的推測。tags 再拿掉 python，剩 4 個。

## 參考資料

- 本系列七週導讀，本文每一條課程內容的出處，各篇附講課錄影與時間連結：[第 0 週 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)、[第 1 週 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge)、[第 2 週 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)、[第 3 週 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization)、[第 4 週 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning)、[第 5 週 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks)、[第 6 週 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language)
- [CS50 AI 課程官網](https://cs50.harvard.edu/ai/) — 各週講課頁與官方筆記的入口
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
