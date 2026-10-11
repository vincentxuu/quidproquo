---
title: "CS224U 組合性泛化：COGS、ReCOGS 與作業三"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, semantic-parsing, benchmark]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 10
tldr: "COGS 有幾個泛化切分幾乎每個模型都是 0 分。CS224U 用自家的 ReCOGS 研究拆解原因：遞迴切分的 0 分主要是長度泛化問題，介系詞片語切分的 0 分來自訓練資料只讓它出現在特定變數與位置。作業三 hw_recogs.ipynb 用 13.5 萬筆 ReCOGS 訓練資料，先要你找出 Charlie 與 Lina 這兩個訓練與測試角色完全相反的名字，再看一個訓練好的模型怎麼栽在它們身上。"
description: "Stanford CS224U（Spring 2023）組合性泛化導讀：組合性原則與系統性、COGS 邏輯形式的四個慣例、ReCOGS 如何把全 0 的結構切分拆成長度與分布問題、三項改寫，以及作業三 hw_recogs.ipynb 的五題結構、配分、唯一規則與所需資源。不提供解答。"
draft: false
glossary:
  - term: "COGS"
    definition: "Kim & Linzen 2020 提出的組合性泛化 benchmark：把合成的英文句子轉成事件語意式的邏輯形式，另有 21 類泛化切分，測模型能否理解熟悉元素的新組合。"
    context: "CS224U 行為評估單元與作業三的起點。"
  - term: "ReCOGS"
    definition: "Wu、Manning 與 Potts 2023 對 COGS 的改寫：移除冗餘符號、加入保留語意的資料擴增、變數改成任意命名，讓評估更接近語意本身。"
    context: "CS224U 作業三使用的資料集。"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-compositionality-recogs-hw3-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 2023 春季版（課程網站最後一次完整公開的校內版）。主要材料是 [Advanced behavioral evaluation 投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf)的 Compositionality 與 (Re)COGS 兩節、[作業三 overview 投影片](https://web.stanford.edu/class/cs224u/slides/cs224u-hw3-overview-2023.pdf)、[hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb)，以及 [XCS224U 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)第 24、27、28 支錄影。repo 現行 notebook 的版本字串是 Spring 2024，本文會標出它和 2023 版的差異。事實皆於 2026-09-29 打開官方材料核對。存取等級 **A3**：題目、資料、訓練好的模型、單元測試與錄影都公開；拿不到的是 Gradescope 自動評分與 bake-off 排行榜。

**系列位置**：上一篇 [行為評估](/posts/ai/2026-09-29-cs224u-behavioral-evaluation)｜下一篇 [解釋方法 I：probing 與 feature attribution](/posts/ai/2026-09-29-cs224u-analysis-probing-attribution)｜[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)

[上一篇](/posts/ai/2026-09-29-cs224u-behavioral-evaluation)的結尾留了一個問題：什麼算公平的非 IID 泛化測試？這一篇用一個具體的 benchmark 回答它。

[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)已經貼過那張 COGS 成績表，重點是 structural 幾欄幾乎全是 0，本文不再重貼數字。這裡要講的是：那些 0 是怎麼來的、ReCOGS 怎麼拆解它們，以及作業三要你做什麼。

## 課程影片來源

下列影片是 Stanford Online 發布的 Spring 2023 對應講次錄影，與本文採用的 2023 年春季版課程一致。2026-10-10 已對照官方播放清單（50 支）比較影片標題與影片 ID。

```youtube
url: https://www.youtube.com/watch?v=g5zwxUqBzN8
title: Stanford XCS224U: NLU I Behavioral Evaluation of NLU Models, Part 3: Compositionality I Spring 2023
```

```youtube
url: https://www.youtube.com/watch?v=tOh-1GYaDl8
title: Stanford XCS224U: NLU I Behavioral Evaluation of NLU Models, Part 4: COGS and ReCOGS I Spring 2023
```

原始影片：[Stanford XCS224U: NLU I Behavioral Evaluation of NLU Models, Part 3: Compositionality I Spring 2023](https://www.youtube.com/watch?v=g5zwxUqBzN8)、[Stanford XCS224U: NLU I Behavioral Evaluation of NLU Models, Part 4: COGS and ReCOGS I Spring 2023](https://www.youtube.com/watch?v=tOh-1GYaDl8)

內容核對：已依字幕核對（2026-10-10）：影片 27（Compositionality）與影片 28（COGS and ReCOGS）的字幕逐項對照：組合性原則與例句、對『無限』的保留、系統性與 mean apple pie 例、歷史回顧、COGS 任務與變數編號等慣例、切分類別、全 0 欄位、bigram 頻率、長度與遞迴的解耦（變數 45／46）、PP 修飾語假說與三種改寫、ReCOGS 三項改寫與四個概念問題，皆吻合。第 24 支作業說明錄影（文中引用但未嵌入）無法取得字幕，其三處說法已標明未核對。

課程與錄影入口：

- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [官方課程／講次來源](https://web.stanford.edu/class/cs224u/)

## 組合性是什麼，為什麼要測它

[第 27 支錄影](https://www.youtube.com/watch?v=g5zwxUqBzN8)從組合性原則的非正式定義開始：

> The meaning of a phrase is a function of the meanings of its immediate syntactic constituents and the way they are combined.

以「every student admired the idea」為例，整句的意義由主語 NP 與述語 VP 決定，NP 又由限定詞與名詞決定，一路遞迴到詞彙。學會詞彙和組合方式，就能理解從沒見過的新組合。

投影片列的動機有四個：替每個有意義的單位建模、「無限」的能力、創造力、系統性。Potts 在錄影裡對「無限」打了折扣：人都是有限的，他認為真正的直覺比較接近創造力，我們今天說的大部分句子，在人類歷史上都沒出現過。

**系統性**來自 Fodor & Pylyshyn 1988：理解「Sandy loves the puppy」的能力，本質上連著理解「The puppy loves Sandy」的能力。Potts 認為系統性比組合性更一般，也是很多挑戰測試背後的直覺。

投影片放了一個他自己的情感模型當反例：

| 句子 | 標準答案 | 模型預測 |
|---|---|---|
| The bakery sells a mean apple pie. | pos | pos |
| They sell a mean apple pie. | pos | pos |
| She sells a mean apple pie. | pos | neg |
| He sells a mean apple pie. | pos | neg |

這裡的 mean 是「很厲害」的意思。讓他擔心的不是錯了兩題，而是主詞從複數換成單數代名詞，照理不該影響 mean 的解讀，預測卻翻了。這就是缺乏系統性。

錄影最後回顧歷史：SHRDLU、Chat-80 這類早期系統是實作出來的符號文法，組合性是設計保證；Percy Liang 的語意剖析學的是組合文法規則的權重；Socher 的遞迴樹狀網路雖然不是符號系統，也照著句法樹一層層組合向量。到了今天的 Transformer，一切都互相連接，**沒有任何組合性保證**。問題於是變成：能不能設計行為測試，判斷這些模型是否自己找到了系統性的解法？

## COGS：任務與邏輯形式的四個慣例

[COGS（Kim & Linzen 2020）](https://aclanthology.org/2020.emnlp-main.731/) 的輸入是合成的英文句子，輸出是事件語意式的邏輯形式（LF）。投影片的例子：

```text
Input:  A rose was helped by a dog .
Output: rose ( x _ 1 ) AND help . theme ( x _ 3 , x _ 1 )
        AND help . agent ( x _ 3 , x _ 6 ) AND dog ( x _ 6 )
```

[第 28 支錄影](https://www.youtube.com/watch?v=tOh-1GYaDl8)說，COGS LF 有幾個特性，正好能解釋文獻裡的成績模式。投影片列了四條：

1. 動詞指定基本事件，事件有必要或可選的角色（agent、theme 等）。
2. **變數編號由詞在輸入句中的線性位置決定。** `x _ 3` 之所以是 3，是因為 helped 在句子第 3 個位置。
3. 所有變數都被約束；看起來自由的變數，視為在最寬的範圍被存在量詞約束。
4. 定冠詞描述用 `*` 標記。

第 2 條是關鍵。錄影說，這個特性會嚴重影響現代模型的表現，特別是帶位置編碼的模型。

COGS 的切分是：訓練 24,000 筆加 155 個 primitives、dev 10,000、test 10,000，以及 21,000 筆泛化例子，分成 21 類。dev 與 test 都是 IID；真正有意思的是泛化切分。錄影舉了幾類：名詞從主語換到其他位置、原本只以單詞出現的 primitive 放進完整句子、修飾語從受詞位置換到主語位置、更深的遞迴、主被動轉換等。

## ReCOGS 怎麼拆解那些 0

[ReCOGS（Wu, Manning & Potts 2023）](https://arxiv.org/abs/2303.13716)的摘要把立場講得很直接：

> COGS poses generalization splits that appear impossible for present-day models, which could be taken as an indictment of those models. However, we show that the negative results trace to incidental features of COGS LFs.

投影片把拆解分成三步。

**第一步，移除冗餘符號。** 每個變數都以 `x _` 開頭，真正有區別的只有後面的數字。把 `kitten ( x _ 1 )` 改成 `kitten ( 1 )`，語意完全不變。錄影用 bigram 頻率解釋為什麼這有差：在 COGS 裡，最常見的 bigram 壓倒性地是「, x」；移除之後，最常見的專有名詞 Emma 跟變數的頻率變得差不多，分布平均很多。語言模型高度依賴局部條件機率，這對它們比較友善。但這一步主要幫到詞彙泛化，對那幾個頑固的結構切分幫助不大。

**第二步，CP 與 PP 遞迴的 0 分，其實是長度問題。** 泛化切分裡的句子與 LF 都比訓練資料長得多，有很長的尾巴。模型在測試時會碰到訓練時沒見過的位置，也會碰到沒見過的變數名：訓練最長只到變數 45，測試出現 46，那個 token 的向量從來沒被訓練過。Potts 說要求模型做長度泛化完全合理，但這裡的目標是測遞迴，現在兩件事纏在一起。ReCOGS 的做法是把既有例子串接起來、依 COGS 規則重新編號，讓訓練資料涵蓋測試時會出現的變數名。結果 LSTM 與 Transformer 都幾乎完全克服這個切分。錄影的結論是：這個切分難的不是遞迴，是長度泛化。

**第三步，PP 修飾語的 0 分，是訓練分布教錯了東西。** 投影片寫的假設是：

> The train data teach the model that PPs occur only with a specific set of variables and positions. When models learn this lesson, they struggle with examples that contradict it.

為了驗證，他們用保留語意的方式讓介系詞片語出現在更多位置：把受詞前置（The box in the tent Emma was lent）、隨機插入「um」這類停頓詞、改用分詞修飾（A leaf painting the spaceship froze）。LSTM 與 Transformer 的表現都大幅上升。

最後，ReCOGS 做了三項改寫：冗餘符號移除、保留語意的資料擴增、**任意變數命名**（變數不再綁定輸入位置，而是以語意一致的方式隨機指派）。同一句「The sailor saw Emma」在兩種格式下長這樣：

```text
ReCOGS: * sailor ( 48 ) ; Emma ( 53 ) ; see ( 10 ) AND
        agent ( 10 , 48 ) AND theme ( 10 , 53 )
COGS:   * sailor ( x _ 1 ) ; see . agent ( x _ 2 , x _ 1 ) AND
        see . theme ( x _ 2 , Emma )
```

錄影強調，ReCOGS **不一定比較簡單**，某些面向在他們的實驗裡反而更難。它做到的是讓詞彙與結構兩類泛化的表現變得平均，讓原本毫無進展的結構切分可以被推動。投影片的措辭是 ReCOGS remains challenging。

### 還沒解決的四個概念問題

投影片 (Re)COGS 一節的最後一頁列了四個問題：

1. 如果我們預測的是邏輯形式，要怎麼測「意義」？錄影說 LF 本身也只是另一種句法表達，總帶著任意性。
2. 在這個脈絡下，什麼是公平的泛化測試？模型看到的世界有某些限制，有些限制我們希望它**不要**學，有些又希望它學；光是判斷每個現象屬於哪一類就很難。
3. 人類組合性的極限在哪裡，該怎麼影響泛化測試的設計？
4. 如果我們的目標超出資料集能支持的範圍，該怎麼把它寫進任務與模型？

這四題直接接到[上一篇](/posts/ai/2026-09-29-cs224u-behavioral-evaluation)講的「不公平題目」。

## 作業三：hw_recogs.ipynb

2023 年講次表把作業三 overview 排在 4 月 26 日，跟行為評估那堂同一天；作業、bake-off 與 Quiz 3 在 5 月 8 日下午 3 點（Pacific）截止。

資料是 ReCOGS，overview 投影片列的切分：

- 訓練：135,546 組輸入輸出
- dev：3,000 組，跟訓練同分布
- gen：21,000 筆，21 類，都是熟悉元素的新組合

gen 的類別名稱有規律：`X_to_Y` 或 `only_seen_as_X_as_Y`，意思是某些片語在訓練時只以 X 出現，測試時以 Y 出現。

整份作業只有一條規則，notebook 開頭與原創系統題各寫一次：

> You cannot train your system on any examples from `dataset["gen"]`, nor can the output representations from those examples be included in any prompts used for in-context learning.

### 題目與配分

| 題目 | 內容 | 配分 |
|---|---|---|
| Q1 Task 1 | `get_propername_role`：從 LF 抽出（名字, 角色）配對 | 1 |
| Q1 Task 2 | `find_name_roles`：統計每個名字在某切分裡扮演哪些角色 | 1 |
| Q2 | `category_assess`：用訓練好的模型評估某一類泛化切分 | 2 |
| Q3 | 用 DSPy 做 in-context learning（Task 1 基本模組、Task 2 `LabeledFewShot`） | 2 |
| Q4 | 原創系統 | 3 |
| Q5 | bake-off 參賽 | 1 |

**Q1 是純資料分析，不訓練模型。** overview 投影片直接給了劇透：Charlie 在訓練集只當 theme，在泛化集只當 agent；Lina 在訓練集只當 agent，在泛化集只當 theme。

**Q2 之前有一段很長的建模插曲。** notebook 把訓練 ReCOGS 模型需要的六個元件都給你：Hugging Face tokenizer、PyTorch Dataset、`EncoderDecoderModel.from_pretrained("ReCOGS/ReCOGS-model")`、`RecogsLoss`、`RecogsModule`、`RecogsModel`。不打算自己訓練的話，只要把最後一個當介面用。Potts 在[第 24 支錄影](https://www.youtube.com/watch?v=e73Ch08XhX0)說，tokenizer 原本要出成作業題，但他自己寫得太痛苦，決定直接給。（此點出自第 24 支作業說明錄影，本站未讀其字幕，未核對。）

Q2 用這個訓練好的模型延續 Q1 的分析，你會親眼看到：一個很好的模型，錯得最多的正是那些出現在陌生位置的名字。

Q2 用的評分函式 `recogs_exact_match` 有三條規則，notebook 各給一個例子：

- 約束變數的名字不重要：`dog ( 4 ) AND happy ( 4 )` 等於 `dog ( 7 ) AND happy ( 7 )`
- 合取項的順序不重要：`dog ( 4 ) AND happy ( 4 )` 等於 `happy ( 7 ) AND dog ( 7 )`
- 變數的一致性重要：`dog ( 4 ) AND happy ( 4 )` 不等於 `dog ( 4 ) AND happy ( 7 )`

**Q3 換成 in-context learning。** 錄影預告了一個現象：大型語言模型預測的 LF 乍看都像樣，但一跑評分，可能一題都沒對。這個任務要求完全正確，「看起來差不多」不算。（此點出自第 24 支作業說明錄影，本站未讀其字幕，未核對。）

**Q4 原創系統**，overview 投影片列的方向有：DSPy 程式、繼續訓練課程的模型、拿預訓練模型來微調、從頭訓練、甚至符號求解器。notebook 附了 T5 的起始程式；錄影說直接拿 T5 來預測，它會把句子翻成德文，得先在 ReCOGS 上微調。（此點出自第 24 支作業說明錄影，本站未讀其字幕，未核對。）

**Q5 bake-off**：在 `cs224u-recogs-test-unlabeled.tsv` 加一欄 `prediction`，存成 `cs224u-recogs-bakeoff-entry.tsv` 上傳。

### 2023 版與 repo 現行版的差異

題目結構與配分兩版相同，差在 Q3 的工具。[2023 年 6 月的 notebook 快照](https://github.com/cgpotts/cs224u/blob/89bdd14820b5/hw_recogs.ipynb)用的是 DSP：寫一個 `@dsp.transformation` 函式 `recogs_dsp`，自己抽樣示範例、套模板。2024-01-28 一筆「Updating to switch from DSP to DSPy」的 commit 之後，Q3 改成寫一個 `dspy.Module` 加 `LabeledFewShot`。

### 需要什麼資源

- **資料**：[recogs.tgz](https://web.stanford.edu/class/cs224u/data/recogs.tgz)，2026-09-29 HTTP 200，7,075,025 bytes。
- **模型**：[ReCOGS/ReCOGS-model](https://huggingface.co/ReCOGS/ReCOGS-model) 在 Hugging Face 上公開、未設存取限制，最後修改於 2023-04-18。
- **運算**：Q1 只要 pandas 與正規表示式。Q2 跑一類泛化切分的預測，notebook 註解說在較新的 Apple 筆電上約 3 分鐘，Colab 視機器而定。
- **API**：只有 Q3 需要。現行版預設 `dspy.OpenAI(model='gpt-3.5-turbo', ...)`，跟作業二一樣要 OpenAI key，也一樣受 `dspy-ai==2.4.13` 釘版影響（DSPy 3.x 已經沒有 `dspy.OpenAI`，細節見[作業二那篇](/posts/ai/2026-09-29-cs224u-hw2-openqa-dspy)）。

## 自學怎麼做

1. 先看第 27、28 支錄影，再做作業。Q1 與 Q2 的「發現」其實就是 ReCOGS 論文的論點縮小版，先懂論點，作業才不會只是寫正規表示式。
2. Q1 做完，把 Charlie 與 Lina 的角色分布印出來，自己判斷：這算公平的泛化測試嗎？對照上一節第 2 個概念問題。
3. 原創系統如果選 DSPy 路線，先用 10 題 dev 樣本加 `recogs_exact_match` 驗證輸出格式，確定不是 0 分再往下。

今晚可以做的一件事：下載 7 MB 的 recogs.tgz，用 pandas 讀進 `train.tsv` 與 `gen.tsv`，數一數 Charlie 在兩個檔案裡各出現在哪些角色。這一步不需要 GPU，也不需要 API key，卻能讓你在寫任何模型之前，先看到這個 benchmark 真正在測的東西。

## 延伸閱讀

- COGS 成績表與課程狀態：[Stanford CS224U 導讀（系列總覽）](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)
- 評估設計的一般原則：[CS224N 第 11 講：Benchmark 與 LLM 評估為什麼會過期](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。依官方播放清單逐講核對影片 ID 與講次，確認無誤，影片標題改用原標題。
- 2026-10-10：依字幕核對影片內容。字幕核對影片 27、28 皆吻合；引用但未嵌入的第 24 支錄影無法取得字幕，三處相關說法標明未核對。

## 參考資料

- [CS224U 課程官網（Spring 2023）](https://web.stanford.edu/class/cs224u/) — 4 月 26 日講次、作業三截止時間、COGS 與 ReCOGS readings
- [Advanced behavioral evaluation 投影片（Spring 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) — 組合性定義、mean apple pie 例、COGS LF 四條慣例與切分、ReCOGS 三步拆解、四個概念問題
- [作業三 overview 投影片（Spring 2023）](https://web.stanford.edu/class/cs224u/slides/cs224u-hw3-overview-2023.pdf) — ReCOGS 切分數量、gen 類別例子、Charlie 與 Lina 劇透、建模插曲六元件、原創系統方向
- [錄影 24：Homework 3 overview（XCS224U, Spring 2023）](https://www.youtube.com/watch?v=e73Ch08XhX0) — 作業逐題說明、`recogs_exact_match` 三條規則、LLM 看似正確卻 0 分的提醒
- [錄影 27：Compositionality](https://www.youtube.com/watch?v=g5zwxUqBzN8) — 組合性原則、系統性、歷史回顧
- [錄影 28：COGS and ReCOGS](https://www.youtube.com/watch?v=tOh-1GYaDl8) — bigram 頻率、長度與遞迴的解耦、PP 修飾語假設、概念問題
- [hw_recogs.ipynb（repo 現行版）](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb) — 題目、配分、唯一規則、資源需求
- [hw_recogs.ipynb（2023 年 6 月 DSP 版快照）](https://github.com/cgpotts/cs224u/blob/89bdd14820b5/hw_recogs.ipynb) — Spring 2023 的 Q3 寫法
- [hw_recogs.ipynb 的 commit 歷史](https://github.com/cgpotts/cs224u/commits/main/hw_recogs.ipynb) — 2023-04-22 初版與 2024-01-28 改寫
- [ReCOGS 資料 recogs.tgz](https://web.stanford.edu/class/cs224u/data/recogs.tgz) — 2026-09-29 仍可下載
- [ReCOGS/ReCOGS-model（Hugging Face）](https://huggingface.co/ReCOGS/ReCOGS-model) — 作業提供的訓練好模型
- [Kim & Linzen, COGS: A Compositional Generalization Challenge Based on Semantic Interpretation（EMNLP 2020）](https://aclanthology.org/2020.emnlp-main.731/)
- [Wu, Manning & Potts, ReCOGS（arXiv:2303.13716）](https://arxiv.org/abs/2303.13716) — 摘要原文
- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) — 本系列對應的公開錄影
