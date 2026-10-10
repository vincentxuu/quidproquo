---
title: "林軒田機器學習基石 L9–L10：從線性迴歸的閉式解，走到邏輯迴歸的梯度下降"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, linear-regression, logistic-regression, ai-course, course-guide]
lang: zh-TW
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 5
tldr: "線性迴歸把平方誤差寫成 (1/N)‖Xw − y‖²，梯度設為零就得到 w_LIN = X†y，一步算完。hat matrix H = XX† 把 y 投影到 X 的欄空間，由此推出平均而言 E_out − E_in ≈ 2(d+1)/N。邏輯迴歸用 θ(wᵀx) 估計 P(+1|x)，由最大概似推出 cross-entropy 誤差 ln(1 + exp(−y wᵀx))；它沒有閉式解，只能沿著 −∇E_in 一步步往下走，這就是梯度下降。"
description: "台大林軒田《機器學習基石》第 9–10 講導讀：線性迴歸的假說與平方誤差、矩陣形式與梯度、pseudo-inverse 解、hat matrix 的幾何意義與學習曲線、拿迴歸做分類；邏輯迴歸的 soft binary classification、logistic 函數、從 likelihood 推 cross-entropy、梯度推導、梯度下降與固定學習率。附 Fall 2024 版投影片差異，以及 HW3 cpusmall 學習曲線實驗與 HW4 Q1 的練習對應。"
draft: false
glossary:
  - term: "pseudo-inverse"
    aliases: ["虛反矩陣", "X†", "偽逆矩陣"]
    definition: "線性迴歸的解 w_LIN = X†y 中的 X†。X^T X 可逆時等於 (X^T X)^{-1} X^T；不可逆時仍可用其他方式定義，給出眾多最佳解中的一個。"
    context: "林軒田建議用現成、數值穩定的 pseudo-inverse 程式，而不是自己算 (X^T X)^{-1}。"
    links:
      - label: "L9 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
  - term: "hat matrix"
    aliases: ["帽子矩陣", "H = XX†"]
    definition: "線性迴歸裡把標籤向量 y 變成預測向量 ŷ 的矩陣 H = XX†，幾何上是把 y 投影到 X 的欄空間。名字來自它替 y「戴上帽子」變成 ŷ。"
    context: "林軒田《機器學習基石》L9 用 trace(I − H) = N − (d+1) 推出線性迴歸的平均泛化誤差。"
    links:
      - label: "L9 投影片"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en)

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)系列第 5 篇，接續[VC 維度、雜訊與誤差衡量](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)。範圍是[《機器學習基石》](https://www.csie.ntu.edu.tw/~htlin/mooc/)第 9 講 Linear Regression 與第 10 講 Logistic Regression，進入四大問題的第三個：「How Can Machines Learn?」。

上一篇的結論是：演算法實際最佳化的誤差 êrr 要嘛「有道理」、要嘛「好最佳化」。這一篇就是兩個好最佳化的例子。平方誤差給出閉式解；cross-entropy 沒有閉式解，但夠平滑，可以用梯度下降。

用到的官方材料：

- MOOC 投影片 [09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf)、[10_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf)；Fall 2024 版 [09u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf)、[10u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf)。
- [基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)第 34–41 支影片。
- 教科書 [Learning from Data](http://amlbook.com)（LFD）：L9 對應 3.2，L10 對應 3.3（依 [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)）。
- 練習：[Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) 的迴歸題與 cpusmall 實驗、[Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) Q1。

**存取等級**：只看影片與投影片是 A2；加上 Fall 2024 作業 PDF 與公開的 LIBSVM 資料集可到 A3，但沒有官方解答，批改只限修課生。分級定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)。

**版本差異**：Fall 2024 的 09u 只有三個小節，拿掉了 MOOC 版的 Linear Regression for Binary Classification；Fall 2024 的 L11（11u）則以 Linear Models for Binary Classification 開場。本篇仍依 MOOC 版講完這一節。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把 L9–L10 排在 W5（10/07），截至 2026-09-30，這一週的 09u 投影片還沒公開。

## 課程影片來源

以下沿用本文已列出的課程影片來源；尚未逐支重新驗證可播放狀態，不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=qGzjYrLV-4Y
title: Linear Regression Problem
```

```youtube
url: https://www.youtube.com/watch?v=2LfdSCdcg1g
title: Linear Regression Algorithm
```

原始影片：[Linear Regression Problem](https://www.youtube.com/watch?v=qGzjYrLV-4Y)、[Linear Regression Algorithm](https://www.youtube.com/watch?v=2LfdSCdcg1g)、[Generalization Issue](https://www.youtube.com/watch?v=lj2jK1FSwgo)、[Linear Regression for Binary Classification](https://www.youtube.com/watch?v=tF1HTirYbtc)、[Logistic Regression Problem](https://www.youtube.com/watch?v=4rPupwSdAac)、[Logistic Regression Error](https://www.youtube.com/watch?v=Uw62i3-Tr4Q)、[Gradient of Logistic Regression Error](https://www.youtube.com/watch?v=IZttt_v5tSw)、[Gradient Descent](https://www.youtube.com/watch?v=X9NTihvSdjw)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## 第一部分：線性迴歸

### 問題：輸出是實數

投影片第 2–5 頁把信用卡問題從「要不要核卡」改成「額度給多少」，輸出空間 Y = ℝ，這就是迴歸。假說和感知器幾乎一樣，只是拿掉 sign：

h(x) = w<sup>T</sup>x

目標是找到殘差小的直線或超平面，誤差用平方誤差：E<sub>in</sub>(w) = (1/N) Σ (w<sup>T</sup>x<sub>n</sub> − y<sub>n</sub>)²。

### 演算法：一步算完

把 N 筆資料疊成 N × (d+1) 的矩陣 X 與 N 維向量 y，E<sub>in</sub> 可以寫成（第 7 頁）：

E<sub>in</sub>(w) = (1/N) ‖Xw − y‖²

它連續、可微、而且是凸的，所以最佳解就在梯度為零的地方（第 8 頁）。展開後對 w 微分（第 9 頁）：

∇E<sub>in</sub>(w) = (2/N) (X<sup>T</sup>Xw − X<sup>T</sup>y)

令它等於零（第 10 頁）：

- X<sup>T</sup>X **可逆**時，唯一解是 w<sub>LIN</sub> = (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup>y。因為通常 N 遠大於 d + 1，這是常見情形。
- X<sup>T</sup>X **不可逆**時，有很多最佳解，用其他方式定義 X† 仍然能給出其中一個。

兩種情形統一寫成 **w<sub>LIN</sub> = X†y**，X† 叫 pseudo-inverse。投影片的實務建議是：接近奇異時，用實作良好的 † 程式，不要自己算 (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup>，數值比較穩定。

完整演算法只有三步（第 11 頁）：建 X 與 y、算 X†、回傳 X†y。

### 這算是「學習」嗎

投影片第 13 頁正反兩面都列了。說不是：它是閉式解，瞬間算完，沒有一步步改善 E<sub>in</sub>。說是：E<sub>in</sub> 是最佳的，d<sub>VC</sub> 有限所以 E<sub>out</sub> 也有保證，而且 pseudo-inverse 程式內部其實也是迭代的。結論是：**只要 E<sub>out</sub>(w<sub>LIN</sub>) 夠好，學習就發生了**。

### Hat matrix：比 VC 更簡單的保證

預測向量 ŷ = Xw<sub>LIN</sub> = XX†y。投影片第 14 頁把 H = XX† 叫做 **hat matrix**，因為它替 y 戴上帽子變成 ŷ。

幾何上（第 15 頁）：ŷ 一定在 X 各欄張成的空間裡；要讓 y − ŷ 最短，y − ŷ 必須垂直於這個空間。所以 H 就是**把 y 投影到 X 的欄空間**，I − H 則把 y 變成垂直於欄空間的殘差。投影片留了一個問題：為什麼 trace(I − H) = N − (d + 1)？

假設 y 等於欄空間裡某個理想的 f(X) 加上雜訊，雜訊每一維的強度是 σ²。I − H 把理想部分消掉、只作用在雜訊上，於是（第 16 頁）：

- 平均 E<sub>in</sub> = σ² · (1 − (d+1)/N)
- 平均 E<sub>out</sub> = σ² · (1 + (d+1)/N)（投影片註明推導較複雜）

這兩條就是線性迴歸的**學習曲線**（第 17 頁）。N 趨近無限大時兩者都收斂到雜訊強度 σ²，平均的泛化誤差是 2(d+1)/N，跟 VC 的最壞情況保證形狀相近。

投影片第 18 頁的小題列了 H 的性質：H 對稱、H² = H（投影兩次等於投影一次）、(I − H)² = I − H。這些可以直接從「投影」的物理意義想出來。

<details>
<summary>拿線性迴歸做分類（MOOC 投影片第 19–22 頁；Fall 2024 版沒有這一節）</summary>

{−1, +1} 是 ℝ 的子集，所以可以直接在分類資料上跑線性迴歸，再回傳 sign(w<sub>LIN</sub><sup>T</sup>x)。線性分類在一般情況下是 NP-hard，線性迴歸則有很有效率的閉式解。

為什麼說得通？因為對 y ∈ {−1, +1}，0/1 誤差 ⟦sign(w<sup>T</sup>x) ≠ y⟧ 永遠不超過平方誤差 (w<sup>T</sup>x − y)²。代進 VC bound：分類的 E<sub>out</sub> ≤ 分類的 E<sub>in</sub> + … ≤ 迴歸的 E<sub>in</sub> + …。這是用 bound 的鬆緊換取效率。

投影片的建議：w<sub>LIN</sub> 可以當作有用的 baseline 分類器，或當 PLA／pocket 的初始向量。第 22 頁的小題列出三個 0/1 誤差的上界：exp(−y w<sup>T</sup>x)、max(0, 1 − y w<sup>T</sup>x)、log₂(1 + exp(−y w<sup>T</sup>x))，並預告其中一個就是下一講的主角。

</details>

**怎麼做**：用 NumPy 隨機產生 N = 100、d = 5 的資料，比較 `np.linalg.pinv(X) @ y` 與自己算 `inv(X.T @ X) @ X.T @ y` 的結果；再把某一欄改成另一欄的兩倍，讓 X<sup>T</sup>X 變成奇異，看哪一個會出問題。

## 第二部分：邏輯迴歸

### 問題：想要的是機率

投影片第 2–4 頁換成心臟病預測。硬分類問的是「會不會發作」，理想目標是 sign(P(+1|x) − ½)。但醫生更想知道「發作風險 80%」，這時目標變成 f(x) = P(+1|x) ∈ [0, 1]，叫做 **soft binary classification**。

麻煩在資料：我們拿不到每個病人真正的機率，只看得到從 P(y|x) 抽出來的 ○ 或 ×。資料跟硬分類一模一樣，目標函數卻不同。

### Logistic 假說

先算一個加權風險分數 s = w<sup>T</sup>x，再用 logistic 函數把它壓進 0 到 1（第 5–6 頁）：

θ(s) = 1 / (1 + e<sup>−s</sup>)，θ(−∞) = 0、θ(0) = ½、θ(∞) = 1

它平滑、單調、呈 S 形（sigmoid）。邏輯迴歸就是用 h(x) = θ(w<sup>T</sup>x) 去逼近 P(+1|x)。

第 8 頁把三個線性模型並排：它們都算同一個分數 s = w<sup>T</sup>x，差別只在輸出怎麼處理、誤差怎麼選。

| | 線性分類 | 線性迴歸 | 邏輯迴歸 |
|---|---|---|---|
| h(x) | sign(s) | s | θ(s) |
| 誤差 | 0/1（plausible） | 平方（friendly） | ？ |

### 從 likelihood 推出 cross-entropy

邏輯迴歸的誤差要怎麼定？投影片第 9–11 頁用最大概似：

1. 如果 h ≈ f，那 h 產生這份資料的機率（likelihood）應該跟 f 產生它的機率差不多，而 f 產生手上這份資料的機率通常很大。所以挑 likelihood 最大的 h。
2. logistic 函數有個對稱性：1 − θ(s) = θ(−s)。因此不管標籤是 ○ 還是 ×，每一筆的機率都能寫成 h(y<sub>n</sub>x<sub>n</sub>)，likelihood 正比於 Π θ(y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>)。
3. 取 ln、加負號、除以 N，最大化就變成最小化：

E<sub>in</sub>(w) = (1/N) Σ ln(1 + exp(−y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>))

每一項 err(w, x, y) = ln(1 + exp(−y w<sup>T</sup>x)) 叫 **cross-entropy error**。第 12 頁的小題請你畫出它對分數 s 的曲線：它永遠大於 0；預測正確時小於 ln 2，錯誤時至少 ln 2；而且沒有上界。

### 梯度與為什麼沒有閉式解

E<sub>in</sub> 連續、二次可微、而且是凸的（第 13 頁），所以一樣要找梯度為零的點。用連鎖律推導（第 14 頁）：

∇E<sub>in</sub>(w) = (1/N) Σ θ(−y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>) · (−y<sub>n</sub>x<sub>n</sub>)

這是 −y<sub>n</sub>x<sub>n</sub> 的加權和，權重是 θ(−y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>)。第 15 頁分析什麼時候它等於零：要嘛每個 θ 都是 0，這只有在資料線性可分、而且每筆 y<sub>n</sub>w<sup>T</sup>x<sub>n</sub> 都遠大於 0 時才會發生；要嘛加權和剛好抵消，但那是 w 的非線性方程式。**沒有閉式解。**

第 17 頁的小題點出權重的意義：θ 是單調的，所以 y<sub>n</sub>w<sup>T</sup>x<sub>n</sub> 最小的那筆，也就是錯得最離譜的那筆，對梯度的貢獻最大。

### 梯度下降

沒有閉式解，就回到 PLA 的精神：從某個 w₀ 出發，反覆更新 w<sub>t+1</sub> ← w<sub>t</sub> + ηv（第 16 頁）。PLA 的 v 來自修正錯誤；E<sub>in</sub> 平滑時，可以選一個讓它「往下滾」的方向。

推導分三步（第 18–22 頁）：

1. 貪婪地想在單位長度的 v 裡找讓 E<sub>in</sub>(w<sub>t</sub> + ηv) 最小的方向，但這跟原問題一樣難。
2. η 很小時用泰勒展開做線性近似：E<sub>in</sub>(w<sub>t</sub> + ηv) ≈ E<sub>in</sub>(w<sub>t</sub>) + ηv<sup>T</sup>∇E<sub>in</sub>(w<sub>t</sub>)。最好的 v 就是梯度的反方向 −∇E<sub>in</sub>/‖∇E<sub>in</sub>‖。
3. η 太小走太慢，太大會不穩定。投影片建議讓步長跟 ‖∇E<sub>in</sub>‖ 成正比，兩者抵消後就得到**固定學習率的梯度下降**：w<sub>t+1</sub> ← w<sub>t</sub> − η∇E<sub>in</sub>(w<sub>t</sub>)。

完整的邏輯迴歸演算法（第 23 頁）：初始化 w₀，反覆算梯度、更新，直到梯度接近零或跑夠多輪。每一輪的時間複雜度跟 pocket 差不多。

第 24 頁的小題：w₀ = 0、η = 0.1，因為 θ(0) = ½，第一步得到 w₁ = 0.05 · (1/N) Σ y<sub>n</sub>x<sub>n</sub>。從零向量出發，一步就走到了 y<sub>n</sub>x<sub>n</sub> 的縮放平均。

**怎麼做**：把上面的更新式寫成十行 NumPy，在一份二維的可分資料上跑，畫出 E<sub>in</sub> 隨迭代次數下降的曲線；再把 η 調大十倍，看曲線會不會開始震盪。

## 影片清單

L9 Linear Regression：

- [Linear Regression Problem](https://www.youtube.com/watch?v=qGzjYrLV-4Y)
- [Linear Regression Algorithm](https://www.youtube.com/watch?v=2LfdSCdcg1g)
- [Generalization Issue](https://www.youtube.com/watch?v=lj2jK1FSwgo)
- [Linear Regression for Binary Classification](https://www.youtube.com/watch?v=tF1HTirYbtc)

L10 Logistic Regression：

- [Logistic Regression Problem](https://www.youtube.com/watch?v=4rPupwSdAac)
- [Logistic Regression Error](https://www.youtube.com/watch?v=Uw62i3-Tr4Q)
- [Gradient of Logistic Regression Error](https://www.youtube.com/watch?v=IZttt_v5tSw)
- [Gradient Descent](https://www.youtube.com/watch?v=X9NTihvSdjw)

## 練習：Fall 2024 HW3 與 HW4 Q1

[HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)（2024-10-07 發布、10/21 截止）跟本篇相關的題目：

- **Q2**：沒有 x₀ 的一維線性迴歸 h(x) = wx，最佳的 w<sub>lin</sub> 是什麼。
- **Q3**：對 X 做哪一種操作（縮放某一列、縮放某一欄、整體乘 2、把幾欄加到第一欄）可能改變 hat matrix H。
- **Q4**：從 [θ, 1] 均勻分布抽出的樣本，某個估計值的 likelihood。
- **Q8**：把每筆資料的 x₀ 從 1 改成 1126 再跑一次線性迴歸，證明新舊解之間差一個對角矩陣 D。
- **Q9**：換一種 sigmoid 假說，照邏輯迴歸的步驟推出新的 E<sub>in</sub> 與它的梯度。
- **Q10–12（程式題）**：用 LIBSVM 網站的 [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) 資料集（8192 筆，12 個特徵）。Q10 取 N = 32 跑 1126 次線性迴歸，畫 (E<sub>in</sub>, E<sub>out</sub>) 散佈圖；Q11 對 N = 25、50、…、2000 各平均 16 次，畫學習曲線；Q12 只用前 2 個特徵重做一次，跟 Q11 比較。

[HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)（2024-10-21 發布、11/04 截止）：

- **Q1**：把標籤從 {−1, +1} 換成 {0, 1} 之後，哪一個式子等價於課堂上的 cross-entropy。題目也說明了「cross-entropy」這個名字來自 p log q + (1 − p) log(1 − q) 的形式。
- 延伸：**Q5** 用二階泰勒展開推出 Newton's method，並要求套用在邏輯迴歸的 cross-entropy 上，可以當成梯度下降的進階版。

**怎麼做**：Q11 畫出來的學習曲線，拿來跟本篇 hat matrix 那一節的 σ²(1 ± (d+1)/N) 對照形狀。沒有官方解答，程式結果可以用 scikit-learn 的 `LinearRegression` 或 `np.linalg.lstsq` 交叉驗算 w<sub>lin</sub>。

## 下一步

下一篇[線性分類模型、SGD、多類別與非線性轉換](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)會把本篇的三個線性模型放在同一張誤差圖上比較，把梯度下降改成隨機梯度下降（SGD），再用特徵轉換跳出「只能畫直線」的限制。

延伸閱讀：Stanford CS229 的[線性迴歸](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression)與[邏輯迴歸](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression)兩章導讀；Stanford CS109 的[最大概似估計](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation)與[邏輯迴歸](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression)從機率課的角度講同一件事。

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [Machine Learning Foundations / Techniques MOOC 頁（林軒田）](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [L9 Linear Regression 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf)
- [L10 Logistic Regression 投影片](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf)
- [Fall 2024 版 L9 投影片（09u）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf)
- [Fall 2024 版 L10 投影片（10u）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf)
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)
- [LIBSVM Data: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale)
- [Learning from Data 教科書](http://amlbook.com)
- [MOOC 投影片勘誤](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
