# Japanese dramas, batch 2: where to watch legally in Taiwan (checked 2026-11-09)

Scope: the 33 shows in `jp/tw-batch-2.tsv`. For each one, this file records the official Taiwan title, the Taiwan platform(s) with a title-page link, and the evidence. We have no Taiwan IP, and no proxy or bot-check workaround was used.

Evidence rules (same as `kr/tw-availability-1.md`, plus the Japanese-drama notes below):
- **YouTube**: watch pages returned a stripped page to Groundlane this session, so the title and channel came from YouTube's own oEmbed endpoint (`youtube.com/oembed?url=…`, fields `title` and `author_name`), and the date came from the search-result `publishedAt`. "Netflix Taiwan" (`@NetflixTaiwan`) is the Taiwan channel.
- **Netflix `netflix.com/tw/title/<id>`** links are given so readers can click through. They are **not** proof, because Netflix serves those pages by requester IP. IDs came from search-result URLs. Netflix title IDs are global.
- **friDay影音** title pages count when they load with the show (HTTP 200). 「適用方案：免費／影劇」 means the free ad-supported tier plus the paid 影劇 pack. A page that returns HTTP 400 (「資料錯誤」) counts as **lapsed**.
- **Hami Video** product pages count when they load with the show's title. A lapsed product returns HTTP 404 with the bare title "HamiVideo".
- **myVideo** pages: the page HTML carries `class="videoAreaBox expired"` when a title is off-shelf (the template comment says so: 「此處加上"expired"為已下架」). Without `expired`, it is live.
- **LINE TV** (KKTV closed on 2026-01-01 and moved its catalogue to LINE TV): the 「授權到期」 notice is drawn client-side, so it cannot be read from the server HTML. I used two server-side signals instead, each checked against controls that are known to be lapsed (`/drama/14287` 代理公司 and `/drama/10837` 花牌情緣 第三季):
  - A **live** page lists episodes with 「VIP」 badges and shows 「已完結 / 共 N 集」.
  - A **lapsed** page has no episode badges and shows 「即將上線」.
  - LINE TV's own migration list, 「KKTV 1/1 關站後移轉 LINE TV 之作品清單」 (help.linetv.tw, updated 2026-01-22), is cited where it names the show.
- **愛奇藝 (iq.com `?lang=zh_tw`)** album pages count if they load with the show.
- **Nahoko** (nahoko.si) reads JustWatch and TMDB data and shows it per country (`?country=tw`; the page says 「可觀看平台：JustWatch · TMDB · 查询于2026年11月9日」). It is used as the JustWatch Taiwan lead, because JustWatch TW itself returned 404 or JS-only pages. A Nahoko listing on its own makes a show **licensed-old** at best.
- **Linear TV** (緯來日本台, Videoland, NHK channels on cable) is noted but does not count as streaming.
- **Taiwan media** means a Taiwan outlet that names the Taiwan platform, with its date.

Verdicts:
- **confirmed**: official channel, service page or Taiwan media, with a date.
- **licensed-old**: evidence from 2023 or earlier, or a JustWatch-derived lead only.
- **lapsed**: the Taiwan service page shows the licence has ended.
- **not found**: no current Taiwan streaming page or report.

## Table

