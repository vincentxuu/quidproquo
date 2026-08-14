---
title: "讀 X 開源的推薦演算法：權重公開了，攻略文的數字卻還停在 2023 年"
date: 2026-08-14
category: ai
type: deep-dive
tags: [recommendation, ranking, ai-transparency, open-source, algorithm]
lang: zh-TW
tldr: "xAI 在 2026-08-13 首次公開 X For You 的排序權重：reply 5.0、favorite 0.5、report −234.0。網路流傳的「reply 是 like 的 27 倍」是 2023 年舊 repo 的數字，現行模型連那個預測頭都不存在。"
description: "從原始碼讀 xai-org/x-algorithm：三次發佈的實際差異、Phoenix 排序模型架構、完整權重表，以及公開權重為什麼沒有讓系統變得可稽核。"
draft: false
glossary:
  - term: "candidate isolation"
    aliases: ["候選隔離"]
    definition: "推論時用注意力遮罩讓候選項目之間無法互相 attend，只能 attend 到使用者脈絡，使每則貼文的分數與同批候選無關。"
    definition_en: "An attention mask that prevents candidate items from attending to each other during inference, so each item's score depends only on the user context, not on which other items are in the batch."
    advanced: "代價是放棄 slate 級最佳化（無法讓模型考慮版面整體組合），換來分數可快取、可重現。"
    context: "本文用它說明 Phoenix 排序模型為什麼分數穩定。"
  - term: "semantic ID"
    aliases: ["語意 ID", "SID"]
    definition: "把內容的多模態 embedding 做殘差量化（X 用 6 層 × 256 codes），得到一組離散代碼當作物件識別，相近主題的內容會共享前綴。"
    definition_en: "Discrete codes obtained by residual-quantizing an item's multimodal embedding (X uses 6 levels x 256 codes), used as the item identity; similar content shares code prefixes."
    advanced: "相對於純 hash ID，語意 ID 讓模型對沒見過的新內容也有內容層面的泛化能力。"
    context: "本文用它說明 X 的召回階段怎麼表示貼文。"
  - term: "visibility filtering"
    aliases: ["可見度過濾"]
    definition: "獨立於排序的一套規則系統，針對每一組（貼文、觀看者）回答顯示、擋在警示頁後、或直接不顯示。"
    definition_en: "A rule system separate from ranking that answers, for each post-viewer pair, whether to allow, show behind an interstitial, or drop."
    context: "本文用它說明 X 2026 年 8 月開源的重點其實不在排序。"
---

> 🌏 [English version](/posts/ai/2026-08-14-x-algorithm-open-source-en)

先講兩個數字。

網路上關於 X 演算法最常被引用的說法是「一則 reply 的權重是 like 的 27 倍」。而 [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) 在 2026-08-13 首次公開的 `home-mixer/params/param.rs` 裡，這兩個數字寫得清清楚楚：`FavoriteWeight` 是 0.5，`ReplyWeight` 是 5.0。比值是 10。

