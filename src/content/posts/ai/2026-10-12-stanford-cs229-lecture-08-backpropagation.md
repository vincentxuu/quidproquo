---
title: "反向傳播：算梯度為什麼只要一次前向的成本｜Stanford CS229 第 8 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, backpropagation, neural-networks, deep-learning]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 8
tldr: "這堂課從一個定理出發：能用 N 個基本運算算出來的純量函數，梯度也能在 O(N) 時間算完。做法是把鏈鎖律讀成「拿到 ∂J/∂u 就能算 ∂J/∂z，而且只需要中間那個模組的資訊」，再替矩陣乘法與啟動函數各推一個 backward 函數：Wᵀv、vzᵀ、σ′(z)⊙v。本文另外用一個 2-2-1 的小網路把前向與反向手算一遍。"
description: "Stanford CS229 Spring 2026 第 8 堂導讀：反向傳播的 O(N) 定理、鏈鎖律的轉置 Jacobian 形式、矩陣乘法與啟動函數的 backward 函數推導，附一個完整的手算例子。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 8 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 7 章 7.4 節；這堂幾乎全程板書，我沒看到板書畫面，板書上的式子是照講義補回來的。

[上一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture)把神經網路拆成矩陣乘法、啟動函數、LayerNorm 這些模組，並留下一個問題：SGD 每一步都要損失對所有參數的梯度，這個梯度怎麼算？第 8 堂整堂就在回答這件事，講者是 Tengyu Ma（他在課堂上稱講義為「my lecture notes」，主講義的作者欄是 Tengyu Ma 與 Andrew Ng），是 [Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning) 裡幾乎從頭到尾都在板書推導的一堂。

先備是多變數微積分的鏈鎖律、矩陣乘法與轉置，以及上一堂的 MLP 記號。讀完之後，你應該能對一個小型 MLP 手算每個參數的梯度，並說得出每一步用了哪條式子、為什麼整趟反向的成本跟一次前向同一個量級。

```youtube
url: https://www.youtube.com/watch?v=ne2ngVAoMG8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 8: Neural Networks 2 (Backprop)
captions: en
```

## 這堂課要解的問題（錄影 00:05–03:40）

講者先複習上一堂的設定。損失函數是每筆樣本損失的平均，第 $i$ 筆樣本的損失 $J^{(i)}(\theta)$ 是把模型輸出 $h_\theta(x^{(i)})$ 跟標籤 $y^{(i)}$ 丟進某個損失（例如 cross-entropy）得到的數字。最簡單的 SGD 每一步隨機抽一筆樣本 $i_k$，更新

$$
\theta \leftarrow \theta - \eta\,\nabla J^{(i_k)}(\theta).
$$

整堂課只關心式子裡的 $\nabla J^{(i_k)}(\theta)$。模型是很多層矩陣乘法與啟動函數疊起來的，這個梯度要怎麼有效率地算。

講者對這個問題的定位很有意思。他說學習率怎麼調、資料集怎麼設計，多少都帶主觀成分，反向傳播卻是有標準答案的：

> "this kind of questions, is one of the most technical questions you can ask in deep learning these days"（約 02:10）

他還提到研究單位面試曾經很愛考手推反向傳播。現在的框架都會自動微分（auto-differentiation），你不必自己寫，但他認為值得弄懂，理由是之後許多決定「depends on fundamentally, how it works to some degree」（約 03:12）。課堂後半提到的記憶體釋放與計算順序，就是這類決定。

## 一個定理：算梯度跟算函數值一樣快（錄影 03:40–12:26）

講者沒有直接從神經網路開始，而是先講一個更一般的說法。

**可微分電路（differentiable circuit）。** 把一個函數的計算過程畫成圖：輸入是 $x_1, x_2, \dots$，每個節點是一個算術運算（加、減、乘、除）或一個基本函數（sin、cos、exp、sigmoid 之類）。課堂的例子是先算 $x_1 + x_2$，再乘上 $x_3$ 得到 $(x_1+x_2)\,x_3$；另一條路把同一個 $x_1+x_2$ 再加上 $x_4$。電路跟公式的差別只有一點：中間結果可以重複使用。寫成公式時 $x_1+x_2$ 用了兩次就得寫兩次，電路裡只算一次。講者說這其實就是一種計算圖（computational graph）。

**電路的大小 $N$** 是運算節點的個數。假設每個基本運算花 $O(1)$ 時間，算出函數值就是把電路走一遍，花 $O(N)$ 時間。

**定理（講義 Theorem 7.4.1，課堂與講義都說是非正式敘述）。** 假設一個大小為 $N$ 的可微分電路計算一個實數值函數 $f:\mathbb{R}^\ell \to \mathbb{R}$。那麼梯度 $\nabla f$ 可以在 $O(N)$ 時間內算出來，而且算梯度的過程本身也是一個大小 $O(N)$ 的電路。

有兩個地方要看仔細。

