# Review: 2026-10-19-italy-crag-madonie（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-madonie.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-madonie.md`。系列〈義大利岩場〉order 1905。作者自審（同一個 agent 寫稿與審稿，非獨立審稿）。

工具降級（toolDegradation）：見研究筆記。主要靠 Exa web_fetch 讀頁、Groundlane web_search 找頁、curl 抓 Climbook、本地 tesseract OCR 掃描檔命令。

## post-verify

本 session 開啟的來源逐條對照（2026-10-19）。

- 🟢 UKC：Caltavuturo「the most suitable during the hot Sicilian summers」、全島最多山的地方、冬天內陸冷、租車建議。
- 🟢 theCrag Caltavuturo：208 條、193 次、4a–8a、Cabeci 51（19 m）、Gazzara 134（20 m）、Rocca di Sciaria 23（13 m）、635 m「the place to cool down」。theCrag Gazzara：134 條、A 42／B 47／C 45、618–721 m、左側 A、B 最多人、地衣、先到峽谷再過河。
- 🟢 AllClimb：三處運攀、攀岩節、Cabeci 上下區、SS120 上坡 15–20 分、東北、綠意、「nice to climb in the heat」、Gazzara 在「park Gazzara-Caltavuturo」、東北、十字架旁停車 10–15 分、下小徑過河、Rocca di Sciaria 在運動場後、「Simple routes on slabs」。
- 🟢 Climbook 區頁與 Gazzara、Cabeci、Rocca di Sciara 2 各頁：路線數、更新說明（2024-01 依 2022 版指南）、重複榜與路線清單逐列；Gazzara A 區從 #1 Karol、B 區從 #43 Dulcis in fundo 起算，表內 A／B 標註依此；Cabeci 上區 #1 起、下區 #10 Leonardo 起。
- 🟢 parks.it 公園景點頁：地質景點、東南面「è stata attrezzata una parete naturale d'arrampicata」。公園摺頁 PDF：A19 Tremonzelli 出口、經運動場、落差約 300 m、管理處 0921 684011、Caltavuturo 遊客服務處 0921-541759。
- 🟢 Sicily Hiking（標二手）：15 市鎮含 Caltavuturo、禁止露營過夜、撿岩石、機動車。SAIS 巴勒摩路線頁下載後搜尋無 Caltavuturo。
- 🔵→已修：「Gazzara 重複最多的十條有八條在 6a 以下」實數是 7 條（Folletto、Erba o vientu、Capolinea、Fossile、Il mio tesorooo、Orizzonte di fuoco、L'urlo del carcarazzo）→ 改成七條。中英同步。
- 🟡 朝向推日照、雨後河水可能變大，都在正文標明是推測。

本次只檢查了文中已提出的宣告，未評估覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 中英兩篇通過；`check-tw-terms` 0 blocking、0 to review；`check-lang-parity` OK；`check-process-leak` 無輸出；`check-post-quality` 本篇無警告。
- 結構對照契約：導言末句交代本篇幫讀者決定什麼 → 這是什麼樣的岩場（含規模表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車）→ 去之前要知道的規範（含 112）→ 依程度挑路線（四級 H3，標題用 HEAD 寫法，換算說明固定句）→ 查資料的入口（含「指南書」條目，第一句固定）→ 參考資料，對齊 ✅。
- frontmatter：date 2026-10-19、category climbing、type guide、series 中「義大利岩場」／英「Italy Climbing Crags」、order 1905；tags 照範本風格以 sicily 收尾（與既有 San Vito 篇一致）；tldr 先講岩場本身，再講最會改變行程的一件事。
- 連結：導言連系列總覽（英文連 `-en`）；只連已存在的聖維托篇與同批由我寫的西西里篇；首次出現的來源、營運者、公園都有 inline 連結。
- 中英對等：英文版逐段對應，引號原文保留，義大利文來源在英文參考資料標 (in Italian)。
- 覆蓋：三處岩區分別交代位置、朝向、接近；規模表並列 theCrag 與 Climbook；附近 Collesano、Castelbuono 只一句帶過，未擴寫（不在指派範圍）。
- 讀者位置：夏季主題放在導言與季節表；沒有公車直說，給遊客服務處電話；渡河接近加「推測」的雨後提醒。
- 規範：公園規定來源是二手整理，正文已標；Rocca di Sciara 有公園頁直接寫設置了攀岩壁。

## post-polish

- register-scan：長句 5 句、但書段落 1/30（3%）、引述區塊 0、姓名當主詞 0、模板化轉折 0、一般英文術語 0；數字密集段 2（指南書書目、「適合誰」段的路線數），屬查表資訊。
- 已檢查：交通段「沒有找到營運者時刻表」改成讀者能做的動作（向遊客服務處問，附電話）；接近方式用條列而不是長段落。
- 沒有需要改寫的模板句。保護片段未動；改後 grade check、check-tw、check-process-leak 通過。
