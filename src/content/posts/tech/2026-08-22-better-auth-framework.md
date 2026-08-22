---
title: "Better Auth：TypeScript 認證框架不是應用程式授權層"
date: 2026-08-22
category: tech
type: deep-dive
tags: [better-auth, authentication, authorization, typescript, security]
lang: zh-TW
tldr: "Better Auth 統一登入、session、provider 與外掛；resource-level authorization、撤銷時效和代理操作政策仍要由應用程式明確實作。"
description: "介紹 Better Auth 的 session、cookie cache、CSRF、OAuth、organization plugin，以及認證與授權的責任邊界。"
series:
  name: "AI 時代的技術選擇"
  order: 48
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-better-auth-framework-en)

[Better Auth](https://better-auth.com/docs/introduction) 是 TypeScript 認證框架，提供 email/password、social provider、session、database adapter 與 plugin 系統。它適合不想把登入完全外包給 SaaS、又不想自行拼湊 cookie、OAuth callback 與帳號連結的團隊。

關鍵字是「認證」。它能回答目前 session 對應誰，卻不會自動知道這個人能不能退款某筆訂單、讀另一個 tenant 的文件，或讓 agent 代替他發信。

## Session 策略決定撤銷時效

[Session management](https://better-auth.com/docs/concepts/session-management) 的傳統模式由 cookie 帶 session token，server 每次查資料庫。啟用 signed cookie cache 可少一次查詢，但在 cache 到期前，資料庫內的撤銷或角色變更可能不會立即反映。

因此「登出」與「立刻失效」不是同一件事。高風險路由可略過 cache、要求 fresh session 或重新驗證；低風險讀取則可接受短暫 cache。cookie 只放必要資訊，使用 `httpOnly`、`secure`、合適的 `sameSite`，並把 signing secret 當正式憑證輪替。

## 框架處理協定，應用程式處理資源

[Security reference](https://better-auth.com/docs/reference/security) 說明 CSRF、origin validation、OAuth state/PKCE、secure cookie 與 rate limiting。部署在 reverse proxy 後，不能無條件信任 forwarded headers；錯誤的 trusted origin 也會把保護面打穿。

[Organization plugin](https://better-auth.com/docs/plugins/organization) 提供 organization、member、team、role 與 permission primitives。真正讀取 `invoice/:id` 時仍要以資料庫中的 tenant、resource owner 與當下 membership 判斷，不能只檢查前端傳來的 organization id 或 token 內過期的 role。

```ts
const session = await auth.api.getSession({ headers });
if (!session) throw unauthorized();

const invoice = await loadInvoice(params.id);
await authorize(session.user.id, 'invoice.read', invoice);
```

## AI agent 會放大模糊邊界

不要把使用者的長效 session cookie 或 OAuth refresh token 放進 prompt、tool argument 或 transcript。agent 要操作外部系統時，應由 server 交換成短效、限 audience、限 scope 的憑證；不可逆或高影響動作再要求確認。Better Auth 可以負責人類登入與 session，代理授權仍是另一層政策與 token broker。

若你需要多租戶登入、可自管資料、TypeScript 端到端整合與可組合 plugin，Better Auth 值得評估。若需要企業 federation、現成風險引擎、全球合規營運與 SLA，managed identity provider 的總成本可能更低。驗收時至少測試 CSRF、session fixation、登出後撤銷、成員被移除後的 resource access，以及 cookie cache 尚未過期的行為。

## 參考資料

- [Better Auth introduction](https://better-auth.com/docs/introduction)
- [Better Auth session management](https://better-auth.com/docs/concepts/session-management)
- [Better Auth security](https://better-auth.com/docs/reference/security)
- [Better Auth organization plugin](https://better-auth.com/docs/plugins/organization)
