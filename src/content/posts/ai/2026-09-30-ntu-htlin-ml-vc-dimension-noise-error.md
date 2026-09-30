---
title: "林軒田機器學習基石 L7–L8：VC 維度怎麼量化模型複雜度，雜訊與誤差衡量又改變了什麼"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, learning-theory, ai-course, course-guide]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 4
tldr: "L7 把「最大的非 break point」命名為 VC 維度 d_VC，證明 d 維感知器的 d_VC = d + 1，再把 VC bound 改寫成「E_out ≤ E_in + 模型複雜度懲罰」：d_VC 太大或太小都不好。理論上要 N ≈ 10,000·d_VC 筆資料，實務上 10·d_VC 常常就夠。L8 把固定的目標函數換成機率分布 P(y|x)，說明 VC 理論在有雜訊時仍成立；誤差衡量要依應用而定，例如 CIA 指紋辨識把誤放入侵者罰 1000 倍，可以用「複製樣本」的方式化約成一般分類。"
description: "台大林軒田《機器學習基石》第 7–8 講導讀：VC 維度的定義、四個例子的 d_VC、d 維感知器 d_VC = d+1 的兩段證明、自由度直覺、VC bound 作為模型複雜度與樣本複雜度的解讀與它為什麼鬆；雜訊與機率目標、pointwise 誤差、ideal mini-target、依應用選誤差（超市與 CIA 指紋辨識）、加權分類與 weighted pocket。附 Fall 2026 extended slides 對深度學習時代的補充與 Fall 2024 HW3 練習對應。"
draft: false
glossary:
  - term: "VC 維度"
    aliases: ["VC dimension", "d_VC", "Vapnik–Chervonenkis dimension"]
    definition: "假說集合 H 能 shatter 的最多點數，也就是 m_H(N) = 2^N 成立的最大 N；等於最小 break point 減 1。"
    context: "林軒田《機器學習基石》L7 用它當模型複雜度的量尺；d 維感知器的 d_VC = d + 1。"
    links:
      - label: "L7 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf"
  - term: "ideal mini-target"
    aliases: ["理想小目標"]
    definition: "在有雜訊的情況下，給定一個輸入 x，讓平均誤差最小的預測值。它由 P(y|x) 和誤差衡量一起決定：0/1 誤差下是機率最大的 y，平方誤差下是 y 的期望值。"
    context: "林軒田《機器學習基石》L8 的用語。"
    links:
      - label: "L8 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 4 篇，接續[訓練與測試：成長函數與 break point](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)。範圍是[《機器學習基石》](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 7 講 The VC Dimension 與第 8 講 Noise and Error，是「Why Can Machines Learn?」的收尾。

這篇有兩個核心概念，分成兩個大節。L7 把上一篇的理論收成一個數字 d<sub>VC</sub>；L8 把理論推廣到有雜訊的資料與任意的誤差定義，也替下一篇的平方誤差與 cross-entropy 鋪路。

用到的官方材料：

