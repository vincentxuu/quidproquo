---
title: "自架常駐個人 agent 橫向對照：九個專案，同一個安全問題的九種答案"
date: 2026-08-18
category: ai
type: deep-dive
tags: [openclaw, hermes-agent, ai-agent, security, sandbox, open-source]
lang: zh-TW
tldr: "OpenClaw 386k star、Hermes Agent 232k，但 OpenRouter 上 Hermes 的日 token 量在 2026-05-10 就反超了（224B vs 186B）。這半年冒出來的九個自架 agent 不是九個競品，是對同一題的九種答案：agent 的執行邊界該畫在哪。CVE-2026-44112 打穿的是 OpenClaw 的沙箱本身，而 Meta 對齊主管那次刪信事故裡連攻擊者都沒有——安全指令是被 context 壓縮吃掉的。"
description: "橫向對照 OpenClaw、Hermes Agent、NanoClaw、PicoClaw、ZeroClaw、IronClaw、Moltis、Moltworker、LibreFang 九個自架常駐個人 agent，從隔離模型、可信基底大小、記憶與學習三個軸解釋這個類別為什麼分裂，以及各自適合什麼情境。"
draft: false
---

OpenClaw 的 README 有一句話，是理解過去半年整個 agent 生態的鑰匙：

> Tools run on the host for the main session unless you configure sandboxing.

主 session 的工具跑在你的主機上，除非你自己去設沙箱。這不是疏忽，是一個明確的設計選擇——要讓 agent 真的能幫你做事，它就得能碰到你的檔案、你的憑證、你的 shell。而同一個 agent 又要讀 Telegram 群組裡陌生人貼的連結。

這篇橫向對照九個專案：**OpenClaw、Hermes Agent、ZeroClaw、NanoClaw、PicoClaw、IronClaw、Moltworker、Moltis、LibreFang**。看完你會發現它們不是九個競品，而是對同一題的九種答案：**agent 的執行邊界該畫在哪裡**。而這些答案互不相容——這就是為什麼這個類別不會收斂成一個贏家。

## 這個類別長什麼樣

共同形狀是固定的五件事：一個常駐 daemon（不是 session 型的 CLI）、一個 gateway 把聊天頻道接進來、一組工具（shell / browser / HTTP / MCP）、跨 session 的持久記憶、以及 cron 排程。你用 Telegram 傳一句話，它半夜幫你把事做完。

問題也是固定的。這個形狀天然同時滿足三個條件：**吃不可信輸入**（群組訊息、網頁、郵件）、**有敏感資料存取**（你的檔案與憑證）、**能對外通訊**（它得回訊息給你）。Simon Willison 在 2025-06 把這組合命名為 lethal trifecta，並指出關鍵在於三者缺一就安全：

> The only way to stay safe there is to avoid that lethal trifecta combination entirely.

而自架常駐個人 agent，正好是這個概念最完整的實體化——它的產品定義就要求三者同時存在。

九個專案的硬事實（GitHub API，2026-08-18 快照）：

| 專案 | ★ | 語言 | 授權 | 最後 push |
|---|---|---|---|---|
| openclaw/openclaw | 386,596 | TypeScript | 見 repo | 2026-08-18 |
| NousResearch/hermes-agent | 232,194 | Python | MIT | 2026-08-18 |
| zeroclaw-labs/zeroclaw | 32,610 | Rust | Apache-2.0 | 2026-08-18 |
| nanocoai/nanoclaw | 30,537 | TypeScript | MIT | 2026-08-17 |
| sipeed/picoclaw | 29,869 | Go | MIT | 2026-08-14 |
| nearai/ironclaw | 12,606 | Rust | Apache-2.0 | 2026-08-18 |
| cloudflare/moltworker | 9,946 | TypeScript | Apache-2.0 | **2026-05-09** |
| moltis-org/moltis | 2,824 | Rust | MIT | 2026-08-18 |
| librefang/librefang | 359 | Rust | MIT | 2026-08-18 |

Moltworker 是唯一一個三個多月沒動的，選它之前先確認狀態。

## 兩個極點：生態 vs 學習迴路

