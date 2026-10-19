# Review: 2026-10-19-climbing-skin-care

Reviewer: independent (did not write the post). Date: 2026-10-19.
Post: `src/content/posts/climbing/2026-10-19-climbing-skin-care.md`
Sources opened: all 9 PubMed abstracts via eutils efetch (18167205, 25381140, 30215934, 30710603, 41572865, 37436009, 35229319, 20953017, 40208048). Full pages via curl: antihydral.de Pflichttext, Climbing (Clarke, Schulte, Buhay), Lattice, CLIMBERS (大森), WMS, Sheffield Climbing Clinic, KletterRetter 1/3 and 3/3, 99Boulders, The Climbing Hangar, Rock+Run, Climb On, gazispace, PTT. Through the jina reader: UKC (curl got 403), REI, the libsyn episode page. Through Wayback: trailandcrag (live site has a TLS error and returns 404) at snapshot 20250821, and ClimberNews (Cloudflare CAPTCHA) at snapshot 20260515. I also re-downloaded the TFDA InfoId 36 dataset and re-ran the search myself.

toolDegradation: Groundlane MCP not connected ("MCP server … is not connected"). Groundlane HTTP POST returned 401. firecrawl MCP not connected. Fell back to curl, the jina reader (r.jina.ai) and the Wayback Machine. info.fda.gov.tw/MLMS timed out for me too (curl exit 28), which matches what the post says.

## post-verify

Verdict: no blockers, and the medical-safety framing is sound. The post sends readers to a dermatologist, names no purchase channel, and gets the TFDA result right in the body. I re-ran it: 72,074 rows, data file dated 2026-10-15, 16 methenamine hits, 0 Antihydral, 0 topical. 14 are cancelled. The 2 still valid are the injections 內衛藥製字第002000號 and 第004944號. All 16 are urinary antiseptics. What needs fixing: one contraindication the source doesn't state, one review described as following "the same ladder" when it doesn't, an RCT whose caveat is left out, and a dry-hands tactic presented as general advice.

1. **should-fix** — line 80: 「**禁忌**：對甲醛過敏的人不能用；不能擦在滲液或起水泡的皮膚上，也不能擦臉。」
   - Problem: the Pflichttext does not mention the face. Its contraindications are hypersensitivity to formaldehyde **or any other ingredient**, and use on "nässenden oder blasig veränderten Hautstellen". The page's only other restriction is "soll nicht an der stillenden Brust angewendet werden" (don't apply to the breast while breastfeeding). So the post adds a restriction the source doesn't have, leaves out one it does, and narrows "formaldehyde or any ingredient" to formaldehyde alone.
   - Source: https://www.antihydral.de/pflichttext
   - Fix: 「**禁忌**：對甲醛或藥膏裡任何成分過敏的人不能用；不能擦在滲液或起水泡的皮膚上；哺乳期不能擦在乳房。仿單也寫明它在德國只在藥局販售（nur in Apotheken）。」 If the face restriction comes from the Packungsbeilage, cite that document. Otherwise delete it.

2. **should-fix** — line 68: 「德國醫學期刊 2026 年的回顧（Schreiner 等人）也是同一個階梯」
   - Problem: Schreiner's ladder is different. It says "aluminum chloride and anticholinergic drugs are used first, followed by botulinum toxin…" and lists tap water iontophoresis only under "Further therapeutic options". So the claim that 自來水離子導入 is first line, which the tldr and description repeat, rests on McConaghy and Nawrocki, not on all three reviews.
   - Source: https://pubmed.ncbi.nlm.nih.gov/41572865/
   - Fix: 「德國醫學期刊 2026 年的回顧（Schreiner 等人）排法略有不同：先用氯化鋁和抗膽鹼藥，再來是肉毒桿菌；自來水離子導入列在其他選項。它也提醒高品質研究不多。」 Then soften the tldr/description to 「醫療第一線多從氯化鋁止汗劑開始，手掌手汗常加上自來水離子導入」.

