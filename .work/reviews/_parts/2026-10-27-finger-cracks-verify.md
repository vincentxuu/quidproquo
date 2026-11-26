## post-verify

post-verify report: 2026-10-27-finger-cracks（zh-TW 與 -en 兩檔）
查核日：2026-10-27。獨立審稿，作者起草紀錄只當候選，每條都重抓原始來源。

### 工具與降級紀錄（toolDegradation）

- Groundlane MCP：本 session 只有 `authenticate`，沒有 `web_fetch`／`web_search`。直接 HTTP POST `groundlane.vincent-xu-work.workers.dev/mcp` 回 401。
- 網頁：先用 `curl`（Climbing.com ×2、Wide Boyz ×2、kyokarakimiwa ×2、Mountain Project ×5 都回 200，轉成純文字讀全文）。Patagonia（curl 拿到排隊頁）與 ROCKTOPO（403）改用 Exa `web_fetch_exa`。Wide Boyz 的發佈日用 Exa 補抓。
- Mountain Project 留言：路線頁的留言是登入後才全部載入。未登入只看得到 3 則，Exa 讀到的也只有 3 則；Chrome 擴充沒連線。Serenity 的 Aaron Hope 留言是看作者快取 `scratchpad/crack/fingers/pages/mp_serenity.txt` 行 152 確認的（原始頁面擷取，不是摘要），再用 Exa 搜尋找到 MP 論壇串對照。
- 影片：`yt-dlp --cookies-from-browser chrome` 抓 metadata、說明欄、字幕（en-orig 自動字幕；韓文片抓 ko-orig 自動字幕，gZw9eiu0xM0 另有創作者上傳的 en 字幕）。oEmbed 用 `curl` 查 HTTP code。原始檔：`scratchpad/fcv/`（字幕 .txt、.description）、`scratchpad/fcp/`（網頁 .txt）。

### 影片核對

