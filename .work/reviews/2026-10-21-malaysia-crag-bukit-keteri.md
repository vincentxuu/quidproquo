# Review note: bukit-keteri

Authoring-side self-check (not an independent review), 2026-10-21. Read the complete zh/en pair in this checkout against `.research/2026-10-21-malaysia-crag-bukit-keteri.md` and section 6 of `docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md`. No article facts were added that are not in those two files. No private data transmitted.

## post-verify

🟢 Every route row in the four tier tables was matched line by line against the research note's "Route evidence" table: Permatang K3 5c+, Orang putih mai belah 5c 32 m, Susu 6a+, Dust in the Wind 6b, View 6b+ 23 m, Ayaq Timbui 6c 9 m (set 2020-07-07), Back Bone 6c+ 23 m, Kari Hijau Australia 6c+, Haz Chu Rainchecked? 6b+/c 70 m 3 pitches, Sama Sama Orang Kampung 7a, Reini Robot 7a 18 m, Keretapi 7a+, Zamboney 7b+, Shaved Beaver 7c 30 m, Scherer Blaerer 7c+, Terima Kasih 7a, Langkasuka 8a, Achtung Klapperschlange 8a 30 m, Bukit ber Kebaya 8a 28 m (set 2008, FA Jafni Jamaludin Sep 2023), Sur le chemin de Zezette 8a+ 30 m. 20 rows per language, identical set in zh and en.

🟢 The theCrag / Mountain Project disagreement about which hill is developed is quoted in full in both languages (theCrag: only the northern hill, partly on its west and north faces; Mountain Project: most climbing on the west face of the southern hill, the northern hill undeveloped). The article states that neither page cites the other and does not pick a reading.

🟢 The anchor passage is attributed to the Mountain Project comment (Nate Ball, 2019-03-15, quoting Justin Polgar) and is described as rappel anchors — one or two stainless steel ovals or carabiners that Perlis Climbers lower from and do not replace often — not as route bolts.

🟢 Bolt condition is split into three kinds as the contract requires: the 2007 Mammut/Camp5 batch (2023 video and More Days Off 2023-12-28, both marked as secondary, with the material and replacement history stated as unpublished); the 2023 attribution of maintenance to a local Perlis Climb Development, set against More Days Off's "does need maintenance"; and dated 2026 community reports from the theCrag threads (2026-02 unknown hanger on a Kasih Wall multipitch, 2026-06-19 rehang and 2026-06-20 loose-hanger report on Haz Chu Rainchecked?, 2026-10 vegetation and loose rock on Disturbing) labelled as community reports rather than maintenance records.

🟢 The South / Kasih Wall access restriction is quoted from the theCrag South page ("Section has access restriction due to the discovery of ancient mural. Do contact local climbers for access permission."), and the article states that without permission the whole South sector is off.

🟢 The station-name conflict is presented as unresolved: theCrag calls it "Tasik Melati" with a 376 m approach, the 2026-07-24 KTM Komuter Utara timetable calls it "Bukit Ketri", and the text says no published statement links the two names. The text tells the reader to navigate to the timetable name and ask on arrival.

🟢 Permit status is stated with both halves: the Perlis forest-permit list names seven sites (Gunung Perlis, Bukit Pelarit, Pintu Wang Gunung, Bukit Wang Mu, Bukit Jernih, Bukit Chabang, Bukit Manek) and Bukit Keteri is not among them, the 2026-08 hikers guide lists no permit for it, and the 2025-04 Perlis Geopark post says the hill was recently gazetted a forest reserve and geopark heritage site with no climbing regulation published. The article does not claim the area is unambiguously public land.

🟢 Emergency number 999 is linked to the Malaysian government MERS 999 page, and the insurer check is phrased conditionally (ask about outdoor lead, rescue, medical, repatriation) without promising coverage.

🟢 No airfare, holiday calendar or day-by-day itinerary content. Transport is limited to the rail line, the ETS, station walking directions, the car route and parking.

