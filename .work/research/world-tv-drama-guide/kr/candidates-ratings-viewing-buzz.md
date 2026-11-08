# Korean scripted TV (K-drama) candidates — Category C (ratings) / D (viewing data) / E (buzz/demand)

Collected 2026-11-08 for the zh-TW series「各國影劇導讀」. Data file only — no article copy.
Scope: South Korean-produced scripted series (terrestrial, cable/종편, streaming originals). Variety / reality / docs / films excluded (see §4). D/E focus 2016–2026; C lists keep older classics.
Tools: Groundlane `web_fetch` / `web_search` / `web_extract` (primary); Exa `web_fetch_exa` (fallback for IMDb and Netflix Tudum). See §6 toolDegradation.

## 1. Sources

Read status: **read** = page body fetched and parsed; **partial** = fetched but only part of the needed data present; **snippet** = only a search-result excerpt seen (shown in tags but **not counted** as a placement); **unread** = blocked / not reachable.

| Key | Source | URL | Read status | What was extracted |
|---|---|---|---|---|
| IMDb | IMDb advanced search: TV series + mini-series, country = South Korea, ≥10,000 votes, sorted by user rating (top 100) | https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&countries=KR&sort=user_rating,desc&num_votes=10000,&count=100 | read (Groundlane → empty JS shell; Exa fetch returned all 100 rows; Exa cache date not shown, but list contains 2026 titles so it is recent) | Rating + vote count for every Korean live-action series in the 100 (cut-off ≈ 7.8). US/KR co-animated cartoons and Japanese anime that IMDb tags KR were dropped (§4) |
| MDL | MyDramaList "Top Korean Dramas" pages 1–3 (ranks 1–60) + show pages for ranks 1–20 | https://mydramalist.com/shows/top_korean_dramas (and ?page=2, ?page=3) | read (ranks 1–60 with score); "scored by" user counts pulled per show page for ranks 1–20 only (`web_extract` pattern) | Rank, score, ratings count (1–20). MDL ranks seasons/parts separately |
| WP-W | Watcha Pedia | https://pedia.watcha.com/staffmades/gsmG9lp39y | unread for K-drama (only staff "별점 TOP" page reachable; it lists films/anime, no drama ranking) | — |
| DB | Douban (豆瓣) Korean drama scores | via search snippets only (weibo.com list "韩剧TOP200…", sina/163 listicles) | snippet (Douban itself not fetched; verification page not bypassed) | Scores for Reply 1988 9.7, Hospital Playlist 9.5, Tangerines 9.4, My Mister 9.4, Prison Playbook 9.4, Hot Stove League 9.3 — **not counted** |
| NKC | Wikipedia "Korean drama" § List of highest-rated series on cable television — by household rating (top 50, Nielsen Korea nationwide pay-TV households) | https://en.wikipedia.org/w/index.php?title=Korean_drama&action=raw&section=52 | read (wikitext; the old standalone list title now 404s — merged into this article) | Rank, network, peak %, final-episode date |
| NKT | Same article § terrestrial television — by household rating (top 50, all-time) | https://en.wikipedia.org/w/index.php?title=Korean_drama&action=raw&section=49 | read | Only 2 entries end ≥2016 (My Only One, My Golden Life); rest are 1992–2014 |
| KDF | Korea Drama Festival (코리아드라마페스티벌) "베스트 시청률" — yearly top-10 by peak rating, 2016–2024, all channels | http://kdfo.org/올댓드라마/베스트-시청률/ | read | Yearly rank + peak %. Page does not name the panel (figures match Nielsen nationwide) and splits multi-year shows by calendar year (e.g. SKY Castle listed 2018 at 12.3%, Mr. Queen 2020 at 12.4%); My Only One (49.4%, 2019) is missing from its 2019 list |
| WRC | "한국 드라마 시청률 연대기 1992–2026" (think.wrstory.com, blog compilation, updated 2026-09-18) | https://think.wrstory.com/drama-ratings/ | read (secondary aggregator; states panel per figure) | **Used only where NKC/KDF are silent**: 2025–2026 peaks, The Red Sleeve, My Only One, Taxi Driver S3 |
| NFAT | Netflix Tudum "Top 10 Most Popular Non-English Shows of All Time" | https://www.netflix.com/tudum/top10/most-popular/tv-non-english | read (Groundlane OUTPUT_LIMIT → Exa) | Rank, views (first 91 days) |
| NFATH | What's on Netflix, "Teach You a Lesson enters all-time top 10" (2026-07-29) | https://www.whats-on-netflix.com/news/k-dramas/breakout-k-drama-teach-you-a-lesson-enters-netflixs-all-time-top-10-most-popular-shows-list/ | read | Names Korean shows that were *previously* on the all-time list (All of Us Are Dead, The Glory, Extraordinary Attorney Woo) |
| NF23H1 | Korea Herald + Business Insider on Netflix's first engagement report (Jan–Jun 2023, hours) | https://www.koreaherald.com/article/3279907 ; https://www.businessinsider.com/netflix-most-watched-korean-shows-kdramas-the-glory-squid-game-2023-12 | read | Global rank + hours for named Korean dramas |
| NF23H2 | Korea Herald on engagement report Jul–Dec 2023 | https://m.koreaherald.com/article/3398802 | read | Top 3 Korean series (views) |
| NF24H1 | Netflix "What We Watched the First Half of 2024" | https://about.netflix.com/en/news/what-we-watched-the-first-half-of-2024 | read (text; top-10 graphic not parsed) | Named Korean shows + views |
| NF24H2 | Netflix "What We Watched the Second Half of 2024" | https://about.netflix.com/en/news/what-we-watched-the-second-half-of-2024 | read | Named Korean shows + views |
| NF25H1 | Netflix "What We Watched the First Half of 2025" | https://about.netflix.com/en/news/what-we-watched-the-first-half-of-2025 | read | Named Korean shows + views |
| NF25H2 | Netflix "What We Watched the Second Half of 2025" | https://about.netflix.com/en/news/what-we-watched-the-second-half-of-2025 | read | Named Korean shows + views |
| NF26H1 | Korea.net on Netflix report Jan–Jun 2026 | https://www.korea.net/NewsFocus/Culture/view?articleId=296382 | read (extra; beyond 2023–25 brief) | Top Korean dramas + views |
| FLX | FlixPatrol "Most watched TV shows from South Korea" 2023/2024/2025 | https://flixpatrol.com/most-watched/2024/tv-shows-from-south-korea/ | unread (Cloudflare challenge on Groundlane, Exa 403, jina challenge page, Tavily fail; not bypassed) | — |
| FX23 | Good Data FUNdex Awards 2023 (1st) full results incl. finalists (Kyongbuk Ilbo) | https://www.kyongbuk.co.kr/news/articleView.html?idxno=2148969 | read | Drama grand prize, TV/OTT best + finalists, news/clip/VON/search, actor awards |
| FX24 | FUNdex Awards 2024 official page + ize on FUNdex 2024 TV ending-drama buzz ranking | https://www.fundex.co.kr/award24.html ; https://www.ize.co.kr/news/articleView.html?idxno=64548 | read (both) | Winners + 5 finalists per category; 2024 ending-drama buzz #1–5 (all tvN) |
| FX25 | FUNdex Awards 2025 (반론보도닷컴 ×2) + CJ ENM/필더무비 on FUNdex 2025 TV-OTT ending-drama top 10 | https://www.banronbodo.com/news/articleView.html?idxno=31350 ; https://www.banronbodo.com/news/articleView.html?idxno=31424 ; https://v.daum.net/v/0WeEWr4qZ9 | read; the 2025 top-10 is **partial** (only the five tvN members named, no ranks) | Winners; five tvN titles in the 2025 top 10 |
| FX22 | Good Data weekly drama buzz 2022 | search snippets (spotvnews, xportsnews, mk.co.kr) | snippet — **not counted** | Woo #1 five weeks (Jul 2022); Reborn Rich #1 (Dec 2022) |
| P21 | Parrot Analytics 4th Global TV Demand Awards (data year 2021) | https://www.parrotanalytics.com/announcements/anime-and-asian-series-dominate-4th-annual-global-tv-demand-awards/ | read | Korean winners |
| P23 | Parrot 6th GDA (data year 2023) | https://www.parrotanalytics.com/announcements/6th-annual-global-demand-awards-announces-jujutsu-kaisen-most-in-demand-tv-series-in-the-world-and-pathaan-most-in-demand-movie-of-2023/ | read — **no Korean winner** (Asian Original = Yeh Rishta Kya Kehlata Hai) | — |
| P24 | Parrot 7th GDA (data year 2024) | https://www.parrotanalytics.com/insights/7th-annual-global-demand-awards-announces-house-of-the-dragon-most-in-demand-tv-series-and-stree-2-most-in-demand-movie-of-2024/ | read | Squid Game = Asian Original |
| P25 | Parrot 8th GDA winners (2026-01-15) + finalists (2025-12-10) | https://www.parrotanalytics.com/insights/8th-annual-global-demand-awards-stranger-things-shatters-streaming-records-and-pushpa-the-rule-part-2-redefines-the-global-blockbuster/ ; https://www.parrotanalytics.com/insights/8th-annual-global-demand-awards-finalists-announced/ | read (both; one key) | Winners + top-5 finalists |
| P22 | Parrot 5th GDA (data year 2022) | search snippet only | snippet — no Korean winner seen (Asian Original = Naagin) | — |
| GWR24 / GWR26 | Parrot × Guinness World Records 2024 and 2026 most-in-demand TV | https://www.parrotanalytics.com/insights/parrot-analytics-partners-with-guinness-world-records-to-reveal-most-in-demand-tv-shows-and-talent-in-guinness-world-records-2024/ ; https://www.parrotanalytics.com/announcements/parrot-analytics-and-guinness-world-records-crown-the-worlds-most-in-demand-tv-shows-in-guinness-world-records-2026/ | read — **no Korean record holder** in either | — |
| GWRSG | Guinness World Records news: "All the records Squid Game has broken" (2025-06-27) | https://www.guinnessworldrecords.com/news/2025/6/all-the-records-squid-game-has-broken-as-netflix-hit-returns-for-third-and-final-season | read | Squid Game records |

