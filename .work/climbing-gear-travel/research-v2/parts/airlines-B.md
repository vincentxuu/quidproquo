# Airlines B — LCC / regional baggage rules (from Taiwan, economy, climbing hardware)

Scope: Peach (MM), Scoot (TR), AirAsia (AK/D7/FD/Z2 group), Jetstar (Jetstar Japan GK; Jetstar Asia 3K closed), Thai Airways (TG), VietJet (VJ; Thai Vietjet VZ noted). Official airline pages only. All accessed 2026-10-19.

Tool log / degradation (toolDegradation):
- Groundlane MCP: not available; Groundlane HTTP: 401 → skipped.
- Search: Keenable keyless (OK). One Exa web_search_exa each for AirAsia sports / Xtra Carry-On and Scoot cabin rules (results were official support.airasia.com / flyscoot.com pages).
- Page reads: curl + python strip OK for jetstar.com, thaiairways.com (browser UA needed), seo.vietjetair.com, skyfun.vietjetair.com, newsroom.airasia.com, airasia.com fee PDFs (pdftotext).
- flypeach.com / support.flypeach.com: curl fails (HTTP/2 stream error, then connection reset) → Exa web_fetch_exa OK.
- flyscoot.com: curl 403, WebFetch 403, Exa fetch of /fly-scoot/before-you-fly/baggage returned bot wall → Exa fetch of /plan/booking-your-flight/baggage and /booking-fare-rules OK; Scoot CoC PDF and FAQ text came via Exa search snippets (not fetched separately).
- www.vietjetair.com: JS-only (1-line shell) → read same path on Vietjet's own server-rendered subdomain seo.vietjetair.com.
- airasia.com/aa/inflight-comforts/.../baggage.html: JS-only (empty via curl and Exa) → used support.airasia.com articles + official fee PDF.

## Summary table

