# Independent review: vietnam-crag-cat-ba

Reviewer: parent session, 2026-10-21. Reviewed the complete zh/en pair, the five Cat Ba sector pages, the operator pages and the matching research note.

## post-verify

- 🟢 **Sources opened for this article**： theCrag（thecrag.com）的 Cat Ba Island 總頁與五個子區頁（逐條路由 `data-route-tick` 取得）；Cat Ba Climbing（catbaclimbing.com）首頁、行程與聯絡頁；Langur's Adventures（langursadventures.com）首頁；英國旅遊建議（gov.uk）的緊急電話頁。逐項與逐條路線記在 `.research/2026-10-21-vietnam-crag-cat-ba.md`。

- 🟢 **Route rows transcribed from the sector pages**： Butterfly Valley 71, The Cave 17, Hidden Valley 38, Ben Beo Harbour 8, Fisher Valley 44 = 178 routes, matching the crag page's sector counts and the crag-level total pulled on 2026-10-21. Route names, FR grades, lengths, pitches, bolt counts and stars match `.research/2026-10-21-vietnam-crag-cat-ba.md` row for row.

- 🟢 **Permits are quoted per sector with their own dates**： Fisher Valley 30,000 VND (2026), from Cat Ba Climbing / Mr. Zoom; Hidden Valley 50,000 VND (2026), from the land owner at or near Pizza Hanh Bakery; Butterfly Valley a pass at Langur's Adventures plus 30,000 VND to the farm south of the crag; The Cave 20,000 VND on exit (as of 10/2026); Ben Beo 25,000 VND listed but the crag is closed. The article states that the four permits are separate and not interchangeable, and does not invent a combined price.

- 🟢 **Sector ownership and upkeep history is accurate**： Fisher Valley started in early 2019 by Asia Outdoors, is now owned by Cat Ba Climbing, gained trail, toilet, shower and viewing-platform work from 2022, has WiFi at the crag, was devastated by Typhoon Yagi in 2024 with repairs and a new bouldering area continuing into 2026. Hidden Valley is owned and maintained by Cat Ba Climbing / Mr. Zoom, allows camping and campfires, has a small bouldering cave, and warns about summer wasp nests and mosquitoes. The Cave was bolted by Asia Outdoors in 2014/2015 and Cat Ba Climbing in 2016 with new routes in 2024. Butterfly Valley was bolted by Erik Ferjentsik and Onslo Carrington between 2007 and 2010.

- 🟢 **Bolt condition is reported per sector and attributed**： Butterfly Valley: "black rusted bolts", "7th bolt is loose", "hornet nest at anchor", "no more anchor" (twice), "rock still falling", "most of the bolts as well as the top look pretty rusty". Hidden Valley: "anchor bolt broken, first hanger removed", "bolts are rusty". Fisher Valley: "14 quickdraw + anchor", "anchor bolt loose", "snake after the first anchor". The article's recommendation to prefer Fisher and Hidden over Butterfly is argued from those specific warnings, not from a general claim about the island.

- 🟢 **The Ben Beo closure is printed as a closure and labelled**： The sector page says "the government has officially forced the closure of this crag" while still listing 8 routes and a 25,000 VND fee. The article reports the closure, labels it database-tier, says no government notice was found, and does not publish a route table for it. It also tells the reader not to go.

- 🟢 **The island-wide helmet rule and the top-rope etiquette are quoted**： Every Cat Ba sector page repeats "due to the potential of rock fall anytime outdoors please understand that helmets are considered REQUIRED to climb anywhere here on the island", and several pages add that the rams-horn anchors, permanent carabiners and quick links are only for lowering and cleaning and that anyone top-roping must build their own anchor. The article carries both as island-wide rules.

- 🟢 **Season and tide statements match the source**： "The winter months are ideal for sport climbing, when the temperatures are cool (10-20 degrees celcius) and there is only moderate precipitation (5-25 mm a month)"; a tide over 2 meters is needed for safe DWS; spring (April–May) and autumn (September–November) are the ideal windows. The article adds the "valley floods in the rainy season" note for Butterfly Valley and the Cave's "challenging during/after rain" approach, both from their sector pages, and is explicit that the tide limits DWS rather than the island's sport climbing.

