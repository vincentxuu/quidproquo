# Mainland Chinese dramas, batch 2: where to watch legally in Taiwan (checked 2026-11-12)

Scope: the 39 shows in `cn/tw-batch-2.tsv`. For each one, this file records the official Taiwan title, the Taiwan platform(s) with a title-page link, and the evidence. We have no Taiwan IP, and no proxy or bot-check workaround was used.

Evidence rules (same as `jp/tw-availability-1.md`, plus the rule for this round):
- **iQIYI international (iq.com, 愛奇藝台灣站) and Tencent WeTV do NOT count as legal Taiwan channels this round.** MOEA (2020) bars Taiwanese agents/distributors for Chinese OTT services, and MAC treats iQIYI as Chinese-funded. When iq.com or WeTV is the only Taiwan option, the verdict is `iq/WeTV only` and the URL is recorded as information only.
- **Netflix `netflix.com/tw/title/<id>`** links are leads, not proof (Netflix serves them by requester IP). Netflix is proved by a Netflix Taiwan YouTube upload (channel and date read through Exa) or by Taiwan media naming Netflix, with date.
- **Hami Video** pages count when they load with the show's title in `<title>`; the 下架時間 (licence end) is read from the page's hidden `endDate0` field and quoted. A Hami product URL whose `<title>` is only 「HamiVideo」 (≈99 KB shell, no 下架時間) counts as **lapsed**.
- **friDay影音** pages count when they load with the title; 「適用方案：免費」 = free ad tier, 「影劇」 = drama pack. A page titled 「資料錯誤 - friDay影音」 counts as **lapsed**.
- **LINE TV** pages count when they load with the title, show 「已完結」 and contain neither 「授權到期」 nor 「即將上線」. Calibrated on a known-lapsed page (`linetv.tw/drama/14285`, 少年歌行), which carries both 「此戲劇因授權到期，已下架」 and 「即將上線」.
- **Disney+ `/zh-tw/browse/entity-…`** pages count when fetched with the TW title and a rating.
- **myVideo** pages show 「本影片因授權因素 暫時無法提供觀看」 to our non-TW IP, so they are inconclusive and not used either way.
- **KKTV** closed at the end of 2025; no KKTV link is counted.
- **Linear TV** (中天娛樂台, 八大戲劇台, TVBS 42台 etc.) is noted but does not count.
- "Loaded on 2026-11-12" below means fetched this session with Groundlane `web_extract` (HTTP 200, title matched).

## Table

