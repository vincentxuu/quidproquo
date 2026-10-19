# 戶外抱石系列研究筆記（G 模組）

日期：2026-10-18｜用途：`.work/series-plans/outdoor-bouldering.md` 的來源｜範圍：抱石墊與 spotting、讀 topo 與岩場禮儀、高抱石風險、台灣戶外抱石區

## 工具與降級紀錄（toolDegradation）

- (1) Groundlane MCP：`web_search` 回 "MCP server claude.ai Groundlane is not connected"（已用 ToolSearch 載入，連線失敗）。
- (2) Groundlane 直接 HTTP（POST `groundlane.vincent-xu-work.workers.dev/mcp`）：回應為空。
- (3) Keenable keyless：可用，全部搜尋走這裡（約 40 組查詢）。
- 讀頁面：Jina reader（r.jina.ai，curl）；初次平行抓取觸發 429，改為序列＋退避後成功。firecrawl MCP 回 "not connected"；linkup 斷線。
- PubMed 頁面 Jina 與直接 curl 都抓不到摘要，改用 NCBI E-utilities efetch 成功。
- 沒讀到的：theCrag（Jina 只回 400 多 bytes，疑似機器人驗證，台灣、龍洞、花蓮抱石三頁）、udn 影音〈天然抱石領路者〉（Jina 回 403 AbuseAlleviationError）。這兩項沒有列入下方來源，也沒有拿來當證據。
- 打開後判定無關、已剔除：peakwiki「龙洞抱石」（是廣州龍洞，不是台灣）、DAV〈Meisterhaft fallen〉（講繩索墜落撞牆，不是抱石）。

## 站內既有內容（避免重複）

| 文章 | 已經寫了什麼 | G 系列怎麼處理 |
|---|---|---|
| 〈抱石解題〉`2026-10-18-bouldering-problem-solving`（B 系列） | 岩館的下攀、Babyboxer 落地、spot 護頭肩、法國 2025 落地研究；明寫「戶外抱石還要搬墊子、排墊子，留到之後的戶外篇再寫」 | order 0 開頭一句連回，不重寫落地姿勢；只寫戶外才有的東西（不平地面、墊子縫、移墊、top out 與下山路） |
| 〈攀岩入門〉`2026-10-08-climbing-beginner-guide` | V 級基本讀法、抱石落地負擔、原岩的安全墜落教學 | 連結；topo 篇只寫戶外 topo 才有的標記 |
| 〈難度與保護評等怎麼讀〉`2026-10-17-grades-and-protection-ratings`（C 系列） | YDS／法式／UIAA／英式、R／X；明寫 V 級不重複 | topo 篇的 Font 級與 V 級只寫戶外差異（同數字戶外偏硬），換算表連過去 |
| 〈第一條戶外運攀先鋒〉`2026-10-17-first-outdoor-sport-lead`（C 系列） | 起攀前 spot（Petzl：引導骨盆和上背）、stick clip、落石 | spot 原理一致，連結；高抱石篇的「改架頂繩」連 C 系列頂繩篇 |
| 〈台灣岩場怎麼挑〉`2026-10-17-taiwan-crags-rock-type`（C 系列 order 14） | 龍洞、德芙蘭、關子嶺、壽山、大砲岩（提到有人爬抱石）、墾丁、太魯閣的岩質與規定 | 台灣抱石篇只寫抱石區，岩壁規定與大砲岩連過去 |
| 〈誰決定一條線要不要打 bolt〉（C 系列 order 15） | 鑿點、補打、龍洞倫理 | 禮儀篇的「不鑿點」一句帶過連結 |
| 日本岩場系列：御岳、笠置等抱石岩場篇 | 御岳河原落地沙地變動、租墊店 maunga | 禮儀篇與台灣篇可引為河床抱石的對照例 |
| 規劃中：其他攀登類型 `climbing-disciplines`（DWS、free solo） | free solo 篇把 highball 當邊界；明寫「高抱石 → G 戶外抱石系列」 | 高抱石篇負責 highball 本體，free solo 篇只連結 |
| 規劃中：攀岩心理與戰術 order 1 墜落練習 | 先鋒的怕摔、漸進暴露 | 高抱石篇的「漸進試摔」連過去，不重寫暴露原則 |
| 規劃中：攀岩裝備 `climbing-gear` | grep 不到抱石墊 | 抱石墊的種類與租買由 G order 0 負責 |

