---
title: "Berkeley CS288（二）：Sequence Models、Seq2Seq 與 Transformer"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, nlp, transformer, sequence-model]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "05–07 組教材把固定向量的分類器推進序列狀態、encoder-decoder，再用 attention 與 Transformer 改寫資訊路徑。"
description: "導讀 CS288 的 Sequence Models、Sequence-to-Sequence 與 Transformers，並連到 A2 的從零實作。"
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 2 }
---

> 🌏 [English version](/posts/learning/2026-08-22-berkeley-cs288-transformers-en)

[05–07 組教材](https://cal-cs288.github.io/sp26/)的主線是資訊怎麼跨位置流動。sequence model 逐步更新狀態；seq2seq 把輸入與輸出拆成 encoder／decoder；attention 讓 decoder 直接選取來源位置；Transformer 再把 recurrent path 換成 parallel attention blocks。

## 三個模型要比較的是資訊路徑

RNN 的隱狀態把過去壓進固定大小的向量，長距離訊息必須走過多次更新。seq2seq 提供輸入到輸出的結構，但固定 context 仍可能成為瓶頸。attention 建立內容導向的捷徑；Transformer 則要額外處理位置、mask、normalization 與殘差。

讀公式時，先逐一標出 tensor shape，再畫 token 到 token 的依賴圖。這比背「query、key、value」三個名詞更快發現 causal mask、head reshape 與 residual connection 寫錯的位置。

## A2 把架構拆成可以測試的元件

[Assignment 2](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf) 要求從頭實作 BPE、RMSNorm、SiLU、SwiGLU、RoPE、scaled dot-product attention、causal multi-head attention、Transformer blocks 與 LM，再補 cross-entropy、optimizer、scheduler、gradient clipping、FLOPs 與 memory estimation。[starter repository](https://github.com/zinengtang/cs288-sp26-a2) 可匿名取得。

校外讀者最值得保留的是 component tests。先用極小 tensor 驗證 shape、mask 與數值穩定，再跑 TinyStories；沒有 GPU 時縮小 layers、hidden size 與 context length，仍能驗證正確性。hidden tests 與正式 Gradescope 不公開，所以「本機 tests 通過」不能寫成「完成官方驗收」。

## 參考資料

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Assignment 2 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf)
- [Assignment 2 starter repository](https://github.com/zinengtang/cs288-sp26-a2)

