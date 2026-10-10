---
title: "清大高宏宇 NLP 第二週：詞向量與語言模型，從數 n-gram 到 RNN"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, language-model, n-gram, perplexity, rnn]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 2
tldr: "清大高宏宇 NLP 課第二週的投影片共 62 頁，主題是「預測下一個字」。前半用 bigram 計數表、add-one smoothing 和 perplexity 講統計語言模型，再用 PPMI 的 cherry／digital 例子講稀疏向量；中段回到 Word2Vec 的負採樣，並用「蘋果」一詞說明為什麼需要 contextualized embedding；後半從 FFN 的三個缺點引出 RNN，示範它怎麼做 NER、句子分類，以及 stacked 與雙向版本。"
description: "清大高宏宇《自然語言處理》Fall 2025 第二週導讀：依據「W2 Word embeddings and Language Modeling (RNN).pdf」與 W2 週二、週四錄影，整理 n-gram 與 Markov 假設、add-k smoothing、perplexity 的四種解讀、n-gram 的限制、TF-IDF 與 PPMI 稀疏向量、詞向量的類比與語意變遷、Word2Vec 負採樣、contextualized embedding、神經網路訓練要素、FFN 的限制、RNN 與 NER、stacked RNN 與雙向 RNN。"
draft: false
glossary:
  - term: "perplexity"
    aliases: ["困惑度", "PPL"]
    definition: "衡量語言模型對一段測試文字有多「意外」的指標，可以理解為模型每一步平均在幾個選項之間猶豫。越低代表模型越會預測。"
    context: "投影片把它當作 n-gram 與神經語言模型共用的評估方式。"
  - term: "PPMI"
    aliases: ["positive pointwise mutual information", "正點互信息"]
    definition: "比較一個詞和一個上下文詞實際一起出現的機率，與假設兩者獨立時的機率，取 log2；負值一律改成 0。"
    context: "投影片用它和 TF-IDF 並列為兩種稀疏向量的做法。"
  - term: "contextualized embedding"
    aliases: ["上下文詞向量", "情境化詞向量"]
    definition: "同一個詞依照所在句子的上下文，得到不同向量的表示法；相對於 Word2Vec 每個詞只有一個固定向量。"
    context: "投影片以 BERT、GPT 為例，並用「蘋果公司」與「蘋果派」說明。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據[清大高宏宇《自然語言處理》](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025 的 [W2_Word embeddings and Language Modeling (RNN).pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29.pdf)（62 頁），對應錄影是 [Week 2 Tue.](https://www.youtube.com/live/6Z0A4JMptT8) 與 [Week 2 Thu.](https://www.youtube.com/live/cqp5a39eyJQ)，事實皆於 2026-09-30 對照投影片核對。本篇只依投影片內容整理，沒有逐字對照錄影。存取等級 **A3**（理由見[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)）。

