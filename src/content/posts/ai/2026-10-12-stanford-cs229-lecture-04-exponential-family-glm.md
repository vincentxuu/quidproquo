---
title: "指數族、廣義線性模型與 softmax：換一種誤差分布要重推幾次？｜Stanford CS229 第 4 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, exponential-family, generalized-linear-models, softmax]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 4
tldr: "只要 y 的分布能寫成 b(y)·exp(ηᵀT(y) − a(η))，對 a(η) 微分一次就是期望值、兩次就是變異數；再令 η = θᵀx，線性迴歸、邏輯斯迴歸與 softmax 的更新式都是同一條 θ ← θ + α(y − h(x))x。後半堂用四個類別的例子講 softmax、交叉熵與 label smoothing。"
description: "Stanford CS229 Spring 2026 第 4 堂導讀：指數族的四個零件、Bernoulli 與高斯的改寫、log partition function 的微分性質、廣義線性模型的配方、softmax 與交叉熵的推導與數值例子。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 4 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 3 章與第 2.3 節；沒看到板書與投影片畫面，講者用手指著講的地方靠前後文與講義還原。

[上一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)做了兩次很像的事：假設誤差是高斯，最大概似推出最小平方；假設標籤是 Bernoulli，最大概似推出邏輯斯迴歸。而邏輯斯迴歸的更新式，和[第 2 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression)線性迴歸的更新式長得一模一樣。這一堂回答的問題是：如果 y 換成計數、換成四個類別，是不是要再從頭推一次？答案是不用。只要分布屬於「指數族」，推論、損失函數、更新式都已經推好了。

先備是第 2、3 堂的梯度更新式、最大概似估計與 sigmoid，加上會對 log 與 exp 微分、知道期望值與變異數的定義。讀完之後，你應該能把一個沒看過的分布改寫成指數族形式、讀出它的平均數與變異數、寫出對應模型的更新式，並且手算一次 softmax 與交叉熵。這門課的整體路線見[課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)。

這堂由 Chris Ré 授課。他沒有在這堂自我介紹；這學期他和 Tengyu Ma 輪流上課，第 2 到 6 堂是他。

```youtube
url: https://www.youtube.com/watch?v=8gVi4Rk21Eg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 4: Exponential Family, GLMs Classification
captions: en
```

## 這堂課的三段路線

（錄影 00:00–03:05）

講者開場先交代順序：

1. **指數族**（exponential family）：一種寫機率分布的固定格式。他說這是大量統計模型的基石。
2. **廣義線性模型**（generalized linear model，GLM）：把指數族接上資料與參數，得到可以訓練的模型。
3. **softmax**：多類別分類。他說這是目前用得最多的一種，語言模型每產生一個 token，最後一步都是用 softmax 在整個詞彙表裡挑；之後才會教的 attention（[第 14 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-14-llm-next-token-attention)）裡面也有它。

他給的整體想法是：世界上的資料有各種型別（實數、是非、計數、多個類別），指數族提供一條固定的路，從「這種型別的分布」走到「一個學得出來的模型」，而且每種型別走的步驟都相同。

## 指數族的定義：四個零件

（錄影 03:05–07:14）

一個分布屬於指數族，是指它的機率（或機率密度）能寫成：

$$
p(y; \eta) = b(y)\, \exp\!\big(\eta^\top T(y) - a(\eta)\big)
$$

四個零件各有名字：

- $\eta$：**自然參數**（natural parameter）。分布有幾個自由參數，$\eta$ 就有幾維。
- $T(y)$：**充分統計量**（sufficient statistic）。講者的說法是「你對 y 量了什麼」。它必須和 $\eta$ 同維度，兩者才能做內積。這堂課幾乎所有例子都取 $T(y) = y$。
- $b(y)$：**基底測度**（base measure）。一個只跟 y 有關的純量，重點是它不含 $\eta$。
- $a(\eta)$：**對數配分函數**（log partition function）。只跟 $\eta$ 有關，不含 y。

$a(\eta)$ 看起來只是個修正項，但講者強調後面的重頭戲幾乎都在它身上。原因是機率加總必須等於 1。假設 y 是離散的：

$$
\sum_y p(y;\eta) = e^{-a(\eta)} \sum_y b(y)\, e^{\eta^\top T(y)} = 1
$$

$e^{-a(\eta)}$ 不含 y，所以可以提到求和外面。移項取 log：

$$
a(\eta) = \log \sum_y b(y)\, e^{\eta^\top T(y)}
$$

y 連續時把求和換成積分。也就是說 $a(\eta)$ 不是另外挑的函數，選定 $b$ 與 $T$ 之後它就被「加總為 1」這個條件決定了。講者把那個求和叫做「all the possible worlds」：它把 y 所有可能的取值都掃過一遍。這個式子等一下要拿來微分。

這個格式真正的限制在指數裡面：$b(y)$ 可以是 y 的任意複雜函數，$a(\eta)$ 可以是 $\eta$ 的任意複雜函數，但 y 與 $\eta$ 之間的交互作用只能透過內積 $\eta^\top T(y)$。講者在 13:25 左右說：「the interactions between them have to be linear」，並預告後半堂的廣義線性模型就是把這個線性的部分做成模型。

## 把 Bernoulli 改寫成指數族

（錄影 07:14–11:19）

擲一枚不公平的硬幣，$y \in \{0, 1\}$，$y=1$ 的機率是 $\phi$：

$$
p(y; \phi) = \phi^{y} (1-\phi)^{1-y}
$$

這個寫法是把「如果 y=1 就取 $\phi$，否則取 $1-\phi$」塞進一條式子：y 是 1 時第二項的指數是 0，整項變成 1；y 是 0 時第一項變成 1。

