# Review: 2026-10-19-redpoint-projecting-tactics

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-redpoint-projecting-tactics.md`
Sources opened: all 8 PubMed abstracts (eutils efetch); full text of Limonta 2020 (PMC7271724), Orth 2018 (PMC6006010), Hacques 2022 (PMC9187105), and Balancing the Bar 2022 (PMC9368498, BioC); Nicros 10-4 Rule; TrainingBeta Hörst and Bechtel pages; Training for Climbing Podcast #68, Training Café #38, and the Training Partners article; Lattice Top 10 (2022), Short Projects (2021), and Ask Lattice Q&A (2020); Climbing.com Gresham (2023); APA PsycNET Bond & Titus abstract; davemacleod.com/blog/5waystosend; the UKC forum thread (full thread via r.jina.ai).

toolDegradation: Groundlane MCP `web_fetch` returned "MCP server 'claude.ai Groundlane' is not connected" (2026-10-19). Earlier agents in this batch hit 401 on Groundlane HTTP. I fell back to curl for the publisher pages, PubMed eutils / PMC BioC for papers, and r.jina.ai for the UKC forum, which serves a Cloudflare challenge to curl.

## post-verify

Verdict: one blocker. The MacLeod rest numbers are pinned on the wrong person: the forum thread the post cites doesn't attribute them to MacLeod. Two should-fix items are about framing. The Hacques studies are used to back the 「不要只練 project」 argument even though their transfer result says otherwise, and the Lattice 5–14 / 15+ session definition is linked to a page that doesn't contain it. Every number I checked in the research paragraphs matches its source.

1. **blocker** — line 110: 「MacLeod 的說法只有[論壇使用者轉述](https://www.ukclimbing.com/forums/...719801)：兩次完整嘗試之間休 20 到 45 分鐘。這是二手資料。」 The 參考資料 entry repeats this: 「MacLeod 影片內容的使用者轉述」.
   - Problem: the thread doesn't relay MacLeod. The opening poster only says he was "inspired by a Dave Macleod projecting video '5 ways to send your project'". The numbers come from other users giving their own practice. User "Si dH" wrote: "I sometimes go by a rule of 2 minutes per hard move… for hard boulder traverses I would often rest 20-30 minutes between 'redpoint' attempts". User "shark" wrote: "even 45 minute rests between goes is not unheard of even for short problems". Both posts are about bouldering. MacLeod's own blog page (davemacleod.com/blog/5waystosend) is only a teaser for the video and gives no rest numbers. The research note (line 297) made the same misattribution, and the post copied it.
   - Sources: https://www.ukclimbing.com/forums/bouldering/does_projecting_make_you_a_better_climber-719801 ; https://www.davemacleod.com/blog/5waystosend
   - Fix: delete the MacLeod bullet. If you want a second data point, write 「UKClimbing 論壇上有抱石者分享自己的做法：難的題每個用力動作休約 2 分鐘，兩次完整嘗試之間休 20–30 分鐘，甚至 45 分鐘（個人經驗，非教練建議）」, and re-label the reference as 「UKClimbing 論壇討論串（2020）」.

2. **should-fix** — lines 69–71 and practice question 2 (line 182): 「圍攻一條線會讓你很會爬那一條，但不保證你換一條線也變強。這支持 Hörst 不要只練 project 的主張」; 「Hacques 2022 也發現，一直練同一條線會讓你很會爬那一條，但不一定轉移到新線」. The tldr says 「研究兩邊都支持一部分」.
   - Problem (🔵 Misframed): the numbers are right, but the inference points the wrong way. In Hacques 2022 the constant-practice group was better on the training route, and "the three groups climbing fluency on the transfer route did not differ". Repeating one route didn't cost anything on transfer, and changing routes didn't add anything. Hacques 2024 found "forcing exploration did not seem more beneficial than constant practice", and all three groups became more flexible. So these studies don't support Hörst's "climb many routes" argument. All participants were also novices with little or no climbing experience, practising on top-rope. That is very different from projecting at your limit.
   - Sources: https://pubmed.ncbi.nlm.nih.gov/35687600/ (full text PMC9187105: "no or very little climbing experience", top-roped) ; https://pubmed.ncbi.nlm.nih.gov/38324768/
   - Fix: 「新手實驗裡，一直練同一條線的人在那條線上爬得最好，換到新線時也不比被安排換線的人差；讓學習者自己決定何時換線，可能比較能培養彈性（研究，受試者是幾乎沒爬過的新手）。這些研究不能直接回答『練 project 會不會讓你整體變強』，Hörst 和長期派的分歧目前只有教練經驗。」 Rewrite the tldr clause and practice-question-2 answer to match, e.g. drop 「但不一定轉移到新線」.

3. **should-fix** — line 65: 「Lattice 在[行程中短期 project 的文章](…short-climbing-projects-tactics-for-trips-quick-sends)把 5 到 14 個 session 的線叫做短期 project，15 個以上才算長期。在這套說法裡，練好幾個月的線是常態，不是失敗。」
   - Problem: the linked page says only "quick local hits that don't take months to get done" and doesn't contain the 5–14 / 15+ numbers. They are in a different Lattice page, the Ask Lattice Q&A (2020), and there they are a question posed by the 365 Facebook group: "Are long term (15+ sessions) or short term (5-14 sessions) projects better for climbing progression?" They aren't a Lattice definition, and neither page says long projects are 「常態，不是失敗」. The table row also attributes 「把一條線練很多個 session 本身就是一種技能」 to Lattice and MacLeod. No source opened for this post says that. The closest is MacLeod's teaser: "I have spent a long time perfecting how to send hard projects which are above my level".
   - Sources: http://latticetraining.com/blog/short-climbing-projects-tactics-for-trips-quick-sends ; http://latticetraining.com/blog/ask-lattice-with-tom-ollie-webinar-recording-from-july-27th ; https://www.davemacleod.com/blog/5waystosend
   - Fix: 「Lattice 的 podcast 把 project 分成短期和長期兩種來談；他們的觀眾問答用 5–14 個 session 和 15 個以上來區分（[Ask Lattice 2020](…)）。MacLeod 說自己花了很長時間琢磨怎麼送超出程度的 project（[5 ways to send your project](…)）。」 Add the Q&A page to 參考資料, and either drop the 「常態，不是失敗」 sentence or label it 推論.

4. **should-fix** — line 83: 「第三次送掉」 (Hörst Podcast #68).
   - Problem (🟡 Unverifiable): the show notes cover 3 sessions, the 4 chunks, fears first, mental snapshots, and 2 redpoint goes in session 2, and these all check out. But the episode stops at "Session 3 – Mother Nature provides a chance…but could Eric take down Hercules?" and "blow-by-blow commentary of the redpoint goes", without saying whether he sent. 「在家做意象練習」 is also more specific than "HERCULES on my mind…for days! Visualization".
   - Source: https://trainingforclimbing.com/podcast-68-anatomy-of-a-redpoint-project (Nov 3, 2021)
   - Fix: listen to the 1:05:10 segment, or write 「第三個 session 是旅程最後一天的送線嘗試」 and 「幾天之間在腦中反覆想這條線、做意象練習」. Add the date (2021) to the reference.

5. **should-fix** — line 47: 「讓 7 個人在同一條線上練 10 次。一開始大家用手摸點……找方法的工作從手移到了眼睛」.
   - Problem: the study had "10 learning sessions", not 10 attempts. The hand-to-eye shift is also stated too broadly. On the learning route, exploratory hand movements **and** fixations both decreased. The move toward exploring from a distance ("number of fixations was higher than on the learning route… relied more on exploration from a distance") appeared on the **transfer** routes.
   - Source: https://pubmed.ncbi.nlm.nih.gov/33759114/
   - Fix: 「讓 7 個人在同一條線上練了 10 個 session。練到後來，手上的試探和眼睛的停留都變少，視線也更有目的；換到新線時，他們比較會先用眼睛從遠處看，而不是上手去試。」

6. **should-fix** — line 139: 「[上一篇]提過，看真人示範的完攀率最高。」
   - Problem: the onsight post (line 49) says the live-vs-video difference 「沒有達到統計顯著」, and that the problems were far below the subjects' level. 「最高」 drops both caveats.
   - Fix: 「上一篇提過，先看人爬或看影片，完攀率都明顯比沒看高。」

7. **should-fix** — line 141: 「訪談 6 位德國頂尖運攀者的研究：他們都說年輕時會霸著線、失敗後臭臉」.
   - Problem: the paper says "Every participant was able to outline examples, either…" of themselves or of others. It does not say all of them did this when they were young. Post 2 (line 115) words it correctly: 「這類行為很常見」.
   - Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC9368498/
   - Fix: 「受訪者都舉得出霸著線、失敗後臭臉的例子（自己或別人），也說這會影響繩伴整天的表現。」

8. **should-fix** — line 131: 「照 Hörst 的算法，4 次 session 大約就是 10 次嘗試。」
   - Problem: the table's own numbers add up to 0 + 1 + (2–3) + (2–3) = 5–7 attempts from the bottom. Hörst counts "ten redpoint attempts over four days". The sentence doesn't match the table.
   - Fix: 「這張表大約是 5 到 7 次從底爬的嘗試；照 10-4 規則還有餘裕，但 session 4 結束還沒送，就該想要不要換線。」

9. **nit** — line 43 details: 「路線只有一條」. In the methods, each climber's route was set "close to their best on-sight level", and the figure shows "one of the routes used for the trials". Also, the redpoint was in session 2, right after a single onsight attempt, so 「練過」 here means one prior go. Fix: 「每人一條接近自己 onsight 極限的線，redpoint 是第二次爬，只練過一次」. Source: https://pubmed.ncbi.nlm.nih.gov/32547440/ (PMC7271724, Procedures).

10. **nit** — line 89: Gresham's warm-up tip. The source's reason is to get "60 to 80 percent pumped" so the body "primes the systems to remove lactic acid" and avoids "flash-pump". The links are done on the project itself ("do links on it (say three or four clips at a time)"). 「讓身體記得連續爬的節奏」 is the author's own reason. Fix: 「在 project 上一次串 3 到 4 支快扣當暖身，讓前臂先脹到六到八成，送線那次比較不會一上去就爆」. Source: https://climbing.com/skills/improve-two-grades-instantly-with-coachs-magic-bullet-advice-six-tips-that-actually-work

11. **nit** — line 85: Lattice 「由上往下串」. The page topic is "Choking and the use of 'top down' links", which ties it to choking under pressure. The post's mechanism (後段帶疲勞) is labeled 推論, which is good. The 「例如從最後兩支快扣……」 example is also the author's and should share that label. 「預掛快扣」 is likewise an inference from "Clipsticks". Source: http://latticetraining.com/blog/sport-climbing-top-10-projecting-strategies-for-beginners-and-intermediate

12. **nit** — line 112: Heyman cooled the "forearms and arms (three periods of 5 min at 15 °C)". Fix: 「前臂和手臂分三次泡 15°C 冷水、每次 5 分鐘」. Line 143: Bond & Titus split tasks into simple and complex, not 熟練 and 不熟. Fix: 「讓簡單任務變快、複雜任務變慢變差」. Its effect sizes (".3% to 3% of the variance") support 「效果很小」 ✓.

13. **nit** — line 61: 「研究筆記也查不到這個數字」 points to internal process the reader can't see. Fix: 「他沒有給出處，我們也沒找到對應的研究」.

🟢 Confirmed (no change needed):
- Limonta 2020: 18 advanced men; redpoint 7b+/8a, onsight 7a+/7b+; 148.7 vs 179.5 s; fewer exploratory moves and shorter stop times; lower peak HR, lactate and RPE; lower cognitive and somatic anxiety; higher self-confidence; "RI is a trainable skill"; onsight always in session 1, redpoint in session 2.
- Orth 2018: 8 beginners, 42 trials over 7 weeks; continuous / sudden / no improvement; sudden improvers used "new body-wall orientations" (the full text contrasts face-on and side-on, so 正身改側身 is accurate). Minor: the "no improvement" pattern was one person, who "improved in terms of distance climbed". 「每次爬得更高」 slightly overstates it (nit).
- Heyman 2009: 13 well-trained women, prepracticed 6b overhang, to exhaustion twice, 20 min rest; active recovery (30–40 W cycling) and cold water maintained C2; passive recovery impaired it.
- Valenzuela 2015: 2-min recovery; easy climbing beat walking on lactate and metres climbed. Draper 2006: 10 recreational climbers; active recovery lowered lactate and RPE.
- Hörst 10-4 (Nicros, 2015): 10 redpoint attempts over 4 days; himself about 5 over 2; three reasons; the uncited "couple of research projects… three and ten attempts"; five exceptions; 80/20 rule. All accurate.
- TrainingBeta Hörst: 3–5 parts, crux beta, dial it in, 30–60 min rest, expect success ✓. Bechtel pyramid wording ✓.
- Training Café #38 (Apr 23, 2021): 20 / 40 / 60 min by fall height; 1 min per rigorous boulder move ✓.
- Hörst Training Partners (May 11, 2026): partners help with "beta sequence" and "body-position" and are "excellent for projecting, route climbing" ✓. Add the date to the reference (volatile page).
- Lattice Top 10 (Oct 8, 2022): clipsticks, brushing, learning rests, end-of-day recaps, top-down links ✓.
- Safety: the finger-pain → pulley-injury handoff and the skin handoff are appropriate. No harmful advice found.

Scope statement: this pass checked the ~45 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: the structure is sound and mechanical checks are clean. One gap: the post promises 「要多難」 and never answers it. Evidence labels aren't applied systematically, and one cross-reference to post 6 contradicts that post's thesis.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `node scripts/check-process-leak.mjs` → no output (pass). It missed 「研究筆記」; see verify #13.
- `register-scan.sh` → 74 paragraphs; 8 long sentences (11%); caveat density 16%; 0 blockquotes; 8 paragraphs with ≥4 numbers; names-as-subject 0 (false negative, names are link text); `scan-ledger.sh` → no hits.
- `pnpm check:references` → only error for this post is the `-en` link (being written, not flagged). All other internal links resolve: grades-and-protection-ratings, resting-route-reading, climbing-training-diagnosis, finger-pulley-injury, onsight-flash-tactics, climbing-performance-anxiety, climbing-conditions-friction, climbing-skin-care.
- Frontmatter: required fields present; 4 tags, all existing (`climbing-mental` ×13, `sport-climbing`, `outdoor-climbing`); `type: guide`; series name matches `src/utils/series.ts`; order 5 ✓; description and tldr are distinct.

1. **should-fix** — coverage (6.5): the title (「怎麼挑線」), the description (「project 要挑多難」), and the H2 「挑 project：要多難、要圍攻多久」 all promise guidance on difficulty, but the section only covers how long to siege. It never says how far above your onsight grade a first project should be. Hörst's TrainingBeta list starts with "Pick the right route", and that page is already cited. Fix: add 2–3 sentences, sourced or labeled 教練共識／本系列建議, e.g. pick a route a little above your onsight grade, on a style you like, close to home; or narrow the heading to 「要圍攻多久」 and edit the title and description to match.

2. **should-fix** — evidence labels. The series brief requires 研究／教練共識／推論, and the overview's fix pass added them across that post. Here they appear only twice (推論, lines 85 and 143) plus 「都是教練意見」 (line 53). Research paragraphs (Limonta, Hacques, Orth, Heyman…), coach paragraphs (Hörst, Gresham, Lattice), and the 4-session plan (本系列建議) are untagged. Fix: add 「（研究）」「（教練共識）」「（本系列建議）」 the same way the overview does.

3. **should-fix** — line 164: 「為什麼會這樣、台灣哪幾個月比較適合，是第 6 篇的主題」. Post 6's tldr says 龍洞's good days are 「一道乾冷空氣帶來的天氣事件，不是一整個季節」, so it deliberately doesn't name months. Post 6's title does say 「台灣哪幾個月適合拚 project」, but its body moves away from months. Fix: 「為什麼會這樣、怎麼在台灣抓那幾個乾的日子，是第 6 篇的主題」.

4. **should-fix** — the 「什麼時候換線」 bullet on 「每次都在同一個地方失敗，而且越試越怕」 has an action-free link handoff. That's fine. But the 「送線那天」 section is the only H2 without a 今晚就能做的動作. Fix, optional but consistent: 「下次送線前一天，查一次隔天的相對濕度，並看看指尖皮膚，決定要不要去」.

5. **nit** — title: about 38 characters with five clauses. Consider 「redpoint 與 project：挑線、拆段練、休多久、什麼時候換線」.

6. **nit** — 參考資料: add the Ask Lattice Q&A page (verify #3). Add dates to Podcast #68 (2021) and Training Partners (2026). Relabel the UKC entry (verify #1).

7. **nit** — topic ownership (6.8): passes. The grade definition is handed off to 〈難度與保護評等〉, on-wall shaking out to 〈休息、讀線〉, fingers to 〈手指滑車〉, and conditions and skin to posts 6 and 7. Nothing is rewritten. Taiwan reader position (6.65) passes: 5.11b gym/crag scene, 龍洞 in 下一步, and the glossary notes how Taiwan gyms say "project". Opening promise (6.7): the 「休十分鐘就上」 scene is answered in the rest section and practice question 1 ✓.

## post-polish

Verdict: the register is good: no blockquotes, no template transitions, and every section has a concrete action. Two issues: number-dense paragraphs, and names as subjects inside the research sections.

1. **should-fix** — numbers per paragraph. 8 paragraphs have ≥4 numbers. The worst is line 61 (Hörst 10-4) with 10 numbers: 10, 4, 2, 5, 3, 10, plus the five exceptions in the next paragraph. Line 83 (Podcast #68: 7c+, 3, 4, 2) has 101 characters in one sentence. Fix: in line 61, keep 「4 天 10 次」 in the text and move 「他自己約 2 天 5 次」 and the 3–10 figure into a parenthesis or `<details>`. Split line 83 into one sentence per session.

2. **nit** — names as subject. The scanner reports 0, but sections open with 「[作者 等人（年）](link)讓…」 at lines 37, 47, 69 (Hacques 團隊), 95, 112, 114, and 「Hörst 在／他說」 repeats about 10 times. That is just past the ≥6 threshold. Fix: lead with the finding, e.g. 「練過一次的線再爬，平均快了約 30 秒（[Limonta 等人 2020](…)，18 位進階男性）」. Keep Hörst as the subject where his name carries the coach-opinion label.

3. **nit** — long sentences: 8 of about 70 sentences (11%) are near the 10% green line. The worst are line 83 (101 characters) and line 63 (88 characters, the five exceptions; make it a list).

4. **nit** — template transitions: 0 hits. 「換線不等於放棄」 (line 158) is a deliberate reframe; keep it.

## Fix log (2026-10-19)

post-verify
1. blocker MacLeod misattribution → fixed: bullet replaced with the UKC forum boulderers' own practice (2 min/move, 20–30, up to 45 min; labelled 個人經驗); reference relabelled 「UKClimbing 論壇討論串（2020）」.
2. Hacques framing → fixed: rewrote paragraph (constant group not worse on transfer; self-controlled may foster flexibility; novices, top-rope), conclusion now says research can't settle Hörst vs long-term; tldr clause and Q2 answer rewritten.
3. Lattice 5–14/15+ → fixed: now attributed to Ask Lattice Q&A (2020, added to refs), short-projects page described as short vs long split; MacLeod teaser quote cited (blog added to refs); 「常態，不是失敗」 softened to 正常選項 + 推論; table row reworded.
4. Podcast #68 「第三次送掉」 → fixed (did not listen to audio): rewritten as 「旅程最後一天的送線嘗試」 and 「在腦中反覆想這條線，做意象練習」; split into one bullet per session; date 2021 added.
5. Hacques 2021 → fixed per suggested wording (10 sessions; hand + gaze both decrease; distance exploration on transfer).
6. onsight cross-ref → fixed to match post 4: 「先看人爬或看影片，完攀率都明顯比沒看高」.
7. Balancing the Bar → fixed to match post 2/paper: 「受訪者都舉得出…例子（自己或別人）」.
8. 10 attempts arithmetic → fixed: 「大約是 5 到 7 次從底爬的嘗試…」.
9. nit Limonta details → fixed.
10. nit Gresham → fixed (on the project, 60–80% pump, lactate rationale attributed to him); Q3 answer aligned.
11. nit Lattice top-down → fixed: choking context noted; example + mechanism labelled 推論; clipstick 預掛 phrased as common use. Also added Hörst Projecting 101 「最後一段練到最熟」 (opened 2024 version) as coach support.
12. nit Heyman / Bond & Titus → fixed.
13. nit 「研究筆記」 → fixed (「我們也沒找到對應的研究」).
- Orth minor nit (「每次爬得更高」) → fixed: 「爬的距離有進步（只有 1 個人）」.

post-review
1. 要多難 coverage → fixed: added 「先挑難度」 paragraph from Hörst Projecting 101 (trainingforclimbing.com, opened; 2 letter grades below to 1 above hardest redpoint in past 6 months), tldr + description updated; ref added.
2. evidence labels → fixed: 研究／教練共識／推論／本系列建議 added across sections.
3. post 6 months cross-ref → fixed wording here (「怎麼在台灣抓那幾個乾的日子」). Note: post 6's own title still says 「台灣哪幾個月適合拚 project」, which conflicts with its tldr — flagged to lead, not edited.
4. 送線那天 action → fixed: added humidity + skin check action.
5. nit title → fixed (「redpoint 與 project：挑線、拆段練、休多久、什麼時候換線」).
6. nit refs → fixed (Ask Lattice, MacLeod blog, Projecting 101 added; dates on #68 and Training Partners; UKC relabelled).
7. nit topic ownership → no change needed.

post-polish
1. numbers per paragraph → fixed: 10-4 paragraph moved 2-day/5 and 3–10 into parentheses; exceptions made a list; Podcast #68 split into bullets.
2. names as subject → partly fixed (Limonta paragraph leads with the finding); others kept, since the name carries the source label.
3. long sentences → fixed for lines 63/83 via lists.
4. no change needed.
