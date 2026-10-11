---
title: "MIT 6.S191 Lab 1：用 PyTorch 與 LSTM 生成音樂"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: zh-TW
series:
  name: "MIT 6.S191 導讀"
  order: 11
tldr: "2026 先完成 PyTorch tensor、autograd 與 module 基礎，再把 ABC 樂譜切成字元序列，訓練 LSTM 逐字生成音樂。"
description: "MIT 6.S191 2026 Lab 1 雙語實作指南：執行順序、完成成果、帳號與服務限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-mit-6s191-lab1-music-generation-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

[MIT 6.S191 官方 2026 repo](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab1) 的 Lab 1 是 **Lab 1：用 PyTorch 與 LSTM 生成音樂**。先完成 PyTorch tensor、autograd 與 module 基礎，再把 ABC 樂譜切成字元序列，訓練 LSTM 逐字生成音樂。本文固定使用 2026 branch，避免 master 後續更新造成內容漂移。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對：公開頁只列講次錄影，沒有列出本篇對應的專屬錄影（lab 由官方 GitHub notebook提供）。

課程與錄影入口：

- [mit-6s191 — official course materials and recording index](https://introtodeeplearning.com/)

查核日期：2026-10-10。

## 開始前

[官方 2026 README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)指定 Google Colab、Python 3 與 GPU runtime。先複製 notebook 到自己的 Drive，再從頭執行；API key 放在 notebook 的秘密管理介面，不要寫進可分享的 cell 或提交到 Git。

## 建議完成順序

1. 先跑 Part 1 的 TODO，確認 tensor shape 與 gradient
2. 在 Part 2 建 vocabulary、batch 與 sequence model
3. 保存 loss 曲線與一段生成的 ABC／音訊作為成果

每次只解一個 TODO。先寫下預期輸入／輸出 shape，再執行 cell；出錯時保存錯誤訊息與修正理由。公開 solution 適合最後核對，不適合一開始照抄。


預期輸出是一條隨訓練整體下降的 loss 曲線，以及一段可解析的 ABC 樂譜或轉出的音訊。常見失敗包括序列 batch 的 input／target 位移錯一格，以及生成時 tensor device 不一致。

## 完成標準

至少留下 notebook 副本、一次可重現的完整執行，以及一段短結論：模型做對了什麼、失敗在哪裡、下一次要改哪個變因。服務儀表板截圖不能取代模型輸出與實驗記錄。

## 限制

[官方 notebook](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/lab1/PT_Part2_Music_Generation.ipynb)使用 Google Colab GPU，也會要求 Comet API key；校外讀者可以學完核心 TODO，但競賽與 MIT 回饋不可預期。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方公開頁，仍只列講次錄影，沒有本篇對應的專屬錄影；狀態改為「已查核：官方公開頁未列對應錄影」。

## 參考資料

- [MIT 6.S191 2026 課程官網](https://introtodeeplearning.com/)
- [官方 2026 Lab 1 程式與 notebooks](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab1)
- [官方 repository README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)
- 站內：[MIT 6.S191 完整導讀](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning)
