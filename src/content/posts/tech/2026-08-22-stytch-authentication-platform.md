---
title: "Stytch 深入介紹：從 B2C 登入、Session 到 B2B 組織與授權"
date: 2026-08-22
category: tech
type: deep-dive
tags: [stytch, authentication, authorization, passkeys, b2b-saas, identity]
lang: zh-TW
tldr: "Stytch 是 API-first 的託管身分平台：先選 Consumer 或 B2B 資料模型，再把登入因子收斂成 session，最後在伺服器端以 organization 與 RBAC 授權；它適合需要深度客製流程的團隊，不是把登入畫面貼上就結束。"
description: "拆解 Stytch 的 Consumer 與 B2B identity primitives、session、organization、RBAC、passkeys、風險防護與 M2M，並與 Clerk、WorkOS、Better Auth 比較。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-stytch-authentication-platform-en)

[Stytch](https://stytch.com/) 最準確的定位不是「passwordless 元件」，而是 API-first 的託管身分平台。你可以使用預製 UI，也可以從 SDK 或 REST API 自己組登入；真正的選型重點，是它能否承接 user/member → session → organization → authorization 的生命週期。

這也解釋了它與只解決登入畫面的工具有何不同。Stytch 把面向消費者的 Consumer Authentication，與有租戶邊界的 B2B Authentication 分成不同 project。前者核心物件是 User；後者是 Organization 與 Member，同一個人可在不同 organization 有不同 member、角色與登入政策。官方的[資料模型與功能指南](https://stytch.com/docs/get-started/guides/authentication)也把 SAML/OIDC SSO、SCIM、RBAC 與 organization management 放在 B2B 路徑，不應先建 Consumer project，再靠 application table 勉強補 tenancy。

## 第一層：選對 identity primitives

Consumer 適合 marketplace、金融或社群產品：可組合 email magic link、email/SMS/WhatsApp OTP、OAuth、密碼、MFA、WebAuthn/passkey 與行動裝置 biometrics。Passwordless 是選項，不是強迫；需要傳統密碼時仍有密碼強度與 breached-password 防護。

B2B 則以 organization 擁有 member。企業客戶可各自設定登入方式，透過 SSO JIT provisioning 或 SCIM 建立、停用 member，再把 IdP group 映射到角色。Discovery flow 先驗證 email，發出短效 intermediate session，讓使用者挑選或建立 organization，之後才換成完整 member session；官方[Discovery API](https://stytch.com/docs/api-reference/b2b/api/discovery/overview)呈現了這個「先確認人、再確認租戶」的分段流程。

Passkey 的邊界尤其要注意。Stytch 透過 WebAuthn API 管理註冊與驗證，但官方[整合指南](https://stytch.com/docs/consumer-auth/authentication/passkeys/login-sdk)要求 User 先以 email、phone、OAuth 等因子建立可復原身分，passkey 只能在之後註冊。這是合理的 account-recovery 設計，不是「無 email、無帳號」的首次註冊方案。

## 第二層：所有登入因子都收斂成 Session

登入成功後，Stytch 回傳 opaque `session_token` 與 `session_jwt`。Opaque token 每次送到 Stytch 驗證，能立即反映撤銷；JWT 可用快取的 JWKS 在本地驗證，少一次網路往返，但撤銷要等短效 JWT 到期。官方[Session 文件](https://stytch.com/docs/api-reference/b2b/api/sessions/overview)也記錄完成過哪些 authentication factors，讓後端能在匯款、改管理員等敏感操作要求 step-up authentication。

最小的 B2B 保護路由，可以直接在驗證 session 時一併檢查權限：

```ts
import stytch from "stytch";

const client = new stytch.B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID!,
  secret: process.env.STYTCH_SECRET!,
});

const auth = await client.sessions.authenticate({
  session_token: req.cookies.stytch_session,
  authorization_check: {
    organization_id: req.params.organizationId,
    resource_id: "documents",
    action: "write",
  },
});

// 只有驗證成功且具權限才執行 mutation。
await updateDocument(auth.member_id, req.body);
```

實際方法名稱要以所用 SDK 版本為準，但架構不變：secret 只放後端、先把 URL 中的 organization 與 session 所屬 organization 對齊，再做 authorization。不要只在 React 裡藏按鈕；Stytch 的[權限指南](https://stytch.com/docs/multi-tenant-auth/enterprise-ready/rbac/enforcing-permissions)也明確要求後端檢查。

## 第三層：Organization 與授權不是同一件事

Organization 解決「資料屬於哪個租戶」，RBAC 解決「這個 member 能對哪個 resource 做什麼 action」。Stytch policy 由 role、resource、action 組成，session authentication 可帶 `authorization_check`，沒有權限即回 403。這適合常見的 admin/editor/viewer 與 SCIM role mapping；若需求是文件逐筆分享、關係式或屬性式授權，仍應把細粒度 policy 放在應用資料庫或專門的 authorization engine，不能把 RBAC 硬扭成所有規則。

服務對服務則可用 OAuth 2.0 Client Credentials 的 M2M token，而非建立假的 human user。這很適合 cron、內部 service 或 agent workload；但 client secret 的輪替、audience/scope、短效 token 與稽核仍是你的責任。它提供的是 machine identity primitive，不是 workload runtime security。

## Fraud 與安全邊界

Stytch 的 Device Fingerprinting、Protected Auth、invisible CAPTCHA 與 new-device detection 能在登入面反制 bot、credential stuffing、trial abuse。官方[風險防護文件](https://stytch.com/docs/consumer-auth/authentication/fraud-and-risk)區分 observation 與 enforcement；建議先觀察誤判，再封鎖。Magic link 是一次性 token，亦有識別企業郵件 scanner 的處理；高風險流程仍應加 PKCE、短效 redirect token、MFA 與 transaction-level 風控，不能把「登入成功」等同「交易安全」。

資料界線也要畫清楚：Stytch 會保存使用者或 member identifiers、authentication factors、organization、session 與裝置/風險訊號，應視為正式資料處理者。後端 secret 不進瀏覽器；cookie 使用 `Secure`、`HttpOnly`、適當 `SameSite`；webhook 驗簽；離職與 SCIM deprovisioning 要撤銷 session；刪除、匯出、保存期、資料落地區域與 DPA 則在採購時逐項確認，不要由「通過某項合規」推論所有工作負載都合規。

## 融資與採用數字該怎麼讀

Stytch 在 2021 年完成 [9,000 萬美元 Series B、估值超過 10 億美元](https://techcrunch.com/2021/11/18/stytch-api-passwordless-unicorn/)。同一篇 TechCrunch 報導指出，使用平台的 developers 從 2021 年 7 月約 350 增至 11 月約 4,000；這是公司執行長當時提供給媒體的採用數字，不代表 2026 年的活躍 production customers。沒有可靠、可比的近期數字，就不補一個看似精確的客戶量。

截至 2026 年 8 月，官方[即時定價頁](https://stytch.com/pricing)列出 B2B self-serve 免費額度包含 10,000 MAU/agents、無限 organizations、5 個 SSO 或 SCIM connections 與 1,000 個 M2M tokens；超量、SMS/WhatsApp、fingerprint 與 branding 分開計費。定價會變，正式選型仍應用自己的 MAU、企業 connection 與 OTP 國家分布重算。

## 與 Clerk、WorkOS、Better Auth 怎麼選

| 方案 | 強項 | 比 Stytch 更適合的時候 | 要承擔的取捨 |
|---|---|---|---|
| Stytch | API-first B2C/B2B、session、fraud、M2M 同一平台 | 要客製登入流程，且 consumer 與 enterprise identity 都會成長 | 託管資料模型與供應商相依；複雜 policy 仍要外建 |
| [Clerk](https://clerk.com/docs) | 前端元件、profile 與 Next.js DX | 優先把漂亮的登入與 account UI 快速上線 | 深度 headless 流程與企業生命週期要逐項比較 |
| [WorkOS](https://workos.com/docs) | Enterprise SSO、Directory Sync、Admin Portal | 核心痛點是讓 B2B SaaS 快速 enterprise-ready | consumer fraud/passkey breadth 不是主要定位 |
| [Better Auth](https://www.better-auth.com/docs) | 開源、資料在自己的 DB、TypeScript plugin | 要 self-host、可攜性與直接控制 schema | 安全維運、寄信、風控與 enterprise connections 自己扛更多 |

Stytch 最適合願意理解身分模型、需要 headless API 控制，又不想自建 credential 與 session 基建的團隊。若只是內容站加一個社群登入、必須完全 self-host，或授權核心是高度關係式 policy，它通常不是最小方案。真正的決策點不是支援多少登入按鈕，而是你是否願意讓同一平台承接從因子、session 到 organization 的長期狀態，並保留足夠的 export、migration 與後端授權邊界。

## 參考資料

- [Stytch：Authentication and authorization](https://stytch.com/docs/get-started/guides/authentication)
- [Stytch：B2B Sessions overview](https://stytch.com/docs/api-reference/b2b/api/sessions/overview)
- [Stytch：RBAC overview](https://stytch.com/docs/api-reference/b2b/api/rbac/overview)
- [Stytch：Fraud & risk protections](https://stytch.com/docs/consumer-auth/authentication/fraud-and-risk)
- [Stytch pricing](https://stytch.com/pricing)
- [TechCrunch：Stytch raises $90M Series B](https://techcrunch.com/2021/11/18/stytch-api-passwordless-unicorn/)

