---
title: "MIT 6.S191 Lab 2：從 MNIST 到 DB-VAE 臉部去偏差"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 12
tldr: "2026 Part 1 用 dense network 與 CNN 辨識 MNIST；Part 2 以 DB-VAE 學習臉部 latent distribution，再調整訓練取樣。"
description: "MIT 6.S191 2026 Lab 2 雙語實作指南：執行順序、完成成果、帳號與服務限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-lab2-debiasing-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

[MIT 6.S191 官方 2026 repo](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab2) 的 Lab 2 是 **Lab 2：從 MNIST 到 DB-VAE 臉部去偏差**。Part 1 用 dense network 與 CNN 辨識 MNIST；Part 2 以 DB-VAE 學習臉部 latent distribution，再調整訓練取樣。本文固定使用 2026 branch，避免 master 後續更新造成內容漂移。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對：公開頁只列講次錄影，沒有列出本篇對應的專屬錄影（lab 由官方 GitHub notebook提供）。

課程與錄影入口：

- [mit-6s191 — official course materials and recording index](https://introtodeeplearning.com/)

查核日期：2026-10-10。

## 開始前

[官方 2026 README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)指定 Google Colab、Python 3 與 GPU runtime。先複製 notebook 到自己的 Drive，再從頭執行；API key 放在 notebook 的秘密管理介面，不要寫進可分享的 cell 或提交到 Git。

## 建議完成順序

1. 用 Part 1 確認 convolution 的輸出 shape 與訓練迴圈
2. 記錄 baseline detector 的整體結果與失敗樣本
3. 完成 DB-VAE 後用相同案例比較，不把單一 metric 當公平性結論

每次只解一個 TODO。先寫下預期輸入／輸出 shape，再執行 cell；出錯時保存錯誤訊息與修正理由。公開 solution 適合最後核對，不適合一開始照抄。


預期輸出包含 MNIST 模型結果、baseline 臉部偵測結果，以及 DB-VAE 重新取樣後可直接對照的同一組案例。常見失敗包括把影像 channel 維度排錯，以及只看總 accuracy、沒有保留模型失敗的臉部樣本。

## 完成標準

至少留下 notebook 副本、一次可重現的完整執行，以及一段短結論：模型做對了什麼、失敗在哪裡、下一次要改哪個變因。服務儀表板截圖不能取代模型輸出與實驗記錄。

## 限制

這是課堂實驗，不是已證明適用所有人口群體的公平性修補。資料、量測方式與部署情境仍需另行稽核。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方公開頁，仍只列講次錄影，沒有本篇對應的專屬錄影；狀態改為「已查核：官方公開頁未列對應錄影」。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [官方 2026 Lab 2 程式與 notebooks](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab2)
- [官方 repository README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
