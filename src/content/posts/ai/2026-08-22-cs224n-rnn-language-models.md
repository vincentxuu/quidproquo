---
title: "CS224N 第 4 講：語言模型、RNN 與消失梯度"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, language-model, rnn, nlp, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 5
tldr: "第 4 講把語言模型定義成下一詞機率分布，再用 RNN 壓縮任意長前文；它同時揭露 recurrence 的核心代價：資訊與梯度都必須沿時間步逐步傳遞。"
description: "逐段讀 CS224N Winter 2026 Lecture 4：語言模型、RNN、梯度爆炸與消失，以及機器翻譯。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-rnn-language-models-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 4 講排在 2026 年 1 月 15 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf)的 agenda 有四段：語言模型、RNN、梯度爆炸與消失、機器翻譯。投影片直接把 language modeling 稱為整門課最重要的概念，因為現代生成式 NLP 大多仍建立在預測下一個 token 上。

## 語言模型到底輸出什麼

給定一段前文，語言模型輸出下一個詞的機率分布。用機率鏈鎖律，把每一步的條件機率相乘，就能為整段文字指定機率。訓練時以真實下一詞的負對數機率作為 loss；生成時則從模型分布選出下一個 token，再把它接回輸入。

n-gram 模型只看固定長度的歷史，計數直觀卻遇到稀疏問題。上下文稍長或出現沒看過的組合，可靠估計就快速消失。神經語言模型用共享參數與連續向量，讓相似上下文能共享統計強度。

## RNN 如何壓縮前文

RNN 在每個時間步讀入目前 token 的向量，將它與前一個 hidden state 組合，產生新的 hidden state。相同參數跨時間重用，因此理論上可以處理不同長度的序列。每一步的輸出分布由 hidden state 投影到詞彙表。

這個設計的直覺很漂亮：hidden state 是目前為止的摘要。但它也是瓶頸。所有過去資訊都要擠進固定大小的向量，而且第 1 個 token 對第 100 個 token 的影響必須穿過 99 次狀態更新。

## 梯度為什麼消失或爆炸

