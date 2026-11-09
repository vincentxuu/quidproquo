# Japanese scripted TV (日劇) candidates — Category C (ratings) / D (viewing data) / E (buzz/demand)

Collected 2026-11-09 for the zh-TW series「各國影劇導讀」. Data file only — no article copy.
Scope: Japanese-produced scripted live-action series (terrestrial 民放/NHK, WOWOW, Japanese streaming originals). Anime / variety / reality / films excluded (see §4). D/E focus 2016–2026; C lists keep older classics.
Tools: Groundlane `web_fetch` / `web_search` / `web_extract` (primary); Exa `web_fetch_exa` (fallback for IMDb, Netflix, ORICON Shift_JIS page). See §6 toolDegradation.

## 1. Sources

Read status: **read** = page body fetched and parsed; **partial** = fetched but only part of the needed data present; **snippet** = only a search-result excerpt seen (shown in tags but **not counted**); **unread** = blocked / not reachable / not attempted.

| Key | Source | URL | Read status | What was extracted |
|---|---|---|---|---|
| IMDb | IMDb advanced search: TV series + mini-series, country = Japan, **genre ≠ Animation**, ≥1,000 votes, sorted by user rating (top 100) | https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&countries=JP&genres=!animation&sort=user_rating,desc&num_votes=1000,&count=100 | read (Exa) | Rating + votes. Threshold lowered to 1,000 because the ≥5,000 list (also read: https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&countries=JP&sort=user_rating,desc&num_votes=5000,&count=100) is ~97% anime and contains only 3 live-action JP-tagged series (Midnight Diner: Tokyo Stories 8.4/5.7K, First Love 8.4/7.1K, One Piece 2023 8.3/212K). Cut-off of the ≥1,000 list ≈ 7.4. Unscripted / non-Japanese rows dropped (§4) |
| MDL | MyDramaList "Top Japanese Dramas" pages 1–3 (ranks 1–60) + show pages for ranks 1–20 | https://mydramalist.com/shows/top_japanese_dramas (?page=2, ?page=3) | read; "scored by" counts for ranks 1–20 via `web_extract` | Rank, score, ratings count (1–20). MDL ranks seasons/specials separately |
| FMA23 / FMA24 / FMA25 | Filmarks Awards (年間; Clip!/Mark!/★ combined) — via pixiin.com history page; 2025 nominee list cross-checked on Filmaga | https://pixiin.com/ranking-filmarks-awards-all/ ; https://filmaga.filmarks.com/articles/329270/ | read (pixiin = secondary aggregator); Filmaga 2025 headings read | 2023 "日本ドラマ・ベスト" ranked 1–20 (#7 missing on pixiin page); 2024 TVドラマ部門 + 配信ドラマ部門 (winner + 9 nominees, unranked); 2025 TVドラマ部門 (winner + 9 nominees, unranked; no 配信 category in 2025) |
| FM-list | Filmarks 日本ドラマ list (おすすめ順) | https://filmarks.com/list-drama/country/144 | partial — reachable but order is "おすすめ順" (undocumented algorithm), no 高評価 sort exposed | not used |
| FMQ | Filmarks seasonal 国内ドラマ満足度 rankings (冬/春/夏 2025 etc.) | https://prtimes.jp/main/html/rd/p/000000591.000008641.html ; https://prtimes.jp/main/html/rd/p/000000558.000008641.html | snippet | 2025 冬 #1 ホットスポット ★4.21 / 19,316 Mark!; 2025 春 #1 波うららかに、めおと日和 ★4.28 / 3,358 Mark!; 2025 夏 #1 彩香ちゃんは弘子先輩に恋してる 2nd Stage — **not counted** |
| DB | Douban 日剧 | https://m.douban.com/subject_collection/1256 (rexxar API) | unread (API 400 `invalid_request_1284`); only listicle snippets | — |
| VR23 / VR24 / VR25 | Video Research「民放ドラマまとめ」— 関東地区, 民放 regular dramas, per-episode top 20 for 総合 / リアルタイム / タイムシフト | https://www.videor.co.jp/digestplus/article/tv240911-2.html ; https://www.videor.co.jp/digestplus/article/tv250130.html ; https://www.videor.co.jp/digestplus/article/tv260129-2.html | read | Rank + 世帯 % (総合 table used for the tag unless noted). Per-episode peaks, not series averages. NHK excluded |
| VRR | Video Research「令和版 ドラマ視聴率ランキング」— 2019-05-01 → 2026-06-30, 19–24時 regular dramas incl. NHK, 関東 | https://www.videor.co.jp/digestplus/article/tv231219.html | read | 総合 top 30, リアルタイム top 30, タイムシフト top 30 (rank + 世帯 %) |
| DRM | ドラマン「歴代ドラマ視聴率情報」— 年間平均世帯視聴率 top 3 per year 2003–2023 + latest five cours (2025-07 → 2026-07) | https://doraman.net/sp/index_rank | read (secondary aggregator of Video Research 関東 averages) | Series **average** 世帯 %; no 2024/2025 annual block on the page (only cours) |
| TK25 | 東洋経済「25年の年間ドラマ視聴率ランキング」 | https://toyokeizai.net/articles/-/925200?display=b | partial (page 1 of 5 only; ranking body not reached) | Says TBS 日曜劇場 took 4 of top 5, テレ朝 5 of top 10 — no per-show numbers extracted |
| TVA20…TVA25 | TVerアワード 2020–2025 (TVer 総再生数, TVer DATA MARKETING / Video Research) — one key per year | 2025: https://prtimes.jp/main/html/rd/p/000000486.000002492.html ; 2024: https://prtimes.jp/main/html/rd/p/000000413.000002492.html ; 2023: https://prtimes.jp/main/html/rd/p/000000323.000002492.html ; 2022: https://prtimes.jp/main/html/rd/p/000000193.000002492.html ; 2021: https://prtimes.jp/main/html/rd/p/000000122.000002492.html ; 2020: https://www.screens-lab.jp/article/26562 | read (2020 = page meta description only → **partial**, still counted: the description states the award) | Drama awards + 総再生数 where stated |
| NFAT | Netflix Tudum "Top 10 Most Popular Non-English Shows of All Time" | https://www.netflix.com/tudum/top10/most-popular/tv-non-english | read (Exa) — **no Japanese title** in the 10 | — |
| NF23H2 / NF24H1 / NF24H2 / NF25H2 / NF26H1 | Netflix "What We Watched" engagement-report pages | https://about.netflix.com/en/news/what-we-watched-the-second-half-of-2023 ; …-first-half-of-2024 ; …-second-half-of-2024 ; …-second-half-of-2025 ; …-first-half-of-2026 | read (Exa) | Named Japanese live-action series + views. NF25H1 (https://about.netflix.com/en/news/what-we-watched-the-first-half-of-2025) also read: only a Japanese **film** (Bullet Train Explosion 33M) and anime named → no row |
| NF23H1 | Netflix first engagement report (Jan–Jun 2023) | http://about.netflix.com/en/news/what-we-watched-a-netflix-engagement-report | snippet (mentions Alice in Borderland as "returning favorite", no number) | not counted |
| CA25 | ContentAsia analysis of Netflix 2025 non-English weekly top 10 | https://www.contentasia.tv/features/exclusive-asian-series-dominate-netflixs-2025-global-non-english-tv-top-10 | snippet | Last Samurai Standing premiered #2 global non-English (10–16 Nov 2025, 31.7M hours); Alice in Borderland the only live-action Japanese global hit named — **not counted** |
| VAR | Variety on Alice in Borderland S3 order (2023-09-28) | https://variety.com/2023/tv/news/alice-in-borderland-japan-series-third-season-netflix-1235737316/ | snippet | S2 "Netflix Japan's most-watched title ever… 200 million viewing hours" — **not counted** |
| FLX | FlixPatrol "Most watched TV shows from Japan 2025" | https://flixpatrol.com/most-watched/2025/tv-shows-from-japan/ | unread (Groundlane browser-challenge fail; Exa 403; Tavily extract fail; jina = Cloudflare challenge page) | — |
| ORI25 | ORICON NEWS「2025年ドラマ」年間 満足度ランキング TOP10 (690-person monitor panel, 地上波 non-late-night) | https://www.oricon.co.jp/news/2427637/full/ (also https://www.oricon.co.jp/special/73668/) | read (Exa; Groundlane returned mojibake Shift_JIS) | Rank + 総合満足度スコア. Searched for a 2024 annual edition — none found (2025 appears to be the first annual table) |
| YSA | Yahoo!検索大賞 ドラマ部門 winners 2014–2025 (search-volume growth) | https://ja.wikipedia.org/w/index.php?title=Yahoo!%E6%A4%9C%E7%B4%A2%E5%A4%A7%E8%B3%9E&action=raw | read (Wikipedia wikitext, cites Yahoo/ORICON/mynavi releases) | One winner per year |
| PAR26 | Parrot Analytics, "Anime Enters the Global Franchise Era as Live-Action Adaptations Surge Worldwide" (2026-06-25) | https://www.parrotanalytics.com/insights/anime-enters-the-global-franchise-era-as-live-action-adaptations-surge-worldwide/ | read | Titles "driving the category's 2025 performance": Alice in Borderland, Gannibal, City Hunter (film), Demon City (film), Drops of God (FR/JP co-pro) |
| PAR-GDA | Parrot Global Demand Awards (2021–2025) | (see kr file §1, P21–P25) | not re-read for JP; kr reading found no Japanese **live-action** winner (anime winners only, e.g. Jujutsu Kaisen 2023) | — |
| GEM | GEM Partners エンタメリーチトラッカー (配信オリジナル monthly TOP10 via 日経クロストレンド) | https://xtrend.nikkei.com/atcl/contents/watch/00013/02937/ | snippet (paywalled; monthly, no annual drama table) | — |
| TVJ | ザテレビジョン 視聴熱 年間ランキング | — | unread (not attempted; no annual drama URL surfaced in search) | — |

