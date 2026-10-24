# Review: 2026-10-24-rope-solo-how-to（中英兩版）

Review date: 2026-10-24。「其他攀登類型」系列 order 6（規劃表 2026-10-24 決定）。post-verify 與 post-review／post-polish 由兩個獨立 agent 各自執行，審稿人沒有改動文章；修正由作者依下方清單套用到中英兩版。原始審稿報告：`.work/rope-solo-20261024/review-verify.md`、`review-editorial.md`。研究與證據：`.work/rope-solo-20261024/`（gear-technique.md、accidents.md、videos.md、video-raw/）。


## post-verify

結論：70 項宣稱中 59 項 Confirmed，11 項需修（2 Contradicted、5 Misframed、4 歸屬／連結）。中英一致。

### 已修正（2026-10-24，中英同步）

- N1 Zodiac：改為「離確保站約 10 英尺時一個岩楔脫出，前後共六個保護點脫出或失效」。
- N2 HowNOT2 落錘：改為 4.85 kN 來自卡開的 Micro Traxion 中途突然咬住；備份結接住那次衝擊仍偏高。
- N3 AAI：蝴蝶結改為 BHK、兩個開口反向有鎖鉤環。
- N4 上升備援：改為「備份結，或像 Avant 多掛一個止退滑輪」；圖說、圖框、檢查表一併改。
- N5 SULU GO：改為靜力繩須加 EN 355 緩衝器。
- N6 Half Dome：補上 AAC 無法確定是裝反還是到頂改垂降。
- N7 TAKEMOVIE：改為「爬完第一段下到地面拿背包」；落石改「小石頭」。
- N8 連結：CAMP 補說明書副本、SPOC 改連 IFU PDF、繩子疊法改連 Kirkpatrick Part 2。
- N9 水瓶改歸 Wharton。N10 兩篇 ANAC 參考資料改用原標題。N11「先打新結再拆舊結」改歸 Kirkpatrick。

### 原始報告


Target: `src/content/posts/climbing/2026-10-24-rope-solo-how-to.md` (zh-TW) + `-en.md` (en). Checked 2026-10-24.

toolDegradation: Groundlane MCP has only `authenticate` exposed; Groundlane direct HTTP POST returned 401. Main path was curl full-page fetch, then HTML/PDF to text, and every claim was checked against the full text (no search snippets). Exa `web_fetch_exa` was used for the Silent Partner manual mirror (manualzilla returned 403 to curl). Video claims were checked against the raw subtitles and descriptions in `video-raw/`, and upload dates against the YouTube watch-page `uploadDate`/`publishDate`.

zh/en parity: the two versions match sentence for sentence. Every issue below is in both languages, so each fix is given in both.

### Verdict table

