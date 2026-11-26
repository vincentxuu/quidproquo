---
title: "Product Builder 面試日練 — 2026-11-17：Metrics & Analytics"
date: 2026-11-17
category: daily
type: digest
tags: [product-builder-interview, daily, metrics]
lang: zh-TW
description: "Metrics & Analytics 面試日練：用 GAME 與 DEC 框架拆一道真實的 A/B 測試讀數題——兩週合併數字顯著提升，拆開看卻只有第一週有效，再看 Facebook 怎麼用「7 個朋友 10 天內」找出啟用指標。"
tldr: "今天的核心是看到顯著的 A/B 測試結果時先拆開看分段數字，再檢查有沒有護欄指標被打破——練習題是一個合併後 p 值顯著、拆開卻只有第一週有效的試用啟用率測試，案例是 Facebook 用「7 個朋友 10 天內」找出啟用指標的方法論。"
series:
  name: "Product Builder 面試日練"
  order: 90
---

> :globe: [English version](/posts/daily/2026-11-17-product-builder-interview-daily-en)

## 今日主題

Metrics & Analytics 這輪考的不是「你背過幾個指標名詞」，是「你能不能把一個模糊的數字問題，拆成可以被驗證的子問題」。面試官最常用兩種題型測試這件事：一種是「幫某個產品定義指標」，另一種是「某個指標變了，你怎麼回報」。這兩種題型考驗的能力不一樣——前者考的是你怎麼從使用者行為收斂出精確的指標，後者考的是你能不能在沒有完整資訊的情況下，用一個不漏掉關鍵可能性的框架排查根因。今天先用 GAME 跟 DEC 兩個框架過一輪，再拿一道真實出現在資料產品經理面試裡的 A/B 測試讀數題，練習「看起來顯著的數字，實際上可能只是假訊號」這個最容易被忽略的陷阱。

## 核心框架速記

今天用兩個框架處理 Metrics & Analytics 面試裡最常見的兩種問題：「幫某個產品定義指標」用 GAME，「某個指標變了，為什麼」用 DEC。

**GAME — 指標定義題**

| 步驟 | 要做的事 |
|---|---|
| Goals（目標） | 先跟面試官對齊這個產品要解決的是使用者目標還是商業目標，不要自己假設 |
| Actions（行為） | 列出使用者在產品裡能做的所有行為，挑出跟目標最相關的 2-3 個，先別急著定義數字 |
| Metrics（指標） | 把挑出的行為轉成精確可量測的指標，寫出分母（例如「每千次 session 的留言數」而不是「留言數」） |
| Evaluations（評估） | 回答完指標後，主動指出這個指標的限制跟取捨，不要等面試官來問 |

**DEC — 指標異動題**

1. **Define（釐清）**：先問清楚指標的精確定義、變化的時間區間、受影響的使用者分群，不要還沒問清楚就開始列原因
2. **Explore（排查）**：用「內部 vs 外部」這種互斥且完整的分類法（MECE）把可能原因分組，再逐一跟面試官核對哪個方向有線索
3. **Conclude（結論）**：收斂到最可能的根因，說明怎麼排除掉其他候選，再給出下一步行動

這兩個框架背後的共同原則：先問清楚題目的邊界，再動手分析，是所有 Metrics 面試題的共同要求。

## 今日練習題

### 題目

你是一家 B2B SaaS 公司的 PM，團隊在試用方案（trial）的註冊頁面做了一次改版，目標是提升「試用啟用率」。A/B 測試跑了兩週，控制組與實驗組各約 52,000 名訪客，數據如下：

| 分組 | 控制組 | 實驗組 |
|---|---|---|
| 兩週合計試用啟用率 | 2,132 / 52,000（4.10%） | 2,340 / 52,000（4.50%） |
| 第一週試用啟用率 | 1,066 / 26,000（4.10%） | 1,300 / 26,000（5.00%） |
| 第二週試用啟用率 | 1,066 / 26,000（4.10%） | 1,040 / 26,000（4.00%） |
| 每週 email 取消訂閱率 | 0.60% | 0.84% |

整體合併後的 p 值約 0.0015，團隊想在下週一出貨這個改版。你會怎麼回應？

（來源：改寫自 KORE1「Data Product Manager Interview Questions 2026」一文中實際用於面談的讀數練習，原題取材自真實客戶案例並簡化數字）

### 拆解思路

1. **先把整體數字拆開看**：按週分開比較，不要只看兩週合併的平均
2. **判斷提升是不是真的來自改版**：檢查有沒有 novelty effect（新鮮感效應），或外部事件（檔期、促銷）剛好重疊
3. **檢查有沒有護欄指標被打破**：opt-out 率的漂移是不是在測試前就設定好的可接受範圍內
4. **問清楚事前有沒有定義好決策規則**：最小可偵測效果（MDE）、測試期間、護欄門檻是不是在測試前就寫好，不是事後才討論
5. **下結論**：不是直接出貨也不是直接砍掉，是給出「再測一次」或「延長測試」的具體條件

### 範例回答（面試時可以這樣講）

