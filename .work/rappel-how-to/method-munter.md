# 沒有垂降器時的替代方法：Munter（義大利半扣）、鉤環制動、Dülfersitz（身體垂降）

研究日期：2026-10-24。影片字幕存在 `.work/rappel-how-to/videos-munter/`（`<id>.en.vtt` 原檔、`<id>.txt` 為帶秒數的去重文字、`meta.tsv` 為 yt-dlp 查到的確切上傳日期與長度）。

工具紀錄（toolDegradation）：Groundlane 本 session 未重試（上游 agent 回報 401）；搜尋改用 Keenable keyless API；頁面一律 curl 抓 HTML 轉文字逐段讀，Mountaineers 頁 curl 403 改用 r.jina.ai。YouTube：`scripts/yt-candidates.mjs` 掃 37 個頻道＋6 組關鍵字（門檻放寬到 2015-01-01，因為是舊技術），再手動 ytsearch 12 組補漏。字幕第一輪多支 429，第二輪用 `--cookies-from-browser chrome` 補抓。

**字幕品質警告**：`5l4f_-cvPng`、`jnIP0nb4Tuo`、`Y1V5Pnc3OuQ`、`ZHL7isj3r84` 四支是帶 cookies 第二輪抓的，拿到的是 YouTube 自動翻譯過的英文（可看出 "Manter knot"、"dulfer"、"self-fear" 這類回譯痕跡）。秒數可信，字句**不是原話**，不可當直接引文。其他影片字幕是原語言自動字幕。

---

## 一、專業來源（全部已打開）