| # | Claim (en wording) | Verdict | Source |
|---|---|---|---|
| 1 | TAKEMOVIE, Mar 2026, *Star Trek* 5p 5.8, Jōyama; 5:43 explains going down and climbing back | 🟡 Minor misframe (see N7) | ja subtitles 342–352s; publishDate 2026-03-22 |
| 2 | HowNOT2 descriptions: "you don't know what you don't know"; "only intended for you to understand what you are looking at" | 🟢 Confirmed | DHgozZxLbyo / 9NxGPzFSHPU desc |
| 3 | Barghahn: TRS controlled, LRS ~10× more complex and risky, multipitch needs emergency comms and friends who know the plan | 🟢 Confirmed | lx0iwchriQ0 8–31s |
| 4 | Petzl: tell someone your destination and return time; carry GRIGRI + TIBLOC/ANNEAU | 🟢 Confirmed | Petzl tech tip |
| 5 | Rule 4: all three AAC TRS cases changed routine (wind / rush / forgotten item) | 🟢 Confirmed | AAC Prescription 2025-02 (Valkyrie), 2023-02 (Donner: windy, anxious to go home), ANAC 13201215676 (Vedauwoo: haste, gloves) |
| 6 | 2021 Donner Summit climber wore no helmet | 🟢 Confirmed (implied by "There is no good reason not to wear a helmet") | AAC 2023-02 Prescription |
| 7 | AAC Feb 2025: only the El Mudo was designed for TR (and lead) solo | 🟢 Confirmed | AAC Prescription 2025-02-11 |
| 8 | GriGri/GriGri+/NEOX not a self-belay device; modification for lead solo not authorized | 🟢 Confirmed | Petzl GriGri page |
| 9 | Micro/Nano Traxion: "may be used by experts"; no single ascender | 🟢 Confirmed | Petzl tech tip |
| 10 | Shunt/Rescucender "Never use for self-belaying"; won't block if body presses on it or it's grabbed | 🟢 Confirmed | Petzl tech tip |
| 11 | SPOC IFU shows TRS; "single moving rope clamp does not provide sufficient safety" | 🟢 Confirmed, but linked page doesn't show it (N8) | SPOC IFU PDF |
| 12 | CAMP Lift: rope access/tree/rescue; "not suitable to arrest falls" | 🟢 Confirmed (first half from the datasheet, second half from the manual); link only partly supports it (N8) | CAMP datasheet 03.03.22 |
| 13 | RollNLock "cannot be used for self-belaying while climbing" | 🟢 Confirmed | CT product page |
| 14 | SULU GO labelled for TRS, certified via EN 567 / EN 15151-1 | 🟢 Confirmed | alternativecurrent.it |
| 15 | SULU GO "requires a dynamic rope" | 🔵 Misframed (N5) | alternativecurrent.it |
| 16 | El Mudo for TR and lead; own risk; 9.4–10.5 mm | 🟢 Confirmed | stonecrag.com |
| 17 | Roc Solo first CE-certified lead-solo device; lead solo only; backup system required | 🟢 Confirmed | roc-amadeus.fr; Climbing 2026-07-31 |
| 18 | Silent Partner forbids static rope; SP and Soloist manuals require backup | 🟢 Confirmed | SP manual (manualzilla via Exa); Soloist manual PDF |
| 19 | Petzl: use two different models (forgetting the cam on two Micro Traxions) | 🟢 Confirmed | Petzl tech tip |
| 20 | Avant: static is easier on edges (static vs dynamic note) | 🟢 Confirmed via notes and Avant guide; not re-fetched | — |
| 21 | AAI: top device extended + chest harness; extension stops devices releasing each other; second device for redundancy | 🟢 Confirmed | AAI 2025-11-01 |
| 22 | AAI ties a **butterfly** mid-rope, one device per strand | 🔴 Contradicted, minor (N3) | AAI |
| 23 | AAI: coil the leftover rope as a weight a few feet up; **water bottle** | 🟡 Attribution (N9) | AAI; Wharton |
| 24 | Petzl ~10% stretch, 50 m line → first 5 m ground-fall risk | 🟢 Confirmed | Petzl tech tip |
| 25 | Wharton: Lift won't go up if rigged upside down, no lock-open button, toothless; bent two ascenders; not on windy days | 🟢 Confirmed | Climbing (updated 2026-03-12) |
| 26 | HowNOT2 TRS guide: "will break before it strangles you" | 🟢 Confirmed | hownot2.com/trs-guide |
| 27 | HowNOT2 drop tower (23:46): jammed-open Micro Traxion slides to the knot, catch near de-sheath force, worse if it grabs suddenly | 🔵 Misframed (N2) | DHgozZxLbyo 1427–1539s |
| 28 | Rule: "no slack and a backup device, because a backup knot may or may not back you up" | 🟢 Confirmed | DHgozZxLbyo 1530–1539s |
| 29 | Stay below the anchor (factor 2); slight overhang can pendulum the rope out of reach | 🟢 Confirmed | Petzl tech tip |
| 30 | Faulhaber Sep 2021, Colorado, Shunt + backup knots; Shunt came cleanly off; rope and knots intact; 12 broken bones; Petzl removed self-belay in 2012; retailer showed the old notice | 🟢 Confirmed | Climbing 2022-01-12; AAC 2023-02 |
| 31 | HowNOT2 10:24: two-bolt anchor, rappel, climb back on two PCDs; Brent runs Avant | 🟢 Confirmed | DHgozZxLbyo 624–640s + chapters |
| 32 | Kirkpatrick: impact forces can be higher; three pieces each direction; backup knot never omitted | 🟢 Confirmed | AK Part 2 |
| 33 | SP manual: about one number grade harder | 🟢 Confirmed | SP manual |
| 34 | bergundsteigen 2026 (#134, 2026-04-20, by Avant's founder): inline anchor on first two bolts, steel on bolt 1, knot jams at bolt 2 | 🟢 Confirmed | bergundsteigen |
| 35 | Owens River Gorge, 13 Mar 2015, bolt-to-bolt stick clip, old bolt snapped, 25–30 ft, fatal; AAC: redundancy or true self-belay would have prevented it | 🟢 Confirmed | ANAC 2016 |
| 36 | HowNOT2 LRS 46:18 "do I trust my life to one bolt?" + inline anchor | 🟢 Confirmed | 9NxGPzFSHPU 2778–2799s |
| 37 | SP: clove hitch on a centrifugal clutch, locks whatever the body position; Kirkpatrick: "by far the best soloing device ever made" | 🟢 Confirmed | SP manual; AK Part 1 |
| 38 | Climbing review: Roc Solo catches upside-down falls | 🟢 Confirmed (it is Barghahn's view as quoted in the review) | Climbing 2026-07-31 |
| 39 | Barghahn quote "THIS SYSTEM LIKELY WILL NOT CATCH UPSIDE-DOWN FALLS! Always use backup knots." | 🟢 Confirmed verbatim | bergundsteigen |
| 40 | Roc Solo founder: GriGri failed to engage, decked from low on route | 🟢 Confirmed (2018, 5.13b) | Climbing 2026-07-31 |
| 41 | Clove hitch on a locker: safest, knot always tied, good for big-wall aid, "snail's pace" | 🟢 Confirmed ("cheapest" is the author's addition, harmless) | AK Part 1 |
| 42 | Kirkpatrick: jumars incl. Traxions can severely damage the rope | 🟢 Confirmed | AK Part 1 |
| 43 | Edelrid: toothed pulley, FF1 near anchor, rope can sever completely | 🟢 Confirmed (2 m of rope, 80 kg) | Edelrid KB |
| 44 | Half Dome fatality, AAC published 2006, GriGri set for rappel from above, never engaged | 🟢 Year/facts Confirmed; 🔵 framing (N6) | ANAC 13200604200 (Publication Year 2006) |
| 45 | SP manual: 40–50 ft max; at least two backup knots | 🟢 Confirmed | SP manual |
| 46 | SP manual: "tie and clip the new one before removing the old" | 🟡 Attribution (N11): this is Kirkpatrick Part 2 | AK Part 2 |
| 47 | Barghahn: cinch every few pieces or ~6 m | 🟢 Confirmed | bergundsteigen |
| 48 | EDELRID video order: backfeed → impact → device function → harness attachment → anchor → rescue → alone | 🟢 Confirmed | Q6N1Fav4MaI chapters |
| 49 | Sport finish: lower on the free strand, knot the tail | 🟢 Confirmed | bergundsteigen |
| 50 | Squamish 2019 (Smoke Bluffs, Libya Sucks 5.7): demonstrating a GriGri system, weighted a chest-high cam, outward pull, ground fall, one broken vertebra | 🟢 Confirmed | ANAC 2020 |
| 51 | Kirkpatrick: climbed twice, abseiled once, three times; "There is no partner to check your work"; Eiger over an hour per stance | 🟢 Confirmed | AK Part 2 |
| 52 | TAKEMOVIE: P3 has no anchor, uses a tree + next pitch's bolt; climbs on while a party above rappels; stone hits helmet | 🟢 Confirmed (639–652s, 809–843s; "小石", small stones) | ja subtitles |
| 53 | TAKEMOVIE 2021 ② uses GriGri + Micro Traxion; description says GriGri and ATC are not designed for solo | 🟢 Confirmed | O41Rnq4o6cs subtitles 193–289s + desc |
| 54 | Kirkpatrick: rope bags essential beyond one pitch; stack so belay end goes in last | 🟢 Confirmed (stacking is in Part 2, not the linked Part 1; N8) | AK Part 1/2 |
| 55 | Barghahn: knot extra tail, easy to rap the wrong strand | 🟢 Confirmed | bergundsteigen |
| 56 | Kirkpatrick: climb, abseil, ascend = more abuse; 10 mm dynamic backup | 🟢 Confirmed | AK Part 1 |
| 57 | "Ascend on two devices plus backup knots. Avant's multipitch video uses two ascenders and a PCP…" | 🔵 Misframed (N4) | lx0iwchriQ0 282–341s |
| 58 | Kirkpatrick abseils a separate free-hanging rope if the pitch traverses | 🟢 Confirmed | AK Part 2 |
| 59 | Dahl: Molladalen, first multipitch LRS, ~200 m, easy, climbed before, WC Revo; 3:51 top of P2, anchor fixed, about to rappel | 🟢 Confirmed ("Alpine anchor" in subtitles) | h_AE3LKLg2w 35–85s, 231–241s + desc |
| 60 | Zodiac P1, 2017: nut blew near the anchor, **then six placements failed in a row**, ~110 ft, stopped level with first bolt; quickdraw remark | 🔴 Contradicted (N1) | ANAC 2018 |
| 61 | The Shield, 1992: 10–15 ft slack, aid on marginal piece, pulled, ledge, open ankle dislocation; "much easier to solo at one's limit on aid than free" | 🟢 Confirmed (open subtalar dislocation) | ANAC 1993 |
| 62 | After Six (5.7), 2021, P2 pendulum, neck, rescue; extra gear may have lessened it | 🟢 Confirmed | ANAC 2022 |
| 63 | Valkyrie 2023: sling pulled into the device | 🟢 Confirmed | AAC Prescription 2025-02 |
| 64 | Kirkpatrick Part 3: pushing on exhausted, especially in the dark | 🟢 Confirmed | AK Part 3 |
| 65 | Channel blurbs (HowNOT2, Hard Is Easy, EDELRID KB) | 🟢 Confirmed (single-source; identical to the canonical text in `post/references/climbing-gear-videos.md`) | — |
| 66 | Hard Is Easy has no rope-solo episode | 🟢 Confirmed | list_HardIsEasy.txt (0 "solo" titles) |
| 67 | TAKEMOVIE: big walls, portaledge, Mizugaki/Jōyama solo; 2021 three-part series labelled intro, not instruction | 🟢 Confirmed | search1/desc + O41 desc |
| 68 | Reference dates (AAI 2025-11, Wharton 2026-03, Shunt 2022-01, B&S 2026-04, Climbing 2026-07, videos 2024-07 ×2 / 2025-03 / 2025-04 / 2026-03 / 2026-06 / 2021-01) | 🟢 Confirmed | page JSON-LD / watch pages / desc |
| 69 | Reference titles for Half Dome / After Six ANAC reports | 🟡 Not the real titles (N10) | ANAC pages |
| 70 | Video timestamps 343 / 624 / 2778 / 231 match 5:43 / 10:24 / 46:18 / 3:51 | 🟢 Confirmed | arithmetic + subtitles |

### Non-Confirmed items: details and fixes

**N1. 🔴 Zodiac fall count**
- en: "a climber aid-soloing on a Silent Partner had a nut blow near the anchor, then six placements failed in a row"
- zh: 「接近確保站時一個岩楔脫出，接著六個保護點連續失效」
- Problem: the six failures include that first nut. The report says: "In all, six placements pulled out or otherwise failed, and I fell approximately 110 feet". The post makes it seven.
- Fix en: "…had a nut blow about 10 feet below the anchor; in all, six placements pulled or failed, and he fell about 110 feet…"
- Fix zh: 「…離確保站約 10 英尺時一個岩楔脫出，前後共六個保護點脫出或失效，他墜落約 110 英尺…」

**N2. 🔵 HowNOT2 drop-tower result**
- en: "a Micro Traxion jammed open slid all the way down to the knot, and the catch came close to the force that strips a sheath; if the device grabs suddenly while you are sliding, it is worse."
- zh: 「讓一個被卡開的 Micro Traxion 一路滑到下方的結，衝擊大到接近剝掉繩皮的力量，而且如果器材在滑落途中突然咬住，情況會更糟。」
- Problem: in the first drop (1427–1469s) the jammed device suddenly engaged while sliding. That catch gave 4.85 kN on 8.9 mm rope, "about what it de-sheaths at" ("you don't want your micro traxion all of a sudden engaging … that is a risk"). In the second drop the device was taped open and hit the knot. The knot was too low: the mass "totally hit the ground", and the force was "pretty high"; the knot "did its job sort of". The post swaps the two: the near-de-sheath force came from the sudden grab, not from the knot.
- Fix en: "HowNOT2 tested this on their drop tower: a Micro Traxion jammed open slid down the rope, then suddenly grabbed, and the 4.85 kN catch was about what strips the sheath of an 8.9 mm rope; with the device taped open, the backup knot caught it, but the peak force was still high. Their rule: …"
- Fix zh: 「HowNOT2 用落塔測過：被卡開的 Micro Traxion 往下滑到一半突然咬住，衝擊 4.85 kN，差不多就是 8.9 mm 繩剝皮的力量；把器材貼住不讓它咬、改由備份結接住，衝擊仍然偏高。他們的結論是：…」

**N3. 🔴 AAI knot**
- en: "AAI's approach is to tie a butterfly in the middle of the rope" / zh: 「AAI 的作法是在繩子中段打蝴蝶結」
- Problem: AAI writes "I tend to tie a BHK at the center of the rope and clip it to the anchor with two opposite and opposed locking carabiners." A BHK is a doubled overhand/figure-eight on a bight, not a butterfly.
- Fix en: "…tie a BHK (a doubled loop knot) in the middle of the rope, clip it to the anchor with two opposite-and-opposed lockers, and run one device on each strand…"
- Fix zh: 「…在繩子中段打一個 BHK（雙環的單結或 8 字結），用兩個開口反向的有鎖鉤環扣上固定點，兩股繩各掛一個器材…」

**N4. 🔵 Multipitch ascending: "two devices plus backup knots" credited to Avant**
- en: "**Ascend on two devices plus backup knots.** Avant's multipitch video uses two ascenders and a progress capture pulley, so removing any one still leaves two." (The same "two devices + backups" phrase is in diagram 2's caption and box 4, and in the multipitch checklist.)
- zh: 「**上升時繩上兩個器材，加備份結。** Avant 的多繩距影片用兩個上升器加一個止退滑輪…」
- Problem: Avant says the opposite about knots. "The standard for aid following jugging really is to avoid knots in the rope below you … snag risks. … by ascending with three devices in the system, pulling one off always leaves you with two" (296–341s). The cited source backs a third device instead of backup knots, not "plus backup knots".
- Fix en: "**Keep redundancy while you ascend.** Use two ascenders plus either backup knots or, as in Avant's multipitch video, a third device (a progress capture pulley), so taking one off to pass a bolt still leaves two; Avant skips knots below because they snag." Matching caption: "…ascend with redundancy: backup knots or a third device."
- Fix zh: 「**上升時要保持備援。** 兩個上升器之外，再加備份結，或像 Avant 的多繩距影片那樣多掛一個止退滑輪，拿掉一個去過 bolt 時還剩兩個；Avant 不在下方打結，因為容易卡住。」圖說與檢查表也要一起改。

**N5. 🔵 SULU GO rope requirement**
- en: "the SULU GO requires a dynamic rope" (gear section). The table cell "requires a dynamic rope" has the same issue.
- zh: 「SULU GO 要求動力繩」／表格「要用動力繩」
- Problem: for TRS/EN 567 the maker allows "dynamic rope EN 892 – accessory cord EN 564 or semi-static rope EN 1891, with energy absorber EN 355". A static rope is allowed, but only with an energy absorber.
- Fix en: "the SULU GO allows a static rope only with an EN 355 energy absorber" (table: "dynamic rope, or static with an EN 355 absorber")
- Fix zh: 「SULU GO 用靜力繩時必須加 EN 355 緩衝器」（表格：「動力繩；靜力繩要加 EN 355 緩衝器」）

**N6. 🔵 Half Dome case framing** (the publication year 2006 is correct; the report itself gives only "September 14", and the incident was likely 2005)
- en: "In a Half Dome fatality the AAC published in 2006, the GriGri had been set up for a rappel from above and never engaged."
- zh: 「AAC 2006 年收錄的一起 Half Dome 死亡事故，GriGri 被裝成從上方垂降的方向，整段都沒有作用」
- Problem: the facts are right, but read as a lesson about attaching the device, the sentence suggests misrigging killed him. The report puts the fall down to a probable loose flake plus two of four pieces ripping. It says that in one scenario "the orientation of the Grigri ended up being irrelevant". It also raises the possibility that he re-rigged the GriGri to rappel at the top and failed to connect to the anchor.
- Fix en: "…the GriGri was found rigged for a rappel from the top anchor and never engaged; the AAC could not say whether he rigged it backwards or re-rigged it to rappel before clipping in, but either way the device was no use."
- Fix zh: 「…GriGri 被發現是從上方垂降的方向，整段都沒咬住；AAC 無法確定他是一開始就裝反，還是到頂後改成垂降卻還沒扣上固定點，但兩種情況器材都沒有作用。」

**N7. 🟡 TAKEMOVIE 5:43 "after each pitch"** (in the intro, and again in the Tier 3 paragraph)
- en: "after each pitch he has to go back down for his gear and then climb back up the rope"
- zh: 「每爬完一段都要先下去拿東西，再沿著繩子爬回來」
- Problem: at 342–352s he is finishing pitch 1 and says 「一度ね、地面に降りて荷物をピックアップして、またロープを登り返す」, meaning go down to the ground once for his pack. The cycle does repeat on later pitches (and he links P4–P5), but the sentence at 5:43 is about this pitch.
- Fix en: "…he explains that because he is using a solo system, he has to go back down to the ground for his pack and then climb back up the rope"
- Fix zh: 「…他說因為這次用 solo 系統，要先下到地面拿背包，再沿著繩子爬回來」
- Also: "a falling rock hits his helmet" → the subtitles say 小石 (small stones). Optional wording: "small stones hit his helmet" / 「小石頭打到頭盔」.

**N8. 🟡 Link does not show the sentence**
- CAMP Lift row links the datasheet. The datasheet supports "rope access, tree climbing, team rescue" but not "not suitable to arrest falls", which is in the shared CAMP rope-clamp manual (manualzz mirror). Fix: either link the manual as well, or cut the cell to "Sold for rope access, tree climbing and rescue; fall arrest isn't a listed use" / 「用途列繩索作業、樹攀、救援，沒有列擋墜落」.
- SPOC row links the product page, which only says "lifting loads, crevasse rescue, emergency ascender". The TRS wording is in the IFU: https://avs.edelrid.com/images/attribut/54477_GAL_SPOC_ANSICHT.pdf. Fix: link the IFU PDF.
- "Kirkpatrick … rope bags are essential … stacked so the belay end goes in last" links Part 1. The stacking line is in Part 2. Fix: link both, or move the stacking clause to the Part 2 link.

**N9. 🟡 Water bottle credited to AAI**
- en: "AAI suggests coiling the leftover rope and tying it off a few feet above the ground as a weight; with little rope left, a water bottle works." / zh: 「AAI 建議…；繩子短的時候，掛一瓶水也行。」
- Problem: AAI has no water bottle. Wharton (Climbing) and Avant's TRS guide do.
- Fix en: "…as a weight; with little rope left, Josh Wharton clips on a water bottle." / zh: 「…；繩子短的時候，Josh Wharton 會掛一瓶水。」 Or just drop the attribution from the second clause.

**N10. 🟡 Reference titles that aren't the real ANAC titles**
- "Grigri rigged for rappel (ANAC, 2006)" → real title: "Fall on Rock, Inadequate Protection, Misuse of Equipment (Grigri), No Hard Hat — California, Yosemite Valley, Half Dome (ANAC, 2006)"
- "Rope-solo pendulum fall, After Six (ANAC, 2022)" → real title: "Fall on Rock—Roped Soloing, Inadequate Protection — Manure Pile Buttress (ANAC, 2022)"
- Applies to both language versions.

**N11. 🟡 "Tie the new knot before removing the old" credited to the Silent Partner manual**
- en: "The Silent Partner manual gives concrete numbers: … at least two backup knots at a time; tie and clip the new one before removing the old."
- zh: 「…同時保持至少兩個備份結；換結時先打新的、扣好，再拆舊的。」
- Problem: the manual says to keep at least two knots clipped and to tie them all at the belay. The "new before old" rule is Kirkpatrick, Part 2.
- Fix: move that clause to the next sentence. en: "Kirkpatrick adds: tie and clip the new knot before removing the old one, and calls the backup knot the one component you should never omit." zh: 「Kirkpatrick 補充：先打好、扣好新的結，再拆舊的；他說備份結是整套系統裡永遠不能省的東西。」

### Attribution-tag count
The post carries about 2 attribution hedges ("That is his estimate, not a statistic"; "the video description itself says it is not a tutorial"). That is under the limit of 3, so nothing to merge.

### Scope statement
This run checked only the 70 claims already in the post. It did not judge whether the post covers the topic completely (that is step 6.5 of post-review). Not re-checked: claims inherited from notes that this post states only in passing, such as Avant's static-rope remark (#20).

下一步（未完成前不能 commit）：post-review、post-polish

## post-review

### 已修正（2026-10-24，中英同步）

- 1 固定點：補「繩子要打結固定在固定點上，不能只是穿過去」。
- 2 操作順序：三層各加「操作順序」編號清單；頂繩獨攀頂端轉換依 Petzl（先裝下降器受力再拆止退器材），轉換原則依 HowNOT2 49:38；先鋒到頂依 HowNOT2 77:25（PAS 扣進固定點、下降回收快扣、拉繩）；多繩距依 Barghahn／Kirkpatrick，並加「上升系統裝好測過才拆下方確保站」。
- 3 先鋒下來：改寫為 Barghahn 多帶繩＋HowNOT2 到頂示範，刪掉「下降（lower）」的模糊句。
- 4 刪掉無來源的「低處多打一個結」，改為「前幾公尺當成沒有保護的區段，低處有難點的路線先不要選」。
- 5 器材扣法：改為「各用一個有鎖鉤環扣在說明書指定的吊帶位置（不是裝備環）」。
- 6 直線固定點拆成三句。7–8 補 inline 連結（HowNOT2 說明欄、Petzl、Silent Partner、Barghahn、Roc Solo、Kirkpatrick、Avant、Donner Summit、Valkyrie），規則 4 補 Donner Summit 案情。
- 9 description 改為「HowNOT2 示範，以及挪威 Molladalen、日本伊豆城山的實地影片」，不宣稱 HowNOT2 片的岩場。
- 10 刪掉 2021 年 TAKEMOVIE 影片的引用與頻道介紹中的 2021 系列（2024+ 規則）。
- 11 台灣：先鋒地面固定點段落補龍洞舊 304 bolt 與 TOCC 資料庫，連到站上〈掛片會壞〉（事實取自該篇，未另查）。
- 12 CAMP Lift「要注意」欄改寫。13 小問題：表格先具備加「上升」、兩個 H3 改名、AAI「互相卡住」改「互相干擾、一起鬆脫」、英文 abseil 改 rappel。

### 原始報告

**結論：先修再發。** 讀者要的三樣東西都有：每層的作法、器材比較表、四個岩場的影片。中英對齊得很好，機械檢查只有一項紅（缺審稿紀錄）。但它目前比較像「三層的注意事項」，不太像「做法」：三層都沒有照順序寫的操作步驟，所以最危險的幾個轉換點（固定繩怎麼收尾、頂端從自我確保轉成垂降、多繩距在下方確保站轉成上升）不是沒寫，就是寫得模糊。另外有幾句話可能讓人誤做成不安全的作法（第 1、2、4 點）。

### 機械檢查

- `pnpm verify`：🔴 只有 `check:series-plan` 這項失敗，原因是兩個檔案都沒有 `.work/reviews/2026-10-24-rope-solo-how-to.md`（需要 post-verify＋post-review＋post-polish 的紀錄）。其他項目全綠，包括 lang-parity。
- `pnpm astro check`：0 errors、0 warnings。
- `pnpm check:links`（中英兩檔）：39 個外部連結都正常。
- `diagram-preview`（中英兩檔，各 2 張圖）：✓。截圖在 scratchpad，還沒用肉眼看過深色與手機版。
- `check:references`：這篇沒有警告。
- tags：`climbing, rope-solo, top-rope, multi-pitch, climbing-gear, outdoor-climbing` 都是站上已有的寫法，沒有同義詞分裂，6 個在 3–7 的範圍內。
- 事實查證：**這次沒有做。** 只開了 Petzl 技術說明核對第 4 點。

### 問題清單（依重要度排序）

1. 🔴 **頂繩獨攀的固定點寫成「跟一般頂繩一樣」，可能讓人把繩子穿過 master point 就爬（第 147 行）。**
   原句：「固定點的架法跟一般頂繩一樣，見〈頂繩固定點怎麼架〉。頂繩獨攀多了三件事：」
   為什麼：一般頂繩是讓繩子穿過固定點、兩股垂下來。頂繩獨攀要把繩子打結固定在固定點上。讀者照〈頂繩固定點怎麼架〉做，如果只用其中一股繩、另一股沒固定，繩子會整條從固定點滑出去。表格和圖都寫「固定繩」，但架設段落沒講要怎麼固定。
   zh 改寫：「固定點本身（兩點平均、加護套）跟一般頂繩一樣，見〈…〉；差別在繩子要打結固定，不能只穿過去：用八字結或蝴蝶結做一個繩耳，以有鎖鉤環扣在 master point 上。只穿過固定點的繩子，一受力就會往另一邊滑。」
   en 改寫：「Build the anchor itself (two equalized points, edges padded) as for any top rope; see […]. The difference is that the rope must be tied off, not just run through: tie a figure-eight or butterfly on a bight and clip it to the master point with a locker. A rope that only runs through the anchor will slide out the other side when you load it.」
   補註：第 149 行的 AAI 中段蝴蝶結作法，可以移到這句後面當成第二種固定方式。

2. 🔴 **三層都沒有照順序的操作步驟（`type: guide` 的「步驟」這一段缺了）。**
   為什麼：讀者要的是 how-to，文章給的是依主題分的條列，再加上一份檢查清單。最容易出錯的轉換點都沒有順序：
   - 頂繩獨攀從上升轉成垂降：第 165 行只寫「換器材的過程要一直有一點連在繩上」。Petzl 的作法是先把 GriGri 裝在兩個器材下方、坐上去，再拆止退器材。
   - 先鋒獨攀到頂：第 241 行完全沒提「先用 PAS 或扣繩把自己扣進頂端固定點，才拆確保器」。
   - 多繩距：第 289 行寫「垂降回去拆保護，拆掉下方確保站」，但沒寫「上升器材裝好、坐上去測過以後，才拆下方確保站」。
   建議：每層在「出發前檢查」之前加一段 `### 操作順序`（5–8 步的編號清單）。以頂繩獨攀為例：
   zh：「1. 從上方接近固定點，接近時自己要有確保。2. 架好固定點，打結固定繩子，岩角加護套。3. 沿繩垂降到底，順便檢查岩角。4. 在繩尾掛重物。5. 裝上兩個器材和胸式吊帶，坐上去測。6. 往上爬，每隔一段換一次備份結。7. 在固定點下方停住，把 GriGri 裝在兩個器材下方、坐上去，再拆止退器材。8. 垂降。」
   en：「1. Approach the anchor from above, protected. 2. Build the anchor, tie off the rope, pad the edges. 3. Rappel to the base, checking the edges on the way. 4. Weight the tail. 5. Rig both devices and the chest harness; sit-test. 6. Climb, moving the backup knot up as you go. 7. Stop below the anchor; rig the GriGri below both devices and weight it before removing either device. 8. Rappel.」
   先鋒獨攀與多繩距照同樣格式寫，要包含上面講的頂端轉換與「先裝上升器材、測過，才拆下方確保站」。

3. 🔴 **先鋒獨攀「爬完怎麼下來」寫得模糊，還有一個獨攀時做不到的「下降（lower）」（第 241 行）。**
   原句：「帶的繩子夠扣頂端固定點，接著用另一股繩子垂降或下降，繩尾一定要打結。」en：「trail enough rope to clip the top anchor, then lower or rappel on the free strand」
   為什麼：「另一股」指的是哪一股沒講。一個人沒有人放你下來，「lower」只會讓人誤會。而且整句漏了「先把自己扣進固定點，再解除自我確保」。
   zh 改寫：「到頂後先用 PAS 把自己扣進頂端固定點，再把繩子在固定點上打結固定，然後才把確保器從繩上拆下。接著沿固定好的繩子垂降，繩尾先打結。快扣可以在垂降時回收，或之後再頂繩獨攀一次回收。」
   en 改寫：「At the top, clip into the anchor with a PAS first, then tie the rope off to the anchor, and only then take your belay device off. Rappel the fixed line with the tail knotted; clean the draws on the way down or on a second top-rope solo lap.」
   （哪一股繩、清快扣的作法要回 bergundsteigen 原文核對）

4. 🔴 **「在低處多打一個結縮短繩長」沒有來源，物理上也講不通（第 151 行）。**
   原句：「低處的難點要特別小心，或在低處多打一個結縮短繩長。」en：「or tie an extra knot low down to shorten the stretch」
   為什麼：Petzl 的原文只講「延展約 10%，50 m 的路線前 5 m 可能落地，連只是坐在繩上休息也會」，沒給這個對策。扣在吊帶上的備份結並不會減少你上方繩子的延展。讀者可能以為打了結就沒有落地風險。另外，10% 是指一般繩子，靜力繩延展小很多，但文章也說頂繩獨攀可以用靜力繩，兩處沒有對上。
   zh 改寫：「[Petzl](…) 提醒，繩子受力時大約會延展 10%（動力繩；靜力繩少很多）。50 公尺的固定繩，前 5 公尺掉下來可能落地，連坐在繩上休息也會。把前幾公尺當成可能落地的區段：低處有難點的路線先不要選。」
   en 改寫：「[Petzl](…) notes that rope stretches around 10% under load (dynamic rope; static stretches far less), so on a 50 m line the first 5 m are a groundfall zone, even if you only sit back to rest. Treat that section as unprotected and skip routes with a low crux.」

5. 🟡 **「扣在吊帶不同位置」沒說是哪裡（第 186 行，還有圖上的「兩個器材分開扣」）。**
   為什麼：讀者可能扣到裝備環上。Petzl 寫的是兩個器材各用一個獨立的有鎖鉤環，鎖門方向相反。
   zh 改寫：「兩個器材各用一個有鎖鉤環，扣在確保環（或繫入點）上，不要扣裝備環；兩個鎖門方向相反」
   en 改寫：「Each device on its own locker on the belay loop (or tie-in points), never a gear loop; gates opposite」

6. 🟡 **先鋒獨攀地面固定點的那句 128 字，作法讀不懂（第 207 行）。**
   原句：「運動攀登路線常見的作法，是用 stick clip 把前兩個 bolt 串成一直線，第一個 bolt 掛鋼製有鎖鉤環，第一個 bolt 壞了，繩結會卡在第二個 bolt 上」
   為什麼：「串成一直線」是什麼、繩尾綁在哪裡、哪個結會卡住，都沒說。這是整層最關鍵的一個裝置。
   建議：拆成三句，或補一張小圖。
   zh：「運動攀登路線常見的作法是 inline 固定點：用 stick clip 把繩子扣進第一和第二個 bolt，繩尾在第一個 bolt 下方打結、扣上鋼製有鎖鉤環。你墜落時，第一個 bolt 擋住往上的力；它壞了，繩結會往上滑到第二個 bolt 卡住。」（繩子確切怎麼走要回 bergundsteigen 原文核對）
   en 照同樣三句的結構寫。

7. 🟡 **inline 來源漏了（8.5）。** 以下句子有引述或外部事實，但那一句本身沒有連結：
   - 第 47 行：HowNOT2 說明欄的引述「你不知道自己不知道什麼」（🔴，這是直接引述）
   - 第 68 行：「AAC 的三個頂繩獨攀案例」
   - 第 69 行：Petzl 建議帶下降器
   - 第 70 行：Donner Summit
   - 第 151、165 行：Petzl
   - 第 201、230 行：Silent Partner 說明書
   - 第 222 行：Barghahn 的引述，以及 Roc Solo 創辦人的故事
   - 第 232、302 行：Barghahn
   - 第 289 行：Kirkpatrick 的 Eiger 經驗與引述
   - 第 304 行：Avant 的多繩距影片
   - 第 347 行：Valkyrie
   修法：Petzl 補技術說明連結；Barghahn 補 bergundsteigen；Avant 補 `lx0iwchriQ0`；Donner Summit、Valkyrie、三個案例連到第 5 篇的對應段落。

8. 🟡 **第 4、6 條規則和練習題 1 提到 Donner Summit、Valkyrie，卻沒有交代案情。**
   為什麼：沒讀過第 5 篇的讀者看不懂。
   zh：第 68 行改成「[第 5 篇的三個頂繩獨攀案例](/posts/climbing/2026-10-19-free-solo-rope-solo#…)，都是熟練的人因為風大、趕時間或忘了東西，臨時改了平常的做法：例如 2021 年 Donner Summit 那位爬了十年的攀登者，因為風大把兩個器材改成一個，墜落約 50 英尺。」第 70 行和第 347 行都用一句話交代是哪個案例，並附連結。
   en 照改。

9. 🟡 **影片「不同岩場」只兌現一半。**
   為什麼：description 寫「美國、挪威、日本伊豆城山」，但兩支 HowNOT2 影片在正文裡沒有寫是哪個岩場，EDELRID 那支也沒寫拍攝場地。讀者要的就是「不同岩場的示範」。
   建議：從影片說明欄或字幕查出地點，在影片前那句寫出來，例如「HowNOT2 這集在〈某岩場〉……」。查不到的話，description 改成「搭配 HowNOT2 示範與挪威、日本伊豆城山的實地影片」。

10. 🟡 **違反影片日期門檻（climbing-gear-videos.md 規則 1：影片只收 2024+）（第 291 行）。**
    為什麼：TAKEMOVIE 2021 年的〈ロープソロ技術を考える ②実践編〉被拿來當「他用 GriGri 加 Micro Traxion」的證據。頻道介紹也說「2021 年有三集」。
    建議：找 2024 年以後的替代來源，例如 2026 那支影片的說明欄，或頻道 2024 年以後的影片；找不到就刪掉這半句，只留「這支片沒有講用了哪些器材」。

11. 🟡 **台灣讀者位置（6.65）：全文 0 處台灣。**
    為什麼：讀者是在戶外架頂繩的台灣岩友。前三段沒有交代這件事跟台灣的關係。而且有一個現成的接點：先鋒獨攀的地面固定點在講舊 bolt 斷掉，台灣讀者最常去的龍洞是海岸岩場，鏽蝕 bolt 是切身問題。
    建議：不要自己發明。標成「需作者補：台灣岩場（例如龍洞）一個人去時的狀況：bolt 狀況、手機訊號、器材在台灣買不買得到」。如果站上已有龍洞 bolt 狀況的文章，就在第 205–209 行加一句並連過去。

12. 🟡 **器材表「要注意」這一欄混了好處（第 82 行 CAMP Lift）。**
    為什麼：「很多人拿它當上方器材，因為裝不反、對繩皮溫和」是在講為什麼要用它，不是要注意的地方。放在「要注意」欄，會把廠商用途以外的用法讀成被背書。
    zh 改寫：「廠商用途以外的用法；有人拿來當上方器材（裝不反、對繩皮溫和），下方器材仍要另一個」
    en 改寫：「Outside the maker's listed uses; some climbers run it as the top device (can't be rigged backwards, gentle on the sheath), always with a second device below」

13. 🟢 **其他小問題：**
    - 第 57 行表格的頂繩獨攀「先具備」只寫了「頂繩架設、垂降」，但規則 5 要求帶上升工具。建議加「上升」。
    - 第 169 行標題「新的教訓」：2021 年的事不新。建議改成「Shunt 整個脫離繩子，備份結也救不了」。
    - 第 163 行標題「下來與地形」塞了兩件事。建議改成「怎麼下來、哪些路線別選」。
    - 第 143 行 zh「避免兩個器材互相卡住」，en 是「keeps the two devices from releasing each other」，意思不同。回 AAI 原文統一。
    - 英文版 rappel／abseil 混用（第 289、305 行），建議統一用 rappel。


## post-polish

### 已修正（2026-10-24）

- 1 頂繩獨攀器材清單改成分號短項。2 Owens River 事故拆句。3 Barghahn 長句改分號版。
- 4 「繩子回送」改「繩子被拉回確保器（backfeed）」；「最大的現實是」改「先講清楚」；「落塔」改「落錘測試台（drop tower）」；「拿東西」改「拿背包」。
- 6 備份結補判準（結與器材之間的繩子短到滑落時不會先撞岩階或地面）；「從哪裡開始」補旁掛確保繩的做法。
- 7 TAKEMOVIE 段拆成兩段、刪 2021 片。8 英文 friends → someone；「may or may not back you up」改「may not hold you cleanly」。
- 未改：開頭段的數字（5.8 與 5:43 讀者會用到）。

### 原始報告

**結論：語氣大致乾淨，只要做小幅修整，不用重寫。** 但書密度 5%；引述區塊、模板化轉折、姓名當主詞、一般英文術語都是 0；phrase ledger 沒有命中。

- 長句（>60 字）：約 210 句裡有 31 句，約 15%，剛好在「該處理」的門檻上。主要集中在器材清單和事故段落。
- `check:tw`：8 處「凸輪」，指的都是 Traxion 的內部零件，依 writing-guide 可以保留。

英文版讀起來是自然的英文，與中文的意思一致。只有第 143 行有一處語意差異，已列在 post-review 第 13 點。

### 問題清單

1. **長句集中在器材清單（第 91–93 行）。** 三個清單項目的長度是 74／92／61 字，裡面又有括號套括號。
   建議：把清單項目改成「器材：數量」的短行，或分成「上方／下方／吊帶／其他」四行。
   zh 例（頂繩獨攀）：「- 止退器材兩個：上方一個、下方一個，最好不同型號。 - 胸式吊帶。 - 有鎖鉤環兩到三個、下降器一個、繩子護套。 - 繩尾重物：一個裝了東西的袋子。」
   en 照分行。英文不必拆到這麼短，但可以把括號拿掉。

2. **事故段落一句塞了「時間＋地點＋器材＋結果」（第 209、243、317、318 行，100–111 字）。**
   建議：拆成「發生什麼 → 結果 → 教訓」三句。以第 209 行為例：
   zh：「2015 年 3 月，加州 Owens River Gorge。一名攀登者用 stick clip 一個 bolt 一個 bolt 往上，每次身上只掛一個。那顆舊 bolt 斷了，他從約 25–30 英尺高處墜落死亡。」（數字不動）
   en：已經拆成兩句，不用改。

3. **第 59 行 96 字，是一句很長的引述。**
   原句：「賣帶繩獨攀器材的 Avant 創辦人 Brent Barghahn 說，頂繩獨攀做對了是相對可控的，先鋒獨攀大概複雜、危險十倍，多繩距則要帶緊急通訊、讓朋友知道你的計畫」
   zh 改寫：「Brent Barghahn（帶繩獨攀器材商 Avant 的創辦人）這樣排三層：頂繩獨攀做對了相對可控；先鋒獨攀大概複雜、危險十倍；多繩距則要帶緊急通訊，並讓朋友知道你的計畫（[Avant 影片](…)）。」
   en：分號版本已經可以，不用改。

4. **翻譯腔與台灣用語。**
   - 第 56、232 行「繩子回送」（backfeed）：台灣讀者看不懂。
     zh：「下方繩子的重量把繩子拉回確保器（backfeed）」
   - 第 74 行「帶繩獨攀最大的現實是」（the hard truth）：英文語序直譯。
     zh：「先說一件不太舒服的事：」或「先講清楚：」
   - 第 161 行「落塔」：建議寫「落錘測試台（drop tower）」。
   - 第 43、291 行「每爬完一段都要先下去拿東西」：「拿東西」太含糊，實際是回收保護點。
     zh：「先垂降回去收保護點」
   - 第 201 行「跳一下給你緩衝」：可以保留，台灣確保課也這樣講（soft catch）。

5. **數字密度：開頭段 5 個數字（第 43 行）。**
   建議：把「2026 年 3 月」改成「今年 3 月」，或拿掉月份。5.8 和 5:43 讀者會用到，保留。
   其他 4 個數字的段落是事故日期與距離，屬於案例必要資訊，可以留。

6. **可執行動作缺了兩處。**
   - 第 159–161 行「備份結每隔一段打一個」：沒有說多遠，讀者做不出來。
     建議：補一個有來源的間距或判準。如果來源沒給，就寫判準。
     zh：「讓器材到結之間的繩子短到滑落時不會撞上岩階或地面」
   - 第 335 行「頂繩獨攀可以在旁邊再掛一條有人確保的繩子」：這個建議很好，但缺一句怎麼做。
     zh：「請繩伴在旁邊用另一條繩子幫你確保，鬆繩留一點，讓你的獨攀系統先吃力」
     en 照補。

7. **「但書換位置」：第 291 行 TAKEMOVIE 段 108 字。** 一段裡依序講了路線、器材不明、2021 片、說明欄、落石五件事。
   建議：把「器材不明＋2021 片」移到影片下方一句，或照 post-review 第 10 點刪掉。落石那句獨立成一句，當作段落結尾的教訓。

8. **英文版小修：**
   - 第 59 行「friends who know your plan」改成「someone who knows your plan」，跟規則 1 一致。
   - 第 161 行「a backup knot may or may not back you up」：俏皮但模糊。建議改成「a backup knot may not hold you cleanly」。
