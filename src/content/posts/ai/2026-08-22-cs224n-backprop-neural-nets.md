---
title: "CS224N 第 3 講：矩陣微積分與反向傳播"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, neural-network, backpropagation, nlp, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 4
tldr: "第 3 講把神經網路訓練拆成計算圖、局部導數與鏈鎖律：forward pass 算結果，backprop 由輸出往回累積梯度，讓每個參數知道自己該往哪裡移。"
description: "逐段讀 CS224N Winter 2026 Lecture 3：神經元、矩陣微積分、計算圖與反向傳播。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-backprop-neural-nets-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 3 講排在 2026 年 1 月 13 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture03-neuralnets.pdf)標題是 Neural Network Foundations，agenda 則列出詞向量評估回顧、神經網路介紹、矩陣微積分與反向傳播。這堂不是泛泛介紹深度學習；它要建立後面所有模型共用的訓練語言。

## 從線性分類器到神經網路

線性模型把輸入乘上一組權重再加偏差。它能學一個決策平面，卻無法單靠一層表示複雜的彎曲邊界。神經網路把多個仿射轉換與非線性函數串起來，使中間層能學到對任務有用的特徵。

在 NLP 裡，輸入常先是詞向量。模型把多個向量組合成 hidden representation，再產生分類分數。關鍵並不是「神經元像大腦」，而是整個函數可以微分；只要損失函數告訴我們輸出錯多少，就能計算每個參數對錯誤的影響。

## 矩陣微積分先管形狀

投影片花相當篇幅處理向量與矩陣導數。實作時最可靠的習慣不是背下所有公式，而是先標每個量的 shape：輸入、權重、hidden state、輸出各有幾維，梯度必須與被微分的參數同形。

softmax 把分數正規化成機率，cross-entropy 取出正確類別的負對數機率。兩者合併後，對 logits 的梯度形成「預測機率減 one-hot 標籤」的簡潔結果。這也是上一講 word2vec 梯度背後的共同結構。

## Backprop 是計算圖上的動態規劃

