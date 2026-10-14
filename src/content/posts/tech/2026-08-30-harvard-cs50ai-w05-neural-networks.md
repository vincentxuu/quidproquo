---
title: "Neural Networks——反向傳播、TensorFlow/Keras、CNN 與交通號誌辨識｜Harvard CS50 AI 第 5 週"
date: 2026-08-30
category: tech
type: guide
tags: [harvard-cs50ai, ai, neural-networks, backpropagation, tensorflow, keras, cnn, traffic, python, cs50]
lang: zh-TW
series:
  name: "Harvard CS50 AI 導讀"
  order: 6
tldr: "第 5 週講神經網路：一個 unit 把輸入乘上權重、加 bias、再過 activation function；梯度下降一小步一小步調權重，隱藏層靠 backpropagation 把誤差往回分；影像先做卷積與 pooling 再接一般網路，就是 CNN；序列資料用 RNN 把輸出餵回自己。附逐段時間連結，以及 Traffic 專案的解題思路、易錯處與檢查方式。"
description: "Harvard CS50 AI 第 5 週 Neural Networks 導讀：依 2020 年講課錄影的字幕逐段整理 unit 與 activation function、用一個 unit 算 OR 與 AND、梯度下降與 mini-batch、perceptron 的線性可分限制、隱藏層與 backpropagation、dropout、TensorFlow Playground 與 Keras 範例、影像卷積、max-pooling、CNN 與 RNN，每節附可點的時間連結與自我檢查，另有 Traffic 專案的規格、解題思路、虛擬碼、容易出錯的地方與檢查方式，完整參考實作摺疊在最後。專案規格以 2026 年為準。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en)

