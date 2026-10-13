---
title: "AdaBoost：調整資料權重，把弱分類器疊成強的｜台大林軒田 機器學習技法 第 8 堂"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, boosting, adaboost]
lang: zh-TW
math: true
series:
  name: "台大林軒田 機器學習基石與技法 導讀"
  order: 25
tldr: "這堂把 bagging 的 bootstrap 改看成替每筆資料加權，再刻意把權重調到讓上一輪的 gₜ 加權錯誤率剛好 1/2，逼下一輪學出不一樣的假說。做法是答錯的資料乘上 ◆ₜ = √((1−εₜ)/εₜ)、答對的除以它，並用 αₜ = ln ◆ₜ 當票數做線性投票，這就是 AdaBoost。基礎演算法只要每一輪都比亂猜好一點，E_in 會在 O(log N) 輪內降到 0；搭配 decision stump，六筆資料手算三輪就看得到。"
description: "台大林軒田機器學習技法第 8 堂 Adaptive Boosting 導讀：認蘋果的課堂故事、把 bootstrap 看成加權、讓上一輪假說像丟銅板的最佳重新加權、縮放因子與投票權重、AdaBoost 完整演算法與 VC 保證、decision stump 與人臉偵測，並用六筆資料手算三輪 AdaBoost-Stump。"
draft: false
glossary:
  - term: "AdaBoost"
    aliases: ["Adaptive Boosting", "皮匠法"]
    definition: "每一輪把上一個 gₜ 答錯的資料權重乘上 ◆ₜ、答對的除以 ◆ₜ，讓 gₜ 在新權重下的加權錯誤率剛好 1/2，下一個假說因此被迫不同；最後以 αₜ = ln ◆ₜ 做線性投票。"
    context: "技法第 8 堂用老師帶小朋友認蘋果的故事介紹；技法第 11 堂再從最佳化的角度重新推一次。"
  - term: "加權錯誤率 εₜ"
    aliases: ["weighted error rate", "weighted incorrect rate"]
    definition: "gₜ 答錯的那些資料的權重總和，除以全部資料的權重總和。權重都相等時它就是一般的錯誤率。"
    context: "AdaBoost 的縮放因子 ◆ₜ 與票數 αₜ 都只由 εₜ 決定。"
  - term: "decision stump"
    aliases: ["positive and negative rays"]
    definition: "只看一個特徵、在一個門檻切一刀的分類器 h(x) = s · sign(xᵢ − θ)，三個參數是特徵 i、門檻 θ、方向 s。在二維平面上是一條垂直線或水平線。"
    context: "技法第 8 堂拿它當 AdaBoost 的弱基礎演算法，合稱 AdaBoost-Stump。"
---

> 🌏 [English version](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en)

**影片狀態：已附影片。** 這篇依官方 MOOC 講義 [208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf) 與這堂四支官方影片的機器轉錄逐字稿寫成，公式以講義為準；逐字稿未經人工校對。每一節開頭附該節的官方影片與大致的時間區段。文中的頁碼指投影片右下角的編號（0/25 到 25/25），寫「課堂上」的地方是轉述影片裡的說法。

這是[台大林軒田 機器學習基石與技法 導讀](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)裡的技法第 8 堂。講義第 1 頁的 Roadmap 把技法分成三種處理特徵的技巧，這堂屬於第二種 Combining Predictive Features: Aggregation Models。上一堂[技法第 7 堂：Blending 與 Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)在同一頁被收成一句：手上已經有一批不一樣的假說時，可以一人一票、線性、甚至非線性地把它們合起來（blending）；還沒有的時候，可以從 bootstrap 抽出來的資料學出不一樣的假說（bagging）。

bagging 的多樣性靠抽樣的運氣。這堂問的是：能不能主動設計每一輪的資料，讓新學到的假說一定跟上一個不同，而且最後合起來的 $G$ 有理論保證？答案是 Adaptive Boosting，簡稱 AdaBoost。

先備是上一堂的 bootstrap 與線性 blending、[基石第 8 堂：雜訊與誤差衡量](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)的加權分類、VC bound 的形式，以及對數與根號的基本運算。讀完之後，你應該能自己推出「答錯的乘多少、答對的乘多少」這組倍數，寫出 AdaBoost 的三個步驟，對一組小資料手算每一輪的 $\epsilon_t$、$\blacklozenge_t$、$\alpha_t$ 與新權重，並說明為什麼「比亂猜好一點」就夠了。

整堂課的推導順序：

1. **動機**：很多條粗糙的規則，加上一位會指出錯誤的老師，可以合成一個好的分類器。
2. **把 bootstrap 看成權重**：bagging 的每個 $g_t$ 其實在最小化加權的錯誤。
3. **設計權重**：讓 $g_t$ 在下一輪的權重下像丟銅板，得到最佳重新加權。
4. **縮放因子 $\blacklozenge_t$**：把重新加權寫成「答錯的乘、答對的除」。
5. **票數 $\alpha_t = \ln\blacklozenge_t$**：一邊學 $g_t$ 一邊決定線性投票的權重。
6. **保證與實作**：VC bound 的兩項都能壓小；搭配 decision stump 實際跑。

## 弱的規則能不能合成強的：一堂認蘋果的課

```youtube
url: https://www.youtube.com/watch?v=hL8DjIHAzZY
title: Adaptive Boosting :: Motivation of Boosting @ Machine Learning Techniques (機器學習技法)
```

（影片 00:17–01:14 複習上一堂，01:14–02:22 介紹題目，02:22–10:30 是課堂故事，10:30–12:23 把角色對回演算法，之後是 Fun Time。）

### 二十張照片

講義第 2 頁設定了一個問題：要教一班 6 歲的小朋友分辨一張照片裡是不是蘋果。老師從 Flickr 上找了 CC-BY-2.0 授權的照片，十張是蘋果，十張不是。課堂上點名的非蘋果有香蕉、橘子、草莓，後面的故事裡還出現番茄。

課堂上先把這個情境對回機器學習的詞彙：二十張照片是 $\mathbf{x}$，是不是蘋果是 $y$，老師把兩者都給了學生，這是監督式學習（supervised learning），要學的是一個二元分類。

### 四個學生、一位老師

講義第 3 到 6 頁是四輪問答，每一頁的下方都是那二十張照片。第 3 到 5 頁用藍色底標出這一輪的規則會答錯的照片；從第 4 頁起，照片的大小會跟著上一輪的對錯改變，上一輪答錯的放大、答對的縮小。下面把四頁的圖整理成表：

| 輪次（講義頁） | 學生說的規則 | 這條規則錯在哪（課堂上的說明） | 全班目前的結論（講義） |
|---|---|---|---|
| 1（第 3 頁） | Michael：蘋果是圓的 | 橘子也是圓的；有一顆蘋果拍起來沒那麼圓 | 蘋果是圓的 |
| 2（第 4 頁） | Tina：蘋果是紅的 | 青蘋果不紅；草莓、番茄是紅的但不是蘋果 | 有點圓、有點紅 |
| 3（第 5 頁） | Joey：蘋果也可能是綠的 | 錯的照片不少，但都落在已經被縮小的照片上 | 有點圓、有點紅、可能是綠的 |
| 4（第 6 頁） | Jessica：蘋果頂端有梗 | （最後一輪，講義沒有再標錯誤） | 有點圓、有點紅、可能是綠的、頂端可能有梗 |

重點在每兩輪之間老師做的事。Michael 說完「圓的」之後，老師沒有直接否定，講義上的台詞是：圓是個好特徵，但只說圓會犯一些錯，還能怎麼描述？課堂上把老師的動作講得很具體：把 Michael 答對的照片拿遠一點（投影片上畫成縮小），把他答錯的照片放大，再請下一位同學看。

Tina 看到的畫面跟 Michael 看到的不一樣。課堂上的描述是：被放大的照片裡有兩張又大又紅的蘋果，而其他不是蘋果的水果大多不紅，所以她說出「紅的」。這條規則是被那幾張放大的照片引出來的。

Joey 那一輪有個容易忽略的細節。課堂上說，「綠的」這條規則看起來答錯一大堆，但那些錯都發生在目前被縮得很小的照片上，不是 Joey 專心在看的東西；在他主要看到的照片上（兩顆青蘋果、一顆被放得很大的番茄），這條規則有道理。至於它犯的錯，下一輪再修。

四輪下來，課堂上的評語是：這個結論也許還稱不上完美，但比任何一位學生單獨說得出來的都豐富。

### 把角色對回演算法

講義第 7 頁把三個角色對上去：

| 故事裡 | 演算法裡 | 講義的寫法 |
|---|---|---|
| 學生 | 簡單的假說 $g_t$ | simple hypotheses，像垂直線或水平線 |
| 全班 | 合起來的複雜假說 $G$ | sophisticated hypothesis，像圖上的黑色曲線 |
| 老師 | 一個引導學生的學習演算法 | 讓學生把注意力放在關鍵例子（key examples）上 |

同一頁的圖是一個二維的例子：幾個圈與叉，背景有幾條灰色的垂直線與水平線，一條黑色的折線邊界把圈和叉完全分開。課堂上說，只准切垂直線和水平線、連斜線都不能切，是很弱的分類方式，就像那些小學生；黑色邊界是把這些線合起來的結果，比任何一條線都豐富。這張圖在講 AdaBoost-Stump 示範的地方會一輪一輪重畫。

