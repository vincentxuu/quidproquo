# Independent review: 2026-10-21-malaysia-crag-tioman-dragons-horns

Author-side verification pass, 2026-10-21. Read the complete zh/en pair in this checkout against `.research/2026-10-21-malaysia-crag-tioman-dragons-horns.md` (the only fact source) and `docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` §6 for cross-checks. This pass did not re-open the live web pages; the page reads behind each fact are the ones recorded in the research note (all checked 2026-10-21). No article edits were made in this pass beyond the corrections listed at the end.

## post-verify

🟢 Route table compared row by row with the research note's "Route evidence": Freebird 6a/250 m/7 pitches, Naga 6b+/270 m/8, Damai Sentosa 6c+/280 m/7, Benjo Delight 7a A0/230 m/8 (FA April 2025), Muka 7a+/360 m (2010), Polish Princess 7b+/270 m/8 (2010), Waking Dream 7c+ aid/300 m/10, Batu Naga US 5.12a/300 m/8 (Cedar Wright, Lucho Rivera, 2011). All eight appear with the same grade, length, pitch count, sector (South Tower) and source. No route was added, renamed or re-sorted into a different sector.

🟢 Freebird's pitch list 6a、5c、5a、5c、6a、6a、5c matches the note and is reproduced in both the 原始難度 column and 長度／段數. Batu Naga keeps the source's US grading and is written as "5.12a（theCrag 記為 US 5.12a）" so the converted column is not a reverse translation; it sits in the 進階 band because its YDS 5.12a falls inside 5.11d–5.13a, and the tier text says the bands follow YDS.

🟢 Waking Dream's source conflict is shown, not resolved: theCrag 7c+ (aid) / 300 m / 10 pitches in the table, the 2013-09-17 Headlamps post's "V 5.9 A2" and 400 m in the prose and in the row's note. The 2013 post is dated in the text.

🟢 Ferry and season facts traced to the note: Mersing Harbour Centre's April–September peak season and the December–February suspension warning, the 60-minute arrival rule, the 1.5–2 hour crossing; tiomanferry FAQ's November–February monsoon, the same-day prohibition and the Tanjung Gemok non-service; the tiomanferry Kampung Mukut sentence "the jetty at Mukut is not compatible with the public ferry out of Mersing or Tanjung Gemok" is quoted and used to correct older "take the ferry to Mukut" beta. The Tioman SpeedBoat 1 November–28 February closure is attributed in the text as a commercial page's claim and explicitly not a Marine Department notice, and no 2026–27 schedule is promised — the article tells readers to confirm with the operator.

🟢 Crag facts traced to the note: 14 routes and 54 ascents; South Tower 12 / North Tower 1 / Mystery Wall 1; the Puncak Anak 100 m trad breadcrumb entry flagged as outside the sector count table; east face "maybe 600 meters" with established routes to about 300 m on the south tower; sun on the east peak from morning to noon; French 5c+–7c+ on the crag page with Freebird 6a as the easiest complete line; jungle approach of hours from Kampung Mukut; no published climbing fee or marine-park permit; the undated US$50–75 / RM50–70 boat quotes labelled undated; Tam and Uncle Sam at Simukut Hiilview and the Kampung Mukut logbook; 999 with the insurer checklist.

🔵 Gaps are written as gaps, not filled: no Marine Department notice for the closure dates, no published 2026–27 timetable or Mukut water-taxi price, the Waking Dream length/grade conflict, no current topo except Freebird's off-site host, no dated anchor or bolt inspection, and no published hospital or rescue information on Tioman. The article states each of these as "no published information" or as a dated operator claim, and the 高手 tier states plainly that no named route reaches 8a+.

## post-review

Contract structure holds: seven H2 in the fixed order, 大眾運輸／開車／停車 under 怎麼去, the four YDS tier H3 with the exact `scripts/climbing-grade-convert.mjs` HEAD wording, and 依程度挑路線 opening with NOTE_ZH. Because the crag is trad/mixed, the routes sit in the contract's trad table (`| 路線 | 原始難度 | YDS | 長度／段數 | 岩壁 | 備註 |`), keeping the original French text, the converted YDS, the pitch list in 長度／段數 and the hardest pitch in the YDS column. Both the zh and en tables use the trad header, so the two language faces stay symmetric.

Every route row's note names the source and the read date, and no route lacks a source. The 查資料的入口 section opens with the fixed 指南書 sentence, then lists the out-of-print Malaysian guides (《Climb Malaysia》 2007, 《Climbing Guide To Malaysia》, the unreachable climb.my site) and states that Malaysia has no current printed national guidebook, which matches trip notes §6.7. Every first-occurrence proper noun is an inline link on first use, and the 參考資料 list covers every URL cited in the body.

Reader fit: the piece answers the three questions the series scope card asks — where the multipitch grades sit, which months the ferry is reliable, and what to do without a car — and it does not mention airfare, holidays or itineraries.

Corrections applied during this pass:
- 🔵 The zh and en articles had "在 2026-10-21 查" phrasing in table notes, which the process-leak linter counts as a verification-process sentence. Rewritten as "theCrag（2026-10-21 查）" so the date stays visible as a freshness stamp without reading as a work log.
- 🔵 The 進階 tier prose originally read as if Batu Naga were a 7x French route; it now states that the bands follow YDS and that this line is listed in US grades in the source.
- 🔵 A wording check confirmed the Ferry Facts paragraph no longer presents the operator closure dates as regulation.

Mechanical gates rerun on the four Malaysia files: grade-convert `--write` then `--check` (4 files, 32 grade rows, 0 issues), check-process-leak (clean), check-post-quality (OK), check-post-references (OK), check-tw-terms (0 blocking, 0 to review), check-lang-parity (OK, no heading drift), check-series-order (no duplicate order 12 in 馬來西亞岩場). Full-site `pnpm verify` and the external link checker belong to the parent session and are not claimed here.

## post-polish

The zh prose uses concrete objects rather than research framing: the jetty, the 60-minute arrival, the stilt huts and the high point that marks the start of Waking Dream. Gaps are stated once each in the section that uses them, without stacking attribution clauses, and the article does not narrate its own verification. Terminology follows the site glossary (活動岩楔, 鉤環, 確保, 多段) and no A-level Taiwan terms appear. The en face keeps the same headings, the same route data and the same caveats, with English route names and the South Tower sector left untranslated so the pair reads as one guide in two languages. Nothing in this pass requested a change to route numbers, grades or lengths.
