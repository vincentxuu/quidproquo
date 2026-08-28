---
title: "Product Builder 面試日練 — 2026-08-28：Growth & Experimentation"
date: 2026-08-28
category: daily
tags: [product-builder-interview, daily, growth]
lang: zh-TW
description: "今日練 Growth PM 面試：用 Growth Loop 取代 Funnel 思維，配合『Goal→Metric→Bottleneck→Hypothesis→Experiment→Measurement』診斷鏈，練一道『老闆要加碼推薦好友計畫，你要不要照做』的拆解題。"
tldr: "Growth PM 面試最容易踩的坑，不是想不出成長點子，是還沒診斷瓶頸就跳去做『看起來一定對』的方案。今天用 Reforge 的 Growth Loop 框架取代線性 Funnel 思維，搭配六步診斷鏈找出真正的瓶頸，並對照 JobLeads 一個『22 步縮成 5 步、卻毫無影響』的真實實驗，看懂為什麼實驗速度比單次爆款更重要。"
series:
  name: "Product Builder 面試日練"
  order: 9
---

> 🌏 [English version](/en/posts/daily/2026-08-28-product-builder-interview-daily-en)

## 今日主題

Growth & Experimentation 面試考的不是你有沒有很多成長點子，而是你會不會在拿到一個「聽起來就該做」的方案時，先停下來問「我們到底診斷過瓶頸在哪嗎？」。這類題目常見於 Growth PM、PLG 產品組的面試，面試官想看的是你有沒有把「實驗」當成系統性的診斷流程，而不是憑直覺挑一個看起來最合理的功能就衝去做。

多數候選人的盲點，是把成長題答成「我會做 A/B 測試」——卻說不出測試的到底是哪個假設、這個假設從哪個數據或使用者洞察來的。今天要練的，就是從「我有一個好點子」進化到「我先找到瓶頸，再讓瓶頸告訴我該測什麼」。

## 核心框架速記

### Growth Loop：把 Funnel 拆成可以複利的迴圈

AARRR（Acquisition-Activation-Retention-Referral-Revenue）Funnel 是 Dave McClure 在 2007 年提出的框架，幫助一整個世代的人學會用量化階段思考成長。但 Reforge 創辦人 Brian Balfour 與 Casey Winters、Kevin Kwok、Andrew Chen 在 2018 年的經典文章指出：Funnel 是線性的——頂部丟多少進去，底部才撈得出多少，這代表你得不斷加碼廣告預算、通路、人力才能維持成長。Growth Loop 的核心差異，是把「產出」重新投入「輸入」，形成一個會自我加速的封閉系統：

| 階段 | 要回答的問題 | 範例 |
|------|--------------|------|
| **輸入（Input）** | 使用者做了哪個具體動作，會創造價值？ | Pinterest 使用者「儲存一張圖」 |
| **產出（Output）** | 這個動作怎麼變成「讓下一個人加入的理由」？ | 被儲存的圖被 Google 收錄、帶來自然搜尋流量 |
| **再投資（Re-investment）** | 怎麼把產出重新餵回輸入，讓迴圈轉得更快？ | 用搜尋流量帶來的新使用者，繼續儲存更多圖 |

Funnel PM 關心的是「獲客管道」（廣告、SEO），預算停止成長就停止；Loop PM 關心的是「一個世代的使用者怎麼帶來下一個世代」，複利效果會隨使用者基數擴大而加速。Casey Winters 用這套邏輯把 Pinterest 從 4000 萬使用者帶到 2 億以上——靠的是「內容迴圈」：使用者建立的公開版面本身變成別人的入口。

### 診斷鏈：Goal → Metric → Bottleneck → Hypothesis → Experiment → Measurement

找到迴圈只是第一步，Growth PM 面試真正在篩的，是你敢不敢在提出方案前先做完整條診斷鏈：

