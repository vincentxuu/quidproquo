---
title: "神經網路的架構：從一個 ReLU 疊到殘差連接與正規化層｜Stanford CS229 第 7 堂"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, deep-learning, neural-networks, sgd]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 7
tldr: "第 7 堂先把線性模型的訓練流程原封不動搬到非線性模型：每筆資料一個 loss、取平均、用 SGD 往下走，剩下兩個問題是模型長什麼樣、梯度怎麼算。後半堂回答第一個：一個神經元是 ReLU(wᵀx+b)，m 個神經元疊成矩陣就是一層 ReLU(Wx+b)，參數 md+m 個；再往上是殘差區塊 z+σ(MM(σ(MM(z)))) 與 LayerNorm、RMSNorm。梯度怎麼算留給第 8 堂。"
description: "Stanford CS229（Spring 2026）第 7 堂導讀：非線性模型的監督式學習框架、交叉熵與 SGD 的推導、從單一神經元到多層全連接網路的向量化寫法，以及殘差連接、LayerNorm、RMSNorm 與卷積的定義，附數值例子與自我檢查題。"
draft: false
math: true
---

> 🌏 [English version](/posts/ai/2026-10-12-stanford-cs229-lecture-07-neural-network-architecture-en)

**影片狀態：已附影片。** 這篇依 Stanford Online 公開的 Spring 2026 第 7 堂錄影的英文字幕寫成，公式與記號對照 2026 主講義第 7 章（Deep learning）的 7.1 到 7.3 節。我沒有看到板書畫面，字幕裡指著白板說的地方靠前後文與講義還原。

這是 [Stanford CS229 導讀](/posts/ai/2026-08-21-stanford-cs229-machine-learning)裡深度學習的第一堂，由 Tengyu Ma 講。到[上一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)為止，拿來做迴歸與分類的 $h_\theta$ 幾乎都是 $\theta^\top x$ 這種對參數線性的形式；這一堂把同一套訓練流程搬到非線性模型，然後定義最常用的一種非線性模型，也就是神經網路。先備是前幾堂的線性迴歸、softmax 與梯度下降，加上矩陣乘法。讀完之後，給你一個多層網路的各層寬度，你應該能寫出每個權重矩陣的形狀、數出參數量、用手算一次前向計算，並且說得出殘差連接與 LayerNorm 各自在式子上做了什麼。

```youtube
url: https://www.youtube.com/watch?v=fRM41w9jzQo
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 7: Neural Networks 1 (Architecture)
captions: en
```

講者開場交代了範圍（錄影 00:05–02:11）：這兩堂只打深度學習的底子，擴散模型和大型語言模型留到後面幾週。他也解釋為什麼用白板而不用投影片：投影片一次只看得到一張，「there's not enough memory there」，白板有六塊可以回頭查，寫字也逼他放慢速度。

## 什麼叫「非線性」模型（錄影 02:11–08:00）

線性模型長這樣，$x\in\mathbb{R}^d$ 是輸入，$\theta\in\mathbb{R}^d$ 是參數：

$$
h_\theta(x)=\theta_1x_1+\theta_2x_2+\cdots+\theta_dx_d
$$

課堂先排除一種看起來非線性、其實不算的情況：

$$
h_\theta(x)=\theta_1x_1^2+\theta_2x_2^2+\cdots+\theta_dx_d^2
$$

它對 $x$ 是二次的，但只要令 $z_i=x_i^2$，把 $z$ 當成新的輸入，模型就變回 $\theta_1z_1+\cdots+\theta_dz_d$。要學的是 $\theta$，而 $z$ 是算得出來的固定數字，所以線性迴歸的工具全部照用。講者的說法是「this nonlinear in the data is not nonlinear enough in some sense」（03:12 起的段落）。

這堂課說的非線性，是指對**參數**非線性。他隨手寫了一個例子 $\theta_1^2x_1+\cdots$，並強調那只是示意，真正要談的模型是神經網路。有學生問兩者差在哪，他的回答是：只對 $x$ 非線性的模型可以靠換輸入變回線性模型，從學習的角度看沒有差別；對參數非線性的模型做不到這件事，所以有些線性模型的技巧不能再用。

本文補充：講者說這個隨手寫的例子「沒有辦法」變回線性模型，這句話對它其實說得太滿。令 $\phi_1=\theta_1^2$，它就是係數被限制成 $\phi_1\ge0$ 的線性模型。把它當成記號上的示意就好；真正換不回去的例子是後面的 $\text{ReLU}(wx+b)$，自我檢查第 1 題會用一組數字驗證它對參數不是線性的。

講義 7.1 節的措辭略有不同：它說接下來要考慮「對參數 $\theta$ 與輸入 $x$ 都非線性」的模型，註腳舉的例子是 $\theta_1^2x_1^2+\cdots+\theta_d^2x_d^2$。

## 迴歸的 loss，以及它為什麼等於高斯假設下的負對數概似（錄影 08:00–10:27、17:53–19:55）

資料集是 $n$ 組輸入與標籤 $\{(x^{(i)},y^{(i)})\}_{i=1}^n$。記號沿用整門課的慣例：上標 $(i)$ 是第幾筆資料，下標是第幾個座標。

迴歸問題的標籤 $y^{(i)}\in\mathbb{R}$，模型 $h_\theta:\mathbb{R}^d\to\mathbb{R}$。第 $i$ 筆資料的 loss 與整體 loss 是

$$
J^{(i)}(\theta)=\big(y^{(i)}-h_\theta(x^{(i)})\big)^2,\qquad J(\theta)=\frac1n\sum_{i=1}^nJ^{(i)}(\theta)
$$

