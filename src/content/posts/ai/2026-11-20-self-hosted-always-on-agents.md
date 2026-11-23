---
title: "跑在自己的機器上：自架常駐 agent 有三種，OpenClaw、Hermes 和其他開源專案各適合誰"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, hermes-agent, self-hosted]
lang: zh-TW
tldr: "「自架」分三種：開源程式自己跑、廠商的 app 跑在你的機器上、廠商在雲端替你跑開源程式。三種差在誰掌握機器、程式、更新和憑證。開源自己跑的兩大專案：OpenClaw 新安裝就有每 30 分鐘一次的 Proactive check，會自己醒來看；但工具預設直接跑在主機上，沙盒要自己開。Hermes Agent 內建排程和簽章 webhook，指令預設也跑在本機，但危險指令要審批、排程裡碰到一律拒絕，要自己醒來得裝社群外掛 heartbeat2。不管選哪個，機器要一直開著、事件要有公開網址、修補要自己追。"
description: "自架常駐 agent 的三種類型與各自的責任分界，OpenClaw 與 Hermes Agent 在醒來機制、安全預設與省錢設計上的差別，QwenPaw、ClickHouse Nerve 等其他開源專案，Perplexity Personal Computer 這種「機器是你的、程式是廠商的」，以及依自己能力選類型的方法。"
series:
  name: "常駐型 AI agent"
  order: 14
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-self-hosted-always-on-agents-en)

| 自架的三種 | 機器 | 程式 | 例子 |
|---|---|---|---|
| 開源程式自己跑 | 你的 | 開源，你自己更新 | OpenClaw、Hermes Agent、QwenPaw |
| 廠商的 app 跑在你的機器上 | 你的 | 廠商的，廠商更新 | Perplexity Personal Computer |
| 廠商在雲端替你跑開源程式 | 廠商的 | 開源，廠商包裝 | KimiClaw 等（下一篇） |

