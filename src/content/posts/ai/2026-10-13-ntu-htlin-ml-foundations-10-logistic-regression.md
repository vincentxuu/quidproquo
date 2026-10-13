---
title: "邏輯迴歸：用梯度下降學出機率｜台大林軒田 機器學習基石 第 10 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, logistic-regression, gradient-descent]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 10
tldr: "邏輯迴歸用 θ(wᵀx) 估計 P(+1|x)，資料卻只有圈與叉。這堂課用最大概似推出 cross-entropy 誤差 ln(1 + exp(−y wᵀx))，用連鎖律算出梯度是 −yₙxₙ 的 θ 加權平均；令梯度為零是 w 的非線性方程式，沒有閉式解，所以改用固定學習率的梯度下降 w ← w − η∇E_in(w) 一步一步走到谷底。"
description: "台大林軒田機器學習基石第 10 堂 Logistic Regression 導讀：軟性二元分類、logistic 函數、從概似推出 cross-entropy、梯度的連鎖律推導、為什麼沒有閉式解、梯度下降與固定學習率，並用五筆資料把更新一步一步算完。"
draft: false
glossary:
  - term: "logistic 函數"
    aliases: ["logistic function", "sigmoid", "θ(s)"]
    definition: "θ(s) = 1 / (1 + e⁻ˢ)。把任何實數分數壓到 0 與 1 之間，平滑、單調、呈 S 形，θ(0) = ½，而且 1 − θ(s) = θ(−s)。"
    context: "基石第 10 堂用 h(x) = θ(wᵀx) 當假說，去逼近 P(+1|x)。"
    links:
      - label: "基石第 10 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf"
  - term: "cross-entropy 誤差"
    aliases: ["cross-entropy error", "交叉熵誤差"]
    definition: "邏輯迴歸對單筆資料的誤差 err(w, x, y) = ln(1 + exp(−y wᵀx))，y 取 +1 或 −1。它是概似取 ln、加負號之後每一筆資料的那一項。"
    context: "基石第 10 堂由最大概似推出它，E_in 是 N 筆的平均。"
    links:
      - label: "基石第 10 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf"
  - term: "固定學習率的梯度下降"
    aliases: ["fixed learning rate gradient descent", "gradient descent", "梯度下降"]
    definition: "反覆做 w ← w − η∇E_in(w) 的迭代最佳化方法。η 是固定的正數，叫學習率；實際跨出去的長度是 η 乘上梯度的長度，所以坡愈陡走愈遠。"
    context: "基石第 10 堂用它解沒有閉式解的邏輯迴歸。"
    links:
      - label: "基石第 10 堂講義"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [10_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/25 到 25/25），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 10 堂。講義第 1 頁的 Roadmap 把它放在四大問題的第三個「How Can Machines Learn?」底下，緊接在[基石第 9 堂：線性迴歸](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)之後。上一堂在同一頁上只留一行：線性迴歸假說配平方誤差，有解析解 $\mathbf{w}_{\text{LIN}} = X^\dagger \mathbf{y}$。課堂上開場說，Logistic Regression 和 Linear Regression 只差一個字，這堂要看的就是那個字帶來什麼。

差別有兩個。第一，輸出要的是 0 到 1 之間的機率，但資料裡沒有機率，只有發生與沒發生。第二，推出來的誤差函數沒辦法像線性迴歸那樣一步算出最佳解，得一步一步走。

先備是線性迴歸的「令梯度為零」解法、[基石第 2 堂：感知器與 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)的更新規則、[基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)的目標分布 $P(y \mid \mathbf{x})$ 與逐點誤差，以及偏微分、連鎖律、指數與對數。讀完之後，你應該能自己從「挑概似最大的假說」推到 cross-entropy 誤差，用連鎖律算出它的梯度，說明為什麼沒有閉式解，推出梯度下降的更新式，並對一組小資料手算幾步更新。

整堂課的推導順序如下：

1. **問題**：目標函數從 $\pm 1$ 換成機率 $P(+1 \mid \mathbf{x})$。
2. **假說**：分數 $\mathbf{w}^\top\mathbf{x}$ 過一個 logistic 函數 $\theta$。
3. **誤差**：由最大概似得到 cross-entropy。
4. **梯度**：連鎖律算出 $\nabla E_{\text{in}}(\mathbf{w})$。
5. **卡關**：梯度為零的方程式解不出來。
6. **演算法**：梯度下降，一步一步往谷底走。

## 目標換成機率：軟性二元分類與 logistic 假說

```youtube
url: https://www.youtube.com/watch?v=4rPupwSdAac
title: Logistic Regression :: Logistic Regression Problem @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:00 複習上一堂，01:00–04:03 心臟病問題，04:03–07:47 理想資料與實際資料，07:47–13:06 logistic 假說與 logistic 函數，之後是 Fun Time。）

### 從「有沒有」到「風險多少」

講義第 2 頁把學習流程圖搬回來，例子換成醫院：輸入是病人的年齡、性別、血壓、膽固醇、體重（投影片上的那位是 40 歲、男性、血壓 130/85、膽固醇 240、體重 70），輸出是「有沒有心臟病」。這是一般的二元分類。基石第 8 堂講過，資料有雜訊時用目標分布 $P(y \mid \mathbf{x})$ 描述問題，而在 0/1 誤差底下，理想的目標函數是

$$
f(\mathbf{x}) = \text{sign}\Big(P(+1 \mid \mathbf{x}) - \frac{1}{2}\Big) \in \{-1, +1\}
$$

也就是看機率落在一半的哪一邊。講義註明這個選擇是 because of classification err：我們在意的是分錯的比例。課堂上補了一句，圖上為了簡潔，沒有畫出產生輸入的那個 $P(\mathbf{x})$ 的格子。

第 3 頁把問題改掉一個字：從 heart disease 變成 heart attack，輸出從 yes 變成「80% risk」。課堂上的說明是，醫生常常需要回答的問題是幾個月之後心臟病發（或癌症復發）的可能性有多高，而不只是有或沒有。這時我們想知道的就是 $P(+1 \mid \mathbf{x})$ 這個值本身，目標函數變成

$$
f(\mathbf{x}) = P(+1 \mid \mathbf{x}) \in [0, 1]
$$

講義稱它為 'soft' binary classification：輸出不再是硬梆梆的圈或叉，而是一個風險值。

### 想要的資料與拿得到的資料

要學一個輸出機率的 $f$，最理想的資料是每個 $\mathbf{x}_n$ 都附上它的機率。講義第 4 頁左欄把這種資料叫 ideal (noiseless) data：

| | 理想（無雜訊）的資料 | 實際（有雜訊）的資料 |
|---|---|---|
| 第 1 筆 | $y'_1 = 0.9 = P(+1 \mid \mathbf{x}_1)$ | $y_1 = \circ$，從 $P(y \mid \mathbf{x}_1)$ 抽出來 |
| 第 2 筆 | $y'_2 = 0.2 = P(+1 \mid \mathbf{x}_2)$ | $y_2 = \times$，從 $P(y \mid \mathbf{x}_2)$ 抽出來 |
| 第 $N$ 筆 | $y'_N = 0.6 = P(+1 \mid \mathbf{x}_N)$ | $y_N = \times$，從 $P(y \mid \mathbf{x}_N)$ 抽出來 |

有左欄的資料，事情就跟迴歸差不多：找一個在這些點上預測值接近 0.9、0.2、0.6 的假說。但左欄拿不到。課堂上用醫院的病歷說明：病歷上記的是病人兩三個月後有沒有心臟病發，沒有人知道那個機率到底是 0.9 還是 0.2。

所以手上只有右欄。講義同一頁的第二張把右欄改寫成數字：如果用 1 代表圈、0 代表叉，三筆資料分別是 $y'_1 = 1$、$y'_2 = 0$、$y'_N = 0$，各是「依 $P(y \mid \mathbf{x}_n)$ 抽一次，抽到圈了嗎」的結果。課堂上把這解讀成：實際資料是理想資料的有雜訊版本。想要 0.9，抽樣後拿到 1；想要 0.2，拿到 0；第三筆機率明明是 0.6，比一半大，抽樣卻剛好抽到另一邊，拿到 0，誤差相當大。

講義用一句話收尾：same data as hard binary classification, different target function。資料的形式和一般二元分類一模一樣，要學的東西不同。這堂課接下來的問題就是：只有圈和叉，怎麼學出一個輸出機率的假說。

### logistic 假說：分數再過一個 S 形函數

假說的第一步跟前面幾堂一樣（第 5 頁）。把病人的特徵寫成 $\mathbf{x} = (x_0, x_1, x_2, \dots, x_d)$，其中 $x_0$ 是常數項，算一個加權的「風險分數」：

$$
s = \sum_{i=0}^{d} w_i x_i = \mathbf{w}^\top\mathbf{x}
$$

線性迴歸直接輸出 $s$，但 $s$ 可以是任何實數，我們要的是 0 到 1 之間的值。做法是分數愈高就說風險愈大，再用一個 S 形的函數 $\theta$ 把分數換成機率。講義把 $\theta$ 叫 logistic function，假說寫成

$$
h(\mathbf{x}) = \theta(\mathbf{w}^\top\mathbf{x})
$$

第 5 頁的圖橫軸是分數 $s$，縱軸從 0 到 1，藍色曲線從左下貼著 0 出發，在 $s = 0$ 附近爬升，往右貼近 1。課堂上的讀法是：拿到 1126 分，就在橫軸的 1126 那裡往上對到曲線，讀出要輸出的值；拿到 $-5$ 分也一樣。

### logistic 函數的式子

第 6 頁給出式子：

$$
\theta(s) = \frac{e^{s}}{1 + e^{s}} = \frac{1}{1 + e^{-s}}
$$

第二個等號是分子分母同除以 $e^s$。講義列了三個值，課堂上逐一檢查：

- $\theta(0) = \frac{1}{1 + 1} = \frac{1}{2}$，不偏不倚在中間。
- $s \to \infty$ 時，用右邊的寫法，$e^{-s} \to 0$，所以 $\theta(s) \to 1$。課堂上是用左邊的寫法講：分子分母都趨向無限大而且差不多大，比值跑到 1，並承認無限大除以無限大在數學上要更嚴格的定義。
- $s \to -\infty$ 時，用左邊的寫法，分子 $e^{s} \to 0$、分母趨近 1，所以 $\theta(s) \to 0$。

講義對它的形容是 smooth, monotonic, sigmoid function of $s$：平滑（處處可微）、單調、S 形。本文代幾個數字進去，感受它變化的速度：

| $s$ | $-5$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $5$ |
|---|---|---|---|---|---|---|---|
| $\theta(s)$ | 0.0067 | 0.1192 | 0.2689 | 0.5 | 0.7311 | 0.8808 | 0.9933 |

分數在 $-2$ 到 $2$ 之間時輸出變化最快，超過 $\pm 5$ 就幾乎貼在 0 或 1。表上還看得到一個之後會用到的性質：$\theta(-1) + \theta(1) = 1$、$\theta(-2) + \theta(2) = 1$，左右對稱的兩個分數，輸出加起來是 1。

合起來，邏輯迴歸就是用

$$
h(\mathbf{x}) = \frac{1}{1 + \exp(-\mathbf{w}^\top\mathbf{x})}
$$

去逼近目標函數 $f(\mathbf{x}) = P(+1 \mid \mathbf{x})$。

### Fun Time：把機率換回圈叉

**題目（第 7 頁）：** 任取一個 logistic 假說 $h(\mathbf{x}) = \frac{1}{1 + \exp(-\mathbf{w}^\top\mathbf{x})}$。用 $\text{sign}\big(h(\mathbf{x}) - \frac{1}{2}\big)$ 把它「轉成」二元分類的預測，這個預測等價於下面哪一個式子？

1. $\text{sign}\big(\mathbf{w}^\top\mathbf{x} - \frac{1}{2}\big)$
2. $\text{sign}\big(\mathbf{w}^\top\mathbf{x}\big)$
3. $\text{sign}\big(\mathbf{w}^\top\mathbf{x} + \frac{1}{2}\big)$
4. 以上皆非

**答案：2。** 講義的理由是 $\mathbf{w}^\top\mathbf{x} = 0$ 時 $h(\mathbf{x})$ 剛好是 $\frac{1}{2}$，所以在 $\frac{1}{2}$ 切 $h$ 和在 0 切分數是同一件事。補上中間的步驟：$\theta$ 是嚴格遞增的，所以 $\theta(s) > \frac{1}{2} = \theta(0)$ 若且唯若 $s > 0$，$\theta(s) < \frac{1}{2}$ 若且唯若 $s < 0$。

選項 1 把門檻放在分數 $\frac{1}{2}$，對應的機率是 $\theta(0.5) \approx 0.622$，也就是機率超過 0.622 才說是圈；選項 3 的門檻是分數 $-\frac{1}{2}$，對應 $\theta(-0.5) \approx 0.378$。兩個都和「超過一半」不同。

課堂上從這題得到的結論是：logistic 假說其實只是之前二元分類假說的一個對應版本。本文補充：分界仍然是 $\mathbf{w}^\top\mathbf{x} = 0$ 那個超平面，logistic 假說多回報的是分數離 0 多遠所對應的機率。

## 誤差怎麼定：從概似推到 cross-entropy

```youtube
url: https://www.youtube.com/watch?v=Uw62i3-Tr4Q
title: Logistic Regression :: Logistic Regression Error @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:46 三個線性模型並排，01:46–06:18 概似，06:18–09:45 logistic 函數的對稱性與連乘式，09:45–14:47 整理成 cross-entropy，之後是 Fun Time。）

### 三個線性模型，缺一格誤差

第 8 頁把目前學過的三個模型放在一起。它們都先算同一個線性分數 $s = \mathbf{w}^\top\mathbf{x}$，差別在分數算完之後做什麼：

| | 線性分類 | 線性迴歸 | 邏輯迴歸 |
|---|---|---|---|
| 假說 $h(\mathbf{x})$ | $\text{sign}(s)$ | $s$ | $\theta(s)$ |
| 圖上的輸出函數 | 階梯 | 斜直線 | S 形曲線 |
| 誤差 | 0/1 | 平方 | ？ |
| 講義給的理由 | plausible（對應小的翻轉雜訊） | friendly（容易最小化） | 待定 |

課堂上說明圖示：線性分類的方塊裡畫的是階梯狀的 sign，線性迴歸畫一條斜線，表示分數原封不動輸出（identity），邏輯迴歸畫的是 S 形。0/1 誤差的理由是它最能說服人，分對或分錯；平方誤差的理由是它導出了簡潔的演算法。第三格還空著，講義的問題是 how to define $E_{\text{in}}(\mathbf{w})$ for logistic regression。

### 概似：讓 h 假扮 f

第 9 頁先把目標函數和目標分布的關係寫清楚。$f(\mathbf{x}) = P(+1 \mid \mathbf{x})$ 等價於

$$
P(y \mid \mathbf{x}) = \begin{cases} f(\mathbf{x}) & \text{for } y = +1 \\ 1 - f(\mathbf{x}) & \text{for } y = -1 \end{cases}
$$

因為兩種結果的機率加起來是 1。

接著考慮一份資料 $\mathcal{D} = \{(\mathbf{x}_1, \circ), (\mathbf{x}_2, \times), \dots, (\mathbf{x}_N, \times)\}$。$f$ 產生這份資料的機率是多少？每一筆是先抽到 $\mathbf{x}_n$，再依 $P(y \mid \mathbf{x}_n)$ 抽到那個標籤；各筆獨立，所以整份資料的機率是連乘：

$$
P(\mathbf{x}_1)P(\circ \mid \mathbf{x}_1) \times P(\mathbf{x}_2)P(\times \mid \mathbf{x}_2) \times \dots \times P(\mathbf{x}_N)P(\times \mid \mathbf{x}_N)
$$

用上面的關係把 $P(\circ \mid \mathbf{x})$ 換成 $f(\mathbf{x})$、$P(\times \mid \mathbf{x})$ 換成 $1 - f(\mathbf{x})$：

$$
P(\mathbf{x}_1)f(\mathbf{x}_1) \times P(\mathbf{x}_2)\big(1 - f(\mathbf{x}_2)\big) \times \dots \times P(\mathbf{x}_N)\big(1 - f(\mathbf{x}_N)\big)
$$

但 $f$ 是未知的。課堂上的做法是讓 $h$ 假扮一下 $f$：假裝 $h$ 就是產生資料的那個函數，把式子裡的 $f$ 全部換成 $h$，得到「$h$ 產生同一份資料的可能性」，這個量叫概似（likelihood）：

$$
\text{likelihood}(h) = P(\mathbf{x}_1)h(\mathbf{x}_1) \times P(\mathbf{x}_2)\big(1 - h(\mathbf{x}_2)\big) \times \dots \times P(\mathbf{x}_N)\big(1 - h(\mathbf{x}_N)\big)
$$

講義接著給兩個論點：

- 如果 $h \approx f$，那麼 $\text{likelihood}(h) \approx$ 用 $f$ 算出來的機率。
- 用 $f$ 算出來的機率通常很大（usually large）。課堂上的說法是，手上的資料真的是 $f$ 產生的，所以回頭看，$f$ 產生這份資料的機率應該不小，並說這是直覺。

兩句合起來：好的 $h$ 概似應該大。所以第 10 頁的選法是

$$
g = \underset{h}{\text{argmax}}\ \text{likelihood}(h)
$$

在所有假說裡挑概似最大的那個當 $g$。

### 用講義的三個機率算一次

以下是本文用講義第 4 頁的數字自擬的算例，不在講義上。假設只有三筆資料，真正的機率是 $f(\mathbf{x}_1) = 0.9$、$f(\mathbf{x}_2) = 0.2$、$f(\mathbf{x}_3) = 0.6$，抽到的標籤是圈、叉、叉。$P(\mathbf{x}_n)$ 的部分每個假說都一樣，先不看，只比較後面那三項的乘積：

| 假說在三個點上的輸出 | 連乘 | 值 |
|---|---|---|
| $f$ 本身：$(0.9, 0.2, 0.6)$ | $0.9 \times 0.8 \times 0.4$ | 0.288 |
| 接近 $f$：$(0.8, 0.3, 0.5)$ | $0.8 \times 0.7 \times 0.5$ | 0.280 |
| 什麼都說一半：$(0.5, 0.5, 0.5)$ | $0.5 \times 0.5 \times 0.5$ | 0.125 |
| 跟 $f$ 相反：$(0.1, 0.8, 0.4)$ | $0.1 \times 0.2 \times 0.6$ | 0.012 |

接近 $f$ 的假說，概似也接近 $f$ 的 0.288；跟 $f$ 唱反調的假說，概似只剩 0.012。這就是講義第一個論點的意思。

本文補充一個要留意的地方。如果允許任何函數當假說，$(1, 0, 0)$ 的概似是 $1 \times 1 \times 1 = 1$，比 $f$ 的 0.288 還高：它把看到的標籤背下來，並把機率說死。所以「概似最大的就接近 $f$」要成立，得靠假說集合有所限制（這裡是 $\theta(\mathbf{w}^\top\mathbf{x})$ 這種形式，$d_{\text{VC}}$ 有限）加上資料夠多，這跟前幾堂「$E_{\text{in}}$ 小要能推到 $E_{\text{out}}$ 小」是同一個條件。講義用的字是 usually，沒有說一定。

### 對稱性：圈和叉寫成同一個式子

概似裡有兩種因子，圈的是 $h(\mathbf{x}_n)$，叉的是 $1 - h(\mathbf{x}_n)$。第 10 頁用 logistic 函數的一個性質把它們統一。先驗證這個性質：

$$
1 - \theta(s) = 1 - \frac{1}{1 + e^{-s}} = \frac{e^{-s}}{1 + e^{-s}} = \frac{1}{e^{s} + 1} = \theta(-s)
$$

第三個等號是分子分母同乘 $e^{s}$。對 $h(\mathbf{x}) = \theta(\mathbf{w}^\top\mathbf{x})$ 來說，這就是講義寫的

$$
1 - h(\mathbf{x}) = \theta(-\mathbf{w}^\top\mathbf{x}) = h(-\mathbf{x})
$$

課堂上把這個性質叫做對稱性，請大家看著投影片右邊的 S 形曲線說服自己它是對的。本文補充圖形上的意思：曲線對 $(0, \frac{1}{2})$ 這個點是對稱的，$s$ 與 $-s$ 兩處的高度加起來剛好是 1。

於是叉的因子 $1 - h(\mathbf{x}_n)$ 可以寫成 $h(-\mathbf{x}_n)$，概似變成

$$
\text{likelihood}(h) = P(\mathbf{x}_1)h(+\mathbf{x}_1) \times P(\mathbf{x}_2)h(-\mathbf{x}_2) \times \dots \times P(\mathbf{x}_N)h(-\mathbf{x}_N)
$$

圈的標籤是 $y_n = +1$，叉是 $y_n = -1$，所以每一項都是 $h(y_n\mathbf{x}_n)$。投影片把所有 $P(\mathbf{x}_n)$ 畫成灰色，課堂上解釋：比較不同的 $h$ 時，大家用的是同一批 $\mathbf{x}_1$ 到 $\mathbf{x}_N$，這部分每個 $h$ 都一樣，不影響誰大誰小。拿掉之後剩下

$$
\text{likelihood}(\text{logistic } h) \propto \prod_{n=1}^{N} h(y_n\mathbf{x}_n)
$$

「$\propto$」是正比於，比例常數就是那些 $P(\mathbf{x}_n)$ 的乘積。

### 取 ln、加負號、除以 N

第 11 頁分四步把「最大化連乘」整理成熟悉的「最小化平均誤差」。

**第一步：把 $h$ 換成 $\mathbf{w}$。** 每個 logistic 假說由 $\mathbf{w}$ 決定，$h(y_n\mathbf{x}_n) = \theta(y_n\mathbf{w}^\top\mathbf{x}_n)$：

$$
\max_{\mathbf{w}}\ \text{likelihood}(\mathbf{w}) \propto \prod_{n=1}^{N} \theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big)
$$

