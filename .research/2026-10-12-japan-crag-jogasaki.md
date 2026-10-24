# 研究筆記：城ヶ崎（Jogasaki）

文章：`src/content/posts/climbing/2026-10-12-japan-crag-jogasaki.md`、`-en.md`（原發 2026-10-12；2026-10-24 參照〈城山〉改版）。審稿紀錄：`.work/reviews/2026-10-12-japan-crag-jogasaki.md`。三個 subagent 的原始輸出（路線合併表 264 條、31 篇攀登紀錄、約 45 支影片、170 題抱石）存在 `.research/2026-10-24-jogasaki-raw-agent-notes.md`。

toolDegradation（2026-10-24）：Groundlane MCP 未連線、直接 HTTP 回 401 → Keenable keyless 搜尋（參數 `query`）＋ Exa web_fetch ＋ curl；theCrag、ROCKTOPO 直接 curl 回 403 → Exa（theCrag、ROCKTOPO 905／903／904／422／418）與 Wayback 快照（ROCKTOPO 415／414／419／423／1883／413，445 與 1682 只有 2020 年快照）；YouTube 用 yt-dlp 取 metadata 與說明欄，未逐支觀看。

## Sources opened

- ROCKTOPO 城ヶ崎 https://www.rocktopo.net/areas/9: 494 條，抱石 128、リード（フェイス）105、リード（クラック）255、マルチ 6; 運攀低於 5.10a 的 4 條; 人気の課題 パープルシャドウ 5.8、ピーターパン 5.10b、風に吹かれて 5.11a、エアーダンス 5.12a、シンデレラボーイ 5.13a/b; シーズン 1–4 月、12 月
- ROCKTOPO シーサイド・サンセット（Wayback 2026-05-15） https://web.archive.org/web/20260515053727/https://www.rocktopo.net/rocks/415: 運攀 33、裂隙 7、多段 1，E5 M18 H18; ピーターパン 23 人、タイトボーイ 25 人、海賊フック 24 人、ホワイトシャーク 23 人、風に吹かれて 31 人; ダイナマイトボンボン、ローラーコースター、お子様ランチ、キャデラックランチ 標「登攀不可」; エアーダンス「プリクリ推奨」
- ROCKTOPO シーサイド・サンライズ https://www.rocktopo.net/rocks/905: 運攀 11、裂隙 18，E6 M15 H8; 人氣 プレッシャー 5.11b
- ROCKTOPO ファミリークラック https://www.rocktopo.net/rocks/903: 運攀 3、裂隙 16，E14 M5 H0; 人氣 アンクルクラック 5.9、ファザー・クラック 5.10b; ベイビー 14 人、アンクル 15 人、シスター 12 人、サム 10 人
- ROCKTOPO 浮山橋 https://www.rocktopo.net/rocks/904: 裂隙 15，E1 M6 H8; トラベルチャンス 危険度 PD
- ROCKTOPO 日蓮崎南面 https://www.rocktopo.net/rocks/422: 裂隙 4，E1 M3 H0; 「10台～11aまでの面白いルートがそろっており中級者に丁度いい」
- ROCKTOPO フナムシ・ロック（Wayback 2026-05-19） https://web.archive.org/web/20260519045318/https://www.rocktopo.net/rocks/414: 運攀 3、裂隙 11，E12 M1 H1; 「クラック初心者には良いエリア」; パープルシャドウ 11 人、純 8 人、鬼ごろし 8 人
- ROCKTOPO あかねの浜（Wayback 2026-04-10） https://web.archive.org/web/20260410161430/https://www.rocktopo.net/rocks/419: 運攀 1、裂隙 23，E13 M7 H4; 人氣 ライト・レイン 5.8、ホタテクラック 5.10b/c、ゴミステーション 5.11c
- theCrag Jogasaki https://www.thecrag.com/en/climbing/japan/jogasaki: 180 條、274 次攀登紀錄; 「most is very exposed to the salt of the sea」; 「the colder months of the year are preferred」
- theCrag Sunset Area https://www.thecrag.com/en/climbing/japan/jogasaki/area/405458208: 40 條、109 次紀錄; 「All day sun」; 垂降後面海左轉; 各路線星等、長度與 bolt 數（2026-10-24 主線程以 Exa 重開核對）
- theCrag Sunrise Area https://www.thecrag.com/en/climbing/japan/jogasaki/area/314369763: 23 條、12 次紀錄; 同一垂降點面海右轉; コロッサス 5.13a R ★★★ 3 bolts
- theCrag Ukiyama Bashi https://www.thecrag.com/en/climbing/japan/jogasaki/area/314603394: 16 條、5 次紀錄; 「high concentration of quality climbs」; 「There is no real top rope potential」; スコーピオン ★★★「Climbing is very 3D」
- theCrag Astrodome https://www.thecrag.com/en/climbing/japan/jogasaki/area/407060370: 17 條; サムライ 5.13b、炎のメリーゴーラウンド 5.13c、Venue 5.13d、ピュアブレス「5.14b?」
- Mountain Project Jogasaki https://www.mountainproject.com/area/107001454/jogasaki: 44 條; 「In the last few years many routes are now TR only」
- Mountain Project Classics https://www.mountainproject.com/area/classics/107001454/jogasaki: 經典只有 Peter Pan 與 Early Times
- Mountain Project Peter Pan https://www.mountainproject.com/route/118322910/peter-pan: Sport 20 m; 2.3★（4 票）
- Mountain Project Early Times https://www.mountainproject.com/route/109919367/early-times: Trad 5.10b/c; 「the crux felt distinctly harder」; cam 到 #3
- 城ヶ崎ボルダーガイド https://jogasaki.bouldering-guide.com/: 7 エリア 79 岩 170 課題; 初段 30、1 級 23、二段 14、三段以上 5; 抱石區附近沒有廁所
- 城ヶ崎ボルダーガイド人気ランキング https://jogasaki.bouldering-guide.com/ranking/: 1 モンスターマン 初段、2 大島日和 5 級、3 クロノポリス 初段、4 サティアグラハ 四段、5 モンスターママ 二段
- 城ヶ崎ボルダーガイド潮風 https://jogasaki.bouldering-guide.com/kosaitsuna/shiokaze/: 潮風 初段 2026-02-14 腳點斷掉
- JFA 注意喚起 静岡県・城ヶ崎 https://freeclimb.jp/access/6859/: 2022-04-15 伊東市觀光課聯絡 JFA; 市府沒有公認城ヶ崎的攀岩，不能直接呼籲或立牌; 市府目前不考慮禁止攀登，「事故が頻発するようであれば検討せざるを得ない」
- JFA テント泊 https://freeclimb.jp/access/10179/: 2025-03-29 有人在城ヶ崎停車場搭帳; 「伊豆では、テント泊は指定地区以外は禁止」，仿效者可能導致停車場或岩場封閉
- JFA ホールド欠損 https://freeclimb.jp/access/10085/: 2024-12-09 鬼火SD 三段關鍵手點斷掉，出現稍差的新點
- JFA マザークラック https://freeclimb.jp/access/6823/: 2022-03-10 マザークラック 終點附近有鬆動的大點
- JFA リボルト実績 https://freeclimb.jp/activities/environment/rebolt-achievement/: 城ヶ崎換栓只有 2007-12-01 兩筆，「ファミリークラック・エリア（日蓮崎南面）」イヴ、インディアンドール，換成 FIXEリング付きハンガー（附環掛片）; 2023～2026 年沒有換栓或封閉公告
- 氣象廳潮位表 伊東 https://www.data.jma.go.jp/kaiyou/db/tide/suisan/suisan.php?stn=Z3: 測站在伊東市富戸; 天文潮預報
- 海上保安庁 118番 https://www.kaiho.mlit.go.jp/doc/tel118.html: 海上事件事故通報; 「いつ・どこで・何があった」
- 伊豆半島ジオパーク 門脇埼 https://izugeopark.org/geosites/kadowakizaki/: 崖會崩、崖下注意落石（Exa 摘要）
- 山と溪谷社 日本100岩場 3 https://www.yamakei.co.jp/products/2812180860%20.html: 北山真 編，2012-04-20，208 頁; 「日本を代表するシークリフ・城ヶ崎」
- 山と溪谷社 日本100岩場 3 電子版 https://www.yamakei.co.jp/products/2815120448.html: 2016; 目次「51 東伊豆 城ヶ崎」
- 山と溪谷社 日本ボルダリングエリア 下 https://www.yamakei.co.jp/products/2814160170.html: 2014-10-17; 「新たに城ヶ崎のボルダーを追加」
- tkd0831 http://tkd0831.blog.fc2.com/blog-entry-597.html?sp: 2025-01-27; 「5.10は辛めだった」; タイトボーイ「11aだという意見が多かった」; ピーターパン 體感 5.10c
- nicecats 2023 https://nicecats.sakura.ne.jp/mountains/2023/230221.html: 2023-02-21; 風に吹かれて「5.10c、5.11a、5.11bとグレードが変わる」
- nicecats 2025 https://nicecats.sakura.ne.jp/mountains/2025/250218.html: 2025-02-18 寒流; 「岩はそれほど冷たくなく」; パープルシャドウ「とても5.8には見えません」
- H.Tohsaki https://note.com/htohsaki/n/nafb43bfa496a: 2023-03-28; 八幡野一本松駐車場走 10–15 分到垂降點; 爬回時掛自我確保、建議穿接近鞋
- kubo https://kuboclimbingta.com/2025/01/19/climbing_at_jyougasaki_seaside/: 2025-01-19; 自我確保樹「既に枯れており、かなり腐っていた」; ルーズガール 起頭裂隙要 cam
- Sugiyann https://note.com/sugiyann/n/n2d5cfd456171: 2026-02-12; 「スキルのない人は岩場にたどり着くことすら出来ない」; スプラッシュ「ビレイ点は波が来ていて」
- genter https://www.yamareco.com/modules/yamareco/detail-9255164.html: 2026-01/02; 入口「去年よりザレていて」; タランピオン＝タランチュラ＋スコーピオン; アイロンヘッド「ガバが多くて」
- きい山歩 https://kiisampo.com/jogasaki-toranoana-rp/: 2025-01-18; 「南向きのシーサイドはあまり北風も入らない」; 虎の穴 13 次完攀; パンピングアイアンⅠ「5.12b寄りという声も」
- 秀峰登高会 https://syuho.but.jp/?p=6556: 2025-03-01; コロッサス 18 天 49 次; 「ヘリのお世話になった人もいたらしい」; 4 月初「ヌメヌメで勝負にならなかった」
- 三峰山岳会 https://www.mitsumine.gr.jp/kaiho/363/jogasaki.html: 2020-02-19; 「落石が頻繁にある」; 「モタモタしていると罵声が飛ぶ」; ホワイトシャーク「簡単な部類」
- 好日山荘 2014 https://www.kojitusanso.jp/tozan-report/detail/?fm=10884: 2014-03-22; 「潮で壊れた終了点のビナ」; 中午後岩面變滑
- 無名山塾 https://www.sanjc-gijutsu.com/site/log/20260214_jougasaki/: 2026-02-14/15; 初孫「癒しのルート」; あかねの浜「瞬く間にロープが張られ」
- 岳樺クラブ 2024 https://dakekanba-club.com/2024/04/02/%E5%9F%8E%E3%83%B6%E5%B4%8E%E3%83%95%E3%83%8A%E3%83%A0%E3%82%B7%E3%83%AD%E3%83%83%E3%82%AF%E3%80%80%EF%BD%9E2024-03-31%EF%BD%9E/: 2024-03-31; パープルシャドウ「終日日陰」
- 大宮労山 https://oomiya-rozan.rdy.jp/blog/2025/01/11/jyougasaki/: 2025-01-11; フナムシロック 停車場「もう車がいっぱい」
- MuRa しりいだし https://blog.muraq.com/post/mt/crack_climbing/1408: 2025-02-08; 「腐食が心配なのでボルト3つとも使って確保」; 「根が張ってなくてグラつく」
- みろく山の会 https://npo.mirokuyamanokai.org/2024/12/25/73906: 2024-12-07; 富戸駅 9:10 → 岩場 9:30; 無名ルーフクラック 老手抓屋簷上的大點
- kameclimb https://kameclimb.blog/satyagraha-v12/: 2026-01-31; 「波浪がアップで登れないとサティアは戦えない」
- Stone Love https://stone-love.net/blog-entry-860/: 2024-02-11; こさいつな 主 slab「粉々に砕け散りました」
- Mickipedia https://micki-pedia.com/jogasaki-tako.html: 2019-01; タコ 1984 年初登、日本第一條 5.12 裂隙

## Dropped / not used

- tomo-guide.com、danmorris.com：沒有發文日期。
- tommy-climbing.com：curl 與 Exa 都只拿到未渲染的模板。
- Mountain Project「on the verge of getting banned」：只在搜尋摘要看到，沒有日期，未寫進正文的封閉判斷。
- CLIMBING-net 免費線上版 100岩場 topo：2017 年新聞稿之後的現況未確認。
- アストロドーム 與おとじろう 的 ROCKTOPO 路線表：只有 2020 年快照，進階表不列。
