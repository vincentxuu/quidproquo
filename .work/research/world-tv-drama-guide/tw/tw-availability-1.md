# Taiwanese dramas, batch 1: where to watch legally in Taiwan (checked 2026-11-13)

Scope: the 24 shows in `tw/tw-batch-1.tsv`. For each one, this file records the official title, the Taiwan platform(s) with a title-page link, and the evidence. We have no Taiwan IP, and no proxy or bot-check workaround was used.

Evidence rules (same as `jp/tw-availability-1.md` and `cn/tw-availability-1.md`, plus the rules for this round):
- **iQIYI international (iq.com, 愛奇藝台灣站) and Tencent WeTV do NOT count.** If they are the only Taiwan option, the verdict is `iq/WeTV only`, and the URL is recorded for information.
- **YouTube**: the channel, title and date come from Exa's search/fetch of the watch URL (Exa reports the channel as author and the publish timestamp). "Netflix Taiwan" is the Taiwan channel. Older Taiwanese Netflix originals (2021–2023) were trailered on the Netflix Malaysia / Netflix Asia channel; those trailers are noted but not counted as Taiwan proof.
- **About Netflix `about.netflix.com/zh_tw/news/…`** is Netflix's own newsroom. A post tagged 「全球台灣」 counts as an official channel.
- **Netflix `netflix.com/tw/title/<id>`** links are leads only, because Netflix serves those pages by requester IP. An ID is quoted only when it came from a Netflix Taiwan YouTube description, or from a search hit whose page title names the show.
- **公視+ (`ptsplus.tv/zh/programs/<uuid>`)** counts when the page's `<title>` is 「公視+ | <show>」. A lapsed or removed page returns 「公視+ | 404」. This was calibrated on the known-lapsed `programs/da52e6ae-…` page from the JP round, which still returns 404.
- **Disney+ `/zh-tw/browse/entity-…`** pages count when the fetch returns 「觀看<title> | Disney+」.
- **Hami Video** pages count when `<title>` carries the show's name. The 「下架時間」 (licence end) is read from the page's `endDate0` field.
- **LINE TV**: a page counts when it loads with the title and contains no 「授權到期」. Lapsed pages show 「此戲劇因授權到期，已下架」 and 「即將上線」.
- **friDay影音** pages count when they load with the title. **myVideo** pages are inconclusive to our non-TW IP. **KKTV** closed at the end of 2025 and is not counted. A **CATCHPLAY+** title page redirected to the CATCHPLAY home page for our IP, so CATCHPLAY+'s own editorial site (編看編談, dated) is used instead.
- **Official free streaming**: these are a broadcaster's own full-episode uploads, or TaiwanPlus (the government-funded international service, free with no registration; Mirror Media 2024-10-22 says 「國內外民眾可免費、免註冊」). They are recorded as "official free". No official YouTube full-episode channel was confirmed this round (see Notes).
- **Taiwan media** means a Taiwan outlet that names the Taiwan platform, with its date.
- **Linear TV** (公視, 華視, 八大, 台視, CATCHPLAY 電影台…) is noted where seen but does not count.
- **Verdicts**:
  - `confirmed`: an official channel or newsroom, a service page, or Taiwan media, with a date.
  - `licensed-old`: the only evidence is from 2023 or earlier.
  - `lapsed`, `iq/WeTV only` and `not found`: as named.

## Table