**第二步：取 ln。** 課堂上的理由是，前面幾堂處理過的 $E_{\text{in}}$ 都是連加，連乘沒有處理過；取對數可以把連乘變成連加，而對數是單調函數，最大的還是最大。用自然對數 $\ln$ 是為了之後微分方便。

$$
\max_{\mathbf{w}}\ \ln\prod_{n=1}^{N} \theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big) = \max_{\mathbf{w}}\ \sum_{n=1}^{N} \ln\theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big)
$$

**第三步：加負號，再乘 $\frac{1}{N}$。** 之前都是做最小化，所以加一個負號把 max 換成 min。$\frac{1}{N}$ 在投影片上是灰色的，課堂上說它只是對所有 $\mathbf{w}$ 一視同仁的常數縮放，不影響最佳解，放進來是為了讓式子長得像之前的 $E_{\text{in}}$：

$$
\min_{\mathbf{w}}\ \frac{1}{N}\sum_{n=1}^{N} -\ln\theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big)
$$

**第四步：代入 $\theta$ 的式子。** $\theta(s) = \frac{1}{1 + \exp(-s)}$，所以

$$
-\ln\theta(s) = -\ln\frac{1}{1 + \exp(-s)} = \ln\big(1 + \exp(-s)\big)
$$

課堂上講的是同一件事：$\theta$ 在分母，對數拉出來會多一個負號，剛好和前面的負號消掉。代入 $s = y_n\mathbf{w}^\top\mathbf{x}_n$：