**系列位置**：上一篇 [NLP 簡介與傳統文字處理](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing)｜下一篇 [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

「Please turn your homework …」下一個字是什麼？over？in？你大概猜得到，而且猜得很準。第二週的投影片從這個問題開始：**預測下一個字這件事，怎麼從數次數一路走到神經網路？**

[上一篇](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing)從資訊檢索的角度，把文字變成了向量。這一篇換成語言模型的角度。投影片第一頁的標題是「GAI Motivation」，列出監督式學習（文字分類、問答系統）的兩個問題：缺訓練資料、領域知識有限；下一頁接著說，產生句子最常見的方式就是一個字接一個字寫下去。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=6Z0A4JMptT8
title: Fall 2025 Week 2 Tue. 錄影
```

```youtube
url: https://www.youtube.com/watch?v=cqp5a39eyJQ
title: Fall 2025 Week 2 Thu. 錄影
```

原始影片：[Fall 2025 Week 2 Tue. 錄影](https://www.youtube.com/watch?v=6Z0A4JMptT8)、[Fall 2025 Week 2 Thu. 錄影](https://www.youtube.com/watch?v=cqp5a39eyJQ)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

查核日期：2026-10-10。

## 統計語言模型：數 n-gram

投影片先回顧 Markov（1913 年研究一個字母出現的機率怎麼取決於前一個字母）與 Shannon（1951 年〈Prediction and Entropy of Printed English〉），再用一段中文歌詞拼貼示範：在這段文字裡，「妳」後面接「說」的機率是 1/4，「沒停妳」後面接「說」的機率是 0。語言模型要做的，就是把這種條件機率學起來。

**n-gram** 是連續 n 個詞：unigram 是「please」，bigram 是「please turn」，trigram 是「please turn your」。投影片穿插了一個應用：[Scientific American 報導](https://www.scientificamerican.com/article/how-a-computer-program-helped-show-jk-rowling-write-a-cuckoos-calling/)的 J.K. Rowling 化名事件，文體分析軟體 JGAAP 用四字元序列（four-grams）、最常見詞的頻率、詞長分布與常見詞對，把《The Cuckoo's Calling》和《哈利波特》的作者連了起來。

### 從計數到機率

bigram 模型就是數數。投影片先用三句話示範（C(I want) = 2、C(want to) = 3），再給一張八個詞的 bigram 計數表：「I」後面接「want」出現 827 次，「want」後面接「to」出現 608 次。

計數表裡有很多 0。沒看過不代表不可能，所以投影片做了 **add-k smoothing（k=1）**：每一格都加 1，再除以總數換成相對頻率。加完之後 P(want | I) 約 0.21，P(to | want) 約 0.26。

整個句子的機率用連鎖律拆開，再做 **Markov 假設**：一個詞的機率只取決於前一個詞（bigram）或前 n−1 個詞。這一步讓計算變得可行，也埋下了後面所有的限制。

### Perplexity：怎麼評估語言模型

投影片說 perplexity（困惑度）越低，語言模型的能力越好，並給了四種解讀：

1. **不確定性的量度**：模型做預測時有多不確定。
2. **平均分支數**：每一步平均在幾個選項之間選。
3. **模型表現的量化**：反映模型掌握語言規則與結構的程度。
4. **壓縮效率**：perplexity 越低，代表模型給測試資料的機率越高，也就是壓縮得越好。

投影片最後丟出一個問題沒有回答：**可以用 perplexity 判斷一段文字是不是 AI 寫的嗎？** 這個問題值得留著，到[解碼與評估](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)那一篇會再碰到 perplexity。

### n-gram 的四個限制

- **上下文有限**：抓不到距離遠大於 N 的依存關係。
- **資料稀疏**：N 變大，參數量指數成長。
- **忽略詞序與上下文**：假設詞之間獨立。
- **彈性低**：處理同義詞和不同情境（例如對話）的能力有限。

## 稀疏向量：TF-IDF 與 PPMI

在進入神經網路之前，投影片先整理「用上下文表示一個詞」的稀疏做法。每一維對應一個詞，大部分的值是 0。

TF-IDF 是第一週的複習。新的是 **PPMI**。它的出發點是分布假說：出現在相似上下文的詞，意思也相近（「I enjoy coding」和「I like coding」）。

PMI 比較兩件事：詞 w 和上下文詞 c 實際一起出現的機率，以及假設兩者獨立時應該一起出現的機率，取 log2。PPMI 再把所有負值改成 0。

投影片的例子是四個詞在五個上下文裡的共現次數：cherry 和 pie 一起出現 442 次，digital 和 computer 一起出現 1670 次。換成機率、算完 PPMI 之後，cherry 的向量是 (0, 0, 0, 4.38, 3.30)，只在 pie 和 sugar 兩維有值；digital 和 information 則集中在 computer、data、result 那幾維。以 cherry–sugar 那一格為例，投影片的算式是 log2(0.0021 / (0.0415 × 0.0052)) ≈ 3.30。

## 稠密向量：Word2Vec 與 contextualized embedding

稠密向量把詞放進連續空間，意思相近的詞會靠在一起。投影片展示了詞向量的兩個性質：

- **類比**：Washington − U.S. + U.K. = London。這正是[下一篇 HW1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) 要你驗證的事。
- **語意變遷**：詞向量也能拿來研究詞義怎麼隨時代改變。投影片的圖裡，1850 年代的 broadcast 靠近 sow、seed、scatter，1900 年代移到 newspapers、television 旁邊；network 從 1920 年代靠近 telegraph、wires，1990 年代靠近 Internet、Email，到 2020 年代靠近 cloud computing、blockchain、IoT。

### Word2Vec 的負採樣

第一週已經講過 Skip-gram 的網路結構。這週換一個角度，用四步說明訓練方式：

1. 把目標詞和它窗口內的上下文詞當作正例。
2. 從詞彙表隨機抽其他詞當作負例。
3. 用 logistic regression 訓練一個分類器區分兩者。
4. 把學到的權重當作詞向量。

投影片也提醒效率問題：每次更新只動窗口內的詞向量。窗口大小是 m 時，一個窗口只有 2m+1 個詞，所以梯度是稀疏的。

### 一個詞為什麼需要多個向量

Word2Vec 給每個詞一個固定向量。投影片用「蘋果」說明這不夠：「蘋果公司」和「蘋果派」的蘋果不是同一件事；「蘋果改變了他的一生」這句話，對牛頓和對賈伯斯來說意思也不同。

**Contextualized embedding** 讓同一個詞依上下文得到不同的向量，投影片舉 BERT、GPT 為例。它用整段長上下文、而不是一個小窗口來學，並且把一個深層神經語言模型的所有層都拿來用。投影片最後留了一個實務問題：詞向量層在下游任務時要凍結，還是跟著一起訓練？

## 神經語言模型：從 FFN 到 RNN

要處理這些向量，需要一個模型結構。投影片先補了幾頁深度學習的基本功：

- **三個要素**：模型（輸入到輸出的結構）、optimizer（調參數讓誤差變小的演算法）、loss function（量預測和答案差多少）。
- **訓練六步**：準備資料、用框架建模型（TensorFlow、PyTorch）、選 loss（cross-entropy 等）、選 optimizer（Adam、SGD 等）、訓練、評估。
- **激勵函數（activation function）**：softmax 輸出加總為 1 的機率分布，用於多類別分類；sigmoid 輸出 0 到 1，用於二元分類；tanh 輸出 −1 到 1、以 0 為中心，常用在隱藏層；ReLU 引入非線性並避免梯度消失。

### FFN 的三個缺點

前饋網路（FFN）是單元之間沒有迴圈的多層網路。投影片列出它處理語言的三個問題：

- **不會建模序列**：語言裡詞的順序和依存關係很重要。
- **輸入大小固定**：句子長短不一。
- **上下文有限**：很多任務需要長距離依存。

### RNN

RNN 就是為序列設計的。投影片的比喻是「Moving average 進階版」：每一步的隱藏狀態，由上一步的隱藏狀態和這一步的輸入，經過可學習的權重和非線性轉換算出來，而且**所有時間步共用同一組權重**。

投影片畫了一條時間軸，從 Hopfield Network、Elman RNN、BPTT、LSTM、雙向 RNN、GRU、Seq2seq，一路到 Attention（2015）與 Transformer（2017）。RNN 的四個性質：

- 循序處理，能建模時間上的依存。
- 有循環連結，維持內部記憶。
- 參數跨時間步共用，學習效率較高。
- **梯度消失**：傳統 RNN 很難學到長距離依存。

最後一點本週沒有展開。它是[第四篇 Seq2seq 與 Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention) 的起點。

### RNN 能做什麼

- **命名實體辨識（NER）**：找出序列裡的國家、組織、人名。這是 token 分類：每一步的輸出都接一個 FFN，對應到一個 one-hot 標籤。
- **句子分類**：分類整個序列而不是每個 token。取最後一個 token 的隱藏狀態，接 FFN 和 softmax。
- **Stacked RNN**：多層 RNN 疊起來，下一層的輸入是上一層的輸出。通常比單層好，因為各層學到不同抽象程度的表示，但層數一多訓練成本就快速上升。
- **雙向 RNN**：很多應用需要看到整個輸入。兩個獨立的 RNN，一個從頭讀到尾，一個從尾讀到頭；做句子分類時，把兩個方向最後的隱藏狀態合起來，再送進分類器。

## 本週的地圖

投影片最後一頁的總結，剛好是這一篇的骨架：

| 類別 | 方法 | 核心想法 |
|---|---|---|
| 統計語言模型 | n-gram | 數次數，Markov 假設 |
| 稀疏向量 | TF-IDF、PPMI | 用上下文編碼詞 |
| 稠密向量 | Word2Vec、contextualized embedding | 自監督訓練 |
| 神經語言模型 | FFN、RNN | 全連接網路；循環結構保存隱藏狀態 |

## Fall 2026 的對應

2026 首頁 README 在 W3 掛了這份投影片的 [v2 版](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29_v2.pdf)，錄影是 [Fall 2026 Week 3](https://youtube.com/live/g0QE6O17BWE)，HW1 也在同一週發下。v2 同樣是 62 頁，抽出的文字和 2025 版幾乎一樣，只有版面差異。

## 讀完這篇可以做什麼

- **今晚**：找一篇你熟悉的中文文章，用 Python 的 `collections.Counter` 數出所有 bigram，挑一個詞，看它後面最常接什麼，感受一下 n-gram 模型「看到什麼就學什麼」的樣子。
- **想更進一步**：照投影片的 PPMI 表手算一格，確認 3.30 是怎麼來的。
- **下一篇**：[HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) 要你拿預訓練詞向量和自己訓練的 Word2Vec 做類比題，驗證 Washington − U.S. + U.K. = London 這類關係是不是真的學到了。

## 延伸閱讀

- [CS224N 詞向量](/posts/ai/2026-08-22-cs224n-word-vectors)：Stanford 版本的 word2vec 推導。
- [CS224N RNN 與語言模型](/posts/ai/2026-08-22-cs224n-rnn-language-models)：n-gram、perplexity 與 RNN 語言模型的另一種講法。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。

## 參考資料

- [W2_Word embeddings and Language Modeling (RNN).pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29.pdf)
- [W2_Word embeddings and Language Modeling (RNN)_v2.pdf（Fall 2026）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29_v2.pdf)
- [2025 README：Fall 2025 週次表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Fall 2025 Week 2 Tue. 錄影](https://www.youtube.com/live/6Z0A4JMptT8)
- [Fall 2025 Week 2 Thu. 錄影](https://www.youtube.com/live/cqp5a39eyJQ)
- [Fall 2026 Week 3 錄影](https://youtube.com/live/g0QE6O17BWE)
- [Scientific American：How a Computer Program Helped Show J.K. Rowling Write A Cuckoo's Calling](https://www.scientificamerican.com/article/how-a-computer-program-helped-show-jk-rowling-write-a-cuckoos-calling/)