| Airline | Allowance concept | Climbing gear listed? | Sports fee / handling | Max kg/bag | Checked dimensions | Carry-on size / kg | Weighed at gate? |
|---|---|---|---|---|---|---|---|
| Peach | Piece (per bag, 20 kg each; Standard fare = 1 free bag; Minimum = paid) | No. "Sports equipment" category abolished 3 Dec 2024 | No sports category; "Oversized option" (paid) for ≥204 cm sum, max 80×80×230 cm; Overweight option 20–32 kg | 20 kg standard, 32 kg max with overweight option; ≤5 bags, ≤100 kg | ≤203 cm sum (L+W+H) | 2 items (1 bag + 1 personal), total 7 kg; 3 sides <115 cm. No paid carry-on upgrade found | Staff "may examine ... size, weight and number of pieces" (not specifically gate) |
| Scoot | Weight (buy 20–40 kg; up to 15 pieces) | No (golf, surfboards, canoes, scuba, skis, bicycles listed) | Counts toward pre-purchased checked allowance; normal excess charges; no separate sports fee stated on page | 32 kg | ≤158 cm linear per bag | 2 pieces, combined 10 kg (Economy); bag 54×38×23 cm (≤115 cm), personal 40×30×10 cm. Extra Cabin Bag (+7 kg) on B787 only | "randomly monitor for excess cabin baggage at the boarding gate" |
| AirAsia | Weight (tiers to 60 kg; pooling allowed same booking) | No. Sports Equipment Allowance only for golf, surfboard, bicycle, ski/snowboard, diving (with tank); everything else under regular baggage | Separate Sports Equipment Allowance 20/25/30/40 kg; D7 TWD pre-book 1,140/1,390/1,780/2,690 | 32 kg | 119×81×119 cm (when >30 kg bought) | 1 cabin bag 56×36×23 + 1 personal 40×30×10, combined 7 kg; Xtra Carry-On → 14 kg (one bag ≤10 kg); airport add-on up to 3 kg (max 10 kg) | Gate checking + "gate baggage fee may apply"; cabin excess per-kg fee in fee sheet |
| Jetstar Japan (GK) | Weight (combined; up to 40 kg; any number of bags) | No (surfboards, skis, bikes, fishing, scuba, golf, instruments listed as examples of oversized) | Oversized item fee only if any side >1 m: GK TWD 550 (booking) / 620 (airport) per item per flight; weight counts toward allowance | 32 kg | Oversized max length 2.3 m (A320/A321) | 1 main + 1 small, combined 7 kg; main 56×36×23 cm; +7 kg extra carry-on → 14 kg (main ≤10 kg) | "We monitor carry-on baggage at the airport. Fees apply if you exceed" |
| Thai Airways | Piece (from 2 Mar 2026 travel, tickets from 25 Nov 2025): Economy 1–2 × 23 kg depending on fare | No. Listed: archery, bowling, canoe, cricket, fishing, golf, rackets, ski, surf, windsurf, scuba, firearms (+ "Other Sports Equipment and Special Items" in piece-concept tab) | Included in allowance; if exceeding, flat Special Unit rate (USD 100/unit within TC3 on weight-concept tab; USD 150/unit on piece-concept tab) | 23 kg free (Economy); 23–32 kg overweight charge; 32 kg absolute | 158 cm per bag; 158–200 cm and 200–330 cm oversize charges | 1 piece ≤7 kg, 56×45×25 cm + free small personal item (≤1.5 kg, 37.5×25×12.5 cm) | "Spot check ... at the check-in counter and/or at the boarding gate" |
| VietJet (VJ) | Weight (buy 20/30/40... kg packages; Eco = 7 kg carry-on only; Deluxe 20 kg incl. on <7 h routes) | No (oversized sports list: golf, surfboard, bicycle, scuba, ski/snowboard on Thai Vietjet page; VJ page says "Oversized items (sports equipment)") | Oversized baggage package (pre-book) — HK/Taiwan/China column: 20 kg oversized 1,060,000 VND / 30 kg 1,360,000 VND vs normal 20 kg 580,000 VND | 32 kg | Standard 119×119×81 cm; oversized up to 200×119×81 cm | 1 main 56×36×23 cm + 1 small item, total 7 kg; paid "2 kg Priority Carry-on" 530,000 VND (HK/TW/CN column) | "right to re-check the weight and size of your carry-on baggage at the boarding gate" |

推測 notes:
- None of the six airlines lists climbing/mountaineering gear by name. For AirAsia and Scoot the text implies non-listed sports gear simply goes in regular checked allowance (AirAsia states this explicitly; Scoot says sporting equipment "counts towards your pre-purchased baggage allowance"). For Jetstar and Peach a rope/rack bag under the size thresholds would be ordinary checked baggage (推測 from the size-based oversized rules).
- Thai special-baggage page still shows weight-concept and piece-concept (US/Canada) tabs; whether the USD 100/unit TC3 rate still applies after the March 2026 global piece-concept switch is unclear (推測: page not fully harmonised).

---

## Peach (MM)

- Checked baggage page — https://www.flypeach.com/en/lm/ai/airports/baggage/checked_in_bag (accessed 2026-10-19, via Exa)
  - "Size | Sum of the three dimensions (length, width, height) cannot exceed 203 cm" / "Number of bag | Up to 5 bags per person" / "Weight | 20 kg(*maximum 32 kg) / bag" / "Total weight | Up to 100 kg per person"
  - "Oversized option ... It will be required for checked baggage with a total of 204 cm or more on three sides (maximum of each side: height 80 cm - width 80 cm - depth 230 cm)."
  - "Overweight option ... Required for checked baggage from over 20kg to 32kg/piece."
- News 20241119 — https://www.flypeach.com/en/news/20241119 (accessed 2026-10-19, via Exa)
  - "The rules for checked baggage will be changed from 3 December 2024 (Tuesday)."
  - "Sports equipment will be abolished and an "oversized baggage option" will newly be established."
- Fare types — https://www.flypeach.com/en/lm/fares/fare_type (accessed 2026-10-19, via Exa)
  - "All fare types: Free for 2 bags up to 7 kg in total"; Checked Baggage: Minimum "Charged", Standard "1 Free Bag", Standard Plus "1 Free Bag".
