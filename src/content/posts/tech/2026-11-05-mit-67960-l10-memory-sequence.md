---
title: "記憶與序列建模 —— RNN、LSTM 與梯度消失／爆炸｜MIT 6.7960 第 10 堂"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - rnn
  - lstm
  - sequence-modeling
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 10 講（Sara Beery）：為什麼序列資料需要記憶，vanilla RNN 的遞歸如何導致梯度消失／爆炸，以及 LSTM/GRU 用門控機制解決長程依賴。"
tldr: "RNN 沿時間傳遞隱狀態，梯度連乘可能衰減或放大；LSTM 以門控制 cell state 的保留與更新，改善長程訊號傳遞但不保證穩定。Self-attention 縮短位置間的資訊路徑，單層 dense attention 的總計算仍隨序列長度平方成長。"
draft: false
series:
  name: "MIT 6.7960 導讀"
  order: 12
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 19
---

> 🌏 [English version](/posts/tech/2026-11-05-mit-67960-l10-memory-sequence-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Sara Beery** 授課，必讀材料為 *RNNs* 講義與 *RNN Stability Analysis / LSTMs*。

---

## 為什麼序列需要「記憶」

前面的架構（MLP、CNN）對每個輸入獨立處理，沒有「時間」的概念。但語音、文字、感測器串流這類資料，第 t 步的意義高度依賴前面的上下文。要建模這種依賴，網路需要一個**跨時間保留資訊的狀態**。

## Vanilla RNN 與遞歸

最直觀的設計是把隱狀態沿時間傳遞：

```
h_t = tanh(W h_{t-1} + U x_t + b)
y_t = V h_t
```

`h_t` 就是「記憶」：它濃縮了 `x_1 … x_t` 的資訊。訓練時用 **BPTT（Backpropagation Through Time）**——把展開後的網路當成很深的前饋網路來求梯度。

## 梯度消失／爆炸：遞歸的代價

問題出在 BPTT 的鏈式法則。跨時間回傳的梯度要連乘遞歸的 Jacobian `∂h_t / ∂h_{t-1}`，其中也包含 tanh 的導數。先看一個固定純量 Jacobian 的簡化例子：

- 每步乘 **0.5**：20 步後比例是 `0.5^20 ≈ 9.54×10⁻⁷`，早期訊號幾乎消失。
- 每步乘 **2**：20 步後比例是 `2^20 = 1,048,576`，訊號會被大幅放大。

先手算 10 步時的兩個比例，再核對 `0.5^10≈0.000977`、`2^10=1024`。這是本站另設的連乘練習；真正 RNN 的 Jacobian 會隨狀態改變，矩陣乘積的成長也與方向、奇異值及非線性飽和有關，不能只看單步矩陣的特徵值就宣稱決定全部訓練行為。

梯度消失是更常見的痛點：模型只能捕捉短程依賴，長程上下文形同消失。梯度爆炸則可用 **gradient clipping**（把梯度範數截斷）簡單擋住。

## LSTM / GRU：用門控解耦記憶與更新

LSTM（Long Short-Term Memory）的核心洞察是：**不要讓每個時間步都無條件改寫隱狀態**。它引入一套「門」來控制資訊流：

- **遺忘門（forget gate）**：決定上一刻的 cell state 要保留多少。
- **輸入門（input gate）**：決定當前輸入要寫入多少到 cell state。
- **輸出門（output gate）**：決定 cell state 的哪部分要輸出成 `h_t`。

關鍵是那條 **cell state `c_t` 的加法路徑**：當遺忘門接近 1，資訊與梯度可以沿這條路徑保留較久，減少每步都經過同一遞歸變換的負擔。但門值、其他梯度路徑與訓練條件仍可能讓訊號衰減或放大；LSTM 不保證消除梯度問題。GRU 使用更新門／重置門簡化狀態管理，參數通常較少，效果仍要依任務量測。

PyTorch 直接內建：

```python
import torch
import torch.nn as nn

model = nn.LSTM(
    input_size=64,
    hidden_size=128,
    num_layers=2,
    batch_first=True,
)

x = torch.randn(16, 50, 64)  # (batch, seq_len, features)
out, (h_n, c_n) = model(x)   # out: 每個時間步的輸出
```

## 注意力為什麼後來取代了它

RNN/LSTM 有個結構性弱點：**要取用第 1 步的資訊，必須一步步經過中間所有狀態**（順序、O(n) 路徑）。這讓它難以平行、且長程依賴仍受路徑長度拖累。

Transformer（見 L08）的 dense self-attention 在一層內直接連接任意兩個可見位置，縮短位置間的資訊路徑，也方便平行處理。這裡的常數長度是圖上的路徑，不是整段序列的計算成本：dense attention 的位置配對仍是 O(n²)。它移除了沿時間的遞歸，並不保證所有梯度或長程推理問題消失。這些特性使注意力架構成為許多現代文字模型的主流。

但 RNN 家族沒消失：在**線上/串流、低延遲、顯存受限**的場景（邊緣裝置、即時語音），它們仍因為「常數記憶」的優勢佔有一席之地。

## 為什麼這對實作重要

- 用 RNN 時，**梯度裁剪幾乎必開**，否則很容易爆炸。
- 需要長程依賴又想用輕量模型，優先試 **LSTM/GRU** 而非 vanilla RNN。
- 若任務本質是「看完整段再回答」（如文件理解），**注意力才是更自然的選擇**，別硬上 RNN。

## 先用純量遞迴看連乘

以下是本文自編的教學例子，不是講者的實驗或官方作業解答。

為了隔離連乘機制，這個自編例子使用線性純量 h_t=a h_{t-1}，不含 tanh、輸入或 gate。h₀=1、a=0.5，則 h₁=0.5、h₂=0.25、h₃=0.125；對初始狀態的導數也是 a³=0.125。若 a=2，三步的導數是 8。

**檢查與答案：** a=1 時三步的導數是多少？答案 1。真實 RNN 的 Jacobian 還含活化導數且隨狀態變化；這個簡化例子不能用單一特徵值判斷所有訓練情況，也不能保證 gate 永遠不讓梯度衰減。

## 課程影片來源
2026-10-10 已即時回 MIT OCW Fall 2024 官方錄影列表核對講次，影片公開且允許嵌入；講次與主題以 OCW 的標示為準。

```youtube
url: https://www.youtube.com/watch?v=IiHknRHA-Gk
title: MIT 6.7960 Fall 2024 — Lec 10. Architectures: Memory
```

原始影片：[MIT 6.7960 Fall 2024 — Lec 10. Architectures: Memory](https://www.youtube.com/watch?v=IiHknRHA-Gk)

課程與錄影入口：

- [MIT OCW — Lec 10. Architectures: Memory](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec10_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：讀了 Lec 10 字幕（Sara Beery，1:13:28）：影片講 RNN 的記憶與遞歸（約 15%–40%）、梯度消失／爆炸（約 42%–48%）、LSTM 與門控（約 43%–56%），後段（約 78%–86%）講 attention，與文章主題一致；字幕沒有出現 GRU，GRU 的內容是本站補充。

## 更新紀錄


- 2026-10-11：補上自編推理例子與理解檢查，保留來源限制及原作業範圍。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。
- 2026-10-10：依字幕核對影片內容。影片主題與文章一致；註明字幕未提 GRU。

## 參考資料
- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Hochreiter & Schmidhuber, *Long Short-Term Memory*, 1997：[JKU 原文 PDF](https://www.bioinf.jku.at/publications/older/2604.pdf)
- Cho et al., *Learning Phrase Representations using RNN Encoder–Decoder (GRU)*, 2014：[arXiv:1406.1078](https://arxiv.org/abs/1406.1078)
- Chris Olah, *Understanding LSTM Networks*（經典圖解）：[colah.github.io](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)

