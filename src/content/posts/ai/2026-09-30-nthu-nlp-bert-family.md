---
title: "清大 NLP 導讀 8：ELMo、BERT、T5、BART、GPT——預訓練的三條路"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, pre-training, bert, gpt, nlp]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 8
tldr: "清大高宏宇 NLP（Fall 2025）BERT and its Family 單元導讀。起點是「I record the record」：Word2Vec 和 GloVe 給兩個 record 同一個向量。ELMo 用雙向 LSTM 語言模型解決這件事。換成 Transformer 之後，預訓練分成三條路：encoder（BERT：MLM＋NSP，擅長理解、不擅長生成）、encoder-decoder（T5 的 span corruption、BART 的五種雜訊）、decoder（GPT：純粹預測下一個字）。最後一段是 GPT-3 的 in-context learning 和 scaling laws，也說明 decoder 為什麼成了現在最主流的骨幹。"
description: "清大高宏宇教授自然語言處理（Fall 2025）W4_bert_and_its_family.pdf 與 Week 6 錄影導讀：靜態詞向量的限制、ELMo 的 biLM 與層加權、三種 Transformer 預訓練方式、BERT 的 MLM 80/10/10 與 NSP、pretrain-finetune、RoBERTa／SpanBERT／ALBERT 等延伸、T5 的 text-to-text 與 span corruption、BART 五種雜訊、GPT-1 到 GPT-4、GPT-3 in-context learning 與 scaling laws。"
draft: false
glossary:
  - term: "MLM"
    aliases: ["Masked Language Model", "遮罩語言模型"]
    definition: "BERT 的預訓練任務：選出 15% 的 token，其中 80% 換成 [MASK]、10% 換成隨機 token、10% 保持不變，要模型從左右兩側的上下文猜回原字。"
    context: "投影片第 20 頁解釋 80/10/10 是為了避免模型只在看到 [MASK] 時才認真建表示。"
  - term: "span corruption"
    aliases: ["replace spans", "片段遮罩"]
    definition: "T5 的預訓練目標：把輸入中長度不一的連續片段各換成一個獨特的佔位符，decoder 要依序還原被拿掉的片段。"
    context: "T5 的預設設定是遮 15% 的 token、平均片段長度 3。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-bert-family-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **本文依據[清大高宏宇教授「自然語言處理」](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025（114-1）的公開教材。** 這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列的第 8 篇，上一篇是 [Sub-word Tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization)。