loss 寫成 $\theta$ 的函數，因為資料是給定的，能動的只有參數。式子跟線性迴歸一樣，差別只在 $h_\theta$ 不再是 $\theta^\top x$。講義的 (7.1) 式前面多一個 $\frac12$，課堂沒寫；乘上常數不會改變最小值的位置。講者順帶說 error、loss、cost 三個詞指同一件事，講義還在用 cost，現在研究者比較常說 loss。

後面有學生追問：為什麼平方誤差也算一種概似？講者當場推了一遍，內容跟[第 3 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)對線性模型做的推導相同，只是把 $\theta^\top x$ 換成一般的 $h_\theta(x)$。假設資料是這樣產生的：

$$
y=h_\theta(x)+\epsilon,\qquad\epsilon\sim\mathcal{N}(0,\sigma^2)
$$

那麼給定 $x$ 時，$y$ 服從平均為 $h_\theta(x)$、變異數 $\sigma^2$ 的高斯分布：

$$
p(y\mid x;\theta)=\frac{1}{\sqrt{2\pi}\,\sigma}\exp\!\Big(-\frac{(y-h_\theta(x))^2}{2\sigma^2}\Big)
$$

取負對數，乘積變成加法，指數被 $\log$ 消掉：

$$
-\log p(y\mid x;\theta)=\log\big(\sqrt{2\pi}\,\sigma\big)+\frac{1}{2\sigma^2}\big(y-h_\theta(x)\big)^2
$$

第一項跟 $\theta$ 無關；第二項是平方誤差乘上正的常數 $\frac{1}{2\sigma^2}$。所以對 $\theta$ 做最小化時，負對數概似與平方誤差會選出同一組參數。

## 多類別分類：logits、softmax 與交叉熵（錄影 10:27–17:53）

講義另有二元分類一段，課堂為了省時間直接講多類別。這裡講者把上標 $(i)$ 拿掉，只看一筆資料 $(x,y)$，標籤 $y\in\{1,\dots,k\}$ 是離散的類別編號。

模型 $\bar h_\theta:\mathbb{R}^d\to\mathbb{R}^k$ 對每個類別輸出一個實數，這 $k$ 個數字叫 **logits**。加一條橫線只是為了跟迴歸的 $h_\theta$ 區分。softmax 把 logits 變成機率：

$$
P(y=j\mid x;\theta)=\frac{\exp\big(\bar h_\theta(x)_j\big)}{\sum_{s=1}^k\exp\big(\bar h_\theta(x)_s\big)}
$$

指數讓每一項為正，除以總和讓它們加起來等於 1。loss 一樣取負對數概似。這裡有一個講者特別停下來講的細節：上式對每個 $j$ 都給了一個機率，但我們手上的標籤是某一個特定的 $y$，所以要把 $j$ 換成 $y$ 代進去：

$$
\ell_{\text{ce}}\big(\bar h_\theta(x),y\big)=-\log\frac{\exp\big(\bar h_\theta(x)_y\big)}{\sum_{s=1}^k\exp\big(\bar h_\theta(x)_s\big)}
$$

這就是**交叉熵 loss**（cross-entropy loss），兩個輸入是 logits 向量與標籤。講者提到 PyTorch 裡有同名的模組可以直接呼叫。整個資料集的 loss 仍是平均：$J(\theta)=\frac1n\sum_i\ell_{\text{ce}}\big(\bar h_\theta(x^{(i)}),y^{(i)}\big)$。

**數值例子（本文自擬，不是課堂內容）。** 三個類別，某筆資料的 logits 是 $(2,1,0)$。

- 取指數：$e^2\approx7.389$、$e^1\approx2.718$、$e^0=1$，總和約 $11.107$。
- 機率：$7.389/11.107\approx0.665$、$2.718/11.107\approx0.245$、$1/11.107\approx0.090$。
- 標籤是第 1 類時，loss 為 $-\log0.665\approx0.408$；標籤是第 3 類時，loss 為 $-\log0.090\approx2.408$。

這代表什麼：模型把最高分給了第 1 類，如果答案真的是第 1 類，loss 就小；答案是模型最不看好的第 3 類，loss 是前者的將近六倍。換一個方式驗算：把 loss 展開是 $\log\sum_s e^{\text{logit}_s}-\text{logit}_y$，也就是 $\log11.107-2\approx2.408-2=0.408$。

**為什麼叫交叉熵？** 學生問了這題，講者口頭回答，說推導寫起來有點長。照他描述的方向補完（以下式子是本文補的）：令 $p_\theta(j)=P(y=j\mid x;\theta)$，$p^\star$ 是給定 $x$ 時標籤的真實分布。把 loss 對真實分布取期望值：

$$
\mathbb{E}_{y\sim p^\star}\big[\ell_{\text{ce}}\big]=\sum_{j=1}^kp^\star(j)\cdot\big(-\log p_\theta(j)\big)=-\sum_{j=1}^kp^\star(j)\log p_\theta(j)
$$

右邊就是 $p^\star$ 與 $p_\theta$ 的交叉熵：一個分布的機率乘上另一個分布的對數機率，再加總。

**one-hot 向量呢？** 課堂的寫法裡 $y$ 就是一個整數，所以可以直接拿來當下標。講者說也可以把 $y$ 編成 one-hot 向量，數學上是同一件事，只是「取第 $y$ 個座標」要改寫成跟 one-hot 向量做內積。

## 最佳化：梯度下降、SGD 與小批次（錄影 19:55–34:23）

總 loss $J(\theta)$ 是 $\theta$ 的函數，接下來要找讓它變小的 $\theta$。牛頓法在這裡不能用，講者的理由是函數不再是凸的，牛頓法沒有保證；他補了一句，其實沒有任何方法能對所有非凸函數都有保證。

**梯度下降**把 $J$ 當成一個整體，每一步

