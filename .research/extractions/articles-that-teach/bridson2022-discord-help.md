# 抽取紀錄：Bridson、Atkinson、Fleming 2022，Delivering Round-the-Clock Help to Software Engineering Students Using Discord: An Experience Report（SIGCSE 2022，Proceedings of the 53rd ACM Technical Symposium on Computer Science Education V. 1，pp. 759–765，doi 10.1145/3478431.3499385）

- 作者全名對過首頁（PDF p.1）與 Crossref：Kathryn Bridson、Jeffrey Atkinson、Scott D. Fleming，皆 University of Memphis。前兩位是本課 TA，第三位是授課教師（文字檔 L280–284）。
- **版本**：ACM 刊出版 PDF（7 頁，首頁版權聲明是 ACM 一般版權「© 2022 Association for Computing Machinery」，不是 CC 授權）。
- 原文檔：`.research/raw/learning-content/q5/discord-sigcse2022.pdf`（1,562,291 位元組）；清單列的 `q5/discord-sigcse2022.txt`（58,490）是 `-layout` 轉的雙欄檔，**這次沒用它**，改以不帶 `-layout` 的 `pdftotext` 重轉到 scratch（`…/scratchpad/bridson.txt`，745 行、43,287 字元），下面行號都是這份重轉檔的行號。
- **取用合法性**：q5 筆記記錄這份是第二輪用瀏覽器從 ACM 下載（`.research/2026-10-13-learning-content-q5-social.md` L469）。這次 2026-10-14 再查：OpenAlex 與 Unpaywall 都標 closed、Crossref 授權欄只有 ACM 版權政策連結；ACM 文章頁用 curl、firecrawl、Exa、Jina 都被 Cloudflare 驗證頁擋住，**沒能親眼看到該頁的取用標示**，Playwright 瀏覽器被其他 session 占用也沒能開。另查 ACM 官方的開放取用說明頁 https://www.acm.org/publications/openaccess （經 Exa 讀取），原文：「As of January 2026, all ACM publications and related artifacts in the ACM Digital Library have been made open access.」據此判斷這份 PDF 是出版者在 ACM Digital Library 公開提供的刊出版。**不確定點**：沒有親見本篇頁面的 Open Access 標示；若要百分之百確認，需用瀏覽器開 https://dl.acm.org/doi/10.1145/3478431.3499385 看。
- 讀取日期：2026-10-14
- 供 order 21 使用（清單 F，21#10）

## 研究設計

- **類型**：經驗報告（experience report），單一課程、單一學期，描述性統計加幾個 t 檢定；不是實驗，沒有隨機分派。
- **場域**：University of Memphis 大學部軟體工程課，遠距上課（COVID-19 期間，L137–139），2021 年春季（Figure 3 標 S21）。約 14 週：前 7 週每週一份技能作業（主動讀範例並照做、低風險練習測驗、錄一段邊做邊講解的影片，L322–332），後 7 週 3–4 人小組替「客戶」（由另一位同學扮演）做 Rails 網頁應用（L332–357）。
- **受試者**（L358–362）：修課 52 人；女性 14 人（27%）；依 NSF 定義屬 CS 弱勢族裔 22 人（42%：西語裔 6、黑人 11、混血 5）。
- **介入**（L130–147、L296–318）：(1) 用 Discord 取代 Piazza 與實體辦公時間：技術求助文字頻道 #help-help-help、非技術問題頻道、三個「help room」（文字＋語音／視訊／分享螢幕），另有公告、回饋、閒聊頻道，講課廳、各組的組房、助教限定房；(2) **24 小時有人回**：多加兩位 TA，一位約 8:00–22:00、一位約 15:00–8:00，「often immediately and generally in no more than 10–15 minutes」（L290–292）；授課教師偶爾在平日上班時間回。Discord 上**不能匿名發文**（L255–256）。
- **比較對象**（L75–81、Figure 3）：同一門課先前三個學期（2018 秋 N = 52、2019 春 N = 27、2019 秋 N = 35），當時是實體上課、實體辦公時間加 Piazza 問答論壇。**是不同學期、不同學生、不同上課型態（實體 vs 遠距）、不同平台、不同助教人力的歷史對照**。
- **量了什麼**（L375–383）：學生發文數。Discord 用發文事件紀錄；Piazza 只拿得到平台給的彙總統計。**語音頻道使用沒有資料**。原文沒寫 Discord 的計數是否只限求助頻道（L391 寫的是「a total of 5105 messages in Discord」，看不出有沒有含 #general、組房等頻道）。另有學生回饋：Discord 回饋頻道（具名）與學校教學評鑑（匿名）。
- **沒有量學習成效**：全文沒有成績、測驗或任何學習結果的資料。