$$
\min_{\mathbf{w}}\ \underbrace{\frac{1}{N}\sum_{n=1}^{N} \ln\Big(1 + \exp\big(-y_n\mathbf{w}^\top\mathbf{x}_n\big)\Big)}_{E_{\text{in}}(\mathbf{w})}
$$

加總裡的每一項只跟一筆資料有關，是基石第 8 堂說的逐點誤差（pointwise error measure）。講義把它叫 cross-entropy error：

$$
\text{err}(\mathbf{w}, \mathbf{x}, y) = \ln\Big(1 + \exp\big(-y\mathbf{w}^\top\mathbf{x}\big)\Big)
$$

$E_{\text{in}}$ 是它在 $N$ 筆資料上的平均。講義第 25 頁的總結給了它另一個名字：negative log likelihood，就是剛才那三個動作。

回到三筆資料的算例：$f$ 本身的 $-\frac{1}{3}\ln(0.288) \approx 0.415$，什麼都說一半的假說是 $-\frac{1}{3}\ln(0.125) = \ln 2 \approx 0.693$。概似大的，這個誤差小，排序完全相反，所以最小化 $E_{\text{in}}$ 和最大化概似挑到同一個假說。

### cross-entropy 的形狀與名字

誤差只透過 $ys = y\mathbf{w}^\top\mathbf{x}$ 這一個數決定。$ys > 0$ 表示分數的正負號和標籤一致（當成分類器是分對的），$ys < 0$ 表示分錯。本文算幾個值：

| $y\mathbf{w}^\top\mathbf{x}$ | $-5$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $5$ |
|---|---|---|---|---|---|---|---|
| err | 5.0067 | 2.1269 | 1.3133 | 0.6931 | 0.3133 | 0.1269 | 0.0067 |

三個觀察。分對而且分數離 0 愈遠，誤差愈接近 0，但永遠不會剛好是 0。$ys = 0$ 時誤差是 $\ln 2 \approx 0.6931$，這是假說說「一半一半」時付的代價。分錯的那一側，誤差幾乎和 $-ys$ 一樣大（$ys = -5$ 時是 5.0067），錯得愈離譜罰得愈重，而且沒有上限。

名字的由來，課堂上只說有歷史上的原因，細節不講，請有參考書的同學自己查。本文補充一個看得出名字的寫法，推導只用到上面的式子。把標籤改記成 $y' = 1$（圈）或 $y' = 0$（叉），並記 $h = h(\mathbf{x})$：

- $y = +1$ 時，$\text{err} = \ln(1 + e^{-s}) = -\ln\theta(s) = -\ln h$。
- $y = -1$ 時，$\text{err} = \ln(1 + e^{s}) = -\ln\theta(-s) = -\ln(1 - h)$。

