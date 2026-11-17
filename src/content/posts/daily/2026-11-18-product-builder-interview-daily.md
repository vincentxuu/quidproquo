---
title: "Product Builder 面試日練 — 2026-11-18：Strategy & Execution"
date: 2026-11-18
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: zh-TW
description: "Strategy & Execution 面試日練:用 Bezos 的一道門/兩道門框架判斷一個退場決定能不能回頭,再練一道 Google Cloud 退場題——要 commit 一個具體產品,而不是列一串退場的常見理由。"
tldr: "今天的核心是退場決策要先問這是一道門還是兩道門,再用戰略吻合度、重疊度、使用趨勢、維運成本、對客戶的傷害五個準則篩出一個具體產品——練習題是 Google Cloud 退場案例,今日案例是 Google Cloud IoT Core 在 2022 年公告、2023 年真正關閉的歷程。"
series:
  name: "Product Builder 面試日練"
  order: 91
---

> 🌏 [English version](/posts/daily/2026-11-18-product-builder-interview-daily-en)

## 今日主題

Strategy 面試問到「你會砍掉哪個產品」時,多數人的反射動作是列一串「產品退場的常見理由」——使用率低、維運成本高、跟別的產品重疊——聽起來很有道理,但面試官要的不是一張檢查清單,是一個具體名字,以及為什麼不是旁邊那三個看起來同樣可以砍的候選。今天用兩件事練這個落差:Bezos 的一道門/兩道門框架練「這個決定還能不能回頭」,再用一道真實的 Google Cloud 退場題練「commit 一個名字,然後把排除別的候選的理由講清楚」。

## 核心框架速記

### 框架一:一道門 vs 兩道門決策

Jeff Bezos 在 Amazon 2015 年的股東信裡把決策分成兩種,決定了要花多少時間、拉多少人討論:

| 類型 | 定義 | 決策方式 | 退場決定裡的位置 |
|---|---|---|---|
| **Type 1(一道門)** | 做了就回不去,或回頭代價極高 | 慢下來,找夠多資料跟夠高層級的人一起決定 | 完全關閉服務、刪除資料、斷開既有客戶的整合 |
| **Type 2(兩道門)** | 做錯了可以回頭,代價不高 | 快速決定,交給個人或小團隊,不用等共識 | 暫停新客戶註冊、停止行銷資源投入、把功能移到維護模式 |

Bezos 在信裡特別提醒,多數組織的問題不是把一道門決策做得太草率,是把兩道門決策也當成一道門來拖——退場決定常常卡在這裡:團隊把「先停止新客戶註冊,觀察三個月」這種本來可逆的動作,當成跟「完全關閉服務」一樣重的決定去走審批,結果該快的也慢了。

### 框架二:退場五準則

面試官真正要聽的,是你有沒有一套可以套在任何候選產品上的篩選準則,而不是針對這一題現掰的理由:

| 準則 | 要問的問題 | 常見誤判 |
|---|---|---|
| **戰略吻合度** | 這個產品還在往公司現在要走的方向出力,還是在服務一個已經放棄的賭注 | 用「現在還有沒有人用」取代「這個方向還要不要走」 |
| **重疊度** | 組合裡有沒有別的產品已經覆蓋同一個使用情境 | 只看功能表面像不像,沒看底層客群跟定價是不是真的重疊 |
| **使用趨勢** | 使用量、啟用數、續約率是在漲、持平,還是在跌 | 只看單一季度的數字,沒看趨勢是不是已經連續好幾個週期往下 |
| **維運成本** | 這個產品要花多少工程、支援、合規資源才能繼續活著 | 低估「維持現狀」本身也要付出持續的機會成本 |
| **對客戶的傷害** | 退場會讓哪些客戶付出遷移成本,他們有沒有替代路徑 | 只算退場當下的成本,沒算客戶因此對整個組合失去信任的長期成本 |

這五個準則要同時套用,才能解釋「為什麼不是另外兩個候選」——這是面試官最常見的追問。

