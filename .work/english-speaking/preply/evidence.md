# Preply speaking guide — source and claim evidence

Checked 2026-10-19. Reader question: does a chosen-tutor subscription fit a Taiwan adult's speaking goal and schedule, and how can they avoid losing purchased lessons or unwanted renewals? Scope: bilingual guide, standard recurring plan plus separately bounded yearly terms, learner reports and an original four-lesson proposal task. No trial, registration, checkout purchase or classroom operation performed.

## Acquisition and degradation

Full callable inventory searched for Groundlane and public search/fetch alternatives: Groundlane connector absent, Exa MCP available. Existing approved local save-source.py made one bounded web_search request to 18087; connection refused. No token printed, no new client, no Groundlane repo changes/restart. Exa MCP search and fetch used for public URLs only. Raw responses in sources.json preserve initial failure, searchTime, exact content and toolDegradation. Exa supplies no HTTP status/truncated boolean, so these are not invented. Fetch requested 20,000–50,000 characters per page; supported claims were read in complete returned article bodies, not search snippets. Dynamic account checkout and all Dcard comments are outside that scope.

## Adopted official pages and reading range

1. https://preply.com/zh/online/english-tutors — Chinese public directory returned body: profiles, displayed duration/pricing examples, selection/how-it-works and price tables. Read all returned content. Dynamic inventory/currency-specific checkout not tested. Individual profile prices not reproduced as universal rates. Marketing learner-progress claim omitted because underlying study not evaluated.
2. https://help.preply.com/en/articles/4966680-how-does-my-preply-subscription-work — full article + FAQ returned/read, including 28-day cycle, one tutor, minimum 4, no standalone packs, 50/25-minute division, rate acceptance, scheduled protection, pause/cancel. Core reread performed after drafting.
3. https://help.preply.com/en/articles/4179487-how-to-book-a-trial-lesson — full article + FAQ returned/read, paid 25/50, one per tutor, no subscription required for standard trial, duration fixed after confirmation, typical trial and timing. Core reread performed.
4. https://help.preply.com/en/articles/4182743-how-to-request-a-free-trial-lesson-replacement — full returned article + FAQ read, two replacements per account, completed trial only, subscription disqualifies, tutor absence separate, support review.
5. https://help.preply.com/en/articles/4179413-cancellation-policy-for-students — full returned article + FAQ read, 12-hour rule, current scheduled time, tutor may reschedule by agreement, message alone insufficient, weekly setup separate.
6. https://help.preply.com/en/articles/13925396-how-to-cancel-a-lesson — full returned article + FAQ read; confirms >=12 hours in detailed subsection, trial same rule and balance outcome. This complements policy intro's >12 wording. Reader advised to act early rather than at boundary.
7. https://help.preply.com/en/articles/15432023-what-happens-when-i-cancel-my-subscription — full returned article + FAQ read, >=24h, confirmation email/status, single tutor only, booked lessons protected, unscheduled expiry, support within24h.
8. https://help.preply.com/en/articles/9901475-how-do-refunds-work-at-preply — full returned article + FAQ read, unused cycle, within28 days, individual review, original method/up to30days. Core reread performed.
9. https://help.preply.com/en/articles/7924262-how-do-i-move-my-lessons-to-another-tutor — full returned article + FAQ read including 8x20=160 example, value conversion/new rate, keep-both subscriptions, no cash withdrawal, new expiry cycle. Introductory parts and conversion sections all covered, not just search excerpt.
10. https://termsofuse.preply.com/terms_of_use/en_SubscriptionServicesTerms.pdf — Exa full returned text read from Updated August28 2026 through sections1–17 CONTACTS. Console initially truncated centre portion, so sections4.6–4.12 reread from preserved raw in a separate call. Paid/free trial route distinction, annual364 days, monthly28, 14-day annual trial refund categories, no posttrial refund, 20day renewal postponement, no-show and payment fees directly support article. PDF skill read in preceding school research applies here; no layout inference, contract legal interpretation, local-law conclusion or court advice. No need to render because no visual tables/forms used; textual clauses only. Full PDF converted output retained in raw.

## Community reading and bias

Exactly three adopted community documents; available full post body read for each. Comments explicitly limited to returned comments, not claim of entire thread.

