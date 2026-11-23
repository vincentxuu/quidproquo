---
title: "OpenClaw Enterprise：一家公司要同時管幾百個常駐 agent，要先有哪五類控制"
date: 2026-11-20
category: ai
type: deep-dive
tags: [ai-agent, always-on-agent, openclaw, openai, kimi]
lang: zh-TW
tldr: "OpenClaw Enterprise（OCE）是管理常駐 agent 的開源控制平面，本身不是 agent：多租戶、硬性的安全邊界、可稽核，模型、harness 和沙盒都能換。它從 OpenAI 起頭，捐給 OpenClaw 基金會，跟 Red Hat、NVIDIA 一起開發，目前是 1.0 之前的版本，只建議內部試行。OpenAI 自己用它管超過 500 個 OpenClaw agent，公開了五類控制：分開可信與不可信的執行、硬性沙盒邊界、模型審查每個動作、agent 有自己的身分、全部記錄。中國的對照是 Kimi Hosted Agents，把同一層做成託管服務。"
description: "OpenClaw Enterprise 是什麼、為什麼 IT 的預設是禁用 agent 平台、OpenAI 內部 500 多個 OpenClaw agent 用的五類控制與設定範例、Red Hat 和 NVIDIA 各補哪一層、Kimi Hosted Agents 的託管做法，以及導入常駐 agent 前要先有的控制清單。"
series:
  name: "常駐型 AI agent"
  order: 13
draft: false
---

> :globe: [English version](/posts/ai/2026-11-20-openclaw-enterprise-en)

| 這篇的主角不是 agent | OpenClaw Enterprise |
|---|---|
| 它是什麼 | 管理常駐 agent 的控制平面，負責部署、隔離、權限、稽核 |
| 它管的 agent | 預設是 OpenClaw，也能換成別的 harness、模型和沙盒 |
| 跑在哪裡 | 你自己的基礎設施：本機用 docker-compose，正式環境用 Kubernetes |
| 狀態 | 1.0 之前，只建議內部試行；MIT 授權，永久免費 |

