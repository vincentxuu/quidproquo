---
title: "CS336 Lecture 3：Transformer 架構很多，真正穩定的預設值其實很少"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, transformer, llm, architecture, hyperparameters]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 4
tldr: "第三講比較大量現代 LLM 後得到的不是一張最佳架構配方，而是一組保守共識：pre-norm、RMSNorm、無 bias、SwiGLU、RoPE，以及少數值得偏離預設的推論與穩定性設計。"
description: "Stanford CS336 Spring 2026 Lecture 3 導讀：normalization、activation、RoPE、模型寬深比、詞彙表、regularization、QK norm、GQA/MQA 與局部注意力。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-architectures-hyperparameters-en)

本篇對應 **CS336 Spring 2026 Lecture 3: Architectures, hyperparameters**，2026 年 4 月 6 日由 Tatsunori Hashimoto 主講。主要來源是官方 [`lecture_03.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)。

這一講的題目故意叫做「Everything you didn't want to know」。近年的模型論文會列出大量架構變體，但真正的問題不是記住每個名稱。你要找出哪些選擇已有跨模型共識、哪些仍是局部取捨，以及哪些只是規模與系統條件不同。

## 從一個簡化的現代 Transformer 出發

相較原始 Transformer，課堂改用較現代的 decoder-only 起點。Normalization 放在 block 前面、position 使用 RoPE，feed-forward 常採 gated activation。後面不是從空白選菜，而是問「偏離這個保守起點有沒有足夠理由」。

這個方法很重要。模型表格很容易讓人誤以為每一欄都同樣關鍵。實際上許多大型模型在核心比例上高度接近，差異集中在推論成本、長 context、穩定性或硬體限制。

## Normalization 的共識最強

現代語言模型大多避免把 normalization 放進主要 residual signal path，常見做法是 pre-norm。相較 post-norm，它通常帶來較穩定的梯度傳遞，也容許較大的 learning rate；部分新模型再加一道不截斷 residual path 的 normalization。

RMSNorm 也逐漸取代完整 LayerNorm。它不減掉平均值，也沒有 bias，操作與參數較少。課堂特別提醒：它的價值不能只用 FLOPs 解釋，因為 normalization 常受資料搬運限制；少一次讀寫可能比少幾個算術操作更重要。

同樣的理由延伸到 bias：很多現代 Transformer 直接拿掉 linear layer 的 bias。這不是宣稱 bias 永遠沒有表達能力，而是在大規模矩陣乘法之外，額外參數與資料搬運未必值得。

## Activation 的主流是 gating

ReLU、GeLU、Swish 與各種 GLU 名稱很多，跨模型最明顯的方向則是 gated feed-forward。SwiGLU 類結構用一條支路產生內容、另一條支路作 gate，實驗上經常優於相同預算的非 gated 版本。

不過比較參數量時要先調整 hidden dimension。傳統 feed-forward 常用 `d_ff = 4 × d_model`；gated 結構多一個 projection，因此常把比例縮到約 `8/3`，讓總參數與運算量接近。直接拿同一個 `d_ff` 比，會把更多參數誤當成 activation 本身的收益。

## RoPE 把相對位置放進內積

正弦位置編碼把位置向量加到 token representation；RoPE 則依位置旋轉 query 與 key。旋轉後的內積可依賴位置差，讓 attention 自然表達相對位置。

它不是沒有代價。長 context 延伸會碰到訓練範圍外的位置頻率，後續模型因此出現不同 scaling 做法。重點不是背完所有延伸，而是理解 RoPE 為什麼已成為保守起點。它把相對位置關係融進 attention 的幾何運算，又不必加入固定長度的位置表。

## 超參數的驚喜是「大家很保守」

投影片跨模型比較了 feed-forward ratio、head dimension、深寬比與 vocabulary size。許多模型仍落在少數常見範圍。非 gated feed-forward 約四倍 model dimension，gated 版本約 `8/3`；head dimension 常取固定量級，模型寬度與層數比例也沒有任意漂移。

Vocabulary 則受語言與產品需求影響較大。單語模型可使用數萬 token，多語與 production 系統常擴到十萬以上。代價和第一講相同：詞彙表變大縮短序列，卻放大 embedding 與 output layer。

Pretraining 的 regularization 也和小資料監督學習不同。資料量極大時，dropout 常設為零；weight decay 仍可能用於穩定優化，而不只是傳統意義的防止 overfitting。

## 穩定性與推論成本才是偏離預設的理由

Softmax 是數值風險集中處。Output logits 可用 z-loss 抑制整體偏移；attention 可在 query/key 上加 normalization，避免 dot product 過大；有些模型用 soft-capping 限制 logits。

推論端則推動 MQA 與 GQA。Autoregressive decoding 每次新增 token 都要讀取 KV cache；減少 key/value heads 能降低記憶體容量與頻寬需求。MQA 只留一組 KV heads，節省最多但可能傷品質；GQA 把多個 query heads 分組共享 KV，是常見折衷。

長 context 也促使模型交錯 full attention 與 local/sliding-window attention。這不是宣稱局部注意力全面優於 full attention，而是用少數全域層保留跨距離資訊，其餘層降低二次成本。

## 怎麼用這一講做架構決策

先採用保守基線：pre-norm、RMSNorm、無 bias、gated feed-forward、RoPE。每次只因一個可測量限制而偏離，例如 KV cache 太大、長 context 成本過高、training logits 不穩。接著在固定參數量與 compute budget 下比較，避免把「模型變大」誤認為「變體更好」。

這就是本講真正的結論：架構搜尋不是把論文中的所有新元件疊起來，而是先利用已形成的共識，把實驗預算留給仍會改變結果的部分。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整官方 PDF。本文依投影片的架構、超參數、穩定性和 attention 章節整理，未拿其他學期補洞。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 3 官方投影片](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [GLU Variants Improve Transformer](https://arxiv.org/abs/2002.05202)
