# Review: 2026-10-19-climbing-conditions-friction

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-climbing-conditions-friction.md`
Sources opened (2026-10-19):
- PubMed abstracts via eutils efetch: 21451181, 11411778, 23259237, 27619723.
- Clarke 2024 full-text PDF (White Rose eprint 214893), plus the Crossref abstract.
- Crossref/OpenAlex abstracts: Elkington 2024 and Fuss & Niegl 2012.
- CWA monthly-mean tables, fetched directly from the data files behind https://www.cwa.gov.tw/V8/C/C/Statistics/monthlymean.html: `MonthlyMean/MOD/Taiwan_{rh,meantxmax,meantxmin,txminle10day,precp}.html`.
- CWA station map JSON, which confirms ID 46694 is 基隆.
- CWA 季風科普 page and the CWA climate 梅雨 and 秋季 pages.
- NE Coast NSA 龍洞 page; climbstone.com; Kateberry; Searchome; Climbing.com (both articles); Gripped; Mountain Project thread; UKC thread; Libby Peter PDF; Wikipedia Keelung (raw wikitext).

toolDegradation:
- Groundlane MCP: "not connected".
- Groundlane direct HTTP: 401.
- jina MCP: "not connected".
- Fallback used: curl, plus the r.jina.ai reader. The reader hit a per-IP 429 partway through, and the remaining pages were fetched with plain curl.
- All listed sources were opened.

## post-verify

Verdict: no blockers. Every study number matches its abstract: 15 / r=.65 / 2.8 mm, 15 people on sandstone, granite and slate, 11 people / 42 sessions / +18.7% / +21.6%, 19 people / 62.9 vs 49.3 s, and Fuss & Niegl's hand-only vs hand+hold result. The Keelung RH values match the CWA's own table. The problems: one dead official link family, a missing n=1 caveat on the study the whole chalk section rests on, a heat-advice row that inverts its source, and a safety gap in the go/no-go checklist.

1. **should-fix**: line 107 and 參考資料 line 217, 「整理自[氣象署月平均資料](https://www.cwb.gov.tw/V8/C/C/Statistics/monthlymean.html)」; 「基隆 1991–2020 氣候值轉引自 Wikipedia」.
   - Problem: `www.cwb.gov.tw` no longer resolves (NXDOMAIN, 2026-10-19), so both official links are dead. Wikipedia is not needed either. The CWA's own table (cwa.gov.tw, select 相對濕度) gives 基隆 1991~2020 RH: 78.5 / 79.5 / 79.0 / 77.4 / 77.4 / 76.9 / **71.9** / 73.6 / 75.3 / 75.6 / 77.1 / 76.6 (year 76.6). July's mean high is 33.3°C. These match the post.
   - Source: https://www.cwa.gov.tw/V8/C/C/Statistics/monthlymean.html
   - Fix: point both links at `https://www.cwa.gov.tw/V8/C/C/Statistics/monthlymean.html` and say 「選『相對濕度』，2026-10-19 查閱」. Drop the Wikipedia 轉引, or keep it only as a secondary link.

2. **should-fix**: line 107 「每個月的平均相對濕度都在 72% 到 80% 之間，最低的 7 月是 71.9%」. The tldr (line 9) has the same 「全年都在 72–80%」.
   - Problem: the sentence contradicts itself, because 71.9 is below 72. The tldr inherits the error.
   - Source: CWA table above.
   - Fix: 「每個月的平均相對濕度在 72% 到 80% 上下（最低 7 月 71.9%、最高 2 月 79.5%）」. In the tldr, write 「約 72–80%」.

