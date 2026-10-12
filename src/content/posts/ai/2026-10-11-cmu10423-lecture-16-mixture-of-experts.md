---
title: "Mixture of Experts：總容量與啟用計算如何分開｜CMU 10-423 第 16 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 24
draft: false
description: "以完整數值例子與變式答案理解Mixture of Experts：總容量與啟用計算如何分開。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 一個 token 不必使用所有專家

Mixture of Experts（MoE）常把 dense Transformer 的部分 feed-forward 層換成多個 expert，router 為每個 token 選少數專家。它讓總參數容量增加，而每個 token 的啟用計算仍受限制。需要理解[Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)與[scaling](/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws)。本篇要能算一次 top-2 routing，區分 total、active 與負載。

[Switch Transformer](https://arxiv.org/abs/2101.03961)是 top-1 路線的代表；其他設計可以 top-2 或更多。每個 expert 通常是可訓練網路，router 由輸入 hidden state 產生分數。專家不是事先各自貼上「數學」「英文」標籤；是否形成可解釋分工是觀察問題。

## 四專家的自擬例子

有四個 expert，每個包含 100 萬參數，共享部分 200 萬。總參數為 600 萬。若每個 token 使用 top-2，概念上的 active 參數為共享 200 萬加兩專家 200 萬，共 400 萬；不同 token 可啟用不同專家，所以整個 batch 不一定只用兩個 expert。Active 參數也不是精確 FLOPs，router、通訊與共享 attention 仍有成本。

某 token 的 router 機率為 [0.5,0.3,0.15,0.05]，選 expert 1 與 2。若實作對所選權重重新正規化，就得到 [0.625,0.375]。假定兩專家的一個輸出座標為 2 與 −2，加權輸出為 0.625·2+0.375·(−2)=0.5。若不重新正規化，輸出為 0.4；兩者不同，因此範例必須交代 gating 慣例，不能寫 top-2 就假設公式唯一。

## 為何負載是模型的一部分

自擬四 token 都把 expert 1 與 2 排前兩名，expert 3 與 4 沒收到 token。這時有 8 個 token-expert 指派，分布是 [4,4,0,0]。容量若每專家最多 2 個指派，便有四個指派超額。系統可以丟棄、重路由或採其他處理，具體要依架構；不能把某篇方法的丟棄規則當成所有 MoE。

負載平衡 loss 或 router 正則化鼓勵專家使用更均衡，避免少數專家過忙、其他專家沒學到。它不保證每個 batch 完美平均，也不保證專家語意分工更好。主任務 loss 與負載目標可能拉扯，需同時監看模型品質、指派數、overflow 與通訊時間。

## 放到多 GPU 後增加什麼成本

Expert parallelism 把不同專家放在不同 GPU；token 要按路由搬到專家，再把結果搬回。稀疏啟用減少每 token 的專家計算，但 all-to-all 資料移動與跨卡負載可能吃掉節省。模型所有權重仍需存放，不能因 active 參數少就認為總模型能裝進同樣小的顯存。

Dense 與 MoE 比較應分開列總參數、啟用 FLOPs、資料量、實際 wall time 與品質。只說「大模型速度像小模型」會漏掉硬體與 batch 條件。單 token 延遲、吞吐與訓練成本也不是同一個指標。

## 變式練習與答案

改成 top-1，上例啟用參數概念值為 300 萬，總數仍 600 萬。若四個 token 各自選一個不同 expert，top-1 的負載為 [1,1,1,1]；若全選第一個就是 [4,0,0,0]。一樣的 active count 不代表一樣的實際效率。若新增第五個 expert 而不改 top-k，每 token 的 expert 數不變，總儲存與 router 卻會增加。下一篇[分散式訓練](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training)追梯度與狀態如何跨卡。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 16 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf)
- [Primary paper](https://arxiv.org/abs/2101.03961)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
