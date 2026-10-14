---
title: "自然語言處理：從文字表示到語言模型的學習路線｜清大高宏宇 自然語言處理 課程總覽"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nthu, ai-course, nlp, taiwan]
lang: zh-TW
math: true
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 0
tldr: "清大高宏宇《自然語言處理》用一學期走完一條線：先把文字變成數字（TF-IDF、詞向量）、再處理序列（RNN、attention、Transformer、sub-word）、接著是預訓練模型（BERT、T5、GPT 與解碼評估）、讓模型聽指令與省參數微調（RLHF、PEFT），最後外接知識（RAG）與推理。Fall 2025 的投影片、32 支錄影、4 份作業與 starter notebook 都在 GitHub 公開，中文授課；作業沒有公開解答。"
description: "清大高宏宇《自然語言處理》系列入口：六段主線各自在學什麼、一個用 TF-IDF 手算檢索分數並看出詞彙對不上問題的例子、先備與自我檢查、三種讀法與校外拿得到的材料，以及本系列 19 篇的篇目。"
draft: false
glossary:
  - term: "TAICA"
    aliases: ["臺灣大專院校人工智慧學程聯盟"]
    definition: "臺灣大專院校人工智慧學程聯盟。由多所大學開設「主導課程」，聯盟學校的學生以同步遠距方式跨校修課；114 學年上學期由六所大學開了 10 門。"
    context: "本課在 TAICA 開課清單上歸在「人工智慧自然語言技術學分學程」。"
  - term: "鏡像課程"
    aliases: ["mirror course"]
    definition: "TAICA 的一種盟校修課型態：盟校學生直接跟著主導學校的同步遠距課程上課。另一種「衛星課程」由盟校配置協同教師與助教輔導。"
    context: "TAICA 114 學年上學期把本課標為「封閉式：鏡像課程／條件式：衛星課程」，115 學年上學期標為「鏡像課程」。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide-en)