兩種情況合成一行：

$$
\text{err} = -\Big[y'\ln h + (1 - y')\ln(1 - h)\Big]
$$

Fall 2024 的 HW4 Q1 考的就是這個換標籤之後的等價式，題目也說明 cross-entropy 這個名字來自 $p\log q + (1 - p)\log(1 - q)$ 的形式。

### Fun Time：cross-entropy 的四個性質

**題目（第 12 頁）：** 下面四個敘述有助於了解 cross-entropy 誤差 $\text{err}(\mathbf{w}, \mathbf{x}, y) = \ln\big(1 + \exp(-y\mathbf{w}^\top\mathbf{x})\big)$。考慮 $\mathbf{w}^\top\mathbf{x} \ne 0$。哪一個不對？

1. 對任何 $\mathbf{w}$、$\mathbf{x}$、$y$，$\text{err}(\mathbf{w}, \mathbf{x}, y) > 0$。
2. 對任何 $\mathbf{w}$、$\mathbf{x}$、$y$，$\text{err}(\mathbf{w}, \mathbf{x}, y) < 1126$。
3. 當 $y = \text{sign}(\mathbf{w}^\top\mathbf{x})$ 時，$\text{err}(\mathbf{w}, \mathbf{x}, y) < \ln 2$。
4. 當 $y \ne \text{sign}(\mathbf{w}^\top\mathbf{x})$ 時，$\text{err}(\mathbf{w}, \mathbf{x}, y) \ge \ln 2$。

**答案：2。** 講義的解答是「1126, really? :-)」，並建議固定 $y$、讓分數 $s = \mathbf{w}^\top\mathbf{x}$ 變動，把誤差的曲線畫出來，就會看到它沒有上界，其他三個都對。課堂上開了個玩笑：選項裡出現奇怪數字的通常不對。四個選項逐一推理如下，記 $t = y\mathbf{w}^\top\mathbf{x}$：

- **選項 1 對。** $\exp(-t) > 0$，所以 $1 + \exp(-t) > 1$，取 $\ln$ 之後大於 0。
- **選項 2 錯。** 取 $t = -1126$（例如一維的 $w = 1126$、$x = 1$、$y = -1$），$\text{err} = \ln(1 + e^{1126}) > \ln(e^{1126}) = 1126$。$t$ 再往負的方向走，誤差可以要多大有多大。
- **選項 3 對。** $y$ 和分數同號，$t > 0$，$\exp(-t) < 1$，$\text{err} < \ln 2$。
- **選項 4 對。** $y$ 和分數異號，$t < 0$，$\exp(-t) > 1$，$\text{err} > \ln 2$，當然也滿足「$\ge$」。

課堂上特別點出選項 3 和 4：分數等於 0 是切換點，一邊的誤差比 $\ln 2$ 大，另一邊被壓在 $\ln 2$ 以下。

## 梯度長什麼樣子，為什麼解不出閉式解

