---
title: "高斯判別分析與 Naive Bayes：先學每一類長什麼樣，再用貝氏定理分類｜Stanford CS229 第 5 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, generative-models, gaussian-discriminant-analysis, naive-bayes]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 5
tldr: "第 5 堂把分類問題反過來做：不直接學 p(y|x)，改學 p(x|y) 與 p(y)。GDA 假設兩類是共用共變異數的高斯，最大概似估計只要數比例、取平均，決策邊界推出來是一條直線，事後機率剛好是 sigmoid；Naive Bayes 用條件獨立把 2^d 個參數壓到 2d+1 個。"
description: "Stanford CS229 Spring 2026 第 5 堂導讀：生成式與判別式學習、多變數高斯、GDA 的最大概似估計與線性決策邊界推導、QDA、GDA 與邏輯斯迴歸的關係、Naive Bayes 與 Laplace 平滑，附完整數值例子。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-05-gaussian-discriminant-analysis-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 5 堂錄影的英文字幕寫成，公式記號對照 2026 主講義第 4 章〈Generative learning algorithms〉；我沒有看到板書與投影片畫面，講者指著畫面說的內容只寫前後文還原得出來的部分。

這是 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)的第 5 堂，講者是 Chris Ré。前四堂的線性迴歸、邏輯斯迴歸到[上一堂的指數族與 GLM](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm)，全都在學同一種東西：給定 $x$，$y$ 的條件分布 $p(y\mid x)$。這一堂第一次換方向，先替每個類別的資料建模，再回頭分類。先備是貝氏定理、最大概似估計，以及矩陣的轉置、反矩陣、特徵值。讀完之後，你應該能拿一小組二維資料手算出 GDA 的四組參數，寫出決策邊界的方程式，並說明它和邏輯斯迴歸為什麼長得一樣、又差在哪裡。

```youtube
url: https://www.youtube.com/watch?v=zRdE8A4UZes
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 5: Gaussian Discriminant Analysis
captions: en
```

## 判別式與生成式：兩種分辨貓和大象的方法

（錄影 00:05–09:30）

課堂的例子是用身高、體重兩個特徵分辨貓（$y=0$）和大象（$y=1$）。講者自己也說這組資料完全是虛構的，畫出來的是很重的貓和很輕的大象。

到目前為止學過的演算法都是**判別式**（discriminative）：直接對 $p(y\mid x)$ 建模，效果等於在特徵空間裡找一條分界線。這樣做的好處是省力。右上角的大象有哪些奇怪的子群、左下角的貓又怎麼分布，模型都不用管，只要處理兩類靠得近的地方。講者的說法是（06:11）：

> If you have two classes that are difficult to distinguish, you're devoting all your horsepower right to that decision boundary.

**生成式**（generative）走另一條路，分三步：

1. 只看貓，學一個「貓的特徵長什麼樣」的分布 $p(x\mid y=0)$。
2. 只看大象，學 $p(x\mid y=1)$。
3. 再學每個類別本身有多常見，也就是事前機率 $p(y)$。

來了一隻新動物 $x$，就比較牠在兩個模型下各有多可能，用貝氏定理換回 $p(y\mid x)$：

$$
p(y\mid x)=\frac{p(x\mid y)\,p(y)}{p(x)},\qquad p(x)=p(x\mid y=1)p(y=1)+p(x\mid y=0)p(y=0)
$$

如果只是要挑出機率最大的類別，分母 $p(x)$ 對兩個類別都一樣，可以直接丟掉：

$$
\hat y=\arg\max_y\; p(x\mid y)\,p(y)
$$

這裡容易丟錯東西。講者在 46:05 發現投影片把「不依賴 $y$ 所以可以消掉」的項標錯了，當場更正：消掉的是 $p(x)$，$p(y)$ 不能消，因為貓比較多的時候，你本來就該比較傾向猜貓。

講者開場也交代了為什麼要學這個看起來繞遠路的方法。他說六、七年前教這一堂的時候，學生對生成式模型興趣不高，因為它們拿不到最好的成績；現在 GPT 的 G 就是 generative，這條路反而撐起了 AI 近年大部分的成長。這一堂的 GDA 是生成式模型裡最簡單、但還有用的一個。

## 從一維高斯到多變數高斯

（錄影 09:30–23:40）

GDA 要用高斯分布描述每一類的特徵，所以先繞一段路複習高斯。

### 一維

$z\sim\mathcal N(\mu,\sigma^2)$ 的密度是

$$
p(z)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\!\left(-\frac{(z-\mu)^2}{2\sigma^2}\right)
$$

