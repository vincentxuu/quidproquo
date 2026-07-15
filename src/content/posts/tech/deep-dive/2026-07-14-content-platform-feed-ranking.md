---
title: "各家內容平台的 Feed 怎麼排？從 Reddit 公式到 TikTok 興趣圖"
date: 2026-07-14
type: deep-dive
category: tech
tags: [feed, ranking, recommendation, algorithm, reddit, tiktok, product]
lang: zh-TW
tldr: "十家平台的 feed 排序拆開來看，大家其實都在解同一道題：怎麼在「最新」「最好」「讓新內容被看見」之間取捨。而真正決定你該怎麼選的，不是演算法多聰明，而是你的內容是過剩還是稀缺——大平台的排序是為了濾掉內容，小社群卻是希望每一則都被看到。"
description: "從 Reddit Hot、Hacker News 的公式排序，到 Facebook/Instagram/Twitter 的 ML 多目標排序，再到 TikTok/YouTube 的興趣圖與 Mastodon/Bluesky 的時間序，逐一拆解各家 feed 演算法的機制、公式與冷啟動策略，並收斂出小社群該怎麼選的判斷框架。"
draft: false
glossary:
  - term: "冷啟動"
    aliases: ["cold start"]
    definition: "剛發布、還沒有任何互動紀錄的新內容，缺乏排序演算法賴以評分的訊號，很容易一發出就沉底。如何給新內容初始曝光，就是冷啟動問題。"
    context: "本文的核心觀察是：幾乎每家平台都為冷啟動留了一條專屬曝光路徑，沒有一家讓純互動排序決定新內容的生死。"
  - term: "停留時間"
    aliases: ["dwell time"]
    definition: "使用者在一則內容上實際停留的秒數，相對於「有沒有按讚」這種二元訊號，它連續、雜訊低、量大，是 LinkedIn 等平台的核心排序訊號。"
    context: "LinkedIn 同時把它當正訊號（被動消費也是偏好）和負訊號（預測會被快速略過的貼文並降權）。"
  - term: "EdgeRank"
    definition: "Facebook 早期公開的 News Feed 排序公式，用親密度、內容權重、時間衰減三個係數相乘來為每則貼文評分。2011 年後被機器學習模型取代。"
    context: "它的三個概念至今仍活在 ML 模型的直覺裡，是理解「互動排序」思路的最好起點。"
---

🌏 [English version](/posts/tech/deep-dive/2026-07-14-content-platform-feed-ranking-en)

每個 feed 都在拉扯兩股力量：一股是**時間**，最新的內容該被看到；另一股是**互動**，最多人喜歡、留言、看完的內容該被看到。純用時間，好內容會被洗掉；純用互動，剛發出、還沒人反應的新內容永遠沉底。所有排序演算法，本質上都是在調這兩股力量的配比。

但在比較各家做法之前，得先講一個更關鍵、卻常被忽略的前提——**供需**。大平台的排序是為了解決內容**過剩**，它們的工作是「濾掉」；而小社群面對的是內容**稀缺**，你反而希望每一則都被看到。這個差別決定了一切：讀下面每一家時，真正該問的不是「它多聰明」，而是「它在解過剩還是稀缺」。

## 公式排序：一行數學平衡時間與票數

最透明的一類。沒有機器學習，就是一條所有人都能讀的公式。

**Reddit 的 Hot** 把票數和年齡放進同一個分數：

```
hot = sign(s) · log₁₀(max(|s|, 1)) + (t_post − 1134028003) / 45000
      s = 讚 − 噓,  t_post = 貼文建立的 epoch 秒數
```

靈魂在於**票數走對數、時間走線性加項**。前 10 票的影響力等於接下來 100 票，早期票數極度重要；時間項則把「發文時刻」直接烤進分數當永久起跑優勢——分數不是隨時間衰減，而是新貼文起跑就比較高。常數 `45000` 秒的意思是：貼文每老 12.5 小時，就需要約 10 倍的淨票數才守得住原位。

**Hacker News** 看似同類，機制卻相反：

```
score = (P − 1)^0.8 / (T + 2)^1.8 × penalties
        P = 票數（減去作者自投）,  T = 年齡（小時）
```

分母指數 1.8 大於分子指數 0.8，所以分數是持續、陡峭地隨年齡**真正衰減**——就算高票故事，一天內也會掉出首頁。這是真 decay，對比 Reddit「凍結時間戳」的加項。HN 首頁還會再乘一層不透明的懲罰係數（檢舉、灌票偵測、爭議筆戰懲罰）。

