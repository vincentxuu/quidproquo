---
title: "資安警報｜SGLang RCE 攻破 NEAR AI 機密推理環境，波及 18 個 Agent 與約 100 名使用者"
date: 2026-11-20
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "攻擊者利用開源推理引擎 SGLang 的 RCE 漏洞，攻入 NEAR AI 跑在機密運算環境裡的推理伺服器，讀到約 100 名使用者帳號資料與 18 個舊版 Agent 的對話紀錄，當天該伺服器處理的機密模式請求也可能遭窺視。"
tldr: "攻擊者於 2026-11-08 利用 SGLang 的 RCE 漏洞，在 NEAR AI 一台推理伺服器上取得程式碼執行權，進而讀到約 100 名使用者的帳號資料、18 個舊版 Agent 的對話紀錄，2 組 API 金鑰因寫入日誌外洩；當天在該伺服器上處理的機密模式請求理論上也可能被看到。NEAR AI 未公開具體 CVE，SGLang 今年已有多個未修補漏洞。防禦：自架 SGLang 的團隊立即限制管理端點對外曝露、關閉 pickle IPC，使用機密推理服務的人則該去跟供應商要修補進度與憑證版本證明。"
series:
  name: "AI Security Alert"
  order: 83
---

> 🌏 [English version](/posts/daily/2026-11-20-security-sglang-rce-near-ai-confidential-inference-breach-en)

## 事件概述

