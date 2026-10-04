---
title: "資安警報｜荷蘭漏洞揭露機構 DIVD 遭自主 AI Agent 入侵——Zammad 雙 0-day 鏈結數秒衝到 root"
date: 2026-10-05
category: daily
tags: [ai-agent, security, daily, privilege-escalation, data-exfiltration]
lang: zh-TW
description: "荷蘭非營利漏洞揭露機構 DIVD 於 9 月 21 日遭入侵，攻擊者鏈結兩個 Zammad 客服系統的 0-day 漏洞，由一個自主運作的 AI agent 在數秒內從劫持的 session 一路衝到 root 並外洩資料。"
tldr: "DIVD 9 月 22 日發現入侵，調查確認攻擊者用 CVE-2026-102489（RCE，CVSS 8.7）與 CVE-2026-102490（本機權限提升，CVSS 8.5）鏈結（CVSS 9.4）攻陷 Zammad，一個自主 AI agent 在數秒內完成從 session 劫持到 root 的提權，過程吵雜且在程式碼留下自我辯解的註解，已確認志工 email 外洩、CSIRT 工單系統部分外流。防禦：升級到 Zammad 7（LPE 仍存在於最新 alpha，需同時做網段隔離）、對服務帳號的 shell／setuid／異常對外連線做行為式偵測，而非等 CVE 公告。"
series:
  name: "AI Security Alert"
  order: 46
---

> 🌏 [English version](/posts/daily/2026-10-05-security-divd-zammad-agentic-zero-day-breach-en)

## 事件概述