第一，輸出必須是純量。梯度 $\nabla f$ 是一個 $\ell$ 維向量，每個輸入座標一個偏導數。

第二，$O(N)$ 跟輸入維度 $\ell$ 沒有相乘的關係。這一點有多划算，可以跟最直覺的做法比（以下這段比較是本文的補充，不是課堂內容）：用數值差分估梯度，每個座標都要把那個座標加一點點、重算一次函數值，$\ell$ 個座標就是 $\ell + 1$ 次前向，總共 $O(N\ell)$，而且得到的只是近似值。參數有一億個的模型，差分法要一億次前向，定理說只要常數倍的一次。

**對應到深度學習。** 講者把記號對起來：

| 定理裡的東西 | 深度學習裡是什麼 |
|---|---|
| 函數 $f$ | 單筆樣本的損失 $J^{(i)}$ |
| 輸入 $x \in \mathbb{R}^\ell$ | 參數 $\theta$ |
| $\ell$ | 參數個數 |
| 算 $f$（電路走一遍） | forward pass |
| 算 $\nabla f$ | backward pass |

神經網路是可微分電路：矩陣乘法拆開來是一堆乘法和加法，啟動函數是基本函數。所以定理直接適用。

講者接著補了一個觀察：幾乎所有現行的神經網路，前向需要的運算數都跟參數個數成正比。他舉的例子是 $d \times d$ 的矩陣乘上一個向量，參數有 $d^2$ 個，矩陣向量乘積也要 $d^2$ 次乘法。於是結論可以講得更具體：前向算損失、反向算梯度，兩者都是 $O(\text{參數個數})$。

講者說這堂課剩下的時間就是在證這個定理，只是不用最抽象的電路語言，改用貼近神經網路的模組語言來證。

## 把定理用兩次：二階資訊也拿得到（錄影 12:26–19:20）

進入證明之前，講者先展示定理的兩個進階用途。兩個都靠同一個推理：只要某個純量函數能有效率地算出來，它的梯度就能有效率地算出來，不管那個函數的定義裡有沒有包含梯度。

**用途一：對「走一步梯度下降之後的損失」微分。** 定義

$$
\theta \;\mapsto\; J\bigl(\theta - \eta\,\nabla J(\theta)\bigr).
$$

這是 $\theta$ 的函數，$\theta$ 在裡面出現兩次。算它的值要三步：拿到 $\theta$、算梯度 $\nabla J(\theta)$（定理保證這一步跟一次前向同量級）、在新位置 $\theta-\eta\nabla J(\theta)$ 算一次損失。講者說每一步都有效率，加起來大約是參數個數的三倍，所以整個函數是有效率可算的，依定理它對 $\theta$ 的梯度也是。

把它展開會看到二階導數（這個展開是本文補的）。令 $\theta' = \theta - \eta\nabla J(\theta)$，鏈鎖律給出

$$
\frac{d}{d\theta}J(\theta') = \bigl(I - \eta\,\nabla^2 J(\theta)\bigr)\,\nabla J(\theta').
$$

這裡 $\theta'$ 對 $\theta$ 的 Jacobian 是 $I-\eta\nabla^2 J(\theta)$，照下一節的鏈鎖律要乘上它的轉置；Hessian 是對稱矩陣，轉置後不變，所以式子裡沒有寫轉置。裡面有 Hessian，但我們從頭到尾不需要把 Hessian 寫出來。講者說這類做法用在 meta learning：把「跑某個訓練演算法若干步之後的損失」當成目標，對學習率或初始化做反向傳播。他舉的說法是「如果我用這個演算法跑 10 步，結果如何」可以當作初始化的損失函數。他還提到 test-time training 一類的做法也用到這個想法，並承認沒有上下文很難講清楚，這裡只是先讓你知道有這回事。

**用途二：Hessian-vector product。** 取任意向量 $v \in \mathbb{R}^\ell$，定義

$$
g(x) = \langle \nabla f(x),\, v\rangle = \sum_{i=1}^{\ell} \frac{\partial f}{\partial x_i}\,v_i .
$$

對 $x_j$ 微分，$v$ 是常數，所以

$$
\frac{\partial g}{\partial x_j} = \sum_{i=1}^{\ell} \frac{\partial^2 f}{\partial x_j\,\partial x_i}\,v_i = \bigl(\nabla^2 f(x)\,v\bigr)_j ,
$$

也就是 $\nabla g(x) = \nabla^2 f(x)\,v$。$\nabla f$ 可以在 $O(N)$ 算出，內積也便宜，所以 $g$ 是有效率可算的純量函數；再用一次定理，$\nabla g$ 也是。結論是 Hessian 乘上任意向量可以在 $O(N)$ 時間算完（講義寫的是 $O(N+\ell)$，多出來的 $\ell$ 是那個內積）。

講者特別提醒這不代表整個 Hessian 也算得出來：Hessian 有 $\ell \times \ell$ 個元素，光是寫出來就超過這個時間。