| English | 台灣原名 | 官方譯名／英文名 (source) | Platform(s) + title-page URL | Evidence URL + type + date | Verdict |
|---|---|---|---|---|---|
| The Resurrected | 回魂計 | The Resurrected (TSV). **Co-pro flag:** the TSV says "co-pro TW–Thailand per DailyView". Netflix's press release lists Thai actor 蘇格拉瓦·卡那諾 as 特別演出 and a fictional city 「班佧」, but names no Thai co-producer, so the co-pro claim is unverified. | Netflix (Netflix original). No title ID was found. | About Netflix (zh_tw, 全球台灣), 2025-09-02: https://about.netflix.com/zh_tw/news/chinese-language-revenge-thriller-the-resurrected-unveils-main-trailer 「2025年10月9日於Netflix全球獨家播出」. Taiwan media: beauty321, 2026-02-14 (https://www.beauty321.com/post/71268), lists it among 「Netflix燒腦懸疑台劇」. | confirmed (official newsroom 2025-09; Taiwan media 2026-02) |
| Copycat Killer | 模仿犯 | Copycat Killer (About Netflix) | Netflix (Netflix original, 瀚草). No TW title ID was found. | beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦7：《模仿犯》」. About Netflix zh_tw, 2022-03-03 (https://about.netflix.com/zh_tw/news/netflix-assembles-all-star-cast-to-do-justice-to-copycat-killer-adaptation). The 2023 trailers are on Netflix Malaysia/Asia (https://www.youtube.com/watch?v=Sk-XhCaz5M0), so they are not counted. | confirmed (Taiwan media, 2026-02-14) |
| Wave Makers | 人選之人－造浪者 | Wave Makers (Netflix trailer keywords) | Netflix (global exclusive since 2023-04-28). Not found on 公視+: no `ptsplus.tv/programs` page surfaced, only 公視 articles about the 2023 broadcast controversy. Linear: 公視. | beauty321, 2025-09-14 (https://www.beauty321.com/post/67277): its 「2025Netflix台劇推薦」 list includes 《人選之人－造浪者》. The 2023 trailer is on the Netflix Malaysia/Asia channel (https://www.youtube.com/watch?v=A2VMwf58M3I), so it is not counted. | confirmed (Taiwan media, 2025-09-14) |
| The Outlaw Doctor | 化外之醫 | The Outlaw Doctor (公視+ / Hami titles) | 公視+: https://www.ptsplus.tv/zh/programs/0e5ad353-29e5-4e8c-a014-009333bcf81e. Hami Video (some episodes free): https://hamivideo.hinet.net/product/286712.do?cs=2 (下架時間 2030-03-07). Netflix per beauty321 (2025-09, lead). | The 公視+ page loaded on 2026-11-13 as 「公視+ \| The Outlaw Doctor化外之醫」; the Hami page loaded with the title and licence date. | confirmed (service page) |
| Shards of Her | 她和她的她 | Shards of Her (TSV) | Netflix (Netflix global exclusive per 劇夠 2023). No TW title ID was found. | beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦8：《她和她的她》」. 劇夠 (公視+), 2023-09-14 (https://dramago.ptsplus.tv/articles/8255/): 「Netflix全球獨家華語懸疑劇」. Site-restricted searches of Hami, LINE TV, friDay, CATCHPLAY+, 公視+ and Disney+ found no page. | confirmed (Taiwan media, 2026-02-14) |
| Had I Not Seen the Sun | 如果我不曾見過太陽 | Had I Not Seen the Sun (About Netflix URL slug, YT keyword) | Netflix (original): https://www.netflix.com/tw/title/81766275 (ID from the Netflix Taiwan trailer description). Part 1 launched 2025-11-13 and part 2 on 2025-12-11. | https://www.youtube.com/watch?v=67aW34TI9V0 「《如果我不曾見過太陽》 \| 正式前導預告 \| Netflix」, Netflix Taiwan (per Exa; no date exposed). About Netflix zh_tw, 2025-10-21 (https://about.netflix.com/zh_tw/news/had-i-not-seen-the-sun-drops-main-trailer-and-key-art). 今周刊/LINE TODAY, 2025-12-19: Netflix Taiwan top 10. | confirmed (official channel, 2025-10) |
| Forget You Not | 忘了我記得 | Forget You Not (YT keywords) | Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81730394 (ID from the Netflix Taiwan trailer description). | https://www.youtube.com/watch?v=s-iH3SucfjA 「《忘了我記得》\| 正式前導預告 \| Netflix」, Netflix Taiwan, 2025-04-07: 「2025年5月23日於Netflix全球獨家播出」. Also beauty321, 2025-09-14. | confirmed (official channel, 2025-04) |
| Someday or One Day | 想見你 | Someday or One Day (zh-Wikipedia) | Disney+ (subscription): https://www.disneyplus.com/zh-tw/browse/entity-0ecf60e6-2247-4d59-bd18-7976772866a3 (series, with episodes). LINE TV https://www.linetv.tw/drama/10900 says 「此戲劇因授權到期，已下架」 (**lapsed**). The 2023 Netflix TW release was the film version, not the series. | The Disney+ zh-tw page loaded on 2026-11-13 as 「觀看想見你 \| Disney+」 and lists 「第 1 季第 1 集」. zh-Wikipedia says Disney+ added it in Mar 2022. | confirmed (service page) |
| The World Between Us (S1) / The World Between Us: After the Flames (S2) | 我們與惡的距離 (+ II) | The World Between Us: After the Flames (CATCHPLAY+ article). **Co-pro flag:** S1 was a 公視 × CATCHPLAY × HBO Asia co-production (公視 press release 2019-03-08). S2 is 公視 + 大慕 with CATCHPLAY+ as streaming partner. | 公視+ (both seasons on one program page): https://www.ptsplus.tv/zh/programs/55585715-e0e9-4e9f-8956-112319ecd7ac (S2 season page …/seasons/109c97b9-2c1f-44f9-937d-99cd6aecfb7f). CATCHPLAY+ (S1 and S2). TaiwanPlus (S1, free, English subs). | The 公視+ page loaded on 2026-11-13 as 「公視+ \| 我們與惡的距離」. CATCHPLAY+ 編看編談, 2026-10-26 (https://edsays.catchplay.com/tw/article-4865-mjaa6gxm): 「全集集數可在 CATCHPLAY+ 線上看」, with a free week from 10/26 to 10/31. Mirror Media, 2024-10-22 (https://www.mirrormedia.mg/story/20241022insight004): S1 on TaiwanPlus. | confirmed (service page + platform's own article, 2026-10) |
| I Am Married... But! | 童話故事下集 | I Am Married...But! (About Netflix producer quote) | Netflix (Netflix exclusive, 打勾勾娛樂). No TW title ID was found. | About Netflix zh_tw, 2025-01-14 (https://about.netflix.com/zh_tw/news/happily-never-after-i-am-married-but-unveils-the-realities-of-marriage-in): 「2025年2月14日於Netflix全球獨家播出」. Netflix Taiwan Short https://www.youtube.com/shorts/8dFt1jWpquM (2025-02-17). Also beauty321, 2025-09-14. | confirmed (official channel, 2025-01/02) |
| Light the Night | 華燈初上 | Light the Night (TSV) | Netflix (Netflix original, three parts). No TW title ID was found. | beauty321, 2026-02-14 (https://www.beauty321.com/post/71268): 「Netflix懸疑台劇推薦6：《華燈初上》」. 造咖, 2025-10-15 (https://cava.tw/entertainment/moviestv/261142). The 2021 trailers are on Netflix Malaysia/Asia, so they are not counted. | confirmed (Taiwan media, 2026-02-14) |
| The Victims' Game (S1–S2) | 誰是被害者 (+ 2) | The Victims' Game (YT keyword) | Netflix (Netflix original): https://www.netflix.com/tw/title/81318134 (ID from the Netflix Taiwan S2 trailer description; one title page covers both seasons). | https://www.youtube.com/watch?v=7RfsUh-VjEo 「《誰是被害者》第2季 \| 正式預告 \| Netflix」, Netflix Taiwan, 2024-06-02. Also About Netflix zh_tw, 2024-06-03, and beauty321, 2026-02-14 (S1 and S2 listed as Netflix). | confirmed (official channel 2024-06; Taiwan media 2026-02) |
| Oh No! Here Comes Trouble | 不良執念清除師 | Oh No! Here Comes Trouble (UpToGo; dramanavi) | No counted Taiwan service found. iq.com (an iQIYI international original, full 12 episodes): https://www.iq.com/album/%E4%B8%8D%E8%89%AF%E5%9F%B7%E5%BF%B5%E6%B8%85%E9%99%A4%E5%B8%AB-2023-27nybrvgqat?lang=zh_tw (not counted). A 公視+ page (https://www.ptsplus.tv/zh/programs/fcec6934-a6ff-44ed-b00c-4fd1c53c158b, indexed as 「公視+ \| 不良執念」) now returns 「公視+ \| 404」. Linear: 八大, 台視, 三立都會台, AXN. | UpToGo, 2026-01-17 and 2026-03-31: not on Netflix, Hami or LINE TV; 「線上獨家播出版權在愛奇藝」. Site-restricted searches of Hami, LINE TV, friDay, myVideo and CATCHPLAY+ found no title page (the Hami and CATCHPLAY search pages render client-side, so they are inconclusive). | iq/WeTV only (a 公視+ copy has lapsed) |
| Port of Lies | 八尺門的辯護人 | Port of Lies (TaiwanPlus / Mirror) | 公視+: https://www.ptsplus.tv/zh/programs/9d9bd8cd-83cb-4119-9a70-35ec815fa131. LINE TV: https://www.linetv.tw/drama/16600/eps/1. TaiwanPlus (free, English subs). Netflix per beauty321 (2025-09, lead). | The 公視+ page loaded on 2026-11-13 as 「公視+ \| 八尺門的辯護人」. The LINE TV page loaded with the title and no 「授權到期」. Mirror Media, 2024-10-22: TaiwanPlus. | confirmed (service page) |
| Let's Talk About CHU | 愛愛內含光 | Let's Talk About CHU (Netflix page title) | Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81718141 (the indexed page is titled "Watch Let's Talk About CHU \| Netflix"; the Netflix Taiwan trailer description links 81718142 instead). | https://www.youtube.com/watch?v=_UK_fxwy55M 「《愛愛內含光》 \| 正式前導預告 \| Netflix」, Netflix Taiwan (no date exposed). About Netflix zh_tw, 2024-01-05: 「2月2日全球獨家上線」. beauty321, 2025-09-14: listed as Netflix. | confirmed (official channel 2024-01; Taiwan media 2025-09) |
| GG Precinct | 正港分局 | GG Precinct (YT keyword) | Netflix (Netflix exclusive): https://www.netflix.com/tw/title/81740096 (ID from the Netflix Taiwan trailer description). | https://www.youtube.com/watch?v=YN8w0CGRMws 「《正港分局》 \| 正式預告 \| Netflix」, Netflix Taiwan, 2024-08-04. About Netflix zh_tw, 2024-08-05. | confirmed (official channel, 2024-08). Netflix exclusive, so lapse risk is low. |
| Gold Leaf | 茶金 | Gold Leaf (Hami ep page) | 公視+: https://www.ptsplus.tv/zh/programs/1075b4c1-de46-4255-94e3-e22272dcddbe. LINE TV https://www.linetv.tw/drama/12800/eps/1 shows 「授權到期」 and 「即將上線」 (**lapsed**). Hami ep page https://hamivideo.hinet.net/product/176003.do?cs=2 showed 下架時間 2025-11-12 (**lapsed**). | The 公視+ page loaded on 2026-11-13 as 「公視+ \| 茶金」. 劇夠 2023-07-28: 「《茶金》公視+線上全集收看」. | confirmed (service page) |
| Imperfect Us | 不夠善良的我們 | Imperfect Us (TSV) | 公視+: https://www.ptsplus.tv/zh/programs/6c134e09-7811-4585-b270-89f2658197a4. myVideo (inconclusive). Netflix per beauty321 (2025-09, lead). | The 公視+ page loaded on 2026-11-13 as 「公視+ \| 不夠善良的我們」. 劇夠 2024-09-16: 「到公視+ 看《不夠善良的我們》」. | confirmed (service page) |
| Agent from Above | 乩身 | Agent from Above (TSV) | Netflix (Netflix original; launched 2026-04-02). No title ID was found. | https://www.youtube.com/watch?v=aNycdiA6t74 「《乩身》\| 正式前導預告 \| Netflix」, Netflix Taiwan, 2026-03-03. Also 「特別版預告：泥娃娃篇」, Netflix Taiwan, 2026-04-02. 青年日報 2026-03-17: 「Netflix《乩身》即將於4月2日上線」. | confirmed (official channel, 2026-03) |
| **Adrift in Love** (filled; MDL also lists "Love Afloat") | 人浮於愛 | **Adrift in Love** (瀚草 GrX page https://www.grx.com.tw/Adriftinlove; TMDB/MyDramaList). The TSV said 待查. | 公視+: https://www.ptsplus.tv/zh/programs/5d550a85-687e-44ce-8be2-f905040ed268. myVideo (inconclusive). iq.com (not counted). Netflix per the 瀚草 page (lead). Linear: 公視; 八大 in 2026. | The 公視+ page loaded on 2026-11-13 as 「公視+ \| 人浮於愛」. TVBS 2025-11-03 and Marie Claire TW 2025-10-27: 「公視+、台灣大哥大MyVideo、愛奇藝國際站」. | confirmed (service page) |
| The Making of an Ordinary Woman (S1–S2) | 俗女養成記 (+ 2) | The Making Of An Ordinary Woman (Hami page) | Hami Video (S1): https://hamivideo.hinet.net/product/284540.do?cs=2 (全10集, 下架時間 2028-12-31). TaiwanPlus (S1–S2, free, English subs): https://www.taiwanplus.com/shows/drama-and-movie/tv-series/461/the-making-of-an-ordinary-woman. Netflix per beauty321 (2025-09, lead). No current page was found for S2 on Hami or 公視+. 華視影Bar has a 「【完整版】俗女養成記1」 page (https://vod.cts.com.tw/?pid=2524&type=drama), but its content could not be read. | The Hami page loaded on 2026-11-13 with the title and licence date. The TaiwanPlus page loaded with the title and season-2 markup. Taiwan News, 2025-01-24 (https://www.taiwannews.com.tw/zh/news/6023122): TaiwanPlus 「《俗女養成記》一、二季…免費免註冊」. | confirmed (service page; S2 via TaiwanPlus/media) |
| Taiwan Crime Stories | 台灣犯罪故事 | Taiwan Crime Stories | Disney+ (original): https://www.disneyplus.com/zh-tw/browse/entity-0e22e97a-9295-490a-b798-0c612c4815cf | The page loaded on 2026-11-13 as 「觀看台灣犯罪故事 \| Disney+」 (2023, 1 season, 12 episodes). Disney Plus TW trailer https://www.youtube.com/watch?v=o_lTvsOjOdk (2022-12-04). | confirmed (service page) |
| Born for the Spotlight | 影后 | Born for the Spotlight (YT title) | Netflix (Netflix exclusive, 良人行). No TW title ID was found. | About Netflix zh_tw, 2024-10-08 (https://about.netflix.com/zh_tw/news/born-for-the-spotlight-trailer-peels-back-the-curtain-on-cruel-and-intense): 「11月7日於Netflix全球獨家播出」. 造咖, 2025-10-15 (https://cava.tw/entertainment/moviestv/261142) lists 《影后》 among Netflix 華語影集. | confirmed (official newsroom 2024-10; Taiwan media 2025-10) |
| Holiday | 拜六禮拜 | Holiday (Hami page) | Hami Video (some episodes free): https://hamivideo.hinet.net/product/294926.do?cs=2 (下架時間 2030-06-07). Netflix: https://www.netflix.com/tw/title/83077409 (ID from a PTT post, lead). Not found on 公視+. Linear: 公視台語台, 華視, 八大. | The Hami page loaded on 2026-11-13 with the title and licence date. PTT TaiwanDrama, 2025-06-08: 「每週日 23：00 Netflix、中華電信MOD、Hami Video 上架」. 公視台語台 YT posts only previews (e.g. https://www.youtube.com/watch?v=SUYlZ9Yz2l8, 2025-06-04). | confirmed (service page) |

## Notes

- **Counts (24 shows)**:
  - **Confirmed: 23.**
    - Service page: 10. These are 化外之醫, 想見你, 我們與惡的距離 (+II), 八尺門的辯護人, 茶金, 不夠善良的我們, 人浮於愛, 俗女養成記, 台灣犯罪故事 and 拜六禮拜 (on 公視+, Hami, Disney+ or LINE TV; 我們與惡 II is also backed by CATCHPLAY+'s own article).
    - Official channel or newsroom: 9. These are 回魂計, 如果我不曾見過太陽, 忘了我記得, 童話故事下集, 誰是被害者, 愛愛內含光, 正港分局, 乩身 and 影后 (Netflix Taiwan YT or About Netflix zh_tw); 回魂計 and 影后 are also backed by Taiwan media.
    - Taiwan media only: 4. These are 模仿犯 (2026-02), 人選之人 (2025-09), 她和她的她 (2026-02) and 華燈初上 (2026-02).
  - **Licensed-old: 0.**
  - **Lapsed (whole show): 0.**
  - **iq/WeTV only: 1**, 不良執念清除師 (an iQIYI international original; the 公視+ copy is 404).
  - **Not found: 0.**
- **Non-confirmed shows**: 不良執念清除師 only (iq/WeTV only).
- **Weaker confirmations**:
  - 人選之人, 模仿犯, 華燈初上 and 她和她的她 rest on Taiwan lifestyle-media round-ups (beauty321, 造咖). We found no current official Netflix Taiwan post and no Netflix TW title ID for them. They are Netflix originals or Netflix exclusives, so lapse risk is low.
  - 正港分局 rests on a 2024 official trailer; it is a Netflix exclusive.
- **Partial lapses** (the show is still confirmed elsewhere):
  - 想見你 on LINE TV (10900).
  - 茶金 on LINE TV (12800) and Hami (ep page 下架 2025-11-12).
  - 不良執念清除師 on 公視+.
- **Co-productions**:
  - 回魂計: the TSV says TW–Thailand (DailyView). Netflix's release does not support this beyond a Thai actor's special appearance, so treat the claim as unverified.
  - 我們與惡的距離 S1: 公視 × CATCHPLAY × HBO Asia (公視 press release 2019-03-08). S2 adds CATCHPLAY+ as streaming partner and Prime Video overseas.
  - 人選之人: 公視 × 大慕 with Netflix first window.
  - 化外之醫: 公視 × 中華電信 × 瀚草. Its Vietnamese-language storyline is not a foreign co-pro as far as we found.
- **Platforms confirmed**:
  - Netflix: 14, by channel or media (回魂計, 模仿犯, 人選之人, 她和她的她, 如果我不曾見過太陽, 忘了我記得, 童話故事下集, 華燈初上, 誰是被害者, 愛愛內含光, 正港分局, 乩身, 影后, 拜六禮拜 via PTT/FB). Several 公視 titles are also listed as Netflix by beauty321 2025-09; those are leads.
  - 公視+: 7 (化外之醫, 我們與惡 I+II, 八尺門, 茶金, 不夠善良的我們, 人浮於愛).
  - Hami Video: 3 (化外之醫, 俗女養成記 S1, 拜六禮拜).
  - Disney+: 2 (想見你, 台灣犯罪故事).
  - CATCHPLAY+: 1 (我們與惡 I+II, via its own article).
  - LINE TV: 1 (八尺門).
  - TaiwanPlus (free): 3 (俗女養成記 S1–S2, 八尺門, 我們與惡 S1).
- **Official YouTube (free)**: none confirmed.
  - 公視台語台 posts only previews for 拜六禮拜.
  - A playlist 「俗女養成記S1｜全劇線上看」 (https://www.youtube.com/playlist?list=PL8MwjIpV5cFXdCX3dD5dss20XnVlj-4uD) exists, but its owner channel could not be read (YouTube served a shell to Groundlane and Exa), so it is not counted.
  - The playlist 「拜六禮拜｜完整全集就佇Netflix」 points to Netflix and is not a free upload.
- **English titles filled**: 人浮於愛 → **Adrift in Love** (瀚草 GrX production page; TMDB). MyDramaList also gives "Love Afloat".
- **Netflix ID caveat**: for 愛愛內含光, the Netflix Taiwan trailer links 81718142, while the indexed title page is 81718141. Both are given; neither is proof.

toolDegradation:
- Groundlane MCP (loaded via ToolSearch) was the primary tool for search, `web_fetch` and `web_extract`.
  - In some calls the brave provider was "unavailable", and tavily/exa inside Groundlane were "unavailable" twice; you.com results filled in.
  - YouTube playlist pages returned a shell, so the owner channel was not extractable.
  - Hami and CATCHPLAY+ search pages render client-side, so they are inconclusive. A CATCHPLAY+ `/tw/video/` page redirected to the home page for our IP.
- Exa (`web_search_exa`, `web_fetch_exa`) worked (no 401). It was used for YouTube channel/date metadata, About Netflix posts and Taiwan media.
- jina and Tavily were not needed. No terminal curl, VPN or proxy was used.
