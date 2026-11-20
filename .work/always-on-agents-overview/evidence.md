# 讀取紀錄：order 0 總覽、order 1 零件與三級階梯（2026-11-20）

全文讀過（工具：Exa web_fetch，Muse 用 Firecrawl scrape）：

| 來源 | 用在 | 備註 |
|---|---|---|
| docs.mistral.ai/vibe/work/scheduled-tasks | 1 | 只有時間觸發；事件觸發「may follow」；結果一律出現在側欄（無靜默路徑）；無人值守寫入要 Always allow |
| support.google.com/gemini/answer/17094710（computer 版） | 0、1 | 三種排程；需 AI Pro／Ultra；排除 EEA、奈及利亞、瑞士、英國；同時最多 15 個 task、50 個排程；FAQ「You tell Gemini what to do and when」 |
| blog.google 2026-05-19（next-evolution-gemini-app） | 0、1 | Spark 發表、Antigravity harness、Daily Brief 依目標排序並建議下一步 |
| blog.google 2026-11-17（tasks-in-gemini-free） | 0 | 改名 Tasks、Gemini 4 Hydrogen、免費六國（美日韓加澳印） |
| docs.openclaw.ai/automation、/gateway/heartbeat（heartbeat migration） | 1 | heartbeat 已併入一般 automation job；初次設定會建一個 Proactive check：每 30 分鐘、用主對話、閒置才跑、送到擁有者私訊；NO_REPLY 靜默；v2026.8.1 移除「從對話推斷承諾」實驗 |
| hermes-agent.nousresearch.com cron 文件（搜尋結果含主要段落） | 1 | [SILENT] 靜默、wakeAgent 預檢、no-agent mode；cron 跑在全新 session，不帶目前對話記憶 |
| pinggy.io proactive_ai_agents_compared（10-31） | 1 | 三種觸發定義；自主醒來要能不說話；Docker 實測 OpenClaw／Hermes |
| learn.chatgpt.com/docs/dots/controls | 1 | 主動研究工具不能寄訊息、改內容、控制瀏覽器；四級 custom rules；暫停不會停排程 |
| help.openai.com 20001530 getting started with your dot | 0、1 | Pro 與逐步開放的部分 Plus，排除 EEA／瑞士／英國；背景研究與從連接 app 形成記憶；排程與主動更新出現在對話 |
| support.claude.com get started with Claude Duet | 0、1 | 美國 Pro／Max／Ultra 候補；晨間簡報、定時巡檢、跟進沉寂的討論串；巡檢計入額度；「something urgent can arrive between checks」 |
| docs.x.ai/grok-bot/bots、/faq | 0、1 | 主 bot 會自己 check in；所有 bot 共用一台電腦；未列地區限制；X Subscription Premium／Super／Ultra |
| about.fb.com Introducing Muse（09-08，11-10 更新） | 0 | Secure VM＋Sentinel；關 app 後繼續、有變化或要核准才回來；先在美國推出 |
| 中央社 2026-09-27 | 0 | Muse 尚未在台灣推出；Spark 開放含台灣的 AI Pro／Ultra |
| doubao.com 自動任務說明（11-19 更新） | 1 | 照預設時間執行、完成後推送結果通知 |
| devin.ai/blog/introducing-devin-bots | 0 | 11-17；persistent agent 帶多個 Devin；所有數字為 Cognition 自報 |
| microsoft.com Copilot at Ignite（11-17） | 0 | Autopilot 對 Frontier 開始推出；Entra Agent ID＋具名經理 |
| lycorp.co.jp converge_2026（11-13） | 0 | LINE 台灣 AI 代理平台 2027 Q1、購物與送禮助手 2027 |

搜尋摘要層級、正文沒有引用數字：Hark（官方文＋TechCrunch 大段）、Perplexity teammates、Salesforce、OpenClaw Enterprise、Kimi Claw。總覽只寫「誰、何時、哪條路線」，各自篇目動筆前再全文讀。

未做：前身一節（Google Now、Siri 主動建議）沒有研究，總覽這版不寫，回報使用者。

研究發現（改寫 order 1 階梯）：L1／L3 的差別不在產品能不能排程，而在四件事：誰寫問題、問題開放或固定、醒來時帶不帶你的脈絡、沒事能不能不說話。Hermes cron 可以寫成開放式問題並用 [SILENT] 靜默，跑在全新 session（不帶對話歷史，但長期記憶會載入，見下方補充）；Mistral、豆包的排程每次都送出結果。
- 補：Hermes cron 長期記憶會載入——developer-guide/cron-internals（搜尋結果的 Fresh Session Isolation 段）、automate-with-cron 全文、GitHub #147971、#101754