🟢 Mechanical gates rerun on the six new files: `climbing-grade-convert.mjs --write` then `--check` → 6 files, 44 grade rows, 0 issues; `check-process-leak.mjs` → clean; `check-post-quality.mjs` → 0 errors (one tag warning fixed by adding the English gloss "deep-water bouldering" in the Langkawi pair); `check-post-references.mjs` → 0 errors; `check-lang-parity.mjs` → 0 issues; `check-tw-terms.mjs` → 0 blocking, 0 to review; `check-series-order.mjs` → no blocking order issues. Full-site `pnpm verify` and the external link checker remain the parent's job.

🔵 Gaps written as gaps, not filled in: per-pitch grades for Haz Chu Rainchecked? are not published, so the row keeps the source's "6b+/c" in the grade column with the pitch count in the length column and the conversion range (5.10d–5.11a/b) in the notes; pitch count for the multipitch Terima Kasih is not published either; no West or South route has a published length, so those cells read 未公布 / not published; the West sector height field (24 m / 57 m) carries no explanation in the source, so it was dropped from the prose rather than interpreted. King of England 7b (2025-07) appears in prose only, because its source is the trip notes rather than theCrag / Mountain Project / moredaysoff / Perlis Climbers.

## post-review

Reader fit: the article supports a real destination and a real transport plan — a 376 m walk from a commuter station, a 15-minute station-to-wall route described turn by turn, and a Grab drop-off coordinate — instead of generic "get to Perlis" advice. The four tier tables let a reader pick 4a-to-8c+ objectives on the same page. Both required conflict items (which hill, which station name) and the three hardware items (bolts, anchors, warnings) are in the reader's path rather than buried at the end.

Structure check against `.agents/skills/post/references/crag-guide-contract.md`: seven H2 in the required order, three transport H3 under 怎麼去, four grade H3 with the exact headings the script owns, the fixed 換算說明 paragraph first in the routes section, and a `**指南書**` bullet whose first sentence is exactly「路線難度與路線數主要來自線上資料庫，以指南書為準。」followed by the out-of-print Malaysian guides and the statement that Malaysia has no current printed guidebook. English mirrors all of it, including the equivalent guidebook sentence.

English localisation: sector cells read `West`, `West (Belly Button)`, `South`, `South (Kasih Wall)`, `Robot Wall` — no Chinese left in the English tables, which was a correction made on the earlier Korea pair.

Required small corrections before final acceptance:
- 🔵 Reviewer correction (applied): the multipitch rows originally used the plain route grade. They now follow the contract's multipitch convention, 「最難 6b+／6c」 / 「最難 7a」 with 「最難 5.10d」 / 「最難 5.11d」 in the YDS column, and the pitch information moved into the length column, so the hardest pitch is what the YDS column reports.
- Optional trim, not a blocker: the two-source hill table is long, and a reader who only wants the conclusion can move to the 這是什麼樣的岩場 paragraph that says not to pick a sector from the hill name. Keeping the table is deliberate because the contract asks for both readings to be visible.

## post-polish

Read both languages end to end for flow and jargon. The piece leads with the practical promise (a station's walk away, 77 routes, no permit) before introducing the hardware problem, and the concrete details (376 m, 15-minute turn-by-turn walk, the Tuesday market, monkeys knocking rock off the edges) carry the middle sections so the attribution stays attached to the advice.

Chinese wording: 「來源沒列」 is used for tiers with no verifiable route rather than padding the table, and the note paragraph and table headers are the script's exact strings. Lengths that no source publishes read 「未公布」 in Chinese and "not published" in English. Terminology is kept consistent across the pair: 運攀 / sport climbing, 確保站 / fixed point, 下降 / rappel, 掛片 / hanger, 錨點 / anchor.

No long-sentence pile-up, no process-leak pattern (the script confirms zero), and the attribution hedges stay under the limit: the only attribution buttresses in the body are the two "the source carries none" statements, and each one sits directly above the tier it qualifies rather than being repeated as a general disclaimer. No article edits remain outstanding for this pair; final verification is the parent's.
