# 審稿紀錄：2026-10-19-route-setter-career（中英共用）

日期：2026-10-19。審稿人：rev-b（獨立審稿，非作者）。工具：Groundlane MCP `web_fetch`／`web_search` 本次可用（先前回報的 401 未重現）。The Climbing Doctor 頁面用 Groundlane 抽不到正文，改用 Jina `read_url`；Rock City、Petra Cliffs、Teton、ABC、World Climbing、E4、CWA dashboard、Sewell 專訪、CLIMBERS 也用 Jina。山協三份 PDF、USA Climbing、CWA PRS PDF 以 `curl` 下載後用 `pdftotext` 全文比對；USA Climbing 研習頁用 `curl` 抓 HTML 後 grep。使用者決策照辦：台灣定線員薪資與山協 A／B 級規則寫「沒有公開資料」，美國數字只當對照。擷取存於 scratchpad `M/rev-b/dl/`。

## post-verify

🟢 Confirmed（打開原文逐條比對）
- 山協 114 年度 C 級定線員講習簡章（PDF）：2025-10-19–20、原岩中和、2 天；18 歲、高中職、會員、RP 5.12a 暨抱石 V5、初級定線員證書、CBT、C 級裁判筆試 60 分（缺的話一年內補）；7,000 元、上限 20 人；核發「C 級運動攀登定線證書」；課表六項與正文一致；依「運動攀登定線員制度實施辦法」辦理。注意：簡章「目的」欄誤寫成「初級定線員講習」，屬於來源筆誤，正文不受影響。
- 山協 110 年度（2021）簡章：4 天、RP 5.12b、V4、不要求初級證書。
- 山協運動攀登部簡則（2018）：運動攀登部負責制定定線員審核辦法與辦理講習。
- 臺北市體育局 K=286（2026-02-11）第(十)款：攀登教練、裁判、定線員 C 級或丙級以上、4 年內。
- CLIMBERS（2020-03 刊物）：「公認資格なし＝商業ジムなどでセットが可能」。
- 500輯 2021-11-12：劉翰杰（Marco）是自由教練與定線員，團隊固定在桃園爬森攀岩館定線（引述措辭見修正 6）。
- Rock City：主要抱石牆每 1–2 週刷、每月洗；先乾刷、檸檬酸、徹底沖淨、完全晾乾；濕的岩點上牆會讓 T 型螺帽加速鏽蝕。
- Petra Cliffs：路線保留 2–3 個月、一次換一面；難度只求館內一致；Slab of the Week 每週換、Comp of the Week 每兩週換。
- E4：每個顏色約 60 條、每週有新題目。
- Teton Rock Gym：區間分級（例如 V2–4）、看起步標籤顏色、區間刻意重疊、岩點顏色可以混用、源自楓丹白露、減少追難度的壓力。
- Lajoie（The Climbing Doctor）：每週 2.5 天、每天 7.3 小時、近 40% 時間在試爬；78.5% 曾在工作中受傷；61% 外傷；71% 慢性問題（下背、肩、肘、腕）；衝擊工具震動是風險因子（作者與年份見修正 2）。
- USA Climbing 研習頁：L1 500 美元、L2 1,000 美元；最低 16 歲；L1 要求「can work V4 and 5.12」；明寫「not intended for setters looking to increase their commercial routesetting experience」。
- USA Climbing Path of a Routesetter（2025-09）：L1 試爬門檻 V5；L5 可被提名 IFSC。兩份文件的衝突確實存在，正文並列處理正確。
- CWA PRS Standards（2024-04）：Intro → L1（18 歲、V2）→ L2 Boulder（建議 150 小時）／Ropes → L3（600 小時）→ Provider（21 歲、2,000 小時）；三年到期。CWA dashboard 寫 L2 Boulder 建議 200 小時，跟 PDF 衝突，正文並列正確。
- World Climbing dev-officials：2023-10 宣布修訂，Levels 1–4（提名機制見修正 8）。
- On the Labor Front 轉述 NLRB Region 32 決定（2026-02-17）：定線員約 28 美元、櫃台 22 美元（教練一項見修正 9）。
- Vertige Media（2026-09-01）轉述 CBJ 2026-08-27 儀表板：助理定線員滿意度 3.47／5，在非管理職裡最低。
- 104 職場力 2026-01：運動攀岩教練的職務內容包含「館內定線」，只列教練月薪；沒有定線員薪資 ✅（台灣薪資「沒有公開資料」的寫法符合使用者決策）。

