---
title: "資安警報｜Storm-3168（JADEPUFFER）用一則被刪掉的 GitHub 留言接管 Azure 租戶——但「AI agent 親自下的手」這個說法也該打問號"
date: 2026-10-01
category: daily
tags: [ai-agent, security, daily, data-exfiltration]
lang: zh-TW
description: "Microsoft 揭露 JADEPUFFER（Storm-3168）用一組外洩在 GitHub issue 編輯紀錄裡的 Azure service principal 憑證，18 小時內偵察並刪除上百個儲存體帳戶、Key Vault、Function App；但外部專家質疑，Azure 端的證據只能證明『自動化』，證明不了『AI agent 親自決策』。"
tldr: "Microsoft 於 9 月 25 日公布 JADEPUFFER（其追蹤代號 Storm-3168）的新一輪攻擊：兩組被入侵的 Azure service principal，在約 18 小時內完成偵察、憑證蒐集與破壞，刪除上百個儲存體帳戶及多項雲端資源，且嘗試移除備份保護鎖以阻止復原。入侵起點疑似是員工先前在公開 GitHub issue 貼出的憑證——雖然事後刪除留言內容，但編輯紀錄仍留著明文。JADEPUFFER 今年 7 月因被 Sysdig 認定為「史上第一起全程由 LLM 操刀的勒索案」而出名（入侵管道正是 Langflow CVE-2025-3248），但這次 Azure 端的證據只顯示高度自動化與分工，沒有直接證明是 AI agent 即時做決策——這個落差本身就值得記一筆。防禦重點：稽核任何進過公開 issue／commit 的密鑰視同已外洩、幫關鍵資源上資源鎖與刪除保護、收斂 service principal 權限範圍。"
series:
  name: "AI Security Alert"
  order: 43
---

> 🌏 [English version](/en/posts/daily/2026-10-01-security-storm-3168-azure-agentic-destruction-en)

## 事件概述

