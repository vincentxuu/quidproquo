# 岩場文章的來源清單

給寫〈日本岩場〉〈義大利岩場〉這類岩場導覽的人：每個來源能撐哪一類事實、屬於哪一級、踩過哪些坑。寫作規格見 `.agents/skills/post/references/crag-guide-contract.md`；給腳本讀的分級表是 `scripts/config/climbing-source-tiers.json`（改分級時兩邊一起改）。

建立方式（2026-10-18）：用腳本抽出義大利 12 岩場＋總覽的中文文章與 `.research/2026-10-18-italy-crag-*.md`、日本 22 岩場＋總覽的中文文章、台灣 `2026-10-17-taiwan-crags-rock-type.md` 的全部網址，依網域計次分類。下表「引用」是該網域在這批檔案出現的次數／檔案數，只當作常用程度的參考。

**分級**

- **一手**：發布或管理該事實的單位，例如市政府的封閉命令、公園管理處、交通營運者、guidebook 出版社、在地攀岩組織。
- **二手**：編輯型媒體、嚮導公司、觀光整理站。內容通常可靠，但常是轉述或舊資料。
- **不能單獨撐**：群眾資料庫、論壇、個人部落格、聚合站。可以用來找線索、提供熱門度數字，但封閉、法規、bolt 狀況不能只靠它。

**事實類型**：封閉＝closures／禁攀／保護區；路線＝routes & grades；熱門＝popularity（星等、攀登次數）；交通＝transport、停車、纜車、時刻表；救援＝rescue & law；季節＝seasons、朝向。

## 全球通用

| 來源 | 網址 | 類型 | 可撐 | 分級 | 已知陷阱 |
|---|---|---|---|---|---|
| Mountain Project 國際難度對照表 | https://www.mountainproject.com/international-climbing-grades | 換算表 | 難度換算 | 本站換算基準 | 只是近似；`scripts/climbing-grade-convert.mjs` 照它實作，不要各篇手算 |
| theCrag | https://www.thecrag.com | 群眾 DB | 路線、熱門、季節表（標出處）；封閉只當線索 | 不能單獨撐 | 義大利 101 次／13 檔、日本 46 次。直接 curl／jina 常被 Cloudflare 擋（403 或 bot 頁），用 Exa fetch；子區「warning」內容常讀不到，讀不到就只寫「theCrag 標了警告」 |
| Mountain Project | https://www.mountainproject.com | 群眾 DB | 路線、經典榜、熱門；論壇只當線索 | 不能單獨撐 | 路線數與難度常和 Planetmountain／guidebook 不同，表格備註並列；日本頁多是 YDS 原文 |
| 27crags | https://27crags.com | 群眾 DB | 路線數、熱門、入口描述 | 不能單獨撐 | **thetopo.com 是同一個 DB**，兩者不能算兩個來源交叉；topo 多數要付費（Premium）；清單上偶爾直接標「Closed」，要再找一手公告 |
| Climbook | https://climbook.com | 群眾 DB | 重複攀登次數（熱門） | 不能單獨撐 | 頁面資訊日期常很舊（Moneta 頁 2018-12）；禁攀期間文字要找一手出處 |
| 8a.nu | https://www.8a.nu | 群眾 DB | 熱門（攀登紀錄） | 不能單獨撐 | 只收有人登錄的路線，偏向難路線 |
| UKC Logbook | https://www.ukclimbing.com/logbook | 群眾 DB | 路線、熱門、guidebook 收錄清單 | 不能單獨撐 | 和 UKC 的編輯文章（`/articles`，二手）分開看；直接 fetch 403 |
| Rockfax | https://rockfax.com | guidebook 出版社 | 路線、難度系統、季節 | 一手 | 線上只有 intro／樣張；指南書版次要寫年份 |
| MadBoulder | https://madboulder.org | 影片聚合 | 抱石熱門 | 不能單獨撐 | 只證明有人爬過、影片存在 |
| Meetup／Facebook／Instagram／X | — | 社群 | 找繩伴管道 | 不能單獨撐 | Facebook 與 Instagram 通常抓不到內文；只引用「有這個社團」 |