3. **should-fix** — line 70: 「做 7 次後兩組手汗都明顯減少，兩組之間沒有顯著差別。」
   - Problem: the numbers are right (32 people, 16 per group, 7 sessions, contraindications listed). The abstract has a caveat the post leaves out. Only the dominant hand was treated, yet "the sweating rate in the treated hand and the non-treated hand showed no significant difference", meaning both hands improved. There was also no untreated control group. The trial therefore can't show that iontophoresis itself caused the drop. The post uses it as supporting evidence for iontophoresis.
   - Source: https://pubmed.ncbi.nlm.nih.gov/37436009/
   - Fix: add 「不過只治療慣用手，另一隻沒治療的手也一樣變少，試驗也沒有不治療的對照組，所以還不能確定減少是離子導入造成的（研究，樣本小）。」

4. **should-fix** — line 183: 「**送線前別先泡軟皮膚。** Clarke 2024 的建議是在攀岩旅行期間，少洗澡、少洗碗，不要讓手長時間泡水。」
   - Problem: this is Cameron Hörst's tactic for **moist** skin, used alongside Antihydral ("Besides the application of Antihydral, Hörst recommends minimizing time spent in the shower, washing hands, and washing dishes"). It isn't the author's general advice. Presented without a skin type, it contradicts the post's own 偏乾 advice (保濕).
   - Source: https://www.climbing.com/skills/training/a-climbers-guide-to-skin-care-dealing-with-sweat-tape-splits-and-more/
   - Fix: 「**偏汗的人，送線前別先泡軟皮膚。** 手汗多的 Cameron Hörst 在攀岩旅行期間會少洗澡、少洗碗（Clarke 2024）。偏乾的人照前面的保濕作法。」

5. **should-fix** — lines 88–94, the Antihydral table and 「所以就算使用，也要避開手指關節的摺痕」.
   - Problem (medical safety): the third column is headed 「怎麼用」 and gives application sites and frequencies. The next sentence gives the reader a direct usage instruction for a drug with no TFDA licence record. That undercuts the section's stance of 「看皮膚科、不提供購買管道」. The facts are correct: Hörst applies to palms "every other night", Buhay to tips only and "more than once a week… gnarled, yellow", and trailandcrag warns about the "crease of a PIP or DIP joint".
   - Sources: Clarke (above); https://www.climbing.com/gear/how-to-prevent-sweaty-hands-for-climbing/ ; https://web.archive.org/web/20250821144522/https://trailandcrag.com/rock-climbing/climbers-guide-to-skincare
   - Fix: rename the column 「他們的經驗」. Turn the sentence into a reported side effect: 「trailandcrag 提到，擦到手指關節摺痕的人特別容易裂開。」

6. **should-fix** — tldr (line 9) and description (line 8): 「查台灣食藥署全部藥品許可證資料集也沒有它或外用 methenamine 的許可紀錄」 and 「台灣食藥署許可證資料查無許可紀錄」.
   - Problem: the body is careful (「**未查到**…許可紀錄（查詢日期 2026-10-19）」, plus 「只代表這份資料集裡沒有」). The derived text drops both the hedge and the date. These are the lines answer engines lift.
   - Source: https://data.fda.gov.tw/opendata/exportDataList.do?method=ExportData&InfoId=36&logType=2 (re-downloaded 2026-10-19)
   - Fix: tldr 「…在食藥署全部藥品許可證資料集未查到它或外用 methenamine 的許可紀錄（2026-10-19 查詢）」. Description: 「未查到許可紀錄」.

7. **nit** — line 60, Li 2007: 「福建福州一帶」. The abstract says "three cities of southeast China". Fuzhou is only the authors' affiliation. Also 「33,000 名青少年」 were "college and high school students". Fix: 「中國東南部三個城市 33,000 名高中與大學生」. Source: https://pubmed.ncbi.nlm.nih.gov/18167205/

8. **nit** — line 78: 「基底是滑石、氧化鋅和白陶土」. The other ingredients also include water, glycerol 85%, carmellose sodium and eucalyptus oil. Write 「其他成分包括滑石、氧化鋅、白陶土、甘油、尤加利油等」. Source: antihydral.de/pflichttext

