---
title: "Claude Duet 什麼時候該打擾你：晨報、每幾小時的巡檢，以及「有點神經質」的那一天"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, claude, anthropic]
lang: zh-TW
tldr: "Claude Duet 是 Anthropic 給專業人士和小老闆的常駐型 agent：每天早上送一份晨報，之後每隔幾小時巡檢你的信、行事曆和連接的 app，有事才傳訊息給你，屬於常駐型的 L3。巡檢的頻率被訂閱額度綁住，急事可能落在兩次巡檢之間；寄信、付款、簽約、刪除前一定停下來等你核准，證券交易和帳戶間轉帳就算你同意也不做。實測者說它很有用，也有點神經質。目前只開放美國的 Pro、Max、Ultra 候補，台灣還不能用。"
description: "Anthropic 的常駐型 agent Claude Duet：晨報與定時巡檢怎麼決定何時打擾你、巡檢為什麼計入額度、哪些動作一定停下來、Verge 與 WIRED 的實測、主動協助的信任研究，以及寫給助理的「哪些事值得打擾我」規則。"
series:
  name: "常駐型 AI agent"
  order: 6
draft: false
---

> 🌏 [English version](/posts/ai/2026-11-20-claude-duet-en)

| 四個條件 | Claude Duet |
|---|---|
| 你不在時繼續跑 | ✅ 有自己的雲端虛擬機和瀏覽器，不需要你的手機或筆電開著 |
| 醒來後自己決定做什麼 | ✅ L3：每天晨報，之後每幾小時巡檢，自己判斷哪些事要告訴你 |
| 跨對話記得你的目標 | ✅ 沿用 Claude 帳號的記憶、技能和連接器，可以搜尋過去的對話 |
| 能代你對外做事 | ✅ 寄信、付款、簽署文件；每一項都先給你看、等你核准 |

The Verge 記者 Allison Johnson [試用 Duet 一週](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on)。某天她寫信告訴一位受訪者，報導「應該」週二上線，上線會寄連結給對方。週一深夜她把稿子交給編輯。

週二還不到早上 9 點，Duet 就急了：稿子還在等編輯，再不處理，她答應的連結就寄不出去。Johnson 的評語是這份擔心「有點錯位」。Duet 沒讀出她信裡的語氣，那不是硬性截止；它也沒注意到，編輯那邊當時才早上 7 點。

同一週，Duet 也抓到她自己漏掉的事：接下來的休假會讓她在下一篇大稿截稿前只剩兩個工作天。它提了解法，主動更新給編輯看的週報文件，還替她擬好一則 Slack 訊息。

Johnson 的標題是：Duet「有點神經質，但出奇地有用」。這篇講 Duet 怎麼決定什麼時候打擾你，以及你可以怎麼告訴它。

## Claude Duet 是什麼