- Fees — https://www.flypeach.com/en/lm/fares/fees_and_charges (accessed 2026-10-19, via Exa): Taipei/Kaohsiung routes are "Zone B"; footnote "*1. Checked baggage charge applies to each piece of checked baggage (each piece max. weight: 20 kg; max. size: total of three dimensions (L+W+H): 203 cm)." Fee amounts are JS-rendered and were empty in the fetch.
- Carry-on — https://www.flypeach.com/en/lm/ai/airports/baggage/carry_on_bag (accessed 2026-10-19, via Exa)
  - "Size | Sum of the three dimensions should be less than 115 cm" / "Number of bag | 1 bag per passenger in addition to 1 personal item (Total: 2 items)" / "Weight | Up to 7 kg for 2 items"
  - "Airport staffs may examine your baggage size, weight and number of pieces either by sight or by measuring."
  - "Large tripods - Only items which fold down to a size of 60cm or less are permitted for carry-on."

## Scoot (TR)

- Baggage — https://www.flyscoot.com/en/plan/booking-your-flight/baggage (accessed 2026-10-19, via Exa)
  - "All Scoot and ScootPlus travelers are allowed up to two pieces of cabin baggage. Your carry-on luggage must fit within the dimensions of 54cm x 38cm x 23cm (total linear dimensions cannot exceed 115cm) ... your personal item or bag must fit within the dimensions of 40cm x 30cm x 10cm"
  - "Economy | 2 pieces, max 10kg"
  - "You may check in up to 15 pieces of baggage that do not or exceed total linear dimensions of 158cm ... with the option to purchase up to 40kg of baggage allowance online."
  - "each of your checked bags cannot exceed 32kg."
  - "Your sporting equipment – such as golf clubs, surfboards, canoes, scuba diving apparel, skis and bicycles – counts towards your pre-purchased baggage allowance. If you exceed this allowance, the usual additional baggage charges will apply."
- Fare rules — https://www.flyscoot.com/en/booking-fare-rules (accessed 2026-10-19, via Exa): "Cabin baggage allowance is 10kg (maximum 2 pieces including a laptop/handbag) in Economy"; "Checked baggage allowance is 20kg in Economy (for Value and Flex fares only)".
- Boarding — https://www.flyscoot.com/en/plan/before-you-fly/boarding (Exa search snippet, accessed 2026-10-19): "Scoot will randomly monitor for excess cabin baggage at the boarding gate".
- Conditions of Carriage PDF — https://cdn.flyscoot.com/prod/docs/default-source/doc-coc/scoot_conditions_of_carriage_final.pdf (Exa search snippet, accessed 2026-10-19), §6.3(a): "You must not include in Cabin Baggage knives, sharp objects or cutting implements of any kind and any length, ... knitting needles, and sporting goods, must be packed in your Checked Baggage."
- FAQ — https://flyscoot.my.site.com/s/article/What-are-the-charges-to-bring-an-additional-bag-cabin-check-in (Exa search snippet, accessed 2026-10-19): "If you are travelling on Scoot B787 aircraft, you may wish to purchase our Extra Cabin Bag option, which allows an extra 7kg cabin baggage allowance."

## AirAsia (group)

- Sports items — https://support.airasia.com/s/article/flying-with-sports-items-on-airasia-flights (Exa, published 2026-05-14, accessed 2026-10-19)
  - "only the following sports items are accepted under this allowance ... 1. Golf 2. Surfboards 3. Bicycles 4. Ski/Snowboard 5. Diving Equipment (Conditional Acceptance)"
  - "Our Sports Equipment Allowance is available for purchase in weight tiers of 20kg, 25kg, 30kg, and 40kg."
  - "Note that regular checked baggage and sports equipment allowances cannot be combined"
  - "Individual items exceeding 32kg will not be accepted due to health and safety restrictions."
