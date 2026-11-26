---
title: "Product Builder 面試日練 — 2026-11-25：Strategy & Execution"
date: 2026-11-25
category: daily
type: digest
tags: [product-builder-interview, daily, strategy]
lang: zh-TW
description: "Strategy & Execution 面試日練：用 Helmer 的七種護城河盤點自己到底有什麼可守，再用 April Dunford 的定位五要素重畫競爭對手與目標客群，拆一道基礎模型公司推出重疊功能的策略威脅題，案例看 Webflow CEO 怎麼選客群、把治理與協作當成大模型廠不會做的地方。"
tldr: "面對基礎模型公司推出重疊功能，先別急著喊差異化，而是用七種護城河誠實盤點自己手上有哪一種，再用定位五要素把對手改成客戶真的會拿來比的替代方案、把客群收斂到最在乎你價值的那群人；案例是 Webflow CEO 把客群押在大型公司的行銷團隊，主打 AI 版本一做完之後的長期營運。"
series:
  name: "Product Builder 面試日練"
  order: 98
---

> :globe: [English version](/posts/daily/2026-11-25-product-builder-interview-daily-en)

## 今日主題

Strategy 這一輪常見的考法，是丟給你一個正在被威脅的產品，問你「接下來怎麼辦」。多數人會直接跳到功能路線圖，但面試官要看的是前一步：你能不能說清楚這個產品憑什麼守得住，以及守的是哪一群人。今天的情境特別貼近 AI 產品圈的焦慮：你的產品蓋在基礎模型之上，模型公司忽然推出一個和你功能重疊的原生版本。

## 核心框架速記

**框架一：七種護城河（改寫自 Helmer《7 Powers》）**

YC 的 Lightcone 節目把 Hamilton Helmer 的七種「power」拿來檢視 AI 新創，並說在最早期，速度是最好的護城河，等做出人們想要的東西之後才輪到其他七種。Helmer 的定義重點是：一種 power 要同時有好處（benefit）和擋住模仿的障礙（barrier），缺一個都不算。

| 護城河 | 一句話 | AI 產品的例子（Lightcone 該集所舉） |
|---|---|---|
| 流程力（Process power） | 用競爭者難以複製的方式把事做得更有效率 | 把代理人調校到可靠運作的最後一段，例如銀行 KYC、貸款審核 |
| 獨占資源（Cornered resource） | 取得別人拿不到的關鍵資源 | 進入國防部這類受管制客戶的資格 |
| 轉換成本（Switching costs） | 客戶要換掉你得付出明顯代價 | 為客戶深度客製的工作流程，上線後很難重來一次 |
| 反向定位（Counter-positioning） | 你的模式讓既有大廠一模仿就傷到自己 | 以「完成的工作」計價，對上以席位計價的既有軟體 |
| 品牌（Branding） | 品牌本身吸引並留住客戶 | ChatGPT 的日常使用者數贏過 Gemini |
| 網路經濟（Network economies） | 越多人用，價值越高 | 使用資料餵回模型形成的資料飛輪 |
| 規模經濟（Scale economies） | 規模讓單位成本更低 | 前沿模型訓練、網路爬取這類固定成本高的投資 |

Helmer 在 Lenny's Podcast 也提醒，新創常見的順序是先靠反向定位活下來，再有規模經濟與轉換成本，最後才可能有網路經濟，前三種（品牌、流程力、獨占資源）對年輕公司通常比較少見。該集還有一段章節標題叫「Why moving fast is not a power」，和 YC 把速度當第一道護城河的說法並陳，面試時可以主動點出兩者的差別。

**框架二：April Dunford 的定位五要素**

Dunford 在《Obviously Awesome》把定位拆成五個互相依賴的要素，順序很重要：

1. **競爭替代方案**：如果沒有你的產品，客戶會怎麼做（可能是試算表，也可能是什麼都不做）
2. **差異化能力**：你有而替代方案沒有的東西
3. **客戶價值**：這些能力對客戶的意義是什麼
4. **目標客群**：特別在乎這個價值的是哪一群人
5. **市場類別**：讓你的價值對目標客群一目了然的參照框架

她特別提醒，第一步要看客戶眼中的替代方案，不是你想像中所有可能的競爭者。

## 今日練習題

### 題目

你是一家 AI 合約審閱新創的產品負責人，產品以第三方基礎模型為底層。今天上午，模型供應商發表一個原生的「文件審閱」功能，使用者在聊天介面丟進合約就能標出風險條款，並據你團隊估計，和你產品約六成的使用情境重疊。董事會問你：這對我們是生死威脅嗎？你的策略是什麼？

（來源：自擬，情境依 Lightcone 該集討論的「大模型廠會不會吸收你的產品」憂慮改編，數字為假設。）

### 拆解思路

1. **釐清問題**：先問重疊的是哪一層。是只有「標出風險」，還是連審核流程、版本比對、與法務系統串接也包含？重疊的六成佔營收的多少？
2. **重畫替代方案**：用 Dunford 第一步，把「模型原生功能」正式列為客戶的替代方案，再問客戶拿我們和它比的時候，到底在比什麼。
3. **盤點護城河**：用七種逐項問「我們有 benefit 也有 barrier 嗎」。誠實承認沒有的（例如品牌、規模），不要硬湊。
4. **收斂客群與價值**：找出最在乎我們差異化價值的那群人，其餘客群放棄爭奪，把資源押在這一群。
5. **定義成功**：用客戶留存、續約與每位客戶的工作流程深度衡量，而不是只看新客數。