有學生追問這是否只跟會用二階導數的最佳化器有關（字幕裡最佳化器的名字聽不清楚）。講者的回答：

> "I think most of the optimizers these days that are really useful don't have to actually compute the Hessian vector product."（約 18:35）

所以這一節是讓你知道定理的威力，不是日常訓練必備。

## 鏈鎖律的另一種讀法（錄影 19:20–27:20）

反向傳播的核心是鏈鎖律，但要換一個角度讀它。

**設定。** 三個變數串成一條：

$$
z \in \mathbb{R}^m \;\xrightarrow{\;g\;}\; u = g(z) \in \mathbb{R}^n \;\xrightarrow{\;f\;}\; J = f(u) \in \mathbb{R}.
$$

$z$ 是輸入，$u$ 是中間變數，$J$ 是最後的純量。

**微積分課的鏈鎖律。** $J$ 要透過 $u_1,\dots,u_n$ 才會受到 $z_i$ 影響，所以把每一條路徑的貢獻加起來：

$$
\frac{\partial J}{\partial z_i} = \sum_{j=1}^{n} \frac{\partial J}{\partial u_j}\cdot\frac{\partial g_j}{\partial z_i}, \qquad i = 1,\dots,m.
$$

這裡 $g_j$ 是 $g$ 的第 $j$ 個輸出，也就是 $u_j$。（課堂上講者說到一半換了索引字母，字幕裡 $i$、$j$ 有些混用；上面是講義式 7.57 的寫法。）

**新的讀法。** 把這條式子看成一個計算問題：有人把 $\frac{\partial J}{\partial u}$ 這個 $n$ 維向量交給你，請你算出 $\frac{\partial J}{\partial z}$ 這個 $m$ 維向量。式子說每個 $\frac{\partial J}{\partial z_i}$ 都是 $\frac{\partial J}{\partial u_1},\dots,\frac{\partial J}{\partial u_n}$ 的線性組合，係數是 $\frac{\partial g_j}{\partial z_i}$。線性組合可以寫成矩陣乘向量：

$$
\frac{\partial J}{\partial z} =
\begin{pmatrix}
\dfrac{\partial g_1}{\partial z_1} & \cdots & \dfrac{\partial g_n}{\partial z_1}\\
\vdots & \ddots & \vdots\\
\dfrac{\partial g_1}{\partial z_m} & \cdots & \dfrac{\partial g_n}{\partial z_m}
\end{pmatrix}
\frac{\partial J}{\partial u}.
$$

這個矩陣是 $m \times n$ 的，第 $(i,j)$ 個元素是 $\frac{\partial g_j}{\partial z_i}$。一般定義的 Jacobian 把輸出放在列（row）、輸入放在行（column），是 $n \times m$，所以這裡是 **Jacobian 的轉置**。講者在這裡停下來說他得照講義抄，才不會把索引弄反。自己推的時候可以用維度檢查：左邊是 $m$ 維，右邊的向量是 $n$ 維，中間只能是 $m \times n$。

**這條式子需要什麼資訊。** 矩陣的元素是 $g$ 的偏導數在 $z$ 這一點的值，所以只需要知道函數 $g$ 與 $z$ 的值。$f$ 完全沒有出現。$f$ 可以是後面一百層的組合 $f_1, f_2, f_3, \dots$，只要有人把 $\frac{\partial J}{\partial u}$ 給你，$f$ 長什麼樣子就不必管了。講者用「Markovian」形容這件事：

> "You can forget about history, in some sense. And that's why it's efficient."（約 26:41）

**backward 函數。** 從 $\frac{\partial J}{\partial u}$ 到 $\frac{\partial J}{\partial z}$ 的這個映射，講者稱為模組 $g$ 的 backward 函數，$g$ 本身是 forward 函數。他說 PyTorch 裡每個模組都得實作 backward，就是這個東西：它只依賴 $g$ 與 $z$ 這些局部資訊，因此可以跟任何後續計算組合。講義替它取了記號

$$
\frac{\partial J}{\partial z} = \mathcal{B}[g, z]\!\left(\frac{\partial J}{\partial u}\right),
$$

$z$ 固定時 $\mathcal{B}[g,z]$ 是從 $\mathbb{R}^n$ 到 $\mathbb{R}^m$ 的線性映射（就是上面那個矩陣）。

## 把 backward 函數串起來（錄影 27:20–33:20）

現在考慮三個模組接成一串：

$$
x \;\xrightarrow{M_1}\; u_1 \;\xrightarrow{M_2}\; u_2 \;\xrightarrow{M_3}\; J .
$$

前向就是照順序算 $u_1, u_2, J$。反向從最靠近 $J$ 的地方開始：

