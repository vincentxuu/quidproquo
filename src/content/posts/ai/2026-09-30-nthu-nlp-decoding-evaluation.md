---
title: "清大 NLP 導讀 10：同一個模型為什麼會講得呆板或胡言亂語——解碼策略與 NLG 評估"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, decoding, evaluation, metrics, benchmark, nlp]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 10
tldr: "清大高宏宇 NLP（Fall 2025）解碼與評估單元導讀。前半講模型每一步吐出機率分布之後怎麼選字：greedy 一步錯就回不去，beam search 同時保留幾條候選但偏好短句，top-k／top-p 用抽樣換多樣性（投影片沒寫，教授在課堂口頭補）。後半講怎麼替生成的文字打分：BLEU 的 modified precision 與 brevity penalty、ROUGE-N 與 ROUGE-L、perplexity，以及 GLUE、SQuAD 2.0、MTEB、MMLU 這些 benchmark 各自在量什麼。"
description: "清大高宏宇教授自然語言處理（Fall 2025）W5_decoding.pdf 與 Week 7 Tue. 錄影導讀：conditional language model 與 teacher forcing、greedy decoding 的錯誤累積、beam search 的逐步計分與長度正規化、top-k／top-p sampling 與 temperature、停止條件；BLEU 的 modified precision、clipping 與 brevity penalty，ROUGE-N／ROUGE-L，perplexity，人工與自動評估的取捨，以及 GLUE、SQuAD 2.0、MTEB、MMLU 與 TMMLU。"
draft: false
glossary:
  - term: "beam search"
    aliases: ["束搜尋"]
    definition: "解碼時每一步保留分數最高的 k 條候選序列（k 是 beam size），往下各自展開後再留下最好的 k 條，直到停止條件成立。"
    context: "投影片第 15–28 頁用 beam size 2 的逐步例子示範。"
  - term: "top-p sampling"
    aliases: ["nucleus sampling"]
    definition: "把候選字依機率由高到低排，取累加機率剛好超過門檻 p 的那一小群，再從裡面隨機抽一個。候選範圍會隨分布形狀自動變大變小。"
    context: "教授在 Week 7 Tue. 錄影裡口頭說明，投影片本身沒有這一段。"
  - term: "modified n-gram precision"
    definition: "BLEU 的核心：模型輸出裡每個 n-gram 的次數，最多只算到它在任一參考句中出現的最大次數（clipping），避免重複同一個字灌分數。"
    context: "投影片用「the the the the the the」只拿到 1/6 的例子說明。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **本文依據[清大高宏宇教授「自然語言處理」](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025（114-1）的公開教材。** 這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列的第 10 篇，上一篇是 [Hugging Face BERT 助教課與 HW3 多輸出學習](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)。

