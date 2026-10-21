# Review note: langkawi

Authoring-side self-check (not an independent review), 2026-10-21. Read the complete zh/en pair in this checkout against `.research/2026-10-21-malaysia-crag-langkawi.md` and section 6 of `docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md`. No article facts were added that are not in those two files. No private data transmitted.

## post-verify

🟢 Pulau Tuba figures match the research note: 20 sport routes, 6a to 7a+, 25 ascents, 17 m, one sector (Gua Batu Beach), description quoted ("A relatively small island located nearby Langkawi island that is reachable by by a boat ride from Langkawi jetty").

🟢 The private-land condition is quoted and attributed, not paraphrased into something softer: theCrag's access note — "The land at the climbing area is privately owned, for access permission please contact Rozaiman @ BlankFace Adventures 014 817 5946. Trespassers will be prosecuted." — appears in both languages, with the named contact, the phone number and the prosecution warning, and the article states that permission here is a phone call made before travel rather than a form.

🟢 The boat is described exactly as the source has it: from Kuah Ferry Station head east to a separate port, ticket at Boat Tambang Pulau Tuba, RM5, operating 09:00 to 19:00 at odd hours only, then head west from the Pulau Tuba jetty to Kampung Tepi Laut and Gua Batu. The article draws the reader-facing consequence (19:00 is the last crossing; return sailings are not on a continuous grid) without adding a timetable the source does not carry.

🟢 Pulau Jong is handled as a community listing, not a verified count. The article says the entry's page content cannot be read at the moment (what comes back is the theCrag subscription page), states the 12 deep-water problems and the boat charter as a community listing, and explicitly does not treat the number as a checked figure. No Font grades are published, so no bouldering table is printed and the routes-by-level section says so.

🟢 The route table carries only the one published named line, Sketchy 2 First Bolt 6a+, with theCrag's iconic marking and the page date; the length cell records the crag height of 17 m and states that the route length itself is not published. The 入門 / 進階 / 高手 tiers each say the source carries no named route rather than padding rows.

🟢 Season is handled from the research note only: Langkawi on the west coast, outside the northeast-monsoon rain belt that hits the peninsula's east coast and western Sarawak (MetMalaysia), with the nearest climbing region, Perlis, driest January to April. The article states that Langkawi has no published monthly rainfall figures of its own, so the judgement is not dressed up as a weather statistic.

🟢 Emergency number 999 is linked to the Malaysian government MERS 999 page; the insurer check is conditional and names the items to confirm, including deep-water bouldering specifically. The article does not promise that a phone call will be answered — it says the opposite, that an unanswered call is not permission to enter.

🟢 No airfare, holiday calendar or day-by-day itinerary content.

🟢 Mechanical gates rerun on the six new files: `climbing-grade-convert.mjs --write` then `--check` → 6 files, 44 grade rows, 0 issues; `check-process-leak.mjs` → clean; `check-post-quality.mjs` → 0 errors (one tag warning on `bouldering` was fixed by glossing the first mention as 深水抱石（deep-water bouldering）in the Chinese file); `check-post-references.mjs` → 0 errors; `check-lang-parity.mjs` → 0 issues; `check-tw-terms.mjs` → 0 blocking, 0 to review; `check-series-order.mjs` → no blocking order issues. Full-site `pnpm verify` and the external link checker remain the parent's job.

🔵 Gaps written as gaps, not filled in: jetty parking information is not in the crag data, so the parking section says so; BlankFace Adventures has no second public channel to cross-check, so the article says the contact is published only on the theCrag page; the Pulau Jong page content is unavailable, so the 12-problem figure and all its details are marked as a community listing; no route length is published for Sketchy 2 First Bolt.

## post-review

Reader fit: the article answers the three questions a reader actually has about a holiday island — is the climbing real, who do I ask, and does a day trip work — and it puts the hard prerequisite (private land, a phone call, trespassers will be prosecuted) in the first paragraph rather than in a rules appendix, because that is the fact that changes the whole plan. The boat schedule is treated as the second planning constraint, right after it. The 依程度挑路線 section is deliberately thin and says why.

Structure check against `.agents/skills/post/references/crag-guide-contract.md`: seven H2 in the required order, three transport H3 under 怎麼去, four grade H3 with the exact headings the script owns, the fixed 換算說明 paragraph first in the routes section, and a `**指南書**` bullet whose first sentence is exactly「路線難度與路線數主要來自線上資料庫，以指南書為準。」followed by the out-of-print Malaysian guides and the statement that Malaysia has no current printed guidebook. English mirrors all of it, including the equivalent guidebook sentence.

English localisation: the route table uses `Gua Batu Beach` and `not published`; the Chinese file keeps the sector name in Latin script because that is the name on the source page and in the approach description. The Chinese gloss 深水抱石（deep-water bouldering）was added on the first mention so the term and its English equivalent are both searchable.

Required small corrections before final acceptance:
- 🔵 Reviewer correction (applied): an earlier draft asserted that the island has no medical resources and that deep-water bouldering is commonly excluded from travel insurance. Both were unsupported by the research note, so the first became a statement about expectations for medical response and evacuation time, and the second became an instruction to check the cover item by item. Neither claim survives in the current text.
- Optional trim, not a blocker: the boat timetable is discussed in two places (the 大眾運輸 section and the opening of the season section) because it is the constraint that governs the day. The second mention is one line; removing it would leave the season section without a practical anchor.

## post-polish

Read both languages end to end for flow and jargon. The piece keeps a consistent voice around the permission issue: it states the rule, then tells the reader what to do, then says what not to read into it. English avoids "unverified" and similar process wording — the limitation is phrased as what the page does and does not carry, so the reader gets the constraint without the research diary.

Chinese wording: 「讀不出內容」 and 「社群記錄」 mark the Pulau Jong limitation without importing a research log; the permission quote is kept in the source's English because that is the wording the landowner's page uses. Terminology is consistent across the pair: 私有地 / private land, 許可 / permission, 深水抱石 / deep-water bouldering, 船班 / sailing, 碼頭 / jetty.

No long-sentence pile-up, no process-leak pattern (the script confirms zero), and the attribution buttresses stay under the limit. No article edits remain outstanding for this pair; final verification is the parent's.
