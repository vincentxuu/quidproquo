---
title: "Stanford CS109 Lecture 22｜Deep Learning：用 chain rule 推出 backpropagation"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, deep-learning]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 23
tldr: "Neural network 是堆疊的 logistic units；forward pass 算機率，backpropagation 重用 output error 來計算所有 gradients。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 22：softmax、forward pass、backpropagation 與 multi-class likelihood。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-22-deep-learning-probability-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)第 23 篇，對應 **Summer 2026 Lecture 22: Deep Learning**（Jul 30），講者為 Chris Gregg。本文依官方 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture22-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture22-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf)整理。

本講維持 **L2**。Worksheet 四頁，正式 P1–P7 加 optional multi-class challenge；五頁 key 的所有題目都有公開解答，沒有 pset omission。Guide 三頁六 concepts。當期投影片不可用、錄影限 Canvas。

## P1：calibration 與 baseline

模型在 60 筆預測約 0.8 的資料中命中 36 筆，observed fraction 是 0.60，因此不 calibrated 且 overconfident。資料整體 70% 為 label 1，always-positive baseline accuracy 是 0.70。Calibration 約束 probability 的語意，不保證 threshold decision 勝過 baseline。

## P2：Softmax

Softmax 定義為 softmax(z)ₖ=e^zₖ/Σⱼe^zⱼ。[7,7,7,7] 產生 [0.25,0.25,0.25,0.25]；[1,3,0] 約為 [0.114,0.844,0.042]。Exponentials 為正，因此 outputs 為正且和為 1，最大 score 得到最大 probability，也不會得到 exact zero。

兩類時，把分子分母同除 e^z₁，可得 e^z₁/(e^z₁+e^z₂)=1/(1+e^{-(z₁-z₂)})=σ(z₁-z₂)。Sigmoid 對 Bernoulli，正如 softmax 對 Categorical。把 sigmoids 再 normalization 雖也得到 probabilities，卻破壞課程需要的 log-likelihood concavity。

## P3：計算 parameters

40 inputs、20 hidden units、1 output，忽略 bias 時，第一層有 40×20=800，第二層有 20，總計 820。再加一層 20 units，總數為 800+400+20=1220。原 network 若替每個 neuron 加 bias，再多 21 個，得到 841；bias 就是 logistic regression 對 constant input 1 的 intercept。

## P4：手算 forward pass

輸入 x=[1,1,0] 已含 bias。第一個 hidden weighted sum 是 2，故 h₁=σ(2)=0.8808；第二個是 0，故 h₂=0.5。Output 以 h=[1,0.8808,0.5] 為 input，得到 z⁽²⁾=1.2616、ŷ=0.7793。真實 y=1，所以 LL=ln(0.7793)≈-0.2494。

這裡執行三個 logistic regressions：兩個以原始 x 為 features 的 hidden neurons，以及一個以 hidden activations 為 features 的 output neuron。「學自己的 features」就是讓前一層 outputs 成為下一層 inputs。

## P5：output-layer backpropagation

Bernoulli likelihood 與 Lecture 20 相同。Chain rule 中的 sigmoid factors 抵消，得到：

    ∂LL/∂θⱼ⁽²⁾ = hⱼ(y-ŷ)

本題 residual 是 0.2207，含 bias 的 gradients 為 [0.2207,0.1944,0.1103]。以 η=1 更新 output weights 後，ŷ 約升至 0.8467，LL 從 -0.2494 升至 -0.1664。Output layer 看見的只是 h，因此這正是把 logistic gradient 的 xⱼ 換成 hⱼ。

## P6：hidden-layer backpropagation

埋在內層的 weight 依序影響 zⱼ⁽¹⁾→hⱼ→z⁽²⁾→ŷ→LL。四段 derivatives 相乘：

    ∂LL/∂θⱼ,ₖ⁽¹⁾ = (y-ŷ)θⱼ⁽²⁾hⱼ(1-hⱼ)xₖ

對 x₁=1，兩個 numeric gradients 約為 0.0463 與 0.0552。h₂=0.5 位在 sigmoid 最敏感的位置，所以 outgoing weight 雖較小，gradient 反而較大；h₁ 已部分 saturated。x₂=0 時對應 gradient 為零，因為這筆資料的 input 沒參與 prediction。

Backpropagation 從 output 計算 error，再向左逐層乘 local derivative。重用同一 error signal，避免為每個 weight 從頭求導；hidden activation 接近 0 或 1 時的微小 derivative 也解釋 vanishing gradient 的起點。

## P7：Deep learning 是 MLE

課堂結論是：**Deep learning is maximum likelihood estimation with neural networks.** 流程仍有三步。先寫 probability assumption，再寫所有 data 的 log-likelihood，最後對每個 parameter 求 partial derivative 並做 gradient ascent。

Binary network 與 logistic regression 都假設 Y|X=x~Bern(ŷ)；差別只在 ŷ 從單層函數變成多層 composition。Network objective 不再 concave，會有 local optima 與 saddle points，結果受 initialization 影響。若移除 hidden nonlinearities，linear maps 的 composition 仍是 linear，network 便退化成較迂迴的 logistic regression。

## Optional challenge：multi-class log-likelihood

Softmax outputs 搭配 one-hot label 時：

    LL = Σₖyₖlog ŷₖ = log ŷ_c

只有正確 class c 留下。K=2 時就是 Bernoulli log-likelihood。對 correct score，∂LL/∂z_c=(1/ŷ_c)ŷ_c(1-ŷ_c)=y_c-ŷ_c；其他 classes 也得到 yₖ-ŷₖ。因此 Bernoulli、Categorical 與多層 networks 反覆出現 error × input，這是模型結構而非巧合。

## Guide unit：六個 concepts

Guide 依序涵蓋 softmax、stacked logistic units、deep-learning likelihood、output backprop、hidden backprop、non-concave optimization。先手算 forward pass，再沿 dependency chain 寫每段 partial derivative；維持 CS109 的 MLE／chain-rule 層次，不需跳到 framework 或 transformer。

最後比較 logistic regression 與 network 的 expressive power、parameter count、concavity、interpretability 與 data demand。更多 parameters 不自動代表更適合部署，仍需 Lecture 21 的 held-out evaluation、calibration 與 fairness audit。

## 材料邊界

- Worksheet 四頁 P1–P7 加 challenge；五頁 key 全部公開。
- Guide 三頁六 concepts，無額外題號。
- 當期投影片不可用、錄影限 Canvas；本文只使用公開 artifacts。

## 參考資料

- [Schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 22 page](https://web.stanford.edu/class/cs109/lectures/22-DeepLearning)
- [Worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture22-Worksheet.pdf)
- [Answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture22-AnswerKey.pdf)
- [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf)
- [Course reader](https://probabilitycoders.stanford.edu/spr26)
