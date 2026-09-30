---
title: "台大陳縕儂 ADL 2025 Fall 導讀：BERT 與它的家族——從多義詞問題到 XLNet、RoBERTa、mBERT"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, bert, pretraining, nlp]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 6
tldr: "靜態詞向量給 apple 只有一個向量，不管它是水果還是公司。ADL Fall 2025 的 BERT 講從這個多義詞問題出發：TagLM 先用語言模型補上下文，ELMo 用深層雙向 LSTM 產生 contextual embedding，BERT 把 LSTM 換成 Transformer，並用 Masked LM 與 Next Sentence Prediction 兩個目標預訓練，下游只要在最上層加分類器或標註器微調。彈性補充的 BERT Variants 講義再往外走一圈：Transformer-XL 拉長 context、XLNet 用 permutation LM 兼顧 AR 與 AE、RoBERTa 靠更多資料與更好的訓練設定、SpanBERT 改成遮整段 span、mBERT 與 XLM 處理多語。這篇是下一篇 HW1 用 bert-base-chinese 做抽取式 QA 的直接前置。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 6 篇導讀，依 250908_BERT.pdf（22 頁）與 BERT Variants 講義（f113 路徑，32 頁）、影片 5.2–5.6：多義詞問題、TagLM、ELMo、BERT 的 MLM／NSP／輸入表示／微調、ERNIE，以及 Transformer-XL、XLNet、RoBERTa、SpanBERT、Multilingual BERT、XLM。"
draft: false
glossary:
  - term: "Masked Language Model"
    aliases: ["MLM", "遮罩語言模型"]
    definition: "隨機把輸入裡一部分 token 遮起來，要模型用左右兩側的上下文把它猜回來的預訓練目標。"
    context: "ADL 講義寫 BERT 隨機遮 15% 的 token：太少訓練成本高，太多上下文不夠。"
  - term: "Permutation Language Model"
    aliases: ["排列語言模型"]
    definition: "XLNet 的預訓練目標：在所有可能的分解順序上做自回歸預測，只改變預測順序、不打亂位置編碼，讓自回歸模型也能看到雙向上下文。"
    context: "BERT Variants 講義第 15–16 頁。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)9/08 那一週的教材。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列第 6 篇。上一篇 [Tokenization 與 BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe) 講了 BERT 吃進去的 subword 從哪裡來，再上一篇 [Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer) 講了它的骨架。這一篇回答：**同一個詞在不同句子裡意思不同，怎麼讓模型給出「看上下文」的表示？**

用到的官方材料：

