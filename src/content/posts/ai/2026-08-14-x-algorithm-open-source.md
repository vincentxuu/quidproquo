---
title: "X 演算法開源：權重公開之後，反而更清楚黑箱在哪"
date: 2026-08-14
category: ai
type: deep-dive
tags: [recommendation, ranking, ai-transparency, open-source, algorithm]
lang: zh-TW
tldr: "2026-08-13 的發布新增 363,246 行，首次公開 For You 的排序權重：favorite 0.5、reply 5.0、report −234.0。但權重是常數，真正決定順序的 P(action) 來自一個 2560 維、8 層的 transformer。"
description: "從原始碼讀 xai-org/x-algorithm 的三次發布：完整權重表、Phoenix 排序架構，以及這次真正的新東西——可見度過濾與它背後那套標籤系統。"
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
    context: "本文用它說明 X 的檢索階段怎麼表示貼文。"
  - term: "visibility filtering"
    aliases: ["可見度過濾"]
    definition: "獨立於排序的一套規則系統，針對每一組（貼文、觀看者）回答顯示、擋在警示頁後、或直接不顯示。"
    definition_en: "A rule system separate from ranking that answers, for each post-viewer pair, whether to allow, show behind an interstitial, or drop."
    context: "本文用它說明 X 2026 年 8 月開源的重點其實不在排序。"
---

> 🌏 [English version](/posts/ai/2026-08-14-x-algorithm-open-source-en)

2026-08-13，[xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) 推進了一個新增 363,246 行、變動 2,053 個檔案的 commit，交出了所有人吵了三年要的東西：排序權重。

在此之前的兩次發布有一個很尷尬的細節。1 月與 5 月版的 `home-mixer/scorers/ranking_scorer.rs` 已經在呼叫 `params.get(FavoriteWeight)`，但 `home-mixer/params/` 這個目錄根本不在 repo 裡。程式碼看得到，數值看不到。[Engadget 在 2 月訪問三位研究者](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html)時，X 的說法是這些資訊「因安全理由」被排除。

現在補上了：183 個 `param!` 宣告，26 個動作的權重一個不缺。

這篇要講的是：**權重交出來之後，看得更清楚的其實是它決定不了什麼。**

## 三次發布，規模差了兩個數量級

repo 的 git 歷史只有 5 個 commit，全部由 CI agent 產出，訊息一模一樣。`--stat` 才說了實話：

| 發布日期 | 檔案變動 | 新增行數 | 內容 |
|---|---|---|---|
| 2026-01-20 | 79 | 8,816 | 4 個目錄：`home-mixer`、`phoenix`、`thunder`、`candidate-pipeline` |
| 2026-05-15 | 187 | 18,263 | Grox 內容理解、廣告混排、新候選來源 |
| 2026-08-13 | **2,053** | **363,246** | 權重、可見度過濾、安全標籤鏈、Phoenix 生產環境訓練程式碼 |

[TechCrunch 報導](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned)這次「讓程式碼庫大了約 10 到 15 倍」，跟 git 對得上。順帶一提，Musk 在 1 月承諾「每 4 週更新一次，附完整開發者說明」——7 個月，3 次。

## 權重是常數，變動的是機率

整個 For You 的排序就一行：

```
Final Score = Σ (weight_i × P(action_i))
```

Phoenix 模型讀你最近的行為序列，對每則候選貼文吐出 26 個機率；`RankingScorer` 用 `param.rs` 裡的常數加權加總。以下是 2026-08-13 生產環境的預設值：

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

加權之後還有三道調整（都在 `ranking_scorer.rs`）：同作者的第 n 則貼文乘上衰減係數 0.5、下限 0.25；非追蹤帳號的貼文乘 0.75；曝光未滿 1,000 且粉絲數 ≤1,000 的作者，24 小時內的新貼文會被拉抬到第 15 到 16 個位置。貼文年齡則是硬切——`MAX_POST_AGE = 48 * 60 * 60`，48 小時直接丟棄，沒有衰減函數。

看到 `report = −234.0` 就想換算成「一次檢舉等於損失 468 個 like」的人，先讀同一個檔案在權重宣告正上方的註解：

> These weights reflect a combination of how much an action is valued in ranking and typical propensities of these actions across the X network (e.g. negative feedback is overall rare).

**權重裡已經內含各行為的發生率補償。** 最終貢獻是 weight × P(action)，而 P(report) 在量級上遠低於 P(favorite)。把兩個權重相除得到「等於幾個 like」，算術沒錯，前提被丟掉了。

這也是整張表最該記住的一句：**權重是常數，每則貼文之間唯一在變的是 P(action)。** 你的貼文排在哪裡，決定權不在這 26 個數字，在那個吐出機率的模型。

