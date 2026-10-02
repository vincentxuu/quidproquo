---
title: "CS224U 解釋方法 I：probing 看得見表徵，feature attribution 才給得出因果保證"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, interpretability, nlp, stanford, ai-course]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 11
tldr: "CS224U 2023 春季版的 Analysis methods 單元先拿一張三欄計分表比較三類方法：probing 擅長描述表徵，卻給不出因果推論；integrated gradients 對表徵只給得出一個分數，但滿足 sensitivity 公理，所以有因果保證。本篇走完投影片前 40 頁、影片 33–35 與 feature_attribution.ipynb，也記下 notebook 在今天的環境裡會卡住的地方。"
description: "Stanford CS224U（Spring 2023）Analysis methods 單元前半導讀：從行為評估過渡到結構評估，probing 的做法、control task 與 selectivity、probe 為什麼推不出因果；feature attribution 的 sensitivity 公理、inputs × gradients 的反例、integrated gradients 的計算步驟，以及 feature_attribution.ipynb 的實作與相容性問題。"
draft: false
glossary:
  - term: "probe selectivity"
    aliases: ["selectivity", "control task"]
    definition: "probe 在真實任務上的表現，減掉它在 control task（輸入輸出格式相同、但標籤隨機指定的假任務）上的表現。"
    context: "CS224U 用它校正 probe 太強、把資訊存在自己參數裡的問題（Hewitt and Liang 2019）。"
    links:
      - label: "Hewitt and Liang 2019"
        url: "https://aclanthology.org/D19-1275/"
  - term: "integrated gradients"
    aliases: ["IG"]
    definition: "在 baseline 與實際輸入之間插出一串中間點，逐點算梯度再平均，最後乘上輸入與 baseline 的差，作為每個特徵的歸因分數。"
    context: "CS224U 以它作為 feature attribution 的主要範例，因為它可被證明滿足 sensitivity 公理。"
    links:
      - label: "Sundararajan et al. 2017"
        url: "http://proceedings.mlr.press/v70/sundararajan17a.html"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution-en)