**第一步：把整個式子寫成 exp(log(·))。** 任何正數 $c$ 都等於 $e^{\log c}$：

$$
p(y;\phi) = \exp\!\big( y \log \phi + (1-y)\log(1-\phi) \big)
$$

講者提醒要檢查取 log 合不合法：$\phi$ 不能剛好是 0 或 1，否則會出現 $\log 0$。

**第二步：把含 y 的項收在一起。** 展開 $(1-y)\log(1-\phi) = \log(1-\phi) - y\log(1-\phi)$，於是

$$
p(y;\phi) = \exp\!\Big( y \log\frac{\phi}{1-\phi} + \log(1-\phi) \Big)
$$

講者在 09:16 特別說這一步沒有什麼巧思：「it's not like some mysterious mathematical insight. It's just mechanical.」就是把乘上 y 的項集中。

**第三步：對照定義讀出零件。** 取 $T(y) = y$、$b(y) = 1$，乘在 y 前面的就是自然參數：

$$
\eta = \log\frac{\phi}{1-\phi}
$$

這個量叫 log odds（勝算的對數）。剩下的 $\log(1-\phi)$ 應該對應 $-a(\eta)$，但它現在是用 $\phi$ 寫的。$a$ 必須是 $\eta$ 的函數，所以要把 $\phi$ 用 $\eta$ 表示，也就是把上式反解。

**第四步：反解。** 兩邊取 exp 得 $e^{\eta} = \phi/(1-\phi)$，所以 $e^{\eta}(1-\phi) = \phi$，整理成 $e^{\eta} = \phi(1+e^{\eta})$：

$$
\phi = \frac{e^{\eta}}{1+e^{\eta}} = \frac{1}{1+e^{-\eta}}
$$

這正是 sigmoid。前面的課它是直接拿來用的函數；在這裡它是 Bernoulli 的自然參數與平均數之間的換算式，自己掉出來的。

**第五步：寫出 $a(\eta)$。** 由上式 $1-\phi = 1/(1+e^{\eta})$，所以

$$
a(\eta) = -\log(1-\phi) = \log(1+e^{\eta})
$$

Bernoulli 的四個零件：$T(y)=y$、$b(y)=1$、$\eta=\log\frac{\phi}{1-\phi}$、$a(\eta)=\log(1+e^{\eta})$。

## 把高斯改寫成指數族

（錄影 11:19–14:27）

進入高斯之前，講者先澄清一個學生常有的困惑：現在談的只是 y 的分布，還沒有模型也沒有資料。他要大家把這些分布想成「誤差的分布」：前面的線性模型先給出一個預測，y 在預測值附近有一個誤差；Bernoulli 與高斯描述的是那個誤差長什麼樣。

高斯的密度是 $\frac{1}{\sqrt{2\pi}\sigma}\exp\!\big(-\frac{(y-\mu)^2}{2\sigma^2}\big)$。這裡有一個課堂上沒交代的設定：講義把 $\sigma^2$ 設成 1，理由是推導線性迴歸時已經看到 $\sigma^2$ 不影響最後求出的 $\theta$。講者直接從投影片上的式子做起，他後來說高斯的 $a$ 是 $\eta^2/2$，正是 $\sigma^2=1$ 的結果，所以本文照講義的設定走。設 $\sigma^2=1$ 後把平方展開，$(y-\mu)^2 = y^2 - 2\mu y + \mu^2$：

$$
p(y;\mu) = \frac{1}{\sqrt{2\pi}} \exp\!\Big(-\frac{y^2}{2}\Big) \cdot \exp\!\Big(\mu y - \frac{\mu^2}{2}\Big)
$$

三項各有去處：

- 只含 y 的 $-y^2/2$ 併進前面的常數，成為 $b(y) = \frac{1}{\sqrt{2\pi}} e^{-y^2/2}$。
- $\mu y$ 是 y 與參數的交互項，而且對 y 是線性的，所以 $T(y)=y$、$\eta = \mu$。
- 只含參數的 $\mu^2/2$ 就是 $a(\eta) = \eta^2/2$。

講者說展開前看到平方，可能會擔心湊不出內積的形式。展開後非線性的部分 $y^2$ 與 $\mu^2$ 各自只含一邊，可以分別丟給 $b$ 和 $a$，交互項 $\mu y$ 剛好是線性的。

到這裡，這門課目前用過的兩個誤差分布都放進同一個格式了。

## 對 a(η) 微分：期望值、變異數與凸性

（錄影 14:27–20:40）

高斯的 $a(\eta) = \eta^2/2$ 微分一次是 $\eta$，也就是平均數 $\mu$。講者說這看起來像巧合，其實對整個指數族都成立。以下把推導走完，取 $T(y)$ 與 $\eta$ 為純量，離散的 y（連續時把求和換成積分）。

從 $a(\eta) = \log \sum_y b(y) e^{\eta T(y)}$ 出發。對 log 微分，裡面的東西跑到分母，分子是裡面的東西再微分：

$$
\frac{da}{d\eta} = \frac{\sum_y b(y)\, T(y)\, e^{\eta T(y)}}{\sum_y b(y)\, e^{\eta T(y)}}
$$

分母等於 $e^{a(\eta)}$，把它搬進分子的求和：

$$
\frac{da}{d\eta} = \sum_y T(y)\; \underbrace{b(y)\, e^{\eta T(y) - a(\eta)}}_{p(y;\eta)} = \mathbb{E}[T(y)]
$$

有學生在 17:30 問為什麼這是期望值，講者的回答就是這一步：分母是正規化常數，放回去之後每一項剛好是機率乘上 $T(y)$。

