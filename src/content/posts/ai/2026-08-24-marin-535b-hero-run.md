---
title: "Marin 535B 怎麼訓：Scaling Ladder、MoE 專家並行、Harrier 資料與 W&B 現場"
date: 2026-08-24
category: ai
type: deep-dive
tags: [marin, mixture-of-experts, scaling-laws, llm, open-source, stanford-cs336]
lang: zh-TW
tldr: "Stanford Marin 在 11×GB200 上公開訓練 535B-A23B，先用 1% 算力的 5 階 Scaling Ladder 預註冊 paloma macro-loss 2.04，再以 W&B 即時公開 847 組訓練數據；本文按訓練流程拆解其設計與監控方法。"
description: "按訓練流程拆解 Marin 535B-A23B hero run：為何先做 Scaling Ladder、535B MoE 與 11×GB200 如何組成、Harrier 23.1T 如何分桶、MoE 的 all-to-all 如何解，以及如何用 W&B 判斷是否偏離。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-24-marin-535b-hero-run-en)

這篇介紹 Stanford Marin 正在進行的 **535B-A23B hero run**。

讀完你會知道：為何要用小模型預演大模型、535B 的硬體與參數如何組成、Harrier 資料如何切、MoE 的網路瓶頸如何解，以及如何用 W&B 判斷訓練是否走偏。

核心邏輯是 **用 1% 的算力買 99% 的信心**。先在小尺度上把失敗演一遍，再燒 100 天的正式訓練。

## Marin 是什麼