（順帶一提，網路上流傳最廣的「reply 是 like 的 27 倍」是 2023 年 [twitter/the-algorithm](https://github.com/twitter/the-algorithm) 的舊值，現行是 10 倍；而「作者回覆你的 reply 值 75 倍」在現行的 26 個預測目標裡**根本沒有這個頭**。）

## 黑箱搬去哪了

排序的複雜度沒有消失，只是全部被吸進模型。README 對此毫不避諱：

> We have eliminated every single hand-engineered feature and most heuristics from the system.

[`phoenix/README.md`](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) 給了生產環境的配置：排序模型 embedding 維度 2560、8 層 transformer、GQA 20 個 query head 對 4 個 KV head、歷史序列長度 1022、每次評分 64 個候選、使用者 / 物品 / 作者的雜湊詞表各 1 億 / 1 億 / 3,000 萬。檢索階段是雙塔架構，候選索引 1,024 萬則貼文（合併配置 2,867 萬）。

兩個設計決定值得記：

**candidate isolation**。推論時候選之間不能互相 attend，只能 attend 到使用者與歷史。這讓一則貼文的分數與同批候選無關，可快取、可重現。代價是放棄 slate 級最佳化。

**semantic ID**。貼文除了雜湊 ID，還帶 6 層 × 256 codes 的殘差量化代碼，由多模態 embedding 導出。同主題貼文共享前綴，讓模型對沒見過的新貼文也有內容層面的泛化。

這正是研究者的批評所在。Cornell 的 John Thickstun 對 Engadget 說，決策「不只移出了公眾視野，甚至移出了連內部工程師自己都還能理解的範圍」。Graz 的 Ruggero Lazzaroni 說得更直接：「我們有跑演算法的程式碼，但沒有跑演算法所需要的模型。」

8 月這版補了訓練程式碼與合成資料產生器，`phoenix/QUICKSTART.md` 宣稱單張 GPU 就能端到端跑完訓練與 gRPC serving；5 月版附的那個 128 維 4 層 mini checkpoint 則被移除了，`TRAINING.md` 的原話是「No pretrained checkpoint is included」。TechCrunch 引述 X 的說法，發布前已有外部研究者成功訓練並執行 Phoenix，但拿不到 per-post 分數。**生產環境的權重與訓練資料仍未公開。**（這條我沒實際驗證，手上沒有 GPU。）

## 這次真正的新東西：可見度過濾

如果只看排序，8 月這版的增量有限。真正新的是 `visibility-filtering/` 及其上游整套標籤系統——而 X 自己在 README 裡把它跟排序明確切開：

```
排序決定順序          →  home-mixer/scorers/
可見度決定能不能出現   →  visibility-filtering/
                         不同服務、不同輸入、不同規則
```

`visibility-filtering/rules/registry.rs` 對每一組（貼文、觀看者）回答三選一：allow、interstitial（擋在警示頁後，讀者可以點擊略過）、drop。規則分兩組，**第一條回答 drop 就結束評估**：

- **base policy**：帳號停權 / 停用 / 資料抹除 / 已移出平台、受保護帳號、觀看者封鎖或靜音作者、靜音轉推、垃圾訊息標籤、法律下架與地方法規下架、過期貼文、成人與血腥暴力的警示頁、未登入 / 未成年 / 未填寫年齡者的敏感內容攔截。
- **recommendations-only policy**：額外 27 條，**只在這則貼文是來自非追蹤帳號的推薦時生效，而且只能 drop**。包括高召回率的垃圾訊息、DMCA 媒體、地理限制媒體、惡意網址、do-not-amplify、冒充帳號（高精確率）、被盜帳號、唯讀帳號、頭像 / 橫幅為成人內容的帳號等。

同一則貼文，追蹤者看得到、被推薦的人看不到——這個設計值得多想一下。過去外界爭論的「shadowban」，在這裡是一份可以逐條讀、逐條批評的公開清單。而且它是連坐的：`AncillaryVFFilter` 會把「祖先貼文、被引用貼文或被轉推貼文遭 drop」的貼文也一併移除。

這些標籤從哪來？8 月這版把整條產線都放上來了：

```
內容理解（持續跑，不在請求路徑上）
  grox/                 貼文與媒體的分類器（Grok 系）
  media-model-proxy/    圖片與影片模型：成人、血腥、仇恨符號
  clip/                 上述模型吃的圖文 embedding
  agatha/               依別人怎麼回應貼文來標記帳號（封鎖、檢舉 vs 收藏）
  bdsm/                 從帳號的行為序列偵測非真實帳號
  user-cred-v2/         在追蹤關係與互動關係的圖上跑 PageRank
        ↓
標籤規則
  scarecrow/            事件觸發，內嵌 botmaker 當規則引擎
  botmaker/             規則語言本身：語法、compiler、runtime
  abuse-enforcement-service/  依模型分數標記、挑戰或停權帳號
        ↓
  儲存 → 請求路徑上讀回 → visibility-filtering
```

`bdsm/` 那份 README 值得單獨看：一個雙向 transformer encoder 讀帳號的行為序列，用**時間感知的 RoPE**（旋轉位置編碼由正規化後的動作時間戳驅動，而非 token 索引）來表示動作之間的節奏——突發性、機械式規律。八個任務頭（task head）分別判斷 FollowBot、LikeBot、EngagementAmplifier、ReplySpamBot、TweetSpamBot、RTBot、MultiActionBot、LegitimateUser。

搭配的是同日上線的 [Under the Hood](https://x.com/i/under_the_hood)：符合條件的帳號（註冊滿一年、上個月發文 ≥10 則）可以下載 JSON，看自己的帳號與貼文在上個日曆月被貼過哪些會影響可見度的標籤。目前是隨機抽樣試行。

被保留的部分同樣具體。`grox/flows/*/prompts.py` 呼叫了十幾個 Jinja2 模板，而整個 repo 裡 `.j2` 檔案的數量是 **0**。也就是說：「這則貼文算不算違規」的實際判準，一條都沒公開。X 的 VP of Product Keith Coleman 對 TechCrunch 的說法是，這是為了避免有心人繞過規則灌爆平台。

## 整體來說

這次開源真正改變的，不是「你能不能重現 X 的 feed」——不能，沒有權重也沒有資料。

改變的是**爭論的位置**。過去大家吵「他們是不是偷偷降權」，現在可以吵那 27 條 only-drop 規則的界線劃在哪、`report` 拿到 `favorite` 的 468 倍量級對不對、把 `bidirectional_follow_reply_weight_boost` 從 20 調到 15 的理由是「世界盃討論太少」算不算好的產品決策——最後這件事 X 自己寫在 [`docs/BIDIRECTIONAL_BOOST_CHANGE.md`](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md) 裡，連 7/10 開 A/B 測試、7/13 全面推出、7/24 下調的時間軸都有。

這是真實的透明，但很窄。它把**規則**變成公開文本，同時把**判斷**更深地藏進模型：排序的判斷在 Phoenix 的 2560 維裡，違規與否的判斷在那些沒公開的 j2 prompt 裡。至於歐盟 DSA 真正要的東西——研究者能存取平台**輸出**——X 的 API 定價正好把那條路封死；[Hacker News 上的討論](https://news.ycombinator.com/item?id=46688173)對這點的批評比對程式碼本身還多。

如果你在做推薦系統，這份 repo 大概是目前公開資料裡最完整的生產級參考架構，Apache-2.0，可商用。如果你在意的是自己的貼文為什麼沒人看到，`param.rs` 只能告訴你平台**重視**什麼；要知道它**判斷**了你什麼，得去 Under the Hood 下載那份 JSON。

## 參考資料

- [xai-org/x-algorithm](https://github.com/xai-org/x-algorithm) — X For You feed 演算法原始碼，Apache-2.0
- [x-algorithm: phoenix/README.md](https://github.com/xai-org/x-algorithm/blob/main/phoenix/README.md) — Phoenix 排序與檢索模型架構、生產環境配置表
- [x-algorithm: docs/BIDIRECTIONAL_BOOST_CHANGE.md](https://github.com/xai-org/x-algorithm/blob/main/docs/BIDIRECTIONAL_BOOST_CHANGE.md) — X 官方示範的演算法調參逐日紀錄
- [twitter/the-algorithm](https://github.com/twitter/the-algorithm) — 2023 年那次開源的舊版原始碼
- [X open sources its ranking algorithm, letting users see if they've been 'shadowbanned'](https://techcrunch.com/2026/08/13/x-open-sources-its-ranking-algorithm-letting-users-see-if-theyve-been-shadowbanned) — TechCrunch，含 X VP of Product Keith Coleman 專訪
- [X open sources its algorithm while facing a transparency fine and Grok controversies](https://techcrunch.com/2026/01/20/x-open-sources-its-algorithm-while-facing-a-transparency-fine-and-grok-controversies/) — TechCrunch 對 2026-01 首次發布的報導
- [X's 'open source' algorithm isn't a win for transparency, researchers say](https://www.engadget.com/social-media/xs-open-source-algorithm-isnt-a-win-for-transparency-researchers-say-181836233.html) — Engadget，訪問 Cornell、Graz、CMU 三位研究者
- [X For You Feed Algorithm — Hacker News](https://news.ycombinator.com/item?id=46688173) — 2026-01 發布當時的社群討論
- [Under the Hood 標籤透明度工具](https://x.com/i/under_the_hood) — X 官方試行中的帳號標籤查詢頁
