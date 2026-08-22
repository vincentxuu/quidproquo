---
title: "CMU 07-280 Lecture 3 導讀：Minimax、Alpha-Beta 與 Expectimax"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, adversarial-search, minimax, game-playing]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 3
tldr: "Lecture 3 把單一路徑改成 contingent plan：minimax 對抗最佳對手，alpha-beta 在不改 root value 下跳過無關分支，expectimax 則用機率取代最壞情況。"
description: "完整導讀 CMU 07-280 Spring 2026 Adversarial Search：game tree、minimax、depth-limited evaluation、alpha-beta pruning、expectimax 與作業對應。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-03-adversarial-search-en)

這是 **CMU 07-280 Spring 2026 Lecture 3：Adversarial Search**。上一講在固定世界裡找一條路。這一講的下一個狀態會被對手或隨機事件改變，所以答案不再是一條 action sequence，而是一套「看到什麼就怎麼回應」的 contingent plan。

## 官方材料與讀取範圍

本文完整讀取 [inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec3_Adversarial_Search_inked.pdf)、[Adversarial Search staff notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Adversarial_Search.pdf)、[Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf)與[solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf)，並核對 [HW2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf)。沒有公開錄影；本文不會把投影片上的棋局與 demo 寫成未記錄的課堂口述。

## 承上問題：當 transition 不是你說了算

A* 假設執行 action 後，transition model 告訴你下一個 state。遊戲則輪流由不同 agent 選 action。MAX 想讓 utility 變大，MIN 想讓它變小；若世界是隨機的，chance node 依機率分布產生結果。

所以演算法要評估的是策略，不只是路徑。MAX 的選擇必須考慮 MIN 之後會怎麼反制，正如開棋不能只看自己下一步的分數。

## 完整概念脈絡：三種 backup rule

**Minimax**對 terminal utility 由下往上 backup：MAX node 取 children 最大值，MIN node 取最小值。它假設零和、雙方都最佳，root value 是對手全力阻止時仍能保住的結果。若 branching factor 是 `b`、深度是 `m`，完整走訪的時間是 `O(b^m)`，因此現實遊戲必須限制 horizon，改用 evaluation function 估非終局 state。

**Alpha-beta pruning**保留兩個界線：`α` 是 MAX 目前保證得到的最好值，`β` 是 MIN 目前保證壓到的最好值。當某分支已不可能改變祖先的選擇，就停止展開。它不改 minimax root value；好的 move ordering 只讓更多分支提早變成無關。

**Expectimax**把 chance node 的 backup 改成期望值：

```text
V(s) = Σ P(s'|s,a) V(s')
```

MIN 是蓄意選最差結果，chance 是按分布抽結果，兩者不能混用。若把不完美對手硬當 MIN，策略會過度保守；若把敵手當隨機，面對真正最佳對手又會高估高風險路線。

## 可重做的小例子：同一棵樹，minimax 與 expectimax 不同

MAX 有兩個 action：

```text
Safe  -> [4, 4]
Risky -> [0, 10]
```

若下一層是 MIN，`Safe` 的值是 4，`Risky` 是 0，因此 minimax 選 Safe。若下一層是等機率 chance node，兩者期望值分別是 4 與 5，因此 expectimax 選 Risky。

現在看 alpha-beta。先完整評估 Safe 得到 root `α=4`。進入 Risky 的 MIN node，第一個 child 就得到 0，此時 `β=0 ≤ α=4`，剩下的 10 不必看：MIN 已能把 Risky 壓到不超過 0，MAX 絕不會放棄值 4 的 Safe。

## Recitation／HW 對應

Recitation 2 第一題要求由左到右標出 alpha、beta 與 pruned branches，接著用 true／false 比較 minimax 與 expectimax 的值和策略。它逼你分清「期望較高」與「最壞情況保證」不是同一宣稱。

HW2 把 pruning 放進 iterative deepening：先完成淺層搜尋，再用前一輪資訊改善下一輪 move ordering。作業也問：alpha-beta 保證相同 root value，是否保證回傳與完整 minimax 相同的 move？答案要處理並列最佳的情況，此時 tie-breaking 仍可能不同。Programming 部分的 search-and-games tree 可公開讀取。正式 grader 與提交回饋不公開。

## 延伸對照：evaluation function 是壓縮過的未來

Depth limit 不是只把計算砍短。它把「真正走到 terminal 的 utility」換成「現在看起來有多好」的 evaluation function。若 evaluation 排序錯了，搜尋更深通常有幫助，卻不是形式上永遠單調變好；投影片也提到 horizon effect 與更深搜尋品質不變或反常的情況。

這與 Lecture 1 的表示問題相同：evaluation function 是把龐大未來壓成一個數字。你保留哪些訊號，決定搜尋會偏向什麼局面。

## 今晚可以做的動作

1. 先不剪枝，替 Recitation 2 第一棵樹算完整 minimax value。
2. 再依相同順序標 `α`、`β`，每剪一枝寫一句「它為何不可能改變祖先決策」。
3. 自建一個三 action 例子，讓 minimax 與 expectimax 分別選不同 action。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 3 — Adversarial Search, inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec3_Adversarial_Search_inked.pdf)
- [07-280 Adversarial Search staff notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Adversarial_Search.pdf)
- [07-280 Spring 2026 Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf)
- [Recitation 2 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf)
- [07-280 Spring 2026 Homework 2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf)
