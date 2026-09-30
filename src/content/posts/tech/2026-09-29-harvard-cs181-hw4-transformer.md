---
title: "Harvard CS181 HW4（上）：Transformer 從手算注意力到多頭"
date: 2026-09-29
category: tech
tags: [harvard, cs181, transformer, self-attention, attention, homework]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 6
type: guide
tldr: "HW4 Problem 1（40 分）分五小題拆解 self-attention：2×2 手算、為什麼除以 √dk、沒有位置編碼時的 permutation equivariance、只用 NumPy 寫單頭注意力、用 PyTorch 寫多頭並在合成資料上畫注意力熱圖。"
description: "Harvard CS1810 Spring 2026 HW4 Problem 1 逐題導讀：scaled dot-product attention 手算、√dk 的變異數論證、置換等變性與位置編碼、NumPy 自注意力實作與 multi-head attention，對照 Section 6 講義。"
draft: false
glossary:
  - term: "permutation equivariance"
    aliases: ["置換等變性"]
    definition: "輸入的順序被打亂時，輸出也以完全相同的方式被打亂，內容本身不變。"
    context: "沒有位置編碼的 self-attention 具有這個性質，所以它分不出詞序。"
  - term: "scaled dot-product attention"
    aliases: ["縮放點積注意力"]
    definition: "用 query 和 key 的內積除以 √dk 當分數，經 row-wise softmax 變成權重，再對 value 加權平均。"
    context: "HW4 Problem 1 的核心公式 softmax(QKᵀ/√dk)V。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW4](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw4)（`hw4_release.tex/pdf/ipynb`，due 2026-04-03）與 [Section 6 講義](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf)為準，全部於 2026-09-29 實際打開。本課整體為 **A3**（作業、notebook、section 與解答公開），但沒有當期錄影、沒有作業解答，Gradescope 需要選課。[官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)寫講義投影片放在 Google Drive 資料夾，CSV 匯出不含連結，本篇沒有取得 2026 的 Transformers 講課投影片，講課內容一律不推測。

這是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)的第 6 篇。上一篇是[期中檢核](/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint)，這篇進入期中後的第一份作業 HW4。

## HW4 在學期裡的位置

依 [2026 官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)，HW4 的三個主題是這樣排的：

- **Week 6**：週二講 Representation Learning / Autoencoders，週四（3 月 5 日）講 Transformers。
- **期中前後**：3 月 10 日期中考，3 月 12 日講 Non-parametric Models / Decision Trees。
- **作業與 section**：HW4 在春假後的 3 月 23 日發布、4 月 3 日截止，搭配 3 月 24 日那週的 **Section 6：Transformers, Autoencoders, Decision Trees**。

[HW4 題目](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)標題是「Representation Learning, Transformers, and Non-parametric methods」，共三題。本系列拆成三篇：

| 篇 | 對應題目 | 配分 |
|---|---|---|
| 本篇 | Problem 1 Understanding the Transformer | 40 |
| [HW4（中）](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae) | Problem 2 Autoencoders | 標題 76 |
| [HW4（下）](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe) | Problem 3 Decision Trees, RF, MoE | 標題未標總分 |

Problem 1 的五小題是一條完整的線：先用最小的矩陣手算一次，再問兩個設計選擇（為什麼縮放、為什麼需要位置），最後寫成程式、擴成多頭。

## (a) 10 分：2×2 手算

題目給 `T = 2` 個 token、維度 `d = 2`，`X` 是單位矩陣，另給三個 2×2 權重矩陣 `W_Q`、`W_K`、`W_V`，要你算 `Q`、`K`、`V`、原始分數 `S = QKᵀ`，再除以 `√dk` 後做 row-wise softmax 得到注意力矩陣 `A`。

最值得先注意的一點：**`X` 是單位矩陣，所以 `Q = W_Q`、`K = W_K`、`V = W_V`**，這一步不用算。真正要動手的只有 `QKᵀ` 和兩列 softmax。題目允許答案留成 `e^(·)` 的形式。