| # | 來源 | 作者／機構 | 日期 | URL |
|---|---|---|---|---|
| M1 | AAC Accidents: "Rappel Failure — Munter Hitch Unscrewed a Locking Carabiner" | Nathan Chaszeyka（當事人自述）；圖 Foster Denney | Climb Year 2024（12/10，Ouray, CO），Publication Year 2025 | https://publications.americanalpineclub.org/articles/13201217271 |
| M2 | Alpine Savvy: The no twist Munter hitch rappel | Alpinesavvy（Portland） | datePublished 2021-10-05，dateModified 2026-05-28 | https://alpinesavvy.com/blog/the-no-twist-munter-hitch-rappel |
| M3 | Alpine Savvy: A slick carabiner rappel brake | Alpinesavvy | 2019-10-18，modified 2024-12-21 | https://alpinesavvy.com/blog/a-slick-carabiner-rappel-brake |
| M4 | The Mountaineers: Extended Rappel and Updated Belay Techniques（引 AMGA SPI） | Abby Hunt、Stef Schiller | 無可靠日期（約 2015；參考 2014 AMGA SPI Manual） | https://mountaineers.org/blog/extended-rappel-and-updated-belay-techniques |
| M5 | bergundsteigen #alpinhack: Abseilen ohne Abseilgerät（三鎖扣鉤環制動） | Gebi Bendler（山岳與滑雪嚮導、bergundsteigen 總編） | 2021-09-08（#115 Sommer 21） | https://www.bergundsteigen.com/artikel/alpinhack-abseilen-ohne-abseilgeraet/ |
| M6 | bergundsteigen #alpinhack: Abseilgerät runtergefallen? 2.0（Iten-Bremse） | Gebi Bendler；技術來自瑞士嚮導 Lucas Iten | 2021-11-09（#116 Herbst 21） | https://www.bergundsteigen.com/artikel/alpinhack-abseilgeraet-runtergefallen-2-0/ |
| M7 | bergundsteigen #alpinhacks: Abseilgerät runtergefallen 3.0（HMS 防扭法，出自 SAC《Bergsport Sommer》第 6 版） | Gebi Bendler | 2022-04-25（#117 Winter 21-22） | https://www.bergundsteigen.com/artikel/alpinhacks-abseilgeraet-runtergefallen-3-0/ |
| M8 | bergundsteigen: Fehler beim Abseilen: 20 Tipps | Andi Dick（DAV） | 2024-06-03 | https://bergundsteigen.com/artikel/fehler-beim-abseilen-20-tipps |
| M9 | Petzl: Examples of dangerous carabiner loading | Petzl | 無日期 | https://petzl.com/us/en/tactical/tech-tips-by-product/choosing-the-right-equipment/examples-of-dangerous-carabiner-loading./mousquetonsV2-pe20-mauvais-Positionnements_MIL_a77w0000000GmwQAAS.html |
| M10 | Petzl: Rappelling on the RAD LINE cord | Petzl | 無日期 | https://petzl.com/us/en/sport/tech-tips/basic-techniques/rappelling-on-the-rad-line-cord/RADsystem-pe05-descente-rappel-JIVE_SPO_a77w0000000PC6hAAG.html |
| M11 | Petzl: Helping a partner during a ski descent | Petzl | 無日期 | https://petzl.com/int/en/sport/tech-tips/basic-techniques/helping-a-partner-during-a-ski-descent/ski-aide-equipier-couloir_SPO_a77w0000000TOoAAAW.html |
| M12 | Petzl: Video – Munter Hitch With Mule Knot and Stopper Knot（下放用，非垂降） | Petzl；影片 youtube z3p4w6grn0k | 無日期 | https://petzl.com/int/en/sport/tech-tips/basic-techniques/video-%E2%80%93-munter-hitch-with-mule-knot-and-stopper-knot/Video---Demi-cabestan-avec-un-noeud-de-mule-et-noe_SPO_a77bK000007VEnRQAW.html |
| M13 | Northeast Alpine Start: The Munter Hitch: History, Formation, and Applications | David Lottmann（about 頁：AMGA Single Pitch Instructor、專業嚮導）；文末有聯盟連結聲明 | 2024-06-04 | https://northeastalpinestart.com/2024/06/04/the-munter-hitch-history-formation-and-applications |
| M14 | SAC Die Alpen: Abseilen – kein Problem? | Ueli Mosimann | 1994（年鑑） | https://www.sac-cas.ch/de/die-alpen/abseilen-kein-problem-12767/ |
| M15 | Wikipedia: Dülfersitz | — | oldid 1313480359 | https://en.wikipedia.org/wiki/D%C3%BClfersitz |
| M16 | Caving UK: Body abseil, a full history | 洞穴愛好者站（非官方） | 無日期 | https://www.cavinguk.co.uk/info/verticalterminologypart-bodyabseil |
| M17 | UIAA: Mountain skills – partner stuck mid-rappel（UIAA Alpine Summer Skills Handbook 節錄，與 Petzl Foundation 合作） | UIAA | 2018-07-17 | https://theuiaa.org/mountain-skills-how-to-provide-assistance-to-a-partner-stuck-mid-rappel |
| M18 | Mountain Training: Mountain Leader candidate handbook；Abseil Module candidate handbook | Mountain Training UK | ML 08/2026；Abseil 06/2026 | http://mountain-training.org/media/dvzfszlq/mountain-leader-candidate-handbook.pdf ；http://mountain-training.org/media/gqajd1gz/abseil-module-candidate-handbook.pdf |
| (轉載) | Lacrux: Descender fallen down – what to do?（M7 的英譯轉載，機翻品質差，只用來交叉確認） | Gebi Bendler | 2022-01-20 | https://lacrux.com/en/klettern/Abseiling-device-fell-down-what-to-do |

找不到的：
- **UIAA**：搜不到 UIAA 談 Munter 垂降、鉤環制動或身體垂降的頁面。M17 只在救援步驟提到 "doublelocking-carabiner braking system"（第 7 步），沒有說明怎麼做。
- **BMC**：搜不到 BMC 談 Italian hitch 垂降的頁面；BMC 對器材讓鉤環脫開的事故，既有研究 S12（八字環撬開鎖扣）已收錄，見 `sources-professional.md`。
- **Petzl**：沒有「用 Munter 垂降」的 tech tip。Petzl 對 Munter 的直接說法只出現在 M10、M11、M12。WILLIAM 產品頁靠 JS 渲染，curl 抓不到「Munter」字樣，所以沒有引用。
- **DAV（alpenverein.de）**：〈Sicherheitsrelevantes zum Abseilen〉全文讀過，不提 HMS、鉤環制動或 Dülfersitz。DAV 的立場只能從 M8（Andi Dick）看到。
- **官方明講「不要用身體垂降」**：沒找到現行國家協會的明文。最接近的是 M14（SAC 1994）的歷史評價，以及 M16 這個非官方來源。Mountain Training 的 ML 大綱 4.2.5 只寫 "Demonstrate the use, and explain the limitations, of the rope alone"，沒有點名 classic abseil。