- Checked baggage — https://support.airasia.com/s/article/What-I-need-to-know-about-checked-baggage (Exa, accessed 2026-10-19): "MAXIMUM DIMENSION PER BAG 119cm (H) x 81cm (W) x 119cm (L) MAXIMUM WEIGHT PER BAG 32kg"; "Baggage weight tier: Up to 60kg"; "The pooling or sharing of checked baggage allowances is permitted ... same itinerary".
- Fee PDF (AirAsia X D7, the carrier on Taipei–Kuala Lumpur) — https://www.airasia.com/aa/pdf/about-us/fee-charges-d7.pdf (curl + pdftotext, accessed 2026-10-19)
  - "Sports equipment includes Golf, Surfboard, Bicycle, Skis/Snowboard and Diving gear. Any other sporting equipment not stated here is accepted as part of your checked baggage allowance."
  - Sport Equipment, TWD, during initial booking 20/25/30/40 kg: 1,140 / 1,390 / 1,780 / 2,690; after booking: 1,600 / 1,950 / 2,490 / 3,770.
  - Other Baggage TWD: Gate Baggage 2,330; Xtra Carry On 610 (initial) / 710 (after); Cabin Baggage Excess Per KG (Up to 3KG) 80 "*Applicable for selected routes only".
  - Other AirAsia carriers (FD Thai AirAsia, Z2 Philippines, AK) publish separate PDFs with the same footnote; not tabulated here.
- Cabin advisory — https://newsroom.airasia.com/news/travel-advisory-airasia-cabin-baggage-guidelines (8 Aug 2024, accessed 2026-10-19)
  - "one (1) cabin baggage and one (1) small personal item onboard with a combined total weight of 7kg"; "Maximum dimensions: 56 cm (H) x 36 cm (W) x 23 cm (D)"; personal item "40 cm (H) x 30 cm (W) x 10 cm (D)"
  - "If the excess cabin baggage is not checked in at the counter, the airline may need to check it at the boarding gate, and a gate baggage fee may apply."
- Xtra Carry-On — https://support.airasia.com/s/article/Xtra-Carry-On-Cabin-Baggage-Upgrade (Exa, accessed 2026-10-19): "their combined weight should not exceed 14kg. One of these bags can weigh up to 10kg".
- Cabin policy — https://support.airasia.com/s/article/What-are-the-rules-for-cabin-baggage-on-board (Exa, accessed 2026-10-19): "Effective 13 April 2026, please note that Xtra Carry-On cannot be purchased at airport counters ... You may only purchase additional cabin baggage weighing up to 3kg (maximum 10kg in total) at the airport counters."

## Jetstar (Jetstar Japan GK; Jetstar Asia closed)

- Jetstar Asia — https://www.jetstar.com/sg/en/jetstar-asia-information (accessed 2026-10-19): "On 31 July 2025, Jetstar Asia (3K) permanently ceased operations."
- Fare inclusions (JP site) — https://www.jetstar.com/jp/en/help/articles/is-checked-baggage-allowance-included-in-my-fare (accessed 2026-10-19): "Your baggage allowance is given by combined weight, not by number of bags. ... The maximum checked baggage allowance per person is 40kgs and no single bag can weigh more than 32kg."
- Size/weight (JP site) — https://www.jetstar.com/jp/en/help/articles/what-are-the-size-and-weight-restrictions-for-checked-baggage (accessed 2026-10-19): "No single bag or item can weigh more than 32kg."; "Any bag or item with a single side longer than one metre (1000mm, 39in), including wheels, handles and packaging is oversized."; max length "Jetstar Airways (JQ) and Jetstar Japan (GK) | Airbus A320, A321 and A321neo | 2.3m"; "Checked baggage is not included with Economy Starter fares."
- Oversized — https://www.jetstar.com/au/en/help/oversized-baggage (accessed 2026-10-19)
  - Examples: "Surfboards, skis, snowboards, skateboards or scooters / Bikes / Fishing rods / Scuba diving equipment / Golf clubs / Large musical instruments"
  - "Each passenger can bring up to two oversized items." / "the oversized item fee is paid in addition to any checked baggage allowance, it does not increase your baggage allowance."
  - "Jetstar Japan (GK) domestic and international flights ... TWD $550 [booking/Manage booking] ... TWD $620 [airport]"