| 影片 | 上傳日 | 長度 | 頻道（yt-dlp） | oEmbed | 文中用法 | 判定 |
|---|---|---|---|---|---|---|
| AjiP5-AM2Rw Jamming Fingers | 20210215 | 191s | VIDEORACLES | 200 | 嵌入，正文列 31/49/79/101/125 秒 | 🟢 字幕：31「i might go pinky finger down… my two thinnest fingers」、49「turn thumb down」、55–64「trapping just the first knuckle… hang straight back… place a piece of gear」、79「second knuckle」、101「rattly fingers」、113「entirely with torque」、125「ring locks」。「三分鐘內」＝191 秒 ✓ |
| HgpCOnPIR7o Jamming Feet | 20210216 | 229s | VIDEORACLES | 200 | 嵌入 start 30 | 🟢 0–11「a nice hold… outside the crack… smear… low angle slab」排第一；30–60「especially in thin cracks… smear your foot on the crack… point of my shoe lined up… drop your heel… center your knee and hip… flag the other foot」 |
| vUU7Qd1jQSo Laybacking | 20210225 | 106s | VIDEORACLES | 200 | 文字連結 | 🟢 3–34「not a first-choice technique… difficult to place protection… can't see how good the cam placements are… prefer… to jam… tilts over backwards… keep moving… getting your feet high」 |
| EAtB7Meb7ow Pat's Blue Ribbon | 20220711 | 474s | Spencer McKay | 200 | 嵌入 start 168 | 🟢 168–186「the crack size leaving the pod is baby blues so a point three and then blue metolius… blue metolius is tips for me… point twos… pinches down really quickly」。說話的人：說明欄寫「we follow Mary Eden」，字幕是第一人稱攀爬者口吻（330「i fired it through the crux」），判定說話者是 Mary Eden 合理（推論，不是字幕直接寫的） |
| Qtq4HCEP_RA Serenity Crack | 20211111 | 1308s | The Gravity Lab - Brant Hysell | 200 | 嵌入 start 454 | 🟢 454–467「this is a straight up and down crack the only reason i'm putting slings on it is… the placements are all in like pin scars and i don't want them to walk」；說話的人正在加長保護，是領攀者 ✓。實際標題結尾是「Valley.」（多一個句點），標題 fence 少了這個點，不影響事實 |
| UGQ-yp3oDtk 小川山 蜘蛛の糸 5.11c RP | 20210527 | 803s | The Climb | 200 | 嵌入；用說明欄的ムーブメモ | 🟢 說明欄：上部「右逆手フィンガー（親指は添えて、小指は抜いて）」「左順手フィンガーは、下に食い込ませると効く」；下部「右逆手フィンガー…左手は…サムロック…フットジャムをして、右手を上に出してレイバックへ移行」✓。「影片沒有口白」：yt-dlp 回報沒有自動字幕也沒有字幕，跟沒有口白相符，但我沒有實際聽音軌（🟡 低風險） |
| uM1dihjSyjg B1フィンガー 5.11a | 20250403 | 331s | 今日からきみは‼-にわかアルピニスト | 200 | 嵌入；用說明欄 | 🟢「全てのルートがノーボルトのトラッドエリアであるクラック地獄」「短いながらもテクニカルなフィンガーで5.11の登竜門」。註：完攀日是 2022/10/8，上傳日是 2025 |
| BgHCXB6QDPA 선인봉 남측 코너크랙 | 20231023 | 876s | 쏘맥 클라이머 | 200 | 嵌入；用說明欄 | 🟢「스테밍 구간 지나고 크랙에 붙어야하는 순간 멘탈이 깨지기 시작하면서 발홀드 못찾고 슬립」「손가락이 까져 피가 베어나오지만 아프지않다」「레이백 무브가 자연스러워지고」。註：這次是 pinkpoint 嘗試沒成功（「핑크포인트는 실패」），正文寫「挑戰」，沒有說完攀，用詞正確。實際標題開頭還有「내 인생 최고의 등반!」，結尾有「핑크포인트」 |
| Nc_otfbu0b8 재밍 기술 12가지 | 20230119 | 919s | K Climbing Company | **401** | 文字連結 &t=109s，正文有寫「關閉了嵌入」 | 🟢 ko 自動字幕：109「두 가지가 있어요. 엄지가 아래로 내려가는 썸다운… 썸 업」、117–120「더 힘을 받는 건 썸다운」、153–172「내 몸이 오른쪽에 있다… 오른손은 썸다운, 왼손은 썸업」、178–187「크랙이 정면에… 둘 다 썸다운」。說明欄聯絡人是김종식 ✓ |
| gZw9eiu0xM0 크랙 등반 기술 3부 | 20230305 | 653s | K Climbing Company | **401** | 文字連結 &t=368s，正文有寫「關閉了嵌入」 | 🟢 創作者上傳的 en 字幕：368「Comparison 1」、374「Conditions for lay back: 1.Jamming doesn't work 2.The edge is good for grip 3.Gradient is not steep(below 80)」、391 jamming 三條件、6「lay back is whole body posture and jamming is sort of a way of grip」、432「you should do jamming in taking risk of pain」、522「The grade is about 5.10c」。註：en 字幕只有 30 句，是重點字卡，不是全片逐字；ko 自動字幕 389 聽成「90도 이하」，創作者 en 字幕寫 80，正文用 80 沒問題。**410 那句的意思被寫錯，見 C1** |
| CXNJnE8SQAc Hazel Findlay short climber | 20240418 | 634s | Hazel Findlay ~ Strong Mind | 200 | 文字連結 &t=173s | 🟢 177–186「having smaller hands and feet can sometimes be helpful… with crack climbing… some cracks are going to be easier if you've got small hands」 |

11 支都是 2021 年以後上傳。嵌入 7 支 oEmbed 都是 200；2 支 401 的都是文字連結，正文也有寫明。

### 逐條宣告

