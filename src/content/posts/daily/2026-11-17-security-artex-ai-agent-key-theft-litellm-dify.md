---
title: "資安警報｜AI Agent 自動獵金鑰——ARTEX 掃描 LiteLLM、Dify 等 AI App 竊取 Provider 金鑰"
date: 2026-11-17
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "Amazon 誘捕網路揭露 ARTEX agent 自動掃描 LiteLLM、One API、Dify、RAGFlow 等 AI 閘道與開發平台，竊取並驗證 AI provider API 金鑰，建立自我擴張的攻擊迴圈；Cloudflare、Microsoft、FBI 同週各自證實相關活動"
tldr: "Amazon MadPot 誘捕網路在 10/3–11/5 間截獲 ARTEX agent 的作戰紀錄：自動掃描 LiteLLM、One API、Dify、RAGFlow、Langflow 等暴露在網路上的 AI app，用預設密碼、CVE-2025-3248、CVE-2026-28797、isCliRequest 驗證繞過等弱點偷 AI provider 金鑰，驗證後丟進共用金鑰池再拿去跑更多攻擊。Cloudflare、Microsoft、FBI 同週各自證實相關活動，波及數百個目標。防禦：盤點暴露的 AI app、改預設密碼、補 CVE、幫 API token 設到期時間與 IP 限制。"
series:
  name: "AI Security Alert"
  order: 80
---

> 🌏 [English version](/posts/daily/2026-11-17-security-artex-ai-agent-key-theft-litellm-dify-en)

## 事件概述

