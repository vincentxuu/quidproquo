---
title: "清大 NLP 導讀 11：GPT-2 和 T5 拿來做中文摘要，實作上差在哪——left padding、−100 與 ROUGE"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, gpt-2, hugging-face, fine-tuning, chinese-nlp, pytorch, nlp]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 11
tldr: "清大高宏宇 NLP（Fall 2025）GPT-2／T5 助教課導讀。同一個任務（LCSTS 中文摘要）用兩種架構各做一次：decoder-only 的 GPT-2 用原生 PyTorch，要自己把文章和摘要接成一條序列、改用 left padding、把 padding 的標籤設成 −100；encoder-decoder 的 mT5 用 Seq2SeqTrainer，不需要 left padding，DataCollatorForSeq2Seq 會自動處理 −100。兩邊都用 jieba 斷詞後算詞級 ROUGE。"
description: "清大高宏宇教授自然語言處理（Fall 2025）huggingface_tutorial_gpt2_t5.pdf、Reference/gpt2_summarization.ipynb 與 t5_summarization.ipynb 導讀，錄影為 Week 9 Tue.：causal LM、masked LM 與 seq2seq 的差別，LCSTS 資料集，uer/gpt2-chinese-cluecorpussmall 的 [CLS]／[SEP]／<|endoftext|> 格式、left padding、labels 設 −100、model.generate 與 max_new_tokens，mT5-small 的前處理、DataCollatorForSeq2Seq 與 Seq2SeqTrainer，以及 ROUGE-1／2／L 與 jieba 詞級評估。"
draft: false
glossary:
  - term: "left padding"
    aliases: ["左側補齊"]
    definition: "把一個 batch 裡較短的序列從左邊補上 padding token，讓所有序列的最後一個真實 token 對齊在同一欄。"
    context: "decoder-only 模型生成時新的 token 接在序列最右邊，右側補齊會讓新字接在 padding 後面。投影片第 18 頁用這個理由說明 GPT-2 要用 left padding。"
  - term: "labels = −100"
    definition: "PyTorch 的 CrossEntropyLoss 預設 ignore_index 是 −100，Hugging Face 模型沿用這個慣例：標籤是 −100 的位置不計入 loss。"
    context: "GPT-2 notebook 手動把 padding 位置的標籤換成 −100；T5 由 DataCollatorForSeq2Seq 代勞。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-gpt2-t5-summarization-en)

