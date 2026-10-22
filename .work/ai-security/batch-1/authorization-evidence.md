# Order 1 scope and evidence
Reader question: Why does an AI assistant that knows my name still need backend authorization? Outcome: draw the identity/resource/policy path and verify both allowed and denied reads.
Audience: API-capable developer, no security prerequisite. Spine: ticket read decision. Scope excludes full OAuth, RAG retrieval, production authentication implementation.

## Source reading
Reused saved public Exa full-text snapshots; no fresh web requests. Read P2 (protect-ai/raw/fetch-1.json) entire text, including Identity, Define your tenant and authorization requirements, Data filtering, Encapsulate multitenant data logic, Summary. Read P3 (raw/fetch-2.json), specifically Token Passthrough, Session Hijacking mitigation, Scope Minimization; reviewed introduction and confused deputy context. P3 is explicitly revision 2025-11-25, not a claim about current protocol behavior.

| Claim | Primary source location / example evidence |
|---|---|
| Authenticate identity and map users to tenants using authoritative identity context | P2 Identity; Responses API workflow step 3 derives tenant context from authenticated request |
| Tenant isolation alone may not satisfy per-user policy | P2 Define your tenant and authorization requirements, Data filtering |
| Enforce policy on every retrieval before passing data to model | P2 Data filtering; Multitenant stores |
| Central data API acts as authorization gatekeeper | P2 Encapsulate multitenant data logic |
| Client-provided ID is not trusted authenticated identity | P3 Session Hijacking mitigation: internal user ID derived from token, not client |
| Validated identity/scopes still require server-side authorization | P3 Scope Minimization common mistakes |
| Owner-only rule, static identities, response fields and attack inputs | Author-created teaching fixture, not prescribed product policy |
| 200/400/401/403/404 labels | Example API design mapping only; no HTTP server and no claim of network measurement |

## Outline
1. Ticket question and four concepts. 2. Explicit policy and trusted context. 3. Runnable fixture. 4. Interpret positive and negative evidence. 5. Transfer to AI tool calls; limits. 6. Draw and modify policy exercise with answer.
