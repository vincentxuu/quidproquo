# Review: 2026-10-19-climbing-history-world（zh + en）

Review date: 2026-10-19. Scope: 中英兩版，「攀岩文化與歷史」系列 order 0。只審不改：文章沒有動過，也沒有 commit。

工具：Groundlane MCP `web_fetch`／`web_search` 這次可以用（之前回 401 的問題已經沒了）。Britannica、UKC 新聞、IOC PDF 經 Groundlane 時串流中斷，改用 jina `read_url` 讀到全文。firecrawl 額度用完。其餘頁面用 curl 抓回本機，再用腳本 grep（scratchpad `review-world/pages/`）。每一條 Confirmed 都讀過來源全文，沒有只看搜尋摘要就判。

## post-verify

計數：🟢 Confirmed 44／🔵 Misframed 3（歸屬寫錯，數字本身是對的）／🟡 Unverifiable 2／🟠 Outdated 0／🔴 Contradicted 0。

### 🔵 Misframed（年份對，但歸屬寫錯）

1. 第 63 行表格：「[多羅米堤嚮導協會寫 1925 年](https://www.guidedolomiti.com/en/climbing/the-sixth-grade/)」
   → 這一頁是高山嚮導 Enrico Maioni 的個人網站文章，作者欄寫的是他本人，不是哪個嚮導協會；第 67 行也正確寫成「多羅米堤的嚮導 Enrico Maioni」。頁面原文："Willy Welzenbach was the first to codify climbing difficulties systematically, in 1925."
   → 建議改成「（[多羅米堤高山嚮導 Enrico Maioni 寫 1925 年](…)，其他說法有 1923、1926 年）」。英文版第 63 行「the Dolomites guides' association says 1925」→「Dolomites mountain guide Enrico Maioni gives 1925」。
2. 第 77 行：「Gill 轉引法國作者 Emmanuel Ratouis 的楓丹白露史寫到，Pierre Allain 在 1935 年發明了專為攀岩設計的軟底鞋」
   → Gill 2.0 頁裡，Ratouis 的引文停在「…In 1934 he established the first 5+ (5.11a) of the forest: L'Angle Allain . . ." - Ratouis.」。1935 年岩鞋那句是 Gill 自己寫的。年份正確，只是歸屬寫錯。
   → 建議改成「Gill 在他的楓丹白露史頁寫到，Pierre Allain 在 1935 年發明了……」。英文版第 77 行「Quoting the French writer Emmanuel Ratouis's history of the forest, Gill writes」→「Gill writes」。
3. 第 83 行：「Gill 的網頁則轉引 Ratouis，說楓丹白露的 Pierre Chevalier 大約在 1943 年把尼龍攀登繩帶進當地圈子」
   → 原文 "Another member of 'Le Groupe de Bleau', Pierre Chevalier, introduced nylon climbing rope about 1943." 是 Gill 自己的敘述，前後都不在 Ratouis 的引號裡。這句目前也沒有 inline link。
   → 建議改成「[Gill 的網頁](http://www128.pair.com/r3d4k7/Bouldering_History2.0.html)則寫到，楓丹白露的 Pierre Chevalier 大約在 1943 年……」。英文版第 83 行刪掉「again quoting Ratouis」，並補上同一個連結。

### 🟡 Unverifiable

4. 第 91 行：「1947 年 Fred Bernik 在楓丹白露畫出第一批『路線串』（circuit），**用顏色標出一串連續的問題**……這跟今天岩館用顏色分路線的做法很像。」
   → 引用的 Gill 1.0 頁只寫 "In 1947 Fred Bernik designed the first circuits at Fontainebleau as training exercises for alpine climbing."，完全沒有提到顏色。1947 年這批路線串是否已經用顏色標記，本次找不到來源。
   → 建議二選一：(a) 刪掉「用顏色標出」以及最後那句岩館類比，改成「設計出第一批『路線串』（circuit），把一連串問題排成固定順序，當成阿爾卑斯攀登的訓練」；(b) 找一份楓丹白露彩色路線串起源的一手來源（例如 Bleau.info 或 COSIROC 的歷史頁），附上連結再保留。英文版第 91 行「strings of problems marked in one colour … colour-code routes today」做同樣處理。
5. 第 101 行：「英國 Leeds 大學**體育講師** Don Robinson」
   → 引用的 donrobinson39 頁只看得到 "The University of Leeds 1964 to 1987" 這個目錄項目和 "built by Don Robinson"，沒有寫職稱。UKC 那篇〈How the Leeds Wall Changed Climbing History〉第一屏也沒有寫。風險低。
   → 建議改成「Leeds 大學的 Don Robinson」，或補一個寫明他職稱的來源。

### 🟢 Confirmed（不必動）

- 1864-03-06，五位 Schandau Turner 用梯子登 Falkenstein，路線叫 Turnerweg — [Sachsen-Lese](https://www.sachsen-lese.de/streifzuege/geschichtliches/die-erste-bergbesteigung-in-der-saechsischen-schweiz/)。（同一頁另寫 Ufer 1874 年是和 Hermann Frick 一起爬的，正文只寫 Ufer 也可以，見可選項。）
- 1874 Otto Ufer 自由攀登 Mönch — [outdoor-magazin](https://www.outdoor-magazin.com/klettern/elbsandstein-die-wiege-des-freikletterns/)＋Sachsen-Lese，兩個來源。
- 1886 年夏 Haskett Smith 獨攀 Napes Needle；日期有 6/28–7/4 的不同主張；被看成攀岩運動起點 — [Footless Crow](https://footlesscrow.blogspot.com/2017/02/walter-parry-haskett-smith-to-napes.html)（傳記作者 Frank Grant："in July 1886"、"various dates from June 28th through to July 4th"）。只有一個專門來源，而且是部落格，可選：補 FRCC 或 Britannica 當第二來源。
- 1887 Winkler 上下都無繩獨攀 — [Mountain Project](https://www.mountainproject.com/area/107937960/vajolet-towers)；1887-09-14 — [UKC Logbook](https://www.ukclimbing.com/logbook/crags/vajolet_towers-21057/winkler_crack-144418)。
- 1905 Fehrmann 在 Großer Wehlturm 首次用鑽孔鐵環；1913 年寫進指南補遺：保護「只能用來保護，不能用來前進」；薩克森規則透過自然保護法取得法律地位 — outdoor-magazin。
- 1911 Preuss（奧地利人）、Mauerhakenstreit、六條規則的內容 — [Climbing](https://www.climbing.com/culture-climbing/mauerhaken-streit-the-great-piton-debate-of-1911/)（"in the pages of the German Alpine Times"）。
- Kurt Albert（紐倫堡人），1970 年代去過薩克森，1975 年在 Frankenjura 畫紅點；紅點不能在鐵環上休息，後來成為全世界的主流 — outdoor-magazin。
- Welzenbach 1925 — Maioni（歸屬問題見第 1 條）；另外兩種說法 1923（de.wikipedia〈Schwierigkeitsskala (Klettern)〉）、1926（[Sestogrado](https://www.sestogrado.it/it/la-scala-welzenbach-e-lequivoco-del-sesto-grado/)："la presentò alla platea alpinistica nel 1926"）。正文寫「其他說法有 1923、1926 年」有根據，但沒附連結，見 post-review。
- UIAA：1967 年成為官方等級、1978 年加入 VII 級、1985 年明講往上開放 — [UIAA](https://theuiaa.org/grades-standards/rock-climbing)，三個年份逐字相符；1978 年另有 Maioni 佐證。VI 是「人類能力的極限」— Maioni。
- YDS 1956 隨 Wilson／Wilts 的指南發表；原本設計成 5.0–5.9；1960 年出現 5.10；a/b/c/d 細分是 Bridwell 在 1970 年代初加的 — [Idyllwild Climbers Alliance](https://idyllwildclimbers.org/overview/history)。
- V 級是 Sherman 在 Hueco 自創、往上不封頂，出現在 1991 年的指南 — [Climbing: The Source](https://www.climbing.com/news/the-source-how-hueco-gave-birth-to-modern-bouldering/)（"pen the 1991 and 1995 guidebooks"）。
- Gill 1950 年代的 B1／B2／B3 — [Climbing: John Gill](https://www.climbing.com/culture-climbing/john-gill-father-of-bouldering/)。
- 英國到 1940 年代還能靠鐵釘刮痕認出問題；Gill 讓粉痕取代釘痕；1950 年代把體操的做法和粉帶進抱石；free aerials（dyno）；1874 年楓丹白露已經有人爬巨石 — [Gill 1.0](http://www128.pair.com/r3d4k7/Bouldering_History1.0.html)。
- 1874 年 CAF 成立，成員在楓丹白露練習（Ratouis 引文）；1934 年 L'Angle Allain 5+（Ratouis 引文）；Allain 1935 年做出軟底鞋；黏性橡膠 1970 年代在西班牙發展出來；Chevalier 約 1943 年引進尼龍繩 — [Gill 2.0](http://www128.pair.com/r3d4k7/Bouldering_History2.0.html)。
- 1947 年 Bernik 設計第一批路線串，用來訓練阿爾卑斯攀登 — Gill 1.0（顏色那部分見第 4 條）。
- Allain 和 Bourdonneau（家裡開鞋廠）合作（1949／1950）；PA 是 Allain 的姓名縮寫；後來分成 EB — [Outdoor Inov8](https://outdoorinov8.com/ebsupergrattonhistory.html)。
- 美國的絞撚尼龍繩約 1940 年傳進歐洲；1953 年第一條可上市的登山用 kernmantle 繩 — [EDELRID](https://edelrid.com/eu-en/edelrid/about-us/160-years)。
- Schurman Rock 是「美國最古老的專門攀岩構造物」，1938 年起使用；Clark Schurman 想蓋一座人造的山 — [Seattle Parks](https://www.seattle.gov/parks/allparks/camp-long/camp-long-environmental-learning-center/schurman-rock-at-camp-long)。
- Robinson 1964 年在 Leeds 的走廊磚牆上做牆；起因是看到攀岩者春天受傷；先把動作列成清單；牆已經拆掉；之後開了 DR Climbing Walls 公司 — [donrobinson39](https://donrobinson39.wordpress.com/dr-climbing-walls-1975-to-2016/)。
- 1940 年代末蘇聯速度賽，到 1980 年代參賽者大多是蘇聯人 — [IFSC 存檔](https://web.archive.org/web/20150924033224/http://www.ifsc-climbing.org/index.php/about-ifsc/what-is-the-ifsc/history)＋IOC PDF，兩個來源。
- 1985 年 Bardonecchia 的 SportRoccia，辦在 Valle Stretta 天然岩壁，是第一場有組織的先鋒賽；1989 年首屆速度與先鋒世界盃；1990 年代初決定只在人工岩牆辦，理由是環境影響；1991 年法蘭克福首屆世錦賽；1998 年抱石成為正式項目、1999 年有世界盃；2007-01-27 在法蘭克福，48 個協會成立 IFSC；2006 年 UIAA 決定交出比賽管理權 — IFSC 存檔。
- 2016 年 8 月第 129 次 IOC 全會通過 — [UKC](https://www.ukclimbing.com/news/2016/08/sport_climbing_makes_tokyo_2020_olympics-70604)（"129th Session … Rio"）＋[IOC PDF](https://stillmed.olympics.com/media/Document%20Library/OlympicOrg/Factsheets-Reference-Documents/Games/OG/History-of-sports/Reference-document-Sport-Climbing-History-at-the-OG.pdf)（"129th IOC Session … in August"），兩個來源。
- 東京三項合併計分（UKC＋IOC PDF）；巴黎把速度和抱石先鋒分開 — [LACRUX](https://lacrux.com/en/sport-climbing-olympics-paris-2024/climbing-at-the-olympics-this-is-how-the-competition-format-works-in-paris)。
- The Nose 1958-11-12 首登，前後 45 天、跨一年多 — [Britannica](https://www.britannica.com/place/El-Capitan)（只有一個來源）。
- 王大濟回憶讀過朋友從美國帶回的一期《Climbing》、台灣大約晚歐美五年 — [TOCC](https://www.tocc-climbing.org/post/aac-guidebook-xiii)。注意：同一篇也寫「1980 年代晚期大濟開始攀岩」。讀雜誌那句是放在「1970 年代末」那一段裡講的，正文寫「1970 年代末他讀的是……」沒有超出原文，但讀者可能誤以為他 1970 年代就在爬。可選：改成「回憶 1970 年代末的情況：朋友從美國帶回……」。

範圍聲明：本次只檢查了文中已提出的 49 條宣告，沒有評估文章對主題的覆蓋是否完整。

## post-review

機械檢查：
- `pnpm verify`：只有 `check:series-plan` 紅，原因是本審稿紀錄還不存在（這份檔案寫完就會解除）。lint、references、lang-parity、grades、seo-smoke 等其他項目都綠。
- `pnpm check:links`（中、英各一次）：IOC PDF 回 TimeoutError，Britannica 回 403。兩個連結都經 jina 讀到全文，連結本身是活的：IOC 主機慢，Britannica 擋機器人。不用改。
- 站內連結：中文 7 條、英文 7 條，目標檔都存在。
- `check:tw` 0 擋下、0 待看；phrase ledger 0 命中。

🔴 必修（inline 來源，依步驟 8.5）
- 第 107 行整段（SportRoccia 1985、Bardonecchia／Valle Stretta、1989 世界盃、1991 法蘭克福、1990 年代初改用人工岩牆、1998／1999 抱石）沒有任何 inline link。這段的來源是第 105 行的 IFSC 存檔。建議在「先鋒賽的起點是 1985 年……」那句掛上同一個 [IFSC 官方史](https://web.archive.org/web/20150924033224/http://www.ifsc-climbing.org/index.php/about-ifsc/what-is-the-ifsc/history)。
- 第 109 行「2007 年 1 月 27 日，48 個國家協會在法蘭克福成立 IFSC」沒有連結。建議同樣掛 IFSC 存檔。
- 第 67 行「5.10 以上再細分 a、b、c、d，則是 1970 年代初優勝美地的 Jim Bridwell 加上的」沒有連結。建議掛 Idyllwild 那頁。
- 第 91 行「1934 年他完成森林裡第一條 5+ 級的問題 L'Angle Allain」沒有連結。建議掛 Gill 2.0。
- 第 83 行 Chevalier 1943 沒有連結（和 verify 第 3 條一起改）。
- 英文版對應的句子（第 67、83、91、107、109 行）同步補上。

🟡 建議修
- 第 63 行「其他說法有 1923、1926 年」沒有附來源，而計畫要求年份並列時要標來源。建議改成「其他說法有 [1923](https://de.wikipedia.org/wiki/Schwierigkeitsskala_(Klettern))、[1926](https://www.sestogrado.it/it/la-scala-welzenbach-e-lequivoco-del-sesto-grado/) 年」。1923 只有 Wikipedia 撐，如果要守「不只靠 Wikipedia」，可以改寫成「德文維基百科寫 1923」，把來源層級講清楚。
- frontmatter glossary「自由攀登」的 context：「1911 年 Preuss 的六條規則與 1913 年的薩克森規則，是**最早**把這個區分寫成文字的規則。」來源只支持「1913 年的規則至今仍是自由攀登的定義」（outdoor-magazin："Die erste Regel … ist die Definition des Freikletterns"），沒有說是「最早」。建議改成「是最早一批把這個區分寫成文字的規則」，或「1913 年的薩克森規則至今仍是自由攀登的定義」。英文版「were the first rules to put this distinction in writing」照同樣方式調整。
- 第 101 行「體育講師」見 verify 第 5 條。

🟢 可選
- 第 39 行 Ufer 1874 是和 Hermann Johannes Frick 一起爬的（Sachsen-Lese）。可以寫成「Otto Ufer 與 Hermann Frick」。
- Napes Needle 只有部落格一個來源，可以補一個 FRCC 或 Britannica 的頁面。
- 計畫列的「1937 比利時、1939 Seattle」人工岩牆，正文改用 Seattle 1938（Seattle Parks 官方）、沒有寫比利時。範圍合理，但和計畫表不一致，可以在計畫的交付紀錄註一句。

其他檢查（通過）：frontmatter 必填欄位齊全；`type: deep-dive` 和內容相符；tags 5 個，都是 kebab-case，`climbing-history` 是新的低頻 tag（全站 4 次，只用在這個系列），可以接受；`description` 和 `tldr` 沒有重複；tldr 每個數字（1935、1950 年代、1964、1956、1991、1940 年代末、1985、2021）都和正文、來源一致；heading 沒有跳級；練習題 4 題，答案用 `<details>` 收合；跨系列的主題（bolt 倫理、等級換算、岩鞋傷害、奧運格式）都只留一句加連結，沒有重講，符合 6.8 的主題歸屬規則。台灣讀者位置：全球史文章，結尾「這些東西傳到台灣時」一節加練習題 4 接到台灣篇，計畫要求的 0→1 銜接有做到。

## post-polish（只標不改）

register-scan：長句 14 句，約佔 77 句的 18%，超過 15% 的處理線。但書 7／51 段（13%，綠）。引述 0。姓名當主詞 0。模板化轉折 0。英文術語 0。數字密度單段 ≥4 的有 8 段。

標記（建議怎麼改）：
- 第 55 行，86 字：「之後的兩次大轉變，1970 年代初北美的 clean climbing（…）和 1980 年代歐洲的運動攀登（…），本站在〈…〉整理過，這裡不重講。」建議斷成兩句：「之後還有兩次大轉變：1970 年代初北美的 clean climbing（…），以及 1980 年代歐洲的運動攀登（…）。這兩段本站在〈…〉整理過，這裡不重講。」
- 第 53 行，76 字：「紐倫堡的 Kurt Albert 1970 年代去薩克森爬過之後，回家開始在自己的岩場自由攀，1975 年起……」建議在「自由攀」後面斷句，從「1975 年起」另起一句。
- 第 67 行，69 字，YDS 那句：建議在「十進位」後面斷句：「YDS 原本設計成 5.0 到 5.9 的十進位。到 1960 年，已經有人爬超過 5.9，5.10 就這樣出現。」
- 第 77 行，66 字，Ratouis 那句：和 verify 第 2 條一起改，拿掉轉引那一層之後自然會變短。
- 第 49 行，62 字＋61 字，Preuss 兩句：第一句可以在「當保護」後面斷開，論戰另起一句。
- 數字密度：第 67 行（9 個）、第 109 行（9 個）最密。第 109 行可以把「第 129 次全會」這個細節搬到年表或拿掉，正文留 2016 年 8 月就夠；第 67 行的 1978／1985 已經在年表裡，正文可以只留 1978。年表本來就該放帳，不受這條限制。
- 第 41 行（5 個數字）：日期爭議那句已經很短，不用動。

沒有標的：第 31 行開場那句 60 字是場景列舉，拆開會損失節奏，保留。

## en-fidelity

腳本比對中英兩版正文裡的年份。扣掉兩個假差異（中文寫「1920 年代」、英文寫「1920s」的寫法不同，以及腳本把半形括號裡的字去掉造成的計數差），年份、人名、地名、數字逐段人工對過，全部一致：1864-03-06、1874、1886（6/28–7/4）、1887-09-14、1905、1911、1913、1923／1925／1926、1934、1935、1938、約 1940／1943、1947、1953、1956、1958-11-12、1960、1964、1967、1975、1978、1985、1989、1991、1998、2007-01-27／48、2016-08／第 129 次、2021、2024。章節數、表格、年表 35 列、練習題 4 題、參考資料 27 條都對得上。英文版參考資料有替德文來源標「(in German)」。站內連結全部指向 `-en` 版本，目標檔都存在。

問題：
- 🟡 練習題 4 的答案少了一句。中文版第 185 行最後一句「想知道粉和其他裝備什麼時候傳進台灣，可以接著讀[〈台灣攀岩史〉](/posts/climbing/2026-10-19-taiwan-climbing-history)。」，英文版第 185 行沒有。建議補上：「To find out when chalk and the rest of the gear reached Taiwan, read [Taiwan's Climbing History](/posts/climbing/2026-10-19-taiwan-climbing-history-en).」
- 🟢 英文版第 113 行寫「Ta-Chi Wang」，TOCC 英文原文寫「Ta Chi Wang」（沒有連字號）。建議照來源寫「Ta Chi Wang」。
- 前面 verify 第 1–4 條、post-review 的 glossary 用詞，英文版有一模一樣的問題，要同步改（行號見各條）。

## 修正紀錄（2026-10-19，作者端）

已修（中英同步）：verify 1–3（Maioni、Gill 自述的歸屬，Chevalier 補連結）；verify 4（拿掉路線串「用顏色標出」和岩館類比）；verify 5（拿掉「體育講師」）；post-review 必修的 inline 連結（Bridwell、L'Angle Allain、SportRoccia、IFSC 2007）；Welzenbach 1923／1926 附來源並標出來源層級，參考資料補兩筆；glossary「最早」改「最早一批」；polish：第 55、67 行斷句；en-fidelity：練習題 4 補上連到台灣篇那句。
未改：Ufer＋Frick、Napes Needle 第二來源、第 109 行數字密度、Ta-Chi Wang 連字號（台灣篇審稿說 TOCC 寫 Ta-Chi Wang，兩份審稿說法相反，維持原樣）。
