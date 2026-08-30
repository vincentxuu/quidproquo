---
title: "MIT 6.7960 L10：記憶與序列建模 —— RNN、LSTM 與梯度消失／爆炸"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - rnn
  - lstm
  - sequence-modeling
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 10 講（Sara Beery）：為什麼序列資料需要記憶，vanilla RNN 的遞歸如何導致梯度消失／爆炸，以及 LSTM/GRU 用門控機制解決長程依賴。"
tldr: "RNN 把過去壓進一個隱狀態，但遞歸讓梯度在時間上連乘，要嘛消失要嘛爆炸；LSTM 用輸入/遺忘/輸出門把『記憶』與『更新』解耦，讓長程資訊能穩定流動。注意力後來取代它，是因為 O(1) 取用任意歷史。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 12
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 19
---

> 🌏 [English version](/posts/tech/2026-11-05-mit-67960-l10-memory-sequence-en)

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

問題出在 BPTT 的鏈式法則。要更新 `W`，梯度要沿時間往回傳 `T` 步，每一步都乘上遞歸的 Jacobian `∂h_t / ∂h_{t-1}`。這個矩陣的特徵值決定一切：

- 特徵值 **< 1**：乘 T 次之後趨近 0 → **梯度消失**，早期時間步學不到東西。
- 特徵值 **> 1**：乘 T 次之後爆掉 → **梯度爆炸**，loss 發散。

梯度消失是更常見的痛點：模型只能捕捉短程依賴，長程上下文形同消失。梯度爆炸則可用 **gradient clipping**（把梯度範數截斷）簡單擋住。

## LSTM / GRU：用門控解耦記憶與更新

LSTM（Long Short-Term Memory）的核心洞察是：**不要讓每個時間步都無條件改寫隱狀態**。它引入一套「門」來控制資訊流：

- **遺忘門（forget gate）**：決定上一刻的 cell state 要保留多少。
- **輸入門（input gate）**：決定當前輸入要寫入多少到 cell state。
- **輸出門（output gate）**：決定 cell state 的哪部分要輸出成 `h_t`。

關鍵是那條 **cell state `c_t` 的「高速通道」**：資訊可以沿 `c_t` 幾乎不加改變地流過很多時間步（constant error carousel），因此長程梯度不再被連乘壓垮——這正是它解決梯度消失的方式。GRU 則把門簡化成更新門／重置門，參數更少但效果相近。

PyTorch 直接內建：

```python
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

Transformer（見 L08）直接用 attention 讓任意兩個時間步 **O(1)** 互相看見，既好平行又沒有遞歸的梯度問題。這也是為什麼 2018 年後，序列任務（尤其是 LLM）幾乎全面轉向注意力架構。

但 RNN 家族沒消失：在**線上/串流、低延遲、顯存受限**的場景（邊緣裝置、即時語音），它們仍因為「常數記憶」的優勢佔有一席之地。

## 為什麼這對實作重要

- 用 RNN 時，**梯度裁剪幾乎必開**，否則很容易爆炸。
- 需要長程依賴又想用輕量模型，優先試 **LSTM/GRU** 而非 vanilla RNN。
- 若任務本質是「看完整段再回答」（如文件理解），**注意力才是更自然的選擇**，別硬上 RNN。

## 參考資料
- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Hochreiter & Schmidhuber, *Long Short-Term Memory*, 1997：[JKU 原文 PDF](https://www.bioinf.jku.at/publications/older/2604.pdf)
- Cho et al., *Learning Phrase Representations using RNN Encoder–Decoder (GRU)*, 2014：[arXiv:1406.1078](https://arxiv.org/abs/1406.1078)
- Chris Olah, *Understanding LSTM Networks*（經典圖解）：[colah.github.io](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)

