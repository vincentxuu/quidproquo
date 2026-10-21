# Independent review: vietnam-crag-lan-ha

Reviewer: parent session, 2026-10-21. Reviewed the complete zh/en pair, the 26 Lan Hạ sector pages, the crag page and the matching research note.

## post-verify

- 🟢 **Sources opened for this article**： theCrag（thecrag.com）的 Vịnh Lan Hạ 總頁與二十六個子區頁（逐條路由 `data-route-tick` 取得）與 Cat Ba Island 頁（合法性與潮汐的最新說明）；Cat Ba Climbing（catbaclimbing.com）與 Langur's Adventures（langursadventures.com）；英國旅遊建議（gov.uk）的緊急電話頁。逐項與逐條路線記在 `.research/2026-10-21-vietnam-crag-lan-ha.md`。

- 🟢 **Route rows transcribed from the sector pages**： Sport climbing: Mit Beach 7, Moody's Beach 6, Tiger Beach Right 11, Tiger Beach Left 5, The Face 4, Taxi Girl 8, Flying Fish Wall 6, Van Boi Trong 7, Saigon Wall 2, Luy Tam Biet 4, Pirate's Belly 2 sport + 1 trad. DWS: Sea Face 26, Three Brothers 18, Jellyfish Wall 15, Stingray Wall 15, Hang Ca Cave 15, Fisherman's Way 11, Gingerbread 11, Fine Wine 8, Le Mekong 1947 9, Crag X 5, Bond Bastic 5, Monster face 3, Andy Cave 9, Streak of Lightning 1, Pyramid Cave 7, Shit Rob 7, Band Tastic 5, Unemployment Wall 8, Never Never Land 13, Turtle Cave 1, Hòn Đũa 5 DWS. Names, FR grades, lengths and stars match `.research/2026-10-21-vietnam-crag-lan-ha.md` row for row.

- 🟢 **The 326 total is confirmed independently of the article**： The crag page's grade histogram (4a×2, 4a+×2, 4b×2, 4c×4, 5a×5, 5b×16, 5b+×1, 5c×22, 5c+×3, 6a×36, 6a+×35, 6b×33, 6b+×32, 6c×32, 6c+×12, 7a×17, 7a+×19, 7b×26, 7b+×12, 7c×6, 7c+×3, 8a×2, 8a+×2) sums to 326, matching the crag-level route count and the number of sub-areas (40) on the same page.

- 🟢 **Tide and season claims are quoted from the source**： "A tide of over 2 meters is necessary to safely DWS in the bay and there are much more days with high tide during the daytime in the summer than in the winter"; "The ideal time … are the spring (April - May) and autumn months (September - November) … over 15 days a month where you can DWS"; "The winter months are ideal for sport climbing, when the temperatures are cool (15-20 degrees celcius) and there is only moderate precipitation (5-25 mm a month)". The article separates the two halves explicitly — winter is fine for the beach sport climbing, marginal for DWS — instead of collapsing them into one season verdict.

- 🟢 **Legality is reported as the source reports it, with the practical consequence**： The Cat Ba Island page states that climbing within Ha Long Bay remains illegal, that harbour police enforce often, that The Face and Le Mekong are the named positions, that some climbers have got away with it while others were moved on quickly, and that boat drivers leaving Cat Ba for the bay risk losing their boats. It also says not to bribe officials and that local people are working on changing the situation. The article prints all four points and derives one conclusion: use a licensed operator's route rather than hiring a boat yourself.

- 🟢 **The DWS safety reasoning is the source's**： "You cannot start climbing out of the water, since there is a notch at the base of the cliffs: you'll need a boat" and "you need intimate knowledge of the cliffs to avoid climbing at too low a tide or hitting one of the underwater rocks". The article repeats both and adds the Sea Face note — Cat Ba Climbing's own cliff, no coral reef, deep enough to jump even at low water — as the operator's own explanation of why they use it.

- 🟢 **Operator prices are first-party**： Cat Ba Climbing: half-day DWS 1,150,000; half-day DWS + kayak 1,580,000; one-day DWS from Hanoi 2,980,000; half-day top-rope/lead on Tiger Beach 1,300,000; half-day top-rope/lead on Moody's Beach 1,300,000; half-day main-island climbing 1,150,000; full-day main-island 2,585,000; Tiger Beach multipitch day 4,748,000; Hanoi round-trip DWS + plankton 3,800,000. Langur's Adventures: DWS 1,300,000, rock climbing 1,300,000, kayaking 780,000. All read on 2026-10-21.