$$
\theta:=\theta-\eta\,\nabla J(\theta),\qquad\nabla J(\theta)=\frac1n\sum_{i=1}^n\nabla J^{(i)}(\theta)
$$

課堂的步長寫 $\eta$，講義寫 $\alpha$。算一次 $\nabla J$ 要把 $n$ 筆資料各自的梯度都算出來再平均。

**隨機梯度下降（SGD）**最單純的版本，每一步從 $\{1,\dots,n\}$ 均勻抽一個 $j$，只用那一筆：

$$
\theta:=\theta-\eta\,\nabla J^{(j)}(\theta)
$$

為什麼只看一筆也說得過去？$j$ 是隨機的，每個值被抽到的機率是 $\frac1n$，所以單筆梯度的期望值是

$$
\mathbb{E}_j\big[\nabla J^{(j)}(\theta)\big]=\sum_{j=1}^n\frac1n\,\nabla J^{(j)}(\theta)=\nabla\Big(\frac1n\sum_{j=1}^nJ^{(j)}(\theta)\Big)=\nabla J(\theta)
$$

中間那個等號用的是「梯度的和等於和的梯度」。結論是：單筆梯度平均起來正好是完整梯度，只是每一次都帶著雜訊。

用一個小例子看雜訊長什麼樣（本文自擬）：一維參數、三筆資料，在目前的 $\theta$ 上三個單筆梯度是 $4$、$1$、$-2$。完整梯度是平均值 $1$，梯度下降會往負方向走。SGD 抽到第一筆會走得太遠，抽到第三筆甚至往反方向走，但三種情況等機率，平均起來還是 $1$。講者在白板上用箭頭畫的是同一件事：黑色箭頭是完整梯度，藍色箭頭散在四周，有時還會倒著走；軌跡上藍線歪歪扭扭，大致跟著黑線。他也提醒，兩條軌跡長期能貼多緊取決於步長等很多細節，誤差有時被放大、有時被縮小。

學生接著問：那到底為什麼要用 SGD？講者給了三個理由。

1. **完整梯度太貴。** 講者舉的數字是 2015 年大約一百萬筆資料，2026 年是一兆個 token 左右，不可能每一步都把所有梯度算過一遍。
2. **算完整梯度很浪費。** 各筆資料的梯度彼此高度相關，如果每筆資料都叫你往同一邊走，看一小部分就知道方向了。
3. **過程不需要很精確。** 某一步走歪了，後面的步驟會修正回來；每一步共同的那股力量會把擾動洗掉。

**區域極小值的問答。** 有學生問，卡在區域極小值時 SGD 的雜訊是不是能幫忙跳出去。講者先畫了一維的情況：沿著下坡走到一個谷底，梯度是 0，就停住了。雜訊把你彈到另一個谷的說法聽起來合理，但他說研究社群並不這樣看：

> "I don't think people believe that stochastic descent can help you to jump out of a local minimum."（29:18 起的段落）

另一面是，大家也不認為高維的 loss 函數有很多壞的區域極小值。講者說自己參與過這方面的理論，並強調沒有人確定它是對的；目前比較像共識的假說是，壞的區域極小值非常少，甚至可能所有區域極小值都是全域極小值。他用滑雪比喻：在山上隨便往下滑，多半會回到某個停車場；偶爾滑進野地卡住，通常也找得到一條溪谷繼續往下。他自己補了一句，這個比喻在二維不完全成立，維度高的時候才更容易總是找得到往下走的方向。

又有學生說這很反直覺，想知道數學上的理由。講者說這不是普遍成立的事，只能給一兩句的直覺：區域極小值要求該點的 Hessian 在所有方向上都是半正定，這個條件很難滿足。梯度等於 0 已經是 $d$ 條等式；再要求 Hessian 沒有任何負的方向，符合的點又少了許多。在某些特定模型裡，他和其他研究者的論文真的把區域極小值的個數算了出來，結果跟全域極小值的個數相同；一般情況很難算。字幕把用到的工具記成「categorize formula」，應是 Kac–Rice 公式。

**小批次。** 實務上不會一次只抽一筆。用全部資料太貴，只用一筆雜訊太大，折衷是每次抽 $B$ 筆。講者另外提了硬體上的理由：一次只算一筆，GPU 使用率太低，手上有一萬顆 GPU 的話大部分都在閒置。他說 SGD 這個詞同時涵蓋批次大小為 1 和更大的版本。更新式照講義的 (7.10) 式，步長換成課堂的 $\eta$：

$$
\theta:=\theta-\frac{\eta}{B}\sum_{k=1}^B\nabla J^{(j_k)}(\theta)
$$

其中 $j_1,\dots,j_B$ 是從 $\{1,\dots,n\}$ 抽出的 $B$ 個索引（講義註明不重複抽樣）。

## 框架搭完，剩兩個問題（錄影 34:23–36:25）

到這裡的流程是：定義每筆資料的 loss、取平均、選一個最佳化方法去跑。講者說之後的非監督式學習也是同一個架子，只是 loss 裡沒有 $y$。這套流程對任何 $h_\theta$ 都成立，所以剩下兩個問題：

1. $h_\theta$（或 $\bar h_\theta$）要怎麼定義？這是本堂後半的內容。
2. 單筆資料的梯度 $\nabla J^{(j)}(\theta)$ 怎麼算？算得出單筆，整批的梯度取平均就有了。這個演算法叫反向傳播（backpropagation），或自動微分，是[下一堂](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation)的主題。

## 一個神經元：ReLU 與激勵函數（錄影 36:25–43:34）

例子還是房價預測，講者自己說這個例子大概有二十年了。橫軸是房屋面積（size），縱軸是價格。他描述的資料形狀是：一開始價格隨面積漲得不多，後面才接近直線。用一條直線去配會不夠準，所以希望模型至少畫得出「先平、後斜」的折線。這條折線可以寫成

