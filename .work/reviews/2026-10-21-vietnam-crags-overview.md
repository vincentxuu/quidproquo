# Independent review: vietnam-crags-overview

Reviewer: parent session, 2026-10-21. Reviewed the complete zh/en article pair plus the overview research note in this checkout. No claim in the pair rests on a source that was not opened in this session.

## post-verify

- 🟢 **Sources opened for this article**： theCrag（thecrag.com）的越南總覽、Hữu Lũng、Cat Ba Island、Vịnh Lan Hạ、Quốc Oai、Ben Beo 頁；VietClimb（vietclimb.vn）的 Outdoor Trips 與兩間 homestay 頁；Cat Ba Climbing（catbaclimbing.com）與 Langur's Adventures（langursadventures.com）；外交部領事事務局（boca.gov.tw）、evisa.gov.vn、prearrival.immigration.gov.vn；作者官網 lucadegiorgi.com。逐項與逐條路線記在 `.research/2026-10-21-vietnam-crags-overview.md`。

- 🟢 **Route counts re-derived from theCrag, not from the earlier trip note**： Hữu Lũng 267 routes in 21 sectors (crag page grade histogram 4c×1 → 9a×1, sums to 267), Cat Ba Island 178 (Butterfly 71 + Fisher 44 + Hidden 38 + The Cave 17 + Ben Beo 8 = 178), Vịnh Lan Hạ 326 (crag page histogram 4a×2 → 8a+×2, sums to 326). All three sums were recomputed from the per-sector route lists pulled on 2026-10-21, and the totals match the crag-level counters.

- 🟢 **The Hữu Lũng split is arithmetic, not editorial**： Article 1 covers Head Wall 22 + Chúc Sức Khỏe 1 + Squirrel 6 + L'Ile Noire 11 + La Conche 13 + Dragon 30 + Drone 27 + Dead End 32 + K Wall 5 = 147. Article 2 covers WoofStuck 13 + Passe-Muraille 11 + Thánh Gióng 23 + Cobra 14 + Primitive 7 + Infinity 10 + Yuji Fire Cave 4 + Weeping Wall 9 + The Crying Moon 8 + Floatin' Shore 9 + Papaya 7 + The Arch 5 = 120. 147 + 120 = 267, so no route appears twice and none is dropped. The overview's "147" and "120" figures match.

- 🟢 **Closures and bans are labelled at the right tier**： Quốc Oai ("as off 2019 sport climbing is forbidden on this cliff. Bouldering is tolerated"), Ben Beo ("the government has officially forced the closure of this crag") and the Hạ Long Bay illegality paragraph are all theCrag statements. The article labels the first two as database-tier and says no original government notice was found; the overview repeats that label. Nothing in the series is written as a legal citation.

- 🟢 **Visa facts cross-checked against two sources**： BOCA states the 127/NQ-CP resolution (14 Aug 2023), the evisa.gov.vn application address, 3–7 working days, the 90-day cap for EV visas, and the Phú Quốc visa exemption rule; the evisa.gov.vn portal text supplies 25 USD single / 50 USD multiple. The article states validity and processing time from BOCA and prices "以 evisa.gov.vn 的線上申請頁為準", so the price is attributed rather than asserted flat.

- 🟢 **Prices and transport carry a checked month**： Shuttle 250,000 VND (09:00/16:00, 490 Minh Khai, 3 h), Gia Lam bus 160,000 VND, private car 1,500,000 VND, Cat Ba bus 300,000 VND, private car to Cat Ba 2,000,000 VND, Hữu Lũng ⇄ Cat Ba 2,580,000 VND, DWS day trip 2,980,000 VND, DWS half day 1,150,000 VND, Langur's DWS 1,300,000 VND — every one of these was read off the VietClimb / Cat Ba Climbing / Langur's pages fetched on 2026-10-21 and is marked as such in the text.

