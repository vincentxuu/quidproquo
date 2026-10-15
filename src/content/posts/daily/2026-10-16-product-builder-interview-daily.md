---
title: "Product Builder 面試日練 — 2026-10-16：Growth & Experimentation"
date: 2026-10-16
category: daily
type: digest
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "星期五輪到 Growth & Experimentation——漲使用者數的題目考的不是戰術，是能不能把模糊目標拆成漏斗或迴圈、找到真正的漏點；練一題 AllthingsPM 題庫收錄的 Suno 真題：首次生成留存強，但只有 18% 的新創作者在 7 天內做出第二首歌。"
tldr: "今天練 Growth PM 的答題骨架：先定義成長指的是獲客、留存還是付費，再用 AARRR 拆漏斗、判斷產品是靠漏斗還是靠迴圈成長；診斷漏點要先分群再下假設，排序實驗用 ICE，主指標一定要配領先指標與防呆的 guardrail。練習題是 Suno 的留存掉點題，案例是 Calendly 的病毒迴圈——約時間這件事雙邊同時卡住，這種條件大多數 B2B 產品學不來。"
series:
  name: "Product Builder 面試日練"
  order: 58
---

> 🌏 [English version](/posts/daily/2026-10-16-product-builder-interview-daily-en)

## 今日主題

星期五輪到 Growth & Experimentation。前面幾天練的是「這個功能該不該做」「怎麼定義成功」，今天換成一個更具體的問題：一個數字掉了，或者老闆丟一句「想想怎麼讓這個產品自己長」，你要在 30 分鐘內把它拆成漏斗、診斷、一個排好序的實驗、一個防呆指標，講出來還要讓人信。Growth 面試最怕候選人跳過拆解直接開藥方——先加分享功能、先做 push 通知——面試官真正在看的是你有沒有先找到漏在哪裡。

## 核心框架速記

### AARRR：先把漏斗拆成五段

Dave McClure 在 2007 年提出的「海盜指標」，把成長拆成五個可以分別診斷的階段：

| 階段 | 問的問題 |
|---|---|
| Acquisition 獲客 | 使用者怎麼找到你？ |
| Activation 開通 | 第一次有價值的體驗是什麼？ |
| Retention 留存 | 他們會回來嗎？ |
| Referral 推薦 | 他們會不會跟別人說？ |
| Revenue 營收 | 他們會不會付錢？ |

多數候選人只背得到這張表，面試官真正想聽的是：你會不會先問「這題的成長指的是哪一段」，而不是把五段都講一遍。

### 迴圈不是漏斗：被問策略題時要換框架

Reforge 的 Brian Balfour 的論點是：漏斗把每個階段切給不同團隊——行銷管獲客、產品管留存、業務（如果是 B2B）管營收——但這樣切會漏掉「產品本身怎麼自己長大」。迴圈不一樣：一輪的產出會變成下一輪的輸入，自己滾動、會疊加。碰到「某產品要怎麼解鎖更多成長」這類策略題，答漏斗會被打回，答案要換成：

1. 先指出現在有哪個迴圈在跑（例如使用者邀請同事、同事產生內容、內容又吸引新使用者）
2. 找出迴圈裡最弱的一環（例如被邀請的人從來不發內容）
3. 提出一兩個新迴圈
4. 用週期時間和每一輪新增多少使用者衡量迴圈健不健康

### 排序實驗：ICE

列出三四個候選實驗後，用 Impact（影響力）× Confidence（信心）× Ease（容易度）打分。Sean Ellis 最早提出這個捷徑，Itamar Gilad 補了一句很關鍵的話：信心分數要來自證據，不是樂觀——沒有數據或過去案例撐著的「我覺得這個會紅」不該打高分。

## 今日練習題

### 題目

Suno 的手機 App 首次生成歌曲的體驗很強，但新創作者裡只有 18% 會在 7 天內做出第二首歌。你會怎麼診斷這個掉點、拆漏斗、挑出最關鍵的領先與落後指標，並排序第一輪該做的產品改動或實驗？

（來源：AllthingsPM 題庫，Growth PM 面試真題）

### 拆解思路

1. **釐清問題**：先確認這題的「成長」指的是什麼。題目把「做出第二首歌」直接當成留存信號，所以假設目標是養成每週創作的習慣，不是單次營收。
2. **定義漏斗**：裝機 → 首次生成 → 聽／分享第一首 → 回訪 → 第二首歌。掉點發生在首次生成之後、第二首之前。
3. **結構化分析**：分群看那 82% 沒回來的人——有沒有分享過第一首歌？是不是碰到免費額度上限？是從別人分享的連結進來聽朋友的歌，還是自己搜尋「AI 音樂生成器」進來的？這兩種人的意圖完全不同，混在一起看平均數會誤判。
4. **提出方案**：候選實驗可能有——在結果頁加一個「remix」提示（換個風格重新生成同一首歌）、第二天發一則帶風格建議的通知、把草稿存起來讓使用者回來接著做。用 ICE 排序，remix 提示通常最便宜，也最貼近使用者剛感覺到「這是我做的」那個瞬間。
5. **定義成功**：主指標是 7 天內做出第二首歌的新創作者比例；領先指標是第一天的 remix 點擊率，不用等七天就能提早知道方向對不對；guardrail 是 30 天留存和每個使用者的運算成本，避免用免費額度換來一堆短命的創作。

