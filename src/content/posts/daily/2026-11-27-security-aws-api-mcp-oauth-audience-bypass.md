---
title: "資安警報｜AWS API MCP Server OAuth 權杖稽核漏洞——跨應用借用他人憑證呼叫 AWS API"
date: 2026-11-27
category: daily
tags: [ai-agent, security, daily, privilege-escalation]
lang: zh-TW
description: "AWS 官方確認 API MCP Server 在 OAuth 模式下沒有驗證權杖的 audience 欄位，同租戶內核發給別的應用程式的權杖也會被接受，可能讓呼叫者借用 host 設定的 AWS 憑證執行 API 操作"
tldr: "CVE-2026-115413：AWS API MCP Server 1.3.0–1.5.x 在 streamable-http + OAuth 模式下只驗證權杖的簽章、發行者與到期時間，沒驗證 audience，導致同一租戶內核發給別的應用程式的權杖也能通過驗證。已在 1.6.0 修補，強制設定 AUTH_AUDIENCE 或 AUTH_CLIENT_ID。這起漏洞是資安公司 Alt Security 用 AI 工具在 3 天內挖出的一批（公開 5 個、私下通報數十個）MCP 相關漏洞之一。"
series:
  name: "AI Security Alert"
  order: 88
---

> :globe: [English version](/posts/daily/2026-11-27-security-aws-api-mcp-oauth-audience-bypass-en)

## 事件概述

AWS 於 2026 年 10 月 27 日發布官方安全公告，確認開源的 AWS API MCP Server（讓 AI assistant 透過 MCP 呼叫 AWS CLI／API 的伺服器）存在 OAuth 權杖稽核漏洞，編號 CVE-2026-115413。問題出在伺服器設定為 `streamable-http` 傳輸並啟用 OAuth 認證時，只檢查權杖的簽章、發行者（issuer）與到期時間，卻沒有檢查權杖的 audience（這個權杖原本是核發給哪個應用程式用的）。這起漏洞是由資安公司 Alt Security 的研究員 Yuval Elbar 透過協同揭露流程通報，且是該公司近期針對 MCP 生態系一波大規模掃描中，少數已完整走完揭露流程並取得 CVE 的案例——根據 *Newsweek* 11 月 25 日的獨家報導，Alt Security 用 AI 掃描工具「Peter」在 3 天內於 MCP 相關軟體中找出數十個漏洞，目前只公開了其中 5 個，其餘仍在等待廠商修補。

**基本資訊**