Key counting: one key per report/year (VR23/VR24/VR25, TVA20–25, NF half-years, FMA23/24/25 are separate keys), mirroring the kr/us files. VR23/24/25, VRR and DRM all rest on Video Research 関東 panel data, and TVA keys are all TVer — see §5 before ranking by "independent families".

## 2. Coverage check — biggest names × source families

| Show | IMDb | MDL | Video Research (VR*/VRR/DRM) | TVer (TVA) | Netflix (NF*) | Filmarks (FMA) | ORICON / Yahoo / Parrot |
|---|---|---|---|---|---|---|---|
| VIVANT | – (not in top 100) | – (not in top 60) | VR23 #1 29.8%; VRR #3; DRM 2023 #1 14.3% | 2023 特別賞 + Yahoo!検索賞 | n/a | 2023 #2 | YSA 2023 |
| 半沢直樹 | 8.4 (2.8K) | #16 / S2 #40 | VRR #1 44.1%; DRM 2013 #1, 2020 #1 | – (2020 award went to 恋つづ) | n/a | – | YSA 2020 |
| Alice in Borderland | 7.8 (154K) | #2 S2 / #3 S1 | n/a | n/a | H2 2025 S3 25M | – | PAR26 |
| ミステリと言う勿れ | – | #19 | VRR #12 25.8% (TS #2) | 2022 特別賞; 2025 名作ドラマ賞 | n/a | – | – |
| silent | – | #14 | – (not in any VR table read; 2022 annual VR table not available) | 2022 大賞 7,300万 | n/a | – | – |
| First Love 初恋 | 8.4 (7.1K) | #6 | n/a | n/a | – (no NF report names it) | – | – |
| 逃げるは恥だが役に立つ | 7.8 (2.9K) | – | – (2016 not in DRM top 3) | 2021 特別賞 (新春SP) | n/a | – | – |

"–" = checked, absent. "n/a" = metric does not apply. Two very different populations show up: (a) 民放 prime-time hits (日曜劇場, テレ朝 procedural franchises) that dominate VR/DRM but are near-absent from IMDb/MDL; (b) Netflix originals, BL and manga adaptations that dominate IMDb/MDL but have no TV rating. Only a handful (半沢直樹, ミステリと言う勿れ, 恋はつづくよどこまでも, ブラッシュアップライフ, ラ・グランメゾン東京, MIU404) bridge both.

## 3. Candidate table

Distinct-source count uses the keys in §1; snippet keys (FMQ, CA25, VAR, NF23H1, DB) are shown but not counted. Rows sorted by count, then first-air year.
**†** after a title = that Japanese or English title was supplied from memory (not printed in any read source). **First-air year and network are from memory (unsourced) for every row** except where a VR/TVA/Netflix source prints the broadcaster/platform (VR rows: network as printed in the VR table). Franchises/seasons are merged into one row (noted in the row).

