# Review: 2026-10-19-onsight-flash-tactics

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-onsight-flash-tactics.md`
Sources opened: the Morenas 2021 full text (PMC8657215, via the PMC BioC API); PubMed abstracts via eutils for Boschker & Bakker 2002 (12365268), Boschker, Bakker & Michaels 2002 (11880247), Seifert 2017 (28441425), Whitaker 2020 (31667757), Sanchez 2012 (20561271) and Giles 2026 (42304823); and, via r.jina.ai, the UKC Berry article and both Gresham articles on climbing.com. A direct curl of the UKC page was bot-blocked (5 KB stub), so the publication date could not be read.

## post-verify

Verdict: no blockers. All the percentages, grades and coach quotes match their sources. The problems: one comparison is overstated (real model vs video), one study is cited with no link and misframed (Giles 2026), and one Seifert finding contradicts another post on this site.

1. **should-fix**, line 49 and tldr: 「看真人和看影片都比不看好，看真人又比看影片好。」
   - Problem: the paper says the opposite on the second half: "when comparing both instruction methods, no significant differences were found, although there is a tendency towards better output performance for the 'real-model' condition". Only the two flash conditions vs onsight differed. The tldr's three-number ladder (18% / 43% / 61%) invites the same reading, and so does 「想送就先看人爬」 if it's read as "live beats video".
   - Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC8657215/ (Discussion; Table with NP 18.25%, VP 42.86%, RP 61.11% of 126 attempts)
   - Fix: 「看真人和看影片都明顯比不看好；看真人的數字更高，但兩者的差距沒有達到統計顯著。」

2. **should-fix**, line 127: 「onsight 是三種方式裡最容易怕的。Giles 等人 2026 年的研究看到，線越超出自己的 onsight 能力，焦慮越高、自信越低、動作越差。」
   - Problem, three parts. (a) No link, and Giles 2026 is missing from 參考資料. The rule is that every research claim gets an inline link. (b) The study didn't compare onsight, flash and redpoint; all 61 climbers did a single onsight lead. So it cannot support 「三種方式裡最容易怕」. (c) The anxiety and confidence differences were between the **above-level** group and the at-level and below-level groups. 「越……越……」 implies a smooth gradient. Performance (entropy) did improve with ability relative to the route.
   - Source: https://pubmed.ncbi.nlm.nih.gov/42304823/
   - Fix: 「挑超出自己 onsight 等級的線，最容易怕。[Giles 等人（2026）](https://pubmed.ncbi.nlm.nih.gov/42304823/)讓 61 位中級到進階者各 onsight 一條先鋒線：挑高於自己等級那組，身體焦慮和認知焦慮都明顯較高、自信較低，動作流暢度也較差。」 Add it to 參考資料. Drop the 「三種方式裡」 claim, or label it 推論.

3. **should-fix**, cross-post consistency. Line 77 is **correct**: 「掃視整條線的次數越多，上牆後花在試探岩點的時間比例反而越高，真正換點的時間比例越低」, matching "number of scan paths was positively correlated with relative duration of exploration and negatively correlated with relative duration of hold changes". But 〈休息、讀線與自己定線〉 (2026-10-18-resting-route-reading.md line 48) says the opposite: 「來回掃視整條路線越多次的人，在牆上摸索岩點、換點的時間越少」. This post links to that one in the next paragraph, so readers see two contradictory summaries of the same study.
   - Source: https://pubmed.ncbi.nlm.nih.gov/28441425/
   - Fix: don't change this post. Fix the 2026-10-18 post's line 48 through `post-update` (outside this series' scope, so flag it to the lead).

4. **nit**, line 41 and tldr: 「21 位進階攀岩者爬 6c 的抱石題」. The climbers were 7b–7c+. There were 18 problems, each with 6 holds, graded 6c on the French route scale, well below the climbers' level. That context matters for how far 61% generalises to limit attempts. Fix: 「21 位 7b–7c+ 的攀岩者，爬 18 題遠低於自己程度的 6c 短抱石（每題 6 個點）」.

5. **nit**, line 77, Seifert 2017: no sample is given. It was 8 inexperienced and 10 experienced climbers, a 10 m top-rope route at 5b. Source: https://pubmed.ncbi.nlm.nih.gov/28441425/ . Fix: add 「18 人、頂繩」.

6. **nit**, line 112: 「Berry 把『猶豫』列為 onsight 最大的障礙之一。」 She writes "The biggest hurdle in onsighting is the Great Unknown… all too often it makes climbers indecisive". The biggest hurdle is the unknown, and indecision is what it causes. Source: https://www.ukclimbing.com/articles/skills/the_unknown_top_ten_tips_to_improve_your_onsight_grade-9300 (tip 9). Fix: 「Berry 說 onsight 最大的障礙是未知，而未知最常讓人變得猶豫。」

7. **nit**, line 102: 「陡的、明確的段落快一點，平緩、技術性的段落慢一點」. Source: "quicker on steep, hard ground, slower on gentler ground where you can comfortably read ahead". 「明確」 and 「技術性」 are not in the source. Fix: 「陡、難的段落快一點；平緩、可以舒服往前讀的段落慢一點」.

8. **nit**, line 64, Gresham level 3: the table leaves out his caveat that this level "is not recommended to low-grade climbers as it may create confusion". He also says to go through the route "three or four times" at this level. Source: https://climbing.com/skills/reading-routes . Fix: add 「（Gresham 說這級不建議給程度還低的人用，會讀到混亂）」 to the 3 row, or under the table.

9. **nit**, line 83: 「新手常高估自己。」 The abstract says skilled climbers were "less confident, but perceived their action capabilities more accurately". 「高估」 is a reasonable reading but is not stated. Source: https://pubmed.ncbi.nlm.nih.gov/31667757/ . Fix: 「程度較低的人比較有自信，但判斷比較不準。」

10. **nit**, 參考資料 titles and dates. The Gresham 2022 page is titled "Increase Your Onsight Grade By Reading Routes From the Ground" (published 28 Feb 2022; originally *Rock and Ice* issue 203). The Gresham 2023 page is "Improve Two Grades Instantly With Coach's Magic-Bullet Advice. Six Tips That Actually Work." (17 Aug 2023). The listed titles don't match either page. The UKC article's 「2017」 could not be confirmed on the page (no date in the readable text; the raw page is bot-blocked). Fix: use the on-page titles; check the UKC date in a browser, or drop the year.

🟢 Confirmed (no change needed):
- Morenas 2021 (University of Extremadura, Spain): 21 advanced climbers (7 F / 14 M); three conditions; completion 18.25% / 42.86% / 61.11%; the authors explain the result as perceiving how holds can be used (affordances).
- Boschker & Bakker 2002: 24 inexperienced men watched an expert video model, then climbed faster and more fluently (geometric entropy), using the information from the video.
- Boschker, Bakker & Michaels 2002: 7 experts, 4 novices, 9 inexperienced; reproduced 23 holds on a scale model; experts recalled more, in clusters, focused on function; inexperienced participants recalled structural features.
- Whitaker 2020: skilled climbers were less confident but more accurate.
- Sanchez 2012: 29 men; 3-minute preview; no effect on completion; fewer and shorter stops. Matches what 〈休息、讀線與自己定線〉 says.
- Berry (UKC): tip 1, 「看路線，少看 YouTube」 and "work out better beta than the video"; the flash fallback (watch a friend, have them talk it through, see how much you retain); route mapping; warm-ups as practice, then retrying moves on the way down; inefficient clipping (overreaching, bent-arm, poor holds) and double clips; the driving metaphor (hazards = crux, red lights = rests, lane = which hand); plan 3+ moves ahead; tip 9, 2–3 sequences for the crux, Plan B; tip 10, fear heightened on limit onsights, practice falls on a similar route; tip 7, don't announce the onsight attempt to your belayer.
- McClure quote: an accurate translation of "Most climbers fall into the trap of stopping when they need to get going…". Also confirmed: find the hard sections from the ground, take rests even when you don't need them, attack the crux forcefully.
- McHaffie ("move fast once fully committed and keep going until you hit gear or a shakeout") and Söderlund ("Don't hesitate… better to take a chance than wasting energy"). The British and Swedish attributions are correct.
- Gresham levels 0–3 as tabulated (0: first two warm-ups; 1: warm-ups 3–4, all holds and a quick hand sequence; 2: onsight range, hands, rests and clips, repeat twice; 3: at or slightly above max onsight, plus key feet and body positions, repeat three times). Also confirmed: view from below and from the side; many people read only the first half; plan hands exactly and note only key feet; the best clipping hold is level with the draw or one above, but hold size decides; review the route afterwards.
- Gresham 2023: "flash-pump", impossible to flush; a mid-grade route to 60–80% pumped before a hard onsight.
- Safety: hands off to post 1 for fall practice; no harmful advice.

Scope statement: this pass checked the ~40 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: ready once the Giles citation and the real-vs-video framing are fixed. Mechanical checks are clean apart from the `-en` link, which is being written now and is not flagged.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `node scripts/check-process-leak.mjs` → pass.
- `pnpm check:references` → only error is the `-en` link (expected).
- `register-scan.sh`: 3 long sentences out of ~56 paragraphs; caveat density 14%; 1 blockquote (McClure, which earns its place); no paragraph with ≥4 numbers; names-as-subject 0 (a false negative, see post-polish); 0 template transitions.
- `scan-ledger.sh` → no hits.
- Internal links resolve: 2026-10-17-grades-and-protection-ratings, 2026-10-18-resting-route-reading, 2026-10-19-climbing-fear-of-falling, 2026-10-19-climbing-mental-tactics-overview, 2026-10-19-redpoint-projecting-tactics. No links to sibling series.

1. **should-fix**: evidence labels. Line 119 is a good model: 「這些都是教練和頂尖攀岩者的經驗，沒有對照研究」. The other coach sections (Gresham's levels at line 57, Berry's route map and warm-ups at line 89, the on-wall reading at line 100, the flash-pump advice at line 121) carry no 研究／教練共識／推論 tag, though the series promises one. Fix: add 「（教練共識）」 to those section leads, and 「（研究）」 to the Morenas, Boschker, Seifert and Whitaker paragraphs.

2. **nit**, line 37: 「這篇只補兩件事：新的研究證據，以及什麼時候該投入。」 The post also covers Gresham's reading levels, route maps and warm-ups, and on-wall reading and pacing. Those are more than two things, and some overlap with 〈休息、讀線與自己定線〉 (which already cites Morenas, Seifert and Sanchez 2012). Fix: 「這篇補三件事：研究怎麼看 onsight 與 flash、讀線的分級與練法、什麼時候該投入。」 Overlap is acceptable: this post goes deeper and links back, so topic ownership (6.8) passes.

3. **nit**: frontmatter is fine. Required fields present; 5 existing tags; `type: guide`; description and tldr are distinct; the series name matches `src/utils/series.ts`. The title is long (four clauses). Consider 「第一次爬一條線：onsight 還是 flash、讀線讀多久、什麼時候投入」.

Taiwan reader position (6.65): acceptable for a global technique topic. The opening uses a 5.10d gym scene, and the glossary notes 「台灣岩館多直接說『分享 beta』」. No Taiwan crag example is needed. Structure: each section ends with a 今晚就能做的動作; the practice questions with `<details>` follow the series convention.

## post-polish

Verdict: reads well. One density issue.

1. **should-fix**: names as subject. 「Berry……」 drives the paragraph at lines 51, 89, 94, 100, 112, 127 and 132; Gresham at lines 57 and 121; McClure at line 106. That is about ten paragraphs. The scanner reports 0 because the names are link text or plain Latin names. Lead with the advice and attribute it once per section, e.g. line 94: 「掛繩也要在地面規劃：伸太遠、彎手掛、在差點上掛最沒效率，能一次掛兩支更好（Berry）。」 Keep named attribution for the pro quotes (McClure, McHaffie, Söderlund), where the speaker matters.

2. **nit**, line 51 (71 characters): 「UKClimbing 的 Natalie Berry 在〈提升 onsight 等級的十個建議〉第一條就是『看路線，少看 YouTube』：……」. Break it after the quote: 「……第一條是『看路線，少看 YouTube』。忍住不先查 beta，自己想動作，反而可能想出比影片更適合你的方法。」

## Fix log (2026-10-19)

post-verify
1. should-fix real vs video → fixed (body line 49 uses suggested wording; tldr adds "真人和影片之間的差距沒有達到統計顯著"; description changed to 「先看人爬或看影片都比沒看好」).
2. should-fix Giles 2026 → fixed (inline link, 61 climbers single onsight, above-level group vs others, no gradient; 「三種方式裡」 dropped; added to 參考資料 with title from PubMed efetch).
3. should-fix cross-post Seifert contradiction → not fixed here (out of scope; 2026-10-18-resting-route-reading.md line 48 needs post-update; flagged to lead).
4. nit Morenas sample → fixed (body and tldr: 7b–7c+, 18 problems, 6 holds, well below level; practice Q1 notes generalisation limit).
5. nit Seifert sample → fixed (18 位、10 公尺、5b 頂繩).
6. nit Berry "biggest hurdle" → fixed.
7. nit pacing wording → fixed.
8. nit Gresham level 3 caveat → fixed (note under table; 「重讀三到四次」).
9. nit Whitaker 高估 → fixed (suggested wording).
10. nit reference titles/dates → fixed (on-page Gresham titles + dates). UKC year: re-fetched via r.jina.ai, no article date in readable text (only image timestamps ~2017-04); year dropped.

post-review
1. should-fix evidence labels → fixed (（研究） on Morenas, Boschker ×2, Seifert, Whitaker, Giles; （教練共識） on Berry tip 1, Gresham levels, route map/warm-ups, on-wall reading, flash-pump).
2. nit 「只補兩件事」 → fixed (三件事 wording).
3. nit long title → fixed (suggested shorter title).

post-polish
1. should-fix names as subject → fixed for Berry/Gresham paragraphs (advice first, attribution in parentheses); kept named attribution for McClure, McHaffie, Söderlund, and Berry's "biggest hurdle" line (a direct claim of hers).
2. nit line 51 long sentence → fixed (split after the quote).
