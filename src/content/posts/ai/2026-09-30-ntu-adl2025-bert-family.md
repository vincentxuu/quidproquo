---
title: "Tokenization 與 BERT：詞怎麼切、怎麼得到看上下文的表示｜台大陳縕儂 深度學習之應用 第 5 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, nlp, tokenization, bpe, bert, pretraining]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 導讀"
  order: 5
tldr: "這一堂有兩半。前半講 tokenization：用整個詞當單位，沒看過的詞只能變成 UNK；用字元當單位，意思又組不回來。折衷是 subword，常用的切法是 BPE：從字元開始，反覆把最常相鄰的一對合併。後半講 BERT：靜態詞向量給 apple 只有一個向量，分不出水果和公司。ELMo 用語言模型產生看上下文的表示，BERT 把 LSTM 換成 Transformer，用遮住 15% token 再填回來的 masked LM 與 next sentence prediction 預訓練，再把整個模型微調到下游任務。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 5 堂導讀，依 Tokenization 與 BERT 兩份講義及影片 5.1、5.2 的課堂口述：UNK 問題、subword、BPE 三步驟與逐步合併、多語 BPE 對中文的 token 成本；多義詞問題、TagLM 與 ELMo、BERT 的 masked LM、next sentence prediction、輸入表示、fine-tuning 與 feature-based 的比較、ERNIE，以及彈性補充的 BERT 家族對照表。附 BPE 與 BERT 輸入的例子和自我檢查。"
draft: false
glossary:
  - term: "BPE"
    aliases: ["Byte-Pair Encoding", "位元組對編碼"]
    definition: "一種定義 subword 詞彙表的方法：從只有字元與詞尾符號的詞彙表開始，反覆找出語料中最常相鄰出現的一對單位、合併成新單位加入詞彙表，直到詞彙表達到想要的大小。合併的順序記下來，就是之後切新文字的規則。"
    context: "ADL Tokenization 投影片第 5–19 頁用 low、lower、newest、widest 四個詞的小語料逐步示範。"
  - term: "subword"
    aliases: ["子詞", "次詞單位"]
    definition: "介於整個詞與單一字元之間的切分單位。常見詞保持完整，罕見詞拆成幾個較常見的片段，所以詞彙表大小可控，也不太會遇到完全沒見過的輸入。"
    context: "ADL Tokenization 投影片第 4 頁稱它為 dominant modern paradigm，是詞與字元之間的平衡。"
  - term: "Masked Language Model"
    aliases: ["MLM", "遮罩語言模型"]
    definition: "隨機把輸入裡一部分 token 遮起來，要模型用左右兩側的上下文把它猜回來的預訓練目標。"
    context: "ADL 講義寫 BERT 隨機遮 15% 的 token：太少訓練成本高，太多上下文不夠。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-bert-family-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 5 堂，依據 ADL Fall 2025（114-1，2025/09/01–12/15）9/08 那一週的教材。[上一堂](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)講了 Transformer 的骨架。這一堂接著回答兩個問題：**文字要先切成什麼單位才丟進模型？同一個詞在不同句子裡意思不同，模型怎麼給出不同的表示？**

官方材料：

