---
title: "驗證：留一份資料來選模型｜台大林軒田 機器學習基石 第 15 堂"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, validation, model-selection, cross-validation]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 15
tldr: "用 E_in 選模型一定偏向最複雜的那個，用 E_test 選又拿不到測試資料。這堂課從手上的 N 筆切出 K 筆當驗證集，得到 E_out(g_m*) ≤ E_out(g⁻_m*) ≤ E_val(g⁻_m*) + O(√(log M / K))，說明選完為什麼要用全部資料重訓、K 為什麼取 N/5；再把 K 推到 1 得到幾乎無偏的 leave-one-out，最後用 5-fold 或 10-fold 交叉驗證把計算量降回可行。"
description: "台大林軒田機器學習基石第 15 堂 Validation 導讀：模型選擇問題、E_in／E_test／E_val 的比較、驗證集大小 K 的兩難、leave-one-out 幾乎無偏的證明、V-fold 交叉驗證，並用六筆資料把四種選法各手算一遍。"
draft: false
glossary:
  - term: "模型選擇"
    aliases: ["model selection"]
    definition: "手上有 M 組假說集合與演算法的搭配，要挑出一組，讓它在資料上學到的 g 有低的 E_out。"
    context: "基石第 15 堂的主問題；講義說它可以算是機器學習最重要的實務問題。"
  - term: "驗證集"
    aliases: ["validation set", "D_val"]
    definition: "從手上的資料 D 隨機留下來、不交給演算法訓練的 K 筆資料，用來模擬測試資料並在候選模型之間做選擇。"
    context: "基石第 15 堂用它算 E_val，取代危險的 E_in 與拿不到的 E_test。"
  - term: "leave-one-out 交叉驗證"
    aliases: ["leave-one-out cross validation", "LOOCV", "E_loocv"]
    definition: "每次只留一筆資料當驗證、其餘 N−1 筆訓練，輪完 N 次後把 N 個誤差平均。它的期望值等於用 N−1 筆資料訓練時的平均 E_out。"
    context: "基石第 15 堂把驗證集大小推到 K = 1 的極端情形。"
  - term: "V-fold 交叉驗證"
    aliases: ["V-fold cross validation", "E_cv", "V 折交叉驗證"]
    definition: "把資料隨機切成 V 等份，輪流拿一份驗證、其餘 V−1 份訓練，再把 V 個驗證誤差平均。"
    context: "基石第 15 堂建議實務上用 5-fold 或 10-fold，不必做到 leave-one-out。"
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/22 到 22/22），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的基石第 15 堂。講義第 1 頁的 Roadmap 把基石分成四個問題，這堂屬於第四個 How Can Machines Learn Better?。上一堂[基石第 14 堂：正則化](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)在同一頁上只剩一行：最小化 augmented error，加上去的正則化項會限制模型複雜度。那一堂留下一個沒回答的問題：正則化的強度 $\lambda$ 要多大，看的是雜訊有多少，可是雜訊多少事先不知道。這堂的驗證（validation）就是用來做這類選擇的工具。

先備有三樣：[基石第 4 堂](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)有限個假說的 Hoeffding 不等式、[基石第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的線性迴歸與學習曲線、[基石第 12 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)的多項式轉換。期望值的線性性質會用到一次；本文自擬的驗算另外用到「兩個獨立的隨機變數相減，變異數相加」。

讀完之後，你應該能說明為什麼 $E_{\text{in}}$ 與 $E_{\text{test}}$ 都不能拿來選模型，寫出驗證的完整流程與它的保證，自己推一遍 leave-one-out 的期望值為什麼等於 $\overline{E_{\text{out}}}(N-1)$，並對一組小資料手算 $E_{\text{val}}$、$E_{\text{loocv}}$ 與 $E_{\text{cv}}$。

## 這麼多種組合，憑什麼挑：模型選擇問題

```youtube
url: https://www.youtube.com/watch?v=BRLGPnrcel8
title: Validation :: Model Selection Problem @ Machine Learning Foundations (機器學習基石)
```

（影片 00:18–01:14 複習上一堂，01:14–03:20 是組合表，03:20–06:17 定義模型選擇問題，06:17–09:57 談用 $E_{\text{in}}$ 選，09:57–12:40 談用 $E_{\text{test}}$ 選，12:40–15:06 引出驗證資料，之後是 Fun Time。）

### 選擇多到要用乘的

講義第 2 頁把前面十四堂教過的東西排成一張表。光是二元分類，就有六件事要決定：

| 要決定的事 | 講義列的選項 |
|---|---|
| 演算法 $\mathcal{A}$ | PLA、pocket、linear regression、logistic regression |
| 迭代次數 $T$ | 100、1000、10000 |
| 每一步走多大 $\eta$ | 1、0.01、0.0001 |
| 特徵轉換 $\boldsymbol{\Phi}$ | linear、quadratic、poly-10、Legendre-poly-10 |
| 正則化項 $\Omega(\mathbf{w})$ | L2、L1、symmetry regularizer |
| 正則化強度 $\lambda$ | 0、0.01、1 |

表上每兩列之間畫了一個乘號。本文把它乘出來：$4 \times 3 \times 3 \times 4 \times 3 \times 3 = 1296$ 種組合，而且每一列都還能再加選項。課堂上的說法是，教的方法愈多，要做的選擇就愈多，而且這些選擇是組合起來的。每個人都有自己最喜歡的組合，就像有最喜歡吃的東西；但永遠用同一種，不會在所有的資料上都表現好。講義頁尾也是這句話：除了你最喜歡的組合，可能得試試別的，才拿得到好的 $g$。

### 把問題寫清楚

第 3 頁給了正式的定義，叫模型選擇問題（model selection problem）：

- **給定：** $M$ 個模型 $\mathcal{H}_1, \mathcal{H}_2, \dots, \mathcal{H}_M$，各有對應的演算法 $\mathcal{A}_1, \mathcal{A}_2, \dots, \mathcal{A}_M$。
- **目標：** 選出 $\mathcal{H}_{m^*}$，讓 $g_{m^*} = \mathcal{A}_{m^*}(\mathcal{D})$ 的 $E_{\text{out}}(g_{m^*})$ 低。
- **困難：** $E_{\text{out}}$ 算不出來，因為 $P(\mathbf{x})$ 與 $P(y \mid \mathbf{x})$ 未知。講義加了一句 as always。

這裡的「模型」指的是一組假說集合加上在它上面跑的演算法，上面那張表的每一種組合都算一個。$m^*$ 上的星號代表被選中的那一個；課堂上舉的例子是有 100 種組合，從裡面選出第 37 個，後面整堂課都用「37 號」來稱呼被選中的模型。

講義說這可以算是機器學習最重要的實務問題。課堂上的理由是：實務上不可能靠單一模型、單一演算法走天下，一定得做選擇。

### 用眼睛挑不行

第 3 頁上方放了兩張圖，問你喜歡哪一個：左邊 $\mathcal{H}_1$ 是一條直線，分錯了幾個點；右邊 $\mathcal{H}_2$ 是彎曲的邊界，一個點都沒分錯。頁尾自問自答：用看的選？不行，記得第 12 堂嗎。

課堂上把[基石第 12 堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)講過的兩個理由重說了一次。第一，資料的維度一高就畫不出來，沒辦法用看的。第二，用眼睛做選擇，你腦袋裡那個強大的模型、它的 VC 維度也要算進代價裡，不見得划算。

### 用訓練誤差挑：永遠選到最複雜的

手上只有資料 $\mathcal{D}$，最直接的做法是每個模型都跑一次，挑 $E_{\text{in}}$ 最小的（第 4 頁）：

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{in}}(\mathcal{A}_m(\mathcal{D}))\big)
$$

講義指出兩個問題。

**第一個問題：結果事先就知道了。** 講義寫 $\boldsymbol{\Phi}_{1126}$ 永遠比 $\boldsymbol{\Phi}_1$ 受歡迎，$\lambda = 0$ 永遠比 $\lambda = 0.1$ 受歡迎。原因是這兩組選項之間有包含關係。高次轉換的假說集合包含低次的，在比較大的集合裡找 $E_{\text{in}}$ 最小的假說，結果不會比在小集合裡找的差。$\lambda = 0$ 是直接最小化 $E_{\text{in}}$，$\lambda > 0$ 最小化的是 $E_{\text{in}}$ 加上正則化項，後者得到的 $E_{\text{in}}$ 不可能比前者低。課堂上說得很白：照這樣選，上一堂的正則化就都不用看了，直接把 $E_{\text{in}}$ 做到最小就好，這可能讓你陷入過擬合的危險。

**第二個問題：付出的複雜度代價變大。** 就算候選之間沒有包含關係也一樣。假設只有兩個模型，$\mathcal{A}_1$ 在 $\mathcal{H}_1$ 裡找 $E_{\text{in}}$ 最小的假說，$\mathcal{A}_2$ 在 $\mathcal{H}_2$ 裡找 $E_{\text{in}}$ 最小的假說，再從兩個裡面挑 $E_{\text{in}}$ 小的。兩個集合各自的最小值再取比較小的，就是聯集上的最小值：

$$
\min\Big(\min_{h \in \mathcal{H}_1} E_{\text{in}}(h),\ \min_{h \in \mathcal{H}_2} E_{\text{in}}(h)\Big) = \min_{h \in \mathcal{H}_1 \cup \mathcal{H}_2} E_{\text{in}}(h)
$$