---

## 二、Munter（義大利半扣／HMS）垂降

### 什麼時候用
- M2 Alpine Savvy："Rappelling on a Munter hitch is considered by some to be an outdated, old school technique"，但列出仍有用的情況："Dropped or forgot your device"、"Ropes are frozen and hard to get into a rappel device; sometimes the Munter is the only thing that can work"、"ultra skinny 6 mm static cord … too small for a standard rappel device"、想輕量化的短垂降。
- M10 Petzl（RAD LINE 6 mm）：用 REVERSO 的好處是 "simplicity of use, especially for a beginner with poor Munter hitch skills. It also twists the rope less than the Munter hitch." "In any case, using a rappel backup system is recommended."
- M7 bergundsteigen："Wenn der Tuber in einer Mehrseillängenroute hinunterfällt, kann man auf den Halbmastwurf zum Abseilen zurückgreifen. Dabei kommt es jedoch zu extremer Krangelbildung und die verdrehten Seile lassen sich dann nur mehr schwer abziehen."（中譯：多繩距路線上掉了 tube，可以改用 HMS 垂降，但繩子會嚴重扭結，扭過的繩之後很難拉下來。）
- M8 Andi Dick 自述：在 Verdon 用 HMS 在細的 twin rope 上垂降（唯一的垂降器給了同伴），找下一站時壓力很大，"ein verstärkter HMS (Schumann-HMS) und/oder Endknoten und Kurzprusik wären entspannend gewesen"（中譯：加強版 HMS、繩尾結或短 prusik 會讓人安心很多）。

### 怎麼打（兩股）
- 鉤環：大型梨形（HMS，H 型）有鎖鉤環，直接掛在確保環上。M13："This hitch works best on a large pear shaped locking HMS style carabiner"；"HMS" = Halbmastwurfsicherung。M1 當事人用的也是 "a large HMS-style locking carabiner"。
- 打法（同 clove hitch 前半，兩股一起打）：HowNOT2 影片 173 秒起示範 "tying a clove hitch and not finishing the second loop"，並教一個檢查法："rolling the knot and if it looks the same on the other side after it's rolled"。
- **制動股放在鉤環背脊（spine）側**：AMGA 講師 Olivia Reis（Outdoor Research 影片 147 秒）："I want to clip this so the brake strand is on the spine of my carabiner because when I rappel … if it's on the gate side it can rub and unscrew my gate"。Short Guys（2026）："the rope could twist in the direction that would unscrew a gate if I had the brake gate side"。
- **制動手位置**：Munter 的制動力在兩股平行時最大，所以垂降時制動手要往上，跟 ATC 往下相反。HowNOT2："you're going to be holding your brake strand up … which is a very big difference from an atc"。M1 當事人不加 prusik 的理由也是 "to allow braking with the parallel strands"。M13："if you rappel by holding your brake strand parallel to the rope you can manage this without twisting your rope but this practice is very unintuitive … I would only use it as a last resort"。
- **不要延伸**：M4 Mountaineers 談延伸垂降時寫："This is not intended for use with a Munter rappel." Short Guys（2026，682 秒）："we won't typically see the Munter extended away from our harness as we can exacerbate the twisting … which can also twist our extension. Plus … avoid the potential for the rope to rub across the extension"。Carsten Deap（0tagoYFDNCk）也說 "it's not a good idea to extend the munter hitch because it can start to twist the rope which twists your extension"。M7 的防扭法要求 "Der Abseilkarabiner muss direkt in den Anseilgurt eingehängt werden. Mit einer Schlinge dazwischen funktioniert es nicht."（中譯：垂降鉤環一定要直接掛在吊帶上，中間串一條扁帶就不管用。）
- **後備（backup）**：因為 Munter 不延伸，美式的「延伸＋prusik 掛確保環」做法用不上。可行的做法：
  - Short Guys／Carsten Deap 的「Lux lock」：把延伸扁帶繞到腰側，讓 friction hitch 落在髖部制動手那一側，抬腿時不會頂到 Munter（0tagoYFDNCk 33–83 秒；hbJ1kS0avX4 698–713 秒）。
  - JB Mountain Skills（2024）把 prusik 放在制動股上，掛在腿環附近（925–948 秒）："I think having a prusik trumps the perfect braking position"。
  - M7 SAC 做法是把 Klemmknoten 掛在 HMS **上方**當自我確保（"Klemmknoten für Selbstsicherung oberhalb der HMS einhängen"），建議用 FB 結。這跟北美「制動股下方 third hand」的位置不同，引用時要說明。
