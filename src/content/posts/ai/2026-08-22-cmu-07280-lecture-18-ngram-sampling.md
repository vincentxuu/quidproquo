---
title: "CMU 07-280 Lecture 18：N-gram 如何訓練、取樣與失敗"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, natural-language-processing, language-model, n-gram]
lang: zh-TW
tldr: "第 18 講把 chain rule 截成 N-gram Markov assumption，以 corpus counts 做 MLE，再比較 greedy、categorical sampling 與 temperature；真正的瓶頸是未見 context 的零機率與固定視窗。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 18：N-gram factorization、MLE 計數、生成取樣、temperature 與 feature learning 的轉場。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 18
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-18-ngram-sampling-en)

Lecture 17 決定 tokens；**CMU 07-280 Spring 2026 Lecture 18** 才把 token sequence 變成可訓練、可生成的模型。官方 inked slides 題為 *NLP: N-gram LMs*，主線是 joint probability、Markov approximation、corpus counts、sampling 與 temperature，最後把問題交給 feature learning。

## 官方材料與讀取範圍

本文完整讀取 [Lecture 18 inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec18_NLP_N-grams_inked.pdf)。未標註版直鏈在 2026-08-22 回傳 404，但 inked 版可匿名取得且內容完整。官方頁沒有 Spring 2026 逐講公開錄影，因此本文不描述教師當場如何講解 polls 或 worksheet。

投影片把上一講的 tokenization 接到 language model 定義：模型近似某語言 token sequence 的 joint probability。接著用 chain rule 拆解，再以 N-gram Markov assumption 限制 context。

## 承上問題：有 bigram counts，不代表已經有完整模型

只列出一些 unigram、bigram 機率還不夠。模型必須對任意長度 sequence 給出一致的 probability。Chain rule 提供精確分解：

\[
P(w_1,\ldots,w_T)=\prod_{t=1}^{T}P(w_t\mid w_1,\ldots,w_{t-1}).
\]

困難在每個完整 history 幾乎都是獨一無二，無法靠有限 corpus 可靠計數。Bigram model 改成假設下一 token 只依賴前一 token：

\[
P(w_1,\ldots,w_T)\approx P(w_1)\prod_{t=2}^{T}P(w_t\mid w_{t-1}).
\]

Trigram 則保留最近兩個。`n` 越大，context 越細；需要估計的組合也越多，資料稀疏越嚴重。

## 完整概念脈絡：從 MLE 計數到 decoding

條件機率的 maximum likelihood estimate 很直接：

\[
\hat P(w\mid h)=\frac{C(h,w)}{C(h)},
\]

其中 `h` 是長度 `n-1` 的 history。這個公式把訓練壓成 corpus counting。它同時暴露致命限制：只要 `(h,w)` 沒出現，MLE 就給零；若 history `h` 本身沒出現，分母也沒有可用統計量。

生成時，模型每一步輸出 vocabulary 上的 categorical distribution。Greedy decoding 永遠取 `argmax`，重現性高，卻容易掉進重複或單一路徑；sampling 依 probability 抽樣，能保留多樣性，也會選到低機率 token。

Temperature 在 softmax 前縮放 logits。若 logits 是 `z_i`：

\[
p_i(T)=\frac{e^{z_i/T}}{\sum_j e^{z_j/T}}.
\]

`T<1` 會讓分布尖銳，`T>1` 讓分布平坦。Temperature 沒有增加知識，只改變現有機率差異如何影響抽樣。

## 可重做小例子：同一組 logits 的三種生成行為

假設下一 token 的 logits 是 `cat: 2`、`dog: 1`、`moon: 0`。

在 `T=1` 時，先取 exponential：`e²≈7.39`、`e¹≈2.72`、`e⁰=1`，總和約 `11.11`，所以機率約為 `0.665, 0.245, 0.090`。Greedy 永遠選 `cat`；categorical sampling 約四次有一次選到 `dog`。

若 `T=0.5`，等於把 logits 乘二，分布變成約 `0.867, 0.117, 0.016`。若 `T=2`，則先除二，約為 `0.506, 0.307, 0.186`。這是可手算的 temperature 效果：低溫放大排名差距，高溫保留更多尾端選項。

再看 zero-count：若 corpus 從未出現 `purple elephant`，bigram MLE 令 `P(elephant|purple)=0`。不論 temperature 如何調整，原始模型沒有給這個 continuation 正機率時，temperature 不能憑空補回。要處理這件事，需要 smoothing、backoff，或改用能共享統計強度的 learned representations。

## Recitation／HW 對應

[Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf) 直接接手最後一個方向：不再為每個 context 建獨立計數表，而是學兩組低維向量來預測下一 token。它要求學生比較 cosine similarity、softmax 與 greedy／sampling 生成。

[HW11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) 的 Building GPT2 部分則要求貼出 training loss、training perplexity 與不同 temperature 的 generation。這使 Lecture 18 的 decoding 不是旁支；它變成後面評估生成輸出的操作介面。Notebook 與正式 autograder 仍有存取限制，公開 PDF 只能代表題目可見。

## 延伸對照：固定 context 與 learned context

N-gram 把 context 定義成最近 `n-1` 個 token 的精確 identity；embedding model 讓相似 tokens 共用參數；attention 再讓不同位置依目前 query 動態加權。三者不是互斥題庫，而是逐步放寬「哪些 history 能共享證據」。

N-gram 的優點是可檢查：一個機率可以追回某個 count。缺點也同樣透明：參數量隨 vocabulary 與 `n` 快速成長，未見組合沒有自然的泛化機制。

## 今晚可做動作

沿用上一講的小 corpus，建立 unigram、bigram、trigram counts。對同一個開頭各生成三段文字：greedy、`T=0.5` sampling、`T=2` sampling。記錄第一個 zero-count context 在第幾步出現，並寫下你會選 smoothing、backoff 還是縮短 context；不要只評價哪段「比較像人話」。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 18 inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec18_NLP_N-grams_inked.pdf)
- [CMU 07-280 Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf)
- [CMU 07-280 Recitation 10 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
