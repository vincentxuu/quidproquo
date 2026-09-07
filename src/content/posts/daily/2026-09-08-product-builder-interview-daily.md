---
title: "Product Builder 面試日練 — 2026-09-08：Metrics & Analytics"
date: 2026-09-08
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: zh-TW
description: "今日練 Metrics & Analytics 面試：用 North Star Metric 選擇框架搭配指標樹，拆解一道 Meta PM 面試 analytical thinking round 的真實題目「幫 Instagram Reels 定義北極星指標」，案例是 Netflix 三次更換北極星指標的過程。"
tldr: "Metrics 題最容易失手的地方不是講不出指標，是講出一個聽起來合理、卻沒辦法回答『這個指標漲了代表什麼』的名詞。今天用 Lenny Rachitsky 整理的六類北極星指標框架收斂候選範圍，再疊一層指標樹把北極星拆成 output／input／guardrail，練 Meta PM analytical thinking round 常出現的『幫 Instagram Reels 定義北極星指標，並說明如果資源傾向 Reels、犧牲 Stories 會有什麼取捨』。案例是 Netflix 從 DVD 準時到貨率換到串流 15 分鐘觀看率、再換到每月觀看時數中位數的三次北極星指標轉向，示範指標怎麼跟著策略走。"
series:
  name: "Product Builder 面試日練"
  order: 20
---

> 🌏 [English version](/en/posts/daily/2026-09-08-product-builder-interview-daily-en)

## 今日主題

Metrics & Analytics 這輪考的不是背誦 AARRR 或北極星指標的定義，是看你能不能在題目沒給任何選項的情況下，自己定義一個指標，並且撐住後續的追問。Meta 的 analytical thinking round 就是典型範例：面試官會給一個開放題目，例如「幫某個產品定義北極星指標」，然後在你講完之後才丟出真正的難點——兩個指標互相打架時要怎麼選。

多數人會卡在選了一個指標之後，講不出「這個指標漲了，公司到底賺到了什麼」。今天用北極星指標選擇框架先收斂候選範圍，再用指標樹把「選哪個指標」拆成「這個指標底下有哪些槓桿可以拉」，讓答案禁得起追問。

## 核心框架速記

### 北極星指標選擇框架：先問屬於哪一類

Lenny Rachitsky 訪談 40 多家成長期公司整理出六類北極星指標，選哪一類取決於商業模式，不是憑感覺挑：

| 類別 | 代表公司 | 適用商業模式 |
|------|---------|------|
| 消費成長（Consumption） | Airbnb（訂房晚數）、Uber（乘車數） | 抽成型市集，用量直接等於收入 |
| 互動成長（Engagement） | Facebook、Snap（DAU） | 廣告驅動，流量本身就是變現來源 |
| 客戶成長（Customer growth） | Tinder（付費帳號占比）、Webflow | 訂閱制，付費轉換比互動更關鍵 |
| 成長效率（Growth efficiency） | Blue Apron、Casper（毛利） | 實體商品或高行銷投入，單位經濟優先 |
| 使用者體驗（UX） | Robinhood、Superhuman（NPS） | 產品靠體驗差異化取勝 |
| 營收（Revenue） | Figma、Notion（ARR） | 業務成熟、B2B 銷售導向 |

**常見失誤**：把營收直接當北極星。Rachitsky 指出營收波動太大（匯率、定價、合約週期都會干擾），而且對團隊缺乏激勵感——沒有人是為了「讓營收數字變大」而加入公司的。

### 指標樹：把北極星拆成 Output / Input / Guardrail

北極星本身很少能被單一團隊直接推動，要拆成三層才能變成可以執行的目標：

| 層級 | 定義 | 範例（Airbnb「訂房晚數」） |
|------|------|------|
| Output（北極星） | 公司整體的成功指標 | 訂房晚數 |
| Input（槓桿指標） | 各團隊可以直接影響的分量 | 訪客轉換率、新增房源數、站內流量 |
| Guardrail（護欄指標） | 防止 Input 被過度優化而傷害體驗 | 房客投訴率、房東取消率 |

面試時被追問「這個指標會不會被打假球」，答案要從 guardrail 層回答，而不是重新解釋北極星本身。

## 今日練習題

### 題目

「幫 Instagram Reels 定義一個北極星指標，並解釋如果公司決定把資源優先投入 Reels、相對犧牲 Stories，會有什麼取捨。」

（來源：Aced（原 Exponent）《Meta Product Manager (PM) Interview Guide》整理的 analytical thinking round 真實提示；題型：Analytical thinking round）

### 拆解思路

