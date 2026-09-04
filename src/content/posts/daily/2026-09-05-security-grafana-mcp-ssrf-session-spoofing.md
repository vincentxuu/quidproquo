---
title: "資安警報｜Grafana 官方 MCP Server 認證繞過鏈上 SSRF——CVE-2026-19516(CVSS 9.1),修補後認證仍非強制"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "資安公司 Pillar Security 揭露 Grafana 官方 MCP server 的漏洞鏈:偽造格式正確但從未發出的 session ID 即可繞過認證,再透過 grafana_api_request 工具的 X-Grafana-URL 標頭把請求導向雲端 metadata 端點,已有 190 萬次 Docker Hub 下載的映像檔受影響。"
tldr: "Pillar Security 透過 Grafana 官方 bug bounty 揭露一條漏洞鏈:v1.1.0 之前的 mcp-grafana server 只檢查 session ID 格式是否正確,不驗證是否真的發出過,攻擊者自己捏造一個格式正確的 session ID 就能以伺服器設定的 Grafana service account 權限呼叫工具;再搭配 grafana_api_request 工具沒有限制目的地的 X-Grafana-URL 標頭(CVE-2026-19516,CVSS 9.1),把請求導向內部服務或雲端 metadata 端點,讀取回應內容。Grafana 已於 8 月 10 日發布 v1.1.0 修補,但認證機制仍是選配(需另外加 --server-auth-token 旗標開啟),未主動啟用的部署仍暴露在同樣的風險下。目前無證據顯示已遭在野利用。防禦:立即升級並手動開啟認證旗標,同時稽核所有 MCP server 的網路暴露面。"
series:
  name: "AI Security Alert"
  order: 22
---

> 🌏 [English version](/en/posts/daily/2026-09-05-security-grafana-mcp-ssrf-session-spoofing-en)

## 事件概述