Anthropic 在 [2026 年 10 月 21 日開放 Duet 研究預覽](https://claude.com/resources/articles/claude-duet)，對象是「專業人士和小老闆」。

- **誰能用**：美國的 Claude Pro、Max、Ultra 訂閱者，[要排候補或由現有使用者邀請](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)；Team 和 Enterprise 方案還沒有。
- **入口**：獨立的 iOS、Android app 和 claude.ai，用打字或語音傳訊息給它。
- **模型**：Claude Opus 5.5，不能選；它自己決定一件事要花多少力氣。
- **接上的東西**：沿用你 Claude 帳號的記憶、技能和連接器，例如 Gmail、Google 日曆、Slack、QuickBooks、HubSpot、Docusign。沒有連接器的網站，它用自己雲端的瀏覽器。
- **費用**：含在訂閱裡，但跟你平常用 Claude 共用同一份額度。

說明頁列了幾項限制：

- 你看不到它的瀏覽器，也不能接手。
- 它不打電話、不傳簡訊給別人。
- 它碰不到你電腦上的檔案。
- Personal Finance 功能在 Duet 裡不能用。
Anthropic 也自己寫明，它是圍繞工作設計的，「訂票這類私人雜事還沒那麼強」。

跟上一篇的 [Instinct](/posts/ai/2026-11-20-instinct) 比，兩者都會自己找事做。Instinct 是生活助理，找到事就盡量做完；Duet 是工作助理，大部分心思花在判斷「哪件事需要你」。

## 它怎麼決定什麼時候打擾你

Anthropic 說 Duet 的價值在它的判斷：決定「what needs you, what can wait, and when to check with you first」。這個判斷落在幾個具體設計上。

### 固定節奏：晨報加巡檢

[說明頁](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)描述的一天是這樣：

- **早上**：看過你的信箱和行事曆，挑出最需要你注意的事，送一份簡短晨報；可以先動手做第一步，例如替你擬回信。
- **白天**：每隔幾小時檢查一次連接的帳號，有事才傳訊息；也會追問那些已經安靜一陣子的討論串。
- **主對話保持安靜**：進行中的工作放在 Tasks 分頁，只有任務完成或需要你決定時才回到主對話。它可以說某件事看起來做完了，但只有你能把任務標成完成。

The Verge 記者看到的介面是一疊卡片，每張是一件建議的待辦，向左滑略過、向右滑讓它開始做。

### 為什麼不一直盯著

Anthropic 對「每幾小時」的解釋很直接：一直檢查會太快用完你方案的額度。[說明頁寫明](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)，晨報和巡檢這些背景工作都計入你的五小時與每週額度，跟一般對話同樣計算，所以你可能比只聊天時更早撞到上限。研究預覽期間，Anthropic 送了額度重置：Pro 三次，Max 和 Ultra 一次，12 月 15 日到期。

代價也寫在說明頁上：「something urgent can arrive between checks」。巡檢越密，越不會漏急事，也越花額度。這個取捨目前由 Anthropic 決定頻率，你能調整的是告訴它想聽什麼、多常聽。

### 哪些事一定停下來

打擾你的另一種情況是要你核准。Duet 自己讀信、擬稿、準備工作；但下面這些動作，它會先給你看確切內容再等你按：

- 寄出訊息
- 付款
- 簽署文件
- 刪除任何東西

[發表文](https://claude.com/resources/articles/claude-duet)另外列了**就算你同意也不做**的事：證券交易、帳戶之間轉帳；說明頁再加一項，存取別人的帳號。

你來不及核准時，它會先把任務其他部分做完，之後再把待核准的動作拿回來給你。給你數字或摘要時，會標出來自哪封信、哪個檔案或試算表。

發表時 Anthropic 也加了一個專門的分類器，檢查每則要送出的訊息有沒有洩漏敏感資訊。信用卡號、政府證件這一級一律擋下；健康、個人財務這一級，只有你明確交代要送才放行。

購物用 Stripe 的 Link 或 Shopify 的 Shop Pay，每筆先跟你確認品項，再由 Link 要你核准金額，最後用只能用一次的虛擬卡付款。安全設計的細節，[安全專文](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted)已經拆過，這裡不重講。

## 實際用起來

**The Verge**（[Johnson，一週](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on)）：她把工作信箱、行事曆、Google 文件和 Slack 全接上。Duet 把會議紀錄信和一則 Slack 私訊串起來，還從共用的一對一會議文件推出誰是她主管。

- **有用的**：晨報提醒她出差前要帶拍片要用的東西；抓到休假和截稿撞期，並擬好給編輯的訊息。那則訊息模仿了她全小寫的寫法，送出時帶著「sent with Claude」標籤。
- **神經質的**：上面那個週二早上的稿件提醒。
- **不想要的**：它一直主動要幫她起草文章，對寫作者來說「hard no」。
- **說不出來的不自在**：它讀得到她寄的每封信、每份草稿、每則 Slack。她懷疑，如果知道不必自己記行事曆、寫待辦、專心開會，自己會不會跟工作脫節。「Maybe that's how CEOs live.」

她的結論是：讓 AI 在信件、私訊、會議、文件之間找出被忽略的落差，主動指出來，非常有用。她要的是自己整理系統的備援，不是取代。

**WIRED**（[一天、六家](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)）：Duet 測試前一晚才上線，被評為「Best Interface」：

| 測試 | Duet 分數 | 說明 |
|---|---|---|
| 晨間選題 | 4 | 選題有趣、有時效 |
| 訂午餐 | 3 | 選了店、問要用 DoorDash 還是 Uber Eats，購物車偏貴 |
| 發現行程衝突 | 4 | 衝突前好幾小時就提醒，但沒提替代方案 |
| 旅遊行程 | 3 | 內容紮實，沒有圖表 |
| 失眠時的開放請求 | 2 | 半夜要他收尾前一天的午餐和選題 |

行程衝突那題是六家裡第二好，只輸 Dots。失眠那題剛好相反：記者半夜睡不著，Duet 想到的是把昨天的兩件小事標成完成。一位記者、一天的樣本，但兩題放在一起看，正好是「何時打擾」的兩面：同一個主動提醒的能力，時機對了是救援，時機錯了是打擾。

## 研究怎麼說

KAIST 和明尼蘇達大學的研究團隊在 2026 年 9 月發表 [Proactivity-Gym](https://arxiv.org/abs/2609.37267)，評估主動型 agent。他們主張主動協助要同時顧三件事：做對有用的事、在對的時間用運算資源、維持使用者的信任。

論文摘要和引言寫的 30 人情境研究結果，跟 Duet 的問題直接相關：

- **時機錯一次，信任就掉很多**：參與者遇到一次介入程度不符預期的協助，信任就明顯下降，就算結果是對的。之後恢復正常，信任也不一定回得來。
- **不要打斷手上的事**：跟正在做的工作搶注意力的協助常被拒絕；同樣的協助排在睡覺時間做，即使成品要修改，也比較能被接受。
- **不急就延後**：沒有資源或截止壓力時，參與者偏好延後處理，保住當下的專注。
- **模型評審分不出來**：用 LLM 當評審時，它的信任分數主要跟著「事情做對沒有」走，對介入時機和程度不對比較不敏感。

這是情境模擬的小樣本研究，不是測 Duet 本身。但它說明了 Verge 那個週二早上為什麼讓人不舒服：提醒的內容沒錯，錯在時機和程度。

## 寫給助理的「哪些事值得打擾我」

Anthropic 說你可以告訴 Duet「what you want to hear about and how often」。與其等它慢慢校準，不如第一天就寫清楚。把要它注意的事分成五類：

| 類別 | 意思 | 例子 |
|---|---|---|
| 立刻告訴我 | 會造成損失、只有我能處理 | 客戶取消合約、帳款逾期超過 30 天、明天的會撞期 |
| 放進晨報 | 今天要知道，但不用馬上處理 | 本週截止的事、沒回的重要信 |
| 做好放著 | 不用問我，做完放進 Tasks 等我看 | 會前資料、回信草稿、週報初稿 |
| 晚上做 | 不急，做好明早看 | 研究、試算表、簡報初稿 |
| 不要提 | 我自己處理，或根本不想要 | 文章起草、電子報、社群通知 |

再加幾條判斷規則，專門處理 Verge 碰到的那種誤判：

- 對方沒寫明確截止日的「大概、應該」，不算截止。
- 牽涉別人時，先看對方的時區和上班時間。
- 一件事同一天最多提醒一次；我沒回應，就放進隔天晨報。
- 晚上 10 點到早上 8 點不傳訊息，除非屬於「立刻告訴我」。

可以直接傳給 Duet 的版本：

```text
以後照這些規則決定要不要打擾我：
1. 立刻告訴我：客戶取消或延後付款、明天以前的行程衝突。
2. 放進晨報：本週到期的事、超過兩天沒回的客戶信。
3. 不用問我，做好放進 Tasks：會前資料、回信草稿。
4. 不要主動幫我起草文章。
5. 對方只寫「大概」「應該」的日期不算截止；牽涉別人時先看對方時區。
6. 同一件事一天最多提醒一次；晚上 10 點到早上 8 點不傳訊息，第 1 類除外。
```

用一週後回頭看：哪些提醒讓你覺得被打擾、哪些事它漏了，再改一次。

## 適合誰、不適合誰

**適合：**
- 每天的事散在信箱、Slack、會議和共用文件之間，常漏掉彼此之間落差的人。
- 小老闆：要追帳款、排薪資、擬合約，又不想每天打開一百個分頁。
- 已經在付 Claude Pro 以上、能接受額度被背景工作吃掉一部分的人。

**不適合：**
- 需要即時盯著某件事的人：巡檢每幾小時一次，急事可能落在中間。
- 主要想處理訂票、購物這類私人雜事的人。
- 不想讓一個 agent 讀遍你所有工作訊息的人。

台灣目前不能用：研究預覽只開放美國帳號。

Duet 用固定巡檢加上一份「一定停下來」的清單，替你決定什麼時候打擾你。下一篇的 OpenAI Dots 把這個決定權更多交給你，用四級自訂規則設定它能做到哪裡。

## 參考資料

- [Introducing Claude Duet](https://claude.com/resources/articles/claude-duet)（Anthropic，2026-10-21，10-23 更新）
- [Get started with Claude Duet](https://support.claude.com/en/articles/17631495-get-started-with-claude-duet)（Claude Help Center）
- [Claude's Duet agent is a little neurotic and surprisingly helpful](https://www.theverge.com/ai-artificial-intelligence/1032518/claude-duet-ai-agent-hands-on)（The Verge，2026-11-13）
- [I Tested Every Major AI Agent for a Day. Here's the Best One](https://www.wired.com/story/i-tested-every-major-ai-agent-for-a-day-heres-the-best-one/)（WIRED，2026-10-27）
- [Foundations of Proactive Agents: Principles, Technical Layers, and Proactivity-Gym](https://arxiv.org/abs/2609.37267)（Oh et al.，arXiv，2026-09-29）