🔴／🟠 需修正
1. 🔴 tldr「美國一份問卷顯示定線員約 40% 的工時花在試爬」（L9）：作者 Evelyne Lajoie 是加拿大蒙特婁的物理治療師，頁面沒寫受訪者是美國人；樣本是 162 位定線員的網路問卷。「美國」與原文矛盾。來源：https://theclimbingdoctor.com/work-injuries-amongst-routesetters-and-occupational-hazards/
2. 🟠 參考資料把 Lajoie 頁標成「2024」（L205），頁面發佈時間是 2025-08-07。正文 L62 也沒寫樣本數與作者所在地。
3. 🔵 L141「方向很一致：定線員比一般攀岩者更容易累積慢性傷害」：原文只比較了下背（「higher injury rates in the lower back compared to climbers, with 25% reporting lower back issues」），沒有說整體慢性傷害比一般攀岩者多。數字對，推論放大了。
4. 🟡 L87「目前公開的講習有兩級：初級定線員，以及 C 級定線員」：本次只找到 C 級簡章（2021、2025）；初級定線員只以「報名資格：取得初級定線員證書」的形式出現，沒有找到初級講習的公開簡章。練習題 2（L179）「報名山協的初級定線員講習」也依賴這個前提。
5. 🟡 L102「所以在台北的民營岩館，定線員至少要有 C 級，在行政檢查上才過得了關」：公告是一條「確認…是否取得」的查核項目，沒寫不符合會怎樣。「才過得了關」是推論。
6. 🟠 L108 直接引語「安全又帶冒險感」：原文是「如何設計安全又帶有冒險感的路線」，少了「有」字。引號內的字必須逐字照抄。專訪是 2021 年的，正文沒標年份。來源：https://500times.udn.com/wtimes/story/12671/5886300
7. 🟠 L108「一位老岩友在 2021 年的座談整理裡則認為」：原文的發言者是高雄 boulder space 岩館老闆「coach 魏」，原話是「目前台灣的岩館定線市場還不夠大，仍無法跟日本一樣養活專職的定線員」。「老岩友」寫錯了身分。來源：http://kateberrysblog.blogspot.com/2021/02/rock-climb-generation-6.html
8. 🟠 L123 表格「2023 年改制，由各國協會提名」與 L129「World Climbing 的定線員由各國協會提名」：World Climbing 頁面沒有提到提名，提名機制出自 IFSC 定線員 Ryan Sewell 的專訪（新制建立時各國協會在 L1–L3 各提名 2 人，L4 不開放提名）。連結換錯了，「各國協會提名」的說法要改連 Sewell 專訪。來源：https://epsets.substack.com/p/an-interview-with-ifsc-routesetter；台灣的會員協會確認是山協：https://www.worldclimbing.com/national-federations/nf-tpe/tpe-info
9. 🟠 L149「教練約 20 美元」：原文是「instructors $20」，指的是指導員。競賽教練（competitive coaches）在原文裡另外列，沒有時薪。原文還有 safety staff 19 美元。
10. 🟠 L151「Touchstone 南加州的定線員發動了美國第一次定線員罷工」：來源是 CBJ 的 press release，頁尾註明「written by the sponsor」，也就是工會自己的新聞稿。「美國第一次」是工會的說法，性質是不當勞動行為（ULP）罷工。
11. 🟡 L122 ABC「2025 年起」：2025-10-09 的公告寫「To mark the first year of the new Route Setting Development Pathways」，也就是新路徑在公告時已經運作滿一年，「2025 年起」不準確。來源：https://abcwalls.co.uk/2025/10/09

🟡 Unverifiable（保留）
- L110「常見的入行方式是先在岩館當教練或櫃台…」：沒有台灣來源，屬於一般描述。建議加上「常見」的依據，或改成「一種常見的入行方式」（不強制）。
- L33「他們通常在岩館關門或某一區封起來的時候工作」：Petra／原岩守則都提到「因定線暫停開放部分區域」，「關門時」沒有來源，屬於低風險描述。