所以「模型選擇加學習」整套流程，實際上是在 $\mathcal{H}_1 \cup \mathcal{H}_2$ 裡最小化 $E_{\text{in}}$，付的是 $d_{\text{VC}}(\mathcal{H}_1 \cup \mathcal{H}_2)$ 的代價，泛化可能變差。課堂上的比喻是兩個班：每個演算法從自己班上選出 $E_{\text{in}}$ 最小的學生，模型選擇再讓兩個班的第一名比一場，整體看來就是在兩個班合起來的學生裡選一個最好的。

講義的結論是 selecting by $E_{\text{in}}$ is dangerous。

### 六筆資料：訓練誤差會選誰

以下是本文自擬的例子，不在講義上，後面三節會繼續用它。資料是六筆一維的迴歸資料，誤差用平方誤差：

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $x_n$ | 0 | 1 | 2 | 3 | 4 | 5 |
| $y_n$ | 1 | 1 | 2.5 | 3 | 3 | 3 |

這六筆是本文用 $f(x) = 1 + 0.5x$ 加上手選的雜訊 $(0, -0.5, +0.5, +0.5, 0, -0.5)$ 編出來的，所以正確答案是一條直線。光看 $y$ 的數字，前面在爬、後面持平，很容易覺得該用一條會彎的曲線。

候選模型有三個，都用[基石第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)的最小平方法訓練：常數 $h(x) = w_0$、直線 $h(x) = w_0 + w_1 x$、二次曲線 $h(x) = w_0 + w_1 x + w_2 x^2$。三者一個包一個。用全部六筆訓練的結果：

| 模型 | 用全部六筆訓練出的 $g$ | $E_{\text{in}}$ |
|---|---|---|
| 常數 | $2.25$ | $13/16 \approx 0.8125$ |
| 直線 | $1.0714 + 0.4714x$ | $23/140 \approx 0.1643$ |
| 二次 | $0.7143 + 1.0071x - 0.1071x^2$ | $13/140 \approx 0.0929$ |

常數模型的解就是六個 $y$ 的平均 $13.5/6 = 2.25$，$E_{\text{in}}$ 是 $\frac{1}{6}(1.25^2 + 1.25^2 + 0.25^2 + 0.75^2 + 0.75^2 + 0.75^2) = 4.875/6 = 0.8125$。另外兩個照最小平方法解，篇末附了一小段 Python 可以重算。

$E_{\text{in}}$ 由上往下愈來愈小，照 $E_{\text{in}}$ 選就是二次曲線。這個結果不需要看資料就能預測，因為二次模型包含直線、直線包含常數；如果候選裡還有五次多項式，它會穿過全部六個點，$E_{\text{in}} = 0$，被選中的就是它。

### 用測試誤差挑：保證很好，資料拿不到

換一個想法（第 5 頁）：去找一份沒用過的測試資料 $\mathcal{D}_{\text{test}}$，看每個模型學到的 $g_m$ 在上面的表現，挑 $E_{\text{test}}$ 最小的。

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{test}}(\mathcal{A}_m(\mathcal{D}))\big)
$$

這樣選有理論保證。$g_1, \dots, g_M$ 在看到 $\mathcal{D}_{\text{test}}$ 之前就已經固定了，所以這是在 $M$ 個固定的假說裡選一個，適用[基石第 4 堂](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)有限個假說的 Hoeffding 不等式（講義稱為 finite-bin Hoeffding）：

$$
E_{\text{out}}(g_{m^*}) \le E_{\text{test}}(g_{m^*}) + O\bigg(\sqrt{\frac{\log M}{N_{\text{test}}}}\bigg)
$$

講義的評語是 yes! strong guarantee。課堂上拿 100 個模型當例子：取 $\log$、開根號，還要除以測試資料的筆數，是很小的代價，不像 $E_{\text{in}}$ 那樣要付整個聯集的模型複雜度。這個式子怎麼來的，「留 K 筆當驗證集」那一節會把它推一遍。

問題在 $\mathcal{D}_{\text{test}}$ 在哪裡。講義寫的是 your boss's safe（老闆的保險箱），課堂上說的是鎖在老闆的櫃子裡。課堂上的比喻是老師的考卷：考前就把考卷發給同學帶回去寫，考出來的分數就不準了。真的拿得到測試資料，多半是偷出來的，課堂上說這是自欺欺人。講義的結論是 selecting by $E_{\text{test}}$ is infeasible and cheating。

### 折衷：從手上的資料留一塊

第 6 頁把兩種做法並排：

| | $E_{\text{in}}$ | $E_{\text{test}}$ | $E_{\text{val}}$ |
|---|---|---|---|
| 用哪份資料算 | $\mathcal{D}$ | $\mathcal{D}_{\text{test}}$ | $\mathcal{D}_{\text{val}} \subset \mathcal{D}$ |
| 拿得到嗎 | 在手上 | 在老闆的保險箱裡 | 在手上 |
| 乾淨嗎 | 被污染：$\mathcal{A}_m$ 已經用 $\mathcal{D}$ 選出 $g_m$ | 乾淨：之前沒被用來做任何選擇 | 乾淨，前提是 $\mathcal{A}_m$ 沒用過 $\mathcal{D}_{\text{val}}$ |

「污染」是這堂課的關鍵字。$\mathcal{D}$ 已經被每個演算法用來決定 $g_1, g_2, \dots$，再用同一份資料在它們之間做選擇，就是重複使用。$\mathcal{D}_{\text{test}}$ 像一份新出的考題，能乾淨地測出程度。

中間那條路是從手上的資料留一塊下來，先鎖著不用，等要做選擇時才拿出來，算出來的誤差叫 $E_{\text{val}}$。講義把這稱為 legal cheating（合法的作弊）。課堂上的比喻是寫參考書：不要每一題都做，留一些題目，考前拿來測自己。

### Fun Time：第一個權重的正負各一班

**題目（第 7 頁）：** 輸入空間 $\mathcal{X} = \mathbb{R}^d$。考慮兩個假說集合：$\mathcal{H}_+$ 是所有 $w_1 \ge 0$ 的感知器，$\mathcal{H}_-$ 是所有 $w_1 \le 0$ 的感知器。$g_+$ 與 $g_-$ 分別是兩個集合裡 $E_{\text{in}}$ 最小的假說。下列哪一項正確？

1. 如果 $E_{\text{in}}(g_+) < E_{\text{in}}(g_-)$，那麼 $g_+$ 是 $\mathbb{R}^d$ 上所有感知器裡 $E_{\text{in}}$ 最小的。
2. 如果 $E_{\text{test}}(g_+) < E_{\text{test}}(g_-)$，那麼 $g_+$ 是 $\mathbb{R}^d$ 上所有感知器裡 $E_{\text{test}}$ 最小的。
3. 這兩個假說集合沒有交集。
4. 以上皆非。

**答案：1。** 任何感知器的 $w_1$ 不是大於等於 0 就是小於等於 0，所以 $\mathcal{H}_+ \cup \mathcal{H}_-$ 是全部的感知器。套用剛才那條式子：兩個集合各自的最小 $E_{\text{in}}$ 再取小的，就是聯集上的最小 $E_{\text{in}}$。$g_+$ 的比較小，它就是所有感知器裡 $E_{\text{in}}$ 最小的。這題其實是把第 4 頁的第二個問題換個樣子再問一次。

選項 2 錯在 $g_+$ 與 $g_-$ 是照 $E_{\text{in}}$ 挑出來的。比較它們兩個的 $E_{\text{test}}$，只知道兩個之中誰好，其他感知器的 $E_{\text{test}}$ 可能更低。選項 3 講義的解答有說明：$w_1 = 0$ 的感知器同時屬於兩邊，兩個集合有交集。

## 留 K 筆當驗證集：保證是什麼、選完為什麼要重訓、K 取多大

