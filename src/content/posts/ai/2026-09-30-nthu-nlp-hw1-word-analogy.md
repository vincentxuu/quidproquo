---
title: "清大 NLP HW1：用 Google Analogy 考詞向量——預訓練 GloVe 對上自己用 20% Wikipedia 訓練的 Word2Vec"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, homework, word2vec, embedding]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 3
tldr: "HW1 拿 Google Analogy 的 19,544 題（8,869 題語意、10,675 題語法）考詞向量：先用 Gensim 載入預訓練的 glove-wiki-gigaword-100 作答，再從助教清理好的 Wikipedia 抽 20% 文章自己訓練 Word2Vec，兩邊都畫 family 子類的 t-SNE。七個 TODO 共 55%，報告 45%；Fall 2026 的 TODO 和 2025 相同，只是改成繳交含執行結果的 .ipynb。"
description: "清大高宏宇《自然語言處理》Fall 2025 作業一導讀：Word Analogy 是什麼、Google Analogy 資料集的組成、main.ipynb 的三個部分與 TODO1–7 配分、報告題目、繳交規則，以及 Fall 2026 版的差異。"
draft: false
glossary:
  - term: "word analogy"
    aliases: ["詞類比", "analogy task"]
    definition: "給定 A、B、C 三個詞，問「A 之於 B，如同 C 之於什麼」。用詞向量作答時，取最接近 B − A + C 的詞。"
    context: "HW1 用它評估詞向量有沒有學到語意與語法關係。"
  - term: "t-SNE"
    aliases: ["t-distributed stochastic neighbor embedding"]
    definition: "把高維向量壓到二維或三維的視覺化方法，盡量讓原本相近的點在圖上也靠在一起。"
    context: "HW1 的 TODO3 與 TODO7 用它畫 family 子類詞彙的分布。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列第 3 篇，接在[詞向量與語言模型](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)之後。上一篇講詞向量怎麼訓練出來；這一篇把它拿去考試：**詞向量真的學到了「king 之於 queen，如同 man 之於 woman」嗎？自己訓練的會比預訓練的差多少？**

