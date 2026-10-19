# Community examples: how climbers pack for fly-in climbing trips (2020+)

Researched 2026-10-19. Scope: real, community-shared packing setups for international or fly-in climbing trips, with the checked / carry-on split, bags, weights, airlines and problems. Only sources published 2020 or later are counted. Each date below was checked on the page (forum post timestamps, the `published_at` field, or the YouTube publishDate).

## Method and tool degradation (toolDegradation)

- (1) Groundlane MCP: not available in this session. ToolSearch for `groundlane web_search` returned only Exa, and no `mcp__groundlane__*` tool is registered.
- (2) Groundlane direct HTTP POST `https://groundlane.vincent-xu-work.workers.dev/mcp`: **HTTP 401** (needs auth). Not usable.
- (3) Keenable keyless: **primary tool**. `GET /v1/search/public?query=` handled search, and `GET /v1/fetch/public?url=` (with header `X-Keenable-Title: quidproquo`) handled page fetches. It returned full Reddit threads, which direct curl could not get (Reddit answered 403 to curl and to old.reddit `.json`), plus UKC threads, blogs and some YouTube transcripts.
- (4) You.com keyless: not needed.
- (5) Exa: semantic search, plus fetching the full UKC thread 750778. Exa `web_fetch_exa` on Reddit returned SOURCE_NOT_AVAILABLE.
- Direct curl worked on Mountain Project threads (parsed with a script) and on YouTube watch/search pages (description and publishDate). `yt-dlp` pulled auto-captions. UKC returned 403 to curl, so UKC was read through Keenable and Exa.
- Built-in WebFetch/WebSearch: not used.

Handle policy: forum posters appear by handle or initials. Real-looking MP display names are cut to initials. Full names appear only for public figures (pro climbers, bylined journalists, YouTube channel names).

---

## Examples

### 1. MP user "BFK": short European sport-cragging trips (rolling duffel with crag pack inside)
- URL: https://www.mountainproject.com/forum/topic/123687187/travel-bags-to-fly-to-climbing-destination
- Date: post 2023-01-24 (thread started 2023-01-23)
- Source type: Mountain Project forum
- Destination / trip type: "a bunch of short trips around Europe for sport craggin". Sport.
- Airline: not stated
- Checked: **Patagonia Black Hole 70L rolling duffel with a BD Creek 50L inside it**, plus stick clip and all clothes.
- Carry-on: **BD Transit 35L** holding the computer, one set of street and crag clothes, **harness and shoes**.
- Tips/problems: puts the Creek inside the duffel because checked packs get "mangled by ground handlers (this happened to my buddy with his Creek 50)". Carry-on harness and shoes mean "if my bag gets lost I can still usually climb with any friends". Also: "I know of multiple people who have been denied either a rope or draws (or both) in their carry on."

### 2. MP user "D.C.": crag pack as the personal item
- URL: same thread as #1
- Date: 2023-01-24
- Source type: MP forum
- Trip type: general fly-in cragging (sport)
- Checked: "All the ropes and draws, stick clip in my checked luggage along with casual wear."
- Carry-on: climbing clothes in a carry-on that gets **checked at the gate**.
- Personal item: "Crag pack with 2 days worth of clothes, shoes harness and helmet my personal item."
- Related tips in the same thread: "If you check a backpack, put it in a cheap duffel to protect the straps" (quoted by "Climb On"). User "Skibo": "you can request a heavy-duty plastic bag from the airline to put your pack in."

### 3. MP users "Climb On" / "Brian in SLC": the two opposite defaults
- URL: same thread as #1
- Date: 2023-01-23
- Source type: MP forum
- "Climb On": "Rolling suitcase gets checked. Crag bag w/gear is my carry on. I use my 15 liter multipitch as my personal item." (gear in the cabin)
- "Brian in SLC": "I carry on my cragging pack with no climbing gear in it… Then I check a bag with wheels. It carries the climbing gear." He adds that it "depends on what type of climbing and where". (gear in the hold, crag pack as cabin bag)

### 4. MP user "rgold": trad rack in the cabin, rope checked (US domestic, trad)
- URL: https://www.mountainproject.com/forum/topic/201722445/flying-with-climbing-gear
- Date: 2025-09-21
- Source type: MP forum
- Destination: NYC to SLC, and NY to Rapid City (Needles/Black Hills). Trad.
- Carry-on: "full trad rack in a carry-on bag".
- Checked: "Checked the rope, and put the nut tool in checked baggage too."
- Reasoning: did not want the rack "lost for an indeterminate amount of time", and "figured at least one partner's rope would get through". Also: "my checked bag was heavy and the rack would have kicked it over to a big surcharge."
- Problem: at SLC the scanner flagged a small knife he had forgotten in a chalk-bag pocket.
- Other data points in the same thread (2025-09-19/21): "K Go": "Check it all if you can, except maybe a pair of shoes and your helmet in carry on… large carabiners might get confiscated… as they look like brass knuckles". "Terry E": a double rack and lots of draws in carry-on were opened but passed. "Samuel Puckett": Redmond (Smith Rock) TSA "knew it was climbing gear without even opening the bag". "old5ten": carries the rack on because "nothing sucks quite like getting to your destination and find out that your rack 'arrived' a few thousand miles away". "John Yu": checks everything with an AirTag in the pack.