| # | 宣告（zh 段落） | 判定 | 來源與原文 |
|---|---|---|---|
| 1 | 芭蕾舞者／伐木工；縫寬幾公釐情況反過來；差一公釐從輕鬆變成做不到 | 🟢 | climbing.com/skills/how-to-climb-finger-cracks/（2021-08-14，作者 Pete Whittaker，書摘自 Mountaineers 2020 的書）：「Just one millimeter larger or smaller can be the difference between a move feeling easy or impossible」「if we were to widen the crack by a few millimeters… our lumberjack's fingers would lock」 |
| 2 | Whittaker 說指縫是最挑手的尺寸之一 | 🟢 | 同上：「Finger cracks are one of the most fickle sizes」 |
| 3 | 拇指朝下四步驟（敬禮、手肘往外、手腕往外彎指尖對準、拇指留在縫外、手掌前臂貼平、想像鐵棒手腕不彎、手肘轉到和裂隙平行、無名指疊上去、小指貼縫壁、往下拉不要往外拉） | 🟢 | 同上 step 1–7：「as if you were saluting someone」「thumb on the outside of the crack」「metal rod running up your forearm」「ring finger… stacked on your front two fingers」「little finger will come out the crack and should be placed against the crack wall」「Pull down on the jam, not out」。「食指和中指咬住岩壁」是作者自己的濃縮，原文沒有這句，但原文說無名指會轉出來疊在「front two fingers」上，意思相符 |
| 4 | 食指留在外面、中指當最下面那根的變化 | 🟢 | 同上：「with your index finger out of the crack and your middle finger as the bottom finger… slightly too thin… becoming increasingly painful」 |
| 5 | 小指朝下扭得少、沒有縮口時一直覺得要滑掉、很費力；找到縮口可能比大把手還舒服；從手腕轉，像開難開的鎖，等它卡進去 | 🟢 | 同上：「there is not as much [twisting] as in thumb-down jams… feel like it is slipping, and be very strenuous… can often be better than holding a massive jug」「rotate from the wrist」「a 'tricky to open' lock… wait for it to click into place」 |
| 6 | 永遠先找縮口，能被動卡就不用主動扭 | 🟢 | 同上：「Remember when inserting a body part into a crack to always look for constrictions to jam passively first」 |
| 7 | 指節像岩楔、幾乎不用出力、可以一直掛著；pin scar 和 pod 都是縮口上方的寬處 | 🟢 | climbing.com/skills/finger-cracks/（2022-04-13，作者 Julie Ellison）：「Your knuckles act like nuts, wedging into constrictions. It takes very little muscle engagement, and you feel like you could hang on forever. Pin scars and pods provide wider spots directly above constrictions」 |
| 8 | Ouellet：手肘往肋骨收、手放鬆不要抓太緊；一直拇指朝下是新手錯誤、拇指朝上能多搆一點；再小的凸起都夠撐到下一個指塞 | 🟢 | 同上，「Fine-tune Your crack technique / With Jean-Pierre "Peewee" Ouellet」那一節：「Keep your elbows in toward your rib cage at all times」「Relax those hands. Don't over-grip」「Jamming thumb-down all the time is a rookie mistake. Sometimes thumb-up will give you that extra reach」；Feet 段：「Finger-crack master Jean-Pierre Ouellet says, 'The tiniest bumps will be good enough to get to the next jam.'」 |
| 9 | 下手拇指朝上在胸口、上手拇指朝下平移；往左斜就左手在上拇指朝下、右手拇指朝上 | 🟢 | 同上：「keep the lower hand thumb-up around chest level and the higher hand thumb-down」「If the crack leans left, lead with your left hand (thumb-down) and follow with the right hand (thumb-up)」 |
| 10 | 爬指縫的祕訣還是在腳；除非腳特別小，不然只能塞腳尖、抹在縫緣、找縫外的點；建議軟、合腳、鞋頭薄的鞋 | 🟢 | 同上：「The secret to floating up finger fissures is still in the feet… Unless your feet are freakishly small, you'll have to jam just your tippy toes, smear on the edges of the crack, or look for holds on the face」「Soft, sensitive shoes that fit tightly are best, like thin-toed slippers」 |
| 11 | 腳的三招：腳尖塞（轉腳踝、大拇趾當支點、小趾側滾進去、往縫緣推、「有重量壓著的腳不會滑」、縫稍陡或稍寬時用）／正面抹（腳尖在縫緣、腳跟下壓；pin scar、pod、外張、內角時用）／青蛙腳（腳高在屁股下、膝蓋朝外、互推不扭、屁股壓腳跟、小步不交叉；很平行時用） | 🟢 | wideboyz.school〈3 Secret Weapons for Finger Cracks〉（Exa 抓到發佈日 2025-12-30）：「Twist mainly at the ankle」「Place your big toe in the crack first and use it as a pivot point」「'a weighted foot never slips'」「when the crack is a little steeper, or a little wider」「drop your heel」「lots of pinscars, pods, flares, or the crack is in a slight corner」「Keep your knees pointing out」「Don't twist your feet」「don't cross them」「very splitter and twisting the foot just makes the boot rubber roll out」 |
| 12 | 0.3／0.4 細手指輕鬆卡住、粗手指皮膚接觸少；0.5 大手是舒服的指塞、小手要改 ring lock；指尖能插過第一指節就一定有技巧可用；2026 年電子報 | 🟢 | wideboyz.school〈A New FA in Kristiansund…〉（2026-10-03）：「#0.3 & #0.4… smaller fingers lock effortlessly while bigger hands struggle to get as much skin contact」「#0.5 (Purple Cam): A larger hand can finger jam comfortably here, whereas a smaller hand often has to ringlock」「unless you cannot get your fingertip into the crack past the first joint, there is ALWAYS a crack technique you can use」 |
| 13 | にわかアルピニスト的 Camalot 對照：0.4 到指根最好塞；0.3 食指中指第二指節進不去、小指側可以再深、越扭越緊；**0.5「縫不窄卻會晃」**、是鬼門、要用拇指；0.2 以下多半只有指尖；以粗手指為準、請讀者換算 | 🔴 **其中 0.5 那句錯了**，其他 🟢 | kyokarakimiwa.com/fingercrack-susume/（2025-08-28）：「筆者の指（太め）で書いているので自分のサイズで想像してみてください」「#0.4… 指は付け根までいれることができます」「#0.3… 太い指（人差し指，中指）の第2関節はクラックの中に入れきることができません．逆に小指側であればもう少し奥まで入る」「捻れば捻るほど利きがよくなる」「フィンガークラックの鬼門となるのがこの#0.5…**狭いのにスカスカ**」「#0.2…せいぜい指先だけ」。「狭いのに」是「明明很窄」，zh「縫不窄卻會晃」與 en「not narrow, yet loose」意思都反了。另外「鬼門」原文是講指縫整體的鬼門（「フィンガークラックの鬼門」），en 寫「the author's nemesis size」縮成作者個人，屬於小偏差 |
| 14 | 日本作者的腳：0.4 腳尖勉強、0.3 很難，先找錯位處或縫外點，最後才抹；0.2 以下穿一般運攀鞋 | 🟢 | 同上：「トゥジャムがギリギリ決まるかどうか」「オフセットした箇所やクラック外のスタンスを探す…本当に何もないときはクラックに押し当てスメア」「このくらいのサイズのクラックでは筆者はフェイスのシューズを履きます」 |
| 15 | 指塞只要進到第一指節前端就做得出來、比這更細的路線少；膠帶兩圈粗約 1 mm、在 2 cm 指縫裡差很多 | 🟢 | kyokarakimiwa.com/finger-crack-vs-hutoiyubi/（2025-12-15）：「指の第一関節の先くらいまで指が入ればきめることができます…それよりも細いルートは少数派」「2周巻いたとすると指は直径で1mm前後太くなる」「2cm幅のクラック（フィンガー）…5%」 |
| 16 | 部落格作者與 B1 頻道「同名」 | 🟢 | 部落格名「今日からきみは！！」、作者自稱「にわかアルピニスト」；頻道名「今日からきみは‼-にわかアルピニスト」。只寫「同名」，用詞恰當 |
| 17 | 日文逆手＝拇指朝下、順手＝拇指朝上（zh／en glossary 與正文） | 🟡 single-source inference | 找不到明確寫出這個定義的日文來源（Exa 兩次搜尋）。蜘蛛の糸說明欄「右逆手フィンガー（親指は添えて、小指は抜いて）」跟 Whittaker 拇指朝下第 6 步（小指出來）一致，可以間接支持。風險低 |
| 18 | 蜘蛛の糸 5.11c、小川山、ROCKTOPO 列為「小川山三大裂隙」 | 🟢 | rocktopo.net/routes/743（Exa）：「グレード 5.11c」「長野県 / 小川山 / 屋根岩周辺 / 屋根岩２峰」「タグ 小川山３大クラック」。註：同頁寫「ボルトの数 2 本」，正文沒有說這條全是傳統保護，所以不衝突 |
| 19 | 「這和 Whittaker 第 3 步『小指出來貼在縫壁』是同一件事」 | 🔵 輕微 | 說明欄講的是「小指は抜いて」（小指抽出來），沒有說貼在縫壁。兩者相近，但「同一件事」說得比來源更滿。另外「拇指輕靠**在外**」的「在外」是作者加上的，原文只寫「親指は添えて」 |
| 20 | B1フィンガー 5.11a、地獄エリア | 🟢 | rocktopo.net/rocks/1009（Exa）：「B1フィンガー リード（クラック） 5.11a」。註：同區列有「杉野カンテ リード（フェイス） 5.12a」，「全部不打錨栓」是正文轉述說明欄，已經標明出處，可以留著 |
| 21 | Pat's Blue Ribbon：MP 標 5.13-、陡的指縫有一個 pod、核心從 pod 到岩稜；Mary Eden 在 Indian Creek | 🟢 | mountainproject.com/route/106438398：「5.13- YDS」「A steep finger splitter… has a crux sequence from the pod to the arete」；影片說明欄「Pat's Blue Ribbon is a painful finger crack in Indian Creek, Utah… follow Mary Eden」 |
| 22 | 1972 Chouinard／Frost〈A Word…〉：器材目錄開頭；硬鋼岩釘反覆敲拔、優勝美地熱門路線的裂隙變成一連串岩釘洞；宣布從岩釘改推岩楔、提倡乾淨攀登 | 🟢 | patagonia.ca/stories/…/story-116598.html（Exa，Patagonia 2022-02-10 重刊）：「the introduction to the 1972 Chouinard Equipment catalog… written by Yvon Chouinard and Tom Frost」「much softer than the alloy steel pitons being hammered into it. On popular routes in Yosemite and elsewhere the cracks are degenerating into series of piton holes」「repeated placement and removal of hard pitons」「this essay marks their switch from pitons to chocks」「'clean climbing' principles」。原文沒有「pin scar」這個詞，「這些凹洞就是 pin scar」是作者自己接上的，說法合理 |
| 23 | Serenity Crack 5.10d、3 段；P1 數百個 1 號 Camalot 大小的 pin scar 排成梯子、很長一段放不到牢靠保護、很傷腳趾 | 🟢 | mountainproject.com/route/105862912（curl＋Exa）：「5.10d… PG13」「Trad, 350 ft, 3 pitches」「Hundreds of blown out pin scars the size of #1 Camalots create a practical ladder up the pitch. Unfortunately, secure gear is not available for a long, long ways… painful on the toes」 |
| 24 | 「留言裡有人帶了 offset cam 也放不好，因為凹洞太外張或太淺；好不容易放進一顆，cam 又擋住了下一步的腳點」 | 🟢 原文找得到，但 🔵 只講了一面 | Aaron Hope 留言（2012-09-09，作者快取行 152）：「I brought my offset cams. Didn't really work. The scars are just too flaring or too shallow… the cam made the next move harder by blocking a perfectly good foothold!」。同頁可見的另一則留言 Paul Hunnicutt（2007-10-22）意思相反：「Metolius offset cams worked so well here」；作者快取行 65 也有「a .5/.75 offset cam will likely work… basically makes the pitch safe」。練習題 4 的答案又建議「帶 offset cam」，跟正文這句方向打架 |
| 25 | glossary：「〈Serenity Crack〉第 1 段整段都是」pin scar | 🔵 輕微 | MP 說明寫 P1 有「hundreds of… pin scars」，但留言（作者快取行 93）說「after the first 40 feet the pin scars get much less」，MP 說明本身也寫「sometimes great wires up higher」。「整段都是」說得太滿；en「almost entirely」比較接近 |
| 26 | 龍洞 Fillet Show 5.8：內角深處乾淨的指縫、保護挑、確保者站在浪上方的窄平台、要先架確保站 | 🟢 | mountainproject.com/route/107991222：「Long Dong」「5.8」「narrow platform… belayer will be perched precariously over crashing waves… belay anchor advised… clean finger crack in the back of the dihedral. Gear can be a little finicky」 |
| 27 | Grotto 5.10b 在第二洞，很快縮成手指再縮到指尖、靠手塞和抹腳 | 🟢 | mountainproject.com/route/107843884：「Second Cave」「5.10b」「quickly thins to fingers and then to tips. Work up on decent hand jams and smearing feet」 |
| 28 | Finger Crack 5.11：音樂廳最右邊那排錨栓、不用帶 cam；留言說手指細的人核心簡單很多 | 🟢 | mountainproject.com/route/106740874：「5.11」「Sport」「The rightmost line of bolts… Music Hall」「Leave your rack at home」；留言：「Small fingers make the crux far easier」 |
| 29 | 김종식：改 layback／繼續塞的三條件（塞不塞得住、縫緣好不好抓、80 度）；約 5.10c；左向內角 | 🟢 | gZw9eiu0xM0 en 字幕 374／391／522（見影片表）；片名「선인봉 좌향 크랙」 |
| 30 | 김종식：「塞很痛，**但掉的時候比較穩**；layback 比較快、比較省力。結論是，為了穩，痛也值得塞」（en：「jamming hurts but is stable if you fall」） | 🔵 **Misframed** | en 字幕 410：「Jamming is stable from falling」；ko 字幕 415–437：「레이백은 손과 발에 짝 힘으로 유지되기 때문에 손이나 발 중에서 하나가 터지면 바로 추락으로 이어집니다 반면에 재밍은 손 따로 발 따로… 어느 하나가 터져도 다른 것들이 추락을 막아줄 가능성이 크다는 것이죠 이것이 아픔을 감수하고 재밍을 하는 가장 큰 이유」。意思是**塞比較不容易掉**：layback 靠手腳對拉，一點滑掉就整個掉；塞的話手腳各自獨立，一點滑掉其他點還撐得住。這跟「掉的時候」怎樣無關 |
| 31 | 김종식：layback 是全身姿勢、塞是握法，本來不是同一層的二選一，只是大家習慣這樣講 | 🟢 | en 字幕 6「lay back is whole body posture and jamming is sort of a way of grip」、117「this classify… has been used for a long time and it's reasonable」 |
| 32 | Hazel Findlay：手腳小有時對裂隙有幫助 | 🟢 | 見影片表 |
| 33 | 參考資料的年份（Climbing.com 書摘 2021、Nine Tips 2022、Wide Boyz 2025／2026、にわか 2025 ×2、各影片年份） | 🟢 | 都核對過頁面的 datePublished 和 yt-dlp 的 upload_date |
| 34 | 「Climbing.com 有書摘」、Pete Whittaker《Crack Climbing》 | 🟢 | 書摘頁：「Excerpted with permission from Crack Climbing: The Definitive Guide by Pete Whittaker (Mountaineers Books, 2020)」 |

