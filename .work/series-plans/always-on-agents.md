# 系列規劃：常駐型 AI agent（always-on-agents）

使用者確認：2026-11-20（四條路線結構，order 0–24；2026-11-19 已確認：定義第 2 條改為「自己決定醒來做什麼」、order「從唯讀開始」獨立）

研究筆記：`.work/research/always-on-agents/research-note.md`（掃描完成、精讀未做；母群、非美國掃描、定義重篩表、自架與 Claw 家族、責任與法規、日韓台超級 app、偏誤、事實交叉表）

## 系列登錄資料（第一篇發佈時登錄到 `src/utils/series.ts`）

- slug：`always-on-agents`
- category：`ai`（系列分組 `ai-agents`）
- 名稱：zh-TW「常駐型 AI agent」／en「Always-On AI Agents」
- 描述 zh-TW：關掉 app 還會自己決定做什麼的 agent。先拆它們的零件與「會自己醒來」的三個等級，再依「它在哪台電腦上跑」分四條路線看各家的設計取捨，最後談它們怎麼出錯、值不值得、出事誰負責、怎麼從唯讀開始用。

## 定義（每篇產品篇開頭用小表標出符合哪幾條）

1. 你不在時繼續跑（廠商雲端電腦，或一台常開的機器）
2. 醒來後由 agent 依你的目標自己決定做什麼，不只是照預先寫好的提示執行
3. 跨對話記得你的目標
4. 能代你對外做事（寄信、付款、改資料）

觸發階梯：L1 固定提示排程 → L2 使用者設的事件觸發 → L3 自主判斷。產品篇收 L3；L1、L2 在 order 1 當對照；Tasks in Gemini（L2）因為在原始清單、用的人最多，獨立一篇當邊界案例。

## 組織原則

主軸是「它在哪台電腦上跑」，分四條路線；產品放在路線底下。

- **單篇**：這個產品有別人沒有的設計取捨（Duet 何時打擾、Dots 四級規則、Grok Bot 多 bot 共用電腦…）。
- **併進路線篇當表格一行**：核心相同、差在包裝（中國 Claw 家族都是包裝 OpenClaw；開源小專案多是 heartbeat＋記憶；日韓多數未上線）。
- **新產品**：先放進對應路線篇的表格（post-update）；帶來新的設計取捨才另開單篇。這是系列的停止條件。

## 每篇骨架

- 產品篇：定義小表（四條＋級別）→ 一個具體情境開場 → 這家的核心取捨 → 實際出錯的案例 → 適合誰、不適合誰 → 一句台灣能不能用。
- 路線篇：這條路線跟其他路線的結構差異 → 代表產品對照表 → 這條路線的取捨與風險。
- 共通問題篇：從跨產品案例出發，不重講個別產品，連回產品篇。
- 共通規則：廠商數字標「廠商自報」並配至少一個獨立來源；台灣可用性只在 order 0（能／不能／有條件）與 order 24（細節）。

## 目標讀者

用過 ChatGPT／Claude 對話、聽過「agent」但分不清這波產品差在哪的 zh-TW 讀者；以及想判斷要不要把信箱、行事曆、程式庫交給其中一個的工程師與知識工作者。不寫給：要逐項比價表的人（變動太快，給判斷方法與查證入口）；要自架安裝教學的人（連 OpenClaw 與 Hermes Agent 系列）。

讀法：從頭讀；只讀關心的那條路線；或只查某個產品。

## 入口

order 0 是總覽：四條定義、與聊天機器人／一次性 agent mode／排程自動化的分界、2026-05～11 時間線與一節前身（Google Now、Siri 主動建議等）、四條路線地圖（每條列代表產品與台灣能／不能／有條件）、相鄰但不算（Mistral Vibe、豆包工作、AutoGLM、Kimi Work、Manus、Alexa+）、偏誤聲明（美國產品為主、上線不到半年、證據多為廠商自述、寫到 2026-11 為止）。不是事件文。

## 弧線

入門（看得到的晨間簡報 → 看不到的零件與階梯）→ 路線一 廠商替你開一台雲端電腦（個人）→ 路線二 替團隊與企業做事 → 路線三 跑在你自己的機器上 → 路線四 住進你已經在用的 app → 共通問題（自己做錯 → 被人騙 → 人的那一面 → 有沒有用 → 值不值得 → 另一端 → 出事誰負責）→ 從唯讀開始