## 結果（逐項）

1. **發文量大增**（§4.4、Figure 3，p.4 已對 PDF）：每位學生平均發文數 2021 春 Discord M = 98.2（SD 150.3，N = 52）；Piazza 2019 秋 M = 1.5（SD 3.1，N = 35）、2019 春 M = 2.0（SD 5.7，N = 27）、2018 秋 M = 1.0（SD 1.8，N = 52）。原文：「the difference between the 24/7-Discord group and each of the Not-24/7–Piazza groups was statistically significant, with a t-test reporting p < 0.0001 for each comparison」（L366–368）。
2. **至少發過一則的學生比例**（L368–373）：Discord 47/52（90%）；Piazza 2019 秋 13/35（37%）、2019 春 11/27（41%）、2018 秋 20/52（38%）。
3. **分布很偏**（§4.3、Figure 2，p.4 已對 PDF）：學生共發 5,105 則；前三分之一每人 103–674 則、中間 21–78 則、後三分之一 ≤ 19 則；最高四人 489、521、534、674 則被視為離群值。Figure 2 標中位數 37、平均 98。三位教師共發 2,890 則（兩位 TA 1,466、1,233，教師 191）。
4. **弱勢族群沒有較少發文**（§4.5、Figure 4，p.5 已對 PDF）：URM M = 75.7（SD 89.6）、非 URM M = 114.6（SD 182.3）；女性 M = 65.2（SD 77.9）、男性 M = 110.3（SD 168.6）。原文：「no statistical difference was detected between any underrepresented group and the rest of the class (for each t-test, p ≥ 0.2)」（L412–414）。注意：平均數相差不小（URM 約為非 URM 的三分之二、女性約為男性的六成），「沒差」是 p ≥ 0.2 的無顯著結果，在 SD 很大、人數小的情況下檢定力有限（這是我的觀察，原文沒討論檢定力）。作者自己提的保留：Discord 不能匿名，若女性在可匿名時發文較多（引 Thinnyun 等 2021），女性的使用量可能被壓低（L493–512）。
5. **一天之中的時段**（§4.6.1、Figure 5）：19:00–24:00 占 47%；0:00–5:00 占 18%；早上 5:00–12:00 只占 8%；合計 19:00–5:00 占 65%（L601–602）。作者指出與 Zavgorodniaia 等 2021「只有 1% 活動在午夜到清晨五點」相矛盾，原因未知（L603–607）。
6. **一週之中**（§4.6.2、Figure 6，p.5 已對 PDF）：週二、三、四合占逾 70%；週六日只占 11%。作者推測與截止日多在這三天有關，教師的印象也是截止前求助增加（L608–616，屬軼事觀察）。
7. **學期前半多、後半少**（§4.6.3、Figure 7，p.5 已對 PDF）：前半 M = 61.4（SD 83.5），後半 M = 36.7（SD 89.9），配對 t 檢定 p = 0.04。總數前半 3,195、後半 1,910，差 1,285 則。67% 的學生後半發得較少、23% 較多、10% 一樣。原文寫「the number of messages students posted during the first half of course (3195) was 40% greater than the number they posted during the second half (1910)」（L462–464）——**算術不對**：3,195 比 1,910 多約 67%；40% 是後半比前半少的比例（1,285 ÷ 3,195）。作者對後半變少的解釋都是推測：開放式問題較常改用語音（沒資料）、學習效果、改問組員、截止日較少（L516–531）。
8. **學生回饋**（§5.1.3）：引述多則正面留言（例：「I can literally reach them anytime of the day and any day of the week.」）；學校教學評鑑題「I had an opportunity to ask questions in or outside of class」M = 4.89／5（N = 36）（L559–562）。沒有前幾學期的同題數字可比。
9. **作者的詮釋**（L483–486）：引兩篇研究說求助論壇參與與課業成績正相關，「we found this level of engagement to be very encouraging」——本篇自己沒有成績資料。

