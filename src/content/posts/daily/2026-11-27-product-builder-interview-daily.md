---
title: "Product Builder 面試日練 — 2026-11-27：Growth & Experimentation"
date: 2026-11-27
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "Growth & Experimentation 面試日練：用迴圈乘法算出病毒迴圈的真實倍增率，再用三個實驗讀數陷阱——分組比例不符、提早偷看、組成偏移——拆一題判斷『這是不是病毒迴圈』的練習題，案例看 Flo 的成長 PM 怎麼靠『證據而非解釋』把一個連輸兩次的測試翻成 23% 的勝利。"
tldr: "面試被問『這是不是病毒迴圈』時，先把三段轉換率相乘算出 k 值，再用等比級數換算成整體倍增率，而不是看單一段數字高就下結論。"
series:
  name: "Product Builder 面試日練"
  order: 100
---

> :globe: [English version](/posts/daily/2026-11-27-product-builder-interview-daily-en)

## 今日主題

Growth & Experimentation 面試最容易出現兩種各走極端的答法：一種是聽到「迴圈」就反射性喊「這很病毒」，卻沒把數字相乘算過；另一種是看到 A/B 測試顯示顯著結果就直接說「可以上線」，卻沒檢查這個顯著是不是測試設計本身出了問題。面試官真正要看的不是你會不會背框架名稱，而是你拿到一組數字時，會不會先動筆算，以及看到一個漂亮的結果時，會不會先懷疑它。

## 核心框架速記

**框架一：迴圈乘法（Loop Multiplication）**

一個成長迴圈由幾段轉換率串成，候選人常見的錯誤是只看其中一段數字高就喊「病毒式成長」。正確做法是把每一段相乘算出迴圈係數 k，再用等比級數換算成這個迴圈真正把其他管道帶進來的使用者數乘上多少倍。

```diagram
title: 病毒迴圈的乘法：k = 0.18
desc: 已啟用使用者送出邀請、邀請對象註冊、新使用者啟用三段轉換率相乘得出迴圈係數 k=0.18，再用等比級數換算成整體使用者數的 1.22 倍疊加，而不是真正能自我複製的病毒式擴散。
caption: 數字取自 KORE1《Growth Product Manager Interview Questions 2026》的 Loop multiplication 練習示例；啟用率一欄標為 accent，因為面試中這通常是候選人自己 onboarding 團隊就握有槓桿的一段。
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M128 196H168" marker-end="url(#arrow)"/>

  <g>
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">已啟用使用者</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">存量基數</text>
  </g>

  <g>
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">送出邀請</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">1.5 次／人</text>
  </g>

  <g>
    <rect class="dg-box" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">邀請對象註冊</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">接受率 20%</text>
  </g>

  <g>
    <rect class="dg-box dg-box--accent" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label dg-text--accent" x="68" y="187" text-anchor="middle" dominant-baseline="central">新使用者啟用</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">啟用率 60%</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">累積倍增率</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">Σ ≈ 1.22×</text>

  <text class="dg-edge" x="148" y="182" text-anchor="middle" dominant-baseline="central">寫入</text>
</svg>
```

k 值每往上一點，疊加出來的倍增率不是線性往上，而是越接近 1 越爆發：

| k（三段轉換率相乘） | 整體倍增率 1÷(1−k) |
|---|---|
| 0.18 | 1.22× |
| 0.30 | 1.43× |
| 0.50 | 2.00× |
| 0.90 | 10.00× |

這張表也是面試裡該提的一個警告：k 從 0.5 到 0.9 只差 0.4，倍增率卻從 2 倍跳到 10 倍——而產品早期量到的 k，通常是最死忠的早期使用者撐出來的高點，主流使用者接手後大概率會往下修正。

**框架二：三個實驗讀數陷阱**

算出一個漂亮的結果之後，還有三個常見陷阱會讓這個結果其實站不住：

