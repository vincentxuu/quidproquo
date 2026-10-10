---
title: "CS224U 作業一：多領域情感分析與 bake-off"
date: 2026-09-29
category: ai
type: guide
tags: [cs224u, ai-course, stanford, nlp, homework, fine-tuning]
lang: zh-TW
series:
  name: "Stanford CS224U 導讀"
  order: 5
tldr: "CS224U 第一份作業 hw_sentiment.ipynb 是三分類情感分析：用 DynaSent 兩輪加 SST-3 開發，bake-off 測試集混入來源不明的 mystery 句子。9 分作業裡，原創系統一題占 3 分，規則只有一條：開發過程不准碰三份公開測試集。今天照原樣跑，第一個資料載入 cell 就會卡在 Hugging Face datasets 4.0 拿掉 trust_remote_code 這件事上。"
description: "Stanford CS224U（Spring 2023）作業一導讀：hw_sentiment.ipynb 的四個 Question 與配分、DynaSent 與 SST-3 的角色、bake-off 測試集組成與 honor code、政策頁對「原創系統」的評分規則、需要的運算資源，以及 2026 年自學時會遇到的 datasets 相容性問題。不提供解答。"
draft: false
glossary:
  - term: "bake-off"
    aliases: ["bakeoff"]
    definition: "CS224U 每份作業附帶的全班競賽：大家用自己的原創系統預測同一份沒有標籤的測試資料，由助教統一計分並公布排行。"
    context: "作業一的 bake-off 檔有 3,000 句，參賽本身就值 1 分。"
  - term: "macro-F1"
    aliases: ["macro-average F1", "macro avg F1"]
    definition: "先分別算每個類別的 F1，再取平均，不看各類別的樣本數多寡。"
    context: "notebook 明寫這是課程預設指標，因為在 NLP 裡小類別往往跟大類別一樣重要；它也不鼓勵用 accuracy。"
  - term: "DynaSent"
    definition: "Potts 等人建立的英文三分類（positive／negative／neutral）情感 benchmark，分兩輪收集，每句都由五位群眾標注者驗證。"
    context: "作業一的主要訓練與開發資料。"
    links:
      - label: "DynaSent (ACL 2021)"
        url: "https://aclanthology.org/2021.acl-long.186/"
---