兩者的冷啟動都靠一條時間序後門：新內容先進 Reddit 的 **New** 或 HN 的 `/newest` 累積首批票，Reddit 另有 **Rising** 專抓「相對於超年輕年齡、增速異常快」的貼文，讓真正在爆的新內容提早被看見。

## ML 多目標排序：預測你會做什麼，再加權

大型社群平台的主流。不再是一條公式，而是為每則候選預測「你按讚／留言／分享／看完的機率」，再用權重加總。

這套思路的起點是 Facebook 的 **EdgeRank**（`親密度 × 內容權重 × 時間衰減`）。2011 年後三個手調係數被機器學習取代，2013 年官方稱模型考量「十萬以上」訊號。2018 年的「有意義的社交互動」是一次刻意轉向：**上調會激起人與人來回對話的貼文，下調預錄影片、出版商那種被動消費**——而「騙留言」的 engagement-bait 被明確排除、繼續降權。

**Instagram** 的關鍵是 Mosseri 反覆強調的一句：「Instagram 不是一個演算法」。Feed、Stories、Explore、Reels 各有一套排序，目標完全不同——Stories 重親密關係、Explore 重探索、Reels 重看完率。同一套策略換介面就失效。

**Twitter/X** 在 2023 開源了完整管線：從約五億則貼文，經「候選撈取（約 1,500 則，追蹤內外各半）→ 輕排序 / 重排序（約 4,800 萬參數神經網路，對每則輸出約 10 個互動機率）→ 啟發式過濾混合」煉出 For You。開源版的重排序權重很有啟發性：

| 預測的互動訊號 | 權重 |
|---|---|
| 回覆，且作者回覆了你 | +75 |
| 回覆 | +27 |
| 按讚（基準） | +0.5 |
| 負回饋（少看／封鎖／靜音） | −74 |
| 檢舉 | −369 |

一則回覆約等於 54 個讚，作者回你的回覆約等於 150 個讚——**對話為王**；而一次檢舉幾乎是殺手鐧，**負訊號壓倒性地大**。

**LinkedIn** 則站在這一端最偏「相關性」的位置：它把**停留時間**當核心訊號（理由是比稀疏又二元的點擊更連續、雜訊低），並明說系統**刻意設計成不優化 virality**，系統性降低釣魚與洗版內容的分發——「最成功的貼文不一定是讚最多的」。

## 興趣圖 + 探索：不看你追蹤誰，只看你的興趣

最激進的一端。排序幾乎不依賴社交圖。

**TikTok** 官方明說粉絲數與過往爆款「不是」直接排序因子：影片能觸及誰，取決於它多符合那群人的興趣，所以零粉帳號的第一支影片也可能觸及百萬。洩漏文件裡的排序式長這樣：

```
score = Plike·Vlike + Pcomment·Vcomment + Eplaytime·Vplaytime + Pplay·Vplay
        P = 預測某動作的機率,  E = 期望值,  V = 該動作的價值權重
```

它的冷啟動是全行業最明確的：新影片先發給一小群**測試觀眾**，量測完播率、重看、互動，達標才**一波一波放大**——這就是影片「幾天後才爆」、舊片會「復活」的原因。

**YouTube** 優化的是**期望觀看時間**而非點擊（用點擊率排序會助長標題殺人）。它用兩段式架構（候選生成 → 排序），並用一個叫 **example age** 的特徵處理新鮮度：訓練時把樣本年齡當特徵餵入，推論時設為零，等於告訴模型「現在正是訓練窗尾端」，藉此拉抬剛上傳的影片。

## 時間序與可組合：把決定權還給使用者

光譜的另一端。**Mastodon** 設計原則就是反向時間序、無演算法、無廣告，唯一類似排序的「趨勢」被隔離在 Explore 分頁、還需管理員審核。**Bluesky** 更進一步：預設 Following 是純時間序，但透過 AT Protocol 的 **feed generator**，任何人都能發布一套 feed 演算法，使用者自由訂閱、釘選、排列——把「要不要演算法、要哪套」變成一個開放市集，而不是平台強加的單一排序。

## 整體架構：一條光譜

把十家排在同一條軸上，會看到一個乾淨的漸層——左邊是使用者／時間決定順序，右邊是平台／互動訊號決定：