Shows with ≥3 sources: VIVANT (6); 半沢直樹, 相棒 (5); ミステリと言う勿れ, 恋はつづくよどこまでも, ブラッシュアップライフ, ラストマン, 海のはじまり, 御上先生, じゃあ、あんたが作ってみろよ, ホットスポット, 今際の国のアリス, ガンニバル (4); ドクターX, Code Blue, ガリレオ, ラ・グランメゾン東京, ハヤブサ消防団, アンチヒーロー, 不適切にもほどがある！, アンメット, 幽☆遊☆白書, 波うららかに、めおと日和, ザ・ロイヤルファミリー, 緊急取調室 (3). Total: 230 titles in 195 table rows (some 1-source titles bundled per row; rows numbered 1–196, #120 removed) — 1 source: 140; 2: 65; 3: 12; 4: 10; 5: 2; 6: 1.

| # | 日文片名 | English title | First-air | Network/platform | Genre | Evidence tags | Distinct sources | Keys |
|---|---|---|---|---|---|---|---|---|
| 1 | VIVANT（S1 / S2） | VIVANT | 2023 (S2 2026) | TBS 日曜劇場 | espionage thriller | `D VR23 総合 #1 最終回 世帯 29.8% (個人 20.0)`; `D VRR 令和 総合 #3 29.8%, RT #4 19.6%, TS #3 13.8%`; `D DRM 2023 年間平均 #1 14.3%; 2026-07 cour #1 VIVANT2(前期) 16.3%`; `D TVerアワード2023 特別賞 (ep5 = ドラマエピソード 8日間再生 #1) + Yahoo!検索賞`; `E Yahoo!検索大賞2023 ドラマ部門`; `C Filmarks 2023 日本ドラマ #2` | 6 | DRM, FMA23, TVA23, VR23, VRR, YSA |
| 2 | 半沢直樹（2013 / 2020） | Hanzawa Naoki | 2013 (S2 2020) | TBS 日曜劇場 | corporate drama | `C IMDb 8.4 (2.8K)`; `C MDL #16 8.5 (2,944); S2 #40 8.4`; `D VRR 令和 総合 #1 最終回 44.1% (RT 32.7%, TS #1 16.8%)`; `D DRM 2013 #1 29.1%; 2020 #1 24.8% (半沢直樹2)`; `E Yahoo!検索大賞2020 ドラマ部門` | 5 | DRM, IMDb, MDL, VRR, YSA |
| 3 | 相棒（season 17–24 etc.） | Aibou† | 2000– | テレビ朝日 | police procedural | `D VR25 #8 15.0%`; `D VR24 #9 17.3% (S22 最終回)`; `D VR23 #7 18.9% (S21 最終回)`; `D VRR 総合 #25 23.9% (S18 60周年SP)`; `D DRM 2017 #3 S15後期 15.3%; 2018 #3 S17前期 15.3%; 2019 #2 15.3%, #3 14.6%; 2022 #2 13.8%, #3 13.5%; 2023 #2 13.0%; 2025-10 cour #2 9.6%` | 5 | DRM, VR23, VR24, VR25, VRR |
| 4 | ミステリと言う勿れ | Don't Call It Mystery | 2022 | フジテレビ (月9) | mystery | `C MDL #19 8.5 (3,628)`; `D VRR 総合 #12 25.8%; TS #2 15.4%; RT #30 13.2%`; `D TVerアワード2022 特別賞 (ep1 当時の最高再生記録)`; `D TVerアワード2025 名作ドラマ賞 (2025年 過去ドラマ総再生 #1)` | 4 | MDL, TVA22, TVA25, VRR |
| 5 | 恋はつづくよどこまでも | An Incurable Case of Love | 2020 | TBS 火曜ドラマ | medical romcom | `C IMDb 7.4 (2.6K)`; `C MDL #54 8.3`; `D VRR 総合 #21 最終回 25.3%; TS #12`; `D TVerアワード2020 ドラマ大賞 + ドラマエピソード賞 (partial: meta description)` | 4 | IMDb, MDL, TVA20, VRR |
| 6 | ブラッシュアップライフ | Rebooting | 2023 | 日本テレビ | time-loop comedy | `C IMDb 8.5 (1.8K)`; `C MDL #20 8.5 (2,432)`; `D VR23 総合 #15 14.3%; TS #6`; `C Filmarks 2023 日本ドラマ #1` | 4 | FMA23, IMDb, MDL, VR23 |
| 7 | ラストマン－全盲の捜査官－ | Last Man† | 2023 | TBS 日曜劇場 | detective | `D VR23 総合 #2 24.2%; RT #2; TS #2 (最終回)`; `D VRR 総合 #23 24.2%; RT #22; TS #20`; `D DRM 2023 #3 12.9%`; `C Filmarks 2023 日本ドラマ #14` | 4 | DRM, FMA23, VR23, VRR |
| 8 | 海のはじまり | Where Does the Sea Begin | 2024 | フジテレビ (月9) | family drama | `C MDL #31 8.4`; `D VR24 総合 #10 16.8%; TS #5`; `D TVerアワード2024 ドラマ大賞 (総再生 7,200万超)`; `C Filmarks Awards 2024 TVドラマ部門 nominee` | 4 | FMA24, MDL, TVA24, VR24 |
| 9 | 御上先生 | — | 2025 | TBS 日曜劇場 | school / bureaucracy drama | `D VR25 総合 #2 20.0%; RT #2; TS #1`; `D TVerアワード2025 ドラマ優秀賞`; `E ORICON 2025 満足度 #2 (3.55)`; `C Filmarks Awards 2025 TVドラマ nominee` | 4 | FMA25, ORI25, TVA25, VR25 |
| 10 | じゃあ、あんたが作ってみろよ | — | 2025 | TBS 火曜ドラマ | romcom | `D VR25 総合 #5 最終回 16.1%; TS #5`; `D TVerアワード2025 ドラマ大賞 (総再生 6,100万超)`; `E ORICON 2025 満足度 #4 (3.54)`; `C Filmarks Awards 2025 TVドラマ nominee` | 4 | FMA25, ORI25, TVA25, VR25 |
| 11 | ホットスポット | The Hot Spot | 2025 | 日本テレビ | alien comedy | `C IMDb 7.9 (1.4K)`; `D VR25 総合 #17 12.7%; TS #5 最終回`; `E ORICON 2025 満足度 #6 (3.52)`; `C Filmarks Awards 2025 TVドラマ部門 最優秀賞`; `C Filmarks 2025冬 満足度 #1 ★4.21 (snippet)` | 4 | FMA25, IMDb, ORI25, VR25 |
| 12 | 今際の国のアリス（S1–S3） | Alice in Borderland | 2020 (S2 2022, S3 2025) | Netflix | survival thriller | `C IMDb 7.8 (154K)`; `C MDL S2 #2 8.9 (61,941); S1 #3 8.9 (99,760)`; `D Netflix H2 2025 S3 25M ("third and final season")`; `E Parrot 2026: leads live-action-from-anime-IP demand 2025`; `D Variety: S2 200M hours (snippet)`; `D ContentAsia: only live-action JP global hit 2025 (snippet)` | 4 | IMDb, MDL, NF25H2, PAR26 |
| 13 | ガンニバル（S1–S2） | Gannibal | 2022 | Disney+ | horror thriller | `C IMDb 7.4 (3.2K)`; `C MDL #55 8.3`; `C Filmarks 2023 日本ドラマ #4`; `E Parrot 2026: #2 driver of live-action-from-anime-IP demand 2025` | 4 | FMA23, IMDb, MDL, PAR26 |
| 14 | ドクターX～外科医・大門未知子～ | Doctor X | 2012– | テレビ朝日 | medical | `C IMDb 7.6 (1.1K)`; `D VRR 総合 #5 最終回 31.0% (2019, 開局60周年); RT #7`; `D DRM 年間平均 #1 in 2012 (18.9%), 2014 (22.8%), 2016 (21.5%), 2017 (20.7%), 2019 (18.4%), 2021 (16.4%); #2 2013 (22.7%)` | 3 | DRM, IMDb, VRR |
| 15 | コード・ブルー -ドクターヘリ緊急救命- | Code Blue | 2008 (S3 2017) | フジテレビ (月9) | medical | `C IMDb 7.5 (1.6K)`; `C MDL S3 #29 8.4`; `E Yahoo!検索大賞2017 ドラマ部門` | 3 | IMDb, MDL, YSA |
| 16 | ガリレオ | Galileo | 2007 (S2 2013) | フジテレビ (月9) | science mystery | `C IMDb 7.4 (1.4K)`; `D DRM 2007 #2 21.9%; 2013 #3 19.8%`; `D TVerアワード2022 特別賞 (過去作品)` | 3 | DRM, IMDb, TVA22 |
| 17 | グランメゾン東京 | La Grande Maison Tokyo | 2019 | TBS 日曜劇場 | culinary drama | `C IMDb 7.8 (1.5K)`; `C MDL #50 8.3`; `D VRR 総合 #9 最終回 26.3%; TS #4 14.3%; RT #15` | 3 | IMDb, MDL, VRR |
| 18 | ハヤブサ消防団 | — | 2023 | テレビ朝日 | rural mystery | `D VR23 総合 #4 最終回 20.2%; TS #3`; `D VRR TS #24 10.7%`; `C Filmarks 2023 日本ドラマ #18` | 3 | FMA23, VR23, VRR |
| 19 | アンチヒーロー | — | 2024 | TBS 日曜劇場 | legal thriller | `D VR24 総合 #1 最終回 21.2%; RT #1; TS #1`; `D VRR TS #29 10.5%`; `C Filmarks Awards 2024 TVドラマ nominee` | 3 | FMA24, VR24, VRR |
| 20 | 不適切にもほどがある！ | Extremely Inappropriate!† | 2024 | TBS 金曜ドラマ | time-slip comedy | `D VR24 総合 #5 17.3%; TS #1`; `D VRR TS #29`; `C Filmarks Awards 2024 TVドラマ部門 最優秀賞` | 3 | FMA24, VR24, VRR |
| 21 | アンメット ある脳外科医の日記 | Unmet: A Neurosurgeon's Diary | 2024 | フジテレビ | medical | `C MDL #30 8.4`; `D VR24 TS #20 7.2% (最終回)`; `C Filmarks Awards 2024 TVドラマ nominee` | 3 | FMA24, MDL, VR24 |
| 22 | 幽☆遊☆白書 | Yu Yu Hakusho | 2023 | Netflix | action fantasy | `D Netflix H2 2023 17M ("stand-out")`; `D Netflix H1 2024 8M`; `C Filmarks Awards 2024 配信ドラマ nominee` | 3 | FMA24, NF23H2, NF24H1 |
| 23 | 波うららかに、めおと日和 | — | 2025 | フジテレビ 木曜劇場 | period romance | `E ORICON 2025 満足度 #1 (3.61)`; `C Filmarks Awards 2025 TVドラマ nominee`; `D VR25 TS #18 最終回 6.1%`; `C Filmarks 2025春 満足度 #1 ★4.28 (snippet)` | 3 | FMA25, ORI25, VR25 |
| 24 | ザ・ロイヤルファミリー | — | 2025 | TBS 日曜劇場 | horse-racing family saga | `D VR25 総合 #3 最終回 18.5%; RT #4; TS #4`; `D DRM 2025-10 cour #1 10.6%`; `E ORICON 2025 満足度 #7 (3.49)` | 3 | DRM, ORI25, VR25 |
| 25 | 緊急取調室（S5） | — | 2014 (S5 2025) | テレビ朝日 | interrogation procedural | `D VR25 総合 #7 16.5%; RT #6`; `D DRM 2025-10 cour #3 9.0%`; `E ORICON 2025 満足度 #8 (3.45)` | 3 | DRM, ORI25, VR25 |
| 26 | 1リットルの涙 | 1 Litre of Tears / One Liter of Tears | 2005 | フジテレビ† | medical melodrama | `C IMDb 8.7 (3.3K)`; `C MDL #1 8.9 (21,349)` | 2 | IMDb, MDL |
| 27 | 白い巨塔 | The Great White Tower | 2003 | フジテレビ† | medical drama | `C IMDb 8.7 (1.5K)`; `D DRM 2003 #2 第一部 21.1%; 2004 #1 第二部 26.2%` | 2 | DRM, IMDb |
| 28 | 深夜食堂 / 深夜食堂 -Tokyo Stories- | Midnight Diner / Midnight Diner: Tokyo Stories | 2009 (Netflix 2016–) | MBS/TBS† → Netflix | slice-of-life anthology | `C IMDb 8.6 (4.1K); Tokyo Stories 8.4 (5.7K)`; `C MDL #60 8.3` | 2 | IMDb, MDL |
| 29 | First Love 初恋 | First Love | 2022 | Netflix | romance | `C IMDb 8.4 (7.1K)`; `C MDL #6 8.6 (16,125)` | 2 | IMDb, MDL |
| 30 | アンナチュラル | Unnatural | 2018 | TBS† | forensic mystery | `C IMDb 8.1 (3K)`; `C MDL #8 8.5 (5,968)` | 2 | IMDb, MDL |
| 31 | MIU404 | MIU404 | 2020 | TBS 金曜ドラマ | police buddy | `C MDL #22 8.5`; `D VRR 総合 #21 最終回 24.8%; TS #10; RT #28` | 2 | MDL, VRR |
| 32 | 未成年〜未熟な俺たちは不器用に進行中〜† | Our Youth | 2024 | — | BL / school | `C IMDb 8.5 (1.4K)`; `C MDL #24 8.5` | 2 | IMDb, MDL |
| 33 | グラスハート | Glass Heart | 2025 | Netflix | music drama | `C IMDb 8.1 (1.9K)`; `C MDL #11 8.5 (7,693)` | 2 | IMDb, MDL |
| 34 | 3年A組 ―今から皆さんは、人質です― | Mr. Hiiragi's Homeroom | 2019 | 日本テレビ† | school thriller | `C IMDb 7.4 (2.1K)`; `C MDL #12 8.5 (9,347)` | 2 | IMDb, MDL |
| 35 | 僕だけがいない街 | Erased | 2017 | Netflix | time-slip mystery | `C IMDb 7.8 (5K)`; `C MDL #41 8.4` | 2 | IMDb, MDL |
| 36 | コンフィデンスマンJP | The Confidence Man JP | 2018 | フジテレビ (月9)† | caper comedy | `C IMDb 7.5 (1.1K)`; `C MDL #45 8.3` | 2 | IMDb, MDL |
| 37 | 今日から俺は!! | From Today, It's My Turn!! | 2018 | 日本テレビ† | delinquent comedy | `C IMDb 7.6 (1.3K)`; `C MDL #32 8.4` | 2 | IMDb, MDL |
| 38 | JIN-仁-（完結編含む） | Jin | 2009 (S2 2011) | TBS 日曜劇場† | time-slip medical | `C IMDb 8.0 (1.8K)`; `C MDL S2 #42 8.4; S1 #52 8.3` | 2 | IMDb, MDL |
| 39 | ライアーゲーム | Liar Game | 2007 (S2 2009) | フジテレビ† | psychological game | `C IMDb 8.0 (2.7K)`; `C MDL S2 #34 8.4` | 2 | IMDb, MDL |
| 40 | 仮面ライダーW | Kamen Rider W | 2009 | テレビ朝日† | tokusatsu | `C IMDb 8.3 (1.1K)`; `C MDL #26 8.4` | 2 | IMDb, MDL |
| 41 | 仮面ライダービルド | Kamen Rider Build | 2017 | テレビ朝日† | tokusatsu | `C IMDb 8.5 (1.3K)`; `C MDL #37 8.4` | 2 | IMDb, MDL |
| 42 | 私の夫と結婚して（日本版） | Marry My Husband (Japan) | 2025 | Prime Video† | revenge romance | `C IMDb 7.7 (1.7K)`; `C MDL #36 8.4`. (Filmarks 2024 配信 nominee「私の夫と結婚して」is the **Korean** 2024 original — not counted here) | 2 | IMDb, MDL |
| 43 | トリリオンゲーム | Trillion Game | 2023 | TBS 金曜ドラマ | startup caper | `C MDL #44 8.3`; `D VR23 総合 #20 14.3%; TS #12` | 2 | MDL, VR23 |
| 44 | 99.9-刑事専門弁護士-（S2） | 99.9 Criminal Lawyer | 2016 (S2 2018) | TBS 日曜劇場† | legal | `C MDL S2 #46 8.3`; `D DRM 2018 #1 SEASON II 17.4%` | 2 | DRM, MDL |
| 45 | ライオンの隠れ家 | Light of My Lion | 2024 | TBS 金曜ドラマ | family suspense | `C MDL #15 8.5 (3,211)`; `D VR24 総合 #12 最終回 15.4%; TS #7` | 2 | MDL, VR24 |
| 46 | イクサガミ | Last Samurai Standing | 2025 | Netflix | samurai battle royale | `C IMDb 7.5 (23K)`; `D Netflix H2 2025 S1 21M`; `D ContentAsia: global non-English #2 premiere week 31.7M h (snippet)` | 2 | IMDb, NF25H2 |
| 47 | 地獄に堕ちるわよ† | Straight to Hell | 2026 | Netflix | biopic (細木数子) | `C IMDb 7.7 (2.1K)`; `D Netflix H1 2026 S1 10M` | 2 | IMDb, NF26H1 |
| 48 | 地面師たち | Tokyo Swindlers | 2024 | Netflix | crime | `D Netflix H2 2024 12M`; `C Filmarks Awards 2024 配信ドラマ部門 最優秀賞` | 2 | FMA24, NF24H2 |
| 49 | サンクチュアリ -聖域- | Sanctuary | 2023 | Netflix | sumo drama | `C IMDb 8.0 (5.5K)`; `C Filmarks 2023 日本ドラマ #3` | 2 | FMA23, IMDb |
| 50 | 舞妓さんちのまかないさん | The Makanai: Cooking for the Maiko House | 2023 | Netflix | food slice-of-life | `C IMDb 7.9 (3.7K)`; `C Filmarks 2023 日本ドラマ #6` | 2 | FMA23, IMDb |
| 51 | 逃げるは恥だが役に立つ | The Full-Time Wife Escapist | 2016 | TBS 火曜ドラマ | contract-marriage romcom | `C IMDb 7.8 (2.9K)`; `D TVerアワード2021 特別賞 (新春SP = 2021 単発ドラマ再生 #1)` | 2 | IMDb, TVA21 |
| 52 | GTO（1998）/ GTOリバイバル（2024） | GTO: Great Teacher Onizuka | 1998 (SP 2024) | 関西テレビ/フジ | school | `C IMDb 8.4 (4.2K) (1998)`; `D TVerアワード2024 特別賞 (リバイバル = 単発ドラマ総再生 #1)` — franchise merge | 2 | IMDb, TVA24 |
| 53 | HERO | Hero | 2001 (S2 2014) | フジテレビ (月9)† | legal | `C IMDb 7.8 (1.2K)`; `D DRM 2014 #2 21.0%` | 2 | DRM, IMDb |
| 54 | 花より男子（1・2） | Boys Over Flowers (1, 2) | 2005 / 2007 | TBS† | school romance | `C IMDb 8.0 (3.9K); 2: 7.8 (2.1K)`; `D DRM 2007 #3 花より男子2 21.5%` | 2 | DRM, IMDb |
| 55 | ごくせん | Gokusen | 2002–2008 | 日本テレビ† | school comedy | `C IMDb 7.4 (2.3K)`; `D DRM 2005 #1 ごくせん2 27.8%` | 2 | DRM, IMDb |
| 56 | 電車男 | Train Man | 2005 | フジテレビ† | romcom | `C IMDb 8.0 (1.3K)`; `D DRM 2005 #3 21.0%` | 2 | DRM, IMDb |
| 57 | マイ★ボス マイ★ヒーロー | My Boss, My Hero | 2006 | 日本テレビ† | school comedy | `C IMDb 8.1 (1.8K)`; `D DRM 2006 #3 19.1%` | 2 | DRM, IMDb |
| 58 | 華麗なる一族 | The Family | 2007 | TBS 日曜劇場† | family saga | `C IMDb 7.4 (1.1K)`; `D DRM 2007 #1 24.3%` | 2 | DRM, IMDb |
| 59 | 結婚できない男 / まだ結婚できない男 | He Who Can't Marry | 2006 / 2019 | フジテレビ | romcom | `C IMDb 7.9 (1.3K)`; `D VRR TS #22 11.8% (まだ結婚できない男 2019)` | 2 | IMDb, VRR |
| 60 | ドラゴン桜（2005 / 2021） | Dragon Sakura | 2005 / 2021 | TBS 日曜劇場 | school | `C IMDb 7.7 (2.1K)`; `D VRR 総合 #4 最終回 28.9%; RT #3 20.4%; TS #11` | 2 | IMDb, VRR |
| 61 | 天国と地獄 ～サイコな2人～ | — | 2021 | TBS 日曜劇場 | body-swap thriller | `D VRR 総合 #7 最終回 29.4%; RT #8; TS #24`; `D DRM 2021 #3 15.3%` | 2 | DRM, VRR |
| 62 | あなたの番です（反撃編） | — | 2019 | 日本テレビ | mystery | `D VRR 総合 #8 最終回 25.0%; RT #4 19.4%; TS #22`; `E Yahoo!検索大賞2019 ドラマ部門` | 2 | VRR, YSA |
| 63 | 私の家政夫ナギサさん | — | 2020 | TBS 火曜ドラマ | romcom | `D VRR 総合 #9 最終回 30.5%; RT #12; TS #8`; `D DRM 2020 #3 15.0%` | 2 | DRM, VRR |
| 64 | 日本沈没―希望のひと― | — | 2021 | TBS 日曜劇場 | disaster | `D VRR 総合 #15 26.3%; RT #15; TS #13`; `D DRM 2021 #2 15.7%` | 2 | DRM, VRR |
| 65 | DCU | DCU† | 2022 | TBS 日曜劇場 | underwater crime | `D VRR 総合 #12 26.5%; RT #13; TS #17`; `D DRM 2022 #1 14.5%` | 2 | DRM, VRR |
| 66 | BG～身辺警護人～ | — | 2018 (S2 2020) | テレビ朝日 | bodyguard action | `D VRR 総合 #20 最終回 25.9%; RT #20`; `D DRM 2020 #2 15.4%` | 2 | DRM, VRR |
| 67 | 教場 / 風間公親―教場0― | — | 2020 SP / 2023 | フジテレビ | police academy | `D VRR 総合 #19 教場 前編 23.5%; RT #18`; `D VR23 総合 #3 教場0 21.0%; RT #4; TS #4` — franchise merge | 2 | VR23, VRR |
| 68 | 鎌倉殿の13人 | — | 2022 | NHK 大河 | period | `D VRR 総合 #17 25.8%; RT #11`; `E Yahoo!検索大賞2022 ドラマ部門` | 2 | VRR, YSA |
| 69 | 真田丸 | — | 2016 | NHK 大河 | period | `D DRM 2016 #2/#3 17.7% (01月期・04月期)`; `E Yahoo!検索大賞2016 ドラマ部門` | 2 | DRM, YSA |
| 70 | 豊臣兄弟！ | — | 2026 | NHK 大河 | period | `D VRR RT #30 13.5%`; `D DRM 2026-01 cour #1 12.1%; 04 #1 11.3%; 07 #2 10.4%` | 2 | DRM, VRR |
| 71 | べらぼう～蔦重栄華乃夢噺～ | — | 2025 | NHK 大河 | period | `E ORICON 2025 満足度 #10 (3.40)`; `D DRM 2025-07 cour #2 8.9%` | 2 | DRM, ORI25 |
| 72 | あんぱん | — | 2025 | NHK 朝ドラ | period | `C Filmarks Awards 2025 TVドラマ nominee`; `E Yahoo!検索大賞2025 ドラマ部門` | 2 | FMA25, YSA |
| 73 | 虎に翼 | — | 2024 | NHK 朝ドラ | legal period | `C Filmarks Awards 2024 TVドラマ nominee`; `E Yahoo!検索大賞2024 ドラマ部門` | 2 | FMA24, YSA |
| 74 | リブート | — | 2026 | TBS 日曜劇場 | thriller | `D VRR RT #27 13.3%`; `D DRM 2026-01 cour #2 11.0%` | 2 | DRM, VRR |
| 75 | クジャクのダンス、誰が見た？ | — | 2025 | TBS 金曜ドラマ | mystery | `D VR25 総合 #9 15.3%; TS #3`; `C Filmarks Awards 2025 TVドラマ nominee`; `C Filmarks 2025冬 #10 ★3.67 (snippet)` | 2 | FMA25, VR25 |
| 76 | しあわせな結婚 | — | 2025 | テレビ朝日 | marriage suspense | `D VR25 総合 #12 15.5%; TS #10`; `C Filmarks Awards 2025 TVドラマ nominee` | 2 | FMA25, VR25 |
| 77 | 続・続・最後から二番目の恋 | — | 2025 (S1 2012) | フジテレビ (月9) | romcom | `D VR25 総合 #6 16.5%; RT #7; TS #7`; `E ORICON 2025 満足度 #3 (3.55)` | 2 | ORI25, VR25 |
| 78 | 19番目のカルテ | — | 2025 | TBS 日曜劇場 | medical | `D VR25 総合 #4 18.2%; RT #3`; `D DRM 2025-07 cour #1 10.2%` | 2 | DRM, VR25 |
| 79 | キャスター | — | 2025 | TBS 日曜劇場 | newsroom drama | `D VR25 総合 #1 22.0%; RT #1 14.2%; TS #2`; `D VRR RT #24 14.2%` | 2 | VR25, VRR |
| 80 | 良いこと悪いこと | — | 2025 | 日本テレビ | mystery | `D VR25 総合 #13 最終回 12.2%`; `D TVerアワード2025 ドラマ優秀賞` | 2 | TVA25, VR25 |
| 81 | 大追跡～警視庁SSBC強行犯係～ | — | 2025 | テレビ朝日 | police | `D VR25 総合 #20 13.8%; RT #9`; `D DRM 2025-07 cour #3 8.5%` | 2 | DRM, VR25 |
| 82 | 家政夫のミタゾノ | — | 2016– | テレビ朝日 | comedy | `D VR25 総合 #15 13.6%`; `D VR23 総合 #15 14.5%` | 2 | VR23, VR25 |
| 83 | 新宿野戦病院 | — | 2024 | フジテレビ | medical comedy | `D VR24 総合 #8 17.9%; TS #3`; `C Filmarks Awards 2024 TVドラマ nominee` | 2 | FMA24, VR24 |
| 84 | 春になったら | — | 2024 | フジテレビ | family drama | `D VR24 総合 #20 13.2%; TS #20`; `C Filmarks Awards 2024 TVドラマ nominee` | 2 | FMA24, VR24 |
| 85 | 西園寺さんは家事をしない | — | 2024 | TBS 火曜ドラマ | romcom | `D VR24 TS #13 7.3%`; `C Filmarks Awards 2024 TVドラマ nominee` | 2 | FMA24, VR24 |
| 86 | あなたがしてくれなくても | — | 2023 | フジテレビ 木曜劇場 | marriage drama | `D TVerアワード2023 ドラマ大賞 (総再生 5,600万超)`; `D VR23 TS #18 最終回 8.0%` | 2 | TVA23, VR23 |
| 87 | 罠の戦争 | — | 2023 | フジテレビ | political revenge | `D VR23 総合 #11 17.0%; TS #6`; `C Filmarks 2023 日本ドラマ #11` | 2 | FMA23, VR23 |
| 88 | 最高の教師 1年後、私は生徒に■された | — | 2023 | 日本テレビ | school thriller | `D VR23 総合 #15 最終回 14.3%; TS #12`; `C Filmarks 2023 日本ドラマ #19` | 2 | FMA23, VR23 |
| 89 | いちばんすきな花 | — | 2023 | フジテレビ 木曜劇場 | ensemble drama | `D VR23 TS #17 7.9%`; `C Filmarks 2023 日本ドラマ #20` | 2 | FMA23, VR23 |
| 90 | silent | Silent | 2022 | フジテレビ 木曜劇場 | romance | `C MDL #14 8.5 (9,422)`; `D TVerアワード2022 ドラマ大賞 (再生 計7,300万超, TVer 歴代最高)` | 2 | MDL, TVA22 |
| 91 | 仮面ライダー クウガ / 555 / 龍騎 | Kamen Rider Kuuga / 555 / Ryuki | 2000 / 2003 / 2002 | テレビ朝日† | tokusatsu | `C IMDb Kuuga 8.3 (1K); 555 8.2 (1K); Ryuki 8.0 (1.2K)` | 1 | IMDb |
| 92 | 西遊記（1978） | Monkey | 1978 | 日本テレビ† | fantasy classic | `C IMDb 8.4 (2.4K)` | 1 | IMDb |
| 93 | おしん | Oshin | 1983 | NHK 朝ドラ† | period | `C IMDb 8.3 (1.3K)` | 1 | IMDb |
| 94 | 東京ラブストーリー | Tokyo Love Story | 1991 | フジテレビ (月9)† | romance | `C IMDb 8.3 (1.2K)` | 1 | IMDb |
| 95 | ロングバケーション | Long Vacation | 1996 | フジテレビ (月9)† | romance | `C IMDb 8.2 (1.8K)` | 1 | IMDb |
| 96 | のだめカンタービレ | Nodame Cantabile | 2006 | フジテレビ (月9)† | music romcom | `C IMDb 8.2 (2.7K)` | 1 | IMDb |
| 97 | プロポーズ大作戦 | Operation Proposal | 2007 | フジテレビ (月9)† | time-slip romcom | `C IMDb 8.2 (1.9K)` | 1 | IMDb |
| 98 | リーガル・ハイ | Legal High | 2012 | フジテレビ† | legal comedy | `C IMDb 8.4 (2.6K)` | 1 | IMDb |
| 99 | オレンジデイズ | Orange Days | 2004 | TBS 日曜劇場† | campus romance | `C IMDb 8.0 (1.2K)` | 1 | IMDb |
| 100 | 池袋ウエストゲートパーク | Ikebukuro West Gate Park | 2000 | TBS† | crime | `C IMDb 7.9 (1.5K)` | 1 | IMDb |
| 101 | 花ざかりの君たちへ～イケメン♂パラダイス～ | For You in Full Blossom | 2007 | フジテレビ† | school romcom | `C IMDb 7.9 (2.3K)` | 1 | IMDb |
| 102 | ウルトラマン | Ultraman | 1966 | TBS† | tokusatsu classic | `C IMDb 7.9 (1.3K)` | 1 | IMDb |
| 103 | 野ブタ。をプロデュース | Nobuta wo Produce | 2005 | 日本テレビ† | school | `C IMDb 7.6 (2.7K)` | 1 | IMDb |
| 104 | ホタルノヒカリ | Hotaru no Hikari | 2007 | 日本テレビ† | romcom | `C IMDb 7.4 (1.1K)` | 1 | IMDb |
| 105 | リッチマン、プアウーマン | Rich Man, Poor Woman | 2012 | フジテレビ (月9)† | romance | `C IMDb 7.4 (1.2K)` | 1 | IMDb |
| 106 | イタズラなKiss～Love in TOKYO | Mischievous Kiss: Love in Tokyo | 2013 | フジテレビTWO† | romcom | `C IMDb 7.5 (2K)` | 1 | IMDb |
| 107 | 火花 | Hibana | 2016 | Netflix | comedian drama | `C IMDb 7.7 (1.2K)` | 1 | IMDb |
| 108 | グッドモーニング・コール | Good Morning Call | 2016 | Netflix/フジ† | school romcom | `C IMDb 7.4 (4.2K)` | 1 | IMDb |
| 109 | カルテット | Quartet | 2017 | TBS† | ensemble drama | `C IMDb 7.8 (2K)` | 1 | IMDb |
| 110 | 野武士のグルメ | Samurai Gourmet | 2017 | Netflix† | food comedy | `C IMDb 8.0 (2.6K)` | 1 | IMDb |
| 111 | 100万円の女たち | Million Yen Women | 2017 | テレビ東京/Netflix† | mystery | `C IMDb 7.5 (2.3K)` | 1 | IMDb |
| 112 | 全裸監督 | The Naked Director | 2019 | Netflix | biopic | `C IMDb 7.6 (7.7K)` | 1 | IMDb |
| 113 | 30歳まで童貞だと魔法使いになれるらしい | Cherry Magic! | 2020 | テレビ東京† | BL romcom | `C IMDb 8.2 (3.8K)` | 1 | IMDb |
| 114 | ライフ 線上の僕ら† | Life: Love on the Line | 2020 | — | BL | `C IMDb 7.9 (1.5K)` | 1 | IMDb |
| 115 | 美しい彼 | My Beautiful Man | 2021 | MBS† | BL | `C IMDb 7.8 (2.9K)` | 1 | IMDb |
| 116 | 消えた初恋 | My Love Mix-Up! | 2021 | テレビ朝日† | school romcom | `C IMDb 8.0 (2.8K)` | 1 | IMDb |
| 117 | 不幸くんはキスするしかない！† | Mr. Unlucky Has No Choice but to Kiss! | 2022 | — | BL | `C IMDb 7.5 (1.2K)` | 1 | IMDb |
| 118 | オールドファッションカップケーキ† | Old Fashion Cupcake | 2022 | — | BL | `C IMDb 8.0 (1.6K)` | 1 | IMDb |
| 119 | 君には届かない。† | I Cannot Reach You | 2023 | — | BL | `C IMDb 7.7 (2K)` | 1 | IMDb |
| 121 | ジャックフロスト† | Jack o' Frost | 2023 | — | BL | `C IMDb 7.6 (1K)` | 1 | IMDb |
| 122 | （JP title not verified） | My Personal Weatherman | 2023 | — | BL | `C IMDb 7.6 (2K)` | 1 | IMDb |
| 123 | ひだまりが聴こえる† | I Hear the Sunspot | 2024 | — | BL | `C IMDb 8.1 (1.3K)` | 1 | IMDb |
| 124 | ロマンティック・アノニマス† | Romantics Anonymous | 2025 | Netflix | romance | `C IMDb 7.7 (2.4K)` | 1 | IMDb |
| 125 | 阿修羅のごとく（2025） | Asura | 2025 | Netflix | family drama | `C IMDb 7.6 (2K)`. (Filmarks 2025 監督Fan!賞 最優秀 = 是枝裕和 for this work — creator award, not counted) | 1 | IMDb |
| 126 | ソウルメイト† | Soul Mate | 2026 | Netflix | BL romance | `C IMDb 7.7 (1.3K)` | 1 | IMDb |
| 127 | 九条の大罪† | Sins of Kujo | 2026 | Netflix | legal crime | `D Netflix H1 2026 S1 9M` | 1 | NF26H1 |
| 128 | 修学旅行で仲良くないグループに入りました（+ After Story） | School Trip: Joined a Group I'm Not Close To | 2025 | — | BL | `C MDL #7 8.6 (19,878); After Story special #13 8.5 (6,328)` | 1 | MDL |
| 129 | Mother | Mother | 2010 | 日本テレビ† | drama | `C MDL #10 8.5 (3,269)` | 1 | MDL |
| 130 | 家族ゲーム（2013） | The Family Game | 2013 | フジテレビ† | dark comedy | `C MDL #17 8.5 (4,360)` | 1 | MDL |
| 131 | 僕のいた時間 | The Hours of My Life | 2014 | フジテレビ† | medical drama | `C MDL #18 8.5 (5,637)` | 1 | MDL |
| 132 | Fake Fact Lips（Special） | Fake Fact Lips Special | 2026 | — | BL special | `C MDL #21 8.5` (1-episode special) | 1 | MDL |
| 133 | 作りたい女と食べたい女（S1–S2） | She Loves to Cook, and She Loves to Eat | 2022 / 2024 | NHK† | GL slice-of-life | `C MDL S2 #23 8.5; S1 #43 8.4` | 1 | MDL |
| 134 | 天皇の料理番 | The Emperor's Cook | 2015 | TBS 日曜劇場† | period | `C MDL #25 8.5` | 1 | MDL |
| 135 | ウロボロス～この愛こそ、正義。 | Ouroboros | 2015 | TBS† | crime | `C MDL #27 8.4` | 1 | MDL |
| 136 | 放課後カルテ | After School Doctor | 2024 | 日本テレビ† | school medical | `C MDL #28 8.4` | 1 | MDL |
| 137 | それでも、生きてゆく | Still, Life Goes On | 2011 | フジテレビ† | drama | `C MDL #33 8.4` | 1 | MDL |
| 138 | とんび（2013） | Tonbi | 2013 | TBS 日曜劇場† | family | `C MDL #35 8.4` | 1 | MDL |
| 139 | 重版出来！ | Sleepeeer Hit! | 2016 | TBS† | workplace (manga editing) | `C MDL #38 8.4` | 1 | MDL |
| 140 | 海賊戦隊ゴーカイジャー | Kaizoku Sentai Gokaiger | 2011 | テレビ朝日† | tokusatsu | `C MDL #39 8.4` | 1 | MDL |
| 141 | dele | dele | 2018 | テレビ朝日† | mystery | `C MDL #47 8.3` | 1 | MDL |
| 142 | グッド・ドクター（日本版） | Good Doctor | 2018 | フジテレビ† | medical (KR remake) | `C MDL #48 8.3` | 1 | MDL |
| 143 | ぼくたちん家 | Chosen Home | 2025 | 日本テレビ (MDL synopsis credits Netflix) | comedy | `C MDL #49 8.3` | 1 | MDL |
| 144 | ナンバMG5 | Nanba MG5 | 2022 | フジテレビ† | delinquent comedy | `C MDL #51 8.3` | 1 | MDL |
| 145 | コウノドリ | Dr. Storks | 2015 | TBS† | medical | `C MDL #53 8.3` | 1 | MDL |
| 146 | コントが始まる | Life's Punchline | 2021 | 日本テレビ† | comedy-drama | `C MDL #56 8.3` | 1 | MDL |
| 147 | HiGH&LOW ～THE STORY OF S.W.O.R.D.～ | High&Low: The Story of S.W.O.R.D. | 2015 | 日本テレビ† | action | `C MDL #57 8.3` | 1 | MDL |
| 148 | スメルズ ライク グリーン スピリット† | Smells Like Green Spirit | 2024 | — | BL | `C MDL #58 8.3` | 1 | MDL |
| 149 | この世界の片隅に（2018） | In This Corner of the World | 2018 | TBS 日曜劇場† | wartime drama | `C MDL #59 8.3` | 1 | MDL |
| 150 | 最愛 | — | 2021 | TBS 金曜ドラマ | suspense romance | `D TVerアワード2021 ドラマ大賞 (総再生 2,280万)` | 1 | TVA21 |
| 151 | 夫婦が壊れるとき | — | 2023 | 日本テレビ | revenge (UK remake) | `D TVerアワード2023 特別賞 (23時以降ドラマ再生 #1)` | 1 | TVA23 |
| 152 | 夫の家庭を壊すまで | — | 2024 | テレ東 | revenge | `D TVerアワード2024 特別賞 (23時以降ドラマ再生 #1)` | 1 | TVA24 |
| 153 | 夫よ、死んでくれないか | — | 2025 | テレ東 | marriage suspense | `D TVerアワード2025 深夜ドラマ賞 (23時以降ドラマ再生 #1)` | 1 | TVA25 |
| 154 | テセウスの船 | — | 2020 | TBS 日曜劇場 | time-slip mystery | `D VRR 総合 #2 最終回 29.8%; RT #2 19.6%; TS #4` | 1 | VRR |
| 155 | TOKYO MER～走る緊急救命室～ | — | 2021 | TBS 日曜劇場 | medical action | `D VRR 総合 #6 最終回 29.0%; RT #8; TS #6` | 1 | VRR |
| 156 | マイファミリー | — | 2022 | TBS 日曜劇場 | kidnapping thriller | `D VRR 総合 #14 最終回 25.4%; RT #13; TS #15` | 1 | VRR |
| 157 | 青天を衝け | — | 2021 | NHK 大河 | period | `D VRR 総合 #11 26.3%; RT #6 20.0%` | 1 | VRR |
| 158 | どうする家康 | — | 2023 | NHK 大河 | period | `D VRR 総合 #15 25.2%; RT #19; TS #15` | 1 | VRR |
| 159 | 麒麟がくる | — | 2020 | NHK 大河 | period | `D VRR 総合 #18 25.3%; RT #10` | 1 | VRR |
| 160 | ノーサイド・ゲーム | — | 2019 | TBS 日曜劇場 | rugby / corporate | `D VRR 総合 #24 最終回 23.1%; RT #25; TS #27` | 1 | VRR |
| 161 | ラジエーションハウス | — | 2019 | フジテレビ (月9) | medical | `D VRR 総合 #25 最終回 22.5%; RT #28` | 1 | VRR |
| 162 | ハコヅメ～たたかう！交番女子～ | — | 2021 | 日本テレビ | police comedy | `D VRR 総合 #27 22.5%; TS #9` | 1 | VRR |
| 163 | ボイス 110緊急指令室 | — | 2019 | 日本テレビ | thriller (KR remake) | `D VRR 総合 #28 最終回 21.7%; TS #17` | 1 | VRR |
| 164 | 同期のサクラ | — | 2019 | 日本テレビ | workplace | `D VRR 総合 #28 最終回 22.4%; TS #24` | 1 | VRR |
| 165 | シャーロック | — | 2019 | フジテレビ (月9) | mystery | `D VRR 総合 #30 22.3%; TS #17` | 1 | VRR |
| 166 | 元彼の遺言状 | — | 2022 | フジテレビ (月9) | mystery | `D VRR 総合 #30 23.0%; TS #13` | 1 | VRR |
| 167 | 監察医 朝顔 | — | 2019 | フジテレビ (月9) | forensic | `D VRR RT #22 14.4%` | 1 | VRR |
| 168 | 七人の秘書 | — | 2020 | テレビ朝日 | comedy-crime | `D VRR RT #21 最終回 16.7%` | 1 | VRR |
| 169 | イチケイのカラス | — | 2021 | フジテレビ (月9) | legal | `D VRR TS #20 11.8%` | 1 | VRR |
| 170 | リコカツ | — | 2021 | TBS 金曜ドラマ | romcom | `D VRR TS #27 最終回 11.6%` | 1 | VRR |
| 171 | 日曜劇場・ブラックペアン シーズン2 | — | 2024 | TBS | medical | `D VR24 総合 #2 20.7%; RT #4; TS #4` | 1 | VR24 |
| 172 | さよならマエストロ～父と私のアパッシオナート～ | — | 2024 | TBS 日曜劇場 | music family | `D VR24 総合 #3 19.0%; RT #5; TS #6` | 1 | VR24 |
| 173 | Believe－君にかける橋－ | — | 2024 | テレビ朝日 | thriller | `D VR24 総合 #4 最終回 20.3%; RT #2` | 1 | VR24 |
| 174 | 海に眠るダイヤモンド | — | 2024 | TBS 日曜劇場 | period family saga | `D VR24 総合 #5 17.3%; RT #6; TS #12` | 1 | VR24 |
| 175 | ザ・トラベルナース（S2） | — | 2024 | テレビ朝日 | medical | `D VR24 総合 #5 18.0%; RT #6` | 1 | VR24 |
| 176 | グレイトギフト | — | 2024 | テレビ朝日 | medical thriller | `D VR24 総合 #11 16.1%; RT #8` | 1 | VR24 |
| 177 | 花咲舞が黙ってない（2024） | — | 2024 | 日本テレビ | bank drama | `D VR24 総合 #13 14.9%` | 1 | VR24 |
| 178 | ブルーモーメント | — | 2024 | フジテレビ | weather / rescue | `D VR24 総合 #14 15.5%` | 1 | VR24 |
| 179 | Destiny | — | 2024 | テレビ朝日 | legal suspense | `D VR24 総合 #14 最終回 16.0%; TS #8` | 1 | VR24 |
| 180 | となりのナースエイド / GO HOME / マウンテンドクター / 君が心をくれたから | — | 2024 | 日テレ / 日テレ / フジ / フジ | various | `D VR24 総合 #16 14.7% / #17 14.4% / #18 14.4% / #19 13.3%` — 4 titles, one row each counts 1 | 1 | VR24 |
| 181 | 日曜劇場・Get Ready! / 下剋上球児 | — | 2023 | TBS 日曜劇場 | medical / baseball | `D VR23 総合 #5 18.7% / #5 17.2%` — 2 titles | 1 | VR23 |
| 182 | 100万回言えばよかった | — | 2023 | TBS 金曜ドラマ | fantasy romance | `D VR23 総合 #8 18.9%; RT #5` | 1 | VR23 |
| 183 | 女神の教室～リーガル青春白書～ / 警視庁アウトサイダー / 合理的にあり得ない / シッコウ!! / 忍者に結婚は難しい / Dr.チョコレート | — | 2023 | フジ / テレ朝 / フジ / テレ朝 / フジ / 日テレ | various | `D VR23 総合 #9 18.0% / #10 18.1% / #12 17.6% / #14 16.4% / #15 14.4% / #19 14.9%` — 6 titles | 1 | VR23 |
| 184 | プライベートバンカー / 119エマージェンシーコール / ちょっとだけエスパー / イグナイト / 対岸の家事 / PJ ～航空救難団～ | — | 2025 | テレ朝 / フジ / テレ朝 / TBS / TBS / テレ朝 | various | `D VR25 総合 #9 15.4% / #11 14.7% / #13 14.1% / #15 13.9% / #17 13.0% / #17 13.3%` — 6 titles | 1 | VR25 |
| 185 | 舟を編む ～私、辞書つくります～ | — | 2025 | NHK | workplace | `E ORICON 2025 満足度 #5 (3.54)` | 1 | ORI25 |
| 186 | しあわせは食べて寝て待て | — | 2025 | NHK | slice-of-life | `E ORICON 2025 満足度 #9 (3.42)` | 1 | ORI25 |
| 187 | 東京サラダボウル | — | 2025 | NHK | police / immigration | `C Filmarks Awards 2025 TVドラマ nominee` | 1 | FMA25 |
| 188 | ちはやふる－めぐり－ | — | 2025 | 日本テレビ | karuta youth | `C Filmarks Awards 2025 TVドラマ nominee` | 1 | FMA25 |
| 189 | ひらやすみ | — | 2025 | NHK | slice-of-life | `C Filmarks Awards 2025 TVドラマ nominee` | 1 | FMA25 |
| 190 | おっさんずラブ-リターンズ- / Eye Love You | — | 2024 | テレビ朝日 / TBS | romcom | `C Filmarks Awards 2024 TVドラマ nominee` (2 titles) | 1 | FMA24 |
| 191 | 忍びの家 / 極悪女王 / 1122 いいふうふ | House of Ninjas / — / — | 2024 | Netflix / Netflix / Prime Video | streaming originals | `C Filmarks Awards 2024 配信ドラマ nominee` (3 titles) | 1 | FMA24 |
| 192 | 離婚しようよ / だが、情熱はある / THE DAYS / 季節のない街 | — | 2023 | Netflix / 日テレ / Netflix / Disney+ | various | `C Filmarks 2023 日本ドラマ #5 / #8 / #9 / #10` | 1 | FMA23 |
| 193 | 星降る夜に / すきすきワンワン！ / 日曜の夜ぐらいは… / こっち向いてよ向井くん / 御手洗家、炎上する | — | 2023 | テレ朝 / — / ABC / 日テレ / Netflix | various | `C Filmarks 2023 日本ドラマ #12 / #13 / #15 / #16 / #17` | 1 | FMA23 |
| 194 | 陸王 / リーガルV / 下町ロケット | — | 2017 / 2018 / 2015 | TBS / テレ朝 / TBS | corporate / legal | `D DRM 2017 #2 陸王 16.0%; 2018 #2 リーガルV 15.6%; 2015 #1 下町ロケット 18.6%` | 1 | DRM |
| 195 | 半分、青い。/ おかえりモネ | — | 2018 / 2021 | NHK 朝ドラ | asadora | `E Yahoo!検索大賞2018 / 2021 ドラマ部門` | 1 | YSA |
| 196 | 家政婦のミタ / GOOD LUCK!! / プライド / エンジン / 西遊記(2006) / Dr.コトー診療所 / PRICELESS | — | 2003–2012 | various | classics | `D DRM 年間平均 #1/#2: GOOD LUCK!! 2003 30.4%; プライド 2004 25.2%; エンジン 2005 22.6%; 西遊記 2006 23.0%; Dr.コトー 2006 22.3%; 家政婦のミタ 2011 24.8%; PRICELESS 2012 17.7%` — classics sidebar | 1 | DRM |

Notes on the table:
- Rows 180–184, 190–196 bundle several 1-source titles to keep the file readable; each named title is its own 1-source candidate (the total above counts them individually).
- Rows 114, 117–119, 121–124, 126, 127, 148: Japanese titles are memory-based (†) or missing — confirm on MDL/official pages before use.

## 4. Excluded on purpose (found in the sources, not Japanese scripted live-action)

- **Anime** (dominates IMDb country=JP; also TVer/Netflix/Filmarks/Yahoo anime categories): Steel Ball Run, Attack on Titan, FMA:B, One Piece (anime), Bleach TYBW, HxH, Frieren, Death Note, Dandadan, Jujutsu Kaisen, Demon Slayer, SAKAMOTO DAYS, 薬屋のひとりごと, 名探偵コナン, タコピーの原罪, 怪獣8号, etc. IMDb's JP tag also catches non-Japanese animation (Avatar-type co-productions, Link Click, To Be Hero X, Swat Kats, Moomin) — dropped.
- **Kept but flagged (foreign-produced, JP setting/co-pro)**: One Piece (2023, Netflix, US-produced; IMDb 8.3/212K, MDL #4 8.7 (15,804) and S2 #5 8.6 (3,890); NF23H2 72M); SHOGUN 将軍 (2024, FX/Disney+, US; MDL #9 8.5 (5,367), Filmarks 2024 配信 nominee); Tokyo Vice (HBO Max, US; IMDb 8.1/57K); Drops of God (Apple TV+, FR/JP; IMDb 8.0/19K, PAR26); Shōgun (1980, US). Not given rows — decide at curation.
- **Unscripted / non-drama in IMDb JP list**: Planet Earth, The Filthy Frank Show, MXC, Nova, Iron Chef, Takeshi's Castle (×2), Old Enough!, Queer Eye: We're in Japan!, Terrace House (×2), Ninja Warrior, The Boyfriend; TVer/Yahoo variety winners (水曜日のダウンタウン, アメトーーク！, ラヴィット！ etc.).
- **Non-Japanese in IMDb JP list**: Buffy the Vampire Slayer, The Mahabharata, Marco Polo (1982), Masters of Horror.
- **Films** in Netflix reports / Parrot: City Hunter (2024), Drawing Closer, Bullet Train Explosion, Demon City; Filmarks 国内映画部門 entries (国宝, ラストマイル etc.).
- **Korean original** 私の夫と結婚して (Filmarks 2024 配信 nominee) — Korean, not the JP remake.

## 5. Caveats

- **Video Research numbers are per-episode, not series averages.** VR23/24/25 and VRR rank the single best episode (often the finale) by 総合 (real-time OR time-shift), which inflates finales vs. DRM's series averages (e.g. VIVANT finale 総合 29.8% vs. 2023 average 14.3%). VR annual tables cover 民放 only; VRR includes NHK. All are 関東地区 世帯. Tags state which figure.
- **Same-panel double counting.** VR23/24/25 + VRR + DRM all reflect Video Research 関東 data; TVA keys are all TVer. When ranking by "independent families" collapse to: Video Research, TVer, Netflix, IMDb, MDL, Filmarks, ORICON, Yahoo, Parrot. On that basis VIVANT = 4 families (VR, TVer, Filmarks, Yahoo), 半沢直樹 = 4 (IMDb, MDL, VR, Yahoo), 相棒 = 1.
- **Year coverage gaps in D**: VR annual 民放 tables only found for 2023–2025; VRR covers May 2019–Jun 2026 but only top 30; 2016–2018 and 2024–2025 annual **averages** rely on DRM (2016–2018 top 3 only; 2024/2025 annual block absent, cours only). TK25 (Toyo Keizai 2025 average ranking) not readable past page 1. Dramas like 逃げ恥 (2016), おっさんずラブ (2018), silent (2022) have no VR/DRM placement in what was read — absence ≠ low rating.
- **IMDb threshold**: ≥1,000 votes (not 3,000/5,000) because ≥5,000 leaves only 3 live-action JP series. Most J-drama vote counts are 1–8K, so ratings are noisy; Alice in Borderland (154K) and Last Samurai Standing (23K) are the only five-figure+ Japanese-produced live-action titles in the list.
- **MDL** skews to BL, romance and Netflix titles popular with international fans; ratings counts for #1–20 range from 2,432 (Rebooting) to 99,760 (Alice S1). Ranks 21–60 have no counts.
- **Filmarks** awards are via pixiin (secondary) except the 2025 TVドラマ nominee list (Filmaga). 2023 is a ranked top 20 (#7 missing on the page); 2024/2025 are winner + unranked nominees. Filmarks Awards combine Clip! (want-to-watch), Mark! (watched) and ★ — it is partly buzz, partly rating; tagged C here.
- **Netflix**: text pages name only a few Japanese titles per half; full .xlsx reports were not parsed, so absence ≠ low viewing (e.g. First Love 2022, Sanctuary 2023, Gannibal on Disney+ not covered). No Japanese title in the all-time non-English top 10. NF26H1 numbers are Netflix's own page.
- **TVer**: each year has one ドラマ大賞 plus a varying set of 特別賞/優秀賞 defined by different criteria (late-night #1, single-episode #1, archive #1); 2020 entry read from page meta only.
- **ORICON 2025** covers 地上波 non-late-night dramas only (no streaming originals). No 2024 or earlier annual table was found.
- **Yahoo!検索大賞** measures year-on-year search **growth**, one winner per year; asadora/taiga win often.
- **Parrot**: no Japanese live-action winner in GDA 2021–2025 (per kr-file reading); PAR26 is a themed analysis (live-action from anime-linked IP), not a general ranking.
- **Titles/years/networks**: † titles and all years/networks not printed by VR/TVer/Netflix need checking at fact-sheet stage; rows 114–124, 126–127, 148 flagged as low-confidence JP titles.

## 6. toolDegradation

| Step | Tool tried | Result | Fallback used |
|---|---|---|---|
| IMDb advanced search (JP) | Exa web_fetch_exa (first, per kr experience that Groundlane returns empty JS shell) | read | — |
| MDL ratings counts | Groundlane web_extract (pattern `scored by N users`) | ok for all 20 | — |
| Filmarks 高評価 list | Groundlane web_fetch / web_extract on /list-drama/country/144 | reachable, but only おすすめ順 exposed | Filmarks Awards via pixiin + Filmaga |
| ORICON 2025 special page | Groundlane web_fetch | Shift_JIS mojibake | Exa web_fetch_exa on ORICON NEWS article — read |
| Netflix about.netflix.com pages | Groundlane web_extract (regex on HTML) | noisy HTML spans | Exa web_fetch_exa — read |
| Netflix Tudum all-time non-English | Exa web_fetch_exa | read | — |
| doraman.net | Groundlane web_fetch (article mode) | content stripped | Groundlane `extract=full, format=text` — read |
| FlixPatrol JP 2025 | Groundlane (browser-challenge fail), Exa (CRAWL_HTTP_403), Tavily extract (failed), jina read_url (Cloudflare "Just a moment" page) | all failed | none — unread |
| Douban | Groundlane web_fetch on rexxar API | HTTP 400 `invalid_request_1284` | none — unread (listicle snippets only, not used) |
| Toyo Keizai 2025 | Exa web_fetch_exa | page 1 only (multi-page article) | none — partial |
| screens-lab TVer 2020 | Groundlane web_fetch | body replaced by site news feed | meta description used — partial |
| Search | Groundlane web_search (Brave + You.com; Tavily/Exa providers inside Groundlane intermittently "unavailable") | ok | — |
| Terminal curl | not attempted (blocked per brief) | — | MCP tools only |
| Firecrawl | not used (credits exhausted per brief) | — | — |