## 義大利

指南書（Versante Sud、Idee Verticali、Idea Montagna、Rockfax、Edizioni DBS 等各區書目）：見 `.research/2026-10-18-italy-guidebooks.md`。

| 來源 | 網址 | 類型 | 可撐 | 分級 | 已知陷阱 |
|---|---|---|---|---|---|
| Planetmountain 岩場資料庫與新聞 | https://www.planetmountain.com/en/crags | 編輯型媒體＋岩場 DB | 路線、季節、朝向、交通；封閉新聞（二手） | 二手 | 151 次／12 檔，義大利最常用。直接 fetch 403，用 jina reader；岩場頁的 NOTA 可能是十年前的（Muzzerone 2014-08 禁攀），要找現況；新聞報導的封閉要回頭找命令原文 |
| Versante Sud／Sestogrado | https://versantesud.it/en/ 、https://sestogrado.it | guidebook 出版社 | 路線數、收錄範圍、版次 | 一手（書）；介紹頁文字是出版社說法 | 介紹頁的地理描述（「18 公里海岸」）是宣傳文字，引用要標「出版社介紹寫」 |
| falesia.it | https://www.falesia.it | 群眾 DB＋論壇 | 路線數、難度範圍、方位、更新日期 | 不能單獨撐 | 每個岩場頁有「更新」日期，引用時寫出來；論壇貼文只當線索 |
| Garda Trentino（Arco） | https://www.gardatrentino.it/en/outdoor/climbing/crags | 官方觀光／Outdoor Park | 岩場座標、停車、交通、Bus&Go 期間與票價、器材年檢 | 一手 | 27 次。部分頁要 JS，用 jina；Bus&Go 期間與時段每年變（volatile） |
| Comune di Arco 等市政府新聞 | https://www.comune.arco.tn.it | 政府 | 封閉命令、工程 | 一手 | 命令號與「fino a espressa revoca」要寫進研究筆記，日後回查 |
| il T、la Busa、il Dolomiti、Montagna.TV、Up-Climbing | 各報 | 地方新聞／攀岩媒體 | 封閉與重開的時間線 | 二手 | 「預計秋天重開」這類預告常沒有後續，寫「查無重開公告」 |
| Finale Outdoor Region | https://finaleoutdoor.com/en/live/climbing | 在地組織 | 各岩場開放／封閉、猛禽繁殖禁攀、維護 | 一手 | 33 次。LIVE 頁每天變；封閉以它為準，不以 DB 為準 |
| CAI 分會（Vicenza、Roma）、CNSAS | https://organizzazione.cai.it 、https://www.cnsas.it | 攀岩組織／山難救援 | 禁攀路線清單、救援電話 | 一手 | CAI 的禁攀清單是 ordinanza 的轉述，命令原文若找得到一起附 |
| 區域公園／保護區（Parco di Porto Venere、Riserva Val di Mello、Riserva dello Zingaro、Parchi Lazio、PNGP） | 各官網 | 管理單位 | 禁攀、保護區範圍、進谷管制與費用、交通 | 一手 | 公園頁沒寫岩壁在不在保護區內，就不要推論（Sperlonga 的例子） |
| 交通營運者（Dolomiti Bus、ARST、AST、Autoservizi Russo、Busitalia、GTT、Cotral、ATC、TPL Linea、SVT） | 各官網 | 營運者 | 時刻表、路線、售票方式 | 一手 | 季節線 PDF 每年換檔名（Linea52_S26）；ARST 舊 PDF 已轉 HTML；GTT 頁常逾時；寫「以 2026 年為例」 |
| 山屋與纜車（Rifugio 5 Torri、Scoiattoli、Mello、cortinadampezzo.it） | 各官網 | 設施 | 自家的營業期、道路管制、纜車日期 | 一手（限自家事實） | 日期每季變（volatile） |
| 官方觀光局（italia.it、SardegnaTurismo、Visit Ferentillo、Visit Portovenere、Umbriatourism、VisitSicily） | 各官網 | 官方觀光 | 規模概述、交通、季節 | 一手（觀光資訊）；路線數只當參考 | 路線數常是行銷數字（「oltre 400」），和 DB 並列即可 |
| Climbing Spot Factory、Alpinisti d'Appennino、Climb Europe、SummitPost | 各站 | 編輯型 topo／整理站 | 歷史、路線、交通細節 | 二手 | CSF 部分頁有 CAPTCHA；Climb Europe 的營地位置描述與 DB 不一致過（San Vito） |
| scoprigaeta.it、daytours.rome.it、Oliunid、個人部落格 | 各站 | 聚合／部落格 | 線索 | 不能單獨撐 | scoprigaeta 時刻表是滾動期間，正文寫「以某日為例」 |

