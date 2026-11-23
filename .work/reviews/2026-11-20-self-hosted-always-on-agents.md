# 審稿紀錄：自架常駐 agent 怎麼選（order 14，中英）

## post-verify
讀取（Exa 全文；Firecrawl 額度用完；部分用 curl／gh api）：Pinggy 10-31 全文、OpenClaw Sandboxing 文件、Hermes Security 文件、Hermes cli-config.yaml.example（terminal.backend 預設 local）、heartbeat2 README、Nerve README 與 docs/plans.md、QwenPaw README_zh、IT之家 02-28、阿里雲開發者社區 CoPaw 解析；星數與授權用 gh api（11-23）。
- Pinggy 實測：gateway 沒開不觸發、時區先設、toolsAllow ["*"]、免費通道 60 分鐘、webhook 202／401、543 CVE（引 OpenClawCVEs，文中標為 Pinggy 引述）、結論句 ✅
- OpenClaw：沙盒預設關、Gateway 永遠在主機、非完美邊界 ✅（文件）；Proactive check 30 分鐘、主對話、閒置、NO_REPLY ✅（站上 11-20 依官方文件改寫的自動化篇）
- Hermes：60 秒 tick、白話排程、失敗必送、monitor mode、[SILENT] ✅（Pinggy）；smart 模式、cron_mode／unattended_mode deny、hardline blocklist ✅（Security 文件）；沙盒後端跳過審批 ✅（站上 Hermes 系列）
- heartbeat2：roles、own time、普通程式檢查、預算 agent 只能調低、25 星 ✅
- QwenPaw：通義 AgentScope、02-28 以 CoPaw 開源、04-12 改名、心跳與定時任務、本機模型、資料不出機器、Apache-2.0 ✅；Nerve：Claude Agent SDK、4 小時 task-planner、「Plans are never executed automatically」✅
- 刪除：範圍卡列的 Linclaw（qbox/linclaw 8 星、3 月後無更新）、rho／OpenCeph 等小專案未逐一讀 README，正文只寫「很多個位數星數的小專案」不點名。
- 連帶：OpenClaw Enterprise 篇結尾連到本篇。

## post-review
- 選型篇：三種類型表→Pinggy 實測場景→責任分層表→OpenClaw→Hermes（含 heartbeat2）→比較表→其他開源→成本與維運→兩題選型法＋責任表→適合誰→台灣一句→14→15 橋 ✅
- 「讀完能依技術能力與想掌握的層級選一種，並知道要負責哪幾層」由兩題選型法與責任欄回答 ✅
- 安裝與設定不講，連回站上 OpenClaw／Hermes 系列 ✅

## post-polish
- check:tw 0；長句 0；check-post-quality OK；process-leak 0；無 emoji
- 本篇沒有圖：三種類型與責任用表格。