- [Tokenization 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf)（22 頁）與影片 [5.1 BPE Tokenization](https://youtu.be/NrT5kmnTFCk)（33:37）
- [BERT 投影片](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf)（22 頁）與影片 [5.2 BERT 進擊的芝麻街巨人](https://youtu.be/pSQM-HNHA64)（57:29）
- 彈性補充：BERT Variants 投影片與影片 5.3–5.6，見文末的對照表

5.1 與 5.2 都是 2023 年 10 月上傳的錄影，沒有字幕，本文用音訊轉成的逐字稿整理課堂口述。標成「本文自編」的例子不是課堂內容。

讀完要能做四件事：對一個小語料手動做 BPE 合併，並用合併規則切一個沒看過的詞；說出靜態詞向量處理不了什麼、ELMo 和 BERT 各怎麼補；畫出 BERT 預訓練時的輸入長什麼樣子、兩個目標各預測什麼；分清楚 fine-tuning 和只拿向量來用的差別。

## 前半：Tokenization 與 BPE

### 沒看過的詞怎麼辦

傳統的做法是把訓練資料裡出現過的詞都放進詞彙表，一個詞一個向量。測試時遇到詞彙表外的詞，只能全部換成同一個 UNK，共用一個沒有意義的向量。投影片第 2 頁舉了三種：

- 變體：taaaaasty
- 拼錯：laern
- 新詞：Transformerify

這些詞模型處理不了，人卻可以。老師拿 tokenization 這個詞本身當例子：就算第一次看到它，你認得 token；加上 -ize 變成動詞，「使它變成 token」；再加 -ation 變回名詞。靠著這些片段，沒看過的詞也猜得出大意。

第 3 頁補上語言學的角度：有些語言的詞形變化非常多。投影片的例子是 Swahili，一個動詞字根可以變出上百種形式，各自帶著人稱、時態等資訊。用整個詞當單位，這類語言的詞彙表會大到不實際，還是有一堆沒看過的詞。

### 切多細

| 單位 | 好處 | 壞處 |
|---|---|---|
| 整個詞 | 每個單位都有完整的意思 | 詞彙表很大，仍然會遇到沒看過的詞 |
| 字元 | 英文只有 26 個字母，不會有沒看過的單位 | 意思要好幾個字元合起來才有。老師的例子：u 和 n 分開看，學不到 un- 是否定 |
| Subword | 兩者的折衷，是現在的主流（第 4 頁） | 要決定片段怎麼切 |

### BPE：三個步驟

BPE 原本是一種壓縮演算法（第 5 頁）。老師說它和 byte 其實沒什麼關係，借的是同一個想法：常一起出現的東西，合起來當成一個單位。

1. 詞彙表從語料裡出現過的所有字元開始，再加一個詞尾符號 `</w>`。
2. 找出語料裡最常相鄰出現的一對單位，把它們合起來，加進詞彙表。
3. 把語料裡所有這一對都換成新單位。回到第 2 步，直到詞彙表達到想要的大小。

把 BPE 用在神經機器翻譯的論文是 [Sennrich et al. 2016](https://arxiv.org/abs/1508.07909)，投影片沒有列出處。

### 逐步示範

第 6–16 頁用四個詞示範，後面是出現次數：

```
l o w </w>        : 5
l o w e r </w>    : 2
n e w e s t </w>  : 6
w i d e s t </w>  : 3
```

起始詞彙表是 `</w> d e i l n o r s t w`，共 11 個。

**第一次合併。** 數每一對相鄰單位的次數：`e s` 出現在 newest（6）與 widest（3），共 9 次；`s t` 和 `t </w>` 也是 9 次（投影片只標出 `e s` 與 `t </w>` 兩組）；`l o` 是 7 次。9 次並列最高，任選一個。投影片選了 `es`。

**之後每一步都一樣**：數次數、合併最高的一對、改寫語料。九次合併依序是：

```
1. e + s        → es
2. es + t       → est
3. est + </w>   → est</w>
4. l + o        → lo
5. lo + w       → low
6. n + e        → ne
7. ne + w       → new
8. new + est</w> → newest</w>
9. low + </w>   → low</w>
```

做到這裡詞彙表有 20 個單位，示範就停在這裡。最後的語料是 `low</w>`、`low e r </w>`、`newest</w>`、`w i d est</w>`。

老師點出兩件事。第一，詞彙表裡除了片段，也有完整的詞，例如 `newest</w>`：一個詞出現得夠多，就會整個被合起來。第二，詞彙表不可能大到放進所有片段，所以優先放最常見的。

第 3 步把 `est` 和 `</w>` 合在一起，代表「est 出現在詞尾」被當成一個單位。同一串字母在詞中和詞尾是不同的單位，這是 `</w>` 的作用。

### 用合併規則切新詞

九條合併規則依序記下來，就是切字的規則：把新詞拆成字元，照順序把規則套一遍（第 17–19 頁）。

- **lowest** → `low` `est</w>`。語料裡沒有這個詞，但兩個片段都在詞彙表裡。第 9 條不適用，因為這裡的 low 後面不是 `</w>`。
- **powest**（老師隨手編的詞）→ `<unk>` `o` `w` `est</w>`。p 不在起始詞彙表裡，只能是未知；`o w` 前面沒有 l，合不成 low。雖然不知道前半是什麼，至少看得出它帶著 -est。

第二個例子也說明 BPE 的極限：起始詞彙表沒有的字元，還是會變成未知符號。

BPE 合出來的常見片段常常就是詞素（第 20 頁），也就是語言裡最小的有意義單位，例如 -er、-est。unlikeliest 可以看成 un-、likely、-est 三個詞素。老師希望合併停在這種「最小而有意義」的大小：只合到 `wo` 沒有意義；合到整個詞，又回到沒看過的詞的問題。

### 多語 BPE：中文比較貴

第 21 頁是 OpenAI tokenizer 的結果，用的是 GPT-3 的 tokenizer：

| 句子 | 字元數 | Token 數 |
|---|---|---|
| Working on NLP is fun, but tokenization is not fun. | 51 | 14 |
| 做NLP工作很有趣，但tokenization不有趣。 | 27 | 29 |

英文那句，Working 是一個 token，因為它夠常見，整個被合起來了；NLP 切成 N 和 LP；tokenization 切成 token 和 ization。中文那句字元少了將近一半，token 卻多了一倍。老師指出「做」這一個字就被切成三個 token。

原因是這個模型要處理所有語言，沒有為每種語言各自設計切法。老師的說明是：它把每個字都轉成編碼，一律當成一串符號去做 BPE。

> 補充：更精確地說，這類 tokenizer 是在 UTF-8 的位元組上做 BPE。一個常用中文字佔三個位元組，如果沒有被合併，就是三個 token。

後果有兩個。訓練時，同樣的內容切出來的 token 越多，成本越高。生成時，可能要連續產生三個 token 才湊出一個中文字。老師的看法是：應用場景以中文為主時，為中文設計 tokenization 是值得做的事。

實務上，用預訓練模型就要用它自己的詞彙表；從頭訓練才能自己決定怎麼切。

## 後半：BERT

### 一個詞一個向量的問題

第 3 頁的兩個句子：「An apple a day keeps the doctor away」和「Smartphone companies including apple …」。兩個 apple 意思不同，靜態詞向量卻只給一個向量。老師說明後果：第一句裡 apple 接近 orange，第二句裡接近 Microsoft，共用一個向量，等於把 orange 和 Microsoft 也拉近了。rock 是石頭也是搖滾，同樣的問題。

除了一詞多義，同一個詞還可以是不同詞性。不看上下文，一個向量裝不下這些。

解法的線索在[第 3 堂](/posts/ai/2026-09-30-ntu-adl2025-sequence-modeling-rnn)就有了（第 4 頁）：RNN 語言模型讀一個句子時，每個位置都產生一個向量，而且這個向量已經看過前文。同一個詞放在不同句子裡，得到的向量自然不同。這叫 contextualized word representation。

### TagLM 與 ELMo

- **TagLM**（[Peters 等人 2017](https://arxiv.org/abs/1705.00108)，第 5 頁）：先在大量沒有標註的文字上訓練語言模型，再把它產生的向量和一般的詞向量接在一起，拿去做 NER。標籤是從文字本身造出來的（下一個詞），所以叫 self-supervised learning。
- **ELMo**（[Peters 等人 2018](https://arxiv.org/abs/1802.05365)，第 6 頁）：同一組人隔年的版本，全名是 Embeddings from Language Models。用多層的 LSTM 訓練語言模型，下游任務把每一層的向量都拿來用。

BERT 和 ELMo 都是芝麻街的角色。老師說 Bert 在劇中是 Elmo 的好朋友，她自己也是讀完論文一陣子後才發現這個名字的由來。預訓練這個概念不是 BERT 提出的，BERT 做的是把它發揚光大。

### BERT：把 LSTM 換成 Transformer

[BERT](https://arxiv.org/abs/1810.04805)（第 7 頁）的目標和 ELMo 一樣，差別是用 Transformer 的 encoder 取代 LSTM。它只用了 Transformer 的 encoder 那一半。

**目標一：masked language model**（第 8 頁）。ELMo 的正向和反向是分開的兩個模型，每個模型訓練時只看得到一邊。BERT 想同時用左右兩邊，做法是隨機遮掉 15% 的 token，要模型把它們填回來。在被遮的位置，模型對整個詞彙表輸出機率分布，要讓正確那個 token 的機率最高。

為什麼是 15%：

- 遮太少，一個句子只練到很少的位置，要更多資料才學得完，訓練成本高。
- 遮太多，剩下的上下文不夠，填不出來。

老師補充，這個數字沒有理論根據，是論文試了幾個比例之後選的。

三個模型的差別：

| 模型 | 預測什麼 | 能看哪一邊 |
|---|---|---|
| ELMo | 下一個詞、上一個詞，各一個 LSTM | 每個模型只看一邊，用的時候把兩邊的向量一起拿來用 |
| GPT | 下一個詞 | 只看左邊 |
| BERT | 被遮住的詞 | 兩邊都看 |

**目標二：next sentence prediction**（第 10–11 頁）。問答這類任務要理解兩段文字之間的關係，只練單句學不到。做法是每次放兩個句子進去，要模型判斷第二句是不是原文裡真的接在第一句後面。這種資料不用標註就能大量產生：真的相鄰的兩句標成 IsNext，隨便抓一句來配的標成 NotNext。

講義的例子：

- 「the man went to the store」＋「he bought a gallon of milk」→ IsNext
- 「the man went to the store」＋「penguins are flightless birds」→ NotNext

### 輸入長什麼樣子

第 12 頁。兩個句子用 `[SEP]` 隔開，最前面加一個 `[CLS]`。每個位置的輸入是三個向量相加：

| | [CLS] | my | dog | is | cute | [SEP] | he | likes | play | ##ing | [SEP] |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Token | [CLS] | my | dog | is | cute | [SEP] | he | likes | play | ##ing | [SEP] |
| Segment | A | A | A | A | A | A | B | B | B | B | B |
| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

- Token embedding：切成 subword 之後的單位，playing 被切成 play 和 ##ing，接上前半堂的內容。
- Segment embedding：標示這個 token 屬於第一句還是第二句。
- Position embedding：Transformer 需要另外知道位置。

`[CLS]` 位置輸出的向量用來做 next sentence prediction，接一層全連接層做二元分類。被遮住的每個位置各自預測原本的 token，這些位置共用同一組輸出層。

**算一下（本文自編）。** 上面這個輸入有 11 個位置。照 15% 的比例，大約會遮 1 到 2 個。假設遮掉 dog 和 likes，模型要在這兩個位置各做一次「從整個詞彙表裡選一個」的預測，同時在 `[CLS]` 做一次「是不是下一句」的預測。一筆沒有標註的資料，就產生了三個訓練訊號。

### 訓練資料與兩個尺寸

第 13 頁：資料是 Wikipedia 加 BookCorpus。

| | 層數 | Hidden 維度 | Head 數 |
|---|---|---|---|
| BERT-Base | 12 | 768 | 12 |
| BERT-Large | 24 | 1024 | 16 |

預訓練很花資源，所以論文把訓練好的模型放出來給大家用。老師說 Large 表現比較好，但機器或使用情境有限制時，Base 在很多場合就夠了。

### Fine-tuning：拿整個模型來調

老師說這是 BERT 另一個特別的地方（第 14 頁）。ELMo 的用法是把向量拿出來，另外訓練一個任務模型。BERT 的做法是不另外訓練模型：把任務的資料丟進預訓練好的 BERT，最上面接一層簡單的輸出，用任務的標註資料算 loss，**整個模型的權重一起微調**。預訓練的權重是一個很好的起點，所以不需要太多資料。

四類任務的接法：

| 任務 | 輸入 | 輸出接在哪裡 |
|---|---|---|
| 兩句的關係（例如 NLI） | 兩個句子 | `[CLS]` 的向量做分類 |
| 單句分類 | 一個句子 | `[CLS]` 的向量做分類 |
| 抽取式問答 | 問題與段落 | 段落的每個 token 預測是不是答案的起點、終點 |
| 序列標註（例如 NER） | 一個句子 | 每個 token 各預測一個標籤 |

抽取式問答的接法就是[作業 1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) 要做的事。

### 兩個預訓練目標有沒有用

第 16 頁是論文的消融實驗，老師的解讀：

- 拿掉 next sentence prediction，在需要看兩句關係的任務上表現下降。
- 再把 masked LM 換成只看左邊的語言模型，表現又下降，問答任務掉得最多。
- 在只看左邊的版本上加一個雙向 LSTM，在問答資料集 SQuAD 上補回一些，但仍比不上原本的 BERT；老師說另外三個資料集還是比較差；圖上這三個（MNLI、QNLI、MRPC）加了雙向 LSTM 之後持平或更低。

NER 的比較（第 17 頁，CoNLL 2003 的 F1）：TagLM 91.93、ELMo 92.22、BERT-Base 92.4、BERT-Large 92.8。同一張表上還有用了其他技巧的模型分數更高，例如 Flair 的 93.09。

模型越大表現越好（第 18 頁），到最大的尺寸曲線還在往上。老師的補充是：一億多個參數時效果已經不錯，再往上，表現增加的幅度比參數增加的幅度小；追求極致就用最大的，業界則要在表現和成本之間取捨。

### 如果只拿向量來用

第 19–20 頁做了一個對照：像 ELMo 那樣，把 BERT 固定住，只拿它的向量去訓練另一個 NER 模型。BERT-Base 有 12 層，每一層都有向量，拿哪一層？第 20 頁的 dev set 結果：

| 拿哪些層 | 分數 |
|---|---|
| 只拿第一層（幾乎只有詞向量加位置） | 91 |
| 只拿最後一層 | 94.9 |
| 12 層加總 | 95.5 |
| 只拿倒數第二層 | 95.6 |
| 最後四層加總 | 95.9 |
| 最後四層串接 | 96.1 |
| 直接 fine-tune | 96.4 |

越後面的層帶的上下文資訊越多。但不管怎麼組合，都沒有直接微調好。老師的結論是：用 fine-tuning 連「選哪一層」都不用煩惱，而且整個模型的參數都能動，彈性比固定的向量大。

### 中文：ERNIE

第 21 頁。BERT 之後很快出現 [ERNIE](https://arxiv.org/abs/1904.09223)，名字來自芝麻街裡 Bert 的好朋友 Ernie，老師笑說全名 Enhanced Representation through Knowledge Integration 湊得有點勉強。

它處理的是中文的問題。老師說，照 BERT 的做法處理中文，通常一個字就是一個 token，「哈爾濱」會被切成三個字。只遮其中一個字太容易猜，例如「哈 [MASK] 濱是黑龍江的省會」（這是本文簡化的寫法，講義的圖在同一句裡遮了好幾個字），模型沒有真的學到這個詞。ERNIE 的做法是：屬於同一個詞的字，要遮就一起遮。

講義最後一頁給了兩個起點：[google-research/bert](https://github.com/google-research/bert) 與 [huggingface/transformers](https://github.com/huggingface/transformers)。

## 彈性補充：BERT 家族

課程頁把這部分列為選讀，講義是 [Fall 2024 的 BERT Variants](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)（32 頁；課程頁上 Fall 2025 的連結失效）。這裡只列每個模型改了什麼，內容依講義，沒有對照影片口述。

| 模型 | 改了什麼 | 影片 |
|---|---|---|
| [Transformer-XL](https://arxiv.org/abs/1901.02860) | 上一段的 hidden state 快取起來給下一段用，並改用相對位置編碼，處理固定長度切片造成的上下文斷裂 | 無 |
| [XLNet](https://arxiv.org/abs/1906.08237) | 用 permutation language model：只換預測順序、不動位置，讓自迴歸模型也看得到兩邊。解決 BERT 把同句被遮的詞當成彼此獨立、以及預訓練有 `[MASK]` 而微調沒有的落差 | [5.4](https://youtu.be/Q-bIzFhVweA)（34:06） |
| [RoBERTa](https://arxiv.org/abs/1907.11692) | 動態遮罩、學習率與 warmup 分開調、batch 加大到 8K、只用完整長度的序列、更多資料 | [5.5](https://youtu.be/u6USoD6mRR4)（22:20） |
| [SpanBERT](https://arxiv.org/abs/1907.10529) | 遮連續的一段、每次只放單一段文字訓練、用邊界的表示預測整段。對問答、NLI 與共指消解有幫助 | 同上 |
| Multilingual BERT | 用 104 種語言的 Wikipedia 一起訓練 | [5.6](https://youtu.be/NAFu7xQKbRE)（12:48） |
| [XLM](https://arxiv.org/abs/1901.07291) | 在 masked LM 之外加上 translation LM，適合 zero-shot 的跨語言情境 | 同上 |

總覽影片是 [5.3 BERT Variants](https://youtu.be/sqldA6AgV7s)（4:09）。

## 常見的誤解

這幾條是我依課堂內容整理的。

- **「BPE 是照語言學規則切詞素。」** 它只看哪一對最常相鄰。切出來的片段常常剛好是詞素，但那是統計的結果。
- **「用 subword 就不會有未知的 token。」** 起始詞彙表沒有的字元仍然是未知，例如 powest 的 p。
- **「中文一個字就是一個 token。」** 要看 tokenizer。BERT 處理中文時通常是這樣，但前半堂看到的多語 BPE 裡，一個中文字可能被切成好幾個 token。
- **「BERT 發明了預訓練。」** 概念在 TagLM、ELMo 就有了。BERT 做的是把 ELMo 的 LSTM 換成 Transformer、用 masked LM 同時看兩邊，以及 fine-tuning 的用法。
- **「BERT 和 GPT 只差在一個是 encoder、一個是 decoder。」** 更關鍵的是能看哪一邊：GPT 預測下一個詞，只能看左邊；BERT 預測被遮的詞，兩邊都看。
- **「Fine-tuning 是在 BERT 上面再訓練一個模型。」** 那是 ELMo 的用法。Fine-tuning 是 BERT 自己的權重跟著任務一起更新。

## 自我檢查

題目是本文自擬的。

**1. 在上面的 BPE 示範裡，第一步如果改選 `s t` 而不是 `e s`，九次合併之後，四個詞的切法會不會不同？**

不會。合併 `s t` 之後，`e st` 和 `st </w>` 又並列 9 次；不管選哪一個，三步之後都得到 `est</w>`，之後完全相同，最後的語料一樣是 `low</w>`、`low e r </w>`、`newest</w>`、`w i d est</w>`。差別只在詞彙表裡的中間片段：例如選 `e+st` 時，多的是 `st` 而不是 `es`。

**2. 用示範裡的九條規則切 newer。**

`new` `e` `r` `</w>`。n、e、w 先合成 new；後面的 e、r 沒有對應的合併規則；詞尾是 r 接 `</w>`，也沒有規則。

**3. 一句話有 40 個 token，預訓練時大約遮幾個？如果改成只遮 1 個，會有什麼問題？**

40 × 15% = 6 個。只遮 1 個的話，整句跑一次只練到一個位置，要更多資料、更多計算才學得到同樣多的東西。

**4. 用 BERT 做「判斷一則評論是正面還是負面」，輸入怎麼放，輸出接在哪裡？**

輸入是 `[CLS]` 加上評論的 token。取 `[CLS]` 位置的向量接一層分類層，預測正面或負面，用標註資料微調整個模型。

**5. 「蘋果發表了新手機」和「他吃了一顆蘋果」，靜態詞向量和 BERT 給「蘋果」的向量各有什麼不同？**

靜態詞向量兩句給的是同一個向量。BERT 的向量是讀完整句之後算出來的，兩句會不同：一句的上下文指向公司，一句指向水果。

**6. 拿 BERT 的向量去訓練另一個 NER 模型，和直接 fine-tune BERT，依課堂的數字哪個好？各自多了什麼決定要做？**

直接 fine-tune 較好（96.4，最好的向量組合是 96.1）。只拿向量的做法要另外決定拿哪幾層、怎麼組合；fine-tune 不用。

**7. BERT 預訓練時一筆輸入放兩個句子。模型怎麼知道哪個 token 屬於哪一句？next sentence prediction 用哪個位置的輸出、預測什麼？**

兩句之間用 `[SEP]` 隔開，每個位置另外加上 segment embedding 標示屬於第一句還是第二句。Next sentence prediction 用 `[CLS]` 位置的輸出向量，接一層全連接層做二元分類：第二句是不是原文裡真的接在第一句後面。

**8. ELMo 和 BERT 都產生看上下文的表示。兩者在模型和「看哪一邊」上差在哪裡？**

ELMo 用 LSTM，正向和反向是分開的兩個模型，各自只看一邊，用的時候把兩邊的向量一起拿來用。BERT 用 Transformer 的 encoder，靠遮住 token 再填回來的方式訓練，同一個模型同時看左右兩邊。

## 延伸閱讀

- 從零實作 BPE tokenizer：[CS336 Lecture 1：從位元組到 tokenizer](/posts/ai/2026-08-22-cs336-overview-tokenization)
- 多語 token 成本的更完整討論：[CS224N 第 14 堂：Tokenization 如何製造多語言成本差](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality)
- [CS224N 第 7 堂：預訓練](/posts/ai/2026-08-22-cs224n-pretraining)從另一個角度講 encoder、decoder、encoder-decoder 三種預訓練
- [CS224U 的 contextual representation 模型家族](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)整理了 BERT、RoBERTa、ELECTRA 等模型

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [Attention 與 Transformer](/posts/ai/2026-09-30-ntu-adl2025-attention-transformer)｜下一篇 [作業 1：中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=NrT5kmnTFCk
title: ADL 5.1: BPE (Byte-Pair Encoding) Tokenization 如何將字詞切成小單元
```

```youtube
url: https://www.youtube.com/watch?v=pSQM-HNHA64
title: 5.2 BERT
```

原始影片：[ADL 5.1: BPE (Byte-Pair Encoding) Tokenization](https://www.youtube.com/watch?v=NrT5kmnTFCk)、[5.2 BERT](https://www.youtube.com/watch?v=pSQM-HNHA64)、[5.3 BERT Variants](https://www.youtube.com/watch?v=sqldA6AgV7s)、[5.4 XLNet](https://www.youtube.com/watch?v=Q-bIzFhVweA)、[5.5 RoBERTa & SpanBERT](https://www.youtube.com/watch?v=u6USoD6mRR4)、[5.6 Multilingual BERT & XLM](https://www.youtube.com/watch?v=NAFu7xQKbRE)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-13。

內容核對：已依影片核對（2026-10-13）：5.1 與 5.2 沒有字幕，本文把兩支的音訊用語音辨識轉成逐字稿後整理，逐字稿可能有聽錯的專有名詞。兩支都是 2023/10/12 上傳的錄影，不是 2025 年重錄。5.3–5.6 未對照，BERT 家族一節依講義。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-13：把原本分成兩篇的 Tokenization 與 BERT 併成第 5 堂一篇，依兩支影片的課堂口述重寫，補上例子、常見誤解與附答案的自我檢查。原「Tokenization 與 BPE」的網址轉到本篇。

## 參考資料

- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/) — 9/08 課表列
- [Tokenization 投影片（2025/09/08）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_Tokenization.pdf)
- [250908_BERT.pdf（BERT: Bidirectional Encoder Representations from Transformers）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250908_BERT.pdf)
- [240918_BERTVariants.pdf（BERT Variants，f113 路徑）](https://www.csie.ntu.edu.tw/~miulab/f113-adl/doc/240918_BERTVariants.pdf)
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- [Sennrich, Haddow & Birch, Neural Machine Translation of Rare Words with Subword Units（ACL 2016）](https://arxiv.org/abs/1508.07909)
- [OpenAI Tokenizer](https://platform.openai.com/tokenizer) — 投影片第 21 頁截圖來源
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
