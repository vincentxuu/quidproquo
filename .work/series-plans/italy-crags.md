# 系列規劃：義大利岩場（italy-crags）

使用者確認：2026-10-18（比照「日本岩場」系列；選「總覽＋約 12 岩場」，中英雙語）
擴充：2026-10-19 使用者選「核心＋區域代表約 58 個」，依 `.research/2026-10-18-italy-crags-national-inventory.md` 新增 58 篇（中英 116 檔，檔名日期 2026-10-19）。同一區多個岩場合成一篇（Sella 群、Ossola＋Cadarese、Baunei＋Supramonte、Cortina 單段岩場）。不收：Parete dei Militi（岩壁在法國）、Leano／Circeo（屬 Sperlonga–Gaeta 海岸帶）、Capri、Monte Amiata 等證據偏弱者。

範本：`src/content/posts/climbing/2026-10-12-japan-crag-ogawayama.md`（單篇）、`2026-10-12-japan-crags-overview.md`（總覽）。

## 目標讀者

會爬戶外運攀、想去義大利攀岩旅行的台灣攀岩者。不寫行程、機票、住宿價格（很快過時）；寫岩質與風格、季節與原因、大眾運輸／開車怎麼去、停車、在地規範、代表性路線、查資料入口。

## 入口

order 0 是總覽：依季節（冬季海岸石灰岩／夏季高山白雲岩與花崗岩／春秋為主）挑岩場，附 12 岩場對照表、查資料的入口（theCrag、27crags、Planetmountain、在地指南書）、共通規矩與找繩伴管道。讀者可從總覽直接跳到任一岩場，單篇彼此獨立。

## 弧線

地理排序（北→南），不是學習順序：Piemonte、Lombardia 的花崗岩傳攀 → Trentino、Veneto 的石灰岩運攀與多羅米堤多段 → Liguria 海岸 → Umbria、Lazio → Sicilia、Sardegna 冬季岩場。比照日本岩場依都道府縣排序。

## 斷崖處理

- 單篇彼此獨立，不假設讀者讀過前一篇；共通概念（義大利難度系統、猛禽繁殖期封閉、停車）寫在總覽，單篇只連過去。
- 傳攀為主的岩場（Valle dell'Orco、Val di Mello、Cinque Torri）在單篇點出需要自備保護器材，並連站內〈運動攀登與傳統攀登〉系列。
- Sperlonga 與 Gaeta 相鄰：各篇互連並用對照表說明差別，避免重複。

## 共用規格

- series name：zh `義大利岩場`、en `Italy Climbing Crags`；series.ts slug `italy-crags`
- order：義大利 ISTAT 大區代碼 ×100 + 序號（北→南），總覽 order 0
- 檔名 `2026-10-18-italy-crag-<slug>.md` / `-en.md`；總覽 `2026-10-18-italy-crags-overview`
- 標題格式：`<名稱>（<原文>）：<一句特色>｜義大利岩場`
- 節：這是什麼樣的岩場／什麼季節去／怎麼去（大眾運輸、開車、停車）／去之前要知道的規範／代表性路線／查資料的入口／參考資料
- 來源：在地協會、官方旅遊／自然公園、thecrag、27crags、UKC logbook、guidebook 出版社（Versante Sud 等）、Planetmountain；每個事實都要有來源，來源說法不同時並列
- 審稿紀錄：`.work/reviews/2026-10-18-italy-crag-<slug>.md`

## 篇目與範圍卡