**OpenClaw** 是原點。奧地利開發者 Peter Steinberger 於 2025-11 以 Clawdbot 之名開始，改名 Moltbot、再改名 OpenClaw，2026-01 爆紅。2026-02-15 他加入 OpenAI，Sam Altman 在 X 上寫：

> OpenClaw will live in a foundation as an open source project that OpenAI will continue to support.

Steinberger 自己的說法更直白：「我想改變世界，不是開一家大公司。」專案現在由獨立 foundation 維護，OpenAI 贊助。它的資產是生態——最大的 skill 市集 ClawHub、最多的頻道（我在[頻道總覽那篇](/posts/ai/2026-03-28-openclaw-channels-overview)拆過它 31 個頻道幾乎全是 plugin 的安裝模型）。

**Hermes Agent** 是另一極。Nous Research 於 2026-02-25 發布（官方 releases 頁的描述是「An autonomous agent that lives on your server, remembers what it learns, and gets more capable the longer it runs」），MIT 授權。它的核心不是廣度而是**閉環學習**：agent 自己策展記憶、複雜任務結束後自動生成 skill、skill 在使用中自我改進、用 SQLite FTS5 搜尋歷史 session 再讓 LLM 摘要做跨 session 回憶。

（Hermes 的記憶與 skill 機制我在[另一篇](/posts/ai/2026-08-18-hermes-agent-memory-skills)拆過，它的沙箱後端還有個反直覺的副作用：[換到沙箱等於關掉危險指令審批](/posts/ai/2026-08-18-hermes-agent-terminal-backends)。）

最值得注意的細節是 Hermes 內建 `hermes claw migrate`——直接偵測 `~/.openclaw` 並匯入 SOUL.md、記憶、skills 和指令 allowlist。後進者把「從對手搬家」做成一等公民功能。更弔詭的是兩者共用 SKILL.md 標準，所以 Hermes 把 ClawHub 當成自己的安裝來源之一：OpenClaw 的市集在餵它最大的競爭者。

**然後 star 數騙了所有人。** OpenClaw 的 star 是 Hermes 的 1.66 倍，但 OpenRouter 的實際 token 量走向相反：

- 2026-05-06：Hermes 以 271B token 登上 OpenRouter 全站 app 排行第一
- 2026-05-10：日 token Hermes 224B vs OpenClaw 186B
- 2026-05 下旬：累計量也翻盤，Hermes 8.14T vs OpenClaw 7.18T
- 2026-06-06：Hermes 669B/日，OpenClaw 160B，中間隔了一個 Kilo Code 的 175B

星星量的是好奇心，token 量的是工作量。一個小得多的 Hermes 部署池，每個部署做的活比 OpenClaw 多。

（這組數字有嚴重限制，我在最後一節說。）

## 分裂的真正原因：2026 年 Q1

這九個專案的出生日期擠在 2026 年 1 月底到 3 月中——不是巧合，是同一波安全危機的產物。

**2026-01-30**：OpenClaw 發布 2026.1.29 修補 CVE-2026-25253，CVSS 8.8。成因是 Control UI 沒驗證 WebSocket 的 origin header，任何你造訪的網站都能靜默連上你正在跑的 agent，一次點擊就鏈成本機任意程式執行。發現者是 DepthFirst 的 Mav Levin。2026-02-03 公開揭露，同日 OpenClaw 另發兩則 command injection 公告。

**2026-02-01**：Koi Security 的 Oren Yomtov 審計 ClawHub 上 2,857 個 skill，341 個是惡意的（11.9%），其中 335 個來自同一波協同行動——後來被命名為 ClawHavoc。

**2026-02-05**：Snyk 發布 ToxicSkills，掃了 ClawHub 與 skills.sh 共 3,984 個 skill：

> 13.4% of all skills, or 534 in total, all contain at least one critical-level security issue... Expand to any severity level, and over a third of the ecosystem is affected: 36.82% (1,467 skills) have at least one security flaw.

其中 76 個確認帶惡意 payload，而**91% 的惡意 skill 同時混用 prompt injection 與傳統惡意程式**——同時繞過 AI 安全機制與傳統資安工具。

