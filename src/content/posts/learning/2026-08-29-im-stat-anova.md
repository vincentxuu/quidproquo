---
title: "多組平均不能一直 t-test：ANOVA 在保護什麼？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 13
tldr: "ANOVA 先檢查三組以上平均是否有整體差異，避免你用一堆兩兩 t 檢定把 false positive 風險一路放大。"
description: "ANOVA 入門：從多組平均比較、組間與組內變異、F 統計量，到多模型版本與 prompt 實驗的統計判讀。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-anova-en)

三組以上平均數比較時，直覺做法很容易變成一連串兩兩 t 檢定：A 對 B、A 對 C、B 對 C。三組還算少，五組就有十組比較。每一次檢定都有犯第一型錯誤的風險，檢定越做越多，整體誤判的機會也跟著升高。

ANOVA 的第一個任務，是先問整體問題：這些組別的母體平均數是否可以視為全部相同？如果整體沒有足夠證據顯示差異，就不要急著宣稱哪兩組不同。如果整體顯著，後面才進一步做 post-hoc comparison，處理哪些組之間有差。

## ANOVA 在比兩種變異

ANOVA 的核心直覺很樸素：如果不同組的平均差很多，而每組內部的個體差異不大，那組別很可能真的有影響。反過來，如果組平均看起來有差，但同一組內部本來就很散，這個差距可能只是雜訊。

所以它把總變異拆成兩塊：

```text
總變異 = 組間變異 + 組內變異
```

組間變異看的是各組平均離總平均多遠。組內變異看的是同一組內，每個觀察值離該組平均多遠。

F 統計量把兩者相除：

```text
F = MS_between / MS_within
```

`MS_between` 是組間平均平方，`MS_within` 是組內平均平方。F 越大，代表組間差異相對於組內雜訊越大。ANOVA 的 H0 通常是：

```text
H0: mu1 = mu2 = mu3 = ... = muk
```

對立假設則是至少有一個組別平均不同。

## 手算例題：三個版本的平均分數

假設有三個模型版本 A、B、C，各自用 4 批測試資料得到分數：

| 版本 | 分數 |
| --- | --- |
| A | 8, 9, 7, 8 |
| B | 10, 11, 9, 10 |
| C | 6, 7, 5, 6 |

各組平均是：

```text
A 平均 = 8
B 平均 = 10
C 平均 = 6
總平均 = 8
```

先算組間平方和。每組有 4 筆，所以：

```text
SS_between = 4(8 - 8)^2 + 4(10 - 8)^2 + 4(6 - 8)^2
           = 0 + 16 + 16
           = 32
```

組間自由度是：

```text
df_between = k - 1 = 3 - 1 = 2
MS_between = 32 / 2 = 16
```

再算組內平方和。A 組相對於平均 8 的平方差是 `0 + 1 + 1 + 0 = 2`；B 組也是 2；C 組也是 2，所以：

```text
SS_within = 2 + 2 + 2 = 6
df_within = N - k = 12 - 3 = 9
MS_within = 6 / 9 ≈ 0.667
```

F 統計量：

```text
F = 16 / 0.667 ≈ 24
```

接著查 F 分配或用軟體算 p 值。這個 F 很大，代表三個版本的平均分數差異遠大於同版本內部波動。結論可以寫：「資料提供統計證據顯示三個版本的母體平均分數並非全都相同。」

這句話還沒有告訴你 B 是否顯著高於 A，或 A 是否顯著高於 C。ANOVA 的整體檢定只回答「是否至少有一組不同」。要回答哪幾組不同，需要後續比較，而且要處理多重比較風險。

## 題型怎麼辨識

看到三組以上平均數比較，就先想 ANOVA。題目如果出現 treatment、group、between groups、within groups、F statistic、ANOVA table，也是在提示同一套語言。

如果 outcome 是類別次數，不是數值平均，通常不會用 ANOVA，而會回到卡方。若只有兩組平均，比起 ANOVA，兩樣本 t 檢定通常更直接。真正麻煩的是題目先給三組以上，後面又問哪兩組不同；這時要先做整體檢定，再談 post-hoc。

## 這在 ML / AI 哪裡會用到

多模型比較很常遇到 ANOVA 的問題。假設你同時比較三個 embedding model、四個 prompt template、五種 reranker 設定，每個設定都在多批資料上得到平均分數。直接挑最高分，很容易把測試波動當成模型能力。

ANOVA 可以先回答「版本之間是否有整體差異」。如果整體差異明顯，再進一步比較哪些版本值得保留。這在 prompt 實驗也有用：你可能有 A/B/C 三種提示詞，每種在多個任務上跑分。ANOVA 會逼你把版本間差異和任務內波動分開。

產品實驗裡也一樣。三種推薦策略、三種排序規則、三種 onboarding flow，若 outcome 是平均停留時間或平均訂單金額，ANOVA 是多組平均比較的入口。不過如果資料來自同一批使用者反覆看多個版本，就要留意是否變成 repeated measures，而不是最簡單的一因子 ANOVA。

## 常見錯誤

- 三組以上就連做很多 t 檢定，沒有處理整體第一型錯誤風險。
- ANOVA 顯著後直接說「B 比 A 好」，但沒有做後續比較。
- 忘記 F 是組間變異相對於組內變異的比例。
- outcome 是類別次數卻誤用 ANOVA。
- 多模型實驗只看最高平均分，沒有估計實驗波動。

## 練習題

1. 寫出三組平均比較的 H0 與 H1，注意 H1 不需要列出哪一組不同。
2. 用「組間變異」和「組內變異」解釋為什麼 F 大時會傾向拒絕 H0。
3. 三組各 5 筆資料，請寫出 `df_between` 與 `df_within`。
4. 設計一個三種 prompt template 的模型評估題，說明什麼時候需要 post-hoc comparison。

## 下一篇怎麼接

ANOVA 比較多組平均，背後仍然是在估計與檢定。下一篇會回到更基本的問題：我們用樣本計算出來的規則，怎麼判斷它是不是一個好的估計量？

## 章節級參考對照

- OpenIntro / OpenStax：ANOVA、F 統計量、組間與組內變異。
- Stanford CS109：多組比較與 uncertainty 下的決策語境。
- scikit-learn：多模型版本比較與 evaluation 設計。

## 參考資料

- [ANOVA in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: F Distribution and ANOVA](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
