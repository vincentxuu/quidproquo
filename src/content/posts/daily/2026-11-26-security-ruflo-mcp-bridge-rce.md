---
title: "資安警報｜Ruflo MCP Bridge 零認證遠端程式碼執行，攻擊者可竊取金鑰並長期操控 Agent 輸出（CVE-2026-59726）"
date: 2026-11-26
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "資安研究公司 Noma Security 發現開源 AI agent 協調平台 Ruflo 的 MCP Bridge 預設無認證對外開放，一個 HTTP 請求即可在容器內取得 shell、竊取所有 LLM API 金鑰，還能毒化 AgentDB 學習庫持續操控該實例未來的 agent 輸出（CVE-2026-59726）。"
tldr: "Noma Security 發現 Ruflo（前身 Claude Flow，GitHub 8 萬+ star）的 docker-compose 預設把 MCP Bridge 233 個工具開在 0.0.0.0:3001 且零認證，單一請求即可執行任意 shell 指令、竊取全部 LLM 供應商金鑰，還能毒化 AgentDB 讓同一實例未來所有 agent 輸出被攻擊者操控——升級到修補版也清不掉已被植入的毒化資料，必須手動稽核清除。"
series:
  name: "AI Security Alert"
  order: 87
---

> :globe: [English version](/posts/daily/2026-11-26-security-ruflo-mcp-bridge-rce-en)

## 事件概述

