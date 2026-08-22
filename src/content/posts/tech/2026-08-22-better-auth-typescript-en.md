---
title: "Better Auth: Should Authentication Live Inside Your TypeScript App?"
date: 2026-08-22
type: deep-dive
category: "tech"
tags: [better-auth, authentication, typescript, passkeys, sso, authorization]
lang: en
description: "A practical look at Better Auth's self-owned identity lifecycle—from database and sessions to plugins and authorization—and where it fits against Clerk, WorkOS, and Stytch."
tldr: "Better Auth trades a managed identity platform for an in-app library and your own database; that gives you control, but migrations, security updates, and incident response become your responsibility."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-better-auth-typescript)

Better Auth is not another login API that moves your users into a vendor dashboard. It is an authentication and authorization framework embedded in a TypeScript application: routes execute in your service, core identity tables live in your database, and plugins add advanced capabilities. Its documentation describes it as a framework-agnostic TypeScript framework, not a hosted identity service ([Better Auth Introduction](https://better-auth.com/docs/introduction)).

That distinction drives the purchasing decision. Better Auth is not “free Clerk.” It is a structured foundation for operating password, OAuth, session, organization, and permission flows yourself. You gain control of data and behavior, while taking back schema migrations, email delivery, secrets, upgrades, and incident response.

## The minimum path: library, database, route

For a Next.js application with PostgreSQL, a minimal server configuration looks like this:

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

Mount its handler at `/api/auth/[...all]`:

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

This follows the official integration: the same `auth` instance becomes the GET and POST handler, while server code can call `auth.api.getSession({ headers })` ([Next.js integration](https://better-auth.com/docs/integrations/next)). Other frameworks use different adapters, but the lifecycle remains yours: your process receives the request, Better Auth verifies it, and your storage layer keeps the state.

## The database is the identity system's skeleton

With a database configured, the core schema includes `user`, `session`, `account`, and `verification`; plugins may add tables or columns. The CLI commands have an important boundary: `npx auth@latest migrate` directly handles only the built-in Kysely adapter. With Prisma or Drizzle, `generate` produces a schema or SQL migration that should go through the ORM's normal review and deployment process ([Database](https://better-auth.com/docs/concepts/database), [CLI](https://better-auth.com/docs/concepts/cli)).

Adding an authentication feature can therefore be a production schema change. Pin versions, inspect generated diffs in CI, back up data, migrate staging first, and deploy compatible code. Blindly migrating on application startup is risky, and removing a plugin does not automatically make its tables safe to drop.

Database-free stateless operation exists, but most plugins require persistence. If the product already uses a relational database, keeping the user key, transaction relationships, and tenant foreign keys in one data model is one of Better Auth's strongest advantages.

## Sessions: a cache is not revocation

The default is a traditional cookie session: the cookie carries a token and the server reads a `session` row. Sessions expire after seven days by default and slide after `updateAge`. A short-lived `cookieCache` can reduce reads, and secondary storage can hold sessions. Fully stateless validation avoids database reads, but immediate invalidation is harder; one documented way to invalidate all cookie-cached sessions is changing the cache version ([Session Management](https://better-auth.com/docs/concepts/session-management)).

The choice is not only about latency. Admin suspension, leaked passwords, departing employees, and privileged actions all need explicit revocation and freshness policies. Sensitive server operations should load and validate the session, require recent authentication when appropriate, and never trust only a client hook or a long-lived cookie.

## A plugin is a capability—and another attack surface

Better Auth says its catalog contains more than 50 plugins across 2FA, passkeys, organizations, SSO, SCIM, API keys, and other areas ([Plugins](https://better-auth.com/docs/plugins)). The count is not an adoption argument. The important inventory is the data, endpoints, and operational obligations each plugin introduces.

- **Passkeys:** install the separate `@better-auth/passkey` package, configure both server and client plugins, and run a migration. It uses SimpleWebAuthn; devices retain private keys while the server stores public-key credentials ([Passkey plugin](https://better-auth.com/docs/plugins/passkey)). The product still needs lost-device handling, credential management, and account recovery.
- **Organizations:** provides organizations, members, invitations, roles, permissions, and optional teams. It adds organization/member/invitation tables and active organization/team fields to sessions. Your application still supplies the invitation-email function ([Organization plugin](https://better-auth.com/docs/plugins/organization)).
- **SSO:** the separate `@better-auth/sso` package supports SAML and OIDC, adds an `ssoProvider` schema, and offers domain verification. When combined with organizations, provider registration and automatic account linking have additional authorization and verified-domain constraints ([SSO plugin](https://better-auth.com/docs/plugins/sso)). This is enterprise identity integration, not a boolean that completes the operational work.

Plugins accelerate composition, but each addition deserves a threat model, migration review, endpoint inventory, and upgrade test.

## Authentication ends where product authorization begins

“Signed in” does not imply “may read this invoice.” The Organization plugin can define roles and resource/action permissions and exposes server APIs for invitations, members, and teams. Order ownership, row-level tenant isolation, and approval thresholds still belong to the application.

```ts
const session = await auth.api.getSession({ headers: request.headers });
if (!session) throw new Error("unauthenticated");

// Authorize using server-loaded membership and resource ownership.
// Never accept a client-supplied role or activeOrganizationId as truth.
```

In multi-tenant systems, an “active organization” should not be the only boundary. Every data query should carry a tenant predicate, and high-risk actions should re-check membership and permission. Hiding a button in the UI is user experience, not authorization.

## A library does not remove the security obligation

Better Auth includes origin validation, `SameSite=Lax` and `httpOnly` cookies, OAuth state/PKCE, and rate limiting. Its security reference explicitly warns that disabling CSRF or origin checks exposes CSRF or open-redirect risk. Behind reverse proxies, trusted IP headers and proxy chains must also be configured correctly or attackers may spoof their source and evade controls ([Security](https://better-auth.com/docs/reference/security)).

The library cannot own the entire system for you. The team still manages `BETTER_AUTH_SECRET` and OAuth secrets, TLS, backups, email deliverability, recovery, audit logs, dependency alerts, upgrades, and security reports. Owning the database also means owning deletion, export, retention, and access control. Without a named auth owner, control can quickly become unowned risk.

## Better Auth versus Clerk, WorkOS, and Stytch

| Option | Primary trade | Best-aligned situation |
| --- | --- | --- |
| Better Auth | In-app TypeScript library and your database; highly adaptable, self-operated | TypeScript backend, strong data-model requirements, and a team able to own security and upgrades |
| Clerk | Hosted users/sessions plus prebuilt UI and Elements; faster login UX | Frontend-heavy teams avoiding auth edge cases; Clerk notes that custom flows require handling more logic and error states ([How Clerk works](https://clerk.com/docs/guides/how-clerk-works/overview)) |
| WorkOS | Hosted AuthKit with enterprise SSO, Directory Sync, organizations, and provisioning | B2B products facing many enterprise IdPs and IT onboarding workflows ([Directory Provisioning](https://workos.com/docs/authkit/directory-provisioning)) |
| Stytch | API-first hosted consumer/B2B authentication and sessions | Teams wanting custom API-driven flows without storing credentials and sessions themselves; its B2B API returns and extends Stytch sessions ([Stytch B2B Authenticate](https://stytch.com/docs/api-reference/b2b/api/passwords/authenticate)) |

This is not a feature-checklist contest. If every enterprise customer brings a distinct IdP, group mapping, and deprovisioning workflow, buying the operational layer from a vendor such as WorkOS can be cheaper than implementing the protocols. For product organizations and a limited number of SSO connections, Better Auth's plugins may be more direct. Clerk and Stytch shift substantial operational burden to a vendor, in exchange for less control over data models, pricing, and platform dependency.

## When it fits—and when it does not

Better Auth fits teams that already run a TypeScript server, understand database migrations, need an owned user/tenant schema, and will assign someone to maintain authentication. It also fits products that cannot place core identity data in an external identity SaaS but do not want to reinvent password hashing, OAuth callbacks, and session endpoints.

If the goal is a polished sign-in this week, the team lacks security and on-call capacity, or the near-term enterprise roadmap requires extensive IdP onboarding, Directory Sync, compliance evidence, and support SLAs, a managed service is usually more pragmatic. Better Auth reduces the cost of reinventing an auth framework. It does not make an identity system maintenance-free.

## References

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

中文版：[Better Auth：把 TypeScript 認證放回應用程式裡，值得嗎？](/posts/tech/2026-08-22-better-auth-typescript/)