課堂上對「關鍵例子」的定義是犯過錯的例子：把它們強調出來，下一位學生才會找出一條不一樣的線。這堂接下來要回答的就是這件事的數學：放大多少、縮小多少，最後怎麼合。

### Fun Time：哪一條能幫忙認蘋果

**題目（第 8 頁）：** 下面哪一項能幫助辨認蘋果？

1. 蘋果通常是圓的
2. 蘋果通常是紅的或綠的
3. 蘋果頂端通常有梗
4. 以上皆是

**答案：4。** 講義的解答只有一句恭喜你通過一年級。這題的用意在選項的措辭：每一條都只寫「通常」，單獨拿任何一條去分類都會錯（故事裡前三位學生都被老師指出過錯誤），但每一條都比亂猜有用。選 1、2、3 任何一個都漏掉了另外兩條同樣有用的規則。「每條都弱、但都比亂猜好」正是後面對基礎演算法的唯一要求。

## 怎麼逼出不一樣的假說：把 bootstrap 看成權重，再自己設計權重

```youtube
url: https://www.youtube.com/watch?v=pTNKUj_1Dw8
title: Adaptive Boosting :: Diversity by Re-weighting @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–03:03 把 bootstrap 改寫成權重，03:03–06:29 談基礎演算法怎麼吃權重，06:29–09:19 是「讓上一輪的假說像丟銅板」的想法，09:19–13:35 推最佳重新加權，之後是 Fun Time。）

### bagging 其實在最小化加權的錯誤

講義第 9 頁從上一堂的 bagging 出發。假設原始資料有四筆，bootstrap 抽出來的結果是第 1 筆兩次、第 2 筆一次、第 4 筆一次，第 3 筆沒抽到：

$$
\mathcal{D} = \{(\mathbf{x}_1, y_1), (\mathbf{x}_2, y_2), (\mathbf{x}_3, y_3), (\mathbf{x}_4, y_4)\} \ \xRightarrow{\ \text{bootstrap}\ }\ \tilde{\mathcal{D}}_t = \{(\mathbf{x}_1, y_1), (\mathbf{x}_1, y_1), (\mathbf{x}_2, y_2), (\mathbf{x}_4, y_4)\}
$$

基礎演算法在 $\tilde{\mathcal{D}}_t$ 上最小化 0/1 錯誤：

$$
E_{\text{in}}^{0/1}(h) = \frac{1}{4}\sum_{(\mathbf{x}, y) \in \tilde{\mathcal{D}}_t} \llbracket y \ne h(\mathbf{x}) \rrbracket
$$

課堂上的觀察是：既然兩個第 1 筆一模一樣，不如留著原本的四筆資料，另外用一個變數 $u_n$ 記錄每一筆「有幾份」。這裡 $u_1 = 2$、$u_2 = 1$、$u_3 = 0$、$u_4 = 1$，同一件事就能寫成在原始資料 $\mathcal{D}$ 上的加權錯誤：

$$
E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{4}\sum_{n=1}^{4} u_n^{(t)} \cdot \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

課堂上的口語版本是：有兩份的資料答錯要扣兩分，有一份的扣一分。上標 $(t)$ 表示第 $t$ 輪，因為每一輪的 bootstrap 會抽出不同的一組 $u_n$。

本文驗算一個情況：假設某個 $h$ 只答錯第 1 筆。照 bootstrap 資料的寫法，$\tilde{\mathcal{D}}_t$ 的四筆裡錯兩筆，錯誤率 $\frac{2}{4}$；照加權的寫法是 $\frac{1}{4}(2 \cdot 1 + 1 \cdot 0 + 0 \cdot 0 + 1 \cdot 0) = \frac{2}{4}$。兩種寫法給出同一個數。

講義把這一頁收成一句：bagging 裡每個不一樣的 $g_t$，都是靠最小化 bootstrap 給的加權錯誤得到的。這個換句話說的用處在於，權重不一定要由抽樣決定。

### 基礎演算法要能吃權重

講義第 10 頁把加權錯誤寫成一般形式，要最小化的是（可以再加正則化項）

$$
E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{N}\sum_{n=1}^{N} u_n \cdot \text{err}(y_n, h(\mathbf{x}_n))
$$

課堂上說，權重在 bagging 裡是整數，但沒有理由只能是整數：一筆資料十倍重要就給 10，0.8 倍重要就給 0.8。接著替學生問了一個問題：以前的演算法都只是把 $E_{\text{in}}$ 做好，現在多了 $u_n$ 要怎麼做？講義舉兩個例子說明這通常不難。

**SVM。** 軟邊界 SVM 原本每筆資料違反邊界的代價都乘上 $C$，現在第 $n$ 筆的代價乘上 $C u_n$。講義的結論是，用對偶 QP 解的時候，這等於把 $\alpha_n$ 的上界從 $C$ 改成 $C u_n$：

$$
0 \le \alpha_n \le C u_n
$$

課堂上的說法是：原本一個錯扣 $C$ 分，現在有兩份就扣 $2C$ 分，這個參數經過整個 QP 的推導，最後會跑到 $\alpha_n$ 的上限去。本文把中間那一步補上（用的是[技法第 4 堂：軟邊界 SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm)的推導）：加權後的原始問題是最小化 $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_n u_n\xi_n$。拉格朗日函數裡含 $\xi_n$ 的項是 $(C u_n - \alpha_n - \beta_n)\,\xi_n$，其中 $\beta_n \ge 0$ 是 $\xi_n \ge 0$ 那條限制的乘數。對 $\xi_n$ 偏微分等於 0 得到 $\beta_n = C u_n - \alpha_n$，再由 $\beta_n \ge 0$ 就得到 $\alpha_n \le C u_n$。其餘的對偶問題完全不變。

**邏輯迴歸。** 用 SGD 訓練時，原本每一步均勻地隨機挑一筆資料算梯度。講義的做法是改成依照 $u_n$ 的比例抽樣。課堂上的理由是：某筆資料如果有 10 份，它被抽到的機率本來就應該是別人的 10 倍。本文補一行式子：以機率 $u_n / \sum_m u_m$ 抽到第 $n$ 筆時，梯度的期望值是 $\sum_n \frac{u_n}{\sum_m u_m}\nabla\text{err}_n$，正比於 $\nabla\sum_n u_n\,\text{err}_n$，也就是加權錯誤的梯度方向。

講義在頁尾指出，這種「每筆資料各有權重」的學習（example-weighted learning）是基石第 8 堂 class-weighted learning 的延伸。課堂上回顧：基石第 8 堂談的是指紋辨識裡兩種錯誤哪一種比較嚴重，權重是跟著類別走的；現在權重跟著每一筆資料走。課堂上說那一堂學到的方式大部分都可以延伸過來（本文註：那一堂的做法是把代價高的資料想成複製了很多份）。

之後的推導都假設基礎演算法 $\mathcal{A}$ 能接受權重：給它資料 $\mathcal{D}$ 與權重 $\mathbf{u}$，它回傳一個讓加權錯誤盡量小的假說。

### 讓上一輪的假說在新權重下像丟銅板

講義第 11 頁回到二元分類，問怎麼設計權重才能得到更不一樣的假說。上一堂的結論是，假說之間愈不同，合起來的效果愈好。相鄰兩輪的假說是這樣來的：

$$
g_t \leftarrow \operatorname*{argmin}_{h \in \mathcal{H}} \left(\sum_{n=1}^{N} u_n^{(t)} \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket\right), \qquad g_{t+1} \leftarrow \operatorname*{argmin}_{h \in \mathcal{H}} \left(\sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket\right)
$$

$g_{t+1}$ 是在 $\mathbf{u}^{(t+1)}$ 下加權錯誤最小的假說。講義的推理是：如果 $g_t$ 在 $\mathbf{u}^{(t+1)}$ 下表現「不好」，那麼 $g_t$ 以及長得像 $g_t$ 的假說都不會被選成 $g_{t+1}$，$g_{t+1}$ 就會跟 $g_t$ 不同。課堂上的說法是：$g_t$ 已經抓在手上了，只要把權重稍微調一下，讓它在新的一輪表現很差，跟它很像的假說就都不會被選到。

二元分類裡「表現很差」的標準是什麼？課堂上的回答是跟丟銅板沒有兩樣。丟銅板的期望錯誤率是 $\frac{1}{2}$，所以講義把目標寫成：設計 $\mathbf{u}^{(t+1)}$，讓 $g_t$ 的加權錯誤率剛好是一半。

$$
\frac{\sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket}{\sum_{n=1}^{N} u_n^{(t+1)}} = \frac{1}{2}
$$

分母是全部權重的總和，除掉它是為了把加權錯誤換算成比例。

本文補充：為什麼目標是 $\frac{1}{2}$，而不是把 $g_t$ 的加權錯誤率調到更高，例如 $0.9$？二元分類裡，$g_t$ 的加權錯誤率是 $0.9$，就表示 $-g_t$ 的加權錯誤率是 $0.1$。如果假說集合裡同時有 $h$ 與 $-h$（decision stump 就是，方向 $s$ 可以取正負），基礎演算法下一輪會直接選 $-g_t$，那只是同一條線反過來用，沒有帶來新資訊。$\frac{1}{2}$ 是 $g_t$ 與 $-g_t$ 都沒有用的唯一位置，演算法只好去找別的假說。

### 最佳重新加權：講義的 1126 與 6211

講義第 12 頁把那個比例拆成兩塊。把 $g_t$ 答錯的資料在新權重下的總和記成 $\blacksquare_{t+1}$，答對的記成 $\bullet_{t+1}$（課堂上唸成方塊與圈圈）：

$$
\blacksquare_{t+1} = \sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket, \qquad \bullet_{t+1} = \sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n = g_t(\mathbf{x}_n) \rrbracket
$$

每筆資料不是答錯就是答對，所以全部權重的總和是 $\blacksquare_{t+1} + \bullet_{t+1}$，目標變成

$$
\frac{\blacksquare_{t+1}}{\blacksquare_{t+1} + \bullet_{t+1}} = \frac{1}{2} \quad\Longleftrightarrow\quad \blacksquare_{t+1} = \bullet_{t+1}
$$

等價的理由：左式交叉相乘是 $2\blacksquare_{t+1} = \blacksquare_{t+1} + \bullet_{t+1}$，移項就是右式。所以要做的事只有一件：把答錯那一群的權重總和，跟答對那一群的權重總和，調成一樣大。

課堂上說做得到這件事的方法很多，講義選的是跟故事裡放大縮小照片一樣的做法：每一群各乘上一個數。講義用一組數字示範。假設在目前的權重 $\mathbf{u}^{(t)}$ 下，答錯的總和是 1126，答對的總和是 6211：

| | 答錯的那一群 | 答對的那一群 |
|---|---|---|
| 目前的權重總和 | $1126$ | $6211$ |
| 佔全部（$7337$）的比例 | $\frac{1126}{7337}$ | $\frac{6211}{7337}$ |
| 講義的做法：每筆乘上 | $6211$ | $1126$ |
| 新的權重總和 | $1126 \times 6211$ | $6211 \times 1126$ |

兩邊互乘對方的總和，新的總和當然相等，都是 $6{,}993{,}586$（本文驗算）。同除以 $7337$ 也一樣：答錯的每筆乘上 $\frac{6211}{7337}$（答對的比例），答對的每筆乘上 $\frac{1126}{7337}$（答錯的比例），兩邊都變成 $\frac{1126 \times 6211}{7337} \approx 953.19$。

把數字換成符號。令 $g_t$ 在目前權重下的加權錯誤率為

$$
\epsilon_t = \frac{\sum_{n=1}^{N} u_n^{(t)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket}{\sum_{n=1}^{N} u_n^{(t)}}
$$

再令 $U = \sum_n u_n^{(t)}$。答錯那一群的總和是 $\epsilon_t U$，答對那一群是 $(1 - \epsilon_t)U$。答錯的每筆乘 $(1 - \epsilon_t)$、答對的每筆乘 $\epsilon_t$ 之後：

$$
\underbrace{\epsilon_t U \cdot (1 - \epsilon_t)}_{\text{incorrect}} \ =\ \underbrace{(1 - \epsilon_t) U \cdot \epsilon_t}_{\text{correct}}
$$

講義把這個結論叫作 'optimal' re-weighting：

> 答錯的乘上正比於 $(1 - \epsilon_t)$ 的數，答對的乘上正比於 $\epsilon_t$ 的數。

「正比於」的意思是兩個倍數可以同乘一個正的常數，因為兩邊的總和會一起放大，仍然相等。真正被決定的只有兩個倍數的比值 $(1 - \epsilon_t) : \epsilon_t$。講義的例子裡 $\epsilon_t = \frac{1126}{7337} \approx 0.153$，這個比值是 $6211 : 1126 \approx 5.52$：每一筆答錯的資料，相對於每一筆答對的資料，重要性被拉高到原本的 5.52 倍。

課堂上在這裡收尾：兩邊調成一樣，原本的 $g_t$ 在新的一輪就表現得很差，應該不會再被基礎演算法選到。

### Fun Time：四筆資料錯一筆

**題目（第 13 頁）：** 四筆資料，每一筆的 $u_n^{(1)} = \frac{1}{4}$。$g_1$ 把第 1 筆分錯，其他三筆都分對。做完 'optimal' re-weighting 之後，$u_1^{(2)} / u_2^{(2)}$ 是多少？

1. $4$
2. $3$
3. $1/3$
4. $1/4$

**答案：2。** 權重都相等，所以 $\epsilon_1 = \frac{1}{4}$。第 1 筆答錯，乘上正比於 $1 - \epsilon_1 = \frac{3}{4}$ 的數；第 2 筆答對，乘上正比於 $\epsilon_1 = \frac{1}{4}$ 的數。兩筆原本的權重相同，比值就是 $\frac{3/4}{1/4} = 3$。講義的說法是第 1 筆現在比其他任何一筆重要三倍。

驗算目標有沒有達成：新權重正比於 $(3, 1, 1, 1)$，答錯那一群的總和是 3，答對那一群是 $1 + 1 + 1 = 3$，$g_1$ 的加權錯誤率是 $\frac{3}{6} = \frac{1}{2}$。

其他選項：$4$ 是 $\frac{1}{\epsilon_1}$，等於只記得答對的要乘 $\epsilon_1$，卻讓答錯的乘 1；答錯的倍數是 $1 - \epsilon_1$，正確的比值是 $\frac{1 - \epsilon_1}{\epsilon_1}$。$\frac{1}{3}$ 是把分子分母放反，那是 $u_2^{(2)} / u_1^{(2)}$；$\frac{1}{4}$ 則是 $\epsilon_1$ 本身。一個快速的檢查：答錯的資料應該變重，所以答案一定大於 1，後兩個選項可以直接排除。

## AdaBoost 演算法：縮放因子、票數與理論保證

```youtube
url: https://www.youtube.com/watch?v=vqTXLTYqbbw
title: Adaptive Boosting :: Adaptive Boosting Algorithm @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:24 是縮放因子，02:24–04:58 是初步的演算法與兩個缺口，04:58–08:00 決定票數，08:00–10:01 是完整演算法，10:01–13:07 是理論保證，之後是 Fun Time。）

