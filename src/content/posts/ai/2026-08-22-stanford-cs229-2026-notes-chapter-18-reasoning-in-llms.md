---
title: "LLM 推理：思維鏈與長推理 RLVR"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, llm-reasoning, chain-of-thought, rlvr, ppo]
lang: zh-TW
tldr: "第 18 章把 LLM 推理拆成兩個槓桿：推論時用思維鏈增加計算，訓練時用可驗證獎勵與 policy gradient 學出長推理行為。"
description: "導讀 CS229 2026 主講義第 18 章：思維鏈為何增加推論時計算，以及 RLVR、PPO、GRPO 與 CISPO 如何學習長推理。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 19
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-18-reasoning-in-llms-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 18 章（印刷頁 220–225）。這是 2026 notes 的逐章導讀，不是某學期錄影重建；本文解釋主要目標與演算法直覺，不聲稱重現每項證明或實作細節。

## 思維鏈把一次預測拆成一段計算

直接回答只建模 \(p(a\mid x)\)；思維鏈先生成中間序列 \(z\)，再生成答案 \(a\)：

\[
p(a,z\mid x)=p(z\mid x)p(a\mid x,z).
\]

多出的 token 可承載中間結果，等同在推論時投入更多序列計算與可讀寫的工作空間。few-shot CoT 用示範提供推理格式；zero-shot 提示則要求模型逐步思考。這些技巧可能改善可分解的任務，但「輸出更長」本身不等於推理更正確。

## 把生成看成有限期 MDP

RLVR（reinforcement learning with verifiable rewards）只需驗證最終答案，例如數學答案、程式測試或格式規則，不必為每一步 reasoning trace 標註正解。對 prompt \(x\)，狀態是目前前綴 \((x,y_{<t})\)，動作是下一 token，轉移是把 token 接到前綴，終點才得到獎勵 \(R(x,y)\)。

基本目標為

\[
J_R(\theta)=\mathbb{E}_{y\sim\pi_\theta(\cdot\mid x)}[R(x,y)].
\]

實務上常加入對參考策略的 KL 懲罰：

\[
J_\beta(\theta)=J_R(\theta)-\beta\,\mathbb{E}[D_{KL}(\pi_\theta\|\pi_{ref})],
\]

用 \(\beta\) 控制策略為追逐獎勵而偏離原模型的程度。

## 從 policy gradient 到 PPO、GRPO、CISPO

序列 policy gradient 的骨架是

\[
\sum_t (R-b_t)\nabla_\theta\log\pi_\theta(y_t\mid x,y_{<t}),
\]

只要 baseline \(b_t\) 不依賴當下抽到的 token（可依賴 prompt、prefix／state 或獨立的組內統計），它就不改變理想期望方向，卻能降低估計變異。PPO 用新舊策略的 token 機率比，並裁切過大的更新，避免同一批樣本把策略推太遠。

GRPO 對同一 prompt 採樣一組回答，用組內平均與標準差形成相對優勢，因此不必另訓練 critic。CISPO 則裁切 importance coefficient，但保留直接的 log-probability 梯度路徑。這些變體共同面對的問題是：怎麼從昂貴、稀疏且高變異的終點訊號得到穩定更新。

## 假設與失效點

- 可驗證終點只證明答案通過檢查，不證明中間推理忠實或有效。
- 模型可能鑽 reward、格式或 verifier 的漏洞。
- 稀疏獎勵使 credit assignment 困難；更多 token 也可能只是冗長。
- on-policy 採樣昂貴，重用舊資料又會帶來分布偏移。
- KL 與 clipping 是更新約束，不是安全性或真實性的保證。

## 與相鄰章節的銜接

第 17 章建立 autoregressive Transformer 與 SFT；本章把它改寫成序列決策問題。第 19 章會回到一般 MDP、價值函數與動態規劃，補齊 policy gradient 背後的強化學習語言。

## 練習

為「產生能通過單元測試的函式」定義 RLVR：列出狀態、動作、終止條件、獎勵與 KL 參考策略。再提出兩種 reward hacking 情境，並說明僅增加測試數量為何未必完全解決。

## 參考資料

- [CS229 Lecture Notes 第 18 章：LLM 推理、思維鏈與 RLVR（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=221)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)
