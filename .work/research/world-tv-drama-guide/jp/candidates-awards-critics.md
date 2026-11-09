# Japanese TV (日劇) candidates — awards juries (A) + critics polls / year-end lists (B)

Collected 2026-11-09 for the zh-TW 「各國影劇導讀」 series (Japan). Raw data only; no curation applied. Scope: Japanese-produced scripted live-action series (terrestrial incl. local stations, BS, WOWOW, Japanese streaming originals on Netflix / Disney+ / Prime Video / Hulu Japan / FOD), mainly 2016–2026. Single-episode specials that show up in award lists are kept but flagged `[special]`. Anime, variety/non-scripted, documentaries, films and non-Japanese productions found in the sources are in 2b so nothing is silently dropped.

**Year conventions** (read before using tags):
- `DA` (ザテレビジョンドラマアカデミー賞) is quarterly: tag = broadcast cour, e.g. `DA best 2024Q1 (#119)` = 第119回, covering Jan–Mar 2024 dramas. #105 covered Apr–Sep 2020 (COVID). Only 最優秀作品賞 was extracted (Wikipedia lists winners only; **ranks/other placements not collected**). Scope #88 (2016Q1) – #128 (2026Q2); #129 (2026Q3) not yet on Wikipedia.
- `TDA` (東京ドラマアウォード, 連続ドラマ部門): tag = award year; eligibility is the previous 1 Jul – that year's 30 Jun. The award ended after 2025 (merged into エランドール賞 from 2026). 2016–2025 extracted.
- `Galaxy` (ギャラクシー賞 テレビ部門 年度賞): tag = 年度 (April–March). e.g. `Galaxy 大賞 2022年度` was announced mid-2023. Only year-level 大賞/優秀賞/特別賞/フロンティア賞 extracted (monthly 月間賞 and 入賞 not collected). 個人賞 (performer awards) are listed as `Galaxy-indiv` tags but **not counted** (one actor citation often names 3–4 shows).
- `Minpo` (日本民間放送連盟賞 番組部門 テレビドラマ): tag = award year (announced each September). 2021–2026 extracted; 2016–2020 not read (site pages for those years have a different layout — see §3).
- `Mukoda` (向田邦子賞, screenwriting): tag = 年度 (announced the following April). 2015年度–2025年度.
- `IntlEmmy`, `AACA`, `SDA`: ceremony year.
- B tags use the list's publication year. `RS2025 3/5 (#1,#2,#8)` = in 3 of the 5 Real Sound critics' top-10s that year, with each critic's rank.

**Distinct sources** = count of distinct source keys a show appears in. Keys (14): A — `DA`, `TDA`, `Galaxy`, `Minpo`, `Mukoda`, `IntlEmmy` (any category), `AACA` (Asian Academy Creative Awards: Best Drama Series grand + Japan national winners 2018–2025; plus 2025 grand/national fiction categories), `SDA` (Seoul International Drama Awards, any category incl. a popularity prize — flagged); B — `RS2023`, `RS2024`, `RS2025` (Real Sound 映画部 年間ベストドラマTOP10, 5 critics each year), `EC2025` (映画チャンネル ドラマライター座談会, 3 writers' unranked top 5 + 年間大賞), `NYT-Intl2025` (Mike Hale, Best International TV Shows of 2025), `JT2024` (Japan Times year-in-review, Patrick St. Michel — counted only where a show is explicitly called one of the year's best). Several placements inside one key count once; seasons merged (大奥 S1/S2, きのう何食べた? S1/S2, おいハンサム!! S1/S2).

**Metadata**: Japanese titles and networks come from the sources (DA/TDA/Minpo/Galaxy/RS list them). English titles marked `†` and **all first-air years** are general knowledge = **unsourced; verify before publishing**. English titles without `†` are as printed in an English-language source (AACA, Intl Emmy, SDA, NYT, Japan Times). `—` = no English title known/checked.

## 1. Sources

