---
title: "Giving an Agent Access to Logged-In Websites: Sessions, Permissions, and Automation Boundaries"
date: 2026-08-22
category: ai
type: guide
tags: [browser-automation, ai-agent, web-security, playwright, mcp]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 13
tldr: "Authenticated browser state is not a convenience setting; it is a credential that can impersonate its owner. Use a dedicated low-privilege account and isolated profile, separate reading from reversible writes and high-risk transactions, and leave MFA plus final submission to a human."
description: "A practical security guide for authorized browser automation: profiles, session storage, CSRF, MFA handoffs, least privilege, sensitive-data redaction, and audit logs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-authenticated-web-agent-safety)

Public pages can go through a search API or crawler. Logged-in pages are different. Once an agent receives cookies, local storage, or a complete browser profile, it has more than permission to read a page. It has the user's identity on that site, potentially including access to private data, messaging, permission changes, deletion, and payments.

This article covers one legitimate case only: **the user is already authorized to access the data and wants to delegate part of the browsing workflow.** It does not explain bypassing login, defeating MFA, stealing cookies, or evading access controls. The real design question is not how to log the agent in. It is what that session is allowed to do.

## Authentication is not authorization

Authentication proves who an actor is; authorization determines what it may do. A browser session cookie is often a bearer credential: possession is enough to act as the account. The [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) therefore treats session ID disclosure as session hijacking, not ordinary configuration leakage.

An agent workflow needs at least three permission tiers:

| Tier | Allowed actions | Execution model |
|---|---|---|
| Read | Search, open pages, download authorized files, summarize | Automatic within site and data boundaries |
| Reversible write | Create drafts, add labels, fill but not submit forms | Agent acts, then presents a diff or preview |
| High impact | Pay, delete, publish, send, change access, reset security | Human reviews transaction details and performs final authorization |

The [OWASP Transaction Authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html) separates authorization of an important transaction from ordinary login and requires the user to see what is being approved. Applied to agents, “the user is logged in” never means “the agent may submit any form.”

An action you can take tonight: list every button the automation may touch and label it read, reversible write, or high impact. Keep the third category out of autonomous execution by default.

## Three profile modes, and why your daily browser is the wrong default

