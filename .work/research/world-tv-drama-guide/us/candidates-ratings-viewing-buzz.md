# US scripted TV candidates — Category C (ratings) / D (viewing data) / E (buzz/demand)

Collected 2026-11-05 for the zh-TW "American TV for Taiwanese adults" series. Data file only — no article copy.
Scope: American-produced scripted series (live-action or animation); reality / talk / docuseries / docu-comedy excluded (see §4).
Tools: Groundlane `web_fetch` / `web_search` / `web_extract` (primary); Firecrawl `firecrawl_scrape` (fallback for IMDb and Netflix Tudum). No `toolDegradation` beyond those two fallbacks.

## 1. Sources

Read status: **read** = page body fetched and parsed; **partial** = page fetched but part of the data was in an image / not in the HTML, so a gap was filled from coverage; **snippet** = only search-result excerpt seen.

| Key | Source | URL | Read status | What was extracted |
|---|---|---|---|---|
| IMDb | IMDb Top 250 TV Shows (live chart, 2026-11-05) | https://www.imdb.com/chart/toptv/ | read (Groundlane returned empty JS shell → Firecrawl scrape; all 250 rows parsed: rank, title, years, rating) | US scripted entries + rating |
| RT25 | Rotten Tomatoes "Best TV Shows of 2025" (every Certified Fresh series, updated 2026-01-05) | https://editorial.rottentomatoes.com/guide/best-tv-shows-of-2025/ | read for ranks 1–99 (Tomatometer + Popcornmeter pulled deterministically from HTML via `web_extract` `.meta-scores-wrapper`); partial for ranks ~100–121 (titles visible in rendered markdown only, scores not captured) | Tomatometer / Popcornmeter per season |
| RT24 | Rotten Tomatoes "Best TV Shows of 2024: every Certified Fresh series" | https://editorial.rottentomatoes.com/guide/best-tv-shows-of-2024-every-certified-fresh-series/ | read (100 entries, deterministic HTML extract) | Tomatometer / Popcornmeter per season |
| N23 | Variety on Nielsen 2023 streaming year-end report | https://variety.com/2024/tv/news/nielsen-2023-streaming-report-suits-the-office-record-1235890306/ | read | Top 10 originals + top 10 overall (text) |
| N24 | Nielsen ARTEY Awards 2024 + World Screen coverage | https://www.nielsen.com/insights/2025/top-streaming-tv-trends-2024-artey-awards/ ; https://worldscreen.com/nielsen-recognizes-most-watched-streaming-titles-of-the-year/ ; https://www.hollywoodreporter.com/tv/tv-news/bluey-bridgerton-2024-year-end-streaming-charts-1236119192/ | read (Nielsen top-10 tables are images; full originals/overall order taken from World Screen + THR text) | Award winners, top 10 originals, top 10 overall |
| N25 | Nielsen ARTEY Awards 2025 + Variety coverage | https://www.nielsen.com/data-center/top-streaming-shows-artey-awards/ ; https://variety.com/2026/tv/news/stranger-things-squid-game-nielsen-original-series-2025-1236643344/ | read (originals chart image; ranks 1–10 given in Variety text) | Top 10 originals, new-drama/comedy winners, binge |
| N26H1 | Nielsen "Streaming charts through first half of 2026" press release | https://www.nielsen.com/news-center/2026/stranger-things-bluey-the-pitt-top-nielsens-streaming-charts-through-first-half-of-2026/ | read | Top 10 overall + named originals ranks (extra; beyond the 2023–25 brief) |
| NFAT | Netflix Tudum "Top 10 Most Popular Shows of All Time" (English) | https://www.netflix.com/tudum/top10/most-popular/tv (cross-check: https://www.whats-on-netflix.com/what-to-watch/most-watched-series-movies-of-all-time-hours-watched/) | read (Groundlane OUTPUT_LIMIT → Firecrawl scrape succeeded; What's on Netflix also read for "previously in top 10") | All-time top 10 English shows, views in first 91 days |
| NF24H1 | Variety: Netflix engagement report Jan–Jun 2024 | https://variety.com/2024/tv/news/netflix-data-viewing-fool-me-once-bridgerton-baby-reindeer-first-half-of-2024-1236150283/ | read | Top 10 shows table |
| NF24H2 | Variety: Netflix engagement report Jul–Dec 2024 | https://variety.com/2025/digital/news/netflix-viewing-reports-second-half-2024-squid-game-2-1236321284/ | read | Top 10 shows table |
| NF25H1 | Variety: Netflix engagement report Jan–Jun 2025 | https://variety.com/2025/tv/news/adolescence-back-in-action-netflix-most-watched-first-half-2025-1236464159/ | read | Top 10 shows table |
| NF25H2 | Netflix "What We Watched the Second Half of 2025" | https://about.netflix.com/news/what-we-watched-the-second-half-of-2025 | partial (official text read; the top-10 graphic is an image). Ranks #5–#10 and #12/#22 come from search snippets of Manila Bulletin / Pop Base / IGN (Manila Bulletin fetch blocked by a browser challenge) → those ranks = **snippet** | Top shows with views |
| P23 | Parrot Analytics 6th Global Demand Awards (data year 2023, announced 2024-01-30) | https://www.parrotanalytics.com/announcements/6th-annual-global-demand-awards-announces-jujutsu-kaisen-most-in-demand-tv-series-in-the-world-and-pathaan-most-in-demand-movie-of-2023/ | read | Category winners |
| P24 | Parrot Analytics 7th Global Demand Awards (data year 2024, announced 2025-01-29) | https://www.parrotanalytics.com/insights/7th-annual-global-demand-awards-announces-house-of-the-dragon-most-in-demand-tv-series-and-stree-2-most-in-demand-movie-of-2024/ | read | Category winners |
| P25 | Parrot Analytics 8th Global Demand Awards (data year 2025, announced 2026-01-15) + finalists (2025-12-10) | https://www.parrotanalytics.com/insights/8th-annual-global-demand-awards-stranger-things-shatters-streaming-records-and-pushpa-the-rule-part-2-redefines-the-global-blockbuster/ ; https://www.parrotanalytics.com/insights/8th-annual-global-demand-awards-finalists-announced/ | read (both) | Winners + top-5 finalists per category (counted as one source) |
| GWR26 | Parrot Analytics × Guinness World Records 2026 (demand 2024-02-01 → 2025-01-31) | https://www.parrotanalytics.com/announcements/parrot-analytics-and-guinness-world-records-crown-the-worlds-most-in-demand-tv-shows-in-guinness-world-records-2026/ | read | Record holders with demand multiple |

Edition mapping for Parrot ("2024 / 2025 / 2026 editions"): announced in 2024 = 6th (P23), in 2025 = 7th (P24), in 2026 = 8th (P25). No 9th edition exists yet (data year 2026 is still running).