9. **nit** — line 127: 「trailandcrag 提醒，任何收乾的產品都不要擦在手指關節的摺痕上」. The source is about the strong ones ("A stronger drying product like antihydral cream or Rhino Skin Tip Juice… If you get it in the crease of a PIP or DIP joint, it can cause the skin to split"). Fix: 「強效的收乾產品」. Source: trailandcrag Wayback (above).

10. **nit** — line 131, 大森: 「手汗多的人，可以省掉化妝水和乳霜」. The source says 「ローションまたはクリームを塗る工程を省いてもいい」, i.e. skip the lotion **or** the cream step, not both. The 「溶掉」 framing is confirmed (「『削る』のではなく『溶かす』」). Fix: 「可以省掉化妝水或乳霜其中一步」. Source: https://www.climbers-web.jp/feature/article-93/

11. **nit** — line 162: Schulte is listed only under 貼回. Schulte actually gives both options: "You can tape it back down… If tomorrow is the last day of your road trip…" and "If you elect to do surgery, carefully trim the flap away… Apply an antibiotic ointment". Fix: put Schulte in both rows. Source: https://www.climbing.com/skills/skin-care-for-rock-climbing/

12. **nit** — line 170: 「trailandcrag 和 WMS 主張擦藥膏、包起來保持濕潤」. trailandcrag does say "covered it to keep it moist". WMS only says larger tears may need "additional dressing with antibiotic ointment" and never argues for moist healing. Fix: 「trailandcrag 主張擦藥膏、包起來保持濕潤；WMS 建議較大的傷口加上抗生素藥膏包紮」. Source: https://wms.org/magazine/magazine/1198/Climbing-Skin-Care/default.aspx

13. **nit** — line 139, UKC: 「厚繭的邊緣卡在點上」 is WMS's mechanism ("If a callus does not taper… a rough plateau… easily caught on a sharp rock edge"). UKC says "heavily callused skin is more prone to flappers" and that flappers come from "much pressure on a sharp hold, quite often when it is cold". Credit WMS for the edge mechanism. Also, the 「（2009）」 date did not appear in the copy I could read (jina; curl 403). Treat it as unverified, or drop the year.

14. **nit** — line 181, the Hörst podcast: the episode is #97 on the page (the URL slug says 93). The guest is Kevin Brown, co-founder and CEO of Friction Labs, and the notes end with a discount code. The "few quality attempts" point (09:20) is confirmed. Disclose the commercial interest the same way the post does for Lattice: 「（來賓是 Friction Labs 執行長）」. Source: https://trainingforclimbing.libsyn.com/93-getting-a-grip-all-about-chalk-use-and-skin-performance

15. **nit** — purchase channels in linked sources. The post itself recommends none. Three linked sources, though, show shop links on the page: the antihydral.de Pflichttext page has an 「Antihydral® online kaufen」 widget listing Amazon, Shop Apotheke, DocMorris and others; Buhay is a product round-up; the ClimberNews page has "Check Price on Amazon" buttons. The Pflichttext is the right primary source and should stay. Consider a short note after the TFDA paragraph: 「引用的德國仿單頁面與部分英文文章附有購買連結，那些管道不適用於台灣，本篇不建議。」

16. **nit** — medical-safety additions, both backed by sources the post already cites:
    - 甲醛過敏: most readers won't know whether they have it. Goossens & Aerts describe patch testing with formaldehyde 2% aq. Add 「不確定自己有沒有甲醛過敏，皮膚科可以做貼膚測試」.
    - Wound red flags (line 172): consider adding 「傷口沾到泥土、又不確定破傷風疫苗打到什麼時候，也去看醫師」. This is standard wound-care practice, but no source in the post states it, so either add a source or label it 推論. Neither this post nor 〈岩場急救〉 mentions tetanus (grep: 0 hits).