## 日本

| 來源 | 網址 | 類型 | 可撐 | 分級 | 已知陷阱 |
|---|---|---|---|---|---|
| ROCKTOPO | https://rocktopo.net | topo 網站 | 路線、人気の課題、停車場頁 | 二手 | 258 次／23 檔，日本最常用；停車與規則頁要和地方政府、協會頁交叉 |
| CLIMBING-net | https://www.climbing-net.com | 攀岩媒體 | 岩場概要、新聞（封閉、整備） | 二手 | 118 次／23 檔；新聞日期要寫 |
| 日本フリークライミング協会（JFA） | https://freeclimb.jp | 全國組織 | 全国アクセス問題エリア一覧、注意事項、整備 | 一手（access 問題） | 71 次／23 檔；清單是協會掌握的範圍，不在清單上不代表沒有問題 |
| 在地協會（TCNet 高梁川、小鹿野クライミング協会、豊田の岩場） | 各官網／部落格 | 在地組織 | 規則、整備、急救講習、條例 | 一手 | 部分只有部落格或 X，貼文日期要寫 |
| 市町村與縣政府（北杜市、立山町、高梁市條例、林道通行規制） | `*.lg.jp`、`pref.*` | 政府 | 公園規則、條例、林道封閉 | 一手 | 林道規制是季節性的（volatile） |
| 巴士與鐵道營運者（西武バス、西東京バス、堀川バス、京都バス、JR 各社） | 各官網 | 營運者 | 時刻表、路線 | 一手 | 時刻表 PDF 每年換；村營巴士常要預約 |
| 抱石區指南站（城ヶ崎、湯河原 bouldering-guide.com） | 各站 | 在地 topo | 課題、注意事項 | 二手 | 注意事項頁常轉載 JFA 舊通知，找原始日期 |
| 觀光協會、營地（廻り目平、笠置キャンプ場、御在所ロープウエイ） | 各官網 | 官方觀光／設施 | 交通、停車、營業期、費用 | 一手（限自家事實） | 費用與營業期每年變 |
| 山岳會紀錄、個人部落格、ヤマレコ | 各站 | 個人紀錄 | 線索、歷史 | 不能單獨撐 | 轉貼的 JFA 通知要回原文確認仍有效 |
| 気象庁等災害資訊 | https://www.jma.go.jp | 政府 | 地震、災害對岩場的影響背景 | 一手 | 岩場本身的落石狀況要另找在地回報 |

## 台灣

