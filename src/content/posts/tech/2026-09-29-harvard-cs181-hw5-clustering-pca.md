---
title: "Harvard CS181 HW5（上）：K-means、HAC 與 PCA，沒有標籤時怎麼整理手寫數字"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, homework, clustering, k-means, pca, unsupervised-learning]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 9
type: guide
tldr: "HW5 的 Problem 3–4 把手寫數字丟給三種不看標籤的方法：K-means 用 10 個平均影像代表整批資料，HAC 用合併樹給出任意群數，PCA 用幾個連續方向壓縮影像。三者都在回答「用少量東西描述資料，誤差多大」，作業要你把它們的目標函數與重建誤差放在一起比。"
description: "逐週導讀 Harvard CS1810 Spring 2026 HW5（due 2026-04-19）Problem 3–4：從零實作 K-means 與 max/min/centroid 三種 linkage 的 HAC、標準化前後的群中心、群大小與混淆矩陣，以及 MNIST 前 6000 張影像的 PCA、累積解釋變異與重建誤差比較。對照 schedule 第 9 週與 Section 7。"
draft: false
glossary:
  - term: "HAC"
    aliases: ["hierarchical agglomerative clustering", "階層式凝聚分群"]
    definition: "由下往上的分群法：每個點先自成一群，每一步合併 linkage 距離最近的兩群，直到剩一群；合併紀錄構成一棵樹（dendrogram），切在不同高度就得到不同群數。"
    context: "HW5 Problem 3 要從零實作三種 linkage 的 HAC，並跟 K-means 比較。"
  - term: "linkage"
    aliases: ["linkage function", "連結函數"]
    definition: "HAC 用來量兩個群之間距離的規則。min（single）取最近的一對點，max（complete）取最遠的一對點，centroid 取兩群平均點的距離。"
    context: "linkage 決定 HAC 會長出鏈狀大群還是緊湊小群。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW5](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5)（`hw5_release.tex/.pdf/.ipynb` 與 `data/*.npy`）、[官方 schedule](https://harvard-ml-courses.github.io/cs181-web/schedule) 第 9 週、[Section 7](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07.pdf)（標頭 Spring 2026）為準。課程無當期錄影；lecture scribe notes 是 **2024** 版（K-means 在 [lec12，2024-02-29](https://harvard-ml-courses.github.io/cs181-web/static/lec12/12-scribe-notes.pdf)，PCA 在 [lec15，2024-03-21](https://harvard-ml-courses.github.io/cs181-web/static/lec15/15-scribe-notes.pdf)，lec13 缺檔）。作業解答未公開，Section 7 有 [soln](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07_soln.pdf)。存取分級 **A3**，同[系列總覽](/posts/tech/2026-08-27-harvard-cs181-overview)。

本篇是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)第 9 篇。上一篇是 [HW4（下）：決策樹、隨機森林與 MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)，下一篇是 [HW5（下）：SimCLR 對比學習與 GAN](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans)。

到 HW4 為止，每份作業都有標籤：溫度、貸款核准、影像類別。HW5 標題是「Clustering, PCA, SSL」，四題都拿掉了標籤。這篇講後兩題（Problem 3 分群、Problem 4 PCA），它們是講課順序裡先上的古典方法；Problem 1–2 的 SimCLR 與 GAN 留到下一篇。

## 課程影片來源

本篇依官方講義、投影片或作業導讀；本次檢查官方公開頁面，尚未核實本文對應講次的公開錄影。這不表示課程沒有錄影。

課程與錄影入口：