**本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 2023 春季版。** 這是 [Stanford CS224U 導讀](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)系列第 11 篇，範圍是 Analysis methods 單元的前半：總論、probing、feature attribution。講次表把這個單元排在 2023 年 5 月 8、10、15 日三堂。用到的官方材料有三份：投影片 [Analysis methods in NLP](https://web.stanford.edu/class/cs224u/slides/cs224u-analysis-2023-handout.pdf) 的前 40 頁（全份 64 頁）、公開播放清單的影片 33–35，以及 repo 裡的 [`feature_attribution.ipynb`](https://github.com/cgpotts/cs224u/blob/main/feature_attribution.ipynb)。

存取等級沿用[課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的定義，是 **A3（歷史版）**：投影片、錄影、notebook 都公開。拿不到的是 Canvas 上的 Quiz 4 和教室錄影。

## 從行為評估往裡面走一層

[上一篇](/posts/ai/2026-09-29-cs224u-compositionality-recogs-hw3)做的是黑盒測試：模型從外面看起來行不行。Potts 在投影片第 3 頁把評估分成兩類。一類是 **Behavioral**：標準 IID、探索式、假說驅動、challenge、adversarial、security-oriented。另一類是 **Structural**：probing、feature attribution、interventions。這個單元講的是後者。

他用「奇偶數判斷器」說明為什麼要跨過去。第一個模型在 four、twenty one、thirty two、thirty six、sixty three 上全對。打開一看，它只是把這五個字串查表，其他一律回 odd，所以 twenty two 會錯。第二個模型更聰明：它看最後一個 token，one 到 nine 各自對應奇偶，其他還是回 odd。這次 sixteen 會錯。

影片 33 的原話是：

> "no matter how many inputs we offer this model we will never get a guarantee for every integer string that it will behave as intended. For that kind of guarantee we need to look inside this black box."

他接著舉出三個大家都想要的正面保證：沒有有害的社會偏見、在某些情境下安全、核准某種用途。行為測試可以證明模型**有**問題，但證明不了它**沒有**問題。

## 三欄計分表：這個單元的主脊

整個單元都在填同一張表。三個目標是：描述表徵（characterize representations）、做因果推論（causal inference）、能不能拿來改進模型（improved models）。下表整理自影片 33–37 的口頭評分。投影片上的評分符號是圖，抽出來的文字裡沒有。

| 方法 | 描述表徵 | 因果推論 | 改進模型 |
|---|---|---|---|
| Probing | 很強 | 不行 | 不確定（multi-task training 是否可行未知） |
| Feature attribution | 很弱，只有一個重要度分數 | 可以（以 IG 為例） | 沒有直接路徑 |
| Intervention-based | 可以 | 可以 | 可以（IIT，見[下一篇](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das)） |

Potts 在影片裡直接說明了立場：第三類是他自己深度參與、也最偏好的方法。讀這張表時可以記住這一點。

## Probing：用一個小模型去讀大模型的隱藏層

### 做法

投影片第 16 頁把 probing 拆成四步：

1. 對目標模型的內部結構提一個假說，例如「某層編碼了詞性」。
2. 選一個能代理這個結構的監督式任務，例如詞性標注資料集。
3. 指定你認為結構存在的位置。
4. 在那個位置訓練一個監督式 probe。

實際操作上，BERT 只是一台「產生向量的機器」。每丟一句話進去，就把指定位置的向量取出來，配上任務標籤，累積成一份 (x, y) 資料集，最後在上面訓練一個小的線性模型。講次表把 [Tenney et al.](https://aclanthology.org/P19-1452/) 列為 probing 的指定閱讀。他們在 BERT 各層做 probing，發現詞性在中間層出現，依存句法稍後，共指資訊更晚。

一個小對照：講次表上寫的是「Tenney et al. 2018」，但連結指向 ACL 2019 的 *BERT Rediscovers the Classical NLP Pipeline*，投影片參考文獻也寫成 Tenney, Das, and Pavlick 2019。以連結和投影片為準。

### 第一個問題：你在讀目標模型，還是在訓練新模型？

投影片第 18 頁講得很直白。probe 本身就是一個監督式模型，它的輸入剛好是目標模型的凍結表徵。這跟「用某種特徵工程訓練一個分類器」很難區分。probe 越強，找到的資訊越多，但那些資訊有一部分可能只是存在 probe 自己的參數裡。

[Hewitt and Liang 2019](https://aclanthology.org/D19-1275/) 提出的解法是 **control task**：輸入輸出格式跟真實任務一樣，但標籤是隨機固定指定的。例如每個詞隨機配一個固定的詞性標籤。**Selectivity** 就是 probe 在真實任務上的表現減去它在 control task 上的表現。影片 34 引用他們的結果：只有兩個 hidden unit 的小 probe selectivity 最高；參數多的 probe 容量大，能把資料背起來，selectivity 就低。

**怎麼做**：自己做 probing 時，同時報 control task 的分數和 selectivity，不要只報 probe 準確率。

### 第二個問題：probe 推不出因果

這是 Potts 更在意的一點。投影片第 21–22 頁用一個加法網路舉例：輸入三個數，輸出它們的和，而且永遠算對。你的假說是：前兩個數先加成中間變數 S1，第三個數複製到 w，最後 S1 + w。

你對 L1 做 probe，發現它完美編碼第三個輸入 z；對 L2 做 probe，發現它完美編碼 x + y。看起來假說成立，只是順序反了。但攤開權重會看到，輸出層給 L2 的權重是 0，L2 對輸出**完全沒有影響**。它確實存了 x + y，只是這份資訊沒被用到。

probe 說「這裡有這個資訊」，不代表「模型靠這個資訊做決定」。

### 能不能拿來改進模型？

投影片第 23 頁提出一條路：multi-task training，也就是訓練加法的同時，要求某個表徵編碼 z、另一個編碼 x + y。Potts 認為能不能真的誘導出模組化是開放問題，而且就算做到，也還是沒有因果保證。

最後一頁列了 unsupervised probe 的文獻：SVCCA、檢視 attention 權重、[Hewitt and Manning 2019](https://aclanthology.org/N19-1419/) 的線性結構 probe 等。它們通常沒有自己的參數，所以沒有「probe 太強」的問題，但同樣推不出因果。

## Feature attribution：誰對這個預測負責

### 兩條公理

投影片第 27 頁列出 [captum.ai](https://captum.ai) 支援的方法：integrated gradients、gradients、saliency maps、DeepLift、deconvolution、LIME、feature ablation、feature permutation 等等。單元只深入 integrated gradients（IG，[Sundararajan et al. 2017](http://proceedings.mlr.press/v70/sundararajan17a.html)）。[LIME](https://arxiv.org/abs/1602.04938) 也在講次表的閱讀清單上，但投影片只把它列進 captum 的清單，沒有展開。

Potts 喜歡 IG 論文，一半原因是它用公理框住了「好的歸因」該滿足什麼。他講了其中兩條：

- **Sensitivity**：兩個輸入只差在第 i 維、而且預測不同，第 i 維的歸因就必須不是 0。
- **Implementation invariance**：兩個模型的輸入輸出行為完全相同，歸因就要相同，不能受實作細節影響。

### inputs × gradients 的反例

最直覺的 baseline 是 inputs × gradients：對某個特徵求梯度，再乘上該特徵的值。它可以推廣到網路裡任何一個神經元。

投影片第 31 頁引用 IG 論文的反例。模型是 M(x) = 1 − ReLU(1 − x)，所以 M(0) = 0、M(2) = 1。輸入只有一維，輸出又不同，依 sensitivity 這一維必須有非零歸因。可是 inputs × gradients 在 x = 0 時得 0（梯度 1 乘以 0），在 x = 2 時也得 0（梯度 0 乘以 2）。公理被違反了。

另一個概念問題在投影片第 30 頁：分類器的歸因要對**預測標籤**算，還是對**真實標籤**算？模型很準時兩者幾乎一樣。但你分析的常常是一個爛模型，這時兩者就分開了。他刻意只訓練一個 iteration 的淺層分類器，兩種算法得到完全不同的平均歸因。影片 35 的結論是沒有先驗理由偏好哪一邊，只能把假設和方法寫清楚。

### Integrated gradients 怎麼算

IG 的直覺是看反事實版本的輸入。先選一個 baseline（常用全 0 向量），在 baseline 與實際輸入之間插出一串中間點，每個點都算梯度，最後彙總。投影片第 33 頁拆成五步：

1. 產生步數向量 α = [1, …, m]
2. 在 baseline x′ 與實際輸入 x 之間插值
3. 對每個插值點算梯度
4. 用平均近似積分
5. 乘上 (x − x′)，拉回原輸入的尺度

<details>
<summary>公式（投影片第 33 頁）</summary>

IG<sub>i</sub>(M, x, x′) = (x<sub>i</sub> − x′<sub>i</sub>) · (1/m) · Σ<sub>k=1..m</sub> ∂M(x′ + (k/m)·(x − x′)) / ∂x<sub>i</sub>

</details>

回到同一個反例，IG 對 x = 2、baseline 0 的歸因約為 1，反例消失了。影片 35 提到可以證明 IG 滿足 sensitivity。

IG 在實務上的好處是可以對模型裡**任何一層、任何神經元**做歸因，有 probing 的彈性，又有因果保證。投影片第 35–39 頁的完整範例是：用 Hugging Face 的 `cardiffnlp/twitter-roberta-base-sentiment`，配 captum 的 `LayerIntegratedGradients` 對 embedding 層做歸因。baseline 是同長度的 pad token，只保留 CLS 和 SEP。最後用 captum 的視覺化工具上色。

小型 challenge set 用的是 "They said it would be great, and they were right." 和 "…they were wrong." 這類句子。報導動詞 said 與 right／wrong 都拿到明顯歸因，Potts 說這讓人比較放心，覺得模型在用系統性的線索。

他給 feature attribution 的結論是：對表徵的描述只有「OK」的程度，因為你只拿到一個重要度的純量；因果保證有；但沒有一條從 IG 直接改進模型的路。

## 動手：feature_attribution.ipynb 今天跑起來會怎樣

notebook 的內容依序是：InputXGradients 的兩種實作（純 PyTorch 與 captum）、sensitivity 反例（notebook 裡叫 selectivity examples）、`make_classification` 合成資料上的淺層分類器、SST 詞袋分類器的錯誤分析、RoBERTa 範例。

幾件在 repo 裡查得到的事：

- **版本字串是「CS224u, Stanford, Spring 2022」**，比課程網站早一年。
- **captum 不在 `requirements.txt` 裡**，要自己 `pip install captum`。notebook 開頭也寫明這不是必裝套件。
- **SST 那段需要本地資料**：程式讀 `data/sentiment`，停用詞用的是 NLTK 的 stopwords，兩者都要先下載。
- **`get_feature_names()` 會壞**：SST 段落呼叫 `DictVectorizer.get_feature_names()`。`requirements.txt` 只要求 `scikit-learn>=1.0.2`，我在本機的 scikit-learn 1.9.0 上確認這個方法已經不存在，要改成 `get_feature_names_out()`。
- **`ig_reference_implementation` 的插值只在 baseline 為 0 時正確**：它寫的是 `xx = (base + (k/m)) * (x - base)`，標準插值應是 `base + (k/m) * (x - base)`。notebook 裡用的 baseline 剛好都是 0，所以輸出沒錯，但換 baseline 就會算錯。

**怎麼做**：今晚想先摸一次，就只跑 notebook 的前兩段（InputXGradients 與 sensitivity 反例）。只需要 PyTorch 和 captum，不用下載任何資料，就能親眼看到 inputs × gradients 給出兩個 0、IG 給出約 1。

## 這一篇可以確認與不能確認的

可以確認：講次表、投影片內容、三支影片的講述、notebook 在 GitHub 上的現況。不能確認：Quiz 4 考什麼（Canvas 需登入），以及 2023 年課堂上的額外討論（教室錄影在 Panopto）。

延伸閱讀：站上 CS224N 系列也有一篇 [interpretability 導讀](/posts/ai/2026-08-22-cs224n-interpretability)，談的是 Been Kim 的 agentic interpretability，跟這裡的 probing／IG 路線互補。

系列導覽：上一篇 [組合性：COGS、ReCOGS 與 HW3](/posts/ai/2026-09-29-cs224u-compositionality-recogs-hw3)｜下一篇 [解釋方法 II：causal abstraction、IIT 與 DAS](/posts/ai/2026-09-29-cs224u-causal-abstraction-iit-das)

## 參考資料

- [CS224U: Natural Language Understanding（Spring 2023 課程官網與講次表）](https://web.stanford.edu/class/cs224u/)
- [Analysis methods in NLP 投影片（Potts, 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-analysis-2023-handout.pdf)
- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [影片 33：Analysis Methods for NLU, Part 1: Overview](https://www.youtube.com/watch?v=5RZDKW1_HS4)
- [影片 34：Part 2: Probing](https://www.youtube.com/watch?v=lZqsLuAjZ4c)
- [影片 35：Part 3: Feature Attribution](https://www.youtube.com/watch?v=p0dzR6iaFmc)
- [feature_attribution.ipynb（cgpotts/cs224u）](https://github.com/cgpotts/cs224u/blob/main/feature_attribution.ipynb)
- [cgpotts/cs224u requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt)
- [Tenney, Das, and Pavlick 2019：BERT Rediscovers the Classical NLP Pipeline](https://aclanthology.org/P19-1452/)
- [Hewitt and Liang 2019：Designing and Interpreting Probes with Control Tasks](https://aclanthology.org/D19-1275/)
- [Hewitt and Manning 2019：A Structural Probe for Finding Syntax in Word Representations](https://aclanthology.org/N19-1419/)
- [Sundararajan, Taly, and Yan 2017：Axiomatic Attribution for Deep Networks](http://proceedings.mlr.press/v70/sundararajan17a.html)
- [Ribeiro, Singh, and Guestrin 2016："Why Should I Trust You?" Explaining the Predictions of Any Classifier](https://arxiv.org/abs/1602.04938)
- [Captum](https://captum.ai)
