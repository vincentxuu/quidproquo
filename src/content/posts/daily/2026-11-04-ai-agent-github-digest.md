---
title: "AI Agent GitHub Digest — 2026-11-04"
date: 2026-11-04
category: daily
tags: [ai-agent, github, open-source, daily, security, mcp, computer-use, coding-agent]
lang: zh-TW
description: "DeepSeek 開源一個會自己接 GitHub issue 來做的 coding agent、NVIDIA 的 skill 掃毒工具正好接上今天的 MCPhantom 資安新聞、Mika 讓手機背景畫面幫你操作 App——今天四個 repo 一半在擴張 agent 的自主權,一半在幫自主權收拾善後"
tldr: "deepseek-ai/dsh-superagent-prototype(⭐16k)是 DeepSeek 開源的研究原型,聽 GitHub／Feishu 訊息,自己開工作項目、在獨立 session 裡做完、回原對話回報(通常是一個 PR);NVIDIA/SkillSpector(⭐24k)在裝 agent skill 前先掃有沒有 prompt injection、資料外流等 71 種漏洞模式,時間點正好接上同日曝光的 MCPhantom 資安報告;mksglu/context-mode(⭐33k)用 sandbox + SQLite FTS5 把工具呼叫塞進 context window 的原始資料壓縮 98%;wangzan101/Mika(⭐6k)讓手機背景畫面幫你操作任何 App 和網頁,登入、驗證碼、付款一律交還給你。框架端:Haystack v2.31.1 補了兩個透過 httpx/openai 間接依賴傳進來的 CVE;Pydantic AI v2.65.0 加了 ConversationStore 和一批 model fallback／錯誤分類的相容性調整。"
series:
  name: "AI Agent GitHub Digest"
  order: 81
---

> 🌏 [English version](/posts/daily/2026-11-04-ai-agent-github-digest-en)


## 今日亮點

今天四個 repo 剛好分兩組對著做:deepseek-ai/dsh-superagent-prototype 和 wangzan101/Mika 都在把 agent 的自主範圍往外推一步——一個接管整個 repo 的工作項目自己開 PR,一個接管手機背景畫面自己操作 App;NVIDIA/SkillSpector 和 mksglu/context-mode 則負責收拾自主性留下的爛帳——一個在裝 skill 前先掃有沒有惡意程式碼,一個在 session 跑太久前先把工具輸出壓下去,不然 context window 會被佔滿到忘記自己在做什麼。

## Trending Repos

### deepseek-ai/dsh-superagent-prototype ⭐ 16k

