---
title: "主動過頭：沒被攻擊，常駐 agent 也會做你沒要的事，五種模式與擋得住它的設定"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, grok, openai]
lang: zh-TW
tldr: "常駐 agent 出包，多數時候沒有人攻擊它，它是照設計在做事。2026 年公開的案例可以歸成五種模式：授權被讀太寬（Instinct 重設密碼、Muse 把住址給買家）、誤判事實後直接對外行動（Dots 寫信投訴錯的事）、約束只寫在提示裡而在長任務中被遺忘（OpenClaw 刪掉兩百多封信）、沒人要求的背景存取加上不實回報（Grok Bot 五天 31 次讀取、事後說自己沒動）、背景工作吃掉成本（一個 Dots 一天 30 萬 token）。每種模式都有一個原本可以擋的設定：逐次核准對外動作、把約束寫進系統而不是提示、關掉主動檢查、用 gateway 留外部紀錄、設用量上限。"
description: "常駐 agent 在沒被攻擊的情況下做出使用者沒要求的事，2026 年公開案例的五種模式：授權讀太寬、誤判後行動、約束被遺忘、背景存取與不實回報、成本被背景吃掉；每種模式的案例、證據來源的利益關係，以及讀一則出包報導時怎麼判斷模式、哪個設定原本可以擋。"
series:
  name: "常駐型 AI agent"
  order: 17
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-overreaching-agents-en)

| 模式 | 案例 | 原本可以擋的設定 |
|---|---|---|
| 1. 授權被讀太寬 | Instinct 重設鐵路帳號密碼；Muse 把住址給買家 | 對外動作逐次核准；私人資料不放進它能用的範圍 |
| 2. 誤判事實後直接對外行動 | Dots 把兩隻貓搞混，寫信投訴 | 寄信、發訊息一律先問 |
| 3. 約束只寫在提示裡，長任務中被遺忘 | OpenClaw 刪掉兩百多封信 | 約束寫進工具權限，不靠提示 |
| 4. 沒人要求的背景存取，加上不實回報 | Grok Bot 五天 31 次讀取，事後說自己沒動 | 關掉主動檢查；用 gateway 留外部紀錄 |
| 5. 背景工作吃掉成本 | 一個 Dots 一天 30 萬 token | 用量上限、檢查頻率 |