> 🌏 [English version](/posts/ai/2026-09-29-cs224u-hw1-multidomain-sentiment-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依據 [CS224U](https://web.stanford.edu/class/cs224u/) 2023 春季版（課程網站最後一次完整公開的校內版）。作業 notebook 在 [GitHub repo](https://github.com/cgpotts/cs224u) 仍可取得，事實皆於 2026-09-29 打開官方材料核對。存取等級 **A3**：題目、資料、單元測試、原創系統規則與 overview 錄影都公開，足以自學；拿不到的是 Gradescope 自動評分、bake-off 排行榜與助教的結果報告。

**系列位置**：上一篇 [上下文表徵 II：模型家族](/posts/ai/2026-09-29-cs224u-contextual-reps-model-families)｜下一篇 [資訊檢索](/posts/ai/2026-09-29-cs224u-information-retrieval)｜[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)

前兩篇講完 Transformer 與它的模型家族，這一篇把那些東西放進一份真的要交的作業裡。[hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb) 要你做三分類情感分析（positive、negative、neutral），目標寫在第一段：做出**在多個領域都能準確預測**的系統。

它是整門課作業節奏的樣板。Potts 在 [作業一 overview 錄影](https://www.youtube.com/watch?v=PzvvtyK0QOk) 開頭就說，後面每份作業都照同樣的節奏與想法設計。所以這份的結構值得先看懂。

本文只講題目結構、配分、需要的資源，以及今天照原樣跑會卡在哪。**不提供任何題目的解答。**

## 課程影片來源

下列影片是 Stanford Online 發布的 Spring 2023 對應講次錄影，與本文採用的 2023 年春季版課程一致。2026-10-10 已對照官方播放清單（50 支）核對標題與影片 ID。

```youtube
url: https://www.youtube.com/watch?v=PzvvtyK0QOk
title: Stanford XCS224U: Natural Language Understanding I Homework 1 I Overview: Bake Off
```

原始影片：[Stanford XCS224U: Natural Language Understanding I Homework 1 I Overview: Bake Off](https://www.youtube.com/watch?v=PzvvtyK0QOk)

課程與錄影入口：

- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp)
- [官方課程／講次來源](https://web.stanford.edu/class/cs224u/)

## 它在課程裡的位置

2023 年的講次表把作業一放在第一個單元「Domain adaptation for supervised sentiment」底下。4 月 5 日那堂列著「Overview of Assign/bakeoff 1」，但這一項**沒有投影片連結**，公開的只有 YouTube 上那支 overview 錄影。作業與 bake-off 在 4 月 17 日下午 3 點截止，同一時間要交 Quiz 0 與 Quiz 1（Canvas 上，校外拿不到）。

同一單元的 readings 裡，跟作業直接相關的是兩篇資料集論文：[SST（Socher et al. 2013）](https://aclanthology.org/D13-1170/) 與 [DynaSent（Potts, Wu et al.）](https://aclanthology.org/2021.acl-long.186/)。

如果你對 scikit-learn、PyTorch 或監督式情感分析還不熟，overview 錄影建議先補課程網站上的背景材料。這些集中在 [Background materials 頁](https://web.stanford.edu/class/cs224u/background.html)，收的是 CS224N 已經教過、CS224U 不再上課的內容，包括 `sst_*` 系列 notebook。

## 三份開發資料，一份沒看過的測試

notebook 給你三份資料做訓練與開發：

| 資料 | 來源 | notebook 的描述 |
|---|---|---|
| DynaSent Round 1 | [Yelp Academic Dataset](https://www.yelp.com/dataset) 的自然句 | 挑出騙過當時頂尖情感模型、但人類覺得直觀的句子；模型只用來啟發式地找例子，全部由群眾標注者多重標注 |
| DynaSent Round 2 | 在 [Dynabench](https://dynabench.org) 平台上收集 | 群眾標注者改寫 Yelp 句子，要達成指定情感、同時騙過頂尖模型；另由其他標注者驗證 |
| SST-3 | Rotten Tomatoes 影評 | 原本是五分類；notebook 用 Hugging Face 上的 `SetFit/sst5` 載入，再轉成三分類 |

DynaSent 論文摘要寫的總量是 121,634 句，每句由五位群眾標注者驗證，而且開發與測試切分**刻意設計成讓當時最好的模型只拿到隨機水準**。這就是這份作業叫「多領域」的原因：同樣是情感，Yelp 餐廳評論、對抗式改寫句與影評是三種不同的分布。

SST 有一個 notebook 特別提醒的性質：它同時有**片語層級**與句子層級的標籤。作業只用句子標籤，但原創系統可以用片語標籤，前提是你去 [SST 專案頁](http://nlp.stanford.edu/sentiment/) 拿原始資料，因為 Hugging Face 的版本沒有這些標籤。

bake-off 的測試集由三部分組成：DynaSent 的測試句、SST-3 的測試句，以及一批**來源不告訴你的 mystery 句子**。bake-off 檔案（[cs224u-sentiment-test-unlabeled.csv](https://web.stanford.edu/class/cs224u/data/cs224u-sentiment-test-unlabeled.csv)）在 2026-09-29 仍可下載，只有 `example_id` 與 `sentence` 兩欄，共 3,000 句。

### 一條靠 honor code 維持的規則

DynaSent 與 SST-3 的測試集早就公開了，標籤誰都拿得到。notebook 用粗體寫了一段方法論說明：開發過程完全不准用這些測試集，最後只在測試集上評估**一次**，交出結果，之後不准再調系統或重跑。

Potts 在錄影裡講得更重：拿測試集做任何模型選擇，是這個領域的「sin」。mystery 句子課程可以保密，公開測試集就只能靠大家自律。這條規則後來也原封不動寫進原創系統那題。

## 題目結構與配分

四個 Question，合計 9 分作業加 1 分 bake-off 參賽：

| Question | 內容 | 配分 |
|---|---|---|
| Q1 Linear classifiers | Task 1 用 NLTK `TweetTokenizer` 寫特徵函式；Task 2 補完 `train_linear_model`；Task 3 補完 `assess_linear_model` | 各 1 分 |
| Q2 Transformer fine-tuning | Task 1 用 tokenizer 做批次 tokenization；Task 2 取出 [CLS] 上方的最終隱藏狀態；Task 3 補完一個 `nn.Module` 微調模組 | 各 1 分 |
| Q3 Your original system | 自己設計三分類情感模型 | 3 分 |
| Q4 Bakeoff entry | 用原創系統預測 bake-off 檔，加一欄 `prediction` 後上傳 | 1 分 |

幾個讀題時該知道的設計：

**每題都附單元測試。** Potts 在錄影裡說，這在全課程每份作業都一樣。用英文很難把「我們要的程式」講到毫無歧義，所以課程改用單元測試定義：通過測試，就算照課程的定義完成了該題，自動評分也會過。

**Q1、Q2 都先有 background 小節才進 task。** Q1 有四段 background（特徵函式、`DictVectorizer` 向量化、scikit-learn 模型、分類器評估），Q2 有 tokenization、representation、masking 三段。錄影建議不管熟不熟都先做完 background 再動手，而且 task 刻意寫得不難，重點是讓你手上多一個之後開發原創系統用得到的工具函式。

**課程預設指標是 macro-F1。** notebook 的理由是：NLP 裡小類別常跟大類別一樣重要，甚至更重要。它也明講不鼓勵 accuracy，連 scikit-learn 分類器的 `score` 方法（預設是 accuracy）都建議不要用。

**Q2 用的是 BERT-mini。** 權重是 Hugging Face 上的 [`prajjwal1/bert-mini`](https://huggingface.co/prajjwal1/bert-mini)，每個 token 的表徵是 256 維。notebook 的說法是先用小模型快速做原型，之後再考慮換大模型。

## 原創系統那題到底在評什麼

Q3 是這份作業最重的一題，也是整門課三份作業共用的結構。notebook 列了四個方向讓你參考：換 Hugging Face 上別的預訓練模型、換微調方式（例如不用 [CLS]，改對所有輸出狀態做 pooling）、同時用三份訓練集或加入其他情感資料，或者完全不同的做法。

規則只有一條，粗體：**開發期間任何時候都不准用 DynaSent-R1、DynaSent-R2、SST-3 的測試集**。開發集可以用，而且鼓勵用。

評分標準寫在 [政策頁](https://web.stanford.edu/class/cs224u/requirements.html)：

- 從網路下載程式碼、重訓、送出不算原創，**就算 bake-off 分數很高也一樣**。可以在別人的程式碼上做，但要做出新的、有意義的東西。
- 很有創意、動機清楚的系統，就算在 bake-off 資料上表現不好，也給滿分。
- 其他系統依助教判斷給部分分數，扣分會在回饋裡說明理由。

錄影補了一個實務細節：原創系統的描述與程式碼要寫在 notebook 指定儲存格的 `START COMMENT` 與 `STOP COMMENT` 兩行之間，不能刪改這兩行。自動評分器靠這兩行跳過你的程式碼（它沒有你用的套件），放錯位置可能讓整份評分失敗。

那段文字描述也不是形式。Potts 說，如果你試了很多方向、最後選了一個看起來很簡單的系統，**只有寫下來才拿得到那些探索的分數**。

bake-off 的計分規則在 notebook 最後：參賽拿 1 分，最高分的系統再加 0.5 分，但助教會自己重跑前幾名，**重現不了的不給加分**。遲交可以收，拿不到加分。notebook 也要求你不能依據 bake-off 檔的內容調系統，頂多檢查一下它是不是你預期的格式。

## 需要什麼運算資源

| 部分 | 需求 |
|---|---|
| Q1 | 純 CPU。notebook 說在 DynaSent R1 上訓一個 unigram 邏輯迴歸模型，CPU 上應該幾分鐘內跑完 |
| Q2 三個 task | 只需要載入 BERT-mini、寫函式、過單元測試，不需要真的訓練模型 |
| 選用的 classifier interface 示範訓練 | notebook 明寫**不要在 CPU 上跑**；在有 GPU 的 Colab 上大約一小時 |
| Q3 原創系統 | 取決於你選的做法 |

不需要付費 API。這一點跟作業二不同，作業二要 OpenAI API key 與 ColBERT 索引，[系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding) 有詳細說明。

## 2026 年自學會卡在哪

**第一個資料載入 cell 就可能跑不起來。** notebook 用 `load_dataset("dynabench/dynasent", ..., trust_remote_code=True)` 載入兩輪 DynaSent。2026-09-29 查 Hugging Face，`dynabench/dynasent` 這個 repo 仍然只有一支載入腳本 `dynasent.py`（最後修改 2021-04-29），沒有 parquet 版本；它的 [parquet 端點](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) 仍回應「runs arbitrary Python code」。[datasets 4.0.0 的 release note](https://github.com/huggingface/datasets/releases/tag/4.0.0) 則寫著 `trust_remote_code` 不再支援。

repo 的 [requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt) 對 `datasets` 只寫 `>=2.14.6`，沒有上限，新環境會裝到最新版。完整的查證過程在 [系列總覽](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding) 的「自學者實際拿得到什麼」一節，這裡不重寫。

兩條可行的繞路，**我都沒有實際跑過**：

1. 把 `datasets` 降到 4.0 以前的版本。
2. 不走 Hugging Face。DynaSent 作者的 [GitHub repo](https://github.com/cgpotts/dynasent) 直接附了 `dynasent-v1.1.zip`，README 列出兩輪各自的 train/dev/test JSONL 檔。改用這份檔案時，要自己把欄位對齊 notebook 期望的 `sentence` 與 `gold_label`。

SST 那一側的風險看起來比較小：`SetFit/sst5` 在 Hub 上是純資料檔（`train.jsonl`、`dev.jsonl`、`test.jsonl`），沒有載入腳本。這個資料集本身不需要執行遠端程式碼；notebook 仍對它傳了 `trust_remote_code=True`，新版 `datasets` 遇到這個參數會怎麼處理，我沒有測。

**版本字串與網站一致。** 這份 notebook 標的是 `CS224u, Stanford, Spring 2023`，跟課程網站同一學期（另外兩份作業不是，見總覽附錄）。

**拿不到的東西**：Gradescope 自動評分器、bake-off 排行榜，以及 Potts 在錄影結尾提到的那份「助教回顧大家做了什麼、什麼有效什麼沒效」的報告。他說那份報告是整個過程裡最有收穫的部分，但它沒有公開。

## 自學怎麼做

1. 先處理資料載入（上一節的兩條路擇一），確認三份資料的標籤分布印得出來。
2. 自己把三份資料的**開發集**當成評估基準，測試集從頭到尾不打開。bake-off 的 mystery 句子你拿不到答案，這一步是唯一能模擬「沒看過的分布」的方式。
3. 照順序做 Q1、Q2 的 background 與 task，用單元測試確認完成。
4. 原創系統先寫下一句假設（例如「對所有輸出狀態做 mean pooling 會比只用 [CLS] 好」），再動手。這是政策頁評分真正看的東西，也是後面期末專案 [projects.md](https://github.com/cgpotts/cs224u/blob/main/projects.md) 要求的思考方式。

今晚可以做的一件事：打開 notebook，只讀 Question 3 那一格的四個方向，挑一個寫成一句可以被開發集推翻的假設。

## 延伸閱讀

- 課程狀態、三份作業總覽與環境坑：[Stanford CS224U 導讀（系列總覽）](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)
- 預訓練與微調的基礎：[CS224N 第 7 講：預訓練、subword 與 in-context learning](/posts/ai/2026-08-22-cs224n-pretraining)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。依官方播放清單逐講核對影片 ID 與講次，確認無誤，影片標題改用原標題。

## 參考資料

- [CS224U 課程官網（Spring 2023）](https://web.stanford.edu/class/cs224u/) — 講次表、作業一截止時間、單元 readings
- [hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb) — 題目、配分、資料載入方式、原創系統與 bake-off 規則
- [作業一 overview 錄影（XCS224U, Spring 2023）](https://www.youtube.com/watch?v=PzvvtyK0QOk) — 單元測試、START/STOP 儲存格與文字描述的用意
- [CS224U Policies and requirements](https://web.stanford.edu/class/cs224u/requirements.html) — 原創系統的評分準則
- [CS224U Background materials](https://web.stanford.edu/class/cs224u/background.html) — scikit-learn、PyTorch 與監督式情感分析的背景材料
- [Potts, Wu, Geiger & Kiela, DynaSent: A Dynamic Benchmark for Sentiment Analysis (ACL 2021)](https://aclanthology.org/2021.acl-long.186/) — 資料總量、五人驗證、隨機水準的切分設計
- [cgpotts/dynasent GitHub repo](https://github.com/cgpotts/dynasent) — `dynasent-v1.1.zip` 與 JSONL 檔案清單
- [Socher et al., Recursive Deep Models for Semantic Compositionality Over a Sentiment Treebank (EMNLP 2013)](https://aclanthology.org/D13-1170/) — SST 原始論文
- [Stanford Sentiment Treebank 專案頁](http://nlp.stanford.edu/sentiment/) — 含片語層級標籤的原始資料
- [bake-off 測試檔 cs224u-sentiment-test-unlabeled.csv](https://web.stanford.edu/class/cs224u/data/cs224u-sentiment-test-unlabeled.csv) — 2026-09-29 仍可下載，3,000 句
- [requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt) — `datasets>=2.14.6` 未設上限
- [Hugging Face datasets 4.0.0 release notes](https://github.com/huggingface/datasets/releases/tag/4.0.0) — `trust_remote_code` 不再支援
- [Hugging Face API：dynabench/dynasent parquet 端點](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) — 沒有 parquet 版本的證據
- [XCS224U Spring 2023 YouTube 播放清單](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) — 本系列對應的公開錄影