$\mu$ 決定中心，$\sigma$ 決定寬度。投影片畫了 $\sigma=0.5,1,2$ 三條曲線，$\sigma$ 越小越尖。學生答出了為什麼三條的高度不同：密度的積分必須是 1，面積固定，寬度窄了高度就得變高。

只看體重一個特徵時，生成式分類已經可以做：貓的平均體重低、大象的高，各配一條鐘形曲線。新動物的體重落在哪條曲線下比較高，就比較像哪一類。

### 多維

特徵有 $d$ 個時，$x\in\mathbb R^d$，$x\sim\mathcal N(\mu,\Sigma)$ 的密度是

$$
p(x;\mu,\Sigma)=\frac{1}{(2\pi)^{d/2}\,|\Sigma|^{1/2}}\exp\!\left(-\frac12(x-\mu)^\top\Sigma^{-1}(x-\mu)\right)
$$

$\mu\in\mathbb R^d$ 是平均向量，也就是分布的中心。$\Sigma\in\mathbb R^{d\times d}$ 是共變異數矩陣，它必須**對稱**而且**正定**。課堂花了幾分鐘讓學生講出正定的幾種等價說法：

- 對任何非零向量 $z$，$z^\top\Sigma z>0$（把 $>$ 放寬成 $\ge$ 的版本叫半正定）。
- 所有特徵值都是正的。對稱矩陣保證特徵值分解存在，這兩個性質合起來才讓後面的操作行得通。
- 幾何上，等高線的橢圓在每個方向都有厚度，沒有哪個方向的變異數是 0。這是一維裡「變異數為正」的對應版本。

正定在公式裡用在兩個地方。$|\Sigma|$ 是行列式，等於所有特徵值的乘積；特徵值全為正，乘積才是正的，才能開根號。$\Sigma^{-1}$ 要存在，也需要沒有任何特徵值是 0。講者的總結是：有 0 會讓兩個地方同時壞掉。

指數裡的 $(x-\mu)^\top\Sigma^{-1}(x-\mu)$ 可以當成一種距離的平方：它量 $x$ 離中心多遠，但每個方向用該方向的變異程度去縮放。講者說這個量有名字但不必記；它一般叫 Mahalanobis 距離（名稱是本文補的）。

### Σ 怎麼決定形狀

一維高斯只能變胖或變瘦，二維以上自由度多很多。課堂用等高線圖說明，每一圈等高線上的密度值相同：

- $\Sigma=I$：等高線是正圓，各維度獨立。這是標準高斯。
- $\Sigma$ 是對角矩陣：橢圓的軸對齊座標軸，每個方向的伸縮程度由對角元素決定。課堂舉了對角線為 3 和 0.5 的例子。
- $\Sigma$ 有非零的非對角元素：橢圓被旋轉。二維時，非對角元素為正代表兩個特徵正相關，橢圓往右上傾斜；為負則往右下。
- 改 $\mu$ 只會平移，形狀不變。

講者特別提醒一個常見的混淆（20:29）：

> Entries can be negative, but the eigenvalues are positive. Positive eigenvalues do not mean that all the entries are positive.

對角線上的元素是各特徵自己的變異數，所以一定非負；非對角元素則可以是負的。

講者還岔出去講了一件「不會考」的事：反矩陣 $\Sigma^{-1}$ 裡的 0 帶有獨立性的資訊，這個結構是圖模型（graphical models）的基礎，他提到相關定理的名字（一般寫作 Hammersley–Clifford）。課堂的說法比較口語，只說「兩個變數獨立」。精確一點的版本是本文補充的：對高斯分布，$\Sigma^{-1}$ 的第 $(i,j)$ 個元素為 0，等價於 $x_i$ 與 $x_j$ 在給定其他所有變數之後條件獨立；$\Sigma$ 本身的元素為 0 則對應不看其他變數時的獨立。

## GDA 的模型：兩個平均，一個共用的共變異數

（錄影 23:40–34:45）

訓練資料是 $\{(x^{(i)},y^{(i)})\}_{i=1}^n$，$x^{(i)}\in\mathbb R^d$，$y^{(i)}\in\{0,1\}$。GDA 假設資料是這樣產生的：

$$
y\sim\mathrm{Bernoulli}(\phi),\qquad x\mid y=0\sim\mathcal N(\mu_0,\Sigma),\qquad x\mid y=1\sim\mathcal N(\mu_1,\Sigma)
$$

先擲一枚不公平的硬幣決定這隻是貓還是大象（大象的機率是 $\phi$），再從對應類別的高斯抽出特徵。寫成密度：

$$
p(y)=\phi^{y}(1-\phi)^{1-y},\qquad
p(x\mid y=k)=\frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}}\exp\!\left(-\frac12(x-\mu_k)^\top\Sigma^{-1}(x-\mu_k)\right)
$$

