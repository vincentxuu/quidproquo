---
title: "清大 NLP HW2：把算式當成一種語言——PyTorch 助教課、兩層 LSTM 與 teacher forcing"
date: 2026-09-30
category: ai
type: guide
tags: [nthu-nlp, nlp, ai-course, taiwan, homework, pytorch, rnn]
lang: zh-TW
series:
  name: "清大高宏宇 自然語言處理 導讀"
  order: 5
tldr: "HW2 把「14*(43+20)=882」這種算式當成字元序列，要你用兩層 LSTM 看到「=」之後逐字生成答案。訓練集 2,369,250 筆、驗證集 263,250 筆，數字都在 0–49 之間；六個 TODO 從建字典、只在「=」之後算 loss 的 batching、生成函式，一路到 teacher forcing 訓練與 exact match 評估。W4 的 PyTorch 助教課就是這份作業的工具箱。"
description: "清大高宏宇《自然語言處理》Fall 2025 作業二導讀：W4 PyTorch 助教課的重點（tensor、nn.Module、autograd、Dataset/DataLoader、RNN 資料流、teacher forcing），以及 HW2 Arithmetic 的資料集、起始碼、TODO1–6、配分與報告題目。"
draft: false
glossary:
  - term: "teacher forcing"
    aliases: ["教師強制"]
    definition: "訓練序列生成模型時，每一步都餵正確答案當下一步的輸入，而不是餵模型自己上一步的預測。"
    context: "HW2 的 TODO5 規定用 teacher forcing 訓練 LSTM。"
  - term: "exact match"
    aliases: ["EM", "完全匹配"]
    definition: "生成的答案和正解逐字完全相同才算對，再算對的比例。"
    context: "HW2 的 TODO6 用它評估驗證集，且規定要用生成函式產生完整答案再比對。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nthu-nlp-pytorch-hw2-arithmetic-en)

這是[清大高宏宇 自然語言處理 導讀](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)系列第 5 篇。[上一篇](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention)講了 RNN、LSTM 和梯度消失，這一篇要動手寫：**給 LSTM 看幾百萬條算式，它能「學會」算術嗎？**