本次只檢查文中已提出的約 45 條宣告，未評估文章對主題的覆蓋是否完整。

## post-review

- 機械檢查：`check:tw` 0／0；`check:process-leak` 通過；`check:links` 38 條外部連結無壞鏈；`check:post-quality` 與 `check:references` 報 ERROR：L29 英文版連結 `-en` 不存在（見待修 1）。WARN：tag `bouldering`、`taiwan` 沒有明顯對應詞。這是誤報，正文有「V3 抱石」與大量台灣段落，可以忽略。
- 內部連結：climbing-coach-certification、resting-route-reading、climbing-gym-safety-waivers 都存在。L83 的〈休息、讀線與自己定線〉只有書名號、沒有連結，同一篇在 L79 已經連過，可以接受。
- 範圍卡（order 3）對照：定線流程與換線週期 ✅；山協 C 級講習（範圍卡寫 RP 5.12b／V4／4 天／6,000，正文改用 2025 年版 5.12a／V5／2 天／7,000，2021 年版並列為「門檻會變」，比範圍卡新）✅；臺北市 C 級以上、4 年內 ✅；A／B 級「沒有公開資料」✅；USA Climbing L1–L5 衝突並列 ✅；CWA 150 vs 200 並列 ✅；ABC ✅；World Climbing Level 1–4 與國家協會提名 ✅（來源見修正 8）；Touchstone 28 美元、CBJ 滿意度、78.5%、工會與 2025-03-24 罷工 ✅；台灣薪資「沒有公開資料」、美國數字只當對照 ✅（練習題 4 特別示範不能推估，很好）。例子「一條 V3 抱石從空牆到開放」✅。自我檢查兩題 ✅。
- 範圍卡項目「78.5% 曾受傷」寫在 tldr，但 tldr 把來源寫成「美國」問卷，見待修 2。
- 流程圖：mermaid 的 C 節點「分類」不在範圍卡的六步裡，正文的五步清單也沒提到分類，跟圖不一致（🟢 可選）。另外圖與清單都沒有「修線」這一步，雖然 tldr 有寫；圖裡的「E→D 回頭」代表修線，可以接受。
- 台灣讀者位置：開頭從讀者卡過的那一步切入，台灣制度放在國外之前 ✅。

## post-polish

- `register-scan`：長句 7 句（約 8%，綠）；但書 7%；引述 0；姓名主詞 0；模板化轉折 0；phrase ledger 0 命中。
- 數字密度：3 段 ≥4 個，都是規格或並列衝突，屬於讀者要用的帳，保留。L128「官方文件之間也會打架」那條有 8 個數字，可以拆成 USA Climbing 與 CWA 兩條（🟢 可選，見待修 14）。
- 可執行動作：三個「今晚就能做的事」都具體 ✅。英文版同步時，待修 2–12 也要一起改。

## 待修清單

1. 🔴【連結】L29 `> 🌏 [English version](/posts/climbing/2026-10-19-route-setter-career-en)` 指向不存在的文章。做法：英文版發佈前補上 `-en` 檔；若本批不出英文版，就刪除這一行。
2. 🔴【tldr 事實】L9 把
   「美國一份問卷顯示定線員約 40% 的工時花在試爬」
   改成
   「一份 162 位定線員的網路問卷顯示，約 40% 的工時花在試爬」
3. 🟠【作者與樣本】L62 把
   「物理治療師 Evelyne Lajoie 的[定線員問卷](…)裡，」
   改成
   「加拿大蒙特婁的物理治療師 Evelyne Lajoie 做了一份 162 位定線員的[網路問卷](…)，結果是：」
   句子後半維持不變。
4. 🟠【年份】L205 把「（The Climbing Doctor，2024）」改成「（The Climbing Doctor，2025）」。
5. 🔵【推論放大】L141 把
   「這份資料是問卷，不是大型流行病學研究，但方向很一致：定線員比一般攀岩者更容易累積慢性傷害。」
   改成
   「這份資料是問卷，不是大型流行病學研究。跟一般攀岩者比，它只特別指出下背：25% 的定線員回報下背問題。」