### 5. MP user "K Go": Red Rock / Las Vegas, everything but the helmet checked (Seattle, Southwest)
- URL: https://www.mountainproject.com/forum/topic/121870168/flying-with-cams-other-climbing-gear
- Date: 2022-01-16 (trip December 2021)
- Source type: MP forum
- Destination / airline: Seattle to Las Vegas on Southwest ("flying SW from Seattle and back"). Sport and trad.
- Checked: rope, sport and trad gear, "everything except my helmet".
- Carry-on: helmet. He thought about carrying the harness in case of delay but checked it.
- Tips: "Take pictures of all your gear laid out before the trip" for police and renter's-insurance claims. "neon colored zip ties on my duffel bag zippers… super obvious if anybody went into your bag". "Pad your cams in your checked bag, none of mine got damaged."

### 6. MP user "J.S.": Europe–USA–Europe, all gear checked in two bags
- URL: same thread as #5 (user "Joe Say'n")
- Date: 2022-01-16
- Source type: MP forum
- Trip: several transatlantic climbing trips
- Checked: "Ropes and helmets went into one bag with outdoor clothes and tent, all metal went into another bag. Never had any problems."
- Tip: "we chose the one airline that included two free checked bags per person which helped tremendously."
- Theft and confiscation counterpoint in the same thread from user "r.a.": "my Camalot #4 and #3.5 were stolen from checked bags… French airport security at CDG stole all of my locking biners from my carry on… saying they are weapons."

### 7. MP users "Barry M" / "Greg R": rope as the personal item in an under-seat roller
- URL: same thread as #5
- Date: 2022-01-16
- Source type: MP forum
- "Greg R" (quoted): "Flown dozens of times with gear as carry-on and rope as personal bag."
- "Barry M": "I use a roller bag that fits under the seat for my personal item… 70m and a set of draws easily fits in a under the seat roller." He also says: "I'd rather pack the weight of the rack around the airport then check the rack and it get delayed or lost. Clothes are much cheaper to replace."
- Same thread, user "J.S.2" (Jeremy S): "pack all of your cams… in your carry on, and pack your rope in your checked luggage since it's cheaper and easier to replace… place a climbing book/magazine/guide on top of your gear… nut tool in your checked luggage."

### 8. MP user "S Saunders" and others: trad gear carry-on, rope checked, with Mexico exceptions
- URL: https://www.mountainproject.com/forum/topic/126025298/flying-with-climbing-gear-in-a-carry-on
- Date: 2024-04-21 to 2024-05-02
- Source type: MP forum
- "S Saunders": "I always take my trad gear in a carry on, rope in checked baggage. Have my carry on inspected about 20% of the time."
- "Mark P" (2024-05-02, Mexico): "In Mexico City, the security agents made me check all of my climbing gear when flying to Monterrey. Thankfully Aeromexico checked the bag for free." (El Potrero Chico route)
- "nat han": carried a sport rack and rope out of Mexico City twice without issue, but a tripod hex key was taken.
- "D.J." (Daniel Joder): leaving Buenos Aires EZE for Barcelona, "they confiscated my cordelette and prusiks".
- "Dan Bookless", quoting another poster: stick clip taken flying Monterrey to Mexico City.
- "Jeremy L": "TSA took my gri² out once in >20 times… May or may not have a problem w your rope if you're flying in from Mexico (made me check it in once)".

### 9. MP user "Redacted Redactberg": no bags at all except a Creek 50 personal item (wear the rack)
- URL: https://www.mountainproject.com/forum/topic/125943134/traveling-with-gear
- Date: 2024-04-08
- Source type: MP forum
- Trip type: trad (US domestic)
- Bags: "Ive gone in with a creek 50 as a personal item, no carry on or checked bag."
- Weight/size trick: "When doing the bag test, i put on my harness, rack my gear on the loops, wear my helmet, wear all my coats, and stuff the shoes in my coat pockets. Another win for the tricams".
- Same thread (2024-04-08 to 04-14):
  - "Nate Farr": "I had my climbing gear go missing when I checked it. If you check your gear, make sure to keep some essentials (shoes, harness, etc). It saved my trip".
  - "Eric Marx", leaving Mexico City with two ropes and two racks: "They made my partner check his gear, and made me check my rope. So he carried on his rope and I carried on my gear."
  - "Rob D": "sport climbing trips I carry on everything… gotta check a bag if you wanna bring your stick clip."
  - "Ben V": "Always carry on your helmet… the one the baggage handler threw on the asphalt and cracked."
  - "Ry C": US to Madrid to Malaga; out fine, but on the return "they made me check my bag because I could 'tie someone up with my rope'". No issues around Vietnam, Japan and Thailand.
  - "rpc": always checks, but puts "climbing shoes & possibly harnesses into carry ons".
  - "Granite Serf": "Germany you could carry-on, but France you had to check in."

### 10. MP user "K.K." and replies: what bag carries a 50 lb trad kit
- URL: https://www.mountainproject.com/forum/topic/124138683/best-gear-bag-for-air-travel
- Date: 2023-05-03 to 2023-07-23
- Source type: MP forum
- OP: "Everything together is just under 50 lbs… a double rack of cams, 70m rope, a couple pairs of shoes".
- Reported bags:
  - Mountain Hardwear Expedition Duffel ("much nicer and more durable" than a Patagonia Black Hole, which "have a few holes").
  - **Metolius Quarter Dome haul bag**, "typically right around 50 lbs… after ~20 flights it's held up well and then you can use the bag for climbing stuff".
  - Gregory Alpaca 90.
  - REI Big Haul Rolling Duffel.
  - **Deuter Traveller**, which has a zip-on panel that "protect[s] all the straps and buckles, if you have to check the bag in".
  - **Patagonia Cragsmith** as a carry-on: "A rope and a double rack occupy a little over half of the pack… It fits in the overhead bins better than most hard cases."
