#!/usr/bin/env node
// 從 .work/research/thailand-crags/routes/ 的 JSON 產生 .research/2026-10-21-thailand-crag-<slug>.md 的證據筆記。
// 格式依 crag-guide-contract：## Sources opened（每個來源一個 bullet，URL 不截斷）＋## Dropped / not used ＋逐線路線列。

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const R = '.work/research/thailand-crags/routes';
const OUT = '.research';
const DATE = '2026-10-21';

const specs = [
  {
    slug: 'thailand-crags-overview',
    title: '泰國岩場總覽 evidence',
    scope: '泰國 11 個岩場的總覽（喀比海島與本島、清邁與清道、華富里、北標、南邦、龜島）——選區、季節、入境、岩栓現況與指南書的分工。讀者決定：這趟要去海島、內陸還是中部山谷，以及出發前哪些事必須自己再查。',
    sources: [
      ['theCrag 泰國', 'https://www.thecrag.com/en/climbing/thailand', 'Tonsai 448 條、Railay 314 條、Krabi Mainland 346 條、Crazy Horse 289 條、Chiang Dao 61 條、Lampang 25 條、Koh Tao 496 條、North Wall 103 條、Chong Phli 157 條、Namphapayai 101 條、Khao Jeen Lae 127 條；各岩場的進入規定與子區結構'],
      ['Mountain Project 泰國', 'https://www.mountainproject.com/area/105894648/thailand', '喀比地區 15 個區域的經典路線表（名稱、YDS、FR、類型、所屬子區）與路���數 381 條（Tonsai 200、Railay East 93、Railay West 48、Phra Nang 40）'],
      ['CMRCA: Getting to Crazy Horse', 'https://www.thailandclimbing.com/climber-info/getting-to-crazy-horse', '接駁車 08:30 出發、16:30 回程、至少 4 人成行、來回 495 THB'],
      ['CMRCA: Lampang climbing weekends', 'https://www.thailandclimbing.com/lampang-climbing-weekends', '南邦岩場的登記與嚮導在場要求、距市區 30 分鐘車程'],
      ['CMRCA: Crazy Horse 封閉公告頁', 'https://www.thailandclimbing.com/crazy-horse-closure', '2018-07 起的封閉公告頁；頁面仍在線上但未標日期'],
      ['外交部領事事務局：泰國入境', 'https://www.boca.gov.tw/sp-foof-countrycp-03-24-dec45-02-1.html', '2026-09-15 起台灣護照免簽 30 天、護照效期 6 個月、回程機票、訂房紀錄、每人 2 萬泰銖現金（信用卡不算）、TDAC 72 小時內免費'],
      ['justclimbthailand: The Pocket Guide – Thailand', 'https://justclimbthailand.com/krabi-climbing-guidebook', 'Sirichai Pongsopon 第 10 版、2026-01 全面更新、238 頁、1,000 THB；收 Railay 與 Tonsai 800 條以上與南泰 100 條以上，2026 版更新 North Wall 與 Chong Phli 的路線圖'],
      ['justclimbthailand: 租借', 'https://justclimbthailand.com/climbing-equipment-sale-and-rental/', 'Tonsai 全日租借價格（繩 500、快扣 12 支 400 THB）'],
      ['Koh Yao Noi 官方體驗頁', 'https://koyao.com/experiences/rock-climbing', '官方體驗頁沒有提供攀岩項目；2017 年起的官方禁止只由這個一手頁面與行程筆記交叉'],
      ['Crag Chemistry: Thailand crags', 'https://cragchemistry.com/2025/09/02/thailand-crags-2/', '鈦栓在當地使用逾 20 年、紀錄到的失效非常少；UIAA 十年測試 304 不鏽鋼「情況很糟」、316 表面腐蝕、鈦「像新的」'],
      ['GoFundMe: Thaitanium Project', 'https://www.gofundme.com/f/thaitanium-project', '募款頁只寫「約三分之二的路線已重打」；官網已收掉，舊網域為垃圾站'],
    ],
    dropped: [
      ['Thaitanium Project 官網', 'https://thaitaniumproject.com', '2026-10 查證時已收掉，舊網域是博弈垃圾站，不引用其內容'],
      ['siamwithme 喀比攀岩指南（2026-09）', 'https://siamwithme.com/2026/09/07/krabi-rock-climbing-guide-railay-and-tonsai/', '二手整理文，只用來交叉確認深水抱石合法性有爭議這件事，不引用其價格與路線'],
    ],
  },
  {
    slug: 'thailand-crag-ao-nang-north-wall',
    title: 'Ao Nang North Wall evidence',
    scope: 'Ao Nang 市區內的 North Wall（theCrag 103 條，6 個子區）——全鈦栓、50 THB 入場費、停車與竊賊兩條警告、兩個子區的蜂巢與鳥巢警告。讀者決定：要不要從市區走過去、停哪裡、哪些線不要碰。',
    sources: [
      ['theCrag: The North Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/1720715394', '103 條路線、6 個子區（Mythical Beasts 24、Hello Welcome 5、Jurassic X-Mas 24、Life of Leif 19、Rock\'n Roll 28、NW Bouldering 3）、FR 4b+–9a、10,003 次攀登；入場費 50 THB、裝備租借、兩間廁所；停車警告「MUST Park Outside」與竊賊警告；禁鑽孔；私人土地'],
      ['theCrag: Mythical Beasts', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/3096172467', '24 條逐線路線、級數、長度、星等與岩栓備註；2016 年聖誕節 Rock & Sun 開的最初兩條'],
      ['theCrag: Jurassic X-Mas', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/1720720308', '24 條逐線路線；子區警告「Flora and Fauna: Update: Hornet situation as of 9.3.2026」（Dr. Desire 附近大蜂巢，靠近 Santa Sends）'],
      ['theCrag: Rock\'n Roll', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/1720722477', '28 條逐線路線；子區警告「Flora and Fauna: Bird nest」；含 8a Can I Play with Madness 與 8a Air Jordan'],
      ['theCrag: Life of Leif', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/1731685974', '19 條逐線路線與岩栓備註'],
      ['theCrag: Krabi Mainland', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/3084507318', 'Krabi Bolting Fund 資助計畫、禁鑽孔規範（繼承至所有子區）'],
      ['Krabi Bolting Fund', 'https://ko-fi.com/krabiboltingfund', '喀比本島岩栓維護的資助管道'],
    ],
    dropped: [
      ['Instagram: North Wall 貼文', 'https://www.instagram.com/reel/C2pceGuSH0Q/', '社群貼文只說「目前有 4 個區、89 條路線」，與 theCrag 的 103 條不符，不引用其數字'],
    ],
  },
  {
    slug: 'thailand-crag-chong-phli',
    title: 'Chong Phli 靈山 evidence',
    scope: 'Chong Phli / Spirit Mountain（theCrag 157 條，10 個子區）——約 90% 鈦栓、每年檢查確保點、可住宿的岩場。讀者決定：住岩場旁還是市區、哪一面牆、繩要帶多長。',
    sources: [
      ['theCrag: Chong Phli - Spirit Mountain', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain', '157 條路線、10 個子區、FR 4b+–9a、5,889 次攀登；「約 90% 鈦栓、軟岩質路段用吊帶、所有確保點與吊帶每年檢查」；私人土地的三條規定（尊重、禮貌、帶走垃圾）；岩場旁的民宿與社區中心；接近路線'],
      ['theCrag: The Lounge / Main face', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain/area/7812486', '25 條逐線路線，含 Scorpion、Red Planet、Scorpion Queen 的完整說明'],
      ['theCrag: The Mezzanine / Main face', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain/area/7883934', '25 條逐線路線，含 Snow Leopard 8b、Sumo King 8a+ 65 m、White Lion 8b'],
      ['theCrag: The Ego Free Zone / Main face', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain/area/8023452', '32 條逐線路線，含 KGB Extreme 8b、Predator 8a'],
      ['theCrag: Machete Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain/area/1005478998', '21 條逐線路線，含 Frankenstein 8c/c+ 開放專案'],
      ['theCrag: Sweet Brown Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain/area/961193676', '6 條逐線路線，含 Lord Jesus 8a'],
      ['theCrag: The Far Side', 'https://www.thecrag.com/en/climbing/thailand/krabi/chong-phli-spirit-mountain/area/961193106', '10 條逐線路線'],
    ],
    dropped: [
      ['Instagram: Chong Phli 貼文', 'https://www.instagram.com/', '未能取得可引用的一手內容'],
    ],
  },
  {
    slug: 'thailand-crag-railay-east',
    title: 'Railay East evidence',
    scope: 'Railay 東岸（Muay Thai、One-Two-Three、The Keep、Hidden World、Low Tide Wall、Jungle Gym、Duncan\'s Boot、Diamond Cave 等）——攀岩學校地盤的擁擠時段與逐區岩栓狀況。讀者決定：早上 8 點前還是下午 4 點後去、哪一面牆、哪些線不要碰。',
    sources: [
      ['theCrag: Railay', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13949881', '314 條路線、FR 3b+–8b、19,094 次攀登；「2023 年仍在重打、網站許多資訊已過時」；19 個子區的結構'],
      ['theCrag: Muay Thai', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687313', '24 條逐線路線；「永遠擠滿攀岩學校和觀眾」；Reaching Like a Monkey 未用鈦栓重打；Piece of Cake、No Name、Deborah 舊膨脹栓不可爬'],
      ['theCrag: One-Two-Three', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687337', '31 條逐線路線；左側三條舊膨脹栓、Kratoy 四條延伸與 Gandalf 8a+ 不可爬；Massage Secrets 只有 P1、P2 能爬'],
      ['theCrag: Diamond Cave', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13949929', '28 條逐線路線；北面左側三條不可爬、Keep the Jam Man 只有 P1/P2 重打、洞內舊路線因國家公園不能再爬'],
      ['theCrag: The Keep', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13950673', '9 條逐線路線'],
      ['theCrag: Hidden World', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13950577', '8 條逐線路線；Rocket Head 有蜂巢警告'],
      ['theCrag: Low Tide Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13950601', '9 條逐線路線；High Tide、Camp Seven、Via Maria 不可爬；Strider (Direct) 8a+ 無岩栓'],
      ['theCrag: Jungle Gym', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13950553', '15 條逐線路線，其中 9 條不可爬；Jungle Gym 與 Blade Runner 是無岩栓的傳統攀登路線'],
      ['theCrag: Duncan\'s Boot', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/13950625', '10 條逐線路線；Falling in Love 不可爬'],
      ['Mountain Project: Railay East', 'https://www.mountainproject.com/area/105894705/railay-east', '東岸經典路線表，跨子區交叉核對'],
    ],
    dropped: [
      ['UKC: Railay 2026 重打名單', 'https://ukclimbing.com/', '只有會員牆面可見，未能取得可引用的公開頁'],
    ],
  },
  {
    slug: 'thailand-crag-railay-west-phra-nang',
    title: 'Railay West 與帕南 evidence',
    scope: 'Railay 西側與帕南海灘（Thaiwand Wall、Candlestick Wall、Wee\'s Present Wall、Escher World、Phra-Nang Beach、Happy Island、The Defile、Universe Wall）——多段名線的下降配置與整批不可爬的子區。讀者決定：多段怎麼排、兩條繩夠不夠、哪一面牆整批不能去。',
    sources: [
      ['theCrag: Thaiwand Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687721', '29 條逐線路線；Lord of the Thais 7b 5 段 120 m、Circus Oz 7a 4 段、Continental Drifters 7c+ 4 段、Inaka 7b 4 段的段數、繩長與下降說明；接近路線全段'],
      ['theCrag: Candlestick Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687793', '5 條逐線路線；四條多段全鈦栓；70 m 繩不夠回到起點；固定繩接近 30 m'],
      ['theCrag: Wee\'s Present Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687721', '20 條逐線路線；全鈦栓線與不可爬線並存'],
      ['theCrag: Phra-Nang Beach', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687765', '24 條逐線路線；Hot Dragon 8b 已關閉、Genesis 7b+ 未用鈦栓重打、Left of Cleft 的臂展級距備註'],
      ['theCrag: Escher World / Tum Choee', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687889', '26 條逐線路線；Fever Dream 8a+ 等六條不可爬'],
      ['theCrag: Happy Island', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687795', '13 條逐線路線；10 條不可爬，僅 King Fisher 7a+ 無警示'],
      ['theCrag: The Defile', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687783', '13 條逐線路線；Crystal Prison 與 Allo, la Terre 不可爬；Khao Pat Gai 7a+ 重打但 crux 無保護'],
      ['theCrag: Universe Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687873', '5 條逐線路線，全部舊生鏽膨脹栓不可爬'],
      ['Mountain Project: Railay West', 'https://www.mountainproject.com/area/105894699/railay-west', '西側經典路線表，跨子區交叉核對'],
    ],
    dropped: [
      ['theCrag: Happy Island 照片說明', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687795/photos', '只有照片，無文字事實'],
    ],
  },
  {
    slug: 'thailand-crag-tonsai',
    title: 'Tonsai 通賽島 evidence',
    scope: 'Tonsai（theCrag 448 條，23 個子區）——最多路線也最擁擠的島，兩個整區關閉、多段密集、岩栓狀況逐線不同。讀者決定：住哪一側、避開哪幾條、多段要帶幾條繩。',
    sources: [
      ['theCrag: Ton Sai', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/3097160649', '448 條路線、25,344 次攀登、FR 4a–9a；24 個子區；「5c 到 8c、三維石灰岩、巨大 jug 到小 pocket、鐘乳石、tufa、洞穴」；無公路、長尾船只在白天行駛；不可露營'],
      ['theCrag: Ton Sai Wall & Roof', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687961', '64 條逐線路線；Humanity 6b+ 110 m 7 段的段數與「Dangerous and never climbed」警告'],
      ['theCrag: Dum\'s Kitchen', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15687937', '36 條逐線路線；Greed 8c+「目前泰國最難的一條攀登」；Beauty and the Beast 與 Aunt Mary Johanna 已關閉'],
      ['theCrag: Fire Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15688129', '21 條逐線路線；雨天乾燥與否取決於風向；Flame Thrower 等不可爬'],
      ['theCrag: Eagle Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15688201', '36 條（Left Side 14／Main Face 17／Lord of the Fives 5）；Mai Rhu Sheu 不可爬、Totem Pole 已關閉'],
      ['theCrag: Melting Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15688153', '21 條逐線路線；Cross Eyed 7b、Black Bird 8b+'],
      ['theCrag: Shadow Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15688273', '12 條，整區標 Closed，每條寫「舊吊帶，不要爬」'],
      ['theCrag: Iguana Park', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/9031319541', '6 條，整區標 Closed'],
      ['theCrag: Big Wave Pillar', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15688033', '7 條逐線路線；Big Wave 6b 110 m、Short Wave 6a+ 已關閉'],
      ['theCrag: Resort Cave', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/3115780452', '6 條；Sysiphus 8a 與 Sissyfuss 8b 共用起步與確保點；另 4 條舊膨脹栓不可爬'],
      ['theCrag: Generator Wall', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/15688297', '6 條；5 條寫「舊吊帶，準備自己更換」'],
      ['theCrag: Monkey World', 'https://www.thecrag.com/en/climbing/thailand/krabi/area/10833284451', '15 條逐線路線；兩條多段有藤蔓擋住通往 belay ledge 的警告；Holy Wall 不可爬'],
      ['thetopo: Ton Sai 描述', 'https://www.thetopo.com/crags/ton-sai/description', 'Generator Wall「尚未重打，強烈不建議攀爬」'],
      ['Basecamp Tonsai 2025-10 住宿現況', 'https://basecamptonsai.substack.com/p/how-to-tonsai', '營業中與永久關閉的住宿名單、Basecamp 每晚 700–950 THB、訂金 100 歐元、至少 5 晚、旺季 12 月中到 3 月初'],
      ['Railay: 換栓計畫', 'http://www.railay.com/railay/climbing/climbing_rebolting.shtml', '實際重打清單在當地店內的列印表；沒有公開線上版本'],
    ],
    dropped: [
      ['Thaitanium Project 官網', 'https://thaitaniumproject.com', '已收站，舊網域是垃圾站'],
    ],
  },
  {
    slug: 'thailand-crag-lopburi',
    title: '華富里 Khao Jeen Lae evidence',
    scope: '華富里（theCrag 127 條，6 個子區）——寺院規定、每天 20 人名額、18:00 離場、兩種接近方式與三份舊版路線圖。讀者決定：要不要事先登記、走哪條接近、幾點必須走。',
    sources: [
      ['theCrag: Khao Jeen Lae', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair', '127 條路線、FR 3a–8a、1,078 次攀登；寺院的四項規定（打招呼、捐 20–100 THB、2023-03 起每天 20 人上限、18:00 前離開）；兩種接近路徑全文；三份舊版路線圖；停車規定'],
      ['theCrag: Temple Area - Left Side', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair/area/153820599', '20 條逐線路線；Waltz for a Lovely Wife 6a 210 m、Corcovado 6b 140 m、Lum Yai 7a+ 的完整說明'],
      ['theCrag: Secret Garden Area - Left Side', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair/area/153820617', '30 條逐線路線'],
      ['theCrag: Sukhumvit (Red Wall)', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair/area/9152797218', '15 條逐線路線；Cowboy Rider 7a 的掛片鬆動警告、Time Capsule 6b 85 m 四段'],
      ['theCrag: Star Wall', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair/area/8768556384', '10 條逐線路線；Death Star 6c 120 m 六段'],
      ['theCrag: Kitchen Wall', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair/area/153820591', '19 條逐線路線'],
      ['theCrag: Easter Island', 'https://www.thecrag.com/en/climbing/thailand/lop-buri-khao-jeen-lair/area/153820719', '2 條逐線路線；The Fakir 6a+ 44 m、Gillette Road 6b+ 43 m'],
      ['TCDA 泰國攀岩發展協會', 'https://www.thaiclimbassociation.org/', '2016 年成立的非營利協會；2017 與 2023 版路線圖的製作者'],
      ['Central & Northeast Thailand Rock Climbing Guidebook', 'https://shop.kineticsclimbing.com.sg/en/training-accessories/259-rock-climbing-thailand-guidebook.html', 'Matthieu Le Gall、Pleum Chenaphun 第 1 版 2018、350 條以上、SGD 34.90、收益全數用於泰國打栓與重打；**涵蓋清單裡沒有華富里**'],
    ],
    dropped: [
      ['gohobo: 華富里租借', 'https://gohobo.net/thailand/lopburi/climbing-caving', '沒有標日期，無法確認價格是否仍有效'],
    ],
  },
  {
    slug: 'thailand-crag-nam-pha-pa-yai',
    title: '北標 Nam Pha Pa Yai evidence',
    scope: '北標營地（theCrag 101 條，4 個子區）——主牆 River Wall 自 2024 年 1 月關閉但營地仍開放，其餘三面牆與營地資訊。讀者決定：主牆重開值不值得等、現在能不能去、住營地有沒有價值。',
    sources: [
      ['theCrag: Namphapayai Camp', 'https://www.thecrag.com/en/climbing/thailand/namphapayai-camp', '101 條路線、FR 4a–8b、1,526 次攀登；4 個子區（River Wall 65、Bat Cave Wall 17、Peaceful Wall 12、School Wall 7）；100 THB 吊索與停車費、4–6 月休園；營地住宿描述；過河吊索與 10 分鐘接近'],
      ['theCrag: River Wall', 'https://www.thecrag.com/en/climbing/thailand/namphapayai-camp/area/410693532', '65 條逐線路線；頁面警告「Supposedly closed climbing access a year ago, no signs if it\'s changed yet」（建立於兩年前）'],
      ['theCrag: Bat Cave Wall', 'https://www.thecrag.com/en/climbing/thailand/namphapayai-camp/area/410704308', '17 條逐線路線；Zero Point Energy 6a 的獨特攀法、Yin Yang 7a+ 的評語'],
      ['theCrag: Peaceful Wall', 'https://www.thecrag.com/en/climbing/thailand/namphapayai-camp/area/2547133947', '12 條逐線路線'],
      ['theCrag: School Wall', 'https://www.thecrag.com/en/climbing/thailand/namphapayai-camp/area/616000071', '7 條逐線路線'],
      ['Mountain Project: Phasak River Wall', 'https://www.mountainproject.com/area/110369736/phasak-river-wall-closed-indefinitely', '另一個獨立頁面把主牆標為「closed indefinitely」'],
      ['North Pa Pa Yai 營地官網', 'http://nppy.camp/rock-climbing/', '營地自己的岩場說明、FAQ 與住宿頁'],
    ],
    dropped: [
      ['Facebook: 北標攀岩營地社團', 'https://www.facebook.com/groups/climbingbkk/', '需登入才能看貼文，無法引用具體日期的公告'],
    ],
  },
  {
    slug: 'thailand-crag-crazy-horse',
    title: 'Crazy Horse 清邁 evidence',
    scope: 'Crazy Horse（theCrag 289 條，22 個子區）——北泰開發最完整的岩場，但開放狀態至今沒有官方重開公告。讀者決定：2027 年能不能去、要問誰、坐接駁還是自駕。',
    sources: [
      ['theCrag: Crazy Horse', 'https://www.thecrag.com/en/climbing/thailand/chaing-mai', '289 條路線、22 個子區、FR 4a–8b、8,408 次攀登；「北泰主要運動攀岩區」；描述另寫「約 150 條路線」（與 289 條的落差）；45 分鐘車程、CMRCA 辦公室買指南 500 THB 與接駁；土路停車場與步行上坡 10–15 分鐘'],
      ['theCrag: Heart Wall', 'https://www.thecrag.com/en/climbing/thailand/chaing-mai/area/218311449', '36 條逐線路線；從停車場走 15 分鐘；泰文路線名與評語'],
      ['theCrag: Crazy Horse Area', 'https://www.thecrag.com/en/climbing/thailand/chaing-mai/area/13950673', '33 條逐線路線；A Wild Ride on a Crazy Horse 8a+ 只有 0 次攀登'],
      ['theCrag: Reunion Buttress', 'https://www.thecrag.com/en/climbing/thailand/chaing-mai/area/257550789', '29 條逐線路線；Reunion 6a+ 52 m 3 段、Walk the Plank 7a+ 的洞穴內確保點'],
      ['theCrag: Anxiety State Crisis Cave', 'https://www.thecrag.com/en/climbing/thailand/chaing-mai/area/13950625', '24 條逐線路線；In Deep Space 5c 80 m 4 段、The Darkness Beckons 6a+ 70 m 5 段'],
      ['theCrag: Little Monkey Cove', 'https://www.thecrag.com/en/climbing/thailand/chaing-mai/area/13950457', '25 條逐線路線；全區最低級距（4 到 7a+）'],
      ['CMRCA: Crazy Horse 封閉公告頁', 'https://www.thailandclimbing.com/crazy-horse-closure', '2018-07 起的封閉公告；頁面仍在線上但未標更新日期'],
      ['CMRCA: 2024-08 連署呼籲重開', 'https://www.thailandclimbing.com/blog/help-re-open-crazy-horse-buttress', '2024-06 又出現禁止告示後發起的請願；CMRCA 相關分類的最後一篇'],
      ['重開請願書（2022-09）', 'https://www.change.org/p/petition-to-reopen-crazy-horse-buttress-for-climbing-and-outdoor-activities', '2022-09 重開的請願書內容'],
      ['UKC: Crazy Horse Buttress', 'https://www.ukclimbing.com/logbook/crags/crazy_horse_buttress-3036', '「據 CMRCA 表示已重開」的轉述（二手，非官方公告）'],
      ['The Crag Journal: Climbing in Thailand（2023）', 'https://thecragjournal.com/2023/02/01/climbing-in-thailand-a-journey-through-south-east-asia/', '2023 年到當地的現場記錄；Crazy Horse 現場狀況'],
      ['A Guide to Rock Climbing in Northern Thailand', 'https://www.thailandclimbing.com/climber-info', 'CMRCA Press 第 3 版、220 頁、500 THB、北泰 18 個分區 150 段以上；**出版年份未查到**'],
    ],
    dropped: [
      ['change.org 以外的 2026 年重開傳聞', 'https://www.instagram.com/p/DdT4H4xGmb-/', '單一社群貼文，無官方文件佐證'],
    ],
  },
  {
    slug: 'thailand-crag-chiang-dao',
    title: '清道 Chiang Dao evidence',
    scope: '清道（theCrag 61 條，6 個子區）——國家公園內的默許岩場、主牆 Padaeng 30 條、公園封閉等於岩場封閉。讀者決定：默許狀態下要不要去、避開哪個月的封閉、怎麼到。',
    sources: [
      ['theCrag: Chiang Dao', 'https://www.thecrag.com/en/climbing/thailand/mae-hong-son/area/617290752', '61 條路線、FR 5b–8a+、275 次攀登；6 個子區與各自路線數；「Pha Daeng 是主牆、路線最多也最容易到」；「約 100 條好岩質路線」；Tolerated 的完整說明（2019 立牌、後來燒掉、被要求停止就配合、農田事件、公園封閉等於岩場封閉）'],
      ['theCrag: Padaeng / Main Wall', 'https://www.thecrag.com/en/climbing/thailand/mae-hong-son/area/3122001375', '30 條逐線路線；Red Dragon 7b+ 需 40 m 繩下降、Once a Thief 8a+ 需 80 m 繩、Long Doo Si 8a+ 由 7c 上調'],
      ['theCrag: Pit Stop', 'https://www.thecrag.com/en/climbing/thailand/mae-hong-son/area/3122001435', '11 條；第二熱門的牆'],
      ['泰國觀光局: Pha Daeng 國家公園', 'https://www.tourismthailand.org/Attraction/pha-daeng-national-park', '公園現名（原名清道國家公園）'],
      ['Nation Thailand: 清道 2025 年防火封閉', 'https://www.nationthailand.com/news/general/40047108', '清道野生動物保護區 2025-03-01 至 05-15 因防火封閉'],
      ['BudgetCatcher: Pha Daeng 國家公園', 'https://budgetcatcher.com/pha-daeng-national-park/', '107 號公路轉 1178 號公路、約 90–110 km、車程約 1.5 小時'],
      ['A Guide to Rock Climbing in Northern Thailand', 'https://www.thailandclimbing.com/climber-info', 'CMRCA Press 第 3 版、220 頁、500 THB；**出版年份未查到**'],
    ],
    dropped: [
      ['Mountain Project: Pha Daeng', 'https://www.mountainproject.com/area/200346403/pha-daeng', '頁面可讀但沒有逐線路線資料，不作為路線來源'],
    ],
  },
  {
    slug: 'thailand-crag-lampang',
    title: '南邦 Lampang evidence',
    scope: '南邦（theCrag 25 條，3 個子區）——北泰最新的岩場，卻在軍方土地必須向 CMRCA 登記並由嚮導在場。讀者決定：要不要先聯絡 CMRCA、能不能接受只在嚮導在場的日子開放、值不值得從清邁開過去。',
    sources: [
      ['theCrag: Lampang', 'https://www.thecrag.com/en/climbing/thailand/area/5727439374', '25 條路線、FR 5b–6c+、43 次攀登、3 個子區；「北泰最新岩場、距市區 30 分鐘、CMRCA 開發、50 條以上含多段、鬆石仍多要戴頭盔」；Paid + Private 的軍方土地說明；頁面自述「This crag does not have a description」'],
      ['theCrag: The Veteran Wall', 'https://www.thecrag.com/en/climbing/thailand/area/5727486399', '11 條逐線路線；全部為 2019 年 5–6 月由 Ooan Kongsingh、Apichart Korkeaw 等開發'],
      ['theCrag: The Ranger wall', 'https://www.thecrag.com/en/climbing/thailand/area/5727446778', '10 條逐線路線；Apollo 7 6c 35 m、Dropping Bombs 6b+ 23 m'],
      ['CMRCA: Lampang climbing weekends', 'https://www.thailandclimbing.com/lampang-climbing-weekends', '必須事先向 CMRCA 登記並付費、只在 CMRCA 嚮導在場的日子開放'],
      ['CMRCA: Lampang multipitch guided experience', 'https://www.thailandclimbing.com/courses/lampang-multi-pitch-guided-experience', '多段嚮導行程的存在與形式'],
      ['The Crag Journal: Climbing in Thailand（2023）', 'https://thecragjournal.com/2023/02/01/climbing-in-thailand-a-journey-through-south-east-asia/', '2023 年到南邦時被告知無法攀登（當時狀態，非現在）'],
      ['A Guide to Rock Climbing in Northern Thailand', 'https://www.thailandclimbing.com/climber-info', 'CMRCA Press 第 3 版、220 頁、500 THB；**出版年份未查到**'],
    ],
    dropped: [
      ['Tripadvisor: Lampang 攀岩一日遊', 'https://www.tripadvisor.com/', '商業評價，無法作為進入規定的來源'],
    ],
  },
  {
    slug: 'thailand-crag-koh-tao',
    title: '龜島 Koh Tao evidence',
    scope: '龜島（theCrag 496 條，15 個子區）——泰國唯一以花崗岩抱石為主的岩場，打栓要先問俱樂部，三個抱石區有潮汐與磨損岩條件。讀者決定：要不要帶自己的墊子、去哪個區、能不能自己打栓。',
    sources: [
      ['theCrag: Koh Tao', 'https://www.thecrag.com/en/climbing/thailand/koh-tao', '496 條路線、FB 級數 1A+–8A+、2,284 次攀登、15 個子區與路線數；「an amazing granite paradise」；Rakkup App 指南（US$8，收入全數投入路線開發與維護）；「未經 Koh Tao Climbing Club 許可不要打栓」「不要亂丟垃圾」；部分岩場進入敏感、租借在 Goodtime Adventures 與 The Bunker；渡輪與蘇梅島機場'],
      ['theCrag: Golden View', 'https://www.thecrag.com/en/climbing/thailand/koh-tao/area/1226641539', '28 條逐線路線；Titan 6c+ 是島上第一條鈦栓路線；Le Point Perdu 6b 的鬆動岩栓與掛片警告；Kun Touat Project 的混合標法；接近路線與「Designated」進入狀態'],
      ['theCrag: Boulders 1, 3, 4, 5 and 6', 'https://www.thecrag.com/en/climbing/thailand/koh-tao/area/9999838695', '22 條；Boulder 5 標「Abrasive rock」；含 8A 的 Flat friends 與 8A+ 的 Catalonia is not spain'],
      ['theCrag: Backyard & Frontyard', 'https://www.thecrag.com/en/climbing/thailand/koh-tao/area/1226641539', '123 條；全區最大的一區'],
      ['Rakkup: Koh Tao Rock Climbing 指南', 'https://rakkup.com/guidebooks/thailand-koh-tao-rock-climbing/', 'US$8 的 App 指南；收益全數投入路線開發與維護'],
      ['Koh Tao Climbing Club（Facebook）', 'https://www.facebook.com/Climbingkohtao', '每週五出門攀岩；進入敏感區域的問答管道'],
      ['The Bunker Climbing Gym & Hostel', 'https://kohtao-rockclimbing.com/', '島上唯一的室內岩館、住宿與免費 PDF 指南的 QR code 取用點'],
    ],
    dropped: [
      ['mapotapo: Koh Tao 導覽', 'https://thenextline.mapotapo.com/p/koh-tao', '第三方導覽平台，無原始出處可回溯'],
    ],
  },
];

function routeRows(files) {
  const lines = [];
  for (const f of files) {
    const p = join(R, f);
    if (!existsSync(p)) continue;
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    // 三種形狀：{sector, routes:[...]}／[{sector, routes:[...]}]／[{sector, grade, name, ...}] 扁平列
    const o = Array.isArray(raw) ? raw[0] : raw;
    if (Array.isArray(raw) && raw[0] && raw[0].grade) {
      for (const r of raw) {
        const bits = [r.grade, r.name];
        if (r.length) bits.push(r.length);
        if (r.stars) bits.push(`★${r.stars}`);
        let row = `${r.sector}: ${bits.filter(Boolean).join(' ')}`;
        if (r.warnings && r.warnings.length) row += ` ⚠ ${r.warnings.join(' / ')}`;
        lines.push(row);
      }
      continue;
    }
    if (!Array.isArray(raw) && raw.named_routes) {
      for (const r of raw.named_routes) {
        const bits = [r.grade, r.name];
        if (r.length) bits.push(r.length);
        if (r.stars) bits.push(`★${r.stars}`);
        lines.push(`Named route: ${bits.filter(Boolean).join(' ')}`);
      }
      for (const sec of raw.sectors || []) {
        lines.push(`Sector ${sec.name}: ${sec.routes} routes, ${sec.height || '—'}`);
      }
      continue;
    }
    const sector = o.sector || o.subarea || f.replace('.json', '');
    for (const r of o.routes || []) {
      const bits = [r.grade, r.name];
      if (r.length) bits.push(r.length);
      if (r.stars) bits.push(`★${r.stars}`);
      let row = `${sector}: ${bits.filter(Boolean).join(' ')}`;
      if (r.warnings && r.warnings.length) row += ` ⚠ ${r.warnings.join(' / ')}`;
      lines.push(row);
    }
  }
  return lines;
}

const routeFiles = {
  'thailand-crags-overview': [],
  'thailand-crag-ao-nang-north-wall': ['north-wall/mythical-beasts.json', 'north-wall/hello-welcome.json', 'north-wall/jurassic-x-mas.json', 'north-wall/life-of-leif.json', 'north-wall/rock-n-roll.json', 'north-wall/nw-bouldering.json'],
  'thailand-crag-chong-phli': ['chong-phli/the-lounge-main-face.json', 'chong-phli/the-mezzanine-main-face.json', 'chong-phli/the-ego-free-zone-main-face.json', 'chong-phli/machete-wall.json', 'chong-phli/sweet-brown-wall.json', 'chong-phli/the-far-side.json', 'chong-phli/hearth-cave.json', 'chong-phli/music-wall.json', 'chong-phli/wild-child-wall.json', 'chong-phli/the-cave-hoi-cave.json'],
  'thailand-crag-railay-east': ['railay/muay-thai.json', 'railay/one-two-three.json', 'railay/diamond-cave.json', 'railay/the-keep.json', 'railay/hidden-world.json', 'railay/low-tide-wall.json', 'railay/jungle-gym.json', 'railay/duncans-boot.json'],
  'thailand-crag-railay-west-phra-nang': ['railay/thaiwand-wall.json', 'railay/candlestick-wall.json', 'railay/wees-present-wall.json', 'railay/phra-nang-beach.json', 'railay/escher-world-tum-choee.json', 'railay/happy-island.json', 'railay/the-defile.json', 'railay/universe-wall.json'],
  'thailand-crag-tonsai': ['ton-sai/ton-sai-wall-roof.json', 'ton-sai/dum-s-kitchen.json', 'ton-sai/fire-wall.json', 'ton-sai/eagle-wall.json', 'ton-sai/melting-wall.json', 'ton-sai/shadow-wall.json', 'ton-sai/iguana-park.json', 'ton-sai/big-wave-pillar.json', 'ton-sai/resort-cave.json', 'ton-sai/generator-wall.json', 'ton-sai/monkey-world.json', 'ton-sai/the-nest-wild-kingdom.json', 'ton-sai/tyrolean-wall.json', 'ton-sai/cat-wall.json', 'ton-sai/the-gibbon-roof.json', 'ton-sai/tiger-wall.json', 'ton-sai/sleeping-indian-wall-mammoth-cove.json', 'ton-sai/lost-wall.json', 'ton-sai/cobra-wall.json', 'ton-sai/temple-boulder-cave.json'],
  'thailand-crag-lopburi': ['lopburi/temple-area-left-side.json', 'lopburi/temple-area-right-side.json', 'lopburi/secret-garden-left-side.json', 'lopburi/secret-garden-right-side.json', 'lopburi/sukhumvit-red-wall.json', 'lopburi/star-wall.json', 'lopburi/kitchen-wall.json', 'lopburi/easter-island.json'],
  'thailand-crag-nam-pha-pa-yai': ['namphapayai/river-wall.json', 'namphapayai/bat-cave-wall.json', 'namphapayai/peaceful-wall.json', 'namphapayai/school-wall.json'],
  'thailand-crag-crazy-horse': ['crazy-horse/heart-wall.json', 'crazy-horse/crazy-horse-area.json', 'crazy-horse/reunion-buttress.json', 'crazy-horse/anxiety-state-crisis-cave.json', 'crazy-horse/little-monkey-cove.json', 'crazy-horse/tamarind-village.json', 'crazy-horse/the-gatekeeper-buttress.json', 'crazy-horse/the-archway.json', 'crazy-horse/the-rooftop.json', 'crazy-horse/the-horse-shoe.json', 'crazy-horse/windy-cave.json', 'crazy-horse/the-junkyard.json', 'crazy-horse/the-hanging-gardens.json', 'crazy-horse/buddha-buttress.json', 'crazy-horse/sentinel-buttress.json', 'crazy-horse/the-aircon-wall.json'],
  'thailand-crag-chiang-dao': ['chiang-dao.json'],
  'thailand-crag-lampang': ['lampang.json'],
  'thailand-crag-koh-tao': ['koh-tao/golden-view.json', 'koh-tao/babaloo.json', 'koh-tao/backyard-and-frontyard.json', 'koh-tao/secret-garden.json', 'koh-tao/tanote-bay.json', 'koh-tao/jansom-bay.json', 'koh-tao/the-dome.json', 'koh-tao/temple-rock.json', 'koh-tao/mek-s-mountain.json', 'koh-tao/lang-khai-yang.json', 'koh-tao/the-elephant.json', 'koh-tao/cabana-north-sairee-beach.json', 'koh-tao/flyin-high.json', 'koh-tao/leam-thian-coast.json', 'koh-tao/mao-rock.json'],
};

for (const s of specs) {
  const out = [];
  out.push(`# ${s.title}`);
  out.push('');
  out.push(`${DATE}. Scope: ${s.scope}`);
  out.push('');
  out.push('## Sources opened');
  out.push('');
  for (const [name, url, facts] of s.sources) {
    out.push(`- ${name} ${url}: ${facts}`);
  }
  out.push('');
  const rows = routeRows(routeFiles[s.slug] || []);
  if (rows.length) {
    out.push('## Exact route rows');
    out.push('');
    for (const r of rows) out.push(`- ${r}`);
    out.push('');
  }
  out.push('## Dropped / not used');
  out.push('');
  for (const [name, url, why] of s.dropped) {
    out.push(`- ${name} ${url}: ${why}`);
  }
  out.push('');
  const p = join(OUT, `${DATE}-${s.slug}.md`);
  writeFileSync(p, out.join('\n'));
  console.log(`${p}  (${rows.length} route rows)`);
}
