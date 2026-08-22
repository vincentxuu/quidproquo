---
title: "CS224N 第 5 講：從 recurrence 到 Transformer"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, transformer, self-attention, nlp, stanford]
lang: zh-TW
series:
  name: "Stanford CS224N 導讀"
  order: 6
tldr: "第 5 講從 RNN 的長距離與循序瓶頸走到 self-attention，再組成 Transformer；它縮短位置間的資訊路徑並容許平行計算，但付出二次方 attention 成本與位置資訊必須另行注入的代價。"
description: "逐段讀 CS224N Winter 2026 Lecture 5：attention、self-attention、Transformer 架構、成果與限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs224n-transformers-en)

[CS224N Winter 2026 官方課表](https://web.stanford.edu/class/cs224n/)把第 5 講排在 2026 年 1 月 20 日，但未列講者；本文因此只歸因於 course staff。[官方投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf)的 agenda 先收完前一講的消失梯度與機器翻譯，再走過 recurrence 到 attention、self-attention、完整 Transformer，最後談成果、缺點與變體。這是本季的架構分水嶺：後面預訓練、後訓練、agent 與推理都預設你已經懂這裡。

## 為什麼要離開 recurrence

RNN 的 hidden state 必須依時間順序計算，位置之間的資訊也要逐步傳遞。即使 gated RNN 緩解梯度問題，訓練仍難以把同一句中的位置全面平行化。機器翻譯又要求 decoder 在不同輸出步驟關注來源句的不同部分，單一固定向量不夠用。

Attention 的第一個答案是：不要只交給 decoder 最後一個 encoder state；讓每個輸出步驟對所有來源 state 計分，再用正規化權重做加權和。模型因此能建立柔性的對齊，並讓資訊走較短的路。

## Self-attention 的三個角色

Self-attention 將同一序列投影成 query、key、value。Query 表示目前位置在找什麼，key 表示每個位置提供什麼索引，value 則是被混合的內容。Scaled dot-product attention 計算 query 與 key 的相似度，除以維度尺度、套 softmax，再加權 value。

單頭只能建立一組混合規則。Multi-head attention 讓不同投影平行學習不同關係，最後串接並再次線性投影。這不保證每個 head 都對應人類可命名的語法關係，但增加了同一層能表示的互動種類。

## Transformer block 怎麼組起來

[Transformer](https://arxiv.org/abs/1706.03762) 的完整 block 不只有 attention。它還包含逐位置的 feed-forward network、residual connection 與 [layer normalization](https://arxiv.org/abs/1607.06450)。Residual path 讓訊息與梯度有直接路徑；feed-forward layer 對每個位置套用相同的非線性轉換。

Self-attention 本身看不出 token 順序：若輸入位置一起置換，輸出也跟著置換。因此模型必須加入 positional representation。Decoder-only language model 還需要 causal mask，防止位置在訓練時偷看未來 token。

## 得到什麼，又付出什麼

Transformer 的主要收益是位置間路徑短、序列位置可平行處理，也更容易擴大模型與資料規模。代價是標準 self-attention 對序列長度有二次方的分數矩陣，長上下文耗費記憶體與運算；位置資訊不再由 recurrence 自帶，必須明確設計；attention 權重也不能直接當成完整的模型解釋。

官方 agenda 將 variants 放在最後，重點不是背模型名稱，而是看變體在改哪個成本：稀疏或局部 attention 減少長序列成本，其他位置編碼改變外推方式，encoder-only、decoder-only 與 encoder-decoder 則對應不同訓練與生成需求。

## 從 encoder-decoder attention 開始

在 RNN translation 裡，decoder hidden state 對每個 encoder state 算 alignment score。Softmax 後的權重形成 context vector，再與 decoder state 一起預測目標詞。這一步已經移除「所有來源資訊只能塞進最後 state」的瓶頸，但 encoder 與 decoder 本身仍循序。

Self-attention 把同一機制用在單一序列內。每個位置既提出 query，也提供 key 與 value。位置 (i) 不必經過 (i+1,i+2) 才把資訊傳到 (j)；一層就能直接建立連結。Path length 從與距離成正比，縮到常數層數。

Attention 並非憑空取代 RNN。它承接了 translation alignment 的 query-key-value 直覺，再移除 recurrence。理解這段血緣，能避免把 Transformer 當成只有方塊圖的新名詞。

## Scaled dot-product attention 逐步算

給輸入矩陣 (X\in R^{n\times d})，以 learned matrices 產生 (Q=XW_Q)、(K=XW_K)、(V=XW_V)。

\[
\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V.
\]

(QK^T) 是 (n\times n) 分數矩陣。除以 (sqrt{d_k}) 是因為 dimension 增加時 dot product variance 變大，softmax 容易進入極端飽和區，gradient 變小。Mask (M) 可把禁止位置加上負無限；decoder causal mask 正是遮住未來。

Softmax 沿 key dimension 做，因此每個 query 的權重和為一。加權和輸出仍是一個 value vector。Shape 檢查很直接：輸入 sequence length 是 (n)，輸出也保留 (n) 個位置。

實作最常見錯誤是 mask broadcasting、head dimension transpose 與 softmax 軸。用四個 token、單一 head 的人工例子，先印出 score matrix 與每 row sum，再進大型 batch。

## Multi-head 不是把同一結果複製多次

每個 head 有自己的 (W_Q,W_K,W_V)，在較小 subspace 算 attention。Outputs concatenate 後乘 (W_O)。總 model dimension 固定時，增加 head 不必線性增加 attention output dimension，而是把表示切成多組關係空間。

不同 head 可能捕捉位置、句法或複製關係，也可能冗餘。Attention visualization 能提出 hypothesis，不能單獨證明因果；要配合 ablation 或 intervention，看移除 head 是否真的改變行為。

Head 數也受 (d_{model}) 可整除限制。Head dimension 太小會限制每組表示，太多 head 還增加 kernel 與 memory overhead。這是 architecture hyperparameter，不是越多越好。

## Feed-forward layer 提供逐位置的非線性計算

Attention 混合位置資訊，feed-forward network 對每個位置獨立套用相同 MLP，通常先升維再降回 (d_{model})。若只有 attention 的 weighted averages，模型的逐位置非線性轉換能力受限；FFN 提供大部分參數與 feature transformation。

Residual connection 把 sublayer output 加回輸入，layer normalization 控制表示尺度。Pre-norm 與 post-norm 把 normalization 放在 sublayer 前或後，會影響深網路 gradient stability。Lecture 5 的核心不要求背完所有現代 variant，但要知道 block performance 不是 self-attention 單一元件的功勞。

Dropout 可用在 attention weights、projection 或 residual branch。訓練與 evaluation mode 不同；忘記 `model.eval()` 會讓相同輸入輸出變動，也影響 layer behavior 與可重現評估。

## Position 是額外訊號，不是 attention 自帶

若不加位置，將輸入 row 一起 permutation，self-attention output 也同樣 permutation。模型知道 token 集合與內容互動，卻不知道第一與第五的順序差別。

Sinusoidal encoding 為每個位置建立不同頻率的 sine/cosine，加入 token embedding；learned position embedding 直接學 table。RoPE 後來把相對位置關係編進 query/key rotation。不同方法影響長度外推，但沒有一種保證模型能使用任意遠 context。

Causal language model 的 position 與 mask 是兩件事：position 告訴順序，mask 限制資訊方向。只加 position 不會阻止偷看未來；只加 mask 則仍缺乏距離與順序訊號。

## Encoder、decoder 與 encoder-decoder

Encoder self-attention 不遮未來，適合用完整上下文形成 representation。BERT 類 masked objective 使用這種架構。Decoder 用 causal attention，自回歸預測下一 token，GPT 類模型屬此型。

Encoder-decoder 先讓 encoder 雙向處理來源，decoder 除 masked self-attention 外再做 cross-attention。Translation、summarization 與明確 input-to-output 任務可使用這個分工。三者差異首先是 information flow，不是品牌名稱。

選型時畫出每個 output 允許看到哪些 input。若 classification 可以看全句，沒有理由強迫 causal；若 generation 在 timestep (t) 不能看未來 target，就必須 mask；若來源與目標角色不同，cross-attention 提供清楚介面。

## 二次方成本從哪裡來

Score matrix (QK^T) 有 (n^2) 個元素。Sequence length 加倍，attention score memory 與主要計算約變四倍。這使長文件、影片 frame 或高解析影像 token 特別昂貴。

Local attention 只看附近 window，sparse pattern 選部分連結，linear attention 改寫運算次序或 kernel approximation，FlashAttention 則以 IO-aware exact algorithm 降低 memory traffic。它們解的問題不同：有的改 asymptotic pattern，有的保持 exact attention 但改善硬體效率。

比較 variant 時同時報 sequence length、quality、wall-clock、peak memory 與 hardware。只說「linear」不代表在實際長度一定更快；kernel overhead 與近似品質都會影響 crossover。

## 官方 Assignment 3 如何驗證理解

公開 A3 先用紙筆題檢查 copying behavior、single-head limitation 與 permutation equivariance，再要求從頭實作 decoder-only Transformer。這個順序很好：先證明架構性質，再把 attention、MLP、block、loss 與 generation 串起來。

實作時採 bottom-up 測試。先測 causal mask 是否讓未來 token 改變時，過去位置輸出完全不變；再測 attention row sum、shape 與 finite value。接著測 residual block，最後讓小模型 overfit 一小段文字。

Generation test 要固定 seed 與 decoding setting。若 training loss 下降但 generate 崩壞，檢查 input cropping、position index、cache、train/eval mode 與是否把新 token 接回。官方提供 pytest 與 snapshot，能把每個 subproblem 變成獨立進度，而不是等完整模型失敗才猜。

## 材料缺口

Winter 2026 錄影不公開。本文完整覆蓋投影片的六段 agenda，但沒有把 2019 或 Spring 2024 的公開影片當成這堂課的口述內容。投影片中的現場解說與課堂問答無法由公開材料確認。

## 參考資料

- [CS224N Winter 2026 官方課程頁](https://web.stanford.edu/class/cs224n/)
- [Lecture 5：Attention and Transformers 投影片](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Layer Normalization](https://arxiv.org/abs/1607.06450)
