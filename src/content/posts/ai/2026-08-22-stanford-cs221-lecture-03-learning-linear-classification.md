---
title: "CS221 Lecture 3：Learning II：線性分類、特徵與交叉熵"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: zh-TW
series:
  name: "Stanford CS221 導讀"
  order: 4
tldr: "Stanford CS221 Autumn 2025 第 3 講，從 Learning II：線性分類、特徵與交叉熵 建立可操作的 AI 問題表示與演算法直覺。"
description: "逐講讀 Stanford CS221 Autumn 2025 Lecture 3，依官方可執行講義整理核心 agenda、例子與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs221-lecture-03-learning-linear-classification-en)

本篇只沿著官方可執行 artifact 的程式流程讀 Learning II：linear classification。source 的 main() 先回顧線性迴歸，再依序進入 prediction task、machine-learning problem、hypothesis class、zero-one loss、zero-one loss optimization、logistic loss、logistic-loss optimization、multiclass classification，以及 representing text。這個順序不是名詞清單：每一次改變表示法或 loss，都是在回應前一步暴露出的問題。

> 公開材料缺口：source 明確連到 Autumn 2023 的線性分類模組；課程入口、artifact、repository 與 playlist 列在文末。source 只呈現 sentiment classification 的任務例子，沒有提供 sentiment 作業的隱藏測資或解答，因此本文不補寫那些內容。

## 從線性迴歸換成線性分類

上一個單元的 prediction task 是 regression：輸入經過模型後輸出一個 real number，hypothesis class 是 linear functions。本講把輸出換成離散選擇：輸入對應一個 class 或 label，答案是 K 個選項中的一個；hypothesis class 則是 thresholded linear functions。接下來沿用線性迴歸的三個問題：哪些 predictor 可以選、如何判斷 predictor 好不好，以及怎樣算出最好的參數。

## Prediction task：輸入、輸出與 argmax

source 先用 image classification 當例子：input 是一張影像，output 是物件種類，例如 cat。影像可以表示成 width × height × 3 的 RGB tensor。另一個例子是 sentiment classification：input 是一份 document，output 是它的 sentiment，例如 positive。這裡的文字仍是 string，不是 tensor；如何轉換要到後面處理。

binary classification 有兩個選擇，通常寫成 {−1, 1}；multiclass classification 有 K 個選擇，通常寫成 {0, 1, ..., K−1}。predictor 是吃進 input、產生 predicted output 的函式；多類別時先得到各 class 的 score，再用 argmax 選最高分的 class。二元例子先算 logit = x[0] − x[1] − 1，再在 logit > 0 時輸出 1，否則輸出 −1。x_a = [1, 2] 得到 logit −2，預測 −1；x_b = [2, 0] 得到 logit 1，預測 1。logit = 0 的點是 decision boundary：x[0] − x[1] − 1 = 0，也就是 x[1] = x[0] − 1。給定 predictor 的預測完成後，問題變成 predictor 從哪裡來。

## Machine-learning problem：資料、假設類別、loss、optimization

training data 是展示任務的 examples；每個 example 是 (input x, target output y)。source 的小資料集是 ([1, 2], −1)、([2, 0], 1)、([0, 0], −1)。learning algorithm 讀入資料並產生 predictor。於是學習問題拆成三問：

1. 哪些 predictor 是可能的？hypothesis class。
2. 一個 predictor 有多好？loss function。
3. 如何計算最好的 predictor？optimization algorithm。

沒有 hypothesis class，就不知道參數搜尋範圍；沒有 loss，就不能把「好」變成可計算的量；沒有 optimization，就只有目標而沒有取得參數的程序。

## Hypothesis class：權重、bias 與直線切口

線性分類器的參數是一個 weight vector 與一個 bias。給定 params = (weight, bias) 和 x，先算 weight @ x + bias，這個 raw score 是 logit，再用 threshold 變成 1 或 −1。source 用 weight = [1, −1]、x = [1, 1] 展示兩個 predictor：bias = −1 時 boundary 是 x[1] = x[0] − 1；bias = 1 時 boundary 是 x[1] = x[0] + 1。hypothesis class 就是所有可由選擇 (weight, bias) 得到的 predictor；decision boundaries 是輸入空間的直線切口。

