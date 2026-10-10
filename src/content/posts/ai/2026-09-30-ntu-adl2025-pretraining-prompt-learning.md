---
title: "台大陳縕儂 ADL 2025 Fall 導讀：預訓練三大類與 Prompt Learning——從 BERT、GPT、T5 到「人不懂沒關係機器懂就好」"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, pretraining, prompt-engineering, scaling-laws, nlp]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 8
tldr: "ADL Fall 2025 第 6 講把預訓練模型分成三類：encoder（BERT 家族，雙向上下文）、decoder（GPT 系列，擅長生成）、encoder-decoder（BART、T5，用去噪目標預訓練）。接著點出預訓練模型時代的兩個實際難關：下游標註資料少，以及模型越來越大、每個任務各存一份放不下。講義的解法是 prompt learning：先用 GPT-3 的 in-context learning 說明「不更新參數也能做任務」，再從人寫的 hard prompt（prompt template＋verbalizer、LM-BFF）走到直接優化向量的 soft prompt（P-Tuning、Prefix-Tuning、Prompt Tuning），最後用 Liu 等人的 prompting 分類法收尾。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 8 篇導讀，依 250915_Pretraining.pdf（67 頁）與影片 6.1–6.6：預訓練的定義與資料、三種預訓練架構、GPT／GPT-2／GPT-3、BART 與 T5 的去噪目標、fine-tuning vs in-context learning、scaling laws（Kaplan、Hoffmann）、訓練成本、hard prompt 與 LM-BFF、P-Tuning、Prefix-Tuning、Prompt Tuning、prompting paradigm。"
draft: false
glossary:
  - term: "Verbalizer"
    aliases: ["標籤詞映射"]
    definition: "prompt-based 微調裡，把語言模型在 [MASK] 位置預測的詞對應回任務標籤的映射，例如 yes → entailment、maybe → neutral、no → contradiction。"
    context: "ADL 講義把 prompt-tuning 拆成 prompt template、PLM、verbalizer 三個元件。"
  - term: "Soft Prompt"
    aliases: ["continuous prompt", "連續提示"]
    definition: "不是人看得懂的文字，而是一組直接用梯度優化的 embedding 向量，接在輸入前面引導凍結的預訓練模型。"
    context: "影片 6.5 的副標「人不懂沒關係機器懂就好」說的就是它。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)9/15 那一週的教材。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列第 8 篇。[第 6 篇](/posts/ai/2026-09-30-ntu-adl2025-bert-family)講了 BERT 與它的家族，[上一篇 HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) 把 BERT 用在中文抽取式問答。這一篇把視角拉高：**encoder-only、decoder-only、encoder-decoder 差在哪？模型變大之後，為什麼可以只給 prompt 就做任務？**

用到的官方材料：

