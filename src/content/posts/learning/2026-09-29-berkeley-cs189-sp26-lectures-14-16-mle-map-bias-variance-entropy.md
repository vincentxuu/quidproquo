---
title: "CS189 Spring 2026 Lec 14、16：MLE vs MAP、bias-variance、熵與 KL，期中自評"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, bias-variance, information-theory, exam-prep]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 導讀"
  order: 9
tldr: "Lec 14 把 ridge 重新解釋成「最小平方 + 高斯先驗」的 MAP，再拆解 bias-variance，最後借 Chatbot Arena 示範怎麼讀論文。Lec 16 從壓縮講熵，接到 KL、cross-entropy，再回到 logistic regression 的損失函數。3/17 的期中考題與官方解答都公開在考古題資料夾：6 題、56 分、110 分鐘，另有 6 支逐題講解影片，可以照著模擬一次。"
description: "Berkeley CS189 Spring 2026 Lecture 14 與 16 導讀：MLE 與 MAP、ridge 的貝氏詮釋、bias-variance trade-off、熵、KL divergence 與 cross-entropy，以及用官方 sp26 期中考與解答自我評量的方法。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

本文依 [CS189 Spring 2026](https://eecs189.org/sp26/)（Jennifer Listgarten／Alex Dimakis）的公開教材。系列入口是 [Berkeley CS189 總覽](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)。

[上一篇](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers)講怎麼把損失函數最小化。這一篇回頭問：那些損失函數是從哪裡來的？前面學過的兩個東西會換一個角度重新出現：

- **Ridge regression**：原本是「最小平方加上 `λ‖w‖²`」，Lec 14 會證明它就是在權重上放高斯先驗後的 MAP 估計。
- **Logistic regression 的損失**：原本是「最大化 likelihood」，Lec 16 會把它重新解釋成 cross-entropy，也就是兩個分布之間差多少 bits。

這兩講上完隔週就是期中考（3/17），所以文末附一套用官方考題自評的流程。

## 課程影片來源

官方 Spring 2026 課表與官方 YouTube 播放清單（Spring 2026 Lectures，25 支）已於 2026-10-10 即時核對，本文嵌入的講課錄影都在清單中。此處不提供未核對的時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=Z1KuNG9HyiQ
title: Lecture 14 錄影：MLE, MAP and Bias-Variance Trade-off
```

```youtube
url: https://www.youtube.com/watch?v=ArSadC8hY-Q
title: Lecture 16 錄影：Entropy, Information, and Logistic Regression
```

原始影片：[Lecture 14 錄影：MLE, MAP and Bias-Variance Trade-off](https://www.youtube.com/watch?v=Z1KuNG9HyiQ)、[Lecture 16 錄影：Entropy, Information, and Logistic Regression](https://www.youtube.com/watch?v=ArSadC8hY-Q)

課程與錄影入口：

- [官方課程與錄影入口](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Lectures — official YouTube playlist (25 videos)](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10；以多處抽樣與關鍵字比對為主，非逐字核對）：Lecture 14 影片（Z1KuNG9HyiQ，約 69 分鐘）以擲硬幣偏差對照 MLE 與 MAP、連到 ridge 與最小平方，再講 bias-variance 並以驗證集調整，與文中前兩節相符；字幕沒有 Chatbot Arena、Bradley–Terry 與讀論文五問題，這一段只見於 lec14.pdf。Lecture 16 影片（ArSadC8hY-Q，約 70 分鐘）確為 Entropy, Information, and Logistic Regression：從壓縮講熵（100 天下雨資料約 73 位元、賽馬）、cross-entropy 與 KL，再接到 logistic regression 的損失；MNIST、CIFAR-10 的資料集數字字幕沒有提到，影片結尾是期中考後勤。期中考段落與逐題講解影片不在本次核對範圍。字幕未自報講者姓名，講者歸屬未驗證。

## 教材在哪、能拿到什麼

| 項目 | 官方標題／內容 | 教材 | Bishop 指定閱讀 |
|---|---|---|---|
| Lec 14（3/5） | MLE, MAP and Bias-Variance Trade-off | [Notes 資料夾](https://drive.google.com/drive/folders/1dXJkBmG5eKAaODUFlZy-ngJwwr2ON0fx)：`lec14.pdf`（58 頁）；[錄影](https://www.youtube.com/watch?v=Z1KuNG9HyiQ) | 2.6.1–2.6.2、3.1.1、4.1.2、4.1.6、4.3（bias-variance）、5.4.3 |
| Lec 16（3/12） | Entropy, Information and Logistic Regression | [Notes 資料夾](https://drive.google.com/drive/folders/1_Lc-MtkVryhi1nhB_BRCKhkKuJFOVkz-)：`lec16.pdf`（66 頁）；[錄影](https://www.youtube.com/watch?v=ArSadC8hY-Q) | 2.5.1（熵）、2.5.5（KL）、5.3.1、5.4.3–5.4.4 |
| 期中考（3/17，7–9pm） | 6 題 + Honor Code，共 56 分，110 分鐘 | [考題 sp26-midterm.pdf](https://drive.google.com/file/d/1KZFOxAYg4RYP_xzf5-OnjqVvZQ82Quw5/view)、[解答 sp26-midterm-sol.pdf](https://drive.google.com/file/d/1VCTJML71X_RZevsNpdsuy9IlFKl9QrxR/view)、[逐題講解播放清單](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-oUudIQgL4uTjsiR-UWBlI)（6 支，Problem 1–6） | — |

期中考的兩份 PDF 放在 [Resources 頁](https://eecs189.org/sp26/resources/)連出去的考古題資料夾（`midterm/exams` 與 `midterm/solutions`），同一個資料夾也有 Fall 2025 的期中考和練習考。以上連結我在 2026-09-29 都匿名打開過。依本站 [A0–A3 分級](/posts/learning/2026-08-21-global-ai-cs-course-map)，這一段是 A3，而且比一般講次多了一份有解答的真實考卷。拿不到的是課堂 Slido 互動和期中考的成績分布。

## Lec 14：MLE、MAP 與 ridge

`lec14.pdf` 的 roadmap 分五段：最小平方即 MLE（回顧）、換不同的雜訊模型、先驗信念、MLE vs MAP、bias-variance。

**從擲硬幣開始。** 硬幣正面的機率 Y 未知，觀察到兩次結果 x1、x2。MLE 只看資料；MAP 則先給 Y 一個先驗（講義用離散先驗，也提到可以用 Beta 先驗），再用 Bayes 規則乘上 likelihood。兩者的差別在於：資料很少時，先驗會把估計往你原本相信的方向拉。

**再搬到回歸權重。** 同樣的想法可以放在權重 w 上：給一個以 0 為中心的高斯先驗，變異數 σ_w² 控制「你多相信權重應該很小」。講義把這個先驗解讀成「偏好比較簡單的模型」。把後驗取負 log，最大化問題就變成最小化問題，整理後恰好是 ridge 的形式。講義的結論是：

- 線性回歸加高斯雜訊時，最小平方等於 MLE。
- 在 w 上再放高斯先驗，ridge 就等於 MAP。

<details>
<summary>正則化強度 λ 從哪裡來</summary>

取負 log 後，資料項前面的係數是 1/σ²（雜訊變異數），先驗項前面的係數是 1/σ_w²（權重先驗變異數）。講義在推導裡把整個式子乘上 σ²，所以 λ 就是兩個變異數的比值：雜訊越大、或越不相信權重會很大，λ 就越大。

</details>

## Lec 14：bias-variance

講義先列出一個模型要做到的事（擬合資料、解釋觀察、泛化、預測未來……），再用「這隻貓是真的很不爽，還是我們對人臉過擬合了？」帶出過擬合。接著把期望測試誤差拆成三項：

| 項 | 講義的定義 | 對應 |
|---|---|---|
| Bias | 預測值和真值之間的期望偏差，取決於你選的函數族 | 欠擬合 |
| Noise | 資料生成過程本身的隨機性：量測誤差、隨機性、缺少的資訊 | 你控制不了 |
| Model variance | 換一組訓練資料，預測值會變多少 | 過擬合 |

推導的關鍵技巧是「加一項再減一項」：在誤差式子裡插入 `h(x)`，再利用雜訊 ε 和 w 彼此獨立，讓交叉項消失。講義附了兩題小測驗，例如「E[t] 等於什麼」「E[ε] 等於什麼」，可以用來確認自己有跟上。

把這個拆解套回 ridge：λ 變大，權重縮小，模型變得不那麼有彈性，bias 上升，但對雜訊比較不敏感，variance 下降；λ 趨近 0 則相反。講義的一句話總結是「正則化是一個拿 variance 換 bias 的機制」。實驗例子沿用 Bishop 的設定：N = 25 筆雜訊觀察，用 M = 24 個高斯基底函數加偏差項擬合，重複產生很多組資料。結果是訓練誤差隨 λ 單調上升，測試誤差呈 U 形，λ 要用 validation 決定。

## Lec 14 的後段：Chatbot Arena 與怎麼讀論文

這一段只見於 `lec14.pdf`，錄影字幕沒有。講義最後一段介紹 [Chatbot Arena](https://arxiv.org/abs/2403.04132)。它是一個公開平台，使用者輸入 prompt，兩個匿名模型並排回答，由使用者投票哪個比較好，再把大量對戰結果彙整成排行榜。講義點出它和本講的關聯：排行榜分數來自 Bradley–Terry 模型，而這個模型本質上就是 logistic regression（Y = 誰贏），模型的 Arena Score 就是迴歸係數 β。

接著是一份讀論文的清單，共五個問題：

1. 這篇在解決什麼問題？
2. 過去的做法是什麼，哪裡不夠？
3. 關鍵洞見是什麼，它做了哪些前人沒做的事？
4. 方法的輸入和輸出是什麼？
5. 有什麼限制？

講義註明前四題通常在 introduction 就找得到。這一段直接對應 [HW2 的論文題](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)，寫作業前建議先看這幾頁。

## Lec 16：從壓縮理解熵

`lec16.pdf` 不從公式開始，而是從一個壓縮問題開始。假設西雅圖每天下雨的機率是 80%，彼此獨立，連續記錄 100 天，這串資料有多少資訊？能壓到多短？

- **熵**：Shannon 的壓縮定理說，熵就是壓縮的極限。這個例子的 100 bits 可以壓到約 73 bits。每天都下雨就完全沒有資訊，可以壓到 0 bits；公平硬幣的熵是每次 1 bit，最難壓縮。
- **直覺**：從 L 個東西裡指出一個需要 log L bits。隨機序列幾乎只會出現「典型序列」，所以只需要 log（典型序列的數量）bits。講義說這本質上就是大數法則（Asymptotic Equipartition Property），細節推薦去看 Cover & Thomas 的《Elements of Information Theory》。
- **練習題**：8 匹馬的賽馬問題。直接編碼要 3 bits，講義要你算出熵，判斷給定的編碼是否達到 Shannon 極限。

## Lec 16：KL、cross-entropy，再回到 logistic regression

接下來講義用「bits」重新解釋兩個量：

- **Cross-entropy**：資料的真實分布是 p，但你用為 q 設計的壓縮方案時，總共需要多少 bits。
- **KL divergence**：比最佳方案多浪費了多少 bits。

所以 cross-entropy = 熵 + KL。講義用一句話總結：「你不能用為 q 設計的方案去壓縮 p」。講義也預告，cross-entropy 會是 logistic regression 和深度學習共用的損失函數。

回到 logistic regression，講義先強調「logistic regression 不是回歸，是二元分類」，並和 generative 模型對照：假設 x 在各類別是高斯、共用共變異數，會得到 LDA；共變異數不同則是 QDA。接著用一個預測客戶會不會點房屋保險廣告的例子（兩個特徵，參數 `w = [0.1, 1, 10]`），一步步算分數、過 sigmoid 得到點擊機率、寫出整份資料的 likelihood，最後指出 log-likelihood 就是負的 cross-entropy。

多類別的部分把 sigmoid 換成 softmax，權重變成一個矩陣，機率是 `softmax(Wx)`，損失是 `−Σ yᵢ log pᵢ`。講義用 MNIST（60000 張手寫數字）和 CIFAR-10（每類 6000 張，50000 訓練、10000 測試）當資料集例子。

## 期中考：怎麼用官方考卷自評

這份考卷 18 頁、6 題，加上 1 分的 Honor Code 共 56 分。我讀完題目後，把六題對應回講次：

| 題目（原標題） | 配分 | 在考什麼 | 回頭看 |
|---|---|---|---|
| A Linear Affair | 5 | 線性回歸概念選擇題：對什麼是線性的、n ≫ d 與 n ≪ d 各會發生什麼 | Lec 7–10 |
| Smooth Operator | 7 | 懲罰相鄰權重差的平滑正則化：寫成 `‖Dw‖²`、求閉式解、看 λ → ∞ 的極限 | Lec 9–10 |
| Chill Gaussian Question | 11 | 多變量高斯均值的 MLE 與 MAP（高斯先驗），以及 n → ∞ 時 MAP 的行為 | Lec 5–6、14 |
| Ozan Risks It All for MoG | 11 | GMM 的 log-likelihood、責任值 rᵢₖ、σ² → 0 時退化成 k-means | Lec 4–7 |
| We Adopt a Sigma Grindset | 10 | LDA／QDA／logistic regression 哪個是 generative、哪個是 discriminative；共變異數相同時 log-odds 化簡成線性，LDA 和 logistic regression 是什麼關係；共變異數不同時 LDA／QDA 的 bias 與 variance | Lec 11–12、14、16 |
| On a Downward Spiral | 11 | 用三筆資料手算梯度與一步更新、SGD 梯度的性質、特徵尺度差 100 倍時梯度怎麼變、哪個模型沒有閉式解 | Lec 13、15 |

在題目裡我沒找到熵、KL、momentum 或 Adam，Lec 16 的內容主要透過 logistic regression 那題間接出現。不過這只代表這一份考卷，不代表考試範圍。

建議的自評流程：

1. 印出 `sp26-midterm.pdf`，計時 110 分鐘，不翻筆記寫完。
2. 對照 `sp26-midterm-sol.pdf`（25 頁）自己批改，照上表把失分的題目標上講次。
3. 只針對失分的題目，看播放清單裡對應的 Problem 影片。注意清單的排列是 Problem 1、2、3、4、6、5，第 5 題排在最後。
4. 想再練一份，同一個資料夾有 Fall 2025 的期中考和練習考（附解答）。它們是另一組講者出的題，可以用來檢查自己是不是只記住了某種出題風格。

## Fall 2026 對應講次

[Fall 2026](https://eecs189.org/fa26/) 把 bias-variance 放得更早：Lecture 7「Bias-Variance Trade-off + Regularization」，Logistic Regression 在 Lecture 8–9。期中考排在 10/20（Week 9），前一週的 10/16 有一場 Midterm Review。Fall 2026 的排程標題裡沒有獨立的熵／KL 講次。

## 延伸閱讀

- 機率前置：[Stanford CS109 Beta 分布](/posts/learning/2026-08-22-stanford-cs109-lecture-14-beta-distribution)、[資訊理論](/posts/learning/2026-08-22-stanford-cs109-lecture-18-information-theory)、[最大概似估計](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation)、[logistic regression](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression)
- 經典 ML 對照：[Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

上一篇：[Lec 13、15：收斂、Momentum、Adam、SGD](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers)。下一篇：[HW2 導讀](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)。

## 今晚可以做的動作

1. 把 ridge 的目標函數從「負 log 後驗」親手推一次，寫出 λ 等於哪兩個變異數的比值。
2. 算出西雅圖例子的熵 H(0.8)，確認 100 天約等於 73 bits。
3. 挑一個晚上，照上面的流程計時寫完 sp26 期中考。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 Spring 2026 課表與 YouTube 播放清單即時核對，嵌入的講課錄影都在清單中，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。Lec 14、Lec 16 影片主題相符；Chatbot Arena 與讀論文清單不在 Lec 14 錄影中，文中已標註只見於講義。

## 參考資料

- [CS189 Spring 2026 課程首頁與排程](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Resources（考古題資料夾入口）](https://eecs189.org/sp26/resources/)
- [Lecture 14 Notes 資料夾（lec14.pdf）](https://drive.google.com/drive/folders/1dXJkBmG5eKAaODUFlZy-ngJwwr2ON0fx)
- [Lecture 14 錄影：MLE, MAP and Bias-Variance Trade-off](https://www.youtube.com/watch?v=Z1KuNG9HyiQ)
- [Lecture 16 Notes 資料夾（lec16.pdf）](https://drive.google.com/drive/folders/1_Lc-MtkVryhi1nhB_BRCKhkKuJFOVkz-)
- [Lecture 16 錄影：Entropy, Information, and Logistic Regression](https://www.youtube.com/watch?v=ArSadC8hY-Q)
- [CS189 Spring 2026 期中考題（sp26-midterm.pdf）](https://drive.google.com/file/d/1KZFOxAYg4RYP_xzf5-OnjqVvZQ82Quw5/view)
- [CS189 Spring 2026 期中考解答（sp26-midterm-sol.pdf）](https://drive.google.com/file/d/1VCTJML71X_RZevsNpdsuy9IlFKl9QrxR/view)
- [期中考逐題講解播放清單](https://www.youtube.com/playlist?list=PL-ysCubq-Sa-oUudIQgL4uTjsiR-UWBlI)
- [Chiang et al., Chatbot Arena（arXiv:2403.04132）](https://arxiv.org/abs/2403.04132)
- [CS189 Fall 2026 排程](https://eecs189.org/fa26/)
