# post-verify (methods sections): 垂降怎麼做 / How to Rappel

Scope: the new sections only (overview table, Method 1–7, simul/rescue, practice Q5–6, new glossary entries, tldr and description) in `src/content/posts/climbing/2026-10-24-how-to-rappel.md` and `-en.md`. The rest was covered in `post-verify.md`.
Checked: 2026-10-24.
Tooling: Groundlane was not used, because it returned OAuth 401 earlier today. Pages were opened with curl and a browser user agent, then converted HTML or PDF to text. The Mountaineers page came through r.jina.ai because of a Cloudflare 403. YouTube data came from yt-dlp (metadata, captions, and low-res frames with ffmpeg for UUrPgAP1mfw and the Weil 4:01 check). One transcript (NZ Alpine Team / Ladiges) hit a YouTube 429.
Evidence for each claim: four sub-reports, appended below as Parts 1–4. Verdict labels: Confirmed / Outdated / Unverifiable / Contradicted / Misattributed / Misframed.

## Cross-checks done in the main thread

- **Links**: 68 unique external URLs in the new sections, identical in zh and en. 66 return 200.
  - `mountaineers.org/...extended-rappel...` returns 403 to bots (Cloudflare). It reads fine through r.jina.ai, so it's a bot block, not a dead link.
  - The `blackdiamond-cms.zaneray.com` ATC-Guide rev C PDF connects but never answers. It is dead; see Part 4 N3 for the live rev D replacement.
  - A YouTube 200 only means the watch page exists. Part 1 and Part 2 confirmed that each video actually exists, using yt-dlp metadata.
