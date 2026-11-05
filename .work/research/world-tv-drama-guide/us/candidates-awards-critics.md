# US TV candidates — awards juries (A) + critics polls / year-end lists (B)

Collected 2026-11-05 for the zh-TW "American TV for Taiwanese adults" series. Raw data only; no curation applied. Scope: American-produced scripted series (live-action + animation). Non-US and unscripted titles that appeared in the sources are listed separately in 2b / 2c so nothing is silently dropped.

**Year conventions**: Emmy tags use the ceremony year (e.g. `Emmy Drama win 2025` = 77th Emmys, Sept 2025). Golden Globe tags also use the **ceremony year** (`GG Drama win 2026` = 83rd Globes, Jan 2026, honouring 2025 TV); Wikipedia labels the same rows by TV year (one year earlier). "Distinct sources" counts these 17 source keys: Emmy Drama, Emmy Comedy, Emmy Limited, Emmy Animated, GG Drama, GG Comedy, GG Limited, BBC2021, NYT2026, Variety2024, Variety2025, Vulture2024, Vulture2025, THR2024, THR2025, CT10-2024, CT10-2025. Several wins/noms inside one award category count as one source.

**Show grouping**: anthologies are merged into one row: `American Crime Story` (People v. O.J. 2016, Versace 2018, Impeachment GG nom 2022), `Monsters` (Dahmer 2023, Menendez 2025), `True Detective` (S1 in BBC/NYT; *Night Country* 2024 awards/lists), `Fargo`, `Feud`, `Genius` (+ *Genius: MLK/X* kept separate because it appeared on its own in Variety 2024), `American Horror Story`.

## 1. Sources

