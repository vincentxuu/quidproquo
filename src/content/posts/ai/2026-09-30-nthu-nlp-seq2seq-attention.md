---
title: "清大 NLP W3：翻譯的輸入輸出不一樣長怎麼辦——Seq2seq、LSTM 與 Attention"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, rnn, attention]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 4
tldr: "「Look over there」是 3 個 token，中文「請看那邊」是 4 個，日文是 12 個——輸出長度跟輸入對不上，分類器那套「最後接一層 FFN」就不能用。這份 33 頁的投影片從 encoder-decoder 講起，推到 RNN 的梯度消失、LSTM 的三個閘門，最後用 attention 同時解決長距離與平行化兩個問題，並解釋為什麼要除以 √d。"
description: "清大高宏宇《自然語言處理》Fall 2025 W3 講義導讀：機器翻譯的長度問題、encoder-decoder 與 context vector、RNN 梯度消失與爆炸、LSTM 的 forget／input／output gate、Bahdanau attention 與不靠 RNN 的 attention。"
draft: false
glossary:
  - term: "context vector"
    aliases: ["上下文向量"]
    definition: "encoder-decoder 架構裡，把整個輸入序列壓成一個向量交給 decoder。最基本的做法是直接用 encoder 最後一個 hidden state。"
    context: "W3 投影片用它說明為什麼長句會丟失資訊，進而引出 attention。"
  - term: "梯度消失"
    aliases: ["gradient vanishing", "vanishing gradient"]
    definition: "反向傳播時梯度要連乘很多項，每項小於 1 就會指數衰減，越早的時間步越學不到東西；每項大於 1 則會暴增，稱為梯度爆炸。"
    context: "W3 用它說明 RNN 的限制，接著介紹 LSTM。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention-en)

這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列第 4 篇。[第 2 篇](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)已經介紹過 RNN 語言模型：一次讀一個字，預測下一個字。[HW1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) 則考了詞向量。這一篇要處理一個 RNN 語言模型沒碰過的問題：**輸入和輸出的長度不一樣時，模型要怎麼設計？**

