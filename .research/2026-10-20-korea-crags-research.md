# 韓國岩場系列：母群、來源與首批選案

2026-10-20。這是研究紀錄；不是已完成全系列或現況攀登許可確認。

## 讀者問題與邊界

南韓天然岩場：運攀、傳攀、多段、抱石。台灣攀岩旅人如何依程度、月份、交通挑場？排除人工牆、冰攀、純健行。先盤全國來源，再決定首批，不把熟悉的仁壽峰與仙雲山當全國。

研究子題：全國岩場與指南書母群；北漢山及雪嶽山管理；運攀與抱石代表區；仁壽峰路線與接近；原始資料是否足夠支撐各篇。

## 研究產物

- `.work/korea-crags/gin-crag-inventory.csv`：使用者 PDF 主索引逐列抽取，含韓英名稱、2012 級數／數量、印刷及 PDF 頁碼、按書中章節歸區。書自稱 156 場；現行程式解析 155 列，未把兩者差異偷偷補成虛構岩場，也不把它當全韓總數。
- `.work/korea-crags/kotr-directory.csv`：KOTR 首頁 HTML 中全部 82 個 map markers；37 個 rock、5 個 bouldering，另有 gym／ice／artificial。分類由原始 marker class 得來，不是 82 個天然岩場，更不等於全韓完整名錄。
- `.work/korea-crags/research-access.md`：KNPS 官方頁、季節公告及聯盟／媒體的全文紀錄與適用範圍。
- `.work/korea-crags/research-sport.md`：運攀與抱石候選池、五組公開來源閱讀、GIN 五組完整章節與矛盾。
- `.work/korea-crags/national-full.json`、`national-source-0.md` 至 `national-source-3.md`：全國目錄、東壁 topo 與指南書書目原始抽取。
- `.work/korea-crags/drive-source-0.md` 至 `drive-source-2.md`：使用者 Drive 的接近、路線、特定隊伍裝備文字。

## 指南書身分與讀取範圍

`/Users/xiaoxu/Downloads/GINGuidebook.pdf`：159 PDF 頁，部分是雙頁 spread。版權頁為 Dong-il Ryou、Jonn Jeanneret，《Climb / Rock Climbing in Korea》，2012 年 11 月第一版。2025-08-01 為檔案修改時間，不是新版證據。版權頁禁止未經書面同意重製；全文和圖版只留本機研究，不直接複製發布。

已讀 PDF 2（版權）、3–4（Master Crag List）、5（導言／目錄）。原書作者自述重點是岩場定位和接近，不是精確逐線操作 topo。歷史數據只作選案／交叉檢查，交通、地主許可、確保站、下降都要回現行來源。

仁壽峰完整章 PDF 120–123（印刷 230–237）依序讀完抽取文字；PDF 122 另渲染原頁視覺確認表格欄位。讀到 Chouinard A 總級數 5.10c、分段最高 5.10a；Crony 總級數 5.9、分段列兩段 5.10a；Pigeon／Dove 總級數 5.6/A1、分段列 5.7。這些是原頁已見的不一致，不自行推測哪欄正確。

運攀完整章閱讀紀錄見 `research-sport.md`：文殊山 PDF 21–23；仙雲山 56–60；Halmae 61；艮峴 111–112；濟州 145–149。只聲稱這些選定章節與索引已讀，不聲稱通讀全書。PDF 頁碼與印刷頁碼分開記錄。

另已視讀使用者 Drive 的 `Chouinard A.jpg` 與 `Insubong_approach.png`；前者圖標 5.10a，後者有三條不同岩面接近線。文字紀錄與圖片能互相定位，但不能藉地圖證明寺院通行權、現行步道開放或下降繩長。其他圖尚未逐張核對。

## Sources opened

- Korea on the Rocks https://www.koreaontherocks.com/home/: 外籍攀岩者投稿目錄；首頁全文抽取 1394 字元、50 行順讀；原始 HTML 129768 字元以程式窮舉 marker，沒有宣稱人工通讀所有 JS。
- theCrag 韓國 https://www.thecrag.com/en/climbing/south-korea: 頁列十個地理區，含慶尚、忠清、濟州、鬱陵；全文抽取 2109 字元、177 行順讀。屬社群目錄，不能證明目前合法開放。
- Mont Blanc Lines 仁壽峰東面 https://www.montblanclines.com/products/%ec%9d%b8%ec%88%98%eb%b4%89-insubong-east-face: 發布者頁全文抽取 2992 字元、53 行順讀；2025-05-18 初版；43 個編號路線；列 Chouinard A 5.10a、Lonely Road 5.6；數位圖個人用途限制。不能稱為 2025 韓國新版指南書，也不能直接重製 topo。
- UKC 指南書書目 https://www.ukclimbing.com/logbook/books/climb_rock_climbing_in_south_korea-1362: 書目全文抽取 1246 字元、42 行順讀；Outdoor Global、2012、Ryou／Jeanneret；與使用者 PDF 版權交叉。頁面 1970 更新標記不是出版年，也不是新版證據。
- FLASH.climblog https://flash.climblog.kr/: 韓文戶外資料庫頁全文順讀，包含首都圈抱石及運攀紀錄；動態時間不是公告日期，不能從最近完攀推得管理處允許。
- KNPS 岩壁服務 https://www.knps.or.kr/smartsafe/permission/list.do: 通用預約程序，不足以推出仁壽峰強制許可；全文證據與對照見 access note。
- KNPS 北漢山管制詳情 https://www.knps.or.kr/front/portal/safe/acsCtrDtl.do?menuNo=8000340&parkId=121500: 具名溪谷步道部分管制，不等於仁壽峰封閉；全文與時間見 access note。
- 艮峴當地導覽 https://climbonkorea.com/ganhyeon/: 2024 作者資料的難度分布，不能外推目前硬體、收費與總路線數；全文記錄見 sport note。
- 其餘已讀公開頁（仙雲／Halmae 親訪、文殊山 MP、原州市、濟州開發者、韓文指南書目、KNPS 雪嶽山新舊公告、月刊山）逐頁 URL／全文閱讀範圍見兩份分項 note，不把搜尋候選算已讀來源。

