---
title: "資安警報｜瑞士官方首次證實 AI agent 自主滲透工具入侵關鍵基礎設施，5 起攻擊 4 起得手"
date: 2026-11-28
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "瑞士國家網路安全中心（NCSC）證實境內首批由 AI agent 協助發動的網路攻擊，5 起確認案例中 4 起成功入侵，3 起目標為關鍵基礎設施營運商、其中 2 起得手；義大利、英國同週也發出同類型警告。"
tldr: "瑞士 NCSC 於 11/24–26 證實境內首批「Agentic Offensive Framework」攻擊：5 起確認案例、4 起成功入侵 IT 系統，3 起目標是電力／水／電信等關鍵基礎設施營運商、其中 2 起得手，可對外連網的攻擊工具數量自 10 月起幾乎翻倍。義大利 CSIRT、英國 NCSC 同一週也各自發出同類型警告，三國官方觀察一致：攻擊者用的仍是弱密碼、已知漏洞、裸露在外的系統，AI 只是把人力需要數天的流程壓縮到數小時。防禦重點不是修補某個 AI 漏洞，而是縮小對外暴露面、24 小時內上修補、強制 MFA，並建立行為式異常偵測。"
series:
  name: "AI Security Alert"
  order: 89
---

> :globe: [English version](/posts/daily/2026-11-28-security-switzerland-critical-infrastructure-agentic-attack-en)

## 事件概述