3. **should-fix**: lines 56–61, Clarke 2024: 「在四種岩石上測乾手指和模擬流汗的手指，給了一個能把上面幾篇串起來的解釋」 and 「出乎作者意料：乾手指抹粉的效果比模擬流汗的手指還明顯」.
   - Problem 1: the main tests used **one participant** (a 21-year-old female climber). A second participant (male, 29) did only the stand-alone moisture test (Methods). The paragraph the post uses to reconcile everything else has the smallest sample in the section, and the post doesn't say so.
   - Problem 2: the thin-layer / excess-layer mechanism is labeled in the paper as "a proposed mechanism". The bullets present it as a finding.
   - Problem 3: 「抹粉讓摩擦…比較穩定」 is confirmed, but it comes from the same single participant.
   - Source: https://eprints.whiterose.ac.uk/id/eprint/214893/ (PDF, Methods and Discussion "Moisture").
   - Fix: 「英國雪菲爾大學的 Clarke 等人（2024 年線上發表；主要測試只有 1 位受試者）在四種岩石上……，並提出一個可能的機制（作者自己標為推測）：」. Then keep the bullets.

4. **should-fix**: line 148, the table row 「夏天正中午、岩壁曬了一上午 | 曬過的岩石太陽走了還會熱好幾個小時；早上或傍晚再爬」, and practice question 4 (line 194): 「先在陰影裡休息、爬背陽的牆，把送線那一趟排在傍晚」.
   - Problem: the source's point is about aspect, not time of day. Rock "will remain hot for hours after the sun leaves", and "it's actually usually better to climb in the sun if the rock has only just hit it than in the shade immediately after it's been cooking in the sun for hours". The source also prefers night sessions on faces that "hasn't seen sun in a few hours" (east- or north-facing). 「傍晚」 on a west-facing wall that has baked all afternoon is exactly the case the source warns against. 「背陽的牆」 is right, but 「排在傍晚」 needs the aspect condition.
   - Source: https://www.climbing.com/skills/how-and-where-to-climb-in-the-heat/ (Steven Potter, updated 2026-06-30).
   - Fix (row): 「改爬還沒曬到、或已經好幾個小時沒曬到的牆（例如傍晚爬朝東的面）；剛被曬了一下午的牆，太陽走了還是燙」. Fix (Q4): 「把送線那一趟排在傍晚，而且挑下午沒曬到的那一面」.

5. **should-fix (safety)**: line 136, 「週四晚上查週末的預報，看三件事：有沒有冷鋒或乾冷空氣過境、相對濕度會不會掉到 70% 以下、風是從海上還是從陸地吹來」, and line 144, 「冷鋒過後、天氣轉晴，濕度明顯掉下來 | 值得拚」.
   - Problem: the post's best-day pattern (dry air behind a cold front) falls inside the NE-monsoon months. The NE Coast NSA warns that 長浪 is common in that season (10–3 月) and asks people not to go to the shore. The checklist never asks about waves. The 「浪大」 row (line 146) is separate and only says 「東北季風期間、浪大」, so a reader who sees three green lights after a front has nothing telling them to check the sea. Inference: post-front clear days often come with strong NE wind and swell. That is an inference; the hard fact is the NSA warning.
   - Sources: https://www.necoast-nsa.gov.tw/Attraction-Content.aspx?a=186&l=1 (「東北季風盛行期間(10月~3月)，易有長浪發生…請勿前往海邊」); https://edu.cwa.gov.tw/PopularScience/wt/wt_3.html
   - Fix: make it four checks: 「④ 氣象署的海象／波浪預報與長浪提醒：有長浪警示就不去海邊，條件再好也一樣」. Add 「而且沒有長浪警示」 to row 1.

6. **should-fix**: line 121, 「颱風前後不去海邊；颱風帶來的鹽分見下一節」.
   - Problem: two broken references. The next subsection is 「冬天轉關子嶺」, not the salt one. And the salt subsection (line 134) never mentions typhoons; it discusses sea spray and onshore wind in general.
   - Source: internal cross-check.
   - Fix: 「颱風前後不去海邊；海風把浪花和鹽分帶上岩壁的問題見『反潮與海蝕崖的鹽分』」. Or drop the cross-reference.