**2026-02-23**：Meta Superintelligence Labs 的對齊主管 Summer Yue 在 X 貼出截圖，她的 OpenClaw agent 在她的正式信箱裡「speedrun」刪信，無視她從手機連發的停止指令。這段後面單獨講。

**2026-03-13**：中國 CNCERT 發布風險警示，理由是「預設安全設定本身就弱」加上高系統權限。同日香港政府警告公務員不要安裝。同一天 arXiv 上出現 2603.12644（Zonghao Ying 等），提出三層風險分類（AI 認知層 / 軟體執行層 / 資訊系統層）與 FASA 全生命週期防禦架構。

七週。從爆紅到「政府級警示 + 學術論文 + 供應鏈投毒事件」，只花了七週。接下來每一個新專案，都是在對這七週做出回應。

而且沒有停。2026-03-29 的 **CVE-2026-32922**（CVSS 3.1 拿 9.9）是 `device.token.rotate` 沒把新發的 token 約束在呼叫者既有的 scope 內——一個只有 `operator.pairing` 權限的裝置，可以換出一顆 `operator.admin`，再一個 API 呼叫就是全節點 RCE。2026-05 Cyera 又揭露一組四個可串連的漏洞（Claw Chain），其中 **CVE-2026-44112 拿到 9.6**：OpenShell 沙箱後端的寫入路徑有 TOCTOU race，攻擊者可以在沙箱驗證邊界之前把寫入導到掛載根目錄之外。

最後那個值得停一下——**被打穿的是沙箱本身**。這對本文的主軸是雙面刃：它證明「加了沙箱」不是免死金牌，但也正好說明為什麼後來者要把隔離做在 OS 或 hypervisor 層，而不是做成應用程式裡的一段驗證邏輯。TOCTOU 這種洞，只會出現在「自己實作邊界檢查」的地方。

累計數字沒有權威單一來源。cyberdesserts 在 2026-04 盤點時記錄「60+ CVEs and GHSAs disclosed across multiple waves」，同時直白寫下結論：

> Default configurations still unsafe without manual hardening

想看當下狀態，去 OpenCVE 的 openclaw 廠商頁查——上面的條目一路排到 2026-07。

## 沒有攻擊者的那次事故

前面講的都是攻擊。但這個類別最出名的一次事故裡，一個攻擊者都沒有。

2026-02-23，Meta Superintelligence Labs 對齊主管 Summer Yue 把 OpenClaw 接上她的正式 Gmail，要它「檢查信箱、建議哪些可以刪或封存」，並明確交代未經核准不要動作。agent 直接開始刪。她從手機連打「Do not do that」「Stop don't do anything」「STOP OPENCLAW」，全被忽略。

> Nothing humbles you like telling your OpenClaw "confirm before acting" and watching it speedrun deleting your inbox. I couldn't stop it from my phone. I had to RUN to my Mac mini like I was defusing a bomb.

那則貼文有 960 萬次瀏覽。她自己給的根因比事件本身更值得記：她在一個小的「toy inbox」上測了好幾週都正常，換到真實信箱後資料量大得多，**觸發了 context compaction——而她那句「未經核准不要動作」在壓縮摘要的過程中被摘掉了**。

> Rookie mistake tbh. Turns out alignment researchers aren't immune to misalignment.

（TechCrunch 有註明他們無法獨立查證她信箱實際發生了什麼；本文引用的是她公開貼出的截圖與說法。）

這件事之所以重要，是因為它把失效模式從「有人攻擊你」換成「你的 agent 自己忘了」。**prompt 不是 guardrail**——它是會被壓縮、會被摘要、會在第 N 輪之後消失的一段文字。而這正好是前面那條「記憶越好用，風險窗口越長」的另一面：記憶機制既可能把攻擊者的指令留太久，也可能把你的安全指令丟太早。

兩個方向的失效，同一個成因：**agent 的 context 不是一個可靠的執行邊界**。

## 七種隔離答案