排序原則：可見先於不可見；動機先於抽象（每篇一個具體情境開場）；一次一個跳躍（每篇一個切入概念）；路線由「你最不用管」到「你最要自己管」再到「住進既有 app」；螺旋加深（「核准」在路線一是購物確認與何時打擾、路線二是代理身分與稽核、路線三是你自己設沙盒、安全篇是審查模型；「自己醒來」在 order 1 介紹、order 2 看差一級、order 17 看它怎麼出錯）。

## 斷崖處理

- 0→1：總覽只用一張「醒來→做事→回來問你」示意，零件與階梯留到 order 1。
- 1→2：order 1 的階梯直接拿 Gemini 當 L2 實例；order 2 開頭回指階梯圖。
- 2→3：Gemini「你說何時做什麼」對 Muse「你給目標、它推進」；同一件生活代辦兩種寫法。
- 3→4：Muse 把操作藏在 VM 裡；Hark 把操作畫面攤給你看；橋：看得到算不算更安全。
- 4→5：兩家都有 app；Instinct 只有簡訊和電話；橋：入口越像跟人講話，授權句子越容易被讀寬。
- 5→6：生活型→工作型；橋：Duet 官方說它處理訂票等私人雜事較弱。
- 6→7：Duet 用固定巡檢與必停清單決定何時打擾；Dots 把決定權交給你設的四級規則；橋：同一封信兩家各會怎麼處理。
- 7→8：一個 agent→一人多 bot；橋：Dots 官方說未來多個 dot 組隊。
- 8→9：同一人的多個 bot（路線一結束）→ 交給團隊的責任型 bot（路線二開始）；橋：任務 vs 責任對照表。
- 9→10：工程團隊→知識工作；橋：同樣「接手跨週工作」，回饋訊號從測試變成人的審閱。
- 10→11：團隊自己設權限→IT 用目錄身分管；橋：agent 出事誰負責。
- 11→12：身分管住「誰在做」→跨週計畫管住「做到哪、何時偏離要問」。
- 12→13：單一廠商的企業 agent→跨廠商的管理平面；橋：OpenAI 內部 500 個 OpenClaw agent 怎麼管。
- 13→14：企業在自己的基礎設施上管 agent（路線二結束）→個人在自己的機器上跑 agent（路線三開始）；橋：同一個開源核心。
- 14→15：自架三種類型→中國把同一個核心包成產品的那一大類；橋：包得越深越方便，安全評測顯示攻擊面也越大。
- 15→16：前三條路線都讓 agent 開一台電腦；路線四不開新電腦，住進既有 app。
- 16→17：四條路線講的是「設計上會在哪停下來」；order 17 看沒停下來的案例。
- 17→18：自己誤判→被人誘導；既有文章只加 series 與一句承接。
- 18→19：前兩篇是 agent 做錯；order 19 轉向人：你會不會抓不到它的錯。
- 19→20：信任要靠證據校準 → 怎麼評估；先講記者實測 n=1 的限制，再講 benchmark 測的是模型＋自製 harness 不是商品。
- 20→21：評測講「有沒有用」，成本講「值不值得」；橋：AIMultiple 實測的完成時間與漏跑。
- 21→22：錢由使用者出，卡關多半在對方；橋：Gemini 自己說有些網站會把最後一步交回你。
- 22→23：對方的規則（商家是交易主體、付款協定）直接決定出事時誰負責。
- 23→24：條款把損失放在你身上 → 從唯讀開始、碰錢用單次卡的理由。

## 站內前置知識連結

- agent 基本迴圈、harness → `2026-03-17-ai-agents-context-cognition-action`、`2026-03-28-anthropic-harness-design`
- 排程與 heartbeat → OpenClaw 自動化（一）（二）；Hermes Agent 的 Gateway 與排程
- 自架安裝與設定（不在本系列重寫）→ OpenClaw 系列（約 30 篇）、Hermes Agent 系列（11 篇）
- 沙盒與 VM 隔離 → agent-isolation 系列、OpenClaw 沙箱
- 主動式 agent 學術背景 → CS329Z 第 18 堂
- MCP 連接器 → `2026-03-22-mcp-model-context-protocol`