Amazon 威脅情資團隊用名為 MadPot 的誘捕伺服器網路，在 2026 年 10 月 3 日到 11 月 5 日間截獲一批 AI agent 的「作戰記憶」——操作者下的指令與 agent 回報的執行結果。這些記錄顯示，攻擊者操作一支以 ARTEX（開源 agentic 滲透測試框架）為基礎的 agent，自動掃描暴露在網路上的 AI 閘道與開發平台（LiteLLM、One API、Dify、RAGFlow、Langflow 等），利用預設密碼、未修補 CVE、驗證繞過等弱點竊取 AI provider API 金鑰，驗證金鑰可用後丟進共用金鑰池，再拿這些金鑰跑的 AI 模型繼續找下一批金鑰。同一週，Cloudflare、Microsoft、FBI 各自發布的報告都證實了相關或重疊的攻擊活動，顯示這不是單一事件，而是一條已經規模化的攻擊鏈。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | AI 基礎設施弱點掃描 + API 金鑰竊取（Data Exfiltration） |
| 影響範圍 | 暴露在網路上的 LiteLLM、One API、New API、Veloera、Sub2API、Dify、FastGPT、Langflow、RAGFlow、Open WebUI、LobeChat、Ollama 等 AI 閘道與開發平台 |
| 嚴重程度 | High |
| CVE | CVE-2025-3248（Langflow，缺少身份驗證可遠端執行程式碼）、CVE-2026-28797（RAGFlow，Server-Side Template Injection） |
| 來源 | [The Hacker News](https://thehackernews.com/2026/11/amazon-uncovers-ai-agent-campaign.html)、[AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/)、[Cloudflare Blog](https://blog.cloudflare.com/adapting-to-ai-penetration-testing-orchestrators/) |

## 攻擊面分析

攻擊者給 ARTEX 一個目標和一個高層級目的，由 planner agent 把目的拆成任務，交給負責操作各種安全工具的 worker agent 執行，每一步要怎麼做則送去問一個 LLM。在這次「獵金鑰」戰役裡，agent 依循一份內建 playbook：先找出每種目標產品已知的「免密碼入口」——LiteLLM 的預設 master key、未完成初始化就被接管的安裝、Langflow 與 RAGFlow 的已知漏洞、One API 系列透過 `isCliRequest` header 的驗證繞過，以及散落在前端 JavaScript、source map、debug 路由、環境變數檔裡的金鑰。找到金鑰後先驗證是否可用，能用的就丟進共用金鑰池，再用這些金鑰跑的 AI 模型繼續搜尋 GitHub、npm、PyPI、容器映像層、paste 網站與 Telegram 頻道裡的下一批洩漏金鑰——整條鏈能自我供電，不需要攻擊者持續介入。

```diagram
title: ARTEX 自我供電的金鑰竊取循環
desc: 攻擊者操作的 ARTEX agent 掃描暴露的 AI app 偷金鑰、驗證後寫入共用金鑰池，再用池中金鑰呼叫 AI 模型規劃下一輪掃描與搜尋，金鑰池隨每一圈變大。
caption: 簡化示意：依 Amazon MadPot 誘捕網路截獲的作戰紀錄重建，實際行動涉及多個獨立操作者與工具，細節可能不完全一致。
step: 掃描暴露在網路上的 AI 閘道與開發平台，找已知弱點與預設密碼
step: 竊取金鑰並驗證是否可用，寫入共用金鑰池
step: 用池中金鑰呼叫 AI 模型，規劃下一輪掃描與搜尋任務
step: 到 GitHub、npm、paste 網站、Telegram 頻道搜尋更多洩漏的金鑰
step: 回到掃描更多暴露的 AI app，金鑰池比上一圈更大
---
<svg viewBox="0 0 640 420">
  <path class="dg-line" d="M412 59.1A200 170 0 0 1 516.6 179" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M517.3 238A200 170 0 0 1 415 359.6" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M228 360.9A200 170 0 0 1 123.4 241" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M122.7 182A200 170 0 0 1 225 60.4" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M428 210H390" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M320 238V348" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="228" y="12" width="184" height="56" rx="6"/>
    <text class="dg-label" x="320" y="31" text-anchor="middle" dominant-baseline="central">掃描暴露 AI App</text>
    <text class="dg-sub" x="320" y="51" text-anchor="middle" dominant-baseline="central">LiteLLM・Dify・RAGFlow</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="428" y="182" width="184" height="56" rx="6"/>
    <text class="dg-label" x="520" y="201" text-anchor="middle" dominant-baseline="central">竊取並驗證金鑰</text>
    <text class="dg-sub" x="520" y="221" text-anchor="middle" dominant-baseline="central">預設密碼・CVE・驗證繞過</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="228" y="352" width="184" height="56" rx="6"/>
    <text class="dg-label" x="320" y="371" text-anchor="middle" dominant-baseline="central">呼叫 AI 模型規劃</text>
    <text class="dg-sub" x="320" y="391" text-anchor="middle" dominant-baseline="central">用金鑰池裡的鑰</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="28" y="182" width="184" height="56" rx="6"/>
    <text class="dg-label" x="120" y="201" text-anchor="middle" dominant-baseline="central">搜尋更多洩漏金鑰</text>
    <text class="dg-sub" x="120" y="221" text-anchor="middle" dominant-baseline="central">GitHub・npm・Telegram</text>
  </g>

  <rect class="dg-box dg-box--store" x="254" y="182" width="132" height="56" rx="6"/>
  <text class="dg-label" x="320" y="201" text-anchor="middle" dominant-baseline="central">共用金鑰池</text>
  <text class="dg-sub" x="320" y="221" text-anchor="middle" dominant-baseline="central">每圈金鑰數量增加</text>

  <text class="dg-edge" x="408" y="194" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="330" y="295" text-anchor="start" dominant-baseline="central" data-step="3">呼叫</text>
</svg>
```

能成功的根本原因不是 AI 模型的弱點，而是一長串傳統的 AppSec 疏漏被 AI agent 用規模化、不間斷的方式同時掃過：預設或硬編碼的管理員密碼、未修補的已知 CVE、沒有驗證的管理介面與推論端點、留在前端程式碼與環境檔裡的機密。Cloudflare 的事件回應案例更指出,一個沒有到期時間、沒有 IP 限制的靜態 CI/CD API token 一旦外洩，攻擊者就能直接從雲端服務商環境跳進客戶的 Cloudflare 帳戶，一小時內發出 400 次資料庫傾印請求。Amazon 團隊的結論很直接：「這些攻擊手法沒有一個是新的，AI agent 改變的是攻擊者的速度與持續性。」

對應 OWASP LLM Top 10：**LLM02 Sensitive Information Disclosure**（金鑰散落在前端 JS、source map、debug 路由、`.env`）+ **LLM05 Supply Chain Vulnerabilities**（Langflow、RAGFlow 等上游元件的已知 CVE 未修補）。

## 防禦做法

**立即動作**
- 盤點對外暴露的 AI 閘道與開發平台（LiteLLM、One API、Dify、FastGPT、Langflow、RAGFlow、Open WebUI、LobeChat、Ollama 等），改掉所有預設管理員密碼（特別是 LiteLLM 的 default master key），確認沒有「安裝到一半」就曝光的實例
- 把 Langflow 升級到 1.3.0 以上修掉 CVE-2025-3248；RAGFlow 升到 0.25.0 以上，在沙箱中渲染 template 以緩解 CVE-2026-28797
- 搜尋設定檔、環境變數、部署腳本、CI/CD pipeline 與資料庫裡的硬編碼金鑰，持續掃描 repo 與容器映像層，一旦找到立刻輪換
- 幫 Cloudflare 等雲端服務的 API token 設定到期時間與用戶端 IP 限制；檢查帳戶裡是否有命名為 `artex-*`、`artex-pgrecon-*`、`artex-pgw-*`、`artex-do-*` 的 Worker script

**長期架構**
- 把 AI app、model gateway、推論端點當成一般生產系統管理：預設它們的機密會被快速找到，監看異常的用量或支出作為偵測訊號
- 導入 Protect AI 一類的 AI/ML 資產與弱點掃描工具，持續盤點 shadow AI app 與其暴露面
- 用 Noma Security 一類工具做 AI app 發現與金鑰／機密治理，避免內部團隊自建的 LiteLLM、Dify 實例變成無人管的暴露面
- 訂閱 Cisco Talos 的 ARTEX IOC 清單與 Snort 規則（7:76、7:77、7:78），把已知的攻擊端 IP 和行為特徵直接餵進防禦管線

## 影響範圍

Amazon 團隊通知了可能受影響的 AWS 客戶，但強調誘捕記錄只能看到攻擊者「想做什麼」，無法驗證攻擊者回報的戰果是否全部屬實。記錄涵蓋數百個目標，橫跨 AI app 平台與其他系統。FBI 的 FLASH 警示彙整了至少 11 份更早的報告，指出 ARTEX 自 8 月以來已被用於攻擊多個產業的組織，包括先前造成南韓金融機構約 6.7 萬人個資外洩的事件，以及 ConnectWise 供應鏈入侵。ARTEX 原始開發者在 10 月 8 日因濫用爭議下架了 GitHub repo，但社群 fork、封存版本與一個名為 ARTEX PRO 的商業版仍持續流通，意味著這條攻擊鏈短期內不會消失。

如果你的團隊內部有跑 LiteLLM、Dify 或任何 AI 閘道、AI app 建構平台，即便只是測試用途，也該假設它已經在被自動化掃描——這類平台因為集中管理多個 provider 的 API 金鑰，一旦有一個弱點就會一次性暴露所有上游服務的存取權。

## 今日收穫

這起事件最讓人在意的不是又一次 CVE 被利用,而是攻擊鏈本身會自我供電:偷到的金鑰直接拿去跑攻擊用的 AI 模型,找到更多金鑰。過去我們談 AI 供應鏈安全多半聚焦在「惡意套件偽裝」,但這次顯示另一條路——合法、常見的 AI 基礎設施(閘道、開發平台)本身就是高價值目標,因為它們天生就是「金鑰的金鑰」,一個管理頁面的弱點能連帶暴露背後所有 provider 的存取權。

## 參考資料

- [Amazon Uncovers AI Agent Campaign Targeting LiteLLM, Dify, and Other Apps for API Keys — The Hacker News](https://thehackernews.com/2026/11/amazon-uncovers-ai-agent-campaign.html)
- [Amazon Threat Intelligence observes threat actors running cybercrime campaigns with ARTEX AI agents — AWS Security Blog](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/)
- [Adapting to AI penetration-testing orchestrators — Cloudflare Blog](https://blog.cloudflare.com/adapting-to-ai-penetration-testing-orchestrators/)
- [Threat actors use agentic AI tooling to find and abuse exposed secrets — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/)
- [ARTEX AI Agents Used in Credential Theft & KYC Deepfake Campaigns — Aviatrix Threat Research](https://aviatrix.ai/threat-research-center/artex-ai-agents-credential-theft-kyc-deepfake-2026/)
- [Langflow 1.3.0 Release Notes（CVE-2025-3248 修補）— GitHub](https://github.com/langflow-ai/langflow/releases/tag/1.3.0)
- [RAGFlow Security Advisory GHSA-vvwj-fvwh-4whx（CVE-2026-28797）— GitHub](https://github.com/infiniflow/ragflow/security/advisories/GHSA-vvwj-fvwh-4whx)