- **防扭／Super Munter**：
  - M2：「標準 Munter 垂降幾乎一定會扭繩」；防扭改法是把制動股從結的上方繞過，再從鉤環下方拉回右手（"Pass the brake strands over the TOP of the hitch, then pass them back UNDER the carabiner to your right hand"）。這招在 floppy 確保環的輕量吊帶上效果差。M2 說這招最早看到是在 Petzl Germany 的影片，但我沒找到那支影片。
  - M2 對 Super Munter 的立場："not recommended for one person on a double rope rappel because it adds too much friction"；單股固定繩配大鉤環則可以用。
  - M7 SAC 的防扭法："HMS im Abseilkarabiner einhängen, unteres Seil hochnehmen und vor dem Seil durchführen (A). Erst jetzt den Abseilkarabiner direkt in den Anseilgurt einhängen (B), Karabiner sichern (C)"；結論是 "Diese Technik ist die sicherste von den drei vorgestellten und wird von uns für den Kursbetrieb empfohlen!"（中譯：三種方法裡這個最安全，bergundsteigen 建議課程採用。）
  - M1 AAC 編者註：把讀者導向 "No Twist Munter"，說它 "not only negates tangling but also prevents the rope from coming in contact with the locking mechanism"。

### 風險與事故
- **扭繩**：扭過的繩在拉繩時會在固定點卡住（M2："the twists can bunch up and cause the rope to get completely stuck at the anchor"）。JB（2024，844–888 秒）說扭繩問題 "doesn't twist it quite as much as the internet would have you believe"，但連續多次垂降時，每次扭得更多，卡繩風險也跟著升高，所以長的多段垂降他寧可用鉤環制動。
- **繩子把鎖扣轉開、彈開扣門**：
  - M1 AAC：當事人第二段垂降時轉身看腳下，"the Munter hitch crept leftward toward the carabiner gate … The rope rolled over the gate (unscrewing it in the process), popped it open, and undid itself from the carabiner." 自由墜落約 80 ft，因為沒放開制動股，用手臂纏繩停住，離繩尾只剩 20–30 ft。傷勢：右跟骨骨折、左踝韌帶斷裂等。他事前**決定不用 prusik**，由下方同伴做 fireman's belay。事後改進："If I use a Munter to rappel again, I'll use a twin-gate locking carabiner or an autolocking carabiner."
  - M9 Petzl，扣門會打開的情況之一："The rock, the rope, or an item of equipment rubs against and unlocks the sleeve, and pushes on the gate in the direction of opening." 其中第 8 項為 "Rubbing on the sleeve (risk of opening the sleeve and gate)"。另外，梨形鉤環在扣門側受力只剩 30 %（例：WILLIAM 從 27 kN 降到 7 kN）。
- **摩擦不足**：細繩、單股、濕繩時摩擦不夠（M2）；Short Guys 也說 "not as much friction as we are used to with a device"。
- **制動手方向違反直覺**：見上；California Climbing School 影片明說他改把制動手放下面（見下面的衝突）。