$$
h_\theta(x)=\max(wx+b,\,0)+c
$$

$\max(wx+b,0)$ 把直線低於 0 的部分全部切成 0，$c$ 再把整條線上下平移。講者順帶說切掉負值也合理，因為房價不會是負的。講義的 (7.11) 式沒有 $+c$ 這一項，動機寫的也只是「不讓房價變成負的」。

$\max(t,0)$ 這個函數在深度學習裡叫 **ReLU**（rectified linear unit）：

$$
\text{ReLU}(t)=\max(t,0)
$$

負的那一側是 0，正的那一側是斜率為 1 的直線。上面的模型於是寫成 $\text{ReLU}(wx+b)+c$。少了 ReLU，它就只是一條直線。

**數值例子（本文自擬）。** 取 $w=0.3$、$b=-300$、$c=200$，$x$ 的單位是平方英尺，輸出的單位是千美元。

- $x=500$：$wx+b=150-300=-150$，ReLU 之後是 $0$，輸出 $0+200=200$。
- $x=1000$：$wx+b=0$，輸出 $200$。
- $x=2000$：$wx+b=600-300=300$，輸出 $300+200=500$。

折點在 $wx+b=0$ 的地方，也就是 $x=-b/w=1000$。折點左邊模型輸出固定的 200，右邊每多一平方英尺多 0.3。$w$ 決定斜率、$b$ 跟 $w$ 一起決定折點位置、$c$ 決定平段的高度，三個參數都要從資料學。

ReLU 這類把一個實數映到一個實數的非線性函數，叫**激勵函數**（activation function）。講者解釋名稱的由來：生物的神經元受到其他神經元的刺激，超過某個門檻才會被激發，低於門檻就沒有反應，這個反應是刺激的非線性函數。他聲明自己不是這方面的專家，生物上的函數也不會剛好長成 ReLU，比較像 sigmoid，深度學習早期用 sigmoid 就是這個原因，後來因為計算上的問題才被換掉。字幕把這一句記成「this ReLU is actually a bad idea」，依前後文指的是 sigmoid。講義 7.2 節給的原因之一是：sigmoid 與 tanh 的輸入往正負兩端走時，梯度會消失。

輸入是 $d$ 維向量時，把 $wx$ 換成內積：

$$
h_\theta(x)=\text{ReLU}(w^\top x+b),\qquad w\in\mathbb{R}^d,\ b\in\mathbb{R}
$$

$w$ 叫權重向量，$b$ 叫偏差項（bias）。$w^\top x$ 是純量，加上純量 $b$，過一次 ReLU，輸出還是純量。用了一次激勵函數，所以這是**一個神經元**，也叫一層的網路。

## 把神經元疊起來：兩層全連接網路（錄影 43:34–50:58）

講者用房價例子說明為什麼要疊。原始輸入有 $x_1$ 面積、$x_2$ 房間數、$x_3$ 郵遞區號，還有一個 $x_4$，他看著筆記說想不起來是什麼（講義寫的是社區的富裕程度）。真正影響房價的可能是一些資料裡沒有的中間量，例如步行方便度（walkability）$a_1$ 和學區品質 $a_2$。每個中間量可以想成原始輸入的某個線性組合再過 ReLU，最後的價格再是這些中間量的線性組合，例如 $\theta_9a_1+\theta_{10}a_2$。他說這裡的記號寫得很隨便，只是要傳達「線性、非線性、再線性」這樣反覆套用的想法。講義同一個例子有三個中間量，多一個「可容納的家庭人數」。

舊論文常把這種結構畫成一排圓圈連到下一排圓圈。講者的評語是：

> "once you know what they are talking about, the drawings are very useful. But when you don't really know what they are talking about, it's kind of confusing."（46:52 起的段落）

所以他改用式子定義。輸入 $x\in\mathbb{R}^d$，有 $m$ 個中間變數，每一個都是一個神經元，而且都吃**全部**的輸入：

$$
\begin{aligned}
a_1&=\text{ReLU}\big(w_1^{[1]\top}x+b_1^{[1]}\big)\\
a_2&=\text{ReLU}\big(w_2^{[1]\top}x+b_2^{[1]}\big)\\
&\ \,\vdots\\
a_m&=\text{ReLU}\big(w_m^{[1]\top}x+b_m^{[1]}\big)
\end{aligned}
$$

每個 $w_j^{[1]}\in\mathbb{R}^d$、$b_j^{[1]}\in\mathbb{R}$。輸出是這些 $a_j$ 的線性組合。把 $a_1,\dots,a_m$ 收成向量 $a\in\mathbb{R}^m$，就不必寫一長串 $\theta_1a_1+\cdots$：

$$
\bar h_\theta(x)=w^{[2]\top}a+b^{[2]},\qquad w^{[2]}\in\mathbb{R}^m,\ b^{[2]}\in\mathbb{R}
$$

方括號上標是第幾層：$[1]$ 的那些參數把 $x$ 變成 $a$，$[2]$ 的參數把 $a$ 變成輸出。注意 $w^{[2]}$ 的維度是 $m$，跟 $a$ 一樣，跟 $x$ 無關，因為它要跟 $a$ 做內積。這就是**兩層全連接神經網路**；「全連接」指每個 $a_j$ 都依賴所有的 $x_i$。

三種上下標不要混在一起：圓括號上標 $(i)$ 是第幾筆資料，方括號上標 $[k]$ 是第幾層，下標是第幾個座標或第幾個神經元。

## 向量化：一層就是 ReLU(Wx + b)（錄影 50:58–54:15）

上下標太多，講者自己也說亂。把第一層的 $m$ 個權重向量轉置成列向量，一列一列疊成矩陣：