> **本文依據[清大高宏宇教授「自然語言處理」](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025（114-1）的公開教材。** 這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列的第 11 篇，上一篇是[解碼策略與 NLG 評估](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)。

上一篇講完解碼策略和 ROUGE，這一篇把兩者放進一個真的會跑的程式。官方材料：

- 助教課投影片 [huggingface_tutorial_gpt2_t5.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_gpt2_t5.pdf)（63 頁，封面日期 2024/11/05）
- [gpt2_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/gpt2_summarization.ipynb) 與 [t5_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/t5_summarization.ipynb)
- 錄影 [Week 9 Tue.](https://www.youtube.com/live/zgjO_t5eu_E)（約 96 分鐘）

[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)把這份投影片和 PEFT 投影片一起掛在 W9 列，兩支錄影沒標哪支是助教課。我的確認方式：Week 9 Tue. 在第 10、40、75 分鐘的畫面分別是這份投影片的第 9、26、50 頁，所以這一支是助教課。[Week 9 Thu.](https://www.youtube.com/live/zWMHxXc0QvA) 的字幕開頭教授說「這部分的投影片是本來排定在第九週上的這個 PEFT」，是[下下篇](/posts/ai/2026-09-30-nthu-nlp-peft)的內容。W9 列 Topics 欄寫的「BERT and its Family」是課綱模板，不引用。

這份助教課和 [HF BERT 助教課](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)一樣是 2024 年版，沒有對應的作業，定位是參考實作。

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=zgjO_t5eu_E
title: Week 9 Tue.
```

```youtube
url: https://www.youtube.com/watch?v=zWMHxXc0QvA
title: Week 9 Thu.
```

原始影片：[Week 9 Tue.](https://www.youtube.com/watch?v=zgjO_t5eu_E)、[Week 9 Thu.](https://www.youtube.com/watch?v=zWMHxXc0QvA)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 一個任務、兩種架構

投影片第 2 頁定了範圍：用 cross-entropy 訓練 GPT-2 和 T5 做**中文抽象式摘要**，主要套件是 PyTorch、Hugging Face、ROUGE。第 5 頁先分清兩種摘要：

- **抽取式**（extractive）：從原文挑出重要句子。
- **抽象式**（abstractive）：可以寫出原文沒有的詞句。投影片的例子是把「road toll stands at zero」改寫成「slashes road toll」。

資料集是 [LCSTS](https://aclanthology.org/D15-1229/)（Hu et al., EMNLP 2015），大規模中文短文摘要資料，從 Hugging Face 的 [`hugcyp/LCSTS`](https://huggingface.co/datasets/hugcyp/LCSTS) 載入。第 30 頁提醒：測試集沒有公開的摘要，所以兩份 notebook 都只用 train 和 validation。

第 10–14 頁把三種模型並排，這張表是整份教材的地圖：

| 類型 | 代表 | 訓練目標 | Hugging Face 類別 |
|---|---|---|---|
| Causal LM | GPT | 預測下一個字 | `AutoModelForCausalLM`／`GPT2LMHeadModel` |
| Masked LM | BERT | 猜被遮住的字 | `AutoModelForMaskedLM`／`BertForMaskedLM` |
| Seq2seq | T5、原始 Transformer | encoder 讀來源，decoder 生成目標 | `AutoModelForSeq2SeqLM`／`T5ForConditionalGeneration` |

為什麼選 GPT-2？第 4 頁給三個理由：它是 OpenAI GPT 系列最後一個開源模型；語言生成很難，GPT-2 是好的起點；而且不大，便宜的機器也跑得動。第一點是 2024 年投影片的說法，OpenAI 之後又釋出了開放權重的 [gpt-oss](https://github.com/openai/gpt-oss)；另外兩點今天仍然成立。四種規模分別是 124M（12 層）、345M（24 層）、762M（36 層）、1.5B（48 層）。

投影片的分工也很清楚：**GPT-2 用原生 PyTorch 寫，T5 用 Hugging Face Dataset 加 Trainer**。第 22 頁的理由是：語言生成很複雜，建議第一份程式先用原生 PyTorch 寫，看清楚每一步。

## GPT-2：把文章和摘要接成一條序列

### 模型與 tokenizer

模型是 [`uer/gpt2-chinese-cluecorpussmall`](https://huggingface.co/uer/gpt2-chinese-cluecorpussmall)。第 25 頁點出一個容易踩到的細節：**這個中文 GPT-2 用的是 BertTokenizer**。所以序列裡看得到 `[CLS]`、`[SEP]`、`[PAD]`，而不是英文 GPT-2 那套。notebook 另外加了一個 `<|endoftext|>` 當 eos token，再呼叫 `model.resize_token_embeddings(len(tokenizer))`。第 21 頁解釋：擴大詞表會在嵌入矩陣尾端補上新初始化的向量。

也因為是 BERT 的字典，notebook 先把「：，“”？……！」換成半形標點，註解寫明是「避免 OOV token 被轉成 [UNK]」。

### 訓練資料長什麼樣

decoder-only 模型沒有獨立的 encoder，文章和摘要必須接成一條序列。`collate_fn` 產生的格式是：

```text
[CLS] 原文 [SEP] 摘要 <|endoftext|>
```

第 26 頁引用 GPT-2 論文：英文 GPT-2 在文章後面加「TL;DR:」誘導摘要行為。這裡的設計是希望模型把 `[SEP]` 學成「開始寫摘要」的訊號，把 `<|endoftext|>` 學成「停筆」的訊號。投影片也註明 `[CLS]` 可以省略，只要訓練和推論一致即可。

### Left padding 與 −100

這是整份教材的重點，放在第 18–20、27 頁。

**為什麼要 left padding？** 一個 batch 裡句子長短不一，要補齊。如果 padding 補在右邊，生成時新的 token 會接在 `<pad>` 後面，這不合邏輯。改成補在左邊，每句的最後一個真實 token 對齊在同一欄，新 token 也就接在正確的位置。所以 tokenizer 載入時要指定 `padding_side="left"`。

**為什麼 padding 的標籤要設 −100？** causal LM 的標籤基本上就是 `input_ids` 本身，模型內部會自動把 logits 和 labels 錯開一位（第 28 頁引了 `modeling_gpt2.py` 那兩行）。但 padding 不該計入 loss。第 20 頁引用的文件寫得很清楚：標籤是 −100 的位置會被忽略，只有 [0, vocab_size] 範圍內的標籤計算 loss。notebook 的做法：

```python
labels = torch.where(
    condition=complete_text.input_ids != tokenizer.pad_token_id,
    input=complete_text.input_ids,
    other=-100,
)
```

第 27 頁的圖示：左邊補了兩個 `[PAD]` 的句子，標籤前兩格就是 −100。

投影片第 19 頁把組合列成兩種：微調時「left padding＋−100」（本教材）或「right padding＋−100」都行；推論時要嘛 batch size 設 1（本教材的驗證 batch size 就是 1），要嘛用 left padding。

我讀程式時注意到一點：這裡只遮掉 padding，原文的部分也算進了 loss。也就是說，模型同時在學「續寫新聞原文」和「寫摘要」。只對摘要部分算 loss 是常見的改法，可以當練習。

### 生成與評估

推論時只餵 `[CLS] 原文 [SEP]`，呼叫 `model.generate()`。第 37 頁列出它的兩個好處：不用自己寫解碼迴圈，也不用自己實作解碼策略（上一篇講的 greedy、beam、top-k、top-p）。

兩個參數投影片特別提醒：

- **`max_new_tokens=200`**：不設的話，Hugging Face 會把輸入的 token 也算進長度上限（第 41 頁）。
- **`pad_token_id=tokenizer.eos_token_id`**：同一個 batch 裡先寫完的句子，尾巴要補 `<|endoftext|>` 而不是 `[PAD]`（第 42 頁）。

拿到輸出後，用 `[SEP]` 切出摘要部分、去掉空白、截到 `<|endoftext|>` 為止。訓練每 1,000 步用驗證集前 100 筆快速檢查一次，每個 epoch 結束跑完整驗證集。超參數是 batch size 32、learning rate 1e-5、3 個 epoch、AdamW。

## T5：交給 Seq2SeqTrainer

第 49 頁起換 T5（[Raffel et al., JMLR 2020](https://jmlr.org/papers/v21/20-074.html)）。中文摘要用的是多語版 [`google/mt5-small`](https://huggingface.co/google/mt5-small)。第 54 頁用兩個問答點出和 GPT-2 的差別：

- **要 left padding 嗎？** 不用。seq2seq 模型先用 encoder 壓縮輸入，生成是 decoder 從頭開始寫，輸入怎麼補齊不影響新 token 的位置。
- **要自己加 EOS 嗎？** 不用。mT5 有 `</s>` 當 EOS。

前處理用 `datasets` 的 `map()`：原文 tokenize 成 `input_ids`，摘要用 `tokenizer(text_target=..., max_length=200)` tokenize 後放進 `labels`。notebook 把處理好的資料用 pickle 存起來，因為前處理很花時間。

**−100 誰來設？** `DataCollatorForSeq2Seq` 會動態補齊每個 batch，並把 labels 的 padding 換成 −100，做的事跟 GPT-2 那邊手寫的 `collate_fn` 類似（第 57 頁）。反過來，評估時 `compute_metrics` 要先把 −100 換回 pad token 才能 decode，因為 −100 不在字典裡（第 59 頁）。

訓練用 `Seq2SeqTrainingArguments` 加 `Seq2SeqTrainer`：learning rate 2e-5、batch size 32、3 個 epoch、每 1,000 步用 100 筆的小驗證集評估、`predict_with_generate=True`。第 60 頁提醒：預設解碼是 greedy，而 Seq2SeqTrainer 只支援 beam search 這一種替代方案。

## ROUGE 與中文斷詞

第 33–34 頁回顧 ROUGE（上一篇講過定義），補了兩個實務細節：

1. 現在的論文預設報 **ROUGE-F**，也就是 ROUGE-1F、2F、LF，不是只報 recall。第 34 頁用「The cat sat on the mat」對「A cat was sitting on the mat」算出 ROUGE-1 的 recall 4/7、precision 4/6，再取調和平均。
2. 中文要先決定「詞」是什麼。第 44 頁對照：字級 bigram 是（看、電）（電、視），詞級 bigram 是（看、電視）。兩份 notebook 都先用 [jieba](https://github.com/fxsjy/jieba) 斷詞、以空白串起來，再交給 [`rouge`](https://github.com/pltrdy/rouge) 套件算詞級分數，`avg=True` 取所有樣本平均。

換句話說，你看到的 ROUGE 數字會隨斷詞工具改變。比較不同論文的中文摘要分數前，先確認大家用的是字級還是詞級。

## 環境

兩份 notebook 釘的版本相同：`torch==2.3.1`（cu121）、`transformers==4.37.0`、`datasets==2.21.0`、`accelerate==0.21.0`、`rouge==1.0.1`、`jieba==0.42.1`。這是 2024 年的組合，今天跑建議照釘，避免 Trainer 參數名稱改版。

## 動手

- 跑 GPT-2 notebook 前，先印一個 batch 的 `input_ids` 和 `labels`，確認左邊的 padding 對應到 −100。
- 把 `padding_side` 改成 `"right"`、驗證 batch size 改成 4，看生成結果壞在哪裡。
- 改 `collate_fn`，讓 `[SEP]` 之前的位置也設成 −100，只對摘要算 loss，比較 ROUGE 有沒有差。
- 把 jieba 詞級 ROUGE 換成字級（每個字之間插空白），同一批輸出算兩次，看分數差多少。

**延伸閱讀**：[CS224N 第 7 講：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)比較 encoder、encoder-decoder、decoder 三種預訓練；[CME295 導讀：Transformer](/posts/ai/2026-09-29-cme295-transformer)補架構細節。

## 材料缺口

- 投影片有不少頁的程式碼是截圖（例如 collate_fn、評估函式、Trainer 設定），本文以 notebook 裡的對應程式為準。
- Week 9 Tue. 我只在三個時間點截圖確認是助教課，沒有逐分鐘看完，不確定開頭或結尾有沒有其他內容。
- 這份助教課沒有作業、沒有參考分數，notebook 也沒有保存執行輸出，無法告訴你預期的 ROUGE 大概多少。
- Fall 2026 的對應單元還沒公開。依[全球課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，Fall 2025 是 A3（足以自學）。

**系列導覽**：上一篇 [解碼策略與 NLG 評估](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)｜下一篇 [GPT-3、InstructGPT 與 RLHF](/posts/ai/2026-09-30-nthu-nlp-gpt3-instructgpt-rlhf)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [huggingface_tutorial_gpt2_t5.pdf（GPT-2 and T5 Tutorial 投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_gpt2_t5.pdf)
- [Reference/gpt2_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/gpt2_summarization.ipynb)
- [Reference/t5_summarization.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/t5_summarization.ipynb)
- [錄影：[Fall 2025] 自然語言處理 - 高宏宇 教授 - Week 9 Tue.](https://www.youtube.com/live/zgjO_t5eu_E)
- [錄影：[Fall 2025] Week 9 Thu.](https://www.youtube.com/live/zWMHxXc0QvA)
- [Hu, Chen & Zhu (2015). LCSTS: A Large Scale Chinese Short Text Summarization Dataset](https://aclanthology.org/D15-1229/)
- [Hugging Face 資料集：hugcyp/LCSTS](https://huggingface.co/datasets/hugcyp/LCSTS)
- [Hugging Face 模型：uer/gpt2-chinese-cluecorpussmall](https://huggingface.co/uer/gpt2-chinese-cluecorpussmall)
- [Hugging Face 模型：google/mt5-small](https://huggingface.co/google/mt5-small)
- [Raffel et al. (2020). Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer](https://jmlr.org/papers/v21/20-074.html)
- [Xue et al. (2021). mT5: A Massively Multilingual Pre-trained Text-to-Text Transformer](https://arxiv.org/abs/2010.11934)
- [Lin (2004). ROUGE: A Package for Automatic Evaluation of Summaries](https://aclanthology.org/W04-1013/)
- [pltrdy/rouge（Python ROUGE 套件）](https://github.com/pltrdy/rouge)
- [fxsjy/jieba（中文斷詞）](https://github.com/fxsjy/jieba)
- [Hugging Face Blog: How to generate text](https://huggingface.co/blog/how-to-generate)
