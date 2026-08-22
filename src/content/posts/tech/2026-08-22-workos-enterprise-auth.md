---
title: "WorkOS Enterprise Auth：從 AuthKit 登入一路長到 SSO、SCIM 與 Audit Logs"
date: 2026-08-22
type: deep-dive
category: "tech"
tags: [workos, authkit, enterprise-sso, scim, saml, audit-logs]
lang: zh-TW
description: "拆解 WorkOS 從 AuthKit、Organizations 到 SSO、Directory Sync 與 Audit Logs 的企業就緒路徑，以及與 Clerk、Stytch、Better Auth 的選型界線。"
tldr: "WorkOS 的優勢不是只有登入 UI，而是讓 B2B SaaS 沿同一個 organization identity model 逐步加入 SAML/OIDC、SCIM 與稽核輸出；authorization 與資料治理仍由應用負責。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-workos-enterprise-auth-en)

很多 B2B SaaS 一開始只需要 email login，第一張 enterprise deal 卻會一次帶來 SAML、SCIM、強制 MFA、離職停權與 audit log。若每一項各找一個元件，真正棘手的不是協定，而是同一個人如何在 user、SSO profile、directory user 與 organization membership 之間保持一致。

WorkOS 的產品脈絡正好沿著這條成熟曲線：用 AuthKit 與 User Management 建立登入和使用者底座，以 Organization 作為 tenant 邊界，再逐客戶開 SSO、Directory Sync、RBAC 與 Audit Logs。它能縮短企業功能的交付時間，但不能替你的產品決定誰可以讀哪一筆 invoice。

本文查核至 2026 年 8 月。定價採當時官方公開頁；沒有為了湊故事加入融資或未經證實的採用數字。

## 第一階段：AuthKit 與 User Management

