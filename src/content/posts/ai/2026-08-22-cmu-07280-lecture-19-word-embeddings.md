---
title: "CMU 07-280 Lecture 19：Word Embedding 如何把下一詞預測變成幾何"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, natural-language-processing, word-embedding, language-model]
lang: zh-TW
tldr: "第 19 講以兩個 embedding matrices、dot-product similarity、softmax 與 cross-entropy 建立最小 next-token model，讓相似 context 透過共享向量參數取代 N-gram 的獨立計數格。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 19：one-hot、bag of words、input/output embeddings、softmax、cross-entropy 與 feature learning。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 19
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-19-word-embeddings-en)

**CMU 07-280 Spring 2026 Lecture 19** 把 language model 從 count table 改成可學習的向量幾何。官方投影片封面題為 *NLP: Word Embeddings / Attention*；實際主體是文字 features、兩組 token vectors、similarity、softmax 與訓練，attention 只作為下一講入口。

## 官方材料與讀取範圍

本文完整讀取 [Lecture 19 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec19_NLP_Word_Embeddings.pdf)、[Word Embeddings pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Word_Embeddings.pdf)，以及 [Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10_sol.pdf)。官方頁沒有 Spring 2026 逐講公開錄影；本文不把投影片動畫或 recitation notebook 猜成課堂口述。

Recitation 提到 Google Drive notebook，但本文只採用公開 PDF 明確寫出的模型、任務與結果，不宣稱重跑了受外部權限影響的正式 notebook。

## 承上問題：N-gram 的每個 context 都是孤島

Bigram model 對 `the cat` 與 `a cat` 分別計數。即使 `the` 和 `a` 在許多 context 中功能相似，表格也不會自動共享證據。One-hot encoding 同樣把每個 token 放在互相正交的軸上；它能辨識 identity，卻沒有相似性。

投影片先比較 one-hot 與 bag of words。Bag of words 可記錄 token 是否出現或出現次數，適合分類，卻丟失順序。Embedding 的目標不同：學一個低維 dense vector，使 token 在預測任務中能透過參數共享形成幾何關係。

## 完整概念脈絡：encode、compare、softmax、learn

課程的最小 word-embedding LM 使用兩個矩陣。`V` 將「前一 token」index 映成 context vector；`U` 為每個候選「下一 token」保存 output vector。給定 token `i`：

1. 查表取得 `v_i`；
2. 計算所有候選分數 `s = Uv_i`；
3. 用 softmax 得到 `ŷ = softmax(s)`；
4. 從 categorical distribution 取下一 token；
5. 用真實下一 token 的 cross-entropy loss 更新 `U` 與 `V`。

投影片把內積稱為未正規化 cosine similarity。嚴格說，cosine 還要除以兩個向量 norm；這裡使用 `uᵀv` 當 logit，方向與 magnitude 都會影響分數。這個區別值得保留，因為模型可以藉由增大 norm 拉開 softmax。

若 vocabulary 有 `|Vocab|` 個 tokens、embedding dimension 是 `d`，兩個矩陣共有約 `2|Vocab|d` 個參數。它不再為每個 bigram 放獨立 probability，而是讓所有 transitions 經過同一個低維空間。

## 可重做推導：一筆 next-token 資料如何更新向量

假設 vocabulary 是 `cat, sat, ran`，context `cat` 的向量為 `v=[1,0]`，三個 output vectors 是：

```text
u_cat = [0, 0]
u_sat = [2, 0]
u_ran = [1, 1]
```

Logits `Uv` 是 `[0,2,1]`。Softmax 分母約為 `1+7.39+2.72=11.11`，所以預測分布約 `[0.09,0.665,0.245]`。若真實下一 token 是 `ran`，cross-entropy loss 為：

\[
L=-\log 0.245\approx 1.41.
\]

對 logits 的 gradient 是 `ŷ-y`，約 `[0.09,0.665,-0.755]`。因此 gradient descent 會降低 `cat`、`sat` 的相對分數，提高 `ran` 的分數；更新同時作用在 output vector `u_ran` 與 context vector `v_cat`。重複許多 token pairs 後，向量位置反映的是「對下一詞預測有用的相似性」，不是字典先驗給的語意座標。

## Recitation／HW 對應

Recitation 10 用 *Green Eggs and Ham* corpus 建一個二維模型，要求觀察訓練前後向量、用 `argmax` 生成，再改用機率抽樣。官方解答記錄示範 loss 從 `4.6891` 降到 `2.9759`（100 epochs），並比較更長訓練後的空間；這些數字屬於該 notebook 設定，不能外推成一般 embedding 收斂保證。

[HW11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) 的 GPT-2 任務保留相同外框：token embedding 進模型，輸出 logits 經 softmax／sampling 變成下一 token。中間的 context model 從「只看一個向量」換成 transformer blocks。

## 延伸對照：embedding 學到的是任務結構，不是天然語意

把 words 畫在二維平面很直觀，也容易過度解讀。向量只被 loss 約束；若訓練目標是 next-token prediction，它會保留有助於該目標的統計關係。換 corpus、tokenizer 或 objective，幾何就可能改變。

這也說明 feature engineering 與 feature learning 的差異。Bag of words 由人決定座標；embedding 由 optimization 決定座標，但人仍然決定資料、context、維度與 loss。Feature learning 不是取消設計，而是把部分表示選擇交給訓練。

## 今晚可做動作

用十個 token、二維 embedding 建一個 one-step next-token model。手算一筆 `Uv`、softmax、cross-entropy 與 `ŷ-y`，再用程式訓練同一模型。最後比較兩件事：相似 context tokens 是否靠近，以及它們接近是否真的改善 held-out next-token loss。不要只看散點圖「像不像語意」。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 19 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec19_NLP_Word_Embeddings.pdf)
- [CMU 07-280 Word Embeddings pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Word_Embeddings.pdf)
- [CMU 07-280 Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf)
- [CMU 07-280 Recitation 10 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
