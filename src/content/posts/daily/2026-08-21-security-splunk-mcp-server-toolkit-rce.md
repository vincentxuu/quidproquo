---
title: "資安警報｜Splunk MCP Server 出現 CVSS 9.1 反序列化 RCE，AI Toolkit 同批再爆模型載入 RCE"
date: 2026-08-21
category: daily
type: digest
lang: zh-TW
tags: [ai-agent, security, daily, privilege-escalation, mcp]
description: "Splunk 一次修補 17 個漏洞，其中 Splunk MCP Server app 的憑證管理元件反序列化漏洞可讓管理員角色使用者達成主機層級任意指令執行，AI Toolkit 的模型載入 API 也有同類反序列化 RCE"
tldr: "Splunk 於 2026/8/19 發布 SVD-2026-0808，一次修補 Cisco Talos 附加元件、AI Toolkit、Connect for Kafka、MCP Server app、On-Call 共 17 個漏洞。最嚴重的 CVE-2026-76404（CVSS 9.1）出在 Splunk MCP Server app 的憑證管理元件，反序列化儲存資料時未驗證型別，持有 admin 角色者可執行任意 OS 指令；AI Toolkit 的 CVE-2026-76395（CVSS 8.8）則是載入夾帶 pickle 內容的模型檔案時觸發同類 RCE。官方未觀察到在野利用。防禦：立即升級 MCP Server app 至 1.2.1、AI Toolkit 至 6.0.1，無法立即升級則停用該 app。"
series:
  name: "AI Security Alert"
  order: 7
---

> 🌏 [English version](/en/posts/daily/2026-08-21-security-splunk-mcp-server-toolkit-rce-en)

## 事件概述

