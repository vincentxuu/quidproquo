# Final language and semantic review

Read-only review after redirects.json consolidation. Reviewed canonical zh/en pairs for series 0, 1, 2, 3, 4, 13, 14 (overview, rules, website, workbench, XSS/IDOR, payouts, certifications).

Result: no blocking semantic or translation defect found in this review.

- Overview, rules, and website now occupy correct canonical topics, with matching full English teaching sections, tables, exercises, checklists, references, and bilingual links. Their chapter numbering agrees with revised series orders rather than historical filename numbers.
- XSS/IDOR canonical article intentionally retains the richer original demo and technical explanation. Both languages contain the same two demo/output blocks, authorization example, encoding limitations, conditional Google payout table, practice resources, and next/previous topic links. The text explicitly says the Node demo prints responses and does not open a browser; it does not claim browser execution was tested. The described browser behavior follows the HTML example rather than merely status 200.
- Workbench zh/en have matching three code blocks, loopback server, JSON-search behavior, session/ownership controls, expected 401/403 outcomes, and caution that status alone does not establish a vulnerability. This agrees with the website exercise. No promise that the safe shop itself demonstrates XSS or IDOR remains.
- Payout zh/en match in table categories, maximum-versus-base distinction, conditional example arithmetic, external/internal threat scenarios, exploit/report prerequisites, and panel discretion. No generic report checklist guarantees a multiplier or payout.
- Certification zh/en preserve all substantive sections and the full 0–14 practice map; translated site links select English counterparts. No income/eligibility/credential guarantees or claim all labs were completed.
- Reviewed internal topic links select website/workbench/RCE/payout/cert topics correctly after consolidation; language counterparts resolve to matching article stems.

Scope boundary: semantic and bilingual recovery review, not an independent fresh external audit of every retained claim. XSS detailed reward table explicitly retains its 2026-10-13 source-view date. Root's focused source-evidence ledger supports changed reward claims; mechanical checks, build, and live publication remain separate evidence states. No files edited by this review.