1. **算 $\frac{\partial J}{\partial u_2}$。** 只隔一個模組 $M_3$，直接微分。
2. **算 $\frac{\partial J}{\partial u_1}$。** 把 $M_3$ 當成 $f$、$M_2$ 當成 $g$，$z = u_1$、$u = u_2$。套上一節的結果：$\frac{\partial J}{\partial u_1} = \mathcal{B}[M_2, u_1]\bigl(\frac{\partial J}{\partial u_2}\bigr)$。
3. **算 $\frac{\partial J}{\partial x}$。** 這次把 $M_2$ 與 $M_3$ 合起來當成 $f$，$M_1$ 當成 $g$。$f$ 變複雜了，但上一步已經把 $\frac{\partial J}{\partial u_1}$ 算好，所以只需要 $M_1$ 與 $x$：$\frac{\partial J}{\partial x} = \mathcal{B}[M_1, x]\bigl(\frac{\partial J}{\partial u_1}\bigr)$。

模組再多也是同樣的動作，從後往前一個一個套。模組也不必是同一種：可以是矩陣乘法、啟動函數、再一個矩陣乘法、LayerNorm，每一種有自己的 Jacobian，也就有自己的 backward 函數。把每一種模組的 backward 函數算出來，再照順序組合，就得到整個 backward pass。

這裡順便回答一個自學時常有的疑問：為什麼要從後面往前乘？（以下是本文的補充。）因為 $J$ 是純量，從 $J$ 這一端出發，手上拿的永遠是一個向量 $\frac{\partial J}{\partial u_k}$，每過一個模組只做一次矩陣乘向量。如果從輸入端往後推，手上拿的是「$u_k$ 對 $x$ 的 Jacobian」，那是一整個矩陣，每一步都是矩陣乘矩陣。定理要求輸出是純量，原因就在這裡。

## 我們要的其實是對參數的梯度（錄影 33:20–42:30）

講者自己點出剛才「偷懶」的地方：上面一路算到 $\frac{\partial J}{\partial x}$，但訓練時通常不在乎對輸入資料的梯度，要的是對參數的梯度。

處理方式是換一個角度看同一個模組。帶參數的模組 $u_1 = M_1(x;\theta_1)$ 有兩個輸入：$x$ 和 $\theta_1$。把 $x$ 當成固定值、把模組看成從 $\theta_1$ 到 $u_1$ 的函數，鏈鎖律那一節的推理完全不用改：

$$
\frac{\partial J}{\partial \theta_1} = \mathcal{B}[M_1, \theta_1]\!\left(\frac{\partial J}{\partial u_1}\right).
$$

講者的說法是，原始資料跟參數只是不同的張量，哪一個當變數由你決定。

於是真正的反向傳播有兩種計算。講者畫的網路是 $x \to \text{MM}_{\theta_1} \to u_1 \to \sigma \to u_2 \to \text{MM}_{\theta_2} \to u_3 \to \cdots \to u_k \to J$，其中 MM 是矩陣乘法模組，$u$ 是中間變數（activations），參數藏在 MM 裡面。

| 計算 | 內容 | 需要什麼 |
|---|---|---|
| 對中間變數 | $\frac{\partial J}{\partial u_k} \to \frac{\partial J}{\partial u_{k-1}} \to \cdots \to \frac{\partial J}{\partial u_1}$ | 上一步的結果、該模組、該模組的輸入 |
| 對參數 | 從 $\frac{\partial J}{\partial u_1}$ 分支算 $\frac{\partial J}{\partial \theta_1}$，從 $\frac{\partial J}{\partial u_3}$ 分支算 $\frac{\partial J}{\partial \theta_2}$ | 該模組輸出端的梯度、該模組的輸入 |

第一種計算本質上是循序的，每一步都要等上一步。第二種是從主幹分出去的支線：某一層輸出端的梯度一算好，那一層的參數梯度就可以算，不必等更前面的層。所以兩種計算可以交錯進行，支線也可以平行處理。越靠近損失的參數越早拿到梯度；第一層的參數要等主幹整條走完。（看影片時注意：講者在 40:11–41:17 口頭說的「first」「last」指的是哪一層，前後兩句對不起來；上面是照講義「$\frac{\partial J}{\partial\theta^{[i]}}$ 只依賴 $\frac{\partial J}{\partial u^{[i]}}$ 與 $u^{[i-1]}$」這條依賴關係整理的。）

講者接著談到系統面：某個中間量的下游都算完之後就可以從記憶體丟掉；哪個量依賴哪個量，決定了計算順序、何時釋放記憶體、何時跟其他 GPU 溝通。他的總結是這些最後都取決於計算圖的依賴關係。

## 矩陣乘法的 backward：對輸入（錄影 42:30–48:26）

到這裡都還是抽象的 $g$。接下來把 $g$ 換成具體模組。第一個是矩陣乘法：

$$
u = g(z) = Wz + b, \qquad z\in\mathbb{R}^m,\; W\in\mathbb{R}^{n\times m},\; b\in\mathbb{R}^n,\qquad J = f(u).
$$

**目標：** 已知 $\frac{\partial J}{\partial u}$，求 $\frac{\partial J}{\partial z}$。

