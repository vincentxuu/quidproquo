# Pha Tang：中英獨立審稿

2026-10-21。theCrag Pha Tang 頁（區塊標題計數與 FR 級數表）、Mountain Project Pha Tang 頁、The Crag Journal 2023 萬榮段讀取。中英全文讀完。

## post-verify

- 🟢 48 條：theCrag Pha Tang 頁區塊標題「Mostly Sport climbing [48 routes]」，與 Crag Journal 2023 的「Pha Tang has 48 routes」一致。
- 🟢 FR 級數分布 5b×1、5c×5、6a×2、6b×3、6c×5、7a×4、7b×2、7c×4、8a×1、8b×1，合計 28 條：直接解析 theCrag 頁的級數表計數，28 條有級數、其餘 20 條未填級數。正文表格與說明一致。
- 🟢 Papillon 6c：theCrag Nearby Icons 與 Crag Journal 圖說（「The superb (much better than it looks) 'Papillon', 6c」）。
- 🟢 岩質描述（很淺的白色石灰岩、強烈對比黑色條紋、大量 tufa、高處尤其多）：Crag Journal 2023 原文。
- 🟢 接近：沿 N13 往北約 20 km 到 Pha Tang 村，再 2 km 見左手邊明顯岩壁（Mountain Project）；接近過程穿過小溪、稻田與農地，勿踩踏作物（Crag Journal 原文「don't trample any crops!」）。
- 🟢 村名與岩場名：岩場正式名為 Na Pha Daeng，因另有同名 Pha Daeng 區而常以村名 Pha Tang 稱呼：Crag Journal 2023 原文。
- 🟢 「人少／路線有點塵但不骯髒」：Crag Journal 2023「Pha Tang doesn't get many climbers and while the routes can be dusty in places, nothing was overly dirty」。
- 🟢 指南書涵蓋 Pha Tang：GCH 攀岩頁明列 Pha Tang。
- 未驗：Papillon 以外的逐線名稱與長度、各子區的日照方向、2026 年是否有新開發或岩栓更新。正文以「名稱以指南書為準」與「公開頁面沒有日照資料」處理。

## post-review

這一篇的判斷是「值不值得為它多留一天」：48 條、5b–8b、白壁黑條紋、tufa 多、人少，交換條件是遠與接近要穿稻田。級數分布表直接導出「5c 到 6c 有 16 條，是最好選擇的區間」這個結論，讀者不需要自己加總。

「去之前要知道的事」五段分別處理維護、天氣、交通、補給、生態禮貌，每段都對應一個具體動作（帶扳手、雲聚集就收工、包嘟嘟車、在萬榮買補給、拍照前先問）。

## post-polish

「接近路線本身就是景點」把一段 22 公里的機車加步行寫成值得的體驗，而不是負擔。段落沒有誇大岩質，保留「部分路線會有灰塵」這種不完美的資訊。

可選修：表格的「長度」欄全部留白（公開資料沒有長度），若補上長度會更好用，但需指南書實體，現階段維持空白並在表下說明，非必修。

### 定稿掃描補記

register-scan 與 phrase-ledger 已實際執行，無 ledger 命中。級數分布表的中英版本數字逐格比對一致。

### 定稿結構調整（2026-10-21 晚間）

依 `crag-guide-contract` 重寫 H2，並新增「依程度挑路線」：四級標題由 `climbing-grade-convert.mjs --write` 補 YDS 範圍。Pha Tang 的 48 條路線在 theCrag 上沒有逐條公開名稱，所以四級小節以「有幾條、落在哪個級數帶」說明，只有 Papillon 6c 有可查證的名稱並列表，1 row / 0 issues。級數分布表移到「這是什麼樣的岩場」段，欄位為「FR 級數 / 路線數」，不含「難度」欄，不觸發換算規則。

🔵 修：級數分布原只列 28 條（先前解析只抓到部分級數），本輪重讀 theCrag 頁面補齊為完整 48 條（5b 1、5c 5、6a 2、6a+ 1、6b 3、6b+ 3、6c 5、6c+ 2、7a 4、7a+ 4、7b 2、7b+ 3、7c 4、7c+ 2、8a 1、8a+ 1、8b 1）。另補 theCrag 的兩個新事實：全區登錄僅 23 次攀登、往南 4 公里河邊有一家可吃住的小旅店。