| English | 日文 | 台灣官方譯名 (source) | Platform(s) + title-page URL | Evidence URL + type + date | Verdict |
|---|---|---|---|---|---|
| — (*Saigo kara Nibanme no Koi* 3) | 続・続・最後から二番目の恋 | 再續．倒數第二次戀愛 (friDay page; full-width 「．」, not 「・」) | friDay影音 (free with ads, or the 影劇 pack): https://video.friday.tw/drama/detail/4081 | The friDay page loaded on 2026-11-09 with 「適用方案：免費／影劇」, 「全11集」. zh-Wikipedia: 「台灣由friDay影音於2025年4月15日起跟播」. | confirmed (service page) |
| — (NHK English: not verified) | 虎に翼 | 如虎添翼 (zh-Wikipedia, citing the 緯來日本台 broadcast). The batch hint was empty. | **Linear only**: 緯來日本台 from 2024-11-11 (Mon–Fri 21:00). This is not streaming. | https://zh.wikipedia.org/zh-tw/%E5%A6%82%E8%99%8E%E6%B7%BB%E7%BF%BC (「台灣由緯來日本台於2024年11月11日起…播出」). Searches on friDay, Hami, LINE TV, myVideo and 公視+ found no streaming page. | not found (linear TV only) |
| The 13 Lords of the Shogun | 鎌倉殿の13人 | 鎌倉殿的13人 (KKTV, Hami, 公視+ titles) | None live. Hami https://hamivideo.hinet.net/product/175750.do?cs=2 returns the 404 shell. KKTV https://www.kktv.me/titles/01000517 says 「授權已到期」. 公視+ 台語版 https://www.ptsplus.tv/zh/programs/fd96d6a4-cb8c-4b9f-9572-0798e25dba3f shows 「本節目已過授權期限，無法播放」 in search. | 劇夠 (公視+), 2022-09-02, https://dramago.ptsplus.tv/articles/7480/ (the 2022 KKTV simulcast and 公視+ 台語版). The show is not on LINE TV's KKTV migration list. | lapsed |
| Asura | 阿修羅のごとく | 宛如阿修羅 (Netflix; TW media) | Netflix (original): https://www.netflix.com/tw/title/81759233 | ELLE Taiwan, 2025-01-08, https://www.elle.com/tw/entertainment/drama/g63354828/asura-2025-netflix/ (「Netflix《宛如阿修羅》」). Beauty321, 2025-05-07, https://www.beauty321.com/post/67519 (Netflix 日劇 list, #2). | confirmed (Taiwan media, 2025) |
| 119 Emergency Call (Hami English title) | 119エマージェンシーコール | 119緊急呼叫 | friDay影音 (free or 影劇): https://video.friday.tw/drama/detail/3893. Hami Video: https://hamivideo.hinet.net/product/283797.do?cs=2. Also the 2026 special 「119緊急呼叫－2026橫濱大停電－」 on Hami: https://hamivideo.hinet.net/product/314648.do?cs=2 (全2集). | Both title pages loaded on 2026-11-09. friDay shows 「適用方案：免費／影劇」, 「全11集」. LINE TV's KKTV migration list (2026-01-22) also names 119緊急呼叫; no LINE TV page was checked. | confirmed (service page) |
| 99.9 Criminal Lawyer | 99.9-刑事専門弁護士- | 99.9 刑事專門律師 (Netflix Taiwan YT). The batch hint was empty. | Netflix: https://www.netflix.com/tw/title/82072564 | https://www.youtube.com/watch?v=vcz8ifjr1OE 「《99.9 刑事專門律師》｜精選片段｜Netflix」, Netflix Taiwan, 2025-08-13. Also Beauty321, 2026-08-14, https://www.beauty321.com/post/73029 (Netflix 日劇 list, #7). | confirmed (official channel) |
| Eye Love You | Eye Love You | Eye Love You | LINE TV (VIP): https://www.linetv.tw/drama/21226/eps/1 (「已完結 / 共 10 集」, VIP badges). Netflix: https://www.netflix.com/tw/title/81747048. friDay (https://video.friday.tw/drama/detail/3268) now returns HTTP 400, so it has lapsed there. | The LINE TV page was live on 2026-11-09, and LINE TV's KKTV migration list (2026-01-22) names it. Beauty321, 2025-05-07, https://www.beauty321.com/post/67519 (Netflix list, #5). Nahoko TW lists LINE TV and Netflix. | confirmed (service page) |
| — | GO HOME〜警視庁身元不明人相談室〜 | GO HOME～警視廳身分不明者諮詢室～ (LINE TV). Hami writes 「GO HOME–警視廳身分不明者諮詢室–」. | Hami Video (some episodes free): https://hamivideo.hinet.net/product/268346.do?cs=2. LINE TV (VIP): https://www.linetv.tw/drama/22252/eps/1 (「已完結 / 共 10 集」). | Both pages loaded on 2026-11-09 with the title. | confirmed (service page) |
| dele | dele | dele 刪除人生 (KKTV and myVideo). Netflix uses 「Dele」. | None live. myVideo https://www.myvideo.net.tw/details/3/28067 has `videoAreaBox expired` (「本影片因授權因素暫時無法提供觀看」). KKTV https://www.kktv.me/titles/01000269 says 「授權已到期」. A Netflix TW title page, https://www.netflix.com/tw/title/81154006, is indexed (lead only). | Nahoko TW (JustWatch data, 2026-11-09), https://nahoko.si/zh/tv/dele-2018?country=tw: 「目前没有在此平台播出」. | lapsed |
| Your Turn to Kill (zh-Wikipedia) | あなたの番です | 輪到你了 (Netflix; TW media). The batch hint was empty. | Netflix: https://www.netflix.com/tw/title/81506809 (the ID comes from the indexed HK page). KKTV https://www.kktv.me/titles/01000311 says 「授權已到期」. | Beauty321, 2026-08-14, https://www.beauty321.com/post/73029 (「一追上癮Netflix日劇推薦9：…《輪到你了》」). PTT Japandrama, 2025-12-21: 「NETFLIX 1月2日上架—輪到你了」. | confirmed (Taiwan media, 2026-08-14) |
| — | いちばんすきな花 | 至愛之花 (KKTV, then LINE TV). zh-Wikipedia's article title 「最喜歡的花」 is not the Taiwan release title. | LINE TV (VIP): https://www.linetv.tw/drama/21032/eps/1 | The LINE TV page was live on 2026-11-09 (VIP badges). LINE TV's KKTV migration list (2026-01-22) names 至愛之花 (上架 2026-01-01). zh-Wikipedia: 「臺灣由KKTV…獨家跟播」. | confirmed (service page) |
| Ossan's Love | おっさんずラブ (2018) | 大叔的愛 (愛奇藝 page). The batch hint 「大叔的愛 -Returns-」 is the 2024 sequel, whose title is 「大叔的愛－Returns－」. | 愛奇藝 (iQ): https://www.iq.com/album/%E5%A4%A7%E5%8F%94%E7%9A%84%E6%84%9B-2018-19rrgxxtzx?lang=zh_tw. The sequel 「大叔的愛－Returns－」 is on Hami (https://hamivideo.hinet.net/product/280363.do?cs=2) and LINE TV (https://www.linetv.tw/drama/18430/eps/1, VIP). | The iQ zh_tw album loaded on 2026-11-09 as 「大叔的愛 (2018)」. The Hami and LINE TV Returns pages also loaded. Nahoko TW lists LINE TV for the 2018 show, but no LINE TV page for S1 was found; `/drama/19876` is the Hong Kong remake. | confirmed (service page) |
| Their Marriage (zh-Wikipedia) | しあわせな結婚 | 幸福的婚姻 (Netflix; TW media). The batch hint was empty. | Netflix: https://www.netflix.com/tw/title/82084559 | udn 噓！星聞, 2025-09-20, https://stars.udn.com/star/story/10093/9006391 (「Netflix獨家跟播的2025年夏季日劇《幸福的婚姻》」) | confirmed (Taiwan media, 2025-09-20) |
| Chihayafuru: Full Circle | ちはやふる－めぐり－ | 花牌情緣：巡 (Netflix; TW media) | Netflix: https://www.netflix.com/tw/title/82085211 | udn 噓！星聞, 2025-09-27, https://stars.udn.com/star/story/10093/9028637 (「Netflix獨家跟播的2025年夏季日劇《花牌情緣：巡》」). PTT Japandrama, 2025-07-04: 「NETFLIX 7/17上架」. | confirmed (Taiwan media, 2025-09-27) |
| — | ひらやすみ | No official Taiwan drama title found. 「平屋慢生活」 is the title of the manga (巴哈姆特 GNN, 2025-07-22) and is used by pirate sites. | None found. An anime adaptation is set for Netflix worldwide in January 2027 (Natalie, 2026-11). That is the anime, not this drama. | Searches on friDay, Hami, LINE TV, myVideo, 公視+ and Netflix found nothing. | not found |
| Chosen Home | ぼくたちん家 | 被選中的家 (TW media) | Netflix (no title ID found) | LINE TODAY / Japaholic, 2025-11-02, https://today.line.me/tw/v3/article/oq9Oo86 (「Netflix跟播日劇《被選中的家》」; read from the search snippet). | confirmed (Taiwan media, 2025-11-02) |
| Unnatural | アンナチュラル | Unnatural 法醫女王 (LINE TV); 法醫女王 in short | LINE TV (VIP): https://www.linetv.tw/drama/21215/eps/1. Netflix: https://www.netflix.com/tw/title/81714729. | The LINE TV page was live on 2026-11-09, and LINE TV's KKTV migration list (2026-01-22) names 法醫女王. Nahoko TW: 「正在LINE TV、Netflix（台湾）播出」. | confirmed (service page) |
| Glass Heart | グラスハート | 玻璃之心 (Netflix Taiwan YT) | Netflix (original): https://www.netflix.com/tw/title/81517368 | https://www.youtube.com/watch?v=tsFkvs4x1J4 「《玻璃之心》\| 正式預告 \| Netflix」, Netflix Taiwan, 2025-07-01 | confirmed (official channel) |
| Code Blue (3rd season) | コード・ブルー -ドクターヘリ緊急救命- THE THIRD SEASON | 空中急診英雄 (第三季) (GQ Taiwan 2017; film titles on TW services) | None for the series. Only the 2018 film 「空中急診英雄一海空災難最終救援」 is on friDay (https://video.friday.tw/movie/detail/45114), Hami (https://hamivideo.hinet.net/product/304021.do?cs=2) and myVideo, and that is a film, not this season. | Nahoko TW for Code Blue (2008– series), 2026-11-09, https://nahoko.si/zh/tv/code-blue-2008?country=tw: 「目前没有在此平台播出」 | not found |
| Synanthrope | シナントロープ | No official Taiwan title found. 「伴人而生」 is a mainland fan title. | None found. In Japan it streams on Prime Video and TVer. A Prime Video `zh_TW` page was not found or checked. | Searches on TW services and media found nothing. | not found |
| Dragon Sakura (2021) | ドラゴン桜 (2021) | 東大特訓班2 (Hami, friDay); Netflix: 「東大特訓班 2」 | Netflix: https://www.netflix.com/tw/title/81488898 (lead). friDay (https://video.friday.tw/drama/detail/1819) returns HTTP 400 and Hami (https://hamivideo.hinet.net/product/150217.do?cs=2) returns the 404 shell, so it has lapsed on both. | Nahoko TW (JustWatch data), 2026-11-09, https://nahoko.si/zh/tv/dragon-sakura-2005?country=tw: 「正在Netflix（台湾）播出」. UpToGo (SEO site), 2026-03-19, lists Netflix for S2, but the same table still lists the closed KKTV, so it is unreliable. | licensed-old (JustWatch-derived only) |
| Don't Call It Mystery | ミステリと言う勿れ | 勿說是推理 (friDay). The batch hint was empty. | friDay影音 (free or 影劇): https://video.friday.tw/drama/detail/2275 | The friDay page loaded on 2026-11-09 with 「適用方案：免費／影劇」, 「全12集」. | confirmed (service page) |
| — | 下剋上球児 | 下剋上球兒 | None live. friDay (https://video.friday.tw/drama/detail/3130) returns HTTP 400. LINE TV (https://www.linetv.tw/drama/21224/eps/1) shows 「即將上線」 with no episode badges, which matches the lapsed controls. | LINE TV's KKTV migration list (2026-01-22) planned it for 2026-01-09, but the page is not live now. | lapsed |
| School Lawyer | 僕達はまだその星の校則を知らない | 我們還不懂那顆星球的校規 | LINE TV (VIP): https://www.linetv.tw/drama/18212/eps/1 | The LINE TV page was live on 2026-11-09 (VIP badges). KKTV was the original 2025 simulcast. | confirmed (service page) |
| — | 光る君へ | 致光之君 | LINE TV (VIP): https://www.linetv.tw/drama/20965/eps/1 (「已完結 / 共 48 集」). myVideo: https://www.myvideo.net.tw/details/3/26246 (live, with no `expired` class). | Both pages were live on 2026-11-09. myVideo blog, 2024: 「1月9日起 MyVideo 跟播」. | confirmed (service page) |
| An Incurable Case of Love | 恋はつづくよどこまでも | 戀愛可以持續到天長地久 (Netflix TW page title; TW media). The batch hint was empty. | Netflix: https://www.netflix.com/tw/title/81423569. KKTV https://www.kktv.me/titles/01000356 says 「授權已到期」. | Beauty321, 2026-08-14, https://www.beauty321.com/post/73029 (Netflix 日劇 list, #8) | confirmed (Taiwan media, 2026-08-14) |
| — | 日曜の夜ぐらいは... | No official Taiwan title found. 「關於週日晚上」 (dorama.info) and 「周日晚上左右……」 are fan titles. | None found | Searches on friDay, Hami, LINE TV, myVideo and Netflix found nothing. | not found |
| — | 最高の教師 1年後、私は生徒に■された | 最好的教師 (LINE TV, Hami). The batch hint was empty. | None live. LINE TV (https://www.linetv.tw/drama/22255/eps/1) shows 「即將上線」 with no badges. Hami (https://hamivideo.hinet.net/product/231560.do?cs=2) returns 404. | zh-Wikipedia: 「臺灣由KKTV、Hami Video於2023年7月16日起跟播」 (old). | lapsed |
| Where Does the Sea Begin | 海のはじまり | 海的開始 | friDay影音 (free or 影劇): https://video.friday.tw/drama/detail/3575 | The friDay page loaded on 2026-11-09 with 「適用方案：免費／影劇」, 「全12集」. | confirmed (service page) |
| Sanadamaru (TMDB) | 真田丸 | 真田丸 | None. Videoland showed it on **linear TV** in February–March 2017 (Sponichi, 2017-01-19). That is not streaming. | Nahoko TW (JustWatch data), 2026-11-09, https://nahoko.si/zh/tv/sanadamaru-2016?country=tw: 「目前没有在此平台播出」. Its "可观看地区" are HK, PH and JP only. | not found |
| Emergency Interrogation Room (Season 4) | 緊急取調室 第4シーズン | 女王偵訊室 (S4 / 第四季) (Hami, myVideo, friDay; zh-Wikipedia lists the Taiwan name as 女王偵訊室) | Hami Video (some episodes free): https://hamivideo.hinet.net/product/321851.do?cs=2 (「女王偵訊室S4」). myVideo: https://www.myvideo.net.tw/details/3/19638 (「女王偵訊室 第四季」, live). | Both pages loaded on 2026-11-09. LINE TV's KKTV migration list (2026-01-22) also names 女王偵訊室S4; no LINE TV page was checked. | confirmed (service page) |
| — | 舟を編む 〜私、辞書つくります〜 | No official Taiwan title found. 「編舟記～我要編纂辭典～」 is a fan title. | None found | Searches on friDay, Hami, LINE TV, myVideo and 公視+ found nothing. | not found |
| The Family | 華麗なる一族 (2021) | 華麗一族 (friDay 2021; 民視新聞 2021-04-20) | None live. friDay (https://video.friday.tw/drama/detail/1834) returns HTTP 400. | 民視新聞, 2021-04-20, https://www.ftvnews.com.tw/news/detail/2021420W0250 (「每週日在friDay影音全網首播」), which is outdated. No current TW platform was found; in Japan it streams on Netflix, Prime, TELASA and WOWOW. | lapsed |

## Notes

- **Counts (33 shows)**:
  - **Confirmed: 20.**
    - Each show is counted once, by its strongest evidence.
    - Official channel: 2, both on Netflix Taiwan (99.9 and Glass Heart).
    - Service page: 12. These are 再續．倒數第二次戀愛, 119緊急呼叫, Eye Love You, GO HOME, 至愛之花, 大叔的愛 (2018, 愛奇藝), Unnatural, 勿說是推理, 我們還不懂那顆星球的校規, 致光之君, 海的開始 and 女王偵訊室 S4.
    - Taiwan media: 6. These are 宛如阿修羅, 輪到你了, 幸福的婚姻, 花牌情緣：巡, 被選中的家 and 戀愛可以持續到天長地久.
  - **Licensed-old: 1.** This is Dragon Sakura 2021, with Netflix from JustWatch-derived data only.
  - **Lapsed: 5.** These are 鎌倉殿の13人, dele, 下剋上球児, 最高の教師 and 華麗なる一族 (2021).
  - **Not found: 7.** These are 虎に翼 (linear 緯來日本台 only), ひらやすみ, Code Blue 3rd season, シナントロープ, 日曜の夜ぐらいは..., 真田丸 and 舟を編む.
- **Platforms confirmed**:
  - Netflix: 9. These are Asura, 99.9, 輪到你了, 幸福的婚姻, 花牌情緣：巡, 被選中的家, Glass Heart and 戀愛可以持續, plus Eye Love You and Unnatural, which also have LINE TV.
  - LINE TV: 7. These are Eye Love You, GO HOME, 至愛之花, Unnatural, 校規, 致光之君 and 大叔的愛－Returns－ (the sequel only).
  - friDay影音: 4, all on the free tier as well as 影劇. These are 再續．倒數第二次戀愛, 119緊急呼叫, 勿說是推理 and 海的開始.
  - Hami Video: 3, plus the Returns sequel. These are 119緊急呼叫, GO HOME and 女王偵訊室S4.
  - myVideo: 2 (致光之君 and 女王偵訊室 第四季).
  - 愛奇藝: 1 (大叔的愛 2018).
  - Not found on Disney+, CATCHPLAY+ or 公視+ (the 公視+ 鎌倉殿 台語版 has lapsed). The Prime Video `zh_TW` pages were not checked.
- **Lapsed licences seen**:
  - friDay HTTP 400: Eye Love You (3268), 東大特訓班2 (1819), 下剋上球兒 (3130) and 華麗一族 (1834).
  - Hami 404: 鎌倉殿的13人 (175750), 東大特訓班2 (150217) and 最好的教師 (231560).
  - myVideo `expired`: dele 刪除人生 (28067).
  - LINE TV 「即將上線」 with no badges: 下剋上球兒 (21224) and 最好的教師 (22255).
  - KKTV 「授權已到期」: 鎌倉殿, dele, 輪到你了, 戀愛可以持續, 東大特訓班. KKTV itself closed on 2026-01-01.
  - 公視+ 「已過授權期限」: 鎌倉殿的13人（台語版）.
- **Title corrections to the batch file**:
  - 「再續・倒數第二次戀愛」 should be 「再續．倒數第二次戀愛」 (friDay).
  - 虎に翼 is 如虎添翼.
  - おっさんずラブ (2018) is 大叔的愛; 「-Returns-」 belongs only to the 2024 sequel, written 「大叔的愛－Returns－」.
  - いちばんすきな花 is 至愛之花, not 最喜歡的花.
  - The file had no zh title for 99.9, あなたの番です, しあわせな結婚, アンナチュラル, ミステリと言う勿れ, 恋つづ, 最高の教師, 海のはじまり, 緊急取調室, 華麗なる一族, ドラゴン桜 and Code Blue. Those titles are filled in above.
  - No official Taiwan title exists for ひらやすみ, シナントロープ, 日曜の夜ぐらいは... or 舟を編む. The hints 「平屋慢生活」 and 「Synanthrope」 are not Taiwan release titles.
- **English titles filled from sources**:
  - Your Turn to Kill and Their Marriage (zh-Wikipedia).
  - 119 Emergency Call and Emergency Interrogation Room (Hami page and zh-Wikipedia).
  - Sanadamaru (TMDB via Nahoko).
  - The NHK English title for 虎に翼 was not verified this session, so it is left blank.
- **The LINE TV status method is indirect.** It is a server-HTML heuristic checked against two known-lapsed controls. A device check in Taiwan would settle the LINE TV rows. Two shows rest on LINE TV alone: 至愛之花 and 校規. GO HOME also has Hami, and Unnatural and Eye Love You also have Netflix.
- **下剋上球兒** appeared on LINE TV's migration list, but its page is not live. A YouTube playlist titled 「即日起至6/20 限時免費看【日劇】《下剋上球兒》」 suggests a 2026 free window that has since ended. The playlist's owner was not checked.
- **被選中的家**: the LINE TODAY article was read from the search snippet only, and no Netflix title ID was found.

## toolDegradation

- Groundlane `web_search`:
  - You.com reported 「you budget exhausted」 part-way through.
  - Brave was intermittently 「unavailable」, and Groundlane's internal Tavily and Exa were reported unavailable.
  - Groundlane fell back to Browserbase. Searches still returned usable results throughout.
- Exa (standalone MCP) was used for 4 searches and 2 fetches: 真田丸, 緊急取調室, 舟を編む and 華麗なる一族, plus the UpToGo and LINE TV cache reads. Its LINE TV fetch returned stale cached content, so it was not used for status.
- Tavily and jina were not needed.
- YouTube watch pages: Groundlane `web_extract` got a stripped page (no `meta[name=title]`, `link[itemprop=name]` or `datePublished`). Title and channel were taken from `youtube.com/oembed` instead, and dates from the search-result `publishedAt`.
- JustWatch TW: the search URL returned 404, and slug guesses (`/tw/節目/your-turn-to-kill`, `dragon-zakura`, `unnatural`) returned empty or 404 pages. Nahoko (nahoko.si, JustWatch/TMDB data with `?country=tw`) was used as the JustWatch lead instead. Some Nahoko slug guesses redirected to an empty search or timed out (hirayasumi, dont-call-it-mystery, kamakura).
- LINE TV: the 「授權到期」 notice is client-rendered. Groundlane `render: always` failed with 「upstream closed the stream」, so the VIP-badge / 「即將上線」 heuristic described above was used.
- Firecrawl was not used (credits exhausted). Terminal curl was not used (blocked).