7. **should-fix**: frontmatter glossary, 反潮 `context` (line 22): 「常見於台灣 3–5 月；冷鋒過後回暖的那幾天，陰影處的岩壁特別容易反潮。」
   - Problem: the body labels the cold-front / shaded-wall part as **推論** (line 132). The glossary, which is derived content that gets extracted on its own, states it as fact. The 「3–5 月」 rests only on a home-decor article. Searchome also calls 3–5 月 「梅雨季節」, which conflicts with the CWA's 梅雨 dates (5 月中旬至 6 月中旬).
   - Sources: https://www.searchome.net/article.aspx?id=79004 (2024-08-26); https://climate.cwa.gov.tw/SeasonalClimate?subpage=PlumRain
   - Fix: 「居家文章常說好發於 3–5 月；套到岩場，冷鋒後回暖的日子陰影處可能反潮（推論）。」

8. **nit**: line 118, season-table row 「3–5 月 | 冷暖交替，反潮好發 | … | 設計家 Searchome（2024）」. Searchome does not say 「冷暖交替」; it says 「好發於台灣3-5月的梅雨季節或山區、海邊」. The post also correctly dates 梅雨 to 5 月中–6 月中 one row below, so the two rows disagree about the season. Fix: put 「（居家裝潢文章，非氣象來源）」 in the source cell and drop 「冷暖交替」 or mark it 推論.

9. **nit**: line 174, practice question 2: 「預報說週六相對濕度 78%，溫度 24°C，吹東北風。上週一直很冷，週六突然回暖。」 Line 132 describes the risky pattern as 「回暖又起南風」. In northern Taiwan a sudden warm-up usually comes with southerly flow, while a NE wind usually brings the cold. The scenario is meteorologically odd and inconsistent with line 132. Inference based on the CWA monsoon page (the NE monsoon is cold air). Fix: 「轉吹偏東的海風」, or make it two separate risks in the answer: warm moist air causes 反潮, and onshore wind brings salt.

10. **nit**: line 111, Kateberry. 「2018 年 3 月 24 日，龍洞的濕度掉到 50–60%，黃金谷擠了 50 幾個人」 is confirmed. But the quote 「第一次感受什麼是乾，真的超有差」 is from **3/18**, a separate dry day, not 3/24. Fix: 「3 月 18 日和 24 日兩次……作者在 18 日那次寫她『第一次感受什麼是乾，真的超有差』」. Two dry days in one week also fits the post's "event" framing better.

11. **nit**: line 80, Gripped is labeled 「教練共識」. The article is by "Gripped Magazine" (staff), not a coach. Fix: 「媒體整理／攀岩者經驗」, the same tier as the Climbing.com row.

12. **nit**: line 42, Bourne: 「小點靠的不只是力氣，也靠皮膚能不能變形、咬進岩面」. The abstract says "It is suggested that…", so this is the authors' hypothesis, and r=.65 holds only at 2.8 mm (r<.37 at the other depths). Fix: add 「（作者的推測）」.

13. **nit**: line 158, 「冷氣開得夠、人少的時段，通常是平日早上或晚上比較晚的時候」 is labeled 教練共識加推論, but no coach source is cited for it. Fix: label it 「本系列建議／推論」.