本文依據 [IKMLab 課程 repo](https://github.com/IKMLab/NTHU_Natural_Language_Processing) 的兩組材料：

- **W4 Tue 助教課**：投影片 [pytorch_tutorial_NTHU_NLP.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/pytorch_tutorial_NTHU_NLP.pdf)（62 頁），錄影標題是「[Week 4 Tue.[助教課]](https://www.youtube.com/live/INIrdjLVMEU)」。
- **Assignment 2**：[資料夾](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment2)裡有題目說明 [NLP_HW2_arithmetic.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/NLP_HW2_arithmetic.pdf)、起始碼 [main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/main.ipynb)、`arithmetic_train.csv`、`arithmetic_eval.csv`，另有[說明影片](https://youtu.be/nFQCFaRs0kE)（標題「Week 5 Thu. - Assignment 2」；[2025 課表](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)把 HW2 掛在 W5 那一列）。

存取等級是 **A3**：題目、起始碼和完整資料都公開，缺的是解答與評分腳本（在 NTU COOL）。Fall 2026 的 HW2 還沒公布，本篇內容全部是 2025 版。

## 助教課：交作業前的工具箱

助教課從環境安裝講起（Anaconda、conda 指令、依 CUDA 版本安裝 PyTorch），再用 y = ax² + b 的例子帶出「模型、loss、optimizer」三件事。以下只挑和 HW2 直接相關的部分。

**Tensor。** 助教課花了不少頁講 tensor 的建立與運算，包括 `view` 和 `reshape` 的差別：`view` 不能用在 non-contiguous 的 tensor 上，`reshape` 遇到這種情況會先複製一份。另一頁拿一個 100×100 的 tensor 做正規化比速度：逐元素算要 0.127 秒，矩陣運算只要 0.000088 秒。

**nn.Module。** 模型是一個 `torch.nn.Module`，必須定義 `__init__` 和 `forward`。投影片特別提醒：子模組要放在 `nn.ModuleList`，不要放在一般的 Python list 裡。原因是 `state_dict()`、`parameters()`、`train()`、`eval()` 都會遞迴走訪子模組，放在 list 裡的層不會被註冊，也就不會被訓練。

**Autograd。** 投影片用一個小例子，一步步畫出 `backward()` 怎麼沿著計算圖倒著走、怎麼用相依計數決定執行順序。另外列了三種關掉梯度的方法：`requires_grad = False`、`with torch.no_grad():`、`tensor.detach()`。

**訓練迴圈五步驟。** 第 45 頁把每一步對應到一行程式：

```python
optimizer.zero_grad()                  # 1. 清掉梯度
output = model(**batch)                # 2. 把資料餵進模型
loss = loss_fn(output, ground_truth)   # 3. 算 loss
loss.backward()                        # 4. 算梯度
optimizer.step()                       # 5. 更新參數
```

**Dataset 與 DataLoader。** `Dataset.__getitem__` 取出單筆資料，DataLoader 把一批資料組成 tuple 交給 collate function，由它處理成 tensor。HW2 的 TODO3 就是寫這一段。

**RNN 資料流與 teacher forcing。** 第 54–57 頁用「I love AI !」這句話示範：one-hot 經過 embedding 層變成 768 維向量，再進 RNN。接著比較兩種訓練方式：

- **生成式訓練**：每一步餵模型自己上一步的預測。模型一開始猜錯「eat」，後面就變成在學 P(AI | I eat)，錯誤一路帶下去，訓練不穩定。
- **Teacher forcing**：每一步都餵正確答案，學的是 P(love | I)、P(AI | I love)……。投影片的結論是這樣訓練比較穩定。

助教課最後幾頁介紹用 Hugging Face 載入 BERT，那是[第 9 篇](/posts/ai/2026-09-30-nthu-nlp-huggingface-bert-hw3)的範圍。

## HW2：題目長什麼樣

題目 PDF 開頭寫得很清楚：這份作業把算術式**當成一種語言**，用 RNN／LSTM 訓練序列生成模型，同時請你反思模型對算術到底理解了多少。

資料集的規格：

| 項目 | 內容 |
|---|---|
| 訓練集 | 2,369,250 筆 |
| 驗證集 | 263,250 筆 |
| 題型 | A (+/-/*) B (+/-/*) C = ?，數字都在 [0, 50) |
| 運算 | +、-、*、括號 |
| 格式 | CSV 兩欄：`src`（例如 `14*(43+20)=`）與 `tgt`（例如 `882`） |

我下載 CSV 核對過，筆數和 PDF 一致。PDF 說每題是「2～3 個數字」，實際上訓練集幾乎全是三個數字的算式，只有 6,784 筆只有兩個數字。答案也可能是負數，例如驗證集的 `30-(48+13)=,-31`。

模型要做的事是：逐字讀入「1+1=」，看到「=」之後逐字生成「2」，再生成 `<eos>` 停下來。

## 起始碼與六個 TODO

`main.ipynb` 已經寫好模型：`CharRNN` 是 embedding 層接兩層 `nn.LSTM`，再接一個兩層的全連接網路（中間用 ReLU）輸出每個字元的機率。loss 用 cross entropy，optimizer 用 Adam。你要填的是：

| TODO | 內容 | 配分 |
|---|---|---|
| 1 | 建字典：`char_to_id` 與 `id_to_char`，要包含 `<pad>` 和 `<eos>` | 5% |
| 2 | 資料前處理：把每筆算式轉成模型的輸入與輸出，結尾加 `<eos>` | 5% |
| 3 | Data batching：寫 `Dataset` 與 DataLoader | 5% |
| 4 | 生成：寫 generator，逐字預測直到 `<eos>` | 10% |
| 5 | 訓練：用 teacher forcing 在 GPU 上訓練 | 10% |
| 6 | 評估：用 generator 產生完整答案，算驗證集的 exact match | 10% |

配分以 PDF 第 27 頁的總表為準，合計 45%。PDF 第 19 頁的 TODO2 標題寫的是「10%」，和總表不一致。

幾個容易卡住的地方，PDF 和 notebook 都有講：

- **只在「=」之後算 loss。** 以 `1+2-3=0` 為例，notebook 寫的輸出目標是 `/ / / / / 0 <eos>`，前面那些「/」換成 `<pad>`，loss 函式設定成忽略 `<pad>`。模型不需要預測算式本身的下一個字元。
- **生成時取最後一個位置。** 每次把目前的序列整條餵進模型，取輸出序列最後一個元素當作下一個 token 的預測。
- **評估一定要用 generator。** PDF 規定要生成完整答案再和正解比對，不能拿 teacher forcing 的輸出直接算。
- **gradient clipping 已經寫好。** 訓練迴圈裡用 `torch.nn.utils.clip_grad_value_` 把梯度限制在 ±1 之間，這對應到上一篇講的梯度爆炸。

notebook 的超參數表寫 batch size 64、embedding 與 hidden 都是 256、學習率 0.001、epochs 10；下面的程式碼格卻設成 `epochs = 2`。這兩個數字不一致，報告裡要寫清楚你實際用了多少。

## 配分與報告題目

總分由三部分組成：程式 45%、準確率 10%（越高分越多，報告最後要附截圖）、報告 45%。報告題目很值得一看，因為它們都在問「模型到底懂不懂算術」：

- 列出訓練用的超參數：學習率、batch size、hidden size、epochs 等（5%）
- 改用 RNN 或 GRU 取代 LSTM，生成品質會怎樣？為什麼？（10%）
- 訓練集用三位數、驗證集用兩位數，會怎樣？（10%）
- 訓練集有 20% 的答案是錯的，生成結果會受什麼影響？舉例說明（10%）
- 為什麼訓練時需要 gradient clipping？（5%）
- 其他能強化報告的內容（5%）

PDF 建議數據盡量用文字呈現，不要只貼圖，方便批改。繳交規則和 [HW1](/posts/ai/2026-09-30-nthu-nlp-hw1-word-analogy) 相同：`.py`、`requirements.txt`、`.docx` 壓成 zip 上傳 NTU COOL，期限三週，使用生成式 AI 要註明，抄襲雙方各扣 100 分。

## 動手前的建議

1. **先用一小部分資料跑通整條流程。** 訓練集有兩百多萬筆，先取幾萬筆確認 loss 會降、generator 會停，再放大。
2. **先寫 generator 再寫訓練。** 未訓練的模型也能跑 `model.generator('1+1=')`，只是輸出亂碼。起始碼的 generator 預設 `max_len=200`，沒學會輸出 `<eos>` 的模型每題都會跑到 200 個字元才停，驗證集二十幾萬題會評估得非常慢。先確認停止條件正確，再開始訓練。
3. **把錯的答案印出來看。** exact match 只給一個數字。錯在乘法還是加法、錯在大數還是負數，這些才是報告「模型懂不懂算術」的素材。
4. **報告的 RNN/GRU 題要真的跑。** 起始碼裡把 `nn.LSTM` 換成 `nn.GRU` 或 `nn.RNN` 只要改兩行，拿實驗數字回答比純推論有說服力。

## 延伸閱讀

- 本系列上一篇：[Seq2seq、LSTM 與 Attention](/posts/ai/2026-09-30-nthu-nlp-seq2seq-attention)
- 本系列下一篇：[Transformer 與 Self-Attention](/posts/ai/2026-09-30-nthu-nlp-transformers)
- 英文課的 RNN 段落：[CMU 11-785：RNN（一）](/posts/ai/2026-08-22-cmu-11785-13-rnn-one)、[CMU 11-785：RNN（二）](/posts/ai/2026-08-22-cmu-11785-14-rnn-two)
- 回到[系列總覽](/posts/ai/2026-09-30-nthu-nlp-kao-course-guide)

## 參考資料

- [pytorch_tutorial_NTHU_NLP.pdf（W4 助教課投影片）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Slides/pytorch_tutorial_NTHU_NLP.pdf)
- [Fall 2025 W4 Tue 助教課錄影](https://www.youtube.com/live/INIrdjLVMEU)
- [2025 HW2 題目說明 NLP_HW2_arithmetic.pdf](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/NLP_HW2_arithmetic.pdf)
- [2025 HW2 起始碼 main.ipynb](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/Assignments/Assignment2/main.ipynb)
- [2025 HW2 資料夾（含 arithmetic_train.csv、arithmetic_eval.csv）](https://github.com/IKMLab/NTHU_Natural_Language_Processing/tree/main/2025/Assignments/Assignment2)
- [2025 HW2 說明影片](https://youtu.be/nFQCFaRs0kE)
- [2025 課表 README](https://github.com/IKMLab/NTHU_Natural_Language_Processing/blob/main/2025/README.md)
- [PyTorch 官方網站](https://pytorch.org/)