這一講的官方材料是 [W4_bert_and_its_family.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W4_bert_and_its_family.pdf)（58 頁），標題是「ELMo, BERT, GPT, and T5 (BERT and its Family)」，錄影是 [Week 6 Tue.](https://www.youtube.com/live/U5HypcXrIgY) 和 [Week 6 Thu.](https://www.youtube.com/live/RNlcZjzbhDo)。[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)把它掛在 W6；W9 那一列的 Topics 欄雖然寫著「ELMo, BERT, GPT, and T5」，實際掛的卻是 PEFT 投影片。Topics 欄是課綱模板，本篇以實際掛的檔案為準。

投影片大綱：回顧詞向量與 RNN → 從詞向量走到預訓練語言模型（ELMo）→ 用 Transformer 預訓練（encoder 的 BERT、encoder-decoder 的 T5、decoder 的 GPT）→ GPT-3 的 in-context learning 與大型語言模型。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=U5HypcXrIgY
title: Week 6 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=RNlcZjzbhDo
title: Week 6 Thu.
```

原始影片：[Week 6 Tue.](https://www.youtube.com/watch?v=U5HypcXrIgY)、[Week 6 Thu.](https://www.youtube.com/watch?v=RNlcZjzbhDo)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：Week 6 Thu. 字幕讀完，Week 6 Tue. 字幕只讀前段（約 12,000 字）後再以關鍵字搜尋其餘部分，屬部分核對。Week 6 Tue. 講 ELMo（biLM、兩層與加權串接）、MLM 的 15% 與 80/10/10、NSP 與 [CLS]／[SEP]、微調做法、BERT-base／large 規格與 64 TPU 4 天、RoBERTa／SpanBERT／領域 BERT，並開始介紹 T5；Week 6 Thu. 回顧 T5 並接著講 BART、GPT-1 到 GPT-3、in-context learning、scaling laws 與 MoE。文章本身以投影片為主、沒有對影片內容下具體說法，與字幕沒有衝突，不需修改。

## 起點：同一個 record，兩種意思

第 6 頁的例子是「I record the record」：第一個 record 是動詞（錄），第二個是名詞（紀錄）。Word2Vec 或 GloVe 給兩者同一個向量，因為靜態詞向量**不看上下文**。這一講要解的就是這件事，也接回[第 2 篇](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)投影片裡出現過的 contextualized embedding。

第 8 頁用幾個填空題說明「預測下一個字」能學到多少東西：

- 國立清華大學在 ___（新竹）：世界知識
- I put ___ bag on the table（a）：文法
- The movie was ___（bad）：要讀懂前面整段在抱怨
- 1, 1, 2, 3, 5, 8, 13, 21, ___（34）：推理

## ELMo：先讀完整句，再給每個字一個向量

[ELMo](https://aclanthology.org/N18-1202/)（Embeddings from Language Models，Peters et al., 2018）不給每個字固定的表示，而是先看完整個句子，再為句中每個字產生向量。

第 9–11 頁畫出它的骨幹：字元先經過 CNN 得到 token 表示，上面疊兩層雙向語言模型（biLM），每層都有一個由左到右和一個由右到左的 RNN。

第 12–14 頁說明怎麼從 biLM 組出 ELMo 向量：

1. **串接**：每一層把 forward 和 backward 的 hidden state 接起來（token 層就和自己接）
2. **加權**：每一層乘上一個 softmax 正規化過的權重 s<sup>task</sup>
3. **加總**：加權後相加，再乘一個純量 γ<sup>task</sup>，讓下游任務模型調整整個 ELMo 向量的大小。投影片說這一步對最佳化很重要

權重是跟著下游任務學的，所以投影片的定義是：ELMo 是 biLM 中間各層表示的**任務專屬組合**。

<details>
<summary>公式：ELMo 的層加權（投影片第 12–14 頁）</summary>

$$\mathrm{ELMo}_k^{task} = \gamma^{task} \sum_{j=0}^{L} s_j^{task}\, h_{k,j}^{LM},\qquad h_{k,j}^{LM} = \left[\overrightarrow{h}_{k,j}^{LM};\ \overleftarrow{h}_{k,j}^{LM}\right]$$

j = 0 是 token 層，j = 1…L 是 biLM 各層；s<sup>task</sup> 經過 softmax 正規化，γ<sup>task</sup> 是純量。

</details>

## 換成 Transformer：三種預訓練方式

第 16 頁的時間軸：2013 Word2Vec、2014 GloVe、2018 ELMo／BERT／GPT、2019 T5。Transformer 在機器翻譯上的成績讓研究者把它當成 RNN 更好的替代品。

第 17 頁是整講的主軸，把 Transformer 預訓練分成三條路：

| 架構 | 投影片的描述 | 代表 |
|---|---|---|
| Encoder | 雙向，看得到後面的字；適合下游任務 | BERT |
| Encoder-decoder | 兩邊的優點都想要；投影片留了一個問題：預訓練時兩者都有的代價是什麼？ | T5、BART |
| Decoder | 之前看過的語言模型都是這種；適合生成；不是雙向 | GPT |

## 第一條路：encoder（BERT）

### 兩個預訓練任務

第 19–21 頁介紹 [BERT](https://aclanthology.org/N19-1423/)（Devlin et al., 2018）的兩個任務：

**MLM（Masked Language Model）**：挑出 15% 的 token 讓模型預測，其中：

- 80% 換成 `[MASK]`
- 10% 換成隨機 token
- 10% 保持原樣

為什麼不全部換成 `[MASK]`？投影片的理由是：微調時不會出現 `[MASK]`，如果只有被遮的位置才需要認真表示，模型對沒被遮的字就會偷懶，建不出穩健的表示。

**NSP（Next Sentence Prediction）**：輸入「`[CLS]` 句子 A `[SEP]` 句子 B」，用 `[CLS]` 的輸出判斷 B 是不是 A 的下一句（IsNext／NotNext）。目的是讓模型學會句子之間的關係，而且任何單語語料都能自動生成這種訓練資料。

### Pretrain，再 finetune

第 22–24 頁是現在的標準做法：先用大量無標註文字預訓練出通用的語言理解模型，再針對特定任務微調。微調時只在 BERT 上加一層輸出層，例如：

- 句子對分類：拿 `[CLS]` 的輸出接分類器
- 序列標註（如 NER）：每個 token 的輸出各自接分類器，輸出 O、B-PER 等標籤

第 25 頁的細節：

| | BERT-base | BERT-large |
|---|---|---|
| 參數量 | 110M | 340M |
| 層數 | 12 | 24 |
| 隱藏維度 | 768 | 1024 |
| Attention head | 12 | 16 |

訓練資料是 BooksCorpus（8 億字）與英文維基百科（25 億字）。預訓練用了 64 顆 TPU 晶片跑 4 天，單張 GPU 做不來；微調則在單張 GPU 上就很常見。這也是 [HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) 用 `bert-base-uncased` 做多輸出學習的前提。

### BERT 的延伸

第 27 頁的對照表：

| 模型 | MLM 怎麼改 | NSP 怎麼改 | 發表 |
|---|---|---|---|
| BERT | 靜態遮罩 | 句子關係 | 2018/10 |
| [RoBERTa](https://arxiv.org/abs/1907.11692) | 動態遮罩 | 拿掉 NSP | 2019/07 |
| SpanBERT | 遮連續片段 | 拿掉 NSP | 2019/07 |
| ALBERT | N-gram 遮罩 | 改成判斷句子順序 | 2019/09 |
| DistilBERT | 用知識蒸餾壓縮 | | 2019/10 |
| TinyBERT | 用蒸餾做 NLU | | 2019/09 |
| DeBERTa | Disentangled attention 加強版解碼 | | 2020/06 |

第 28 頁補 SpanBERT 的 Span Boundary Objective：被遮的片段裡，每個字除了照常用 MLM 預測，還要只靠片段兩側邊界的字加上位置來預測。投影片的例子是「Generative AI is [MASK] [MASK] [MASK] at NTHU」，要猜回「a NLP course」。

第 29–30 頁整理 RoBERTa 的四個改進：訓練更久、batch 更大、資料更多（超過 160GB）；拿掉 NSP；用更長的序列訓練；動態遮罩，每次迭代換一種遮法。投影片的結論是：只要訓練策略對，BERT 的 MLM 目標其實很有競爭力。

第 31 頁列出 2019 年前後的領域專用 BERT：SciBERT、FinBERT、BioBERT、PubMedBERT、BlueBERT、ClinicalBERT、LegalBERT。

### Encoder 的限制

第 33 頁：encoder 在各種理解任務上表現很好，但生成任務做不好。如果任務要一個字一個字往後產生，應該改用預訓練的 decoder。

## 第二條路：encoder-decoder（T5、BART）

### T5：所有任務都是「文字進、文字出」

第 34 頁先列出 encoder-decoder 預訓練可以怎麼設計：語言模型式、BERT 式、打亂重排（deshuffling），以及幾種破壞策略（換成 mask、換掉整段、直接刪 token）。

[T5](https://arxiv.org/abs/1910.10683)（Text-to-Text Transfer Transformer，Raffel et al., Google, 2019）把分類、相似度、序列標註、生成四類任務統一成同一個格式。第 36–38 頁用同一句話比較兩種預訓練方式：

原句：Thank you for inviting me to your party last week.

| | 輸入 | 目標 |
|---|---|---|
| BERT 式遮罩 | Thank you `<M>` `<M>` me to your party apple week | 整句原文 |
| Replace spans | Thank you `<X>` me to your party `<Y>` week | `<X>` for inviting `<Y>` last `<Z>` |

Replace spans 把每一段連續被破壞的 token 換成一個獨特的佔位符，所以輸入和目標都變短。第 39 頁的設定是破壞 15% 的 token、平均片段長度 3；投影片也提到，破壞率在 50% 以下時結果對這兩個參數不太敏感。

第 37 頁有一句容易漏掉的話：原本為 encoder-only 模型設計的 BERT 式目標，在 T5 的比較裡被發現比其他替代做法表現更好。

第 40 頁的模型大小：

| 版本 | 參數 | 層數 | 隱藏維度 | Head |
|---|---|---|---|---|
| T5-small | 60M | 6 | 512 | 8 |
| T5-base | 220M | 12 | 768 | 12 |
| T5-large | 770M | 24 | 1024 | 16 |
| T5-3B | 3B | 24 | 1024 | 32 |
| T5-11B | 11B | 24 | 1024 | 128 |

訓練資料是 C4（Colossal Clean Crawled Corpus，從 Common Crawl 抽出，投影片寫 340 億字）。第 41 頁示範微調成 closed-book QA：問「羅斯福哪年出生」，不給任何參考文字，T5 只能靠預訓練時學到的知識回答 1882。

### BART：先弄壞，再修好

第 42–44 頁介紹 [BART](https://aclanthology.org/2020.acl-main.703/)（Lewis et al., 2019，投影片標為 Meta）。它是 denoising autoencoder：先用任意雜訊函數把文字弄壞，再學著還原原文。五種雜訊：

| 雜訊 | 做法 | 要模型學什麼 |
|---|---|---|
| Token Masking | 隨機 token 換成 [MASK] | 預測被遮的 token |
| Token Deletion | 隨機刪 token | 預測被刪的 token 和它的位置 |
| Text Infilling | 像 SpanBERT，但長度 0 的片段等於插入一個 [MASK] | 預測一段裡少了幾個 token |
| Sentence Permutation | 依句號切句後隨機打亂 | 釐清句子之間的關係 |
| Document Rotation | 隨機挑一個 token，把文件轉成從它開始 | 找出文件的開頭 |

微調時，分類任務讓 encoder 和 decoder 吃同一份輸入，取最後輸出的表示；翻譯這類生成任務，則在 BART 前面接一個新訓練的 encoder，可以用和原本不同的詞彙表。

## 第三條路：decoder（GPT）

第 46 頁是 [GPT-1](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)（Radford et al., 2018）的細節：12 層 Transformer decoder、117M 參數、768 維 hidden state、3072 維 feed-forward、BPE 做 40,000 次合併，訓練資料是 BooksCorpus 裡 7000 多本書，長段連續文字適合學長距離依賴。投影片還提到一個小知識：原論文裡從沒出現過「GPT」這個縮寫。

第 48 頁的預訓練任務就是預測下一個字，把整句的機率拆成一連串條件機率相乘。第 49 頁說明怎麼微調：把各種結構化輸入都轉成一串 token，後面接線性分類器。蘊含任務就是「Start 前提 Delim 假設 Extract」；多選題則把每個選項各接一次，分別過 GPT 再比較。

第 50 頁的 GPT 家族表：

| 模型 | 投影片的描述 | 參數 | 資料 | 發表 |
|---|---|---|---|---|
| GPT-1 | Transformer decoder 接 linear-softmax | 117M | BooksCorpus 4.5 GB | 2018/06 |
| GPT-2 | 同 GPT-1，normalization 層位置不同；文字生成時代開始 | 1.5B | WebText 40 GB | 2019/02 |
| GPT-3 | GPT-2 的放大版 | 175B | CommonCrawl 45 TB | 2020/05 |
| GPT-4 | 用 RLHF 訓練 | > 1.5T | 未公開 | 2023/03 |

GPT-4 那一列的參數量要保留看待：[GPT-4 技術報告](https://arxiv.org/abs/2303.08774)明寫不公開模型大小等架構細節，投影片的「> 1.5T」不是 OpenAI 公布的數字。

## GPT-3、in-context learning 與 scaling laws

第 51–53 頁引 [GPT-3 論文](https://arxiv.org/abs/2005.14165)（Brown et al., 2020）。在這之前，和預訓練模型互動只有兩種方式：從它定義的分布抽樣，或拿任務資料微調。夠大的模型則出現一種湧現能力：**不更新任何梯度，只看上下文裡給的幾個例子就能學會任務**，這叫 in-context learning。1750 億參數的 GPT-3 就是例子。

第 55 頁的 [scaling laws](https://arxiv.org/abs/2001.08361)（Kaplan et al., 2020）：模型大小、資料量、訓練計算量一起增加，表現就會平滑地變好，而且可以用簡單規則預測。

第 56–57 頁列出幾個大型模型與開放社群模型：GPT-3（175B）、BLOOM（176B）、Flan-PaLM（540B）；Llama 2（7B/13B/70B）、Mistral（7B、8×7B）、Phi 2（2.7B）、Gemma（2B/7B），後四個都是 decoder-only。

第 58 頁的 takeaways 把三條路收成三句：BERT 家族用 MLM 和 NSP 預訓練，不擅長生成；T5 和 BART 用片段破壞強化 MLM，目標是 text-to-text 格式；GPT 家族是純語言模型，也是現在最主流的骨幹。

## 想深入

- 用 `transformers` 的 `fill-mask` pipeline 載入 `bert-base-uncased`，輸入「I [MASK] NLP」，看前五名候選字。
- 把「I record the record」丟進 BERT，取出兩個 record 的最後一層向量算 cosine similarity，再和 GloVe 的同一個向量比較。
- 手寫一個 span corruption 函式：給一句話、破壞率 15%、平均長度 3，輸出 T5 格式的輸入和目標，對照第 36 頁的例子。
- 拿任一個 decoder-only 模型，分別用 zero-shot 和 3-shot 的 prompt 做同一個分類任務，體會第 52 頁說的 in-context learning。

**延伸閱讀**：[CS224N 導讀：預訓練](/posts/ai/2026-08-22-cs224n-pretraining)、[CS224U 上下文表徵 II：GPT、BERT、RoBERTa、ELECTRA、seq2seq 與蒸餾](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)、[CS224U 導讀：In-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning)、[CME295 導讀：LLM 訓練](/posts/ai/2026-09-29-cme295-llm-training)。

## 材料缺口

- 第 53–54 頁（GPT-3 ICL、GPT-3 family）和第 26 頁（為什麼要雙向）在投影片上是論文圖表，抽出的文字只有標題，本文沒有轉述圖中數字。
- 這一講沒有專屬作業；BERT 的實作在下一篇的 [HF BERT 助教課與 HW3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)，GPT-2／T5 的實作在 [GPT-2／T5 中文摘要](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization)。
- GPT-3 之後的發展（InstructGPT、RLHF）留到 [GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)。
- 解答、測驗與課堂討論在 NTU COOL，校外讀者拿不到。Fall 2026 的這一講還沒公開。

**系列導覽**：上一篇 [Sub-word Tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization)｜下一篇 [HF BERT 助教課與 HW3：多輸出學習](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。兩支影片的主題與講次相符，文章未對影片內容下具體說法，無需修改。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W4_bert_and_its_family.pdf（ELMo, BERT, GPT, and T5 投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W4_bert_and_its_family.pdf)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 6 Tue.](https://www.youtube.com/live/U5HypcXrIgY)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 6 Thu.](https://www.youtube.com/live/RNlcZjzbhDo)
- [Peters et al. (2018). Deep Contextualized Word Representations（ELMo）](https://aclanthology.org/N18-1202/)
- [Devlin et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://aclanthology.org/N19-1423/)
- [Liu et al. (2019). RoBERTa: A Robustly Optimized BERT Pretraining Approach](https://arxiv.org/abs/1907.11692)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer（T5）](https://arxiv.org/abs/1910.10683)
- [Lewis et al. (2020). BART: Denoising Sequence-to-Sequence Pre-training](https://aclanthology.org/2020.acl-main.703/)
- [Radford et al. (2018). Improving Language Understanding by Generative Pre-Training（GPT-1）](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Brown et al. (2020). Language Models are Few-Shot Learners（GPT-3）](https://arxiv.org/abs/2005.14165)
- [Kaplan et al. (2020). Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [OpenAI (2023). GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
