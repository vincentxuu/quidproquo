# Review: 2026-10-19-climbing-performance-anxiety

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-climbing-performance-anxiety.md`
Sources opened: Röthlin & Leiggener 2021 full text (CISS JATS XML galley, https://ciss-journal.org/article/view/7748/10769); Woodman & Hardy 2003 and Hatzigeorgiadis 2011 (PubMed eutils abstracts); Jones 2002 (Coaching Science Abstracts page); Lumby 2026 abstract (Crossref API; the publisher page returns 403 and doi.org is blocked for jina); Findlay FAQ (2022-02-20); Lattice × Maguire; Balancing the Bar (PMC full text); Samet, Climbing 2023-06-19; Hörst, Training for Climbing (2026-05-12).

## post-verify

Verdict: no blockers. Röthlin's protocol is reproduced accurately, down to the order of the five prompts. The problems are a missing sample size, one summary claim pushed further than its source, and a few small overreaches.

1. **should-fix** — line 41: 「[Lumby 等人（2026）](…)訪談的攀岩者也是這樣。他們說的「怕」，多半和「必須表現好」的壓力有關」
   - Problem: the series plan requires the sample size and design next to the claim. Five climbers took the REBT workshops and **3 were interviewed**, using IPA, which is qualitative. The abstract calls the REBT finding "tentative".
   - Source: https://doi.org/10.1123/tsp.2025-0179 (abstract via api.crossref.org/works/10.1123/tsp.2025-0179)
   - Fix: 「一個英國的小型質性研究（[Lumby 等人 2026](…)，5 人參加理情行為治療工作坊、訪談 3 人）裡，受訪者說的「怕」多半和「必須表現好」的壓力有關，不是怕受傷。」

2. **should-fix** — tldr: 「短的技術提示語對精細動作最有效」
   - Problem: the meta-analysis says instructional self-talk is **more** effective than motivational self-talk for fine tasks. It does not say 「最有效」, and it does not test length, so 「短的」 is the post's own addition (body line 97 calls this 推論). The tldr therefore strengthens the finding and takes away the 推論 label.
   - Source: https://pubmed.ncbi.nlm.nih.gov/26167788/
   - Fix: 「做精細動作時，告訴自己怎麼做的提示語比加油打氣有效（運動統合分析，非攀岩）。」

3. **nit** — tldr / line 55: 「自信和表現的關聯比焦慮更強」. The comparison is with **state cognitive** anxiety, in **competitive sport** (r = .24 vs −.10). Moderators matter for this audience: for women the self-confidence effect was r = .04 and the cognitive-anxiety effect r = −.03, both near zero, and the effects were larger at high standards of competition. Source: https://pubmed.ncbi.nlm.nih.gov/12846532/ . Fix: tldr 「比認知焦慮更強」; body: add 「這是比賽情境的研究，而且在女性和低水準比賽裡兩者的關聯都很弱」.

4. **nit** — line 53: Hardy & Hutchinson 2007 is again summarized without the authors' caveat that "cognitive anxiety may not be the prime determinant of the effort and performance changes". The overview review flagged the same thing. Since this post just points back to the overview, link to it and drop the restatement, or add the caveat. Source: https://pubmed.ncbi.nlm.nih.gov/17999221/

5. **nit** — line 115 and practice Q4: 「他們都提到年輕時比較自我中心」 is confirmed ("all participants described a development from egoistic behaviour towards more supportive behaviour"). But Q4's answer, 「受訪者都提到，失敗後的壞情緒會影響繩伴和整天的氣氛」, overstates the paper: it reports a bad mood after failure as one negative behaviour that "appears to be common", not something all six said. Also, all six were the same sex, German, and at 8c+/8b level. Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC9368498/ . Fix: Q4 「受訪者提到，失敗後一直臭臉……」.

6. **nit** — line 125: 「**具體的支持有用。** ……「Nice!」「我在」」. The article's header says "focused, specific encouragement", but Weidner herself calls "Nice!" and "I'm with you!" "General, supportive encouragement", contrasted with the vague *promise* 「你會送出」. Fix: 「**簡短、表示確保者在注意的支持有用**」. Source: https://www.climbing.com/culture-climbing/climbers-appreciate-verbal-encouragement/

7. **nit** — 參考資料: the Samet piece now has the page title "Do Climbers Actually Like Being Cheered On?" (the slug still says appreciate-verbal-encouragement). The Hörst article has no date; the page shows 2026-05-12. Fix both entries.

🟢 Confirmed (no change needed):
- Röthlin & Leiggener 2021: Swiss Federal Institute of Sport Magglingen; 60 climbers completed it (M age 27.95); randomized (stratified by gender) to intervention or waiting list; leaflet one day after the pretest, then a writing task every two days, 5 in total, 14 days overall; somatic performance anxiety decreased (F = 6.24, p = .02), cognitive did not change; the authors' limitations are no active control group (placebo can't be excluded) and no follow-up. The five prompts: past-year setback (events, who was there, thoughts and actions) → common humanity → self-kindness → mindfulness ("neither avoided nor dramatized") → apply to a demanding climb from the previous week. All match lines 67–77.
- Jones 2002: 33 female novices; four technique sessions; scripted motivational general-mastery plus general-arousal imagery vs light exercise; similar performance; lower stress and higher self-efficacy for correct technique.
- Hatzigeorgiadis 2011: 32 studies, ES = .48 (moderate); more effective for fine and novel tasks; instructional beats motivational for fine tasks; interventions that include self-talk training work better.
- Woodman & Hardy 2003: k = 48; the self-confidence effect is significantly larger than the cognitive-anxiety effect.
- Findlay FAQ: people who fear failure "avoid situations where they might fail which further ingrains this fear and the habits around it"; reframing what failure means; "deeper self-worth issues… more work is needed"; the three most common fears.
- Lattice: ego in fear of failure, "not wanting to fall off easy routes… 'how did you fall off that!?'".
- Samet: Weidner's quote; Instagram poll (~3,500 responses per question): 68% helped at their limit, 60% not helped while figuring out beta, 85% like belayer encouragement, 51/49 on onlookers.
- Hörst: another set of eyes on hard boulder or system-board problems helps with beta, body position and encouragement; "leaving before the gym turns into a three-hour social event".
- The routine is labeled as the post's own synthesis (line 103). Good.
- Safety: the referral section is appropriate.

Scope statement: this pass checked about 40 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: publishable once the evidence-label gap is fixed. Mechanical checks are clean apart from the -en link, which is expected and being written.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `register-scan.sh` → 66 paragraphs; long sentences 1 (line 129, 64 chars); caveat density 12%; 0 blockquotes; no paragraph with ≥4 numbers; names-as-subject 1. That count is a false negative; see post-polish. Template transitions 0.
- `scan-ledger.sh` → no template or Taiwan-term hits.
- `pnpm check:references` → only `/posts/climbing/2026-10-19-climbing-performance-anxiety-en`, which is being written, so not flagged. Links to the overview, fear-of-falling and competition-mindset resolve.
- The overview (line 87) promises 「第 2 篇會講怎麼選」 between lowering anxiety and using it. The 「先決定方向」 section delivers on that.

1. **should-fix** — evidence labels. The three research methods are labeled well (研究：…). The rest is not: 「怕失敗長什麼樣」 (Findlay and Lattice are coach opinion; Lumby is qualitative, n = 3), 「失敗之後怎麼收拾」 (a qualitative study of 6), and 「跟誰爬」 (anecdotes plus an informal Instagram poll; Hörst's opinion). The series promises a label on every recommendation. Fix: 「（教練共識）」, 「（質性研究，6 人）」, 「（軼事與非正式調查）」.

2. **nit** — practice Q3's answer: 「並且在熱身時就先練」 is sourced (training beats no training). 「掛快扣、踩小點是精細動作」 is the post's 推論. Add 「（推論）」 here as the body does.

3. **nit** — Taiwan reader position (6.65): the topic is global, so no Taiwan case is required. The referral section, however, says only 「找心理師談」. One line would help readers in Taiwan: 「台灣目前沒查到專門做攀岩的運動心理師；可以找有運動心理背景的諮商心理師。」 This matches the research note's "沒查到" finding. Mark it as such and don't invent providers.

4. **nit** — frontmatter: required fields present; 4 tags, consistent with fear-of-falling; `type: guide`; the description and tldr are distinct; the glossary entries are accurate. 「表現焦慮」's context matches the Findlay FAQ.

Structure (guide): problem → direction → methods → routine → after failure → partners → referral → practice. Complete. Every method section has a 今晚就能做的動作.

## post-polish

Verdict: clean, short sentences, no blockquote. The main issue is author names at the start of paragraphs in the research half.

1. **should-fix** — names as subject. Lines 37, 39, 41, 55, 57, 67, 83, 91 and 129 open with 「Hazel Findlay 在／Lattice…／Lumby 等人／Woodman 與 Hardy／Findlay／Röthlin 與 Leiggener／Jones 等人／Hatzigeorgiadis 等人／Eric Hörst 在」. That is ≥6, past the threshold; the scanner counts 1 because the names are link text. Lead with the finding. Example for line 83: 「33 位女性新手上四堂技術課，另外照腳本做意象訓練的那組，爬得一樣好，但壓力比較低、對做出正確技術比較有信心（[Jones 等人 2002](…)）。」

2. **nit** — line 129 is the one >60-character sentence: 「Eric Hörst 在〈訓練夥伴：助力還是干擾？〉裡說，練難的抱石題時，另一雙眼睛能幫你……」. Split it after 「裡說」: 「練難的抱石題時，有人在旁邊看很有用：他能幫你找到更好的 beta……」.

## Fix log (2026-10-19)

post-verify
1. should-fix Lumby sample/design → fixed (英國小型質性研究，5 人工作坊、訪談 3 人).
2. should-fix tldr self-talk → fixed (指導式比加油打氣有效，運動統合分析，非攀岩).
3. nit Woodman & Hardy scope → fixed (tldr 「比賽情境…認知焦慮」; body adds the 女性與低水準比賽 caveat).
4. nit Hardy & Hutchinson restatement → fixed (restatement dropped; points back to overview for details and limits).
5. nit Q4 overstatement → fixed (「失敗後一直臭臉是常見的負面行為」; body adds 6 位同性別、8b–8c+、德國).
6. nit Weidner 「具體」 → fixed (heading 「簡短、表示確保者在注意的支持有用」; Q2 answer aligned).
7. nit reference titles/dates → fixed (Samet title updated; Hörst dated 2026-05-12).

post-review
1. should-fix evidence labels → fixed (section headings: 教練共識＋小型質性研究／質性研究，6 人／軼事與非正式調查).
2. nit Q3 推論 → fixed.
3. nit Taiwan referral line → fixed (沒查到專門做攀岩的運動心理師；找有運動心理背景的諮商心理師).
4. nit frontmatter → no change needed.

post-polish
1. should-fix names as subject → fixed (Findlay, Lattice, Lumby, Woodman & Hardy, Röthlin, Jones, Hatzigeorgiadis, Balancing the Bar, Hörst paragraphs now lead with the finding; Findlay line 57 reordered to 「對失敗恐懼，Findlay 的建議…」).
2. nit line 129 long sentence → fixed (split; source moved to trailing parenthesis).
