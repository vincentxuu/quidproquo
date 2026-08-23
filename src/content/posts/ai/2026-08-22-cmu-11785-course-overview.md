---
title: "CMU 11-785 深度學習完整課程導讀：28 講能看，作業鏈卻不完整公開"
date: 2026-08-22
category: ai
tags: [cmu, deep-learning, neural-networks, course-guide]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "CMU 11-785 Spring 2026 的 28 講內容都有官方 slides 與 YouTube，另有大量公開 bootcamp／recitation；但 HW1–4 的核心規格、starter 與評測依賴 Autolab、Piazza 和 Kaggle。"
description: "鎖定 CMU 11-785 Spring 2026，整理講次、作業公開邊界、先修、算力取捨與可執行的校外自學路線。"
draft: false
series:
  name: "CMU 11-785 深度學習完整課程導讀"
  order: 0
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-11785-course-overview-en)

[CMU 11-785 Introduction to Deep Learning Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)是一門從神經網路表示能力一路走到 Boltzmann machine 的研究所課程。官方課表有一場 logistics 與 **28 講正式內容**；每講都連到投影片、YouTube 與 MediaServices，另有一大批 Python、NumPy、PyTorch、資料處理與模型實作的 bootcamp／recitation。

它看起來像一門完整公開課，實際上有一道清楚的邊界：講授鏈很完整，正式作業鏈不完整。本文與後續系列鎖定 Spring 2026，不混用 Fall 2025 或 Fall 2026；只在公開證據足夠的範圍還原課程。

## 版本判決：Spring 2026 是 latest-complete

Spring 2026 是目前最新完成、而且 28 講 slides 與官方錄影能逐一對上的版本。[官方 lecture table](https://deeplearning.cs.cmu.edu/S26/pages/tables/lectures_table.html)的相對網址偶爾省略 `./` 或含空白，因此系列保存實測後的完整路徑，不靠文章端猜網址。

Fall 2025 仍可作歷史備援；Fall 2026 在本文查證時是新學期入口，不能取代一個已完成版本。所謂 canonical edition，只代表這個系列固定用哪一學期對齊日期、題序與教材，不代表其他版本品質較差。

## 28 講分成六段

| 段落 | 講次 | 能力主線 |
|---|---:|---|
| 神經網路地基 | 1–8 | 表示能力、ERM、梯度下降、反向傳播、收斂、最佳化與正則化 |
| 卷積網路 | 9–12 | 卷積結構與 CNN 設計 |
| 序列模型 | 13–17 | RNN、Seq2Seq、CTC、beam search、語言模型與翻譯 |
| Attention 與 LLM | 18–20 | attention、Transformer、新架構與大型語言模型 |
| 生成與表示學習 | 21–25 | autoencoder、VAE、diffusion、GAN 與 GNN |
| 聯想記憶與決策 | 26–28 | RL、Hopfield network、Boltzmann machine |

這不是把現代熱門模型排成播放清單。前八講花很大篇幅建立「網路能表示什麼」與「訓練為什麼有效或失效」的地基；CNN 與序列模型又各自形成長段落。若只跳看 LLM、diffusion，會略過這門課用來解釋訓練與表示的共同語言。

## 作業 audit：公開標題不等於可重做

[官方 assignment table](https://deeplearning.cs.cmu.edu/S26/pages/tables/assignments_table.html)公開四份 homework；HW1–HW4 各分為 Part 1 與 Part 2，並列出期限與課內平台連結。

核心連結指向 CMU Autolab 與 Piazza；[官方 syllabus](https://deeplearning.cs.cmu.edu/S26/pages/syllabus.html)另說明 homework 包含 Autolab component 與 Kaggle component。沒有登入時，讀者拿不到一套經官方確認、同版本完整的 handout、starter、必要 data、測試與回饋。因此本系列不寫成完整作業解答，也不宣稱能重建正式 grader。

公開的 [recitation／bootcamp table](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html)是另一條線。它提供不少 notebook、slides、影片與部分資料，足以練 NumPy、PyTorch、data loader、loss、模型存取與 workflow；這些材料能補實作，但不是 HW starter 的替身。

## 開始前需要什麼

課程不是把 Python 當教學主題。開始前至少應能：

- 用 NumPy 操作矩陣，讀懂 shape 與 broadcasting。
- 對向量／矩陣函數求導，理解 chain rule。
- 使用機率、期望值與基本統計語言。
- 以 PyTorch 寫出 dataset、model、loss 與 training loop。

若第四項還不穩，先做公開 bootcamp 的 PyTorch、dataset 與 dataloader notebook。今晚可以用一個很小的 gate：不看範例，寫一個兩層 MLP 在隨機資料上完成 forward、loss、backward 與 optimizer step；任何一步說不清 tensor shape，就先補該步。

## 校外路線：把講授與實作拆成兩條清單

每週安排兩個區塊：先看一講影片並對照 slides，隔天從 recitation 選一個對應 notebook 重做。影片筆記只回答「概念與推導是什麼」；實作筆記記錄 shape、數值穩定性、訓練曲線與失敗案例。不要把看完影片當作完成實作。

正式 homework 缺件時，可做一個縮小但誠實的替代：例如讀完 backpropagation 後，用 NumPy 寫一層 affine＋activation 的 forward/backward，拿 finite differences 做 gradient check。這能驗證概念，卻不冒充 HW1P1。

算力同樣分開處理。課程文件會提到 PSC、cloud 與 Kaggle，但校外讀者不擁有 CMU 配額或助教支援。前八講與小型 CNN／RNN 練習可以先用 CPU 或免費 notebook runtime；大型語音、臉部驗證與生成模型訓練必須另估資料與 GPU 成本。

## 系列怎麼讀

後續逐講文章各自鎖定官方日期、slides 與 YouTube，依原 agenda 展開，不虛構課堂問答。Course Logistics 併在本文；orders 1–28 對應 28 講內容。每篇的實作只重做可由公開材料支持的小例子，作業平台缺口會留在明示的限制欄。

第一批先完成 Lectures 1–4，檢查三件事：是否完整覆蓋官方 agenda、推導是否真的重算、以及校外練習能否在沒有 Autolab 的情況自我檢查。通過內容 review 後才繼續量產。

## 參考資料

- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [Spring 2026 lecture table](https://deeplearning.cs.cmu.edu/S26/pages/tables/lectures_table.html)
- [Spring 2026 recitations and bootcamps](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html)
- [Spring 2026 assignments](https://deeplearning.cs.cmu.edu/S26/pages/tables/assignments_table.html)
- [Spring 2026 syllabus](https://deeplearning.cs.cmu.edu/S26/pages/syllabus.html)
