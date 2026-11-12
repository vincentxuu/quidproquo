# Mainland Chinese scripted TV (陸劇) candidates — Category C (ratings) / D (viewing data) / E (buzz/demand)

Collected 2026-11-12 for the zh-TW series「各國影劇導讀」. Data file only — no article copy.
Scope: scripted series produced in mainland China (CCTV, provincial satellite TV, iQIYI / Tencent Video / Youku / Mango TV / Bilibili originals). HK / Taiwan productions, variety, donghua (Chinese animation), documentaries, 微短剧 (micro-dramas) and films excluded (see §4). D/E focus 2016–2026; C lists keep older classics.
Tools: Groundlane `web_search` / `web_fetch` / `web_extract` (primary); Exa `web_fetch_exa` (IMDb, Netflix Tudum, Douban annual 2025 page); jina `read_url` (云合 2024 PDF). See §6 toolDegradation.

## 1. Sources

Read status: **read** = page body fetched and parsed; **partial** = fetched but only part of the needed data present; **snippet** = only a search-result excerpt seen (shown in tags but **not counted**); **unread** = blocked / not reachable / not attempted.

| Key | Source | URL | Read status | What was extracted |
|---|---|---|---|---|
| IMDb | IMDb advanced search: TV series + mini-series, country = China, **genre ≠ Animation**, ≥1,000 votes, sorted by user rating (top 100) | https://www.imdb.com/search/title/?title_type=tv_series,tv_miniseries&countries=CN&genres=!animation&sort=user_rating,desc&num_votes=1000,&count=100 | read (Exa) | Rating + votes. Cut-off of the list ≈ 7.6. Ranks 1–6 are BBC nature docs (co-pro tagged CN), plus Olympics coverage, Spellbinder (AU/PL), Marco Polo (1982, IT), My Stand-In (Thai), My Roommate Is a Gumiho (KR) — dropped (§4) |
| MDL | MyDramaList "Top Chinese Dramas" pages 1–3 (ranks 1–59; #60 cut off in page text) + show pages for ranks 1–20 | https://mydramalist.com/shows/top_chinese_dramas (?page=2, ?page=3) | read; "scored by" counts for ranks 1–20 via `web_extract` | Rank, score, ratings count (1–20). MDL ranks parts/specials separately (Love Like the Galaxy Pt1/Pt2, Untamed Special Edition, Word of Honor Epilogue) |
| DB25 | 豆瓣2025年度电影榜单 — 2025评分最高华语剧集 (top 10, scores as displayed at read time) + 2025月度热搜影视 + 2026最值得期待剧集 | https://movie.douban.com/annual/2025/ (cross-check: https://news.qq.com/rain/a/20251223A044P600) | read (Exa rendered the official page) | Rank + current Douban score. Baidu Baike snippet says 无尽的尽头 was 8.5 at publication; page now shows 8.6 |
| DB24 | 豆瓣2024年度电影榜单 — 2024评分最高华语剧集 + 月度热搜 | https://news.qq.com/rain/a/20241224A03R7X00 (official page https://movie.douban.com/annual/2024/ = JS-empty in Groundlane browser + Exa) | read **via news repost** (no scores) | Rank. Scores from 云合 2024 PDF (YH24) Douban page: 山花烂漫时 9.6, 我的阿勒泰 8.9, 天行健 8.8, 唐诡西行 8.6, 日光之城 8.5, 小巷人家 8.3 |
| DB23 | 豆瓣2023年度电影榜单 — 2023评分最高华语剧集 + 月度热搜 | https://news.qq.com/rain/a/20231226A05R2C00 (official page: Exa CRAWL_EMPTY_CONTENT) | read **via news repost** | Rank; 漫长的季节 9.4 (ccn.com.cn / 163 / Baike snippets agree), 三体 8.7 (douban annual snippet) |
| DB22 | 豆瓣2022年度 评分最高华语剧集 | https://finance.sina.cn/2022-12-27/detail-imxyayvx1257202.d.html (北京青年报) | read **via news** | Unscored ordered list of 10 |
| DB21 | 豆瓣「2021年评分最高的大陆剧集」 | https://news.qq.com/rain/a/20211229A067B000 | read **via news** | Ordered list of 10 (mainland-only list). Scores (snippet, k.sina): 觉醒年代 9.3, 山海情 9.2, 功勋 9.1, 大江大河2 8.8 |
| DB20 | 豆瓣2020年度 评分最高华语剧集 | https://www.sohu.com/a/446468313_99994603 | read **via news repost** | Unscored ordered list of 10 |
| DB-classic | Douban all-time 华语剧集 / group pages | https://www.douban.com/group/topic/472644923/ etc. | unread (HTTP 403 Groundlane + Exa) | — |
| YH24 | 云合数据《2024年长剧集网播年度观察》PDF (东方财富 mirror) | https://pdf.dfcfw.com/pdf/H3_AP202501081641847977_1.pdf | read (jina) | 上新剧累计有效播放霸屏榜 TOP20; 热播期集均 TOP20; 集均V30 TOP20; 2024全网老剧有效播放 TOP10; 2024 集均破亿 club (7 titles) |
| YH25 | 云合数据 2025 上新长剧累计有效播放霸屏榜 TOP20 (via news) | https://news.qq.com/rain/a/20260106A06HAT00 ; summary https://www.sohu.com/a/973154506_121888860 | **partial** (news prints #1–5, #18, and 5 unranked members; report PDF not reached — sohu points to a WeChat account) | Rank + 有效播放 where printed |
| YH23 | 云合数据 2023 剧综报告 — 全网剧集有效播放 TOP10 (iQIYI titles only) | https://finance.sina.cn/hkstock/gsxw/2024-01-12/detail-inachiyx1600299.d.html (智通财经) | **partial** (iQIYI PR framing: lists 8 iQIYI titles of the TOP10, unranked except 狂飙 #1) | Membership only |
| YH23-x | 云合 2023 annual via Youku PR (长月烬明 #3 全网累计/V30/热播期) ; H1 2023 集均 (phb123) ; YH25H1 (thepaper) | https://finance.sina.cn/tech/2024-01-06/detail-inaaqepa1823506.d.html ; https://www.phb123.com/yule/dsj/65049.html ; https://www.thepaper.cn/newsDetail_forward_31107111 | snippet | not counted |
| LT24 | 灯塔专业版 2024 年度剧集播放榜 (淘票票/灯塔 official Sohu account) | https://www.sohu.com/a/843429934_745022 | read | Top-3 of 电视剧榜 / 网络剧榜 / 集均 / genre lists + genre champions |
| LT25 | 灯塔 2025 国产剧全网播放量 TOP10 (via news) | https://view.inews.qq.com/a/20251229A02VDW00 | read (news) | Rank + 正片播放量 + Douban score/votes as printed |
| MYP25 | 猫眼专业版 2025 剧集有效播放榜 | https://news.qq.com/rain/a/20251230A05UJC00 | read (news repost of Maoyan post) | TV top 3, web top 3, genre champions |
| MYH25 | 猫眼专业版 2025 电视剧热度榜 TOP10 | https://www.sina.cn/news/detail/5249257710027775.html (羊城晚报) | read | Listed order 1–10 (only 冠军/亚军 labelled in snippet; ranks 3–10 = listed order) |
| CVB25 | 国家广播电视总局《中国视听大数据（CVB）2025年国产电视剧收视报告》 | https://www.nrta.gov.cn/art/2025/12/26/art_114_72192.html | read | 2025 年度电视剧收视率榜 ranks where printed (#1,2,4,5,6,8,11,12,13,17,24, "top10", "top35"); 地方卫视首播榜 #1–2. Shows mentioned with a rating but no rank are tagged "(mention)" and **not counted** |
| PH25 | Platform year-end heat/play ranks **as cited inside the NRTA CVB25 report** (腾讯视频热度值、优酷热度、爱奇艺热度值、芒果TV播放量) | same as CVB25 | read | Rank per platform |
| IQ10K | 爱奇艺站内热度破万剧 list (since 2021, 15 titles as of 2025-04 爱奇艺世界大会) + iQIYI 2022 release naming 延禧攻略 as pre-2021 破万 | https://m.sohu.com/a/889730731_122158486/ ; http://www.iqiyi.com/kszt/news20221116.html | read | Membership only. Post-April-2025 entrants not captured |
| CSM24 | CSM全国网 2024 国产剧黄金档收视 TOP20 (from 2024年中国剧集产业年度发展报告, posted on Douban group) | https://www.douban.com/group/topic/472644923/ | snippet (page 403) | 1 人民警察 1.68, 2 我是刑警 1.42, 3 上甘岭 1.24, 4 庆余年2 1.19, 5 大江大河之岁月如歌 1.17 … 16 小巷人家 0.99, 17 山花烂漫时 0.98, 19 问苍茫 0.95 — **not counted** |
| CVB24 / 酷云 / 骨朵 annual | CVB 2024 annual report; 酷云 annual; 骨朵 annual heat | — | unread (NRTA 2024 annual not located in search; 酷云/骨朵 not attempted for time) | — |
| NFAT | Netflix Tudum "Top 10 Most Popular Non-English Shows of All Time" | https://www.netflix.com/tudum/top10/most-popular/tv-non-english | read (Exa) — **no Chinese title** | — |
| NF26 | Netflix Tudum weekly Global Top 10 Non-English TV, weeks ending 2026-03-15, 03-22, 08-30, 09-06, 10-04, 10-18 | https://www.netflix.com/tudum/top10/tv-non-english?week=2026-03-15 (and the other dates) | read (Exa) | Rank, views, hours. Weeks chosen from news leads; other weeks not scanned |
| NF-news | MDL news / Sixth Tone / PR Newswire / Sina on mainland dramas entering the Netflix chart (翘楚; "Pursuit of Jade first mainland drama on the weekly chart") | https://news.mydramalist.com/article/chinese-drama-pursuit-of-jade-makes-its-netflix-top-10-debut ; https://www.sixthtone.com/news/1019007 ; https://www.sina.cn/news/detail/5351357009888775.html | snippet | not counted (翘楚 week not read) |
| WB25 | 2025微博视界大会 honours (2025-11-03) | https://hea.china.com/articles/20251105/202511051759836.html | read | 年度影响力作品 / 大众喜爱 / 品质 / 优秀 / 突破创新 / 媒体选择 / 文学IP |
| WB26 | 2026微博视界大会 honours (2026-10-31) | https://ent.ifeng.com/c/8xmGYKd8FUI | read | 年度电视剧 / 年度影响力作品 / 品质 / 优秀 / 突破创新 / 大众喜爱 / 期待 |
| PAR | Parrot Analytics on Chinese dramas | https://www.parrotanalytics.com/press/15-great-chinese-dramas-to-binge/ | snippet (WIRED reprint; no ranking) | not counted; no Parrot GDA winner for a Chinese drama found |
| GYS | Google Year in Search (Chinese dramas) | — | unread (not attempted; Google not used in mainland, TW/HK lists would measure Taiwan demand — belongs to the fans/Taiwan file) | — |

Key counting: one key per report/year (DB20–DB25, YH23/24/25, LT24/25, WB25/26 separate). Several keys share a data family — see §5 before ranking by "independent families".

## 2. Coverage check — biggest names × source families

| Show | IMDb | MDL | Douban (DB*) | 云合 (YH*) | 灯塔 (LT*) | 猫眼 (MY*) | CVB / platform heat | Netflix | Weibo |
|---|---|---|---|---|---|---|---|---|---|
| 狂飙 | 7.7 (1.2K) | – | DB23 #7 | YH23 #1 (>100亿) | – (2023 not read) | – | IQ10K | – | – (pre-WB25) |
| 庆余年 / 第二季 | 8.2 (2.7K) | #7 / S2 #16 | DB24 月度热搜 | YH24 #1 45.1亿; 老剧 #2 | LT24 TV #1 35.58亿 | – (2024 not read) | – (CVB24 unread; CSM24 snippet #4) | – | – |
| 藏海传 | 8.2 (24K) | – | DB25 月度热搜 | YH25 #1 22.3亿 | LT25 #1 28.75亿 | MYP25 #1, MYH25 #1 | PH25 优酷 #1 (CVB25 mention 1.469%) | – | WB25 影响力 |
| 漫长的季节 | 8.8 (1.8K) | – | DB23 #1 9.4 | – | – | – | – | – | – |
| 琅琊榜 | 8.8 (3.7K) | #3 9.0 | – (2015, pre-list) | YH24 老剧 #10 | – | – | – | – | – |
| 逐玉 | 8.7 (5.9K) | #1 9.1 | DB25 期待榜 (Douban 6.4, not counted) | – (2026 not out) | – | – | – | NF26 #6, #8 | WB26 年度电视剧 |
| 三体 | 7.6 (8.4K) | – | DB23 #2 | – | – | – | – | – | – |
| 六姊妹 | – | – | – (Douban 5.7 per LT25) | YH25 top20 | LT25 #10 | – | CVB25 #1 4.349%; PH25 腾讯 #4 | – | WB25 品质 |
| 甄嬛传 | 8.5 (2.9K) | – | – | YH24 老剧 #1 | – | – | – | – | – |

"–" = checked, absent. Two populations again: (a) Douban-annual / CVB "quality & mainstream TV" titles (现实主义, 年代, 刑侦, CCTV first-run) that are nearly absent from IMDb/MDL; (b) 古偶 / 仙侠 / 现偶 web dramas that dominate MDL, IMDb and the streaming-volume lists (云合/灯塔/猫眼) but rarely make Douban's annual top 10. Bridges: 唐朝诡事录 franchise, 藏海传, 庆余年, 繁花, 苍兰诀, 莲花楼, 九重紫, 去有风的地方, 开端, 星汉灿烂.

## 3. Candidate table

Distinct-source count uses the keys in §1; snippet keys (CSM24, YH23-x, NF-news, PAR) and "(mention)" / "期待榜" tags are shown but **not counted**. Rows sorted by count, then first-air year.
Chinese titles: simplified as printed in the source / Traditional = my conversion. **†** after a title = that Chinese or English title was supplied from memory (not printed in any read source; for IMDb/MDL-only rows the Chinese title is the † one, for Chinese-list rows the English title). **First-air year, network/platform and genre are from memory for every row** except where a source prints them (YH24 PDF prints 上线日期; CVB25 prints the channel; LT25/MYP25 print 开播月份; NF26 prints Netflix). Franchises/seasons merged into one row.

Distinct shows in the table ≈ 233 (143 rows; grouped rows hold several shows). Shows with ≥4 sources: 唐朝诡事录 franchise (10); 藏海传 (8); 大奉打更人 (7); 生万物, 国色芳华 (6); 庆余年, 以法之名, 六姊妹, 苍兰诀 (5); 繁花, 与凤行, 墨雨云间, 狂飙, 莲花楼, 宁安如梦, 小巷人家, 我是刑警, 九重紫, 许我耀眼, 书卷一梦, 难哄, 折腰, 知否知否应是绿肥红瘦, 逐玉 (4).

| # | 中文片名（简 / 繁） | English title | Year(s) | Network/platform | Genre | Evidence tags | Distinct sources | Keys |
|---|---|---|---|---|---|---|---|---|
| 1 | 唐朝诡事录（2022）/ 之西行（2024）/ 之长安（2025）· 唐朝詭事錄 | Strange Tales of Tang Dynasty† (I / II: To the West† / III: Chang'an†) | 2022 / 2024 / 2025 | 爱奇艺 (+北京卫视) | supernatural mystery, period | `C DB22 #9`; `C DB24 #5 西行 (8.6)`; `C DB25 #7 长安 8.0`; `D YH24 #6 西行 20.2亿; 热播期集均 #14; 老剧 #6 (S1)`; `D LT24 网络剧榜 #2 西行 21.42亿; 悬疑剧冠军; 悬疑集均 #3`; `D LT25 #3 长安 20.43亿 (豆瓣 8.0/14万)`; `D MYP25 电视剧有效播放 #3 长安 21.22亿; 悬疑剧双榜冠军`; `D PH25 爱奇艺热度值 #4 (长安)`; `D IQ10K 西行`; `E WB26 年度优秀作品 (长安)`; `D CVB25 (mention) 北京卫视 本地 3.812% / 3.376%` | 10 | DB22, DB24, DB25, IQ10K, LT24, LT25, MYP25, PH25, WB26, YH24 |
| 2 | 藏海传 · 藏海傳 | Legend of Zang Hai | 2025 | 优酷 / CCTV-8 | revenge / court intrigue, period | `C IMDb 8.2 (24K)`; `C DB25 月度热搜影视`; `D YH25 #1 22.3亿`; `D LT25 #1 28.75亿 (豆瓣 7.1/55万)`; `D MYP25 有效播放总冠军 23.51亿`; `E MYH25 热度 #1`; `D PH25 优酷 2025 热度榜 #1`; `E WB25 年度影响力作品`; `D CVB25 (mention) CCTV8 1.469%, 首播 6.4亿人次`; `D YH25H1 #2 18.2亿 (snippet)` | 8 | DB25, IMDb, LT25, MYH25, MYP25, PH25, WB25, YH25 |
| 3 | 大奉打更人 · 大奉打更人 | Guardians of the Dafeng | 2024–25 | 腾讯视频 / CCTV-8 (2024-12-28 start per LT25) | time-travel fantasy comedy-mystery | `C IMDb 7.8 (1.2K)`; `C MDL #42 8.6`; `D YH25 #2 22.1亿`; `D LT25 #7 14.87亿 (豆瓣 5.6/18万)`; `D MYP25 喜剧有效播放双榜冠军 17.33亿`; `E MYH25 热度 #3`; `E WB25 年度影响力作品`; `D YH25H1 #1 19.3亿 (snippet)` | 7 | IMDb, LT25, MDL, MYH25, MYP25, WB25, YH25 |
| 4 | 生万物 · 生萬物 | — (English title not in sources) | 2025 | CCTV-8 / 爱奇艺 | rural period saga | `D YH25 #4`; `D LT25 #2 21.35亿 (豆瓣 7.2/22万)`; `D MYP25 电视剧有效播放 #2 21.60亿; 电视剧集均冠军 6058万`; `E MYH25 热度 #6`; `D PH25 爱奇艺 2025 热度值 #1`; `E WB25 年度影响力作品`; `D CVB25 (mention) CCTV8 2.388%, 8.8亿人次` | 6 | LT25, MYH25, MYP25, PH25, WB25, YH25 |
| 5 | 国色芳华（含 锦绣芳华）· 國色芳華 | Flourished Peony | 2025 | 芒果TV / 湖南卫视 (+腾讯) | period business / romance | `C MDL #57 8.5`; `C DB25 #8 7.8; 月度热搜`; `D LT25 #9 12.78亿 (豆瓣 7.8/41万)`; `E MYH25 热度 #2`; `D PH25 芒果TV 播放量 #2`; `E WB25 年度品质作品 + 年度影视化文学IP`; `D YH25H1 #3 15.1亿 (snippet)` | 6 | DB25, LT25, MDL, MYH25, PH25, WB25 |
| 6 | 庆余年（S1 2019 / 第二季 2024）· 慶餘年 | Joy of Life | 2019 / 2024 | 腾讯视频 / CCTV-8 | time-travel court intrigue | `C IMDb 8.2 (2.7K)`; `C MDL #7 8.9 (14,582); S2 #16 8.8 (6,498)`; `C DB24 月度热搜 (S2)`; `D YH24 #1 45.1亿; 热播期集均 #1 1.1亿; V30 #1 9809万; 集均破亿 club; 老剧 #2 (S1)`; `D LT24 电视剧榜 #1 35.58亿; 集均 #1 9394万; 单日 #1 1.55亿`; `D CSM24 #4 1.19 (snippet)` | 5 | DB24, IMDb, LT24, MDL, YH24 |
| 7 | 以法之名 · 以法之名 | — | 2025 | CCTV-8 / 优酷 | prosecutorial crime | `D YH25 top20 (rank not printed)`; `D LT25 #4 19.97亿 (豆瓣 6.8)`; `D PH25 优酷 热度 #2`; `D CVB25 年度收视 top35`; `E WB25 年度品质作品` | 5 | CVB25, LT25, PH25, WB25, YH25 |
| 8 | 六姊妹 · 六姊妹 | — | 2025 | CCTV-1 (Feb 2025) | family / period | `D CVB25 年度收视 #1 4.349% (CVB 史上唯一全剧均值 >4%)`; `D PH25 腾讯视频热度值 #4`; `D YH25 top20`; `D LT25 #10 12.5亿 (豆瓣 5.7)`; `E WB25 年度品质作品 + 文学IP` | 5 | CVB25, LT25, PH25, WB25, YH25 |
| 9 | 苍兰诀 · 蒼蘭訣 | Love Between Fairy and Devil | 2022 | 爱奇艺 | xianxia romance | `C IMDb 8.4 (5.5K)`; `C MDL #28 8.7`; `C DB22 #8`; `D YH24 集均破亿 club (2024-08-19)`; `D IQ10K` | 5 | DB22, IMDb, IQ10K, MDL, YH24 |
| 10 | 狂飙 · 狂飆 | The Knockout | 2023 | CCTV-8 / 爱奇艺 | crime / anti-gang epic | `C IMDb 7.7 (1.2K)`; `C DB23 #7; 月度热搜`; `D YH23 全网有效播放 #1 (>100亿)`; `D IQ10K (云合 V30 2亿, 站内 11800 per news)`; `D YH23-x H1 热播期集均 1.79亿 (snippet)` | 4 | DB23, IMDb, IQ10K, YH23 |
| 11 | 繁花 · 繁花 | Blossoms Shanghai | 2023-12 – 2024 | CCTV-8 / 腾讯视频 | period business drama | `C IMDb 7.8 (1.4K)`; `C DB24 #4; 月度热搜`; `D YH24 #4 22.9亿; 热播期集均 #3 6394万`; `D LT24 都市剧 #2 18.19亿; 现偶集均 #1 6279万` | 4 | DB24, IMDb, LT24, YH24 |
| 12 | 与凤行 · 與鳳行 | The Legend of Shen Li | 2024 | 腾讯视频 / 芒果TV | xianxia romance | `C IMDb 8.2 (1.4K)`; `C MDL #40 8.6`; `D YH24 #2 31.6亿; 热播期集均 #2`; `D LT24 电视剧榜 #2 28.12亿; 集均 #3` | 4 | IMDb, LT24, MDL, YH24 |
| 13 | 墨雨云间 · 墨雨雲間 | The Double | 2024 | 优酷 | revenge romance, period | `C IMDb 8.2 (2.4K)`; `C MDL #20 8.8 (29,933)`; `D YH24 #3 26.7亿`; `D LT24 网络剧榜 #1 33.70亿; 集均 #2 8060万` | 4 | IMDb, LT24, MDL, YH24 |
| 14 | 莲花楼 · 蓮花樓 | Mysterious Lotus Casebook | 2023 | 爱奇艺 | wuxia mystery | `C MDL #8 8.9 (12,917)`; `C DB23 #8`; `D YH23 全网 top10 (iQIYI list)`; `D IQ10K` | 4 | DB23, IQ10K, MDL, YH23 |
| 15 | 宁安如梦 · 寧安如夢 | Story of Kunning Palace | 2023 | 爱奇艺 | rebirth court romance | `C IMDb 8.0 (1.8K)`; `C MDL #38 8.6`; `D YH23 全网 top10`; `D IQ10K` | 4 | IMDb, IQ10K, MDL, YH23 |
| 16 | 小巷人家 · 小巷人家 | Romance in the Alley† | 2024 | 湖南卫视 / 腾讯视频 | period family | `C DB24 #9 (8.3)`; `D YH24 #15 13.2亿; V30 #20`; `D LT24 年代剧播放冠军`; `E WB25 年度影响力作品 + 媒体选择荣耀`; `D CSM24 #16 0.99 (snippet)` | 4 | DB24, LT24, WB25, YH24 |
| 17 | 我是刑警 · 我是刑警 | — | 2024 | CCTV-8 / 爱奇艺 | police procedural (real cases) | `D YH24 #8 17.2亿; 热播期集均 #8`; `D LT24 悬疑剧 #2 15.61亿`; `D IQ10K`; `E WB25 年度品质作品`; `D CSM24 #2 1.42 (snippet)` | 4 | IQ10K, LT24, WB25, YH24 |
| 18 | 九重紫 · 九重紫 | Blossom | 2024 | 腾讯视频 / 浙江卫视 | rebirth / household intrigue | `C IMDb 7.9 (1.2K)`; `C MDL #24 8.8`; `C DB25 #10 7.8`; `E WB25 年度突破创新作品` | 4 | DB25, IMDb, MDL, WB25 |
| 19 | 许我耀眼 · 許我耀眼 | — | 2025 | 腾讯视频 / 东方卫视 | urban romance | `D YH25 #3 (热播期集均 6328万 per news)`; `D LT25 #5 19.64亿 (豆瓣 6.5)`; `D MYP25 都市剧有效播放双榜冠军 16.19亿`; `D PH25 腾讯视频 2025 热度值 #1` | 4 | LT25, MYP25, PH25, YH25 |
| 20 | 书卷一梦 · 書卷一夢 | — | 2025 | 爱奇艺 (+江苏卫视) | fantasy period romance | `D LT25 #6 15.21亿 (豆瓣 7.1)`; `E MYH25 热度 #8`; `D MYP25 古偶剧有效播放双榜冠军 16.00亿`; `E WB25 年度突破创新作品` | 4 | LT25, MYH25, MYP25, WB25 |
| 21 | 难哄 · 難哄 | The First Frost | 2025 | 优酷 | romance | `C IMDb 8.4 (5.1K)`; `C MDL #14 8.8 (47,537)`; `D YH25 top20`; `E WB25 年度大众喜爱作品` | 4 | IMDb, MDL, WB25, YH25 |
| 22 | 折腰 · 折腰 | The Prisoner of Beauty | 2025 | 腾讯视频 | political-marriage romance | `C IMDb 8.2 (2.6K)`; `C MDL #9 8.9 (31,685)`; `D PH25 腾讯视频热度值 #3`; `E WB25 年度优秀作品` | 4 | IMDb, MDL, PH25, WB25 |
| 23 | 知否知否应是绿肥红瘦 · 知否知否應是綠肥紅瘦 | The Story of Ming Lan | 2018 | 湖南卫视 / 腾讯视频† | household drama, Song dynasty | `C IMDb 8.3 (1.5K)`; `C MDL #26 8.7`; `D YH24 老剧 #3`; `D YH23 全网 top10 (old drama, 2023 老剧冠军 per Youku PR snippet)` | 4 | IMDb, MDL, YH23, YH24 |
| 24 | 逐玉 · 逐玉 | Pursuit of Jade | 2026 | 腾讯视频 / 爱奇艺 (+Netflix) | period romance | `C MDL #1 9.1 (46,913)`; `C IMDb 8.7 (5.9K)`; `D NF26 Netflix non-English #6 (Mar 9–15, 1.9M views) / #8 (Mar 16–22, 1.8M)`; `E WB26 年度电视剧`; `C DB25 2026最值得期待剧集 — Douban now 6.4 (not counted)` | 4 | IMDb, MDL, NF26, WB26 |
| 25 | 去有风的地方 · 去有風的地方 | Meet Yourself | 2023 | CCTV-8 / 腾讯视频† | slow-life rural romance | `C IMDb 8.2 (1.2K)`; `C MDL #19 8.8 (13,388)`; `C DB23 #3` | 3 | DB23, IMDb, MDL |
| 26 | 长相思（S1 2023 / S2 2024）· 長相思 | Lost You Forever | 2023 / 2024 | 腾讯视频 | xianxia romance | `C MDL #55 8.6`; `D YH24 S2 热播期集均 #13 4089万; V30 #9`; `D LT24 古偶集均 #3 5002万 (S2); 仙侠剧冠军`; `D YH23-x H1 热播期 #2 (snippet)` | 3 | LT24, MDL, YH24 |
| 27 | 一念关山 · 一念關山 | A Journey to Love | 2023 | 爱奇艺 | wuxia / spy romance | `C MDL #34 8.7`; `D YH23 全网 top10`; `D IQ10K` | 3 | IQ10K, MDL, YH23 |
| 28 | 边水往事 · 邊水往事 | Escape from the Trilateral Slopes† | 2024 | 腾讯视频 | crime adventure (Golden Triangle) | `C DB24 #10; 月度热搜`; `D YH24 V30 #18 3283万`; `D LT24 悬疑集均 #1 6613万` | 3 | DB24, LT24, YH24 |
| 29 | 惜花芷 · 惜花芷 | Blossoms in Adversity | 2024 | 腾讯视频† | family survival, period | `C MDL #41 8.6`; `D YH24 #9 16.9亿`; `D LT24 网络剧榜 #3 19.96亿` | 3 | LT24, MDL, YH24 |
| 30 | 追风者 · 追風者 | War of Faith† | 2024 | CCTV-8 / 爱奇艺 | finance-spy, Republican era | `D YH24 #10 15.8亿`; `D LT24 谍战剧播放冠军`; `D IQ10K (峰值 10017)` | 3 | IQ10K, LT24, YH24 |
| 31 | 猎罪图鉴（2022 / S2 2024）· 獵罪圖鑑 | Under the Skin | 2022 / 2024 | 爱奇艺† / CCTV-8† | forensic-sketch crime | `C MDL #35 8.6`; `D YH24 #20 11.8亿 (S2); 集均破亿 club (S1, 2024-03-05)`; `E WB25 年度优秀作品 (S2)` | 3 | MDL, WB25, YH24 |
| 32 | 卿卿日常 · 卿卿日常 | New Life Begins | 2022 | 爱奇艺 | light period comedy | `C MDL #49 8.6`; `D YH24 集均破亿 club (2024-03-02)`; `D IQ10K (fastest to 10K at the time)` | 3 | IQ10K, MDL, YH24 |
| 33 | 开端 · 開端 | Reset | 2022 | 腾讯视频 | time-loop thriller | `C MDL #5 9.0 (28,576)`; `C IMDb 8.1 (2.6K)`; `C DB22 #7` | 3 | DB22, IMDb, MDL |
| 34 | 星汉灿烂 · 星漢燦爛 | Love Like the Galaxy | 2022 | 腾讯视频 | period romance | `C IMDb 8.3 (2.9K)`; `C MDL Pt1 #13 8.9 (34,812); Pt2 #11 8.9 (28,922)`; `D YH24 老剧 #9` | 3 | IMDb, MDL, YH24 |
| 35 | 琅琊榜 · 琅琊榜 | Nirvana in Fire | 2015 | 北京卫视 / 东方卫视† | court intrigue | `C IMDb 8.8 (3.7K)`; `C MDL #3 9.0 (14,182)`; `D YH24 老剧 #10` | 3 | IMDb, MDL, YH24 |
| 36 | 延禧攻略 · 延禧攻略 | Story of Yanxi Palace | 2018 | 爱奇艺 | palace intrigue | `C IMDb 8.2 (2.3K)`; `C MDL #31 8.7`; `D IQ10K (pre-2021 破万, per iqiyi.com)` | 3 | IMDb, IQ10K, MDL |
| 37 | 蛮好的人生 · 蠻好的人生 | — | 2025 | CCTV-8 (+东方/北京卫视) | urban (insurance sales) | `D YH25 #18 11亿`; `D LT25 #8 14.61亿 (豆瓣 6.4)`; `E WB25 年度优秀作品`; `D CVB25 (mention) CCTV8 2.3%` | 3 | LT25, WB25, YH25 |
| 38 | 白月梵星 · 白月梵星 | Moonlight Mystique | 2025 | 爱奇艺 | xianxia romance | `C IMDb 7.8 (1.2K)`; `D YH25 #5`; `D MYP25 网络剧有效播放 #1 21.28亿` | 3 | IMDb, MYP25, YH25 |
| 39 | 北上 · 北上 | — | 2025 | CCTV-1 | Grand Canal family saga | `D CVB25 CCTV1 3.615% (CVB 有统计以来电视剧收视率第三)`; `D YH25 top20`; `E WB25 年度影视化文学IP` | 3 | CVB25, WB25, YH25 |
| 40 | 临江仙 · 臨江仙 | — | 2025 | 爱奇艺† | xianxia romance | `D YH25 top20`; `D MYP25 日冠次数最多网络剧 (24 次)`; `E WB25 年度大众喜爱作品` | 3 | MYP25, WB25, YH25 |
| 41 | 凡人修仙传（真人剧）· 凡人修仙傳 | A Record of a Mortal's Journey to Immortality† (live action) | 2025 | 优酷 / 浙江卫视 | xianxia | `D MYP25 网络剧有效播放 #3`; `D PH25 优酷热度 #4`; `E WB25 年度大众喜爱作品` (not the donghua — see §4) | 3 | MYP25, PH25, WB25 |
| 42 | 水龙吟 · 水龍吟 | Whispers of Fate | 2025 | 芒果TV / 湖南卫视 | wuxia mystery | `C IMDb 8.2 (1.9K)`; `D MYP25 网络剧有效播放 #2 18.32亿; 武侠剧双榜冠军`; `D PH25 芒果TV 2025 播放量 #1` | 3 | IMDb, MYP25, PH25 |
| 43 | 爱你† · 愛你 | The Best Thing | 2025 | 腾讯视频† | medical romance | `C IMDb 8.2 (1.8K)`; `C MDL #29 8.7`; `E MYH25 热度 #10` (Chinese↔English link from memory: Shen Xi Fan / He Su Ye plot) | 3 | IMDb, MDL, MYH25 |
| 44 | 早春晴朗 · 早春晴朗 | The Early Spring | 2026 | 优酷 (+Netflix) | workplace romance | `C IMDb 8.2 (2.2K)`; `D NF26 #2 (Aug 24–30, 2.4M / 21.5M h) and #2 (Aug 31–Sep 6, 3.2M / 45.7M h)`; `E WB26 年度影响力作品` | 3 | IMDb, NF26, WB26 |
| 45 | 漫长的季节 · 漫長的季節 | The Long Season | 2023 | 腾讯视频 | crime / family mystery | `C IMDb 8.8 (1.8K)`; `C DB23 #1 9.4 (120万+ ratings per douban snippet); 月度热搜` | 2 | DB23, IMDb |
| 46 | 三体 · 三體 | Three-Body | 2023 | CCTV-8 / 腾讯视频 | sci-fi | `C IMDb 7.6 (8.4K)`; `C DB23 #2 (8.7)` | 2 | DB23, IMDb |
| 47 | 玫瑰的故事 · 玫瑰的故事 | The Story of Rose† | 2024 | CCTV-8 / 腾讯视频 | urban / women's life | `D YH24 #5 22.9亿; 热播期集均 #5`; `D LT24 电视剧榜 #3 20.82亿; 都市剧冠军` | 2 | LT24, YH24 |
| 48 | 我的阿勒泰 · 我的阿勒泰 | To the Wonder | 2024 | CCTV-1 / 爱奇艺 | rural slice-of-life (Xinjiang) | `C MDL #22 8.8`; `C DB24 #2 (8.9); 月度热搜` | 2 | DB24, MDL |
| 49 | 凡人歌 · 凡人歌 | — | 2024 | CCTV-8 / 爱奇艺 / 腾讯 (拼播) | urban realism | `D YH24 #12 15.1亿`; `D LT24 都市剧 #3 15.75亿` | 2 | LT24, YH24 |
| 50 | 永夜星河 · 永夜星河 | Love Game in Eastern Fantasy | 2024 | 腾讯视频 | book-transmigration fantasy | `C IMDb 7.6 (1.6K)`; `D YH24 #14 13.4亿` | 2 | IMDb, YH24 |
| 51 | 在暴雪时分 · 在暴雪時分 | Amidst a Snowstorm of Love | 2024 | 腾讯视频 | sports romance | `C IMDb 7.9 (2.0K)`; `D YH24 #19 11.9亿` | 2 | IMDb, YH24 |
| 52 | 新生 · 新生 | — | 2024 | 优酷† | suspense (10 eps) | `D YH24 热播期集均 #6 4786万; V30 #5`; `D LT24 短剧集榜 #1 6.75亿; 悬疑集均 #2` | 2 | LT24, YH24 |
| 53 | 长风渡 · 長風渡 | Destined† | 2023 | 爱奇艺 | period romance | `D YH23 全网 top10`; `D IQ10K` | 2 | IQ10K, YH23 |
| 54 | 长月烬明 · 長月燼明 | Till the End of the Moon | 2023 | 优酷 | xianxia | `C IMDb 8.2 (5.6K)`; `C MDL #52 8.6`; `D YH23-x 云合 2023 全网累计 #3 (Youku PR, snippet)` | 2 | IMDb, MDL |
| 55 | 风吹半夏 · 風吹半夏 | Wild Bloom† | 2022 | 爱奇艺 / 浙江卫视† | 1990s business | `C DB22 #3`; `D IQ10K` | 2 | DB22, IQ10K |
| 56 | 人世间 · 人世間 | A Lifelong Journey† | 2022 | CCTV-1 / 爱奇艺 | family epic | `C DB22 #4 (8.1/21万 per qq snippet)`; `D IQ10K` | 2 | DB22, IQ10K |
| 57 | 异人之下（2023）/ 之决战！碧游村（2025）· 異人之下 | I Am Nobody | 2023 / 2025 | 优酷 | urban fantasy | `C MDL #46 8.6 (S1)`; `C DB25 #2 8.4 (碧游村)` | 2 | DB25, MDL |
| 58 | 无尽的尽头 · 無盡的盡頭 | — | 2025 | 江苏卫视 / 浙江卫视 / 优酷† | juvenile-justice crime | `C DB25 #1 8.6 (8.5 at publication)`; `E WB25 年度突破创新作品`; `D CVB25 (mention) 首播 1.1亿人次`; not in YH25 top20 (per news) | 2 | DB25, WB25 |
| 59 | 漂白 · 漂白 | — | 2025 | 爱奇艺 | crime | `D MYP25 剧集集均有效播放冠军 9579万`; `D IQ10K`; `D YH25H1 V30 #1 5490万 (snippet)` | 2 | IQ10K, MYP25 |
| 60 | 大生意人 · 大生意人 | — | 2025 | CCTV-8 (+东方卫视) | late-Qing business | `E MYH25 热度 #4`; `E WB26 年度品质作品`; `D CVB25 (mention) CCTV8 2.288%, 9.2亿人次` | 2 | MYH25, WB26 |
| 61 | 雁回时 · 雁回時 | — | 2025 | 腾讯视频 / 东方卫视 | period revenge romance | `D PH25 腾讯视频热度值 #2`; `E WB25 年度大众喜爱作品` | 2 | PH25, WB25 |
| 62 | 扫毒风暴 · 掃毒風暴 | — | 2025 | CCTV-8 / 腾讯 | anti-drug crime | `D CVB25 年度收视 top35`; `D PH25 腾讯视频热度值 #5` | 2 | CVB25, PH25 |
| 63 | 利剑·玫瑰 · 利劍·玫瑰 | — | 2025 | CCTV-8 | police | `D CVB25 top35`; `D PH25 腾讯视频热度值 #10` | 2 | CVB25, PH25 |
| 64 | 四喜 · 四喜 | — | 2025 | CCTV-1 | family | `D CVB25 年度收视 #17 2.356%`; `D PH25 腾讯视频热度值 #7` | 2 | CVB25, PH25 |
| 65 | 仁心俱乐部 · 仁心俱樂部 | — | 2025 | 湖南卫视 / 芒果TV | medical | `D PH25 芒果TV 播放量 #5`; `E WB25 年度大众喜爱作品` | 2 | PH25, WB25 |
| 66 | 归队 · 歸隊 | — | 2025 | CCTV-8 | post-war revolutionary | `D CVB25 CCTV8 2.008%, 频道内收视 #9`; `E WB25 年度品质作品` | 2 | CVB25, WB25 |
| 67 | 嫁金钗 · 嫁金釵 (inferred) | Where the Mask Ends | 2026 | 优酷 (+Netflix) | substitute-bride period romance | `C MDL #50 8.6`; `D NF26 #7 (Oct 12–18, 1.6M / 12.2M h)`. Chinese title inferred: Sina snippet says 嫁金钗 hit Netflix #7 with 160万 views 3 days after a 10-16 premiere; MDL synopsis matches | 2 | MDL, NF26 |
| 68 | 陈情令 · 陳情令 | The Untamed | 2019 | 腾讯视频 | xianxia (danmei adaptation) | `C IMDb 8.7 (17K)`; `C MDL #6 9.0 (68,813); Special Edition #12 8.9 (11,824)` | 2 | IMDb, MDL |
| 69 | 甄嬛传 · 甄嬛傳 | Empresses in the Palace | 2011 | 东方卫视† / 乐视 | palace intrigue | `C IMDb 8.5 (2.9K)`; `D YH24 2024 全网老剧有效播放 #1` | 2 | IMDb, YH24 |
| 70 | 西游记（86版）· 西遊記 | Journey to the West | 1986 (–2000) | CCTV | mythic adventure | `C IMDb 8.7 (2.1K)`; `D YH24 老剧 #4` | 2 | IMDb, YH24 |
| 71 | 三国演义（94版）· 三國演義 | The Romance of Three Kingdoms | 1994 | CCTV | historical epic | `C IMDb 8.7 (1.2K)`; `D YH24 老剧 #5` | 2 | IMDb, YH24 |
| 72 | 少年歌行 · 少年歌行 | The Blood of Youth | 2022 | 优酷 | wuxia | `C MDL #23 8.8`; `D YH24 老剧 #8` | 2 | MDL, YH24 |
| 73 | 白夜追凶 · 白夜追兇 | Day and Night | 2017 | 优酷 | crime (twins) | `C IMDb 8.1 (1.2K)`; `D YH24 集均破亿 club (2024-12-06)` | 2 | IMDb, YH24 |
| 74 | 龙岭迷窟 · 龍嶺迷窟 | Candle in the Tomb: The Worm Valley† | 2020 | 腾讯视频 | tomb-raiding adventure | `C DB20 #7`; `D YH24 集均破亿 club (2024-12-19)` | 2 | DB20, YH24 |
| 75 | 沉默的真相 · 沉默的真相 | The Long Night | 2020 | 爱奇艺 (迷雾剧场) | crime | `C IMDb 8.2 (1.3K)`; `C DB20 #2` | 2 | DB20, IMDb |
| 76 | 隐秘的角落 · 隱秘的角落 | The Bad Kids | 2020 | 爱奇艺 (迷雾剧场) | crime | `C IMDb 8.2 (1.9K)`; `C DB20 #3` | 2 | DB20, IMDb |
| 77 | 棋魂 · 棋魂 | Hikaru no Go | 2020 | 优酷 | Go / fantasy youth | `C MDL #37 8.6`; `C DB20 #6` | 2 | DB20, MDL |
| 78 | 当我飞奔向你 · 當我飛奔向你 | When I Fly Towards You | 2023 | 优酷 | school romance | `C MDL #2 9.0 (62,689)`; `C IMDb 8.5 (4.4K)` | 2 | IMDb, MDL |
| 79 | 偷偷藏不住 · 偷偷藏不住 | Hidden Love | 2023 | 优酷 | romance | `C MDL #4 9.0 (97,375)`; `C IMDb 8.6 (9.8K)`; `D YH23-x V30 4112万 (snippet)` | 2 | IMDb, MDL |
| 80 | 以家人之名 · 以家人之名 | Go Ahead | 2020 | 湖南卫视† / 芒果TV | found-family drama | `C MDL #15 8.8 (39,503)`; `C IMDb 8.5 (2.5K)` | 2 | IMDb, MDL |
| 81 | 山河令 · 山河令 | Word of Honor | 2021 | 优酷 | wuxia (danmei adaptation) | `C IMDb 8.3 (5.2K)`; `C MDL Epilogue #32 8.7` | 2 | IMDb, MDL |
| 82 | 三生三世十里桃花 · 三生三世十里桃花 | Eternal Love | 2017 | 东方/浙江卫视† | xianxia | `C IMDb 8.2 (3.8K)`; `C MDL #30 8.7` | 2 | IMDb, MDL |
| 83 | 你是我的荣耀 · 你是我的榮耀 | You Are My Glory | 2021 | 腾讯视频 | esports romance | `C IMDb 8.1 (3.3K)`; `C MDL #36 8.6` | 2 | IMDb, MDL |
| 84 | 长歌行 · 長歌行 | The Long Ballad | 2021 | 腾讯视频 | Tang period | `C IMDb 8.0 (2.3K)`; `C MDL #53 8.6` | 2 | IMDb, MDL |
| 85 | 天下第一† · 天下第一 | Who Rules the World | 2022 | 腾讯视频† | wuxia romance | `C IMDb 8.1 (3.2K)`; `C MDL #43 8.6` | 2 | IMDb, MDL |
| 86 | 点燃我，温暖你 · 點燃我，溫暖你 | Lighter & Princess | 2022 | 优酷 | campus romance | `C IMDb 8.2 (2.3K)`; `C MDL #44 8.6` | 2 | IMDb, MDL |
| 87 | 琉璃 · 琉璃 | Love and Redemption | 2020 | 优酷 | xianxia | `C IMDb 7.9 (2.8K)`; `C MDL #45 8.6` | 2 | IMDb, MDL |
| 88 | 你微笑时很美 · 你微笑時很美 | Falling Into Your Smile | 2021 | 腾讯视频† | esports romance | `C IMDb 8.0 (5.7K)`; `C MDL #54 8.6` | 2 | IMDb, MDL |
| 89 | 入青云† · 入青雲 | Love in the Clouds | 2025 | 腾讯视频† | fantasy romance | `C IMDb 8.3 (1.9K)`; `C MDL #17 8.8 (29,506)` | 2 | IMDb, MDL |
| 90 | 与晋长安† · 與晉長安 | Legend of the Female General | 2025 | 腾讯视频† | cross-dressing general | `C IMDb 8.1 (1.8K)`; `C MDL #51 8.6` | 2 | IMDb, MDL |
| 91 | 一笑随歌† · 一笑隨歌 | Fated Hearts | 2025 | 腾讯视频† | war romance | `C IMDb 8.1 (1.1K)`; `C MDL #33 8.7` | 2 | IMDb, MDL |
| 92 | —（Chinese title not in sources） | Love Between Lines | 2026 | — | murder-mystery-game romance | `C IMDb 8.3 (1.2K)`; `C MDL #27 8.7` | 2 | IMDb, MDL |
| 93 | 觉醒年代 · 覺醒年代 | The Age of Awakening† | 2021 | CCTV-1 / 爱奇艺† | revolutionary history | `C DB21 #1 (9.3 per snippet)` | 1 | DB21 |
| 94 | 山海情 · 山海情 | Minning Town† | 2021 | 多卫视 / 腾讯 / 爱奇艺† | poverty-alleviation drama | `C DB21 #2 (9.2 per snippet)` | 1 | DB21 |
| 95 | 功勋 · 功勳 | Medal of the Republic† | 2021 | CCTV-1† | biographical anthology | `C DB21 #3 (9.1 per snippet)` | 1 | DB21 |
| 96 | 大江大河（2 / 之岁月如歌）· 大江大河 | Like a Flowing River† | 2020 / 2024 | 东方卫视† / CCTV-1 | reform-era saga | `C DB21 #4 (S2, 8.8 per snippet)`; `D CSM24 #5 1.17 (snippet, S3)` | 1 | DB21 |
| 97 | 爱很美味 / 终极笔记 / 我在他乡挺好的 / 御赐小仵作 / 叛逆者 / 风声 | — / Ultimate Note† / Remembrance of Things Past† / The Imperial Coroner† / The Rebel† / The Message† | 2021 | various | various | `C DB21 #5 / #6 / #7 / #8 / #9 / #10` (6 separate shows, 1 key each) | 1 each | DB21 |
| 98 | 警察荣誉 · 警察榮譽 | Ordinary Greatness† | 2022 | 爱奇艺 / 北京卫视† | police | `C DB22 #1` | 1 | DB22 |
| 99 | 风起陇西 / 梦华录 / 对手 | The Wind Blows from Longxi† / A Dream of Splendor† / Rivals† | 2022 | various | spy / period / spy | `C DB22 #5 / #6 / #10` (3 shows) | 1 each | DB22 |
| 100 | 不良执念清除师 / 古相思曲 / 繁城之下 | — / — / Ripe Town† | 2023 | 腾讯 / 哔哩哔哩 / 爱奇艺† | fantasy-comedy / time-travel romance / Ming mystery | `C DB23 #4 / #9 / #10` (3 shows; 古相思曲 = Bilibili per phb123 snippet) | 1 each | DB23 |
| 101 | 山花烂漫时 · 山花爛漫時 | — (Zhang Guimei biopic) | 2024 | CCTV-1 / 爱奇艺† | biographical (education) | `C DB24 #1 9.6/17万+`; `D CSM24 #17 0.98 (snippet)`; 云合 V30 only 737万 per news | 1 | DB24 |
| 102 | 问苍茫 / 天行健 / 日光之城 | — | 2024 | CCTV-1 / … | revolutionary / wuxia / Tibet slice-of-life | `C DB24 #3 / #6 (8.8) / #7 (8.5)` (3 shows) | 1 each | DB24 |
| 103 | 沙尘暴 / 鹊刀门传奇 第二季 / 沉默的荣耀 | — | 2025 | 优酷 / … / CCTV-8 | noir crime / wuxia comedy / espionage | `C DB25 #5 8.1 / #6 8.2 / #9 8.0`; 沉默的荣耀 `D CVB25 (mention) "年度爆款" 首播 9.6亿人次` | 1 each | DB25 |
| 104 | 南来北往 · 南來北往 | — | 2024 | CCTV-8 / 爱奇艺 | railway police, period | `D YH24 #7 19.7亿; 热播期集均 #10` | 1 | YH24 |
| 105 | 承欢记 / 城中之城 / 你比星光美丽 / 花间令 / 三大队 / 猎冰 / 九部的检察官 | — | 2024 | various | various | `D YH24 #11 / #13 / #16 / #17 / #18 / 热播期集均 #7 / 热播期集均 #20` (7 shows) | 1 each | YH24 |
| 106 | 一生一世 · 一生一世 | — | 2021 | 腾讯视频† | romance | `D YH24 集均破亿 club (2024-11-16)` | 1 | YH24 |
| 107 | 向风而行 / 云襄传 | Flight to You† / The Ingenious One† | 2023 | 爱奇艺 | aviation romance / wuxia | `D YH23 全网 top10 (iQIYI list)` (2 shows) | 1 each | YH23 |
| 108 | 赘婿 / 罚罪 | My Heroic Husband† / Crime Crackdown† | 2021 / 2022 | 爱奇艺 | time-travel comedy / anti-gang | `D IQ10K` | 1 each | IQ10K |
| 109 | 雪迷宫 / 少年白马醉春风 | — | 2024 | various | crime / wuxia | `D LT24 悬疑剧 #3 15.38亿` / `D LT24 武侠剧播放冠军` | 1 each | LT24 |
| 110 | 长安二十四计 / 老舅 / 锦月如歌 | — | 2025 | various | period / comedy / period | `E MYH25 热度 #5 / #7 / #9` | 1 each | MYH25 |
| 111 | 似锦 / 我的后半生 | — | 2025 | 腾讯 / CCTV-8 | period / senior romance | `D PH25 腾讯视频热度值 #6 / #16` | 1 each | PH25 |
| 112 | 绝密较量 · 絕密較量 | — | 2025 | CCTV-1 | national security | `D CVB25 年度收视 #2 3.743%` | 1 | CVB25 |
| 113 | 驻站 / 青山是故乡 / 淬火年代 / 护宝寻踪 | — | 2025 | CCTV-8 / CCTV-1 ×3 | rural police / rural revitalization / manufacturing / heritage | `D CVB25 #4 3.381% / #5 3.155% / #6 3.030% / #8 3.023%` | 1 each | CVB25 |
| 114 | 我们的河山 / 浴血荣光 / 阵地 | — | 2025 | CCTV-1 | WWII anniversary dramas | `D CVB25 top10: 3.029% / 2.956% / 2.847%` | 1 each | CVB25 |
| 115 | 红石榴餐厅 / 乌蒙深处 / 灿烂的风和海 / 大河之水 | — | 2025 | CCTV-1 ×3 / CCTV-8 | Xinjiang / rural / Macau / — | `D CVB25 #11 / #12 / #13 / #24` | 1 each | CVB25 |
| 116 | 余生有涯 / 潜渊 | — | 2025 | 东方卫视 / 湖南卫视 | — / revolutionary | `D CVB25 地方卫视首播剧收视 #1 (上海本地 4.762%) / #2` | 1 each | CVB25 |
| 117 | 刑警的日子 / 黄雀 / 借命而生 / 枫桥警事 / 棋士 | — | 2025 | CCTV-8 | crime | `D CVB25 年度收视 top35` | 1 each | CVB25 |
| 118 | 无可替代 · 無可替代 | Irreplaceable | 2026 | 优酷 / CCTV-8 (+Netflix) | consulting workplace | `D NF26 #7 (Sep 28–Oct 4, 2.0M / 17.1M h)` | 1 | NF26 |
| 119 | 主角 · 主角 | — | 2026 | — | (Qinqiang opera saga — from memory) | `E WB26 年度电视剧 + 媒体选择荣耀` | 1 | WB26 |
| 120 | 兰香如故 / 生命树 / 太平年 | — | 2026 | — | — / Hoh Xil conservation / Five Dynasties history | `E WB26 年度影响力作品` | 1 each | WB26 |
| 121 | 反人类暴行 / 交锋 / 醒来 / 危险关系 | — | 2025–26 | 优酷 (反人类暴行) / … | WWII atrocity / — / — / — | `E WB26 年度品质作品`; 反人类暴行 `D CVB25 (mention) 首周豆瓣 8.7` | 1 each | WB26 |
| 122 | 纯真年代的爱情 / 九门 / 骄阳似我 / 野狗骨头 | — | 2026 | — | — | `E WB26 年度优秀作品`; 九门 also DB25 期待榜 (Douban 6.6, not counted) | 1 each | WB26 |
| 123 | 蝉 / 低智商犯罪 / 后西游记 / 家业 / 年少有为 / 大哥小助理 | — | 2026 | — | — | `E WB26 年度突破创新作品` | 1 each | WB26 |
| 124 | 百花杀 / 蜜语纪 / 南部档案 / 翘楚 / 月鳞绮纪 / 耀眼 | — | 2026 | — | — | `E WB26 年度大众喜爱作品`; 翘楚 also NF-news (snippet); 月鳞绮纪 DB25 期待榜 5.4 (not counted) | 1 each | WB26 |
| 125 | 无忧渡 / 朝雪录 / 深情眼 / 灼灼韶华 / 180天重启计划 | — | 2025 | various | — | `E WB25 年度优秀作品 (无忧渡, 朝雪录) / 大众喜爱 (深情眼) / 品质 (灼灼韶华) / 突破创新 (180天重启计划)`; 灼灼韶华 `D CVB25 (mention) CCTV8 2.610%` | 1 each | WB25 |
| 126 | 流星花园（2018）· 流星花園 | Meteor Garden | 2018 | 湖南卫视 / 芒果TV† | school romance (remake) | `C IMDb 7.8 (6.4K)` | 1 | IMDb |
| 127 | 斗罗大陆 · 鬥羅大陸 | Douluo Continent | 2021 | 腾讯视频† | fantasy (live action) | `C IMDb 8.0 (5.6K)` | 1 | IMDb |
| 128 | 逆爱† · 逆愛 | Revenged Love | 2025 | — | BL romance | `C IMDb 8.4 (5.4K)` | 1 | IMDb |
| 129 | 玉骨遥 · 玉骨遙 | The Longest Promise | 2023 | 腾讯视频 | fantasy romance | `C IMDb 7.8 (5.9K)` | 1 | IMDb |
| 130 | 致我们暖暖的小时光 · 致我們暖暖的小時光 | Put Your Head on My Shoulder | 2019 | 腾讯视频† | campus romance | `C IMDb 7.9 (4.5K)` | 1 | IMDb |
| 131 | 狼殿下 · 狼殿下 | The Wolf | 2020 | 优酷† | period fantasy | `C IMDb 7.7 (4.5K)` | 1 | IMDb |
| 132 | 微微一笑很倾城 · 微微一笑很傾城 | Love O2O | 2016 | 东方/江苏卫视† | gaming romance | `C IMDb 7.6 (4.4K)` | 1 | IMDb |
| 133 | 香蜜沉沉烬如霜 · 香蜜沉沉燼如霜 | Ashes of Love | 2018 | 江苏卫视 / 优酷† | xianxia | `C IMDb 7.9 (4.1K)` | 1 | IMDb |
| 134 | 骄阳伴我 · 驕陽伴我 | Sunshine by My Side | 2023 | 爱奇艺† | urban romance | `C IMDb 7.8 (3.7K)` | 1 | IMDb |
| 135 | 外星女生柴小七 · 外星女生柴小七 | My Girlfriend Is an Alien | 2019 | 腾讯视频† | sci-fi rom-com | `C IMDb 8.1 (3.3K)` | 1 | IMDb |
| 136 | 王牌部队 · 王牌部隊 | Ace Troops | 2021 | 江苏卫视 / 优酷† | military | `C IMDb 8.1 (3.0K)` | 1 | IMDb |
| 137 | 我的人间烟火 · 我的人間煙火 | Fireworks of My Heart | 2023 | 芒果TV† | firefighter romance | `C IMDb 8.0 (2.9K)` | 1 | IMDb |
| 138 | 余生，请多指教 · 餘生，請多指教 | The Oath of Love | 2022 | 腾讯视频 / 湖南卫视† | medical romance | `C IMDb 7.7 (2.7K)` | 1 | IMDb |
| 139 | 上瘾 · 上癮 | Addicted | 2016 | web (pulled)† | BL school | `C IMDb 8.1 (2.5K)` | 1 | IMDb |
| 140 | 半是蜜糖半是伤 / 致我们单纯的小美好 / 天盛长歌 / 三国（2010） | Love Is Sweet / A Love So Beautiful / The Rise of Phoenixes / Three Kingdoms | 2020 / 2017 / 2018 / 2010 | various† | rom-com / campus / period / historical | `C IMDb 8.0 (2.4K) / 7.9 (2.4K) / 8.4 (2.0K) / 8.3 (1.6K)` | 1 each | IMDb |
| 141 | 全职高手 / 楚乔传 / 传闻中的陈芊芊 / 暗河传† / 三生三世枕上书 / 锦绣未央 / 如懿传 / 烈火军校 / 理智派生活 / 你给我的喜欢 / 云之羽 / 贺先生的恋恋不忘 / 我的小确幸 / 良辰美景好时光 / 护心 / 五福临门† | The King's Avatar / Princess Agents / The Romance of Tiger and Rose / Blood River / Eternal Love of Dream / The Princess Weiyoung / Ruyi's Royal Love in the Palace / Arsenal Military Academy / The Rational Life / The Love You Give Me / My Journey to You / Unforgettable Love / My Little Happiness / Love Scenery / Back from the Brink / Perfect Match | 2016–2025 | various† | various | `C IMDb 7.6–8.2, 1.0K–2.0K votes` (see §1 list; one key each) | 1 each | IMDb |
| 142 | MDL-only, Chinese title not verified | The Spirealm (死亡万花筒†, 2024, MDL #10 8.9, 7,903); Twelve Letters (2025, #18 8.8, 7,997); Against the Current (2026, #21 8.8); Love Story in the 1970s (2026, #25 8.7); Always Home (2025, #39 8.6); Coroner's Diary (2025, #47 8.6); When Destiny Brings the Demon (2025, #48 8.6); One and Only (2021, #56 8.5); Sword Snow Stride (雪中悍刀行†, 2021, #58 8.5); Fangs of Fortune (大梦归离†, 2024, #59 8.5) | — | — | — | `C MDL` | 1 each | MDL |
| 143 | IMDb-only, Chinese title not verified | The Youth Memories (2023, 8.5/5.4K); Whispers… (merged into 水龙吟 #42); Speed and Love (2025, 7.8/1.4K); ABO Desire (2025, 7.8/3.2K); Shine on Me (2025–26, 7.6/1.2K); Stay with Me (2023, 8.5/1.2K — origin uncertain, may not be mainland) | — | — | — | `C IMDb` | 1 each | IMDb |

## 4. Excluded on purpose (found in the sources, not mainland scripted live-action)

- **Taiwan productions** in Douban 华语剧集 lists: 想见你 (DB20 #1), 她和她的她 (DB22 #2), 有生之年 (DB23 #5), 八尺门的辩护人 (DB23 #6), 不够善良的我们 (DB24 #8), 我们与恶的距离2 (DB25 #3, 8.4), 忘了我记得 (DB25 #4, 8.3); 俗女养成记2 (TW, 2021 Top-20 snippet). These belong in a Taiwan round.
- **Hong Kong**: 叹息桥 (TVB, DB20 #5); 四海中医 (DB25 纪录剧集, HK-tagged). YH24 notes TVB "经典港剧" library deals — not counted.
- **Donghua / animation**: 凡人修仙传：外海风云, 仙逆, 灵笼 第二季, 斗破苍穹 年番, 吞噬星空, 剑来, 茶啊二中 (Douban/灯塔 animation lists). The 2025 **live-action** 凡人修仙传 is kept (row 41).
- **Variety / reality / documentary**: Douban 最受关注综艺 (花儿与少年·同心季 etc.), 灯塔/猫眼 综艺 lists, WB25/WB26 variety honours (奔跑吧, 歌手, 乘风, 现在就出发 …), CVB/豆瓣 纪录剧集 (闪闪的儿科医生, 但是还有书籍 …).
- **微短剧 / short-form**: Douban 2025 评分最高大陆微短剧 (家里家外 7.9, 今人不见古时玥, 冒姓琅琊, 盛夏芬德拉, 以她之韧); WB25/WB26 优秀微剧/短剧 honours. Note LT24 "短剧集榜" (新生, 不可告人, 黑土无言) is 10–18-episode long-form — kept.
- **Films**: Douban 华语电影 lists (南京照相馆, 哪吒之魔童闹海, 长安的荔枝 …), 得闲谨制 (月度热搜).
- **Non-Chinese rows in IMDb country=CN**: Planet Earth II, Blue Planet II, Seven Worlds One Planet, The Green Planet, Dynasties, The Planets (BBC co-pros); Beijing 2008 Olympics coverage; Spellbinder: Land of the Dragon Lord (1997, AU/PL); Marco Polo (1982, IT); My Stand-In (2024, Thai BL); My Roommate Is a Gumiho (2021, KR).
- **Snippet-only aggregators not used**: bang.cn / maigoo "收视率排行榜" pages (mixed sources, unverifiable).

## 5. Caveats

- **Same-family double counting.** Collapse to families before ranking by independence: Douban (DB20–25), 云合 (YH23/24/25), 灯塔 (LT24/25), 猫眼 (MYP25 play + MYH25 heat), NRTA/CVB TV ratings (CVB25), platform in-house heat (PH25 + IQ10K — PH25 is quoted inside the CVB25 document but measures platform heat, not TV ratings), Netflix (NF26), Weibo (WB25/26), IMDb, MDL. On that basis: 唐朝诡事录 = 6 families (Douban, 云合, 灯塔, 猫眼, platform heat, Weibo); 藏海传 = 7 (IMDb, Douban, 云合, 灯塔, 猫眼, platform heat, Weibo); 大奉打更人 = 6 (IMDb, MDL, 云合, 灯塔, 猫眼, Weibo); 生万物 = 5; 国色芳华 = 6 (MDL, Douban, 灯塔, 猫眼, platform heat, Weibo); 庆余年 = 5 (IMDb, MDL, Douban, 云合, 灯塔); 六姊妹 = 5 (CVB, platform heat, 云合, 灯塔, Weibo); 苍兰诀 = 5 (IMDb, MDL, Douban, 云合, platform heat).
- **Year-coverage bias in D/E.** Only 2024 (云合 full PDF, 灯塔) and 2025 (云合 partial, 灯塔, 猫眼, CVB, Weibo) are well covered; 2023 云合 is iQIYI-PR partial; 2016–2022 D data is essentially absent (only via YH24 old-drama / 集均破亿 lists and IQ10K). 2026 titles only have Netflix weekly + WB26 (annual lists not out yet). This tilts counts toward 2024–2025 shows; absence ≠ low viewing (e.g. 人世间, 开端, 梦华录, 苍兰诀 2022 have no annual D list read).
- **Douban annual lists**: ranking is "评分、人数、时间综合考虑", not pure score; 2020–2024 read via news reposts (official pages are JS-rendered and blocked); DB25 scores are the live values at read time (Nov 2026), not list-time values. DB21 is a mainland-only list as reported by Tencent News; the official 2021 list mixed in Taiwan titles (snippet: 俗女养成记2 #2 in a 2021 华语剧集 Top-20 from Sina). Douban all-time lists unread (403).
- **Douban vs international ratings diverge sharply** for 古偶 hits: 逐玉 MDL #1 9.1 / IMDb 8.7 vs Douban 6.4; 大奉打更人 Douban 5.6, 六姊妹 5.7, 许我耀眼 6.5 (all from LT25 article). Use C tags per platform, not as a single "quality" score.
- **云合 vs 灯塔 vs 猫眼 numbers differ** for the same show (e.g. 藏海传 22.3亿 云合 / 28.75亿 灯塔 / 23.51亿 猫眼; 庆余年2 45.1亿 云合 / 35.58亿 灯塔) — different de-duplication and windows. YH24 霸屏榜 window = 2023-12-16 → 2024-12-31 上新剧. 灯塔 2024 splits 电视剧 (TV-aired) vs 网络剧 (web-only) lists.
- **YH25 is partial**: the news article prints ranks 1–5 and 18 only; 北上, 临江仙, 难哄, 六姊妹, 以法之名 are "in top 20" without rank. The full 30-page PDF sits behind a WeChat account.
- **MYH25 ranks 3–10** are the listed order in a 羊城晚报 repost; only #1–2 are labelled in the text read.
- **CVB25 counting rule**: counted only where the NRTA report prints an annual rank (or "top10 / top35 / 地方卫视首播 #1–2 / 频道内 #9"); rating figures without a rank are shown as "(mention)" and not counted. CVB is national cable/IPTV big-data, CCTV-1 structurally rates higher than satellite channels; 北上's "有统计以来第三" is a since-2018 all-time rank, not the 2025 annual rank.
- **CSM24 (CSM全国网 2024 TOP20)** seen only in a Douban-group snippet (403 on read) — shown, not counted. CVB 2024 annual report not located; 酷云 / 骨朵 annual not attempted.
- **IQ10K** is iQIYI's own heat metric (Tencent uses a 30,000 threshold, Youku 10,000 with different math — news notes weak correlation with 云合 V30). Only the iQIYI club is used; list frozen at April 2025 (later entrants such as 生万物 not captured — it appears via PH25 instead).
- **Netflix**: mainland dramas only began appearing on the global non-English weekly chart in 2026 (逐玉 reported as the first). Only six weeks were read, chosen from news leads; 翘楚's week not read. No Chinese title in the all-time non-English top 10. Netflix What-We-Watched engagement reports were not parsed for Chinese titles.
- **IMDb country=CN** returns many co-productions/foreign titles (dropped) and most mainland drama vote counts are 1–10K; only 藏海传 (24K) and 陈情令 (17K) exceed 10K. Votes skew to romance/xianxia/BL titles watched abroad via Viki/WeTV/iQIYI International.
- **MDL** strongly favours 古偶 / 现偶 / danmei adaptations; ratings counts #1–20 range 6,498 (Joy of Life S2) to 97,375 (Hidden Love). Ranks 21–59 have no counts.
- **Weibo 视界大会** honours are marketing-platform awards (user recommendation votes + media panel, 3.8亿 推荐值 in 2026); many parallel honour tiers, unranked. Treat as buzz, not quality.
- **Titles/years/networks**: everything marked † and all years/platforms not printed in a source need checking at fact-sheet stage; Chinese↔English mapping is from memory for most IMDb/MDL-only rows (rows 43, 67, 85, 89–91, 128, 141–143 flagged lowest confidence). Traditional-character forms are my conversions.

## 6. toolDegradation

| Step | Tool tried | Result | Fallback used |
|---|---|---|---|
| IMDb advanced search (CN) | Exa web_fetch_exa (first, per jp/kr experience that Groundlane returns JS shell) | read | — |
| MDL list + ratings counts | Groundlane web_fetch (text) + web_extract (selector for links, pattern `scored by N users`) | ok, 20/20 counts | — |
| Douban 2025 annual page | Exa web_fetch_exa | read (rendered) | — |
| Douban 2024 / 2023 annual pages | Exa (CRAWL_EMPTY_CONTENT); Groundlane browser render (js_empty_document) | failed | news reposts (Tencent News, Sina, Sohu) — read |
| Douban 2021 archive (archive.ph) | Groundlane web_fetch | denied by session auto-mode classifier | Tencent News mainland-only list |
| Douban group CSM page | Groundlane (HTTP 403), Exa (CRAWL_HTTP_403) | failed | search snippet only (not counted) |
| 云合 2024 annual PDF | jina read_url (question mode needs API key → returned full content) | read | — |
| 云合 2025 annual | Groundlane on Sohu summary | summary only (PDF behind WeChat) | Tencent News secondary — partial |
| NRTA CVB 2025 report | Groundlane web_fetch | read | — |
| Netflix Tudum (all-time + 6 weekly pages) | Exa web_fetch_exa | read | — |
| Weibo 视界大会 2025/2026, 灯塔, 猫眼, iQIYI | Groundlane web_fetch on news/official reposts | read | — |
| Search | Groundlane web_search (Brave + You.com; Tavily/Exa providers inside Groundlane often "unavailable"); Exa web_search_exa for Netflix news | ok | — |
| Tavily / Firecrawl | not needed (Groundlane/Exa/jina covered all reads) | — | — |
| Terminal curl | not attempted (blocked per brief) | — | MCP tools only |