6. 🟠【引語逐字】L108 把
   「定線員劉翰杰接受[專訪](…)時的身分是自由教練兼定線員，…他追求的路線是「安全又帶冒險感」。」
   改成
   「定線員劉翰杰在 2021 年接受[專訪](…)時的身分是自由教練兼定線員，…他追求的是「安全又帶有冒險感的路線」。」
7. 🟠【發言者】L108 把
   「一位老岩友在 2021 年的[座談整理](…)裡則認為，台灣的定線市場當時還養不起專職定線員。」
   改成
   「高雄 boulder space 岩館的老闆 coach 魏，在 2021 年的[座談整理](…)裡則說，台灣的岩館定線市場「仍無法跟日本一樣養活專職的定線員」。」
8. 🟠【來源換對】L123 表格 World Climbing 列的「2023 年改制，由各國協會提名」改成「2023 年宣布改制；新制建立時由各國協會提名（[Sewell 專訪](https://epsets.substack.com/p/an-interview-with-ifsc-routesetter)）」。L129 把「因為 World Climbing 的定線員由各國協會提名」改成「因為 World Climbing 新制的定線員由各國協會提名，台灣的會員協會是山協」。參考資料加：`- [An Interview with IFSC Routesetter Ryan Sewell（Elevated Perspective，2025）](https://epsets.substack.com/p/an-interview-with-ifsc-routesetter)`。
9. 🟠【職稱】L149 把「同一份文件裡櫃台約 22 美元、教練約 20 美元。」改成「同一份文件裡櫃台約 22 美元、指導員（instructors）約 20 美元。」
10. 🟠【歸屬】L151 把
   「美國定線員開始組工會，2025 年 3 月 24 日 Touchstone 南加州的定線員發動了美國第一次[定線員罷工](…)。」
   改成
   「美國岩館員工開始組工會。2025 年 3 月 24 日，Touchstone 南加州的定線員發動不當勞動行為罷工，工會在[新聞稿](…)裡稱這是全美第一次定線員罷工。」
11. 🟡【門檻來源】L87 把
   「目前公開的講習有兩級：初級定線員，以及 C 級定線員。」
   改成
   「公開簡章看得到的是 C 級定線員講習；2025 年起，報名 C 級要先有「初級定線員證書」，但初級講習的公開簡章本次沒有找到。」
   練習題 2 答案 L179 把「報名山協的初級定線員講習，再報 C 級」改成「先取得山協的初級定線員證書（向山協運動攀登部詢問最近的梯次），再報 C 級」。
12. 🟡【強度】L102 把「所以在台北的民營岩館，定線員至少要有 C 級，在行政檢查上才過得了關。」改成「所以在台北的民營岩館，定線員有沒有 C 級以上證照，是市府檢查時會確認的項目。」
13. 🟡【時間】L122 ABC 列的「2025 年起：」改成「新路徑（2025-10 公告時已滿一年）：」。
14. 🟢【可選】L128 拆成兩條：「- USA Climbing 的 [2025 年晉升路徑 PDF](…) 寫 L1 的試爬門檻是 V5，研習頁寫的是「V4 和 5.12」。」與「- CWA 的 L2 抱石建議時數，標準 PDF 寫 150 小時、認證頁寫 200 小時。報名前以最新文件為準。」流程圖 C 節點「分類」若要保留，就在步驟清單 2 與 3 之間補一句「依顏色、大小裝箱」，或從圖裡刪掉。

## 修正紀錄

- 待修 1：保留英文版連結，英文版同批提交。
- 待修 2–14：全部照建議文字改入 zh-TW 原文（tldr 問卷樣本、Lajoie 身分與 162 人、年份 2025、受傷推論收斂為下背 25%、劉翰杰引語與年份、coach 魏原話、World Climbing 改制與 Sewell 專訪來源、instructors 職稱、罷工歸屬工會新聞稿、初級定線員證書與練習題 2、台北檢查措辭、ABC 時間、文件衝突拆兩條；流程圖「分類」保留並在步驟 2 補一句）。英文版以修正後的中文翻譯。
