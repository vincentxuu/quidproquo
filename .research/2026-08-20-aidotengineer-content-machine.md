# @aiDotEngineer YouTube 內容機器研究筆記

> 研究日期：2026-08-20
> 主題：為什麼 AI Engineer YouTube 頻道能持續穩定出內容
> 來源數：12+（官網、Swyx 個人站、vidIQ、Digg、Exa、ContentFlow 訪談、Latent Space 年度文）

---

## 一、頻道基本資料

| 項目 | 數據 | 來源 |
|---|---|---|
| 頻道名 | AI Engineer (@aiDotEngineer) | YouTube |
| 創立日期 | 2023-09-19 | vidIQ |
| 訂閱數 | ~615K–620K（影片描述），近 30 天增 74K | vidIQ + YouTube |
| 近 30 天觀看 | 253 萬次 | vidIQ |
| 2025 年總觀看 | 1,000 萬+ / 120 萬不重複觀眾 | ai.engineer/about |
| YouTube 排名 | #121,136 | vidIQ |
| 經營主體 | Software 3.0 Inc | ai.engineer/about |
| 共同創辦人 | Swyx (Shawn Wang) — CEO；Ben Dunphy — VP Sales & Creative Director | ai.engineer/about |

**Swyx 背景**：量化金融出身 → AWS / Netlify / Temporal / Airbyte DevRel → Latent Space podcast/newsletter → Smol AI → AI Engineer Summit/Foundation。社群經驗覆蓋 Svelte Society、/r/reactjs、React TypeScript Cheatsheet。

**Ben Dunphy 背景**：Reactathon + JAMstack Conf 創辦人，老牌開發者活動製作人。

---

## 二、核心發現：會議即內容工廠

### 這不是一個「YouTube 創作者」，而是一個「會議組織 + 內容分發引擎」

傳統 YouTube 創作者的瓶頸是**每支影片都要從零製作**——寫稿、錄製、剪輯、上字幕。AI Engineer 的模式完全不同：

```
會議活動（每年 8+ 場）
  → 每場 50–150+ 場演講（18 分鐘/場，刻意壓短）
  → 專業攝影 + 直播設備全程錄製
  → 會後依序上傳 YouTube（拆成單支影片）
  → 持續數週至數月的上傳排程
```

一場 World's Fair 就能產出 100+ 支影片。一年八場活動 = **永遠不缺原始素材**。

### 2023–2026 活動時間線

| 日期 | 活動 | 地點 | 規模 |
|---|---|---|---|
| 2023-10 | Summit 2023 | SF | 500 人，10:1 申請比 |
| 2024-06 | World's Fair 2024 | SF | 3,000+，18 tracks，150+ sessions |
| 2025-02 | Summit 2025 | NYC | 售罄，4 個 MSG 大小的線上觀眾量 |
| 2025-06 | World's Fair 2025 | SF | 規模翻倍 |
| 2025-09 | Paris 2025 | Paris | 首次歐洲場 |
| 2025-11 | Code 2025 | NYC | — |
| 2026-04 | Europe 2026 | London | — |
| 2026-06 | World's Fair 2026 | SF (Moscone) | 7,200+ 售罄 |
| 2026 | Partner events | Miami, Singapore, Melbourne, Sydney | 獨立主辦 |

每季至少一場旗艦活動，加上合作場次，全年無空窗期。

---

## 三、內容飛輪解析

### 第一層：活動 → 內容的零邊際成本

| 環節 | 成本分攤方式 |
|---|---|
| 演講者 | 不付講師費——講者自願參加以獲得曝光、招聘、品牌效應 |
| 場地 + AV | 已由門票 + 贊助商覆蓋 |
| 錄影 | 會場專業設備，活動本身的直播需求就已包含 |
| 後製 | 最小化——主要是拆分直播流、加 thumbnail |
| 內容品質 | 由講者背書——OpenAI、Anthropic、Google DeepMind、Meta 的工程師自帶權威性 |

**結論**：YouTube 內容的邊際製作成本趨近於零。活動本身就會產出內容，YouTube 只是分發管道。

### 第二層：品牌飛輪

```
高品質講者 → 吸引更多觀眾
  → 觀眾訂閱 → 頻道成長
    → 頻道成長 → 講者更願意參加（曝光效益更大）
      → 更多高品質講者 → 活動更好 → 門票更好賣 → ⟳
```

Swyx 自述：「Conference as brand infrastructure — the event is not a byproduct of the brand, it is the mechanism for constructing the brand.」

### 第三層：精細化營運

1. **縮影片長度**：每場 18 分鐘（業界慣例 25–30 分），Swyx 明確說是「fit the YouTube attention span and reduce waffling」
2. **Thumbnail A/B 測試**：2026-08-18 公開 open source 了 90 天的 thumbnail 實驗數據，用 YouTube 原生 Test & Compare 功能
3. **Track Hosts 制度**：每個 track 有專門主持人，確保品質一致
4. **現場採訪團隊**：每場活動 3 組人做 showfloor walkthroughs 和 video marketing
5. **外包合作**：Videotap（影片轉文字/剪輯）、Thoth（資訊圖表）

---

## 四、頂級影片分析

| 影片 | 觀看數 | 上傳時間 | VPH | Outlier |
|---|---|---|---|---|
| Don't Build Agents, Build Skills Instead – Anthropic | 148 萬 | ~8 個月前 | 19.2 | — |
| Full Walkthrough: Workflow for AI Coding – Matt Pocock | 138 萬 | ~4 個月前 | 361.9 | **35.84x** |

