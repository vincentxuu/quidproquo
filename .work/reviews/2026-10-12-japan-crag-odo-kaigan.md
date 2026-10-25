# Odo Kaigan template refresh review — 2026-10-26

## post-verify

- 🟢 ROCKTOPO area/routes: route count 85, crack75, face9, boulder1; ten selected original YDS grades; no lengths; named 2P without inferred individual pitch grades. https://www.rocktopo.net/areas/166/routes
- 🟢 CLIMBING-net: winter, granite, south-facing, anchors and easier approach groups. Camping restriction expressly secondary, not current primary management order. https://www.climbing-net.com/iwaba_detail/%E5%A4%A7%E5%A0%82%E6%B5%B7%E5%B2%B8/
- 🟢 Official bus operator local timetable version October2026; no invented frequency or through-service. https://kochi-seinan.co.jp/local/
- 🟢 Official tourism transport retains destination boundaries: tourist coast walk25min vs unspecified crag approach; observatory drive40min not climbing base. https://visitkochijapan.com/en/see-and-do/10040 https://otsuki-kanko.jp/tourism/content4
- 🟢 Publisher metadata only, 2016 ebook; no interior topo checked. https://www.yamakei.co.jp/products/2815120465.html
- 🟢 FDMA English official source:119 and location/patient condition reporting. https://www.fdma.go.jp/publication/portal/items/portal002_english.pdf
- 🔵 Removed unsourced interpretation of 登り返し有 as a guaranteed uphill walk; preserve database tag and require topo for return plan. https://www.rocktopo.net/areas/166
- Limits: no current permit/bolting/camping primary order or onsite anchor inspection verified. No book interior, lengths, rope setups or route videos verified.

## post-review

Template: crag-guide + Insubong exemplar. Separate agent audited initial gaps; author reviewed final Chinese.
Reverse outline: sea-cliff appeal and team ability -> granite/crack profile -> sector/tide access table -> winter -> public transport/car/parking -> regulations and preparations -> four route grade groups -> book and source entrypoints -> dated update -> references.
Opening commitments all covered. No repeated popularity claims; removed ten-recent-logs extrapolation. Same YDS appears in original and YDS columns intentionally. Multi-pitch limitations explicit. Internal overview target exists.
Sentence-start review: each section starts with its reader decision, then evidence and action. Coast heights removed from reader narrative but preserved in original snapshot and research note.
Source constraints stay visible where they affect planning. Skills reviewed: post-update, crag-guide-contract/templates, post-review, post-verify, post-polish. No publication authorization inferred.

## post-polish

Chinese register scan: 2 long sentences, no template contrast phrases, no generic English jargon hits. Long source/version/book metadata acceptable; practical instructions present for selecting sector, tide window, transfer, parking and topo. Quotes retained only in sector table to preserve exact access warnings. No invented firsthand experience.

## Checks

Initial pre-supplement pnpm verify passed in shared checkout; final isolated supplement verification recorded in .work/odo-kaigan/verify-supplement.log. Series grade scan:44 files,244 rows,no issues; legacy articles without route tables skipped. Source recheck:3 baselines,1 script404; Exa readback succeeded on same CLIMBING-net content. No publication performed.

## Supplement review

- Initial six public videos from five route names; metadata verified public/playable_in_embed, original title/channel/runtime preserved. Four private club embeds excluded, ambiguous Uzushio/Guinomi clip excluded.
- Route-name mapping uses existing gallery renderer, routeEn Japanese labels match both table first columns. Beginner four clips + intermediate two, no duplicated standalone gallery.
- Top-rope vs lead, timelapse vs real time, Monkey Roof left variant, SAM short clip vs full2P explicitly distinguished.
- Four independent first-person reports + crag introduction; date and SAM partial variant explicit. Cleopatra developer grade correction5.10c->5.11a agrees table; no grade changed from conflicting captions.
- No new UI implementation or dependency; reuse production gallery/table behavior. Final verify/render evidence pending.

- Independent final review by odo_reports: bilingual report summaries, Cleopatra revision, SAM partial version and six gallery-prefix mappings checked; no required fixes found.
- Sample frame inspection: initial six clips visually show granite crack climbing; Guinomi title overlay confirms route5.8, top-rope clip distinct; no full-motion/anchor safety assessment claimed.

- Extra gallery regression:14 passed,1 failed; exact same failure reproduced using original origin/main renderer/test/data in /tmp/qp-odo-gallery-baseline. Stale Insubong count33 vs91, unrelated to odoKaigan addition. No checks weakened.

## 模板覆蓋

| 模板項目 | 結論與證據 |
| --- | --- |
| 這是什麼樣的岩場 | 已做：花崗岩、傳攀能力、主區與白區範圍分開。 |
| 什麼季節去 | 已做：冬季、南向反照與潮汐另判。 |
| 怎麼去 | 已做：公共交通／開車／停車三節。 |
| 去之前要知道的規範 | 已做：二手露營資訊明標、未核實許可與固定點、119一手來源。 |
| 依程度挑路線 | 已做：入門／中級／進階／高手四級；ROCKTOPO84繩攀全收、1抱石另列。開拓者補5主區線、theTopo1未對照名稱另標。 |
| 查資料的入口 | 已做：DB、管理與營運者、正式書目且未讀內頁明示。 |
| 參考資料 | 已做：來源連結逐列＋文末。 |
| 路線影片 | 已做：逐條85筆、Treasure Ship及5條開拓者補線搜尋；七組多語／子區／年份搜尋；11個頻道1630筆uploads掃描；逐支metadata核對。 |
| 經典線 | 已做：Mitsumine2019推薦SuperCrack／MonkeyRoof，開拓者2024推薦GyominClub；理由與來源放回分級表備註，無重複表。 |
| 網路上的路線紀錄 | 已做：實際打開超過5篇候選；Miroku、Go for it、kbt、開拓者、Yamano、Mitsumine等，實用紀錄整合回對應路線備註。 |

影片統計：查詢 98 組；候選 31 支；收錄 24 支；有影片的路線 19／90 列
影片覆蓋說明：每條主區路線與補線已搜，另掃11頻道1630筆；31個具名候選中排除4私人、1異岩場、1片名描述矛盾、1未能對照到清單路線。主區多數線未找到具名公開影片；不為提高覆蓋率將白區、無名線或變形混回原線。

來源覆蓋：ROCKTOPO85筆（84繩攀＋1抱石）完整納入；theTopo11筆中10筆對應既有名稱並列原級數，TreasureShip1筆日文名稱未對照；開拓者2024補5主區線，另1白區線不混入。theCrag四國4筆／MP日本目錄未找到可用大堂清單；出版社只讀書目未讀topo；白區獨立28筆未併主區。沒有聲稱全岩場完整開拓清單或取得第二份完整topo。

## Final acceptance scope

- Expanded source review by odo_reports:five added developer routes,90bilingualtable rows, protection-style limits and partial-version notes checked; no required fixes.
- Standalone article artifact rendered with actual production remark plugin,CSS andcontroller:19route buttons,24uniqueclips; open/close/alternate switching passed desktop1440 andmobile390 in both languages. Not full-site acceptance; fullAstrodev had dependency-symlink allow-list/startup issues.
- Canonical verify and hook logs retained locally separately; stale Insubong regression failure remains explicitly reported.