- 🟢 **The stale Asia Outdoors reference is handled, not silently dropped**： The Lan Hạ crag page still tells independent climbers to get a pass "from Asia Outdoors" and names Slo Pony Adventures, while the operator's own site says "Since the closure of Asia Outdoors, the situation with gear rental is a little more difficult" and the Cat Ba Island page names Cat Ba Climbing and Langur Adventures. The article names the two current operators, points at the Cat Ba Island page as the current text, and flags the Lan Hạ page as not yet updated.

- 🟢 **Two route-level details are preserved**： Burn it up's own description (the route was born between Typhoon Yagi and the wildfires, it is a good warm-up and stays in shade longer than the rest) and the sector's snake warning; and Peanut Butter & Jelly's 4 pitches / 72 m / 39 bolts with the sector's "free-hanging fall risk and rope ascending skills required" access warning.

- 🟢 **Grade conversion verified mechanically**： `climbing-grade-convert.mjs --check` on both files: 108 rows, 0 issues. The irregular source grades behave as the script defines: "6b+/c" → 5.10d, "4" → 約 5.4–5.5.

- 🔵 **Correction applied**： The three Sea Face practice-jump routes are graded 4 in the source, and the first draft of the DWS table wrote "約 5.2" for them, which is the conversion of 3. The script caught it and the three cells were changed to "約 5.4–5.5". The article's "Baby steps"-style rows elsewhere were already correct.

- 🔵 **Correction applied — table placement**： In the Chinese source the deep-water table originally sat under its own H2 after "依程度挑路線", which put it outside the section the grade script parses. The block was moved inside the "依程度挑路線" section as an H3 ("### 深水抱石（DWS）路線：潮汐、落水與 40 條路線"), so the script now checks all 108 rows instead of 53. The English version was built to the corrected structure.

- 🔵 **Correction applied — a claim removed**： The draft of the DWS section contained a bullet referring to a route called "Seahorse", which is not in any sector list I pulled for Lan Hạ. It was replaced with a bullet about the two positions the source actually names (The Face and Le Mekong 1947).

## post-review

Reader fit: the article answers the question the bay actually poses — winter is fine for the beach routes, marginal for DWS — and then the question that follows, which is whether it is worth taking the boat at all if the answer is no. It gives the reader the 2 m tide threshold, the two windows that work, and the instruction to ask the operators about current tides before booking.

Structure: contract H2s in order with the three transport subheadings, four tier H3s exactly as the script's HEAD strings, plus the DWS subsection inside the graded section. The four sport tables cover the roped routes; the DWS table is separate because the hazards differ, and the article says so in the sentence that opens the section.

⚠️ **Known limitation, stated in the article.** Monkey Wall's nine routes are unnamed in the source, and Taxi Girl sits under a warning badge on the crag page. The article says both and does not present them as pickable lines. The Face's legality exposure is stated in the same table it appears in.

⚠️ **Known limitation, stated in the article.** The 8a+ tier has only two lines (Giang 8a+, Perfect Line 8a), and the expert tier says so rather than padding the table.

Reader value check: the article separates the two failure modes that bite beginners here — going out on a low tide, and hiring an unlicensed boat. It also gives the operator-specific detail that makes the difference (Sea Face has no coral reef and is deep enough even at low water), and the boat driver's licence risk, which is the fact most likely to be missed by a reader planning independently.

## post-polish

Read the pair end to end. The Chinese keeps the argument order the reader needs: what the bay is → why the tide decides the season → how you get there → what the legal situation is → which routes. The English follows the same order and does not add an English-only caveat or a disclaimer paragraph.

The DWS table is long, and the article handles it by putting the five judgement points (2 m tide, the notch at the base, Sea Face, Streak of Lightning, and the deep-bay legality) in a bullet list immediately above the table, so the reader meets the rules before the numbers.

No process language and no hedge stacking: `check-process-leak.mjs` reports nothing. The one place the source is quoted verbatim at length — the legality paragraph — is presented as the source's statement in a block of prose with the attribution visible, which is the correct handling for a claim that will change when the Vietnamese authorities act.

The English keeps the star format "theCrag 3 stars" and the price format used across the rest of the series, and renders "約 5.4–5.5" as "approx. 5.4–5.5" so the grade script recognises it.
