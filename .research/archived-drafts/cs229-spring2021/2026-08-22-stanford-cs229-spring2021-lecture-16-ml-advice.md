---
title: "Stanford CS229 Lecture 16：ML Advice 從資料規格到上線監控的七步迴圈"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, ml-systems, error-analysis]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 17
tldr: "ML 專案不是訓練一次模型就結束：取得真實資料、反覆檢視、做符合部署情境的切分、把規格落在測試集、先建簡單基準、量測切片，最後持續迭代。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 16：七步 ML 系統流程、資料洩漏、規格漂移、error analysis、診斷與 production monitoring。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-16-ml-advice-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 17 篇，對應 **Stanford CS229, Spring 2021, Lecture 16**。課程表日期是 2021 年 5 月 19 日，官方題目是 **ML Advice**。本文實際使用 Chris Ré 的同名投影片；這份材料明示內容包含建置 production 與臨床原型所得的個人判斷，因此本文保留其建議性質，不把每一條都寫成普遍定理。錄影在 Canvas，沒有作為來源。

這一講把焦點從「哪個演算法」移到「整個系統為什麼會失敗」。主脊是一個七步迴圈：取得資料、看資料、切分、定義規格、建最簡單模型、量測、重複。星號其實應放在第二步，因為看資料要在每個階段重做。

## 第一步先問：資料像部署世界嗎

以 spam detector 為例，理想資料應從產品真正會遇到的郵件抽樣。冷啟動、隱私或法律限制常使這件事做不到；此時最危險的不是資料少，而是資料藏著與任務無關的捷徑。

講義用醫療影像說明模型可能抓到手術標記、胸管等 artifact，而不是疾病本身。總體分數很好，部署時仍可能失效。對應動作很樸素：建立能瀏覽樣本與預測結果的工具，讓具有領域知識的人按來源、地區、時間或關鍵切片檢視。

## 切分必須模擬預測時點

隨機切分不是目的，避免 leakage 並模擬未來才是。若用股票前後日期資料隨機分半，訓練集可能看見測試日期之後的同公司價格。更合理的切分是以時間為界，用過去預測未來。

可以把理想條件簡化成：

```text
train information time < test prediction time
```

這不是 loss function，而是資料契約。只要測試樣本的未來資訊回流訓練，指標就不再估計真正的上線問題。

## 測試集也是規格

「什麼叫 spam」不是自然界自帶的答案。規格必須落成一組案例，並由標註者一致執行。若人類對規格的分歧大於你要比較的模型進步，聲稱小幅改善就沒有意義。

講義提醒 ground truth 是被建構與維護的資源。類別可能重疊、拆得太細、需要輸入中不存在的資訊，或隨時間發生 spec creep。這時先修規格與資料，不要把所有錯誤都推給模型。

核心判斷可以寫成：

```text
可信改善幅度 > 標註與測試集本身的變動
```

若右邊更大，增加模型小數點後的分數只是在量測噪音。

## 最簡單模型是診斷工具

投影片反覆建議先做線性或 logistic regression 等容易收斂、快速且可解釋的 baseline。它的作用不只是給論文一條比較線，而是幫團隊理解資料與規格。

看 train 與 dev error 可以先分流問題：兩者都高，可能缺少模型容量或特徵；訓練低、開發高，可能過度擬合；訓練 loss 劇烈震盪，才更像最佳化問題。這些只是粗略診斷，不是看到曲線就能自動開藥，但比盲目輪流換模型有方向。

混淆矩陣與 error buckets 進一步回答「錯在哪一類」。如果錯誤無法聚成具有共同缺失資訊的群組，可能已接近現有特徵可提供的上限；若能聚出「人物關係＋同位語」之類群組，就有具體資料或特徵可以補。

## Production 問題從部署後才真正開始

總體平均會掩蓋重要切片，因此監控應記錄時間、類別、使用情境與關鍵族群的分數。輸入分布、標籤定義、上游處理與使用者行為都會漂移；舊測試集不會自動反映新世界。

快取與 override 可以作為最後防線，但投影片同時警告它們會累積技術負債、遮住模型真正的問題。可重現性也沒有單一修補方式：random seed 改變結果、資料版本不清、處理管線變動，都可能讓無意義的變更看似品質改善。

## 七步迴圈的真正順序

1. 取得接近部署環境的資料。
2. 看資料與預測，而且每一步後都再看。
3. 建立能反映真實預測問題的 train/dev/test split。
4. 用定義與測試案例持續修正規格。
5. 先建可快速理解的最簡單模型。
6. 量測端到端指標、錯誤切片與漂移。
7. 帶著診斷重跑整個迴圈。

這不是瀑布流程。講義的判決是沒有人第一次就會把前面步驟全部做對；良好系統通常是從不良版本反覆改寫而來。

## 這一講在十八講裡的位置

Lecture 1–15 多半建立模型與學習方法；Lecture 16 把它們放回資料與產品系統。接下來兩講進入 reinforcement learning，會把「部署後持續取得資料」推到更強的互動設定：policy 的選擇本身會改變之後看見的資料。

## 延伸

今晚就能做的動作是拿目前專案的測試集，為每筆資料補上時間、來源與一個產品關鍵切片，然後重算分數。若總體分數不變、重要切片卻明顯變差，你就找到單一平均數原本藏住的風險。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 16 ML Advice slides：七步流程與資料](https://cs229.stanford.edu/notes2021spring/notes2021spring/ml_advice.pdf#page=5)
- [Lecture 16 ML Advice slides：規格與錯誤分析](https://cs229.stanford.edu/notes2021spring/notes2021spring/ml_advice.pdf#page=39)
- [Lecture 16 ML Advice slides：模型診斷與 production issues](https://cs229.stanford.edu/notes2021spring/notes2021spring/ml_advice.pdf#page=61)
