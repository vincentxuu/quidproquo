---
title: "WorkOS Enterprise Auth: Growing from AuthKit to SSO, SCIM, and Audit Logs"
date: 2026-08-22
type: deep-dive
category: "tech"
tags: [workos, authkit, enterprise-sso, scim, saml, audit-logs]
lang: en
description: "How WorkOS takes a B2B SaaS from AuthKit and Organizations to SSO, Directory Sync, and Audit Logs—and where Clerk, Stytch, and Better Auth differ."
tldr: "WorkOS lets a B2B SaaS add SAML/OIDC, SCIM, and audit exports around one organization identity model; application authorization and data governance remain your responsibility."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-workos-enterprise-auth)

Many B2B SaaS products begin with email login. The first enterprise deal then arrives with SAML, SCIM, enforced MFA, rapid offboarding, and audit-log requirements all at once. If each requirement gets a separate component, the hardest problem is not any protocol. It is keeping one person consistent across a user, SSO profile, directory user, and organization membership.

WorkOS follows that maturity curve. AuthKit and User Management establish login and user records; Organization supplies the tenant boundary; SSO, Directory Sync, RBAC, and Audit Logs are added per customer. This can shorten enterprise feature delivery, but it cannot decide which invoice a member may read.

This article was fact-checked through August 2026. Pricing comes from the public page at that date; no funding or unverified adoption number is included merely to decorate the story.

## Stage one: AuthKit and User Management

