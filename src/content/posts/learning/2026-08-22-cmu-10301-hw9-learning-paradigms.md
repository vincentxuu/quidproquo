---
title: "用 Ensembles、k-Means、PCA 與推薦系統收束全課｜CMU 10-301 作業 9"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, clustering, pca, recommender-systems]
lang: zh-TW
type: guide
difficulty: 深度
tldr: "最後一份 written 作業把 ensemble、clustering、representation 與 recommendation 並列，驗收你能否按問題結構選學習典範。"
description: "CMU 10-301/601 Spring 2026 HW9 Learning Paradigms 的四主題整合與結業自評。"
series: { name: "CMU 10-301 機器學習完整課程導讀", order: 9 }
---
> 🌏 [English version](/posts/learning/2026-08-22-cmu-10301-hw9-learning-paradigms-en)

[官方 handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip) 完整題名是 **Homework 9: Learning Paradigms**，也是最後一份、純 written 作業。四個主要題組依序是 PCA、k-Means、Ensemble Methods 與 Recommender Systems。ZIP 提供 PDF、LaTeX template、題目圖與少量作圖資料檔；沒有 starter code、完整 dataset 或 reference answers。

## 四個主題的共同問題

Ensemble 問如何組合多個預測器；k-means 問沒有 label 時如何以距離組群；PCA 問如何保留主要變異；推薦系統問如何利用稀疏的使用者—項目訊號。方法不同，但都要求先說清楚 objective、representation 與失敗條件。

## 第一個檢查動作與結業驗收

沒有必要的程式命令；先開啟 [ZIP 的 LaTeX template 與 figures/data](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip)，確認每張圖對應 PCA、k-means 或 recommender 題組後再計算。完成判準是能手跑 k-means assignment/update、計算二維 PCA 方向、解釋 ensemble 的 bias/variance 取捨與推薦資料的稀疏性，最後畫出全課方法選擇圖。官方未提供答案，不把自行推導寫成官方驗證。

## 手跑一次 k-means

以下是本文自編的教學例子，不是官方作業答案。

自編一維點是 0、2、8、10，初始兩個中心為 0、10。最近中心指派把 0、2 放第一群，8、10 放第二群；update 取群內平均，得到中心 1、9。再指派一次，兩群沒有改變。

**檢查與答案：** 此時平方距離總和是多少？答案 (0-1)²+(2-1)²+(8-9)²+(10-9)²=4。這是一個小例子的停止狀態，不證明任意初始化都找到全域最佳。

## 另外三個主題，也走一個小例子

以下都是本文自編的例子，不是官方解答。

**PCA：** 二維點是 `(-2,0)、(0,0)、(2,0)`，平均是 `(0,0)`。x 方向有變異，y 方向完全沒有，因此第一主成分沿 x 軸；投影到這一維保留全部變異。檢查：若三點改成 `(0,-2)、(0,0)、(0,2)`，主方向轉成 y 軸。這些點已中心化，不要把未中心化的資料直接套進相同判讀。

**Ensemble：** 三個二元分類器對同一筆資料預測 `1、0、1`，多數決得到 `1`。真實標籤若是 `0`，ensemble 仍然錯；若三個模型都犯同樣的錯，多數決不會救回來。檢查：改成 `0、0、1` 時，結果為 `0`。這只示範組合規則，不保證組合後一律改善。

**推薦資料：** 使用者 U 對項目 A 評 5 分，對 B 未評；V 對 A 評 4 分、B 評 5 分。U 的 B 格是「未觀察」，不能直接當成零分的負評。若你依 V 的偏好向 U 推薦 B，這是待驗證的推測，不是已知答案。檢查：U 尚未評 B，能否拿這個空格直接計算預測誤差？不能，須有獨立保留的真實評分或另定適當的評估任務。

這三個例子分別問保留什麼變異、如何組合預測，以及缺值代表什麼。先定問題與 objective，再選方法，不因它們都在同一份作業就混成一個成功指標。

## 更新紀錄

- 2026-10-11：補上自編例子、完整計算或推理，以及理解檢查答案。

## 參考資料
- [HW9 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip)
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
