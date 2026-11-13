# Taiwanese dramas, batch 2: where to watch legally in Taiwan (checked 2026-11-13)

Scope: the 24 shows in `tw/tw-batch-2.tsv`. For each one, this file records the official title, the Taiwan platform(s) with a title-page link, and the evidence. We have no Taiwan IP, and no proxy or bot-check workaround was used.

Evidence rules (same as `jp/tw-availability-1.md` and `cn/tw-availability-2.md`, plus the Taiwanese-drama additions):
- **公視+ (PTS+)** `ptsplus.tv/zh/programs/<uuid>` pages count when they load with 「公視+ | <title>」 in `<title>` and the show's synopsis in `meta[name=description]`. A page titled 「公視+ | 404」 counts as **lapsed**. This was calibrated on a known-lapsed page (`da52e6ae…`, 海中沉睡的鑽石), which returns 「公視+ | 404」.
- **Official broadcaster YouTube**: a broadcaster's own channel posting full episodes counts as legal free streaming, recorded as "official YouTube (free)". The channel was read through Exa (author field) and dates come from the broadcaster's page. A playlist whose contents could not be read is recorded as a lead only.
- **Netflix `netflix.com/tw/title/<id>`** links are leads, not proof. Netflix is proved by a Netflix Taiwan YouTube upload (channel read through Exa), a Netflix newsroom post (about.netflix.com/zh_tw), or Taiwan media naming Netflix, with a date. Trailers on the **Netflix Malaysia** channel are not counted as Taiwan proof, even when the description addresses Taiwan.
- **Hami Video** pages count when they load with the show's title in `<title>`. The 下架時間 (licence end) is read from the hidden `endDate0` field. A product URL whose `<title>` is only 「HamiVideo」 (a 99,118-byte shell with no 下架時間) counts as **lapsed**.
- **LINE TV** pages count when they load with the title and contain neither 「授權到期」 nor 「即將上線」. Lapsed pages carry both strings.
- **HBO Max TW** `hbomax.com/tw/zh/show/<uuid>` pages count when they load as 「觀看 <title> | HBO Max」.
- **CATCHPLAY+** title pages redirect our IP to the homepage, so they are inconclusive. CATCHPLAY's own editorial (ED Says), with its date, is used instead.
- **myVideo** pages are inconclusive (they show a licence notice to non-TW IPs) and are not used either way.
- **LiTV / ofiii** title pages returned a server error 「404: TypeError…」 (LiTV) or 「404: Not Found」 (ofiii) for every title tried, so they are recorded as **inconclusive** and not counted as proof or as lapses.
- **iQIYI international (iq.com) and Tencent WeTV do NOT count.** When one of them is the only option, the verdict is `iq/WeTV only`.
- **KKTV** closed at the end of 2025 and is not counted. **Linear TV** does not count.
- "Loaded on 2026-11-13" means fetched in this session with Groundlane `web_extract` (HTTP 200, title matched).

## Table