[Pinggy 在 10 月 31 日](https://pinggy.io/blog/proactive_ai_agents_compared/)用乾淨的 Docker 容器，把 OpenClaw 和 Hermes Agent 各裝了一次。目標是同一件事：平日早上 8 點給一份簡報，只在需要做決定時才說話；另外，GitHub 有新 issue 時通知。

兩邊的排程指令都只要一行。卡住的地方在別處：

- 兩個程式的排程都跑在 gateway 裡，gateway 沒開，什麼都不會觸發。
- Hermes 要先設時區。他們實測發現，先建工作再改時區，已經存好的下次執行時間不會跟著改。
- OpenClaw 建好的排程工作，預設允許所有工具（`"toolsAllow": ["*"]`），要自己加允許清單。
- GitHub 的 webhook 要打到一個公開網址，但你的電腦沒有。免費的通道 60 分鐘就過期，網址會換。

這篇講自架常駐 agent：「自架」其實有三種，OpenClaw、Hermes 和其他開源專案各適合誰。

## 三種自架，差在誰負責哪一層

前面路線一的產品，機器、程式、更新、憑證全在廠商手上。自架把其中幾層拿回來，也把那幾層的責任一起拿回來：

| 誰負責 | 開源自己跑 | 廠商 app 在你的機器 | 廠商雲端跑開源 |
|---|---|---|---|
| 機器一直開著 | 你 | 你 | 廠商 |
| 程式更新、修補漏洞 | 你 | 廠商 | 廠商 |
| 安全預設怎麼設 | 你 | 廠商 | 廠商，部分可調 |
| 憑證放在哪 | 你的機器 | 你的機器，程式是廠商的 | 廠商的機器 |
| 模型 | 你選，自己付費 | 廠商決定 | 廠商決定 |
| 能改程式碼 | 能 | 不能 | 不能 |

第二種的代表是 Perplexity Personal Computer：[官方建議](https://www.perplexity.ai/hub/blog/personal-computer-is-here)放在一台 Mac mini 上 24 小時開著，能用本機的檔案和原生 app。[前面的 Perplexity 篇](/posts/ai/2026-11-20-perplexity-teammates)講過它跟雲端 teammate 怎麼分工。機器是你的，但程式碼看不到、改不了。

第三種在中國最多，下一篇專門講。這篇的重點是第一種。

## OpenClaw：預設就會自己醒來

OpenClaw 是目前最大的開源常駐 agent：MIT 授權，GitHub 星數約 39.5 萬（11 月 23 日）。

**醒來機制**：一個 Node.js 的 Gateway 跑在你的機器上，排程都在它裡面跑。新安裝會建一個 [Proactive check](/posts/ai/2026-03-28-openclaw-automation-cron-webhook)：每 30 分鐘一次，用主對話執行，等閒置才跑，結果送到你的私訊。沒事要回報時，回 `NO_REPLY` 就不會送出。這就是 L3：它自己決定要不要說話。

舊版叫 Heartbeat，現在已經併進一般的排程工作。

**安全預設**：[官方的沙盒文件](https://docs.openclaw.ai/gateway/sandboxing)開頭就寫：沙盒預設是關的。工具執行可以移進 Docker、Podman、SSH 或 OpenShell 沙盒，但要自己在設定裡開。Gateway 本身永遠留在主機上。官方也承認，沙盒不是完美的安全邊界，只是在模型做蠢事時大幅限制它能碰的檔案和程序。

Pinggy 引 OpenClawCVEs 追蹤站的統計：到 10 月 31 日，跟 OpenClaw 有關的 CVE 有 543 個。生態系最大，要追的修補也最多。

## Hermes Agent：排程清楚，安全預設保守

Hermes Agent 是 Nous Research 的開源 agent：MIT 授權，GitHub 星數約 26.5 萬（11 月 23 日）。

**醒來機制**：排程器跑在 gateway 裡，每 60 秒檢查一次。排程可以用白話寫（「weekdays at 8am」），失敗的執行一定會通知你。有兩個省錢的設計：

- **monitor mode**：先跑一個便宜的檢查（一個網址或一支腳本），輸出沒變就完全不叫模型。
- **`[SILENT]`**：工作的最後回應含這個標記，就不送出。

事件觸發靠簽章的 webhook。Pinggy 實測：簽章對的請求收到 `HTTP 202`，簽章錯的收到 `401`。

但 Hermes 內建的是 L2：時間到了、事件來了才動。要讓它自己決定何時醒來，得裝社群外掛 [heartbeat2](https://github.com/electricsheephq/heartbeat2)。它給 agent 「角色」和「自己的時間」：agent 有固定負責的事、有一本跨回合的筆記，自己排節奏。外掛用普通程式檢查每個喚醒條件，條件成立才給模型一個回合；每天的回合數、訊息數和花費上限由你設，agent 只能調低、不能調高。這個外掛目前只有 25 顆星，是個人維護的專案。

**安全預設**：指令預設跑在本機（`terminal.backend: "local"`），沒有隔離。但[官方的安全文件](https://hermes-agent.nousresearch.com/docs/user-guide/security)列了八層防護，跟常駐最相關的是審批：

- 預設的 `smart` 模式，用另一個模型評估指令的風險：低風險的自動放行，明顯危險的自動拒絕，不確定的才問你。
- 排程工作碰到危險指令，預設一律拒絕（`cron_mode: deny`），webhook 和 API 這類沒人能回答的對話也一樣。
- 不管怎麼設，格式化磁碟、`rm -rf /` 這類指令永遠擋下。

要注意的是，[本站 Hermes 系列提過](/posts/ai/2026-08-18-hermes-agent-terminal-backends)：一換成 Docker 這類沙盒後端，危險指令的審批就跳過了，因為官方把容器本身當成邊界。如果容器裡掛了主機目錄或帶了 token，這個假設就不成立。

## OpenClaw 和 Hermes 怎麼比

| | OpenClaw | Hermes Agent |
|---|---|---|
| 內建醒來級別 | L3：每 30 分鐘的 Proactive check | L2：排程和 webhook；L3 要裝 heartbeat2 |
| 沒事時不說話 | `NO_REPLY` | `[SILENT]`；monitor mode 連模型都不叫 |
| 工具預設跑在哪 | 主機，沙盒要自己開 | 本機，但危險指令要審批 |
| 無人看管時碰到危險指令 | 依工具政策 | 預設拒絕 |
| 生態系 | 最大，CVE 也最多 | 較小，排程與 webhook 文件清楚 |

Pinggy 的結論是：OpenClaw 生態系最大，但要常常修補；Hermes 的排程和 webhook 模型對開發者最清楚。

## 其他開源專案

| 專案 | 誰做的 | 醒來機制 | 現況（11 月 23 日） |
|---|---|---|---|
| [QwenPaw](https://github.com/agentscope-ai/QwenPaw)（原 CoPaw） | 阿里通義實驗室 AgentScope 團隊 | 定時任務和心跳任務；可接釘釘、飛書、微信 | Apache-2.0，約 3.8 萬星 |
| [Nerve](https://github.com/ClickHouse/nerve) | ClickHouse | 建在 Claude Agent SDK 上；每 4 小時的規劃排程會自己挑待辦、探索程式碼、提計畫，核准後才執行 | Apache-2.0，約 120 星 |

QwenPaw [2 月 28 日以 CoPaw 之名開源](https://www.ithome.com/0/924/517.htm)，4 月改名。它的特色是可以完全用本機模型跑，README 寫「資料留在你的機器，無第三方託管」。

Nerve 的[規劃流程](https://github.com/ClickHouse/nerve/blob/main/docs/plans.md)是另一種 L3：它主動，但計畫一律等人核准，「Plans are never executed automatically」。核准後才開一個有完整工具權限的實作對話。

GitHub 上還有很多星數只有個位數、還在 1.0 之前的小專案，多半是 heartbeat 型。拿來研究可以，放你的信箱和帳號進去之前要三思。

## 自架的成本與維運

不管選哪個開源專案，這幾件事都要自己扛：

- **機器要一直開著**：gateway 停了，排程就不觸發。筆電闔上就等於關掉。常見的做法是一台常開的小主機或雲端 VM。
- **事件要有公開網址**：webhook 要能從外面打進來。通道服務、反向代理或 VPN 都要自己設，免費的通道會過期換網址。
- **修補要自己追**：開源專案更新很快，漏洞也多。誰負責升級、多久升一次，要先想好。
- **模型的錢自己付**：每 30 分鐘醒來一次，一天就是 48 次模型呼叫。用 monitor mode 或 heartbeat2 的預算上限壓住次數。
- **預設值要自己收緊**：工具允許清單、沙盒、審批模式，預設值都偏向「先能用」。

## 依你的能力選一種

照這兩個問題選：

**1. 你能不能維運一台常開的機器、自己追修補？**

- 不能 → 不要選開源自己跑。用路線一的雲端產品，或第三種託管服務。
- 能 → 往下看第二題。

**2. 你想掌握到哪一層？**

| 你想要 | 選 | 你要負責 |
|---|---|---|
| 只要它跑在我的機器、碰我的本機檔案 | 廠商 app，例如 Personal Computer | 機器開著 |
| 自己選模型、能改程式、生態系大 | OpenClaw | 機器、修補、自己開沙盒、收緊工具清單 |
| 排程和 webhook 清楚、無人看管時保守 | Hermes Agent | 機器、修補、公開網址；要 L3 就多裝外掛 |
| 資料完全不出自己的機器 | QwenPaw 加本機模型 | 機器、修補，以及本機模型的硬體 |
| 主動提案，但每件事等我核准 | Nerve | 機器、修補，以及每份計畫的審查 |

選完之後，從一個有「沒事不說話」路徑的排程工作開始，再加一個事件觸發。會寄出、付錢、刪除的動作，審批一律打開。

## 適合誰、不適合誰

**適合：**
- 熟悉命令列、能維運一台常開機器的開發者。
- 想自己選模型、控制成本，或想看懂 agent 怎麼運作的人。
- 資料不想交給雲端廠商的人。

**不適合：**
- 不想維運機器、不想追修補的人：雲端產品省事很多。
- 沒有時間收緊預設值的人：開源專案的預設偏向先能用。
- 需要廠商出事負責的人：開源專案沒有支援合約。

開源專案沒有地區限制，台灣可以直接裝；能用的模型取決於你接哪家的 API。

下一篇看[中國怎麼把同一個開源核心包成產品](/posts/ai/2026-11-20-china-claw-family)：雲端託管、一鍵安裝、綁進通訊軟體。包得越深越方便，安全評測顯示攻擊面也越大。

## 參考資料

- [Proactive AI Agents Compared: Dots vs Muse vs Grok Bot vs Instinct vs Hermes vs OpenClaw (2026)](https://pinggy.io/blog/proactive_ai_agents_compared/)（Pinggy，2026-10-31）
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing)（OpenClaw 文件）
- [Security](https://hermes-agent.nousresearch.com/docs/user-guide/security)（Hermes Agent 文件）
- [electricsheephq/heartbeat2](https://github.com/electricsheephq/heartbeat2)（GitHub）
- [agentscope-ai/QwenPaw](https://github.com/agentscope-ai/QwenPaw)（GitHub）
- [阿里桌面 Agent 工具 CoPaw 开源](https://www.ithome.com/0/924/517.htm)（IT之家，2026-02-28，簡體中文）
- [ClickHouse/nerve](https://github.com/ClickHouse/nerve) 與 [Proactive Task Planning](https://github.com/ClickHouse/nerve/blob/main/docs/plans.md)（GitHub）
- [Personal Computer is here](https://www.perplexity.ai/hub/blog/personal-computer-is-here)（Perplexity）