$$
W^{[1]}=\begin{bmatrix}w_1^{[1]\top}\\w_2^{[1]\top}\\\vdots\\w_m^{[1]\top}\end{bmatrix}\in\mathbb{R}^{m\times d},\qquad b^{[1]}=\begin{bmatrix}b_1^{[1]}\\b_2^{[1]}\\\vdots\\b_m^{[1]}\end{bmatrix}\in\mathbb{R}^m
$$

依矩陣乘法的定義，$W^{[1]}x$ 的第 $j$ 個座標正好是第 $j$ 列與 $x$ 的內積 $w_j^{[1]\top}x$。所以 $m$ 條式子合成一條：

$$
a=\text{ReLU}\big(W^{[1]}x+b^{[1]}\big)
$$

這裡的 ReLU 作用在向量上，意思是**逐元素**套用，講者說這一點要記得。他提醒所有向量預設是行向量（column vector），轉置之後才是列向量（row vector）；本文的「行」「列」都照這個用法，行是直的、列是橫的；也說多數時候不必記上面的對應關係，只要記得一層做的事是「乘一個矩陣、加一個偏差向量、逐元素取 ReLU，得到一個向量」。

參數量：$W^{[1]}$ 把 $d$ 維輸入變成 $m$ 維輸出，有 $m\times d$ 個數字；$b^{[1]}$ 有 $m$ 個。這一層共 $md+m$ 個參數。

**完整數值例子（本文自擬）。** 取 $d=3$、$m=2$：

$$
x=\begin{bmatrix}1\\2\\-1\end{bmatrix},\quad W^{[1]}=\begin{bmatrix}1&-1&2\\0.5&1&1\end{bmatrix},\quad b^{[1]}=\begin{bmatrix}1\\0.5\end{bmatrix},\quad w^{[2]}=\begin{bmatrix}3\\-1\end{bmatrix},\quad b^{[2]}=0.5
$$

第一層的線性部分，一列一列算：

- 第 1 列：$1\cdot1+(-1)\cdot2+2\cdot(-1)=-3$，加上偏差 $1$ 得 $-2$。
- 第 2 列：$0.5\cdot1+1\cdot2+1\cdot(-1)=1.5$，加上偏差 $0.5$ 得 $2$。

逐元素取 ReLU：$a=\big(\max(-2,0),\ \max(2,0)\big)=(0,2)$。第二層：$\bar h_\theta(x)=3\cdot0+(-1)\cdot2+0.5=-1.5$。

這個結果說明兩件事。第一個神經元對這筆輸入輸出 0，它的權重對這次的輸出完全沒有貢獻；ReLU 讓每筆資料只啟用一部分神經元。再來，最後的輸出是負的，因為最後一層沒有接 ReLU。講義 (7.13) 式的註腳特別提到，多層網路靠近輸出的地方通常不放 ReLU，尤其是輸出不一定為正的時候。

參數量：第一層 $md+m=2\cdot3+2=8$，第二層 $m+1=3$，共 11 個。

## 更抽象一點：MM、其他激勵函數與多層（錄影 54:15–1:04:48）

為了少寫符號，講者把「乘矩陣加偏差」定義成一個模組（講義記作 MM，matrix multiplication）：

$$
\text{MM}_{W,b}(z)=Wz+b
$$

ReLU 也可以換成別的激勵函數 $\sigma$。激勵函數一律是 $\mathbb{R}\to\mathbb{R}$ 的純量函數，用在向量上就逐元素套。一層於是寫成 $\sigma(\text{MM}_{W,b}(z))$。

課堂上講者畫了幾種但沒寫公式，請大家去看講義。講義 7.2 節列的有：

- sigmoid：$\sigma(z)=\dfrac{1}{1+e^{-z}}$
- tanh：$\sigma(z)=\dfrac{e^z-e^{-z}}{e^z+e^{-z}}$
- leaky ReLU：$\sigma(z)=\max\{z,\gamma z\}$，$\gamma\in(0,1)$
- GELU：$\sigma(z)=\dfrac z2\Big(1+\text{erf}\big(\tfrac{z}{\sqrt2}\big)\Big)$

講者歸納這些函數大致都是遞增的，而且常常在 0 的左邊接近 0（他說的是 often；照上面的式子，tanh 的左側趨近 $-1$，就不屬於這種）。GELU 是不完全遞增的那一個：它在負的那一側會先往下凹一點再回來。照講義的式子用數值掃一遍，最低點大約在 $z\approx-0.75$，函數值約 $-0.17$（這組數字是本文算的）。至於為什麼選哪一個，講者很坦白：

> "So exactly why use any of this is like a little like a magic."（57:24 起的段落）

他的觀察是比較平滑的函數似乎有幫助，ReLU 不夠平滑；除此之外有時是穩定性的考量，有時就是試出來的。講義還列了 Swish、ReLU²、Softplus 與 GLU 這類有閘門的激勵函數，課堂沒有提。

有了這兩個模組，多層網路就是反覆套用：

$$
\text{MM}_{W^{[r]},b^{[r]}}\Big(\sigma\big(\cdots\sigma\big(\text{MM}_{W^{[2]},b^{[2]}}\big(\sigma\big(\text{MM}_{W^{[1]},b^{[1]}}(x)\big)\big)\big)\cdots\big)\Big)
$$

講者說層數大致就是矩陣乘法的次數。每一層用的是**不同的** $W$ 和 $b$，形狀可能相似，但是不同的變數，所以完整寫出來時要用方括號上標區分。

**維度要相容。** 要讓 $Wz$ 有意義，$W$ 的行數（直的有幾行）必須等於 $z$ 的維度，列數（橫的有幾列）可以自由選。假設輸入是 $d$ 維：