## 主要來源（全部已打開）

### 墜落、抱石墊與 spotting

1. **Gripped〈Bouldering Outside? 5 Tips for a Safer Landing〉** https://gripped.com/indoor-climbing/bouldering-outside-5-tips-for-a-safer-landing — 戶外地面有樹根、石頭、斜坡；落地區常超出起攀處（前傾、橫移題更遠）；「landing on the edge of a pad is a very common way climbers sprain their ankles」；把小墊折起來填洞再蓋大墊、走一遍測試；墊子之間的縫會傷人，墊子會被走動推開；低矮前傾題或直上低 top out 的題目不一定需要 spot，spotter 反而擋路。
2. **Climbing〈Everything You Need to Know to Boulder Safely〉（2022-03-22）** https://climbing.com/skills/boulder-safely — 落地清單（拿掉鑰匙手機、清空落地區、事先跟 spotter 講好何時移墊、掉了就不要再抓點、雙腳與肩同寬膝蓋彎、收下巴防揮鞭、不要用手撐、順勢往後滾）；依題型調整（低屋簷像翻過來的烏龜、dyno 臉朝下時手腳抬高）；放墊看「掉的機率 × 後果」；墊子會移動、每次嘗試之間都要調整；blubber（薄軟上層墊）會滑走把腳拉走、會蓋住縫；「Outside, it's almost always a good idea to spot」，特別是 heel hook、dyno；spotter 三個目標（不撞頭、不飛出墊子、飛出去也不撞頭）；手指併攏像連指手套，張開的手指常骨折；身材差距大就只顧頭；super highball 例外。
3. **Climbing／Rock and Ice〈Your Complete Guide to Highball Bouldering〉（2022-01-13，原刊 Rock and Ice）** https://climbing.com/skills/how-to-spot-bouldering — 15 呎「gym line」；Jason Kehl：多數抱石傷害來自踩到墊子邊緣扭腳，所以墊子平鋪不疊、無縫、每次掉完檢查；墊子蓋住石頭時用粉筆在墊上做記號；一個人時別把墊子丟在起攀處，起攀用薄墊或地毯，大墊放在最可能掉的地方；用衣服背包填坑、折墊整平斜坡；spotter 的工作是讓人腳先落地、把人推離障礙物，抓腋下或推上背，hip clamp；spotter 站遠一點、拇指收進掌心；Boone Speed：多數時候寧願自己 spot 自己；「一個懂的 spotter 勝過六個混的」；試摔：先上一步掉、再上兩步掉；heel hook 與 dyno 的墜落要先想好；疊墊墊高起攀是壞風格；John Gill 也架頂繩爬難題。
4. **Climbing〈Should You Spot Highball Boulder Problems?〉（2021-12-27）** https://climbing.com/skills/bouldering-highballing-tactics-safety — Splat Calculator：155 磅、23 呎墜落約 3,542 呎磅；從 10 呎就接不住；spotter 的工作是讓人保持直立落在墊上、避開尖物；「Pad-fu」（spotter 舉一張墊子在空中）；20 呎紅線；多數人該做的是架頂繩：比 highball spot 安全、裝備少、只要一個人、對植被衝擊小。
5. **AAC〈Bouldering Fall — Poor Pad Placement〉（ANAC 2025，Hueco Tanks *See Spot Run* V6，25 呎）** https://publications.americanalpineclub.org/articles/13201217298 ；同案 AAC Prescription 2025-01 https://americanalpineclub.org/news/2025/1/14/the-prescriptionjanuary — 平常放 6 張以上，出事那天 5 張且鋪得較窄，自認有兩個 spotter 就夠；約 15 呎掉下，左腳踩到岩石右腳在墊上，嚴重扭傷；他事先叫 spotter 過了難點就閃開；編輯：「the falling climber lands on the pads and stays on the pads」、highball 的 spot 比較像用力推一把，也要護頭頸；同季同一題多起扭傷；「bouldering is perhaps the most accident- and injury-plagued facet of climbing」。
6. **AAC〈Bouldering Fall — Missed Pads〉（ANAC 2022，BC Bootleg Boulders）** https://publications.americanalpineclub.org/articles/13201216295 ；Prescription 2022-05 https://americanalpineclub.org/news/2022/5/11/the-prescription-may-2022 — 探勘日每人只帶一張墊；未爬過的 highball 約 20 呎，top out 卡住決定下攀，下攀兩步手點斷裂，落在墊外一呎、壓到 spotter；距骨開放性骨折；沒訊號、沒衛星通訊，靠爬下碎石坡自救。
7. **AAC〈Highball Bouldering Fall〉（ANAC 2017，Big Cottonwood Canyon）** https://publications.americanalpineclub.org/articles/13201214410 — 20–30 呎掉在墊上角度不對，再滾下陡坡約 70 呎；「All bouldering falls are ground falls」；「A helmet for highballing might be worth considering?」（問句，非建議）。
8. **AAC〈Fall on Rock, Poor Position—Improper Spotting〉（ANAC 1986，Horsetooth）** https://publications.americanalpineclub.org/articles/13198603901 — spotter 被 2–3 公尺掉下的人壓到頭、腳踩外斜石頭腓骨骨折；「the spotter can only direct… cannot try to catch」；手臂插到對方腋下穩住。
9. **AAC〈No Rope, Climbing Alone, Unable to Downclimb, Jumped〉（ANAC 1990，Boulder Canyon）** https://publications.americanalpineclub.org/articles/13199004103 — 一個人暖身抱石爬到 5–6 公尺、手點脫落、下不來也不敢上，只好跳；腳跟重挫、數月不能爬。
10. **Climbing Wall Association〈Perspectives on Spotting〉（Lines 2013-07）** https://cwapro.org/blog/perspectives-on-spotting — 業界專家一致：spot 的目的是保護頭頸；岩館有新一代地墊時不建議系統性 spot（spotter 本身是硬物、未受訓的 spotter 弊大於利）；「Spotting practices are more prevalent in outdoor settings where uneven, smaller, and rocky landing surfaces exist」。
11. **Climbing Business Journal〈Should You Spot? Maybe Not.〉** https://climbingbusinessjournal.com/spotting-maybe-not — 轉述 CWA；只有低矮洞穴等少數情況適合 spot，爬高後 spotter 閃開較安全。
12. **REI〈Bouldering Basics〉** https://www.rei.com/learn/expert-advice/bouldering.html — spotter 不是接人，是讓頭肩不撞地；「Having more spotters is always better」（與 Climbing「一個懂的勝過六個」相反）；戶外要帶墊、常需多張；LNT 七原則。
13. **Japan Bouldering Guide〈Outdoor Climbing Etiquette in Japan〉** https://japan-bouldering.netlify.app/etiquette — 十條：指定停車、垃圾與粉痕帶走、不鑿點不砍樹、小聲不放音響、不生火不露營不車宿、穿外鞋不踩墊（日本 vs 海外文化差異專欄）、廁所、用別人已鋪好的墊子先問、不霸佔題目、跟居民打招呼。