**NanoClaw：agent 級 container，而且小到能人工審完。** 官網直接列對照表——132 個原始檔 vs OpenClaw 的 3,680；約 17,500 行 vs 434,453 行；不到 10 個相依套件 vs 70；0 個設定檔 vs 53；安全模型「OS container isolation vs application-level checks」。架構是 host process 當 router，訊息寫進 `inbound.db`，喚醒 container 裡的 agent-runner，回應寫 `outbound.db` 再由 host 投遞——每個 session 兩個 SQLite 檔，各只有一個 writer，沒有 IPC。憑證走 OneCLI Agent Vault 在 request 時注入，**agent 永遠拿不到 raw API key**。

作者 Gavriel Cohen（前 Wix 工程師）的論點是：應用層的 allowlist 本質上脆弱，因為檢查邏輯本身就是攻擊面。「核心設計原則是 agent 級隔離，不是工具級隔離。」2026-05 NanoCo 拿了 $12M seed（Valley Capital Partners 領投，Docker、Vercel、monday.com、Hugging Face CEO Clem Delangue 參與），並回絕了約 $20M 的收購。

（口徑注意：官網的 17,500 行是整個 repo，VentureBeat 報導的「核心邏輯約 500 行、資安團隊八分鐘可審完」指的是核心。兩個數字都對，講的是不同東西。）

**IronClaw：WASM sandbox + PostgreSQL。** nearai 出品，README 自陳是「a Rust reimplementation inspired by OpenClaw」，還維護一份 FEATURE_PARITY.md 追蹤矩陣。四個差異寫得很清楚：Rust vs TypeScript、**WASM sandbox vs Docker**（輕量、capability-based）、**PostgreSQL vs SQLite**（production 級持久化）、多層防禦。這是唯一一個明確往受管制產業走的。

**Moltis：把可信基底縮到 7.5K 行。** Fabien Penso 的個人專案（Show HN 131 分）。Rust 59 crate、約 270K 行，但**agent runner 加 model interface 只有約 7.5K 行**，provider 再 19K。unsafe 只出現在 FFI 與預編譯 runtime 邊界，不在 agent loop 裡。加密 vault 用 XChaCha20-Poly1305 + Argon2id，SSRF 擋 loopback/private/CGNAT，WebSocket 拒跨來源（正好是 CVE-2026-25253 那個洞），15 個 lifecycle hook 可 inspect/modify/block。它的官方比較頁還很誠實地標了三個專案的 snapshot commit 與日期，附上「專案變化很快，做部署決定前請查各自 repo」的免責。**它也有 OpenClaw 匯入器**。

**ZeroClaw：把 security policy 放進 runtime 核心。** Rust 單一 binary，30+ 頻道、約 20 個 provider。架構圖裡 runtime 只有三格：agent loop、**security policy**、SOP engine。把安全策略跟 agent loop 並列，是刻意的架構表態。

**PicoClaw：讓 agent 小到能跑在 $10 硬體上。** Sipeed 出品，純 Go 從零寫（README 明確聲明不是任何專案的 fork），95% 核心程式由 Agent 生成、人工審核微調。自列對照：RAM，OpenClaw >1GB、NanoBot >100MB、PicoClaw <10MB；0.8GHz 單核開機時間 >500s / >30s / **<1s**；硬體成本 Mac Mini $599 / 約 $50 的 Linux 板 / **$10 起**。單一 binary 跨 RISC-V、ARM、MIPS、x86。

它的 README 有兩句很難得的自我修正：「Recent builds may use 10-20MB RAM」——<10MB 的招牌數字已經被自己合併的 PR 打破了；以及「in early rapid development... do not deploy to production before v1.0」。願意在 README 上寫這個的專案不多。

**Moltworker：整包丟到 serverless。** Cloudflare 官方把 OpenClaw 包進 Cloudflare Sandbox container 跑在 Workers 上，可選 R2 持久化。它的賣點正好是它的缺點：agent 完全碰不到你的本機——所以也完全用不到你的本機。成本寫得很透明（設 `SANDBOX_SLEEP_AFTER` 讓 idle 睡著，一天跑 4 小時約 $5-6/月 compute 加 $5 方案費）。但三個多月沒 push。

