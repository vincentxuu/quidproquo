---
title: "資安警報｜Azure AI Foundry 出現 CVSS 滿分 10 分未授權提權漏洞——微軟已伺服器端修補，凸顯 AI 平台控制層的驗證盲點"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "微軟修補了 Azure AI Foundry（企業用來建置與管理 generative AI 應用與 agent 的平台）一個 CVSS 滿分 10.0 的關鍵函式缺少身分驗證漏洞，未經授權攻擊者可透過網路直接取得等同管理員的權限，目前無證據顯示已遭在野利用。"
tldr: "CVE-2026-85889 是 Azure AI Foundry 一個關鍵函式缺少身分驗證的漏洞（CWE-306），CVSS 滿分 10.0，理論上攻擊者不需任何憑證、不需使用者互動即可透過網路取得管理層級權限,進而觸及模型、訓練資料與所有串接的下游系統。微軟已於 2026-09-17 在伺服器端完全修補、無需客戶採取任何動作,且截至目前未觀察到在野利用。但這起事件提醒:當企業把 agent 平台的『控制層』完全交給雲端供應商打理,能做的防禦只剩身分治理稽核與日誌監控,修補時程本身完全不在自己手上。"
series:
  name: "AI Security Alert"
  order: 32
---

> 🌏 [English version](/en/posts/daily/2026-09-18-security-azure-ai-foundry-privilege-escalation-en)

## 事件概述

