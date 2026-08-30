---
title: "Nonparametric methods 少做哪些分布假設？彈性又要付出什麼代價？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 42
tldr: "Nonparametric methods 少做哪些分布假設？彈性又要付出什麼代價？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 42 篇：Nonparametric methods 少做哪些分布假設？彈性又要付出什麼代價？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-nonparametric-methods-en)

很多人第一次聽到 nonparametric methods，會以為意思是「沒有參數」。這個理解太直。更好的說法是：模型或檢定不把資料先鎖進少數固定參數描述的分布裡。

例如 t 檢定常搭配平均數、變異數、常態近似；線性模型先指定線性關係。Nonparametric methods 通常少做這些特定分布或函數形式假設，改用排序、重排、經驗分布、鄰近點或樹狀切分。

## 少假設換來什麼

Nonparametric methods 的優點是彈性。當資料明顯偏態、有 outlier、樣本數不大，或你只想比較大小排序而不想強假設常態時，rank-based method 會很有用。

代價也很明確。少做模型假設，通常需要更多資料才能達到同樣精準度；解釋常依賴程序本身；模型太彈性時也更容易 overfit。

所以 nonparametric 不是「比較高級」或「比較保守」的固定答案。它是在假設、效率、可解釋性和泛化之間換位置。

## rank-based test 在做什麼

如果你不想相信原始數值的常態假設，可以改看排序。

以兩組比較為例。t 檢定比較平均數差異；Wilcoxon rank-sum / Mann-Whitney 類方法則把所有觀察值排在一起，看兩組的 rank 是否系統性偏高或偏低。

這在資料偏態或 outlier 很強時很有吸引力。因為極端值不會用原始大小直接主導結果，而是轉成排序位置。

但 rank test 回答的問題和平均數 t 檢定不完全相同。你不能做完 rank test 後，又用平均差的語言解釋得太滿。

## permutation test 在做什麼

Permutation test 從虛無假設出發。如果兩組其實沒有差異，group label 應該可以交換。你反覆打亂 label，每次重算統計量，形成一個「沒有差異時可能看到的差距分布」。

流程是：

```text
observed statistic
-> shuffle labels many times
-> recompute statistic each time
-> compare observed statistic with permutation distribution
```

這種方法很直覺，尤其適合教你理解 p-value：p-value 是看虛無假設下，像觀察值這麼極端的結果有多常出現。

## 手算例題：用 rank 比較兩組

假設有兩組小樣本：

```text
A: 3, 4, 100
B: 5, 6, 7
```

如果比較平均數，A 的平均會被 100 拉高：

```text
mean(A) = 107 / 3 ≈ 35.7
mean(B) = 18 / 3 = 6
```

但把六個數排序：

```text
3(A), 4(A), 5(B), 6(B), 7(B), 100(A)
```

rank 是：

```text
A ranks: 1, 2, 6
B ranks: 3, 4, 5
```

A 的 rank sum：

```text
1 + 2 + 6 = 9
```

B 的 rank sum：

```text
3 + 4 + 5 = 12
```

這個例子提醒你：rank-based method 對極端值的反應和平均數方法不同。它不會讓 100 的大小直接支配結果，只把它當成最大的一筆。

## nonparametric 在建模裡的意思

在建模裡，nonparametric 常指模型複雜度可以隨資料增加，而不是被固定少數參數限制住。

kNN 是直覺例子。它不先估一組固定係數，而是保留訓練資料，預測時看附近鄰居。

Decision tree 也有這種精神。它透過資料切分形成規則，樹越深越能貼資料，但也越容易 overfit。

Kernel density estimate 則用每個資料點附近的小波形疊出分布形狀，不需要先假設整體是常態。

這些方法彈性高，通常更需要 validation、剪枝、平滑參數、鄰居數或其他複雜度控制。

## 題型怎麼辨識

看到資料偏態、outlier、小樣本，且題目暗示不想強假設常態，可以想到 rank-based tests。

看到「shuffle labels」「randomly permute」「exchangeability」，通常是在考 permutation test。

看到 empirical distribution、KDE、nearest neighbor、tree，通常是在談用資料本身形狀做估計或預測。

看到 nonparametric，請不要寫成完全沒有假設。它少做特定分布假設，但仍可能需要獨立性、exchangeability、平滑性或足夠資料。

## 這在 ML / AI 哪裡會用到

kNN、tree-based models、random forest、kernel methods 都有 nonparametric 或 flexible modeling 的味道。它們能捕捉非線性、交互作用和局部結構，比線性模型更彈性。

彈性也代表風險。kNN 的 `k` 太小，容易記住訓練資料；tree 太深，會把噪音切成規則；kernel bandwidth 太小，密度估計會變得鋸齒狀。

在 LLM 評估裡，permutation test 很適合 paired comparison。你可以在同一批題目上比較模型 A 和 B，隨機翻轉每題差距的符號，建立「兩模型無差異」時的差距分布。這比假裝每個模型分數獨立更貼近實驗設計。

## 常見錯誤

- 把 nonparametric 解釋成沒有任何參數或沒有任何假設。
- 做 rank test，卻用平均數差異的語言過度解釋。
- 用 permutation test 時忘記 exchangeability；資料不能任意交換時，打亂 label 會破壞設計。
- 以為彈性模型一定泛化更好。
- 在 ML 裡用很彈性的模型，卻沒有用 validation 控制複雜度。

## 練習題

1. 說明 nonparametric 為什麼不等於完全沒有參數；它放鬆的是哪些固定分布或函數形式限制？
2. 比較 histogram、kernel density estimate、nearest-neighbor regression：各自用什麼方式貼近資料？
3. 對 `A: 3, 4, 100`、`B: 5, 6, 7` 排 rank，說明 rank-based test 如何降低極端值影響。
4. 樣本很少時，nonparametric method 可能遇到什麼問題？
5. 在 ML 裡，kNN 或 tree-based model 為什麼可以被看成 flexible baseline？同時有什麼泛化風險？

## 下一篇怎麼接

Nonparametric methods 放鬆模型假設，但仍需要資料生成方式合理。下一篇會進到 experimental design：在你分析資料以前，實驗怎麼分組、隨機化、定義 outcome，已經決定後面能不能做可信推論。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐分布、估計與資料摘要的基礎，讓 nonparametric 方法有對照組。
- Stanford CS109 支撐以資料鄰近性、抽樣與模擬理解彈性模型。
- scikit-learn 支撐 kNN、tree-based models 與模型評估；本文把 nonparametric 思維接到 flexible baseline。

## 參考資料

- [Nonparametric methods、rank tests、permutation tests、KDE、kNN 與 tree-based models：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