Netflix half-year keys are counted separately (one key per report), as in the US file. NKC, KDF and WRC all rest on Nielsen Korea numbers, so a show with NKC + KDF has two keys but one underlying measurement — see §5.

## 2. Coverage check — biggest names × source families

| Show | IMDb | MDL | Nielsen (NKC/NKT/KDF/WRC) | Netflix (NFAT/NF*) | FUNdex | Parrot/GWR |
|---|---|---|---|---|---|---|
| Squid Game | 7.9 (783K) | – (not in top 60) | n/a (Netflix, no TV rating) | all-time #1–3; 4 half-year reports | – (2021 predates awards) | GDA 2021 ×2, 2024, 2025; GWR records |
| When Life Gives You Tangerines | 9.0 | #1 9.3 | n/a | H1 2025 35M | 2025 grand prize | 2025 finalist ×2 |
| Queen of Tears | 8.2 | – (not in top 60) | cable #3 24.85% | H1 2024 29M | 2024 grand prize | – |
| The Glory | 8.2 | #16/#24 | n/a | H1 2023 #3; ex-all-time | 2023 OTT best | – |
| Extraordinary Attorney Woo | 8.5 | #34 | cable #10 17.53% | ex-all-time | (2022 snippet only) | – |
| Reply 1988 / My Mister | 9.0 / 9.0 | #9 / #17 | cable #6 (R88) / – | – | – | – |
| Descendants of the Sun | 8.2 | – | KDF 2016 #1 38.8% | – | – | – |

"–" = checked, absent. "n/a" = metric does not apply. Weekend/daily family dramas dominate terrestrial ratings (KDF) but almost never appear on IMDb/MDL/Netflix lists — that split is visible in the 1-source tail of §3.

## 3. Candidate table

Distinct-source count uses the keys in §1; snippet keys (DB, FX22) are shown but not counted. Rows sorted by count, then first-air year.
**†** after the Korean title = at least one of the Korean/English titles was supplied from memory (not printed in a read source). First-air year and network are **from memory (unsourced) for every row** except the network on NKC/NKT rows (Wikipedia table) and Netflix originals named as such in Netflix reports. Multi-season franchises are merged into one row where sources split them by season.

Shows with ≥3 sources: Squid Game (10); Taxi Driver, Extraordinary Attorney Woo, The Glory, Queen of Tears, When Life Gives You Tangerines, Bon Appétit Your Majesty (5); Mr. Sunshine, Crash Landing on You, Hospital Playlist, Mr. Queen, Twenty-Five Twenty-One, Weak Hero, Doctor Cha, Crash Course in Romance, Teach You a Lesson (4); Reply 1988, Goblin, Signal, Dr. Romantic, Itaewon Class, The Uncanny Counter, Vincenzo, D.P., Under the Queen's Umbrella, Twinkling Watermelon, Moving, Welcome to Samdal-ri, Agency, King the Land, Lovely Runner, A Shop for Killers, Marry My Husband, The Trauma Code (3). Total rows: 194 (1 source: 116; 2: 44; 3: 18; 4: 9; 5: 6; 10: 1).

