---
title: "Better Auth：把 TypeScript 認證放回應用程式裡，值得嗎？"
date: 2026-08-22
type: deep-dive
category: "tech"
tags: [better-auth, authentication, typescript, passkeys, sso, authorization]
lang: zh-TW
description: "從資料庫、session、plugin 到授權，拆解 Better Auth 的 self-owned 身分生命週期，以及它和 Clerk、WorkOS、Stytch 的選型界線。"
tldr: "Better Auth 用程式庫與自有資料庫換來身分資料、流程和部署的控制權；代價是 migration、安全更新與事故處理也回到自己手上。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-better-auth-typescript-en)

Better Auth 不是另一個把使用者資料送進廠商控制台的登入 API。它是嵌入 TypeScript 應用程式的 authentication / authorization framework：路由跑在你的服務裡，核心資料表放在你的資料庫，進階能力再由 plugin 疊上去。官方也把它定位為 framework-agnostic 的 TypeScript 框架，而不是託管身分服務（[Better Auth Introduction](https://better-auth.com/docs/introduction)）。

這個差異決定了選型：Better Auth 不是「免費 Clerk」，而是整理好密碼、OAuth、session、組織與權限的自建 auth 基礎。你得到資料與流程控制權，也接回 schema migration、寄信、密鑰、升級和事故應變。

## 最小路徑：程式庫、資料庫、路由

以 Next.js 和 PostgreSQL 為例，最小 server 設定大致如下：

```ts
// lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: { enabled: true },
  trustedOrigins: ["https://app.example.com"],
});
```

接著把 handler 掛到 `/api/auth/[...all]`：

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

這不是偽代碼：官方 Next.js integration 就是把同一個 `auth` instance 轉成 GET / POST handler；server side 則可用 `auth.api.getSession({ headers })` 讀 session（[Next.js integration](https://better-auth.com/docs/integrations/next)）。其他 framework 會換 adapter，但生命週期不變：你的 process 接 request、Better Auth 驗證、你的儲存層保存狀態。

## 資料庫才是身分系統的骨架

有資料庫時，核心 schema 包含 `user`、`session`、`account`、`verification`；啟用 plugin 後還會新增表或欄位。CLI 的兩個命令不能混為一談：`npx auth@latest migrate` 只直接處理內建 Kysely adapter；使用 Prisma 或 Drizzle 時，`generate` 產生 schema 或 SQL，再交給原 ORM 的 migration 流程審查、套用（[Database](https://better-auth.com/docs/concepts/database)、[CLI](https://better-auth.com/docs/concepts/cli)）。

所以「加一個登入功能」可能就是 production schema change。合理流程是：固定版本、在 CI 產生並檢查 diff、備份、先 staging migration，再部署相容程式碼。不要在應用程式啟動時盲目自動 migrate；回滾 plugin 也不等於資料表能直接刪掉。

無資料庫的 stateless mode 確實存在，但多數 plugin 需要持久化。若產品本來就有關係型資料庫，自有 `user` 主鍵、交易與 tenant 外鍵能留在同一套資料模型，正是 Better Auth 最有價值的地方。

## Session：快取不是撤銷機制

預設是傳統 cookie session：cookie 帶 token，server 查 `session` row；預設期限七天，使用到 `updateAge` 後會滑動更新。可加短效 `cookieCache` 減少查詢，也可把 session 放進 secondary storage。完全 stateless 時驗證不查 DB，但立即撤銷比較困難，官方提供的全域失效手段之一是更換 cookie-cache version（[Session Management](https://better-auth.com/docs/concepts/session-management)）。

這裡的取捨不能只看 latency。後台停權、密碼外洩、離職員工與高權限操作，都需要清楚的 revoke 與 freshness 策略。敏感動作應在 server 重新取得 session、檢查 fresh session，必要時要求再驗證；不要只相信前端 hook 或一顆長效 cookie。

## Plugin 是能力包，也是新的攻擊面

官方 plugin catalog 自稱已有 50+ 個 plugin，涵蓋 2FA、passkey、organization、SSO、SCIM 與 API key 等（[Plugins](https://better-auth.com/docs/plugins)）。數量不是採用理由；真正要盤點的是每個 plugin 帶來的資料、endpoint 與責任。

- **Passkey**：安裝獨立的 `@better-auth/passkey`，server 與 client 都要掛 plugin，並執行 migration。底層使用 SimpleWebAuthn；裝置保留私鑰，server 保存 public-key credential（[Passkey plugin](https://better-auth.com/docs/plugins/passkey)）。產品仍要處理遺失裝置、credential 管理與 account recovery。
- **Organization**：提供組織、member、邀請、role、permission，並可啟用 team。它會新增 organization/member/invitation 等表，還會在 session 加 active organization/team 欄位；邀請信的發送函式仍由應用程式提供（[Organization plugin](https://better-auth.com/docs/plugins/organization)）。
- **SSO**：獨立的 `@better-auth/sso` 支援 SAML 與 OIDC，新增 `ssoProvider` schema，並提供 domain verification。和 organization plugin 串接時，註冊 provider 及自動 link account 都有額外權限與 verified-domain 條件（[SSO plugin](https://better-auth.com/docs/plugins/sso)）。這已接近企業身分整合，不能當成打開 boolean 就完成。

Plugin 讓能力組合很快，但每次新增都應做 threat model、migration review、endpoint inventory 和升級測試。

## Authentication 之後，授權仍是你的商業邏輯

「已登入」不能推出「可讀這張 invoice」。Organization plugin 的 access control 能定義 role 與 resource/action permission，邀請、成員與 team 也有 server API；但訂單歸屬、資料列隔離、審批門檻仍必須在應用層實作。

```ts
const session = await auth.api.getSession({ headers: request.headers });
if (!session) throw new Error("unauthenticated");

// 接著以 server 查出的 membership / resource ownership 授權；
// 不接受 client 傳來的 role 或 activeOrganizationId 作為真相。
```

多租戶尤其要避免「active organization」變成唯一邊界：每次資料查詢都應帶 tenant 條件，對高風險操作再檢查 membership 與 permission。UI 隱藏按鈕只是體驗，不是 authorization。

## 安全責任沒有因為套件而消失

Better Auth 內建 origin validation、`SameSite=Lax` / `httpOnly` cookie、OAuth state/PKCE 與 rate limiting；官方明確警告，關閉 CSRF 或 origin check 會暴露 CSRF 或 open redirect。反向代理後還要正確設定可信 IP header / proxy，否則攻擊者可能偽造來源繞過限流（[Security](https://better-auth.com/docs/reference/security)）。

但套件無法替你完成所有事情。團隊仍需管理 `BETTER_AUTH_SECRET` 與 OAuth secrets、TLS、備份、郵件 deliverability、帳號復原、稽核 log、dependency alerts、版本升級和資安通報。自有資料庫也代表刪除、匯出、retention 與存取控管由你負責。若團隊沒有 auth owner，控制權很容易變成無人負責。

## Better Auth、Clerk、WorkOS、Stytch 怎麼選

| 選項 | 核心交換 | 較合理的情境 |
| --- | --- | --- |
| Better Auth | in-app TypeScript library + 自有 DB；高度可改，但自行維運 | 已有 TypeScript backend、資料模型要求高、願意負責安全與升級 |
| Clerk | 託管 user/session 與預製 UI、Elements；較快交付登入體驗 | 前端團隊想少碰 auth edge cases；Clerk 也提醒 custom flow 需自行處理更多狀態（[How Clerk works](https://clerk.com/docs/guides/how-clerk-works/overview)） |
| WorkOS | 託管 AuthKit，強項在企業 SSO、Directory Sync、組織與 provisioning | B2B 客戶要求多種企業 IdP、目錄同步與 IT onboarding（[Directory Provisioning](https://workos.com/docs/authkit/directory-provisioning)） |
| Stytch | API-first 託管 consumer / B2B authentication 與 session | 想用 API 客製流程、但不想自管 credential/session 儲存；其 B2B API 直接回傳並延長 Stytch session（[Stytch B2B Authenticate](https://stytch.com/docs/api-reference/b2b/api/passwords/authenticate)） |

這不是 feature checklist 的勝負。企業 SSO 若每個客戶都有特殊 IdP、群組映射與離職停權需求，買 WorkOS 這類營運層常比自己接 protocol 划算；只需產品內組織與少量 SSO，Better Auth plugin 可能更直接。Clerk、Stytch 把大量 operational burden 移給 vendor，代價是資料模型、定價與平台依賴。

## 適合與不適合

Better Auth 適合已經有 TypeScript server、熟悉資料庫 migration、需要自有 user/tenant schema，並願意指定人維護 auth 的團隊。它也適合不能把核心身分資料交給外部 identity SaaS，但仍想避免從密碼雜湊、OAuth callback 與 session endpoint 全部手刻的產品。

如果目標是本週上線 polished sign-in、團隊沒有安全與 on-call 能力，或 enterprise roadmap 很快需要大量 IdP onboarding、Directory Sync、合規證據與支援 SLA，託管服務通常更務實。Better Auth 降低的是「重造 auth framework」的成本，不是讓身分系統免維運。

## 參考資料

- [Better Auth — Installation](https://better-auth.com/docs/installation)
- [Better Auth — Database](https://better-auth.com/docs/concepts/database)
- [Better Auth — Session Management](https://better-auth.com/docs/concepts/session-management)
- [Better Auth — Plugins](https://better-auth.com/docs/plugins)
- [Better Auth — Passkey](https://better-auth.com/docs/plugins/passkey)
- [Better Auth — Organization](https://better-auth.com/docs/plugins/organization)
- [Better Auth — SSO](https://better-auth.com/docs/plugins/sso)
- [Better Auth — Security](https://better-auth.com/docs/reference/security)
- [Clerk — How Clerk works](https://clerk.com/docs/guides/how-clerk-works/overview)
- [WorkOS — Directory Provisioning](https://workos.com/docs/authkit/directory-provisioning)
- [Stytch — B2B password authentication](https://stytch.com/docs/api-reference/b2b/api/passwords/authenticate)

---

English version: [Better Auth: Should Authentication Live Inside Your TypeScript App?](/posts/tech/2026-08-22-better-auth-typescript-en/)