```diagram
title: 退場候選怎麼收斂成一個名字
desc: 從整個 Google Cloud 產品組合出發,先用戰略吻合度與重疊度篩掉明顯不該砍的候選,再用使用趨勢與維運成本檢查剩下的候選,最後 commit 一個具體產品,並寫下為何其他候選被留下。
caption: 示意:層的寬度代表候選數量的收斂方向,不是實際家數。
---
<svg viewBox="0 0 640 460">
  <path class="dg-axis" d="M24 40V440" marker-end="url(#arrow)"/>
  <text class="dg-small" x="36" y="40" dominant-baseline="central">愈往下,候選愈收斂</text>

  <polygon class="dg-box" points="40,32 600,32 552,132 88,132"/>
  <polygon class="dg-box" points="88,136 552,136 504,236 136,236"/>
  <polygon class="dg-box" points="136,240 504,240 456,340 184,340"/>
  <polygon class="dg-box dg-box--accent" points="184,344 456,344 408,444 232,444"/>

  <text class="dg-label" x="320" y="72" text-anchor="middle" dominant-baseline="central">整個產品組合</text>
  <text class="dg-sub" x="320" y="92" text-anchor="middle" dominant-baseline="central">全部候選,含看起來能砍的</text>

  <text class="dg-label" x="320" y="176" text-anchor="middle" dominant-baseline="central">戰略吻合度 + 重疊度</text>
  <text class="dg-sub" x="320" y="196" text-anchor="middle" dominant-baseline="central">排除看起來能砍但其實該留的</text>

  <text class="dg-label" x="320" y="280" text-anchor="middle" dominant-baseline="central">使用趨勢 + 維運成本</text>
  <text class="dg-sub" x="320" y="300" text-anchor="middle" dominant-baseline="central">排除數據還不夠支撐的候選</text>

  <text class="dg-label dg-text--accent" x="320" y="384" text-anchor="middle" dominant-baseline="central">選定具體產品</text>
  <text class="dg-sub" x="320" y="404" text-anchor="middle" dominant-baseline="central">寫下為何排除其他候選</text>
</svg>
```

## 今日練習題

### 題目

「假設你是 Google Cloud 的產品經理,請從 Google Cloud 的產品組合裡選一個產品退場,並說明為什麼退場比繼續投資更合理。只列出『產品退場的常見理由』但沒有指名一個具體產品,不算回答這題。」(來源:PracHub 原創練習題,情境設定為 Google Cloud PM,非官方驗證雇主真題)

### 拆解思路

1. **先問清楚退場的定義和你的角色**:跟面試官確認「退場」指的是停止新客戶註冊、完全關閉服務,還是整併進另一個產品——這三種的影響範圍差一個量級。同時確認自己是這個產品的負責人,還是在建議整個組合的方向,角色不同,能動用的證據跟決策權限也不同。
2. **套用退場五準則掃過整個組合**:戰略吻合度、重疊度、使用趨勢、維運成本、對客戶的傷害,逐一套用,先篩出三到五個「看起來可以砍」的候選,不要只憑直覺挑一個「聽起來很少人用」的產品。
3. **判斷這是一道門還是兩道門決策**:「完全關閉服務」幾乎都是一道門——客戶的整合斷了、資料刪了,通常回不去;所以要比「先停止新客戶註冊,觀察使用趨勢」這種兩道門動作,蒐集更多證據才能按下去。這一步決定接下來要花多少篇幅去談風險跟退路。
4. **commit 一個具體產品,並說明為什麼其他候選被留下**:選一個名字,講清楚它在五個準則上的分數,再點名一兩個同樣看起來能砍的候選,說明它們為什麼被留下——通常是因為一小群高價值客戶高度依賴,或是戰略吻合度其實比表面數字更高。
5. **規劃客戶遷移路徑,並定義一年後要看的指標**:企業客戶需要多長的通知期跟遷移路徑,支援窗口怎麼安排;退場之後要追蹤的不只是省下多少維運成本,還要追蹤既有客戶的續約率跟信任分數有沒有因為這次退場而下滑,這才是檢驗「這次退場是不是對的決定」的真正指標。

### 範例回答(面試時可以這樣講)

> **先定義範圍,再套準則**:「我會先跟面試官確認,這裡的『退場』指的是完全關閉服務,不是整併或改名——這會決定我接下來講的風險等級。確認之後,我會用戰略吻合度、重疊度、使用趨勢、維運成本跟對客戶的傷害五個準則,掃過組合裡所有跟核心基礎設施關係較弱的周邊產品,先篩出幾個看起來都可以砍的候選。」
>
> **commit 一個名字,講清楚為什麼不是別的候選**:「我會選一個使用趨勢連續下滑、且市面上已經有專門的第三方供應商可以接手同一個使用情境的產品——因為這代表退場不是把客戶丟在半路,而是把他們導向本來就更專精的選項。另外兩個同樣使用率不高的候選我會留下,一個是因為少數幾個大型企業客戶把它當成唯一的整合路徑,硬退場的信任成本太高;另一個是因為它的使用量低但戰略吻合度其實很高,是公司押注下一個方向的早期產品,不該用現在的使用數字去判斷。」
>
> **講清楚這是一道門決策,所以要有退路規劃**:「因為完全關閉服務幾乎回不了頭,我會先確認有沒有辦法把它做成兩道門——例如先停止新客戶註冊三個月,觀察既有客戶的反應跟遷移進度,再決定要不要真正關閉。如果一定要直接關閉,我會給企業客戶至少十二個月的通知期跟明確的遷移路徑,一年後我會回頭看的不是省下多少維運成本,是這批客戶的續約率跟淨推薦分數有沒有因為這次退場受影響——如果受影響,代表這次退場的執行方式出了問題,不代表退場這個決定本身是錯的。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點:

| 核對項目 | 有提到? |
|---------|---------|
| 有沒有先問清楚「退場」的定義跟自己的角色 | |
| 有沒有用同一套準則(戰略吻合度/重疊度/使用趨勢/維運成本/對客戶的傷害)篩選,而不是現掰理由 | |
| 有沒有 commit 一個具體產品,而不是只列退場的常見理由 | |
| 有沒有講清楚為什麼其他看起來能砍的候選被留下 | |
| 有沒有判斷這是一道門還是兩道門決策,並據此調整證據門檻 | |
| 加分項:有沒有講清楚客戶遷移路徑跟一年後要追蹤的指標 | |

## 今日案例

**Google Cloud IoT Core:公告十二個月後才真正關閉,卻還是被媒體說成「突然拔插頭」**

Google Cloud 在 2022 年 8 月公告,IoT Core 服務將在 2023 年 8 月 16 日正式關閉:過了那個日期,裝置就無法再透過 MQTT 跟 HTTP 連上 IoT Core,既有連線也會被切斷。Google 給出的官方理由是,客戶的需求可以被專門做 IoT 應用與服務的生態系夥伴服務得更好——這是一個戰略吻合度判斷,不是單純的使用率或成本問題:Google 判斷自己不該再直接經營這塊,而不是這塊業務已經賺不到錢。即便給了整整十二個月的通知期,科技媒體在報導時仍然用「突然拔插頭」(sudden unplugging)來形容這次退場,反映出光有合理的通知期,不代表客戶跟媒體會把這次決定解讀成「溝通得很好」。

**面試連結**:這個案例可以用來回答追問「你要怎麼讓客戶不會把這次退場解讀成『公司其他產品也不穩』?」——IoT Core 的故事示範了光靠通知期長度不夠:十二個月的提前公告已經是業界水準,卻還是被貼上「突然」的標籤,因為公告裡只講了「我們決定退場」,沒有同時講「我們評估過哪些使用情境,幫你們指到哪個生態系夥伴可以接手」。拿今天的練習題來說,如果退場公告只有「這個產品要關了」跟一個日期,信任成本會比公告裡同時附上遷移路徑跟替代方案高得多。

## 延伸閱讀

- [Product Leader Interview Questions: Portfolio Strategy, PM Coaching, and Organizational Decisions](https://prachub.com/resources/product-leader-interview-questions-portfolio-strategy-pm-coaching-and-organizational-decisions) — PracHub 的產品組合策略面試題整理,今天練習題改寫自其中一道 Google Cloud 退場題。
- [One-Way and Two-Way Doors: What Bezos Actually Said](https://rcmlabs.io/blog/one-way-door-two-way-door-type-1-type-2-decisions/) — 完整還原 Bezos 2015 年股東信裡一道門/兩道門框架的原文脈絡跟常見誤用。
- [Google is killing off Google Cloud IoT Core at five-years-old](https://www.thestack.technology/google-cloud-iot-core-retired-killed-by-google/) — 今天案例的原始報導,附 Google 官方退場理由全文。

## 參考資料

- [Google: Choose one Google Cloud product to retire and justify the decision](https://prachub.com/interview-questions/choose-one-google-cloud-product-to-retire-and-justify-the-decision) — 今日練習題的原始出處,附拆解思路對應的澄清問題與強答案標準。
- [One-Way and Two-Way Doors: What Bezos Actually Said](https://rcmlabs.io/blog/one-way-door-two-way-door-type-1-type-2-decisions/) — 框架一(一道門/兩道門決策)的出處。
- [Google Cloud to retire IoT Core service in 2023](https://www.itpro.com/network-internet/internet-of-things-iot/368845/google-cloud-to-retire-iot-core-service-in-2023) — 今日案例 Google 官方退場理由引述的出處。
- [Google is killing off Google Cloud IoT Core at five-years-old](https://www.thestack.technology/google-cloud-iot-core-retired-killed-by-google/) — 今日案例「突然拔插頭」媒體用語的出處,以及完整的公告與關閉時間軸。
