---
title: "Salesforce long-horizon agents 把目標拆成跨週計畫：偏離計畫時，誰來決定"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, salesforce, agentforce]
lang: zh-TW
tldr: "Salesforce 的 long-horizon runtime 讓 Agentforce agent 追一個目標好幾週：記憶讓它跨 session 保留進度，durable execution 讓計畫在中斷後接著跑，dynamic steering 讓你在執行中用對話改它的做法。第一個跑在上面的是業務 agent Hunter：它把「救回有風險的案子」變成可量的目標和一份跨週計畫，計畫裡寫明什麼時候要回來問人；信被退回、要改寄給別人時，因為偏離了你核准過的計畫，它會先問。截至 11 月中，Hunter 仍標示「試行中，11 月正式推出」。"
description: "Salesforce 的 long-horizon agents：記憶、durable execution、dynamic steering 三個元件各解決什麼，Hunter 怎麼把目標變成計畫、偏離計畫時怎麼處理，Agentforce Coworker 的角色，正式推出的狀態，以及替一個跨週目標寫出「哪些偏離要先問」的護欄。"
series:
  name: "常駐型 AI agent"
  order: 12
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-salesforce-long-horizon-agents-en)

| 四個條件 | Salesforce long-horizon agents（Hunter） |
|---|---|
| 你不在時繼續跑 | ✓ durable execution 讓計畫跨好幾天、好幾週持續執行，中斷後接著跑 |
| 醒來後自己決定做什麼 | ✓ L3：照計畫推進，遇到變化自己找替代做法，偏離計畫時回來問你 |
| 跨對話記得你的目標 | ✓ 記憶存在客戶、聯絡人和商機紀錄上，不在聊天視窗裡 |
| 能代你對外做事 | ✓ 用你的信箱寄外聯信；碰到客戶的動作可設成要業務核准 |