[長期依賴困難的早期分析](https://ieeexplore.ieee.org/document/279181)與[後續 RNN 訓練分析](https://proceedings.mlr.press/v28/pascanu13.html)共同說明：Backpropagation through time 把展開後的 RNN 當成很深、共享權重的網路，梯度沿時間反覆乘上 Jacobian。若有效尺度長期小於一，遠處訊號指數衰減；大於一則可能爆炸。

Gradient clipping 可以限制爆炸梯度的大小，卻不能恢復已消失的訊號。LSTM 與 GRU 透過 gated state 建立較直接的資訊路徑，但仍保留逐步計算，難以像後來的 Transformer 那樣把序列位置平行處理。

## 機器翻譯把問題放大

序列到序列翻譯用 encoder 讀來源句、decoder 逐詞產生目標句。若只把整個來源壓成最後一個 hidden state，長句尤其吃虧。這讓「每個輸出步驟能否直接查看來源不同位置」成為下一講 attention 的起點。

因此這堂不是一段該跳過的舊技術史。它建立了下一詞預測、共享序列參數與長距離依賴三個問題；Transformer 改寫的是運算路徑，沒有改掉語言模型的核心訓練介面。

## 從 chain rule 得到整句機率

對 token sequence (x_1,\ldots,x_T)，機率鏈鎖律寫成：

\[
P(x_1,\ldots,x_T)=\prod_{t=1}^{T}P(x_t\mid x_{<t}).
\]

這不是模型假設，而是機率恆等式；模型假設出現在如何近似每個 conditional。N-gram 只保留最近 (n-1) 個 token，RNN 用 hidden state 摘要所有前文，Transformer 讓每個位置直接 attention 到完整 prefix。

實務不直接乘很多小機率，因為會 underflow，而是加總 log probability。Negative log-likelihood 對 token 加總，再除以 token 數得到平均 cross-entropy。Perplexity 是平均 cross-entropy 的 exponential，可直覺讀成模型每步面對的有效候選數，但不同 tokenizer 的 token 單位不同，perplexity 不能不加條件跨 tokenizer 比較。

Teacher forcing 在訓練時把真實前一 token 餵給模型；生成時模型只能看到自己先前輸出。這產生 exposure bias：一個早期錯誤會把模型帶到訓練少見的 prefix，後續錯誤累積。它不是 RNN 專屬問題，decoder-only Transformer 同樣存在。

## N-gram 為什麼是重要 baseline

Unigram 忽略上下文，bigram 看一個前詞，trigram 看兩個。Maximum likelihood estimate 只是 count ratio，但未見 n-gram 會得到零機率，使整句機率歸零。Smoothing 把部分質量分給未見事件；backoff 在高階統計不足時退到短 context。

N-gram 優點是速度快、可檢查、資料需求與錯誤來源清楚。在 domain-specific 小資料或固定 phrase task，它可能仍是有用 baseline。若神經模型連簡單 n-gram 都贏不了，先查 pipeline，而不是立刻加層。

它的根本限制是 context identity：兩個幾乎相同但 token 不同的 prefix 不能共享統計。Word vector 與 neural state 讓相似輸入共享參數，代價則是中間表示不再直接可數。

## Vanilla RNN 的方程與參數共享

最基本 RNN 可寫成：

\[
h_t=\tanh(W_hh_{t-1}+W_xx_t+b),\qquad
\hat y_t=\mathrm{softmax}(Uh_t+c).
\]

(W_h,W_x,U) 在每個時間步共享。共享讓模型能處理任意長度，也假定相同 transition rule 適用整段序列。Hidden state 的 dimension 固定，因此它既是壓縮，也是資訊瓶頸。

初始 state 可以是零或 learned parameter。Batch 中句長不同時使用 padding 與 mask，確保 padding token 不計入 loss，也不污染最後 state。若只 mask loss 卻仍讓 padding 更新 state，某些 sequence classification 實作仍會出錯。

生成時從 (h_t) 得到下一 token distribution，再把選出的 token embedding 餵回。Greedy、sampling 與 beam search 會讓同一 RNN 產生不同輸出；Lecture 12 才會完整討論 decoding，但這裡先要知道模型機率與選 token 演算法是兩層。

## Backpropagation through time 展開了什麼

把 RNN 沿時間展開，會得到共享權重的深網路。某個早期 state 對晚期 loss 的影響包含連續 Jacobian 乘積。若 recurrent matrix 與 activation derivative 的有效 spectral scale 小於一，訊號衰減；大於一，則可能快速增長。

Gradient clipping 通常計算所有 gradient 的 global norm，超過 threshold 就按比例縮小。它保留方向並限制單步更新，處理 explosion；不能讓已趨近零的 long-range gradient 回來。

Truncated BPTT 只反傳固定步數，降低記憶體與成本，但也明確切斷更長 credit assignment。這是一個訓練近似：模型 forward state 可以跨 chunk 傳遞，gradient 卻不跨越 detach boundary。

## LSTM 與 GRU 怎麼建立較直的路

LSTM 除 hidden state 外維持 cell state。Forget gate 決定舊資訊保留多少，input gate 決定寫入多少，output gate 決定暴露多少。Cell update 有 additive path，gradient 不必每步都穿過完整 nonlinear transform，因此較能保留長期訊號。

GRU 合併部分 gate，參數較少。兩者都不是讓 long dependency 無限可靠；gate 也可能飽和，sequence 仍要循序計算。但在 Transformer 前，它們大幅改善 translation、speech 與 sequence labeling。

讀架構圖時不要只背 gate 名稱。拿一個需求問：要忘掉 topic 時哪個 gate 改變？要保存 subject number 到動詞時，哪條 state path 承載？把 gate 當 data-dependent routing，比把公式當四個 sigmoid 容易理解。

## Seq2seq 的固定向量瓶頸

Encoder RNN 讀完整來源後，把最後 state 傳給 decoder。短句可行，長句要求一個固定向量同時保存內容、順序與對齊資訊。Decoder 越往後生成，來源細節還要穿過更多 recurrent steps。

Attention 讓 decoder step (t) 對所有 encoder states 計分，形成 context vector。如此每個目標詞能直接讀來源不同位置，對齊也能視覺化。Lecture 5 會從 encoder-decoder attention 推到 self-attention：不只 decoder 看 encoder，序列內位置也彼此直接互動。

Machine translation 的評估還揭露 exposure 與 search 問題。訓練 loss 是局部 next-token likelihood，最終 metric 卻量完整譯文；beam width、length normalization 與重複會影響輸出。模型、training objective 與 decoding metric 必須分開分析。

## 一個從 count 到 RNN 的可操作比較

選一小段公開文字，建立 bigram baseline 與一層 RNN。兩者用相同 train/validation split 與 tokenizer。先確認 bigram smoothing，再讓 RNN overfit 很小 subset。記錄 validation cross-entropy、每 token 推論時間與幾個固定 prefix 的 next-token distribution。

接著逐步拉長 evaluation prefix，觀察 RNN 是否真的利用遠距資訊。可以建立成對句子，只改早期 subject number，看晚期 verb probability 是否改變。這比只看整體 perplexity 更直接測 long dependency。

最後做 gradient norm log：每步記錄 clipping 前 norm，觀察何時爆炸；再查看不同時間距離的 gradient magnitude。你會把「消失梯度」從課本形容詞變成可觀察的 training signal。

## RNN 留給後續架構的三個基準問題

第一，資訊路徑有多長？RNN 的遠距 token 要穿過多步 recurrence；Transformer 讓它一層直連。第二，訓練能否平行？RNN 的 (h_t) 依賴 (h_{t-1})，sequence dimension 難以全面平行。第三，state 容量如何分配？固定 hidden state 必須持續覆寫，attention 則保留各位置表示供查詢。

這三題比「RNN 舊、Transformer 新」更有用。Streaming inference、極小裝置與持續 sensor data 仍可能偏好 constant-size recurrent state；完整文件訓練則常受益於 parallel attention。架構選擇取決於 latency、memory、context 與 task，而不是年份。

比較時固定 tokenizer、資料、參數量級與 decoding，並同時報品質、吞吐、峰值記憶體與第一 token 延遲。只比 perplexity 會漏掉 deployment 上最實際的取捨。

## 材料缺口

Winter 2026 錄影不公開。本文涵蓋官方投影片列出的四段 agenda，未還原口頭例題與課堂推導；同樣不以舊學期公開錄影替代。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 4：Language Models and RNNs 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf)
- [Learning Long-Term Dependencies with Gradient Descent is Difficult](https://ieeexplore.ieee.org/document/279181)
- [On the Difficulty of Training Recurrent Neural Networks](https://proceedings.mlr.press/v28/pascanu13.html)