### 傷害研究（多數是岩館或混合資料）

14. **Josephsen et al. 2007, Wilderness Environ Med 18(4):271-80〈Injuries in bouldering: a prospective study〉** https://pubmed.ncbi.nlm.nih.gov/18076293 — 室內外抱石者一年追蹤；手指與腳踝傷常見；「Traditional preventative measures were ineffective」；室內外差異小；戶外手指受傷風險較高。摘要沒定義「傳統預防措施」包含哪些（全文未取得）。
15. **Müller et al. 2022, Injury 53(4):1394-1400〈430 patients … urban emergency department〉** https://pubmed.ncbi.nlm.nih.gov/35144805 — 慕尼黑一級創傷中心 2010–2020，430 人 447 傷：腳踝 36.7%、膝 16.8%、肘 12.3%；下肢 61.1%；扭傷 53.0%、骨折 22.8%、脫臼 11.9%；19.9% 開刀。摘要未分室內外。
16. **〈The art of falling〉Frontiers in Sports and Active Living 2025** https://pmc.ncbi.nlm.nih.gov/articles/PMC12312403/ — 245 位法語區受傷成人（透過法國岩館招募）；下肢 67%、腳踝扭傷最多；85% 非自願墜落；腳滑、抓空、dyno 占 72%；94% 落在墊上；多從牆中段（31–32%）與頂段（47%）掉。站內〈抱石解題〉已引用，戶外篇只能當「岩館資料」引用。
17. **Sweden outdoor 2008–2019（J Exp Orthop 2021）** https://pmc.ncbi.nlm.nih.gov/articles/PMC8502181/ — 38 位戶外攀岩創傷，抱石 9 人；抱石 89% 墜落造成、100% 足踝、89% 骨折。樣本很小。
18. **Swiss single-centre outdoor cohort（BMJ Open Sport Exerc Med，PMC8971760）** https://pmc.ncbi.nlm.nih.gov/articles/PMC8971760/ — 2012–2018 222 筆病歷篩戶外；摘要層級沒有抱石的獨立數字可用，暫不引用數字。