本文依據 [IKMLab 課程 repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing) 裡 Fall 2025 的 [Assignment 1 資料夾](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment1)：題目說明 [NLP_HW1_word_emb.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/NLP_HW1_word_emb.pdf)、起始碼 [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb)、處理好的 `questions-words.csv`，以及助教的[說明影片](https://youtu.be/nCS3GpHwqr8)（影片標題是「Week 2 Thu. - Assignment 1」，在 [2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)掛在 W2 那一列）。這份作業的存取等級是 **A3**：題目、起始碼、資料都公開，缺的是解答與評分腳本，那些在 NTU COOL 上，校外讀者拿不到。

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=nCS3GpHwqr8
title: 2025 HW1 說明影片
```

原始影片：[2025 HW1 說明影片](https://www.youtube.com/watch?v=nCS3GpHwqr8)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 作業在考什麼

題目 PDF 對 analogy 的說法是：「A is to B as C is to D」。拿詞向量作答，就是算 B − A + C，再找離這個向量最近的詞，看它是不是 D。

投影片第 2 頁寫成「King + Queen − Man ≈ Woman」，這個式子是筆誤。起始碼的提示才是正確版本：`word_b + word_c - word_a should be close to word_d`。拿 `king queen man woman` 這題來說，就是 queen − king + man ≈ woman。

資料集是 [Google Word Analogy](https://arxiv.org/abs/1301.3781)（Mikolov et al., 2013）。repo 附的 `questions-words.csv` 我實際數過：

| 類別 | 子類數 | 題數 | 例子 |
|---|---|---|---|
| Semantic（語意） | 5 | 8,869 | family：`king queen man woman` |
| Syntactic（語法） | 9 | 10,675 | gram1-adjective-to-adverb：`infrequent infrequently cheerful cheerfully` |
| 合計 | 14 | 19,544 | |

子類的題數差很多：capital-world 有 4,524 題，family 只有 506 題。之後比較「哪一類答得好」時，要記得各類的樣本數不同。

## 起始碼的三個部分

作業在 [Colab](https://colab.research.google.com/) 上做，`main.ipynb` 分三段。

**Part I：資料前處理。** 用 `wget` 下載原始的 `questions-words.txt`，每行四個詞；以 `: ` 開頭的行是子類標題。notebook 註解提醒：前五個標題屬於 semantic，後九個屬於 syntactic。TODO1 要把它整理成有 `Question`、`Category`、`SubCategory` 三欄的 DataFrame。助教直接提供了處理好的 CSV，但 PDF 寫明 TODO1 的程式還是要自己寫。

**Part II：預訓練詞向量。** 用 [Gensim](https://radimrehurek.com/gensim/) 的 downloader 載入 `glove-wiki-gigaword-100`，註解說也可以換成 [Gensim 列出的其他預訓練模型](https://radimrehurek.com/gensim/models/word2vec.html#pretrained-models)。TODO2 逐題算預測、保留正解；接下來的評估區塊已經寫好，會分別印出兩大類與 14 個子類的準確率（預測詞和正解完全相同才算對）。TODO3 則是把 family 子類出現的詞畫成 t-SNE 圖。

**Part III：自己訓練詞向量。** 原始的 [Wikipedia dump](https://dumps.wikimedia.org/) 下載很久，用 Gensim 的 [`WikiCorpus`](https://radimrehurek.com/gensim/corpora/wikicorpus.html) 清理更久，所以助教先清好了，切成 11 個 `.txt.gz` 檔，用 `gdown` 下載。notebook 註解說每個檔有 562,365 行，一行是一篇文章（最後一個檔除外）。清理時用的是 `WikiCorpus` 的預設參數，所以單一字元的詞都被丟掉了。

接著：

- TODO4：抽樣 20% 的文章。
- TODO5：用抽出來的文章訓練自己的 [Word2Vec](https://radimrehurek.com/gensim/models/word2vec.html)。
- TODO6、TODO7：和 TODO2、TODO3 一樣，換成自己的模型再答一次題、再畫一次 t-SNE。

PDF 第 28 頁列出建議的前處理：去掉非英文詞、去停用詞、lemmatization（rocks → rock）、比空白切分更好的 tokenization、字典只留高頻詞。同一頁也提醒，這些技巧不一定都會讓分數變好，要自己試。

## 配分

程式 55%，七個 TODO 的配分如下：

| TODO | 內容 | 配分 |
|---|---|---|
| 1 | 類比資料轉成 DataFrame | 5% |
| 2 | 用預訓練詞向量作答 | 10% |
| 3 | 預訓練詞向量的 family t-SNE | 5% |
| 4 | 抽樣 20% Wikipedia 文章 | 5% |
| 5 | 用抽樣文章訓練自己的詞向量 | 10% |
| 6 | 用自己的詞向量作答 | 10% |
| 7 | 自己詞向量的 family t-SNE | 10% |

報告 45%，題目如下：

- 用了哪個 embedding 模型、做了哪些前處理、超參數怎麼設（5%）
- TODO4 改抽 5%、10%、20% 時表現如何（10%）
- 換一個語料訓練，各類別或子類的表現有何不同（15%）：呈現結果、介紹你選的語料並說明它和 Wikipedia 在資料量、主題、結構上的差異、解釋表現為何變好或變差，各 5%
- 挑幾個詞，找出各自最相近的五個詞，你觀察到什麼（10%）
- 其他能強化報告的內容（5%）

第二題的價值在於它逼你畫出「語料量 vs. 準確率」的曲線。第三題則要你離開 Wikipedia，自己找一份語料。

## 繳交規則

2025 版要交三個檔案，壓成一個 zip 上傳到 NTU COOL：

- 程式：從 Colab 下載的 `.py`，檔名 `NLP_HW1_學校_學號.py`
- 套件清單：`requirements.txt`（例子是 `gensim==4.3.3`）
- 報告：照模板寫的 `.docx`

報告裡要寫執行環境與 Python 版本。用了生成式 AI，程式註解和報告裡都要註明；參考網路上的程式要附連結。檔名、缺 `requirements.txt`、改動程式模板（只允許改資料載入的部分）等違規各扣 5 分；程式或報告和其他同學高度相似，雙方各扣 100 分。作業期限是三週。

## Fall 2026 版改了什麼

[2026 作業頁](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)目前只放出 HW1，說明影片換成[新的一支](https://youtu.be/4nktsdfU24k)。我把 [2026 版 PDF](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/Assignment1/NLP_HW1_word_emb.pdf) 和 2025 版逐行比對，也比對了兩份 notebook：

- **題目相同**：TODO1–7 的內容與配分、資料集、預訓練模型、Wikipedia 檔案都沒變。
- **繳交格式改了**：程式改交 `.ipynb`，而且要保留執行結果（20% 版本的 Wikipedia），沒有輸出就拿不到任何實驗結果或圖表相關的分數。報告不再用 Word，直接寫在 notebook 的報告區塊。
- **報告題目微調**：換語料那題寫明「except wiki」，而且額外實驗的程式要放在 notebook 裡，否則該題 0 分。找相近詞那題改成至少挑五個詞。另外新增「Generative AI Usage」一欄，沒寫要扣 10 分。

所以拿 2025 的資料自學，和 2026 修課生做的是同一份作業。

## 動手前的建議

1. **先把 Part II 跑完再碰 Wikipedia。** Part II 只需要下載 GloVe，幾分鐘就有第一組各類準確率。這組數字是後面所有比較的基準線。
2. **TODO4 先用 5% 走完整條流程。** 報告本來就要 5%、10%、20% 三個點，從小的開始可以先抓出前處理的 bug，不用每次等 20% 訓練完。
3. **注意 OOV。** GloVe 的詞表和你自己訓練的詞表不同。題目裡有詞不在詞表中時，你的程式要怎麼處理，會直接影響準確率，報告裡要講清楚。
4. **t-SNE 圖要看「關係」而不是「群聚」。** family 子類的題目都是 king/queen、man/woman 這種配對，好的詞向量會讓配對之間的位移方向接近。

## 延伸閱讀

- 本系列上一篇：[詞向量與語言模型（n-gram → RNN）](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)
- 本系列下一篇：[Seq2seq、LSTM 與 Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention)
- 同主題的英文課：[CS224N 導讀：Word Vectors](/posts/ai/2026-08-22-cs224n-word-vectors)
- 回到[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 Assignments 總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [2025 HW1 題目說明 NLP_HW1_word_emb.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/NLP_HW1_word_emb.pdf)
- [2025 HW1 起始碼 main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb)
- [2025 HW1 說明影片](https://youtu.be/nCS3GpHwqr8)
- [2026 HW1 題目說明](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/Assignment1/NLP_HW1_word_emb.pdf)
- [2026 HW1 說明影片](https://youtu.be/4nktsdfU24k)
- [Mikolov et al., 2013, Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781)
- [Gensim Word2Vec 文件與預訓練模型清單](https://radimrehurek.com/gensim/models/word2vec.html)
- [Gensim WikiCorpus 文件](https://radimrehurek.com/gensim/corpora/wikicorpus.html)