資安研究公司 Pillar Security 透過 Grafana 官方在 Intigriti 上的 bug bounty 計畫,揭露了 Grafana 官方 Model Context Protocol(MCP)server——也就是讓 AI agent 代替使用者查詢、管理 Grafana 儀表板、告警與資料來源的工具——存在一條可串接成 Critical 等級的漏洞鏈。第一個問題是認證缺口:v1.1.0 之前的版本只檢查 session ID 的格式是否正確(如 `mcp-session-<uuid>`),不驗證這個 ID 是否真的由伺服器發出給合法使用者,攻擊者可以自己捏造一個格式正確、但從未被發出過的 session ID,就能以伺服器設定的 Grafana service account 全部權限呼叫工具。第二個問題是 `grafana_api_request` 工具的 SSRF:這個工具設計上要讓 agent 代替使用者呼叫 Grafana HTTP API,但呼叫時可由使用者指定的 `X-Grafana-URL` 標頭沒有任何目的地限制,串接前一個認證缺口後,攻擊者不需要任何合法憑證,就能讓伺服器把請求發往內部服務或雲端 metadata 端點並讀取回應。Grafana 已於 8 月 10 日發布 v1.1.0 修補,SSRF 部分被列為 CVE-2026-19516,CVSS 3.1 評分 9.1(Critical)。受影響的 mcp-grafana 映像檔在 Docker Hub 上累積約 190 萬次下載。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | MCP server 認證繞過(session 偽造)串接伺服器端請求偽造(SSRF) |
| 影響範圍 | Grafana 官方 MCP server(`mcp-grafana`),v1.1.0 之前版本;未主動啟用 `--server-auth-token` 的 v1.1.0 及之後版本仍維持同等暴露 |
| 嚴重程度 | Critical(CVE-2026-19516,CVSS 9.1;無需任何合法憑證即可觸發,可讀取雲端 metadata 端點回應內容;目前無已知在野利用) |
| CVE | CVE-2026-19516(SSRF,CVSS 9.1,已修補於 v1.1.0);CVE-2026-15583(較早的憑證外流變體,CVSS 8.6,已修補於 v0.17.2) |
| 來源 | [Pillar Security(原始揭露)](https://www.pillar.security/blog/valid-but-never-issued-session-spoofing-and-ssrf-in-grafana-mcp), [Grafana Labs 官方安全公告](https://grafana.com/security/security-advisories/cve-2026-19516), [Cloud Security Alliance Labs 研究報告](https://labs.cloudsecurityalliance.org/research/csa-research-note-grafana-mcp-ssrf-session-spoofing-20260903) |

## 攻擊面分析

這條漏洞鏈之所以能從「限制較窄的個別缺陷」串成 Critical,關鍵在於兩個獨立設計失誤剛好互補。第一個失誤是認證形同虛設:v1.1.0 之前的伺服器「看起來」有 session 機制,實際上只做格式比對,從未要求 session 必須透過一次真正的認證交握才能發出——這種「有做認證的樣子、卻沒有認證的實質」比完全沒有 session 概念更危險,因為維運者容易誤以為未認證存取不可能發生。攻擊者只要能連上伺服器的網路端點(無論是直接暴露在網際網路、或是從共享內網、被入侵的鄰近工作負載可及),就能用自己捏造的 session ID 呼叫標準的 MCP `tools/list` 與 `tools/call` 方法,並拿到伺服器設定的完整權限。

第二個失誤是 `grafana_api_request` 工具本身:它接受呼叫者指定 HTTP method、路徑、body,以及最關鍵的 `X-Grafana-URL` 目的地覆寫標頭,卻沒有任何 allowlist 限制這個目的地必須是維運者原本設定的 Grafana 實例。Grafana 官方公告的說法很直接:「呼叫者可以把請求導向內部、loopback 與 link-local 網路服務」。串上第一個認證缺口後,攻擊者不需要任何合法憑證就能讓 MCP server 變成 Pillar Security 所說的「一個可讀、可指定方法的網路代理」——而 MCP server 因為要接觸內部工具與資料,往往就部署在雲端 VPC 內部、CI/CD 系統旁,或是與內部 API 同一網段,這個部署位置本身就是攻擊者要利用的資產。值得注意的是,Grafana 在更早之前已經修過一次相關問題(CVE-2026-15583,CVSS 8.6):當時的修法是讓伺服器自己的 service account 憑證不再跟著 `X-Grafana-URL` 一起被轉送出去,但沒有限制請求本身能發到哪裡去——這次的 CVE-2026-19516 證明,單獨補上「憑證不外流」這一關,並不能防止「請求本身被導去別的地方」這第二關。

對照 OWASP LLM Top 10,這起事件命中 **LLM06 Excessive Agency**——MCP server 代理使用者行動時,被賦予的權限遠超過單一請求實際需要的範圍,一旦認證形同虛設,攻擊者拿到的就是整個 service account 的權限,而不是被限縮過的最小權限。這也吻合 CSA 對 MCP 生態系的長期觀察:MCP 授權規格本身把 OAuth 2.1 列為「選配」而非強制,2025 年一次全網掃描就找到超過 1,800 台完全不驗證憑證即可連線的公開 MCP server,Grafana 這次的漏洞正是同一個結構性問題的具體案例。

## 防禦做法

現在能做的第一件事是升級,但升級本身不足以解決問題——因為修補後的認證機制預設仍是選配,團隊必須自己動手把它打開;長期則要把「目的地驗證」與「強制認證」當成 MCP server 上線前的標準審查項目,而不是每次出事才個案應對。watchlist B7 中專注 agent/工具鏈安全態勢的公司,可以幫忙做這類稽核與持續監控。

**立即動作**
- 將 Grafana MCP server 升級至 v1.1.0 或更新版本,並實際檢查執行中伺服器回報的版本號確認升級成功
- 升級後務必手動加上 `--server-auth-token` 旗標並只把 token 分發給合法呼叫者——不啟用這個旗標,升級後的伺服器仍會接受未認證請求
- 稽核所有 MCP server(不限於 Grafana)的網路暴露面,確認未暴露在不受信任的網段或公開網際網路
- 檢查 v1.1.0 針對「監聽超出 loopback 位址的未認證部署」新增的安全警告日誌,Grafana 已表示未來版本可能把這個情境改為啟動失敗

**長期架構**
- 對任何接受呼叫者指定 URL 或 host 參數的 MCP 工具,實作目的地 allowlist,限制只能打到維運者設定的目標實例
- 雲端部署環境應限制或封鎖 MCP server 所在網段對雲端 metadata 端點的存取(如 AWS 的 IMDSv2 強制、其他雲端的 metadata server 防火牆規則),讓 SSRF 即使發生也無法換到憑證
- 把「認證選配」視為 MCP server 安全審查時的紅旗,要求任何內部部署的 MCP server 在接上生產環境憑證前,必須先啟用強制、範圍受限的認證
- 評估 watchlist B7 中 Invariant Labs 的 MCP 安全掃描工具,對內部或第三方 MCP server 部署做認證設定與目的地驗證的自動化稽核;若團隊需要對 MCP server 安裝做集中式治理與 allowlist,也可評估 Netzilo 的 MCP runtime governance 方案

## 影響範圍

Pillar Security 估計受影響的 `mcp-grafana` 映像檔在 Docker Hub 上累積約 190 萬次下載,但下載次數無法區分實際生產部署與 CI、registry mirror 的重複拉取,實際暴露規模無法單靠這個數字推算。修補時間線相對快:Pillar 於 8 月 2 日透過 Intigriti 回報,Grafana 8 月 10 日發布 v1.1.0 修補,CVE-2026-19516 於 8 月 11 日公開,研究者 8 月 12 日獲列入 Grafana 安全名人堂——六個工作日內完成修補。但「修補完成」與「風險解除」在這個案例裡是兩件事:由於認證預設仍是選配,任何升級後沒有額外設定 `--server-auth-token` 的部署,暴露面與修補前並無差異。目前沒有公開證據顯示這條漏洞鏈已被用於實際攻擊。

對於任何把 MCP server 接上內部監控、CI/CD 或雲端控制平面憑證的團隊,這起事件提醒:MCP server 的網路部署位置本身就是資產,而「已修補」的版本號不代表安全設定已經到位,必須額外確認認證旗標與網路暴露面都已收斂。

## 今日收穫

過去看到「已修補」的 CVE 公告,直覺會認為風險已經解除,但這次事件顯示修補本身可能只是把安全防線從「強制」改成「選配」——升級版本號和真正把暴露面關上,是兩個需要分別驗證的步驟。這也解釋了為什麼 CSA 一路追蹤的「MCP 認證選配」問題會反覆出現在不同廠商的產品上:只要規格本身把認證列為選配,個別廠商的修補動作就永遠只能追著同一個結構性缺口跑。

## 參考資料

- [Valid, But Never Issued: Session Spoofing and SSRF in Grafana MCP — Pillar Security](https://www.pillar.security/blog/valid-but-never-issued-session-spoofing-and-ssrf-in-grafana-mcp)
- [Grafana MCP server-side request forgery via X-Grafana-URL header (grafana_api_request) — Grafana Labs Security Advisories](https://grafana.com/security/security-advisories/cve-2026-19516)
- [Grafana MCP Server: Session Spoofing Chained to SSRF — Cloud Security Alliance Labs](https://labs.cloudsecurityalliance.org/research/csa-research-note-grafana-mcp-ssrf-session-spoofing-20260903)
- [CVE-2026-19516: mcp-grafana SSRF Vulnerability — SentinelOne Vulnerability Database](https://www.sentinelone.com/vulnerability-database/cve-2026-19516)