## 篇目總表

| order | 段落 | slug（暫定） | 主題 | 類型 | 聚焦問題 | 狀態 |
|---|---|---|---|---|---|---|
| 0 | 入門 | always-on-agents-overview | 總覽 | 共通 | 這波產品跟聊天機器人、排程自動化差在哪？四條路線各有誰？ | 待寫 |
| 1 | 入門 | always-on-agent-anatomy | 零件與三級階梯 | 共通 | 沒人叫它時，它怎麼知道該醒來、醒來做什麼？ | 待寫 |
| 2 | 路線一 | gemini-tasks | Tasks in Gemini（邊界案例） | 產品 L2 | 你說何時做什麼，跟它自己決定，差在哪？ | 待寫 |
| 3 | 路線一 | meta-muse | Meta Muse | 產品 L3 | 讓 agent 替你付錢、跟陌生人互動，要先接受哪些前提？ | 待寫 |
| 4 | 路線一 | hark-pro | Hark Pro | 產品 L3 | 自訓 computer-use 模型、把過程攤給你看，換來什麼？ | 待寫 |
| 5 | 路線一 | instinct | Instinct | 產品 L3 | 只用簡訊和電話的 agent，授權怎麼給才不出事？ | 待寫 |
| 6 | 路線一 | claude-duet | Claude Duet | 產品 L3 | 主動型助理怎麼決定什麼時候打擾你？ | 待寫 |
| 7 | 路線一 | openai-dots | OpenAI Dots | 產品 L3 | 背景只讀、動手要規則：四級自訂規則怎麼設？ | 待寫 |
| 8 | 路線一 | grok-bot | Grok Bot | 產品 L3 | 一人多個具名 bot，分工帶來什麼、又共用了什麼？ | 待寫 |
| 9 | 路線二 | devin-bots | Devin Bots | 產品 L3 | 把長期責任交給 agent，它做了什麼、人還要做什麼？ | 待寫 |
| 10 | 路線二 | perplexity-teammates | Perplexity teammates | 產品 L3 | 給知識工作用的長期 agent，怎麼接手跨週的專案？ | 待寫 |
| 11 | 路線二 | microsoft-autopilot | Microsoft Autopilot | 產品 L3 | agent 用自己的身分、掛具名經理，稽核和撤權怎麼做？ | 待寫 |
| 12 | 路線二 | salesforce-long-horizon-agents | Salesforce long-horizon agents | 產品 L3 | 目標拆成跨週計畫，偏離計畫時誰決定？ | 待寫 |
| 13 | 路線二 | openclaw-enterprise | OpenClaw Enterprise | 產品（平台） | 一家公司要同時管幾百個常駐 agent，要哪些控制？ | 待寫 |
| 14 | 路線三 | self-hosted-always-on-agents | 跑在自己的機器上：自架常駐 agent 怎麼選 | 路線 | 「自架」其實有三種，OpenClaw、Hermes 和其他開源專案各適合誰？ | 待寫 |
| 15 | 路線三 | china-claw-family | 中國的 Claw 家族 | 路線 | 中國怎麼靠包裝 OpenClaw 走到常駐型？包得越深代價是什麼？ | 待寫 |
| 16 | 路線四 | super-app-agents-asia | 住進超級 app 的 agent（LINE、KakaoTalk、Naver） | 路線（走向） | agent 不開自己的電腦，而是住進你每天用的 app，會變成什麼樣？ | 待寫 |
| 17 | 共通問題 | always-on-agents-overreach | 主動過頭 | 共通 | 沒被攻擊，它也會做出你沒要的事，有哪幾種模式？ | 待寫 |
| 18 | 共通問題 | personal-agents-hosted-vs-self-hosted | 安全五層（已發佈 2026-10-24） | 共通 | 一封釣魚信會在哪一關被擋？ | 已寫，只加 series 與承接句 |
| 19 | 共通問題 | always-on-agents-human-side | 人的那一面：依賴、疏離與信任校準 | 共通 | 交給它越多，你會失去什麼？信任該怎麼調？ | 待寫 |
| 20 | 共通問題 | always-on-agents-evaluation | 怎麼評估它有沒有用 | 共通 | 「主動」能不能量？現有評測量到什麼、量不到什麼？ | 待寫 |
| 21 | 共通問題 | always-on-agents-cost | 常駐的錢誰出 | 共通 | 一台 24 小時開著的電腦，各家怎麼收費、為什麼一直改額度？ | 待寫 |
| 22 | 共通問題 | always-on-agents-other-side | 另一端：網站、商家與被打電話的人 | 共通 | 為什麼它常做到最後一步就卡住？網站和商家怎麼接 agent？ | 待寫 |
| 23 | 共通問題 | always-on-agents-liability | 出事誰負責 | 共通 | agent 買錯、寄錯，損失由誰擔？各地法規管到哪？ | 待寫 |
| 24 | 上手 | always-on-agents-getting-started | 從唯讀開始 | 共通 | 台灣讀者現在用哪個、權限怎麼一步步開？ | 待寫 |