NEAR AI 在 2026-11-09 發布事件報告，確認攻擊者於前一天（11-08）利用開源推理引擎 SGLang 的一個遠端程式碼執行（RCE）漏洞，在該公司一台推理伺服器上取得程式碼執行權，並藉此進入內部系統。攻擊者讀到了已棄用的 Private Chat 舊系統背後約 100 名使用者的帳號資料（email、姓名，部分帳號含方案與餘額資訊），並存取了 18 個跑在機密運算（TEE）環境之外的舊版 NEAR AI Agent，取走其對話紀錄、設定與日誌；另有 2 組客戶的 NEAR AI Cloud API 金鑰因寫入日誌而外洩，已被撤銷。更值得注意的是，SGLang 本身就跑在 TEE 內，攻擊者取得的程式碼執行權讓他們理論上也能看到當天在那台伺服器上處理的請求內容——包括本該受機密運算保護的機密模式請求。The Hacker News、The Block、Decrypt、Cloud Security Alliance 等至少 5 家獨立媒體與研究機構分別報導並交叉確認了這起事件。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Remote Code Execution（開源推理引擎 SGLang 漏洞，攻陷機密運算推理伺服器並橫向移動） |
| 影響範圍 | NEAR AI Cloud 機密推理服務單一推理伺服器；約 100 名使用者帳號資料、18 個未跑在 TEE 內的舊版 NEAR AI Agent、2 組 Cloud API 金鑰 |
| 嚴重程度 | High（已確認的資料外洩規模有限且已通知受影響使用者，但攻擊打破了「機密運算能擋住所有人」的信任假設） |
| CVE | 未公開（NEAR AI 未指認所利用的具體漏洞；CERT/CC 今年 7 月公開 SGLang 六個未修補漏洞，當中三個可達成 RCE，尚無法確認是否為同一個） |
| 來源 | [NEAR AI 官方事件報告](https://near.ai/blog/security-incident-report-sglang-vulnerability)、[The Hacker News](https://thehackernews.com/2026/11/sglang-rce-exploit-breaches-near-ai.html)、[Cloud Security Alliance 研究筆記](https://labs.cloudsecurityalliance.org/research/csa-research-note-confidential-ai-inference-tee-limits-20261/) |

## 攻擊面分析

攻擊者的切入點是 SGLang——NEAR AI 用來跑推理工作負載的開源引擎。SGLang 本身跑在受 AMD SEV-SNP 或 Intel TDX 保護的機密虛擬機（CVM）裡，理論上應該連雲端業者自己都看不到裡面在處理什麼。但 NEAR AI 的事件報告講得很直接：「機密運算保護資料不被業者和主機看到，但它無法防止跑在這個環境裡的軟體本身有漏洞」。攻擊者利用 SGLang 的 RCE 漏洞，在推理伺服器內部取得程式碼執行權之後，就擁有和這台伺服器上正常運作的推理服務一樣的視角——能看到當天（11-08）那台伺服器正在處理的請求，包括送進機密模式、本該連 NEAR AI 自己都看不到的請求。NEAR AI 沒有證實攻擊者實際讀取了哪些機密請求的內容，只承認「有可能被觀察到」。

拿到立足點後，攻擊者沒有停在那台伺服器裡，而是橫向移動進到公司內部其他系統，一路摸到已棄用但尚未清理乾淨的 Private Chat 後端，撈走約 100 名使用者的帳號資料；另外還碰到了 18 個跑在舊版部署、不在 TEE 保護範圍內的 Agent，取走其對話紀錄、設定與日誌。過程中有 2 組客戶的 API 金鑰因為被寫進日誌而一併外洩。Cloud Security Alliance 的分析指出，這種橫向移動的範圍顯示「被攻陷的機密工作負載當時持有的憑證或網路連線，延伸到了它自己這台機密 VM 之外」——也就是說，問題不只是 SGLang 有漏洞，而是這台跑著敏感工作負載的伺服器,原本就不該有能力直接摸到 Private Chat 這類不相關的內部系統。

NEAR AI 沒有公開具體 CVE 編號，媒體報導也沒能把這起事件連到某個已知漏洞。但背景脈絡值得留意：CERT/CC 在 2026-07-30 發布的 VU#281278 一次公開了 SGLang 六個漏洞，其中包含透過 `/load_lora_adapter_from_tensors` 端點做 pickle 反序列化達成未授權 RCE（CVE-2026-15969）、透過 `/server_info` 洩漏 API 金鑰（CVE-2026-15977）等。CERT/CC 表示當時與 SGLang 維護者協調未果，到 11-16 為止，公開漏洞資料庫顯示 CVE-2026-15969 仍沒有修補版本。這起事件對應到 OWASP LLM Top 10 的 **LLM05 Supply Chain Vulnerabilities**：問題根源是服務商仰賴的開源推理引擎本身帶著未修補的已知漏洞類別；同時也沾上 **LLM06 Sensitive Information Disclosure**，因為被攻陷的正是本應隔離機密請求內容的那一層。

```diagram
title: SGLang RCE 如何讓攻擊者攻入 NEAR AI 的機密推理環境
desc: 攻擊者於 2026-11-08 利用 SGLang 的 RCE 漏洞，在一台跑在機密運算環境裡的推理伺服器上取得程式碼執行權。由於機密運算無法防止環境內軟體自身的漏洞，攻擊者不只能看到當天該伺服器處理的請求，還進一步橫向移動，讀到使用者帳號資料與舊版 Agent 的資料。
caption: 依 NEAR AI 官方事件報告與 Cloud Security Alliance 研究筆記整理。
step: 2026-11-08 攻擊者利用 SGLang 的 RCE 漏洞
step: 在一台推理伺服器上取得程式碼執行權
step: TEE 防不住內部軟體本身的漏洞，當日機密模式請求理論上可能遭窺視
step: 橫向移動，進入已棄用的 Private Chat 舊系統
step: 讀取約 100 名使用者帳號資料，另存取 18 個未跑在 TEE 內的舊版 Agent
step: 2 組客戶 API 金鑰因寫入日誌一併外洩
---
<svg viewBox="0 0 760 596">
  <path class="dg-line" d="M400 88V128" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M400 188V228" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M400 288V328" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M400 388V428" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M400 488V528" marker-end="url(#arrow-accent)" data-step="5"/>

  <g data-step="1">
    <rect class="dg-box" x="280" y="32" width="240" height="56" rx="6"/>
    <text class="dg-label" x="400" y="51" text-anchor="middle" dominant-baseline="central">攻擊者利用 SGLang 的 RCE 漏洞</text>
    <text class="dg-sub" x="400" y="71" text-anchor="middle" dominant-baseline="central">開源推理引擎，CVE 未公開</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="260" y="132" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="151" text-anchor="middle" dominant-baseline="central">在一台推理伺服器取得程式碼執行權</text>
    <text class="dg-sub" x="400" y="171" text-anchor="middle" dominant-baseline="central">該伺服器跑在 NEAR AI 的 TEE 內</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="220" y="232" width="320" height="56" rx="6"/>
    <text class="dg-label" x="400" y="251" text-anchor="middle" dominant-baseline="central">TEE 防不住內部軟體自身的漏洞</text>
    <text class="dg-sub" x="400" y="271" text-anchor="middle" dominant-baseline="central">當日機密模式請求理論上可能遭窺視</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="260" y="332" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="351" text-anchor="middle" dominant-baseline="central">橫向移動進入內部系統</text>
    <text class="dg-sub" x="400" y="371" text-anchor="middle" dominant-baseline="central">深入已棄用的 Private Chat 舊系統</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="180" y="432" width="440" height="56" rx="6"/>
    <text class="dg-label" x="400" y="451" text-anchor="middle" dominant-baseline="central">讀取約 100 名使用者帳號資料</text>
    <text class="dg-sub" x="400" y="471" text-anchor="middle" dominant-baseline="central">另存取 18 個舊版 Agent 的對話與設定</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--accent" x="260" y="532" width="280" height="56" rx="6"/>
    <text class="dg-label" x="400" y="551" text-anchor="middle" dominant-baseline="central">2 組 API 金鑰寫入日誌後外洩</text>
    <text class="dg-sub" x="400" y="571" text-anchor="middle" dominant-baseline="central">已撤銷</text>
  </g>
</svg>
```

## 防禦做法

**立即動作**
- 自架 SGLang 的團隊先盤點所有部署，確認 SGLang 的 HTTP／IPC 介面沒有直接暴露在不受信任的網路上；依 CERT/CC 建議把 `SGLANG_USE_PICKLE_IPC` 設為 `false`，同時設定使用者 API key **與**管理 API key 兩層，並在 proxy 層擋掉或關閉 `/server_info` 端點，避免金鑰透過它洩漏
- 若是 NEAR AI Cloud 的客戶，先確認是否收到官方通知；收到通知的使用者應假設帳號資料或 agent 資料已外洩，並依指示處理，沒收到通知者則不需要額外動作
- 不管有無收到通知，建議檢查曾經傳給 NEAR AI（或任何推理服務商）的 API 金鑰是否出現在自己端的日誌裡，一併輪替
- 對於任何送進「機密模式」或標榜機密運算的推理服務，重新檢視哪些工作負載實際跑在 TEE 保護範圍內——NEAR AI 這次外洩的 18 個 Agent 恰好是「不在 TEE 內」的舊版部署，使用者未必知道自己用的是哪一種

**長期架構**
- 把推理引擎本身（SGLang、vLLM 等）當成信任運算基底（TCB）的一部分來稽核，不要只稽核「模型安不安全」——CERT/CC 點名的多個漏洞都出在動態載入 LoRA adapter、更新權重這類會反序列化外部輸入的功能
- 機密運算節點應採最小權限：持有的憑證和能連到的內部系統範圍都該限縮在自己的職責內，避免像這次一樣,一台推理伺服器被攻陷後還能摸到完全不相關的 Private Chat 舊系統
- 檢查日誌管線，確保 API 金鑰、prompt、completion 不會被寫進日誌——這次兩組客戶金鑰外洩就是栽在日誌裡
- 採購或續約機密運算／機密推理服務時，把供應商的修補節奏、TCB 版本透明度、事件揭露做法一併列入評估，而不是只看「有沒有 TEE」這個功能清單；需要稽核 ML 供應鏈（包含自架或委外的推理引擎）時，可參考 Protect AI 這類涵蓋 ML 套件與推理堆疊掃描的工具

## 影響範圍

NEAR AI 偵測後的處置算是迅速：撤銷所有 active session 與管理憑證、更換所有 agent token、把 Private Chat 整個下線、在所有推理伺服器上部署 SGLang 修補、完成剩餘憑證輪替與完整鑑識審查，並已將漏洞回報給 SGLang 專案。NEAR AI Cloud 服務已恢復，受影響的約 100 名使用者與 18 個 Agent 的擁有者也已個別收到通知。但這起事件留下兩個沒有答案的問題：一是攻擊者實際利用的是哪一個 SGLang 漏洞，NEAR AI 沒有公開，SGLang 本身今年累積的未修補漏洞也不只一個；二是當天那台伺服器處理的機密模式請求究竟有沒有被看過——NEAR AI 的措辭是「可能被觀察到」，而不是「確認未被讀取」。如果你的系統仰賴任何標榜機密運算的推理服務，這起事件代表你該主動去問供應商:他們的推理引擎多久沒更新、修補節奏如何,而不是假設貼了「機密運算」標籤就等於資料絕對安全。

## 今日收穫

這次之前對「機密運算」的理解有個漏洞:以為只要跑在 TEE 裡,資料就連服務商自己都看不到,安全性是「硬體層級」保證。但這起事件說得很清楚——TEE 只防「外面」(主機、業者、雲端操作者),不防「裡面」(跑在這個隔離環境裡的軟體本身有沒有漏洞)。對 agent 系統來說,這代表推理引擎、SDK 這類你拿來「蓋」agent 的底層元件,其安全性不會因為外面包了一層機密運算或 TEE 就被豁免——反而因為大家對這層標籤有過度信任,一旦裡面的軟體出包,影響可能比沒有 TEE 的系統更難被及時發現。

## 參考資料

- [Security Incident Report: SGLang Vulnerability — NEAR AI 官方部落格](https://near.ai/blog/security-incident-report-sglang-vulnerability)
- [SGLang RCE Exploit Breaches NEAR AI, Steals Data From 18 Agents and About 100 Users — The Hacker News](https://thehackernews.com/2026/11/sglang-rce-exploit-breaches-near-ai.html)
- [Confidential AI Under Pressure: SGLang RCE and SEV-SNP Attacks — Cloud Security Alliance](https://labs.cloudsecurityalliance.org/research/csa-research-note-confidential-ai-inference-tee-limits-20261/)
- [VU#281278: SGLang Contains Six Different Vulnerabilities Including RCE, Data Exfiltration, and Credential Disclosure — CERT/CC](https://kb.cert.org/vuls/id/281278)
- [NEAR AI says SGLang vulnerability exposed user account details in security breach — The Block](https://www.theblock.co/news/defi/2026-11-10-near-ai-security-breach-437002)
- [AI Infrastructure Keeps Getting Attacked — NEAR AI's SGLang Breach Is Just the Latest Warning — Security Boulevard](https://securityboulevard.com/2026/11/ai-infrastructure-keeps-getting-attacked-near-ais-sglang-breach-is-just-the-latest-warning/)