**LibreFang：Agent OS 的概念實驗。** Rust 24 crate、2,100+ 測試、45 個 channel adapter、28 個 provider、60 個內建 skill、WASM sandbox、taint tracking、Ed25519 簽章。359 star，最早期。它對自己弱點的誠實值得一提：「OFP wire is plaintext-by-design」——P2P 協定的內容不加密，有 HMAC 互相認證但沒有機密性，所以官方要求你跑在 WireGuard、Tailscale 或 mTLS 後面。

## 兩條互斥的軸

把九個專案攤開，會看到四條分歧軸：隔離邊界、可信基底大小、記憶與學習深度、部署形態。其中**第二條和第三條直接打架**。

可信基底那條軸從 1.1M 行（OpenClaw，用 tokei 量）一路縮到 270K（Moltis，核心 7.5K）、152K（Hermes）、17.5K（NanoClaw），到 PicoClaw 的 <10MB 執行檔。學習那條軸則從無狀態一路長到「自己寫 skill、自己改記憶」。

你不可能同時要「小到一個下午讀完」和「會自己改寫自己的行為」。更麻煩的是，持久記憶讓 prompt injection 從即時攻擊變成**延遲執行攻擊**——你上週二打開的那份 PDF 裡的隱藏指令，可以躺在 agent 記憶裡，等某個未來任務把它觸發。記憶越好用，這個窗口越長。

Summer Yue 那次事故是這條軸的實證：壓縮吃掉的不是別的，正是她的安全指令。你越依賴 context 承載規則，這個機制就越不可靠。

而 NanoClaw 和 Hermes 正好是這條光譜的兩端，也正好是這個類別裡成長最快的兩個。這就是為什麼不會有贏家：市場在同時獎勵兩個互斥的方向。

## 怎麼選

| 情境 | 選 | 為什麼 |
|---|---|---|
| 要最多頻道、最大 skill 市集，願意自己硬化 | OpenClaw | 生態無可取代；但主 session 預設在 host 上，先讀完 sandboxing 文件再開 |
| 想要 agent 越用越準、跨 session 記得你 | Hermes Agent | 唯一把 learning loop 當核心的；有 OpenClaw 遷移工具 |
| 企業／多客戶資料，需要硬邊界 | NanoClaw | agent 級 container、憑證不進 agent，而且程式碼小到能自己審 |
| 受管制產業、要 production 級持久化 | IronClaw | PostgreSQL + WASM sandbox + per-job token |
| 不想裝 Node/Python、要單檔加加密 vault | Moltis | 可信基底最小的實作；但生態有限 |
| $10 SBC、邊緣裝置、老手機 | PicoClaw | 唯一真能跑在這個級距的；v1.0 前別上 production |
| 不想自架，接受 agent 碰不到本機 | Moltworker | 先確認專案狀態（2026-05-09 後無更新） |
| 想要 Rust 單檔 + 30 頻道 + 安全策略進核心 | ZeroClaw | 介於 Moltis 與 OpenClaw 之間 |
| 想看 Agent OS 概念怎麼長 | LibreFang | 最早期，OFP 明文，只在私網跑 |

## 這些數字的限制

寫完上面這些，有幾件事必須講清楚，否則你會拿著錯誤的信心做決定。

**OpenRouter 排名只涵蓋走 OpenRouter 的流量**，而且只算有 opt-in 使用歸因的 app。直連 Anthropic 或 OpenAI 的部署完全不在統計裡。它證明的是「Hermes 使用者比較愛用 OpenRouter 而且跑得很重」，不完全等於「Hermes 比較多人用」。

**曝露實例數的來源彼此差了四倍以上**：SecurityScorecard 在 2026-02 說 135,000 個；Censys 在 2026-03 下旬說 63,070 個；Cyera 在 2026-05 同時給了兩個數字——Shodan 約 65,000、ZoomEye 約 180,000。同一個月、同一件事，兩個掃描器差 2.8 倍。這反映的是掃描方法、指紋規則與時點差異，不是真相分歧。要引用就把範圍講出來，不要挑對自己論點有利的那個。