## Zero-one loss：先定義錯誤

regression 使用 squared loss，直覺是 prediction 距離 target 多遠，而且相等時為零；分類輸出是類別，不是精確數值，因此 source 改用 zero-one loss。對二元分類，它只問 prediction 和 target 的 sign 是否相同：答對為 0，答錯為 1。

也可以用 margin 表示：先算 logit，再令 margin = logit × target。margin 為正代表 sign 正確，為負代表錯誤，零在邊界上；單筆 loss 是 1 當 margin ≤ 0，否則是 0。source 在 ([2, 0], 1) 與 ([0, −2], −1) 上展示這個計算。training loss 是所有 per-example losses 的平均，也就是 error rate。要分清楚：logit 是 raw score，sign 是 prediction、magnitude 是 confidence；margin 的 sign 表示對錯；zero-one loss 是 0 或 1；train loss 是資料平均。

## 為什麼 zero-one loss 不能直接 gradient descent

每組 params 都能算 train loss，看似可以像線性迴歸一樣找最低點。但 zero-one loss 對 margin 是在零處有 sharp cliff 的階梯，幾乎處處 gradient 都是零，margin = 0 又沒有平滑梯度。因此 gradient descent 不會更新參數。若 example 現在答錯，參數只移動一小步通常仍然答錯，loss 沒有局部變化可提供方向。問題不是 error rate 不重要，而是它沒有這種 optimization 所需的非零訊號，於是要重新設計 loss，也重新考慮 classifier 的輸出。

## Logistic function：連續機率

logit 可從 −∞ 到 +∞，probability 卻必須在 0 和 1 之間。source 使用 logistic function：σ(z) = 1 / (1 + exp(−z))。z 趨近 −∞ 時 probability 趨近 0，z 趨近 +∞ 時趨近 1，z = 0 時是 0.5；程式實際檢查 z = 0、1、8、−1、−8。

它也可解讀為 log odds。prob = 0.2 時，先算 odds = prob / (1−prob)，再取 log(odds) 得到 logit；把 logit 放回 logistic function 會回到 0.2。z = 3 和 z = −3 的 probabilities 和為 1。其 derivative 是 prob × (1−prob)；當 logit 絕對值很大，gradient 趨近 0。這些是 source 後續 gradient 計算使用的性質。

## Logistic loss：maximum likelihood

為了解決 zero-gradient，classifier 不再只輸出 threshold 後的單一 prediction，而是對 labels 輸出連續 probability distribution。對 example，logit = x @ weight + bias；正類機率是 σ(logit)，負類機率是 σ(−logit)。若 target y ∈ {−1, 1}，target class 機率統一為 σ(logit × y) = σ(margin)。