[Playwright MCP](https://playwright.dev/docs/getting-started-mcp) supports persistent, isolated, and browser-extension profile modes. They differ in exposure, not just convenience.

1. **Isolated session:** start clean and load a dedicated `storageState` only when needed. This is the easiest mode to constrain and destroy, so it should be the default.
2. **Dedicated persistent profile:** retain login state, but sign in only to required sites with a low-privilege account. This fits frequent, fixed internal workflows.
3. **Daily-browser connection:** reuse current SSO, MFA, cookies, and extensions. It has the largest blast radius and belongs only in short, supervised workflows.

Playwright's authentication documentation explicitly warns that stored state may contain cookies and headers capable of impersonating the account and must not be committed to a public or private repository. Since Chrome 136, automation cannot use the default user data directory and must use a separate directory. That restriction reinforces the right design: **do not let an agent inherit the profile that already contains your email, banking, admin, and cloud-storage sessions.**

A minimal MCP configuration looks like this:

```json
{
  "mcpServers": {
    "playwright-private-reader": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--isolated",
        "--storage-state=/secure/runtime/reader-state.json",
        "--caps=storage"
      ]
    }
  }
}
```

Keep `reader-state.json` outside the repository, readable only by the runtime account, and easy to revoke. Do not paste passwords, OTPs, or session JSON into a prompt. Let a human log in through a headed browser, then provide short-lived state to an isolated context.

## Enforce least privilege in the site, not in the prompt

A prompt that says “read only” is not an access-control system. The effective restrictions must exist at the site and runtime boundaries:

- Create a dedicated account instead of sharing a personal or administrator account.
- Request read-only OAuth scopes; share only the required workspace or folder.
- Keep billing, user administration, API keys, and security settings out of a reader agent's view.
- Give each automation workflow a separate session; do not share one cookie jar across agents or MCP servers.
- Use short lifetimes and revocation; log out or delete state when the run ends.

The [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html) likewise recommends scoped per-server credentials, narrow OAuth scopes, and short-lived tokens instead of shared long-lived PATs. Browser sessions are not API tokens, but their lifecycle should follow the same rules.

## Network allowlists are guardrails, not a security boundary

Playwright MCP can configure `allowedOrigins`, `blockedOrigins`, and a minimal capability set. These reduce accidental navigation caused by links or prompt injection and keep a reader workflow from receiving devtools, network inspection, or arbitrary-code capabilities it does not need.

```json
{
  "browser": {
    "isolated": true,
    "contextOptions": {
      "permissions": []
    }
  },
  "capabilities": ["core"],
  "network": {
    "allowedOrigins": [
      "https://app.example.com",
      "https://cdn.example.com"
    ]
  },
  "allowUnrestrictedFileAccess": false,
  "outputDir": "/secure/runtime/browser-output"
}
```

The [official Playwright MCP repository](https://github.com/microsoft/playwright-mcp) is explicit: origin rules and file restrictions are convenience guardrails, **not security boundaries**, and the origin allowlist does not affect redirects. Real isolation still requires a dedicated OS identity, container or VM, egress proxy, site-side permissions, and client-side tool approval.

Do not expose `browser_run_code_unsafe` to an untrusted client. The documentation describes it as remote-code-execution equivalent. If reading a page needs only navigation, snapshots, and a few interactions, arbitrary JavaScript is unnecessary authority.

## CSRF and prompt injection borrow the logged-in identity

An authenticated browser attaches cookies automatically. A malicious page may therefore induce credentialed requests without learning the session ID; that is the core of CSRF. The [OWASP CSRF guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) requires session-bound tokens, SameSite cookies, and origin verification on the server, but an automation operator cannot assume every site implements them correctly.

Prompt injection adds another layer. Page text may ask the agent to ignore its task, open another origin, paste data, or perform an action. Authentication raises the consequence from reading junk to acting as the user. Therefore:

- Page content is data, never a new authorization instruction.
- Stop before navigating to a new origin, uploading files, reading the clipboard, or downloading executables.
- Match every state-changing request against the original task and its allowed-action list.
- Display names, button labels, and summaries never replace the actual URL, account, amount, recipient, and change set.

For a broader threat model, continue with the [self-hosted personal-agent threat model](/posts/ai/2026-03-28-openclaw-threat-model-en).

## MFA is a handoff point, not an obstacle to automate away

MFA, CAPTCHA, password re-entry, and transaction confirmation are requests for higher assurance. A safe workflow treats them as handoff signals:

1. The agent navigates to the step before verification and summarizes the pending action.
2. The human checks the target account, data scope, and expected side effects.
3. The human performs MFA or transaction authorization.
4. The agent reads the result only after approval; changed amounts or contents require approval again.

Do not give the agent a TOTP seed, backup code, or passkey private key, and do not let it extract OTPs autonomously from notifications, email, or SMS. That collapses the second factor into another secret inside the same runtime as the session.

## Audit actions without recording secrets

Traceability does not require recording every screen and request. The [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) recommends recording privilege changes, sensitive-data access, imports, exports, and administrative actions, while excluding session IDs, access tokens, passwords, keys, and sensitive personal data from logs.

A useful browser-agent audit event contains at least:

```json
{
  "run_id": "run_20260822_001",
  "actor": "private-reader-agent",
  "site": "app.example.com",
  "action": "read_export_preview",
  "resource": "report:quarterly-summary",
  "decision": "allowed",
  "human_approval": null,
  "timestamp": "2026-08-22T10:00:00+08:00"
}
```

Do not log request bodies, complete DOMs, cookies, or every piece of personal data visible on screen. When events must be correlated to one session, OWASP recommends a salted hash rather than the session ID itself. Traces, HAR files, screenshots, and downloads also need retention limits; they must not accumulate indefinitely in an agent workspace.

## Minimum preflight checklist

- [ ] A dedicated low-privilege account is used, not a personal primary or administrator account.
- [ ] The workflow uses an isolated context or dedicated profile, not the daily browser.
- [ ] Authentication state stays outside the repository, has file permissions, can be revoked, and expires.
- [ ] Actions are classified as read, reversible write, or high impact.
- [ ] MFA, payment, deletion, publishing, sending, and permission changes retain human confirmation.
- [ ] Tool capabilities, origins, and egress are narrowed to the required scope.
- [ ] Page text cannot grant the agent new authority.
- [ ] Audit logs trace actions without sessions, tokens, passwords, or complete sensitive data.
- [ ] There is a direct way to revoke the session, stop execution, and undo reversible changes.

## The tradeoff

Logged-in sites can be delegated to agents, but “log in and finish it” is not an adequate specification. Reliable automation treats a session as a secret, a profile as a permission container, and writes and transactions as separate stages. It explicitly hands control back to a human before MFA and high-impact actions.

The safest default is also the least exciting: a dedicated reader account, isolated session, minimal tools, limited origins, short lifetime, and one final confirmation button that automation can never press.

## References

- [Playwright — Authentication](https://playwright.dev/docs/auth)
- [Playwright MCP — Getting Started](https://playwright.dev/docs/getting-started-mcp)
- [Playwright MCP — Profile and State](https://playwright.dev/mcp/configuration/user-profile)
- [Microsoft Playwright MCP repository and configuration](https://github.com/microsoft/playwright-mcp)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Transaction Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Transaction_Authorization_Cheat_Sheet.html)
- [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
