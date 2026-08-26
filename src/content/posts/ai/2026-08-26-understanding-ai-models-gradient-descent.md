---
title: "模型怎麼改進自己：梯度下降與訓練迴圈"
date: 2026-08-26
category: ai
type: deep-dive
tags: [gradient-descent, backpropagation, training, learning-rate, ai-model, optimization]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 5
tldr: "模型透過 loss 知道自己錯多少，透過梯度知道往哪邊調。梯度下降就是反覆做三件事：算 loss、算梯度、調參數。Learning rate 決定每步調多大——太大會跳過最佳解，太小訓練到天荒地老。"
description: "梯度下降入門：從山谷類比到實際訓練迴圈（forward pass → loss → backward pass → weight update），learning rate 的取捨，以及 epoch 和 batch 的意義。"
draft: false
glossary:
  - term: "Gradient"
    def: "梯度，loss 對每個參數的偏微分方向——告訴模型「往哪邊調會讓 loss 變小」"
  - term: "Learning Rate"
    def: "學習率，每次更新參數時的步幅大小——太大會震盪，太小會收斂過慢"
  - term: "Epoch"
    def: "訓練資料被完整跑過一遍算一個 epoch"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-gradient-descent-en)

你看過模型從 GPT-3 進步到 GPT-4，從回答離題到精準有用。但「進步」在機制上到底是什麼意思？不是有人手動把十億個參數一個一個調好的——那要怎麼做？

上一篇講了 loss function：模型有一個數字告訴自己「我錯了多少」。這篇要回答下一個問題：**知道錯了之後，模型怎麼一步步修正自己？**

## 山谷類比：蒙眼下山

想像你被蒙上眼睛，丟到一片丘陵地形裡。你的目標是走到最低的山谷。你看不見全貌，但你能感覺到**腳下的坡度**——地面往哪邊傾斜、傾斜多陡。

你的策略很直覺：往下坡的方向走一步。到了新位置，再感覺坡度，再往下走一步。重複這個過程，你會逐漸往低處移動。

這就是梯度下降（gradient descent）的核心直覺：

- **你的位置** = 模型目前的參數值
- **地形的高度** = loss 的大小（越低越好）
- **腳下的坡度** = 梯度（gradient）
- **往下坡走一步** = 更新參數

你不需要知道整片地形長什麼樣。你只需要每一步都「感覺坡度，往下走」。

## 梯度：Loss 往哪邊增加最快

梯度的數學定義是：loss 對每個參數的偏微分。但你不需要會算偏微分才能理解它。

梯度告訴你兩件事：
1. **方向**：往哪邊調這個參數，loss 會增加最快
2. **大小**：這個方向的斜率有多陡

既然梯度指向 loss 增加最快的方向，你只要**往反方向走**，就能讓 loss 變小。

模型有數十億個參數，每個參數都有自己的梯度。所有參數的梯度合在一起，就像一個巨大的「方向指南」，告訴模型每個參數該往哪邊調。

<details>
<summary>公式：梯度下降的參數更新</summary>

對於每個參數 $w$，更新規則是：

$$w_{\text{new}} = w_{\text{old}} - \eta \cdot \frac{\partial L}{\partial w}$$

其中：
- $w$ 是某個參數的值
- $\eta$（eta）是 learning rate
- $\frac{\partial L}{\partial w}$ 是 loss $L$ 對參數 $w$ 的偏微分（梯度）
- 負號表示「往梯度的反方向走」（因為梯度指向 loss 增加的方向）

</details>

## 訓練迴圈：四個步驟不斷重複

模型的訓練就是一個迴圈，每次迭代做四件事：

### 1. Forward pass（前向傳播）

把一筆訓練資料丟進模型，讓它從頭算到尾，產生預測結果。

例如，輸入「台北的天氣」，模型輸出下一個 token 的機率分佈。

### 2. 計算 loss

把模型的預測和正確答案比較，算出一個數字代表「錯多少」。上一篇講的就是這一步。

### 3. Backward pass（反向傳播）

這是最關鍵的一步。從 loss 開始，**反向**沿著模型的計算路徑，算出 loss 對每一個參數的梯度。

為什麼要「反向」？因為模型是一層一層堆起來的。Loss 是在最後一層算出來的，但要調的參數散佈在每一層。反向傳播（backpropagation）利用微積分的連鎖律，從後往前把每一層的梯度算出來。

你不需要自己實作反向傳播——PyTorch 和 TensorFlow 會自動幫你做。但理解「梯度是從 loss 反向傳回每一層」這件事，能幫你理解為什麼深度網路訓練時會遇到「梯度消失」或「梯度爆炸」的問題。

<details>
<summary>公式：連鎖律與反向傳播</summary>

假設模型有三層，每層的輸出分別是 $a_1, a_2, a_3$，最終 loss 是 $L(a_3)$。

要算 loss 對第一層參數 $w_1$ 的梯度，連鎖律告訴我們：