- "Desert Rock Sports" (2023-07-23): "Fly with an airline that accepts your regular climbing backpack and the gear packed inside as a carry on. Nut tool, #6, Big Bros, and stick clip in checked bag… people 'lose' checked bags allllll the time".

### 11. MP thread, JFK/Amsterdam and Europe and Argentina: carry-on data points
- URL: https://www.mountainproject.com/forum/topic/121621753/gear-in-carry-on-luggage
- Date: 2021-11-12 to 2022-10-21
- Source type: MP forum
- OP "Simon W" (2021-11-12): JFK to Amsterdam. Usually carries only "shoes harness chalkbag" and planned to add rope and draws this time.
- "LL2": "always taken all my gear as carry on… if your bags don't make it, at least you can climb."
- "Nathan Forbes": "Amsterdam… Frankfurt, Zurich, Geneva, Milan, etc with a full rack in my carry-on and never had an issue."
- "Kai Larson": JFK security refused carabiners "all clipped together in a long chain".
- "M.G." (2022-05-28): leaving Mallorca, police refused all gear in carry-on: "'La policia es la regla'… I had no choice but to run back and check my carryon."
- "D.J." (2022-10-21): trad rack carry-on was fine Barcelona to Argentina. At Buenos Aires AEP (domestic), "security had me check my carry on backpack—they especially didn't like the look of that #4 BD cam". Suggests having checked baggage "Saran-wrapped" against pilfering.

### 12. MP thread: South America (Chile, Argentina) and carry-on weight limits
- URL: https://www.mountainproject.com/forum/topic/123085160/can-i-travel-internationally-with-my-climbing-gear-in-a-carry-on
- Date: 2022-09-18 to 2022-09-25
- Source type: MP forum
- OP: United then LATAM. Wants shoes, chalk, harness and belay devices in the carry-on "to make my checked bag lighter".
- "Emilio Sosa": "flew to Chile with rope, draws, harness, helmet, shoes, and chalk, and didn't have any issues". On the way back a guard checked the bag but let it go.
- "A.D." (weight trap): "Aerolineas Argentinas is only 5kg for domestic flights, and they weighed my normal looking roll-aboard and made me check it. It looks like LATAM has a 10kg limit".
- "R.D.": "My stick clip was confiscated in Denver… Chalk was ignored somehow every time".

### 13. Reddit u/photomonkey8 and u/Radiant_Box3712: Mexico draws refused, Melbourne rope confiscated
- URL: https://www.reddit.com/r/RockClimbing/comments/zk8fmg/flying_with_climbing_gear/
- Date: thread 2022-12-12. The Melbourne comment refers to December 2024.
- Source type: Reddit r/RockClimbing
- OP planned to fly with "a rope, shoes, harness, chalk bag, and my climbing rack".
- u/photomonkey8, Mexico City to Monterrey (Potrero Chico): "agent said the quickdraws I had in my carry-on were not allowed… I had to run back and check my bag, luckily I had arrived there early enough".
- u/Radiant_Box3712: "Lost my climbing rope in Melbourne Australia international transfer security in December 2024. They said it was a restraint. Pack it in a checked bag. Draws, slings and carabiners made it through."

### 14. Reddit u/madluer: personal-item-only weekend on Frontier, shoes clipped outside
- URL: https://www.reddit.com/r/climbergirls/comments/1hnfw12/flying_with_climbing_gear_on_personal_item/
- Date: 2024-12-27
- Source type: Reddit r/climbergirls
- Trip: weekend cold-to-warm climbing trip. Airline: **Frontier** (personal item only).
- Plan: wear two layers and clip the climbing shoes to the outside of the personal item.
- Replies:
  - "put my climbing shoes in the water bottle pocket and carried my water bottle when boarding".
  - "Frontier is a pain about carry on bag size… Put it all inside the bag".
  - BA London to Vancouver with shoes clipped outside: fine.
  - "When I was a competitor our coaches were very strict about not putting shoes in a checked bag".
  - "wear your helmet and headlamp… during the flight".
  - "TSA always flags my nut tool, so pack that near the top".
  - Melbourne "forced me to check my bag with trad gear (no nut tool, no knife, just cams, draws, and nuts)".
  - Australia: slings confiscated as "restraint devices".
  - "let him fly from Hungary to Tenerife… but didn't allow [a biner] back".
  - Extreme case, u/I-figured-it-out (older story): wore a full rack with a 35 kg day pack plus 20 kg checked to dodge excess fees, after sending most gear ahead by airfreight.

