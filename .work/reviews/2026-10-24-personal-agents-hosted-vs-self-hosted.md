# Review: 2026-10-24-personal-agents-hosted-vs-self-hosted

## post-verify

範圍：中文版正文約 60 條宣告（價格、日期、版本、數字、授權、第三方事實、命令）。依據是對話中全文讀過的一手頁；高風險項另做第二來源核對（2026-10-24）。

### Contradicted / Outdated
無。

### Misframed（數字對，用法需補一句）
1. OpenClaw CVE-2026-25253「2026.1.29 版修復」：SonicWall 與 runZero 說 2026.1.29 是初步修補，之後才加嚴格來源驗證。→ 已改為「2026.1.29 版起修補，之後又加了來源驗證」。
2. Dots 系統卡的 16,600 封與 45/49 都是 OpenAI 自己用內部 GPT-Red 做的測試，計分規則未公開。→ 已補「OpenAI 自己做的測試」，Duet 的 17% 也標 Anthropic 自己的測試。
3. Meta「不把對話交給廣告系統」省略了同篇的「瀏覽行為可能間接影響廣告」。→ 已補。

### Unverifiable
4. Dots 方案價格（Pro 每月 100 美元起、Business Premium 20 美元）只有 CBS 一個來源；chatgpt.com/pricing 抓不到方案價格，OpenAI 公告頁沒寫。→ 已改為標明「CBS 報導」，未找到第二來源。
5. Muse「目前以美國為主」：Meta 新聞稿寫 US，FullStack 二手文章寫美國與加拿大；低風險，單一一手來源。

### Confirmed
- Duet：10/21 研究預覽、美國 Pro/Max 候補、平台、Opus 5.5、VM、每隔幾小時檢查、核准範圍、含在訂閱（公告＋support 頁）；17% 漏放（auto mode 工程文）。
- Muse：隔離 VM、Sentinel、替身 token、軌跡預設訓練可關閉、Confidential VM 今年稍後、bug bounty 最高 30 萬美元、免費層（新聞稿＋研究部落格）；三則事件（Ars、GeekWire、404 Media）。
- Dots：9/29、GPT-6 Astra、第一個 Dot 含在方案、人工審閱例外、不能檢視個別記憶、改密碼與轉帳交還、Enterprise 預設關閉本機存取與自訂規則；系統卡 16,600、45/49、任務加倍則越界比例約加倍。
- Grok Bot：8/11 beta（x.ai 公告日期）、Bot 共用一台電腦（公告與 docs）、Cursor 營運、不支援地端、無模型選擇器、Enterprise 才有網路白名單／稽核／強制 Auto-review、Teams 預設全開、ISO 27001/42001、方案 30/100/200 美元（x.ai/bot）。
- OpenClaw：MIT、基金會、Gateway 在自己機器、沙盒與執行核准預設關、陌生寄件人預設配對、僅每日版本檢查、強化設定指令；CVE 的 CVSS 8.8 與受影響版本（runZero＋SonicWall）。
- Hermes：MIT、六種終端後端、$5 VPS、內建排程、文件列有指令核准／DM 配對／容器隔離（README）。

其他：歸因標籤全篇 2 處（Amazon 的說法、CBS 報導），未超過 3；文中沒有跨產品分數排名。x.ai 公告內部自稱 SpaceXSI，The Decoder 稱 SpaceXAI，文中維持 xAI。

範圍聲明：本次只檢查了文中已提出的宣告，未評估文章對主題的覆蓋是否完整。

### post-verify 套用狀態（2026-10-24）
1–3 已改（CVE 修補說法、OpenAI 自己做的測試、Meta 瀏覽行為影響廣告）；4（Dots 價格）改為「CBS 報導」並標明來源，未找到第二來源。xAI 已加入「文件都明寫」那句。

## post-review

機械檢查：check:tw 0、process-leak 0、中英外部連結一致；`pnpm verify`／`astro check`／`check:references`／lint 因 node_modules 無法安裝（gatelane 403）未跑，交給 CI。
- 🔴 8.5 行內來源連結：公開／限制兩節與各軸的外部事實缺原句連結 → 已補（Ars、GeekWire、404 Media、runZero、SonicWall、Meta 安全文章、Dots FAQ 與系統卡、Grok 文件、Duet 公告與說明頁、auto mode 工程文）。
- 🟡 台灣讀者位置：全文缺地區可用性交代 → 已在對照表後補一段（Duet 美國候補、Muse 以美國為主、Dots 合格市場；OpenClaw／Hermes 無候補或地區名單）。Grok Bot 的地區未查，沒有寫。
- 🟢 結構（deep-dive）、tags（6 個，皆既有）、tldr≠description、標題格式、主題歸屬（OpenClaw／Hermes 只做分界並連到導讀）皆通過；段落占比：評測類（公開＋限制）約兩成。
- 🟢 圖表：未畫圖，表格已足夠；若要補，建議比較矩陣「誰握有哪一層」。

## post-polish
register-scan：長句 0、但書 7%、引述 0、模板化轉折 0、姓名當主詞 0（公司名），ledger 無命中。無須潤稿。數字密度 1 處為 CVE／版本號，屬識別字。
