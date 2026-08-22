---
title: "CS336 Lecture 9：Scaling law 不是水晶球，是小實驗的外推工具"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, scaling-laws, llm, training, evaluation]
lang: zh-TW
series:
  name: "Stanford CS336 導讀"
  order: 10
tldr: "第九講從資料量與 error 的 log-log 線性關係出發，說明 scaling law 如何比較架構、optimizer、batch 與模型資料配置；Chinchilla 爭議也示範擬合方法、資料範圍與部署目標會改變答案。"
description: "Stanford CS336 Spring 2026 Lecture 9 導讀：data scaling、power law、critical batch size、μP、IsoFLOPs、Kaplan 與 Chinchilla 的 compute-optimal scaling。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cs336-scaling-laws-foundations-en)

本篇對應 **CS336 Spring 2026 Lecture 9: Scaling laws**，2026 年 4 月 27 日由 Tatsunori Hashimoto 主講。主要來源是官方 [`lecture_09.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_09.pdf)。

如果最後一次大模型訓練才發現模型太大、資料太少或 learning rate 不對，預算已經無法追回。Scaling law 的用途，是用一批較小實驗建立簡單、可檢驗的關係，再預測昂貴區域。它不是保證未來的定律，而是一套設計實驗與管理不確定性的工具。

## Power law 為什麼容易被看見

許多學習曲線可以寫成 error 隨 data size 的 power law；在 log-log 圖上就接近直線。直線的 slope 表示增加資料的邊際收益，offset 則反映資料品質、分布或方法的整體差異。

單調下降並不足以推出 power law。課堂從 mean estimation 與 nonparametric learning 說明，統計收斂率常自然產生 polynomial rate。神經網路出現相似規律，可能和資料的 intrinsic dimension 有關；這仍是解釋框架，不是已完全解開的原因。

## 資料不是只看 token 數

資料組成可能改變曲線 offset，distribution shift 也會讓同一 slope 對 downstream data 失效。重複資料的價值會遞減，因此有限語料下，選擇與混合策略要隨訓練規模改變。

這也是盲目外推會壞掉的地方。Scaling curve 是在特定資料分布、tokenizer、architecture、optimizer 與訓練 recipe 下量到的；其中一項改變，舊係數就不一定適用。曲線還通常描述可達到的趨勢，不代表工程實作不會更差。

## Scaling law 可以先淘汰架構選項

比較 Transformer 與 LSTM 不必各訓練一個 GPT-3 規模模型。可在多個小規模點擬合兩條曲線，觀察 slope 與 crossover。Optimizer、depth/width、head 配置也能用類似方法判斷效果是否隨規模保持。

有些超參數能從小模型轉移，有些不能。μP 類方法的目標就是選擇 parameterization，使最佳 learning rate 等設定較能跨 width 保持。Critical batch size 則衡量 batch 增大到哪裡後，減少 steps 的收益開始被更多 examples 抵銷。

MoE 也提醒「參數量」不是單一價值。Total parameters、active parameters 與 compute 不再同步，用 dense model 擬合的 parameter scaling 不能直接套用。

## Compute-optimal 問題同時選 N 與 D

固定訓練 compute `C`，模型參數 `N` 與資料 token `D` 之間有多種配置。小模型看很多資料，或大模型看較少資料，都可能使用相同 FLOPs。Compute-optimal scaling 要找固定 `C` 下最低 loss 的組合。

Kaplan 與 Chinchilla 得到不同的最適比例，課堂用它展示方法差異。常見三種做法是：取所有 training curves 在各 compute 的 minimum；在固定 FLOPs 下掃不同模型大小的 IsoFLOPs；或在 `(N, D)` grid 上 joint fit。資料範圍、schedule 與擬合細節都可能改變 exponent，原始 Chinchilla joint fit 後來也受到資料重建與再分析挑戰。

因此不要只抄「tokens per parameter」常數。應保留原始 runs、loss 定義、compute accounting、擬合式與 residuals，確認目標區域仍由觀測點支撐。

## Train-optimal 不等於 deployment-optimal

Chinchilla 問的是固定訓練 compute 下取得最低 loss；產品生命週期還要支付大量 inference。較小模型訓練更多 tokens，可能不是 train-optimal，卻能在長期 serving 降低延遲與成本。Distillation、quantization 與 hardware constraints 也會改變最終目標。

所以 scaling experiment 之前必須先寫 objective。先決定是否只算一次 pretraining，或要包含預期 inference tokens。接著選擇最佳化 validation loss、downstream score 或 wall-clock。沒有目標函數，compute-optimal 只是一句不完整的話。

## 一個可重做的 scaling 實驗

選數個 model sizes 與 token budgets，固定 tokenizer、資料 mixture 與 optimizer recipe；每個點保存實際 FLOPs 與 validation loss。先畫 log-log curve，再 fit power law 並檢查 residual。留出最大規模點不參與 fitting，用它測試外推。若 holdout 明顯失準，就不要把曲線延伸到更昂貴區域。

第九講的價值不是給出永久 exponent，而是把「我們覺得放大會有效」改成一個可以在小規模被推翻的預測。

## 材料完整度

本講有 Spring 2026 當期 schedule 與完整官方 PDF。本文涵蓋 data scaling、模型工程與 compute-optimal scaling，沒有預先挪用 Lecture 11 的實作內容。

## 參考資料

- [CS336 Spring 2026 課程與 schedule](https://cs336.stanford.edu/)
- [Lecture 9 官方投影片](https://github.com/stanford-cs336/lectures/blob/main/lecture_09.pdf)
- [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
