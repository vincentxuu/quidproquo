---
title: "CS336 Lecture 11：Scaling law 落地時，learning rate 與 batch 也要一起縮放"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, scaling-laws, llm, mup, optimization]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 12
tldr: "第十一講從 MiniCPM、DeepSeek、Qwen 與 Llama 3 的公開 recipe 拆解 scaling 實務：先固定大多數架構比例，再用小規模 sweep 找 learning rate、batch 與 IsoFLOPs 配置；μP 有用，但會被 normalization、optimizer 與 weight decay 破壞。"
description: "Stanford CS336 Spring 2026 Lecture 11 導讀：WSD schedule、IsoFLOPs、learning-rate/batch scaling、μP 的條件與限制，以及公開模型的 scaling recipe。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-scaling-laws-practice-en)

本篇對應 **CS336 Spring 2026 Lecture 11: Scaling — case study and details**，2026 年 5 月 4 日由 Tatsunori Hashimoto 主講。主要來源是官方 [`lecture_11.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_11.pdf)。

Lecture 9 說明 scaling law 的原理；這一講檢查公開團隊實際怎麼做。真正困難的不只是選 model size 與 token count，還要讓 initialization、learning rate、batch size 和 schedule 在規模改變時仍可比較。

## 公開 recipe 的共同骨架

MiniCPM、DeepSeek、Qwen、Llama 3 等做法細節不同，卻共享一個務實順序。先把多數 Transformer 架構比例視為近似不隨規模改變，再用小模型 sweep learning rate 與 batch。最後以 IsoFLOPs 或 joint fit 選 parameter/data allocation。

這能把搜尋空間從所有架構與 optimizer 組合，縮成少數會隨 scale 漂移的變數。前提是保留足夠小規模 runs，而不是只公布最後一個 checkpoint。

## WSD 讓 token budget 更容易比較

Cosine schedule 把 learning rate 綁定預定總步數；若想在不同 token counts 比較同一 run，提前停止的位置還沒進入相同 decay 階段。Warmup–stable–decay（WSD）先長時間保持穩定 learning rate，最後才進入較短 decay。

這讓一條長 run 能在 stable phase 提供多個 data-budget checkpoint，再為選定終點加 decay。它不能取代從頭訓練所有配置，但降低了掃描 data/model tradeoff 的成本，也讓「只是 schedule 階段不同」較不會被誤認為 scaling 差異。

## Learning rate 與 batch 要用 surface 看

只在每個 scale 各挑一個 learning rate，容易把 tuning 誤差寫進 scaling curve。公開研究常對 `(learning rate, batch size)` 做 grid，觀察 loss surface 的 convex basin，並擬合 near-optimal region 如何隨 model size 改變。

Critical batch size 也不是固定常數。目標 loss、資料分布與 optimizer 都會改變它；batch 增加可減少 optimization steps，但超過某點只會消耗更多 examples。Scaling recipe 應同時報 tokens、steps、global batch 與 wall-clock。

## μP 想讓超參數跨寬度轉移

Maximum update parameterization（μP）會調整 initialization 與 layer-specific learning-rate scaling。目標是讓 activations 和 updates 在 width 增加時保持同一量級。若條件成立，小模型找到的最佳 learning rate 可轉移到大模型。

課堂也花大量篇幅講失敗條件。現代 SwiGLU、RMSNorm gain、特殊 optimizer 與強 weight decay 可能偏離理論假設。實驗中 μP 通常比 standard parameterization 穩定，卻不是「設定一次就永遠不用調」。每加入新元件，都要重新檢查 scaling 是否仍保持。

## IsoFLOPs 的價值是把比較條件鎖死

在每個 compute budget 下訓練多個 model sizes，取最低 loss 的位置，再觀察最適 `N` 與 `D` 如何隨 budget 移動。這比把不同訓練 FLOPs 的公開模型排成排行榜乾淨，因為每條曲線都回答同一個固定預算問題。

但 IsoFLOPs 仍可能被 recipe 影響：某個 model size 的 learning rate 沒調好、data 重複過多或 schedule 不同，minimum 就會偏移。Scaling experiment 本身也是一個需要 quality control 的訓練專案。

## 一份可執行的 scaling recipe

先固定 tokenizer、data mixture、architecture ratios 與 optimizer family。選三到四個小規模，對 learning rate 和 batch 做 grid；確認 loss surface 與 near-optimal band。再選數個 FLOP budgets 做 model/data sweep，保留 holdout scale 驗證外推。最後才訓練 target model，並在途中用預測 loss 做異常偵測。

第十一講的結論很不浪漫：scaling law 並沒有消除 tuning，而是把昂貴的一次豪賭改成許多受控的小實驗。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整官方 PDF。本文依當期投影片的公開 recipe、optimizer scaling 與 μP 段落整理。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 11 官方投影片](https://github.com/stanford-cs336/lectures/blob/main/lecture_11.pdf)
- [Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer](https://arxiv.org/abs/2203.03466)
- [DeepSeek LLM](https://arxiv.org/abs/2401.02954)
