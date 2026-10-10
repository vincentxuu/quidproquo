---
title: "Harvard CS181 HW6（二）：HMM 與 Kalman Filter"
date: 2026-09-29
category: tech
tags: [harvard, cs181, hidden-markov-model, kalman-filter, markov-model, homework]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 12
type: guide
tldr: "HW6 Problem 1（15 分）把課堂上的離散 HMM 換成連續狀態：狀態每步加一點高斯雜訊、觀測再加一點雜訊，要你推出 filtering 分布 p(zₜ | x₀…xₜ) 的均值與變異數。這就是一維 Kalman filter。解法只有兩步：先用轉移「預測」，再用觀測「修正」，兩個高斯恆等式題目都給了。"
description: "Harvard CS1810 Spring 2026 HW6 Problem 1 導讀：從 Lecture 20 與 Section 9 的 forward-backward 出發，說明離散 HMM 的 filtering 怎麼變成一維 Kalman filter，逐小題拆解預測與修正兩步、常見卡點，以及做完後可以練的 section 題目。"
draft: false
glossary:
  - term: "filtering"
    aliases: ["濾波", "filtration"]
    definition: "只用到目前為止的觀測，推估現在的隱藏狀態，也就是 p(zₜ | x₁…xₜ)。跟 smoothing 不同，smoothing 會用整條序列（包含未來）的觀測。"
    context: "HW6 Problem 1 要推的就是連續狀態下的 filtering 分布。"
  - term: "Kalman filter"
    aliases: ["卡爾曼濾波"]
    definition: "狀態與觀測都是線性加高斯雜訊時的 HMM filtering。因為高斯乘高斯、高斯卷積高斯都還是高斯，每一步只要更新一組均值與變異數。"
    context: "HW6 Problem 1 處理的是一維、狀態轉移為恆等的特例。"
---

> 🌏 [English version](/en/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW6](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6)（`hw6_release.tex/pdf/ipynb`，due 2026-05-01）、[Section 9 講義](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf)與 [2026 Lecture 20 HMM 投影片](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view)為準，全部於 2026-09-29 實際打開。講課投影片的 Google Drive 連結藏在[官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)的講題儲存格裡，CSV 匯出看不到，匯出成 xlsx 才讀得到。本課整體為 **A3**，但沒有當期錄影、沒有作業解答，Gradescope 需要選課。2026 投影片與 Section 9 都**沒有提到 Kalman filter**，連續狀態的部分只出現在作業本身。