1. **Goal**：這一季要動的是哪個商業目標？
2. **Metric**：哪個指標最能代表這個目標？
3. **Bottleneck**：漏斗裡真正卡住的那一站在哪？（沒做這步就是用猜的）
4. **Hypothesis**：為什麼會卡在這裡，你的假設是什麼？
5. **Experiment**：怎麼用最小成本驗證這個假設？
6. **Measurement**：用什麼指標判定實驗成敗，信心區間夠不夠？

JobLeads 的實驗操盤手 Edd Saunders 把「找瓶頸」這步做成可操作的工具：把每個候選問題畫在一個 2x2 矩陣上，橫軸是「證據強度」（0 是純假設，10 是有數據驗證過），縱軸是「影響力」。右上角（高影響力＋已驗證）的問題，才是這一輪優先要測試的假設——這比「老闆覺得該做」或「同業都在做」更可靠。

## 今日練習題

### 題目

你在一家線上記帳 App 帶成長，過去兩季新戶月活躍留存率停滯不動。執行長認為問題出在「獲客量不夠」，要求你把行銷預算翻倍，並優先上線一個推薦好友拿獎勵金的計畫，因為「competitor 都有推薦計畫」。你會怎麼回應？

（來源：自擬 based on Growth PM 面試常見的「診斷 vs 直覺方案」情境，參考 Johnny Mai 對 Growth PM 面試信號的觀察與 JobLeads 問題地圖框架的精神）

### 拆解思路

1. **釐清問題**：先問執行長「新戶月活躍留存率停滯」的定義——是完全沒有新戶，還是新戶有進來但沒有留住？這決定問題出在 Acquisition 還是更下游。
2. **定義指標**：把「留存率停滯」拆成漏斗，看是首次開戶完成率低、還是完成開戶後 7 天沒有第二次打開 App。
3. **找瓶頸再談方案**：推薦好友計畫解決的是「獲客」問題，如果真正的漏水點在「開戶後沒有建立記帳習慣」（Activation），加碼推薦計畫只會帶更多同樣留不住的新戶，讓分母變大、指標更難看。
4. **設計驗證實驗**：用 JobLeads 的問題地圖邏輯，把「使用者沒有持續記帳」拆成幾個可驗證的假設（例如「手動輸入太麻煩」「看不到記帳帶來的好處」），挑一個成本最低、影響力最高的先測。
5. **定義成功指標**：不是「推薦計畫帶來多少新戶」，是「7 天內完成第二次記帳的比例」有沒有提升——這才是真正回答執行長原本想解決的問題。

### 範例回答（面試時可以這樣講）

> **先框問題**：如果我是這個 PM，在加碼推薦計畫之前，我會先去看留存率停滯的漏斗分佈——如果是「完成開戶的新戶，7 天內沒有第二次打開 App」，代表問題不在獲客端，而在 Activation。這時候加碼推薦計畫，只是花更多錢帶進一樣留不住的使用者，反而讓留存率這個指標的分母變大、看起來更差。
>
> **用框架拆解**：我會把「使用者開戶後沒養成記帳習慣」拆成幾個具體假設——是手動輸入太花時間、還是使用者看不到記帳帶來的實際好處（比如省了多少錢）。每個假設我都會標上「證據強度」：如果 session recording 顯示大量使用者在輸入頁面中途放棄，這個假設證據就很強，值得優先測試一個「拍照記帳」或「銀行帳戶自動同步」的最小可行方案。
>
> **講清楚取捨**：這代表我會暫緩推薦計畫的預算翻倍，先把資源放在 Activation 實驗上。這個決定的代價是短期內新戶數字不會像執行長預期的那樣好看，但我押注的是：先把 Activation 的漏斗補起來，之後不管是自然成長還是推薦計畫帶進來的新戶，才不會一樣留不住。成功的定義是「開戶後 7 天內完成第二次記帳」的比例上升，而不是推薦計畫帶來的註冊數。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先問清楚「留存停滯」具體卡在漏斗哪一站 | |
| 沒有跳過瓶頸診斷、直接接受老闆提出的方案 | |
| 用假設＋證據強度排序，而非直覺挑方案 | |
| 提出最小成本的驗證實驗，而非直接大規模上線 | |
| 成功指標對齊「真正的問題」而非虛榮指標（推薦註冊數） | |
| 加分項：講出這個決定短期會犧牲什麼（新戶數字不好看） | |

