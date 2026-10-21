# Independent review: vietnam-crag-huu-lung-west

Reviewer: parent session, 2026-10-21. Reviewed the complete zh/en pair, the twelve sector pages it draws on, and the matching research note.

## post-verify

- 🟢 **Sources opened for this article**： theCrag（thecrag.com）的 Hữu Lũng 總頁與十二個子區頁（逐條路由 `data-route-tick` 取得）；VietClimb（vietclimb.vn）的 Duc Bungalow 與 Outdoor Trips 頁；英國旅遊建議（gov.uk）的緊急電話頁。逐項與逐條路線記在 `.research/2026-10-21-vietnam-crag-huu-lung-west.md`。

- 🟢 **Route rows transcribed from the sector pages**： WoofStuck 13, Passe-Muraille 11, Thánh Gióng 23, Cobra Wall 14, Primitive Wall 7, Infinity Cave 10, Yuji Fire Cave 4, Weeping Wall 9, The Crying Moon 8, Floatin' Shore 9, Papaya Wall 7, The Arch 5 = 120 routes, matching the sector pages pulled on 2026-10-21. Names, FR grades, lengths, pitches, bolt counts and stars in the article match `.research/2026-10-21-vietnam-crag-huu-lung-west.md` row for row. 147 (main-valley article) + 120 = 267 = the crag total, so the two Hữu Lũng articles neither duplicate nor drop a route.

- 🟢 **Sector descriptions are quoted, not paraphrased into stronger claims**： WoofStuck ("right side features steep and compact rock offering hard & sustained lines with rare & tiny holds… alpine atmosphere defines the left side with long routes on fragile rock"), Passe-Muraille ("massive 80m tower located in a secluded valley visited by buffaloes"), Thánh Gióng ("massive cliff folding out like a karst origami… L section proposes uncommon climbing in the area, i.e. very fingery and bouldery climbing on a vertical and blank wall"), Primitive Wall ("it's under development… still dusty and has rockfall hazard"), Floatin' Shore ("one of the few crags enjoying all-day shade… current grades are only indicative"), Papaya Wall ("the ideal beginner's crag… between 5a to 6a+ with approachable lengths of no more than 20 meters"), The Arch ("due to the approach better take a full day"). Each appears in the article with its own caveats.

- 🟢 **Development-status claims are dated and attributed**： Primitive Wall's first ascent is Sungmin Ham and Geumjin Song, March 2023, and the page says the landlord allowed development but access fees have not been discussed yet and may apply after the official opening. Weeping Wall is labelled "new crag 2025" by the source. Floatin' Shore's names and grades come from a VietClimb Instagram post of 8 October 2025, and the article says that where it quotes the table. Passe-Muraille's development (started 2018, completed 2019) is stated with the source's list of contributors omitted rather than paraphrased as an authority claim.

- 🟢 **Equipment requirements are the source's, not the author's**： Cobra Wall's own page requires "at least a 70 meter rope and 16 Quick-Draws"; the article repeats it as a requirement and separately records the crag-level advice of 20+ draws, 25 for the longest lines, 30 if two routes are open at once. The Sleeve's 4-pitch 72 m Peanut Butter & Jelly is quoted with the sector's access warning ("free-hanging fall risk and rope ascending skills required") attached to the same sector, not separated from it.

- 🟢 **Fixed-gear warnings stay with their sector**： Primitive Wall "about the top anchor"; WoofStuck "loose rock" and a bird nest; Passe-Muraille "missing rings on the second pitch anchor", "plate on 2nd bolt missing", "loose bolt"; Thánh Gióng "hornet nesting at the last 3rd bolt" and "potential for heavy rope drag". The article prints them where the reader will meet them.

- 🟢 **Sun, shade and rain tags are not extrapolated**： The season table lists only the tags each sector actually carries: WoofStuck always shady, Passe-Muraille and Thánh Gióng and L'Ile Noire morning sun, Weeping Wall afternoon sun, Infinity Cave dry in the rain, Floatin' Shore all-day shade. Sectors with no tag carry an em dash rather than an inferred value.

