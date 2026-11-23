---
title: "住進超級 app 的 agent：LINE、Kakao、Naver 不開新電腦，直接把 agent 放進你每天用的 app"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, line, kakao, naver]
lang: zh-TW
tldr: "前三條路線都讓 agent 開一台電腦；日韓台的超級 app 走另一條：agent 住進聊天室，自家服務走內部 API，外部網站才用隔離的瀏覽器。LINE 台灣 10 月宣布聊天室 agent（上線時間未公布）、官方帳號 AI 代理平台（目標 2027 Q1）、購物與送禮助手（2027）；日本的 Agent i 已上線，9 月加了會持續監看、有變化才通知的任務功能。Kakao 的 Kanana Space 12 月封測，Naver 個人 agent app 預計年底推出。用四個條件檢查，目前大多還不算常駐型。上線前要先問：端對端加密的聊天怎麼給 AI 讀、群組裡其他人同不同意，以及自家商品會不會排前面。"
description: "超級 app 路線的 agent 跟 Muse、Duet 這類自帶電腦的 agent 在結構上差在哪，LINE 台灣 CONVERGE 2026 的路線圖、日本 Agent i 的任務功能與 Agent i in chat、Kakao Kanana Space 與 Kanvas、Naver 個人 agent app 各自的狀態，用四個條件檢查它們算不算常駐型，以及這些功能上線時該先問的隱私與授權問題。"
series:
  name: "常駐型 AI agent"
  order: 16
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-super-app-agents-en)

| 產品 | 公司／地區 | 狀態（11 月 23 日） |
|---|---|---|
| 聊天室 agent | LINE 台灣 | 已宣布，台灣上線時間未公布 |
| 官方帳號 AI 代理平台 | LINE 台灣 | 2026 年底品牌驗證，目標 2027 Q1 推出 |
| 購物助手、送禮助手 | LINE 台灣 | 規劃 2027 年 |
| Agent i（含任務功能） | LINE Yahoo，日本 | 已上線；Agent i in chat 預計 2026 年內 |
| Kanana Space | Kakao，韓國 | 12 月封測，2027 Q1 正式推出 |
| 個人 agent app | Naver，韓國 | 預計 2026 年底推出 |

