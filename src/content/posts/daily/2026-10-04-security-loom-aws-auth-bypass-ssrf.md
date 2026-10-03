---
title: "資安警報｜Loom for AWS 認證繞過＋SSRF 連環漏洞——沒設身分提供者的 agent 控制面板形同不設防"
date: 2026-10-04
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "AWS 發布兩份資安公告，修補開源 AI agent 協調平台 Loom for AWS 的認證繞過與雙重 SSRF 漏洞，以及 SageMaker Unified Studio 的指令注入漏洞，最高 CVSS 達 10.0。"
tldr: "AWS 於 10 月 2 日公布 CVE-2026-103956／103957／103958（Loom for AWS）與 CVE-2026-104019（SageMaker Unified Studio）。最嚴重的一個：沒設身分提供者時，任何網路用戶端都能拿到 agent 控制面板的完整管理權限；另外兩個 SSRF 漏洞讓已驗證使用者能逼 MCP 工具伺服器／A2A 連線打到容器內部的憑證端點。AWS 未回報已遭利用，已發布 1.7.0 修補版。防禦：立即升級、收斂 mcp:write／a2a:write 範圍、升級後輪換所有相關憑證。"
series:
  name: "AI Security Alert"
  order: 45
---

> 🌏 [English version](/en/posts/daily/2026-10-04-security-loom-aws-auth-bypass-ssrf-en)

## 事件概述