再微分一次。對上式中的 $e^{\eta T(y) - a(\eta)}$ 微分，會多出一個因子 $T(y) - a'(\eta)$：

$$
\frac{d^2a}{d\eta^2} = \sum_y T(y)\,\big(T(y) - a'(\eta)\big)\, p(y;\eta) = \mathbb{E}[T(y)^2] - \big(\mathbb{E}[T(y)]\big)^2 = \mathrm{Var}[T(y)]
$$

第二個等號用了剛得到的 $a'(\eta) = \mathbb{E}[T(y)]$。課堂上這一步講者說「You can check, I won't」，上面是照他描述的做法補完的。$\eta$ 是向量時，一次微分換成梯度，結果是 $\mathbb{E}[T(y)]$ 這個向量；二次微分換成 Hessian，結果是共變異數矩陣。

拿前面兩個分布驗算：

| 分布 | $a(\eta)$ | $a'(\eta)$ | $a''(\eta)$ |
|---|---|---|---|
| Bernoulli | $\log(1+e^{\eta})$ | $\frac{e^{\eta}}{1+e^{\eta}} = \phi$ | $\phi(1-\phi)$ |
| 高斯（$\sigma^2=1$） | $\eta^2/2$ | $\eta = \mu$ | $1$ |

Bernoulli 的平均數是 $\phi$、變異數是 $\phi(1-\phi)$，高斯的變異數是 1，全部對得上。代一個數字：$\phi = 0.8$ 時 $\eta = \log 4 \approx 1.386$，$a(\eta) = \log 5 \approx 1.609$，$a'(\eta) = 4/5 = 0.8$，$a''(\eta) = 0.8 \times 0.2 = 0.16$。

這段推導沒有用到 Bernoulli 或高斯的任何特性，只用了指數族的格式。這就是講者說的「inference comes for free」：分布一旦寫成這個格式，平均數與變異數不用另外積分，對 $a$ 微分就有。

**累積量的補充（17:30–19:38）。** 講者接著提醒，$a(\eta)$ 是 cumulant generating function（累積量生成函數），不是 moment generating function（動差生成函數）。兩者低階的項相同，他說前三個對得上，更高階就不同。他也說修課不需要懂這段，只是常有人搞混。（本文補充：對 $a(\eta)$ 微分 $n$ 次得到的是 $T(y)$ 的第 $n$ 個累積量。第一個是平均數，第二個是變異數，第三個是三階中央動差 $\mathbb{E}[(T-\mathbb{E}T)^3]$；所謂「對得上」是和這些以平均數為中心的動差比。第四個累積量是四階中央動差減去 $3\,\mathrm{Var}^2$，從這裡開始兩者分開。）

**凸性（19:38–20:40）。** 講者說前幾堂有人問過「什麼東西是凸的」，他在這裡給出一般性的答案：$a$ 的二次微分是變異數（多維時是共變異數矩陣），變異數不會是負的，共變異數矩陣是半正定的，所以 $a$ 是 $\eta$ 的凸函數。高斯的 $a(\eta) = \eta^2/2$ 就是最小平方那個碗形。凸的好處是梯度下降不會卡在局部低點。

## 為什麼講者一直說「用誤差來想」

（錄影 20:40–27:43）

如果只有 Bernoulli 和高斯，花二十分鐘把它們改寫成一個比較怪的格式並不划算。講者接著列出一張表，說明同一個格式涵蓋多少種資料型別：

| y 的型別 | 分布 |
|---|---|
| 二元 | Bernoulli |
| 多個類別 | multinomial |
| 實數 | 高斯 |
| 計數 | Poisson |
| 正的實數（例如等待時間） | gamma、exponential |
| 機率分布本身 | Dirichlet |

他也說明這門課只用 $T(y) = y$，但 GLM 的專書會用更複雜的 $T$。

接下來幾分鐘是問答，有三個回答值得記下來。

**「用誤差來想」是什麼意思（22:40）。** 統計的看法是：有一個真正的模型產生資料，再加上模型沒抓到的部分，像是量測誤差、計數偏差。前兩堂的程序其實相同，差別只在 y 的型別不同，所以損失函數不同。「線性預測之後，剩下的誤差長什麼樣」這一塊，現在全部交給指數族處理。y 的型別決定誤差分布，誤差分布決定其餘的一切。

**實務上會自己推這些嗎（23:40）。** 不會，你會用框架裡現成的 softmax。講者說這堂課是在看引擎蓋底下。他舉了一個例子：他的學生有個小有名氣的模型，別人重新實作時把權重初始化寫錯了，論文裡其實寫了正確的做法；要診斷出這種錯，得有人懂期望值在模型裡怎麼往前傳。所以這套理論是拿來理解模型的工具，不是日常寫程式的步驟。

**「推論免費」指什麼（25:41）。** 這堂課的「推論」是指：給一筆資料，模型輸出一個估計，再用誤差分布算出各種結果的機率。邏輯斯迴歸輸出「屬於這一類的機率」是這個意思，語言模型輸出「下一個詞是某個詞的機率」也是。講者特別提醒不要把因果講反：不是因為有了指數族，這些分布才變得好算；是這些誤差分布本來就好算、做法又相同，指數族把這件事整理成一個格式。他的說法是「It's more compression in your head rather than compression in code」（26:42）。

## 廣義線性模型：把分布接上資料

（錄影 27:43–37:00）

到目前為止只有分布。監督式學習的設定是：有特徵 $x \in \mathbb{R}^{d+1}$（多的一維是補上的常數 1），有目標 y，要一個模型。GLM 的做法可以整理成三個決定，講義把它們列為三條假設：

1. **依 y 的型別挑一個指數族分布。** 二元挑 Bernoulli，實數挑高斯，計數挑 Poisson。
2. **模型的輸出是期望值。** $h_\theta(x) = \mathbb{E}[y \mid x; \theta]$。
3. **自然參數是輸入的線性函數。** $\eta = \theta^\top x$。

第三條是設計選擇。講義說這一條看起來最沒有根據，與其當成假設，不如當成配方裡的一個設計選擇。前面看過指數族的指數裡 y 與 $\eta$ 只能有線性交互；現在再讓 $\eta$ 對 x 是線性的，整個模型就只剩 $\theta$ 要學。

### 三種參數別搞混

講者說這是整堂課最容易讓人混亂的地方（32:55 起）。有三組名字：

- **模型參數** $\theta$：從資料學出來的權重。
- **自然參數** $\eta = \theta^\top x$：$\theta$ 碰到一筆 x 之後得到的數，是誤差分布的參數。
- **標準參數**（canonical parameter）：你在維基百科上查那個分布會看到的參數，例如 Bernoulli 的 $\phi$、高斯的 $\mu$。

對照講義時要留意一個用詞衝突：講義第 3.1 節把 canonical parameter 當成自然參數 $\eta$ 的別名，和課堂的用法相反。本文跟課堂，「標準參數」指 $\phi$、$\mu$ 這一類。

$\eta$ 與標準參數之間靠一個函數換算。講義的定義是：把自然參數映到平均數的函數 $g(\eta) = \mathbb{E}[T(y);\eta]$ 叫 canonical response function，它的反函數 $g^{-1}$ 叫 canonical link function。課堂上講者把這個換算統稱為「link function or response function」，沒有區分方向。由上一節的結果，$g$ 就是 $a'$。

講者對這一堆名字的總結在 33:57：「These are the only ones you learn. The rest of this is modeling the noise.」要學的只有 $\theta$。

### 推論與學習

**推論**是直接讀出期望值：

$$
h_\theta(x) = \mathbb{E}[y \mid x;\theta] = a'(\eta) = a'(\theta^\top x)
$$

**學習**是最大概似。假設 n 筆訓練資料是 IID，聯合機率可以拆成乘積，取 log 變成求和：

$$
\ell(\theta) = \log \prod_{j=1}^{n} p\big(y^{(j)} \mid x^{(j)};\theta\big) = \sum_{j=1}^{n} \log p\big(y^{(j)} \mid x^{(j)};\theta\big)
$$

有學生在 34:57 問這裡是不是偷偷假設了誤差平均為 0 與 IID。講者回答 IID 的確是整套設定隱含的假設，沒有它就不能把聯合機率拆成乘積；「平均為 0」沒有明說，但直覺上類似的事應該成立。

課堂上有人問損失函數從哪來，答案就是這條式子裡的 $\log p$：選了分布，$\log p$ 的形式就定了，損失函數也就定了。

### 一條更新式通吃

講者接著說演算法永遠是同一個形式，可以自己驗證。以下把驗證寫出來。取一筆資料 $(x, y)$，$T(y)=y$，把 $\eta = \theta^\top x$ 代進指數族的 log：

$$
\log p(y \mid x;\theta) = \log b(y) + (\theta^\top x)\, y - a(\theta^\top x)
$$

對 $\theta$ 取梯度。第一項不含 $\theta$；第二項的梯度是 $y\,x$；第三項用連鎖律，$a$ 對 $\eta$ 微分得 $a'(\theta^\top x)$，$\eta$ 對 $\theta$ 的梯度是 $x$：

$$
\nabla_\theta \log p(y \mid x;\theta) = y\,x - a'(\theta^\top x)\, x = \big(y - h_\theta(x)\big)\, x
$$

所以隨機梯度上升的一步是：

$$
\theta \leftarrow \theta + \alpha\, \big(y - h_\theta(x)\big)\, x
$$

預測誤差乘上輸入，往那個方向走。這條式子沒有用到任何特定分布，換分布只是換掉 $h_\theta$ 裡的 $a'$。

本文再補一段課堂上沒有展開的話，把前面的凸性接到訓練上。一筆資料的負對數概似是

$$
-\log p(y \mid x;\theta) = a(\theta^\top x) - y\,\theta^\top x - \log b(y)
$$

把它看成 $\theta$ 的函數：$a$ 對 $\eta$ 是凸的，$\eta = \theta^\top x$ 對 $\theta$ 是線性的，凸函數套上線性函數仍然是凸的；第二項對 $\theta$ 是線性的，第三項不含 $\theta$。所以每一筆的負對數概似對 $\theta$ 都是凸的，n 筆加起來也是。照這堂課的配方（$T(y)=y$、$\eta=\theta^\top x$）做出來的 GLM，訓練問題都是凸的。這句話有兩個邊界：凸只保證沒有比較差的局部低點，不保證最小值唯一或一定存在；如果不讓 $\eta$ 直接等於 $\theta^\top x$、改用別的 link function，這個保證就不一定成立。

### 代回去：線性迴歸與邏輯斯迴歸

這一小節是本文依講義第 3.2.1 與 3.2.2 節補的；課堂上講者在這裡只說了一句「There's some examples there」。講義的走法是直接用 $\mathbb{E}[y]=\mu=\eta$ 與 $\mathbb{E}[y]=\phi=1/(1+e^{-\eta})$，這裡改用上一節的 $h_\theta(x)=a'(\theta^\top x)$ 讀出來，結果相同。

- **高斯**：$a'(\eta) = \eta$，所以 $h_\theta(x) = \theta^\top x$。這是線性迴歸，更新式是 $\theta \leftarrow \theta + \alpha (y - \theta^\top x)x$，和先前推最小平方時得到的更新式相同。
- **Bernoulli**：$a'(\eta) = 1/(1+e^{-\eta})$，所以 $h_\theta(x) = 1/(1+e^{-\theta^\top x})$。這是邏輯斯迴歸。之前如果好奇 sigmoid 為什麼長那樣，這裡是一個答案：假設 y 是 Bernoulli，再照 GLM 的三個決定走，sigmoid 是結果而非選擇。

### 照配方做一次：Poisson 迴歸

以下是本文自擬的例子，不是課堂內容。課堂只提到 Poisson 適合計數資料，並說作業會讓大家試不同的分布。情境借自講義第 3.2 節開頭，數字是本文編的。

假設要預測一家店某個小時來幾位客人，y 是非負整數，挑 Poisson：

$$
p(y;\lambda) = \frac{e^{-\lambda}\lambda^{y}}{y!} = \frac{1}{y!}\exp\!\big(y\log\lambda - \lambda\big)
$$

對照定義：$b(y) = 1/y!$、$T(y)=y$、$\eta = \log\lambda$、$a(\eta) = \lambda = e^{\eta}$。微分一次 $a'(\eta) = e^{\eta} = \lambda$，是 Poisson 的平均數；再微分一次還是 $\lambda$，是 Poisson 的變異數。兩個都對。

所以模型是 $h_\theta(x) = e^{\theta^\top x}$，更新式照抄。代數字走一步：

- 現在的參數 $\theta = (0.5,\ 0.2)$，一筆資料 $x = (1,\ 2)$（第一維是常數項），實際來了 $y = 4$ 位，學習率 $\alpha = 0.05$。
- $\eta = 0.5 \times 1 + 0.2 \times 2 = 0.9$，預測 $h = e^{0.9} \approx 2.460$。
- 誤差 $y - h \approx 1.540$。
- 更新：$\theta \leftarrow (0.5 + 0.05 \times 1.540 \times 1,\ 0.2 + 0.05 \times 1.540 \times 2) = (0.577,\ 0.354)$。
- 新的 $\eta = 0.577 + 2 \times 0.354 = 1.285$，新的預測 $e^{1.285} \approx 3.615$。

預測從 2.46 位移到 3.62 位，往實際的 4 位靠近。這筆資料的對數概似 $y\eta - e^{\eta} - \log y!$ 也從 $-2.038$ 升到 $-1.653$（預測剛好等於 4 時的上限是 $-1.633$）。整個過程沒有為 Poisson 推任何新的東西，只查了它的 $a(\eta)$。

## 多類別分類：softmax

（錄影 37:00–57:27）

### 標籤與預測的表示法

要在 k 個離散值之間選。講者用四個短的詞當類別：cat、dog、car、bus。標籤編成 one-hot 向量：cat 是 $e_1 = (1,0,0,0)$，dog 是 $e_2$，car 是 $e_3$，bus 是 $e_4$。

預測則是這四個類別上的一個機率分布。因為 one-hot 向量彼此正交，分布可以寫成它們的加權和。講者舉的例子是 $(0.5,\ 0.3,\ 0.1,\ 0.1)$：貓的機率 0.5、狗 0.3、車與公車各 0.1。邏輯斯迴歸做的是同一件事，只是兩個類別時機率加起來是 1，寫一個數就夠了。

### softmax 的式子

每個類別有自己的一組參數 $\theta_j \in \mathbb{R}^{d+1}$，和 x 同維度。內積 $\theta_j^\top x$ 是一個純量，講者叫它 raw score（原始分數），講義叫 logit。機率是：

$$
p(y = i \mid x;\theta) = \frac{\exp(\theta_i^\top x)}{\sum_{j=1}^{k} \exp(\theta_j^\top x)}
$$

為什麼不直接拿分數當機率？講義第 2.3 節點出兩個問題：分數不一定落在 0 到 1 之間，加起來也不一定是 1。取 exp 讓每一項變成正數，除以總和讓它們加起來是 1。講者把這個過程叫做 bake off：每個類別拿自己的分數出來比。

有學生問維度（54:24）。講者把型別寫清楚：x 是一筆資料的特徵向量，不是整個資料矩陣；每個 $\theta_j$ 與 x 同維度；$\theta_j^\top x$ 是純量。特徵越多，每個類別要學的參數就越多。

### 幾何圖像：每個類別一個超平面

（錄影 41:01–45:08、50:13–52:18）

講者在平面上畫了四群點，分得很開，並說真實資料不會這麼乾淨。對 cat 這一類，畫一條線 $\theta_1^\top x = 0$。這條線在高維空間裡是一個超平面。幾個容易誤會的地方：

- $\theta_1$ 不在這條線上，它是這條線的法向量，指向「比較像貓」的那一側。
- 沿著 $\theta_1$ 的方向走，會依序碰到 $\theta_1^\top x = 1$、$\theta_1^\top x = 2$ 這些平行線。講者稱它們為等值線：同一條線上的點，cat 分數相同。
- 每個類別各有一條這樣的線與一個方向。一個點在某個類別的分數，就是它落在那個類別的哪一條等值線上。

講者舉的點：某隻貓落在 $\theta_1^\top x = 1$ 那條線上，cat 分數是 1；它在 dog 那條線的負側，dog 分數是 $-2$。

有些區域兩個類別都給正分，就要靠 softmax 比出高下。講者解釋 exp 在這裡的好處（47:09）：一個點如果離某個類別很遠，分數是 $-5$，那 $e^{-5}$ 是很小的數（約 0.0067），那個類別幾乎不佔機率。離得遠的類別會被指數壓掉，接近的類別之間才會有像樣的機率分配。

有學生問（46:09）：每一條線是不是各自一個邏輯斯迴歸？講者說方向對，但不完全是，因為每個類別的機率要跟其他所有類別一起正規化。

### 數值例子

課堂在 53:21 有一張數值例子的投影片，講者很快帶過，沒有把數字念完整。以下是本文自擬的例子：cat 與 dog 的分數沿用講者口頭舉的 1 與 $-2$，car 與 bus 的分數是本文補的。

| 類別 | 分數 $\theta_j^\top x$ | exp | 機率 |
|---|---|---|---|
| cat | 1 | 2.7183 | 0.628 |
| dog | −2 | 0.1353 | 0.031 |
| car | 0.1 | 1.1052 | 0.255 |
| bus | −1 | 0.3679 | 0.085 |
| 合計 | | 4.3267 | 1.000 |

計算過程：每個分數取 exp，四個加起來是 4.3267，各自除以這個總和。例如 cat：$2.7183 / 4.3267 \approx 0.628$。

讀這張表要注意兩件事。第一，分數差距與機率比例的關係是指數的：cat 比 car 高 0.9 分，機率比是 $e^{0.9} \approx 2.46$ 倍；cat 比 dog 高 3 分，機率比是 $e^{3} \approx 20$ 倍。第二，沒有任何類別的機率是 0，連分數 $-2$ 的 dog 都還有 3%。這一點在後面談訓練時會用到。

### 幾個問答

**線性可分的資料才分得開，這模型不是很弱嗎（45:08）。** 講者替學生把話說得更重：「You brought me candy, but you told me nonsense.」他的回答是：在二維的確如此，但高維空間的行為不同，空間大得多，資料比較容易被線性分開。他舉 768 維為例，說印象中那是 GPT-2 的 token 向量維度。他還提到 kernel 這個想法：把資料放進更高維、甚至無限維的空間，講的還是同一個線性的故事（這份公開錄影沒有專講 kernel 的一堂，要讀可以看主講義第 5 章）。

**只想要一個答案，要算出全部機率嗎（48:10）。** 這堂課的「推論」指算出整個機率向量。如果只要一個輸出，可以直接取分數最高的類別。但語言模型實際上不是這樣做：它從分布裡抽樣，所以同一個問題問兩次，答案通常不同。講者提到他和學生寫的 Large Language Monkeys 論文就建立在這件事上：如果模型是決定性的，重複問沒有意義。所以多類別問題裡，整個分布比「最可能的那一個」重要。

**一張圖裡同時有貓和狗怎麼辦（52:18）。** 這個模型處理不了，因為類別是互斥的，輸出是類別上的一個分布。講者說那是另一個任務，通常要換一種誤差模型，例如用偵測器逐個回答「圖中有沒有貓」。

## k = 2 時退回邏輯斯迴歸

（錄影 57:27–59:30）

如果多類別模型在 k=2 時做出跟邏輯斯迴歸不同的事，那會很奇怪。講者用一張投影片檢查。兩個類別時：

$$
p(y=1 \mid x) = \frac{e^{\theta_1^\top x}}{e^{\theta_1^\top x} + e^{\theta_2^\top x}}
$$

分子分母同除以 $e^{\theta_1^\top x}$（等於乘以 1，值不變）：

$$
p(y=1 \mid x) = \frac{1}{1 + e^{-(\theta_1 - \theta_2)^\top x}}
$$

令 $\theta = \theta_1 - \theta_2$，這就是 $1/(1+e^{-\theta^\top x})$。兩個超平面合併成一個，兩個模型在每個點給出相同的機率。

一般的 k 也有同樣的現象：機率加起來是 1，所以 k 個類別只有 $k-1$ 個自由的機率值，知道前面的就知道最後一個。本文補充一個直接的推論：把同一個向量 $c$ 加到每個 $\theta_j$ 上，分子分母會同乘 $e^{c^\top x}$，機率完全不變。所以 softmax 的 k 組參數裡有一組是多餘的，k=2 的情況只是把這件事寫明。

## 訓練：交叉熵與 label smoothing

（錄影 59:30–1:11:45）

### 交叉熵就是最大概似

訓練照舊是最大概似：讓正確類別的機率越大越好。講者的直覺版本是：給一張標註為貓的圖，模型卻說是狗，就該調整參數，把貓的機率拉高、把狗的壓低。

寫成損失函數是交叉熵（cross entropy）。設標籤分布是 $q$、模型輸出是 $p$：

$$
\ell = -\sum_{i=1}^{k} q_i \log p_i
$$

標籤是 one-hot 時，$q$ 只有正確類別那一格是 1，求和只剩一項：$\ell = -\log p_{y}$，就是正確類別機率的負對數。講者說這沒有藏任何東西，把 softmax 的機率取 log 就得到它，也是 PyTorch 之類的函式庫裡叫 cross entropy 的那個東西。

用前面的例子：正確答案是 cat，$\ell = -\log 0.628 \approx 0.465$。如果正確答案其實是 dog，$\ell = -\log 0.03128 \approx 3.465$，模型給正確答案的機率越低，損失越大。（這一節的損失與梯度都是用沒有四捨五入的機率算的，再取三位小數；直接代表格裡的三位小數會有一點出入。）

雖然損失只看正確類別那一格，但那一格的分母裡有所有類別的分數，所以梯度會流到每一組參數。課堂上沒有推梯度，講義第 2.3 節有。這裡用一般的 $q$ 推一次，記 $t_i = \theta_i^\top x$。把 $\log p_i = t_i - \log\sum_j e^{t_j}$ 代入，並用 $\sum_i q_i = 1$：

$$
\ell = -\sum_i q_i t_i + \log \sum_j e^{t_j}
$$

對 $t_i$ 微分，第一項給 $-q_i$，第二項給 $e^{t_i}/\sum_j e^{t_j} = p_i$：

$$
\frac{\partial \ell}{\partial t_i} = p_i - q_i, \qquad \nabla_{\theta_i}\, \ell = (p_i - q_i)\, x
$$

梯度下降的一步是 $\theta_i \leftarrow \theta_i + \alpha (q_i - p_i)x$，又是「標籤減預測，乘上輸入」，和 GLM 那條更新式同一個形狀。one-hot 時 $q = e_y$，這就是講義的式 (2.17) 與 (2.18)。

形狀相同不是巧合，以下是本文補充。one-hot 標籤下，上面那條損失可以寫成 $-\eta^\top T(y) + a(\eta)$：取 $\eta = (t_1,\dots,t_k)$、$T(y)$ 是 y 的 one-hot 向量、$b(y)=1$、$a(\eta) = \log\sum_j e^{\eta_j}$。也就是說，softmax 給出的類別分布本身就是指數族的一員，$a$ 的梯度 $\partial a/\partial \eta_i = p_i$ 正是 $\mathbb{E}[T(y)]$ 的第 i 個分量，和前半堂「對 $a$ 微分得到期望值」是同一件事。課堂說 multinomial 屬於指數族、整套做法照搬，但沒有把這個改寫做出來。

例子裡 one-hot 標籤為 cat 時，$p - q = (-0.372,\ 0.031,\ 0.255,\ 0.085)$。cat 的分數會被往上推，另外三個被往下壓，壓的力道與它們目前佔的機率成正比，所以 car 被壓得最多。

### Label smoothing

講者接著介紹一個他說「surprisingly good idea」的技巧（1:03:33 起）。以三個類別 A、B、C 為例，正確答案是 A。原本的標籤分布是 $(1, 0, 0)$；label smoothing 把它改成 $(1-2\varepsilon,\ \varepsilon,\ \varepsilon)$，把一點點機率分給其他類別，再照樣代進交叉熵的 $q$。

有學生答這是為了避免過度配適，講者說對，這是一種正規化（regularization），這個詞之後才會正式教（[第 6 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)）。他給的理由有兩個：

- 標籤可能是錯的。資料裡總有一部分標錯，在標籤上留一點餘地，模型對它比較誠實。
- 從訓練動態看，如果拿同一筆資料反覆訓練，模型會被推向那一筆資料特有的樣子。留一點不確定性，等於把它留在那個類別的一小塊鄰域裡。

回到四類的例子，取 $\varepsilon = 0.05$，標籤變成 $q = (0.85,\ 0.05,\ 0.05,\ 0.05)$（以下數字是本文算的）：

$$
\ell = -\big(0.85\log 0.628 + 0.05\log 0.031 + 0.05\log 0.255 + 0.05\log 0.085\big) \approx 0.760
$$

梯度 $p - q = (-0.222,\ -0.019,\ 0.205,\ 0.035)$。和 one-hot 的版本比較，有兩個差別。cat 被往上推的力道變小了。dog 那一格變成負的，表示 dog 的分數會被稍微往上調，因為模型給它的 3.1% 比標籤要求的 5% 還低。

這也說明它為什麼能擋住過度自信，以下是本文的解讀，而且只看這一筆資料。one-hot 標籤下，梯度 $p - q$ 要到 $p_{\text{cat}} = 1$ 才會是零，而分數有限時 softmax 的機率到不了 1，所以只要一直拿這筆資料訓練，cat 與其他類別的分數差距就會被一路推大。平滑過的標籤下，梯度在 $p = q$ 時就是零；損失對分數是凸的（$\log\sum_j e^{t_j}$ 是凸函數，其餘是線性項），所以梯度為零的地方就是最小值。這時 $p_{\text{cat}}/p_{\text{dog}} = e^{t_{\text{cat}} - t_{\text{dog}}} = 0.85/0.05$，分數差距是有限的 $\log 17 \approx 2.83$，到了這裡就不再往外推。此時損失也不是 0，而是 $-\sum_i q_i \log q_i \approx 0.588$。

講者補充，如果你真的有額外資訊，例如確定是貓或狗、但確定不是車，也可以把那個分布直接放進 $q$。label smoothing 用的是最沒有資訊的版本，每一類都分一點，卻已經有幫助。他的說法是：「It's not like it's oh this is the right thing to do. Just a thing you can do.」

### 為什麼是 softmax

有學生問為什麼用指數，是為了保證正數並讓分布尖一點嗎（1:07:43）。講者給了三層回答：

1. 它有該有的性質：在 0 與 1 之間平滑地變化，讓所有類別一起比。
2. 有一派統計學家喜歡用最大熵來論證分布的選擇，這類指數形式的分布是離散情況下的最大熵分布，也就是假設最少的。講者說他哲學上不太買這個論證。
3. 他認為最重要的一點是數值上方便。如果損失只挑最高的那一個、對其他類別不給任何訊號，那些權重就拿不到梯度，等於把資訊丟掉。softmax 讓每個類別都有非零的機率，前面例子裡 dog 的 3% 就是這個意思。

他的結論是，softmax 不是唯一正確的選擇，但它方便、數值穩定，「you kind of have to justify doing something else instead of it」。

## 講者的收尾

（錄影 1:11:45–1:14:40）

最後幾分鐘講者把整堂課壓成三點：

- 到目前為止學的東西，基本上是這堂課兩張投影片的特例：只要誤差分布寫得成指數族，推論與學習的做法就定了。
- softmax 加交叉熵是現在所有大型語言模型的最後一層，大家在過去一小時內多半就用過它。
- 提 label smoothing 是為了強調一件事：「your data and model are always a little bit wrong」。機器學習常常是在找對雜訊與錯誤比較穩健的做法。

## 自我檢查

**1. 把指數分布 $p(y;\lambda) = \lambda e^{-\lambda y}$（$y \ge 0$）寫成指數族，並用 $a(\eta)$ 求平均數。**

答：$p = \exp(-\lambda y + \log\lambda)$，所以 $T(y)=y$、$b(y)=1$、$\eta = -\lambda$、$a(\eta) = -\log\lambda = -\log(-\eta)$。$a'(\eta) = -1/\eta = 1/\lambda$，正是指數分布的平均數。再微分一次得 $1/\eta^2 = 1/\lambda^2$，是變異數。判準：$a$ 必須寫成 $\eta$ 的函數才能微分，停在 $-\log\lambda$ 不算完成。

**2. 為什麼每個 GLM 的隨機梯度更新都是 $\theta \leftarrow \theta + \alpha(y - h_\theta(x))x$？指出推導裡用了指數族的哪兩個性質。**

答：一是指數裡 y 與 $\eta$ 只有線性交互，所以 $\log p$ 對 $\eta$ 微分得到 $y - a'(\eta)$；二是 $a'(\eta) = \mathbb{E}[y]$，而 GLM 規定輸出就是期望值，所以 $a'(\theta^\top x) = h_\theta(x)$。再加上 $\eta = \theta^\top x$ 的連鎖律多出一個 $x$。

**3. 三個類別的分數是 $(2, 0, -1)$，正確類別是第二類。算 softmax 機率與交叉熵。**

答：exp 之後是 $(7.389,\ 1,\ 0.368)$，總和 8.757，機率約 $(0.844,\ 0.114,\ 0.042)$。交叉熵 $-\log 0.114 \approx 2.17$。梯度 $p - q = (0.844,\ -0.886,\ 0.042)$，第一類的分數會被大幅往下壓。

**4. 有人說「softmax 在兩個類別時有兩組參數，邏輯斯迴歸只有一組，所以 softmax 比較有表達力」。這句話哪裡錯？**

答：兩組參數只透過差 $\theta_1 - \theta_2$ 影響機率。同除以 $e^{\theta_1^\top x}$ 之後就是 sigmoid，兩個模型能表示的機率函數完全相同，多出來的那組參數是多餘的。

**5. 標籤改用 $(1-2\varepsilon, \varepsilon, \varepsilon)$ 之後，訓練到損失最小時，正確類別與其他類別的分數差是多少？這跟 one-hot 標籤有什麼不同？**

答：梯度 $p - q$ 為零的地方是最小值，也就是 $p = q$。分數差是 $\log\frac{p_1}{p_2} = \log\frac{1-2\varepsilon}{\varepsilon}$，例如 $\varepsilon = 0.1$ 時是 $\log 8 \approx 2.08$。one-hot 時（只看這一筆資料）沒有有限的最佳分數差，差距越大損失越小。

## 對應閱讀

- **主講義第 3 章 Generalized linear models，pp.30–34**。第 3.1 節（pp.30–32）是指數族的定義與 Bernoulli、高斯兩個改寫；第 3.2 節（pp.32–34）是 GLM 的三條假設，以及推回最小平方（3.2.1）與邏輯斯迴歸（3.2.2）。
- **主講義第 2.3 節 Multi-class classification，pp.25–27**。softmax 的定義、交叉熵損失與梯度，式 (2.9) 到 (2.19)。

課堂與講義的差異：

- **課堂有、講義這兩處沒有**：$a(\eta)$ 的一次與二次微分是期望值與變異數、由此得到凸性；累積量生成函數的補充；「一條更新式通吃所有 GLM」的說法；softmax 的超平面圖像；k=2 退回邏輯斯迴歸的檢查；label smoothing；為什麼選 softmax 的討論。
- **講義有、課堂沒細講**：高斯設 $\sigma^2 = 1$ 的理由與一般情形的 dispersion parameter（p.31 註 2）；最小平方與邏輯斯迴歸作為 GLM 的逐步推導；交叉熵梯度的式子；canonical response function 與 canonical link function 的區分。
- **切入點不同**：講義在第 2.3 節直接定義 softmax，沒有經過指數族；課堂把它放在 GLM 之後，說 multinomial 也是指數族的一員、整套做法照搬，但沒有實際把 multinomial 改寫成指數族形式。兩邊都沒有做那個改寫。
- **用詞**：講義把三件事叫「assumptions」並說第三條比較像設計選擇；課堂沒有編號，直接講成挑分布、設 $\eta = \theta^\top x$、輸出期望值。canonical parameter 一詞，課堂指 $\phi$、$\mu$ 這類參數，講義指 $\eta$。

**系列導覽**：上一堂 [第 3 堂：最大概似與邏輯斯迴歸](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)｜下一堂 [第 5 堂：高斯判別分析與 Naive Bayes](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 4: Exponential Family, GLMs Classification](https://www.youtube.com/watch?v=8gVi4Rk21Eg)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：全篇照英文字幕的順序與時間戳寫成，引用的英文句子都出自字幕；沒有看板書與投影片畫面，所以投影片上的數值例子（約 53:21）無法還原，改用本文自擬的數字，公式的寫法以主講義為準。

## 參考資料

- [Stanford CS229 Spring 2026 Lecture 4 錄影（YouTube）](https://www.youtube.com/watch?v=8gVi4Rk21Eg)：全文的底本，課堂順序、講者說法與問答都依這支影片的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 3 章（pp.30–34）用來對照指數族與 GLM 的記號、三條假設與 canonical response／link function 的定義；第 2.3 節（pp.25–27）用來對照 softmax 與交叉熵梯度的式子。
- [Stanford CS229 Spring 2026 播放清單（Stanford Online）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)：確認堂次與影片標題。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：本系列的課程定位與閱讀路線。