- 🟢 **Approaches and parking are quoted with their coordinates**： Thánh Gióng's 5–10 minute steep hike with the turn at 21.616449,106.365953 and the ridge at 21.616313,106.366659; Cobra Wall's left-left turn and the bikeable path; Primitive Wall's trail just after the concrete bridge; Yuji Fire Cave's toilet block, concrete wall used as a bridge and short fixed rope; Floatin' Shore's ~100 m scramble at 21.626624,106.385094; Papaya Wall's plank crossing and driveway at 21.631302,106.372601; The Arch's 20-minute climb on loose clay at 21.565729,106.411170.

- 🔵 **Correction applied**： A sentence in the rules section had a typo, "WooofStuck's Crystal Planet extension", in both the Chinese and English files. It was corrected to "WoofStuck" in both. No other wording changed.

- 🔵 **Correction applied — two season-table cells**： Passe-Muraille's rain cell said "sheds light rain" and Papaya Wall's sun cell said "full sun"; neither tag exists on those sector pages, so both cells are now an em dash with a note that the source carries no tag. The Yuji Fire Cave row no longer says the cave is "more comfortable in winter", which was an inference rather than a source statement. Chinese and English were corrected together.

- 🟢 **Grade conversion verified mechanically**： `climbing-grade-convert.mjs --check` on both files: 115 rows, 0 issues. The irregular source grades in this scope are handled by the script as expected: "6b+/c" → 5.10d, "7b/b+" → 5.12b, "7a+/b" → 5.12a, "8a/a+" → 5.13b, "8c - 9a" → 5.14b (the script takes the first of the two).

## post-review

Reader fit: this article's actual decision is "which wall for which day, and what do I skip when it rains". The season table is organised by sun and rain, the rules section is organised by what can actually hurt you (development, slipping clay, hornets, rope drag, rockfall), and the article repeatedly says the DWS-adjacent risk here is the approach, not the wall.

Structure: contract H2s in order, transport subheadings present, four tier H3s exactly as the script's HEAD strings, plus a Trad subsection with its own table shape (Route / Original grade / YDS / Length or pitches / Wall / Notes) as the contract prescribes for traditional climbing.

- 🔵 **Correction applied**： The "Wo｜Andering" style full-width pipe fix was applied in the sibling article; this article's route names contain no literal pipes, so no equivalent fix was needed. Verified: the table parses and the script counts 115 rows.

⚠️ **Known limitation, stated in the article.** The Crying Moon has no published approach text on its sector page. The article says so rather than inventing a walk, and notes that the approach is described on the way to Weeping Wall (gated bridge, farmhouse on the left).

⚠️ **Known limitation, stated in the article.** Primitive Wall's access fee has not been set. The article says the landlord allowed development but fees have not been discussed and may apply after the official opening, so a reader budgeting cash should not assume a number.

Reader value check: the article does not hide the unglamorous parts. It says Primitive Wall is still dusty with a rockfall hazard, that The Arch's path is extremely slippery when wet and deserves a whole day, that the WoofStuck left side is "alpine atmosphere on fragile rock", and that Floatin' Shore's grades are indicative only. Those are the sentences that keep a reader from making a bad plan.

## post-polish

Read the pair end to end. The Chinese runs on short declarative sentences and keeps each warning next to the wall it belongs to, which is why the article can carry eleven sectors without becoming a list. The English preserves that structure; where the Chinese uses a dash for an aside the English uses a comma or a new sentence rather than em-dash chains.

No long-sentence pile-ups and no hedge stacking: `check-process-leak.mjs` reports nothing. The only hedged statements are the ones the source itself hedges (Floatin' Shore's indicative grades, Primitive Wall's pending fees, The Crying Moon's missing approach), and each is attached to the fact it qualifies.

One editorial decision worth recording: the article's "Getting there" section deliberately does not repeat the Hanoi-to-Hữu Lũng transport, which is already in the main-valley article; it covers the valley-internal movement and links back. The English version does the same, so the two articles do not duplicate each other's traffic.
