---
title: "基礎模型概覽：線性探測、微調與 LoRA"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, foundation-models, fine-tuning, lora]
lang: zh-TW
tldr: "第 15 章比較線性探測、完整微調與 LoRA：差別不只在可訓練參數量，也在表徵是否移動、資料需求與記憶體成本。"
description: "導讀 CS229 2026 主講義第 15 章：從線性探測與完整微調，到持續預訓練、LP-FT 與 LoRA。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 16
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-15-foundation-models-overview-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 15 章（印刷頁 191–195）。這是依目前公開 notes 撰寫的逐章導讀，不是任何學期錄影或課表的重建；重點是掌握推導骨架與使用判斷，不逐行重現所有證明。

## 為什麼先預訓練，再適應任務

基礎模型的核心不是「一個模型直接解完所有問題」，而是先以大量資料學得可重用的參數，再用較少的任務資料做適應。若預訓練資料為 \(x_1,\dots,x_n\)，一般目標可寫成

\[
L_{\mathrm{pre}}(\theta)=\frac{1}{n}\sum_{i=1}^{n}\ell_{\mathrm{pre}}(x_i,\theta).
\]

這個式子故意很抽象：\(\theta\) 是模型參數，\(\ell_{\mathrm{pre}}\) 可以是語言模型的下一 token 損失，也可以是其他自監督目標。預訓練完成後，模型可能以零樣本或少樣本提示直接使用，也可能進一步更新參數。

## 線性探測與完整微調

把預訓練模型產生的表徵記為 \(\phi_{\hat\theta}(x)\)。線性探測固定 \(\hat\theta\)，只學一個線性頭 \(w\)：

\[
\min_w \frac{1}{m}\sum_{i=1}^{m}\ell\bigl(y_i,w^\top\phi_{\hat\theta}(x_i)\bigr).
\]

它回答的是「現成表徵是否已把任務需要的訊號線性分開？」訓練快、參數少，也適合診斷表徵。完整微調則同時更新 \(w\) 與 \(\theta\)，容量較大，但資料少時更容易扭曲原本表徵或過度貼合訓練分布。

LP-FT 先做線性探測，再以所得參數初始化完整微調。直覺上，它先把最後一層放到合理位置，再允許整個網路緩慢調整，可能減少不必要的特徵漂移。若目標領域有大量無標註資料，也可先做 continued pretraining，再進入監督式適應。

## LoRA：只學低秩更新

LoRA 固定原權重 \(W_0\)，把更新限制為 \(\Delta W=BA\)：

\[
h=W_0x+\frac{\alpha}{r}BAx,
\]

其中 \(A\in\mathbb{R}^{r\times d_{in}}\)、\(B\in\mathbb{R}^{d_{out}\times r}\)，而秩 \(r\) 遠小於輸入與輸出維度。可訓練參數從完整矩陣的 \(d_{out}d_{in}\) 降為 \(r(d_{in}+d_{out})\)。不同任務可共享 \(W_0\)，只切換小型 adapter。

重要的是：低秩的是「更新」而非最後合併後的權重。LoRA 可顯著減少梯度與最佳化器狀態，但仍要載入基礎模型；activation 記憶體與前向計算也不會自動按相同比例下降。

## 假設、限制與選擇方式

- 線性探測假設任務訊號已存在於固定表徵，而且簡單決策邊界足夠。
- 完整微調較有表達力，但成本、過擬合與遺忘風險也較高。
- LoRA 假設有效更新可由低秩子空間近似；秩太小會限制適應能力。
- continued pretraining 通常在領域資料更貼近後續任務時較有價值；若分布不相符，投入的運算未必能改善下游表現。

## 與相鄰章節的銜接

第 14 章討論如何訓練擴散生成模型；本章抽象出更通用的「預訓練—適應」框架。下一章則追問：預訓練究竟如何得到可供分類、檢索與 RAG 使用的表徵？

## 練習

假設一個權重矩陣為 \(4096\times4096\)，LoRA 秩 \(r=16\)。計算完整微調與 LoRA 的可訓練參數量及比例；接著說明為何這個比例不能直接當成推論記憶體或運算量的下降比例。

## 參考資料

- [CS229 Lecture Notes 第 15 章：基礎模型、線性探測、微調與 LoRA（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=192)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)