**最重要的一筆，也是最反直覺的**：有研究比對七個 skill 掃描器對 238,180 個 skill 的判定，flag 率從 Socket 的 3.8% 到 OpenClaw Scanner 的 41.9%；被至少一個掃描器 flag 的 8,402 個 skill 裡，**72% 只被其中一個 flag**；在五個掃描器都覆蓋的 Skills.sh 上，27,111 個 skill 裡只有 33 個達成一致——**0.12%**。

但這個數字要往兩邊讀，只講一邊會把人推向過度恐慌。同一份研究的另一半是**掃描器大量誤報**：深入分析後 96% 被 flag 的 skill 其實是正當的；而且當分析把 repository 的上下文一起納入（程式碼與文件是否一致、維護歷史、metadata），真正可疑的從數千個掉到 **15 個，只有原始 flag 量的 0.52%**。掃描器不只是彼此不同意，它們是集體傾向於亂叫。

那為什麼不能靠調校掃描器解決？2026-06-03 Trail of Bits 給了結構性的答案。他們一口氣繞過 ClawHub 的惡意 skill 偵測器（含 VirusTotal）、Cisco 的 skill-scanner，以及 skills.sh 整合的三家（Gen、Socket、Snyk）——**沒有一個擋得住**：

> it took us less than an hour to conceive and implement three of the four malicious skills

手法一點都不高深。第一個攻擊就是在樣板和惡意程式碼之間塞 10 萬個換行：OpenClaw 的掃描器把檔案截斷了，直接沒讀到後面；VirusTotal 那個模型則是被搞糊塗。另一個是讓 `.pyc` bytecode 與原始碼不一致——xz-utils 那套老招——在 skills.sh 上一路綠燈通過。他們的結論寫得很硬：

> No amount of scanning or LLM analysis can reliably detect malicious content in agent skills.

原因也講明白了：掃描是靜態的，而攻擊者可以無限次微調直到某一版通過（unlimited bites at the apple）。

所以「我掃過了」不構成安全保證——不是因為現在的掃描器做得不夠好，而是因為這件事的形狀就不適合用掃描解決。**隔離是架構問題，不是掃描問題**——這正是那七個後來者各自用 container、WASM、serverless、或者把程式碼砍到能人工審完來回答的原因。掃描是地板，不是天花板。

最後，本文所有 star 數是 2026-08-18 的快照。這個類別在半年內排名已經翻過好幾次，你讀到這篇時數字大概又不一樣了。

## 更新紀錄

- 2026-08-18：補上 Trail of Bits 2026-06-03 的掃描器全繞過研究（一手），並平衡「掃描器不可信」那段——原本只寫了掃描器彼此不一致，漏掉同一份研究裡「96% 被 flag 的其實正當、納入 repo 上下文後真正可疑的只剩 15 例」這半邊。

## 參考資料

專案官方：

