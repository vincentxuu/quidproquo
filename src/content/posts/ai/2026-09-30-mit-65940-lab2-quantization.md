---
title: "MIT 6.5940 Lab 2：親手實作 K-means 與線性量化，做出整數推論的 VGG"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, quantization, homework, pytorch]
lang: zh-TW
series:
  name: "MIT 6.5940 導讀"
  order: 7
tldr: "Lab 2 是一份 Colab notebook，10 題共 100 分，對象是 CIFAR-10 上預訓練好的 VGG。前 3 題做 K-means 量化：寫量化函數、推算 n bit 有幾個 cluster、寫 centroid 更新，再看 8／4／2 bit 微調前後的準確率。後 7 題做線性量化：寫 q = round(r/S) + Z、推 scale 與 zero point 公式、做 per-channel 權重量化與 bias 量化、寫整數版的全連接層與卷積層，最後把整個模型轉成 INT8 跑推論。本文整理題目、配分、環境需求與校外限制，不附解答。"
description: "MIT 6.5940 EfficientML（Fall 2024）Lab 2 Quantization 導讀：notebook 的 K-means 與 linear quantization 兩大段、Q1–Q10 的題目與配分、每題對應第 5、6 講的哪一頁、Colab GPU 與套件需求、內建測試函式，以及校外自學的限制。附 Fall 2026 狀態。"
draft: false
glossary:
  - term: "zero point"
    aliases: ["零點", "Z"]
    definition: "線性量化 r = S(q − Z) 中的整數偏移量，讓浮點的 0 能精確對應到某個整數。對稱量化時 Z = 0。"
    context: "Lab 2 Q5 要你推出 Z 的計算式。"
  - term: "BN folding"
    aliases: ["BatchNorm fusion", "conv-bn fusion"]
    definition: "把 BatchNorm 的縮放與平移併進前一層卷積的權重與 bias，推論結果不變，但少了一層運算。"
    context: "Lab 2 Q9 在量化整個模型前先做這一步。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

