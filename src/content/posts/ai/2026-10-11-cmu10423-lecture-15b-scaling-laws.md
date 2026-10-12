---
title: "Scaling laws：固定算力如何分配模型與資料｜CMU 10-423 第 15 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 23
draft: false
description: "以完整數值例子與變式答案理解Scaling laws：固定算力如何分配模型與資料。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 大模型與多資料不是同一件事

Scaling law 是在特定訓練設定中，觀察模型大小、資料量與 loss 的經驗關係。它可幫規劃實驗，不是保證每次加參數都改善所有任務。先讀[訓練目標](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)。本篇要能用固定算力比較兩個配置，並解釋為何參數量與資料品質不能只靠一條曲線下結論。

典型示意式是 L(N,D)=L∞+A/N^a+B/D^b，其中 N 是模型參數、D 是訓練 token，L∞ 是這個擬合中的不可約項。它表示增加任一資源時有遞減改善，係數由實驗估计。不同 tokenizer、資料分布、架構與優化設定會改結果，不能把某篇論文的常數直接搬到任何模型。

## 用固定預算算一次

以下係數與尺度都是自擬例子，不是 CMU 實驗或產業建議。令 N、D 用任意一致單位表示，算力近似 C=6ND，預算 C=2400，因此 ND=400。假設 L=1+4/√N+4/√D。配置甲 N=40、D=10，L≈1+0.6325+1.2649=2.8974；配置乙 N=20、D=20，L≈1+0.8944+0.8944=2.7889。乙模型較小，却因資料分配更平衡而在這個假設下 loss 較低。

把 D=400/N 代回，可看見加 N 必須減 D。對稱係數使 N=D=20 是本例最佳；真實係數與指數通常不對稱，所以不能背「模型與資料永遠相等」。C≈6ND 也是 dense Transformer 的常用粗估，不含所有 attention、通訊與實作成本；更不是每次推論的成本公式。

## Kaplan 與 Chinchilla 在比較什麼

[Kaplan 等人的研究](https://arxiv.org/abs/2001.08361)與[Chinchilla](https://arxiv.org/abs/2203.15556)都研究算力、參數與資料，但實驗設計、訓練配置與估計出的最佳分配不同。Chinchilla 強調當時一些大模型在固定訓練算力下可受益於更小模型與更多訓練 token。這是特定 empirical 結果，不等於「小模型總贏」或每個資料源都值得追加。

重複相同低品質資料，與新增多樣且相關資料不是同一個 D。資料去重、品質篩選與分布混合可能影響有效學習訊號；把資料重複輪數全部視為獨立新資訊會誤解曲線。評估集污染也可能讓 loss 或 benchmark 虛假改善，不能用 scaling 掩蓋資料問題。

## 訓練最佳不一定是服務最佳

若模型訓練一次、之後回答大量請求，推論成本會進入總成本目標。較小模型可能可多訓練一些，換取更便宜的服務；這已是另一個最佳化問題，需要預估請求量、延遲與硬體。訓練 compute-optimal 不能直接當成產品部署最划算。

做自己的小規模研究時，先固定資料與 tokenizer，選多個 N/D 點，記錄實際 FLOPs 或可靠估計、validation loss 與訓練是否收斂。至少留一些未參與擬合的點做檢查。只有兩個點可以比較配置，不能證明普遍 power law。

## 變式練習與答案

同預算取 N=10、D=40，本例 loss 與甲同為 2.8974；這來自刻意對稱的公式，不是實際模型定律。若把資料項係數提高，最佳配置會偏向更多 D，但具体值須重新算。若 benchmark 上升而乾淨 validation loss 沒變，應先查評估與資料分布，不能直接宣稱 scaling law 得到驗證。下一篇[MoE](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts)則把總容量與單 token 計算分開。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Primary paper](https://arxiv.org/abs/2203.15556)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