## 2. Mandatory check — five named shows × every source

| Show | IMDb | RT25 | RT24 | N23 | N24 | N25 | N26H1 | NFAT | NF24H1 | NF24H2 | NF25H1 | NF25H2 | P23 | P24 | P25 | GWR26 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Game of Thrones | 9.2 (#13) | – (no season) | – | – | – | – | – | n/a (HBO) | – | – | – | – | – | – (HotD won) | – | **most in-demand show overall, 89.0×** |
| Peacemaker | not in 250 | **S2 94% / Popcorn 79%** | – | – | – | – | – | n/a | – | – | – | – | – | – | **superhero finalist** (lost to Invincible) | – |
| Rick and Morty | 9.0 (#22) | – | – | – | – | – | – | n/a | – | – | – | – | – | – | **comedy finalist** (SNL won) | **most in-demand sitcom, 47.0×** |
| The Pitt | 8.9 (#40) | **S1 94% / 88%** | **S1 94% / 88%** (also on 2024 page) | – | – | **top new original drama, 11.4B min** | **#2 original / #3 overall, 21.12B** | n/a | – | – | – | – | – | – | – (not a finalist) | – |
| Euphoria | not in 250 | – | – | – | – | – | – | n/a | – | – | – | – | – | – | – | – |

"–" = checked, absent. "n/a" = Netflix lists only cover Netflix titles. Euphoria had no new season in the 2023–2025 windows these lists cover (S3 is 2026), so it has zero C/D/E evidence here; it would need a 2026 RT list or Nielsen 2026 full-year to show up.

## 3. Candidate table

Distinct-source count uses the keys in §1 (one key per source, e.g. N25 = Nielsen ARTEY page + its Variety coverage; P25 = winners + finalists). Shows with ≥3 sources: Stranger Things (8); The Pitt, The Boys, Nobody Wants This (5); Fallout, Wednesday, Bridgerton, Reacher, The Night Agent, Hazbin Hotel, Grey's Anatomy (4); Rick and Morty, Ted Lasso, Daredevil, The Last of Us, Landman, Ginny & Georgia, The Lincoln Lawyer, Monsters, Emily in Paris, The Big Bang Theory (3).

Origin notes: rows flagged "co-pro", "UK-shot", "US/UK" or "Korean/Japanese-language" are US-commissioned but borderline on "American-produced"; decide at curation time. Kids/family animation that appears (Avatar: The Last Airbender, Percy Jackson, Win or Lose, Spider-Man, Eyes of Wakanda) is kept but flagged by genre — filter out if the series is adult-only.

| # | English title | First-air year | Network/platform | Genre | Evidence tags | Distinct sources |
|---|---|---|---|---|---|---|
| 1 | Breaking Bad | 2008 | AMC | crime drama | `C IMDb 9.5 (#1)` | 1 |
| 2 | Band of Brothers | 2001 | HBO | war miniseries | `C IMDb 9.4 (#4)` | 1 |
| 3 | Chernobyl | 2019 | HBO (co-pro Sky UK) | historical drama miniseries | `C IMDb 9.3 (#5)` | 1 |
| 4 | The Wire | 2002 | HBO | crime drama | `C IMDb 9.3 (#7)` | 1 |
| 5 | The Sopranos | 1999 | HBO | crime drama | `C IMDb 9.2 (#8)` | 1 |
| 6 | Game of Thrones | 2011 | HBO | fantasy drama | `C IMDb 9.2 (#13)`; `E GWR2026 most in-demand TV show overall 89.0x` | 2 |
| 7 | The Twilight Zone | 1959 | CBS | sci-fi anthology | `C IMDb 9.0 (#20)` | 1 |
| 8 | Rick and Morty | 2013 | Adult Swim | adult animated sci-fi comedy | `C IMDb 9.0 (#22)`; `E GWR2026 most in-demand sitcom 47.0x`; `E Parrot GDA 2025 comedy finalist` | 3 |
| 9 | Better Call Saul | 2015 | AMC | crime drama | `C IMDb 9.0 (#25)` | 1 |
| 10 | The Office (US) | 2005 | NBC | sitcom | `C IMDb 9.0 (#26)` | 1 |
| 11 | Arcane | 2021 | Netflix (Riot Games US / Fortiche FR) | adult animated fantasy | `C IMDb 9.0 (#27)`; `C RT 2024 S2 100% / Popcorn 81%` | 2 |
| 12 | Dexter: Resurrection | 2025 | Paramount+ with Showtime | crime drama | `C IMDb 9.0 (#37)`; `C RT 2025 S1 95% / Popcorn 91%` | 2 |
| 13 | The Pitt | 2025 | HBO Max | medical drama | `C IMDb 8.9 (#40)`; `C RT 2025 S1 94% / Popcorn 88%`; `C RT 2024-list S1 94% / Popcorn 88% (listed on 2024 page)`; `D Nielsen 2025 ARTEY top new original drama 11.4B min`; `D Nielsen H1 2026 #2 original / #3 overall 21.12B min` | 5 |
| 14 | Firefly | 2002 | Fox | sci-fi western | `C IMDb 8.9 (#41)` | 1 |
| 15 | Seinfeld | 1989 | NBC | sitcom | `C IMDb 8.8 (#48)` | 1 |
| 16 | True Detective | 2014 | HBO | crime anthology | `C IMDb 8.8 (#50)`; `C RT 2024 Night Country 93% / Popcorn 55%` | 2 |
| 17 | Fargo | 2014 | FX | crime anthology | `C IMDb 8.8 (#52)` | 1 |
| 18 | The Chosen | 2017 | Angel Studios / Prime Video | religious historical drama | `C IMDb 9.1 (#54)` | 1 |
| 19 | The West Wing | 1999 | NBC | political drama | `C IMDb 8.9 (#57)` | 1 |
| 20 | Friends | 1994 | NBC | sitcom | `C IMDb 8.8 (#59)`; `D Nielsen 2023 overall top 10 (25B min, acquired)` | 2 |
| 21 | When They See Us | 2019 | Netflix | drama miniseries | `C IMDb 8.8 (#60)` | 1 |
| 22 | It's Always Sunny in Philadelphia | 2005 | FX/FXX | sitcom | `C IMDb 8.8 (#62)` | 1 |
| 23 | Succession | 2018 | HBO | drama | `C IMDb 8.8 (#65)` | 1 |
| 24 | BoJack Horseman | 2014 | Netflix | adult animated dramedy | `C IMDb 8.8 (#67)` | 1 |
| 25 | Curb Your Enthusiasm | 2000 | HBO | comedy | `C IMDb 8.8 (#69)`; `C RT 2024 S12 94% / Popcorn 71%` | 2 |
| 26 | Chappelle's Show | 2003 | Comedy Central | sketch comedy | `C IMDb 8.8 (#78)` | 1 |
| 27 | Freaks and Geeks | 1999 | NBC | teen dramedy | `C IMDb 8.7 (#79)` | 1 |
| 28 | Twin Peaks | 1990 | ABC (2017 revival Showtime) | mystery drama | `C IMDb 8.7 (1990) / 8.5 (2017, #222) (#82)` | 1 |
| 29 | Narcos | 2015 | Netflix | crime drama | `C IMDb 8.7 (#83)` | 1 |
| 30 | South Park | 1997 | Comedy Central | adult animated comedy | `C IMDb 8.7 (#86)`; `E Parrot GDA 2025 comedy finalist` | 2 |
| 31 | Six Feet Under | 2001 | HBO | drama | `C IMDb 8.7 (#93)` | 1 |
| 32 | Ted Lasso | 2020 | Apple TV+ | sports comedy | `C IMDb 8.7 (#95)`; `D Nielsen 2023 #1 streaming original 16.9B min`; `E Parrot GDA 2023 most in-demand comedy` | 3 |
| 33 | Rome | 2005 | HBO (co-pro BBC) | historical drama | `C IMDb 8.7 (#97)` | 1 |
| 34 | Oz | 1997 | HBO | prison drama | `C IMDb 8.7 (#99)` | 1 |
| 35 | Invincible | 2021 | Prime Video | adult animated superhero | `C IMDb 8.7 (#101)`; `E Parrot GDA 2025 most in-demand superhero series (winner)` | 2 |
| 36 | The Shield | 2002 | FX | crime drama | `C IMDb 8.7 (#102)` | 1 |
| 37 | Battlestar Galactica (2004) | 2004 | Sci Fi | sci-fi drama | `C IMDb 8.7 (series) / 8.5 (2003 miniseries, #188) (#105)` | 1 |
| 38 | Star Trek: The Next Generation | 1987 | Syndication | sci-fi | `C IMDb 8.7 (#106)` | 1 |
| 39 | Mad Men | 2007 | AMC | period drama | `C IMDb 8.7 (#107)` | 1 |
| 40 | X-Men '97 | 2024 | Disney+ | animated superhero | `C IMDb 8.7 (#108)`; `C RT 2024 S1 99% / Popcorn 91%` | 2 |
| 41 | Blue Eye Samurai | 2023 | Netflix | adult animated action | `C IMDb 8.7 (#112)` | 1 |
| 42 | The Simpsons | 1989 | Fox | adult animated sitcom | `C IMDb 8.6 (#114)`; `E Parrot GDA 2025 comedy finalist` | 2 |
| 43 | House | 2004 | Fox | medical drama | `C IMDb 8.7 (#116)` | 1 |
| 44 | Friday Night Lights | 2006 | NBC | sports drama | `C IMDb 8.7 (#123)` | 1 |
| 45 | Arrested Development | 2003 | Fox / Netflix | sitcom | `C IMDb 8.6 (#125)` | 1 |
| 46 | Severance | 2022 | Apple TV+ | sci-fi thriller | `C IMDb 8.6 (#128)` | 1 |
| 47 | This Is Us | 2016 | NBC | family drama | `C IMDb 8.7 (#129)` | 1 |
| 48 | The Marvelous Mrs. Maisel | 2017 | Prime Video | period comedy | `C IMDb 8.6 (#130)` | 1 |
| 49 | Dexter | 2006 | Showtime | crime drama | `C IMDb 8.6 (#136)` | 1 |
| 50 | The X-Files | 1993 | Fox | sci-fi mystery | `C IMDb 8.6 (#137)` | 1 |
| 51 | Parks and Recreation | 2009 | NBC | sitcom | `C IMDb 8.6 (#138)` | 1 |
| 52 | 1883 | 2021 | Paramount+ | western miniseries | `C IMDb 8.6 (#140)` | 1 |
| 53 | Deadwood | 2004 | HBO | western | `C IMDb 8.6 (#143)` | 1 |
| 54 | Daredevil | 2015 | Netflix | superhero crime | `C IMDb 8.6 (#145)`; `C RT 2025 Born Again S1 87% / Popcorn 79%`; `E Parrot GDA 2025 series-debut & superhero finalist (Born Again)` | 3 |
| 55 | Atlanta | 2016 | FX | comedy-drama | `C IMDb 8.6 (#146)` | 1 |
| 56 | Lonesome Dove | 1989 | CBS | western miniseries | `C IMDb 8.6 (#147)` | 1 |
| 57 | Mindhunter | 2017 | Netflix | crime drama | `C IMDb 8.6 (#150)` | 1 |
| 58 | House of Cards | 2013 | Netflix | political drama | `C IMDb 8.6 (#152)` | 1 |
| 59 | Primal | 2019 | Adult Swim | adult animated action | `C IMDb 8.6 (#155)` | 1 |
| 60 | The Mandalorian | 2019 | Disney+ | sci-fi western | `C IMDb 8.6 (#157)`; `D Nielsen 2023 #8 streaming original 12.3B min` | 2 |
| 61 | Andor | 2022 | Disney+ | sci-fi spy drama | `C IMDb 8.6 (#160)`; `C RT 2025 S2 97% / Popcorn 90%` | 2 |
| 62 | A Knight of the Seven Kingdoms | 2026 | HBO | fantasy drama | `C IMDb 8.6 (#161)` | 1 |
| 63 | The Offer | 2022 | Paramount+ | drama miniseries | `C IMDb 8.6 (#163)` | 1 |
| 64 | Shōgun | 2024 | FX / Hulu | historical drama | `C IMDb 8.6 (#164)`; `C RT 2024 99% / Popcorn 85%` | 2 |
| 65 | Pose | 2018 | FX | drama | `C IMDb 8.6 (#167)` | 1 |
| 66 | The Newsroom | 2012 | HBO | drama | `C IMDb 8.6 (#172)` | 1 |
| 67 | The Penguin | 2024 | HBO | crime miniseries | `C IMDb 8.6 (#173)`; `C RT 2024 95% / Popcorn 85%` | 2 |
| 68 | Homicide: Life on the Street | 1993 | NBC | police drama | `C IMDb 8.7 (#174)` | 1 |
| 69 | Boardwalk Empire | 2010 | HBO | period crime drama | `C IMDb 8.5 (#176)` | 1 |
| 70 | Dopesick | 2021 | Hulu | drama miniseries | `C IMDb 8.6 (#179)` | 1 |
| 71 | Archer | 2009 | FX/FXX | adult animated spy comedy | `C IMDb 8.6 (#180)` | 1 |
| 72 | Scavengers Reign | 2023 | Max | adult animated sci-fi | `C IMDb 8.6 (#181)` | 1 |
| 73 | Mystery Science Theater 3000 | 1988 | Comedy Central / Sci Fi | puppet comedy | `C IMDb 8.6 (#183)` | 1 |
| 74 | Stranger Things | 2016 | Netflix | sci-fi horror | `C IMDb 8.6 (#184)`; `C RT 2025 S5 83% / Popcorn 52%`; `D Nielsen 2025 #1 streaming original 39.54B min`; `D Nielsen H1 2026 #1 overall 23.26B min`; `D Netflix all-time English #3 (S4 140.7M) & #4 (S5 133.8M)`; `D Netflix H2 2025 #2 (S5 93.5M), S1 #5, S2 #10`; `E Parrot GDA 2025 World's Choice + Drama + Horror`; `E GWR2026 most in-demand sci-fi drama 53.8x` | 8 |
| 75 | Justified | 2010 | FX | crime western | `C IMDb 8.6 (#186)` | 1 |
| 76 | The Venture Bros. | 2003 | Adult Swim | adult animated comedy | `C IMDb 8.6 (#191)` | 1 |
| 77 | What We Do in the Shadows | 2019 | FX | mockumentary comedy | `C IMDb 8.5 (#195)`; `C RT 2024 S6 92% / Popcorn 87%` | 2 |
| 78 | The Haunting of Hill House | 2018 | Netflix | horror miniseries | `C IMDb 8.5 (#201)` | 1 |
| 79 | Flight of the Conchords | 2007 | HBO | musical comedy | `C IMDb 8.5 (#206)` | 1 |
| 80 | Mr. Robot | 2015 | USA | techno-thriller | `C IMDb 8.5 (#208)` | 1 |
| 81 | The Queen's Gambit | 2020 | Netflix | drama miniseries | `C IMDb 8.5 (#214)`; `D Netflix all-time English #9 (112.8M)` | 2 |
| 82 | Sons of Anarchy | 2008 | FX | crime drama | `C IMDb 8.5 (#224)` | 1 |
| 83 | The Boys | 2019 | Prime Video | superhero satire | `C IMDb 8.5 (#232)`; `C RT 2024 S4 92% / Popcorn 53%`; `D Nielsen 2024 #3 streaming original 13.58B min`; `E Parrot GDA 2024 most in-demand superhero series`; `E GWR2026 most in-demand action & adventure + superhero show 67.8x` | 5 |
| 84 | Louie | 2010 | FX | comedy | `C IMDb 8.5 (#237)` | 1 |
| 85 | Yellowstone | 2018 | Paramount Network | western drama | `C IMDb 8.6 (#241)` | 1 |
| 86 | The Boondocks | 2005 | Adult Swim | adult animated satire | `C IMDb 8.5 (#245)` | 1 |
| 87 | The Expanse | 2015 | Syfy / Prime Video | sci-fi | `C IMDb 8.5 (#246)` | 1 |
| 88 | Smiling Friends | 2020 | Adult Swim | adult animated comedy | `C IMDb 8.5 (#249)` | 1 |
| 89 | Silicon Valley | 2014 | HBO | comedy | `C IMDb 8.5 (#250)` | 1 |
| 90 | Peacemaker | 2022 | HBO Max | superhero action comedy | `C RT 2025 S2 94% / Popcorn 79%`; `E Parrot GDA 2025 superhero finalist` | 2 |
| 91 | Euphoria | 2019 | HBO | teen drama | none found in any C/D/E source (checked) | 0 |
| 92 | House of the Dragon | 2022 | HBO | fantasy drama | `C RT 2024 S2 84% / Popcorn 71%`; `E Parrot GDA 2024 World's Choice + Drama` | 2 |
| 93 | The Last of Us | 2023 | HBO | post-apocalyptic drama | `C RT 2025 S2 92% / Popcorn 37%`; `E Parrot GDA 2023 most in-demand drama`; `E Parrot GDA 2025 World's Choice/Drama/Horror finalist` | 3 |
| 94 | Fallout | 2024 | Prime Video | post-apocalyptic sci-fi | `C RT 2025 S2 96% / Popcorn 96%`; `C RT 2024 S1 93% / Popcorn 95%`; `D Nielsen 2024 top new original drama 11.95B min (#5 original)`; `D Nielsen H1 2026 #9 original 7.98B min` | 4 |
| 95 | Wednesday | 2022 | Netflix | supernatural teen mystery-comedy | `C RT 2025 S2 87% / Popcorn 76%`; `D Nielsen 2025 #3 original 20B min`; `D Netflix all-time English #1 (S1 252.1M) & #6 (S2 119.3M)`; `D Netflix H2 2025 #1 (S2 123.9M), S1 #8` | 4 |
| 96 | Bridgerton | 2020 | Netflix (Shondaland; UK-shot) | period romance | `D Nielsen 2024 #1 streaming original 21.42B min`; `D Nielsen H1 2026 #6 overall 17.15B min`; `D Netflix all-time English #8 (S1 113.3M) & #10 (S3 106M)`; `D Netflix H1 2024 #2 (S3 91.9M)` | 4 |
| 97 | Reacher | 2022 | Prime Video | action crime | `C RT 2025 S3 98% / Popcorn 75%`; `D Nielsen 2024 #10 original 10.57B min`; `D Nielsen 2025 #5 original 15.64B min`; `E Parrot GDA 2025 drama finalist` | 4 |
| 98 | Landman | 2024 | Paramount+ | drama | `C RT 2025-page S2 (listed in markdown only; score not captured)`; `D Nielsen 2025 #4 original 18.89B min`; `D Nielsen H1 2026 #4 original 12.40B min` | 3 |
| 99 | Ginny & Georgia | 2021 | Netflix | teen family drama | `D Nielsen 2023 #3 original 14.4B min`; `D Nielsen 2025 #6 original 14.25B min`; `D Netflix H1 2025 #10 (S3 48.1M)` | 3 |
| 100 | The Night Agent | 2023 | Netflix | political thriller | `C RT 2025 S2 86% / Popcorn 40%`; `D Nielsen 2023 #2 original 14.4B min`; `D Nielsen 2025 #8 original 13.19B min`; `D Netflix H1 2025 #9 (S2 53.2M)` | 4 |
| 101 | The Lincoln Lawyer | 2022 | Netflix | legal drama | `D Nielsen 2023 #10 original 11.8B min`; `D Nielsen 2024 #4 original 12.44B min`; `D Nielsen H1 2026 #5 original 10.53B min` | 3 |
| 102 | Virgin River | 2019 | Netflix | romantic drama | `D Nielsen 2023 #4 original 13.7B min` | 1 |
| 103 | Tom Clancy's Jack Ryan | 2018 | Prime Video | spy thriller | `D Nielsen 2023 #6 original 12.8B min` | 1 |
| 104 | Outer Banks | 2020 | Netflix | teen adventure drama | `D Nielsen 2023 #9 original 12B min` | 1 |
| 105 | Futurama | 1999 | Fox / Comedy Central / Hulu | adult animated sci-fi comedy | `D Nielsen 2024 #6 original 11.75B min` | 1 |
| 106 | Evil | 2019 | CBS / Paramount+ | supernatural procedural | `C RT 2024 S4 100% / Popcorn 86%`; `D Nielsen 2024 #8 original` | 2 |
| 107 | Nobody Wants This | 2024 | Netflix | romantic comedy | `C RT 2024 S1 95% / Popcorn 84%`; `C RT 2025-page S2 (markdown only; score not captured)`; `D Nielsen 2024 top new original comedy 4.90B min`; `D Netflix H2 2024 #5 (S1 56.8M)`; `D Netflix H2 2025 S2 30M (not top 10)` | 5 |
| 108 | A Man on the Inside | 2024 | Netflix | comedy | `C RT 2025 S2 90% / Popcorn 70%`; `D Nielsen 2024 new original comedy runner-up 2.94B min` | 2 |
| 109 | The Residence | 2025 | Netflix | comedic whodunit | `C RT 2025 S1 84% / Popcorn 79%`; `D Nielsen 2025 new original drama runner-up 9.5B min` | 2 |
| 110 | Running Point | 2025 | Netflix | sports comedy | `C RT 2025-page S1 (markdown only; score not captured)`; `D Nielsen 2025 top new original comedy 5.1B min` | 2 |
| 111 | The Perfect Couple | 2024 | Netflix | mystery miniseries | `D Netflix H2 2024 #2 (75.1M)` | 1 |
| 112 | Monsters (Menendez / Ed Gein / Dahmer) | 2022 | Netflix | true-crime drama anthology | `D Netflix all-time English #7 (Dahmer 115.6M)`; `D Netflix H2 2024 #3 (Menendez 69.7M)`; `D Netflix H2 2025 #6 (Ed Gein 55.8M)` | 3 |
| 113 | Emily in Paris | 2020 | Netflix | romantic comedy | `C RT 2025 S5 65% / Popcorn 37%`; `D Netflix H2 2024 #4 (S4 57.8M)`; `D Netflix H2 2025 S5 30.3M (not top 10)` | 3 |
| 114 | Cobra Kai | 2018 | YouTube Red / Netflix | martial-arts dramedy | `C RT 2024 S6 91% / Popcorn 80%`; `D Netflix H2 2024 #10 (S6 38.3M)` | 2 |
| 115 | Avatar: The Last Airbender | 2005 | Nickelodeon (2024 live-action Netflix) | fantasy (animated 2005 / live-action 2024) | `C IMDb 9.3 (2005 animated) (#6)`; `D Netflix H1 2024 #5 (live-action S1 71.1M)` | 2 |
| 116 | Griselda | 2024 | Netflix | crime miniseries | `C RT 2024 85% / Popcorn 68%`; `D Netflix H1 2024 #6 (69.2M)` | 2 |
| 117 | 3 Body Problem | 2024 | Netflix | sci-fi | `C RT 2024 S1 78% / Popcorn 76%`; `D Netflix H1 2024 #8 (52.4M)` | 2 |
| 118 | Zero Day | 2025 | Netflix | political thriller miniseries | `D Netflix H1 2025 #4 (61.3M)` | 1 |
| 119 | Sirens | 2025 | Netflix | dark comedy miniseries | `C RT 2025-page (markdown only; score not captured)`; `D Netflix H1 2025 #8 (53.3M)` | 2 |
| 120 | Untamed | 2025 | Netflix | crime thriller | `C RT 2025 83% / Popcorn 70%`; `D Netflix H2 2025 #3 (92.8M)` | 2 |
| 121 | I Will Find You | 2026 | Netflix | thriller miniseries | `D Netflix all-time English #5 (120.8M)` | 1 |
| 122 | The Beast in Me | 2025 | Netflix | psychological thriller | `C RT 2025 85% / Popcorn 76%`; `D Netflix H2 2025 #12 (43.0M)` | 2 |
| 123 | Hazbin Hotel | 2024 | Prime Video | adult animated musical comedy | `C RT 2024 S1 81% / Popcorn 85%`; `E Parrot GDA 2024 series debut + comedy`; `E Parrot GDA 2025 comedy finalist`; `E GWR2026 most in-demand animated show 74.0x` | 4 |
| 124 | Loki | 2021 | Disney+ | superhero sci-fi | `E Parrot GDA 2023 most in-demand superhero` | 1 |
| 125 | Secret Invasion | 2023 | Disney+ | superhero spy | `E Parrot GDA 2023 most in-demand series debut` | 1 |
| 126 | American Horror Story | 2011 | FX | horror anthology | `E Parrot GDA 2023 most in-demand horror` | 1 |
| 127 | The Witcher | 2019 | Netflix (US prod., filmed Europe) | fantasy | `E Parrot GDA 2023 most in-demand book adaptation` | 1 |
| 128 | From | 2022 | MGM+ | horror mystery | `E Parrot GDA 2024 most in-demand horror` | 1 |
| 129 | IT: Welcome to Derry | 2025 | HBO | horror | `C RT 2025 81% / Popcorn 82%`; `E Parrot GDA 2025 most in-demand series debut (winner)` | 2 |
| 130 | Alien: Earth | 2025 | FX / Hulu | sci-fi horror | `C RT 2025 94% / Popcorn 65%`; `E Parrot GDA 2025 series-debut finalist` | 2 |
| 131 | Gen V | 2023 | Prime Video | superhero college drama | `C RT 2025 S2 90% / Popcorn 69%`; `E Parrot GDA 2025 superhero finalist` | 2 |
| 132 | Creature Commandos | 2024 | Max | adult animated superhero | `C RT 2024 S1 93% / Popcorn 79%`; `E Parrot GDA 2025 superhero finalist` | 2 |
| 133 | The Walking Dead: Daryl Dixon | 2023 | AMC | post-apocalyptic horror | `E Parrot GDA 2025 horror finalist` | 1 |
| 134 | Yellowjackets | 2021 | Showtime | survival horror drama | `E Parrot GDA 2025 horror finalist` | 1 |
| 135 | 13 Reasons Why | 2017 | Netflix | teen drama | `E GWR2026 most in-demand teen drama 16.1x` | 1 |
| 136 | Hacks | 2021 | Max | comedy | `C RT 2025 S4 98% / Popcorn 75%`; `C RT 2024 S3 98% / Popcorn 89%` | 2 |
| 137 | Pluribus | 2025 | Apple TV+ | sci-fi drama | `C RT 2025 S1 99% / Popcorn 68%` | 1 |
| 138 | The White Lotus | 2021 | HBO | satirical drama anthology | `C RT 2025 S3 86% / Popcorn 76%` | 1 |
| 139 | The Bear | 2022 | FX / Hulu | comedy-drama | `C RT 2025 S4 84% / Popcorn 69%` | 1 |
| 140 | The Studio | 2025 | Apple TV+ | comedy | `C RT 2025 S1 92% / Popcorn 77%` | 1 |
| 141 | Task | 2025 | HBO | crime drama | `C RT 2025 S1 96% / Popcorn 78%` | 1 |
| 142 | Poker Face | 2023 | Peacock | mystery comedy | `C RT 2025 S2 96% / Popcorn 70%` | 1 |
| 143 | Paradise | 2025 | Hulu | political thriller | `C RT 2025 S1 86% / Popcorn 85%`; `D Nielsen H1 2026 #14 original 5.66B min` | 2 |
| 144 | Only Murders in the Building | 2021 | Hulu | mystery comedy | `C RT 2025 S5 89% / Popcorn 83%`; `C RT 2024 S4 93% / Popcorn 88%` | 2 |
| 145 | Shrinking | 2023 | Apple TV+ | comedy-drama | `C RT 2024 S2 97% / Popcorn 89%` | 1 |
| 146 | Silo | 2023 | Apple TV+ | sci-fi | `C RT 2024 S2 92% / Popcorn 68%` | 1 |
| 147 | Matlock | 2024 | CBS | legal drama | `C RT 2024 S1 90% / Popcorn 78%` | 1 |
| 148 | High Potential | 2024 | ABC | crime procedural | `C RT 2025 S1 96% / Popcorn 81%` | 1 |
| 149 | Murderbot | 2025 | Apple TV+ | sci-fi comedy | `C RT 2025 S1 95% / Popcorn 82%` | 1 |
| 150 | Common Side Effects | 2025 | Adult Swim | adult animated thriller | `C RT 2025 S1 100% / Popcorn 91%` | 1 |
| 151 | King of the Hill | 1997 | Fox / Hulu (2025 revival) | adult animated sitcom | `C RT 2025 S14 98% / Popcorn 88%` | 1 |
| 152 | Industry | 2020 | HBO (co-pro BBC) | finance drama | `C RT 2024 S3 98% / Popcorn 88%` | 1 |
| 153 | The Chair Company | 2025 | HBO | comedy | `C RT 2025 S1 100% / Popcorn 68%` | 1 |
| 154 | Long Story Short | 2025 | Netflix | adult animated dramedy | `C RT 2025 S1 100% / Popcorn 80%` | 1 |
| 155 | Percy Jackson and the Olympians | 2023 | Disney+ | family fantasy | `C RT 2025 S2 100% / Popcorn 84%` | 1 |
| 156 | Platonic | 2023 | Apple TV+ | comedy | `C RT 2025 S2 100% / Popcorn 83%` | 1 |
| 157 | Ballard | 2025 | Prime Video | crime drama | `C RT 2025 S1 100% / Popcorn 75%` | 1 |
| 158 | The Righteous Gemstones | 2019 | HBO | comedy | `C RT 2025 S4 100% / Popcorn 75%` | 1 |
| 159 | Dying for Sex | 2025 | FX / Hulu | dramedy miniseries | `C RT 2025 98% / Popcorn 80%` | 1 |
| 160 | The Lowdown | 2025 | FX / Hulu | crime drama | `C RT 2025 S1 98% / Popcorn 77%` | 1 |
| 161 | Your Friendly Neighborhood Spider-Man | 2025 | Disney+ | animated superhero | `C RT 2025 S1 97% / Popcorn 62%` | 1 |
| 162 | Forever | 2025 | Netflix | teen romance drama | `C RT 2025 S1 97% / Popcorn 87%` | 1 |
| 163 | The Wheel of Time | 2021 | Prime Video | fantasy | `C RT 2025 S3 98% / Popcorn 85%` | 1 |
| 164 | #1 Happy Family USA | 2025 | Prime Video | adult animated comedy | `C RT 2025 S1 96% / Popcorn 61%` | 1 |
| 165 | Deli Boys | 2025 | Hulu | crime comedy | `C RT 2025 S1 96% / Popcorn 83%` | 1 |
| 166 | Mo | 2022 | Netflix | comedy-drama | `C RT 2025 S2 96% / Popcorn 91%` | 1 |
| 167 | The Gilded Age | 2022 | HBO | period drama | `C RT 2025 S3 96% / Popcorn 86%` | 1 |
| 168 | Devil in Disguise: John Wayne Gacy | 2025 | Peacock | true-crime drama miniseries | `C RT 2025 96% / Popcorn 84%` | 1 |
| 169 | Hal & Harper | 2025 | Mubi | family dramedy | `C RT 2025 S1 94% / Popcorn 90%` | 1 |
| 170 | Overcompensating | 2025 | Prime Video | college comedy | `C RT 2025 S1 93% / Popcorn 81%` | 1 |
| 171 | Duster | 2025 | HBO Max | 1970s crime drama | `C RT 2025 S1 92% / Popcorn 85%` | 1 |
| 172 | Chief of War | 2025 | Apple TV+ | historical epic | `C RT 2025 S1 92% / Popcorn 84%` | 1 |
| 173 | Eyes of Wakanda | 2025 | Disney+ | animated superhero | `C RT 2025 S1 92% / Popcorn 51%` | 1 |
| 174 | Foundation | 2021 | Apple TV+ | sci-fi | `C RT 2025 S3 91% / Popcorn 77%` | 1 |
| 175 | Death by Lightning | 2025 | Netflix | historical drama miniseries | `C RT 2025 90% / Popcorn 87%` | 1 |
| 176 | Boots | 2025 | Netflix | military dramedy | `C RT 2025 S1 90% / Popcorn 89%` | 1 |
| 177 | Win or Lose | 2025 | Disney+ (Pixar) | family animated comedy | `C RT 2025 S1 88% / Popcorn 89%` | 1 |
| 178 | Mid-Century Modern | 2025 | Hulu | sitcom | `C RT 2025 S1 89% / Popcorn 80%` | 1 |
| 179 | Star Trek: Strange New Worlds | 2022 | Paramount+ | sci-fi | `C RT 2025 S3 88% / Popcorn 52%` | 1 |
| 180 | Dope Thief | 2025 | Apple TV+ | crime thriller | `C RT 2025 S1 86% / Popcorn 83%` | 1 |
| 181 | The Handmaid's Tale | 2017 | Hulu | dystopian drama | `C RT 2025 S6 87% / Popcorn 44%` | 1 |
| 182 | Clean Slate | 2025 | Prime Video | sitcom | `C RT 2025 S1 87% / Popcorn 79%` | 1 |
| 183 | Outlander: Blood of My Blood | 2025 | Starz (UK-shot) | historical romance | `C RT 2025 S1 88% / Popcorn 79%` | 1 |
| 184 | Étoile | 2025 | Prime Video | comedy-drama | `C RT 2025 S1 86% / Popcorn 76%` | 1 |
| 185 | I Love LA | 2025 | HBO | comedy | `C RT 2025 S1 86% / Popcorn 57%` | 1 |
| 186 | The Paper | 2025 | Peacock | mockumentary sitcom | `C RT 2025 S1 85% / Popcorn 71%` | 1 |
| 187 | The Bondsman | 2025 | Prime Video | action horror | `C RT 2025 S1 83% / Popcorn 78%` | 1 |
| 188 | Washington Black | 2025 | Hulu (US/Canada) | period adventure miniseries | `C RT 2025 83% / Popcorn 66%` | 1 |
| 189 | Stick | 2025 | Apple TV+ | sports comedy | `C RT 2025 S1 81% / Popcorn 72%` | 1 |
| 190 | St. Denis Medical | 2024 | NBC | mockumentary sitcom | `C RT 2025 S1 81% / Popcorn 79%` | 1 |
| 191 | Too Much | 2025 | Netflix (US/UK) | romantic comedy | `C RT 2025 S1 79% / Popcorn 57%` | 1 |
| 192 | You | 2018 | Lifetime / Netflix | psychological thriller | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 193 | The Four Seasons | 2025 | Netflix | comedy | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 194 | Your Friends & Neighbors | 2025 | Apple TV+ | drama | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 195 | Wayward | 2025 | Netflix | thriller | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 196 | Ironheart | 2025 | Disney+ | superhero | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 197 | The Hunting Wives | 2025 | Starz / Netflix | thriller | `C RT 2025 list (rank 99-121, score not captured)`; `D Netflix H2 2025 #22 (31.3M)` | 2 |
| 198 | The Morning Show | 2019 | Apple TV+ | drama | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 199 | Grosse Pointe Garden Society | 2025 | NBC | drama | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 200 | The Sandman | 2022 | Netflix (UK-shot) | fantasy | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 201 | Adults | 2025 | FX | comedy | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 202 | Leanne | 2025 | Netflix | sitcom | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 203 | All Her Fault | 2025 | Peacock (UK-produced, US-set) | thriller miniseries | `C RT 2025 list (rank 99-121, score not captured)` | 1 |
| 204 | Somebody Somewhere | 2022 | HBO | comedy-drama | `C RT 2024 S3 100% / Popcorn 94%` | 1 |
| 205 | Girls5eva | 2021 | Peacock / Netflix | musical comedy | `C RT 2024 S3 100% / Popcorn 86%` | 1 |
| 206 | Interview with the Vampire | 2022 | AMC | gothic horror | `C RT 2024 S2 100% / Popcorn 84%` | 1 |
| 207 | English Teacher | 2024 | FX | comedy | `C RT 2024 S1 98% / Popcorn 83%` | 1 |
| 208 | Laid | 2024 | Peacock | comedy | `C RT 2024 S1 93% / Popcorn 74%` | 1 |
| 209 | Fight Night: The Million Dollar Heist | 2024 | Peacock | crime miniseries | `C RT 2024 96% / Popcorn 84%` | 1 |
| 210 | The Diplomat | 2023 | Netflix | political thriller | `C RT 2024 S2 95% / Popcorn 85%` | 1 |
| 211 | Batman: Caped Crusader | 2024 | Prime Video | animated superhero | `C RT 2024 S1 94% / Popcorn 56%` | 1 |
| 212 | Fantasmas | 2024 | HBO | surreal comedy | `C RT 2024 S1 94% / Popcorn 67%` | 1 |
| 213 | We Were the Lucky Ones | 2024 | Hulu | WWII drama miniseries | `C RT 2024 94% / Popcorn 86%` | 1 |
| 214 | Star Wars: Skeleton Crew | 2024 | Disney+ | sci-fi adventure | `C RT 2024 S1 92% / Popcorn 79%` | 1 |
| 215 | Dead Boy Detectives | 2024 | Netflix | supernatural mystery | `C RT 2024 S1 92% / Popcorn 92%` | 1 |
| 216 | Outer Range | 2022 | Prime Video | sci-fi western | `C RT 2024 S2 92% / Popcorn 84%` | 1 |
| 217 | How to Die Alone | 2024 | Hulu | comedy | `C RT 2024 S1 92% / Popcorn 81%` | 1 |
| 218 | Mr. & Mrs. Smith | 2024 | Prime Video | spy dramedy | `C RT 2024 S1 90% / Popcorn 66%` | 1 |
| 219 | Elsbeth | 2024 | CBS | crime procedural | `C RT 2024 S1 92% / Popcorn 72%` | 1 |
| 220 | Hysteria! | 2024 | Peacock | horror comedy | `C RT 2024 S1 92% / Popcorn 86%` | 1 |
| 221 | Sunny | 2024 | Apple TV+ (Japan-set) | dark comedy thriller | `C RT 2024 S1 90% / Popcorn 65%` | 1 |
| 222 | The Sympathizer | 2024 | HBO | spy satire miniseries | `C RT 2024 89% / Popcorn 71%` | 1 |
| 223 | Clipped | 2024 | FX / Hulu | sports drama miniseries | `C RT 2024 88% / Popcorn 60%` | 1 |
| 224 | The Walking Dead: The Ones Who Live | 2024 | AMC | post-apocalyptic drama | `C RT 2024 S1 88% / Popcorn 76%` | 1 |
| 225 | Manhunt | 2024 | Apple TV+ | historical thriller miniseries | `C RT 2024 87% / Popcorn 74%` | 1 |
| 226 | Interior Chinatown | 2024 | Hulu | satirical comedy | `C RT 2024 S1 88% / Popcorn 77%` | 1 |
| 227 | Ripley | 2024 | Netflix | noir thriller miniseries | `C RT 2024 86% / Popcorn 82%` | 1 |
| 228 | Under the Bridge | 2024 | Hulu | true-crime drama miniseries | `C RT 2024 87% / Popcorn 73%` | 1 |
| 229 | Masters of the Air | 2024 | Apple TV+ | WWII miniseries | `C RT 2024 85% / Popcorn 73%` | 1 |
| 230 | Expats | 2024 | Prime Video | drama miniseries | `C RT 2024 84% / Popcorn 51%` | 1 |
| 231 | Agatha All Along | 2024 | Disney+ | superhero fantasy | `C RT 2024 S1 84% / Popcorn 82%` | 1 |
| 232 | The Lord of the Rings: The Rings of Power | 2022 | Prime Video | fantasy | `C RT 2024 S2 85% / Popcorn 58%` | 1 |
| 233 | The Brothers Sun | 2024 | Netflix | action comedy | `C RT 2024 S1 84% / Popcorn 90%` | 1 |
| 234 | Sugar | 2024 | Apple TV+ | neo-noir | `C RT 2024 S1 81% / Popcorn 81%` | 1 |
| 235 | Dark Matter | 2024 | Apple TV+ | sci-fi thriller | `C RT 2024 S1 81% / Popcorn 81%` | 1 |
| 236 | No Good Deed | 2024 | Netflix | dark comedy | `C RT 2024 S1 81% / Popcorn 76%` | 1 |
| 237 | The Sticky | 2024 | Prime Video | crime comedy | `C RT 2024 S1 79% / Popcorn 71%` | 1 |
| 238 | Pachinko | 2022 | Apple TV+ (Korean/Japanese-language) | historical drama | `C RT 2024 S2 97% / Popcorn 96%` | 1 |
| 239 | Grey's Anatomy | 2005 | ABC | medical drama | `D Nielsen 2023 overall #4 38.6B min`; `D Nielsen 2024 overall #2 47.85B min`; `D Nielsen 2025 overall runner-up 40.9B min`; `D Nielsen H1 2026 #4 overall 20.41B min` | 4 |
| 240 | NCIS | 2003 | CBS | procedural | `D Nielsen 2023 overall #2 39.4B min`; `D Nielsen 2024 overall #5 35.91B min` | 2 |
| 241 | The Big Bang Theory | 2007 | CBS | sitcom | `D Nielsen 2023 overall #6 27.8B min`; `D Nielsen 2024 overall #7 29.1B min + most-binged`; `D Nielsen H1 2026 #5 overall 20.40B min` | 3 |
| 242 | Family Guy | 1999 | Fox | adult animated sitcom | `D Nielsen 2024 overall #3 42.44B min`; `D Nielsen H1 2026 #8 overall 15.96B min` | 2 |
| 243 | Bob's Burgers | 2011 | Fox | adult animated sitcom | `D Nielsen 2024 overall #4 36.8B min`; `D Nielsen H1 2026 #9 overall 15.01B min` | 2 |
| 244 | American Dad! | 2005 | Fox / TBS | adult animated sitcom | `D Nielsen 2024 most-binged runner-up`; `D Nielsen 2025 most-binged runner-up` | 2 |
| 245 | Young Sheldon | 2017 | CBS | sitcom | `D Nielsen 2024 overall #6`; `D Netflix H1 2024 106M views across 6 seasons (text, not top-10)` | 2 |
| 246 | Law & Order: Special Victims Unit | 1999 | NBC | procedural | `D Nielsen 2024 overall #8 28.72B min` | 1 |
| 247 | Criminal Minds | 2005 | CBS | procedural | `D Nielsen 2024 overall #9` | 1 |
| 248 | Suits | 2011 | USA | legal drama | `D Nielsen 2023 overall #1 57.7B min (record)` | 1 |
| 249 | Gilmore Girls | 2000 | The WB | dramedy | `D Nielsen 2023 overall #7 25.2B min` | 1 |
| 250 | Supernatural | 2005 | The WB / CW | fantasy horror | `D Nielsen 2023 overall #9-10 tie 22.8B min` | 1 |
| 251 | Little House on the Prairie | 1974 | NBC | family western | `D Nielsen 2024 ARTEY Legacy Award 13.25B min` | 1 |
| 252 | Gunsmoke | 1955 | CBS | western | `D Nielsen 2024 Legacy Award 10.23B min`; `D Nielsen 2025 most-binged title 22.5B min` | 2 |
| 253 | Saturday Night Live | 1975 | NBC | live sketch comedy (borderline scripted) | `E Parrot GDA 2025 most in-demand comedy (winner)` | 1 |

## 4. Excluded on purpose (found in the sources, not US scripted)

- **Non-US scripted**: Sherlock, Black Mirror, Peaky Blinders, Fleabag, Downton Abbey, The Crown, Line of Duty, Adolescence, Fool Me Once, Baby Reindeer, The Gentlemen, One Day, Missing You, Black Doves, Slow Horses, Dept. Q, Doctor Who, Squid Game, Dark, Money Heist/Berlin, Heated Rivalry, Schitt's Creek, Trailer Park Boys, Anne with an E (Canada), Mr Inbetween, Bluey, Apple Cider Vinegar (Australia), Indian/Turkish/Korean/anime entries in IMDb 250, MobLand, Day of the Jackal, A Gentleman in Moscow, My Lady Jane (UK productions).
- **Unscripted / doc / talk / docu-comedy**: Last Week Tonight, Nathan for You, How To with John Wilson, The Rehearsal, The Eric Andre Show, Whose Line Is It Anyway?, Impractical Jokers, Critical Role, The Last Dance, Making a Murderer, The Jinx, Planet Earth/Cosmos-type docs, Love Is Blind, Love Island USA, The Traitors, The Voice, American Nightmare, Gabby's Dollhouse, Ms. Rachel, Mister Rogers' Neighborhood, SpongeBob (kids).
- **Kids animation from IMDb 250** not listed in §3 (Gravity Falls, Batman: TAS, Adventure Time, Over the Garden Wall, Regular Show, Justice League/Unlimited, Young Justice, Samurai Jack, Bugs Bunny Show): US-made but children's; add back if the series wants "family animation".

## 5. What could not be accessed / caveats

- **IMDb**: Groundlane got a JS shell (`js_empty_document`); Firecrawl scrape worked. Ratings are live values on 2026-11-05 and move.
- **RT**: no audience-only "best TV" list exists; the Popcornmeter values come from RT's Certified Fresh guides. RT 2025 ranks ~100–121 (Running Point, Nobody Wants This S2, Landman S2, Sirens, You S5, etc.) appear only in rendered markdown; their scores were not captured (Firecrawl LLM JSON extraction produced inconsistent values past ~#98, so it was discarded). The Pitt S1 is listed on both the 2024 and 2025 RT pages (RT's own placement).
- **Nielsen**: full top-10/top-20 tables are images on nielsen.com; ranks came from Variety / World Screen / THR text. Nielsen 2025 *overall/acquired* top 10 was not retrieved (only #1 Bluey, #2 Grey's). Nielsen H1 2026 top-20 originals list not retrieved beyond the named titles.
- **Netflix H2 2025**: official top-10 graphic is an image; Manila Bulletin fetch failed (browser challenge); ranks 5–10, 12, 22 rely on search snippets (Manila Bulletin, Pop Base on X, IGN). Netflix .xlsx engagement files were not parsed (curl blocked in this session).
- **Netflix all-time**: Groundlane hit OUTPUT_LIMIT on Tudum; Firecrawl succeeded. List counts first-91-day views per season, so Stranger Things / Wednesday / Bridgerton occupy multiple slots.
- **Parrot**: the "2024 edition" was read as the 6th GDA (announced 2024-01-30, data year 2023). GDA lists winners only (plus 2025 finalists); no full ranked demand lists.
