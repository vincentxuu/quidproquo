---
title: "台大 ADL 2025 第 1 講：什麼是機器學習與深度學習"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, ai-course, deep-learning, machine-learning, nlp]
lang: zh-TW
series:
  name: "台大陳縕儂 深度學習之應用 2025 Fall 導讀"
  order: 1
tldr: "ADL Fall 2025 的第一份自學講義把機器學習講成「從資料裡找一個函數」，把深度學習講成「一條由很多簡單函數串起來、每一站都由機器自己學的生產線」。它用語音與影像說明 deep 和 shallow 的差別，用大數據與 GPU 解釋 2010 年後的突破，再用 universality theorem 追問為什麼要深而不是胖。最後一段最實用：學習任務由輸出領域決定，網路架構要配合輸入領域的性質。"
description: "導讀台大陳縕儂 ADL Fall 2025 的 Introduction 講義與影片 1.1–1.3：學習就是找函數、機器學習框架、深度學習的生產線比喻、deep vs shallow、大數據與 GPU、universality theorem、fat+shallow vs thin+deep，以及怎麼把 NLP 任務框成分類或序列預測。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-30-ntu-adl2025-ml-dl-introduction-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

這是[台大陳縕儂 深度學習之應用 2025 Fall 導讀](/posts/ai/2026-09-30-ntu-adl2025-course-overview)的第 1 篇。ADL Fall 2025（114-1，2025/09/01–12/15）把這一講放在課表的「自學／先修」列，[Course Logistics](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf) 第 17 頁要求選課前就看完，當作 HW0 的一部分。