- $W^{[1]}\in\mathbb{R}^{m_1\times d}$，輸出 $m_1$ 維；過 $\sigma$ 之後維度不變。
- $W^{[2]}$ 的行數因此必須是 $m_1$，也就是 $W^{[2]}\in\mathbb{R}^{m_2\times m_1}$，$m_2$ 又可以自由選。

每一層的輸出維度成為下一層的輸入維度。講者補充，原始輸入的維度由資料決定，不能改；之後通常不會頻繁換維度，同一個寬度用很久，中間換個一兩次。照上一節的數法，第 $k$ 層有 $m_km_{k-1}+m_k$ 個參數，講義把總數寫成 $(d+1)m_1+(m_1+1)m_2+\cdots+(m_{r-1}+1)m_r$。

現在的架構論文畫圖比圓圈圖更抽象：一個方塊寫 MM、一個方塊寫 $\sigma$，往上疊。把幾個方塊合成一個，就叫 **MLP**（multilayer perceptron，多層感知器）。講者提醒這個詞在不同論文裡指的東西不一樣，有時是一次矩陣乘法加一個 $\sigma$，有時是兩次。

學生問中間層的維度通常是越來越小嗎？講者說多數情況是，因為原始輸入往往很大。語言模型一開始的維度是詞彙表大小，可能有 25 萬，會先縮到 2 千左右再一路用下去；影像是 RGB 三個通道，每個通道例如 256×256，也要先縮小。

## 殘差連接（錄影 1:04:48–1:11:50）

殘差區塊（residual block）的定義是：對輸入 $z$ 交替做兩次矩陣乘法與激勵函數，最後把 $z$ 自己加回去。

$$
\text{Res}(z)=z+\sigma\big(\text{MM}(\sigma(\text{MM}(z)))\big)
$$

兩個 MM 各有自己的權重。由定義馬上得到一個限制：$z$ 要跟後面那一項相加，所以這個區塊的輸入與輸出維度必須相同。$z$ 也不必是原始輸入，可以是任何中間層的輸出。

殘差網路大致是這樣組成的：開頭先做一次轉換，把原始維度換成中間維度；中間疊很多個殘差區塊；最後可能再換一次維度。講義把簡化版寫成 $\text{ResNet-S}(x)=\text{MM}(\text{Res}(\text{Res}(\cdots\text{Res}(x))))$。

講者說這個設計出自 2015 年那篇很有名的殘差網路論文（講義的引用寫作 He et al., 2016），並轉述當初的動機。假設走到某一層時，中間變數 $z$ 已經很接近目標 $y$。既然已經接近，就讓網路只去描述差距：

$$
y-z=\sigma(\text{MM}(z))
$$

把 $z$ 移到右邊：

$$
y=z+\sigma(\text{MM}(z))
$$

這跟殘差區塊幾乎一樣，差別只在後來發現用一層去描述差距不夠好，改用兩層。講者說大約七到十年前有人試過裡面放兩層、三層或更多層，結果兩到三層最好，原因並沒有真正被理解。他對整套說法的定位是：

> "So this is just a story. It's not like there's any formal proof there."（1:08:59 起的段落）

有學生被「哪一個才是假設」弄糊塗了。講者的回答是兩條式子等價：你相信直接描述殘差比較有利，就寫第一條，移項就得到第二條，「nothing profound」。直覺上，預測原本的標籤很難，預測一個已經很小的差距比較簡單，所以把簡單的工作交給那兩層。

他也提到另一類解釋是從最佳化的角度看：在某些情況下可以論證，加上 $z$ 會讓最佳化問題的條件數變好、比較好訓練，他自己也有論文屬於這一類。解釋很多，很難知道哪一個才是真正的原因。

一個可以自己驗算的觀察（本文補充）：如果兩個 MM 的權重與偏差全部是 0，激勵函數用 ReLU，那麼 $\sigma(\text{MM}(\cdot))=\text{ReLU}(0)=0$，於是 $\text{Res}(z)=z$。也就是說，殘差區塊要表示「什麼都不做」只需要把參數設成 0。

## LayerNorm 與 RMSNorm（錄影 1:11:50–1:18:50）

剩七分鐘時，講者選擇先講 layer normalization。它是一個模組，輸入 $z\in\mathbb{R}^m$，目的是把 $z$ 正規化。

**第一步**，算這個向量自己各座標的平均與標準差，減掉平均、除以標準差。講義把這一步叫 LN-S：

$$
\hat\mu=\frac1m\sum_{i=1}^mz_i,\qquad\hat\sigma=\sqrt{\frac1m\sum_{i=1}^m(z_i-\hat\mu)^2},\qquad\text{LN-S}(z)_i=\frac{z_i-\hat\mu}{\hat\sigma}
$$

做完之後，這個向量的座標平均是 0、標準差是 1。要留意平均是對**同一個向量的 $m$ 個座標**取的，跟其他筆資料無關。講義註腳說明分母用 $m$ 而不是 $m-1$，因為目的是讓輸出的變異數剛好是 1，不是在做統計估計。

**第二步**，平均 0、標準差 1 不一定是最好的選擇，所以再加兩個可以學的純量 $\beta$ 與 $\gamma$：

$$
\text{LN}(z)_i=\beta+\gamma\cdot\frac{z_i-\hat\mu}{\hat\sigma}
$$

輸出的平均變成 $\beta$、標準差變成 $|\gamma|$。講者稱這一步是巧妙的地方：先正規化到 1，再留一個 $\gamma$ 讓訓練自己決定要正規化到多大，並沒有硬把尺度鎖死在 1。

講者說 LayerNorm 在大型語言模型裡還在用，只是形式跟原版略有不同，接著介紹更簡單的 **RMSNorm**（講義舉的例子是 LLaMA 與 Qwen）。它不減平均，只除以各座標平方的平均再開根號，然後乘上可以學的 $\gamma$：

