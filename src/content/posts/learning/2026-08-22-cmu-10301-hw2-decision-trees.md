---
title: "CMU 10-301 HW2：從資訊量手算到完整 Decision Tree"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, decision-tree, information-theory]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "HW2 要先用 entropy 與 mutual information 手算切分，再完成建樹、預測與評估的端到端分類器。"
description: "CMU 10-301/601 Spring 2026 HW2 Decision Trees 的作業設計與校外測試方法。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 2 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw2-decision-trees-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw2.zip) 完整題名是 **Homework 2: Decision Trees**，屬於 written＋programming。Written 包含 function approximation、decision-tree calculations、pseudocode 與 empirical questions；程式分成 `inspection.py` 的 entropy／majority-error 檢查，以及 `decision_tree.py` 的建樹、預測、評估與文字樹輸出。ZIP 提供 `decision_tree.py` starter、heart／purchase／small datasets，以及 small depth-3 的 labels、metrics、inspection reference output。

## 作業為什麼這樣排

手算迫使你看見「選哪個 feature」的依據，程式則暴露停止條件、tie-breaking 與深度限制。真正的模型不是一個公式，而是一組必須一致的決策。先用 small dataset 畫樹，再讓程式輸出同一棵；兩者不同時，不要先調參數。

## 第一個可執行動作與完成判準

先依 [handout 指令](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw2.zip) 建立並跑 inspection：

```bash
python inspection.py small_train.tsv small_inspect.txt
```

完成判準是 `small_inspect.txt` 與公開 reference 一致，且 depth-3 tree 的 train/test labels、metrics 與文字樹可重現；再用完美可分、全同特徵與同分 feature 三組自造資料驗證停止與 tie-breaking。Gradescope 仍會使用未公開資料。

## 參考資料
- [HW2 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw2.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