- 講義 [250908_BERT.pdf](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf)（22 頁，副標 Bidirectional Encoder Representations from Transformers）
- 彈性補充講義 BERT Variants。課程頁的連結 `f114-adl/doc/240918_BERTVariants.pdf` 在 2026-09-30 打開是 404，本文用的是同名檔 [f113-adl/doc/240918_BERTVariants.pdf](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)（32 頁，封面日期 2024/09/18）
- 影片：[5.2 BERT 進擊的芝麻街巨人](https://youtu.be/pSQM-HNHA64)（57:29）、[5.3 BERT Variants 效能更好的BERT家族](https://youtu.be/sqldA6AgV7s)（4:09）、[5.4 XLNet 兼顧AE與AR好處的BERT](https://youtu.be/Q-bIzFhVweA)（34:06）、[5.5 RoBERTa & SpanBERT 更多資料更好效能的BERT](https://youtu.be/u6USoD6mRR4)（22:20）、[5.6 Multilingual BERT & XLM 懂多國語言的BERT](https://youtu.be/NAFu7xQKbRE)（12:48）

存取等級沿用系列的 **A2**：本講的講義與影片都公開，但對應的作業 HW1 要在 Kaggle 與 NTU COOL 繳交，校外讀者只能照規格自己練（見[下一篇](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)）。

## 起點：詞向量不懂多義詞

講義第 3 頁用兩句話開場：「An apple a day, keeps the doctor away」和「Smartphone companies including apple, …」。兩個 apple 意思完全不同，但 word2vec、GloVe 這類詞向量給每個詞只有**一個**向量。問題有兩層：

- **多個詞義**（polysemy）：rock 可以是石頭，也可以是搖滾。
- **多個面向**：一個向量同時要裝語意和語法資訊。

解法的方向在第 4 頁就埋好了：[第 3 篇](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)的 RNN 語言模型在每個位置都會產生一個 hidden state，這個 hidden state 本來就是「看過前文」的詞表示。講義的註解是：這個 LM 在每個位置都產生 contextual word representation。

## 從 TagLM 到 ELMo：先把語言模型當特徵用

講義把這條路分兩步。

**TagLM（「Pre-ELMo」）**：[Peters 等人 2017](https://arxiv.org/abs/1705.00108) 先在大量未標註文字上訓練語言模型，再把 LM embedding 和一般的 word embedding 接在一起，餵給序列標註模型（例子是 NER：New York → B-LOC E-LOC）。講義點出這就是 self-supervised learning：標籤來自文字本身。

**ELMo**：[Peters 等人 2018](https://arxiv.org/abs/1802.05365) 把想法推深一層。講義第 6 頁列兩點：

1. 用長的上下文學詞向量，而不是固定大小的 context window。
2. 訓練一個深層 LM，下游預測時**所有層**都拿來用，而不是只拿最上層。

ELMo 和 BERT 都是芝麻街角色，這就是講義第 2 頁和影片副標「進擊的芝麻街巨人」的由來。

## BERT：把 LSTM 換成 Transformer

第 7 頁把 [BERT（Devlin 等人 2019）](https://arxiv.org/abs/1810.04805)的核心寫成一行：一樣是 contextualized word representation，一樣用長上下文學，但**用 Transformer 取代 LSTM**。這一步需要解決一個問題：Transformer encoder 的 self-attention 本來就能同時看左右，普通「預測下一個詞」的目標會讓模型直接偷看答案。BERT 用兩個新目標處理。

### 目標一：Masked Language Model

講義第 8 頁的動機是：「語言理解是雙向的，但語言模型只用左邊或右邊的上下文。」所以 BERT 不預測下一個詞，而是**隨機遮住 15% 的 token**，要模型用左右兩邊把它猜回來。為什麼是 15%，講義給的理由很實際：

- 遮太少：每個句子只貢獻很少的訓練訊號，訓練成本高。
- 遮太多：剩下的上下文不夠猜。

### 目標二：Next Sentence Prediction

第 10–11 頁：問答、自然語言推論（NLI）這類任務要理解**兩個句子之間**的關係，單句的 MLM 學不到。NSP 給模型兩個句子，要它判斷第二句是不是真的接在第一句後面。

### 輸入表示

第 12 頁：每個位置的輸入 embedding 是三個向量相加——

- token embedding（詞層級，也就是上一篇 BPE／WordPiece 切出來的單位）
- segment embedding（句子層級，標示這個 token 屬於第一句還是第二句）
- position embedding

### 訓練資料與兩個尺寸

第 13 頁：訓練資料是 Wikipedia 加 BookCorpus；兩個模型分別是 BERT-Base（12 層、768 維 hidden、12 個 head）與 BERT-Large（24 層、1024 維、16 個 head）。

## 微調：在最上層加一個分類器就好

第 14 頁的想法很簡單：**對每個下游任務，只在最上層學一個分類器或標註器**，整個 BERT 一起微調。句子分類用 `[CLS]` 位置，序列標註用每個 token 的輸出，抽取式問答則在 paragraph 的每個 token 上預測答案的起點和終點——這正是 HW1 span selection 要做的事。

講義用幾頁結果說明這套做法有效：

- 第 16 頁是原論文的 GLUE 結果圖。
- 第 17 頁是 CoNLL 2003 NER 的比較表，從 TagLM、ELMo 一路列到 BERT-Base、BERT-Large 和 Flair。
- 第 18 頁：模型越大表現越好——這個觀察會在[第 8 篇](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)的 scaling laws 回來。

另一條用法在第 19–20 頁：不微調，只把預訓練 BERT 當成 contextual embedding 抽取器，把各層輸出餵給任務專用模型，也就是 ELMo 式的 feature-based 用法。

## 中文要特別注意的：ERNIE

第 21 頁對中文讀者特別有用。BERT 建模的是 token 之間的局部共現，但中文字是**各自獨立**被遮的：「哈爾濱」會被拆成哈、爾、濱三個字分別處理。[ERNIE（Baidu，2019）](https://arxiv.org/abs/1904.09223)改成遮整個語意單位或實體，把知識帶進預訓練。做 HW1 時，這是「換一個中文預訓練模型試試看」的一個理由（HW1 報告 Q2 正好要求換另一種預訓練模型做比較）。

講義最後一頁給了兩個起點：[google-research/bert](https://github.com/google-research/bert) 與 [huggingface/transformers](https://github.com/huggingface/transformers)。

## 彈性補充：BERT 家族

這部分在課程頁 9/08 下方的「彈性補充」列，講義是 Fall 2024 的 BERT Variants，影片是 5.3–5.6。講義第 3 頁把家族分成兩個方向：**效能更好**（RoBERTa、SpanBERT、XLNet）與**多語**（Multilingual BERT、XLM）。

### Transformer-XL：先解決 context 太短

講義第 4–10 頁先講 [Transformer-XL（Dai 等人 2019）](https://arxiv.org/abs/1901.02860)，這段沒有獨立影片。問題是 context fragmentation：Transformer 只能處理固定長度的片段，超過長度的依賴學不到，切片也不管句子邊界。解法有兩個：

- **segment-level recurrence**：上一段的 hidden state 固定住、快取起來，下一段直接拿來用，最長依賴長度變成原本的 N 倍（N 是網路深度）。
- **相對位置編碼**：重複使用上一段的狀態時，絕對位置會變成 `[0,1,2,3,0,1,2,3]`，對不上，所以改用相對位置。

### XLNet：兼顧 AR 與 AE

[XLNet（Yang 等人 2019）](https://arxiv.org/abs/1906.08237)是影片 5.4 的主題。講義先把預訓練分成兩派：

- **自回歸（AR）**：像 GPT，依前文或後文逐字預測。
- **自編碼（AE）**：像 BERT 的 MLM，從被破壞的輸入重建原文。

AE 的兩個問題在第 14 頁：

1. **獨立假設**：同一句遮了兩個字，BERT 把它們當成彼此獨立來預測。
2. **輸入雜訊**：預訓練時有 `[MASK]`，微調時沒有，兩邊不一致。

XLNet 的 permutation language model 在所有可能的分解順序上做 AR 預測（長度 T 的序列有 T! 種順序）。實作上**只換預測順序、不動位置編碼**，靠 Transformer 的 attention mask 做到。模型得知道「要預測哪個位置」，又不能看到那個位置的內容，所以再加上 two-stream self-attention（content stream 與 query stream）。第 19 頁的總結：AR 解決獨立假設，不用 `[MASK]` 則解決預訓練和微調的落差。

### RoBERTa 與 SpanBERT：訓練得更好、遮得更聰明

[RoBERTa（Liu 等人 2019）](https://arxiv.org/abs/1907.11692)沒改架構，改的是訓練方式（講義第 21–22 頁）：

- **動態遮罩**：40 個 epoch 裡用 10 種不同的遮法；BERT 是在前處理時就固定遮好。
- **最佳化**：peak learning rate 和 warmup 步數分開調，batch size 加到 8K。
- **資料**：只用完整長度的序列訓練，資料從 BookCorpus＋英文 Wikipedia（16G）再加上 CC-News、OpenWebText、Stories。

[SpanBERT（Joshi 等人 2019）](https://arxiv.org/abs/1907.10529)改的是目標（第 25 頁）：

- **span masking**：隨機遮連續的一段 token，而不是零散的單字。
- **單句訓練**：每個樣本只放一段連續文字，不再拼兩句（也就是拿掉 NSP）。
- **span boundary objective**：只用 span 兩端邊界的表示去預測整段被遮的內容。

講義總結說 SpanBERT 對 QA、NLI、共指消解特別有幫助。對 HW1 這種「答案是一段 span」的任務，這個方向值得記住。

### Multilingual BERT 與 XLM：一個模型懂多國語言

- **Multilingual BERT**：用前 104 種語言的 Wikipedia 訓練。講義第 28 頁用《名偵探柯南》中英文 Wikipedia 條目並列說明：文章裡本來就夾雜其他語言的原文（code-mixing），這有助於把不同語言的詞對齊。
- **XLM**：[Lample 與 Conneau 2019](https://arxiv.org/abs/1901.07291)在 masked LM 之外加上 translation LM，講義結尾標註它適合 zero-shot 情境；第 31 頁是跨語言分類的結果。

## 讀完這篇能做什麼

- 說出靜態詞向量為什麼處理不了多義詞，ELMo 和 BERT 各用什麼方式補上。
- 解釋 BERT 的 MLM、NSP 和三種輸入 embedding，以及「最上層加分類器」的微調方式。
- 看到 RoBERTa、SpanBERT、XLNet、mBERT 時，知道它們分別改了訓練設定、遮罩目標、預訓練範式還是語言覆蓋。

**怎麼做**：打開 [HuggingFace Model Hub 的中文模型搜尋](https://huggingface.co/models?search=chinese)（這是 HW1 投影片給的連結），挑 `bert-base-chinese` 和一個 RoBERTa 或 whole-word-masking 系列的中文模型，對照這篇的家族分類，寫下它們各自改了哪一項。下一篇 HW1 的報告 Q2 就要你做這個比較。

## 本文能確認與不能確認的

能確認：BERT 講義 22 頁與 BERT Variants 講義 32 頁的每頁標題與列點、影片標題與長度（播放清單與 YouTube oEmbed 核對）、上面每篇論文的標題（arXiv 核對）。

不能確認：本文沒有逐字聽寫影片，老師口頭補充的例子與評論沒有寫進來。BERT Variants 講義是 Fall 2024 版本，課程頁 Fall 2025 的連結失效；影片 5.3–5.6 是否全為 2025 年重錄，播放清單沒有標示。講義裡的結果圖表（GLUE、NER）只轉述標題與比較對象，數字請以原論文為準。

延伸閱讀：站上 [CS224N 第 7 講：預訓練](/posts/ai/2026-08-22-cs224n-pretraining)從另一個角度講 encoder／decoder／encoder-decoder 三種預訓練；[CS224U 的 contextual representation 模型家族](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)也整理了 BERT、RoBERTa、ELECTRA 等模型。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [Tokenization 與 BPE](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe)｜下一篇 [HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [250908_BERT.pdf（BERT: Bidirectional Encoder Representations from Transformers）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf)
- [240918_BERTVariants.pdf（BERT Variants，f113 路徑）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- 影片：[5.2 BERT](https://youtu.be/pSQM-HNHA64)、[5.3 BERT Variants](https://youtu.be/sqldA6AgV7s)、[5.4 XLNet](https://youtu.be/Q-bIzFhVweA)、[5.5 RoBERTa & SpanBERT](https://youtu.be/u6USoD6mRR4)、[5.6 Multilingual BERT & XLM](https://youtu.be/NAFu7xQKbRE)
- [BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding（arXiv 1810.04805）](https://arxiv.org/abs/1810.04805)
- [Deep contextualized word representations（ELMo，arXiv 1802.05365）](https://arxiv.org/abs/1802.05365)
- [Semi-supervised sequence tagging with bidirectional language models（TagLM，arXiv 1705.00108）](https://arxiv.org/abs/1705.00108)
- [ERNIE: Enhanced Representation through Knowledge Integration（arXiv 1904.09223）](https://arxiv.org/abs/1904.09223)
- [Transformer-XL（arXiv 1901.02860）](https://arxiv.org/abs/1901.02860)
- [XLNet（arXiv 1906.08237）](https://arxiv.org/abs/1906.08237)
- [RoBERTa（arXiv 1907.11692）](https://arxiv.org/abs/1907.11692)
- [SpanBERT（arXiv 1907.10529）](https://arxiv.org/abs/1907.10529)
- [Cross-lingual Language Model Pretraining（XLM，arXiv 1901.07291）](https://arxiv.org/abs/1901.07291)
- [google-research/bert](https://github.com/google-research/bert)
