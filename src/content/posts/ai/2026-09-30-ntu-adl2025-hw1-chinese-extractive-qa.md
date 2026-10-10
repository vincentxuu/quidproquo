---
title: "台大陳縕儂 ADL 2025 Fall 導讀：HW1 中文抽取式問答——從四段文字裡找出答案 span"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, course-guide, homework, bert, question-answering, huggingface]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 7
tldr: "ADL Fall 2025 的 HW1 給一個問題和四段中文文字，要模型先挑出相關的那一段（paragraph selection，當成四選一的 multiple choice），再在那段裡標出答案的起點和終點（span selection），用 Exact Match 評分。規格投影片直接指定改 HuggingFace 的 run_swag_no_trainer.py 與 run_qa_no_trainer.py，simple baseline 用 bert-base-chinese、長度 512、有效 batch size 2、learning rate 3e-5，在 8GB 的 RTX 3070 上兩段加起來不到三小時。Kaggle 排行榜 9/29 截止、程式與報告 10/1 交到 NTU COOL。校外讀者拿不到 Kaggle 資料與評分，但任務設計、baseline 設定和報告五題都能照著練。"
description: "台大陳縕儂《深度學習之應用》Fall 2025 第 7 篇導讀，依 HW1 規格投影片（NTU ADL 2025 Fall HW1）與作業說明影片：任務定義、Exact Match、兩個 HuggingFace 範例的改法、simple baseline 設定、允許的套件、繳交格式與執行環境、評分與報告五題、change log，以及校外讀者能做到哪。"
draft: false
glossary:
  - term: "Exact Match"
    aliases: ["EM"]
    definition: "抽取式問答的評分方式：預測的答案字串和標準答案完全一樣才算對，差一個字也算錯。"
    context: "ADL 2025 Fall HW1 的 Kaggle 排行榜用 EM 評分。"
  - term: "Paragraph Selection"
    aliases: ["段落選擇"]
    definition: "HW1 的第一階段：把每個「段落＋問題」當成一個選項，讓模型從四段裡選出包含答案的那一段。"
    context: "投影片建議直接改 HuggingFace 的 multiple choice 範例來做。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-hw1-chinese-extractive-qa-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

**本文依據[台大陳縕儂《深度學習之應用》（ADL）Fall 2025（114-1，2025/09/01–12/15）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)的 HW1。** 這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)系列第 7 篇。上一篇 [BERT 與它的家族](/posts/ai/2026-09-30-ntu-adl2025-bert-family)講了 BERT 怎麼預訓練、怎麼在最上層加分類器微調；這一篇把它用在一個具體任務上：**給一個問題和四段中文，怎麼找出答案在哪一段、從第幾個字到第幾個字？**

用到的官方材料：