要學的參數有四組：$\phi$、$\mu_0$、$\mu_1$、$\Sigma$。兩個類別只有平均不同，$\Sigma$ 是共用的，所以兩組等高線的形狀與方向完全一樣，像是把同一組橢圓複製貼上到兩個中心。

有學生馬上質疑：大象的變異明明跟貓不一樣，這個假設不合理吧？講者同意，然後說這是建模的選擇（27:35）：

> But it's a modeling choice. You may decide it's not worth it.

理由是共變異數矩陣很貴。對稱的 $d\times d$ 矩陣有 $d(d+1)/2$ 個自由參數，$d$ 一大就是 $d^2$ 的量級；每個類別各估一個，參數再多一倍。算一下總數（本文的計算）：邏輯斯迴歸有 $d+1$ 個參數，GDA 有 $1+2d+d(d+1)/2$ 個。$d=2$ 時是 3 對 8，$d=100$ 時是 101 對 5,251。

另一個學生問：事前機率 $\phi$ 是從訓練資料估的，這是不是假設測試時的類別比例跟訓練時一樣？講者說是。假如訓練集有一百萬隻貓和一隻大象，模型會學到「邊界附近的都猜貓」；測試時兩類若各半，它就會把很多小象判成貓。他對這類假設的態度是（29:36）：

> But again, remember, they're not true or false. They're like, how bad are they?

他順勢點出兩個每次都該問的問題：我假設訓練與測試之間有什麼東西不變？我用了多大容量的模型、為什麼？

## 最大概似估計：數比例、取平均就學完了

（錄影 34:45–45:10）

### 寫出概似函數

判別式模型最大化的是 $\prod_i p(y^{(i)}\mid x^{(i)})$。生成式模型對整個世界建模，最大化的是**聯合**概似：

$$
L(\phi,\mu_0,\mu_1,\Sigma)=\prod_{i=1}^n p(x^{(i)},y^{(i)})=\prod_{i=1}^n p(x^{(i)}\mid y^{(i)})\,p(y^{(i)})
$$

第一個等號能寫成連乘，用的是資料獨立同分布（IID）的假設。第二個等號只是機率的乘法規則，永遠成立，不需要額外假設。取對數把連乘變連加：

$$
\ell=\sum_{i=1}^n\log p(x^{(i)}\mid y^{(i)};\mu_0,\mu_1,\Sigma)+\sum_{i=1}^n\log p(y^{(i)};\phi)
$$

兩個求和各管各的參數：$\phi$ 只出現在第二項，$\mu_0,\mu_1,\Sigma$ 只出現在第一項。這個可分離的結構讓每組參數都能單獨對 $\ell$ 微分、設為 0、直接解出來，不需要梯度下降。講者說這不是高斯模型的通則，但 GDA 剛好有這個性質，過去大家用生成式模型，常常就是看上它算起來便宜。

### 四個答案

$$
\phi=\frac1n\sum_{i=1}^n 1\{y^{(i)}=1\},\qquad
\mu_k=\frac{\sum_{i=1}^n 1\{y^{(i)}=k\}\,x^{(i)}}{\sum_{i=1}^n 1\{y^{(i)}=k\}}\quad(k=0,1)
$$

$$
\Sigma=\frac1n\sum_{i=1}^n\bigl(x^{(i)}-\mu_{y^{(i)}}\bigr)\bigl(x^{(i)}-\mu_{y^{(i)}}\bigr)^\top
$$

$1\{\cdot\}$ 是指示函數，條件成立時為 1、否則為 0。翻成白話：$\phi$ 是大象佔的比例；$\mu_0$ 是所有貓的特徵平均，$\mu_1$ 是所有大象的平均；$\Sigma$ 是每筆資料減掉**自己那一類**的平均之後，把外積全部加起來除以 $n$。兩類的資料合在一起估同一個 $\Sigma$，這就是「pooling」。講者對 $\mu_k$ 那條式子的評語是（37:51）：

> This is a most obfuscated way you've ever seen to compute the average.

### 走一遍 μ₁ 的推導

課堂只推了 $\mu_1$，並說明用意：答案雖然猜得到，但「寫出概似、微分、設為 0、解方程」這套流程在之後更複雜的模型會一用再用，作業也會要你做。

$\ell$ 裡跟 $\mu_1$ 有關的只有 $y^{(i)}=1$ 那些資料的高斯指數項（歸一化常數和 $\phi$ 那項對 $\mu_1$ 微分都是 0）：

$$
\ell(\mu_1)=\sum_{i=1}^n 1\{y^{(i)}=1\}\left(-\frac12\bigl(x^{(i)}-\mu_1\bigr)^\top\Sigma^{-1}\bigl(x^{(i)}-\mu_1\bigr)\right)+\text{與 }\mu_1\text{ 無關的項}
$$

