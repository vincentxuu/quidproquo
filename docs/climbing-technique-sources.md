# 攀岩技術文章的來源清單

給寫確保、固定點、多繩距、傳攀、救援、人工攀登與大岩壁、器材怎麼用這類技術文章的人：先從這份清單找來源，再用關鍵字補漏，不要每篇從零搜。岩場導覽的來源另見 `docs/climbing-sources.md`；器材實測影片頻道見 `scripts/config/climbing-gear-channels.json` 與 `.agents/skills/post/references/climbing-gear-videos.md`。

建立方式（2026-10-24）：用腳本抽出站上 90 份技術類中文文章與研究筆記（`.research/2026-10-1*` 的 sport-trad、technique、gear、disciplines 筆記，`.work/aid-climbing-gear/`、`.work/multipitch-hauling/`）的全部網址，依網域計次（結果存在 `.work/multipitch-hauling/source-domain-counts.txt`），再加上拖包文章兩輪研究的協會盤點。表中「引用」是網域出現在幾個檔案，只當作常用程度的參考。

**分級**

- **一手**：原廠說明書與技術指南（Technical Notice、Tech Tips）、協會出版的教學大綱或期刊、標準（EN、UIAA）、事故報告。
- **二手**：嚮導與教練寫的技術站、編輯型媒體、攀岩書。內容通常可靠，但常是個人做法，彼此會衝突。
- **不能單獨撐**：論壇、個人部落格、零售商頁、聚合站。用來找線索；規格與安全規則要回原廠。

**用法**

1. 安全規則與器材能不能這樣用，以原廠說明書為準；嚮導技術站與原廠衝突時，兩種說法並列，正文採較保守的。
2. 做法類（順序、掛法、繩子選擇）至少找兩家二手來源；衝突時並列，不替讀者選邊。
3. 評測、影片、價格只收 2024 年以後；原廠說明、協會教學、經典教學不受限，但要寫出年份（Kirkpatrick 舊文多是 1990 年代器材）。
4. 抓不到時照全域 fetch 鏈走完，再用下表「已知陷阱」的替代路線。

## 原廠（一手）

| 來源 | 網址 | 擅長 | 引用 | 已知陷阱 |
|---|---|---|---|---|
| Petzl 產品頁與 Tech Tips | https://www.petzl.com | 確保器、止退滑輪、上升器、垂降、拖包、救援的官方做法與禁止事項；說明書 PDF 有圖示 | 33 | 舊式網址（`/BE/en/Sport/...`、`/INT/en/Sport/Video-...`）curl 回 404，用 Exa web_search 找新網址或內文；說明書 PDF 在 `petzl.com/sfc/servlet.shepherd/...`；rescue 分類的技巧是給傷者的，套到其他情境要註明是推論；〈Hauling a bag: preparation and technique〉已下架，用 Wayback `20230514145345` 存檔（2024 年的存檔是空殼） |
| Petzl 台灣 | https://www.petzltw.com | 台灣售價、中文品名、庫存 | 6 | CYBERBIZ 平台，不是 Shopify；多規格價格讀商品頁 HTML 內嵌的 `productVariantsInfo` |
| Black Diamond | https://www.blackdiamondequipment.com | 產品規格、QC Lab 文章（daisy、拖拉環強度）、說明書 | 27 | 沒有拖包教學（官方明說不談）；停產品網址回 404，要靠零售商確認停產；價格用 Shopify `/products/<handle>.js` |
| EDELRID | https://edelrid.com | 繩、細繩、確保器規格；EDELRID Knowledge Base 實驗室數字 | 13 | 有 `.com` 與 `.de` 兩站，規格偶有差異；Knowledge Base 是廠商頻道 |
| Mammut | https://www.mammut.com | 繩、確保器、與 Hard Is Easy 合拍的實驗 | 12 | 合作影片要註明商業關係 |
| DMM | https://dmmwales.com | 檢查汰換、傳攀放置、召回公告 | 6 | 旋轉環有召回（Director 系列），提到 DMM 旋轉環必附召回頁 |
| Beal、Sterling、CAMP、Climbing Technology、Wild Country、Metolius、Maxim | 各官網 | 繩與細繩強度、旋轉環、拖包、cam 規格 | 3–8 | Beal 產品名與規格表直徑可能不同（BACK UP LINE 5 mm 實為 5.5 mm），以規格表為準；CAMP 官網是 JS 單頁，抓不到時用零售商轉貼並註明；零售商頁常是舊規格（CAMP GYRO1 工作負荷 2024 年從 3 kN 改 5 kN） |

## 協會、期刊與事故報告（一手）

