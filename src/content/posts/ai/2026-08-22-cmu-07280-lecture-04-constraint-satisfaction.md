---
title: "CMU 07-280 Lecture 4 導讀：CSP、AC-3 與搜尋順序"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, constraint-satisfaction, csp, search]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 4
tldr: "Lecture 4 利用 variables、domains、constraints 暴露問題結構，再把 DFS 升級成 backtracking、forward checking、AC-3、MRV 與 LCV；重點是更早證明某些選擇不可能成功。"
description: "完整導讀 CMU 07-280 Spring 2026 Constraint Satisfaction Problems：CSP formulation、backtracking、forward checking、arc consistency、AC-3、MRV 與 LCV。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-04-constraint-satisfaction-en)

這是 **CMU 07-280 Spring 2026 Lecture 4：Constraint Satisfaction Problems**。CSP 仍是搜尋，但它不把 state 當成黑盒。Variables、domains 與 constraints 直接暴露結構，讓演算法在完成整份 assignment 之前就能刪掉不可能的值。

## 官方材料與讀取範圍

本文完整讀取 [inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec4_CSPs_inked.pdf)、官方[backtracking demo](https://www.cs.cmu.edu/~07280/demos/csp_backtracking/)、[Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf)與[solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf)，並核對 [HW2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf)。沒有公開逐講錄影；demo 展示演算法狀態，不提供講者口述。

## 承上問題：能否不用走完整條錯路才知道失敗

一般 search 只要定義 successor 與 goal test，就能把 partial assignment 當 state 一路展開。問題是，若每個變數都有 `d` 個值、共有 `n` 個變數，葉節點最多有 `d^n` 種 assignment。等到全填完才檢查 constraints，會浪費大量明知互斥的分支。

CSP 的形式是三件事：變數集合 `X={X1,...,Xn}`、每個變數的 domain `Di`、以及允許共同取值的 constraints。Map coloring、N-Queens、Sudoku 都能用同一語言表示，差別只在圖結構與限制類型。

## 完整概念脈絡：從 backtracking 到 propagation

**Backtracking search**是加入兩個改良的 DFS：每次只指派一個尚未指派的變數，而且一違反 constraint 就立刻退回。因為 assignment 的順序不影響最終解，它避免把同一組值的不同排列當成不同路徑。

**Forward checking**在指派 `Xi=vi` 後，從相鄰未指派變數的 domains 刪除與它衝突的值。如果任何 domain 變空，就立刻 backtrack。它只看新指派直接影響的 arcs。

**Arc consistency**更進一步：對 directed arc `Xi → Xj`，`Di` 中每個值都必須在 `Dj` 找到至少一個相容值。AC-3 用 queue 反覆 revise arcs；一旦 `Di` 被縮小，就把可能受影響的鄰接 arcs 放回 queue。投影片給單次 AC-3 的上界 `O(n²d³)`，但完整 backtracking 中會多次呼叫它。

最後是 ordering：**MRV**先選 domain 最小的變數，讓失敗早點出現；**LCV**先試刪除鄰居選項最少的值，盡量保留後路。前者是 fail-fast，後者是 least-constraining。

## 可重做的小例子：三個區域如何被 AC-3 推完

令三個相連區域 `A-B-C` 使用 `{R,G}`，constraint 是相鄰不同色，另有 unary constraint `A=R`。

```text
DA={R}, DB={R,G}, DC={R,G}
```

處理 arc `B→A` 時，`B=R` 在 `A` 找不到不同色支援，因此刪掉 R，得到 `DB={G}`。因為 B 改變，再處理 `C→B`；`C=G` 沒有支援，刪掉後 `DC={R}`。未展開任何 search branch，constraints 已把唯一解傳播出來。

這也顯示 arc 的方向性：`B→A` 是檢查 B 的每個值能否被 A 支援；`A→B` 檢查的是另一個 domain，兩者都要考慮。

## Recitation／HW 對應

Recitation 2 後半先把飛機排程寫成 variables、domains、unary／binary constraints，再畫 constraint graph、執行 AC-3 與 backtracking。第二個 magic-square 問題則顯示 higher-order `alldiff` 與二元圖並不完全等價；為了畫圖而忽略一個 constraint，不代表原問題沒有它。

Worksheet 最後直接比較 MRV、LCV 與不同 ordering 的 backtracking 次數。HW2 programming 則把 CSP 與前半的 games 放進同一份 search-and-games 作業。公開 tree 足以自行實作，正式測試與 Gradescope feedback 不公開。

## 延伸對照：propagation 不是完整求解器

Arc consistency 能提早偵測很多矛盾，但不能保證找到解，也不能保證 arc-consistent 的 CSP 一定有 global solution。局部每條 edge 都有相容支援，仍可能在環狀或 higher-order constraints 上共同衝突。因此 AC-3 通常嵌在 backtracking 裡：propagation 負責縮 domains，search 負責處理剩餘選擇。

這種「推論縮小空間，搜尋處理歧義」的組合，之後會再次出現在 MCTS 與學習模型的整合。

## 今晚可以做的動作

1. 用三色重做澳洲地圖 CSP：列 variables、domains 與每條 binary constraint。
2. 對一條三節點鏈手跑 AC-3，逐步寫 queue 與被刪除的值。
3. 打開官方 demo，對同一題分別選 forward checking 與 AC-3，記錄何時第一次發現 dead end。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 4 — CSPs, inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec4_CSPs_inked.pdf)
- [07-280 CSP backtracking demo](https://www.cs.cmu.edu/~07280/demos/csp_backtracking/)
- [07-280 Spring 2026 Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf)
- [Recitation 2 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf)
- [07-280 Spring 2026 Homework 2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf)
