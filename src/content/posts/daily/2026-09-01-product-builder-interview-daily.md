---
title: "Product Builder 面試日練 — 2026-09-01：Metrics & Analytics"
date: 2026-09-01
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: zh-TW
description: "今日練 Metrics & Analytics 面試：用指標樹拆解「留言數上升、觀看時長卻下降」的執行題，並用 Facebook「7 天內加 7 位好友」的相關性陷阱案例，練怎麼分辨北極星指標背後的因果關係。"
tldr: "Metrics 題最容易垮的地方不是選不出指標，是說不出「這個指標為什麼能代表使用者價值」，以及分不清相關與因果。Exponent 最新彙整的 2026 真題庫裡有一道 Meta 風格的執行題：留言數上升但觀看時長下降，怎麼辦。今天用指標樹拆解這題，案例是 Facebook 著名的「7 天內加 7 位好友」北極星指標——它幫 Facebook 找到成長槓桿，也一度讓整個矽谷把相關性誤當因果，是講「怎麼驗證指標背後因果關係」的最佳素材。"
series:
  name: "Product Builder 面試日練"
  order: 13
---

> 🌏 [English version](/en/posts/daily/2026-09-01-product-builder-interview-daily-en)

## 今日主題

Metrics 題型測的不是「你背了多少框架」，是「你能不能在數字打架的時候，找出真正的因果關係」。Exponent 最新彙整的 2026 真實面試題庫顯示，Meta 這類公司特別愛出「root cause analysis」型的執行題——丟兩個互相矛盾的指標，看你怎麼收斂到一個可驗證的診斷。

這類題目最常見的失分點不是選錯框架，是把「指標同時變動」直接當成「指標互為因果」，然後跳過驗證就給方案。今天要練的就是這個收斂動作：從兩個打架的數字，走到一個能被實驗驗證的因果假設。

## 核心框架速記

### AARRR：先確認你要診斷的是哪一段

| 階段 | 定義 | 面試現場怎麼用 |
|------|------|---------------|
| **A**cquisition 獲客 | 使用者怎麼發現產品 | 指標異動先問「這是新使用者還是舊使用者的行為」 |
| **A**ctivation 啟動 | 使用者第一次感受到價值 | 常跟「aha moment」類問題綁在一起 |
| **R**etention 留存 | 使用者持續回來的比例 | 面試官最愛拿留存反問「這個指標會不會犧牲留存」 |
| **R**eferral 推薦 | 使用者帶來新使用者 | 容易跟互動類指標（留言、分享）混淆 |
| **R**evenue 營收 | 使用者帶來的商業價值 | 最終要能回答「這個改動對營收的路徑是什麼」 |

先把題目丟進 AARRR，能快速判斷「留言數」跟「觀看時長」分別對應哪一段——這一步做完，才知道該往哪個方向拆指標樹。

### 指標樹：把北極星指標拆成可歸因的分支

| 層次 | 拆解方式 | 範例 |
|------|---------|------|
| 北極星指標 | 選定一個代表使用者價值的核心數字 | 總觀看時長 |
| 一階拆解 | 乘積或加總拆成互斥的分支 | 觀看時長 = 觀看次數 × 平均單次觀看時長 |
| 二階拆解 | 針對可疑分支繼續往下拆 | 平均單次觀看時長 = 內容類型分布 × 各類型的完播率 |
| 交叉檢查 | 找出跟另一個異動指標共用的上游因子 | 留言數上升與觀看時長下降，是否共用「排序演算法改動」這個上游因子 |

指標樹的價值在於：面試官問「為什麼」的時候，你能指到樹上具體哪一個分支動了，而不是憑直覺講故事。

## 今日練習題

### 題目

「YouTube 的留言數上升，但觀看時長卻下降，你怎麼看？」

（來源：Exponent《52 Real Product Manager Interview Questions (2026 Guide)》歸類為 Meta 風格的 root cause analysis／metrics-driven decision-making 執行題）

### 拆解思路

1. **釐清問題**：先問時間範圍（這週還是這個月）、變動幅度（留言數漲多少、觀看時長掉多少）、是否有已知的產品改動（新的留言功能上線、排序演算法調整），以及這個異動是全站現象還是集中在特定內容類型或裝置。
2. **定義使用者**：把觀眾切成「重度留言者」「被動觀看不留言的多數觀眾」「長影片觀眾」「短片／片段型內容觀眾」，因為這兩個指標很可能對應不同的使用者行為。
3. **結構化分析**：用指標樹往下拆——觀看時長 = 觀看次數 × 平均單次觀看時長；留言數 = 曝光次數 × 留言轉換率。接著找共同上游因子：如果最近排序演算法把「高留言熱度」的內容排進推薦位，可能同時拉高留言曝光、也擠壓了長影片的曝光位置，這就是一個可驗證的因果假設，而不是「使用者變得比較愛留言」這種缺乏機制的猜測。
4. **提出方案**：如果診斷出是排序權重過度放大留言熱度，短期方案是調整排序公式加入觀看時長的 guardrail；長期方案是把「留言型內容」與「長影片內容」分開追蹤健康度指標，避免用同一套排序邏輯優化兩種不同的使用者價值。要講清楚取捨：調整排序可能讓留言互動率短期下滑，但換回觀看時長這個更接近核心商業目標的指標。
5. **定義成功**：把觀看時長訂為主指標，留言數降級為 guardrail 而非優化目標，避免下一輪又把資源錯放在讓留言數字好看、卻犧牲核心價值的方向。