| Source | URL | Read status | What was extracted |
|---|---|---|---|
| Emmy — Outstanding Drama Series (Wikipedia) | https://en.wikipedia.org/wiki/Primetime_Emmy_Award_for_Outstanding_Drama_Series | read (wikitext of 2010s + 2020s sections via `action=raw&section=9/10`) | Winner + every nominee, 2016–2026 |
| Emmy — Outstanding Comedy Series (Wikipedia) | https://en.wikipedia.org/wiki/Primetime_Emmy_Award_for_Outstanding_Comedy_Series | read (wikitext, sections 9/10) | Winner + nominees 2016–2026 |
| Emmy — Outstanding Limited or Anthology Series (Wikipedia) | https://en.wikipedia.org/wiki/Primetime_Emmy_Award_for_Outstanding_Limited_or_Anthology_Series | read (full wikitext) | Winner + nominees 2016–2026 |
| Emmy — Outstanding Animated Program (Wikipedia) | https://en.wikipedia.org/wiki/Primetime_Emmy_Award_for_Outstanding_Animated_Program | read (wikitext, sections 7/8) | Winner + nominees 2016–2026 (nominees included even though only winners were requested) |
| Golden Globe — Best TV Series, Drama (Wikipedia) | https://en.wikipedia.org/wiki/Golden_Globe_Award_for_Best_Television_Series_–_Drama | read (wikitext, sections 6/7) | Winner + nominees, 73rd–83rd ceremonies (2016–2026) |
| Golden Globe — Best TV Series, Musical or Comedy (Wikipedia) | https://en.wikipedia.org/wiki/Golden_Globe_Award_for_Best_Television_Series_–_Musical_or_Comedy | partial: nominee rows read for all years; the **winner cell was cut off** in my extract for the 2016–2020 ceremonies (only 2021–2026 winners visible) | Winners 2016–2020 (Mozart in the Jungle, Atlanta, Mrs. Maisel, Kominsky Method, Fleabag) filled from the known record; they fit the nominee rows. Re-check if exact |
| Golden Globe — Best Limited/Anthology Series or TV Film (Wikipedia) | https://en.wikipedia.org/wiki/Golden_Globe_Award_for_Best_Limited_or_Anthology_Series_or_Television_Film | read (wikitext, sections 6/7) | Winner + nominees 2016–2026 (TV films e.g. *The Dresser* skipped) |
| BBC Culture, 100 greatest TV series of the 21st century (2021) | https://www.bbc.com/culture/article/20211015-the-100-greatest-tv-series-of-the-21st-century | read (full ranked list 1–100) | All 100 ranks; US scripted ones go in the main table |
| NYT, The 100 Best TV Shows of the 21st Century (2026) | https://www.nytimes.com/interactive/2026/arts/television/best-tv-shows-21st-century.html | read: Groundlane fetch hit the byte limit and Firecrawl refused the site; **Tavily extract (advanced) returned the full page text**, ranks 1–100 parsed (35 True Detective and 71 Beef checked by hand) | All 100 ranks (industry poll of 500+ voters) |
| Variety, Best TV Shows of 2025 | https://variety.com/lists/best-tv-shows-2025/ | read (ranked headings of both critics' lists) | Aramide Tinubu top 10, Alison Herman top 10 |
| Variety, Best TV Shows of 2024 | https://variety.com/lists/best-tv-shows-2024/ | read (ranked headings) | Alison Herman top 10, Aramide Tinubu top 10 |
| Vulture, Best TV Shows of 2025 | https://www.vulture.com/article/best-tv-shows-2025-series.html | read (ranked headings) | Hadadi, McHenry, Quah, VanArendonk top 10s + unranked "Other TV highlights" |
| Vulture, Best TV Shows of 2024 | https://www.vulture.com/article/best-tv-shows-new-series-2024.html | read (ranked headings) | Chaney, Hadadi, McHenry, VanArendonk top 10s + "Other highlights" |
| THR, Critics Pick the Best TV of 2025 | https://www.hollywoodreporter.com/lists/best-tv-shows-2025/ | read (ranked headings) | Daniel Fienberg and Angie Han top 10s |
| THR, Best TV Shows of 2024 | https://www.hollywoodreporter.com/tv/tv-reviews/best-tv-shows-of-2024-ranked-1236084765/ (the `/lists/best-tv-shows-2024/` URL is a 404) | read for both top 10s; honorable mentions **partial** (Fienberg's HM list captured whole; Han's HM list cut off after 7 titles) | Fienberg + Han top 10s, honorable mentions |
| CriticsTop10, Best TV Shows of 2025 (critics' list aggregation) | https://criticstop10.com/best-tv-shows-of-2025/ | read (aggregate table, top 25 of 110 compiled lists) | Aggregate rank and list count. Used **instead of Metacritic**: no Metacritic critics-top-10 aggregation page for 2024/2025 could be found |
| CriticsTop10, Best TV Shows of 2024 | https://criticstop10.com/best-tv-shows-of-2024/ | read (aggregate table, ranked titles 1–33; tie ranks only shown for #1–14, so #15–33 are tagged `~#N` by row order) | Aggregate rank |
| Metacritic "20 best new TV shows of 2024/2025" (Metascore ranking) | https://www.metacritic.com/pictures/best-tv-shows-of-2025 | snippet only, **not used** | It ranks shows by Metascore, not by critics' top-10 lists, so it is not the aggregation that was asked for |

## 2. Candidates

Must-check titles: **Game of Thrones** (4 sources), **The Pitt** (7), **Rick and Morty** (2), **Euphoria** (1: Emmy Drama nom 2022 only), **Peacemaker**: *not found in any of the sources above* (no Emmy/GG series nomination, not on BBC/NYT, not on any Variety/Vulture/THR 2025 top 10, not in the CriticsTop10 2025 top 25). If it should be in the series, its evidence has to come from somewhere else.

### 2a. US-produced scripted candidates (259 shows)

Sorted by number of distinct sources (desc), then title. `origin` column flags US co-productions. Metadata columns (first-air year, network, genre) are from general knowledge / the Emmy-GG network column, not separately sourced — verify before publishing.

| # | English title | first-air year | network/platform | genre | origin | evidence tags | distinct sources |
|---|---|---|---|---|---|---|---|
| 1 | Hacks | 2021 | HBO Max | comedy | US | A Emmy Comedy nom 2021; A Emmy Comedy nom 2022; A Emmy Comedy win 2024; A Emmy Comedy nom 2025; A Emmy Comedy nom 2026; A GG Comedy win 2022; A GG Comedy nom 2023; A GG Comedy win 2025; A GG Comedy nom 2026; B NYT2026 #42; B Vulture2024 (other highlights, unranked); B THR2024 (Daniel Fienberg #8); B THR2024 (Han honorable mention, list partially captured); B CT10-2025 agg #14=; B CT10-2024 agg #11 | 7 |
| 2 | The Pitt | 2025 | HBO Max | drama | US | A Emmy Drama win 2025; A Emmy Drama win 2026; A GG Drama win 2026; B NYT2026 #36; B Variety2025 (Aramide Tinubu #2); B Variety2025 (Alison Herman #3); B Vulture2025 (Roxana Hadadi #4); B Vulture2025 (Jackson McHenry #3); B Vulture2025 (Kathryn VanArendonk #1); B THR2025 (Angie Han #2); B CT10-2025 agg #1 | 7 |
| 3 | Shōgun | 2024 | FX/Hulu | drama | US | A Emmy Drama win 2024; A GG Drama win 2025; B NYT2026 #86; B Variety2024 (Alison Herman #2); B Vulture2024 (Jen Chaney #6); B Vulture2024 (Roxana Hadadi #1); B Vulture2024 (Jackson McHenry #4); B Vulture2024 (Kathryn VanArendonk #2); B THR2024 (Daniel Fienberg #6); B THR2024 (Angie Han #10); B CT10-2024 agg #1 | 7 |
| 4 | True Detective | 2014 | HBO | drama/limited (anthology) | US | A Emmy Limited nom 2024; A GG Limited nom 2025; B BBC2021 #31; B NYT2026 #35; B Vulture2024 (Jen Chaney #10); B THR2024 (Angie Han #9); B CT10-2024 agg #10 | 7 |
| 5 | Andor | 2022 | Disney+ | drama | US | A Emmy Drama nom 2023; A Emmy Drama nom 2025; B NYT2026 #32; B Variety2025 (Alison Herman #1); B Vulture2025 (Roxana Hadadi #1); B Vulture2025 (Jackson McHenry #2); B Vulture2025 (Nicholas Quah #1); B Vulture2025 (Kathryn VanArendonk #2); B THR2025 (Daniel Fienberg #2); B THR2025 (Angie Han #1); B CT10-2025 agg #4 | 6 |
| 6 | The Bear | 2022 | FX/Hulu | comedy | US | A Emmy Comedy win 2023; A Emmy Comedy nom 2024; A Emmy Comedy nom 2025; A Emmy Comedy nom 2026; A GG Comedy nom 2023; A GG Comedy win 2024; A GG Comedy nom 2025; A GG Comedy nom 2026; B NYT2026 #74; B Vulture2025 (other highlights, unranked); B THR2024 (Fienberg honorable mention); B CT10-2024 agg ~#17 | 6 |
| 7 | Pluribus | 2025 | Apple TV | drama | US | A Emmy Drama nom 2026; A GG Drama nom 2026; B Variety2025 (Alison Herman #9); B Vulture2025 (Jackson McHenry #4); B Vulture2025 (Nicholas Quah #5); B Vulture2025 (Kathryn VanArendonk #4); B THR2025 (Daniel Fienberg #7); B THR2025 (Angie Han #6); B CT10-2025 agg #3 | 6 |
| 8 | The Studio | 2025 | Apple TV+ | comedy | US | A Emmy Comedy win 2025; A GG Comedy win 2026; B Variety2025 (Alison Herman #10); B Vulture2025 (other highlights, unranked); B THR2025 (Angie Han #5); B CT10-2025 agg #5 | 6 |
| 9 | The White Lotus | 2021 | HBO | drama (anthology; Emmy limited 2022, drama 2023+) | US | A Emmy Drama nom 2023; A Emmy Drama nom 2025; A Emmy Limited win 2022; A GG Drama nom 2026; A GG Limited win 2023; B NYT2026 #21; B CT10-2025 agg #18= | 6 |
| 10 | Abbott Elementary | 2021 | ABC | comedy | US | A Emmy Comedy nom 2022; A Emmy Comedy nom 2023; A Emmy Comedy nom 2024; A Emmy Comedy nom 2025; A Emmy Comedy nom 2026; A GG Comedy win 2023; A GG Comedy nom 2024; A GG Comedy nom 2025; A GG Comedy nom 2026; B Vulture2025 (other highlights, unranked); B Vulture2024 (other highlights, unranked); B CT10-2024 agg ~#22 | 5 |
| 11 | Dying for Sex | 2025 | FX on Hulu | limited | US | A Emmy Limited nom 2025; A GG Limited nom 2026; B Variety2025 (Alison Herman #4); B Vulture2025 (Kathryn VanArendonk #6); B CT10-2025 agg #9 | 5 |
| 12 | Ripley | 2024 | Netflix | limited | US | A Emmy Limited nom 2024; A GG Limited nom 2025; B Vulture2024 (Jen Chaney #2); B Vulture2024 (Roxana Hadadi #2); B Vulture2024 (Kathryn VanArendonk #7); B THR2024 (Daniel Fienberg #2); B THR2024 (Angie Han #4); B CT10-2024 agg #6 | 5 |
| 13 | Severance | 2022 | Apple TV+ | drama | US | A Emmy Drama nom 2022; A Emmy Drama nom 2025; A GG Drama nom 2023; A GG Drama nom 2026; B NYT2026 #30; B Vulture2025 (other highlights, unranked); B CT10-2025 agg #6 | 5 |
| 14 | Somebody Somewhere | 2022 | HBO | comedy | US | B NYT2026 #76; B Variety2024 (Alison Herman #1); B Variety2024 (Aramide Tinubu #2); B Vulture2024 (Jen Chaney #1); B Vulture2024 (Jackson McHenry #2); B Vulture2024 (Kathryn VanArendonk #1); B THR2024 (Angie Han #1); B THR2024 (Fienberg honorable mention); B CT10-2024 agg #13 | 5 |
| 15 | The Americans | 2013 | FX | drama | US | A Emmy Drama nom 2016; A Emmy Drama nom 2018; A GG Drama win 2019; B BBC2021 #8; B NYT2026 #17 | 4 |
| 16 | Atlanta | 2016 | FX | comedy | US | A Emmy Comedy nom 2017; A Emmy Comedy nom 2018; A GG Comedy win 2017; B BBC2021 #14; B NYT2026 #10 | 4 |
| 17 | Better Call Saul | 2015 | AMC | drama | US | A Emmy Drama nom 2016; A Emmy Drama nom 2017; A Emmy Drama nom 2019; A Emmy Drama nom 2020; A Emmy Drama nom 2022; A Emmy Drama nom 2023; A GG Drama nom 2023; B BBC2021 #23; B NYT2026 #27 | 4 |
| 18 | Big Little Lies | 2017 | HBO | limited→drama | US | A Emmy Limited win 2017; A GG Drama nom 2020; A GG Limited win 2018; B BBC2021 #82 | 4 |
| 19 | Chernobyl | 2019 | HBO (with Sky) | limited | US/UK co | A Emmy Limited win 2019; A GG Limited win 2020; B BBC2021 #15; B NYT2026 #19 | 4 |
| 20 | Common Side Effects | 2025 | Adult Swim | animation (adult) | US | A Emmy Animated nom 2025; B Vulture2025 (Roxana Hadadi #2); B THR2025 (Angie Han #4); B CT10-2025 agg #18= | 4 |
| 21 | The Diplomat | 2023 | Netflix | drama | US | A Emmy Drama nom 2025; A Emmy Drama nom 2026; A GG Drama nom 2024; A GG Drama nom 2025; A GG Drama nom 2026; B NYT2026 #94; B CT10-2025 agg #23= | 4 |
| 22 | English Teacher | 2024 | FX | comedy | US | B Vulture2025 (other highlights, unranked); B Vulture2024 (Jackson McHenry #7); B THR2024 (Fienberg honorable mention); B THR2024 (Han honorable mention, list partially captured); B CT10-2024 agg #4 | 4 |
| 23 | Fargo | 2014 | FX | limited (anthology) | US | A Emmy Limited nom 2016; A Emmy Limited nom 2017; A Emmy Limited nom 2024; A GG Limited nom 2016; A GG Limited nom 2018; A GG Limited nom 2024; B BBC2021 #35; B Vulture2024 (other highlights, unranked) | 4 |
| 24 | Game of Thrones | 2011 | HBO | drama | US | A Emmy Drama win 2016; A Emmy Drama win 2018; A Emmy Drama win 2019; A GG Drama nom 2016; A GG Drama nom 2017; A GG Drama nom 2018; B BBC2021 #5; B NYT2026 #6 | 4 |
| 25 | The Gilded Age | 2022 | HBO | drama | US | A Emmy Drama nom 2024; A Emmy Drama nom 2026; B Variety2025 (Aramide Tinubu #9); B Variety2025 (Alison Herman #8); B Vulture2025 (Jackson McHenry #8); B Vulture2025 (Nicholas Quah #6); B Vulture2025 (Kathryn VanArendonk #7); B CT10-2025 agg #18= | 4 |
| 26 | The Good Place | 2016 | NBC | comedy | US | A Emmy Comedy nom 2019; A Emmy Comedy nom 2020; A GG Comedy nom 2019; B BBC2021 #62=; B NYT2026 #51 | 4 |
| 27 | The Handmaid's Tale | 2017 | Hulu | drama | US | A Emmy Drama win 2017; A Emmy Drama nom 2018; A Emmy Drama nom 2020; A Emmy Drama nom 2021; A GG Drama win 2018; B BBC2021 #38; B NYT2026 #67 | 4 |
| 28 | Industry | 2020 | HBO (with BBC) | drama | US/UK co | B Variety2024 (Alison Herman #3); B Vulture2024 (Roxana Hadadi #8); B Vulture2024 (Jackson McHenry #1); B Vulture2024 (Kathryn VanArendonk #4); B THR2024 (Han honorable mention, list partially captured); B CT10-2024 agg #3 | 4 |
| 29 | Interview with the Vampire | 2022 | AMC | drama | US | B Variety2024 (Alison Herman #9); B Vulture2024 (Roxana Hadadi #3); B Vulture2024 (Jackson McHenry #3); B THR2024 (Angie Han #5); B CT10-2024 agg #8= | 4 |
| 30 | The Lowdown | 2025 | FX | drama | US | B Variety2025 (Alison Herman #7); B Vulture2025 (Nicholas Quah #7); B Vulture2025 (Kathryn VanArendonk #3); B THR2025 (Daniel Fienberg #6); B CT10-2025 agg #7 | 4 |
| 31 | Mare of Easttown | 2021 | HBO | limited | US | A Emmy Limited nom 2021; A GG Limited nom 2022; B BBC2021 #66; B NYT2026 #65 | 4 |
| 32 | Mr. & Mrs. Smith | 2024 | Prime Video | drama | US | A Emmy Drama nom 2024; A GG Drama nom 2025; B THR2024 (Fienberg honorable mention); B CT10-2024 agg #7 | 4 |
| 33 | The Penguin | 2024 | HBO | limited | US | A Emmy Limited nom 2025; A GG Limited nom 2025; B Variety2024 (Aramide Tinubu #1); B CT10-2024 agg #5 | 4 |
| 34 | The Queen's Gambit | 2020 | Netflix | limited | US | A Emmy Limited win 2021; A GG Limited win 2021; B BBC2021 #100; B NYT2026 #81 | 4 |
| 35 | Stranger Things | 2016 | Netflix | drama | US | A Emmy Drama nom 2017; A Emmy Drama nom 2018; A Emmy Drama nom 2020; A Emmy Drama nom 2022; A GG Drama nom 2017; A GG Drama nom 2018; B BBC2021 #68; B NYT2026 #53 | 4 |
| 36 | Succession | 2018 | HBO | drama | US | A Emmy Drama nom 2019; A Emmy Drama win 2020; A Emmy Drama win 2022; A Emmy Drama win 2023; A GG Drama win 2020; A GG Drama win 2022; A GG Drama win 2024; B BBC2021 #10; B NYT2026 #4 | 4 |
| 37 | Veep | 2012 | HBO | comedy | US | A Emmy Comedy win 2016; A Emmy Comedy win 2017; A Emmy Comedy nom 2019; A GG Comedy nom 2016; A GG Comedy nom 2017; B BBC2021 #24; B NYT2026 #7 | 4 |
| 38 | A Man on the Inside | 2024 | Netflix | comedy | US | B Variety2024 (Aramide Tinubu #10); B THR2024 (Fienberg honorable mention); B CT10-2024 agg ~#21 | 3 |
| 39 | American Crime Story | 2016 | FX | limited (anthology) | US | A Emmy Limited win 2016; A Emmy Limited win 2018; A GG Limited win 2017; A GG Limited win 2019; A GG Limited nom 2022; B BBC2021 #77 | 3 |
| 40 | Barry | 2018 | HBO | comedy | US | A Emmy Comedy nom 2018; A Emmy Comedy nom 2019; A Emmy Comedy nom 2022; A Emmy Comedy nom 2023; A GG Comedy nom 2019; A GG Comedy nom 2020; A GG Comedy nom 2024; B NYT2026 #73 | 3 |
| 41 | Beef | 2023 | Netflix | limited (anthology) | US | A Emmy Limited win 2023; A Emmy Limited nom 2026; A GG Limited win 2024; B NYT2026 #71 | 3 |
| 42 | BoJack Horseman | 2014 | Netflix | animation (adult) | US | A Emmy Animated nom 2019; A Emmy Animated nom 2020; B BBC2021 #11; B NYT2026 #44 | 3 |
| 43 | The Chair Company | 2025 | HBO | comedy | US | B Vulture2025 (Nicholas Quah #8); B THR2025 (Angie Han #7); B CT10-2025 agg #10 | 3 |
| 44 | Curb Your Enthusiasm | 2000 | HBO | comedy | US | A Emmy Comedy nom 2018; A Emmy Comedy nom 2020; A Emmy Comedy nom 2022; A Emmy Comedy nom 2024; B BBC2021 #21; B NYT2026 #9 | 3 |
| 45 | Elsbeth | 2024 | CBS | drama (procedural comedy-drama) | US | B Variety2024 (Alison Herman #8); B Vulture2025 (Jackson McHenry #7); B Vulture2024 (Jackson McHenry #5) | 3 |
| 46 | Evil | 2019 | CBS→Paramount+ | drama | US | B Vulture2024 (Jen Chaney #3); B Vulture2024 (Kathryn VanArendonk #8); B THR2024 (Daniel Fienberg #9); B CT10-2024 agg ~#25 | 3 |
| 47 | Fantasmas | 2024 | HBO | comedy | US | B Vulture2024 (Jen Chaney #9); B Vulture2024 (Jackson McHenry #8); B THR2024 (Daniel Fienberg #3); B THR2024 (Angie Han #3); B CT10-2024 agg #12 | 3 |
| 48 | Homeland | 2011 | Showtime | drama | US | A Emmy Drama nom 2016; B BBC2021 #46; B NYT2026 #38 | 3 |
| 49 | House of Cards | 2013 | Netflix | drama | US | A Emmy Drama nom 2016; A Emmy Drama nom 2017; B BBC2021 #60; B NYT2026 #48 | 3 |
| 50 | Insecure | 2016 | HBO | comedy | US | A Emmy Comedy nom 2020; B BBC2021 #83; B NYT2026 #55 | 3 |
| 51 | It's Always Sunny in Philadelphia | 2005 | FX/FXX | comedy | US | B BBC2021 #90; B NYT2026 #78; B Vulture2025 (other highlights, unranked) | 3 |
| 52 | Long Story Short | 2025 | Netflix | animation (adult) | US | B Variety2025 (Alison Herman #2); B THR2025 (Daniel Fienberg #5); B THR2025 (Angie Han #3); B CT10-2025 agg #13 | 3 |
| 53 | The Morning Show | 2019 | Apple TV+ | drama | US | A Emmy Drama nom 2024; A GG Drama nom 2020; A GG Drama nom 2022; A GG Drama nom 2024; B Vulture2025 (Jackson McHenry #9) | 3 |
| 54 | The Night Of | 2016 | HBO | limited | US | A Emmy Limited nom 2017; A GG Limited nom 2017; B NYT2026 #92 | 3 |
| 55 | Nobody Wants This | 2024 | Netflix | comedy | US | A Emmy Comedy nom 2025; A Emmy Comedy nom 2026; A GG Comedy nom 2025; A GG Comedy nom 2026; B CT10-2024 agg #14 | 3 |
| 56 | Ozark | 2017 | Netflix | drama | US | A Emmy Drama nom 2019; A Emmy Drama nom 2020; A Emmy Drama nom 2022; A GG Drama nom 2021; A GG Drama nom 2023; B NYT2026 #68 | 3 |
| 57 | Paradise | 2025 | Hulu | drama | US | A Emmy Drama nom 2025; A Emmy Drama nom 2026; B Variety2025 (Aramide Tinubu #4); B CT10-2025 agg #16 | 3 |
| 58 | Pose | 2018 | FX | drama | US | A Emmy Drama nom 2019; A Emmy Drama nom 2021; A GG Drama nom 2019; A GG Drama nom 2022; B BBC2021 #62= | 3 |
| 59 | Reservation Dogs | 2021 | FX/Hulu | comedy | US | A Emmy Comedy nom 2024; A GG Comedy nom 2022; B NYT2026 #87 | 3 |
| 60 | Say Nothing | 2024 | FX/Hulu | limited | US | B Variety2024 (Alison Herman #7); B Vulture2024 (Jackson McHenry #10); B CT10-2024 agg ~#15 | 3 |
| 61 | Shrinking | 2023 | Apple TV+ | comedy | US | A Emmy Comedy nom 2025; A Emmy Comedy nom 2026; B THR2024 (Daniel Fienberg #7); B CT10-2024 agg ~#23 | 3 |
| 62 | Ted Lasso | 2020 | Apple TV+ | comedy | US | A Emmy Comedy win 2021; A Emmy Comedy win 2022; A Emmy Comedy nom 2023; A GG Comedy nom 2021; A GG Comedy nom 2022; A GG Comedy nom 2024; B NYT2026 #75 | 3 |
| 63 | The Underground Railroad | 2021 | Prime Video | limited | US | A Emmy Limited nom 2021; A GG Limited win 2022; B BBC2021 #59 | 3 |
| 64 | Watchmen | 2019 | HBO | limited | US | A Emmy Limited win 2020; B BBC2021 #26; B NYT2026 #39 | 3 |
| 65 | Westworld | 2016 | HBO | drama | US | A Emmy Drama nom 2017; A Emmy Drama nom 2018; A GG Drama nom 2017; B BBC2021 #91 | 3 |
| 66 | What We Do in the Shadows | 2019 | FX | comedy | US | A Emmy Comedy nom 2020; A Emmy Comedy nom 2022; A Emmy Comedy nom 2024; A Emmy Comedy nom 2025; B THR2024 (Fienberg honorable mention); B CT10-2024 agg ~#26 | 3 |
| 67 | X-Men '97 | 2024 | Disney+ | animation | US | A Emmy Animated nom 2024; B Vulture2024 (Roxana Hadadi #7); B CT10-2024 agg ~#18 | 3 |
| 68 | 3 Body Problem | 2024 | Netflix | drama | US | A Emmy Drama nom 2024; B Vulture2024 (other highlights, unranked) | 2 |
| 69 | 30 Rock | 2006 | NBC | comedy | US | B BBC2021 #17; B NYT2026 #8 | 2 |
| 70 | The Alienist | 2018 | TNT | limited | US | A Emmy Limited nom 2018; A GG Limited nom 2019 | 2 |
| 71 | All Her Fault | 2025 | Peacock | limited | US | A Emmy Limited nom 2026; A GG Limited nom 2026 | 2 |
| 72 | American Crime | 2015 | ABC | limited (anthology) | US | A Emmy Limited nom 2016; A GG Limited nom 2016; A GG Limited nom 2017 | 2 |
| 73 | Arcane | 2021 | Netflix | animation (adult) | US/France co (Riot Games + Fortiche) | A Emmy Animated win 2022; A Emmy Animated win 2025; B CT10-2024 agg ~#27 | 2 |
| 74 | Arrested Development | 2003 | Fox→Netflix | comedy | US | B BBC2021 #32; B NYT2026 #12 | 2 |
| 75 | Band of Brothers | 2001 | HBO | limited | US/UK co | B BBC2021 #36=; B NYT2026 #28 | 2 |
| 76 | Battlestar Galactica | 2004 | Sci Fi | drama | US | B BBC2021 #70; B NYT2026 #37 | 2 |
| 77 | The Beast in Me | 2025 | Netflix | limited | US | A Emmy Limited nom 2026; A GG Limited nom 2026 | 2 |
| 78 | Black-ish | 2014 | ABC | comedy | US | A Emmy Comedy nom 2016; A Emmy Comedy nom 2017; A Emmy Comedy nom 2018; A Emmy Comedy nom 2021; A GG Comedy nom 2017; A GG Comedy nom 2018 | 2 |
| 79 | Breaking Bad | 2008 | AMC | drama | US | B BBC2021 #3; B NYT2026 #1 | 2 |
| 80 | The Comeback | 2005 | HBO | comedy | US | B BBC2021 #87; B NYT2026 #23 | 2 |
| 81 | Community | 2009 | NBC | comedy | US | B BBC2021 #44; B NYT2026 #97 | 2 |
| 82 | Daisy Jones & the Six | 2023 | Prime Video | limited | US | A Emmy Limited nom 2023; A GG Limited nom 2024 | 2 |
| 83 | Deadwood | 2004 | HBO | drama | US | B BBC2021 #18; B NYT2026 #24 | 2 |
| 84 | Death by Lightning | 2025 | Netflix | limited | US | B Vulture2025 (Roxana Hadadi #9); B Vulture2025 (Jackson McHenry #5); B Vulture2025 (Kathryn VanArendonk #8); B CT10-2025 agg #14= | 2 |
| 85 | Dexter | 2006 | Showtime | drama | US | B BBC2021 #89; B NYT2026 #88 | 2 |
| 86 | Disclaimer | 2024 | Apple TV+ | limited | US | A GG Limited nom 2025; B CT10-2024 agg ~#31 | 2 |
| 87 | Dopesick | 2021 | Hulu | limited | US | A Emmy Limited nom 2022; A GG Limited nom 2022 | 2 |
| 88 | The Dropout | 2022 | Hulu | limited | US | A Emmy Limited nom 2022; A GG Limited nom 2023 | 2 |
| 89 | Emily in Paris | 2020 | Netflix | comedy | US | A Emmy Comedy nom 2021; A GG Comedy nom 2021 | 2 |
| 90 | Enlightened | 2011 | HBO | comedy-drama | US | B BBC2021 #71; B NYT2026 #33 | 2 |
| 91 | Escape at Dannemora | 2018 | Showtime | limited | US | A Emmy Limited nom 2019; A GG Limited nom 2019 | 2 |
| 92 | Fallout | 2024 | Prime Video | drama | US | A Emmy Drama nom 2024; B CT10-2024 agg #8= | 2 |
| 93 | Feud | 2017 | FX | limited (anthology) | US | A Emmy Limited nom 2017; A GG Limited nom 2018 | 2 |
| 94 | The Flight Attendant | 2020 | HBO Max | comedy | US | A Emmy Comedy nom 2021; A GG Comedy nom 2021 | 2 |
| 95 | Fosse/Verdon | 2019 | FX | limited | US | A Emmy Limited nom 2019; A GG Limited nom 2020 | 2 |
| 96 | Friday Night Lights | 2006 | NBC | drama | US | B BBC2021 #28; B NYT2026 #14 | 2 |
| 97 | Gilmore Girls | 2000 | The WB | drama | US | B BBC2021 #72; B NYT2026 #99 | 2 |
| 98 | Girls | 2012 | HBO | comedy | US | B BBC2021 #30; B NYT2026 #13 | 2 |
| 99 | Girls5eva | 2021 | Peacock→Netflix | comedy | US | B Vulture2024 (Jen Chaney #5); B Vulture2024 (Jackson McHenry #6); B CT10-2024 agg ~#32 | 2 |
| 100 | The Good Wife | 2009 | CBS | drama | US | B BBC2021 #33; B NYT2026 #79 | 2 |
| 101 | Halt and Catch Fire | 2014 | AMC | drama | US | B BBC2021 #50; B NYT2026 #96 | 2 |
| 102 | House | 2004 | Fox | drama | US | B BBC2021 #80; B NYT2026 #95 | 2 |
| 103 | House of the Dragon | 2022 | HBO | drama | US | A Emmy Drama nom 2023; A GG Drama win 2023 | 2 |
| 104 | I Love LA | 2025 | HBO | comedy | US | B Vulture2025 (Nicholas Quah #10); B CT10-2025 agg #25 | 2 |
| 105 | It: Welcome to Derry | 2025 | HBO | drama | US | B Variety2025 (Aramide Tinubu #5); B CT10-2025 agg #23= | 2 |
| 106 | Jury Duty | 2023 | Amazon Freevee | comedy (scripted-around-real-juror hybrid) | US | A Emmy Comedy nom 2023; A GG Comedy nom 2024 | 2 |
| 107 | The Kominsky Method | 2018 | Netflix | comedy | US | A Emmy Comedy nom 2020; A Emmy Comedy nom 2021; A GG Comedy win 2019; A GG Comedy nom 2020 | 2 |
| 108 | The Last of Us | 2023 | HBO | drama | US | A Emmy Drama nom 2023; A Emmy Drama nom 2025; A GG Drama nom 2024 | 2 |
| 109 | The Leftovers | 2014 | HBO | drama | US | B BBC2021 #7; B NYT2026 #25 | 2 |
| 110 | Lessons in Chemistry | 2023 | Apple TV+ | limited | US | A Emmy Limited nom 2024; A GG Limited nom 2024 | 2 |
| 111 | Lost | 2004 | ABC | drama | US | B BBC2021 #19; B NYT2026 #22 | 2 |
| 112 | Louie | 2010 | FX | comedy | US | B BBC2021 #94; B NYT2026 #41 | 2 |
| 113 | Lovecraft Country | 2020 | HBO | drama | US | A Emmy Drama nom 2021; A GG Drama nom 2021 | 2 |
| 114 | Mad Men | 2007 | AMC | drama | US | B BBC2021 #2; B NYT2026 #3 | 2 |
| 115 | The Mandalorian | 2019 | Disney+ | drama | US | A Emmy Drama nom 2020; A Emmy Drama nom 2021; A GG Drama nom 2021 | 2 |
| 116 | The Marvelous Mrs. Maisel | 2017 | Prime Video | comedy | US | A Emmy Comedy win 2018; A Emmy Comedy nom 2019; A Emmy Comedy nom 2020; A Emmy Comedy nom 2022; A Emmy Comedy nom 2023; A GG Comedy win 2018; A GG Comedy nom 2019; A GG Comedy nom 2020 | 2 |
| 117 | Master of None | 2015 | Netflix | comedy | US | A Emmy Comedy nom 2016; A Emmy Comedy nom 2017; A GG Comedy nom 2018 | 2 |
| 118 | Modern Family | 2009 | ABC | comedy | US | A Emmy Comedy nom 2016; A Emmy Comedy nom 2017; B NYT2026 #77 | 2 |
| 119 | Monsters | 2022 | Netflix | limited (anthology) | US | A Emmy Limited nom 2023; A Emmy Limited nom 2025; A GG Limited nom 2023; A GG Limited nom 2025 | 2 |
| 120 | Mr. Robot | 2015 | USA Network | drama | US | A Emmy Drama nom 2016; A GG Drama win 2016 | 2 |
| 121 | Narcos | 2015 | Netflix | drama | US | A GG Drama nom 2016; B BBC2021 #84= | 2 |
| 122 | The OA | 2016 | Netflix | drama | US | B BBC2021 #88; B NYT2026 #98 | 2 |
| 123 | The Office (US) | 2005 | NBC | comedy | US | B BBC2021 #39; B NYT2026 #11 | 2 |
| 124 | Only Murders in the Building | 2021 | Hulu | comedy | US | A Emmy Comedy nom 2022; A Emmy Comedy nom 2023; A Emmy Comedy nom 2024; A Emmy Comedy nom 2025; A Emmy Comedy nom 2026; A GG Comedy nom 2022; A GG Comedy nom 2023; A GG Comedy nom 2024; A GG Comedy nom 2025; A GG Comedy nom 2026 | 2 |
| 125 | Orange Is the New Black | 2013 | Netflix | comedy-drama | US | A GG Comedy nom 2016; B BBC2021 #65 | 2 |
| 126 | Pam & Tommy | 2022 | Hulu | limited | US | A Emmy Limited nom 2022; A GG Limited nom 2023 | 2 |
| 127 | Parks and Recreation | 2009 | NBC | comedy | US | B BBC2021 #29; B NYT2026 #50 | 2 |
| 128 | PEN15 | 2019 | Hulu | comedy | US | A Emmy Comedy nom 2021; B NYT2026 #59 | 2 |
| 129 | Rick and Morty | 2013 | Adult Swim | animation (adult) | US | A Emmy Animated win 2018; A Emmy Animated win 2020; A Emmy Animated nom 2022; A Emmy Animated nom 2023; A Emmy Animated nom 2026; B BBC2021 #76 | 2 |
| 130 | The Righteous Gemstones | 2019 | HBO | comedy | US | B Variety2025 (Alison Herman #5); B Vulture2025 (Roxana Hadadi #8) | 2 |
| 131 | Sharp Objects | 2018 | HBO | limited | US | A Emmy Limited nom 2019; A GG Limited nom 2019 | 2 |
| 132 | The Shield | 2002 | FX | drama | US | B BBC2021 #55; B NYT2026 #70 | 2 |
| 133 | Silicon Valley | 2014 | HBO | comedy | US | A Emmy Comedy nom 2016; A Emmy Comedy nom 2017; A Emmy Comedy nom 2018; A GG Comedy nom 2016 | 2 |
| 134 | Six Feet Under | 2001 | HBO | drama | US | B BBC2021 #12; B NYT2026 #15 | 2 |
| 135 | This Is Us | 2016 | NBC | drama | US | A Emmy Drama nom 2017; A Emmy Drama nom 2018; A Emmy Drama nom 2019; A Emmy Drama nom 2021; A GG Drama nom 2017; A GG Drama nom 2018 | 2 |
| 136 | Tokyo Vice | 2022 | Max | drama | US | B Variety2024 (Alison Herman #4); B Vulture2024 (Roxana Hadadi #5) | 2 |
| 137 | Transparent | 2014 | Prime Video | comedy | US | A Emmy Comedy nom 2016; A GG Comedy nom 2016; A GG Comedy nom 2017 | 2 |
| 138 | Twin Peaks: The Return | 2017 | Showtime | limited | US | B BBC2021 #13; B NYT2026 #47 | 2 |
| 139 | Unbelievable | 2019 | Netflix | limited | US | A Emmy Limited nom 2020; A GG Limited nom 2020 | 2 |
| 140 | Wednesday | 2022 | Netflix | comedy | US | A Emmy Comedy nom 2023; A GG Comedy nom 2023 | 2 |
| 141 | The Wire | 2002 | HBO | drama | US | B BBC2021 #1; B NYT2026 #2 | 2 |
| 142 | #1 Happy Family USA | 2025 | Prime Video | animation (adult) | US | B Vulture2025 (other highlights, unranked) | 1 |
| 143 | 1923 | 2022 | Paramount+ | drama | US | A GG Drama nom 2024 | 1 |
| 144 | 24 | 2001 | Fox | drama | US | B BBC2021 #69 | 1 |
| 145 | A Knight of the Seven Kingdoms | 2026 | HBO | drama | US | A Emmy Drama nom 2026 | 1 |
| 146 | The Acolyte | 2024 | Disney+ | drama | US | B Vulture2024 (Roxana Hadadi #6); B Vulture2024 (Jackson McHenry #9) | 1 |
| 147 | Adults | 2025 | FX | comedy | US | B Vulture2025 (Jackson McHenry #6) | 1 |
| 148 | Adventure Time | 2010 | Cartoon Network | animation (all-ages) | US | A Emmy Animated nom 2019 | 1 |
| 149 | Agatha All Along | 2024 | Disney+ | limited | US | B CT10-2024 agg ~#19 | 1 |
| 150 | Alien: Earth | 2025 | FX/Hulu | drama | US | B CT10-2025 agg #12 | 1 |
| 151 | All the Light We Cannot See | 2023 | Netflix | limited | US | A GG Limited nom 2024 | 1 |
| 152 | American Horror Story | 2011 | FX | limited (anthology) | US | A GG Limited nom 2016 | 1 |
| 153 | American Primeval | 2025 | Netflix | limited | US | B Vulture2025 (other highlights, unranked) | 1 |
| 154 | Archer | 2009 | FX/FXX | animation (adult) | US | A Emmy Animated win 2016; A Emmy Animated nom 2017 | 1 |
| 155 | Avatar: The Last Airbender | 2005 | Nickelodeon | animation (kids/family) | US | B BBC2021 #61 | 1 |
| 156 | Bad Monkey | 2024 | Apple TV+ | drama | US | B Vulture2024 (Jen Chaney #8) | 1 |
| 157 | Better Things | 2016 | FX | comedy | US | B NYT2026 #82 | 1 |
| 158 | The Big Bang Theory | 2007 | CBS | comedy | US | B BBC2021 #56 | 1 |
| 159 | Big Hero 6: The Series | 2017 | Disney XD | animation (kids/family) | US | A Emmy Animated nom 2018 | 1 |
| 160 | Big Mouth | 2017 | Netflix | animation (adult) | US | A Emmy Animated nom 2019; A Emmy Animated nom 2020; A Emmy Animated nom 2021 | 1 |
| 161 | Black Bird | 2022 | Apple TV+ | limited | US | A GG Limited nom 2023 | 1 |
| 162 | Black Rabbit | 2025 | Netflix | limited | US | B Vulture2025 (Roxana Hadadi #6) | 1 |
| 163 | Blue Eye Samurai | 2023 | Netflix | animation (adult) | US | A Emmy Animated win 2024 | 1 |
| 164 | Bob's Burgers | 2011 | Fox | animation (adult) | US | A Emmy Animated nom 2016; A Emmy Animated win 2017; A Emmy Animated nom 2018; A Emmy Animated nom 2019; A Emmy Animated nom 2020; A Emmy Animated nom 2021; A Emmy Animated nom 2022; A Emmy Animated nom 2023; A Emmy Animated nom 2024; A Emmy Animated nom 2025; A Emmy Animated nom 2026 | 1 |
| 165 | The Boys | 2019 | Prime Video | drama | US | A Emmy Drama nom 2021 | 1 |
| 166 | Bridgerton | 2020 | Netflix | drama | US | A Emmy Drama nom 2021 | 1 |
| 167 | Broad City | 2014 | Comedy Central | comedy | US | B NYT2026 #46 | 1 |
| 168 | Casual | 2015 | Hulu | comedy | US | A GG Comedy nom 2016 | 1 |
| 169 | Catch-22 | 2019 | Hulu | limited | US | A GG Limited nom 2020 | 1 |
| 170 | Chappelle's Show | 2003 | Comedy Central | comedy (sketch) | US | B NYT2026 #58 | 1 |
| 171 | Chief of War | 2025 | Apple TV | limited | US | B Vulture2025 (other highlights, unranked) | 1 |
| 172 | Cobra Kai | 2018 | YouTube Red→Netflix | comedy | US | A Emmy Comedy nom 2021 | 1 |
| 173 | Crazy Ex-Girlfriend | 2015 | The CW | comedy | US | B BBC2021 #98 | 1 |
| 174 | Dead to Me | 2019 | Netflix | comedy | US | A Emmy Comedy nom 2020 | 1 |
| 175 | The Decameron | 2024 | Netflix | comedy | US | B Vulture2024 (Kathryn VanArendonk #6) | 1 |
| 176 | Dexter: Resurrection | 2025 | Paramount+ with Showtime | drama | US | B Vulture2025 (other highlights, unranked) | 1 |
| 177 | DTF St. Louis | 2026 | HBO | limited | US | A Emmy Limited win 2026 | 1 |
| 178 | Eastbound & Down | 2009 | HBO | comedy | US | B NYT2026 #90 | 1 |
| 179 | Empire | 2015 | Fox | drama | US | A GG Drama nom 2016 | 1 |
| 180 | Euphoria | 2019 | HBO | drama | US | A Emmy Drama nom 2022 | 1 |
| 181 | Expats | 2024 | Prime Video | limited | US | B THR2024 (Han honorable mention, list partially captured) | 1 |
| 182 | Fellow Travelers | 2023 | Showtime | limited | US | A GG Limited nom 2024 | 1 |
| 183 | Fleishman Is in Trouble | 2022 | FX on Hulu | limited | US | A Emmy Limited nom 2023 | 1 |
| 184 | Flesh and Bone | 2015 | Starz | limited | US | A GG Limited nom 2016 | 1 |
| 185 | Forever | 2025 | Netflix | drama | US | B Variety2025 (Aramide Tinubu #3) | 1 |
| 186 | Genius | 2017 | National Geographic | limited (anthology) | US | A Emmy Limited nom 2017; A Emmy Limited nom 2018 | 1 |
| 187 | Genius: MLK/X | 2024 | National Geographic | limited (Genius anthology) | US | B Variety2024 (Aramide Tinubu #9) | 1 |
| 188 | GLOW | 2017 | Netflix | comedy | US | A Emmy Comedy nom 2018 | 1 |
| 189 | Godless | 2017 | Netflix | limited | US | A Emmy Limited nom 2018 | 1 |
| 190 | The Good Fight | 2017 | CBS All Access/Paramount+ | drama | US | B BBC2021 #45 | 1 |
| 191 | The Great | 2020 | Hulu | comedy | US/UK co | A GG Comedy nom 2021; A GG Comedy nom 2022 | 1 |
| 192 | Grey's Anatomy | 2005 | ABC | drama | US | B BBC2021 #47 | 1 |
| 193 | Hannibal | 2013 | NBC | drama | US | B BBC2021 #97 | 1 |
| 194 | Homecoming | 2018 | Prime Video | drama | US | A GG Drama nom 2019 | 1 |
| 195 | How I Met Your Mother | 2005 | CBS | comedy | US | B BBC2021 #86 | 1 |
| 196 | How to Die Alone | 2024 | Hulu | comedy | US | B THR2024 (Han honorable mention, list partially captured) | 1 |
| 197 | The Hunting Wives | 2025 | Netflix | drama | US | B Vulture2025 (Roxana Hadadi #7); B Vulture2025 (Kathryn VanArendonk #10) | 1 |
| 198 | I Think You Should Leave with Tim Robinson | 2019 | Netflix | comedy (sketch) | US | B NYT2026 #57 | 1 |
| 199 | Inventing Anna | 2022 | Netflix | limited | US | A Emmy Limited nom 2022 | 1 |
| 200 | Justified | 2010 | FX | drama | US | B NYT2026 #83 | 1 |
| 201 | Key & Peele | 2012 | Comedy Central | comedy (sketch) | US | B NYT2026 #29 | 1 |
| 202 | Kidding | 2018 | Showtime | comedy | US | A GG Comedy nom 2019 | 1 |
| 203 | King of the Hill | 1997 | Fox→Hulu (2025 revival) | animation (adult) | US | B Vulture2025 (Nicholas Quah #2) | 1 |
| 204 | Little Fires Everywhere | 2020 | Hulu | limited | US | A Emmy Limited nom 2020 | 1 |
| 205 | The Loudest Voice | 2019 | Showtime | limited | US | A GG Limited nom 2020 | 1 |
| 206 | Love Story: John F. Kennedy Jr. & Carolyn Bessette | 2026 | FX/Hulu | limited | US | A Emmy Limited nom 2026 | 1 |
| 207 | Love, Death & Robots | 2019 | Netflix | animation (adult anthology) | US | A Emmy Animated nom 2025 | 1 |
| 208 | Maid | 2021 | Netflix | limited | US | A GG Limited nom 2022 | 1 |
| 209 | Manhunt | 2024 | Apple TV+ | limited | US | B THR2024 (Angie Han #8) | 1 |
| 210 | Margo's Got Money Troubles | 2026 | Apple TV | comedy | US | A Emmy Comedy nom 2026 | 1 |
| 211 | Matlock | 2024 | CBS | drama | US | B CT10-2024 agg ~#30 | 1 |
| 212 | Mindhunter | 2017 | Netflix | drama | US | B BBC2021 #79 | 1 |
| 213 | Mozart in the Jungle | 2014 | Prime Video | comedy | US | A GG Comedy win 2016; A GG Comedy nom 2017 | 1 |
| 214 | Mrs. America | 2020 | FX on Hulu | limited | US | A Emmy Limited nom 2020 | 1 |
| 215 | Murdaugh: Death in the Family | 2025 | Hulu | limited | US | B Variety2025 (Aramide Tinubu #10) | 1 |
| 216 | My Lady Jane | 2024 | Prime Video | drama | US (filmed UK) | B Variety2024 (Alison Herman #10) | 1 |
| 217 | Obi-Wan Kenobi | 2022 | Disney+ | limited | US | A Emmy Limited nom 2023 | 1 |
| 218 | The Old Man | 2022 | FX | drama | US | B Vulture2024 (Roxana Hadadi #4) | 1 |
| 219 | Outlander | 2014 | Starz | drama | US | A GG Drama nom 2016 | 1 |
| 220 | Outlander: Blood of My Blood | 2025 | Starz | drama | US | B Variety2025 (Aramide Tinubu #6) | 1 |
| 221 | Pachinko | 2022 | Apple TV+ | drama | US | B THR2024 (Daniel Fienberg #5); B THR2024 (Han honorable mention, list partially captured) | 1 |
| 222 | Palm Royale | 2024 | Apple TV+ | comedy | US | A Emmy Comedy nom 2024 | 1 |
| 223 | Penelope | 2024 | Netflix | drama | US | B THR2024 (Han honorable mention, list partially captured) | 1 |
| 224 | Phineas and Ferb | 2007 | Disney Channel | animation (kids/family) | US | A Emmy Animated nom 2016 | 1 |
| 225 | Platonic | 2023 | Apple TV+ | comedy | US | B Vulture2025 (other highlights, unranked) | 1 |
| 226 | The Politician | 2019 | Netflix | comedy | US | A GG Comedy nom 2020 | 1 |
| 227 | Presumed Innocent | 2024 | Apple TV+ | drama | US | B Variety2024 (Aramide Tinubu #5) | 1 |
| 228 | Primal | 2019 | Adult Swim | animation (adult) | US | A Emmy Animated win 2021; A Emmy Animated nom 2023 | 1 |
| 229 | Ratched | 2020 | Netflix | drama | US | A GG Drama nom 2021 | 1 |
| 230 | Roots (2016) | 2016 | History | limited | US | A Emmy Limited nom 2016 | 1 |
| 231 | Russian Doll | 2019 | Netflix | comedy | US | A Emmy Comedy nom 2019 | 1 |
| 232 | Scandal | 2012 | ABC | drama | US | B NYT2026 #100 | 1 |
| 233 | Scavengers Reign | 2023 | Max/Netflix | animation (adult) | US | A Emmy Animated nom 2024 | 1 |
| 234 | Show Me a Hero | 2015 | HBO | limited | US | B BBC2021 #92 | 1 |
| 235 | The Simpsons | 1989 | Fox | animation (adult) | US | A Emmy Animated nom 2016; A Emmy Animated nom 2017; A Emmy Animated nom 2018; A Emmy Animated win 2019; A Emmy Animated nom 2020; A Emmy Animated nom 2021; A Emmy Animated nom 2022; A Emmy Animated win 2023; A Emmy Animated nom 2024; A Emmy Animated nom 2025; A Emmy Animated nom 2026 | 1 |
| 236 | The Sinner | 2017 | USA Network | limited→anthology | US | A GG Limited nom 2018 | 1 |
| 237 | Sirens | 2025 | Netflix | limited | US | B Vulture2025 (other highlights, unranked) | 1 |
| 238 | SMILF | 2017 | Showtime | comedy | US | A GG Comedy nom 2018 | 1 |
| 239 | Smiling Friends | 2020 | Adult Swim | animation (adult) | US | A Emmy Animated nom 2026 | 1 |
| 240 | Sofia the First | 2013 | Disney Junior | animation (kids/family) | US | A Emmy Animated nom 2017 | 1 |
| 241 | South Park | 1997 | Comedy Central | animation (adult) | US | A Emmy Animated nom 2016; A Emmy Animated nom 2017; A Emmy Animated nom 2018; A Emmy Animated nom 2021; A Emmy Animated win 2026 | 1 |
| 242 | Star Wars: Visions | 2021 | Disney+ | animation (anthology; international studios) | US/intl co | A Emmy Animated nom 2026 | 1 |
| 243 | Station Eleven | 2021 | HBO Max | limited | US | B NYT2026 #93 | 1 |
| 244 | Steven Universe | 2013 | Cartoon Network | animation (kids/family) | US | B BBC2021 #99 | 1 |
| 245 | The Sympathizer | 2024 | HBO | limited | US | B Variety2024 (Alison Herman #5) | 1 |
| 246 | Task | 2025 | HBO | limited | US | B CT10-2025 agg #11 | 1 |
| 247 | Treme | 2010 | HBO | drama | US | B BBC2021 #93 | 1 |
| 248 | Unbreakable Kimmy Schmidt | 2015 | Netflix | comedy | US | A Emmy Comedy nom 2016; A Emmy Comedy nom 2017; A Emmy Comedy nom 2018 | 1 |
| 249 | Under the Bridge | 2024 | Hulu | limited | US | B Vulture2024 (other highlights, unranked) | 1 |
| 250 | The Undoing | 2020 | HBO | limited | US | A GG Limited nom 2021 | 1 |
| 251 | Untamed | 2025 | Netflix | limited | US | B Variety2025 (Aramide Tinubu #8) | 1 |
| 252 | WandaVision | 2021 | Disney+ | limited | US | A Emmy Limited nom 2021 | 1 |
| 253 | What If...? | 2021 | Disney+ | animation | US | A Emmy Animated nom 2022 | 1 |
| 254 | When They See Us | 2019 | Netflix | limited | US | A Emmy Limited nom 2019 | 1 |
| 255 | Widow's Bay | 2026 | Apple TV | comedy | US | A Emmy Comedy win 2026 | 1 |
| 256 | Will & Grace | 1998 | NBC | comedy | US | A GG Comedy nom 2018 | 1 |
| 257 | Yellowjackets | 2021 | Showtime | drama | US | A Emmy Drama nom 2022; A Emmy Drama nom 2023 | 1 |
| 258 | Your Friends & Neighbors | 2025 | Apple TV | drama | US | A Emmy Drama nom 2026 | 1 |
| 259 | Étoile | 2025 | Prime Video | comedy-drama | US | B Vulture2025 (Jackson McHenry #10) | 1 |

### 2b. Found in sources but excluded: non-US production (66 shows)

Kept for completeness so the selection step can see what was dropped and why.

| English title | why excluded | evidence tags | distinct sources |
|---|---|---|---|
| Adolescence | UK | A Emmy Limited win 2025; A GG Limited win 2026; B NYT2026 #40; B Variety2025 (Aramide Tinubu #1); B Vulture2025 (other highlights, unranked); B THR2025 (Daniel Fienberg #8); B THR2025 (Angie Han #10); B CT10-2025 agg #2 | 7 |
| Baby Reindeer | UK | A Emmy Limited win 2024; A GG Limited win 2025; B NYT2026 #89; B Variety2024 (Aramide Tinubu #3); B THR2024 (Angie Han #7); B THR2024 (Fienberg honorable mention); B CT10-2024 agg #2 | 6 |
| Slow Horses | UK (See-Saw Films for Apple TV) | A Emmy Drama nom 2024; A Emmy Drama nom 2025; A Emmy Drama nom 2026; A GG Drama nom 2025; A GG Drama nom 2026; B NYT2026 #62; B Vulture2024 (Kathryn VanArendonk #10); B CT10-2024 agg ~#16 | 5 |
| Black Mirror | UK | A Emmy Limited nom 2025; A GG Limited nom 2026; B BBC2021 #22; B NYT2026 #26 | 4 |
| Fleabag | UK | A Emmy Comedy win 2019; A GG Comedy win 2020; B BBC2021 #4; B NYT2026 #5 | 4 |
| Schitt's Creek | Canada | A Emmy Comedy nom 2019; A Emmy Comedy win 2020; A GG Comedy win 2021; B BBC2021 #41; B NYT2026 #34 | 4 |
| The Crown | UK (Left Bank for Netflix) | A Emmy Drama nom 2017; A Emmy Drama nom 2018; A Emmy Drama nom 2020; A Emmy Drama win 2021; A Emmy Drama nom 2023; A Emmy Drama nom 2024; A GG Drama win 2017; A GG Drama nom 2018; A GG Drama nom 2020; A GG Drama win 2021; A GG Drama nom 2023; A GG Drama nom 2024; B BBC2021 #16; B NYT2026 #20 | 4 |
| Downton Abbey | UK (ITV) | A Emmy Drama nom 2016; B BBC2021 #36=; B NYT2026 #52 | 3 |
| I May Destroy You | UK (BBC/HBO) | A Emmy Limited nom 2021; B BBC2021 #6; B NYT2026 #18 | 3 |
| Normal People | Ireland/UK | A GG Limited nom 2021; B BBC2021 #84=; B NYT2026 #49 | 3 |
| One Day | UK | B Variety2024 (Aramide Tinubu #6); B Vulture2024 (other highlights, unranked); B CT10-2024 agg ~#20 | 3 |
| Squid Game | South Korea | A Emmy Drama nom 2022; A GG Drama nom 2022; A GG Drama nom 2025; B NYT2026 #72 | 3 |
| The Day of the Jackal | UK (Sky/Peacock) | A GG Drama nom 2025; B Variety2024 (Aramide Tinubu #4); B CT10-2024 agg ~#33 | 3 |
| We Are Lady Parts | UK | B Vulture2024 (Roxana Hadadi #9); B THR2024 (Angie Han #2); B THR2024 (Fienberg honorable mention); B CT10-2024 agg ~#28 | 3 |
| A Thousand Blows | UK | B Variety2025 (Aramide Tinubu #7); B Vulture2025 (other highlights, unranked) | 2 |
| Bodyguard | UK (BBC) | A Emmy Drama nom 2019; A GG Drama nom 2019 | 2 |
| Catastrophe | UK | B BBC2021 #96; B NYT2026 #91 | 2 |
| Extraordinary | UK | B Vulture2024 (Jen Chaney #7); B THR2024 (Angie Han #6) | 2 |
| Happy Valley | UK | B BBC2021 #54; B NYT2026 #45 | 2 |
| Killing Eve | UK (Sid Gentle; aired BBC America) | A Emmy Drama nom 2019; A Emmy Drama nom 2020; A GG Drama nom 2019; A GG Drama nom 2020 | 2 |
| Mussolini: Son of the Century | Italy | B Vulture2025 (Roxana Hadadi #5); B THR2025 (Daniel Fienberg #1) | 2 |
| North of North | Canada | B Vulture2025 (other highlights, unranked); B THR2025 (Daniel Fienberg #10); B THR2025 (Angie Han #8) | 2 |
| Peep Show | UK | B BBC2021 #42; B NYT2026 #60 | 2 |
| Small Axe | UK | A GG Limited nom 2021; B BBC2021 #51 | 2 |
| The Bureau | France | B BBC2021 #49; B NYT2026 #54 | 2 |
| The Night Manager | UK | A Emmy Limited nom 2016; A GG Limited nom 2017 | 2 |
| The Office (UK) | UK | B BBC2021 #9; B NYT2026 #16 | 2 |
| The Thick of It | UK | B BBC2021 #20; B NYT2026 #63 | 2 |
| Unorthodox | Germany | A Emmy Limited nom 2020; A GG Limited nom 2021 | 2 |
| A Very English Scandal | UK | A GG Limited nom 2019 | 1 |
| Asura | Japan | B Vulture2025 (other highlights, unranked) | 1 |
| Babylon Berlin | Germany | B BBC2021 #75 | 1 |
| Borgen | Denmark | B BBC2021 #40 | 1 |
| Call My Agent! | France | B BBC2021 #53 | 1 |
| Colin from Accounts | Australia | B Vulture2024 (Kathryn VanArendonk #5) | 1 |
| Criminal Record | UK | B Variety2024 (Aramide Tinubu #7) | 1 |
| Dark | Germany | B BBC2021 #58 | 1 |
| Dept. Q | UK | B CT10-2025 agg #17 | 1 |
| Detectorists | UK | B BBC2021 #64 | 1 |
| Heated Rivalry | Canada | B CT10-2025 agg #18= | 1 |
| Inside No. 9 | UK | B BBC2021 #48 | 1 |
| Joan | UK | B Variety2024 (Aramide Tinubu #8) | 1 |
| Line of Duty | UK | B BBC2021 #27 | 1 |
| Lupin | France | A GG Drama nom 2022 | 1 |
| Luther | UK | B BBC2021 #95 | 1 |
| Money Heist | Spain | B BBC2021 #43 | 1 |
| Mr Loverman | UK | B THR2025 (Angie Han #9) | 1 |
| My Brilliant Friend | Italy (HBO/RAI co-pro) | B THR2024 (Daniel Fienberg #1) | 1 |
| One Hundred Years of Solitude | Colombia | B THR2024 (Daniel Fienberg #10) | 1 |
| Patrick Melrose | UK (Sky/Showtime) | A Emmy Limited nom 2018 | 1 |
| Peaky Blinders | UK | B NYT2026 #43 | 1 |
| Rivals | UK | B CT10-2024 agg ~#24 | 1 |
| Sherlock | UK | B BBC2021 #25 | 1 |
| Shoresy | Canada | B Vulture2025 (Nicholas Quah #3) | 1 |
| Such Brave Girls | UK | B THR2025 (Daniel Fienberg #9) | 1 |
| The Bridge | Denmark/Sweden | B BBC2021 #34 | 1 |
| The Eastern Gate | origin not verified (listed as HBO Max; likely non-US) | B Vulture2025 (Nicholas Quah #9) | 1 |
| The Gentlemen | UK | A GG Comedy nom 2025 | 1 |
| The Girlfriend | UK (Prime Video) | A GG Limited nom 2026 | 1 |
| The Killing (Denmark) | Denmark | B BBC2021 #78 | 1 |
| The Narrow Road to the Deep North | Australia | B Vulture2025 (Roxana Hadadi #10) | 1 |
| The Young Pope | Italy/France/Spain (HBO/Sky/Canal+ co-pro) | B BBC2021 #57 | 1 |
| This Is England '86/'88/'90 | UK | B BBC2021 #52 | 1 |
| Top of the Lake | Australia/NZ/UK | A GG Limited nom 2018 | 1 |
| Utopia | UK | B BBC2021 #74 | 1 |
| Wolf Hall | UK | A GG Limited win 2016 | 1 |

### 2c. Found in sources but excluded: unscripted / reality / talk / docuseries (23 titles)

| English title | evidence tags | distinct sources |
|---|---|---|
| John Mulaney Presents: Everybody's in LA | B Variety2024 (Alison Herman #6); B Vulture2024 (Jen Chaney #4); B Vulture2024 (Kathryn VanArendonk #3); B THR2024 (Fienberg honorable mention); B CT10-2024 agg ~#29 | 4 |
| The Rehearsal | B NYT2026 #66; B Vulture2025 (Jackson McHenry #1); B Vulture2025 (Nicholas Quah #4); B Vulture2025 (Kathryn VanArendonk #5); B THR2025 (Daniel Fienberg #4); B CT10-2025 agg #8 | 4 |
| Couples Therapy | B Vulture2025 (other highlights, unranked); B Vulture2024 (Kathryn VanArendonk #9) | 2 |
| Planet Earth | B BBC2021 #73; B NYT2026 #84 | 2 |
| RuPaul's Drag Race | B BBC2021 #67; B NYT2026 #61 | 2 |
| The Traitors | B Vulture2025 (other highlights, unranked); B Vulture2024 (other highlights, unranked) | 2 |
| Anthony Bourdain: No Reservations | B NYT2026 #69 | 1 |
| Anthony Bourdain: Parts Unknown | B NYT2026 #64 | 1 |
| Conan O'Brien Must Go | B Vulture2024 (other highlights, unranked) | 1 |
| Devil in the Family: The Fall of Ruby Franke | B Vulture2025 (Kathryn VanArendonk #9) | 1 |
| Everybody's Live with John Mulaney | B Variety2025 (Alison Herman #6) | 1 |
| Eyes on the Prize III | B THR2025 (Daniel Fienberg #3) | 1 |
| God Save Texas | B THR2024 (Fienberg honorable mention) | 1 |
| How To with John Wilson | B NYT2026 #80 | 1 |
| Mr. Scorsese | B Vulture2025 (Roxana Hadadi #3) | 1 |
| Nathan for You | B NYT2026 #56 | 1 |
| O.J.: Made in America | B BBC2021 #81 | 1 |
| Pee-Wee as Himself | B CT10-2025 agg #22 | 1 |
| Photographer | B Vulture2024 (Roxana Hadadi #10) | 1 |
| Survivor | B NYT2026 #31 | 1 |
| The Case Against Adnan Syed | B Vulture2025 (other highlights, unranked) | 1 |
| The Great British Baking Show | B NYT2026 #85 | 1 |
| Welcome to Wrexham | B THR2024 (Daniel Fienberg #4) | 1 |

## 3. Could not access / caveats

- **Metacritic critics' top-ten aggregation (2024, 2025)**: not found. Metacritic's own "best of" pages rank by Metascore. CriticsTop10 (110 lists in 2025) is used as the aggregation stand-in.
- **NYT 2026 list**: Groundlane `web_fetch` failed (upstream byte limit), `web_extract` got a 771-byte paywall stub, Firecrawl said the site is unsupported, and Jina returned empty content. Only Tavily `extract` (advanced) got the text. Ranks come from that text, not from a secondary summary.
- **GG Comedy 2016–2020 winners**: the winner cell was cut off in my extract (see sources table). The winners listed are from the known record, not re-read.
- **THR 2024 Angie Han honorable mentions**: list cut off after 7 titles.
- **CriticsTop10 2024 #15–33**: real tie ranks not captured. `~#N` is the row order.
- **Metadata** (first-air year, network, genre, origin) in table 2a was not checked against sources. It comes from general knowledge plus the network column in the Emmy/GG tables. Borderline calls to re-check before use: Slow Horses and Killing Eve were treated as UK productions (excluded) even though Apple TV / BBC America commissioned them. Chernobyl, Industry, Arcane, Band of Brothers, The Great and Star Wars: Visions were kept as US co-productions. *The Eastern Gate* (Vulture 2025, Quah #9): origin not verified, excluded provisionally. *Jury Duty* was kept as scripted (hybrid). Sketch shows (Key & Peele, Chappelle's Show, I Think You Should Leave, Fantasmas) were kept as scripted comedy. *The Rehearsal* and *Nathan for You* were treated as unscripted.
- Kids/family animation that appeared only as Emmy Animated nominees or in the BBC poll (Phineas and Ferb, Sofia the First, Big Hero 6: The Series, Avatar: The Last Airbender, Steven Universe, Adventure Time) is kept in 2a and labelled in the genre column. Drop it if the series stays adults-only.
- The 2026 Emmy results (e.g. comedy winner *Widow's Bay*, limited winner *DTF St. Louis*) come from the current Wikipedia pages. Some of them are newer than my own knowledge, so I could not cross-check them.
