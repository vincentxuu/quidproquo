# 韓國岩場總覽：寫作與來源紀錄

2026-10-21。文章角色 order 0；雙語。讀者問題：第一次去南韓攀岩，如何依風格、季節與交通選基地，並找到可信的逐線與管理資料？讀完應能縮小目的地，不承諾全國路線清單。

主脊：先選風格／基地→季節→交通→難度→資料入口→規矩與繩伴→四天運攀旅人的選擇例。地區比較採表格，沒有多步操作或精確空間定位需求，不加圖解。

## Sources opened

本輪直接完整閱讀 Exa 回傳抽取正文：

- KMA Climate of Korea https://www.kma.go.kr/neng/biz/climate/climate-of-korea.do: 全文讀至官方地址；四季、長雨季、冬夏差與秋季低濕支持概括規劃。正文不使用此頁可能較舊的極端紀錄／精確氣候數值。
- KOTR homepage https://www.koreaontherocks.com/home/: 全文讀取；2004 起外籍攀登者投稿，英語地圖，直接列 iGuideKorea 課程與客製旅程聯絡；不宣稱目前論壇有活躍揪團或可保證配對。
- Mountain Project Munsusan https://www.mountainproject.com/area/106798792/munsusan-ulsanbusan-area: 全文讀至照片與留言末尾；2020敘述片麻岩、南向、上／下區、冬季岩場；不採舊車資／班次／硬體狀態或精確數量。
- Mont Blanc Lines East Face https://www.montblanclines.com/products/%ec%9d%b8%ec%88%98%eb%b4%89-insubong-east-face: 全文讀至2025-05-18初版；區域 topo、英文說明與韓羅馬字路線名、個人用途；不轉載圖片，不採頁中錯把Chouinard服役時段寫成韓戰的歷史敘述。

本輪重讀本機原始材料：GIN PDF 抽取002版權、005導言、056仙雲山介紹全文、120仁壽峰介紹全文、145濟州氣候頁（只有抽取文字，不拿圖中數值推新結論）。2012原書作者明說不是精確route guide。版權頁作者Dong-il Ryou／Jonn Jeanneret與November2012。

以下公開頁採已完成全文閱讀的共享研究，詳見 `.research/2026-10-20-korea-climbing-websites.md`、`.research/2026-10-20-korea-climbing-guidebook-editions.md`、`.research/2026-10-20-korea-crags-research.md` 與 `.work/korea-crags/research-sport.md`／`research-access.md` 原始閱讀紀錄；本輪沒有重新抓取所有頁：

- Climb On Korea https://climbonkorea.com/ganhyeon/: 艮峴多種壁型及5.11缺口；不寫2024停車收費或維護為現況。
- More Days Off https://moredaysoff.wordpress.com/2020/07/01/the-south-korean-sport-climbing-of-seonusan-best-area-korea-and-halmae-bawi/: 高敞兩場風格，2020親訪；不採最高排名、價格、露營或現況硬體。
- 月刊山 https://san.chosun.com/news/articleView.html?idxno=10118: 具名仁壽峰路線介紹的來源示例，不引用舊交通。
- 人與山 https://www.sansan.co.kr/news/articleView.html?idxno=9990: 仙人峰整修與改級報導，支持資料用途，不聲稱現在所有岩釘安全。
- FLASH https://flash.climblog.kr/routes?crag=간현암: 艮峴逐繩距與beta資料；共享研究有CUA實讀。正文不報總路線數。
- Granite https://granite.kr/c/anyang?tab=route: 安養具名抱石題目；不稱最大平台。
- The Topo https://thetopo.com/countries/korea-republic-of: 國別索引；不使用登錄量當全韓總數。
- The Topo改名 https://help.thetopo.com/articles/2800000-27-crags-is-now-the-topo: 27 Crags同一平台，不雙重計來源。
- theCrag https://www.thecrag.com/en/climbing/south-korea: 國別地區索引。
- Jeju bouldering https://www.thecrag.com/en/climbing/south-korea/area/8378865285: 地區抱石與當地指南入口；不聲稱已讀完整指南PDF或確保有墊可借。
- UKC book https://www.ukclimbing.com/logbook/books/climb_rock_climbing_in_south_korea-1362: 作者、Outdoor Global、2012書目；與PDF版權一致，不稱找到新版。
- KNPS restrictions https://www.knps.or.kr/front/portal/safe/acsCtrList.do?menuNo=8000340: 公園級查詢入口，具體管制要讀詳情。
- KNPS wall procedure https://www.knps.or.kr/smartsafe/permission/list.do: 通用申請程序，不外推全韓／仁壽峰強制制度。
- Seoraksan notice https://res.knps.or.kr/community/board/notice/boardDetail.do?seq=29026: 季節管理示例；正文不重播過期日期或聲稱現行封閉。

## Dropped / not used

- 救援119：本篇未獨立閱讀官方救援來源，不加入電話或保險法律結論。
- iGuideKorea自身首頁：本輪未直接開啟，以KOTR明確服務推薦支撐入口與服務描述，不稱已實測服務、詢價或保證 availability。
- 不使用尚未完成的其他篇目連結，只有仁壽峰本批配對。
- 沒有精確路線總數、費用、班號、下降繩長或現行封閉結論，避免把歷史資料推成當日可行程。

## toolDegradation

完整 callable inventory 無 Groundlane；有 Exa MCP search/fetch，使用其查KMA原始氣候頁、重讀KOTR／MP／MontBlanc。其餘重用共享已開來源。不使用退役工具／playwright抓取，未傳送Drive私有內容。

## Validation

- `node scripts/check-process-leak.mjs <overview兩版>` 通過，無輸出。
- `node scripts/climbing-grade-convert.mjs --check <overview兩版>` 通過：0 rows，總覽不列逐線換算表。
- 全站pnpm verify、系列登錄、review三節與索引整合交由parent完成；本worker只改assigned三檔。

- `pnpm check:tw <中文總覽>` 初次發現網絡，已改網路；重跑通過。register-scan初次只有iGuideKorea一句65字，已拆句。
