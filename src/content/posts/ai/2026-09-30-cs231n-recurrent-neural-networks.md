---
title: "CS231N L7：循環神經網路與影像描述——RNN、LSTM 與 captioning"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, deep-learning, rnn]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 8
tldr: "RNN 用同一組權重，在每個時間步更新一個隱藏狀態，所以能處理任意長度的序列。CS231N L7 從手工造一個偵測連續 1 的 RNN 講起，接著是字元級語言模型、把 CNN 特徵接進 RNN 做影像描述，再用梯度流解釋為什麼 vanilla RNN 難訓練：梯度爆炸靠 gradient clipping，梯度消失靠改架構，也就是 LSTM。最後把 Mamba 這類 state space model 稱為「現代 RNN」。"
description: "Stanford CS231N（Spring 2026 課表）第 7 講導讀：序列問題的 one-to-many／many-to-one／many-to-many 分類、vanilla RNN 的遞迴公式與計算圖、BPTT 與截斷 BPTT、字元級語言模型、影像描述（image captioning）、VQA 與 Visual Dialog、vanilla RNN 的梯度爆炸與消失、LSTM 的四個閘門與 cell state 梯度流，以及 state space model。依據 2026 課表連結的 lecture_7.pdf、課表建議閱讀與 2025 年 L7 錄影。"
draft: false
glossary:
  - term: "BPTT"
    aliases: ["backpropagation through time", "時間反向傳播"]
    definition: "把 RNN 沿時間展開成一張計算圖，先前向跑完整個序列算 loss，再沿整個序列反向傳播算梯度。截斷版本只在一段固定長度內反向傳播，但隱藏狀態會一直往前帶。"
    context: "CS231N L7 用它說明 RNN 怎麼訓練，以及為什麼長序列要截斷。"
  - term: "cell state"
    aliases: ["細胞狀態"]
    definition: "LSTM 除了隱藏狀態 h 之外另外維護的狀態 c。從 c_t 反向傳到 c_{t-1} 只經過和遺忘閘 f 的逐元素相乘，沒有矩陣乘法，梯度比較不容易消失。"
    context: "CS231N L7 把這條不中斷的梯度路徑比作 ResNet 的捷徑。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-recurrent-neural-networks-en)

