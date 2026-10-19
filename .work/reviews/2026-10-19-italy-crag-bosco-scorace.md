# Review: 2026-10-19-italy-crag-bosco-scorace（中英共用）

日期：2026-10-19。文章：`src/content/posts/climbing/2026-10-19-italy-crag-bosco-scorace.md`、`-en.md`。研究筆記：`.research/2026-10-19-italy-crag-bosco-scorace.md`。系列〈義大利岩場〉order 1903。作者自審（同一個 agent 寫稿與審稿，非獨立審稿）。

工具降級（toolDegradation）：見研究筆記。主要靠 Exa web_fetch 讀頁、Groundlane web_search 找頁、curl 抓 Climbook、本地 tesseract OCR 掃描檔命令。

## post-verify

本 session 開啟的來源逐條對照（2026-10-19）。

- 🟢 UKC 西西里指南（2022-06-01，Massimo Cappuccio）：「If you are a boulderer, the best place is Bosco Scorace」；與楓丹白露比較；4 到 8A+；三區 Bevaio、Rocche Forbici、Spaceship 共 200 條；落地「almost always quite comfortable and safe」；最矮的巨石適合初學者；民宿提供 driving、crash pad、岩牆；租車建議。
- 🟢 Gripped（2025-10-04）：2016 年 Catalano 開始、荊棘、七區 400+、潛力 1,500–2,000、V0–V14、2–8 m、家庭、10–5 月最好、夏天靠樹蔭、比海邊涼、巴勒摩 1h15、聖維托 45 分、30 秒到 15 分、需要車、Ummari 約 15 分、指南在 Polvere di Stelle 或 Dolmen Climb、大雨後 2–3 天、少用粉、軟刷、私人土地、狗繫繩、禁止生火與露營。
- 🟢 27crags 說明：Ummari 與 Buseto Palizzolo 之間、約 600 m、樹種、Catalano 與 Borsani 2016、三主區（兩區在保護林內、一區在私人土地）、關係良好、勿擾牲畜、9–5 月條件最好。27crags access（thetopo 同一 DB）：柏油＋碎石 15 分、上下兩個停車場。27crags 主頁 317 題；路線清單各題難度、區與紀錄數逐列對照。
- 🟢 theCrag：說明約 500 條、登錄 40 題。Planetmountain 2021：Ramerio／The Crimp、約 70 頁、180 題、三大區。Oliunid 2021：一直有風、8a+ 由 Gabry Moroni 完成。B&B Polvere di Stelle 官網：出租墊與繩索快扣、帶隊、販售 The Crimp 指南。
- 🟢 Versante Sud《Di Roccia di Sole》：出版社描述提到 boulder 與 DWS 的新增內容。
- 🔵→已修：V 級原為手填（5+ 寫約 V1、6B+ 寫 V4 等九列），腳本對照表是 V2、V0+、V3+、V5+、V4+ → 全部改成腳本值（中英）。
- 🔵→已補：Polvere di Stelle 官網本來只看到搜尋摘要，本 session 開啟後補上服務清單（帶隊、出租、販售指南），正文「查資料的入口」改寫。中英同步。
- 🟡 禁止生火露營只有 Gripped（二手）支撐，正文已標「二手：Gripped 2025 年專文，沒有找到森林管理單位的原始公告」。

本次只檢查了文中已提出的宣告，未評估覆蓋是否完整（覆蓋交 post-review）。

## post-review

- 機械檢查：`node scripts/climbing-grade-convert.mjs --check` 中英兩篇通過；`check-tw-terms` 0 blocking、0 to review；`check-lang-parity` OK；`check-process-leak` 無輸出；`check-post-quality` 本篇無警告。
- 結構對照契約：導言末句交代本篇幫讀者決定什麼 → 這是什麼樣的岩場（含規模表）→ 什麼季節去（來源表）→ 怎麼去（大眾運輸／開車／停車）→ 去之前要知道的規範（含 112）→ 依程度挑路線（四級 H3，標題用 HEAD 寫法，換算說明固定句）→ 查資料的入口（含「指南書」條目，第一句固定）→ 參考資料，對齊 ✅。
- frontmatter：date 2026-10-19、category climbing、type guide、series 中「義大利岩場」／英「Italy Climbing Crags」、order 1903；tags 照範本風格以 sicily 收尾（與既有 San Vito 篇一致）；tldr 先講岩場本身，再講最會改變行程的一件事。
- 連結：導言連系列總覽（英文連 `-en`）；只連已存在的聖維托篇與同批由我寫的西西里篇；首次出現的來源、營運者、公園都有 inline 連結。
- 中英對等：英文版逐段對應，引號原文保留，義大利文來源在英文參考資料標 (in Italian)。
- 覆蓋：只有抱石，四級 H3 照契約保留，表格用 Font／V 級欄，並在分級說明段交代「Font 字面分組、不等於運攀級數」。
- 規模表並列五個來源並說明數字差異來自持續開發。
- 讀者位置：沒有大眾運輸直說，給出租車與民宿接送（問民宿）的替代。

## post-polish

- register-scan：長句 7 句（其中 2 句是指南書條目的書目資訊）、但書段落 3/25（12%）、引述區塊 0、姓名當主詞 0、模板化轉折 0、一般英文術語 0；數字密集段 4（最高是分級說明段 10 個，內容是 Font 級數分組，屬查表資訊，保留）。
- 已檢查：私人土地段 75 字長句是兩個來源的規範並列，拆開會重複主詞，保留；「很新的岩場」段 8 個數字是開發年份與題數演變，留著讓讀者理解各站數字為何不同。
- 沒有需要改寫的模板句。保護片段未動；改後 grade check、check-tw 通過。