### 影片（排序）
| 排名 | id | 標題（頻道） | 確切上傳日 | 長度 | 資格 | 商業關係 | 最佳片段 | 字幕佐證 | 與最佳實務衝突 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | hbJ1kS0avX4 | Munter Hitch Deep Dive - 5 Practical Applications Every Climber Needs（Short Guys Beta Works） | 2026-01-12 | 13:30 | Jason，頻道自述 "has taught these skills for years at the Colorado Mountain Club"；不是認證嚮導 | 說明欄有聯盟連結聲明 | 674 秒（垂降段，到 770 秒）；243 秒（制動股在扣門側的風險） | 674 "fifth type of use, repelling or abseiling if we have lost our device"；682 "we won't typically see the Munter extended"；719 "all applications of a Munter twist the rope, it is particularly bad with the rope tension of a repel"；755 "the rope could twist in the direction that would unscrew a gate if I had the brake gate side" | 無；與 M4、M1 一致。綜述性質，畫面上的垂降示範短 |
| 2 | mfIJVgtFsKM | Munter Hitch / Italian Hitch. What is it and what are the different versions and tricks.（JB Mountain Skills） | 2024-04-17 | 18:02 | Jez，北威爾斯攀岩與登山教練（依 climbing-gear-videos.md 標準稿） | 頻道標「器材店 Outside 支持」；說明欄有 buy-me-a-coffee | 825 秒（垂降，到 980 秒） | 841 "I can use an Italian hitch to abseil on … people will tell you it twists and kinks the rope it does it doesn't twist it quite as much as the internet would have you believe"；863 "multiple abseils … I would rather use some kind of carabiner brake"；903 "Italian hitch in both strands"；932 "don't want rope rubbing on the barrel does weird things to open it"；939 "having a prusik trumps the perfect braking position" | prusik 放在制動股（他自己說位置 "not necessarily ideal"）；淡化扭繩的程度，跟 M2、M7 的說法不同 |
| 3 | BshgXXn4UEk | Rappelling Hacks（HowNOT2） | 2021-12-08（2024 前） | 15:55 | 示範者 Mike、Bobby Hutton；非認證嚮導；書是 Andy Kirkpatrick 提供 | 說明欄 "SUPPORT US and get gear discounts"（hownot2.com 自營店） | 173 秒（Munter 兩股，到 320 秒）；510 秒（單股 Super Munter，到 660 秒） | 191 "i've dropped my grigri … and had to rap with a munter"；242 "unlike an atc you don't hold your brake stand down you're going to be holding your brake strand up"；281 "we're going to weight it and test it … before we unclip"；539 "super munter … puts an extra turn … keeps the rope from twisting" | 兩股 Munter 段沒有掛 friction hitch 後備；片尾的 saddlebag 段與本題無關 |
| 備 | VjWzxRJ9vtk | How to Set Up an Improvised Rappel（Outdoor Research） | 2018-04-27（舊） | 5:05 | Olivia Reis，自述 "a member of the AMGA instructor team"；說明欄寫 "techniques approved by the American Mountain Guides Association" | 品牌頻道（OR） | 147 秒（兩股 Munter，到 200 秒） | 153 "I want to clip this so the brake strand is on the spine of my carabiner"；174 "the munter will twist the rope the steeper and longer the rappel the more twists" | 無。一支影片涵蓋三種方法，第 2 節也會用到 |
| 備 | Y1V5Pnc3OuQ | How to Rappel with a Munter Hitch.（California Climbing School） | 2017-10-04（舊） | 2:19 | 嚮導學校；個人資格未查證 | 無 | 0 秒 | （翻譯字幕）制動股放背脊側以免轉開鎖扣；不要讓制動股磨到確保環 | **衝突**：沒有 prusik 後備（只說最好下方有人 fireman's belay）；示範者說理論上制動手該往上，但他刻意改往下，因為比較好握 |
| 補 | 0tagoYFDNCk | Easy way to back up a munter rappel（How To Rock and Alpine Climb） | 2024-08-18 | 1:29 | 示範者 Carsten Deap，場地是 Special Operations Mountain Warfare Training Center；個人資格未查證 | 無 | 10 秒 | 21 "it's not a good idea to extend the munter hitch because it can start to twist the rope which twists your extension"；83 "this style of backing up the munter hitch is called the Lux lock method" | 無；適合配「後備」段落 |

---

## 三、鉤環制動（carabiner brake）