- **zh/en parity**: every timestamp, `start:` value, mm/cm/m figure and year matches across the two files (count diff is empty). A read-through found no content divergence. One tiny difference: in Ouray, zh 「自由墜落約 24 m」 is en "fell about 24 m", which drops "free". It's fine to leave.
- **Petzl embed correction (overrides Part 2 item 1)**: UUrPgAP1mfw is **not** on the GRIGRI/NEOX page, but it **is** embedded as an iframe on `https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope` (checked in the raw HTML; it's a real `<div class="videocontainer"><iframe ...embed/UUrPgAP1mfw>`). Verdict: **Misattributed**, not "delete".
  - zh: 「這支片也嵌在 [Petzl〈Multi-pitch rappelling with a single rope〉](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)技術頁裡。」
  - en: "The video is also embedded in [Petzl's Multi-pitch rappelling with a single rope](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope) tech tip."
- **Spot-rechecks of sub-agent findings**:
  - Beal: the notice table says "Diameter 5.5mm", and the 5 mm figure belongs to the Machard. Confirmed.
  - SAC 1994: says "bis weit in die siebziger Jahre", plus "heikel und fehleranfällig". The 1970s claim is Confirmed.
  - Stopper-knot logic: when you pull end A, end B goes up through the chains, so B's knot is the one that jams. The post's 「先解開要拉那一端」 is backwards. This is the highest-priority fix.

## Non-Confirmed items (priority order; exact zh/en wording is in the Part listed)

1. **Safety logic, Method 1 bullet L383 and Vert paragraph L395**: 「解開要拉那一端的止滑結」 is reversed. Untie the end you **don't** pull. Vert's 19:46 sequence starts after the second climber is off the rope. → Part 1 #2, #3
2. **Beal L469**: the Back Up Line is 5.5 mm, the device is AIRFORCE 3, and the 5 mm is the Machard. Contradicted. → Part 4 N1
3. **Smile Mountain Guides L690**: 「AMGA 認證嚮導公司 / AMGA-accredited」 is not on AMGA's accredited list. Contradicted. → Part 2 #5. Suggested: 「開設 AMGA 單繩距教練課程、嚮導持 AMGA 認證的 Smile Mountain Guides」 / "Smile Mountain Guides, which runs AMGA SPI courses and whose guides hold AMGA certifications".
4. **Dale Remsberg "AMGA 技術總監" L376**: Outdated. The current Technical Director is Eric Whewell, and Remsberg calls himself an AMGA instructor-team member in the video. → Part 1 #1. The same title appears for the AAI simul quote at L668; check the wording there too. → Part 2 #4
5. **Red River Gorge L557**: 「autoblock 沒有作用」. The source says it engaged but was "partially disengaged". Contradicted. → Part 3 E
6. **Palisades grouped under 「裝錯股…三起」 L513**: Palisades was an unanchored strand, not a wrong strand, and only Red Rock was fatal. Misframed. → Part 3 D
7. **Auburn L555**: stated as fact, but the source says witnesses "believe… may have". Misframed. → Part 3 E
8. **REVERSO L548**: the current notice (31 Mar 2026) names only "e.g. a friction hitch"; SHUNT has been dropped. Outdated. Cite the Petzl tech tip. → Part 4 N2
9. **BD link L547**: dead. Switch to rev D (Jul 2025), which says "typically" high-friction mode. **Edelrid link L549**: chalkr.de is a mirror; switch to avs.edelrid.com. The opening line 「三家都沒有禁止…單股」 overreaches for Edelrid and REVERSO, whose notices don't address single strand. → Part 4 N3, N4
10. **GRIGRI step 2 L504**: Petzl says the carabiner holds **if** the knot passes, not that it prevents passing. **L499**: "can't do two strands" comes from the single-rope page, not the GRIGRI page. → Part 4 N5, N6
11. **Munter 「制動手往上，不是往下」 L585**: overstated. Alpine Savvy measured about 25% less friction with the hand at the hip. → Part 4 N7
12. **SAC body rappel L623**: 「燒傷皮膚／制動手一鬆就墜落／現代課程不教」 is not in SAC. Misattributed (partly). → Part 4 N8
13. **Simul table L659** 「專業來源都說只限緊急」: only Gripped says that, not the AAC. **L680**: bergundsteigen says "empfehlen", so write 建議, not 要求. → Part 4 N9, N10
14. **Glossary 繩結移位**: migration happens when the knot sits on the thick-rope side; add that condition. → Part 4 N11
15. **Kim Ladiges reasons L473**: Unverifiable this session (YouTube 429, and no inline link). Add a link to the NZAT video at about 0:37, or trim the reasons to what the Climbing article supports. → Part 3 C
16. **Petzl video L521**: embed location (see above). Also, 「1:08 起解開自我確保出發」: he unclips at about 1:02–1:03 and leans off at about 1:08. Suggested: 「1:02 前後解開自我確保，1:08 起出發」 / "unclips around 1:02 and starts down from 1:08". → Part 2 #2
17. **Ascentionism L625**: "wait for rescue" comes at 6:11, not at the opening. → Part 2 #3
18. **Mike Vert**: 「自述…不是認證嚮導」 should be "mentions no certification". 「2024 年以後只有」 is an unverifiable superlative. The `title:` field is truncated. → Part 1 #3, #4
19. **Colin Haley L477**: 「兩股都進垂降器」 comes from his video description ("forgot to mention"), not from 4:58. → Part 1 #5
20. **JB L591**: the "supported by Outside" credit is on Jez's website, not on the channel. → Part 2 #6
21. **Uncited but Confirmed (L589, L639)**: the Petzl warning that rubbing unscrews the sleeve, DMM Belay Master, and Pit Schubert (SAC Die Alpen 1998/10). Add links. → Part 4 N12

**Outside this scope (already-verified sections), flagged by Part 3; decide separately**: Stanley Headwall L72 「就是」 should be "appears". L227 「AAC 確認對接結不是原因」 is the partner's own statement. The reference title at L842 uses the URL slug "27-year-old"; the live headline is "This Rappel Mistake Can Be Fatal. Why Don't More Climbers Know About It?"

Everything else in scope is **Confirmed**: all other timestamps, titles, upload years, credentials (Weil, Searle IFMGA + Rab + app, Antin, Alice Kerr AMI, Haley/Petzl sponsor, Short Guys Jason, Jez instructor, Eddie Schoen IFMGA + AMGA board, Glen Young, Remsberg/Race IFMGA, Ryan Tilley usage), the Gripped embed, the GRIGRI 8.5–11 mm range and "under 8.9" warning, Petzl's GRIGRI warnings, the Semmel steps, the UIAA 2000 entry (1996, 40 m bridge), BMC "at least one fatality", the AAC simul quote, Gripped "slower", Climbing Buddy Rappel and the 2019 escape-the-belay advice, Muskett's "inherently unsafe", Norway July 2026, Pingora, Gobright, Ouray, Vermont, Sedona, Devils Tower (but note it rests on "apparently"), and Red Rock.

---

# Part 1 — Videos, Methods 1–3

# Part A: video claims verification (how-to-rappel, zh lines 372-496 / en twin)

Evidence: fresh `yt-dlp --dump-json` (scratchpad/pv/vidsA/<id>.json, fetched 2026-10-24), YouTube captions (.work/rappel-how-to/videos-*/<id>.en-orig.vtt, converted to scratchpad/pv/vidsA/<id>.t.txt), frames scratchpad/pv/vidsA/frames/weil_tile*.jpg, curl of creator sites.

## Metadata (title / channel / upload date)

| Video | Actual title | Channel | Uploaded | Post | Verdict |
|---|---|---|---|---|---|
| w6a0SCc3iAI | Rappelling: Learn the Basics | Travis Weil | 2025-10-03 | same, 2025 | Confirmed |
| qkbxXGYfGMk | 5 Rappelling Best Practices to Keep You Safe | Travis Weil | 2025-09-21 | (link only) | Confirmed |
| _C0HXDiGbls | Full Masterclass: Multi Pitch Rappelling for Outdoor Rock climbing - Bolted Anchors | Mike Vert | 2026-08-24 | "Full Masterclass: Multi Pitch Rappelling", 2026 | Misframed (title truncated; minor) |
| MKfPKYSW7iE | Cleaning Top Rope Anchors | AMGAUSA | 2025-06-12 | "AMGA 2025" | Confirmed |
| fMlxmDCie0s | How to rappel/abseil - safely AND efficiently | Charlie Centa | 2026-08-12 | Centa | Confirmed |
| ykzmVwFrVLM | Connecting Ropes for Climbing and Mountaineering // DAVE SEARLE | Dave Searle | 2024-08-31 | same minus channel suffix, 2024 | Confirmed |
| dkPNdMKzlSg | The Prescription \| Stacked Rappel | American Alpine Club | 2026-01-21 | same, 2026 | Confirmed |
| 1SGEoyW2aR8 | Avoid this catastrophic abseiling error! How to join two ropes the right way! | JB Mountain Skills | 2025-07-22 | 2025 | Confirmed |
| p6uJIg4fL5k | Learning to Trad Climb: Part 5 - How to abseil/rappel | DMM Wales | 2022-08-26 | DMM 2022 | Confirmed |
| xQWcuY6lv0o | Rappelling with Ropes of Very Different Diameters | Colin Haley | 2026-08-27 | same, 2026 | Confirmed |
| lC1PIOGWsZM | How to rappel with a tagline. | New Zealand Alpine Team | 2026-10-04 | same, 2026 | Confirmed |

Suggested fix for _C0HXDiGbls title field (zh L399 / en same line):
- zh: `title: Full Masterclass: Multi Pitch Rappelling for Outdoor Rock climbing - Bolted Anchors（Mike Vert，2026）`
- en: `title: Full Masterclass: Multi Pitch Rappelling for Outdoor Rock climbing - Bolted Anchors (Mike Vert, 2026)`

## Claims

### Method 1

| zh line | Claim | Verdict | Evidence |
|---|---|---|---|
| 376 | Dale Remsberg = "AMGA 技術總監" | **Outdated / Misattributed** | In the video he introduces himself at 0:02 as "Dale Remsberg, AMGA instructor team member". Current https://amga.com/about/national-office-staff lists **Eric Whewell** as Technical Director and Joe Thompson as Assistant TD; Remsberg is not listed. Older bios (old.amga.com, Sterling, SJMG) and the AMGA SPI Handbook Ed.4 2026 credit him as TD, so the title is at best stale. |
| 376 | At t=104 AMGA + AAC recommend lowering at sport anchors | Confirmed | 1:49 "I'm going to lower off of this sport climb not repel in sport climbing uh the AMGA 1:57 the American Alpine Club we all 1:59 recommend that we lower off these anchors" |
| 380 | Weil = AMGA certified rock and alpine guide | Confirmed (self-description) | w6a0 0:20 "I am an AMGA certified rock and alpine guide"; qkbx 0:19 same |
| 380 | Weil: tether in, pull up bight, tie, clip to harness, then untie | Confirmed | w6a0 0:58–1:27 "connected to the anchor via ... my tether ... pull up a few extra feet ... clove hitch or a bite knot ... clip it to a carabiner on my harness or on the anchor. I then can untie my knot" |
| 381 | Weil recommends bi-pattern rope; marks fade | Confirmed | w6a0 1:56–2:07 "they can fade ... even better yet a bypattern rope will never fade" |
| 382 | qkbx 0:35 barrel knots both ends; stops rope sliding back through chains | Confirmed | 0:35 "first best practice ... closing the system"; 0:55 "I will tie a barrel knot"; 1:11 "I'll do that with both ends. This also prevents my rope from feeding back through the chains" |
| 383 | "拉繩前，先解開要拉那一端的止滑結" (not a video claim, but drives the Vert summary) | **Misframed** (wording points to the wrong end) | Vert 20:08–20:14: the stopper that must be untied is on the end that travels *up* through the top chains, i.e. the end you are NOT pulling. |
| 387 | w6a0 1:29 thread chains, knot end, pull to middle | Confirmed | 1:29 "go through my chains ... tying a knot in the end ... pull ... until ... my middle mark is at the chains" |
| 387 | 2:16 both strands into device + autoblock | Confirmed | 2:13–2:47 device on both strands; 2:50–3:33 autoblock |
| 387 | 4:01 only visual top-down check, unclips tether without load test | Confirmed | 4:01 "double check. I like to start at the top and work my way down"; 4:33 "Now that I have double checked, I'm ready to take my tether off". Frames 4:00–4:50: he stays standing on the slab, never sits back on the device before unclipping. |
| 387 | Description: camera affiliate link, no climbing-gear sponsor | Confirmed | Description: "Filmed with the help of Insta360 X4 ... insta360.com/sal/x4?utm_t... coupon code INRJ40P"; no gear brand/sponsor otherwise. |
| 395 | "2024 年以後只有 Mike Vert 這支...拍得清楚" | **Unverifiable** (superlative, no exhaustive search evidence) | — |
| 395 | Vert 19:46: first person down unties stopper on pull end, threads next station, re-ties | **Misframed** | 19:34–19:46: the sequence starts when the *second* rappeller arrives and comes off the rope ("once they come off the rope, now it's kind of game time"). 20:08–20:20: untie the stopper on the end that "is going to be going through the chains at the top". 20:41: "pull up that rope end and then tie another stopper knot". Threading the next station happened earlier (18:29–19:02). |
| 395 | Vert: climbing 11 yrs, outdoor adventure diploma, not certified guide, promotes paid course | Confirmed except "自述...不是認證嚮導" is **Misframed** | 0:07 "I've been climbing for 11 years. I have a diploma in outdoor adventure"; description promotes "Rock Ready 30 ... climbingmastery.com". He never says he is not certified; climbingmastery.com cites Algonquin College diploma and no guide certification. Absence, not self-statement. |
| 395 | 18:24–19:02 unties stopper while partner still on rope | Confirmed | 18:24 "you might think ... wait till this person gets down"; 18:32–19:02 "take one rope end ... you're taking out the stopper knot ... feed it through the chains ... immediately you're tying that stopper knot again"; 19:05 "as they're coming down". |
| 403 | Weil 3:32 topside partner doesn't need own backup (bottom belay) | Confirmed | qkbx 3:35 "Now Chris doesn't need a backup because I can provide a backup for him from the ground" |

### Method 2

| zh line | Claim | Verdict | Evidence |
|---|---|---|---|
| 409 | Centa tied into two different-coloured ropes, joins them | Confirmed | 3:38 "I'm tied into both ropes"; 5:53 "two different coloured ropes ... alternating colours" |
| 413 | 3:26 adjustable tether to anchor | Confirmed | 3:18 "clipped in here to my master point with my lanyard ... Petzl Connect"; 3:26 "I would recommend having an adjustable lanyard" |
| 414 | 3:45 leader's ends first; follower's ends on top of pile | Confirmed | 3:45–3:58 "I was the first climber ... my two ends ... untie first and thread"; 4:12–4:26 "the lead climber whose ropes ... Because the seconders ends of the ropes are on the top of the pile ... throw ... unfurl nicely" |
| 415 | 4:36 rope behind anchor carabiners so last person can unclip while on rappel | Confirmed | 4:36–5:08; 12:14–12:24 "If I'm the last person ... clean my anchor ... even though I'm weighting the ropes, it's not an issue ... because I've set up my abseil behind the anchor" |
| 416 | 5:10 double overhand join, colours alternate, knot pulled to anchor | Confirmed | 5:22 "double overhand knot"; 5:56 "alternating colours"; 6:55 "pull the knot up to the anchor" |
| 417 | Autoblock first, then extend device | Confirmed | 7:27 "Why are we doing our auto block before setting up ... abseil device"; 8:47–8:52 extend with 60 cm sling |
| 418 | 9:58 stopper knots both ends, shout "Rope", throw strands separately | Confirmed | 9:58 "tie a stopper knot in the ends"; 10:37 "shout out rope"; 10:48 "both strands of the rope" |
| 419 | Load test; clip tether carabiner to pull strand | Confirmed | 11:28–11:43 "function test ... weight my belay"; 12:00 "clip the carabiner from my personal lanyard to the side of the rope that I need to pull on" |
| 429 | Searle = IFMGA | Confirmed | 0:25 "I'm an ifmga guide based out in Chamonix"; rab.equipment athlete page "As an IFMGA mountain guide" |
| 429 | 7:52 flat overhand; parallel, dressed, four strands tightened, ~30 cm by wrist-to-elbow | Confirmed (note) | Chapter "07:53 Offset Overhand Bend"; 8:35 "check that the tails are 30 cm"; 8:48–9:02 parallel; 9:19–9:38 pulls each strand. The wrist-to-elbow = 30 cm rule is stated at 6:42–6:55, before the demo; in the demo he pulls out slack "halfway up my bicep". Fine as written. |
| 429 | 10:42 second knot allows shorter tails | Confirmed | 10:42 "tie a second overhand knot ... 10:58 we can actually have slightly shorter tails in this situation" |
| 429 | Opening promotes own app; Rab-sponsored | Confirmed | 0:39–1:41 OAK app pitch; description "Download the OAK app"; https://rab.equipment/eu/athletes/dave-searle exists (Rab athlete page) |
| 437 | AAC 2026, Jason Antin IFMGA/AMGA, from 0:35 stacked rappel, HAD = Harness/Anchor/Device; both strands through device + locked carabiner | Confirmed | Description "IFMGA/AMGA guide Jason Antin"; 0:35 "Pre-rigged or stacked repels"; 1:00 "Don't be had. harness anchor device"; 1:34–1:42 "two ropes going through the device clipped with a locked carabiner"; Stanley Headwall context 0:03–0:27 |
| 445 | JB 0:18 deliberate wrong way: long tails, device clipped to tails | Confirmed | 0:21 "overhand ... I'm rushing"; 1:18 "I've lent back on the tails"; 1:34 "ridiculous size tails" |
| 445 | JB 1:54 correct tail length | Confirmed | 2:05 "tails around about 30 cm. 30 to 50 cm" |
| 445 | DMM 2022, AMI instructor Alice Kerr, 4:35 stacked abseil, ~60 cm tails | Confirmed | Description "AMI instructor Alice Kerr"; 4:38–4:41 "something called a stacked absil"; 1:47 "I want these tails to be about 2 [foot] long" (~60 cm) |

### Method 3

| zh line | Claim | Verdict | Evidence |
|---|---|---|---|
| 477 | Haley 2:52 explains knot migration | Confirmed | 2:58–3:41 "skinny rope passes through the belay device much faster and the knot starts to migrate away from the rappel anchor" |
| 477 | 3:53 almost always pulls the cord | Confirmed | 3:51 "I prefer almost always to set things up to pull the skinny rope" |
| 477 | 4:58 hybrid: both strands in device + clove hitch & locker on fat rope at ring | **Misframed** (minor) | 5:02–5:30 clove hitch next to joining knot, locker clipped to single rope "girth hitched the single rope through the rappel anchor". "Both strands in the device" is only in the description: "One thing that I forgot to mention in the video: ... I still put both ropes in my belay device". |
| 477 | Ties two joining knots | Confirmed | 2:46 "I make a second Euro Death Knot right next to the first" |
| 477 | Not certified guide; site lists Petzl as main sponsor; cord is Petzl; no disclosure | Confirmed | https://colinhaley.com/about-me-2/ "my main sponsors – Patagonia, Petzl, and Scarpa"; no guide certification claimed there. 2:00 "this is the Petzl Pur'Line"; no sponsor mention in transcript or description. (Optional: "主要贊助商之一", since three are listed.) |
| 485 | NZ Alpine Team 2026 video, pull-thick-rope demo from 0:22 | Confirmed | 0:05 "Kim Ladiges, mountain guide and mentor with the New Zealand Alpine team"; 0:47–1:07 prefers pulling fat rope; 1:40 pre-rigged second |
| 485 | 2:26–2:50: first at bottom keeps device on or ties ends, else second's strand slips | Confirmed | 2:35–2:49 "once I'm at the bottom, I need to make sure that the ends of the rope are not just free. Otherwise, the second person's going to have slippage. So, either I leave my belay device on ... or I tie the ends off to the anchor." (Key sentence starts 2:35; 2:26–2:35 is rigging.) |
| 473 | Kim Ladiges is IFMGA | Confirmed | Description "Team mentor and IFMGA guide Kim Ladiges" |

## Suggested replacements (non-Confirmed)

1. zh L376 / en: Remsberg credential
   - zh: `AMGA 講師團成員 Dale Remsberg 在 [AMGA 2025 年的影片](https://www.youtube.com/watch?v=MKfPKYSW7iE&t=104s)說，AMGA 和 AAC 都建議運攀固定點用下放。`
   - en: `In an [AMGA video from 2025](https://www.youtube.com/watch?v=MKfPKYSW7iE&t=104s), AMGA instructor team member Dale Remsberg says the AMGA and the AAC both recommend lowering off sport anchors.`

2. zh L383 / en: which end to untie
   - zh: `- **拉繩前，先解開不拉的那一端的止滑結**：沒有對接結可以提醒你拉哪一邊，要自己記住。會往上穿過鍊環的是不拉的那一端，它的結要先解開，否則會卡在鍊環上。`
   - en: `- **Before you pull, untie the stopper on the end you're not pulling**: there's no joining knot to remind you which side to pull, so remember it yourself. The end you don't pull is the one that goes up through the chains; untie it first, or the knot will jam.`

3. zh L395 / en: Vert pull sequence + "only" + certification
   - zh: `拉繩這一步，Mike Vert 這支多繩距垂降教學拍得很清楚。19:46 起，第二個人到站、離開繩子之後才開始拉。拉到繩尾時，先解開會往上穿過上方鍊環那一端的止滑結，免得卡住；繩子落下後再把繩尾拉上來重新打結。Mike Vert 自述攀岩 11 年、有戶外冒險文憑，沒有提到嚮導認證，說明欄推廣他的付費課程。片中 18:24–19:02 有一段是同伴還掛在繩上時就先解開止滑結，這一段不要學。`
   - en: `For pulling the rope, Mike Vert's multi-pitch rappelling class shows it clearly. From 19:46, once the second climber is at the station and off the rope, he starts pulling. As the end comes up, he unties the stopper on the end that will go up through the chains above, so it won't jam; once the rope falls, he pulls that end back up and re-ties it. Vert describes himself as having climbed for 11 years with a diploma in outdoor adventure; he mentions no guide certification, and the description promotes his paid course. Between 18:24 and 19:02 he unties a stopper knot while his partner is still on the rope; don't copy that part.`

4. zh L399 / en: Vert title (see metadata table).

5. zh L477 / en: Haley "both strands"
   - zh: `4:58 起是他的混合做法：在粗繩上緊鄰對接結打雙套結，扣一個有鎖鉤環，擋在環上。說明欄補充，他仍把兩股都放進垂降器。`
   - en: `From 4:58 he shows his hybrid: a clove hitch on the thick rope next to the joining knot, with a locking carabiner that blocks it at the ring. In the description he adds that he still puts both strands in his device.`

## zh/en mismatches in these ranges
None of substance found. Both versions carry the same timestamps, start values and credential statements, so every fix above applies to both.

# Part 2 — Videos, Methods 4–7 and rescue

# Video fact-check, part B: how-to-rappel lines 497–701 (zh + en)

Checked on 2026-10-24. Evidence sources:
- Metadata: fresh `yt-dlp --dump-json`, saved in `scratchpad/pv/vidsB/<id>.json`.
- Subtitles: the downloaded `.vtt` and `.txt` files in `.work/rappel-how-to/videos-*/`. These are raw YouTube captions, not research notes.
- Frames: Petzl and HowNOT2 frames extracted with ffmpeg, in `scratchpad/pv/vidsB/frames/`.
- Web pages: fetched with curl, plus a render in Chrome headless-shell for Petzl.
- Searches: Keenable keyless. I did not try Groundlane because it returned 401 earlier.

zh and en use the same video IDs, `start:` values and `&t=` values. I found no zh/en mismatch on any checked claim. The en text has the same issues as the zh text, so each fix below includes both languages.

## Non-Confirmed items

### 1. Petzl video "is embedded in the Petzl tech page" (zh 521 / en 521): **Contradicted**
- Claim: 這支片也嵌在上面那篇 Petzl 技術頁裡。 / The video is also embedded in Petzl's tech-tip page above.
- Evidence: I fetched https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI two ways: static (1.41 MB) and rendered by Chrome headless-shell (1.49 MB).
  - Neither version contains `UUrPgAP1mfw`, and neither contains any YouTube embed ID.
  - The only `<iframe>` with video is `player.vimeo.com/video/26151769`, and it sits inside a CSS comment (an HTML code sample), so it is not rendered.
  - The page's only YouTube link is to the channel `youtube.com/user/petzlcrew`.
- Suggested fix: delete the sentence.
  - zh: （刪除「這支片也嵌在上面那篇 Petzl 技術頁裡。」）
  - en: (delete "The video is also embedded in Petzl's tech-tip page above.")

### 2. Petzl "1:08 起解開自我確保出發" (zh 521 / en 521): **Misframed (timing)**
- Evidence from frames (the source is only 240×426, so treat this as indicative):
  - 1:02–1:03: his hand is working the red/yellow carabiner at the anchor, which looks like the self-anchor coming off.
  - 1:04–1:07: the GRIGRI is loaded, and the knot and locker are visible at the ring.
  - 1:09–1:11: he leans back over the edge.
  - 1:13: he is rappelling.
- Other timestamps in the same paragraph are Confirmed:
  - 0:22–0:26: tying the knot.
  - 0:28–0:30: takes a locker from the harness and clips it to the knot loop and rope.
  - 0:38–0:44: GRIGRI being installed.
  - 1:28.5–1:29.5: close-up of the knot and orange locker blocked against the ring.
- Suggested wording:
  - zh: 1:02 前後解開自我確保，1:08 起出發。
  - en: he unclips his tether around 1:02 and starts down from 1:08.

### 3. Ascentionism "一開頭就說……寧可原地等救援" (zh 625 / en 625): **Misframed**
- Evidence:
  - The opener (0:26–0:35) says "these rappel methods are severely outdated, they're difficult, they're painful and they're not super safe".
  - The rescue line comes at the end, 6:11–6:18: "or sitting tight and waiting for rescue, I would probably recommend that you sit tight and wait for rescue".
- Suggested wording:
  - zh: 主講者一開頭就說這些方法嚴重過時、會痛，也不太安全；片尾他還說，真要在這兩招和原地等救援之間選，他會建議等救援。
  - en: the presenter opens by saying these methods are severely outdated, painful and not very safe, and near the end says that if it came down to these or sitting tight for rescue, he'd recommend waiting for rescue.

### 4. AAI "AMGA 技術總監的意思大致是：不要做，也不要教" (zh 668 / en 668): **Misattributed (partly)**
- Evidence from `ricHt4aPJVk.en.vtt`:
  - ~3:04: professional guides don't use simul-rappelling.
  - ~3:23: "the American Mountain Guides Association technical director has more or less said don't teach this".
  - ~3:39, the presenter in his own voice: "I would say just don't do it, don't teach it, don't try it".
- So "don't do it" is the presenter's view, not the technical director's.
- Side note: Dale Remsberg, who demonstrates in the Outdoor Research simul video, was himself AMGA Technical Director (his bio at dale-remsberg.squarespace.com/overview).
- Suggested wording:
  - zh: American Alpine Institute 的影片 [3:04 起](…) 也提到，專業嚮導不用這招，AMGA 技術總監的意思大致是「不要教」；主講者自己的結論更直接：不要做、不要教、也不要試。
  - en: An American Alpine Institute video, [from 3:04](…), notes that professional guides don't use it and that the AMGA's technical director has more or less said not to teach it; the presenter's own verdict is blunter: don't do it, don't teach it, don't try it.

### 5. "AMGA 認證嚮導公司 Smile Mountain Guides" (zh 690 / en 690 "AMGA-accredited guide service"): **Contradicted**
- Evidence:
  - The AMGA accredited-business list at https://amga.com/about/accredited-businesses (fetched today, 32 businesses) does not include Smile Mountain Guides.
  - The old list at old.amga.com/accredited-businesses does not include it either.
  - smilemountainguides.com has no "accredited" wording anywhere I checked.
  - What the site does show: it runs AMGA SPI courses and exams, and its staff hold AMGA certifications (for example, Heidi Wirtz is a certified AMGA Rock Guide and an SPI Program Provider).
- Suggested wording:
  - zh: 科羅拉多嚮導公司 Smile Mountain Guides（團隊有 AMGA 認證嚮導，也開 AMGA SPI 課程）這支 2025 年的影片……
  - en: This 2025 video from Colorado guide service Smile Mountain Guides, whose team includes AMGA-certified guides and which runs AMGA SPI courses, …

### 6. JB Mountain Skills "頻道由器材店 Outside 支持" (zh 591 / en 591): **Misframed (minor)**
- Evidence:
  - The sponsorship is not on the channel or in the video description.
  - It appears on the footer of jbmountainskills.co.uk: "Proudly supported by:" with an `OUTSIDE LOGO` image linking to www.outside.co.uk.
  - The credential is Confirmed: the site says "Jez is a qualified climbing & mountaineering instructor … from his base in North Wales", and the YouTube About page says "Qualified … instructor based in Snowdonia, N Wales".
- Suggested wording:
  - zh: 他的網站標示由器材店 Outside 贊助。
  - en: his website lists the gear shop Outside as a supporter.

### 7. Shortened `title:` fields: **minor note (not wrong)**
These titles are cut-down versions of the actual titles. The channel and year are correct for all of them.

| Video | Actual title | `title:` field |
|---|---|---|
| UUrPgAP1mfw | "#Petzltips - Rappelling with a single rope and a pull cord." | same, minus the trailing period |
| aDVjeWyhXpE | ends in " \| EDELRID" | suffix dropped |
| mfIJVgtFsKM | "Munter Hitch / Italian Hitch. What is it and what are the different versions and tricks. #climbing" | shortened |
| zql0JvL3sAI | "Vom Standplatz zum Abseilen - Wie seilt man möglichst sicher ab?" | shortened |
| EM2XS8x0VKo | "… using the figure 8 - CANYONEEERS' TECH TUESDAY #2" | shortened |

Petzl's channel is named "Petzl Sport". Change these only if the house style needs exact titles.

## Confirmed items (evidence)

| zh line | Claim | Evidence |
|---|---|---|
| 525/533 etc. | Upload years | Petzl 2025-08-06; EDELRID 2025-09-29; Short Guys yAUSU 2026-08-17; hbJ1 2026-01-12; HowNOT2 TuqU 2025-01-22, Bshg 2021-12-08, JwSJ 2024-01-10; JB 2024-04-17; AlpenAcademy 2024-10-16; OR VjWz 2018-04-27; Ascentionism 2020-07-13; Sven 2022-11-22; AAI 2022-10-28; OR y_bH 2018-05-03; Schoen 2025-10-13; Smile 2025-09-23; Glen Young (channel "Skills for Climbing") 2024-04-12 |
| 529 | Edelrid 7:19: fig-8 blocked, locker back to loaded strand, load and check, then remove self-belay; uses PINCH | 7:19–7:39 "figure eight knot as a stopper… connect the carabiner… to the standing rope… I load the system, check… take out my self belay"; 7:26 "repel on the single rope using the pinches" |
| 529 | Edelrid 9:45: big ring, fig-8 jumps through, so clove hitch + locker | 9:45 "last repel"; 9:55–10:31 "eyelet is quite big… figure of eight knot jumps through… cloth hitch… and a locking carabiner… on the loaded strand" |
| 529 | Manufacturer channel; description lists own products | Description links only edelrid.com products |
| 559 | Short Guys timestamps 0:57 / 2:40 / 3:26 / 1:37 | Chapters 0:58 Z-Rappel, 2:40 Guide Mode, 3:27 Doubled Carabiners; transcript 1:37 "we typically don't want to attach our friction loop at our leg loop because it will fail if our leg raises, say if we flip over" |
| 559 | Jason taught for years at Colorado Mountain Club; affiliate disclosure | shortguysbetaworks.com/about: "Jason has taught these skills for years at the Colorado Mountain Club"; no guide certification listed; description: "may contain affiliate links" |
| 567 | HowNOT2 5:50: single-strand ATC, Z on leg loop, force measured | 5:50 "ways to add friction while you have an ATC… Z dragging between your leg and your clipping point"; 6:12 "a carabiner on my leg loop"; 6:36–6:52 load cell, 1.76 then 1.9 kN. Frame at 6:51 shows a "1.9KN!" overlay with the climber hanging from the tripod top (the anchor). The rig is visible only at low resolution. |
| 567 | HowNOT2 sells the tested cord | Description: "Beal Backup Line https://hownot2.com/products/back-up-line" plus "SHOP at hownot2.com" |
| 579 | HowNOT2 4:02: Munter brake hand up, unlike ATC | 4:02 "unlike an atc you don't hold your brake strand down… holding your brake strand up" |
| 591 | JB 13:45: two-strand Munter + prusik; twist overstated online; carabiner brake for many rappels | 13:45 "let's say… we need to abseil down"; 14:04 "doesn't twist it quite as much as the internet would have you believe"; 14:21 "multiple abseils… rather use some kind of carabiner brake"; 15:25–15:46 prusik on brake strands |
| 597 | Short Guys Munter 11:14: why not extended; brake on gate side can unscrew | 11:14 "fifth type of use, rappelling"; 11:20 "we won't typically see the Munter extended"; 12:35–12:42 "rope could twist in the direction that would unscrew a gate if I had the brake gate side" |
| 611 | AlpenAcademy 9:27: three-carabiner brake, pushes prusik, "much bumpier than tube" | 9:27 "Was kann ich machen, wenn mir jetzt mein Tuber hinuntergefallen ist?"; 9:40 three carabiners; 10:35 "Das ganze geht massiv ruppiger als … die Technik mit dem Tuber"; 10:48 "während ich gleichzeitig den Prusik nach unten schiebe" |
| 611 | Sponsor platform + shopping affiliate links | Description: Patreon / Kanalmitglied; tidd.ly and amzn.to links marked "*" |
| 611 | OR 2018 AMGA instructor; 3:24 carabiner brake; 2:27 Munter brake strand | 0:02 "I'm Olivia Race, a member of the AMGA instructor team"; 3:24 "a final option that's a variation of the carabiner brake… three locking carabiners"; 2:27–2:47 "double-stranded Munter… brake strand is on the spine… on the gate side it can… unscrew my gate" |
| 629 | Ascentionism start 26 | 0:26 "right off the bat… severely outdated" (see item 3 for the rescue line) |
| 643 | Sven 1:08 traditional climbing threading, then adds carabiner | 1:08 "the third way is… like it used to be in climbing"; 1:57 onward: passing the rope through the carabiner again (Vertaco etc.) |
| 643 | Self-described professional canyoning guide, French Alps | Description: "As a professional canyoning guide based in the French Alps"; no certifying body named |
| 643 | HowNOT2 15:05: canyon descenders evolved from fig-8; can't add friction mid-rappel | 15:02 "the canyon devices are based off of a figure 8 style"; 15:22 "you can't add friction as easily on the fly… nothing on the fly". The post's "沒辦法" is slightly stronger than "not as easily", but the speaker also says "nothing on the fly". The speaker is a guest, not the HowNOT2 host; the post doesn't say otherwise. |
| 658 | Ryan Tilley terminology | zRRnFfOUFKA ("let's talk about simul-rappelling", Ryan Tilley, 2024-08-21) 16:46–17:21: "counterbalance rappels are where one person is controlling the rappel but the other climber is on the other line… that's what we call a rescue technique… tandem rappel is when two people use the same device". ryantilleymountainguide.com/about: "AMGA Certified Rock Guide, AMGA Certified Alpine Guide". Short Guys' "Why Your Counterbalance Rappel Might Be Dangerous" (cX1ynq2RDYI) uses the name for simul-rappel, which supports "有些…叫 counterbalance rappel". |
| 670 | OR simul: Remsberg IFMGA; Race 2:13 loses counterweight; Gripped embed | 2:13 "go off of the end of his rope… all of a sudden I don't have a counterbalance anymore and I will pull the entire system down with me and we'll both be gone" ("his" means the female speaker, Race). Gripped page HTML contains `youtube.com/embed/y_bHtt9iWPA`. Remsberg is IFMGA (his bio, Sterling, SJMG). Race is IFMGA (amga.com instructor-team page "IFMGA / American Mountain Guide"; mountainschool.com), so en "IFMGA guides Dale Remsberg and Olivia Race" is also correct. |
| 684 | Eddie Schoen IFMGA + AMGA board; unconscious partner at mid station; 3:36 weight transfer | eddieschoen.com/about "IFMGA Licensed American Mountain Guide"; amga.com/about/board "Eddie joined the AMGA Board and became Treasurer in 2024"; 0:01 "intermediate rappel… knocked out, incapacitated… attached to the anchor"; 3:36 "now we're going to transfer the load or the weight of our partner onto this next rappel system" |
| 690 | Smile 0:18 transition; "add security before taking away"; presenter admits complex | 0:18 "going to transition to a counterbalance rappel… we add security before taking security away"; 2:56 "It's getting complicated." |
| 690 | Glen Young AMGA Rock Guide; 5:58 avoid counterbalance ascent | skillsforclimbing.com: "Glen Young… AMGA Certified Rock Guide, AMGA Assistant Alpine Guide". 5:58–6:16: he might not want to add load by ascending, "two bodies… falling", "going to try to avoid that". 6:33: "try to avoid counterbalance ascending, um, at all costs". The 5:58 start is fine. |

# Part 3 — Accidents

# Fact check: accident/incident claims in 2026-10-24-how-to-rappel(.md / -en.md)

Checked 2026-10-24. Sources re-fetched with curl + browser UA (all HTTP 200) and stripped to text in
`/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/39d19c1b-7f31-43a9-b122-c20bbbf25f26/scratchpad/pv/acc/*.txt`.
Line numbers refer to the zh file; the en twin uses the same line numbers (verified line-for-line for every row below).
The only source that could not be opened: the NZ Alpine Team YouTube transcript (yt-dlp hit 429, timedtext came back empty). That affects only row N2.

Verdict key: C = Confirmed, M = Misframed (facts right, but stated with more certainty or in a broader frame than the source), MA = Misattributed, U = Unverifiable, O = Outdated.

---

## A. Frontmatter (tldr + glossary)

| # | Line | Claim (zh) | Verdict | Source quote | URL |
|---|---|---|---|---|---|
| T1 | 9 | 垂降事故的致死比例比一般攀登事故高 | C | "rappel errors are one of the deadliest factors within the top 10 most common factors for all accidents… tagged in 251 incidents, and 76 of those, nearly 30 percent, were deadly." (The roughly 20% all-accident baseline in line 65 is the post's own calculation from the author's data. The article does not state it.) | https://rockandice.com/climbing-accidents/30-years-of-climbing-accident-data-an-investigative-report |
| T2 | 9 | 近年 AAC 收錄的致死案例又多了垂降器只穿到一股或裝錯股 | C | Stanley Headwall 2024 (fatal, "only the blue rope threaded through his device"), Red Rock 2025 (fatal, "attached her Grigri to the 'pull' strand"), Auburn 2022 (fatal, single strand) | see rows below |
| G1 | 26 | AAC 分析 2024 年 Stanley Headwall 垂降死亡事故後，建議更廣泛採用疊式垂降 | C | "rappelling using the stacked rappel method is a solution. It is common in guiding practice and deserves broader adoption in the climbing community." (end of 2024, Dec 26) | https://americanalpineclub.org/news/2026/1/20/the-prescriptionthe-stacked-rappel |
| G2 | 30 | 2025 年 Red Rock 死亡事故，就是 GRIGRI 裝在沒被擋住的拉繩那股 | C | "she had attached her Grigri to the 'pull' strand rather than the 'rappel' strand." Year: Climb Year 2025, Publication 2026. (The source contradicts itself: the photo caption says "November 2025" and the body says "On January 18". The year 2025 holds either way.) | https://publications.americanalpineclub.org/articles/13201217659 |
| G3 | 34 | 2026 年 7 月挪威一起死亡事故，就是單繩加細拉繩兩股垂降時發生繩結移位 | C | "In late July… 9.6mm Edelrid dynamic rope and… 6mm Petzl Pur'line tag line… the end of the tag line went through their ATC and they sustained a fatal 100-meter fall." | https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel |
| G4 | 38 | AAC 指出，同時垂降讓兩人互相依賴，任一方出錯，兩人都會承擔後果 | C | "the counterweight arrangement of simul-rappelling makes the climbers interdependent. If either climber loses control, makes a mistake in rigging, or if either side of the counterweighted rope is severed, both climbers suffer the consequences" | https://americanalpineclub.org/news/2018/11/30/simul-rappelling |
| G5 | 34–38 | Glossary definitions for 擋繩垂降, 繩結移位 and 同時垂降 | C | Match the Red Rock "Reepschnur… knot, backed up with a carabiner, blocking one side", the Climbing report "tag line moved through the belay device faster… joining knot… moving away from the anchor point", and Gripped/AAC "when one climber unweights the rope prematurely, the other will drop". | as above |

## B. Stanley Headwall (cited earlier in the post; checked as instructed)

| # | Line | Claim | Verdict | Source quote |
|---|---|---|---|---|
| S1 | 72 | AAC 在〈The Prescription—The Stacked Rappel〉分析，原因**就是**垂降器只扣到一股繩 | M (overcertain) | "It **appears** that Dave's accident was caused by an improperly threaded rappel device." "Dave was found with only the blue rope threaded through his device and backup." Berg also lists an alternative: "ATC-Guide was properly threaded but prusik backup was attached to the blue rope only… The stopper knot was not present." Location ✓ ("British Columbia, Kootenay Park and Banff National Park, Stanley Headwall"), date ✓ (Dec 26, 2024), and device ✓ (ATC-Guide). |
| S2 | 227 (outside the requested range, noted only) | AAC **確認**…flat overhand…對接結不是事故原因 | MA (minor) | The statement comes from Berg, the partner: "It wasn't until reaching the ground the next morning that it became clear that the knot was not the cause." Knot ✓: "a single flat overhand knot". The AAC published his account but did not make the finding itself. |
| S3 | 315, 427 | AAC: simplest fix is a partner or function check; the stacked rappel deserves wider use | C | "The simple solution to that is a basic partner or function check. Alternately, … stacked rappel…" |

S1 replacement:
- zh: `AAC 在[〈The Prescription—The Stacked Rappel〉](…)刊出的分析認為，最可能的原因是垂降器沒穿好：他被找到時，垂降器和備份上只穿著一股繩。`
- en: `The analysis the AAC published in [The Prescription—The Stacked Rappel](…) points to an improperly threaded device as the likely cause: he was found with only one strand through his device and backup.`

S2 replacement (if line 227 is touched):
- zh: `反過來，同伴 Alik Berg 在 AAC 刊出的報告裡說，那起事故用的是 flat overhand，而**對接結不是事故原因**，垂降器只穿到一股繩才是最可能的原因。`
- en: `Conversely, Alik Berg, the partner, wrote in the report the AAC published that the joining knot was a flat overhand and **the knot was not the cause**; a device on one strand most likely was.`

## C. Double-rope / tag-line section (lines 381–485)

| # | Line | Claim | Verdict | Source quote | URL |
|---|---|---|---|---|---|
| D1 | 381 | 2024 Devils Tower fatality: a cut-down rope with no new middle mark, ends unequal | C, hedge recommended | "According to comments on the accident that appeared on MountainProject.com, Porter had cut his 70-meter rope down to 66 meters and **apparently** there was no middle mark. At the end of the rappel, the rope ends were uneven. He rappelled off the short end." Climb Year 2024, Pub 2025. | https://publications.americanalpineclub.org/articles/13201217342 |
| N1 | 471 | Climbing 2026 年 9 月報導；同年 7 月挪威；兩人都用 ATC 兩股；結一路移位；細繩尾端穿出垂降器；墜落身亡；中點放在粗繩那側，結很可能會被固定點擋住 | C | datePublished 2026-09-03. "In late July… Norway." "Climber A rappelled first using a tubular belay device—an ATC" / "Climber B started rapping quickly on an ATC and a prusik." "the end of the tag line went through their ATC and they sustained a fatal 100-meter fall." "If the midpoint had been set on the dynamic line, the joining knot likely would have been blocked by the master point knot in the cord." | https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel |
| N1b | 842 (refs) | Reference title "Death of 27-year-old climber exposes danger of knot migration during rappel" | O / U | The "27-year-old" appears only in the URL slug. The live headline (og:title) is "This Rappel Mistake Can Be Fatal. Why Don't More Climbers Know About It?" The body gives no age, and per the editor's note of Sep 9 the name was removed at the family's request. The post body never claims the age, so only the reference title needs changing. | same |
| N2 | 473 | Kim Ladiges (NZ Alpine Team, IFMGA) pulls the thick rope because it pulls more easily and leaves a dynamic rope to climb if it sticks; second pre-rigs both strands; first leaves device on or fixes the ends | U (this pass) + attribution risk | The video description confirms "Team mentor and IFMGA guide Kim Ladiges talks us through his system for rappelling with a tag line." The transcript was blocked here (429). The `.work` notes quote 0:37 "anytime there's going to be a hard pull… put it through with the lead line… you end up with the lead line to solve your issues" and 2:26 "either I leave my belay device on… or I tie the ends off". Those notes support the claim but are not verification. **Risk:** Ladiges is not in the Climbing article. The near-identical reasons in the Climbing article belong to Gus Landefeld, a friend of the deceased: "It's really nice to be able to pull your dynamic lead line… if it does get stuck, you can lead back up on your dynamic rope. It's also easier to pull." The paragraph has no inline link, so readers can't tell which source each part comes from. | https://www.youtube.com/watch?v=lC1PIOGWsZM |
| N3 | 473 | Muskett (UK IFMGA) calls "middle on the cord, pull the dynamic rope" inherently unsafe | C | "British IFMGA mountain guide Calum Muskett describes setting the midpoint on the tag line and pulling the dynamic rope as 'inherently unsafe' due to the knot migration risk, and advises against this. 'Always fix the dynamic rope and use the tag line to retrieve to mitigate the risk of rope slippage… I would not recommend any other way of rappelling with a tag line.'" | Climbing (N1 URL) |
| P1 | 475 | 2026 Pingora: 4 mm cord pulling the main rope; rope stuck; static cord can't be led on; benighted waiting for rescue | C | "an Edelrid 4mm" (Aug 20, 2026); "felt the rope become lodged"; "their 4mm static tagline, which isn't rated to hold a fall"; Lovell: "a static tagline isn't appropriate to lead on"; "LSAR told the climbers to hunker down for the night". Also: they were using "a Reepschnur carabiner block", not a two-strand ATC setup. The post doesn't contradict this, but it sits in the two-strand paragraph. datePublished 2026-09-16. | https://climbing.com/news/a-climber-and-his-rescuer-share-takeaways-after-getting-benighted-on-pingora-peak |

D1 optional hedge:
- zh: `AAC 收錄的 [2024 年 Devils Tower 死亡事故](…)，據 Mountain Project 上的留言，他把繩子剪短過，似乎沒有重新做中點標記，最後兩端不等長。`
- en: `In the [2024 Devils Tower fatality](…) recorded by the AAC, comments on Mountain Project say he had cut his rope shorter and apparently had no new middle mark; the ends came out uneven.`

N1b replacement (reference list line 842):
- zh: `- [Climbing：This Rappel Mistake Can Be Fatal. Why Don't More Climbers Know About It?（2026-09）](https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel)`
- en: `- [Climbing: This Rappel Mistake Can Be Fatal. Why Don't More Climbers Know About It? (Sept 2026)](https://climbing.com/videos/death-of-27-year-old-climber-exposes-danger-of-knot-migration-during-rappel)`

N2 replacement (adds an inline source and keeps Ladiges's claims tied to his video; re-check the 0:37 transcript before publishing):
- zh: `**拉粗繩派是少數做法**。紐西蘭 Alpine Team 的 IFMGA 嚮導 Kim Ladiges 在 [2026 年的影片 0:37 起](https://www.youtube.com/watch?v=lC1PIOGWsZM&t=37s)說，難拉的時候他會拉粗繩，出問題時手上才有動力繩可以處理。前提是第二人先把垂降器預掛在兩股上，第一人到底後垂降器留在繩上，或把繩尾固定在站上。另一方面，[Climbing 那篇報導](…)裡，英國 IFMGA 嚮導 Calum Muskett 把「中點放在細繩、拉粗繩」稱為本質上不安全，建議一律固定粗繩、用細繩回收。`
- en: `**Pulling the thick rope is a minority approach**. In a [2026 video from 0:37](https://www.youtube.com/watch?v=lC1PIOGWsZM&t=37s), IFMGA guide Kim Ladiges of the New Zealand Alpine Team says that when the pull will be hard he pulls the dynamic rope, so that if something goes wrong he's holding the rope that can fix it. That only works if the second climber pre-rigs a device on both strands, and the first climber keeps their device on the rope at the bottom or ties the ends to the anchor. On the other side, in the [Climbing report](…), British IFMGA guide Calum Muskett called putting the middle on the cord and pulling the dynamic rope inherently unsafe, and advises always fixing the dynamic rope and retrieving with the cord.`

## D. GRIGRI / blocked rappel (lines 513–517)

| # | Line | Claim | Verdict | Source quote | URL |
|---|---|---|---|---|---|
| R0 | 513 | 最常見的致命錯誤：裝錯股。AAC 2026 年版事故報告收了三起 | M (minor) | All three are Publication Year 2026 ✓. But Palisades was not a wrong-strand error: "The immediate cause of this accident was that a rope was not anchored." Two of the three were also non-fatal (Psycho: "I wasn't even hurt"; Palisades: "discharged that same morning with no major injuries"). | — |
| R1 | 515 | Red Rock 2025: GRIGRI on the pull strand; rope pulled through the anchor; fell past her partner; after sunset, cold, rushed; AAC: slow down | C (minor: "趕時間" is an inference) | "When she weighted the device, the rope pulled through the anchor and she fell past her partner, who had already rappelled the pitch." "approximately 5:30 p.m.—roughly a half hour after sunset. Temperatures were around 45°F and dropping." "The climbers were **almost certainly** in a hurry." "When conditions deteriorate and pressure mounts, slowing down is the correct response" | https://publications.americanalpineclub.org/articles/13201217659 |
| R2 | 516 | Psycho Tower 2025 near miss: GRIGRI+ on the pull strand; only a tug; felt resistance, untethered; fell; caught the hanging tail; lesson: full weight; waist-high anchor with a ledge | C | "I threaded the rope in front of me into my Grigri… gave the 'rappel side' a tug. There was enough friction… so I untethered, leaned back—and instantly toppled backward off the ledge." "snagged the tail side with my bare right hand." "Had this been a hanging anchor or been positioned at head height, I would have fully weighted the system… with the anchor at waist height, it was easy to skip that step." Editor: "in this case, a Grigri+". Climb Year 2025. | https://publications.americanalpineclub.org/articles/13201217645 |
| R3 | 517 | Palisades 2024: about 11 years old; ATC on a single strand; strand not fixed; fireman's belay couldn't stop it; AAC: a knot clipped to the anchor would have prevented it | C | "The girl, around 11 years old"; "a single strand of 11mm or 12mm static line via an ATC-type device"; "someone had been providing a fireman's belay, but this was of no help given that the rope had simply pulled through the anchor"; "The fix was one simple step: a knot clipped directly to the anchor." (Sources: Dylan Addis, MD, and the Editors.) Nov 16, 2024. | https://publications.americanalpineclub.org/articles/13201217622 |
| Q5 | ~741 | Q5 answer: 2025 Red Rock was a pull-strand mistake | C | same as R1 | — |

R0 replacement:
- zh: `**最常見的致命錯誤：裝錯股、或那股根本沒固定**。AAC 2026 年版事故報告收了三起單股垂降、繩子一受力就整條從固定點被拉過去的案例，其中一起致死：`
- en: `**The most common fatal mistake: the wrong strand, or a strand that isn't fixed at all**. The 2026 edition of the AAC's accident reports includes three single-strand rappels where the rope pulled straight through the anchor the moment it was weighted, one of them fatal:`

R1 optional tweak: zh `當時日落後、天冷，兩人幾乎可以確定在趕時間。` / en `It was after sunset and cold, and the party was almost certainly in a hurry.`

## E. Fixed single rope (lines 551–557)

| # | Line | Claim | Verdict | Source quote | URL |
|---|---|---|---|---|---|
| F1 | 551 | 1986 Sedona: less rope below means less friction; too tight at the start, too fast near the bottom | C | "as the rappeller descends, the friction caused by the balance of rope hanging below is always diminishing… he commented about having too much friction… By the time he was nearing the bottom, he was apparently unable to deal with the opposite problem." (Oct 9, 1986; Reed Thorne, Sedona Fire Dept, in ANAC 1987) | https://publications.americanalpineclub.org/articles/13198703202 |
| F2 | 555 | Auburn 2022: rappelled after a TR self-belay; **以為**繩子還綁著，其實已解開；只穿一股 | M (the post states a hypothesis as fact) | "We **believe** the use of a single strand in her top-rope system **may have** distracted her into believing the rope was fixed, even when she had untied it from the anchor." Editor's Note: "It is possible X threaded the rope through the chain(s) to perform a doubled-rope rappel and mistakenly clipped only one strand." Climb Year 2022 ✓. "the rope threaded through one slot" ✓. | https://publications.americanalpineclub.org/articles/13201216604 |
| F3 | 556 | Vermont 2023: device on the long tail of the fixed line's fig-8; slid about 30 m | C | "Alden Pellett mistakenly attached his rappel device to the extra-long tail in his figure 8 knot… The result was a 100-foot sliding fall." Climb Year 2023. | https://publications.americanalpineclub.org/articles/13201217172 |
| F4 | 557 | RRG 2019: device on its low-friction side; autoblock possibly gripped by the brake hand **而沒有作用** / "so it didn't engage"; AAC: a single strand needs more friction and more care with backups | M (minor: "didn't engage" is wrong) | "the rappel device was unintenionally loaded using the low-friction side." "Burns on the rappeller's autoblock cord suggest his backup engaged the rope, but either the friction was insufficient… or the rappeller inadvertently grabbed the autoblock with his brake hand and **partially disengaged** it." "Rappelling a single strand of rope requires more friction and greater care with backups than rappelling on two strands." Climb Year 2019. (The report's source is Wolfe County SAR, published in ANAC.) | https://publications.americanalpineclub.org/articles/13201215612 |

F2 replacement:
- zh: `- [2022 年 Auburn 死亡事故](…)：頂繩自我確保之後改成垂降，只穿了一股就下去，繩子其實已經從固定點解開。現場攀登者推測她以為繩子還綁著；AAC 編者也提出另一種可能：她原本要雙股垂降，卻只扣到一股。`
- en: `- [Auburn fatality (2022)](…): switching from top-rope soloing to rappelling, she went down on one strand of a rope that had already been untied from the anchor. Climbers at the scene believe she thought it was still tied; the AAC editors add that she may instead have meant to rappel on two strands and clipped only one.`

F4 replacement:
- zh: `- [2019 年 Red River Gorge 事故](…)：垂降器被裝成低摩擦那一面；autoblock 有咬到繩，但可能被制動手抓住，沒有完全發揮作用。AAC 的結論是：單股垂降比雙股需要更多摩擦，也更要注意備份。`
- en: `- [Red River Gorge accident (2019)](…): the device was set up on its low-friction side; the autoblock did grab, but the brake hand may have been clamping it, so it never fully engaged. The AAC's conclusion: a single strand needs more friction and more care with backups than two.`

## F. Munter (line 589)

| # | Line | Claim | Verdict | Source quote | URL |
|---|---|---|---|---|---|
| M1 | 589 | Ouray 2024: chose no prusik; fireman's belay from below; turned to look; Munter crept to the gate, rolled over it, unscrewed the lock, came off; about 24 m free fall; stopped because he kept the brake; would use a twin-gate or auto-locking carabiner next time | C | "We decided not to use a prusik backup… Jim would provide a fireman's belay from below." "twisting my body to the right to see over my shoulder… the Munter hitch crept leftward toward the carabiner gate. The rope rolled over the gate (unscrewing it in the process), popped it open, and undid itself from the carabiner." "an 80-foot free fall… Because I hadn't released the brake strand, I was able to wrap my arm in the rope and arrest my fall." "If I use a Munter to rappel again, I'll use a twin-gate locking carabiner or an autolocking carabiner." Colorado, Ouray; Climb Year 2024. | https://publications.americanalpineclub.org/articles/13201217271 |

## G. Simul-rappel (line 668)

| # | Line | Claim | Verdict | Source quote | URL |
|---|---|---|---|---|---|
| SR1 | 668 | AAC: interdependent; if either loses control, mis-rigs, or a strand is cut, both suffer | C | see G4 (the AAC page URL is dated 2018/11/30) | https://americanalpineclub.org/news/2018/11/30/simul-rappelling |
| SR2 | 668 | Gobright 2019, El Potrero Chico: simul-rappelling; his end too short; no stopper knot; slid off the end; AAC: a stopper knot very likely would have prevented it | C | "died in a rappelling accident at El Potrero Chico on November 27… they planned to simul-rappel"; "the strand on Gobright's side was too short to reach the ledge… he did not see the problem until the rope end passed through his rappel device." "If these two climbers had tied stopper knots, it's very unlikely this fatal accident would have occurred." | https://publications.americanalpineclub.org/articles/13201215647 |
| SR3 | 668 | Gripped 2020: emergencies only; arriving together is actually slower | C | Subhead: "The only reason you should need to do it is in the case of an emergency"; "Having two climbers arrive at an anchor at the same time is actually slower than if one arrives and begins the process…" datePublished 2020-03-13. | https://gripped.com/profiles/simul-rappelling-is-dangerous-go-one-at-a-time/ |

## H. Practice questions 5–6

| # | Line | Claim | Verdict | Note |
|---|---|---|---|---|
| Q5 | ~741 | Red Rock 2025 was a pull-strand mistake | C | R1 |
| Q6 | ~749 | With the knot on the thick-rope side it migrates; Norway 2026 happened this way | C | Climbing: midpoint moved to the tag-line side (the knot ended up on the dynamic-rope side) "before or during Climber B's rappel", which is consistent with the post. Whether Climber B moved it on purpose is unknown, and the post doesn't claim either way. |

## I. zh/en mismatches

None material. The en twin copies each zh claim, including the same over-certain wording in S1 ("traces it to"), F2 ("she believed"), F4 ("so it didn't engage") and R0 ("three cases" under "wrong strand"). The en tldr's "kill a larger share of the people involved than climbing accidents overall" matches zh line 9.

# Part 4 — Manufacturer and professional sources

# Fact-check: manufacturer and professional-source claims (how-to-rappel, zh + en)

Checked 2026-10-24. Raw downloads and text extracts are in `/private/tmp/claude-501/-Users-xiaoxu-Projects-quidproquo/39d19c1b-7f31-43a9-b122-c20bbbf25f26/scratchpad/pv/mfr/`.
Line numbers are for the zh file. The en file uses the same line numbers.
Out of scope, not checked: accident reports (AAC, Climbing 2026 Norway and Pingora), video timestamps, the UIAA knot claim on line 425, Gripped, and the Ladiges and Muskett quotes.

## Non-Confirmed items

### N1. Line 469: Beal Back Up Line diameter. Verdict: **Contradicted** (also misframed)
- Post (zh): 「也允許主繩和它的 5 mm 細繩兩股一起垂降，搭配 Beal 的垂降器與 Machard 摩擦套結」. The en version says the same ("their 5 mm line").
- Source: the technical table in XNOTICE.BACK_UP_202607 gives "Diameter 5.5mm". In the instructions text, the 5 mm figure belongs to the Machard cord, not the line: "In case of abseiling with 1 strand of single rope joined to one strand of Back Up line, it's recommended to use the Beal AIRFORCE 3 in conjunction with a Machard knot of 5 mm as Beal Jammy." The notice also says: "The Back Up Line is a static rope only suitable for abseiling and hauling specifically for crevasse rescue."
- URL: https://www.beal-planet.com/cdn/shop/files/BEAL_-_XNOTICE.BACK_UP_202607_-_Notice_livret_100x100.pdf
- Replacement (zh): 「[Beal 2026 年的 Back Up Line 說明書](…)也允許單繩和 5.5 mm 的 Back Up Line 各一股一起垂降，建議搭配 Beal AIRFORCE 3 垂降器，加 5 mm 的 Machard 摩擦套結。」
- Replacement (en): "[Beal's 2026 Back Up Line instructions](…) also allow rappelling on one strand of single rope joined to one strand of the 5.5 mm Back Up Line, recommending a Beal AIRFORCE 3 with a 5 mm Machard friction hitch."

### N2. Line 548: REVERSO single-strand backup "SHUNT 或摩擦套結". Verdict: **Outdated** (no link either)
- The current REVERSO notice is D0017100E (310326), dated 31 Mar 2026. Section 8 reads: "Use a rappel backup system with the REVERSO (e.g. a friction hitch)." SHUNT is no longer named. (Per the .work notes, the older English D0017100D (200918) did name it: "(SHUNT or friction hitch)".)
- The single-strand permission comes from the tech tip, not the notice: "the rappel is done only on the single rope with the GRIGRI or REVERSO (with backup device or friction hitch)."
- URLs: https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope ; https://petzl.com/on/demandware.static/-/Sites-petzl-master-catalog/default/dw3ddbef35/media/product/technical-notice-REVERSO-5_068bK00000nDYPVQA4.pdf
- Replacement (zh): 「[Petzl](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)：REVERSO 可以單股垂降，但要加備份（備份裝置或摩擦套結）。」
- Replacement (en): "[Petzl](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope): the REVERSO can rappel a single strand with a backup (a backup device or friction hitch)."

### N3. Line 547: BD ATC-Guide link. Verdict: **Outdated** (the text itself is Confirmed)
- The rev C link (blackdiamond-cms.zaneray.com) fails. curl gets LibreSSL SSL_ERROR_SYSCALL and r.jina.ai gets ERR_CONNECTION_CLOSED. The current BD product page links rev D (PDF dated July 2025).
- Rev D quote: "Use the ATC-Guide in the HFM when you want more holding power—typically when using small diameter ropes, when rappelling a single line or when belaying a climber working a route."
- Replacement URL: https://s3.us-west-2.amazonaws.com/catsy.865/M10798_D_ATC-Guide_IS-WEB.pdf (linked from https://blackdiamondequipment.com/en_US/product/atc-guide-belay-rappel-device)
- Optional softer wording, since BD says "typically". zh: 「單股垂降時建議用高摩擦模式。」 en: "recommends high-friction mode when rappelling a single line."

### N4. Lines 545 and 549: "三家都沒有禁止…但都有條件" and the Edelrid link. Verdict: **Misframed** (minor) / link Outdated
- The Edelrid manual never mentions single-strand rappelling. Its condition covers all abseiling: "13 Abseiling may be done in both the brake-assisted and the manual mode. Attention: For abseiling and lowering secure the rope ends with stop knots and secure the belay device with a blocking [knot]." The REVERSO notice also never mentions single strand. That condition comes only from the Petzl tech tip.
- chalkr.de is a third-party mirror. The official copy (PDF dated Feb 2026) has identical text: https://avs.edelrid.com/images/attribut/5XXXX_GAL_GIGAJUL_ANSICHT.pdf
- Replacement for 545 (zh): 「**廠商怎麼說**：三家都沒有禁止管狀垂降器單股垂降，但都要求加摩擦或備份。」 (en): "**What manufacturers say**: none of the three forbids single-strand rappelling on a tube device, but each asks for more friction or a backup."
- Replacement for 549 (zh): 「[Edelrid GIGA JUL 說明書](https://avs.edelrid.com/images/attribut/5XXXX_GAL_GIGAJUL_ANSICHT.pdf)：沒有特別講單股；所有垂降都要繩尾打結，並加摩擦套結備份。」 (en): "[Edelrid's GIGA JUL instructions](…official URL…): nothing specific on single strands; for any rappel, knot the rope ends and back the device up with a friction hitch."

### N5. Line 504 (GRIGRI step 2), also the en twin: "防止結穿過環". Verdict: **Misframed**
- Petzl says the carabiner is there to stop the fall if the knot does go through, not to stop the knot going through: "If the knot goes through the ring, the fall will be stopped, but rope retrieval will be complicated." and "There is a risk of the knot passing through the ring, even if the block seems secure." Line 456 already describes this correctly.
- URL: https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope
- Replacement (zh): 「2. 用有鎖鉤環把結扣回垂降的那股。萬一結穿過環，鉤環會把繩子擋住。」
- Replacement (en): "2. Clip a locking carabiner from the knot back to the rappel strand, so that if the knot pulls through the ring, the carabiner still holds the rope."

### N6. Line 499: "cannot do two strands" attributed to the GRIGRI/NEOX page. Verdict: **Misattributed** (minor)
- The GRIGRI/NEOX page says only: "GRIGRI and NEOX enable rappelling on a single rope: on a retrievable system with one strand blocked, or on a fixed rope." The explicit "not possible to rappel on the two strands" is on the single-rope page: "With a GRIGRI, it is not possible to rappel on the two strands coming out of the anchor."
- Replacement (zh): 「…也可以在固定繩上垂降。[單繩多繩距垂降那篇](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope)則寫明，GRIGRI 不能像管狀垂降器那樣兩股一起下。」
- Replacement (en): "…or on a fixed rope. [Its single-rope multi-pitch tip](https://petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope) adds that a GRIGRI can't go down two strands like a tube device."

### N7. Line 585: "制動手往上，不是往下". Verdict: **Misframed** (overstated)
- Alpine Savvy (2026-09-25): "Yes, you do get maximum braking with the brake strand held out in front of you parallel with the load strand. However, with the brake strand 180° opposite the load strand, friction is reduced by about 25%. In most cases, this is still an adequate amount of friction… The hitch doesn't somehow magically fail if you decide to hold your brake strand… down by your hip."
- URL: https://alpinesavvy.com/bonus-articles/munter-hitch-brake-strand-does-it-need-to-be-parallel
- Replacement (zh): 「**制動手往上摩擦最大**：Munter 在兩股平行時摩擦最大，跟 ATC 的制動手往下相反。制動端放到腰側，摩擦約少 25%，多數情況仍夠用（[Alpine Savvy](…)）。[HowNOT2 2021 年的影片 4:02](…)特別點出這個差別。」
- Replacement (en): "**Brake hand up for maximum friction**: a Munter brakes hardest with the strands parallel, the opposite of an ATC. With the brake strand down at your hip it loses about 25% of its friction, which is usually still enough ([Alpine Savvy](…)). [HowNOT2 points out the difference at 4:02…](…)."

### N8. Line 623: SAC 1994 attribution of the extra detail. Verdict: **Misattributed** (partly)
- Confirmed from SAC: "Abseilen im Dülfersitz war während Jahrzehnten die Standardmethode… war deren Handhabung heikel und fehleranfällig, denn die Sitz- und Bremsfunktionen waren nur mit dem um Gesäss und Schultern geschlungenen Seil und der daraus resultierenden Körperreibung gewährleistet." Also: "Diese Methode wurde zum Standard und vermochte sich bis weit in die siebziger Jahre hinein zu halten." The year 1994 is confirmed («Die Alpen» 1994), and the 1970s claim does come from SAC.
- Not in SAC: "會燒傷皮膚，制動手一鬆就墜落" (SAC mentions only "durchgescheuerte Hosenboden", i.e. worn-through trouser seats) and "現代課程已經不教" (unsourced).
- Replacement (zh): 「這種方法一直用到 1970 年代。[SAC 1994 年的文章](…)形容它操作棘手、容易出錯，因為坐姿和制動全靠繞在臀部和肩膀上的繩子跟身體的摩擦。它還會磨破褲子、燒傷皮膚，制動手一鬆就墜落。」 (The last sentence becomes the author's own statement.)
- Replacement (en): "It was used well into the 1970s. A [1994 SAC article](…) (in German) calls it tricky and error-prone, because seating and braking depend entirely on the rope's friction around your hips and shoulders. It also wears through clothing and burns skin, and if the brake hand lets go you fall."

### N9. Line 659 (table): simul-rappel "專業來源都說只限緊急". Verdict: **Misframed**
- The AAC 2018 piece, which the post cites on line 668, does not say "emergency only". It says the technique "results in a measurable efficiency" and "should only be selectively and carefully deployed", and it gives principles to justify it. Gripped 2020 is the source that says emergencies only.
- URL: https://americanalpineclub.org/news/2018/11/30/simul-rappelling
- Replacement (zh): 「想省時間；多數專業來源建議只在緊急時用」
- Replacement (en): "Saving time; most professional sources advise emergencies only"

### N10. Line 680: bergundsteigen 2025 "要求先在接近地面…反覆練習". Verdict: **Misframed** (strength of the verb)
- Source: "Zum Training empfehlen wir, die Techniken erst einmal in Bodennähe und an soliden Fixpunkten (Bohrhaken) intensiv zu üben." (empfehlen = recommend)
- URL: https://www.bergundsteigen.com/artikel/bergfuehrerserie-behelfsmaessige-kameradenrettung/ (published 2025-05-07)
- Replacement (zh): 「…建議先在接近地面、有可靠固定點（如岩釘）的地方反覆練習。」 (en): "…recommends practising repeatedly close to the ground on solid anchors (bolts) first."

### N11. Glossary 繩結移位 (zh line ~34 / en "Knot migration"). Verdict: **Misframed** (a condition is missing)
- Semmel (bergundsteigen): "the thinner rope in the tube is subject to less braking force. As a result, it slides upwards towards the abseil station, while the thick rope is slowly pulled off… This happens until either the connecting knot touches the abseil ring or – if the connecting knot is on the side of the thicker strand – until the rope rests on the rock… Slipping is avoided if the knot is placed on the side of the thin rope and rests against the abseil eye."
- As written, the glossary implies migration happens whenever the diameters differ. It only happens with the knot on the thick-rope side.
- Replacement (zh): 「粗細不同的兩條繩一起放進垂降器、對接結又在粗繩那一側時，細繩跑得比較快，結會慢慢被拉離垂降環，細繩那端越來越短，最後可能從垂降器滑出。結放在細繩側、抵住環就不會發生。」
- Replacement (en): "When ropes of different diameters run through a device together and the joining knot sits on the thicker rope's side, the thinner one slides faster, so the knot creeps away from the ring and the thin end gets shorter until it can come out of the device. With the knot on the thin side against the ring, it can't happen."

### N12. Lines 589 and 639: Confirmed but uncited (add links)
- Line 589: Petzl, rope or rock unlocking the sleeve. Confirmed: "The rock, the rope, or an item of equipment rubs against and unlocks the sleeve, and pushes on the gate in the direction of opening." https://petzl.com/US/en/Sport/Examples-of-dangerous-carabiner-loading- . The locking-carabiner notice M0053500F (220125) adds: "Avoid any pressure or rubbing that could unlock the gate."
- Line 639, DMM: Confirmed. The DMM Braking Devices IFU, which covers the Figure of 8, says in §12.1: "We recommend the use the DMM Belay Master carabiner for belaying and abseiling." https://assets.dmmwales.com/download/73/ . The UIAA 2000 PDF also names it: "The DMM Belaymaster is one such device."
- Line 639, Pit Schubert: Confirmed in SAC «Die Alpen» 1998/10, a reprint of DAV Mitteilungen 6/97: "Abseilen: Verwendung von zwei Karabinern Hier sind zwei parallel und gegenläufig eingehängte Karabiner einzusetzen (Redundanz)". https://www.sac-cas.ch/de/die-alpen/schwachstelle-bei-karabinern-mit-verschluss-sicherung-14092/ . The same article confirms the bridge case was in England: "Ein Unfall in England… von einer 40 m hohen Brücke".
- Suggested zh: 「…DMM 的[垂降器說明書](https://assets.dmmwales.com/download/73/)建議搭配 Belay Master…；德國阿爾卑斯協會安全圈負責人 Pit Schubert [1997 年](https://www.sac-cas.ch/de/die-alpen/schwachstelle-bei-karabinern-mit-verschluss-sicherung-14092/)則建議用兩個並排、開口反向的鉤環。」 Suggested en: "…DMM's [braking-device instructions](…) recommend its Belay Master…; Pit Schubert, long-time head of the German Alpine Club's safety team, [recommended in 1997](…) two carabiners side by side with opposed gates."

## Confirmed

| Line | Claim | Quote | URL |
|---|---|---|---|
| 374 | ≤ half rope: single rope doubled is enough | "When the rappel length does not exceed half the rope's total length, it is possible to rappel using just the single rope." / "When the rappel length exceeds half… a rope retrieval cord must be used." | petzl.com/INT/en/Sport/Multi-pitch-rappelling-with-a-single-rope |
| 425 | Petzl: flat overhand + stopper for different diameters | "may require a special joining knot (e.g. flat overhand bend with stopper knot)" | same |
| 455 | Knot bigger than the ring | "WARNING: the knot should be bigger than the rappel ring." | same |
| 456 | Locking carabiner always; knot can pass even if it looks blocked | "Petzl recommends that the rappel setup always be secured with a locking carabiner clipped to the rope… There is a risk of the knot passing through the ring, even if the block seems secure." | same |
| 457 | Never rappel on the cord | "Do not descend on the retrieval cord; it is only used to retrieve the rope." / "Do not rappel on the cord." | same |
| 458 | Device only on the strand opposite the knot; REVERSO cord through the second slot to keep it | "Rappel only on the strand opposite the knot block" ; "it's important to keep it with you at all times… With a REVERSO: pass the cord through the second rope slot." | same |
| 460 | Drawbacks | "Bulky: more likely to get the rope stuck" ; "if the single rope gets stuck out of reach, the retrieval cord can not be used to belay for the recovery" ; "not suitable for the rapid execution of a long series of rappels, as they require threading the entire rope through the rappel ring" | same |
| 460 | Alpine Team NZ 2013, 6 mm too thin | "lightweight tag line (6mm). This is too thin and weak to abseil directly on" ; datePublished 2013-06-08 (page says Jun 9, 2013). Blocked method: "tie a figure 8 on a bight and clip back into main strand" | alpineteam.co.nz/post/abseiling-with-a-single-rope-plus-tag-line |
| 462–467 | Semmel: mountain guide; one overhand; 30 cm tails; not two knots; knot on cord side against ring; both strands in tube + extra carabiner; pull cord, fat rope falls, less snagging | "Chris Semmel ist Bergführer, Sicherheitsforscher und Sachverständiger" ; "A simple sack stitch is sufficient" ; "ends… should protrude 30 cm" ; "Under no circumstances should you tie two sack stitches" ; "knot is placed on the side of the thin rope and rests against the abseil eye" ; "use two carabiners under the tube" ; "the thicker, stiffer rope falls down… [pulling the thick strand] would lead to more frequent snagging" | bergundsteigen.com/en/artikel/alpinhacks-abseilen-mit-hilfsleinen-rad-line-co/ (2025-05-05) |
| 501 | Nov 2024 GRIGRI notice | Notice D0015500K (051124) = 5 Nov 2024; it is the current notice on the Petzl GRIGRI product page | petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW |
| 503 | Blocked retrievable or fixed | "on a retrievable system with one strand blocked, or on a fixed rope" | petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX |
| 506 | Direction markings; wrong way = no braking; quickdraw for pull strand | "Use the markings on the product to help make sure the rope is installed in the proper direction. The blocking function and descent control will not work if the rope is installed in the wrong direction." ; "With a GRIGRI: clip the cord to your belay loop with a quickdraw." | notice; single-rope page |
| 508 | Brake hand controls, handle adjusts; knot to free hands | "The handle helps adjust the friction, but the descent is controlled by the hand gripping the brake side of the rope." ; §9 "tie a tight knot in the brake side of the rope, near the device" | GRIGRI page + notice |
| 511 | 8.5–11 mm; < 8.9 harder to control | "Compatible with 8.5 to 11 mm…" ; "8.5 ≤ ø < 8.9 mm: Thin ropes… are harder to grip. They can be more difficult to control while lowering, rappelling or in the event of a fall." | notice |
| 519 | Strong pull from below can unlock; pre-rigged GRIGRI can invert | "a strong pull on the brake side of the rope can cause the GRIGRI or NEOX to unblock." ; "it can be inverted (and thus unblocked) by the weight of the person rappelling below them" | GRIGRI page |
| 583 | Extended rappel not for Munter; AMGA SPI | "attended an American Mountain Guide Association (AMGA) single pitch instructor training course" ; "3. This is not intended for use with a Munter rappel." (via r.jina.ai; direct curl blocked by Cloudflare) | mountaineers.org/blog/extended-rappel-and-updated-belay-techniques |
| 583 | HMS directly on harness | bergundsteigen 2022: "Der Abseilkarabiner muss direkt in den Anseilgurt eingehängt werden. Mit einer Schlinge dazwischen funktioniert es nicht." | bergundsteigen 2022 |
| 584 | Brake strand on spine side | No manufacturer text found. Secondary sources agree (Mountaineers "Almost toast" blog, knotspedia), and the Petzl rubbing-unlocks-sleeve mechanism supports it. Treat as Confirmed (consensus) | — |
| 587 | SAC teaching material anti-twist Munter, recommended for courses | "Fazit: Diese Technik ist die sicherste von den drei vorgestellten und wird von uns für den Kursbetrieb empfohlen!" ; "Text und Abbildungen aus der 6. Auflage des Ausbildungshandbuchs „Bergsport Sommer" des SAC, die 2022 erscheint." (2022-04-25) | bergundsteigen.com/artikel/alpinhacks-abseilgeraet-runtergefallen-3-0/ |
| 603–609 | 3-locker brake steps | Alpine Savvy: "1 - Clip a locking carabiner to your rappel extension. 2 - Clip a second locking carabiner to the first one. 3 - Pass a bight of both rappel rope strands through the second carabiner. 4 - Clip a third locking carabiner to these two strands of rope… onto the strands going to the anchor." The bergundsteigen 2021 figures (Bild1/2) show the same configuration | alpinesavvy.com/blog/a-slick-carabiner-rappel-brake ; bergundsteigen 2021 |
| 611 | Risks | bergundsteigen 2021: "Wird das System jedoch entlastet (wenn man beispielsweise zu einem Podest kommt…), können die Karabiner verrutschen und sich so verdrehen, dass die Bremswirkung stark eingeschränkt wird." Alpine Savvy: "it's probably best to use this technique in less than vertical terrain" ; "it's really easy to drop a carabiner" | same |
| 637 | bergundsteigen 2012: few advantages, many drawbacks, gone from teaching | "Wenige Vorteile und viele Nachteile haben ihn auch aus den aktuellen Ausbildungen und Lehrschriften verschwinden lassen" (2012-04-23, author Pit Schubert) | bergundsteigen.com/magazinartikel/abgeseilt/ |
| 639 | BMC | "it can lever open and detach itself from a properly screwed up karabiner… At least one fatality and a number of serious injuries have resulted from this." | thebmc.co.uk/en/abseiling-do-you-know-the-risks |
| 639 | UIAA 2000 | "The following year [1996] a student at an adventure centre… fell 40 metres to his death" ; "off a bridge" ; "Karabiner gate-locking sleeves are only designed to prevent the inadvertent opening of a karabiner gate; they are not designed to resist the leverage which a FoE can apply" ; UIAA 3/2000. The PDF doesn't name the 1996 country, but SAC 1998 says England | theuiaa.org/documents/safety/Karabiner_Breakings_when_using_a_Figure-of-eight.pdf |
| 641 | HUIT friction chosen beforehand | "The choice must be made before starting the rappel." | petzl.com/US/en/Sport/Friction-modes-and-tie-offs-for-the-HUIT |
| 668 | AAC simul-rappel interdependence (also glossary 同時垂降) | "the counterweight arrangement of simul-rappelling makes the climbers interdependent. If either climber loses control, makes a mistake in rigging, or if either side of the counterweighted rope is severed, both climbers suffer the consequences" | americanalpineclub.org/news/2018/11/30/simul-rappelling |
| 680 | Climbing 2023 Buddy Rappel | "don't accidentally rappel past your next station: You cannot ascend the line with two people." ; "Make the safest decision in the moment, which may be to call for help and wait." (2023-05-25) | climbing.com/skills/rappel-with-injured-partner/ |
| 680 | Climbing 2019 | "You will be heavily weighting their last piece of gear… if the gear is marginal, consider waiting for help." (2019-03-14) | climbing.com/skills/multi-pitch-911-escape-the-belay |
| Q5 (742) | GRIGRI on the strand opposite the knot | as on line 458/506 | Petzl |
| Q6 (750) | Knot on cord side, pull cord, extra carabiner | Semmel as above. Nuance: Semmel notes slipping "as a rule… stops after a few metres", because the rope rests on rock, and is mainly a problem when "completely overhanging" | bergundsteigen |
| Glossary 擋繩垂降 | Definition | Petzl single-rope page as above | — |
| Table 78–95 | Rows | Row 3 "管狀或 GRIGRI" matches Petzl ("GRIGRI or REVERSO"). Row 5 "管狀（高摩擦）或 GRIGRI" matches BD HFM + Petzl fixed rope. Row 4 "看拉繩長度" is consistent with Petzl (≤ half rope uses the rope itself as pull strand, > half needs a cord). No problems found | — |

## zh/en mismatches
None of substance. The en text mirrors zh on every line checked, including the errors (N1, N2, N5, N7, N8, N9, N11 appear in both). Line 680 en "asks you to" is slightly softer than zh 「要求」, but both overstate "empfehlen".