### 縮放因子 ◆：答錯的乘、答對的除

最佳重新加權的結論是兩個倍數：答錯乘 $(1 - \epsilon_t)$，答對乘 $\epsilon_t$，而且可以同乘一個常數。講義第 14 頁挑了一個讓式子對稱的常數，定義縮放因子（scaling factor）

$$
\blacklozenge_t = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}}
$$

然後把更新規則寫成

$$
\text{incorrect} \leftarrow \text{incorrect} \cdot \blacklozenge_t, \qquad \text{correct} \leftarrow \text{correct} \,/\, \blacklozenge_t
$$

講義說這跟最佳重新加權等價，推導如下。把原本的兩個倍數同除以 $\sqrt{\epsilon_t(1 - \epsilon_t)}$：

$$
\frac{1 - \epsilon_t}{\sqrt{\epsilon_t(1 - \epsilon_t)}} = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}} = \blacklozenge_t, \qquad \frac{\epsilon_t}{\sqrt{\epsilon_t(1 - \epsilon_t)}} = \sqrt{\frac{\epsilon_t}{1 - \epsilon_t}} = \frac{1}{\blacklozenge_t}
$$

兩個倍數的比值仍是 $\blacklozenge_t \div \frac{1}{\blacklozenge_t} = \blacklozenge_t^2 = \frac{1 - \epsilon_t}{\epsilon_t}$，課堂上也是用這個比值說明兩種寫法效果相同。直接驗算也可以：答錯那一群的新總和是 $\epsilon_t U \cdot \blacklozenge_t = U\sqrt{\epsilon_t(1 - \epsilon_t)}$，答對那一群是 $(1 - \epsilon_t)U / \blacklozenge_t = U\sqrt{\epsilon_t(1 - \epsilon_t)}$，兩者相等。

換成 $\blacklozenge_t$ 的好處是它有直接的物理意義。講義寫的是 $\blacklozenge_t \ge 1$ 若且唯若 $\epsilon_t \le \frac{1}{2}$：

$$
\blacklozenge_t \ge 1 \iff \frac{1 - \epsilon_t}{\epsilon_t} \ge 1 \iff 1 - \epsilon_t \ge \epsilon_t \iff \epsilon_t \le \frac{1}{2}
$$

課堂上補充，$\epsilon_t$ 通常會比 $\frac{1}{2}$ 小，因為 $\frac{1}{2}$ 是亂猜的水準，底下有一個演算法在學，應該要學得比亂猜好。這時 $\blacklozenge_t > 1$，「乘上 $\blacklozenge_t$」是真的放大，「除以 $\blacklozenge_t$」是真的縮小，也就是講義寫的 scale up incorrect、scale down correct，跟故事裡的老師做的事一樣。課堂上還拿[基石第 2 堂的 PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)來比：概念上有一點像，有錯就想辦法修正。

講義舉的例子 $\epsilon_t = \frac{1126}{7337}$ 對應 $\blacklozenge_t = \sqrt{6211/1126} \approx 2.349$（本文計算）：答錯的每筆乘 2.349，答對的每筆除以 2.349。

### 還缺兩塊：第一輪的權重，以及最後怎麼合

講義第 15 頁把目前有的東西寫成一個初步的演算法，留了兩個問號：

