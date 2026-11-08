# Korean TV (K-drama) candidates — awards juries (A) + critics polls / year-end lists (B)

Collected 2026-11-08 for the zh-TW 「各國影劇導讀」 series (Korea). Raw data only; no curation applied. Scope: South Korean-produced scripted series (broadcast, cable, Korean streaming originals incl. Netflix/Disney+/Apple TV+/Coupang Play/TVING Korean originals). Non-Korean productions and unscripted titles found in the sources are listed in 2b so nothing is silently dropped.

**Year conventions**: award tags use the ceremony year (`Baeksang Drama win 2024` = 60th Baeksang, May 2024; `GG ... 2022` = 79th Globes, Jan 2022). Critics' list tags use the list's publication year.

**Distinct sources** = count of distinct source keys a show appears in. Keys (32): A — `Baeksang` (Best Drama noms/wins 2016–2026, + TV Daesang), `BSA` (Blue Dragon Series Awards Best Drama noms/wins 2022–2026, + Grand Prize), `IntlEmmy` (any category), `PrimetimeEmmy`, `GG`, `AACA` (Asian Academy Creative Awards Best Drama Series, grand + Korea national), `SDA` (Seoul International Drama Awards, international competition categories 2016–2025), `SDA-K` (SDA "Outstanding Korean Drama" section 2016–2025 — selection method not stated in source, likely less jury-like; weight down if needed); B — `NYT2026`, `NYT-Intl2019` (Hale, 30 best international shows of the decade), `NYT-Intl2024`, `NYT-Intl2025`, `BBC2021`, `Guardian2019`…`Guardian2025` (50 best TV of the year), `Guardian100-2019`, `Variety2023`, `VarietyIntl2025`, `Time2025` (Berman top 10), `Time-K2023`, `Time-K2024`, `Time-K2025`, `Cine21-2021`…`Cine21-2025`. Several noms/wins inside one award key count once; multiple seasons of one show are merged (Squid Game S1–S3, D.P. S1–S2, Yumi's Cells S1–S3, Kingdom incl. the *Ashin of the North* special).

**Metadata**: Korean title + network for Baeksang-nominated shows come from the Baeksang Wikipedia table (sourced). Korean titles, first-air years and networks for all other rows, and **all first-air years**, are from general knowledge = **unsourced; verify before publishing**. No source read here showed a Taiwanese (zh-TW) title, so that column is omitted.

## 1. Sources

| Source | URL | Read status | What was extracted |
|---|---|---|---|
| Baeksang Arts Award for Best Drama (Wikipedia) | https://en.wikipedia.org/wiki/Baeksang_Arts_Award_for_Best_Drama | read (full wikitext via `action=raw`) | Winner + all 4 nominees per year, 2016 (52nd)–2026 (62nd), with Korean title + network |
| Squid Game awards list (Wikipedia) | https://en.wikipedia.org/wiki/List_of_awards_and_nominations_received_by_Squid_Game | partial (lead text + GG block + Baeksang/BSA blocks via `action=raw`; Primetime Emmy table rows not extracted, only the lead summary) | Baeksang TV Daesang 2022; GG 2022/2025 rows; Emmy 2022 summary (14 noms, 6 wins incl. lead actor, directing, guest actress) |
| Blue Dragon Series Awards (Wikipedia, main + 1st–5th ceremony pages) | https://en.wikipedia.org/wiki/Blue_Dragon_Series_Awards ; https://en.wikipedia.org/wiki/1st_Blue_Dragon_Series_Awards (…5th) | read (wikitext; Best Drama block of each ceremony page via pattern extract) | Best Drama winner + 4 nominees 2022–2026; Grand Prize (2024 Moving, 2025 Tangerines; 2023/2026 went to people) |
| International Emmy — Best Drama Series (Wikipedia) | https://en.wikipedia.org/wiki/International_Emmy_Award_for_Best_Drama_Series | read (full wikitext) | Korean nominees: Extraordinary Attorney Woo 2023 (also Kingdom of the Winds 2009, out of window) |
| International Emmy — Best Actor / Best Actress / TV Movie or Miniseries / Telenovela / Comedy (Wikipedia) | https://en.wikipedia.org/wiki/International_Emmy_Award_for_Best_Actor (and _Best_Actress, _Best_TV_Movie_or_Miniseries, _Best_Telenovela, _Best_Comedy_Series) | partial: Korean (`{{KOR}}`/South Korea) rows pattern-extracted from wikitext; **ceremony year for the TV Movie/Miniseries rows (marked `*`) comes from the nearest preceding year marker in a regex window — plausible but re-check**. Dr. Brain 2022 and Daily Dose 2024 confirmed by second extract / news | See tags. Other International Emmy categories (Short-form, Kids, Non-scripted) not checked |
| Korea JoongAng Daily, "Park Ji-hyun becomes first Korean actress nominated for International Emmy" (2026-09-25) | https://www.koreajoongangdaily.com/entertainment/park-jihyun-becomes-first-korean-actress-nominated-for-international-emmy/12891594 | read | 2026 Korean noms: Park Ji-hyun (Actress, You and Everything Else), Hyper Knife (TV Movie/Mini); ceremony 23 Nov 2026 (results not yet known); The King's Affection = first Korean Intl Emmy drama win (2022) |
| Forbes / Times Now on Daily Dose of Sunshine Intl Emmy 2024 | https://www.forbes.com/sites/joanmacdonald/2024/11/22/daily-dose-of-sunshine-up-for-an-international-emmy/ | snippet (search highlights) | Confirms Comedy category, 2024, lost to División Palermo (Wikipedia row is the evidence) |
| Golden Globes / Primetime Emmy for Korean series | via Squid Game awards page above + US file (`../us/candidates-awards-critics.md`, which parsed the GG Drama and Emmy Drama Wikipedia tables) | read (as above) | Only Squid Game has GG/Primetime Emmy series-level noms |
| Asian Academy Creative Award for Best Drama Series (Wikipedia) | https://en.wikipedia.org/wiki/Asian_Academy_Creative_Award_for_Best_Drama_Series | read (full wikitext) | Grand winners 2018–2024 (KR wins 2020–2023) + Korea national winners 2018–2024 |
| Variety, AACA 2025 winners | https://variety.com/2025/film/awards/asian-academy-creative-awards-2025-winners-1236599615/ | snippet only (not counted) | Says China's "Strange Tales" beat "When Life Gives You Tangerines" for 2025 Best Drama Series — implies Tangerines was the KR national winner/finalist; not verified |
| Seoul International Drama Awards (Wikipedia) | https://en.wikipedia.org/wiki/Seoul_International_Drama_Awards | read (Golden Bird, Grand Prize, Program table; Outstanding Korean Drama table via pattern extract). Individual-award table truncated (not used) | Korean winners/runners-up in the international competition 2016–2025; Outstanding Korean Drama top/excellence 2016–2025 |
| Peabody Awards | https://peabodyawards.com/awards/winners/ (search) | snippet only | Only Korean-language Peabody found is *Pachinko* (2023) — a US (Apple TV+) production → 2b. No Korean-produced Peabody winner found (search-level only, not an exhaustive check) |
| BBC Culture, 100 greatest TV series of the 21st century (2021) | https://www.bbc.com/culture/article/20211015-the-100-greatest-tv-series-of-the-21st-century | read (pattern search for Korea/Korean/Kingdom/Squid/Signal/Misaeng across the page; full list was parsed in the US file) | **No Korean entries** (only a sidebar link to a Squid Game article) |
| NYT, The 100 Best TV Shows of the 21st Century (2026) | https://www.nytimes.com/interactive/2026/arts/television/best-tv-shows-21st-century.html | read in the US research pass (full 1–100 via Tavily extract); not re-fetched here | Only Korean entry: Squid Game #72 |
| NYT, The 30 Best International TV Shows of the Decade (Mike Hale, 2019) | https://www.nytimes.com/2019/12/20/arts/television/best-international-tv-shows.html | partial: NYT paywalled (Exa returned intro only); ranked list read from a verbatim ResetEra transcription https://www.resetera.com/threads/new-york-times-the-30-best-international-tv-shows-of-the-decade.160789/ (via Exa) | Strong Girl Bong-soon #16, Kingdom #20 (honorable mentions contain no Korean show) |
| NYT, Best International TV Shows of 2024 (Mike Hale) | https://www.yearendlists.com/2024/mike-hale-best-international-tv-shows-of-2024 (index of the NYT list) | partial: titles read from yearendlists.com (NYT itself paywalled/blocked for Groundlane, jina, Exa); countries not shown | Korean: A Shop for Killers (top 10), Jeongnyeon (the "10 more"). Other titles whose country I could not confirm (e.g. *Fleeting Lies*, *The Confidante*, *Everything Is Well*) were **not** counted |
| NYT, Best International TV Shows of 2025 (Mike Hale) | https://www.yearendlists.com/2025/mike-hale-best-international-tv-shows-of-2025 | partial (titles only, as above) | No title confirmed Korean; *Diary of a Ditched Girl*, *The Best Heart Attack of My Life* are of unconfirmed origin (likely Japanese — unverified) — **not counted** |
| NYT best international shows 2020–2023 | — | not found: yearendlists.com indexes Hale's international lists only for 2019, 2024, 2025 | — |
| Guardian, 50 best TV shows of 2019 / 2020 / 2021 / 2022 / 2023 / 2024 / 2025 | https://www.theguardian.com/tv-and-radio/2019/dec/02/50-best-tv-shows-2019 ; …/2020/dec/03/the-50-best-tv-shows-of-2020 ; …/2021/dec/03/the-50-best-tv-shows-of-2021 ; …/2022/dec/02/the-50-best-tv-shows-of-2022 ; …/2023/dec/01/the-50-best-tv-shows-of-2023 ; …/2024/dec/09/the-50-best-tv-shows-of-2024 ; …/ng-interactive/2025/dec/10/the-50-best-tv-shows-of-2025 | read (all h2 rank headings + "Korean" text pattern; 2019 only the pattern search) | 2021: Squid Game #5, Hellbound #42. 2025: Squid Game in the 40–31 block (2nd item → ~#39, ranks not printed per item). 2019/2020/2022/2023/2024: no Korean-produced show (Pachinko 2022 #15 / 2024 #43 and Squid Game: The Challenge 2023 #26 → 2b) |
| Guardian, 100 best TV shows of the 21st century (2019) | https://www.theguardian.com/tv-and-radio/2019/sep/16/100-best-tv-shows-of-the-21st-century | read (pattern search for "South Korea"/"Korean" only) | No Korean match |
| Variety, Best TV Shows of 2023 | https://variety.com/lists/best-tv-shows-2023/ | read (ranked headings, Tinubu + Herman) | No Korean entries |
| Variety, Best International TV Shows of 2025 | https://variety.com/lists/best-international-tv-shows-of-2025/ | read (headings) | No Korean entries (10 titles, multi-author) |
| Variety / Vulture / THR 2024–2025 top 10s, CriticsTop10 2024/2025 | see US file sources table | read in the US pass; its 2b (non-US) list contains no Korean title from these lists | No Korean entries |
| Time, The 10 Best TV Shows of 2025 (Judy Berman) | https://time.com/7333787/best-tv-shows-2025/ | read (headings) | No Korean entry |
| Time, The 10 Best K-Dramas of 2024 (Kayti Burt) | https://time.com/7201080/best-k-dramas-2024/ | read (ranked headings + body text for #3) | Ranks 1–10 |
| Time, The 10 Best Korean Dramas of 2025 (Kayti Burt) | https://time.com/7340988/best-k-dramas-2025/ | read (full text via jina) | Ranks 1–10 + 17 honorable mentions |
| Time, The 10 Best Korean Dramas of 2023 on Netflix (Chad de Guzman) | https://time.com/6549115/best-korean-dramas-netflix-2023-2/ | read (headings); list appears unranked and restricted to Netflix | 10 titles, unranked |
| 씨네21 (Cine21) 올해의 시리즈 2021–2025 | https://namu.wiki/w/씨네21/올해의%20시리즈 (compilation); cross-check https://cine21.com/news/view/?mag_id=109072 (2025) | partial: ranks read from the namu.wiki compilation (secondary); Cine21's 2025 article (22 critics/reporters/TV critics poll) read and agrees on #1 미지의 서울 and #3 폭싹 속았수다; 2021–2024 not checked against Cine21 originals | Top 10 each year (ties marked `=`) |

## 2. Candidates

### 2a. South Korean-produced scripted candidates (153 shows)

Sorted by number of distinct sources (desc), then title. Only Baeksang-row metadata is sourced; everything else in the Korean-title / year / network columns is unsourced (see note above).

| # | English title | Korean title | first-air year | network/platform | evidence tags | distinct sources |
|---|---|---|---|---|---|---|
| 1 | Squid Game | 오징어 게임 | 2021 | Netflix | A Baeksang Drama nom 2022; A Baeksang TV Grand Prize (Daesang) 2022; A BlueDragon Drama nom 2022; A Emmy Drama nom 2022 + Lead Actor win (Lee Jung-jae), Directing win (Hwang Dong-hyuk), Guest Actress win (Lee You-mi); 14 noms/6 wins total; A GG Drama nom 2022 (79th); GG Supp. Actor TV WIN 2022 (O Yeong-su); GG Actor Drama nom 2022 (Lee Jung-jae); GG Drama nom 2025 (82nd); B NYT2026 #72; B Guardian2021 #5; B Guardian2025 ~#39 (40–31 block, by order; S2/S3); B Time-K2025 (Burt) #3 [S3]; B Cine21-2021 #10= | 9 |
| 2 | The Glory | 더 글로리 | 2022 | Netflix | A Baeksang Drama win 2023; A BlueDragon Drama nom 2023; A AACA Best Drama Series grand WIN 2023 (+KR national); A SDA-K Excellence 2023; B Time-K2023 (de Guzman, Netflix-only, unranked); B Cine21-2023 #2 | 6 |
| 3 | D.P. | 디피 (D.P.) | 2021 | Netflix | A Baeksang Drama win 2022; A BlueDragon Drama win 2022; B Time-K2023 (de Guzman, Netflix-only, unranked) [S2]; B Cine21-2021 #3; B Cine21-2023 #10 (S2) | 5 |
| 4 | Daily Dose of Sunshine | 정신병동에도 아침이 와요 | 2023 | Netflix | A Baeksang Drama nom 2024; A BlueDragon Drama win 2024; A IntlEmmy Comedy nom 2024; B Time-K2023 (de Guzman, Netflix-only, unranked); B Cine21-2023 #7 | 5 |
| 5 | When Life Gives You Tangerines | 폭싹 속았수다 | 2025 | Netflix | A Baeksang Drama win 2025; A BlueDragon Drama nom 2025; A BlueDragon Grand Prize 2025; A SDA-K Excellence 2025; B Time-K2025 (Burt) #1; B Cine21-2025 #3 | 5 |
| 6 | You and Everything Else | 은중과 상연 | 2025 | Netflix | A Baeksang Drama win 2026; A BlueDragon Drama nom 2026; A IntlEmmy Actress nom 2026 (Park Ji-hyun; pending); B Time-K2025 (Burt) honorable mention; B Cine21-2025 #2 | 5 |
| 7 | Extraordinary Attorney Woo | 이상한 변호사 우영우 | 2022 | ENA | A Baeksang Drama nom 2023; A IntlEmmy Drama Series nom 2023; A SDA-K Excellence 2023; B Cine21-2022 #1 | 4 |
| 8 | Moving | 무빙 | 2023 | Disney+ | A Baeksang Drama nom 2024; A BlueDragon Drama nom 2024; A BlueDragon Grand Prize 2024; A SDA-K Excellence 2024; B Cine21-2023 #1 | 4 |
| 9 | The Trauma Code: Heroes on Call | 중증외상센터 | 2025 | Netflix | A Baeksang Drama nom 2025; A BlueDragon Drama win 2025; A SDA-K Excellence 2025; B Time-K2025 (Burt) honorable mention | 4 |
| 10 | A Shop for Killers | 킬러들의 쇼핑몰 | 2024 | Disney+ | B NYT-Intl2024 (Hale) top 10 (alphabetical, unranked); B Time-K2024 (Burt) #4; B Cine21-2024 #8 | 3 |
| 11 | Crash Landing on You | 사랑의 불시착 | 2019 | tvN | A Baeksang Drama nom 2020; A AACA Best Drama Series grand WIN 2020 (+KR national); A SDA-K Excellence 2020 | 3 |
| 12 | Kingdom | 킹덤 | 2019 | Netflix | A Baeksang Drama nom 2020; B NYT-IntlDecade2019 (Hale) #20; B Cine21-2021 #10= (Kingdom: Ashin of the North special) | 3 |
| 13 | Lovely Runner | 선재 업고 튀어 | 2024 | tvN | A Baeksang Drama nom 2025; B Time-K2024 (Burt) #1; B Cine21-2024 #10= | 3 |
| 14 | Our Unwritten Seoul | 미지의 서울 | 2025 | tvN | A Baeksang Drama nom 2026; B Time-K2025 (Burt) #5; B Cine21-2025 #1 | 3 |
| 15 | Political Fever | 이렇게 된 이상 청와대로 간다 | 2021 | Wavve | A Baeksang Drama nom 2022; A BlueDragon Drama nom 2022; B Cine21-2021 #1 | 3 |
| 16 | Reborn Rich | 재벌집 막내아들 | 2022 | JTBC (prod. SLL/Raemongraein) | A IntlEmmy TVMovie/Mini nom 2023*; A SDA Mini-series runner-up 2023; B Cine21-2023 #9 | 3 |
| 17 | The Atypical Family | 히어로는 아닙니다만 | 2024 | JTBC | A AACA Best Drama KR national 2024; B Time-K2024 (Burt) #5; B Cine21-2024 #10= | 3 |
| 18 | The Dream Life of Mr. Kim | 서울 자가에 대기업 다니는 김 부장 이야기 | 2025 | JTBC | A Baeksang Drama nom 2026; B Time-K2025 (Burt) honorable mention; B Cine21-2025 #6 | 3 |
| 19 | The Red Sleeve | 옷소매 붉은 끝동 | 2021 | MBC | A Baeksang Drama nom 2022; A SDA-K Excellence 2022; B Cine21-2022 #4 | 3 |
| 20 | Twenty-Five Twenty-One | 스물다섯 스물하나 | 2022 | tvN | A Baeksang Drama nom 2022; A AACA Best Drama Series grand WIN 2022 (+KR national); B Cine21-2022 #6 | 3 |
| 21 | Way Back Love | 내가 죽기 일주일 전 | 2025 | TVING | A BlueDragon Drama nom 2025; B Time-K2025 (Burt) #2; B Cine21-2025 #7 | 3 |
| 22 | Beyond Evil | 괴물 | 2021 | JTBC | A Baeksang Drama win 2021; B Cine21-2021 #6 | 2 |
| 23 | Big Bet | 카지노 | 2022 | Disney+ | A BlueDragon Drama win 2023; A SDA Golden Bird Prize 2023 (program) | 2 |
| 24 | Bon Appétit, Your Majesty | 폭군의 셰프 | 2025 | tvN | A Baeksang Drama nom 2026; B Time-K2025 (Burt) honorable mention | 2 |
| 25 | Descendants of the Sun | 태양의 후예 | 2016 | KBS | A Baeksang Drama nom 2016; A SDA-K Top Excellence 2016 | 2 |
| 26 | Doubt | 이토록 친밀한 배신자 | 2024 | MBC | A Baeksang Drama nom 2025; B Cine21-2024 #1 | 2 |
| 27 | Fight for My Way | 쌈 마이웨이 | 2017 | KBS | A Baeksang Drama nom 2018; A SDA-K Excellence 2018 | 2 |
| 28 | Hellbound | 지옥 | 2021 | Netflix | B Guardian2021 #42; B Cine21-2021 #5 | 2 |
| 29 | Hot Stove League | 스토브리그 | 2019 | SBS | A Baeksang Drama win 2020; A SDA-K Excellence 2020 | 2 |
| 30 | Hyper Knife | 하이퍼나이프 | 2025 | Disney+ | A IntlEmmy TVMovie/Mini nom 2026 (ceremony 23 Nov 2026, pending); B Cine21-2025 #10 | 2 |
| 31 | It's Okay to Not Be Okay | 사이코지만 괜찮아 | 2020 | tvN | A Baeksang Drama nom 2021; A IntlEmmy TVMovie/Mini nom 2021* | 2 |
| 32 | Jeongnyeon: The Star Is Born | 정년이 | 2024 | tvN | B NYT-Intl2024 (Hale) "10 more equally deserving" (unranked); B Time-K2024 (Burt) #2 | 2 |
| 33 | Little Women | 작은 아씨들 | 2022 | tvN | A Baeksang Drama nom 2023; B Cine21-2022 #2 | 2 |
| 34 | Love in the Big City | 대도시의 사랑법 | 2024 | TVING | B Time-K2024 (Burt) #3; B Cine21-2024 #4 | 2 |
| 35 | Love in the Moonlight | 구르미 그린 달빛 | 2016 | KBS | A Baeksang Drama nom 2017; A SDA-K Top Excellence 2017 | 2 |
| 36 | LTNS | LTNS | 2024 | TVING | A BlueDragon Drama nom 2024; B Cine21-2024 #2 | 2 |
| 37 | Mask Girl | 마스크걸 | 2023 | Netflix | A BlueDragon Drama nom 2024; B Cine21-2023 #6 | 2 |
| 38 | Mother | 마더 | 2018 | tvN | A Baeksang Drama win 2018; A SDA Best Mini-series win 2018 | 2 |
| 39 | My Dearest | 연인 | 2023 | MBC | A Baeksang Drama win 2024; B Cine21-2023 #4 | 2 |
| 40 | My Liberation Notes | 나의 해방일지 | 2022 | JTBC | A Baeksang Drama nom 2023; B Cine21-2022 #3 | 2 |
| 41 | Revenant | 악귀 | 2023 | SBS | A Baeksang Drama nom 2024; B Cine21-2023 #8 | 2 |
| 42 | Six Flying Dragons | 육룡이 나르샤 | 2015 | SBS | A Baeksang Drama nom 2016; A SDA Best Series Drama win 2016 | 2 |
| 43 | The Good Bad Mother | 나쁜엄마 | 2023 | JTBC | A Baeksang Drama nom 2024; B Time-K2023 (de Guzman, Netflix-only, unranked) | 2 |
| 44 | The Price of Confession | 자백의 대가 | 2025 | Netflix | B Time-K2025 (Burt) honorable mention; B Cine21-2025 #8 | 2 |
| 45 | The Tale of Lady Ok | 옥씨부인전 | 2024 | JTBC | A Baeksang Drama nom 2025; B Time-K2025 (Burt) #8 | 2 |
| 46 | W | 더블유 | 2016 | MBC | A Baeksang Drama nom 2017; A SDA-K Excellence 2017 | 2 |
| 47 | Weak Hero Class 1 | 약한영웅 Class 1 | 2022 | Wavve | A BlueDragon Drama nom 2023; B Cine21-2022 #10 | 2 |
| 48 | When the Camellia Blooms | 동백꽃 필 무렵 | 2019 | KBS | A Baeksang Drama nom 2020; A SDA-K Top Excellence 2020 | 2 |
| 49 | Yumi's Cells | 유미의 세포들 | 2021 | TVING/tvN | A BlueDragon Drama nom 2022; A BlueDragon Drama nom 2026 (S3); B Cine21-2022 #7 (S2) | 2 |
| 50 | A Killer Paradox | 살인자ㅇ난감 | 2024 | Netflix | A BlueDragon Drama nom 2024 | 1 |
| 51 | Aema | 애마 | 2025 | Netflix | B Cine21-2025 #4 | 1 |
| 52 | All of Us Are Dead | 지금 우리 학교는 | 2022 | Netflix | A SDA-K Excellence 2022 | 1 |
| 53 | Anna | 안나 | 2022 | Coupang Play | B Cine21-2022 #5 (director's cut) | 1 |
| 54 | As You Stood By | 당신이 죽였다 | 2025 | Netflix | B Time-K2025 (Burt) honorable mention | 1 |
| 55 | Bargain | 몸값 | 2022 | TVING | A BlueDragon Drama nom 2023 | 1 |
| 56 | Black Out | 백설공주에게 죽음을-Black Out | 2024 | MBC | B Cine21-2024 #9 | 1 |
| 57 | Bloodhounds | 사냥개들 | 2023 | Netflix | B Time-K2023 (de Guzman, Netflix-only, unranked) | 1 |
| 58 | Boar Hunting (멧돼지사냥) | 멧돼지사냥 | 2022 | MBC | B Cine21-2022 #9 | 1 |
| 59 | Boyhood | 소년시대 | 2023 | Coupang Play | B Cine21-2024 #5 | 1 |
| 60 | Bruised Like a Peach (O'PENing) | — | — | tvN O'PENing (single-ep) | A SDA TV Movie runner-up 2024 | 1 |
| 61 | Castaway Diva | 무인도의 디바 | 2023 | tvN | B Time-K2023 (de Guzman, Netflix-only, unranked) | 1 |
| 62 | Children of Nobody | 붉은 달 푸른 해 | 2018 | MBC | A Baeksang Drama nom 2019 | 1 |
| 63 | Crash Course in Romance | 일타 스캔들 | 2023 | tvN | B Time-K2023 (de Guzman, Netflix-only, unranked) | 1 |
| 64 | Dear Hongrang | 탄금 | 2025 | Netflix | B Time-K2025 (Burt) honorable mention | 1 |
| 65 | Dear My Friends | 디어 마이 프렌즈 | 2016 | tvN | A Baeksang Drama win 2017 | 1 |
| 66 | Dear X | 친애하는 X | 2025 | TVING | B Time-K2025 (Burt) honorable mention | 1 |
| 67 | Death's Game | 이재, 곧 죽습니다 | 2023 | TVING | B Time-K2024 (Burt) #9 | 1 |
| 68 | Divorce Attorney Shin | 신성한, 이혼 | 2023 | JTBC | B Time-K2023 (de Guzman, Netflix-only, unranked) | 1 |
| 69 | Doctor Cha | 닥터 차정숙 | 2023 | JTBC | B Time-K2023 (de Guzman, Netflix-only, unranked) | 1 |
| 70 | Doctor Prisoner | 닥터 프리즈너 | 2019 | KBS2 | A SDA-K Excellence 2019 | 1 |
| 71 | Dongjae, the Good or the Bastard | 좋거나 나쁜 동재 | 2024 | TVING | B Cine21-2024 #6 | 1 |
| 72 | Dr. Brain | Dr. 브레인 | 2021 | Apple TV+ | A IntlEmmy Actor nom 2022 (Lee Sun-kyun) | 1 |
| 73 | Dr. Romantic | 낭만닥터 김사부 | 2016 | SBS | A Baeksang Drama nom 2017 | 1 |
| 74 | Everything and Nothing (17세의 조건) | 17세의 조건 | — | — | A SDA TV Movie runner-up 2020 | 1 |
| 75 | Extracurricular | 인간수업 | 2020 | Netflix | A Baeksang Drama nom 2021 | 1 |
| 76 | Extraordinary You | 어쩌다 발견한 하루 | 2019 | MBC | A SDA-K Excellence 2020 | 1 |
| 77 | Family Matters | 가족계획 | 2024 | Coupang Play | A BlueDragon Drama nom 2025 | 1 |
| 78 | Flower of Evil | 악의 꽃 | 2020 | tvN | A Baeksang Drama nom 2021 | 1 |
| 79 | Friendly Rivalry | 선의의 경쟁 | 2025 | U+mobiletv | B Cine21-2025 #9 | 1 |
| 80 | Guardian: The Lonely and Great God (Goblin) | 쓸쓸하고 찬란하神 – 도깨비 | 2016 | tvN | A Baeksang Drama nom 2017 | 1 |
| 81 | Hotel del Luna | 호텔 델루나 | 2019 | tvN | A AACA Best Drama KR national 2019 | 1 |
| 82 | Hyena | 하이에나 | 2020 | SBS | A Baeksang Drama nom 2020 | 1 |
| 83 | Inspector Koo | 구경이 | 2021 | JTBC | B Cine21-2021 #2 | 1 |
| 84 | Itaewon Class | 이태원 클라쓰 | 2020 | JTBC | A SDA Mini-series runner-up 2020 | 1 |
| 85 | Juvenile Justice | 소년심판 | 2022 | Netflix | B Cine21-2022 #8 | 1 |
| 86 | Kairos | 카이로스 | 2020 | MBC | A SDA-K Excellence 2021 | 1 |
| 87 | Karma | 악연 | 2025 | Netflix | A BlueDragon Drama nom 2025 | 1 |
| 88 | Knight Flower | 밤에 피는 꽃 | 2024 | MBC | B Cine21-2024 #7= | 1 |
| 89 | Korea–Khitan War | 고려거란전쟁 | 2023 | KBS2 | A SDA Best Series Drama win 2024 | 1 |
| 90 | Lost (인간실격) | 인간실격 | 2021 | JTBC | B Cine21-2021 #7 | 1 |
| 91 | Love Scout | 나의 완벽한 비서 | 2025 | SBS | B Time-K2025 (Burt) honorable mention | 1 |
| 92 | Low Life | 파인: 촌뜨기들 | 2025 | Disney+ | A Baeksang Drama nom 2026 | 1 |
| 93 | Made in Korea | 메이드 인 코리아 | 2025 | Disney+ | A BlueDragon Drama nom 2026 | 1 |
| 94 | Marry My Husband | 내 남편과 결혼해줘 | 2024 | tvN | B Time-K2024 (Burt) #8 | 1 |
| 95 | Melo Movie | 멜로무비 | 2025 | Netflix | B Time-K2025 (Burt) honorable mention | 1 |
| 96 | Mercy for None | 광장 | 2025 | Netflix | B Time-K2025 (Burt) honorable mention | 1 |
| 97 | Mine | 마인 | 2021 | tvN | B Cine21-2021 #9 | 1 |
| 98 | Missing Child (아이를 찾습니다) | 아이를 찾습니다 | — | — | A SDA Grand Prize 2021 | 1 |
| 99 | Misty | 미스티 | 2018 | JTBC | A Baeksang Drama nom 2018 | 1 |
| 100 | Move to Heaven | 무브 투 헤븐: 나는 유품정리사입니다 | 2021 | Netflix | A AACA Best Drama Series grand WIN 2021 (+KR national) | 1 |
| 101 | Mr. Plankton | Mr. 플랑크톤 | 2024 | Netflix | B Time-K2024 (Burt) #10 | 1 |
| 102 | Mr. Sunshine | 미스터 션샤인 | 2018 | tvN | A Baeksang Drama nom 2019 | 1 |
| 103 | My Golden Life | 황금빛 내 인생 | 2017 | KBS | A Baeksang Drama nom 2018 | 1 |
| 104 | My Mister | 나의 아저씨 | 2018 | tvN | A Baeksang Drama win 2019 | 1 |
| 105 | My Unfamiliar Family | (아는 건 별로 없지만) 가족입니다 | 2020 | tvN | A Baeksang Drama nom 2021 | 1 |
| 106 | Narco-Saints | 수리남 | 2022 | Netflix | A BlueDragon Drama nom 2023 | 1 |
| 107 | Nine Puzzles | 나인 퍼즐 | 2025 | Disney+ | B Time-K2025 (Burt) honorable mention | 1 |
| 108 | On the Verge of Insanity | 미치지 않고서야 | 2021 | MBC | B Cine21-2021 #4 | 1 |
| 109 | Our Blues | 우리들의 블루스 | 2022 | tvN | A Baeksang Drama nom 2023 | 1 |
| 110 | Our Movie | 우리영화 | 2025 | SBS | B Time-K2025 (Burt) honorable mention | 1 |
| 111 | Park Ha-kyung's Travelogue | 박하경 여행기 | 2023 | Wavve | B Cine21-2023 #5 | 1 |
| 112 | Pyramid Game | 피라미드 게임 | 2024 | TVING | B Time-K2024 (Burt) #7 | 1 |
| 113 | Queen of Tears | 눈물의 여왕 | 2024 | tvN | A SDA-K Excellence 2024 | 1 |
| 114 | Queenmaker | 퀸메이커 | 2023 | Netflix | B Time-K2023 (de Guzman, Netflix-only, unranked) | 1 |
| 115 | Reply 1988 | 응답하라 1988 | 2015 | tvN | A Baeksang Drama nom 2016 | 1 |
| 116 | Resident Playbook | 언젠가는 슬기로울 전공의생활 | 2025 | tvN | B Time-K2025 (Burt) #6 | 1 |
| 117 | She Was Pretty | 그녀는 예뻤다 | 2015 | MBC | A Baeksang Drama nom 2016 | 1 |
| 118 | Signal | 시그널 | 2016 | tvN | A Baeksang Drama win 2016 | 1 |
| 119 | Sky Castle | SKY 캐슬 | 2018 | JTBC | A Baeksang Drama nom 2019 | 1 |
| 120 | Something in the Rain | 밥 잘 사주는 예쁜 누나 | 2018 | JTBC | A SDA-K Excellence 2018 | 1 |
| 121 | Spirit Fingers | 스피릿 핑거스 | 2025 | — | B Time-K2025 (Burt) #9 | 1 |
| 122 | Splash Splash Love | 퐁당퐁당 LOVE | 2015 | MBC | A IntlEmmy TVMovie/Mini nom 2016* | 1 |
| 123 | Start-Up | 스타트업 | 2020 | tvN | A SDA-K Excellence 2021 | 1 |
| 124 | Stranger | 비밀의 숲 | 2017 | tvN | A Baeksang Drama nom 2018 | 1 |
| 125 | Strong Girl Bong-soon | 힘쎈여자 도봉순 | 2017 | JTBC | B NYT-IntlDecade2019 (Hale) #16 | 1 |
| 126 | Study Group | 스터디그룹 | 2025 | TVING | B Time-K2025 (Burt) #7 | 1 |
| 127 | Taxi Driver | 모범택시 | 2021 | SBS | A SDA-K Excellence 2021 | 1 |
| 128 | Tempest | 북극성 | 2025 | Disney+ | B Time-K2025 (Burt) #4 | 1 |
| 129 | The Art of Negotiation | 협상의 기술 | 2025 | JTBC | B Cine21-2025 #5 | 1 |
| 130 | The Defects | — | — | — | B Time-K2025 (Burt) honorable mention | 1 |
| 131 | The Doctors | 닥터스 | 2016 | SBS | A SDA-K Excellence 2017 | 1 |
| 132 | The Emperor: Owner of the Mask | 군주 – 가면의 주인 | 2017 | MBC | A AACA Best Drama KR national 2018 | 1 |
| 133 | The Fiery Priest | 열혈사제 | 2019 | SBS | A SDA-K Top Excellence 2019 | 1 |
| 134 | The Flower in Prison | 옥중화 | 2016 | MBC | A SDA-K Excellence 2016 | 1 |
| 135 | The Frog | 아무도 없는 숲속에서 | 2024 | Netflix | B Cine21-2024 #7= | 1 |
| 136 | The Interest of Love | 사랑의 이해 | 2022 | JTBC | B Cine21-2023 #3 | 1 |
| 137 | The Judge from Hell | 지옥에서 온 판사 | 2024 | SBS | B Time-K2024 (Burt) #6 | 1 |
| 138 | The King's Affection | 연모 | 2021 | KBS (also Netflix) | A IntlEmmy Telenovela WIN 2022 | 1 |
| 139 | The Legend of Kitchen Soldier | — | 2026? | TVING | A BlueDragon Drama win 2026 | 1 |
| 140 | The Light in Your Eyes | 눈이 부시게 | 2019 | JTBC | A Baeksang Drama nom 2019 | 1 |
| 141 | The Manipulated | 조각도시 | 2025 | Disney+ | B Time-K2025 (Burt) honorable mention | 1 |
| 142 | The Midnight Romance in Hagwon | 졸업 | 2024 | tvN | B Cine21-2024 #3 | 1 |
| 143 | The Penthouse: War in Life | 펜트하우스 | 2020 | SBS | A SDA Best Series Drama win 2021 | 1 |
| 144 | The Scarecrow | — | — | — | A BlueDragon Drama nom 2026 | 1 |
| 145 | The Son (Drama Stage) | — | — | tvN Drama Stage? (single-ep) | A SDA TV Movie win 2025 | 1 |
| 146 | Through the Darkness | 악의 마음을 읽는 자들 | 2022 | SBS | A BlueDragon Drama nom 2022 | 1 |
| 147 | Trigger | 트리거 | 2025 | Netflix | B Time-K2025 (Burt) #10 | 1 |
| 148 | Vincenzo | 빈센조 | 2021 | tvN | A SDA-K Top Excellence 2021 | 1 |
| 149 | Weak Hero Class 2 | 약한영웅 Class 2 | 2025 | Netflix | B Time-K2025 (Burt) honorable mention | 1 |
| 150 | When the Phone Rings | 지금 거신 전화는 | 2024 | MBC | B Time-K2025 (Burt) honorable mention | 1 |
| 151 | While You Were Sleeping | 당신이 잠든 사이에 | 2017 | SBS | A SDA-K Top Excellence 2018 | 1 |
| 152 | XX | XX | 2020 | MBC/Naver web | A SDA Special Prize 2020 (web series) | 1 |
| 153 | Youth of May | 오월의 청춘 | 2021 | KBS2 | B Cine21-2021 #8 | 1 |
Notes on specific rows:
- **Kingdom**: Cine21-2021 tie at #10 is for the special *Kingdom: Ashin of the North* (킹덤: 아신전), merged here.
- **Political Fever** (이렇게 된 이상 청와대로 간다, Wavve) — Baeksang 2022 nominee, BSA 2022 nominee, Cine21-2021 #1.
- **Missing Child / Everything and Nothing / Bruised Like a Peach / The Son / Splash Splash Love / XX / Boar Hunting**: single-episode or short drama specials / web drama — scripted, kept, but may not fit a "series" guide.
- **Squid Game: The Challenge** is a UK reality show (2b), not Squid Game.
- `*` on Intl Emmy TV Movie/Mini years = year inferred from regex context, re-check.

### 2b. Found in sources but excluded

| Title | Why excluded | Where it appeared |
|---|---|---|
| Pachinko | US production (Apple TV+), Korean-language | Guardian2022 #15; Guardian2024 #43; Peabody 2023 (snippet); SDA 2025 Best Mini-series win |
| Beef | US production (Netflix/A24), Korean-American creator | (US file: Emmy/GG Limited wins, NYT2026 #71) |
| The Sympathizer | US (HBO); SDA Golden Bird 2024 went to director Park Chan-wook | SDA 2024 |
| Severance | US; SDA Golden Bird 2025 to Ben Stiller | SDA 2025 |
| Squid Game: The Challenge | UK reality competition | Guardian2023 #26 |
| Blue Dragon "Best Entertainment Program" winners/nominees (EXchange/Transit Love, Siren: Survive the Island, The Thought Verification Zone: The Community, Culinary Class Wars, Better Late than Single, SNL Korea, The Devil's Plan, etc.) | unscripted / variety | BSA 2022–2026 |
| Seoul Drama Awards non-Korean winners (The Night Manager, This Is Us, Babylon Berlin, Adolescence, 3 Body Problem, etc.) | non-Korean | SDA |

## 3. Could not access / caveats

- **toolDegradation**: (1) Groundlane `web_fetch`/`web_extract`/`web_search` was the primary tool and handled Wikipedia (`action=raw`, incl. `&section=N`), Guardian, Variety, Time, Cine21, JoongAng Daily, namu.wiki (browser fallback). (2) Exa `web_fetch_exa` used where Groundlane was blocked: NYT (returned only the paywall preview — unusable) and ResetEra (Groundlane hit a browser challenge; Exa returned the thread). (3) jina `read_url` used once for Time 2025 full text (no API key → full page, fine); jina is blocked for nytimes.com (403 "anonymous access blocked"). Tavily not used (recently 429); Firecrawl credits exhausted (not used). Groundlane search fell back between providers (tavily/exa unavailable inside Groundlane on some calls; brave/you answered).
- **NYT** pages (2019 decade list, 2024/2025 international lists) are paywalled/blocked for all tools tried (Groundlane 774-byte stub, jina 403, Exa preview only). Lists came from secondary transcriptions (ResetEra, yearendlists.com); show origin countries for non-obvious titles in the 2024/2025 lists were not verifiable, so only clearly Korean titles were counted.
- **NYT best international shows 2020–2023**: no such Hale lists found in the yearendlists index; NYT 2020–2023 year-end articles not checked directly (paywall).
- **IndieWire** 2024/2025 best-TV lists: guessed `/lists/best-tv-shows-202x/` URLs returned a generic page; not found/read. **THR 2023, Vulture 2023**: not checked. **Time Berman top 10 for 2021–2024**: not checked.
- **Rolling Stone / Paste named-critic K-drama rankings**: one search found none (results were Collider/SlashFilm/TVLine/MyDramaList lists — not counted as critics' polls). Not exhaustive.
- **Korean newspaper critics' picks** (한국일보/경향 TV 평론가 선정, JoongAng Daily critics): not searched beyond Cine21; Cine21 used as the Korean critics' poll.
- **Cine21** ranks are from namu.wiki (secondary); only 2025 partially cross-checked against cine21.com.
- **International Emmy**: only Drama, Actor, Actress, TV Movie/Mini, Telenovela, Comedy pages checked. 2026 results (ceremony 23 Nov 2026) not yet known. 2016/2021/2023 TV Movie/Mini years inferred (see `*`).
- **Primetime Emmy**: Squid Game category list beyond the four headline items not extracted (page states 14 noms / 6 wins).
- **AACA 2025/2026**: Korea national winners not read (2025 snippet only: Tangerines lost the grand Best Drama to "Strange Tales"; 2026 Korea Times snippet mentions The Legend of Kitchen Soldier and Bon Appétit, Your Majesty among CJ ENM national wins — not counted).
- **SDA-K** ("Outstanding Korean Drama") is probably not a pure jury award; consider excluding it from the count. Without SDA-K: The Glory 5, Tangerines 4, Moving 3, Trauma Code 3, Extraordinary Attorney Woo 3, Crash Landing on You 2, The Red Sleeve 2.
- Snippets were never counted as placements.