官方材料是投影片 [W5_decoding.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W5_decoding.pdf)（63 頁，標題「Decoding Strategies and Evaluations for Natural Language Generation」），錄影是 [Week 7 Tue.](https://www.youtube.com/live/NtPrXea8qSE)（約 98 分鐘）。

先釐清錄影對照。[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)的 W7 列同時掛了這份投影片和 Hugging Face 助教課，Topics 欄寫的「Python for text tutorial」是課綱模板，對不上實際內容。我讀了 Week 7 Tue. 的字幕，這一支從開場講解碼一路講到 MMLU，教授在結尾說「今天的講 decoding 跟講評估就到這邊為止」。同週的 [Week 7 Thu.](https://www.youtube.com/live/4qDUML9TeHM) 則是播放 Hugging Face 助教課（這支沒有字幕，我只在第 5、25、50 分鐘截圖確認畫面是助教投影片，內容無法用字幕核對；週二的字幕裡教授也預告週四是助教課），上一篇已經整理過。所以這一講看 W7 Tue. 一支就夠。

## 課程影片來源

影片來源已對照官方課程頁，並於 2026-10-10 即時查核：講次與影片一致，YouTube 公開且可嵌入。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=NtPrXea8qSE
title: Week 7 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=4qDUML9TeHM
title: Week 7 Thu.
```

原始影片：[Week 7 Tue.](https://www.youtube.com/watch?v=NtPrXea8qSE)、[Week 7 Thu.](https://www.youtube.com/watch?v=4qDUML9TeHM)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：Week 7 Tue. 的字幕逐段讀過，文中引述的「通常會很僵硬」、投影片沒寫 top-k／top-p 而口頭補充（含預設 0.9／0.8 與 0.6＋0.2 的例子）、beam size 預設 2 與「三條就很了不起」、MMLU 與 ACL 的提醒，以及結尾「decoding 跟評估到這邊為止」都在字幕裡，也確認教授預告週四是助教課；Week 7 Thu. 的 YouTube 頁面沒有字幕，內容無法核對，「是助教課」只依畫面截圖與週二預告判斷。

## 場景：訓練時有標準答案，測試時沒有

投影片前 10 頁是回顧。語言模型給定前面的字，預測下一個字的機率 P(y<sub>t</sub> | y<sub>1</sub>, …, y<sub>t−1</sub>)。多了一段來源文字 x 的叫 conditional language model，也就是 seq2seq：翻譯、摘要、對話生成都屬於這一類。

訓練時用 [teacher forcing](/posts/ai/2026-09-30-nthu-nlp-transformers)：不管模型上一步猜了什麼，下一步的輸入一律換成正確答案，每個位置的 cross-entropy 加總就是整句的 loss。投影片第 10 頁接著問：**測試的時候沒有正確答案可以餵，下一個字要怎麼決定？**

第 14 頁補了一個容易忽略的前提：下面所有策略都作用在最後一層的輸出上，也就是一個跟字典一樣大的機率分布（投影片舉的例子是 32k 個 token 的機率）。模型架構不變，只換「怎麼從分布裡挑字」，輸出就會很不一樣。

## 解碼：從一條路到好幾條路

### Greedy：每一步挑最大的

投影片用「I love reading books → 我 愛 閱 讀」當例子。greedy decoding 每一步都取 argmax。問題寫在第 13 頁：**greedy 不能反悔**。第三步把「閱」錯成「打」，第四步就順著接「球」，變成「我愛打球」，錯誤一路累積。

教授在錄影裡的形容是：這樣找出來的結果「通常會很僵硬，而且沒什麼變化」，只要中間一個字錯了，接下來就會錯得很離譜。

第 14 頁提出兩個方向：每一步不只留一個選擇。一個方向是**隨機抽樣**（top-k、top-p），一個是**確定性搜尋**（beam search），兩者也可以合用。

### Top-k 與 top-p：投影片沒寫，教授口頭補

這裡有個值得記下的細節。大綱列了「Top-k / Top-p Sampling」，但整份投影片沒有這兩個方法的內容頁。教授在錄影開頭自己說：「這份投影片對 TopK TopP Sampling 並沒有去寫……我等一下用口頭講一下，我是今天才發現這件事情。」以下整理自他在課堂上的口頭說明：

- **Top-k**：取機率前 k 高的字（例如 k = 3），從裡面擲骰子選一個。答案不會每次都一樣，選錯之後也有機會再轉回來，多了 diversity。
- **Top-p**：精神相同，但用累加機率當門檻，他提到預設值常見 0.9 或 0.8。如果第一名是 0.6、第二名是 0.2，加起來還沒超過 p 就繼續往下收。這是在修 top-k 的問題：如果第一名機率已經非常高，後面幾個很低，還要不要硬擲骰子？top-p 讓擲骰子的範圍跟著分布形狀變。他的評語是「通常 top-p 效果會比較好，不過不見得」。
- **Temperature**：如果你只是呼叫 GPT 的 API，大概碰不到每一步的解碼，通常只能設 temperature。這也是同一個問題問兩次、答案會不同的原因。

想看圖解，可以讀 Hugging Face 的 [How to generate text](https://huggingface.co/blog/how-to-generate)。[下一篇 GPT-2／T5 助教課](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization)的投影片第 36–37 頁就引用這篇，並用 `model.generate()` 省掉自己寫解碼迴圈。

### Beam search：同時保留 k 條候選

beam size（也叫 beam width）是超參數，代表每一步保留幾條候選。分數是整條序列的 log 機率總和，越接近 0 越好。投影片第 15–28 頁用 beam size 2 一步一步算：

| 步驟 | 候選與累計分數 | 留下來的 |
|---|---|---|
| t = 1 | I：−0.7；You：−0.9 | 兩條都留 |
| t = 2 | I like：−1.7；I want：−2.9；You want：−1.6；You are：−1.8 | You want、I like |
| 一路到 t = 6 | 展開出「I like to watch horror movies」等候選 | 每步都只留兩條 |

注意 t = 2 時，原本分數較差的 You 那一支反而拿下第一名。greedy 在 t = 1 就把 You 丟了，beam search 多留一條路，才有機會發現這件事。

教授在課堂上補的實務經驗：beam size 預設常設 2，「找三條就很了不起，應該不會再更多了」。做實驗時可以先用寬度 1（等於 greedy）跑，再往上調；效果差不多時才試 3，但 3 可能就跑不太動了。

**停止條件**（第 29 頁）：模型吐出 `<EOS>`，或長度達到預設上限。greedy 和 beam search 都適用。

**beam search 的毛病**（第 30–32 頁）：每多一個字就多加一個負的 log 機率，**越長的候選分數越低**，搜尋會偏好短句。解法是用長度 T 做正規化，把總和除以 T 再比較。

第 33 頁插了一則新聞：Nature 2024 年 10 月的 [Scalable watermarking for identifying large language model outputs](https://www.nature.com/articles/s41586-024-08025-4)，在生成過程中替文字加上浮水印，同時維持文字品質與偵測準確度。它放在解碼段落的最後，因為浮水印正是在「每一步怎麼挑字」這一層動手腳。

## 評估：生成的文字要怎麼打分數

第 35 頁的例子：「I love reading books」可以翻成「我愛閱讀」，也可以是「我愛讀書」。語言有主觀性和多樣性，同一件事有很多種對的說法。評估分成人工與自動兩條，這一講專講自動評估。

### BLEU：看 n-gram 精確度

[BLEU](https://aclanthology.org/P02-1040/)（Papineni et al., 2002）是以詞為單位的指標，所以**對斷詞方式非常敏感**。核心是算 1-gram 到 4-gram 的 precision，分別叫 BLEU-1 到 BLEU-4。

**第一個問題：重複同一個字就能騙分**。第 38–40 頁的例子：

- 參考句 1：I want to read the book.
- 參考句 2：I want to read that book.
- 模型輸出：the the the the the the.

一般 precision 是 6/6，滿分，顯然不對。modified precision 規定：每個字最多只算到它在參考句裡出現的次數，「the」在參考句 1 只出現一次，所以只得 1/6。

**第二個例子**是 BLEU-2（第 42–48 頁）：輸出「The dog the dog on the bed.」有 6 個 bigram。「the dog」出現兩次，但在參考句裡最多出現一次，裁成 1；「dog the」不在任何參考句裡，得 0；「dog on」「on the」「the bed」各 1。modified precision 是 4/6。投影片特別註明：同一個 n-gram 就算同時對到兩份參考句，也只算一次。

**第三個問題：句子越短越佔便宜**。precision 只看輸出裡的字對不對，只輸出兩三個很有把握的字就能拿高分。所以 BLEU 乘上 **brevity penalty**（第 51 頁）：c 是輸出長度，r 是最接近 c 的參考句長度，輸出比參考短就扣分。最後把 1-gram 到 4-gram（N = 4）的 modified precision 取 log 加權平均，原始論文的權重是各 1/4。

### ROUGE：看 recall，主要評摘要

[ROUGE](https://aclanthology.org/W04-1013/)（Lin, 2004）的 ROUGE-N 是以 recall 為基礎的 n-gram 共現統計，ROUGE-L 算最長公共子序列（LCS）。第 52 頁的例子：

- S1（參考）：police killed the gunman
- S2：police kill the gunman
- S3：the gunman kill police

S2 和 S3 的 ROUGE-2 一樣，都只有「the gunman」對到。但 ROUGE-L 分得出來：S2 的 LCS 是「police the gunman」，得 3/4；S3 只有「the gunman」，得 1/2。第四句「the gunman police killed」則反過來：ROUGE-2 比 S2 高，ROUGE-L 比 S2 低。兩個指標各看到不同的東西。

### Perplexity

第 53 頁回顧 perplexity：衡量語言模型能力的量化指標，**越低越好**。它在[詞向量與語言模型](/posts/ai/2026-09-30-nthu-nlp-word-embeddings-language-models)那一講已經出現過，這裡只是放回評估的脈絡。

### 人工還是自動？

第 54 頁的對照：

| | 優點 | 缺點 |
|---|---|---|
| 人工評估 | 處理主觀性比較準，想比什麼都可以設計 | 不夠客觀、費時、昂貴 |
| 自動評估 | 夠客觀，可以當共同指標，快 | 處理不了語言多樣性，翻譯永遠有別的正確譯法 |

## Benchmark：模型能力的共同考卷

投影片最後十頁從「單一輸出怎麼打分」換到「整個模型怎麼比較」。

| Benchmark | 投影片的重點 |
|---|---|
| [GLUE](https://arxiv.org/abs/1804.07461)（ICLR 2019） | 9 個任務，用同一個模型全部做，證明它有通用的語言理解能力。分三類：單句分類（CoLA 文法可接受度、SST-2 情感）、句對分類（MNLI、RTE、WNLI、QNLI 的自然語言推論，QQP、MRPC 的改寫判斷）、文字相似度（STS-B）。取 9 項平均，人類 baseline 平均 87.6 |
| [SQuAD](https://rajpurkar.github.io/SQuAD-explorer/) | 閱讀理解：群眾外包人員就維基百科文章出題，答案是原文的一段。1.1 版有 10 萬多組問答、500 多篇文章；[2.0 版](https://arxiv.org/abs/1806.03822)再加 5 萬題看起來很像、但無法回答的問題，系統要學會在原文沒有答案時拒答 |
| [MTEB](https://arxiv.org/abs/2210.07316) | 評 embedding 模型，8 類任務，各用不同指標（nDCG@10、Recall@k、accuracy、F1、V-measure、Spearman 等）。投影片寫的當時第一名是 Qwen-Embedding-8B（70.58），[排行榜](https://huggingface.co/spaces/mteb/leaderboard)會變動 |
| [MMLU](https://arxiv.org/abs/2009.03300) | 57 個科目（STEM、人文、社會科學等）的選擇題，只用 zero-shot 與 few-shot 設定，量模型在預訓練時學到的知識。投影片也列了「TMMLU, MediaTek」，並附上聯發科研究團隊的繁體中文評測論文 [arXiv 2309.08448](https://arxiv.org/abs/2309.08448) |

GLUE 表裡的 STS-B 和 RTE、MNLI 值得多看一眼。上一篇 HW3 做的 relatedness 回歸加 entailment 分類，就是這兩類任務的組合。

第 62 頁還區分了三種資料：in-domain（和訓練資料同分布）、out-of-domain（內容、風格或情境明顯不同，例如用科技新聞訓練、拿健康文章測試）、open-domain（不限主題）。benchmark 分數要放在這個框架下解讀。

教授講到 MMLU 時提醒：這類資料集基本上不提供訓練資料，大家都是直接評估，或拿其中一兩題當 in-context learning 的範例。他也提到近年 ACL 等頂會有很多論文在研究「怎麼評估大語言模型」本身。

## 動手

- 用 Hugging Face 的 `model.generate()` 拿同一個小模型（例如 GPT-2）生成同一段開頭四次：`num_beams=1`、`num_beams=3`、`do_sample=True, top_k=3`、`do_sample=True, top_p=0.9`，比較輸出的重複程度。
- 用紙筆重算投影片第 48 頁的 BLEU-2 modified precision，再把輸出改成「the bed」兩個字，看 precision 和 brevity penalty 各怎麼變。
- 拿 S1–S4 四句算 ROUGE-2 與 ROUGE-L，確認投影片第 52 頁的大小關係。

**延伸閱讀**：[CS224U 方法與指標 I](/posts/ai/2026-09-29-cs224u-methods-metrics) 把 BLEU、perplexity 的弱點講得更細；[CS224N 第 11 講：Benchmark 與 LLM 評估為什麼會過期](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)接著討論 benchmark 飽和與污染；[CME295 第 8 講](/posts/ai/2026-09-29-cme295-llm-evaluation)談用 LLM 評 LLM。

## 材料缺口

- Top-k／top-p 沒有投影片，本文這一段完全依據錄影字幕。字幕有辨識錯字（例如把 threshold 寫成「stress hold」），引述時我只取意思明確的句子。
- BLEU 與 perplexity 的公式在投影片上是圖片，本文只轉述投影片標出的符號定義，沒有重抄公式。
- 這一講沒有對應作業。解答、測驗與討論區在 NTU COOL，校外讀者拿不到。
- Fall 2026 的這一講還沒公開。依[全球課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，Fall 2025 是 A3（足以自學）。

**系列導覽**：上一篇 [Hugging Face BERT 助教課與 HW3 多輸出學習](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)｜下一篇 [GPT-2／T5 中文摘要實作](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。對照官方課程頁與 YouTube，講次與嵌入影片一致、可公開嵌入，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。Week 7 Tue. 的說法皆有字幕依據；Week 7 Thu. 沒有字幕，標明無法核對。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [W5_decoding.pdf（Decoding Strategies and Evaluations for NLG 投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/W5_decoding.pdf)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 7 Tue.](https://www.youtube.com/live/NtPrXea8qSE)
- [錄影：[Fall 2025] Week 7 Thu.（Hugging Face 助教課播放）](https://www.youtube.com/live/4qDUML9TeHM)
- [Papineni et al. (2002). BLEU: a Method for Automatic Evaluation of Machine Translation](https://aclanthology.org/P02-1040/)
- [Lin (2004). ROUGE: A Package for Automatic Evaluation of Summaries](https://aclanthology.org/W04-1013/)
- [Wang et al. (2019). GLUE: A Multi-Task Benchmark and Analysis Platform for Natural Language Understanding](https://arxiv.org/abs/1804.07461)
- [SQuAD Explorer](https://rajpurkar.github.io/SQuAD-explorer/)
- [Rajpurkar, Jia & Liang (2018). Know What You Don't Know: Unanswerable Questions for SQuAD](https://arxiv.org/abs/1806.03822)
- [Muennighoff et al. (2022). MTEB: Massive Text Embedding Benchmark](https://arxiv.org/abs/2210.07316)
- [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard)
- [Hendrycks et al. (2020). Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300)
- [Hsu et al. (2023). Advancing the Evaluation of Traditional Chinese Language Models: Towards a Comprehensive Benchmark Suite](https://arxiv.org/abs/2309.08448)
- [Dathathri et al. (2024). Scalable watermarking for identifying large language model outputs, Nature](https://www.nature.com/articles/s41586-024-08025-4)
- [Hugging Face Blog: How to generate text](https://huggingface.co/blog/how-to-generate)