[AuthKit](https://workos.com/docs/authkit/overview)提供 hosted UI 或 headless API，支援密碼、Magic Auth、social login、MFA、passkey 與 Enterprise SSO。這讓團隊可以先完成一般登入，同時從一開始就使用 WorkOS 的 User 與 Organization 模型，而不是成交後再把 consumer user table 硬接企業 IdP。

以 Next.js App Router 為例，最小整合是安裝 SDK、設定四個環境變數，建立 callback route，再從 server component 讀 session：

```ts
// app/auth/callback/route.ts
import { handleAuth } from '@workos-inc/authkit-nextjs'

export const GET = handleAuth({ returnPathname: '/app' })
```

```ts
// app/app/page.tsx
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function AppPage() {
  const { user, organizationId } = await withAuth()
  if (!user || !organizationId) redirect('/login')
  return <p>Signed in as {user.email}</p>
}
```

`WORKOS_API_KEY` 與至少 32 字元的 `WORKOS_COOKIE_PASSWORD` 必須只留在伺服器；完整設定與 PKCE／CSRF 行為見[官方 Next.js SDK 文件](https://workos.com/docs/sdks/authkit-nextjs)。前端看到 user 不代表後端已授權，每一個資料查詢仍要以驗證過的 session 與 `organizationId` 限縮 tenant。

Organization 應從第一天就是資料模型的一部分，而不是 SSO 的附加欄位。一個 user 可以屬於多個 organization；membership 承載角色與 tenant 關係。你的資料表應保存穩定的 WorkOS ID，並把 `organization_id` 放進唯一鍵、查詢條件與 audit event，而不是靠 email domain 猜 tenant。[官方文件](https://workos.com/docs/authkit/users-organizations)說 Organization 是一級物件，且沒有建立數量上限。

## 第二階段：每個企業客戶一條 SSO connection

SSO 解決「用哪個 IdP 證明身分」。WorkOS 把 SAML 與 OIDC 的差異正規化，並可透過 Admin Portal 讓客戶 IT 自助設定。每個 enterprise customer 通常對應一條 connection；同一產品可以讓 Acme 用 Okta SAML、Beta 用 Microsoft Entra ID OIDC。

這裡要區分三件事：

- SSO 驗證使用者當下能否登入。
- JIT provisioning 可在首次登入建立 user／membership，但無法預先停權一個尚未登入的人。
- SSO assertion 的 group 或 role 只是輸入；應用仍要定義 permission 與資源層檢查。

WorkOS 可把 SSO group 映射到 membership role，但[角色文件](https://workos.com/docs/authkit/roles-and-permissions)建議每個 organization 只選一個主要角色來源。若 Directory group、SSO group 與人工指派同時改角色，優先順序會成為難以稽核的隱性政策。

## 第三階段：Directory Sync 與 SCIM 管完整生命週期

當客戶問「員工離職後多久會失去權限」，只做 SSO 通常不夠。SCIM 是 identity provisioning 標準；Directory Sync 接收 IdP 或 HRIS 的 user／group 建立、更新與停用，再以 API 或 webhook 同步到你的應用。[WorkOS Directory Sync](https://workos.com/docs/directory-sync)把 directory 定義為客戶 user 與 group 清單的 source of truth。

採用 AuthKit Directory Provisioning 時，每個 organization 需要自己的 directory integration。對已驗證 organization domain 的使用者，directory 可管理 membership 與 profile attribute；deprovisioning 也會反映到 AuthKit。[官方 provisioning 文件](https://workos.com/docs/authkit/directory-provisioning)指出，directory-sourced attributes 會優先於 SSO、API 或 dashboard 的修改。

實作上不要只處理 `user.created`：

1. 以 WorkOS event ID 做冪等，接受 webhook 重送與亂序。
2. 將停用視為撤銷 session、membership 與下游資料權限的工作流程，而不只是改 UI 狀態。
3. 保存外部 immutable ID，不以會變更或重複的 email 當唯一身分。
4. 做週期性 reconciliation；webhook 成功回 200 不代表所有下游系統都一致。

同一人可能先被 SCIM provision，之後才用 SSO 登入。WorkOS 的[identity linking 規則](https://workos.com/docs/authkit/identity-linking)優先使用 IdP 的穩定識別碼，再退回已驗證 email，目的就是避免 email 變更製造重複帳號。即使如此，merge、跨 organization 同 email 與 guest domain 仍要用測試資料演練。

## 第四階段：Organization authorization 與 Audit Logs

Authentication 回答「你是誰」，authorization 回答「你在這個 organization 能做什麼」。WorkOS 提供角色與權限，但 route、service、database policy 仍要 fail closed。不要只在 React 隱藏「刪除」按鈕；後端需同時驗證 session、active organization、membership 與 permission。對高風險操作，還要防止使用者切換 organization 後重播舊 request。

Audit log 也不是一般 debug log。應記錄不可否認的 actor、action、target、organization、時間、來源 IP 與必要 metadata，避免放 token、密碼、完整 SAML assertion 或不必要 PII。WorkOS Audit Logs 支援 JSON schema 驗證、查詢、CSV export 與串流至客戶 SIEM；[export API](https://workos.com/docs/reference/audit-logs/export)一次以 organization 與日期範圍產生匯出，下載 URL 只在有限時間有效。

事件應從業務交易成功的地方送出，而不是只相信 UI click。若 `invoice.deleted` 已成功但 audit API 暫時失敗，使用 transactional outbox 或 durable queue 重試；否則最需要稽核的事故恰好會留下洞。

## 成本會隨 enterprise connections，而非只隨 MAU

截至 2026 年 8 月，[WorkOS 公開定價](https://workos.com/pricing)列出 AuthKit 前 100 萬 monthly active users 免費，之後每額外 100 萬為每月 2,500 美元；SSO 與 Directory Sync 各自在 1–15 connections 時為每條每月 125 美元，量大有階梯折扣。Audit Logs 的 SIEM connection 為每條每月 125 美元，保存每百萬 events 為每月 99 美元。這些是官方即時標價，不含合約折扣、支援方案與未來變更。

所以報價模型應把「一個 enterprise customer 可能需要 SSO + Directory Sync + SIEM」算進 gross margin。好處是 connection 不隨該客戶的終端使用者數增加；壞處是小客戶很多時，connection 數會比 MAU 更快長。

## 與 Clerk、Stytch、Better Auth 怎麼選

| 選項 | 產品重心 | 較適合 | 主要代價 |
| --- | --- | --- | --- |
| WorkOS | 從 AuthKit 延伸到企業 SSO、Directory Sync、Admin Portal、Audit Logs | B2B SaaS 預期逐步接受企業 IT 要求 | 身分與企業功能深入 vendor；應用授權仍須設計 |
| Clerk | 強調 prebuilt UI、session 與 organization DX，也提供 organization-level SAML/OIDC | 前端整合速度、組織切換體驗優先 | 逐功能核對 SCIM、audit 與方案界線；見[Clerk Organizations](https://clerk.com/docs/guides/organizations/overview) |
| Stytch | B2B API 將 organization auth policy、SSO、SCIM、RBAC 集中配置 | 想細緻控制每 tenant 驗證政策的 API-first 團隊 | B2B/B2C 模型與 SDK 要先對齊；見[Organizations API](https://stytch.com/docs/api-reference/b2b/api/organizations/overview) |
| Better Auth | TypeScript、自有資料庫、plugin 架構；Organization、SSO、SCIM 可組合 | 要資料控制、自架與程式碼層客製 | 維運、升級、SAML／SCIM interoperability 與 on-call 責任在自己；SCIM 在[官方文件](https://better-auth.com/docs/beta/plugins/scim)仍標為 beta |

若已有成熟 auth，只缺企業 SSO／SCIM，WorkOS 也可作為 standalone enterprise layer，不必強制搬到 AuthKit。若產品仍在零到一，統一採 AuthKit 能減少 identity linking 膠水。Better Auth 的自架自由度最高，但「套件免費」不等於企業 onboarding、憑證輪替與 directory edge cases 沒有成本。

## 安全與資料界線

WorkOS 會處理 email、profile、organization、IdP identifiers，以及依設定同步的 directory attributes。其[安全頁](https://workos.com/security)列出 SOC 2 Type 2、年度第三方滲透測試與 GDPR／CCPA，並說明企業方案可簽 HIPAA BAA；[DPA](https://workos.com/legal/data-processing-addendum)則描述傳輸中與靜態加密、logical separation 與 subprocessor access controls。合規標章是供應商控制的證據，不是你的應用自動合規。

上線前至少要完成 key rotation、staging／production 隔離、callback allowlist、webhook signature 驗證、domain ownership 驗證、break-glass 帳號、SCIM token 撤銷與離職測試。也要畫清資料責任：WorkOS 是 identity system，你的資料庫通常仍是產品 authorization 與資源 ownership 的 source of truth，SIEM 則是長期稽核與偵測系統。

## 適合與不適合

WorkOS 適合 enterprise roadmap 已可預見、希望客戶 IT 自助 onboarding、且不想自己維護每家 SAML／SCIM 方言的 B2B SaaS。它尤其適合用 organization 作為天然 tenant 的產品。

若只做單人 consumer app、必須完全離線或自架、需要高度特殊的 identity graph，或無法接受身份資料經第三方處理，就不一定適合。另一個警訊是團隊把 authorization 尚未定義的問題交給 auth vendor：沒有清楚 resource model 與 permission semantics，換任何供應商都只是把登入頁做得更快。

## 結論

WorkOS 最合理的採用方式不是一次打開所有 enterprise checkbox，而是守住一條連續的 identity model：AuthKit 建 user，Organization 建 tenant，SSO 驗身分，Directory Sync 管生命週期，authorization 管資源權限，Audit Logs 留下可交付證據。

當這些邊界清楚，企業功能可以隨 deal 成長而增加；邊界不清楚時，SSO 成功登入反而可能掩蓋跨 tenant 與離職未撤權的風險。Enterprise ready 的標準不是「支援 SAML」，而是從入職、使用、轉調到離職，每一步都能解釋、撤銷與稽核。

## 參考資料

- [WorkOS AuthKit Overview](https://workos.com/docs/authkit/overview)
- [WorkOS Users and Organizations](https://workos.com/docs/authkit/users-organizations)
- [WorkOS Directory Sync](https://workos.com/docs/directory-sync)
- [WorkOS Directory Provisioning](https://workos.com/docs/authkit/directory-provisioning)
- [WorkOS Roles and Permissions](https://workos.com/docs/authkit/roles-and-permissions)
- [WorkOS Audit Logs](https://workos.com/audit-logs)
- [WorkOS Pricing](https://workos.com/pricing)
- [WorkOS Security](https://workos.com/security)
