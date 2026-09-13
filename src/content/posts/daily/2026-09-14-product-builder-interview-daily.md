---
title: "Product Builder 面試日練 — 2026-09-14：Product Sense"
date: 2026-09-14
category: daily
type: digest
tags: [product-builder-interview, daily, product-sense]
lang: zh-TW
description: "今日練 Product Sense：用 CIRCLES 框架拆解一道 Google PM 面試真題「你是 Waymo 的 PM，設計一個新功能」，案例是 Slack 從失敗遊戲 Glitch 的內部工具長出來的故事。"
tldr: "Product Sense 題最常見的失誤，不是想不出功能，是跳過『使用者是誰、他們真正卡在哪裡』直接開始列功能清單。今天用 CIRCLES 框架練一道 Google PM 面試真題——『你是 Waymo 的 PM，設計一個新功能』，重點放在 Comprehend 跟 Identify 這兩步怎麼問對問題，而不是急著給方案。案例是 Slack 怎麼從一款失敗的遊戲 Glitch 裡，靠團隊內部真正離不開的溝通工具長出來——示範『觀察使用者實際在用什麼』比『問使用者想要什麼』更接近產品洞察的核心。"
series:
  name: "Product Builder 面試日練"
  order: 26
---

> 🌏 [English version](/en/posts/daily/2026-09-14-product-builder-interview-daily-en)

## 今日主題

Product Sense 題考的不是「你能不能想出一個聰明的功能」，是「你有沒有先搞清楚要解決誰的什麼問題」。多數人一聽到「幫某產品設計一個新功能」，反射動作是立刻開始腦力激盪功能清單，結果面試官打斷問「這個功能是為了解決哪個使用者的什麼痛點」時,答不出來——這是 Product Sense 輪最常見的翻車點,而且通常發生在開場前五分鐘。

這一類題目在 2026 年的面試裡有一個新變化：越來越多面試官會追問「這個功能如果交給 AI 來執行,你會怎麼設計信任邊界」,即使題目本身沒提到 AI。今天的練習題刻意選一個實體服務（自駕車）的場景，練習把注意力放在「觀察使用者行為」這一步，而不是急著討論技術可行性。

## 核心框架速記

### CIRCLES：把開放式問題拆成七個可控步驟

Product Sense 題最常用的骨架，重點不是背下七個字母，是強迫自己在「列功能」之前先花時間在前兩步：

| 步驟 | 內容 | 這一步要做什麼 |
|------|------|---------|
| **C**omprehend | 釐清情境 | 問清楚題目範圍：哪個平台、哪個市場、成功的定義是什麼 |
| **I**dentify | 定義使用者 | 列出可能的使用者分群，選一個最值得深挖的 |
| **R**eport | 找出需求 | 針對選定的分群，具體講出他們的痛點跟現有替代方案為什麼不夠好 |
| **C**ut through | 收斂優先序 | 從痛點裡挑一個最值得解的，講出為什麼是這個而不是別的 |
| **L**ist solutions | 列出方案 | 針對收斂後的痛點，列 2-3 個方向不同的解法 |
| **E**valuate | 評估取捨 | 講每個方案的成本、風險、跟其他方案比起來的優劣 |
| **S**ummarize | 總結建議 | 收斂成一個推薦方案，講清楚衡量成功的指標 |

多數人卡關的地方是把 C（Comprehend）跟 I（Identify）當成場面話，兩三句話就跳過去。實際上這兩步花的時間應該佔整場作答的三分之一以上，因為後面所有方案的品質都取決於這裡選對了使用者跟問題。

## 今日練習題

### 題目

「你是 Waymo（Google 旗下的自駕計程車服務）的 PM，要設計一個新功能。」

（來源：Aced（原 Exponent）《Google Product Manager (PM) Interview Guide》整理的候選人回報真題；題型：Product Sense / Product Design）

### 拆解思路

1. **釐清問題**：先問面試官——這個新功能是要解決現有 Waymo 乘客的問題，還是要拉來還沒用過自駕車的新使用者？服務的城市是既有的鳳凰城/舊金山這種成熟市場，還是新拓展的城市？
2. **定義使用者**：把「Waymo 乘客」拆成至少三種：獨自搭車的通勤族、帶小孩或長輩的家庭乘客、深夜搭車的乘客（對安全感需求特別高）。選一個切入——例如深夜乘客，因為自駕車少了司機這個「人陪著」的心理安全感，是自駕車特有、傳統計程車沒有的痛點。
3. **結構化分析**：針對深夜乘客，用 Report 步驟具體講痛點——沒有司機可以確認「車子真的在往對的方向走」、遇到路上有人靠近車窗時沒有人能即時反應、下車地點如果是陰暗巷口會猶豫要不要下車。這些痛點是自駕車情境獨有的，不是把計程車功能複製過來就能解決。
4. **提出方案**：列 2-3 個方向不同的解法——即時視訊連線客服（人力成本高但安全感最強）、AI 語音助理主動描述路況與剩餘時間（成本低但心理安全感較弱）、動態調整下車點讓乘客用 app 微調到明亮處再下車（技術可行但需要重新規劃路權）。針對成本、安全感強度、跟工程複雜度做取捨,選一個推薦方向。
5. **定義成功**：講清楚會用什麼指標驗證這個功能有效——例如深夜時段的乘客滿意度分數、深夜訂單的回頭率、客服/緊急按鈕的觸發率是否下降，而不是只講「乘客會更安心」這種無法衡量的說法。