OpenAI 的工程師 RJ Marsan [在 OpenClaw Enterprise 的發表文裡](https://openclaw.ai/blog/openclaw-enterprise)描述他們內部一個叫 Androidclaw 的 agent：

> Alert about a broken build? Androidclaw finds the PR and can quickly fix it. Someone gives feedback that the work tab disappeared? Androidclaw responds in like 30 seconds with the link to the SEV.

它掌握團隊所有的脈絡：git、GitHub、日誌。就連「串流好像怪怪的」這種模糊的回報，它也能追查、找到修法、發 PR 附影片證據，再合併。

[VentureBeat 的評論](https://venturebeat.com/orchestration/openclaw-launches-free-enterprise-control-plane-for-persistent-ai-agents-backed-by-openai-red-hat-and-nvidia)點出這個例子的兩面：agent 越有用，通常需要的權限就越大。OpenAI 現在內部有超過 500 個這樣的 agent 在背景跑。

這篇講 OpenClaw Enterprise：一家公司要同時管幾百個常駐 agent，要先有哪些控制。

## 為什麼 IT 的預設是禁止

OpenClaw Enterprise 的發表文開頭就寫出問題：OpenClaw 推出快一年了，常駐 agent 的實際部署仍然有限。組織最常給的回饋是，在完全採用之前，需要一套更強的共同安全、安全性與治理標準。結果是：

> the default stance of IT in most organizations is to ban agentic platforms like OpenClaw altogether.

但禁止不代表沒人用。OpenClaw 首席架構師 Vincent Koch 在 [NVIDIA GTC Berlin 的座談](https://www.nvidia.com/en-us/on-demand/session/gtcberlin26-sb61149/)說，他們發現很多企業早就自己 fork 了 OpenClaw 在內部部署。有一家的使用人數有兩三萬人，各自維護自己的版本。Microsoft 的 [Autopilot](/posts/ai/2026-11-20-microsoft-autopilot) 也是這樣出來的，Koch 形容它是「their opinionated version of OpenClaw」。

OCE 要解決的就是這個問題：在企業環境裡安全地部署能力很強的 agent，又不用把它的能力閹割掉。

## OpenClaw Enterprise 是什麼

[官方的說法](https://openclaw.ai/blog/openclaw-enterprise)是「an open source, vendor neutral platform for managing persistent agents in sensitive environments」。GitHub 上的說明更直接：「Kubernetes for agents」。

- **控制平面（OCC）**：[The New Stack 整理](https://thenewstack.io/openclaw-enterprise-kubernetes-agents/)，管理員在這裡部署 agent、把它們分進隔離的命名空間、管設定和憑證、設權限。透過平台做的每個變更都有紀錄。agent 實際做事的部分是分開的：gateway 收訊息，harness 處理 agent 的回合、模型呼叫和工具執行。
- **可替換**：harness、模型、沙盒都能換成第三方或自己的實作，不綁一整套。
- **來歷**：從 OpenAI 起頭，捐給 OpenClaw 基金會成為獨立專案，再跟 Red Hat、NVIDIA 一起開發。OpenAI 和 Red Hat 內部已經在試行。
- **狀態**：The New Stack 引架構文件說，API、主控台、常駐 worker、PostgreSQL 後端、Kubernetes 打包已經做好。還沒做完的有外部 gateway 的准入、workload 回頭向 OCC 驗證身分，以及部分模型驗證方式。官方計畫年底推出 1.0。

## OpenAI 內部 500 多個 agent 用的五類控制

[OpenAI 在開發者部落格](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai)公開了自己部署 OpenClaw agent 的做法。文章開頭點出常駐 agent 跟傳統軟體的根本差別。傳統軟體的設定和程式碼是確定的，威脅主要來自外部攻擊者；常駐 agent 會改自己的設定、寫任意的程式碼來達成目標。原文的說法是：「Attacks come from the inside when agents take misaligned actions.」

以下是 OpenAI 列的五類控制，以及他們自己怎麼設：

### 1. 分開可信與不可信的執行

網路、身分、沙盒這些關鍵元件是可信的確定性程式；agent、它執行的環境、它寫的程式碼都視為不可信。OpenAI 為此在開源專案裡實作了遠端 harness 執行。設定 agent 的 OpenClaw Gateway 因此可以跑在另一個容器裡（他們的情況是另一個叢集），跟 agent 的 harness 分開。

### 2. 硬性的安全邊界

用沙盒限制 agent 能做什麼，分四個面向：

| 面向 | OpenAI 的做法 |
|---|---|
| 網路 | 組織管理的允許清單，加上明確封鎖的端點 |
| 工作區 | 只能寫入 agent 自己的工作目錄 |
| 程序 | 用 Codex 的 Linux 沙盒做程序隔離 |
| 密鑰 | 透過憑證代理管理，agent 看不到密鑰 |

文章附了實際的設定檔。幾個值得注意的地方：

- 拿掉 `danger-full-access` 模式，只允許唯讀和寫入工作區兩種沙盒模式。
- 網路只允許 GitHub 相關的網域，明確封鎖 pastebin、webhook.site 這類常被拿來傳出資料的網站，以及雲端的 metadata 端點（`169.254.169.254`）。
- 網路搜尋只用快取版，查詢經過 OpenAI 自己的索引。
- 禁止讀取 `~/.ssh`，從 agent 執行指令的環境變數裡移除 `GH_TOKEN` 等 GitHub 憑證。文章也註明，這不會隱藏存在 agent 讀得到的檔案裡的憑證。
- app 預設全部關閉，破壞性的操作也預設關閉。

### 3. 用模型審查每個動作

前兩類都是靜態的控制。OpenAI 認為，模型越來越聰明，防禦也要能隨運算規模擴大，也就是用其他模型來防。Auto-review 讓第二個 agent 監看、核准主要 agent 的動作。

理由是：一直要人審，會造成審查疲勞，人會被訓練成無腦按同意。用模型當第一道過濾，把人的注意力留給真正重要的核准。OpenAI 的 OpenClaw 部署對所有 agent 動作都強制開 Auto-review。

### 4. agent 的身分跟使用者的身分分開

要能稽核一個動作、給 agent 存取資源的權限，也要分得出這個動作是 agent 還是使用者發起的。OpenAI 的做法是：每個 agent 有自己的身分，對應一個 ChatGPT 服務帳號。這讓每個 agent 有跟使用者分開的推論憑證，團隊能替它接自訂外掛，也能稽核它的動作、必要時直接關掉它的推論。

這跟上一篇 Autopilot 的 Entra Agent ID 是同一個想法，只是落在不同的系統上。

### 5. 全部記錄

每一個控制平面上的設定變更、agent 的每一個回合，全部記下來。因為 agent 的回合可能包含敏感資訊，這些紀錄被鎖起來，只有資安團隊裡少數幾個人看得到。

## 這些控制換來什麼

OpenAI 說，內部試行 OpenClaw 後，技術和非技術團隊的生產力和採用率都大幅上升。現在有超過 500 個 agent 在背景主動做事，從依產品回饋自動開 PR，到持續對新功能跑資料實驗。

這是 OpenAI 自己的說法，沒有外部稽核過這些設定和成效。

## Red Hat 和 NVIDIA 各補哪一層

[VentureBeat 整理](https://venturebeat.com/orchestration/openclaw-launches-free-enterprise-control-plane-for-persistent-ai-agents-backed-by-openai-red-hat-and-nvidia)，兩家都從相鄰的層面處理 agent 安全：

- **Red Hat**：用 OpenShift 把 agent 跟敏感憑證隔開，用獨立的命名空間、限制的存取控制和憑證代理，把 agent 程序本身當成不可信的。Red Hat 也是 OpenClaw 基金會的創始成員，[打算把 OCE 用在內部](https://www.redhat.com/en/blog/why-red-hat-building-open-foundation-enterprise-agents-openclaw-enterprise)來協調 agent 部署。
- **NVIDIA**：開發了開源的 OpenShell，把自主 agent 放進預設拒絕所有權限的隔離環境，有政策執行和稽核軌跡。

OCE 在這些執行環境的保護之上，提供組織層級的控制平面。

## 中國的對照：Kimi Hosted Agents

OCE 的路是「控制平面開源，跑在你自己的基礎設施上」。Moonshot AI 在 [11 月 5 日推出的 Kimi Hosted Agents](https://www.kimi.com/news/kimi-hosted-agents) 走另一條：把 agent 執行的 harness 整個做成雲端服務，官方叫它「Harness as a Service」。

[產品文件](https://platform.kimi.com/docs/hosted-agents/overview)列出它替企業接手的東西：

| 能力 | 自己建 harness | Kimi 託管 |
|---|---|---|
| 對話紀錄 | 自己拼接、儲存、回傳 | 平台以事件形式保存完整歷史 |
| 工具執行 | 自己解析、執行、回填 | 內建工具在雲端沙盒執行；自訂工具仍由你的客戶端執行 |
| 沙盒 | 自己準備 | 平台提供隔離沙盒；企業認證使用者可在自己的主機執行 |
| 失敗復原 | 自己處理崩潰和斷線 | 平台自動接手恢復 |

安全控制有：獨立沙盒、網路存取控制、可隨時中止對話、執行過程可查、支援稽核匯出、依 agent 專案分開的用量報表。另有一個 Kimi Inference Hook，在每次模型推論前，用企業自己定的規則檢查輸入和工具回傳的內容。隱私和敏感資料會被擋在推論之前，這項功能只開放給企業認證使用者。

費用是按量計：模型推論的 token、沙盒執行時間、外掛呼叫次數。

兩條路的取捨很清楚：OCE 讓你掌握整個控制平面，但要自己維運。Kimi 替你維運 harness；就算把沙盒放到自己的主機上，模型呼叫、agent 編排和對話管理仍由 Kimi 的平台負責。

## 導入常駐 agent 前要先有的控制

不管用 OCE、Kimi 還是其他平台，把 OpenAI 的五類控制當成導入前的檢查清單：

| 控制 | 要問的問題 | 沒有的話會怎樣 |
|---|---|---|
| 分開可信與不可信 | 設定 agent 的元件，跟 agent 自己的執行環境，是不是分開的？ | agent 可以改掉管它的設定 |
| 硬性沙盒邊界 | 網路、檔案、程序、密鑰四個面向，各自限制了嗎？ | 一次提示注入就能把資料傳出去 |
| 模型審查 | 每個動作有沒有第二個模型先看過？人只看重要的核准嗎？ | 人被大量確認淹沒，開始無腦按同意 |
| agent 自己的身分 | 稽核紀錄分得出是 agent 還是人做的嗎？能單獨關掉它嗎？ | 出事時查不到是誰、也停不下來 |
| 全部記錄 | 設定變更和 agent 的每個回合都有紀錄嗎？誰看得到？ | 無法追查 agent 做錯了什麼 |

再加兩條 OpenAI 文章裡提到、但容易漏掉的：

- **憑證不只在環境變數裡**：從環境變數移除 token，不代表 agent 讀不到存在檔案裡的憑證。
- **紀錄本身也是敏感資料**：agent 的回合會包含它讀過的機密，紀錄的存取權要跟資料本身一樣嚴格。

## 適合誰、不適合誰

**適合：**
- 已經有 Kubernetes 和平台團隊、想自己掌握 agent 控制平面的公司。
- 內部已經有人在偷偷用 OpenClaw、IT 想把它收編管理的組織。
- 不想綁定單一模型或 harness 廠商的團隊。

**不適合：**
- 需要現在就上正式環境的公司：OCE 還在 1.0 之前，只建議內部試行。
- 沒有平台團隊維運的小公司：Kimi 這類託管服務、或 Autopilot 這類整合好的產品比較省事。
- 想要廠商支援合約的組織：OCE 是社群專案，要支援得找 Red Hat 這類合作夥伴。

OCE 可以在任何地方自架，沒有地區限制。

這一篇是路線二的最後一篇：企業在自己的基礎設施上管 agent。下一篇開始路線三，同一個開源核心，換成個人在自己的機器上跑：自架常駐 agent 怎麼選。

## 參考資料

- [OpenClaw Enterprise - The Open Agent Platform](https://openclaw.ai/blog/openclaw-enterprise)（OpenClaw，2026-09-29）
- [Securing persistent agents like OpenClaw at OpenAI](https://developers.openai.com/blog/securing-persistent-agents-like-openclaw-at-openai)（OpenAI Developers）
- [OpenClaw launches free enterprise control plane for persistent AI agents](https://venturebeat.com/orchestration/openclaw-launches-free-enterprise-control-plane-for-persistent-ai-agents-backed-by-openai-red-hat-and-nvidia)（VentureBeat，2026-09-29）
- ["Think of it as Kubernetes for agents"](https://thenewstack.io/openclaw-enterprise-kubernetes-agents/)（The New Stack，2026-09-30）
- [Why Red Hat is building an open foundation for enterprise agents with OpenClaw Enterprise](https://www.redhat.com/en/blog/why-red-hat-building-open-foundation-enterprise-agents-openclaw-enterprise)（Red Hat，2026-09-29）
- [The Rise of OpenClaw: AI's Fastest-Growing Open Source Project](https://www.nvidia.com/en-us/on-demand/session/gtcberlin26-sb61149/)（NVIDIA GTC Berlin 2026）
- [Kimi Hosted Agents 正式发布：Harness as a Service](https://www.kimi.com/news/kimi-hosted-agents)（Moonshot AI，2026-11-05，簡體中文）
- [产品概览](https://platform.kimi.com/docs/hosted-agents/overview)（Kimi 開放平台文件，簡體中文）
