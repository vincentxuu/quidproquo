---
title: "Embeddings and Social NLP：用周圍的詞表示一個詞的意思｜Stanford CS124 第 5 週"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, embeddings, social-nlp, nlp]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 6 }
tldr: "第 5 週教詞嵌入：一個詞的意思可以用它周圍常出現的詞來表示。先用共現次數做向量、用 cosine 比相似度，再用 word2vec 把向量訓練成幾百維的稠密表示，最後區分靜態向量與隨上下文改變的向量。同週的計算社會科學現場課沒有公開材料。"
description: "Stanford CS124 Winter 2026 第 5 週導讀：distributional hypothesis、共現向量與 cosine 的手算、word2vec（skip-gram with negative sampling）怎麼把問題變成邏輯迴歸、詞嵌入的性質與類比、向量裡的文化偏見、靜態與上下文向量的差別，以及 PA4。依公開投影片。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp-en)

這是 [Stanford CS124 導讀](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)的第 5 週，也是整門課的轉折點。前三週的表示都是人設計的：第 3 週的特徵是人挑的，第 4 週的向量是直接數出來的。從這週開始，表示由資料學出來。

要回答的問題是：**怎麼用一串數字表示一個詞的意思？**

**本週材料**：[Vector Semantics and Embeddings 投影片](https://web.stanford.edu/class/cs124/lec/vector26jan.pdf)、[Contextual Embeddings 投影片](https://web.stanford.edu/class/cs124/lec/ContextualEmbeddings25.pdf)（2025 年的檔案，目前的課表頁面沒有顯示這個連結，檔案仍可下載）、[PA4](https://github.com/cs124/pa4-embeddings)。指定閱讀是教科書 2025 年 8 月版的[第 5 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/5.pdf)，以及[第 10 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/10.pdf)的一小段。預錄影片在 Canvas。這一週另有一堂 Dan Jurafsky 的現場課，主題是計算社會科學，沒有錄影，投影片要 Stanford 登入才看得到，所以本文只涵蓋詞嵌入的部分。

## 出發點：看一個詞的鄰居

投影片用一個多數人沒看過的詞開場：ongchoi。假設你讀到這幾句話：

- Ongchoi 用蒜頭炒很好吃。
- Ongchoi 配飯很棒。
- ……ongchoi 的葉子配鹹的醬汁……

你又讀過這些：

- ……菠菜用蒜頭炒，配飯……
- ……瑞士甜菜（chard）的梗和葉子很好吃……
- ……羽衣甘藍（collard greens）和其他鹹的葉菜……

就算沒人告訴你，你也猜得出 ongchoi 是一種葉菜，和菠菜、瑞士甜菜類似（它就是空心菜）。你用的線索是：它和菠菜出現在相似的句子裡，周圍都有「蒜頭」「葉子」「飯」「鹹」這些詞。

這個想法叫 **distributional hypothesis**：出現在相似上下文的詞，意思也相近。它把「意思」這個抽象的東西換成可以數的東西：一個詞的周圍常出現哪些詞。

## 第一種做法：直接數共現次數

對每個詞，數它前後幾個詞的範圍內（投影片用前後各 4 個詞），其他每個詞出現幾次。投影片從維基百科取了四個詞，只看三個上下文詞：

| | pie | data | computer |
|---|---|---|---|
| **cherry**（櫻桃） | 442 | 8 | 2 |
| **strawberry**（草莓） | 60 | 0 | 0 |
| **digital**（數位） | 5 | 1683 | 1670 |
| **information**（資訊） | 5 | 3982 | 3325 |

每一列就是那個詞的向量。光看數字就看得出來：cherry 和 strawberry 都常跟 pie 一起出現，digital 和 information 都常跟 data、computer 一起出現。

要把「看得出來」變成數字，用上一週的 cosine。內積除以兩個向量的長度：

**cherry 和 information：**

- 內積 = 442×5 + 8×3982 + 2×3325 = 40,716
- cherry 的長度 = √(442² + 8² + 2²) = 442.1
- information 的長度 = √(5² + 3982² + 3325²) = 5,187.7
- cosine = 40,716 ÷ (442.1 × 5,187.7) = **0.018**（投影片印的是 .017，尾數被截掉了）

**digital 和 information：**

- 內積 = 5×5 + 1683×3982 + 1670×3325 = 12,254,481
- digital 的長度 = √(5² + 1683² + 1670²) = 2,371.0
- cosine = 12,254,481 ÷ (2,371.0 × 5,187.7) = **0.996**

information 的次數是 digital 的兩倍多，但 cosine 只看方向，所以兩者幾乎重合；cherry 和 information 幾乎垂直。

這種向量有兩個缺點。它的維度等於詞彙表大小，動輒幾萬維，而且絕大部分是 0。另外，像 the、of 這種到處都有的詞次數很高，卻不帶什麼資訊；上一週的 tf-idf 就是在處理這件事。

## 第二種做法：word2vec

實際好用的詞向量是**短而稠密**的：長度大約 50 到 1,000 維，每一維都有值。這種向量叫 embedding（詞嵌入）。短向量的好處是下游模型要學的權重少，而且意思相近的詞比較容易被歸在一起。

投影片教的方法是 word2vec 的其中一種：**skip-gram with negative sampling**（SGNS）。它的巧妙之處是完全不數次數，而是把問題改成一個第 3 週學過的二元分類。

### 把「數次數」換成「猜是不是鄰居」

問題改成這樣：給一個目標詞 w 和另一個詞 c，c 是不是 w 的鄰居？

訓練資料不用人標，文字本身就是答案。投影片的例子：

> …lemon, a [tablespoon of **apricot** jam, a] pinch…

目標詞是 apricot（杏桃），視窗取前後各 2 個詞。視窗裡的詞就是**正例**：

| 目標詞 | 上下文詞 | 標籤 |
|---|---|---|
| apricot | tablespoon | 是鄰居 |
| apricot | of | 是鄰居 |
| apricot | jam | 是鄰居 |
| apricot | a | 是鄰居 |

**負例**從詞彙表裡隨機抽：每個正例配 k 個隨機的詞，例如 (apricot, aardvark)、(apricot, seven)、(apricot, forever)，標籤是「不是鄰居」。這就是 negative sampling。

### 分類器長什麼樣

每個詞有一個向量。兩個詞是鄰居的機率，用兩個向量的內積通過 sigmoid 來算：

P(是鄰居 | w, c) = σ(c · w)

內積越大，機率越高。這和第 3 週的邏輯迴歸是同一個式子，差別在於**這裡沒有固定的特徵，要學的就是向量本身**。

舉一組本文自擬的數字：假設 apricot 和 jam 兩個向量的內積是 2，模型認為它們是鄰居的機率是 σ(2) ≈ 0.88；apricot 和 aardvark 的內積是 −1，機率是 σ(−1) ≈ 0.27。

### 怎麼學

一開始每個詞的向量是隨機的。訓練用的還是 cross-entropy loss 和梯度下降，每看一組資料就做兩件事：

- 把目標詞的向量和**正例**的向量拉近（讓內積變大）。
- 把目標詞的向量和**負例**的向量推開（讓內積變小）。

跑過整份語料很多次之後，常常一起出現的詞向量會靠在一起，從不一起出現的會分開。

這裡有一件值得想清楚的事。這個分類器本身沒有人要用，沒有人真的想知道 jam 是不是 apricot 的鄰居。它只是一個藉口，目的是訓練過程中順便得到的那些向量。分類任務做完就丟，向量留下來。

SGNS 實際上為每個詞學了兩個向量：一個是它當目標詞時用的，一個是它當上下文詞時用的。常見的做法是把兩個加起來當成最後的向量。

## 詞嵌入有哪些性質

**視窗大小決定「相似」是哪一種。** 投影片舉的例子：視窗很小（前後 2 個詞）時，Hogwarts 最近的鄰居是其他虛構作品裡的學校，也就是可以互相替換的同類詞；視窗大的時候，最近的鄰居變成 Dumbledore、Malfoy、half-blood，也就是同一個主題底下的詞。

**向量相減可以表示關係。** 最有名的例子是 king − man + woman 會落在 queen 附近，Paris − France + Italy 會落在 Rome 附近。把兩對詞畫出來會形成一個平行四邊形。投影片同時提醒：這個方法只對常見的詞、比較短的距離和某些特定關係有效，類比的機制還沒有被完全理解。

**向量記錄了語料的時代。** 用不同年代的文字各訓練一組向量，可以看到詞義的移動。

**向量也記錄了語料的偏見。** 同一套類比方法，問「Paris 之於 France，如同 Tokyo 之於什麼」會得到 Japan；問「man 之於 computer programmer，如同 woman 之於什麼」，一份 2016 年的研究得到的答案是 homemaker（家庭主婦）。向量忠實地反映了訓練文字裡的用法，包括刻板印象。投影片指出後果：如果這種向量被用在篩選履歷的系統裡，偏見就會被帶進去。

這個性質也可以反過來當研究工具。投影片介紹了 Jurafsky 自己參與的一份 2018 年研究：用一百年來各個年代的文字訓練向量，量每個形容詞偏向哪個性別或族裔。結果是，與能力相關的形容詞（聰明、有邏輯、深思熟慮）偏向男性，這個偏向從 1960 年代到 1990 年代逐漸減少。這類研究就是這週現場課「計算社會科學」的主題：把語言模型當成觀察社會的儀器。

## 靜態向量的限制，與上下文向量

word2vec 給每個詞**一個固定的向量**，叫靜態向量。問題出在一詞多義：

- We had a picnic on the grassy river **bank**.（河岸）
- I went to the **bank** and withdrew some cash.（銀行）

兩句裡的 bank 拿到同一個向量，那個向量只能是兩種意思的混合。

**上下文向量**（contextual embedding）的做法是：把整句話丟進語言模型，每個詞拿到一個向量，而且**同一個詞在不同句子裡的向量不一樣**。投影片展示了 BERT 對 die 這個詞算出的向量：畫在平面上會分成幾群，「骰子」的 die、「死亡」的 die 各一群，連德文的冠詞 die 也自成一群。

兩者的差別可以這樣記：

| | 靜態向量 | 上下文向量 |
|---|---|---|
| 表示的對象 | 詞彙表裡的一個詞 | 一個詞在某句話裡的那一次出現 |
| 怎麼取得 | 查表 | 把整句丟進語言模型 |
| 同一個詞在不同句子裡 | 向量相同 | 向量不同 |

上下文向量是從 Transformer 內部取出來的，那是下兩週的內容。

## PA4

**[PA4](https://github.com/cs124/pa4-embeddings)** 分兩段。前半用靜態詞向量：找同義詞、比較不同的相似度算法、看反義詞在向量空間裡的位置。後半用 BERT 取上下文向量，算句子之間的相似度。最後是倫理題。README 建議先看完第 5 週的影片與投影片、讀完教科書的對應章節。這份作業除了原本的 `cs124` 環境，還要另外安裝 PyTorch 和 Hugging Face 的 Transformers，因為會用到預訓練模型來取上下文向量。

這一週沒有實作課，週二的時段是那堂現場課。

## 自我檢查

1. 用共現表算 cherry 和 strawberry 的 cosine。答案：strawberry 的向量是 [60, 0, 0]，內積 = 442×60 = 26,520，strawberry 的長度是 60，cherry 的長度是 442.1，cosine = 26,520 ÷ (442.1 × 60) ≈ 1.00。在這三個維度上，兩者方向幾乎完全相同。
2. SGNS 裡，如果兩個詞的向量內積是 0，模型認為它們是鄰居的機率是多少？答案：σ(0) = 0.5，沒有傾向。
3. 訓練語料是「我 喝 熱 咖啡」，視窗取前後各 1 個詞，目標詞是「熱」，正例有哪些？答案：(熱, 喝) 和 (熱, 咖啡)。
4. 「蘋果」可以是水果，也可以是公司。靜態向量和上下文向量各會怎麼處理？答案：靜態向量只有一個，是兩種用法的混合，偏向語料裡比較常見的那一種；上下文向量在「吃蘋果」和「蘋果發表新手機」兩句裡會得到兩個不同的向量。

## 這週和後面的關係

- 第 6 週的神經語言模型，第一步就是把每個 token 換成它的向量。那一層的向量和整個模型一起訓練，不必另外跑 word2vec。
- SGNS 是「用一個預測任務當藉口來學表示」的第一個例子。語言模型做的事是同一個模式：訓練目標是預測下一個 token，真正有用的是過程中學到的表示。
- 上一週 dense retrieval 用的文件向量，就是這週最後講的上下文向量。

**系列導覽**：上一篇 [第 4 週：Information Retrieval](/posts/ai/2026-08-22-cs124-week4-information-retrieval)｜下一篇 [第 6 週：Neural Networks and LLMs](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms)

## 更新紀錄

- 2026-10-13：依公開投影片重寫。補上共現向量的 cosine 手算、skip-gram 正負例的組成與訓練方式、詞嵌入的性質與偏見研究、靜態與上下文向量的對照，以及自我檢查；移除與投影片無關的作者延伸段落。

## 參考資料

- [CS124 Winter 2026 課程網站與課表](https://web.stanford.edu/class/cs124/)
- [Vector Semantics and Embeddings 投影片](https://web.stanford.edu/class/cs124/lec/vector26jan.pdf) — ongchoi 例子、共現表與 cosine、skip-gram、類比與偏見研究
- [Contextual Embeddings 投影片](https://web.stanford.edu/class/cs124/lec/ContextualEmbeddings25.pdf) — bank 與 die 的例子、靜態與上下文向量的對照
- [CS124 PA4](https://github.com/cs124/pa4-embeddings)
- [Speech and Language Processing 2025 年 8 月版第 5 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/5.pdf)