- Carry-on (JP site) — https://www.jetstar.com/jp/en/flights/baggage/carry-on-baggage (accessed 2026-10-19): "1 main item + 1 small item = combined weight 7kg"; "Must fit in the overhead locker and not exceed 56cm (H) x 36cm (W) x 23cm (D)."; "With 14kg you can bring 2 items: one main item (max 10kg) and one small item."; "+7kg Extra Carry-On Baggage".
- Carry-on help (JP site) — https://www.jetstar.com/jp/en/help/articles/carry-on-baggage-what-can-i-bring-on-board (accessed 2026-10-19): "Jetstar Airways (JQ) flights departing before 2 February 2027 or with Jetstar Japan (GK): ... combined 7kg weight limit"; "+7kg extra carry-on is available on select routes only."; "We monitor carry-on baggage at the airport. Fees apply if you exceed your allowance"; "Hiking sticks (view requirements)" listed as allowed on board.
- Carry-on change — https://www.jetstar.com/au/en/flights/baggage/carry-on-baggage-updated (accessed 2026-10-19): JQ only from 2 Feb 2027, underseat 40×30×20 cm, overhead bag 56×36×23 cm via Priority Carry-on, "no 7kg weight limit" but "we'll continue to have a 10kg weight limit (per item)"; "Jetstar Japan (GK): your carry-on allowance will be based on a 7kg or 14kg (two item) weight limit".

## Thai Airways (TG)

- Checked — https://www.thaiairways.com/en-th/content/baggage/checked-baggage (accessed 2026-10-19)
  - "Effective 25 November 2025, for sales, ticket issuance, and reissuance of totally unused tickets, and for travel commencing on or after 02 March 2026, a new baggage policy based on the Piece Concept will be implemented for ... A journey within TC3 (Asia, Australia, New Zealand)"
  - "For all classes, each checked bag must not exceed a total dimension of 158 cm (62 inches)"; "Each piece may weigh up to 23 kg (50 lbs) for Premium Economy Class and Economy Class."
  - International: Economy Full Flex / Flexi "2 Pieces (23 kg/pc)"; Standard and Saver "1 Piece (23 kg/pc)". (Page also still shows the old weight table, Economy "23 - 30 kg".)
- Excess — https://www.thaiairways.com/en-th/content/baggage/excess-baggage (accessed 2026-10-19): "23–32 kg: → Charge 1x Airport Zone Rate"; "158–200 cm ... Charge 1x Airport Zone Rate"; "200–330 cm ... (Bulky Baggage): Charge an additional 1x Airport Zone Rate"; "The maximum weight per piece must not exceed 32 kg (70 pound)."; Taiwan is in Zone 2.
- Special baggage — https://www.thaiairways.com/en-th/content/baggage/special-baggage and https://www.thaiairways.com/en-au/content/baggage/special-baggage (accessed 2026-10-19)
  - Items with "Include in allowance": Archery, Bowling, Canoe, Cricket, Fishing Equipment, Golf, Rackets, Snow/Water Skiing, Surfboard, Windsurf, Scuba Diving Equipment, Sporting Firearms (no climbing entry).
  - "Wholly within TC3 (Asia, Australia, New Zealand): USD 100/Unit"
  - Piece-concept tab: "Other Sports Equipment and Special Items / Include in allowance: Yes / ... Charge Rate: USD 150/Unit / Remarks: 1 item can be included in your baggage allowance."
- Carry-on — https://www.thaiairways.com/en-th/content/baggage/carry-on-baggage (accessed 2026-10-19)
  - Economy: "Up to 7kg each / Maximum length 56 cm (22 inches), width 45 cm (18 inches), thickness 25 cm (10 inches). Dimensions including wheels, handles, and side pockets"
  - Free items: "Handbag / wallet / purse / Notebooks / portable personal computers with the maximum length 37.5 cm ... with the total weight not exceeding 1.5kgs"
  - "Note: Spot check may be performed against the test unit and/or weighing machine at the check-in counter and/or at the boarding gate"