```
冷（時間）←───────────────────────────────────────────→ 暖（演算法）

Mastodon      Bluesky        Reddit Hot     Facebook / IG      TikTok
Bluesky       自訂 feed       Hacker News    Twitter For You    YouTube
(Following)   (可組合)        (公式)         LinkedIn (ML)      (興趣圖+探索)

純時間序       市集           一行數學        預測你的動作        只看興趣
不排序        自選排序器      透明可讀        再加權排序          主動測試新內容
```

而不論落在光譜哪裡，有一件事所有平台都做了：**為新內容留一條專屬的初始曝光路徑**。TikTok 的探索池、Reddit 的 Rising、YouTube 的 example age、Instagram/LinkedIn 的小範圍測試、Mastodon/Bluesky 時間序的「保證送達」——本質上是同一件事的不同實作：**先給新內容一個曝光窗，再用早期反應決定要不要放大**。差別只在窗有多大、放大多兇——而那又回到供需：內容越過剩，窗越小、篩得越狠。

## 對小社群的啟示

如果你的產品內容是**稀缺**的（一天沒幾則新貼文），上面所有為「過剩」設計的互動排序套過來都會反過來傷害——把僅有的新內容埋掉。幾個直接可用的結論：

- **稀缺情境的正解是時間序，不是互動排序。** 小社群硬套 engagement 排序，多半是過早優化。
- **「有互動就浮上來」是成熟的舊招。** 論壇 bump、Reddit Rising 都是。實作上可以用 `activity_time = GREATEST(建立時間, 最後互動時間)` 當排序鍵，新內容靠建立時間進場、舊內容被互動就頂回來，新舊自然交錯。
- **給新內容一個保底曝光窗。** 這不是自己發明的招，而是 TikTok 探索池 / YouTube example age / Reddit Rising 的極簡版：保證每則新內容至少被看到一次。
- **要「熱門」就開獨立分頁，別塞進主 feed 排序。** Reddit（Hot / New / Rising）、X（For You / Following）都把不同排序拆成使用者可選的分頁。
- **別在游標視窗裡即時重排。** 大平台用 session 快照 + offset 翻頁，而不是「抓一批 → 即時重排 → 又拿時間當游標翻頁」——後者會讓被降權的內容在翻頁時被永久跳過。排序鍵要跟游標一致、且單調。

## 整體來說

大平台教我們的其實不是「怎麼排序」，而是**「什麼時候不需要排序」**——以及就算要排，也永遠給新內容留一條保證曝光的路。排序演算法的複雜度，只有在內容爆量、時間序塞不下時才划算。在那天到來之前，時間序 + 活動冒泡 + 新內容保底窗，幾乎永遠是更好的選擇。

---

## 參考資料

- [How Reddit ranking algorithms work（含 _sorts.pyx 原始碼）](https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9)
- [Evan Miller — Deriving the Reddit Formula（Wilson 信賴區間）](https://www.evanmiller.org/deriving-the-reddit-formula.html)
- [Ken Shirriff — How Hacker News ranking really works](http://www.righto.com/2013/11/how-hacker-news-ranking-really-works.html)
- [Mosseri — Bringing People Closer Together（Facebook MSI 公告）](https://about.fb.com/news/2018/01/news-feed-fyi-bringing-people-closer-together/)
- [Mosseri — Instagram Ranking Explained（2023）](https://about.instagram.com/blog/announcements/instagram-ranking-explained)
- [Twitter Engineering — Twitter's Recommendation Algorithm（官方）](https://blog.x.com/engineering/en_us/topics/open-source/2023/twitter-recommendation-algorithm)
- [GitHub — twitter/the-algorithm](https://github.com/twitter/the-algorithm)
- [LinkedIn Engineering — Understanding Feed Dwell Time](https://www.linkedin.com/blog/engineering/feed/understanding-feed-dwell-time)
- [TikTok Newsroom — How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- [Covington et al. — Deep Neural Networks for YouTube Recommendations（RecSys 2016）](https://research.google.com/pubs/archive/45530.pdf)
- [Bluesky — Algorithmic Choice with Custom Feeds](https://bsky.social/about/blog/7-27-2023-custom-feeds)
- [Mastodon 3.0 in depth（趨勢需管理員核准）](https://blog.joinmastodon.org/2019/10/mastodon-3.0-in-depth/)