- [harvard-cs181 — official course materials and recording index](https://harvard-ml-courses.github.io/cs181-web/syllabus)

## HW5 在 2026 課表的位置

| 項目 | 官方內容 |
|---|---|
| 釋出 | 2026-04-03（Fri），同日 HW4 截止；schedule 寫「Release HW 5 (Clustering, PCA, SSL)」 |
| 截止 | `hw5_release.tex` 的 `\duedate` 是 April 19, 2026 11:59pm；schedule 原訂 Apr 17，註明「pushed back to April 19 EOD」 |
| 對應講課 | 第 9 週：Mar 24 Clustering、Mar 26 PCA |
| 對應 section | Section 7「Unsupervised Learning」（schedule 排在第 10 週那格） |
| 配分 | syllabus：hw1–6 各佔總成績 11%；HW5 的 tex 沒有寫各題分數 |
| 繳交 | writeup PDF 交 Gradescope `HW5`，`.tex` 與 `.ipynb` 交 `HW5 - Supplemental`（需選課） |

作業的四題全部在同一本 `hw5_release.ipynb` 裡，按 Problem 1–4 分段。資料夾 `data/` 放了三個檔，我用 NumPy 讀過一次確認形狀：

| 檔案 | 形狀 | 用途 |
|---|---|---|
| `large_dataset.npy` | (5000, 784), float32 | K-means |
| `small_dataset.npy` | (300, 784), float32 | HAC |
| `small_dataset_labels.npy` | (300,), int64 | 只拿來畫混淆矩陣 |

784 = 28×28，每列是一張攤平的手寫數字。PCA 那題不用這三個檔，notebook 直接用 `torchvision.datasets.MNIST` 下載訓練集，取前 `N = 6000` 張。

## Problem 3：K-means 與 HAC

題目要你從零實作兩種分群，距離一律用 ℓ2（歐氏距離），然後回答「這麼簡單的演算法，能不能把長得像的數字分在一起」。八個小題可以分成三段。

### 第一段：K-means 的目標函數與群中心

K-means 要找 K 個中心 μ 和每個點的歸屬 c，讓所有點到自己中心的平方距離總和最小。[Section 7](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07.pdf) 把求解步驟寫成 Lloyd's algorithm，兩步交替：

1. **指派**：中心固定，每個點歸給最近的中心。
2. **更新**：歸屬固定，每個中心改成自己群裡所有點的平均。

小題 2 要你從隨機初始化、K=10 開始，畫出目標函數隨迭代的變化，並確認它**從不上升**。這不是運氣，兩步各自都是在固定另一半時的最佳解，所以總和只會下降或持平。Section 7 的 Exercise 3 就是要你證明這件事，做完它，小題 2 的圖只是驗證。

小題 3 要跑三次隨機重啟，每次畫出 10 個群的平均影像，共 30 張放在同一張圖。平均影像本身就是一張「模糊的數字」，你會直接看到哪些數字被併在一起、哪些被拆成兩群。三次結果不同，是因為 K-means 目標非凸，只會停在局部最佳。Section 7 提到的 K-means++ 就是用「挑彼此離得遠的初始中心」來減少這種差異。

小題 4 把每個像素標準化成平均 0、變異 1（變異為 0 的像素除以 1），再重做一次。Section 7 的「Practical Considerations」寫到：某個座標範圍特別大時會主導目標函數，標準化可以緩解。但 MNIST 的邊角像素幾乎永遠是 0，變異很小，標準化會把這些像素的一點點雜訊放大。比較兩組群中心時，可以從這個角度解釋差異。

### 第二段：HAC 的三種 linkage

HAC 不需要事先給 K。它從 N 個單點群開始，每一步合併距離最近的兩群，合併紀錄形成一棵樹，要幾群就在哪一層切。「兩群的距離」怎麼定，就是 linkage：

| 作業用語 | Section 7 用語 | 定義 | 典型行為 |
|---|---|---|---|
| min linkage | single linkage | 兩群之間最近那對點的距離 | 能找細長形狀，但容易被「橋接點」串成一大群（chaining） |
| max linkage | complete linkage | 兩群之間最遠那對點的距離 | 控制群的直徑，群比較緊湊 |
| centroid linkage | （Section 7 列的是 average 與 Ward） | 兩群平均點的距離 | 介於兩者之間 |

小題 5 要你在 300 張的小資料集上，對三種 linkage 各畫出「剛好 10 群」時的平均影像，評論清晰度，並解釋為什麼 HAC 只需要跑一次。後者的線索在演算法本身：HAC 沒有隨機初始化，給定資料與 linkage，每一步合併都是確定的。

小題 6 要畫出 10 群時每一群有幾張影像，三種 linkage 加一次 K-means。這張圖通常最能看出 min linkage 的 chaining：如果某一群大到吃掉大部分資料，剩下幾群只有一兩張，就是被串起來了。Section 7 另外提醒，天真實作的 HAC 是 O(N³)，這也是為什麼它只用 300 張、K-means 用 5000 張。

### 第三段：混淆矩陣與「分群能不能認數字」

小題 7 要畫 K-means 與三種 HAC 之間兩兩的混淆矩陣，找出哪種 HAC 最接近 K-means 並解釋原因。提示：K-means 用平均點代表一群，三種 linkage 裡哪一種也在看平均點？

小題 8 是討論題：分群適不適合拿來辨識數字、群該不該對上真實標籤、哪些壞資料或對抗資料會特別傷分群。Section 7 的「Evaluating Clusterings」給了一個框架：沒有標籤時只能看緊湊度、分離度與穩定度，而且這三者常互相拉扯；有標籤時才能拿群去對真實類別。群對不上數字，不一定是演算法壞了，也可能是「4 和 9 在像素空間本來就很近」。

[期末練習題](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf)第 1 題是九個一維點的 HAC，要你分別用 min 與 max linkage 畫 dendrogram。它比作業小得多，適合先手算一次，確定自己懂每一步合併在做什麼，再去寫 300 張影像的版本。

## Problem 4：PCA

題目明寫**不能用第三方 PCA 實作**（例如 scikit-learn），要從零做。notebook 的 Section 4.1.a 標題是「PCA via SVD」，也就是先把資料置中，再對置中後的矩陣做 SVD。

四個小題：

1. 畫前 500 個主成分的特徵值（由大到小），再畫前 k 個成分的累積解釋變異比例（k = 1…500），回答前 500 個成分解釋了多少變異、曲線怎麼隨 k 變化。
2. 畫資料的平均影像和前 10 個主成分的影像，跟 K-means 的群中心比較異同。題目特別提醒：**做 PCA 前要置中**。
3. 用前 10 個主成分算重建誤差，再算「每張都用平均影像重建」的誤差，跟 K-means 最後的目標函數值比較。為了評分一致，誤差定義為真實資料與重建之間平方 ℓ2 距離的平均。
4. 如果把主成分矩陣 V 右乘一個旋轉矩陣 R，變成 VR，重建誤差會變嗎？成分的解讀會變嗎？

Section 7 第 3 節把 PCA 講成三件事，剛好對應這四題：

- **解釋變異**：第 k 個特徵值 λk 就是第 k 個方向上的變異量，累積比例是前 K 個 λ 的和除以全部 λ 的和（小題 1）。Section 7 說常見做法是保留到 90–95%，或看 scree plot 的轉折，但沒有通用門檻。
- **壓縮觀點**：編碼 z = Vᵀx̃，解碼 x̂ = Vz。PCA 是平方誤差下最好的線性編碼—解碼器（小題 3）。
- **非唯一性**：Section 7 的 3.3.1 節討論了「Non-uniqueness and the Orthonormality Constraint」，這正是小題 4 在問的事。想一想：VR 張出來的子空間跟 V 一樣嗎？

小題 2 和 3 是這份作業最值得花時間的地方，因為它們逼你把 K-means 和 PCA 放在同一把尺上。兩者都是「用少量東西描述每張影像」：K-means 用一個群中心（離散的身分），PCA 用 10 個連續係數。Section 7 的 3.11 節「PCA vs. Clustering」總結了這個對比：分群找離散群組，PCA 找連續變化方向，同一份資料可能兩者都用得上。你算出的三個數字（平均影像誤差、10 成分 PCA 誤差、K=10 的 K-means 目標值）排出來的順序，就是這段話的實證。

注意一個細節：K-means 的目標是在 `large_dataset`（5000 張）上算的，PCA 是 MNIST 前 6000 張。兩者資料不同，而 K-means 的目標是總和、題目的誤差是平均，比較前先確認你比的是同一種量。

## 做題順序建議

1. 先手算 Section 7 的 K-means Exercise 1（五個一維點、K=2）與 HAC Exercise 1，再做期末練習題第 1 題的 dendrogram。
2. 寫 K-means，先做小題 2 的目標函數圖。圖有任何一點上升，就是指派或更新寫錯了，先修好再往下。
3. HAC 先在十幾個點上測，確認三種 linkage 的合併順序跟手算一致，再跑 300 張。
4. PCA 先確認置中，再做 SVD；小題 1 的累積比例最後一定要接近 1（500 個成分已經很多），如果不是，檢查特徵值是不是從奇異值正確換算。
5. 最後回頭寫小題 2–3 的比較。這兩題需要 Problem 3 的 K-means 結果，所以別把 Problem 4 放在 Problem 3 之前做。

## 自我檢測

- 為什麼 K-means 的目標函數每一步都不會上升？用兩句話講完。
- min linkage 在什麼樣的資料上會把兩個明顯分開的群串在一起？畫一個例子。
- 前 10 個主成分的影像和 K-means 的 10 個群中心，哪一組看起來比較像「數字」？為什麼？
- 把 V 換成 VR 之後，每張影像的 10 個係數會變嗎？重建結果會變嗎？

## 延伸閱讀

- 站內 [Stanford CS229 講義第 10 章：分群與 k-means](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-10-clustering-k-means)，從交替最佳化角度再講一次 K-means。
- [Berkeley CS189 Spring 2025 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)，另一門大學 ML 課怎麼安排非監督學習。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [CS1810 Spring 2026 HW5 資料夾（GitHub）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5)：`hw5_release.tex`、`hw5_release.pdf`、`hw5_release.ipynb`、`data/*.npy`
- [HW5 題目 PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw5/hw5_release.pdf)
- [CS1810 2026 官方 schedule](https://harvard-ml-courses.github.io/cs181-web/schedule)（第 9–12 週列、HW5 release/due；2026-09-29 以 Google Sheet CSV 匯出查閱）
- [CS1810 2026 Syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)（成績配分）
- [Section 7：Unsupervised Learning（Spring 2026）](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07.pdf)／[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07_soln.pdf)
- [CS181 Second Half Practice Problems](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf)（第 1 題 HAC）
- [2024 Lecture 12 scribe notes：Unsupervised Learning、K-means](https://harvard-ml-courses.github.io/cs181-web/static/lec12/12-scribe-notes.pdf)
- [2024 Lecture 15 scribe notes：PCA](https://harvard-ml-courses.github.io/cs181-web/static/lec15/15-scribe-notes.pdf)
- [CS181 2026 課程首頁](https://harvard-ml-courses.github.io/cs181-web/)
- [Harvard CS181 逐週導讀（系列總覽）](/posts/tech/2026-08-27-harvard-cs181-overview)