## VietJet (VJ) / Thai Vietjet (VZ)

- Baggage service (VJ) — http://seo.vietjetair.com/en/pages/to-have-a-good-flight-1599448842652/baggage-service-1608369253127 (same path on www.vietjetair.com is JS-only; accessed 2026-10-19)
  - "01 main carry-on baggage item and/or 01 small personal item with the total weight of carry-on baggage not exceeding 07kg (depending on fare class and route)."; "01 main carry-on baggage item with maximum dimensions of 56cm x 36cm x 23cm."
  - "We have the right to re-check the weight and size of your carry-on baggage at the boarding gate."
  - "The weight of standard checked baggage must not exceed 32kg per piece / Dimensions must not exceed: 119cm x 119cm x 81cm"
  - "Oversized baggage weight must not exceed 32kg per piece / Dimensions exceeding standard checked baggage but not exceeding 200cm x 119cm x 81cm"
  - "Oversized items (sports equipment) may be transported in cargo compartment with additional fees."
- Fare rules — https://seo.vietjetair.com/en/pages/fare-rules-1607053453722 (accessed 2026-10-19): Group 1 (< 7 h) Eco "07 Kgs" carry-on, checked "At extra cost"; Deluxe "20 kgs" checked.
- Fees — https://seo.vietjetair.com/en/pages/to-have-a-good-flight-1599448842652/fee-and-charges-1599130343851 (accessed 2026-10-19), pre-book table, column "HongKong/Taiwan/China" (VND): 20kg 580,000; "20kg oversized baggage (*)" 1,060,000; "30kg oversized baggage (*)" 1,360,000; "2 kg Priority Carry-on Baggage" 530,000; "(*) Passenger pre-book oversized baggage is allowed to bring 1 oversized piece". Column mapping read from flattened table (推測-level risk on alignment).
- Thai Vietjet page — https://skyfun.vietjetair.com/page/baggage (accessed 2026-10-19): "3.1 The Type of Sports Equipment accepted as Oversized Baggage": Golf Set, Surfboard, Bicycle, Scuba Diving, SKI / Snowboard Equipment; "Each piece of checked baggage must not exceed 119 cm x 119 cm x 81 cm and weight not more than 32 kg."

---

## Could NOT verify

- Peach checked-baggage / oversized / overweight fee amounts for Taiwan routes (Zone B): fee table is JS-rendered; Exa returned empty cells; curl blocked (HTTP/2 error / reset). Not tried: Chrome tools.
- Peach "Items requiring special attention" page (ice axes, crampons, tent pegs in cabin) — not opened.
- Scoot fee chart (checked-baggage and Extra Cabin Bag prices for Taiwan routes) and the current /fly-scoot/before-you-fly/baggage page: curl 403, WebFetch 403, Exa got bot wall. Scoot boarding page, CoC PDF and FAQ quotes come from Exa search snippets, not full-page fetches.
- Whether Scoot Extra Cabin Bag is offered on Taiwan routes (stated B787-only; aircraft per route not checked).
- AirAsia main baggage page (airasia.com/aa/inflight-comforts/.../baggage.html) is JS-only; relied on support.airasia.com + fee PDF. FD/Z2/AK TWD sports fees not tabulated.
- Thai Airways: whether the special-baggage flat rates (USD 100/150 per unit) were updated for the March 2026 piece-concept switch on TC3 routes.
- VietJet: canonical www.vietjetair.com pages are JS-only; quotes taken from Vietjet's own seo. subdomain. No explicit list of sports items on the VJ (Vietnam) page; the named list is on the Thai Vietjet (VZ) page.
- No airline explicitly names climbing/mountaineering equipment; Jetstar/Peach/VietJet handling of a rope + rack bag is 推測 from generic size rules.