AWS 於 2026 年 10 月 2 日發布兩份資安公告，修補開源 AI agent 協調平台 Loom for AWS 的三個漏洞，以及 Amazon SageMaker Unified Studio 的一個指令注入漏洞。最嚴重的一個（CVSSv4 10.0）出現在沒有設定身分提供者的部署中：任何網路用戶端都能直接取得 agent 控制面板的完整管理權限，包括讀取已儲存的整合憑證、改寫綁定在受管理 agent 角色上的 IAM 政策。另外兩個漏洞屬於伺服器端請求偽造（SSRF），讓擁有 `mcp:write` 或 `a2a:write` 權限範圍的已驗證使用者，能讓 Loom 的 MCP 工具伺服器或 A2A 遠端 agent 連線邏輯連到任意內部位置，包含容器的憑證供應端點。AWS 目前未回報任何實際遭利用的案例，已發布修補版本 1.7.0（CVE-2026-103956 已先在 1.6.1 修復）。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | 認證繞過＋SSRF（AI agent 控制面板接管） |
| 影響範圍 | Loom for AWS < 1.7.0（AWS Labs 開源 AI agent 協調平台）；Amazon SageMaker Distribution 多個版本（SageMaker Unified Studio） |
| 嚴重程度 | Critical（CVE-2026-103956 CVSSv4 10.0） |
| CVE | CVE-2026-103956、CVE-2026-103957、CVE-2026-103958、CVE-2026-104019 |
| 來源 | [AWS Security Bulletin 2026-124-AWS](https://aws.amazon.com/security/security-bulletins/2026-124-aws/)、[gbhackers.com](https://gbhackers.com/aws-ai-agent-vulnerabilities/)、[securityonline.info](https://securityonline.info/loom-for-aws-sagemaker-flaws/)、[NVD CVE-2026-103956](https://nvd.nist.gov/vuln/detail/CVE-2026-103956) |

## 攻擊面分析

CVE-2026-103956 是「不安全預設初始化」（CWE-1188）加上「關鍵功能缺少身分驗證」（CWE-306）的組合：當 Loom 部署沒有設定 Cognito user pool 或外部身分提供者時，平台把這種狀態當成本機開發模式處理，卻沒有把這個假設延伸到「只允許 loopback 存取」這一步——一旦部署對外部網路開放，門等於沒關。任何打進應用程式 API 的請求都能拿到 super-admin 等級的 agent 控制面板權限，接著就能註冊惡意工具伺服器、讀出已儲存的第三方整合憑證，甚至直接改寫掛在受管理 agent 角色上的 IAM 政策——相當於從「進得了這個 agent 平台」直接跳到「拿到雲端帳號的鑰匙」。

另外兩個漏洞需要攻擊者已經是擁有 `mcp:write` 或 `a2a:write` 權限範圍的已驗證使用者，但影響同樣嚴重。CVE-2026-103957 利用 OAuth2 discovery 流程：攻擊者設定一個惡意的 well-known discovery URL，讓後端在走 OAuth2 流程時把 client secret 或其他使用者的 access token 送到第三方端點——1.6.1 版雖然擋掉了「連到內部位址」這條路，卻沒完全解掉「憑證外洩到外部端點」這個根本問題，直到 1.7.0 才補齊。CVE-2026-103958 則是更直接的 SSRF：Loom 的 MCP 工具伺服器與 A2A 遠端 agent 連線邏輯沒有限制連線目的地，讓攻擊者能指向容器內部的憑證供應端點（credential-vending endpoint），讀出回應內容換成暫時性 AWS 憑證，再拿這組憑證對 IAM 角色能存取的雲端資源動手。

對照 OWASP LLM Top 10／Agentic Top 10，CVE-2026-103956 對應**身分與權限濫用**——agent 控制面板本身就是高權限主體，預設開放等於把管理權交給任何人；兩個 SSRF 漏洞則對應**過度代理＋不安全的工具／連線邊界**。MCP 工具伺服器與 A2A 這類設計給 agent 彼此溝通、呼叫外部工具的機制，如果沒有限制可連線的目的地，天生就是 SSRF 的放大器——這些連線邏輯本來就是設計成「代表 agent 去連外部服務」，攻擊者只是把「外部」換成「內部的憑證端點」。

## 防禦做法

現在可以做的是立即升級並收斂權限範圍；長期則要把 agent 控制面板當成高權限管理介面、把對外連線一律過出站管控。

**立即動作**
- 檢查 Loom 部署版本，未達 1.7.0 立即升級到 `v1.7.0`（CVE-2026-103956 的止血版本是 1.6.1，但 1.7.0 才完整修復全部三個漏洞）
- 升級前的暫時止血：確認已設定 Cognito user pool 或外部身分提供者，且 `LOOM_ALLOW_UNAUTHENTICATED_LOCAL_DEV` 沒有在正式環境打開
- 收斂 `mcp:write`、`a2a:write` 範圍（對應 `g-admins-super`、`g-admins-mcp`、`g-admins-a2a`、`g-admins-demo` 群組）只給信任的管理員，降低 SSRF 漏洞被觸發的機會
- SageMaker Unified Studio 使用者：重新啟動受影響的 Studio Space，套用已全域部署的修補映像

**長期架構**
- 升級後務必輪換所有 MCP／A2A 整合用的 OAuth2 client secret、撤銷並重發在受影響期間有效的 access token；若懷疑容器角色憑證被讀取，一併輪換 IAM 角色的 session 憑證並檢查 CloudTrail 紀錄
- 把 agent 控制面板當成高權限管理介面對待：不該假設內部網路部署就等於安全，身分驗證應該是預設開啟而非選配
- 任何會讓 agent 對外發起連線的機制（MCP 工具伺服器、A2A 遠端 agent、webhook callback）都該過一層出站網路管控（egress allowlist），避免連線目的地可以被使用者設定成內部位址；watchlist B7 的 Netzilo、Invariant Labs 這類做 MCP server 執行期治理與流量稽核的工具，正是處理這類「工具呼叫邊界」問題的切入點

## 影響範圍

AWS 在兩份公告中都表示尚未觀察到任何實際遭利用的案例，四個 CVE 目前都標記「Not exploited」。但 Loom 本身是開源平台，AWS 特別提醒「任何 forked 或衍生版本」都要一併套用修補——這類提醒通常意味著已經有其他雲端供應商或企業把 Loom fork 進自家內部工具鏈，修補的擴散速度會比官方版本慢。CVE-2026-103956 的影響尤其值得注意：只要部署時沒有認真走完身分提供者設定這一步，等於把整個 agent 控制面板——包括它能觸及的所有雲端資源——暴露給任何打得到這個網路位址的人，這在很多「先求能動，之後再補安全設定」的內部工具上線流程裡，是很容易被忽略的一步。

## 今日收穫

這三個 Loom 漏洞最值得記住的不是任何單一技術細節，而是它們共同指向同一個模式：AI agent 協調平台把「MCP 工具伺服器」「A2A 遠端 agent 連線」這類原本設計給 agent 彼此溝通用的機制，實際上變成了可以被使用者操控的出站連線入口。換句話說，agent 間溝通協定裡「信任彼此」的預設假設，一旦混進使用者可控的輸入（discovery URL、連線目的地），就自動變成 SSRF 的攻擊面——這跟傳統 Web 應用的 SSRF 幾乎是同一套邏輯，只是載體換成了 agent 協調平台。

## 參考資料

- [AWS Security Bulletin 2026-124-AWS — CVE-2026-103956, CVE-2026-103957, and CVE-2026-103958: Issues in Loom for AWS](https://aws.amazon.com/security/security-bulletins/2026-124-aws/)
- [AWS Security Bulletin 2026-125-AWS — SageMaker Distribution command injection](https://aws.amazon.com/security/security-bulletins/2026-125-aws/)
- [gbhackers.com — AWS AI Agent Vulnerabilities Let Attackers Bypass Authentication and Steal Credentials](https://gbhackers.com/aws-ai-agent-vulnerabilities/)
- [securityonline.info — AWS Fixes Loom for AWS Admin Takeover and SageMaker Unified Studio Code Execution Flaws](https://securityonline.info/loom-for-aws-sagemaker-flaws/)
- [NVD — CVE-2026-103956](https://nvd.nist.gov/vuln/detail/CVE-2026-103956)
- [Loom for AWS v1.7.0 release](https://github.com/awslabs/loom/releases/tag/v1.7.0)