Salesforce 的[部落格](https://www.salesforce.com/blog/long-horizon-agents/)用一個場景介紹 long-horizon agent：季末快到了，一位業務手上有好幾個卡住的案子。

一般的 AI agent 大概會幫你對名單上每個人寄同一封制式信。業務真正想做的是：搞清楚每個案子為什麼卡住、哪些人值得重新聯絡、什麼內容能讓這個客戶動起來。

業務對 Hunter 說「re-engage my at-risk deals」。Hunter 分析進行中的商機，從 Data 360 和 Slack 拉互動訊號，把目標改寫成可以量的版本：「季末前重新啟動 34 萬美元有風險的業績」。它擬一份橫跨幾天、幾週甚至幾個月的計畫，列出要做的工作、時間表，以及「什麼時候要回來請人核准」的護欄。業務在側邊欄檢查計畫、改幾個地方，按下啟動。

某天，一封外聯信被退回：收件人在休假。Hunter 沒有就此放棄，它從內部和外部資料找到另一個可以聯絡的人，擬好信。但這偏離了業務核准過的計畫，所以它先停下來請業務核准，才寄出新的信。

這篇講 Salesforce 的 long-horizon agents：一個目標被拆成跨週計畫之後，偏離計畫時誰來決定。

## 三個元件

Salesforce 在 [9 月 11 日發表 long-horizon runtime](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/)，說它讓 agent 能追一個目標好幾天、好幾週，而不只是完成一個任務或一次互動。底下有三個元件：

| 元件 | 解決什麼 | Hunter 的例子 |
|---|---|---|
| Memory（記憶） | 跨 session 保留脈絡和進度，對話結束工作不會停 | 記得目標、做過什麼、新的互動訊號和接下來的工作 |
| Durable execution（持久執行） | 讓計畫一直跑下去，情況變了能接著做或修正方向 | 信被退回時找替代收件人，不是就此停下 |
| Dynamic steering（動態調整） | 依使用者的回饋和指示，在執行中改 agent 的行為 | 「對副總裁語氣正式一點」「在 WhatsApp 上隨意一點」 |

Hunter 的[產品頁](https://www.salesforce.com/sales/ai-sales-agent/outbound/)補了一點記憶的設計：它的記憶「lives on accounts, contacts, and opportunities, not in a chat window」。所以每個動作都能從上一個動作停下的地方接著做。

## 計畫就是護欄

前一篇的 [Microsoft Autopilot](/posts/ai/2026-11-20-microsoft-autopilot) 用身分管住「誰在做」。Salesforce 的做法管的是另一件事：「做到哪了、什麼時候要回來問人」。

關鍵在於，Hunter 的計畫不只是待辦清單。官方的描述是，計畫包含要做的工作、時間表，以及「guardrails governing when it checks in for human approval」。業務在啟動前看過並核准這份計畫，所以計畫本身就是授權的範圍：

- **在計畫內**：照計畫做，碰到客戶的動作照公司的核准設定處理。
- **偏離計畫**：先問。官方的例子寫得很清楚：「Since this deviates from the original user-approved plan, the agent will prompt the user for approval before sending the new email.」
- **從偏離中學**：它會從這次的狀況提出計畫更新，例如之後再收到休假自動回覆時該怎麼做，等你同意後納入。

這個設計的好處是，你不用事先想到所有狀況。你只要核准一份計畫，計畫外的事它自己會回來問。代價是，計畫寫得越模糊，什麼算「偏離」就越模糊。

## Agentforce Coworker 是什麼

Hunter 不是獨立的產品。[產品頁的 FAQ](https://www.salesforce.com/sales/ai-sales-agent/outbound/)寫：Hunter 是內建在 Agentforce Coworker 裡、專為業務設計的 harness。Coworker 提供連接好、受管控的工作環境；Hunter 加上業務的脈絡、指引和專門技能。

[Agentforce Coworker](https://www.salesforce.com/news/stories/agentforce-coworker-surpasses-185k-users/) 是 Salesforce 的 AI 同事。員工從要完成的工作開始，Coworker 規劃步驟、協調合適的 Agentforce agent 和流程，再把結果和建議的動作交回來審。Salesforce 說 11 月初使用者超過 18.5 萬，三個月成長 21 倍（廠商自報）。

Hunter 也會出現在 Slack、Microsoft Teams 和 Claude 裡，帶著跟在 Salesforce 裡一樣的目標、客戶脈絡和護欄。

權限方面，FAQ 寫 Hunter 在公司於 Salesforce 設定的權限、商業規則和核准設定內運作。碰到客戶的動作，例如寄外聯信或提案，可以要求業務先核准，每個動作都有紀錄。Salesforce 也有一個開源的語言 Agent Script，可以把模型推理和固定的規則混在一起寫，讓某些決定照固定邏輯走。

## 正式推出了嗎

這件事目前說法不一致：

- [9 月 11 日的新聞稿](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/)寫 Hunter「Pilot now; GA November '26」，11 月中這段文字仍是這樣寫。
- [Sales Cloud 的發布頁](https://www.salesforce.com/sales/latest-release/)寫 Hunter「available GA starting this fall in Coworker」。它提供探勘用的業務技能：研究客戶、找潛在客戶、擬外聯信和建立聯絡節奏，讓業務審過再寄。

所以如果你的公司在評估，要直接問 Salesforce：哪些功能已經正式推出、是不是跑在 long-horizon runtime 上、需要什麼版本和授權。官方目前沒有公布 Hunter 需要哪些版本，也沒有公布支援的地區和語言。

## 目前的證據

[PPC Land 的分析](https://ppc.land/salesforce-agents-gain-a-runtime-that-pursues-goals-over-weeks-not-chats/)指出了幾個缺口：

- 發表內容沒有說明護欄怎麼設定、核准門檻怎麼定，也沒有說長期計畫跟底層紀錄的變更衝突時會怎樣。
- Salesforce 沒有公布長期任務的成效：沒有錯誤率、沒有人介入的比例，也沒有計畫被放棄或修正的頻率。
- Salesforce 自己的研究可以拿來對照：它在 2025 年 6 月發表的 CRMArena-Pro 評測，主流模型的 agent 在單輪業務任務成功 58%，多輪任務只有 35%。那是一次對話內的任務；long-horizon runtime 把時間拉長到好幾週，中間的輪數、工具呼叫和狀態變化都多很多。
- 新聞稿列的客戶數字，例如有客戶 60% 的業績管道由 Hunter 建立，都是廠商自報，沒有分母、沒有量測期間。

退信找替代收件人的例子，是廠商的示範，不是公開的可靠度測試。

## 替一個跨週目標寫護欄

Hunter 會自己擬計畫和護欄，但你核准之前，應該知道自己想要什麼。用這個方法替一個跨週目標寫「哪些偏離要先問」：

**1. 先把目標寫成可量的版本**：Hunter 自己會做這一步（「季末前重新啟動 34 萬美元」），你要檢查它改寫得對不對。數字、期限和範圍是你核准的基準。

**2. 列出計畫內可以自己做的事**：

- 研究客戶、整理互動紀錄
- 擬外聯信草稿
- 更新自己負責的商機備註

**3. 列出一定要先問的偏離**，從四個方向想：

| 偏離方向 | 例子 | 為什麼要先問 |
|---|---|---|
| 換對象 | 原本的聯絡人離職或休假，改聯絡別人 | 你可能跟那個人有過節，或對方公司有內部政治 |
| 換管道 | 原本寄信，改打電話或傳 WhatsApp | 有些客戶只接受特定管道 |
| 換條件 | 提出折扣、延長試用、改合約條款 | 牽涉錢和公司政策 |
| 換範圍 | 名單外的新客戶、計畫沒列的產品 | 可能跟其他業務的客戶重疊 |

**4. 寫出要停下來的訊號**：客戶明確說不要再聯絡、對方開始抱怨、同一個人連續兩封沒回。這些時候不要找替代做法，直接回報。

**5. 定期回頭看**：每週看一次計畫跟實際的差距。它從偏離中學到、提議要改的計畫，在你同意之前不要讓它自動套用。

## 適合誰、不適合誰

**適合：**
- 已經用 Salesforce、有完整客戶歷史資料的業務團隊：Hunter 是從這些資料學怎麼賣的。
- 有跨好幾週的業務目標：救回卡住的案子、開發新名單、季末衝業績。
- 想要有一份可以先檢查、核准的計畫，再讓 agent 動手的團隊。

**不適合：**
- 不用 Salesforce 當 CRM 的團隊。
- 現在就要上線的團隊：正式推出的狀態還不確定。
- 需要公開可靠度數據才會採用的組織：目前沒有。

在台灣，Hunter 支援哪些地區和語言還沒公布。

下一篇的 [OpenClaw Enterprise](/posts/ai/2026-11-20-openclaw-enterprise) 換一個角度：不是單一廠商自己的企業 agent，而是一個跨廠商、統一管理 agent 的平台。

## 參考資料

- [Your Agent Can Sprint, But Can It Go the Distance?](https://www.salesforce.com/blog/long-horizon-agents/)（Salesforce，2026-09-16）
- [Salesforce Expands Agentforce With a New Portfolio of AI Agents Built for High-Value Work](https://www.salesforce.com/news/stories/agentforce-job-ready-ai-agents/)（Salesforce，2026-09-11）
- [Meet Hunter, Your New Sales Agent](https://www.salesforce.com/sales/ai-sales-agent/outbound/)（Salesforce）
- [Sales Cloud Product Releases](https://www.salesforce.com/sales/latest-release/)（Salesforce）
- [Agentforce Coworker Surpasses 185,000 Users](https://www.salesforce.com/news/stories/agentforce-coworker-surpasses-185k-users/)（Salesforce，2026-11-04）
- [Salesforce agents gain a runtime that pursues goals over weeks, not chats](https://ppc.land/salesforce-agents-gain-a-runtime-that-pursues-goals-over-weeks-not-chats/)（PPC Land，2026-09-12）
