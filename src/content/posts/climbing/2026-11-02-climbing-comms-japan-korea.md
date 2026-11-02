---
title: "去日本、韓國攀岩的通訊裝備：對講機法規、租借業者、當地型號與衛星求救"
date: 2026-11-02
category: climbing
tags: [climbing, climbing-gear, multi-pitch, outdoor-climbing, travel, japan, south-korea]
lang: zh-TW
type: guide
description: "台灣的 FRS 對講機在日本、韓國都不能發話。這篇整理兩國的法條與罰則、外國滑雪客實際怎麼處理、當地攀岩者帶哪些機型，以及日本 RadiGo、トランシーバーレンタルセンター、北海道業者與韓國생활무전기的租借和購買選項；最後比較 inReach、PLB、iPhone 衛星 SOS 在日韓能不能用。"
tldr: "日本要有技適標章：短期去就租數位簡易無線（RadiGo 2 天 ¥4,000 起，租用者不用登錄），或在當地買兩台 10 mW 的特定小電力機（約 ¥5,000–10,000／台）。韓國要有 KC 認證的數位生活無線電（424／448 MHz、0.5 W），租一天約 4,400 韓元；類比機 2026 年底停用。衛星求救：inReach 兩國都帶；PLB 日本禁止陸上使用、韓國不允許；iPhone 衛星 SOS 日本可用、韓國不行。"
draft: false
series:
  name: "出國攀岩裝備"
  order: 8
glossary:
  - term: "技適"
    aliases: ["技適マーク", "技術基準適合証明", "適合表示無線設備"]
    definition: "日本《電波法》的技術基準適合證明。機身有技適標章的無線設備，才可能屬於免執照的無線局。"
    context: "台灣 NCC 的審驗標籤不是技適；沒有技適的對講機在日本不能發話。"
  - term: "特定小電力"
    aliases: ["特小", "特定小電力トランシーバー"]
    definition: "日本免執照、免登錄的對講機類別，功率 10 mW 級，用 421／422／440 MHz 附近的頻道。"
    context: "便宜、在量販店買得到，距離短。"
  - term: "數位簡易無線"
    aliases: ["デジ簡", "デジタル簡易無線", "登録局", "3R"]
    definition: "日本 351 MHz 的數位對講機類別，功率可到 5 W。擁有者要向總務省登錄；租來的機器由業者登錄，租用者不用辦手續。"
    context: "日本山岳嚮導用來在多繩距和多隊之間聯絡。"
  - term: "生活無線電"
    aliases: ["생활무전기", "생활무선국", "生活無線局"]
    definition: "韓國免申報的對講機類別：KC 認證、424／448 MHz、0.5 W 以下、天線與機身一體。外國人也可以用。"
    context: "類比機只能用到 2026-12-31，2027 年起只剩數位機。"
---

> 🌏 [English version](/posts/climbing/2026-11-02-climbing-comms-japan-korea-en)

在龍洞用得好好的那一對對講機，帶去日本、韓國就不能按發話鍵了。台灣免執照的 FRS 用 467 MHz，日本免執照的是有技適標章的機器，韓國是有 KC 認證、用 424／448 MHz 的生活無線電；台灣的機子兩邊都不符合。日本總務省北海道總合通信局的台灣語公告，還直接點名「台灣規格的FRS」不能用。

這篇回答四件事：台灣的對講機要不要帶、在日本和韓國分別租什麼或買什麼、當地攀岩者實際帶哪些機型、衛星求救裝置在兩國能不能用。對講機怎麼挑、用對講機怎麼講口令，見〈[攀登用對講機](/posts/climbing/2026-11-01-climbing-radios)〉；衛星通訊器和 PLB 的通用比較，見〈[衛星通訊器與個人求救信標](/posts/climbing/2026-11-01-satellite-messengers-plb)〉。這裡只講日韓兩地不一樣的部分。讀完你應該能在出發前訂好租機，或列好到當地要買的型號。

## 為什麼台灣的機子不能用

### 日本：沒有技適就不能發話，電池裝著帶在身上也算