🟢 Confirmed (no change needed):
- Lai 2015: ~70,000 students (10,000 per area × 7); 2.08% overall; coastal 2.81% vs inland 1.53%.
- Li 2007: 4.36% and severe 0.27%.
- McConaghy 2018: aluminium chloride is initial treatment; iontophoresis for palms/soles; botulinum toxin first or second line; sympathectomy for severe refractory cases.
- Nawrocki & Cha 2019: antiperspirants first line; iontophoresis "primary remedy" for palmar/plantar; sympathectomy last resort with compensatory sweating.
- Hosseini 2023: 32 / 16 per group / 7 sessions; contraindications pregnancy, pacemakers, epilepsy.
- Antihydral: 13 g/100 g methenamine; Zul.-Nr. 6421167.00.00; formaldehyde allergy and weeping/blistered skin contraindications; Robugen.
- Phadke 1995: 60 patients, three arms, 10% methenamine solution, 4 weeks; superior to tap water iontophoresis, faster than glutaraldehyde, fewer side effects.
- Goossens & Aerts 2022: formaldehyde and its releasers are still common and still provoke hand dermatitis.
- Raymond & Solberg 2025: in vitro; chalk shortened aPTT but had no effect on PT. The post's caveat (no infection or healing data) is accurate.
- TFDA: 72,074 rows; data file 2026-10-15; 16 hits (all urinary anti-infectives); 14 cancelled; the 2 valid injection numbers match. Two further "HEXAMIN" brand-name rows are hexamidine and pyridoxine, so the post was right to exclude them.
- Sheffield 2019 (9 Jul 2019): mechanism; "difficult to recommend its use".
- ClimberNews: "We don't recommend this for the vast majority of people"; good routine plus chalk is often enough; formaldehyde allergy warning.
- 99Boulders (1 Dec 2021): the "15 minutes… didn't heal for 2 months" anecdote; cut flappers off, "never worked" taping back; file splits down to unbroken skin and moisturize.
- Clarke 2024: the sweaty-to-dry spectrum; Hörst palms-not-tips.
- Buhay (14 Aug 2026): tips only; more than weekly makes hands "gnarled, yellow".
- Lattice (24 Jan 2023): know your skin type; 3–4 nights of moisturizer; damp cloth; tape the warm-up; sells Rhino Skin (disclosed in the post).
- Schulte 2022: splits up to a week; "the bigger the split, the fewer goes"; over-gripping with taped tips; pink/weeping tips only fixed by rest.
- The Climbing Hangar: alcohol liquid chalk dries skin; moisturize at least 2 hours before; both flapper options.
- Rock+Run: liquid chalk as a base layer; dry skin should avoid drying-agent chalk.
- KletterRetter: skin-layer grading; "never file calluses completely"; resin/latex/alcohol allergens; see a dermatologist if symptoms persist.
- WMS: file callus edges; hardware-store glue not recommended, use medical-grade.
- REI (2018): covered and moist for a few hours, then open to dry, alternating.
- Climb On: "plasma, not sweat".
- 大森: ideal 角層 has some thickness, not too hard or soft; thin skin weeps more; 溶かす for tips, file other calluses; twice daily including rest days.
- gazispace (2022-01-24): wash after climbing, lotion before bed, file calluses, avoid hot water.
- PTT X-game 2009-02-21: 「液態粉又稱白手套」.
- Safety: 「請看皮膚科」 appears in the hyperhidrosis section, the TFDA paragraph and practice Q1. Infection red flags are listed. Pulley/joint pain is handed off to the injury posts. No purchase channel is given in the post's own text.

Scope statement: this pass checked the ~70 claims the post makes. It did not judge whether the post covers the topic fully (see post-review).

## post-review

Verdict: ready once the post-verify should-fixes are done. Mechanical checks are clean apart from the expected -en link.

