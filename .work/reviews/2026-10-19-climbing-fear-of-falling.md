# Review: 2026-10-19-climbing-fear-of-falling

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-climbing-fear-of-falling.md`
Sources opened (full text unless noted): UKC Findlay article; Lattice × Maguire (2022-04-07); Warrior's Way "Overcome Fear of Falling" (Groundlane web_fetch; curl/jina hit a CAPTCHA) **plus** the official Warrior's Way PDF "10 Tips For Practicing Falling" (© Arno Ilgner 2024, https://warriorsway.com/wp-content/uploads/2024/04/Lead-Magnet-for-FCO_Falling-Tips.pdf); Ilgner, Climbing 2018; MacLeod shop page; Fun With Rocks review (2010); Craske 2014 (PMC full text); Frenkel 2019 (PMC full text); Garrido-Palomino 2023 (PubMed abstract via eutils; n from the research note's thesis lookup); Hafer, Climbing 2025-05-19; Wild Lily course page (curl, full HTML).

## post-verify

Verdict: 1 blocker. Most claims match their sources closely. The blocker is in the terrain section: it misstates what Warrior's Way says and leaves out the vertical-wall recommendation that the series plan asks to be shown side by side. The other problems are a missing sample size, a MacLeod claim the linked page doesn't support, and unsourced numeric thresholds.

1. **blocker** — line 104: 「Warrior's Way 把盪擺、slab、屋簷、掛繩時墜落放在進階階段，仍然用同樣的小步漸進。」
   - Problem: the cited page (overcome-fear-of-falling) mentions no slab, roof or pendulum stage. The official Warrior's Way PDF does list advanced falls: "falling while clipping a draw, a pendulum, or any specific fall you're fearful of" (Tip 10). It has **no slab or roof**. More important, its Tip 3 **contradicts Lattice**: "You may think the best terrain is falling on really steep terrain so you don't hit anything… That's not the terrain you want… That is usually vertical. So select routes that are vertical." The section opens with 「教練意見不完全一樣」 but never shows the actual disagreement. The plan's order-1 card requires 「微外傾 vs 垂直地形並列」.
   - Sources: https://warriorsway.com/wp-content/uploads/2024/04/Lead-Magnet-for-FCO_Falling-Tips.pdf (Tips 3, 10); https://warriorsway.com/overcome-fear-of-falling/ ; https://latticetraining.com/blog/fear-of-falling
   - Fix: 「Warrior's Way 的看法相反：它的〈練摔十個建議〉說，很多人以為在大外傾摔最安全，但練習應該貼近你實際會爬的地形，通常是垂直牆，所以直接選垂直路線。掛繩時墜落、盪擺這類比較真實的墜落，放在分段練習之後。」 Add the PDF to 參考資料. Then rewrite the trade-off paragraph (line 106) as a choice between two named positions.

2. **should-fix** — line 41: 「這個研究人數很少」
   - Problem: the series plan requires the sample size next to the claim. Study IV of the thesis has n=11 (research note, dialnet tesis 345815). The abstract doesn't give n. The post also leaves out that the **general-training group improved its climbing ability too**, and its cognitive anxiety also fell. The difference between groups was somatic anxiety and confidence.
   - Source: https://pubmed.ncbi.nlm.nih.gov/37965818/
   - Fix: 「……找了 11 位有墜落恐懼的女性攀岩者……兩組的攀岩能力都進步；心理組的認知與身體焦慮都下降（一般訓練組只降了認知焦慮），自信也提升得比較多。」

3. **should-fix** — line 51: 「Dave MacLeod 在《9 out of 10 Climbers Make the Same Mistakes》用一整部談墜落恐懼，[目錄](…)裡有一節是「把墜落排進每天的攀爬」。」
   - Problem: the linked shop page has no table of contents. It shows the blurb, the price and a Gresham quote, and contains no "fall" text at all (checked with curl and grep). The only source that opened, the 2010 review, says "One section of his book is devoted to falling". That is 「一節」, not 「一整部」. The research note marks the book text ⚪ (not read).
   - Sources: https://www.davemacleod.com/shop/9outof10climbers ; http://wednesdaysrocks.blogspot.com/2010/01/9-out-of-10-climbers.html
   - Fix: 「Dave MacLeod 的《9 out of 10 Climbers Make the Same Mistakes》有一章談墜落（[讀者書評](…)轉述）……」 Drop the TOC claim and the 「目錄」 link label, or keep the shop link only as the book's page.

4. **should-fix** — lines 55 and 98: 「超過 6 分的那一次，下次就退回前一個高度」 / 「最多 20 分鐘就停」
   - Problem: no source gives either number. Lattice says only "limit the time of the session"; Findlay explicitly warns against "following a prescribed routine… because the load and intensity… depends on your level of comfort with falling in that moment". The overview review already flagged an invented threshold (「3 分」) for the same reason. There is a sourced alternative: Warrior's Way's "After 6-10 falls, switch roles with your belayer. More falls than this creates fatigue".
   - Sources: https://latticetraining.com/blog/fear-of-falling ; https://www.ukclimbing.com/articles/skills/where_climbers_go_wrong_with_fall_practice-15536 ; Warrior's Way PDF Tip 6
   - Fix: label both as 「本篇隨手定的粗略判準」, or replace 20 分鐘 with 「每輪 6–10 次就換確保者（Warrior's Way）」.

5. **should-fix** — the ladder section (lines 77–98), coverage of Findlay's caveat
   - Problem: the post gives a fixed ladder. Findlay's closing advice is that the main takeaway is "get the challenge level right. That means not following a prescribed routine such as 'clip and drop'". The post cites Findlay all through but leaves this out, so readers may run the ladder as a script.
   - Source: https://www.ukclimbing.com/articles/skills/where_climbers_go_wrong_with_fall_practice-15536
   - Fix: add one line under the mermaid chart: 「Findlay 提醒，階梯只是參考順序；每一階要不要往上，看你當下的身體訊號，不是照表操課。」

6. **nit** — line 66: 「只要出現一項，就退回比較簡單的墜落……Findlay、Lattice 和 Arno Ilgner 都這樣教。」 Only Lattice says "go back to an easier fall". Warrior's Way says "Don't progress until you're doing BEB with quality", which means hold, not retreat. Findlay describes these signs as ingraining fear. Fix: 「Lattice 明說要退回；Warrior's Way 說 BEB 做不好就不要往上加；Findlay 說這些訊號代表正在加深恐懼。」

7. **nit** — line 51: 「一年累積幾千次」 depends on a condition in the review: "if you do 20 routes per session (that's a lot!), 3 times per week". Add 「如果每次爬 20 條、一週三次」. Source: the wednesdaysrocks review.

8. **nit** — line 139: 「後來接受 EMDR……才慢慢改善」. Keatts says "EMDR seems to have helped, but when I'm tired or on the first climb, I can panic more." Fix: 「後來接受 EMDR，他說似乎有幫助，但累的時候還是會恐慌」. Source: https://www.climbing.com/skills/for-me-climbing-fall-practice-was-bad-advice/

9. **nit** — glossary 墜落練習 context: 「包裝成「墜落以及心理因素訓練」課程」. On the linked 2025 course page the course is called 「墜落訓練以及動態確保」, and its description mentions 心理因素訓練. The quoted name does not appear on that page. Fix: 「台灣有傳攀工作室開「墜落訓練以及動態確保」課，內容包含心理因素訓練。」 Source: https://www.wildlily.rocks/2025%E5%90%84%E9%9A%8E%E6%AE%B5%E8%AA%B2%E7%A8%8B

10. **nit** — 參考資料 dates. Lattice has no year; it is 2022-04-07. Warrior's Way is tagged 「2024」 but the page shows no date (its images are from 2020-01), and the PDF is © 2024. Fix: Lattice 2022; Warrior's Way 「未標日期」, and add the PDF as its own 2024 entry.

🟢 Confirmed (no change needed):
- Frenkel 2019: 214 participants over 4 experiments; all male (the authors flag "only male participants were tested"); novices (≤5 h of experience); 12 m top-rope; a "jump into the rope" of about 3 m; state anxiety up in all four; cortisol up in only one of four. https://pmc.ncbi.nlm.nih.gov/articles/PMC6813738/
- Findlay UKC (Jan 2024): tarantula bath; "injury of the mind"; micro-trauma "more disastrous… than a pulley tear"; not falling enough and the fingerboard analogy; rushing the fall and anticipation; jumping off vs a passive departure, look down once airborne; clients less comfortable than they think, holding breath, grabbing the rope, closing eyes; hard catch from taking in rope; extra slack is "a poor substitute for the skill of dynamic belaying"; belayer moves toward the first bolt; "just take falls that are a little uncomfortable".
- Lattice/Maguire: the PG-13 dose; grab the rope / tense / close eyes and scrunch face / can't breathe slowly → easier fall; TR bounces with arms by your side; then lead below, at, and above the bolt, clip-then-fall, fall mid-move; then redpoint integration; start slightly overhanging, then vertical or slab; terrain specific to your goals; fear is fatiguing, so limit the session; easy session on stressful days; release ego; the brain as a muscle.
- Warrior's Way page: BEB; increment when "your body has assimilated the stress" rather than when you think you're comfortable; the warm-up integration (TR fall at the overhead bolt, then a small lead fall, then a longer one, high enough not to hit the belayer).
- Ilgner, Climbing 2018-07-30: exhale throughout; look down while falling; knees up level with hips; don't grab the rope.
- Craske 2014: inhibitory learning leaves the original association intact; renewal when the context changes; expectancy violation; fear reduction during exposure "is not predictive" of follow-up fear. Craske is at UCLA.
- Hafer 2025-05-19: father's stroke, "the more I fell, the worse I felt"; the Crane quote is verbatim; the ankle-on-ledge case, "only for that day"; Findlay course eustress vs distress; Hörst's "single season… many years"; "learn when to say 'take'".
- Wild Lily: course description covers 心理因素訓練, protecting yourself in a fall, and dynamic belay to reduce impact.
- Safety: the counter-indication list and the psychologist/psychiatrist referral are appropriate.

Scope statement: this pass checked about 45 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: publishable once the blocker and the label and glossary issues are fixed. Mechanical checks are clean apart from the -en link, which is expected and being written.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `register-scan.sh` → 68 paragraphs; long sentences 0; caveat density 7%; 1 blockquote; 1 paragraph with ≥4 numbers (line 39); names-as-subject 0. That last count is a false negative; see post-polish. Template transitions 2.
- `scan-ledger.sh` → template hits at lines 73 and 125 (see post-polish). No Taiwan-term hits.
- `pnpm check:references` → only `/posts/climbing/2026-10-19-climbing-fear-of-falling-en`, which is being written, so not flagged.
- Internal links resolve: overview, performance-anxiety, gym-lead-climbing. The section names cited in gym-lead (「先鋒墜落怎麼練」, 「接墜：硬確保還是軟確保」, 「在台灣怎麼學、怎麼考」) exist.

1. **should-fix** — evidence labels. Line 43 promises 「本篇的建議多半標「教練共識」」, but no section or claim carries the tag. Only the Craske section is tagged 「（推論）」. The 今晚 actions are the series' own heuristics. Fix: add 「（教練共識）」 to the 原則一、原則二、階梯 and 確保者 headings, 「（教練意見分歧）」 to 地形, 「（個人經驗＋心理師意見）」 to the 反效果 section, and 「（本篇建議）」 to the actions that use invented numbers.

2. **should-fix** — glossary 軟確保: 「確保者在攀爬者墜落時跟著往牆的方向移動一點」. In 〈岩館先鋒〉's table, 「往牆靠近一兩步」 is the **hard** catch, and the soft catch is 「留在原位或退回原位」, letting yourself be pulled up. The glossary wording collides with the post it hands off to. Findlay's phrasing is "allows themselves to move towards the first bolt… at the right moment", and Warrior's Way's is "allowing themselves to be pulled up about 6 feet". Fix: 「確保者在攀爬者墜落時，順著拉力被往上、往第一支快扣的方向帶一點，讓制動慢一點……」.

3. **nit** — topic ownership (6.8). The ladder's lead steps (below the bolt → at the bolt → above it) repeat 〈岩館先鋒〉's 「由小到大」. That's acceptable, because this post adds the TR stages and the retreat rule. Keep the lead steps one line long and point to gym-lead for 怎麼掉. As written it passes.

4. **nit** — the 「地形」 and 「什麼時候墜落練習會變成反效果」 sections have no 今晚就能做的動作. For 反效果: 「這週練摔前先問自己：最近生活壓力幾分？摔傷過的情境有沒有讓你恐慌？兩題有一題是『很高／有』，今天就只做頂繩彈跳或不練。」

5. **nit** — frontmatter: required fields present; 5 tags, consistent with the existing climbing tags (`belay` is in use); `type: guide`; the description and tldr are distinct; the series name matches `src/utils/series.ts`. The tldr's numbers and attributions match the body.

Taiwan reader position (6.65): passes. The post mentions 龍洞's vertical sandstone and a Taiwan course. Structure (guide): the principles, ladder and counter-indications are all present.

## post-polish

Verdict: reads well. The sentences are short and the one blockquote earns its place. The main issue is coach names at the start of most paragraphs.

1. **should-fix** — names as subject. Lines 47, 49, 59, 68, 73, 102, 104, 110, 117 and 135 open with 「Hazel Findlay 在／Lattice 建議／Findlay 還點出／Ilgner 的／Warrior's Way 把／Findlay 指出／Lattice 還提到／Alice Hafer 在」. That is ≥6, past the threshold. The scanner reports 0 because the names are link text. In a coach-consensus post some attribution is the point, but lead with the advice. Example for line 49: 「每次墜落的緊張，大概像看一部 PG-13 恐怖片：會怕一點，看完還想再看（[Lattice 與攀岩心理師 Maguire](…)）。」 Keep one named anchor per section.

2. **nit** — line 39 (Frenkel) has 214, 12 公尺, 3 公尺, 四個實驗 and 一次. Keep 214 and 「跳進繩子」 in the text, and move 12 m / 3 m into the parenthesis.

3. **nit** — template transitions: line 73 「不是看你覺得自己準備好了，而是看身體……」 and line 125 「不是把舊的恐懼記憶擦掉，而是在旁邊學一個新的」 are both earned, since they are the sources' own contrasts. Together with line 53 「兩派的差別不在……」 that makes 3, at the limit. Rephrase line 53 as 「兩派都同意要長期練；分歧在每一次的強度。」

## Fix log (2026-10-19)

post-verify
1. blocker (Warrior's Way terrain) — fixed. Re-opened the PDF (Tips 3, 6, 10 confirmed); 地形 section now states WW's vertical-wall position vs Lattice's slightly-overhanging start, trade-off rewritten as a choice between two named positions; PDF added to 參考資料.
2. should-fix (n, both groups improved) — fixed. n=11 (research note, thesis Study IV); abstract re-fetched via eutils: both PG and TG improved ability, TG only cognitive anxiety. Control group kept.
3. should-fix (MacLeod 一整部/目錄) — fixed. Now 「有一章談墜落，據讀者書評轉述」; 目錄 claim dropped; shop link relabelled 作者商店頁.
4. should-fix (6 分 / 20 分鐘) — fixed. 20 分鐘 replaced by WW「每輪 6–10 次就換確保者」; 6 分 threshold replaced by 「分數明顯跳高」 and labelled 本篇建議的粗略判準.
5. should-fix (Findlay no-prescribed-routine caveat) — fixed. Line added under the mermaid chart.
6. nit (retreat attribution) — fixed per suggested wording.
7. nit (幾千次 condition) — fixed.
8. nit (EMDR wording) — fixed.
9. nit (Wild Lily course name in glossary) — fixed.
10. nit (reference dates) — fixed (Lattice 2022; WW page 未標日期; PDF 2024 entry).

post-review
1. should-fix (evidence labels) — fixed. Labels on 原則一/二、階梯、確保者 (教練共識), 地形 (教練意見分歧); intro paragraph defines the four labels. 反效果 section label put in its first line instead of the heading, to keep the heading 「什麼時候墜落練習會變成反效果」 that the overview cites; invented thresholds marked 本篇建議.
2. should-fix (軟確保 glossary) — fixed (順著拉力被往上、往第一支快扣的方向帶); body and Q3 answer aligned.
3. nit (lead steps overlap gym-lead) — fixed: lead step shortened to one line + link to gym-lead for 怎麼掉.
4. nit (no 今晚 actions in 地形/反效果) — fixed, both added.
5. nit (frontmatter) — no change needed.

post-polish
1. should-fix (names as subject) — fixed in most paragraphs (advice first, name in parenthesis or trailing clause); one named anchor kept per section.
2. nit (line 39 number density) — fixed (12 m / 3 m moved into parenthesis).
3. nit (template transitions) — fixed: line 53 rephrased 「兩派都同意要長期練；分歧在每一次的強度。」

en version: 2026-10-19-climbing-fear-of-falling-en.md written; section "When fall practice backfires" matches the overview-en citation.
