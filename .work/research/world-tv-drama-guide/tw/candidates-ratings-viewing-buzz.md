# Taiwanese scripted TV (台劇) candidates — Category C (ratings) / D (viewing data) / E (buzz/demand)

Collected 2026-11-13 for the zh-TW series「各國影劇導讀」. Data file only — no article copy.
Scope: Taiwan-produced scripted series (無線台 / 有線台 八點檔 & 偶像劇, 公視 / 華視 / 大愛, and Taiwanese streaming originals on Netflix / Disney+ / CATCHPLAY+ / friDay / LINE TV / myVideo / Hami). Mainland / HK productions, variety, reality, animation and films excluded (see §4). D/E focus 2016–2026; C lists and the TDI ratings list keep older classics.
Boundary with `candidates-fans-taiwan.md`: this file does **not** use Netflix Taiwan weekly charts, Taiwan platform year-end rankings (friDay / LINE TV / Hami / myVideo / 公視+), LINE TODAY votes or PTT. Where a read source quotes such a chart in passing (e.g. DailyView citing MyVideo), it is ignored here.
Tools: Groundlane `web_search` / `web_fetch` / `web_extract` (primary; also read the Netflix all-weeks TSV and the rendered Google Trends Year-in-Search pages); Exa `web_fetch_exa` (IMDb); jina `read_url` (tw.dorama.info, PTS PDF). See §6 toolDegradation.

## 1. Sources

Read status: **read** = page body fetched and parsed; **partial** = fetched but only part of the needed data present; **snippet** = only a search-result excerpt seen (shown in tags but **not counted**); **unread** = blocked / not reachable / not attempted.

