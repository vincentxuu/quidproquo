---
title: "模型怎麼知道自己錯了：Loss Function 與 Cross-Entropy"
date: 2026-08-26
category: ai
type: deep-dive
tags: [loss-function, cross-entropy, perplexity, ai-model, training, nlp]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 4
tldr: "模型每次預測下一個 token 時，會給每個候選詞一個機率。Loss function 衡量這個機率分佈跟正確答案差多遠——差越多，loss 越高，模型就知道自己錯得越離譜。Cross-entropy 是最常用的算法，perplexity 是它的直覺版。"
description: "Loss function 入門：cross-entropy 怎麼衡量模型預測與正確答案的距離、perplexity 的直覺意義，以及為什麼這是模型訓練的起點。"
draft: false
glossary:
  - term: "Cross-Entropy"
    def: "交叉熵，衡量兩個機率分佈差異的指標，是語言模型最常用的 loss function"
  - term: "Perplexity"
    def: "困惑度，cross-entropy loss 的指數形式——perplexity 為 k 表示模型平均在 k 個選項間猶豫"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-loss-function-en)

你跟 ChatGPT 說「台灣的首都是」，它回答「台北」。你覺得理所當然。但模型怎麼知道「台北」是對的、「高雄」是錯的？更根本的問題是：在訓練階段，模型怎麼知道自己錯了、錯了多少？

答案是 **loss function**——一個打分函式，每次模型做完預測，它就算一個分數告訴模型「你這次猜得有多離譜」。

## 猜數字遊戲

想像一個猜數字遊戲。你心裡想一個 1 到 10 的數字，我來猜。

如果我說「我百分之百確定是 7」，結果答案是 7——我的信心跟事實完全吻合，得分最高。

如果我說「我百分之百確定是 7」，結果答案是 3——我不但猜錯了，還極度自信地猜錯。這比「我覺得可能是 7 吧，但也不太確定」還要糟糕得多。

Loss function 做的就是這件事：它不只看你猜對還猜錯，還看你**有多確信地猜錯**。越自信地猜錯，loss 越高。

## 語言模型在猜什麼？

回到語言模型。前幾篇提過，模型一次只預測一個 token。給定「台灣的首都是」，模型輸出的不是「台北」這個字，而是一組**機率分佈**——詞彙表裡每個 token 各有一個機率：

| Token | 模型給的機率 |
|-------|-------------|
| 台     | 0.85        |
| 高     | 0.05        |
| 花     | 0.02        |
| 新     | 0.02        |
| …     | …           |

（下一步模型會看到「台灣的首都是台」，再預測「北」的機率——但我們先只看這一步。）

訓練資料裡，正確答案是「台」。正確答案的機率分佈是：「台」= 1，其他所有 token = 0。

Loss function 的工作：**比較模型的機率分佈跟正確答案的機率分佈，算出差多遠**。

## Cross-Entropy：標準算法

語言模型用的 loss function 叫 **cross-entropy**（交叉熵）。

直覺上，cross-entropy 只看一件事：**模型給正確答案多少機率？**

如果模型給了正確答案 0.85 的機率，loss 不高——它大致猜對了。如果模型只給了正確答案 0.01 的機率，loss 會很高——它幾乎完全沒料到正確答案。

<details>
<summary>Cross-entropy 的公式</summary>

對一個 token 的預測，cross-entropy loss 是：

```
L = -log(p)
```

其中 `p` 是模型給正確答案的機率。

為什麼用 `-log`？

- 當 `p = 1`（完美預測），`-log(1) = 0`，loss 為零。
- 當 `p = 0.5`，`-log(0.5) ≈ 0.693`。
- 當 `p = 0.01`，`-log(0.01) ≈ 4.605`。
- 當 `p → 0`，`-log(p) → ∞`。

`-log` 把「接近 0 的機率」放大成「接近無限的 loss」，狠狠懲罰那些「自信地忽略正確答案」的預測。