依鏈鎖律那一節，要的矩陣第 $(i,j)$ 個元素是 $\frac{\partial (Wz+b)_j}{\partial z_i}$。先把第 $j$ 個輸出寫開，這只是矩陣乘法的定義：

$$
(Wz+b)_j = b_j + \sum_{k=1}^{m} W_{jk}\,z_k .
$$

對 $z_i$ 微分。$b_j$ 跟 $z_i$ 無關，導數是 0。總和裡 $k \neq i$ 的項跟 $z_i$ 無關，導數也是 0。只剩 $k = i$ 那一項 $W_{ji}z_i$，它是 $z_i$ 的線性函數，導數就是係數：

$$
\frac{\partial (Wz+b)_j}{\partial z_i} = W_{ji}.
$$

矩陣第 $(i,j)$ 個元素是 $W_{ji}$，這正是 $W^\top$ 的定義。所以

$$
\frac{\partial J}{\partial z} = W^\top\,\frac{\partial J}{\partial u}.
$$

> "So the backward function is just only a transpose. You just transpose your forward matrix and you multiply that, and that's it."（約 47:26）

維度也對得上：$W^\top$ 是 $m\times n$，乘上 $n$ 維向量得到 $m$ 維向量。

## 矩陣乘法的 backward：對權重（錄影 48:26–55:43）

同一個模組，這次把 $z$ 當固定、$W$ 當變數。目標是從 $\frac{\partial J}{\partial u}$ 算 $\frac{\partial J}{\partial W}$。

講者說這裡記號比較麻煩。變數 $W$ 是矩陣，要把「$u$ 對 $W$ 的 Jacobian」寫成緊湊的形式得動用張量記號（講義說那會是一個四階張量），所以他不用矩陣形式，直接對每個元素 $W_{ij}$ 用求和形式的鏈鎖律：

$$
\frac{\partial J}{\partial W_{ij}} = \sum_{k=1}^{n} \frac{\partial J}{\partial u_k}\cdot\frac{\partial (Wz+b)_k}{\partial W_{ij}} .
$$

把第 $k$ 個輸出寫開：

$$
(Wz+b)_k = \sum_{s=1}^{m} W_{ks}\,z_s + b_k .
$$

這個式子裡出現的權重是 $W_{k1},\dots,W_{km}$，也就是 $W$ 的第 $k$ 列。對 $W_{ij}$ 微分時：

- 如果 $k \neq i$，式子裡根本沒有 $W_{ij}$，導數是 0。
- 如果 $k = i$，只有 $s = j$ 那一項 $W_{ij}z_j$ 含有它，導數是係數 $z_j$。

所以對 $k$ 的總和只留下 $k=i$ 一項：

$$
\frac{\partial J}{\partial W_{ij}} = \frac{\partial J}{\partial u_i}\cdot z_j .
$$

**怎麼記。** 講者說他念博士時是這樣記的：把矩陣乘法畫成輸入節點 $z_1,\dots,z_m$ 連到輸出節點 $u_1,\dots,u_n$ 的圖，$W_{ij}$ 是連接 $z_j$ 與 $u_i$ 的那條邊上的權重。這條邊的梯度等於「輸出端 $u_i$ 的梯度」乘上「輸入端 $z_j$ 的值」。一條邊只需要它兩端的量。

他說生物學把這種形式叫 Hebbian rule：突觸的更新量等於一端的誤差乘上另一端的數值。（本文補一句：一般說的 Hebbian rule 是兩端神經元的活性相乘；這裡輸出端換成了梯度，兩者相同的地方是「一條邊的更新只看它兩端的局部量」。）

**矩陣形式與秩 1。** 把所有 $(i,j)$ 收成一個矩陣，第 $(i,j)$ 個元素是 $\frac{\partial J}{\partial u_i}\,z_j$，這是一個行向量（$n\times1$）乘一個列向量（$1\times m$）的外積：

$$
\frac{\partial J}{\partial W} = \frac{\partial J}{\partial u}\; z^\top \in \mathbb{R}^{n\times m}.
$$

外積的每一列都是 $z^\top$ 的倍數，所以這個矩陣的秩是 1（兩個向量裡有一個是零向量時，整個矩陣是 0）。

> "So the gradient for one example and for one weight matrix is always rank 1."（約 54:42）

講者補充兩點：這個事實被一些提升效率的方法拿來用；而它只對單筆樣本成立，實際訓練會對多筆樣本取平均，許多個秩 1 矩陣加起來就不再是秩 1。

**bias 的梯度。** 課堂提到還要算對 $b$ 的關係，但板書只推了 $W$。照講義式 7.70 補上：$(Wz+b)_j$ 對 $b_i$ 的導數在 $i=j$ 時是 1、其餘是 0，矩陣是單位矩陣，所以

$$
\frac{\partial J}{\partial b} = \frac{\partial J}{\partial u}.
$$

## 啟動函數的 backward（錄影 55:43–59:00）