這是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)的第 12 篇。上一篇 [HW6（一）](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding)講自迴歸模型：直接對觀測序列建模。這篇換另一種看序列的角度：觀測背後有一個看不到的狀態在走。

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [harvard-cs181 — official course materials and recording index](https://harvard-ml-courses.github.io/cs181-web/syllabus)

## HW6 在學期裡的位置

依 [2026 官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)，Week 11 週二（4 月 7 日）講 Autoregressive Models、週四（4 月 9 日）講 Hidden Markov Models；下週二的 Section 9 是「Autoregressive Models and HMMs」。HW6 在 4 月 17 日發布，課表上的標註是「AR, HMMS, MDPs, RL」，5 月 1 日截止。

[HW6 題目](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex)標題是「Sequential Models and Decision Making」，共五題。題號順序跟講課順序不同，本系列依講課順序拆成四篇：

| 篇 | 對應題目 | 配分 |
|---|---|---|
| [HW6（一）](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding) | Problem 4 Autoregressive Models | 20 |
| 本篇 | Problem 1 Hidden Markov Models | 15 |
| [HW6（三）](/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning) | Problem 2 Policy and Value Iteration | 15 |
| [HW6（四）](/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics) | Problem 3 Reinforcement Learning、Problem 5 Embedded Ethics | 20＋10 |

## 題目在問什麼：看不到狀態，只看得到雜訊

Problem 1 的模型只有兩行。隱藏狀態每一步加上一個高斯雜訊，觀測則是狀態再加上另一個高斯雜訊：

```text
z_{t+1} = z_t + ε_t      ε_t ~ N(0, σ_ε²)
x_t     = z_t + γ_t      γ_t ~ N(0, σ_γ²)
z_0 ~ N(μ_p, σ_p²)
```

想像一個在直線上隨機漂移的東西，你手上只有一台不太準的感測器。每一刻你拿到的 `x_t` 都不是真正的位置 `z_t`，但你想知道它「現在大概在哪、有多確定」。題目要你推出的就是這個答案：`p(z_t | x_0, …, x_t)` 是一個常態分布，求它的均值 `μ_t` 與變異數 `σ_t²`。

題目把這個模型叫做一維 Kalman filter，也就是**連續狀態的 HMM**。

## 從離散 HMM 出發：換掉的是「加總」

[Lecture 20](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view) 與 [Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) 講的是離散 HMM：狀態有 K 種，用轉移矩陣與發射矩陣描述。兩份教材都用同一組動態規劃：

- **forward message** `α_t(z_t) = p(x_1…x_t, z_t)`：看過前 t 個觀測、而且現在在狀態 `z_t` 的機率。遞迴是「先對上一步所有狀態加權加總轉移，再乘上這一步的發射機率」。
- **backward message** `β_t(z_t) = p(x_{t+1}…x_T | z_t)`：如果現在在 `z_t`，未來的觀測有多吻合。
- Section 9 的清單寫明：filtering 正比於 `α_t`，smoothing 正比於 `α_t · β_t`。

Kalman filter 做的事完全一樣，只是狀態變成實數：

| | 離散 HMM（課堂） | 一維 Kalman（HW6 P1） |
|---|---|---|
| 狀態 | K 種之一 | 實數 |
| 轉移 | 矩陣 `T[i][j]` | `N(z_t; z_{t-1}, σ_ε²)` |
| 發射 | 矩陣 `π[k][l]` | `N(x_t; z_t, σ_γ²)` |
| 對上一步狀態 | 加總 Σ | 積分 ∫ |
| 每一步要存的東西 | K 個數 | 均值與變異數兩個數 |

最後一列是整題的重點：高斯經過這兩種運算後還是高斯，所以不管走了幾步，信念都只要兩個數就能描述。

## 逐小題拆解

### (a) 跟 α、β 的關係

題目問 `p(z_t | x_0…x_t)` 跟 forward-backward 的 `α_t`、`β_t` 有什麼關係，這個運算叫什麼。直接回去看 Section 9 的推論清單。提示一點：條件只到 `x_t`，沒有用到未來的觀測，想想 `β` 在這裡還需不需要。

### (b)–(d) 預測，再修正

題目已經把拆法寫好：

```text
p(z_t | x_0…x_t) ∝ p(x_t | z_t) · p(z_t | x_0…x_{t-1})
                    └─ 修正 ─┘   └──── 預測 ────┘
```

- **(b)** 是發射模型本身，從第二行模型直接讀出。
- **(c)** 是預測步：已知上一步的信念 `N(μ_{t-1}, σ_{t-1}²)`，先乘上轉移、再把 `z_{t-1}` 積分掉。題目的 Hint 2 就是「兩個高斯的卷積」公式，套進去即可。直覺上，隨機漂移一步之後，均值不會動，但不確定性會變大。
- **(d)** 是修正步：把 (b) 和 (c) 相乘。Hint 1 叫你把 `N(x_t; z_t, σ_γ²)` 改寫成 `N(z_t; x_t, σ_γ²)`，這樣兩個因子都變成 `z_t` 的高斯，就能套 Hint 2 的「兩個高斯相乘」公式。

<details>
<summary>機制：Hint 2 的乘積公式在說什麼</summary>

題目給的恆等式是：

```text
N(x; μ_a, σ_a²) · N(x; μ_b, σ_b²)
  ∝ N(x;  σ_b²/(σ_a²+σ_b²) · μ_a + σ_a²/(σ_a²+σ_b²) · μ_b,
          (1/σ_a² + 1/σ_b²)^(-1) )
```

讀法有兩個：

1. 新的均值是兩個均值的加權平均，權重跟**對方**的變異數成正比。哪一邊的變異數小（比較確定），哪一邊的權重就大。
2. 新的變異數是兩個精確度（變異數的倒數）相加再取倒數，所以一定比兩者都小。兩個資訊來源合在一起，只會更確定。

在 (d) 裡，一個高斯來自預測步，另一個來自這一刻的觀測。把 (c) 的結果代成其中一個、把改寫後的發射代成另一個，就得到 `μ_t` 與 `σ_t²`。
</details>

### (2) 用一兩句話詮釋 μ_t

題目要你說明 `μ_t` 怎麼把「過去的觀測」和「現在的觀測」混在一起。可以從兩個極端去想：感測器幾乎沒有雜訊時（`σ_γ²` 很小），`μ_t` 會靠近誰？感測器很吵、而狀態幾乎不動時，又會靠近誰？再想想，過去所有的觀測是透過哪一個量進到 `μ_t` 裡的。

## 常見卡點

- **時間索引不同**：作業從 `z_0, x_0` 開始，Section 9 從 `z_1, x_1` 開始，2026 投影片兩種都出現。對照公式時先統一。
- **圖裡有 μ_ε 和 μ_γ**：題目的圖模型畫了 `μ_ε`、`μ_γ` 兩個參數節點，但文字定義裡兩個雜訊的均值都是 0。推導時照文字定義走。
- **N(·) 的第二個參數是變異數**：兩條 hint 都寫成 `N(x; μ, σ²)`。把標準差當成變異數代進去，答案會差一個平方。
- **(d) 的比例符號**：乘積公式只到「正比於」。你要回報的是常態分布的均值和變異數，不需要算出正規化常數。

## 做完之後可以練什麼

- [Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) Exercise 3.3：給定天氣 HMM 的參數，用 Viterbi 找最可能的狀態路徑。解答在 [sec09_soln.pdf](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf)。
- Section 9 Exercise 3.2：狀態有觀測到時，怎麼用計數估 HMM 參數（M-step 的特例）。
- [Lecture 20 投影片](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view)最後的 Concept Check：健康／輕症／重症三狀態的病程 HMM。
- 想看原典，課程 [Resources 頁](https://harvard-ml-courses.github.io/cs181-web/resources)列了 [Rabiner 1989 的 HMM tutorial](https://www.cs.ubc.ca/~murphyk/Bayes/rabiner.pdf)。

2024 學期的 [Lecture 19 scribe notes](https://harvard-ml-courses.github.io/cs181-web/static/lec19/19-scribe-notes.pdf)（標頭日期 4/4/24）也講 HMM 與 forward-backward，可以當補充。那是 2024 年的筆記，不是 2026 的講義。

## 延伸閱讀

站內從不同角度講同一批概念，不取代本篇：

- [LQR、DDP 與 LQG：從線性控制到不確定性](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-20-lqr-ddp-lqg)（CS229 講義，多維 Kalman filter 在控制裡的角色）
- [CS221 Lecture 14：Bayesian Networks III：從計數、平滑到 EM](/posts/ai/2026-08-22-stanford-cs221-lecture-14-bayes-learning-em)

## 下一篇

HMM 裡的狀態只是被動地演化。下一篇 [HW6（三）：MDP 的 Policy Iteration 與 Value Iteration](/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning) 讓 agent 選擇動作，狀態轉移開始取決於你做了什麼。2026 的 [Lecture 21 投影片](https://drive.google.com/file/d/1RGWONNePmR07McdS_6H-vy_QWPSVevKG/view)就是用這個對比開場的：HMM 的 `p(z_{t+1} | z_t)` 變成 MDP 的 `p(s_{t+1} | s_t, a_t)`。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS1810 Spring 2026 HW6 題目（hw6_release.tex）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex)
- [CS1810 Spring 2026 HW6 資料夾（PDF、notebook）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6)
- [CS1810 2026 官方課表（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS1810 2026 Lecture 20：Hidden Markov Models 投影片（04/09/2026）](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view)
- [Section 9：Autoregressive Models and Hidden Markov Models](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf)（[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf)）
- [CS181 2024 Lecture 19 scribe notes（HMM）](https://harvard-ml-courses.github.io/cs181-web/static/lec19/19-scribe-notes.pdf)
- [CS181 Resources 頁](https://harvard-ml-courses.github.io/cs181-web/resources)
- [Rabiner, 1989. A Tutorial on Hidden Markov Models and Selected Applications in Speech Recognition](https://www.cs.ubc.ca/~murphyk/Bayes/rabiner.pdf)