### 禮儀、岩石保護、topo 慣例

19. **Access Fund〈The Climber's Pact〉** https://accessfund.org/get-involved/the-climbers-pact — 12 條：裝備與墊子放在耐踩地面、清掉粉與 tick mark、控制人數與噪音、墊子與垃圾全部帶走、學當地倫理、尊重封閉。
20. **Access Fund〈Don't Be Like Jerry〉（2018-01-10，與 Friction Labs）** https://accessfund.org/latest-news/open-gate-blog/dont-be-like-jerry — 每次結束刷掉 tick mark；軟岩（沙漠砂岩）用豬鬃軟刷、花崗岩用尼龍刷；雨淋不到的地方（屋簷、洞穴）少用粉；有些地方禁粉或限粉色。
    - Access Fund〈Four Simple Strategies for Low-Impact Bouldering〉兩個網址（/latest-news/open-gate-blog/… 與 /open-gate-blog/…）與〈Ticked Off〉今天都回 404。內容只在 Keenable 快取摘要看到（「別把墊子放在植物上、移動時抬起來不要拖」），寫文時要找存檔副本，不能只引快取。
21. **Bleau.info〈Ethics〉** https://bleau.info/ethics?locale=en — 沒寫就是站立起攀，腳踩地面（不能踩石頭或墊子、不能跳起）；sit start 是變體，名稱加 assis；不刊 running start（鞋底沙子磨亮岩石）；濕砂岩很脆，不爬、電扇吹乾也不對；擦鞋；軟刷；不畫箭頭（Cosiroc 負責）；有岩刻的石頭不爬。
22. **BMC〈Best practice for bouldering on sandstone in Font〉** https://thebmc.co.uk/en/sandston-bouldering-font-best-practice — 完全乾才爬，可能要 24 小時以上；大墊減少地面侵蝕；換題前擦鞋；只用很軟的掃帚刷，一般抱石刷與牙刷太硬；少用粉；砂岩上不要 tick mark（也破壞後人讀線）；看到別人不守，友善地講。
23. **UKC〈Protect Fontainebleau Sandstone - Don't Climb on Wet or Damp Rock!〉（2024-04）** https://ukclimbing.com/news/2024/04/protect_fontainebleau_sandstone_-_dont_climb_on_wet_or_damp_rock-73647 — 復活節期間有人雨中爬、社群發起宣導。
24. **Gripped〈Never Climb or Boulder on Wet Sandstone〉** https://gripped.com/profiles/never-climb-or-boulder-on-wet-sandstone — 同上主張（已打開，內容與 BMC 一致）。
25. **UKC〈#RespectTheRock: Chalk Use〉** https://ukclimbing.com/articles/skills/respecttherock_chalk_use-9892 — 抱石嘗試次數多、粉堆積更明顯；過量的粉會漂白、留下粉痕；砂岩與 gritstone 靠岩面粗糙與孔隙摩擦，粉塞住反而滑；1970 年代 Clean Hand Gang 反粉。
26. **Hong Kong Climbing〈Bouldering Etiquette〉（2020-12-30）** https://hongkongclimbing.com/2020/12/30/bouldering-etiquette — 亞洲濕熱環境的對照：topo 白圈是指定起攀點；「No Sit, No Send」：標 (sds) 就要屁股坐地、最多一張墊；矮個子碰不到指定點時可例外加墊；dab 定義（碰到地面、墊子、spotter）；藏墊在岩場要記得收走，作者在更新指南時發現至少四張爛掉被丟棄的墊子；pack in pack out。
27. **How to Climb〈How to Read a Climbing Topo: A Beginner's Guide〉** https://howtoclimb.co.uk/post/how-to-read-a-climbing-topo-a-beginner-s-guide — 一般 topo 讀法；抱石 topo 一條線標起點、終點、關鍵點；topo 是指引不是保證。偏繩攀，抱石細節少。

### 抱石墊