Splunk 於 2026 年 8 月 19 日發布安全加固公告 SVD-2026-0808，一次修補橫跨五個 app／add-on 的 17 個漏洞：Cisco Talos Intelligence for Enterprise Security Cloud、Splunk AI Toolkit、Splunk Connect for Kafka、Splunk MCP Server app、Splunk On-Call（VictorOps）。其中最嚴重的一項是 Splunk MCP Server app 的 CVE-2026-76404，CVSS 3.1 評分 9.1（Critical）：持有 admin 角色的使用者可透過憑證管理元件的反序列化缺陷，在 Splunk 主機的作業系統層級執行任意指令。同一批公告裡，AI Toolkit 的模型載入 API 也有一個手法幾乎相同的 RCE（CVE-2026-76395，CVSS 8.8）。Splunk 官方與多家資安媒體均未發現在野利用證據。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Insecure Deserialization（CWE-502）導致 RCE + 多項存取控制缺陷 |
| 影響範圍 | Splunk MCP Server app（< 1.2.1）、Splunk AI Toolkit（< 6.0.0 / < 6.0.1）、Connect for Kafka（< 2.2.7）、Talos 附加元件（< 1.0.3）、On-Call（< 1.0.43） |
| 嚴重程度 | Critical（CVE-2026-76404，CVSS 9.1）／同批另有 8 項 High、7 項 Medium |
| CVE | CVE-2026-76404（MCP Server RCE）、CVE-2026-76395（AI Toolkit RCE），公告合計 17 個 CVE |
| 來源 | [Splunk 官方公告 SVD-2026-0808](https://advisory.splunk.com/advisories/SVD-2026-0808)、[cybersecuritynews.com](https://cybersecuritynews.com/splunk-patches-security-flaws/)、[gbhackers.com](https://gbhackers.com/splunk-fixes-17-vulnerabilities/)、[securityonline.info](https://securityonline.info/splunk-apps-cve-2026-76404/)、[Tenable CVE 資料庫](https://www.tenable.com/cve/CVE-2026-76395) |

## 攻擊面分析

這批公告裡最值得注意的不是單一漏洞，而是**同一個攻擊模式在兩個不同 app 裡各出現一次**：Splunk MCP Server app 的憑證管理元件，以及 AI Toolkit 的模型載入 REST API，都是把「儲存資料」直接反序列化，卻沒有先確認內容型別是否符合預期。CVE-2026-76404 出在前者：MCP Server app 儲存憑證時用了不安全的反序列化流程，一個持有 admin 角色的使用者可以構造惡意資料，讓伺服器在反序列化時執行任意 OS 指令。CVE-2026-76395 出在後者：AI Toolkit 的模型編解碼器（model codec）在載入模型檔案時，會解析內含稀疏矩陣（sparse matrix）的資料結構，但沒有防範其中夾帶的 pickle 內容——這正是 Python 生態裡行之有年的「模型檔案即程式碼執行」攻擊面，PyTorch、scikit-learn 等框架都出過同款漏洞，Splunk 這次是把它複製到了自家 AI 附加元件上。

Splunk MCP Server app 的角色值得特別點出：它是 Splunk 官方提供、讓 AI Agent／LLM 客戶端透過 Model Context Protocol 直接查詢與操作 Splunk 的橋接層。換句話說，這不是「LLM 被 prompt injection 騙去做壞事」的老問題，而是 **MCP 伺服器本身的程式碼有 RCE**——任何能觸及憑證管理元件的人（無論是透過已取得的 admin 憑證、或是鏈接其他漏洞先拿到 admin 權限），都能把「AI Agent 對 SIEM 的存取權」直接兌現成主機層級的完整淪陷。

對照 OWASP LLM Top 10，這批漏洞主要對應到 **LLM03 Training Data Poisoning / Supply Chain**（模型檔案作為攻擊載體）與 **LLM05 Supply Chain Vulnerabilities**（MCP Server 作為第三方元件本身即是攻擊面）。根本原因是兩個元件都把「已通過角色驗證的使用者上傳的資料」當成可信任資料處理，卻忽略了資料本身仍可能夾帶惡意內容——這與許多 prompt injection 事件的根本邏輯其實相通：系統把「已授權的輸入來源」誤當成「已驗證的輸入內容」。

## 防禦做法

**立即動作**
- 盤點環境內是否安裝了 Splunk MCP Server app 或 Splunk AI Toolkit，以及目前版本：`splunk display app | grep -i "mcp\|ai toolkit"`
- 立即升級：MCP Server app → 1.2.1、AI Toolkit → 6.0.1（若目前在 6.0 分支）或 6.0.0（若在 5.7 分支）
- 若無法立即升級，依官方建議先停用或移除該 app（注意：停用 AI Toolkit 會連帶關閉依賴它的 SPL 指令與模型操作）
- 檢視持有 admin／power 角色的帳號清單，確認沒有異常或多餘的高權限帳號——這批漏洞幾乎都需要較高角色才能觸發，收斂角色分配就是最直接的緩解

**長期架構**
- 把 MCP Server 這類「讓 AI Agent 直接操作內部系統」的橋接元件，當成核心基礎設施的一部分納入例行的漏洞掃描與修補週期，而不是當成邊緣工具延後處理
- 導入 watchlist 中 Netzilo 這類 MCP server 治理工具，對組織內部署的 MCP server 做版本與權限的集中盤點，避免出現「裝了但沒人追蹤」的影子部署
- 若自行開發整合 ML 模型載入流程，避免使用 pickle 或其他會執行任意程式碼的反序列化格式，改用 safetensors、JSON 等只承載資料、不承載程式邏輯的格式
- 落實最小權限：AI 相關 app 的操作角色應盡量與一般 admin 角色分離，降低「一個帳號被盜就等於拿下整個 AI 附加元件」的暴露面

## 影響範圍

Splunk 未公開安裝量估計，但 MCP Server app 與 AI Toolkit 都是近年才推出、鎖定「把 AI／Agent 能力接進 Splunk」的新附加元件，使用者群相對集中在已導入 AI 維運或 SOC 自動化的組織。官方與多家資安媒體（securityonline.info、gbhackers.com）均確認目前沒有在野利用證據，但 17 個 CVE 一次揭露、其中 1 個 Critical、8 個 High，代表這兩個 app 在資安審查上明顯落後於 Splunk 核心產品的成熟度。對於任何把 MCP Server 當成 AI Agent 存取企業系統橋樑的團隊，這起事件是一個具體提醒：MCP 伺服器本身的程式碼品質與修補紀律，和它所保護的後端系統一樣重要。

## 今日收穫

過去幾週看到的資安事件多半圍繞「prompt injection 騙 AI 做壞事」，但這次 Splunk 的兩個 RCE 提醒我，MCP Server 和 AI Toolkit 這類讓 Agent 存取企業系統的橋接元件，本身的程式碼安全（反序列化、輸入驗證）跟它接的模型有沒有被越獄是兩個完全獨立、但一樣致命的攻擊面——而且「需要 admin 角色才能觸發」聽起來像是緩解條件,實際上在憑證外洩與橫向移動司空見慣的環境裡，反而更像是攻擊者拿到初始立足點後的下一步,而不是真正的門檻。

## 參考資料

- [Splunk 官方公告：SVD-2026-0808 Security Hardening Release for Splunk Apps and Add-ons](https://advisory.splunk.com/advisories/SVD-2026-0808)
- [cybersecuritynews.com：Splunk Patches Critical MCP Server RCE and 16 Other Security Flaws](https://cybersecuritynews.com/splunk-patches-security-flaws/)
- [gbhackers.com：Splunk Fixes 17 Vulnerabilities Including Critical MCP Server RCE](https://gbhackers.com/splunk-fixes-17-vulnerabilities/)
- [securityonline.info：CVE-2026-76404 Splunk MCP Server RCE, CVSS 9.1](https://securityonline.info/splunk-apps-cve-2026-76404/)
- [cyberupdates365.com：Critical Splunk MCP Server RCE & AI Toolkit Patches](https://cyberupdates365.com/splunk-mcp-server-rce-patch/)
- [Tenable：CVE-2026-76395 詳情](https://www.tenable.com/cve/CVE-2026-76395)
- [OpenCVE：CVE-2026-76404 詳情](https://app.opencve.io/cve/CVE-2026-76404)
