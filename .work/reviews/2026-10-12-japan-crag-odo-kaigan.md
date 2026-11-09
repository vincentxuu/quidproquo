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

## 模板覆蓋

| 路線影片 | 已做：現有圖庫收錄 24 支公開影片；與分級表對照覆蓋 19／90 列。 |
| 經典線 | 已做 |
| 網路上的路線紀錄 | 已做 |

影片統計：查詢 98 組；候選 1630 支；收錄 24 支；有影片的路線 19／90 列
影片覆蓋說明：依 `.work/odo-kaigan/plan.md` 的既有研究範圍，查詢 98 組並掃描 11 個頻道、1630 支 uploads（候選母群，非逐支內容核對）。目前圖庫 24 支影片覆蓋分級表 19／90 列；未對上的列不推定有影片，也不再沿用「未發現公開攀登影片」的舊結論。

2026-11-04 本機一致性修正：以現有中英文文章、`src/data/climbing-videos.ts`、`video-evidence.json` 及上述研究紀錄回算；未新增公開搜尋、未重看影片。上方歷史審稿結論保留其原查核範圍，不代表本次重新查證。

## Checks

Final pnpm verify passed, including astro check, lint, references, language parity and grades. See .work/odo-kaigan/verify-final.log. Series grade scan:44 files,244 rows,no issues; legacy articles without route tables skipped. Source recheck:3 baselines,1 script404; Exa readback succeeded on same CLIMBING-net content. No publication performed.