## 作者自己列的限制

- 人力成本高：需要的 TA 時數遠超過一位 TA 每週 20 小時（L579–582）；建議只在尖峰時段開放，或跨課共用 TA（L582–587）。
- 無法分開 Discord 本身與 24 小時有人回的影響（L587–588）。
- 沒有語音／視訊頻道使用資料（L381–382、L525–526、L589）。
- 只有一門課，能否推廣未知（L590–591：「after all, this was an experience report regarding a single course」）。
- Discord 不能匿名可能壓低女性發文（L493–512）。

原文**沒有**列為限制、但會影響比較的：對照學期是實體上課、Discord 學期是遠距（疫情）；Piazza 與 Discord 的「訊息」單位不同（Piazza 是正式問答貼文，Discord 是聊天訊息，作者在 L239–244 自己描述兩者設計上的差異，但沒把它當成計數不可比的問題）；作者本人就是提供協助的 TA 與教師。

## 與摘要說法不一致的地方

- 摘要說「our 24/7-Discord approach led to a considerable increase in the amount of student–teacher interaction」：資料量的是**學生發文數**，不是師生互動數；且沒有區分發文是否在求助頻道、是否得到教師回應。「led to」的因果措辭比歷史對照能支撐的強。
- 摘要說「students from underrepresented groups in computer science interacted with teachers at a rate comparable to other students」：依據是 p ≥ 0.2 的無顯著差異，平均數其實差距不小（結果 4）。
- 摘要說「students posted significantly more messages during the first half」：與正文一致（p = 0.04），但正文的「40% greater」算錯（結果 7）。
- 其餘（時段、截止前、週末）與正文一致。

## 與清單「要撐的結論」不合的地方

清單原句：「求助管道換成 Discord 後互動量增加；沒有量學習成效」。

- 「沒有量學習成效」：撐得住，全文沒有任何學習結果。
- 「互動量增加」：要改寫。正確的說法是「和實體上課、用 Piazza 的前三個學期相比，遠距學期改用 Discord 並安排 24 小時有 TA 回覆後，學生的平均發文數從每人 1–2 則變成 98 則（中位數 37），至少發過一則的學生從約四成變成九成」。這是歷史對照，同時變的有平台、24 小時人力、遠距上課、計數單位，**不能歸因給「換成 Discord」**；作者自己也說無法分開 Discord 與 24 小時有人回的影響。
- 量的是學生發文，不是師生互動，也沒有教師回應率或回應時間的實測資料（「10–15 分鐘」是作者自述的做法）。

## 讀取紀錄

- 重轉檔 `bridson.txt`：L1–745 一次讀完（全檔，含參考文獻掃過）。重轉後雙欄段落仍有部分順序錯置（例如 §4.4 與 §4.5 的段落交錯、§5.2 排在結論之後），已依 PDF 版面核對過段落歸屬。
- PDF 版面對照：p.4（Figure 2、Figure 3 與其圖說、§4.1–4.6.2）、p.5（Figure 4–7 與圖說、§4.6.3、§5.1）。所有引用的數字都在這兩頁對過。p.1–3、p.6–7 只讀重轉文字。