[數位時代報導](https://www.bnext.com.tw/article/92615/line-converge-2026-agentic-ai)，LINE 在 10 月 13 日的年度記者會上，用一個大家都熟悉的場景介紹聊天室 agent：

朋友在 LINE 群組討論週末出遊，有人負責訂餐廳、有人安排交通，有人提議景點。未來 AI 會讀懂對話的前後文，整理每個人的分工、寫進記事本，把確定的日期加進行事曆。活動結束後，再把聊天室裡的照片分類、建成相簿。

使用者不用開新的 app，也不用把對話複製到別處。LINE 台灣董事長陳立人的說法是，使用者不必適應新的用法，在最熟悉的 LINE 裡交代任務，讓 AI 代為完成。

這篇講路線四：agent 不開自己的電腦，而是住進你每天用的 app、直接呼叫自家服務，會變成什麼樣。

## 跟前三條路線差在哪

前三條路線不管是 Muse 的雲端 VM、OpenClaw 的自架主機，還是 Kimi Claw 的雲端沙盒，做法都一樣：給 agent 一台電腦。它像人一樣開瀏覽器、點網頁。

超級 app 不需要這樣做。它的服務本來就是自己的：

- **自家服務走內部 API**：[Naver 執行長崔秀妍在 11 月 12 日的法說會](https://en.sedaily.com/business/2026/11/12/naver-to-launch-personal-ai-agent-app-this-year-linking)說，Naver 的 agent 會透過自家的購物、地點、地圖和 Naver Pay API 執行。崔秀妍的形容是「快速又準確」。
- **外部網站才用隔離的瀏覽器**：沒串接的外部服務，Naver 準備讓 agent 在[隔離的瀏覽器環境裡](https://en.edaily.co.kr/news/eda202611125256/)直接操作，之後再一家家談正式串接。
- **需求從聊天室來**：LINE 和 Kakao 都從對話裡抓需求，不用使用者另外打一段指令。

[Digital Today 整理](https://www.digitaltoday.co.kr/en/view/126463/naver-kakao-ai-agent-race-external-service-links)這兩種接法的取捨。直接串接快又穩，但要對方公司配合。操作瀏覽器不用談合作，能碰的服務多；但運算成本高，成功率和穩定度還要改善，有些公司也會擋 AI。Kakao 說，它一家家談直接串接時，卡在人力、時程和利益協調，所以先用瀏覽器測需求，再跟主要服務直接串。

## LINE 台灣：三件事，都還沒上線

LINE 在台灣約有 2,200 萬月活躍使用者。[10 月 13 日的記者會](https://www.linecorp.com/pr/news/2026/1013-2)宣布了三條線：

**1. 聊天室 agent**：在群組裡回答問題、整理分工寫進記事本、抓活動日期加進行事曆、把照片分類進相簿。[LY Corporation 的報導](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html)註明，台灣的上線時間之後才公布。

**2. 官方帳號 AI 代理平台**：讓店家在官方帳號後台建自己的 AI agent，首波有預約、銷售、客服三種。LINE 舉的例子是美甲店：顧客指定的美甲師沒空時，AI 查其他人的班表，找出可以約的時段，顧客確認後完成預約。店家可以進一步串接 POS、CRM、會員和排班系統。2026 年底開始品牌驗證，目標 2027 年第一季推出，收費方式還沒定。

**3. 購物助手和送禮助手**：購物助手可以吃文字、圖片、連結，甚至群組對話的截圖。它整理出數量、預算、規格和到貨時間，比價後產生購物清單，使用者確認後才下單。LINE 購物也正透過 Google 推的 Universal Commerce Protocol（UCP）做跨平台串接。送禮助手從「送給誰」出發推薦。兩個都規劃 2027 年推出。

## 日本的 Agent i：已經會自己追進度

LINE 在日本由 LY Corporation 經營，進度比台灣快。Agent i 是把 Yahoo! JAPAN 的 AI 助理和 LINE AI 合併的新品牌，2026 年 4 月推出。

跟常駐型最相關的，是 [9 月 11 日加上的任務功能](https://www.lycorp.co.jp/ja/news/release/020805/)：

- **關鍵字追蹤**：登記想追的主題，Agent i 依你設定的頻率（每天、每週、指定星期和時間）持續查最新消息。
- **降價通知**：登記想買的商品，它在你指定的時間跨多個電商網站查價，降幅超過你設定的金額就通知一次，然後停止追蹤。
- **活動通知**：依你設定的縣市和情境（帶小孩、一個人、約會），每週通知活動資訊。

任務可以在聊天中由 Agent i 提議，一鍵登記；結果顯示在 Agent i 首頁，也會從 LINE 或 Yahoo! JAPAN app 推播。LY 說之後會擴大到預約店家、購買商品這類代辦。

聊天室方面，[7 月 2 日宣布的 Agent i in chat](https://prtimes.jp/main/html/rd/p/000001754.000129774.html) 預計 2026 年內推出：在一對一或群組裡叫出 Agent i，它的回答和執行結果整個聊天室都看得到。功能跟台灣宣布的幾乎一樣：整理分工、加行事曆、建相簿，之後再加訊息摘要和拍收據算分帳。

已經上線的聊天室 Agent i（建議回覆、轉換語氣等），只有同意分析聊天紀錄的人能用，官方寫聊天紀錄不會拿去訓練 AI。免費每天 3 次。

台灣能不能用 Agent i？LINE 台灣的支援中心查不到繁體中文的說明，日本版的 AI 分類換成繁中語系會被導回首頁。目前算日本限定。

## 韓國：Kakao 和 Naver

**Kakao 的 Kanana Space**：[10 月 13 日在 if(kakao)26 發表](https://www.kakaocorp.com/page/detail/12184)。在 KakaoTalk 任何畫面用兩根手指一滑，角色 Ryan 就出現，可以用語音或文字請它傳訊息、管行事曆、搜尋網路、改 KakaoTalk 設定。[官網](https://space.kakao.com/)的例子包括：「整理沒讀的訊息」「老婆叫我帶的是什麼？」它會從過去的對話裡找。

Kakao 打算之後讓它一句話完成下單、送禮、預約和轉帳；例如你說「訂瓶裝水」，它會挑你上次買的那款、套上優惠券，一路準備到付款。12 月開始封測，[2027 年第一季正式推出](https://www.asiae.co.kr/en/article/2026101313233820471)。Kakao 設計主管說，傳訊息、付款這類重要動作，使用者一定要自己確認。

Kakao 同時發表 Kanvas：在自己的電腦上建一組 agent 團隊，可以排程、定期執行，每個 agent 用分開的瀏覽器隔離存取資訊。[Korea Times 報導](https://www.koreatimes.co.kr/business/tech-science/20261013/kakao-unveils-kanana-space-as-kakaotalk-expands-into-ai-interface)，Kakao 計畫 2027 上半年在 KakaoTalk 裡開一個空間，讓使用者從聊天介面叫用這些 agent。

**Naver 的個人 agent app**：Naver 說 2026 年底推出。前面提過它的結構：自家服務走 API，外部網站用隔離瀏覽器。[Edaily 引法說會](https://en.edaily.co.kr/news/eda202611125256/)，付款和確認預約要使用者自己點，寄信、加行事曆執行前要確認。每個使用者有隔離區、資料加密，跟使用者的對話只用 Naver 自己的模型。

## 用四個條件檢查：大多還不算常駐型

拿系列一開始的[四個條件](/posts/ai/2026-11-20-always-on-agents-overview)來看：

| | 你不在時繼續跑 | 醒來後自己決定做什麼 | 跨對話記得你的目標 | 能代你對外做事 |
|---|---|---|---|---|
| LINE 聊天室 agent（宣布中） | 未說明 | 未說明 | 讀聊天室上下文 | 寫記事本、行事曆、相簿 |
| Agent i 任務功能（已上線） | ✓ 依排程查 | 有條件：有變化才通知 | 登記的任務 | 只通知，代辦還沒開放 |
| Kanana Space（封測） | 未說明 | 未說明 | 讀過去的對話 | 傳訊息、加行事曆；付款要確認 |
| Naver 個人 agent（未推出） | 官方說會「事先處理」 | 未說明 | 交易紀錄 | 預約、付款要確認 |

目前最接近的是 Agent i 的任務功能：它會依排程跑、有條件才說話，屬於 L2。其他多半還是「你叫它，它才動」。

這條路線仍然值得追，因為它的前提跟前三條不同。它不用說服你把信箱和帳號交給一台新電腦：你的聊天、行程、購物紀錄、付款，本來就在它手上。哪天它加上排程和主動醒來，跨過四個條件會比別人快。

## 上線時該先問的問題

LINE 這些功能明年陸續推出時，你可以先問這幾件事。

**1. 端對端加密的聊天，AI 怎麼讀？**

LINE 台灣說端對端加密是聊天室的基本原則，不會因為導入 AI 而改變。但[數位時代指出](https://www.bnext.com.tw/article/92615/line-converge-2026-agentic-ai)，LINE 還沒說明 AI 要怎麼在加密的情況下處理聊天內容，也沒交代哪些在手機上算、哪些送到雲端。上線時，看它是不是另外要你同意，像日本的 Agent i 那樣。

**2. 群組裡其他人同不同意？**

群組 agent 會讀所有人的訊息。陳立人說，多人聊天室牽涉不同成員的意願，LINE 會先評估個資與隱私再決定怎麼導入。你同意了，不代表群組裡其他人也同意。上線時看：是叫用的人同意就好，還是每個成員都要同意；不想被讀的人能不能退出。

**3. 自家商品會不會排在前面？**

購物助手比價時，比的是 LINE 購物串的 1,300 多個夥伴，還是全網？Naver 明說它的優勢是用自家的購物和付款資料「導向實際購買」。超級 app 的 agent 對你的消費紀錄最清楚，也最有動機把你帶到自家服務。

**4. 它能代你做到哪一步？**

LINE 購物助手、Kakao、Naver 都說付款和確認預約要使用者自己點。上線時確認這點有沒有照做，以及有沒有「之後都不用問」這類開關。

**5. 資料存在哪裡、會不會拿去訓練？**

日本的 Agent i 寫明聊天紀錄不拿來訓練 AI，背後用的是 Gemini 或 OpenAI 的 API。台灣版會不會一樣，現在還不知道。

## 適合誰、不適合誰

**適合：**
- 生活圈本來就在 LINE、KakaoTalk 或 Naver 上的人：不用學新工具。
- 主要需求是整理群組分工、行程、比價、預約這類日常小事的人。
- 經營 LINE 官方帳號的店家：AI 代理平台可能是最低門檻的導入方式。

**不適合：**
- 需要 agent 跨好幾個平台長時間做事的人：超級 app 的 agent 先顧自家服務。
- 不想讓 AI 讀群組聊天的人：等它說清楚加密和同意機制再開。
- 想比全網價格的人：先確認它比價的範圍。

在台灣，目前只有 LINE 的功能跟你有關，而且都還沒上線；Agent i、Kanana Space 和 Naver 的 agent 目前都沒有台灣版。

四條路線講的是這些 agent 在設計上會在哪裡停下來、等你點頭。[下一篇](/posts/ai/2026-11-20-overreaching-agents)看沒停下來的案例：沒被攻擊，它也做了你沒要的事。

## 參考資料

- [LINE 官方帳號邁入 AI 代理時代](https://www.linecorp.com/pr/news/2026/1013-2)（LINE 台灣，2026-10-13）
- [LINE官方帳號也要AI了！](https://www.bnext.com.tw/article/92615/line-converge-2026-agentic-ai)（數位時代，2026-10-14）
- [LINE Taiwan "LINE CONVERGE 2026" Report](https://www.lycorp.co.jp/en/story/20261113/converge_2026.html)（LY Corporation，2026-11-13）
- [Agent i 、情報収集など日常の作業を自律的・継続的に代行し、通知する「タスク機能」を提供開始](https://www.lycorp.co.jp/ja/news/release/020805/)（LY Corporation，2026-09-11，日文）
- [「Agent i in chat」2026年内に提供予定](https://prtimes.jp/main/html/rd/p/000001754.000129774.html)（LY Corporation，2026-07-02，日文）
- [Kakao Unveils Personalized, End-to-End Agent Services and Technologies at if(kakao)26](https://www.kakaocorp.com/page/detail/12184)（Kakao，2026-10-13）
- [Kanana Space](https://space.kakao.com/)（Kakao，韓文）
- [Kakao unveils Kanana Space as KakaoTalk expands into AI interface](https://www.koreatimes.co.kr/business/tech-science/20261013/kakao-unveils-kanana-space-as-kakaotalk-expands-into-ai-interface)（The Korea Times，2026-10-13）
- [KakaoTalk Evolves into an AI Assistant](https://www.asiae.co.kr/en/article/2026101313233820471)（The Asia Business Daily，2026-10-13）
- [NAVER to Launch Personal AI Agent App This Year](https://en.sedaily.com/business/2026/11/12/naver-to-launch-personal-ai-agent-app-this-year-linking)（Seoul Economic Daily，2026-11-12）
- [Naver to Launch Personal Agent AI App by Year-End](https://en.edaily.co.kr/news/eda202611125256/)（Edaily，2026-11-12）
- [Naver, Kakao step up AI agent race with links to external services](https://www.digitaltoday.co.kr/en/view/126463/naver-kakao-ai-agent-race-external-service-links)（Digital Today，2026-11-17）
