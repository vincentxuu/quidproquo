---
title: "What's Going On Inside My Model?：模型退步了，你先看哪裡"
date: 2026-08-16
category: ai
type: deep-dive
tags: [interpretability, scaling-laws, benchmark, evaluation, stanford-cs230]
lang: zh-TW
series:
  name: "Stanford CS230 導讀"
  order: 10
tldr: "問模型「你心目中的鵝長什麼樣」，它畫出一大群鵝——因為標註資料把一群鵝標成 goose，它以為整群才是那個標籤。這一講給了七種打開 CNN 看內部的方法，然後誠實地說：這套方法到 transformer 上，最前沿的研究也只解釋得了兩層。"
description: "Stanford CS230（2025 秋季）Lecture 10 完整導讀：從一個 2000 億參數模型的 checkpoint 退步案例開始，走過 saliency map、occlusion sensitivity、class activation map、梯度上升、dataset search 與 deconvolution，再到 scaling law、benchmark 汙染偵測與資料診斷。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-16-cs230-inside-the-model-en)

> [上一篇](/posts/career/2026-08-16-cs230-career-advice-in-ai)是整個系列唯一不談技術的一講。這一篇是最後一講，往模型裡面看。

本篇對應 **[Lecture 10: What's Going On Inside My Model?](https://www.youtube.com/watch?v=Ozb1AR_F5MU)**（2025/12/02，Kian Katanforoosh 主講，1 小時 47 分，本學期最後一講）。

這一講在 2024 年還只是「結業致詞 + AI on-the-job」，而且用的是 **2021 年的投影片**，連續沿用三年沒動。2025 年才換成真正的可解釋性課程——這個變化本身就說明了這件事在教學者眼中的優先序改變了。

Katanforoosh 說明了改名的理由：

> 「這堂課以前叫 neural network interpretability，但我**把範圍放寬了**，因為現在多了一節談 frontier model，而**你在外面玩的那些模型，可解釋性方法多半還沒被搞定。**」

## 開場案例：你是 frontier lab 的模型訓練員

情境設定得很好：

> 你在訓練一個 **2000 億參數**的模型。昨晚一個新的 checkpoint 通過了訓練 sanity check，但出現幾個問題：**推理 benchmark 變差**、**部分安全 eval 沒過**、在 agentic workflow 裡**工具使用的延遲出現奇怪的尖峰**。
>
> 你的 VP 問：「發生什麼事了？」**在你碰任何程式碼、重新訓練之前，你要先看哪些證據？**

學生依序答出：error analysis 找失敗的**模式**、訓練 loss 是否**平滑有無尖峰**、**最後一批訓練資料是不是被下毒**、比較 checkpoint 定位問題出現的時刻、硬體故障、**attention map**（「這個 token 跟那個明明沒關係，但模型好像覺得有」）、learning rate schedule、**scaling law 比對**。

他自己補了一個學生沒想到的：

> 「可能某些 expert 失效了，或者 **mixture of experts 的 router 一直選同一個 expert**，因為它找到一個很好、很通用的 expert，其他都沒被用到。**那模型就不是在以 2000 億參數運作，它在以一個更小的模型運作。**」

### 四個桶子

| 桶子 | 內容 |
|---|---|
| **訓練與 scaling** | loss 曲線、梯度、learning rate、MoE routing、scaling laws |
| **表示與內部** | attention head 與 map、embedding、神經元層級行為（**大模型上還沒人搞定**） |
| **資料與分佈** | benchmark 汙染、訓練/測試分佈不一致 |
| **能力層級** | 對**語言模型**跑 benchmark vs 對**用它的 agentic workflow** 跑 benchmark |

最後那點值得記下來：

> 「當 frontier lab 說『我們的模型很擅長工具使用』，他們的意思是——這個語言模型在**工作流中的上游任務**上被測試過。**這是不同層級的能力分析。**」

---

# 第一部分：打開 CNN

情境：你幫動物園做了動物分類器，但他們**不願意在沒有人監督的情況下使用**，因為不理解模型的決策過程。

## 方法一：saliency map

對**輸入像素**求「狗」這個類別分數的導數：`∂S_dog / ∂X`。亮的像素＝梯度高＝改它會影響狗的分數。

**一個常見誤解**：要用 **softmax 之前**的分數。

> 「softmax 之後的分數**不只取決於狗，也取決於所有其他分數**。你可能動了一個像素，結果它剛好改變了『貓熊』的分數（因為背景有隻貓熊），這就污染了你想展示的東西。」

**最實用的判讀方式**：

> 「如果你算完梯度，發現亮的像素**散得到處都是**，那大概是模型**根本沒在看對地方，它只是運氣好。**」

**缺點**：只看到像素層級。「模型永遠不會看到一隻只有一個像素不同的貓或狗，那太不連續了。」

## 方法二：integrated gradients

saliency map 的延伸，更常用。做法是從**全黑的圖**漸變到目標影像，沿路把梯度積分起來。

實例是視網膜影像：integrated gradients 標出來的位置**正好是病灶的標註位置**。

## 方法三：occlusion sensitivity

最直觀：拿一個深色方塊在圖上掃過去，記錄分數怎麼變，畫成機率圖。

> 「很簡單，但**計算很貴**——你得把同一張圖跑過模型非常多次。」

三個實例，第三個特別有意思：

| 真實標籤 | 觀察 |
|---|---|
| 博美犬 | 方塊蓋住臉的中央時分數掉下來——合理，因為要分辨**品種**得看臉 |
| 車輪 | 方塊蓋住輪子時分數掉下來 |
| **阿富汗獵犬** | 蓋住狗時分數掉，**但蓋住左邊人臉時分數反而上升**——「你等於是在**移除多餘的干擾資訊**」 |

## 方法四：class activation map（要改架構）

前三個都是**事後**分析。要一個能**插進網路裡持續運作**的模組，就得動架構。

**先找出弱點**（他讓學生答出來）：原架構是 `conv-relu-maxpool × N → flatten → FC → FC → FC → softmax`，弱點是那三層全連接層。

> 「你同時看所有像素、把所有東西混在一起，而且做了三次。三層下來資訊已經完全混掉，你**再也找不到 conv 和 maxpool 保留的那些局部化資訊**。」

**解法**：把 `flatten + 三層 FC` 換成 **global average pooling + 一層 FC**。GAP 把**每一個 channel 平均成一個數字**。

> 「為什麼這樣有意思？因為**我們沒有失去局部化資訊**。我們只是給每張保留下來的 feature map **指派了一個數字**。局部化資訊還留在前一個 volume 上。」

**CAM 的做法**：拿最後那層 FC 中對應「狗」的權重，去加權疊加最後那幾張 feature map。（改架構後那一層要重新訓練。）改良版是 **Grad-CAM**。

有學生說影片裡模型有時在看沒意義的東西，他的回答很誠實：

> 「不意外。這是**上一代**的模型……**這正是你要建這種視覺化模組的原因——去理解『這個網路其實沒那麼好用』。**」

## 方法五：梯度上升——問模型「你心目中的狗長什麼樣」

新問題：**模型到底懂不懂什麼是狗，還是只是在亂 pattern matching？**

```
maximize  S_dog(X)  +  正則項
```

一樣用 softmax 之前的分數（否則可以靠壓低其他類別作弊），正則項讓像素留在合理範圍，從**完全隨機**的影像開始梯度**上升**。

**結果非常有啟發性：**

| 類別 | 模型生出來的東西 | 意味著什麼 |
|---|---|---|
| **大麥町** | 白底上的黑點 | 「模型可能沒完全理解什麼是狗，**但它就是這麼認為的**」 |
| **鵝** | **一大群鵝** | 「模型大概**總是看到成群的鵝、很少看到單獨一隻**。也許標註資料把一群鵝標成 goose，所以模型認為**整群**才是那個標籤。」 |
| **紅鶴** | 同樣是一大群 | 同上 |

**這個方法可以用在網路內部的任何一個激活上**——「給我那張能最大化這個激活的輸入圖」，這就給了你**神經元層級**的探測工具。

## 方法六：dataset search（今天最常用的）

> 「這是**今天最常被使用的方法，因為它太簡單也太直觀了。**」

挑一張 feature map，掃過整個驗證集，找出**讓它激活最強的前五（或前九）張圖**。全是襯衫 → 這個 filter 學會偵測襯衫；全是邊緣 → 它學會偵測邊緣。

### 為什麼那些圖都是裁切過的：感受野

他用一個好問題帶出來：「你挑的那個激活，**它看得到整張輸入圖嗎？**」

- 第一層：只看得到 filter 覆蓋的範圍
- **越深，單一激活看得到的輸入範圍越大**
- 最後的輸出看得到整張圖

所以那些圖是**根據那個激活在輸入空間實際看到的範圍去裁的**。

## 方法七：deconvolution 逆向工程

數學最重的一段，但結論很實用。

先建立：**卷積就是矩陣乘法**。1D 卷積寫成聯立方程組，就能寫成一個權重矩陣乘以輸入向量。然後兩個假設（他很誠實地標明這是工程近似）：假設 `W` 可逆、假設 `W` 正交（於是逆矩陣就是轉置）。

> 「**也許不總是成立，但在深度學習裡成立到足以能用。這是工程學科。**這就是為什麼文獻裡常把 deconvolution 叫做 **transposed convolution**。」

**實作口訣**（他說如果只記一件事就記這個）：

> 1. **把 filter 翻轉**
> 2. **做輸入的 subpixel 版本**（在數值之間插零，再加 padding）
> 3. **stride 除以二**
> 4. 照一般卷積跑

**unpooling 的 switches**：max pooling **不可逆**——你知道 6 是那四格裡的某一格，**但不知道是哪一格**。解法是前向傳播時用一個**很輕量的二元矩陣**記下 max 發生在哪裡，反向時傳回來。

**完整流程**：送一張狗的圖進網路 → 挑一張 feature map → 找出最大激活的位置 → **把其他位置全部歸零** → 反轉網路 → 得到**這個激活究竟被什麼像素最大化**的裁切圖。

## 實際的視覺化成果

[Zeiler & Fergus](https://arxiv.org/abs/1311.2901) 用 5 萬張驗證圖做的：

- 第一層可以**直接把 filter 印出來**看（邊緣偵測器印出來就長得像邊緣偵測器）——**但第一層之後就不行了**
- 第二層起用 deconv，可以看到某些 filter 明確在偵測圓形、某些在偵測特定形狀
- 第三層：「filter 捕捉的資訊更複雜了。**這就是第一講說『越深特徵越複雜』的證明。**」

[Yosinski 的 Deep Visualization Toolbox](https://arxiv.org/abs/1506.06579) 他放了影片並現場對照方法名稱：第一層某個神經元對**亮→暗**的邊緣反應強，隔壁那個對**暗→亮**反應強；到第五個 conv 層，「這個神經元似乎對**臉**有反應」，而且用 deconv 可以看出「它在乎頭和肩膀，但**忽略手臂和軀幹**」，甚至「**對貓臉也有一定程度的反應**」。

---

# 第二部分：frontier model

## CNN vs 現代模型

| | 處理的東西 | 視覺化的是 |
|---|---|---|
| **CNN** | 局部化資訊 | 邊緣、紋理、形狀 |
| **LLM** | **關係** | **概念與 token 之間的關係與意義** |

兩個可視化的抓手：

1. **attention pattern**——看某個 token 和其他 token 的關係。「每個 attention head 學到不同的模式：**把代名詞連到名詞、追蹤結構、強制某種順序**。」出處是 [Vig 的視覺化工作](https://arxiv.org/abs/1904.02679)。他的定位很好記：**這就是 CNN 的 saliency map 在 transformer 上的對應物。**
2. **embedding + 降維**——用 t-SNE 看語意相近的 token 有沒有靠在一起，**檢查模型是否真的學到有意義的表示**。

## 但可解釋性其實還沒被解決

> 「不幸的是，現代 transformer 複雜到——**即使是最前沿的研究，也只能解釋兩層的 transformer。**」

他指出目前最好的成果來自 Anthropic 的 transformer circuits 系列——[A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html)（Elhage 等人，2021）引入了 circuit 的概念，並發現 **induction head 只在至少兩層注意力的模型裡才會出現**；後續的 In-context Learning and Induction Heads（Olsson 等人，2022）專門處理它。

> 「**induction head 大概是我們目前最好的、能看見 transformer 內部發生什麼事的工具。**」

## 訓練診斷（training telemetry）

要看的：訓練 loss、驗證 loss（**全域的，以及分資料子集的**）、**梯度範數**、learning rate schedule、**硬體效率指標**。

loss 上的突然跳動可能是某個 batch 被汙染；「**或者你在它上面表現好到不該那麼好，那也該亮紅燈**」。

（他順帶一句：「我記得以前甚至有部落格專門讓大家貼**自己最醜的 loss function**。」）

**為什麼你在外面看不到這些：**

> 「frontier lab **很少公佈這些儀表板，因為那是 IP**——會洩漏他們架構的關鍵資訊。所以你通常是**一年一年慢慢知道**：你會學到三四年前那個模型的做法，因為他們現在願意分享了。」

## scaling law 與 Chinchilla

做法是**固定其中兩個變數，變動第三個**（算力 / 資料集大小 / 參數量），看 test loss 的冪次關係。

[Chinchilla](https://arxiv.org/abs/2203.15556)（DeepMind, 2022）分析 GPT-3 後的結論：

> 「**GPT-3 相對於它的規模表現得不夠好，因為它訓練得不夠久。**如果你繼續訓練 GPT-3 更久，效能會好非常多。**問題不在模型大小，模型其實沒被充分利用。**」

具體對比：**Chinchilla 700 億參數 vs GPT-3 1750 億參數，Chinchilla 表現更好。**

圖的讀法：**點在線上方 = 你的模型應該再訓練久一點。**

**為什麼這件事重要（金錢論證）：**

> 「訓練一次的成本非常高。沒有公開，但**我們估計 GPT-5 大概在數億美元的量級**。所以你會想知道：**我該不該把這個模型訓練兩倍長？**那是個很大的財務決策。scaling law 讓你判斷——**該投資在算力、在擴大資料集、還是在放大模型容量？**」

（**這個成本數字是他的估計，非公開資訊。**）

## benchmark 怎麼讀

這段對每天在看模型發布圖表的人最有用：

> 「**我不太看 foundation model 供應商自己發布的 benchmark。**或者換個說法，我會看模型之間的**相對值**，而不是**絕對值**。
>
> 然後你會等社群在 agentic workflow 上、在他們自己的任務上測試它。比如說，**社群花了一段時間才意識到 Claude 在寫程式上有多好。**從 benchmark 上看不太出來——benchmark 上看起來別人也都很好。但隨著時間過去，大家開始覺得『喔哇，它寫程式真的很強』。」

（學生舉了 Llama 4 當例子：benchmark 好看，社群實測後不行。）

### 怎麼偵測測試集被汙染

| 方法 | 做法 |
|---|---|
| **n-gram 搜尋** | 取 7、8 個 token 的序列，在訓練集裡找測試集的相同 n-gram |
| hash | 同上，用雜湊 |
| **embedding 搜尋** | 抓**語意上**的重複——「也許不是逐字相同，而是語意相同」 |

汙染來源舉得很具體：「也許它訓練到一篇部落格文章，有人在介紹那個 benchmark；也許它訓練到 GitHub 上某個很陰暗的角落裡，有個 text 檔列出了部分測試集。」

**處置**：測試集比較小，把可疑的題目拿掉，**換成全新的、離線保存在一個不上網的資料夾裡的題目**。

### 安全評估與它的真正用途

壓力測試（對抗攻擊、jailbreak、社交工程）、有害內容、幻覺、**隱私外洩**，而且**要在 agentic workflow 裡評估，不只是 one-shot**。

實務上的關鍵一句：

> 「這些儀表板決定了發布的 go / no-go，**也決定了 RLHF 要做在哪裡**。因為監督式微調和 RLHF **都很貴**，你會想把它做在**正在失敗的東西**上。如果你精確辨識出哪些 eval 在失敗，你就能把 RLHF 聚焦在那個問題上，**省下大量的錢和人力時間。**」

## 資料診斷

**分佈檢查**：[The Pile](https://arxiv.org/abs/2101.00027)（800GB）保留了資料的 domain 標記，所以你不只能畫整個資料集的 loss，還能畫**每個 domain 各自**的 loss。

某個 domain 代表性不足，模型在那個 domain 的表現就會掉——他回指 Lecture 6 的語音例子：**零太多、一太少，模型就學不會一。**

**線上學習的風險**（站上沒寫過的一點）：

> 「frontier model 是**即時在學的**，資料不斷被餵進去。假設**上個月那批資料裡程式碼資料很少**，那訓練的最後一段，coding domain 的頻率就比其他 domain 低。**如果你不小心，你就會看到某個特定 domain 的效能掉下來。**」

**解法是聰明的取樣**，而且他直接回指 Lecture 5：

> 「還記得強化學習裡的 **experience replay** 嗎？就是那類取樣方法，讓模型供應商能確保**訓練的不同階段，各 domain 的資料頻率維持一致。**」

**token 統計**：追蹤關鍵 token 的頻率變化。「如果**微分符號**代表性不足，那你要模型做微分時效能就會差很多。」實際的異常報告範例：**「新一輪網路爬取之後，非英語 token 從 12% 上升到 19%」**。

## 收尾：資料快用完了嗎

學生問合成資料的未來，他的回答很平衡：

> 「一般來說用合成資料是好主意。**但我會一直盯著 token 頻率**——因為合成資料便宜太多，如果你生了某個 domain 的大量合成資料，**它會排擠其他 domain**。
>
> 實務上我認為**合成資料的報酬在某個點會 plateau**。最近的消息大概是說：**現在多數 domain 缺的是高品質資料，而不是缺合成資料。**」

他引了 Epoch AI 的研究報告，說低品質文字資料、影音資料、高品質資料會依序在幾年內用完（他自己說忘了確切數字）。

> **⚠️ 課堂的分期和論文對不上。** Epoch AI 的[〈Will we run out of data?〉](https://epoch.ai/publications/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data)（Villalobos 等人，2024）給的是**單一估計**，不是分模態的三個年份：**經品質與重複調整後的公開人類文字存量約 300 兆 token，照當前趨勢會在 2026 到 2032 年之間被完全用掉**，若過度訓練則更早（論文提到過度訓練 5 倍會在 2027 用完、100 倍則 2025）。課堂上「2025／2027／2030」那組數字**在這篇論文裡找不到對應**。

**為什麼「產生的資料比用掉的多」不構成反駁**——這段論證很好：

> 「我們產生的資料是不是比用掉的多？大概是，**但這不代表模型沒有 plateau。**
>
> 你去用 Python 寫程式，**你的 Python 程式碼 99% 大概已經在網路上某處了**，所以模型其實**沒從裡面學到多少**。那只是**更多**資料，不是**更高品質**的資料。
>
> 也許世界上最好的放射科醫師寫了一篇獨特到就定義而言是高品質的研究論文——**但我們能期待多少這種東西？**」

而 AI 生成的資料回流：「今天的程式碼資料**越來越多是生成出來的，然後又被餵回去**。長話短說：**對訓練來說就沒那麼有意思了。**」

---

## 延伸：這一講對做應用的人有什麼用

你大概不會去訓練 2000 億參數的模型。但這一講有三件事可以直接搬：

**一、「散得到處都是 = 它只是運氣好」是一個通用的判讀原則。** saliency map 的版本是像素散亂；LLM 應用的版本是——當你的 agent 答對了，但它引用的來源和推理路徑看起來毫無章法，那個「答對」不可靠。**看對了答案不等於看對了地方。**

**二、「鵝 = 一群鵝」是標註問題的可視化。** 模型學到的是**你的標註習慣**，不是你以為的概念。這件事在 LLM-as-judge 上一模一樣：你的 judge 學到的是 rubric 的字面樣態，不是你心裡的品質標準。

**三、benchmark 只看相對值。** 這條可以直接套用在讀模型發布公告上，而且他給了理由——不是因為廠商造假，而是因為**汙染難以偵測、而 benchmark 測的能力和你的任務不一定重疊**。

最後值得記住的是他的誠實：**這整套方法在 transformer 上目前只做得到兩層。** 我們對自己每天在用的模型，內部理解程度遠低於對一個 2014 年的卷積網路。

## 參考資料

- [Lecture 10: What's Going On Inside My Model?](https://www.youtube.com/watch?v=Ozb1AR_F5MU) — 2025/12/02，Kian Katanforoosh。七種可解釋性方法、scaling law、benchmark 汙染與資料診斷的出處
- [Visualizing and Understanding Convolutional Networks](https://arxiv.org/abs/1311.2901) — Zeiler & Fergus。deconvolution 視覺化
- [Understanding Neural Networks Through Deep Visualization](https://arxiv.org/abs/1506.06579) — Yosinski et al., 2015。Deep Visualization Toolbox
- [Visualizing Attention in Transformer-Based Language Representation Models](https://arxiv.org/abs/1904.02679) — Vig。attention 視覺化
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) — DeepMind, 2022。即 Chinchilla
- [The Pile: An 800GB Dataset of Diverse Text for Language Modeling](https://arxiv.org/abs/2101.00027) — 保留 domain 標記的資料集
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html) — Elhage et al., Anthropic, 2021。circuit 概念與 induction head 的出處
- [Will we run out of data?](https://epoch.ai/publications/will-we-run-out-of-data-limits-of-llm-scaling-based-on-human-generated-data) — Villalobos et al., Epoch AI, 2024。約 300 兆 token、2026–2032 用盡
- [CS230 Lecture 10 投影片](https://cs230.stanford.edu/syllabus/fall_2025/10/lecture_10.pdf)

**未附連結的出處**：OpenAI 與 Anthropic 的聯合安全評估——本文只寫出名稱，未查證連結。