**影片狀態：已附影片。** 全片 1:41:19。本文的「講課導讀」依這支錄影的英文字幕逐段寫成，每一節開頭有時間連結，點了頁面上的播放器會跳到那一段。講課沒有介紹本週專案，專案部分依課程官網寫成；專案的完整參考實作預設不顯示，摺疊在專案一節的最後。[跳到播放器](#課程影片與時間軸)｜[影片來源與說明](#課程影片來源)

> ⚠️ **版本提醒**：本週講課影片為 **2020 年春季錄製**；專案規格、distribution code、check50 slug 均以 2026 年課程官網最新版為準（`ai50/projects/2024/x/...`）。

## TL;DR

第 5 週從上一週的線性分類器接下去：把「輸入乘權重、加 bias、過 activation function」畫成一個 unit，許多 unit 接起來就是神經網路。權重用梯度下降來調；單一 unit 只能畫一條直線當邊界，所以中間要加隱藏層，隱藏層的權重靠 backpropagation 訓練。錄影後半處理兩種特殊的輸入：影像用卷積與 pooling 先抽出特徵（CNN），長度不固定的序列用會把輸出餵回自己的 recurrent neural network（RNN）。專案 Traffic 要訓練一個 CNN 辨識 43 種交通號誌。

這篇分成兩半：前半「講課導讀」跟著錄影走，後半是 Traffic 專案的實作說明，講課沒有提到專案。

## 課程影片與時間軸

全片 1 小時 41 分，下面「講課導讀」的十個小節依序涵蓋整支錄影。每一節開頭和文中的時間連結都能點，頁面上的播放器會跳到那一段；某一節看不懂時，直接回去聽講者怎麼講。

```youtube
url: https://www.youtube.com/watch?v=J1QD9hLDEDY
title: Neural Networks - Lecture 5 - CS50's Introduction to Artificial Intelligence with Python 2020
```

YouTube：[Week 5 Neural Networks (2020 錄製)](https://www.youtube.com/watch?v=J1QD9hLDEDY)

> 時間說明：下表時間已依帶時間碼的英文字幕核對（2026-10-13），是講者開始講各主題的位置，不是官方章節。此表只描述這支 2020 年的錄影；課程目前版本的講課內容與順序可能不同，且影片本身沒有介紹本週專案。

| 時間（點了從該處播放） | 內容 |
|---|---|
| [0:00–15:24](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=0s) | 從生物神經元到 unit：權重、bias、activation function，用一個 unit 算 OR 與 AND |
| [15:24–21:27](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=924s) | 梯度下降，以及 stochastic 與 mini-batch 兩種變形 |
| [21:27–30:00](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1287s) | 多個輸出的網路，perceptron 只能學線性可分的邊界 |
| [30:00–38:52](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1800s) | 隱藏層、backpropagation、deep neural network、overfitting 與 dropout |
| [38:52–45:50](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2332s) | TensorFlow Playground：隱藏層的 unit 各學一條邊界 |
| [45:50–53:01](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2750s) | `banknotes.py`：用 Keras 訓練辨識偽鈔的網路 |
| [53:01–1:05:51](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3181s) | 電腦視覺：影像當輸入的問題、影像卷積與 kernel |
| [1:05:51–1:14:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3951s) | Pooling 與卷積神經網路（CNN）的結構 |
| [1:14:28–1:26:03](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4468s) | `handwriting.py`：用 CNN 辨識 MNIST 手寫數字 |
| [1:26:03–1:41:19](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5163s) | Feed-forward 網路的限制、recurrent neural network 與收尾 |

> 官方筆記與投影片：[Week 5 Notes](https://cs50.harvard.edu/ai/2020/notes/5/)

## 講課導讀

以下依錄影的英文字幕逐段寫成。光讀字幕看不到投影片，網路的圖、資料點的分布與 Playground 的畫面本文不重建，只寫講者口頭說出的數字與推理；卷積、pooling 與 CNN 結構的圖在[官方筆記](https://cs50.harvard.edu/ai/2020/notes/5/)裡有。兩段 Keras 程式碼取自課程網站提供的講課原始碼，講者沒有唸出來的地方會註明。每節結尾的自我檢查都是本文出的題目，不是講課內容；其中沿用講課例子的會寫明，標「本文自擬」的連例子也是本文編的。

用語上，講者把網路裡的一個小單位交替叫做 unit、node 與 neuron，本文一律寫 unit。

### 一個 unit 在算什麼

[錄影 0:00–15:24](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=0s)

講者 Brian Yu 從神經網路的來歷講起：早在 1940 年代，研究者就在想能不能把人腦學習的方式搬到電腦上。他提了科學家在生物神經網路上觀察到的兩個性質：神經元彼此相連、互相傳遞電訊號；神經元處理收到的訊號，到某個程度就被啟動，再把訊號往下傳。人工神經網路（artificial neural network）是受這個結構啟發的數學模型，裡面的小單位叫 **unit**，unit 之間用邊相連。講者說，每一個神經網路其實就是一個把輸入對應到輸出的數學函數，學習的目標是找出這個函數的參數。

接著他接回上一週的內容。上一週要用兩個天氣變數 `x₁`、`x₂` 預測會不會下雨，用的假設函數是輸入的線性組合：

```text
h(x₁, x₂) = w₀ + w₁·x₁ + w₂·x₂
```

`w₁`、`w₂` 是**權重**（weight），各乘上一個輸入。`w₀` 不乘任何輸入，作用是把整個結果往上或往下移；可以把它想成乘上固定的 1，文獻裡也常把它叫做 **bias**。講者說兩種叫法都會遇到。

算出來的數字還要變成「下雨」或「不下雨」，這一步交給 **activation function**。講課提到三種：

| 名稱 | 做什麼 |
|---|---|
| Step function | 加權後的結果大於或等於 0 就輸出 1，否則輸出 0 |
| Logistic sigmoid | S 形曲線，輸出 0 到 1 之間的實數，可以當成機率（例如 0.5、0.8） |
| ReLU（rectified linear unit） | 取輸入與 0 之中較大的那個：正數不變，負數變成 0 |

整件事寫成一句話：算出輸入的線性組合，再套上某個函數 `g`。把它畫成圖，就是最簡單的神經網路：兩個輸入 unit，各用一條帶權重的邊連到一個輸出 unit；輸出 unit 把每個輸入乘上權重、加上 bias、過 activation function。

講者用邏輯運算示範這個結構真的能算出東西（[9:26](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=566s)）。要算 OR，兩個權重都設成 1，bias 設成 −1，activation function 用 step function：

| `x₁` | `x₂` | 加權和加 bias | 輸出 |
|---|---|---|---|
| 0 | 0 | 0 + 0 − 1 = −1 | 0（還沒到門檻） |
| 1 | 0 | 1 + 0 − 1 = 0 | 1（剛好在門檻上） |
| 1 | 1 | 1 + 1 − 1 = 1 | 1 |

三列都和 OR 的真值表相符。要算 AND（[12:09](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=729s)），權重不動，只把 bias 改成 −2：輸入是 1 和 1 時，1 + 1 − 2 = 0，剛好到門檻，輸出 1；輸入是 1 和 0 時，1 + 0 − 2 = −1，輸出 0。

同一個結構換掉輸入與輸出的意義，就能用在別的問題上：給濕度與氣壓，算下雨的機率；給廣告費與月份，預測當月銷售額（這是迴歸）。輸入也不限兩個。有五個輸入時，做法是把 `x₁` 到 `x₅` 各自乘上對應的權重、全部加起來，最後加 bias。

**自我檢查｜先寫下答案，再展開。** 兩個權重維持 1，activation function 維持 step function，把 bias 改成 −1.5。四種輸入各輸出多少？這個 unit 算的是 OR 還是 AND？（本文自擬）

<details>
<summary>答案</summary>

(0, 0)：0 + 0 − 1.5 = −1.5，輸出 0。(1, 0) 與 (0, 1)：1 − 1.5 = −0.5，輸出 0。(1, 1)：2 − 1.5 = 0.5，輸出 1。只有兩個輸入都是 1 才輸出 1，是 AND。

講課的 AND 用的 bias 是 −2，這裡 −1.5 也行，可見能算出同一個函數的權重不只一組。bias 只要在 −2（含）到 −1（不含）之間都算得出 AND：(1, 1) 要輸出 1 需要 `2 + b ≥ 0`，(1, 0) 要輸出 0 需要 `1 + b < 0`。這一句是本文的推論。

</details>

### 梯度下降：讓電腦自己找權重

[錄影 15:24–21:27](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=924s)

OR 與 AND 簡單到可以直接報出權重。預測銷售額或降雨就沒辦法用想的，要讓電腦自己算出權重該是多少。講者介紹的方法是**梯度下降**（gradient descent），一個在訓練神經網路時把 loss 降到最低的演算法。

Loss 是上一週的概念：一個數字，說明這組假設在資料上表現得多差。Loss 函數是數學函數，可以算它的**梯度**（gradient）；講者說可以把梯度想成斜率，它指出在目前這組權重上，loss 往哪個方向變化，也就告訴我們權重該往哪邊移才能讓 loss 變小。微積分的細節他明說不講。

流程如下：

1. 權重先隨機選。
2. 重複以下兩步：
   - 依**所有資料點**算出梯度。
   - 照梯度把權重移動一小步。

一步要跨多大可以自己選，講者沒有替這個量取名字。重複夠多次，權重會逐漸變好，他的說法是「至少我們希望如此」。

接著他問：這個演算法哪裡最花力氣？答案是「所有資料點」那幾個字。資料很多時，每走一小步都要把全部資料算一遍，而且要走很多步。於是有兩種比較快的變形：

- **Stochastic gradient descent**（[19:33](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1173s)）：每次隨機挑一個資料點，只依這一點算梯度、更新權重。梯度估得比較不準，但算得快很多。
- **Mini-batch gradient descent**（[20:39](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1239s)）：折衷的做法。把資料分成小批，每次依一批算梯度。一批多大自己決定。比只看一點準，又不必每次看完全部資料。

**自我檢查｜先寫下答案，再展開。** 有 10,000 筆訓練資料。把全部資料看過一遍，標準的梯度下降、stochastic gradient descent、一批 100 筆的 mini-batch gradient descent，各會更新幾次權重？（本文自擬）

<details>
<summary>答案</summary>

標準的梯度下降看完 10,000 筆才更新 1 次。Stochastic 每看 1 筆就更新，共 10,000 次。Mini-batch 每 100 筆更新一次，10,000 ÷ 100 = 100 次。

同樣把資料看一遍，更新次數差了一萬倍，代價是更新得越頻繁，每一次所依據的梯度就越粗略。講課對 mini-batch 的說法就是兩邊各取一些：估得比單一資料點準，算得比全部資料快。

</details>

### 多個輸出，以及一個 unit 的極限

[錄影 21:27–30:00](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1287s)

到這裡的網路都只有一個輸出。輸出層也可以加 unit，就像輸入層可以加一樣。要讓兩層之間保持「全連接」（每個輸入都連到每個輸出），就得多加權重：輸出有四個時，每個輸入 unit 帶四個權重。

多個輸出的用途是多類別分類。天氣不只分下雨與不下雨，可以分成雨、晴、陰、雪四類，四個輸出各代表一類的機率。講者的例子是輸出 10%（雨）、60%（晴）、20%（陰）、10%（雪），最高的是晴，就預測晴天。

同一個結構也能用在強化學習：輸入是目前 state 的資訊，四個輸出各對應一個可以採取的動作，挑數值最好的那個動作來做。講者的總結是，只要問題能寫成數學函數，就可以試著用這個結構去模擬它。

這種網路怎麼訓練？講者說，在輸入直接連到輸出的情況下，四個輸出可以看成四個各自獨立的網路：每個輸出有自己的一組權重，共用同樣的三個輸入，分開訓練就好。最後可能再多一步，把四個數值轉成機率分布。

然後是限制（[28:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1698s)）。做二元分類的單一 unit 叫做 **perceptron**。它拿輸入的線性組合去和門檻比，所以它的決策邊界只能是一條直線，只處理得了**線性可分**（linearly separable）的資料。講者舉的反例是一類的點被另一類圍在圓圈裡：沒有任何一條直線能把兩類分開。它可以依資料點離邊界多近給出機率，但邊界本身還是直線。真實世界的資料常常不是線性可分的。

**自我檢查｜先寫下答案，再展開。** XOR 的規則是兩個輸入恰好一個為 1 時輸出 1，其餘輸出 0。用第一節那種 unit（兩個權重 `w₁`、`w₂`，bias `b`，step function）能不能算出 XOR？（本文自擬）

<details>
<summary>答案</summary>

不能。把四種輸入的要求寫出來：

- (0, 0) 要輸出 0：`b < 0`
- (1, 0) 要輸出 1：`w₁ + b ≥ 0`
- (0, 1) 要輸出 1：`w₂ + b ≥ 0`
- (1, 1) 要輸出 0：`w₁ + w₂ + b < 0`

把第二、三式相加得到 `w₁ + w₂ + 2b ≥ 0`，也就是 `w₁ + w₂ + b ≥ −b`。第一式說 `−b > 0`，所以 `w₁ + w₂ + b > 0`，和第四式矛盾。沒有任何一組權重能同時滿足四個條件，這就是「不是線性可分」的意思：輸出 1 的兩個點和輸出 0 的兩個點，用一條直線分不開。講課沒有提到 XOR，它的例子是圓圈內外的點。

</details>

### 隱藏層、backpropagation 與 dropout

[錄影 30:00–38:52](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1800s)

解法是**多層神經網路**（multilayer neural network）：除了輸入層與輸出層，中間再加一層或多層**隱藏層**（hidden layer）。講者的例子是三個輸入、一個輸出，中間插進一層四個 unit 的隱藏層。輸入不再直接連到輸出，而是先連到隱藏層的每個 unit，隱藏層的 unit 再連到輸出。

計算分兩段。每個隱藏層的 unit 依輸入的線性組合算出自己的值（講者說這個值也叫做它的 activation）；輸出 unit 再把這四個值各乘上權重，算出最後的結果。好處是每個隱藏層的 unit 可以各學一條不同的決策邊界，再把這些邊界組合起來。

問題在怎麼訓練。訓練資料只告訴我們輸入是什麼、輸出應該是什麼，沒有告訴我們中間那些 unit 的值應該是多少，所以算不出它們各錯了多少。講者說這就是「隱藏」這個名字的由來。

解決的想法（[32:58](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=1978s)）：輸出 unit 的誤差是知道的。依連到輸出的各條權重的大小，可以估計這個誤差有多少該算在隱藏層的哪一個 unit 頭上。把誤差這樣往回分，就是 **backpropagation**（反向傳播）。講者同樣略過微積分，只給流程：

1. 權重先隨機選。
2. 重複以下步驟：
   - 算出輸出層的誤差。
   - 從輸出層開始，一層一層往回走到最前面的隱藏層：把誤差往回傳一層，再更新那一層的權重。

講者說 backpropagation 是讓神經網路成為可能的關鍵演算法。隱藏層可以不只一層，有多層隱藏層的網路叫做 **deep neural network**，「深度學習」指的就是用多層結構去學輸入裡較高層次的特徵。

模型越複雜，越容易 **overfitting**：太貼合訓練資料，換到別的資料就不準。講者說在 unit 很多的網路裡，常見的情況是過度依賴其中某幾個 unit。對付它的常用技巧是 **dropout**（[37:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2238s)）：訓練時隨機挑一部分 unit 暫時拿掉，當作它們和它們的權重都不存在；下一次更新權重時再換另一批。這樣訓練出來的網路不會太依賴任何一個 unit。

**自我檢查｜先寫下答案，再展開。** 講課那個網路有三個輸入、一層四個 unit 的隱藏層、一個輸出，相鄰兩層全連接。不算 bias，一共有幾個權重？訓練資料直接給了其中哪些 unit 的正確值？

<details>
<summary>答案</summary>

輸入到隱藏層是 3 × 4 = 12 個，隱藏層到輸出是 4 × 1 = 4 個，共 16 個。如果每個隱藏層 unit 與輸出 unit 各有一個 bias，再加 5 個，是 21 個；bias 的部分講課在這一段沒有提，是照第一節的定義算的。

訓練資料給的是三個輸入的值與一個輸出應有的值。四個隱藏層 unit 應該是多少，資料裡沒有，所以它們的誤差只能從輸出的誤差依權重往回估，這就是 backpropagation 要做的事。

</details>

### TensorFlow Playground：每個隱藏層 unit 學一條邊界

[錄影 38:52–45:50](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2332s)

要把這些想法寫成程式，不必自己實作 backpropagation，可以用現成的函式庫。講者用的是 Google 開發的 TensorFlow。寫程式之前，他先打開 TensorFlow Playground，一個可以在瀏覽器裡調整網路結構、看它訓練的網頁。任務是把平面上的橘色點和藍色點分開，輸入特徵是每個點的 x 與 y 座標。他依序試了三組資料。

**第一組：兩群點可以用一條直線分開。** 沒有隱藏層，按下播放，網路很快學到一條直線當邊界，training loss 降到 0。

**第二組：藍色點在兩個象限，橘色點在另外兩個象限**（[40:58](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2458s)）。沒有任何一條直線能分開它們。

| 隱藏層的 unit 數 | 講者看到的結果 |
|---|---|
| 0（沒有隱藏層） | 畫不出像樣的分界 |
| 2 | 好一點：有些區域確定是藍、有些確定是橘，上方的點還分不清楚 |
| 3 | 比兩個的時候好 |
| 4 | 再更好 |

有兩個 unit 的時候，講者逐一看每個 unit 學到什麼：第一個學到一條把部分藍色點分出去的直線，第二個學到一條把右下角橘色點分出去的直線。輸出再把這幾條邊界組合起來。畫面上連線的粗細代表權重的大小。

**第三組：藍色點在圓圈裡面，橘色點在外面**（[44:01](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2641s)）。這就是上一節 perceptron 處理不了的情況。沒有隱藏層時完全分不出來。兩個 unit 學到兩條直線（講者指出其中一條在右側），網路的判斷是「兩條線之間是藍色，外側是橘色」，講者說不算好，但比剛才好。加到三個 unit，三條邊界組合起來，就能相當準確地把圓圈內外分開。

講者的結論是：隱藏層的 unit 越多，能學到資料裡的結構越多；每條邊界的權重該是多少，由 backpropagation 去找。

**自我檢查｜先寫下答案，再展開。** 第三組資料上，兩個隱藏層 unit 為什麼只能得到「兩條線之間是藍色」，圈不出圓形的區域？加到三個之後為什麼可以？

<details>
<summary>答案</summary>

以下是本文的推論，講課只展示了結果。每個隱藏層 unit 和第一節的 unit 一樣，只能學一條直線邊界。兩條直線圍不出封閉的區域：平行時夾出一條兩頭開口的帶子，不平行時夾出一個往外張開的楔形，總有圓圈外的橘色點落在裡面，被算成藍色。

三條直線就能圍出一個封閉的三角形，把藍色點包在裡面。三角形和圓不一樣，但已經比開口的區域接近得多。

</details>

### `banknotes.py`：用 Keras 把網路寫出來

[錄影 45:50–53:01](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2750s)

第一個程式用的是上一週出現過的鈔票資料：每張鈔票有四個數值，以及一個標籤，說它是真鈔還是偽鈔。程式前半讀進資料、切成訓練集與測試集，和上一週相同。後半建立網路，下面這段取自課程提供的講課原始碼：

```python
# banknotes.py 片段（講課原始碼 src5.zip）
model = tf.keras.models.Sequential()

# Add a hidden layer with 8 units, with ReLU activation
model.add(tf.keras.layers.Dense(8, input_shape=(4,), activation="relu"))

# Add output layer with 1 unit, with sigmoid activation
model.add(tf.keras.layers.Dense(1, activation="sigmoid"))

# Train neural network
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)
model.fit(X_training, y_training, epochs=20)

# Evaluate how well model performs
model.evaluate(X_testing, y_testing, verbose=2)
```

講者逐行解釋：

- `tf` 是 `import tensorflow as tf` 取的縮寫。Keras 是 TensorFlow 裡用來操作神經網路的一組 API。
- `Sequential` 表示這是一層接一層的網路。
- `Dense` 是全連接層：這一層的每個 unit 都連到前一層的每個 unit。第一個 `Dense` 是隱藏層，有 8 個 unit。講者說 8 是隨意選的。
- `input_shape=(4,)` 說明輸入有四個值。隱藏層的 activation function 用 ReLU。
- 輸出層只要 1 個 unit，因為只需要分真鈔與偽鈔；activation function 用 sigmoid，輸出可以看成機率。
- `compile` 要指定三件事：用哪種演算法最佳化權重、用哪種 loss 函數、用什麼指標評估。講者只說這裡關心 accuracy，前兩項各有很多選擇；程式碼裡寫的 `adam` 與 `binary_crossentropy` 他沒有唸出來，也沒有解釋。
- `fit` 的 `epochs=20` 表示把全部訓練資料走 20 遍。
- `evaluate` 在測試資料上算表現。

講到隱藏層要幾個 unit 時，他多說了一段取捨：unit 多，能學更複雜的函數，但要更新的權重也多、算起來貴，而且容易 overfitting。實務上會另外留一份資料當 **validation set**，用它比較不同的層數與 unit 數哪一種最好。這類要自己決定的設定叫做 **hyperparameter**。

執行結果（[51:13](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3073s)）：第一個 epoch 在訓練資料上的 accuracy 大約 79%，之後一路上升，20 個 epoch 之後超過 99%；測試資料上是 99.8%。講者補了一句，這是在這份測試資料上的數字，要更有把握還得拿更多資料測。

他的總結是：寫的人只定義了網路的結構和要餵進去的資料，backpropagation 由 TensorFlow 執行。

**自我檢查｜先寫下答案，再展開。** 上面這個網路有四個輸入、一層 8 個 unit 的隱藏層、一個輸出 unit。把 bias 也算進去，訓練時一共要學幾個數字？（本文自擬）

<details>
<summary>答案</summary>

隱藏層：每個 unit 有 4 個權重加 1 個 bias，8 × (4 + 1) = 40。輸出層：1 個 unit 有 8 個權重加 1 個 bias，共 9。合計 49 個。

本文用 TensorFlow 2.21 建了同樣結構的模型，`count_params()` 回報的也是 49（兩層分別是 40 與 9）。講課沒有算這個數字。

</details>

### 影像當輸入：卷積與 kernel

[錄影 53:01–1:05:51](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3181s)

錄影後半轉到**電腦視覺**（computer vision）：用計算的方法分析、理解影像。講者舉了三個應用：社群網站替照片裡的臉標上人名、自駕車從鏡頭畫面判斷號誌顏色與周圍的車、辨識手寫數字。手寫數字用的資料集叫 MNIST。

神經網路的輸入只能是數字，所以先看影像怎麼變成數字。影像是一格一格的像素。黑白影像的每個像素是一個 0 到 255 的數字，0 是全黑，255 是全白，中間是灰階，剛好用 8 個 bit 表示。彩色影像的每個像素有三個數字，分別是紅、綠、藍的量。

最直接的做法是把每個像素當成一個輸入（彩色就是三個），接上一個 deep neural network，輸出 10 個 unit 對應 0 到 9。講者指出這樣做有兩個問題（[56:57](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3417s)）：

1. 輸入太多。影像一大，輸入就多，要算的權重也跟著多。
2. 把像素攤平成一長串，就丟掉了影像的結構。人看影像時看的是曲線、形狀、哪個區域有什麼東西，不是一個一個獨立的像素。

第一個對策是**影像卷積**（image convolution）（[58:09](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3489s)）：對影像套一個 filter，把每個像素的值和它周圍像素的值，依一個 **kernel** 矩陣給的權重加起來，目的是抽出影像裡有用的特徵。

做法是拿一個 3×3 的 kernel 蓋在影像的某個 3×3 區域上，九個像素各乘上 kernel 對應位置的數字，全部加起來得到一個數字；然後把 kernel 往旁邊滑一格，再算一次。講者在一張 4×4 的影像上示範：左上的 3×3 區域算出 10，往右滑一格算出 20，下一個區域算出 40，最後一個區域他沒有唸出數字。影像與這個 kernel 的原始數字在投影片上，[官方筆記](https://cs50.harvard.edu/ai/2020/notes/5/)的圖裡有，光看這裡沒辦法驗算。4×4 的影像用 3×3 的 kernel 掃過，得到 2×2 的結果，這張結果叫做 **feature map**。他順帶提到 kernel 可以更大（例如 5×5），一次也可以滑不只一格。

為什麼這樣能抽出特徵？講者換了一個他說很有名的 kernel（[1:01:35](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3695s)）：中間是 8，周圍八格都是 −1。

- 3×3 區域裡九個像素都是 20：20 × 8 減掉八個 20，結果是 0。
- 第一列是三個 20，第二、三列都是 50：講者說結果是 90。算式是 50 × 8 = 400，減掉上面三個 20（60）與周圍五個 50（250），400 − 60 − 250 = 90。這個算式是本文補的，講者只報了結果。

所以這個 kernel 在「中間像素和周圍差不多」時輸出接近 0，在「中間像素和周圍差很多」時輸出大的數字。物體的邊緣正是顏色突然改變的地方，這個 filter 可以用來偵測邊緣。

他用 `filter.py` 實際跑了一次（[1:03:30](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3810s)）：用 Python 的影像函式庫 PIL 打開一張橋的照片 `bridge.png`，套上這個 3×3 的 kernel，輸出的影像只剩下原圖裡各個部分之間的邊界。講者說，演算法要判斷照片裡是什麼的時候，未必在乎所有細節，這種輪廓可能很有用。彩色影像的 filter 可以對紅、綠、藍各用一個 kernel，最後把結果加總。

**自我檢查｜先寫下答案，再展開。** 用講課那個「中間 8、周圍 −1」的 kernel，算這兩個 3×3 區域：(a) 中間是 50，周圍八格都是 20；(b) 九格都是 50。哪一個比較像邊緣上的點？（本文自擬）

<details>
<summary>答案</summary>

(a) 50 × 8 − 8 × 20 = 400 − 160 = 240。(b) 50 × 8 − 8 × 50 = 0。

(b) 整塊一樣亮，不管是 20 還是 50，結果都是 0，這個 kernel 不在乎區域本身多亮。(a) 的中間像素和周圍差了 30，輸出就是 8 × 30 = 240。輸出的大小反映中間和周圍差多少，所以 (a) 比較像邊緣。講課的例子只有一邊的鄰居比較暗，輸出是 90，比 (a) 小。

</details>

### Pooling 與卷積神經網路的結構

[錄影 1:05:51–1:14:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=3951s)

卷積之後影像還是很大。除了輸入多，講者點出另一個問題：我們其實不在乎某個特徵落在這一個像素還是右邊那一個像素，只在乎它在不在這一帶。

對策是 **pooling**：從輸入的各個區域取樣，把輸入縮小。最常見的一種是 **max-pooling**，每個區域只留最大值。講者的例子是對一張 4×4 的影像做 2×2 的 max-pooling：四個 2×2 區域的最大值依序是 50、110、20、40，於是 4×4 縮成 2×2（那張 4×4 影像的原始數字同樣只在投影片與官方筆記的圖上）。好處有兩個：輸入變少；而且 50 落在那個區域的哪一格都沒差，分析變得比較不受位置的小變動影響。

把卷積、pooling 與原本的網路接起來，就是**卷積神經網路**（convolutional neural network，CNN）（[1:08:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4098s)）。流程是：

1. **卷積**：對輸入影像套上好幾個不同的 filter，每個 filter 產生一張 feature map。
2. **Pooling**：把每張 feature map 縮小。除了 max-pooling，也有取平均值的 average-pooling。
3. **Flatten**：把縮小後的所有數值攤平成一排。
4. 接上一般的神經網路，每個數值是一個輸入，中間可以有隱藏層。

這裡有一個重點：filter 裡的數字不必由人指定。就像網路會學 unit 之間的權重，kernel 裡的值也可以用同樣的方式訓練，目標一樣是讓 loss 最小。

卷積與 pooling 也可以做不只一輪（[1:11:46](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4306s)）。講者描述的分工是：第一輪學低階的特徵，像邊緣、曲線、形狀；第二輪在這些結果上再找高階的特徵，像物體、人臉辨識裡的眼睛、手寫數字裡的彎。

他最後說，分析影像不一定非用 CNN 不可，一層一層的一般網路也能做。CNN 有用的地方在於它比較像人看影像的方式：人不會同時盯著每一個像素，卷積做的也是看影像的各個區域，從中抽出特徵再組合。

**自我檢查｜先寫下答案，再展開。** 對下面這張 4×4 的影像做 2×2 的 max-pooling，結果是什麼？如果把左下區域的 9 往上移一格（和它上面的 0 對調），結果會變嗎？（本文自擬）

```text
1 3 2 0
5 2 4 8
7 0 1 1
6 9 3 2
```

<details>
<summary>答案</summary>

四個區域是左上（1、3、5、2）、右上（2、0、4、8）、左下（7、0、6、9）、右下（1、1、3、2），最大值分別是 5、8、9、3，結果是：

```text
5 8
9 3
```

把 9 往上移一格，左下區域變成 7、9、6、0，最大值仍是 9，結果完全不變。這就是講課說的第二個好處：特徵在區域內移動一格，pooling 之後看不出差別。如果移出了這個 2×2 區域，結果就會變。

</details>

### `handwriting.py`：用 CNN 辨識手寫數字

[錄影 1:14:28–1:26:03](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4468s)

第二個程式把上一節的結構寫成程式碼，資料用 TensorFlow 內建的 MNIST。讀進資料後先做整理，講者只提了其中一項：把像素值除以 255，從 0 到 255 換成 0 到 1，比較好訓練。下面是建立模型的部分，取自講課原始碼：

```python
# handwriting.py 片段（講課原始碼 src5.zip）
model = tf.keras.models.Sequential([

    # Convolutional layer. Learn 32 filters using a 3x3 kernel
    tf.keras.layers.Conv2D(
        32, (3, 3), activation="relu", input_shape=(28, 28, 1)
    ),

    # Max-pooling layer, using 2x2 pool size
    tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),

    # Flatten units
    tf.keras.layers.Flatten(),

    # Add a hidden layer with dropout
    tf.keras.layers.Dense(128, activation="relu"),
    tf.keras.layers.Dropout(0.5),

    # Add an output layer with output units for all 10 digits
    tf.keras.layers.Dense(10, activation="softmax")
])
```

和 `banknotes.py` 不同，這裡沒有一層一層 `model.add`，而是把所有的層放進一個 list 交給 `Sequential`。各層的意思：

- `Conv2D(32, (3, 3), ...)`：卷積層，學 32 個 filter，每個是 3×3 的 kernel。（講者一開始口誤說成 13，隨即更正為 32。）
- `input_shape=(28, 28, 1)`：MNIST 的每張圖是 28×28 像素，只有一個 channel，因為是黑白的。彩色影像會有紅、綠、藍三個 channel。
- `MaxPooling2D(pool_size=(2, 2))`：2×2 的 max-pooling。
- `Flatten()`：攤平。
- `Dense(128, ...)`：一層 128 個 unit 的隱藏層。
- `Dropout(0.5)`：訓練時隨機拿掉這一層一半的 unit，避免 overfitting。講者說在 TensorFlow 裡加 dropout 只要一行。
- `Dense(10, activation="softmax")`：輸出層 10 個 unit，各對應一個數字。**Softmax** 這個 activation function 會把輸出轉成機率分布。

接著一樣是 `compile`、`fit`、`evaluate`。這支程式多了一步：如果執行時給了檔名，就用 `model.save` 把訓練好的模型存成檔案。訓練要花時間，存下權重與 filter 的值，之後要預測就不必重新訓練。

執行（[1:20:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4828s)）：訓練資料有 60,000 張手寫數字，走 10 遍。第一遍結束時訓練 accuracy 大約 92%，接著到 96%、97%，到第八遍左右是 98%，之後趨於平緩。最後在 10,000 張測試資料上是 98.8%。講者趁等待的時間說了兩件事：訓練神經網路很吃運算資源，所以大家會用 GPU；資料越多，通常訓練得越好。他也提醒，這次訓練學到的不只是權重，還有卷積那一步要用的 kernel。

最後他用另一支以 PyGame 寫的 `recognition.py` 載入事先訓練好的模型（[1:23:34](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5014s)），在畫面上手寫一個 2，按下 Classify，程式回答 2；再寫一個 8，回答 8。講者的重點是，要用一堆 if-then 規則處理這些像素幾乎寫不出來，每個人寫的 8 都不一樣；這裡只給了網路的結構和訓練資料，其餘是網路自己學的。

**自我檢查｜先寫下答案，再展開。** 一張 28×28×1 的圖走過上面的模型，`Conv2D`、`MaxPooling2D`、`Flatten` 之後各是什麼形狀？提示：上上節那張 4×4 的影像用 3×3 的 kernel 掃過會變成 2×2。（本文自擬）

<details>
<summary>答案</summary>

`Conv2D`：3×3 的 kernel 在寬 28 的方向上有 28 − 3 + 1 = 26 個位置可以放（和 4 − 3 + 1 = 2 是同一種算式），高也是 26。有 32 個 filter，所以得到 32 張 feature map，形狀是 26×26×32。

`MaxPooling2D`：2×2 的區域取一個值，寬與高各減半，13×13×32。

`Flatten`：13 × 13 × 32 = 5,408 個數字排成一排，這 5,408 個數字就是後面那層 128 個 unit 的輸入。

本文用 TensorFlow 2.21 建了同樣的模型，各層回報的輸出形狀是 (26, 26, 32)、(13, 13, 32)、(5408)。講課沒有算這些形狀。

</details>

### Feed-forward 的限制與 recurrent neural network

[錄影 1:26:03–1:41:19](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5163s)

最後一段，講者先把到目前為止的網路畫成更抽象的樣子：輸入進去，網路做計算，輸出出來。這種網路叫 **feed-forward neural network**，連線只有一個方向，從輸入經過隱藏層到輸出。它的限制是輸入與輸出的形狀都固定：輸入層幾個 unit、輸出層幾個 unit，結構定了就不能變。

**Recurrent neural network**（RNN）多了一條回頭的路：網路的輸出會再餵回同一個網路，成為下一次計算的輸入。這讓網路能保有某種 state，把前面處理過的資訊帶到後面，適合處理序列資料。講者用輸入與輸出各是一個還是多個，把用法分成幾種。前面那些 feed-forward 網路是 one-to-one：一組輸入，一組輸出。

**One-to-many：一張圖，輸出一句話**（[1:29:21](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5361s)）。講者示範 Microsoft 的 CaptionBot：貼上一張哈佛廣場的照片，它回答「我想這是一群人走在建築物前面」。輸入是影像，輸出是一串字，而且字數隨照片不同，固定數目的輸出 unit 表示不了。RNN 的做法是一次只輸出一個字：第一次把影像送進網路，輸出第一個字；再跑一次同一個網路，這次的輸入來自網路自己上一次的輸出，產生第二個字；如此一直跑下去。講者特別說明，每一次跑的都是同一個網路、同一組權重，只是輸入不同。

**Many-to-one：一段序列，輸出一個分類**（[1:34:57](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5697s)）。例子是 YouTube 要分析影片。影片是一串長度不定的影像，沒辦法當成一個固定大小的輸入。做法是一次送進一個 frame，網路先不輸出，只把資訊留給下一次；處理第四個 frame 時，網路拿到的是第四個 frame 加上從前三個 frame 算出來的資訊。全部看完再輸出分類，例如這是教學影片還是音樂影片。同樣的結構可以用在判斷一則影評是正面還是負面（輸入是一串字），或把語音切成小段來辨識說話的人。

**Many-to-many：一段序列，輸出另一段序列**（[1:37:55](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5875s)）。例子是 Google Translate。逐字對翻行不通，因為不同語言的語序不同，一種語言用兩個字講的事另一種可能只要一個字。做法是先把輸入的字一個一個送進網路，全部送完之後，網路才開始一個字一個字輸出譯文。講者說，用神經網路這樣做是自動翻譯技術的一大進展，準確度提高很多。

RNN 有很多種，講者只點了其中很常用的一種：long short-term memory（LSTM）（[1:39:44](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=5984s)），沒有說明它的構造。收尾時他提到還有其他類型的網路，例如讓網路互相競爭來產生新資料的 adversarial network，並預告下一週講自然語言。

**自我檢查｜先寫下答案，再展開。** 下面四個任務，各屬於 one-to-one、one-to-many、many-to-one、many-to-many 的哪一種？(a) 辨識一張手寫數字；(b) 替一張照片寫一句說明；(c) 判斷一則影評是正面還是負面；(d) 把一句英文翻成中文。

<details>
<summary>答案</summary>

(a) one-to-one：一張固定大小的圖進去，一組固定大小的輸出（十個數字的機率）出來，feed-forward 網路就夠了。(b) one-to-many：一張圖進去，一串長度不定的字出來。(c) many-to-one：一串字進去，一個分類出來。(d) many-to-many：一串字進去，另一串字出來，而且兩串的長度不必相同。

四個都是講課舉過的例子。分辨的方法是看輸入和輸出各自是不是「長度會變的序列」；只要有一邊是，固定形狀的 feed-forward 網路就不夠用。

</details>

## 專案 5：Traffic —— CNN 訓練分類交通號誌

課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)不允許在繳交前看別人的解答，所以這一節預設只寫任務、官方給的程式、解題思路、虛擬碼、容易出錯的地方與檢查方式；完整的參考實作摺疊在最後，請先自己寫完並繳交再打開。

### 任務

用 German Traffic Sign Recognition Benchmark（GTSRB）資料集訓練一個神經網路，辨識照片裡是 43 種交通號誌中的哪一種。要在 `traffic.py` 裡完成兩個函式：

- `load_data(data_dir)`：讀進所有影像，每張縮成 `IMG_WIDTH` × `IMG_HEIGHT`，回傳 `(images, labels)`。
- `get_model()`：回傳一個已經 `compile` 的模型。輸入形狀是 `(IMG_WIDTH, IMG_HEIGHT, 3)`，輸出層要有 `NUM_CATEGORIES` 個 unit。中間用幾層、哪些層由你決定。

另外要交一份 `README.md`，用至少一兩段文字記錄你試過哪些架構、哪些有效、哪些沒效。規格明訂：除了這兩個函式，`traffic.py` 的其他部分不要改（可以另外加函式、匯入標準函式庫，以及 `numpy` 或 `pandas`）；檔案開頭的全域變數可以在測試時改。規格頁開頭另有提醒，這門課最新應使用 Python 3.12，這個專案因為 TensorFlow 的關係尤其如此。

資料集要另外下載（指令在下面「怎麼檢查自己寫的對不對」），解開後把 `gtsrb` 目錄放進 `traffic` 目錄。裡面有 43 個子目錄，名稱是 `0` 到 `42`，每個子目錄是一種號誌，放著那一種的影像：

```text
gtsrb/
├── 0/     # 類別 0 的影像
├── 1/
├── ...
└── 42/
```

沒有另外分訓練集與測試集的目錄，切分由 `main` 來做。本文下載的那一份（2026-10-13）共有 26,640 個 `.ppm` 檔，最少的一類 150 張，最多的一類 1,500 張。規格頁另外提供只有 3 種號誌的小資料集 `gtsrb-small`，方便先練習。

### 官方已提供的程式

官方 `traffic.py` 的開頭與兩個待實作的函式如下（docstring 以外原樣）。兩個函式都只有 `raise NotImplementedError`，都要自己寫；沒寫之前執行會直接丟出這個例外。

```python
import cv2
import numpy as np
import os
import sys
import tensorflow as tf

from sklearn.model_selection import train_test_split

EPOCHS = 10
IMG_WIDTH = 30
IMG_HEIGHT = 30
NUM_CATEGORIES = 43
TEST_SIZE = 0.4


def load_data(data_dir):
    """（docstring 略）"""
    raise NotImplementedError


def get_model():
    """（docstring 略）"""
    raise NotImplementedError
```

`main` 已經寫好，不用改。它做的事依序是：

1. 檢查命令列參數：`python traffic.py data_directory [model.h5]`，第二個參數可省略。
2. 呼叫 `load_data(sys.argv[1])` 取得 `images` 與 `labels`。
3. 用 `tf.keras.utils.to_categorical(labels)` 把整數標籤轉成 one-hot 向量，再用 `train_test_split(..., test_size=TEST_SIZE)` 切出 40% 當測試集。
4. 呼叫 `get_model()`，用 `model.fit(x_train, y_train, epochs=EPOCHS)` 訓練 10 個 epoch。
5. 用 `model.evaluate(x_test, y_test, verbose=2)` 在測試集上評估。
6. 有給第二個參數時，用 `model.save(filename)` 存檔。

這個流程和講課的 `handwriting.py` 幾乎相同，規格的提示也說講課原始碼會有幫助。

### 解題思路

**`load_data` 是把目錄走一遍。** 類別編號就是子目錄的名稱，所以外層依編號從 0 走到 `NUM_CATEGORIES − 1`，內層走那個子目錄裡的每個檔案。每個檔案用規格指定的 OpenCV（`cv2`）讀成像素陣列，縮成指定的寬高，放進影像的 list；同時把這個類別的編號放進標籤的 list，兩個 list 的順序要對得上。規格要求路徑不能寫死分隔字元，要用 `os.path.join` 這類做法組出來。回傳的是兩個 list，轉成 numpy 陣列與 one-hot 是 `main` 的事。

**`get_model` 是把講課的 CNN 結構搬過來，再自己調。** 骨架就是[「Pooling 與卷積神經網路的結構」](#pooling-與卷積神經網路的結構)那一節的四步（[錄影 1:08:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4098s)）：卷積、pooling、攤平、接一般的網路。講者在 [`handwriting.py`](#handwritingpy用-cnn-辨識手寫數字) 把它寫成 Keras 的層（[錄影 1:14:28](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4468s)），和這個專案差在三個地方：

- 輸入從 28×28×1 的黑白圖變成 `IMG_WIDTH` × `IMG_HEIGHT` × 3 的彩色圖。
- 輸出從 10 類變成 `NUM_CATEGORIES` 類，最後一層一樣要輸出機率分布（講課用的 softmax，[1:19:08](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4748s)）。
- 像素值的縮放。`handwriting.py` 在建模型之前先把像素值除以 255（[1:15:33](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4533s)），這個專案的 `main` 沒有做這件事，而 `main` 又不能改，所以要自己處理：可以在 `load_data` 裡做，也可以放進模型當第一層。放進模型的好處是存下來的模型自帶縮放，之後拿原始影像來預測不會漏掉這一步；這個比較是本文補的。

中間要放什麼，規格列了可以試的方向：卷積與 pooling 做幾輪、filter 的數量與大小、pool 的大小、隱藏層的層數與大小、要不要 dropout。講課對應的說法是卷積與 pooling 可以做不只一輪，前面的學低階特徵、後面的學高階特徵（[1:11:46](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=4306s)），dropout 用來減少 overfitting（[「隱藏層、backpropagation 與 dropout」](#隱藏層backpropagation-與-dropout)，[37:18](https://www.youtube.com/watch?v=J1QD9hLDEDY&t=2238s)）。建議從講課那個一輪卷積的結構開始，一次只改一樣，把每次的測試 accuracy 記下來，這份紀錄就是 `README.md` 要寫的內容。

最後是 `compile`。`main` 已經把標籤轉成 one-hot，loss 要選吃 one-hot 標籤的那一種；評估指標用 accuracy。

### 虛擬碼

```text
function Load-Data(data_dir):
    images = 空的 list
    labels = 空的 list
    for 每個類別編號 c，從 0 到 NUM_CATEGORIES − 1:
        for data_dir 底下名稱為 c 的目錄裡的每個影像檔:
            把檔案讀成像素陣列
            把陣列縮成寬 IMG_WIDTH、高 IMG_HEIGHT
            陣列加進 images，c 加進 labels
    return images, labels

function Get-Model():
    model = 依序接起來的層:
        輸入：IMG_WIDTH × IMG_HEIGHT × 3
        （像素值若還是 0–255，先縮放到 0–1）
        一輪或多輪：卷積，接著 pooling
        攤平
        一層或多層隱藏層，視需要加 dropout
        輸出：NUM_CATEGORIES 個 unit，轉成機率分布
    設定最佳化方法、配合 one-hot 標籤的 loss、以 accuracy 為指標
    return model
```

### 容易出錯的地方

下面有錯誤訊息或數字的幾條，都是本文用摺疊區塊那份實作（原樣，或改壞一處）接上官方 `main`，在 Python 3.11、TensorFlow 2.21（CPU）上執行時實際看到的，其他版本的訊息文字可能不同；最後幾條是規格的規則提醒。

- **像素值沒有縮放，訓練有時完全學不起來。** 現象是十個 epoch 的訓練 accuracy 都停在 0.055 上下，測試 accuracy 也是 0.055 左右。這個數字等於全部猜同一類：最大的一類有 1,500 張，占 26,640 張的 5.6%。麻煩在它不是每次都發生，同一份程式有時跑得出 0.97，所以很容易誤以為是運氣或架構的問題。實跑的次數與數字見下一節的表。
- **loss 和標籤格式對不上。** `main` 已經用 `to_categorical` 把標籤轉成 one-hot。如果 loss 選了吃整數標籤的 `sparse_categorical_crossentropy`，`model.fit` 一開始就丟 `ValueError`，訊息是「Argument `output` must have rank (ndim) `target.ndim - 1`. Received: target.shape=(None, 43), output.shape=(None, 43)」。看到這個訊息，問題在 loss，不在層的形狀。
- **輸出層的 unit 數不是 `NUM_CATEGORIES`。** `model.fit` 丟 `ValueError`：「Arguments `target` and `output` must have the same shape」，後面列出兩個形狀，例如少一個 unit 時是 `target.shape=(None, 43), output.shape=(None, 42)`。
- **用小資料集 `gtsrb-small` 卻沒把 `NUM_CATEGORIES` 改成 3。** 官方的 `gtsrb-small` 只有 `0`、`1`、`2` 三個子目錄。照上面虛擬碼依編號從 0 走到 `NUM_CATEGORIES − 1` 的寫法，`NUM_CATEGORIES` 還是 43 時，`load_data` 走到編號 3 就丟 `FileNotFoundError`，訊息指向 `gtsrb-small/3` 這個不存在的目錄，程式到不了訓練那一步。改成 3 之後可以正常跑完。這份 zip 解開後，`gtsrb-small` 目錄裡除了三個子目錄還有一個 `.DS_Store` 檔；依編號走的寫法不會碰到它。
- **影像沒有縮成同一個大小。** 資料集裡的原圖大小不一。`main` 會對 `images` 呼叫 `np.array`，大小不一時丟 `ValueError`，訊息裡有「inhomogeneous shape」。規格的提示是印出 `img.shape` 檢查，應該是 `(30, 30, 3)`。
- **照別的資料集的習慣去找 `train/`、`test/` 目錄。** 這份資料集只有 `0` 到 `42` 四十三個子目錄，切分是 `main` 做的。`gtsrb` 目錄也要放在 `traffic` 目錄裡，執行時的第一個參數才是 `gtsrb`。
- **為了縮放、切分或多印東西去改 `main`。** 規格不允許改這兩個函式以外的部分。要做的事都放進 `load_data`、`get_model` 或自己另外加的函式。
- **訓練時印出的 accuracy 比測試集低，以為寫錯了。** 用了 dropout 的模型常見這個現象。摺疊區塊那份實作最後一個 epoch 印出約 0.90 到 0.95，測試集是 0.98 以上。原因有兩個，都是本文補的：訓練時 dropout 會拿掉一部分 unit，評估時不會；每個 epoch 印出的數字是邊訓練邊累計的平均，前面的 batch 用的是比較差的權重。
- **存檔時的警告。** 帶第二個參數存成 `model.h5` 可以成功，TensorFlow 2.21 會印一行 HDF5 是舊格式的警告，不影響結果，也不要為了它去改 `main`。
- **忘了 `README.md`。** 它是規格要求繳交的一部分，至少一兩段。

### 怎麼檢查自己寫的對不對

先把環境與資料準備好：

```bash
wget https://cdn.cs50.net/ai/2023/x/projects/5/traffic.zip
unzip traffic.zip && cd traffic

# 資料集另外下載，解開後 gtsrb/ 要在 traffic/ 裡面
wget https://cdn.cs50.net/ai/2023/x/projects/5/gtsrb.zip
unzip gtsrb.zip

pip3 install -r requirements.txt  # opencv-python、scikit-learn、tensorflow

# 訓練並評估；加第二個參數會把模型存檔
python traffic.py gtsrb
python traffic.py gtsrb model.h5
```

**檢查 `load_data`**（不必訓練，在 Python 裡直接呼叫它）：

- 兩個 list 一樣長。用完整資料集時是 26,640。
- 每張影像的 `shape` 都是 `(30, 30, 3)`。
- 標籤是 0 到 42 的整數，43 個值都出現過；出現次數最少的是 150、最多的是 1,500。

**檢查 `get_model`**（一樣不必訓練）：呼叫後印出 `model.input_shape`，應是 `(None, 30, 30, 3)`；印出 `model.output_shape`，應是 `(None, 43)`。`model.summary()` 的表只列每一層的輸出形狀，沒有輸入形狀那一欄，它最後一列應該也是 `(None, 43)`。

**檢查整個流程**：執行 `python traffic.py gtsrb`。

- 每個 epoch 的進度列應是 500 步，最後評估是 333 步。26,640 張的 60% 是 15,984 張、40% 是 10,656 張，一批 32 張，分別是 500 批與 333 批。規格頁的範例輸出也是 `500/500` 與 `333/333`。
- 規格頁的範例輸出，十個 epoch 的訓練 accuracy 從 0.1545 升到 0.9256，測試是 0.9535。這是官方示範的一次執行，不是門檻；規格沒有訂 accuracy 要多少。
- 本站實跑的數字如下表，用的是摺疊區塊那份實作，以及把其中像素縮放那一行拿掉的版本；官方 `main` 未改動、完整資料集、TensorFlow 2.21（CPU），每個 epoch 約 2 到 3 秒。作者與獨立審稿者的結果分開列。

| 設定 | 誰跑的 | 次數 | 測試集 accuracy |
|---|---|---|---|
| 像素縮放到 0–1 | 作者（Python 3.11） | 6 | 0.9809、0.9821、0.9842、0.9850、0.9852、0.9886 |
| 像素縮放到 0–1 | 審稿者（Python 3.11 五次、3.12 一次） | 6 | 0.9808、0.9850、0.9853、0.9855、0.9897；Python 3.12 那次 0.9873 |
| 沒有縮放（像素 0–255） | 作者（Python 3.11） | 7 | 0.9746、0.9552、0.9310、0.5697、0.0565、0.0544、0.0543 |
| 沒有縮放（像素 0–255） | 審稿者（Python 3.11） | 6 | 0.9745、0.9698、0.9683、0.8453、0.0569、0.0566 |

有縮放的 12 次全部落在 0.981 到 0.990。沒有縮放的 13 次裡，有 5 次（作者 3 次、審稿者 2 次）沒學起來，測試 accuracy 約 0.055；另有 2 次只到 0.57 與 0.85；其餘 6 次在 0.93 到 0.975 之間，沒有一次超過有縮放的最低分。像素值留在 0 到 255 時，送進網路的數字比縮放後大 255 倍，訓練容易一開始就走壞；這個解釋是本文補的。`train_test_split` 每次切法不同、權重初始值也是隨機的，你的架構也和這份不同，數字不會一樣；要看的是有沒有卡在 0.055，以及同一份程式多跑幾次是不是穩定。

**官方的檢查**：

```bash
check50 ai50/projects/2024/x/traffic
style50 traffic.py
```

本文沒有跑 `check50`，它實際檢查哪些項目沒有查證。只有 3 種號誌的小資料集在 `https://cdn.cs50.net/ai/2023/x/projects/5/gtsrb-small.zip`（840 張），用它的時候要把 `NUM_CATEGORIES` 暫時改成 3；本文用摺疊區塊那份實作這樣跑了一次，每個 epoch 16 步、評估 11 步，測試 accuracy 0.9970。測試資料只有 336 張，一張就是 0.3 個百分點，數字每次會差一點：審稿者另外跑的三次是 0.9970、0.9970、0.9821。

### 完整參考實作

<details>
<summary>完整參考實作（先自己寫完並繳交，再打開）</summary>

> ⚠️ 如果你正在修這門課、或打算申請 CS50 的證書：課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)規定，繳交自己的作業之前不能看別人的解答。請先完成並繳交，再用這一段對照。這份實作只在本站列出的環境實跑過，沒有經過 check50。

這是一種寫法，不是官方解答。結構照講課的 `handwriting.py`，多做一輪卷積與 pooling。

```python
def load_data(data_dir):
    images = []
    labels = []
    for category in range(NUM_CATEGORIES):
        category_dir = os.path.join(data_dir, str(category))
        for filename in os.listdir(category_dir):
            image = cv2.imread(os.path.join(category_dir, filename))
            if image is None:
                continue
            images.append(cv2.resize(image, (IMG_WIDTH, IMG_HEIGHT)))
            labels.append(category)
    return images, labels


def get_model():
    model = tf.keras.models.Sequential([
        tf.keras.Input(shape=(IMG_WIDTH, IMG_HEIGHT, 3)),
        tf.keras.layers.Rescaling(1 / 255),

        tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),

        tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
        tf.keras.layers.MaxPooling2D(pool_size=(2, 2)),

        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.Dropout(0.5),

        tf.keras.layers.Dense(NUM_CATEGORIES, activation="softmax")
    ])
    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model
```

幾個要注意的地方：

- 路徑用 `os.path.join` 組，規格要求程式在不同作業系統上都能跑。
- `cv2.imread` 讀不了的檔案會回傳 `None`，直接跳過（官方資料集裡沒有這種檔案，這是防呆）。
- `load_data` 回傳的是兩個 list，`main` 會自己轉成 numpy 陣列。
- `Rescaling(1 / 255)` 把像素值從 0–255 換成 0–1，對應講課 `handwriting.py` 裡除以 255 的那一步。`tf.keras.Input` 與 `Rescaling` 講課沒有用到。

實跑結果就是上一節那張表「像素縮放到 0–1」的 12 次（作者 6 次、審稿者 6 次），測試 accuracy 0.981 到 0.990。

</details>

---

## 學習檢核清單

- [ ] 能手算一個 unit 的輸出：輸入乘權重、加 bias、過 step function，並說出 OR 與 AND 各用哪組數字
- [ ] 能說明梯度下降、stochastic、mini-batch 三者每次更新各看多少資料，以及取捨
- [ ] 能解釋為什麼單一 perceptron 學不了非線性可分的資料，隱藏層怎麼解決
- [ ] 能用自己的話說出 backpropagation 在做什麼，以及 dropout 為什麼能減少 overfitting
- [ ] 能用 Keras `Sequential` 寫出講課的兩個模型，說出每一層的作用
- [ ] 能手算 3×3 kernel 的卷積與 2×2 的 max-pooling，並算出各層輸出的形狀
- [ ] 能分辨 one-to-one、one-to-many、many-to-one、many-to-many 各對應什麼任務
- [ ] Traffic 專案：`load_data` 回傳 26,640 筆、每張形狀 `(30, 30, 3)`；模型最後一層輸出 `(None, 43)`；多跑幾次測試 accuracy 都沒有卡在 0.055；`README.md` 寫完；`check50` 全綠

## 課程影片來源

官方 CS50 YouTube 播放清單（CS50's Introduction to Artificial Intelligence with Python，8 支）已於 2026-10-10 即時核對，第 5 週講課錄影在清單中。

原始影片：[Neural Networks - Lecture 5 - CS50's Introduction to Artificial Intelligence with Python 2020](https://www.youtube.com/watch?v=J1QD9hLDEDY)

課程與錄影入口：

- [CS50 AI Week 5 — official video, slides and notes](https://cs50.harvard.edu/ai/weeks/5/)
- [CS50's Introduction to AI with Python — official YouTube playlist (8 videos)](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-13）：用 yt-dlp 取得帶時間碼的英文字幕（人工字幕），讀完全片 1:41:19 後重寫「講課導讀」，各節起點與文中引用的數字（OR 與 AND 的權重與 bias、四類天氣的機率、Playground 各次試驗的 unit 數、兩支程式的 accuracy、卷積與 pooling 例子的數值）都取自字幕；沒有看投影片與畫面，網路圖、資料點分布與 Playground 的畫面沒有重建。字幕在 1:02:03 寫成「subtracted 28 times」，依前後算式應是「減掉八次 20」，本文依算式寫。講者在 1:16:22 把 filter 數說成 13 後隨即更正為 32，在 51:24 把「8 個隱藏層」更正為「隱藏層的 8 個 unit」，本文依更正後的說法。兩段 Keras 程式碼取自課程網站的講課原始碼 `src5.zip`，其中 `adam`、`binary_crossentropy`、`categorical_crossentropy` 講者沒有唸出來，文中已註明。字幕全程未提到本週專案 Traffic，專案說明來自課程官網而非影片。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方 CS50 YouTube 播放清單即時核對，本週講課錄影存在，狀態改為已附影片。
- 2026-10-10：依字幕核對影片內容。移除影片中找不到的主題與專案介紹，補上 RNN 段，時間碼改為約略值。
- 2026-10-13：播放器從文末來源區移到「課程影片與時間軸」，開頭補上片長。
- 2026-10-13：「核心概念速覽」依帶時間碼的字幕重寫成十節的「講課導讀」，每節附時間連結與一題自我檢查；時間軸從約略分鐘數改為實際起點，片長更正為 1:41:19。原速覽裡講課沒有講的內容已移除：鏈式法則與誤差項 δ 的公式、各 activation function 的導數表（含 Leaky ReLU、Tanh）、MSE 與 cross-entropy 的損失函數對照表、`EarlyStopping` 與 `validation_split` 的範例、`Conv2D` 的 `strides` 與 `padding` 參數說明。
- 2026-10-13：專案 Traffic 一節依官方 `traffic.zip` 與規格頁重寫。原文把 `load_data` 寫成官方已提供，實際上 `load_data` 與 `get_model` 都要自己寫；資料集目錄沒有 `train/`、`test/` 之分；原參考實作改寫了規格要求不能動的 `main`，而且用 `sparse_categorical_crossentropy`，和官方 `main` 的 one-hot 標籤不合。改成只實作兩個函式的版本，並補上實跑結果。原文「check50 會載入 `traffic_model.h5` 在隱藏測試集評分」在規格頁找不到依據，已刪除；補上規格要求的 `README.md`。
- 2026-10-13：依獨立審稿修正。專案節的實跑結果重寫：有無 `Rescaling` 各自補跑後，連同審稿者的結果分開列表，拿掉 `Rescaling` 的 13 次有 5 次沒學起來，原本「差距不足以說明哪一種比較好」的說法撤回；補上縮放也可以放在 `load_data`、訓練 accuracy 較低的第二個原因、存檔時的警告，`README.md` 改為「至少一兩段」。導讀部分：backpropagation 第一次出現加註「反向傳播」，max-pooling 改為「最常見的一種」，兩處看不到的畫面動作改寫，卷積與 pooling 的講課例子註明原始數字在官方筆記的圖上，AND 的 bias 範圍與兩條直線那題的答案改寫，sales 改譯「銷售額」。GTSRB 的參考連結換成資料集作者的 ERDA 封存頁，原網站網域已解析不到。用語依系列統一：Python 的 function 寫「函式」，「OCW 官網」改「課程官網」，「播放列表」改「播放清單」。
- 2026-10-13：專案節改成任務、官方已提供的程式、解題思路、虛擬碼、容易出錯的地方、檢查方式在前，完整參考實作摺疊在最後並加警語，連到課程的[學術誠信政策](https://cs50.harvard.edu/ai/honesty/)。參考實作的程式碼沒有變動；實跑結果表移到「怎麼檢查自己寫的對不對」，「資料集結構」併入任務，「執行與驗證」的指令併入檢查方式。
- 2026-10-13：依專案節複審修正。兩條錯誤訊息的形狀改成照官方 `main` 實跑看到的 `(None, 43)`（原本的 `(32, 43)` 來自樣本數剛好是 32 倍數的小測試）；`gtsrb-small` 沒改 `NUM_CATEGORIES` 的後果改成用官方小資料集實跑的結果（`load_data` 丟 `FileNotFoundError`），拿掉原本不成立的推論；檢查 `get_model` 改看 `model.input_shape` 與 `model.output_shape`；tldr 與 description 改成和專案節現況相符。
- 2026-10-14：依專案節第二次複審補三處：`gtsrb-small` 的測試 accuracy 註明測試資料只有 336 張、附審稿者三次的數字；「容易出錯的地方」開場句改成只涵蓋有錯誤訊息或數字的幾條；註明官方 `gtsrb-small.zip` 裡有一個 `.DS_Store` 檔。

## 參考資料

- [Week 5 Neural Networks 講課頁](https://cs50.harvard.edu/ai/weeks/5/) — 影片、投影片、逐字稿、Quiz
- [Neural Networks - Lecture 5（YouTube）](https://www.youtube.com/watch?v=J1QD9hLDEDY) — 「講課導讀」的底本，內容、數字與時間連結取自它的英文字幕
- [Week 5 Notes (2020 版)](https://cs50.harvard.edu/ai/2020/notes/5/) — 官方筆記，可對照投影片上的圖
- [講課原始碼 src5.zip](https://cdn.cs50.net/ai/2020/spring/lectures/5/src5.zip) — `banknotes.py`、`handwriting.py`、`recognition.py`、`filter.py`
- [Traffic 專案規格](https://cs50.harvard.edu/ai/projects/5/traffic/) — Distribution `2023/x`、check50 slug `ai50/projects/2024/x/traffic`
- [TensorFlow/Keras 官方文件](https://www.tensorflow.org/api_docs/python/tf/keras)
- [GTSRB 公開資料封存](https://sid.erda.dk/public/archives/daaeac0d7ce1152aea9b61d9f1e19370/published-archive.html) — 資料集作者 Stallkamp 等人放在 ERDA 的封存頁，有資料集說明與原始檔。原本的 INI Benchmark 網站 `benchmark.ini.rub.de`（規格頁連的也是它）在 2026-10-13 查詢時網域解析不到
- [CS50 AI YouTube 播放清單](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [check50 文件](https://cs50.readthedocs.io/projects/check50/en/latest/index.html)
- 站內：[Harvard CS50 AI 總覽](/posts/ai/2026-08-26-harvard-cs50-ai-guide) — 系列入口與版本說明
- 站內：[世界名校 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map) — A3 分級定義
