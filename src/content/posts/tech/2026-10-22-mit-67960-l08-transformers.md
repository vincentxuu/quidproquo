---
title: "MIT 6.7960 L08：Transformer —— Token、Attention 與位置編碼，以及它和 MLP/CNN/GNN 的關係"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - transformer
  - attention
  - positional-encoding
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 8 講（Phillip Isola）：Transformer 的三個核心想法（token、attention、positional code），以及它和 MLP、CNN、GNN 其實都是同一類「訊息傳遞」的變體。"
tldr: "Transformer 不是憑空冒出的架構：token 把資料切成離散單元，attention 做軟性的訊息聚合，positional code 補回順序。把它和 MLP/CNN/GNN 擺在一起看，會發現它們都是『對鄰居做加權彙整』的不同特例。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 10
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 17
---

> 🌏 [English version](/posts/tech/2026-10-22-mit-67960-l08-transformers-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Phillip Isola** 授課，必讀材料為 *Transformers* 講義（以視覺為例，但架構適用於任意資料）。

---

## 三個核心想法

第 8 講把 Transformer 拆成三個獨立、但彼此配合的想法：

1. **Token**：把輸入切成一組離散單元（文字的 subword、圖片的 patch、時間序列的時間步）。Token 化讓「任意結構的資料」都能被同一套架構處理。
2. **Attention**：每個 token 去「看」其他所有 token，並按相關性加權彙整它們的資訊。這是一種軟性的、資料驅動的訊息聚合，而不是像 CNN 那樣寫死的局部感受野。
3. **Positional code**：因為 attention 本身對順序無感（把 token 打散順序，attention 結果不變），必須顯式地把「位置」編進表示裡。

這三者合起來，就是一個能處理任意長度、任意結構輸入，且能建模全域依賴的架構。

## Attention 的數學與直覺

Scaled dot-product attention 的核心：

```
Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V
```

- `Q`（query）、`K`（key）、`V`（value）都由輸入 token 線性投影得到。
- `Q Kᵀ` 衡量「這個 token 想找的」和「那個 token 提供的」有多匹配，得到一個相似度分數。
- `softmax` 把分數變成機率（歸一化的權重）。
- 用這些權重對 `V` 做加權平均，得到每個 token 的輸出表示。

Multi-head attention 只是把 `Q/K/V` 投影到多個子空間，各自算一次 attention 再拼回來——讓模型同時關注不同類型的依賴（語法、語義、距離……）。

PyTorch 實作一個簡化版：

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v):
    # q, k, v: (batch, seq_len, d_k)
    d_k = q.size(-1)
    scores = (q @ k.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return weights @ v, weights
```

## 位置編碼：補回順序

純 attention 是 **permutation equivariant** 的——輸入順序改變，輸出只是跟著重排，模型本身不知道誰在前誰在後。常見的三種補法：

- **Sinusoidal（Vaswani 原版）**：用不同頻率的正餘弦函數產生位置向量，加到 token embedding 上。好處是可外推到比訓練時更長的序列。
- **Learned positional embedding**：直接學一張位置查表。簡單，但不能自然外推。
- **RoPE（Rotary Position Embedding）**：把位置資訊編進旋轉操作裡，讓「相對位置」直接反映在内積中，是目前 LLM 的主流選擇之一。

選哪種本質上是「要不要犧牲外推能力換取表達彈性」的取捨。

## 它和 MLP / CNN / GNN 其實是同一家人

這一講最精彩的一點：把 Transformer 和前面學過的架構並排看，會發現它們都是 **「對鄰居做加權彙整（message passing）」** 的特例，差別只在「誰是鄰居」和「權重怎麼算」：

- **MLP**：每個神經元只看自己這層的所有神經元（全連接 = 所有人都是鄰居），權重是固定的參數。
- **CNN**：每個像素只看局部 3×3 鄰居，權重是空間共享的卷積核。
- **GNN**：每個節點只看圖上的相連節點，權重由邊決定。
- **Transformer**：每個 token 看**所有** token（全域鄰居），權重由資料本身（QK 相似度）動態決定。

所以 Transformer 不是「推翻」了前面的架構，而是把「鄰居集合」放大到全域、把「權重」從靜態參數變成動態計算。這也解釋了為什麼它特別適合長距離依賴（例如一段話裡首尾呼應的代詞指代）。

## 為什麼這對實作重要

- **不要神化 Transformer**：它是一種 inductive bias 很弱的架構（全域注意力幾乎不假設結構），所以資料效率通常不如 CNN（影像）或 GNN（圖），但在資料夠多時上限最高。
- **注意力不是免費的**：`O(n²)` 的序列長度複雜度意味著長序列會很吃顯存。實務上要用 FlashAttention、稀疏注意力、或把長序列切成塊來緩解。
- **位置編碼是隱形地雷**：如果你的任務對順序敏感（大多數任務都是），忘記加位置編碼，模型表現會慘不忍睹。

## 參考資料
- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Vaswani et al., *Attention Is All You Need*, 2017：[arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
- Su et al., *RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)*, 2021：[arXiv:2104.09864](https://arxiv.org/abs/2104.09864)
- Stanford CS224N 講義（attention 章節）：[課程首頁](https://web.stanford.edu/class/cs224n/)