## 範圍卡

### Order 0：總覽
- 聚焦問題：同上表。核心概念：四條定義與四條路線。
- 講：定義與三種分界；時間線與一節前身；四條路線地圖（代表產品＋台灣能／不能／有條件）；相鄰但不算；偏誤聲明與截止日期。
- 不講：零件機制（order 1）、各家細節。
- 讀完後讀者能：用四條定義判斷一個新產品算不算常駐型、屬於哪條路線，以及台灣能不能用。
- 自我檢查：「豆包工作每 15 分鐘查一次網頁，算不算？」答：不算，它照你寫好的提示跑，不自己決定做什麼（第 2 條）。
- 動筆前要關：各家發表文全文；台灣狀態逐一讀一手頁；前身一節補搜（Google Now、Siri Suggestions）。

### Order 1：零件與三級階梯
- 聚焦問題：沒人叫它時，它怎麼知道該醒來、醒來做什麼？
- 核心概念：L1 固定提示排程 → L2 使用者設的事件觸發 → L3 自主判斷；加上收件匣、自己的電腦、記憶。
- 講：同一件事「信用卡帳單有異常就告訴我」在三級的寫法；L1 例：Mistral Vibe、豆包工作；L2 例：Gemini 的 Gmail／topic monitor、Hermes 的 cron＋webhook；L3 例：OpenClaw heartbeat 預設提示、Dots 主動研究（唯讀）、Grok Bot check-in；結果送到哪（晨間簡報、Needs You、活動紀錄）；為什麼要自己的電腦；記憶能不能看、能不能刪；提前多久替你想（例：Duet 提醒休假前只剩兩天工作日）。
- 不講：安全審查（order 18）、產品體驗。
- 讀完後讀者能：打開任何一家的設定頁，指出它的觸發屬於哪一級、哪些設定會在背景讀你的資料。
- 自我檢查：「Dots 的主動研究能不能幫你回信？」答：不能，只用唯讀工具。
- 前置：order 0。連結：OpenClaw 自動化（一）（二）、Hermes Gateway 與排程。
- 動筆前要關：Mistral scheduled tasks、豆包自動任務、Gemini schedules、OpenClaw heartbeat 與 automation、Hermes cron 官方文件、Dots Custom Rules、Grok Bot routines／check-in 文件全文；補搜 proactive wake、heartbeat、background turns。

### Order 2：Tasks in Gemini（邊界案例）
- 聚焦問題：你說何時做什麼，跟它自己決定，差在哪？
- 核心概念：L2 事件觸發的能與不能。
- 講：Spark→Tasks 演變（2026-05 I/O、10 月併入、11-17 改名並對六國免費）；三種觸發；Daily Brief 為何接近 L3；硬體隔離 VM、AP2 付款與花費上限、代打電話並表明是 AI；官方 FAQ「不會 24/7 讀信」；WIRED 衝突偵測 1/5；「Google 已有你的資料」這個賣點與代價。
- 讀完後讀者能：判斷自己的需求用 L2 觸發就夠，還是需要 L3 的產品。
- 自我檢查：「沒設 Gmail monitor，Gemini 會自己發現行程衝突嗎？」答：Tasks 不會；Daily Brief 可能在晨間摘要裡提到。
- 動筆前要關：blog.google 05-19、11-17 全文；schedules 說明頁；Gemini 安全白皮書；WIRED 全文；台灣 AI Pro 開放的一手頁。