- 規格投影片 [NTU ADL 2025 Fall HW1](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)（課程頁 9/08 那一列連結，頁面標示 Last updated on 09/30）
- 作業說明影片 [ADL 2025 Fall Homework 1](https://youtu.be/DVjBNRHUWc0)（約 24 分 50 秒，2025-09-09 上傳，說明欄：BERT for Chinese Question Answering）。這支影片在課程頁上，但不在 77 支的 2025 Fall 播放清單裡。

**存取狀況**：這是整個 ADL Fall 2025 唯一一份公開完整規格的作業，也是系列定為 **A2** 的主要原因之一。規格、baseline 設定和報告題目都看得到；但資料要從 Kaggle 下載（投影片的 Kaggle 連結是邀請連結，本文沒有打開，不確定現在還能不能下載或提交），程式與報告交到需要台大帳號的 NTU COOL。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=DVjBNRHUWc0
title: 影片：ADL 2025 Fall Homework 1
```

原始影片：[影片：ADL 2025 Fall Homework 1](https://www.youtube.com/watch?v=DVjBNRHUWc0)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

字幕嘗試（2026-10-10）：嵌入的 HW1 說明影片（24:50，2025-09-09 上傳，非公開連結，說明欄「BERT for Chinese Question Answering」）取不到字幕，影片內容未核對；文章本來就聲明沒有逐字聽寫，作業規格依規格投影片，與影片的標題、長度、上傳日與說明欄一致。

## 任務：兩段式抽取式問答

投影片的例子是一個問題配四段文字：

- 問題：「在關西鎮以什麼方言為主？」
- 四段分別講新竹縣概況、開發區分類、新竹縣人口與鐵路、台灣政治與海峽名稱。
- 答案：「四縣腔客家話」，出現在第一段。

任務拆成兩步：

1. **Paragraph selection**：判斷四段中哪一段相關。投影片畫成一個 Multiple Choice Model：輸入問題和四段，輸出正確段落。
2. **Span selection**：在正確段落裡找出答案的**起點與終點位置**。投影片註明：答案一定是正確段落裡的一段連續文字。

這正是上一篇 BERT 微調的兩種典型用法：第一步是分類，第二步是在每個 token 上預測 start/end。

評分用 **Exact Match（EM）**：預測字串要和答案完全相同。

## 官方建議的做法：改 HuggingFace 範例

投影片兩處都寫「highly recommended!!!」。

**Paragraph selection**：把每個「段落＋問題」當成一個選項，讓模型選出正確選項。建議改 HuggingFace 的 multiple choice 範例 [run_swag_no_trainer.py](https://github.com/huggingface/transformers/blob/main/examples/pytorch/multiple-choice/run_swag_no_trainer.py)——只要把資料轉成範例程式預期的格式，就能直接拿來訓練。

**Span selection**：改 extractive QA 範例 [run_qa_no_trainer.py](https://github.com/huggingface/transformers/blob/main/examples/pytorch/question-answering/run_qa_no_trainer.py)，同樣先把資料格式對齊。

投影片特別提醒一個陷阱：**要用 start position 找答案，不要用 `context.index("四縣腔客家話")` 這種字串搜尋**。答案文字可能在段落裡出現不只一次，搜尋到的那一次不一定是回答這個問題的那一次。

另外兩個 tips：

- 範例程式裡的 `check_min_version("4.57.0.dev0")` 如果擋住你，可以安全地註解掉（允許的 transformers 版本是 4.50.0）。
- 省記憶體要用 gradient accumulation，而不是直接把 batch size 調小。有效 batch size ＝ batch_size × gradient_accumulation_steps，直接調小 batch 可能傷表現。

## Simple baseline 的設定

投影片給了通過 Kaggle simple baseline 的參考設定：

| | Paragraph selection | Span selection |
|---|---|---|
| 預訓練模型 | bert-base-chinese | bert-base-chinese |
| Max length | 512 | 512 |
| Batch size | 2（每張 GPU 1 × accumulation 2） | 2（每張 GPU 1 × accumulation 2） |
| Epochs | 1 | 1～3 |
| Learning rate | 3e-5 | 3e-5 |
| 執行時間 | 不到 2 小時 | 不到 1 小時 |
| 硬體 | RTX 3070 8GB | RTX 3070 8GB |

另外兩句提示：public score 到 0.78 很有機會通過 private strong baseline；max length 設長一點（例如 512）通常表現較好。

## 規則：能用什麼、不能用什麼

**可以**：

- 只用給定的資料訓練。
- 用公開的預訓練語言模型。
- 允許的套件：Python 3.10 與標準函式庫、PyTorch 2.1.0、scikit-learn 1.5.1、nltk 3.9.1、tqdm、numpy、pandas、transformers 4.50.0、datasets 2.21.0、accelerate 0.34.2、evaluate、matplotlib、gdown，加上範例程式用到的套件與上述套件的依賴。

**不可以**（違規可能零分、負分甚至校規處分）：

- 抄襲，包括用往年 ADL 修課生的 GitHub 程式。
- 直接或間接使用測試資料的標籤。
- 用已經在其他 QA 或 NLI 資料集上訓練過的模型，投影片點名 `luhua/chinese_pretrain_mrc_macbert_large`、`uer/roberta-base-chinese-extractive-qa`、`NchuNLP/Chinese-Question-Answering`，但不限於這三個。
- 和別人交換模型或預測結果、截止前公開程式、提交到往年的 ADL Kaggle 頁面。

## 繳交：Kaggle 排行榜＋NTU COOL

| 項目 | 截止 |
|---|---|
| Kaggle 排行榜 | 9/29（一）23:59 |
| 程式與報告（NTU COOL） | 10/1（三）23:59 |

HW1 投影片寫「No late submission」，不接受遲交。這和 [Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) 第 9 頁「遲交每天扣 25%」的通則不同，以作業投影片為準。

**Kaggle**：隊名設成小寫學號。

**NTU COOL**：上傳以小寫學號命名的資料夾壓縮檔，裡面要有 `README.md`、`run.sh`、`download.sh`、`report.pdf`，以及訓練、預測、畫圖用到的所有程式。不要上傳資料或模型。

- `download.sh`：下載模型、tokenizer 與資料（可以放 Dropbox 用 wget，或 Google Drive 用 gdown）。最多 4GB、1 小時內完成；連結截止後不能改、至少保留 2 週；除了下載不要做別的事。
- `run.sh`：吃三個參數——`context.json` 路徑、`test.json` 路徑、輸出的 `prediction.csv` 路徑，2 小時內跑完。助教會先跑 `bash ./download.sh`，再跑 `bash ./run.sh /path/to/context.json /path/to/test.json /path/to/pred/prediction.csv`。
- 執行環境：Ubuntu 20.04、32GB RAM、RTX 2080 Ti 11GB、20GB 可用磁碟、Python 3.10，跑完 `download.sh` 之後**沒有網路**。
- `README.md`：一步步說明怎麼訓練；沒有或空白扣 2 分。

注意訓練用的 3070 是 8GB，助教機是 11GB 的 2080 Ti，推論時間上限 2 小時；想用更大的模型，要先確認這兩個限制。

## 評分與報告五題

**模型表現 11%**：

- Kaggle simple baseline：public 2%、private 3%
- Kaggle strong baseline：public 2%、private 3%
- 助教不需人工介入就能重現結果：1%。人工介入後仍無法重現則 0 分；重現結果要和最終 Kaggle 提交通過的 baseline 一致。

**報告 9%＋加分 2%**（PDF）：

| 題目 | 配分 | 要回答什麼 |
|---|---|---|
| Q1 資料處理 | 2% | 用自己的話解釋 tokenizer 的演算法（只寫「我呼叫了某函式」不算）；字元層級的答案起訖位置怎麼轉成 token 位置；模型輸出起訖機率後，用什麼規則決定最終答案 |
| Q2 BERT 與變體 | 4% | 描述你的模型、表現、loss、optimizer、learning rate 與 batch size；再換一種預訓練模型（例如 BERT → XLNet 或 BERT-wwm-ext），比較架構與預訓練 loss 等差異 |
| Q3 學習曲線 | 1% | span selection 模型的 loss 曲線與 EM 曲線，每條至少 5 個點 |
| Q4 有無預訓練 | 2% | 不載入預訓練權重，從頭訓練一個 Transformer 模型（兩個階段擇一），和 BERT 比較；太大訓練不動可以縮小層數、hidden 維度、head 數 |
| Q5 加分 | 2% | 不用兩段式 pipeline，改訓練一個端到端模型；提示是找能吃長輸入（context window 較大）的模型 |

Q1 直接連回[第 5 篇 Tokenization](/posts/ai/2026-09-30-ntu-adl2025-tokenization-bpe)，Q2 連回[上一篇的 BERT 家族](/posts/ai/2026-09-30-ntu-adl2025-bert-family)，Q4 則是在實驗上驗證「預訓練到底幫了多少」。

## Change log：規格改了哪些

投影片保留了完整的更新紀錄：

- 09/08：公布 HW1，Kaggle 比賽開始
- 09/09：允許的 transformers 版本更新為 4.50.0
- 09/28：把範例程式用到的套件加入允許清單
- 09/30：更新重現規則——只要上傳能透過 `download.sh` 與 `run.sh` 重現「和最終 Kaggle 提交通過相同 baseline」的模型即可。例如最終提交通過所有 simple baseline 與 public strong baseline，交一個也能通過這些 baseline 的模型就夠了。

問題可以到 NTU COOL 討論區問（投影片鼓勵），或寄信給助教（標題開頭加「[ADL2025 HW1]」）；Office hour 每週五 15:00–16:00，資工系 524 實驗室。

## 校外讀者能做到哪

做得到：

- 讀懂整個任務設計，照 simple baseline 的設定跑兩個 HuggingFace 範例。
- 回答報告五題，特別是 Q1（tokenizer 與 span 對齊）和 Q4（有無預訓練的比較），這兩題不需要 Kaggle 分數也能做。

做不到或不確定：

- **資料**：只在 Kaggle 上，本文沒有打開比賽頁，不確定現在還能不能下載。拿不到的話，可以用任何格式相同的中文抽取式 QA 資料練，但要知道結果和 HW1 排行榜不可比。
- **評分**：public／private 排行榜和 baseline 分數線、助教重現與報告批改都只有修課生有。

**怎麼做**：先別急著調參。拿 `run_qa_no_trainer.py`，找一筆答案文字在段落中出現兩次的例子，印出你算出來的 token start/end 對回原文的字元位置，確認對的是正確那一次。這就是投影片警告 `context.index` 的原因，也是 Q1 要你解釋的東西。

## 本文能確認與不能確認的

能確認：規格投影片全部文字與超連結（從 Google Slides 匯出文字與 pptx 核對）、影片標題、長度、上傳日期與說明欄。

不能確認：本文沒有逐字聽寫作業說明影片，助教口頭補充的內容沒有寫進來。Kaggle 比賽頁、資料格式細節（`context.json`／`test.json` 的欄位）、simple／strong baseline 的具體分數線都沒有在公開材料中看到。HW1 在總成績中的佔比，Course Logistics 只寫三份作業合計 60%，沒有逐份拆開。

延伸閱讀：NLP 專案的完整流程（資料、HF 文字分類 Colab）留給本系列最後一篇[助教課](/posts/ai/2026-09-30-ntu-adl2025-ta-recitations)。站上另一份課程作業導讀可以對照：[CS224U HW2 開放域問答](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy)走的是 retrieval＋LLM 路線，和這裡的 BERT 抽取式路線正好形成對比。

系列導覽：[系列總覽](/posts/ai/2026-09-30-ntu-adl2025-course-overview)｜上一篇 [BERT 與它的家族](/posts/ai/2026-09-30-ntu-adl2025-bert-family)｜下一篇 [預訓練三大類與 Prompt Learning](/posts/ai/2026-09-30-ntu-adl2025-pretraining-prompt-learning)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：嘗試依字幕核對 HW1 說明影片，但取不到字幕，內容未核對；文章未改動。

## 參考資料

- [台大陳縕儂《深度學習之應用》Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [HW1 規格投影片：NTU ADL 2025 Fall HW1（Google Slides）](https://docs.google.com/presentation/d/1PzKXFOZc9mMhw8NewNZQDDerTpjK9U1Ot1hrALpKSTA/edit?usp=sharing)
- [影片：ADL 2025 Fall Homework 1](https://youtu.be/DVjBNRHUWc0)
- [HuggingFace transformers 範例：run_swag_no_trainer.py（multiple choice）](https://github.com/huggingface/transformers/blob/main/examples/pytorch/multiple-choice/run_swag_no_trainer.py)
- [HuggingFace transformers 範例：run_qa_no_trainer.py（question answering）](https://github.com/huggingface/transformers/blob/main/examples/pytorch/question-answering/run_qa_no_trainer.py)
- [transformers 4.50.0 文件](https://huggingface.co/docs/transformers/v4.50.0/en/index)
- [HuggingFace Model Hub：中文模型搜尋](https://huggingface.co/models?search=chinese)
- [250901_Course.pdf（Course Logistics，評分比例）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)