[Marin](https://github.com/marin-community/marin) 是 Stanford CRFM 在 Percy Liang 主導下建立的開放平台。它主張超越 `open-weight` 的 `open development`。

在 [ICLR 2026 Invited Talk: Marin: Open Development of Frontier AI](https://www.iclr.cc/virtual/2026/invited-talk/10020867) 中，講者直言 `As AI capabilities skyrocket, openness plummets`。Marin 的做法是：每個實驗先登記，過程在 GitHub 上即時更新，包含失敗，任何人可提問與重跑。以這次為例，連 `d2048 在 81% 失敗不續跑` 都留在 [Hero Run #8435](https://github.com/marin-community/marin/issues/8435) 的紀錄裡。

這次的 hero run 是 Marin 迄今最大的一次。官方定位為 `5e24 model-FLOPs, 500B+ total` 級距。

前序已驗證過兩輪小規模：[67B-A2B 10T](https://github.com/marin-community/marin/issues/6044) 的誤差約 0.6%，[1e23 d5120 129B/16B](https://github.com/marin-community/marin/issues/4697) 的誤差約 1%。本文只審 hero 的前 3.5% 與 ladder 的設計，post-training 尚未開始，不在射程內。

## Scaling Ladder 怎麼預演

Hero 要燒約 100 天。失敗一次，成本以百萬美金計。

Marin 的解法是在正式訓練前，先跑 **iso-ratio ladder**。想法很直覺：用同一份食譜煮小鍋，預測大鍋的味道。

### 設計哲學

跑 5 個寬度的小模型，配方完全相同。包含 `791 tokens / 每個 active 參數`、同一 Harrier 資料與 epoch 規則。

然後擬合一條冪律，再外推 hero 的最終 loss。外推值為 **2.04**。

這讓 `偏離航道` 有量化判準，而不只是感覺。

### 與替代方案的比較

隨意的小模型試跑只能回答 `能跑`。

Iso-ratio ladder 回答 `會收斂到哪`。因為比例固定，預測誤差可在先前實驗中被驗證，而非事後解釋。

### 適合與不適合

適合想在燒大錢前先看見 dynamics 的團隊。也適合想重跑驗證的研究者，因為 ladder 僅 1% 成本。

不適合只想看最終榜單的人。榜單要等 hero 跑完與 post-training。

### 實際做法

寬度為 `d768 → d1024 → d1536 → d2048 → hero d6144`。成本僅 1%。

### 限制

`d2048` 在 81% 失敗未續跑，尾段靠外推。其相位轉換是否準確，仍需 hero 實測。

### 抓到什麼

上一次 ladder 看到梯度衝高，才引入 `logit z-loss`。沒有它，高 batch 會在中途炸掉。

這次 ladder 看到梯度在約 25% 處達峰後回落，drop 先衝高再回落。因此 hero 的預期落在 `約 2%` 附近。

## Hero 怎麼啟動：模型與硬體

這節回答 `535B 如何被組起來與放上去`。

### 模型多大

總參數很大，但每次只啟用約 23B。想像 384 位專家，每個 token 只請 8 位，再加 2 位通用的 shared 兜底。

這是 [CS336 Lecture 4](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) 說的 `total ≠ active`。

### 硬體多大

11 台 GB200 NVL72。專家分散在每台機器內，機器之間再做 data-parallel。

對照 [CS336 Lecture 2](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py) 的 `6×N×D` 粗估，2.7e24 FLOPs 除以峰值就能先推 100 天，而非先租機器再猜。

### 適合與不適合

適合需要理解 `active vs total` 對推論成本影響的團隊。

不適合期待單機複現 535B 的團隊。11 台機器無法複現，但 ladder 可以。

### 限制

規格細表見附錄 A。Token 量的 `18.0T vs 18.75T` 是口徑差，前者為步數換算，後者為 reference budget。[評論 08-19](https://github.com/marin-community/marin/issues/8435#issuecomment-3269873921) 已說明 `≤8-epoch cap`。

## Harrier 資料怎麼切

Harrier 不是單一資料集，是一張地圖。

第一步是去重。Raw 有大量來源，經模糊去重與 `n-gram decontam` 後剩下約 23.1T。範例可在 [dedup browser](https://storage.googleapis.com/marin-public/rav/dedup-pair-browser/2026.08.18.2/index.html) 逐對查看，provenance 凍結於 `marin-community/token-counts@3612ddc`。

第二步是分桶。用 [Harrier 0.6b](https://huggingface.co/microsoft/harrier-oss-v1-0.6b) 嵌入，再以 `K-means 5000 → 40` 個語意 domains，品質用 [GLM 5.2](https://huggingface.co/zai-org/GLM-5) 標註後蒸餾。視覺化在 [Harrier K40 overview](https://storage.googleapis.com/marin-public/held/harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling)。

適合想挑 domain 的團隊。可搜一個主題，看它在 `Q0 至 Q4` 的分布與 enrichment，再決定是否上權重。

不適合只想要 `下載即用` 的團隊。底層 `s3://marin-us-east-02a/marin/datakit/store_4d2e363d` 在 08-22 被兩個獨立觀測證實 `403`，端到端重跑仍卡在 bucket policy。

今晚就能做：打開 Harrier K40 overview，輸入 `Software Development`，看它在 Q4 的占比是否高於全庫平均，決定是否在下一輪訓練上權重。

## MoE 的網路怎麼解

把 dense 換成 MoE，省的是 `active FLOPs`，成本轉為 `routing + all-to-all`。

這正是 Lecture 4 要你追問的：每看到 FLOPs 降低，都要問它新增了什麼通訊。

Hero 的三個對策：

- **LatentMoE**：先把 hidden 壓到 latent 再做 all-to-all，傳輸直接減半。FLOP 計算已校正，所以 MFU 不會灌水。
- **Pooled-wave fixed EP**：手寫的固定形狀緩衝與 `in-band IDs`，避開 `ragged` 的動態形狀。細節見 [EP writeup](https://storage.googleapis.com/marin-public/rav/moe-fixed-wave-a2a-384/2026.08.17/index.html)。
- **Shared 兜底**：2 位通用專家提供約三分之一的 dense 能力。即使 dropping 到 40%，仍無 loss 尖峰。

在 [EP64 ragged 診斷 #8077](https://github.com/marin-community/marin/issues/8077) 的 4 節點 proxy 上，優化後從 11% 提升至約 19% MFU。但 full-rack 仍未驗證，所以 hero 先走穩的 fixed 路徑。

適合想增加容量而不等比增加 FLOPs 的團隊。不適合把 MoE 當作 `免費擴大` 的團隊，網路與平衡是隱藏帳單。

## 現場怎麼看：W&B 的 hero-12d8b6f0-dee637

[W&B Hero Run Scaling Ladder](https://wandb.ai/marin-community/marin_moe/reports/Hero-Run-Scaling-Ladder--VmlldzoxNzc2MDM5Ng) 可用 `api.wandb.ai/graphql` 逐點抽取。我們已攔截 847 個 buckets。

訓練目前到 `step 13527`，約 3.5%。關鍵趨勢是：

- `loss` 陡降。早期快速收斂屬預期。
- `grad` 出現早期小峰後回落，方向轉為下降，符合 `看方向不看絕對值`。真正的 25% 主峰還沒到。
- `drop` 從尖峰回落至 3% 附近，落在健康區間。
- `MFU` 預熱後穩定在 21 左右。

與健康清單對照，`First 3%` 已在 #8435 被標記 `clear`。下一觀測窗是約 30% 的真正梯度峰。

Eval 在 12k 步的 `paloma macro` 為 2.57。與 ladder 終值尚有距離，屬正常。不同 domain 的 gap 已可作為 datamix 觀測點。

今晚就能做：用 `BucketedRunsDeltaQuery` 輪詢 `grad` 方向與 `drop`。若 grad 在 25% 前持續上升或 drop 超過 8%，先對照小 ladder 是否同樣形態，再決定是否調 `z-loss` 或 `capacity`。

完整 847 buckets 與 5 個 eval 點的數字見附錄 B，原始 JSON 在 `.research/wandb-hero-12d8b6f0/`。

## 整體來說

Marin 用 1% 的算力買 99% 的信心。代價是更複雜的工程與更慢的起步，換來的是可審計、可中斷、可調整的航程。

這正好是把 [CS336 Lecture 2 的 resource accounting](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py) 與 [Lecture 4 的 MoE 取捨](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf) 搬到 11 台 NVL72 上跑 100 天的實例。

對外部觀察者，價值不在 535 這個數字。而在接下來每次偏離 ladder 預測時，團隊如何公開診斷與修正。

## 參考資料

- [Hero Run #8435 — 535B-A23B on 18T tokens](https://github.com/marin-community/marin/issues/8435)
- [W&B — 535B-A23B 18T Token Hero Run + Scaling Ladder](https://wandb.ai/marin-community/marin_moe/reports/Hero-Run-Scaling-Ladder--VmlldzoxNzc2MDM5Ng)
- [Harrier K40 overview — 23.11T / 40×5](https://storage.googleapis.com/marin-public/held/harrier-k40-cluster-overview/2026.08.18/index.html?revision=uniform-sampling)
- [EP writeup — pooled-wave fixed all-to-all](https://storage.googleapis.com/marin-public/rav/moe-fixed-wave-a2a-384/2026.08.17/index.html)
- [EP64 ragged 診斷 #8077](https://github.com/marin-community/marin/issues/8077)
- [ICLR 2026 Invited Talk: Marin: Open Development of Frontier AI](https://www.iclr.cc/virtual/2026/invited-talk/10020867)
- [CS336 Lecture 2 — PyTorch, resource accounting](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py)
- [CS336 Lecture 4 — Attention alternatives and MoE](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf)
- [Marin — 1e23 report](https://github.com/marin-community/marin/issues/4697)

## 附錄 A：規格細表

- 模型：`d6144 / 48 層 / 384 top-8 + 2 shared`
- 參數：`total 535.3B / active 22.76B`
- 硬體：`11× GB200 NVL72`
- 訓練：`18.0T tokens / 390,139 steps × 11,264 seq × 4096 / 2.70e24 FLOPs`
- 程式碼：`commit 12d8b6f`
- Harrier：`Raw 25.6T → 去重後 23.106T / 40 domains`
- 占比節選：`26 Council 7.52%·1.74T / 32 Infra 7.04%·1.63T / 14 Web Code 6.73%·1.56T`

## 附錄 B：W&B 原始數字

訓練 `847 buckets` 與 eval `5 點` 的完整 CSV 與 JSON 在 `.research/wandb-hero-12d8b6f0/`。

節選：`loss 11.801→1.321`、`grad 峰 1.518→0.205`、`drop 10.43%→3.06%`、`MFU 21.15`、`paloma macro 2.577`。