### 怎麼做（三種變體）
1. **經典六鉤環**（兩組「反向對開」opposite and opposed 當連接，再兩個鉤環橫跨在雙股繩下方當制動桿）：OR／AMGA Olivia Reis，18–146 秒："we need six non-locking carabiners … the final two carabiners these I don't want to be opposed I do want them to be opposite … I want the rope to run over the spine of the carabiner instead of the gate"。"six of the same carabiners is ideal … if the carabiners aren't all the same it can make it a little harder to predict"。缺點："if I need to go back up the rope I can't really bump rope up through"。
2. **三鎖扣**（M3、M5；JB 2020、Lakeland 2022、AlpenAcademy 2024 都示範這種）：M3 的步驟原文——"1 - Clip a locking carabiner to your rappel extension. 2 - Clip a second locking carabiner to the first one. 3 - Pass a bight of both rappel rope strands through the second carabiner. 4 - Clip a third locking carabiner to these two strands of rope, and then … Clip that third carabiner onto the strands going to the anchor. Check that ALL carabiners are locked."
   - 第一個鉤環的作用是隔開：M3 "The third carabiner is mostly to prevent the rope from rubbing on your harness or rappel extension"；Seneca Rocks（2023）："to make sure that these two ropes while they travel do not rub up against your belay rappel loops they could burn you right out of the system"。
   - M5 建議 "am besten Safelockkarabiner verwenden"（最好用自動鎖鉤環）。M3 用兩個自動鎖："to lessen the chances of this happening"。
   - 增加摩擦："rotating the carabiners so the small ends are together"（M3；OR 247 秒 "gates opposed and the skinny ends together"）。
3. **Iten-Bremse**（兩個梨形 HMS 鎖扣，瑞士嚮導 Lucas Iten，2013-06 首用；M6）："Die Bremswirkung ist vergleichbar mit einem Achter oder Tuber … Definitiv komfortabler als Abseilen mit HMS."

### 風險
- **卸載後鉤環移位**：M5："Ist das System unter Last funktioniert es hervorragend … Wird das System jedoch entlastet (wenn man beispielsweise zu einem Podest kommt …), können die Karabiner verrutschen und sich so verdrehen, dass die Bremswirkung stark eingeschränkt wird. Schlimmstenfalls könnte man abstürzen."（中譯：受力時很好用；一旦卸載，例如踩到平台，鉤環可能滑動、轉向，制動力大減，最糟會墜落。）M6："Die Itenbremse kann bei einer kompletten Entlastung auseinanderfallen! Daher immer mit einer Reepschnur und einem Klemmknoten hintersichern."
- **一定要後備**：M5 "Ein Prusik- oder alternativer Klemmknoten ist zur Hintersicherung essenziell"，並建議 Aramid／Kevlar 輔助繩；M3 "Always use a third hand autoblock backup"。
- **摩擦比垂降器小**：M3 "The friction with this technique will probably be less than using a standard rappel device … probably best to use this technique in less than vertical terrain"。AlpenAcademy："Das ganze geht massiv ruppiger als … mit dem Tuber"（比用 tube 顛簸很多）。
- **繩子轉開扣門**：M3 "There is a remote chance that the rope might unscrew a carabiner gate"；OR 261 秒 "watch that the rope is unscrewing any of the gates"。
- **拆的時候掉鉤環**：M3 "when you remove your rope, it's really easy to drop a carabiner"。
- **制動桿鉤環大小不同**：Ryan Tilley（翻譯字幕，336 秒附近）說兩個制動鉤環要一模一樣，否則一個會從另一個中間穿過去。他另外宣稱「已經有人因此死亡」，這句**未查證**，不要引用。
- **鉤環制動的好處**：扭繩比 Munter 少很多。M5/M6 寫 "keine Krangelbildung"；Ryan Tilley 說 "still twists the rope but not nearly as much as the Munter"。M7 則認為兩種鉤環制動都不如它的 HMS 防扭法安全。