| Key | Source | URL | Read status | What was extracted |
|---|---|---|---|---|
| DA | ザテレビジョンドラマアカデミー賞 (ja.wikipedia) | https://ja.wikipedia.org/wiki/ザテレビジョンドラマアカデミー賞 (`action=raw`) | read (wikitext; 最優秀作品賞 rows pattern-extracted for every cour, #105/#126 checked separately) | 最優秀作品賞 #88–#128 (2016Q1–2026Q2). Pre-2016 winners also visible but out of DA scope |
| TDA | 国際ドラマフェスティバル in TOKYO → 東京ドラマアウォード 歴代各賞 (ja.wikipedia) | https://ja.wikipedia.org/wiki/国際ドラマフェスティバル_in_TOKYO (`action=raw`) | read (wikitext, 2015–2025 連続ドラマ blocks) | 連続ドラマ部門 グランプリ + 優秀賞 2016–2025; award ended after 2025 |
| Galaxy | ギャラクシー賞 受賞作 第27回–第63回 (ja.wikipedia) | https://ja.wikipedia.org/wiki/ギャラクシー賞 (`action=raw&section=6`) | read (テレビ部門 block for 2015–2025年度) | 大賞/優秀賞/特別賞/個人賞/フロンティア賞 (drama-related only used) |
| Minpo | 日本民間放送連盟賞 2021–2026 results pages (j-ba.or.jp) | https://j-ba.or.jp/award2021/ … https://j-ba.or.jp/award2026/ | read (テレビドラマ block of each page) | 最優秀 + 優秀 per year. award2019/award2020 pages returned a 26 KB page without the drama block (not read) |
| Mukoda | 向田邦子賞 (ja.wikipedia) | https://ja.wikipedia.org/wiki/向田邦子賞 (`action=raw`) | read | Winners 第34回 (2015年度) – 第44回 (2025年度) with work + network |
| IntlEmmy | International Emmy — Best Drama Series / Best TV Movie or Miniseries / Best Actor / Best Actress / Best Comedy Series (en.wikipedia) | https://en.wikipedia.org/wiki/International_Emmy_Award_for_Best_Drama_Series (and _Best_TV_Movie_or_Miniseries, _Best_Actor, _Best_Actress, _Best_Comedy_Series) | partial (wikitext pattern search for `{{JAP}}`/`JPN`/`Japan` rows; years not always resolvable from the category pages) | Japanese rows: Moribito, Mozu, Saka no Ue no Kumo, Yae's Sakura (Drama); Storytelling of Hostages (TV Movie); Yasu (Actor); Rakugo The Movie, NEO, Perfect Manual, Hoshi Shinichi (Comedy). Actress: none |
| IntlEmmy | 44th–54th International Emmy Awards ceremony pages (en.wikipedia), 2016–2026 | https://en.wikipedia.org/wiki/45th_International_Emmy_Awards (and 44th, 46th–54th) | read (pattern search for Japan/JAP rows; category of each JP row checked by context) | Years + categories for Moribito 2017, Tokyo Trial 2017, Rakugo Movie 2017, Kurara 2018, Festival of the Little Gods 2020, Deaf Voice 2024; other JP rows are docs/anime/non-scripted (2b). 47th (2019): no JP row found. 54th (2026, ceremony 23 Nov 2026): JP noms are anime/kids only |
| AACA | Asian Academy Creative Award for Best Drama Series (en.wikipedia) | https://en.wikipedia.org/wiki/Asian_Academy_Creative_Award_for_Best_Drama_Series | read (wikitext; grand winners table + Japan national table) | 2018 grand winner Miss Sherlock; JP national winners 2018, 2021–2024 |
| AACA | AACA 2025 National Winners / 2025 Grand Final Winners (official) | https://www.asianacademycreativeawards.com/2025-national-winners/ ; https://www.asianacademycreativeawards.com/2025-grand-final-winners/ | read (HTML table rows for Japan) | 2025 JP national Best Drama Series = *Please Die My Beloved* (TV Tokyo & Telepack); The Queen of Villains grand Best Actress + grand Best Direction (Fiction) + several JP national craft wins |
| SDA | Seoul International Drama Awards (en.wikipedia) | https://en.wikipedia.org/wiki/Seoul_International_Drama_Awards | read (wikitext pattern search for "(Japan)"; column headers checked) | Eye Love You — Jury Special Prize 2024; Kore-eda Hirokazu — Best Director 2025 (*Asura*); *Signal* (Japan) — Most Popular Foreign Drama 2021; older/invitation items in 2b |
| — | Primetime Emmy / Golden Globes | via US research file `../us/candidates-awards-critics.md` + Guardian 2024 text | read (indirect) | Only Japan-set winner is *Shōgun* (FX, US production) → 2b |
| — | Series Mania (en.wikipedia) | https://en.wikipedia.org/wiki/Series_Mania | read (pattern search) | No Japanese entry in the award tables |
| RS2023 | Real Sound 映画部「2023年 年間ベストドラマTOP10」×5: 小田慶子, 成馬零一, 田幸和歌子, 麦倉正樹, 藤原奈緒 | https://realsound.jp/movie/2023/12/post-1534086.html ; …/post-1532827.html ; …/post-1529990.html ; …/post-1529113.html ; …/post-1524663.html | read (ranked list of each; 小田 #4 『大奥』 network from the article's summary list) | 5 × top 10 (田幸 has a tie at #1) |
| RS2024 | Real Sound「2024年 年間ベストドラマTOP10」×5: 田幸和歌子, 麦倉正樹, 明日菜子, 成馬零一, 藤原奈緒 | https://realsound.jp/movie/2024/12/post-1882781.html ; …/post-1881324.html ; …/post-1880478.html ; …/post-1880052.html ; …/post-1878896.html | read | 5 × top 10 |
| RS2025 | Real Sound「2025年 年間ベストドラマTOP10」×5: 藤原奈緒, 明日菜子, 田幸和歌子, 麦倉正樹, 成馬零一 | https://realsound.jp/movie/2025/12/post-2254007.html ; …/post-2258831.html ; …/post-2261194.html ; …/post-2262437.html ; …/post-2265370.html | read | 5 × top 10. Critic URLs found via the site's tag pages (`/tag/2023年間ベスト`, `/tag/2024年間ベスト`, `/tag/2025年間ベスト`) |
| EC2025 | 映画チャンネル「ドラマライターが選ぶ2025年、もっともハマったドラマは？」(3 pages) | https://eigachannel.jp/drama/186133/ (+ /2/, /3/) | read | 苫とり子 / あまのさき / まっつ: unranked top 5 each; 年間大賞 (unanimous) = じゃあ、あんたが作ってみろよ |
| NYT-Intl2025 | NYT, Mike Hale, Best International TV Shows of 2025 | https://www.yearendlists.com/2025/mike-hale-best-international-tv-shows-of-2025 (index of the NYT list) | partial (titles from yearendlists.com; NYT paywalled) | *Asura* in top 10 (alphabetical); *Dandadan* (anime) → 2b. *Diary of a Ditched Girl* checked = Swedish; *The Best Heart Attack of My Life* = Argentine (search results), not Japanese |
| — | NYT, Mike Hale, Best International TV Shows of 2024 | https://www.yearendlists.com/2024/mike-hale-best-international-tv-shows-of-2024 | partial (titles only) | No Japanese title (*Fleeting Lies* = Spanish, *The Confidante* = French per search results) |
| — | NYT, The 30 Best International TV Shows of the Decade (Hale, 2019) | ResetEra transcription https://www.resetera.com/threads/new-york-times-the-30-best-international-tv-shows-of-the-decade.160789/ (via Exa; Groundlane hit a browser challenge) | read (transcription) | No Japanese live-action entry; honorable mentions "Japan: Attack on Titan, Mob Psycho 100" (anime → 2b) |
| JT2024 | Japan Times, "2024 was the year Japanese TV found its prestige" (Patrick St. Michel, 2024-12-06) | https://www.japantimes.co.jp/culture/2024/12/07/tv-streaming/shogun-extremely-inappropriate-tokyo-swindlers/ | partial (first ~70% of article; truncated) | Essay, not a ranked list. Calls *Extremely Inappropriate!* (不適切にもほどがある!) "one of the year's best TV shows" → counted. Also discusses Tokyo Swindlers, The Queen of Villains, House of Ninjas, Eye Love You, Antihero, Lion no Kakurega → **mentioned, not counted** |
| — | Guardian, 50 best TV shows of 2020 / 2021 / 2022 / 2023 / 2024 / 2025 | URLs as in `../kr/candidates-awards-critics.md` | read (pattern search "Japan") | No Japanese-produced show. Japan matches only in *Shōgun* (2024), *Sunny* (2024), *Pachinko* (2022) → all non-Japanese productions (2b) |
| — | Variety, Best International TV Shows of 2025 | https://variety.com/lists/best-international-tv-shows-of-2025/ | read (h2 headings + "Japan" pattern) | No Japanese entry |
| — | AACA 2025 Variety / World Screen / Soapcentral coverage | (search results) | snippet only — not counted | Agree with official AACA pages |
| — | Intl Emmy 2026 nominations (iemmys.tv, Deadline, THR) | (search results) | snippet only — superseded by the read 54th ceremony page | JP noms 2026 are animation/kids |

## 2. Candidates

### 2a. Japanese-produced scripted candidates (206 shows)

Sorted by distinct sources (desc). Within a count, rough chronological order. `[special]` = single-episode / short special drama.