### 15. Reddit u/Czesya: UK to Thailand (Phuket) with a carry-on sport kit and a clip stick
- URL: https://www.reddit.com/r/climbergirls/comments/1r72m8v/climbing_gear_in_carry_on/
- Date: 2026-02-17
- Source type: Reddit r/climbergirls
- Destination: Heathrow to New Delhi/Mumbai to Phuket (Krabi/Railay area). Sport.
- Planned carry-on: "harness, chalk bag, shoes, couple of draws, petzl connect and a beta clip stick". Wants to avoid checking "in the interest of time (and also don't want it to get lost)".
- Replies:
  - **Mumbai**: "he almost confiscated my Grigri and locking carabiners and sling… said don't carry it next time".
  - **Tenerife**, more than once: quickdraws must be checked ("metal could be used to smash a window"), and rope "could be used to tie someone up".
  - Seen: "people flying from Singapore to Krabi… with a rope-bag in the cabin".
  - A dry bag of draws, an Ohm and a Grigri was hand-searched on an intra-EU flight, then passed by a supervisor.
  - Clip stick walked onto the plane "holding it like Gandalf".
  - Stick clip inspected on the way to Vegas, so checked on the way back.
  - Chalk: carry an unopened ball in its original packaging.

### 16. Reddit u/CongregationOfVapors: Madrid refuses rope and draws in the cabin
- URL: https://www.reddit.com/r/climbergirls/comments/1rb2bhe/psa_madrid_airport_didnt_let_us_keep_the_rope_in/
- Date: 2026-02-21
- Source type: Reddit r/climbergirls
- Destination: Spain sport trip, via Madrid.
- "We've been on climbing trips to Spain before with our climbing gear in our carry-on with no problem… the security agent said the rope was not ok for carryon in Madrid. (He also said the quickdraws were not ok…) We had to run back out to check the climbing gear."
- Replies:
  - "This would be standard in Mexican airports as well. Ropes and draws have to be checked".
  - "I was once allowed to travel with my 70m rope in my carry on and in the same airport, a few weeks later, they didn't allow my 120cm sling. I always check in my gear now".
  - "Shoes are always fine. A harness and chalk bag usually are. Anything more than that, either check a bag or be ready to loose your gear".
  - Barcelona and Venice reported the same, and Indonesia ("with ropes you can tie and strangle people").

### 17. UKC "stevevans5" thread: 9-day sport trip in about 16 kg of hold luggage
- URL: https://www.ukclimbing.com/forums/destinations/climbing_gear_on_a_plane-740523
- Date: 2021-10-25
- Source type: UKClimbing forum
- Trip: European sport trip, UK departure. easyJet mentioned.
- Checked weight: "I recently had a 70m rope + draws + harness + 3 pairs of shoes and everything else for a 9 day trip and it weighed about 16kg. Hand luggage restrictions have changed on easyjet recently".
- Other posts:
  - "Just put all of your gear in the hold and your shoes in your hand luggage. Job done."
  - "Rope is the critical weight… Then draws, split them up between you and your partner".
  - "if weight is a problem I cut down on clothes and hand wash them… It's worth getting a scale… Wear your big boots, and as much heavy/bulky clothing as you can bear".
  - "I've never had a problem with harness, rock shoes and helmet, but krabs and quickdraws are likely to be a problem… what you get away with on the outward flight might be confiscated on return."
  - Someone else has taken all gear as hand luggage "many times", but was told "You could tie up the cabin crew with the rope!"

### 18. UKC "emitto": easyJet loses the bag with the whole sport kit (Milan to London Gatwick)
- URL: https://ukclimbing.com/forums/off_belay/easyjet_lost_luggage_-_all_my_sports_gear-752335
- Date: 2022-09-26
- Source type: UKClimbing forum
- Trip: Milan (Italy) climbing trip. Return to LGW on **easyJet**.
- Checked: 3 bags. The lost one "contained all of my sports climbing gear, ie 60m rope, 14 qd, belay devices, slings, screwgates, boots, harnesses, helmet, belay glasses".
- Problem: no human contact with easyJet. "a bag is considered irrevocably lost after 45 days". Had to "go and buy a new harness so I could climb". Travel insurance notified.

### 19. UKC "Queen of the Traverse": Air Canada slashes the suitcase, rope and rack luckily left at home
- URL: https://www.ukclimbing.com/forums/gear/climbing_gear_in_hold_luggage-750778
- Date: 2022-08-13 to 2022-08-17
- Source type: UKClimbing forum
- Trip / airline: Canada to Heathrow, **Air Canada**.
- Checked: old soft-shell suitcase with an Osprey pack inside. "a hole gouged in by Air Canada… slashed a hole through the Osprey pack INSIDE my suitcase as well… If I've had climbing kit next to that part of the case it definitely would have cut through."
- Replies: "pack it with that in mind… If your rope has been stuffed in a suitcase, pay extra attention when you flake it out". "Best not to lock bags" (US security forces locks). BMC insurance excess may make a claim not worth it.

### 20. Tuomas (personal blog): Kalymnos, Helsinki to Kos, two ropes and pre-paid extra kilos
- URL: https://www.tuomasheinonen.com/blog/kalymnos-a-paradise-for-climbers-what-i-learned-on-my-first-visit-to-the-island/
- Date: 2024-12-02
- Source type: personal climbing blog / trip report
- Destination / trip type: Kalymnos (Massouri). Sport, couple.
- Airline: Helsinki-Vantaa to Kos 08:00–12:00 (carrier not named). Then bus to Mastichari and ferry to Pothia.
- Allowance: "15 kg for checked luggage and 5 kg for carry-ons… possible to purchase an additional 5 kg or 10 kg, which we did."
- Checked: "two ropes, one 80 meters and one 60 meters… Our bags weighed just under 20 kg each".
- Carry-on (backpacks): "harnesses, one pair of shoes, a belay device, and for me, cameras."
- Return: "emptied our backpacks into the suitcases… each suitcase was around 21 kg". "Carry-on luggage was not weighed there [Kos]." Gear and shoes can be bought on the island if lost (bought Scarpa Generators for 157 EUR).

