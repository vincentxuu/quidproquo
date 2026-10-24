# Authorization article self-review

## post-verify
Confirmed within stated scope. P2 full text supports authoritative identity/tenant mapping, granular authorization beyond tenancy, every-retrieval filtering before model context, central gatekeeper API. P3 revision 2025-11-25 Session Hijacking supports deriving user ID from token rather than client; Scope Minimization common mistakes requires server-side authorization. Article does not claim this historical revision is current.
Owner-only policy, fixtures, response object and cases are explicitly authored teaching design. No real secret, model call, HTTP listener, external target, or production authentication. Public demo sessions explicitly provide no security. 401/403 etc are API-inspired return fields, not HTTP measurement.
Executed `python3 public/examples/ai-security/authorization-demo.py`: nine cases passed; exact output in authorization-output.txt. Allowed cases verify correct ticket content; all denied cases assert only error field. Cases cover cross-tenant, same-tenant different owner, forged user/tenant fields, positive Bob/Carol controls, missing auth, unknown ID and invalid ID type. Source and output manually compared with article table.
Limitation: existence disclosure and HTTP mapping discussed, not implemented/tested. No blanket product security claim.

## post-review
Both language versions manually read end-to-end. Reader goal, explicit policy, runnable command, expected output, failure interpretation and exercise answers align. Chinese/English frontmatter, policies, case names, status meanings, limitations and internal links agree. Both link one downloadable canonical code source. Full source is dependency-free and has standard main entry point. Excerpts are marked excerpts and refer to full file.
Definitions distinguish principal, tenant, owner and policy. Owner-only restriction identified as lesson policy; same-tenant sharing not inherently vulnerable. Authenticated context cannot be model-selected or drawn from arbitrary request identity fields. Tenant membership check for organization switching stated. All read paths must use policy; unrestricted database tool caveat included.
Manual metadata check: category ai; type guide supported by current content.config.ts; draft true; order 1; bilingual series names; overview and translation links. Mother agent owns registry/whole-site checks and formal .work/reviews record.

## post-polish
Taiwan wording: pnpm check:tw returned 0 blocking and 0 to review. Register scan: 30 paragraphs, two >60-character sentences, caveat density 3%, zero repeated contrast templates/general-English terms. Two long sentences retain a single clear reference/condition; no densely repeated long sentences. Phrase ledger scan has no hits. Manual voice read: concrete ticket opening, Chinese explanations before field names, actionable download/run/draw/change exercises; no source-audit narrative in article. No fabricated local anecdote or Taiwan example.
Process-leak check returned exit 0 for both articles. No diagram fences: policy text and sequential data-source table communicate the small decision without a rendering dependency.

## Remaining validation
Whole-site pnpm verify and final staging checks are parent responsibility; no commit/push/deploy performed by this agent.
