---
title: "用英文在面試講 AI agent 的工作：定位、需求變動、踩過的坑與設計原則"
date: 2026-10-07
category: learning
type: guide
tags: [english-speaking, english, speaking, language-learning]
lang: zh-TW
description: "把自己準備 AI agent 工程師面試的中文素材，挑出十二句最常要講的話，逐句找英文句型的字典依據：一句話定位、需求改了五次的專案、沒有錯誤訊息的 bug、兩條設計原則、一次失誤，以及誠實承認還沒做好的部分。"
tldr: "定位用 I work on improving…、My work covers…；需求變動用 changed five times in four months；用資料說服用 that convinced the team to…；實測結果用 took 29 minutes；失誤用 I changed … but didn't update …、We only found out … after …；承認缺口用 To be honest, we don't have … yet。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-10-07-interview-agent-stories-english-en)

[上一篇面試口說](/posts/learning/2026-10-07-interview-experience-english)整理的是通用句型，裡面的數字是範例。這篇換成我自己準備面試的素材：先有中文版的故事和追問答案，再挑出十二句我最常要講、但用英文會卡住的話。

公司和產品名稱在這篇都拿掉了，只留下工作內容和實測數字。

## 我當時想說什麼

對象是面試官，職缺是 AI agent 相關的工程師。想做的事有五種：

- 用一兩句話定位自己的工作
- 講一個需求變動很大的專案，以及我怎麼用資料讓團隊做決定
- 講一個很難找的 bug
- 講兩條從實作歸納出來的設計原則
- 講一次失誤，以及誠實承認還沒做好的部分

## 在這個情境可以怎麼說

以下每一句都是依字典句型改寫的，不是字典原句。runtime、flag、log、merge 這些軟體用語，學習字典沒有收軟體的意思，字典支持的只有句型。

### 一、定位

| 想說的意思 | 這個情境可用的說法 |
| --- | --- |
| 我負責優化公司的 AI agent 產品。 | I work on improving our company's AI agent product. |
| 我做的範圍包含 agent 的 runtime、工具、評估、記憶和成本控制。 | My work covers the agent runtime, tools, evaluation, memory, and cost control. |