| 陷阱 | 症狀 | 真正發生的事 | 怎麼檢查 |
|---|---|---|---|
| 分組比例不符（Sample Ratio Mismatch） | 兩組被分到的使用者數量，看起來只是「有點不一樣」 | 隨機分流本身出了問題——bucketing 錯誤、使用者 ID 重複判定、某組載入較慢而在記錄前流失 | 先對實際分到兩組的人數做卡方適合度檢定，比例顯著偏離原定切分就先停，不看結果列 |
| 提早偷看（Peeking） | 還沒跑到預定樣本量，dashboard 顯示 95% 以上信心就想喊停 | 顯著性檢定假設樣本量事先固定；每次看到就檢定一次再決定要不要停，會讓原本 5% 的假陽性率大幅推高 | 開跑前先定樣本量與停止規則，或改用為提早查看設計的序列檢定法 |
| 組成偏移（Simpson's Paradox） | 整體指標變好，沒人分開檢查各子群是不是真的變好 | 每個子群表現其實持平或變差，只是轉換率較高的子群在這段時間佔比上升，把整體平均拉高 | 用上一期的流量組成重新加權這一期數字，子群分開比較，不要只看混合後的總數 |

Evan Miller 對提早偷看做過的推導顯示，在最糟的情況下（每多一筆觀測就檢定一次），假陽性率可以從預期的 5% 一路推到 26.1%——這個數字比「再多等一下」聽起來嚴重得多。

## 今日練習題

### 題目

你的產品團隊發現：每個已啟用（activated）的使用者平均會送出 1.5 次邀請；收到邀請的人裡有 20% 會註冊；新註冊的人裡有 60% 會變成已啟用使用者。產品經理在全員會議上宣布「我們做出了一個病毒迴圈（viral loop）」。這個說法站得住嗎？如果你是面試官，你會怎麼追問？

（來源：改寫自 KORE1〈Growth Product Manager Interview Questions 2026〉的 Loop multiplication 練習）

### 拆解思路

1. **釐清問題**：先問「病毒」的門檻是什麼——嚴格定義是迴圈係數 k ≥ 1（每個使用者平均能帶回至少一個新的已啟用使用者，迴圈能自己無限擴張），不是「有正向效果就算病毒」
2. **定義範圍**：不是做使用者分群，而是先確認「這一圈」的輸入輸出怎麼算——哪些人才算「已啟用」、邀請動作發生在產品的哪個時間點、量測這組數字的時間窗有多長
3. **結構化分析**：把三段轉換率相乘算出 k = 1.5 × 0.2 × 0.6 = 0.18，再用等比級數 1 ÷ (1 − k) 換算成這個迴圈讓其他管道帶進來的使用者數整體乘上多少倍——1 ÷ (1 − 0.18) ≈ 1.22，也就是多了 22%，而不是迴圈本身能自己長大
4. **提出方案**：判斷三段裡哪一段改善成本最低——邀請次數取決於產品在哪個時間點問、問幾次；接受率取決於受邀者看到的內容與邀請人跟他的關係強度；啟用率通常是 PM 自己手上就有槓桿的 onboarding 流程，同時提醒 launch 週測出來的 k 值通常偏高，早期愛好者的邀請行為不能代表主流使用者
5. **定義成功**：不是爭論該不該叫它「病毒」，而是算出這個迴圈值不值得投資——看每一圈要跑多久（lap time），22% 的疊加如果要三個月才跑完一圈，跟兩週跑完一圈，對業務的意義完全不同

### 範例回答（面試時可以這樣講）

> **先拆開「病毒」這個詞和實際數字之間的落差**：「把三段轉換率相乘，1.5 乘 0.2 再乘 0.6 等於 0.18，代表每個已啟用使用者平均只帶回 0.18 個新的已啟用使用者，距離真正能自我複製的病毒迴圈——k 大於或等於 1——還有一大段距離。但這不代表這個迴圈沒用，用等比級數算，1 除以 1 減 0.18，整個迴圈幫其他管道帶進來的使用者數乘上大約 1.22 倍，也就是多了 22% 的免費成長，這個數字要拿去跟付費獲客成本比才有意義。」
>
> **再看三段裡最便宜改善哪一段**：「啟用率的 60% 通常是 onboarding 團隊自己就能動的槓桿，改善它不需要先說服使用者多邀請誰，效果也最直接反映在 k 值上；接受率的 20% 要看受邀者跟邀請人的關係強度，光改文案很難大幅拉高。」
>
> **最後提醒這個 k 值可能被高估**：「launch 第一週願意主動邀請朋友的通常是最死忠的早期使用者，他們的邀請行為不能代表之後主流使用者會怎麼做，所以我會先看這個 0.18 能不能撐過第一個月的主流使用者群再下結論，而不是直接把它寫進成長預測裡。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 把三段轉換率相乘算出 k 值，沒有只看單一段數字 | |
| 用等比級數 1÷(1−k) 換算成整體倍增效果，而不是直接拿 k 當成長率 | |
| 指出 k < 1 時這不是能自我複製的「病毒式」成長 | |
| 判斷三段裡哪一段改善成本最低、槓桿最大 | |
| 提到 launch 初期量到的 k 值可能被早期愛好者高估 | |
| 加分項：提到 lap time（跑完一圈要多久）對業務意義的影響 | |