Mechanical results:
- `node scripts/check-tw-terms.mjs` → 0 blocking, 0 to review.
- `node scripts/check-process-leak.mjs` → no output (pass).
- `pnpm check:references` → the only ERROR for this file is `/posts/climbing/2026-10-19-climbing-skin-care-en` (being written, not flagged). WARN: 「參考資料和標題/主要段落缺少明顯關鍵詞重疊」, a heuristic false positive since the references are on-topic.
- Internal links all resolve: crag-first-aid, finger-pulley-injury, finger-injuries-other, climbing-injury-overview, mental-tactics-overview, redpoint-projecting-tactics, conditions-friction. No links to sibling series G/H/J/K/L/M.
- `register-scan.sh` → 85 paragraphs; 16 long sentences; caveat density 7%; 0 blockquotes; 6 paragraphs with ≥4 numbers; names-as-subject 0; template transitions 0. `scan-ledger.sh` → no hits.

1. **should-fix** — practice Q1 (line 201) sets up 「還附了代購連結」, but the answer never addresses the 代購 link. For the medical-safety goal, that's the one place a reader is tempted to buy. Fix: add one sentence to the answer: 「代購的藥在台灣查不到許可紀錄，品質和用法都沒人把關；不要自己買來擦，先讓醫師評估。」 Keep it free of any legal claim unless a TFDA source on personal import is added.

2. **nit** — frontmatter: required fields present; `type: guide`; 5 tags, all existing. `climbing-injury` is a reasonable fit for flapper/split wound care. The series block matches `series.ts` (「攀岩心理與戰術」), order 7. The description (~170 characters) and tldr overlap heavily: both repeat Antihydral / 1995 / TFDA. Make the description the reader-facing scope list (偏汗偏乾、液態粉、裂口、繭、flapper、排趟數) and leave the evidence detail to the tldr. The title (~36 characters, colon plus comma) is long. Option: 「攀岩皮膚保養：手汗、裂口、flapper，和皮膚決定的嘗試次數」.

3. **nit** — glossary `methenamine` aliases: 「烏洛托品」 is the mainland pharmacopoeia name. TFDA records use 「六次甲基四胺」, which is already an alias. Keep 烏洛托品 only as a search alias, and add 「美先那命」 (used in a TFDA product name). Line 102's search-term list has 六亞甲基四胺 but not 六次甲基四胺, the term the TFDA rows actually use. I re-ran the search with 六次甲基四胺 added and the result is the same (16), so this is a documentation gap only: add it to the list.

4. **nit** — line 37: 「我們在 PubMed 找得到的攀岩皮膚研究，主要是腳」 has no link. Either link one foot-skin study, or rephrase as 「我們沒有找到攀岩者手部皮膚的臨床研究」, which the research note (line 626) supports.

5. **nit** — inline links (8.5): table cells cite 「Clarke 2024」「Schulte 2022」「Lattice」 without links. They are linked on first mention, so this passes, but the Hörst row could link Clarke directly.

Structure (guide): self-assessment, steps per problem, a sample session table, practice questions, next steps. Every section has a 今晚就能做的動作. Topic ownership (6.8): chalk friction is handed to post 6 and wound first aid to 〈岩場急救〉, without retelling. Good. Taiwan reader position (6.65): passes. The post opens at 龍洞, gives the TFDA check, the PTT 白手套 term, and a Taiwan-humidity note, and labels the 盛行率 extrapolation 推論. Cross-references (6.7): 「下面」 (line 37) and 「上面」 (line 115) both resolve.

Desired cross-links for the lead (plain text now, link later): 攀岩裝備系列 (chalk / tape / skin-kit items), 抱石系列 (flappers on dynos).

## post-polish

Verdict: the voice is plain and practical. The weak spots are the number-dense evidence paragraphs and a few 80+-character bullets in the medical section.

1. **should-fix** — line 96 (TFDA paragraph, 12 numbers) repeats what the `<details>` block below already says. Keep 「2026-10-19 查詢，未查到 Antihydral 或外用 methenamine 的許可紀錄」 and 「含 methenamine 的都是口服或注射的尿道抗菌藥」 in the body. Move 72,074 / 2026-10-15 / 16 / 14 into the details block.

2. **should-fix** — line 60 (prevalence, 8 numbers, 88-character sentence). Split it into two sentences and drop the severe-PPH 0.27% and the inland 1.53%. Example: 「福建三個城市 33,000 名學生裡，約 4% 有原發性手汗症（Li 2007）；中國全國約 7 萬名大學生的調查裡，沿海比內陸高（Lai 2015）。」