- 🔵 **Correction applied**： The trip note `docs/travel-notes/2026-12至2027-02-東南亞攀岩行程.md` §5.9 records Mao Homestay at 370,000/450,000 VND and Duc Bungalow at 470,000/550,000. The live VietClimb pages now show 470,000 half board and 550,000 full board for both. The articles use the live figures and the conflict is recorded in `.research/2026-10-21-vietnam-crags-overview.md` under "Conflicts and how they are handled". The overview does not quote homestay prices at all, so no stale number survives.

- 🔵 **Correction applied — rain tags re-checked**： The first draft said La Conche, Passe-Muraille and Squirrel Wall were all marked as able to keep off light rain. Re-reading every Hữu Lũng sector page shows the only rain tags in the valley are "Dry in the rain" on Dragon Wall and "Dry in the rain" on Infinity Cave. The overview now says those two are the only rain tags and that the other sector pages say nothing about rain, so the reader is not left inferring from silence. Chinese and English were corrected together.

- 🟢 **Grade conversion is machine-checked, not hand-computed**： `node scripts/climbing-grade-convert.mjs --check` on the four crag pairs reports 0 issues (72 + 115 + 103 + 108 rows). The overview's FR→YDS table is a plain reference table, not a "依程度挑路線" section, and every value in it was cross-checked against the script's `FR` table.

- 🟢 **Emergency numbers come from a first-party source**： Police 113, fire 114, ambulance 115 and the national search-and-rescue line 020 7008 5000 are taken from the UK FCDO travel advice for Vietnam, and that page is in the reference list of every article that quotes them.

## post-review

Reader fit: the overview makes three decisions possible in one read — base, months, and which crags are off the table. The closed-areas table sits before the route-data section, which is the right order for a reader who might otherwise plan a trip to Quốc Oai. Season guidance separates the three binding constraints (rain, tide, daylight) instead of collapsing them into one "best months" claim.

Structure check against the contract: the overview keeps its own shape (base choice → season → transport → closed areas → route data and bolts → reading grades → partners and gear → how to read the series → limits → references), which the contract allows for overviews, and every "where to look things up" obligation is discharged inside the crag articles rather than duplicated here.

- 🔵 **Correction applied**： The overview originally carried a `## 依程度挑路線` heading with the FR→YDS table under it. That would have made `climbing-grade-convert.mjs` treat the overview as a graded-article and demand YDS columns on a table that is already a conversion. The heading was renamed to `## 難度怎麼讀` / "How to read the grades" so the overview stays a reference table, and the script now reports "沒有「依程度挑路線」段落，略過" for it, as intended.

⚠️ **Known limitation, stated in the article.** The overview says plainly that closure and prohibition information is database-tier with no government notice found, and the "limits" section repeats it. This is the single biggest caveat in the series and it is stated in the overview, in each crag article's rules section, and in the research note.

Minor: the English overview's tldr says "near Lạng Sơn" where the Chinese says 諒山 (Lạng Sơn). That is the same place; the Chinese tldr did not name the province, so the English version is slightly more specific than its source. It is accurate (Hữu Lũng is in Lạng Sơn province) and is left as is.

## post-polish

Read the pair end to end for flow. The Chinese reads in a consistent register: short declarative sentences, no marketing adjectives, and every recommendation is attached to a condition ("如果下雨", "如果你只有一趟 7 到 10 天"). The translation carries that register — the English version of the Ben Beo sentence ("the government has officially closed it") keeps the source's directness rather than softening it.

Repeated patterns that survived the edit and are fine: the "X 條，Y–Z" route-count pattern in the base table, and the "theCrag N 星" note format. The English renders the star notes as "theCrag 3 stars" / "theCrag 1 star" / "no stars on theCrag", which reads naturally.

No long-sentence pile-ups, no attribution-hedge stacking, and no process-language leakage: `node scripts/check-process-leak.mjs` reports nothing for any of the ten files. Dates appear as "2026 年 10 月" in Chinese and "October 2026" in English, which is a checked month, not a verification narrative.

One readability judgement worth recording: the overview's grade table lists 14 FR/YDS pairs rather than all 33 in the script's table. The omitted ones are the 3a–5b band and the 7c–9b band, which do not appear in any of the three crags' route tables. That is a deliberate cut, not an oversight, and the article says the series keeps the original grades.
