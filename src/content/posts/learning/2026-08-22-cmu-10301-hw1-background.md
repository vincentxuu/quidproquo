---
title: "先用數學與 Python 找出機器學習地基缺口｜CMU 10-301 作業 1"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, python, linear-algebra]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "HW1 是 written＋programming 作業：用機率、微積分、線代與 CS 題組檢查地基，再實作 majority-vote classifier。"
description: "導讀 CMU 10-301/601 Spring 2026 HW1 Background Material 的能力目標、公開資產與校外自評方式。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 1 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw1-background-en)

[官方 ZIP 內的 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip) 完整題名是 **Homework 1: Background**，屬於 written＋programming。Written 題組包括 course policies、probability and statistics、linear algebra、calculus、geometry 與 CS foundations；程式部件則是 majority-vote classifier，要讀取 TSV、輸出 train/test labels 與 error metrics。ZIP 內有 heart／education 的 train/test data、LaTeX template 與兩組 reference output；沒有 `majority_vote.py` starter，hidden grader 仍在 Gradescope。

## 真正要建立的能力

重點不是背矩陣公式，而是把符號落到陣列形狀、迴圈與命令列輸出。每做完一題，寫下輸入、輸出與維度；程式則先以極小資料手算預期值，再對官方 example output。若答案不同，先分辨是數學、索引還是格式錯誤。

## 第一個可執行動作

解開 ZIP、自己建立 `majority_vote.py` 後，先照 [handout 內的官方介面](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip) 跑：

```bash
python majority_vote.py heart_train.tsv heart_test.tsv heart_train_labels.txt heart_test_labels.txt heart_metrics.txt
```

再測欄位順序與全同標籤的小資料。完成判準是：能說明主要數學題的每個 shape，且 heart 與 education 的 labels／metrics 都逐行符合 ZIP 內 reference output；這不等於通過未公開 hidden tests。

## 先手算一個 majority-vote classifier

以下是自編小資料，不是官方測資。訓練標籤是 `1, 0, 1, 1`：`1` 出現三次、`0` 一次，因此不看特徵，所有預測都輸出 `1`。訓練集四筆中錯一筆，error 是 `1/4=0.25`。

測試標籤是 `0, 0, 1`。繼續使用從訓練集得到的 majority `1`，測試預測是 `1, 1, 1`，錯兩筆，error 是 `2/3`。不能重新在測試集選 majority，否則已用測試答案改了分類器。

**檢查：** 把測試標籤換成 `1, 1, 0, 1`，預測與 error 是什麼？答案是四個 `1`，error `1/4=0.25`。這裡刻意避免訓練標籤平手；平手規則、欄位與輸出格式須依官方 handout，不由這個例子代訂。

## 更新紀錄

- 2026-10-11：補上自編教學例子、推理結果與理解檢查答案。

## 參考資料
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
- [HW1 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip)