**影片狀態：已附影片。** 導言附第 1 週週二的錄影（1 小時 25 分），各週錄影在各篇導讀。[影片來源與說明](#課程影片來源)

清華大學資工系高宏宇老師的[《自然語言處理》](https://github.com/IKMLab/NTHU_Natural_Language_Processing)是 [TAICA 臺灣大專院校人工智慧學程聯盟](https://taicatw.net/fall-114/)的主導課程，研究所級、中文授課，聯盟學校的學生同步遠距修課。投影片、錄影、作業都放在實驗室的 GitHub repo，校外讀者拿得到的材料和修課生幾乎一樣，只差解答與批改。

這門課回答一個問題：電腦怎麼從「讀不懂文字」走到「能回答問題的 LLM」？它從「冬天：能穿多少穿多少」這種一句兩讀的例子講起，一路經過 TF-IDF、詞向量、RNN、Transformer、BERT，講到 RLHF、PEFT 與 RAG。每一步都在補前一步的缺口，所以照順序讀最能看出技術為什麼長成現在這樣。

這篇是系列入口：先講主線的六段各自在學什麼，再用一個 TF-IDF 手算例子示範第一週的核心想法與它的限制，最後給先備檢查與讀法。下面是第 1 週週二的錄影，內容對應本系列第 1 篇；可以先看影片再讀，或讀完第 1 篇再回來對照。

```youtube
url: https://www.youtube.com/watch?v=X7XJcm9wfFA
title: Fall 2025 Week 1 Tue. 錄影
```

## 主線：六段

### 把文字變成數字（第 1–3 篇）

[第 1 篇](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing)從資訊檢索的角度，把倒排索引、斷詞、stemming、TF-IDF、BM25 串成一條管線：文件越常出現某個字、這個字在其他文件越少見，分數就越高。這條管線的死穴是同義詞與一詞多義，於是走到 LSA 的 SVD 降維。[第 2 篇](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)換成「預測下一個字」：先用 bigram 計數表、add-one smoothing 與 perplexity 講統計語言模型，再用 Word2Vec 的負採樣學出稠密詞向量，最後用 RNN 處理任意長的句子。[作業 1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) 拿 Google Analogy 的近兩萬題考詞向量，看「king − man + woman」是不是真的接近 queen。

### 處理序列（第 4–7 篇）

輸入和輸出長度不同時（翻譯、摘要），分類器那套「最後接一層」不能用，要 encoder-decoder。[第 4 篇](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention)講 RNN 的梯度消失、LSTM 的三個閘門，再用 attention 讓解碼時直接看整句輸入。[第 6 篇](/posts/ai/2026-09-30-nthu-nlp-transformers)拿掉 RNN：self-attention 讓每個字直接看所有字、用矩陣乘法一次算完，代價是分不出詞序，所以補上位置編碼。[第 7 篇](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization)講詞彙表為什麼是「半個字」：BPE 反覆合併最常一起出現的一對字元，沒看過的詞也切得出來。[作業 2](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) 把「14*(43+20)=882」當字元序列，用 LSTM 在「=」之後逐字生成答案。

### 預訓練模型（第 8–11 篇）

[第 8 篇](/posts/ai/2026-09-30-nthu-nlp-bert-family)從「I record the record」講起：Word2Vec 給兩個 record 同一個向量，要靠上下文決定意思。換成 Transformer 後分成三條路：encoder 的 BERT（遮字預測，擅長理解）、encoder-decoder 的 T5 與 BART、decoder 的 GPT（只預測下一個字，後來成為主流）。[第 10 篇](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)講生成時怎麼選字：greedy 一步錯就回不去，beam search 同時保留幾條候選，top-k／top-p 用抽樣換多樣性；評分則有 BLEU（數 n-gram 重疊，太短的句子要扣分）、ROUGE 與 perplexity。[作業 3](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) 讓一個 BERT 接兩個頭，同時做 1–5 分回歸與三類分類；[第 11 篇](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization)用 GPT-2 與 mT5 各做一次中文摘要：decoder-only 要把文章和摘要接成一條序列、改用 left padding，並把不該算 loss 的位置標成 −100；encoder-decoder 則由工具自動處理。

### 讓模型聽指令、用少量參數微調（第 12–13 篇）

[第 12 篇](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)說明「會接話」和「聽得懂指令」差在哪：最大概似目標分不出編造事實和用錯同義詞哪個嚴重，所以 InstructGPT 多了三步：SFT 學人怎麼寫、reward model 學人怎麼評分、PPO 依評分調整並用 KL penalty 綁住不要跑太遠。[第 13 篇](/posts/ai/2026-09-30-nthu-nlp-peft)先算一筆帳：Llama 2-7B 全參數微調約要 56GB 顯示卡記憶體，只訓練一小撮參數就降到約 17GB，因為梯度和優化器狀態幾乎歸零。方法分成加參數（Adapter、Prompt Tuning）、挑參數（BitFit）、重參數化（LoRA）與混合四類。

### 外接知識（第 14–17 篇）

LLM 會一本正經地答錯事實，RAG 的做法是先檢索、再生成。[第 14 篇](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers)講怎麼找對資料：稀疏向量（TF-IDF、BM25）便宜可靠，稠密向量抓得到同義改寫；cross-encoder 準但慢，bi-encoder 可以先把文件算好向量。[第 15 篇](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced)把檢索器接上生成器，整理改寫查詢、讓生成器不怕雜訊、決定何時檢索（Self-RAG）等修法。[第 16 篇](/posts/ai/2026-09-30-nthu-nlp-llm-api)示範用 API 做 prompt、JSON 輸出與 few-shot；[第 17 篇](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4)的兩堂助教課各做一個 RAG，第二堂示範 BM25 加 cosine 的混合檢索；作業 4 套用第一堂的 LangChain＋Chroma 骨架，做一個回答貓咪冷知識的 RAG，回報 recall@k 與 exact match。

### 總結與推理（第 18–19 篇）

[第 18 篇](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning)把整學期分成基礎、模型、進展三欄收尾，再整理 Denny Zhou 的演講：預訓練模型本來就會推理，關鍵在解碼，用 CoT decoding 與 self-consistency 把推理引出來。[第 19 篇](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes)講期末專題的評分結構，以及 Fall 2026 改成期中考的變化。

## 手算一次：TF-IDF 怎麼打分，又在哪裡失手

這是本文的教學例子，用來看第 1 週的核心想法，以及它為什麼一路延伸到詞向量和 RAG。

三份已經斷好詞的文件：

- D1：貓　喜歡　魚
- D2：狗　喜歡　骨頭
- D3：貓咪　討厭　洗澡

TF-IDF 給每個字的權重是「它在這份文件出現幾次」乘上 $\text{idf} = \ln(N / \text{df})$，$N$ 是文件數，df 是有幾份文件含這個字。這裡 $N = 3$：

- 「貓」只出現在 D1，idf $= \ln 3 \approx 1.10$。
- 「喜歡」出現在 D1、D2，idf $= \ln 1.5 \approx 0.41$。

查詢「喜歡 貓」，把查詢字的權重加起來：D1 $= \ln 1.5 + \ln 3 = \ln 4.5 \approx 1.50$，D2 $= 0.41$，D3 $= 0$。D1 排第一，合理：「貓」比「喜歡」少見，所以更有鑑別力，權重也更高。

問題出在 D3。它明明在講貓，分數卻是 0，因為斷詞後「貓咪」和「貓」是不同的詞。這就是第 1 篇說的「詞彙對不上」。

**這個例子的意思：** 只靠字面比對，少見的字會被正確加重，但同義詞永遠對不上。第 2 篇的詞向量讓「貓」和「貓咪」的向量靠近，第 14 篇的稠密檢索把同一個想法用在 RAG 上；但稠密向量也有自己的弱點（專有名詞、精確數字），所以第 17 篇的助教課把 BM25 和 cosine 一起用。整門課有很多地方都是這樣：後一步補前一步的缺口，又帶來新的取捨。

## 先備與自我檢查

需要 Python、基本的線性代數與機率，以及一點機器學習（知道什麼是損失函數和梯度下降）。線性代數可以用 [Harvard CS181 的線性代數複習](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)自我檢查，機率可以先讀 [Stanford CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability)，損失函數與梯度下降見[台大 ADL 第 2 堂](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)。作業用 PyTorch 與 Hugging Face，第 5、9 篇的助教課會從頭教。課綱寫明這門課不教 prompt 使用技巧，也寫明不適合「沒考試，想靠共同協作完成作業的人」。

讀完這篇，試著回答：

1. 上面的例子再加一份文件 D4「貓 睡覺」，「貓」的 idf 變成多少？D1 的分數怎麼變？
   答：$N = 4$、df $= 2$，idf $= \ln 2 \approx 0.69$；「喜歡」的 idf 也從 0.41 升到 $\ln 2 \approx 0.69$（文件變多，它變得相對少見），所以 D1 $= 2\ln 2 \approx 1.39$，只比原本的 1.50 低一點。「貓」變常見，權重就下降。
2. Self-attention 為什麼需要位置編碼？
   答：它讓每個字同時看所有字，計算本身不管順序，「狗咬人」和「人咬狗」會得到一樣的結果，要另外把位置加進去。
3. BERT 和 GPT 的預訓練目標差在哪？各自擅長什麼？
   答：BERT 遮掉部分字、用前後文預測（擅長理解）；GPT 只用前文預測下一個字（擅長生成）。
4. InstructGPT 的 PPO 為什麼要加 KL penalty？
   答：避免模型為了討好 reward model 跑得離原本的模型太遠，產生 reward model 沒見過、分數卻高的怪輸出。
5. RAG 的檢索為什麼常用 BM25 和稠密向量混合？
   答：BM25 抓得到精確字詞與專有名詞，稠密向量抓得到同義改寫，兩者的失誤互補。

## 三種讀法

本系列以已經結束的 Fall 2025 為準，照實際上課順序排；助教課和對應作業合成一篇。

- **快速讀一輪（8 篇）**：1 → 2 → 6 → 8 → 12 → 13 → 14 → 18。只走講課，適合想知道「從 TF-IDF 到 RAG 中間發生了什麼」的人。
- **完整跟課（19 篇）**：照順序讀，每篇附的錄影就是對應週次的直播，大約一學期的份量。
- **只做作業**：3 → 5 → 9 → 17，加上工具篇 11 和 16。每份作業都有題目 PDF、`main.ipynb` 與資料檔，可以直接丟進 Colab。作業沒有公開解答，課程平台（NTU COOL）要修課生帳號，所以要自己設驗收方法，例如作業 1 先用預訓練 GloVe 的正確率當對照組。

兩件會影響讀法的事：[2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md) 的 Topics 欄是課綱模板，和那一列實際掛的投影片對不上，照本系列的順序讀就好；LLM API 助教課用的是 2024 年的模型型號，部分已經退役，第 16 篇會說明怎麼換。

Fall 2026 正在進行，改成作業 75%＋實體期中考 25%，並新增 Reasoning／Agent 單元；材料只公開到前幾週，本系列不引用。

## 本系列篇目

| # | 篇目 | 聚焦問題 |
|---|---|---|
| 1 | [NLP 簡介與傳統文字處理](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing) | LLM 以前，怎麼把文字變成能計算的東西？ |
| 2 | [詞向量與語言模型：從 n-gram 到 RNN](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models) | 「預測下一個字」怎麼從數次數走到神經網路？ |
| 3 | [HW1 Word Analogy](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) | 詞向量真的學到「king − man + woman」嗎？ |
| 4 | [Seq2seq、LSTM 與 Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention) | 輸入輸出長度不同時怎麼辦？ |
| 5 | [PyTorch 助教課＋HW2 把算式當語言](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic) | LSTM 能學會算術嗎？ |
| 6 | [Transformer 與 Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers) | 拿掉 RNN 之後，模型怎麼知道字的關係和位置？ |
| 7 | [Sub-word Tokenization](/posts/ai/2026-09-30-nthu-nlp-subword-tokenization) | 為什麼詞彙表是「半個字」？ |
| 8 | [ELMo、BERT、T5、BART、GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family) | encoder、encoder-decoder、decoder 三條路差在哪？ |
| 9 | [HF BERT 助教課＋HW3 多輸出學習](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3) | 一個 BERT 同時做回歸和分類，loss 怎麼設計？ |
| 10 | [解碼策略與 NLG 評估](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation) | 生成的文字怎麼打分數？ |
| 11 | [GPT-2／T5 中文摘要實作](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization) | decoder-only 和 encoder-decoder 做摘要，實作差在哪？ |
| 12 | [GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf) | 會接話的模型怎麼變成聽得懂指令的助理？ |
| 13 | [Parameter-Efficient Fine-Tuning](/posts/ai/2026-09-30-nthu-nlp-peft) | 沒有 GPU 叢集，怎麼微調大模型？ |
| 14 | [RAG（上）：幻覺與檢索器](/posts/ai/2026-09-30-nthu-nlp-rag-retrievers) | 稀疏向量和稠密向量各有什麼長處？ |
| 15 | [RAG（下）：從 ODQA 到 Self-RAG](/posts/ai/2026-09-30-nthu-nlp-rag-qa-advanced) | 檢索器接上生成器之後還會壞在哪？ |
| 16 | [LLM API 助教課](/posts/ai/2026-09-30-nthu-nlp-llm-api) | prompt、JSON 輸出、few-shot 用 API 怎麼做？ |
| 17 | [RAG 助教課＋HW4](/posts/ai/2026-09-30-nthu-nlp-rag-lab-hw4) | 兩種做法各做一個回答貓咪冷知識的 RAG |
| 18 | [課程總結與 LLM Reasoning 筆記](/posts/ai/2026-09-30-nthu-nlp-summary-reasoning) | 預訓練模型不靠 prompt 會不會推理？ |
| 19 | [期末專題與 Fall 2026 改版](/posts/ai/2026-09-30-nthu-nlp-term-project-2026-changes) | 2026 為什麼改成期中考？ |


## 今晚可以做的事

1. 打開 [2025 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)，點 W1 的投影片，翻到 TF-IDF 那幾頁，對照上面的手算例子。
2. 把 [作業 1 的 main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment1/main.ipynb) 丟進 Colab，跑到載入 GloVe 那一格。
3. 讀[第 1 篇](/posts/ai/2026-09-30-nthu-nlp-intro-text-processing)。

## 延伸閱讀

- [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)：英文授課的 NLP 主課。
- [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)：偏自然語言理解、檢索與評估方法。
- [台大李宏毅 機器學習 2026 Spring 導讀](/posts/ai/2026-09-30-ntu-ml2026-course-overview)：同樣是中文授課、錄影全開，主軸是 AI Agent 與模型行為。

## 課程影片來源

本文是課程總覽，導言嵌入第 1 週週二的錄影；其餘各週請從官方 README 的週次表查找，各篇導讀也附了對應錄影。

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [第 1 週週二錄影](https://www.youtube.com/watch?v=X7XJcm9wfFA)（導言嵌入，1 小時 25 分）

查核日期：2026-10-14。

## 更新紀錄

- 2026-10-14：正文改寫成導讀：六段主線各自講出機制，補 TF-IDF 手算例子與自我檢查，導言嵌入第 1 週錄影；兩學期對照、README 週次欄、公開程度評級縮成讀法裡的幾句。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（首頁 README，2026 版）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 README：Fall 2025 週次表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [2025 W0_Syllabus.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W0_Syllabus.pdf)
- [2026 Syllabus-115.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Slides/Syllabus-115.pdf)
- [2025 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [2026 Assignments README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2026/Assignments/README.md)
- [2025 Reference notebooks](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Reference)
- [TAICA 114 學年度上學期開設課程清單](https://taicatw.net/fall-114/)
- [TAICA 115 學年度上學期開設課程清單](https://taicatw.net/fall-115/)
- [IKMLab NTHU YouTube 頻道](https://www.youtube.com/@IKMLabNTHU)
- [Fall 2025 Week 1 Tue. 錄影](https://www.youtube.com/live/X7XJcm9wfFA)
- [Fall 2026 Week 1 錄影](https://youtube.com/live/EEbwXXoVQPY)
- [W1_NLP_brief.pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W1_NLP_brief.pdf) — 第 1 週投影片：TF-IDF、BM25、詞彙對不上與 LSA
- [W2_Word embeddings and Language Modeling (RNN).pdf（Fall 2025）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W2_Word%20embeddings%20and%20Language%20Modeling%20%28RNN%29.pdf) — 第 2 週投影片：語言模型、詞向量與 RNN