### 影片（排序）
| 排名 | id | 標題（頻道） | 確切上傳日 | 長度 | 資格 | 商業關係 | 最佳片段 | 字幕佐證 | 衝突 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | VjWzxRJ9vtk | How to Set Up an Improvised Rappel（Outdoor Research） | 2018-04-27（舊；這是傳統方法，可接受） | 5:05 | AMGA instructor team（Olivia Reis 自述＋說明欄） | OR 品牌頻道 | 18 秒（六鉤環，到 146 秒）；204 秒（三鎖扣，到 270 秒） | 26 "the carabiner brake to do that we need six non-locking carabiners"；58 "I want the rope to run over the spine of the carabiner instead of the gate"；209 "if I have three locking carabiners I can build another type of carabiner brake" | 無 |
| 2 | zql0JvL3sAI | Vom Standplatz zum Abseilen - Wie seilt man möglichst sicher ab?（AlpenAcademy，德語） | 2024-10-16 | 16:27 | 奧地利 AlpenAcademy（作者著有《Ende im Gelände》）；about 頁 curl 抓不到，個人資格未查證 | Patreon、自家商店、Bergfreunde／Bergzeit／Amazon 聯盟連結 | 567 秒（三鎖扣，到 658 秒） | 569 "Was kann ich denn machen, wenn mir jetzt mein Tuber hinuntergefallen ist?"；599 "beide Seilstränge, fädel sie beide durch den zweiten Karabiner … nicht durch den ersten aufgrund von Seilreibung mit der Bandschlinge"；635 "geht massiv ruppiger als … mit dem Tuber"；651 同時往下推 prusik | 無。唯一符合 2024+ 的鉤環制動示範 |
| 3 | lPemCN10lLo | What do do when you drop your abseil or rappel device!（Lakeland Ascents） | 2022-07-12 | 2:19 | 英國嚮導與訓練公司（開 ML／RCI 進修課）；示範者個人資格未查證 | 說明欄導向自家課程 | 70 秒（三鎖扣，到 125 秒）；21 秒（Italian，到 70 秒） | 64 "italian hitches … put a lot of twists in your rope … there is a better way"；80 "screwgate carabiner clip it into my abseil extension"；123 "we've got our prusik here as backup" | **Italian 段衝突**：43 秒把 Italian hitch 的鎖扣掛在延伸扁帶上，違反 M4／M7 與 Short Guys 的建議。鉤環制動段沒有問題 |
| 備 | 5l4f_-cvPng | Climbing How To: A carabiner brake for abseiling / rappelling（JB Mountain Skills） | 2020-05-13 | 6:00 | 同上（Jez） | 同上 | 133 秒（三鎖扣，到 300 秒） | 翻譯字幕，非原話：先說 Italian 會把兩股繩扭成「鳥巢」，再示範三個鎖扣，強調第三個鉤環讓繩不磨到扁帶，以及 "Don't forget to put on a Prusik" | 無 |
| 備 | 0CvA1Ft5iXA | Symmetrical Carabiner Brake（Seneca Rocks Mountain Guides） | 2023-12-08 | 1:43 | 嚮導公司（自述在 Seneca 營運 34 年以上）；個人資格未查證 | 無 | 0 秒 | 12 "take a locking carabiner clip that into your belay rappel loop"；76 "an extension carabiner to make sure that these two ropes … do not rub up against your belay rappel loops they could burn you right out of the system" | 片中沒有示範 prusik 後備 |
| 備 | jnIP0nb4Tuo | Quick Tip: The Carabiner Brake（Ryan Tilley） | 2020-06-14 | 6:52 | Short Guys 影片稱他 "AMGA guide Ryan Tilly"；**未獨立查證** | Patreon | 80 秒（六鉤環）；280 秒（鎖扣版）；336 秒（制動鉤環要同尺寸） | 翻譯字幕，不可直接引用 | 「有人因此死亡」的說法未查證 |

---

## 四、Dülfersitz／身體垂降（簡述）

