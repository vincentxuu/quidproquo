---
title: "Transformer 與 Attention：模型怎麼決定該看哪些字"
date: 2026-08-26
category: ai
type: deep-dive
tags: [transformer, attention, self-attention, nlp, ai-model, architecture]
lang: zh-TW
series:
  name: "認識 AI 模型"
  order: 6
tldr: "Transformer 的核心是 self-attention：對每個 token，模型算出它跟其他所有 token 的相關程度，然後按權重加總。這讓模型能跨越距離抓到「it 指的是 cat 不是 mat」這種關係，也是它處理長文的基礎。"
description: "Transformer 與 self-attention 入門：Query/Key/Value 的直覺、attention matrix 怎麼決定模型該看哪些字、multi-head attention 為什麼需要多組、以及 positional encoding 怎麼讓模型知道語序。"
draft: false
glossary:
  - term: "Self-Attention"
    def: "自注意力機制——每個 token 跟序列中所有其他 token 算相關性，決定該「注意」誰"
  - term: "Multi-Head Attention"
    def: "多頭注意力——同時用多組不同的 Q/K/V 去捕捉不同類型的關係（語法、語意、指代等）"
---

> 🌏 [English version](/en/posts/ai/2026-08-26-understanding-ai-models-transformer-en)

## 場景：「it」指的是誰？

讀這句英文：

> The cat sat on the mat because **it** was tired.

你知道「it」指的是 cat，不是 mat。你是怎麼知道的？因為「tired」是個形容動物狀態的詞，而 cat 是動物、mat 是地墊。你不需要逐字閱讀——你的眼睛跳回前面，挑出了最相關的詞。

模型也需要做同樣的事。在決定「it」之後該接什麼字的時候，它必須回頭看之前的所有 token，然後**決定哪些值得關注、哪些可以忽略**。

這就是 attention 做的事。

## 直覺：選擇性閱讀

想像你在讀一份很長的合約，讀到某一句時遇到一個代名詞「該方」。你不會從頭重讀一遍——你的眼睛往前掃，找到最可能的對象，忽略不相關的句子。

Attention 的運作方式幾乎一模一樣：

- 對每個 token，模型問一個問題：**「序列裡的其他 token，哪些跟我現在的任務最相關？」**
- 給每個 token 一個相關分數（0 到 1 之間的權重）
- 權重高的 token 被重點關注，權重低的幾乎被忽略
- 最後把所有 token 的資訊按權重加總，得到這個位置的「理解」

這不是什麼新穎的想法——你每天都在做。Attention 只是把「選擇性閱讀」變成了可以被計算的數學操作。

## 機制：Query、Key、Value

直覺有了，但模型到底怎麼算出「哪些 token 相關」？答案是三個向量：**Query（查詢）、Key（索引）、Value（內容）**。

### 圖書館類比

想像一座圖書館：

- **Query（Q）**：你走進圖書館時腦中的問題——「我要找關於貓的疲勞的書」
- **Key（K）**：每本書書脊上的標籤——「動物行為」「地板材質」「睡眠科學」
- **Value（V）**：書的實際內容

你拿自己的 Query 去跟每本書的 Key 比對。比對結果越好（相關性越高），你就越想翻開那本書讀它的 Value。

在 Transformer 裡，每個 token 同時擁有三個角色：

1. 當它是「正在被處理的 token」時，它發出 **Query**——「我在找什麼？」
2. 當它是「被查看的候選 token」時，它提供 **Key**——「我能提供什麼線索？」
3. 如果它被選中了，它貢獻 **Value**——「這是我的實際內容」

### 算相關性：QK 點積

Q 和 K 都是向量（上一篇講的 embedding 向量，經過線性轉換後得到的）。兩個向量越相似，點積越大。

```
relevance("it", "cat")  = Q_it · K_cat  = 8.2  ← 高！
relevance("it", "mat")  = Q_it · K_mat  = 1.1  ← 低
relevance("it", "the")  = Q_it · K_the  = 0.3  ← 幾乎忽略
```

把所有分數通過 softmax（讓它們加總為 1），就得到 **attention 權重**：

```
weights: [cat: 0.85, mat: 0.08, the: 0.02, sat: 0.03, on: 0.01, because: 0.01]
```

最後，用這些權重去加總所有 token 的 Value：

```
output_it = 0.85 × V_cat + 0.08 × V_mat + 0.02 × V_the + ...
```

結果：「it」這個位置的輸出表示，幾乎就是「cat」的語意。這就是模型「理解」了 it 指的是 cat 的方式。

### Attention Matrix：一張表看全局

如果句子有 N 個 token，那每個 token 都要跟其他 N 個 token 算一次相關性。這形成一個 N×N 的矩陣，叫做 **attention matrix**。

以「The cat sat on the mat」為例（簡化版）：

```
         The   cat   sat    on   the   mat
The     [0.1   0.2   0.1   0.1  0.3   0.2]
cat     [0.1   0.3   0.2   0.0  0.1   0.3]
sat     [0.0   0.5   0.2   0.1  0.0   0.2]
on      [0.1   0.1   0.2   0.1  0.1   0.4]
the     [0.2   0.1   0.1   0.1  0.2   0.3]
mat     [0.1   0.1   0.1   0.3  0.2   0.2]
```