- 講義 [250915_Pretraining.pdf](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf)（67 頁，標題 Pretraining & Prompt Learning）。封面註明部分投影片取材自 Mohit Iyyer（UMass）與李宏毅。
- 影片：[6.1 Pretraining 預訓練](https://youtu.be/suX2F2TqKuE)（9:23）、[6.2 Encoder-Only, Decoder-Only, Encoder-Decoder Pretraining 常見三大類預訓練模型](https://youtu.be/cnd91AbBQ74)（33:38）、[6.3 Issues of PLMs 預訓練模型世代的難關](https://youtu.be/tdMuyQO6kLs)（21:39）、[6.4 (Hard) Prompt-Tuning, LM-BFF 用自然語言提示模型](https://youtu.be/fpNxjqJjtT4)（15:55）、[6.5 (Soft) Prompt-Tuning (P-Tuning, Prefix Tuning) 人不懂沒關係機器懂就好](https://youtu.be/Wrzz7mG1ZDU)（7:13）、[6.6 Prompting Paradigm 基於提示的研究大補帖](https://youtu.be/CCZfyLCNrQk)（15:43）
- 補充：播放清單上的 [6.0 QA](https://youtu.be/-3mUrFm8lIo)（26:15）是課堂問答，沒有講義。

存取等級沿用系列的 **A2**：本講的講義與影片都公開，本週沒有新作業（HW2 的題目在[第 10 篇](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2)，只有說明影片）。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=suX2F2TqKuE
title: 6.1
```

```youtube
url: https://www.youtube.com/watch?v=cnd91AbBQ74
title: 6.2
```

原始影片：[6.1](https://www.youtube.com/watch?v=suX2F2TqKuE)、[6.2](https://www.youtube.com/watch?v=cnd91AbBQ74)、[6.3](https://www.youtube.com/watch?v=tdMuyQO6kLs)、[6.4](https://www.youtube.com/watch?v=fpNxjqJjtT4)、[6.5](https://www.youtube.com/watch?v=Wrzz7mG1ZDU)、[6.6](https://www.youtube.com/watch?v=CCZfyLCNrQk)、[6.0 QA](https://www.youtube.com/watch?v=-3mUrFm8lIo)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

## 預訓練是什麼

講義第 2 頁的比喻：先讀教科書學通識，再去考特定科目。預訓練就是在大量、多樣的資料上先訓練模型，之後再針對特定任務微調。三個關鍵步驟是大規模多樣資料、self-supervised learning、學到通用表示；換來的是可擴展、可泛化、可遷移。

資料從哪裡來？第 3 頁以 BookCorpus（smashwords.com 上的免費書）為例；第 4 頁提到網路規模資料的「合理使用 vs. 著作權」問題：各國法規還在演變，沒有統一標準。

## 三種預訓練架構

第 5 頁的表是整講的地圖，後面反覆出現：

| 類型 | 特性 | 例子 |
|---|---|---|
| Encoder | 雙向上下文 | BERT 與它的變體 |
| Decoder | 語言模型，適合生成 | GPT、GPT-2、GPT-3 |
| Encoder-Decoder | sequence-to-sequence | Transformer、BART、T5 |

### Encoder：BERT 家族

第 7–8 頁快速回顧：BERT 用 masked LM 隨機遮 15% 的 token；RoBERTa 主要是用更多資料訓練更久，SpanBERT 遮連續的 span，讓預訓練任務更難也更有用。細節在[第 6 篇](/posts/ai/2026-09-30-ntu-adl2025-bert-family)。

### 為什麼還需要 decoder

第 9 頁講清楚 encoder 的限制：BERT 這類預訓練 encoder **不會自然地一個字一個字生成**。例子是「Vivian goes to [MASK] tasty tea」：encoder 只能填空，decoder 則能從「Vivian goes to」一路接著寫出「make tasty tea」。

### Decoder：GPT 系列

- **GPT**（[Radford 等人 2018](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)）：Transformer decoder，在 BooksCorpus（約 7000 本書、5GB）上預訓練；12 層、768 維 hidden、3072 維 feed-forward、BPE 做 40,000 次合併。下游用監督式微調，微調時保留 next-word prediction。
- **GPT-2**（[Radford 等人 2019](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)）：更多資料（來自 Reddit 的 WebText，40GB），適合自然語言生成。
- **GPT-3**（[Brown 等人 2020](https://arxiv.org/abs/2005.14165)）：更多資料，來源包括 Common Crawl、WebText2、Books1＆Books2、英文 Wikipedia。

第 15 頁把三代並排：GPT 117M 參數、GPT-2 1.5B、GPT-3 175B；GPT-4（2023）與 GPT-5（2025）兩列的參數與資料量都寫「?」——講義誠實標出這些數字沒有公開。

### Encoder-Decoder：BART 與 T5

第 17 頁說明這類架構的分工：encoder 享有雙向上下文，decoder 負責用語言模型的方式訓練整個模型。預訓練目標是 **span corruption（去噪）**，在前處理時就做好。

兩個模型的差別在第 18 頁用同一個句子示範（Thank you for inviting me to your party last week）：

- **[BART](https://arxiv.org/abs/1910.13461)**：輸入被挖空的句子，**輸出整句**原文。
- **[T5](https://arxiv.org/abs/1910.10683)**：輸入把挖空處換成 `<X>`、`<Y>` 這類標記，**只輸出缺掉的部分**：`<X> for inviting <Y> last <Z>`。

微調做分類時也不同（第 19 頁）：BART 把輸入在 decoder 重複一次、用最後的輸出預測標籤；T5 則把分類也當成 seq2seq，直接生成標籤文字。第 22 頁點出 T5 的多任務預訓練「用 seq2seq 學多個任務」，講義註解這和現在的 post-training 流程很像——這是[下一篇後訓練](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)的伏筆。

第 23 頁把兩者並排比較：BART 的訓練資料約是 T5 的 2 倍；位置編碼上 BART 用可學的絕對位置、T5 用相對位置；講義附的理解與摘要任務表中，BART 在多數欄位分數較高。

## 預訓練模型時代的兩個難關

影片 6.3 的副標叫「預訓練模型世代的難關」。第 24 頁先定義標準做法：用預訓練模型初始化，再針對下游任務調整參數。問題有兩個。

### 難關一：標註資料少

第 25 頁列出 GLUE 各任務的資料量，從 MNLI 的 391K 到 RTE 的 2.5K，差了兩個數量級。講義的結論是：**更實際的情況是 few-shot、one-shot 甚至 zero-shot。**

這時 GPT-3 的 **in-context learning** 登場（第 26–28 頁）。和 fine-tuning 對照：

- **Fine-tuning**：預訓練後，用任務的標註資料更新模型參數。
- **In-context learning**：預訓練後**不再學習**，只在輸入裡給說明和少數範例。

講義用一個很在地的例子：英檢的「詞彙與結構」題型說明加一題例題（正確答案為 D），就是在給模型「少數範例」。zero-shot、one-shot、few-shot 的差別只在範例給幾個。

### 難關二：模型太大

第 33 頁把模型尺寸排成一張表，從 ELMo 93M、BERT-Base 110M、BERT-Large 340M，到 GPT-3 的八種尺寸，最大的 175B 有 96 層。大模型表現更好（第 34–35 頁），但代價是：

- **訓練成本**：第 37–38 頁引用 [Sevilla 等人 2022](https://arxiv.org/abs/2202.05924) 的算力趨勢分析。
- **Scaling laws**：第 39 頁的 [Kaplan 等人 2020](https://arxiv.org/abs/2001.08361)描述模型品質如何隨模型大小 N、資料量 D、算力 C 變化，可以用來預測表現、分配資源；第 40 頁的 [Hoffmann 等人 2022](https://arxiv.org/abs/2203.15556)則指出模型大小和訓練 token 數應該**等比例**擴大——Chinchilla 模型比其他更大的模型小，卻表現更好，講義註解這對微調和推論都有利。
- **儲存空間**：第 41 頁，每個任務都要存一份完整模型。一個 11B 參數的模型，三個任務就是三份 11B。

第 42 頁把兩個難關收成一句：**解法是 prompt learning。**

## Hard prompt：用自然語言提示模型

第 45–46 頁用 NLI 例子對照兩種做法。原本要在 `[CLS] 前提 [SEP] 假設 [SEP]` 後面接分類器預測 neutral／contradiction／entailment；prompt 版本則把輸入改寫成「Vivian likes dancing. Is it true that Vivian loves singing?」，讓模型直接回答 maybe／no／yes。

第 47–50 頁把 prompt-tuning 拆成三個元件：

1. **Prompt template**：人為設計的自然語言輸入格式，例如 `前提? [MASK], 假設`。
2. **PLM**：做語言模型預測（masked LM 或自回歸 LM 都可以）。
3. **Verbalizer**：把詞彙映射回標籤，例如 yes → entailment、maybe → neutral、no → contradiction。

第 51–52 頁：少量標註資料就能微調，zero-shot 時甚至完全不調參數。講義引用 [Le Scao 與 Rush 2021](https://arxiv.org/abs/2103.08493) 說明資料稀少時 prompt-tuning 表現較好，因為它更能利用、也能保留預訓練學到的知識。

**LM-BFF**（[Gao 等人 2021](https://arxiv.org/abs/2012.15723)，第 53–54 頁）再往前一步：prompt 加上示範例子（demonstration），並自動生成 template；講義附的是用 RoBERTa-Large 的結果。

## Soft prompt：人不懂沒關係，機器懂就好

Hard prompt 的問題在第 55 頁：

- 人覺得合理的 prompt，對模型不一定有效（講義引 Liu 等人 2021）。
- 預訓練模型對 prompt 的選擇很敏感（[Zhao 等人 2021](https://arxiv.org/abs/2102.09690)）。

所以乾脆不找文字，直接優化向量：

| 方法 | 做法 | 講義重點 |
|---|---|---|
| [P-Tuning](https://arxiv.org/abs/2103.10385)（Liu 等人 2021） | 直接優化 prompt 的 embedding，而不是找 prompt 文字 | 例子：為「The capital of Britain is [MASK]」搜尋 prompt |
| [Prefix-Tuning](https://arxiv.org/abs/2101.00190)（Li 與 Liang 2021） | 只優化**每一層**的 prefix embedding | 訓練時間與空間更有效率 |
| [Prompt Tuning](https://arxiv.org/abs/2104.08691)（Lester 等人 2021） | 每個任務只存一小段 prompt（**只在一層**），推論時可以混合不同任務共用同一個原始模型 | 表現有競爭力，空間效率更好 |

第 59 頁把 fine-tuning、prefix-tuning、hard 與 soft prompt-tuning 並排比較表現與空間效率。這條線直接接到[第 10 篇 PEFT](/posts/ai/2026-09-30-ntu-adl2025-peft-lora-hw2)：Adapter 與 LoRA 也是在回答「不動整個大模型，只調一小部分」。

## Prompting paradigm：一張分類地圖

第 60–66 頁依 [Liu 等人 2021 的綜述](https://arxiv.org/abs/2107.13586)，把 prompting 研究分成五個維度，影片 6.6 叫它「基於提示的研究大補帖」：

- **預訓練模型**：left-to-right LM（GPT 系列）、masked LM（BERT、RoBERTa）、prefix LM（UniLM）、encoder-decoder（T5、BART）。
- **Prompt engineering**：形狀（cloze 填空 vs. prefix 前綴）、人工設計 vs. 自動（離散如 LM-BFF，連續如 Prefix-Tuning）。
- **Answer engineering**：答案的形狀（token、span、句子）與設計方式。
- **Multi-prompt learning**：ensemble、augmentation、composition、decomposition、sharing。
- **Training strategies**：哪些參數要調——promptless fine-tuning（BERT）、tuning-free prompting（GPT-3）、fixed-LM prompt tuning（Prefix-Tuning）、fixed-prompt LM tuning（T5）、prompt＋LM tuning（P-Tuning）。

最後這個維度最實用：拿到一篇新方法，先問它**調模型參數、調 prompt 參數，還是都不調**。

## 讀完這篇能做什麼

- 看到一個模型名稱，說出它屬於 encoder、decoder 還是 encoder-decoder，以及預訓練目標是什麼。
- 解釋 fine-tuning 和 in-context learning 的差別，以及 scaling laws 在資源分配上回答什麼問題。
- 區分 hard prompt（template＋verbalizer、LM-BFF）和 soft prompt（P-Tuning、Prefix-Tuning、Prompt Tuning）在「調什麼、存什麼」上的不同。

**怎麼做**：拿[上一篇 HW1](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa) 的 paragraph selection 當例子，試著把它改寫成 prompt 形式：設計一個 template（例如「問題：…段落：…這段能回答問題嗎？[MASK]」）和一個 verbalizer（能／不能），再對照講義第 61–66 頁，寫下這個做法在五個維度上各屬於哪一格。

## 本文能確認與不能確認的

能確認：講義 67 頁的每頁標題、列點與表格文字，影片標題與長度（播放清單核對），上面每篇 arXiv 論文的標題（arXiv 核對）。

不能確認：本文沒有逐字聽寫影片，老師口頭補充的例子與評論沒有寫進來。講義中的圖表（GPT-3 各任務表現、訓練成本、scaling laws、LM-BFF 與 prompt tuning 的結果）只轉述標題與結論，數字請以原論文為準。GPT-3 資料量講義寫 45TB，這是講義的數字，本文沒有另外核對原論文的前處理前後定義。

延伸閱讀：站上 [CS224N 第 7 講：預訓練](/posts/ai/2026-08-22-cs224n-pretraining)講同樣的三種架構與 in-context learning；[CS336 的 scaling laws 基礎](/posts/ai/2026-08-22-cs336-scaling-laws-foundations)把 Kaplan 與 Chinchilla 講得更深；[CS224U 的 in-context learning](/posts/ai/2026-09-29-cs224u-in-context-learning)從 prompt 設計與 DSPy 的角度延伸。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [HW1 中文抽取式問答](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa)｜下一篇 [後訓練：Instruction Tuning、RLHF 與 InstructGPT](/posts/ai/2026-09-30-ntu-adl2025-post-training-rlhf)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [250915_Pretraining.pdf（Pretraining & Prompt Learning）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250915_Pretraining.pdf)
- [2025 Fall 台大資訊 深度學習之應用 播放清單](https://www.youtube.com/playlist?list=PLOAQYZPRn2V7gGW7bEjGnHD3BVQepF82o)
- 影片：[6.1](https://youtu.be/suX2F2TqKuE)、[6.2](https://youtu.be/cnd91AbBQ74)、[6.3](https://youtu.be/tdMuyQO6kLs)、[6.4](https://youtu.be/fpNxjqJjtT4)、[6.5](https://youtu.be/Wrzz7mG1ZDU)、[6.6](https://youtu.be/CCZfyLCNrQk)、[6.0 QA](https://youtu.be/-3mUrFm8lIo)
- [Improving Language Understanding by Generative Pre-Training（GPT，OpenAI 2018）](https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf)
- [Language Models are Unsupervised Multitask Learners（GPT-2，OpenAI 2019）](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [Language Models are Few-Shot Learners（GPT-3，arXiv 2005.14165）](https://arxiv.org/abs/2005.14165)
- [BART（arXiv 1910.13461）](https://arxiv.org/abs/1910.13461)
- [Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer（T5，arXiv 1910.10683）](https://arxiv.org/abs/1910.10683)
- [Scaling Laws for Neural Language Models（arXiv 2001.08361）](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models（Chinchilla，arXiv 2203.15556）](https://arxiv.org/abs/2203.15556)
- [Compute Trends Across Three Eras of Machine Learning（arXiv 2202.05924）](https://arxiv.org/abs/2202.05924)
- [How Many Data Points is a Prompt Worth?（arXiv 2103.08493）](https://arxiv.org/abs/2103.08493)
- [Making Pre-trained Language Models Better Few-shot Learners（LM-BFF，arXiv 2012.15723）](https://arxiv.org/abs/2012.15723)
- [Calibrate Before Use（arXiv 2102.09690）](https://arxiv.org/abs/2102.09690)
- [GPT Understands, Too（P-Tuning，arXiv 2103.10385）](https://arxiv.org/abs/2103.10385)
- [Prefix-Tuning（arXiv 2101.00190）](https://arxiv.org/abs/2101.00190)
- [The Power of Scale for Parameter-Efficient Prompt Tuning（arXiv 2104.08691）](https://arxiv.org/abs/2104.08691)
- [Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP（arXiv 2107.13586）](https://arxiv.org/abs/2107.13586)
