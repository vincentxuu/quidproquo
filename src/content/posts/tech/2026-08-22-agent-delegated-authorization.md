---
title: "AI Agent 代理授權：不要把使用者 Token 直接交給模型"
date: 2026-08-22
category: tech
type: deep-dive
tags: [ai-agent, authorization, oauth, security, identity, authzen]
lang: zh-TW
tldr: "Agent 應以短效、限 audience、限權限的代理憑證執行單一任務，並同時保留使用者與 agent 身分、執行時授權、確認與稽核鏈。"
description: "以 OAuth Token Exchange、Resource Indicators、RAR、DPoP 與 AuthZEN 設計 AI agent 代替使用者操作的授權模型。"
series:
  name: "AI 時代的技術選擇"
  order: 49
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-agent-delegated-authorization-en)

當 AI agent「代替使用者」寄信、付款或改 production，問題不只是 authentication。系統必須同時知道：誰委託、哪個 agent/client 在執行、能對哪個 resource 做哪個 action、有效多久，以及是否需要再次確認。

最危險的捷徑，是把使用者 session cookie、API key 或 OAuth refresh token 塞進 prompt。模型輸入、trace、tool log 與第三方 connector 都可能擴大洩漏面；一張廣權限長效 token 也無法表達「只允許這一次退款」。

## 把委託編譯成最小權限憑證

```text
使用者 session / consent
          ↓
    token broker / STS
          ↓  短效、限 audience、限 action/resource
 agent orchestrator ──→ tool API 的 PEP ──→ 執行
                         ↓
                    PDP 授權決策
                         ↓
                    immutable audit
```

[OAuth Token Exchange](https://www.rfc-editor.org/rfc/rfc8693.html) 提供交換 token，以及 subject/actor 等表達方式；它本身不會自動產生完整代理政策。[Resource Indicators](https://www.rfc-editor.org/rfc/rfc8707.html) 限制 token 要送往哪個 resource server，scope 則限制能做什麼。[Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396.html) 可用 `authorization_details` 描述較細的 action 與資源。

broker 應在每個 tool call 前簽發短效 token，不把原始 refresh token 給 orchestrator。token 至少綁定 audience、scope/action、subject、agent/client identity、tenant、期限與 delegation id；可行時用 [DPoP](https://www.rfc-editor.org/rfc/rfc9449.html) 將 token 綁到持有的 key，降低 token 被偷後重放的風險。

## 授權要在執行點重新判斷

prompt 內容與 tool 名稱只是未信任的 intent，不是 authorization。每個 API 都要作為 policy enforcement point（PEP），驗證 token，再以 subject、resource、action、context 詢問 policy decision point（PDP）。[AuthZEN Authorization API 1.0](https://openid.github.io/authzen/) 標準化這種 PEP/PDP 決策介面，但它是通用授權 API，不是 agent 專用框架。

context 可包含 tenant、交易金額、資料敏感度、時間與風險分數。政策在實際執行前重算，才能反映成員剛被移除、資源已換 owner、budget 已用完或使用者已撤銷委託。

## 確認、撤銷與稽核都是產品介面

列出草稿可自動執行，寄出郵件、刪除資料、付款與 production 變更則應顯示精確 diff、對象和影響，再取得一次性確認。確認綁定具體 action digest，不能拿「同意 agent 幫忙」重放成另一個動作。

每次執行記錄 human subject、agent/client、delegation chain、policy/version、resource、decision、tool input digest 與結果；敏感內容做遮罩，token 永遠不進 log。另設 expiry、revoke、單次/金額 budget、tool allowlist 與 emergency kill switch。

若 agent 只讀低敏感內部資料，service account 加嚴格 tenant filter 可能夠用。只要牽涉跨使用者資源、外部 OAuth 或不可逆操作，就該建立 token broker 與集中政策。驗收不是問模型「會不會守規則」，而是竄改 prompt、重放 token、換 audience、移除 membership，再確認 API 層全部拒絕。

## 參考資料

- [OAuth 2.0 Security Best Current Practice (RFC 9700)](https://www.rfc-editor.org/rfc/rfc9700.html)
- [OAuth 2.0 Token Exchange (RFC 8693)](https://www.rfc-editor.org/rfc/rfc8693.html)
- [OAuth 2.0 Resource Indicators (RFC 8707)](https://www.rfc-editor.org/rfc/rfc8707.html)
- [OAuth 2.0 Rich Authorization Requests (RFC 9396)](https://www.rfc-editor.org/rfc/rfc9396.html)
- [OAuth 2.0 Demonstrating Proof of Possession (RFC 9449)](https://www.rfc-editor.org/rfc/rfc9449.html)
- [AuthZEN Authorization API 1.0](https://openid.github.io/authzen/)
