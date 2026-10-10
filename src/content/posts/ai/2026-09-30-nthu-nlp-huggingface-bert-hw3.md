---
title: "清大 NLP 導讀 9：一個 BERT 同時打分數又判蘊含——Hugging Face 助教課與 HW3 多輸出學習"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, ai-course, course-guide, taiwan, bert, hugging-face, fine-tuning, homework, pytorch, nlp]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 9
tldr: "清大高宏宇 NLP（Fall 2025）Hugging Face BERT 助教課與 HW3 導讀。助教課用 IMDb 影評二元分類走一遍 AutoTokenizer、input_ids／token_type_ids／attention_mask、AutoModelForSequenceClassification 與 Trainer。HW3 把工具拿去做 SemEval 2014 Task 1：同一個 bert-base-uncased 接兩個頭，一個回歸 1–5 分的 relatedness，一個做三類 entailment 分類，兩個 loss 加總後自己寫訓練迴圈，不准用 Trainer。"
description: "清大高宏宇教授自然語言處理（Fall 2025）huggingface_tutorial_bert.pdf、Reference/bert-huggingface.ipynb 與 HW3 Multi-output learning 導讀：IMDb 分類流程、tokenizer 輸出三欄位、AutoClasses 與下游任務對應、Trainer 與 TrainingArguments；HW3 的 SemEval 2014 Task 1 資料、TODO1–6、兩個 loss 的組合、Pearson 與 accuracy 評估、配分與報告題目，以及起始 notebook 的幾個坑。"
draft: false
glossary:
  - term: "multi-output learning"
    aliases: ["多輸出學習"]
    definition: "同一筆輸入同時對應好幾個標籤，模型一次輸出所有標籤。和 multi-task learning 的差別是：後者每個任務通常有各自的資料。"
    context: "HW3 投影片第 2 頁用這個區分開場：SemEval 2014 Task 1 每筆句對同時有 relatedness 分數和 entailment 標籤。"
  - term: "attention_mask"
    definition: "tokenizer 輸出的欄位之一，真實 token 的位置是 1，padding 補上的位置是 0，告訴模型不要注意補齊的部分。"
    context: "助教課投影片第 29 頁用 IMDb 驗證集第一筆展示。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **本文依據[清大高宏宇教授「自然語言處理」](https://github.com/IKMLab/NTHU_Natural_Language_Processing) Fall 2025（114-1）的公開教材。** 這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列的第 9 篇，上一篇是 [ELMo、BERT、T5、BART、GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family)。

上一篇講 BERT 家族怎麼預訓練。這一篇動手：拿現成的 BERT 權重，接到自己的任務上。用到的官方材料有四份：

