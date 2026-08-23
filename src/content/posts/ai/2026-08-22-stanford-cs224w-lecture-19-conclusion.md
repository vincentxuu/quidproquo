---
title: "Stanford CS224W 第 19 講：315K 個 GNN designs 如何用 anchor models 排名"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: zh-TW
series:
  name: "Stanford CS224W 導讀"
  order: 20
tldr: "Fall 2025 Conclusion deck 在 32 個 tasks 上研究約 315K 個 GNN designs：先跑少量 anchor models，以 ranking 描述 task similarity，再從相似 task 轉移 best designs。"
description: "Stanford CS224W Fall 2025 第 19 講：anchor-model ranking、task similarity、model transfer，以及如何用少量實驗縮小 GNN design space。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs224w-lecture-19-conclusion-en)

這是 Stanford **CS224W: Machine Learning with Graphs（Fall 2025）第 19 講**，官方日期 2025-12-04。本文依[課程 schedule](https://web.stanford.edu/class/cs224w/)與[第 19 講 Conclusion 官方投影片](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)整理；講者以投影片署名為準。

## 材料與缺口

公開材料包含官方投影片與 schedule 的 optional readings。Canvas 錄影、現場 Q&A、板書與 Ed 討論不公開，本文不推測；2021 公開影片不作為 2025 講次證據。

## 本講完整 agenda

### 這堂結論真正問什麼

[第 19 講官方投影片](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)把問題鎖定在 GNN model selection：官方 design space 有[約 315K 個 designs](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)，實驗涵蓋[32 個 tasks](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)。不同 task 的最佳 design 不同，因此不能靠一張固定排行榜選模型。

### 第一步：在 small dataset 隨機跑 100 個 designs

官方流程先在一個 small dataset 上[隨機取 100 個 designs](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)並實際訓練，取得 performance spectrum。這不是用模型預測未評估 designs 的排名，而是用一批已評估 designs 建立 anchor selection 的母體。

### 第二步：沿 performance spectrum 均勻選 12 個 anchors

接著不是任意挑 architecture family，而是沿前述 performance spectrum [均勻選出 12 個 anchor models](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)。均勻涵蓋好、中、差表現，讓 anchors 對 task 的反應保有辨識度；若全挑最好的或彼此太像的 models，task fingerprints 會缺少跨度。

### 第三步：用 anchor ranking 表示 task

對每個 task 跑同一組 12 anchors，再看它們的相對 ranking。Anchor ranking 就是 task 的 behavior-based representation：它不靠 dataset 名稱或人工 metadata 猜相似，而是看同一批 GNN designs 在 tasks 上如何排序。

### 第四步：以 ranking similarity 找相似 task

兩個 tasks 的 anchor rankings 越相似，就被視為越相似。[Task similarity 由 anchor-model rankings 決定](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)，不是由「都是 citation graph」或「都是 node classification」直接指定。這一步只使用實際跑過的 anchors。

### 第五步：從相似 task 轉移 best designs

找到相似 source task 後，官方流程把 source 上表現最好的 designs 轉移到 target task，再於 target 上實際評估。這裡沒有「預測所有未跑 designs 的完整 ranking」或 top-k ranking predictor；核心是從相似 task 移植已知 best designs。

### Controlled random search 方法

Deck 先介紹 controlled random search（CRS）這個較早的 design-space 搜尋方法，再進入以 anchors 描述 task similarity、從相似 task 轉移 best designs 的流程。CRS 屬於方法脈絡；下方 OGB 的 0.771 則明確標成 Previous SOTA，不能把兩者合併成同一個數字標籤。

### OGB benchmark 結果

在官方 OGB 案例中，從相似 task 轉移 best design 得到[0.785](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)，相較於投影片標示的 [Previous SOTA 0.771](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)。若從不相似 task 轉移，結果降到[0.736](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)。三個數字共同支持的是「task similarity 影響 transfer」，不是 anchor 方法無條件保證更好；0.771 也不是 CRS 的分數。

### 這些數字怎麼讀

0.785 對 Previous SOTA 0.771 是官方 OGB 結果比較；0.736 則是 dissimilar-task transfer 的負對照，顯示 source task 選擇會顯著改變結果。若把 0.771 說成 CRS，或只引用最好數字而漏掉 dissimilar transfer，都會寫錯 deck 的證據結構。

### 315K 與 32 的界線

315K 是官方 design space 規模，32 是研究的 task 數；本文沒有重跑全部組合，也不把這些數字擴張成 production guarantee。它們說明 model selection 的搜尋空間與跨 task evidence 規模。

### 一個忠實的最小重現

先定義一個 small design pool，隨機評估 100 個 designs；按 performance 均勻挑 12 anchors；在多個 tasks 跑這 12 個；以 anchor ranking similarity 選 source task；把 source best designs 移到 target，並另存 similar-task 與 dissimilar-task transfer 結果。

### 必須保存的 artifacts

重現時保存 100 個 sampled designs、各自 performance、12 anchors 的選取位置、每個 task 的 anchor ranking、task similarity、source best designs，以及 similar-task 與 dissimilar-task target results。少任何一項，都無法判斷結果是否真的來自 task similarity。

### 最後帶走的工作流

第 19 講的結論很窄也很實用：先用 small-dataset performance spectrum 選 12 anchors，用 anchor rankings 找相似 tasks，再把相似 task 的 best designs 轉移過來。它不是 universal ranking predictor，而是一個受 evaluation budget 約束的 model-transfer procedure。

## 參考資料

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 19 official slides](https://web.stanford.edu/class/cs224w/slides/19-conclusion.pdf)
