---
title: "Better Auth: A TypeScript Authentication Framework, Not Application Authorization"
date: 2026-08-22
category: tech
type: deep-dive
tags: [better-auth, authentication, authorization, typescript, security]
lang: en
tldr: "Better Auth unifies login, sessions, providers, and plugins; applications still own resource authorization, revocation latency, and policy for agent actions."
description: "Better Auth sessions, cookie caching, CSRF, OAuth, the organization plugin, and the boundary between authentication and authorization."
series:
  name: "Technology Choices in the AI Era"
  order: 48
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-22-better-auth-framework)

[Better Auth](https://better-auth.com/docs/introduction) is a TypeScript authentication framework with email/password, social providers, sessions, database adapters, and plugins. It fits teams that neither want to outsource login entirely to SaaS nor assemble cookies, OAuth callbacks, and account linking themselves. Since 2025-09, Auth.js (formerly NextAuth.js) has been maintained by the Better Auth team, which recommends Better Auth for new projects while Auth.js receives only security patches and urgent fixes; one of the few remaining reasons to stay on Auth.js at the time was stateless sessions without a database, which Better Auth has since added.

Authentication is the important word. The framework can identify the current session, but it cannot automatically decide whether that person may refund an order, read another tenant's document, or let an agent send mail on their behalf.

## Session strategy determines revocation latency

In traditional [session management](https://better-auth.com/docs/concepts/session-management), a cookie carries a session token and the server checks the database. A signed cookie cache removes a lookup, but a database revocation or role change may remain invisible until that cache expires. Without a database configured, Better Auth switches to stateless mode automatically: the whole session lives in a signed or encrypted cookie, the server only checks the signature and expiry, and server-side revocation has to wait for the cookie to expire or for the secret to rotate.

Logging out and immediate invalidation are therefore different promises. High-risk routes can bypass cache, demand a fresh session, or reauthenticate; low-risk reads may tolerate a short cache. Store only necessary data, apply `httpOnly`, `secure`, and suitable `sameSite` settings, and rotate signing secrets as production credentials.

## The framework handles protocols; the app handles resources

The [security reference](https://better-auth.com/docs/reference/security) covers CSRF, origin validation, OAuth state and PKCE, secure cookies, and rate limiting. Behind a reverse proxy, do not trust forwarded headers unconditionally. An overly broad trusted-origin setting also defeats the boundary.

The [organization plugin](https://better-auth.com/docs/plugins/organization) supplies organizations, members, teams, roles, and permission primitives. Loading `invoice/:id` still requires a check against the invoice tenant, owner, and current membership. Never trust an organization ID from the client or a stale role in a token alone.

```ts
const session = await auth.api.getSession({ headers });
if (!session) throw unauthorized();

const invoice = await loadInvoice(params.id);
await authorize(session.user.id, 'invoice.read', invoice);
```

## Agents amplify ambiguous boundaries

Do not place a user's long-lived session cookie or OAuth refresh token in prompts, tool arguments, or transcripts. When an agent calls an external system, the server should exchange it for a short-lived credential restricted by audience and scope. Irreversible or high-impact actions need confirmation. Better Auth can own human login and sessions while delegated authorization remains a separate policy and token-broker layer.

Better Auth is worth evaluating for multi-tenant login, self-controlled data, end-to-end TypeScript integration, and composable plugins. A managed identity provider may cost less overall when enterprise federation, mature risk engines, global compliance operations, and SLAs dominate. Test CSRF, session fixation, logout revocation, resource access after member removal, and behavior before a cookie cache expires.

## Update Log

- 2026-11-23: Added that Auth.js moved under Better Auth maintenance in 2025-09 that new projects are advised to use Better Auth, and the database-less stateless session mode with its revocation limits.

## References

- [Better Auth introduction](https://better-auth.com/docs/introduction)
- [Better Auth session management](https://better-auth.com/docs/concepts/session-management)
- [Better Auth security](https://better-auth.com/docs/reference/security)
- [Better Auth organization plugin](https://better-auth.com/docs/plugins/organization)
- [Auth.js is now part of Better Auth](https://www.better-auth.com/blog/authjs-joins-better-auth)