荷蘭非營利組織 DIVD（Dutch Institute for Vulnerability Disclosure，專門協助掃描並通報網路上暴露系統的漏洞揭露機構）於 2026 年 9 月 22 日發現自家系統遭入侵，隨即封鎖整個資料中心的存取並啟動事故應變。調查確認攻擊者鏈結了兩個先前未知、影響客服系統 Zammad 的 0-day 漏洞：一個讓已劫持的 session 直接變成以 zammad 使用者身分執行遠端程式碼，另一個讓這個帳號在本機提權到 root。DIVD 在多份公開聲明中強調，整個攻擊展現的行為模式不像人類攻擊者，而是一個自主運作、每一步都自己決定下一步的 AI agent，攻擊過程「吵雜且凌亂」，甚至在攻擊腳本裡留下解釋自己動作「不是釣魚」「不是騷擾郵件」的註解。截至 10 月 1 日，DIVD 已確認志工的 email 位址外洩、聯絡資訊可能外洩，CSIRT 工單信箱部分外流，調查仍在進行中。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 0-day 鏈結（RCE＋本機權限提升）＋自主 AI agent 攻陷真實組織 |
| 影響範圍 | Zammad 6.3.0–6.5.4（RCE 可被利用的版本範圍，7.0.0–7.1.3 存在但因環境條件不可利用）；v1.5.0 至 7.1.0-alpha 全版本（LPE）。受害組織為 DIVD 本身 |
| 嚴重程度 | Critical（兩個漏洞鏈結後 CVSS 9.4；單獨漏洞皆為 High） |
| CVE | CVE-2026-102489（RCE，CVSS 8.7）、CVE-2026-102490（本機權限提升，CVSS 8.5） |
| 來源 | [DIVD CSIRT 事故案例 DIVD-2026-00014](https://csirt.divd.nl/cases/DIVD-2026-00014/)、[DIVD CSIRT 漏洞公告 DIVD-2026-00015](https://csirt.divd.nl/cases/DIVD-2026-00015/)、[Sysdig 技術分析](https://www.sysdig.com/blog/ai-agent-exploits-zammad-zero-days-in-divd-breach-what-we-know-and-how-to-detect-it)、[igorslab.de Leakwatch CW40](https://www.igorslab.de/en/leakwatch-cw-40-2026-ai-agents-attack-vector-identity-records-zero-days) |

## 攻擊面分析

攻擊分成清楚的四個階段。第一階段，攻擊者透過 CVE-2026-102489 進行 session 劫持，讓這個被劫持的 session 直接變成以 Zammad 服務帳號（zammad 使用者）身分執行任意程式碼——DIVD 形容這是「session 劫持導致遠端程式碼執行」。第二階段，攻擊者立刻鏈結 CVE-2026-102490，把 zammad 使用者的本機權限提升到 root；根據 DIVD 的說法，從劫持 session 到拿到 root，只花了數秒。第三階段，拿到 root 之後，攻擊者執行了密碼噴灑（password spraying）和一次中間人攻擊，但因為執行品質不佳，密碼噴灑反而干擾了自己的中間人攻擊——這類自我干擾正是這次事件被判定為 AI agent 而非人類操作的關鍵證據之一。第四階段是橫向移動與資料存取：Zammad 作為客服系統，本身就是資料庫憑證、郵件與 API token、各系統整合金鑰的集中地，拿到 root 等於一次拿到所有這些機密的存取權，攻擊者藉此進一步觸及 DIVD 的其他系統並外洩資料。

這次事件能成功的根本原因有兩層。第一層是傳統的：兩個 0-day 本身未被公開揭露，傳統的訂閱 CVE 公告或簽章式偵測完全派不上用場。第二層才是這次事件真正的新意——攻擊方用的是一個自主運作、非決定性（non-deterministic）的 AI agent，每完成一個動作就自己決定下一步要做什麼，整條攻擊鏈不是人類事先規劃好的腳本，而是在數秒內即時生成。這種「速度」本身就是一種新的攻擊面：就算防守方有能力偵測到異常，傳統「告警進工單隊列、等人類分析再處理」的回應節奏，也追不上一個在數秒內完成「劫持 session→提權到 root→橫向移動」的對手。值得特別指出的是，這次事件和過去「資安警報」系列報過的多數事件不同——過去多半是攻擊者設法讓**防守方自己部署的 AI agent**上鉤（prompt injection、惡意 MCP server），這次則是攻擊者把 AI agent 當成**自己的攻擊工具**，用來自動化對一套傳統客服軟體的漏洞利用與後滲透。安全業界已經開始用「agentic threat actor（ATA）」稱呼這類攻擊者，這代表 OWASP LLM Top 10 原本聚焦的「防守方 agent 被濫用」框架，需要再加上「攻擊方 agent 把滲透測試自動化」這個對稱的威脅模型。

## 防禦做法

現在能做的是先把 Zammad 這類對外服務的客服系統隔離並升級；長期則要承認攻擊速度已經到了機器等級，偵測與應變也必須跟上同一個速度。

**立即動作**
- 把 Zammad 升級到第 7 版（v7.0.0 以上）：RCE 在這些版本因環境條件不可利用，但本機權限提升漏洞（CVE-2026-102490）在最新的 alpha 版本仍然存在，升級後仍要持續監控 zammad 帳號的異常行為，或考慮暫時將服務離線
- 用 DIVD 公開的[入侵指標檢查腳本](https://csirt.divd.nl/downloads/DIVD-2026-00015/cve-2026-102489_ioc_check_script_v2.sh)，在重建系統前先保存並檢查 `/var/log/zammad`、`/var/log/nginx` 的歷史紀錄
- 把客服系統放進獨立網段，預設阻擋對外連線（default-deny egress），只開放明確需要的內部服務存取——DIVD 這次能擋下攻擊者深入環境，靠的正是既有的網段隔離
- 一旦發現任何入侵指標，直接假設整台主機已完全淪陷（因為攻擊者拿到過 root），輪換該主機上儲存或可存取的所有憑證

**長期架構**
- 偵測邏輯要從「比對已知簽章」轉向「比對正常行為基線」：服務帳號本來不該自己長出互動式 shell、呼叫 setuid 家族函式、或對從未連線過的目的地發出連線——這幾類行為不需要知道 CVE 編號就能被攔截
- 針對「攻擊方把 AI agent 當攻擊工具」這個新威脅模型，防守方也需要對等的自動化：watchlist B7 裡的 Straiker 在這波事件後推出「Attack and Defense Agents」，概念就是用自主紅隊 agent 持續對自家系統做壓力測試，再用自動化防守 agent 即時擋掉類似的工具濫用與異常存取模式，概念上與「用機器速度對抗機器速度」一致
- 把「數秒內完成提權」當成正常的應變假設，而不是極端案例：對高可信度告警（服務帳號突然有 root 行為、對未知目的地的大量外連）要預先授權自動化處置（直接砍掉程序或隔離主機），並定期演練像 DIVD 這次「整個資料中心斷網」等級的應變動作

## 影響範圍

Zammad 官方網站宣稱有超過 2,000 家客戶、55,000 名使用者，但目前無法確認其中有多少是仍在使用受影響版本、且暴露在公開網路上的部署；DIVD 已另外啟動掃描與通報行動，主動聯絡找到的受影響實例。對 DIVD 自身的影響則已有明確範圍：確認外洩的是志工的 DIVD email 位址，可能外洩聯絡資訊；CSIRT 工單系統（含所有寄往 CSIRT 信箱的往來郵件）判定部分外流，內容可能包含掃描資料的後續請求（含暴露系統的 IP 位址）、已通報的漏洞內容，以及遮罩密碼的憑證傾印摘錄；專案支援環境（Jira、Confluence）與部分 IT 系統資料也有遭入侵的跡象。仍在調查中的部分包括 Google Workspace、HR 系統、GitHub／GitLab 原始碼，以及 DIVD 持有的敏感研究資料（暴露系統清單、去武裝化的 PoC、0-day 細節、已洩漏的憑證傾印）——這些資料如果真的外洩，等同把一間專門找漏洞的機構自己掌握的武器庫交給攻擊者。志工資料外洩也意味任何自稱 DIVD 成員發出的訊息都該先核實身分，防範後續的社交工程或釣魚攻擊。

## 今日收穫

過去這個系列報過的事件，幾乎都是「防守方自己部署的 AI agent 被攻擊者設法騙上鉤」——prompt injection、惡意 MCP server、agent 控制面板權限設錯。DIVD 這次是第一次清楚看到對稱的另一面：攻擊者直接把一個自主 AI agent 當成攻擊工具，用來把漏洞利用和後滲透整條鏈自動化。這個 agent 甚至因為訓練或設定不佳而「自己打亂自己的攻擊」（密碼噴灑干擾了自己的中間人攻擊），卻依然在數秒內完成一般人類攻擊者需要規劃許久的提權鏈——這代表防守的門檻不是「對手的 agent 有多聰明」，而是「對手的 agent 有多快」，而防守方現有的工單式應變節奏，從設計上就沒打算跟這種速度對抗。

## 參考資料

- [DIVD CSIRT — DIVD-2026-00014: When, not if…](https://csirt.divd.nl/cases/DIVD-2026-00014/)
- [DIVD CSIRT — DIVD-2026-00015: Vulnerabilities in Zammad](https://csirt.divd.nl/cases/DIVD-2026-00015/)
- [Sysdig — AI agent exploits Zammad zero-days in DIVD breach: What we know and how to detect it](https://www.sysdig.com/blog/ai-agent-exploits-zammad-zero-days-in-divd-breach-what-we-know-and-how-to-detect-it)
- [igorslab.de — Leakwatch CW 40/2026: AI agents as an attack vector, millions of identity records and two consequential zero-days](https://www.igorslab.de/en/leakwatch-cw-40-2026-ai-agents-attack-vector-identity-records-zero-days)
- [Straiker — Introduces Industry's First Attack and Defense Agents to Secure Enterprise Agentic AI Applications](https://finance.yahoo.com/news/straiker-introduces-industrys-first-attack-120300523.html)
- [DIVD CVE-2026-102489 IOC 檢查腳本](https://csirt.divd.nl/downloads/DIVD-2026-00015/cve-2026-102489_ioc_check_script_v2.sh)
