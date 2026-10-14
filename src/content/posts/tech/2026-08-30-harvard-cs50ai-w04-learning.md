---
title: "Learning——監督式學習、k-NN、SVM、強化學習 Q-learning 與 Nim｜Harvard CS50 AI 第 4 週"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, machine-learning, supervised-learning, knn, svm, reinforcement-learning, q-learning, nim, shopping, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 5
tldr: "第 4 週講機器學習的三種形式。監督式學習從有標籤的資料學出 hypothesis function：分類可以看最近的 k 個鄰居，或用一組權重畫出決策邊界（perceptron learning rule、logistic regression、support vector machine），再用損失函數、regularization 與 cross-validation 對付 overfitting。強化學習用 Q-learning 依 reward 更新每個 state 與 action 的估計值，ε-greedy 留一點機率隨機探索。非監督式學習以 k-means 分群。附逐段時間連結，以及 Shopping、Nim 兩個專案的解題思路與檢查方式。"
description: "Harvard CS50 AI 第 4 週 Learning 導讀：依 2020 年講課錄影的字幕逐段整理最近鄰與 k-NN、權重與 perceptron learning rule、hard 與 soft threshold、support vector machine、迴歸、0-1／L1／L2 損失函數、overfitting 與 regularization、holdout 與 k-fold cross-validation、scikit-learn 紙鈔實測、Markov decision process、Q-learning、ε-greedy、Nim 與 k-means，每節附可點的時間連結與自我檢查，另有 Shopping 與 Nim 兩個專案的規格、解題思路、虛擬碼、容易出錯的地方與檢查方式，完整參考實作預設摺疊。專案規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en)