做完後可以直接用 notebook 驗證：`hw4_release.ipynb` 裡有一格「Verification: Updated Part (a) Hand Calculation」，用同一組矩陣印出 `Q`、`K`、`V`、原始分數、縮放後分數與注意力權重。先手算、再跑這格對答案，比反過來做有用。

## (b) 5 分：為什麼要除以 √dk

題目假設 `q`、`k` 每個分量彼此獨立、平均 0、變異數 1，要你：

1. 算 `qᵀk = Σ qᵢkᵢ` 的平均與變異數
2. 說明 `dk` 變大時內積大小怎麼變、softmax 會變得更平均還是更尖銳
3. 證明除以 `√dk` 後變異數固定為 1

直覺是：內積是 `dk` 項的加總，項數越多，數值散得越開。[Section 6 講義](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) §1.4 的說法是，logit 太大會讓 softmax 非常尖銳，而非常尖銳的 softmax 幾乎處處梯度都很小；除以 `√dk` 讓 logit 的典型尺度不隨維度改變，避免 softmax 過早飽和。

<details>
<summary>推導骨架（只列需要用到的性質）</summary>

- 每一項 `qᵢkᵢ`：獨立且平均 0，所以 `E[qᵢkᵢ] = E[qᵢ]E[kᵢ] = 0`
- `Var(qᵢkᵢ) = E[qᵢ²kᵢ²] − 0 = E[qᵢ²]E[kᵢ²]`，兩個都是 1
- 各項獨立，變異數可以直接相加，得到總變異數與 `dk` 的關係
- 縮放：`Var(c·Y) = c²·Var(Y)`，代入 `c = 1/√dk`

</details>

## (c) 5 分：置換等變性與位置編碼

`P_σ` 是置換矩陣。題目要你證明沒有位置編碼時：

```text
Attention(P_σ X) = P_σ Attention(X)
```

提示已經指路：左乘 `P_σ` 之後，`Q`、`K`、`V` 都變成 `P_σ Q`、`P_σ K`、`P_σ V`；分數矩陣變成 `P_σ S P_σᵀ`；row-wise softmax 對「列和欄同時重排」不敏感。把這三步串起來就是證明。

接著兩小題問：這個性質為什麼會害到語言模型（「狗咬人」和「人咬狗」會得到一樣的一袋表示），以及加上位置編碼 `X' = X + PE` 為什麼能打破它（`PE` 綁在位置上，不會跟著 `X` 一起被重排）。

有一個用詞要小心。Section 6 講義 §1.9 寫的是「self-attention alone is **permutation-invariant**」，作業要你證的是 **equivariant**。兩者差在輸出：每個 token 各自的輸出會跟著輸入一起重排，這是等變；如果再把所有 token 取平均或加總成一個向量，結果完全不變，才是不變。寫作答時用作業的定義。

notebook 裡的 `TinyTransformerClassifier` 正好示範了這個修正：它在 token embedding 上加了一個可學習的 `position_embedding`。

## (d) 10 分：只用 NumPy 寫單頭注意力

函式簽名已經給好：`self_attention(X, W_Q, W_K, W_V)` 回傳 `output`（`T × dv`）與 `weights`（`T × T`）。規定**只能用 NumPy**，不能用 PyTorch 或 sklearn 的現成實作。

notebook 裡的 TODO 把步驟列成五行：投影出 `Q/K/V` → `S = QKᵀ` → 乘 `1/√dk` → 數值穩定的 row-wise softmax → 乘上 `V`。

唯一的陷阱在 softmax。題目的提示是先減掉每列的最大值再取指數，這不會改變 softmax 的結果，但能避免 `exp` 溢位。常見錯誤是減掉整個矩陣的最大值，或 `max` 忘了 `axis=-1, keepdims=True`，導致廣播方向錯。notebook 附了兩組隱藏測資，用 `atol=1e-10` 比對輸出和權重，任何一步寫錯都過不了。