- **歷史**：M14 SAC 1994 Ueli Mosimann："Abseilen im Dülfersitz war während Jahrzehnten die Standardmethode. Gemessen an den heutigen Möglichkeiten, war deren Handhabung heikel und fehleranfällig, denn die Sitz- und Bremsfunktionen waren nur mit dem um Gesäss und Schultern geschlungenen Seil und der daraus resultierenden Körperreibung gewährleistet."（中譯：Dülfersitz 幾十年來是標準垂降法；以今天的條件看，操作危險又容易出錯，因為坐姿和制動全靠繞在臀部與肩上的繩子跟身體的摩擦。）同文："Diese Methode wurde zum Standard und vermochte sich bis weit in die siebziger Jahre hinein zu halten"（一直沿用到 1970 年代後期）；"Der Dülfersitz allein war wohl bestechend einfach, erlaubte jedoch ohne Sitzgurt kaum eine wirkungsvolle Selbstsicherung."（很簡單，但沒有吊帶就幾乎無法有效自我確保。）
- **為什麼淘汰**：M15 Wikipedia："intense heat is generated by the friction on the shoulder, neck and thigh"；"if the braking hand releases the rope (due to panic, impact from a falling stone, or cramp), a fall is unavoidable if no additional means of security"。M16 Caving UK："All of them can leave scars from rope burns … All methods are far less safe than using dedicated equipment"；"in almost all cases, these methods should be avoided"。M16 也指出常說的 "Dülfersitz" 其實不是 Hans Dülfer 本人發明的那種（"This method is sometimes called the Dülfersitz, but this is not actually the method that Hans Dülfer invented"），寫文章時要注意這個命名問題。
- **官方明文**：見第一節「找不到的」。可以寫「現代協會教材已不把它當垂降方法教」（M14 為歷史描述），不要寫成「某協會明文禁止」。

### 影片
| 排名 | id | 標題（頻道） | 確切上傳日 | 長度 | 資格 | 最佳片段 | 字幕佐證 | 衝突 |
|---|---|---|---|---|---|---|---|---|
| 1 | CLQ0IltdYd0 | Two Methods to Rappel with ONLY a Rope（Ascentionism） | 2020-07-13 | 7:00 | Marcus，個人頻道；資格未查證 | 26 秒（免責聲明）；55 秒（Dülfersitz，到 207 秒）；209 秒（South African）；358 秒（結論） | 28 "these rappel methods are severely outdated they're difficult … painful and they're not super safe"；60 "a classic mountaineering rappel that was basically used before harnesses and friction devices were invented"；162 "you're gonna get really bad rope burn"；371 "I would probably recommend that you sit tight and wait for rescue" | 無；立場跟本文一致 |
| 2 | XUEsDGOgkUY | Ropework for scrambling 2: improvised abseils（Chris & Anne Ensoll） | 2020-04-10 | 3:24 | 英國 ML 訓練教練（資格未逐一查證） | 81 秒（classic abseil 與缺點）；114 秒（改用扁帶坐墊＋鉤環 Italian） | 88 "a classic ab which actually down this grass bank would be absolutely fine … feet getting steep then that gets pretty scary … painful"；168 "there is a real danger here that that can open that gate so obviously it needs to be done up" | 示範的是 scrambling 情境，不是技術垂降 |
| 3 | uqVK329xnUU | South African Rappel (Abseil): When and How to Use This Emergency Rappel When Climbing（Short Guys Beta Works） | 2022-08-22 | 3:17 | 同第二節 | 23 秒；116 秒（做法） | 23 "a mountain skill that i would categorize as for emergencies only" | 這是 South African，不是 Dülfersitz |

---

## 五、給寫文章的整合建議（全部有來源）

1. 掉了垂降器時的選項順序可以這樣寫：（a）請同伴從上方直接下放（M3 列為選項）；（b）Munter／HMS，直接掛在確保環、不延伸，用大梨形有鎖鉤環（最好用雙動作或自動鎖，M1）、制動股放背脊側，並加 friction hitch 後備；（c）鉤環制動，扭繩較少，但卸載時會鬆脫，一定要後備。歐系（SAC／bergundsteigen M7）把 HMS 防扭法列為三者中最安全；JB 則在多段長垂降時偏好鉤環制動。兩邊看法並陳即可。
2. AAC 2024/2025 案例是本段的主事故：沒用 prusik、轉身時繩子滾過扣門把鎖轉開、80 ft 墜落、靠沒放開的制動手停住。
3. Munter 的制動手要往上（兩股平行），這跟 ATC 相反，是新手最容易搞錯的地方（HowNOT2、M13、M1）。
4. Dülfersitz 只放一段歷史說明加「為什麼不用」，不教做法。