**影片狀態：已附影片。** 全片 1:45:48。本文的「講課導讀」依這支錄影的英文字幕逐段寫成，每一節開頭有時間連結，點了頁面上的播放器會跳到那一段。講課用 Nim 示範 Q-learning，但沒有介紹本週的兩個專案作業，專案部分依課程官網與官方 distribution code 寫成。[跳到播放器](#課程影片與時間軸)｜[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年課程官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

第 4 週從「把做法寫給電腦」轉到「給電腦資料，讓它自己找規律」，依序講機器學習的三種形式：

- **監督式學習**：資料是一組組「輸入與答案」，目標是學出一個能從輸入猜出答案的函數。講課比較了三種分類做法（看最近的鄰居、用權重畫一條線、support vector machine），再講怎麼替學出來的函數打分數（損失函數），以及分數太好反而有問題的情況（overfitting）。
- **強化學習**：沒有現成答案，agent 做了動作之後拿到 reward 或懲罰，Q-learning 用這些數字逐步修正「在這個 state 做這個 action 值多少」。
- **非監督式學習**：資料沒有標籤，k-means 靠「指派到最近的中心、再把中心移到平均位置」把資料分成 k 群。

這篇分成兩半：前半「講課導讀」跟著錄影走，後半是 Shopping（k-NN 分類）與 Nim（Q-learning）兩個專案：先講解題思路、虛擬碼、容易出錯的地方與檢查方式，完整參考實作摺疊在各專案最後。

## 課程影片與時間軸

全片 1 小時 46 分，下面「講課導讀」的十個小節依序涵蓋整支錄影。每一節開頭和文中的時間連結都能點，頁面上的播放器會跳到那一段；某一節看不懂時，直接回去聽講者怎麼講。

```youtube
url: https://www.youtube.com/watch?v=-g0iJjnO2_w
title: Learning - Lecture 4 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube：[Week 4 Learning (2020 錄製)](https://www.youtube.com/watch?v=-g0iJjnO2_w)

> 時間說明：下表時間已依帶時間碼的英文字幕核對（2026-10-13），是講者開始講各主題的位置，不是官方章節。此表只描述這支 2020 年的錄影；課程目前版本的講課內容與順序可能不同，且影片本身沒有介紹本週的專案作業。

| 時間（點了從該處播放） | 內容 |
|---|---|
| [0:00–12:56](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=0s) | 機器學習、監督式學習與分類；hypothesis function；最近鄰與 k-NN |
| [12:56–33:19](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=776s) | 決策邊界、權重與內積、perceptron learning rule、hard threshold 與 logistic regression |
| [33:19–39:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1999s) | Support vector machine 與 maximum margin separator |
| [39:16–49:33](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2356s) | 迴歸；損失函數（0-1、L1、L2） |
| [49:33–59:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2973s) | Overfitting、regularization、holdout 與 k-fold cross-validation |
| [59:43–1:09:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3583s) | scikit-learn 示範：用紙鈔真偽資料比較 perceptron、SVM、k-NN |
| [1:09:47–1:19:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4187s) | 強化學習與 Markov decision process，格子世界的例子 |
| [1:19:47–1:31:37](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4787s) | Q-learning 的更新式、greedy 的問題、ε-greedy |
| [1:31:37–1:38:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5497s) | 用 Nim 示範自我對弈訓練；function approximation |
| [1:38:43–1:45:48](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5923s) | 非監督式學習、分群與 k-means；收尾 |

> 官方筆記：[Week 4 Notes](https://cs50.harvard.edu/ai/2020/notes/4/)

## 講課導讀

以下依錄影的英文字幕逐段寫成。光讀字幕看不到投影片，散佈圖、各種決策邊界與格子世界的畫面本文不重建，只寫講者口頭說出的內容與數字；這些圖可以到[官方筆記](https://cs50.harvard.edu/ai/2020/notes/4/)看。公式依講者口述寫出，並對照官方筆記的文字與式子圖；兩邊不一樣的地方會寫明。每節結尾的自我檢查都是本文出的題目，不是講課內容；其中沿用講課例子的會寫明，標「本文自擬」的連例子也是本文編的。

### 監督式學習、分類與最近鄰

[錄影 0:00–12:56](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=0s)

講者 Brian Yu 先畫出這一週和前幾週的分界：之前是人把怎麼搜尋、怎麼滿足限制條件寫給電腦；**機器學習**（machine learning）則不給明確的做法，只給資料，讓電腦自己找出其中的規律來完成任務。

第一種形式是**監督式學習**（supervised learning）：資料集是一組組「輸入與輸出」，電腦要學出一個把輸入對應到輸出的函數。監督式學習裡先談**分類**（classification），也就是把輸入對應到離散的類別。講者舉了兩個例子：給一張紙鈔的資訊，判斷是真鈔還是偽鈔；給某一天的天氣資料，判斷會不會下雨。[第 2 週](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)處理下雨問題時要先知道各種機率，但實務上常常拿不到那些機率，拿得到的是一大堆歷史資料。

資料可以排成一張表：每一列是一天，有當天的濕度（humidity）、氣壓（pressure），以及一個**標籤**（label），由人標上那天有沒有下雨。「監督式」指的就是這些標籤是人給的。

用函數的說法：真實世界有一個函數 `f(濕度, 氣壓)`，輸出下雨或不下雨。沒有人知道 `f` 到底長怎樣，所以要找一個**假說函數**（hypothesis function）`h` 來逼近它，同樣吃濕度與氣壓、輸出下雨或不下雨，並希望 `h` 和 `f` 盡量一致。分類問題的目標就是找出這個 `h`。

因為輸入只有兩個數字，可以把每一天畫成平面上的一個點：x 軸是濕度，y 軸是氣壓，下雨的日子畫藍點，沒下雨的畫紅點。講者順帶說明，輸入更多時就是更多維度，人想像不出三維以上的圖，但對電腦來說每一維只是多記一個數字，10 維或 100 維都不成問題。

現在來了一個沒有標籤的新點（白點），該算藍的還是紅的？如果它旁邊最近的是藍點，多數人會猜藍的。把這個直覺寫成演算法，就是**最近鄰分類**（nearest-neighbor classification，[8:15](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=495s)）：給一個輸入，找出離它最近的那一筆資料，採用那筆資料的類別。

接著是它會出問題的情況。講者指著另一個白點：離它最近的是一個紅點，但它周圍有一大群藍點。照最近鄰的規則它是紅的，可是看整體，說它是藍的也有道理。只憑這些資料無法確定哪個才對，不過多看幾個鄰居常常可以得到比較好的結果，但不保證。

於是有了 **k-nearest-neighbor 分類**（k-NN，[10:27](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=627s)）：`k` 是自己選的數字，例如 3、5、7；找出離輸入最近的 `k` 筆資料，採用其中最多的那個類別。講者的例子是看 5 個最近的點，3 個說下雨、2 個說不下雨，就判定下雨，等於每個鄰居投一票。

講者在這裡先打了預防針：沒有哪一個演算法永遠比別的好，各有取捨，要看資料；機器學習的研究常常就是多試幾種，看哪一種效果最好。k-NN 的缺點（[12:25](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=745s)）是直接做的話會很慢，因為要量新的點和每一筆資料之間的距離。他提到有資料結構能加速找鄰居，也可以先刪掉一些用不到的資料點，但沒有細講。

**自我檢查｜先寫下答案，再展開。** 一個新點和五筆已標記資料的距離由近到遠是：0.5（紅）、0.8（藍）、0.9（藍）、1.5（紅）、1.6（紅）。`k` 取 1、3、5 時，k-NN 各會把它分到哪一類？（本文自擬）

<details>
<summary>答案</summary>

`k` = 1：只看最近的一筆，是紅的，所以判紅。`k` = 3：最近三筆是紅、藍、藍，藍 2 票對紅 1 票，判藍。`k` = 5：五筆是紅、藍、藍、紅、紅，紅 3 票對藍 2 票，判紅。

同一個點、同一份資料，`k` 不同答案就不同。講課沒有說哪個 `k` 才對，只說多看幾個鄰居常常可以得到比較好的結果、但不保證，`k` 是要自己選、自己試的參數。

</details>

### 用一條線分類：權重、perceptron learning rule 與兩種門檻

[錄影 12:56–33:19](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=776s)

最近鄰只看新點附近的資料。另一種思路是看全部的資料，找一條**決策邊界**（decision boundary）把下雨與不下雨的日子分開；在二維平面上，這條邊界可以是一條直線。講者把這種找線的做法稱為 linear regression（一般教材多半把「迴歸」留給預測數值的問題，本節這種用線分類的模型叫線性分類器；這句是本文的補充）。

如果有一條直線能把兩類資料完全分開，這份資料就是**線性可分**（linearly separable）。真實資料通常沒這麼乾淨，有離群值也有雜訊，常常找不到完美的線，但還是可以找一條「分得相當好」的線。怎樣算好，後面講損失函數時才定義。

**把線寫成算式**（[14:56](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=896s)）。兩個輸入叫 `x₁`（濕度）與 `x₂`（氣壓）。邊界是輸入的線性組合：每個輸入乘上一個數字，叫**權重**（weight），再加上一個常數，看結果是不是大於等於 0。

```text
h(x₁, x₂) = 下雨      如果 w₀ + w₁x₁ + w₂x₂ ≥ 0
          = 不下雨    其他情況
```

`x₁`、`x₂` 是輸入，直線的斜率與位置由 `w₀`、`w₁`、`w₂` 決定。學習要做的事就是選出一組好的權重。為了方便計算，類別改用數字表示：1 是下雨，0 是不下雨。

**向量寫法**（[18:48](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1128s)）。向量就是一串數字，在 Python 裡可以用 list 或 tuple 表示。把三個權重排成權重向量 **w** = (w₀, w₁, w₂)，輸入排成 **x** = (1, x₁, x₂)。多放一個 1 是為了讓兩個向量一樣長：`w₀` 沒有對應的輸入，就當作乘以 1。兩個向量的**內積**（dot product，[21:04](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1264s)）是把對應位置相乘再全部加起來，結果正好是 `w₀ + w₁x₁ + w₂x₂`。所以假說函數常寫成：

```text
h_w(x) = 1    如果 w · x ≥ 0
       = 0    其他情況
```

下標的 **w** 表示這個假說由權重決定：權重不同，得到的假說就不同。

**Perceptron learning rule**（[23:29](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1409s)）。怎麼找權重？講者介紹最常見的做法之一，並聲明只講概念、不深入數學。先隨便給一組權重，然後一次看一筆資料 (x, y)，其中 y 是實際的答案（1 或 0），依下面的規則更新每一個權重：

```text
wᵢ ← wᵢ + α × (y − h_w(x)) × xᵢ
```

講者是把括號裡的東西換成白話來解釋的：`y` 是實際值，`h_w(x)` 是目前的估計，兩者相減。

- **估對了**：實際值減估計是 0，後面整項是 0，權重不變。
- **實際是 1、估成 0**：差是正的，權重加上一個正數，讓內積變大，下次比較容易估成 1。
- **實際是 0、估成 1**（其實沒下雨卻猜下雨）：差是負的，權重調小，讓內積變小，比較不容易再猜下雨。

講者說明這兩種情況時補了一句，大意是先假設這些 x 是正的。字幕裡他沒有把整條式子唸出來，只說「原本的權重加上一項」；乘上 `xᵢ` 這一項取自官方筆記的式子，筆記的文字也寫權重會增加「`xᵢ` 乘上 `α`」那麼多。

`α` 叫**學習率**（learning rate），是自己選的數字，決定每次調多少：`α` 大就一次調很多，小就調得少。一筆一筆資料反覆做下去，希望權重最後收斂到一組分得不錯的值。

**Hard threshold 的限制**（[27:55](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1675s)）。這樣學出來的是一個門檻函數：內積沒過門檻時輸出一直是 0，一過門檻就跳成 1，中間沒有別的值。講者先用兩個新點說明它的限制：兩個點都落在「下雨」那一側，一個離線很遠，一個緊貼著線，人會覺得前者比較確定，但函數對兩者都只說「下雨」。接著他歸納成兩個問題。一是這種有斷點的函數在數學上不好處理，進一步學機器學習要對曲線取導數時會很麻煩。二是它沒有程度之分，沒辦法表達「非常確定會下雨」和「大概會下雨、但不太確定」的差別。

**Logistic regression 與 soft threshold**（[31:37](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1897s)）。解法是把門檻函數換成 logistic function，一條平滑的曲線。輸出不再只有 0 和 1，而是 0 到 1 之間的任何實數：離線很遠的一側接近 0，另一側接近 1，中間則是像 0.7 這樣的值，意思是「比較可能下雨，但沒那麼有把握」。這個輸出可以當成屬於該類別的機率來解讀。

**自我檢查｜先寫下答案，再展開。** 目前的權重是 **w** = (−3, 2, 1)，學習率 `α` = 0.1。來了一筆資料 `x₁` = 1、`x₂` = 2，實際答案 `y` = 0。用上面的規則更新一次，新的權重是多少？更新後對這筆資料的預測改對了嗎？（本文自擬）

<details>
<summary>答案</summary>

先算目前的預測：**x** = (1, 1, 2)，內積是 −3 × 1 + 2 × 1 + 1 × 2 = 1，大於等於 0，所以 `h` = 1。實際是 0，估錯了，`y − h` = −1。

三個權重各自更新：

- `w₀` ← −3 + 0.1 × (−1) × 1 = −3.1
- `w₁` ← 2 + 0.1 × (−1) × 1 = 1.9
- `w₂` ← 1 + 0.1 × (−1) × 2 = 0.8

新的內積是 −3.1 + 1.9 + 0.8 × 2 = 0.4，仍然大於等於 0，預測還是 1，還沒改對。但內積從 1 降到 0.4，方向是對的。同一筆資料再更新一次，權重變成 (−3.2, 1.8, 0.6)，內積是 −3.2 + 1.8 + 0.6 × 2 = −0.2，小於 0，預測才翻成 0。在這筆資料上每更新一次，內積固定少 0.1 × (1² + 1² + 2²) = 0.6。一次更新不一定夠，這也是講者說要「一筆一筆反覆做」的原因。

</details>

### Support vector machine：挑離兩邊都最遠的那條線

[錄影 33:19–39:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=1999s)

第三種做法是 **support vector machine**（SVM）。講者同樣不講數學，只用圖說明動機：能把兩群點分開的線其實有很多條，而它們並不一樣好。

他依序看了三條線。第一條把紅點與藍點完全分開，但緊貼著其中一些點；這種線讓人不放心，因為新來的點只要稍微偏一點就會落到線的另一側，明明看起來該是紅的卻被判成藍的。第二條是斜線，同樣把所有點分對了，但離紅點很近，問題一樣。如果只求找到一組能把訓練資料分對的權重，這幾條線分不出優劣，因為它們在訓練資料上都是全對。第三條才是直覺上會畫的線：離紅點與藍點都盡量遠，這樣新資料和訓練資料有點出入時，還是分得對。

SVM 要找的就是這條線，叫 **maximum margin separator**（[36:12](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2172s)）：讓邊界到兩群點的距離最大的那個邊界。做法是找出 **support vector**，也就是離邊界最近的那些點，再讓邊界和它們之間的距離盡量大。

在二維是找一條線，在更高的維度則是找一個 hyperplane。能在高維度運作還帶來另一個好處（[37:28](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2248s)）：處理線性不可分的資料。講者的例子是一團紅點被藍點包圍，任何直線都會分錯一大堆點；SVM 在更高的維度裡運作，可以找到像圓這樣的決策邊界，把兩群分開。講者沒有說明怎麼做到，只給了結論。

到這裡已經有三種分類方法：最近鄰、權重加 perceptron learning rule、SVM。講者重複了一次，沒有哪一種必然比較好，要看資料，也要靠實驗。

**自我檢查｜先寫下答案，再展開。** 資料只有一個輸入。紅點在 1 與 2，藍點在 6 與 8。「小於 2.5 判紅」與「小於 4 判紅」這兩個邊界都把四個點分對了。Maximum margin separator 是哪一個？support vector 是哪些點？新來一個點在 3，兩個邊界各會怎麼判？（本文自擬）

<details>
<summary>答案</summary>

是 4。兩群之間最靠近的兩個點是紅的 2 與藍的 6，正中間是 4，邊界到兩邊各有 2 的距離，沒辦法再更遠。這兩個最靠近邊界的點（2 與 6）就是 support vector；1 與 8 離得更遠，不影響邊界的位置。

新點 3：用 2.5 當邊界會判成藍的，可是它離紅點 2 只有 1，離藍點 6 有 3；用 4 當邊界則判成紅的。兩個邊界在訓練資料上都是全對，差別只在碰到新資料時才顯現，這就是講者說第一條線「讓人不放心」的地方。

</details>

### 迴歸與損失函數：怎麼替一個假說打分數

[錄影 39:16–49:33](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2356s)

分類預測的是離散的類別。有時候要預測的是一個實數，這種監督式學習問題叫**迴歸**（regression）。講者的例子是公司想知道廣告費和銷售額的關係：輸入是花在廣告上的錢，輸出是銷售額，手上有過去每個月的廣告費與銷售額。把資料畫在平面上（x 軸廣告費、y 軸銷售額），找一條貼近這些點的直線；這次線的用途是估計，想知道某個廣告預算大概能賣多少，就到線上去查。

**怎麼評估**（[41:59](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2519s)）。前面每一種方法都會產生一個假說，需要一個方法衡量它好不好。講者把這件事接回之前講過的最佳化（本系列[第 3 週](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization)）：當時是把目標函數推到最大，或把成本函數壓到最小；這裡要壓到最小的是**損失函數**（loss function），它衡量假說表現得有多差，每猜錯一次就損失一些效用（utility）。損失函數可以自己定，講者介紹三個常見的。

**0-1 loss**（[43:30](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2610s)）用在離散類別：實際值等於預測，損失是 0；不等，損失是 1。把每一筆資料的損失加起來，就是這個假說的 empirical loss。講者拿下雨的那條決策邊界示範：落在正確一側的點損失都是 0；有四個點分錯了（有的實際下雨卻被判成不下雨，有的相反），各算 1，總損失是 4。如果在這份資料上任何直線都至少會分錯四個點，這條線就是直線裡最好的。

**L1 loss**（[47:08](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2828s)）用在預測數值的情況。這時候不只在乎對不對，還在乎差多少：實際銷售額是 2,800 美元，預測 2,900 算相當不錯，預測 1,000 就差多了。L1 loss 取實際值減預測值的絕對值，再對所有資料加總。在廣告與銷售的圖上，它就是每個資料點到那條線的垂直距離。

**L2 loss**（[48:28](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2908s)）改用差的平方，所以偏得越遠罰得越重。講者的比較是：兩筆資料各差 1，和一筆資料差 2，L2 對後者罰得更重。選哪一個看你在乎什麼：很在乎離群的情況也要估準，就用 L2 這一類；資料裡離群值很多、又不特別想把它們擬合進來，L1 可能比較合適。

**自我檢查｜先寫下答案，再展開。** 沿用講課的數字：實際銷售額 2,800，兩個預測分別是 2,900 與 1,000。各自的 L1 loss 與 L2 loss 是多少？預測 1,000 的損失是預測 2,900 的幾倍？用 L1 與 L2 各算一次。

<details>
<summary>答案</summary>

預測 2,900：差 100，L1 是 100，L2 是 100² = 10,000。預測 1,000：差 1,800，L1 是 1,800，L2 是 1,800² = 3,240,000。

用 L1 衡量，第二個預測的損失是第一個的 18 倍；用 L2 衡量是 324 倍（18 的平方）。平方會把大的誤差放得更大，所以用 L2 當目標時，模型會優先去拉近那些偏得最遠的點。講者舉的「兩筆各差 1」對「一筆差 2」也是同一件事：L1 都是 2，L2 是 2 對 4。18 倍、324 倍與 2 對 4 是本文算的，講課沒有報這幾個數字。

</details>

### Overfitting、regularization 與 cross-validation

[錄影 49:33–59:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=2973s)

不管用哪一種損失函數，都有同一個風險：**overfitting**，也就是模型貼訓練資料貼得太緊，結果沒辦法推廣到沒看過的資料。訓練模型的目的是用過去的資料預測未來，例如拿過去一年的晴雨資料預測之後會不會下雨，對訓練資料的準確度只是手段。

講者舉了兩個例子。分類的例子：一條直線把紅藍兩類分得不錯，只有一個離群的紅點落在藍的那一側，所以 empirical loss 不是 0。如果只想把損失壓到 0，可以畫一條彎彎曲曲的邊界，特地繞過去把那個紅點圈進來。這條邊界在訓練資料上全對，但它附近再出現新的點時，我們多半仍然希望判成下雨，因為那個紅點很可能只是離群值。迴歸的例子：不畫直線，改畫一條把每個資料點都連起來的線，損失是 0，但同樣很難推廣。

**把複雜度算進成本**（[53:09](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3189s)）。之前一直把假說的成本定成它的損失，只壓這個數字就會走向 overfitting。對策是在成本裡加一項：

```text
cost(h) = loss(h) + λ × complexity(h)
```

`complexity(h)` 衡量假說有多複雜，怎麼量要自己定義。講者說這是 Occam's razor 式的想法：偏好比較簡單的決策邊界，例如直線，因為簡單的解比較可能推廣到其他輸入。`λ` 是自己選的參數：`λ` 大，複雜的假說被罰得重；`λ` 小，只罰一點點。這種除了損失還把複雜度算進去的做法叫 **regularization**。

**留一部分資料來測試**（[56:21](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3381s)）。另一個防 overfitting 的辦法是做實驗，直接看模型能不能推廣。**Holdout cross-validation** 把資料分成兩份：**訓練集**（training set）用來訓練模型，**測試集**（testing set）用來看訓練好的模型表現如何。模型沒看過測試集，所以如果它只是把訓練集背起來，在測試集上就會表現得差。

Holdout 的缺點是有一大塊資料沒拿來訓練，例如對半分就有 50% 沒用上，而用上它們也許能得到更好的模型。**k-fold cross-validation**（[58:19](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3499s)）改成把資料分成 `k` 份、做 `k` 次實驗。講者以 10 份為例：每次留一份當測試集，用其餘九份訓練，再看模型在留下的那一份上表現如何；十次各留不同的一份，得到十個結果，通常取平均來估計模型整體的表現。

**自我檢查｜先寫下答案，再展開。** 有兩個假說：直線 A 的損失是 4、複雜度是 1；彎曲的邊界 B 的損失是 0、複雜度是 10。`λ` = 0.1 與 `λ` = 1 時，依 `cost(h) = loss(h) + λ × complexity(h)` 各會選哪一個？另外，1,000 筆資料做 10-fold cross-validation，每次實驗各用幾筆訓練、幾筆測試？（本文自擬）

<details>
<summary>答案</summary>

`λ` = 0.1：A 的成本是 4 + 0.1 × 1 = 4.1，B 是 0 + 0.1 × 10 = 1，B 比較低，選 B。`λ` = 1：A 是 4 + 1 = 5，B 是 0 + 10 = 10，選 A。分界在 4 + λ = 10λ，也就是 `λ` 約 0.44；`λ` 比它大時，B 多出來的複雜度就抵不過它省下的損失。`λ` 決定你願意拿多少訓練損失去換一個比較簡單的假說。

10-fold：1,000 筆分成 10 份，每份 100 筆。每次實驗用 900 筆訓練、100 筆測試，做 10 次，每一筆資料都剛好當過一次測試資料。和對半分的 holdout 相比，每次訓練用到的資料從 500 筆變成 900 筆。

</details>

### 用 scikit-learn 實測：紙鈔真偽資料

[錄影 59:43–1:09:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3583s)

這些演算法可以自己從頭寫，但 Python 有現成的函式庫 scikit-learn，最近鄰分類、perceptron 等等都已經實作好了。講者用它在一份真實資料上比較前面講過的幾種模型。

資料是 `banknotes.csv`，來自 UC Irvine。有人替許多紙鈔拍照並量了幾種性質，每一列是一張紙鈔，有四個輸入值，以及一個人工標上的標籤：0 是真鈔，1 是偽鈔。講者說那四個量測值各代表什麼不重要，重要的是有這些資料和標籤。

`banknotes0.py`（[1:02:17](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3737s)）手動走完整個流程：

1. 選模型：`model = Perceptron()`。
2. 讀檔：每一列的前四個值當 evidence；最後一欄是 0 就把標籤記成 authentic，否則記成 counterfeit。
3. 分割：算出資料筆數，取一半記成 `holdout`；把資料隨機打亂，前 `holdout` 筆當測試集，其餘當訓練集。
4. 訓練：把訓練集拆成 `X_training`（每一列的 evidence，也就是四個數字的向量）與 `y_training`（對應的標籤），呼叫 `model.fit(X_training, y_training)`。
5. 測試：同樣拆出 `X_testing` 與 `y_testing`，用 `model.predict(X_testing)` 得到預測，再用 `zip` 把實際值與預測值一對一比較，數出對幾筆、錯幾筆。

換模型只要改第 1 步那一行。講者當場跑出的結果（[1:06:21](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3981s)）：

| 模型 | 對 | 錯 | 講者報的準確率 |
|---|---|---|---|
| `Perceptron()` | 679 | 7 | 接近 99% |
| `svm.SVC()` | 682 | 4 | 99.4% |
| `KNeighborsClassifier(n_neighbors=1)` | 685 | 1 | 沒有報 |
| `KNeighborsClassifier(n_neighbors=3)` | 全對 | 0 | 100% |

講者接著提醒，每次執行都會重新打亂資料，等於每次用的訓練集都不太一樣，所以要多跑幾次才看得出真正的表現；這份資料上各個模型都很好，但換一份資料就不一定是這個順序。

最後是 `banknotes1.py`（[1:08:46](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4126s)）。分訓練集和測試集太常用了，scikit-learn 內建 `train_test_split`，只要指定測試集占的比例（講者說 0.5），它就會自動分好；計算對錯也有現成的寫法。整支程式大約 40 行。專案 Shopping 的 `main` 用的就是 `train_test_split`，見下面專案 4A。

公開的講課原始碼和講課當場有三處不同：`banknotes0.py` 預設選的模型是 `GaussianNB()`，留作測試的比例是 0.40；`banknotes1.py` 的 `train_test_split` 用的也是 `test_size=0.4`，不是講者口頭說的 0.5。這是本文下載原始碼後看到的，不是講課內容。把比例改回一半之後，四個模型各跑了 12 次（作者 2 次、獨立審稿者 10 次），686 筆裡錯的筆數是：Perceptron 6 到 26、SVC 1 到 4、`n_neighbors=1` 是 0 到 1、`n_neighbors=3` 是 0 到 11。Perceptron 波動最大，講課那一次的 7 筆落在偏低的一端。

**自我檢查｜先寫下答案，再展開。** 用講課的數字：測試集一共有幾筆？整份資料大約幾筆？`n_neighbors=1` 的準確率是多少？`n_neighbors=3` 拿到 100%，能不能因此說它是這個問題最好的模型？

<details>
<summary>答案</summary>

測試集是 679 + 7 = 686 筆（682 + 4、685 + 1 也都是 686）。測試集是一半，所以整份資料是 686 × 2 = 1,372 筆；公開的 `banknotes.csv` 除了標題列也正好是 1,372 列。`n_neighbors=1` 的準確率是 685 ÷ 686，約 99.85%。

不能。四個模型的差距是 686 筆裡錯 7、4、1、0 筆，而且各只跑了一次、每次的分割都是隨機的；講者自己就說要多跑幾次，也說換一份資料順序可能不同。這一次的結果只能說明四個模型在這份資料上都很準。

</details>

### 強化學習與 Markov decision process

[錄影 1:09:47–1:19:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4187s)

**強化學習**（reinforcement learning）從經驗裡學，沒有一開始就給好的一整份「輸入與答案」。Agent（可以是實體機器人，也可以只是一支程式）被放在一個環境（environment）裡：

1. 環境給 agent 一個 **state**，例如遊戲目前的盤面，或格子地圖上的位置。
2. Agent 在這個 state 選一個 **action**。
3. 環境回給它兩樣東西：新的 state，以及一個數字 **reward**。正的代表做得好，負的代表做了不好的事，是懲罰。

Agent 知道的就只有這些，它要靠這些資訊學會以後該怎麼做。講者舉的例子是讓機器人學走路：要直接寫程式讓機器人像人一樣走非常困難，但可以每往前一步就給 reward、跌倒就給懲罰，讓它自己學。

**把這個世界寫清楚**（[1:13:03](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4383s)）。常用的模型是 **Markov decision process**（MDP）。講者從之前講過的 Markov chain 講起（本系列[第 2 週](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty)）：那是一串 state，每個 state 依某個機率分布轉移到下一個，例如今天晴天，明天有多少機率晴天、多少機率下雨。那個模型裡沒有 agent，一切都由機率決定。MDP 加了兩樣東西：

- **動作**：在每個 state，agent 可以從幾個 action 裡選，每個 action 各有自己的機率分布，決定接下來到哪個 state。
- **reward**：從一個 state 做了某個 action、到了另一個 state，這個結果會附帶一個 reward `r`，正的是獎勵，負的是懲罰。

所以一個 MDP 有四樣東西：state 的集合 `S`；每個 state 可用的動作 `Actions(s)`；transition model `P(s' | s, a)`，意思是在 state `s` 做了 action `a` 之後到 `s'` 的機率；reward function `R(s, a, s')`，意思是在 `s` 做 `a` 到了 `s'` 得到的 reward。世界可以是完全確定的（做了某個 action 一定到某個 state），也可以有隨機性，MDP 兩種都能表示。

**格子世界的例子**（[1:16:53](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4613s)）。講者用一個格子地圖示範：agent 要走到目標格，走到會拿到 reward；有些格子會給懲罰。Agent 一開始什麼都不知道，只能試。

- 它走了一步，結果是懲罰。它學到：在這個 state 不要往右走。
- 它改往上，沒有立刻得到什麼；再試別的，又踩到一個懲罰。它學到：在那一格不要往下走。
- 這樣一直試下去，總有一次它在某個 state 往上走拿到了 reward。它學到：在這個 state 該往上。
- 接著它還能學到：在前一格該往左，因為往左會到剛才那個能拿到 reward 的 state。

沒有人告訴它目標在哪裡、懲罰在哪裡，它從經驗裡學到一串能走到 reward 的動作，之後照著走就行。

**自我檢查｜先寫下答案，再展開。** Markov chain 和 Markov decision process 差在哪兩樣東西？因為這兩樣東西，transition model 與 reward function 各要多看什麼？

<details>
<summary>答案</summary>

差在 action 與 reward。Markov chain 沒有 agent，下一個 state 只看現在的 state 與機率；MDP 讓 agent 在每個 state 選 action，並且替每一次轉移附上一個 reward。

所以 transition model 從「給定現在的 state，到下一個 state 的機率」變成 `P(s' | s, a)`，條件多了一個 action；reward function 寫成 `R(s, a, s')`，要看從哪個 state、做了哪個 action、到了哪個 state。格子世界裡 agent 學到的是「在這個 state 不要往右走」，不是「不要待在這個 state」，就是因為 reward 跟 action 綁在一起，只知道 state 還不夠。

</details>

### Q-learning 與 ε-greedy

[錄影 1:19:47–1:31:37](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4787s)

強化學習的方法很多，講課只介紹一種：**Q-learning**。它要學一個函數 `Q(s, a)`，輸入一個 state 和在那個 state 做的 action，輸出一個估計值：這樣做大概能拿到多少 reward。

一開始什麼經驗都沒有，所以把所有的 `Q(s, a)` 設成 0。之後每做一個 action、拿到一個 reward，就修正一次對應的估計。修正時要考慮兩件事：這一步拿到的 reward，以及之後預期還能拿到的 reward。後者很重要，因為有些動作當下沒有 reward，卻會通往後面的 reward。

**更新式**（[1:22:50](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4970s)）。每次在 state `s` 做了 action `a`、觀察到 reward `r`、到了新的 state `s'`：

```text
Q(s, a) ← Q(s, a) + α × (新的估計 − 舊的估計)

舊的估計 = Q(s, a)
新的估計 = r + max Q(s', a')    （對 s' 所有可做的 a' 取最大值）
```

講者用數字解釋括號裡那一項：假設原本認為這個動作值 10，這次經驗算出的新估計是 20，兩者差 10。要把原本的估計往新估計移多少，由 `α` 決定。`α` 同樣叫學習率，在這裡代表新資訊相對於舊資訊有多重要：

- `α` = 1：舊值加上 1 ×（新 − 舊），結果就是新的估計，舊的完全丟掉。
- `α` = 0：完全不理新資訊，Q 值不變。
- 介於兩者之間：新舊各留一部分。講者的理由是，同一個動作可能已經試過九次，第十次的經驗不該把前九次全部蓋掉。

新的估計由兩部分組成：這一步的 reward `r`，加上對未來 reward 的估計。未來的部分再查一次 Q 函數：在新的 state 所有可以做的 action 裡，取 Q 值最大的那一個。

講者提到還可以再加一個參數（[1:27:07](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5227s)），替未來的 reward 打折，表示現在拿到的 reward 比以後才拿到的值錢；要不要加、打幾折由寫程式的人決定。他口頭上沒有替這個參數取名字。官方筆記的式子把它記成 γ，乘在 max 那一項前面；本文上面的式子照講者口述寫，沒有放 γ。

**有了 Q 值之後怎麼選動作**（[1:27:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5267s)）。最直接的是 greedy：在目前的 state 把每個 action 的 `Q(s, a)` 都看一遍，選最高的。

它的問題是可能卡在一條「能到，但不是最好」的路上。回到格子世界：agent 已經找到一條能走到 reward 的路，但另外有一條更快的路它從沒走過。在岔路那一格，它知道往下最後能拿到 reward，對另一個方向一無所知，所以每次都往下，永遠不會發現比較快的那條。

這就是強化學習裡**探索**（exploration）與**利用**（exploitation）的拉扯：利用是使用已經知道的東西，探索是去試還沒試夠的動作，也許它們會更快拿到 reward 或拿到更多。只利用、從不探索的 agent 拿得到 reward，但可能拿不到最多。

**ε-greedy**（[1:30:24](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5424s)）是一個折衷：把 `ε` 設成想要隨機亂走的頻率，每次要選動作時，

- 有 1 − ε 的機率，選目前估計最好的動作；
- 有 ε 的機率，隨機選一個動作。

講者補充，可以在訓練初期多探索，之後隨著對各種可能越來越有把握，逐步把 `ε` 調小，越來越常選最好的那一步。

**自我檢查｜先寫下答案，再展開。** 沿用講課的數字：`Q(s, a)` 原本是 10，這次算出的新估計是 20。`α` 取 1、0、0.5 時，更新後各是多少？再來，如果這一步的 reward 是 0，新 state 可做的三個 action 的 Q 值是 4、20、−3，新的估計怎麼算出 20？（`α` = 0.5 與後半題是本文自擬）

<details>
<summary>答案</summary>

`α` = 1：10 + 1 × (20 − 10) = 20，直接換成新的估計。`α` = 0：10 + 0 × 10 = 10，不變。`α` = 0.5：10 + 0.5 × 10 = 15，往新估計走一半。

新的估計 = r + 新 state 裡最大的 Q 值 = 0 + max(4, 20, −3) = 20。這一步本身沒有 reward，但它把 agent 帶到一個「存在 Q 值 20 的 action」的 state，所以這一步也跟著值錢。Reward 就是這樣從終點一步一步往前傳回去的：格子世界裡 agent 先學到終點前一格該往上，之後才學到再前一格該往左。

</details>

### 讓 AI 自己學會玩 Nim，以及 function approximation

[錄影 1:31:37–1:38:43](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5497s)

強化學習很常用在玩遊戲。想教 agent 玩一個遊戲，就讓它玩很多很多次，reward 在每一局結束時才出現：贏了得到 1，輸了得到 −1。不用告訴它哪一步好、哪一步壞，它會從輸贏裡自己推出來。

講者用的遊戲是 **Nim**（[1:32:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5536s)）。有幾堆東西，講課的開局是四堆，分別有 1、3、5、7 個。兩個玩家輪流，每一回合從**某一堆**拿走任意個，至少要拿 1 個。**拿走最後一個的人輸。**

他口頭走了一局（下面的盤面依他報的數字寫出，他沒報的地方不填）：

| 誰 | 動作 | 四堆剩下 |
|---|---|---|
| 開局 | | 1、3、5、7 |
| 玩家 1、玩家 2 | 各從一堆拿 4 個（講者只說「這一堆」；從結果看是 5 個與 7 個那兩堆，誰拿哪一堆字幕看不出來） | 1、3、1、3 |
| 玩家 1 | 把第二堆整堆拿走 | 1、0、1、3 |
| 玩家 2 | 從剩 3 個的那堆拿 2 個 | 1、0、1、1 |
| 玩家 1 | 拿 1 個 | 剩兩堆各 1 個 |
| 玩家 2 | 拿 1 個 | 剩一堆 1 個 |
| 玩家 1 | 只能拿最後一個 | 玩家 1 輸 |

倒數第四列，講者口頭說的是從「第三堆」拿 2 個，但他前後報的數字（四堆是 1、3、1、3，之後剩三堆各 1 個）只有從剩 3 個的那一堆拿才對得上，本文依數字寫。

這個遊戲很容易寫成強化學習的問題：state 就是四個數字，也就是每一堆剩幾個；action 是從哪一堆拿幾個；reward 在結束時才有，被迫拿最後一個的人受罰，另一方得到獎勵。

**示範**（[1:34:08](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5648s)）。講者寫好一個玩 Nim 的 AI，訓練方式是讓它和自己對弈若干局，從每一局學，然後換人和它玩。

第一次訓練 0 局。講者從 pile 3 拿 5 個，AI 從 pile 0 拿 1 個；講者把 pile 2 的 5 個全拿走，AI 從 pile 1 拿 2 個，剩一堆 1 個、一堆 2 個；講者把 pile 3 的 2 個拿走，AI 只能拿最後一個，講者贏。沒有訓練過的 AI 只是在亂下。

第二次先讓它自我對弈 10,000 局（[1:35:32](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5732s)）。講者從 pile 3 拿 1 個，AI 把 pile 3 剩下的全拿走，剩三堆；講者從 pile 2 拿 3 個，AI 從 pile 0 拿 1 個。講者說這時剩兩堆、各 2 個；他從 pile 1 拿 1 個，AI 把 pile 2 的 2 個拿走，他只剩 pile 1 的最後一個可拿，輸了。（照他口述的拿法一步步算下來，輪到他時應該是 3 個與 2 個兩堆，和他說的「各 2 個」對不上；看不到畫面，本文無法判斷是哪一句口誤，結尾的三步則和「各 2 個」一致。）講者的結論是，自我對弈 10,000 局之後，AI 已經學到哪些 state 配哪些 action 比較好。

專案 Nim 要做的是同一件事：`play.py` 同樣先訓練 10,000 局再讓人對戰，開局同樣是 1、3、5、7。講者示範用的是他自己寫好的程式，講課沒有提到這份作業。

**State 太多的時候**（[1:36:59](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5819s)）。Nim 適合拿來示範，是因為 state 很少。換成西洋棋這種 state 與 action 都多得多的遊戲，沒辦法替每一個 state 的每一個 action 都學一個值。這時可以用 **function approximation**：不再逐一記錄每一組 `Q(s, a)`，改用一個函數去估計，這個函數看的是 state 的各種特徵（feature），特徵要自己選。這樣學到的東西能推廣到沒見過的 state：如果另一個 state 看起來和這個很像，在這裡有效的動作在那裡多半也有效。講者拿它和之前看過的 depth-limited Minimax 相比（本系列[第 0 週](/posts/tech/2026-08-27-harvard-cs50ai-w00-search)），兩者都是在算不完的時候改用估計。

**自我檢查｜先寫下答案，再展開。** Nim 只剩一堆、裡面有 2 個，輪到你。兩個可能的動作各會導致什麼結果？如果所有 Q 值從 0 開始、`α` = 0.5（專案 `NimAI` 的預設值），「拿 2 個」這個動作第一次被更新之後 Q 值是多少？第二次呢？（本文自擬）

<details>
<summary>答案</summary>

拿 1 個：剩 1 個，對手被迫拿最後一個，對手輸、你贏。拿 2 個：你自己拿了最後一個，你輸。

「拿 2 個」是直接輸掉的一步，reward 是 −1，而且遊戲結束了，沒有未來的 reward，所以新的估計是 −1 + 0 = −1。第一次更新：0 + 0.5 × (−1 − 0) = −0.5。第二次：−0.5 + 0.5 × (−1 − (−0.5)) = −0.75。每次都往 −1 靠近一半，試的次數夠多就會貼近 −1。

同樣的道理，「拿 1 個」的 Q 值會逐步靠近 1。本文用下面專案 4B 的參考實作訓練 10,000 局後查這兩個值，分別是 1.0 與非常接近 −1 的數字，所以 AI 在這個 state 會選拿 1 個。

</details>

### 非監督式學習：k-means 分群

[錄影 1:38:43–1:45:48](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5923s)

第三大類是**非監督式學習**（unsupervised learning），講者說只會簡短帶過。它處理的是沒有標籤的資料：監督式學習裡每一筆資料都標了下不下雨、是不是偽鈔，這裡沒有這些，但還是想從資料裡學到一些規律。

其中一種任務是**分群**（clustering）：把一堆東西分成幾群，同一群裡的東西彼此相似。講者舉了三個應用：基因研究中把相似的基因分在一起；把一張影像的像素分成不同區塊；市場研究中把消費者分群，好決定對哪一群打哪一種廣告。

**k-means**（[1:40:20](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=6020s)）是一種分群演算法，把資料分成 `k` 群。每一群用它的**中心**（cluster center）來代表，演算法反覆做兩件事：

1. **指派**：把每個點分給離它最近的那個中心。
2. **移動中心**（[1:42:28](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=6148s)）：把每個中心移到「分給它的那些點」的平均位置。

講者的示範取 `k` = 3（`k` 要自己選，可以多試幾個值比較），分成藍、紅、綠三群。一開始三個中心隨機放。第一次指派後的分法不太好，紅群和綠群裡的點都離得很遠。接著移動中心：每個中心被分給它的點拉過去，哪一邊的點多就往哪一邊偏。中心動了之後重新指派，有些點換了群：原本離紅色中心最近的兩個點，現在離藍色中心比較近；原本屬於綠色的三個點，現在離紅色中心比較近。再移動中心、再指派，如此反覆。

停止的條件是：指派完之後沒有任何一個點換群。這時達到一種平衡，演算法結束，得到三群。整個過程沒有用到任何標籤。

講者最後收尾：監督式、強化、非監督式學習底下各自還有很多演算法，這一週講的是它們背後的基本想法；下一週會繼續談機器學習的其他技術。

**自我檢查｜先寫下答案，再展開。** 數線上有六個點：1、2、3、10、11、12，要分成 `k` = 2 群。兩個中心一開始放在 1 和 4。照 k-means 的兩個步驟做，中心最後停在哪裡？做了幾輪指派才停？（本文自擬）

<details>
<summary>答案</summary>

第一輪指派：1 與 2 離中心 1 比較近；3 離中心 4 比較近（距離 1 對 2）；10、11、12 也離 4 比較近。分法是 {1, 2} 與 {3, 10, 11, 12}。移動中心：第一個到 (1 + 2) ÷ 2 = 1.5，第二個到 (3 + 10 + 11 + 12) ÷ 4 = 9。

第二輪指派：3 離 1.5 的距離是 1.5，離 9 的距離是 6，改分到第一群。分法變成 {1, 2, 3} 與 {10, 11, 12}。移動中心：2 與 11。

第三輪指派：沒有任何點換群，停止。中心停在 2 與 11，一共做了三輪指派。一開始把 3 分錯群沒有關係，中心移動之後它自己換了過來，這就是講課示範裡「有些點換了群」的那一步。

</details>

## 專案 4A：Shopping —— k-NN 預測購買意願

> 本站對專案解答的處理方式：預設只寫解題思路、虛擬碼、容易出錯的地方與檢查方式，完整參考實作摺疊在各專案最後。課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)不允許在繳交自己的作業之前看別人的解答。

### 任務

`shopping.csv` 是一個購物網站大約 12,000 次瀏覽工作階段的紀錄（實際是 12,330 列，其中 1,908 列最後有購買）。要寫一個最近鄰分類器，依使用者看了幾頁、是不是週末、用什麼瀏覽器等資訊，預測這次瀏覽最後會不會購買。

規格不只看準確率。它舉的例子是：如果大約 15% 的使用者會購買，一個永遠猜「不買」的分類器準確率有 85%，卻一點用都沒有。所以要回報兩個數字：

- **sensitivity**（true positive rate）：實際有購買的人裡，被正確認出來的比例。
- **specificity**（true negative rate）：實際沒購買的人裡，被正確認出來的比例。

永遠猜「不買」的分類器 specificity 是 1.0，sensitivity 是 0.0。

要交的是 `shopping.py` 裡的三個函式：`load_data`、`train_model`、`evaluate`。規格規定不能改這三個函式以外的部分，也不能改 `shopping.csv`。

### 官方已提供的程式

`shopping.py` 的 `main` 已經寫好：呼叫 `load_data` 讀資料，用 `train_test_split` 留 40% 當測試集，呼叫 `train_model` 訓練，直接對回傳的模型呼叫 `model.predict(X_test)`，再用 `evaluate` 算出兩個比例並印出四行結果。下面是官方檔案開頭的匯入與三個待實作的函式，逐字取自官方 zip（中間的 `main` 省略）：

```python
import csv
import sys

from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier

TEST_SIZE = 0.4


def load_data(filename):
    """
    Load shopping data from a CSV file `filename` and convert into a list of
    evidence lists and a list of labels. Return a tuple (evidence, labels).

    evidence should be a list of lists, where each list contains the
    following values, in order:
        - Administrative, an integer
        - Administrative_Duration, a floating point number
        - Informational, an integer
        - Informational_Duration, a floating point number
        - ProductRelated, an integer
        - ProductRelated_Duration, a floating point number
        - BounceRates, a floating point number
        - ExitRates, a floating point number
        - PageValues, a floating point number
        - SpecialDay, a floating point number
        - Month, an index from 0 (January) to 11 (December)
        - OperatingSystems, an integer
        - Browser, an integer
        - Region, an integer
        - TrafficType, an integer
        - VisitorType, an integer 0 (not returning) or 1 (returning)
        - Weekend, an integer 0 (if false) or 1 (if true)

    labels should be the corresponding list of labels, where each label
    is 1 if Revenue is true, and 0 otherwise.
    """
    raise NotImplementedError


def train_model(evidence, labels):
    """
    Given a list of evidence lists and a list of labels, return a
    fitted k-nearest neighbor model (k=1) trained on the data.
    """
    raise NotImplementedError


def evaluate(labels, predictions):
    """
    Given a list of actual labels and a list of predicted labels,
    return a tuple (sensitivity, specificity).

    Assume each label is either a 1 (positive) or 0 (negative).

    `sensitivity` should be a floating-point value from 0 to 1
    representing the "true positive rate": the proportion of
    actual positive labels that were accurately identified.

    `specificity` should be a floating-point value from 0 to 1
    representing the "true negative rate": the proportion of
    actual negative labels that were accurately identified.
    """
    raise NotImplementedError
```

規格頁另外補充的要求：

- 每一列的 evidence 順序和 CSV 的欄位相同，最後一欄 `Revenue` 是標籤，不算在內。
- `VisitorType` 的值是 `Returning_Visitor` 才記 1，其他字串都記 0。
- 規格給的檢查點：第一列的 evidence 應該是 `[0, 0.0, 0, 0.0, 1, 0.0, 0.2, 0.2, 0.0, 0.0, 1, 1, 1, 1, 1, 1, 0]`，標籤是 0。
- 可以保證測試用的實際標籤裡至少有一個正例與一個負例。

### 解題思路

三個函式各做一件事，彼此獨立，可以一個一個寫、一個一個測。

**`load_data`：把一列文字變成 17 個數字。** 最近鄰分類靠的是算距離（見[監督式學習、分類與最近鄰](#監督式學習分類與最近鄰)），所以每個欄位都得是數字。CSV 讀進來全是字串，工作就是逐欄轉型：docstring 寫 integer 的轉成整數，寫 floating point 的轉成小數；月份的縮寫換成 0 到 11 的編號；`VisitorType`、`Weekend` 與標籤 `Revenue` 是文字，要自己比對字串再換成 1 或 0。講課的 `banknotes0.py` 做的是同一件事的簡單版：每列前四個值當 evidence、最後一欄當標籤（[1:02:17](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=3737s)），差別只在那份資料本來就全是數字。

**`train_model`：建一個只看 1 個鄰居的分類器並訓練。** 這就是講課的 k-NN（[10:27](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=627s)）取 `k` = 1。分類器不用自己寫，官方檔案已經匯入 scikit-learn 的 `KNeighborsClassifier`；講課在[用 scikit-learn 實測](#用-scikit-learn-實測紙鈔真偽資料)那一節示範過怎麼建立模型、怎麼用 `fit` 訓練。分割訓練集與測試集不是你的工作，`main` 已經用 `train_test_split` 做了（[1:08:46](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4126s)）。

**`evaluate`：數四種筆數，算兩個比例。** 把實際標籤和預測一對一對起來看。sensitivity 的分母是「實際為 1」的筆數，分子是其中預測也為 1 的筆數；specificity 的分母是「實際為 0」的筆數，分子是其中預測也為 0 的筆數。兩個比例的分母不同，也都不是總筆數。

### 虛擬碼

```text
讀資料:
    對標題列以下的每一列:
        依欄位順序做出 17 個數字
            頁數、分類編號類的欄位 → 整數
            停留時間、比率類的欄位 → 小數
            月份 → 0（一月）到 11（十二月）
            是否回訪、是否週末 → 1 或 0
        標籤 ← 有購買記 1，否則記 0
    回傳（所有列的數字，所有列的標籤）

訓練:
    建立一個只看 1 個鄰居的最近鄰分類器
    讓它記住訓練資料與對應的標籤
    回傳這個分類器

評估:
    正例數 ← 實際標籤是 1 的筆數
    負例數 ← 實際標籤是 0 的筆數
    認對的正例 ← 實際是 1、預測也是 1 的筆數
    認對的負例 ← 實際是 0、預測也是 0 的筆數
    回傳（認對的正例 ÷ 正例數，認對的負例 ÷ 負例數）
```

### 容易出錯的地方

下面幾條都是本站把實作放進官方目錄實跑時確認過的現象。

- **六月寫成 `June`。** 資料裡的月份是 `Feb`、`Mar`、`May`、`June`、`Jul`、`Aug`、`Sep`、`Oct`、`Nov`、`Dec`，只有六月不是三個字母，而且沒有一月與四月的列。對照表裡六月寫成 `Jun` 的話，讀到第一個六月的列就會丟出例外（用 list 查是 `ValueError`，用 dict 查是 `KeyError`）。沒有一月與四月不代表可以從表裡拿掉它們，編號要照 0 到 11 排。
- **`TRUE`、`FALSE` 是字串。** 對非空字串做布林轉換一律得到真，`"FALSE"` 也是。這樣寫的話每一筆的標籤與 `Weekend` 都變成 1，程式不會報錯。察覺的方法：標籤加總應該是 1,908，不是 12,330。
- **`VisitorType` 有三種值。** 資料裡有 `Returning_Visitor`、`New_Visitor`、`Other`，只有第一種記 1。
- **整數欄位與小數欄位要分清楚。** Python 裡 `0 == 0.0` 為真，所以拿整列去和規格的檢查點比相等，型別錯了也比不出來，要另外逐欄看型別。
- **`train_model` 要回傳分類器本身。** `main` 直接對回傳值呼叫 `predict`。回傳 tuple 或其他包裝（例如把模型和別的物件一起回傳），`main` 會丟出 `AttributeError`，說 tuple 沒有 `predict`。
- **不要自己加標準化。** 規格要的是在傳進來的資料上訓練的 `k` = 1 分類器，沒有要求先把特徵標準化。`main` 餵給 `predict` 的測試資料是原始數值，如果只在 `train_model` 裡把訓練資料縮放過，模型看到的訓練資料和測試資料就不在同一個尺度上。本站用 `StandardScaler` 只縮放訓練資料來試（作者 303 次，獨立審稿者另外 48 次）。作者的 303 次裡有 295 次是 true positive rate 掉到 0% 到 2.6%，true negative rate 在 87% 到 99.8% 之間，模型幾乎全猜「不買」；審稿者的 48 次全部是這種情況（0.13% 到 2.52%，88.73% 到 99.50%）。這時 true negative rate 看起來正常、甚至比沒縮放時更高，要看 true positive rate 才察覺得到。作者另外 8 次翻到另一邊，幾乎全猜「會買」：true positive rate 88% 到 98%，true negative rate 10% 到 21%。
- **兩個比例弄反，或算成準確率。** 用對稱的測試資料看不出來，下面的檢查特地用了兩個答案不同的例子。
- **true positive rate 只有四成左右是正常的。** 規格頁的範例輸出就是 41.02%。看到這個數字不要回頭去「修」分類器。

### 怎麼檢查自己寫的對不對

**`load_data`**，在 Python 互動環境裡呼叫 `load_data("shopping.csv")`：

- evidence 與 labels 的長度都是 12,330。
- 每一列的長度是 17。
- 第一列等於規格的檢查點 `[0, 0.0, 0, 0.0, 1, 0.0, 0.2, 0.2, 0.0, 0.0, 1, 1, 1, 1, 1, 1, 0]`，第一個標籤是 0；再逐欄確認型別，第 2、4、6 到 10 個是 `float`，其餘是 `int`。
- 標籤加總是 1,908。

**`evaluate`**，手算得出來的小例子：`evaluate([1, 1, 0, 0, 0], [1, 0, 0, 0, 1])`。實際為 1 的有兩筆，其中一筆預測對，sensitivity 是 1 ÷ 2 = 0.5；實際為 0 的有三筆，其中兩筆預測對，specificity 是 2 ÷ 3，約 0.667。回傳 `(0.667, 0.5)` 是兩個比例弄反了；回傳兩個 0.6 是算成了準確率（五筆對三筆）。

**整支程式**：

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/shopping.zip
unzip shopping.zip && cd shopping
pip3 install scikit-learn

python shopping.py shopping.csv
# 輸出四行：Correct、Incorrect、True Positive Rate、True Negative Rate
```

- `Correct` 加 `Incorrect` 應該是 4,932（12,330 的 40%）。
- 規格頁的範例輸出是 `Correct: 4088`、`Incorrect: 844`、`True Positive Rate: 41.02%`、`True Negative Rate: 90.55%`。
- 本站的參考實作一共跑了 15 次（2026-10-13；作者 7 次用 Python 3.15，獨立審稿者 8 次用 Python 3.13，scikit-learn 都是 1.9.1）：true positive rate 大約 37% 到 42%，true negative rate 大約 90% 到 91%（實際最小與最大是 36.86% 與 41.97%、89.69% 與 91.34%）。每次的分割是隨機的，落在這個範圍附近都正常；差很多（例如某一個比例掉到個位數）就回頭看上面那幾條。

**官方檢查**：

```bash
check50 ai50/projects/2024/x/shopping
style50 shopping.py
```

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

```python
def load_data(filename):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "June",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    evidence = []
    labels = []
    with open(filename) as f:
        for row in csv.DictReader(f):
            evidence.append([
                int(row["Administrative"]),
                float(row["Administrative_Duration"]),
                int(row["Informational"]),
                float(row["Informational_Duration"]),
                int(row["ProductRelated"]),
                float(row["ProductRelated_Duration"]),
                float(row["BounceRates"]),
                float(row["ExitRates"]),
                float(row["PageValues"]),
                float(row["SpecialDay"]),
                months.index(row["Month"]),
                int(row["OperatingSystems"]),
                int(row["Browser"]),
                int(row["Region"]),
                int(row["TrafficType"]),
                1 if row["VisitorType"] == "Returning_Visitor" else 0,
                1 if row["Weekend"] == "TRUE" else 0,
            ])
            labels.append(1 if row["Revenue"] == "TRUE" else 0)
    return evidence, labels


def train_model(evidence, labels):
    model = KNeighborsClassifier(n_neighbors=1)
    model.fit(evidence, labels)
    return model


def evaluate(labels, predictions):
    positives = sum(1 for label in labels if label == 1)
    negatives = sum(1 for label in labels if label == 0)
    true_positives = sum(
        1 for label, prediction in zip(labels, predictions)
        if label == 1 and prediction == 1
    )
    true_negatives = sum(
        1 for label, prediction in zip(labels, predictions)
        if label == 0 and prediction == 0
    )
    return true_positives / positives, true_negatives / negatives
```

這份實作放進官方的 `shopping` 目錄實跑過（Python 3.15、scikit-learn 1.9.1）：`load_data` 讀出 12,330 列，第一列與規格的檢查點相同；`python shopping.py shopping.csv` 的實跑結果就是上面「怎麼檢查」列的範圍。

</details>

---

## 專案 4B：Nim —— Q-learning 學會玩遊戲

> 完整參考實作同樣摺疊在本節最後，先自己寫完並繳交再打開。

### 任務

讓 AI 靠自我對弈學會玩 Nim。規則和講課相同：幾堆東西，雙方輪流從某一個非空的堆拿走任意個（至少 1 個），**拿走最後一個的人輸**。

規格給的 reward：讓自己輸掉的動作是 −1；讓對手輸掉的動作是 1；遊戲還沒結束的動作當下是 0，但會有未來的 reward。

要交的是 `nim.py` 裡 `NimAI` 的四個方法：`get_q_value`、`update_q_value`、`best_future_reward`、`choose_action`。規格規定 `nim.py` 的其他部分不能改；`play.py` 可以改來自己測試。

### 官方已提供的程式

`nim.py` 有兩個類別與兩個函式，`Nim`、`train`、`play` 都已經寫好。

- **`Nim`**：`piles` 是每一堆剩幾個的 list，預設開局 `[1, 3, 5, 7]`；`player` 是 0 或 1；`winner` 一開始是 `None`。`Nim.available_actions(piles)` 回傳所有合法動作的 set，動作是 `(i, j)`，意思是從第 `i` 堆（從 0 算起）拿 `j` 個；例如 `Nim.available_actions([2, 1, 0, 0])` 回傳 `{(0, 1), (1, 1), (0, 2)}`。`move(action)` 執行動作並換人；如果所有堆都空了，把 `winner` 設成換人之後的那位，也就是沒有拿最後一個的人。
- **`train(n)`**：讓同一個 `NimAI` 自己和自己下 `n` 局，並記住雙方各自的上一步。某一步結束了遊戲，就用 reward −1 更新這一步，再用 reward 1 更新對手的上一步；遊戲還沒結束，就用 reward 0 更新「現在輪到的這位」的上一步，新 state 是對手回應之後的盤面。reward 是 `train` 給的，你不用自己判斷輸贏。
- **`play.py`**：只有三行，`train(10000)` 之後呼叫 `play(ai)` 讓人對戰。

下面是 `NimAI` 類別，逐字取自官方 zip。`__init__` 與 `update` 已經寫好，四個 `raise NotImplementedError` 是要你填的地方：

```python
class NimAI():

    def __init__(self, alpha=0.5, epsilon=0.1):
        """
        Initialize AI with an empty Q-learning dictionary,
        an alpha (learning) rate, and an epsilon rate.

        The Q-learning dictionary maps `(state, action)`
        pairs to a Q-value (a number).
         - `state` is a tuple of remaining piles, e.g. (1, 1, 4, 4)
         - `action` is a tuple `(i, j)` for an action
        """
        self.q = dict()
        self.alpha = alpha
        self.epsilon = epsilon

    def update(self, old_state, action, new_state, reward):
        """
        Update Q-learning model, given an old state, an action taken
        in that state, a new resulting state, and the reward received
        from taking that action.
        """
        old = self.get_q_value(old_state, action)
        best_future = self.best_future_reward(new_state)
        self.update_q_value(old_state, action, old, reward, best_future)

    def get_q_value(self, state, action):
        """
        Return the Q-value for the state `state` and the action `action`.
        If no Q-value exists yet in `self.q`, return 0.
        """
        raise NotImplementedError

    def update_q_value(self, state, action, old_q, reward, future_rewards):
        """
        Update the Q-value for the state `state` and the action `action`
        given the previous Q-value `old_q`, a current reward `reward`,
        and an estiamte of future rewards `future_rewards`.

        Use the formula:

        Q(s, a) <- old value estimate
                   + alpha * (new value estimate - old value estimate)

        where `old value estimate` is the previous Q-value,
        `alpha` is the learning rate, and `new value estimate`
        is the sum of the current reward and estimated future rewards.
        """
        raise NotImplementedError

    def best_future_reward(self, state):
        """
        Given a state `state`, consider all possible `(state, action)`
        pairs available in that state and return the maximum of all
        of their Q-values.

        Use 0 as the Q-value if a `(state, action)` pair has no
        Q-value in `self.q`. If there are no available actions in
        `state`, return 0.
        """
        raise NotImplementedError

    def choose_action(self, state, epsilon=True):
        """
        Given a state `state`, return an action `(i, j)` to take.

        If `epsilon` is `False`, then return the best action
        available in the state (the one with the highest Q-value,
        using 0 for pairs that have no Q-values).

        If `epsilon` is `True`, then with probability
        `self.epsilon` choose a random available action,
        otherwise choose the best action available.

        If multiple actions have the same Q-value, any of those
        options is an acceptable return value.
        """
        raise NotImplementedError
```

規格頁另外說明：傳進這些方法的 state 是整數 list，action 是 `(i, j)`；`self.q` 的鍵要用 tuple 版的 state，例如 `self.q[(0, 0, 0, 2), (3, 2)] = -1`。

### 解題思路

這四個方法合起來就是講課[Q-learning 與 ε-greedy](#q-learning-與-ε-greedy)那一節的內容，`update` 已經把它們串好了：先查舊的估計，再問新 state 未來最多能拿多少，最後套更新式。

**`get_q_value`：查表，查不到算 0。** 講課說一開始所有 `Q(s, a)` 都是 0。這裡不必真的先把每一組都填 0，表裡沒有的當作 0 就行。

**`update_q_value`：套更新式。** 就是講課那一條（[1:22:50](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=4970s)）：舊的估計加上 `α` 乘以「新的估計減舊的估計」。對應到參數：`old_q` 是舊的估計，新的估計是 `reward` 加 `future_rewards`，`α` 是 `self.alpha`。講課提到的折扣參數這份作業沒有用。

**`best_future_reward`：新 state 裡最大的 Q 值。** 更新式裡「對所有可做的動作取最大值」那一項。先問 `Nim` 類別這個 state 有哪些合法動作，逐一查 Q 值，取最大的；沒記錄過的動作算 0。遊戲結束時所有堆都空了，沒有任何動作可做，這時要回傳 0。

**`choose_action`：greedy 或 ε-greedy。** 參數 `epsilon` 為 `False` 時是講課的 greedy（[1:27:47](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5267s)）：選 Q 值最高的動作。為 `True` 時是 ε-greedy（[1:30:24](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5424s)）：有 `self.epsilon` 的機率隨機選一個合法動作，其餘時候選最好的。`train` 呼叫時沒有傳這個參數，用的是預設的 `True`，所以訓練時會探索；`play` 傳的是 `False`，對戰時一律選最好的。

遊戲本身怎麼進行、為什麼自我對弈之後 AI 會變強，見[讓 AI 自己學會玩 Nim](#讓-ai-自己學會玩-nim以及-function-approximation)那一節（[1:32:16](https://www.youtube.com/watch?v=-g0iJjnO2_w&t=5536s)）。

### 虛擬碼

```text
查 Q 值（state，action）:
    表裡有這一組 → 回傳它
    沒有 → 回傳 0

更新 Q 值（state，action，舊的估計，reward，未來的估計）:
    新的估計 ← reward + 未來的估計
    表裡這一組 ← 舊的估計 + α ×（新的估計 − 舊的估計）

未來最好的 reward（state）:
    這個 state 沒有可做的動作 → 回傳 0
    否則 → 回傳所有可做動作的 Q 值裡最大的（沒記錄過的算 0）

選動作（state，要不要探索）:
    列出這個 state 所有可做的動作
    如果要探索，而且這次抽中了 ε 的機率:
        回傳隨便一個可做的動作
    否則:
        回傳 Q 值最大的動作（同分時任選一個）
```

### 容易出錯的地方

- **拿走最後一個的人輸。** 很多 Nim 的介紹寫的是拿最後一個的人贏，這份作業相反（本站舊版就寫反過）。輸贏與 reward 都由官方的 `Nim.move` 和 `train` 處理，你的四個方法不必判斷；但你在檢查 AI 下得對不對時要用對規則：只剩一堆 2 個時，好的一步是拿 1 個，不是拿光。
- **state 要轉成 tuple 才能當鍵。** 傳進來的 state 是 list。直接拿 list 組成字典的鍵，讀或寫都會丟出 `TypeError`（list 不能雜湊）。四個方法裡只要碰到 `self.q`，都要用 tuple 版的 state。
- **所有堆都空了的時候。** 遊戲結束那一步，`train` 會拿全空的盤面來問未來最好的 reward。這時沒有任何動作，對空的集合取最大值會丟出 `ValueError`，而且第一局訓練結束時就會發生。要先處理「沒有動作」的情況。
- **沒記錄過的動作算 0，不是跳過。** 取最大值時如果只看表裡已經有的那幾組，會出錯：某個 state 只記錄過一個 Q 值是負的動作時，正確答案是 0（其他沒試過的動作算 0），只看表裡的會得到那個負數。
- **`epsilon` 參數是布林值，`self.epsilon` 才是機率。** 兩個名字只差一個 `self.`。拿參數 `epsilon`（`True`）去和亂數比大小，`True` 會被當成 1，結果是每一步都隨機；程式不會報錯，只是訓練時從不利用學到的東西。
- **`epsilon=False` 時不能有任何隨機成分**（同分時任選除外）。否則對戰時 AI 偶爾會下出明顯的壞棋。
- **執行的是 `play.py`。** `nim.py` 沒有主程式，直接執行它不會有任何輸出。

### 怎麼檢查自己寫的對不對

**不用訓練就能驗的小案例**，在 Python 互動環境裡 `from nim import Nim, NimAI`，建立 `ai = NimAI()`（`alpha` 預設 0.5），依序做：

| 步驟 | 應該看到 |
|---|---|
| `ai.get_q_value([0, 0, 0, 2], (3, 2))` | 0（還沒記錄過） |
| `ai.update_q_value([0, 0, 0, 2], (3, 2), 0, -1, 0)` 之後再查同一組 | −0.5，也就是 0 + 0.5 × (−1 − 0) |
| `ai.update_q_value([0, 0, 0, 2], (3, 2), -0.5, -1, 0)` 之後再查 | −0.75，也就是 −0.5 + 0.5 × (−1 − (−0.5)) |
| `ai.best_future_reward([0, 0, 0, 0])` | 0（沒有動作可做） |
| `ai.best_future_reward([0, 0, 0, 2])` | 0（`(3, 2)` 是 −0.75，沒記錄過的 `(3, 1)` 算 0，取大的） |
| `ai.choose_action([0, 0, 0, 2], epsilon=False)` | `(3, 1)` |

前三列的數字和[講課導讀裡 Nim 那一節的自我檢查](#讓-ai-自己學會玩-nim以及-function-approximation)手算的一樣。本站的參考實作跑這六步得到的就是表裡的值。

**訓練之後**：

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/4/nim.zip
unzip nim.zip && cd nim

python play.py  # 先訓練 10,000 局，再和 AI 對戰
```

訓練 10,000 局之後（在 `play.py` 裡 `train(10000)` 後面加幾行查看，或在互動環境裡呼叫 `train`），本站的參考實作得到的是（2026-10-13；作者 1 次、獨立審稿者換三個亂數種子 3 次，共 4 次）：

- state `[0, 0, 0, 2]`：`(3, 1)` 的 Q 值是 1.0，`(3, 2)` 的 Q 值貼近 −1（差距小於一億分之一），`choose_action(..., epsilon=False)` 選 `(3, 1)`。
- `self.q` 裡有 2,375 到 2,452 組 Q 值。
- 和每一步都隨機下的對手對戰，先手、後手各 2,000 局：4 次裡有 3 次全勝，1 次先手是 1,995 勝。
- 審稿者另外測了一個照最佳策略下的對手：AI 後手 200 局全勝，先手 200 局全敗。先手全敗不是實作的問題，1、3、5、7 這個開局在雙方都下對的情況下本來就是先手輸。

所以自己和 AI 對戰時，輪到你先手就很難贏它；它先手時，你下得夠好就能贏，這是正常的。

**官方檢查**：

```bash
check50 ai50/projects/2024/x/nim
style50 nim.py
```

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

```python
    def get_q_value(self, state, action):
        return self.q.get((tuple(state), action), 0)

    def update_q_value(self, state, action, old_q, reward, future_rewards):
        new_estimate = reward + future_rewards
        self.q[tuple(state), action] = old_q + self.alpha * (new_estimate - old_q)

    def best_future_reward(self, state):
        actions = Nim.available_actions(state)
        if not actions:
            return 0
        return max(self.get_q_value(state, action) for action in actions)

    def choose_action(self, state, epsilon=True):
        actions = list(Nim.available_actions(state))
        if epsilon and random.random() < self.epsilon:
            return random.choice(actions)
        return max(actions, key=lambda action: self.get_q_value(state, action))
```

這份實作放進官方的 `nim.py` 實跑過（Python 3.15），結果就是上面「怎麼檢查」列的數字。對手是隨機的那幾項，不代表它對任何對手都不會輸。

</details>

---

## 學習檢核清單

- [ ] 能說出最近鄰與 k-NN 的差別，並對一組距離手算 `k` 不同時的分類結果
- [ ] 能寫出 perceptron learning rule，並說明估對、估高、估低三種情況權重各怎麼變
- [ ] 能說明 0-1、L1、L2 三種 loss 各用在哪裡，以及 L2 為什麼對大誤差罰得重
- [ ] 能解釋 overfitting，以及 regularization、holdout、k-fold cross-validation 各自怎麼對付它
- [ ] 能手寫 Q-learning 更新式，並說明 `α` 與 `ε` 各管什麼
- [ ] 理解 sensitivity 與 specificity 為什麼比單一準確率有用（Shopping 專案）
- [ ] Shopping：自己的 `load_data` 讀出 12,330 列、第一列等於規格的檢查點、標籤加總是 1,908；`evaluate([1, 1, 0, 0, 0], [1, 0, 0, 0, 1])` 得到 (0.5, 約 0.667)
- [ ] Nim：不訓練的六步小案例全部對得上（0、−0.5、−0.75、0、0、`(3, 1)`）；訓練 10,000 局後 state `[0, 0, 0, 2]` 選 `(3, 1)`
- [ ] 理解 Nim 的 `self.q` 為什麼要把 state 轉成 tuple 才能當鍵
- [ ] 理解 `choose_action` 在訓練（`epsilon=True`）與對戰（`epsilon=False`）時的不同行為
- [ ] 兩個專案 `check50` 全綠

## 課程影片來源

官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）已於 2026-10-10 即時核對，第 4 週講課錄影在清單中。

原始影片：[Learning - Lecture 4 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=-g0iJjnO2_w)

課程與錄影入口：

- [CS50 AI Week 4 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/4/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-13）：用 yt-dlp 取得帶時間碼的英文人工字幕，讀完全片 1:45:48 後重寫「講課導讀」，各節起點與文中引用的數字（k-NN 的 3 票對 2 票、0-1 loss 的 4、銷售額 2,800／2,900／1,000、十份的 k-fold、紙鈔實測的 679／7、682／4、685／1、Q 值的 10 與 20、Nim 的 1-3-5-7 與 10,000 局）都取自字幕；公式另外對照了官方筆記的文字與兩張式子圖（`perceptronlearning.png`、`qlearning.png`，2026-10-13 下載看過）：perceptron 更新式裡乘上 `xᵢ` 的部分字幕沒有唸出，取自官方筆記的式子；官方筆記的 Q-learning 式子在 max 那一項前有 γ，講者口頭只說可以再加一個打折的參數、沒有取名字，本文的式子照口述寫，沒有放 γ。沒有看投影片，散佈圖、決策邊界與格子世界的畫面沒有重建。25:57 前後人工字幕寫成「these is are positive values」，依自動字幕與上下文是 these x's。1:32:57 的 Nim 範例對局，講者前兩步只說「this pile here」，誰從哪一堆拿字幕判斷不出來，本文只寫兩步之後他報的盤面。字幕與示範不合的地方有四處：1:33 的 Nim 範例對局，講者說玩家 2 從「第三堆」拿 2 個，依他前後報的數字應是剩 3 個的那一堆，本文依數字寫；1:36 的第二局示範，依口述的拿法輪到講者時應是 3 個與 2 個兩堆，他說的是兩堆各 2 個，看不到畫面無法判斷哪一句有誤，本文照他說的寫並在文中註明；1:38:43 講者把三大類說成「reinforcement learning 的兩大類」，依上下文是 machine learning 的類別；1:37:31 字幕標為聽不清的「min and max… death limiting」依上下文是 Minimax 的 depth-limiting。公開的講課原始碼 `banknotes0.py` 預設模型是 `GaussianNB()`、測試比例是 0.40，`banknotes1.py` 的 `test_size` 也是 0.4，和講課當場（Perceptron 起、取一半）不同，本文依講課寫。Nim 在影片中是 Q-learning 的示範，字幕全程沒有提到 Shopping 與 Nim 兩份專案作業，專案說明來自課程官網與官方 zip。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 CS50 YouTube 播放清單即時核對，本週講課錄影存在，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。重排影片時間表以符合字幕內容，移除字幕中找不到的主題，時間碼改為約略值。
- 2026-10-13：播放器從文末來源區移到「課程影片與時間軸」，開頭補上片長。
- 2026-10-13：「核心概念速覽」依帶時間碼的字幕重寫成十節的「講課導讀」，每節附時間連結與一題自我檢查；時間表從約略分鐘數改為實際起點，片長依 yt-dlp 回報改為 1:45:48。原速覽裡講課沒有提到的內容已移除：三種分類演算法的複雜度與優缺點比較表、k-NN 要先標準化特徵、SVM 的硬間隔／軟間隔目標式與各種 kernel 的式子、貝爾曼方程、折扣因子 γ 的式子與 Q-learning 收斂條件。
- 2026-10-13：兩個專案節依官方 zip 與規格頁重寫。Shopping：`train_model` 原本回傳 `(model, scaler)`，官方 `main` 直接對回傳值呼叫 `predict`，會出錯，改為回傳 `KNeighborsClassifier(n_neighbors=1)` 本身，並拿掉規格沒有要求的標準化。Nim：原本寫「拿走最後一顆者獲勝」，官方規則是拿走最後一個的人輸；原本貼的 `Nim`、`NimAI`、`train`、`play` 與官方 `nim.py` 的類別和方法對不上，改為官方的結構與要實作的四個方法（`get_q_value`、`update_q_value`、`best_future_reward`、`choose_action`）；執行指令拿掉沒有作用的 `python nim.py`。兩份參考實作都放進官方目錄實跑過。學習檢核清單同步改寫。
- 2026-10-13：依獨立審稿修正。Nim 範例對局前兩步合併成一列，不再寫字幕判斷不出來的「誰拿哪一堆」；折扣參數改寫為口頭沒有取名、官方筆記的式子記成 γ；perceptron 自我檢查的答案改為再更新一次就翻過去，並補上算式；`× xᵢ` 的出處改為官方筆記的式子；hard threshold 的兩個問題改照講者的順序；補上 `banknotes1.py` 的 `test_size=0.4`；紙鈔與 Shopping 的重跑結果改為作者與審稿者合併後的次數與範圍；SVM 處理線性不可分那一句註明講者沒有說明做法；跨週連結改成不把週次掛在講者身上。用語：「OCW 官網」改「課程官網」、「播放列表」改「播放清單」、來源區的「Week 4」改「第 4 週」。
- 2026-10-13：專案節改成任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方、檢查方式在前，完整參考實作摺疊在各專案最後並加警語，連到課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)。distribution code 節錄改為逐字取自官方檔案（含 docstring）。參考實作的程式碼沒有改動。學習檢核清單加上兩個專案的可驗證條件。
- 2026-10-13：依專案節複審修正。「不要自己加標準化」那一條改寫：寫明用的是 `StandardScaler`、作者與審稿者各跑幾次與各自的範圍，症狀改成常見情況是 true positive rate 掉到接近 0 而 true negative rate 反而更高，原本的「88% 與 20%」是少數翻到另一邊的情況。Shopping 的實跑範圍改成約略值並更新次數；檢核清單的六步補上第一個值；虛擬碼裡欄位分類的用詞改成「分類編號」；tldr 與 description 不再預告專案實作。

## 參考資料

- [Week 4 Learning 講課頁](https://cs50.harvard.edu/ai/weeks/4/) — 影片、投影片、逐字稿、Quiz
- [Learning - Lecture 4（YouTube）](https://www.youtube.com/watch?v=-g0iJjnO2_w) — 「講課導讀」的底本，內容、數字與時間連結取自它的英文字幕
- [Week 4 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/4/) — 官方筆記，可對照投影片上的圖與公式
- [Shopping 專案規格](https://cs50.harvard.edu/ai/projects/4/shopping/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/shopping`
- [Nim 專案規格](https://cs50.harvard.edu/ai/projects/4/nim/) — Distribution code `2023/x`、check50 slug `ai50/projects/2024/x/nim`
- [CS50 AI 學術誠信政策](https://cs50.harvard.edu/ai/honesty/) — 專案解答預設摺疊的依據
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