### 範例回答（面試時可以這樣講）

> **先收斂使用者，不要一開始就列功能**：「在開始想功能之前，我想先確認一件事——Waymo 現在深夜時段（晚上十一點到清晨五點）的訂單量跟滿意度分數，跟白天比起來是什麼狀況？如果深夜時段流失率明顯較高，我會把這個時段的乘客當成今天要解的對象，因為自駕車在深夜情境下有一個傳統計程車沒有的結構性劣勢——少了司機這個人,乘客失去了『有人在幫我留意周遭狀況』的心理安全感。」
>
> **講出具體痛點，不是泛泛的『不安心』**：「深挖之後，我會把這個不安心拆成三個具體情境：車子行進中,乘客沒辦法快速確認『這條路線正常嗎』；車輛在陰暗處臨停時,乘客會猶豫要不要下車；如果路上有陌生人靠近車窗,車上沒有人能立刻反應。這三個情境對應到不同的解法,不能用一個『安全感』功能打包解決。」
>
> **收斂到一個方案並定義成功**：「我會優先做『動態下車點』——乘客可以在抵達前透過 app 把下車位置微調到附近有燈光、有人流的位置，不需要重新規劃路權，工程成本相對低，而且直接對應到深夜乘客最常抱怨的『下車點太暗不敢下車』。上線後我會看深夜時段的乘客滿意度分數、深夜訂單的次月回頭率，以及緊急按鈕觸發率有沒有下降，作為這個功能有沒有真的解決問題的驗證。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 一開始有先問清楚題目範圍（市場、平台、成功定義），沒有直接跳進方案 | |
| 有把使用者拆成至少 2-3 種分群，並講出為什麼選這一群 | |
| 痛點講得具體，是這個情境獨有的，不是隨便套用的形容詞 | |
| 有列出 2-3 個方向不同的方案，並講出取捨（成本、風險、複雜度） | |
| 有講出可衡量的成功指標，不是「使用者會更滿意」這種無法驗證的話 | |
| 加分項：有主動提到如果資料顯示假設不成立，會怎麼調整方向 | |

## 今日案例

**Slack：一款失敗的遊戲，長出一個 280 億美元的辦公室溝通工具**

Slack 的前身 Tiny Speck 原本在開發一款線上遊戲 Glitch。遊戲本身沒能打開市場，2012 年決定收掉，但團隊在開發過程中為了協調分散各地的成員，自己刻出了一套內部聊天與搜尋工具。收掉遊戲後，創辦人 Stewart Butterfield 注意到一件事：團隊已經離不開這個內部工具的即時搜尋、頻道分類、跟第三方服務整合的能力——這些是他們自己每天在用、真心覺得少不了的功能，而不是靠問卷問出來的「使用者說他們想要」。團隊因此把資源整個轉向打磨這個內部工具，2013 年開始對外開放，後來成為 Slack。

**面試連結**：這個案例最適合用在 Identify 跟 Report 這兩步的示範——Slack 團隊沒有去問「你想要什麼溝通工具」，而是觀察「我們自己每天離不開這個工具的哪個部分」。回答 Product Sense 題時，遇到「怎麼確認這是真需求」的追問，可以引用這個邏輯：比起使用者嘴上說想要什麼，觀察使用者已經在用、而且捨不得放掉的行為，是更可靠的產品洞察來源。

## 延伸閱讀

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — Aced（原 Exponent）整理的 Google PM 面試全流程，含 Waymo 這道真題的完整脈絡
- [How Slack co-founder Stewart Butterfield turned a failed game into a $28B workplace platform](https://www.founded.com/how-slack-co-founder-stewart-butterfield-turned-a-failed-game-into-a-28b-workplace-platform/) — Slack 從 Glitch 內部工具長出來的完整故事
- [Feature Prioritization Matrix for Product Teams — still valid in 2026?](https://userpilot.com/blog/feature-prioritization-matrix/) — 2026 年對 RICE／Must-Should-Could 這類優先序框架的實務修正，補充「收斂方案」這一步可以怎麼做

## 參考資料

- [Google Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/google-product-manager-interview) — 對應「今日練習題」Waymo 真題的出處
- [How Slack co-founder Stewart Butterfield turned a failed game into a $28B workplace platform](https://www.founded.com/how-slack-co-founder-stewart-butterfield-turned-a-failed-game-into-a-28b-workplace-platform/) — 對應「今日案例」Slack 從 Glitch 內部工具長出來的過程
- [Product manager interview questions that reveal judgment, not memorized frameworks](https://www.experthire.io/blog/question-bank-product-manager) — 對應「核心框架速記」CIRCLES 中 Comprehend／Identify 兩步為何是整場作答品質關鍵的說明