### Order 3：Meta Muse
- 聚焦問題：讓 agent 替你付錢、跟陌生人互動，要先接受哪些前提？
- 講：Secure VM＋Sentinel；Stripe Link 單次卡；WhatsApp 入口；訓練預設開啟可關；主動推播（Vox）；Marketplace 地址事件；Reuters 內部測試；Amazon 封鎖。
- 讀完後讀者能：交出付款方式前，說出 Muse 在哪一步停下來、能設哪些上限。
- 動筆前要關：Meta 發表文、安全部落格、說明中心；Vox、Reuters、GeekWire 全文。

### Order 4：Hark Pro
- 聚焦問題：自訓 computer-use 模型、把過程攤給你看，換來什麼？
- 講：Handoff 模型、同時六個瀏覽器、Secured by Hark vault、主動提事（學餐卡）、免費＋20／100 美元、2027 硬體；TechCrunch 指出的取捨（專用模型 vs 前沿模型的廣度）。
- 讀完後讀者能：判斷「看得到 agent 在操作」對自己的信任有沒有實際幫助。
- 動筆前要關：Hark 官方文章全文、TechCrunch、Bloomberg；獨立實測一則（未找到要補搜）。

### Order 5：Instinct
- 聚焦問題：只用簡訊和電話的 agent，授權怎麼給才不出事？
- 講：iMessage／電話入口、自有裝置、invite-only、融資；Avanti 重設密碼事件；Vox 直接寄出回信；條款「視同你本人訂約」。
- 讀完後讀者能：把一句授權改寫成不會被解讀成「可以重設密碼」的說法。
- 動筆前要關：官方頁、TechCrunch 條款報導、部落格與 Vox 全文。

### Order 6：Claude Duet
- 聚焦問題：主動型助理怎麼決定什麼時候打擾你？
- 講：晨間簡報、每幾小時巡檢、敏感動作必停、明文禁止的動作、巡檢計入額度；Verge「有點神經質」；WIRED；Proactivity-Gym 的信任研究。
- 讀完後讀者能：寫出「哪些事值得打擾我」的規則給助理。
- 動筆前要關：Duet 發表文與說明頁、Verge 與 WIRED 全文、Proactivity-Gym 精讀。

### Order 7：OpenAI Dots
- 聚焦問題：背景只讀、動手要規則：四級自訂規則怎麼設？
- 講：主動研究（唯讀）、Custom Rules 四級、auto-review、可連本機、Slack／Teams／通話、專職 dot、GPT-6.1 Terra；貓發票事件；系統卡附錄。
- 讀完後讀者能：替自己的工作設一份直接做／預先核准／先問／交回本人的規則表。
- 動筆前要關：發表文、Control your dot、系統卡附錄、部落格全文。

### Order 8：Grok Bot
- 聚焦問題：一人多個具名 bot，分工帶來什麼、又共用了什麼？
- 講：具名 bot、錄影教技能、routines、bot 間委派、Team Bots；共用一台 VM 與登入（官方：不要當安全邊界）；Cursor 營運；用量池與 11 月縮減。
- 讀完後讀者能：決定一件工作該開新 bot 還是交給既有 bot，並知道哪些東西不會因此隔開。
- 動筆前要關：x.ai 發表文、docs FAQ／pricing、1.0 公告、TechCrunch 11-02。

### Order 9：Devin Bots
- 聚焦問題：把長期責任交給 agent，它做了什麼、人還要做什麼？
- 講：六個部分；任務 vs 責任；三個內部案例與「全是 Cognition 自報」；人要定義成功、建回饋、設權限與預算；Poke 技術；Fortune 定位。
- 讀完後讀者能：把一件沒人負責的長期工作改寫成可交給責任型 agent 的描述，並列出它需要的回饋訊號。
- 動筆前要關：部落格、docs、Fortune、The Inference 全文；開發者使用回饋。