1. **釐清問題**：先確認範圍——這裡的「資源」是工程資源還是首頁版位的曝光配置？時間框架是一季還是一年？北極星要對齊公司整體的哪個目標（使用者時長、廣告營收，還是創作者生態）？
2. **列出候選指標並分類**：套用六類框架，Reels 屬於「消費成長」類（比較接近 Twitch 的 UGC 消費模式），候選包括「每位 DAU 觀看 Reels 的時長」「Reels 完播率」「發布 Reels 的創作者數」。
3. **用 JTBD 反推北極星**：Reels 的 job to be done 是「用零碎時間刷到有趣的短影音」，不是「發布內容」。所以消費端指標（觀看時長）比生產端指標（發布數）更貼近使用者真正要完成的任務，選「每位 DAU 觀看 Reels 的時長」當北極星。
4. **提出取捨**：把首頁流量與工程資源往 Reels 傾斜，會直接壓縮 Stories 的曝光位置，Stories 的每日發布量可能下滑。因為 Reels 是公開分發、Stories 是私密社交分享，兩者滿足的任務不同，並不是簡單的此消彼長，要講清楚哪些使用情境會被犧牲。
5. **定義成功**：主要指標是「每位 DAU 觀看 Reels 的時長」；guardrail 是「Stories 每日發布量」與「App 整體使用時長」，避免 Reels 只是把使用者原本花在 Stories 上的時間搬過來，而不是真的創造新的消費。

### 範例回答（面試時可以這樣講）

> **問題釐清**：「我想先確認範圍——這裡的資源傾斜，我會假設是首頁版位曝光跟推薦系統的工程資源，時間框架抓一季。我想先問一下，這題的北極星目標是要對齊使用者時長、還是廣告營收成長？我會先假設是時長，因為 Reels 現階段的角色比較像留住用戶注意力，而不是直接變現。」
>
> **指標選擇**：「我會把 Reels 歸在消費成長這類，跟 Twitch 的邏輯接近——使用者的任務是『用零碎時間刷到有趣的短影音』，不是『發布內容』。所以我會選『每位 DAU 觀看 Reels 的時長』當北極星，而不是發布數或完播率，因為觀看時長最貼近使用者真正想完成的任務，也最能預測留存。」
>
> **取捨與護欄**：「如果把首頁版位跟推薦系統資源往 Reels 傾斜，Stories 的曝光跟發布誘因會被壓縮，因為兩者都在搶同一塊首頁版位跟使用者的注意力。這不代表不能做，但我會設兩個 guardrail：Stories 每日發布量不能掉超過某個門檻，還有 App 整體使用時長要維持穩定成長，而不只是 Reels 時長上升，確認我們是在創造新的消費，不是把使用者原本花在 Stories 上的時間搬過去而已。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 用澄清問題把「資源」「時間框架」「對齊目標」收斂清楚 | |
| 北極星指標有對應到六類框架中的具體類別，不是隨口講一個名詞 | |
| 用 JTBD 或使用者任務解釋為什麼選這個指標，不是憑直覺 | |
| 講清楚取捨的機制（為什麼會犧牲、犧牲的是什麼情境） | |
| 成功指標有主要指標 + guardrail，不只講一個數字 | |
| 加分項：提到指標可能被「假性優化」（cannibalization）的風險 | |

## 今日案例

**Netflix：北極星指標跟著商業模式換了三次**

Netflix 的北極星指標換過的次數，比大多數人能數出來的還多。DVD 郵寄時代，它盯著「DVD 隔天送達率」——因為那個年代，體驗的瓶頸是物流準時度。轉型串流之後，這個指標立刻失去意義：串流沒有「等待寄送」這個環節，於是它換成「每月觀看串流內容超過 15 分鐘的會員比例」，用一個很低的門檻先確認會員有沒有真的用起串流功能。等串流業務成熟、多數會員都跨過那個門檻之後，這個指標也失去鑑別力，於是再換成「每月觀看時數中位數」，改成衡量使用強度，而不是「有沒有用」這種二元問題。

**面試連結**：這個案例是「指標要跟著策略階段換」的最佳示範，可以直接拿來回答「你會怎麼決定要不要換北極星指標」或「舉一個公司調整核心指標的例子」。重點不是背這三個指標名稱，是講清楚換指標背後的邏輯——舊指標失去鑑別力（大多數人都達標，再也分不出好壞），就是該考慮換的訊號。

## 延伸閱讀

- [Meta Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/meta-product-manager-interview) — Meta PM 面試全流程拆解，含 analytical thinking round 的真實提示與追問模式
- [Choosing Your North Star Metric](https://future.com/north-star-metrics) — Lenny Rachitsky 訪談 40 多家成長期公司整理的六類北極星指標框架與案例
- [What is a North Star metric?](https://mixpanel.com/blog/north-star-metric) — Mixpanel 對指標樹（output／input metric）的圖解說明

## 參考資料

- [Meta Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/meta-product-manager-interview) — 對應「今日主題」與「今日練習題」的題目來源
- [Choosing Your North Star Metric](https://future.com/north-star-metrics) — 對應「核心框架速記」六類北極星指標表格與「今日案例」Netflix 換指標的過程
- [What is a North Star metric?](https://mixpanel.com/blog/north-star-metric) — 對應「核心框架速記」指標樹（Output／Input／Guardrail）的分層說明