| order | slug | 主題 | 聚焦問題 | 讀完後讀者能 |
|---|---|---|---|---|
| 0 | 2026-10-18-italy-crags-overview | 總覽 | 什麼季節該去哪個義大利岩場？資料去哪查？ | 讀完後讀者能：依出發月份挑出 2–3 個合適岩場，知道去哪查最新封閉公告 |
| 101 | 2026-10-18-italy-crag-valle-dellorco | Valle dell'Orco | 這個片麻岩谷地適合什麼程度、什麼季節？ | 讀完後讀者能：判斷自己的傳攀程度夠不夠、排出季節與進出交通 |
| 301 | 2026-10-18-italy-crag-val-di-mello | Val di Mello | 保護區裡的抱石與 slab 怎麼去、有什麼限制？ | 讀完後讀者能：規劃進谷交通與停車（限額與收費），知道保護區規範 |
| 401 | 2026-10-18-italy-crag-arco | Arco | 三千條路線裡怎麼挑區、哪些區封閉？ | 讀完後讀者能：依季節與程度挑子區，避開封閉區 |
| 501 | 2026-10-18-italy-crag-lumignano | Lumignano | 分區分季開放怎麼看？ | 讀完後讀者能：查到目標子區的開放月份與禁攀路線 |
| 502 | 2026-10-18-italy-crag-cinque-torri | Cinque Torri | 高山白雲岩塔群什麼時候能去、怎麼上去？ | 讀完後讀者能：對準纜椅營運期排行程，選經典多段 |
| 701 | 2026-10-18-italy-crag-finale-ligure | Finale Ligure | 全年可爬的石灰岩重鎮，猛禽封閉怎麼查？ | 讀完後讀者能：挑對季節與坡向，查到當年禁攀名單 |
| 702 | 2026-10-18-italy-crag-muzzerone | Muzzerone | 海崖多段的禁攀區與接近方式？ | 讀完後讀者能：知道 Parete Centrale 的禁令現況，選可爬的區 |
| 1001 | 2026-10-18-italy-crag-ferentillo | Ferentillo | 冬天的仰角石灰岩怎麼搭車去？ | 讀完後讀者能：用 Terni 出發的巴士或開車抵達，依坡向挑區 |
| 1201 | 2026-10-18-italy-crag-sperlonga | Sperlonga | 冬季海邊運攀的老岩場，bolt 狀況如何？ | 讀完後讀者能：排冬季行程並判斷重打 bolt 與下降點的狀況 |
| 1202 | 2026-10-18-italy-crag-gaeta | Gaeta | 洞穴仰角與海崖多段跟 Sperlonga 差在哪？ | 讀完後讀者能：在 Sperlonga 與 Gaeta 之間依程度與天氣選擇 |
| 1901 | 2026-10-18-italy-crag-san-vito-lo-capo | San Vito lo Capo | 西西里冬季岩場怎麼去、怎麼住？ | 讀完後讀者能：從 Palermo／Trapani 規劃進出與季節 |
| 2001 | 2026-10-18-italy-crag-cala-gonone | Cala Gonone | 薩丁尼亞東岸哪些區能爬、哪些該避開？ | 讀完後讀者能：挑子區並避開 bolt 不安全的 Cala Luna |
| 102 | 2026-10-19-italy-crag-ossola | Val d'Ossola＋Cadarese | 裂隙傳攀、多段與抱石在 Ossola 各谷怎麼分？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 103 | 2026-10-19-italy-crag-rocca-sbarua | Rocca Sbarua | 杜林近郊的歷史多段，現在 bolt 狀況與程度？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 104 | 2026-10-19-italy-crag-monte-bracco | Monte Bracco | Sanfront 的運攀與抱石適合什麼程度與季節？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 105 | 2026-10-19-italy-crag-andonno | Andonno | 義大利第一條 8c+ 所在的石灰岩岩場怎麼挑區？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 106 | 2026-10-19-italy-crag-valle-gesso | Valle Gesso 抱石 | 高山片麻岩抱石什麼月份能去、怎麼到？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 201 | 2026-10-19-italy-crag-monte-bianco | 白朗峰義大利側（Courmayeur） | Grand Capucin 與 Val Ferret 的高山花崗岩多段要什麼程度與纜車？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 202 | 2026-10-19-italy-crag-machaby-arnad | Corma di Machaby／Arnad | Aosta 低海拔板岩風多段怎麼選？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 203 | 2026-10-19-italy-crag-champorcher | Champorcher 抱石 | Aosta 的蛇紋岩抱石什麼季節去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 302 | 2026-10-19-italy-crag-lecco-grigne | Lecco／Grigne | Lecco 一帶上百岩場與 Grignetta 經典多段怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 303 | 2026-10-19-italy-crag-cornalba | Cornalba | Val Serina 的老牌高難度岩場現況如何？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 402 | 2026-10-19-italy-crag-sass-dlacia | Sass Dlacia | Val Badia 夏季運攀需要什麼裝備與程度？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 403 | 2026-10-19-italy-crag-frea | Frea | Passo Gardena 運攀與短多段怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 404 | 2026-10-19-italy-crag-sassolungo | Sassolungo／Langkofel | 千米北壁與經典路線要什麼程度？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 405 | 2026-10-19-italy-crag-sella | Sella 群（Sella Towers、Piz Ciavazes、Città dei Sassi、Cansla） | Sella 山口一帶多段與單段怎麼依程度挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 406 | 2026-10-19-italy-crag-pian-schiavaneis | Pian Schiavaneis／Cogoi | Val di Fassa 雨天也能爬的岩場怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 407 | 2026-10-19-italy-crag-catinaccio-vajolet | Catinaccio／Vajolet Towers | Vajolet 塔群的經典線與山屋怎麼排？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 408 | 2026-10-19-italy-crag-pale-di-san-martino | Pale di San Martino | Spigolo del Velo 等經典線與周邊單段岩場怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 409 | 2026-10-19-italy-crag-brenta | Brenta（Campanile Basso） | Campanile Basso 的歷史路線要什麼程度、怎麼接近？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 410 | 2026-10-19-italy-crag-daone | Valle di Daone 抱石 | tonalite 花崗岩抱石區的季節、分區與規範？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 503 | 2026-10-19-italy-crag-tre-cime | Tre Cime di Lavaredo | 北壁經典線與南面入門線要什麼程度、收費道路怎麼走？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 504 | 2026-10-19-italy-crag-tofana | Tofana di Rozes | 南壁經典線（Costantini-Apollonio 等）要什麼程度？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 505 | 2026-10-19-italy-crag-cortina-crags | Cortina 單段岩場（Crépe de Oucèra、Bèco d'Ajàl） | Cortina 夏季單段運攀怎麼依程度挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 506 | 2026-10-19-italy-crag-marmolada | Marmolada 南壁 | 大岩壁經典線（Pesce 等）的規模、季節與接近？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 507 | 2026-10-19-italy-crag-civetta | Civetta 西北壁 | 「牆中之牆」的經典線要什麼程度、怎麼排山屋？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 508 | 2026-10-19-italy-crag-laste | Laste | Agordino 技術型板岩運攀怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 601 | 2026-10-19-italy-crag-erto | Erto | Vajont 旁大仰角岩場、冬季與雨天怎麼用？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 602 | 2026-10-19-italy-crag-val-rosandra | Val Rosandra | Trieste 的冬季喀斯特岩場與 Comici 歷史？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 703 | 2026-10-19-italy-crag-val-pennavaire | Val Pennavaire（Oltrefinale） | Finale 內陸的冬季運攀怎麼挑區？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 704 | 2026-10-19-italy-crag-varazze | Varazze 抱石 | 片麻岩海岸抱石與 Gioia 所在區怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 801 | 2026-10-19-italy-crag-bismantova | Pietra di Bismantova | 砂岩大岩體的多段與單段怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 901 | 2026-10-19-italy-crag-camaiore | Camaiore／Alpi Apuane | 托斯卡尼最好的運攀區與 Pizzo d'Uccello 北壁？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 902 | 2026-10-19-italy-crag-elba | 厄爾巴島（Isola d'Elba） | 花崗岩海崖與多段怎麼搭船去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 903 | 2026-10-19-italy-crag-capo-duomo | Capo d'Uomo（Monte Argentario） | 海崖單段與 Spigolo Bonatti 怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1101 | 2026-10-19-italy-crag-frasassi | Gola della Rossa／Frasassi | 馬爾凱峽谷岩場與多段怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1203 | 2026-10-19-italy-crag-grotti | Grotti | 中義大型多孔石灰岩岩場怎麼挑區？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1204 | 2026-10-19-italy-crag-collepardo | Cueva di Collepardo | 9a 洞穴岩場的封閉期與程度門檻？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1301 | 2026-10-19-italy-crag-gran-sasso | Gran Sasso | Corno Piccolo 多段與夏季石灰岩抱石怎麼排？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1302 | 2026-10-19-italy-crag-roccamorice | Roccamorice（Majella） | Abruzzo 運攀聖地的分區與季節？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1303 | 2026-10-19-italy-crag-pennadomo | Pennadomo | Abruzzo 老牌岩場適合什麼程度？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1401 | 2026-10-19-italy-crag-frosolone | Frosolone | 禁攀後重開的現況、封閉月份與分區？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1501 | 2026-10-19-italy-crag-amalfi-coast | 阿瑪菲海岸／Positano | 海崖運攀的冬季行程怎麼排？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1502 | 2026-10-19-italy-crag-palinuro | Palinuro／Cilento | La Severina、Molpa 的海崖運攀怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1601 | 2026-10-19-italy-crag-statte | Statte | Taranto 峽谷岩場怎麼挑區？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1602 | 2026-10-19-italy-crag-salento | Salento（Ciolo） | 海崖與 DWS，哪些區禁止進入？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1801 | 2026-10-19-italy-crag-orsomarso | Orsomarso／Pollino | Calabria 夏季山區運攀怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1802 | 2026-10-19-italy-crag-stilo | Stilo（Monte Consolino） | 南義最美 tufa 洞穴的程度與季節？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1902 | 2026-10-19-italy-crag-palermo | 巴勒莫（Monte Pellegrino、Monte Gallo） | 城市旁的運攀與多段怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1903 | 2026-10-19-italy-crag-bosco-scorace | Bosco Scorace 抱石 | 西西里砂岩抱石的分區與季節？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1904 | 2026-10-19-italy-crag-rocche-del-crasto | Rocche del Crasto（Nebrodi） | 野外多段與 Rocca Calanna 怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1905 | 2026-10-19-italy-crag-madonie | Caltavuturo／Madonie | 西西里夏季避暑岩場怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1906 | 2026-10-19-italy-crag-siracusa | 錫拉庫薩（Canicattini Bagni、Plemmirio DWS） | 峽谷運攀與 DWS 怎麼排？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 1907 | 2026-10-19-italy-crag-ragusa | Ragusa／Modica（Cava d'Ispica） | 東南西西里峽谷岩場怎麼去？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 2002 | 2026-10-19-italy-crag-gallura | Gallura 花崗岩抱石 | La Cerra 等抱石區的季節與私有地規範？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 2003 | 2026-10-19-italy-crag-tavolara | Tavolara | 私人島上的多段與 DWS 能不能爬、怎麼上島？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 2004 | 2026-10-19-italy-crag-baunei | Baunei 海岸＋Supramonte | Aguglia、Giradili、Hotel Supramonte 等大岩壁要什麼程度？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 2005 | 2026-10-19-italy-crag-ulassai | Ulassai／Jerzu | 全島最大運攀區怎麼挑區？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 2006 | 2026-10-19-italy-crag-isili | Isili | 大仰角運攀的分區與季節？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
| 2007 | 2026-10-19-italy-crag-domusnovas | Domusnovas／Iglesiente | Ondra 9a+ 所在地與 Masua 海崖多段怎麼挑？ | 讀完後讀者能：判斷適不適合自己的程度與風格，排出季節、交通與要避開的封閉 |