| 項目 | 值 |
|---|---|
| 事件類型 | Broken Authentication / Token Audience 驗證缺失（MCP OAuth） |
| 影響範圍 | `awslabs.aws-api-mcp-server` 版本 >=1.3.0 且 <1.6.0，僅限設定為 `streamable-http` + OAuth 認證的部署 |
| 嚴重程度 | High（AWS 列為 Important，需處理） |
| CVE | [CVE-2026-115413](https://www.cve.org/CVERecord?id=CVE-2026-115413) |
| 來源 | [AWS 官方安全公告 2026-152-AWS](https://aws.amazon.com/security/security-bulletins/2026-152-aws/)、[GitHub Security Advisory GHSA-4prq-p2x5-w9fh](https://github.com/awslabs/mcp/security/advisories/GHSA-4prq-p2x5-w9fh)、[Newsweek](https://www.newsweek.com/anthropic-ethical-hackers-exposed-security-flaws-12768208) |

## 攻擊面分析

AWS API MCP Server 可以設定成用 `streamable-http` 傳輸，並對外要求呼叫端帶著 OAuth bearer token，伺服器再向 operator 指定的身分提供者（例如某個 Amazon Cognito user pool）驗證這個 token。問題是驗證邏輯只檢查了三件事：權杖的簽章是否正確、發行者是誰、有沒有過期——漏掉了 OAuth 規格裡本來就該檢查的 `aud`（audience）欄位，也就是「這個權杖當初是核發給哪一個應用程式用的」。

後果是：只要攻擊者（或任何本地的呼叫端）手上握有同一個身分提供者、同一租戶內核發給**另一個應用程式**的合法權杖（例如同一個 Cognito user pool 底下的第二個 app client），這個權杖照樣會被 AWS API MCP Server 接受。伺服器本身不會因此洩漏新的憑證——它執行 AWS API 呼叫時用的是 host 上設定好的 AWS 憑證，而不是呼叫端的身分——但這代表任何能取得「鄰居」權杖的呼叫端，都能借用這個 MCP server 背後那組 AWS 憑證的全部權限,執行該憑證被授權的任何 AWS API 操作。

```diagram
title: 跨應用借用他人 OAuth 權杖呼叫 AWS API
desc: App B 向 MCP Server 出示身分提供者核發給自己的合法 token，MCP Server 只驗簽章、issuer、效期，沒驗 audience，於是接受這個「別人的」token，並用 host 設定的 AWS 憑證執行 API 呼叫。
---
<svg viewBox="0 0 640 352">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="336"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="336"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="336"/>

  <g>
    <path class="dg-line" d="M96 120H312" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">呼叫 MCP tool</text>
  </g>
  <g>
    <path class="dg-line" d="M324 168H352Q360 168 360 176V184Q360 192 352 192H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="372" y="180" text-anchor="start" dominant-baseline="central">漏驗 audience</text>
  </g>
  <g>
    <path class="dg-line" d="M324 216H536" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="430" y="204" text-anchor="middle" dominant-baseline="central">呼叫 AWS API</text>
  </g>
  <g>
    <path class="dg-line dg-line--dashed" d="M540 264H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="434" y="252" text-anchor="middle" dominant-baseline="central">200 回應</text>
  </g>
  <g>
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 312H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-text--accent" x="208" y="300" text-anchor="middle" dominant-baseline="central">200（也成功）</text>
  </g>

  <rect class="dg-box" x="540" y="204" width="8" height="72" rx="2"/>
  <rect class="dg-box dg-box--accent" x="316" y="108" width="8" height="216" rx="2"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">App B</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">MCP Server</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">AWS API</text>
</svg>
```

這本質上是一種 confused deputy：MCP server 把「這個權杖合法」錯誤地等同於「這個呼叫端有權使用我」，根本原因是沒有落實 MCP 規格本身早就要求的 token audience 驗證（[MCP Authorization 規格](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) 與 [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet) 都把「驗證每個 access token 的 audience 是不是這台 MCP server 自己」列為基本要求）。對照 OWASP LLM Top 10，這屬於 **LLM06 Excessive Agency**——MCP server 用一組高權限的 host 憑證代替呼叫者行事，一旦身分稽核出現漏洞，攻擊面就直接放大到那組憑證能做的所有事。

## 防禦做法

**立即動作**
- 檢查是否使用 `awslabs.aws-api-mcp-server`，且設定為 `streamable-http` + OAuth：`pip show awslabs.aws-api-mcp-server` 或查 MCP client 設定檔裡的 transport/auth 設定
- 立即升級到 [1.6.0 以上](https://pypi.org/project/awslabs.aws-api-mcp-server/1.6.0/)，並依新版要求設定 `AUTH_AUDIENCE`（或對沒有 audience claim 的身分提供者，如 Cognito，設定 `AUTH_CLIENT_ID`）
- 若暫時無法升級：改用預設的 `stdio` 傳輸而非 `streamable-http`，可規避此問題（但失去 remote 存取能力）

**長期架構**
- 任何自建或整合第三方 MCP server 時，把「audience 驗證」當成 OAuth 整合的強制檢查項,不要只驗簽章/issuer/過期時間就視為通過
- 幫 MCP server 設定的 host 端 AWS 憑證做最小權限：這類漏洞的實際傷害上限,就是那組憑證能做的事,權限收得越窄,稽核失敗時的風險上限越低
- 導入像 Zenity 這類 AI agent 身分與存取治理工具，持續掃描組織內 MCP server 的 OAuth 設定（scope、audience、token 存活時間）是否符合最小權限與正確稽核，而不是靠單次安全公告事後補救

## 影響範圍

目前沒有證據顯示這個漏洞已被實際利用——它是在協同揭露流程中由研究員主動通報，AWS 於 10 月 27 日發公告並同步釋出修補版本 1.6.0，走的是標準「先修補、後公開」流程。真正值得注意的是背景:根據 Alt Security 的揭露,這只是他們用 AI 工具在 MCP 生態系中找到的其中一個、且是少數已完整走完揭露流程的案例;研究員宣稱還有數十個漏洞分散在不同廠商的 MCP 相關軟體中,處於私下通報、尚待修補的狀態。對任何部署了 MCP server 並串接 OAuth 身分提供者的團隊而言,這提示的不是「這一個 CVE 要修」,而是「MCP 的 OAuth 整合這塊,業界普遍還沒做對」。

## 今日收穫

這起事件的技術細節本身不複雜——就是漏了驗證一個 JWT 欄位——但背景訊息更值得記住:一家資安公司用 AI 工具在 3 天內掃出數十個 MCP 相關漏洞,而正式走完揭露流程、拿到 CVE 的只有 5 個。這代表現在 MCP 生態系裡「已知但未修補」的漏洞存量,很可能遠大於任何一天的資安警報能呈現的數字,把稽核做對這件事本身,正在被 AI 加速的雙邊都當成優先事項。

## 參考資料

- [AWS Security Bulletin 2026-152-AWS — CVE-2026-115413: AWS API MCP Server OAuth token audience validation bypass](https://aws.amazon.com/security/security-bulletins/2026-152-aws/)
- [GitHub Security Advisory GHSA-4prq-p2x5-w9fh — AWS API MCP Server OAuth Token Audience Validation Bypass](https://github.com/awslabs/mcp/security/advisories/GHSA-4prq-p2x5-w9fh)
- [CVE-2026-115413 — CVE.org Record](https://www.cve.org/CVERecord?id=CVE-2026-115413)
- [Newsweek — Ethical Hackers Uncover Security Flaws in AI Tools Using Anthropic-Pioneered Protocol](https://www.newsweek.com/anthropic-ethical-hackers-exposed-security-flaws-12768208)
- [MCP Authorization Specification](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet)