### 21. Delaney Michels (climber/creator blog): month in Spain (Cuenca), gear duffel checked
- URL: https://delaneymichels.com/blog/pack-my-bags-spain
- Date: 2025-10-09
- Source type: personal blog (sponsored by REI for gear)
- Destination / trip type: Cuenca, Spain. Hosting a women's group trip, then a month of extra climbing. Sport.
- Carry-on / personal item: **REI Traverse 60L pack** (detachable brain used as a daypack). Camera gear, passport, wallet, "two of my go-to outfits".
- Checked: **NEMO 55L Haul Duffel**, "where I've packed all my climbing gear": 70m 9.5 Crag Dry rope, 12 quickdraws, 2 Grigris and an ATC, Petzl Connect Adjust PAS, Petzl helmet, crack gloves.
- Reasoning: "my climbing gear goes in the checked bag since I can always find people to climb with if it gets lost. The key is to keep what you actually need day to day with you".

### 22. Tori (Wild Rock staff feature): Japan bouldering, "checked bag is always full of gear"
- URL: https://wildrock.net/blogs/the-journal/wish-list-trips-tori
- Date: 2025-12-04
- Source type: outdoor-shop journal, staff profile
- Destination: Japan (Okayama, Mount Ojigatake bouldering), 2–3 weeks in spring. **Caveat: a planned "wish list" trip.** The packing habit is stated as her usual practice.
- Quote: "I'm pretty minimalist when it comes to clothes, but my checked bag is always full of gear." "Climbing ropes and gear are bulky, so all her clothing goes in her carry-on."
- Carry-on bag: **Patagonia Black Hole MLC** ("her go-to carry-on travel bag").

### 23. Asana Climbing blog: Europe bouldering tour with crash pads from LAX on American Airlines
- URL: https://asanaclimbing.com/blogs/news/travelling-with-crash-pads
- Date: 2025-12-11
- Source type: brand blog, first-person trip account
- Destination / trip type: Europe (Spain/Mallorca mentioned). Bouldering. Airline: **American Airlines** from LAX.
- Checked: crash pads, filed as "oversized sports equipment, or if that doesn't exist you can always select 'gymnastics pad'". "allowed a 50lb weight limit so stuff things inside it". Cost "about $100-$200".
- Notes: "For layovers they keep the crash pads and transfer them". Took pads on trains. Used the luggage-storage app Bounce ("7 euros a day") to park pads during side trips.

### 24. Dan Turner (YouTube, "The PERFECT bouldering pad for flying?"): Rocklands and Europe work trips
- URL: https://www.youtube.com/watch?v=-xOv5EYTnsk
- Date: 2024-09-24
- Source type: YouTube review/vlog. Partial transcript read via the Keenable fetch.
- Destination / trip type: Rocklands (South Africa) bouldering. Also flies "a lot for work around Europe".
- Bags: Organic **Airline Trifold Pad**, "20 in by 30 in by 12 in… 51 by 76 by 30 cm", which fits the common **158 cm linear checked-bag limit** (easyJet, American, Ryanair dimensions cited). Checked pad plus "cabin bag is just ideal". "you can actually kind of stuff things in the pad".
- Problem that prompted it: "before my Rocklands trip when I had a bit of a panic that all my pads were over the… size limitations".

### 25. Paradigm Climbing webinar #16, "A Climber's Trip to Rocklands"
- URL: https://www.youtube.com/watch?v=CAVBVDsqTzc
- Date: 2026-04-07
- Source type: YouTube webinar by experienced Rocklands visitors (transcript via yt-dlp auto-captions)
- Destination / trip type: Rocklands, South Africa (via Cape Town). Bouldering.
- Carry-on rule: "Put all your climbing gear, so anything that you need to climb in, so clothes, shoes, chalk, put all of that in your carry-on. Don't put it in your checked luggage… at least one or two pairs of shoes in your carry-on in case they get lost. That happens to like five people a year at least." "Buying climbing gear in South Africa is incredibly exp[ensive]".
- Pads: rent locally, "about like €150 for a month… if that's cheaper than the… extra flight baggage cost, do that."

### 26. Anthony Gullsten (pro climber, EpicTV "What's In A Pro Climbers Travel Bag?"): one cabin-size bag
- URL: https://www.youtube.com/watch?v=1oYwrw6tnTY
- Date: 2022-03-18
- Source type: YouTube (EpicTV Climbing Daily Ep.1971), transcript via yt-dlp
- Destination / trip type: Frasassi Climbing Festival, Italy. Sport.
- Bag: **La Sportiva travel bag**, "the only bag that i brought for my trip". "fitted so you can have it in… the hand baggage… plus it's a bit softer… not like these hard case ones". Laptop pocket, full clamshell opening.
- Contents: harness, shoes (La Sportiva Solution), chalk bag, rain jacket, headlamp, Leuko-type tape, brush, power bank, clothes. No rope or draws shown.