第二種模組是逐元素的啟動函數（activation function）：$u = \sigma(z)$，意思是 $u_i = \sigma(z_i)$，$\sigma$ 是一個單變數函數，套在每個座標上，這裡輸入與輸出同為 $m$ 維。

一樣套鏈鎖律的矩陣，第 $(i,j)$ 個元素是 $\frac{\partial \sigma(z_j)}{\partial z_i}$。第 $j$ 個輸出只看第 $j$ 個輸入，所以 $i\neq j$ 時是 0，對角線上是 $\sigma'(z_i)$。整個矩陣是對角矩陣：

$$
\frac{\partial J}{\partial z} = \operatorname{diag}\bigl(\sigma'(z_1),\dots,\sigma'(z_m)\bigr)\,\frac{\partial J}{\partial u}.
$$

對角矩陣乘向量，結果的第 $i$ 個座標就是 $\sigma'(z_i)\cdot\frac{\partial J}{\partial u_i}$。所以不必真的建出矩陣，寫成逐元素乘積就好：

$$
\frac{\partial J}{\partial z} = \sigma'(z)\odot\frac{\partial J}{\partial u}.
$$

講者提醒 $\odot$ 跟內積不一樣：內積是逐元素相乘之後全部加起來，得到一個數；$\odot$ 不加，結果還是一個向量。

## 回頭核對成本，以及課末問答（錄影 59:00–1:02:07）

最後講者把三個 backward 函數的成本跟各自的前向比一遍，確認定理說的事在模組層級成立。下表用前面推導的維度（$W\in\mathbb{R}^{n\times m}$）：

| 模組與變數 | 前向 | backward 函數 | backward 成本 |
|---|---|---|---|
| 矩陣乘法，對 $z$ | $Wz+b$，$O(mn)$ | $W^\top v$ | $O(mn)$，轉置矩陣乘向量跟原矩陣乘向量一樣 |
| 矩陣乘法，對 $W$ | 同上 | $v\,z^\top$ | $O(mn)$，把 $mn$ 個元素填滿 |
| 啟動函數，對 $z$ | $\sigma(z)$，$O(m)$ | $\sigma'(z)\odot v$ | $O(m)$ |

其中 $v$ 代表傳進來的 $\frac{\partial J}{\partial u}$。每個模組的反向都跟前向同一個量級，整個網路加起來就是定理的結論。

課末有學生問到 sigmoid。講者說現在常用的啟動函數有好幾種，他一時記不全名稱（字幕在這裡也聽不清楚），重點是「一個可以快速微分的單變數函數」。他還提到現在也有人用 gating：做兩個矩陣乘法，再把兩個結果逐元素相乘，當成另一種非線性；細節與參考資料在講義裡。

## 完整例子：手算一個 2-2-1 網路

以下是本文自擬的例子，不是課堂內容。課堂只推了單一模組的 backward 函數，沒有把整個網路串起來算一次；串接的順序依講義 7.4.4 節的 Algorithm 3，損失用講義 7.4.3 節給的平方損失 $\ell_{\text{MSE}}(z,y)=\frac12(z-y)^2$，它的 backward 是乘上 $(z-y)$。啟動函數用 ReLU，$\sigma(t)=\max(t,0)$，$t>0$ 時導數是 1、$t<0$ 時是 0。

**網路與數字。**

$$
x=\begin{pmatrix}1\\2\end{pmatrix},\quad
W^{[1]}=\begin{pmatrix}1&-1\\2&1\end{pmatrix},\quad
b^{[1]}=\begin{pmatrix}0\\-1\end{pmatrix},\quad
W^{[2]}=\begin{pmatrix}3&2\end{pmatrix},\quad
b^{[2]}=1,\quad y=5.
$$

**前向。** 每個中間值都要留著，反向會用到。

$$
z^{[1]} = W^{[1]}x+b^{[1]} = \begin{pmatrix}1\cdot1+(-1)\cdot2+0\\ 2\cdot1+1\cdot2-1\end{pmatrix}=\begin{pmatrix}-1\\3\end{pmatrix},
\qquad
a^{[1]}=\sigma(z^{[1]})=\begin{pmatrix}0\\3\end{pmatrix},
$$

$$
z^{[2]} = W^{[2]}a^{[1]}+b^{[2]} = 3\cdot0+2\cdot3+1 = 7,
\qquad
J=\tfrac12(7-5)^2=2 .
$$

**反向。** 從 $J$ 往回走，每一步標出用的是哪條式子。

1. 損失模組：$\dfrac{\partial J}{\partial z^{[2]}} = z^{[2]}-y = 2$。
2. 第二層參數（支線，用 $vz^\top$ 與 bias 那條）：

$$
\frac{\partial J}{\partial W^{[2]}} = 2\cdot a^{[1]\top} = \begin{pmatrix}0&6\end{pmatrix},\qquad
\frac{\partial J}{\partial b^{[2]}} = 2 .
$$

3. 穿過第二層矩陣乘法（主幹，用 $W^\top v$）：