Microsoft Security Research 於 2026 年 9 月 25 日發布報告，公開追蹤代號 Storm-3168、與資安圈稱為 JADEPUFFER 的攻擊者關聯的一起 Azure 租戶破壞事件。攻擊發生於 6 月初，前後約 18 小時：兩組被入侵的 Azure service principal 先花 16 小時偵察租戶內的訂閱、資源群組與資源，隨後在短短 35 分鐘內完成 150 多次破壞性或憑證蒐集操作，最終的刪除動作只花了 7 分鐘，刪掉了上百個儲存體帳戶、一座 Key Vault、一個 Function App 與多個 App Service，並試圖移除備份與復原保護鎖。JADEPUFFER 今年 7 月因被資安公司 Sysdig 稱作「史上第一起全程由 LLM 驅動的勒索案」而受到關注，這次 Microsoft 的報告則是首度揭露該攻擊者在 Azure 上的具體行為細節。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 憑證外洩 → 雲端資源破壞性攻擊（agentic-driven cloud attack） |
| 影響範圍 | 遭入侵租戶內的 Azure Storage Accounts、SQL databases、Key Vault、Function App、App Service、VM、備份復原鎖；另有跨多個客戶的 Azure App Service 持續遭探測 |
| 嚴重程度 | High（實際造成雲端資源刪除，且嘗試阻斷復原能力） |
| CVE | 無新 CVE；入侵管道疑似延續今年 7 月 Sysdig 揭露的 Langflow CVE-2025-3248 |
| 來源 | [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/)、[The Hacker News](https://thehackernews.com/2026/09/jadepuffer-linked-attackers-used.html)、[The Register](https://www.theregister.com/security/2026/09/28/jadepuffer-crims-hijacked-azure-identities-and-used-them-to-blow-up-cloud-resources/5299591)、[DarkReading](https://www.darkreading.com/cloud-security/jadepuffer-ai-actor-azure-tenant-destructive-cloud-attack) |

## 攻擊面分析

入侵起點很傳統：Microsoft 指出，這組被濫用的 service principal 的 client ID、client secret 與 tenant ID，先前被受害組織的一名員工以明文貼在**公開的 GitHub issue**裡。雖然這則留言後來被刪除或修改，但 GitHub 的**編輯歷史（edit history）**仍保留了原始內容——這是一個經常被忽略的細節：刪掉留言不等於刪掉洩漏，只要平台保留版本紀錄，明文密鑰就一直在那裡等人翻。

拿到憑證之後的行為模式才是這次報告的重點。兩組 service principal 分工明確：第一組花將近 16 小時、發出 300 多次讀取操作，掃遍訂閱、資源群組與資源清單；第二組在第一組開始後約 90 分鐘加入，卻只花 5 秒鐘就列完兩個訂閱底下的 VM 與資源群組——速度差距顯示這不是同一套邏輯的自然延伸，而更像是刻意的任務切分。兩組身分共用同一批 Storm-3168 基礎設施、同一個網路指紋，以及同一個 User-Agent（`python-requests/2.34.2`），這是後續資安團隊拿來關聯兩起看似獨立活動的關鍵 IOC。16 小時後，第二組身分進一步列舉 App Service 的設定儲存區，目標很直接：找有沒有寫死在設定裡的憑證，其中包含儲存體帳戶的存取金鑰（含 Azure Site Recovery 相關帳戶的金鑰）——這類金鑰足以支撐後續的資料外流，即使這次沒有觀察到實際外洩。破壞階段更快：150 次以上的破壞或憑證蒐集操作壓縮在 35 分鐘內，最終刪除動作只用了 7 分鐘，對應 MITRE ATT&CK 的 T1490（Inhibit System Recovery）——攻擊者不只刪資源，還專門針對 Azure Site Recovery 的磁碟鎖與 Azure Backup 的保護鎖下手，用意很明顯：讓受害者連復原都做不到。值得注意的是，多個 SQL 資料庫的刪除嘗試全部失敗，原因只是攻擊者用錯了 API 版本——這次算是撿到，不是防禦生效。

把這起事件放進 OWASP LLM Top 10 的框架看，最貼切的對應是 **LLM06/LLM08：過度代理（Excessive Agency）**——不是說這次一定是 LLM 在做決策（見下段的爭議），而是這起事件示範了「過度代理」這個架構性風險本身跟執行者是不是 AI 無關：一個能橫跨計算、儲存、金鑰、備份的高權限身分，一旦被外部憑證外洩接管，無論背後驅動的是精心設計的 bash 腳本還是 agentic 迴圈，只要執行速度夠快、範圍夠廣，都能在幾分鐘內把一個租戶打穿。單一憑證的權限範圍，才是真正決定爆炸半徑的變數。

## 防禦做法

**立即動作**
- 稽核所有曾經出現在公開或半公開 GitHub issue／PR／commit 訊息裡的密鑰，即使留言已被「刪除」——GitHub 的編輯歷史仍會保留原文，一律視為已外洩並立即輪換
- 檢查是否有 service principal 出現異常的「機器速度」操作模式：短時間內大量列舉、跨多個訂閱在數秒內完成掃描、固定的自動化 User-Agent（如本案的 `python-requests/2.34.2`）
- 若有自架 Langflow，確認已修補 CVE-2025-3248，並檢查 `/api/v1/validate/code` 端點是否對外暴露——Storm-3168 自年初起持續針對多個 Azure 客戶探測這個端點
- 為儲存體帳戶、Key Vault、備份與復原相關資源啟用 Azure 資源鎖（`CanNotDelete`）與儲存體帳戶層級的刪除保護——這次確實擋下了部分刪除嘗試，是少數在混亂中生效的防線

**長期架構**
- 對 service principal 採最小權限原則：依資源群組或訂閱範圍收斂，避免單一身分擁有跨租戶的 Contributor／Owner 權限，讓「憑證外洩」的代價止步於局部而非全租戶
- 在 Defender for Cloud 開啟 Resource Manager、Storage、Key Vault、App Service、Databases 相關方案，針對「短時間內密集操作」這類不符合人類操作節奏的模式建立偵測規則
- 對雲端環境維護資產與弱點盤點（watchlist B7 的 Protect AI、Netzilo 這類工具訴求即是把「哪些身分、哪些服務在跑」的可見度補回來），避免組織因為看不到全貌而錯失像這次持續近一年的探測活動

## 影響範圍

這次報告詳述的是單一租戶內的完整攻擊鏈，但 Microsoft 同時指出，Storm-3168 關聯的基礎設施自今年初以來持續探測多個不同客戶的 Azure App Service，攻擊路徑涵蓋 WordPress 後台、PHP-CGI、類似 web shell 的路徑，以及與 Langflow 程式碼驗證端點相符的 URL——顯示這不是單一事件，而是同一套劇本在多個目標上重複執行。這次事件沒有觀察到勒索訊息，也沒有確認的資料外洩，但攻擊者蒐集到的儲存體存取金鑰，加上刻意破壞備份保護鎖的動作，都指向「即使這次沒要贖金，下一次未必如此」的走向。如果你的組織把 Azure service principal 憑證放進程式碼或設定檔管理，這起事件是很具體的提醒：問題不在密鑰有沒有被『看到』，而在密鑰有沒有被『永久移除所有能被翻到的地方』。

## 今日收穫

這次報告最有意思的地方不是攻擊手法本身，而是外部專家的一句反駁：Swimlane 的 Nick Tausek 指出，Azure 端的證據「顯示的是協同自動化，不能證明是 AI 一步步做的決策」。Microsoft 之所以把這起事件貼上「agentic-driven」標籤，主要是因為它跟 7 月被 Sysdig 證實有 LLM 驅動紀錄的 JADEPUFFER 案例共用同一批基礎設施——但共用基礎設施證明的是「同一群人」，不是「這次也是 AI 在按按鈕」。這提醒我：資安廠商為攻擊貼上「AI-orchestrated」標籤時，有雙重誘因既要提高警覺、又要順便替自家的 agentic 防禦工具鋪路，讀者得自己分清楚「證據支持的自動化」跟「敘事需要的 AI 敘事」，不能只看標題。

## 參考資料

- [Microsoft Security Blog — Storm-3168: Agentic-driven cloud attacks using compromised service principals](https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/)
- [The Hacker News — JADEPUFFER-Linked Attackers Used Compromised Service Principals to Delete Azure Resources](https://thehackernews.com/2026/09/jadepuffer-linked-attackers-used.html)
- [The Register — JadePuffer crims hijacked Azure identities and used them to blow up cloud resources](https://www.theregister.com/security/2026/09/28/jadepuffer-crims-hijacked-azure-identities-and-used-them-to-blow-up-cloud-resources/5299591)
- [DarkReading — JadePuffer AI Actor Compromises Azure Tenant in Destructive Cloud Attack](https://www.darkreading.com/cloud-security/jadepuffer-ai-actor-azure-tenant-destructive-cloud-attack)
- [SecurityAffairs — Storm-3168, Linked to JADEPUFFER, Abused Stolen Azure Identities](https://securityaffairs.com/199905/cyber-crime/storm-3168-linked-to-jadepuffer-abused-stolen-azure-identities.html)
- [Sysdig — JADEPUFFER: Agentic ransomware for automated database extortion](https://www.sysdig.com/blog/jadepuffer-agentic-ransomware-for-automated-database-extortion)