3. **nit** — lines 66–67: each review bullet is a single 83–88-character sentence. Break each at 「；」 into two sentences, or move the journal names into the link text and lead with the recommendation: 「外用氯化鋁是多數人的起始治療……（[美國家庭醫師期刊，2018](…)）」.

4. **nit** — line 85, 「**它的證據有多少？**」: the paragraph has 5 numbers and an 88-character sentence. Lead with the verdict: 「對照試驗只找到一篇：1995 年印度 60 人、為期 4 週」. Put the comparison arms in a second sentence.

5. **nit** — template transitions: 0. 「止血這一點有初步支持，不能當成處理傷口的方法」 (line 166) is an earned contrast. Keep it.

## Fix log (2026-10-19)

Fixer re-opened antihydral.de/pflichttext via curl (contraindications, sonstige Bestandteile, "nur in Apotheken", shop widget confirmed) and CDC tetanus wound-management page (curl 200). Groundlane not used (prior agents: 401); curl worked.

post-verify
1. fixed — 禁忌 now: formaldehyde or any ingredient; weeping/blistered skin; breastfeeding breast; pharmacy-only in DE. Face restriction removed.
2. fixed — Schreiner ladder rewritten; tldr/摘要/Q1 softened to 「多從氯化鋁止汗劑開始，手掌手汗常加上自來水離子導入」.
3. fixed — Hosseini caveat (untreated hand improved, no untreated control) added, labelled 研究.
4. fixed — reframed as 偏汗者 tactic attributed to Cameron Hörst; 偏乾 pointer added.
5. fixed — column renamed 「他們的經驗」; Hörst/Buhay cells now report experience/side effects only (no application sites); usage sentence turned into reported side effect; added 「只整理仿單上的禁忌，不提供用法…交給皮膚科」.
6. fixed — description, tldr, body, Q1 and reference line all carry 「未查到許可紀錄（查詢日期 2026-10-19）」.
7. fixed — 中國東南部三個城市 33,000 名高中與大學生.
8. fixed — 其他成分包括滑石、氧化鋅、白陶土、甘油、尤加利油等.
9. fixed — 「強效的收乾產品」. Also switched trailandcrag links to the Wayback snapshot (live site 404).
10. fixed — 「化妝水或乳霜其中一步」.
11. fixed — Schulte in both flapper rows.
12. fixed — trailandcrag vs WMS split.
13. fixed — edge mechanism credited to WMS; UKC year dropped (here and in references).
14. fixed — #97, Kevin Brown / Friction Labs disclosed in body and references.
15. fixed — note after TFDA paragraph that linked pages carry shop links, not applicable to Taiwan, not recommended.
16. fixed — patch-test sentence (Goossens & Aerts); tetanus sentence added with CDC source (new reference).

post-review
1. fixed — Q1 answer now says not to click the 代購 link, unlicensed in Taiwan, no quality/usage oversight, see a doctor first. No legal claim.
2. fixed — description rewritten as reader-facing scope list; title shortened to 「攀岩皮膚保養：手汗、裂口、flapper，和皮膚決定的嘗試次數」 (slug/date unchanged).
3. fixed — glossary aliases add 美先那命, 烏洛托品 noted as search-only; 六次甲基四胺 added to search-term list.
4. fixed — rephrased to 「我們沒有找到攀岩者手部皮膚的臨床研究」.
5. fixed — Hörst row links Clarke directly.

post-polish
1. fixed — 72,074 moved into details; body keeps verdict + "all urinary antiseptics".
2. fixed — prevalence split into two sentences; 0.27% and coastal/inland figures dropped.
3. fixed — review bullets lead with recommendation, journal in link text, split into two sentences.
4. fixed — evidence paragraph leads with the verdict.
5. no change needed.

Translation: src/content/posts/climbing/2026-10-19-climbing-skin-care-en.md written (series "Climbing Mental Game and Tactics", order 7); zh↔en links present. check:references: only error is not-yet-written redpoint-projecting-tactics-en. lint clean.