27 這個數字不是錯的——它是 [twitter/the-algorithm](https://github.com/twitter/the-algorithm)，也就是 2023 年那次開源的舊值。三年過去，整套系統從 Scala 重寫成 Rust 加 JAX，模型換成 Grok 系的 transformer，而攻略文還在轉載同一張表。

這篇是把 repo clone 下來逐段讀完之後的整理：三次發佈到底各給了什麼、排序實際怎麼算、哪些流傳的數字對不上，以及一個比較不舒服的結論——權重公開了，系統反而沒有變得更容易稽核。

## 三次發佈，規模差了兩個數量級

repo 的 git 歷史只有 5 個 commit，全部由 CI agent 產出，訊息一模一樣。但 `--stat` 說了實話：

| 發佈日 | 檔案變動 | 新增行數 | 內容 |
|---|---|---|---|
| 2026-01-20 | 79 | 8,816 | 4 個目錄：`home-mixer`、`phoenix`、`thunder`、`candidate-pipeline` |
| 2026-05-15 | 187 | 18,263 | 加入 Grox 內容理解、廣告混排、新候選來源 |
| 2026-08-13 | **2,053** | **363,246** | 權重、可見度過濾、安全標籤鏈、Phoenix 生產訓練程式碼 |

[TechCrunch 報導](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned)這次「讓程式碼庫大了約 10 到 15 倍」，跟 git 對得上。

比規模更值得看的是**前兩次少了什麼**。1 月與 5 月的版本裡，`ranking_scorer.rs` 已經在呼叫 `params.get(FavoriteWeight)`，但 `home-mixer/params/` 這個目錄根本不在 repo 裡。程式碼看得到、數值看不到。[Engadget 在 2 月訪問三位研究者](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html)時，X 對此的說法是這些資訊「因安全理由」被排除。

8 月這版把它補上了：183 個 `param!` 宣告，包含全部 26 個動作的權重。

## 排序公式簡單到令人意外

整個 For You 的排序就一行：

```
Final Score = Σ (weight_i × P(action_i))
```

Phoenix 模型讀你最近的行為序列，對每則候選貼文吐出 26 個機率；`RankingScorer` 用 `param.rs` 裡的常數把它們加權加總。以下是 2026-08-13 的生產預設值：

| 類別 | Action | 權重 |
|---|---|---|
| 互動 | favorite | 0.5 |
| | reply | 5.0 |
| | reply（互相追蹤者的原創貼文加成） | **+15.0** |
| | retweet | 1.0 |
| | quote | 5.0 |
| | share | 2.0 |
| | share via DM | 5.0 |
| | **share via copy link** | **20.0** |
| 點擊 | click / open link / profile click | 0.4 / 0.2 / 0.0 |
| | photo expand / video open / video quality view | 0.05 / 0.05 / 0.05 |
| 注意力 | dwell / 連續 dwell time | 0.0 / 0.004 |
| 作者 | follow author | 4.0 |
| 負向 | not interested | **−43.2** |
| | block author | **−31.2** |
| | mute author | **−58.8** |
| | report | **−234.0** |
| | not dwelled | −0.02 |

看到 `report = −234.0` 就想換算成「一次檢舉等於損失 468 個 like」的人，先讀一下同一個檔案在權重宣告正上方的註解：

> These weights reflect a combination of how much an action is valued in ranking and typical propensities of these actions across the X network (e.g. negative feedback is overall rare).

也就是說，**權重裡已經內含各行為的發生率補償**。最終貢獻是 weight × P(action)，而 P(report) 在量級上遠低於 P(favorite)。把兩個權重直接相除得到的「等於幾個 like」，算術沒錯，但前提被丟掉了。

加權之後還有三道調整（都在 `ranking_scorer.rs`）：同作者的第 n 則貼文乘上衰減係數 0.5、地板 0.25；非追蹤帳號的貼文乘 0.75；曝光未滿 1000 且粉絲數 ≤1000 的作者，24 小時內的新貼文會被拉抬到第 15 到 16 個位置。

## 那些對不上的數字

把攻略文跟原始碼逐條對照，錯誤率高得離譜：

| 流傳說法 | 原始碼實況 |
|---|---|
| reply 是 like 的 27 倍 | 2023 年舊 repo 的數字。現行是 10 倍（互相追蹤的原創貼文可到 20 倍） |
| 「作者回覆你的 reply」值 75 倍 | 現行的 26 個預測目標裡**沒有這個頭**。這個訊號不存在 |
| X Premium 有 2 到 4 倍觸及加成 | 在 `home-mixer/` 全文搜尋 `premium`、`verified`、`subscription`，只出現在兩處：訂閱限定貼文的**存取**過濾，以及廣告與統計的 logging。排序權重裡沒有任何以訂閱層級為 key 的項目 |
| 外部連結扣 50% 觸及 | `OpenLinkWeight = 0.2`。是正的，只是小 |
| 前 30 分鐘互動速度權重 1000 倍 | code 裡不存在。唯一的時間機制是 `MAX_POST_AGE = 48 * 60 * 60`（48 小時直接丟棄，不是衰減）與冷啟動的 24 小時窗 |
| 有預訓練 checkpoint 可下載 | 5 月版有（`oss-phoenix-artifacts.zip`，128 維 4 層的 mini 模型）。**8 月版已經移除**，改成自己用合成資料訓 |

最後一項值得特別說：8 月的發佈同時刪掉了 `.gitattributes` 裡的 Git LFS 設定，因為 repo 裡已經沒有任何模型檔案了。`phoenix/TRAINING.md` 的原話是「No pretrained checkpoint is included」。

## 真正的黑箱在 Phoenix 裡

排序的複雜度沒有消失，只是全部被吸進模型。README 對此毫不避諱：

> We have eliminated every single hand-engineered feature and most heuristics from the system.

`phoenix/README.md` 給了生產配置：排序模型 embedding 維度 2560、8 層 transformer、GQA 20 個 query head 對 4 個 KV head、歷史序列長度 1022、每次評分 64 個候選、使用者 / 物件 / 作者的雜湊詞表各 1 億 / 1 億 / 3000 萬。召回是雙塔架構，候選索引 1,024 萬則貼文（合併配置 2,867 萬）。

兩個設計決定值得記：

**candidate isolation**。推論時候選之間不能互相 attend，只能 attend 到使用者與歷史。這讓一則貼文的分數與同批候選無關，可快取、可重現。代價是放棄 slate 級最佳化。

**semantic ID**。貼文除了雜湊 ID，還帶 6 層 × 256 codes 的殘差量化代碼，由多模態 embedding 導出。同主題的貼文共享前綴，讓模型對沒見過的新貼文也有內容層面的泛化。

這正是研究者的批評所在。Cornell 的 John Thickstun 對 Engadget 說，決策「不只移出公眾視野，實際上是移出了連內部工程師都能理解的範圍」。Graz 的 Ruggero Lazzaroni 說得更直接：「我們有跑演算法的程式碼，但沒有跑演算法所需要的模型。」

8 月這版補上了訓練程式碼與合成資料產生器，`phoenix/QUICKSTART.md` 宣稱單張 GPU 就能端到端跑完訓練與 gRPC serving。TechCrunch 引述 X 的說法，發佈前已有外部研究者成功訓練並執行 Phoenix——但拿不到 per-post 分數。**生產權重與訓練資料仍然沒有公開。**（這條我沒有實際驗證，手上沒有 GPU。）

## 這次真正的新東西是可見度過濾

如果只看排序，8 月這版的增量其實有限。真正新的是 `visibility-filtering/` 及其上游的整套標籤系統——而且 X 自己在 README 裡把它跟排序明確切開：

```
排序決定順序          →  home-mixer/scorers/
可見度決定能不能出現   →  visibility-filtering/
                         不同服務、不同輸入、不同規則
```

`visibility-filtering/rules/registry.rs` 對每一組（貼文、觀看者）回答三選一：allow、interstitial（擋在可點穿的警示頁後）、drop。規則分兩組，第一條回答 drop 就結束評估：

- **base policy**：帳號被停權 / 停用、觀看者封鎖或靜音作者、法律下架、垃圾訊息標籤、成人與暴力內容的警示頁等。
- **recommendations-only policy**：額外 27 條規則，**只在這則貼文是來自非追蹤帳號的推薦時生效，而且只能 drop**。高召回垃圾訊息、DMCA 媒體、地理限制、冒充帳號、唯讀帳號等都在這裡。

這條設計值得停一下：同一則貼文，追蹤者看得到、被推薦的人看不到。過去外界爭論的「shadowban」，在這裡是一份可以逐條讀、逐條批評的公開清單。

搭配的是同日上線的 [Under the Hood](https://x.com/i/under_the_hood) 工具：符合條件的帳號（開滿一年、上個月發文 ≥10 則）可以下載 JSON，看自己的帳號與貼文在上個日曆月被貼過哪些會影響可見度的標籤。目前是隨機抽樣的試行。

被保留的部分同樣具體。`grox/flows/*/prompts.py` 呼叫了十幾個 Jinja2 模板，而整個 repo 裡 `.j2` 檔案的數量是 **0**。也就是說：「這則貼文算不算違規」的實際判準，一條都沒公開。X 的 VP of Product Keith Coleman 對 TechCrunch 的說法是，這是為了避免有心人繞過規則灌爆平台。

## 整體來說

這次開源真正改變的，不是「你能不能重現 X 的 feed」——不能，沒有權重也沒有資料。

改變的是**爭論的位置**。過去大家吵「他們是不是偷偷降權」，現在可以吵「他們寫在 `registry.rs` 裡的那 27 條規則合不合理」、「report 的權重是 favorite 的 468 倍，這個量級對嗎」、「`bidirectional_follow_reply_weight_boost` 從 20 調到 15 的理由是世界盃討論太少，這算好的產品決策嗎」——最後這件事 X 自己寫在 [`docs/BIDIRECTIONAL_BOOST_CHANGE.md`](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md) 裡，連 7/10 A/B 測試、7/13 廣推、7/24 下調的時間軸都有。

這是真實的透明，但很窄。它讓「規則」變成公開文本，卻讓「判斷」更深地藏進模型。而歐盟 DSA 真正要的東西——研究者能存取平台**輸出**——X 的 API 定價正好把那條路封死；[Hacker News 上的討論](https://news.ycombinator.com/item?id=46688173)對這點的批評比對程式碼本身還多。

另外，Musk 在 1 月承諾「每 4 週更新一次，附完整開發者說明」。git 歷史顯示，7 個月內發佈了 3 次。

如果你是要做推薦系統的工程師，這份 repo 大概是目前公開資料裡最完整的生產級參考架構，Apache-2.0，可商用。如果你是想知道自己為什麼沒流量的創作者，讀 `param.rs` 有用，但要記得：權重是常數，變動的是那個你看不到的機率。

## 參考資料

- [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) — X For You feed 演算法原始碼，Apache-2.0
- [x-algorithm: docs/BIDIRECTIONAL_BOOST_CHANGE.md](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md) — X 官方示範的演算法調參逐日紀錄
- [x-algorithm: phoenix/README.md](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) — Phoenix 排序與召回模型架構、生產配置表
- [twitter/the-algorithm](https://github.com/twitter/the-algorithm) — 2023 年那次開源的舊版原始碼
- [X open sources its ranking algorithm, letting users see if they've been 'shadowbanned'](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned) — TechCrunch，含 X VP of Product Keith Coleman 專訪
- [X open sources its algorithm while facing a transparency fine and Grok controversies](https://techcrunch.com/2026/01/20/x-open-sources-its-algorithm-while-facing-a-transparency-fine-and-grok-controversies/) — TechCrunch 對 2026-01 首次發佈的報導
- [X's 'open source' algorithm isn't a win for transparency, researchers say](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html) — Engadget，訪問 Cornell、Graz、CMU 三位研究者
- [X For You Feed Algorithm — Hacker News](https://news.ycombinator.com/item?id=46688173) — 2026-01 發佈當時的社群討論
- [Under the Hood 標籤透明度工具](https://x.com/i/under_the_hood) — X 官方試行中的帳號標籤查詢頁