日本《[電波法](https://laws.e-gov.go.jp/law/325AC0000000131)》第 4 條第三號寫，不需要執照的無線局，前提是功率 1 W 以下、而且「適合表示無線設備のみを使用するもの」，也就是只用有技適的設備。總務省的〈[技適マークのQ&A](https://www.tele.soumu.go.jp/j/adm/monitoring/summary/qa/giteki_mark/)〉第 22 題說，沒有技適標章的無線機直接使用，可能違反電波法。

台灣的機子被點名過。北海道總合通信局的[台灣語頁面](https://www.soumu.go.jp/soutsu/hokkaido/twn.htm)寫：「例如，美國及台灣規格的FRS……在日本 因為可能對防災無線等重要無線電通信造成信號干擾，所以禁止使用。」

比較容易忽略的是「帶著」這件事。同一局的[日文頁面](https://www.soumu.go.jp/soutsu/hokkaido/K/gaikoku.html)寫：「本人の認識に関わらず、日本国内で電波が発射可能な状態で所持していた場合、不法無線局を開設したものとして処罰の対象となります。」意思是不管你知不知道，在日本把可以發射電波的機器帶在身上，就可能被當成開設不法無線局。

罰則寫在電波法：

- **第 110 條**：沒有執照或登錄就開設無線局，1 年以下拘禁刑或 100 萬日圓以下罰金。
- **第 108 條の2**：損壞治安、氣象、人命財產保護等用途的無線設備，或妨礙其功能而干擾通訊，5 年以下拘禁刑或 250 萬日圓以下罰金，未遂也罰。

訪日旅客有一個 90 天的特例，但對講機不在裡面。電波法第 4 條の2 讓入境者自己帶的部分設備，在入境後一段期間內「視為」有技適。

適用哪些設備，由《[電波法施行規則](https://laws.e-gov.go.jp/law/325M50080000014)》第 6 条の2の3 限定：Wi-Fi、Bluetooth 這類資料通訊、超寬頻，以及一種毫米波的移動感測器。對講機屬於另一號的無線電話，不在名單上。總務省的[入境說明頁](https://www.tele.soumu.go.jp/j/sys/others/inbound)講的也是 Wi-Fi 和 Bluetooth。

歐規 PMR446 和美規 FRS 也一樣。總務省點名的是美規與台灣 FRS、GMRS、UHF CB、PRS、中國與香港的公眾對講機；PMR446 沒有被點名，但它沒有技適，不符合第 4 條的條件。業餘無線電也走不通：總務省承認外國業餘執照的[對象國名單](https://www.tele.soumu.go.jp/j/others/amateur/info/guest/index.htm)沒有台灣，而且同伴沒執照也不能用。

本文建議：台灣的對講機不帶去日本。真的要帶（例如回程要用），電池拆下來分開放進托運行李，到了日本不裝回去。

今晚就能做的事：打開這趟日本行的打包清單，把「對講機」那一行改成「當地租或買」，並寫上要的類別（デジ簡或特小）。

### 韓國：要 KC 認證，頻率也要對

韓國《[전파법](https://www.law.go.kr/법령/전파법)》（電波法）第 19 條規定，開設無線局要經科學技術資訊通信部長官許可。免申報的例外寫在施行令第 25 條：通過適合性評價（KC）、用部長官指定頻率的生活無線局設備。

這裡有一個容易誤會的地方。施行令〔[별표 6의2](https://www.law.go.kr/LSW/flDownload.do?gubun=&flSeq=170579543&bylClsCd=110201)〕讓個人自用帶入的設備免做適合性評價，數量是 1 台。但「免評價」不等於「可以用」。韓國中央電波管理所的傳單〈[올바른 무선국 이용 안내](https://www.crms.go.kr/download.do?uuid=82305c86-2773-4d3e-96ba-b61d7f9cfc47)〉寫得很清楚：

> 개인이 사용할 목적으로 해외에서 직접 반입한 기자재는 1인당 1대에 한하여 적합성평가가 면제됩니다. 다만, 국내 기술기준(주파수, 출력 등)에 적합해야 사용할 수 있습니다.

意思是：個人自用帶入的設備，每人 1 台免評價；但頻率、功率要符合韓國技術標準才能用。同一份傳單也寫，頻率、功率不合韓國標準的外國生活對講機（包括海外直購的），使用時會被處以罰金或罰鍰。

韓國的生活無線電只用 424 MHz 和 448 MHz 附近的兩小段。台灣 FRS 在 467 MHz，美規 FRS 在 462／467 MHz，PMR446 在 446 MHz，都不在裡面。所以不管帶幾台，在韓國都不能發話。

罰則：

- **第 84 條第 1 號**：沒有許可開設或運用無線局，3 年以下懲役或 3,000 萬韓元以下罰金。
- **第 91 條第 4 號**：運用不符技術標準的無線設備，200 萬韓元以下罰鍰。

傳單寫的是「罰金或罰鍰」，外國旅客實際會套哪一條，沒有公開的處分案例可以對照。另外，一對（2 台）帶入算不算超過「1 台」，中央電波管理所也沒有公開說明；反正台灣的機子在韓國不能發話，本文建議直接不帶。

今晚就能做的事：如果你有韓國岩友，傳訊息問他手上有沒有「디지털 생활무전기」（數位生活無線電）可以借，順便請他看機身有沒有 KC 標示。

## 外國人實際怎麼做

### 日本：監聽、警告、宣導，還有租借通路

外國人帶自己國家的對講機去日本雪場，是總務省很熟悉的問題。北海道總合通信局 2024 年 1 月在俱知安、二世古做了兩天調查，可能違反電波法的通訊裡，絕大多數是外語：121 次裡有 114 次（[hamlife，2024-01-26](https://www.hamlife.jp/2024/01/26/huhou-musenkyoku-torishimari-1243/)）。處理方式是用無線電警告，干擾嚴重時找出發射位置、指導停止使用，並在公車和雪場用英文廣播宣導。[朝日新聞](https://www.asahi.com/articles/ASS217HH1S1ZIIPE016.html)也寫到，除了外國滑雪客在野雪區使用，也有日本人在用。

更早還有一次調查。疫情前某個冬季的兩天裡，二世古記錄到 167 次違法的英語通訊，是富良野等其他雪場的 10 倍。

這次調查的年份，兩份來源寫法不同：[產經新聞（2023-12-02）](https://www.sankei.com/article/20231202-7ODYFLY7HBOY3JNYVVKFGXDFL4/)寫「5 年前の冬季」，約是 2018 年；[HokkaidoWilds 的英譯](https://hokkaidowilds.org/hokkaido-telecomm-bureau-to-track-illegal-radio-use)寫 2006 年。產經也說，澳洲製對講機的頻率接近二世古的電視播送頻率，最多可能影響約 2 萬戶，總通局因此決定在二世古新設監視裝置。HokkaidoWilds 譯的北海道新聞報導補充，天線設在俱知安，24 小時遠端監聽。

官方也直接告訴外國人該怎麼做。2025-01-30 北海道總合通信局在二世古辦給觀光業者的說明會，有人問外國觀光客要用無線電該用哪種，回答是：「デジタル簡易無線（登録局）のレンタルがおすすめである。レンタルを受ける方は手続不要で使用できる。」也就是推薦租數位簡易無線，租用者不用辦手續（[說明會紀錄](https://www.soumu.go.jp/soutsu/hokkaido/C/u-Land/20250212.html)）。[二世古觀光協會](https://www.niseko-ta.jp/news/article/overseas-wireless-radio-prohibited)和[二世古町公所](https://www.town.niseko.lg.jp/information/11157)在 2025 年 1 月轉貼公告，白馬那一帶的信越總合通信局更早在 2019 年就在 53 個地點貼了英、中、韓文海報（[hamlife 轉載信越總通局發表，2019-12-27](https://www.hamlife.jp/2019/12/27/huhou-musenkyoku-torishimari-924/)；[信越總通局說明頁](https://www.soumu.go.jp/soutsu/shinetsu/sbt/kankyo/frs.html)）。二世古的中文滑雪學校追雪也在 [IG](https://www.instagram.com/reel/DRn1tnAkkyQ) 提醒：台灣、美國 FRS、GMRS、中港公眾對講機、澳洲 UHF「全部不能用」。

外國人自己的做法，[HokkaidoWilds 的對講機整理頁](https://hokkaidowilds.org/two-way-radios-in-the-hokkaido-backcountry)留言區有幾個具體例子：

- 一對加拿大籍野雪滑雪夫妻，在家用 BCA 對講機，寫說上一趟朋友照用自己的 BCA，「but I realize this is illegal」。站方幫忙打電話給千歲的山田電機，店裡有 Kenwood Demitoss UBX-LS20 特小機，每台 ¥8,800。
- 一組外國滑雪客向 Hokkaido Shinwa 租了 3 台 Icom IC-DPR6（デジ簡），兩週含保險、寄到飯店共 ¥14,850。業者把頻道預設好，交代不要改。
- 另一位訪客寫，他差點在 Amazon 買一批對講機，查過才改洽租借業者。

### 執法：先警告，但罰則還在

公開的摘發案例裡，被移送或摘發的都是住在日本的人：2015 年東京港區一名 27 歲的外國籍居民，用外國規格的對講機在路上和店裡聯絡，干擾到電視台的中繼無線（[關東總合通信局](https://www.soumu.go.jp/soutsu/kanto/press/27/0703k2.html)）；2026 年 1 月小樽一名 65 歲的居民，在除雪車上用網路買的外國規格無線機，被移送小樽警察署（[北海道總合通信局](https://www.soumu.go.jp/soutsu/hokkaido/2026/0202.html)）。對遊客，公開紀錄裡看到的是警告、指導和宣導。

這不代表帶了沒關係。罰則條文沒有分遊客或居民，總通局在俱知安也設了 24 小時的監視天線。日本野雪頻道 Backcountry Ski Leaks Japan 在 2026-03-01 的影片裡，6:43 起說監聽車外觀看不出來，從野雪區回到停車場或飯店，對講機要收進背包深處；7:26 起說單純持有外國對講機不違法，但發話，或處在幾乎可以發射的狀態，就違反電波法，所以建議把電池拆掉；他也說自己從不建議帶外國對講機去日本用。他對「持有」的說法比北海道總通局寬，但兩邊的實際建議一致：不要讓機器處在能發射的狀態。

```youtube
url: https://www.youtube.com/watch?v=EAxniFglDwo
title: 日本無線電法規與外國對講機（Backcountry Ski Leaks Japan，2026-03-01）
start: 403
```

### 韓國：沒有外國遊客的實例

韓國這邊，外國遊客、登山者或攀岩者寫「帶什麼對講機去韓國」的心得或遊記，公開資料裡沒有；外國人因為發話被電波管理所處分的新聞也沒有。唯一跟外國人有關的案例方向不同：2026 年 8 月，一名中國籍青少年在濟州機場觀景台，用從中國買的對講機偷聽塔台通話，被民眾檢舉後由警方逮捕，罪名是《通信秘密保護法》（竊聽），不是電波法（[헤드라인제주，2026-09-15](https://www.headlinejeju.co.kr/news/articleView.html?idxno=599045)）。

韓國的租借業者頁面都只有韓文，也沒有針對外國人的說明。韓國的段落只能照法規走，沒有遊客的經驗可以參考。

今晚就能做的事：到 HokkaidoWilds 那一頁看留言區，記下你行程附近的租借業者，以及他們接不接受用飯店地址寄送。

## 當地攀岩者用什麼

### 日本：嚮導用デジ簡，自己爬的人用特小

日本攀登者寫「帶了無線機」的很多，寫出型號的很少。能對應到型號的一手紀錄分成兩派：

| 型號 | 類別 | 誰在用、怎麼用 |
|---|---|---|
| Icom IC-DPR6 → IC-DPR7S PLUS | デジ簡（5 W） | 山岳嚮導宮崎薫，2024 年用 IC-DPR6，2026-10 換成增波版 IC-DPR7S PLUS，部落格寫：「デジタル簡易無線機は出力高く音が聞こえやすく、マルチピッチや複数パーティ間の連絡手段としてとても有効。」（[2026-10-24](https://ameblo.jp/kaoru-gurumaki/entry-12982444933.html)） |
| Icom IC-4350 | 特小 | 同一位嚮導的山岳會成員之間用同款特小互聯，掛在胸前的專用背帶上，攀爬時不擋視線（[2024-05-14](https://ameblo.jp/kaoru-gurumaki/entry-12845318964.html)） |
| Standard Horizon SR70A | 特小（IP67） | 一位攀岩者在 Yahoo!知恵袋回答，說他在多繩距用這款，「不満無く使えています」（[2023-05-13](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13279848783)） |
| Icom IC-4300 | 特小 | 八ヶ岳冬季阿式攀登的使用裝備清單（[MuRaの山ブログ，2024-02](https://blog.muraq.com/post/mt/alpine_climbing_snow/570)） |
| TRH8A | 特小 | 一位攀登者為多繩距買的 Amazon 機，用 CTCSS 碼避開別隊混線，按鍵麻煩改用聲控（[YouTube，2024-06-24](https://www.youtube.com/watch?v=cwRrabHsdC8)） |
| Icom IC-DPR3 | デジ簡（1 W） | 登山學校 Kuri Adventures 的嚮導業務用，影片是 2016 年的（[YouTube](https://www.youtube.com/watch?v=O4QIPfL-QEY)） |

沒有公認的「攀岩用款」：每個型號只出現一兩次，山岳會也沒有把指定型號寫進裝備表的公開例子。YAMAP 上的多繩距紀錄，多半只寫類別，例如妙義相馬岳北稜那篇寫「デジ簡（１Ｗ）持参しました。（包括登録済）」（[YAMAP，2023-10-21](https://yamap.com/activities/27599090)）。

日本的常態仍是用喊的。一位住在加拿大 Squamish 的日本攀岩者寫：在日本多半喊「ビレイ解除〜」，Squamish 那邊則是對講機為主（[PUMP ONLINE STORE，2025-10-15](https://store.pump-climbing.com/news/461.html)）。

### 韓國：릿지常帶，但型號樣本少、多半是類比機

韓國的多繩距和릿지（稜線攀登）遊記，帶對講機比日本普遍。2024–2026 年至少有 15 篇寫到帶了，或沒帶後悔。一位大邱的攀登者寫：「어딜 가나 릿지에선 무전기가 필수」，不管去哪，릿지一定要帶對講機（[完州天燈山，2024-06](https://m.blog.naver.com/mitty02/223467257150)）。

但幾乎沒人寫型號。認得出來的幾台，大多是從照片判讀，每款只出現一次：

| 型號 | 類別 | 2027 年後能用嗎 | 出處 |
|---|---|---|---|
| DG-TOK Nano N2（照片推定） | 數位生活無線 | 可以 | 雪嶽山蔚山岩 비너스길 7 段（[2026-10](https://m.blog.naver.com/aimhigh777_/224447163958)） |
| DG-TOK Nano N | 類比生活無線 | 不行 | 土王城瀑布冰攀，向老師借的（[2023-02](https://m.blog.naver.com/wooltraveler/223010398584)） |
| Motorola Talkabout T82 | 類比生活無線 | 不行 | 單繩距，廠商提供的業配文（[2023-06](https://m.blog.naver.com/hyun76lee/223132186116)） |
| 민영정보통신 MYT-0033 | 類比生活無線，已停產 | 不行 | 買來準備攀登，兩台 124,000 韓元（[2019-09](https://m.blog.naver.com/heparee/221652822061)） |

能認出的全是「생활무선국」（免申報的生活無線），一半是類比機。韓國的類比生活無線電 2024 年起禁止生產、進口、販賣，已在用的只能用到 2026-12-31。跟韓國岩友借機，先確認是數位的。

韓國遊記裡的實戰心得：

- 雪嶽山경원대길兩隊各帶一組，頻道沒對好，結果互相聯絡不上；另一台的天線被折到拖斷（[2024-10](https://m.blog.naver.com/nanuyo/223612654915)）。
- 高麗大學山岳社在雪嶽山，第 5 段結束時對講機沒電，改用喊的又被風聲蓋過（[2025-10](https://m.blog.naver.com/whd4879/224039453242)）。
- 土王瀑冰攀，天冷連不上（[2025-06](https://m.blog.naver.com/qaz123890/223898967203)）。
- DC Inside 業餘無線電版有人說，攀岩用生活無線電就夠，通常在視線內；但隔著山谷就不行（[2023-08](https://m.dcinside.com/board/hamradio/6476)）。

今晚就能做的事：把你們要爬的路線 topo 打開，數一下有幾段是轉角、橫渡或看不到確保者的。這個數字決定你們需要的是特小還是デジ簡。

## 特小是什麼、多繩距會不會不夠

日本免執照、免登錄的對講機叫特定小電力（特小），功率只有 10 mW。Icom 的說明是，因為功率弱，通話距離約 300 m（[Icom](https://www.icom.co.jp/business/icom-journal/license)）；這是廠商的說法。ヤマレコ問答區有登山者回答，視線良好時約 200 到 300 m；另一位說，確定收得到的是「肉眼で見える範圍」，隔著稜線到隔壁山谷幾乎收不到（[ヤマレコ質問箱，2022-12-30](https://www.yamareco.com/modules/plzXoo/index.php?action=detail&qid=7120)）。

日本還有兩種相關類別：

- **デジタル簡易無線（デジ簡）登錄局**：351 MHz，最高 5 W，要向總務省登錄。前面那位嚮導的部落格比較過，デジ簡比特小「はるかに聞こえ良くて使いやすい」。
- **デジタル小電力コミュニティ無線（デジ小）**：500 mW，免登錄，例如 Icom IC-DRC1MKII（[ヤマレコ〈山の連絡手段〉](https://www.yamareco.com/modules/yamanote/detail.php?nid=1703)）。

特小在多繩距轉角後、或隔著岩稜時會不會斷訊，沒有人公開實測過。上面的距離數字講的是視線內和隔稜線兩種極端，岩壁上轉一個角落在哪一邊，不知道。本文建議：路線上有好幾段看不到確保者，或要跟另一隊聯絡，就租デジ簡；只是單繩距或短的多繩距，特小夠用。

今晚就能做的事：照上一節數出來的段數決定。零到一段，記「特小」；兩段以上或有多隊，記「デジ簡」。

## 日本：租或買

### 租（短期首選）

| 業者 | 機種 | 價格 | 取件與歸還 | 適合 |
|---|---|---|---|---|
| [RadiGo](https://radigojapan.com/home)（英文網站） | Icom IC-D70（デジ簡，351 MHz） | 2 天 ¥4,000，之後每天 +¥500 | 寄到飯店、山屋、雪場或住家地址；歸還走 Yamato 或 7-Eleven，國際機場的 Yamato 櫃台也可以寄 | 多繩距、山區、多隊 |
| [トランシーバーレンタルセンター](https://lp.rental-transceiver.com/)（日文） | 特小；業務用簡易無線 | 特小 1 泊 2 日 ¥750（含稅 ¥825）起；簡易無線 ¥1,100（含稅 ¥1,210）起 | 全國免運寄送，歸還運費自付 | 單繩距、預算低 |
| 北海道業者（Hokkaido Shinwa、Japan Enix 等） | Icom IC-DPR6（デジ簡） | HokkaidoWilds 列兩週約 ¥3,500–6,000／台 | 寄到住宿；[Japan Enix](https://www.jenix.co.jp/two-way-radio/) 有英文窗口 | 北海道行程 |

幾個要注意的地方：

- **租デジ簡，你不用登錄。** 電波法第 70 條の9 允許登錄人讓其他人操作他的登錄局；登錄人是業者，租用者不必辦手續。這也是總通局推薦外國人用租的原因。
- **沒有機場櫃台當場取件的對講機租借**，Wi-Fi 機有，對講機要先寄到第一晚的住宿。
- **RadiGo 頁首寫服務「scheduled to begin on December 10th」**，沒標年份。下單前確認你的日期接不接單。
- **長野（白馬）**：HokkaidoWilds 不知道當地有英文的租借業者，建議請北海道業者寄過去。

### 在當地買（常去日本才划算）

| 機種 | 類別 | 價格（日本實售） | 備註 |
|---|---|---|---|
| ALINCO DJ-PB20 | 特小 | ¥8,500–10,000 | 3 顆 3 號電池約 60 小時；登山者常用 L3 頻道（ヤマレコ） |
| Icom IC-4350 | 特小，IP67 | 約 ¥10,000（Icom 對特小機實勢價格的說法） | 山岳嚮導宮崎薫在用 |
| Kenwood Demitoss UBX-LS20 | 特小 | ¥8,800（千歲山田電機） | HokkaidoWilds 幫外國讀者問到的店頭價 |
| TRH8A | 特小 | 約 ¥5,000 起 | Amazon 雜牌機；買之前確認商品標示有技適 |
| Icom IC-DRC1MKII | デジ小 500 mW | ¥25,000–30,000 | 免登錄，比特小遠 |
| Icom IC-DPR6 | デジ簡 5 W | ¥35,000–40,000 | 買了要自己登錄，短期旅客不建議 |

買特小只要認機身上的技適標章。買デジ簡就麻煩了：擁有者要自己向總合通信局登錄。電波法的登錄拒絕事由（第 27 條の24）沒有列國籍，但沒有日本住址的觀光客能不能辦、地址欄怎麼填，總務省沒有公開說明。RadiGo 說外國訪客辦這個通常要一個月左右。登錄手續費據 Icom 的整理，電子申請個別登錄每次 ¥1,500、書面 ¥2,730（[Icom](https://www.icom.co.jp/feature/application)）。

不要買：沒有技適的外國機（美規、台灣 FRS、PMR446）、Baofeng 這類業餘機（台灣業餘執照在日本不被承認）。

今晚就能做的事：上 RadiGo 輸入你的日期和住宿地址，看報價與能不能寄到；不接單的話，改看トランシーバーレンタルセンター或北海道業者。

## 韓國：租或買

### 租

| 業者 | 價格 | 備註 |
|---|---|---|
| [하나통신](http://okhana.co.kr/shop/shopbrand.html?type=O&xcode=003) | 생활무전기（登山、露營用）1 天 4,400 韓元；業務用 1 天 5,500 韓元 | 選「생활무전기」：業務用機的許可或申報手續在持有人身上，生活無線電不用申報，比較單純。只有韓文頁 |

韓國業者有沒有接外國遊客，公開資料看不出來。請韓國朋友或住宿幫忙打電話，並明講要「디지털 생활무전기」（數位生活無線電）。

### 在當地買

| 機種 | 類別 | 規格 | 價格 |
|---|---|---|---|
| [Motorola Talkabout T39D](https://www.motorolasolutions.com/content/dam/msi/docs/EA_Collaterals/ENGLISH/BusinessPMR446/t39d/T39D_datasheet_kr_1024_v3.pdf)（韓國版） | 數位生活無線 | DMR，27 頻道，IP54，最長 15 小時，USB-C；型錄寫「허가가 필요없는 생활 무선국」（不需許可） | 2 台 338,000 韓元（[11번가 比價頁](https://catalog.11st.co.kr/pc/464397159) 最低價） |
| DG-TOK Nano N2 | 數位生活無線 | 前面韓國攀登者照片推定的機型；原廠寫它是類比機 Nano N 的數位版 | 每台 73,000 韓元（[原廠商店](https://hysystemkorea.com/category/%EC%83%9D%ED%99%9C-%EB%AC%B4%EC%A0%84%EA%B8%B0/23)） |
| 민영정보통신 MYT-DF33 | 數位生活無線 | 跟 MYT-0033 同一家廠商的數位機，27 頻道 | 130,000 韓元（[햄누리](https://hamnuri.co.kr/category/%EB%AF%BC%EC%98%81%EC%A0%95%EB%B3%B4%ED%86%B5%EC%8B%A0/60) 標價） |

價格是 2026-11-02 查的賣場標價，會變動；到當地前用型號在韓國網路賣場（例如 Coupang）再搜一次。

不管租或買，確認三件事：

1. **KC 認證**，機身標示「생활무선국」。
2. **是數位機**（機身或型錄寫「디지털」）。類比機 2026-12-31 後不能用，二手市場和朋友手上還很多。
3. **424／448 MHz、0.5 W 以下**。韓國現行的生活無線電頻道在 424.1375–424.2625 MHz 和 448.7375–448.925 MHz，數位窄頻共 27 個頻道。符合這些就不用申報，《전파법》第 20 條的但書讓外國人也可以用。

韓國現行的技術基準是科技部告示〈신고하지 아니하고 개설할 수 있는 무선국용 무선설비의 기술기준〉（第 2026-10 號），類比機用到 2026-12-31 寫在它的附則裡。

今晚就能做的事：把上面三個確認點用韓文抄在手機備忘錄裡（KC、생활무선국、디지털），到店裡或跟業者講電話時直接給對方看。

## 衛星求救在日韓

對講機只能跟繩伴講話。要對外求救，兩國的狀況不一樣：

| 裝置 | 日本 | 韓國 |
|---|---|---|
| Garmin inReach | 帶自己的。據ヤマレコ社長的影片，按 SOS 後 Garmin 應答中心（在美國）會用英文或日文確認，判定要救援才轉日本警察（[ヤマレコ，2024-11-19](https://www.youtube.com/watch?v=1NnOmP0IJYk)） | 韓國對 inReach 的規定與 SOS 轉報流程沒有公開資料，出發前問 Garmin |
| PLB（個人求救信標） | **陸上禁止**。COSPAS-SARSAT 的國家規定表寫：「Land activations are prohibited and subject to penalty by radio law」 | **不允許**：陸、海、空都是 N |
| iPhone 衛星 SOS | 可以用。日本在 Apple 支援名單上，台灣買的 iPhone 也能用（例外名單沒有台灣）；iPhone 14 以後 | 不能用：韓國不在 Apple 支援名單 |
| 一般手機 | 110（警察）、119（消防救急） | 112（警察）、119（消防救援） |

（PLB 規定見 [COSPAS-SARSAT](http://cospas-sarsat.int/en/beacon-ownership/national-beacon-regulations-for-plbs)；iPhone 見 [Apple 101573](https://support.apple.com/en-us/101573)。）

幾個台灣讀者會碰到的細節：

- **inReach 的中文訊息很短。** 同一支ヤマレコ影片說，非 Plus 機型一則訊息 160 位元組，在英文是 160 字，中文、日文一字占 3 位元組，只剩約 53 字。日本行程的罐頭訊息先寫精簡，或改用英文。
- **iPhone 的中繼中心有日文，沒有中文。** Apple 的指引是先試著直接打當地緊急電話，打不通才用衛星。
- **PLB 留在家。** 在台灣登錄好的 PLB，到日本、韓國的陸地上都不能用。

inReach、PLB、手機衛星 SOS 的通用比較與台灣開通流程，見〈[衛星通訊器與個人求救信標](/posts/climbing/2026-11-01-satellite-messengers-plb)〉。

今晚就能做的事：打開 inReach 的罐頭訊息設定，寫一則 50 字以內的中文求救訊息（誰、哪條路線、第幾段、傷勢），或改成英文。

## 出發前檢查清單

- [ ] 台灣的對講機不帶；真的要帶，電池拆下分開放進托運，到當地不裝回。
- [ ] 日本：上 RadiGo 或其他業者下單，寄到第一晚住宿；或抵達後到家電量販買兩台有技適的特小。
- [ ] 韓國：請人幫忙聯絡業者，租兩台數位生活無線電；或抵達後買數位機。跟朋友借，先確認是數位的。
- [ ] 拿到機器先在地面試：兩台設同頻道、同隱私碼，開按鍵鎖，在岩壁下測一次轉角後還聽不聽得到。
- [ ] 天線別露在背包外被岩壁折到；掛胸前並加短繩防掉；冬天電池放內層保暖，帶備用電池。
- [ ] 先約好對講機沒電或聽不到時怎麼辦：回到喊話和約定好的流程。
- [ ] PLB 留在家。inReach 確認訂閱有效、緊急聯絡人已登記、韌體已更新。
- [ ] 抄下緊急電話：日本 110／119，韓國 112／119。

## 練習題：三個情境

答案在每題下方，先自己想再看。

**1. 你要去小川山爬一週，繩伴說：「我那對台灣買的 FRS 帶著就好，反正只在岩壁上用，不會有人管。」**

<details><summary>答案</summary>

不行。台灣 FRS 沒有技適，北海道總合通信局的台灣語公告直接點名它在日本禁止使用；電波法第 110 條的罰則是 1 年以下拘禁刑或 100 萬日圓以下罰金。目前對遊客的公開處理多半是警告，但那是執法順序，不是許可。電池裝著帶在身上也可能被當成開設不法無線局。租一對デジ簡，或到當地買兩台特小。

</details>

**2. 你去韓國爬仁壽峰，韓國朋友說要借你一對 Motorola T82。**

<details><summary>答案</summary>

T82 在韓國是類比生活無線電。2026 年以內可以用，2027-01-01 起類比機就不能再用。如果行程在 2027 年以後，請朋友換數位機，或自己租「디지털 생활무전기」。

</details>

**3. 你下個月要去日本和韓國各爬一週，手上有 inReach Mini 3 和一台在台灣登錄好的 PLB。**

<details><summary>答案</summary>

PLB 留在家：日本禁止陸上使用，韓國陸海空都不允許。帶 inReach，中文罐頭訊息控制在約 50 字內。日本可以再加 iPhone 衛星 SOS 當備援，韓國不行。韓國對 inReach 的規定出發前先問 Garmin。

</details>

## 下一步

這是「出國攀岩裝備」系列的最後一篇。要回頭看整個系列怎麼選讀，見〈[出國攀岩裝備導讀](/posts/climbing/2026-10-19-climbing-gear-travel-overview)〉；兩國的岩場介紹，見〈[日本岩場總覽](/posts/climbing/2026-10-12-japan-crags-overview)〉和〈[韓國岩場總覽](/posts/climbing/2026-10-21-korea-crags-overview)〉。

## 參考資料

日本法規與官方說明：

- [電波法（e-Gov 法令検索）](https://laws.e-gov.go.jp/law/325AC0000000131)
- [電波法施行規則（e-Gov 法令検索）](https://laws.e-gov.go.jp/law/325M50080000014)
- [技適マークのQ&A（総務省 電波利用ポータル）](https://www.tele.soumu.go.jp/j/adm/monitoring/summary/qa/giteki_mark/)
- [台灣語：外國規格無線電設備的使用（総務省 北海道総合通信局）](https://www.soumu.go.jp/soutsu/hokkaido/twn.htm)
- [外国規格の無線機の使用について（総務省 北海道総合通信局）](https://www.soumu.go.jp/soutsu/hokkaido/K/gaikoku.html)
- [海外から持ち込まれる携帯電話端末・Wi-Fi端末等の利用（総務省 電波利用ポータル）](https://www.tele.soumu.go.jp/j/sys/others/inbound)
- [ゲストオペレーター制度（総務省 電波利用ポータル）](https://www.tele.soumu.go.jp/j/others/amateur/info/guest/index.htm)
- [守ろう！ニセコエリアの電波環境 說明會（北海道総合通信局，2025-02-12）](https://www.soumu.go.jp/soutsu/hokkaido/C/u-Land/20250212.html)
- [外国規格の無線機は使用できません（ニセコリゾート観光協会，2025-01）](https://www.niseko-ta.jp/news/article/overseas-wireless-radio-prohibited)
- [外国規格無線機の使用について（ニセコ町，2025-01）](https://www.town.niseko.lg.jp/information/11157)
- [外国規格の無線機（信越総合通信局）](https://www.soumu.go.jp/soutsu/shinetsu/sbt/kankyo/frs.html)
- [信越総通局、スキー場周辺で外国規格無線機の注意喚起（hamlife，2019-12-27）](https://www.hamlife.jp/2019/12/27/huhou-musenkyoku-torishimari-924/)
- [不法無線局の取締り（関東総合通信局 報道資料，2015-07-03）](https://www.soumu.go.jp/soutsu/kanto/press/27/0703k2.html)
- [不法無線局の取締り（北海道総合通信局 報道資料，2026-02-02）](https://www.soumu.go.jp/soutsu/hokkaido/2026/0202.html)

日本的報導與業者：

- [“違法電波”無線機 国内外への持ち出し・持ち込み警戒（産経新聞，2023-12-02）](https://www.sankei.com/article/20231202-7ODYFLY7HBOY3JNYVVKFGXDFL4/)
- [ニセコで不法無線局の調査（hamlife，2024-01-26）](https://www.hamlife.jp/2024/01/26/huhou-musenkyoku-torishimari-1243/)
- [外国人スキー客の違法無線（朝日新聞，2024-02-02）](https://www.asahi.com/articles/ASS217HH1S1ZIIPE016.html)
- [Hokkaido Telecomm Bureau to track illegal radio use（HokkaidoWilds）](https://hokkaidowilds.org/hokkaido-telecomm-bureau-to-track-illegal-radio-use)
- [Two-way radios in the Hokkaido backcountry（HokkaidoWilds，2025-12-11 更新）](https://hokkaidowilds.org/two-way-radios-in-the-hokkaido-backcountry)
- [追雪滑雪學校：日本對講機規定（Instagram）](https://www.instagram.com/reel/DRn1tnAkkyQ)
- [日本無線電法規與外國對講機（Backcountry Ski Leaks Japan，2026-03-01）](https://www.youtube.com/watch?v=EAxniFglDwo)
- [RadiGo Japan](https://radigojapan.com/home)
- [トランシーバーレンタルセンター](https://lp.rental-transceiver.com/)
- [Japan ENIX Two-way Radio](https://www.jenix.co.jp/two-way-radio/)
- [無線機の免許・資格について（Icom）](https://www.icom.co.jp/business/icom-journal/license)
- [デジタル簡易無線機（登録局）の登録について（Icom）](https://www.icom.co.jp/feature/application)
- [特定小電力トランシーバーの距離（ヤマレコ質問箱，2022-12-30）](https://www.yamareco.com/modules/plzXoo/index.php?action=detail&qid=7120)
- [山の連絡手段（ヤマレコ，2025-09-08 更新）](https://www.yamareco.com/modules/yamanote/detail.php?nid=1703)

日本攀登者的使用紀錄：

- [山での無線機について（宮崎薫，2024-05-14）](https://ameblo.jp/kaoru-gurumaki/entry-12845318964.html)
- [増波対応の無線機と登録局変更届（宮崎薫，2026-10-24）](https://ameblo.jp/kaoru-gurumaki/entry-12982444933.html)
- [マルチピッチ用トランシーバーの質問（Yahoo!知恵袋，2023-05-13）](https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q13279848783)
- [八ヶ岳 ジョウゴ沢＋小同心クラック（MuRaの山ブログ，2024-02-13）](https://blog.muraq.com/post/mt/alpine_climbing_snow/570)
- [マルチピッチ用に買った特定省電力トランシーバーTRH8A（超デスクワーカーの山行冒険記，2024-06-24）](https://www.youtube.com/watch?v=cwRrabHsdC8)
- [デジタル簡易無線を購入（Kuri Adventures，2016-04-02）](https://www.youtube.com/watch?v=O4QIPfL-QEY)
- [妙義 相馬岳北稜（YAMAP，2023-10-21）](https://yamap.com/activities/27599090)
- [スコーミッシュでの暮らし #17（PUMP ONLINE STORE，2025-10-15）](https://store.pump-climbing.com/news/461.html)

韓國法規、業者與攀登者紀錄：

- [전파법（국가법령정보센터）](https://www.law.go.kr/법령/전파법)
- [전파법 시행령 〔별표 6의2〕 적합성평가 면제 대상（국가법령정보센터）](https://www.law.go.kr/LSW/flDownload.do?gubun=&flSeq=170579543&bylClsCd=110201)
- [올바른 무선국 이용 안내（중앙전파관리소，2024-06）](https://www.crms.go.kr/download.do?uuid=82305c86-2773-4d3e-96ba-b61d7f9cfc47)
- [Motorola Talkabout T39D 韓國版型錄](https://www.motorolasolutions.com/content/dam/msi/docs/EA_Collaterals/ENGLISH/BusinessPMR446/t39d/T39D_datasheet_kr_1024_v3.pdf)
- [하나통신 무전기 렌탈](http://okhana.co.kr/shop/shopbrand.html?type=O&xcode=003)
- [濟州機場對講機竊聽案（헤드라인제주，2026-09-15）](https://www.headlinejeju.co.kr/news/articleView.html?idxno=599045)
- [설악산 울산바위 비너스길（Naver 블로그，2026-10）](https://m.blog.naver.com/aimhigh777_/224447163958)
- [토왕성폭포 빙벽（Naver 블로그，2023-02-11）](https://m.blog.naver.com/wooltraveler/223010398584)
- [조령산 새터암장 무전기 후기（Naver 블로그，2023-06-20）](https://m.blog.naver.com/hyun76lee/223132186116)
- [등반용 무전기 MYT-0033（Naver 블로그，2019-09）](https://m.blog.naver.com/heparee/221652822061)
- [완주 천등산 민들레 릿지（Naver 블로그，2024-06-03）](https://m.blog.naver.com/mitty02/223467257150)
- [설악산 경원대길 릿지（Naver 블로그，2024-10-09）](https://m.blog.naver.com/nanuyo/223612654915)
- [고려대 KUAC 설악 하계훈련（Naver 블로그，2025-10）](https://m.blog.naver.com/whd4879/224039453242)
- [토왕폭（Naver 블로그，2025-06）](https://m.blog.naver.com/qaz123890/223898967203)
- [암벽등반 생활무전기（DC Inside 아마추어무선 갤러리，2023-08-09）](https://m.dcinside.com/board/hamradio/6476)

衛星求救：

- [National Beacon Regulations for PLBs（COSPAS-SARSAT）](http://cospas-sarsat.int/en/beacon-ownership/national-beacon-regulations-for-plbs)
- [Use Emergency SOS via satellite on your iPhone（Apple 101573，2026-10-05）](https://support.apple.com/en-us/101573)
- [Garmin inReachについて徹底解説（ヤマレコ社長の絶対遭難させないチャンネル，2024-11-19）](https://www.youtube.com/watch?v=1NnOmP0IJYk)