每一列加總為 1。你可以把每一列讀成：「這個 token 把多少注意力分配給其他 token」。`sat` 那列把 0.5 的注意力給了 `cat`——因為「誰在坐？」最相關的就是主詞。

<details>
<summary>技術補充：Scaled Dot-Product Attention 公式</summary>

完整的 attention 計算如下：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V
$$

除以 $\sqrt{d_k}$（key 向量的維度）是為了防止點積值太大導致 softmax 輸出過於極端（幾乎全部權重集中在一個 token 上）。這個縮放讓梯度更穩定，訓練更順暢。

</details>

## Multi-Head Attention：多組閱讀策略

一組 Q/K/V 只能捕捉一種類型的關係。但語言裡的關係是多層次的：

- **語法關係**：「sat」的主詞是「cat」
- **指代關係**：「it」指的是「cat」
- **修飾關係**：「tired」修飾的是「it」（間接修飾「cat」）

Multi-head attention 的做法是：**同時跑多組 Q/K/V，每組學會關注不同類型的模式**。

想像你派了 8 個人（8 個 head）去同一座圖書館，每個人帶著不同任務：

- 第 1 個人負責找主詞-動詞關係
- 第 2 個人負責找代名詞指代
- 第 3 個人負責找形容詞修飾對象
- ……

每個人獨立搜尋，最後把結果合併起來，模型就同時具備了多種「閱讀視角」。

<details>
<summary>技術補充：Head 數量與維度</summary>

實際上，模型不會手動指定每個 head 負責什麼——它在訓練中自動學會分工。常見配置是 8 到 128 個 head。每個 head 的維度是 $d_{\text{model}} / h$，所以總計算量跟單一大 head 差不多，但表達能力更強。

</details>

## Positional Encoding：模型怎麼知道語序

到目前為止有個問題被忽略了：attention 計算完全不關心 token 的位置。對 attention 來說，「The cat sat on the mat」和「mat the on sat cat The」是一樣的——它只看內容，不看順序。

但語序顯然很重要。「狗咬人」和「人咬狗」意思完全不同。

解決方法是在 embedding 上加入**位置資訊**（positional encoding）。最簡單的理解：每個 token 除了自己的語意向量之外，還會被加上一個「位置向量」，告訴模型它在第幾個位置。

```
final_input = embedding("cat") + position(2)
```

這樣 attention 在計算 QK 點積時，就能同時考慮「這個 token 是什麼」和「它在哪裡」。

<details>
<summary>技術補充：位置編碼的演進</summary>

原版 Transformer（2017）用固定的正弦函數生成位置向量。現代模型（如 LLaMA、GPT）多用旋轉位置編碼（RoPE）或可學習的位置 embedding。RoPE 的優勢是能更好地處理超長序列，也是「YaRN」「NTK-aware」等長文擴展技術的基礎。

</details>

## 連回模型：Attention 為什麼重要，又為什麼不完美

現在你知道了 Transformer 的核心運作方式：

1. 每個 token 透過 Q/K/V 跟所有其他 token 算相關性
2. 按權重加總，得到融合了上下文的表示
3. 多個 head 同時捕捉不同類型的關係
4. 位置編碼保留語序資訊

這解釋了為什麼現代語言模型能力這麼強——它們可以在一次計算中看到整個輸入序列的任何位置，不需要像舊架構（RNN）那樣一個字一個字地依序處理，資訊到後面就逐漸遺忘。

但 attention 也有它的代價：

- **計算量跟序列長度的平方成正比**。N 個 token 需要 N×N 次比對。這就是為什麼 context window 有上限——不是模型「記不住」，而是太長的輸入算不動（或太慢太貴）。
- **不是所有 token 都會被好好關注**。即使 context window 內的 token 理論上都「看得到」，在很長的文件中，中間段落的 attention 權重往往會被稀釋。這就是有些模型在處理長文時「遺漏中間細節」的原因。

下一篇我們會看到，模型的原始能力從何而來——預訓練、SFT、RLHF 三個訓練階段如何把一個只會接字的模型，變成一個有用且安全的助手。

## 想深入

- [Stanford CS224N Lecture 5: Self-Attention and Transformers](https://web.stanford.edu/class/cs224n/)——從語言學角度講 attention 的動機
- [Stanford CS336 Lecture 3: Transformers](https://stanford-cs336.github.io/spring2025/)——更偏工程面，含完整的實作細節
- [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762)——原始論文，開啟了 Transformer 時代
- [The Illustrated Transformer (Jay Alammar)](https://jalammar.github.io/illustrated-transformer/)——可能是網路上最好的 Transformer 視覺化解說

## 參考資料

- Vaswani, A. et al. (2017). [Attention Is All You Need](https://arxiv.org/abs/1706.03762). NeurIPS 2017.
- Stanford CS224N: [Natural Language Processing with Deep Learning — Lecture 5: Self-Attention and Transformers](https://web.stanford.edu/class/cs224n/).
- Stanford CS336: [Language Modeling from Scratch — Lecture 3: Transformers](https://stanford-cs336.github.io/spring2025/).
- Alammar, J. (2018). [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/).
- Su, J. et al. (2024). [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864). Neurocomputing, 568, 127063.
