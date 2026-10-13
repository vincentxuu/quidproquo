---
title: "Information Retrieval：從倒排索引、tf-idf 到 RAG 的檢索底座｜Stanford CS124 第 4 週"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, information-retrieval, rag, nlp]
lang: zh-TW
series: { name: "Stanford CS124 導讀", order: 5 }
tldr: "第 4 週教搜尋：把查詢和文件都變成向量，用 tf-idf 加權、cosine 相似度排名，用倒排索引加速，用 precision、recall 與 MAP 評估，最後接到向量檢索與 RAG。本文把投影片的四篇迷你文件例子完整算一遍。"
description: "Stanford CS124 Winter 2026 第 4 週導讀：資訊檢索的任務、LLM 為什麼仍需要檢索、tf 與 idf 的公式、cosine 相似度、四篇文件的 tf-idf 手算排名、倒排索引、排序結果的評估（平均精確率與 MAP）、dense retrieval 的兩種架構與 RAG，以及實作課三與 PA3。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs124-week4-information-retrieval-en)

這是 [Stanford CS124 導讀](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)的第 4 週。主題是資訊檢索（information retrieval，IR）：使用者有一個想知道的事，手上有一大堆文件，系統要把最相關的幾篇找出來、排好順序。

**本週材料**：[Information Retrieval and RAG 投影片](https://web.stanford.edu/class/cs124/lec/ir_jan17_2026.pdf)、[實作課三題目](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)與[解答](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)、[PA3](https://github.com/cs124/pa3-information-retrieval)。指定閱讀是教科書[第 11 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/11.pdf)。預錄影片在 Canvas，本文依投影片與教科書整理。

## 有了 LLM，為什麼還要學搜尋

投影片一開始就處理這個疑問。「羅浮宮在哪裡」這種問題，直接問 LLM 就有答案，不需要文件集合。但 LLM 回答問題有三個檢索可以補的弱點：

- **會編造。** 投影片引用一份 2024 年的研究：在法律領域，LLM 的回答最高有 88% 與事實不符。
- **看不到私有資料。** 個人信件、病歷、公司內部文件、訴訟文件，都不在訓練資料裡。
- **跟不上變動。** 上週的比賽結果、今天早上的地震、最新的奧斯卡得主，模型訓練完之後發生的事它不知道。

解法是 **RAG**（retrieval-augmented generation）：先用檢索從文件集合裡找出相關段落，再讓 LLM 根據這些段落產生答案。所以這一週學的檢索，就是 RAG 的前半段。

## 核心想法：查詢和文件都是向量

這個做法叫向量空間模型，1971 年由 Gerard Salton 提出：

1. 把每篇文件表示成一個向量，每一維是一個詞，值是這個詞在文件裡的份量。
2. 把查詢也表示成同樣格式的向量。
3. 回傳向量和查詢最相似的文件，照相似度排序。

系統其實沒辦法判斷一篇文件「是否滿足使用者的需求」，它算的是查詢和文件在文字上有多像，用這個當作相關程度的近似。

向量怎麼做，有兩條路。**Sparse retrieval** 用詞的次數，向量的維度等於詞彙表大小，大部分是 0；**dense retrieval** 用語言模型產生的幾百維向量。兩者算相似度都用 cosine。這一週先教前者。

## tf-idf：一個詞在這篇文件裡有多重要

直接用次數當向量的值有兩個問題，tf-idf 各用一個因子處理。

**詞頻（tf）要打折。** 一個詞出現 100 次的文件，不會比出現 10 次的相關十倍。所以取對數：

tf = 1 + log₁₀(次數)，次數為 0 時 tf = 0

出現 1 次是 1，10 次是 2，100 次是 3。

**到處都有的詞沒有鑑別力。** 「的」幾乎每篇文件都有，知道查詢和文件都有「的」沒有用。所以用**文件頻率**（df，有幾篇文件包含這個詞）來降權：

idf = log₁₀(N ÷ df)，N 是文件總數

每篇都有的詞，idf = log₁₀(1) = 0，完全不計分；只出現在一篇裡的詞 idf 最高。

兩者相乘就是這個詞在這篇文件裡的權重：**tf-idf = tf × idf**。

## cosine：比方向，不比長度

兩個向量的內積會被長度影響：長文件的詞多、數字大，內積自然高。所以先把兩個向量各自除以自己的長度，變成長度為 1 的向量，再算內積。這個值就是兩個向量夾角的 cosine：方向完全一樣是 1，完全沒有共同的詞是 0。

## 完整算一次

投影片用四篇極短的「文件」示範。查詢是 `sweet love`：

- 文件 1：Sweet sweet nurse! Love?
- 文件 2：Sweet sorrow
- 文件 3：How sweet is love?
- 文件 4：Nurse!

全部轉小寫、去掉標點。N = 4。

**第一步，算每個詞的 idf。**

| 詞 | 出現在哪幾篇 | df | idf = log₁₀(4 ÷ df) |
|---|---|---|---|
| sweet | 1、2、3 | 3 | 0.125 |
| love | 1、3 | 2 | 0.301 |
| nurse | 1、4 | 2 | 0.301 |
| sorrow | 2 | 1 | 0.602 |
| how | 3 | 1 | 0.602 |
| is | 3 | 1 | 0.602 |

`sweet` 四篇裡有三篇都出現，idf 最低。

**第二步，算查詢的向量。** 兩個詞各出現一次，tf 都是 1。

| 詞 | tf | idf | tf-idf | 除以長度後 |
|---|---|---|---|---|
| sweet | 1 | 0.125 | 0.125 | 0.383 |
| love | 1 | 0.301 | 0.301 | 0.924 |

長度是 √(0.125² + 0.301²) = 0.326。正規化之後可以看出，這個查詢的重心在 `love`，因為它比較稀有。

**第三步，算文件 1 的向量。** `sweet` 出現兩次，tf = 1 + log₁₀(2) = 1.301。

| 詞 | 次數 | tf | idf | tf-idf | 除以長度後 |
|---|---|---|---|---|---|
| sweet | 2 | 1.301 | 0.125 | 0.163 | 0.357 |
| nurse | 1 | 1 | 0.301 | 0.301 | 0.661 |
| love | 1 | 1 | 0.301 | 0.301 | 0.661 |

長度是 √(0.163² + 0.301² + 0.301²) = 0.456。

**第四步，算 cosine。** 只有查詢和文件都有的詞會貢獻分數：

cos(查詢, 文件 1) = 0.383 × 0.357 + 0.924 × 0.661 = 0.747

**文件 2** 照同樣步驟：`sweet` 的 tf-idf 是 0.125，`sorrow` 是 0.602，長度 0.615，`sweet` 正規化後是 0.203。它和查詢只共有 `sweet`：

cos(查詢, 文件 2) = 0.383 × 0.203 = 0.078

以上兩篇是投影片算的。文件 3 和 4 投影片留作練習，以下是我照同一套公式算的：

- **文件 3**：`how` 0.602、`sweet` 0.125、`is` 0.602、`love` 0.301，長度 0.912。`sweet` 正規化後 0.137，`love` 0.330。cos = 0.383 × 0.137 + 0.924 × 0.330 = 0.357。
- **文件 4**：只有 `nurse`，和查詢沒有共同的詞，cos = 0。

| 排名 | 文件 | 分數 |
|---|---|---|
| 1 | 文件 1：Sweet sweet nurse! Love? | 0.747 |
| 2 | 文件 3：How sweet is love? | 0.357 |
| 3 | 文件 2：Sweet sorrow | 0.078 |
| 4 | 文件 4：Nurse! | 0 |

有兩件事值得注意。文件 1 和文件 3 都同時有 `sweet` 和 `love`，但文件 3 多了兩個只有它才有的詞（`how`、`is`），這兩個詞 idf 很高，把文件 3 的向量方向拉離了查詢，所以分數比較低。在只有四篇文件的集合裡，`how` 和 `is` 被當成稀有而重要的詞；真實的文件集合夠大，這類功能詞幾乎每篇都有，idf 會接近 0。另外，文件 2 雖然有 `sweet`，分數卻很低，因為 `sweet` 幾乎每篇都有，不算什麼證據。

## 倒排索引：不用每篇都算

上面算了全部四篇文件。文件有一億篇時不能這樣做。觀察一下：和查詢沒有任何共同詞的文件，cosine 一定是 0，根本不用算。

**倒排索引**（inverted index）就是為了快速找出「包含某個詞的所有文件」。它像書後面的索引：查一個詞，列出它出現在哪幾頁。結構有兩個部分：一份所有詞的字典，以及每個詞對應的一串文件編號（postings）。

上面四篇文件的倒排索引：

| 詞 | 文件編號 |
|---|---|
| how | 3 |
| is | 3 |
| love | 1、3 |
| nurse | 1、4 |
| sorrow | 2 |
| sweet | 1、2、3 |

查詢 `sweet love` 進來，只要查這兩個詞，把兩串編號合起來得到 {1, 2, 3}，文件 4 連看都不用看。

## 評估排序結果

第 3 週的 precision 和 recall 可以直接搬過來：

- **Precision**：回傳的文件裡，有多少是相關的。
- **Recall**：所有相關的文件裡，回傳了多少。

但搜尋結果是有順序的。兩個系統回傳同樣十篇文件，一個把相關的排在最前面，一個排在最後面，precision 和 recall 完全一樣，使用者的感受卻差很多。所以需要會看排名的指標。

做法是沿著排名往下走，每遇到一篇相關文件，就記下「到這個位置為止的 precision」，最後把這些數字平均，叫做 **average precision**（AP）。

本文自擬一個例子。某個查詢總共有 3 篇相關文件，系統回傳六篇，相關（✓）與不相關（✗）的順序是 ✓ ✗ ✓ ✗ ✗ ✓：

| 排名 | 相關嗎 | 到這裡的 precision |
|---|---|---|
| 1 | ✓ | 1/1 = 1.00 |
| 2 | ✗ | |
| 3 | ✓ | 2/3 = 0.67 |
| 4 | ✗ | |
| 5 | ✗ | |
| 6 | ✓ | 3/6 = 0.50 |

AP = (1.00 + 0.67 + 0.50) ÷ 3 = 0.72。如果三篇相關文件排在前三名，AP 會是 1。

一個系統要用很多查詢來測，把每個查詢的 AP 再平均一次，就是 **MAP**（mean average precision）。

## Dense retrieval：字面不同也找得到

tf-idf 有一個根本限制：查詢和文件要用到**同一個詞**才有分數。查「蘋果」找不到只寫「鳳梨、水果」的文件，查「車」找不到只寫「汽車」的文件。

Dense retrieval 改用語言模型把查詢和文件各自編碼成一個幾百維的向量，意思相近的文字向量會靠近，不需要用到同一個詞。投影片介紹兩種架構：

- **雙編碼器（bi-encoder）**：查詢和文件分別丟進編碼器（投影片用 BERT），各取一個向量，算內積當分數。文件的向量可以事先全部算好存起來，查詢時只要編碼查詢一次。
- **單一編碼器（cross-encoder）**：把查詢和文件接在一起丟進同一個編碼器，讓模型同時看到兩邊再打分數。比較準，但每一對查詢和文件都要跑一次模型，文件多的時候太貴，只能用來重新排序。

實務上常把兩種方法串起來：先用便宜的方法（投影片舉的是 BM25，tf-idf 的改良版）撈出前 N 篇，再用貴的模型對這 N 篇重新排序。

Dense 向量沒有「大部分是 0」的性質，倒排索引派不上用場。要在大量向量裡找最接近的幾個，用的是近似最近鄰搜尋，投影片點名的工具是 Faiss。

另外，檢索的單位通常不是整篇文件，而是切成一段一段，投影片舉的長度是 100 個 token 左右。

## RAG：把找到的段落交給 LLM

回到開頭。RAG 的流程是兩步：

1. 用使用者的問題去檢索，拿回最相關的幾段文字。
2. 把這幾段文字和問題一起放進 prompt，讓 LLM 根據它們回答。

這樣前面三個弱點都有對策：答案有文件可以對照，私有資料放進文件集合就查得到，文件集合更新了答案就跟著更新。但這也表示 RAG 的品質有一個上限：**檢索沒找到的段落，生成那一端再強也用不到。** 所以前面那些排名和評估的方法，在 RAG 系統裡一樣要用。

## 實作課三與 PA3

[**實作課三**](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)分兩部分，題目與[解答](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)都公開。課表上另有一份[導引投影片](https://web.stanford.edu/class/cs124/lec/lab3irupload.pdf)。第一部分用試算表手算一個兩篇文件的 tf-idf cosine，然後問：查詢是 `apple`，為什麼 dense retrieval 會給「pineapple fruit」一個不是零的分數，而 tf-idf 不會。第二部分練 precision 與 recall，並討論不同的搜尋情境該重視哪一個。

**[PA3](https://github.com/cs124/pa3-information-retrieval)** 在 notebook 裡把這一週的內容從頭做一遍：建倒排索引、取出一個詞的 postings、算 tf-idf、排序取回文件，接著做 dense retrieval 並比較兩種方法的結果，最後是倫理題。README 建議先看完第 4 週的影片、投影片、閱讀與實作課三。

## 自我檢查

1. 文件集合有 1,000 篇，某個詞出現在其中 10 篇，idf 是多少？出現在全部 1,000 篇呢？答案：log₁₀(100) = 2；log₁₀(1) = 0。
2. （實作課三的題目）集合只有兩篇文件：文件 1 有 apple 3 次、fruit 2 次；文件 2 有 phone 2 次。查詢是 `apple`。哪一篇排前面，cosine 是多少？答案：N = 2，三個詞的 df 都是 1，idf = log₁₀(2) = 0.301。文件 1 的 `apple` 是 (1 + log₁₀3) × 0.301 = 0.445，`fruit` 是 (1 + log₁₀2) × 0.301 = 0.392，長度 0.593，`apple` 正規化後是 0.750。查詢只有一個詞，正規化後是 1。cosine = 0.750。文件 2 沒有 `apple`，是 0。文件 1 排前面。
3. （實作課三的題目）系統對某個查詢回傳 8 篇相關、10 篇不相關的文件，集合裡總共有 20 篇相關的。precision 和 recall 各是多少？答案：precision = 8/18 = 0.44，recall = 8/20 = 0.40。
4. 把上面 AP 例子的順序改成 ✗ ✓ ✓ ✓ ✗ ✗，AP 是多少？答案：相關文件在第 2、3、4 名，precision 分別是 1/2、2/3、3/4，AP = (0.50 + 0.67 + 0.75) ÷ 3 = 0.64。第一名放錯，比原本的 0.72 低。

## 這週和後面的關係

- 這週的向量是用詞的次數做的。下一週把同樣的想法用在詞本身：每個詞一個向量，一樣用 cosine 比相似度。
- dense retrieval 用的編碼器是 Transformer，第 6、7 週會講它的內部。
- 第 9 週的 PA7 讓 agent 呼叫網頁搜尋工具，是另一種把檢索接到 LLM 的方式。
- 第 10 週的 PageRank 補上另一種排名訊號：不看文字，看網頁之間的連結。

**系列導覽**：上一篇 [第 3 週：Logistic Regression and Text Classification](/posts/ai/2026-08-22-cs124-week3-logistic-regression)｜下一篇 [第 5 週：Embeddings and Social NLP](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp)

## 更新紀錄

- 2026-10-13：依 2026 年版公開投影片重寫。補上四篇文件的 tf-idf 完整手算、倒排索引實例、average precision 例子、dense retrieval 的兩種架構與自我檢查；移除投影片沒有涵蓋的延伸內容。

## 參考資料

- [CS124 Winter 2026 課程網站與課表](https://web.stanford.edu/class/cs124/)
- [Information Retrieval and RAG 投影片](https://web.stanford.edu/class/cs124/lec/ir_jan17_2026.pdf) — LLM 的三個弱點、tf-idf 公式、四篇文件例子、倒排索引、MAP、dense retrieval
- [CS124 實作課三](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)與[解答](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)
- [CS124 PA3](https://github.com/cs124/pa3-information-retrieval)
- [Speech and Language Processing 2025 年 8 月版第 11 章](https://web.stanford.edu/~jurafsky/slp3/old_aug25/11.pdf)