- 🟢 **Transport and operator prices are first-party**： Hanoi ⇄ Cat Ba bus 300,000 VND; private car Hanoi/Noi Bai ⇄ Cat Ba 2,000,000 VND, 2.5–3.5 h including ferry; Hải Phòng/Cát Bì three transfer options at 1,300,000 (ferry included), 1,000,000 (ferry excluded) and speedboat on request; Hữu Lũng ⇄ Cat Ba 2,580,000 VND; island taxi 80,000 VND; bike and e-bike rental 150,000 VND; bus 14 from Cát Hài to the cable-car crossing every 30 min at 13,000 VND (2026); xe om to Ben Beo 10,000 VND. All read off catbaclimbing.com and the sector pages on 2026-10-21.

- 🔵 **Correction applied**： The route "Baby steps" is graded 3 in the source, which the conversion table renders as "約 5.2" rather than "5.2". The first draft wrote "5.2"; the script caught it and the cell was changed to "約 5.2". `climbing-grade-convert.mjs --check` on both files now reports 103 rows, 0 issues.

- 🔵 **Correction applied — one overstated clause**： The tldr said Hidden Valley "has the most roof routes", which the source does not support. The sector description does single out overhanging roof climbs and a small bouldering cave, so the tldr and the body now say exactly that in Chinese and English, and the phrase "mostly roof routes" in the body was changed to "the sector's own description singles out overhanging roof climbs".

## post-review

Reader fit: the article's job is to make a two-day island trip work. The reader needs to know which of the four open areas to pick, what each permit costs, which bolts to distrust, and how the ferry eats the day. The article answers all four, and the parking table makes the on-island logistics concrete (Fisher 12 km north by scooter, Hidden a 10-minute hike from a car park, The Cave a 5-minute climb from an alley in town, Ben Beo 20 minutes' walk or a 3-minute xe om).

Structure: contract H2s in order with the three transport subheadings, four tier H3s exactly as the script's HEAD strings, plus a Bouldering subsection (the five Hidden Valley problems, recorded by theCrag as V grades with no Font grade, so no conversion applies) and a Trad subsection (Firefly, whose source grade is already YDS, and Approach to Trad).

⚠️ **Known limitation, stated in the article.** The guidebooks disagree on edition: the shop's own product page calls the Cat Ba guidebook the 2018 edition, while theCat Ba Lan Hạ page describes a guide published in February 2016 with 140 pages. The article prints both statements and tells the reader to confirm the physical copy on site rather than picking one.

⚠️ **Known limitation, stated in the article.** The Ben Beo closure and the island's tolerated-not-permitted status both rest on database-tier statements. The article says so in the rules section rather than implying a legal position.

Reader value check: the article is honest about the trade-off it recommends. It says Butterfly Valley is the biggest crag on the island and also that its own page carries the rust and falling-rock warnings, and it explains why Fisher and Hidden are the better two days (Cat Ba Climbing ownership, repairs into 2026, toilets and showers, camping allowed). It also keeps the differences visible — Hidden Valley is always shady and shelters roofs, Fisher Valley is morning sun and dry in the rain, Butterfly Valley is both dry in the rain and wet in the rain on different walls.

## post-polish

Read the pair end to end. The Chinese keeps the tone factual even where the facts are bad: "越南政府正在找理由收緊島上的攀登權限" is followed immediately by the practical instruction to leave no trace and pay the fee, not by alarmism. The English preserves the ordering and does not soften "tolerated rather than permitted" into a euphemism.

Length is carried by tables (permit table, parking table, 106 graded rows) rather than by padding, and the prose paragraphs stay short.

The translation keeps the star notes in the "theCrag 3 stars" form, keeps the bolt counts, and renders the top-rope instruction as an instruction rather than a description. `check-process-leak.mjs` reports nothing for the pair; the only caveat sentences are the ones attached to real source limits.

One item worth recording: the article's tldr mentions that Ben Beo has been closed by a government announcement. The body is more careful ("database-tier statement, no government notice found"). The tldr is short by design and the body is the place that carries the nuance, so this is acceptable, but a reader who only reads the tldr will take the closure as settled fact.