```youtube
url: https://www.youtube.com/watch?v=RvkCaAwRP8A
title: Validation :: Validation @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–04:01 是驗證集的切法與保證，04:01–07:36 是選模型的流程與重訓，07:36–09:38 看實驗圖，09:38–11:59 談 $K$ 的兩難，之後是經驗值與 Fun Time。）

### 切法與記號

第 8 頁把 $\mathcal{D}$ 切成兩塊：

$$
\underbrace{\mathcal{D}}_{\text{size } N} \ \rightarrow\ \underbrace{\mathcal{D}_{\text{train}}}_{\text{size } N-K} \ \cup\ \underbrace{\mathcal{D}_{\text{val}}}_{\text{size } K}
$$

| | 原本的做法 | 驗證的做法 |
|---|---|---|
| 交給演算法的資料 | $\mathcal{D}$（$N$ 筆） | $\mathcal{D}_{\text{train}}$（$N-K$ 筆） |
| 得到的假說 | $g_m = \mathcal{A}_m(\mathcal{D})$ | $g_m^- = \mathcal{A}_m(\mathcal{D}_{\text{train}})$ |
| 拿來選模型的誤差 | $E_{\text{in}}$，在 $\mathcal{D}$ 上算 | $E_{\text{val}}$，在 $\mathcal{D}_{\text{val}}$ 上算 |

$\mathcal{D}_{\text{val}}$ 叫驗證集（validation set），講義說它是測試資料在手上的模擬（on-hand simulation of test set）。$g_m^-$ 上面那個減號，課堂上解釋是提醒它用了比較少的資料：原本有 1000 筆、留 100 筆驗證，演算法就只看到 900 筆，學出來的假說可能跟用 1000 筆的不一樣。

切的時候有兩個規矩，各自保證一件事。

- **隨機抽。** $\mathcal{D}$ 本來就是從 $P(\mathbf{x}, y)$ 獨立同分布（iid）抽出來的，從裡面均勻隨機抽 $K$ 筆，$\mathcal{D}_{\text{val}}$ 也還是 iid 來自同一個 $P$。這把 $E_{\text{val}}$ 和 $E_{\text{out}}$ 接了起來。
- **演算法只看 $\mathcal{D}_{\text{train}}$。** 這保證 $\mathcal{D}_{\text{val}}$ 是乾淨的。

課堂上把這個安排講成角色分工：原本 $\mathcal{D}$ 一個人扮兩個角色，既要拿去訓練出 $g$，又要拿來算 $E_{\text{in}}$ 做選擇，資料因此被污染。現在兩個角色分給兩塊資料，一塊負責訓練出 $g^-$，一塊負責回報 $g^-$ 表現得多好。

### 保證從哪裡來

講義在第 8 頁直接寫出結論：

$$
E_{\text{out}}(g_m^-) \le E_{\text{val}}(g_m^-) + O\bigg(\sqrt{\frac{\log M}{K}}\bigg)
$$

課堂上只說這跟剛才用 $E_{\text{test}}$ 的情形一樣，是自己切一小塊出來當測試資料，用的是有限個假說的 Hoeffding。下面的推導是本文補的，用的全是[基石第 4 堂](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning)的結果，適用於 0/1 這類有界的誤差。

**第一步：單一個假說。** 先把 $\mathcal{D}_{\text{train}}$ 固定下來。$g_m^-$ 只由 $\mathcal{D}_{\text{train}}$ 決定，對 $\mathcal{D}_{\text{val}}$ 來說它是一個事先定好的假說。$E_{\text{val}}(g_m^-)$ 是它在 $K$ 筆 iid 資料上的平均誤差，這 $K$ 筆每一筆的誤差期望值都是 $E_{\text{out}}(g_m^-)$。這正是 Hoeffding 的情境，只是筆數從 $N$ 換成 $K$：

$$
P\Big[\big\lvert E_{\text{val}}(g_m^-) - E_{\text{out}}(g_m^-)\big\rvert > \epsilon\Big] \le 2\exp(-2\epsilon^2 K)
$$

**第二步：$M$ 個假說一起。** 我們要的是「不管最後選到誰都成立」，所以要求 $M$ 個假說沒有一個出事。任何一個出事的機率，不會超過各自出事的機率加起來：

$$
P\Big[\text{some } m:\ \big\lvert E_{\text{val}}(g_m^-) - E_{\text{out}}(g_m^-)\big\rvert > \epsilon\Big] \le 2M\exp(-2\epsilon^2 K)
$$

**第三步：解出 $\epsilon$。** 令右邊等於 $\delta$，取對數移項：

$$
2M\exp(-2\epsilon^2 K) = \delta \quad\Longrightarrow\quad \epsilon = \sqrt{\frac{1}{2K}\ln\frac{2M}{\delta}}
$$

所以至少有 $1 - \delta$ 的機率，每一個 $m$ 都滿足 $E_{\text{out}}(g_m^-) \le E_{\text{val}}(g_m^-) + \sqrt{\frac{1}{2K}\ln\frac{2M}{\delta}}$，被選中的 $m^*$ 當然也滿足。把常數收進 $O(\cdot)$ 就是講義的式子。$E_{\text{test}}$ 那條保證是同一個推導，把 $K$ 換成 $N_{\text{test}}$。

代幾個數字看看，取 $M = 100$、$\delta = 0.05$：

| 驗證集大小 $K$ | $\sqrt{\frac{1}{2K}\ln\frac{2M}{\delta}}$ |
|---|---|
| 200 | 0.144 |
| 20 | 0.455 |
| 1 | 2.04 |

$K = 200$ 時誤差範圍是 14 個百分點左右；$K = 1$ 時算出來超過 1，對 0/1 誤差來說等於什麼都沒保證。$M$ 的影響小得多：$K = 200$ 時把 $M$ 從 100 換成前面組合表乘出來的 1296，數字只從 0.144 變成 0.165，因為 $M$ 在對數裡面。

這個推導成立的關鍵在第一步：$g_m^-$ 不能跟 $\mathcal{D}_{\text{val}}$ 有關。只要演算法偷看過驗證集，$g_m^-$ 就不是事先定好的假說，Hoeffding 用不上，這就是「乾淨」在數學上的意思。

### 選模型的流程，以及最後那次重訓

第 9 頁把選擇的式子換成 $E_{\text{val}}$：

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{val}}(\mathcal{A}_m(\mathcal{D}_{\text{train}}))\big)
$$

同一頁右邊有一張流程圖，內容如下：

1. 把 $\mathcal{D}$ 切成 $\mathcal{D}_{\text{train}}$ 與 $\mathcal{D}_{\text{val}}$。
2. $\mathcal{D}_{\text{train}}$ 分別送進 $\mathcal{H}_1, \mathcal{H}_2, \dots, \mathcal{H}_M$，得到 $g_1^-, g_2^-, \dots, g_M^-$。
3. 用 $\mathcal{D}_{\text{val}}$ 算每個 $g_m^-$ 的驗證誤差 $E_1, E_2, \dots, E_M$。
4. 挑最小的，得到 $(\mathcal{H}_{m^*}, E_{m^*})$。
5. 把完整的 $\mathcal{D}$ 送進 $\mathcal{H}_{m^*}$ 重新訓練，輸出 $g_{m^*}$。

第 5 步是容易漏掉的。選出 37 號模型之後，回傳的是用全部資料重訓的 $g_{37}$，不是選模型時用的 $g_{37}^-$。理由寫成一條不等式：

$$
E_{\text{out}}\big(\underbrace{g_{m^*}}_{\mathcal{A}_{m^*}(\mathcal{D})}\big) \le E_{\text{out}}\big(\underbrace{g_{m^*}^-}_{\mathcal{A}_{m^*}(\mathcal{D}_{\text{train}})}\big)
$$

講義在旁邊寫的是 learning curve, remember?：資料愈多，$E_{\text{out}}$ 通常愈低，這是[基石第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)與[基石第 13 堂](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)看過的學習曲線。

這條不等式和「保證從哪裡來」推出的那條地位不同。講義把它叫 heuristic gain，印成灰色。課堂上特別交代：這一段不是理論上的保證，比較像實務上的經驗；加上一堆限制條件或許證得出來，但這堂課的重點是把手上的資料盡量用完。兩條接起來就是第 9 頁頁尾的式子：

$$
E_{\text{out}}(g_{m^*}) \le E_{\text{out}}(g_{m^*}^-) \le E_{\text{val}}(g_{m^*}^-) + O\bigg(\sqrt{\frac{\log M}{K}}\bigg)
$$

左邊的不等號靠經驗，右邊的靠 Hoeffding。

### 講義上的實驗：四條線

第 10 頁用驗證在五次多項式 $\mathcal{H}_{\boldsymbol{\Phi}_5}$ 與十次多項式 $\mathcal{H}_{\boldsymbol{\Phi}_{10}}$ 之間做選擇。圖的橫軸是驗證集大小 $K$（刻度標 5、15、25，曲線從 5 的左邊就開始畫），縱軸是期望的 $E_{\text{out}}$（刻度標 0.48、0.52、0.56），愈低愈好。圖上有四條線：

| 線 | 做法 | 在圖上的樣子 |
|---|---|---|
| in-sample（黑色水平實線） | 用 $E_{\text{in}}$ 選 | 不隨 $K$ 變，高度大約 0.545 |
| optimal（黑色虛線，右邊對應的說明文字印成灰色） | 作弊，用 $E_{\text{test}}$ 選 | 最低，大約 0.47，在 0.48 的刻度下方 |
| sub-g（紅線） | 用 $E_{\text{val}}$ 選，回傳 $g_{m^*}^-$ | 最左邊在黑線下方（大約 0.535），之後一路往上，$K$ 大約 8 到 9 時穿過黑線，$K$ 大約 11 時已經超出圖的上緣 0.56 |
| full-g（藍線） | 用 $E_{\text{val}}$ 選，回傳 $g_{m^*}$ | 和紅線從差不多的高度出發，之後一直在黑線與紅線下方；最低點大約在 $K = 17$（大約 0.52），到 $K = 25$ 略微回升到大約 0.53 |

上表「在圖上的樣子」那一欄的數值都是本文從圖上目測的大約值，講義沒有印出數字。課堂上逐條說明。用 $E_{\text{in}}$ 選，每次都會選到十次多項式，因為它的 $E_{\text{in}}$ 一定比較小，所以是一條水平線。這條線畫成虛線、說明用灰色，表示實際上做不到，要作弊才做得到。藍線始終比紅線低，印證 $g$ 比 $g^-$ 好；藍線也比黑線低，表示用驗證來選確實比用 $E_{\text{in}}$ 選安全。

頁尾留了一個問題：為什麼 sub-g 有時候比 in-sample 還差？講義沒寫答案，課堂上回答了：$K$ 變大，$\mathcal{D}_{\text{train}}$ 就變小，$g_m^-$ 是用比較少的資料學出來的，表現比較差。就算在這些 $g_m^-$ 裡選對了模型，回傳的東西還是可能輸給用了全部資料的 $g$，即使後者是照 $E_{\text{in}}$ 選的。

### K 的兩難

第 11 頁把驗證的推理寫成一條近似鏈：

$$
E_{\text{out}}(g) \underset{\text{small } K}{\approx} E_{\text{out}}(g^-) \underset{\text{large } K}{\approx} E_{\text{val}}(g^-)
$$

我們是用最右邊的 $E_{\text{val}}(g^-)$ 做選擇，心裡想選到的是最左邊 $E_{\text{out}}(g)$ 最好的那個。兩個近似要的 $K$ 方向相反：

- **$K$ 大：** 每個 $E_{\text{val}}$ 都接近 $E_{\text{out}}$（右邊的近似好），但所有的 $g_m^-$ 都比 $g_m$ 差很多（左邊的近似壞）。這是圖上右半邊紅線與藍線分得很開的地方。
- **$K$ 小：** 每個 $g_m^-$ 都接近 $g_m$（左邊好），但 $E_{\text{val}}$ 離 $E_{\text{out}}$ 很遠（右邊壞）。「保證從哪裡來」那張表的 $K = 1$ 就是這種情形。

講義給的經驗值（practical rule of thumb）是

$$
K = \frac{N}{5}
$$

課堂上補充，也有人用十分之一或二十分之一，五分之一是很常見的數字。

### 六筆資料：切一次驗證集

回到本文自擬的六筆資料。$N/5 = 1.2$ 不是整數，這裡取 $K = 2$。假設隨機抽到第 2 筆與第 5 筆當驗證集：

$$
\mathcal{D}_{\text{val}} = \{(1, 1),\ (4, 3)\},\qquad \mathcal{D}_{\text{train}} = \{(0, 1),\ (2, 2.5),\ (3, 3),\ (5, 3)\}
$$

**常數模型。** $g_0^-$ 是訓練集四個 $y$ 的平均：$(1 + 2.5 + 3 + 3)/4 = 2.375$。在驗證集上，$(1 - 2.375)^2 = 1.8906$、$(3 - 2.375)^2 = 0.3906$，平均 $E_{\text{val}} = 1.1406$。

**直線模型。** 一維的最小平方法就是斜率公式。訓練集的 $\bar{x} = 2.5$、$\bar{y} = 2.375$：

$$
w_1 = \frac{\sum (x_n - \bar{x})(y_n - \bar{y})}{\sum (x_n - \bar{x})^2} = \frac{3.4375 - 0.0625 + 0.3125 + 1.5625}{6.25 + 0.25 + 0.25 + 6.25} = \frac{5.25}{13} \approx 0.4038
$$

$w_0 = \bar{y} - w_1\bar{x} = 2.375 - 0.4038 \times 2.5 = 1.3654$，所以 $g_1^-(x) = 1.3654 + 0.4038x$。它在 $x = 1$ 預測 $1.7692$，誤差平方 $0.5917$；在 $x = 4$ 預測 $2.9808$，誤差平方 $0.0004$。$E_{\text{val}} = 0.2960$。

**二次模型。** 解出來是 $g_2^-(x) = 0.9904 + 1.0288x - 0.125x^2$。它在 $x = 1$ 預測 $1.8942$、在 $x = 4$ 預測 $3.1058$，誤差平方是 $0.7996$ 與 $0.0112$，$E_{\text{val}} = 0.4054$。

| 模型 | 在 $\mathcal{D}_{\text{train}}$ 上的誤差 | $E_{\text{val}}$ |
|---|---|---|
| 常數 | 0.6719 | 1.1406 |
| 直線 | 0.1418 | **0.2960** |
| 二次 | 0.0012 | 0.4054 |

二次模型幾乎穿過訓練集的四個點（誤差 0.0012），到了沒看過的兩筆卻輸給直線。$E_{\text{val}}$ 最小的是直線，被選中的就是直線模型。照流程的第 5 步，用全部六筆重訓，回傳的是前面算過的 $g(x) = 1.0714 + 0.4714x$。

**這個結果代表什麼。** 這份資料是編的，所以可以對答案。假設 $x$ 在 $[0, 5]$ 上均勻分布、雜訊的平均是 0，那麼 $E_{\text{out}}(g)$ 等於 $\frac{1}{5}\int_0^5 (g(x) - f(x))^2\,dx$ 加上雜訊的變異數；後者每個假說都一樣，只要比前者：

| 回傳的假說 | 與 $f$ 的平均平方差距 |
|---|---|
| 常數，全部六筆 | 0.5208 |
| 直線，全部六筆（$g$） | 0.0017 |
| 二次，全部六筆 | 0.0495 |
| 直線，只用四筆（$g^-$） | 0.0349 |

三個模型裡直線離 $f$ 最近，$E_{\text{val}}$ 選對了，$E_{\text{in}}$ 選到的二次曲線差了將近 30 倍。最後兩列對照的是重訓：同樣是直線，用六筆的 $g$ 比用四筆的 $g^-$ 近得多，這個例子裡 $E_{\text{out}}(g_{m^*}) \le E_{\text{out}}(g_{m^*}^-)$ 成立。

**換一種切法呢。** 六筆裡留兩筆共有 $\binom{6}{2} = 15$ 種切法，本文全部算過：7 種選到直線，2 種是直線與二次平手（訓練出來的二次項係數剛好是 0），5 種選到二次，1 種選到常數。選到常數的那一種是留下最後兩筆（第 5、6 筆）：訓練集只剩 $x = 0$ 到 $3$ 的四筆，$y$ 一路往上，直線與二次曲線都往右上延伸過頭，三個 $E_{\text{val}}$ 是 1.2656、1.4062、5.0781，常數反而最小。

$K = 2$ 的驗證誤差只是兩個數字的平均，換一種切法結論就可能不同。這是下一節的出發點。

### Fun Time：驗證要花多少時間

**題目（第 12 頁）：** 某個學習模型用 $N$ 筆資料訓練要花 $N^2$ 秒。取 $K = \frac{N}{5}$，對 25 個參數不同的這種模型跑完整個驗證流程、得到最後的 $g_{m^*}$，總共要幾秒？

1. $6N^2$
2. $17N^2$
3. $25N^2$
4. $26N^2$

**答案：2。** 流程裡有兩種訓練。先是 25 個模型各在 $\mathcal{D}_{\text{train}}$ 上訓練一次，$\mathcal{D}_{\text{train}}$ 有 $N - \frac{N}{5} = \frac{4N}{5}$ 筆，每次花 $\big(\frac{4N}{5}\big)^2 = \frac{16}{25}N^2$ 秒，25 次共 $16N^2$ 秒。再來是選中的模型用全部 $N$ 筆重訓一次，$N^2$ 秒。合計 $17N^2$。

$25N^2$ 是 25 個模型各用全部資料訓練一次的時間，也就是照 $E_{\text{in}}$ 選的成本；$26N^2$ 是在那之後又多訓練一次。$6N^2$ 太小，光是第一階段就要 $16N^2$。

課堂上從這題多帶出一件事：$17N^2$ 比 $25N^2$ 小。驗證不見得比較慢，因為訓練 $g_m^-$ 時丟進去的資料比較少。

## 把 K 推到 1：leave-one-out 交叉驗證

```youtube
url: https://www.youtube.com/watch?v=iToz5t0J6WU
title: Validation :: Leave-One-Out Cross Validation @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–03:53 是 $K = 1$ 與 $E_{\text{loocv}}$ 的定義，03:53–07:27 用三個點示範並拿來選模型，07:27–12:57 是理論保證，12:57–15:24 看手寫數字的實驗，之後是 Fun Time。）