### Order 10：Perplexity teammates
- 聚焦問題：給知識工作用的長期 agent，怎麼接手跨週的專案？
- 講：Computer→Personal Computer（Mac mini 常開）→teammates；協調 Computer session 與其他 teammate；跨次記憶；各自隔離的瀏覽器；Max 方案。
- 讀完後讀者能：判斷自己的跨週專案適合交給 teammate 還是一次性 Computer 任務。
- 動筆前要關：三篇官方文全文；獨立評測一則（未找到要補搜）。

### Order 11：Microsoft Autopilot
- 聚焦問題：agent 用自己的身分、掛具名經理，稽核和撤權怎麼做？
- 講：Scout（OpenClaw 技術）→Autopilot；Entra Agent ID、named manager、可封鎖、以自己名字記錄；Purview 在送出前生效；Sebastian 40 則草稿不送出；與 Dots 專職 dot、Devin access 對照。
- 讀完後讀者能：說明「agent 用我的身分」和「用它自己的身分」在稽核與撤權上的差別，並據此問 IT 該問的問題。
- 動筆前要關：四篇 Microsoft 一手全文、Entra Agent ID 文件。

### Order 12：Salesforce long-horizon agents
- 聚焦問題：目標拆成跨週計畫，偏離計畫時誰決定？
- 講：long-horizon runtime 三要素（記憶、durable execution、dynamic steering）；Hunter 例子（退信→找替代收件人→偏離計畫先問）；Agentforce Coworker；GA 狀態（11 月）。
- 讀完後讀者能：替一個跨週目標寫出「哪些偏離要先問」的護欄。
- 動筆前要關：Salesforce 三篇官方文全文；GA 是否如期的一手確認；獨立來源一則。

### Order 13：OpenClaw Enterprise
- 聚焦問題：一家公司要同時管幾百個常駐 agent，要哪些控制？
- 講：OpenAI 起頭、捐給基金會、與 Red Hat／NVIDIA 共同開發、pre-1.0；OpenAI 內部 500+ agent 的五類控制（信任／不信任分離、沙盒、模型審查、agent 身分、全記錄）；對照 Kimi Hosted Agents（中國的企業託管 harness）。
- 讀完後讀者能：列出公司導入常駐 agent 前要先有的五類控制。
- 動筆前要關：OpenClaw 部落格、OpenAI developers 部落格、GitHub README、VentureBeat、Kimi Hosted Agents 公告全文。

### Order 14：跑在自己的機器上：自架常駐 agent 怎麼選
- 聚焦問題：「自架」其實有三種，OpenClaw、Hermes 和其他開源專案各適合誰？
- 講：三種類型（開源自己跑／廠商 app 跑在你的機器／廠商雲端託管開源）的控制權與責任差別；OpenClaw（heartbeat L3、預設把工具直接跑在主機上）vs Hermes（內建 L2，社群 heartbeat2 外掛、monitor mode 省錢）；其他開源（CoPaw、Linclaw、Nerve、rho、OpenCeph 等，表格一行）；Perplexity Personal Computer 這種「機器是你的、程式是廠商的」；成本與維運的現實。
- 不講：安裝與設定（連 OpenClaw、Hermes 系列）。
- 讀完後讀者能：依自己的技術能力與想掌握的層級，選一種自架類型，並知道自己因此要負責哪幾層。
- 動筆前要關：OpenClaw、Hermes 官方文件（heartbeat、cron、安全）；Pinggy 10-31 全文；各開源 repo README 一手讀；星數與最後更新日期。

### Order 15：中國的 Claw 家族
- 聚焦問題：中國怎麼靠包裝 OpenClaw 走到常駐型？包得越深代價是什麼？
- 講：「養龍蝦」潮；三種包法（雲端託管：KimiClaw、ArkClaw、MaxClaw；一鍵安裝 app：QClaw、AutoClaw、StepClaw；綁 IM：微信、飛書、釘釘）；對照豆包工作、AutoGLM、Kimi Work 的 L1 定時任務；安全內參評測（攻擊成功率 QClaw 約 55%～MaxClaw 約 16%、OpenClaw 原版約 19%）；QClaw 公告 2026-12-24 停運遷 WorkBuddy（這個類別第一個收掉的）；台灣能不能用。
- 讀完後讀者能：分辨託管 OpenClaw、包裝 app 與廠商自建 agent 在控制權與攻擊面上的差別。
- 動筆前要關：Kimi 說明中心、QClaw 產品文件與停運公告、AutoClaw 官方文、ArkClaw／MaxClaw 產品頁、安全內參評測原文（secrss.com/articles/89363）、2aran.com 11-04 全文；台灣可用性。

