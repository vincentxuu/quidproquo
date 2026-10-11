---
title: "CS189 Spring 2026 Lec 4–7：K-means、機率複習、MLE、多變量高斯與 GMM"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, clustering, k-means, probability, unsupervised-learning]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 4
tldr: "CS189 Spring 2026 第 4–7 講用一條線串起非監督式學習：先用 K-means 分群，指出它的弱點（硬指派、沒有機率框架、只適合體積相近的圓形群），再複習機率、引入最大概似估計（MLE）與多變量高斯，最後把 K-means 改寫成高斯混合模型（GMM）。GMM 的 log-likelihood 沒有封閉解，這個缺口正好把課程帶向梯度下降。四講都有投影片與影片，Discussion 2–3 附解答與 walkthrough。"
description: "導讀 Berkeley CS189 Spring 2026 Lecture 4–7 前半與 Discussion 2–3：K-means 目標函數與 Lloyd 演算法、機率的加法與乘法規則、IID 假設、MLE 的設定與性質、骰子 MLE 與 Lagrange 乘子、多變量高斯與共變異數矩陣、GMM 的概似函數與 K-means 的關係，以及對應的 Bishop 章節。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）。版本選擇見[版本地圖](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)；前一段是 [Lec 1–3](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics)。

前三講講的是工具與流程。從第 4 講開始，課程第一次需要機率。跳躍的幅度不小：兩週內要從「分群」走到「最大概似估計」「多變量高斯」「混合模型」。這四講的串法很清楚，每一步都在修補上一步的弱點：

**K-means 能分群 → 但它沒有機率框架 → 所以複習機率 → 用 MLE 估計分布的參數 → 需要多變量高斯 → 組成 GMM，得到機率版的 K-means → GMM 沒有封閉解 → 需要梯度下降（後面的講次）。**

照這條線讀，就不會覺得是在背一堆彼此無關的公式。