source 的 maximum likelihood principle 是最大化 training targets 的 log probability。多筆資料的 probability 先相乘，例如 p(y1|x1) × p(y2|x2)，取 log 後變成各筆 log probabilities 的和。要轉成 loss，只要取負號：maximize likelihood 等價於 minimize negative log likelihood。因此單筆 logistic loss 是 −log(σ(margin)。它比 zero-one loss smooth，margin 增大時 loss 趨近 0；training logistic loss 仍是 per-example losses 的平均。

## Gradients、update 與 gradient descent

source 對單一 example 先算 margin = logit × target、loss = −log(σ(margin))，再得到：

    grad_logit = −σ(−margin)
    grad_weight = target × x × grad_logit
    grad_bias = target × grad_logit

整個 training loss 的 gradient 是各 example gradients 的平均。gradient descent 從 weight = [0, 0]、bias = 0 開始，learning rate = 1，在三筆 training data 上重複 20 steps：算 train loss、算平均 gradient、再更新 weight ← weight − learning_rate × grad_weight，以及 bias ← bias − learning_rate × grad_bias。每一步的 loss 存進 learning curve，最後用 params 畫 decision boundary 並放回 training points。source 展示的是可重複的 update operation，不提供未展示的數值結論。

## Binary 與 multiclass

binary classification 的 y ∈ {−1, 1} 使用一個 logit；sign 是 predicted class，logistic 給 prob_pos，prob_neg = 1 − prob_pos。multiclass 的 y ∈ {0, 1, ..., K−1} 則為每個 class 定義一個 weight vector、算一個 logit，再預測 class distribution。

source 的具體例子是 x = [2, 0]、weight matrix [[1, −1], [1, −1], [0, 2]]、bias [1, 1, 0]。先算 logits = weight @ x + bias，得到各 class raw scores；下一步不是各自套 binary logistic，而是用 softmax 讓 classes 共享一個 distribution。

## Softmax 與 cross-entropy

softmax 把多個 logits 轉成 probabilities：exp_logits = exp(logits)，probs = exp_logits / sum(exp_logits)。source 對 [1, −1, 0] 計算，接著把全部 logits 加 2 再算；relative probabilities 不變，因為每個 exp(logit) 都乘上同一因子，分子分母比例相同。

cross-entropy 衡量 target distribution 與 predicted distribution 的差異。對 target = [0.5, 0.2, 0.3]、predicted = [0.1, 0.5, 0.4]，逐項算 target × −log(predicted) 後加總。target 對某結果的 probability 高、predicted 對它的 probability 低時，懲罰會大；source 說明 cross-entropy 在 target = predicted 時最小，此時是 target（或 predicted）的 entropy。

單一 label 可用 one-hot target，例如 [0, 1, 0]。只有 target class 的 term 不為零，所以 cross-entropy 等於 target class probability 的 negative log。對前述三類 classifier 取 target 0，先算 logits、softmax probabilities，再取 −log(probs[0])，就是該 example 的 cross-entropy loss；source 也指出它可用 gradient descent，且是 logistic loss 的 generalization。

## 把文字變成 tensor

sentiment 的 input 是 string，但 machine learning 操作 tensors。source 用 "the cat in the hat" 展示兩步：tokenization 把 string 轉成 integers sequence；再把每個 integer 表示成 one-hot vector。簡單做法是按空格切 words，建立 vocabulary，讓 string 與 index 互相對應。indices 可索引 identity matrix 的 row，成為 one-hot；整串 indices 形成每列代表一個 token 的 matrix。

實作時不必儲存大而稀疏的 one-hot vectors，可以只存 indices。若每個位置與 w 做 dot product，matrix @ w 等價於 w[indices]。這表示數學上的 one-hot 與程式中的 index 可以產生相同的每位置結果。

bag-of-words 把每個 token 看成 one-hot，再取所有 token vectors 的平均，得到 fixed-dimensional vector；bow @ w 等價於對 w[indices] 取平均。優點是不依賴文字長度；限制是不看 word order，所以 source 用 dog bites man = man bites dog 說明兩個順序相同。這是 representation 的取捨。source 最後補充，language models 會使用更 sophisticated 的 tokenizer，例如 Byte-Pair Encoding，並連到論文與互動 tokenizer；本文不把 source 沒展示的 sentiment feature engineering 或 hidden assignment 行為補成結論。

## Summary

- linear functions 加上 threshold，形成輸出 K 個選擇的 linear classification。
- zero-one loss 是錯誤率，但幾乎處處 zero gradient。
- logistic loss 輸出 probabilities，帶來非零 gradients。
- maximum likelihood 的 probability product 經過 log、取負號，成為可最小化 loss。
- multiclass 為每類算 logit，以 softmax 轉 probabilities；cross-entropy 對 one-hot label 是 target class probability 的 negative log。
- 文字經 tokenization 與 one-hot 的數學表示成 tensor；實作可直接使用 indices。bag of words 固定維度但捨棄 word order。

## 參考資料

- [CS221 Autumn 2025 課程網站](https://stanford-cs221.github.io/autumn2025/)
- [本講官方材料：linear_classification](https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_classification)
- [CS221 Autumn 2025 可執行講義 repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Stanford Online 官方 CS221 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [source 連結的 Autumn 2023 linear classification module](https://stanford-cs221.github.io/autumn2023/modules/module.html#include=machine-learning%2Flinear-classification.js&mode=print6pp)
- [Byte-Pair Encoding 論文](https://arxiv.org/pdf/1508.07909)
- [互動式 tokenizer](https://tiktokenizer.vercel.app/?encoder=gpt2)