對 $\mu_1$ 取梯度需要一條公式：$A$ 對稱時，$\nabla_u(u^\top Au)=2Au$。令 $u=x^{(i)}-\mu_1$，$u$ 對 $\mu_1$ 的微分帶出一個負號，和前面的 $-\tfrac12$ 相乘後剛好把 2 和負號都消掉：

$$
\nabla_{\mu_1}\ell=\sum_{i=1}^n 1\{y^{(i)}=1\}\,\Sigma^{-1}\bigl(x^{(i)}-\mu_1\bigr)=\Sigma^{-1}\sum_{i=1}^n 1\{y^{(i)}=1\}\bigl(x^{(i)}-\mu_1\bigr)=0
$$

$\Sigma^{-1}$ 不依賴 $i$，所以能提到求和外面。接下來是課堂強調的一步：$\Sigma^{-1}$ 可逆，而一個可逆矩陣乘上某個向量等於 0，那個向量只能是 0。於是

$$
\sum_{i=1}^n 1\{y^{(i)}=1\}\,x^{(i)}=\mu_1\sum_{i=1}^n 1\{y^{(i)}=1\}
$$

兩邊除以大象的隻數就得到 $\mu_1$ 的公式。講者反問：如果 $\Sigma$ 不可逆會怎樣？學生答對了：括號裡的向量可以落在零空間裡而不必是 0，$\mu_1$ 就會有一整個方向定不下來。這呼應了前面為什麼要求 $\Sigma$ 正定。

### 另外三個參數（課堂沒推，本文補上）

$\phi$：第二項是 $\sum_i\bigl[y^{(i)}\log\phi+(1-y^{(i)})\log(1-\phi)\bigr]$。令 $n_1=\sum_i y^{(i)}$，對 $\phi$ 微分得 $n_1/\phi-(n-n_1)/(1-\phi)=0$，解出 $\phi=n_1/n$。

$\mu_0$：把上面推導裡的 1 全換成 0 即可。

$\Sigma$：改對 $S=\Sigma^{-1}$ 微分比較乾淨。令 $a_i=x^{(i)}-\mu_{y^{(i)}}$，跟 $S$ 有關的部分是 $\frac n2\log|S|-\frac12\sum_i a_i^\top S a_i$（用到 $|\Sigma|^{-1/2}=|S|^{1/2}$）。套兩條矩陣微分公式 $\nabla_S\log|S|=S^{-1}$（$S$ 對稱）與 $\nabla_S(a^\top Sa)=aa^\top$，得到 $\frac n2\Sigma-\frac12\sum_i a_ia_i^\top=0$，也就是上面的公式。

### 沒有梯度下降，還算是學習嗎

有學生問了這個問題，講者說這是他最喜歡的問題之一（40:58）：

> The fact that we can solve it in one step doesn't negate its ability to learn.

他的定義是：學習是從資料推出能用來預測未來的東西。這裡的每個參數都能用梯度下降解出來，只是比直接代公式慢得多。模型再複雜一點，就沒有一步到位的解法了。

## 手算一次：六筆資料的 GDA

以下是本文自擬的例子，不是課堂內容，數字已用程式另算一遍。

四隻貓（$y=0$）：$(1,2),(2,1),(2,3),(3,2)$。兩隻大象（$y=1$）：$(5,5),(7,7)$。

**事前機率與平均**：$\phi=2/6=1/3$，$\mu_0=(2,2)$，$\mu_1=(6,6)$。

**共變異數**：貓減掉 $\mu_0$ 後是 $(-1,0),(0,-1),(0,1),(1,0)$，外積加總為 $\begin{pmatrix}2&0\\0&2\end{pmatrix}$。大象減掉 $\mu_1$ 後是 $(-1,-1),(1,1)$，外積加總為 $\begin{pmatrix}2&2\\2&2\end{pmatrix}$。合起來除以 6：

$$
\Sigma=\frac16\begin{pmatrix}4&2\\2&4\end{pmatrix}=\begin{pmatrix}2/3&1/3\\1/3&2/3\end{pmatrix},\qquad|\Sigma|=\frac13,\qquad\Sigma^{-1}=\begin{pmatrix}2&-1\\-1&2\end{pmatrix}
$$

$\Sigma$ 的特徵值是 $1/3$ 和 $1$，都是正的，所以正定。注意貓那一類自己看是圓的、大象自己看是一條斜線，共用的 $\Sigma$ 是兩者折衷出來的一個斜橢圓。

**分類一隻新動物** $x=(4.5,4)$。先算牠到兩個中心的加權距離平方：