| 講次 | 日期 | 教材 | Bishop 建議閱讀 |
|---|---|---|---|
| Lec 4 Clustering, Probability Review | 1/29 | [PDF](https://drive.google.com/file/d/1wTPpXlfveaC1oOYA7Bohyea1WcBSDboS/view?usp=drive_link) / [影片](https://www.youtube.com/watch?v=STdR9OyulZE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4) | 2.1、2.1.2、2.1.3、2.1.6、2.2、15.1 |
| Lec 5 Intro to MLE, Multivariate Gaussians, Mixture of Gaussians | 2/3 | [PDF](https://drive.google.com/file/d/1ma6N454MTVTgr5i5Ke8KHpVqc2OvFuX_/view?usp=drive_link) / [影片](https://www.youtube.com/watch?v=kU7a1K3PX10&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4) | 2.3.2、3.1.3、3.2、3.2.1、3.2.7、Appendix C；選讀 2.2.2、3.2.9 |
| Lec 6 Multivariate Gaussians & Mixture of Gaussians | 2/5 | [PDF](https://drive.google.com/file/d/17KG62IaaWaIrAR_CyxABRAFfSVkmjHNU/view?usp=drive_link) / [影片](https://www.youtube.com/watch?v=JzlMrqaa_-A&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=5) | 2.2.2、3.1.3、3.2、3.2.1、3.2.9、15.2、15.3、Appendix C |
| Lec 7 Mixture of Gaussians & Linear Regression（本篇只讀前半） | 2/10 | [PDF](https://drive.google.com/file/d/1AWAHBb3kuA8qdYm5mIaCk8a8DVN4c1f5/view?usp=drive_link) / [影片](https://www.youtube.com/watch?v=0YLmbbERr0g&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=6) | 3.2.9、15.2、15.2.1（線性回歸部分留到下一篇） |
| Discussion 2 | 第 3 週 | [題目](https://drive.google.com/file/d/1MZs3r4ZOMhKUTAXjvLU9lxeCvGCUq1ND/view?usp=drive_link) / [解答](https://drive.google.com/file/d/1rGh1__n8Q7q9ScAJvSQWFsygwwsChh5V/view?usp=drive_link) / [Walkthrough](https://www.youtube.com/watch?v=Mf4deCkjUkQ&list=PL-ysCubq-Sa9uYDjsrzfmPCLLbjfOKVPd&index=3) | — |
| Discussion 3 | 第 4 週 | [題目](https://drive.google.com/file/d/1PAxeqyZj4QAEW4tc7MBPKhhjMcz0rBoZ/view?usp=drive_link) / [解答](https://drive.google.com/file/d/11YV3yrkNRU5VclX8xDaAM5xX__gHMiK8/view?usp=drive_link) / [Walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-bRfFhYJkcJ-TDF3oTAWQj) | — |

## 課程影片來源

官方 Spring 2026 課表與官方 YouTube 播放清單（Spring 2026 Lectures，25 支）已於 2026-10-10 即時核對，本文嵌入的講課錄影都在清單中。此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=STdR9OyulZE
title: Lecture 4 錄影：Clustering, Probability Review
```

```youtube
url: https://www.youtube.com/watch?v=kU7a1K3PX10
title: Lecture 5 錄影：Intro to Maximum Likelihood Estimation, Multivariate Gaussians, Mixture of Gaussians
```

原始影片：[Lecture 4 錄影：Clustering, Probability Review](https://www.youtube.com/watch?v=STdR9OyulZE)、[Lecture 5 錄影：Intro to Maximum Likelihood Estimation, Multivariate Gaussians, Mixture of Gaussians](https://www.youtube.com/watch?v=kU7a1K3PX10)

課程與錄影入口：

- [官方課程與錄影入口](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Lectures — official YouTube playlist (25 videos)](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10；以多處抽樣與關鍵字比對為主，非逐字核對）：Lecture 4 影片（STdR9OyulZE，約 80 分鐘）確為 Clustering, Probability Review：講者開場說之前是 Alex 在授課、這是自己的第一堂；內容有間歇泉等聚類例子、K-means 與質心、局部最小值、不同群大小的提問、KL 不對稱，機率複習只講到聯合分布與邊際化就下課（講者說留到下次），所以文中「機率複習」其餘各項（乘法規則、獨立性、IID、喚醒詞貝氏例子）只見於投影片，字幕沒有，「Lloyd」之名也沒被提到。Lecture 5 影片（kU7a1K3PX10，約 72 分鐘）：回顧 K-means 的缺點、隨機變數複習、簡單 MLE 例子與一維高斯 MLE 推導，骰子例子講到一半就結束（講者說下次完成），因此 Lagrange 乘子推導、多變量高斯與 GMM 不在這支影片裡。Lec 6、Lec 7 的影片本文沒有嵌入，未核對。

## Lec 4 前半：K-means 分群

Lecture 4 先把非監督式學習放在監督式學習旁邊對照：監督式學習的資料是 (xᵢ, yᵢ) 配對，非監督式學習只有 xᵢ。投影片列出非監督式學習的五種任務：分群、降維、表徵學習、生成式建模、密度估計。分群的應用例子包括間歇泉噴發模式、顧客分群、疾病亞型、單細胞資料的細胞類型、基因資料的祖源群體。

分群的目標有三條：群內相似度高、群間相似度低，以及「相似」怎麼定義取決於你。

**K-means** 是最常見的質心式分群。每一群用一個質心 cₖ 代表，目標是讓每個點到它所屬質心的平方距離總和最小。投影片把這個最佳化拆成兩個子問題：

- 如果已知分群，最佳質心就是群內所有點的平均。
- 如果已知質心，最佳分群就是把每個點指派給最近的質心。

交替做這兩步，就是 **Lloyd 演算法**。每一步都讓目標函數下降或不變，所以會收斂，但只保證收斂到局部最小值。投影片接著講距離的四個性質（包括對稱性與三角不等式，並順帶說明 KL divergence 不對稱、所以不是距離），以及一個應用：把圖片每個像素當成 RGB 空間的向量，用 K-means 找出幾種代表色，重新上色整張圖。

K-means 的弱點是這四講的轉折點。投影片列了四條：會陷入不好的局部最小值；沒有機率框架，所以很難看清楚它的假設；它隱含假設各群體積相近、形狀像一顆顆圓球；每一步都是「硬」指派，很脆弱。它預告下一講的解法：**高斯混合模型是 K-means 的機率版本。**

**今晚就能做的事**：用 `sklearn.cluster.KMeans` 對一張照片的像素做 K = 8 的分群，用質心顏色重畫整張圖，再換三個不同的 `random_state`，看局部最小值的問題會不會出現。

## Lec 4 後半：機率複習

這段對應 Bishop 2.1–2.2。錄影只講到聯合分布與邊際化就結束，下列其餘項目只見於投影片。投影片依序講：

- **頻率學派與貝氏學派**：前者把機率看成可重複現象的長期頻率，後者把機率看成對不確定性的信念。投影片的結論是兩者都有用。
- **聯合分布**：非負、總和為 1。
- **加法規則（邊際化）**：對其他變數加總，得到子集合的分布。
- **條件分布與乘法規則**：p(X, Y) = p(Y | X) p(X)，可以一直鏈下去，把聯合分布拆成條件分布的乘積。
- **獨立性**：p(X, Y) = p(X) p(Y)。
- **IID 假設**：資料獨立同分布時，聯合機率等於各點機率的乘積。投影片問了一個好問題：K-means 有沒有做這個假設？

補充頁用喚醒詞偵測示範貝氏定理：喚醒詞只出現在 0.01% 的片段裡，偵測器的召回率 99%、偽陽性率 0.1%，那麼偵測器響起時真的有人喊喚醒詞的機率只有大約 9%。這個例子把「先驗、概似、後驗」三個詞一次講清楚。

如果這一段讀起來吃力，先回去補機率再往下，因為接下來每一講都建立在它上面。

## Lec 5：最大概似估計

Lecture 5 從一個問題開始：要估計 GMM 的參數，我們需要多變量高斯，也需要一個估計方法。

投影片先把監督式與非監督式放在同一個框架下：都有訓練資料、模型家族、要找「好」的參數。線性回歸用平方損失定義「好」；那一個高斯分布的參數要用什麼損失？答案是 log-likelihood，也就是 **MLE**。投影片特別提到，ChatGPT 的預訓練本質上也是 MLE：最大化網路上所有文件逐字出現的 log 機率。

MLE 的設定是：假設資料 IID 地來自某個分布家族裡的某一個，找出讓觀察資料機率最大的參數 θ。投影片列出 MLE 的性質：資料越多越會收斂到真值（一致性）、統計上有效率、對重新參數化不變，而且就算資料不是來自這個家族，它仍會給出一個估計，這是福也是禍。

接著是兩個例子：

1. **一維高斯**：寫出概似函數，取 log 把乘積變成加總，對 μ 和 σ² 偏微分設為 0，再檢查是不是極大值。
2. **六面骰子（多項分布）**：各面機率加總必須為 1，所以這是有限制的最佳化，要用 Lagrange 乘子。答案很直觀：每一面的機率估計就是它出現的次數除以總次數。（錄影在這個例子講到一半就結束，下面的推導與結論只見於投影片。）

<details>
<summary>骰子 MLE 的 Lagrange 乘子推導（對應 Bishop Appendix C）</summary>

令 nₖ 是第 k 面出現的次數，N 是總次數。log-likelihood 是 Σₖ nₖ log θₖ，限制條件是 Σₖ θₖ = 1。

建立 Lagrangian：J(θ, λ) = Σₖ nₖ log θₖ + λ(1 − Σₖ θₖ)。

- 對 λ 偏微分設為 0，得回限制條件本身。
- 對 θⱼ 偏微分設為 0：nⱼ / θⱼ − λ = 0，所以 θⱼ = nⱼ / λ。
- 代回限制條件：Σₖ nₖ / λ = 1，所以 λ = N。

結論：θₖ = nₖ / N。

</details>

投影片最後點出兩件事。第一，高斯、多項分布、線性回歸的 MLE 都有封閉解；換成神經網路就沒有，要用迭代的梯度下降。第二，平方損失本身可以從 MLE 推導出來，這條線會在線性回歸那講接上。

MLE 只給一個點估計，不給參數的分布；貝氏統計則會得到後驗分布 p(θ | D)。投影片說之後幾講會再回來談。

## Lec 6：多變量高斯與 GMM

**多變量高斯**把一維高斯推廣到 d 維：平均變成向量 μ，變異數變成 d×d 的共變異數矩陣 Σ（必須半正定）。投影片說多變量高斯遍布古典與現代 ML：生成式與判別式分類、PCA 與 autoencoder、Gaussian process 回歸。

它用身高與體重的例子建立直覺：兩個變數各自是高斯，但它們的聯合分布呢？如果獨立，聯合密度就是兩個一維密度相乘；如果不獨立，可以想像把座標系旋轉到「軸對齊」，旋轉後就能拆成獨立的兩個維度。共變異數矩陣裝的就是各對變數的共變異數。

有兩件事要記住：

- 在多變量高斯下，共變異數為 0 若且唯若兩個分量獨立。一般分布只有單向：獨立推得出共變異數為 0，反過來不成立。
- 多變量高斯的核心是一個二次式，所以它的等高線是橢圓。

**GMM** 把 K 個高斯加權相加：p(x) = Σₖ πₖ 𝒩(x | μₖ, Σₖ)，權重 πₖ 加總為 1，稱為 mixing weights。每一群現在用一個高斯表示，有平均與共變異數兩組參數。

對單一資料點，它屬於哪一群 zᵢ 是看不到的隱變數，所以要把它邊際化（加總掉）：p(xᵢ | θ) = Σₖ 𝒩(xᵢ | μₖ, Σₖ) αₖ。整份資料的 log-likelihood 是 Σᵢ log Σₖ(…)，log 裡面有加總，所以**沒有封閉解**，需要迭代的最佳化。

GMM 除了分群還有兩個用途：估計出參數後可以算任意點的 p(x)，這就是密度估計；也可以先依權重抽一群、再從那一群的高斯抽樣，這就是一個生成式模型。

## Lec 7 前半：GMM 收尾與梯度下降預告

Lecture 7 前半回顧 GMM 的概似函數，並給了梯度下降的簡介：初始化參數、選步長，然後反覆沿著梯度方向更新，直到收斂。投影片說完整內容留到後面。

它接著把 K-means 和 GMM 並排比較：

- GMM 在變異數趨近 0 的極限下就是 K-means。
- 每一群有自己的共變異數通常更好，可以表示橢圓或長條形的群。
- GMM 的假設以統計分布明確寫出，比較容易推廣，也比較容易看懂它假設了什麼。
- 隱變數的 MLE 有一個專門的方法叫 Expectation-Maximization，投影片把它列為 Bishop 15.3–15.3.2 的選讀。

Lecture 7 後半轉向線性回歸，留到下一篇。

## Discussion 2 與 3

**[Discussion 2](https://drive.google.com/file/d/1MZs3r4ZOMhKUTAXjvLU9lxeCvGCUq1ND/view?usp=drive_link)** 的題目：

- 證明對稱矩陣半正定若且唯若所有特徵值非負。
- 三個獨立的 Unif[0, 1] 隨機變數，求最小值的機率密度函數。
- 解讀幾個矩陣代表什麼線性轉換，再寫出旋轉矩陣、連續兩次旋轉，以及「每個座標加 1」這種轉換要怎麼表示。
- ML 分類法練習：PayPal 詐欺偵測、Amazon SageMaker 顧客分群、Zillow Zestimate 房價估計、UCLA Health 的 Epic 風險模型，各屬於哪一類。

**[Discussion 3](https://drive.google.com/file/d/1PAxeqyZj4QAEW4tc7MBPKhhjMcz0rBoZ/view?usp=drive_link)** 的題目：

- 證明對稱矩陣正定若且唯若它能寫成 AAᵀ，A 可逆。
- 證明 X 是多變量高斯若且唯若所有線性組合 aᵀX 都是一維高斯（用動差生成函數）。
- 推導多變量高斯 μ 和 Σ 的 MLE。Lecture 7 投影片直接說這題留給 discussion。
- 寫出 K-means 的目標函數，並證明演算法在有限次迭代內收斂。

Discussion 3 的 MLE 題是這四講最重要的練習：它把 Lec 5 的 MLE 流程套到 Lec 6 的多變量高斯上。題目附上矩陣微分公式，不用自己背。寫完對[解答](https://drive.google.com/file/d/11YV3yrkNRU5VclX8xDaAM5xX__gHMiK8/view?usp=drive_link)，卡住看 [walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-bRfFhYJkcJ-TDF3oTAWQj)。

## 自學動作清單

1. 看 Lec 4 影片，手算一輪 Lloyd 演算法（五個一維的點、K = 2）。
2. 讀 Bishop 2.1–2.2，確定能自己推出喚醒詞例子的 9%。
3. 看 Lec 5，不看投影片自己推一次一維高斯的 MLE。
4. 看 Lec 6，用 NumPy 從一個二維高斯抽 1,000 個點，換三種共變異數矩陣畫散佈圖，看橢圓怎麼轉。
5. 寫 Discussion 2、3，再對解答。
6. 用 `sklearn.mixture.GaussianMixture` 和 `KMeans` 分別對同一份長條形的資料分群，比較結果。

**Fall 2026 對應講次**：[Fall 2026](https://eecs189.org/fa26/) 的 Lec 2（KNN, ML Vocabulary, and K-Means）、Lec 4（Probability and Density Estimation）、Lec 5（Density Estimation and GMM），以及 Discussion 2、3。

## 系列導覽

- 上一篇：[Lec 1–3：ML 問題框架、資料工具、術語與技巧](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics)
- 下一篇：[Lec 7–10：線性回歸、最小平方的幾何、正則化](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression)
- 系列入口：[版本地圖](/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map)

## 延伸閱讀

- [Stanford CS109 L19：最大概似估計](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation)：MLE 的另一種講法
- [Stanford CS109 L9：常態分布](/posts/learning/2026-08-22-stanford-cs109-lecture-09-normal-distribution)：一維高斯的前置
- [Stanford CS229 講義 Ch.4：生成式學習演算法](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-04-generative-learning-algorithms)：多變量高斯在分類上的用法

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 Spring 2026 課表與 YouTube 播放清單即時核對，嵌入的講課錄影都在清單中，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。Lec 4 影片只講到機率複習的聯合分布與邊際化、Lec 5 影片在骰子例子中途結束，文中超出這些範圍的細節已標註為僅見於投影片。

## 參考資料

- [CS 189/289A Spring 2026 首頁與排程](https://eecs189.org/sp26/)
- [Spring 2026 Lecture 4: Clustering, Probability Review（PDF）](https://drive.google.com/file/d/1wTPpXlfveaC1oOYA7Bohyea1WcBSDboS/view?usp=drive_link)、[影片](https://www.youtube.com/watch?v=STdR9OyulZE&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4)
- [Spring 2026 Lecture 5: MLE and Multivariate Gaussians（PDF）](https://drive.google.com/file/d/1ma6N454MTVTgr5i5Ke8KHpVqc2OvFuX_/view?usp=drive_link)、[影片](https://www.youtube.com/watch?v=kU7a1K3PX10&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=4)
- [Spring 2026 Lecture 6: Multivariate Gaussians & Mixture of Gaussians（PDF）](https://drive.google.com/file/d/17KG62IaaWaIrAR_CyxABRAFfSVkmjHNU/view?usp=drive_link)、[影片](https://www.youtube.com/watch?v=JzlMrqaa_-A&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=5)
- [Spring 2026 Lecture 7: Mixture of Gaussians & Linear Regression（PDF）](https://drive.google.com/file/d/1AWAHBb3kuA8qdYm5mIaCk8a8DVN4c1f5/view?usp=drive_link)、[影片](https://www.youtube.com/watch?v=0YLmbbERr0g&list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE&index=6)
- [Spring 2026 Discussion 2 題目](https://drive.google.com/file/d/1MZs3r4ZOMhKUTAXjvLU9lxeCvGCUq1ND/view?usp=drive_link)、[解答](https://drive.google.com/file/d/1rGh1__n8Q7q9ScAJvSQWFsygwwsChh5V/view?usp=drive_link)、[Walkthrough](https://www.youtube.com/watch?v=Mf4deCkjUkQ&list=PL-ysCubq-Sa9uYDjsrzfmPCLLbjfOKVPd&index=3)
- [Spring 2026 Discussion 3 題目](https://drive.google.com/file/d/1PAxeqyZj4QAEW4tc7MBPKhhjMcz0rBoZ/view?usp=drive_link)、[解答](https://drive.google.com/file/d/11YV3yrkNRU5VclX8xDaAM5xX__gHMiK8/view?usp=drive_link)、[Walkthrough](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-bRfFhYJkcJ-TDF3oTAWQj)
- [Bishop & Bishop, Deep Learning: Foundations and Concepts](https://www.bishopbook.com)
- [CS 189 Fall 2026 課站](https://eecs189.org/fa26/)