### 範例回答（面試時可以這樣講）

> **問題釐清**：「我想先確認範圍——這個變化是這週發生的嗎？留言數漲了多少、觀看時長掉了多少，是全站現象還是特定內容類型？我猜測背後可能跟排序或推薦邏輯的改動有關，所以我也想知道最近有沒有相關的上線紀錄。」
>
> **因果拆解**：「假設資料顯示最近兩週排序演算法調整過，把『留言熱度高』的內容更頻繁推進推薦頁，我會用指標樹拆——觀看時長等於觀看次數乘上平均單次觀看時長，如果掉的主要是平均單次觀看時長，而且掉最多的是長影片，那就代表排序邏輯把曝光位置從長影片挪去了留言熱門的短內容，留言數上升只是這個位移的副作用，不是使用者本身變得更投入。」
>
> **方案與取捨**：「我會建議先在排序公式裡加入觀看時長作為 guardrail，避免單純用留言熱度排序；同時把留言型內容和長影片分開追蹤健康度，而不是用同一套指標互相比較。這個改動可能讓留言互動率短期回落，但因為觀看時長更接近使用者實際獲得的價值，我會把它訂為這次調整的主指標，留言數只當作輔助觀察。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 問清楚時間範圍、幅度與是否有已知的產品改動 | |
| 用指標樹把兩個指標拆到能找出共同上游因子 | |
| 明確指出這是「相關」還是已驗證的「因果」 | |
| 方案有講出具體取捨，不是只列優點 | |
| 成功指標區分主指標與 guardrail，不是同時追兩個數字 | |
| 加分項：提到怎麼用實驗（A/B test）驗證這個因果假設 | |

## 今日案例

**Facebook：「7 天內加 7 位好友」，一個北極星指標也是相關性陷阱**

Facebook 早期成長團隊發現，新使用者如果能在 10 天內加到 7 位好友，後續的留存率明顯比其他人高出一大截。Chamath Palihapitiya 把這個發現定為 Facebook 邁向十億使用者的「北極星」，公司圍繞它打造了 People You May Know 等一系列催促加好友的功能，成長曲線也確實跟著起飛。但後來多篇分析（包含 Geckoboard 的檢討文章）指出，這個指標長期被過度簡化：交到 7 位朋友的使用者，本來就更可能是天生更投入社交的一群人，加好友本身不必然「製造」留存，需要靠實驗把相關性和因果拆開驗證，而不是看到強相關就直接把指標當成因果操作目標。

**面試連結**：這個案例是「指標相關 vs. 因果」最經典的教材，可以直接用在「舉一個容易被誤用的北極星指標例子」或「你會怎麼驗證一個指標背後的因果關係」這類題目，重點是強調「強相關只是假設的起點，要靠實驗設計才能驗證能不能『推動』而不只是『預測』留存」。

## 延伸閱讀

- [52 Real Product Manager Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/top-product-manager-interview-questions) — 本篇練習題出處，含各公司近期 metrics／執行題真實案例
- [Facebook's "Aha" Moment Was Simpler Than You Think](https://mode.com/blog/facebook-aha-moment-simpler-than-you-think/) — 「7 天內加 7 位好友」指標的完整背景故事
- [How Facebook's "7 friends in 10 days" got everyone confused about correlation and causation](https://medium.com/geckoboard-under-the-hood/how-facebooks-7-friends-in-10-days-got-everyone-confused-about-correlation-and-causation-25da4bb8220e) — 相關性與因果陷阱的深入檢討

## 參考資料

- [52 Real Product Manager Interview Questions (2026 Guide)](https://www.tryexponent.com/blog/top-product-manager-interview-questions) — 對應「今日主題」與「今日練習題」的題目出處
- [Facebook's "Aha" Moment Was Simpler Than You Think](https://mode.com/blog/facebook-aha-moment-simpler-than-you-think/) — 對應「今日案例」中 Facebook 北極星指標的背景
- [How Facebook's "7 friends in 10 days" got everyone confused about correlation and causation](https://medium.com/geckoboard-under-the-hood/how-facebooks-7-friends-in-10-days-got-everyone-confused-about-correlation-and-causation-25da4bb8220e) — 對應「今日案例」中相關性與因果的檢討