- 到貓：$x-\mu_0=(2.5,2)$，$\Sigma^{-1}(x-\mu_0)=(3,1.5)$，內積為 $2.5\times3+2\times1.5=10.5$。
- 到大象：$x-\mu_1=(-1.5,-2)$，$\Sigma^{-1}(x-\mu_1)=(-1,-2.5)$，內積為 $1.5+5=6.5$。

兩個高斯的歸一化常數相同，所以比較 $\log\bigl[p(x\mid y)p(y)\bigr]$ 只需要看 $-\tfrac12\times$距離平方 $+\log$ 事前機率：

$$
\log\frac{p(x\mid y=1)\,\phi}{p(x\mid y=0)\,(1-\phi)}=-\frac{6.5}{2}+\frac{10.5}{2}+\log\frac{1/3}{2/3}=2-0.693=1.307
$$

換回機率：$p(y=1\mid x)=1/(1+e^{-1.307})\approx0.787$。模型判定牠是大象。

**這個結果代表什麼**：從距離來看，這隻動物離大象近得多，光看概似，大象的可能性是貓的 $e^{2}\approx7.4$ 倍。但訓練資料裡貓是大象的兩倍，事前機率把這個比值打了對折，剩 $3.7$ 倍，換算就是 $0.787$。把 $x$ 換成兩個中心的正中間 $(4,4)$，到兩邊的距離平方都是 8，概似打平，事後機率就退回事前機率 $1/3$，模型猜貓。

## 決策邊界為什麼是一條直線

（錄影 45:10–57:45）

決策邊界是兩類分數打平的地方。課堂這段推得很快，講者自己也道歉說跳太多步；下面依主講義的記號把每一步寫出來。

令兩邊相等並取對數（共用的歸一化常數直接消掉）：

$$
-\frac12(x-\mu_1)^\top\Sigma^{-1}(x-\mu_1)+\log\phi=-\frac12(x-\mu_0)^\top\Sigma^{-1}(x-\mu_0)+\log(1-\phi)
$$

展開二次式。課堂在學生要求下寫了這一步：

$$
(x-\mu_1)^\top\Sigma^{-1}(x-\mu_1)=x^\top\Sigma^{-1}x-\mu_1^\top\Sigma^{-1}x-x^\top\Sigma^{-1}\mu_1+\mu_1^\top\Sigma^{-1}\mu_1
$$

中間兩項都是純量，而且因為 $\Sigma^{-1}$ 對稱，兩者相等，合併成 $-2\mu_1^\top\Sigma^{-1}x$，乘上前面的 $\tfrac12$ 後係數剛好是 1。最後一項不含 $x$，是常數。

關鍵在第一項 $x^\top\Sigma^{-1}x$：它是 $x$ 的二次項，但**等號兩邊各有一個，而且因為 $\Sigma$ 共用，兩個一模一樣**，直接消掉。剩下的整理一下：

$$
(\mu_1-\mu_0)^\top\Sigma^{-1}x=\frac12\bigl(\mu_1^\top\Sigma^{-1}\mu_1-\mu_0^\top\Sigma^{-1}\mu_0\bigr)-\log\frac{\phi}{1-\phi}
$$

左邊是一個固定向量和 $x$ 的內積，右邊是常數，這就是超平面的方程式。所以共用 $\Sigma$ 的 GDA，決策邊界必然是線性的。右邊的 $\log\frac{\phi}{1-\phi}$ 是事前機率的對數勝算（log odds）：它只移動邊界的位置，不改變方向。

代入上一節的數字：$\Sigma^{-1}(\mu_1-\mu_0)=(4,4)$，$\mu_1^\top\Sigma^{-1}\mu_1=72$，$\mu_0^\top\Sigma^{-1}\mu_0=8$，邊界是 $4x_1+4x_2=32+0.693$，也就是 $x_1+x_2\approx8.17$。兩個中心的中點落在 $x_1+x_2=8$；貓比較多，邊界就往大象那邊推了一點，中點被劃進貓的地盤，和上一節算的一致。

### 不共用 Σ：QDA

有學生問：如果兩類各有自己的共變異數矩陣，這套方法還能用嗎？可以。$x^\top\Sigma_1^{-1}x$ 和 $x^\top\Sigma_0^{-1}x$ 不再相等，二次項消不掉，邊界變成二次曲線，這個模型叫 QDA（quadratic discriminant analysis）。估計方式幾乎不變：平均照舊，共變異數改成每一類用自己的資料各算一個。講者說這一段和對應的圖是他自己加的，講義裡沒有，因為每次教都有人問。