$$\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial a_3} \cdot \frac{\partial a_3}{\partial a_2} \cdot \frac{\partial a_2}{\partial a_1} \cdot \frac{\partial a_1}{\partial w_1}$$

反向傳播的做法是：從 $\frac{\partial L}{\partial a_3}$ 開始，逐層往回乘，這樣每個中間梯度只需要算一次，不用從頭重算。

</details>

### 4. 更新參數（weight update）

有了每個參數的梯度，就可以更新參數了。每個參數都往「讓 loss 變小」的方向移動一小步。

然後回到步驟 1，用下一筆資料再來一次。

```
forward pass → 計算 loss → backward pass → 更新參數 → 重複
```

這個迴圈跑幾十億次，模型就從「隨機猜」變成「有用的 AI」。

## Learning Rate：每步走多大

回到山谷類比。你感覺到坡度之後，要決定**走多大步**。這就是 learning rate（學習率）。

**Learning rate 太大**：你大步往下衝，可能直接跨過山谷，跑到對面的山坡上。然後又衝回來，又衝過去——永遠在震盪，到不了谷底。

**Learning rate 太小**：你每步只挪一點點。方向是對的，但要走到谷底需要幾百萬步。訓練時間拉到不切實際。

**剛好的 learning rate**：一開始步子大一點快速接近谷底，後來步子小一點精確收斂。實務上，大多數訓練都會用「learning rate schedule」——隨著訓練進行，逐步縮小 learning rate。

典型的初始 learning rate 在 $10^{-3}$ 到 $10^{-5}$ 之間。這個數字看起來很小，但乘以梯度再乘以幾十億次迭代，效果就出來了。

## Batch 和 Epoch：一次看多少、總共看幾遍

### Batch（批次）

真正訓練時，不會每看一筆資料就更新一次參數——那太不穩定了。一筆資料的梯度可能偏向很特定的方向，不具代表性。

取而代之，模型會一次看一批資料（batch），算出這一批的平均梯度，再更新參數。常見的 batch size 從 32 到數千不等。Batch size 越大，梯度估計越穩定，但需要更多記憶體。

### Epoch（訓練輪次）

所有訓練資料被完整跑過一遍，叫做一個 **epoch**。

大型語言模型的訓練通常只跑 1-2 個 epoch——因為資料量本身已經夠大。當你看到模型發布文章寫「trained for 2 epochs on 15T tokens」，意思是這個訓練迴圈把 15 兆個 token 的資料完整跑了兩遍。每跑一遍，模型的每個參數都被更新了無數次。

相比之下，訓練資料量小的任務（例如 fine-tuning）可能需要跑 3-10 個 epoch，讓模型有足夠的機會從有限的資料中學到模式。

## 訓練的規模

把這些概念連在一起，你就能理解「訓練一個大型語言模型」到底意味著什麼：

- **參數量**：GPT-4 等級的模型有數千億個參數。每個參數在每次更新時都要算一次梯度。
- **訓練資料**：15 兆個 token，跑 1-2 個 epoch。
- **硬體**：數千張 GPU 並行計算，訓練數週到數月。
- **成本**：單次訓練耗資數千萬到上億美元。

這些數字的背後，核心仍然是同一件事：forward pass、算 loss、backward pass、調參數。只是規模大到需要整座資料中心來執行。

## 這篇的重點

1. **梯度**告訴模型每個參數該往哪邊調。它是 loss 對參數的偏微分方向。
2. **梯度下降**就是反覆地算梯度、往反方向調參數，讓 loss 一步步變小。
3. **訓練迴圈**是四步重複：forward pass → 算 loss → backward pass → 調參數。
4. **Learning rate** 決定每步走多大。太大會震盪，太小會太慢。
5. **Batch** 是一次看多少筆資料再更新，**epoch** 是整份資料跑幾遍。

下一篇，我們要看這些被訓練好的參數是怎麼組織起來的——Transformer 架構與 attention 機制。

## 想深入的讀者

- [Stanford CS109：Lecture 19 — Maximum Likelihood Estimation](https://web.stanford.edu/class/cs109/)：Loss function 背後的機率基礎。梯度下降最小化的那個 loss，在統計上等價於最大化資料的 likelihood。
- [Stanford CS224N：Lecture 5 — Backpropagation and Neural Network Training](https://web.stanford.edu/class/cs224n/)：用 NLP 的例子完整走過一次反向傳播，包含計算圖和梯度流。

## 參考資料

- Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*, Chapter 4: Numerical Computation & Chapter 8: Optimization. MIT Press.
- Ruder, S. (2016). [An overview of gradient descent optimization algorithms](https://arxiv.org/abs/1609.04747). arXiv:1609.04747.
- Stanford CS229 Lecture Notes: [Supervised Learning, Discriminative Algorithms](https://cs229.stanford.edu/lectures-spring2022/main_notes.pdf).
