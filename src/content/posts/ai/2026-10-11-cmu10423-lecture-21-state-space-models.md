---
title: "State Space Models：狀態更新如何展成卷積｜CMU 10-423 第 21 堂"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 29
description: "從recurrence展開固定卷積並識別selection邊界"
draft: false
---

> [English version](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en)

**影片狀態：錄影需登入或課程授權。** 本文依 CMU 10-423 Spring 2026 第 21 堂公開投影片整理；算例與變式是本站教學補充。

attention每次可以直接讀歷史token，卻要保存越來越長的KV。另一種做法是把讀過的內容壓進固定大小狀態，每來一個輸入就更新它。問題也跟著變了：少保存資料固然省空間，但哪些資訊值得留？第21堂從線性state space走到S4、selective Mamba與hybrid，不能只讀成「另一個更快Transformer」。

先備是[RNN狀態](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff)。本篇所需線性代數只有矩陣乘法與向量加法：矩陣A描述舊狀態如何轉成新狀態，B把輸入寫入，C把狀態讀成輸出。矩陣次方是反覆作用，不是把每個元素各自平方。

## 先看離散狀態，再回到連續系統

線性SSM的離散式可寫 `h_t=A h_(t−1)+B x_t`，輸出 `y_t=C h_t`，此處省略direct-feedthrough項。h是壓縮歷史的state，x是新輸入。若h有d個值，單序列state storage不隨已讀token數增加；但d不是零，batch、層數和訓練activation仍要另算。

連續系統起點是 `dh/dt=A_c h+B_c x`。離散化選一個時間間隔Δ與輸入假設，得到離散A、B；例如zero-order hold保持區間內輸入固定，A與矩陣exponential有關。不能把連續A_c直接當作離散A，更不能為了直覺把所有系統都當成一個scalar衰減。

S4藉結構化狀態矩陣與高效kernel計算，讓線性SSM能處理長序列；不是隨便選一個大矩陣就具有同樣效率與穩定性。這裡先用一維例子看懂等價路徑。

## 完整遞迴，完整展開

本文自擬h初值0、A=.5、B=1、C=1，輸入 `[1,2,0]`：

```text
h1 = .5×0 + 1 = 1     y1 = 1
h2 = .5×1 + 2 = 2.5   y2 = 2.5
h3 = .5×2.5 + 0 = 1.25 y3 = 1.25
```

最後輸入為0，輸出仍1.25，因為state保留較早內容。把第三步完整代回前一步：`h3=.5(.5(1)+2)+0=.25×1+.5×2+1×0=1.25`。一般矩陣式在初值0時是 `y_t=Σ C A^(t−i) B x_i`。所以固定kernel依次為 `CB, CAB, CA²B,...`；本例就是 `[1,.5,.25,...]`。

用kernel計算同一序列：y1=1×1，y2=1×2+.5×1，y3=1×0+.5×2+.25×1，與遞迴完全相同。訓練整段序列可利用卷積形式並行處理，串流推論則逐步更新state；它們是同一線性時不變系統的不同計算路徑，不是兩個不同目標。

## Mamba 為什麼不能沿用同一個固定kernel

固定A、B、C的系統對每個輸入套同一規則，難以依內容決定「這是重要名字，留下來；那是填充文字，略過」。Selective SSM讓部分參數依輸入而變，例如B、C與Δ由x產生，於是狀態更新能選擇寫入與保留方式。

本文自擬只讓A隨步改成 `.5,.1,.9`，仍B=C=1，輸入同為 `[1,2,0]`。h1=1，h2=.1×1+2=2.1，h3=.9×2.1=1.89。第一輸入到第三輸出的係數是`.9×.1=.09`，第二輸入是`.9`，已不是原固定kernel的`.25,.5`。這不是Mamba完整實作，卻展示selection改變歷史權重的原因。

失去固定卷積kernel不等於只能慢速逐步Python迴圈。Mamba設計硬體感知scan處理這類結構；並行scan與固定convolution不是同一演算法。說「Mamba是卷積所以所有步都一樣」會漏掉核心selection。

## 變式與記憶取捨

變式在固定系統多加x4=1，答案h4=.5×1.25+1=1.625；卷積核給`1×1+.5×0+.25×2+.125×1=1.625`。若A=1、B=C=1，則輸出是prefix sum，輸入1與2的順序交換不改最後總和，展示state可能丟失順序資訊；不是說所有SSM都如此。

還可以直接驗收壓縮失去什麼。前述A=.5的scalar系統，兩個不同輸入序列 `[1,0]` 與 `[0,.5]` 最後state都等於.5。若問題是「第一個輸入是不是1」，只看最終state的decoder無法區分兩者，因為它收到完全相同的值。這不是靠增加輸出解說能解決，而要改表示、增加state維度、保留額外資訊，或重新定義要服務的任務。不同架構與selection可能緩解此類問題，但仍應設計相撞或長距離干擾例，驗收真正需要保留的資訊；不能只用最後loss下降宣布長期記憶完整。

Attention保存多個歷史K/V讓新query讀取；SSM把歷史壓進state，可能更省長序列decode記憶體，但具體檢索與內容選擇需要驗收。Hybrid把attention與SSM混用，代表可在不同層做取捨，不代表優點自動相加。比較時固定參數、資料、序列長度與測試題；吞吐、cache大小、精確取用能力各自記錄。


## 延伸閱讀

- [上一篇](/posts/ai/2026-09-30-cmu10423-reasoning-models)
- [下一篇](/posts/ai/2026-10-11-cmu10423-lecture-22-real-world-risks)

## 課程影片來源

官方[課程首頁](https://www.cs.cmu.edu/~mgormley/courses/10423/)提供 Panopto 錄影入口，讀取需登入或課程授權。本篇提供投影片導讀，未提供原音逐字稿、字幕或跟讀材料。

## 參考資料

- [CMU Lecture 21 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)
- [S4](https://arxiv.org/abs/2111.00396)
- [Mamba](https://arxiv.org/abs/2312.00752)
