---
title: "LQR、DDP 與 LQG：從線性控制到不確定性"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, lqr, ddp, lqg, kalman-filter]
lang: zh-TW
tldr: "第 20 章利用線性動態與二次目標得到可解的 LQR，再以 DDP 處理局部非線性、以 Kalman filter 與 LQG 處理不可直接觀測的狀態。"
description: "導讀 CS229 2026 主講義第 20 章：有限期動態規劃、LQR 的 Riccati 遞迴、DDP 線性化與 LQG 的 Kalman 估計。"
draft: false
series:
  name: "Stanford CS229 導讀"
  order: 21
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-20-lqr-ddp-lqg-en)

本文導讀 [CS229 2026 主講義](https://cs229.stanford.edu/main_notes.pdf)第 20 章（印刷頁 244–257）。這是 2026 notes 的逐章導讀，不是某學期錄影重建；以下說明結構化控制問題如何被求解與近似，不逐行重現 Riccati 與高斯條件分布的全部證明。

## 有限期動態規劃先從終點往回看

有限期問題允許動態、reward 與策略隨時間改變。終點價值先定義，再向後遞迴：

\[
V_T^*(s)=\max_a R_T(s,a),
\]

\[
V_t^*(s)=\max_a\left[R_t(s,a)+\mathbb{E}_{s'}V_{t+1}^*(s')\right].
\]

和無限期固定點不同，這裡只有有限個 backward steps。這個「先知道下一步價值，再決定目前動作」的形式，是 LQR 可解析求解的入口。

## LQR 為何得到線性策略

LQR 假設連續狀態與動作、線性動態，以及二次 reward：

\[
s_{t+1}=A_ts_t+B_ta_t+w_t,
\]

\[
R_t(s_t,a_t)=-s_t^\top U_ts_t-a_t^\top W_ta_t.
\]

噪音 \(w_t\) 為零平均高斯，\(U_t,W_t\) 對偏離目標與控制幅度施加代價。若下一步價值是二次型，把它代入 Bellman backup，對 \(a_t\) 最佳化後仍得到二次價值；最佳動作因此是狀態的線性函數 \(a_t^*=L_ts_t\)。係數可透過離散 Riccati 遞迴由終點往前計算。

講義特別指出：在這組假設下，最佳 gain \(L_t\) 不依賴零平均 process noise 的 covariance；噪音會改變期望價值的常數項，卻不改變最佳線性控制器。這是結構性結論，不表示一般控制問題都能忽略噪音。

## DDP：沿軌跡反覆解局部 LQR

非線性動態 \(s_{t+1}=F(s_t,a_t)\) 可在名義點 \((\bar s_t,\bar a_t)\) 做一階 Taylor 展開；reward 則做二階展開。加入常數維度後，局部問題可整理成線性動態與二次 reward。

Differential Dynamic Programming 的循環是：先產生名義軌跡、沿每個時間點線性化與二次化、用 backward LQR 得到新控制器，再用真實非線性 \(F\) rollout 新軌跡，直到停止。若新軌跡離展開點太遠，局部近似就會失效。講義明確提到 reward shaping；實作上也常用步長或 regularization 控制更新範圍，後兩者是實務補充。

## LQG：看不見狀態時先估計

部分可觀測時，系統多一個 observation model：

\[
y_t=Cs_t+v_t,\qquad s_{t+1}=As_t+Ba_t+w_t.
\]

Kalman filter 維護高斯 belief 的平均 \(s_{t|t}\) 與 covariance \(\Sigma_{t|t}\)。predict step 先用動態推進 belief；update step 再以新觀測的 innovation 修正平均：

\[
s_{t+1|t+1}=s_{t+1|t}+K_t(y_{t+1}-Cs_{t+1|t}),
\]

其中 Kalman gain \(K_t\) 由預測 covariance 與 sensor noise 決定。LQG 最後用 LQR gain 控制估計狀態：\(a_t=L_ts_{t|t}\)。這就是在線性、高斯、二次設定下的估計與控制分離。

## 假設與失效點

- LQR 的解析結構依賴線性動態、二次目標與合適的矩陣條件。
- 「控制器不依賴噪音 covariance」只適用於此 LQR 設定。
- DDP 是局部方法，名義軌跡差或更新過大都可能使線性化失真。
- Kalman filter 假設模型與噪音描述可信；嚴重非線性、非高斯或模型偏差會破壞 belief 品質。
- LQG 的 separation principle 不是任意 POMDP 的通則。

## 與相鄰章節的銜接

第 19 章提出一般 MDP 與連續狀態近似；本章利用額外結構得到可計算的控制律。第 21 章改走 model-free 路線：不先學轉移模型，而直接從採樣軌跡估計策略梯度。

## 練習

考慮一維系統 \(s_{t+1}=s_t+a_t+w_t\)，代價為 \(s_t^2+0.1a_t^2\)。先說明為何最佳動作應與 \(s_t\) 成正比且方向相反；再加入觀測 \(y_t=s_t+v_t\)，畫出 Kalman predict、update 與 LQR action 的資料流。

## 參考資料

- [CS229 Lecture Notes 第 20 章：LQR、DDP、LQG 與 Kalman filter（2026-08-18）](https://cs229.stanford.edu/main_notes.pdf#page=245)
- [Stanford CS229 官方課程頁](https://cs229.stanford.edu/)
