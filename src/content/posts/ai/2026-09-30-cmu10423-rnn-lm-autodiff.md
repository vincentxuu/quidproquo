---
title: "RNN 語言模型：序列機率與梯度怎麼接起來｜CMU 10-423 第 1 堂"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, rnn, language-model, n-gram, backpropagation, pytorch]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 1
tldr: "一句「我喜歡貓」不是三個互不相干的字。"
description: "Spring 2026 公開課程材料教學：RNN 語言模型：序列機率與梯度怎麼接起來｜CMU 10-423 第 1 堂"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

一句「我喜歡貓」不是三個互不相干的字。看到「我」之後，「喜歡」的機率會改變；看到「我喜歡」之後，下一個詞又有新的分佈。本篇要讓你能把這個直覺寫成序列機率，並追蹤：最後一個預測出錯時，梯度如何回到前面的狀態。

先備是條件機率、向量與導數。這裡以三個已切好的 token 示範，token 並不必然等於中文字；實際 tokenizer 可能把一個詞拆成多個片段。RNN 的重點是處理有順序的輸入，而不是指定哪一種切詞法。

## 先走完一次生成

以下是本文自擬的機率例子。模型在起始符號後給「我」的機率 0.5；在「我」後給「喜歡」0.4；在「我喜歡」後給「貓」0.25。因此這三個 token 字首的機率是 0.5 × 0.4 × 0.25 = 0.05。若要計算完整句子的機率，還必須乘上結束符號的條件機率；本例只算字首。

訓練常最小化負對數概似。使用自然對數，這筆例子的 loss 是 −ln 0.5 − ln 0.4 − ln 0.25 = 2.9957。逐 token 平均則是 0.9986。乘積容易因為序列長而變得很小，取對數後改成加法，比較方便計算；它沒有把模型改成另一個機率分佈。

這個分解來自機率鏈式法則：p(x₁,x₂,x₃) = p(x₁)p(x₂|x₁)p(x₃|x₁,x₂)。鏈式法則不是 RNN 專屬；Transformer 語言模型也可使用同一個分解。架構的差別在於如何表示歷史。

## 隱藏狀態是怎麼記住字首的

RNN 用 hₜ = tanh(Wₕhₜ₋₁ + Wₓeₜ + b) 更新狀態，eₜ 是目前 token 的 embedding。再用 hₜ 產生下一個 token 的 logits，經 softmax 變成機率。Wₕ、Wₓ 與輸出投影是跨時間共用的參數，不是每走一步就新增一套網路。

為了看清楚資料流，再用一維自擬模型：h₀=0、Wₕ=0.5、Wₓ=1、b=0，兩個輸入 embedding 為 1 和 0。第一步 h₁=tanh(1)=0.7616，第二步 h₂=tanh(0.5×0.7616)=0.3634。第二個輸入雖然是零，h₂ 仍然不是零，因為第一步的資訊透過 h₁ 留了下來。

如果把輸入順序反過來，第一步狀態為 0，第二步變成 tanh(1)=0.7616。相同兩個數字、不同順序，得到不同狀態；這正是序列模型需要的性質。狀態是有損的摘要，不能因此宣稱它精確儲存整段文字。

## 梯度沿著時間回傳

假設我們只觀察第二步的 loss，鏈式法則仍會讓它影響第一步。以上例而言，∂h₂/∂h₁ = 0.5(1−h₂²) ≈ 0.4340，而 ∂h₁/∂e₁ = 1−h₁² ≈ 0.4200，所以 ∂h₂/∂e₁ ≈ 0.1823。真正 loss 的梯度還要乘上 ∂L/∂h₂，這裡只隔離歷史傳遞的部分。

時間更長時，這些 Jacobian 會連乘。連乘可能越來越小，也可能變大，對應梯度消失或爆炸。不能只靠看到 Wₕ 小於一就判斷所有高維 RNN 都會消失；實際還有矩陣方向、非線性與各步損失。LSTM 的門控、梯度裁切等方法各有作用，但裁切主要限制爆炸，並不自動恢復已消失的歷史訊號。

自動微分記錄運算圖，依鏈式法則累加共享參數的梯度。它不需要符號推匯出整個模型的閉式解，也不是逐個參數稍微改動再量測的數值微分。若中途 detach 狀態，就切斷跨該邊界的梯度；前向數值可能一樣，學習的路徑卻不同。

## 訓練時給正確字首，生成時給自己的輸出

訓練的 teacher forcing 使用資料中的字首預測下一個 token。生成時，模型先選一個 token，再把它當成下一步輸入。訓練可以對已知整句建立圖，但 RNN 狀態仍有時間依賴；生成時還要等待所選 token 才能繼續。

容易混淆的是把低訓練 loss 當成生成保證。資料可能很窄，模型也可能在自己的錯誤字首上繼續犯錯。先把訓練目標、資料分佈與解碼方式分開，才有辦法定位問題。

## 自我檢查與答案

將第三個正確 token 的機率從 0.25 改成 0.5，其餘不變，新字首機率與總 loss 是多少？答案是 0.1 與 2.3026，loss 減少 ln 2。這不是機率增加 0.25 就讓 loss 線性減少 0.25。

再問：若在 h₁ 後 detach，h₂ 還會是 0.3634 嗎？會，前向值不變；但第二步 loss 不能透過這條邊影響第一步運算。能分清數值與梯度路徑，才算理解這堂的核心。

下一步先用作業 0 的自擬小模型把手算梯度與 autograd 對起來，再進入 attention。後者沿用同一個序列機率目標，但改變存取歷史資訊的方法。

[上一篇](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)｜[下一篇](/posts/ai/2026-10-11-cmu10423-hw0-autodiff)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [Lecture 1 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview.pdf)
- [Deep Learning: Sequence Modeling](https://www.deeplearningbook.org/contents/rnn.html)
- [PyTorch autograd tutorial](https://docs.pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [手寫註記版](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture1-overview-ink.pdf)
- [HW0 recitation Colab](https://colab.research.google.com/drive/1F-ik4J0hf8kUdQAH_1HdlpBufuF9j9ny?usp=sharing)
- [The Pile](https://arxiv.org/abs/2101.00027)
- [InstructGPT](https://arxiv.org/abs/2203.02155)
- [Paszke et al. 2019 的 PyTorch 論文](https://proceedings.neurips.cc/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf)
- [Bottou & Gallinari 1991](https://papers.nips.cc/paper/1990/file/a8c88a0055f636e4a163a5e3d16adab7-Paper.pdf)
- [Karpathy 的 RNN 範例](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- [練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 2 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [Goodfellow, Bengio & Courville, Deep Learning, Chapter 10: Sequence Modeling](http://www.deeplearningbook.org/contents/rnn.html)