| 來源 | 網址 | 類型 | 可撐 | 分級 | 已知陷阱 |
|---|---|---|---|---|---|
| TOCC（台灣攀岩發展協會） | https://www.tocc-climbing.org | 在地組織 | 龍洞封閉公告、立場聲明、路線資料庫（Google Sheets） | 一手（公告）；資料庫是群眾整理 | 資料庫在 docs.google.com，分級視為 DB |
| 國家公園管理處／國家風景區（壽山、陽明山、墾丁、太魯閣、東北角） | `nnp.gov.tw`、`taiwan.nps.gov.tw`、`necoast-nsa.gov.tw` | 管理單位 | 申請制度、禁止事項、開放與否 | 一手 | 禁止事項以法規原文版本日期為準（植根、LawPlayer 是轉載，二手） |
| 全國法規資料庫 | https://law.moj.gov.tw | 法規 | 法規原文 | 一手 | — |
| NobodyClimb | https://nobodyclimb.cc | 群眾整理 | 岩場介紹、路線 | 不能單獨撐 | — |
| Mountain Project 台灣頁 | https://www.mountainproject.com | 群眾 DB | 路線、熱門 | 不能單獨撐 | 台灣頁更新少 |
| 中央社、自由時報 | 各報 | 新聞 | 事件與時間線（違規、開罰、新制） | 二手 | 制度內容回管理處原文 |

## 定期回查

岩場文章會過期的事實（封閉、時刻表、費用、纜車／接駁日期、bolt 狀況）集中在事實索引，由腳本回查。

**檔案**

- `.research/index/crag-facts.jsonl`：一行一筆查過的事實（crag、country、claim_type、claim、source_url、source_tier、checked、volatile、review、研究筆記與審稿紀錄路徑）。由 `node scripts/build-crag-fact-index.mjs` 從研究筆記與審稿紀錄產生，可重跑；其他系列加 `--prefix 2026-10-12-japan-crag --country Japan --checked 2026-10-12`（日本系列目前沒有逐岩場研究筆記，要先補筆記才進得了索引）。
- `.research/index/crag-source-snapshots.json`：每個 volatile 網址的上次狀態（hash、錨點、抓取管道、日期）。

**怎麼跑**

```bash
node scripts/build-crag-fact-index.mjs          # 研究筆記改過才需要
node scripts/recheck-crag-sources.mjs --reader   # 第一次建立基準，之後比對
```

`--reader` 在直接抓被擋（403／429）時改走 r.jina.ai 公開 reader（無 key），一次一個、間隔 3 秒。判斷「變了」不看整頁 hash（廣告、相關新聞、瀏覽數會讓它每次都不同），而是看事實裡的錨點：數字、日期、時段、金額與引號原文。上次在頁面上找得到、這次找不到，才列為 changed；只有整頁 hash 變了列為 drift-only，不需處理。`--strict` 讓有 changed 或 failed 時 exit 1。

**排程怎麼用**（排程本身由主線程設定，不在這份文件）：每週跑一次 `node scripts/recheck-crag-sources.mjs --reader --strict`，把輸出貼進回報。季節交界（3–4 月、9–10 月）纜車與季節巴士換季，可以加跑。

**有 changed 時**

1. 打開該網址，對照索引裡那幾筆 claim，確認真的改了（錨點不見也可能只是改版或換頁）。
2. 真的改了：用 `post-update` skill 更新受影響的文章（中英兩篇），正文寫新的查核年月，文末 `## 更新紀錄` 記一行；研究筆記補一個 bullet，寫新事實與日期；重跑 `build-crag-fact-index.mjs` 與 `recheck-crag-sources.mjs` 更新基準。
3. 沒改（只是改版）：直接重跑 `recheck-crag-sources.mjs` 讓新狀態成為基準。

**有 failed 時**：plain fetch 與 reader 都抓不到的（SummitPost 403、GTT 逾時）用 Exa、Groundlane 手動開；封閉類來源連續兩次 failed，就當成「無法確認現況」，在文章對應句子加「出發前確認」並找替代的一手來源。

**2026-10-18 基準**：義大利 13 份筆記產生 787 筆事實，其中 142 筆 volatile、89 個網址；基準 87 個成功、2 個失敗（SummitPost Sergent 頁 403；GTT 5137 路線頁逾時）。