1. $\mathbf{u}^{(1)} = ?$
2. 對 $t = 1, 2, \dots, T$：用 $\mathcal{A}(\mathcal{D}, \mathbf{u}^{(t)})$ 得到 $g_t$，其中 $\mathcal{A}$ 試著最小化 $\mathbf{u}^{(t)}$ 加權的 0/1 錯誤；再用 $\blacklozenge_t$ 把 $\mathbf{u}^{(t)}$ 更新成 $\mathbf{u}^{(t+1)}$。
3. 回傳 $G(\mathbf{x}) = ?$

**第一輪的權重。** 講義的回答是希望 $g_1$ 對原本的 $E_{\text{in}}$ 是「最好」的，所以 $u_n^{(1)} = \frac{1}{N}$。每筆權重相同時，加權錯誤就是一般的 $E_{\text{in}}$。

**最後怎麼合。** 最直覺的是像 bagging 那樣一人一票。講義在這個選項旁邊寫了一句 but $g_2$ very bad for $E_{\text{in}}$，還附了一個「why? :-)」。課堂上的解釋是：$g_1$ 是在均勻權重下選出來的，對 $E_{\text{in}}$ 很好；$g_2$ 是在刻意讓 $g_1$ 失效的權重下選出來的，跟 $g_1$ 很不一樣，對原本的 $E_{\text{in}}$ 大概就不好了。讓一個好的和一個差的一人一票，結果可能不會太好。

本文補充：「很差」是一個傾向，不是定理。這一堂能嚴格保證的只有加權的敘述：$g_t$ 在 $\mathbf{u}^{(t+1)}$ 下的錯誤率是 $\frac{1}{2}$。後面的數值例子裡，$g_2$ 在原始資料上的錯誤率跟 $g_1$ 一樣是 $\frac{1}{3}$。

講義接著說，要用線性或非線性的方式合都可以（as you wish），課堂上的意思是拿到一堆 $g_t$ 之後，上一堂的各種 blending 都能再套一次。但這堂要介紹的是一個特別的做法：在學 $g_t$ 的過程中順便把線性組合的係數決定掉，講義稱為 linear aggregation on the fly，而且有理論保證。

### 邊學邊決定票數

講義第 16 頁在迴圈裡加了第三步：

$$
\alpha_t = \ln(\blacklozenge_t), \qquad G(\mathbf{x}) = \text{sign}\left(\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})\right)
$$

課堂上解釋 on the fly：決定一個 $g_t$ 就決定一個 $\alpha_t$，整個演算法跑完時兩者都有了，不需要回頭再解一次線性 blending。

$\alpha_t$ 的設計要求是好的 $g_t$ 拿多一點票。課堂上的推理是：好的 $g_t$ 的 $\epsilon_t$ 小，$\epsilon_t$ 小則 $\blacklozenge_t$ 大，所以讓 $\alpha_t$ 是 $\blacklozenge_t$ 的某個單調遞增函數就符合要求。講義寫成 $\alpha_t = \text{monotonic}(\blacklozenge_t)$，然後直接取自然對數。課堂上只說這是設計這個演算法的人做的特殊選擇，沒有在這堂解釋為什麼是對數；講義把它稱為 'magic' linear aggregation。理由要等到[技法第 11 堂：梯度提升決策樹](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree)從最佳化的角度重看 AdaBoost 才會出現。

講義檢查了兩個極端：

- $\epsilon_t = \frac{1}{2}$：$\blacklozenge_t = 1$，$\alpha_t = \ln 1 = 0$。課堂上的講法是，跟丟銅板一樣差的 $g_t$ 一票也不給，等於不讓它進到 $G$ 裡。
- $\epsilon_t = 0$：$\blacklozenge_t = \infty$，$\alpha_t = \infty$。$g_t$ 單槍匹馬就把加權錯誤做到 0，那就給它無限多票，$G$ 完全聽它的。

中間的情況，本文列幾個數字（都用 $\alpha_t = \frac{1}{2}\ln\frac{1 - \epsilon_t}{\epsilon_t}$ 算，已用 Python 驗算）：

| $\epsilon_t$ | $\blacklozenge_t$ | $\alpha_t$ |
|---|---|---|
| $0.10$ | $3.000$ | $1.099$ |
| $0.25$ | $1.732$ | $0.549$ |
| $0.40$ | $1.225$ | $0.203$ |
| $0.49$ | $1.020$ | $0.020$ |
| $0.50$ | $1.000$ | $0$ |

錯誤率從 $0.40$ 降到 $0.10$，票數變成原本的五倍多；只比亂猜好一點點的 $g_t$（$\epsilon_t = 0.49$）幾乎沒有發言權。

同一頁把 AdaBoost 拆成三個元件，各自對回故事裡的角色：

| 元件 | 角色 | 做什麼 |
|---|---|---|
| 弱的基礎演算法 $\mathcal{A}$ | 學生 | 看著老師準備好的權重，挑出這一輪最好的 $g_t$ |
| 最佳重新加權因子 $\blacklozenge_t$ | 老師 | 放大答錯的、縮小答對的 |
| 'magic' 線性組合 $\alpha_t$ | 全班 | 把每個 $g_t$ 依表現加權合成 $G$ |

### 完整的演算法

講義第 17 頁是完整版：

1. 初始化 $\mathbf{u}^{(1)} = \left[\frac{1}{N}, \frac{1}{N}, \dots, \frac{1}{N}\right]$。
2. 對 $t = 1, 2, \dots, T$：
   1. 用 $\mathcal{A}(\mathcal{D}, \mathbf{u}^{(t)})$ 得到 $g_t$，其中 $\mathcal{A}$ 試著最小化 $\mathbf{u}^{(t)}$ 加權的 0/1 錯誤。
   2. 算出 $\epsilon_t$ 與 $\blacklozenge_t$，把 $\mathbf{u}^{(t)}$ 更新成 $\mathbf{u}^{(t+1)}$：答錯的資料 $u_n^{(t+1)} \leftarrow u_n^{(t)} \cdot \blacklozenge_t$，答對的資料 $u_n^{(t+1)} \leftarrow u_n^{(t)} / \blacklozenge_t$。
   3. 算出 $\alpha_t = \ln(\blacklozenge_t)$。
3. 回傳 $G(\mathbf{x}) = \text{sign}\left(\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})\right)$。

其中

$$
\blacklozenge_t = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}}, \qquad \epsilon_t = \frac{\sum_{n=1}^{N} u_n^{(t)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket}{\sum_{n=1}^{N} u_n^{(t)}}
$$

本文補充兩個實作時會遇到的細節。第一，權重不需要正規化成總和為 1：$\epsilon_t$ 是比例，把所有 $u_n$ 同乘一個常數，$\epsilon_t$、$\blacklozenge_t$、$\alpha_t$ 與「哪個假說的加權錯誤最小」都不變。後面手算時會利用這一點，把權重寫成整數比。第二，如果某一輪 $\epsilon_t = 0$，$\blacklozenge_t$ 要除以 0，程式得另外處理；這時 $g_t$ 自己就完全分對了加權資料，照講義的說法它該拿無限多票。

課堂上提到 AdaBoost 有個中文譯名叫皮匠法，取三個臭皮匠勝過一個諸葛亮的意思；講義最後一頁的總結用的是英文的 two heads are better than one。讓弱的 $g_t$ 變強這個性質叫 boosting，講義在這一頁的頁尾寫 AdaBoost 具有可以證明的 boosting 性質。

### 理論保證：兩項都能壓小

講義第 18 頁把基石的 VC bound 套在 $G$ 上：

$$
E_{\text{out}}(G) \le E_{\text{in}}(G) + O\left(\sqrt{\underbrace{O\big(d_{\text{VC}}(\mathcal{H}) \cdot T\log T\big)}_{d_{\text{VC}} \text{ of all possible } G} \cdot \frac{\log N}{N}}\right)
$$

右邊第一項是 $G$ 在訓練資料上的表現，第二項是模型複雜度的代價。課堂上說明第二項的來源：$d_{\text{VC}}(\mathcal{H})$ 是單一個 $g_t$ 所在的假說集合的複雜度，把 $T$ 個合起來，整體的 VC 維度可以被證明大約是它的 $T\log T$ 倍；其餘是標準的 VC bound 形式。課堂上明講這裡不做詳細的證明。

講義對兩項各下一個結論：

- **第一項可以很小。** 只要每一輪都有 $\epsilon_t \le \epsilon < \frac{1}{2}$，經過 $T = O(\log N)$ 輪之後 $E_{\text{in}}(G) = 0$。課堂上說這是原作者證明的結果。
- **第二項可以很小。** 整體的 $d_{\text{VC}}$ 隨 $T$ 成長得「慢」。課堂上的說法是 $T$ 只需要 $\log N$ 那麼多，等資料量 $N$ 夠大，整個第二項也會小。

兩項都小，$E_{\text{out}}(G)$ 就小。講義把這個結論叫作 boosting view of AdaBoost：

> 如果 $\mathcal{A}$ 很弱，但永遠比亂猜好一點（$\epsilon_t \le \epsilon < \frac{1}{2}$），那麼 AdaBoost 加上 $\mathcal{A}$ 可以很強（$E_{\text{in}} = 0$ 而且 $E_{\text{out}}$ 小）。

課堂上的講法是：對底下的演算法只要求一點點，就是比亂猜好一點點，AdaBoost 就能讓它愈變愈強，強到 $E_{\text{in}}$ 是 0、$E_{\text{out}}$ 也有保證。

本文補充：要注意條件裡的 $\epsilon$ 是一個固定的、小於 $\frac{1}{2}$ 的數，每一輪的 $\epsilon_t$ 都不能超過它。$\epsilon_t$ 是在愈來愈刁鑽的權重下量的，所以這個條件並不輕鬆：它要求基礎演算法不管面對什麼權重，都拿得出一個比亂猜好的假說。

### 本文補充：O(log N) 輪是怎麼來的

以下內容不在這堂的講義上，課堂上也沒有做，寫在這裡是為了讓講義第 18 頁那句「$T = O(\log N)$」有個來由。整個論證靠三件事。第一件是 Fall 2024 作業的一題證明題（見文末的練習），所以這裡只給結論與直覺，證明留給你自己做；另外兩件本文走完。

**第一件（只給結論）：權重總和每一輪乘上一個小於 1 的數。** 令 $U_t = \sum_n u_n^{(t)}$。每做完一輪更新，

$$
U_{t+1} = U_t \cdot 2\sqrt{\epsilon_t(1 - \epsilon_t)}
$$

$\epsilon_t \ne \frac{1}{2}$ 時 $2\sqrt{\epsilon_t(1 - \epsilon_t)} < 1$，所以權重總和一直在縮小。這個因子只看 $\epsilon_t$：$g_t$ 愈好（$\epsilon_t$ 愈小）縮得愈快，$\epsilon_t$ 愈接近 $\frac{1}{2}$ 因子愈接近 1。可以先拿後面六張水果照片的例子對數字：三輪的 $\epsilon_t$ 是 $\frac{1}{3}, \frac{1}{4}, \frac{1}{6}$，因子是 $0.943, 0.866, 0.745$，權重總和就是 $1 \to 0.943 \to 0.816 \to 0.609$。

**第二件：每筆資料最後的權重記錄了它的得票。** $y_n$ 與 $g_t(\mathbf{x}_n)$ 都是 $\pm 1$，答對時 $y_n g_t(\mathbf{x}_n) = +1$、答錯時是 $-1$，所以「答錯乘 $\blacklozenge_t$、答對除以 $\blacklozenge_t$」可以寫成一條式子：

$$
u_n^{(t+1)} = u_n^{(t)} \cdot \blacklozenge_t^{-y_n g_t(\mathbf{x}_n)} = u_n^{(t)} \cdot \exp\big(-y_n\alpha_t g_t(\mathbf{x}_n)\big)
$$

第二個等號用的是 $\blacklozenge_t = e^{\alpha_t}$。從 $u_n^{(1)} = \frac{1}{N}$ 連乘 $T$ 輪：

$$
u_n^{(T+1)} = \frac{1}{N}\exp\left(-y_n\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)\right)
$$

