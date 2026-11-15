---
title: "AI Engineer 面試日練 — 2026-11-09：ML Fundamentals"
date: 2026-11-09
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: zh-TW
description: "星期一主題 ML Fundamentals：從一道常見面試題出發，練習為什麼 0.1% 詐騙率的場景裡 accuracy 會說謊，以及該換成哪些指標才能看出模型真正的表現。"
tldr: "今天的核心是極端類別不平衡下的指標選擇：accuracy 在詐騙率只有 0.1% 的場景裡會失真，因為全猜「正常交易」就能拿到 99.9% 的 accuracy 卻抓不到一筆詐騙；precision 跟 recall 在業務上是互斥的兩個方向，recall 優先代表願意多誤判幾筆正常交易來換抓到更多詐騙；ROC-AUC 在高度不平衡下看起來會比實際情況漂亮，這時該換成 precision-recall curve 才看得出不同決策閾值下真正的取捨。練習題取自 Pensero AI Engineer 面試準備指南整理的常見問法——「0.1% 的交易是詐騙，為什麼 accuracy 不好，你會用什麼指標」——陷阱是只背得出 precision／recall 的公式，答不出閾值要怎麼跟著業務成本一起動。"
series:
  name: "AI Engineer 面試日練"
  order: 82
---

> 🌏 [English version](/posts/daily/2026-11-09-ai-interview-daily-en)

## 今日主題

星期一固定練 ML Fundamentals。今天這題看起來只是在考「指標公式背得熟不熟」，但真正的考點是「你知不知道哪個指標在這個資料分布下會說謊」。詐騙偵測、異常偵測、罕見疾病分類，都是正類只占整體一小部分的場景，面試官用這類題目來看你是不是只會套公式，還是真的理解每個指標背後假設的資料分布。這題在 technical screening 或 onsite 的 ML fundamentals 環節幾乎必考,答得好不好,往往決定後面 applied ML 跟 system design 兩輪面試官會不會對你多一分信任。

## 核心概念速記

### Accuracy 在極端不平衡下是假指標

Accuracy 算的是「猜對的比例」,在正負類數量差不多時很直觀,但當正類只占 0.1% 時,一個什麼都不做、永遠猜「正常交易」的模型就能拿到 99.9% 的 accuracy,卻一筆詐騙都抓不到。這不是模型厲害,是基數效應（base rate）在作祟——少數類本身的數量太少,多數類隨便猜對就能把整體分數撐得很高,所以在不平衡資料上,accuracy 從一開始就不該被當成主要指標來追。

### Precision 跟 Recall 是業務上互斥的兩個方向

Precision 問的是「我標成詐騙的這些交易裡,真的是詐騙的占多少」,recall 問的是「所有真正的詐騙裡,我抓到了多少」。這兩個指標天生互斥——把判定閾值調低,recall 會上升（抓到更多詐騙）但 precision 會下降（誤判的正常交易變多,調查人力被稀釋）;反過來調高閾值則是放過更多詐騙但誤判變少。詐騙偵測這類場景通常會優先顧 recall（漏抓一筆詐騙的損失,通常比多查幾筆正常交易的成本大),但實際要抓到多少精確度才划算,要跟營運成本一起算。

### ROC-AUC 在高度不平衡下會「虛高」,PR curve 才看得出真相

ROC-AUC 看的是模型在所有閾值下,把正類排在負類前面的能力,但它的假陽性率（FPR）分母是「全部負類」,在負類數量遠大於正類時,就算誤判的絕對數量不少,FPR 算出來的比例依然很小,導致 ROC 曲線看起來很漂亮,AUC 分數偏高。Precision-recall curve 的兩個軸都只跟正類有關,不平衡程度越高,越能反映出「同一個召回率下,精確度實際上掉得多凶」,所以面試被問到「AUC 很高但 precision 很差」這種矛盾現象時,正確的反應是先換去看 PR curve,而不是懷疑資料有問題。

### 決定運營閾值,是把指標選擇接回業務成本

算出一串 precision／recall／F1 不是終點,真正要做的決定是「閾值要設在哪」。這可以透過重新加權損失函數（讓少數類的錯誤懲罰更重）、調整決策閾值,或在訓練階段做欠採樣／過採樣來讓模型對少數類更敏感,但不管用哪種手段,最後都要回頭問一句:多抓一筆詐騙省下的損失,跟多誤判一筆正常交易的調查成本跟使用者體驗代價,哪邊比較貴。這條業務換算,才是面試官真正想聽到的收尾。

## 今日練習題

### 題目

You're building fraud detection where 0.1% of transactions are fraudulent. Why is accuracy poor? What metrics would you use?

**來源**：Pensero AI Engineer 面試準備指南整理的 ML fundamentals 常見問法　**難度**：基礎　**環節**：technical screening / ML fundamentals round

### 拆解思路