> **來源年份**：投影片依據 Spring 2026 課表連結的 [lecture_7.pdf](https://cs231n.stanford.edu/slides/2026/lecture_7.pdf)；錄影依據 Spring 2025 的 [YouTube L7](https://www.youtube.com/watch?v=kG2lAPBF7zA)。兩者可能有差異，下面會標出。本文是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列第 8 篇，接在 [L6：訓練 CNN 與經典架構](/posts/ai/2026-09-30-cs231n-training-cnns-architectures)之後。

到 L6 為止，模型的輸入都是**固定大小**的：一張圖進去，一組分數出來。可是影片是一串影格，句子是一串字，影像描述要輸出一串長度不定的字。這一講要回答：**輸入或輸出是序列時，神經網路要怎麼改？**

[官方課表](https://cs231n.stanford.edu/schedule.html)列的主題是 RNN、LSTM、GRU、語言模型、影像描述與 sequence-to-sequence，建議閱讀有兩份：[Deep Learning 一書的 RNN 章節](http://www.deeplearningbook.org/contents/rnn.html)，以及 Christopher Olah 的 [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)。

用到的官方材料：

- 2026 課表連結的 lecture_7.pdf，共 119 頁（下文頁碼都指 PDF 頁碼；投影片頁尾自己的編號和 PDF 頁碼不一致）
- 課表的兩份建議閱讀
- Spring 2025 的 L7 錄影；2025 課表上這一講的講者是 Zane Durante

存取等級是 **A3**。2026 年課堂錄影只在 Canvas。

有兩件事要先說明：

1. 這份投影片頁尾印的日期是「April 21, 2025」，但第 2 頁的公告寫 A2 在「this Thursday (4/23)」發佈、專題 proposal 同一天截止，跟 2026 課表一致。本文只稱它為「2026 課表連結的投影片」，不推論內容改了多少。和 [2025 年的 lecture_7.pdf](https://cs231n.stanford.edu/slides/2025/lecture_7.pdf) 對照，主體章節幾乎一樣；2025 版開頭多了幾頁「上次的釐清」（Dropout 測試時怎麼縮放、正規化與初始化的關係），後面多了一頁 Visual Language Navigation。
2. **課表列了 GRU 和 sequence-to-sequence，但 2026 投影片的文字裡找不到這兩個主題**，2025 版投影片也沒有。本文不替這兩個主題補內容；要讀的話，課表建議的 Olah 文章裡有 GRU 的介紹。

## 開場：回顧 L6，然後轉向序列

第 3–10 頁先收尾上一講：訓練前饋網路的三個階段（一次性設定、訓練動態、評估），再放 ILSVRC 冠軍圖，以及一組模型複雜度比較（引用 Canziani et al. 2017）：VGG 參數與運算量最多；AlexNet 運算少但仍吃記憶體、準確率較低；ResNet 效率中等、準確率最高。

第 11 頁是這講的目錄：

- 循環神經網路
- 序列建模（到目前為止都假設輸入長度固定）
- Transformer 時代之前常用的簡單模型：RNN 與它的變體
- 和現代 state space model 的關係

## 序列問題的五種形狀

第 12–16 頁用一張經典圖把問題分類：

| 形狀 | 例子（投影片） |
|---|---|
| one to one | 一般的前饋網路 |
| one to many | 影像描述：一張圖 → 一串字 |
| many to one | 動作預測：一串影格 → 一個動作類別 |
| many to many | 影片描述：一串影格 → 一句描述 |
| many to many（逐步輸出） | 逐格影片分類 |

## RNN 的核心：一個被反覆更新的內部狀態

第 17–24 頁。RNN 的關鍵是有一個「內部狀態」，每讀進序列的一個元素就更新一次。每個時間步套用同一個遞迴公式：

```
h_t = f_W(h_{t-1}, x_t)      # 新狀態 = 函數(舊狀態, 這一步的輸入)
y_t = f_{W_hy}(h_t)          # 輸出由新狀態算出
```

投影片強調：**每個時間步用的是同一個函數、同一組參數。**

最簡單的形式稱為 vanilla RNN，也叫 Elman RNN（以 Jeffrey Elman 命名）。狀態就是一個隱藏向量 h：

```
h_t = tanh(W_hh h_{t-1} + W_xh x_t)
y_t = W_hy h_t
```

### 手工造一個 RNN

第 25–33 頁是一個很好的暖身。任務：輸入一串 0 與 1，連續出現兩個 1 時輸出 1。這是 many-to-many 的序列任務。

隱藏狀態要記住什麼？答案是「上一個輸入和這一個輸入」。投影片把激活函數都設成 ReLU 以求簡單，h_0 初始化為 (0, 0, 1)，手工填好權重，讓輸出等於 max(目前值 + 前一個值 − 1, 0)。結果「it just works」。

接著投影片問出真正的問題：**實務上要怎麼找到這些 W？** 答案是訓練，也就是下一節。

## 計算圖與 BPTT

第 34–50 頁把 RNN 沿時間展開成計算圖。每一步都重用同一個權重矩陣 W，所以反向傳播時，W 的梯度是各時間步梯度的總和。

- **many to many**：每一步都有輸出 y_t 和 loss L_t，總 loss 是加總。
- **many to one**：只在最後一步輸出。
- **one to many**：只在第一步有輸入，後面每一步的輸入是 0，或是前一步的輸出。

訓練方式叫 **backpropagation through time（BPTT）**：先前向跑完整個序列算 loss，再沿整個序列反向算梯度。序列很長時太貴，所以有**截斷 BPTT**：把序列切成一段一段做前向與反向，隱藏狀態一直往前帶，但只在較短的步數內反向傳播。

## 字元級語言模型

第 51–65 頁用一個更實際的例子。字彙只有 [h, e, l, o] 四個字元，訓練序列是「hello」。每一步輸入一個字元的 one-hot 向量，輸出下一個字元的分數，經 softmax 變成機率。

測試時一次**取樣**一個字元，再把它餵回模型當下一步的輸入。

投影片順帶解釋 embedding 層：one-hot 向量乘上權重矩陣，其實只是取出矩陣的某一欄。所以實務上常在輸入和隱藏層之間放一個獨立的 embedding 層。

然後是 Andrej Karpathy 2015 年部落格文章的經典例子：[min-char-rnn.py](https://gist.github.com/karpathy/d4dee566867f8291f086) 只有 112 行 Python。投影片展示取樣結果：一開始吐出亂碼，訓練越久越像樣，最後連 C 程式碼都生得出來。生成 C 程式碼那頁旁邊列了 OpenAI Codex、GitHub Copilot、Claude Code、Cursor，提醒這條路後來通往哪裡。

第 66–72 頁「尋找可解釋的 cell」：有些隱藏單元會專門追蹤引號、行長度、if 敘述、註解、程式碼縮排深度。

### RNN 的取捨

第 73 頁：

- **優點**：可以處理任意長度的輸入（沒有 context length）；第 t 步的計算理論上可以用到很多步以前的資訊；輸入變長時模型大小不變；每個時間步用同一組權重，處理方式對稱。
- **缺點**：遞迴計算很慢；實務上很難取用很多步以前的資訊。

## 影像描述：把 CNN 接到 RNN

第 74–87 頁是這講和電腦視覺最直接的連結。投影片列了四篇代表作（Mao et al.、Vinyals et al. 的 Show and Tell、Donahue et al. 的 LRCN、Chen and Zitnick），以及 Karpathy 與 Fei-Fei 的〈Deep Visual-Semantic Alignments for Generating Image Descriptions〉。

做法：

1. 拿一個 CNN（投影片畫的是 VGG 形狀的網路），**拿掉最後的 FC-1000 與 softmax**，用 FC-4096 那一層的輸出向量 v 代表整張圖。
2. RNN 的第一個輸入是特殊的 `<START>` token。
3. 修改遞迴公式，把圖片特徵加進去：

```
之前：h = tanh(W_xh x + W_hh h)
現在：h = tanh(W_xh x + W_hh h + W_ih v)
```

4. 每一步從輸出分布取樣一個字（投影片例子依序取到「straw」「hat」），把它餵回下一步。
5. 取樣到 `<END>` token 就結束。

投影片放了 neuraltalk2 產生的成功與失敗案例。失敗案例很有教育意義：模型把穿毛皮大衣的女子描述成「A woman is holding a cat in her hand」，把在湖邊倒立的人描述成「A woman standing on a beach holding a surfboard」。模型抓到了畫面裡常一起出現的東西，但沒有真的看懂場景。

接著兩頁延伸到其他視覺與語言任務：VQA（Agrawal et al. 2015；Zhu et al. 的 Visual 7W）與 Visual Dialog（Das et al., CVPR 2017）。

**怎麼做**：這一段正是 [A2](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn) Q5「Image Captioning with Vanilla RNNs」要實作的內容，官方題目頁寫明用 COCO 資料集、在 `RNN_Captioning_pytorch.ipynb` 完成。先把上面那條「現在」的公式在紙上畫成計算圖，再開 notebook。

## 為什麼 vanilla RNN 難訓練

第 91 頁先提多層 RNN：在深度方向疊好幾層，每一層都沿時間展開。然後第 93–104 頁進入這講的數學核心：梯度流。

從 h_t 反向傳到 h_{t-1}，要乘上 W_hh 的轉置。反向傳過很多個時間步，就是**反覆乘同一個矩陣**：

- 加上 tanh 的導數，因子幾乎總是小於 1，於是**梯度消失**。
- 就算假設沒有非線性：最大奇異值 > 1 時**梯度爆炸**，< 1 時梯度消失。

對策各不相同：

| 問題 | 對策 |
|---|---|
| 梯度爆炸 | **gradient clipping**：梯度的 norm 太大就把它縮小 |
| 梯度消失 | **改 RNN 架構** |

投影片引用 Bengio et al. 1994 與 Pascanu et al. 2013 兩篇經典分析。

## LSTM：多一條不中斷的梯度路徑

第 105–116 頁。LSTM（Hochreiter and Schmidhuber 1997）除了隱藏狀態 h，另外維護一個 **cell state** c，並用四個閘門控制：

| 閘門 | 激活 | 作用（投影片說法） |
|---|---|---|
| i：input gate | sigmoid | 要不要寫入 cell |
| f：forget gate | sigmoid | 要不要清除 cell |
| o：output gate | sigmoid | 要揭露多少 cell 的內容 |
| g：「gate gate」 | tanh | 要寫入多少 |

四個閘門由同一個矩陣 W 從 [h_{t-1}, x_t] 一次算出（W 的形狀是 4h × 2h）。

<details>
<summary>LSTM 的更新公式</summary>

```
c_t = f ⊙ c_{t-1} + i ⊙ g
h_t = o ⊙ tanh(c_t)
```

⊙ 是逐元素相乘。

</details>

關鍵在梯度流：**從 c_t 反向傳到 c_{t-1}，只經過和 f 的逐元素相乘，沒有乘上矩陣 W。** 整條 c 的路徑是「不中斷的梯度流」。投影片把這張圖和 ResNet 並排，寫著「Similar to ResNet!」。回想 [L6](/posts/ai/2026-09-30-cs231n-training-cnns-architectures)，ResNet 的殘差連接解的也是同一種最佳化問題。

LSTM 真的解決了梯度消失嗎？第 115 頁的回答很節制：

- LSTM 讓 RNN **比較容易**把資訊保存很多個時間步。例如 f = 1、i = 0 時，那個 cell 的資訊會被永久保留。相比之下，vanilla RNN 很難學出一個能保存資訊的遞迴權重矩陣。
- LSTM **不保證**沒有梯度消失或爆炸，但提供了一條讓模型更容易學到長距離依賴的路。

## 現代 RNN：state space model

第 117 頁把 RNN 接到現在。有些現代模型被稱為「state space model」，同樣有隱藏狀態，主要優點是 context 長度沒有上限，計算量隨序列長度線性增長。投影片列了 RWKV 的 scaling 圖、〈Simplified State Space Layers for Sequence Modeling〉與〈Mamba: Linear-Time Sequence Modeling with Selective State Spaces〉。

第 118 頁的總結：

- RNN 讓架構設計很有彈性。
- vanilla RNN 簡單，但效果不好。
- 更複雜的變體（例如 LSTM、Mamba）能選擇性地把資訊往前傳。
- RNN 的反向梯度可能爆炸或消失。爆炸用 gradient clipping 控制，通常需要 BPTT。

最後一頁預告下一講：Attention 與 Transformer。

## 這一篇可以確認與不能確認的

可以確認：2026 課表的主題與建議閱讀、2026 課表連結投影片的內容、A2 Q5 的題目說明、2025 年 L7 錄影的存在與講者（依 2025 課表）。

不能確認：課表列出的 GRU 與 sequence-to-sequence 在課堂上講了多少（兩個年份的投影片文字都沒有）、2026 年這一講實際由誰主講（2026 課表的講者欄被註解掉）、2026 課堂錄影內容（只在 Canvas）。

延伸閱讀：站上 [CS224N 的 RNN 與語言模型導讀](/posts/ai/2026-08-22-cs224n-rnn-language-models)從 NLP 角度講同一批模型；[CMU 11-785 的 RNN 第一講](/posts/ai/2026-08-22-cmu-11785-13-rnn-one)與 [seq2seq 講次](/posts/ai/2026-08-22-cmu-11785-15-seq2seq-ctc)可以補上本講投影片沒有展開的 sequence-to-sequence。

系列導覽：上一篇 [L6：訓練 CNN 與經典架構](/posts/ai/2026-09-30-cs231n-training-cnns-architectures)｜下一篇 [A2 導讀：BatchNorm、Dropout、CNN、PyTorch 與 RNN Captioning](/posts/ai/2026-09-30-cs231n-a2-batchnorm-cnn-pytorch-rnn)｜[系列總覽](/posts/ai/2026-09-30-cs231n-course-overview)

## 參考資料

- [CS231n: Deep Learning for Computer Vision（Spring 2026 課程首頁）](https://cs231n.stanford.edu/)
- [CS231n Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [Lecture 7: Recurrent Neural Networks 投影片（2026 課表連結版）](https://cs231n.stanford.edu/slides/2026/lecture_7.pdf)
- [Lecture 7 投影片（Spring 2025 版，對照用）](https://cs231n.stanford.edu/slides/2025/lecture_7.pdf)
- [Stanford CS231N Spring 2025 Lecture 7: Recurrent Neural Networks（YouTube）](https://www.youtube.com/watch?v=kG2lAPBF7zA)
- [CS231n Spring 2025 課表](https://cs231n.stanford.edu/2025/schedule.html)
- [Goodfellow, Bengio, Courville：Deep Learning，RNN 章節（課表建議閱讀）](http://www.deeplearningbook.org/contents/rnn.html)
- [Christopher Olah：Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)
- [Andrej Karpathy：min-char-rnn.py](https://gist.github.com/karpathy/d4dee566867f8291f086)
- [CS231n Assignment 2（Spring 2026）](https://cs231n.github.io/assignments2026/assignment2/)