指數裡的加總正是 $G$ 取 sign 之前的分數。對數這個選擇在這裡露出一點用意：它讓權重與投票分數直接掛勾。技法第 11 堂的講義會寫出同一條式子，並從這裡出發重看 AdaBoost。

**第三件：權重總和壓住 $E_{\text{in}}(G)$。** 如果 $G$ 把第 $n$ 筆分錯，$y_n$ 與分數異號（或分數是 0），指數裡的量大於等於 0，於是 $u_n^{(T+1)} \ge \frac{1}{N}$。每一筆被 $G$ 分錯的資料至少貢獻 $\frac{1}{N}$，所以

$$
E_{\text{in}}(G) = \frac{\text{number of errors}}{N} \le \sum_{n=1}^{N} u_n^{(T+1)} = U_{T+1}
$$

**合起來。** $U_1 = 1$，再把第一件的結論連乘 $T$ 輪。函數 $x(1 - x)$ 在 $0 \le x \le \frac{1}{2}$ 之間遞增，$\epsilon_t \le \epsilon$ 就表示每個因子都不超過 $2\sqrt{\epsilon(1 - \epsilon)}$：

$$
E_{\text{in}}(G) \le U_{T+1} = \prod_{t=1}^{T} 2\sqrt{\epsilon_t(1 - \epsilon_t)} \le \Big(2\sqrt{\epsilon(1 - \epsilon)}\Big)^T
$$

令 $r = 2\sqrt{\epsilon(1 - \epsilon)}$，它是一個小於 1 的常數。$E_{\text{in}}(G)$ 只能是 $\frac{1}{N}$ 的整數倍，所以只要 $r^T < \frac{1}{N}$，$E_{\text{in}}(G)$ 就只能是 0。解出 $T$：

$$
r^T < \frac{1}{N} \iff T > \frac{\ln N}{\ln(1/r)}
$$

分母是只跟 $\epsilon$ 有關的常數，所以 $T = O(\log N)$。舉例：$\epsilon = 0.4$ 時 $r \approx 0.9798$，$N = 1000$ 需要 $T > 338.4$，也就是 339 輪保證 $E_{\text{in}}(G) = 0$。這是保證用的上界，實際上常常早得多。

### Fun Time：α 什麼時候是正的

**題目（第 19 頁）：** 依照 $\alpha_t = \ln(\blacklozenge_t)$ 與 $\blacklozenge_t = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}}$，什麼時候 $\alpha_t > 0$？

1. $\epsilon_t < \frac{1}{2}$
2. $\epsilon_t > \frac{1}{2}$
3. $\epsilon_t \ne 1$
4. $\epsilon_t \ne 0$

**答案：1。** $\ln$ 在引數大於 1 時為正，所以 $\alpha_t > 0 \iff \blacklozenge_t > 1 \iff \frac{1 - \epsilon_t}{\epsilon_t} > 1 \iff \epsilon_t < \frac{1}{2}$。講義的解答說數學的部分不難，有意思的是物理意義：$g_t$ 對 $G$ 有用（票數為正），若且唯若它的加權錯誤率比亂猜好。

其他選項：選項 2 的方向反了，$\epsilon_t > \frac{1}{2}$ 時 $\blacklozenge_t < 1$，$\alpha_t$ 是負的。選項 3 與 4 都包含讓 $\alpha_t$ 不為正的情況，例如 $\epsilon_t = 0.7$ 既不是 1 也不是 0，但 $\alpha_t = \ln\sqrt{3/7} \approx -0.424$。

本文補充：負的 $\alpha_t$ 並不代表 $g_t$ 沒用。$\epsilon_t = 0.7$ 的 $g_t$ 反過來用錯誤率就是 $0.3$，負的票數正好把它反過來，這跟上一堂說線性 blending 可以拿掉 $\alpha_t \ge 0$ 限制是同一個道理。真正沒用的只有 $\epsilon_t = \frac{1}{2}$。

## 實際跑起來：decision stump、兩組示範與人臉偵測

```youtube
url: https://www.youtube.com/watch?v=5wPN87bwoaE
title: Adaptive Boosting :: Adaptive Boosting in Action @ Machine Learning Techniques (機器學習技法)
```

（影片 00:00–02:18 是 decision stump，02:18–05:05 是簡單資料的逐輪示範，05:05–06:35 是複雜資料，06:35–08:47 是人臉偵測，08:47–09:14 是 Fun Time，之後是總結與下一堂預告。）

### 弱的基礎演算法：decision stump

AdaBoost 需要一個弱的基礎演算法 $\mathcal{A}$。講義第 20 頁的要求是它能把加權錯誤 $E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{N}\sum_n u_n \cdot \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket$ 做到小「一點點」。常見的選擇是 decision stump，講義提醒這在基石的作業 2 出現過：

$$
h_{s,i,\theta}(\mathbf{x}) = s \cdot \text{sign}(x_i - \theta)
$$

它有三個參數：看哪一個特徵 $i$、門檻 $\theta$ 切在哪裡、方向 $s \in \{+1, -1\}$（門檻右邊判成正的還是負的）。講義稱它為某個特徵上的 positive and negative rays。課堂上的形容是：它在每一個維度上就像一個只看那個維度的 perceptron，切一刀下去，一邊是正的、一邊是負的。在二維平面上，它就是講義第 7 頁那張圖裡的垂直線或水平線。

講義說它可以有效率地最佳化，時間是 $O(d \cdot N\log N)$，$d$ 是特徵數。課堂上的理由分兩層。第一，這三個參數的組合在資料上其實只有有限多種，全部搜尋一遍就能找到最好的，所以 decision stump 是少數能把 $E_{\text{in}}$ 真的做到最小的假說集合，加權的版本也一樣。第二，把資料對每個特徵先排序，計算上再花點巧思，就能做到 $O(d \cdot N\log N)$；課堂上把細節留給有興趣的同學。

本文把那個巧思補上。對單一特徵 $i$：把 $N$ 筆資料依 $x_i$ 排序，花 $O(N\log N)$。門檻只有放在相鄰兩筆之間（或全部資料的外側）才會產生不同的分法，所以候選的 $\theta$ 至多 $N$ 個。讓 $\theta$ 從最左邊開始一格一格往右移，每移一格只有一筆資料從門檻右邊換到左邊，加權錯誤只要加上或減去那一筆的 $u_n$，是 $O(1)$。$s = -1$ 的加權錯誤等於權重總和減掉 $s = +1$ 的加權錯誤，不用另外掃。所以每個特徵排序之後只要 $O(N)$，$d$ 個特徵合計 $O(d \cdot N\log N)$。