另一位學生注意到 QDA 的圖上，遠離所有資料的地方突然冒出一塊判成另一類的區域，覺得沒道理。講者說線性模型也有同樣的問題，只是不顯眼：離資料很遠的地方，線性邊界一樣在沒有證據的情況下繼續延伸。離開資料之後，什麼模型都可能出怪事。

## GDA 與邏輯斯迴歸

（錄影 57:45–1:05:45）

### 事後機率是 sigmoid

課堂說這段代數「可以做，也許是作業題」就跳過了；主講義 4.1.3 節也只給結論。其實前面的推導已經做完大半，這裡補齊。

對貝氏定理的式子上下同除以分子：

$$
p(y=1\mid x)=\frac{p(x\mid y=1)\phi}{p(x\mid y=1)\phi+p(x\mid y=0)(1-\phi)}=\frac{1}{1+\exp(-a)},\qquad a=\log\frac{p(x\mid y=1)\,\phi}{p(x\mid y=0)\,(1-\phi)}
$$

$a$ 正是上一節「左邊減右邊」的量，已經算過是 $x$ 的一次函數：

$$
a=\theta^\top x+\theta_0,\qquad\theta=\Sigma^{-1}(\mu_1-\mu_0),\qquad\theta_0=-\frac12\mu_1^\top\Sigma^{-1}\mu_1+\frac12\mu_0^\top\Sigma^{-1}\mu_0+\log\frac{\phi}{1-\phi}
$$

所以 $p(y=1\mid x)=1/(1+e^{-(\theta^\top x+\theta_0)})$，和邏輯斯迴歸的函數形式完全相同。數值例子裡 $\theta=(4,4)$、$\theta_0\approx-32.69$，代 $x=(4.5,4)$ 得 $a=1.307$，和直接用貝氏定理算的一樣。

講者提醒這句話該怎麼讀：邊界是直線這件事不稀奇，前面已經推過了；真正的內容是**兩邊的機率值也對得上**，不只是邊界的位置。

### 方向只有一邊

從 GDA 的假設可以推出邏輯斯形式，反過來不行。講者說不只高斯，許多指數族分布（他提到 Poisson）加上共用參數，推出來的事後機率也都是邏輯斯形式；主講義舉的例子是 $x\mid y=0\sim\mathrm{Poisson}(\lambda_0)$、$x\mid y=1\sim\mathrm{Poisson}(\lambda_1)$。這跟上一堂的 GLM 是同一件事：指數族的對數勝算是參數的線性函數。也就是說，邏輯斯迴歸只假設「對數勝算是 $x$ 的線性函數」，很多種資料產生方式都滿足它（1:03:36）：

> Logistic regression does not mean it's GDA. They are not equivalent models. GDA is making more assumptions.

傳統教科書的結論，也是主講義的結論：GDA 假設強，假設成立時用比較少的資料就能學好，假設不成立時就不可靠；邏輯斯迴歸假設弱，需要多一點資料，但比較耐得住模型設錯。所以實務上邏輯斯迴歸用得比較多。

### 講者不完全同意這個結論

講者說上面那段是「我應該告訴你們的」，但有點誤導。十年前坐在這間教室的人會得到「只要會邏輯斯迴歸就好」的印象，而過去十年的進展恰恰來自另一邊：替資料本身建模。他舉的例子是擴散模型（從高斯雜訊一步步去雜訊還原出影像）、大型語言模型（在大量未標註文字上預測下一個 token）和 GAN。這些模型的機率框架和 GDA 相同，都是先描述資料怎麼產生，再拿這個模型去用，GDA 是其中最簡單的一個。

問答時段（1:05:45–1:13:55）延伸了這個話題。有學生問生成式模型能不能拿來當判別器用，講者提到 BERT 這類預訓練模型的用法：先用生成式的方式訓練出好的表徵，再在上面接一個分類器，之後課程講微調時會回來談。這一段不需要為了 GDA 而記，但它說明了為什麼一門 2026 年的課還從這個「最後只得到一條直線」的模型教起。

## Naive Bayes：特徵是離散的時候

（錄影 1:13:55–1:21:25）

GDA 處理連續特徵。特徵是離散的時候，例如判斷一封信是不是垃圾郵件，課堂最後用七分鐘介紹了 Naive Bayes（單純貝氏）。做法還是那三件事：對 $p(x\mid y)$ 建模、對 $p(y)$ 建模、用貝氏定理分類。

### 特徵與參數爆炸

先從訓練語料挑出 $d$ 個詞當字典。講者說要挑有資訊量的詞，the、a、and 這類到處出現的停用詞（stop words）沒有訊號，通常不放。每封信表示成 $x\in\{0,1\}^d$，第 $j$ 個詞有出現就是 1。課堂的例子用五個詞：buy、free、meeting、229、homework。