| Key | Source | URL | Read status | What was extracted |
|---|---|---|---|---|
| IMDb | IMDb advanced search: TV series + mini-series, country = Taiwan, **genre ≠ Animation**, ≥500 votes, sorted by user rating | https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&countries=TW&genres=!animation&sort=user_rating,desc&num_votes=500,&count=100 | read (Exa) | Whole list = 55 titles (no ≥1,000 cut needed; most TW titles have 500–3,500 votes). Rating + votes. Non-Taiwanese / co-pro rows flagged in §4 |
| MDL | MyDramaList top-rated Taiwanese dramas, pages 1–3 (ranks 1–60) + show pages for ranks 1–20 | https://mydramalist.com/search?adv=titles&ty=68&co=5&so=top (&page=2, &page=3) — `/shows/top_taiwanese_dramas` returns 404, so the advanced-search "Top" sort with country = Taiwan is used (same ordering MDL uses for its top_* pages) | read; "scored by N users" for ranks 1–20 via `web_extract` | Rank, score, ratings count (1–20). Specials / parts ranked separately (We Best Love SE, Had I Not Seen the Sun Pt2, Someday or One Day Extra Scene, HIStory sub-seasons) |
| DB20 / DB22 / DB23 / DB24 / DB25 | 豆瓣年度「评分最高华语剧集」 (2020, 2022, 2023, 2024, 2025) — Taiwanese entries only | DB20 https://www.sohu.com/a/446468313_99994603 ; DB22 https://finance.sina.cn/2022-12-27/detail-imxyayvx1257202.d.html ; DB23 https://news.qq.com/rain/a/20231226A05R2C00 ; DB24 https://news.qq.com/rain/a/20241224A03R7X00 ; DB25 https://movie.douban.com/annual/2025/ | read in the **cn round (2026-11-12)**, positions taken from `../cn/candidates-ratings-viewing-buzz.md` §4; DB23 re-read today (`web_extract` on the qq page confirms order 漫长的季节 › 三体 › 去有风的地方 › **不良执念清除师** › **有生之年** › **八尺门的辩护人**) | Rank; scores only for DB25 (live values at cn-round read time). The cn file missed 不良执念清除师 (DB23 #4) — added here |
| DB21 | 豆瓣 2021 華語劇集 (official list reportedly mixed in 俗女养成记2 #2) | (Sina snippet, per cn file) | snippet | 俗女養成記2 #2 — **not counted** |
| NFG | Netflix Tudum **global** weekly Top 10, TV (Non-English) — official all-weeks dataset, 2021-07-04 → 2026-11-08 | https://www.netflix.com/tudum/top10/data/all-weeks-global.tsv | read (Groundlane `web_extract`, full 921 KB file, regex on title names) | Only **two** Taiwanese titles ever charted: 模仿犯 Copycat Killer (2 weeks) and 乩身 Agent from Above (1 week). Searched and absent: Wave Makers, Light the Night, The Victims' Game, Born for the Spotlight, GG Precinct, Let's Talk About CHU, Had I Not Seen the Sun, The Resurrected, Million-Follower Detective, Shards of Her, Triad Princess, Detention, Mom Don't Do That!, Women in Taipei, At the Moment, Port of Lies, I Am Married...But!, Someday or One Day, Imperfect Us, Twisted Strings, Fight for Love, Outlaw Doctor, Zero Day, Taiwan Crime Stories, Plus & Minus, Seqalu, Magician on the Skywalk, Gold Leaf, Oh No!, Kiseki, World Between Us, Lost Romance, Danger Zone, Secret Lover |
| NF23H1 | Netflix *What We Watched* Jan–Jun 2023 — Taiwanese titles filtered by a blogger (方格子 Mion 麥恩) | https://vocus.cc/article/657e758dfd8978000185bcbd | read (secondary: blog extraction of the official xlsx; hours viewed, global rank among ~18,000 titles) | Top 30 Taiwanese titles by hours. Includes a film (咒) and variety (光露營, 嗨!營業中) — dropped (§4) |
| NF24H1 | Netflix engagement report Jan–Jun 2024 — TAICCA research note | https://research.taicca.tw/article/27ca63a2-fb49-4050-a5dd-238d9c6d57a3 | read | Only states the top Taiwanese series: 愛愛內含光 2.3M views |
| NF25 | Netflix 2025 full-year (H1+H2 engagement data) 華語劇 views top 10 — FTNN 新聞網 | https://www.ftnn.com.tw/news/518754 | read | 3 Taiwanese originals in the 華語 top 10 with views |
| NF26H1 | Netflix *What We Watched* Jan–Jun 2026 — Taiwanese series top 10 compiled by 風傳媒 | https://www.storm.mg/lifestyle/11152244 | read (`web_extract` pattern on rank headings) | Rank 1–10 + views |
| NF-misc | ETtoday on NF26H1 (乩身 4.9M = new high for a Netflix original 台劇; global #426) ; LTN on NF26H1 | https://star.ettoday.net/news/3202916 ; https://ent.ltn.com.tw/news/breakingnews/5509209 | snippet | consistent with NF26H1 — not counted |
| NF24 (bnext) | 數位時代 analyses of 2024 Taiwanese Netflix originals | https://www.bnext.com.tw/article/82098/taiwan-tv-shows-on-netflix ; https://www.bnext.com.tw/article/84016/netflix-2025-mandarin | partial (82098 = FlixPatrol points + Netflix **Taiwan** charts → outside scope; 84016 fetch returned an unrelated article body) | not used |
| NFAT | Netflix Tudum all-time top 10 non-English shows | https://www.netflix.com/tudum/top10/most-popular/tv-non-english | not re-read (jp round read it: no Taiwanese title possible given NFG peak of 17.7M hours) | — |
| TDI | 台灣偶像劇場 tw.dorama.info「電視劇收視率排行榜」— AGB Nielsen 全區, all-time; four tables: 最高 (peak episode), 首回, 終回, 平均 (series average), 30 rows each | http://tw.dorama.info/state/ranking_rate.php | read (jina; Groundlane HTTP 403, Exa CRAWL_REDIRECT) | Rank + rating. Site notes "資料並未收集完全". `?year=` filter ignored by the server (same all-time page returned), so **no per-year 2019–2025 table** was obtained. Heavily 2005–2018 |
| NOW21 | NOWnews「20年來哪部台劇最夯」(2021-12-14) — 10 大偶像劇單集收視 2005– | https://www.nownews.com/news/5474128 | read | Cites tw.dorama.info → **same data as TDI; not counted separately** (shown only where it adds nothing new) |
| PTSQ | 公視企劃部《收視季報告》(Nielsen) 2024 Q4 / 2025 Q1 | https://info-material.pts.org.tw/prg/tv_rating/2024tv_rating_q4.pdf ; https://info-material.pts.org.tw/prg/tv_rating/2025tv_rating_q1.pdf | partial (jina full text; PTS-channel-centric, garbled spacing; no cross-channel annual drama ranking) | not used for tags |
| GYS19 | Google 台灣 2019 年度搜尋排行 (official blog) | https://blog.google/intl/zh-tw/products/explore-get-answers/2019_12_products-search-year-in-searc/ | read | 我們與惡的距離 = **快速竄升關鍵字總榜 #1** (first drama ever) |
| GYS20 | Google 台灣 2020 快速竄升戲劇 (Cosmopolitan TW) | https://www.cosmopolitan.com/tw/entertainment/movies/g34912524/2020-google-drama-top10/ | partial (article names only #1–4 + two unranked top-10 members) | 想見你 #4; 做工的人, 我的婆婆怎麼那麼可愛 "in top 10" |
| GYS21 | Google Year in Search 2021 Taiwan — 快速竄升戲劇 (all countries) | https://trends.withgoogle.com/year-in-search/2021/tw/ | read (Groundlane browser render) | Ranks 1–10; no separate 台灣戲劇 list shown before "Load more" |
| GYS22 | Google 2022 快速竄升台灣戲劇 top 10 (TVBS 女人我最大; ranks 2–4 cross-checked with HK01 snippet) | https://woman.tvbs.com.tw/entertainment/36060 (rendered Trends page https://trends.withgoogle.com/year-in-search/2022/tw/ showed no drama list before "Load more") | read | Ranks 1–10 |
| GYS23 | Google Year in Search 2023 Taiwan — 快速竄升台灣戲劇 + 快速竄升戲劇影集 | https://trends.withgoogle.com/year-in-search/2023/tw/ (+ blog https://blog.google/intl/zh-tw/products/explore-get-answers/2023_12_year-in-search-2023/) | read | Both lists 1–10 |
| GYS24 | Google Year in Search 2024 Taiwan — 快速竄升戲劇 (all countries) | https://trends.withgoogle.com/year-in-search/2024/tw/ | read for 戲劇 list; the 2024 **台灣戲劇** list (if any) sits behind "Load more" → **unread** | 4 Taiwanese titles in the all-country top 10 |
| GYS25 | Google Year in Search 2025 Taiwan — 快速竄升台灣戲劇 | https://trends.withgoogle.com/year-in-search/2025/tw/ | read | Ranks 1–10 (no all-country 戲劇 list shown before "Load more") |
| DV23 / DV24 / DV25 | 網路溫度計 DailyView × KEYPO 年度台劇聲量 TOP 10 | DV23 https://dailyview.tw/daily/3930 (2023 全年) ; DV24 https://dailyview.tw/daily/4318 (**2024-01-01 → 09-12 only**) ; DV25 https://dailyview.tw/daily/5199 (2025-01-01 → 12-16) | read | Rank 1–10 by online-discussion volume (not sentiment) |
| DV-m | DailyView 台劇月榜 2026-05-26 → 06-24 (風傳媒) | https://www.storm.mg/lifestyle/11144549 | snippet | 欠妳的那場婚禮 #1 8,825; 百味人生 #2; 好運來 #3; 如果我不曾見過太陽 #10 — monthly, not annual; **not counted** |
| PAR | Parrot Analytics — Taiwan / Taiwanese-title data | search: contentasia.tv Taiwan weekly demand pieces (Queen of Tears, Frieren lead) | snippet | No Taiwanese scripted title surfaced in any Parrot annual / Global Demand Award piece — nothing to tag |
| FLX | FlixPatrol | — | not attempted (third-party, mixes Taiwan charts; jp round found it Cloudflare-blocked) | — |

Key counting: one key per report/year (DB20…DB25, GYS19…GYS25, DV23…DV25, NF23H1/NF24H1/NF25/NF26H1 are separate keys), mirroring the jp/kr/cn files. NFG + NF* are all Netflix; GYS* all Google; DV* all KEYPO; DB* all Douban — see §5 before ranking by "independent families".

## 2. Coverage check — biggest names × source families

| Show | IMDb | MDL | Douban (DB*) | Netflix (NFG / NF*) | Nielsen (TDI) | Google (GYS*) | DailyView (DV*) |
|---|---|---|---|---|---|---|---|
| 模仿犯 | 7.0 (3K) | #21 8.1 | – | NFG #2 + #5 (2023); NF23H1 45.6M h; NF26H1 #5 | n/a (streaming) | 2023 台灣戲劇 #1 + 戲劇影集 #1 | DV23 #2 |
| 我們與惡的距離 (I / II) | 8.8 (3.3K) | #11 8.4 | DB25 #3 (II) | – (HBO Asia / CATCHPLAY+, not Netflix) | – | 2019 總榜 #1; 2025 #3 (II) | DV25 #7 (II) |
| 想見你 | 8.4 (2.6K) | #1 8.8 (11,133) | DB20 #1 | NF23H1 2.2M h | – (2019 airing not in TDI's all-time top 30) | 2020 戲劇 #4 | n/a (pre-DV) |
| 人選之人—造浪者 | 8.2 (1.7K) | – | – | NF23H1 8.2M h (TW #2) | n/a | 2023 #6 | DV23 #1 |
| 華燈初上 | 7.4 (1.8K) | S2 #32, S1 #34, S3 #48 | – | NF23H1 1.5/1.0/1.0M h | n/a | 2022 #1 | n/a |
| 不夠善良的我們 | – (below 500 votes or not TW-tagged) | #50 7.9 | DB24 #8 | n/a (not a Netflix original) | – | 2024 戲劇 #3 | DV24 #3 |
| 影后 | 7.8 (830) | – | – | **absent** from NFG; not named in any NF read | n/a | 2024 戲劇 #4 | – (aired Nov 2024, after DV24 window) |
| 我的婆婆怎麼那麼可愛 | – | – | – | – | – | 2020 top 10 (unranked) | DV24 #4 |

"–" = checked, absent. "n/a" = metric does not apply / source does not cover the period. Two populations again: (a) prestige 公視 / streaming dramas (與惡, 想見你, 人選之人, 八尺門, 模仿犯) that dominate Google + Douban + DailyView; (b) BL / idol romance (We Best Love, HIStory3, See Your Love, Unknown, The On1y One) that dominate MDL and much of IMDb but have no Google / DailyView / Nielsen footprint. 八點檔 (天道, 願望, 百味人生, 好運來) show up only in DailyView/Google, and no recent per-show Nielsen table was obtainable.

## 3. Candidate table

Distinct-source count uses the keys in §1; snippet keys (DB21, NF-misc, DV-m, NOW21) are shown but not counted. Rows sorted by count, then first-air year.
**†** after a title = that Chinese or English title was supplied from memory (not printed in any read source). **First-air year, network/platform and genre are from memory (unsourced) for every row** unless a read source prints them (Netflix sources → "Netflix"; DV/GYS articles sometimes name the channel). Franchises / seasons are merged into one row.

Shows with ≥3 sources: 模仿犯 (7); 我們與惡的距離 (6); 想見你, 她和她的她, 回魂計 (5); 人選之人—造浪者, 八尺門的辯護人, 不良執念清除師, 不夠善良的我們, 愛愛內含光, 誰是被害者, 如果我不曾見過太陽, 童話故事下集, 忘了我記得, 華燈初上, 乩身, 下一站，幸福 (4); 有生之年, 此時此刻, 正港分局, 化外之醫, 極道千金, 惡作劇之吻 (系列), 我可能不會愛你, 命中注定我愛你, 比悲傷更悲傷的故事 影集版 (3). Total: 150 titles in 94 table rows (rows 65, 68, 81–87, 91–93 bundle 1-source titles) — 1 source: 98; 2: 26; 3: 9; 4: 12; 5: 3; 6: 1; 7: 1.

| # | 中文片名 | English title | First-air | Network/platform | Genre | Evidence tags | Distinct sources | Keys |
|---|---|---|---|---|---|---|---|---|
| 1 | 模仿犯 | Copycat Killer | 2023 | Netflix | crime thriller | `C IMDb 7.0 (3K)`; `C MDL #21 8.1`; `D Netflix global non-English #2 (week of 2023-04-09, 17.74M hours) and #5 (2023-04-16, 8.22M hours) — first Taiwanese series ever in the global top 10`; `D NF23H1 45.6M hours (global #341 of ~18,000; #1 Taiwanese title)`; `D NF26H1 TW-series #5, 0.4M views (catalogue)`; `E Google 2023 快速竄升台灣戲劇 #1 + 快速竄升戲劇影集 #1 (all countries)`; `E DailyView 2023 #2` | 7 | DV23, GYS23, IMDb, MDL, NF23H1, NF26H1, NFG |
| 2 | 我們與惡的距離 / 我們與惡的距離II | The World Between Us | 2019 (II 2025) | 公視 / HBO Asia (II: 公視 / CATCHPLAY+) | social drama | `C IMDb 8.8 (3.3K) — #1 TW series on IMDb`; `C MDL #11 8.4 (535)`; `E Google 2019 快速竄升關鍵字總榜 #1 (first drama ever)`; `C 豆瓣 2025 评分最高华语剧集 #3 (II, 8.4)`; `E Google 2025 快速竄升台灣戲劇 #3 (II)`; `E DailyView 2025 #7 (II)` | 6 | DB25, DV25, GYS19, GYS25, IMDb, MDL |
| 3 | 想見你 | Someday or One Day | 2019 | 中視 / 八大† (later Netflix) | time-travel romance mystery | `C MDL #1 8.8 (11,133); Extra Scene #8 8.4 (1,215)`; `C IMDb 8.4 (2.6K)`; `C 豆瓣 2020 评分最高华语剧集 #1`; `E Google 2020 快速竄升戲劇 #4 (partial)`; `D NF23H1 2.2M hours` | 5 | DB20, GYS20, IMDb, MDL, NF23H1 |
| 4 | 她和她的她 | Shards of Her | 2022 | 台視 / Netflix† | psychological drama | `C IMDb 6.9 (926)`; `C MDL #24 8.1`; `C 豆瓣 2022 评分最高华语剧集 #2`; `E Google 2022 快速竄升台灣戲劇 #3`; `D NF23H1 1.5M hours` | 5 | DB22, GYS22, IMDb, MDL, NF23H1 |
| 5 | 回魂計 | The Resurrected | 2025 | Netflix (TW/TH co-pro per DV25) | supernatural revenge thriller | `C IMDb 7.0 (976)`; `D NF25 華語劇 #5, 2.4M views`; `D NF26H1 TW-series #7, 0.4M views`; `E Google 2025 快速竄升台灣戲劇 #8`; `E DailyView 2025 #5` | 5 | DV25, GYS25, IMDb, NF25, NF26H1 |
| 6 | 人選之人—造浪者 | Wave Makers | 2023 | Netflix | political drama | `C IMDb 8.2 (1.7K)`; `D NF23H1 8.2M hours (TW #2, global #2441)`; `E Google 2023 快速竄升台灣戲劇 #6`; `E DailyView 2023 #1` | 4 | DV23, GYS23, IMDb, NF23H1 |
| 7 | 八尺門的辯護人 | Port of Lies | 2023 | 公視 (later Netflix†) | legal thriller | `C IMDb 8.1 (551)`; `C 豆瓣 2023 评分最高华语剧集 #6`; `E Google 2023 快速竄升台灣戲劇 #2`; `E DailyView 2023 #4` | 4 | DB23, DV23, GYS23, IMDb |
| 8 | 不良執念清除師 | Oh No! Here Comes Trouble | 2023 | 華視 / 公視+† | fantasy comedy | `C MDL #2 8.7 (6,869)`; `C IMDb 7.9 (711)`; `C 豆瓣 2023 评分最高华语剧集 #4`; `E Google 2023 快速竄升台灣戲劇 #4` | 4 | DB23, GYS23, IMDb, MDL |
| 9 | 不夠善良的我們 | Imperfect Us | 2024 | 華視 / HBO / Netflix† | relationship drama | `C MDL #50 7.9`; `C 豆瓣 2024 评分最高华语剧集 #8`; `E Google 2024 快速竄升戲劇 #3 (all countries)`; `E DailyView 2024 (Jan–Sep) #3` | 4 | DB24, DV24, GYS24, MDL |
| 10 | 愛愛內含光 | Let's Talk About CHU | 2024 | Netflix | sex comedy | `C IMDb 7.1 (935)`; `D NF24H1 2.3M views (top Taiwanese series, per TAICCA)`; `E Google 2024 快速竄升戲劇 #6`; `E DailyView 2024 #10` | 4 | DV24, GYS24, IMDb, NF24H1 |
| 11 | 誰是被害者（S1–S2） | The Victims' Game | 2020 (S2 2024) | Netflix | crime thriller | `C IMDb 7.3 (2.4K)`; `C MDL S1 #27 8.1; S2 #37 8.0`; `D NF23H1 S1 1.9M hours`; `E DailyView 2024 #6 (S1–2)` | 4 | DV24, IMDb, MDL, NF23H1 |
| 12 | 如果我不曾見過太陽（第一部 / 第二部） | Had I Not Seen the Sun | 2025 | Netflix | crime mystery | `C IMDb 7.7 (768)`; `C MDL Pt1 #4 8.5 (3,176); Pt2 #5 8.5 (2,378)`; `D NF25 華語劇 #4, 2.9M views`; `D NF26H1 TW-series #3 (Pt1 0.8M) / #4 (Pt2 0.7M)`; `E DailyView 2026-06 月榜 #10 (snippet)` | 4 | IMDb, MDL, NF25, NF26H1 |
| 13 | 童話故事下集 | —† | 2025 | Netflix | marriage romcom | `D NF25 華語劇 #7, 2.1M views`; `D NF26H1 TW-series #10, 0.1M views`; `E Google 2025 快速竄升台灣戲劇 #1`; `E DailyView 2025 #3 (DV also says "近200萬次觀看, Netflix 季度榜第四" — Netflix claim not counted separately)` | 4 | DV25, GYS25, NF25, NF26H1 |
| 14 | 忘了我記得 | Forget You Not | 2025 | Netflix (per DV25) / 公視† | family drama (dementia) | `C MDL #52 7.8`; `C 豆瓣 2025 评分最高华语剧集 #4 (8.3)`; `E Google 2025 快速竄升台灣戲劇 #4`; `E DailyView 2025 #2 (DV cites IMDb 8.1 — below 500-vote threshold here)` | 4 | DB25, DV25, GYS25, MDL |
| 15 | 華燈初上（第一–三部） | Light the Night | 2021–2022 | Netflix | period mystery | `C IMDb 7.4 (1.8K)`; `C MDL S2 #32 8.0; S1 #34 8.0; S3 #48 7.9`; `D NF23H1 Pt1 1.5M / Pt2 1.0M / Pt3 1.0M hours`; `E Google 2022 快速竄升台灣戲劇 #1` | 4 | GYS22, IMDb, MDL, NF23H1 |
| 16 | 乩身 | Agent from Above | 2026 | Netflix | folk-religion fantasy action | `C IMDb 6.3 (849)`; `C MDL #55 7.8`; `D Netflix global non-English #6 (week of 2026-04-05, 8.1M hours, 1.4M views)`; `D NF26H1 TW-series #1, 4.9M views (record for a Netflix TW original per ETtoday snippet)` | 4 | IMDb, MDL, NF26H1, NFG |
| 17 | 有生之年 | —† | 2023 | 公視 / 華視† | family drama | `C 豆瓣 2023 评分最高华语剧集 #5`; `E Google 2023 快速竄升台灣戲劇 #3`; `E DailyView 2023 #7` | 3 | DB23, DV23, GYS23 |
| 18 | 此時此刻 | At the Moment | 2023 | Netflix | romance anthology | `C IMDb 6.9 (520)`; `E Google 2023 快速竄升台灣戲劇 #5`; `E DailyView 2023 #6` | 3 | DV23, GYS23, IMDb |
| 19 | 正港分局 | GG Precinct | 2024 | Netflix | crime comedy | `C IMDb 5.9 (519)`; `E Google 2024 快速竄升戲劇 #9`; `E DailyView 2024 #5` | 3 | DV24, GYS24, IMDb |
| 20 | 化外之醫 | The Outlaw Doctor | 2025 | 公視 (per DV25) | medical / migrant-worker drama | `C IMDb 7.5 (517)`; `E Google 2025 快速竄升台灣戲劇 #9`; `E DailyView 2025 #10 (DV: 公視首播 週日華語劇收視冠軍)` | 3 | DV25, GYS25, IMDb |
| 21 | 極道千金 | Triad Princess | 2019 | Netflix | romcom | `C IMDb 6.6 (1.1K)`; `D NF23H1 2.0M hours`; `D NF26H1 TW-series #8, 0.2M views` | 3 | IMDb, NF23H1, NF26H1 |
| 22 | 惡作劇之吻 / 惡作劇2吻 | It Started with a Kiss / They Kiss Again | 2005 / 2007 | 中視 | idol romcom (classic) | `C MDL They Kiss Again #14 8.3 (8,712); ISWAK #23 8.1`; `C IMDb Mischievous Kiss 7.6 (1.2K); They Kiss Again 7.4 (854)`; `D TDI 最高 #11 6.50 (惡作劇之吻 ep20); 惡作劇2吻 最高 3.94, 平均 3.17` | 3 | IMDb, MDL, TDI |
| 23 | 我可能不會愛你 | In Time with You | 2011 | 中視 / 八大 (TDI: 民視) | romance (classic) | `C IMDb 8.1 (610)`; `C MDL #28 8.1`; `D TDI 最高 #12 / 終回 5.51 (ep13)` | 3 | IMDb, MDL, TDI |
| 24 | 命中注定我愛你 | Fated to Love You (IMDb: "Destiny Love") | 2008 | 台視 | idol romcom (classic) | `C IMDb 7.4 (650)`; `D TDI 最高 #2 10.91 (偶像劇 record), 終回 #1 9.80, 平均 #2 7.44`; `D NF23H1 1.6M hours` | 3 | IMDb, NF23H1, TDI |
| 25 | We Best Love（永遠的第一名 / 二位情人†） | We Best Love: No. 1 For You / Fighting Mr. 2nd | 2021 | WeTV / GagaOOLala† | BL | `C IMDb 8.2 (3.4K)`; `C MDL No.1 For You #16 8.2 (40,270); Fighting Mr. 2nd #19 8.2 (30,197); SE #12 8.4 (7,206) / #17 8.2 (6,419)` | 2 | IMDb, MDL |
| 26 | HIStory 系列（HIStory2 越界 / HIStory3 圈套 / 那一天†） | HIStory / Crossing the Line / Trapped / Make Our Days Count | 2017–2023 | 八大 / CHOCO TV† | BL anthology | `C IMDb HIStory 8.0 (1.9K); Crossing the Line 8.1 (874)`; `C MDL HIStory3: Trapped #15 8.3 (37,015); HIStory3 (combined) #13 8.3 (869); HIStory2: Crossing the Line #33; HIStory3: Make Our Days Count #39; HIStory2 #46` | 2 | IMDb, MDL |
| 27 | 默默†（The On1y One） | The On1y One | 2024 | —† | BL | `C IMDb 8.5 (8.3K) — highest vote count of any TW series`; `C MDL #18 8.2 (15,517)` | 2 | IMDb, MDL |
| 28 | 未知†（Unknown） | Unknown | 2024 | —† | BL family drama | `C IMDb 8.5 (1.8K)`; `C MDL #10 8.4 (19,487)` | 2 | IMDb, MDL |
| 29 | 看見你的聲音† | See Your Love | 2024 | —† | BL | `C IMDb 8.4 (990)`; `C MDL #3 8.6 (17,197)` | 2 | IMDb, MDL |
| 30 | 比悲傷更悲傷的故事 影集版 | More Than Blue: The Series | 2021 | Netflix | romance melodrama | `C IMDb 8.2 (720)`; `C MDL #9 8.4 (3,994)`; `D NF23H1 1.1M hours` | 3 | IMDb, MDL, NF23H1 |
| 31 | 奇蹟† | Kiseki: Dear to Me | 2023 | —† | BL | `C IMDb 7.9 (1.5K)`; `C MDL #30 8.0` | 2 | IMDb, MDL |
| 32 | 關於未知的我們† | About Youth | 2022 | —† | BL | `C IMDb 7.7 (678)`; `C MDL #41 7.9` | 2 | IMDb, MDL |
| 33 | 我的牙想你† | My Tooth Your Love | 2022 | —† | BL | `C IMDb 7.7 (744)`; `C MDL #44 7.9` | 2 | IMDb, MDL |
| 34 | 正負之間† | Plus & Minus | 2022 | —† | BL | `C IMDb 7.3 (975)`; `C MDL Extra #56 7.8` | 2 | IMDb, MDL |
| 35 | 你是我的† | You Are Mine | 2023 | —† | BL office romance | `C IMDb 7.0 (555)`; `C MDL Special #53 7.8` | 2 | IMDb, MDL |
| 36 | 我結婚了...但是!† | I Am Married...But! | 2025 | Netflix | marriage romcom | `C IMDb 7.1 (661)`; `C MDL #54 7.8` | 2 | IMDb, MDL |
| 37 | 愛上哥們 | Bromance | 2015 | 華視† | romcom | `C IMDb 7.8 (544)`; `C MDL #42 7.9` | 2 | IMDb, MDL |
| 38 | 下一站，幸福 | Autumn's Concerto | 2009 | 台視 | romance melodrama (classic) | `C MDL #6 8.4 (13,461)`; `C IMDb 7.8 (668)`; `D TDI 最高 #4 8.23, 終回 #3 8.07, 平均 #4 5.80`; `D NF23H1 1.8M hours` | 4 | IMDb, MDL, NF23H1, TDI |
| 39 | 流星花園 | Meteor Garden | 2001 | 華視 | idol romance (classic) | `C IMDb 7.8 (1.2K)`; `C MDL #58 7.8` | 2 | IMDb, MDL |
| 40 | 痞子英雄 | Black & White | 2009 | 公視 | cop action (classic) | `C MDL #38 8.0`; `D TDI 最高 #29 4.03 (ep24)` | 2 | MDL, TDI |
| 41 | 我的婆婆怎麼那麼可愛（1–2） | —† | 2020 (S2 2024) | 公視 / 華視† | family comedy | `E Google 2020 快速竄升戲劇 top 10 (unranked, partial)`; `E DailyView 2024 #4` | 2 | DV24, GYS20 |
| 42 | 火神的眼淚 | Tears on Fire | 2021 | 公視 | firefighter drama | `C IMDb 7.9 (502)`; `E Google 2021 快速竄升戲劇 #3 (all countries)` | 2 | GYS21, IMDb |
| 43 | 影后 | Born for the Spotlight | 2024 | Netflix | showbiz dramedy | `C IMDb 7.8 (830)`; `E Google 2024 快速竄升戲劇 #4`; NFG: absent | 2 | GYS24, IMDb |
| 44 | 第9節課 | —† | 2022† | Netflix† | school thriller | `D NF23H1 3.5M hours (TW #4)`; `E Google 2023 快速竄升台灣戲劇 #7` | 2 | GYS23, NF23H1 |
| 45 | 牛車來去 | —† | 2023 | 公視 | period rural drama | `E Google 2023 快速竄升台灣戲劇 #10`; `E DailyView 2023 #3` | 2 | DV23, GYS23 |
| 46 | 親愛壞蛋 | —† | 2022–23† | —† | suspense | `D NF23H1 2.1M hours`; `E DailyView 2023 #10` | 2 | DV23, NF23H1 |
| 47 | 媽，別鬧了！ | Mom, Don't Do That! | 2022 | Netflix | family comedy | `D NF23H1 2.2M hours`; `E Google 2022 快速竄升台灣戲劇 #2` | 2 | GYS22, NF23H1 |
| 48 | 我們六個 | —† | 2025 | 大愛 (per DV25) | true-story family drama | `E Google 2025 快速竄升台灣戲劇 #2`; `E DailyView 2025 #6 (DV: ep9 收視 1.05)` | 2 | DV25, GYS25 |
| 49 | 人浮於愛 | —† | 2025 | —† (later Netflix) | ensemble romance | `E Google 2025 快速竄升台灣戲劇 #5`; `D NF26H1 TW-series #9, 0.1M views` | 2 | GYS25, NF26H1 |
| 50 | 拜六禮拜 | —† | 2025 | 華視 / 公視 (per DV25) | Taiwanese-language women's drama | `E Google 2025 快速竄升台灣戲劇 #7`; `E DailyView 2025 #8` | 2 | DV25, GYS25 |
| 51 | 零日攻擊 | Zero Day Attack | 2025 | 公視+ / myVideo† | war / political thriller | `C IMDb 4.8 (881)`; `E DailyView 2025 #1 (政治 39.5% of discussion)` | 2 | DV25, IMDb |
| 52 | 百萬人推理 | Million-Follower Detective | 2026 | Netflix | mystery | `C IMDb 6.0 (628)`; `D NF26H1 TW-series #2, 3.0M views` | 2 | IMDb, NF26H1 |
| 53 | 好運來 | —† | 2024–2025 | 民視 八點檔 | 本土劇 | `E Google 2025 快速竄升台灣戲劇 #10`; `E DailyView 2026-06 月榜 #3 (snippet)` | 1 | GYS25 |
| 54 | 欠妳的那場婚禮 | —† | 2026 | Netflix† | romance | `D NF26H1 TW-series #6, 0.4M views`; `E DailyView 2026-06 月榜 #1 (snippet)` | 1 | NF26H1 |
| 55 | 死了一個娛樂女記者之後 | —† | 2025 | 公視 | mystery | `E Google 2025 快速竄升台灣戲劇 #6` | 1 | GYS25 |
| 56 | 百味人生 | —† | 2025 | 三立 八點檔 | 本土劇 | `E DailyView 2025 #4 (DV: 首播 2.41 有線全國第一)` | 1 | DV25 |
| 57 | 寶島西米樂 | —† | 2025 | 八點檔 (channel†) | period tailoring drama | `E DailyView 2025 #9 (DV: avg 1.14 late Jul 2025)` | 1 | DV25 |
| 58 | 天道 | —† | 2023–2024 | 三立 八點檔 | 本土劇 | `E DailyView 2024 #1` | 1 | DV24 |
| 59 | 願望 | —† | 2024 | 三立 八點檔 | 本土劇 | `E DailyView 2024 #2` | 1 | DV24 |
| 60 | 聽海湧 | —† | 2024 | 公視 | WWII war drama | `E DailyView 2024 #7` | 1 | DV24 |
| 61 | 華麗計程車行 | —† | 2024 | 公視† | family workplace drama | `E DailyView 2024 #8` | 1 | DV24 |
| 62 | 戲說台灣 | —† | 1999– | 三立 | folk anthology | `E DailyView 2024 #9` | 1 | DV24 |
| 63 | 台灣犯罪故事 | Taiwan Crime Stories | 2023 | 公視† | crime anthology | `E Google 2023 快速竄升台灣戲劇 #9` | 1 | GYS23 |
| 64 | 阿叔 | —† | 2023 | 公視† | family drama | `E Google 2023 快速竄升台灣戲劇 #8` | 1 | GYS23 |
| 65 | 女兒大人加個賴 / 機智職場生活 / 地獄里長 | —† | 2023 | various† | various | `E DailyView 2023 #5 / #8 / #9` — 3 titles | 1 | DV23 |
| 66 | 台北女子圖鑑 | Women in Taipei | 2022 | 公視† | women's drama | `E Google 2022 快速竄升台灣戲劇 #4` | 1 | GYS22 |
| 67 | 村裡來了個暴走女外科 | —† | 2022 | 公視† | medical romcom | `E Google 2022 快速竄升台灣戲劇 #5` | 1 | GYS22 |
| 68 | 市井豪門 / 一家團圓 / 機智校園生活 | —† | 2021–2022 | 民視 / 三立 八點檔 (per TVBS) | 本土劇 | `E Google 2022 快速竄升台灣戲劇 #6 / #7 / #10` — 3 titles | 1 | GYS22 |
| 69 | 國際橋牌社2 | —† | 2021–22† | —† | political drama | `E Google 2022 快速竄升台灣戲劇 #8` | 1 | GYS22 |
| 70 | 茶金 | Gold Leaf | 2021 | 公視 | Hakka period drama | `E Google 2022 快速竄升台灣戲劇 #9` | 1 | GYS22 |
| 71 | 斯卡羅 | Seqalu: Formosa 1867† | 2021 | 公視 | historical drama | `E Google 2021 快速竄升戲劇 #10 (all countries)` | 1 | GYS21 |
| 72 | 做工的人 | —† | 2020 | 公視 | working-class comedy-drama | `E Google 2020 快速竄升戲劇 top 10 (unranked, partial)` | 1 | GYS20 |
| 73 | 一把青 | A Touch of Green | 2015 | 公視 | period military-family drama | `C IMDb 8.4 (509)` | 1 | IMDb |
| 74 | 俗女養成記 | The Making of an Ordinary Woman | 2019 | 華視 / 公視† | coming-of-age dramedy | `C IMDb 8.5 (980)`; `C 豆瓣 2021 #2 (S2, snippet)` | 1 | IMDb |
| 75 | 你的孩子不是你的孩子 | On Children | 2018 | 公視 / Netflix | dystopian family anthology | `C IMDb 7.4 (516)` | 1 | IMDb |
| 76 | 返校 | Detention | 2020 | 公視 / Netflix | horror | `C IMDb 6.4 (750)` | 1 | IMDb |
| 77 | 惡魔在身邊 | Devil Beside You | 2005 | 中視† | idol romance | `C IMDb 7.5 (535)` | 1 | IMDb |
| 78 | 秘密情人† | Secret Lover | 2025 | —† | campus romance | `C IMDb 7.6 (897)` | 1 | IMDb |
| 79 | 危險心靈† | Wei xian xin ling | 2006 | 公視† | school drama | `C IMDb 7.1 (567)` | 1 | IMDb |
| 80 | 愛情合約† | Love Contract | 2004 | —† | romcom | `C IMDb 5.2 (511)` | 1 | IMDb |
| 81 | 愛情魔髮師 / 王子變青蛙 / 敗犬女王 / 小資女孩向前衝 / 無敵珊寶妹 / 犀利人妻 | —† | 2005–2012 | 台視 | idol / romance classics | `D TDI 最高: 犀利人妻 #3 9.50; 敗犬女王 #6 7.35; 小資女孩向前衝 #7 7.33; 無敵珊寶妹 #8 7.25; 王子變青蛙 #9 6.99 (平均 #3 5.80); 愛情魔髮師 #13 5.44` — 6 titles | 1 | TDI |
| 82 | 新兵日記 / 新兵日記之特戰英雄 | —† | 2010–2011 | 民視 | military drama | `D TDI 最高 #1 11.74 (all-time record), 平均 #1 8.51; 特戰英雄 最高 #5 7.60` | 1 | TDI |
| 83 | 光陰的故事 / 公主小妹 / 轉角＊遇到愛 / 蘭陵王† | —† | 2007–2013 | 中視 | various | `D TDI 最高: 光陰的故事 6.75; 轉角遇到愛 4.17; 公主小妹 3.81; 平均: 蘭陵王 3.04` — 蘭陵王 flagged as likely TW–mainland co-pro† | 1 | TDI |
| 84 | 海派甜心 / 花樣少年少女 / 換換愛 | —† | 2006–2010 | 華視 | idol | `D TDI 最高 5.14 / 5.09; 換換愛 平均 3.05` — 3 titles | 1 | TDI |
| 85 | 醉後決定愛上你 / 偷心大聖PS男 / 放羊的星星 / 福氣又安康 / 螺絲小姐要出嫁 / 微笑Pasta / 那一年的幸福時光 / 就想賴著你 | —† | 2006–2012 | 台視 | idol | `D TDI (最高 / 首回 / 終回 / 平均 30-row tables)` — 8 titles | 1 | TDI |
| 86 | 廉政英雄 / 父與子 / 風水世家 / 龍飛鳳舞 / 嫁妝 / 春花望露 / 幸福來了 | —† | 2011–2017 | 民視 | 本土劇 / drama | `D TDI: 風水世家 平均 #6 5.66; 龍飛鳳舞 首回 5.95, 平均 4.86; 春花望露 首回 5.24 (2016); 幸福來了 首回 3.21 (2017)` — 7 titles | 1 | TDI |
| 87 | 阿爸的願望 / 雨夜花 / 牽手 / 天下女人心 / 世間情 / 甘味人生 / 白鷺鷥的願望 / 一家人 / 金家好媳婦 | —† | 2011–2018 | 三立台灣台 | 本土劇 | `D TDI: 白鷺鷥的願望 最高 4.41 (2016-12-23); 一家人 首回 3.40, 平均 3.05 (2017–18); 金家好媳婦 首回 3.03 (2018); 甘味人生 首回 3.50 (2015)` — 9 titles | 1 | TDI |
| 88 | 通靈少女 | The Teenage Psychic† | 2017 | 公視 / HBO Asia | supernatural youth | `D TDI 最高 / 終回 4.40 (2017-04-30)` | 1 | TDI |
| 89 | 花甲男孩轉大人 | —† | 2017 | 台視 / 公視† | family comedy | `D TDI 最高 / 終回 4.16 (2017-07-07)` | 1 | TDI |
| 90 | 籃球火 | —† | 2008 | 中視† | sports idol | `D TDI 首回 2.79` | 1 | TDI |
| 91 | 天巡者 / 最佳利益（1–3） / 罪後真相† / 你的婚姻不是你的婚姻 / 極品絕配 / 真愛找麻煩 / 真愛趁現在 | —† | 2017–2023 | various† | various | `D NF23H1 hours: 最佳利益 S1 3.4M, S2 2.0M, S3 1.2M; 天巡者 3.1M; 極品絕配 2.8M; 罪後真相 2.3M; 真愛找麻煩 1.8M; 真愛趁現在 1.8M; 你的婚姻不是你的婚姻 1.1M` — 7 titles | 1 | NF23H1 |
| 92 | Lost Romance / Mars / Danger Zone (S1–2) / Rainless Love in a Godless Land / Meet Me @ 1006 / Back to 1989 / Connecting to You / Before We Get Married | 浪漫輸給你† / 戰神† / —† | 2004–2023 | various† | romance / BL / thriller | `C MDL: Lost Romance #7 8.4 (9,011); Mars #20 8.2 (6,051); Meet Me @ 1006 #22; Danger Zone #25 & S2 #40; Rainless Love #26; Back to 1989 #29; Connecting to You #31; Before We Get Married #35` — 8 titles | 1 | MDL |
| 93 | Someone Like You / Lesson in Love / Attention, Love! / You're My Destiny / Just You / Yong Jiu Grocery Store / Wishing upon the Shooting Stars / Behind Your Smile | —† | 2007–2026 | various† | romance / BL | `C MDL #43 / #45 / #47 / #49 / #51 / #57 / #59 / #60 (7.8–7.9)` — 8 titles | 1 | MDL |
| 94 | PTS Original: The Silent Forest | —† | 2018† | 公視 | special | `C MDL #36 8.0` — MDL labels it "Special"; check whether it is a 公視 drama or the film 無聲 before use | 1 | MDL |

Notes on the table:
- Rows 65, 68, 81–87, 91–93 bundle several 1-source titles; each named title is its own 1-source candidate (the totals above count them individually).
- Rows 25–36 Chinese titles (†) are memory-based or guessed from English — confirm on MDL / official pages before use. Rows 27–29 have only English titles in any read source.
- 我的婆婆怎麼那麼可愛 (row 41) and 想見你 (row 3) GYS20 tags come from a **partial** read (ranks beyond #4 not printed).

## 4. Excluded on purpose (found in the sources, not Taiwanese scripted series)

- **Films**: 咒 (NF23H1 6.1M h), 周處除三害 / 角頭 series / 青春18x2 / 關於我和鬼變成家人的那件事 / 想見你 (film) / 當男人戀愛時 / 月老 etc. (Google 快速竄升電影 lists); NF24H1 Mandarin films (長江七號, 周處除三害, 查無此心).
- **Variety / reality**: 光露營就很忙了, 嗨！營業中 S1–2, 來吧！營業中 2 (NF23H1).
- **Non-Taiwanese dramas in Google / Netflix lists**: all K-dramas and C-dramas in GYS21/GYS23/GYS24 戲劇 lists (淚之女王, 墨雨雲間, 錦心似玉, 魷魚遊戲, 黑暗榮耀 …); NF25 mainland titles (難哄, 偷偷藏不住, 五福臨門 …); TDI row 三國 (mainland).
- **Kept but flagged (co-production / production base unclear)**: 彼岸之嫁 The Ghost Bride (2020, Netflix, TW–Malaysia, Malacca setting; IMDb 6.4/1.1K, NF23H1 2.1M h); 還珠格格 My Fair Princess (IMDb 7.5/1.6K) and 情深深雨濛濛 Profound Love in Heavy Rain (IMDb 7.2/676) — Chiung Yao productions shot in mainland with Hunan TV, usually counted as 陸劇/合拍; 蘭陵王 (TDI) — likely co-pro; Chocolat (IMDb 5.4/1K, 2013) and You Light Up My Star (IMDb 2.0/501, 2014) — Taiwan tag on IMDb but production unverified. Not given rows except 蘭陵王 inside a bundle — decide at curation.
- **Out-of-boundary Taiwan-viewer data seen in passing** (belongs to `candidates-fans-taiwan.md`): Netflix Taiwan weekly #1 claims (童話故事下集, 忘了我記得, 回魂計, 拜六禮拜, 模仿犯), MyVideo 2025 年度戲劇館冠軍 零日攻擊, Hami Video #1 化外之醫, CATCHPLAY+ #1 我們與惡的距離II, LINE score 9.7 (化外之醫), FansWorld 2025 vote (對立而已 #1).

## 5. Caveats

- **Nielsen gap for 2016–2026.** The only cross-channel ratings table obtained is TDI (tw.dorama.info all-time AGB Nielsen tables), which is mostly 2005–2018 and self-described as incomplete; the site's year filter did not work through any tool. No news or wiki page with a per-year 台劇 收視 ranking was found; PTS quarterly reports are PTS-channel-centric. Recent 八點檔 / 公視 ratings appear only as anecdotes inside DV25 (百味人生 首播 2.41, 寶島西米樂 1.14, 我們六個 1.05) and are not separate keys. Absence of a recent show from TDI ≠ low rating.
- **NOW21 = TDI** (it cites tw.dorama.info), so it is not counted.
- **Netflix global top 10 is near-empty for Taiwan**: only 模仿犯 (#2, #5, 2023) and 乩身 (#6, 2026) in 5+ years of weekly data. NF23H1 / NF25 / NF26H1 come via secondary write-ups of the official reports (blog, FTNN, 風傳媒) rather than the xlsx itself; NF24H1 only names the single top Taiwanese title; NF23H2, NF24H2 and NF25H1/H2 separately were not found as Taiwan-filtered lists. NF23H1 measures **hours**, later reports **views** — not comparable.
- **Same-family double counting.** Collapse to families: IMDb, MDL, Douban, Netflix (NFG + NF*), Nielsen (TDI), Google (GYS*), DailyView/KEYPO (DV*). On that basis: 模仿犯 = 5 families (IMDb, MDL, Netflix, Google, DV); 我們與惡的距離 = 5 (IMDb, MDL, Douban, Google, DV — but S1 vs S2 split: S1 = IMDb/MDL/Google 2019, S2 = Douban/Google 2025/DV); 想見你 = 5 (IMDb, MDL, Douban, Netflix, Google); 她和她的她 = 5; 回魂計 = 4 (IMDb, Netflix, Google, DV); 華燈初上 = 4; 人選之人 = 4; 八尺門 / 不良執念清除師 = 4.
- **Google** lists rank year-on-year search **growth** (Dec→Nov window), not volume. 2021 and 2024 only expose the all-country 戲劇 list (Taiwanese 台灣戲劇 list for 2024 hidden behind "Load more" — unread); 2022 list via TVBS; 2020 partial; 2019 = overall keyword #1 only.
- **DailyView** ranks raw discussion volume, not sentiment; 八點檔 and controversial titles (零日攻擊 #1 2025, 天道 #1 2024) rank high. DV24 covers only 2024-01-01 → 09-12, so 影后 (Nov 2024) is structurally absent.
- **Douban** Taiwanese positions are inherited from the cn round (read 2026-11-12); only DB25 has scores. DB21's official mixed list (俗女養成記2 #2) is snippet only.
- **IMDb**: whole ≥500-vote TW list is 55 titles; votes 500–8.3K so ratings are noisy. BL titles (The On1y One 8.5/8.3K, We Best Love 8.2/3.4K) have the largest vote counts. 不夠善良的我們, 想見你's sequels, 忘了我記得 (DV cites 8.1) are not in the list (under 500 votes or not country-tagged TW).
- **MDL** skews to BL and idol romance; ratings counts for #1–20 range 535 (The World Between Us) to 40,270 (We Best Love No.1). The "Top Taiwanese Dramas" URL pattern used for jp/cn does not exist for Taiwan; the advanced-search Top sort was used instead.
- **Parrot Analytics**: no Taiwanese title found in any public annual analysis — no key.
- **Titles/years/networks**: † titles and all years/networks not printed by a source need checking at fact-sheet stage.

## 6. toolDegradation

| Step | Tool tried | Result | Fallback used |
|---|---|---|---|
| IMDb advanced search (TW) | Exa web_fetch_exa (first, per jp/kr/cn experience) | read | — |
| MDL top Taiwanese | Groundlane web_fetch `/shows/top_taiwanese_dramas` | HTTP 404 | Groundlane web_fetch / web_extract on `search?adv=titles&ty=68&co=5&so=top` — read; counts via `scored by` pattern, 20/20 |
| Netflix global top 10 | Groundlane web_extract on official `all-weeks-global.tsv` (regex over title names) | read (full file, 2021-07 → 2026-11) | — |
| Google Year in Search 2021/2023/2024/2025 | Exa web_fetch_exa on trends.google.com | CRAWL_TIMEOUT | Groundlane web_fetch `render=always, extract=full` — read (2023 & 2025 needed one retry after "upstream closed the stream"); lists behind "Load more" not reachable |
| Google 2022 / 2020 / 2019 | Groundlane on Trends (2022 = no drama list in first screen) | partial | news (TVBS / Cosmopolitan) + official Google blog |
| tw.dorama.info ratings | Groundlane web_fetch (HTTP 403), Exa (CRAWL_REDIRECT) | blocked | jina read_url — read; `?year=` param ignored |
| PTS 收視季報告 PDF | jina read_url (question mode needs API key → full 75K-char dump) | partial | grep in saved output; not used |
| bnext 84016 | Groundlane web_fetch | returned unrelated article body | — (not used) |
| DailyView 2024 extract | Groundlane web_extract pattern | refused (high-risk regex) | Groundlane web_fetch text — read |
| Search | Groundlane web_search (Brave + You.com; Tavily / Exa providers inside Groundlane "unavailable" on most calls; one Brave-only call returned PROVIDER_UNAVAILABLE) | ok | — |
| Terminal curl | not attempted (blocked per brief) | — | MCP tools only |
| Tavily / Firecrawl | not needed | — | — |