1. **先釐清問題**：面試時值得先確認「0.1%」是訓練資料裡的比例還是上線後實際流量的比例——如果兩者不一致,後面講的重新加權或採樣策略會不一樣,先問清楚能顯示你知道資料分布跟上線分布可能脫鉤這件事。
2. **建立框架**：先點出 accuracy 失真的根本原因——基數效應,再把 precision、recall、F1、PR curve、ROC-AUC 這幾個指標按「各自在衡量什麼」排好順序講,不要一股腦把名詞全塞進一句話。
3. **深入核心**：講清楚 precision 跟 recall 互斥的本質,並說明為什麼 ROC-AUC 在這種不平衡場景會虛高——這是整題能不能拿高分的關鍵,只背指標定義但答不出「為什麼不平衡會讓 ROC 看起來比較漂亮」,會被面試官追問到破功。
4. **收尾**：把答案收回業務決策——詐騙偵測通常優先顧 recall,但最終閾值要讓「多抓詐騙省下的損失」跟「多誤判正常交易的調查成本」算在同一個天平上,並補一句「正式上線後還是要看 A/B test 或實際調查人力的回饋,不能只看離線指標」。

### 範例回答（面試時可以這樣講）

> **先講清楚 accuracy 為什麼在這裡不能用**：如果詐騙只占 0.1%,一個什麼都不做、永遠猜「正常交易」的模型就能拿到 99.9% 的 accuracy,但實際上一筆詐騙都沒抓到。這是基數效應——多數類本身數量太大,隨便猜都能把整體分數撐得很高,所以 accuracy 從一開始就不該被當成這個場景的主要指標。
>
> **換成跟少數類直接相關的指標**：我會改看 precision（標成詐騙裡真的是詐騙的比例）跟 recall（所有真詐騙裡被抓到的比例),這兩個天生互斥,閾值調低 recall 上升但 precision 下降。更重要的是,ROC-AUC 在這種不平衡場景下會虛高,因為它的假陽性率分母是全部負類,負類數量一多,就算誤判的絕對數量不少,比例還是很小,曲線看起來很漂亮。這時候我會改看 precision-recall curve,因為兩個軸都只跟正類有關,能看出同一個召回率下精確度實際掉得多凶。
>
> **最後把指標選擇接回業務成本**：詐騙偵測通常會優先顧 recall,因為漏抓一筆詐騙的損失通常比多查幾筆正常交易的調查成本大,但具體閾值要設在哪,我會拉業務方一起算——多抓一筆詐騙省下的平均損失金額,跟多誤判一筆正常交易佔用的調查人力與使用者體驗代價,哪邊比較貴,再搭配重新加權損失函數或調整閾值去逼近那個甜蜜點。正式上線後還是要看實際調查人力的回饋跟 A/B test,不能只靠離線的 precision/recall 分析就定案。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 有指出 accuracy 在極端不平衡下為什麼會誤導（0.1% 基數下猜負類也有 99.9% accuracy） | |
| 有正確定義 precision／recall,並說明兩者在業務上互斥的 tradeoff | |
| 有提到 ROC-AUC 在高度不平衡下會虛高,PR curve 才是看穿閾值取捨的工具 | |
| 有提到至少一種具體調整手段（重新加權 loss、調整閾值、欠採樣／過採樣） | |
| 有把指標選擇接回業務成本（抓到多少詐騙 vs 誤判調查成本） | |
| 加分：提到上線後要靠 A/B test 或實際調查人力回饋驗證,不是只看離線指標 | |

## 延伸閱讀

- [Handle highly imbalanced classification data — PracHub](https://prachub.com/interview-questions/handle-highly-imbalanced-classification-data) — 專門拆解不平衡資料的處理手段（重新加權、採樣策略),補完今天練習題裡「調整運營閾值」這一步的具體做法。
- [Design payment fraud detection — PracHub](https://prachub.com/interview-questions/design-payment-fraud-detection) — 把今天的指標選擇題延伸成完整的詐騙偵測系統設計題,適合練完這題後接著練 ML system design 環節。

## 參考資料

- [AI Engineer Interview Questions: Preparation Guide for 2026 — Pensero](https://pensero.ai/blog/ai-engineer-interview-questions) — 本篇練習題「You're building fraud detection where 0.1% of transactions are fraudulent」的原始問法與建議答案結構來源。
- [Machine Learning Interview Questions: Complete 2026 Guide — PracHub](https://prachub.com/resources/machine-learning-interview-questions-guide-2026) — 對應「ROC-AUC 在高度不平衡下會虛高」一節,PracHub 的 worked example（Q3：高 AUC-ROC 但低 precision）示範了同樣的推論邏輯。
- [Machine Learning Interview Prep Guide (2026) — Coursera](https://www.coursera.org/resources/machine-learning-interview-prep-guide) — 對應「Precision 跟 Recall 是業務上互斥的兩個方向」一節,evaluation metrics 清單（precision/recall/F1/AUC/log loss）的定義來源。