```youtube
url: https://www.youtube.com/watch?v=IZttt_v5tSw
title: Logistic Regression :: Gradient of Logistic Regression Error @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–01:38 $E_{\text{in}}$ 的性質，01:38–07:28 用連鎖律推梯度，07:28–10:30 為什麼沒有閉式解，10:30–14:12 回顧 PLA 與迭代最佳化，之後是 Fun Time。）

### E_in 是一個山谷

有了 $E_{\text{in}}$，剩下的是找讓它最小的 $\mathbf{w}$。課堂上先回顧理由：這群假說的 VC dimension 有限（見[基石第 7 堂：VC 維度](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)），所以把 $E_{\text{in}}$ 壓小，$E_{\text{out}}$ 也會小。目前學過的最小化方法有兩種：線性分類那種修正錯誤的做法，以及線性迴歸的「求梯度、找梯度為零的點」。後者適用於平滑可微的函數。

第 13 頁說邏輯迴歸的 $E_{\text{in}}$ 是 continuous、differentiable、twice-differentiable、convex。凸函數長得像山谷，谷底就是梯度為零的地方，所以目標和線性迴歸一樣：

$$
\text{want}\quad \nabla E_{\text{in}}(\mathbf{w}) = \mathbf{0}
$$

「凸」講義沒有證明。課堂上說，證法是把二次微分的矩陣算出來，確認它是正定的，這裡不詳細做，請大家先相信。以下的檢查是本文補充，不在講義上，用到的是「用連鎖律剝洋蔥」那一小節推出的梯度，初讀可以先跳過。對梯度再微分一次，利用 $\theta'(s) = \theta(s)\big(1 - \theta(s)\big)$ 與 $y_n^2 = 1$，得到二次微分的矩陣

$$
\nabla^2 E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \theta\big(\mathbf{w}^\top\mathbf{x}_n\big)\Big(1 - \theta\big(\mathbf{w}^\top\mathbf{x}_n\big)\Big)\mathbf{x}_n\mathbf{x}_n^\top
$$

對任何向量 $\mathbf{u}$，$\mathbf{u}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{u} = (\mathbf{u}^\top\mathbf{x}_n)^2 \ge 0$，前面的係數 $\theta(1 - \theta)$ 是正數，所以 $\mathbf{u}^\top\nabla^2 E_{\text{in}}\,\mathbf{u} \ge 0$。這是半正定，已經足以保證 $E_{\text{in}}$ 是凸的。課堂上說的「正定」要多一個條件：$\mathbf{x}_n$ 得張滿整個 $d + 1$ 維空間，這樣上式才會對所有非零的 $\mathbf{u}$ 嚴格大於 0。

### 用連鎖律剝洋蔥

$E_{\text{in}}$ 裡有 $\ln$、有 $\exp$、有 $\mathbf{w}$。課堂上的態度是不要怕，微分沒有絕招，一層一層做再串起來就是連鎖律。第 14 頁先替中間的量取暫時的名字：

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \ln\Big(\underbrace{1 + \exp(\overbrace{-y_n\mathbf{w}^\top\mathbf{x}_n}^{\bigcirc})}_{\square}\Big)
$$

指數裡面那一塊叫 $\bigcirc$，$\ln$ 裡面那一整塊叫 $\square$。課堂上說明為什麼用圖形而不用 A、B、C：把它們當成圈圈、方塊，比較容易記得它們只是暫時的中間值。

梯度的第 $i$ 個分量是對 $w_i$ 的偏微分。連鎖律把它拆成三個括號，課堂上形容這像剝洋蔥，從最外層剝進去：

$$
\frac{\partial E_{\text{in}}(\mathbf{w})}{\partial w_i} = \frac{1}{N}\sum_{n=1}^{N} \Big(\frac{\partial \ln(\square)}{\partial \square}\Big)\Big(\frac{\partial\big(1 + \exp(\bigcirc)\big)}{\partial \bigcirc}\Big)\Big(\frac{\partial\,(-y_n\mathbf{w}^\top\mathbf{x}_n)}{\partial w_i}\Big)
$$

三個括號各自都很簡單：

1. $\ln(\square)$ 對 $\square$ 微分是 $\frac{1}{\square}$。
2. $1 + \exp(\bigcirc)$ 對 $\bigcirc$ 微分：常數 1 微分後消失，$\exp(\bigcirc)$ 微分還是 $\exp(\bigcirc)$。
3. $-y_n\mathbf{w}^\top\mathbf{x}_n = -y_n\sum_j w_j x_{n,j}$，加總裡只有 $j = i$ 那一項含 $w_i$，微分得到 $-y_n x_{n,i}$。課堂上提醒負號不要漏掉。

代回去：

$$
\frac{\partial E_{\text{in}}(\mathbf{w})}{\partial w_i} = \frac{1}{N}\sum_{n=1}^{N} \Big(\frac{1}{\square}\Big)\Big(\exp(\bigcirc)\Big)\Big(-y_n x_{n,i}\Big) = \frac{1}{N}\sum_{n=1}^{N} \Big(\frac{\exp(\bigcirc)}{1 + \exp(\bigcirc)}\Big)\Big(-y_n x_{n,i}\Big)
$$

第二個等號把前兩個括號合併，並把 $\square$ 換回 $1 + \exp(\bigcirc)$。合併出來的 $\frac{\exp(\bigcirc)}{1 + \exp(\bigcirc)}$ 正是 logistic 函數的第一種寫法，課堂上稱它是我們的新朋友 $\theta$：

$$
\frac{\partial E_{\text{in}}(\mathbf{w})}{\partial w_i} = \frac{1}{N}\sum_{n=1}^{N} \theta(\bigcirc)\big(-y_n x_{n,i}\big)
$$

每個分量的 $\theta(\bigcirc)$ 都一樣，只有最後的 $x_{n,i}$ 隨 $i$ 改變。把 $i = 0, 1, \dots, d$ 的結果疊成一個向量，$x_{n,i}$ 就疊成 $\mathbf{x}_n$：

$$
\nabla E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \theta\big(-y_n\mathbf{w}^\top\mathbf{x}_n\big)\big(-y_n\mathbf{x}_n\big)
$$

讀法：每筆資料貢獻一個向量 $-y_n\mathbf{x}_n$，前面乘上一個 0 到 1 之間的權重 $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$，全部平均。講義第 15 頁稱它為 scaled $\theta$-weighted sum of $-y_n\mathbf{x}_n$。

本文補充權重的意義。由對稱性，$\theta(-y_n\mathbf{w}^\top\mathbf{x}_n) = 1 - \theta(y_n\mathbf{w}^\top\mathbf{x}_n) = 1 - h(y_n\mathbf{x}_n)$，而 $h(y_n\mathbf{x}_n)$ 是目前的假說認為「這筆資料出現它實際標籤」的機率。所以權重就是假說認為這個標籤不該出現的機率：假說愈意外，這筆資料在梯度裡說話愈大聲。

### 梯度為零解不出來

現在要解 $\nabla E_{\text{in}}(\mathbf{w}) = \mathbf{0}$（第 15 頁）。一個加權和什麼時候是零向量？講義分兩種情形。

**情形一：所有權重 $\theta(\cdot)$ 都是 0。** $\theta$ 只有在引數趨向 $-\infty$ 時才趨近 0，所以需要每一筆的 $-y_n\mathbf{w}^\top\mathbf{x}_n \to -\infty$。講義寫成 only if $y_n\mathbf{w}^\top\mathbf{x}_n \gg 0$，課堂上補充嚴格來說要趨向正無限大。$y_n\mathbf{w}^\top\mathbf{x}_n > 0$ 表示標籤和分數同號，這個 $\mathbf{w}$ 把第 $n$ 筆分對了；每一筆都要如此，資料就必須線性可分。課堂上反過來說：資料不是線性可分的話，不管哪個 $\mathbf{w}$ 都至少有一筆的 $y_n\mathbf{w}^\top\mathbf{x}_n$ 小於 0，這條路走不通。

**情形二：權重不全是 0，但加權和剛好互相抵消。** 這時要解的是一個 $\mathbf{w}$ 的方程式，而 $\mathbf{w}$ 出現在 $\theta$ 裡面，是非線性方程式（non-linear equation of $\mathbf{w}$）。

和線性迴歸對照：那裡的梯度是 $\frac{2}{N}(X^\top X\mathbf{w} - X^\top\mathbf{y})$，令它為零是「矩陣乘 $\mathbf{w}$ 等於某個向量」的線性方程式，我們會解，所以能一步登天。這裡的方程式不是線性的。講義的結論是 closed-form solution? no :-(。課堂上說，就所知沒有像線性迴歸那樣漂亮的閉式解。

### 回頭看 PLA：迭代最佳化

沒辦法一步登天，就回頭找一步一步修正的方法，那是 PLA。第 16 頁複習 PLA：從某個 $\mathbf{w}_0$（例如零向量）出發，對 $t = 0, 1, \dots$：

1. 找一個 $\mathbf{w}_t$ 犯的錯 $(\mathbf{x}_{n(t)}, y_{n(t)})$，也就是 $\text{sign}(\mathbf{w}_t^\top\mathbf{x}_{n(t)}) \ne y_{n(t)}$。
2. 修正：$\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}$。

停下來時回傳最後的 $\mathbf{w}$。同一頁把兩步合成一步：隨便挑一筆 $n$，然後

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \big[\!\big[\text{sign}(\mathbf{w}_t^\top\mathbf{x}_n) \ne y_n\big]\!\big]\, y_n\mathbf{x}_n
$$

雙層方括號是布林運算：條件成立是 1，不成立是 0。挑到的點分錯了，前面是 1，照常加上 $y_n\mathbf{x}_n$；挑到的點分對了，前面是 0，等於沒更新。課堂上請大家自己確認它和原來的兩步是同一件事。

再把這個式子拆成兩部分看：

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \underbrace{1}_{\eta} \cdot \underbrace{\Big(\big[\!\big[\text{sign}(\mathbf{w}_t^\top\mathbf{x}_n) \ne y_n\big]\!\big] \cdot y_n\mathbf{x}_n\Big)}_{\mathbf{v}}
$$

$\mathbf{v}$ 是更新的方向，$\eta$ 是在這個方向上要走多大一步。課堂上說 $\eta$ 是這裡偷偷塞進來的常數：PLA 沒有特別強調步伐，等於固定走 1，它的重要性要到梯度下降那一節才看得出來。

講義的結論是：choice of $(\eta, \mathbf{v})$ and stopping condition defines iterative optimization approach。挑不同的方向、不同的步伐、不同的停止條件，就是不同的迭代最佳化（iterative optimization）方法。PLA 是其中一種，梯度下降會是另一種。

### Fun Time：誰在梯度裡的權重最大

**題目（第 17 頁）：** 梯度是 $\nabla E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \theta(-y_n\mathbf{w}^\top\mathbf{x}_n)(-y_n\mathbf{x}_n)$，也就是每筆資料 $(\mathbf{x}_n, y_n)$ 以 $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$ 的份量貢獻給梯度。對任何給定的 $\mathbf{w}$，哪一筆資料貢獻的份量最大？

1. $y_n\mathbf{w}^\top\mathbf{x}_n$ 最小的那一筆
2. $y_n\mathbf{w}^\top\mathbf{x}_n$ 最大的那一筆
3. $\mathbf{w}^\top\mathbf{x}_n$ 最小的那一筆
4. $\mathbf{w}^\top\mathbf{x}_n$ 最大的那一筆

**答案：1。** 講義的理由是 $\theta$ 單調。展開來說：$\theta$ 遞增，所以 $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$ 最大，等同於 $-y_n\mathbf{w}^\top\mathbf{x}_n$ 最大，也就是 $y_n\mathbf{w}^\top\mathbf{x}_n$ 最小。

選項 2 是權重最小的那一筆，它被分得最對、最有把握。選項 3 和 4 只看分數、不看標籤：分數很低的點如果標籤是 $-1$，$y_n\mathbf{w}^\top\mathbf{x}_n$ 反而是很大的正數，權重很小，所以單看分數無法判斷。

課堂上的解讀是：$y_n\mathbf{w}^\top\mathbf{x}_n$ 最小的那一筆可能是很負的值，負的代表 $\mathbf{w}$ 在這筆資料上犯錯，所以犯錯的點權重特別大。這和 PLA「挑一個犯錯的點來修正」很像：PLA 只看一筆錯的，梯度把所有點犯大錯還是犯小錯綜合起來。

本文補充：題目問的是 $\theta$ 這個權重。實際加進梯度的向量是 $\theta(\cdot)\,(-y_n\mathbf{x}_n)$，它的長度還要乘上 $\lVert\mathbf{x}_n\rVert$，所以權重最大的點不一定是向量最長的點。

## 梯度下降：每一步往哪裡走、走多遠

```youtube
url: https://www.youtube.com/watch?v=X9NTihvSdjw
title: Logistic Regression :: Gradient Descent @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:45 把球滾下山與貪心的選法，03:45–09:26 線性近似與最佳方向，09:26–14:47 $\eta$ 的選擇與固定學習率，14:47–16:48 完整演算法，16:48–17:54 Fun Time，之後是總結。）

### 貪心的選法：一步內降最多

迭代最佳化的骨架是（第 18 頁）：對 $t = 0, 1, \dots$ 做 $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\mathbf{v}$，停下來時回傳最後的 $\mathbf{w}$。PLA 的 $\mathbf{v}$ 來自修正錯誤。邏輯迴歸的 $E_{\text{in}}$ 是平滑的山谷，講義的想法是 choose $\mathbf{v}$ to get the ball roll 'downhill'：課堂上請大家想像把一顆球放在山坡上某個位置（對應某個 $\mathbf{w}$），讓它滾下去，滾到谷底就是梯度為零的地方。

為了推導方便，先做兩個假設：

- 方向 $\mathbf{v}$ 是單位長度，$\lVert\mathbf{v}\rVert = 1$。課堂上的說法是，走多大步的資訊全部收進 $\eta$，$\mathbf{v}$ 只管方向。
- 步伐 $\eta$ 是正數。

給定某個 $\eta > 0$，貪心的做法是挑這一步讓 $E_{\text{in}}$ 降最多的方向：

$$
\min_{\lVert\mathbf{v}\rVert = 1}\ E_{\text{in}}(\underbrace{\mathbf{w}_t + \eta\mathbf{v}}_{\mathbf{w}_{t+1}})
$$

課堂上的畫面是：把 $\eta$ 想成人體的限制，一步只能跨 30 公分，你要在以自己為中心、半徑 30 公分的那一圈上挑一個落腳點；實際上這一圈可能在很多維的空間裡。