講義對 decision stump 的總評是：能有效率地最小化 $E_{\text{in}}^{\mathbf{u}}$，但單獨使用大概太弱。課堂上說只能切垂直刀和水平刀，自己用的話大部分時候不夠；現在有了 AdaBoost，弱也沒關係。兩者的組合叫 AdaBoost-Stump。

### 數值例子：六張水果照片手算三輪

以下是本文自擬的例子，不在講義上，數字都用 Python 算過（程式附在這一小節最後）。它沿用認蘋果的故事，但把每張照片簡化成一個特徵。

**資料。** 六張照片，特徵 $x$ 是顏色等級，1 最綠、6 最紅。兩顆青蘋果在綠的一端，兩顆紅蘋果在紅的一端，中間是香蕉和橘子：

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $x_n$ | 1 | 2 | 3 | 4 | 5 | 6 |
| 照片 | 青蘋果 | 青蘋果 | 香蕉 | 橘子 | 紅蘋果 | 紅蘋果 |
| $y_n$ | $+1$ | $+1$ | $-1$ | $-1$ | $+1$ | $+1$ |

**候選的假說。** 只有一個特徵，decision stump 是 $h(x) = s \cdot \text{sign}(x - \theta)$。門檻放在 $0.5, 1.5, \dots, 5.5$ 六個位置，各配兩個方向，共 12 條不同的規則。任何一條都只能切一刀，而正確答案是「兩端是蘋果、中間不是」，所以沒有一條能全對。真正會被用到的是下面三條，其餘九條在這三輪裡的加權錯誤率都比當輪被選中的那一條高：

| 代號 | 參數 | 白話 | 預測（$n = 1$ 到 $6$） | 答錯哪幾筆 |
|---|---|---|---|---|
| A | $s = +1$，$\theta = 0.5$ | 全部都是蘋果 | $+ + + + + +$ | 3、4 |
| B | $s = -1$，$\theta = 2.5$ | 偏綠的是蘋果 | $+ + - - - -$ | 5、6 |
| C | $s = +1$，$\theta = 4.5$ | 偏紅的是蘋果 | $- - - - + +$ | 1、2 |

平手時約定取 $\theta$ 比較小的那一條。

**第 1 輪。** $u_n^{(1)} = \frac{1}{6}$，每筆權重相同。A、B、C 各錯兩筆，加權錯誤率都是 $\frac{2}{6} = \frac{1}{3}$，是 12 條裡最低的。依約定取 A：$g_1 = $ A。

$$
\epsilon_1 = \frac{1}{3}, \qquad \blacklozenge_1 = \sqrt{\frac{2/3}{1/3}} = \sqrt{2} \approx 1.414, \qquad \alpha_1 = \ln\sqrt{2} \approx 0.347
$$

更新：第 3、4 筆答錯，乘 $\sqrt{2}$，變成 $\frac{1}{6}\sqrt{2} \approx 0.2357$；其餘四筆除以 $\sqrt{2}$，變成 $\approx 0.1179$。兩者的比是 $\blacklozenge_1^2 = 2$，所以新權重正比於 $(1, 1, 2, 2, 1, 1)$。檢查：答錯那一群的總和是 $2 + 2 = 4$，答對那一群是 $1 + 1 + 1 + 1 = 4$，A 在新權重下的錯誤率正好 $\frac{1}{2}$。

**第 2 輪。** 權重正比於 $(1, 1, 2, 2, 1, 1)$，總和 8。

- A 答錯 3、4：$\frac{2 + 2}{8} = \frac{1}{2}$。上一輪的贏家現在跟丟銅板一樣。
- B 答錯 5、6：$\frac{1 + 1}{8} = \frac{1}{4}$。
- C 答錯 1、2：$\frac{1 + 1}{8} = \frac{1}{4}$。

B 與 C 平手，取 $\theta$ 小的 B：$g_2 = $ B。

$$
\epsilon_2 = \frac{1}{4}, \qquad \blacklozenge_2 = \sqrt{3} \approx 1.732, \qquad \alpha_2 = \ln\sqrt{3} \approx 0.549
$$

更新：第 5、6 筆乘 $\sqrt{3}$，其餘除以 $\sqrt{3}$，答錯與答對的倍數比是 3。原本的 $(1, 1, 2, 2, 1, 1)$ 變成正比於 $(1, 1, 2, 2, 3, 3)$。檢查：B 答錯的總和是 $3 + 3 = 6$，答對的是 $1 + 1 + 2 + 2 = 6$。

**第 3 輪。** 權重正比於 $(1, 1, 2, 2, 3, 3)$，總和 12。

- A 答錯 3、4：$\frac{4}{12} = \frac{1}{3}$。
- B 答錯 5、6：$\frac{6}{12} = \frac{1}{2}$。這次輪到 B 變成丟銅板。
- C 答錯 1、2：$\frac{2}{12} = \frac{1}{6}$。

$g_3 = $ C。

$$
\epsilon_3 = \frac{1}{6}, \qquad \blacklozenge_3 = \sqrt{5} \approx 2.236, \qquad \alpha_3 = \ln\sqrt{5} \approx 0.805
$$

**合起來。** $G(x) = \text{sign}\big(0.347\,g_1(x) + 0.549\,g_2(x) + 0.805\,g_3(x)\big)$：

| $x$ | $y$ | $g_1$ | $g_2$ | $g_3$ | 分數 | $G$ |
|---|---|---|---|---|---|---|
| 1、2 | $+1$ | $+$ | $+$ | $-$ | $0.347 + 0.549 - 0.805 = 0.091$ | $+1$ |
| 3、4 | $-1$ | $+$ | $-$ | $-$ | $0.347 - 0.549 - 0.805 = -1.007$ | $-1$ |
| 5、6 | $+1$ | $+$ | $-$ | $+$ | $0.347 - 0.549 + 0.805 = 0.602$ | $+1$ |

六筆全對，$E_{\text{in}}(G) = 0$。三個分數的精確值是 $\ln\sqrt{6/5}$、$-\ln\sqrt{15/2}$、$\ln\sqrt{10/3}$。

把三輪的數字並排：

| $t$ | $g_t$ | $\epsilon_t$ | $\blacklozenge_t$ | $\alpha_t$ | 更新後的權重（正比於） | 更新後的權重總和 $U_{t+1}$ | 前 $t$ 個合起來的 $E_{\text{in}}$ |
|---|---|---|---|---|---|---|---|
| 1 | A | $1/3$ | $1.414$ | $0.347$ | $(1, 1, 2, 2, 1, 1)$ | $0.943$ | $2/6$ |
| 2 | B | $1/4$ | $1.732$ | $0.549$ | $(1, 1, 2, 2, 3, 3)$ | $0.816$ | $2/6$ |
| 3 | C | $1/6$ | $2.236$ | $0.805$ | $(5, 5, 2, 2, 3, 3)$ | $0.609$ | $0$ |

**這個結果代表什麼。**

- $G$ 說的是「很綠或很紅的是蘋果」，這是一個兩刀才切得出來的規則，12 條 decision stump 裡沒有任何一條做得到。三條各錯三分之一的規則合起來全對，這就是 boosting。
- 每一輪被選中的規則，下一輪的加權錯誤率一定剛好是 $\frac{1}{2}$（A 在第 2 輪、B 在第 3 輪），所以基礎演算法不會連續兩輪選同一條。這是最佳重新加權的設計目標，在數字上直接看得到。
- $\epsilon_t$ 一輪比一輪小（$\frac{1}{3}, \frac{1}{4}, \frac{1}{6}$）只是這組資料的巧合，一般不會這樣；但三條規則在原始資料上的錯誤率都是 $\frac{1}{3}$，票數卻不同，是因為票數看的是當時權重下的表現。
- A「全部都是蘋果」看起來最沒內容，卻不能少。拿掉它，$x = 1, 2$ 的分數是 $0.549 - 0.805 = -0.255$，會被分錯。它在投票裡的作用像一個常數項，把整體的分數往正的方向推。
- 前兩個合起來的 $E_{\text{in}}$ 沒有進步（$\alpha_2 > \alpha_1$，所以只有兩個時 $G$ 就是 $g_2$），到第三輪才降到 0。$E_{\text{in}}(G)$ 不保證每一輪都下降，一路下降的是權重總和：$1 \to 0.943 \to 0.816 \to 0.609$，每一輪乘上 $2\sqrt{\epsilon_t(1 - \epsilon_t)}$，而且它一直壓在 $E_{\text{in}}(G)$ 上面，跟前面補充的推導一致。
- 這個例子裡三條規則一人一票也剛好全對，所以它沒有展示出「一人一票會壞掉」的情況；它展示的是重新加權怎麼逼出三條不同的規則。

驗算用的程式（純 Python）：