本文依據 [IKMLab 課程 repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing) 的投影片 [W3_Sequence-to-sequence Models and Attention Mechanisms.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Sequence-to-sequence%20Models%20and%20Attention%20Mechanisms.pdf)（33 頁）。在 [2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)上，它掛在 W3 那一列，錄影是 [W3 Tue](https://www.youtube.com/live/LFeFc0VtKRI) 與 [W3 Thu](https://www.youtube.com/live/UZ22K0rmU1g)。課表的 Topics 欄寫著「Introduction to NLP (Language model)」，那是課綱模板，實際內容以投影片為準。本篇只根據投影片撰寫，沒有逐段對照錄影。

## 問題：翻譯的長度對不上

投影片先講機器翻譯的地位：很多 NLP 語言模型的進展，最早都是為了解決翻譯問題。接著舉了幾個翻譯例子，其中一個是「來都來了」→「Since we're already here…」。

真正的問題在第 3 頁。同一句話在三種語言裡長度不同：

| 語言 | 句子 | token 數 |
|---|---|---|
| 英文 | Look over there | 3 |
| 中文 | 請看那邊 | 4 |
| 日文 | あそこを見てください | 12 |

分類任務的輸出長度是固定的，在 RNN 最後接一層 FFN 就能用。翻譯不行，輸出可能比輸入長，也可能比較短。投影片的結論是：hidden state 要負責把原始序列編碼起來，再交給生成的那一端。

## Encoder-decoder：先讀完，再開口

Seq2seq 模型的核心是把**變長的輸入序列**對應到**變長的輸出序列**。投影片列了三種應用：機器翻譯、文字摘要、對話生成。

用 RNN 生成序列的流程是：輸入一次餵一個元素、每一步更新 hidden state、每一步輸出一個元素，一直重複到指定長度，或生成出結束 token 為止。生成從一個特殊的起始 token 開始。

翻譯用的是 encoder-decoder 架構（第 10 頁，引自 [Jurafsky & Martin 的 SLP3](https://web.stanford.edu/~jurafsky/slp3/)），有三個部件：

1. **Encoder**：讀入輸入序列 x₁:ₙ，產生對應的上下文表示 h₁:ₙ。
2. **Context vector**：h₁:ₙ 的某個函數，負責把輸入的要點交給 decoder。最簡單的做法就是拿 encoder 最後一個 hidden state，所以它「包含了輸入的所有資訊」。
3. **Decoder**：以 context vector 為起點，生成任意長度的輸出。

「整句話壓進一個向量」這個設計，就是後面 attention 要修的地方。

## RNN 的梯度消失

第 11–14 頁用參數 W 推導反向傳播。每個時間步都用同一個 W，所以越早的輸入，梯度要乘上越多項。投影片的結論是：

- 這些項**小於 1**，梯度會指數衰減，這就是**梯度消失**。
- 這些項**大於 1**，梯度會快速暴增，這就是**梯度爆炸**。

梯度消失帶來三個後果：時間步一多，前面的重要資訊留不住；前面時間步的參數更新變慢甚至停住；生成長序列時表現差，可能前後不連貫。

## LSTM：用閘門決定記什麼、忘什麼

[LSTM](https://www.bioinf.jku.at/publications/older/2604.pdf) 就是為了解決 RNN 的梯度消失而提出的。除了 hidden state hₜ，它多了一條 cell state cₜ，並用幾個閘門控制資訊的進出：

| 部件 | 投影片的說法 |
|---|---|
| Forget gate | 用 sigmoid 決定過去記憶中哪些要忘掉 |
| Input gate | 用 sigmoid 決定哪些新資訊要寫進 cell state |
| Candidate memory | 用 tanh 產生可能寫入的新內容 |
| Output gate | 控制 cell state 裡的資訊有多少流到 hidden state |

第 21 頁用一句話解釋四個部件的語言學意義：「The cat chased the mouse, and then it climbed a tree.」

- 讀到「climbed a tree」時，**forget gate** 降低「chased the mouse」的重要性，因為焦點換到新動作了。
- 讀到「climbed」時，**input gate** 把「爬」這個新動作存進記憶。
- **Candidate memory** 編碼「climb + tree」的語意。
- 要產生「tree」時，**output gate** 從記憶中挑出「被爬的地點」拿來用。

LSTM 靠閘門和記憶單元，可以選擇性地保留或丟棄資訊，所以梯度流比較穩定，也比傳統 RNN 更能抓到長距離依賴。投影片的用詞是「partially avoid」，只能部分避免。

## RNN 家族剩下的兩個問題

第 23 頁把問題講明：

1. **梯度消失／爆炸**：LSTM 緩解了，但問題還在。
2. **難以平行化**：每一步都要等上一步的 hidden state，大資料集上的訓練效率受限，語言模型也就很難做大。

## Attention：每一步都回頭看整句

Attention 的核心想法是：**生成每個輸出時，讓模型聚焦在輸入中最相關的部分。**投影片把它分成兩階段。

### 第一階段：Attention 配 RNN

最早的 attention 是搭配 RNN 使用的，出處是 [Bahdanau, Cho & Bengio (2014)](https://arxiv.org/abs/1409.0473)。decoder 計算新的 hidden state sₜ 時，會拿它和所有輸入 token（由雙向 RNN 編碼）計算 attention 分數，再依分數把輸入加權加總。分數由一個 alignment model 算出，衡量「輸入位置 j 附近」和「輸出位置 i」有多匹配。

這等於不再只靠一個 context vector，decoder 每一步都能直接看到整句輸入。投影片第 27 頁放了論文裡的翻譯對齊圖。

### 第二階段：拿掉 RNN

第 28 頁列出拿掉 RNN 的兩個理由：RNN 的主要功能是抽取序列特徵，這件事可以用更簡單、計算量更低的方法做到；而且 RNN 無法平行化，擴展性受限。

不用 RNN 的 attention，是把輸入乘上三個可學的權重矩陣得到 Q、K、V，用 QᵀK 算出 N×N 的 attention 分數（N 是文字長度）。

### 為什麼要除以 √d

第 30–31 頁解釋縮放因子。假設 q 和 k 的每個分量都是平均 0、變異數 1 的隨機變數，兩者內積後變異數會變成 d。為了把變異數拉回 1，分數要除以 √d。

投影片的總結頁：

- RNN 是 NLP 任務的基本神經網路；LSTM 是它的修改版，用來緩解梯度問題。
- 搭配 RNN 的 attention 避開了梯度消失；不用 RNN 的 attention 可以平行化，也更簡單。

不用 RNN 的 attention 就是 Transformer 的核心，本系列在 [Transformer 與 Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers) 那篇會完整展開。

## 讀完可以做的事

1. **自己算一次變異數。** 用 NumPy 抽兩個 d = 64 的標準常態向量，算一萬次內積看變異數，再除以 8 看看。十行程式就能驗證第 31 頁的推導。
2. **把 LSTM 例句換成中文。** 拿「貓追老鼠，然後牠爬上一棵樹」逐字標出你認為每個閘門該做什麼，再和投影片第 21 頁對照。
3. **為下一篇暖身。** [HW2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) 要你用兩層 LSTM 學算術，這一篇的梯度消失，對應到那份作業報告裡「為什麼要 gradient clipping」那一題。

## 延伸閱讀

- 本系列上一篇：[HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy)
- 本系列下一篇：[PyTorch 助教課＋HW2 把算式當語言](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic)
- 英文課的同一段：[CS224N 導讀：RNN 與語言模型](/posts/ai/2026-08-22-cs224n-rnn-language-models)、[CMU 11-785：Language Models 與機器翻譯](/posts/ai/2026-08-22-cmu-11785-17-language-models-translation)、[CMU 11-785：Attention 與 Transformer](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers)
- 回到[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 參考資料

- [W3_Sequence-to-sequence Models and Attention Mechanisms.pdf（課程投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W3_Sequence-to-sequence%20Models%20and%20Attention%20Mechanisms.pdf)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [Fall 2025 W3 Tue 錄影](https://www.youtube.com/live/LFeFc0VtKRI)
- [Fall 2025 W3 Thu 錄影](https://www.youtube.com/live/UZ22K0rmU1g)
- [Bahdanau, Cho & Bengio (2014), Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473)
- [Jurafsky & Martin, Speech and Language Processing (3rd ed. draft)](https://web.stanford.edu/~jurafsky/slp3/)
- [Hochreiter & Schmidhuber (1997), Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf)
