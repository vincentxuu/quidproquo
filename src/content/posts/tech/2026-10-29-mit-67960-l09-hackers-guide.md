---
title: "MIT 6.7960 L09：深度學習駭客指南 —— 讓網路真正聽你使喚的實作心法"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - training-tricks
  - debugging
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 9 講（Phillip Isola）：把深度學習從理論變成能跑出結果的實作心法——資料優先、先過擬合小批次、學習率與正則化的取捨、以及一套可複製的訓練 recipe。"
tldr: "訓練神經網路更像工程而非魔法：先看資料、先在小批次上過擬合證明容量夠、再用正則化把泛化補回來；學習率永遠是影響最大的那顆旋鈕。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 11
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 18
---

> 🌏 [English version](/posts/tech/2026-10-29-mit-67960-l09-hackers-guide-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Phillip Isola** 授課，參考材料包含 *Recipes for Training Neural Networks* 與 Google *Rules of ML*。

---

## 這一講在補什麼缺口

前面幾講講了架構、優化、正則化，都是「對的知識」，但沒告訴你**當 loss 三天不動時該怎麼辦**。第 9 講就是這堂「實作生存術」。

核心心態：**訓練神經網路是工程，不是煉金**。它可以被系統化、可以被除錯、可以有一套可重複的步驟。

## 1. 資料優先

絕大多數「模型不 work」的問題，根因在資料：

- **親眼看資料**：抽幾十筆出來看，確認 label 合理、沒有明顯錯標、輸入範圍正常。
- **檢查 train/val 分佈**：如果驗證集和訓練集分佈差太多，再好的模型也泛化不過去。
- **做最簡單的 baseline**：先用一個 trivial 規則（例如「永遠猜多數類」）看準確率下限，再讓模型去超越它。

## 2. 先過擬合一個小批次

這是最被低估的一步。在正式訓練前，**拿極少數樣本（甚至一個 batch），把模型調到能把這幾筆記住（train loss → 0）**。

- 做不到 → 網路容量不夠、學習率錯、或資料/前向有 bug。先解決這個，再談泛化。
- 做得到 → 證明你的 pipeline 是通的，接下來只是容量與正則化的平衡。

這一步能在 5 分鐘內排除掉 80% 的低級錯誤（維度對不上、激活全死、梯度消失）。

## 3. 學習率：最重要的旋鈕

如果只能調一個超參數，調學習率。實務建議：

- **先掃一個範圍**（如 1e-1, 1e-2, 1e-3, 1e-4），看哪個讓 loss 穩定下降。
- **用 warmup + decay**：訓練初期用小的 LR 避免破壞隨機初始化，再慢慢升上去，後期衰減。
- **batch 變大時 LR 通常也要變大**（linear scaling rule：batch ×k，LR 約 ×k，直到 critical batch size）。

## 4. 正則化是「把泛化補回來」

過擬合小批次證明容量夠之後，用正則化把泛化補回來：

- **Dropout**：訓練時隨機關掉部分神經元，強迫冗餘表示。
- **Weight decay（L2）**：懲罰大權重，讓解更平滑。
- **Data augmentation**：在不改變標籤語意的條件下造資料，是最便宜的正則化。
- **Early stopping**：驗證集 loss 開始上升就停，本質是對「訓練步數」做正則化。

判斷依據永遠是 **train/val loss 的差距**：差距大 = 過擬合（加正則化）；train loss 本身就高 = 欠擬合（加容量或訓練更久）。

## 5. 一套可複製的 recipe

把上面整理成一個順序，每次都照做：

1. 看資料、做 baseline。
2. 小批次過擬合，確認 pipeline 通。
3. 跑通全資料，用中等容量，只調學習率。
4. 觀察 train/val gap，決定加正則化還是加容量。
5. 最後才做「精調」：激活函數、normalize 方式、架構細節。

絕對不要第一步就上最炫的架構 + 一堆花式技巧——那會讓你分不清到底是哪個改動生效。

## 6. 監控與除錯清單

loss 不降時，按這個順序查：

- 學習率是不是太大（loss 震盪/發散）或太小（紋風不動）？
- 輸入有沒有正確 normalize（均值 0、方差 1）？
- 激活有沒有整層死掉（ReLU 後全 0）？
- 梯度有沒有消失/爆炸（看梯度範數）？
- 資料 pipeline 有沒有把 label 搞錯或 shuffle 壞掉？

## 為什麼這對實作重要

這一講的價值不在某個具體技巧，而在**建立一個可控的實驗流程**。當你有一套可重複的 recipe，每次實驗失敗都能定位原因，而不是「換個隨機種子再試一次」。

## 參考資料
- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Andrej Karpathy, *A Recipe for Training Neural Networks*：[karpathy.github.io](https://karpathy.github.io/2019/04/25/recipe/)
- Google, *Rules of Machine Learning: Best Practices for ML Engineering*：[developers.google.com](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Slav Ivanov, *37 Reasons why your neural network is not working*：[blog.slavv.com](https://blog.slavv.com/37-reasons-why-your-neural-network-is-not-working-TPwyE4xazNO)

