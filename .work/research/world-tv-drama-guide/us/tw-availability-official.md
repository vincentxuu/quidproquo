# Taiwan availability: official-source check (as of 2026-11-05)

Scope: confirm each show is legally on the named service in Taiwan, using evidence that does not need a Taiwan IP. No region proxy or bot-check workaround was used.

How the evidence was checked:
- **YouTube**: watch pages were opened with Groundlane `web_extract`. Title came from `meta[name=title]`, channel from `link[itemprop=name]` and the date from `meta[itemprop=datePublished]`. For ST S5 the channel was also checked by YouTube oEmbed (`author_url` = `@NetflixTaiwan`).
- **Disney+ `/zh-tw/browse/entity-…` pages**: these are Disney+'s own Taiwan-locale catalog pages. The `/zh-tw` home page is titled 「…- Disney+ 台灣」, and the title pages show Taiwan-style ratings (12+/15+/18+, not US TV-MA). They were fetched from a non-TW IP, so read them as the service's own TW catalog page, not a log-in test.
- **Netflix `netflix.com/tw/title/…` pages are NOT used as proof.** Netflix serves those pages by the requester's IP: they came back with TRY/EUR/MXN pricing, and direct fetches were refused (403, or over the size limit).
- **Prime Video `primevideo.com/-/zh_TW/detail/…` pages are language-only, not Taiwan-only.** The fetched page showed US TV-MA and "Amazon.com Services LLC", so it does not prove Taiwan availability.
- **Channel note**: "Netflix Malaysia" (handle `@netflixasia`) is Netflix's Traditional-Chinese Asia channel. Its descriptions say 「追蹤 Netflix Taiwan」 and link to @netflixtw. It is official, but it is not the Taiwan-only channel. Where a Netflix Taiwan copy exists, it is cited instead.

## Table