$$
\text{RMSNorm}(z)_i=\gamma\cdot\frac{z_i}{\hat\sigma},\qquad\hat\sigma=\sqrt{\frac1m\sum_{i=1}^mz_i^2}
$$

課堂上他一度寫成留 $\beta$，隨即更正為留 $\gamma$。意思是不在乎平均是不是 0，但仍然要控制尺度。至於為什麼這樣比較好，他說主要是實驗結果。

**數值例子（本文自擬）。** $z=(2,4,6,8)$。

- 平均 $\hat\mu=5$；偏差是 $(-3,-1,1,3)$，平方的平均是 $(9+1+1+9)/4=5$，所以 $\hat\sigma=\sqrt5\approx2.236$。
- $\text{LN-S}(z)\approx(-1.342,\,-0.447,\,0.447,\,1.342)$。
- 取 $\beta=0.5$、$\gamma=2$：$\text{LN}(z)\approx(-2.183,\,-0.394,\,1.394,\,3.183)$，平均是 0.5，標準差是 2。
- RMSNorm（$\gamma=1$）：平方的平均是 $(4+16+36+64)/4=30$，$\sqrt{30}\approx5.477$，輸出約 $(0.365,\,0.730,\,1.095,\,1.461)$。四個數字都還是正的，因為沒有減平均。

現在把輸入放大十倍，$z'=(20,40,60,80)$。平均變成 50，標準差變成 $10\sqrt5$，於是 $(20-50)/(10\sqrt5)=-3/\sqrt5\approx-1.342$，跟原來一模一樣。RMSNorm 也一樣：$20/\sqrt{3000}=20/54.77\approx0.365$。

這就是講者最後一分鐘講的**尺度不變性**。一般地，把 $z$ 乘上純量 $\alpha>0$，平均與標準差都跟著乘 $\alpha$：

$$
\text{LN-S}(\alpha z)_i=\frac{\alpha z_i-\alpha\hat\mu}{\alpha\hat\sigma}=\frac{z_i-\hat\mu}{\hat\sigma}=\text{LN-S}(z)_i
$$

分子分母的 $\alpha$ 消掉，所以 $\text{LN}(\alpha z)=\text{LN}(z)$。講義把它接到前一層：$\text{MM}_{\alpha W,\alpha b}(z)=\alpha\,\text{MM}_{W,b}(z)$，因此 $\text{LN}(\text{MM}_{\alpha W,\alpha b}(z))=\text{LN}(\text{MM}_{W,b}(z))$，把前一層的權重與偏差一起放大或縮小，正規化之後的輸出不變。講義限定 $\alpha>0$；$\alpha$ 是負的時候 $\hat\sigma$ 只會乘上 $|\alpha|$，正規化後的向量會變號（這一句是本文補充）。

這個性質的用處，講者的說明是：以前調模型時，一層一層套下去，輸出可能越來越大，大到 $10^{20}$ 這種等級，然後整個爆掉；每一層都正規化就不會走到那一步。初始化也變得比較不敏感，尺度沒抓準不至於全盤崩潰。他另外留了一個他自己稱為偏進階的但書：前向計算對尺度不變，梯度卻不是，所以一部分問題被推到最佳化那一側，而那邊複雜得多。

## 卷積：一分鐘版本（錄影 1:18:50–1:20:15）

卷積網路課堂上沒時間講，講者用最後一分鐘給了一句話的版本，其餘請讀講義：卷積層也是矩陣乘法，只是乘的不是一個填滿的矩陣，而是有特殊結構的矩陣。字幕把它記成「topless matrix」，依描述應是 Toeplitz 矩陣。非零的元素只出現在對角線附近的一條帶子上，而且每一列放的是同一組數字，只是位置往右移一格。那組共用的數字叫 filter，等於拿同一個 filter 對資料的每個位置各套一次。

接下來的矩陣與參數量是依講義補的，課堂沒有寫。講義的 (7.53) 式把這個矩陣的一般形式寫了出來；本文代入 filter 長度 $k=3$、輸入維度 $m=4$（邊界補零），filter 是 $(w_1,w_2,w_3)$，得到

$$
Q=\begin{bmatrix}w_2&w_3&0&0\\w_1&w_2&w_3&0\\0&w_1&w_2&w_3\\0&0&w_1&w_2\end{bmatrix}
$$

一般的 $4\times4$ 矩陣有 16 個參數，這裡只有 3 個。講義給的一般結論是：卷積有 $k$ 個參數、計算量 $O(km)$，一般矩陣乘法是 $m^2$ 個參數、$O(m^2)$。二維與多通道的版本在講義裡。

講者對卷積的評價是它現在用得不多，主要剩視覺的情境，而且視覺也大量改用 transformer，所以「probably it's fine to skip them」（1:20:12 起的段落）。

## 自我檢查

**1. $h(x)=\text{ReLU}(wx+b)$ 對參數 $(w,b)$ 是線性的嗎？舉一組數字說明。**

不是。如果是線性的，把兩組參數相加，輸出也要相加。取 $x=1$：參數 $(1,0)$ 的輸出是 $\text{ReLU}(1)=1$；參數 $(-1,0)$ 的輸出是 $\text{ReLU}(-1)=0$；兩組參數相加是 $(0,0)$，輸出 $\text{ReLU}(0)=0$，但 $1+0=1\neq0$。判準：答案要有一個具體的反例，只說「因為有 ReLU」不夠。

**2. 三個類別，logits 是 $(3,0,0)$，標籤是第 2 類。交叉熵 loss 是多少？**