> **拆開看數字**：「整體合併看起來是顯著的提升，兩週平均啟用率從 4.10% 升到 4.50%，p 值在 0.0015 左右，單看這個數字確實像可以出貨。但我會先按週拆開——第一週實驗組的提升是 0.9 個百分點，第二週卻是負 0.1 個百分點，等於整個提升都發生在第一週，第二週幾乎看不到效果。」
>
> **判斷是不是真實效果**：「這個模式很像新鮮感效應——使用者第一次看到新介面會比較興奮，效果會隨時間消退。如果第一週剛好疊到促銷檔期，流量結構本身就跟平常不一樣，隨機分組只保證組內可比，不保證這批流量能代表平常的流量。我不會把這個當成已經驗證的結論，而是一個需要再測一次才能確認的假設。」
>
> **檢查護欄指標**：「同時我會看 email 取消訂閱率，從 0.60% 漂到 0.84%，是四成的相對漂移。如果測試開始前就定好這個護欄的門檻，而這次漂移超過門檻，那不管啟用率漲多少，護欄被打破的優先順序高於漲幅，這點沒有模糊空間。如果事前根本沒定門檻，那『沒有護欄』本身就是這次測試設計的問題，要先補上再談出不出貨。」
>
> **給出決策**：「我不會建議直接出貨，也不會建議直接砍掉這次改版。我會建議排除檔期干擾，在一般流量上重跑一次，並在重跑前把最小可偵測效果、跑多久、護欄門檻跟決策規則都先寫清楚，下次才不用再靠人工判斷一次性的數字。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 把合併數字拆成週次或區段來看 | |
| 辨認出可能的新鮮感效應或外部干擾（檔期、促銷） | |
| 檢查護欄指標（非主指標）有沒有被打破 | |
| 提到事前該定義好的 MDE、測試期間、決策規則 | |
| 結論不是單純的「出貨」或「砍掉」，而是具體的下一步條件 | |
| 加分項：區分「隨機化保證組間可比」跟「這批流量能代表未來流量」是兩件事 | |

## 今日案例

**Facebook「7 個朋友，10 天內」——用數據找出啟用指標，不是靠直覺猜**

Facebook 在 2007 年到 2010 年間成長趨緩，Chamath Palihapitiya 帶領的成長團隊從使用者行為資料裡回推，發現新使用者如果在加入後 10 天內加到至少 7 個朋友，長期留存率會明顯高於沒達到這個門檻的使用者。團隊沒有再去猜「哪個功能比較重要」，而是把整個產品的優先順序收斂成一件事：讓盡可能多的新使用者在 10 天內加到 7 個朋友。好友建議、聯絡人匯入、互動提示等功能，都是為了把使用者推向這個門檻而設計，不是各自獨立的功能清單。這個指標後來被公開引用為 Facebook 邁向十億使用者路上的核心成長指標。

**面試連結**：這個案例可以在被問「如何幫一個新產品定義啟用（activation）指標」時引用——重點不是「7 個朋友」這個數字本身（換一個產品不會直接套用），而是方法論：先回推哪個早期行為跟長期留存高度相關，再把這個行為收斂成單一、能讓整個團隊對齊的指標，而不是一次追十幾個數字。

## 延伸閱讀

- [How to Crack Product Metrics Questions in PM Interviews - IGotAnOffer](https://igotanoffer.com/blogs/product-manager/product-metric-interview-questions) — GAME 與 DEC 框架的完整版本，含 Meta、Google、Anthropic 等公司的真實面試題庫
- [Data Product Manager Interview Questions 2026 - KORE1](https://www.kore1.com/data-product-manager-interview-questions/) — 今日練習題的完整原版，還有事件結構設計、資料表擁有權等延伸題型
- [facebook-seven-friends-in-ten-days-2007-2010 - GitHub (deciqAI)](https://github.com/deciqAI/knowledge-skills/blob/main/north-star-metric/examples/facebook-seven-friends-in-ten-days-2007-2010.md) — Chamath Palihapitiya 原始演講引述與脈絡

## 參考資料

- [Data Product Manager Interview Questions 2026 - KORE1](https://www.kore1.com/data-product-manager-interview-questions/) — 對應「今日練習題」A/B 測試讀數案例的原始版本與數字
- [How to Crack Product Metrics Questions in PM Interviews - IGotAnOffer](https://igotanoffer.com/blogs/product-manager/product-metric-interview-questions) — 對應「核心框架速記」GAME 與 DEC 兩個框架的步驟定義
- [facebook-seven-friends-in-ten-days-2007-2010 - GitHub (deciqAI)](https://github.com/deciqAI/knowledge-skills/blob/main/north-star-metric/examples/facebook-seven-friends-in-ten-days-2007-2010.md) — 對應「今日案例」Chamath Palihapitiya 的原始引述出處
- [Facebook's "Aha" Moment Was Simpler Than You Think - Mode](https://mode.com/blog/facebook-aha-moment-simpler-than-you-think/) — 對應「今日案例」7 個朋友 10 天內作為北極星指標的背景說明
