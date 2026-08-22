---
title: "泛化：偏差變異、雙降與樣本複雜度"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, generalization, bias-variance, learning-theory]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 9
tldr: "第 8 章把測試誤差拆成不可避免雜訊、偏差平方與變異，再用 uniform convergence 與 VC dimension 說明模型何時能從訓練資料泛化；雙降則提醒我們，參數數量不是萬用的複雜度尺度。"
description: "CS229 2026 主講義第 8 章導讀：偏差—變異分解、模型與樣本雙降、Hoeffding inequality、uniform convergence、樣本複雜度與 VC dimension。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization-en)

這是 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) 2026 版第 8 章（印刷頁 115–136）的逐章導讀。本文依 Tengyu Ma 與 Andrew Ng 編寫的官方主講義整理，**不是任何一學期錄影或課堂進度的重建**；目標是抓住推導主脊，不重製每一個證明。

前七章回答「模型怎麼學」，第 8 章開始問更難的問題：訓練誤差很低，為什麼測試誤差仍可能很高？這個轉折把課程從演算法帶進泛化與學習理論。

## 從偏差與變異拆開測試誤差

講義先用多項式迴歸建立直覺。一次模型無法表達真實的二次關係，即使資料無限多仍會出錯，這是高偏差；五次模型能穿過少量訓練點，換一批資料卻可能得到完全不同的曲線，這是高變異。偏差指模型族本身的表達缺口，變異則是學習結果對有限樣本隨機性的敏感度。

對固定測試輸入 $x$，設真實關係為 $y=h^*(x)+\xi$、雜訊變異為 $\sigma^2$，在訓練集 $S$ 上學到 $\hat h_S$。令 $h_{avg}(x)=\mathbb E_S[\hat h_S(x)]$，平方誤差可分解為：

$$
\operatorname{MSE}(x)=\sigma^2+
\bigl(h^*(x)-h_{avg}(x)\bigr)^2+
\mathbb E_S\bigl[(h_{avg}(x)-\hat h_S(x))^2\bigr].
$$

三項依序是不可避免的雜訊、偏差平方與變異。公式的關鍵不是背名稱，而是知道該怎麼處理：高偏差通常要增加可表達性；高變異通常要增加資料、加強正規化或縮小有效模型空間。這個乾淨分解是迴歸平方損失下的結果，講義也明說分類問題沒有公認的同等分解。

## 雙降修正了傳統 U 型圖

傳統故事說模型越複雜，測試誤差先因偏差下降而改善，之後因變異上升而惡化。第 8 章加入現代模型常見的雙降（double descent）：當模型剛好足以內插訓練資料時，測試誤差可能形成尖峰；進入參數多於樣本的過度參數化區域後，誤差又下降。

這不是「模型做大就一定會變好」。講義特別指出，尖峰與目前學習程序在 $n\approx d$ 附近的次佳表現有關，調好正規化可以緩和模型雙降與樣本雙降。它也提醒：若以學到的模型範數而不是參數數量衡量複雜度，某些線性案例的曲線反而更接近傳統直覺。真正的問題是**有效複雜度由什麼決定**，第 9 章會接著回答。

## 從訓練誤差走到一致收斂

學習理論部分先把分類器放進假設類別 $H$。訓練誤差 $\hat\epsilon(h)$ 是有限樣本上的錯誤率；泛化誤差 $\epsilon(h)$ 是從同一分布重新抽樣時犯錯的機率。對固定假設，Hoeffding inequality 控制兩者差距；再對有限 $H$ 使用 union bound，就得到所有假設同時成立的一致收斂（uniform convergence）：

$$
\Pr\!\left(\exists h\in H:
|\epsilon(h)-\hat\epsilon(h)|>\gamma\right)
\le 2|H|e^{-2\gamma^2n}.
$$

因此，要讓全部假設的誤差差距不超過 $\gamma$，所需樣本數只會以 $\log |H|$ 成長。經驗風險最小化選出的 $\hat h$，其泛化誤差也能被夾在類別中最佳假設 $h^*$ 的誤差附近。

## 無限假設類別靠 VC dimension

實數參數模型有無限多個假設，不能直接數 $|H|$。VC dimension 改問：$H$ 最多能把多少點的所有二元標記方式都實現？這個「打散」能力不依賴同一模型用了哪套冗餘參數化，因此比參數個數更接近假設類別本身。

講義給出的 Vapnik 結果表示，有限 VC dimension $D$ 會帶來一致收斂，學得好的樣本需求大致隨 $D$ 線性成長（固定精度與信心水準時）。這是重要的方向性結論，不是說每個現代非 ERM 演算法都能直接套同一常數或同一界。

## 假設、限制與章節銜接

這章的理論主要假設訓練與測試資料獨立同分布，且演算法以經驗風險最小化為核心。發生 domain shift、相依時間序列、資料選擇偏差或與 ERM 相差很遠的訓練程序時，結論不能原封不動搬用。VC 界也常是保證方向而不是緊密的實務預測。

它承接第 7 章的深度模型，解釋「訓練成功」為何不等於「測試成功」；下一章則把有效複雜度轉成可控制的正規化項、最佳化偏好與交叉驗證。

## 自學練習

產生同一個二次函數的多組含雜訊資料，各自擬合一次、二次與五次多項式。記錄每種模型的平均測試誤差，再畫出不同訓練集下的預測曲線。不要只看單次結果：曲線之間的平均偏移對應偏差，曲線彼此的散布才是變異。

## 參考資料

- [CS229 Lecture Notes（2026）第 8 章：偏差—變異分解](https://cs229.stanford.edu/main_notes.pdf#page=118)
- [CS229 Lecture Notes（2026）第 8.2 節：雙降](https://cs229.stanford.edu/main_notes.pdf#page=124)
- [CS229 Lecture Notes（2026）第 8.3 節：樣本複雜度與 VC dimension](https://cs229.stanford.edu/main_notes.pdf#page=129)