### 線性近似：只看一小段

第 19 頁指出這個問題沒有比較簡單：它仍是非線性的最佳化，還多了 $\lVert\mathbf{v}\rVert = 1$ 這條限制，not any easier than $\min_{\mathbf{w}} E_{\text{in}}(\mathbf{w})$。

出路是把它變成線性的。課堂上的說法是，我們學過的容易的問題都跟線性的式子有關，而任何彎彎曲曲的曲線，只看非常小的一段，都跟一小段線段沒有兩樣。數學上這是泰勒展開（Taylor expansion）。一維的版本是 $f(x + \delta) \approx f(x) + f'(x)\,\delta$；多維的版本把斜率換成梯度，位移 $\delta$ 換成 $\eta\mathbf{v}$：

$$
E_{\text{in}}(\mathbf{w}_t + \eta\mathbf{v}) \approx E_{\text{in}}(\mathbf{w}_t) + \eta\,\mathbf{v}^\top\nabla E_{\text{in}}(\mathbf{w}_t)
$$

講義註明條件是 if $\eta$ really small。課堂上的解釋：曲線很彎的時候，取一段長長的線段會跟曲線差很遠，線段要夠短，近似才好。

用近似式取代原式，得到「近似的貪心」：

$$
\min_{\lVert\mathbf{v}\rVert = 1}\ \underbrace{E_{\text{in}}(\mathbf{w}_t)}_{\text{known}} + \underbrace{\eta}_{\text{given positive}}\ \mathbf{v}^\top\underbrace{\nabla E_{\text{in}}(\mathbf{w}_t)}_{\text{known}}
$$

$E_{\text{in}}(\mathbf{w}_t)$ 是常數，跟 $\mathbf{v}$ 無關；$\eta$ 已經給定而且是正的，不改變誰最小。投影片把這兩項畫成灰色。真正要解的只剩下：

$$
\min_{\lVert\mathbf{v}\rVert = 1}\ \mathbf{v}^\top\nabla E_{\text{in}}(\mathbf{w}_t)
$$

### 最佳方向是梯度的反方向

一個單位向量和一個已知向量做內積，什麼時候最小？課堂上的比喻是兩個人吵架、離得遠遠的：方向完全相反時內積最負。

本文把這一步寫完整。記 $\mathbf{g} = \nabla E_{\text{in}}(\mathbf{w}_t)$，兩個向量的夾角是 $\phi$，則 $\mathbf{v}^\top\mathbf{g} = \lVert\mathbf{v}\rVert\,\lVert\mathbf{g}\rVert\cos\phi = \lVert\mathbf{g}\rVert\cos\phi$。$\cos\phi$ 最小是 $-1$，發生在 $\phi = 180^\circ$，也就是 $\mathbf{v}$ 指向 $-\mathbf{g}$ 的方向。再把長度調成 1（第 20 頁）：

$$
\mathbf{v} = -\frac{\nabla E_{\text{in}}(\mathbf{w}_t)}{\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert}
$$

這時 $\mathbf{v}^\top\mathbf{g} = -\lVert\mathbf{g}\rVert$，近似式說 $E_{\text{in}}$ 大約下降 $\eta\lVert\mathbf{g}\rVert$。代回更新式，就是梯度下降（gradient descent）：對小的 $\eta$，

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta\,\frac{\nabla E_{\text{in}}(\mathbf{w}_t)}{\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert}
$$

講義對它的評語是 a simple & popular optimization tool。課堂上補充：只要算得出梯度，就能用它。

### η 太小、太大、剛好

方向定了，接著是 $\eta$。第 21 頁用三張圖比較，三張都是同一個山谷：