| # | 韓文片名 | English title | First-air | Network/platform | Genre | Evidence tags | Distinct sources | Keys |
|---|---|---|---|---|---|---|---|---|
| 1 | 오징어 게임 | Squid Game | 2021 | Netflix | survival thriller | `C IMDb 7.9 (783K votes)`; `D Netflix non-English all-time #1 S1 265.2M / #2 S2 192.6M / #3 S3 145.8M`; `D Netflix H2 2024 S2 87M (most-viewed series of the half)`; `D Netflix H1 2025 231M across 3 seasons; S3 72M (#3 program)`; `D Netflix H2 2025 S3 79M (#4 show)`; `D Netflix H1 2026 14.4M`; `E Parrot GDA 2021 series debut + revolutionary series (winner)`; `E Parrot GDA 2024 Asian original (winner)`; `E Parrot GDA 2025 Asian original (winner); World's Choice + drama finalist`; `E GWR: most viewers for a Netflix Original debut (142M households); most viewed Netflix show in one week (non-English hours 571.76M); S2 68M views one week` | 10 | GWRSG, IMDb, NF24H2, NF25H1, NF25H2, NF26H1, NFAT, P21, P24, P25 |
| 2 | 모범택시 (1–3) | Taxi Driver (S1–S3) | 2021 | SBS | vigilante action | `C IMDb 8.1 (10K)`; `C MDL S2 #22 8.9; S1 #38 8.8`; `D KDF 2023 #2 21% (S2); 2021 #10 16% (S1)`; `D S3 Nielsen nationwide 14.2% (2026-01-03, per WRC)`; `E FUNdex Awards 2023 actor finalist (Lee Je-hoon, S2) + supporting finalist` | 5 | FX23, IMDb, KDF, MDL, WRC |
| 3 | 이상한 변호사 우영우 | Extraordinary Attorney Woo | 2022 | ENA | legal drama | `C IMDb 8.5 (41K)`; `C MDL #34 8.8`; `D NielsenKR cable #10 17.534%`; `D KDF 2022 #2 17.5%`; `D Netflix non-English all-time top 10 (previously; dropped out)`; `E Good Data weekly drama buzz #1 5 weeks running, Jul 2022 (snippet)` | 5 | IMDb, KDF, MDL, NFATH, NKC |
| 4 | 더 글로리 | The Glory | 2022 | Netflix | revenge thriller | `C IMDb 8.2 (48K)`; `C MDL Part 2 #16 8.9 (89,577); Part 1 #24 8.9`; `D Netflix H1 2023 #3 overall 622.8M hours`; `D Netflix non-English all-time top 10 (previously; dropped out)`; `E FUNdex Awards 2023 OTT drama best + news + VON + 2 acting (5 wins)` | 5 | FX23, IMDb, MDL, NF23H1, NFATH |
| 5 | 눈물의 여왕 | Queen of Tears | 2024 | tvN | romance | `C IMDb 8.2 (29K)`; `D NielsenKR cable #3 24.850%`; `D KDF 2024 #1 24.8%`; `D Netflix H1 2024 29M (top Korean show of half)`; `E FUNdex Awards 2024 grand prize + TV drama best; 2024 TV ending-drama buzz #2` | 5 | FX24, IMDb, KDF, NF24H1, NKC |
| 6 | 폭싹 속았수다 | When Life Gives You Tangerines | 2025 | Netflix | period family drama | `C IMDb 9.0 (44K votes)`; `C MDL #1 9.3 (85,683 ratings)`; `D Netflix H1 2025 35M views`; `E FUNdex Awards 2025 grand prize + OTT original drama + lead actor/actress (5 wins)`; `E Parrot GDA 2025 finalist: series debut + Asian original`; `C Douban 9.4 (snippet)` | 5 | FX25, IMDb, MDL, NF25H1, P25 |
| 7 | 폭군의 셰프 | Bon Appétit, Your Majesty | 2025 | tvN | time-slip period romcom | `C IMDb 8.0 (16K)`; `D NielsenKR cable #12 17.107%`; `D WRC 2025 #1 17.1%`; `D Netflix H2 2025 38M`; `E FUNdex Awards 2025 TV drama best + global star (Im Yoon-ah); 2025 TV-OTT ending-drama buzz top 10` | 5 | FX25, IMDb, NF25H2, NKC, WRC |
| 8 | 미스터 션샤인 | Mr. Sunshine | 2018 | tvN | period drama | `C IMDb 8.7 (15K)`; `C MDL #46 8.8`; `D NielsenKR cable #9 18.129%`; `D KDF 2018 #2 18.1%` | 4 | IMDb, KDF, MDL, NKC |
| 9 | 사랑의 불시착 | Crash Landing on You | 2019 | tvN | romance | `C IMDb 8.7 (62K)`; `C MDL #13 9.0 (170,265)`; `D NielsenKR cable #5 21.683%`; `D KDF 2020 #4 21.7%` | 4 | IMDb, KDF, MDL, NKC |
| 10 | 슬기로운 의사생활 | Hospital Playlist | 2020 | tvN | medical ensemble | `C IMDb 8.7 (11K)`; `C MDL S2 #7 9.0 (53,192); S1 #11 9.0 (70,455)`; `D NielsenKR cable S1 #22 14.142%; S2 #23 14.080%`; `D KDF 2020 #8 14.1%`; `C Douban 9.5 (snippet)` | 4 | IMDb, KDF, MDL, NKC |
| 11 | 철인왕후 | Mr. Queen | 2020 | tvN | period comedy | `C IMDb 8.5 (17K)`; `C MDL #18 8.9 (79,656)`; `D NielsenKR cable #11 17.371%`; `D KDF 2020 #9 12.4% (2020 portion only)` | 4 | IMDb, KDF, MDL, NKC |
| 12 | 스물다섯 스물하나 | Twenty-Five Twenty-One | 2022 | tvN | coming-of-age romance | `C IMDb 8.5 (24K)`; `C MDL #47 8.8`; `D NielsenKR cable #37 11.513%`; `D KDF 2022 #9 11.5%` | 4 | IMDb, KDF, MDL, NKC |
| 13 | 약한영웅 Class 1 / Class 2† | Weak Hero Class 1 / Class 2 | 2022 | Wavve (S1) / Netflix (S2) | school action | `C IMDb Class 1 8.4 (31K)`; `C MDL Class 1 #4 9.1 (132,323); Class 2 #33 8.8`; `D Netflix H1 2025 Class 1 22M + Class 2 20M`; `E FUNdex Awards 2025 performer award (Lee Jun-young) + global star (Park Ji-hoon)` | 4 | FX25, IMDb, MDL, NF25H1 |
| 14 | 닥터 차정숙 | Doctor Cha | 2023 | JTBC | medical/family | `D NielsenKR cable #8 18.546%`; `D KDF 2023 #5 18.5%`; `D Netflix H1 2023 #25 197.7M hours`; `E FUNdex Awards 2023 news/clip finalist` | 4 | FX23, KDF, NF23H1, NKC |
| 15 | 일타 스캔들 | Crash Course in Romance | 2023 | tvN | romcom | `D NielsenKR cable #13 17.038%`; `D KDF 2023 #6 17%`; `D Netflix H1 2023 #16 234.8M hours`; `E FUNdex Awards 2023 TV drama best + supporting (Roh Yoon-seo)` | 4 | FX23, KDF, NF23H1, NKC |
| 16 | 참교육† | Teach You a Lesson | 2026 | Netflix | school action drama | `C IMDb 8.4 (22K)`; `C MDL #12 9.0 (53,496)`; `D Netflix non-English all-time #10 67.2M (Limited Series)`; `D Netflix H1 2026 48.2M (top K-drama of half)` | 4 | IMDb, MDL, NF26H1, NFAT |
| 17 | 응답하라 1988 | Reply 1988 | 2015 | tvN | family/neighbourhood drama | `C IMDb 9.0 (20K)`; `C MDL #9 9.0 (74,064)`; `D NielsenKR cable all-time #6 18.803% (final 2016-01-16)`; `C Douban 9.7 (snippet)` | 3 | IMDb, MDL, NKC |
| 18 | 쓸쓸하고 찬란하神 – 도깨비 | Guardian: The Lonely and Great God (Goblin) | 2016 | tvN | fantasy romance | `C IMDb 8.5 (39K)`; `C MDL #44 8.8`; `D NielsenKR cable #7 18.680%` | 3 | IMDb, MDL, NKC |
| 19 | 시그널 | Signal | 2016 | tvN | crime/time-slip | `C IMDb 8.4 (13K)`; `C MDL #35 8.8`; `D NielsenKR cable #29 12.544%` | 3 | IMDb, MDL, NKC |
| 20 | 낭만닥터 김사부 (1–3) | Dr. Romantic (S1–S3) | 2016 | SBS | medical | `C MDL S3 #30 8.9; S2 #53 8.7`; `D KDF 2020 #2 27.1% (S2); 2023 #9 14.4% (S3)`; `E FUNdex Awards 2023 TV drama finalist (S3); news/VON/search finalist` | 3 | FX23, KDF, MDL |
| 21 | 이태원 클라쓰 | Itaewon Class | 2020 | JTBC | revenge/business | `C IMDb 8.1 (26K)`; `D NielsenKR cable #16 16.548%`; `D KDF 2020 #6 16.5%` | 3 | IMDb, KDF, NKC |
| 22 | 경이로운 소문 | The Uncanny Counter | 2020 | OCN | fantasy action | `C IMDb 8.0 (16K)`; `C MDL #45 8.8`; `D NielsenKR cable #41 10.999%` | 3 | IMDb, MDL, NKC |
| 23 | 빈센조 | Vincenzo | 2021 | tvN | crime comedy | `C IMDb 8.4 (43K)`; `C MDL #29 8.9`; `D NielsenKR cable #19 14.636%` | 3 | IMDb, MDL, NKC |
| 24 | D.P. | D.P. | 2021 | Netflix | military drama | `C IMDb 8.2 (13K)`; `C MDL #51 8.7`; `E FUNdex Awards 2023 OTT drama finalist (S2)` | 3 | FX23, IMDb, MDL |
| 25 | 슈룹 | Under the Queen's Umbrella | 2022 | tvN | period drama | `C MDL #14 9.0 (26,292)`; `D NielsenKR cable #14 16.852%`; `D KDF 2022 #3 16.9%` | 3 | KDF, MDL, NKC |
| 26 | 반짝이는 워터멜론 | Twinkling Watermelon | 2023 | tvN | time-slip youth drama | `C IMDb 8.8 (17K)`; `C MDL #2 9.2 (120,308)`; `E FUNdex Awards 2023 TV drama finalist` | 3 | FX23, IMDb, MDL |
| 27 | 무빙 | Moving | 2023 | Disney+ | superhero drama | `C IMDb 8.4 (18K)`; `C MDL #10 9.0 (60,095)`; `E FUNdex Awards 2023 drama grand prize; clip/VON finalist` | 3 | FX23, IMDb, MDL |
| 28 | 웰컴투 삼달리 | Welcome to Samdal-ri | 2023 | JTBC | romance | `C IMDb 8.0 (11K)`; `D NielsenKR cable #30 12.399%`; `D KDF 2024 #5 12.4%` | 3 | IMDb, KDF, NKC |
| 29 | 대행사 | Agency | 2023 | JTBC | office drama | `D NielsenKR cable #18 16.044%`; `D KDF 2023 #7 16%`; `E FUNdex Awards 2023 TV drama finalist` | 3 | FX23, KDF, NKC |
| 30 | 킹더랜드 | King the Land | 2023 | JTBC | romcom | `D NielsenKR cable #24 13.789%`; `D Netflix H2 2023 33M (top Korean series of half)`; `E FUNdex Awards 2023 actor grand prize (Lee Jun-ho) + TV actress (Yoona); TV drama finalist` | 3 | FX23, NF23H2, NKC |
| 31 | 선재 업고 튀어 | Lovely Runner | 2024 | tvN | time-slip romance | `C IMDb 8.5 (18K)`; `C MDL #15 8.9 (113,035)`; `E FUNdex 2024 TV ending-drama buzz #1; Awards 2024 TV drama finalist + actor grand prize (Byeon Woo-seok)` | 3 | FX24, IMDb, MDL |
| 32 | 킬러들의 쇼핑몰 | A Shop for Killers | 2024 | Disney+ | action | `C IMDb 8.0 (13K)`; `C MDL #50 8.7`; `E FUNdex Awards 2024 OTT original drama finalist` | 3 | FX24, IMDb, MDL |
| 33 | 내 남편과 결혼해줘 | Marry My Husband | 2024 | tvN | regression revenge | `D NielsenKR cable #34 11.951%`; `D KDF 2024 #6 12%`; `E FUNdex 2024 TV ending-drama buzz #4; Awards TV drama finalist` | 3 | FX24, KDF, NKC |
| 34 | 중증외상센터† | The Trauma Code: Heroes on Call | 2025 | Netflix | medical action | `C IMDb 8.4 (12K)`; `C MDL #6 9.1 (64,555)`; `D Netflix H1 2025 34M` | 3 | IMDb, MDL, NF25H1 |
| 35 | 힐러† | Healer | 2014 | KBS2 | action romance | `C IMDb 8.4 (15K)`; `C MDL #48 8.8` | 2 | IMDb, MDL |
| 36 | 달의 연인 – 보보경심 려† | Moon Lovers: Scarlet Heart Ryeo | 2016 | SBS | period romance | `C IMDb 8.6 (16K)`; `C MDL #58 8.7` | 2 | IMDb, MDL |
| 37 | 역도요정 김복주† | Weightlifting Fairy Kim Bok-joo | 2016 | MBC | sports romcom | `C IMDb 8.3 (18K)`; `C MDL #56 8.7` | 2 | IMDb, MDL |
| 38 | 태양의 후예 | Descendants of the Sun | 2016 | KBS2 | military/medical romance | `C IMDb 8.2 (30K)`; `D KDF 2016 #1 38.8%` | 2 | IMDb, KDF |
| 39 | 푸른 바다의 전설 | Legend of the Blue Sea | 2016 | SBS | fantasy romance | `C IMDb 8.1 (17K)`; `D KDF 2016 #8 18.9%` | 2 | IMDb, KDF |
| 40 | 비밀의 숲† | Stranger | 2017 | tvN | legal thriller | `C IMDb 8.4 (13K)`; `C MDL #55 8.7` | 2 | IMDb, MDL |
| 41 | 쌈, 마이웨이† | Fight for My Way | 2017 | KBS2 | youth romcom | `C IMDb 8.0 (13K)`; `D KDF 2017 #10 13.8%` | 2 | IMDb, KDF |
| 42 | 슬기로운 감빵생활 | Prison Playbook | 2017 | tvN | prison dramedy | `C MDL #19 8.9 (39,408)`; `D NielsenKR cable #39 11.195%`; `C Douban 9.4 (snippet)` | 2 | MDL, NKC |
| 43 | 황금빛 내 인생 | My Golden Life | 2017 | KBS2 | weekend family drama | `D NielsenKR terrestrial all-time #49 45.1% (2018-03)`; `D KDF 2017 #1 40.7% (2017 portion)` | 2 | KDF, NKT |
| 44 | 나의 아저씨 | My Mister | 2018 | tvN | melodrama | `C IMDb 9.0 (17K)`; `C MDL #17 8.9 (39,014)`; `C Douban 9.4 (snippet)` | 2 | IMDb, MDL |
| 45 | SKY 캐슬 | Sky Castle | 2018 | JTBC | satire | `D NielsenKR cable #4 23.779%`; `D KDF 2018 #10 12.3% (2018 portion only)` | 2 | KDF, NKC |
| 46 | 백일의 낭군님 | 100 Days My Prince | 2018 | tvN | period romcom | `D NielsenKR cable #21 14.412%`; `D KDF 2018 #6 14.4%` | 2 | KDF, NKC |
| 47 | 하나뿐인 내편 | My Only One | 2018 | KBS2 | weekend family drama | `D NielsenKR terrestrial all-time #29 49.4% (2019-03)`; `D WRC 2019 #1 49.4% (absent from KDF 2019 list)` | 2 | NKT, WRC |
| 48 | 킹덤† | Kingdom | 2019 | Netflix | period zombie | `C IMDb 8.3 (66K)`; `C MDL S2 #31 8.9; S1 #43 8.8` | 2 | IMDb, MDL |
| 49 | 배가본드† | Vagabond | 2019 | SBS | action thriller | `C IMDb 8.1 (15K)`; `D KDF 2019 #10 13%` | 2 | IMDb, KDF |
| 50 | 호텔 델루나 | Hotel del Luna | 2019 | tvN | fantasy | `C IMDb 8.1 (19K)`; `D NielsenKR cable #33 12.001%` | 2 | IMDb, NKC |
| 51 | 사이코지만 괜찮아† | It's Okay to Not Be Okay | 2020 | tvN | romance/psychological | `C IMDb 8.5 (48K)`; `C MDL #36 8.8` | 2 | IMDb, MDL |
| 52 | 악의 꽃† | Flower of Evil | 2020 | tvN | thriller | `C IMDb 8.5 (20K)`; `C MDL #8 9.0 (101,007)` | 2 | IMDb, MDL |
| 53 | 구미호뎐 / 구미호뎐1938† | Tale of the Nine Tailed / ...1938 | 2020 | tvN | fantasy action | `C IMDb 7.9 (14K)`; `C MDL 1938 #52 8.7` | 2 | IMDb, MDL |
| 54 | 부부의 세계 | The World of the Married | 2020 | JTBC | infidelity thriller | `D NielsenKR cable #1 28.371%`; `D KDF 2020 #1 28.4%` | 2 | KDF, NKC |
| 55 | 마우스† | Mouse | 2021 | tvN | crime thriller | `C IMDb 8.6 (21K)`; `C MDL #27 8.9` | 2 | IMDb, MDL |
| 56 | 무브 투 헤븐: 나는 유품정리사입니다† | Move to Heaven | 2021 | Netflix | family drama | `C IMDb 8.5 (14K)`; `C MDL #3 9.1 (80,897)` | 2 | IMDb, MDL |
| 57 | 갯마을 차차차 | Hometown Cha-Cha-Cha | 2021 | tvN | romcom | `C IMDb 8.3 (31K)`; `D NielsenKR cable #28 12.665%` | 2 | IMDb, NKC |
| 58 | 옷소매 붉은 끝동 | The Red Sleeve | 2021 | MBC | period romance | `C MDL #54 8.7`; `D Nielsen nationwide 17.4% (final 2022-01-01, per WRC; not in KDF)` | 2 | MDL, WRC |
| 59 | 결혼작사 이혼작곡 (2, 3) | Love (ft. Marriage and Divorce) 2 / 3 | 2021 | TV Chosun | makjang melodrama | `D NielsenKR cable S2 #15 16.582%; S3 #47 10.395%`; `D KDF 2021 #9 16.6%` | 2 | KDF, NKC |
| 60 | 환혼 | Alchemy of Souls | 2022 | tvN | fantasy period | `C IMDb 8.7 (31K)`; `C MDL #5 9.1 (120,878); S2 #23 8.9` | 2 | IMDb, MDL |
| 61 | 사내맞선† | Business Proposal | 2022 | SBS | romcom | `C IMDb 8.1 (45K)`; `D KDF 2022 #8 11.6%` | 2 | IMDb, KDF |
| 62 | 내일† | Tomorrow | 2022 | MBC | fantasy | `C IMDb 8.0 (17K)`; `C MDL #39 8.8` | 2 | IMDb, MDL |
| 63 | 파친코 | Pachinko | 2022 | Apple TV+ (US-produced; flag) | period family saga | `C IMDb 8.4 (19K)`; `E FUNdex Awards 2024 OTT actor (Lee Min-ho) + supporting (Jung Eun-chae), S2` | 2 | FX24, IMDb |
| 64 | 재벌집 막내아들 | Reborn Rich | 2022 | JTBC | regression revenge | `D NielsenKR cable #2 26.948%`; `D KDF 2022 #1 26.9%`; `E Good Data weekly #1 drama + performer, Dec 2022 (snippet)` | 2 | KDF, NKC |
| 65 | 우리들의 블루스 | Our Blues | 2022 | tvN | omnibus drama | `D NielsenKR cable #20 14.597%`; `D KDF 2022 #5 14.6%` | 2 | KDF, NKC |
| 66 | 빨간 풍선 | Red Balloon | 2022 | TV Chosun | makjang melodrama | `D NielsenKR cable #36 11.566%`; `E FUNdex Awards 2023 TV drama finalist` | 2 | FX23, NKC |
| 67 | 작은 아씨들 | Little Women | 2022 | tvN | thriller | `D NielsenKR cable #40 11.105%`; `D KDF 2022 #10 11.5%` | 2 | KDF, NKC |
| 68 | 이재, 곧 죽습니다† | Death's Game | 2023 | TVING | fantasy thriller | `C IMDb 8.4 (26K)`; `C MDL Part 2 #40 8.8; Part 1 #42 8.8` | 2 | IMDb, MDL |
| 69 | 사냥개들† | Bloodhounds | 2023 | Netflix | action | `C IMDb 8.2 (33K)`; `C MDL #59 8.7` | 2 | IMDb, MDL |
| 70 | 연인 | My Dearest | 2023 | MBC | period romance | `C MDL #20 8.9 (21,931); Part 2 #28 8.9`; `E FUNdex Awards 2023 clip award + TV actor (Namkoong Min); TV drama finalist` | 2 | FX23, MDL |
| 71 | 나쁜엄마 | The Good Bad Mother | 2023 | JTBC | family drama | `C MDL #25 8.9`; `D NielsenKR cable #32 12.032%` | 2 | MDL, NKC |
| 72 | 마스크걸 | Mask Girl | 2023 | Netflix | thriller | `D Netflix H2 2023 18.5M (#2 Korean series)`; `E FUNdex Awards 2023 OTT drama finalist` | 2 | FX23, NF23H2 |
| 73 | 정년이 | Jeongnyeon: The Star Is Born | 2024 | tvN | period performing-arts | `D NielsenKR cable #17 16.458%`; `E FUNdex 2024 TV ending-drama buzz #3; Awards TV drama finalist + supporting (Shin Ye-eun)` | 2 | FX24, NKC |
| 74 | 엄마친구아들 | Love Next Door | 2024 | tvN | romcom | `D Netflix H2 2024 20M`; `E FUNdex 2024 TV ending-drama buzz #5` | 2 | FX24, NF24H2 |
| 75 | 언젠가는 슬기로울 전공의생활 | Resident Playbook | 2025 | tvN | medical | `C MDL #60 8.7`; `E FUNdex Awards 2025 TV lead actor + actress + supporting (3 wins); 2025 ending-drama buzz top 10` | 2 | FX25, MDL |
| 76 | 태풍상사 | Typhoon Family | 2025 | tvN | period office drama | `D NielsenKR cable #48 10.342%`; `E FUNdex 2025 TV-OTT ending-drama buzz top 10` | 2 | FX25, NKC |
| 77 | 이 사랑 통역 되나요?† | Can This Love Be Translated? | 2026 | Netflix | romcom | `C IMDb 7.8 (11K)`; `D Netflix H1 2026 28.6M` | 2 | IMDb, NF26H1 |
| 78 | 언더커버 미쓰홍 | Undercover Miss Hong | 2026 | tvN | office comedy | `D NielsenKR cable #27 13.121%`; `D WRC 2026 #3 13.1%` | 2 | NKC, WRC |
| 79 | 무자식 상팔자 | My Kids Give Me a Headache | 2012 | JTBC | family drama | `D NielsenKR cable #43 10.715% (pre-2016)` | 1 | NKC |
| 80 | 별에서 온 그대† | My Love from the Star | 2013 | SBS | fantasy romance | `C IMDb 8.1 (20K)` | 1 | IMDb |
| 81 | 응답하라 1994 | Reply 1994 | 2013 | tvN | youth drama | `D NielsenKR cable #38 11.509% (pre-2016)` | 1 | NKC |
| 82 | 피노키오† | Pinocchio | 2014 | SBS | journalism romance | `C IMDb 8.0 (11K)` | 1 | IMDb |
| 83 | 부탁해요, 엄마† | Mom (Please Take Care of Mom?) (EN title unverified) | 2015 | KBS2 | weekend family drama | `D KDF 2016 #2 38.2%` | 1 | KDF |
| 84 | 내 딸, 금사월† | My Daughter, Geum Sa-wol | 2015 | MBC | weekend makjang | `D KDF 2016 #3 34.9%` | 1 | KDF |
| 85 | 리멤버 – 아들의 전쟁† | Remember: War of the Son | 2015 | SBS | legal thriller | `D KDF 2016 #7 20.3%` | 1 | KDF |
| 86 | W† | W: Two Worlds | 2016 | MBC | fantasy thriller | `C IMDb 8.0 (19K)` | 1 | IMDb |
| 87 | 아이가 다섯† | Five Children | 2016 | KBS2 | weekend family drama | `D KDF 2016 #4 32.8%` | 1 | KDF |
| 88 | 월계수 양복점 신사들† | The Gentlemen of Wolgyesu Tailor Shop | 2016 | KBS2 | weekend family drama | `D KDF 2016 #5 29%` | 1 | KDF |
| 89 | 구르미 그린 달빛† | Love in the Moonlight | 2016 | KBS2 | period romance | `D KDF 2016 #6 23.3%` | 1 | KDF |
| 90 | 동네변호사 조들호† | Neighborhood Lawyer Jo Deul-ho | 2016 | KBS2 | legal drama | `D KDF 2016 #9 17.3%` | 1 | KDF |
| 91 | 몬스터† | Monster | 2016 | MBC | revenge melodrama | `D KDF 2016 #10 14.1%` | 1 | KDF |
| 92 | 당신이 잠든 사이에† | While You Were Sleeping | 2017 | SBS | fantasy romance | `C IMDb 8.2 (13K)` | 1 | IMDb |
| 93 | 힘쎈여자 도봉순† | Strong Girl Bong-soon | 2017 | JTBC | romcom | `C IMDb 8.1 (25K)` | 1 | IMDb |
| 94 | 이번 생은 처음이라† | Because This Is My First Life | 2017 | tvN | romance | `C IMDb 8.0 (12K)` | 1 | IMDb |
| 95 | 로봇이 아니야† | I'm Not a Robot | 2017 | MBC | romcom | `C IMDb 8.0 (10K)` | 1 | IMDb |
| 96 | 품위있는 그녀 | The Lady in Dignity | 2017 | JTBC | mystery satire | `D NielsenKR cable #31 12.065%` | 1 | NKC |
| 97 | 흑기사† | Black Knight | 2017 | KBS2 | fantasy romance | `D KDF 2018 #7 13.9%` | 1 | KDF |
| 98 | 아버지가 이상해† | My Father Is Strange | 2017 | KBS2 | weekend family drama | `D KDF 2017 #2 36.5%` | 1 | KDF |
| 99 | 피고인† | Defendant | 2017 | SBS | legal thriller | `D KDF 2017 #3 28.3%` | 1 | KDF |
| 100 | 귓속말† | Whisper | 2017 | SBS | legal thriller | `D KDF 2017 #4 20.3%` | 1 | KDF |
| 101 | 김과장† | Chief Kim | 2017 | KBS2 | office comedy | `D KDF 2017 #5 18.4%` | 1 | KDF |
| 102 | 군주: 가면의 주인† | Ruler: Master of the Mask | 2017 | MBC | period drama | `D KDF 2017 #7 14.9%` | 1 | KDF |
| 103 | 역적: 백성을 훔친 도적† | The Rebel | 2017 | MBC | period drama | `D KDF 2017 #8 14.4%` | 1 | KDF |
| 104 | 마녀의 법정† | Witch's Court | 2017 | KBS2 | legal drama | `D KDF 2017 #9 14.3%` | 1 | KDF |
| 105 | 돈꽃† | Money Flower | 2017 | MBC | revenge melodrama | `D KDF 2018 #1 23.9%; 2017 #6 17.2% (split across years)` | 1 | KDF |
| 106 | 김비서가 왜 그럴까† | What's Wrong with Secretary Kim | 2018 | tvN | romcom | `C IMDb 8.0 (27K)` | 1 | IMDb |
| 107 | 밥 잘 사주는 예쁜 누나† | Something in the Rain | 2018 | JTBC | romance | `C IMDb 8.0 (12K)` | 1 | IMDb |
| 108 | 마더† | Mother | 2018 | tvN | melodrama | `C MDL #21 8.9` | 1 | MDL |
| 109 | 남자친구 | Encounter | 2018 | tvN | romance | `D NielsenKR cable #50 10.329%` | 1 | NKC |
| 110 | 황후의 품격† | The Last Empress | 2018 | SBS | makjang | `D KDF 2018 #3 17.9%` | 1 | KDF |
| 111 | 리턴† | Return | 2018 | SBS | thriller | `D KDF 2018 #4 17.4%` | 1 | KDF |
| 112 | 숨바꼭질† | Hide and Seek | 2018 | MBC | makjang | `D KDF 2018 #5 15.4%` | 1 | KDF |
| 113 | 데릴남편 오작두† | My Contracted Husband, Mr. Oh | 2018 | MBC | romance | `D KDF 2018 #8 13.1%` | 1 | KDF |
| 114 | 키스 먼저 할까요?† | Should We Kiss First? | 2018 | SBS | romance | `D KDF 2018 #9 12.5%` | 1 | KDF |
| 115 | 타인은 지옥이다† | Hell Is Other People | 2019 | OCN | horror thriller | `C IMDb 7.8 (11K)` | 1 | IMDb |
| 116 | 검법남녀 2† | Partners for Justice 2 | 2019 | MBC | forensic procedural | `C MDL #41 8.8` | 1 | MDL |
| 117 | 왕이 된 남자 | The Crowned Clown | 2019 | tvN | period drama | `D NielsenKR cable #42 10.851%` | 1 | NKC |
| 118 | 세상에서 제일 예쁜 내 딸† | Mother of Mine | 2019 | KBS2 | weekend family drama | `D KDF 2019 #1 35.9%` | 1 | KDF |
| 119 | 여름아 부탁해† | Love Is Beautiful, Life Is Wonderful? (EN title unverified) | 2019 | KBS1 | daily drama | `D KDF 2019 #2 25.2%` | 1 | KDF |
| 120 | 동백꽃 필 무렵† | When the Camellia Blooms | 2019 | KBS2 | romance/thriller | `D KDF 2019 #3 23.8%` | 1 | KDF |
| 121 | 왜그래 풍상씨† | Liver or Die | 2019 | KBS2 | family drama | `D KDF 2019 #4 22.7%` | 1 | KDF |
| 122 | 열혈사제† | The Fiery Priest | 2019 | SBS | action comedy | `D KDF 2019 #5 22%` | 1 | KDF |
| 123 | 태양의 계절† | A Place in the Sun | 2019 | KBS2 | daily drama | `D KDF 2019 #6 17.3%` | 1 | KDF |
| 124 | 왼손잡이 아내† | Left-Handed Wife | 2019 | KBS2 | daily makjang | `D KDF 2019 #7 16.7%` | 1 | KDF |
| 125 | 닥터 프리즈너† | Doctor Prisoner | 2019 | KBS2 | medical thriller | `D KDF 2019 #8 15.8%` | 1 | KDF |
| 126 | 슬플 때 사랑한다† | Love in Sadness | 2019 | MBC | melodrama | `D KDF 2019 #9 13%` | 1 | KDF |
| 127 | 스토브리그† | Hot Stove League | 2019 | SBS | sports office drama | `D KDF 2020 #5 19.1%`; `C Douban 9.3 (snippet)` | 1 | KDF |
| 128 | 더 킹: 영원의 군주† | The King: Eternal Monarch | 2020 | SBS | fantasy romance | `C IMDb 8.1 (20K)` | 1 | IMDb |
| 129 | 여신강림† | True Beauty | 2020 | tvN | teen romcom | `C IMDb 7.9 (27K)` | 1 | IMDb |
| 130 | 스타트업† | Start-Up | 2020 | tvN | romance | `C IMDb 7.9 (20K)` | 1 | IMDb |
| 131 | 하이에나† | Hyena | 2020 | SBS | legal drama | `D KDF 2020 #7 14.6%` | 1 | KDF |
| 132 | 굿캐스팅† | Good Casting | 2020 | SBS | spy comedy | `D KDF 2020 #10 12.3%` | 1 | KDF |
| 133 | 펜트하우스 (1–3)† | The Penthouse (S1–S3) | 2020 | SBS | makjang thriller | `D KDF 2020 #3 23.3% (S1); 2021 #3 29.2% (S2), #4 19.5% (S3)` | 1 | KDF |
| 134 | 설강화† | Snowdrop | 2021 | JTBC | period romance | `C IMDb 8.1 (17K)` | 1 | IMDb |
| 135 | 그 해 우리는† | Our Beloved Summer | 2021 | SBS | romance | `C IMDb 8.1 (16K)` | 1 | IMDb |
| 136 | 마이 네임† | My Name | 2021 | Netflix | crime action | `C IMDb 7.8 (47K)` | 1 | IMDb |
| 137 | 나빌레라† | Navillera | 2021 | tvN | dance/family | `C MDL #26 8.9` | 1 | MDL |
| 138 | 해피니스† | Happiness | 2021 | tvN | apocalyptic thriller | `C MDL #37 8.8` | 1 | MDL |
| 139 | 지리산 | Jirisan | 2021 | tvN | mystery | `D NielsenKR cable #44 10.663%` | 1 | NKC |
| 140 | 마인 | Mine | 2021 | tvN | chaebol mystery | `D NielsenKR cable #45 10.512%` | 1 | NKC |
| 141 | 쇼윈도: 여왕의 집 | Show Window: The Queen's House | 2021 | Channel A | infidelity thriller | `D NielsenKR cable #49 10.335%` | 1 | NKC |
| 142 | 오케이 광자매† | Revolutionary Sisters | 2021 | KBS2 | weekend family drama | `D KDF 2021 #1 32.6%` | 1 | KDF |
| 143 | 신사와 아가씨† | Young Lady and Gentleman | 2021 | KBS2 | weekend family drama | `D KDF 2021 #2 30.3%` | 1 | KDF |
| 144 | 빨강 구두† | Red Shoes | 2021 | KBS2 | daily makjang | `D KDF 2021 #5 18.6%` | 1 | KDF |
| 145 | 속아도 꿈결† | Be My Dream Family | 2021 | KBS1 | daily drama | `D KDF 2021 #6 18.4%` | 1 | KDF |
| 146 | 원 더 우먼† | One the Woman | 2021 | SBS | comedy | `D KDF 2021 #7 17.8%` | 1 | KDF |
| 147 | 미스 몬테크리스토† | Miss Monte-Cristo | 2021 | KBS2 | daily makjang | `D KDF 2021 #8 17.6%` | 1 | KDF |
| 148 | 소방서 옆 경찰서† | The First Responders | 2022 | SBS | procedural | `C MDL #57 8.7` | 1 | MDL |
| 149 | 삼남매가 용감하게† | Three Bold Siblings | 2022 | KBS2 | weekend family drama | `D KDF 2023 #1 28%` | 1 | KDF |
| 150 | 내 눈에 콩깍지† | Unpredictable Family | 2022 | KBS1 | daily drama | `D KDF 2023 #4 19.6%` | 1 | KDF |
| 151 | 태풍의 신부† | Bride of the Typhoon | 2022 | KBS2 | daily makjang | `D KDF 2023 #8 15.7%` | 1 | KDF |
| 152 | 천원짜리 변호사† | One Dollar Lawyer | 2022 | SBS | legal comedy | `D KDF 2022 #4 15.2%` | 1 | KDF |
| 153 | 빅마우스† | Big Mouth | 2022 | MBC | crime thriller | `D KDF 2022 #6 13.7%` | 1 | KDF |
| 154 | 어게인 마이 라이프† | Again My Life | 2022 | SBS | regression legal | `D KDF 2022 #7 12%` | 1 | KDF |
| 155 | 지금 우리 학교는† | All of Us Are Dead | 2022 | Netflix | zombie thriller | `D Netflix non-English all-time top 10 (previously; dropped out)` | 1 | NFATH |
| 156 | 카지노† | Big Bet | 2022 | Disney+ | crime | `E FUNdex Awards 2023 OTT drama finalist + OTT actor (Choi Min-sik)` | 1 | FX23 |
| 157 | 정신병동에도 아침이 와요† | Daily Dose of Sunshine | 2023 | Netflix | medical | `C MDL #49 8.8` | 1 | MDL |
| 158 | 힘쎈여자 강남순 | Strong Girl Nam-soon | 2023 | JTBC | action comedy | `D NielsenKR cable #46 10.420%` | 1 | NKC |
| 159 | 고려 거란 전쟁† | Korea–Khitan War | 2023 | KBS2 | historical epic | `D KDF 2024 #4 13.8%` | 1 | KDF |
| 160 | 열녀박씨 계약결혼뎐† | The Story of Park's Marriage Contract | 2023 | MBC | time-slip romcom | `D KDF 2024 #10 9.6%` | 1 | KDF |
| 161 | 진짜가 나타났다!† | The Real Has Come! | 2023 | KBS2 | weekend family drama | `D KDF 2023 #3 20%` | 1 | KDF |
| 162 | 금이야 옥이야† | Apple of My Eye | 2023 | KBS1 | daily drama | `D KDF 2023 #10 12.3%` | 1 | KDF |
| 163 | 셀러브리티 | Celebrity | 2023 | Netflix | thriller | `D Netflix H2 2023 18.3M (#3 Korean series)` | 1 | NF23H2 |
| 164 | 마이 데몬† | My Demon | 2023 | SBS | fantasy romcom | `D Netflix H1 2024 18M` | 1 | NF24H1 |
| 165 | 이두나!† | Doona! | 2023 | Netflix | romance | `E FUNdex Awards 2023 OTT drama finalist` | 1 | FX23 |
| 166 | 최악의 악† | Worst of Evil | 2023 | Disney+ | crime | `E FUNdex Awards 2023 OTT drama finalist` | 1 | FX23 |
| 167 | 남남† | Not Others | 2023 | ENA | family comedy | `E FUNdex Awards 2023 TV drama finalist` | 1 | FX23 |
| 168 | 악귀† | Revenant | 2023 | SBS | occult thriller | `E FUNdex Awards 2023 TV drama finalist + search finalist` | 1 | FX23 |
| 169 | 행복배틀† | Battle for Happiness | 2023 | ENA | thriller | `E FUNdex Awards 2023 TV drama finalist` | 1 | FX23 |
| 170 | 7인의 탈출† | The Escape of the Seven | 2023 | SBS | makjang thriller | `E FUNdex Awards 2023 search-reaction award` | 1 | FX23 |
| 171 | Mr. 플랑크톤† | Mr. Plankton | 2024 | Netflix | road romance | `C IMDb 8.1 (11K)` | 1 | IMDb |
| 172 | 옥씨부인전 | The Tale of Lady Ok | 2024 | JTBC | period drama | `D NielsenKR cable #25 13.575%` | 1 | NKC |
| 173 | 낮과 밤이 다른 그녀 | Miss Night and Day | 2024 | JTBC | fantasy romcom | `D NielsenKR cable #35 11.744%` | 1 | NKC |
| 174 | 밤에 피는 꽃† | Knight Flower | 2024 | MBC | period action-comedy | `D KDF 2024 #2 18.4%` | 1 | KDF |
| 175 | 커넥션† | Connection | 2024 | SBS | crime thriller | `D KDF 2024 #3 14.2%` | 1 | KDF |
| 176 | 원더풀 월드† | Wonderful World | 2024 | MBC | revenge melodrama | `D KDF 2024 #7 11.4%` | 1 | KDF |
| 177 | 재벌X형사† | Flex X Cop | 2024 | SBS | cop comedy | `D KDF 2024 #8 11%` | 1 | KDF |
| 178 | 수사반장 1958† | Chief Detective 1958 | 2024 | MBC | period procedural | `D KDF 2024 #9 10.8%` | 1 | KDF |
| 179 | 기생수: 더 그레이† | Parasyte: The Grey | 2024 | Netflix | sci-fi horror | `D Netflix H1 2024 25M` | 1 | NF24H1 |
| 180 | 닥터슬럼프† | Doctor Slump | 2024 | JTBC | romcom | `D Netflix H1 2024 14M` | 1 | NF24H1 |
| 181 | 살인자ㅇ난감 | A Killer Paradox | 2024 | Netflix | crime thriller | `E FUNdex Awards 2024 OTT original drama best` | 1 | FX24 |
| 182 | 지옥에서 온 판사 | The Judge from Hell | 2024 | SBS | fantasy legal | `E FUNdex Awards 2024 TV drama finalist` | 1 | FX24 |
| 183 | 더 에이트 쇼 | The 8 Show | 2024 | Netflix | thriller | `E FUNdex Awards 2024 OTT original drama finalist` | 1 | FX24 |
| 184 | 사랑 후에 오는 것들 | What Comes After Love | 2024 | Coupang Play | romance | `E FUNdex Awards 2024 OTT original drama finalist` | 1 | FX24 |
| 185 | 피라미드 게임 | Pyramid Game | 2024 | TVING | school thriller | `E FUNdex Awards 2024 OTT original drama finalist + OTT actress (Jang Da-ah)` | 1 | FX24 |
| 186 | 스터디그룹† | Study Group | 2025 | TVING | school action | `C MDL #32 8.8` | 1 | MDL |
| 187 | 보물섬† | Buried Hearts | 2025 | SBS | revenge thriller | `D WRC 2025 #2 15.4% (Nielsen nationwide)` | 1 | WRC |
| 188 | 다 이루어질지니† | Genie, Make a Wish | 2025 | Netflix | fantasy romcom | `D Netflix H2 2025 23M` | 1 | NF25H2 |
| 189 | 견우와 선녀† | Head over Heels | 2025 | tvN | fantasy romcom | `E FUNdex 2025 TV-OTT ending-drama buzz top 10` | 1 | FX25 |
| 190 | 미지의 서울† | Our Unwritten Seoul | 2025 | tvN | drama | `E FUNdex 2025 TV-OTT ending-drama buzz top 10` | 1 | FX25 |
| 191 | 신입사원 강회장 | Reborn Rookie | 2026 | JTBC | regression office drama | `D NielsenKR cable #26 13.568%` | 1 | NKC |
| 192 | 21세기 대군부인† | (EN title unverified) | 2026 | MBC | alt-history romance | `D WRC 2026 #1 13.8% (provisional to 2026-09-18)` | 1 | WRC |
| 193 | 판사 이한영† | Judge Lee Han-young (EN title unverified) | 2026 | MBC | regression legal | `D WRC 2026 #2 13.6%` | 1 | WRC |
| 194 | 레이디 두아† | The Art of Sarah | 2026 | Netflix | mystery thriller | `D Netflix H1 2026 25.8M` | 1 | NF26H1 |