## (e) 10 分：多頭注意力與注意力熱圖

多頭的定義是：`h` 個頭各自有一組 `W_Q⁽ⁱ⁾`、`W_K⁽ⁱ⁾`、`W_V⁽ⁱ⁾`，`dk = dv = d/h`，各頭輸出串接後乘上 `W_O`。Section 6 §1.6 的解釋是，單一注意力矩陣一次只能表達一種「相關」，多頭讓模型同時擁有幾種相關性再重新組合。

這一題改用 PyTorch，notebook 的 TODO 指定了做法：`W_Q`、`W_K`、`W_V`、`W_O` 都是 `d_model → d_model`、不含 bias 的 `nn.Linear`，**分頭靠 reshape**（`.view` 加 `.transpose` 變成 `(B, num_heads, T, d_k)`），不是建 `h` 個小線性層。這是實務上的標準寫法，也是這題最容易卡住的地方：維度轉置順序錯一次，測資就過不了。

寫好後把它接進 `TinyTransformerClassifier`（單層、`d_model=32`、`num_heads=4`），在合成資料上訓練 10 個 epoch。資料設計很簡單：每條序列是 `[CLS]` 開頭，接 5 個位置，裡面是雜訊 token `NOISE_A` / `NOISE_B`，其中一個隨機位置放 `VAL0` 或 `VAL1`，標籤就由它決定。分類器只讀 `[CLS]` 位置的表示。

作答要附一張學到的注意力熱圖並描述模型在看哪裡。notebook 的提示是看 `[CLS]` 那一列最有用：如果訓練成功，`[CLS]` 應該把大部分權重放在 `VAL0/VAL1` 所在的位置，因為那是唯一有資訊的 token。

## 這題跟 LLM 的關係

你每次送 prompt 給 LLM，每一層都在做 (d) 這個運算：每個 token 用 query 去比對所有 token 的 key，再把 value 加權平均。Section 6 講義把它比喻成「學出來的相似度函數」，跟 HW1、HW3 的 kernel 是同一個想法，差別在相似度本身是訓練出來的。

HW4 Problem 1 沒有處理 causal mask、KV cache 或長上下文的成本，這些要到 HW6 的自迴歸模型題才會出現。

## 延伸閱讀

同一個主題在其他課的角度不同，想往下挖可以接：

- [CS224N 第 5 講：從 recurrence 到 Transformer](/posts/ai/2026-08-22-cs224n-transformers)：從 RNN 的限制推到 attention，偏 NLP 脈絡
- [CME295 第 1 講：從切字到 Transformer](/posts/ai/2026-09-29-cme295-transformer)：用一句例句走完 tokenization、attention 與 encoder-decoder
- [CS336 Lecture 4：Attention 不只一種](/posts/ai/2026-08-22-cs336-attention-moe)：linear attention、稀疏注意力與 MoE，偏系統與成本

## 下一篇

[HW4（中）：Autoencoder 為何不能生成，VAE 補了什麼](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)——從「每個 token 看彼此」換到「把一張圖壓進窄窄的 latent 再還原」。

## 參考資料

- [CS1810 Spring 2026 HW4 題目 hw4_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)
- [CS1810 Spring 2026 HW4 notebook hw4_release.ipynb](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.ipynb)
- [CS1810 Spring 2026 HW4 題目 PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.pdf)
- [CS1810 Spring 2026 Section 6: Transformers and Decision Trees](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf)（[solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf)）
- [CS1810 Spring 2026 官方課表（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS181 2026 課程網站](https://harvard-ml-courses.github.io/cs181-web/)
- [Vaswani et al. 2017, Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [世界名校 AI／CS 課程地圖（A0–A3 分級）](/posts/learning/2026-08-21-global-ai-cs-course-map)
