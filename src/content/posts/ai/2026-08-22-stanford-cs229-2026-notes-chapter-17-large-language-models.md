---
title: "大型語言模型：分詞、Transformer、MoE 與 SFT"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, llm, transformer, mixture-of-experts, sft]
lang: zh-TW
tldr: "第 17 章從 next-token loss 推到 Transformer、KV cache、MoE 與 SFT，說清楚 LLM 的訓練目標、架構與推論成本如何連在一起。"
description: "導讀 CS229 2026 主講義第 17 章：從 autoregressive 建模、注意力與推論效率，到 MoE、提示與 SFT。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 18
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-17-large-language-models-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 17 章（印刷頁 202–219）。這是 2026 notes 的逐章導讀，不是任何學期錄影重建；以下聚焦模型、計算與後訓練的連鎖，不逐一重做所有證明。

## 從文字到 autoregressive 機率

分詞器把文字轉成 token。字元詞彙小但序列長，整字詞彙短但容易遇到罕見詞；BPE 類 subword 方法在兩者間折衷。詞彙大小同時影響 embedding、輸出層與序列長度，因此不是純前處理細節。

語言模型用鏈式法則分解序列機率：

\[
p(x_1,\ldots,x_T)=\prod_{t=1}^{T}p(x_t\mid x_{<t}).
\]

訓練以 teacher forcing 計算每個位置的交叉熵；生成時則把上一個抽到的 token 接回輸入。temperature 改變分布尖銳度，top-k 與 top-p 截斷候選集合，但這些是推論啟發式，不會改變訓練出的機率模型。

## Transformer 的計算核心

給定隱藏狀態矩陣 \(H\)，單頭注意力先形成

\[
Q=HW_Q,\quad K=HW_K,\quad V=HW_V,
\]

再計算

\[
H_{out}=\operatorname{softmax}_{row}\left(\frac{QK^\top}{\sqrt{d_h}}+M\right)V.
\]

\(d_h\) 是 head 維度，\(M\) 是 causal mask，阻止位置偷看未來 token。多頭注意力讓不同子空間各自建立關聯，殘差、正規化與 MLP 再組成 Transformer block。主講義也區分 PreNorm、PostNorm，並提到現代 LLM 常見 RMSNorm。

## 長序列的真正成本

完整 attention 的分數矩陣對長度 \(T\) 呈平方成長。FlashAttention 透過分塊、串流 softmax 與重算減少中間矩陣記憶體，但不等於把所有注意力運算都變成線性時間。自回歸推論用 KV cache 避免反覆計算舊 token；代價是 cache 隨序列增長。

MQA/GQA 讓多個 query heads 共用較少數量的 key/value heads，因而降低 KV cache；sliding-window attention 只保留最近視窗，犧牲直接的全域連結。這些方法各自在運算、記憶體與長距離資訊間取捨。

## MoE、提示與 SFT

Mixture of Experts 用 router 為每個 token 選少數 expert。它能增加總參數容量，而不讓每個 token 都跑過全部 expert；但路由平衡、通訊與 expert 過載成為新問題。

預訓練模型可透過零樣本或 few-shot in-context examples 改變輸出行為，卻沒有更新權重。SFT 則用 prompt–completion 資料更新模型，通常只對回答 token 計算 loss。這個 loss mask 與 causal attention mask 不同：前者決定哪些位置被評分，後者決定每個位置能看見什麼。instruction tuning 混合多種任務，使模型學會遵循指令形式，而非只記住單一資料集。

## 假設與限制

- autoregressive 目標擅長預測下一 token，不直接保證事實性或任務成功。
- 分詞會改變不同語言與字串的序列成本。
- KV cache、FlashAttention、GQA 解的是不同瓶頸，不能互相當同義詞。
- MoE 提高容量，但稀疏啟用不代表部署簡單或總參數記憶體消失。
- SFT 的行為上限受示範資料品質與涵蓋範圍限制。

## 與相鄰章節的銜接

第 16 章把 embedding 用於檢索與 RAG；本章解剖提供 embedding 與生成能力的 Transformer。下一章則把生成序列視為一段可獲得終點獎勵的決策過程，討論思維鏈與 RLVR。

## 練習

對同一段 2,048-token prompt，比較「無 KV cache」與「有 KV cache」逐 token 生成時哪些張量需要重算。再畫一張表，分別寫出 FlashAttention、GQA 與 sliding window 主要節省的資源，以及各自沒有解決的瓶頸。

## 參考資料

- [CS229 Lecture Notes 第 17 章：大型語言模型、Transformer、MoE 與 SFT（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=203)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)
