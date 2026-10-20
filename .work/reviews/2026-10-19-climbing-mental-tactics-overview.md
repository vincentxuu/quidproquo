# Review: 2026-10-19-climbing-mental-tactics-overview

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-climbing-mental-tactics-overview.md`
Sources opened: all 11 PubMed abstracts via eutils efetch, the full text of Swinarska (PMC12859972), the Findlay FAQ page (curl), and the Lumby abstract on the publisher page (doi.org → journals.humankinetics.com; the full text is paywalled).

## post-verify

Verdict: no blockers. Every number I checked matches its source: 26 / 32 / 61 / 100 / 21 / 19 participants, 40.1 vs 33.1, 46%, 890% vs 568%, 83 studies, and "7a 10 倍". The problems are about framing. Two study designs are described wrongly, two sample sizes are missing, and one eye-tracking result is pushed further than the abstract supports.

1. **should-fix** — tldr: 「多數研究看到中級攀岩者先鋒時比頂繩焦慮、自信低、動作不流暢，波蘭 100 人的調查裡近一半先鋒時焦慮達高分；常爬先鋒的進階者則沒有差別。」
   - Problem: Swinarska does not say its sample was intermediate climbers. The paper says "100 people practising sport climbing on climbing walls", so putting it under 「中級攀岩者」 misattributes the sample. The clause 「進階者則沒有差別」 rests on one study (Fryer 2013, n=21), but the tldr states it as a general finding. Draper 2012, the other intermediate-level study, also found no difference, so 「多數」 is really 2 of 3 studies.
   - Sources: https://pmc.ncbi.nlm.nih.gov/articles/PMC12859972/ ; https://pubmed.ncbi.nlm.nih.gov/22299663/ ; https://pubmed.ncbi.nlm.nih.gov/21984397/
   - Fix: 「兩個中級者實驗看到先鋒時比頂繩焦慮、自信低、動作不流暢；波蘭 100 位岩館攀岩者裡近一半先鋒時焦慮達高分；一個 21 人的進階者研究則沒看到差別。」

2. **should-fix** — line 51: 「onsight 三條難度相同的線，隨機分配成頂繩、先鋒、先鋒加 run-out」
   - Problem: 「隨機分配」 reads as a between-groups design. The study was repeated-measures: every participant climbed all three routes, in randomized order ("a randomised series of on-sight climbs… a repeated measures design").
   - Source: https://pubmed.ncbi.nlm.nih.gov/40484106/
   - Fix: 「每個人都 onsight 三條難度相同的線，順序隨機：頂繩、先鋒、先鋒加 run-out。」

3. **should-fix** — line 53: 「在岩館問了 100 人……作者自己列了限制：這是橫斷調查……也沒控制攀岩年資和等級。」
   - Problem: 「問了」 undersells what the study did. Each participant actually climbed two routes while heart rate was recorded, and filled in the STAI. The more important omission: **the order was fixed, top-rope first and lead second** ("Each participant completed two climbing routes in a fixed order: first with top-rope belay, and then with lead belay"). Fatigue and order effects are therefore mixed into the lead-vs-top-rope difference, and the post doesn't say so. The limitations the post does list are confirmed in the paper (cross-sectional; convenience sampling; no control for "training experience, climbing grade").
   - Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC12859972/ (Methods, Limitations)
   - Fix: 「在三個城市的岩館找了 100 人，每人先爬頂繩、再爬先鋒（順序固定），爬完填焦慮量表。」 Then add 「順序固定」 to the limitations list.

4. **should-fix** — line 65: 「Baláš 等人（2017）讓進階女性攀岩者爬兩次……升到基線的 890%，全掛是 568%。」
   - Problem: the numbers are correct; 890% vs 568% is for total catecholamines. But the sample was **9 people** and the post doesn't say so. The series plan requires 「樣本數與研究設計附在數字旁」. Line 61 also says 「這些研究的樣本多半在 20–30 人」, and Baláš is well below that. Minor point: adrenaline alone did not show a significant interaction (1920% vs 1045%, n.s.). The significant ones were total catecholamines, noradrenaline and dopamine. The gloss 「腎上腺素一類」 is fine as a description of the class.
   - Source: https://pubmed.ncbi.nlm.nih.gov/27400414/
   - Fix: 「9 位進階女性攀岩者」. Change line 61 to 「樣本從 9 人到 100 人，多數在 20–30 人」.

5. **should-fix** — line 75: 「主要集中在要抓的手點上……人一怕，視線就鎖在下一個手點，看不到腳點和路線。」
   - Problem: the abstract says fixations "were primarily aimed at the holds used for climbing". It does not separate handholds from footholds. 「看不到腳點和路線」 is the author's extrapolation. The full text (J Sport Exerc Psychol) is paywalled and I could not confirm a hand/foot split. Practice question 2's answer repeats the same claim.
   - Source: https://pubmed.ncbi.nlm.nih.gov/18490789/
   - Fix: 「注視的次數和時間都增加，而且多半落在攀爬要用的點上；掃視其他地方的速度下降。」 Write 「看不到腳點和路線」 as a 推論, or find the full text first.

6. **nit** — line 59, Draper 2012: the design was lead **or** top-rope ("an on-sight ascent (lead climb or top-rope)"). Because a route can only be onsighted once, this was almost certainly a between-groups comparison, with the 19 people split into two groups. That is weaker than the within-subject comparisons in the paragraphs above. Also, 6a = 5.10b YDS. Source: https://pubmed.ncbi.nlm.nih.gov/21984397/ . Fix: add 「分成先鋒組和頂繩組」.

7. **nit** — line 67, Giles 2026: the participants were "intermediate to advanced". The anxiety and confidence differences were between the above-level group and the other two groups (at and below level). The post writes 「線越超出能力」, which reads as a smooth gradient. Source: https://pubmed.ncbi.nlm.nih.gov/42304823/ . Fix: 「61 位中級到進階者……挑高於自己 onsight 等級那組，焦慮明顯較高、自信較低」.

8. **nit** — line 87: 「教練這邊也有兩種說法。Giles 2025 的建議是降低認知焦慮、提升自信。」 That recommendation is the conclusion of a research paper (Lattice Training plus the University of Canterbury), not a coach's opinion. Source: https://pubmed.ncbi.nlm.nih.gov/40484106/ . Fix: 「研究者和教練的建議不完全一樣：Giles 2025 的研究結論建議……；Findlay 則……」.

9. **nit** — line 73: 「用同一段橫移路線，一段設在低處、一段設在高處」 contradicts itself. The study used "two identical traverses at different heights". Source: https://pubmed.ncbi.nlm.nih.gov/16025756/ . Fix: 「兩段一模一樣的橫移，一段在低處、一段在高處」.

10. **nit** — line 83, Hardy & Hutchinson 2007: the summary is confirmed. It leaves out the authors' own caveat that "cognitive anxiety may not be the prime determinant of the effort and performance changes". Since this paragraph is pushing back on 「焦慮越低越好」, the caveat should be there. Source: https://pubmed.ncbi.nlm.nih.gov/17999221/

🟢 Confirmed (no change needed):
- Aras & Akalan: 26 intermediate climbers; similar climb time; higher cognitive and somatic anxiety; lower confidence; higher VO₂ (HR difference n.s.).
- Giles 2025: 32 intermediate climbers; somatic anxiety rose only in the run-out condition.
- Swinarska: 40.1 ± 9.2 vs 33.1 ± 6.3; 46% high anxiety on lead.
- Fryer 2013: 21 advanced climbers; no difference in anxiety, confidence or cortisol; HR higher only in the last part of the route; the "accustomed to leader falls" framing is in the abstract.
- Pijpers 2005: climbing time, explorative movements, longer grasping, slower movement; conscious processing hypothesis.
- Mangan 2025: 83 studies; ability correlates with "anxiety facilitation"; New Zealand (Canterbury).
- Findlay FAQ (20 Feb 2022): three common fears; "a 7a can feel 10 times harder on lead compared to top-rope"; "scary parts… interesting parts… wouldn't want to eradicate fear completely"; fear of failure partly by reframing. https://www.hazel-findlay.com/blog/faqs-about-building-a-strong-mind-for-climbing
- Lumby 2026: 5 in the workshops, 3 interviewed, IPA; fear "related to pressure to perform, not danger to physical safety"; "tentative". Abstract only, paywalled. https://doi.org/10.1123/tsp.2025-0179
- Safety: the 「什麼時候不要只靠自己練」 referral line is appropriate. No harmful advice found.

Scope statement: this pass checked the ~30 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: ready to publish once the cross-reference and evidence-label issues are fixed, and once the series' later posts exist. Mechanical checks are clean.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `node scripts/check-process-leak.mjs` → no output (pass).
- `register-scan.sh` → 50 paragraphs; long sentences 0; caveat density 4%; 1 blockquote; 1 paragraph with ≥4 numbers (line 53); names-as-subject 0. That last count is a false negative because the names are link text; see post-polish. 「怎麼做」 paragraphs 0, but the 今晚就能做的動作 blocks are present.
- `scan-ledger.sh` → no hits.
- Internal links. These resolve: 2026-06-20-climbing-books-knowledge-map, 2026-10-17-gym-lead-climbing, 2026-10-18-climbing-training-diagnosis, 2026-10-19-climbing-fear-of-falling, 2026-10-19-climbing-performance-anxiety, 2026-10-19-climbing-competition-mindset (now exists in the batch). **These do not exist yet:** 2026-10-19-onsight-flash-tactics, 2026-10-19-redpoint-projecting-tactics, 2026-10-19-climbing-conditions-friction, 2026-10-19-climbing-skin-care, 2026-10-19-climbing-mental-tactics-overview-en.

1. **should-fix** — the missing links above. These are later posts in the series plus the English version. They must exist before this post ships, or the series map turns into five dead links.

2. **should-fix** — practice question 1's answer: 「先用本篇最後的自我檢查表判斷是怕摔還是怕失敗。」 The table is in the middle of the post, in 「兩種恐懼：怕摔與怕失敗」, not at the end. Fix: 「先用『兩種恐懼』那一節的自我檢查表」.

3. **should-fix** — evidence labels. Lines 41–45 define 研究／教練共識／推論 and promise 「本系列每個建議都標證據等級」, but the body never uses them. The Findlay paragraphs (lines 87, 93–99) are coach consensus. The 「多爬先鋒就會習慣」 idea (line 61) is labeled honestly in prose but not tagged. The 今晚 actions are the series' own heuristics. Fix: tag each section or claim, e.g. 「（教練共識）」 after the Findlay paragraphs and 「（本系列建議）」 on the actions.

4. **should-fix** — line 69: 「兩個分數差 3 分以上，這個系列就是為你寫的。」 No source behind the "3 分" cutoff, and it is presented like a diagnostic threshold. The series plan says not to hand out single thresholds. Fix: drop the number (「先鋒那次明顯比較高，這個系列就是為你寫的」), or label it 「本系列隨手定的粗略判準」.

5. **nit** — line 132: 「第 1 篇最後一節會說明這些訊號」. In post 1, the section 「什麼時候墜落練習會變成反效果」 is followed by 「在台灣哪裡學」, the practice questions and 下一步, so it is not the last section. Fix: name the section.

6. **nit** — frontmatter is fine: required fields present; 4 tags; `climbing-mental` is a new tag, consistent with the existing `climbing-training` / `climbing-injury` pattern; `type: guide`; description and tldr are distinct; series name matches `src/utils/series.ts`. The title is long (about 34 characters) and has two colon-style clauses. Consider 「先鋒為什麼比頂繩可怕：研究看到什麼，你怕的是摔還是失敗」.

7. **nit** — 「系列地圖」 and 「什麼時候不要只靠自己練」 have no 今晚就能做的動作. The series map is navigation, so that's acceptable. The referral section could take one: 「讀這三個訊號，有一項符合就先別練摔，記下來帶去跟心理師談」.

8. **nit** — 參考資料 leaves out the in-text link to 〈攀岩書籍知識版圖〉 (line 128). Every external claim does have an inline link (8.5 passes).

Taiwan reader position (6.65): passes. The opening uses 岩館先鋒卡 and a 5.10a scene, and it connects to the site's own training-diagnosis post. Topic ownership (6.8): passes. Fall mechanics are handed off to 〈岩館先鋒〉 and diagnosis to 〈訓練診斷〉, not rewritten.

## post-polish

Verdict: the register reads well (short sentences, few caveats, one blockquote). The one real issue is that the research section keeps putting author names first as the subject.

1. **should-fix** — the research section, lines 49–75. Eight consecutive paragraphs open with 「[作者 等人（年）](link)＋動詞」: Aras, Giles, Swinarska, Fryer, Draper, Baláš, Giles 2026, Pijpers, Nieuwenhuys. The scanner reports 0 only because the names are link text. The polish threshold (≥6) is crossed. New leaders don't follow researchers' names. Lead with the finding and move the name into the link, e.g. 「同一條線爬兩次，先鋒那次比頂繩焦慮、自信低，耗氧也比較高（[Aras 與 Akalan 2014](...)，26 位中級者）。」 Keep one named anchor per sub-section at most.

2. **nit** — line 53 (Swinarska) has 5 numbers in one paragraph (100, 40.1, 33.1, 46%, plus the limitations). Keep 100 and 46% in the text. Move 40.1 / 33.1 into a parenthesis or a `<details>` block, as the series plan suggests for physiological numbers and study design.

3. **nit** — template transitions: the scan found 0. Line 77 「不是你突然變弱，是焦慮改變了你的動作方式」 is the only contrast skeleton, and it earns its place. Keep it.

## Fix log (2026-10-19)

Applied by FX0. Unpublished post, so no 更新紀錄 section. Slug and date unchanged. Before editing I re-opened the sources: PubMed abstracts 17999221, 18490789, 27400414, 21984397, 42304823 (eutils), and the Swinarska full text (PMC BioC: "three Polish cities", "fixed order: first with top-rope belay, and then with lead belay").

post-verify
1. tldr misattribution / 「多數」 → fixed. Now reads: two intermediate experiments found a difference; Polish 100 gym climbers; one 21-person advanced study and one 19-person intermediate study found none.
2. Giles 2025 「隨機分配」 → fixed. Now 「每個人都 onsight 三條…順序隨機」.
3. Swinarska 「問了」 and the fixed order → fixed. Rewritten as three cities, 100 people, top-rope first then lead in a fixed order, then the anxiety questionnaire. Order/fatigue confound added to the limitations.
4. Baláš n=9 → fixed. 「9 位進階女性」 and 「總量」 added, labeled 研究，樣本很小. The sample-range line now reads 「從 9 人到 100 人，多數在 20–30 人」.
5. Nieuwenhuys hand vs foot → fixed. Now 「多半落在攀爬要用的點上」. The foot/route extrapolation is labeled 推論, in both the body and the answer to practice question 2. Full text still paywalled, not re-checked.
6. Draper design (nit) → fixed. Now 「各以先鋒或頂繩其中一種方式」 plus 5.10b. The between-groups reading is labeled 推論 because the abstract doesn't state the grouping.
7. Giles 2026 gradient (nit) → fixed. Now 「中級到進階者」 with three groups, above-level group higher anxiety / lower confidence. Movement quality is described per the abstract (it improves as ability relative to the route rises).
8. Findlay vs Giles framing (nit) → fixed. Now 「研究者和教練的建議不完全一樣。Giles 2025 的研究結論建議…」.
9. Pijpers 「同一段…一段設在低處」 (nit) → fixed. Now 「兩段一模一樣的橫移」.
10. Hardy & Hutchinson caveat (nit) → fixed. Added the authors' caveat that cognitive anxiety may not be the prime determinant.

post-review
1. Missing linked posts → partially resolved, outside this file's scope. onsight-flash, redpoint-projecting and conditions-friction now exist in the worktree. climbing-skin-care and the -en version are still to be written; the -en version is created by Task B of this pass. Links kept because these are series posts.
2. Practice question 1 「本篇最後的自我檢查表」 → fixed. Now 「『兩種恐懼』那一節的自我檢查表」.
3. Evidence labels unused → fixed. Tags (研究)/(教練共識)/(推論)/(本系列建議) added to the research paragraphs, the Findlay claims, the habituation claim, and the 今晚 actions.
4. 「差 3 分以上」 threshold → fixed. Now 「先鋒那次明顯比較高」 (本系列建議).
5. 「第 1 篇最後一節」 (nit) → fixed. The section is named: 「什麼時候墜落練習會變成反效果」.
6. Long title (nit) → fixed. Adopted 「先鋒為什麼比頂繩可怕：研究看到什麼，你怕的是摔還是失敗」. Slug unchanged.
7. Referral section without an action (nit) → fixed. Added a 今晚 action. Series map left without one (navigation).
8. Books knowledge map missing from 參考資料 (nit) → fixed.

post-polish
1. Researcher names as subject → fixed. Every research paragraph now leads with the finding, and the name/year moved into a trailing parenthetical link.
2. Swinarska number density (nit) → fixed. 40.1/33.1 moved into a parenthesis. A `<details>` block was not used.
3. Template transitions (nit) → no change needed (kept as reviewer advised).

Extra: series map checked. All 8 rows are present, with order 0–7 and links matching the plan's order map (2 = performance-anxiety, 3 = competition-mindset). The order-2 question was reworded to match post 2's scope (redpoint attempts / being watched).