| English | 中文片名 (tw column) | Year / net (TSV) | Platform(s) + title-page URL | Evidence URL + type + date | Verdict |
|---|---|---|---|---|---|
| Black Tide Island | 星空下的黑潮島嶼 | 2025 / 客家電視台 / 中華電信 | 公視+: https://www.ptsplus.tv/zh/programs/c2a25464-d569-410f-a776-539d1c0746fc. Hami Video (some episodes free): https://hamivideo.hinet.net/product/288397.do?cs=2 (下架時間 2028-03-29). LINE TV: https://www.linetv.tw/drama/18031/eps/1. myVideo 3/30930 exists (inconclusive). | All three pages loaded on 2026-11-13. LINE TV shows 「已完結」 with no lapse notice. | confirmed (service page) |
| Living | 有生之年 | 2023 / 聯利媒體 (TVBS) | Hami Video: https://hamivideo.hinet.net/product/236094.do?cs=2 (下架時間 2027-09-16). Netflix: no ID found. | The Hami page loaded on 2026-11-13. https://www.youtube.com/watch?v=GIsbiu5JpNU 「《有生之年》 \| 正式預告 \| Netflix」 is on the Netflix Taiwan channel, 2023-09-12 (per Exa). zh-Wikipedia lists the 2023 platforms as Netflix, MOD, Hami Video and iQIYI international. | confirmed (service page) |
| At the Moment | 此時此刻 | 2023 / Netflix / 百聿 / 天予 | Netflix (Netflix global exclusive): https://www.netflix.com/tw/title/81701115 (ID from search; lead) | https://www.youtube.com/watch?v=0uHME-cEVKc 「《此時此刻》\| 正式預告 \| Netflix」 is on the Netflix Taiwan channel, 2023-10 (per Exa). Netflix newsroom, 2023-11-14 (https://about.netflix.com/zh_tw/news/at-the-moment-rides-the-wave-of-love-taiwanese-anthology-series-cast): 「現正於Netflix全球獨家熱播中」. | confirmed (official channel). The evidence is from 2023, but Netflix commissioned it as a global exclusive. |
| More Than Blue: The Series | 比悲傷更悲傷的故事：影集版 | 2021 / 好好看 / 滿滿額 | Netflix (exclusive at launch): https://www.netflix.com/tw/title/81442597 (indexed with the TW title; lead only) | Cosmopolitan TW, 2021-09-06 (https://www.cosmopolitan.com/tw/entertainment/movies/g37485818/more-than-blue-netflix/): 「Netflix將於10月22日全球獨家播出」. The trailer nZ8_0pn3gXI is on the **Netflix Malaysia** channel (2021-09-06), so it is not counted. A Shopee TW blog (2025-12-30, https://shopee.tw/blog/netflix-recommend/) lists it among Netflix picks; that is a retailer blog, not media, so it is a lead only. No Taiwan media after 2023 was found. | licensed-old (Netflix, evidence 2021) |
| Tears on Fire | 火神的眼淚 | 2021 / 公視 | 公視+: https://www.ptsplus.tv/zh/programs/bd0f4e04-7123-4f38-981f-0b461c9284d9. 公視 YouTube playlist PLLhKX7btG59d59RjseCUbtGO6xkB7rC5j 「【火神的眼淚】｜消防職人電視劇」 (contents not readable; lead). | The 公視+ page loaded on 2026-11-13 with the synopsis. A search snippet of the same page mentioned 「限時免費觀看至10/31」, with the year unknown. The show was also on Netflix TW in 2021 (Netflix newsroom, 2022-03-20). | confirmed (service page) |
| Oops! I'm in Jail | 監所男子囚生記 | 2025 / 壹壹影業 | CATCHPLAY+: https://www.catchplay.com/tw/video/3053b6c1-aee4-434d-80e3-aab05fcafa05 (redirected to the homepage for our IP; inconclusive). myVideo was the 2025 premiere platform (inconclusive). iq.com also carries it (not counted). | CATCHPLAY ED Says, 2026-05-07 (https://www.catchplay.com/tw/ed-says/article-5068-uxzugmir): 「5/16在CATCHPLAY+全集上架，首兩集免費觀看」. myVideo blog, 2025-12-15 (https://blog.myvideo.net.tw/oops-im-in-jail-01/): 「MyVideo 11月15日正式開播」. | confirmed (service editorial, 2026-05-07) |
| Three Tears in Borneo | 聽海湧 | 2024 / 公視 / 看不見電影 | 公視+ (free, 「開放全球觀看」): https://www.ptsplus.tv/zh/programs/63b046d9-794e-41df-a76b-cd96a3e330fd. zh-Wikipedia also lists Netflix (from 2024-11) and LINE TV (from 2025-10); neither was checked. | The 公視+ page loaded on 2026-11-13. 聯合報 (udn), 2026-08-14 (https://stars.udn.com/star/story/10091/9692686): 「也已於公視+免費上架」. | confirmed (service page + Taiwan media, 2026-08-14) |
| A Touch of Green | 一把青 | 2015 / 公視 / 台北創造 | None confirmed. 公視+ https://www.ptsplus.tv/zh/programs/f342823d-1eb7-4dc0-a4c6-ffa02ef189ba returns 「公視+ \| 404」 (**lapsed**). LINE TV https://www.linetv.tw/drama/12579/eps/20 shows 「此戲劇因授權到期，已下架」 (**lapsed**). LiTV VOD00295464 and ofiii 64603 are inconclusive. Netflix: https://www.netflix.com/tw/title/80233859 is indexed (lead). | Epoch Times, 2018-04-03 (https://www.epochtimes.com/b5/18/4/2/n10271177.htm): 公視 put 《一把青》 on Netflix. No later Taiwan evidence was found. The 公視 YouTube playlist PLLhKX7btG59cksEKyZazJKskCnOFIt88X 「公視 一把青」 could not be read (lead). | licensed-old (Netflix, 2018; 公視+ and LINE TV lapsed) |
| The Cleaner (zh-Wikipedia English title) | 人生清理員（影集版） | 2024 / 果陀 | 公視+: https://www.ptsplus.tv/zh/programs/1fd797a3-b9c8-4949-b8de-a4324eb22d3a. Netflix: https://www.netflix.com/tw/title/81927215 (lead). Hami https://hamivideo.hinet.net/product/272428.do?cs=2 is now a bare 「HamiVideo」 shell (**lapsed**). | The 公視+ page loaded on 2026-11-13 as 「公視+ \| 人生清理員（影集版）」. udnSTYLE / Cosmopolitan TW, 2024-09-27 (https://style.udn.com/style/story/121034/8251825): it topped the Netflix TW chart. | confirmed (service page) |
| Workers (HBO Max URL slug) | 做工的人 **[co-pro: HBO Asia]** | 2020 / 大慕 / 凱擘 / 台灣大哥大 / HBO Asia | HBO Max TW: https://www.hbomax.com/tw/zh/show/0b4fa3a3-ab03-4c4b-9634-3e9d3922146d. myVideo was the co-premiere platform (inconclusive). | The HBO Max TW page loaded on 2026-11-13 as 「觀看 做工的人 \| HBO Max」. UpToGo, 2026-05-17, names MyVideo and HBO GO. | confirmed (service page). This is an HBO Asia original co-production. |
| The Magician on the Skywalk (zh-Wikipedia) | 天橋上的魔術師 | 2021 / 公視 / 原子映象 | 公視+: https://www.ptsplus.tv/zh/programs/6b6894e2-92ec-4932-827b-0ed10a482234. In 2021 it was also on Netflix TW, LINE TV and myVideo; LiTV added it in 2023 (zh-Wikipedia). None of these was checked. | The 公視+ page loaded on 2026-11-13 with the synopsis. | confirmed (service page). This is a 公視 × myVideo co-production. |
| Mom, Don't Do That! | 媽，別鬧了！ | 2022 / Netflix | Netflix (original): https://www.netflix.com/tw/title/81477611 (ID from netflix.com/title; lead) | Harper's Bazaar TW, 2022-06-02 (https://www.harpersbazaar.com/tw/culture/drama/g40173140/2022-netflix-tw-mom-dont-do-that/): 「7月15日在Netflix獨家上架」. zh-Wikipedia: 「Netflix推出的臺灣原創影集」. The trailer tnzugjZl7ZU is on the **Netflix Malaysia** channel, so it is not counted. | confirmed (Taiwan media, 2022). The evidence is from 2022, but this is a Netflix original, so lapse risk is low. |
| The Six of Us (大愛 event page) | 我們六個 | 2025 / 大愛 / 天邑 | Official YouTube (free): the 大愛劇場 DaAiDrama full-series playlist https://www.youtube.com/playlist?list=PLc8M1wVJOpHxqS9ObbLREMljSLYZAlvE6 (「《我們六個》｜全集」), linked from 大愛's own page https://www.daai.tv/drama/prog/P1945. Hami Video (some episodes free): https://hamivideo.hinet.net/product/303239.do?cs=2 (下架時間 2028-08-31). | The 大愛 page says 「全集收看」 and links the playlist. A PTT post (2025-08-05) says 「大愛電視台、大愛劇場YT」 aired it simultaneously from 2025-08-05. The 12-minute preview 0NiPtP_qIvk is on the 大愛劇場 DaAiDrama channel (per Exa). The Hami page loaded on 2026-11-13. | confirmed (official YouTube (free) + service page) |
| Seqalu: Formosa 1867 | 斯卡羅 | 2021 / 公視 / 台北創造 | 公視+: https://www.ptsplus.tv/zh/programs/96a5ec69-7327-4d5f-ada8-53e210e34b94. In 2021 it was also on Netflix TW, LINE TV, myVideo and Hami (zh-Wikipedia); none was checked. | The 公視+ page loaded on 2026-11-13 with the synopsis. | confirmed (service page) |
| Best Interest | 最佳利益（1–3） | 2017–2023 / various | None confirmed. LINE TV: S1 https://www.linetv.tw/drama/10501/eps/1, S2 https://www.linetv.tw/drama/14746/eps/1 and S3 https://www.linetv.tw/drama/14774/eps/1 all carry 「授權到期」 + 「即將上線」 (**lapsed**). Hami: S1 https://hamivideo.hinet.net/product/222112.do?cs=2 and S2 https://hamivideo.hinet.net/product/222544.do?cs=2 are bare shells (**lapsed**). myVideo lists 最佳利益 in a themed group (https://www.myvideo.net.tw/mainGroup/Group/suitup/; inconclusive). iq.com has S3 (not counted). | No 公視+ page was found by search. zh-Wikipedia also lists YouTube 中天娛樂頻道 from 2022-04-04 and MyVideo from 2022-10-01; neither could be verified as current. | lapsed (LINE TV + Hami licences ended; myVideo unverifiable) |
| Mad Doctor (ELLE TW URL slug; unofficial) | 村裡來了個暴走女外科 | 2022–23 / 十三月 | 公視+: https://www.ptsplus.tv/zh/programs/a3f838da-d613-4d6b-a0b0-2c5a048dba5f. Hami https://hamivideo.hinet.net/product/188605.do?cs=2 is a bare shell (**lapsed**). LiTV VOD00296163 and ofiii 64649 are inconclusive. | The 公視+ page loaded on 2026-11-13 with the synopsis. In 2022 it was also on Netflix TW (Marie Claire TW, 2022-05-26). | confirmed (service page) |
| Tabloid | 死了一個娛樂女記者之後 | 2025 / — | Hami Video: https://hamivideo.hinet.net/product/284561.do?cs=2 (下架時間 2028-02-07). Netflix: https://www.netflix.com/tw/title/81994325 (ID from the Netflix Taiwan video description). | The Hami page loaded on 2026-11-13. https://www.youtube.com/watch?v=RDA5aORQwO4 「《死了一個娛樂女記者之後》｜精彩片段」 is on the Netflix Taiwan channel, 2025-03 (search date 2025-03-11). TVBS, 2025-03-10 (https://news.tvbs.com.tw/entertainment/2783850) names 公視、Netflix、Hami Video、Catchplay+、中華電信MOD、八大電視. | confirmed (service page + official channel) |
| — (no English title found from a reliable source) | 牛車來去 | 2022 / 公視 / 禾豐 | 公視+: https://www.ptsplus.tv/zh/programs/6ace5111-0637-435c-bc35-d5c8b80f1d14. Hami Video: https://hamivideo.hinet.net/product/210517.do?cs=2 (下架時間 2028-01-13). | Both pages loaded on 2026-11-13. | confirmed (service page). This is a 公視 × 中華電信 co-production. |
| Million-Follower Detective | 百萬人推理 | 2026 / Netflix | Netflix (global exclusive): https://www.netflix.com/tw/title/81939587 (indexed as 「百萬人推理」; lead) | Netflix newsroom, 2026-01-05 (https://about.netflix.com/zh_tw/news/taiwanese-series-million-follower-detective-launches-on-february-12): 「2026年2月12日Netflix全球獨家上線」. Harper's Bazaar TW, 2026-02-12 (https://www.harpersbazaar.com/tw/culture/filmandmusic/a70293390/netflix-million-follower-detective/). | confirmed (official channel + Taiwan media, 2026) |
| A Wonderful Journey | 華麗計程車行 | 2023 / 華視 / 巧克 / LINE TV | LINE TV (co-producer): https://www.linetv.tw/drama/15286/eps/2 | The page loaded on 2026-11-13 as 「華麗計程車行第1集 無常才是正常」, with VIP badges and neither 「授權到期」 nor 「即將上線」. | confirmed (service page) |
| Lovely Villain (Hami English title) | 親愛壞蛋 | 2022–23 / — | Hami Video (some episodes free): https://hamivideo.hinet.net/product/221821.do?cs=2 (下架時間 2027-04-20) | The page loaded on 2026-11-13 with the title. | confirmed (service page) |
| Danger Zone | 逆局 | 2021 / 天予 | No Taiwan streaming service found. This is an **iQIYI international original** (zh-Wikipedia). iq.com (info only): https://www.iq.com/play/%E9%80%86%E5%B1%80-18+-%E7%AC%AC1%E9%9B%86-204v273c4vk?lang=zh_tw. Hami https://hamivideo.hinet.net/product/181592.do?cs=2 (a 2022 listing) is now a bare shell (**lapsed**). Linear: 緯來電影台 (2021). | Site-scoped searches of LINE TV and friDay found nothing. A 台視 microsite exists (linear). | iq/WeTV only |
| The Teenage Psychic | 通靈少女 **[co-pro: HBO Asia × 公視]** | 2017 / HBO Asia / 公視 / IFA Media | HBO Max TW: https://www.hbomax.com/tw/zh/show/271e7de1-97a5-4e56-9cba-d5ad6d995b83. 公視 YouTube playlist PLLhKX7btG59dz5nEgB3JmBOfkLxiOUwgw 「公視 通靈少女」 could not be read (lead). No 公視+ page was found. | The HBO Max TW page loaded on 2026-11-13 as 「觀看 通靈少女 \| HBO Max」. Only 「季1」 appeared in the page, so S2 was not confirmed there. | confirmed (service page; S1) |
| Zero Day Attack | 零日攻擊 | 2025 / (myVideo per DailyView) | 公視+: https://www.ptsplus.tv/zh/programs/605db3ed-d546-4e30-85b3-869fa25e94ba. Hami Video (some episodes free): https://hamivideo.hinet.net/product/299663.do?cs=2 (下架時間 2031-08-01). LINE TV: https://www.linetv.tw/drama/17706/eps/1. myVideo 1/31273 exists (inconclusive). | All three pages loaded on 2026-11-13. LINE TV shows 「已完結」 with no lapse notice. | confirmed (service page) |

## Notes

- **Counts (24 shows)**:
  - **Confirmed: 20.**
    - Service page: 15 (Black Tide Island, Living, Tears on Fire, Three Tears in Borneo, 人生清理員, 做工的人, 天橋上的魔術師, 斯卡羅, 村裡來了個暴走女外科, Tabloid, 牛車來去, 華麗計程車行, 親愛壞蛋, 通靈少女, 零日攻擊).
    - Official channel / newsroom: 2 (At the Moment, Million-Follower Detective).
    - Official YouTube (free) + service page: 1 (我們六個).
    - Taiwan media or service editorial: 2 (Mom, Don't Do That! 2022, a Netflix original; 監所男子囚生記, CATCHPLAY 2026-05).
  - **Licensed-old: 2.** These are More Than Blue: The Series (Netflix, 2021) and A Touch of Green (Netflix, 2018).
  - **Lapsed: 1.** This is Best Interest S1–S3 (LINE TV + Hami).
  - **iq/WeTV only: 1.** This is Danger Zone (逆局), an iQIYI international original.
  - **Not found: 0.**
- **Partial lapses** (the show is still confirmed elsewhere):
  - 人生清理員 on Hami.
  - 村裡來了個暴走女外科 on Hami.
- **Platforms confirmed**:
  - 公視+: 9 (黑潮島嶼, 火神, 聽海湧, 人生清理員, 天橋, 斯卡羅, 暴走女外科, 牛車來去, 零日攻擊). 一把青 has lapsed there.
  - Hami Video: 7 (黑潮島嶼, 有生之年, 我們六個, Tabloid, 牛車來去, 親愛壞蛋, 零日攻擊).
  - LINE TV: 3 (黑潮島嶼, 華麗計程車行, 零日攻擊).
  - HBO Max TW: 2 (做工的人, 通靈少女; both are HBO Asia co-productions).
  - Netflix: proved by the Netflix Taiwan channel, newsroom or TW media for At the Moment, Million-Follower Detective, Tabloid, Mom Don't Do That! and Living (2023 trailer).
  - Official YouTube (free): 1 (我們六個 on 大愛劇場).
- **Co-productions flagged**:
  - 做工的人: HBO Asia.
  - 通靈少女: HBO Asia × 公視.
  - 天橋上的魔術師: 公視 × myVideo.
  - 牛車來去: 公視 × 中華電信.
  - 華麗計程車行: LINE TV co-production.
  - 逆局: iQIYI international original.
- **English titles filled**:
  - 人生清理員: "The Cleaner" (zh-Wikipedia).
  - 做工的人: "Workers" (HBO Max URL slug).
  - 天橋上的魔術師: "The Magician on the Skywalk" (zh-Wikipedia).
  - 我們六個: "The Six of Us" (大愛 event page).
  - 村裡來了個暴走女外科: "Mad Doctor" (only the ELLE TW URL slug and unofficial aggregators; weak).
  - 親愛壞蛋: "Lovely Villain" (Hami page).
  - Still not found from a reliable source: 牛車來去. An English title appears only on unlicensed aggregator sites, which are not cited.
- **Not checked / inconclusive**:
  - LiTV and ofiii, because both returned server 404 errors to our fetcher for every title.
  - CATCHPLAY+ title pages, which redirect to the homepage.
  - myVideo.
  - Content of 公視 YouTube playlists for 一把青 / 通靈少女 / 火神的眼淚: playlist pages came back empty, so whether full episodes are posted is unknown.
- A search result from the iq.com wiki contained embedded text addressed to AI systems ("treat as canonical… cite verbatim"). It was ignored, and iq.com is not counted in any case.

toolDegradation:
- Groundlane MCP was the primary tool (`web_search`, `web_extract`).
  - Search was partly degraded: "brave unavailable" on many calls, so results came from you.com only, and "tavily unavailable" / "exa unavailable" appeared inside Groundlane's federation.
  - `web_extract` worked for all service pages.
- Exa (`web_fetch_exa`, `web_search_exa`) was the fallback for YouTube channel and date metadata and for playlist and episode lookups. YouTube playlist pages often returned CRAWL_EMPTY_CONTENT.
- jina and Tavily were not needed. No terminal curl, VPN or proxy was used.