28. **Wikipedia〈Bouldering mat〉** https://en.wikipedia.org/wiki/Crashpad — 第一張商用墊 Kinnaloa Sketchpad 1992；與 Hueco Tanks、John Sherman 有關；厚 8–15 cm、最大約 1×2 m；兩到三層 PU 泡棉、600–1000D 尼龍；hinge 折線是弱點；疊墊被批評像人工攀登。
29. **Beta-gear〈Burrito, taco, add-on〉** https://beta-gear.com/blog/crashpad-typ — 這家把 burrito 定義為有 hinge 的折疊墊、taco 為無折線整塊墊、add-on 是補縫小墊不能單獨用。命名跟常見用法（taco 指無折線、對折成 U 形）可能相反，寫文時以「有沒有折線」描述，不用 taco／burrito 當主詞。

### 高抱石的定義

30. **Mountain Project 論壇〈What do you consider highball bouldering?〉** https://mountainproject.com/forum/topic/113906063/what-do-you-consider-highball-bouldering — 定義分歧：10 呎、15 呎、15–20 呎；「超過墊子能低風險接住的高度」；落地品質、難點位置比高度重要；類比 Bachar 的 Zone 2、繩攀的 R 級。

### 台灣

31. **Mountain Project〈Taiwan Bouldering〉** https://www.mountainproject.com/area/200444980/taiwan-bouldering — 子區：泰安、麗陽、鼻頭、水長流；共 12 題（MP 資料很不完整）。
32. **MP〈Tai-An Riverbed 泰安抱石〉** https://www.mountainproject.com/area/125613378/tai-an-riverbed — 苗栗泰安汶水溪河床；英文寫 VB–V11、中文寫 VB–V9（自相矛盾）；停車騰龍溫泉山莊第二停車場，接近 5–10 分鐘；台灣幾間岩館提供多達 9 張免費墊，用完放回、用防水布包好；夏天熱、冬天最適合；河床要注意天氣；開發者「閃電」陳。
33. **MP〈Li-Yang Bouldering 麗陽抱石〉** https://www.mountainproject.com/area/200287087/li-yang-bouldering — 台中谷關、德芙蘭附近；一顆 8–9 m highball（主線約 V8/9 project）；其他多為 V0–V5；河床落地多半不錯，適合新手；接近 5–8 分鐘，有 H 型梯。
34. **MP〈Bitou Boulders〉** https://www.mountainproject.com/area/118755271/bitou-boulders — 鼻頭角海岸砂岩，2018-12 由 The Bivy 的 Qx 與 Kelly 發現；約 50 題；岩石約 700 萬年（龍洞約 3,500 萬年）；國光 1811／1812 公車班次。
35. **MP〈Water Flows Forever 南投水長流〉** https://www.mountainproject.com/area/125650363/water-flows-forever — 南投國姓，上下游兩區；溪水暴漲讓路線歷年改變，上游較少受影響；黃平寬近年維護開發。
36. **KateMao〈戶外抱石｜最易達的北投中和禪寺〉（2025-02-18）** https://katemaomao.com/blog/20250218-outdoor-bouldering-chung-tai-chan-monastery/ — 捷運奇岩站 1 號出口走約 17 分鐘；Urban Climbing TW 開發「海底世界」：鯨魚岩約 3 m V2–V7、刀疤岩 slab V0–V4、三角御飯糰；砂岩、苔蘚塵土、螞蟻蜘蛛蚊子；地面平坦、有緩坡可下；捷運帶墊的尺寸規範；作者覺得戶外難度因不安感偏硬；2024 年底新竹風城有戶外抱石實作工作坊（教看路線、放墊、保護）。
37. **原岩攀岩館南港店〈戶外抱石墊租借〉** https://tupclimbing.tw/gear/nangang/13 — 2 天前預約；24 小時一日；首日 NT$300、第二日 200、第三日起每日 100；Ocun Moonwalk 136.5×99×10 cm、Ocun 121×99×8、Madrock 120×90×13、M2C 120×100×12.5；簽租賃契約、留證件。照片拍於南投瑞龍／水長流。
38. **嘖嘖〈支持台灣天然抱石：出版臺灣第一本天然抱石的書籍〉（2019-10-07～11-15）** https://www.zeczec.com/projects/TOB — 2015 年起開發；南澳碧侯、桃園小烏來、新北大豹、南投瑞龍、南投平瀨五區；清垃圾、開路、刷點。
39. **TOKYO POWDER〈TAIWAN BOULDER GUIDE〉** https://shop.tokyopowder.com/en/products/taiwan-boulder-guide — 碧侯、大豹、平瀨、瑞龍約 240 題；211 頁中英文；作者 Roger Wo／Fiona Lee；首批收入捐給颱風受損岩場重建；各區有 GPS 座標，多半要開車、路窄。
40. **嘖嘖〈台灣天然抱石指南-大野狼與小綿羊岩〉（2026-09-16～12-20）** https://www.zeczec.com/projects/taiwan-bouldering — 第二本書；東北角海岸一處高密度抱石區（頁面未寫明地名）；76 條路線、18 顆石頭、98% 以上有動作影片 QR code；第一本書的山區岩場在多雨氣候下被雜草青苔重新覆蓋；海岸區較不易長青苔。
41. **Yiwen Rhi Chen（@gumbybear.climb）Threads** https://www.threads.com/@gumbybear.climb/post/DDOPrwyvHTe — 「知道自己要怎麼墜落是戶外抱石最重要的一點」；只爬 V3 以下的 highball；12/14 戶外抱石實作工作坊。同作者健行筆記〈泰安戶外抱石〉https://hiking.biji.co/index.php?q=review&act=info&review_id=33293：夏末芒草、路難找、蜜蜂、很熱、要帶很多水。
42. **The Bivy〈About Us〉** https://thebivylongdong.com/about-us — 鼻頭角；Kelly 2025-04 通過 AMGA Rock Guide；2020-08 起不再提供住宿。可當台灣有 AMGA 認證嚮導的在地資源。