資安研究公司 Noma Security（旗下 Noma Labs）於 2026-07-29 發布研究報告，指出開源 AI agent 協調平台 **Ruflo**（前身為 Claude Flow，GitHub 上有 8 萬以上星數、MCPMarket 排名第二）的 **MCP Bridge** 存在零認證的遠端程式碼執行漏洞。MCP Bridge 是 Ruflo 內建的 Express.js 伺服器，負責處理所有透過 Model Context Protocol 送出的工具呼叫，一次性暴露 233 個工具，涵蓋 shell 存取、資料庫操作、agent 管理與記憶儲存——幾乎是整個平台的神經中樞。Ruflo 預設的 `docker-compose.yml` 把這個 bridge 與內部 MongoDB 都綁定在 `0.0.0.0`（所有網路介面），且 `POST /mcp` 端點完全不檢查任何 token 或標頭。研究人員 Eli Ainhorn 用單一一個未經認證的 HTTP 請求呼叫 `terminal_execute` 工具，就在容器內取得 `node` 使用者的 shell，隨後串接出完整的 8 步驟攻擊鏈：竊取所有 LLM 供應商金鑰、用受害者的金鑰與運算資源啟動攻擊者控制的 agent swarm、毒化 AgentDB 學習庫讓該實例未來所有 agent 輸出被操控、從無認證的 MongoDB 竊取對話紀錄，最後植入開機自啟動的 backdoor。Ruflo 團隊於 2026-06-30 收到通報後幾小時內完成修補，3.16.3 版於 7 月 1 日上線，[安全公告 GHSA-c4hm-4h84-2cf3](https://github.com/ruvnet/ruflo/security/advisories/GHSA-c4hm-4h84-2cf3) 與 [CVE-2026-59726](https://www.cve.org/CVERecord?id=CVE-2026-59726) 則在 2026-11-24 才正式公開，兩者相距近 5 個月。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Unauthenticated RCE / Privilege Escalation + AI Memory Poisoning（MCP 端點零認證取得 shell，再串連金鑰竊取與 agent 學習庫毒化） |
| 影響範圍 | 自架（self-hosted）Ruflo docker-compose 聊天堆疊（Chat UI、MCP Bridge、nginx、MongoDB）的 3.16.3 之前版本；僅以 stdio 本機跑 Ruflo CLI 不在此風險範圍內 |
| 嚴重程度 | Critical（各方標示的 CVSS 分數不一致——Ruflo release note 寫 9.8，Noma Labs 與 i10x 報導寫 10.0，但兩者皆為最高嚴重等級） |
| CVE | [CVE-2026-59726](https://www.cve.org/CVERecord?id=CVE-2026-59726) |
| 來源 | [Noma Security 研究報告](https://noma.security/noma-labs/rufroot-the-mcp-bridge-vulnerability-that-turns-agents-into-rogue-admins-cve-2026-59726)、[GitHub Security Advisory GHSA-c4hm-4h84-2cf3](https://github.com/ruvnet/ruflo/security/advisories/GHSA-c4hm-4h84-2cf3)、[CVE.org 記錄](https://www.cve.org/CVERecord?id=CVE-2026-59726)、[i10x.ai 報導](https://i10x.ai/news/ruflo-mcp-bridge-unauthenticated-shell-api-keys-agentdb-poisoning) |

## 攻擊面分析

攻擊起點是 MCP 協定本身的信任模型：Ruflo 的 MCP Bridge 把 `tools/call` 請求直接丟給 `executeTool()` 執行，中間沒有任何認證層。平台確實有一份命令黑名單（`AUTOPILOT_BLOCKED_PATTERNS`）會擋掉危險操作，但黑名單只在 autopilot 聊天流程裡生效，`/mcp` 與 `/mcp/:group` 這兩個外部可直接呼叫的路由完全繞過它。因此攻擊者只需要知道目標的 IP 與預設埠 3001，呼叫 `terminal_execute` 工具，就能在 bridge 容器裡以 `node`（UID 1000）身分跑任意 shell 指令——Noma Labs 用 OAST（out-of-band）callback 到 Burp Collaborator 驗證了這一步可重現，但完整的指令與酬載細節未在此公開。

取得容器內執行權之後，剩下的步驟都是對同一個無認證端點做更多次呼叫：docker-compose 把所有 LLM 供應商金鑰（OpenAI、Anthropic、Google、OpenRouter 等）以環境變數注入容器，而子處理程序透過 `{ ...process.env }` 繼承完整環境，等同於把金鑰直接攤在攻擊者面前；拿到金鑰與運算額度後，攻擊者可呼叫 `swarm_init`、`agent_spawn` 用受害者的帳單啟動自己的 agent swarm。更進一步的是 `agentdb_pattern-store` 工具——它讓攻擊者把惡意「模式」寫進 Ruflo 的學習管線，範例是偽造一條 SOC2 合規政策，指示 AI 在所有產生的部署腳本裡夾帶攻擊者控制的網址，此後該實例所有使用者的後續對話都會產出被操控的內容，使用者完全無法察覺。同一條網路上還有一個無認證的 MongoDB（連埠 27017），可直接安裝 client 傾出全部對話紀錄並外傳；最後透過寫入 `/app/beacon.js` 並在 `index.js` 中以 `require()` 掛載、搭配 Docker 的 `restart: unless-stopped` 政策，攻擊者能讓後門在容器被殺掉後自動復活。

對應 OWASP LLM Top 10：**LLM06 Excessive Agency**（MCP Bridge 把 233 個工具——包含任意 shell 執行——直接暴露在網路上，且實際的授權檢查只做在使用者看得到的聊天介面，沒有做在所有工具真正的呼叫路徑上）以及 **LLM04 Data and Model Poisoning**（`agentdb_pattern-store` 讓未經授權的呼叫者直接寫入 agent 的學習庫，而這個學習庫的輸出會被同一實例的所有使用者信任並採用）。這起事件也提醒一個容易被忽略的面向：MCP 的風險不只在「LLM 被騙著呼叫危險工具」，當整套工具呼叫端點本身可以被繞過 LLM 直接打到時，agent 安全就退化成一個普通但後果更嚴重的 Web API 認證問題。

```diagram
title: 未經認證的 MCP 請求如何讓 Ruflo 從零權限走到長期操控 Agent 輸出
desc: 攻擊者對公開的 Ruflo MCP Bridge 送出未經認證的工具呼叫，取得容器 shell 後依序竊取 LLM 金鑰、盜用運算資源、毒化 AgentDB 學習庫，最後植入可在修補後存活的後門。
caption: 依 Noma Security 研究報告與 GitHub 安全公告整理，省略可直接利用的具體酬載。
step: 攻擊者對公開的 MCP Bridge（0.0.0.0:3001）送出未經認證的工具呼叫請求
step: 呼叫 terminal_execute 工具，在容器內取得 node 使用者的 shell
step: 讀取容器環境變數，竊取 OpenAI／Anthropic／Google／OpenRouter 等 LLM 金鑰
step: 用竊得的金鑰與運算資源，啟動攻擊者控制的 agent swarm
step: 寫入 AgentDB pattern store 毒化學習庫，操控該實例未來所有 agent 輸出
step: 植入開機自啟動的 backdoor，升版修補也無法清除已毒化的資料
---
<svg viewBox="0 0 640 596">
  <path class="dg-line" d="M320 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M320 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M320 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M320 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M320 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="170" y="32" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="51" text-anchor="middle" dominant-baseline="central">送出未經認證的 MCP 工具呼叫</text>
    <text class="dg-sub" x="320" y="71" text-anchor="middle" dominant-baseline="central">目標：公開在 0.0.0.0:3001 的 Bridge</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="190" y="132" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="151" text-anchor="middle" dominant-baseline="central">terminal_execute 取得容器 shell</text>
    <text class="dg-sub" x="320" y="171" text-anchor="middle" dominant-baseline="central">以 node（UID 1000）身分執行</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="180" y="232" width="280" height="56" rx="6"/>
    <text class="dg-label" x="320" y="251" text-anchor="middle" dominant-baseline="central">讀取環境變數竊取 LLM 供應商金鑰</text>
    <text class="dg-sub" x="320" y="271" text-anchor="middle" dominant-baseline="central">OpenAI／Anthropic／Google／OpenRouter</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="190" y="332" width="260" height="56" rx="6"/>
    <text class="dg-label" x="320" y="351" text-anchor="middle" dominant-baseline="central">啟動攻擊者控制的 agent swarm</text>
    <text class="dg-sub" x="320" y="371" text-anchor="middle" dominant-baseline="central">用受害者的金鑰與運算額度計費</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="170" y="432" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="451" text-anchor="middle" dominant-baseline="central">毒化 AgentDB 學習庫</text>
    <text class="dg-sub" x="320" y="471" text-anchor="middle" dominant-baseline="central">操控該實例未來所有 agent 輸出</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="170" y="532" width="300" height="56" rx="6"/>
    <text class="dg-label" x="320" y="551" text-anchor="middle" dominant-baseline="central">植入開機自啟動的 backdoor</text>
    <text class="dg-sub" x="320" y="571" text-anchor="middle" dominant-baseline="central">升版修補無法清除已毒化的資料</text>
  </g>
</svg>
```

## 防禦做法

**立即動作**
- 檢查自家是否自架 Ruflo：`docker ps --format '{{.Names}} {{.Ports}}'`，若看到 `0.0.0.0:3001->3001` 或 `0.0.0.0:27017->27017` 就代表還在用有漏洞的預設設定
- 立即升級到 Ruflo 3.16.3 以上版本，並改用升級後的 `docker-compose.yml`——新版拒絕在沒有設定 `MONGO_INITDB_ROOT_PASSWORD` 的情況下啟動，對外公開則額外要求 `MCP_AUTH_TOKEN`
- 若過去曾暴露過 3001 或 27017 埠：立即輪換 OpenAI、Google、OpenRouter、Anthropic 等所有金鑰，並檢查各供應商的用量紀錄是否有不是自己發起的呼叫
- 稽核 AgentDB 的 pattern store（Ruflo 工作目錄下的 `.swarm/memory.db`），找出不是團隊成員寫入的模式，尤其是任何要求 agent 在輸出中加入額外網路呼叫、telemetry 或「合規」程式碼的條目——**升級修補版本本身不會清掉已被植入的毒化資料**，必須手動稽核與清除

**長期架構**
- 把任何 MCP server 的工具呼叫端點當成一般會碰敏感資源的 API 來對待：每個請求都要認證，預設只對外暴露必要的工具，非必要不要把 bridge 綁定到 `0.0.0.0`
- 不要只信任雲端防火牆或 security group：Docker 在許多 Linux 主機上會把發布的埠寫進 iptables，位置可能排在 ufw 規則之前，導致單靠 ufw 的拒絕規則無效，實際要用雲端安全群組或直接綁定 `127.0.0.1` 才可靠
- 檢視子處理程序是否真的需要繼承完整環境變數——Ruflo 修補後仍把整組金鑰傳給每個工具後端（per-backend key scoping 仍是後續工作項），這代表「補丁上線」不等於「金鑰暴露面歸零」，防護要看被攻陷的工具處理程序實際能碰到什麼
- 對會寫入 agent 學習或記憶儲存（如 AgentDB、向量記憶庫）的工具額外設定寫入權限門檻，不要讓任何能打到 MCP 端點的呼叫者都能無條件影響未來輸出；可參考 Noma Security、WitnessAI 等 watchlist 中專注在 agentic AI 安全的廠商做盤點

## 影響範圍

Ruflo 的 npm 套件在 2026-11-23 當週有 6.2 萬次 `ruflo`、10.3 萬次 `@claude-flow/cli` 與 1.3 萬次 `claude-flow` 下載，但這只反映 CLI 使用量，沒有人公開統計過實際對外暴露的 Docker Bridge 數量；安全公告本身也沒有提到已被野外利用的證據。漏洞實際存在的時間窗很長——3.16.3 修補版自 2026-07-01 上線到 CVE 於 11-24 正式公開，中間有近 5 個月沒有可供掃描工具（如 npm audit、Dependabot）比對的 CVE 編號，代表這段期間唯一的警示只有專案自己的 release note。風險範圍也有明確邊界：公告描述的是自架的 docker-compose 聊天堆疊，單純把 Ruflo 當 stdio 本機 MCP server 在 Claude Code 裡跑的使用情境不在此次攻擊鏈內，但安全公告的作者也特別註明「CLI 預設綁定 localhost」這點仍是待確認事項，尚未完全排除風險。如果你的 agent 基礎設施也採用類似「self-hosted MCP bridge + 持久學習庫」的架構，這起事件的重點不是這一個漏洞本身，而是「修補只解決存取控制，不解決已經發生的資料毒化」——任何涉及 agent 記憶或學習管線的入侵事件，都需要把資料清查納入事後處理的必要步驟，不能只靠升版了事。

## 今日收穫

這起事件把「MCP 安全」拆成了兩個完全不同層級的問題：一個是傳統的 Web API 認證缺失（任何人都能呼叫工具），另一個是只有 agent 系統才有的新風險——一旦攻擊者能寫入 agent 賴以學習或記憶的儲存層，光是把漏洞本身補好完全不夠，因為被毒化的資料會繼續在「看起來正常運作」的系統裡,持續影響所有使用者之後的輸出。換句話說，agent 系統的事後處理（incident response）清單裡，「資料完整性稽核」要跟「修補漏洞」並列為必要項目，不是漏洞修完就結案。

## 參考資料

- [RufRoot: The MCP Bridge Vulnerability That Turns Agents Into Rogue Admins (CVE-2026-59726) — Noma Security](https://noma.security/noma-labs/rufroot-the-mcp-bridge-vulnerability-that-turns-agents-into-rogue-admins-cve-2026-59726)
- [Unauthenticated RCE in ruflo MCP bridge default docker-compose deployment — GitHub Security Advisory GHSA-c4hm-4h84-2cf3](https://github.com/ruvnet/ruflo/security/advisories/GHSA-c4hm-4h84-2cf3)
- [CVE Record: CVE-2026-59726 — CVE.org](https://www.cve.org/CVERecord?id=CVE-2026-59726)
- [Release v3.16.3 — Security release — GitHub](https://github.com/ruvnet/ruflo/releases/tag/v3.16.3)
- [Ruflo MCP bridge flaw handed out shells and AI keys; a patch won't undo poisoning — i10x.ai](https://i10x.ai/news/ruflo-mcp-bridge-unauthenticated-shell-api-keys-agentdb-poisoning)