| 圖 | 畫了什麼 | 講義的評語 |
|---|---|---|
| too small | 沿著左邊山坡畫了很多小小的階梯，一階一階慢慢往下 | too slow :-( |
| too large | 折線在左右兩邊的山坡之間來回跳 | too unstable :-( |
| just right | 山坡高處陡的地方跨大步（標 large $\eta$），接近谷底時跨小步（標 small $\eta$） | use changing $\eta$ |

課堂上把三種情況講成三種走法。$\eta$ 很小的人很保守，像蝸牛在爬，遲早會到，只是很慢。$\eta$ 很大的人以為自己走在一小段線段上，但步伐一大，線性近似就不準了，一腳踩空跌到對面的山坡，而且沒有理由保證跌過去之後比較低，說不定還爬得更高；因為泰勒展開已經不適用，跨很大步之後會發生什麼事，沒有人知道。

第三張圖的想法是 $\eta$ 要跟著坡度變。課堂上的理由：坡度大的地方可以放心跨大一點；坡度已經很小時還跨很大步，一腳就可能越過最佳點。這是一個心裡覺得有道理的 heuristic，講義寫成

$$
\eta \text{ better be monotonic of } \lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert
$$

坡度就是梯度的長度，步伐應該隨它增減。

### 固定學習率：把兩個長度約掉

第 22 頁給最簡單的做法：讓步伐和梯度長度成正比。投影片用顏色區分兩個 $\eta$，原本的步伐是紅色的，比例常數是紫色的。這裡把紅色的記成 $\eta_{\text{red}}$、紫色的記成 $\eta$（這兩個下標是本文加的）：

$$
\eta_{\text{red}} = \eta \cdot \lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert
$$

代進梯度下降的更新式，分子和分母的梯度長度約掉：

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta_{\text{red}}\,\frac{\nabla E_{\text{in}}(\mathbf{w}_t)}{\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert} = \mathbf{w}_t - \eta\,\nabla E_{\text{in}}(\mathbf{w}_t)
$$

課堂上說比例常數取名紫色，是因為它混了紅色的 $\eta$ 和藍色的梯度。結果是更新式變簡單了：不必把梯度正規化，直接乘一個固定的 $\eta$。這個 $\eta$ 叫 fixed learning rate，方法叫 fixed learning rate gradient descent：

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta\,\nabla E_{\text{in}}(\mathbf{w}_t)
$$

「固定」的是 $\eta$ 這個比例。實際跨出去的長度是 $\eta\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert$，仍然會變：坡陡走得遠，接近谷底梯度趨近零，步伐自動變小。課堂上對名字的說明是，learning rate 是機器學習的人取的，做最佳化的人不見得這樣叫；$\eta$ 小學得慢，$\eta$ 大一點學得快，太大則不穩定。

### 邏輯迴歸演算法

第 23 頁把所有東西組起來：

1. 初始化 $\mathbf{w}_0$。
2. 對 $t = 0, 1, \dots$：
   1. 計算梯度 $\nabla E_{\text{in}}(\mathbf{w}_t) = \frac{1}{N}\sum_{n=1}^{N} \theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(-y_n\mathbf{x}_n\big)$。
   2. 更新 $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta\,\nabla E_{\text{in}}(\mathbf{w}_t)$。
3. 直到 $\nabla E_{\text{in}}(\mathbf{w}_{t+1}) = \mathbf{0}$，或跑了夠多輪。
4. 回傳最後的 $\mathbf{w}_{t+1}$ 當作 $g$。

停止條件，講義寫的是梯度等於零。課堂上講得比較實際：用浮點數計算，要得到純粹的 0 很困難，所以通常只要求梯度夠接近零（大概到谷底就好）；另一個常見的條件是跑夠多步就停，假裝自己已經走到還不錯的地方。

講義最後一行是 similar time complexity to pocket per iteration。課堂上的說明：每一輪最花力氣的是算梯度，要把 $N$ 筆資料的貢獻平均起來；pocket 每一輪也要用 $N$ 筆資料算新的 $\mathbf{w}$ 的 $E_{\text{in}}$ 夠不夠好，兩者花的力氣類似。

### 數值例子：五位病人，手算兩步再跑到谷底

以下是本文自擬的例子，不在講義上，數字用 Python 驗算過。沿用心臟病的情境，但只留一個特徵：$x_1$ 是某項檢驗值標準化後的分數，$y = +1$ 代表後來心臟病發。加上 $x_0 = 1$，$\mathbf{x} = (1, x_1)$，$\mathbf{w} = (w_0, w_1)$。

| $n$ | $x_1$ | $y_n$ | $-y_n\mathbf{x}_n$ |
|---|---|---|---|
| 1 | $-2$ | $-1$ | $(1, -2)$ |
| 2 | $-1$ | $-1$ | $(1, -1)$ |
| 3 | $0$ | $+1$ | $(-1, 0)$ |
| 4 | $1$ | $-1$ | $(1, 1)$ |
| 5 | $2$ | $+1$ | $(-1, -2)$ |

檢驗值高的人比較常發病，但第 3 位（檢驗值居中卻發病）和第 4 位（檢驗值偏高卻沒事）打破了順序。沒有任何門檻能把五筆全部分對，資料不是線性可分的。

**第 0 步：$\mathbf{w}_0 = (0, 0)$，$\eta = 0.1$。** 每一筆的分數都是 0，權重都是 $\theta(0) = 0.5$，$E_{\text{in}}(\mathbf{w}_0) = \ln 2 \approx 0.6931$。梯度是

$$
\nabla E_{\text{in}}(\mathbf{w}_0) = \frac{1}{5}\cdot 0.5\cdot\Big[(1,-2) + (1,-1) + (-1,0) + (1,1) + (-1,-2)\Big] = \frac{0.5}{5}(1, -4) = (0.1, -0.4)
$$

更新：

$$
\mathbf{w}_1 = (0, 0) - 0.1 \times (0.1, -0.4) = (-0.01, 0.04)
$$

$w_1$ 變成正的，表示檢驗值愈高風險愈大，方向是對的。

**第 1 步：在 $\mathbf{w}_1 = (-0.01, 0.04)$ 算梯度。** 現在五筆的權重不一樣了：

| $n$ | 分數 $\mathbf{w}_1^\top\mathbf{x}_n$ | $y_n\mathbf{w}_1^\top\mathbf{x}_n$ | 權重 $\theta(-y_n\mathbf{w}_1^\top\mathbf{x}_n)$ |
|---|---|---|---|
| 1 | $-0.09$ | $0.09$ | 0.4775 |
| 2 | $-0.05$ | $0.05$ | 0.4875 |
| 3 | $-0.01$ | $-0.01$ | 0.5025 |
| 4 | $0.03$ | $-0.03$ | 0.5075 |
| 5 | $0.07$ | $0.07$ | 0.4825 |

第 3、4 筆的 $y_n\mathbf{w}^\top\mathbf{x}_n$ 是負的，被分錯了，權重超過 0.5；第 4 筆的值最小，權重最大，和「誰在梯度裡的權重最大」那題的結論一致。把權重乘上各自的 $-y_n\mathbf{x}_n$ 再平均：

$$
\begin{aligned}
\text{第一個分量} &= \tfrac{1}{5}\big(0.4775 + 0.4875 - 0.5025 + 0.5075 - 0.4825\big) = \tfrac{0.4875}{5} = 0.0975 \\
\text{第二個分量} &= \tfrac{1}{5}\big(-2(0.4775) - 0.4875 + 0 + 0.5075 - 2(0.4825)\big) = \tfrac{-1.9000}{5} = -0.3800
\end{aligned}
$$

更新：

$$
\mathbf{w}_2 = (-0.01, 0.04) - 0.1 \times (0.0975, -0.3800) = (-0.0198, 0.0780)
$$

三個時間點的 $E_{\text{in}}$ 是 0.6931、0.6766、0.6615，每一步都在下降。

**跑到谷底。** 繼續用 $\eta = 0.1$ 做下去，第 344 步時梯度長度降到 $10^{-3}$ 以下，最後收斂到

$$
\mathbf{w} \approx (-0.6227, 1.0904),\qquad E_{\text{in}} \approx 0.4844
$$

| $n$ | $x_1$ | $y_n$ | $h(\mathbf{x}_n) = \theta(\mathbf{w}^\top\mathbf{x}_n)$ | 權重 $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$ |
|---|---|---|---|---|
| 1 | $-2$ | $-1$ | 0.057 | 0.057 |
| 2 | $-1$ | $-1$ | 0.153 | 0.153 |
| 3 | $0$ | $+1$ | 0.349 | 0.651 |
| 4 | $1$ | $-1$ | 0.615 | 0.615 |
| 5 | $2$ | $+1$ | 0.826 | 0.174 |

**這個結果代表什麼。**

- 模型回報的是風險：檢驗值 $-2$ 的人約 6%，$+2$ 的人約 83%。照「Fun Time：把機率換回圈叉」的做法切在一半，分界在 $x_1 = 0.6227 / 1.0904 \approx 0.571$，第 3、4 筆仍然被分錯，0/1 誤差是 $\frac{2}{5}$。這兩筆的風險被估成 0.349 與 0.615，都離一半不遠，模型對它們本來就沒有把握。
- 概似從 $\mathbf{w}_0$ 的 $0.5^5 = 0.03125$ 提高到 $e^{-5 \times 0.4844} \approx 0.0887$。
- 梯度為零靠的是「梯度為零解不出來」那一小節的情形二。權重沒有一個是 0，是加權和互相抵消：第一個分量 $0.057 + 0.153 - 0.651 + 0.615 - 0.174 = 0$，第二個分量 $-2(0.057) - 0.153 + 0.615 - 2(0.174) \approx 0$。被分錯的兩筆權重最大，和三筆分對的拉成平手。

**換不同的 $\eta$。** 同一份資料、同樣從 $\mathbf{w}_0 = (0, 0)$ 出發，只改固定學習率：

| $\eta$ | 第 1 步之後的 $E_{\text{in}}$ | 梯度長度降到 $10^{-3}$ 以下要幾步 | 發生什麼事 |
|---|---|---|---|
| 0.01 | 0.6915 | 3,460 | 每步只降一點點，講義說的 too slow |
| 0.1 | 0.6766 | 344 | 穩定下降 |
| 1 | 0.5634 | 32 | 穩定下降，快十倍 |
| 3 | 0.4955 | 8 | 表上這幾個值裡最快（另外試 $\eta = 4$ 只要 5 步，$\eta = 7$ 又慢到 21 步，$\eta = 8$ 就到不了） |
| 10 | 0.8739 | 到不了 | 第 1 步就比起點的 0.6931 高，之後漸漸落入 $(-0.038, 2.153)$ 與 $(-1.003, 0.676)$ 兩點之間來回，$E_{\text{in}}$ 是 0.6148 與 0.5308，梯度長度停在 0.176 |
| 100 | 8.0000 | 到不了 | $E_{\text{in}}$ 三步一輪，在大約 4、14、6 之間跳；第 1,000 步時是 13.87，第 5,000 步時是 5.84 |

$\eta = 10$ 那一列對應第 21 頁中間那張圖的情況：一步跨過谷底落到對面的山坡。這裡第 1 步的落點還比出發點高，就是課堂上提醒的那種情況：跨到對面山坡之後，反而爬得更高。$\eta$ 多大算太大要看資料，這張表的數字不能搬到別的問題上。

再試一次正規化的版本，也就是第 20 頁那個每步固定走 $\eta$ 長度的更新式，取 $\eta = 0.05$。它 30 步之內就走到谷底附近，之後每一步還是得走滿 0.05 的長度，只能在谷底兩側的兩個點之間來回跨：偶數步落在 $(-0.631, 1.076)$，梯度長度 0.0044；奇數步落在 $(-0.607, 1.120)$，梯度長度 0.0087。一路跑到第 5,000 步都是這兩個點輪流出現，梯度長度始終在 0.004 以上，降不到 $10^{-3}$。這說明了第 21 頁為什麼要求步伐隨梯度長度變化，固定學習率的版本接近谷底時步伐會自己縮小，沒有這個問題。

### Fun Time：從零向量走第一步

**題目（第 24 頁）：** 如果 $\mathbf{w}_0 = \mathbf{0}$，取 $\eta = 0.1$，邏輯迴歸演算法的 $\mathbf{w}_1$ 是什麼？

1. $+0.1 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$
2. $-0.1 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$
3. $+0.05 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$
4. $-0.05 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$

**答案：3。** 講義只說用 $\theta(0) = \frac{1}{2}$ 代入。完整的代入：$\mathbf{w}_0 = \mathbf{0}$ 時每筆的 $-y_n\mathbf{w}_0^\top\mathbf{x}_n = 0$，權重都是 $\frac{1}{2}$，

$$
\nabla E_{\text{in}}(\mathbf{w}_0) = \frac{1}{N}\sum_{n=1}^{N} \frac{1}{2}\big(-y_n\mathbf{x}_n\big) = -\frac{1}{2}\cdot\frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n
$$

$$
\mathbf{w}_1 = \mathbf{0} - 0.1 \times \Big(-\frac{1}{2}\cdot\frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n\Big) = +0.05 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n
$$

選項 1 漏了 $\theta(0) = \frac{1}{2}$。選項 2 和 4 的正負號錯了：梯度裡有一個負號，更新式又減去梯度，負負得正。五位病人的例子可以對答案：$\frac{1}{5}\sum_n y_n\mathbf{x}_n = (-0.2, 0.8)$，乘 0.05 是 $(-0.01, 0.04)$，就是前面算出的 $\mathbf{w}_1$。

講義對這個結果的評語是：$y_n\mathbf{x}_n$ 的縮放平均，比零向量好上「一步」。課堂上的說法是，把 $y$ 和 $\mathbf{x}$ 乘起來平均是個還不錯的方向，它比零向量好一點點，因為已經往下滾過一次。

### 這堂課的四句話

第 25 頁的總結，一節一句：

- 問題：以 $P(+1 \mid \mathbf{x})$ 為目標，以 $\theta(\mathbf{w}^\top\mathbf{x})$ 為假說。
- 誤差：cross-entropy，也就是 negative log likelihood。
- 梯度：資料向量的 $\theta$ 加權和。
- 梯度下降：沿著 $-\nabla E_{\text{in}}(\mathbf{w})$ 往下滾。

下一堂的預告是 linear model'S' for classification。課堂上說，線性分類、線性迴歸、邏輯迴歸三個都是線性的方法，下一次會把它們整合起來，用到更複雜的問題上。

## 自我檢查

**1. 某筆資料 $\mathbf{x} = (1, 3)$、$y = +1$，目前 $\mathbf{w} = (1, -2)$。算出 $h(\mathbf{x})$、這筆的 cross-entropy 誤差，以及它在梯度加總裡貢獻的向量 $\theta(-y\mathbf{w}^\top\mathbf{x})(-y\mathbf{x})$。這筆資料會把 $\mathbf{w}$ 往哪個方向推？**

答案：分數 $s = 1 - 6 = -5$，$h(\mathbf{x}) = \theta(-5) \approx 0.0067$，假說認為它幾乎不可能是 $+1$，標籤卻是 $+1$。誤差是 $\ln(1 + e^{5}) \approx 5.0067$。權重 $\theta(5) \approx 0.9933$，貢獻的向量是 $0.9933 \times (-1, -3) \approx (-0.993, -2.980)$。更新是減去梯度，所以這筆資料把 $\mathbf{w}$ 往 $(+1, +3)$ 也就是 $y\mathbf{x}$ 的方向推，讓它自己的分數變高。

**2. 某個假說對三筆資料都輸出 $h(\mathbf{x}_n) = 0.8$，三筆的標籤是圈、圈、叉。不看 $P(\mathbf{x}_n)$，概似是多少？$E_{\text{in}}$ 是多少？這三筆的分數 $\mathbf{w}^\top\mathbf{x}_n$ 是多少？**

答案：概似是 $0.8 \times 0.8 \times 0.2 = 0.128$。$E_{\text{in}} = -\frac{1}{3}\ln(0.128) \approx 0.6852$；逐項算是 $\frac{1}{3}(0.2231 + 0.2231 + 1.6094)$，結果相同。$\theta(s) = 0.8$ 解出 $e^{-s} = 0.25$，$s = \ln 4 \approx 1.386$。判準：兩種算法的 $E_{\text{in}}$ 要一致，這就是「$E_{\text{in}}$ 是負的對數概似除以 $N$」。

**3. 在五位病人的例子裡，改用 $\eta = 1$，從 $\mathbf{w}_0 = (0, 0)$ 走一步。$\mathbf{w}_1$ 是多少？不重算梯度，能直接從 $\eta = 0.1$ 的結果得到嗎？**

答案：可以。第一步的梯度和 $\eta$ 無關，都是 $(0.1, -0.4)$，所以 $\mathbf{w}_1 = -1 \times (0.1, -0.4) = (-0.1, 0.4)$，是 $\eta = 0.1$ 時的十倍。此時 $E_{\text{in}} \approx 0.5634$。第二步開始就不能這樣換算，因為兩條路徑上的 $\mathbf{w}_1$ 不同，梯度也不同。

**4. 兩筆一維資料（加上 $x_0 = 1$）：$x_1 = -1$ 標 $-1$，$x_1 = +1$ 標 $+1$。取 $\mathbf{w} = (0, c)$，$c > 0$。$E_{\text{in}}$ 是 $c$ 的什麼函數？梯度下降會停在哪裡？這對停止條件有什麼啟示？**

答案：兩筆的 $y_n\mathbf{w}^\top\mathbf{x}_n$ 都是 $c$，所以 $E_{\text{in}} = \ln(1 + e^{-c})$：$c = 1$ 時 0.3133，$c = 5$ 時 0.0067，$c = 10$ 時約 $4.5 \times 10^{-5}$。它隨 $c$ 一直下降、趨近 0 但到不了，兩筆的權重都是 $\theta(-c)$，永遠是正數。資料線性可分時，梯度為零只發生在 $\mathbf{w}$ 的長度趨向無限大的極限，這就是「所有 $\theta$ 都是 0」的情形。所以演算法不會因為梯度剛好等於零而停，要靠「梯度夠小」或「跑夠多輪」這兩個條件。

**5. 用自己的話說明：(a) 為什麼最佳的單位方向是 $-\nabla E_{\text{in}} / \lVert\nabla E_{\text{in}}\rVert$；(b) 固定學習率的版本，每一步實際走多長；(c) PLA 放進 $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\mathbf{v}$ 的框架時，$\eta$ 和 $\mathbf{v}$ 各是什麼。**

判準：(a) 要提到 $\eta$ 很小時用泰勒展開把 $E_{\text{in}}(\mathbf{w}_t + \eta\mathbf{v})$ 近似成 $E_{\text{in}}(\mathbf{w}_t) + \eta\mathbf{v}^\top\nabla E_{\text{in}}(\mathbf{w}_t)$，只有內積那一項跟 $\mathbf{v}$ 有關，單位向量和梯度反向時內積最小。(b) 長度是 $\eta\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert$，隨梯度縮放，要指出「固定」的是比例。(c) $\eta = 1$，$\mathbf{v}$ 在挑到的點分錯時是 $y_n\mathbf{x}_n$、分對時是零向量；能進一步指出 PLA 每步只看一筆、梯度下降每步看全部 $N$ 筆更好。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把基石第 9、10 堂排在同一週（W5，10/07）。Fall 2024 的對應投影片是 [10u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf)；本文只用 MOOC 版講義，沒有逐頁比對兩個版本。

**教科書。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把這堂對到 [Learning from Data](http://amlbook.com)（LFD）的 3.3 節。

**作業。** 以下題目都沒有官方解答。

- [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)（2024-10-07 發布、10-21 截止）**Q4**：從 $[\theta, 1]$ 均勻分布抽出的樣本，某個估計值的概似是多少。練的是「假裝某個參數是真的，算它產生手上資料的可能性」這個動作。
- HW3 **Q9**：換一種 sigmoid 假說，照邏輯迴歸的步驟推出新的 $E_{\text{in}}$ 與梯度。做法就是把這篇「取 ln、加負號、除以 N」與「用連鎖律剝洋蔥」兩段重走一遍。
- [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)（2024-10-21 發布、11-04 截止）**Q1**：標籤從 $\{-1, +1\}$ 換成 $\{0, 1\}$ 之後，哪個式子等價於課堂上的 cross-entropy。「cross-entropy 的形狀與名字」那一小節已經推過一次。
- HW4 **Q5**（延伸）：用二階泰勒展開推出 Newton's method，並套用在邏輯迴歸的 cross-entropy 上，可以當成梯度下降的進階版。

整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**動手做。** 把「邏輯迴歸演算法」那四步寫成十幾行 Python，先用五位病人的資料重現本文的數字（$\mathbf{w}_1$、$\mathbf{w}_2$、收斂後的 $\mathbf{w}$），再把 $\eta$ 從 0.01 調到 100，畫出 $E_{\text{in}}$ 隨迭代次數的曲線，對照第 21 頁的三張圖。

**延伸閱讀。** [Stanford CS229 第 3 堂：最大概似與邏輯斯迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)用 $\{0, 1\}$ 標籤推同一個模型；Stanford CS109 的[最大概似估計](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation)與[邏輯迴歸](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression)從機率課的角度講概似。

**下一堂。** [基石第 11 堂：線性分類模型](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)把這三個線性模型放在一起比較，看線性迴歸與邏輯迴歸能不能拿來做分類，再把梯度下降改成隨機梯度下降（SGD），最後處理多類別分類。

## 課程影片來源

原始影片：[Logistic Regression Problem](https://www.youtube.com/watch?v=4rPupwSdAac)、[Logistic Regression Error](https://www.youtube.com/watch?v=Uw62i3-Tr4Q)、[Gradient of Logistic Regression Error](https://www.youtube.com/watch?v=IZttt_v5tSw)、[Gradient Descent](https://www.youtube.com/watch?v=X9NTihvSdjw)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [基石第 10 堂講義 10_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time 與第 21 頁的三張圖都出自這份講義。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：LFD 章節的對應。
- [Fall 2024 版投影片 10u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf)：Fall 2024 的對應投影片，本文未逐頁比對。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 3（hw3_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)：Q4 與 Q9 的題目內容。
- [Fall 2024 Homework 4（hw4_red.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)：Q1 與 Q5 的題目內容，以及 cross-entropy 名稱的說明。
- [Learning from Data 教科書網站](http://amlbook.com)：3.3 節的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
