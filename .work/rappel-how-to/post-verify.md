# post-verify: 垂降怎麼做 / How to Rappel (2026-10-24)

Files: `src/content/posts/climbing/2026-10-24-how-to-rappel.md` (zh) + `-en.md` (en)
Checked: 2026-10-24. Method: every cited primary source re-opened (curl + HTML-to-text, scratchpad), Centa timestamps checked against `transcript.centa.txt`, HowNOT2 timestamps against yt-dlp auto-subtitles and the videos' own chapter lists, Rock and Ice "20%" recomputed from the author's GitHub xlsx.
Tooling: Groundlane not used (OAuth 401 per prior agents). Used curl for direct pages, r.jina.ai only for mountaineers.org (Cloudflare challenge on curl), Keenable keyless search to locate DAV part 2 and the BMC page, and `gh api` for the dataset.

## Summary

- 12 items are listed below: 6 Misframed (#1, 3, 4, 5, 6, 10), 1 Misattributed (#2), 1 Unverifiable (#9), and 4 Confirmed with a source or citation gap (#7, 8, 11, 12). Fixes are recommended for #1–10. The rest (about 70 claims) are Confirmed.
- All internal `/posts/...` links (8 zh + 8 en) resolve to existing files with `draft: false`. Series order 8 matches the `series.ts` style used by siblings ("第 7 篇" for order 7).
- zh/en parity: same 15 H2 and 3 H3 headings, the same 87 external links and the same 12 Centa timestamps. The numbers match (1.5–3 m = 5–10 ft, 接近三成 = close to 30%). No content divergence found.
- Attribution tags: the post uses many "X 說" attributions. That's needed in a disagreement-heavy safety piece, so I'm not flagging it as overload.

## Non-Confirmed items, with suggested fixes

### 1. Edelrid "nearly three times": Misframed
- Post (Step 6): zh「Edelrid 的測試裡，急停時固定點的受力是平順下降的近三倍。」/ en "in Edelrid's test, an abrupt stop put nearly three times the load on the anchor of a smooth descent."
- Source: https://edelrid.com/int-en/knowledge/knowledge-base/knots-for-connecting-ropes-when-rappelling-comparison says: "Brief force peaks occur when someone intentionally makes the descender abruptly arrest them or severely jerks... These force peaks reach a maximum of 2.6 kN, approximately three times the body weight of the person rappelling" (86 kg tester). The baseline is **body weight**, not a smooth descent.
- Fix zh:「Edelrid 的測試裡，垂降中急停或突然往下一頓，固定點的瞬間受力最高約 2.6 kN，大約是體重的三倍。」
- Fix en: "In Edelrid's test, an abrupt stop or a sudden drop on rappel spiked the anchor load to about 2.6 kN, roughly three times the rappeller's body weight."

### 2. HowNOT2 store disclosure on the webbing video: Misattributed (wrong video)
- Post (Step 1): zh「HowNOT2 有自己的商店，賣片中測試的部分繩材。」/ en "HowNOT2 runs its own store and sells some of the cord tested in the video."
- Source: *Would you rappel on this?* (IpJtTRmg7Og). The tested items are donated crag tat (Sawtooth Canyon, Gunks, "Davey Jones" boxes). At 08:12 the video only plugs the store in general ("grabbing climbing caving and canyon gear at hownot2.store supports what we're doing"). None of the tested webbing is sold. The death-knot video (rDkLXs-vfuI) is different: at 12:41 it says "one of these come free with every single rope that you get at hownot2.com", and its description links Ian Nicholson's books on hownot2.com. Ropes tested there include 9mm Pintail Lite.
- Fix: change the webbing-video sentence. zh「HowNOT2 也經營自己的器材商店，片尾有導購。」/ en "HowNOT2 also runs a gear store, plugged at the end of the video." Then add to the death-knot paragraph: zh「HowNOT2 自己也賣攀登繩，片尾有導購。」/ en "HowNOT2 sells climbing ropes itself, and plugs them at the end."

### 3. "UIAA, Petzl, Edelrid, DAV agree on three things": Misframed (item 3)
- Post (Step 2): the list of three shared requirements, where item 3 is 結型整理乾淨，兩條繩平行、不交叉 / "Dress the knot cleanly, with the two ropes parallel and not crossed".
- Sources: UIAA (https://theuiaa.org/mountaineering/alpine-skills-which-knot-to-use-to-join-two-ropes) says four strands individually and ≥30 cm, with nothing on dressing. Petzl (https://petzl.com/INT/en/Sport/Knot-for-joining-rappel-ropes) says four strands and ≥30 cm. DAV (alpenverein.de article) says each strand individually and ≥30 cm. Only Edelrid says "cleanly created (without crossing over)". Items 1–2 are Confirmed for all four.
- Fix zh: change the lead-in to「…都要求兩件事：」, keep items 1–2, and turn item 3 into a sentence:「Edelrid 另外要求結型整理乾淨，兩條繩平行、不交叉。」
- Fix en: "…agree on two things:" plus items 1–2, then "Edelrid adds that the knot should be dressed cleanly, with the two ropes parallel and not crossed."

### 4. BRAKES "K = 對接結 / The joining knot": Misframed
- Source: Shokoples PDF http://rescuedynamics.ca/articles/pdfs/BRAKESRappelAcronym.pdf says: "K - Check each and every Knot in the entire system. Tie knots in the ends of the ropes."
- Fix zh table row:「K（Knots）｜系統裡每一個結：固定點的結、對接結、繩尾結」
- Fix en: "K (Knots) | Every knot in the system: anchor knots, joining knot, end knots"
- Optional: Godino's AAC 2025 variant also changes B to **Belay device** (not Buckles), as well as E = Extension with only one S. zh「AAC 2025 那篇用的 BRAKES 是另一個版本：B 是垂降器（Belay device）、E 是延伸（Extension）、S 只有一個。」/ en "…where B is Belay device, E is Extension and there's only one S."

### 5. The Mountaineers (AMGA SPI) list of advantages: Misframed (overreach)
- Post (Step 4): autoblock 碰不到垂降器，**頭髮**和衣服離垂降器比較遠，幾個人也可以同時架好垂降、**互相檢查** / "hair and clothing … check each other".
- Source (read via r.jina.ai, because curl hits a Cloudflare challenge): https://mountaineers.org/blog/extended-rappel-and-updated-belay-techniques. Its list says: "Snag free: the autoblock and clothing are high and clear of the rappel device"; "extension enables more than one individual to setup on the rappel". It doesn't say hair (only a separate "Tie back long hair" step) and doesn't say mutual checking. Mutual checking comes from AAI/Climbing and Godino.
- Fix zh:「…列出延伸的好處：autoblock 和衣服都離垂降器比較遠、不會被捲進去，幾個人也可以同時架好垂降。」
- Fix en: "…list what extending buys you: the autoblock and clothing stay clear of the device, and more than one person can rig at once."

### 6. Quiz 2 answer, "DAV's two accidents: a glance missed it": Misframed
- Post: zh「DAV 分析的兩起事故都是看一眼沒發現、一受力就出事。」/ en "In both accidents the DAV analysed, a glance missed the problem and loading revealed it."
- Source (DAV 2020): both are described as a "Blackout", and in both the setup was **first loaded after the tether was already unclipped**. Nothing says anyone visually checked.
- Fix zh:「DAV 分析的兩起事故，都是解開自我確保之後系統才第一次受力，才發現裝錯。」
- Fix en: "In both accidents the DAV analysed, the system was first loaded only after the tether was unclipped, which is when the mistake showed."

### 7. bergundsteigen "training accident, ~20 m": Confirmed, but the source isn't cited
- Post (Step 4): bergundsteigen 記錄過一次訓練事故… 約 20 m.
- Source: bergundsteigen 2/08 "Kurzprusik a.D." (Kieselmann & Reinhard, Bergwacht Schwarzwald), https://assets.bergundsteigen.com/2021/08/38-41-kurzprusik-ad.pdf. The prusik was too long and clipped to the bridge above the leg loops, it slid against the figure-8 descender, and the trainee slid about 20 m. Correct, but this is a **2008** article. The post's only bergundsteigen references are the 2024 and 2025 pieces, so readers will look in the wrong place. The ÖAV row in the hitch table ("ÖAV teaches extended device + hitch on belay loop") rests on the same 2008 article quoting ÖAV, so it may be outdated.
- Fix: zh「bergundsteigen 2008 年記錄過一次訓練事故…」/ en "bergundsteigen documented a training accident in 2008…". Also add to the references: zh「[bergundsteigen：Kurzprusik a.D.（Kieselmann、Reinhard，2008）](https://assets.bergundsteigen.com/2021/08/38-41-kurzprusik-ad.pdf)（德文）」/ en the same with "(in German)". For the ÖAV row, either keep it with "(per bergundsteigen 2008)" (zh「ÖAV（據 bergundsteigen 2008 轉述）」/ en "the ÖAV (as reported by bergundsteigen, 2008)") or drop ÖAV.

### 8. "DAV and Petzl do the same" (clip tether to the pull strand): Confirmed, but the source isn't cited
- Petzl is Confirmed (https://petzl.com/int/en/sport/tech-tips/…: "Clip it to the retrieval strand to serve as a reference"). The cited DAV 2020 article doesn't contain this. It's in **DAV Panorama 5/2020 part 2** (19 Nov 2020), https://www.alpenverein.de/artikel/abseilen-klettern-tipps_a8187791-6f13-4d2e-a5c6-9d979859eaed: "als zusätzliche Merkhilfe kann man beim Abseilen die Selbstsicherungsschlinge dort einhängen."
- Fix: link "DAV" in that sentence to the part-2 URL and add it to the references. zh「[DAV：Abseilen beim Klettern: Tipps & Tricks（2020）](https://www.alpenverein.de/artikel/abseilen-klettern-tipps_a8187791-6f13-4d2e-a5c6-9d979859eaed)（德文）」; en the same with "(in German)".

### 9. "Anchor failure … most likely to kill several people at once": Unverifiable (comparative)
- Post: zh「這類最容易一次帶走好幾個人。」/ en "This is the kind most likely to kill several people at once."
- No source makes this comparison. The cases do support "often more than one": Tahquitz 2022 had 2 dead (AAC 2025, http://publications.americanalpineclub.org/articles/13201217362), and North Early Winter Spire, May 2025, had 3 dead from a single fixed piton pulling (ANAC 2026, https://publications.americanalpineclub.org/articles/13201217683).
- Fix zh:「這類常一次帶走不只一人，例如 2022 年 Tahquitz 兩人、2025 年 North Early Winter Spire 三人。」
- Fix en: "These often kill more than one person: two at Tahquitz in 2022, three on North Early Winter Spire in 2025."

### 10. Petzl on the fireman's belay with a GRIGRI: Misframed (minor)
- Post: zh「上面的人用 GRIGRI 這類輔助制動器時，下方用力拉繩反而可能讓它解鎖。」/ en "on an assisted-braking device like a GRIGRI, a hard pull from below can actually unlock it."
- Source: https://petzl.com/US/en/Sport/Rappelling-with-GRIGRI-and-NEOX?ProductName=GRIGRI. Petzl says "A bottom belay is possible for beginners rappelling with a GRIGRI or NEOX… WARNING: a strong pull on the brake side of the rope can cause the GRIGRI or NEOX to unblock." The warning applies to GRIGRI/NEOX only, not to all assisted-braking devices.
- Fix zh:「上面的人用 GRIGRI 或 NEOX 時，Petzl 提醒下方拉得太用力反而可能讓它解鎖。」
- Fix en: "Petzl warns that if the person above is on a GRIGRI or NEOX, a hard pull from below can unlock it."

### 11. Centa "catastrophe knot" (12:30): Confirmed with a timestamp note
- At 12:30–12:44 Centa describes the knot ("a simple overhand knot or a figure eight… with another carabiner I can clip that to my belay loop"). He only says the name "backup or catastrophe knot" at **13:27**. The post's description is fine. Optional: zh「Centa 叫它 backup 或 catastrophe knot」/ en "Centa calls it a backup or 'catastrophe knot'". Keeping the 12:30 link is OK.

### 12. Rock and Ice "about 20% of all climbing accidents fatal": Confirmed (derived)
- The article text gives only 251/76 (Confirmed verbatim: "tagged in 251 incidents, and 76 of those, nearly 30 percent, were deadly"; Rock and Ice issue 265, September 2020). I recomputed the 20% from https://github.com/ecaroom/climbing-accidents `_github-AAC_accidents_tagged_data.xlsx`: 563 of 2,770 rows are tagged Deadly (20.3%), or 544 of 2,724 after excluding Non-climbing (20.0%). The research note's "2,724 / 563" mixes the two denominators, but either way the result is about 20%. The post wording is fine. In the raw xlsx the Rappel Error tag gives 255/77, slightly different from the article's 251/76. Keep the article figure, which the post does.

## Confirmed claims (source opened)

| Claim | Source |
|---|---|
| Centa self-description "AEGM Climbing Guide based in Catalonia"; video 2026-08-12, 910 s (~15 min); teaches 1–2 day courses in Spain | yt-dlp channel About + video info.json |
| Centa timestamps 0:36 (evolution/old method), 2:16 (hitch on leg loop: carabiner on leg-loop buckle; autoblock touching device deactivates), 3:26 (adjustable lanyard for function tests), 4:36 (rope behind anchor carabiners so last person can clean), 5:10 (double overhand: alternating colours, less rolling, sits to side; at 5:22–6:24), 7:27 (autoblock first at hanging stance), 8:21 (extend device; 60 cm sling at 8:52, 120 cm doubled), 10:37 ("rope"), 11:02/11:06 (never abseil past a snag, else climb back), 11:28 (function test; carabiner "open a little bit" at 11:51), 12:00 (lanyard carabiner on pull side), 13:42 (brake hand controls; autoblock emergency only) | transcript.centa.txt |
| HowNOT2 IpJtTRmg7Og: 2024-03-06; chapter "Testing" at 4:00, embed start 230 s; faded vs coloured same sling from 3:51; faded broke "started breaking at three", "same force as the one in that accident" (Tahquitz 3.56 kN); conclusion: more than one piece essential | yt-dlp subs + chapters |
| HowNOT2 rDkLXs-vfuI: 2026-04-01; with IFMGA guide Ian Nicholson; chapter "Analyzing failure scenarios" 7:49 (= start 469); loose offset fig-8 with short tail "not even quite 1 kN" (8:55), body-weight failure (9:20); closing "leave 12 in of tail, cinch each strand" (12:19) | subs + description (0.97 kN) |
| HowNOT2 JwSJrWQnNrA: 2024-01-10; chapter "WARNING: MUST WATCH" at 26:12 (=1572); clip in, load device, pull until lanyard slack, settle, then remove tether | subs + chapters |
| Rock and Ice 251/76, nearly 30%; issue 265, Sept 2020; Eliot Caroom | rockandice.com page |
| AAC 2012 (Rob Hess, UIAGM/IFMGA): three primary causes (anchor failure, inadequate backup, off the ends); nylon not Dyneema for extension/tether ("very little elasticity, breaking under low loads when shock loaded"); separate end knots so kinks dissipate; triple barrel; saddlebag; autoblock "only necessary for the first person", fireman's belay for the rest | publications.americanalpineclub.org/articles/13201200200 |
| DAV 2020 (Hummel, Panorama 4/2020): tether sling not Dyneema "wegen Alterungsanfälligkeit"; anchor "ohne Redundanz"; end knots if not 100% sure; flat overhand, each strand, ≥30 cm; two course accidents (one strand; gear loop); Belastungstest would have caught both; hitch first, pull ~50 cm; classic / Swiss / Kombi, "alle drei eignen sich"; Swiss downside Greifreflex; stiff 6 mm cord "vermutlich die Erklärung" | alpenverein.de/artikel/klettern-abseilen_… |
| AAC 2025 (Godino): "guilty until proven innocent"; Tahquitz 2022: faded webbing broke, two dead; HowNOT2 old webbing ~3 kN; stopper through ATC at 6 kN; BRAKES variant with Extension and one S; first person unties stoppers after the last rappel; never go below a stuck rope | publications.americanalpineclub.org/articles/13201217362 |
| AAC Prescription (2026-01-20): Stanley Headwall, 26 Dec 2024, Canada; single flat overhand; "knot was not the cause"; "found with only the blue rope threaded through his device and backup"; partner/function check, stacked rappel "deserves broader adoption" | americanalpineclub.org/news/2026/1/20/… |
| Petzl rappelling: all manoeuvres directly connected; hitch first, girth-hitched to belay loop; device on DUAL CONNECT ADJUST; take up slack; clip ropes to anchor "so you don't lose them and to back up the second" | petzl.com tech tip |
| Petzl knot: flat overhand doesn't work with different diameters → flat overhand + stopper; 4 strands, ≥30 cm | petzl.com Knot-for-joining |
| Petzl single rope + cord: knot block + locking carabiner; "Do not descend on the retrieval cord" | petzl.com Multi-pitch single rope |
| Petzl GRIGRI: single strand only (blocked or fixed); descent controlled by brake hand, not handle | petzl.com GRIGRI/NEOX |
| UIAA: overhand for same diameter, 4 strands, ≥30 cm; double fisherman for different diameters (2019-02-14) | theuiaa.org |
| ENSA via Climbing (2021-09-21): offset overhand and fig-8 suitable if vigorously tightened and 30 cm tails | climbing.com |
| YOSAR/Yosemite Mountain Guides (Climbing, 2022-06-03): never flat fig-8, rolls apart; 5–10 ft slack, device stays on; saddlebags; "Never rely on one friction hitch", backup knot | climbing.com/skills/rappelling-best-practices |
| AAI guide (Director of Operations): always close the system; most accidental rappels off a single end are on single pitch; saddlebags | climbing.com/skills/5-steps… |
| Synnott (2022-06-24): speed up and jerk outward as the end comes through | climbing.com/skills/how-to-rappel-safety-techniques |
| BMC How to abseil: "Rope below!"; prusik not fail-safe, can rub and release; pull slowly, spikes below anchor; device on belay loop, French prusik on leg loop | thebmc.co.uk/en/climb-skills-abseiling |
| BMC 6 tips (Margeson): leave gear or replace in-situ tat; Steve Long "no set rule"; Margeson forgot to clip cowstail; "schoolboy error of your rope flying off down the cliff"; first person checks the pull | thebmc.co.uk/en/alpine-skills-multipitch-abseiling-tips |
| BMC risks: short test pull; never prusik a single rope; with one end, climb back up | thebmc.co.uk/en/abseiling-do-you-know-the-risks |
| bergundsteigen 2024 (Andi Dick, 3 Jun 2024): ~1.5 m tail clipped into device; Tipp 9 first person threads pull end + stopper; Tipp 15 carry rope; Tipp 16 never rappel past a snag, "Seilrest… nie oberhalb" | bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps |
| bergundsteigen 2025 (Chris Semmel, 5 May 2025): single Sackstich enough even with different diameters; "Under no circumstances" two in a row (snag risk); two carabiners in tube; carabiner-block methods hard to pull and tangle; pull the aid line so the thick rope falls | bergundsteigen.com/en/artikel/alpinhacks… |
| bergundsteigen 2/08: A.B.S.-Check (Anker, Bremse, Stop); ÖAV teaches raised device + Kurzprusik on belay loop (2008) | assets.bergundsteigen.com/…kurzprusik-ad.pdf |
| SAC (2019-09-16, Bruno Hasler): SAC-Lehrmeinung is to always rappel with a backup; bottom belay fails if the device is rigged wrong or on a gear loop | sac-cas.ch |
| Shokoples (ACMG/IFMGA): leg-loop backup can fail if you turn sideways or lift your leg; extension + backup on belay loop; touch each component and speak aloud | rescuedynamics.ca PDF + what.htm |
| TOCC: aluminium rings weaken in under a year at Long Dong; 304 stainless quick links a serious concern; report to the Rebolting Team | tocc-climbing.org |
| Mountaineers/AMGA SPI: extended device, autoblock on belay loop; sewn nylon sling | mountaineers.org via r.jina.ai |
| Internal links (16) exist with draft:false | local files |
