# Review: 2026-10-19-ice-mixed-climbing（zh + en）

Review date: 2026-10-19. Scope: 其他攀登類型系列 order 3，中文為主、英文版逐段比對數字與歸屬（兩版數字逐一 diff 一致，下列問題 en 版同位置都有）。獨立審稿，未改文。
工具：Groundlane MCP `web_fetch`（Alpinist、Climbing.com、Wikipedia、Terragalleria、go4mosa、赤岳鉱泉、UIAA ×2 成功；goforwild、OUTSiDERS 回 upstream closed）→ Groundlane HTTP（空回應）→ OUTSiDERS 走 r.jina.ai、goforwild 用 curl 直抓（jina 429）、Ouray 研究用 NCBI E-utilities 抓摘要（PubMed 頁回 203 空殼）。原始擷取存於 session scratchpad `H-review-ice/dl/`。

## 待修清單（給改稿者）

| 嚴重度 | 位置 | 原句 | 建議改為 |
|---|---|---|---|
| must-fix | L163 練習題 2 答案（en L161 同） | 「WI3 是持續約 70 度的冰，可能有短的陡段，但有休息點和好站的地方放冰螺栓。」 | 「WI3 是持續約 70 度的冰，可能有 80–90 度的長隆起，但有休息點和好站的地方放冰螺栓。」Alpinist 原文是 "possible long bulges of 80-90 degrees"，正文 L82 也寫「長隆起」，答案跟正文和來源都打架。en：「WI3 is sustained ice around 70 degrees, possibly with long 80–90-degree bulges, but with rests and good stances for placing screws.」 |
| should-fix | tldr、L106（en tldr、L104） | tldr「ANAC 的冰攀事故首要因素是保護不足或冰螺栓拔出」；L106「Climbing.com 分析 30 年 ANAC 事故報告的文章，把冰攀事故的首要類別列為…」 | tldr：「一份分析 30 年北美事故報告的研究發現，冰攀事故最常見的因素是保護不足或冰螺栓拔出。」L106：「Eliot Caroom 在 Climbing.com（原刊 *Rock and Ice* 2020）分析了 ANAC 30 年來公開的 2,770 篇事故報告，把冰攀事故最常見的因素標為**保護不足或保護點被拔出**。」ANAC 本身不按攀登類型統計，冰攀分類是作者自己的 NLP 標記，作者也說不是 AAC 的專案，結果「要打折看」。en tldr：「An analysis of 30 years of North American accident reports found the top factor in ice climbing accidents was inadequate protection or screws pulling out.」 |
| should-fix | tldr、L139（en tldr、L137） | 「日本八岳赤岳鉱泉的初學者體驗一次 3,000 日圓」；「2026 年的場次在 1–3 月。」 | 發文日 2026-10-19 時 2026 那季已經結束。tldr 改「日本八岳赤岳鉱泉 2026 年那季的初學者體驗一次 3,000 日圓」。L139 末句改：「2026 年那季的場次是 1 月 18 日到 3 月 15 日的五個週日或假日，預約從 2025 年 12 月 10 日中午開放，只收電話預約，不收 email 或私訊；下一季的公告請看山屋官網。」（也可補：以前參加過這個體驗會的人不能再報。）en：「The 2026 season ran five Sundays/holidays from January 18 to March 15; booking opened at noon on 10 December 2025, by phone only. Check the hut's site for next season's notice.」 |
| should-fix | L68、L135（en L66、L133） | L68「而且沒有的人可以在當地租」；L135「山野悠遊的韓國冰攀團已經辦了五年」 | L68 改「沒有的人可以向業者租」：課程頁的租借連到業者在台灣的租借頁，費用也明列不含冰斧、冰爪、頭盔、吊帶，頁面上沒有寫在韓國當地租。L135 改「山野悠遊的韓國冰攀課程頁寫行程是…」，刪掉「已經辦了五年」：頁面沒有標年份，梯次欄是空的，價格欄寫 99999 元（像占位值），主教練介紹寫的是 2005、2006 年獲獎，「進入 5 個年頭」不知道是從哪一年起算的。en：「can be rented from the operator」；「Goforwild's course page describes a trip of…」 |
| should-fix | 「風險在哪」節（L104–115） | 只列了冰螺栓拔出、落冰與利器、冰況每天變 | 同一篇 Climbing.com 分析寫，冰攀事故有 13% 標了雪崩，比高山攀登的 10% 還高。依規劃表使用者決定 4，雪崩課要連到 IFMGA 文，不在這篇重寫。建議在清單加第三點：「**雪崩。** 同一份分析裡，13% 的冰攀事故跟雪崩有關，比高山攀登的 10% 還高；冰瀑常在雪坡下方或溝槽裡。雪崩課怎麼上，見〈[從台灣走向 IFMGA](/posts/climbing/2026-10-17-ifmga-taiwan-path#4-上雪崩課)〉。」（錨點請 build 後確認；en 錨點應為 `#4-take-avalanche-courses`）。en：「**Avalanches.** In the same analysis, 13% of ice climbing accidents involved avalanches, more than the 10% for alpine climbing…」 |
| should-fix | L47、入門路徑第 1 步（L121） | 「岩石上放岩楔或機械塞」；「在岩館練好頂繩確保、垂降和基本繩結」 | 範圍卡要求連到運攀傳攀系列〈傳攀保護〉，目前全文沒有任何運攀傳攀系列的站內連結。L47 改「岩石上放[岩楔或機械塞](/posts/climbing/2026-10-17-trad-protection-nuts-cams)」；第 1 步可加「（[岩館頂繩確保](/posts/climbing/2026-10-17-gym-top-rope-belay)、[下放還是垂降](/posts/climbing/2026-10-17-lower-or-rappel)）」。en 對應 `-en` slug。 |
| should-fix | 「風險在哪」節末或「入門路徑」第 2 步（L122） | 「人工冰壁或短冰瀑最適合反覆練。」 | 範圍卡列了 Ouray 研究，正文沒有寫。建議補一句，也替「人工冰壁」那句提供根據：「美國 Ouray 冰攀節的一份調查，75 位參加者在人工冰壁上爬了 912 小時，回報 16 件傷害，全部是輕傷，約每 1,000 小時 17.6 件（[Ganti et al. 2021](https://pubmed.ncbi.nlm.nih.gov/33972162/)）。樣本小，而且是在有人管理的人工冰壁上，不能套到天然冰瀑。」參考資料同步加一條。en 同步。 |
| should-fix | L131（en L129）、練習題 1 答案 L155 | 「台灣能練的是乾攀。」；「台灣岩館的乾攀路線用特製岩點和工具」 | go4mosa 文末註 2 自己更正：乾攀的定義是冰斧冰爪並用，高雄岩館那種穿攀岩鞋的練法是「衍生的類冰攀練習形式」。本文 glossary 的乾攀定義也包含冰爪。L131 改「台灣能練的是類似乾攀的冰斧練習。」，L131 末句改「這不是冰攀，嚴格說也不算乾攀（乾攀要穿冰爪），但可以先熟悉冰斧的握法和發力。」練習題 1 答案改「台灣岩館的冰斧練習路線用特製岩點和工具，腳穿攀岩鞋…」。en：「What you can practise in Taiwan is an ice-tool variant of dry tooling… strictly speaking it isn't dry tooling either, since real dry tooling uses crampons.」 |
| nit | L39、L115（en L37、L113） | 「他在 go4mosa 的訪談裡說，那之後攀岩、雪訓、爬山，全都是為了冰攀」；「林益帆說，天氣、濕度、日照都會影響冰的狀態…許多冰瀑一年不如一年」 | 這兩段在原文都是採訪者的敘述，不是林益帆的直接引語（他本人的話是「冰的狀態不但多元而且多變」）。改「go4mosa 的訪談寫，他攀岩、雪訓、爬山，都是為了冰攀」；L115 改「go4mosa 那篇寫，天氣、濕度、日照都會影響冰況…」。en 把 "he says" 改 "the go4mosa profile says"。 |
| nit | L114（en L112） | 「go4mosa 那篇訪談提到…墜落時也要小心自己的工具。上面的人敲下來的冰塊會往下掉，頭盔一定要戴。」 | 落冰、頭盔那句 go4mosa 沒有寫，目前讀起來像是同一個來源。把那句拆開，改成本站自己的說法，或改掛 Wikipedia（冰攀條目在裝備節列了頭盔）。 |
| nit | L110（en L108） | 「這跟運攀把墜落當成練習的一部分很不一樣」 | 補來源：Wikipedia 冰攀條目寫 "the leader must not fall" 是冰攀的核心觀念，也舉例說中級冰攀者可以頂繩爬 WI4，先鋒 WI4 卻是「far more serious」。可改「維基百科說，『先鋒不能墜落』是冰攀的核心觀念，這跟運攀把墜落當練習很不一樣。」 |
| nit | glossary「WI 級」 | `aliases: ["WI", "water ice grade", "AI"]` | AI 是另一套等級（高山冰），放在 WI 的別名裡會讓詞彙提示把 AI 也顯示成 WI。建議拿掉 AI，或把詞條改成「WI／AI 級」。 |
| nit | L64、L163 | 「讓冰爪固定、腳不會累垮」；「第一次去，頂繩爬 WI3 已經很有挑戰性」 | 這兩句沒有來源。前者可改「讓冰爪固定，前齒踢冰時鞋底不會彎」；後者可以留，改成本站的判斷語氣（「多數人第一次…」），或刪掉。 |
| nit | L187 參考資料 | goforwild 連結 | `pnpm check:links` 判壞（Node 報 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`），curl 加瀏覽器 UA 可以正常抓，是站方 TLS 憑證鏈不完整，不是 404。不用改連結，但這條會一直被 check:links 報紅，先知會。 |

## post-verify

| 原句（行） | Verdict | 說明 | 來源 |
|---|---|---|---|
| 林益帆 2011 班夫影展看到雙橋溝「翅膀」WI4+；2018 初次、2025-01 第二次並完攀（L39） | 🟢 Confirmed | 「全都是為了冰攀」是採訪者敘述，見 nit | go4mosa |
| 冰攀定義：完全由結凍的水構成的路線、兩支冰斧或技術冰斧、硬式冰爪；原為高山攀登的一部分，1970 年代獨立（L45） | 🟢 Confirmed | | Wikipedia Ice climbing |
| 確保／先鋒觀念同攀岩、冰螺栓是中空有螺紋的金屬管（L47、glossary） | 🟢 Confirmed | Wikipedia：hollow threaded steel tube with cutting teeth | Wikipedia |
| WI＝季節性冰、AI＝終年高山冰，同數字 AI 可能較簡單（L53–54） | 🟢 Confirmed | | Alpinist／AAJ chart |
| 裝備表：技術冰斧兩支、冰爪（單或雙前齒）、硬底鞋或雙重靴、冰螺栓、頭盔（L60–66） | 🟢 Confirmed | Wikipedia：冰攀常用單前齒；山野悠遊清單列「冰攀用硬底鞋或雙重靴」。「腳不會累垮」沒有來源 | Wikipedia；goforwild |
| 韓國團裝備可在當地租（L68） | 🟡 Misframed | 頁面寫「裝備出租」，連到業者在台灣的租借頁；費用明列不含冰斧冰爪頭盔吊帶 | goforwild act_no=491（curl 直抓） |
| WI1–WI7 定義表（L80–86） | 🟢 Confirmed | 逐列對照原文，含 WI5／WI6 的「或」分支 | Alpinist |
| 分級各地差異大、仍在演變、只是平均描述；加拿大人常加羅馬數字承諾等級（L92） | 🟢 Confirmed | 原文 "highly variable by region and are still evolving"；加拿大冬季承諾等級 I–VI，VII 寫 "Under discussion"，綜合長度、危險、整體挑戰 | Alpinist |
| M1–3 簡單低角度通常不用冰斧、M6 垂直到外傾困難乾攀、M8 接近水平屋簷、到 M12（L96） | 🟢 Confirmed | | Alpinist |
| M 級對 YDS「There is no consensus」（L98） | 🟢 Confirmed | 原文是指整個混合攀登分級沒有共識，不只是對 YDS；寫法可接受。該 FAQ 主體寫於 1994 | Terragalleria |
| 乾攀來歷、1994 Jeff Lowe 在 Vail、D 級、UIAA 世界盃（L100） | 🟢 Confirmed | OUTSiDERS 原文逐句相符；Wikipedia 也寫 *Octopussy*（WI6 M8，1994）帶出現代混合攀登 | OUTSiDERS；Wikipedia |
| 不在已開發攀岩路線上乾攀；去爛岩、專門岩場、冬季混合路線（L102） | 🟢 Confirmed | | OUTSiDERS |
| 冰攀事故首要類別是保護不足／保護點拔出；拔出時 runout 最常見約 20%（L106、tldr） | 🔵 Misframed（數字對） | 數字和排序都對，但這是 Eliot Caroom 的獨立分析（不是 AAC 的專案），用的是 ANAC 公開事故報告（約占總數 56%）的 NLP 標記；ANAC 本身不按攀登類型統計。tldr 寫成「ANAC 的…首要因素」，等於把作者的分析算成 ANAC 的統計。同段還有 poor conditions 6%、雪崩 13% 兩個數字，本文沒有用 | Climbing.com（2022-02-14，原刊 *Rock and Ice* 265，2020-09） |
| Mount Rundle 報告：冰況差時看似好的冰螺栓可能只比體重多撐一點；放置頻率要把失效算進去（L108） | 🟢 Confirmed | 引文相符 | 同上 |
| 銳利物多、確保者站遠、墜落小心工具（L114） | 🟢 Confirmed | 落冰、頭盔那句不在 go4mosa 原文，見 nit | go4mosa |
| 天氣濕度日照影響冰況、完攀當天冰況差、暖化（L115） | 🟢 Confirmed（歸屬是採訪者） | | go4mosa |
| 頂繩最安全、是新手入門形式（L119） | 🟢 Confirmed | | Wikipedia |
| 韓國團報名條件與六種繩結（L121） | 🟢 Confirmed | 逐字相符 | goforwild |
| 台灣冰雪期不穩定、國家公園限制、不得其門而入（L129） | 🟢 Confirmed | | goforwild |
| 高雄岩館乾攀路線、特製岩點、穿攀岩鞋（L131） | 🟡 Confirmed（需補條件） | 原文註 2 更正：嚴格的乾攀要冰斧冰爪並用，岩館這種是「衍生的類冰攀練習形式」 | go4mosa |
| 室內特製乾攀工具、「綁在棍子上的攀岩鞋」（L131） | 🟢 Confirmed | | OUTSiDERS |
| 韓國團：辦了五年、首爾室內一天＋雪嶽山三天、韓國登山學校教練、緯度低海拔、起攀點近馬路（L135） | 🟡 行程 Confirmed／「五年」無法定年 | 行程（第 2 天室內、第 3–5 天雪嶽山）、Extreme Rider Climbing School、緯度與馬路都相符。「巳進入５個年頭」出自一個沒有日期的頁面，梯次欄空白、價格欄寫 99999、教練得獎年份是 2005–2006 | goforwild |
| 雙橋溝 2025 行程八天：一適應、二三攀登、四挑戰翅膀（L137） | 🟢 Confirmed | | go4mosa |
| 雙橋溝是含台灣在內亞洲攀登者冬季冰岩混合與乾攀訓練大本營（L137） | 🟢 Confirmed（single-source） | | OUTSiDERS |
| 赤岳鉱泉アイスキャンディ：員工確保、頂繩數趟、裝備可租、3,000 日圓含山岳保險、每場 5 人、前晚住山屋、18–70 歲、沒在別處爬過冰、自備可裝前齒冰爪的冬靴、2026 場次 1–3 月（L139、tldr） | 🟠 Outdated（內容 Confirmed） | 每一項都和公告相符（場次 1/18、2/15、2/23、3/8、3/15）。但發文時那季已經結束，文章用現在式寫。另外漏了兩個條件：參加過這個體驗會的人不能再報、只收電話預約 | akadakekousen.jp 公告 |
| IFMGA 請嚮導文整理霞慕尼、坎莫爾的行情與人數比（L141） | 🟢 Confirmed | 站內文第 92、101、141 行 | 〈ifmga-hire-a-guide〉 |
| UIAA 世界盃韓國青松站，2026 年 1 月 9–11 日（L145） | 🟢 Confirmed | UIAA 2025-11-05 公告；同週末辦亞洲錦標賽 | theuiaa.org event |
| 2026 年 6 月 UIAA 宣布 2030 法國阿爾卑斯冬奧籌委會不把冰攀放進新增項目提案（L145） | 🟢 Confirmed | 2026-06-03 發布；研究筆記寫「6 月 2 日消息」，以 UIAA 發布日為準，文章參考資料寫 2026-06-03 是對的 | theuiaa.org statement |
| 林益帆 2025-01 北京中國攀冰公開賽第八（L145） | 🟢 Confirmed | 第十屆，北京密雲雲蒙峽 | go4mosa |
| 練習題 1、3 答案（L155、L171） | 🟢 與正文一致 | 題 1 的「乾攀路線」用詞見 should-fix | — |
| 練習題 2 答案「可能有短的陡段」（L163） | 🔴 Contradicted | Alpinist：WI3 是 "possible **long** bulges of 80-90 degrees"；正文 L82 也寫長隆起 | Alpinist |
| en 版 | 🟢 數字一致 | 數字逐一 diff 無差異；上面所有問題在 en 對應行都有（en L161 也寫 "short steep sections"） | — |

### 未查證／未公開

- 赤岳鉱泉 2027 年那季（2026–27 冬）的公告還沒出，價格與場次未知；文章不該暗示 3,000 日圓是下一季的價格。
- 山野悠遊韓國課程現在還有沒有開：頁面沒有日期、梯次是空的。沒有打電話或寫信問業者（對外聯繫不在審稿範圍）。
- 1994 *Octopussy* 是「現代乾攀的分水嶺」：OUTSiDERS 與 Wikipedia（引 AAJ 2002 Slawinski）一致，Wikipedia 的說法是「現代混合攀登」；沒有另外查 AAJ 原文。
- go4mosa 提到的乾攀岩館（左營 Boulder Space 圓石空間）現在還有沒有這條路線：只有 2025 年的報導與 IG 連結，沒有查證現況。本文沒有點名岩館，影響小。
- Ouray 研究（建議補的那句）只讀了 PubMed 摘要，沒有讀全文。
- 本次只檢查了文中已提出的約 32 條宣告，未評估文章對主題的覆蓋是否完整（覆蓋見 post-review）。

## post-review

機械檢查：`pnpm verify` 唯一紅燈是本篇 zh／en 缺審稿紀錄（本檔即補上）；`pnpm check:tw` 0 blocking、0 to review；`scan-ledger.sh` 0 命中；`pnpm check:links` 10 條外部連結，1 條判壞（goforwild，TLS 憑證鏈問題，見 nit）。站內連結 4 條（overview、alpine-climbing、ifmga-hire-a-guide，zh／en）都存在。

frontmatter：必填齊全、type `guide`、series order 3、tags 4 個（`ice-climbing` 已有 6 篇在用，沒有分裂）；tldr 與 description 不重複。tldr 有兩處要跟著改：ANAC 歸屬、3,000 日圓的季別（見待修清單）。glossary 五條：AI 別名見 nit；乾攀定義（含冰爪）跟 L131 的用詞衝突，見 should-fix。

結構：開場人物 → 定義 → 水冰／高山冰 → 裝備 → 分級（WI 表折疊）→ M 級與乾攀 → 風險 → 入門路徑 → 在台灣 → 出國地點 → 比賽 → 練習題 → 下一步 → 參考資料，符合系列共用規格。

範圍卡逐項比對：水冰／高山冰 ✅、裝備 ✅、WI 與各地不一致 ✅、M 級與 1994 Jeff Lowe ✅、入門三步 ✅、冰螺栓拔出／落冰／冰況 ✅、**Ouray 17.6/1000 h ❌**、台灣乾攀 ✅、韓國／雙橋溝／八岳 ✅、UIAA 與 2030 ✅、**連結運攀傳攀〈傳攀保護〉❌**。使用者決定 4：請嚮導已連 IFMGA ✅；雪崩這篇不講可以接受（範圍卡把它劃給 order 4 與 IFMGA），但 ANAC 資料顯示雪崩在冰攀事故裡比高山還常見，至少需要一句話加轉手連結（should-fix）。日韓地點改用外部來源，符合決定 4 的註記（〈ifmga-pre-entry-prep〉不存在）。

主題歸屬：請嚮導段只有一句話加轉手連結，沒有重講 IFMGA 的價格，做法正確。

inline 來源：大多數數據都在原位有連結。缺的：L110 對運攀的對照、L114 落冰頭盔那句（見 nit）。

台灣讀者位置：開頭用高雄林益帆承接，「在台灣」「台灣人去哪裡爬冰」兩節給出限制與實際路徑，成立。

## post-polish

`register-scan.sh`：50 段；長句 5 句（L41 61 字、L100 103 字、L102 65 字、L108 87 字、L139 68 字），低於密度門檻；但書 6%；引述區塊 0；姓名主詞 0；模板化轉折 0；一般英文術語 0。數字密度偏高：L39（6）、L90（4）、L96（5）、L139（8）、L145（9）、L163（6）。

建議（未改）：
- L100 的 103 字長句：在「妥協做法」後斷句，1994 Jeff Lowe 那件事單獨成句，「今天乾攀有自己的 D 級和 UIAA 世界盃」另起一句。
- L108：把「冰上的保護有時很可疑」和「決定多久放一根…要把失效算進去」拆成兩句；後一句才是讀者要帶走的動作。
- L139：條件太多擠在一句。照 should-fix 改季別時，建議把條件拆成清單：誰可以報（前晚住山屋、18–70 歲、第一次爬冰、沒參加過這個體驗會）、要自己帶什麼（可裝前齒冰爪的冬靴）、怎麼報（只收電話、12 月開放）。正文只留價格與人數。
- L145：一段塞了世界盃、冬奧、林益帆三件事、9 個數字。建議林益帆比賽那句移回開頭段或「台灣人去哪裡爬冰」的雙橋溝段，比賽節只留 UIAA 兩件事。
- 可執行動作：L125「把六種結各打十次」是好的具體動作。入門路徑第 3 步「累積很多頂繩時數之後再開始」偏抽象，可補一句做得出來的事，例如「頂繩時，每趟到一半停下來，用一隻手在冰上旋進一根冰螺栓再旋出來，練到不用看」（不加具體時數，避免無來源）。

保護片段（數字、引號原文、URL）未動。

## 修正紀錄（2026-10-19）

zh 與 en 同步修改。未加更新紀錄段（未發佈草稿），slug／date 未動。

已修：
- must-fix 練習題 2：「短的陡段」改「80–90 度的長隆起」；同時刪掉無來源的「第一次去，頂繩爬 WI3 已經很有挑戰性」（nit）。
- should-fix ANAC 歸屬：tldr 與「風險在哪」首段改為 Eliot Caroom 的獨立分析（原刊 *Rock and Ice* 2020、2,770 篇公開報告、作者分類非 ANAC 官方統計、結果要打折看）；練習題 3 同步改成「前面那份事故分析裡」。
- should-fix 赤岳鉱泉季別：tldr 加「2026 年那季」；L139 末句改為 1/18–3/15 五個週日或假日、2025-12-10 中午開放、只收電話、參加過不能再報、下一季看官網。
- should-fix 山野悠遊：「在當地租」改「向業者租」；刪「已經辦了五年」，改「課程頁寫行程是」。
- should-fix 雪崩：風險清單加第三點（13% vs 高山 10%），連到〈ifmga-taiwan-path〉`#4-上雪崩課`／en `#4-take-avalanche-courses`（錨點依標題 `### 4. 上雪崩課`／`### 4. Take avalanche courses` 推得，未 build 確認）。
- should-fix 運攀傳攀連結：L47 連〈trad-protection-nuts-cams〉；入門第 1 步加〈gym-top-rope-belay〉、〈lower-or-rappel〉；en 用 -en slug。四個目標檔都已確認存在。
- should-fix Ouray：風險節末加一段（2019 Ouray 冰攀節、75 人、912 小時、16 件輕傷、17.6/1000 h、樣本小且不能套到天然冰瀑），參考資料加 Ganti et al. 2021。改稿者以 NCBI E-utilities 重新打開 PMID 33972162 摘要核對數字（仍只讀摘要）。
- should-fix 乾攀用詞：「台灣能練的是乾攀」改「類似乾攀的冰斧練習」，末句補「嚴格說也不算乾攀（乾攀要穿冰爪）」；練習題 1 改「冰斧練習路線…腳穿攀岩鞋」。
- nit L39／L115 歸屬：改為 go4mosa 訪談的敘述，不再寫成林益帆的話。
- nit L114 落冰頭盔：加「另外，」拆開，不再讀成 go4mosa 的說法（裝備表已列頭盔擋落冰）。
- nit L110：補維基百科「先鋒不能墜落」是冰攀核心觀念。
- nit glossary：WI 級別名拿掉 AI。
- nit L64：「腳不會累垮」改「讓冰爪固定在鞋上」。

未修：
- nit goforwild 連結被 check:links 判壞：站方 TLS 憑證鏈問題，連結本身正常，依審稿意見不改。
- post-polish 各項建議（L100／L108 長句、L139 條件拆清單、L145 林益帆比賽句移位、入門第 3 步補動作）：不在 must／should-fix 範圍，留待 post-polish。