$$
\frac{\partial J}{\partial a^{[1]}} = W^{[2]\top}\cdot 2 = \begin{pmatrix}6\\4\end{pmatrix}.
$$

4. 穿過 ReLU（主幹，用 $\sigma'(z)\odot v$）。$z^{[1]}=(-1,3)$，所以 $\sigma'(z^{[1]})=(0,1)$：

$$
\frac{\partial J}{\partial z^{[1]}} = \begin{pmatrix}0\\1\end{pmatrix}\odot\begin{pmatrix}6\\4\end{pmatrix}=\begin{pmatrix}0\\4\end{pmatrix}.
$$

5. 第一層參數（支線）：

$$
\frac{\partial J}{\partial W^{[1]}} = \begin{pmatrix}0\\4\end{pmatrix}\begin{pmatrix}1&2\end{pmatrix}=\begin{pmatrix}0&0\\4&8\end{pmatrix},\qquad
\frac{\partial J}{\partial b^{[1]}}=\begin{pmatrix}0\\4\end{pmatrix}.
$$

訓練只需要到這裡。如果還想要對輸入的梯度，再用一次 $W^\top v$：$\frac{\partial J}{\partial x}=W^{[1]\top}(0,4)^\top=(8,4)^\top$。

**驗算。** 挑 $W^{[1]}_{22}$ 用差分檢查：把它從 1 改成 1.001，$z^{[1]}_2 = 2+2.002-1=3.002$，$z^{[2]}=2\cdot3.002+1=7.004$，$J=\frac12(2.004)^2=2.008008$。損失增加 0.008008，除以 0.001 得 8.008，跟反向傳播給的 8 相符（差的 0.008 是二階項）。我另外用 NumPy 對 $W^{[1]}$ 四個元素都做了差分，結果是 $(0,0;4,8)$。

**這些數字代表什麼。**

- $W^{[1]}$ 的第一列梯度全是 0。第一個隱藏單元的 $z^{[1]}_1=-1$ 被 ReLU 截成 0，往回傳的梯度在第 4 步被乘上 0。在這筆樣本上，不管怎麼微調第一列的權重，損失都不會變。
- $\frac{\partial J}{\partial W^{[2]}}$ 的第一個元素也是 0，原因不同：那條邊的輸入端 $a^{[1]}_1=0$。這正是「輸出端梯度乘輸入端數值」的規則，兩端任何一個是 0，那條邊就沒有梯度。
- $\frac{\partial J}{\partial W^{[1]}}$ 的兩列分別是 $(1,2)$ 的 0 倍與 4 倍，秩是 1，跟課堂說的一致。
- 用學習率 $\eta=0.01$ 把四組參數都照梯度更新一步，重新做前向得到 $z^{[2]}=6.3344$、$J\approx0.890$，損失從 2 降到 0.89。
- 成本：前向做了兩次矩陣乘向量、一次 ReLU、一次損失；反向做了一次轉置矩陣乘向量（要 $\partial J/\partial x$ 的話是兩次）、兩次外積、一次逐元素乘。兩邊是同一個量級。

## 自我檢查

**1.** $g:\mathbb{R}^3\to\mathbb{R}^2$，$J=f(g(z))$。backward 函數裡那個矩陣是幾乘幾？第 $(3,1)$ 個元素是什麼？

答：$3\times2$。它把 2 維的 $\frac{\partial J}{\partial u}$ 變成 3 維的 $\frac{\partial J}{\partial z}$。第 $(3,1)$ 個元素是 $\frac{\partial g_1}{\partial z_3}$，列對應輸入、行對應輸出，跟一般的 Jacobian 相反。

**2.** $W=\begin{pmatrix}1&2&0\\-1&0&3\end{pmatrix}$，$z=(1,1,1)^\top$，已知 $\frac{\partial J}{\partial u}=(2,1)^\top$，其中 $u=Wz+b$。求 $\frac{\partial J}{\partial z}$、$\frac{\partial J}{\partial W}$、$\frac{\partial J}{\partial b}$。

答：$\frac{\partial J}{\partial z}=W^\top(2,1)^\top=(2-1,\;4+0,\;0+3)^\top=(1,4,3)^\top$。$\frac{\partial J}{\partial W}=(2,1)^\top(1,1,1)=\begin{pmatrix}2&2&2\\1&1&1\end{pmatrix}$。$\frac{\partial J}{\partial b}=(2,1)^\top$。注意算 $\frac{\partial J}{\partial z}$ 完全沒用到 $z$ 的值，算 $\frac{\partial J}{\partial W}$ 完全沒用到 $W$ 的值。

**3.** 把上面例子的 $b^{[1]}$ 改成 $(2,-1)^\top$，其餘不變，重算所有梯度。