瑞士國家網路安全中心（NCSC，德文全稱下轄於聯邦網路安全辦公室 BACS）於 2026 年 11 月 24 日發布官方公告，證實境內首批「借助 AI agent 發動」的網路攻擊——攻擊者使用官方稱為「Agentic Offensive Framework」（攻勢性自主框架）的工具，自主尋找弱點、選擇攻擊工具、評估結果並規劃下一步，全程幾乎不需人力介入。NCSC 主任 Florian Schütz 於 11/26 接受公視 SRF 專訪時更新數字：目前共有 5 起確認案例，其中 4 起成功入侵受害者的 IT 系統；3 起目標是電力、飲用水、電信等關鍵基礎設施營運商，其中 2 起得手。受害組織未被點名，攻擊者身分也尚未歸因。值得注意的是，公告發布時（11/24）NCSC 的原文是「NCSC 已知的每一起攻擊都成功入侵」，到 11/26 專訪數字變成「5 起中 4 起成功」——The Hacker News 指出官方並未解釋這個落差從何而來，讀者應以最新的 5 起/4 起數字為準。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Agentic AI 攻擊工具武器化（跨國政府機關同週示警） |
| 影響範圍 | 瑞士至少 5 個組織，3 起目標為電力／飲用水／電信等關鍵基礎設施營運商 |
| 嚴重程度 | High（政府機關層級首次正式確認，非單一軟體漏洞） |
| CVE | 無（攻擊鏈由弱密碼、已知軟體漏洞、裸露於網際網路的系統組合而成，非單一 CVE） |
| 來源 | [瑞士 NCSC 官方公告](https://www.bacs.admin.ch/en/26-ki-agenten-1-en)、[The Hacker News](https://thehackernews.com/2026/11/switzerland-confirms-ai-assisted.html)、[Security Affairs](https://securityaffairs.com/204004/hacking/switzerland-confirms-first-ai-agent-cyberattacks-on-local-organisations.html)、[SwissInfo](https://www.swissinfo.ch/eng/swiss-ai/switzerland-reports-first-ai-based-cyberattacks-on-critical-infrastructure/92440400) |

## 攻擊面分析

NCSC 公告描述的攻擊路徑並不神秘：這些「Agentic Offensive Framework」利用的仍是老問題——標準密碼或容易猜中的密碼、軟體已知漏洞、連上網際網路但未妥善防護的系統。AI agent 改變的不是漏洞本身，而是尋找與利用這些漏洞的**速度與持續性**：agent 能自主掃描找出脆弱系統、選擇合適的攻擊工具、評估攻擊結果，遇到防禦機制擋下來就立刻切換其他已知手法，整套流程只需人力所需時間的一小部分，也讓防禦方偵測與回應的時間窗口被大幅壓縮。NCSC 同時指出，可透過網際網路存取的此類工具（公告具名列出 ARTEX、CyberStrikeAI 兩個先前已在本系列多次報導的開源 agentic 滲透框架）數量自 2026 年 10 月以來已幾乎翻倍。

```diagram
title: Agentic Offensive Framework 的自主攻擊迴圈
desc: 攻擊者對準連上網際網路的目標系統後，agent 在掃描弱點、選擇工具、執行攻擊、換手法之間自主循環，遇到防禦機制會立即切換其他已知手法重試，直到得手或被偵測。
caption: 簡化示意：依瑞士 NCSC 公告描述的 Agentic Offensive Framework 運作模式重建，實際攻擊鏈細節未公開。
step: 攻擊者對準連上網際網路的目標系統
step: Agent 自主掃描找出標準密碼、已知漏洞等既有弱點，寫入累積的攻擊路徑情資
step: Agent 從累積情資選擇攻擊工具與手法，執行攻擊並自主評估結果
step: 遇到防禦機制擋下時，立即切換其他已知手法重試，不需人力介入
step: 回到目標系統持續嘗試，直到得手或被偵測
---
<svg viewBox="0 0 440 392">
  <path class="dg-line" d="M280 56.3A152 152 0 0 1 368.8 165.1" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M369.4 224A152 152 0 0 1 282.7 334.4" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M160 335.7A152 152 0 0 1 71.2 226.9" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M70.6 168A152 152 0 0 1 157.3 57.6" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--dashed" d="M312 196H276" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--dashed" d="M220 224V316" marker-end="url(#arrow)" data-step="3"/>

  <g data-step="1 5">
    <rect class="dg-box" x="160" y="16" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="35" text-anchor="middle" dominant-baseline="central">目標系統</text>
    <text class="dg-sub" x="220" y="55" text-anchor="middle" dominant-baseline="central">暴露於網路</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="312" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="372" y="187" text-anchor="middle" dominant-baseline="central">掃描弱點</text>
    <text class="dg-sub" x="372" y="207" text-anchor="middle" dominant-baseline="central">密碼・已知漏洞</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="160" y="320" width="120" height="56" rx="6"/>
    <text class="dg-label" x="220" y="339" text-anchor="middle" dominant-baseline="central">選工具攻擊</text>
    <text class="dg-sub" x="220" y="359" text-anchor="middle" dominant-baseline="central">自主評估結果</text>
  </g>

  <g data-step="4">
    <rect class="dg-box" x="8" y="168" width="120" height="56" rx="6"/>
    <text class="dg-label" x="68" y="187" text-anchor="middle" dominant-baseline="central">遇防禦換手法</text>
    <text class="dg-sub" x="68" y="207" text-anchor="middle" dominant-baseline="central">回選工具重試</text>
  </g>

  <rect class="dg-box dg-box--store" x="168" y="168" width="104" height="56" rx="6"/>
  <text class="dg-label" x="220" y="187" text-anchor="middle" dominant-baseline="central">攻擊路徑情資</text>
  <text class="dg-sub" x="220" y="207" text-anchor="middle" dominant-baseline="central">持續累積</text>

  <text class="dg-edge" x="292" y="182" text-anchor="middle" dominant-baseline="central" data-step="2">寫入</text>
  <text class="dg-edge" x="230" y="270" text-anchor="start" dominant-baseline="central" data-step="3">讀取</text>
</svg>
```

這類事件不容易對應到 OWASP LLM Top 10 的單一條目——受害的不是某個企業自己部署的 LLM 應用被注入或奪權，而是攻擊者把 agentic AI 直接當成攻擊基礎設施使用，比較接近 MITRE ATT&CK 的 **T1588.007 Obtain Capabilities: Artificial Intelligence**（取得並運用 AI 能力作為攻擊工具）。這個戰術類別本系列已多次見到同一批工具的身影：ARTEX 曾被用於攻擊南韓銀行（本系列 2026-10-08）與 Storm-0940 的 ConnectWise 供應鏈攻擊（2026-10-24），這次瑞士案例再次確認「同一類工具、不同受害國家與產業」正在成為常態，而不是單一事件。

更值得留意的是跨國訊號的一致性：同一週，義大利 CSIRT 發布官方公告描述「自動化入侵活動」——攻擊者在數小時內突破大量系統；英國 NCSC 也在機構部落格指出「自 2026 年 9 月起，AI 輔助的網路攻擊明顯增加」。三國官方各自獨立觀察到相同模式：弱點不是新的，變的是攻擊規模與速度。

## 防禦做法

**立即動作**
- 稽核對外連網的系統，優先縮小暴露面——能下架就下架，不能下架的用地理封鎖或 IP／網段白名單限制存取（NCSC 建議）
- 對所有可從網際網路存取的內部資源（webmail、VPN 等）強制啟用 MFA 或 passkey，不留例外
- 建立「關鍵安全更新發布後 24 小時內完成修補」的 SLA（NCSC 明確建議的時限），優先處理已被已知攻擊工具利用的漏洞類型（義大利 CSIRT 的補充建議）

**長期架構**
- 從簽章式偵測轉向行為基準異常偵測：agentic 攻擊的特徵是短時間內對多個端點發動結構相似的探測、流量模式呈現突發與高錯誤率（英國 NCSC 補充說明），傳統規則式偵測對此效果有限
- 落實最小權限原則，並持續監控身分、應用、工作負載與基礎設施偏離正常行為模式的訊號
- 評估 watchlist 中 Straiker 一類做 AI agent runtime 行為偵測與異常攔截的工具——其設計目標正是在 agent 執行動作前辨識資料外洩、未授權工具呼叫等異常模式，與 NCSC 建議的行為式偵測方向一致
- 定期自行或委外執行滲透測試，驗證對外系統實際能抵禦同類自動化攻擊的程度

## 影響範圍

目前確認受影響的是瑞士境內至少 5 個組織（含中小企業，部分為自願通報），3 個屬電力、飲用水、電信等關鍵基礎設施營運商，其中 2 個遭成功入侵；NCSC 未公開任何受害組織名稱，攻擊者身分也尚未歸因。由於攻擊鏈本身是弱密碼、已知漏洞與暴露系統的組合，沒有單一「修補」可言——需要修補的是各受害機構自身的身分驗證強度與對外暴露面管理，時程未公開。NCSC 明確預期這類成功攻擊的數量會持續增加，而不是孤立事件。

如果你的組織有任何系統連上網際網路，這起事件提醒的重點不是某個新的 AI 漏洞，而是「人力攻擊節奏」假設正在失效——過去可以靠「人工不可能同時掃描這麼多端點」撐過去的防禦缺口，現在必須假設攻擊者能以機器速度、全天候、同時對多個目標嘗試。英國與義大利官方同週各自獨立做出相同判斷，顯示這不是瑞士的個案,而是正在浮現的共通威脅模式。

## 今日收穫

過去幾個月本系列報導的 ARTEX、Cairn、AntiFox 多是個別資安公司或企業自行揭露的單一入侵事件；這次不同的是，是一個主權國家的官方網路安全機關，正式把「AI agent 協助的攻擊」當成獨立統計類別來計數與公告，而且同一週義大利、英國官方也分別發出幾乎相同結論的警告。這代表的認知差是：agentic 攻擊工具已經從「某個資安研究報告裡的新奇案例」，變成多國政府機關需要建立專屬通報與統計機制的常態威脅類別——威脅模型的轉變,已經快到讓官方統計口徑本身都還在追著數字變動校正。

## 參考資料

- [Cyberattacks involving AI agents: First confirmed cases in Switzerland](https://www.bacs.admin.ch/en/26-ki-agenten-1-en) — 瑞士 NCSC／BACS 官方公告
- [Switzerland Confirms AI-Assisted Cyberattacks Breached Critical Infrastructure Operators](https://thehackernews.com/2026/11/switzerland-confirms-ai-assisted.html) — The Hacker News
- [Switzerland Confirms First AI-Agent Cyberattacks on Local Organisations](https://securityaffairs.com/204004/hacking/switzerland-confirms-first-ai-agent-cyberattacks-on-local-organisations.html) — Security Affairs
- [Switzerland reports first AI-enabled cyberattacks on critical infrastructure](https://www.swissinfo.ch/eng/swiss-ai/switzerland-reports-first-ai-based-cyberattacks-on-critical-infrastructure/92440400) — SwissInfo
- [familiar weaknesses exploited faster: defending against agentic cyber attacks](https://www.ncsc.gov.uk/blogs/familiar-weaknesses-exploited-faster-defending-against-agentic-cyber-attacks) — 英國 NCSC 官方部落格
- [AI Agent Runtime Security and Protection | Straiker Defend AI](https://www.straiker.ai/products/defend-ai) — Straiker 產品頁
