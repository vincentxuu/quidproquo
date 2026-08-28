---
title: "MIT 6.7960 L18：遷移學習（Transfer Learning）—— 預訓練、特徵抽取、與微調策略"
date: 2027-01-21
category: tech
tags:
  - mit-67960
  - deep-learning
  - transfer-learning
  - pretraining
  - fine-tuning
  - simclr
  - mae
  - self-supervised
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 18 講：為什麼 ImageNet / 大規模自督導預訓練的特徵能直接搬到下游任務？特徵抽取 vs 全模型微調 vs 參數高效微調（adapter / LoRA）的取捨，以及 SimCLR、MAE 等自督導預訓練怎麼改寫了遷移學習的玩法。"
tldr: "遷移學習的核心是『在大資料上學到的特徵是好的通用表示』：下游任務資料少時，把 backbone 凍住只訓練線性 head；資料夠就全模型微調；想省算力就上 LoRA / adapter。SimCLR、MAE 這類自督導預訓練讓『上游不需要標籤』，下游表現又上一層樓。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 21
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 30
---

> 🌏 [English version](/posts/tech/2027-01-21-mit-67960-l18-transfer-learning-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**（對應 OCW Lec 18）。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。

---

## 為什麼遷移有效

經驗觀察：在一個大資料集（如 ImageNet 1.2M、LAION 400M、web-crawl 文字）上訓練的網路，前幾層學到的幾乎都是「邊、紋理、顏色梯度」這種**通用視覺特徵**，只有最後幾層才對到具體任務。把這些中段表示搬到一個資料少的小任務（例如只有幾百張醫療影像），往往比從頭訓練好得多。

背後的直覺：對很多資料來說，「好的特徵」結構是共通的 — 早期邊/紋理、後期語意。預訓練資料越大、模型越深，這個共通性越強。

## 三大微調策略

### 1. 特徵抽取（freeze backbone）

把 backbone 整個凍住，只訓練一個新的線性（或淺層）head。訓練成本最低，幾分鐘就能跑完。下游資料少、跟預訓練 domain 相近（自然影像 ↔ 自然影像）時效果最好。

```python
import torchvision
backbone = torchvision.models.resnet18(weights="IMAGENET1K_V1")
for p in backbone.parameters(): p.requires_grad_(False)
backbone.fc = torch.nn.Linear(backbone.fc.in_features, 10)
opt = torch.optim.Adam(backbone.fc.parameters(), lr=1e-3)
```

### 2. 全模型微調（full fine-tuning）

把全部參數解凍，下游任務資料夠多時用。**backbone 的學習率通常設成 head 的 1/10**（避免把通用特徵「洗掉」），搭配 cosine LR schedule 與 early stopping。

這是品質天花板最高的策略，但算力最貴 — 微調一個 7B LLM 一輪可能要幾張 GPU 月。

### 3. 參數高效微調（PEFT）

只動 <1% 的參數，卻接近全模型微調的品質。三個主要工具（LoRA 在 L19 詳述）：

- **Adapter**：在 transformer 每個 block 插一個 bottleneck 小層（Houlsby 2019）。
- **LoRA**：把權重更新 ΔW 拆成 `A·B` 低秩矩陣（Hu 2021），freeze 原 W。
- **Prefix tuning**：在 K/V 前綴一段可學習 token（Lester 2021）。

代價是引入一點額外 latency，換來的是訓練成本 10–100x 下降、可以為每個下游任務存一份「小適配器」。

## 自督導預訓練：把標籤成本省掉

ImageNet 標註要花幾千小時人類工時，且很多資料根本沒標籤（醫療、衛星、科學影像）。自督導預訓練用 pretext task 把無標籤資料變成訓練訊號：

- **SimCLR（Chen 2020）**：同一張影像的兩種 augmentation 視為正樣本，不同影像為負樣本，用 InfoNCE loss 拉近拉遠。學到的表示在 ImageNet linear-probe 上接近監督式。
- **MAE（He 2022）**：遮住 75% 的影像 patch，讓模型從可見 patch 重建被遮的。ViT 架構特別適合這種方式，下游偵測/分割都強。
- **DINO、CMAE、BYOL**：各種自督導變體，核心都是「讓模型學到資料內在的對齊 / 結構」。

實務上，**自督導預訓練 + 下游微調**在很多任務（特別是醫療、遙測）已經比監督式 pretraining 更強。

## 實務 workflow

1. **挑 backbone**：預訓練資料域要跟下游「相近或更大」。自然影像首選 DINOv2、ImageNet supervised；多模態用 CLIP；醫療 / 遙測考慮 domain-specific pretrain。
2. **決定策略**：資料 < 1k → 特徵抽取；1k–100k → adapter / LoRA；> 100k → 全模型微調。
3. **凍 backbone LR**：微調時 backbone 用 1e-5、head 用 1e-4，差一個量級。
4. **誠實評估**：在 domain-shifted 測試集上看表現（見 L17）。

## 什麼時候遷移會失敗

- 下游任務**與預訓練差太多**（自然影像 pretrain 拿去聽音訊）。
- 下游**資料夠多到足以從頭訓**（數百萬級別 + 算力夠），有時候 pretrain 反而限制天花板。
- Pretrain 的**任務太窄**（只認貓狗），搬到「車型分類」效果差。

## 串到 L19

L19 會深入 L18 沒展開的 PEFT（LoRA 數學推導、prefix tuning 細節）、foundation model 與 in-context learning 的關係、以及災難性遺忘問題。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Chen et al., *A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)*（2020）：[arXiv:2002.05709](https://arxiv.org/abs/2002.05709)
- He et al., *Masked Autoencoders Are Scalable Vision Learners (MAE)*（2021）：[arXiv:2111.06377](https://arxiv.org/abs/2111.06377)
- He et al., *Momentum Contrast for Unsupervised Visual Representation Learning (MoCo)*（2019）：[arXiv:1911.05722](https://arxiv.org/abs/1911.05722)