### 27. Short Guys Beta Works (YouTube): Colorado to Nepal expedition, size and weight per flight leg (alpine, adjacent)
- URL: https://www.youtube.com/watch?v=dLF2qgIK2Nw
- Date: 2022-04-10
- Source type: YouTube, transcript via yt-dlp
- Destination / trip type: Denver to Frankfurt to Delhi to Kathmandu, then domestic Nepal. **Mountaineering (adjacent, not rock).**
- Checked: **Osprey Transporter 95L duffel** ("fits cargo luggage size limits"). Everything that is "sharp or could be misused as a club": crampons, trekking poles, belay knife. Fuel bottles washed, with the lid taped open.
- Carry-on: **Osprey Mutant 38** "with top lid removed". Meds, electronics, a full change of clothes, **mountaineering boots** ("boots that are broken in and fit my feet may not be easily replaced").
- Weights: carry-on limits changed by leg: 55×40×23 cm / 8 kg, then 55×35×25 / 8 kg, then in-country Nepal 55×40×20 "and we were told 10 kilograms". Uses TSA locks so bags don't burst open.

### 28. Reddit u/Ok-Profile-4182: KLM loses the checked bag with all mountaineering gear before Mont Blanc (alpine, adjacent)
- URL: https://www.reddit.com/r/Mountaineering/comments/1e7af4y/luggage_with_climbing_gear_lost/
- Date: 2024-07-19
- Source type: Reddit r/Mountaineering
- Destination / airline: Chamonix / Mont Blanc via **KLM**. Stranded during the July 2024 Microsoft/CrowdStrike outage.
- Checked: "My checked bag has all of my mountaineering gear".
- Replies:
  - "I always take my helmet and boots in my carryon… they are custom fit".
  - "Did you use airtags?"
  - Haute Route group "bought all new gear in Chamonix. Airline did reimburse us most".
  - Lima-to-Bolivia climber's bag arrived after 10 days, trip lost: "purchased accident and evac insurance but not travel. Hard lesson".
  - "Why I ship/ mail my gear… to the post master in the town".

### 29. Hello Hola Ni Hao (couple's blog): one year of climbing in Europe, ropes bought on arrival
- URL: https://helloholanihao.com/2021/09/21/packing-for-a-year/
- Date: 2021-09-21
- Source type: personal travel/climbing blog
- Destination / trip type: a year based in Europe. Sport, trad and multipitch.
- Bags: one clothes suitcase each, plus a large suitcase that is "a bag of bags" (hiking packs, poles, shoes), plus "the bag full of metal": 16 quickdraws, 12 alpine draws, a **double rack of cams**, nuts and offsets, tricams, lockers, Giga Juls, 2 pairs of shoes each, helmets, harnesses, nut tool and more.
- Carry-on: laptop bag, camera and drone bags, "another small backpack that carried all of our climbing guide books on the plane (those are so heavy!)".
- Trick: "We decided to buy ropes once in Europe to save a bit of space".

### 30. Mountain Diaries (personal blog): Tonsai/Ao Nang and Laos, the regret of not bringing a rope
- URL: https://mountaindiaries.com/posts/climbing-in-thailand-laos/
- Date: 2024-01-03 (trip Nov/Dec 2023)
- Source type: personal trip report
- Destination / trip type: Krabi (Tonsai, Railay, Ao Nang), then Green Climbers Home, Thakhek, Laos (flew Bangkok to Nakhon Phanom, about 50 EUR). Sport, beginner.
- Packing outcome: "One thing we did regret was not bringing our own rope. Rope rental costs around 10 Euros/day on either Tonsai/Railey and in Ao Nang, we couldn't find a place to rent at all." GCH rents gear at both camps.

---

### Media and brand guidance (2020+, read; used as context, not counted as examples)
- Climbing.com, Matt Samet, "How to Fly with a Crashpad…", 2024-10-21. https://www.climbing.com/skills/how-to-fly-with-a-crashpad/
  - Put "all your hardware and loose chalk in a checked crag pack, but… bring your harness, chalk bag (inside a grocery bag…), one pair of shoes, and helmet in your carry-on… Always carry your helmet on".
  - A ~40L crag pack can hold "draws, rope, harness, two or three pairs of shoes, and a small rack".
  - "Southwest… charges $75 per bag of sporting equipment". United charges oversize fees.
- Climbing.com, Ryleigh Norgrove, "What Climbing Gear You Can Fly With, According to TSA", 2025-10-14. https://www.climbing.com/travel/flying-with-climbing-gear-faqs/
  - Rope is allowed in carry-on under TSA rules. Check the nut tool. "If you're traveling with a partner, split the rack—better to lose half than all of it." Harness, shoes and helmet in carry-on.
- Climber News, "Can You Take Climbing Gear On A Plane? – Here's Our Experience", 2022-06-16. https://climbernews.com/can-you-take-climbing-gear-on-a-plane/
  - Chalk in its original labelled bag. Pads may be charged as oversize or sports equipment. Ryanair/Qantas two-cabin-bag setups.
- Alpkit, "Winter Sun Climbing Trip Kit List", 2026-01-26. https://alpkit.com/blogs/spotlight/what-to-pack-for-a-winter-sun-climbing-trip-to-europe
  - "Most budget airlines allow 40-55L as checked luggage without oversized fees". Bags shown: Kitbag 40L (cabin size), Voyager 90L roller duffel, Idaho 30 for carry-on only.