- 助教課投影片 [huggingface_tutorial_bert.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_bert.pdf)（43 頁，封面日期 2024/10/22）
- 對應 notebook [bert-huggingface.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/bert-huggingface.ipynb)
- 作業說明 [NLP_HW3_Multi_output_learning.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/NLP_HW3_Multi_output_learning.pdf)（24 頁）與起始碼 [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/main.ipynb)
- 錄影：助教課 [VErSpYgZGiw](https://www.youtube.com/watch?v=VErSpYgZGiw) 與 HW3 說明影片 [Fe1roWMVdUI](https://www.youtube.com/watch?v=Fe1roWMVdUI)

## 課程影片來源

影片連結對應本文教材；此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=VErSpYgZGiw
title: VErSpYgZGiw
```

```youtube
url: https://www.youtube.com/watch?v=Fe1roWMVdUI
title: Fe1roWMVdUI
```

原始影片：[VErSpYgZGiw](https://www.youtube.com/watch?v=VErSpYgZGiw)、[Fe1roWMVdUI](https://www.youtube.com/watch?v=Fe1roWMVdUI)、[W7 Thu. 4qDUML9TeHM](https://www.youtube.com/watch?v=4qDUML9TeHM)、[W7 Tue.](https://www.youtube.com/watch?v=NtPrXea8qSE)

課程與錄影入口：

- [官方課程與錄影入口](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)

## 錄影與週次：先把對照關係理清楚

[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)把助教課投影片和錄影掛在 W7 列，HW3 掛在 W8 列。實際情況比表格複雜一點：

| 錄影 | YouTube 標題與頁面資訊 | 內容 |
|---|---|---|
| [VErSpYgZGiw](https://www.youtube.com/watch?v=VErSpYgZGiw) | 「Week 8 Tue. [助教課]」，沒有 [Fall 2025] 標記，上傳日期 2024-10-21，約 89 分鐘，說明寫「Hugging Face BERT講解」 | 2024 年錄的助教課 |
| [W7 Thu. 4qDUML9TeHM](https://www.youtube.com/live/4qDUML9TeHM) | 「[Fall 2025] … Week 7 Thu.」，約 56 分鐘 | 我在第 5、25、50 分鐘截圖，畫面都是這份助教投影片（第 2、16、30 頁） |
| [Fe1roWMVdUI](https://www.youtube.com/watch?v=Fe1roWMVdUI) | 「[Fall 2025] … Week 8 Thu. - Assignment 3」，約 15 分鐘 | HW3 說明 |

教授在 [W7 Tue.](https://www.youtube.com/live/NtPrXea8qSE) 下課前說，助教課「因為內容是沒有變的」，會播放預錄影片，助教同時在線上回答問題。這和投影片封面的 2024 日期、錄影的 2024 上傳日對得起來。所以要看助教課，VErSpYgZGiw 和 W7 Thu. 擇一即可；W7 Thu. 是否整支都在播放同一段錄影，我沒有逐分鐘確認。

## 助教課：IMDb 分類走一遍

投影片大綱只有三段：Hugging Face 簡介、BERT、Hugging Face Trainer。notebook 開頭寫明適用對象是「已經有 Python、numpy、pandas、scikit-learn 與 PyTorch 基礎的學生」，沒學過的話它附了 IKMLab 自己的入門教材連結。

### 環境版本

投影片第 7 頁和 notebook 第一格固定了版本：`torch==2.4.0`、`transformers==4.37.0`、`datasets==3.0.1`、`accelerate==0.21.0`、`scikit-learn==1.5.2`。這是 2024 年的組合，今天在新版 Colab 上跑，照它釘版本比較不會遇到 API 改名。注意 HW3 要求的 `datasets` 版本和這裡不同，下面會講。

### 資料：兩條路

投影片第 12 頁把流程拆成三步（拿資料 → 訓練 → 評估），每一步都有「原生 PyTorch」和「Hugging Face 工具」兩個選項。拿資料這一步示範了兩種做法：

1. 用 `wget` 下載史丹佛的 `aclImdb_v1.tar.gz`，解壓後依 `pos`／`neg` 資料夾讀檔、貼標籤，再用 scikit-learn 的 `train_test_split` 切 20% 當驗證集（seed 42）。
2. 直接 `datasets.load_dataset("imdb")`，用 `.train_test_split(test_size=0.2, seed=42)` 切驗證集（第 31 頁）。

第二條路少很多程式碼，前提是你的任務資料剛好收錄在 Hugging Face Datasets 上。

### Tokenizer 吐出來的三個欄位

投影片第 19–29 頁是整份教材最值得慢慢看的部分。`AutoTokenizer.from_pretrained("bert-base-uncased")` 會依模型名稱自動挑對的 tokenizer 類別。uncased 的意思是不分大小寫（english 和 English 視為同一個字）。

幾個投影片直接印出來的數字：`model_max_length` 是 512，`[CLS]`、`[SEP]`、`[PAD]` 的 ID 分別是 101、102、0。

呼叫 `tokenizer(texts, truncation=True, padding=True)` 之後得到一個 `BatchEncoding`，裡面有三個欄位：

| 欄位 | 內容 | 投影片的說明 |
|---|---|---|
| `input_ids` | 每個 subword 在字典裡的 ID，頭尾自動加上 101 和 102，後面補 0 | 第 27 頁 |
| `token_type_ids` | 第一句是 0，第二句是 1 | IMDb 是單句任務，所以全是 0（第 28 頁） |
| `attention_mask` | 真實 token 是 1，padding 是 0 | 告訴模型不要注意補齊的區域（第 29 頁） |

`token_type_ids` 在 IMDb 用不到，到 HW3 就會用到：SemEval 的輸入是 premise 和 hypothesis 兩句。

### 模型：同一個 BERT，換不同的頭

第 34–35 頁列出不同下游任務對應的 AutoClass：

| 任務 | 類別 |
|---|---|
| 句子分類（IMDb） | `AutoModelForSequenceClassification`，`num_labels=2` |
| 語意相似度迴歸（STS-B） | 同一個類別，`num_labels=1` |
| 抽取式問答（SQuAD） | `AutoModelForQuestionAnswering` |
| 序列標註（CoNLL-2003 NER） | `AutoModelForTokenClassification` |

第 36–37 頁標題是「What happens for down-stream tasks?」，連到 transformers v4.45.2 的 [`modeling_bert.py`](https://github.com/huggingface/transformers/blob/v4.45.2/src/transformers/models/bert/modeling_bert.py#L1651-L1665) 兩段原始碼。我對照了那兩段：

- 第一段（L1651–1665）是 `BertForSequenceClassification` 的建構子：BERT 本體、一個 dropout、一層 `nn.Linear(hidden_size, num_labels)`。所謂「分類模型」，就是 BERT 的 pooled output 接一層線性層。
- 第二段（L1715–1734）是 loss 的選擇：`num_labels == 1` 時當成回歸、用 `MSELoss`；`num_labels > 1` 且標籤是整數時當成單標籤分類、用 `CrossEntropyLoss`。

這兩段就是 HW3 的伏筆。HW3 要你自己寫這個結構，而且寫兩個頭，loss 也要依任務類型各選一個。

notebook 裡那一格寫的是 `num_labels=3`，但 IMDb 是二元分類，`compute_metrics` 也用 `average='binary'`。照投影片用 2 比較合理。

### Trainer

第 38–43 頁示範 `TrainingArguments` 加 `Trainer`：設好 epoch、learning rate、batch size、warmup、評估與存檔頻率，呼叫 `trainer.train()` 就開始訓練，`trainer.predict(test_dataset)` 做預測、不更新權重。第 39 頁把一段原生 PyTorch 的訓練迴圈和一行 `trainer.train()` 並排，說明 Trainer 省了什麼。

## HW3：一個模型、兩種答案

### 任務

[HW3 說明](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/NLP_HW3_Multi_output_learning.pdf)第 2 頁先區分兩個常被混用的詞：multi-output learning 是同一份資料、多個標籤；multi-task learning 是不同資料各有標籤。HW3 做的是前者。

資料集是 [SemEval 2014 Task 1](https://aclanthology.org/S14-2001/)。每筆有一個 premise、一個 hypothesis，以及兩個答案：

| 子任務 | 欄位 | 類型 |
|---|---|---|
| 1 | `relatedness_score` | 回歸，1–5 分 |
| 2 | `entailment_judgement` | 三類分類：0 NEUTRAL、1 ENTAILMENT、2 CONTRADICTION |

資料切分是訓練 4,500 筆、驗證 500 筆、測試 4,927 筆（第 5 頁）。

### 六個 TODO

| TODO | 內容 | 配分 |
|---|---|---|
| 1 | 寫 `collate_fn` 與三個 DataLoader，每個 batch 輸出 tokenizer 結果、回歸標籤、分類標籤 | 5% |
| 2 | 建模型，**必須用 `bert-base-uncased`**，否則這 5% 不給 | 5% |
| 3 | 定義 optimizer（建議 Adam 或 AdamW）與**兩個** loss | 5% |
| 4 | 自己寫訓練迴圈，**不能用 Hugging Face Trainer**；總 loss 是各子任務 loss 的加總 | 5% |
| 5 | 在驗證集上評估：relatedness 算 Pearson 相關係數，entailment 算 accuracy | 10% |
| 6 | 載入驗證分數最好的 checkpoint，在測試集上報 Pearson 與 accuracy | 10% |

第 10 頁畫了建議架構：輸入句對進 BERT，後面分兩條線性層，`Linear_1` 輸出 relatedness，`Linear_2` 輸出 entailment。起始碼的註解補充：可以自己加線性層、激活函數等結構，但**不准再用別的預訓練語言模型**。

投影片第 11 頁對 loss 只給提示：「觀察每個子任務的類型，不同類型用不同 loss。」回歸配回歸的 loss，分類配分類的 loss，再合成一個數字反向傳播。怎麼合（直接相加、加權、要不要處理兩個 loss 的尺度差異）是作業留給你想的地方。

### 配分與報告

程式 40%（上表）、測試成績 10%、報告 50%。測試成績的 baseline 是測試集 Pearson 0.8、accuracy 0.8，達到拿 4%，越高分越多，報告最後要附測試 log 截圖。

報告題目（第 17 頁）：

- 用 RoBERTa-base 訓練同一份資料，和 BERT-base 比較，並討論兩者差異怎麼影響表現（15%）
- 用 GPT-2 訓練並評估，討論 BERT 和 GPT-2 的差異（15%）
- 多輸出模型和「每個子任務各訓練一個 BERT」比，多輸出有沒有幫助？為什麼？（5%）
- 錯誤分析：模型為什麼答錯某些例子、你怎麼改進（10%）
- 其他能強化報告的內容（5%）

繳交規則：程式要從 Colab 下載成 `.py`、附 `requirements.txt`、報告用 `.docx`，打包成 `NLP_HW3_學校_學號.zip` 上傳 NTU COOL，期限三週。檔名、版本資訊漏寫各扣 5 分；**除了資料載入之外不能改動程式模板**，改了扣 5 分；和他人高度相似兩人各扣 100 分。用了生成式 AI 要在程式註解和報告裡都註明。

## 起始 notebook 的幾個坑

我讀 [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/main.ipynb) 時注意到的地方：

- **`datasets` 版本**：投影片第 8 頁強調要 `datasets==2.21.0` 才能從 Hugging Face 下載 `sem_eval_2014_task_1`，程式也帶著 `trust_remote_code=True`。助教課 notebook 釘的是 3.0.1，兩份不要共用同一個環境。
- **評估套件**：投影片第 13 頁說範例用 `torchmetrics`，起始碼實際 import 的是 `evaluate` 的 `load("pearsonr")` 和 `load("accuracy")`。以程式為準即可。
- **變數名稱**：驗證迴圈初始化的是 `best_score = 0.0`，存檔判斷卻寫 `if pearson_corr + accuracy > best:`。直接跑會出 `NameError`，要自己統一名稱。存檔路徑 `./saved_models/` 也要先建好。
- **全形標點**：起始碼先把「：，“”？……！」換成半形，註解說明是避免被 BERT tokenizer 切成 `[UNK]`。

## 動手

- 先跑助教課 notebook 的 Hugging Face Datasets 版本，印出一筆 `input_ids` 再用 `tokenizer.decode` 轉回文字，確認 101、102、0 出現在哪。
- HW3 先只接分類頭訓練一次、再只接回歸頭訓練一次，記下兩個數字；接著換成兩個頭一起訓練。這組比較剛好就是報告的第三題。
- 兩個 loss 相加前先各印出來看量級。量級差很多時，試試加權，觀察 Pearson 和 accuracy 哪一個先變。

**延伸閱讀**：[CS224N 導讀：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)講 BERT 為什麼能遷移；[CS224U 上下文表徵 II：模型家族](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)比較 BERT、RoBERTa 等模型，可以當報告第一題的背景。

## 材料缺口

- 作業解答、評分腳本、成績分布都在 NTU COOL，校外讀者拿不到。
- HW3 說明影片 Fe1roWMVdUI 我只確認了標題與長度，沒有逐段看，本文的作業內容全部依據說明 PDF 與起始碼。
- 投影片第 30、33、40、41 頁的程式碼是截圖，本文以 notebook 裡對應的程式為準。
- 這份助教課是 2024 年版，Fall 2026 的對應單元還沒公開。依[全球課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，Fall 2025 是 A3（足以自學），缺口是解答與評分。

**系列導覽**：上一篇 [ELMo、BERT、T5、BART、GPT](/posts/ai/2026-09-30-nthu-nlp-bert-family)｜下一篇 [解碼策略與 NLG 評估](/posts/ai/2026-09-30-nthu-nlp-decoding-evaluation)｜[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [IKMLab/NTHU_Natural_Language_Processing（課程 GitHub repo）](https://github.com/IKMLab/NTHU_Natural_Language_Processing)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [huggingface_tutorial_bert.pdf（Hugging Face 助教課投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/huggingface_tutorial_bert.pdf)
- [Reference/bert-huggingface.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Reference/bert-huggingface.ipynb)
- [2025 作業總表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/README.md)
- [NLP_HW3_Multi_output_learning.pdf（HW3 說明）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/NLP_HW3_Multi_output_learning.pdf)
- [Assignment3/main.ipynb（HW3 起始碼）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment3/main.ipynb)
- [錄影：Hugging Face BERT 助教課（Week 8 Tue. [助教課]）](https://www.youtube.com/watch?v=VErSpYgZGiw)
- [錄影：[Fall 2025] Week 7 Thu.](https://www.youtube.com/live/4qDUML9TeHM)
- [錄影：[Fall 2025] Week 8 Thu. - Assignment 3](https://www.youtube.com/watch?v=Fe1roWMVdUI)
- [Devlin et al. (2019). BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding](https://aclanthology.org/N19-1423/)
- [Marelli et al. (2014). SemEval-2014 Task 1](https://aclanthology.org/S14-2001/)
- [Hugging Face 資料集：sem_eval_2014_task_1](https://huggingface.co/datasets/SemEvalWorkshop/sem_eval_2014_task_1)
- [Hugging Face 模型：google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased)
- [Hugging Face Transformers 文件：Trainer](https://huggingface.co/docs/transformers/main_classes/trainer)
