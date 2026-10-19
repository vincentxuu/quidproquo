# Research notes: Domusnovas（Grotta di San Giovanni）＋Iglesiente 海崖多段（Masua）— 2026-10-19

工具：Groundlane MCP 與 jina MCP 都已斷線；搜尋用 Keenable keyless API（curl），讀頁用 r.jina.ai（curl）；climbingitaly.com 與 ARST 時刻表用 curl 直接抓再用腳本抽表。原始擷取存在 scratchpad/sard/。

## Sources opened

- climbingitaly.com（Climbing Sardinia 協會）：Domusnovas 區頁 https://climbingitaly.com/area/domusnovas/: 「one of the largest in Sardinia」，高速公路上看得到的高大石灰岩壁都有打錨; 25 個子區，從初學 slab 到極端外傾; 多數子區圍繞 800 m 長的天然隧道 Grotta di San Giovanni; 南口有 Arrampicantro（最簡單之一），停在教堂旁可走 30 分鐘到另外七個子區; 北口是 Bronx 與 Tana delle Tigri，「two of the hardest crags in Sardinia」; 到北口可以穿過洞走過去，或開車繞山跟著 Marganai 森林的路標; 北側有 15 個子區，含 Animal House、Ruota del Tempo; 1980 年代末由 Oviglia、Sarti、Lecis、Piras、Zurru 開始; Ruota del Tempo 1987 年 Oviglia 與 Conca 打; 兩年後開 Chinatown（含幾條多段）; 冬天去朝南的 Chinatown、Rifondazione Strapiombista、Arrampicantro、Cartoonia，晴天穿 T 恤也不奇怪; 夏天去背陰的 Ultima Catastrofe、Pollo Positivo（下午背陰）、Animal House、Technicolor、Tana delle Tigri、Bronx; 多段很少：Chinatown 幾條、Monte Acqua 3 條簡單的，全部朝南，夏天不能爬
- climbingitaly.com 子區路線表（2026-10-19 抓）: Bronx https://climbingitaly.com/sardegna/bronx/: 19 條、Overhanging、Shade all day、5 min、Climb all year; Marina Superstar 9a+ 30 m（2007）; Campo con corvi 9a 25 m（2007）; Oltretomba 8c 25 m; Agnostic front 8a 25 m（1997）; Frigobar 6c 20 m（1997）
- climbingitaly.com：Ruota del Tempo https://climbingitaly.com/sardegna/ruota-del-tempo/: 87 條、Vertical、Sun in the morning、5 min、Winter crag; Edolino 5c 15 m（1992）; Beethoven 6b+ 25 m（1987）; Le voglie di Marzia 6c+ 35 m（1993）; Rain man 7a 32 m（1992）; Modì 7a+ 35 m（1989）; Goblin 7c+ 35 m（1990）; Master mind 8a 40 m（1993）; Regalo per Mauri 8b+ 40 m（2004）
- climbingitaly.com：Tana delle Tigri https://climbingitaly.com/sardegna/tana-delle-tigri/: 32 條、Overhanging、Shade all day、25 min、Climb all year; Il tiranno dei mondi 8b 25 m（1998）; Wild Climb 8c 25 m
- climbingitaly.com：Arrampicantro https://climbingitaly.com/sardegna/arrampicantro/: 38 條、Leaning、Sun in the afternoon、10 min、Winter crag; Fanciobi 5a 20 m（2007）; Falki sekki 5b 20 m（1995）; Mabixedda 5c 25 m（2007）; Pastamatik 6a+ 20 m（1994）
- climbingitaly.com：Animal House https://climbingitaly.com/sardegna/animal-house/: 42 條、Overhanging、Sun in the morning、15 min、Summer crag; Fennec 6a+ 20 m（1999）; Gorillopoli 7b 25 m（1996）; Yeti 7c 20 m（1996）
- climbingitaly.com：Canneland https://climbingitaly.com/sardegna/canneland/: 43 條、Overhanging、Shade all day、5 min、Climb all year; Linea gotica 6c+ 30 m; Dobermann 7c 45 m
- climbingitaly.com：Chinatown https://climbingitaly.com/sardegna/chinatown/: 56 條、Vertical、Sun in the morning、25 min、Winter crag; Ombre cinesi 6b+ 70 m 多段（6b+、6c、6a，1989）; La banda dei 4 60 m 多段（6a+、6b+、6a）; Lanterne rosse 6c+ 50 m 多段（1992）; L'anno del serpente 6c 30 m（1989）
- climbingitaly.com：Pollo positivo https://climbingitaly.com/sardegna/pollo-positivo/: 25 條、Vertical、Sun in the morning、25 min; è facile 5b 15 m; Pinocchio 5c 15 m; Pollo positivo 7a 25 m
- climbingitaly.com：Ultima catastrofe https://climbingitaly.com/sardegna/ultima-catastrofe/: 11 條、Shade all day、5 min、Summer crag; …in braccio! 5a 10 m; Bongo 5c 15 m
- climbingitaly.com：Technicolor https://climbingitaly.com/sardegna/technicolor/: 30 條、Sun in the morning、Summer crag; Technicolor 6b+ 35 m; Action painting 7a+ 35 m（1996）
- climbingitaly.com：Iglesiente 區頁 https://climbingitaly.com/area/iglesiente/: Masua 海崖（含 Castello dell'Iride、Porto Flavia）面對 Pan di Zucchero 海柱，合計超過 100 條，含 25 條多段; 往北是 Pranu Sartu 與 Gutturu Cardaxiu 峽谷; 最早的子區可能是 1984 年的 Castello dell'Iride; 夏天去 Gutturu Cardaxiu（Istentales 下午早早進陰影）; 「Do not attempt climbing Castello dell'Iride in the summer. Although the shade arrives after 4 pm, the rock is so hot that emanates heat」; 最好的多段在海邊（Porto Flavia、Pranu Sartu），但「all the bolted routes have serious oxidation problems. Please check if and when the routes were re-bolted and avoid climbing on what is visibly rusty. Climbing with friends and nuts may be a wiser choice」
- climbingitaly.com：Pranu Sartu https://climbingitaly.com/sardegna/pranu-sartu/: 32 條、Sun in the afternoon、10 min; Sole all'improvviso 6a+ 95 m 打錨（2023）; Eppur sembrava appoggiata 6c 85 m 打錨（2022）; Dolce bocca 5a 150 m 傳攀「No anchors. 100% trad」; Vento di rosa 5c 100 m 傳攀
- Climbing Sardinia：Le vie più dure della Sardegna https://climbingsardinia.com/en/le-vie-piu-dure-della-sardegna: Marina Superstar 30 m，Bronx，2007 年 Matteo Marini 打錨，9a+/9b，是 Nel Prossimo Futuro（12 m、8b+）與 Marina（20 m、8c+）的延伸; 首攀 Adam Ondra 2008; Campo con Corvi 9a Ondra 2008; Oltretomba 8c Ondra 2008; La Voce 8c+，Ruota del Tempo，Ondra 2009
- Planetmountain：Sardinia sport climbing: the new guidebook to Domusnovas（Oviglia，2019-01-01）https://www.planetmountain.com/en/news/climbing/sardinia-sport-climbing-the-new-guidebook-to-domusnovas.html: 「More than 650 single pitch sport climbs and multi-pitches in 34 crags, enclosed in only 5 square kilometers」; 4a slab 到 9a+/9b（義大利第一條，Ondra）; 作者 Gianluca Piras、Maurizio Oviglia; 在贊助店家與 pietradiluna.com 買; 「Sport climbing in Sardinia was probably born in Domusnovas」（Mondo Liggi）; 1987 年開始、1990 年代黃金期; 「in a moment when the crags need to re-bolted, restored and relaunched」
- Sardegna Sentieri（大區步道網）：San Giovanni Cave http://sardegnasentieri.it/en/node/865: 依大區法 31/1989 與 1999 年 D.G. 2777 號決定列為自然紀念物，受保護; 「Now closed to traffic」，曾是義大利唯一可開車通過的洞; 從 Domusnovas 鎮往北沿 San Giovanni 河的省道到南口; 主洞道 850 m，北口通往 Oridda 谷; 東側 Monte Acqua（540 m）、西側 Punta San Michele（908 m）
- Planetmountain：Castello dell'Iride Masua 岩場頁 https://planetmountain.com/en/crags/castello-del-iride-masua.html: 5c–8a、60 條、白色口袋石灰岩、朝 SE、70 m 繩; 從 Masua 海灘走碎石路到底，「do not park the car close to the Porto Flavia mine or the entry gate」，從礦坑入口右邊黃色標記的小徑不到 10 分鐘; 冬天日照到 15:00，夏天約 16:00 進陰影; 技術型持續攀爬
- Planetmountain：Castello dell'Iride at risk（2005-10-28）https://planetmountain.com/en/news/climbing/castello-delliride-at-risk.html: 市議會因落石下令禁止在 Castello dell'Iride 攀岩; Nebida 的協會 A Ca' da Pria 與 Iglesias 市府協商修改或撤銷
- Planetmountain：Crowdfunding campaign to replace ageing anchors at Masua（2024-11-18）https://planetmountain.com/en/news/climbing/crowdfunding-campaign-replace-aging-anchors-masua-sardinia.html: Gianluca Piras 募款重打 Castello dell'Iride 約 15 條問題單段，改用鈦或 316L; 原因是 304 不鏽鋼在海洋環境的腐蝕與應力腐蝕開裂（SCC）; Piras 與 Oviglia 多年來已逐步更換最危險的路線
- Planetmountain：Pandora, the new crag at Masua（Oviglia，2023-12-07）https://planetmountain.com/en/news/climbing/pandora-new-crag-masua-sardinia.html: Masua 是冬季熱門區; 「it is located in the mine of Masua and just above the Porto Flavia mine, now a tourist site; at present climbing is tolerated, but please follow the marked paths and respect the environment」; Castello dell'Iride 逐步更換錨點（Piras、Oviglia、Fonnesu、Piguet）; Pandora 約 15 段 5a–7b、最長 40 m，朝西南，適合冷或有風的冬天
- Planetmountain：Climbing in Sardinia, SW coast: news and crag safety（Oviglia，2024-12）https://www.planetmountain.com/en/news/climbing/climbing-in-sardinia-sw-coast-news-crag-safety.html: 只寫海岸，不含 Domusnovas; Castello dell'Iride「Overall quite safe」，注意 304 鋼（多為化學錨栓）與老確保站; Zoolook 2023 完全重整; Pandora 316 不鏽鋼; Wild Ca Dapria 304 鋼，「I do not recommend climbing here」; Torrioni 部分重打; Baila con Daphne 304 鋼但仍好、部分確保站要換; Cuenca del Cabron（Buggerru）304 化學錨栓「high risk of failure」，「Climbing here is not recommended」; Gutturu Cardaxius Istentales 安全、冬天不建議; Banana Republic 因洪水毀路要走 30 分鐘
- Planetmountain：Two multi-pitch climbs rebolted at Masua（Oviglia，2022-12-31）https://planetmountain.com/en/news/climbing/two-multi-pitch-climbs-rebolted-masua-in-sardinia-italy.html: Masua 海崖多數路線用 304 不鏽鋼，外觀還好但斷裂風險高; Non spezzarmi il cuore 頂站一個錨點已斷，重打時兩個錨栓一鎚就斷; Hard o Soft? 也有兩個兩鎚就斷; 兩條全部用 316 重打; 清單：已重打 Megaminimondo、Hard o Soft?、Non Spezzarmi il Cuore; 新路線 Acciughe e Bottarga、Abbi Dubbi、Leonello; 相對安全 Italia Liberata、Le Grand Mammuth、Dolci Sardi; 「Climbs at risk of bolt failure: All others」
- Planetmountain：Hard o Soft?（路線頁）https://planetmountain.com/en/routes/hard-o-soft-scogliera-di-masua-sardinia.html: 2001 Bessone、Marlier 由下往上開; 朝南; 160 m; 6a+、必要 5c; 2022 年底 316 重打; 頁面最後更新 19/05/2026
- Planetmountain：Non spezzarmi il cuore（路線頁）https://planetmountain.com/en/routes/non-spezzarmi-il-cuore-porto-flavia-masua-sardinia.html: 1994 Oviglia、Pala; 130 m; 6b+/c、必要 6a、S1+; 2022 年底 316 重打; 開車：卡利亞里走 SS130 往 Iglesias，往 Gonnesa—Carbonia，在 Stazione Monteponi 右轉 SP83 往 Nebida—Buggerru，過 Nebida 下到 Masua 海灘、Portu Cauli 大停車場，右轉跟著「Miniera Masua Porto Flavia」走碎石路到礦業公園停車場; 進公園、礦坑入口前右轉小徑上第二道網，沿崩塌區邊緣步道，「not suitable for children」
- Planetmountain：Plaisir climbing on the cliffs of Masua（2013-02-19）https://planetmountain.com/en/news/climbing/plaisir-climbing-on-the-cliffs-of-masua-in-sardinia.html: Le Grand Mammut 6a+ 140 m（Fonnesu，由上往下）; Acciughe & Bottarga 6a 160 m 五段（5b/5c，起步 6a），316L 全打錨
- Regione Sardegna：Trasporti, dal 1° luglio via ai lavori nella rete ferroviaria del Sulcis（2025-06-20）https://www.regione.sardegna.it/notizie/trasporti-dal-1-luglio-via-ai-lavori-nella-rete-ferroviaria-del-sulcis-servizi-garantiti-con-i-bus: 2025-07-01 起 Decimomannu–Carbonia、Decimomannu–Iglesias 鐵路暫停，施工預計 2026-12-31 前完成; ARST 替代巴士停 Villamassargia、Siliqua，直達 Decimomannu 站轉火車往卡利亞里; 車票選「IGLESIAS SERV. SULCIS – CAGLIARI SERV. SULCIS」
- ARST 808 線 https://app.arstspa.it/quadri/808.html: MASUA - IGLESIAS - DOMUSNOVAS; 例：Masua 06:49 → Iglesias Stazione FS 07:23; 一天約 9 班
- ARST 809 線 https://app.arstspa.it/quadri/809.html: IGLESIAS - DOMUSNOVAS - MUSEI - VILLAMASSARGIA; 例：Iglesias Stazione FS 08:03 → Domusnovas Piazza Leccis 08:17
- ARST 線路清單（2026-10-19 掃 app.arstspa.it/quadri）: 801 CALASETTA - CARBONIA - IGLESIAS - CAGLIARI; 840 MASUA - DOMUSNOVAS
- italia.it：Free climbing in Sardinia https://www.italia.it/en/sardinia/things-to-do/free-climbing-sardinia: Iglesiente 列入不可錯過; 「Domusnovas and Iglesias, where it takes only 30 minutes or less to climb the rocks overlooking the sea, such as the cliffs of Masua, Wild Cadapria, or the Towers of Masua」
- UKClimbing：Sardinia - Multi-pitch Sport Climbing https://www.ukclimbing.com/articles/destinations/sardinia_-_multi-pitch_sport_climbing-3061: 把 Iglesiente（Masua、Gutturu Pala、Pranu Sartu）列為三大多段區之一
- climbing-guide.eu（Ulassai 指南商品頁的相關書目欄）https://www.climbing-guide.eu/climbing-guidebook-ulassai-jerzu-ussassai-osini-2025-11857/: Pietra di Luna / Trad and Multipitches 英文版，約 1,400 條，460 頁，2014，M. Oviglia，Fabula editore; 收錄 Domusnovas、Gutturu Pala、Masua、Cala Domestica、Pranu Sartu、San Nicolò、Capo Pecora 等
- CNSAS Sardegna：La Richiesta di Soccorso https://cnsas.sardegna.it/la-richiesta-di-soccorso/: 撥 112 NUE，轉 Soccorso Alpino e Speleologico Sardegna

## Dropped / not used

- Castello dell'Iride 2005 年禁攀令的撤銷公告：沒找到。後續有 2023、2024 年的重打與「climbing is tolerated」說法，但沒有命令原文；正文標二手、建議確認。
- Climb Europe Domusnovas 指南商品頁：404。
- theCrag Masua／Sulcis-Iglesiente：Groundlane 斷線後 Cloudflare 擋，沒讀到（盤點檔的 192 條不引用）。
- Planetmountain「Gutturu Cardaxius」義文報導、Superquartz、Pandora 岩場頁：沒打開。
- arrampicatasardegna.com、escursi、toursxplorer 等嚮導商品頁：只看搜尋摘要，不引用。
- Grotta di San Giovanni 洞內開放時間、是否有夜間關閉：沒有一手來源。
- Domusnovas 鎮中心到洞南口距離：沒有來源。

## toolDegradation

- Groundlane MCP、jina MCP：「MCP server ... is not connected」。
- 改用 Keenable keyless（curl）搜尋、r.jina.ai 讀頁（Planetmountain 一次空回應，加 www 重抓成功）。
- climbingitaly、ARST 直接 curl。
- Firecrawl 依 brief 不使用。