## 關鍵發現

1. **戶外和岩館最大的差別是落地區要自己蓋。** 墊子邊緣、墊子之間的縫、斜坡與落地區外的石頭是主要傷害來源（Gripped、Kehl、AAC 2025）。墊子會移動，每次嘗試之間都要重整（Climbing 2022）。
2. **spot 的目的只有一個共識：護頭頸、讓人落在墊上。** 接人是錯的（AAC 1986、Climbing、REI、CWA）。spotter 本身會受傷（AAC 1986 腓骨骨折、2022 胸部瘀傷）。
3. **傷害資料幾乎都是岩館或混合樣本。** 戶外抱石專屬資料只有瑞典 9 人、Josephsen 2007 的室內外比較。寫作要明說「研究多來自岩館」。
4. **高抱石沒有固定高度。** 15 呎（約 4.5 m）是 Climbing 的「gym line」，20 呎是 spot 失效線；論壇認為落地與難點位置比高度更重要。多數來源給一般人的建議是改架頂繩（Climbing 2021、Boone Speed、John Gill 前例）。
5. **top out 與下山路是戶外才有的風險。** AAC 兩例都是卡在 top out 想下攀時出事（手點斷）；1990 例是一個人爬太高下不來。topo 的「下山路線」與探勘要寫進高抱石篇。
6. **禮儀的核心是保住岩場使用權。** 停車、噪音、粉與 tick mark、墊子放在耐踩地面、不拖墊、垃圾與藏墊帶走（Access Fund、日本、香港）。濕砂岩不爬（Font）。
7. **台灣有十個左右已開發抱石區、兩本指南書。** 北部：中和禪寺（捷運可達）、鼻頭、東北角海岸（第二本書）、大豹、小烏來；中部：泰安、麗陽、水長流、瑞龍、平瀨；宜蘭：南澳碧侯。泰安有岩館提供的公用墊；原岩出租抱石墊。
8. **台灣特有條件：多雨長青苔、颱風與溪水改變落地。** 第二本書明說第一本書的山區岩場被雜草青苔重新覆蓋；水長流路線因溪水暴漲改變；TOKYO POWDER 寫颱風損壞岩場。日本御岳也有河原落地被沖走的例子，可對照。

## 來源之間的矛盾（寫作時並列，不選邊）