### 一筆驗證資料不夠，就輪流當

$K$ 又要大又要小，兩邊很難同時滿足。第 13 頁先看一個極端：$K = 1$。這時 $g^-$ 用了 $N - 1$ 筆，跟 $g$ 幾乎一樣，近似鏈左邊那一段沒問題。麻煩在右邊：只有一筆驗證資料。

假設留下的是第 $n$ 筆。記號上，驗證集是 $\mathcal{D}_{\text{val}}^{(n)} = \{(\mathbf{x}_n, y_n)\}$，用其餘 $N - 1$ 筆訓練出來的假說是 $g_n^-$，驗證誤差只有一項：

$$
E_{\text{val}}^{(n)}(g_n^-) = \text{err}\big(g_n^-(\mathbf{x}_n), y_n\big) = e_n
$$

單獨一個 $e_n$ 說明不了什麼。課堂上的例子是二元分類：$e_n$ 不是 0 就是 1，看不出真正的 $E_{\text{out}}$ 是 32% 還是 27%。講義的辦法是把每一筆都輪流留下來一次，得到 $e_1, e_2, \dots, e_N$，再平均：

$$
E_{\text{loocv}}(\mathcal{H}, \mathcal{A}) = \frac{1}{N}\sum_{n=1}^{N} e_n = \frac{1}{N}\sum_{n=1}^{N} \text{err}\big(g_n^-(\mathbf{x}_n), y_n\big)
$$

這叫 leave-one-out cross validation。課堂上拆開名字解釋：leave-one-out 是留一筆下來當驗證資料；cross（交叉）是指同一筆資料有時候當訓練資料、有時候當驗證資料。

注意 $E_{\text{loocv}}$ 的引數是 $(\mathcal{H}, \mathcal{A})$，不是某一個假說。$N$ 個 $e_n$ 來自 $N$ 個不同的 $g_n^-$，課堂上說，它回報的不是單一個 $g^-$ 好不好，而是這個演算法在這份資料上表現得好不好。我們希望的是 $E_{\text{loocv}}(\mathcal{H}, \mathcal{A}) \approx E_{\text{out}}(g)$。

### 三個點的圖：直線還是常數

第 14 頁用三個點畫了兩排圖。上排是直線模型：每次拿掉一個點，剩下兩個點決定一條直線，$e_n$ 是被拿掉的點到這條線的鉛直距離的平方，三張小圖分別標出 $e_1$、$e_2$、$e_3$。下排是常數模型：兩個點的最佳常數是它們 $y$ 值的平均（課堂上說是兩個點的中間值），$e_n$ 一樣是被拿掉的點到這條水平線的距離平方。

$$
E_{\text{loocv}}(\text{linear}) = \frac{1}{3}(e_1 + e_2 + e_3),\qquad E_{\text{loocv}}(\text{constant}) = \frac{1}{3}(e_1 + e_2 + e_3)
$$

