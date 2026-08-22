---
title: "CMU 11-785 Lecture 5：訓練三：反向傳播"
date: 2026-08-22
category: ai
tags: [cmu, deep-learning, neural-networks, course-guide]
lang: zh-TW
type: guide
difficulty: 進階
tldr: "Spring 2026 Lecture 5 聚焦計算圖、chain rule、局部導數與梯度重用；本文依官方 slides 與錄影重建主線，並提供不依賴課內 grader 的小型自我檢查。"
description: "CMU 11-785 Spring 2026 Lecture 5 雙語導讀：訓練三：反向傳播。"
draft: false
series:
  name: "CMU 11-785 深度學習完整課程導讀"
  order: 5
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en)

本篇對應 CMU 11-785 Spring 2026 的 **Lecture 5: Training III: Backpropagation**。主要證據是[官方投影片](https://deeplearning.cs.cmu.edu/S26/documents/slides/lec5.BP.pdf)與[官方 YouTube 錄影](https://youtu.be/Pk2J64MbOuw)；下文只整理兩者能支持的內容，不補寫課堂問答或未公開的講者說法。

## 這一講處理什麼

這講的中心是計算圖、chain rule、局部導數與梯度重用。讀的時候要把「模型或演算法的定義」、「它最佳化的目標」與「實際計算怎麼流動」分開記。前者說明允許哪些函數，第二項說明訓練偏好什麼結果，最後一項才決定記憶體、速度與數值穩定性。

課程把這個主題放在完整序列的第 5 講，因此它既承接前面的表示與訓練語言，也替後續模型建立共同元件。不要只抄名詞；每遇到一個公式，就標出輸入、輸出、可學參數與沿哪條路徑傳遞梯度。

## 概念主線

先用 shape 檢查理解：把每個張量的 batch 維度、特徵維度與序列／空間維度寫在公式旁。接著問運算是否共享參數、是否需要正規化，以及訓練和推論時有沒有不同。這三個問題通常能抓出「公式看懂、程式仍寫錯」的落差。

再把局部運算放回整體目標。深度學習模型不是靠單一 layer 成功；資料、表示、loss、optimizer 與評估方式共同決定行為。若某個結果改變，先固定其他條件再找原因，避免一次同時換模型、資料增強與學習率。

## 自己重做一次

今晚的最小練習是：**替兩層 MLP 寫出 forward/backward shape 表並做 finite-difference check**。先用極小輸入手算一輪，再以 NumPy 或 PyTorch 重做，最後比較兩者。若結果不同，先檢查 shape、索引與 reduction，之後才懷疑理論。

自我檢查不以「程式能跑」為標準。至少記錄一個預期不變量，例如機率和為一、loss 應下降、輸出 shape 固定，或數值梯度與解析梯度接近。這是沒有課內 hidden grader 時仍能保留的回饋迴路。

## 與正式作業的邊界

[Spring 2026 assignment table](https://deeplearning.cs.cmu.edu/S26/pages/tables/assignments_table.html)只公開 HW1–HW4 的題名、期限與平台連結；完整 handout、starter、資料、Autolab 測試與 Piazza 說明並未形成匿名可得的同版本套件。本篇練習是依公開講授材料設計的縮小版，不是正式作業重製，也不提供答案。

需要更多操作練習時，可從[官方 recitation／bootcamp table](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html)選同主題 notebook。那些公開資源是補充練習，不等於正式 HW starter。

## 讀完後

闔上 slides，用一張紙寫下這講的輸入、輸出、目標函數與一個失敗模式。能不看筆記說明這四項，才往下一講；否則回到剛才的小例子，縮小輸入直到每一步都能人工核對。

## 參考資料

- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [Lecture 5 slides](https://deeplearning.cs.cmu.edu/S26/documents/slides/lec5.BP.pdf)
- [Lecture 5 official YouTube recording](https://youtu.be/Pk2J64MbOuw)
- [Spring 2026 recitations and bootcamps](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html)