🟢 Confirmed (no change needed):
- Bourne 2011: 15 experienced climbers; 2.8 mm sandstone edges; r=.65 with bone-tip-to-pulp-tip; shallow-edge force uncorrelated with deep-edge force (r<.1). https://pubmed.ncbi.nlm.nih.gov/21451181/
- Li 2001: 15 participants; sandstone, granite and slate; chalk decreased μ; skin drying plus a granular layer. https://pubmed.ncbi.nlm.nih.gov/11411778/
- Amca 2012: 11 climbers; 42 sessions; hang board inclined until slip; +18.7% limestone, +21.6% sandstone; no correlation with humidity/temperature; "additional parameters should be considered". https://pubmed.ncbi.nlm.nih.gov/23259237/
- Kilgas 2016: 19 climbers; μ no difference (p=.748); hang 62.9 vs 49.3 s. https://pubmed.ncbi.nlm.nih.gov/27619723/
- Fuss & Niegl 2012: chalk on the hand alone raises μ; on hand plus hold it lowers μ. https://doi.org/10.1080/19346182.2012.755539
- Clarke 2024: Sheffield; online 18 Sep 2024; four rocks; dry > wet "unexpected"; more consistent μ; brushing holds "has not been scientifically tested". https://eprints.whiterose.ac.uk/id/eprint/214893/
- Elkington 2024: granite counter-surface; softer rubber "did not consistently" perform better; hardness × roughness × adhesion. https://doi.org/10.1007/s12283-024-00474-4
- Climbing.com 2021-08-28: 32–41°F rubber optimum, stated with no citation (confirmed); sweat, not heat, is the problem; "by the time we can see the sweat… crossed that threshold"; shade and fans. https://www.climbing.com/skills/science-friction-the-truth-behind-perfect-climbing-conditions/
- Climbing.com heat article: "between-climb hangout is shady… fingers start to sweat". https://www.climbing.com/skills/how-and-where-to-climb-in-the-heat/
- Gripped 2024-02-12: "very wet after a couple of tries if the humidity is above 70 per cent". https://gripped.com/profiles/understanding-rock-climbing-conditions/
- Mountain Project 2019-10-31: rock at or below the dew point leads to condensation; "colder weather, followed up with warmer front and rain is a recipe for condensation". https://www.mountainproject.com/forum/topic/117971505/
- UKC 2023-09-25: self-described "extremely mediocre geologist"; salt "will attract water… needs 'extra' drying… sunlight, a stiff breeze or low humidity"; wind blowing moisture from the sea is worst, inland winds are better. https://www.ukclimbing.com/forums/rock_talk/why_does_sea_cliff_limestone_get_soapy-764211
- Libby Peter: "greasiness… not caused by rain – just by dampness in the air… let the sun hit the crag before you do". https://www.libbypeterclimbing.co.uk/wp-content/uploads/2022/11/seacliffs.pdf
- CWA 季風科普: NE monsoon 10 月 to 次年 4 月, strongest 12–2 月; north and northeast get gloomy drizzle; a cold front every 5–7 days; the southwest has far fewer rainy days. https://edu.cwa.gov.tw/PopularScience/wt/wt_3.html
- CWA 梅雨: 臺灣梅雨 5 月中旬至 6 月中旬; after mid/late June, mostly 午後雷陣雨; 颱風季 from 8 月中旬. https://climate.cwa.gov.tw/SeasonalClimate?subpage=PlumRain
- CWA 秋季: November is the north's driest month, while the northeast has its wettest period after autumn begins. The CWA monthly table agrees: 基隆 Nov 396.9 mm is the yearly maximum; 臺北 Nov 83.2 mm is the minimum. https://climate.cwa.gov.tw/SeasonalClimate?subpage=Autumn
- 龍洞 winter rarely below 5°C: 基隆 averages only 4.4 days/year with minimum ≤10°C (CWA txminle10day, 1991–2020). The claim is well supported, though the post gives no number.
- NE Coast NSA: 「東北季風盛行期間(10月~3月)，易有長浪發生…請勿前往海邊」.
- climbstone.com: summer highs 33–37°C; Jan–Mar rainy but climbable if dry; "Spring and fall can be wonderful. Nice days occur in any season."
- Kateberry 2018-03-26: 3/24 RH 50–60%, 黃金谷 50 幾個人 and queues; first 龍洞 5.12 (非常不方便 5.12a); 「冬天就窩在關子嶺蹲點專注拚路線」.
- CWA observation page `OBS_Station.html?ID=46694` is the 基隆 station (STMap.json: ID 46694 = 基隆).
- Internal claim: 〈台灣岩場與岩質〉 line 104 does say 關子嶺 is limestone, 夏天潮濕, and a winter alternative.

Scope statement: this pass checked about 45 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: structure, scope and evidence framing are good, and every external number has an inline link. Fix the items above, then the few seams below.

Mechanical results:
- `node scripts/check-tw-terms.mjs`: 0 blocking, 0 to review.
- `register-scan.sh`: 65 paragraphs; long sentences 5; caveat density 10%; blockquotes 0; 7 paragraphs with ≥4 numbers; names-as-subject 1 (a false negative, because the names are link text; see post-polish).
- `scan-ledger.sh`: 1 template hit (line 109).
- `pnpm check:references`: the only error is `/posts/climbing/2026-10-19-climbing-conditions-friction-en`. That is the English version being written, so it is not flagged.
- Internal links resolve: taiwan-crags-rock-type, redpoint-projecting-tactics, climbing-skin-care.

