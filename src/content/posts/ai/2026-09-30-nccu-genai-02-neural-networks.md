---
title: "政大蔡炎龍 生成式AI L02：神經網路的概念"
date: 2026-09-30
category: ai
type: guide
tags: [nccu-generative-ai, ai-course, neural-networks, deep-learning, keras, homework]
lang: zh-TW
series:
  name: "政大蔡炎龍 生成式AI 導讀"
  order: 2
tldr: "第二講把上一講的「呆萌型 AI 機器人」拆開：輸入輸出都要變成數字（張量），分類問題用 one-hot 與 softmax 把分數變成機率，神經網路由神經元一層層接起來，訓練就是用梯度下降把 loss 壓小。最後用 Keras 在 MNIST 上打造第一個全連結神經網路，再接上 Gradio 畫板。第二週作業要你自己設計 DNN，唯一的硬規定是不能是三層；長庚衛星班要求截圖驗證正確率最高的那組參數，也鼓勵保留失敗的嘗試。"
description: "政大蔡炎龍《生成式 AI》1132 學期第 2 講導讀：張量與特徵、八哥辨識與 one-hot、監督式學習、softmax 與條件機率、神經元與激發函數、全連結網路的兩個設計決定、萬能近似定理、loss function 與梯度下降、MNIST 的 Keras 範例 Demo01 與 Gradio 介面，以及第二週「不能三層」作業的評分標準。"
draft: false
glossary:
  - term: "softmax"
    definition: "把任意一組實數先取指數變成正數，再除以總和，得到一組加起來等於 1、大小順序不變的數字。常用在分類網路的輸出層。"
    context: "投影片的例子把 1.9、1.1、0.2 轉成 0.61、0.28、0.11，讀成三種八哥的機率。"
  - term: "one-hot encoding"
    aliases: ["one-hot"]
    definition: "把第 k 類寫成一個只有第 k 個位置是 1、其餘都是 0 的向量，讓類別答案變成神經網路能比較的數字。"
    context: "MNIST 的 10 個數字類別在 Demo01 裡用 to_categorical 轉成 10 維的 one-hot 向量。"
  - term: "萬能近似定理"
    aliases: ["Universal Approximation Theorem"]
    definition: "數學定理：只要神經元夠多，一個隱藏層的神經網路就能以任意精度逼近一大類函數。它保證「學得起來」，但沒說要多少神經元或怎麼訓練。"
    context: "GenAI02 第 52 頁用它說明神經網路為什麼是「近乎全能的黑暗函數學習法」。"
---

