---
title: "Metrized Deep Learning：替整個網路的權重找一把合用的尺｜MIT 6.7960 第 23 堂"
date: 2026-10-13
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - optimization
  - modular-norm
  - spectral-norm
  - steepest-descent
  - fall-2024
lang: zh-TW
math: true
description: "MIT 6.7960 Fall 2024 OCW 第 23 堂（Jeremy Bernstein）：把神經網路當樂高，替每個模組定義敏感度、質量與範數，用串接與並排兩條規則遞迴組出整個網路的範數，再由它導出不隨寬度深度漂移的學習率與 modular dualization。"
tldr: "梯度下降等於假定權重空間是歐氏的，而神經網路多半不是。Bernstein 的做法是替每一層選一個範數（線性層用依形狀縮放的譜範數），再用兩條組合規則算出整個網路的範數；用它正規化更新，最佳學習率就不隨寬度與深度漂移。把同一個想法推到對偶映射，線性層的更新變成「把梯度的奇異值全設為 1」，這也是當時 nanoGPT 訓練速度紀錄用的做法。"
draft: false
series:
  name: "MIT 6.7960 導讀"
  order: 27
---

> 🌏 [English version](/posts/tech/2026-10-13-mit-67960-l23-metrized-deep-learning-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**（對應 OCW Lec 23 Metrized Deep Learning，Jeremy Bernstein 主講）。本文依 OCW 官方逐字稿與投影片整理；逐字稿沒有時間戳，引用以段落內容定位。這堂講的是講者自己進行中的研究，他開場就請聽眾保持懷疑。

---

## 這一堂要回答的問題

你把 Transformer 加寬一倍，原本調好的學習率就不是最佳了。為什麼？有沒有辦法讓學習率不必跟著模型大小重調？

[MIT 6.7960](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) 第 23 堂的答案從一個類比開始。我們像拼樂高一樣組神經網路：有一盒積木，拼起來可以是 Transformer，也可以是別的東西。Jeremy Bernstein 問：既然網路是這樣拼的，為什麼理論不也這樣拼？如果每塊積木都有自己的理論描述，再加上「兩塊拼起來之後性質怎麼變」的規則，那不管你拼出什麼，都自動有一份理論可用。

讀完這篇，你應該能：

- 說出一個模組要帶哪四個屬性，以及「well-normed」的兩個條件。
- 用串接與並排規則手算組合後的範數，並看出它怎麼分配各層的更新量。
- 說明為什麼「權重減掉學習率乘梯度」在型別上有問題，以及譜範數下的替代做法。

先備是[第 7 堂](/posts/tech/2026-08-30-mit-67960-l07-scaling-rules-optimization)的最陡下降與學習率隨寬度漂移的問題，同一位講者，這堂是它的延續。需要知道矩陣的奇異值分解。

## 我們在乎積木的什麼性質

一層網路有輸入 $x$、權重 $w$、輸出 $y$。Bernstein 在乎的只有一件事：**敏感度**。輸入動一點、權重動一點，輸出會動多少？

他認為這個問題很基本，卻沒有人真的懂，也沒有人教。它重要的理由至少有兩個：

- **最佳化**：訓練就是在改所有層的權重。
- **穩健性**：對抗樣本就是輸入小小一動、輸出大幅改變。

這堂只考慮兩種拼法：**串接**（一塊疊在另一塊上）與**並排**（放在旁邊，輸入複製一份分送兩邊）。串接比較麻煩，因為前一塊的輸出是後一塊的輸入，兩者耦合。

如果能刻畫單一積木的敏感度，又知道這兩種拼法怎麼改變敏感度，PyTorch 或 JAX 這類函式庫就可以當成一盒附說明書的樂高。

## 為什麼需要一個範數

把損失函數對權重做泰勒展開：

$$
L(w + \Delta w) = L(w) + \nabla_w L^\top \Delta w + \tfrac12\, \Delta w^\top \nabla_w^2 L\, \Delta w + \dots
$$

如果找得到一個範數 $\|\cdot\|$ 與一個銳度 $\lambda$，讓二階項被 $\tfrac12 \lambda \|\Delta w\|^2$ 蓋住，而且蓋得很緊，就可以拿這個上界當成損失的近似，選讓它最小的那一步。這就是最陡下降。不同的範數給出不同的最佳化演算法，所以問題變成：**對神經網路來說，什麼是好的範數？**

投影片分三步把這個問題化簡。

**第一步**。深度學習的損失是合成函數：誤差量度 $\ell$ 套在網路 $f$ 外面。這種函數的二階項可以拆成兩塊（Gauss-Newton 分解），一塊含網路的曲率，一塊含誤差量度的曲率。

**第二步**。假設網路的**輸出**有一個好的範數。這比較合理，因為輸出通常只是一個向量，候選的範數沒幾個（L1、L2、L∞、RMS）。有了它，兩塊都能被上界蓋住。

**第三步**。於是只要在**權重空間**找到一個範數，讓網路滿足兩個條件就夠了：

$$
\|\nabla_w f\, \Delta w\|^2 \le \delta\, \|\Delta w\|^2
\qquad
\|\Delta w\, \nabla_w^2 f\, \Delta w\| \le \alpha\, \|\Delta w\|^2
$$

前者說網路對權重是 Lipschitz 連續的，後者說它是 Lipschitz 平滑的。式子照投影片的寫法，第一條是範數平方的形式。

換個不談最佳化的說法：這兩條是在限制網路對權重做泰勒展開時的一階與二階項。有了這樣的範數，每次要改權重，就能直接預測輸出最多變多少。

有學生問這兩個條件是不是對任何範數都成立。Bernstein 回答：成立，因為範數彼此等價，在一個範數下成立，換一個也成立，但鬆緊可以差很多。要的是讓這些條件成立得很緊的那一個。

## 遞迴地造出範數

整個網路的權重空間很複雜，直接找範數很難。做法是分階段：

1. 先替**特徵向量**所在的空間選範數（選項很少）。
2. 輸入與輸出空間各有範數後，中間那個線性算子就有**誘導算子範數**。這給出每一層權重的範數。
3. 再用一個程序把各層的範數**合成一個**整個網路的範數。

第三步就是這堂的核心，Bernstein 稱它為模組理論。

## 模組理論

程式設計裡有個模式叫 combinator pattern：定義少數簡單的原始元件，加上幾個組合子，用它們拼出複雜結構。這裡的抽象型別是**模組**（module）：有輸入、權重、輸出的東西。單一層是模組，整個網路也是模組。

### 模組的四個屬性

| 屬性 | 意思 |
|---|---|
| `forward` | 前向函數，從（權重、輸入）到輸出 |
| `sensitivity` | 一個正數，輸出對輸入的 Lipschitz 常數 |
| `mass` | 一個正數，決定這個模組在學習中占多少份量 |
| `norm` | 權重空間上的一個範數 |

模組分三類：**原子**（手寫屬性的層，如 Linear、Conv2d、Embed）、**鍵**（沒有權重的，如 ReLU）、**化合物**（用前兩者組出來的，如 MLP）。

### Well-normed

有這四個屬性就算模組，但函式庫只想收「好」的。一個模組是 **well-normed** 的，是指它的輸入與輸出空間各有範數，而且一階導數滿足：

$$
\|\nabla_w M \diamond \Delta w\|_{\mathcal Y} \le M.\text{norm}(\Delta w)
\qquad
\|\nabla_x M \diamond \Delta x\|_{\mathcal Y} \le M.\text{sensitivity} \times \|\Delta x\|_{\mathcal X}
$$

第一條：權重動多少（用模組自己的範數量），輸出最多就動多少，Lipschitz 常數是 1。第二條：輸入動多少，輸出最多動 sensitivity 倍。$\diamond$ 是張量縮併的簡寫，兩個向量就是內積，矩陣與向量就是矩陣乘向量。

### 兩個原子的例子

**線性模組**。sensitivity 是 1、mass 是 1，範數是：

$$
L.\text{norm}(W) = \sqrt{\frac{\text{fan-in}}{\text{fan-out}}}\; \|W\|_{\text{spectral}}
$$

輸入與輸出都用 RMS 範數時，只要輸入的範數不超過 1、權重的範數不超過 1，它就是 well-normed。

Bernstein 順帶提了一個他覺得有意思的觀察：實際的網路到處都在正規化特徵向量，大家只是直覺上覺得這樣比較穩。這個條件給了一個說法：要替線性模組取得 Lipschitz 保證，輸入與權重**必須**有界，否則它可以任意敏感。

**嵌入模組**。前向同樣寫成 $Wx$，但語意不同：輸入是 one-hot 向量，作用是挑出矩陣的一欄。所以它的範數不一樣，是各欄 RMS 範數的最大值；輸入空間用 L1 範數，因為 one-hot 向量像機率向量。

同樣是「矩陣乘向量」，因為用途不同就配不同的範數，這是整套做法的重點。

### 兩條組合規則

以下是投影片上的定義。$M_1$ 在前，$M_2$ 在後。

| | 串接 $M = M_2 \circ M_1$ | 並排 $M = (M_1, M_2)$ |
|---|---|---|
| forward | 兩個前向函數合成 | 兩個輸出組成一對 |
| sensitivity | $s_1 \times s_2$ | $s_1 + s_2$ |
| mass | $m_1 + m_2$ | $m_1 + m_2$ |
| norm | $\max(p\,\|w_1\|_1,\ q\,\|w_2\|_2)$ | $\max(p\,\|w_1\|_1,\ q\,\|w_2\|_2)$ |
| 係數 | $p = \dfrac{m}{m_1}\, s_2,\quad q = \dfrac{m}{m_2}$ | $p = \dfrac{m}{m_1},\quad q = \dfrac{m}{m_2}$ |

其中 $m = m_1 + m_2$，$\|w_i\|_i$ 是第 $i$ 個模組自己的範數。

幾個讀法：

- **敏感度相乘**：串接時 Lipschitz 常數相乘，這很直覺。
- **範數取最大值**，而且有加權。
- **串接的 $p$ 多乘一個 $s_2$**：後面那塊如果對輸入很敏感，前面那塊的權重就得動得更小心。這是串接「耦合」的地方，並排沒有這一項。
- **質量決定比例**：質量愈大的模組，係數愈小，同樣的總預算下可以動得愈多。

Bernstein 說這套東西的風格是「把定義下得非常巧，之後一切都容易」。定義好之後可以證明三件事：組合滿足結合律；兩個 well-normed 的模組組起來仍然 well-normed；特徵學習的量依質量分配。

用這兩條規則就能組出常見的結構。相加是「並排後接一個加法模組」，乘以常數是「接一個乘常數的模組」，兩者合起來就是殘差區塊 $a \times \text{Identity} + b \times M$，再把它自己串很多次就是殘差網路。

### 質量是什麼

有學生問質量的直覺。Bernstein 用 Transformer 回答：主體是很多個殘差區塊，前面一個嵌入層，後面一個輸出層。如果把區塊數加到一百萬個，嵌入層與輸出層還要不要訓練？是所有學習都該發生在中間，還是嵌入層扮演不同的角色、不管多深都該繼續學？他說他不知道答案，所以留了一個自由度讓人調。

實驗裡的做法很簡單：所有區塊共用一個總質量 $m$，有 $L$ 個區塊時每個分到 $m/L$；輸入層與輸出層的質量固定為 1。

理論還能推到二階。一個模組有三個銳度係數，分別對應只動權重、同時動權重與輸入、只動輸入。他把它們看成「廣義的最大特徵值」：一般談 Hessian 的銳度是看最大特徵值，但那是歐氏幾何的量；如果不相信權重空間是歐氏的，就該換一個概念。組合之後的銳度係數同樣可以自動算出。

## 把規則算一遍

以下算例是本文依投影片的定義自行計算的，不是課堂內容。

**一、為什麼線性層的範數有那個根號。** 長度 $n$ 的向量的 RMS 範數是 $\|x\|_2 / \sqrt{n}$。所以：

$$
\|Wx\|_{\text{RMS}} = \frac{\|Wx\|_2}{\sqrt{\text{fan-out}}} \le \frac{\|W\|_{\text{spectral}}\, \|x\|_2}{\sqrt{\text{fan-out}}} = \sqrt{\frac{\text{fan-in}}{\text{fan-out}}}\, \|W\|_{\text{spectral}}\, \|x\|_{\text{RMS}}
$$

那個根號就是把輸入輸出都換成 RMS 範數後的誘導算子範數。取 $W = [1, 1, 1, 1]$（fan-in 4、fan-out 1）：譜範數是 2，範數是 $\sqrt{4} \times 2 = 4$。驗算：輸入 $x = (1,1,1,1)$ 的 RMS 是 1，輸出是 4，剛好達到上界。

**二、串接兩個線性模組。** 兩者 sensitivity 都是 1、mass 都是 1。合成後 mass 是 2、sensitivity 是 1，$p = \tfrac{2}{1} \times 1 = 2$，$q = \tfrac{2}{1} = 2$：

$$
M.\text{norm}(\Delta W_1, \Delta W_2) = \max\big(2\, L.\text{norm}(\Delta W_1),\ 2\, L.\text{norm}(\Delta W_2)\big)
$$

如果要求整體更新的範數不超過 $\eta$，每一層的更新就不能超過 $\eta/2$。這合理嗎？輸出的一階變化是 $\Delta W_2 W_1 x + W_2 \Delta W_1 x$。在輸入與權重的範數都不超過 1 的條件下，兩項各不超過 $\eta/2$，加起來不超過 $\eta$，正好是 well-normed 第一條要的。

串三層時每層分到 $\eta/3$。層數愈多，每層能動的就愈少，這是自動發生的，不必手調。

**三、質量不相等。** 把第二個模組的質量改成 3：總質量 4，$p = 4$，$q = 4/3$。第一層的更新上限是 $\eta/4$，第二層是 $3\eta/4$。質量 1 比 3，可動的量也是 1 比 3。

## 縮放：學習率為什麼會漂

問題有兩種：加寬時表現變好，但最佳學習率一直移動；加深時如果做得不好，表現甚至變差。

Bernstein 的論點（他強調是論點，不是定理）：縮放得好其實不難，關鍵是搞懂系統的 Lipschitz 性質。具體是兩個條件：

1. Lipschitz 常數與寬度、深度等尺度無關（他稱為無因次）。
2. 上界在各種尺度下都一樣緊。

兩者成立的話，控制 $M.\text{norm}(\Delta w)$ 就等於控制輸出變化 $\|\Delta y\|$，學習率就能跨尺度沿用。Lipschitz 常數是 1 就是一個無因次的例子。

他們把這些規則寫成套件 [Modula](https://github.com/jxbz/modula)。用 `@` 把模組串起來，就同時得到前向函數與一個依架構算出來的正規化函數：

```python
from modula.atom import Linear
from modula.bond import ReLU

mlp = Linear(10, 10000) @ ReLU() @ Linear(10000, 1000)
```

投影片的實驗是在 OpenWebText 上訓練 GPT 一萬步，以 Adam 為基底：

- 直接改 nanoGPT 的寬度，最佳學習率會漂。
- 換成他們自己調整過架構、使其真的滿足 Lipschitz 條件的 Transformer。
- 再加上依模組範數的正規化，漂移就修掉了。

深度方面，Adam 本來就縮放得不差，加上正規化後大致維持。投影片另外列出論文裡的一個結果：這個正規化讓 GPT 可以用 SGD 訓練。

有學生問這是不是等於改學習率。Bernstein 說可以這樣看，但改的方式取決於架構，不同層的梯度被縮放的倍數不同。

他也坦白一個缺口。有學生問，如果梯度要把權重推出「範數不超過 1」的邊界怎麼辦。他回答這部分還沒有忠實實作，目前是直接讓它出界；他想做的是讓權重留在 well-normed 流形上的最佳化演算法。他也說這些結果在意料之中：他們先有怎麼縮放的直覺，再為了做到它而建了這套理論。

## Modular duality：梯度不該直接拿來減

最陡下降的那一步可以拆成兩部分：

$$
\arg\min_{\Delta w} \Big[\nabla L^\top \Delta w + \tfrac{\lambda}{2}\|\Delta w\|^2\Big]
= -\frac{\|\nabla L\|^\dagger}{\lambda} \times \arg\max_{\|t\| = 1} \nabla L^\top t
$$

前面的純量是步長（$\|\cdot\|^\dagger$ 是對偶範數），後面的 argmax 是**對偶映射**（duality map）：在單位範數的步裡，找讓線性改善最大的那一個。

Bernstein 的說法是：梯度是對偶向量，它唯一該做的事是與權重的變化做內積，告訴你函數的線性近似。梯度與權重的維度一樣，所以技術上可以相減，但這不代表該這樣做。投影片的標題是「梯度下降過不了型別檢查」：

```text
weight - LR * gradient            # 型別不對
weight - LR * dualize(gradient)   # 先轉回權重空間
```

直接減梯度等於假設範數是歐氏的，而神經網路的權重空間不太可能是歐氏的。他的旁證是：每個人都告訴你用 Adam，沒有人叫你用一般的梯度下降，大家直覺上都知道它哪裡不對，只是說不清楚。

有學生問小步長時減梯度不是一定會改善嗎。他回答會，只是可能很沒效率；對偶映射解的是一個有最佳性條件的問題。

### 遞迴地求對偶映射

既然整個網路的範數是遞迴造出來的，對偶映射也可以：

1. 對每一層，在該層的範數下解對偶映射。
2. 用對應於串接與並排的規則，遞迴地合成整個網路的對偶映射。

第二步的規則投影片上有圖但沒有寫出式子，Bernstein 說留給大家想。

### 線性層：把奇異值設為 1

線性層用譜範數時，對偶映射有封閉解。把梯度做奇異值分解 $G = U \Sigma V^\top$，則：

$$
\text{dualize}(G) = \arg\max_{\|A\| \le 1} \langle G, A \rangle = U V^\top = (G G^\top)^{-1/4}\, G\, (G^\top G)^{-1/4}
$$

也就是保留奇異向量，把所有奇異值設為 1。

Bernstein 說他是從 Google 的 [Shampoo](https://arxiv.org/abs/1802.09568) 注意到這件事的。Shampoo 贏了一個業界的訓練速度競賽，但實際用的方法與論文寫的差很多。他把實務上沒用到的部分拿掉後，發現對線性層剩下的核心操作就是上面那個式子，也就是譜範數下的最陡下降，而論文並沒有這樣表述。

本文自擬的小例子：$G = \begin{pmatrix} 3 & 0 \\ 0 & 0.1 \end{pmatrix}$。

| 更新方向（譜範數都是 1） | 矩陣 | 線性改善 $\langle G, A \rangle$ |
|---|---|---|
| 正規化的梯度 $G / 3$ | $\text{diag}(1,\ 0.033)$ | 3.003 |
| 對偶映射 $UV^\top$ | $\text{diag}(1,\ 1)$ | 3.1 |

梯度下降幾乎只沿第一個奇異方向走。對偶映射在兩個方向上都走滿，在同樣的譜範數預算下拿到更多線性改善。3.1 正是 $G$ 的奇異值總和，也就是譜範數的對偶範數。

在 Modula 裡實作只需要覆寫 Linear 的 `normalize`：做奇異值分解，回傳 $U V^\top$。Bernstein 在筆記本裡驗證它比單純的譜正規化快，兩者都比一般的梯度下降好。

原本的顧慮是奇異值分解太貴。Keller Jordan 在 [nanoGPT 競速](https://github.com/KellerJordan/modded-nanogpt)裡改用 Newton-Schulz 迭代來近似這個操作，投影片給的形式是 $X_{t+1} = a X_t - b X_t X_t^\top X_t + c X_t X_t^\top X_t X_t^\top X_t$。Bernstein 說這是當時訓練 nanoGPT 最快的方法。

他因此承認套件先前的做法是錯的：該做的不是正規化，而是依架構遞迴計算的對偶化，套件還要更新。

## 之後想做的事

Bernstein 認為這個想法還沒有擴散開，但可以更廣泛地用：

- **低精度模型**。要省能源與成本就要降低精度，但目前沒有人對網路的精度該怎麼表現有理論，都是試出來的。精度與連續性密切相關：要量化到多粗，得知道空間在什麼尺度上是連續的。
- **對抗穩健性**。同樣是連續性質的問題。

他把兩者都歸結為模組敏感度的問題。

## 常見誤解

- **「範數都等價，選哪個沒差」**：等價只保證界存在，不保證它緊。鬆的界對設計演算法沒有用。
- **「嵌入層就是沒有偏差項的線性層」**：計算上一樣，但輸入是 one-hot，所以配的範數不同。
- **「這是已經定案的理論」**：講者自己說要保持懷疑；well-normed 的邊界條件在實作裡還沒有強制，「好的縮放」是論點不是定理。
- **「把奇異值設為 1 會丟掉資訊」**：它不是在近似梯度，而是在譜範數的單位球裡找線性改善最大的方向。

## 自我檢查

1. 一個線性層 fan-in 是 1024、fan-out 是 256，譜範數是 0.5。它的模組範數是多少？是否滿足 well-normed 對權重的要求？
   **答**：$\sqrt{1024/256} \times 0.5 = 1$，剛好等於上限 1，滿足。
2. 串接兩個模組，$s_1 = 1$、$s_2 = 3$，質量都是 1。$p$ 與 $q$ 各是多少？哪一層的更新被限制得比較緊？
   **答**：$p = 2 \times 3 = 6$，$q = 2$。第一層被限制得比較緊（上限是 $\eta/6$），因為後面的模組會把它造成的變化放大三倍。
3. 並排兩個 sensitivity 都是 1 的模組，合起來的 sensitivity 是多少？為什麼不是相乘？
   **答**：$1 + 1 = 2$。並排時同一個輸入的變化同時送進兩邊，兩個輸出各自最多變 1 倍，合起來的上界是相加；相乘是串接時後一塊放大前一塊的輸出才會發生。
4. Well-normed 的兩條不等式各在限制什麼？sensitivity 出現在哪一條？
   **答**：第一條限制權重變動造成的輸出變化，上界是模組範數量到的權重變動量，常數是 1。第二條限制輸入變動造成的輸出變化，上界是 sensitivity 乘上輸入的變動量。sensitivity 只出現在第二條。
5. 直接做「權重減掉學習率乘梯度」，等於假設權重空間用的是什麼範數？在線性層用譜範數時，更新方向改成什麼？
   **答**：等於假設歐氏範數。用譜範數時，方向改成對偶映射 $UV^\top$，也就是保留梯度的奇異向量、把奇異值全設為 1。
6. $G$ 的奇異值是 5、2、0.01。譜範數下的對偶映射把它們變成什麼？對偶範數是多少？
   **答**：全部變成 1。對偶範數是奇異值的總和，7.01。

## 課程影片來源

2026-10-13 已即時回 MIT OCW Fall 2024 官方錄影列表核對講次，影片公開且允許嵌入；講次與主題以 OCW 的標示為準。

```youtube
url: https://www.youtube.com/watch?v=zBvsoxC6tAo
title: MIT 6.7960 Fall 2024 — Lec 23. Metrized Deep Learning
```

原始影片：[MIT 6.7960 Fall 2024 — Lec 23. Metrized Deep Learning](https://www.youtube.com/watch?v=zBvsoxC6tAo)

課程與錄影入口：

- [MIT OCW — Lec 23. Metrized Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec23_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

查核日期：2026-10-13。

內容核對：已依字幕核對（2026-10-13）：讀了 OCW 官方逐字稿全文與投影片，組合規則與原子模組的定義對照過投影片的圖。逐字稿沒有時間戳，本文未回聽原音。「把規則算一遍」一節與對偶映射的 2×2 例子是本文自行計算；課堂提到的訓練速度紀錄是 2024 年底的狀況，本文沒有另外查證現況。

## 參考資料

- [MIT 6.7960 Fall 2024 OCW 課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- [Lec 23 官方逐字稿（PDF）](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960f24_lec23_transcript.pdf)
- [Lecture 23: Metrized Deep Learning 投影片](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec23_pdf/)
- Large, Liu, Huh, Bahng, Isola, Bernstein，[Scalable Optimization in the Modular Norm](https://arxiv.org/abs/2405.14813)
- Bernstein & Newhouse，[Modular Duality in Deep Learning](https://arxiv.org/abs/2410.21265)
- Bernstein et al.，[On the distance between two neural networks and the stability of learning](https://arxiv.org/abs/2002.03432)
- Gupta, Koren, Singer，[Shampoo: Preconditioned Stochastic Tensor Optimization](https://arxiv.org/abs/1802.09568)
- [Modula 套件](https://github.com/jxbz/modula)與[專案網站](https://modula.systems/)
- Keller Jordan，[modded-nanogpt](https://github.com/KellerJordan/modded-nanogpt)