[AuthKit](https://workos.com/docs/authkit/overview) offers a hosted UI or headless API for passwords, Magic Auth, social login, MFA, passkeys, and enterprise SSO. A team can ship ordinary authentication first while adopting the WorkOS User and Organization model from the beginning, instead of forcing a consumer user table onto an enterprise IdP after a sale.

For Next.js App Router, a minimal integration installs the SDK, configures four environment variables, creates a callback route, and reads the session from a server component:

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

Keep `WORKOS_API_KEY` and the minimum 32-character `WORKOS_COOKIE_PASSWORD` server-side. The [official Next.js SDK guide](https://workos.com/docs/sdks/authkit-nextjs) covers the full setup and its PKCE and CSRF behavior. Seeing a user in the browser is not backend authorization: every data query still needs a verified session and an `organizationId` tenant constraint.

Organization should be part of the data model on day one, not an SSO attachment. A user can join multiple organizations, while membership carries the tenant relationship and role. Store stable WorkOS IDs and put `organization_id` into unique keys, query predicates, and audit events rather than inferring a tenant from an email domain. The [documentation](https://workos.com/docs/authkit/users-organizations) treats Organization as a first-class object and states that creation is not numerically limited.

## Stage two: one SSO connection per enterprise customer

SSO answers which IdP proves identity. WorkOS normalizes SAML and OIDC differences, and Admin Portal can let customer IT configure a connection. One enterprise customer generally maps to one connection, so Acme can use Okta SAML while Beta uses Microsoft Entra ID over OIDC.

Keep three ideas separate:

- SSO authenticates whether the user can sign in now.
- JIT provisioning can create a user or membership at first login, but cannot preemptively disable someone who has never logged in.
- A group or role in an SSO assertion is input; the application still defines permissions and enforces resource access.

WorkOS can map SSO groups to membership roles, but its [roles documentation](https://workos.com/docs/authkit/roles-and-permissions) recommends one principal role source per organization. If directory groups, SSO groups, and manual assignments all mutate a role, precedence becomes an implicit policy that is difficult to audit.

## Stage three: Directory Sync and SCIM manage the lifecycle

When a customer asks how quickly an employee loses access after departure, SSO alone is usually insufficient. SCIM is an identity-provisioning standard. Directory Sync receives user and group creation, updates, and deactivation from an IdP or HRIS, then synchronizes them to the application through APIs and webhooks. [WorkOS Directory Sync](https://workos.com/docs/directory-sync) describes the directory as the source of truth for the customer's user and group list.

With AuthKit Directory Provisioning, each organization needs its own directory integration. For users on a verified organization domain, the directory can control memberships and profile attributes; deprovisioning is reflected in AuthKit. The [provisioning guide](https://workos.com/docs/authkit/directory-provisioning) says directory-sourced attributes take precedence over SSO, API, or dashboard edits.

An implementation must handle more than `user.created`:

1. Deduplicate on WorkOS event ID and tolerate webhook retries and reordering.
2. Treat deactivation as a workflow that revokes sessions, memberships, and downstream data access—not merely a UI state.
3. Persist immutable external IDs rather than using a mutable or duplicated email as identity.
4. Run periodic reconciliation; returning HTTP 200 to a webhook does not prove every downstream system converged.

The same person may be provisioned through SCIM before signing in through SSO. WorkOS's [identity-linking rules](https://workos.com/docs/authkit/identity-linking) prefer a stable IdP identifier, then a verified email, to avoid duplicate accounts during email changes. Teams should still rehearse merges, duplicate emails across organizations, and guest domains with test data.

## Stage four: organization authorization and Audit Logs

Authentication answers who you are; authorization answers what you may do in this organization. WorkOS supplies roles and permissions, but routes, services, and database policies still need to fail closed. Hiding a Delete button in React is insufficient. The backend must check the session, active organization, membership, and permission. High-risk actions should also resist replay after a user switches organizations.

An audit log is not a debug log. Record an accountable actor, action, target, organization, timestamp, source IP, and necessary metadata. Avoid tokens, passwords, full SAML assertions, and unnecessary PII. WorkOS Audit Logs supports JSON Schema validation, querying, CSV export, and streaming to a customer's SIEM. Its [export API](https://workos.com/docs/reference/audit-logs/export) creates one export for an organization and date range; the download URL expires.

Emit the event where the business transaction succeeds, not merely on a UI click. If `invoice.deleted` commits while the audit API is unavailable, retry through a transactional outbox or durable queue. Otherwise, the incident most in need of evidence creates the gap.

## Cost follows enterprise connections, not only MAU

As of August 2026, [public WorkOS pricing](https://workos.com/pricing) lists the first one million AuthKit monthly active users as free and each additional million at $2,500 per month. SSO and Directory Sync each cost $125 per connection per month for connections 1–15, with volume tiers. Audit Logs lists $125 per SIEM connection per month and $99 per million retained events per month. These are official list prices at the snapshot date, excluding contracts, support plans, and future changes.

A quote should therefore account for one enterprise customer potentially requiring SSO, Directory Sync, and SIEM streaming. The upside is that a connection price does not increase with that customer's end-user count. The downside is that many small customers can grow connection count faster than MAU.

## Choosing among WorkOS, Clerk, Stytch, and Better Auth

| Option | Product center | Better fit | Main tradeoff |
| --- | --- | --- | --- |
| WorkOS | AuthKit expanding into SSO, Directory Sync, Admin Portal, and Audit Logs | B2B SaaS expecting progressively deeper IT requirements | Identity and enterprise features become vendor-coupled; application authorization still needs design |
| Clerk | Prebuilt UI, sessions, and organization DX, with organization-level SAML/OIDC | Frontend integration speed and organization switching matter most | Verify SCIM, audit, and plan boundaries feature by feature; see [Clerk Organizations](https://clerk.com/docs/guides/organizations/overview) |
| Stytch | B2B APIs centralize organization auth policies, SSO, SCIM, and RBAC | API-first teams wanting fine tenant-level authentication policy control | Align B2B versus B2C models and SDKs early; see the [Organizations API](https://stytch.com/docs/api-reference/b2b/api/organizations/overview) |
| Better Auth | TypeScript, your database, and composable Organization, SSO, and SCIM plugins | Data control, self-hosting, and code-level customization | Operations, upgrades, SAML/SCIM interoperability, and on-call ownership are yours; its [SCIM documentation](https://better-auth.com/docs/beta/plugins/scim) still labels the feature beta |

If mature authentication already exists and only enterprise SSO or SCIM is missing, WorkOS can remain a standalone enterprise layer; moving to AuthKit is not mandatory. For a new product, one AuthKit identity model removes linking glue. Better Auth provides the most self-hosting freedom, but a free package does not eliminate enterprise onboarding, certificate rotation, or directory edge cases.

## Security and data boundaries

WorkOS processes email, profiles, organizations, IdP identifiers, and configured directory attributes. Its [security page](https://workos.com/security) lists SOC 2 Type 2, annual third-party penetration tests, GDPR and CCPA compliance, and availability of a HIPAA BAA on enterprise plans. Its [DPA](https://workos.com/legal/data-processing-addendum) describes encryption in transit and at rest, logical separation, and subprocessor access controls. Compliance attestations are evidence about vendor controls, not automatic compliance for your application.

Before launch, cover key rotation, staging/production separation, callback allowlists, webhook signature verification, domain ownership verification, a break-glass account, SCIM token revocation, and an offboarding drill. Draw the responsibility boundary too: WorkOS is the identity system; your database is usually the source of truth for product authorization and resource ownership; the SIEM is the long-term audit and detection system.

## When it fits—and when it does not

WorkOS fits a B2B SaaS with a visible enterprise roadmap, a desire for self-service IT onboarding, and no appetite for maintaining every SAML and SCIM dialect. It is especially natural when Organization is already the product's tenant.

It may be excessive for a single-user consumer app, unsuitable when complete offline operation or self-hosting is mandatory, and restrictive for a highly unusual identity graph or a policy that forbids third-party identity processing. Another warning sign is asking an auth vendor to solve undefined authorization. Without a resource model and permission semantics, any provider only ships the login page faster.

## Conclusion

The useful way to adopt WorkOS is not to enable every enterprise checkbox at once. Preserve one continuous identity model: AuthKit creates the user, Organization creates the tenant, SSO proves identity, Directory Sync manages the lifecycle, authorization protects resources, and Audit Logs preserve evidence.

With those boundaries, enterprise capabilities can grow with each deal. Without them, a successful SSO login can hide cross-tenant access and incomplete offboarding. Enterprise readiness does not mean “supports SAML.” It means every step from joining, using, and changing roles to leaving can be explained, revoked, and audited.

## References

- [WorkOS AuthKit Overview](https://workos.com/docs/authkit/overview)
- [WorkOS Users and Organizations](https://workos.com/docs/authkit/users-organizations)
- [WorkOS Directory Sync](https://workos.com/docs/directory-sync)
- [WorkOS Directory Provisioning](https://workos.com/docs/authkit/directory-provisioning)
- [WorkOS Roles and Permissions](https://workos.com/docs/authkit/roles-and-permissions)
- [WorkOS Audit Logs](https://workos.com/audit-logs)
- [WorkOS Pricing](https://workos.com/pricing)
- [WorkOS Security](https://workos.com/security)
