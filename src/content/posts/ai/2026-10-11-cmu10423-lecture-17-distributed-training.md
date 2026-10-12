---
title: "分散式訓練：梯度、模型與狀態各如何切分｜CMU 10-423 第 17 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 22
draft: false
description: "以完整數值例子與變式答案理解分散式訓練：梯度、模型與狀態各如何切分。"
---

> 🌏 [English version](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training-en)

**影片狀態：錄影需登入或課程授權。** [來源說明](#課程影片來源)

本文依 [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 公開投影片整理；數值例子為本站教學補充。

## 多張 GPU 不是一種單一方法

資料平行把不同樣本分給多張卡；張量平行切同一層矩陣；管線平行切不同層；狀態切分則分散 optimizer、梯度與權重的儲存責任。先備是[autodiff](/posts/ai/2026-10-11-cmu10423-hw0-autodiff)與[Transformer](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)。本篇要能手算兩張卡的一步更新，並說出每種切分省什麼、增加什麼通訊。

資料平行中，每張卡通常有相同模型副本；各自用本地資料 forward/backward，再同步梯度、做一致更新。它不因卡數加倍就自動讓每張卡的模型權重減半。若模型本身放不下，需要另加張量平行、管線或參數切分。

## 兩張卡算出同一個更新

自擬一維模型 ŷ=wx，起始 w=1，loss 為每筆 0.5(wx−y)²。GPU A 拿 (x=1,y=3)，梯度 g_A=(1−3)·1=−2。GPU B 拿 (x=2,y=1)，梯度 g_B=(2−1)·2=2。每張一筆、全域 batch 共兩筆，平均梯度為 (−2+2)/2=0；learning rate 0.1 後兩卡都應仍為 w=1。

若兩卡各自直接 step，就會變成 1.2 與 0.8，副本分岔。若 all-reduce 用 sum 而程式沒除 batch/card 的對應因子，另一個例子就會把更新放大。這裡剛好抵消掩蓋了問題，所以測試还要用不抵消的資料：把 B 的 y 改成 2，g_B=0，平均梯度 −1，更新後 w=1.1。這個變式才抓得到忘記平均造成的 w=1.2。

## 不均等 batch 要按樣本數加權

如果 A 有一筆、B 有三筆，各自回傳本地平均梯度，不能直接平均兩個值當成四筆資料平均。全域梯度應是 (1·g_A+3·g_B)/4。實際 framework 的 loss reduction、sampler 與同步慣例需一起檢查；gradient accumulation 也要正確縮放，避免等效 learning rate 隨微批次數變。

本地 dropout、數值與 collective 排序可能讓多卡與單卡結果不逐位元相同；合理驗收是相同 objective 的梯度在容許誤差內一致、每卡更新一致，而不是忽略差異或任意要求 bitwise equality。

## 模型與狀態的兩種切分

張量平行可以把一層輸出維度切到兩卡，各算部分矩陣；下一層若需要完整結果，就要 gather 或 reduce。管線平行把早晚層分開，microbatch 讓不同階段重疊；資料依賴仍存在，填充與排空造成 bubble。切分粒度與通訊頻寬決定收益，卡數多並不保證線性加速。

[ZeRO](https://arxiv.org/abs/1910.02054)逐步切分 optimizer states、gradients、parameters，減少資料平行副本的儲存冗餘。Adam 的動量、二階矩與混合精度 master weights 可能占大量空間；具體 bytes 依實作，不宜背固定單一常數。狀態切分改儲存與通訊，不等於自動把每個 layer 的算術分半。

## 變式練習與答案

A 有一筆平均梯度 −2，B 有三筆平均梯度 2，全域平均為 1，而不是 0；learning rate 0.1 後 w=0.9。若四卡資料平行的模型每張原本需 10 GB，純資料平行不會讓權重變成每張 2.5 GB。若 optimizer state 太大但 forward 可放下，先考慮狀態切分；若單層就放不下，還需參數或張量切分。下一篇[高效推論](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference)處理不同瓶頸：attention IO、KV 儲存與解碼驗證。

## 課程影片來源

[Spring 2026 官方課站](https://www.cs.cmu.edu/~mgormley/courses/10423/)將錄影導向 SCS Panopto。2026-10-12 匿名讀取回傳資料夾未載入與登入提示，未取得可播放的課堂內容；這是存取限制，不能推論沒有錄影。本文依公開投影片與所列原始論文整理；自擬例子是導讀補充，不是逐字稿。[官方錄影資料夾](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)。

## 參考資料

- [CMU 10-423 Spring 2026 Lecture 17 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf)
- [Primary paper](https://arxiv.org/abs/1910.02054)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