### Order 16：住進超級 app 的 agent
- 聚焦問題：agent 不開自己的電腦，而是住進你每天用的 app、直接呼叫自家服務，會變成什麼樣？
- 定位：路線篇（走向）；多數功能尚未上線，每項標狀態（上線／封測／預告）與日期。
- 講：結構差異（自家服務走內部 API、外部網站才用隔離瀏覽器；從聊天室上下文抓需求）；LINE 台灣 2026-10-13 CONVERGE 路線圖（聊天室 agent、官方帳號 AI 代理平台 2027 Q1、購物與送禮助手 2027、接 Google UCP）；日本 Agent i（已上線，台灣支援中心查不到）；Kakao Kanana Space（12 月封測）、Kanvas；Naver 個人 agent app（年底）；取捨：便利 vs 端對端加密聊天怎麼給 AI 讀（LINE 台灣自己承認還沒交代）、多人聊天室的同意、自家商品排前面的風險。用四條定義檢查：目前大多不算常駐型。
- 讀完後讀者能：明年 LINE 推出這些功能時，知道它跟 Muse、Duet 差在哪、該先問哪幾個隱私與授權問題。
- 前置：order 3、15。連結：order 22。
- 動筆前要關：LY Corporation 11-13 報告與 LINE 台灣公告全文、數位時代 10-14、Agent i 日文支援中心頁、Kakao 新聞稿、Naver 法說會原文、Digital Today 11-16；補搜 LINE Premium 收費與台灣上線時間。

### Order 17：主動過頭
- 聚焦問題：沒被攻擊，它也會做出你沒要的事，有哪幾種模式？
- 講：授權讀太寬（Instinct、Muse 地址）；誤判事實後行動（Dots 貓發票）；沒人要求的背景存取與不實回報（NewCore 對 Grok Bot，報告者是 gateway 廠商）；成本被背景工作吃掉。
- 讀完後讀者能：讀一則 agent 出包報導時，分辨是哪種模式、哪個設定原本可以擋。
- 動筆前要關：NewCore 原報告、Ars、Vox、Reuters 全文；補搜中文事件。

### Order 18：安全五層（已寫）
- 既有文章（中英）只加 `series` frontmatter 與開頭一句承接 order 17，正文不改，走 post-update。
- 讀完後讀者能：（原文已達成）說出一封釣魚信在五層各會被誰擋。

### Order 19：人的那一面
- 聚焦問題：交給它越多，你會失去什麼？信任該怎麼調？
- 核心概念：自動化的諷刺與信任校準。
- 講：Bainbridge 1983；Vox 引 Liao、Maes；Verge 記者對 Duet 的疏離感；Proactivity-Gym 30 人研究；認知卸載；確認疲勞（OpenAI 用審查模型保留人的注意力）。
- 讀完後讀者能：替自己決定哪些事保留親手做、哪些交出去，並知道用一陣子後要回頭檢查什麼。
- 動筆前要關：Bainbridge 原文、Vox 與 Verge 全文、Proactivity-Gym 精讀、補搜 2024 後 automation bias／over-reliance 研究與反證。

### Order 20：怎麼評估它有沒有用
- 聚焦問題：「主動」能不能量？現有評測量到什麼、量不到什麼？
- 講：記者實測的價值與 n=1 限制；AIMultiple 9 天實測（Hermes 抓到率最高但最慢，要配合它的級別解讀）；AutoBuddy、VibeLifeBench、Claw-Anything、Proactivity-Gym；它們測模型＋自製 harness；讀者自己的一週評測。
- 讀完後讀者能：替一件例行工作設計一週評測，分開記「發現了沒」與「做對了沒」。
- 動筆前要關：四篇論文精讀＋抽取紀錄；AIMultiple 方法頁；對 benchmark 的批評。