[GitHub](https://github.com/deepseek-ai/dsh-superagent-prototype)　·　TypeScript　·　MIT

- **是什麼**：DeepSeek 官方開源的研究原型,一個「盯著單一 GitHub repo 的主動式 coding agent」,打包成跑在 DeepSeek Harness 上的 bundle。它監聽 GitHub(也能接 Feishu),有人在允許範圍內請它做事時,它開一個工作項目,在自己的 agent session 和獨立工作目錄裡做完,再回到原本的對話回報結果,通常是一個 PR。
- **為什麼值得看**：這不是又一個「幫你寫程式」的框架,重點在它明確寫下的操作哲學——盡量少佔用人的注意力,盡量多產出價值。所以它只在被要求、或團隊自己寫的規則允許時才動手,只在有人需要處理或能用到結果時才說話,`docs/000-philosophy.md` 把這個原則和對操作者的要求都寫清楚。DeepSeek 自己也在 README 開頭聲明這是研究原型、不是正式產品,程式碼有不少是 coding agent 自己寫的,風格不保證一致,官方文章裡討論的一些設計這版也還沒實作。四天內衝上 16k star,顯示即使掛著「不保證」的警語,市場對「能自己接工作項目的 agent」還是很有興趣。
- **tech stack**：TypeScript,GitHub／Feishu 事件監聽,每個工作項目獨立的 agent session 與工作目錄,搭配一個顯示待人處理事項的 web panel
- **上手難度**：中——設定步驟多,官方作法是直接請你自己的 coding agent 讀 `SETUP.md` 帶你裝,一次問一個問題、先秀完整計畫再動手;但畢竟是標明「研究原型」的程式碼,建議先在測試用 repo 上跑

---

### NVIDIA/SkillSpector ⭐ 24k

[GitHub](https://github.com/NVIDIA/SkillSpector)　·　Python　·　Apache-2.0

- **是什麼**：裝 agent skill(Claude Code、Codex CLI、Gemini CLI 等用的那種)之前先掃一遍的資安工具,涵蓋 prompt injection、資料外流、權限提升、supply chain 等 17 大類、71 種漏洞模式,輸出 0–100 的風險分數和建議。
- **為什麼值得看**：README 裡自己公開的數字很驚人——在他們分析的 31,132 個 skill 樣本裡,26.1% 含有漏洞,5.2% 顯示疑似惡意意圖。巧的是,就在同一天,資安業者 Glow Labs 發布了「MCPhantom」報告:AI coding agent 常常憑訓練資料裡的舊印象,裝進早就封存、永遠不會再修的 MCP server,其中一個 Puppeteer server 甚至有遠端程式碼執行漏洞,被下載超過 1,730 萬次。SkillSpector 解決的是「裝之前先掃」這一半的問題,背後是 NVIDIA 自己的 Verified Skills 流程——掃過、評過、簽過名才能上架到 NVIDIA skills catalog。採兩階段分析:先跑靜態分析,要更準再選配 LLM 語意判讀,外加即時查 OSV.dev 的 CVE 資料庫。
- **tech stack**：Python 3.12+,AST 靜態分析 + YARA 規則 + taint tracking,OSV.dev 即時 CVE 查詢(有離線 fallback),輸出 Terminal／JSON／Markdown／SARIF
- **上手難度**：低——`uv tool install` 一行裝完,CLI 掃描不需要任何 API key;要開 LLM 語意分析那層才需要另外設定 provider key

---

### mksglu/context-mode ⭐ 33k

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　ELv2

- **是什麼**：一個裝在 coding agent 和它呼叫的工具之間的 MCP server,把工具回傳的原始資料(截圖快照、log、CSV)攔下來,只把真正有用的部分放進 context window。
- **為什麼值得看**：作者在部落格文章裡給的實測數字很具體——一次 Playwright 快照從 56 KB 降到 299 B,20 筆 GitHub issue 從 59 KB 降到 1.1 KB,整個 session 累積下來 315 KB 變 5.4 KB,降幅 98%。機制是把工具呼叫丟進隔離的子程序,只有 stdout 進 context,資料另外存進 SQLite,靠 FTS5 全文索引加 BM25 排序,等真正需要時再用語意查詢撈回來,而不是整包塞回對話。session 被 compact 掉時也不會把這些資料硬塞回 context,而是記住「做到哪了」讓模型接著做。要注意它掛的是 Elastic License 2.0(ELv2),原始碼公開但不是 OSI 認定的開源授權,商業使用前建議先讀授權條款。
- **tech stack**：TypeScript,隔離子程序執行工具呼叫,SQLite FTS5(BM25 排序)做語意檢索,透過 MCP + hooks 接 17 種 agent 平台(Claude Code、Codex、Pi、OpenCode、Gemini CLI 等)
- **上手難度**：低——`npm install -g context-mode` 裝完,照文件把它註冊成對應 harness 的 MCP server、補一段 hooks 設定即可

---

### wangzan101/Mika ⭐ 6k

[GitHub](https://github.com/wangzan101/Mika)　·　Kotlin　·　Apache-2.0

- **是什麼**：裝在手機上的 AI 助理,說一句話,它就在一個隱藏的背景畫面上幫你開 App、點、打字、滑,一直到做完,手機前台你照樣正常用。
- **為什麼值得看**：跟多數「電腦操控 agent」先解決桌面場景不同,Mika 直接瞄準手機——不靠各家 App 的開放 API,而是像人一樣看畫面找按鈕,所以理論上什麼 App 都能操作。內建瀏覽器也能在你正在看的網頁上直接下指令。設計上刻意保留人的把關:登入、驗證碼、付款永遠交還給使用者處理,不代勞。沒有官方雲端伺服器,接自己的模型 API key 或用 ChatGPT／xAI／OpenRouter 帳號登入即可,資料留在手機上。四天內到 6k star,反映「手機版電腦操控 agent」這塊目前還相對空白。
- **tech stack**：Kotlin 寫的 Android App,在背景畫面上用類無障礙服務的方式讀畫面、模擬操作,模型層接 BYOK API key 或第三方帳號登入,本機優先、無廠商伺服器
- **上手難度**：中——下載 APK 即可聊天／瀏覽網頁,但要讓它操作手機 App,需要照設定精靈走一次無線偵錯(wireless debugging)配對

## Notable Releases

### Haystack v2.31.1

[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v2.31.1)

- **重要變更**：把兩個透過 `httpx`／`openai`／`posthog` 間接帶進來的依賴版本下限拉高——`anyio` 升到 4.14.2 以上(修 CVE-2026-63374),`certifi` 升到 2026.10.19 以上(移除已被攻破私鑰的 eMudhra/emSign 憑證機構)。
- **Breaking Changes**：無,純粹是依賴版本下限調整,不影響既有 API
- **對你的影響**：這兩個套件都是透過別的依賴間接裝進來的,平常不會出現在你自己的 `requirements.txt` 裡,容易被忽略。升級到 v2.31.1 或自行確認 `anyio`／`certifi` 版本是否達標,如果你有另外 pin `certifi` 版本,記得一起拉高。

---

### Pydantic AI v2.65.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0)

- **重要變更**：新增 `ConversationStore`(把對話存成只寫一次的訊息紀錄,`Conversation.revision` 可以抓到互相衝突的儲存);`ModelFallback` 現在在模型拒絕回答時也會往下一個模型 failover,`fallback_on` 的 `ContentFilterError` 可以比對到這種拒絕;從 V2 移除的名稱(像 `OpenAIModel`、`MCPServerStdio`)被 import 時,錯誤訊息會直接告訴你該换成什麼。
- **Breaking Changes**：無重大 API 破壞性變更,主要是一批相容性調整:Z.ai 的額度/方案限制 429 現在拋 `ModelQuotaExceededError` 而不是 `ModelRateLimitError`;Temporal 預設不再重試「重試也不會成功」的模型錯誤(可用 `non_retryable_model_errors` 調整)。
- **對你的影響**：如果你靜態比對過 exception 類型來判斷是不是該重試,留意上面兩個錨點型別的改動;用 `ModelFallback` 的人現在多一層保護,模型拒答也能自動換下一個模型試試看。

## 今日收穫

之前以為「agent 自主性」和「agent 安全」是兩條各自往前推進的技術線,但今天 SkillSpector 跟同一天曝光的 MCPhantom 報告放在一起看才發現,兩者幾乎是同一批人在同一個時間點被迫面對同一個問題——agent 現在真的會自己去裝它覺得「聽起來對」的套件,不管那個套件是不是早就封存、沒人在修。推力和拉力得同時長出來,不然自主性跑得越快,留的坑越大。

## 參考資料

- [deepseek-ai/dsh-superagent-prototype — GitHub repo](https://github.com/deepseek-ai/dsh-superagent-prototype)
- [NVIDIA/SkillSpector — GitHub repo](https://github.com/NVIDIA/SkillSpector)
- [AI coding agents are installing MCP servers that will never be patched（MCPhantom 報告）— Help Net Security](https://www.helpnetsecurity.com/2026/11/03/mcphantom-deprecated-mcp-servers/)
- [mksglu/context-mode — GitHub repo](https://github.com/mksglu/context-mode)
- [Stop Burning Your Context Window — We Built Context Mode（作者實測數字）](https://mksg.lu/blog/context-mode)
- [wangzan101/Mika — GitHub repo](https://github.com/wangzan101/Mika)
- [Haystack v2.31.1 release notes](https://github.com/deepset-ai/haystack/releases/tag/v2.31.1)
- [Pydantic AI v2.65.0 release notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0)