## 交叉驗證：已改變選案或寫法的發現

| 主張 | 來源實際內容 | 處置 |
|---|---|---|
| 原先七篇足夠代表韓國 | 全國書目、KOTR 和 theCrag 還有東南運攀、忠清、濟州等 | 推翻原先固定七篇；把文殊山、釜山岩區及濟州納入選讀池 |
| 2025 有仁壽峰新版指南 | 2025 是東壁 topo 初版，書目與本機 PDF 是 2012 | 區分書、topo、DB，不能混稱新版書 |
| Chouinard A 就照指南寫 | 2012 原表總級數／分段不一致；使用者 topo 和 2025 發布者列 5.10a | 正文需交代版本差異；不能用舊總欄直接配分級 |
| 仙雲山路線數彼此衝突 | 2012 涵蓋四區，2020 親訪重點三區，計數與範圍不同 | 先拆子區；Dosol 的寺方問題另查，不當全區可爬 |
| 艮峴書表能直接配繩 | Better Day Than Yesterday 總長與分段加總不符 | 不用該總長推下放／下降；另取可靠逐線 topo |
| 國立公園部分管制等於全部禁攀 | KNPS 詳情具名特定步道；通用申請頁沒有岩場適用名單 | 管制範圍逐場、逐公告確認；不從服務頁外推法律 |
| 濟州沒有抱石墊 | 舊社群描述與較新開發者募墊資訊不同 | 不能寫不存在，也不能從募款願景推當天可借 |

## 覆蓋矩陣與選讀順序

| 區域／需求 | 具名選讀案例 | 目前可支持 | 寫文章前仍需確認 |
|---|---|---|---|
| 首爾傳攀 | 仁壽峰 | 書、使用者筆記、兩張圖、2025 topo | 現行管理、逐線下降、寺院接近 |
| 道峰花崗岩 | 仙人峰 Seoninbong | 書主索引有具名岩壁 | 獨立岩壁正文精讀與現況，避免整個道峰山一篇過廣 |
| 江原長線 | 雪嶽山蔚山岩／將軍峰／赤壁／遊仙臺 | 書索引分列、官方季節公告 | 逐岩壁選案，不把全雪嶽山當一個同質岩場 |
| 江原運攀 | 艮峴 | 書全章、當地導覽、原州市 | 地質／數量來源差異、現行入口與停車 |
| 全羅石灰岩 | 仙雲山、Halmae | 五章正文／表格、親訪交叉 | 現行地主／寺院規範、子區開放 |
| 東南運攀 | 蔚山文殊山、釜山金井山大陸峰 | 文殊山書全章＋MP；大陸峰書 PDF 10 原文 | 最新管理／交通；釜山其他壁分開評估 |
| 濟州繩攀 | 無水川、單山、獨立岩 | 書全章含三區 | 山洪／海浪條件、現行管理、不可沿用翻越圍欄指示 |
| 濟州抱石 | 當地開發者指南所列岩區 | 作者公開頁、指南索引 | 指南 PDF 內容、級數與實際租墊條件 |
| 忠清／其他抱石 | 海崖、河谷、佛岩／無等候選 | 母群與韓文入口已找到 | 精讀後才能決定代表案例；不宣稱不重要 |

推論：第一批仍適合總覽＋仁壽峰，因使用者資料能補實際接近與選線，但不是因為其他地區不值得寫。其後按區域與風格展開；完整篇數在個別岩壁研究後決定，不能先固定七篇硬套。

## Dropped / not used

- https://kotri.org/climb/：Exa CRAWL_UNKNOWN_ERROR；以使用者提供原書與 UKC 書目取代，沒有宣稱原販售頁已讀。
- https://www.koreaontherocks.com/crags/：CRAWL_NOT_FOUND；實際改讀首頁原始 map markers，不推測網站無目錄。
- Scribd 非授權轉載：未採用。書由使用者本機提供。
- 未打開的搜尋候選、舊筆記的摘要、未逐張看的其餘 Drive 圖：不能用來聲稱查證完成。

## 完成邊界與後續

已完成本輪母群掃描、決策來源選讀與反證整理；尚未完成每篇可發布的逐線查核、所有現況管理、官方交通、濟州抱石 PDF。這些是寫作前的工作，不改寫成「無公開資料」或靠正文但書取代查證。
文章、series 登錄、commit、push、上線均尚未執行。規劃表根據本輪證據修訂，仍待原流程的使用者確認。
工具降級：完整 callable inventory 無 Groundlane；使用 Exa MCP、特定頁的平台 web fallback、公開 KOTR HTML 本機解析；私人 Drive 只用 Google Drive connector，未送外部搜尋。PDF 使用本機 Poppler／PyMuPDF。沒有使用已退役抓取工具。
`research-source-registry` skill 未安裝於目前專案，未自創評分或新增 registry；證據先留此輪 note。