- https://www.ptt.cc/bbs/Language/M.1725175723.A.20D.html : posted Sep1 2024, edited Dec29 2024, sssmart/Elaine. Full returned body through footer read. Learner describes pairing platforms, small plan, webpage-sharing and preparatory exercises. Contains pref referral URL, shortened referral URL and NativeCamp promotion. Internally inconsistent free-vs-discount trial wording is explicitly not adopted as current policy. Prices, other-platform terms, “no commitment” simplification not copied as present rules. Promotional-interest signal clear; payment relationship unknown.
- https://www.dcard.tw/f/language/p/261715634 : June23 2026, 小米. Full returned main body read: graduate-school response difficulties, personalised discussion/presentation work, reported AI review and support experience, choice overload, referral offer. Two returned comment passages read, including a one-sided account of 50-minute trial being ended early. Other comments, platform records and accusation verification unavailable. Article attributes commenter separately from OP and does not generalise. AI feature universality and exam sufficiency opinion not adopted.
- https://www.dcard.tw/f/language/p/262275714 : Oct9 2026. Full returned main body read: trialled both platforms, renewal concern, recording uncertainty. Three returned comment passages read; one describes downloadable audio. OP's questions are not provider facts. No visible referral code in returned main body; commercial relationship unknown. Availability of recordings/subtitles/AI per account not asserted. Connectivity comparison is individual, not benchmark.

Excluded: D77 Feb2026 referral post (high textual overlap with 2024 account, no independent-evidence count); French-course Dcard (different learning language); search-only tutor-facing replacement help and no-show text as direct article support; platform stars/averages as learning effectiveness.

## Claim verification and core rereads

| Claim | Direct support | Verdict / action |
|---|---|---|
| Standard subscription per tutor, auto28days, minimum4, no standalone packs | subscription full FAQ; terms2.3/4.1 | Confirmed, reread original after draft |
| 4x50 vs8x25 same total time | subscription duration example | Confirmed; 200 minutes both, no extra teaching time claim |
| Tutor-specific price and confirmation for changed tutor rate | subscription How billing works | Confirmed; no fixed platform-wide TWD quote |
| Trial paid,25/50, one per tutor, standard trial before subscription | trial article FAQ | Confirmed, reread |
| Free replacement max2 accountwide, after subscription not available | replacement page | Confirmed; no unlimited/free-trial guarantee |
| Unscheduled expire; scheduled may be after renewal | subscription renewal/FAQ, terms4.9 | Confirmed, reread; didn't collapse all unused into expired |
| Pause once/cycle up to20days | subscription needs-change; terms4.8 | Confirmed, deadline before renewal |
| Lesson cancellation >=12h vs subscription cancellation >=24h | cancel-lesson detailed subsection; cancellation-subscription FAQ | Confirmed; > vs>= intro wording addressed by safer advance action |
| Missing class consumes balance; tutor agreed system reschedule necessary | terms4.10; cancellationFAQ | Confirmed; a chat message alone not completion |
| Cancel doesn't auto refund; cycle unused +within28day individual review; original method up to30days | refund full article | Confirmed, reread; no unconditional refund |
| Switch based on value not equal lesson count; keepboth retains old subscription | tutor-move full page | Confirmed; credits not cash; no end-date escape claim |
| Annual billed364; 28day refill;14day trial refund then no-refund rule | terms4.1/4.11(b) | Confirmed as documented product category, checkout availability not assumed |
| NT$600x4=2400 | original illustrative calculation | Recomputed; hypothetical explicitly labelled, not provider offer |

## Closed gaps and acceptance limits

✅ Public policy facts above retrieved and reread. No fact in article depends only on search highlights.
✉️ Personalised current fee/currency, tax/processing total, annual availability and promotion terms live in account checkout. Ask Preply support before purchase for the named tutor/plan, final charge, next renewal and offer-specific refund terms if the checkout is unclear. Public directory and current help/terms were read; article does not invent a quote or assert all Taiwanese users see identical plans.
✉️ Individual learning materials, correction method, available evening slot and audio/video/subtitle/AI access require the selected tutor and account. Ask tutor before trial and support for exact account feature where needed. Public directory and community feature claims read; these were not generalized into features guaranteed to everyone.
No claim of a verified lack of public information. No research-source-registry modification because ownership excludes registry; this is per-article conditional evidence, not a universal reusable study. No paid usage, private-data upload, full-site gate or live publication acceptance.