上排第一張圖裡，剩下的兩個點靠得很近、高度不同，連出來的線很陡，被拿掉的點離它很遠。課堂上指出，誤差取了平方，這一項非常大，所以上排的平均比下排高。leave-one-out 在這裡告訴你：只有三個點的時候，用常數就好，直線對這份資料已經太複雜。

講義的圖沒有標數字，本文自擬三個形狀類似的點來算一次：$(0, 0)$、$(3, 1)$、$(4, 3)$。

| 拿掉的點 | 直線：剩下兩點連成的線 | 直線的 $e_n$ | 常數：剩下兩點的平均 | 常數的 $e_n$ |
|---|---|---|---|---|
| $(0, 0)$ | $y = 2x - 5$，在 $x = 0$ 是 $-5$ | $25$ | $2$ | $4$ |
| $(3, 1)$ | $y = \frac{3}{4}x$，在 $x = 3$ 是 $2.25$ | $1.5625$ | $1.5$ | $0.25$ |
| $(4, 3)$ | $y = \frac{1}{3}x$，在 $x = 4$ 是 $\frac{4}{3}$ | $2.7778$ | $0.5$ | $6.25$ |
| 平均 | | $\approx 9.78$ | | $3.5$ |

$E_{\text{loocv}}(\text{linear}) \approx 9.78$，$E_{\text{loocv}}(\text{constant}) = 3.5$，選常數。直線輸在第一列那個 25。

拿它來選模型，就是把「選模型的流程，以及最後那次重訓」裡的 $E_{\text{val}}$ 換成 $E_{\text{loocv}}$（第 14 頁頁尾）：

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{loocv}}(\mathcal{H}_m, \mathcal{A}_m)\big)
$$

選出來之後一樣用全部資料訓練一次，得到 $g_{m^*}$。

### 為什麼說它幾乎無偏

第 15 頁問：$E_{\text{loocv}}(\mathcal{H}, \mathcal{A})$ 能不能告訴我們 $E_{\text{out}}(g)$ 的事？答案是可以，對象是「用 $N - 1$ 筆資料訓練時的平均 $E_{\text{out}}$」。

先說清楚要證什麼。課堂上的講法是：拿一個演算法，對 1000 筆資料做 leave-one-out，再對各式各樣不同的 1000 筆資料都做一次、取平均。這個平均值，會等於把 999 筆資料餵給同一個演算法、得到的 $g^-$ 的 $E_{\text{out}}$ 的平均。後者記成 $\overline{E_{\text{out}}}(N-1)$，也就是學習曲線在 $N - 1$ 那一點的高度。期望值 $\mathcal{E}_{\mathcal{D}}$ 是對所有大小為 $N$ 的資料集取的。

$$
\begin{aligned}
\mathop{\mathcal{E}}_{\mathcal{D}} E_{\text{loocv}}(\mathcal{H}, \mathcal{A}) = \mathop{\mathcal{E}}_{\mathcal{D}} \frac{1}{N}\sum_{n=1}^{N} e_n
&= \frac{1}{N}\sum_{n=1}^{N} \mathop{\mathcal{E}}_{\mathcal{D}} e_n \\
&= \frac{1}{N}\sum_{n=1}^{N} \mathop{\mathcal{E}}_{\mathcal{D}_n} \mathop{\mathcal{E}}_{(\mathbf{x}_n, y_n)} \text{err}\big(g_n^-(\mathbf{x}_n), y_n\big) \\
&= \frac{1}{N}\sum_{n=1}^{N} \mathop{\mathcal{E}}_{\mathcal{D}_n} E_{\text{out}}(g_n^-) \\
&= \frac{1}{N}\sum_{n=1}^{N} \overline{E_{\text{out}}}(N-1) = \overline{E_{\text{out}}}(N-1)
\end{aligned}
$$

講義只列了式子。每一步的理由課堂上都講了，整理如下。

**第一行：** 最左邊的等號只是把 $E_{\text{loocv}}$ 的定義代進去。對齊的那個等號用到的是：期望值是線性的，加總也是線性的，兩者可以交換。

**第二行：** 把 $\mathcal{D}$ 拆成兩部分，被留下的那一筆 $(\mathbf{x}_n, y_n)$，以及其餘 $N - 1$ 筆，記成 $\mathcal{D}_n$。資料是 iid 抽的，這兩部分互相獨立，對 $\mathcal{D}$ 的期望值可以寫成先對 $(\mathbf{x}_n, y_n)$、再對 $\mathcal{D}_n$ 取期望值。同時把 $e_n$ 的定義代進去。

**第三行：** 看裡面那一層。$g_n^-$ 只跟 $\mathcal{D}_n$ 有關，在裡面那一層它是固定的。一個固定的假說，在從 $P$ 抽出來的新資料上的平均誤差，就是 $E_{\text{out}}$ 的定義。課堂上說，這筆資料叫 $(\mathbf{x}_n, y_n)$ 或 $(\mathbf{x}, y)$ 都沒差。本文補充：這一步和「保證從哪裡來」的第一步靠的是同一件事，假說沒看過這筆資料。

**第四行的第一個等號：** $\mathcal{D}_n$ 是 $N - 1$ 筆 iid 資料。對所有這種資料集把 $E_{\text{out}}(g_n^-)$ 平均，就是 $\overline{E_{\text{out}}}(N-1)$ 的定義。這個數跟 $n$ 無關。

**第四行的最後一個等號：** $N$ 個相同的常數取平均，還是它自己。

講義頁尾的結論是：$E_{\text{loocv}}(\mathcal{H}, \mathcal{A})$ 的期望值說出了 $E_{\text{out}}(g^-)$ 的期望值，常被稱為 almost unbiased estimate of $E_{\text{out}}(g)$。「almost」是因為等號右邊是 $N - 1$ 筆的平均表現，我們要的是 $N$ 筆的；課堂上說一個用 999 筆、一個用 1000 筆，幾乎一樣。

本文補充兩個讀這條式子時要留意的地方。第一，它講的是期望值，是對很多份資料集平均之後的事；手上只有一份資料，那一次算出來的 $E_{\text{loocv}}$ 可以離 $\overline{E_{\text{out}}}(N-1)$ 很遠。第二，$N$ 個 $e_n$ 彼此不獨立，因為任兩個 $g_n^-$ 的訓練資料有 $N - 2$ 筆重複，所以不能把 $E_{\text{loocv}}$ 當成 $N$ 筆獨立測試資料的平均、直接套 Hoeffding。

### 用平均值預測驗算一次

以下是本文自擬的驗算，不在講義上。取最簡單的演算法：不看 $\mathbf{x}$，一律用訓練資料 $y$ 的平均值預測，誤差用平方誤差。假設 $y$ 是 iid 抽的，平均 $\mu$、變異數 $\sigma^2$。

**先算 $\overline{E_{\text{out}}}(N)$。** 用 $N$ 筆訓練得到 $\bar{y}_N$，新的一筆 $y$ 跟它獨立，兩者的期望值都是 $\mu$。獨立的隨機變數相減，變異數相加：

$$
\overline{E_{\text{out}}}(N) = \mathcal{E}\big[(y - \bar{y}_N)^2\big] = \sigma^2 + \frac{\sigma^2}{N} = \sigma^2\Big(1 + \frac{1}{N}\Big)
$$

這和[基石第 9 堂](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)線性迴歸的學習曲線 $\text{noise level} \cdot \big(1 + \frac{d+1}{N}\big)$ 在 $d = 0$ 時一致。

**再算 $E_{\text{loocv}}$ 的期望值。** $e_n = (y_n - \bar{y}_{-n})^2$，其中 $\bar{y}_{-n}$ 是其餘 $N - 1$ 筆的平均，跟 $y_n$ 獨立。同樣的算法：

$$
\mathcal{E}[e_n] = \sigma^2 + \frac{\sigma^2}{N-1} = \sigma^2\Big(1 + \frac{1}{N-1}\Big) = \overline{E_{\text{out}}}(N-1)
$$

每個 $e_n$ 的期望值都是這個數，平均之後也是。定理成立，而且看得到「almost」差在哪裡：

| $N$ | $\mathcal{E}[E_{\text{in}}]$ | $\mathcal{E}[E_{\text{loocv}}] = \overline{E_{\text{out}}}(N-1)$ | $\overline{E_{\text{out}}}(N)$ |
|---|---|---|---|
| 3 | $0.667\sigma^2$ | $1.5\sigma^2$ | $1.333\sigma^2$ |
| 1000 | $0.999\sigma^2$ | $1.001001\sigma^2$ | $1.001\sigma^2$ |

$E_{\text{in}}$ 那一欄用的是基石第 9 堂的另一條式子 $\text{noise level} \cdot \big(1 - \frac{d+1}{N}\big)$。$N = 3$ 時 $E_{\text{loocv}}$ 的期望值比真正要的 $\overline{E_{\text{out}}}(3)$ 高了一些，方向是偏悲觀；$E_{\text{in}}$ 則只有一半。$N$ 一大，差距就消失。本文另外用 Python 做了模擬：$N = 3$、$\sigma = 1$，抽 20 萬份資料，$E_{\text{in}}$、$E_{\text{loocv}}$、$E_{\text{out}}(g^-)$、$E_{\text{out}}(g)$ 的平均分別是 0.666、1.499、1.500、1.334，和上表吻合。

### 六筆資料的 leave-one-out

回到六筆資料。每個模型要訓練六次，每次留一筆。以留下第 1 筆 $(0, 1)$ 為例：