| 來源 | 網址 | 擅長 | 引用 | 已知陷阱 |
|---|---|---|---|---|
| bergundsteigen | https://www.bergundsteigen.com | DAV、ÖAV、SAC、AVS 合辦的期刊。德語區山岳會的技術內容（拖包、確保、固定點）實際刊在這裡 | 新加入 | 德文；搜 `Haulen`、`Tagline`、`Materialsack nachziehen`、`Standplatz` |
| DAV（德國山岳會） | https://www.alpenverein.de | 安全研究、器材建議、Kletterhallen 規範 | 18 | Alpin-Lehrplan 是付費書，網站只有摘要 |
| UIAA | https://www.theuiaa.org | 標準、Mountain Skills 教學、醫學建議 | 23 | 標準本文要付費，網站是摘要 |
| American Alpine Club《Accidents in North American Climbing》 | https://publications.americanalpineclub.org | 事故案例與分析 | 20 | 單一案例不等於統計；引用要寫年份與案例名 |
| BMC（英國登山協會）／BMC TV | https://www.thebmc.co.uk | 多繩距入門、檢查示範短片 | 22 | 英國情境；沒有拖包教學 |
| Mountain Training UK | https://www.mountain-training.org | 教練課程範圍 | 4 | 只有課程大綱，不是技術文 |
| AMGA | https://amga.com | 嚮導課程範圍、SPI 手冊 | 6 | 文件裡的 "hauling system" 指 3:1 救援拉升，不是拖包 |
| 其他 IFMGA 會員與山岳會（ACMG、BMG、NZMGA、SBV、ENSA、VDBS、JMGA、SAC、CAI、FFME） | 各官網 | 課程範圍、救援拉升 | 少 | 2026-10-24 盤點：公開的拖包技術教學只有 bergundsteigen；其他多半只有救援拉升或課程名稱，細節見 `.work/multipitch-hauling/R-technique.md` §6.3a。JMGA《技術教本》付費 |

## 嚮導與教練的技術站、媒體（二手）

| 來源 | 網址 | 擅長 | 引用 | 已知陷阱 |
|---|---|---|---|---|
| Climbing.com | https://www.climbing.com | 技術教學（Learn This、Tech Tip）、評比 | 49 | 文章年份跨 2004–2026，引用要看日期；不同作者常互相矛盾（例：爬繩 daisy 長度） |
| Alpinesavvy | https://alpinesavvy.com | 繩索系統細節：止退滑輪、拖包、固定點、救援 | 6 | 部分文章在付費牆後，Wayback 也只有公開段；它推薦的器材要回原廠查是否被召回 |
| Andy Kirkpatrick | https://andy-kirkpatrick.com 、https://andykirkpatrick.substack.com | 大岩壁、拖包、人工攀登 | 4 | 官網舊文站方自註「器材已過時」，多為 1990 年代寫成；《Higher Education》書沒有線上試閱，只能經 Alpinesavvy 轉引 |
| SuperTopo／Chris McNamara | http://www.supertopo.com | 大岩壁流程、優勝美地路線 | 3 | 原站常在維護，Exa 也只回維護頁；用 `r.jina.ai/http://supertopo.com/...` 讀快取；部分章節只在書裡 |
| VDiff Climbing | https://vdiffclimbing.com | 多繩距與大岩壁系統圖解 | 3 | 書摘性質，2025–2026 更新頻繁，引用寫查核日 |
| UKClimbing 文章 | https://www.ukclimbing.com/articles | 英國技術文、器材群測 | 23 | 群測多是 2014–2016；直接 fetch 常 403；和 Logbook（群眾 DB）分開看 |
| REI Expert Advice | https://www.rei.com/learn | 入門概念、選購 | 22 | 沒有拖包或大岩壁技術教學 |
| Alpine Institute、Mark Hudon、WeighMyRack 部落格 | 各網址 | 個人或嚮導公司的做法 | 少 | 個人經驗，標年份；Hudon 的 PDF 是 2012 年 |
| OutdoorGearLab、Treeline Review、Switchback Travel、Gripped | 各網址 | 器材評比 | 5–13 | 日期陷阱見 `climbing-gear-videos.md`「文字評測的日期陷阱」 |

## 台灣與中文來源

| 來源 | 網址 | 擅長 | 引用 | 已知陷阱 |
|---|---|---|---|---|
| 台灣山岳攀登協會（TOCC） | https://tocc-climbing.org | 龍洞、台灣岩場現況、課程 | 17 | 岩場事實歸 `docs/climbing-sources.md` 管 |
| NobodyClimb、TUP Climbing、動一動專欄 | 各網址 | 台灣用語、在地教學、課程 | 13–17 | 個人或商業課程，術語可參考，安全規則回原廠 |

## 日文與其他語言的搜尋關鍵字

| 主題 | 日文 | 德文 | 法文 | 義大利文 |
|---|---|---|---|---|
| 拖包 | 荷上げ、荷揚げ、ホーリング、ボディホーリング、スペースホーリング | Haulen、Tagline、Materialsack nachziehen | hissage du sac | recupero sacco、issare il sacco |
| 確保站 | ビレイ点、支点構築 | Standplatz | relais | sosta |
| 救援拉升 | 引き上げ、M/A システム | Flaschenzug | mouflage | paranco |

日本講習所、嚮導的部落格（例：石田登山塾日誌）有實際失敗案例，可當案例來源，不能撐規格。

## 維護

- 新的技術文章研究完，把新出現、引用 3 次以上的網域補進對應表格，陷阱一併寫上。
- 原廠網址改版、站點關閉、付費牆變動時，更新「已知陷阱」欄。
- 日期：2026-10-24 建立。