## 4. Excluded on purpose (found in the sources, not K-drama scripted series)

- **Non-Korean or non-live-action titles that IMDb's "country = South Korea" filter returns** (Korean animation studios / co-production credits): Avatar: The Last Airbender, Gravity Falls, Adventure Time (+ Fionna & Cake, Distant Lands), X-Men '97, Regular Show, The Owl House, The Boondocks, Samurai Jack, Justice League, The Legend of Korra, Invader ZIM, Infinity Train, The Spectacular Spider-Man, Amphibia, Scooby-Doo! Mystery Incorporated, Steven Universe, Phineas and Ferb, She-Ra, Superman: TAS, Teen Titans, Transformers, Harvey Birdman, Star Wars: Clone Wars, TMNT (1987, 2003), Thundercats, Rocko's Modern Life; Japanese anime Solo Leveling, Gachiakuta.
- **Kept but flagged**: Pachinko (Apple TV+, US-produced, Korean-language; IMDb/FUNdex include it) — decide at curation.
- **Unscripted** (appear in Netflix reports / FUNdex / Parrot): Physical: 100 (Netflix H1 2023 #15, 234.8M h), Culinary Class Wars S1/S2, Single's Inferno 5, I Am Solo, Boys Planet / Boys II Planet, Heart Signal 4, Transit Love, I Live Alone, Unanswered Questions, etc.
- **Films** in Netflix reports: Ballerina, Believer 2, Officer Black Belt, Mission: Cross, The Great Flood, Love Untangled, Husbands in Action, Pavane; KPop Demon Hunters (US-produced animated film).
- **Pre-2016 terrestrial all-time hits** (NKT ranks 1–48 except My Only One / My Golden Life): You and I, First Love, Sandglass, Hur Jun, Dae Jang Geum, Jumong, Bread Love and Dreams, Wang's Family, etc. Not added as rows (D prefers 2016–2026); available in the NKT section if a "classics" sidebar is wanted.
- **Actor-only FUNdex nominees** whose show had no work-level placement (Dongjae the Good or the Bastard, Hellbound S2, Frankly Speaking / 놀아주는 여자, Captivating the King / 세작, Into the Forest of No One): not added.

## 5. Caveats

- **Rating bases are not comparable.** NKC = Nielsen Korea nationwide *pay-TV households* (cable/종편 since 2018 split); NKT/KDF/WRC terrestrial figures = nationwide households. A 17% tvN peak and a 17% KBS2 peak are different populations. Weekend/daily family dramas (KBS2/KBS1) post 30–49% but rarely travel abroad.
- **Same-number double counting.** NKC + KDF (and WRC) usually repeat one Nielsen peak; when ranking by "independent families" collapse them to one. Same for the Netflix half-year keys (one platform).
- **KDF quirks**: splits shows across calendar years (SKY Castle 2018 = 12.3% vs. its 23.78% Feb 2019 finale, which is in no KDF year; Money Flower, My Golden Life split); omits My Only One (49.4%, Mar 2019). No 2025/2026 edition, hence WRC for those years.
- **IMDb**: list via Exa cache, ≥10K-vote floor → older or niche dramas with fewer votes (e.g., many weekend dramas) cannot appear. Squid Game's 783K votes dwarfs every other K-drama; its 7.9 is pulled down by S2/S3.
- **MDL**: rank/score for 1–60; ratings counts only for 1–20. Seasons/parts are separate entries (The Glory Part 1/2, Hospital Playlist 1/2, Death's Game 1/2). MDL top 60 does not include Squid Game or Queen of Tears.
- **Netflix**: H1 2023 report used *hours*, later reports *views* (hours ÷ runtime). Text pages only name a few Korean titles; the full .xlsx files were not parsed, so absence ≠ low viewing. NF26H1 numbers are via Korea.net, not Netflix's own page.
- **FUNdex**: Awards weight "fun index" as well as raw buzz; finalists counted as placements (like Parrot finalists in the US file). 2025 TV-OTT top-10 ranks were not found — only membership of five tvN titles. 2022 has no award (first edition 2023) and only snippets.
- **Parrot**: Korean presence = Squid Game (2021, 2024, 2025) and Tangerines (2025 finalist). 2023 (6th) and 2022 (5th) had no Korean winner; GWR 2024/2026 editions list no Korean record.
- **English/Korean titles marked †** and all years/networks not from NKC/Netflix need checking at fact-sheet stage. Four EN titles are explicitly unverified (여름아 부탁해, 부탁해요 엄마, 21세기 대군부인, 판사 이한영).

## 6. toolDegradation

| Step | Tool tried | Result | Fallback used |
|---|---|---|---|
| Wikipedia "List of highest-rated Korean dramas in cable television" (action=raw) | Groundlane web_fetch | 404 (page merged into "Korean drama") | Groundlane fetch of `Korean_drama` action=raw by section (49, 52) after MediaWiki API section lookup |
| Netflix Tudum non-English all-time | Groundlane web_fetch (default and maxBytes 15MB) | OUTPUT_LIMIT ×2 | Exa web_fetch_exa — read |
| IMDb advanced search | Groundlane web_fetch | empty JS document | Exa web_fetch_exa — read |
| FlixPatrol yearly KR | Groundlane (browser challenge), Exa (403), jina read_url (challenge page), Tavily extract (failed) | all failed | none — unread; Netflix official reports used instead |
| Douban | not fetched (verification wall; not bypassed) | — | search snippets only, marked snippet |
| Watcha Pedia | Groundlane web_fetch | reachable but no K-drama ranking page | none — unread |
| Terminal curl | `curl` en.wikipedia.org | proxy 403 (`connect_rejected`) | MCP tools only |
| Search | Groundlane web_search (Brave + You.com; Tavily/Exa providers inside Groundlane intermittently "unavailable") | ok | — |