Matt Pocock 那支是 35.84 倍離群值——說明當「對的講題 × 對的時機」對齊時，會議錄影的爆發力不亞於精心製作的原創內容。

---

## 五、跟其他 AI YouTube 頻道的差異

| 維度 | 一般 AI YouTuber | AI Engineer (@aiDotEngineer) |
|---|---|---|
| 內容來源 | 個人製作 | 會議演講 + 訪談，講者是業界大牛 |
| 產出瓶頸 | 一個人的精力 | 活動排程（一年 8+ 場，每場 50–150 支） |
| 品質保證 | 取決於創作者能力 | 取決於 speaker curation（2,200 CFP，錄取 <5%） |
| 製作成本 | 每支都是全新投入 | 邊際成本趨近零 |
| 斷更風險 | 高（燃盡、靈感枯竭） | 極低（只要活動繼續辦） |
| 權威性 | 個人品牌 | 機構品牌 + 講者光環（Jensen Huang、Karpathy、Greg Brockman） |
| 永續性 | 依賴個人 | 組織化運作 |

---

## 六、事實交叉表

| 事實 | 來源 1 | 來源 2 | 狀態 |
|---|---|---|---|
| 頻道 2023-09-19 創立 | vidIQ | — | ⚠️ 單源 |
| 訂閱 ~615K–620K | YouTube 影片描述 | vidIQ（74K/月增速推算） | ✅ |
| 近 30 天 253 萬次觀看 | vidIQ | — | ⚠️ 單源 |
| 2025 年 1,000 萬+ 觀看 | ai.engineer/about | — | ⚠️ 官方自述 |
| World's Fair 2026 售罄 7,200+ | ContentFlow 訪談 | ai.engineer 首頁 | ✅ |
| 活動 CFP 2,200 件，錄取 <5% | ContentFlow 訪談 | — | ⚠️ 單源 |
| 每場演講 18 分鐘限制 | Swyx blog (dx.tips) | — | ⚠️ 單源 |
| Thumbnail A/B 測試公開 | Digg 報導 | Swyx X post | ✅ |
| Swyx + Ben Dunphy 共同創辦 | ai.engineer/about | Swyx 個人站 | ✅ |
| 一年八場旗艦 + 合作活動 | ai.engineer/about | ai.engineer 首頁時間線 | ✅ |

---

## 七、可複製的方法論（給 quidproquo 的啟示）

### 能抄的

1. **活動 → 內容轉化**：任何活動錄影（meetup、workshop、線上座談）都能拆成獨立影片
2. **18 分鐘原則**：短講 > 長講，在 YouTube 表現更好
3. **Speaker curation > 個人製作**：找對的人講，比自己講效率高 10 倍
4. **Thumbnail A/B 測試**：YouTube 原生 Test & Compare 功能，零成本
5. **內容日曆 = 活動日曆**：活動排程自動產生上傳排程

### 不能直接抄的

1. **規模門檻**：AI Engineer 每場 500–7,200 人，吸引頂尖講者的前提是活動本身夠大
2. **Swyx 的網絡效應**：他在 DevRel 圈十年的人脈是冷啟動的關鍵資源
3. **ai.engineer 域名**：品類定義性質的域名本身就是護城河
4. **Andrej Karpathy / Jensen Huang 級別的講者**：需要活動本身有足夠影響力

### 可改造的版本

| AI Engineer 做法 | quidproquo 可改造版 |
|---|---|
| 每年 8 場大型活動 | 每月 1 場線上座談 / podcast 錄影 |
| 150+ 場演講 | 每場邀 2–3 位來賓 |
| 專業 AV 設備 | OBS + 好麥克風 |
| 2,200 CFP | 主動邀約 + 社群推薦 |
| Thumbnail A/B 測試 | 同工具，免費可用 |

---

## 八、結論

AI Engineer YouTube 頻道的「穩定產出」不是靠個人紀律或團隊人海戰術，而是靠**結構性優勢**：

> **會議組織的副產品（演講錄影）恰好是 YouTube 的完美內容。**

這個模式的核心洞見是：**把「內容製作」從「個人創作行為」轉變成「組織活動的附帶產出」**，從根本上消除了創作者最大的敵人——內容枯竭和產出不穩定。

---

## 來源

1. https://www.ai.engineer/about — 官方 About 頁
2. https://vidiq.com/youtube-stats/channel/@aidotengineer — vidIQ 數據
3. https://swyx.io/about — Swyx 個人頁
4. https://swyx.io/aiewf-2024 — World's Fair 2024 組織心得
5. https://www.latent.space/p/2026 — Latent Space 2026 年度計畫
6. https://gocontentflow.com/summary/how-the-ai-engineer-conference-went-from-500-to-7200-attendees-w-the-founder-of-ai-engineer-sw-tu_vv — ContentFlow 訪談摘要
7. https://digg.com/tech/gioiwobg — Thumbnail A/B 測試報導
8. https://dx.tips/the-most-underrated-keynote-ive-ever-seen — Swyx 對演講設計的思考
9. https://x.com/swyx/status/2089798658225266806 — Thumbnail 實驗公開推文
10. https://www.ai.engineer/love — Wall of Love 社群回饋
