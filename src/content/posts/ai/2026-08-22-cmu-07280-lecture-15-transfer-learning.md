---
title: "CMU 07-280 Lecture 15：Pre-training、Transfer Learning 與 Fine-tuning 的分工"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, transfer-learning, fine-tuning, representation-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 15
type: deep-dive
tldr: "Lecture 15 將 pretrained model 拆成 representation g 與 task head h：可以凍結 g 只訓練 head，也能用較小 learning rate fine-tune 部分或全部參數；選擇取決於資料量與 source-target 差距。"
description: "導讀 CMU 07-280 Spring 2026 Lecture 15：representation learning、pretraining、frozen features、fine-tuning 與 foundation models。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-15-transfer-learning-en)

第 15 講 **Pre-training/Transfer Learning/Fine-tuning** 在 2026 年 3 月 12 日進行。Lecture 14 已說明 CNN 如何學 visual features；這一講問的是，換到資料較少的新任務時，哪些能力值得保留，哪些參數需要重學。官方沒有公開逐講錄影，本文只依公開 lecture note 與 HW8 整理。

## 官方材料與讀取範圍

主要來源是 [Transfer Learning lecture note](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Transfer_Learning.pdf)與 [HW8 written component](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)。課表另指向 PyTorch Basics tutorial，但本文的核心主張不依賴該外部教學。沒有專屬 Spring 2026 recitation；Recitation 8 主要處理 CNN shapes 與 parameters。

## 承上問題：新任務為什麼不該每次從零開始

官方材料用兩個臉部分類任務說明：Task A 有大量資料，Task B 資料少但輸入結構相近。從零訓練 B 會重新付出學習 edge、shape 與更高階 feature 的資料和計算成本。Transfer learning 的賭注是，A 的部分 representation 對 B 仍有用。

把模型拆成：

```text
x → g(x) → h(g(x)) → output
```

`g:X→Rᵈ` 是 backbone／representation，`h` 是新任務 head。若 `g` 已把 B 的類別變得接近線性可分，`h` 只需是一個小型 linear classifier。

## 完整概念脈絡：pretraining、feature extraction、fine-tuning

三個詞的時間位置不同：

- **Pretraining**：先在大量資料與 proxy task 上學通用 representation，目的就是供後續任務改造。
- **Frozen feature extraction**：固定 `g`，只訓練新的 `h`。計算少、過度擬合風險低，但 representation 無法適應新 domain。
- **Fine-tuning**：用 Task B 資料繼續 backprop，更新部分或全部 pretrained parameters；通常使用較小 learning rate，避免快速破壞既有能力。

課程也以 masked-image prediction 說明 self-supervised pretraining：從未標註影像自行遮住 pixels，原影像就是 target。Proxy task 本身未必是產品需求，價值在於迫使 `g` 學到可轉移結構。Foundation model 則是以大規模資料預訓練、能適配多種 downstream tasks 的模型。

是否 freeze 不是信仰。資料極少且 source、target 相似時，freeze 常是穩健起點；資料較多或 domain 差異大時，逐步 unfreeze 能增加適應能力。若直接用大 learning rate 更新全部層，可能出現 catastrophic forgetting；若永遠不更新 backbone，則可能遇到 representation mismatch。

## 可重做小例子：兩種策略的 trainable parameters

假設 pretrained backbone 有 1,000,000 個參數，舊 head 有 10,010 個。新任務是 5 類，backbone 輸出 1,000 維，所以新 linear head 有：

```text
1,000×5 + 5 = 5,005 parameters
```

Frozen 策略只訓練 5,005 個；full fine-tuning 訓練 1,005,005 個。兩者 forward cost 接近，backward memory 與可調自由度卻差很多。正確比較應固定 data split 與 evaluation metric，同時記錄 validation gap 與訓練成本。

## Recitation／HW 對應

HW8 是本講最完整的對應：先從 scratch 在兩種資料量的 ImageNet subset 訓練 AlexNet，觀察 overfitting；再比較 AlexNet 與 MobileNet 的參數和 layer 數；接著做 frozen／unfrozen fine-tuning，最後把 pretrained frozen models 移到 ASL 任務。

這個設計不允許只背「pretraining 比較好」。學生必須從 loss、accuracy、train-validation gap 和異常曲線選模型。完整 notebooks 與 autograder 並非全部匿名公開，因此自學者可重建縮小版實驗，不能宣稱原樣完成作業。

## 延伸對照：linear probe、partial unfreeze 與 full fine-tune

Frozen head training 也常叫 linear probing，可先測 representation 本身是否包含新任務訊息。若 probe 已好，未必需要 full fine-tune；若 probe 差，可依序只解凍最後一個 block、更多 blocks、最後全部 layers。這種 staged unfreezing 把「要不要 fine-tune」改成可觀察的序列，而不是一次性豪賭。

下一講 MLE 會把視角從 architecture 拉回 probabilistic assumptions：loss 為什麼長成 cross-entropy 或 squared error，不只是慣例，而能從資料生成模型推導。

## 今晚可以做的動作

找一個小型 pretrained image model 與兩類資料。先凍結 backbone 訓練 linear head，再只解凍最後一個 block，以相同 split 跑相同 epochs。記錄 trainable parameters、最高 validation accuracy、train-validation gap 與每 epoch 時間；不要只比較最後一個 accuracy。

## 參考資料

- [CMU 07-280 Transfer Learning lecture note](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Transfer_Learning.pdf)
- [HW8：AlexNet、MobileNet 與 transfer-learning experiments](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)
- [CMU 07-280 Computer Vision lecture note](https://www.cs.cmu.edu/~07280/lectures/07280_Computer_Vision.pdf)
