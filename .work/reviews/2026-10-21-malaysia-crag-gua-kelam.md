# Review note: gua-kelam

Authoring-side self-check (not an independent review), 2026-10-21. Read the complete zh/en pair in this checkout against `.research/2026-10-21-malaysia-crag-gua-kelam.md` and section 6 of `docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md`. No article facts were added that are not in those two files. No private data transmitted.

## post-verify

🟢 Sector figures matched against the research note: 36 sport routes, 63 ascents, "Mostly Sport climbing"; Section A+B 15 routes / 36 ascents / 15 m, Section C 3 routes including the only trad listing / 0 ascents / 20 m, Section D 2 / 0 / 43 m, Section E 10 / 26 / 24 m, Section F 6 / 1 / 23 m. The description text (33 km north of Kangar, Kaki Bukit, sharing the border with the Nakawan Range of Thailand) is quoted from the theCrag page.

🟢 The park fee is dated in the body, not asserted as current: RM5 for foreigners and RM2 for Malaysians, labelled as the 2023 figure on the theCrag page (the page itself updated 2026-10-14). Both languages carry the "2023" qualifier in the fee sentence, in the 規範 section and in the tldr.

🟢 The single published named route is handled as the contract demands: Sijilorotelu 6a appears once, in the 入門 tier table, with theCrag's iconic marking and the page date. The 中級 / 進階 / 高手 tiers carry a short line saying the source lists no named route at those grades and no table is printed. The article states in the 依程度挑路線 introduction that the crag page publishes only one named route, so the reader knows the thin table is the source's shape and not an omission.

🟢 Grade spread is stated as the source states it (4a, 4a+, 4b, 5b, 5c, 6a, 6a+, 6b, 6b+, 6c and above; densest 5c to 6b) and the two sectors that carry real ascent counts (A+B and E) are singled out, with C, D and F described as close to empty. No route name, grade or length was invented for the unnamed tiers.

🟢 Access facts are attributed to the theCrag page: car approach past the village of Kaki Bukit, the small parking lot outside the cave, roadside parking allowed provided it does not block traffic, and the note that sector approaches are described on the individual section pages.

🟢 Permit status is stated with the source's own limits: the Perlis permit list names Bukit Jernih among seven sites and does not name Gua Kelam, and the August 2026 state hiking guide lists the same seven sites. The article adds that lists get updated and recommends asking, without asserting that no permit will ever be required.

🟢 Emergency number 999 is linked to the Malaysian government MERS 999 page; the insurer check is conditional and promises no coverage. Camping is attributed to the theCrag Perlis page wording (a dollar a night here, free elsewhere) rather than presented as a park price list.

🟢 No airfare, holiday calendar or day-by-day itinerary content.

🟢 Mechanical gates rerun on the six new files: `climbing-grade-convert.mjs --write` then `--check` → 6 files, 44 grade rows, 0 issues; `check-process-leak.mjs` → clean; `check-post-quality.mjs` → 0 errors; `check-post-references.mjs` → 0 errors; `check-lang-parity.mjs` → 0 issues; `check-tw-terms.mjs` → 0 blocking, 0 to review; `check-series-order.mjs` → no blocking order issues. Full-site `pnpm verify` and the external link checker remain the parent's job.

🔵 Gaps written as gaps, not filled in: the crag page publishes no per-route lengths, no sector for Sijilorotelu and no grade for the unnamed routes, so the length cell reads 未公布 / not published and the sector cell reads 未標分區 / not stated; the public transport section says the page documents a car approach only and that the last leg from Kangar has no public service, because no transit route to the crag is recorded in the research; the 2026-10-14 page update is a database edit, and the article keeps the fee explicitly pinned to 2023 rather than implying the rest of the page is current.

## post-review

Reader fit: the article answers the question the crag page itself raises — is this worth a day, and what does entry cost — by putting the fee, the crowd behaviour and the sector occupancy in the first two sections, and by naming the two sectors that actually have ascents so a reader can plan a single sector instead of wandering. The transport section links to the sibling Bukit Keteri article for the rail leg rather than duplicating it, which keeps the Perlis pair coherent.

Structure check against `.agents/skills/post/references/crag-guide-contract.md`: seven H2 in the required order, three transport H3 under 怎麼去, four grade H3 with the exact headings the script owns, the fixed 換算說明 paragraph first in the routes section, and a `**指南書**` bullet whose first sentence is exactly「路線難度與路線數主要來自線上資料庫，以指南書為準。」followed by the out-of-print Malaysian guides and the statement that Malaysia has no current printed guidebook. English mirrors all of it, including the equivalent guidebook sentence.

English localisation: sector names read `Section A+B` through `Section F` in the sector table, and the single route table uses `not published` and `not stated` rather than any Chinese. The "Gua Kalem" spelling note, which matters for searching, is present in both languages.

Required small corrections before final acceptance:
- Optional trim, not a blocker: the section table repeats the page's six-row breakdown in prose and in the table. The prose keeps the interpretive part (which sectors get climbed, and how sparse the rest are) while the table keeps the raw counts, so the duplication carries different information on each side.
- Note for the parent, not a defect: this article's table is one row, which is the source's shape. If a later edition of the crag page publishes more named routes, the tier tables should be rebuilt from the page rather than the row count being padded now.

## post-polish

Read both languages end to end for flow and jargon. The piece opens on the thing that makes the crag unusual (the cave is the crag) and on what it costs, then explains the geography, then the crowd behaviour, so the fee never arrives as a surprise at the gate.

Chinese wording: 「來源沒列」 carries the three empty tiers; the fee is always written with its year attached. Terminology is consistent across the pair: 洞穴岩場 / cave crag, 公園入場費 / park entry fee, 分區 / sector, 傳統攀登 / trad, 許可 / permit, 森林嚮導 / forest guide. Romanised Malaysian terms (Kaki Bukit, Kampung, Gua Kelam, Bukit Jernih) are left in Latin script in both languages because they are the spellings readers need for search and for the permit list.

No long-sentence pile-up, no process-leak pattern (the script confirms zero), and the attribution buttresses stay under the limit: the only two sit directly above the tiers they qualify. No article edits remain outstanding for this pair; final verification is the parent's.