**本文依據**：[Introduction 講義](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Introduction.pdf)（46 頁），以及三支影片：[1.1 What is ML? 甚麼是機器學習?](https://youtu.be/Nls5bHxW6i0)（16:45）、[1.2 What is DL? 甚麼是深度學習?](https://youtu.be/asuLb0lLmJY)（41:26）、[1.3 How to Apply? 如何應用深度學習?](https://youtu.be/oT4UQj_PXYo)（10:11）。講義在 2026-09-30 打開核對；影片以中文講授，本文的頁碼都指講義 PDF。

這一講沒有數學推導。它要讀者帶走兩個觀念：學習就是找函數；把任務寫成「輸入領域 → 輸出領域」之後，才知道該選什麼模型。

## 課程影片來源

以下影片已於 2026-10-10 對照官方課程頁與官方 YouTube 播放清單（講次編號與標題相符）；不提供時間跳轉。

```youtube
url: https://www.youtube.com/watch?v=Nls5bHxW6i0
title: ADL 1.1: What is ML? 甚麼是機器學習?（YouTube）
```

```youtube
url: https://www.youtube.com/watch?v=asuLb0lLmJY
title: ADL 1.2: What is DL? 甚麼是深度學習?（YouTube）
```

原始影片：[ADL 1.1: What is ML? 甚麼是機器學習?（YouTube）](https://www.youtube.com/watch?v=Nls5bHxW6i0)、[ADL 1.2: What is DL? 甚麼是深度學習?（YouTube）](https://www.youtube.com/watch?v=asuLb0lLmJY)、[ADL 1.3: How to Apply? 如何應用深度學習?（YouTube）](https://www.youtube.com/watch?v=oT4UQj_PXYo)

課程與錄影入口：

- [官方課程與錄影入口](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)

查核日期：2026-10-10。

內容核對：已依字幕核對（2026-10-10）：1.1 與 1.2 兩支都讀了字幕。1.1：評論情緒分類寫不出規則、學習就是找函數、training／testing、語音／影像／廣告／打電動等應用；1.2：生產線與 end-to-end training、deep vs shallow 的語音與影像對照、hidden layer 與 representation、神經元與 sigmoid、錯誤率下降約三分之一、大數據與 GPU、fat vs thin 的參數量比較，皆與文章對應段落相符。補充一點文章原本沒說的：這兩支的 YouTube 上傳日與說明欄都是 2024/09/04，是 Fall 2024 的錄影而非 2025 學期重錄（說明欄還註明投影片可在 adl.miulab.tw 取得）。第 21 頁時間線與 1.3 的內容文章未對影片下具體說法，1.3 未核對（未嵌入）。

## 寫不出規則的任務，改成讓機器找函數

講義第 5 頁用一個情緒分類任務開場：判斷商品評論是正面還是負面。「I love this product!」可以寫規則，看到 love、like 就輸出正面；「It claims too much.」也可以，看到 too much、bad 就輸出負面。但「It's a little expensive.」呢？中文版的例子更貼近台灣讀者：「台灣第一波上市！」是推，「規格好雞肋…」是噓，「樓下買了我才考慮」要判成什麼？

投影片的結論是：有些任務太複雜，我們不知道怎麼寫程式解。第 6 頁把問題換個問法：與其寫 `program.py`，不如假設有一個函數 f，輸入評論、輸出推或噓，**給機器大量資料，讓它自己學出 f 應該長什麼樣子**。第 7 頁接著列出同一個框架能套的任務：語音辨識、影像辨識、天氣預報、客戶預測、打電動，每一個都是 f(輸入) = 輸出。

第 8 頁的 Machine Learning Framework 把這件事拆成三個名詞：

- **Model**：一個候選函數的集合（hypothesis function set）。
- **Training**：根據觀察到的訓練資料，從集合裡挑出最好的函數 f*。
- **Testing**：拿學到的 f* 去預測沒看過的輸入。

這三個名詞在下一講會變成三個問題：模型是什麼、什麼叫好的函數、怎麼挑出最好的。

## 深度學習：一條每站都自己學的生產線

第 9 頁把深度學習定義為機器學習的一個子領域。第 10 頁用「生產線」比喻：深度學習模型是很多簡單函數 f1、f2、f3 串在一起，合起來成為一個非常複雜的函數。關鍵是 **end-to-end training**：每一站該做什麼，由機器自動學出來，而不是人指定。

第 11 頁把生產線換成神經網路的圖：輸入層、多層 hidden layers、輸出層。中間各層產生的東西叫 features 或 representations。投影片分兩句話定義：representation learning 想學出好的特徵；deep learning 想學出多個層次的表示，再加上輸出。

### deep vs shallow 的差別在哪一站由人做

第 12–15 頁用兩個領域對照：

- **語音辨識**：shallow 模型的流程是 waveform → DFT → spectrogram → filter bank → log → DCT → MFCC → GMM，大部分方框是人手設計的，只有最後一站從資料學。deep 模型把每一站都交給資料。投影片引用 Deng Li 在 Interspeech 2014 的一句「Bye bye, MFCC」，並標註代價：工程人力少了，但機器要學的更多。
- **影像辨識**：shallow 模型同樣是手工特徵加一個分類器；deep 模型的每一層都從資料學，第 15 頁引用 [Zeiler & Fergus（ECCV 2014）](https://arxiv.org/abs/1311.2901)的視覺化結果，看各層學到什麼。

第 16–17 頁把差別收成一句（標註 credit by Dr. Socher）：機器學習要人先用領域知識描述資料特徵，再讓演算法優化權重；深度學習連表示都交給機器學。投影片也補一句：深度學習通常指基於神經網路的模型。

第 19–20 頁先介紹單一神經元：輸入乘上權重、加上 bias，經過 sigmoid activation 輸出。每個神經元是很簡單的函數，把它們串成多層就是深度神經網路 f: R^N → R^M。細節留給[第 2 篇](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)。

## 為什麼 2010 年後才爆發

第 21 頁列了一條時間線：1960 年代的 perceptron、1969 年指出 perceptron 的限制、1980 年代的多層感知器、1986 年的 backpropagation、1989 年「一個 hidden layer 就夠好，為什麼要深？」的質疑、2006 年 RBM 初始化、2009 年 GPU、2010 年語音辨識突破、2012 年 ImageNet 突破、2016 年 AlphaGo，一直到 2022 年 ChatGPT。

第 22 頁放語音辨識的數字：在 RT03S FSH 上，傳統特徵的 WER 是 27.4%，深度學習是 18.5%，相對降低 33%。

第 23 頁問：為什麼突破集中在 2010 年後？第 24–28 頁的答案是兩件事：**大數據**與 **GPU**。速度重要，是因為資料變多會拉長訓練時間，太長就不實用；推論端的使用者也沒耐心等回應。GPU 提供的算力讓這些應用可以真正上線。

## 為什麼要深，不要胖

第 29 頁先講直覺：越深，參數越多。第 30 頁馬上反問：**universality theorem** 說任何連續函數 f: R^N → R^M，只用一層 hidden layer 的網路就能實現（講義連到 [Nielsen 書的第 4 章](http://neuralnetworksanddeeplearning.com/chap4.html)）。既然一層就夠，為什麼要「deep」不要「fat」？

第 31–33 頁用參數量相同的兩個網路對照：一個又胖又淺，一個又瘦又深。第 32 頁用手寫數字分類的結果說明：**達到同樣效果時，深的模型用的參數比較少**。第 33 頁再用一個示意說明，同一個函數用淺網路表示所需的節點數，可能遠多於用深網路表示。

這裡要分清楚：universality theorem 回答的是「表達得出來嗎」，不回答「用多少參數、學不學得到」。講義的論點落在後者。

## 怎麼把任務框成學習問題

這是 1.3 的主題（第 34–41 頁），也是整門課名字裡「Applied」的意思。

第 35 頁把學習演算法寫成 f: X → Y，把輸入領域 X 映到輸出領域 Y：

- **輸入領域**：一個詞、一串詞、語音訊號、點擊紀錄。
- **輸出領域**：單一標籤、序列標記、樹狀結構、機率分布。

第 36–37 頁用輸出領域區分兩類任務：

| 任務類型 | 講義的例子 |
|---|---|
| **分類** | 情緒分析（「這規格有誠意！」→ +）、語音音素辨識、手寫辨識 |
| **序列預測** | 詞性標註（「推薦我台大後門的餐廳」逐詞標 VV、PN、NR…）、語音辨識、機器翻譯 |

第 37 頁的結論是一句：**學習任務由輸出領域決定。**

第 38 頁轉到輸入端：輸入有連續性、時間性、重要性分布等性質，網路架構要配合。CNN 用局部連結、權重共享與 pooling 處理影像；RNN 處理時間資訊；Transformer 處理多個輸入之間的互動。第 39 頁把兩端合起來：網路設計要同時利用輸入與輸出領域的性質。

第 40–41 頁把「Applied Deep Learning」定義成：怎麼把一個任務框成學習問題，並設計或選擇對應的模型。應用深度學習的三個核心因素是資料、硬體（GPU），以及能讓網路在特定問題上運作的演算法設計能力。

**今晚就能做的事**：挑一個你熟的 NLP 任務，寫下它的 f: X → Y。X 是一個詞、一句話還是一段對話？Y 是一個標籤、每個詞一個標籤，還是另一串文字？寫得出 Y，就知道它是分類還是序列預測；寫得出 X 的性質，就知道後面幾講的 RNN 和 Transformer 各自在處理什麼。

## 延伸閱讀

- [CMU 11-785 Lecture 1：從感知器到深度網路](/posts/ai/2026-08-22-cmu-11785-01-introduction)與[Lecture 2：神經網路作為通用近似器](/posts/ai/2026-08-22-cmu-11785-02-universal-approximators)：用更多篇幅講 universality 與深度的必要性。
- [Stanford CS224N 導讀](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning)：英文授課的 NLP 深度學習主線。
- 講義第 45 頁列的兩本參考書：Goodfellow、Bengio、Courville 的 [Deep Learning](http://www.deeplearningbook.org) 與 Michael Nielsen 的 [Neural Networks and Deep Learning](http://neuralnetworksanddeeplearning.com)。

上一篇：[台大陳縕儂 深度學習之應用 2025 Fall 導讀：課程地圖、A2 分級與讀法](/posts/ai/2026-09-30-ntu-adl2025-course-overview)
下一篇：[神經網路與反向傳播](/posts/ai/2026-09-30-ntu-adl2025-neural-network-backprop)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。嵌入影片與官方課程頁、播放清單的講次相符。
- 2026-10-10：依字幕核對影片內容。確認 1.1、1.2 與文章說法相符，並補註兩支都是 2024/09/04 的 Fall 2024 錄影。

## 參考資料

- [ADL Fall 2025 Introduction 講義（250901_Introduction.pdf）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Introduction.pdf)
- [ADL 1.1: What is ML? 甚麼是機器學習?（YouTube）](https://youtu.be/Nls5bHxW6i0)
- [ADL 1.2: What is DL? 甚麼是深度學習?（YouTube）](https://youtu.be/asuLb0lLmJY)
- [ADL 1.3: How to Apply? 如何應用深度學習?（YouTube）](https://youtu.be/oT4UQj_PXYo)
- [ADL Fall 2025 課程頁](https://www.csie.ntu.edu.tw/~miulab/f114-adl/)
- [Course Logistics 投影片（HW0 要求）](https://www.csie.ntu.edu.tw/~miulab/f114-adl/doc/250901_Course.pdf)
- [Zeiler & Fergus, Visualizing and Understanding Convolutional Networks（arXiv）](https://arxiv.org/abs/1311.2901)
- [Michael Nielsen, Neural Networks and Deep Learning, Chapter 4](http://neuralnetworksanddeeplearning.com/chap4.html)
- [Goodfellow, Bengio, Courville, Deep Learning](http://www.deeplearningbook.org)