- 常數：其餘五個 $y$ 的平均是 $12.5/5 = 2.5$，$e_1 = (1 - 2.5)^2 = 2.25$。
- 直線：其餘五筆的最小平方解是 $1.15 + 0.45x$，在 $x = 0$ 預測 $1.15$，$e_1 = 0.0225$。
- 二次：其餘五筆的解是 $-0.6 + 1.95x - 0.25x^2$，在 $x = 0$ 預測 $-0.6$，$e_1 = 2.56$。

二次曲線為了貼合右邊五個點，往左延伸時掉到 $-0.6$，離真正的 $y_1 = 1$ 很遠。六次都做完：

| 留下的點 | 常數的 $e_n$ | 直線的 $e_n$ | 二次的 $e_n$ |
|---|---|---|---|
| 第 1 筆 $(0, 1)$ | 2.2500 | 0.0225 | 2.5600 |
| 第 2 筆 $(1, 1)$ | 2.2500 | 0.5933 | 0.7861 |
| 第 3 筆 $(2, 2.5)$ | 0.0900 | 0.3517 | 0.1012 |
| 第 4 筆 $(3, 3)$ | 0.8100 | 0.3943 | 0.1322 |
| 第 5 筆 $(4, 3)$ | 0.8100 | 0.0037 | 0.0017 |
| 第 6 筆 $(5, 3)$ | 0.8100 | 0.8100 | 0.1600 |
| $E_{\text{loocv}}$ | 1.1700 | **0.3626** | 0.6235 |

$E_{\text{loocv}}$ 選直線。和切一次驗證集相比，這裡沒有「剛好抽到哪兩筆」的問題，每一筆都當過一次驗證資料。二次模型在中間四筆其實比直線準，它輸在兩端，尤其是第 1 筆。

### 手寫數字的實驗

第 16 頁回到前幾堂用過的手寫數字資料，分辨「是 1」與「不是 1」，原始特徵是平均強度（average intensity）與對稱性（symmetry）兩個。對這兩個特徵做多項式轉換，要決定的是用多少個轉換後的特徵。

左下的圖橫軸是使用的特徵數（刻度標 5、10、15、20，曲線從 5 的左邊開始），縱軸是誤差（刻度標 0.01、0.02、0.03），有三條線。圖上沒有印數值，下面的數字都是本文從圖上目測的大約值：

- **$E_{\text{in}}$（藍）：** 特徵愈多愈低，像階梯一樣一段一段往下，從大約 0.008 降到接近 0。
- **$E_{\text{out}}$（紅）：** 特徵數少的時候比較低（大約 0.014 到 0.017），超過十個左右之後一下子升到大約 0.027。
- **$E_{\text{cv}}$（黑，這裡是 leave-one-out 的結果）：** 最低的地方在特徵數少的那一段（5 個與 7 個附近各碰到大約 0.008），之後跟著紅線升高，而且上下跳動。

課堂上說明，這是實際的資料，所以曲線不像之前那些平均過的圖那麼平滑，但看得出好的特徵數落在中間偏少的地方，不是愈多愈好；黑線跟紅線比較接近。照 $E_{\text{in}}$ 選會選到特徵最多的那個，照 $E_{\text{loocv}}$ 選，課堂上說會選到五個或七個左右。

上排右邊兩張圖是兩種選法得到的分類邊界：select by $E_{\text{in}}$ 的邊界彎彎曲曲，select by $E_{\text{loocv}}$ 的邊界平滑得多。講義的結論是 $E_{\text{loocv}}$ much better than $E_{\text{in}}$。

### Fun Time：1、5、7 三個數

**題目（第 17 頁）：** 三筆資料 $(\mathbf{x}_1, y_1)$、$(\mathbf{x}_2, y_2)$、$(\mathbf{x}_3, y_3)$，其中 $y_1 = 1$、$y_2 = 5$、$y_3 = 7$。某個演算法一律用資料集裡 $y$ 的平均值預測，這是平方誤差下最佳的常數預測。用平方誤差算它的 $E_{\text{loocv}}$，是多少？

1. $0$
2. $\frac{56}{9}$
3. $\frac{60}{9}$
4. $14$

**答案：4。** 每次留一筆，用另外兩筆的平均預測它：

- 留 $y_1 = 1$：另外兩筆平均 $\frac{5+7}{2} = 6$，$e_1 = (1 - 6)^2 = 25$。
- 留 $y_2 = 5$：另外兩筆平均 $\frac{1+7}{2} = 4$，$e_2 = (5 - 4)^2 = 1$。
- 留 $y_3 = 7$：另外兩筆平均 $\frac{1+5}{2} = 3$，$e_3 = (7 - 3)^2 = 16$。

$E_{\text{loocv}} = \frac{25 + 1 + 16}{3} = 14$。課堂上說，這題就是第 14 頁下排那三張圖的計算。

選項 2 的 $\frac{56}{9}$ 是 $E_{\text{in}}$：三筆的平均是 $\frac{13}{3}$，$\frac{1}{3}\big[(1 - \frac{13}{3})^2 + (5 - \frac{13}{3})^2 + (7 - \frac{13}{3})^2\big] = \frac{1}{3} \cdot \frac{168}{9} = \frac{56}{9}$。忘記把被測的那一筆從平均裡拿掉，就會算出它。$E_{\text{loocv}} = 14$ 是 $E_{\text{in}} \approx 6.22$ 的兩倍多，和「用平均值預測驗算一次」表中 $N = 3$ 那一列的方向一致。選項 1 的 0 不可能，三個 $y$ 不一樣，常數怎麼猜都有誤差。選項 3 講義沒有說明來源。本文找到一個對得上的算式：拿三個 $y$ 的中位數 5 當常數預測、在三筆資料上直接算平方誤差，是 $\frac{1}{3}\big[(1-5)^2 + (5-5)^2 + (7-5)^2\big] = \frac{20}{3} = \frac{60}{9}$。這既沒有用平均值，也沒有把被測的那一筆留下來，不是題目問的 $E_{\text{loocv}}$。

本文補充：題目沒給 $\mathbf{x}$，因為常數模型用不到。如果補上 $x = 1, 2, 3$ 再讓直線模型來比，三個 $e_n$ 是 $4$、$1$、$4$，$E_{\text{loocv}}(\text{linear}) = 3$，遠低於常數的 14。這三筆幾乎在一條直線上，leave-one-out 這次選直線。它不會固定偏向簡單的模型，看的是資料。

## 算得起又夠穩的版本：V-fold 交叉驗證

```youtube
url: https://www.youtube.com/watch?v=Y8PaLsYm0Ac
title: Validation :: V-Fold Cross Validation @ Machine Learning Foundations (機器學習基石)
```

（影片 00:00–02:28 是 leave-one-out 的兩個缺點，02:28–05:25 是 V-fold，05:25–08:28 是對驗證的總結提醒，08:28–08:59 是 Fun Time，之後是整堂的總結與下一堂預告。）

### leave-one-out 的兩個缺點

第 18 頁列了兩項。

**計算量（computation）。** 每個模型要多訓練 $N$ 次。課堂上的數字是 1000 筆資料就要訓練 1000 次，每次丟 999 筆進去，很多時候實務上不可行。講義提到例外：線性迴歸這類有解析解的特殊情形。課堂上說，線性迴歸的 leave-one-out 誤差也有公式解，可以很快算出來，但多數模型沒有這種捷徑。

**穩定性（stability）。** 講義寫的原因是 variance of single-point estimates，並把第 16 頁那張圖再放一次。課堂上解釋：每個 $e_n$ 只在一個點上量。以二元分類來說，它不是 0 就是 1，跳動很大，想靠平均把這些跳動消掉並不容易，所以圖上那條黑線會跳動。這對選擇是壞事：我們不希望選中某個模型，只是因為它的曲線剛好在那裡往下跳了一格。

講義的結論是 $E_{\text{loocv}}$: not often used practically。

### 切成 V 份

第 19 頁先換個角度看 leave-one-out：它是把 $\mathcal{D}$ 切成 $N$ 份，輪流拿 $N - 1$ 份訓練、1 份驗證。計算量大，就是因為切得太細。

那就切粗一點。V-fold cross validation 把 $\mathcal{D}$ 隨機切成 $V$ 等份，輪流拿其中 1 份驗證、其餘 $V - 1$ 份訓練。講義的圖是 $V = 10$：$\mathcal{D}$ 切成 $\mathcal{D}_1$ 到 $\mathcal{D}_{10}$，圖上畫的是輪到 $\mathcal{D}_4$ 當驗證（validate），其餘九份訓練（train）的那一次。第 $v$ 次得到的假說記成 $g_v^-$，在第 $v$ 份上算出 $E_{\text{val}}^{(v)}(g_v^-)$，$V$ 次平均：

$$
E_{\text{cv}}(\mathcal{H}, \mathcal{A}) = \frac{1}{V}\sum_{v=1}^{V} E_{\text{val}}^{(v)}(g_v^-)
$$

選模型的式子只是再換一次誤差：

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{cv}}(\mathcal{H}_m, \mathcal{A}_m)\big)
$$

課堂上說，leave-one-out 就是 cross validation 的一個極端例子（$V = N$）。1000 筆資料切 10 份，只要花訓練 10 次的力氣，不必花 1000 次。

講義的經驗值是

$$
V = 10
$$

課堂上補充，要切 5 份、20 份或 2 份都是你的選擇，常見的是 10 份。

本文把它放回 $K$ 的兩難來看。V-fold 每次的驗證集有 $K = N/V$ 筆，訓練集有 $N(1 - \frac{1}{V})$ 筆。$V = 10$ 時每個 $g_v^-$ 用了九成的資料，離 $g$ 不遠；每一輪的驗證誤差是 $N/10$ 筆的平均，比單一個 $e_n$ 穩；而且輪完之後每一筆資料都當過一次驗證資料。它用 $V$ 倍的訓練次數換來這些。

