# Independent review: vietnam-crag-huu-lung

Reviewer: parent session, 2026-10-21. Reviewed the complete zh/en pair, the nine sector pages it draws on, and the matching research note. No claim rests on a source opened before this session without being re-read.

## post-verify

- 🟢 **Sources opened for this article**： theCrag（thecrag.com）的 Hữu Lũng 總頁與九個子區頁（逐條路由 `data-route-tick` 取得）；VietClimb（vietclimb.vn）的 Mao Homestay、Duc Bungalow 與 Outdoor Trips 頁；英國旅遊建議（gov.uk）的緊急電話頁。逐項與逐條路線記在 `.research/2026-10-21-vietnam-crag-huu-lung.md`。

- 🟢 **Route rows are transcribed from the theCrag sector pages, not from the trip note**： All 22 Head Wall rows, 30 Dragon Wall rows, 27 Drone Wall rows, 32 Dead End rows (+5 boulders), 13 La Conche, 11 L'Ile Noire, 6 Squirrel Wall, 1 Chúc Sức Khỏe and 5 K Wall rows were pulled from the `data-route-tick` payload of each sector page on 2026-10-21 and copied into `.research/2026-10-21-vietnam-crag-huu-lung.md` before the tables were written. Route names, FR grades, lengths, pitches, bolt counts and star values in the article match that record row for row.

- 🟢 **Access fees are per sector and match the source**： Head Wall 25,000 (collect at the hostel, no parking fee because the hostel owners are the land owners, hostel guests exempt), Dragon Wall 25,000, Drone Wall 20,000, Dead End 20,000, L'Ile Noire 15,000, Passe-Muraille free. The article's parking table reproduces these sector by sector instead of quoting one "typical" fee, and the general 20,000–25,000 range from the crag page appears only as the crag-level statement.

- 🟢 **Approach text is quoted from the source, coordinates included**： Head Wall (hostel at 21.604243,106.351115, 150 m back up the road, 5 min), Dragon Wall (21.613292,106.322973 and the fence corner 21.614471,106.323475), Drone Wall (30-second walk from the gate), Dead End (left at the fork before the bridge, ~2 km of dirt road, through the metal gate to the second wooden gate at 21.608376,106.312565), La Conche (21.623785,106.347870, 200 m walk), L'Ile Noire (3 km from Mao's Homestay, Làng → Diễn hamlet, past the market, follow the fence). Every one of these appears verbatim or near-verbatim in the corresponding sector page.

- 🟢 **Fixed-gear warnings are attributed to the sector that carries them**： Sắc! at Head Wall ("some bolts look quite rusty"), Squirrel Wall ("anchor rings have corrosion"), L'Ile Noire ("bolt 7 has a loose nut", "first bolt: nut loose"), Dead End ("bolt 4 loose"), Dragon Wall ("missing anchor"), Drone Wall ("left anchor bolt is loose"), La Conche ("ants nest"). The article lists them under the sector that owns them and does not generalise them to the whole crag.

- 🟢 **The single multipitch is described from the source**： Chúc Sức Khỏe: 7a+, 96 m, 5 pitches, 3 stars, "access via Head Wall". The article's "只有多段" section states exactly this and warns about rope length, without converting the 96 m into a descent prescription.

- 🟢 **Climate table matches the recorded Hanoi figures**： December 21.3/13.8 °C, 19.5 mm, 5.1 rain days, 124 sun hours; January 20.2/14.1, 19.8, 10.3, 74; February 21.7/16.4, 20.2, 12.4, 45; March 25.9/20.5, 35.8, 15.9, 47. The article states plainly that these are Hanoi figures used as a proxy because no Hữu Lũng station data was found.

- 🟢 **Transport facts are first-party**： Shuttle 09:00 and 16:00 from 490 Minh Khai, 3 h, 250,000 VND, Zalo 0084 813071992, driver does not speak English; Gia Lam bus at noon, 160,000 VND, drops at the market 2.5 km away, driver 0965060090; private car 4-seat 1,500,000 VND, 2 h; motorbike 2.5 h. All four come from the VietClimb homestay and trip pages.

- 🔵 **Correction applied — rain tags re-checked against the sector pages**： The first draft said Passe-Muraille, Squirrel Wall and La Conche were tagged as able to keep light rain off, which came from the per-sector sun/rain table in the trip note and could not be reproduced from the sector pages. Re-reading every Hữu Lũng sector page, the only rain tags that exist are "Dry in the rain" on Dragon Wall and "Dry in the rain" on Infinity Cave; the other sectors carry no rain tag at all. The article now says exactly that, in Chinese and English, and stops describing the Dead End approach as gravel.

- 🟢 **Grade conversion verified mechanically**： `climbing-grade-convert.mjs --check` on both files: 72 rows, 0 issues. The one row whose source grade is a double ("6a+/b") does not appear in this article; the only irregular grades here are "5c+" (→ 約 5.9+) and "5b+", and the "5b+" route (Chimera) was deliberately left out of the tables rather than given a wrong conversion.

## post-review

Reader fit: the article answers the three questions a first visit actually has — which homestay to use, which wall to start on, and how much cash and how many draws to bring. The parking table is the practical core, because at Hữu Lũng the parking instruction *is* the approach instruction and each wall's is different.

Structure: the seven contract H2s appear in the required order with 大眾運輸 / 開車 / 停車 under 怎麼去, and the four tier H3s use the script's HEAD strings exactly. Bouldering and the single multipitch are extra H3s inside the graded section, which the contract's structure permits.

- 🔵 **Correction applied**： The route "Wo|Andering" on Drone Wall contains a literal pipe, which broke the markdown table cell and made the grade script report `「Wo」Andering 寫 7c，對照表是 —`. The cell was rewritten with a full-width pipe (`Wo｜Andering`) so the table parses; the name is otherwise unchanged and the English version carries the same form. `climbing-grade-convert.mjs --check` now passes on both files.

⚠️ **Known limitation, stated in the article.** K Wall and Squirrel Wall have no published approach or parking text on their sector pages, and the article says so instead of guessing a walk time. The reader has to ask the land owner. This is written into the parking table as "來源沒有公布接近與停車方式".

⚠️ **Known limitation, stated in the article.** The Dead End boulder problems are recorded by theCrag as V grades with no Font grade, so no Font→V conversion applies; the table is headed V grade and the text says so.

Reader value check: the article does not merely list routes. It says which wall to climb on which side of the day (Dragon Wall shaded until past noon, Drone Wall shaded from 11 am on the right, L'Ile Noire in morning sun), that Dragon Wall's roof keeps it dry in rain, and that Dead End's farmer may move your motorbike so leave the steering lock unlocked. Those are the details that change a trip.

## post-polish

Read the pair end to end. The Chinese keeps a consistent voice: state the fact, then say what it means for the trip. Examples that survived unchanged into English: "the access fee is paid in cash, and it has to be exact", "don't damage the fruit trees", "the further the wall, the longer the rescue takes".

The article is long, but the length is tables, not padding: 72 route rows, a parking table, a climate table, a fee table. Prose paragraphs are short.

The English translation keeps the source's caveats attached to the right facts — the "bring exact change" instruction sits with the fee, not with the approach — and does not upgrade any hedge into a claim. `check-process-leak.mjs` reports nothing for the pair.

One consistency item worth recording: the article writes "通行費" as "access fee" and "屋主" as "landowner" throughout the English version, and the grader note format is "theCrag 3 stars" / "theCrag 1 star". Both match the rest of the series.