### 範例回答（面試時可以這樣講）

> **先把 18% 拆開看，不急著反應。** 我不會馬上說「加個分享按鈕」，因為那 82% 沒做第二首歌的人裡，可能混著完全不同的狀況——用完免費額度就卡住的、聽完朋友分享的歌就走沒打算自己做的、生成完覺得不夠滿意直接放棄的。我會先抓最近兩週的新創作者，按「有沒有分享過第一首歌」「是搜尋進來還是被分享連結帶進來」「有沒有碰到免費額度上限」分群，看 82% 裡各佔多少。
>
> **再挑最便宜又最貼近價值的實驗。** 假設分群後發現最大一塊是生成完就離開、沒被引導做第二次，我會先在結果頁加一個 remix 提示——同一首歌換個風格重新生成一次，改動小、成本低，而且直接接在使用者剛體驗到「這首歌是我做的」那個瞬間後面。第二天通知和草稿儲存排在後面測，因為要等 remix 那組的數據回來，才知道是不是真的解決了問題，不是在猜。
>
> **指標分三層看，不是看一個數字就下結論。** 主指標是 7 天內做出第二首歌的比例；領先指標是第一天的 remix 點擊率，可以提早判斷方向對不對；guardrail 是 30 天留存和每個使用者的運算成本——如果 remix 讓第二首的比例衝高了，但這些人 30 天後還是流失，代表只是拿免費額度換出一堆短命的創作，不是真的養成習慣。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先把掉點比例拆成不同分群，不是整體套用 | |
| 用漏斗或迴圈定位掉點發生在哪一段 | |
| 實驗排序有講取捨邏輯（ICE 或類似方式） | |
| 主指標、領先指標、guardrail 三層都講到 | |
| 說清楚什麼結果出現會讓你改變判斷 | |
| 加分：把掉點連回產品是靠漏斗還是靠迴圈成長 | |

## 今日案例

**Calendly：約時間這件事本來就是雙邊同時卡住的問題**

OpenView 合夥人、也是 Calendly 投資人與董事會成員的 Blake Bartlett，在 Sacra 的訪談裡解釋 Calendly 怎麼長出迴圈：約時間不是單人任務，發連結的人跟收連結的人在同一個時間點都卡在「要約時間」這件事上。收到連結的人點進去，看到的是自己要填的時段，等到他要約下一個人時，也會申請一個帳號、發出自己的連結。使用這個產品的動作本身就是在推廣它。

**面試連結**：回答「怎麼判斷一個產品值不值得投資源做病毒迴圈」時，這個案例是判斷標準，不是抄作業的範本。重點不是「加邀請功能」，而是「核心工作流程裡本來就有一個還不是使用者的人，而且他跟現有使用者在同一時間有同一個需求」。多數 B2B 產品是單人使用，硬加分享提示或推薦獎勵換不來這個條件，只會在原本順暢的流程裡加摩擦。

## 延伸閱讀

- [Growth PM Interview Questions: The Framework, Worked Examples and a Practice Plan (2026)](https://allthingspm.app/blog/growth-pm-interview-questions) — 完整五步答題框架與三道真題逐步拆解
- [Growth Loops Explained: What They Are, Types & How They Beat Funnels](https://growthmethod.com/growth-loops/) — 迴圈的四種類型與各自的案例
- [7 Product-Led Growth Examples for B2B Companies](https://thehigherpitch.com/blogs/product-led-growth-examples/) — 七種 PLG 機制、各自的成立條件與破局點

## 參考資料

- [Growth PM Interview Questions — AllthingsPM](https://allthingspm.app/blog/growth-pm-interview-questions) — 核心框架：五步答題骨架、AARRR、迴圈 vs 漏斗、ICE；練習題來源：Suno 留存掉點真題
- [Growth Loops Explained — Growth Method](https://growthmethod.com/growth-loops/) — 迴圈定義與四種類型補充
- [7 Product-Led Growth Examples for B2B Companies — The Higher Pitch](https://thehigherpitch.com/blogs/product-led-growth-examples/) — 今日案例：Calendly 病毒迴圈的機制說明
- [Blake Bartlett, partner at OpenView, on the future of product-led growth — Sacra](https://sacra.com/research/blake-bartlett-openview-future-product-led-growth/) — Calendly 案例原始訪談出處