### 六筆資料的 3-fold 與四種選法的總表

六筆資料切 3 份，每份 2 筆。假設隨機分成 $\{1, 4\}$、$\{2, 5\}$、$\{3, 6\}$（數字是資料的編號）。第二份當驗證集的那一輪，就是「六筆資料：切一次驗證集」算過的那一次。

| 驗證的那一份 | 常數 | 直線 | 二次 |
|---|---|---|---|
| 第 1、4 筆 | 1.1406 | 0.1956 | 1.2800 |
| 第 2、5 筆 | 1.1406 | 0.2960 | 0.4054 |
| 第 3、6 筆 | 0.6250 | 0.4450 | 0.4450 |
| $E_{\text{cv}}$ | 0.9688 | **0.3122** | 0.7101 |

第三列直線與二次的數字相同，因為那一輪訓練出來的二次項係數剛好是 0。$E_{\text{cv}}$ 選直線。把四種選法放在一起：

| 選法 | 常數 | 直線 | 二次 | 選到 | 訓練次數（含最後重訓） |
|---|---|---|---|---|---|
| $E_{\text{in}}$ | 0.8125 | 0.1643 | 0.0929 | 二次 | 3 |
| $E_{\text{val}}$，留第 2、5 筆 | 1.1406 | 0.2960 | 0.4054 | 直線 | 3 + 1 |
| $E_{\text{val}}$，留第 5、6 筆 | 1.2656 | 1.4062 | 5.0781 | 常數 | 3 + 1 |
| $E_{\text{loocv}}$ | 1.1700 | 0.3626 | 0.6235 | 直線 | 18 + 1 |
| $E_{\text{cv}}$，3-fold | 0.9688 | 0.3122 | 0.7101 | 直線 | 9 + 1 |
| 重訓後與 $f$ 的平均平方差距 | 0.5208 | 0.0017 | 0.0495 | | |

這張表對應講義的幾個結論。$E_{\text{in}}$ 選到最複雜的模型。切一次驗證集可能選對，也可能因為抽到的那兩筆而選錯。leave-one-out 與 3-fold 都選對，3-fold 只花一半的訓練次數。這只是六筆資料的一個例子，不能證明什麼，但每一格你都可以自己算。

下面這段純 Python 會印出三個模型的 $E_{\text{in}}$、留第 2、5 筆的 $E_{\text{val}}$、$E_{\text{loocv}}$ 與 3-fold 的 $E_{\text{cv}}$（每列第一個數字是多項式的次數）：

```python
from fractions import Fraction as F

def fit(pts, deg):  # 最小平方法：建立 normal equation，再用高斯消去法解
    n = deg + 1
    A = [[sum(F(x) ** (i + j) for x, _ in pts) for j in range(n)]
         + [sum(y * F(x) ** i for x, y in pts)] for i in range(n)]
    for i in range(n):
        p = next(r for r in range(i, n) if A[r][i] != 0)
        A[i], A[p] = A[p], A[i]
        A[i] = [v / A[i][i] for v in A[i]]
        for r in range(n):
            if r != i:
                A[r] = [a - A[r][i] * c for a, c in zip(A[r], A[i])]
    return [row[n] for row in A]

def err(w, pts):  # 平均平方誤差
    return sum((sum(c * F(x) ** i for i, c in enumerate(w)) - y) ** 2
               for x, y in pts) / len(pts)

def cv(pts, deg, folds):  # folds 的每一項是一份驗證集的索引（從 0 起算）
    total = 0
    for fold in folds:
        train = [p for i, p in enumerate(pts) if i not in fold]
        total += err(fit(train, deg), [pts[i] for i in fold])
    return total / len(folds)

D = list(zip(range(6), [F(1), F(1), F(5, 2), F(3), F(3), F(3)]))
for deg in range(3):
    print(deg,
          round(float(err(fit(D, deg), D)), 4),                   # E_in
          round(float(cv(D, deg, [[1, 4]])), 4),                  # 留第 2、5 筆
          round(float(cv(D, deg, [[i] for i in range(6)])), 4),   # leave-one-out
          round(float(cv(D, deg, [[0, 3], [1, 4], [2, 5]])), 4))  # 3-fold
```

### 最後的提醒：驗證也是在選

第 20 頁叫 Final Words on Validation，分兩塊。

**怎麼選驗證工具：**

- 計算量允許的話，V-fold 通常比只切一次驗證集好。課堂上的理由是有平均的動作，比較穩定，代價是多出來的計算。
- 5-fold 或 10-fold 通常就表現得不錯，不需要為了 leave-one-out 多付計算量。

**驗證的本質：**

| 階段 | 講義的說法 | 課堂上的比喻 |
|---|---|---|
| 訓練 | select among hypotheses | 初賽：每個班自己選出第一名 |
| 驗證 | select among finalists | 複賽：再出一份考題，看這些選手誰表現好 |
| 測試 | just evaluate | 選出來之後只是衡量，沒有在選了 |

因為驗證也是在做選擇，資料的污染與模型複雜度的代價同樣會出現，只是比訓練輕。講義的說法是 validation still more optimistic than testing：你選的是眼前看起來最好的那個，它送出去測的時候未必還是最好。

所以講義頁尾的話是 do not fool yourself and others，report test result, not best validation result。課堂上說，有些論文會從所有參數裡挑驗證結果最好的一個，把那個數字當成結果報告，這樣的數字沒有那麼準確；驗證做得再好，都只是手上的資料告訴你的表現。

### 驗證為什麼還是樂觀：一個算得出來的例子

以下是本文自擬的例子，不在講義上。假設有 $M$ 個分類器，全部都是亂猜的，真正的 $E_{\text{out}}$ 都是 $\frac{1}{2}$。拿 $K$ 筆驗證資料選出 $E_{\text{val}}$ 最小的，再把那個最小的 $E_{\text{val}}$ 當成它的效能報告出去，平均會報出多少？

先看 $M = 2$、$K = 2$。每個分類器在兩筆上的 $E_{\text{val}}$ 可能是 $0$、$\frac{1}{2}$、$1$，機率是 $\frac{1}{4}$、$\frac{1}{2}$、$\frac{1}{4}$。兩個分類器互相獨立，取比較小的那個：

- 最小值是 $1$：兩個都要是 $1$，機率 $\frac{1}{4} \times \frac{1}{4} = \frac{1}{16}$。
- 最小值至少 $\frac{1}{2}$：兩個都不能是 $0$，機率 $\frac{3}{4} \times \frac{3}{4} = \frac{9}{16}$；所以最小值恰好是 $\frac{1}{2}$ 的機率是 $\frac{9}{16} - \frac{1}{16} = \frac{8}{16}$。
- 最小值是 $0$：剩下的 $\frac{7}{16}$。

期望值是 $\frac{1}{2} \times \frac{8}{16} + 1 \times \frac{1}{16} = \frac{5}{16} \approx 0.31$。兩個都是丟銅板的分類器，挑過之後報出來的平均誤差是 0.31，真正的誤差是 0.5。

同樣的算法用 Python 精確算到 $M = 25$、$K = 20$，最小 $E_{\text{val}}$ 的期望值是 0.284。候選愈多、驗證資料愈少，這個落差愈大，和保證式裡的 $\sqrt{\log M / K}$ 是同一個方向。只有 $M = 1$、不做任何選擇的時候，$E_{\text{val}}$ 的期望值才剛好是 0.5，那就是測試。

### Fun Time：10-fold 要花多少時間

**題目（第 21 頁）：** 沿用第 12 頁的設定：某個學習模型用 $N$ 筆資料訓練要花 $N^2$ 秒。對 25 個參數不同的這種模型跑 10-fold cross validation、得到最後的 $g_{m^*}$，總共要幾秒？

1. $\frac{47}{2}N^2$
2. $47N^2$
3. $\frac{407}{2}N^2$
4. $407N^2$

**答案：3。** 每一輪的訓練集是九份，$\frac{9N}{10}$ 筆，花 $\big(\frac{9N}{10}\big)^2 = \frac{81}{100}N^2$ 秒。每個模型要 10 輪，25 個模型共 250 輪：

$$
\frac{81}{100}N^2 \times 10 \times 25 = \frac{405}{2}N^2
$$

選出 $m^*$ 之後用全部資料重訓一次，再加 $N^2$，合計 $\frac{405}{2}N^2 + N^2 = \frac{407}{2}N^2$。選項 4 是答案的兩倍；選項 1 與 2 都遠小於光是 250 輪訓練就要的 $202.5N^2$。

本文補充，把三種做法放在一起（25 個模型，訓練時間 $N^2$）：

| 做法 | 總時間 | $N = 1000$ 時 |
|---|---|---|
| 切一次，$K = N/5$ | $17N^2$ | $1.7 \times 10^7$ 秒 |
| 10-fold | $203.5N^2$ | $2.035 \times 10^8$ 秒 |
| leave-one-out | $25N(N-1)^2 + N^2$ | 約 $2.5 \times 10^{10}$ 秒 |

10-fold 是切一次的 12 倍左右，leave-one-out 又是 10-fold 的 120 多倍，而且這個倍數會隨 $N$ 增加。這就是第 20 頁說不必換成 leave-one-out 的原因。

### 這堂課的四句話

第 22 頁的總結把四節各收成一句：

- **Model Selection Problem：** 用 $E_{\text{in}}$ 選危險，用 $E_{\text{test}}$ 選不誠實（dangerous by $E_{\text{in}}$ and dishonest by $E_{\text{test}}$）。
- **Validation：** 用 $E_{\text{val}}(\mathcal{A}_m(\mathcal{D}_{\text{train}}))$ 選，回傳 $\mathcal{A}_{m^*}(\mathcal{D})$。
- **Leave-One-Out Cross Validation：** 計算量很大，換來幾乎無偏的估計。
- **V-Fold Cross Validation：** 計算量與表現都合理。