| English | 大陸原名 | 台灣官方譯名 (source) | Platform(s) + title-page URL | Evidence URL + type + date | Verdict |
|---|---|---|---|---|---|
| A Journey to Love | 长风渡 | 長風渡 (iq.com; 中天 page) | No Taiwan streaming service found. iq.com (info only): https://www.iq.com/album/%E9%95%B7%E9%A2%A8%E6%B8%A1-2023-2f3498mxvpd?lang=zh_tw. Linear: 中天娛樂台 39 https://www.ctitv.com.tw/channel39/%e9%95%b7%e9%a2%a8%e6%b8%a1 | Site-scoped searches of friDay / Hami / LINE TV / myVideo / CATCHPLAY+ / Disney+ / Netflix returned nothing for this title. 陸劇星球 2023-06-17 lists the platforms as 愛奇藝、愛奇藝國際站 only. A Japanese 2026 guide says Netflix does not carry it (in Japan). | iq/WeTV only |
| Me and my Family (Hami English title) | 180天重启计划 | 180天重啟計劃 (Hami / LINE TV) | Hami Video (some eps free): https://hamivideo.hinet.net/product/290629.do?cs=2 (下架時間 2030-02-16). LINE TV: https://www.linetv.tw/drama/17223/eps/1. myVideo 3/29862 exists (inconclusive). | Both pages loaded on 2026-11-12; Hami 「全27集(部分免費)」; LINE TV 「已完結」, no lapse notice. | confirmed (service page) |
| Fated Hearts | 一笑随歌 | 一笑隨歌 (iq.com; ELLE TW). HK title 宿敵契約. | No Taiwan streaming service found. iq.com (info only): https://www.iq.com/album/%E4%B8%80%E7%AC%91%E9%9A%A8%E6%AD%8C-2025-zw522f9eod?lang=zh_tw | ELLE TW 2025-12-17 credits stills to 「愛奇藝國際站提供」 and names no other platform. Site-scoped searches of the TW services found nothing. | iq/WeTV only |
| Three-Body | 三体 | 三體 (WeTV zh-tw) | No Taiwan streaming service found. WeTV (info only): https://wetv.vip/zh-tw/play/h31rop8wfso9jnh/n0045rmncls-%E4%B8%89%E9%AB%94_29 | GloboWatch TW: 「在台灣，《三體》可在 Tencent Video 上訂閱觀看」 (i.e. WeTV). Site-scoped searches of the TW services found only Netflix's different *3 Body Problem* (81024821). | iq/WeTV only |
| Mobius (Netflix English title) | 不眠日 | 不眠日 (friDay / LINE TV / Netflix) | friDay影音 (免費 + 影劇): https://video.friday.tw/drama/detail/4722. LINE TV: https://www.linetv.tw/drama/17991/eps/1. Netflix: https://www.netflix.com/tw/title/82096026 (lead). myVideo 3/31644 (inconclusive). | friDay and LINE TV pages loaded on 2026-11-12 (friDay 「適用方案：免費／影劇」; LINE TV 「已完結」, no lapse). Netflix: 風傳媒 2026-11-07 (https://www.storm.mg/article/11176301) lists 《不眠日》 among 2026 Netflix C-dramas. | confirmed (service page) |
| FEUD (Hami English title) | 临江仙 | 臨江仙 (Hami / LINE TV / Netflix) | Hami Video (some eps free): https://hamivideo.hinet.net/product/297602.do?cs=2 (下架時間 2029-06-30). LINE TV: https://www.linetv.tw/drama/17539/eps/1. Netflix: https://www.netflix.com/tw/title/82069056 (lead). myVideo 3/30843 (inconclusive). | Hami and LINE TV pages loaded on 2026-11-12 (Hami 「全32集(部分免費)」; LINE TV 「已完結」, no lapse). | confirmed (service page) |
| Blossom | 九重紫 | 九重紫 (Hami / LINE TV / friDay) | Hami Video: https://hamivideo.hinet.net/product/280740.do?cs=2 (下架時間 2030-06-05). LINE TV: https://www.linetv.tw/drama/16880/eps/1. friDay影音 (免費 + 影劇): https://video.friday.tw/drama/detail/4714. Netflix also (media). | All three pages loaded on 2026-11-12. Harper's Bazaar TW 「Netflix陸劇推薦5.《九重紫》」 (https://www.harpersbazaar.com/tw/culture/drama/g62576542/netflix-best-chinese-dramas/, first published 2024-10-27, updated with 2025 titles). | confirmed (service page) |
| — | 云之羽 | 雲之羽 (iq.com) | No Taiwan streaming service found. iq.com (info only): https://www.iq.com/album/%E9%9B%B2%E4%B9%8B%E7%BE%BD-2023-29gizl2g5jp?lang=zh_tw | iq.com wiki says 「線上看由iQIYI國際版APP及iQ.com播出」. Site-scoped searches of the TW services found nothing. | iq/WeTV only |
| A Lifelong Journey | 人世间 | 人世間 (CNA; iq.com) | Disney+ bought it for 大中華區 in 2022, but no current Disney+ zh-tw entity page was found by search. iq.com (info only): https://www.iq.com/wiki/zh_tw/album/%E4%BA%BA%E4%B8%96%E9%96%93-2022-13q7f4zxgi5 | CNA 2022-01-06 (https://www.cna.com.tw/news/amov/202201060241.aspx): Disney+ (Taiwan launch Nov 2021) lists 華語劇「人世間」 for 大中華區. 上報 2022-03-09 (https://www.upmedia.mg/tw/popularity/upviewpoint/139392): 「登Disney+」. No evidence after 2022. | licensed-old (Disney+ 2022; current page not found) |
| Love of the Divine Tree (Hami: "Love the Divine Tree") | 仙台有树 | 仙台有樹 (Hami) | Hami Video: https://hamivideo.hinet.net/product/325606.do?cs=2 (下架時間 2029-05-21) | The page loaded on 2026-11-12 with 「全40集」. | confirmed (service page) |
| Go Ahead | 以家人之名 | 以家人之名 (LINE TV) | LINE TV: https://www.linetv.tw/drama/20204/eps/1 (2025-11 re-upload). friDay https://video.friday.tw/drama/detail/1516 returns 「資料錯誤」 (**lapsed**). Hami https://hamivideo.hinet.net/product/128738.do?cs=2 returns the bare 「HamiVideo」 shell (**lapsed**). myVideo 3/13273 (inconclusive). | The LINE TV page loaded on 2026-11-12 with 「已完結」 and no lapse notice. | confirmed (service page) |
| You Are My Glory | 你是我的荣耀 | 你是我的榮耀 (WeTV; 八大; TVBS) | No Taiwan streaming service found. WeTV (info only): https://wetv.vip/zh-tw/play/u37kgfnfzs73kiu/f0040jef0ua-%E4%BD%A0%E6%98%AF%E6%88%91%E7%9A%84%E6%A6%AE%E8%80%80_25. Linear: 八大戲劇台 2024-05-31 to 07-04 (https://www.gtv.com.tw/Program/P2024053102/index.html); TVBS 42台 from 2026-06-05 (https://news.tvbs.com.tw/entertainment/drama/3222762). | 中時 2021-07-27: 「由WeTV獨家播出」. Site-scoped searches of the TW services found nothing. | iq/WeTV only |
| Hidden Love | 偷偷藏不住 | 偷偷藏不住 (Netflix TW media) | Netflix: https://www.netflix.com/tw/title/81705641 (indexed TW page; lead) | 風傳媒 2026-07-01 (https://www.storm.mg/lifestyle/11146091): Netflix 甜寵陸劇 TOP10 #9 《偷偷藏不住》. Also ETtoday 2023-07-03: 「Netflix台灣第一」. | confirmed (Taiwan media, 2026-07-01) |
| Love in the Clouds | 入青云 | 入青雲 (Hami) | Hami Video (some eps free): https://hamivideo.hinet.net/product/307368.do?cs=2 (下架時間 2030-10-01). Netflix 82071208 (sg-zh / global pages only; lead). | The Hami page loaded on 2026-11-12 with 「全36集」. | confirmed (service page) |
| Six Sisters (WeTV English title) | 六姊妹 | 六姊妹 (WeTV zh-tw) | No Taiwan streaming service found. WeTV (info only): https://wetv.vip/zh-tw/play/84zig4vm19i2co1/s4100k618xd-%E5%85%AD%E5%A7%8A%E5%A6%B9_01 | Site-scoped searches of the TW services found nothing. | iq/WeTV only |
| — | 反人类暴行 | 反人類暴行 (no TW source) | None found. Mainland: 優酷 + 江蘇衛視 from 2025-12-13 (CRI / 京報網). | Site-scoped searches of the TW services and of iq.com / WeTV found nothing. | not found |
| Flight to You (Hami English title) | 向风而行 | 向風而行 (LINE TV / friDay) | LINE TV: https://www.linetv.tw/drama/14795/eps/1. friDay影音 (免費 + 影劇): https://video.friday.tw/drama/detail/2760. Hami https://hamivideo.hinet.net/product/210781.do?cs=2 returns the bare shell (**lapsed**). myVideo 3/22573 (inconclusive). | LINE TV and friDay pages loaded on 2026-11-12 (LINE TV 「已完結」, no lapse). | confirmed (service page) |
| Guardians of the Dafeng | 大奉打更人 | 大奉打更人 (Hami / Disney+) | Hami Video: https://hamivideo.hinet.net/product/282506.do?cs=2 (下架時間 2030-12-29). Disney+: https://www.disneyplus.com/zh-tw/browse/entity-4719e5ff-e420-4173-aaa9-e5da0db283ca. The spin-off film 大奉打更人之世間無我這般人 is also on LINE TV (17787), Hami (297331) and friDay (movie 121739). | The Hami page loaded on 2026-11-12 (「全40集」). The Disney+ page loaded as 「觀看大奉打更人 \| Disney+」, rated 12+. | confirmed (service page) |
| Legend of the Magnate (Hami English title) | 大生意人 | 大生意人 (Hami / LINE TV / myVideo) | Hami Video: https://hamivideo.hinet.net/product/310725.do?cs=2 (下架時間 2031-11-24). LINE TV: https://www.linetv.tw/drama/20124/eps/1. myVideo 3/32240 (inconclusive; the myVideo blog says it premiered there 2025-11-23). Netflix: https://www.netflix.com/tw/title/82687282 (lead). | Hami and LINE TV pages loaded on 2026-11-12 (Hami 「全40集(部分免費)」; LINE TV 「已完結」, no lapse). | confirmed (service page) |
| Where the Mask Ends | 嫁金钗 | **嫁金釵** (Netflix Taiwan YT). The 「inferred」 tag can be dropped. | Netflix: https://www.netflix.com/tw/title/83150089 (indexed TW page titled 嫁金釵; lead). The trailer description links https://www.netflix.com/title/83150097. The two IDs differ and neither was checked. | https://www.youtube.com/watch?v=QpZgmqLe4zM 「《嫁金釵》 \| 正式預告 \| Netflix」, Netflix Taiwan, 2026-10-12 (Exa fetch shows the author as Netflix Taiwan; ChartsList gives the date). Also 風傳媒 2026-11-07 (TOP1 of 2026 Netflix C-dramas). | confirmed (official channel) |
| The Blood of Youth | 少年歌行 | 少年歌行 (Hami) | Hami Video (some eps free): https://hamivideo.hinet.net/product/216420.do?cs=2 (下架時間 2027-03-09). LINE TV https://www.linetv.tw/drama/14285/eps/1 says 「授權到期，已下架」 (**lapsed**). The friDay page 4667 is the different show 少年歌行之風花雪月. | The Hami page loaded on 2026-11-12 with 「全40集(部分免費)」. | confirmed (service page) |
| — | 归队 | 歸隊 (WeTV zh-tw) | No Taiwan streaming service found. WeTV (info only): https://wetv.vip/zh-tw/play/nbefdhi0nc563ar/k4101zsli5n-%E6%AD%B8%E9%9A%8A_01 | Site-scoped searches of the TW services found nothing. Mainland: CCTV-8 + 騰訊視頻 from 2025-08-25 (NRTA). | iq/WeTV only |
| When I Fly Towards You | 当我飞奔向你 | 當我飛奔向你 (Netflix TW media) | Netflix: https://www.netflix.com/tw/title/81712983 (indexed TW page; lead) | 風傳媒 2026-07-01 (https://www.storm.mg/lifestyle/11146091): Netflix 甜寵陸劇 #1 《當我飛奔向你》. Also Beauty321 2026-09-01 (https://www.beauty321.com/post/73151). | confirmed (Taiwan media, 2026-09-01) |
| To the Wonder | 我的阿勒泰 | 我的阿勒泰 (Hami) | Hami Video (some eps free): https://hamivideo.hinet.net/product/282840.do?cs=2 (**下架時間 2026-12-01**, under three weeks away) | The page loaded on 2026-11-12 with 「全8集(部分免費)」. | confirmed (service page; licence ends 2026-12-01) |
| Endless Protection (HK myTV SUPER slug) | 无尽的尽头 | 無盡的盡頭 (no TW source) | None found. iq.com has only clip uploads (e.g. a 2026 金鵝 red-carpet clip), not the series. | Site-scoped searches of the TW services found nothing. Mainland: 優酷 / 江蘇 / 浙江衛視; HK: myTV SUPER. | not found |
| The Demon Hunter's Romance (iQilin) | 无忧渡 | 無憂渡 (iq.com) | No Taiwan streaming service found. iq.com (info only): https://www.iq.com/album/%E7%84%A1%E6%86%82%E6%B8%A1-2025-1iz9b48cu5d?lang=zh_tw (「自製」 = iQIYI original) | Site-scoped searches of the TW services and Netflix found nothing. | iq/WeTV only |
| Love Like the Galaxy | 星汉灿烂 | **星漢燦爛．月升滄海** (Hami: 上部 / 下部; Netflix 「星漢燦爛·月升滄海」) | Hami Video, in two parts: 上部 https://hamivideo.hinet.net/product/213003.do?cs=2 (全27集) and 下部 https://hamivideo.hinet.net/product/213819.do?cs=2 (全29集), both 下架時間 2027-10-18. Netflix: https://www.netflix.com/tw/title/81633699 (lead). | Both Hami pages loaded on 2026-11-12. Harper's Bazaar TW (as above, 2025 update): 「Netflix陸劇推薦6.《星漢燦爛·月升滄海》」. | confirmed (service page) |
| Blood River | 暗河传 | 暗河傳 (Hami) | Hami Video (some eps free): https://hamivideo.hinet.net/product/310402.do?cs=2 (下架時間 2029-11-30) | The page loaded on 2026-11-12 with 「全38集(部分免費)」. | confirmed (service page) |
| — | 棋士 | 棋士 (WeTV zh-tw) | No Taiwan streaming service found. WeTV (info only): https://wetv.vip/zh-tw/play/4njglhnnknbg4tp/b410081j0kx-%E6%A3%8B%E5%A3%AB_01 | TVBS 女人我最大 2025-06-03 lists the platform as 騰訊影片 only. Site-scoped searches of the TW services found nothing. | iq/WeTV only |
| — | 沉默的荣耀 | 沉默的榮耀 (no TW platform) | None found. iq.com has only a three-clip page (https://www.iq.com/play/%E6%B2%89%E9%BB%98%E7%9A%84%E6%A6%AE%E8%80%80-w3afcccma0?lang=zh_tw), not the series. | Mainland: CCTV-8 + 愛奇藝 + 咪咕 from 2025-09-30. It is a 國台辦-guided espionage drama set in Taiwan (聯合早報 2025-10-06), so no Taiwan licence would be expected. | not found |
| Sniper Butterfly | 狙击蝴蝶 | 狙擊蝴蝶 (Hami) | Hami Video (some eps free): https://hamivideo.hinet.net/product/318872.do?cs=2 (下架時間 2031-03-01). Netflix 82055551 (hk / mo pages only; lead). | The Hami page loaded on 2026-11-12 with 「全30集(部分免費)」. 風傳媒 2026-07-01 lists it as a Netflix 甜寵陸劇 (#8). | confirmed (service page) |
| Nirvana in Fire | 琅琊榜 | 琅琊榜 (Hami) | Hami Video (some eps free): https://hamivideo.hinet.net/product/303491.do?cs=2 (下架時間 2028-09-04). LINE TV https://www.linetv.tw/drama/3771/eps/1 says 「授權到期」 (**lapsed**). friDay https://video.friday.tw/drama/detail/36 returns 「資料錯誤」 (**lapsed**). myVideo 3/20952 (inconclusive). | The Hami page loaded on 2026-11-12 with 「全54集(部分免費)」. | confirmed (service page) |
| Day and Night | 白夜追凶 | 白夜追兇 (zh-Wikipedia TW; Netflix used 白夜追凶) | None current. Netflix (global licence from 2018) was removed on 2021-03-22 per zh-Wikipedia; only HK and SG Netflix pages are indexed (80222788). Hami and myVideo searches return no title page. | UpToGo 2026-02-07: 「目前在台灣 Netflix 搜尋可能會顯示『無法觀賞』」, and it points to YOUKU's own YouTube channel (the rights holder, not a TW platform; not verified here). | lapsed |
| — | 老舅 | 老舅 (Hami / LINE TV) | Hami Video: https://hamivideo.hinet.net/product/324870.do?cs=2 (下架時間 2030-12-14). LINE TV (some eps free, rest VIP): https://www.linetv.tw/drama/20852/eps/1. myVideo 0/429459 (inconclusive). | Both pages loaded on 2026-11-12 (Hami 「全27集(部分免費)」; LINE TV 「部分免費」 with VIP episode badges, no lapse). | confirmed (service page) |
| Legend of the Female General | 锦月如歌 | 錦月如歌 (Hami / Netflix) | Hami Video (some eps free): https://hamivideo.hinet.net/product/302738.do?cs=2 (下架時間 2030-08-28). Netflix: https://www.netflix.com/tw/title/82116162 (lead). | The Hami page loaded on 2026-11-12 with 「全36集」. ELLE TW 2025-03-10 (https://www.elle.com/tw/entertainment/drama/g64117171/chinesedrama-netflix/): 「Netflix陸劇推薦：《錦月如歌》」. | confirmed (service page) |
| The Vendetta of An | 长安二十四计 | 長安二十四計 (Netflix / 風傳媒) | Netflix: https://www.netflix.com/tw/title/82648017 (lead) | 風傳媒 2025-12-16 (https://www.storm.mg/lifestyle/11088323): 「在台灣收視Netflix排行榜上躋身第4名」, 「影集已於Netflix上線」. | confirmed (Taiwan media, 2025-12-16) |
| The Bad Kids | 隐秘的角落 | 隱秘的角落 (iq.com) | No Taiwan streaming service found. iq.com (info only): https://www.iq.com/wiki/zh_tw/album/%E9%9A%B1%E7%A7%98%E7%9A%84%E8%A7%92%E8%90%BD-2020-2ffkws2rye1 | Site-scoped searches of the TW services and Netflix found no title page (Hami and myVideo search URLs only). | iq/WeTV only |
| The Glory (Hami English title) | 雁回时 | 雁回時 (Hami / Netflix) | Hami Video (some eps free): https://hamivideo.hinet.net/product/290380.do?cs=2 (下架時間 2030-04-14). Netflix: https://www.netflix.com/tw/title/82036449 (lead). | The Hami page loaded on 2026-11-12 with 「全30集(部分免費)」. Harper's Bazaar TW (2025 update): 「Netflix陸劇推薦14.《雁回時》」. | confirmed (service page) |
| Wild Bloom | 风吹半夏 | 風吹半夏 (zh-Wikipedia; 中天) | No Taiwan streaming service found. zh-Wikipedia lists 「IQIYI（愛奇藝）全球」, but iq.com search turned up only clip uploads, no full-series page. Linear: 中天娛樂台 2024-04-02 to 05-03 (zh-Wikipedia). A Disney+ search found nothing. | Site-scoped searches of the TW services found nothing. | not found |

## Notes

- **Counts (39 shows)**:
  - **Confirmed: 23.**
    - Service page: 19 (180天重啟計劃, 不眠日, 臨江仙, 九重紫, 仙台有樹, 以家人之名, 入青雲, 向風而行, 大奉打更人, 大生意人, 少年歌行, 我的阿勒泰, 星漢燦爛, 暗河傳, 狙擊蝴蝶, 琅琊榜, 老舅, 錦月如歌, 雁回時).
    - Official channel: 1 (嫁金釵, Netflix Taiwan YT 2026-10-12).
    - Taiwan media: 3 (偷偷藏不住 2026-07, 當我飛奔向你 2026-09, 長安二十四計 2025-12).
  - **Licensed-old: 1.** 人世間 (Disney+ 2022; no current page found).
  - **Lapsed: 1.** 白夜追兇 (Netflix removed it 2021-03-22; nothing current).
  - **iq/WeTV only: 10.**
    - iq.com: 長風渡, 一笑隨歌, 雲之羽, 無憂渡, 隱秘的角落.
    - WeTV: 三體, 你是我的榮耀, 六姊妹, 歸隊, 棋士.
  - **Not found: 4.** 反人類暴行, 無盡的盡頭, 沉默的榮耀, 風吹半夏 (風吹半夏 had only a 2024 中天 linear run and iq.com clips).
  - Check: 19 + 1 + 3 = 23 confirmed; 23 + 1 + 1 + 10 + 4 = 39.
- **Partial lapses** (the show is still confirmed elsewhere):
  - 以家人之名 on friDay and Hami.
  - 向風而行 on Hami.
  - 少年歌行 and 琅琊榜 on LINE TV.
  - 琅琊榜 on friDay.
  - **我的阿勒泰's Hami licence ends 2026-12-01**, so it should be rechecked before publishing.
- **Platforms confirmed**:
  - Hami Video: 18.
  - LINE TV: 9.
  - friDay影音: 3 (不眠日, 九重紫, 向風而行).
  - Disney+: 1 (大奉打更人).
  - Netflix by channel or media: 10 (不眠日, 九重紫, 偷偷藏不住, 嫁金釵, 當我飛奔向你, 星漢燦爛, 狙擊蝴蝶, 錦月如歌, 長安二十四計, 雁回時).
  - Netflix TW pages that are leads only: 臨江仙, 入青雲, 大生意人.
- **Linear TV seen** (does not count): 長風渡 (中天娛樂台), 你是我的榮耀 (八大戲劇台 2024; TVBS 42台 from 2026-06-05), 風吹半夏 (中天娛樂台 2024).
- **zh_hint corrections**:
  - 星漢燦爛 → 星漢燦爛．月升滄海 (Hami splits it into 上部 / 下部; Netflix uses 星漢燦爛·月升滄海).
  - 嫁金釵: confirmed by Netflix Taiwan, so the 「(inferred)」 tag can be dropped.
  - The other titles match the hint. Blank hints were filled from the platforms: 雲之羽, 向風而行, 無憂渡, 暗河傳, 錦月如歌, 長安二十四計.
- **English titles filled**:
  - 180天重啟計劃 "Me and my Family" (Hami).
  - 不眠日 "Mobius" (Netflix).
  - 臨江仙 "FEUD" (Hami).
  - 六姊妹 "Six Sisters" (WeTV en).
  - 向風而行 "Flight to You" (Hami).
  - 大生意人 "Legend of the Magnate" (Hami).
  - 無盡的盡頭 "Endless Protection" (myTV SUPER slug / YouTube; not a TW source).
  - 無憂渡 "The Demon Hunter's Romance" (iQilin).
  - 雁回時 "The Glory" (Hami).
  - 仙台有樹: Hami says "Love the Divine Tree"; the TSV says "Love of the Divine Tree".
  - Still blank: 雲之羽 (no fetched source gave an English title), 反人類暴行, 歸隊, 棋士, 沉默的榮耀, 老舅.

toolDegradation:
- Groundlane MCP was the primary tool for site-scoped search and for `web_extract` on every service page.
  - Search degraded during the run: brave was intermittently "unavailable", the "you" provider hit "budget exhausted", and parallel / serpapi / tavily / exa failed at times inside Groundlane's federated search. Results came back through the remaining providers (brave, you, serpapi, keenable, browserbase).
  - Site search pages (friDay, LINE TV, Hami) render client-side and returned no results, so title pages were found through web search instead.
- Exa (`web_search_exa`, `web_fetch_exa`) was the fallback for Taiwan media, Wikipedia platform tables and the YouTube channel/date (嫁金釵 trailer).
- jina and Tavily were not needed. Firecrawl was not used. No terminal curl, VPN or proxy was used.