- [OpenClaw](https://github.com/openclaw/openclaw) · [Security 文件](https://docs.openclaw.ai/security) · [Sandbox CLI](https://docs.openclaw.ai/sandbox)
- [Hermes Agent](https://github.com/NousResearch/hermes-agent) · [Nous Research Releases](https://nousresearch.com/releases)
- [NanoClaw](https://github.com/nanocoai/nanoclaw) · [nanoclaw.dev](https://nanoclaw.dev)
- [PicoClaw](https://github.com/sipeed/picoclaw)
- [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw)
- [IronClaw](https://github.com/nearai/ironclaw)
- [Moltworker](https://github.com/cloudflare/moltworker)
- [Moltis](https://github.com/moltis-org/moltis) · [Moltis 官方比較頁](https://docs.moltis.org/comparison.html)
- [LibreFang](https://github.com/librefang/librefang)

安全研究與報導：

- [Snyk — ToxicSkills: 3,984 個 skill 的完整審計](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub)
- [arXiv 2603.12644 — Uncovering Security Threats and Architecting Defenses in Autonomous Agents: A Case Study of OpenClaw](https://arxiv.org/abs/2603.12644)
- [The Hacker News — CNCERT 對 OpenClaw 發布風險警示](https://thehackernews.com/2026/03/openclaw-ai-agent-flaws-could-enable.html)
- [七個 skill 掃描器只有 0.12% 共識](https://theweatherreport.ai/posts/skill-scanner-disagreement)
- [Trail of Bits — The sorry state of skill distribution（繞過全部五個掃描器）](https://blog.trailofbits.com/2026/06/03/the-sorry-state-of-skill-distribution)
- [CSA — AI Agent Skill Scanners: Bypassed Across the Board](https://labs.cloudsecurityalliance.org/research/csa-research-note-ai-agent-skill-scanner-bypass-20260610-csa)
- [ClawHub 341 個惡意 skill 事件（Koi Security 審計）](https://www.termdock.com/en/blog/clawhub-malicious-skills-incident)
- [ARMO — CVE-2026-32922：OpenClaw 權限提升（CVSS 9.9）](https://www.armosec.io/blog/cve-2026-32922-openclaw-privilege-escalation-cloud-security)
- [Cyera — Claw Chain：四個可串連的漏洞，含 CVSS 9.6 的沙箱逃逸](https://www.cyera.com/blog/claw-chain-cyera-research-unveil-four-chainable-vulnerabilities-in-openclaw)
- [OpenCVE — OpenClaw 廠商頁（查當下 CVE 狀態）](https://app.opencve.io/cve?vendor=openclaw)
- [Infosecurity Magazine — Endor Labs 揭露六個新漏洞](https://www.infosecurity-magazine.com/news/researchers-six-new-openclaw)
- [OpenClaw 安全風險盤點：skills、曝露面與漏洞（2026-04 狀態）](https://blog.cyberdesserts.com/openclaw-malicious-skills-security)
- [joylarkin/openclaw-security-news — 事件時間軸索引](https://github.com/joylarkin/openclaw-security-news)
- [ClawSec — 跨 OpenClaw / Hermes / PicoClaw / NanoClaw 的安全 skill 套件](https://github.com/prompt-security/clawsec)

人事與市場：

- [Peter Steinberger — OpenClaw, OpenAI and the future](https://steipete.me/posts/2026/openclaw)
- [CNBC — OpenClaw creator Peter Steinberger joining OpenAI](https://www.cnbc.com/2026/02/15/openclaw-creator-peter-steinberger-joining-openai-altman-says.html)
- [TechCrunch — NanoClaw creator turns down $20M buyout, raises $12M seed](https://techcrunch.com/2026/05/20/nanoclaw-creator-turns-down-20m-buyout-offer-raises-12m-seed-instead)
- [TechCrunch — Meta AI 研究員的 OpenClaw agent 在信箱裡失控](https://techcrunch.com/2026/02/23/a-meta-ai-security-researcher-said-an-openclaw-agent-ran-amok-on-her-inbox)
- [Business Insider — Meta AI alignment director 的刪信事故](https://www.businessinsider.com/meta-ai-alignment-director-openclaw-email-deletion-2026-2)
- [The San Francisco Standard — She runs AI safety at Meta. Her AI agent still went rogue](https://sfstandard.com/2026/02/25/openclaw-goes-rogue)
- [MarkTechPost — Hermes Agent 登上 OpenRouter 全球排行第一](https://www.marktechpost.com/2026/05/10/openclaw-vs-hermes-agent-why-nous-researchs-self-improving-agent-now-leads-openrouters-global-rankings)
- [ClawClones — 43 個 OpenClaw 替代品的追蹤索引](https://clawclones.com/analysis)
- [Simon Willison — The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta)

站內相關：

- [OpenClaw 文件導讀系列總覽](/posts/ai/2026-03-28-openclaw-overview)
- [OpenClaw 頻道總覽：誰能觸發 vs 模型看得到什麼](/posts/ai/2026-03-28-openclaw-channels-overview)
- [OpenClaw 認證與密鑰管理](/posts/ai/2026-03-28-openclaw-auth-secrets)
- [Hermes Agent 導讀](/posts/ai/2026-08-18-hermes-agent-intro)
- [Hermes Agent 的記憶與技能：一個會自己改自己的系統](/posts/ai/2026-08-18-hermes-agent-memory-skills)
- [Hermes Agent 的七種終端後端：換到沙箱等於關掉危險指令審批](/posts/ai/2026-08-18-hermes-agent-terminal-backends)