下一堂的預告只有一行：something 'up my sleeve'。課堂上說，核心的工具到這裡講完了，下一次要講的像是一些小祕密：使用機器學習時還有哪些要注意的事，然後替整門課做總結。

## 自我檢查

**1. 四筆資料的 $y$ 是 $2, 4, 6, 12$。演算法一律用訓練資料 $y$ 的平均預測，誤差用平方誤差。算 $E_{\text{in}}$、$E_{\text{loocv}}$，以及把資料分成 $\{2, 4\}$ 與 $\{6, 12\}$ 兩份的 2-fold $E_{\text{cv}}$。**

答案：全部的平均是 $6$，$E_{\text{in}} = \frac{16 + 4 + 0 + 36}{4} = 14$。leave-one-out：留 $2$ 時其餘平均 $\frac{22}{3}$，$e = \frac{256}{9}$；留 $4$ 時其餘平均 $\frac{20}{3}$，$e = \frac{64}{9}$；留 $6$ 時其餘平均 $6$，$e = 0$；留 $12$ 時其餘平均 $4$，$e = 64$。$E_{\text{loocv}} = \frac{1}{4} \cdot \frac{896}{9} = \frac{224}{9} \approx 24.9$。2-fold：用 $\{6, 12\}$ 訓練得 $9$，在 $\{2, 4\}$ 上是 $\frac{49 + 25}{2} = 37$；用 $\{2, 4\}$ 訓練得 $3$，在 $\{6, 12\}$ 上是 $\frac{9 + 81}{2} = 45$；$E_{\text{cv}} = 41$。$E_{\text{in}}$ 最小，是因為被測的資料自己也在訓練資料裡；後兩個的差別來自訓練資料從 3 筆降到 2 筆，$g^-$ 變差了。

**2. 你有 $M = 20$ 個候選模型（0/1 誤差），驗證集 $K = 500$ 筆。照本文的推導，在 95% 的信心下，被選中模型的 $E_{\text{out}}(g_{m^*}^-)$ 最多比 $E_{\text{val}}$ 高多少？如果希望這個差距不超過 0.05，$K$ 至少要多少？**

答案：$\sqrt{\frac{1}{2 \times 500}\ln\frac{2 \times 20}{0.05}} = \sqrt{\frac{\ln 800}{1000}} = \sqrt{0.006685} \approx 0.082$。要壓到 0.05，需要 $K \ge \frac{\ln 800}{2 \times 0.05^2} = \frac{6.685}{0.005} \approx 1337$。

**3. 同事的流程是：25 組參數各用全部的 $\mathcal{D}$ 訓練出 $g_m$，再從 $\mathcal{D}$ 隨機抽五分之一算每個 $g_m$ 的誤差，挑最小的。這跟驗證差在哪裡？**

判準：答案要指出抽出來的那五分之一已經被每個 $\mathcal{A}_m$ 用來訓練過，不乾淨；在它上面算的誤差是 $E_{\text{in}}$ 的一部分，$g_m$ 也不是對這些資料事先固定的假說，Hoeffding 的保證不成立。結果會跟用 $E_{\text{in}}$ 選一樣偏向最複雜的模型。正確的順序是先切出 $\mathcal{D}_{\text{val}}$，只用 $\mathcal{D}_{\text{train}}$ 訓練。

**4. 選完模型之後，為什麼要用全部資料重訓？這一步有沒有理論保證？有人選完直接回傳 $g_{m^*}^-$，在什麼情況下損失最大？**

判準：要說出學習曲線（資料愈多 $E_{\text{out}}$ 通常愈低）；要說出講義把它標成 heuristic，課堂上明講這不是理論保證而是實務經驗；要說出 $K$ 愈大、$\mathcal{D}_{\text{train}}$ 愈小時損失愈大，並能連到第 10 頁的紅線（sub-g）在 $K$ 大時比用 $E_{\text{in}}$ 選的黑線還高。

**5. 三個亂猜的分類器（真正的 $E_{\text{out}}$ 都是 $\frac{1}{2}$），只用 $K = 1$ 筆驗證資料選出 $E_{\text{val}}$ 最小的，並回報那個最小的 $E_{\text{val}}$。回報值的期望值是多少？這說明了什麼？**

答案：每個分類器的 $E_{\text{val}}$ 是 0 或 1，各 $\frac{1}{2}$。最小值是 1 只發生在三個都猜錯，機率 $\frac{1}{8}$，所以期望值是 $\frac{1}{8}$，遠低於真正的 $\frac{1}{2}$。挑過之後的驗證誤差是偏樂觀的估計，要報告的是測試結果。

## 練習與對應閱讀

**兩個學期的對應。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)把基石第 15、16 堂排在同一週（W8，10/21），這堂的投影片是 [15u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/15u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)同樣排在 W8（10/28），2026-10-13 查的時候這一週的投影片連結還是 404，所以本文只用 MOOC 版講義。這堂的四支影片是基石 YouTube 播放清單的第 58 到 61 支。

**教科書。** 兩份課程頁都把這堂對到 [Learning from Data](http://amlbook.com)（LFD）的 4.3 節。

**作業。** 相關的題目在 [Fall 2024 HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)（2024-11-04 發布、11-18 截止，共 12 題加 1 題 bonus；Q1–4 自動批改，Q5–12 由助教批改），沒有官方解答。

| 題號 | 內容 | 對應這堂的哪裡 |
|---|---|---|
| Q2 | 線性可分資料上，取正負最近兩點的中點當門檻的 decision stump，求 leave-one-out 誤差最緊的上界 | leave-one-out |
| Q7 | 前 $N - K$ 筆算平均、後 $K$ 筆驗證，求期望的驗證誤差 | 驗證集與 $K$ |
| Q8 | 證明常數迴歸的 $E_{\text{loocv}} = \big(\frac{N}{N-1}\big)^2 E_{\text{in}}$，說明 $E_{\text{in}}$ 比 $E_{\text{loocv}}$ 樂觀 | leave-one-out |
| Q11 | mnist.scale 的 2 對 6 子問題：切 8000 筆當 sub-training set，用 $E_{\text{val}}$ 選 $\lambda$ 後在全部訓練資料上重訓，重複 1126 次，與 Q10（用 $E_{\text{in}}$ 選）比較 $E_{\text{out}}$ 的分布 | 驗證加重訓 |
| Q12 | 同上，改用 3-fold cross validation 選 $\lambda$，與 Q11 比較 | V-fold |

Q8 沒有官方解答，可以先用數字對：第 17 頁 Fun Time 的 $y = 1, 5, 7$ 有 $E_{\text{in}} = \frac{56}{9}$、$E_{\text{loocv}} = 14$，而 $\big(\frac{3}{2}\big)^2 \times \frac{56}{9} = 14$；自我檢查第 1 題的 $\big(\frac{4}{3}\big)^2 \times 14 = \frac{224}{9}$ 也對得上。Q7 可以拿「用平均值預測驗算一次」的算法當起點。

Q10 到 Q12 三題用公開的 [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 與 [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)，共用同一套 $\lambda$ 候選（$\log_{10}\lambda \in \{-2, \dots, 3\}$）與「平手選最大的 $\lambda$」的規則，所以最好寫成同一支程式、只換選擇的準則，直接看三種選法的 $E_{\text{out}}$ 分布差多少。Q10 的 L1 正則化在[上一堂](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)。整份作業的導讀在[基石作業導讀](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)。

**動手做。** 看第二支影片時，把驗證流程的五個步驟自己寫一遍，圈出「用全部 $\mathcal{D}$ 重訓」那一步。看完後兩支，用你熟悉的工具（例如 scikit-learn）在同一份小資料上各跑一次 5-fold 與 leave-one-out，比較花的時間，以及換一個隨機切法時估計值變動多少。

**延伸閱讀。** 同一個主題的其他講法：[Stanford CS229 第 6 堂：偏差與變異、正規化與模型選擇](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization)。

**下一堂。** [基石第 16 堂：三個學習原則](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles)是基石的最後一堂，不再教新的演算法，講的是前面這些保證在哪些情況下會失效；這堂的「污染」在那裡會有正式的名字。

## 課程影片來源

原始影片：[Model Selection Problem](https://www.youtube.com/watch?v=BRLGPnrcel8)、[Validation](https://www.youtube.com/watch?v=RvkCaAwRP8A)、[Leave-One-Out Cross Validation](https://www.youtube.com/watch?v=iToz5t0J6WU)、[V-Fold Cross Validation](https://www.youtube.com/watch?v=Y8PaLsYm0Ac)

- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：原本與第 16 堂合為一篇，改為一堂一篇，依講義與影片逐字稿重寫。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方播放清單的講次相符。

## 參考資料

- [基石第 15 堂講義 15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf)：本文的主要底本，四節的內容、四題 Fun Time 與第 3、9、10、14、16、19 頁的圖都出自這份講義。
- [基石第 4 堂講義 04_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf)：有限個假說的 Hoeffding 不等式，本文用它補出驗證保證的推導。
- [基石第 9 堂講義 09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf)：線性迴歸學習曲線的兩條式子，用來對照平均值預測的驗算。
- [機器學習基石 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、15u 投影片與 LFD 章節。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次與 LFD 章節。
- [Fall 2024 Homework 5（hw5.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)：Q2、Q7、Q8、Q11、Q12 的題目內容。
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) 與 [LIBSVM datasets：mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)：HW5 程式題用的工具與資料。
- [Learning from Data 教科書網站](http://amlbook.com)：4.3 節的出處。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