| Show | Service | Official TW title | Evidence URL | Evidence type | Date | Verdict |
|---|---|---|---|---|---|---|
| Stranger Things | Netflix | 怪奇物語 | https://www.youtube.com/watch?v=ujlX97l6xD4 (「《怪奇物語》第 5 季 \| 正式預告 \| Netflix」, Netflix Taiwan; release times given as 「台港時間」) | official channel | 2025-10-30 | confirmed |
| 3 Body Problem | Netflix | 3 體 (official styling has a space; 3體 is also used) | https://www.youtube.com/watch?v=La2IuuiPPAM (「《3 體》\| 最終預告 \| Netflix」, Netflix Taiwan) | official channel | 2024-03-07 | confirmed (Netflix original) |
| The Queen's Gambit | Netflix | 后翼棄兵 | https://www.youtube.com/watch?v=G1yq4IvCfa8 (「《后翼棄兵》\| 上線日期預告 \| Netflix」, Netflix Malaysia/@netflixasia zh-Hant channel, says 「Netflix 獨家」) | official channel (Asia zh channel, not TW-only) | 2020-08-27 | confirmed (Netflix-produced original; the evidence is old, but lapse risk is low) |
| Sirens | Netflix | 妖惑心計 | https://tw.news.yahoo.com/【5月美劇推薦top-10】netflix《愛-x-死-x-機器人》第四季、max《慾望城市：華麗下半場》第三季、disney瑞絲薇斯朋《星星之火》攻佔片單！-092300512.html (Yahoo 奇摩電影戲劇 says 線上看平台：Netflix, with 「Netflix提供」 stills) | news (TW) | 2025-05 | confirmed. The TW title appears only in TW news and blogs; no Netflix Taiwan YouTube upload was found. |
| American Primeval | Netflix | 馴荒記 | https://www.youtube.com/watch?v=KkQPuUqozBk (「《馴荒記》 \| 正式預告 \| Netflix」, Netflix Taiwan, 「1 月 9 日上線，Netflix 獨家」) | official channel | 2024-12-05 | confirmed |
| Orange Is the New Black | Netflix | 勁爆女子監獄 | https://www.youtube.com/watch?v=lGzsqumTA2M (「《勁爆女子監獄》\| 第 7 季正式預告 \| Netflix」, Netflix Malaysia/@netflixasia) | official channel (Asia zh channel) | 2019-06-26 | likely. Branded a Netflix original but produced by Lionsgate. The newest official evidence is more than 6 years old, and no current TW source was found. |
| Alien: Earth | Disney+ | 異形：地球 | https://www.youtube.com/watch?v=VUxWYZQihVI (「原創影集《異形：地球》\| EP8 預告 \| Disney+ 獨家熱播中」, Disney Plus TW) | official channel | 2025-09-19 | confirmed |
| The Walking Dead: The Ones Who Live | Disney+ | 陰屍路：生存者 | https://www.disneyplus.com/zh-tw/browse/entity-8468b2fd-8a22-4bf7-8810-040894061359 (Disney+ TW page, 18+) and the Yahoo TW Jan-2025 list (https://tw.news.yahoo.com/netflix黑馬劇《暗夜情報員2》、《愛你的凱蒂2》回歸、disney《陰屍路：生存者》與《人生切割術2》新年強檔來襲--2025年1月美劇推薦片單-031540592.html: 「終於要在台灣上架」, Disney+, 2025-01-08) | official service page + news | page live 2026-11-05; news 2025-01 | confirmed. It is an AMC licensed title, and the news is more than a year old. The TW Disney+ page still resolves, but licensed titles can lapse. The only trailer found was on Disney Plus HK, not the TW channel. |
| The Bear | Disney+ | 大熊餐廳 | https://www.youtube.com/watch?v=LLOdisyTpdY (「零負評話題美劇《大熊餐廳》\| 家庭篇預告 \| 第4季大結局 Disney+ 獨家熱播中」, Disney Plus TW) | official channel | 2025-06-26 | confirmed |
| This Is Us | Disney+ | 這就是我們 | https://www.disneyplus.com/zh-tw/browse/entity-9dc170da-85db-475d-9df4-6572f15ffb00 (「觀看這就是我們 \| Disney+」, 6 季, 12+) | official service page | page live 2026-11-05 | confirmed (20th Television, a Disney-owned studio) |
| Pose | Disney+ | 艷放80 | https://www.disneyplus.com/zh-tw/browse/entity-6bf318d8-f506-4e7f-a58f-0c5cc09b6c90 (「觀看艷放80 \| Disney+」, 3 季, 18+) | official service page | page live 2026-11-05 | confirmed (FX). A 2021 vocus post said Netflix TW then; that is outdated. |
| Dying for Sex | Disney+ | 死前慾望清單 | https://www.disneyplus.com/zh-tw/browse/entity-423f6320-b55b-453b-a85f-dea05bd495d9 (「觀看死前慾望清單 \| Disney+」, 「FX影集《死前慾望清單》」, 18+) | official service page | page live 2026-11-05 | confirmed. Disney+ HK uses the same title. No Disney Plus TW YouTube upload was found. |
| Andor | Disney+ | 安道爾 | https://www.disneyplus.com/zh-tw/browse/entity-faba988a-a9f5-45f2-a074-0775a7d6f67a (「觀看安道爾 \| Disney+」, 2022–2025, 12+) | official service page | page live 2026-11-05 | confirmed. The Disney Plus TW YouTube uploads AuKcpddk9Oc and BDxDR5NQXiA are indexed (2025-03-25 / 2025-04-24) but now return no metadata, so they are probably removed. |
| The Mandalorian | Disney+ | 曼達洛人 | https://www.youtube.com/watch?v=6yWnxMyZbIM (「星際大戰 《曼達洛人》 第 3 季 \| 正式預告 \| 3月1日 Disney+ 精彩上線」, Disney Plus TW) and https://www.disneyplus.com/zh-tw/browse/entity-422f6dcc-226f-44e7-98d4-22de69b31cf3 | official channel + official service page | 2023-01-16 (video) | confirmed. Also: Disney Plus TW posted 「《#曼達洛人與古古》上線預告 \| Disney+ 9月2日」 on 2026-09-01 (https://www.youtube.com/watch?v=4K1QPtOp3ck). That is the film, not the series. |
| Shōgun | Disney+ | 幕府將軍 | https://www.youtube.com/watch?v=8LSUDXyUu9Y (「FX年度鉅作《幕府將軍》\| 背棄篇 \| 2月27日 Disney+ 精彩上線」, Disney Plus TW) and https://www.disneyplus.com/zh-tw/browse/entity-5422a5f9-e4f1-475e-9217-65e8249388d0 | official channel + official service page | 2024-01-24 | confirmed |
| Dopesick | Disney+ | 毒疫 | https://www.disneyplus.com/zh-tw/browse/entity-227de06a-d3d4-42e0-9df1-bb5495e1738d (「觀看毒疫 \| Disney+」, 2021, 15+) | official service page | page live 2026-11-05 | confirmed (Hulu, Disney-owned). There is also a Disney+ TW Facebook post, 「影集《#毒疫》Disney+現正熱播中」 (2021), seen in search only. |
| Paradise | Disney+ | 極樂凶間 | https://www.youtube.com/watch?v=j3zAh5zh3VU (「《極樂凶間》 第二季 \| 前導預告 \| Disney+ 即將上線」, Disney Plus TW) | official channel | 2025-12-10 | confirmed. An earlier Disney+ TW FB post spelled it 極樂兇間; the current official spelling is 極樂凶間. |
| Fallout | Prime Video | 異塵餘生 | https://tw.news.yahoo.com/超好評《異塵餘生》真人影集第二季正式預告來了！上線日曝光重返新維加斯-034654755.html (Yahoo TW: S2 「12 月 17 日在 Prime Video 上開播」) | news (TW) | 2025-11-14 | confirmed (Amazon Original). No Prime Video Taiwan-specific official post was found. |
| The Boys | Prime Video | 黑袍糾察隊 | https://www.ptt.cc/bbs/EAseries/M.1772731700.A.2B7.html (PTT EAseries: S5 「4月8日上線Prime Video」, poster IP 臺灣) | TW forum (no official TW channel or news found) | 2026-03-06 | likely. It is an Amazon Original, and the TW title is 黑袍糾察隊 (zh-Hant Wikipedia, and the Prime zh_TW page title). The Prime zh_TW page is not Taiwan-specific; see the notes at the top. |
| Landman, CATCHPLAY+ | CATCHPLAY+ | 石油天王 | https://www.catchplay.com/tw/ed-says/article-4919-vix1y5uu (CATCHPLAY+ 編看編談: S1 on 11/1, S2 weekly from 11/17 「與美同步跟播」). Also https://stars.udn.com/star/story/10091/9111275 (聯合報, 2025-11-01), the CATCHPLAY+ Taiwan Instagram/FB post from 2025-11-17 (「第一季全季上架，第二季每週一與美同步跟播！全台只在 CATCHPLAY+」, seen via search) and https://today.line.me/tw/v3/article/oq7MPmp (鏡報, 2025-11-01, 「CATCHPLAY+ 獨家上架」) | official press + news | 2025-11-01 / 2025-11-17 | confirmed, both seasons. The 「全台只在」 exclusivity was true in Nov 2025 and is no longer true (see the Netflix row). |
| Landman, Netflix | Netflix | 石油天王 | JustWatch TW (https://www.justwatch.com/tw/節目/landman, checked 2026-11-05): Netflix "1 季". A Netflix TW title URL is indexed (netflix.com/tw/title/81946384, 「Watch 石油天王」) but was not fetchable. A TW creator reel dated 2026-03-29 (https://www.instagram.com/reel/DWd8Aofj7Va) says 「完整兩季在 @catchplayplus_tw ，Netflix只有第一季！」 | JustWatch + social (no official Netflix TW post) | 2026-03-29 / 2026-11-05 | likely, S1 only |
| Landman, Prime Video | Prime Video | (石油天王) | JustWatch TW only (Prime Video "2 季", checked 2026-11-05). primevideo.com's Landman pages are tagged 「More from Paramount+」, a US Paramount+ channel, not TW evidence. | JustWatch only | 2026-11-05 | unconfirmed. It may be a buy/rent or channel listing; check from a TW device. |

## Landman: current Taiwan status

- **CATCHPLAY+ is confirmed and is the primary home.** S1 went up whole on 2025-11-01. S2 followed the US weekly from 2025-11-17, so both seasons are there. Its own press and posts said 「全台只在CATCHPLAY+」 in Nov 2025.
- **Netflix is likely, S1 only.** That is the 2026 picture: JustWatch shows Netflix with 1 season, and a TW creator reel says Netflix has only S1. So the Nov-2025 exclusivity no longer holds for S1.
- **Prime Video is unconfirmed.** It appears only in JustWatch, and no official or news source backs it.
- **Recommended article wording**: 「CATCHPLAY+（兩季）；Netflix 亦可看第一季」. Leave Prime Video out unless someone checks it on a TW device.

## Counts

The table has 22 rows: 20 shows, with Landman split into 3 rows, one per service.
- Confirmed: 18 rows. These are 5 on Netflix, all 11 on Disney+, Fallout on Prime Video, and Landman on CATCHPLAY+. By show, that is 18 of the 20 confirmed.
- Likely: 3 rows. They are Orange Is the New Black (Netflix), The Boys (Prime Video) and Landman on Netflix (S1).
- Unconfirmed: 1 row, Landman on Prime Video.

## Tool degradation log

- Tavily search: some calls returned 429 (rate limited), so Groundlane `web_search` (Tavily and Brave backends) was used instead.
- Jina: no API key configured.
- Exa (through Groundlane): reported unavailable.
- Direct `curl` from the container to netflix.com and youtube.com watch pages failed: the proxy refused the CONNECT tunnel (403), and the YouTube request was redirected to a google.com/sorry bot page. Groundlane `web_extract` was used for YouTube instead. YouTube oEmbed worked through `curl`.
- netflix.com title pages were not fetched: they exceed Groundlane's output limit, and Netflix geo-serves them by requester IP, so they would not prove Taiwan availability anyway.
- catchplay.com/tw/video/… redirects to catchplay.com from a non-TW IP, so the title page could not be read. The ed-says article was seen through search content.
- Firecrawl was not used (out of credits).
