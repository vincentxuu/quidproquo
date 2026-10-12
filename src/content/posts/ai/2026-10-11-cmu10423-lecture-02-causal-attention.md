---
title: "因果注意力：從 Q、K、V 算到下一個 token｜CMU 10-423 第 2 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 3
tldr: "RNN 把歷史壓進一個狀態，attention 則讓目前位置直接讀取一組歷史表示。"
description: "Spring 2026 公開課程材料教學：因果注意力：從 Q、K、V 算到下一個 token｜CMU 10-423 第 2 堂"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en)

**影片狀態：錄影需登入或課程授權。** 本文依公開投影片與作業整理，數值例子為本站補充，不是課堂逐字稿。

RNN 把歷史壓進一個狀態，attention 則讓目前位置直接讀取一組歷史表示。本篇的目標不是背出 Q、K、V 三個縮寫，而是能拿一段短序列，算出誰可以被看見、權重怎麼來、最後傳回甚麼值。先備是矩陣乘法、softmax 與上一堂的下一 token 預測。

## 查詢、比對、取值是三個步驟

假設序列有三個 token，每個 embedding 是 d 維。線性投影把同一份輸入 X 變成 Q=XWQ、K=XWK、V=XWV。Q 表示目前位置要找的資訊，K 用來決定匹配程度，V 是匹配後取回的內容。這是對運算角色的解釋，不是說網路裡有人工寫好的語意標籤。

單頭 attention 先計算 QKᵀ/√dₖ，得到每對位置的分數。對每一列做 softmax 後再乘 V，得到值向量的加權和。若 Q 與 K 是 `[T,dₖ]`，分數是 `[T,T]`；V 是 `[T,dᵥ]`，輸出就是 `[T,dᵥ]`。序列長度與向量維度在這裡有不同角色，不能把 reshape 當成任意交換。

## 三個 token 的完整數值例子

以下是本站自擬的單頭例子，直接指定投影後的向量，以免線性層遮住核心。設 dₖ=1，Q=[1,1,1]、K=[0,ln 2,ln 4]、V=[2,4,8]。未遮罩的每列分數都是 [0,ln 2,ln 4]；取指數得到 [1,2,4]。

在第三個位置，可讀到全部三個值，權重是 [1/7,2/7,4/7]，輸出是 (2+8+32)/7=6。在第二個位置，只能讀前兩個，分母改成 1+2=3，權重 [1/3,2/3,0]，輸出 2/3+8/3=10/3。第一個位置只能讀自己，權重 [1,0,0]，輸出是 2。

這裡 dₖ=1 所以縮放係數為一。如果你換成多維向量，先做內積再除以 √dₖ，不能把整個 softmax 結果再除一次。縮放是為了控制分數尺度，避免維度增加時 softmax 太容易飽和。

## mask 為什麼要在 softmax 之前

因果 mask 讓位置 i 只能讀 j≤i 的資訊，通常把不允許的分數設成負無限大。因為 exp(−∞)=0，它們在正規化前就被排除。若先算未遮罩的 [1/7,2/7,4/7]，再把未來權重清零，第二列只剩 [1/7,2/7,0]，權重總和變成 3/7，輸出 10/7，跟正確的 10/3 不同。

這不只是小數誤差，而是不同運算。還要區分 causal mask 與 padding mask：前者限制時間方向，後者排除補齊長度的位置。真實 batch 經常同時需要兩者。實作時也要避免把整列都遮掉，因為對全負無限大的列做 softmax 可能得到 NaN。

## attention 輸出還不是字詞機率

上例的 6 是 hidden representation 的一個分量，不是下個 token 的機率。多頭 attention 分別投影並讀取資訊，將各頭輸出串接後再做輸出投影。Transformer block 還包含殘差路徑、正規化與逐位置的前饋網路；最後經詞彙投影才得到 logits，softmax 才是字詞分佈。

沒有位置資訊時，self-attention 對輸入的重新排序具有排列等變性，無法單靠「這是第三列」學到完整順序語意。causal mask 提供方向限制，但不能取代專門的 position representation。RoPE 留到第 4 堂，先確保能清楚分開內容匹配、可見範圍與位置訊號。

## 訓練可以平行讀字首，生成仍逐步走

訓練時整段真實序列已知，因果 mask 可以一次計算各位置輸出。標籤向右移一位，例如輸入 [BOS,我,喜歡] 對應標籤 [我,喜歡,貓]。第二位置可看 BOS 與「我」，但不能偷看本來要預測的「喜歡」。

生成時，下個 token 還不存在，必須先選出它才能繼續。可平行訓練並不代表自回歸生成會一次知道整句；KV cache 解決的是重複計算，不是取消這個依賴。

## 變式題與答案

把第三個 V 從 8 改成 15，Q、K 不變。前兩位置輸出仍是 2 與 10/3，第三位置變成 (2+8+60)/7=10。原因是未來的 value 被 mask 排除，而不是它對前兩個 query 的匹配分數太小。

若第二列 mask 後的權重為 [1/7,2/7,0]，是哪個錯誤？答案是先正規化再清零，沒有在允許的位置重新正規化。能用這個反例定位錯誤，就可以進入下一堂，把 hidden state 接到訓練 loss 與解碼選擇。

[上一篇](/posts/ai/2026-10-11-cmu10423-hw0-autodiff)｜[下一篇](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

## 課程影片來源

官方錄影入口位於 SCS Panopto。匿名資料夾未載入並提示登入；這表示未取得公開播放內容，不代表沒有錄影。原音與字幕須依課程授權存取。

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## 參考資料

- [Lecture 2 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