## 今日案例

**Flo：連輸兩次的測試，靠「證據不是解釋」翻成 23% 的勝利**

Flo 是月活將近 8000 萬的女性健康 app，成長 PM Mike Charniatsou 的團隊想在網頁 onboarding 裡新增一題，用來判斷使用者正處於哪個更年期階段。第一次測試上線，轉換率掉了近 10%；團隊的第一反應是猜測「設計哪裡出了問題」，重跑一次，結果還是掉了差不多的幅度。只有在輸第二次之後，他們才真正拆開使用者資料，發現大約 75% 的使用者被系統判定「無法歸類到任何一個更年期階段」——因為那道問題本身的問法，一般人根本答不出來，而這些人剛點了廣告進來、期待得到答案，看到的卻是一句「抱歉我們判斷不出來，繼續往下走」的死胡同。團隊照這個證據重寫問題的問法與邏輯——判斷不出來的使用者安靜地跳到下一段，而不是卡在原地——第三次測試拿到 23% 的提升，團隊還不敢全信，又跑了一次把這整段拿掉的 blackout test，確認掉了同等幅度，才確定這個 23% 是真的。Charniatsou 的結論是：「解釋通常只告訴你你想相信什麼是真的，證據才告訴你該往哪裡看。」他另一句話同樣值得記下來：「你的 paywall 轉換率不是你的變現策略」——短期的轉換率提升，不代表長期多轉出了多少真正付費的使用者，這也是為什麼他每年年底都會做一次對帳：把一年內所有測試回報的提升百分比加總，檢查公司實際的業務成長是不是真的對得上那個數字。

**面試連結**：這個案例適合回答「說一個你怎麼處理連續失敗的測試」或「怎麼判斷一個 A/B 測試的勝利是不是真的」。可以借用的論點：面對連續失敗的測試，「找一個解釋」和「找新證據」是兩條完全不同的路——解釋永遠找得到，而且通常只會驗證你本來就想相信的假設；只有回頭拆開使用者資料本身，才可能發現「問題寫法讓 75% 的人答不出來」這種具體、可操作的發現。而測出一個勝利之後用 blackout test 再確認、用年度對帳檢查轉換率提升是否真的轉成業務成長，跟框架二裡三個讀數陷阱要防的是同一件事：不要輕易相信自己剛拿到的好消息。

## 延伸閱讀

- [Growth Product Manager Interview Questions 2026 - KORE1](https://www.kore1.com/growth-product-manager-interview-questions/) — 完整題庫，另外還有抽樣比例不符、「八個測試檔位排五個點子」的樣本量取捨、cancel flow 法遵等題目
- [How Not to Run an A/B Test - Evan Miller](https://www.evanmiller.org/how-not-to-run-an-ab-test.html) — 提早偷看為什麼會讓假陽性率飆高的原始推導
- [Diagnosing Sample Ratio Mismatch in A/B Testing - Microsoft Research](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/) — SRM 常見成因清單，包含 bucketing 錯誤、使用者 ID 判定問題、載入速度差異等

## 參考資料

- [Growth Product Manager Interview Questions 2026 - KORE1](https://www.kore1.com/growth-product-manager-interview-questions/) — 對應「核心框架速記」迴圈乘法與三個讀數陷阱的數字來源，以及「今日練習題」的原始出處
- [Flo gets 40% of its subscriptions more than six months after install, and wants to keep it that way - RevenueCat](https://www.revenuecat.com/blog/growth/mike-charniatsou-flo-sub-club-podcast-2026) — 對應「今日案例」Flo 連輸兩次測試後翻盤的完整訪談
- [How Not to Run an A/B Test - Evan Miller](https://www.evanmiller.org/how-not-to-run-an-ab-test.html) — 對應「核心框架速記」提早偷看陷阱的假陽性率數字