## 今日案例

**JobLeads：一個把「22 步縮成 5 步」的完美方案，上線後毫無影響**

JobLeads 的產品實驗經理 Edd Saunders 在顧問時期，曾帶一家大型披薩外送公司做個人化實驗：使用者旅程地圖顯示，平均使用者從開始點餐到完成訂購要經過約 22 個操作步驟，一半以上流量是回頭客，而且這些回頭客每次都點一樣的披薩。邏輯上結論很清楚——把常訂餐點存起來，回訪時一鍵加入購物車直接結帳，22 步變成 5、6 步。上線後，這個方案「完全零影響，使用者行為完全沒變」，沒有增加訂單、也沒有減少訂單。深入了解後才發現：對這些使用者來說，「重新瀏覽菜單」本身就是體驗的一部分，把選擇的過程拿走，反而拿走了他們的掌控感。

這次失敗經驗，讓 Edd 設計出前述的問題地圖框架，把團隊從「直接跳去做方案」訓練成「先驗證問題」。用這套方法，JobLeads 的實驗速度從每月約 0.3 個實驗，在一年內成長到每月約 2.8 個，接近十倍。GrowthBook CMO Ashley Stirrup 用棒球比喻總結這個心態轉變：實驗不是在追全壘打，是不斷把安打疊起來——單一個實驗可能影響很小，但一年後回頭看，累積的一百多個實驗才是真正推動成長的力量。

**面試連結**：這個案例可以用來回答「你怎麼證明自己不會被直覺方案騙走預算」這類追問——答案不是「我很謹慎」，是具體的診斷工具（問題地圖的證據×影響力矩陣）加上把重心從「單次方案對不對」轉移到「實驗速度與知識累積」，這正是 Growth Loop 思維裡「複利效果」在實驗流程本身的體現。

## 延伸閱讀

- [Brian Balfour 等人：Growth Loops are the New Funnels（Reforge Blog）](https://www.reforge.com/blog/growth-loops) — 今天 Growth Loop 框架的原始出處，完整說明為什麼 Funnel 會製造部門穀倉、以及迴圈如何解決這個問題。
- [GrowthBook Podcast：How JobLeads 10x'd experiment velocity with problem mapping](https://www.growthbook.io/podcast/episode/1-34) — 今日案例的完整逐字稿，包含問題地圖矩陣的具體操作方式與更多實驗運營細節。
- [Reforge：Map your acquisition loops](https://www.reforge.com/guides/map-your-acquisition-loops) — 把 Growth Loop 落地成「病毒、內容、付費、業務」四大類獲客迴圈的實作指南，適合準備「設計一個成長迴圈」這類開放題。

## 參考資料

- [Reforge Blog：Growth Loops are the New Funnels](https://www.reforge.com/blog/growth-loops) — 對應「核心框架速記」的 Growth Loop 部分。
- [Johnny Mai：The Growth PM Interview: How to Signal High-Velocity Impact](https://sirjohnnymai.com/blog/product-growth-pm-interview-qa-2026growth-pm-interview/) — 對應「核心框架速記」的診斷鏈與「不要跳過瓶頸」的面試信號觀察。
- [GrowthBook Blog：How JobLeads 10x'd Experiment Velocity](https://www.growthbook.io/blog/from-22-clicks-to-5-the-zero-impact-experiment-that-shaped-how-edd-saunders-at-jobleads-tests) — 對應「今日案例」的數據與問題地圖框架。