```python
from math import sqrt, log

X = [1, 2, 3, 4, 5, 6]
Y = [+1, +1, -1, -1, +1, +1]
N = len(X)

def stump(s, theta):
    return lambda x: s * (1 if x > theta else -1)

# 6 個門檻各配兩個方向，共 12 條；平手時取排在前面的
candidates = [(s, th) for th in [0.5, 1.5, 2.5, 3.5, 4.5, 5.5] for s in (+1, -1)]

u = [1 / N] * N
score = [0.0] * N
for t in range(1, 4):
    def eps_of(c):
        h = stump(*c)
        return sum(un for un, x, y in zip(u, X, Y) if h(x) != y) / sum(u)
    best = min(candidates, key=eps_of)
    eps = eps_of(best)
    dia = sqrt((1 - eps) / eps)
    alpha = log(dia)
    g = stump(*best)
    u = [un * dia if g(x) != y else un / dia for un, x, y in zip(u, X, Y)]
    score = [sc + alpha * g(x) for sc, x in zip(score, X)]
    e_in = sum((1 if sc > 0 else -1) != y for sc, y in zip(score, Y)) / N
    print(t, best, round(eps, 4), round(dia, 4), round(alpha, 4),
          [round(un, 4) for un in u], round(sum(u), 4), round(e_in, 4))
```

輸出的三行依序是輪次、選中的 $(s, \theta)$、$\epsilon_t$、$\blacklozenge_t$、$\alpha_t$、更新後的六個權重、權重總和、$E_{\text{in}}(G)$：

```text
1 (1, 0.5) 0.3333 1.4142 0.3466 [0.1179, 0.1179, 0.2357, 0.2357, 0.1179, 0.1179] 0.9428 0.3333
2 (-1, 2.5) 0.25 1.7321 0.5493 [0.068, 0.068, 0.1361, 0.1361, 0.2041, 0.2041] 0.8165 0.3333
3 (1, 4.5) 0.1667 2.2361 0.8047 [0.1521, 0.1521, 0.0609, 0.0609, 0.0913, 0.0913] 0.6086 0.0
```

### 講義的示範：十個點切五刀

講義第 21 頁用一組二維的小資料逐輪播放 AdaBoost-Stump，圖上數得出 5 個圈、5 個叉。每一張圖裡，點的大小代表那一輪更新後的權重，虛線是這一輪新切的那一刀，黑色粗線是目前 $G$ 的邊界。前兩張圖的黑線跟新切的那一刀疊在一起，從 $t = 3$ 的畫面起才看得出它轉彎。下表依投影片的圖與課堂上的說明整理，$t = 4$、$t = 5$ 兩列的方向與答錯的點是本文從圖上判讀的：

| 畫面 | 這一刀 | 這一刀答錯誰（下一張圖裡被放大） |
|---|---|---|
| $t = 1$ | 靠左的垂直線，右邊判成叉、左邊判成圈 | 線右邊的三個圈 |
| $t = 2$ | 靠右的垂直線，右邊判成叉、左邊判成圈 | 線左邊的四個叉 |
| $t = 3$ | 偏下的水平線，上面判成叉、下面判成圈 | 右上的大圈、右下的叉、左邊的兩個圈 |
| $t = 4$ | 中間高度的水平線，上面判成圈、下面判成叉 | 最上面的叉、底部的兩個圈 |
| $t = 5$ | 偏上的水平線，上面判成叉、下面判成圈 | 線下面的四個叉；但合起來的 $G$ 已經全部分對 |

課堂上一步一步講：一開始所有的圈和叉一樣大，decision stump 切第一刀，三個圈被分錯，AdaBoost 把它們乘上 $\blacklozenge_t$ 放大、其他的縮小。第二刀因為那三個圈很大，傾向把它們分對，代價是幾個叉被犧牲，於是叉被放大。第三刀之後，三刀加上各自的 $\alpha_t$ 投票，已經是一條轉彎的非線性邊界。到第五刀，所有的圈和叉都被 $G$ 分開。課堂上還提醒，圖上有一個叉和一個圈看起來壓在邊界上，那是放大縮小造成的視覺效果，它們其實都在正確的一邊。

本文替前兩刀算一下數字：10 筆資料權重相同、第一刀錯 3 筆，$\epsilon_1 = 0.3$，$\blacklozenge_1 = \sqrt{7/3} \approx 1.528$，$\alpha_1 \approx 0.424$。三個答錯的圈各乘 1.528，七個答對的點各除以 1.528，單筆權重的比是 $\frac{7}{3}$；三個圈的總和 $3 \times 7 = 21$ 等於七個點的總和 $7 \times 3 = 21$。第二刀在這組權重（總和 42）下答錯四個叉，$\epsilon_2 = \frac{4 \times 3}{42} = \frac{2}{7}$，$\alpha_2 = \ln\sqrt{5/2} \approx 0.458$。$\alpha_2 > \alpha_1$，只有兩刀時 $G$ 就等於第二刀，這是前兩張圖的黑線都跟新切的那一刀重疊的原因。

最後一張圖的 $G$ 就是講義第 7 頁講動機時用的那張圖。講義在這頁下方寫 'Teacher'-like algorithm works!，課堂上的說法是，老師和學生的教學模型不只是想像，真的可以用 AdaBoost 這樣的演算法做出來。

### 複雜一點的資料：切一百刀

講義第 22 頁換成一組比較多點的資料，圈和叉之間的邊界肉眼看起來像一條正弦波。講義印出來的是 $t = 100$ 的畫面：背景有很多條灰色的垂直線與水平線，黑色邊界是一條階梯狀的折線，大致沿著那條波走。

課堂上是從 10 刀一路播到 100 刀：10 刀的時候雛形已經出來，20、30 刀愈來愈細緻，$E_{\text{in}}$ 也許還沒到 0 但已經很小，之後幾十刀多半是微調。課堂上的結論有兩點。第一，這是一個非線性的模型，一刀一刀切再拼起來，邊界愈變愈好。第二，它有效率：相較於 kernel SVM，不必把資料轉換到另一個空間再解二次規劃，切一百刀就把邊界切出來了。講義的標語是 AdaBoost-Stump: non-linear yet efficient。

### 應用：即時人臉偵測

講義第 23 頁的例子是它稱為「世界上第一個『即時』人臉偵測程式」的系統，核心模型是 AdaBoost-Stump。課堂上解釋「即時」的意思：影片每秒大約 30 個畫面，要在這個速度下找出畫面裡所有的人臉。講義列了兩個重點：

- **特徵選擇。** 在 24×24 的影像裡，有 162,336 種可能的小區塊圖樣可以當特徵。每一條 decision stump 只看一個特徵，AdaBoost-Stump 跑完，等於從這十六萬多種裡挑出了關鍵的幾個，再做線性組合。課堂上的描述是：把圖片切成細細碎碎的小張（一般叫 patch），找出哪些小張帶有關鍵的圖案，再用 AdaBoost 把它們的資訊整合起來。講義的說法是 feature selection achieved through AdaBoost-Stump。
- **效率。** 只靠上面這樣還做不到即時。課堂上指出，一張大圖裡有人臉的位置是少數，大部分位置都沒有。所以這個程式改造了線性組合 $G$：投票投到一半，如果分數已經很低，就直接判定不是人臉，不再算下去；只有可能是人臉的位置才把整個 $G$ 算完。講義寫的是 modified linear aggregation $G$ to rule out non-face earlier。

本文補充：講義沒有寫出這個系統的名字，它一般被稱為 Viola–Jones 人臉偵測器。

講義對這一頁的總結是：AdaBoost-Stump 同時做到有效率的特徵選擇與組合。

### Fun Time：用到幾個特徵

**題目（第 24 頁）：** 一份資料有 9876 筆，每筆 $\mathbf{x}_n \in \mathbb{R}^{5566}$。跑了 1126 輪 AdaBoost-Stump 之後，$G$ 實際用到的 $\mathbf{x}$ 的相異特徵有幾個？

1. $0 \le \text{number} \le 1126$
2. $1126 < \text{number} \le 5566$
3. $5566 < \text{number} \le 9876$
4. $9876 < \text{number}$

**答案：1。** 每一條 decision stump 只看一個特徵，1126 輪就是 1126 條，最多用到 1126 個不同的特徵。課堂上的說法也是這一句。

本文補充其他選項為什麼不可能：選項 2 需要超過 1126 個特徵，但只有 1126 條 stump；選項 3 與 4 更超過了特徵總數 5566。實際的數字通常比 1126 少，因為不同輪可以選到同一個特徵、切在不同的門檻。題目裡的 9876（資料筆數）不影響答案。這題就是前一小節「特徵選擇」的數字版：5566 個特徵裡，$G$ 至少有 4440 個完全沒用到。

### 這堂的總結與下一堂

講義第 25 頁把四節各收成一句：

| 小節 | 講義的一句話 |
|---|---|
| Motivation of Boosting | aggregate weak hypotheses for strength |
| Diversity by Re-weighting | scale up incorrect, scale down correct |
| Adaptive Boosting Algorithm | two heads are better than one, theoretically |
| Adaptive Boosting in Action | AdaBoost-Stump useful and efficient |

課堂上最後把這兩堂並排：bagging 是 uniform 的 aggregation，AdaBoost 是 linear 的 aggregation，下一堂要介紹 conditional 的 aggregation。

## 自我檢查

**1. 五筆資料，$u_n^{(1)} = \frac{1}{5}$。$g_1$ 答錯其中兩筆。算出 $\epsilon_1$、$\blacklozenge_1$、$\alpha_1$ 與每筆資料的 $u_n^{(2)}$，並驗證 $g_1$ 在新權重下的錯誤率是 $\frac{1}{2}$。**