- MOOC 投影片 [07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf)、[08_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf)，以及 Fall 2026 的 [07e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf)（L7 extended slides，5 頁）。
- [基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)第 26–33 支影片。
- 教科書 [Learning from Data](http://amlbook.com)（LFD）：L7 對應 2.2，L8 對應 1.4（依 [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) 與 [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) 課程頁）。
- 練習：[Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) 的 Q1、Q5–7。

**存取等級**：只看影片與投影片是 A2；加上 Fall 2024 作業 PDF 可到 A3，但沒有官方解答，批改只限修課生。分級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

**版本差異**：Fall 2024 的 [08u 投影片](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf)只有三個小節，拿掉了 MOOC 版的 Weighted Classification。Fall 2026 在 W4（09/30）課前必看清單裡，L8 也只列前三支影片。加權分類在本篇保留，因為 MOOC 仍有這一節，而且技法的 AdaBoost 會用到同樣的想法。

## 第一部分：VC 維度

### 定義

投影片第 4 頁：**H 的 VC 維度 d<sub>VC</sub>(H)，是讓 m<sub>H</sub>(N) = 2<sup>N</sup> 成立的最大 N**。換句話說：

- 它是 H 最多能 shatter 幾個點。
- d<sub>VC</sub> = 最小 break point − 1。
- N ≤ d<sub>VC</sub>：存在某 N 個點可以被 shatter。k > d<sub>VC</sub>：k 一定是 break point。

上一篇的 bounding function 在 N ≥ 2、d<sub>VC</sub> ≥ 2 時可以鬆鬆地寫成 m<sub>H</sub>(N) ≤ N<sup>d<sub>VC</sub></sup>。上一篇的四個例子換成 d<sub>VC</sub>：positive rays 是 1，positive intervals 是 2，convex sets 是 ∞，二維感知器是 3。

投影片第 6 頁強調這個保證的性質：只要 d<sub>VC</sub> 有限，g 就會泛化（E<sub>out</sub> ≈ E<sub>in</sub>），**不管用什麼演算法、輸入分布是什麼、目標函數是什麼**。代價是它是最壞情況下的保證。

投影片第 7 頁的小題值得停一下：找到一組 N 個點不能被 shatter，能推出什麼？答案是什麼都推不出來。可能有另一組 N 個點能 shatter，也可能沒有。VC 維度的定義裡，「存在」和「對所有」要分清楚。

### d 維感知器的 d<sub>VC</sub> = d + 1

投影片第 9–15 頁分成兩個方向證明。

**d<sub>VC</sub> ≥ d + 1**：只要找到**某一組** d + 1 個點能 shatter。取第一列是 (1, 0, …, 0)、其餘第 i 列在第 i 維多一個 1 的矩陣 X，它是可逆的。對任何想要的標籤 y，直接取 w = X<sup>−1</sup>y，就有 sign(Xw) = y。

**d<sub>VC</sub> ≤ d + 1**：要證明**任何** d + 2 個點都不能 shatter。d + 2 個 d + 1 維向量一定線性相依，可以寫成 x<sub>d+2</sub> = a₁x₁ + … + a<sub>d+1</sub>x<sub>d+1</sub>。如果前 d + 1 個點的標籤取 sign(a<sub>i</sub>)，那 w<sup>T</sup>x<sub>d+2</sub> 每一項都是正的，x<sub>d+2</sub> 不可能被標成 ×。線性相依限制了能產生的 dichotomy。

所以 1126 維感知器的 d<sub>VC</sub> 是 1127（投影片第 16 頁的小題）。[07e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf) 補充：過原點的 d 維感知器 d<sub>VC</sub> = d，並且指出證明 d<sub>VC</sub> 有時比直接推 m<sub>H</sub>(N) 容易。

### 物理直覺：自由度

投影片第 17–18 頁：感知器的參數 w = (w₀, …, w<sub>d</sub>) 提供了自由度，d<sub>VC</sub> = d + 1 可以看成「有效的二元自由度」。positive rays 有一個自由參數 a，d<sub>VC</sub> = 1；positive intervals 有 ℓ、r 兩個，d<sub>VC</sub> = 2。經驗法則是 **d<sub>VC</sub> ≈ 自由參數個數**，投影片特別加註「但不總是如此」。

### VC bound 的兩種讀法

把 VC bound 反過來寫（投影片第 21 頁）：以至少 1 − δ 的機率，

E<sub>out</sub>(g) ≤ E<sub>in</sub>(g) + √( (8/N) · ln( 4(2N)<sup>d<sub>VC</sub></sup> / δ ) )

根號那一項叫 Ω(N, H, δ)，是**模型複雜度的懲罰**。

**讀法一：模型複雜度**（第 22 頁）。d<sub>VC</sub> 變大，E<sub>in</sub> 下降但 Ω 上升；d<sub>VC</sub> 變小則反過來。最好的 d<sub>VC</sub> 在中間。投影片的結論是「powerful H not always good!」。這張圖在 L13 講過擬合時會再出現。

**讀法二：樣本複雜度**（第 23 頁）。給定 ε = 0.1、δ = 0.1、d<sub>VC</sub> = 3，要讓 bound 小於 δ，N 要到大約 29,300。投影片的整理是：理論上需要 N ≈ 10,000·d<sub>VC</sub>，**實務上 N ≈ 10·d<sub>VC</sub> 往往就夠了**。

### 為什麼這麼鬆

投影片第 24 頁列了四個來源，每一個都是為了「對任何情形都成立」而付出的代價：

- Hoeffding 對任何分布、任何目標都要成立。
- 用 m<sub>H</sub>(N) 而不是手上這份資料實際的 dichotomy 數。
- 用 N<sup>d<sub>VC</sub></sup> 而不是 m<sub>H</sub>(N)，等於對所有 d<sub>VC</sub> 相同的 H 一視同仁。
- 對演算法可能做的任何選擇取 union bound。

投影片的結論是：很難做得更好，而且它對所有模型「差不多一樣鬆」，所以**重點是它的哲學訊息**，不是數字。

07e extended slides 把這個問題拉到深度學習時代：VC bound 作為數學定理仍然成立，在概念上也仍把模型複雜度和泛化連起來；但對合理的 N 和 H，Ω 會遠大於 1，變成沒有意義的 bound，而 double descent 這類新觀察也還沒被完整解釋。投影片的建議是「take the philosophical message, not the mathematical numbers」。同一份 slides 也介紹了另一種複雜度量尺 Rademacher complexity，它是資料相依的，比成長函數軟，也比較容易推廣到迴歸。

**怎麼做**：挑一個你熟悉的模型，數它的自由參數，估一個 d<sub>VC</sub>，再對照你手上的資料量是不是有 10 倍以上。這是 VC 理論在日常最直接的用法。

## 第二部分：雜訊與誤差衡量

### 雜訊與機率目標

投影片第 3 頁用信用卡核卡舉例，雜訊有三種：好客戶被誤標成壞客戶（y 的雜訊）、條件一樣的客戶拿到不同標籤（也是 y 的雜訊）、客戶資料本身不準（x 的雜訊）。

VC bound 還成立嗎？投影片第 4 頁用彈珠說明：原本每顆彈珠的顏色是固定的（⟦f(x) ≠ h(x)⟧），現在顏色是隨機的（⟦y ≠ h(x)⟧，y 從 P(y|x) 抽出）。只要 (x, y) 是從 P(x, y) i.i.d. 抽出，抽樣估計比例這件事的本質沒變，**VC 理論照樣成立**。

於是目標函數 f 換成**目標分布 P(y|x)**（第 5 頁）。例如 P(○|x) = 0.7、P(×|x) = 0.3，可以看成理想目標 f(x) = ○ 加上 0.3 的翻轉雜訊；確定性的 f 只是 P(y|x) 的特例。學習的目標變成：在常見的輸入上（依 P(x)），預測理想的目標（依 P(y|x)）。這也解釋了 L2 的 pocket 演算法為什麼有意義：資料不可分，未必是目標不是線性的，也可能只是雜訊。

### 誤差衡量決定理想目標

投影片第 8–10 頁把誤差定義一般化成 pointwise 的 err(ỹ, y)，E<sub>in</sub> 是在 N 筆資料上平均，E<sub>out</sub> 是對分布取期望。兩個最常見的是：

- **0/1 誤差** ⟦ỹ ≠ y⟧：對或錯，常用於分類。
- **平方誤差** (ỹ − y)²：差多遠，常用於迴歸。

第 11 頁的例子說明雜訊與誤差如何一起決定理想目標。設 P(y=1|x) = 0.2、P(y=2|x) = 0.7、P(y=3|x) = 0.1：

- 用 0/1 誤差，最好的預測是 2，平均誤差 0.3。預測 1.9 的平均誤差是 1.0，因為它永遠不會剛好對。
- 用平方誤差，最好的預測是期望值 1.9，平均誤差 0.29。

也就是說，0/1 誤差下的理想目標是 argmax P(y|x)，平方誤差下是 Σ y·P(y|x)。第 13 頁的小題再補一個：絕對誤差 |ỹ − y| 下是加權中位數。

### 誤差要依應用而定

投影片第 14–16 頁用指紋辨識說明兩種錯誤的代價不對稱：

- **超市**用指紋給折扣：誤拒（false reject）會讓客人不開心、流失生意，代價設 10；誤放（false accept）只是送出一點折扣，代價設 1。
- **CIA** 用指紋管門禁：誤放入侵者後果嚴重，代價設 1000；誤拒員工只是讓他不開心，代價設 1。

第 17 頁的結論是：**真正的 err 由應用和使用者決定**。演算法實際最佳化的是另一個 êrr（algorithmic error measure），選它有兩種理由：

- **plausible**：有道理。0/1 對應最小翻轉雜訊，但最佳化是 NP-hard；平方誤差對應高斯雜訊。
- **friendly**：好最佳化，有閉式解，或目標函數是凸的。

接下來 L9–L10 的線性迴歸與邏輯迴歸，就是兩個 friendly êrr 的例子。

### 加權分類：用複製樣本化約

CIA 的代價矩陣寫成 E<sub>in</sub>，就是真實標籤為 −1 的錯誤乘上 1000（第 20 頁），這叫**加權分類**。

怎麼最佳化？PLA 在可分資料上不受影響。pocket 可以把替換規則改成「新的 w 讓加權 E<sub>in</sub> 更小才換」，但原本 pocket 的保證還在嗎？

第 22–23 頁給了系統性的做法：把每筆 −1 的例子**複製 1000 次**，原問題的加權 E<sub>in</sub> 就等於新資料集上的一般 0/1 E<sub>in</sub>。實作上不用真的複製，只要讓 weighted PLA 以 1000 倍的機率去檢查 −1 例子的錯誤，再搭配加權的 pocket 替換規則。這種「把新問題化約成已解決的問題」的手法叫 **reduction**，投影片指出它可以套用在很多演算法上。

第 24 頁的小題提醒一個實務問題：10 個入侵者、999,990 個員工，一個永遠回答 +1 的常數分類器，加權 E<sub>in</sub> 是 0.01。資料極度不平衡時，適當設定權重可以避免模型偷懶地只猜多數類別。

**怎麼做**：下次遇到不平衡分類，先寫下兩種錯誤各自的代價，再決定是調整樣本權重、還是調整決策門檻。Fall 2024 HW3 Q6 就是要你推出超市代價下的門檻 α。

## 影片清單

L7 The VC Dimension：

- [Definition of VC Dimension](https://www.youtube.com/watch?v=XxPB9GlJEUk)
- [VC Dimension of Perceptrons](https://www.youtube.com/watch?v=WQzhc1IdB_I)
- [Physical Intuition of VC Dimension](https://www.youtube.com/watch?v=5-V5WCf8cY8)
- [Interpreting VC Dimension](https://www.youtube.com/watch?v=_DN_oF-i6ag)

L8 Noise and Error：

- [Noise and Probabilistic Target](https://www.youtube.com/watch?v=Br8J5pZM_CE)
- [Error Measure](https://www.youtube.com/watch?v=2gCnX0V1do8)
- [Algorithmic Error Measure](https://www.youtube.com/watch?v=0ApgGq4mh1E)
- [Weighted Classification](https://www.youtube.com/watch?v=XfuRb1jT4hs)（Fall 2026 未列入課前必看）

英文對照：[Caltech Learning from Data](https://work.caltech.edu/telecourse) 的 Lecture 7 同樣是 The VC Dimension。

## 練習：Fall 2024 HW3 Q1、Q5–7

[HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) 在 2024-10-07 發布、10/21 截止，題目涵蓋 L7 到 L10。跟本篇相關的四題：

- **Q1**（自動批改）：五個各只有一個參數的假說集合，哪一個的 d<sub>VC</sub> 最大。這題正好測試「d<sub>VC</sub> ≈ 自由參數個數，但不總是如此」。
- **Q5**：證明或反證 d<sub>VC</sub>(H₁ ∪ H₂) ≤ d<sub>VC</sub>(H₁) + d<sub>VC</sub>(H₂)。
- **Q6**：超市誤差下（誤拒比誤放重要 10 倍），理想目標變成 sign(P(y=+1|x) − α)，求 α。
- **Q7**：課堂上有兩種 E<sub>out</sub> 定義，一種跟 f 比、一種跟 P(y|x) 比。證明兩者之間的不等式，其中 E<sub>out</sub>(f) 代表無法消除的雜訊。

HW3 的其他題目（線性迴歸、hat matrix、cpusmall 實驗）放在[下一篇](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)。

**怎麼做**：Q1 的五個選項，先各自試著 shatter 1 個、2 個、3 個點，不要只數參數。沒有官方解答，Q6 可以代入具體的 P(y|x) 數值，檢查你推出的 α 在超市代價矩陣下真的讓期望代價最小。

Fall 2026 的 hw2 依課程頁排程在 10/07 公布，截至 2026-09-30 還沒公開。

## 下一步

下一篇[線性迴歸與邏輯迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)進入「How Can Machines Learn?」，用本篇的平方誤差推出線性迴歸的閉式解，再從 likelihood 推出 cross-entropy 與梯度下降。

延伸閱讀：Stanford CS229 的[泛化一章導讀](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization)用 bias–variance 的角度看同一個問題；Caltech 版的 Lecture 8 也是 Bias-Variance Tradeoff，跟林軒田把 L8 排成 Noise and Error 的路線不同，可以對照著看。

## 參考資料

- [Machine Learning Foundations / Techniques MOOC 頁（林軒田）](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [L7 The VC Dimension 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf)
- [L8 Noise and Error 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf)
- [L7 extended slides（Fall 2026）](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf)
- [Fall 2024 版 L8 投影片（08u）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf)
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
- [Learning from Data 教科書](http://amlbook.com)
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