問題是 $x$ 有 $2^d$ 種可能的取值。如果直接替每一種取值各設一個機率，$d=10{,}000$ 時就要 $2^{10000}\approx10^{3010}$ 個參數（這個換算是本文算的，和講者在課堂上隨口報的數字不同），寫都寫不下來。

### 條件獨立假設

機率的連鎖律永遠成立：

$$
p(x_1,\dots,x_d\mid y)=p(x_1\mid y)\,p(x_2\mid y,x_1)\cdots p(x_d\mid y,x_1,\dots,x_{d-1})
$$

Naive Bayes 假設**給定類別之後，各個詞是否出現彼此獨立**，於是每一項裡對其他詞的條件都可以拿掉：

$$
p(x_1,\dots,x_d\mid y)=\prod_{j=1}^d p(x_j\mid y)
$$

這個假設顯然不是真的，講者自己舉了反例：「not the worst」裡的 not 和 worst 會被當成兩個各自獨立的負面訊號相乘，否定的意思完全丟失。但它把參數降到 $2d+1$ 個：每個詞在每個類別各一個 $\phi_{j\mid y=k}=p(x_j=1\mid y=k)$，共 $2d$ 個，再加一個事前機率 $\phi_y=p(y=1)$。從指數降到線性。

### 估計與預測

最大概似估計和 GDA 一樣只是計數（課堂沒有推導，講者說做法完全相同：寫出對數概似、微分、解方程）：

$$
\phi_y=\frac{\sum_i 1\{y^{(i)}=1\}}{n},\qquad
\phi_{j\mid y=k}=\frac{\sum_i 1\{x_j^{(i)}=1\wedge y^{(i)}=k\}}{\sum_i 1\{y^{(i)}=k\}}
$$

第二條的意思是：在第 $k$ 類的信裡，有多少比例包含第 $j$ 個詞。預測時把對應的機率查出來相乘，實作上取對數相加，比較兩類的總分。訓練和推論都極便宜，講者對這類老模型的評語是（1:14:59）：

> One of the things that's amazing about the models of the ancients is that they work pretty well.

### Laplace 平滑

課堂對 Laplace 平滑只講了一句「加一些 1」，目的是避免出現機率 0，並讓模型對自己的估計不要那麼有把握；講者把它歸為正規化（regularization）的一種，下一堂會細談。主講義 4.2.1 節給的公式是分子加 1、分母加 2（因為 $x_j$ 有兩種取值）：

$$
\phi_{j\mid y=k}=\frac{1+\sum_i 1\{x_j^{(i)}=1\wedge y^{(i)}=k\}}{2+\sum_i 1\{y^{(i)}=k\}}
$$

為什麼需要它，用一個小例子看最清楚（以下是本文自擬的例子，不是課堂內容）。10 封信裡 4 封垃圾信、6 封正常信，五個詞出現的封數如下：

| 詞 | buy | free | meeting | 229 | homework |
|---|---|---|---|---|---|
| 垃圾信（共 4 封） | 3 | 4 | 0 | 0 | 1 |
| 正常信（共 6 封） | 1 | 1 | 4 | 3 | 3 |

新信只包含 buy 和 meeting，也就是 $x=(1,0,1,0,0)$。

不平滑時，垃圾信那邊 $p(\text{meeting}=1\mid\text{垃圾})=0/4=0$，而且 $p(\text{free}=0\mid\text{垃圾})=1-4/4=0$。連乘裡只要有一個 0，整個 $p(x\mid\text{垃圾})$ 就是 0，其他詞提供多少證據都沒用。

平滑後，垃圾信的五個機率變成 $4/6,5/6,1/6,1/6,2/6$，正常信變成 $2/8,2/8,5/8,4/8,4/8$：

$$
p(x\mid\text{垃圾})=\frac46\cdot\frac16\cdot\frac16\cdot\frac56\cdot\frac46=\frac{80}{7776}\approx0.0103,\qquad
p(x\mid\text{正常})=\frac28\cdot\frac68\cdot\frac58\cdot\frac48\cdot\frac48=\frac{960}{32768}\approx0.0293
$$

乘上事前機率 $0.4$ 與 $0.6$，得 $0.00412$ 與 $0.01758$，所以 $p(\text{垃圾}\mid x)=0.00412/(0.00412+0.01758)\approx0.19$。模型仍然判成正常信，但不再是斬釘截鐵的 0：只在四封垃圾信裡沒看過 meeting，不足以斷定垃圾信永遠不會提到它。

## 自我檢查