分母是 $e^3+1+1\approx22.086$，第 2 類的機率是 $1/22.086\approx0.045$，loss 是 $\log22.086\approx3.095$。也可以直接算 $\log\sum_se^{\text{logit}_s}-\text{logit}_y=3.095-0$。

**3. 一個網路的輸入是 10 維，接兩個寬度為 5 的隱藏層，最後輸出 3 個 logits。寫出三個權重矩陣的形狀，並算出參數總數。照課堂的定義，這是幾層的網路？**

$W^{[1]}\in\mathbb{R}^{5\times10}$、$W^{[2]}\in\mathbb{R}^{5\times5}$、$W^{[3]}\in\mathbb{R}^{3\times5}$。參數量是 $(50+5)+(25+5)+(15+3)=103$。三次矩陣乘法，所以是三層。判準：每個矩陣的行數要等於前一層的輸出維度。

**4. 為什麼殘差區塊的輸入與輸出維度必須相同？如果想在網路中途把維度從 512 換成 256，能直接用課堂定義的殘差區塊嗎？**

因為定義裡有 $z+\sigma(\cdots)$，兩個向量維度不同就不能相加。不能直接用。課堂描述的殘差網路把換維度的工作放在殘差區塊之外，開頭與結尾各用一次矩陣乘法；中途要換也可以比照辦理，在兩組殘差區塊中間插一個 $\text{MM}$，其中 $W\in\mathbb{R}^{256\times512}$（中途換維度是本文延伸的情境）。

**5. $z=(1,3)$。算 $\text{LN-S}(z)$ 與 $\gamma=1$ 的 $\text{RMSNorm}(z)$。把每個座標都加 10 變成 $(11,13)$ 之後，哪一個的輸出不變？**

$\hat\mu=2$、$\hat\sigma=1$，$\text{LN-S}(z)=(-1,1)$。RMSNorm：平方的平均是 $(1+9)/2=5$，$\sqrt5\approx2.236$，輸出約 $(0.447,1.342)$。加 10 之後，LN-S 的平均變成 12、標準差仍是 1，輸出還是 $(-1,1)$；RMSNorm 變成 $(11,13)/\sqrt{145}\approx(0.914,1.080)$，變了。這一題要看出兩者的差別只在有沒有減平均：兩者對放大縮小都不變，只有 LayerNorm 對整體平移也不變。（平移這部分是本文延伸的練習，課堂只講了尺度。）

## 對應閱讀

主講義 `main_notes.pdf` 第 7 章 Deep learning：

- **7.1 Supervised learning with non-linear models**（第 80–83 頁）：對應本堂前半。講義多了二元分類一段，課堂跳過；平方 loss 有係數 $\frac12$；SGD 與小批次 SGD 寫成 Algorithm 1 與 2，步長記作 $\alpha$。
- **7.2 Neural networks**（第 84–93 頁）：單一神經元、疊神經元、兩層全連接、向量化、多層、其他激勵函數。
- **7.3 Modules in Modern Neural Networks**（第 93–99 頁）：MM 與 MLP 的模組寫法、殘差連接、layer normalization 與尺度不變性、RMSNorm、卷積層。

課堂有講、講義第 7 章沒有或寫得很簡略的部分：交叉熵名稱的由來、為什麼用 SGD 的三個理由、區域極小值與高維 loss 地形的整段問答、殘差連接的動機故事。這些主要得從錄影得到。平方誤差與高斯概似的推導不在第 7 章，講義放在線性迴歸那一章，本系列寫在[第 3 堂](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression)。

講義有、課堂沒講到的部分，建議自己補讀：

- **為什麼激勵函數不能是恆等函數**（第 91–92 頁）。若 $\sigma(z)=z$ 且偏差為 0，兩層網路是 $W^{[2]}W^{[1]}x=\tilde Wx$，疊再多層都只是一個線性模型。
- **與 kernel 方法的關聯**（第 92–93 頁）。把最後一層之前的部分看成學出來的特徵映射 $\phi_\beta(x)$，整個網路就是在這組特徵上做線性模型，差別是特徵也一起被訓練。
- **卷積的完整定義**（第 97–99 頁）：一維卷積、多通道與二維卷積的參數量。
- **batch normalization 與 group normalization**（第 96 頁），講義只各提一句。

7.4 節的反向傳播與 7.5 節的跨樣本向量化是下一堂的範圍。

**系列導覽**：上一堂 [第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)｜下一堂 [第 8 堂：反向傳播](/posts/ai/2026-10-12-stanford-cs229-lecture-08-backpropagation)

## 課程影片來源

原始影片：[Stanford CS229 Machine Learning | Spring 2026 | Lecture 7: Neural Networks 1 (Architecture)](https://www.youtube.com/watch?v=fRM41w9jzQo)

- [Stanford CS229 Machine Learning｜Spring 2026 播放清單（Stanford Online，17 支）](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 課程官網](https://cs229.stanford.edu/)
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

查核日期：2026-10-12。

內容核對：已依字幕核對（2026-10-12）：全文依這支錄影的英文字幕（約 80 分鐘）逐段對照，各節標出的時間區段取自字幕的段落時間戳；沒有看板書畫面，公式的完整寫法取自主講義第 7 章，課堂與講義不一致的地方已在文中標出。

## 參考資料

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 7: Neural Networks 1 (Architecture)](https://www.youtube.com/watch?v=fRM41w9jzQo)：本文的主要底本，課堂說法與引句都出自這支錄影的英文字幕。
- [CS229 主講義 main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)：第 7 章 7.1–7.3 節（第 80–99 頁），用來補板書上的公式、記號與頁碼。
- [CS229 課程官網](https://cs229.stanford.edu/)：課程與講義的官方入口。
- [Stanford CS229 導讀：課程總覽](/posts/ai/2026-08-21-stanford-cs229-machine-learning)：本系列的總覽與自學路線。