- Outdoor Prolink ("The Link"), 2023-10-05. https://blog.outdoorprolink.com/how-to-travel-with-climbing-gear/
  - Split rope and rack between partners. Big cams in a hard case.
- Climbing.com, "A Piece of Kit No Traveling Climber Can Do Without" (BD Stonehauler 90L), 2021-12-28. https://climbing.com/gear/duffel-bag-for-the-traveling-climber
  - Road-trip context, not flying.

---

## Patterns (counted across the 30 examples above)

Counting rule: an example counts toward a pattern only if its post or page states that behaviour or incident. Threads that hold several reports (e.g. #4, #8, #9, #11, #14–16) count once per pattern, plus extra sub-reports where they are clearly separate people and incidents (noted).

1. **Harness and shoes (often the helmet too) go in the cabin as lost-bag insurance**: 17 examples (#1, 2, 4-thread, 5 helmet only, 7, 9 ×3 voices, 12, 14, 15, 17, 20, 21 (implicitly: "what you actually need"), 22, 25, 27 boots, 28 helmet and boots). This is the most consistent advice. The stated reason is fit: shoes, harness and helmet are fit-specific and hard to rent or buy (South Africa and Kalymnos are named as expensive).
2. **Rope goes in the hold**: 14 examples check the rope (#2, 4, 5, 6, 7-JS2, 8-S Saunders, 16, 17, 18, 20, 21, 22, 13-Melbourne advice, 9-Rob D's "except rope"). Reason: it is heavy, cheap to replace, and the item most often refused at security ("restraint", "tie up the crew"). Counter-pattern: 4 put the rope in the cabin or the personal item (#7 under-seat roller, #12 Chile, #9 Eric Marx's split, #14 OP plans).
3. **Hardware split (cams vs quickdraws)**: in the US, trad racks commonly ride in carry-on (#4, 7, 8, 10 Cragsmith/Desert Rock, 11 Nathan Forbes, 9 Mike K), with the explicit aim of not losing an expensive rack. Outside the US, more examples check the metal because quickdraws/carabiners get refused (#6, 13, 15, 16, 17, 21). The nut tool goes in the hold in 8 examples (#4, 7, 8, 10, 14, 9, 11, 12).
4. **Security confiscation or forced check-in stories**: 16 distinct airport incidents across the examples:
   - Mexico City to Monterrey ×4 (#8 ×2, #9, #13)
   - Madrid (#16) and the Madrid return in #9
   - Barcelona (#16 and an older one in #9)
   - Mallorca (#11), Tenerife ×2 (#14, #15), Venice (#16)
   - CDG lockers taken (#6)
   - Melbourne ×2: rope as "restraint" (#13), trad rack forced check (#14)
   - Buenos Aires: EZE cordelette (#8), AEP #4 cam (#11)
   - Mumbai near-confiscation (#15), Denver stick clip (#12), JFK carabiner chain (#11)

   Recurring phrases: carabiners as "brass knuckles/knuckledusters", rope as a "restraint" or "tie up the crew". **Mexico and Spain are the most-cited strict exits.** Outbound passes and return refusals at the same airport are reported repeatedly (#9, #14, #17).
5. **Stick clip and nut tool are the items most likely to be pulled**: stick-clip trouble in 6 (#8, 9, 10, 12, 15 ×2). The fixes are checking it, buying a painter's pole locally, or hand-carrying it "like Gandalf".
6. **Crag pack doubles as the cabin bag or personal item**: 8 (#2, 3 ×2, 9, 10 Cragsmith, 11, 26 La Sportiva travel bag, 1 Transit as the cabin pack). If a pack must be checked, protect it: put it inside a duffel (#1, #2), use an airline plastic bag (#2), a strap cover (#10 Deuter), or have it saran-wrapped (#11).
7. **Bag choices**:
   - Rolling duffel or suitcase for the hold: 7 (#1 Black Hole 70 roller, 3 ×2, 10 REI Big Haul and regular roller, 7 under-seat roller, 23).
   - Expedition duffel: 6 (#10 MH Expedition, Gregory Alpaca 90, Patagonia Black Hole; #21 NEMO 55 Haul; #22 Black Hole MLC as carry-on; #27 Osprey Transporter 95).
   - Haul bag as luggage: 1 (#10 Metolius Quarter Dome, about 50 lb after about 20 flights).
   - The Patagonia Black Hole family is the single most-named bag line (#1, #10, #22).
8. **Weight-limit tactics**: 10 examples.
   - Pre-buying extra kilos (#20, +5/10 kg)
   - Wearing heavy items or the rack itself (#9, #14, #17)
   - Splitting draws or rope between partners (#17, media)
   - Choosing an airline with two free checked bags (#6)
   - Renting or buying the rope at the destination (#29 buy, #25 rent pads, #30 regret not bringing)
   - Watching carry-on weigh-ins on non-US carriers: Aerolíneas Argentinas 5 kg, LATAM 10 kg (#12), Kalymnos 15 kg + 5 kg (#20), Nepal legs 8–10 kg (#27)
   - Typical numbers: a 9-day sport kit is about 16 kg in the hold (#17). A two-rope couple's bags run about 20–21 kg each (#20). A trad kit with a double rack is about 50 lb (#10).
9. **Lost, delayed or damaged checked bags**: 7 (#9 Nate Farr, #18 easyJet with 45-day limbo, #19 Air Canada slash, #28 KLM plus Lima/Bolivia, #6 cams stolen, #25 "five people a year" in Rocklands, #1 a friend's Creek 50 mangled). Mitigations named: AirTag (#4, #28), photographing gear before the trip (#5), zip-tied zippers (#5), padding cams (#5), not locking bags (#19), travel insurance (#18, #28) and BMC insurance (#19).
10. **Crash pads (bouldering)**: 3 (#23, #24, #25). They are checked as oversized/sports equipment ($100–200 on AA from LAX), stuffed with gear up to 50 lb, sized to the 158 cm linear limit (Organic Airline Trifold), or rented locally (Rocklands about €150/month; Font pad rental is also mentioned in the UKC carless-Font thread).

---

## Sources tried but excluded

Pre-2020 (date verified on page):
- UKC "Camping Climbing Trip – weight limit" (2018-07-06). https://ukclimbing.com/forums/rock_talk/camping_climbing_trip_-_weight_limit-688978
- UKC "Kalymnos & climbing equipment as hand luggage" (2015-07-12). https://www.ukclimbing.com/forums/destinations/kalymnos+climbing_equipment_as_hand_luggage-620161
- climbkalymnos.com "Sky Express luggage allowance" (about 8 years old per the page). https://climbkalymnos.com/forums/topic/sky-express-luggage-allowance
- Carter's Climbs & Treks, Kalymnos (2019-07-08). https://cartersclimbsandtreks.com/post/rock-climbing-in-kalymnos
- MP "Flying with Trad Gear/Cams" 117292804 (posts 2019-07). Parsed, but all posts are 2019.
- MP "Getting crash pads to South Africa" (2019-04-30), "Experiences flying with crash pads" (2018-12-19), "Flying into the Red River Gorge" (2010-08-06), "Gear for Tonsai Thailand" (2017-03).
- Reddit r/climbing threads 64jvzl (2017), 66x5w9 (2017), 68i44m (2017), 813dg3 (2018), 83n5ro (2018), 8vait2 (2018), 3yap9u (2015), and other 2012–2016 threads. Dates came from Keenable `published_at`. Not opened further because they are pre-2020.
- Climbing.com Emily Harrington "Up, Up, and Away…" (2012) and "Tech Tips – Travel" (2010). Low Gravity Ascents Thailand packing (2015). toclimb8a sport-trip packing (2017). Andy Kirkpatrick "Monster Bags on a Plane" (2012). cascadeclimbers flying thread (2010). UKH El Chorro kit list (2015). REI Sport Climbing Gear Checklist video (2019-12-10).

2020+ but excluded (read, no packing split, or off-topic):
- Road To Pitches, El Potrero Chico (flight-delay compensation only, no packing; date not shown on page).
- Nomadventure EPC guide (2026-03-01): drove a skoolie, did not fly.
- Kara Scheer EPC (2023-09-12): area intro, no luggage details.
- Jade's Escapades "What to Pack for Kalymnos" (2025-09-24): gear list only (80 m rope, 15–20 draws, BD Street Creek), no checked/carry-on split.
- JB Mountain Skills "What's In My Sport Climbing Pack, Spain 2021" (2021-02-09, transcript read): crag-pack contents only, no flight packing.
- Vertical Focus "7 Essential Tips for climbing travel" (2024-06-15, transcript read): generic advice (collapsible stick clip in checked bag, rent pads); no concrete split.
- Ella Berry "3 Day Trip to El Potrero Chico" (2026-03-06, transcript read): mentions a last-minute flight only.
- Small Travel Big Life Rocklands (2022-05-23): road trip from Cape Town.
- Giulia on the Summit "Pack with me for Rock Climbing" (2024-11-23): description says only "what I pack for a week"; no captions, no flight info.
- Play with Randomness, Thakhek Laos trip report (Japanese, 2024-01-31): Hong Kong Airlines and AirAsia route described, but no luggage split.
- Threads @azure0518 (Taiwanese, 2026-09-20): Tigerair 10 kg two-piece cabin-only trip with **hiking/mountaineering** gear (frameless pack, trekking poles inside, windproof lighter confiscated at Taoyuan). Off-topic for rock climbing; noted as the only Chinese-language hit.
- MP "Lost haul bag" (2024): about a stolen haul bag, not flying. MP "International dirtbag beta" (2022): only a "50 lbs checked bag" remark. MP "Spain Travel Planning Help" (2024): one "backpack + rolly suitcase" mention, truncated, not enough for an example.
- Reddit r/ClimbingGear "To sell and buy new or fly with gear?" (2025-01-01): moving house, not a trip.
- UKC "Solo carless trip to Font" (2023-03-18): train/pad-rental logistics only (pad delivery to station), no flying split.
- SEO/aggregator pages (zealzag.com, rockclimbingrealms.com, carrysizer.com, travelclosely, canicarryit, bagokay, gearx, kookooclimb, sportscoverdirect, mychina.guide, thecragjournal, which avoided flying): read where relevant but not community examples (no named real trip, or generic or AI-style listicles).

Chinese/Taiwanese sources: Keenable and YouTube searches for 攀岩 出國 托運 繩子 / 攀岩 行李 托運 / 攀岩装备 托运 安检 found airline rule pages and one hiking Threads post only. No usable PTT, 方格子, Medium or 小紅書 climbing-packing post was found (consistent with the known sparsity of Taiwanese sources).