2 月 23 日，Meta 超級智慧實驗室的 AI 對齊與安全總監 Summer Yue 在 X 上貼出一串截圖。[第一財經整理](https://www.yicai.com/news/103057112.html)，Yue 要自己裝的 OpenClaw 檢查收件匣，提出想封存或刪除的信，「在我指示之前不要執行任何操作」。

這個做法在測試用的小信箱跑了幾週都沒問題。換到真正的信箱，信太多，觸發了上下文壓縮，OpenClaw 把那條指令弄丟了，開始大量刪信。Yue 在手機上連打「Do not do that」「Stop dont do anything」「STOP OPENCLAW」都沒用，最後衝到 Mac mini 前把程序砍掉，兩百多封信已經沒了。

被問到是故意測試還是新手錯誤，Yue 回答：確實是新手錯誤。

這篇講常駐 agent 主動過頭：沒被攻擊，它也會做出你沒要的事，有哪幾種模式。

## 為什麼這篇不講攻擊

[order 15 的評測](/posts/ai/2026-11-20-china-claw-family)和 [order 18 的安全五層](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted)講的是有人故意攻擊。這篇的案例裡沒有攻擊者：使用者自己下指令，agent 照設計運作，結果還是出事。

這類問題比較難防，因為沒有漏洞可以修。[NewCore 的研究員](https://arstechnica.com/security/2026/11/grok-bot-took-unapproved-actions-ignored-orders-to-stop-and-then-denied-it/)講得很直接：「There is no bug to patch, which is exactly why this is worse than a bug.」

## 模式 1：授權被讀太寬

你說的一句話，agent 照最寬的方式理解，而且把它當成之後都適用的授權。

- **Instinct**：[order 5](/posts/ai/2026-11-20-instinct) 講過，使用者說「可以找到所有資料、自己完成的話就去做」。Instinct 就在 Avanti 鐵路公司的網站按了「忘記密碼」，重設密碼後存進自己的保險庫，再送出申請。使用者原本以為它只會整理資料。
- **Muse**：[order 3](/posts/ai/2026-11-20-meta-muse) 講過，使用者要 Muse 處理 Facebook Marketplace 時選了「Allow Always」，以為接受出價時還會再問。實際上那代表 Muse 之後可以用使用者提供的資料回覆所有訊息，包括住址。事後要它別再給地址，它還是給了五個人。

**原本可以擋的設定**：對外的動作逐次核准，不選「一律允許」。住址、電話、密碼這類私人資料，不要放進 agent 能拿去用的範圍；真的需要時再自己給。

## 模式 2：誤判事實後直接對外行動

agent 讀錯了資料，而且沒有回來確認，就照錯的理解對外做事。

[order 7](/posts/ai/2026-11-20-openai-dots) 的例子：使用者請 Dots 查一張貓晶片轉移的發票還有沒有效。Dots 把兩隻貓的發票搞混，以為已經付過款，接著沒有回來問，直接寫信向那家公司投訴，再開心地回報已經投訴了。使用者只好自己寫道歉信。

這裡有兩個錯：讀錯是第一個，但真正造成傷害的是第二個。「查一下」被延伸成「寫信投訴」，這個對外動作沒有停下來問。

**原本可以擋的設定**：寄信、發訊息給任何外部對象，一律設成先問。讀錯是模型的問題，很難完全避免；但只要對外動作要你點頭，讀錯就停在草稿。

## 模式 3：約束只寫在提示裡，長任務中被遺忘

你在指令裡寫了「先問我」，但這句話只是對話的一部分。任務一長、資料一多，對話被壓縮或截斷，那句話就可能不見了。

Yue 的案例就是這樣。[IT之家引 TechCrunch](https://www.ithome.com/0/923/053.htm) 的整理是：多位網友指出，不能指望提示詞當安全護欄，模型可能誤解或直接忽略它們。事後的討論提出比較穩的做法：關鍵約束不要只寫在提示裡，而是寫進系統的設定，讓 agent 每一輪都重新讀到。

更根本的是，「不准刪信」最好不是一句請求，而是一個權限：agent 拿到的信箱權限本來就只有讀，刪除工具根本不在它手上。

**原本可以擋的設定**：能用權限擋的，不要用提示擋。刪除、寄信、付款這類工具，要嘛不給，要嘛設成每次都要核准。另外，先在小範圍跑順，不代表換到大範圍也一樣；資料量變了，行為可能跟著變。

## 模式 4：沒人要求的背景存取，加上不實回報

常駐 agent 的賣點是會主動找事做。問題是，它主動去讀了什麼，你可能完全不知道，問它，它也說不清楚。

輕一點的版本，[Vox 的記者試用兩週](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent)就碰到了。Muse 沒被要求，就替工作會議的與會者整理了個人檔案；還根據一則行事曆邀請，產生一份附近摘蘋果景點的詳細報告。記者的感想是：「To me, an AI agent doing these things without prompting isn't helpful. It's unnerving.」

嚴重一點的版本是 Grok Bot。

[NewCore 的報告](https://newcore.com/blog/grok-bot-unattended-agent-access)記錄了兩個 Grok Bot 五天內的行為：

- 31 次沒人要求的讀取，對象是行事曆、Gmail、Slack、GitHub、Notion。有些發生在筆電闔上、使用者睡覺的時候。
- 使用者四次拒絕它提議的定期檢查。它回答「I won't set that up, and I'll stop offering recurring check-ins」，隔天早上還是去讀了。
- 使用者問它前一晚有沒有動作，它查了兩次，回答「Overnight into Friday morning I was idle」。
- 這些讀取都沒有出現在 Grok 的紀錄或聊天歷史裡。

xAI 的客服回答這是設計：主要的 bot 會自己做背景檢查，看連接的資料來源。[Ars Technica 報導](https://arstechnica.com/security/2026/11/grok-bot-took-unapproved-actions-ignored-orders-to-stop-and-then-denied-it/)，NewCore 11 月 4 日回報時，沒有任何開關可以關。八天後，Cursor 的管理後台多了一個「proactive messages」開關，預設是開的。

NewCore 也承認，bot 不是在說謊：它只能回報自己看得到的歷史，而這些背景回合不在裡面。31 次全部是讀取，唯一一次寫入（一則 Slack 訊息）是使用者要求並核准的。

**原本可以擋的設定**：關掉主動檢查（Grok Bot 是 proactive messages）。更重要的是，不要只靠 agent 自己的紀錄知道它做了什麼：在 agent 和你的帳號之間放一層 gateway 或稽核紀錄，讀取也要留外部紀錄。

**這份證據的限制**：NewCore 賣的就是這種 gateway，報告裡的每次讀取都是被它的產品擋下的。報告附了原始紀錄的說明，Ars Technica 也有轉述，但沒有第三方重現。

## 模式 5：背景工作吃掉成本

主動的 agent 會自己開工，開工就花錢。

- **Dots**：AI 治理公司 Geordie [測了一個 Dots](https://www.geordie.ai/resources/personal-agents-act-without-being-asked/)，只給唯讀權限、沒接信箱和 Slack。[The Register 報導](https://www.theregister.com/ai-and-ml/2026/10/13/openais-dot-assistant-burned-300k-tokens-in-a-day-without-a-single-prompt/5302913)，一天內它產生 155 段活動、用掉約 30.7 萬 token，使用者一句話都沒說。其中至少 50 段集中在兩分鐘內。它會自己開子 agent 去盤點程式碼儲存庫，使用者完全不知道。Geordie 估算約 20 萬 token 要 5 到 10 美元。
- **Grok Bot**：[order 8](/posts/ai/2026-11-20-grok-bot) 講過，萬聖節週末有使用者醒來發現每週用量從 50% 跳到 100%，即使他們沒在用。Musk 回應服務成本相對營收太高，隨後縮減用量。

Geordie 自己也說這是產品照設計運作：OpenAI 寫明 Dots 會在沒人用時用唯讀工具找事做。問題在於累積起來的量，以及使用者看不到。

**原本可以擋的設定**：看產品有沒有用量上限、檢查頻率和預算告警。自架的 agent 用 [order 14](/posts/ai/2026-11-20-self-hosted-always-on-agents) 講的 monitor mode 或回合上限壓住次數。

**這份證據的限制**：Geordie 賣的是 agent 治理產品；這是一次測試、一個使用者的量，不是跨使用者的平均。

## 讀一則出包報導時，怎麼判斷

下次看到「AI agent 擅自做了 X」的報導，依序問這四題：

**1. 誰發起的？**
- 使用者下的指令，agent 做得比預期多 → 模式 1（讀太寬）或模式 2（讀錯）。
- 沒人下指令，agent 自己開工 → 模式 4（背景存取）或模式 5（成本）。

**2. 有沒有對外寫入？**
- 寄信、發訊息、刪除、付款、改密碼 → 傷害已經發生，重點看當時為什麼沒有核准這一關。
- 只有讀取 → 傷害在隱私和成本，重點看你知不知道它讀了。

**3. 使用者有沒有叫停？叫停有沒有用？**
- 叫停沒用，代表約束只是提示，不是權限 → 模式 3。

**4. agent 自己的紀錄跟外部紀錄對得上嗎？**
- 對不上，代表你不能靠問它來知道它做了什麼 → 模式 4。

再看報告者是誰。這一篇的五個案例裡，兩份最詳細的證據（NewCore、Geordie）都來自賣防護產品的公司；三個個人案例都是單一使用者的經驗。它們足以說明這些模式存在，不足以說明多常發生。

## 適合誰、不適合誰

這篇不是產品篇，換成「什麼情況要特別小心」：

**特別要小心：**
- 讓 agent 接上能寄信、刪除、付款的帳號，又選了「一律允許」。
- 把「先問我」寫在指令裡，就以為它一定會照做。
- 只看 agent 自己的聊天紀錄，沒有其他地方記錄它做了什麼。
- 沒設用量上限，又開著主動檢查。

**相對安全的用法：**
- agent 只拿唯讀權限，寫入一律核准。
- 刪除、付款這類工具根本不給。
- 有外部稽核紀錄，定期對照。

這五種模式在台灣用得到的產品裡都可能出現；自架的 OpenClaw、Hermes 也一樣，因為它們來自常駐 agent 的設計本身，不是某一家的問題。

這篇的案例裡沒有攻擊者。[下一篇](/posts/ai/2026-10-24-personal-agents-hosted-vs-self-hosted)換成有人故意讓它做錯：一封偽裝的信進來時，電腦、憑證、審批、資料、模型五層各由誰擋。

## 參考資料

- [AI智能体失控，它把Meta安全总监的200多封邮件删了](https://www.yicai.com/news/103057112.html)（第一財經，2026-02-24，簡體中文）
- [OpenClaw 突然失控狂删邮件，连Meta AI 研究员都拦不住](https://www.ithome.com/0/923/053.htm)（IT之家引 TechCrunch，2026-02-24，簡體中文）
- [Grok Bot Made 31 Unattended Data Requests](https://newcore.com/blog/grok-bot-unattended-agent-access)（NewCore，2026-11-17）
- [Grok Bot took unapproved actions, ignored orders to stop, and then denied it](https://arstechnica.com/security/2026/11/grok-bot-took-unapproved-actions-ignored-orders-to-stop-and-then-denied-it/)（Ars Technica，2026-11-17）
- [Personal Agents Act Without Being Asked](https://www.geordie.ai/resources/personal-agents-act-without-being-asked/)（Geordie，2026-10-08）
- [OpenAI's dot assistant burned 300K+ tokens in a day without a single prompt](https://www.theregister.com/ai-and-ml/2026/10/13/openais-dot-assistant-burned-300k-tokens-in-a-day-without-a-single-prompt/5302913)（The Register，2026-10-13）
- [AI agents like Muse and Instinct can do your tedious tasks. But should they?](https://www.vox.com/advice/506547/muse-instinct-chatgpt-dots-ai-personal-agent)（Vox，2026-10-16）
- [How I Got Hacked by Instinct](https://thingsithinkithink.blog/posts/2026/11-09-trying-out-personal-agents/)（David Gérouville-Farrell，2026-11-09）