| # | Japanese title | English title | first-air year (unsourced) | network/platform | evidence tags | distinct sources |
|---|---|---|---|---|---|---|
| 1 | 不適切にもほどがある! | Extremely Inappropriate! | 2024 | TBS | A DA best 2024Q1 (#119); A TDA 優秀 2024; A Galaxy 特別賞 2023年度; B RS2024 3/5 (麦倉 #8, 成馬 #4, 藤原 #7); B JT2024 "one of the year's best" | 5 |
| 2 | ブラッシュアップライフ | Rebooting | 2023 | 日本テレビ | A DA best 2023Q1 (#115); A TDA グランプリ 2023; A Minpo 優秀 2023; A AACA JP national Best Drama Series 2023; B RS2023 5/5 (小田 #1, 成馬 #9, 田幸 #1=, 麦倉 #2, 藤原 #1) | 5 |
| 3 | アンメット ある脳外科医の日記 | Unmet† | 2024 | 関西テレビ/フジテレビ系 | A DA best 2024Q2 (#120); A TDA 優秀 2024; A Minpo 最優秀 2025; B RS2024 4/5 (田幸 #5, 麦倉 #6, 明日 #7, 藤原 #1); Galaxy-indiv 2024年度 (杉咲花) | 4 |
| 4 | VIVANT | VIVANT | 2023 | TBS | A DA best 2023Q3 (#117); A TDA グランプリ 2024; A Minpo 優秀 2024; B RS2023 2/5 (小田 #10, 成馬 #6) | 4 |
| 5 | ホットスポット | Hot Spot† | 2025 | 日本テレビ | A TDA 優秀 2025; A Minpo 優秀 2025; B RS2025 3/5 (藤原 #5, 田幸 #6, 麦倉 #2); B EC2025 (あまの top 5) | 4 |
| 6 | 波うららかに、めおと日和 | — | 2025 | フジテレビ | A DA best 2025Q2 (#124); A TDA 優秀 2025; B RS2025 1/5 (成馬 #4); B EC2025 (苫, まっつ top 5) | 4 |
| 7 | 海に眠るダイヤモンド | — | 2024 | TBS | A DA best 2024Q4 (#122); A TDA グランプリ 2025; B RS2024 4/5 (田幸 #3, 麦倉 #7, 成馬 #10, 藤原 #8); Galaxy-indiv 2024年度 (杉咲花) | 3 |
| 8 | 最愛 | — | 2021 | TBS | A DA best 2021Q4 (#110); A TDA グランプリ 2022; A Minpo 最優秀 2022 | 3 |
| 9 | エルピス―希望、あるいは災い― | Elpis† | 2022 | 関西テレビ | A TDA 優秀 2023; A Galaxy 大賞 2022年度; A Minpo 最優秀 2023; Galaxy-indiv 2022年度 (長澤まさみ) | 3 |
| 10 | 連続ドラマW フェンス | Fence† | 2023 | WOWOW (/NHKエンタープライズ) | A TDA 優秀 2023; A Galaxy 大賞 2023年度; B RS2023 3/5 (小田 #3, 成馬 #5, 藤原 #10) | 3 |
| 11 | 俺の家の話 | — | 2021 | TBS | A DA best 2021Q1 (#107); A TDA グランプリ 2021; A Galaxy 優秀 2020年度 | 3 |
| 12 | 大豆田とわ子と三人の元夫 | — | 2021 | 関西テレビ | A TDA 優秀 2021; A Galaxy 優秀 2021年度; A Minpo 優秀 2021 | 3 |
| 13 | 俺の話は長い | — | 2019 | 日本テレビ | A TDA 優秀 2020; A Galaxy 優秀 2019年度; A Mukoda 2019年度 (金子茂樹) | 3 |
| 14 | 鎌倉殿の13人 | The 13 Lords of the Shogun† | 2022 | NHK総合 (大河) | A DA best 2022Q4 (#114); A TDA 優秀 2023; A Mukoda 2022年度 (三谷幸喜); Galaxy-indiv 2022年度 (長澤まさみ narration) | 3 |
| 15 | アンナチュラル | Unnatural† | 2018 | TBS | A DA best 2018Q1 (#96); A TDA 優秀 2018; A Galaxy 優秀 2017年度 | 3 |
| 16 | カルテット | Quartet† | 2017 | TBS | A DA best 2017Q1 (#92); A TDA 優秀 2017; A Galaxy 優秀 2016年度; Galaxy-indiv 2016年度 (満島ひかり) | 3 |
| 17 | きのう何食べた? (S1 + season2) | What Did You Eat Yesterday?† | 2019 / 2023 | テレビ東京 | A DA best 2019Q2 (#101); A TDA 優秀 2019; B RS2023 2/5 (麦倉 #8, 藤原 #9) [season2] | 3 |
| 18 | ミステリと言う勿れ | Don't Call It Mystery | 2022 | フジテレビ | A TDA 優秀 2022; A Minpo 優秀 2022; A AACA JP national Best Drama Series 2022 | 3 |
| 19 | おいハンサム!! (+ 2) | — | 2022 / 2024 | 東海テレビ/フジテレビ系 | A TDA 優秀 2022; A Minpo 優秀 2022; B RS2024 1/5 (麦倉 #5) [S2] | 3 |
| 20 | 東京サラダボウル | Tokyo Salad Bowl† | 2025 | NHK総合 | A TDA 優秀 2025; B RS2025 1/5 (田幸 #2); B EC2025 (苫 top 5) | 3 |
| 21 | 僕達はまだその星の校則を知らない | — | 2025 | 関西テレビ/フジテレビ系 | A DA best 2025Q3 (#125); B RS2025 2/5 (藤原 #3, 明日 #1); B EC2025 (あまの, まっつ top 5) | 3 |
| 22 | じゃあ、あんたが作ってみろよ | — | 2025 | TBS | A DA best 2025Q4 (#126); B RS2025 3/5 (明日 #3, 麦倉 #6, 成馬 #3); B EC2025 年間大賞 (3/3 writers' top 5, unanimous) | 3 |
| 23 | 阿修羅のごとく | Asura | 2025 | Netflix | A SDA Best Director 2025 (Kore-eda Hirokazu); B RS2025 1/5 (明日 #4); B NYT-Intl2025 (Hale top 10, alphabetical). Asura↔阿修羅のごとく mapping = general knowledge | 3 |
| 24 | 逃げるは恥だが役に立つ | The Full-Time Wife Escapist† | 2016 | TBS | A DA best 2016Q4 (#91); A TDA グランプリ 2017 | 2 |
| 25 | あさが来た | — | 2015–16 | NHK総合 (朝ドラ) | A DA best 2016Q1 (#88); A TDA グランプリ 2016 | 2 |
| 26 | 家売るオンナ | — | 2016 | 日本テレビ | A DA best 2016Q3 (#90); A TDA 優秀 2017 | 2 |
| 27 | おっさんずラブ | Ossan's Love† | 2018 | テレビ朝日 | A DA best 2018Q2 (#97); A TDA グランプリ 2018 | 2 |
| 28 | 3年A組-今から皆さんは、人質です- | Mr. Hiiragi's Homeroom† | 2019 | 日本テレビ | A DA best 2019Q1 (#100); A TDA グランプリ 2019; Galaxy-indiv 2018年度 (菅田将暉) | 2 |
| 29 | 凪のお暇 | — | 2019 | TBS | A DA best 2019Q3 (#102); A TDA 優秀 2020 | 2 |
| 30 | 恋はつづくよどこまでも | — | 2020 | TBS | A DA best 2020Q1 (#104); A TDA 優秀 2020 | 2 |
| 31 | MIU404 | MIU404† | 2020 | TBS | A DA best 2020Q2–Q3 (#105); A TDA 優秀 2021 | 2 |
| 32 | カムカムエヴリバディ | Come Come Everybody† | 2021–22 | NHK総合 (朝ドラ) | A DA best 2022Q1 (#111); A TDA 優秀 2022 | 2 |
| 33 | dele | dele† | 2018 | テレビ朝日 | A TDA 優秀 2019; A Galaxy 優秀 2018年度; Galaxy-indiv 2018年度 (菅田将暉) | 2 |
| 34 | コントが始まる | — | 2021 | 日本テレビ | A TDA 優秀 2021; A Minpo 優秀 2021 | 2 |
| 35 | silent | silent† | 2022 | フジテレビ | A TDA 優秀 2023; A Minpo 優秀 2023 | 2 |
| 36 | 舟を編む 〜私、辞書つくります〜 | — | 2024 | NHK (BS→総合) | A TDA 優秀 2024; B RS2024 1/5 (明日 #2) | 2 |
| 37 | 燕は戻ってこない | — | 2024 | NHK総合 | A TDA 優秀 2024; B RS2024 3/5 (田幸 #4, 明日 #5, 藤原 #4) | 2 |
| 38 | べらぼう〜蔦重栄華乃夢噺〜 | — | 2025 | NHK総合 (大河) | A TDA 優秀 2025; B RS2025 2/5 (藤原 #1, 麦倉 #1); Galaxy-indiv 2025年度 (岡山天音) | 2 |
| 39 | 御上先生 | Mr. Mikami's Classroom† | 2025 | TBS | A DA best 2025Q1 (#123); A TDA 優秀 2025 | 2 |
| 40 | 銀河の一票 | — | 2026 | 関西テレビ/フジテレビ系 | A DA best 2026Q2 (#128); A Minpo 最優秀 2026 | 2 |
| 41 | コタツがない家 | — | 2023 | 日本テレビ | A DA best 2023Q4 (#118); B RS2023 1/5 (小田 #2) | 2 |
| 42 | 西園寺さんは家事をしない | — | 2024 | TBS | A DA best 2024Q3 (#121); B RS2024 1/5 (藤原 #9) | 2 |
| 43 | 恋せぬふたり | — | 2022 | NHK総合 | A Galaxy 特別賞 2021年度; A Mukoda 2021年度 (吉田恵里香) | 2 |
| 44 | 架空OL日記 | — | 2017 | 読売テレビ | A Galaxy 特別賞 2017年度 (バカリズム, 原作・脚本・主演); A Mukoda 2017年度 | 2 |
| 45 | 虎に翼 | — | 2024 | NHK総合 (朝ドラ) | A Galaxy 大賞 2024年度; B RS2024 5/5 (田幸 #9, 麦倉 #3, 明日 #6, 成馬 #5, 藤原 #3) | 2 |
| 46 | ばけばけ | — | 2025–26 | NHK総合 (朝ドラ) | A Galaxy 特別賞 2025年度; B RS2025 2/5 (田幸 #3, 麦倉 #5) | 2 |
| 47 | シナントロープ | — | 2025 | テレビ東京 | A Mukoda 2025年度 (此元和津也); B RS2025 2/5 (藤原 #6, 田幸 #1) | 2 |
| 48 | 日曜の夜ぐらいは... | — | 2023 | ABCテレビ/テレビ朝日系 | A Minpo 優秀 2023; B RS2023 3/5 (成馬 #3, 田幸 #10, 藤原 #8) | 2 |
| 49 | 春になったら | — | 2024 | 関西テレビ/フジテレビ系 | A Minpo 最優秀 2024; B RS2024 1/5 (田幸 #6) | 2 |
| 50 | ライオンの隠れ家 | — | 2024 | TBS | A Minpo 優秀 2025; B RS2024 1/5 (田幸 #2); (JT2024 mention, not counted) | 2 |
| 51 | Eye Love You | Eye Love You | 2024 | TBS | A SDA Jury Special Prize 2024; B RS2024 1/5 (明日 #8); (JT2024 mention, not counted) | 2 |
| 52 | ちはやふる－めぐり－ | — | 2025 | 日本テレビ | B RS2025 2/5 (藤原 #4, 明日 #6); B EC2025 (苫 top 5) | 2 |
| 53 | 続・続・最後から二番目の恋 | — | 2025 | フジテレビ | B RS2025 1/5 (明日 #2); B EC2025 (苫, あまの top 5) | 2 |
| 54 | 対岸の家事〜これが、私の生きる道！〜 | — | 2025 | TBS | B RS2025 2/5 (明日 #7, 麦倉 #7); B EC2025 (まっつ top 5) | 2 |
| 55 | 99.9-刑事専門弁護士- | — | 2016 | TBS | A DA best 2016Q2 (#89) | 1 |
| 56 | リバース | — | 2017 | TBS | A DA best 2017Q2 (#93) | 1 |
| 57 | コード・ブルー -ドクターヘリ緊急救命- THE THIRD SEASON | Code Blue† | 2017 | フジテレビ | A DA best 2017Q3 (#94) | 1 |
| 58 | 陸王 | — | 2017 | TBS | A DA best 2017Q4 (#95) | 1 |
| 59 | 義母と娘のブルース | — | 2018 | TBS | A DA best 2018Q3 (#98) | 1 |
| 60 | 中学聖日記 | — | 2018 | TBS | A DA best 2018Q4 (#99) | 1 |
| 61 | グランメゾン東京 | — | 2019 | TBS | A DA best 2019Q4 (#103) | 1 |
| 62 | 30歳まで童貞だと魔法使いになれるらしい | Cherry Magic!† | 2020 | テレビ東京 | A DA best 2020Q4 (#106) | 1 |
| 63 | ドラゴン桜 (2021) | — | 2021 | TBS | A DA best 2021Q2 (#108) | 1 |
| 64 | TOKYO MER〜走る緊急救命室〜 | — | 2021 | TBS | A DA best 2021Q3 (#109) | 1 |
| 65 | マイファミリー | — | 2022 | TBS | A DA best 2022Q2 (#112) | 1 |
| 66 | 石子と羽男-そんなコトで訴えます?- | — | 2022 | TBS | A DA best 2022Q3 (#113) | 1 |
| 67 | だが、情熱はある | — | 2023 | 日本テレビ | A DA best 2023Q2 (#116) | 1 |
| 68 | リブート | — | 2026 | TBS | A DA best 2026Q1 (#127) | 1 |
| 69 | ゆとりですがなにか | — | 2016 | 日本テレビ | A TDA 優秀 2016 | 1 |
| 70 | 民王 | — | 2015 | テレビ朝日 | A TDA 優秀 2016; Galaxy-indiv 2015年度 (遠藤憲一). (Also DA best 2015Q3 #86 — before DA scope, not counted) | 1 |
| 71 | 下町ロケット (2015) | — | 2015 | TBS | A TDA 優秀 2016. (Also DA best 2015Q4 #87 — before DA scope) | 1 |
| 72 | 釣りバカ日誌〜新入社員 浜崎伝助〜 | — | 2015 | テレビ東京 | A TDA 優秀 2016 | 1 |
| 73 | いつかこの恋を思い出してきっと泣いてしまう | — | 2016 | フジテレビ | A TDA 優秀 2016 | 1 |
| 74 | 沈まぬ太陽 (連続ドラマW) | — | 2016 | WOWOW | A TDA 優秀 2016 | 1 |
| 75 | 真田丸 | — | 2016 | NHK総合 (大河) | A TDA 優秀 2017 | 1 |
| 76 | バイプレイヤーズ | — | 2017 | テレビ東京 | A TDA 優秀 2017 | 1 |
| 77 | CRISIS 公安機動捜査隊特捜班 | — | 2017 | 関西テレビ | A TDA 優秀 2017 | 1 |
| 78 | ひよっこ | — | 2017 | NHK総合 (朝ドラ) | A TDA 優秀 2018 | 1 |
| 79 | 過保護のカホコ | — | 2017 | 日本テレビ | A TDA 優秀 2018 | 1 |
| 80 | コンフィデンスマンJP | The Confidence Man JP† | 2018 | フジテレビ | A TDA 優秀 2018 | 1 |
| 81 | 石つぶて〜外務省機密費を暴いた捜査二課の男たち〜 | — | 2017 | WOWOW | A TDA 優秀 2018 | 1 |
| 82 | 透明なゆりかご | — | 2018 | NHK総合 | A TDA 優秀 2019 | 1 |
| 83 | 大恋愛〜僕を忘れる君と | — | 2018 | TBS | A TDA 優秀 2019 | 1 |
| 84 | いだてん〜東京オリムピック噺〜 | — | 2019 | NHK総合 (大河) | A TDA グランプリ 2020 | 1 |
| 85 | これは経費で落ちません! | — | 2019 | NHK総合 | A TDA 優秀 2020; Galaxy-indiv 2019年度 (伊藤沙莉) | 1 |
| 86 | あなたの番です | — | 2019 | 日本テレビ | A TDA 優秀 2020 | 1 |
| 87 | 病院の治しかた〜ドクター有原の挑戦〜 | — | 2020 | テレビ東京 | A TDA 優秀 2020 | 1 |
| 88 | 半沢直樹 (2020) | — | 2020 | TBS | A TDA 優秀 2021 | 1 |
| 89 | 天国と地獄〜サイコな2人〜 | — | 2021 | TBS | A TDA 優秀 2021 | 1 |
| 90 | 華麗なる一族 (2021) | — | 2021 | WOWOW | A TDA 優秀 2021 | 1 |
| 91 | 恋です!〜ヤンキー君と白杖ガール〜 | — | 2021 | 日本テレビ | A TDA 優秀 2022 | 1 |
| 92 | 緊急取調室 第4シーズン | — | 2021 | テレビ朝日 | A TDA 優秀 2022 | 1 |
| 93 | シェフは名探偵 | — | 2021 | テレビ東京 | A TDA 優秀 2022 | 1 |
| 94 | 星降る夜に | — | 2023 | テレビ朝日 | A TDA 優秀 2023 | 1 |
| 95 | 夫の家庭を壊すまで | — | 2024 | テレビ東京 | A TDA 優秀 2025 | 1 |
| 96 | ゴールデンカムイ -北海道刺青囚人争奪編- | — | 2024 | WOWOW | A TDA 優秀 2025 | 1 |
| 97 | 結婚相手は抽選で | — | 2018 | 東海テレビ/共同テレビ | A Galaxy 優秀 2018年度 | 1 |
| 98 | 忠臣蔵狂詩曲No.5 中村仲蔵 出世階段 | — | 2021 | NHK | A Galaxy 優秀 2021年度 | 1 |
| 99 | 八月の声を運ぶ男 [special] | — | 2025 | NHK/WOWOW (戦後80年ドラマ) | A Galaxy 大賞 2025年度 | 1 |
| 100 | 火花 | — | 2016 | Netflix (YDクリエイション) | A Galaxy フロンティア賞 2016年度 | 1 |
| 101 | スローな武士にしてくれ〜京都 撮影所ラプソディー〜 [special] | — | 2019 | NHK | A Galaxy フロンティア賞 2018年度 | 1 |
| 102 | 光秀のスマホ [short] | — | 2020 | NHK | A Galaxy フロンティア賞 2020年度 | 1 |
| 103 | 浜の朝日の嘘つきどもと [special] | — | 2020 | 福島中央テレビ | A Minpo 最優秀 2021 | 1 |
| 104 | ナイルパーチの女子会 | — | 2021 | BSテレビ東京 | A Minpo 優秀 2021 | 1 |
| 105 | オトナの土ドラ その女、ジルバ | — | 2021 | 東海テレビ | A Minpo 優秀 2021 | 1 |
| 106 | 名建築で昼食を | — | 2020 | テレビ大阪 | A Minpo 優秀 2021 | 1 |
| 107 | ハコヅメ 〜たたかう！交番女子〜 | — | 2021 | 日本テレビ | A Minpo 優秀 2022 | 1 |
| 108 | 僕もアイツも新郎です。 | — | 2021? | 関西テレビ | A Minpo 優秀 2022 | 1 |
| 109 | ホメられたい僕の妄想ごはん | — | 2021? | テレビ大阪 | A Minpo 優秀 2022 | 1 |
| 110 | 連続ドラマW フィクサー Season1 | — | 2023 | WOWOW | A Minpo 優秀 2023 | 1 |
| 111 | 恋は50を過ぎてから [special] | — | 2022 | 日本BS放送 (BS11) | A Minpo 優秀 2023 | 1 |
| 112 | マクラコトバ | — | 2022? | CBCテレビ | A Minpo 優秀 2023 | 1 |
| 113 | 最高の教師 1年後、私は生徒に■された | — | 2023 | 日本テレビ | A Minpo 優秀 2024 | 1 |
| 114 | 連続ドラマW 湊かなえ「落日」 | — | 2023 | WOWOW | A Minpo 優秀 2024 | 1 |
| 115 | おっさんのパンツがなんだっていいじゃないか！ | — | 2024 | 東海テレビ | A Minpo 優秀 2024 | 1 |
| 116 | 琉球歴史ドラマ「阿麻和利 THE LAST HERO」 [special] | — | 2023? | 琉球放送 | A Minpo 優秀 2024 | 1 |
| 117 | 終りに見た街 (テレビ朝日開局65周年記念ドラマプレミアム) [special] | — | 2024 | テレビ朝日 | A Minpo 優秀 2025 | 1 |
| 118 | 連続ドラマW 災 | — | 2025 | WOWOW | A Minpo 優秀 2025 | 1 |
| 119 | それでも俺は、妻としたい | — | 2025 | テレビ大阪 | A Minpo 優秀 2025 | 1 |
| 120 | おきなわテレビはじまりものがたり [special] | — | 2024? | 沖縄テレビ放送 | A Minpo 優秀 2025 | 1 |
| 121 | 再会～Silent Truth～ | — | 2026 | テレビ朝日 | A Minpo 優秀 2026 | 1 |
| 122 | 北方謙三 水滸伝 | — | 2026? | WOWOW | A Minpo 優秀 2026 | 1 |
| 123 | パレード界隈 | — | 2025? | CBCテレビ | A Minpo 優秀 2026 | 1 |
| 124 | こちら予備自衛英雄補？！ | — | 2025? | 中京テレビ | A Minpo 優秀 2026 | 1 |
| 125 | 変態植物倶楽部 | — | 2025? | テレビ大阪 | A Minpo 優秀 2026 | 1 |
| 126 | 時代劇ドラマ「はぐれ鴉」 [special] | — | 2025? | テレビ大分 | A Minpo 優秀 2026 | 1 |
| 127 | ちかえもん | — | 2016 | NHK総合 | A Mukoda 2015年度 (藤本有紀) | 1 |
| 128 | 毒島ゆり子のせきらら日記 | — | 2016 | TBS | A Mukoda 2016年度 (矢島弘一) | 1 |
| 129 | 獣になれない私たち | — | 2018 | 日本テレビ | A Mukoda 2018年度 (野木亜紀子) | 1 |
| 130 | モコミ〜彼女ちょっとヘンだけど〜 | — | 2021 | テレビ朝日 | A Mukoda 2020年度 (橋部敦子) | 1 |
| 131 | グレースの履歴 | — | 2023 | NHK BSプレミアム | A Mukoda 2023年度 (源孝志) | 1 |
| 132 | マイダイアリー | — | 2024 | 朝日放送テレビ | A Mukoda 2024年度 (兵藤るり) | 1 |
| 133 | 精霊の守り人† | Moribito: Guardian of the Spirit | 2016–18 | NHK | A IntlEmmy Drama Series nom 2017 (45th) | 1 |
| 134 | 東京裁判† | Tokyo Trial | 2016 | NHK / FATT Productions / DCTV (co-production; credited to Japan on Wikipedia) | A IntlEmmy TV Movie/Miniseries nom 2017 (45th) | 1 |
| 135 | らくごえいが | The Rakugo Movie | — | East Entertainment / NHK | A IntlEmmy Comedy nom 2017 (45th) — format (series vs. film) not checked | 1 |
| 136 | 眩〜北斎の娘〜† [special] | Kurara: The Dazzling Life of Hokusai's Daughter | 2017 | NHK Enterprises / NHK | A IntlEmmy TV Movie/Miniseries nom 2018 (46th) | 1 |
| 137 | — [special?] | The Festival of the Little Gods | — | 東北放送 (Tohoku Broadcasting) | A IntlEmmy TV Movie/Miniseries nom 2020 (48th); Japanese title not found | 1 |
| 138 | デフ・ヴォイス 法廷の手話通訳士† | Deaf Voice: A Sign-Language Interpreter in Court | 2023 | NHK | A IntlEmmy TV Movie/Miniseries nom 2024 (52nd) | 1 |
| 139 | ミス・シャーロック† | Miss Sherlock | 2018 | Hulu Japan (HBO Asia co-pro — unsourced) | A AACA Best Drama Series **grand WIN** 2018 (+ JP national) | 1 |
| 140 | 全裸監督 | The Naked Director | 2019 | Netflix | A AACA JP national Best Drama Series 2021; Galaxy-indiv 2019年度 (伊藤沙莉) | 1 |
| 141 | アンチヒーロー† | Antihero | 2024 | TBS | A AACA JP national Best Drama Series 2024; (JT2024 mention, not counted) | 1 |
| 142 | — (unverified) | Please Die My Beloved | 2025 | テレビ東京 & Telepack | A AACA JP national Best Drama Series 2025 | 1 |
| 143 | 極悪女王† | The Queen of Villains | 2024 | Netflix (KADOKAWA) | A AACA 2025 grand Best Actress (Yuriyan Retriever) + grand Best Direction–Fiction (白石和彌) + JP national Supporting Actress (唐田えりか), Editing, + one more craft category; (JT2024 mention, not counted) | 1 |
| 144 | シグナル 長期未解決事件捜査班† | Signal | 2018 | 関西テレビ/フジテレビ系 | A SDA Most Popular Foreign Drama 2021 (**popularity prize** — weight down) | 1 |
| 145 | ひらやすみ | — | 2025 | NHK総合 (夜ドラ) | B RS2025 3/5 (藤原 #2, 田幸 #4, 麦倉 #8); Galaxy-indiv 2025年度 (岡山天音) | 1 |
| 146 | いつか、無重力の宙で | — | 2025 | NHK総合 | B RS2025 3/5 (明日 #10, 田幸 #9, 成馬 #2) | 1 |
| 147 | しあわせは食べて寝て待て | — | 2025 | NHK総合 | B RS2025 2/5 (藤原 #7, 田幸 #10) | 1 |
| 148 | 晩餐ブルース | — | 2025 | テレビ東京 | B RS2025 2/5 (藤原 #8, 田幸 #8) | 1 |
| 149 | ちょっとだけエスパー | — | 2025 | テレビ朝日 | B RS2025 2/5 (藤原 #9, 成馬 #7) | 1 |
| 150 | ぼくたちん家 | — | 2025 | 日本テレビ | B RS2025 2/5 (明日 #5, 田幸 #5) | 1 |
| 151 | 日本一の最低男 ※私の家族はニセモノだった | — | 2025 | フジテレビ | B RS2025 2/5 (田幸 #7, 成馬 #9) | 1 |
| 152 | 愛の、がっこう。 | — | 2025 | フジテレビ | B RS2025 (藤原 #10) | 1 |
| 153 | バニラな毎日 | — | 2025 | NHK総合 | B RS2025 (明日 #8) | 1 |
| 154 | フェイクマミー | — | 2025 | TBS | B RS2025 (明日 #9) | 1 |
| 155 | しあわせな結婚 | — | 2025 | テレビ朝日 | B RS2025 (麦倉 #3) | 1 |
| 156 | イクサガミ | Last Samurai Standing† | 2025 | Netflix | B RS2025 (麦倉 #4) | 1 |
| 157 | シミュレーション～昭和16年夏の敗戦～ | — | 2025 | NHK総合 | B RS2025 (麦倉 #9) | 1 |
| 158 | あおぞらビール | — | 2025 | NHK総合 | B RS2025 (麦倉 #10) | 1 |
| 159 | ESCAPE それは誘拐のはずだった | — | 2025 | 日本テレビ | B RS2025 (成馬 #1) | 1 |
| 160 | ひとりでしにたい | — | 2025 | NHK総合 | B RS2025 (成馬 #5) | 1 |
| 161 | 地震のあとで | — | 2025 | NHK総合 | B RS2025 (成馬 #6) | 1 |
| 162 | 魔法少女山田 | — | 2025 | テレビ東京 | B RS2025 (成馬 #8) | 1 |
| 163 | おむすび | — | 2024–25 | NHK総合 (朝ドラ) | B RS2025 (成馬 #10) | 1 |
| 164 | 恋は闇 | — | 2025 | 日本テレビ | B EC2025 (あまの top 5) | 1 |
| 165 | ロイヤルファミリー | — | 2025 | TBS | B EC2025 (まっつ top 5) | 1 |
| 166 | 光る君へ | — | 2024 | NHK総合 (大河) | B RS2024 4/5 (田幸 #10, 麦倉 #2, 成馬 #8, 藤原 #2) | 1 |
| 167 | 宙わたる教室 | — | 2024 | NHK総合 | B RS2024 3/5 (田幸 #1, 麦倉 #4, 藤原 #6) | 1 |
| 168 | 海のはじまり | — | 2024 | フジテレビ | B RS2024 3/5 (麦倉 #9, 成馬 #3, 藤原 #10) | 1 |
| 169 | お別れホスピタル | — | 2024 | NHK総合 | B RS2024 2/5 (田幸 #7, 藤原 #5) | 1 |
| 170 | 地面師たち | Tokyo Swindlers | 2024 | Netflix | B RS2024 2/5 (麦倉 #1, 成馬 #6); (JT2024 mention, not counted) | 1 |
| 171 | 団地のふたり | — | 2024 | NHK BS | B RS2024 (田幸 #8) | 1 |
| 172 | 滅相も無い | — | 2024 | MBS/TBS | B RS2024 (麦倉 #10) | 1 |
| 173 | 仮想儀礼 | — | 2023 | NHK BS | B RS2024 (明日 #1) | 1 |
| 174 | 3000万 | — | 2024 | NHK総合 | B RS2024 (明日 #3) | 1 |
| 175 | ケの日のケケケ [special] | — | 2024 | NHK総合 | B RS2024 (明日 #4) | 1 |
| 176 | 全領域異常解決室 | — | 2024 | フジテレビ | B RS2024 (明日 #9) | 1 |
| 177 | Shrink―精神科医ヨワイ― | — | 2024 | NHK総合 | B RS2024 (明日 #10) | 1 |
| 178 | ベイビーわるきゅーれ エブリデイ！ | — | 2024 | テレビ東京 | B RS2024 (成馬 #1) | 1 |
| 179 | イシナガキクエを探しています [special, mockumentary] | — | 2024 | テレビ東京 | B RS2024 (成馬 #2) | 1 |
| 180 | 【推しの子】 (live-action) | — | 2024 | Prime Video | B RS2024 (成馬 #7) | 1 |
| 181 | さよならのつづき | — | 2024 | Netflix | B RS2024 (成馬 #9) | 1 |
| 182 | 大奥 (Season1 + Season2) | — | 2023 | NHK総合 | B RS2023 3/5 (小田 #4, 田幸 #5 [S2], 麦倉 #1 [S1] & #3 [S2]) | 1 |
| 183 | セクシー田中さん | — | 2023 | 日本テレビ | B RS2023 3/5 (小田 #6, 麦倉 #6, 藤原 #5) | 1 |
| 184 | あなたがしてくれなくても | — | 2023 | フジテレビ | B RS2023 3/5 (小田 #7, 成馬 #10, 麦倉 #5) | 1 |
| 185 | 離婚しようよ | — | 2023 | Netflix | B RS2023 2/5 (小田 #5, 田幸 #4) | 1 |
| 186 | らんまん | — | 2023 | NHK総合 (朝ドラ) | B RS2023 2/5 (田幸 #1=, 藤原 #2); Galaxy-indiv 2023年度 (神木隆之介) | 1 |
| 187 | 100万回 言えばよかった | — | 2023 | TBS | B RS2023 (小田 #8) | 1 |
| 188 | 東京貧困女子。-貧困なんて他人事だと思ってた- | — | 2023 | WOWOW | B RS2023 (小田 #9) | 1 |
| 189 | いちばんすきな花 | — | 2023 | フジテレビ | B RS2023 (成馬 #1) | 1 |
| 190 | 幽☆遊☆白書 (live-action) | Yu Yu Hakusho† | 2023 | Netflix | B RS2023 (成馬 #2) | 1 |
| 191 | 量産型リコ -もう1人のプラモ女子の人生組み立て記- | — | 2023 | テレビ東京 | B RS2023 (成馬 #4) | 1 |
| 192 | THE DAYS | The Days† | 2023 | Netflix | B RS2023 (成馬 #7) | 1 |
| 193 | 季節のない街 | — | 2023 | Disney+ | B RS2023 (成馬 #8) | 1 |
| 194 | リバーサルオーケストラ | — | 2023 | 日本テレビ | B RS2023 (田幸 #3) | 1 |
| 195 | わたしの一番最悪なともだち | — | 2023 | NHK総合 | B RS2023 (田幸 #6) | 1 |
| 196 | 彼女たちの犯罪 | — | 2023 | 読売テレビ/日本テレビ系 | B RS2023 (田幸 #7) | 1 |
| 197 | 往生際の意味を知れ！ | — | 2023 | MBS | B RS2023 (田幸 #8) | 1 |
| 198 | 家族だから愛したんじゃなくて、愛したのが家族だった | — | 2023 | NHK BS | B RS2023 (田幸 #9) | 1 |
| 199 | 舞妓さんちのまかないさん | The Makanai† | 2023 | Netflix | B RS2023 (麦倉 #4) | 1 |
| 200 | ゆりあ先生の赤い糸 | — | 2023 | テレビ朝日 | B RS2023 (麦倉 #7) | 1 |
| 201 | すべて忘れてしまうから | — | 2022 | Disney+ | B RS2023 (麦倉 #9) | 1 |
| 202 | 僕の手を売ります | — | 2023 | FOD | B RS2023 (麦倉 #10) | 1 |
| 203 | こっち向いてよ向井くん | — | 2023 | 日本テレビ | B RS2023 (藤原 #3) | 1 |
| 204 | 今夜すきやきだよ | — | 2023 | テレビ東京 | B RS2023 (藤原 #4) | 1 |
| 205 | いちげき | — | 2023 | NHK総合 | B RS2023 (藤原 #6) | 1 |
| 206 | 舞いあがれ！ | — | 2022–23 | NHK総合 (朝ドラ) | B RS2023 (藤原 #7) | 1 |


Notes on specific rows:
- **Galaxy-indiv (not counted)** also cites, with no counted placement anywhere: トットてれび / シリーズ・江戸川乱歩短編集 (満島ひかり 2016年度), おんな城主 直虎 / 民衆の敵 / わろてんか (高橋一生 2017年度), ペンション・恋は桃色 (伊藤沙莉 2019年度), 青天を衝け (草彅剛 2021年度), 佐武と市捕物控 / お義父さんと呼ばせて (遠藤憲一 2015年度), 片想い (2026) / 冬のなんかさ、春のなんかね (岡山天音 2025年度). Not given rows.
- **DA before 2016** (visible in the same wiki table, out of DA scope): 2015 winners デート〜恋とはどんなものかしら〜 (#84), 天皇の料理番 (#85), 民王 (#86), 下町ロケット (#87); classics like JIN-仁-, Mother, あまちゃん, カーネーション etc. appear further back. Also TDA 2015 (GP 天皇の料理番; 優秀 マッサン, きょうは会社休みます。, アオイホノオ, デート). Add a "classics" pass if the article wants pre-2016 titles.
- **大奥 / きのう何食べた? / おいハンサム!!**: seasons merged.
- `[special]` rows (八月の声を運ぶ男, 浜の朝日の嘘つきどもと, Kurara, 終りに見た街, etc.) are scripted but may not fit a "series" guide.
- **The Queen of Villains**: all AACA 2025 placements are under one key → 1. Its AACA grand Best Actress / Best Direction are the strongest international jury wins found for a Japanese live-action series in 2024–2025 apart from Kore-eda's SDA director prize.
- **Asura / 阿修羅のごとく**: NYT and SDA list it as "Asura" (Japan, Kore-eda); RS lists 『阿修羅のごとく』（Netflix）. Linking the two is general knowledge (Kore-eda directed the Netflix series) — verify.
- **Please Die My Beloved** (AACA 2025): Japanese title not confirmed in any read source.

### 2b. Found in sources but excluded

| Title | Why excluded | Where it appeared |
|---|---|---|
| Shōgun | US production (FX/Hulu), Japan-set, mostly Japanese dialogue | Guardian 2024 (50 best); Primetime Emmy / Golden Globe winner (US file); Japan Times 2024 essay |
| Sunny | US production (Apple TV+), Japan-set | Guardian 2024 |
| Tokyo Vice | US production (Max) | Japan Times 2024 essay (mention) |
| Pachinko | US production (Apple TV+), partly set in Japan | Guardian 2022 / 2024; AACA 2025 KR national acting wins |
| Drops of God (神の雫 / Les Gouttes de Dieu) | France/US-led co-production with Japan (Legendary / Dynamic / 22H22 / Adline / France Télévisions / Hulu; flagged FRA/JAP) — **borderline**, decide editorially | International Emmy Best Drama Series **WIN 2024** (52nd) |
| House of Ninjas | Japanese Netflix series but only *mentioned* in JT2024 essay, no counted placement | JT2024 (mention) |
| Bullet Train Explosion (新幹線大爆破) | Netflix film, not a series | AACA 2025 JP national Best Actor (草彅剛), editing/VFX-type categories |
| Dandadan; Attack on Titan; Mob Psycho 100 | anime | NYT-Intl2025 (Dandadan); NYT decade list 2019 honorable mentions |
| Tatsuki Fujimoto 17-26; My Melody & Kuromi; To Your Eternity; Gudetama: An Eggscellent Adventure; Rilakkuma's Theme Park Adventure; Muromachi Burai | anime / kids animation | Intl Emmy 2022/2023/2026; AACA 2025 (My Melody & Kuromi grand Best Animation) |
| Mitateru-phose: Let's Change Perspectives! | kids/educational | Intl Emmy 2026 nom; AACA 2025 JP national Children's |
| Love by A.I. | non-scripted (Intl Emmy Non-Scripted Entertainment nom 2023) | 51st Intl Emmy |
| Kiyou's Kata; WHO I AM (WOWOW); Who I Am Life; Ryuichi Sakamoto: Last Days; Jake and Charice; Art Is Our Voice; Wonderful World: A New York Jazz Story; Myanmar Coup: Digital Resistance; Kabuki Actors' Anguish; Say Hello to Kenshiro; Never-Ending Man: Hayao Miyazaki; The Phone of the Wind | documentaries / sports docs / arts docs | Intl Emmy 2017–2025 |
| The Man Who Shot Hiroshima (WOWOW) | Intl Emmy 2016 winner (bold) — category not resolved, likely documentary/arts; not counted | 44th Intl Emmy |
| Galaxy テレビ部門 non-drama winners (NHKスペシャル, ETV特集, 世界は3で出来ている, ハイパーハードボイルドグルメリポート, etc.) | documentary / variety | Galaxy 2015–2025年度 |
| AACA 2025 JP non-fiction winners (Hiroshima's Tower of Life, Tokyo by Night, Song vs Dance, Cracking the Case…, Tadao Ando's "Youth", A Kabuki Legacy, Discharged by Death…, 100 CAMERAS, The Asia Trade) | documentary / news / lifestyle / entertainment | AACA 2025 |
| Yasu – A Single Father's Story | Intl Emmy Best Actor nom (堤真一) **2013** (per en.wikipedia snippet) — before window | Intl Emmy Best Actor page |
| Mozu; Saka no Ue no Kumo; Yae's Sakura | Intl Emmy Best Drama Series noms — pre-2016 (Mozu year not resolved; aired 2014) | Intl Emmy Drama page |
| Storytelling of Hostages (人質の朗読会, WOWOW) | Intl Emmy TV Movie/Mini nom, 2015 or earlier (row sits before the 2015 block) | Intl Emmy TV Movie page |
| NEO – Office Chuckles; The Perfect Manual; Hoshi Shinichi's Short Shorts | Intl Emmy Comedy noms/wins, 2000s | Intl Emmy Comedy page |
| Galileo season 2 | SDA 2014 (pre-window) | SDA |
| Midnight Diner season 3; Special Gourmet (孤独のグルメ special) | SDA "Special Invitation" (screening, not an award); ~2015 and 2018 | SDA |
| My Beautiful Man Season 2 | SDA Outstanding Asian Star (actor 八木勇征), an actor/popularity-type category, ~2023 — not counted | SDA |
| Shoe-shine Boy; The Violin; Crying Out Love, in the Center of the World; Nodame Cantabile; The Shopping Trip; Jin; Karei-naru Ichizoku (2007); Threads of Our Hearts; Lady Butterfly; Switch Girl!! 2 | SDA 2006–2013 — pre-window classics | SDA |

## 3. Could not access / caveats

- **toolDegradation**: (1) Groundlane `web_fetch` / `web_extract` / `web_search` was the primary tool and handled ja/en Wikipedia (`action=raw`, `&section=N`), j-ba.or.jp, AACA official pages, realsound.jp, eigachannel.jp, Japan Times, Guardian, Variety, yearendlists.com. Groundlane search reported `tavily unavailable` / `exa unavailable` / `brave unavailable` on some calls and fell back to the remaining providers (brave/you). (2) Exa `web_fetch_exa` used once for the ResetEra NYT-decade transcription (Groundlane hit a browser challenge). Tavily and jina not needed; Firecrawl not used (credits exhausted); terminal curl not used.
- **Drama Academy ranks**: only 最優秀作品賞 collected (Wikipedia has winners only). Per-cour ranked results (作品賞 2位/3位, 読者/審査員/TV記者 points) live on thetv.jp/feature/drama-academy/NNN/awards/ — not read.
- **Minpo 2016–2020**: j-ba.or.jp/award2019/ and /award2020/ returned a 26 KB page without the drama block; 2016–2018 not tried. Coverage gap for those years.
- **Galaxy**: monthly 月間賞 and 入賞 (many dramas) not collected; only year-level prizes.
- **Real Sound 2016–2022**: tag pages for 2021/2022 (`/tag/2022年間ベスト`) returned an empty 17 KB page; earlier years' critics lists not found. RS coverage is 2023–2025 only, which biases B toward recent shows.
- **Japanese critics' polls not found / not read**: 日経エンタテインメント!, 週刊文春, TVガイド, QJWeb, 「ドラマ評論家が選ぶ」 magazine polls — one search surfaced only fan/reader votes (ORICON 満足度, モデルプレス ベストドラマアワード, ねとらぼ) which are not critics' lists and were not counted. 映画チャンネル 2024 roundtable not checked.
- **English-language lists**: Guardian 2020–2025, Variety Intl 2025, NYT Hale 2019/2024/2025 checked → only *Asura* (NYT 2025). Guardian 2016–2019, Time, Vulture, Collider, IndieWire, Rolling Stone not checked for Japanese titles; Japan Times year-end pieces for 2023/2025 not found.
- **International Emmy**: years for Mozu / Storytelling of Hostages / Yasu not resolved from the category pages (all pre-2016 anyway). 54th (2026) ceremony is 23 Nov 2026 — no Japanese live-action nominee.
- **AACA**: 2019 and 2020 Japan national Best Drama Series winners absent from the Wikipedia table (table lists 2018, 2021–2024). 2025 from the official site. Other AACA fiction categories (actor/actress/direction/screenplay) only checked for 2025.
- **SDA**: the "Most Popular Foreign Drama" prize (Signal 2021) is probably audience-based; consider excluding. Without it, Signal drops to 0.
- **First-air years, `†` English titles, `?` years, and the Asura / Please Die My Beloved / Moribito-style Japanese-title mappings are unsourced.**
- Snippets were never counted as placements.
