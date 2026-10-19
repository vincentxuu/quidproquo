# Review: 2026-10-19-climbing-competition-mindset

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-climbing-competition-mindset.md`
Sources opened: World Climbing Competition Rules v3 (Jan 2026) and Event Regulations v3 (Jan 2026), both full PDFs via curl + pdftotext; the 2024 中華民國山岳協會 青少年抱石巡迴賽競賽規程 PDF; the World Climbing 2025 rule-change news item; Inside Climbing's 2025 format deep dive; the Climbing Psychology article; the OUTSiDERS 姚廷蓁 interview; the Climbing (Samet 2023) article (these five via r.jina.ai); the PubMed abstracts for Vrdoljak 2024 (38990193) and Sanchez 2010 (19486480) via eutils; and the McKellar 2023 full text (PMC10170546) via the PMC BioC API, plus its PubMed record (37181256) for the affiliation.

## post-verify

Verdict: one blocker. It is a factual error about a real, named athlete. The rules facts are accurate: observation times, isolation, rotation times, scoring and the photo ban all match the 2026 PDFs. The other problems are framing: the boulder format gets described as "only one go", one quote drops its first half, and one study result is pushed further than its data supports.

1. **blocker**, line 137: 「她也坦白提到，曾經在一連串挫折和受傷後連國內賽都進不了決賽，最後去做了心理諮商。」
   - Problem: the interview gives a different cause. A delayed journey made her miss check-in for a World Cup in Japan, so she lost her place in it. The next week she 「比得超爛」 at a domestic event, and 「起因是一次國際賽事」. 「受傷」 appears only in a photo caption (「雖然受傷無法參賽，廷蓁還是拄著拐杖前去觀賽」), with no link to the slump or the counselling. The post invents a cause for a real person's mental-health episode.
   - Source: https://www.outsiders.com.tw/post/36350
   - Fix: 「她也提到，有一次因為交通延誤錯過日本世界盃的報到、失去參賽資格，之後低潮到連國內賽都進不了決賽，最後去做了心理諮商，才看清那次打擊有多大。」

2. **should-fix**, description (line 8) and the table row 「只有一次」 (line 45): 「抱石決賽每題 2 分鐘、只能爬一次」 / 「只有一次｜先鋒每條線只爬一次；抱石資格賽與準決賽每題固定 5 分鐘，決賽最多 4 分鐘｜不能邊試邊學」.
   - Problem: the "only one attempt" rule applies to lead only (Event Regs Lead 2.1, Rules 6.1). In boulder, "Competitors may make multiple attempts within a rotation period" (Boulder 4.12), and the post's own 「試幾次該換策略」 section depends on that. As written, the description reads as if boulder finals allow a single attempt. The opening (line 31, 「爬完就結束，沒有第二次」) is fine because it is a lead scene.
   - Source: https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/brsjsyh2ea4fxinl8nsa.pdf (Lead §2.1 Table 1; Boulder §2.1 Table 1, §4.12)
   - Fix: description → 「先鋒每條線只能爬一次、6 分鐘集體觀察；抱石決賽每題 2 分鐘觀察、4 分鐘內可以試很多次」. Rename the table row 「時間有限」 and split the cell: 「先鋒：每條線只爬一次｜抱石：時間內可多次嘗試，資格賽與準決賽每題 5 分鐘、決賽最多 4 分鐘」. Psychological impact: lead 「不能邊試邊學」; boulder 「每次失敗都在倒數」.

3. **should-fix**, line 56: 「全身都在發抖，肌肉也比較僵硬，爬起來的感覺跟平常不太一樣。」
   - Problem: the quote is cut. The original opens 「我不清楚是因為天氣冷，還是我很緊張，全身都在發抖……」. The post uses it as evidence of what competition nerves feel like in the body, but she herself was unsure whether the shaking came from cold. Without that clause, her uncertainty becomes a clean example.
   - Source: https://www.outsiders.com.tw/post/36350
   - Fix: quote the full sentence starting from 「我不清楚是因為天氣冷，還是我很緊張」. Or keep the cut and add 「她自己也不確定是冷還是緊張」.

4. **should-fix**, line 54: 「不只是決賽才緊張，第一輪往往最緊張。」
   - Problem: the abstract supports "pre-qualification cortisol was higher than pre-final" (0.45 vs 0.29 µg/dL), from 12 climbers at one national competition. 「往往」 turns that into a general pattern. Cortisol is also a stress marker, not a direct measure of 「緊張」, and the abstract doesn't say why the values differed (time of day, round, field size).
   - Source: https://pubmed.ncbi.nlm.nih.gov/38990193/
   - Fix: 「在這 12 人、一場比賽的資料裡，資格賽前的皮質醇比決賽前還高，第一輪的壓力不一定比決賽小。」 Tag it as a single small study.

5. **should-fix**, lines 107–109 and practice question 3: McKellar 2023 is applied to the new 25 / 10 / −0.1 scoring.
   - Problem: the data are from the **2019** World Cup season. Scoring then ranked tops, then zones, then attempts (Inside Climbing describes the old format), so the incentive to keep trying was different. Finals were 240 s per boulder, the same as now. The authors' cut-off is "for obtaining a top". They add that "if a climber is unable to obtain a zone by their sixth attempt… additional zone-attempts may be warranted", which supports the post's 「已經拿到 zone 的話」 condition and should be stated. Question 3's answer says 「在 25／10／−0.1 的計分下……通常比較划算」 without mentioning the format gap.
   - Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC10170546/ (Methods: 2019 season, 7 events, 56 boulders; Discussion: "absolute cut-off"); https://inside-climbing.com/2025/03/12/deep-dive-looking-new-2025-ifsc-boulder-format
   - Fix: line 107 → 「分析了 2019 年（舊計分制）世界盃抱石決賽 56 題的影片」. Line 109: add 「資料來自舊計分制，新制下多試一次只扣 0.1 分，誘因不完全一樣」. Same note in the tldr (「2019 年世界盃抱石決賽的影片分析」).

6. **should-fix**, line 102: 「『一次完攀＋第二次拿 zone』和『第二次完攀＋一次拿 zone』同分。」
   - Problem: read as one boulder, the first case is impossible: a flash top already includes the zone on attempt 1. Inside Climbing's example is across **two boulders**: top in 1 on one boulder plus zone in 2 on another equals top in 2 plus a flashed zone. Arithmetic: 25 + 9.9 = 24.9 + 10 = 34.9.
   - Source: https://inside-climbing.com/2025/03/12/deep-dive-looking-new-2025-ifsc-boulder-format
   - Fix: 「兩題合計：A 題一次完攀、B 題第二次才拿 zone（25＋9.9），跟 A 題第二次完攀、B 題一次拿 zone（24.9＋10）同分。」

7. **nit**, line 87: 「只有在雙方都還沒爬時，才能和其他選手交換觀察到的資訊。」 Rule footnote 12 also allows sharing once both have finished their attempts in the round (e.g. a "leader corner"). The 「只有」 is too strong. Source: https://images.ifsc-climbing.org/ifsc/image/private/t_q_good/prd/jaq7awz9jmqwpddwnbpr.pdf (Rule 5.4B, footnote 12). Fix: 「雙方都還沒爬時可以交換觀察到的資訊；兩人都爬完後也可以。」

8. **nit**, line 127 and reference line 191: 「雜誌的讀者調查對旁觀者鼓勵的看法大約一半一半。」 It was a five-question Instagram Stories poll, about 3,500 responses per question; "Do you like onlookers to encourage you?" came out 51% / 49%. The page title is "Do Climbers Actually Like Being Cheered On?", not the one in the reference list. Source: https://www.climbing.com/culture-climbing/climbers-appreciate-verbal-encouragement/ . Fix: 「雜誌在 Instagram 限時動態做的投票（每題約 3,500 人回答）裡，喜不喜歡旁觀者加油是 51 比 49」. Correct the reference title.

9. **nit**, line 58: 「研究也支持『緊張不一定是壞事』。」 Support here is one correlational study of 19 elite men. Successful climbers reported higher somatic anxiety before the competition; that doesn't show anxiety helped them. Source: https://pubmed.ncbi.nlm.nih.gov/19486480/ . Fix: 「有一個研究看到相反的方向」, and keep 「19 位」.

10. **nit**, line 35: 「台灣的賽事多半直接沿用國際規則」. The only evidence is one 2024 youth bouldering tour regulation. That regulation does say 「依據『2024 年 IFSC 運動攀登規則』」 (§比賽規則), confirmed. Fix: 「台灣的全國賽通常寫明依 IFSC 規則，例如……」, or just keep the example and drop 「多半」.

🟢 Confirmed (no change needed):
- Rules v3 / Event Regs v3, January 2026 (cover pages). "World Climbing (前 IFSC)": the documents are issued by World Climbing.
- Lead: qualification is 2 routes **flash**; semi-final and final are 1 route each **on-sight**, 6′ climbing time (Lead §2.1 Table 1). The tldr's 「先鋒準決賽與決賽是 onsight」 is correct.
- Lead on-sight: competitors must stay in the warm-up area after closing until called (Lead §4.2). 6-minute collective observation (§4.8). 40 seconds of individual observation on entering the field of play (§4.12).
- Boulder: qualification 5′ fixed, semi-final 5′ fixed, final 4′ max (Boulder §2.1). The Call Zone is arranged so competitors can't see boulders not yet attempted (§4.3). 2 minutes of collective observation per boulder before the final only (§4.9). Recording equipment is prohibited.
- Observation footnote 12: lead, touch any hold reachable from the ground; boulder, only the marked start holds (and blockers). Binoculars and hand-written notes or sketches are allowed; photos and recordings are not. Moves may not be practised (Rule 5.4A).
- Scoring: zone 10, top 25, 0.1 deducted per unsuccessful attempt, final score the greater of the two (Boulder §5.1). The 2025 change is confirmed by the World Climbing news item of 5 Mar 2025, which uses the same 25 / 24.9 example.
- Inside Climbing: falls are penalised the same wherever they happen; this lowers the value of flashing; the 10-point zone is meant "to reward consistency over the different boulders".
- McKellar 2023: University of Guelph (Canada); 56 boulders; "success rate after the 6th attempt was zero (excluding the outlier)", irrespective of style; finals-only limitation; "six attempts… absolute cut-off… does not mean a climber should take six attempts on every boulder".
- Vrdoljak 2024: Croatia; 12 climbers (6 women); national bouldering competition; cortisol and α-amylase higher post than pre in both rounds; pre-qualification cortisol higher than pre-final.
- Sanchez 2010: 19 elite men; CSAI-2 + PANAS before an international competition; successful climbers had higher somatic anxiety and climbed the hardest section more slowly; the result held after controlling for baseline ability.
- Climbing Psychology: the isolation-zone description; "Competition nerves are not the problem. An uncontained response to them is."; the five routine ingredients; "Every decision you make in advance is a decision you do not have to make with adrenaline in your system"; imagery in real time, with breathing and rhythm and rehearsing setbacks (missing a hold, pumping out, unexpected beta, a rival sending); the three-part reset; "breathe, trust your feet, commit to the crux" vs "do not blow this". All accurately paraphrased.
- 姚廷蓁: she represented Taiwan at the 2024 Keqiao World Cup, so 「國手」 is supported. The 2014 national youth championship, the 「亢奮的元素」 quote, filming and reviewing her training, 「正視焦慮，並找出焦慮源頭」, and the shift to focusing on training content all check out.
- Delaney Miller: senior editor of *Climbing*, former champion competition climber; "listening to the crowd was one of my favorite aspects".
- Taiwan regulation: 「選手應在隔離區關閉前進入隔離區」 (§競賽規定（三）), which supports the glossary context line.

Scope statement: this pass checked the ~45 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: publishable once the blocker and the boulder-format framing are fixed. Mechanical checks are clean apart from the `-en` link, which is being written now and is not flagged.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `node scripts/check-process-leak.mjs` → pass.
- `pnpm check:references` → only error is the `-en` link (expected). WARN: 「參考資料和標題/主要段落缺少明顯關鍵詞重疊」, a heuristic; the references do cover the topic.
- `register-scan.sh`: 3 long sentences; caveat density 4%; 0 blockquotes; 4 paragraphs with ≥4 numbers; names-as-subject 2; 1 template transition (line 60).
- `scan-ledger.sh`: one hit on line 60 (see post-polish).
- Internal links: 2026-10-19-climbing-performance-anxiety, 2026-10-19-onsight-flash-tactics and 2026-10-18-resting-route-reading resolve. **No link to the competitions series.** Line 33 mentions 「本站的攀岩賽事系列」 as plain text, as required.

1. **should-fix**: evidence labels. The series promises 研究／教練共識／推論 labels. This post uses 「推論」 once (line 109). The Climbing Psychology sections (lines 60, 66–74, 91, 115–121) are practitioner and coach advice from a commercial sport-psych practice, but are never tagged 教練共識. Line 105, 「所以策略的優先順序是：每題先確保 zone，再拚完攀」, is the author's own inference from the scoring, but it reads as a rule. Fix: tag the Climbing Psychology paragraphs 「（教練共識）」. Change line 105 to 「從計分推下來（推論）：每題先確保 zone……」.

2. **nit**: glossary 集體觀察: 「可以摸得到的岩點，但不能試動作」. In boulder only the start holds may be touched (footnote 12). Fix: 「先鋒可摸從地面摸得到的點、抱石只能摸起攀點；都不能試動作」.

3. **nit**: tldr: 「世界盃抱石決賽的影片分析裡，第 6 次之後幾乎沒有人完攀」. Add 「2019 年」 (see verify #5). Derived text should carry the same qualifiers as the body.

4. **nit**: frontmatter is fine. Required fields present; 5 tags, all existing and kebab-case; `type: guide`; description and tldr are distinct; the series name matches `src/utils/series.ts`. The title has five comma-like items (「隔離區、觀察時間、只有一次 onsight、抱石計分與台下觀眾」), which is long. Consider 「第一場攀岩比賽：隔離區、觀察時間、抱石計分與臨場緊張怎麼準備」.

Taiwan reader position (6.65): passes. The opening is a 地區賽 scene; the post cites the 山岳協會 regulation and a Taiwanese athlete's own account, and tells readers to check the local 規程. Topic ownership (6.8): passes. The full rules are handed off to the competitions series in plain text, and route reading is handed off to post 4 and 〈休息、讀線與自己定線〉. Structure: each section has a 今晚就能做的動作; the referral to 心理諮商 at line 137 is appropriate (after fix #1).

## post-polish

Verdict: the register is good: short sentences, few caveats. Two density issues.

1. **should-fix**: brand-as-subject. 「Climbing Psychology（的）……」 or 「他們」 opens or drives the paragraph at lines 48, 60, 66, 74, 91, 115 and 121, seven paragraphs in all, over the ≥6 threshold. The scanner counts 2 because the brand isn't a personal name. Readers don't need the source's name repeated. Lead with the advice and keep the attribution in one place: name the source once in 「比賽緊張在身體上長什麼樣」, then write e.g. 「賽前例行程序越樸素越好，重點是緊張時也做得出來（教練共識）：」.

2. **nit**: number density. Lines 107 (McKellar: 2019, 56, 6, plus the limits) and 163 (practice answer with 6, 25/10/−0.1) each pack 5–6 numbers. Line 35 is a false positive (the numbers are in the URL). In line 107, keep 「56 題」 and 「第 6 次」 in the text. Put the limitations in one short follow-up sentence, which also gives you a place for the 2019-format caveat.

3. **nit**: template transition at line 60, 「比賽緊張不是問題，失控的反應才是。目標不是……而是……」. Two contrast skeletons in a row. The first is a faithful translation of the source's "IMPORTANT REFRAME", so keep it. Rewrite the second: 「目標是在緊張周圍搭好結構，讓它不再搶走你的注意力和例行程序。」

## Fix log (2026-10-19)

post-verify
1. blocker (姚廷蓁 cause) → fixed, reviewer's wording (交通延誤錯過日本世界盃報到).
2. should-fix (boulder "only once") → fixed: description + table row renamed 「時間有限」, lead/boulder split.
3. should-fix (truncated quote) → fixed: full sentence from 「我不清楚是因為天氣冷，還是我很緊張」.
4. should-fix (「往往最緊張」) → fixed: scoped to 12 人、一場比賽, tagged 研究，單一小樣本.
5. should-fix (McKellar 2019 old format) → fixed in body, tldr and practice Q3; added zone-attempt caveat.
6. should-fix (impossible single-boulder example) → fixed: two-boulder example 25＋9.9 = 24.9＋10.
7. nit (info-sharing 「只有」) → fixed.
8. nit (Instagram poll 51/49, ref title) → fixed.
9. nit (Sanchez overreach) → fixed: 「有一個研究看到…方向」 + correlational note.
10. nit (「多半」) → fixed: 「台灣的全國賽通常寫明依 IFSC 規則」.

post-review
1. should-fix (evidence labels) → fixed: Climbing Psychology sections tagged 教練共識; scoring priority tagged 推論.
2. nit (glossary 集體觀察) → fixed.
3. nit (tldr 2019) → fixed.
4. nit (long title) → fixed: adopted suggested title (slug/date unchanged).

post-polish
1. should-fix (brand-as-subject ×7) → fixed: source named once (line 48, with 教練共識 note); other paragraphs lead with the advice.
2. nit (number density line 107) → fixed: limits moved to a separate short paragraph.
3. nit (template transition line 60) → fixed: second contrast skeleton rewritten.