### 範例回答（面試時可以這樣講）

> **先判斷威脅的層次**：「我不會先說這是不是生死威脅，而是先確認重疊的是哪一層。如果它只做到『在聊天裡標出風險條款』，那是我們價值鏈最上面那一段，客戶拿來比的替代方案現在多了一個，我們得重新回答『為什麼不直接用它』。」
>
> **盤點手上有什麼**：「我會用七種護城河誠實盤點。我們沒有品牌，也沒有規模經濟，這兩項不討論。真正可能有的是轉換成本，也就是客戶把審核流程、條款庫和內部簽核都接進來之後的重建成本，以及流程力，也就是把準確度從示範版推到法務敢上線的那最後一段。這兩項要有證據，比如客戶的導入週期與續約率，沒有就是沒有。」
>
> **收斂客群**：「模型原生功能會吃掉只想偶爾看一份合約的人，那群人我不會爭。我會把資源押在法務團隊多人協作、有簽核與稽核需求的公司，因為那是通用聊天介面短期內不會優先做的地方。接下來一季我只衡量兩件事：這群客戶的續約率，以及他們把多少審核流程搬進來。」

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先釐清重疊發生在哪一層，而不是直接喊差異化 | |
| 把模型原生功能列為客戶的競爭替代方案 | |
| 用護城河逐項盤點，並承認沒有的項目 | |
| 收斂到特定客群，並明講放棄哪些客群 | |
| 有具體的成功指標（續約、流程深度），不是只看新客 | |
| 加分項：區分「現在有的護城河」和「接下來要建的」 | |

## 今日案例

**Webflow：把客群押在大型公司的行銷團隊，專注 AI 做完版本一之後的事**

Aakash Gupta 在 2026 年 11 月 10 日發布與 Webflow CEO Linda Tong 的訪談。Tong 的出發點是：AI 很會做第一版網站，但 Webflow 的生意大部分發生在發布之後。她的原話是 "The majority of our business sits after you hit publish."（我們的大部分生意都在按下發布之後）。

在客群上，Webflow 回頭看自己的使用者，發現設計師、開發者、產品經理都在用，但實際在做的是行銷工作，於是把目標客群定為大型公司的行銷團隊，也就是數十到數百人共同維護一個網站的情境。依該文敘述，Tong 把全力押注形容為令人害怕，但原則是先為這個目標客群打造，讓相鄰的使用者自然跟上。她也說：「As a vertical solution, I do think it puts us in a space where I don't see a frontier lab directly coming after us. Maybe they will eventually.」（作為垂直方案，我不認為前沿實驗室會直接來打我們，不過將來也許會。）

文中整理出一個找客群的測試：依使用者在產品裡做的工作拆開使用量、把職稱對上每項工作、許多職稱在做同一件事的那項就是你的客群，最後列出大模型廠不會替這群人做的事，例如治理與協作。要注意，這最後一步是該篇作者整理的做法，並不是 Tong 的原話。

**面試連結**：被問「大廠進來你怎麼辦」時可以借這個結構。對照 Dunford，AI 網站生成器是客戶的替代方案，目標客群是大型公司行銷團隊；對照 Helmer，這是在找一個通用工具短期內不會優先照顧的需求。這個對照是本文的解讀，Tong 本人沒有用這些框架講。

## 延伸閱讀

- [The 7 Most Powerful Moats For AI Startups - Y Combinator（YouTube）](https://www.youtube.com/watch?v=bxBzsSsqQAM) — Lightcone 該集原片，依章節看每種護城河在 AI 新創的例子
- [A Quickstart Guide to Positioning - April Dunford](https://www.aprildunford.com/post/a-quickstart-guide-to-positioning) — 作者自己寫的定位五要素入門，附 Siebel 對手的實例
- [Business strategy with Hamilton Helmer - Lenny's Newsletter](https://www.lennysnewsletter.com/p/business-strategy-with-hamilton-helmer) — Helmer 親自談七種 power、benefit 與 barrier 的重點整理

## 參考資料

- [How SaaS Companies Can Survive AI: Webflow CEO's Playbook - Aakash Gupta](https://www.news.aakashg.com/p/can-saas-survive-the-ai-era) — 對應「今日案例」的訪談日期、引述與客群測試
- [The 7 Most Powerful Moats For AI Startups - Y Combinator](https://www.youtube.com/watch?v=bxBzsSsqQAM) — 對應「核心框架速記」的速度與七種護城河，及影片章節與說明
- [Barbarians at the Prompt - YesPress](https://yespress.io/seven-powers-how-ai-startups-build-moats) — 對應表格中各項 AI 產品例子的該集重點整理（第三方摘要）
- [Business strategy with Hamilton Helmer - Lenny's Newsletter](https://www.lennysnewsletter.com/p/business-strategy-with-hamilton-helmer) — 對應七種定義、benefit 與 barrier，以及順序的說明
- [A Quickstart Guide to Positioning - April Dunford](https://www.aprildunford.com/post/a-quickstart-guide-to-positioning) — 對應「定位五要素」與第一步看客戶眼中的替代方案