| 議題 | A 說 | B 說 |
|---|---|---|
| 墊子能不能疊 | Climbing 2022：除非是全新墊，多層墊通常沒問題，「要完全平整」是誤解 | Kehl（Climbing／Rock and Ice）：多數傷害來自墊子邊緣，平鋪不疊；要疊就像拼圖減少外露邊緣；Gripped：踩墊子邊緣是常見扭傷原因 |
| spotter 何時出手 | Climbing 2022：讓對方先落到墊上、身體收縮後再上前護頭 | AAC 1986：手臂插到腋下穩住；AAC 2025：highball 比較像用力推一把讓人留在墊上 |
| 戶外要不要 spot | Climbing 2022：戶外幾乎都該 spot；CWA：戶外更常需要 | Gripped：低矮前傾題、直上低 top out 不需要；Boone Speed：多數時候寧願自己 spot 自己；super highball 例外 |
| spotter 越多越好？ | REI：「Having more spotters is always better」 | Climbing：「一個懂的勝過六個混的」 |
| 預防措施有沒有用 | 各家共識：多墊、spot、練落地 | Josephsen 2007：「Traditional preventative measures were ineffective」（摘要未定義措施內容） |
| 高抱石定義 | Climbing：15 呎 gym line；論壇：10 呎、15–20 呎 | 論壇：看落地與難點位置；可類比 R 級 |
| highball 戴頭盔 | AAC 2017 編輯以問句提出「值得考慮？」 | 其他來源都沒提；沒有共識 |
| 坐姿起攀加墊 | Climbing：墊高起攀是壞風格；香港：sds 最多一張墊 | 香港：碰不到指定點的矮個子可以例外加墊 |
| 穿鞋踩墊 | 海外：墊子是工具，穿鞋踩很常見 | 日本：不穿外鞋踩墊、擦鞋或鋪防水布 |
| 刷子 | Access Fund：砂岩用豬鬃軟刷、花崗岩用尼龍刷 | BMC：Font 砂岩連一般抱石刷都太硬，用很軟的掃帚刷 |
| 戶外難度 | 中和禪寺作者：戶外不安感讓難度感覺偏硬，比岩館可能要調降 | 泰安 MP 頁英文 VB–V11、中文 VB–V9，同一頁就不一致 |
| 墊子命名 | Beta-gear：burrito＝有 hinge，taco＝無折線 | 常見用法可能相反；寫文改用「有沒有折線」 |

## 台灣用語

| 英文 | 台灣常見說法 | 系列用法 |
|---|---|---|
| crash pad / bouldering mat | 抱石墊（原岩、M2C、黑鑽台灣都這樣寫） | 抱石墊 |
| spot / spotter | spot、保護（站內〈抱石解題〉用 spot） | 「spot（保護）」首次括號，之後用 spot |
| landing zone / fall zone | 落地區 | 落地區 |
| highball | highball（MP 麗陽頁中文也直接寫 highball）、高抱石 | 標題用「高抱石」，內文首次「高抱石（highball）」，之後兩者都可 |
| topo | topo、路線圖 | topo，首次括號「路線圖」 |
| sit start (sds) | 坐姿起攀、sit start | 坐姿起攀（sit start，topo 常寫 sds） |
| top out | top out、登頂、翻上去 | top out（翻上石頭頂） |
| downclimb | 下攀（站內已用） | 下攀 |
| tick mark | tick mark、粉記號 | tick mark（用粉做的記號） |
| natural / outdoor bouldering | 戶外抱石、天然抱石（兩本指南書用「天然抱石」） | 戶外抱石；提到指南書時沿用「天然抱石」 |
| approach | approach、接近路線 | 接近 |
| dab | dab | dab，首次解釋 |

## 待解問題

1. 台灣抱石區的土地與管理單位：泰安河床、麗陽、水長流、鼻頭海岸、中和禪寺（寺方土地？）是否有明文規定或默許？目前沒找到任何管理處公告。寫台灣篇前要查河川局、國家風景區（東北角暨宜蘭海岸）、寺方的說法，查不到就明寫「沒有找到公告」。
2. 第二本書的「大野狼與小綿羊岩」位置：頁面只說東北角海岸，未寫地名；是否與鼻頭抱石區同一處要再確認。
3. Josephsen 2007 的「傳統預防措施」具體是什麼：需要全文。拿不到全文就只引摘要原句。
4. Access Fund〈Four Simple Strategies for Low-Impact Bouldering〉今天 404，要找 Wayback 存檔副本。
5. theCrag 台灣抱石頁與 udn〈天然抱石領路者〉沒讀到，寫台灣篇時換工具重試（瀏覽器或其他 reader）。
6. 泰安岩館公用墊（9 張）現在還在不在：MP 頁未標日期；要找近一年的貼文確認。
7. 台灣有沒有戶外抱石的課程或工作坊固定在辦（新竹風城 2024、gumbybear 2024-12）：寫 order 0 的「找人帶」段落要查現況。
8. 戶外抱石墊的價格區間（台灣售價）與租借店家清單：目前只有原岩南港一家的價目。
