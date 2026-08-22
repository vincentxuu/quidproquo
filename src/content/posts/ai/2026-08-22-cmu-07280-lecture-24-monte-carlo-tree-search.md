---
title: "CMU 07-280 Lecture 24：Monte Carlo Tree Search 如何接上 AlphaZero"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, monte-carlo-tree-search, alphazero, reinforcement-learning]
lang: zh-TW
tldr: "Spring 2026 Lecture 24 是 MCTS，不是 Fall 2026 的 LLM post-training；本講以 selection、expansion、rollout、backup 與 UCB 分配模擬，再由 policy/value heads 與 self-play 接到 AlphaZero。"
description: "逐段導讀 CMU 07-280 Spring 2026 Lecture 24：MCTS 四階段、UCB exploration、neural-guided tree policy、self-play 與 AlphaZero 作業脈絡。"
draft: false
series:
  name: "CMU 07-280 完整課程導讀"
  order: 24
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-24-monte-carlo-tree-search-en)

**CMU 07-280 Spring 2026 Lecture 24** 是 **Monte Carlo Tree Search（MCTS）**。現行 Fall 2026 首頁另外顯示 LLM Post Training，但那不是本系列鎖定的 Spring canonical lecture。這一講把前面的 adversarial search、sampling、Q estimates、deep networks 與 self-play 組成 Building AlphaZero 的收束。

## 官方材料與讀取範圍

Spring 2026 Lecture 24 `MCTS` slides 與 pptx 直鏈在 2026-08-22 回傳 404，因此本文不宣稱讀過該講投影片。核心來源是 [Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf)、[Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf) 與[解答](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)，再以[官方課程首頁](https://www.cs.cmu.edu/~07280/)的 S26 filename 與 assignment metadata 核對版本。

官方頁沒有 Spring 2026 逐講公開錄影；HW12 Building AlphaZero 的 PDF／zip 直鏈在查核日也失效。本文只能詳細導讀仍公開的 recitation pipeline，不把缺失材料補成想像的課堂內容。

## 承上問題：完整 game tree 太大，純 Q-network 又沒有 lookahead

Minimax 系統性展開 game tree，但 branching factor 與 depth 很快讓樹不可計算。Flat Monte Carlo search 不展開完整樹：對 root actions 各做隨機 rollouts，以平均 outcome 選 action。它能利用模擬，卻沒有把預算集中到有希望的深層 branches。

MCTS 在兩者之間建立一棵不對稱的 partial tree。每次 simulation 有四個階段：

1. **selection**：沿 tree policy 選 child；
2. **expansion**：遇到尚未展開的 action 時新增 node；
3. **rollout／evaluation**：從新 node 模擬到結果，或用 value model 評估；
4. **backup**：把 outcome 沿路更新 visit counts 與 values。

重複後，較有希望或較不確定的 branches 得到更多 simulation budget。

## 完整概念脈絡：UCB 平衡 exploitation 與 exploration

Recitation 14 使用的 UCB heuristic 是：

\[
UCB(s)=\frac{totalScore(s)}{count(s)}
+c\sqrt{\frac{\ln N}{count(s)}}.
\]

第一項是目前平均 outcome，偏向 exploitation；第二項在 child visits 少時較大，鼓勵 exploration。`N` 是 parent／總 simulations，`c` 控制探索強度。沒有 exploration bonus，初期幸運的 branch 可能壟斷後續預算。

Two-player zero-sum game 的 backup 還要處理視角。Recitation 的 candy game 提醒每層玩家交替；若 outcome 始終以「輪到走的玩家」表示，沿 tree 往回時 sign 要交替。沒有統一 value perspective，是 MCTS 實作最常見的靜默錯誤之一。

Recitation 13 的 FlatMCSearch 只做 rollout 與 backup，沒有 selection／expansion。這個對照很重要：隨機模擬不自動等於 MCTS；是否維護 tree statistics 並以它分配下一次 simulation，才是差異。

## 可重做小例子：兩個 actions 的 UCB

假設 root 已跑 `N=20` 次 simulations，兩個 child 統計是：

```text
A: totalScore = 8, count = 10
B: totalScore = 3, count = 2
c = sqrt(2)
```

則：

\[
UCB(A)=0.8+\sqrt{2}\sqrt{\frac{\ln20}{10}}
\approx0.8+0.774=1.574,
\]

\[
UCB(B)=1.5+\sqrt{2}\sqrt{\frac{\ln20}{2}}
\approx1.5+1.731=3.231.
\]

即使 `B` 只觀察兩次，它的平均 outcome 高、uncertainty bonus 也大，因此下一次先選 B。若後續大量 visits 顯示 B 其實普通，exploration term 會隨 `count(B)` 增加而衰減，選擇逐漸由 empirical value 主導。

## Recitation／HW 對應：從 MCTS 到 AlphaZero

Recitation 14 把 neural guidance 寫成：

\[
a_t=\arg\max_a\left[
Q(s_t,a)+c\frac{\sqrt{N(s_t)}}{1+N(s_t,a)}
\pi_\theta(a\mid s_t)
\right].
\]

Policy head `π_θ(a|s)` 提供 action prior，讓早期 search 優先嘗試 network 認為有希望的 moves；visit count 增加後 prior bonus 衰減，選擇更多依賴 search 得到的 `Q`。Value head 估計 state outcome，可取代大量盲目 rollout。

Self-play 產生 tuples `(s_t,π_t,z_t)`：state、MCTS 改善後的 search policy、以及最終 game outcome。Network 從這些資料學 policy 與 value，更新後再產生新 self-play data，形成迴圈：

```text
network priors/value -> MCTS -> improved policy -> self-play data
          ^                                      |
          |--------------- training -------------|
```

HW12 的官方 assignment table 將這段命名為 Building AlphaZero，但本體直鏈失效，正式 notebook、tests 與評分無法匿名核對。因此可以重做 recitation 演算法，不能宣稱拿到完整 HW12 體驗。

## 延伸對照：MCTS 不是把所有 branches 都找完

Minimax 在固定 depth 系統性比較；MCTS 在 simulation budget 下估計。它的答案取決於 rollout/evaluation quality、tree policy、budget 與 stochastic variance。Neural-guided MCTS 又把 network bias 帶進 exploration；search 能修正先驗，不代表每次都能消除錯誤。

Spring 2026 以 MCTS 結束，正好把整門課的兩條線接起來：前半的 search 決定如何配置計算，後半的 ML 決定如何從 data 學 policy/value。AlphaZero 不是單一神經網路名稱，而是 search、learning 與 data generation 的閉合系統。

## 今晚可做動作

實作「11 顆糖、每次拿 1 或 2 顆」遊戲。先做 FlatMCSearch，再加入 node visits、mean value、UCB selection、expansion 與 alternating-sign backup。固定 random seed，比較 10、100、1,000 simulations 時 root policy。最後加入一個刻意偏錯的 prior，觀察多少 simulations 後 search 能否修正它。

## 參考資料

- [CMU 07-280 Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf)
- [CMU 07-280 Recitation 13 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf)
- [CMU 07-280 Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)
- [CMU 07-280 Recitation 14 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