答案：$\epsilon_1 = \frac{2}{5}$，$\blacklozenge_1 = \sqrt{(3/5)/(2/5)} = \sqrt{1.5} \approx 1.225$，$\alpha_1 = \ln 1.225 \approx 0.203$。答錯的兩筆各是 $0.2 \times 1.225 \approx 0.245$，答對的三筆各是 $0.2 / 1.225 \approx 0.163$。答錯的總和 $2 \times 0.245 = 0.490$，答對的總和 $3 \times 0.163 = 0.490$，相等。

**2. 接續六張水果照片的例子。第 3 輪更新後權重正比於 $(5, 5, 2, 2, 3, 3)$。第 4 輪 A、B、C 的加權錯誤率各是多少？誰被選中？$\alpha_4$ 是多少？加進去之後 $G$ 還是全對嗎？**

答案：總和 20。A 答錯 3、4：$\frac{4}{20} = \frac{1}{5}$；B 答錯 5、6：$\frac{6}{20} = \frac{3}{10}$；C 答錯 1、2：$\frac{10}{20} = \frac{1}{2}$（上一輪的贏家）。選 A，$\blacklozenge_4 = \sqrt{4} = 2$，$\alpha_4 = \ln 2 \approx 0.693$。A 對每個 $x$ 都投 $+1$，三個分數各加 $0.693$：$0.784$、$-0.314$、$1.295$，符號不變，$G$ 仍然全對。同一條規則可以在不相鄰的輪次被重複選中。

**3. 某一輪基礎演算法回傳的 $g_t$ 加權錯誤率剛好是 $\frac{1}{2}$。這一輪的 $\blacklozenge_t$、$\alpha_t$ 是多少？權重會怎麼變？之後會發生什麼事？**

判準：答案要說出 $\blacklozenge_t = 1$、$\alpha_t = 0$，權重完全不變；下一輪基礎演算法面對同樣的權重，如果它是確定性的，就會回傳同一個 $g_t$，演算法從此原地踏步。還要能連回理論保證的條件：這正是「每一輪都要 $\epsilon_t \le \epsilon < \frac{1}{2}$」被違反的情況。

**4. 為什麼最後不用一人一票，而要用 $\alpha_t$？為什麼 $\epsilon_t = \frac{1}{2}$ 的 $g_t$ 應該拿 0 票，$\epsilon_t = 0.7$ 的 $g_t$ 卻不是 0 票？**

判準：第一問要提到 $g_2$ 之後的假說是在刻意扭曲的權重下選出來的，對原本的 $E_{\text{in}}$ 不一定好，所以要依表現給不同票數。第二問要算出 $\epsilon_t = 0.7$ 時 $\blacklozenge_t = \sqrt{3/7} \approx 0.655$、$\alpha_t \approx -0.424$，並解釋負票等於把 $g_t$ 反過來用，而反過來的錯誤率是 $0.3$；$\frac{1}{2}$ 是正反兩面都沒有資訊的唯一位置。

**5. 用本文補充的那個上界：$N = 1000$，每一輪都有 $\epsilon_t \le 0.4$。最多幾輪之後保證 $E_{\text{in}}(G) = 0$？如果基礎演算法更弱，只能保證 $\epsilon_t \le 0.45$ 呢？**

答案：$\epsilon = 0.4$ 時 $r = 2\sqrt{0.24} \approx 0.9798$，$T > \frac{\ln 1000}{\ln(1/r)} \approx 338.4$，339 輪。$\epsilon = 0.45$ 時 $r = 2\sqrt{0.2475} \approx 0.99499$，$T > 1374.6$，1375 輪。基礎演算法離亂猜愈近，需要的輪數增加得很快，但對 $N$ 的依賴仍然只是 $\ln N$：$N$ 從 1000 變成 1,000,000，輪數只變成兩倍。

## 練習與對應閱讀

**兩個學期的對應週次。** [Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)在 W12（11/18）一口氣講技法第 8 到第 11 堂，這堂的投影片代號是 [208u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/208u_handout.pdf)。[Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)把第 7、8 堂排在 W11（11/18）；這一週的 208u 投影片在 2026-09-30 查的時候還沒上線，所以本文只用 MOOC 版講義。

**教科書。** 兩份課程頁都沒有替這堂標 [Learning from Data](http://amlbook.com)（LFD）的章節。課程頁列的延伸閱讀是 [Freund 與 Schapire 的 A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf)，是 AdaBoost 的作者自己寫的導論。

**作業。** [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)（2024-12-02 發布、12-16 截止）裡跟這堂直接相關的題目如下，沒有官方解答：

| 題 | 類型 | 練什麼 |
|---|---|---|
| Q3 | 自動批改 | 資料有 87% 是負例，$g_1$ 回傳常數 $-1$，問第二輪正例與負例的權重比。做法跟「四筆資料錯一筆」那題 Fun Time 一樣：先算 $\epsilon_1$，再看答錯與答對的倍數比 |
| Q6 | 人工批改 | 證明 $U_{t+1}/U_t = 2\sqrt{\epsilon_t(1 - \epsilon_t)}$。題目提示這是 AdaBoost 在 $O(\log N)$ 輪內收斂的證明骨幹，也就是本文補充裡只給結論的第一件事；證明要用到的東西都在「縮放因子」那一小節 |
| Q10–12 | 人工批改 | 在 LIBSVM 的 [madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon)（訓練）與 madelon.t（測試）上實作 AdaBoost-Stump，跑滿 $T = 500$ 輪，畫 $E_{\text{in}}(g_t)$ 與 $\epsilon_t$、$E_{\text{in}}(G_t)$ 與 $E_{\text{out}}(G_t)$、$U_t$ 的曲線 |

Q10 要把 HW2 的 decision stump 擴充成多維、吃權重的版本，最簡單的做法是每個特徵各找最佳的 stump，再挑全部特徵裡最好的。沒有官方解答，所以要自己設驗收方法：可以拿 scikit-learn 的 `AdaBoostClassifier` 搭深度 1 的決策樹當對照，看 $E_{\text{in}}(G_t)$ 的趨勢是否一致；也可以先用上面六筆資料的例子檢查自己的實作，三輪的 $\epsilon_t$ 應該是 $\frac{1}{3}, \frac{1}{4}, \frac{1}{6}$。本文用 scikit-learn 1.9.1 在這六筆資料上實測過：`estimator_errors_` 的前四個值是 $\frac{1}{3}, \frac{1}{4}, \frac{1}{6}, \frac{1}{5}$，跟手算相同；`estimator_weights_` 則是 $0.693, 1.099, 1.609, 1.386$，剛好是講義 $\alpha_t$ 的兩倍。所有票數同乘一個正數不會改變 $G$，所以拿它對照時比 $\epsilon_t$ 與 $E_{\text{in}}(G_t)$ 就好，不要直接比票數。整份作業的導讀在[技法作業與期末專題](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)。

**今晚可以做的一件事。** 把上面那段程式改成二維：自己擺十來個圈和叉，每一輪印出權重最大的幾個點。你會看到它們多半是邊界附近、一直被分錯的那幾個，這就是老師在做的事。

**下一堂。** [技法第 9 堂：決策樹](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)講第三種合起來的方式：不同的 $\mathbf{x}$ 聽不同假說的 conditional aggregation。AdaBoost 自己會在技法第 11 堂再出現一次，那時候會解釋 $\alpha_t = \ln\blacklozenge_t$ 這個選擇從哪裡來。

## 課程影片來源

原始影片：[Motivation of Boosting](https://www.youtube.com/watch?v=hL8DjIHAzZY)、[Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8)、[Adaptive Boosting Algorithm](https://www.youtube.com/watch?v=vqTXLTYqbbw)、[Adaptive Boosting in Action](https://www.youtube.com/watch?v=5wPN87bwoaE)

- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~htlin/mooc/)

查核日期：2026-10-13。影片 ID、標題與長度於當天從官方播放清單取得；YouTube 上沒有字幕軌，本文的課堂說法來自自行轉錄的逐字稿。

## 更新紀錄

- 2026-10-13：系列改為一堂一篇，這篇是新拆出的一堂，依講義與影片逐字稿寫成。

## 參考資料

- [技法第 8 堂講義 208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf)：本文的主要底本，四節的推導、四題 Fun Time、第 21 與 22 頁的示範圖、第 23 頁的人臉偵測都出自這份講義。
- [機器學習技法 YouTube 播放清單](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)：四支影片的 ID 與標題；文中「課堂上」的說法轉述自這四支影片的機器轉錄逐字稿。
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/)：官方講義與錄影入口。
- [Machine Learning, Fall 2024 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)：對應週次、208u 投影片與延伸閱讀清單。
- [Machine Learning, Fall 2026 課程頁](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)：對應週次。
- [Fall 2024 Homework 7（hw7.pdf）](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)：Q3、Q6、Q10–12 的題目內容。
- [LIBSVM Data: madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon)：HW7 Q10–12 用的資料集。
- [Freund & Schapire, A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf)：課程頁列的延伸閱讀。
- [Learning from Data 教科書網站](http://amlbook.com)：課程頁對照章節用的教科書；這堂沒有對應章節。
- [台大林軒田 機器學習基石與技法 導讀：課程總覽](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview)：整門課的位置與閱讀路線。