### 歸因標籤統計

全篇大約有 6 處「X 說／作者也提醒」這種逐句歸因，大多是區分不同來源的意見（例如 Whittaker 和 Ouellet 對拇指朝向的說法不同），屬於內容本身，不是在堆但書。這次不列成要改的項目。

### 必改

1. **#13**（zh 第 62 行附近、en 第 62 行）：0.5 號「縫不窄卻會晃」／「not narrow, yet loose」把原文「狭いのにスカスカ」的意思寫反了。建議改成「明明很窄卻會晃」／「narrow, yet loose」。en 的「the author's nemesis size」也順手改成「the nemesis size of finger cracks」。
2. **#30**（zh 第 179 行、en 第 179 行）：「掉的時候比較穩」／「stable if you fall」是誤讀。建議改成：「塞很痛，但比較不容易掉：layback 靠手腳對拉，一點滑掉就整個掉下去；塞的時候手腳各自卡住，一點滑掉，其他點還撐得住。layback 比較快、比較省力。結論是，為了不掉，痛也值得塞。」en 照同樣意思改。

### 建議改

1. **#24** Serenity 的 offset 留言：正文只引用了「offset 放不好」那一則，同一頁也有人說 offset 很好用，練習題 4 又叫讀者帶 offset。建議縮成兩邊都講的一句：「留言對 offset cam 評價不一：有人說很好用，也有人說凹洞太外張或太淺放不好；有人好不容易放進一顆，cam 又擋住了下一步的腳點。」
2. **#25** glossary「第 1 段整段都是」改成「第 1 段大部分都是」（en 已經寫 almost entirely）。
3. **#19** 「和 Whittaker 第 3 步『小指出來貼在縫壁』是同一件事」改成「和 Whittaker 說的小指會跑出縫外是同一個現象」；「拇指輕靠在外」的「在外」刪掉，照原文寫「拇指輕輕靠著」。
4. **#17** 逆手／順手的定義目前沒有直接寫出來的來源。可以找一份日文教材補引用，或者把正文縮成「說明欄寫的是逆手、順手」，不要另外下定義。
5. Pat's Blue Ribbon「2 分 48 秒起 Mary Eden 說」：說話的人是 Mary Eden 是從說明欄和第一人稱口吻推出來的，字幕沒有寫名字。風險低，可以照留。
6. 嵌入 fence 的標題：Serenity 實際標題結尾有「Valley.」；쏘맥 那支的實際標題開頭有「내 인생 최고의 등반!」。屬於格式問題，交給 post-review 決定要不要照抄原標題。

範圍聲明：本次只檢查了文中已提出的 34 條宣告與 11 支影片，未評估文章對主題的覆蓋是否完整。MP 路線頁的留言（需要登入）有一則只透過作者的原始頁面快取確認。

下一步（未完成前不能 commit）：post-review、post-polish。