[經典 backprop 論文](https://www.nature.com/articles/323533a0)所描述的核心是：forward pass 依計算圖順序算出中間值與損失；backward pass 從損失開始，沿圖反向套用鏈鎖律。若一個節點流向多條路徑，梯度要把各路徑的貢獻相加。實作細節可對照 [CS231n backprop notes](https://cs231n.github.io/optimization-2/)。

把它看成動態規劃很有用：共同的中間導數只算一次並重用，而不是為每個參數重新展開整條符號公式。現代 autodiff 框架自動完成這件事，但框架不會替你判斷 loss 寫錯、張量被錯誤 broadcast，或不小心切斷計算圖。

## 怎麼檢查自己真的懂了

先用一個極小網路手算 forward 與一個參數的梯度，再用 finite differences 比較：把參數加減一個很小的值，觀察 loss 的差。數值梯度慢，適合檢查，不適合訓練。若兩者差很多，先查 shape、符號、平均與加總方式，再怪框架。

## 一個兩層網路的完整 forward path

令輸入詞向量 (x\in R^d)，第一層權重 (W\in R^{h\times d})、偏差 (b\in R^h)。先算 (z=Wx+b)，再經 ReLU 得到 (a=\max(0,z))。第二層把 (a) 投影成類別 logits (s=Ua+c)，softmax 產生機率，cross-entropy 取正確類別的負 log probability。

Forward pass 必須保存 backward 需要的中間值：ReLU 要知道哪些 (z) 大於零；matrix multiply 要知道原始 input；softmax-cross-entropy 要保留 prediction 與 target。Autodiff framework 建立的 graph，本質上就是保存這些 dependency。

Batch 加進來後，(x) 前面多一個 batch dimension。很多 bug 來自程式能 broadcast、數值也跑得動，卻把本應逐樣本的 bias、mask 或 loss 沿錯維度套用。每一步把 shape 寫在註解裡，比等到 loss 不降再追快得多。

## Matrix calculus：先決定 numerator layout

Scalar 對 vector 的 gradient 與 vector 同形；scalar 對 matrix 的 gradient 與 matrix 同形。這條 shape rule 能抓掉大量轉置錯誤。若 (z=Wx) 且 loss 為 scalar，已知上游梯度 (g_z=\partial L/\partial z)，則：

\[
\frac{\partial L}{\partial W}=g_zx^T,\qquad
\frac{\partial L}{\partial x}=W^Tg_z.
\]

第一個是 outer product，shape 為 (h\times d)；第二個把 gradient 傳回輸入空間。Bias gradient 對 batch 維度加總。這幾個 local rule 足以組出大部分 feed-forward network。

元素級 nonlinear function 的 Jacobian 通常是 diagonal；實作不會真的建立巨大 diagonal matrix，而是把上游 gradient 與局部 derivative element-wise 相乘。理解這個化簡，能解釋為什麼 framework 的 backward 比手寫完整 Jacobian 省很多記憶體。

## Chain rule 在分支與重用時如何累加

如果變數 (x) 同時走進兩個 branch，(L=f(x)+g(x))，那麼 gradient 是兩條路徑貢獻相加。Residual connection 正是這種結構：一條經 transformation，一條 identity。Backward 時 identity path 直接把上游 gradient 傳回，這是 residual network 較容易最佳化的一個直覺。

參數共享也要累加。RNN 在不同時間步使用同一個 (W)，每個時間步都產生一份對 (W) 的梯度，最後加總。Embedding table 也是如此：同一 token 在 batch 出現多次，對相同 row 的更新必須累積。

In-place operation 是常見地雷。若 forward 後覆寫中間值，backward 可能失去計算 local derivative 所需資料。Framework 有時會報 version error，有時操作在數學上合法卻讓 debugging 困難。學習階段優先用清楚的非 in-place 寫法。

## Softmax 加 cross-entropy 為什麼要合併

直接先算 softmax 再取 log，極小機率可能 underflow 成零，(log 0) 變成無限。穩定實作用 log-sum-exp：先從 logits 減去最大值，再算 exponential；這不改 softmax，卻避免溢位。

Softmax Jacobian 有 diagonal 與 cross-class 項，但與 one-hot cross-entropy 合併後，對 logits 的 gradient 簡化成 (p-y)。正確類別得到負更新，其餘類別依模型目前機率得到正更新。這個簡化同時更快、更穩定。

Loss reduction 也會改 gradient scale。對 batch sum，batch 變大 gradient 也變大；對 mean，尺度較穩定。比較不同 batch size 的 learning rate 時，必須知道 library 預設 reduction。

## Backprop 的成本與記憶體

Reverse-mode autodiff 適合「很多參數、一個 scalar loss」：一次 backward 能得到所有參數 gradient，時間通常與 forward 同一數量級。代價是要保存 activations。模型越深、sequence 越長、batch 越大，activation memory 越可觀。

Gradient checkpointing 選擇不保存部分 activation，backward 時重新 forward，以運算換記憶體。Mixed precision 降低記憶體與提高吞吐，但小 gradient 可能 underflow，因此常搭配 loss scaling。這些技巧沒有改 chain rule，只改何時保存或用什麼數值格式計算。

`zero_grad` 也不是儀式。多數 framework 預設把新 gradient 累加到 `.grad`，方便 gradient accumulation；若每個 batch 忘記清除，就會無意中把多批訊號疊在一起。反過來，想模擬大 batch 時可刻意累加幾步，再更新一次。

## Gradient checking 的正確用法

Centered finite difference 用

\[
\frac{L(\theta+\epsilon)-L(\theta-\epsilon)}{2\epsilon}
\]

近似一個參數導數。使用 double precision、關閉 dropout 等隨機性，並挑少量元素檢查。Epsilon 太大有 truncation error，太小受 floating-point cancellation 影響；可以試幾個尺度看 relative error 是否穩定。

不要在 ReLU 正好位於零的不可微點做結論；左右導數不同時，數值結果會依 perturbation 改變。也不要對整個大型模型逐參數跑，成本太高。最佳用途是驗證自己新寫的 local operation 或 loss。

除了數值 gradient，還要做 sanity checks：隨機 label 時模型不應有異常高準確率；只用十筆資料應能 overfit；初始 softmax loss 應接近 (log C)；把 learning rate 設零時參數不應改變。這些檢查能抓到數學正確但資料 pipeline 錯誤的問題。

## 從 Lecture 3 接到官方 Assignment 2

Assignment 2 前半要求推導 word2vec loss，正好重用 softmax、negative sampling 與 matrix derivative；後半再實作 neural dependency parser。這不是兩個無關題目：parser 把 word representation 組成 hidden state，以 cross-entropy 學 transition action，完整走過 forward、loss、backward 與 optimizer。

實作順序應從 shape test 開始。先用極小 batch 確認 embedding lookup、concatenation、hidden layer 與 logits 維度，再跑 loss。接著固定 random seed，在一小批資料上確認 loss 能下降。最後才跑完整訓練與 error analysis。

錯誤分析也屬於 backprop 課的範圍：gradient 只會最佳化你寫下的 loss 與資料。如果 parser 在某類 attachment 一直失敗，原因可能是 representation 沒有訊號、training examples 稀少，或 action space 限制，而不只是 optimizer 沒調好。

## Optimizer 不會修正錯的計算圖

SGD、Adam 與 learning-rate schedule 只決定如何使用 gradient。若 target shift 一格、padding 沒 mask、loss sign 寫反，optimizer 仍會忠實降低錯誤目標。先證明 forward 與 gradient 對，再調最佳化。把每次實驗保存 seed、data batch、初始 loss 與 gradient norm，才能區分數學 bug 和 tuning 問題。

最小交付不是「程式能跑」，而是三份證據：shape assertion 通過、數值 gradient 與 analytic gradient 接近、十筆資料可以 overfit。三者分別檢查 tensor 介面、微分規則與整條 training loop。

## 材料缺口

Winter 2026 錄影不公開。本文涵蓋投影片 agenda 的四個主體，但不聲稱還原課堂上的完整板書推導或問答。官方投影片本身把 Lecture Plan 誤寫成「Lecture 2」；檔名、首頁課表與封面都把它識別為 Lecture 3。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 3：Neural Network Foundations 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture03-neuralnets.pdf)
- [CS231n：Backpropagation notes](https://cs231n.github.io/optimization-2/)
- [Learning Representations by Back-propagating Errors](https://www.nature.com/articles/323533a0)