1. **should-fix**: tldr (line 9) carries two derived-content problems.
   - 「72–80%」 (see verify #2).
   - 「實驗室量不到溫濕度直接改變手指摩擦」 rests on one 11-person study (Amca 2012). The body says so, but the tldr generalises it to 「實驗室」.
   - Fix: 「一個 11 人的實驗室研究量不到……」, or 「實驗室研究（Amca 2012）」.

2. **should-fix**: glossary 反潮 context states an inference as fact (verify #7).

3. **should-fix**: cross-reference seam at line 121 (verify #6). Line 38 「「天氣」與「台灣」兩節」 and 「「鞋底」一節」 resolve correctly.

4. **nit**: evidence labels are used unevenly. The chalk study bullets (lines 50–52) and the Fuss/Clarke paragraphs have no 研究 tag, while the weather table (line 80 onward) labels every row. Sibling post 1 tags its section headings, e.g. 「原則一…（教練共識）」. Fix: tag the 「止滑粉」 heading 「（研究＋教練共識）」, and tag the two practical bullets at lines 65–66 「（教練共識）」 explicitly. The prose at line 63 already says this.

5. **nit**: title (line 2) is about 40 characters with two clauses. Consider 「攀爬時機與條件：同一條線為什麼時黏時滑，台灣什麼時候該拚 project」, or drop the second clause into the description.

6. **nit**: tags `[climbing, climbing-mental, outdoor-climbing, sport-climbing, taiwan]`. Five tags, all existing, consistent with the series. OK.

Scope (6.5 / plan card order 6): every item on the scope card is present. That covers the four friction sources, the chalk contradiction and Clarke, lab vs dew point (labeled 推論), 0–5°C unverified, the season table with official warnings, 梅雨, typhoons, the spring/autumn window, 關子嶺, 反潮, sea-cliff salt, and the gym in summer. The reader outcome (decide whether this weekend is worth it) is met by the decision table. It would be stronger with verify #5's wave check.

Taiwan reader position (6.65): passes. The opening is a 龍洞 scene, and Taiwan hard evidence (CWA, NSA) is on the skeleton.

Topic ownership (6.8): passes. Crag and rock-type detail is handed off to 〈台灣岩場與岩質〉. Skin care is handed off to post 7; the Bourne paragraph is a short bridge, not a re-telling.

Sibling-series cross-links (plain text only, per brief): none needed. The gear series (L) could later take a 「鞋底橡膠」 cross-link.

## post-polish

Verdict: the register is light: short paragraphs, no blockquotes, low caveat density, a 今晚 action in every major section. The problems are two number-dense paragraphs and a run of name-led sentences in the chalk section.

1. **should-fix**: line 107 (the Keelung paragraph) has 11 numbers in one paragraph: 1991–2020, 72, 80, 7 月, 71.9, 2 月, 79.5, plus the dates. Keep one decision-relevant number in the body: 「每個月平均都在 72–80% 上下，連最乾的 7 月也有 71.9%」. Move the month-by-month values into a `<details>` block or into the season table.

2. **should-fix**: lines 50–56 and 78, names as subject. 「Li 等人（2001）讓…」「Amca 等人（2012）讓…」「Kilgas 等人（2016）找…」「Fuss 與 Niegl（2012）用…」「英國雪菲爾大學的 Clarke 等人…」「Amca 2012 在 42 次測試裡…」. That is six name-led openings in about 30 lines, which hits the threshold (≥6). The scanner reports 1 only because the names are link text. The bold labels on the three bullets help. Fix: lead with the finding, e.g. 「15 人用指尖壓住砂岩、花崗岩和板岩再橫向拉開，抹粉的摩擦係數反而比較低（[Li 等人 2001](...)）」. Do the same for Fuss/Niegl and Amca.

3. **nit**: line 111 (Kateberry) has 8 numbers (2018, 3, 24, 50–60, 50, 5.12…). This is acceptable because the story is the point. Merging the 3/18 fix from verify #10 will add a date, so consider dropping 「50 幾個人」 to 「擠滿人、每條線排隊」.

4. **nit**: template transition, lines 109 and 9 (tldr): 「好條件不是一個季節，而是一道天氣」 / 「是一道……天氣事件，不是一整個季節」. It is the post's thesis and appears only twice, so it can stay. Consider making the tldr concrete instead: 「龍洞的好日子通常跟著一道乾冷空氣來，一兩天就過」.

5. **nit**: line 109 puts 「超過約 70%，點很快就濕」 in 「」 as if it were Gripped's words, but it is a paraphrase. Drop the quote marks, or quote the original clause.

6. **nit**: long sentences (5, under 10% of sentences). Line 124 (climbstone, 74 字) and line 150 (最後一列來自…, 71 字) are easy splits at the colon.

## Fix log (2026-10-19)

Re-opened: CWA monthlymean (200 on cwa.gov.tw), CWA 長浪即時訊息 W37 and 即時海況 OBS_Marine (titles confirmed via curl; W37 found via Keenable), NE Coast NSA 龍洞 page (長浪 sentence re-confirmed), Climbing.com heat article (aspect quote re-confirmed). Groundlane not tried again (401 per brief); curl + Keenable used.

post-verify
1. fixed — both cwb.gov.tw links → https://www.cwa.gov.tw/V8/C/C/Statistics/monthlymean.html with 「選『相對濕度』，2026-10-19 查閱」; Wikipedia 轉引 dropped.
2. fixed — 「72–80% 上下，連最乾的 7 月也有 71.9%」; tldr 「約 72–80%」.
3. fixed — Clarke: 「主要測試只有 1 位受試者」 and 「提出一個可能的機制（作者自己標為推測）」.
4. fixed — table row, summer season row, explanatory paragraph and Q4 now use wall aspect / hours since sun, not just time of day.
5. fixed — checklist is four checks; ④ CWA 長浪即時訊息 + 即時海況 as a hard gate, with the NSA 10–3 月 warning; row 1 adds 「而且沒有長浪警示」; 浪大 row adds 長浪警示.
6. fixed — cross-ref now points to 「反潮與海蝕崖的鹽分」, framed as sea spray/salt (not typhoon-specific).
7. fixed — glossary 反潮 context rewritten as 居家文章 + 推論.
8. fixed — 3–5 月 row: 「居家文章說反潮好發」, 推論 tag, source cell 「（居家裝潢文章，非氣象來源）」.
9. fixed — Q2 now 「轉吹偏東的海風」; answer split into two risks (反潮, 鹽分).
10. fixed — 3/18 and 3/24 separated; quote attributed to 18 日.
11. fixed — Gripped label → 媒體整理／攀岩者經驗.
12. fixed — Bourne marked 作者的推測, with 2.8 mm-only caveat.
13. fixed — gym list labelled 本系列建議／推論.

post-review
1. fixed — tldr: 「一個 11 人的實驗室研究（Amca 2012）」 + 約 72–80%.
2. fixed (= verify 7). 3. fixed (= verify 6).
4. fixed — 止滑粉 heading tagged （研究＋教練共識）; two practical bullets tagged （教練共識）.
5. fixed — title shortened to 「攀爬時機與條件：同一條線為什麼時黏時滑，台灣什麼時候該拚 project」.
6. no change needed.

post-polish
1. fixed — one number kept in body; month-by-month RH in a <details> table.
2. fixed — Li/Amca/Kilgas/Fuss/Clarke/Amca(weather) sentences now lead with the finding, citation in parentheses.
3. fixed — 「50 幾個人」 → 「擠滿人」.
4. fixed — tldr made concrete (「通常跟著一道乾冷空氣來，一兩天就過」); body thesis line kept.
5. fixed — Gripped paraphrase quote marks removed.
6. fixed — climbstone sentence split; 「最後一列」 paragraph rewritten into shorter sentences.