> 🌏 [English version](/posts/ai/2026-09-30-nccu-genai-02-neural-networks-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

**系列位置**：上一篇 [L01 為什麼要研究生成式 AI](/posts/ai/2026-09-30-nccu-genai-01-why-generative-ai)｜下一篇 [L03 紅極一時的 GAN](/posts/ai/2026-09-30-nccu-genai-03-gan)｜[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

> **版本說明**：本文依據政大 1132 學期（2025-02-25）第 2 講的[直播錄影](https://www.youtube.com/watch?v=s1QqujRMEUk)（3 小時 4 分）與 [GenAI02 投影片](https://yenlung.me/1132GenAI)（122 頁）。範例 notebook 是 [AI-Demo](https://github.com/yenlung/AI-Demo) 的 `【Demo01】設計你的神經網路.ipynb`，引用的是 **repo 目前版本**（最近一次 commit 2026-03-17），可能跟 1132 當時不同。作業題目與評分標準出自[長庚衛星班頁面](https://yangchihyuan.github.io/courses/GenerativeAI2025)。事實皆於 2026-09-30 核對。

上一講說，AI 模型是一台「呆萌型 AI 機器人」：只要知道輸入長什麼樣子、輸出長什麼樣子。這一講回答接下來的問題：這台機器裡面是什麼，它又是怎麼「學」的？

投影片分成五段：打造呆萌型 AI 機器人、神經網路、我們和真實的距離、梯度下降、打造第一個神經網路。前四段是觀念，最後一段是實作，作業就從實作那段改。

## 課程影片來源

影片來源已對照官方課程頁（查核日期：2026-10-10），講次與影片連結一致；但嵌入播放未能逐支確認，若頁內無法播放，請改用下方原始影片連結。不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=s1QqujRMEUk
title: 【生成式 AI】02. 神經網路的概念
```

原始影片：[【生成式 AI】02. 神經網路的概念](https://www.youtube.com/watch?v=s1QqujRMEUk)

課程與錄影入口：

- [官方課程與錄影入口](https://yangchihyuan.github.io/courses/GenerativeAI2025)

查核日期：2026-10-10。

## 第一段：輸入和輸出都要是數字

呆萌型機器人只吃數字。投影片用三個例子說明「數字」可以長成什麼樣子：

| 資料 | 形狀 | 投影片的說法 |
|---|---|---|
| 鳶尾花的花萼長寬、花瓣長寬 `[5.1, 3.5, 1.4, 0.2]` | 向量 | 4 個特徵（features） |
| 某股票過去 20 天的開盤、最高、收盤等資料 | 矩陣 | 每天一列 |
| 彩色照片 | 3D 矩陣（R、G、B 三層） | 「然後我們就沒詞了……」 |

更精確的說法是**張量**（tensor）：純量是 0 階、向量是 1 階、矩陣是 2 階。聲音、文字也都能轉成數據，這是後面講 LLM 與生圖的前提。

### 八哥辨識：分類問題長這樣

回到上一講的賞鳥例子。台灣常見的三種八哥是八哥、白尾八哥、家八哥，所以輸出就是三個數字，分別代表每一種的「分數」。

正確答案也要變成數字。常見做法是 **one-hot encoding**：第一種寫成 `[1, 0, 0]`，第二種 `[0, 1, 0]`，第三種 `[0, 0, 1]`。

接著要準備很多「有正確答案的數據」，分成兩份：

- **訓練資料**：拿來調整機器
- **測試資料**：不參與訓練，用來確認電腦沒有在「背答案」，也就是沒有**過度擬合**（overfitting）

用有正確答案的資料訓練，叫**監督式學習**；學習資料不是我們準備好答案的，叫非監督式學習。

### softmax：把分數變成機率

訓練好之後，模型對一張照片給出 `1.9, 1.1, 0.2` 三個分數，意思是它覺得第一種最有可能。為了「看來更有學問」（投影片原話），我們想讓三個數字按比例分配、加起來等於 1，而且大的還是大、小的還是小。

問題是分數可能是負的，不能直接除以總和。**softmax** 的做法是先取指數，讓每個數字都變成正數，再按比例分配。上面那組分數會變成 `0.61, 0.28, 0.11`：61% 可能是八哥，28% 可能是白尾八哥，只有 11% 是家八哥。

<details>
<summary>softmax 的公式與條件機率寫法</summary>

三個分數 $a, b, c$，先做指數轉換，令 $S = e^a + e^b + e^c$，則

$$
p_1 = \frac{e^a}{S},\quad p_2 = \frac{e^b}{S},\quad p_3 = \frac{e^c}{S}
$$

因為結果加起來等於 1，常有人說神經網路學的是一個**機率分佈**。投影片更進一步寫成條件機率：給定照片 $x$，答案是第 $i$ 類的機率

$$
P_\theta(y = y_i \mid x) = p_i
$$

投影片也吐槽：這個說法「嚇人的成分居多」。

</details>

這一段最後有三個提醒：深度學習最重要的是「問個好問題」，也就是決定輸入和輸出；整個判斷交給電腦做，所以需要大量資料，投影片上的電腦說一個類別大概要看 1,000 張照片；而電腦並不知道那是「家八哥」，它只知道那是第 3 類數據。

## 第二段：神經網路是怎麼組起來的

深度學習的核心是神經網路。打造呆萌型機器人，基本上就是建一層層的**隱藏層**，每一層放上若干個**神經元**。放法差不多有「3+1」種：

| 架構 | 投影片的描述 |
|---|---|
| DNN（全連結層，Dense） | 標準、全面考慮的基本型 |
| CNN（卷積層，Conv） | 圖形辨識天王 |
| RNN（LSTM、GRU） | 有記憶的神經網路 |
| Transformers | 那個「+1」 |

不管哪一種，基本運算單元都是神經元，差別只在連結方式。

### 一個神經元在做什麼

每個神經元接受若干個輸入，送出一個輸出。它做三件事：

1. 算總刺激：$w_1x_1 + w_2x_2 + w_3x_3$，$w$ 是**權重**
2. 加上**偏值**（bias）$b$，做一個基準調整
3. 經過**激發函數**（activation function）$\varphi$ 轉換再送出

第三步是關鍵。前兩步都是線性計算，就算經過再多神經元，結果還是線性的，所以一定要有一個非線性的轉換。權重與偏值都是學來的，合起來記成 $\theta$。

投影片介紹了三個有名的激發函數：**ReLU**（本世紀新寵）、**Sigmoid**（感覺應該很接近人類神經元的動作）、**Gaussian**（舊時代的懷念，已很少使用）。

### 設計全連結網路只要決定兩件事

以 DNN 為例，打造一台函數學習機只需要決定兩組數字：

1. 幾層隱藏層
2. 每層幾個神經元

層與層之間的神經元完全連結。這兩個數字一定，所有權重和偏值 $\theta$ 的位置就定了；給定 $\theta$ 的值，任何輸入都會得到一個輸出。

每一層都把輸入轉成另一個張量，上一層的輸出就是下一層的輸入。錄影把這稱為 AI 的第二級應用：**每一層的輸出，都可以當成電腦對輸入的理解**。這個觀念在後面講 VAE 與 latent 時會回來。

### 為什麼神經網路這麼強

投影片把神經網路叫做「近乎全能的黑暗函數學習法」，理由是**萬能近似定理**（Universal Approximation Theorem）：有數學定理證明，一個隱藏層的神經網路就能學會你要學的函數。

那為什麼上個世紀沒成功？投影片提到，神經網路曾經有一陣子冷到研究計畫只要寫要研究神經網路，還沒送出就可以確定不會通過。Yann LeCun 的解釋是當時缺三個要件：大量的數據、電腦計算能力、複雜的軟體。現在三者都有了，寫一個深度學習程式比上個世紀容易太多。

## 第三、四段：訓練就是把 loss 壓小

架好的神經網路會先把參數「初始化」。這時它能動，但不準：把一張八哥照片丟進去，它可能很有信心地說 72% 是家八哥。

要讓它變準，先要有辦法量「差多少」。**loss function** 計算在訓練資料上，機器的答案和正確答案差距多大；loss 越小越好。訓練的目標，就是在無限多個可能的 $\theta$ 裡，找出讓 loss 最小的那一組 $\theta^*$。

找的方法叫**梯度下降法**（gradient descent）。因為神經網路的特性，它在這裡也叫**反向傳播法**（backpropagation）。

投影片的直覺是先假裝只有一個參數 $w$：

- 在目前的位置畫切線。切線斜率是負的，就往右走；是正的，就往左走。也就是往斜率的反方向走。
- 一次走太多會跑過頭，所以乘上一個小小的數，叫**學習率**（learning rate）$\eta$。
- 參數不只一個時，每次只看一個參數、其他當常數，這就是**偏微分**。把所有偏微分排成一個向量，就是**梯度** $\nabla L$。

<details>
<summary>loss function 與梯度下降的公式</summary>

投影片列的常見 loss function（均方誤差），$k$ 筆訓練資料：

$$
L(\theta) = \frac{1}{2k}\sum_{i=1}^{k} \lVert y_i - f_\theta(x_i) \rVert^2
$$

單一參數的更新：

$$
w \leftarrow w - \eta \frac{dL}{dw}
$$

多個參數時，把每個參數的偏微分排成梯度，一次更新：

$$
\begin{bmatrix} w_1 \\ w_2 \\ b_1 \end{bmatrix} \leftarrow \begin{bmatrix} w_1 \\ w_2 \\ b_1 \end{bmatrix} - \eta \nabla L
$$

投影片的重點是最後一句：不管函數學習機怎麼架、loss function 怎麼選，都可以用梯度下降訓練。

</details>

投影片最後留了一個進階討論：很多人說 AI 只是 curve fitting、是在已學過的點之間做內插；但 Balestriero、Pesenti 與 LeCun 2021 年的論文 [Learning in High Dimension Always Amounts to Extrapolation](https://arxiv.org/abs/2110.09485) 指出，在高維度下其實都是外插。

## 第五段：打造第一個神經網路

實作用的是 [MNIST](https://keras.io/api/datasets/mnist/) 手寫數字資料集與 TensorFlow 的 Keras。先把問題化成函數：

- 輸入是一張 28×28 的圖，「拉平」成 784 維的向量
- 輸出是 10 個類別，做成 10 維的 one-hot 向量

投影片第 118 頁的範例是兩個隱藏層、各 100 個神經元、都用 ReLU，輸出 10 維用 softmax。

### Demo01 notebook（repo 目前版本）

課程用的 notebook 是 [`【Demo01】設計你的神經網路.ipynb`](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo01%E3%80%91%E8%A8%AD%E8%A8%88%E4%BD%A0%E7%9A%84%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF.ipynb)（投影片的短網址是 yenlung.me/AI01）。目前版本的流程是：

1. 讀入套件，包括 `Sequential`、`Dense`、`SGD` 與 Gradio
2. 從 Keras 讀入 MNIST：訓練資料 6 萬筆、測試資料 1 萬筆
3. `reshape` 成 784 維並除以 255；答案用 `to_categorical` 轉成 one-hot
4. 建模型：**三個隱藏層、各 20 個神經元**、ReLU，輸出層 10 個神經元用 softmax
5. `compile`：loss 用 `mse`，optimizer 用 `SGD(learning_rate=0.087)`
6. `model.summary()` 檢查參數數目，`fit` 訓練 10 個 epoch
7. 在測試資料上 `evaluate`，用 `interact_manual` 逐張看預測
8. 用 Gradio 的 `Sketchpad` 做一個畫板，畫一個數字，顯示前 3 名的預測

注意第 4 步跟投影片第 118 頁不一樣：notebook 是三個隱藏層，投影片是兩個。這正好是作業「不能三層」的由來：你改的起點是一個三層的範例。

notebook 在 compile 那格也留了修改建議：分類問題改用 `loss='categorical_crossentropy'` 其實更合理（「可以問問 AI 為什麼」），optimizer 可以試 `'adam'`。

## 第二週作業：打造自己的 DNN 手寫辨識

以下是長庚衛星班版本（截止 3/10 23:59）。作業說明有六點：

- 打造自己的 DNN（全連結）手寫辨識
- **神經網路不能是三層**（可以多、可以少，就是不能三層）
- 改成自己的樣子，不要一眼就看出來是老師的範例
- 過多的說明都拿掉，陳述的內容要修改
- 截圖上傳個人訓練過程中「驗證資料」正確率最高的參數與結果；可以補充其他不好的結果與參數之間的觀察
- 如果有用 Gradio，一定要截圖 Gradio 的結果

頁面特別鼓勵**保留嘗試過程**：參數 A 用 5 結果普通、改成 10 提升多少，這些都可以留在 Colab 裡或用 Markdown 記下來。理由是讓自己回看時知道試過什麼，也讓助教知道你走過這個過程。

評分標準：

| 分數 | 條件 |
|---|---|
| 0 | 程式連結無法順利開啟，且無截圖 |
| 1 | 程式開啟後只有匯入基本套件 |
| 2 | 程式連結無法順利開啟，但有部分截圖 |
| 3 | GPT 水準，或與本週主題無關 |
| 6 | 基本分：跟課堂範例十分近似，例如只改其中一些數字 |
| 8 | 看得出模型架構有大幅更改，但大致內容還是老師的範本 |
| 10 | 滿足上述作業說明 |

註記比第一週多了三條：用生成式 AI 幫忙的地方要特別說明，加上理解後的說明並附截圖（包括 prompt 與生成結果），否則視為抄襲 AI；認定抄襲者該次 0 分、總成績再扣 10 分，再犯再扣；內容不多時不要上傳 PDF。

一個實作提醒：作業要的是「驗證資料」的正確率，但 notebook 目前的 `fit` 沒有切驗證集。那一格下面註解掉的 `validation_split=0.1` 版本就是為此準備的，打開它才畫得出訓練與驗證的正確率曲線。

## 自學檢查點

- 你能說出為什麼一定要有激發函數（沒有它，疊再多層都還是線性）
- 你能手算一次 softmax：`[2, 1, 0]` 大約會變成多少
- 你能算出 Demo01 第一個隱藏層有幾個參數（784 × 20 個權重加 20 個偏值）
- 你能解釋學習率太大會怎樣（跑過頭）
- 你的作業網路不是三層，而且留下了至少兩組參數的比較

今晚可以做的一件事：把 Demo01 改成兩個隱藏層、打開 `validation_split=0.1`，再把 loss 換成 `categorical_crossentropy`，比較驗證正確率變化，截圖留存。

## Fall 2026 的第二講

Fall 2026 課綱的第 2 週描述是：神經網路的核心概念（感知器、多層感知器）、激發函數與反向傳播，實作一個簡單的 MNIST 手寫數字分類。1151 的[第 2 講錄影](https://www.youtube.com/watch?v=RijejOES8K8)標題改成「呆萌型 AI 機器人」，分段跟 1132 大致相同，多了一段「五個 AI 思考題：幻覺、AI Agent 與領域專家」，並用股票漲跌預測當定義輸入輸出的例子。

## 延伸閱讀

- 神經網路、反向傳播與 CNN／RNN 的完整版本：[CMU 11-785 導讀](/posts/ai/2026-08-22-cmu-11785-course-overview)
- 課程歸屬與全學期作業表：[系列總覽](/posts/ai/2026-09-30-nccu-genai-course-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。官方課表的講次與影片連結一致，但嵌入播放未能逐支確認，狀態維持不變。

## 參考資料

- [【生成式 AI】02. 神經網路的概念](https://www.youtube.com/watch?v=s1QqujRMEUk) — 1132 第 2 講直播錄影與分段時間軸（2025-02-25）
- [1132 投影片資料夾（yenlung.me/1132GenAI）](https://yenlung.me/1132GenAI) — GenAI02 神經網路的概念，122 頁
- [【Demo01】設計你的神經網路.ipynb](https://github.com/yenlung/AI-Demo/blob/master/%E3%80%90Demo01%E3%80%91%E8%A8%AD%E8%A8%88%E4%BD%A0%E7%9A%84%E7%A5%9E%E7%B6%93%E7%B6%B2%E8%B7%AF.ipynb) — Keras MNIST 範例與 Gradio 畫板（repo 目前版本）
- [長庚衛星班課程頁](https://yangchihyuan.github.io/courses/GenerativeAI2025) — 第二週作業說明與評分標準
- [Balestriero, Pesenti & LeCun, Learning in High Dimension Always Amounts to Extrapolation (2021)](https://arxiv.org/abs/2110.09485) — 投影片進階討論引用的論文
- [Keras MNIST 資料集文件](https://keras.io/api/datasets/mnist/) — `mnist.load_data()` 的說明
- [Fall 2026 課綱 PDF](https://drive.google.com/file/d/1hhigEPT9SdhJgtIpevACzSJsSNA0mw6T/view) — 1151 第 2 週的描述
- [1151 第 2 講：呆萌型 AI 機器人](https://www.youtube.com/watch?v=RijejOES8K8) — Fall 2026 版本的分段時間軸