**本文依據 [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024。** 這是 [MIT 6.5940 導讀](/posts/ai/2026-09-30-mit-65940-course-overview)系列第 7 篇，把[第 5 講](/posts/ai/2026-09-30-mit-65940-quantization-basics)與[第 6 講](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)的量化內容落到程式碼。

**系列導覽**：上一篇 [第 6 講：PTQ、QAT 與混合精度](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)｜下一篇 [第 7 講：NAS 的搜尋空間與搜尋策略](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)｜[系列總覽](/posts/ai/2026-09-30-mit-65940-course-overview)

**官方材料**：[Lab 2 Colab notebook](https://colab.research.google.com/drive/11IBla1q1McoZ2oCANCGHns8VtzG5nCMP)。Fall 2024 課程頁上，Lab 2 在 9 月 26 日（第 7 講）發布，10 月 8 日（第 10 講）截止。以下題號、配分與敘述都照 notebook 本身，2026-09-30 核對。

**存取等級 A3，但有缺口**：notebook、預訓練權重與資料集都能直接下載，notebook 裡也附了幾個驗證函式。拿不到的是官方解答與評分：作業透過 MIT 的 Canvas 繳交，校外讀者沒有評分回饋。這篇**不寫解答**，只說每題在問什麼、對應課堂哪一段。

**Fall 2026 對照**：Fall 2026 的課程頁把 Lab 2 標為「Quantization」，排在 10 月 1 日發布；2026-10-01 再查時還沒有連結。放出後會在這裡補上差異。

## 課程影片來源

請由官方課程入口核對本文對應講次；本次未核實可直接嵌入的該篇公開錄影。

課程與錄影入口：

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## 這份 lab 要你做到什麼

notebook 的 Goals 段列了七項，濃縮起來是三件事：

1. 實作 K-means 量化，並用量化感知訓練（QAT）把精度拉回來。
2. 實作線性量化，以及只用整數運算的推論。
3. 理解兩種量化在精度、延遲、硬體支援上的取捨。

全份 10 題：K-means 3 題（Q1–Q3）、線性量化 6 題（Q4–Q9）、Q10 比較兩者。

## 環境與起點

- **模型與資料**：CIFAR-10 上的 VGG，與 [Lab 0](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics) 用的是同一個。notebook 定義了 8 層 conv-bn-relu 的 backbone，加上一個 512→10 的線性分類器。預訓練權重從 `hanlab18.mit.edu` 下載。
- **執行環境**：notebook 的 metadata 指定 Colab GPU runtime，模型用 `.cuda()` 載入。
- **額外套件**：`torchprofile`（算 MAC）與 `fast-pytorch-kmeans`（做 K-means）。
- **內建驗證**：`test_k_means_quantize()`、`test_linear_quantize()`、`test_quantized_fc()` 會拿固定的小張量檢查你的實作。這是校外讀者唯一的自動回饋。

開頭會先評估 FP32 模型的準確率與大小，後面所有結果都拿它當基準。

## 第一段：K-means 量化（Q1–Q3，30 分）

這段對應第 5 講的 K-means 量化，以及[第 6 講](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)第 47 頁的 K-means QAT。notebook 的定義是：n-bit K-means 量化把權重分成 2ⁿ 個 cluster，產生一本 codebook，裡面有 2ⁿ 個 FP32 的 `centroids`，以及和原權重同樣元素數的 n-bit 整數 `labels`。推論時用 `centroids[labels]` 還原出浮點權重。

| 題號 | 配分 | 在問什麼 |
|---|---|---|
| Q1 | 10 | 完成 `k_means_quantize()`，用 K-means 產生 codebook 並還原權重 |
| Q2.1 | 5 | 2-bit 量化畫出 4 種顏色，4-bit 會有幾種？ |
| Q2.2 | 5 | 推廣到 n bit |
| Q3 | 10 | 完成 `update_codebook()`，用最新權重更新 centroid |

Q1 寫完後，notebook 把它包成 `KMeansQuantizer` 類別，對整個模型做 8、4、2 bit 量化，並印出大小與準確率。注意這裡算模型大小時**不計 codebook 的儲存**，notebook 有明講。

接著 notebook 自己點出問題：位元越低，準確率掉得越多，所以要做 QAT。它給出 centroid 的梯度是同一 cluster 內權重梯度的加總，然後說明 lab 裡**為了簡化**，直接把每個 centroid 更新成該 cluster 內權重的平均。Q3 就是實作這一步。

微調迴圈是現成的：準確率掉超過 0.5 個百分點才微調，最多 5 個 epoch，用 SGD（lr 0.01、momentum 0.9）加 cosine schedule，每個訓練步後呼叫 `quantizer.apply(model, update_centroids=True)`。

## 第二段：線性量化（Q4–Q9，65 分）

這段對應第 5 講的線性量化，以及第 6 講的 per-channel 與整數推論（第 8–9、14–20 頁）。起點是 `r = S(q − Z)`，以及 n-bit 有號整數的範圍 `[−2ⁿ⁻¹, 2ⁿ⁻¹ − 1]`。

| 題號 | 配分 | 在問什麼 |
|---|---|---|
| Q4 | 10 | 完成 `linear_quantize()`：縮放、捨入、加上 zero point；最後截斷到 n-bit 範圍的那一步已經寫好 |
| Q5.1 | 3 | 四個選項中選出正確的 scale 公式 |
| Q5.2 | 4 | 四個選項中選出正確的 zero point 公式 |
| Q5.3 | 8 | 完成 `get_quantization_scale_and_zero_point()` |
| Q6 | 5 | 完成 bias 的量化 |
| Q7 | 15 | 完成整數版全連接層 `quantized_linear()` |
| Q8 | 10 | 完成整數版卷積層 `quantized_conv2d()` |
| Q9.1 | 5 | 把輸入從 (0, 1) 映射到 INT8 的前處理 |
| Q9.2 | 5 | 解釋為什麼量化後的模型裡沒有 ReLU 層 |

幾個值得先知道的設計：

- **權重用對稱量化**。notebook 先畫出權重分布，指出它們大致對稱於 0（分類器例外），所以權重的 Z 設為 0，S 用權重的最大絕對值算。這對應第 6 講第 14 頁的 symmetric linear quantization。
- **權重用 per-channel**。卷積權重形狀是 (output channels, input channels, kh, kw)，notebook 說大量實驗顯示每個 output channel 各用一組 S 與 Z 效果較好，所以 per-channel 是直接寫在範例程式裡的。
- **activation 範圍用一批訓練資料校準**。Q9 前用 forward hook 記錄每層輸入輸出，只跑一個 batch（batch size 512），再由你在 Q5.3 寫的函式直接取 min／max 算 S 與 Z。這是第 6 講第 32 頁「校準批次」最簡單的版本，沒有做裁切。
- **Q9 的流程**：先把 BatchNorm 併進前一層卷積（notebook 會驗證併完準確率不變），再記錄 activation 範圍，最後把 `Conv2d`、`Linear` 換成量化版本。`MaxPool2d`、`AvgPool2d` 只是包一層，因為當時 PyTorch 的模組不支援 INT8，所以暫時轉回 FP32 計算。

Q7 與 Q8 的提示直接給了公式骨架，跟第 6 講第 8–9 頁一致。

<details>
<summary>Q7／Q8 提示裡的整數推論公式</summary>

```
q_output = (Linear[q_input, q_weight] + Q_bias) · (S_input · S_weight / S_output) + Z_output
Q_bias   = q_bias − Linear[Z_input, q_weight]
```

卷積把 `Linear` 換成 `CONV`。Q6 的提示是 `Z_bias = 0`、`S_bias = S_input · S_weight`。

</details>

## Q10（5 分）：把兩種量化放在一起比

最後一題是開放式問答：從精度、延遲、硬體支援等角度，比較 K-means 量化與線性量化的優缺點。

建議寫之前回頭看第 6 講第 3 頁那張並排表，它比較了兩者在儲存與運算上的差別。再對照你在 Q3 與 Q9 印出來的數字：K-means 需要 codebook 才能還原成浮點，線性量化則能整條路徑用整數算。你的答案要用自己跑出的結果撐起來。

## 自學怎麼做

1. **先跑到 FP32 基準那一格再離開**。確認 Colab GPU、權重下載、CIFAR-10 下載都沒問題，再開始寫題目。
2. **每寫完一個函式就跑對應的 test**。Q1、Q4、Q7 都有現成驗證，沒通過不要往下，後面的題目會把錯誤放大。
3. **Q5 先用紙筆推**。把 `r_max = S(q_max − Z)` 與 `r_min = S(q_min − Z)` 相減，選擇題的答案就出來了。推懂了，Q5.3 只是翻成程式。
4. **Q9.2 與 Q10 是理解題**，寫完對照第 6 講投影片檢查一遍。

今晚可以做的一件事：打開 notebook，只跑 Setup 與 FP32 評估兩段，記下準確率與模型大小。之後每個量化結果都拿這兩個數字比，你會對「省多少、掉多少」有直接的感覺。

## 延伸閱讀

- 系列入口與課程狀態：[MIT 6.5940 導讀（系列總覽）](/posts/ai/2026-09-30-mit-65940-course-overview)
- 同一套流程練剪枝：[Lab 1：Pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning)
- LLM 的 4-bit 權重量化：[Lab 4＋Lab 5：AWQ 與筆電上的 LLM](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.5940 Fall 2024 課程頁](https://hanlab.mit.edu/courses/2024-fall-65940) — Lab 2 發布與截止日、Canvas 繳交、評分比重
- [Lab 2 Colab notebook（Fall 2024）](https://colab.research.google.com/drive/11IBla1q1McoZ2oCANCGHns8VtzG5nCMP) — 本文所有題號、配分、提示與環境設定
- [Lec06-Quantization-II.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&dl=0) — 對應的整數推論公式、per-channel、校準方法
- [Lec05-Quantization-I.pdf（Fall 2024）](https://www.dropbox.com/scl/fi/qc2s9opsa2mnqfithvwz1/Lec05-Quantization-I.pdf?rlkey=sizfzkdv85etnplz1nqgngeql&dl=0) — K-means 與線性量化的基礎
- [MIT 6.5940 Fall 2026 課程頁](https://hanlab.mit.edu/courses/2026-fall-65940) — Fall 2026 的 Lab 2 排程
- [Han et al., Deep Compression（arXiv:1510.00149）](https://arxiv.org/abs/1510.00149) — notebook 引用的 K-means 量化與 centroid 微調
- [Jacob et al., Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference（arXiv:1712.05877）](https://arxiv.org/abs/1712.05877) — notebook 引用的線性量化