**improve**：Oxford 的定義是讓某個東西比以前更好（[improve](https://www.oxfordlearnersdictionaries.com/us/definition/english/improve)）。產品本來就存在，我做的是優化，所以用 *improve*，不用 *build*。這個區別很重要：說 *I built the product* 等於說產品是我從無到有做出來的。

**cover**：Oxford 有「包含、涉及」的意思，例句 *The survey covers all aspects of the business*（[cover](https://www.oxfordlearnersdictionaries.com/us/definition/english/cover_1)）。

### 二、需求變動與用資料做決定

| 想說的意思 | 這個情境可用的說法 |
| --- | --- |
| 這個功能四個月內方向改了五次。 | The direction of this feature changed five times in four months. |
| 我查了正式環境的資料，才說服團隊把上限定在 10 MB。 | I checked the production data, and that convinced the team to set the limit at 10 MB. |
| 一個 27 MB 的檔案跑了 29 分鐘，只有前 20 頁進到模型。 | A 27 MB file took 29 minutes, and only the first 20 pages reached the model. |

**direction、times**：Oxford 的 direction 有「發展方向」的意思，例句 *a radical change of direction*（[direction](https://www.oxfordlearnersdictionaries.com/us/definition/english/direction)）；次數用 times，例句 *He failed his driving test three times*（[time](https://www.oxfordlearnersdictionaries.com/us/definition/english/time_1)）。

**convince + 人 + to**：Oxford 的例句 *I've been trying to convince him to see a doctor*（[convince](https://www.oxfordlearnersdictionaries.com/us/definition/english/convince)）。「定上限」是 *set a limit*，例句 *The EU has set strict limits on levels of pollution*（[limit](https://www.oxfordlearnersdictionaries.com/us/definition/english/limit_1)）。*set the limit at 10 MB* 的 *at* 我沒有查到例句。

**took 29 minutes**：Oxford 的例句 *It took her three hours to repair her bike*（[take](https://www.oxfordlearnersdictionaries.com/us/definition/english/take_1)）。*reach* 的字典意思是到達某個地方，例句 *They didn't reach the border until after dark*（[reach](https://www.oxfordlearnersdictionaries.com/us/definition/english/reach_1)）；用在「內容進到模型」是我的套用。

### 三、很難找的 bug

| 想說的意思 | 這個情境可用的說法 |
| --- | --- |
| 使用者換一個對話，agent 就什麼都不記得。 | When users started a new conversation, the agent forgot everything. |
| 這個 bug 沒有任何錯誤訊息，也沒有 log。 | There were no errors and no logs. |

描述過去的問題用過去式 *started*、*forgot*（[forget](https://www.oxfordlearnersdictionaries.com/us/definition/english/forget)）。Oxford 的 error 例句是 *There are too many errors in your work*（[error](https://www.oxfordlearnersdictionaries.com/us/definition/english/error)），講過去就是 *There were*。

### 四、設計原則

| 想說的意思 | 這個情境可用的說法 |
| --- | --- |
| 可以恢復的錯誤要回給 agent，不要直接丟進錯誤追蹤。 | Recoverable errors should go back to the agent instead of going straight to error tracking. |
| 用 prompt 要求模型做的事，不等於保證。 | Telling the model to do something in a prompt is not a guarantee. |

**instead**：Oxford 的意思是「取代、而不是」，例句 *Lee was ill so I went instead*（[instead](https://www.oxfordlearnersdictionaries.com/us/definition/english/instead)）。*instead of* 後面接 V-ing 的例句我沒有擷取到。

**tell + 對象 + to**：Oxford 說 tell 也用來給指示，例句 *The doctor told me to stay in bed*（[tell](https://www.oxfordlearnersdictionaries.com/us/definition/english/tell)）。guarantee 是承諾某件事會發生（[guarantee](https://www.oxfordlearnersdictionaries.com/us/definition/english/guarantee_1)）；我查的是動詞詞條，名詞的例句沒有查。

### 五、失誤與還沒做好的部分

| 想說的意思 | 這個情境可用的說法 |
| --- | --- |
| 我改了旗標的語意，卻沒有同步前端。 | I changed the meaning of a flag but didn't update the frontend. |
| 我們在合併兩個月後才發現。 | We only found out two months after the merge. |
| 老實說，這部分我們還沒有系統性的評估。 | To be honest, we don't have a systematic evaluation for this yet. |

**the meaning of、update**：Oxford 的例句 *What's the meaning of this word?*（[meaning](https://www.oxfordlearnersdictionaries.com/us/definition/english/meaning)）、*It's about time we updated our software*（[update](https://www.oxfordlearnersdictionaries.com/us/definition/english/update_1)）。

**find out**：Oxford 列出 *find out (about something)*（[find](https://www.oxfordlearnersdictionaries.com/us/definition/english/find_1)）。用 *only* 表示「直到那時才」是我的套用。

**To be honest … yet**：Oxford 的例句 *To be honest, it was one of the worst books I've ever read*（[honest](https://www.oxfordlearnersdictionaries.com/us/definition/english/honest)）、*I haven't received a letter from him yet*（[yet](https://www.oxfordlearnersdictionaries.com/us/definition/english/yet_1)）、*a systematic approach to solving the problem*（[systematic](https://www.oxfordlearnersdictionaries.com/us/definition/english/systematic)）。

## 也可以這樣說嗎

| 英文 | 對誰／做什麼時用 | 是否仍是同一個意思 |
| --- | --- | --- |
| I work on improving our company's AI agent product. | 產品本來就存在，我做優化 | 主要說法 |
| I built our company's AI agent product. | 產品是你從無到有做的 | 不同：誇大了我的角色，我不能這樣說 |
| That convinced the team to set the limit at 10 MB. | 資料讓團隊同意 | 主要說法 |
| I set the limit at 10 MB. | 你一個人決定 | 不同：少了「說服團隊」 |
| There were no errors and no logs. | 描述過去那個 bug | 主要說法 |
| There are no errors and no logs. | 問題現在還在 | 不同：時間換成現在 |
| We only found out two months after the merge. | 強調發現得晚 | 主要說法 |
| We found out two months after the merge. | 只陳述時間 | 是，但少了「才」的語氣 |

## 換內容再說一次

先看中文，自己說一次，再看參考說法。

1. 我負責優化公司 AI agent 產品的可靠性。
   - *I work on improving the reliability of our AI agent product.*
2. 設計前後改了五次。
   - *The design changed five times.*
3. 那讓團隊同意把逾時定在 180 秒。
   - *That convinced the team to set the timeout at 180 seconds.*
4. 現在 agent 跨對話都記得使用者。
   - *Now the agent remembers users across conversations.*
5. 我是查了正式環境的資料才發現的。
   - *We only found out when I checked the production data.*
6. 這是我們路線圖上的第一件事。
   - *It's the first thing on our roadmap.*

這六句是我自己寫的替換練習，沒有另外查來源。

## 一段短對話

以下是自己寫的練習示例，不是真實面試。

> A: Could you tell me what you do in your current role?
>
> B: I work on improving our company's AI agent product. My work covers the agent runtime, tools, evaluation, memory, and cost control.
>
> A: Tell me about a project where the requirements changed.
>
> B: The direction of one feature changed five times in four months. A 27 MB file took 29 minutes, and only the first 20 pages reached the model. I checked the production data, and that convinced the team to set the limit at 10 MB.
>
> A: What was your biggest mistake?
>
> B: I changed the meaning of a flag but didn't update the frontend. We only found out two months after the merge.

## 不看英文，你會怎麼說

自評的標準是能不能把意思說出來，不是字有沒有完全一樣。

| 中文情境 | 參考說法 | 提醒 |
| --- | --- | --- |
| 定位：我負責優化公司的 AI agent 產品。 | I work on improving our company's AI agent product. | improve，不是 build |
| 定位：我做的範圍包含 agent 的 runtime、工具、評估、記憶和成本控制。 | My work covers the agent runtime, tools, evaluation, memory, and cost control. | cover＝包含 |
| 講專案：這個功能四個月內方向改了五次。 | The direction of this feature changed five times in four months. | 次數用 times |
| 講專案：我查了正式環境的資料，才說服團隊把上限定在 10 MB。 | I checked the production data, and that convinced the team to set the limit at 10 MB. | convince + 人 + to |
| 講專案：一個 27 MB 的檔案跑了 29 分鐘，只有前 20 頁進到模型。 | A 27 MB file took 29 minutes, and only the first 20 pages reached the model. | take + 時間 |
| 講問題：使用者換一個對話，agent 就什麼都不記得。 | When users started a new conversation, the agent forgot everything. | 過去式 |
| 講 bug：這個 bug 沒有任何錯誤訊息，也沒有 log。 | There were no errors and no logs. | There were |
| 講原則：可以恢復的錯誤要回給 agent，不要直接丟進錯誤追蹤。 | Recoverable errors should go back to the agent instead of going straight to error tracking. | instead of + V-ing |
| 講原則：用 prompt 要求模型做的事，不等於保證。 | Telling the model to do something in a prompt is not a guarantee. | tell + 對象 + to |
| 講失誤：我改了旗標的語意，卻沒有同步前端。 | I changed the meaning of a flag but didn't update the frontend. | the meaning of |
| 講失誤：我們在合併兩個月後才發現。 | We only found out two months after the merge. | find out |
| 承認缺口：老實說，這部分我們還沒有系統性的評估。 | To be honest, we don't have a systematic evaluation for this yet. | yet 放句尾 |

## 仍待核對

這些還沒找到合適來源，先不寫成定論：

- runtime、flag、log、merge、error tracking 這些詞在軟體團隊口語裡的用法：學習字典沒有收，這次也沒有查技術文件
- *set the limit at* + 數字 的介系詞
- *instead of going* 與 *is not a guarantee* 的直接例句
- 哪一句比較常用：這需要語料庫查詢，這次沒有做

## 整體來說

十二句裡，最值得先練的是定位那兩句，因為每場面試開頭都會用到，而且 *improve* 和 *build* 用錯會直接講錯自己的角色。其次是 *convinced the team to* 和 *To be honest … yet*。來源都是學習字典，支持的是字義與句型，軟體用語的部分字典沒有涵蓋。沒有母語者測試，也沒有頻率比較，所以文中只寫「這個情境可用」。

## 參考資料

- [Oxford Learner's Dictionaries: improve](https://www.oxfordlearnersdictionaries.com/us/definition/english/improve)：讓某物更好
- [Oxford Learner's Dictionaries: cover](https://www.oxfordlearnersdictionaries.com/us/definition/english/cover_1)：包含、涉及
- [Oxford Learner's Dictionaries: direction](https://www.oxfordlearnersdictionaries.com/us/definition/english/direction)：發展方向
- [Oxford Learner's Dictionaries: time](https://www.oxfordlearnersdictionaries.com/us/definition/english/time_1)：次數
- [Oxford Learner's Dictionaries: convince](https://www.oxfordlearnersdictionaries.com/us/definition/english/convince)：convince somebody to do something
- [Oxford Learner's Dictionaries: limit](https://www.oxfordlearnersdictionaries.com/us/definition/english/limit_1)：set a limit
- [Oxford Learner's Dictionaries: take](https://www.oxfordlearnersdictionaries.com/us/definition/english/take_1)：take + 時間
- [Oxford Learner's Dictionaries: reach](https://www.oxfordlearnersdictionaries.com/us/definition/english/reach_1)：到達
- [Oxford Learner's Dictionaries: forget](https://www.oxfordlearnersdictionaries.com/us/definition/english/forget)：過去式 forgot
- [Oxford Learner's Dictionaries: error](https://www.oxfordlearnersdictionaries.com/us/definition/english/error)：error 的例句
- [Oxford Learner's Dictionaries: instead](https://www.oxfordlearnersdictionaries.com/us/definition/english/instead)：取代
- [Oxford Learner's Dictionaries: tell](https://www.oxfordlearnersdictionaries.com/us/definition/english/tell)：tell somebody to do something
- [Oxford Learner's Dictionaries: guarantee](https://www.oxfordlearnersdictionaries.com/us/definition/english/guarantee_1)：承諾某事會發生
- [Oxford Learner's Dictionaries: meaning](https://www.oxfordlearnersdictionaries.com/us/definition/english/meaning)：the meaning of
- [Oxford Learner's Dictionaries: update](https://www.oxfordlearnersdictionaries.com/us/definition/english/update_1)：update 的例句
- [Oxford Learner's Dictionaries: find](https://www.oxfordlearnersdictionaries.com/us/definition/english/find_1)：find out
- [Oxford Learner's Dictionaries: honest](https://www.oxfordlearnersdictionaries.com/us/definition/english/honest)：to be honest
- [Oxford Learner's Dictionaries: yet](https://www.oxfordlearnersdictionaries.com/us/definition/english/yet_1)：否定句的 yet
- [Oxford Learner's Dictionaries: systematic](https://www.oxfordlearnersdictionaries.com/us/definition/english/systematic)：a systematic approach