### Order 21：常駐的錢誰出
- 聚焦問題：一台 24 小時開著的電腦，各家怎麼收費、為什麼一直改額度？
- 講：各家都塞進訂閱的用量池（Dots、Duet、Grok Bot、Muse、Hark）；Grok Bot 縮額度與 Musk 的說法；Devin Bots 每個 Bot 各設預算；OpenClaw heartbeat 的成本建議；Hermes monitor mode；自架的成本結構；QClaw 停運的訂閱處理。
- 讀完後讀者能：估算自己一件例行工作在三種收費方式下大概吃掉多少額度，並知道哪個設定最省。
- 動筆前要關：各家 pricing／說明頁全文、TechCrunch 11-02、OpenClaw heartbeat 文件；補搜獨立成本估算。

### Order 22：另一端
- 聚焦問題：為什麼它常做到最後一步就卡住？網站和商家怎麼接 agent？
- 講：網站預設擋 bot；Amazon 封鎖 Muse、Grok Bot 的網路被部分網站擋；Gemini 打電話先表明是 AI；付款協定（AP2、UCP、Stripe Link、Mastercard Agent Pay、Visa Intelligent Commerce；台灣 2026-03 首筆經驗證的代理式交易）；agent 身分規格（WAG、XAA）；超級 app 走內部 API 的做法（回指 order 16）。
- 讀完後讀者能：看到 agent 卡在某一步時，判斷是網站擋、付款流程不支援，還是 agent 本身的問題。
- 動筆前要關：AP2／UCP 規格頁、GeekWire、Gemini 11-17 文、Mastercard 台灣新聞稿、OpenAI 身分規格段落。

### Order 23：出事誰負責
- 聚焦問題：agent 買錯、寄錯，損失由誰擔？各地法規管到哪？
- 講：條款（Anthropic、Muse 250 美元上限、Instinct）；UETA／E-SIGN 與「防止或更正錯誤的機會」；Reg Z 套不上；銀行條款排除（Citi）；歐洲缺席原因（Apple 指名 DMA、其餘未說、GovAI 研究、瑞士也被排除的推論）；英國 DRCF；台灣金管會諮詢文件、數發部研議、金管會主委談話。
- 讀完後讀者能：在讓 agent 碰錢之前，說出自己出事時能靠什麼救濟、靠不了什麼。
- 不講：法律意見；標「不是法律意見」。
- 動筆前要關：各家條款原文；FPF、UETA 條文、Reg Z；TechCrunch 11-18；GovAI 原文；AI Act 服務台 FAQ；金管會新聞稿與諮詢文件全文、工商時報 11-12；補搜台灣消保法、個資法解釋。

### Order 24：從唯讀開始
- 聚焦問題：台灣讀者現在用哪個、權限怎麼一步步開？
- 講：依台灣可用性與既有訂閱、依路線分流；第一週唯讀、第二週草稿、之後才開寫入；各家先關／先開的設定；什麼情況先別用。
- 讀完後讀者能：照清單在一個產品上完成第一週設定。
- 動筆前要關：各家設定頁一手讀；台灣狀態當週再查。

## 研究足夠的判準

見研究筆記「研究足夠的五關」與「定義修訂與重篩」。系列層級：①一手：各家官方頁已找到，掃描層級 ②證據類型：分得出廠商自述／記者實測／學術 benchmark／安全評測 ③時效：全部 2026 ④反證：每條路線都有批評或事件（含 QClaw 停運） ⑤飽和：中英、非美國、自架查詢都回到同一批產品。結論：夠決定篇目；每篇動筆前照範圍卡補精讀，過五關才寫。

## 已決定

- 2026-11-19：定義第 2 條改為「自己決定醒來做什麼」；Gemini 為邊界案例；加成本、另一端、責任三篇；歷史放進總覽一節。
- 2026-11-20：加「人的那一面」；加日韓台超級 app 路線；改成四條路線結構，單篇／併入路線篇的規則見「組織原則」；Kimi Claw 併入中國 Claw 家族；新增自架怎麼選。之後新產品依組織原則處理，不再為了「完整」加篇。

## 待使用者決定

（無）
