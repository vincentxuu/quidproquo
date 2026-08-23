---
title: "CS336 Lecture 4：Attention 不只一種，MoE 也不是免費擴大模型"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm, attention, mixture-of-experts, mamba]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 5
tldr: "第四講沿著兩種稀疏化拆解現代 LLM：linear/recurrent attention 減少序列維度成本，MoE 讓每個 token 只啟用部分參數；兩者都把理論省下的 FLOPs 換成 routing、平衡與通訊問題。"
description: "Stanford CS336 Spring 2026 Lecture 4 導讀：linear attention、Mamba-2、Gated DeltaNet、稀疏注意力、MoE routing、load balancing、expert parallelism 與 upcycling。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-attention-moe-en)

本篇對應 **CS336 Spring 2026 Lecture 4: Attention alternatives and mixture of experts**，2026 年 4 月 8 日由 Tatsunori Hashimoto 主講。主要來源是官方 [`lecture_04.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf)。

這一講把兩個常被分開談的主題放在一起：attention alternatives 與 mixture of experts（MoE）。共同問題是能否增加 context 或參數，卻不讓每個 token 支付完整成本。結構化稀疏可以做到，但省下的運算會轉化成新的最佳化與系統問題。

## Linear attention 改變乘法順序

標準 attention 先建立 `QKᵀ`，序列長度為 `n` 時會產生 `n × n` 矩陣。若暫時拿掉 softmax，可利用結合律改寫：

```text
(QKᵀ)V = Q(KᵀV)
```

右邊不必顯式保存完整 attention matrix，對長序列可從 quadratic cost 轉向 linear cost。因果版本還能寫成 recurrent state：每一步把新的 key/value 外積累積到狀態，再用 query 讀取。訓練時可以平行計算，推論時則以固定大小 state 遞迴更新。

問題是 softmax 不是可以隨便拿掉的裝飾。Linear attention 必須改用 kernel feature map 或其他 gating，表達能力與穩定性不再等同標準 attention。因此實務模型常採 hybrid：大部分層用線性或 recurrent block，間隔插入 full attention，避免完全失去精確的 token-to-token 存取。

## 從 Mamba-2 到 Gated DeltaNet

Mamba-2 可視為在線性 recurrent state 上加入輸入決定的衰減 gate。舊資訊不是永久累加，而是依 token 動態保留或淡出。Gated DeltaNet 再加入寫入 gate 與沿 key 方向擦除舊狀態的更新，讓模型可以選擇不寫，也能覆蓋相近記憶。

課堂的重點不是宣稱其中一種已取代 Transformer。公開模型更常顯示 hybrid 路線：recurrent/linear block 負責便宜地掃過長序列，少量 full attention 提供精確回看。另一條路是 sparse attention，先用輕量 indexer 選出少數位置，再只對那些 token 做 attention。

## MoE 稀疏的是參數啟用

Dense Transformer 的每個 token 都通過同一個 feed-forward network。MoE 把它換成多個 expert，再用 router 為每個 token 選少數幾個。總參數量可以大幅增加，但單個 token 的 active parameters 與 FLOPs 只隨被選中的 experts 成長。

最常見的是 token-choice top-k routing：router 產生每個 expert 的分數，選最高的 k 個，再依權重合併輸出。不同模型會改 expert 數量、每個 expert 大小、active experts 數與是否保留 shared experts。這些欄位不能只看 total parameters；真正影響推論成本的是 active parameters 與通訊路徑。

## Router 的兩個難題

第一個難題是離散選擇不可微。實務系統通常讓 top-k 決定稀疏路徑，同時讓被選中的 gating weights 接受梯度。早期也嘗試 REINFORCE 或加入隨機擾動，但沒有形成單一乾淨解法。

第二個難題是負載不均。如果很多 token 都選同一位 expert，那台裝置會塞車，其他裝置閒置。常見做法加入 auxiliary load-balancing loss，逼使用量靠近平均；也有方法對每位 expert 維護動態 bias，把滿載 expert 的 routing probability 壓低。

這些方法帶來新取捨。平衡 loss 太強會干預模型學到的 specialization；太弱則讓硬體利用率崩掉。Router 的 z-loss 也常用來壓制 logits，避免 softmax 變得不穩。

## Expert parallelism 讓參數分散，也製造 all-to-all

MoE 很適合把不同 experts 放到不同 devices，形成 expert parallelism。每層 router 選完後，token activations 必須送到對應裝置，算完再送回來。這是 all-to-all communication：計算雖然稀疏，網路流量卻可能成為瓶頸。

因此 MoE 的優勢通常在多機規模才明顯，基礎設施也比 dense model 複雜。Capacity limit、token dropping、routing stochasticity 與 fine-tuning overfit 都是「相同 FLOPs、更多參數」這句話省略的成本。

## Upcycling：從 dense checkpoint 長出 experts

MoE 不一定從頭訓練。Upcycling 會複製既有 dense feed-forward weights 成多個 experts，再繼續訓練讓它們分化。這能重用昂貴 checkpoint，但初始 experts 幾乎相同，router 與 specialization 仍需後續學習。

本講用 DeepSeek MoE 世代展示另一個方向：experts 變得更多、更細，只有少數被啟用，並搭配 shared experts、latent attention 與多 token prediction。這些元件共同作用，不能把模型結果全部歸因於 MoE。

## 讀完後怎麼選

如果瓶頸是長 context，先比較 local/full hybrid、sparse attention 與 recurrent/linear hybrid；評估項目要包含品質、prefill、decode state 與 kernel 支援。如果瓶頸是想增加參數容量而不等比例增加 FLOPs，才考慮 MoE，並把 router balance、all-to-all bandwidth 與 serving batch 一起納入設計。

稀疏不是消除成本，而是改變成本落在哪裡。第四講最值得留下的判準就是：每看到一個 FLOPs 降低的架構，都追問它新增了什麼 state、routing、通訊或 kernel 複雜度。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整官方 PDF。本文依投影片的 attention alternatives、MoE routing、training 與 systems 段落整理。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 4 官方投影片](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf)
- [Mamba-2: Transformers are SSMs](https://arxiv.org/abs/2405.21060)
- [Switch Transformers](https://arxiv.org/abs/2101.03961)