微軟於 2026 年 9 月 17 日（週四）發布資安公告,修補了 Azure AI Foundry（又稱 Microsoft Foundry,是微軟用來建置、部署與管理 generative AI 應用程式與 agent 的企業級平台）中的一個關鍵函式缺少身分驗證漏洞,編號 CVE-2026-85889。這項漏洞的 CVSS 分數是滿分 10.0,官方描述為「Azure AI Foundry 中關鍵函式缺少身分驗證,允許未經授權的攻擊者透過網路提升權限」。由於這是雲端服務端的漏洞,微軟已直接在伺服器端完成修補,客戶不需要採取任何行動;漏洞由資安研究人員 Rémy Marot 通報發現,微軟表示截至目前沒有證據顯示曾遭在野利用。這起漏洞與微軟同批公告的 Microsoft 365 Copilot 命令注入漏洞(CVE-2026-85885,CVSS 9.9)、Azure Database for PostgreSQL 授權缺陷(CVE-2026-85878,CVSS 9.9)一起發布,反映出微軟雲端 AI 服務堆疊近期集中出現高嚴重度存取控制問題。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Privilege Escalation（關鍵函式缺少身分驗證,CWE-306） |
| 影響範圍 | Azure AI Foundry（企業用來建置與管理 generative AI 應用與 agent 的平台）,已由微軟於伺服器端全面修補 |
| 嚴重程度 | Critical（CVSS 10.0 滿分,微軟表示未觀察到在野利用） |
| CVE | CVE-2026-85889 |
| 來源 | [The Hacker News](https://thehackernews.com/2026/09/microsoft-patches-cvss-100-azure-ai.html)、[Microsoft Security Response Center 官方公告](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-85889)、[CybersecurityNews](https://cybersecuritynews.com/microsoft-azure-ai-foundry-vulnerability/) |

## 攻擊面分析

微軟公告對外揭露的技術細節相當有限——這是雲端服務端漏洞的常見做法,因為修補完全在伺服器端完成,詳細揭露攻擊路徑等於直接提供攻擊者操作手冊,對已經全面修補的服務沒有防禦上的意義。公開資訊確認的是漏洞分類為 CWE-306「關鍵函式缺少身分驗證」,攻擊向量是網路、不需要任何權限、也不需要使用者互動,CVSS 10.0 的滿分反映的正是「未經驗證、可遠端觸發、影響範圍涵蓋整個服務」這種最高風險組合。CybersecurityNews 的分析指出,由於攻擊向量是網路層、複雜度低,理論上屬於容易被利用的類型,只是目前沒有公開的概念驗證(PoC)程式碼流出。

這類漏洞之所以能發生,根本原因通常是平台在快速擴充功能(尤其是把新的 API 端點、管理介面或跨服務串接功能上線)時,某個「理論上應該要求身分驗證」的關鍵函式被遺漏在驗證層之外——這不是模型層面的安全問題,而是雲端服務控制層本身常見的存取控制設計缺陷,只是這次剛好出現在一個承載大量企業 AI 工作負載的平台上。若真的遭到利用,攻擊者能取得的是等同合法特權使用者的存取層級,理論上可能觸及平台上的模型設定、訓練資料、agent 的工具串接憑證,以及任何整合到 Foundry 應用程式的下游系統。

對照 OWASP 的分類架構,這起事件比較不落在傳統 LLM Top 10(如 Prompt Injection、Excessive Agency)的範疇,而是更接近 OWASP API Security Top 10 的「Broken Authentication」以及正在成形的 OWASP Agentic AI 安全指引中「身分與存取控制不足」(Insufficient Identity & Access Controls)這一類——這也呼應近期 AI 資安圈的共同觀察:agent 平台的控制層(身分驗證、API 閘道、管理介面)本身,往往比模型輸出更早成為被鎖定的攻擊面。

## 防禦做法

由於這是雲端服務端漏洞且微軟已完成全面修補,企業端沒有可以立即部署的修補動作,但這不代表沒有事可做——這類事件的防禦重點,在於稽核而非修補。

**立即動作**
- 確認組織內使用 Azure AI Foundry 的服務已套用微軟的伺服器端修補(通常無需手動操作,但建議透過 Azure 入口網站的服務健康與合規儀表板複查一次)
- 盤點所有串接 Azure AI Foundry 的 agent 工作流程與其可觸及的下游系統(資料庫、儲存體、其他 API),確認沒有過度寬鬆的服務主體(service principal)權限或長期存活的憑證
- 檢視 2026-09-02 至今的 Azure AD/Entra ID 登入與資源存取日誌,留意異常的管理層級操作,特別是來源 IP 或存取模式與平常不符的紀錄

**長期架構**
- 導入 AI 安全態勢管理(AI-SPM)工具持續掃描雲端 AI 平台的設定錯誤與過度授權,watchlist B7 中的 Protect AI 即是專注於此類 AI/ML 資產與流程安全稽核的廠商
- 針對 agent 平台採用 WitnessAI 這類 runtime AI 治理工具,持續監控 agent 對外部系統的存取模式,而不只是仰賴雲端供應商的公告與修補時程
- 落實「AI 平台控制層」的最小權限原則:agent 使用的服務主體應限定在完成任務所需的最小資源範圍,並定期輪替憑證,降低單一控制層漏洞被利用時的波及範圍

## 影響範圍

微軟表示目前沒有證據顯示 CVE-2026-85889 曾遭在野利用,漏洞已於公告當日在伺服器端完成修補,客戶不需要採取任何行動即完成防護。由於漏洞細節與利用方式未被公開揭露,無法得知修補前的實際曝險時間有多長,也無法確認是否有組織在修補前就已受到影響——這也是雲端端點漏洞的典型特徵:企業對曝險視窗的掌握,完全依賴供應商公告的透明度。

對於在 Azure AI Foundry 上建置 agent 應用的企業而言,這起事件的意義不在於漏洞本身(已修補、未觀察到利用),而在於它再次證明:AI agent 平台的攻擊面不只是模型輸入輸出這一層,承載這些 agent 運作的雲端控制層——身分驗證、API 閘道、管理介面——同樣可能出現最基本的存取控制缺陷,而且修補完全掌握在供應商手中,企業唯一能做的是稽核自己串接的部分,以及在供應商公告發布後第一時間覆核相關日誌。

## 今日收穫

過去多數 AI 資安警報聚焦在 prompt injection、MCP 工具濫用或供應鏈套件這些「AI 特有」的攻擊面,容易讓人誤以為 AI 平台的風險主要來自模型層。這起事件提醒我:承載這些 agent 與模型的雲端控制層,仍然會出現最傳統、最基礎的「忘記加身分驗證」設計缺陷,而且這類問題往往比模型層攻擊更早出現、影響範圍更大(CVSS 直接滿分),企業能做的風險控管,終究要包含對供應商控制層的稽核,而不能只把資源投入在模型輸出的防護上。

## 參考資料

- [The Hacker News — Microsoft Patches CVSS 10.0 Azure AI Foundry Flaw Enabling Unauthorized Privilege Escalation（2026-09-18）](https://thehackernews.com/2026/09/microsoft-patches-cvss-100-azure-ai.html)
- [Microsoft Security Response Center — CVE-2026-85889 官方公告](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-85889)
- [CybersecurityNews — Critical Microsoft Azure AI Foundry Vulnerability Allows Attackers to Escalate Privileges（2026-09-18）](https://cybersecuritynews.com/microsoft-azure-ai-foundry-vulnerability/)