**1. 用手算例子的模型分類 $x=(5,3)$，並說明為什麼答案和 $(4,4)$ 一樣。**
$a=4\times5+4\times3-32.693=-0.693$，$p(y=1\mid x)=1/(1+e^{0.693})=1/3$，判成貓。$(5,3)$ 和 $(4,4)$ 都在 $x_1+x_2=8$ 這條線上，而 $\theta=(4,4)$ 只看 $x_1+x_2$：沿著平行於邊界的方向移動，事後機率不變。

**2. 同一組資料如果再加兩隻大象，使兩類各四隻，而 $\mu_0,\mu_1,\Sigma^{-1}$ 剛好都沒變，決策邊界會移到哪裡？**
$\phi=1/2$，$\log\frac{\phi}{1-\phi}=0$，邊界變成 $x_1+x_2=8$，正好通過兩個中心的中點。能說出「事前機率只平移邊界、不改方向」才算答對。

**3. 推導 $\mu_1$ 時，從 $\Sigma^{-1}\sum_i 1\{y^{(i)}=1\}(x^{(i)}-\mu_1)=0$ 到 $\sum_i 1\{y^{(i)}=1\}(x^{(i)}-\mu_1)=0$ 用了什麼性質？這個性質不成立會怎樣？**
用了 $\Sigma^{-1}$ 可逆：可逆矩陣的零空間只有零向量。若不可逆，括號裡的向量可以是零空間裡任何非零向量，$\mu_1$ 在那個方向上無法唯一決定。

**4. 為什麼共用 $\Sigma$ 時邊界是直線，各用各的 $\Sigma$ 時卻是二次曲線？**
展開兩邊的指數後各有一個 $x$ 的二次項。共用時兩項都是 $x^\top\Sigma^{-1}x$，相減為 0；不共用時剩下 $x^\top(\Sigma_1^{-1}-\Sigma_0^{-1})x$，消不掉。

**5. 你的特徵是每小時的事件次數，比較像 Poisson 而不像高斯。GDA 和邏輯斯迴歸選哪個？理由是什麼？**
選邏輯斯迴歸。兩類都是 Poisson 時，事後機率仍是邏輯斯形式，邏輯斯迴歸的假設成立；GDA 則是拿高斯去配非高斯的資料，結果不可預期。答案要提到「多種生成假設都導向邏輯斯形式，反之不然」。

## 對應閱讀

[CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 4 章 Generative learning algorithms，第 35–48 頁：

- 4.1.1 多變數常態分布（第 36–39 頁）、4.1.2 GDA 模型（第 39–40 頁）、4.1.3 GDA 與邏輯斯迴歸（第 41–42 頁）。
- 4.2 Naive Bayes（第 42–45 頁，講義標為 Optional Reading）、4.2.1 Laplace 平滑（第 45–47 頁）、4.2.2 文字分類的事件模型（第 47–48 頁）。

課堂與講義的差別：

- 講義的例子是狗和大象，課堂換成貓和大象。
- 講義只要求 $\Sigma$ 對稱半正定；課堂明講要正定，並解釋行列式開根號與反矩陣為什麼需要它。
- 講義把參數的最大概似估計留給習題一；課堂推了 $\mu_1$。決策邊界的展開、QDA 與二次邊界的圖，講義都沒有。
- 講義有而課堂沒講或只帶過：GDA 在假設成立時「漸近有效」（asymptotically efficient）的說法；Laplace 平滑的動機例子（沒看過的詞讓事後機率變成 0/0）與公式；特徵取多個離散值、把連續特徵離散化後套 Naive Bayes；以及 4.2.2 的 multinomial 事件模型，課堂完全沒提。
- 課堂有而講義沒有：對「邏輯斯迴歸比較實用」這個傳統結論的保留，以及擴散模型、語言模型等生成式模型的脈絡。

**系列導覽**：上一堂 [第 4 堂：指數族、廣義線性模型與 softmax](/posts/ai/2026-10-12-stanford-cs229-lecture-04-exponential-family-glm)｜下一堂 [第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 5: Gaussian Discriminant Analysis](https://www.youtube.com/watch?v=zRdE8A4UZes)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：全文的課堂順序、引句與時間戳依這支影片的英文字幕逐段核對；未看板書與投影片畫面，公式依主講義第 4 章補上，決策邊界與 sigmoid 的完整代數、$\phi$ 與 $\Sigma$ 的推導及兩個數值例子是本文自行補寫與計算。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 5: Gaussian Discriminant Analysis（YouTube）](https://www.youtube.com/watch?v=zRdE8A4UZes)：本文的主要底本，課堂順序、講者說法與引句都出自它的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 4 章（第 35–48 頁）用來補公式記號、最大概似估計的結果、Laplace 平滑公式，以及「對應閱讀」的頁碼。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：本系列的課程定位與閱讀路線。
