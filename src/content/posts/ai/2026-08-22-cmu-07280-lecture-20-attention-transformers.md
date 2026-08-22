---
title: "CMU 07-280 Lecture 20：從 Position Encoding 推到 Causal Self-Attention"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, transformer, attention, gpt-2]
lang: zh-TW
tldr: "第 20 講先把單 token embedding 擴成 sequence，以 positional encoding 補順序，再推導 Q/K/V scaled dot-product attention、causal mask 與 multi-head blocks，最後接到 GPT-2。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 20：positional encoding、Q/K/V attention、causal masking、multi-head attention 與 GPT-2 骨架。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 20
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-20-attention-transformers-en)

Lecture 19 的模型只用一個前 token 預測下一個。**CMU 07-280 Spring 2026 Lecture 20** 問：要同時利用整段 context，該如何保留位置，又讓模型依目前 token 決定要看哪裡？官方題目是 *Attention & Transformers*，投影片從平均 context vectors 一步步推到 GPT-2 skeleton。

## 官方材料與讀取範圍

本文完整讀取 [Lecture 20 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec20_NLP_Attention_Transformers.pdf)、[Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf)，並以 [HW11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) 核對 Building GPT2 對應。官方頁沒有 Spring 2026 逐講公開錄影，因此不描述 slide animation 的現場節奏或教師口述。

Recitation 的 minGPT notebook 位於外部環境；公開 PDF 可確認模型比較、dimension exercises 與示範答案，但不等於完整 notebook／autograder 都匿名開放。

## 承上問題：平均所有 context 會忘記順序與關聯

把 `T` 個 embeddings 平均，能把多 token context 壓成一個 vector：

\[
v'=\frac{1}{T}\sum_{t=1}^{T}v_t.
\]

可是平均對排列不敏感；`dog bites man` 和 `man bites dog` 可能得到同一結果。Transformer 本身也沒有內建位置概念，所以投影片先加入 sinusoidal positional encoding，另展示 rotary position encoding（RoPE）的二維直覺。

只有位置仍不夠。平均讓每個 token 權重相同，但預測 `eat` 後面的詞時，某些 context 應該比其他詞重要。Attention 把固定平均換成依 query 計算的 weighted average。

## 完整概念脈絡：Q、K、V 各自負責什麼

令輸入矩陣 `X∈R^{T×d_model}`。三組 learned linear transforms 產生：

\[
Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V.
\]

`Q` 表示每個位置正在尋找什麼；`K` 表示每個位置可被匹配的索引；`V` 是匹配後真正被加權組合的內容。Scaled dot-product attention 是：

\[
S=\frac{QK^\top}{\sqrt{d_k}},\quad
A=\operatorname{softmax}_{row}(S),\quad
Z=AV.
\]

投影片的 PDF 文字抽取有時把根號遺失，但 Recitation 11 明確寫出 `√d_k`。縮放用來避免 dimension 變大時 dot products 過大，讓 softmax 太早飽和。

Autoregressive LM 不能在預測位置 `t` 時偷看未來 tokens。Causal mask 在 `j>t` 的 score 填 `-∞`，softmax 後成為零。Multi-head attention 則用多組 `W_Q,W_K,W_V` 平行建立不同加權，再 concatenate。Transformer block 還加入 feed-forward layers、residual connections 與 layer normalization。

## 可重做推導：兩個 token 的 causal attention

設 `d_k=1`，兩個 token 的 scalar queries、keys、values 為：

```text
Q = [1, 2]^T
K = [1, 3]^T
V = [10, 20]^T
```

未遮罩 scores 是：

\[
QK^T=\begin{bmatrix}1&3\\2&6\end{bmatrix}.
\]

加 causal mask 後第一列變 `[1,-∞]`，softmax 是 `[1,0]`，所以第一位置輸出 `10`。第二列可看兩位置，`softmax([2,6])≈[0.018,0.982]`，輸出約：

\[
0.018(10)+0.982(20)=19.82.
\]

這個例子呈現 causal self-attention 的兩個性質：每一列是一個 query 的 probability distribution；可見 context 隨位置增加，未來位置永遠沒有權重。

Dimension 也能直接核對。若 `Q,K∈R^{T×d_k}`，則 `S,A∈R^{T×T}`；`V∈R^{T×d_v}`，所以 `Z=AV∈R^{T×d_v}`。Recitation 11 專門要求學生追這些 shapes，因為實作錯誤最常藏在 transpose 與 softmax axis。

## Recitation／HW 對應

Recitation 11 比較 pico 與 femto minGPT，要求辨認 word embeddings、attention heads、layers 與 embedding size，再追蹤 `QKᵀ`、attention matrix 的 dimensions。官方解答指出 femto 是 1 head／1 layer／embedding 2，pico 是 3 heads／3 layers／embedding 6；這只是教學模型設定，不是 GPT-2 的正式規模。

HW11 的 Building GPT2 要求繪製 training loss、perplexity，並以不同 prompts 與 temperatures 生成。Lecture 20 提供的是 model internals；HW11 把它變成 end-to-end system。公開題目沒有提供完整課堂運算資源與評分回饋。

## 延伸對照：attention 不是解釋本身

Attention weights 告訴我們某一 head 在該 forward pass 如何組合 values，不能自動等同模型的因果解釋。Residual paths、後續 layers 與多 heads 都會再改變表示。把 attention map 當檢查工具可以，把它當完整 reasoning trace 就超出本講材料支持的範圍。

與 N-gram 相比，attention 能依 query 動態選 context，且共享連續向量參數；代價是 `T×T` attention matrix 的計算與記憶體成本，還有較難逐項稽核的 learned representation。

## 今晚可做動作

拿 `T=3,d_k=2` 的小矩陣，手算 `QKᵀ/√2`、causal mask、row-wise softmax 與 `AV`。接著寫十行 NumPy 重算，逐一 assert shapes。最後故意把 softmax 改成 column-wise，看每列是否還加總為一；這能比背公式更快抓到實作錯誤。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 20 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec20_NLP_Attention_Transformers.pdf)
- [CMU 07-280 Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf)
- [CMU 07-280 Recitation 11 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