答：$z^{[1]}=(1,3)$，$a^{[1]}=(1,3)$，$z^{[2]}=3+6+1=10$，$J=12.5$。$\frac{\partial J}{\partial z^{[2]}}=5$；$\frac{\partial J}{\partial W^{[2]}}=(5,15)$，$\frac{\partial J}{\partial b^{[2]}}=5$；$\frac{\partial J}{\partial a^{[1]}}=(15,10)$；兩個 ReLU 都開著，$\frac{\partial J}{\partial z^{[1]}}=(15,10)$；$\frac{\partial J}{\partial W^{[1]}}=\begin{pmatrix}15&30\\10&20\end{pmatrix}$，$\frac{\partial J}{\partial b^{[1]}}=(15,10)$。第一列不再是 0，但矩陣仍是秩 1。

**4.** 前向算出的中間值，反向時哪些一定要留著？以 MLP 為例逐一說明。

判準：要能說出每個 backward 函數各自需要什麼。矩陣乘法對輸入的 backward 需要 $W$（參數本來就在）；對權重的 backward 需要該層的輸入 $z$（MLP 裡是前一層的 $a$）；啟動函數的 backward 需要它自己的輸入 $z$ 來算 $\sigma'(z)$。所以每一層的 $z^{[k]}$ 與 $a^{[k]}$ 都要存到該層的反向做完為止，這是訓練比推論吃記憶體的原因之一。

**5.** Hessian-vector product 可以在 $O(N)$ 算出來，為什麼完整的 Hessian 不行？

判準：要提到輸出大小。$\nabla^2 f(x)\,v$ 是 $\ell$ 維向量，而且它是純量函數 $g(x)=\langle\nabla f(x),v\rangle$ 的梯度，可以套定理。完整 Hessian 有 $\ell^2$ 個元素，光寫出來就要 $\ell^2$ 的時間；要用這個技巧湊出整個 Hessian，得對 $\ell$ 個基底向量各做一次，每次 $O(N+\ell)$，總共 $O((N+\ell)\,\ell)$；在 $N\ge\ell$ 的常見情況就是 $O(N\ell)$，等於 $\ell$ 次前向。

## 對應閱讀

主講義第 7 章 7.4 節 Backpropagation，約第 99–111 頁：

- 定理與兩個推論：7.4 節開頭（Theorem 7.4.1）
- 鏈鎖律與 $\mathcal{B}[g,z]$ 記號：7.4.1 節，式 7.56–7.63
- 串接模組、對中間變數與對參數兩種計算：7.4.2 節，式 (B1)、(B2) 與圖 7.5
- 矩陣乘法與啟動函數的 backward 函數：7.4.3 節，式 7.66–7.73

課堂與講義的差異：

- **課堂沒講到的。** 損失函數的 backward（平方損失、logistic loss、cross-entropy，式 7.74–7.75）、7.4.4 節把所有模組串成 MLP 完整演算法的 Algorithm 3，以及 bias 梯度的推導，課堂都沒有上板。本文的手算例子用到這三塊，是依講義補的。7.5 節的跨樣本向量化這堂也沒有講。
- **課堂多講的。** Hebbian rule 的記法、單筆樣本的權重梯度是秩 1、平行計算與記憶體釋放的系統觀點、meta learning 與 test-time training 的用途、課末關於啟動函數與 gating 的問答，講義 7.4 節沒有或只帶過。
- **細節不同。** Hessian-vector product 的成本，課堂說 $O(N)$，講義寫 $O(N+\ell)$。講義還有一個註腳說明輸出不依賴的輸入座標梯度預設為 0，所以 $N\le\ell$ 時定理仍成立。
- **granularity。** 講義 Remark 7.4.3 說明定理的嚴格證明是把網路拆到最小的加法、乘法層級；實作上用矩陣乘法這種較大的模組比較方便，成本結論不變。課堂最後的成本核對對應這段。

**系列導覽**：上一堂 [第 7 堂：神經網路的架構](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture)｜下一堂 [第 9 堂：k-means 與高斯混合模型](/posts/ai/2026-10-12-stanford-cs229-lecture-09-k-means-gmm)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 8: Neural Networks 2 (Backprop)](https://www.youtube.com/watch?v=ne2ngVAoMG8)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：整份英文字幕（約 62 分鐘）讀完，各節時間區段與引句都出自字幕。沒有看板書畫面，板書上的公式依主講義 7.4 節還原；字幕中索引字母混用或聽不清楚的地方（鏈鎖律的 $i$、$j$，以及問答裡的最佳化器與啟動函數名稱）以講義為準或略過不寫。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 8: Neural Networks 2 (Backprop)](https://www.youtube.com/watch?v=ne2ngVAoMG8)：本文的主要底本，課堂順序、講者說法與引句都來自這支錄影的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 7 章 7.4 節，用來補回板書公式、$\mathcal{B}[g,z]$ 記號、bias 與損失函數的 backward，以及手算例子依循的 Algorithm 3。
- [CS229 課程官網](https://cs229.stanford.edu/)：課程與講義入口。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：系列入口與各堂位置。
- [第 7 堂：神經網路的架構](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture)：本堂沿用的模組記號（MM、$\sigma$、LayerNorm）出處。