完整的 cross-entropy 公式考慮整個機率分佈：

```
H(P, Q) = -Σ P(x) × log Q(x)
```

其中 `P` 是正確答案的分佈（one-hot），`Q` 是模型的預測分佈。因為 `P(x)` 只有在正確答案時等於 1，其他都是 0，所以展開後只剩一項，就是上面的 `-log(p)`。

</details>

### 一個完整的例子

假設模型看到「今天天氣真」，要預測下一個 token。詞彙表只有四個 token：好、熱、冷、差。訓練資料裡正確答案是「好」。

模型 A 的預測：

| Token | 機率 |
|-------|------|
| 好     | 0.70 |
| 熱     | 0.15 |
| 冷     | 0.10 |
| 差     | 0.05 |

模型 A 的 loss = `-log(0.70) ≈ 0.357`

模型 B 的預測：

| Token | 機率 |
|-------|------|
| 好     | 0.10 |
| 熱     | 0.30 |
| 冷     | 0.30 |
| 差     | 0.30 |

模型 B 的 loss = `-log(0.10) ≈ 2.303`

模型 B 的 loss 是模型 A 的 6.4 倍。模型 B 不只猜錯了——它把機率分散在錯誤的答案上，幾乎沒給正確答案機會。Loss function 精確地抓住了這個差距。

## Perplexity：讓 Loss 變成人話

Cross-entropy loss 的數值（0.357、2.303）不太直覺。研究者發明了 **perplexity**（困惑度）來翻譯它。

Perplexity 就是 cross-entropy 的指數版：

```
Perplexity = e^(cross-entropy loss)
```

用上面的例子：

- 模型 A：perplexity = e^0.357 ≈ **1.43**
- 模型 B：perplexity = e^2.303 ≈ **10.0**

Perplexity 的直覺意義：**模型平均在幾個選項之間猶豫**。

模型 A 的 perplexity 是 1.43，代表它幾乎就鎖定正確答案了——在不到兩個選項之間猶豫。模型 B 的 perplexity 是 10，代表它就像在 10 個選項中隨機猜一樣茫然。

當你看到論文裡寫「GPT-4 在 WikiText-103 上的 perplexity 是 8」，意思就是：**模型平均在預測每個 token 時，就像在 8 個等機率的選項中做選擇**。Perplexity 越低，模型越「有把握」。

<details>
<summary>Perplexity 的完整定義</summary>

對一段文字（N 個 token）的 perplexity：

```
PP = e^( -(1/N) × Σ log p(token_i) )
```

也就是「每個 token 的平均 cross-entropy loss」取指數。這樣不管文字多長，perplexity 都是可比較的——它永遠代表「平均在幾個選項間猶豫」。

</details>

## Loss 是訓練的起點，不是全部

Loss function 告訴模型「你錯了多少」，但它本身不會修正模型。它只是一個分數。

就像考試成績告訴你考得好不好，但不會自動幫你改進——你還需要「檢討」和「練習」的步驟。在模型訓練裡，「檢討」的步驟叫做**梯度下降（gradient descent）**——那是下一篇的主題。

Loss function 的角色是：**提供明確、可量化的回饋**。沒有 loss function，模型就像一個永遠不知道答案對不對的學生——不管猜了什麼，都沒有人告訴它好不好。有了 cross-entropy loss，模型在每一個 token 的預測上都能得到精確的回饋。

這就是訓練的起點。

## 參考資料

- [Stanford CS109 — Lecture 18: Information Theory](https://web.stanford.edu/class/cs109/) — 資訊理論的數學基礎，涵蓋 entropy 與 cross-entropy 的推導
- [Stanford CS109 — Lecture 5: Random Variables & Expectation](https://web.stanford.edu/class/cs109/) — 機率論基礎，理解 loss function 需要的期望值概念
- [Hugging Face — Perplexity of Fixed-length Models](https://huggingface.co/docs/transformers/en/perplexity) — 實際計算語言模型 perplexity 的教學
