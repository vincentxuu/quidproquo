# 審稿紀錄：2026-10-24-climbing-quickdraws（攀岩裝備 order 7，拆自 2026-10-19-climbing-rope-belay-device）

檔案：`src/content/posts/climbing/2026-10-24-climbing-quickdraws.md`、`-en.md`
日期：2026-10-24
審稿者：獨立審稿 session（沒有參與寫稿），依 `.work/climbing-gear-models/review-brief.md`。
線索：`.work/climbing-gear-models/R-quickdraws.md`、`tmp-biners/qd/`（只當線索，以下結論都回原始來源核對）。

工具降級（toolDegradation）：Groundlane MCP 回「MCP server "claude.ai Groundlane" is not connected」（一次，照規格直接降級）。原廠頁、BSMI、SIMOND、AAC、Wild Country、Treeline、OGL、DAV、UIAA 改用 curl 全文抓取＋去標籤 grep；BD、DMM 另讀 Shopify `products/<handle>.js` 與頁內 `variantsInventoryQuantity`；SIMOND 召回頁是 JS 單頁，改讀它的 `index.b9414901.js` 資料；UIAA 圖解是影像 PDF，直接看頁面。REI 擋 curl，Bulletproof 價格改用 Exa web_search（REI 分類頁內容）。影片字幕用研究的 `tmp-biners/qd/v/*.txt`；HowNOT2 Ts5bK_luHl8 研究沒有字幕檔，另用 `yt-dlp --cookies-from-browser chrome` 重抓。

## post-verify

### BSMI 召回公告（特別指定，逐字對過標檢局頁面本身）

來源：<https://www.bsmi.gov.tw/SafetyGIP/wSite/ct?xItem=130064&ctNode=8206&mp=65>（curl 200，2026-10-24 讀取；頁面「更新日期 2026年10月22日」）

公告原文（節錄，逐字）：

> 台灣迪卡儂有限公司SIMOND登山快扣產品召回訊息
> 發布日期：2026/10/19　發布單位：綜合企劃組
> 一、商品名稱：登山快扣
> 二、廠牌：SIMOND　型號：8589547、8589548、8608405、8935765、8935909　序號：無
> 三、業者：台灣迪卡儂有限公司
> 四、數量：20件
> 五、銷售期間：2022年1月1日至2026年7月22日
> 六、銷售地點：臺灣
> 七、瑕疵情形：部分快扣的鋼絲鉚接處存在缺陷。此組裝缺陷可能會導致鋼絲門斷裂，進而在墜落時造成快扣斷裂的風險，我們要求顧客立即停止使用此設備，並全面召回此產品。
> 八、詳情描述：……檢查鋼絲門的兩側是否仍然牢固地連接在快扣上。一手握住快扣，將拇指放在兩根鋼絲之間（拇指靠近鉚接處），用力向下按壓檢查。將快扣翻轉，在鋼絲門的另一側重複相同的動作。如果您的產品未受此缺陷影響，您可以安心繼續使用。如果在檢查後發現您的產品受此缺陷影響，請立即停止使用，並前往任一迪卡儂門市辦理退貨退款。
> 九、造成損害：未接獲相關事故。
> 十二、產地：法國

| 文章宣稱 | 結論 |
|---|---|
| 公告日 2026-10-19、台灣迪卡儂召回 SIMOND「登山快扣」 | ✅ Confirmed |
| 型號 8589547、8589548、8608405、8935765、8935909（tldr、警示框、練習題 2，中英各三處） | ✅ Confirmed，五個逐一相符 |
| 銷售期間 2022-01-01 至 2026-07-22、在台灣售出 | ✅ Confirmed |
| 瑕疵：鋼絲鉚接處缺陷 → 鋼絲門可能斷裂 → 墜落時快扣斷裂風險 | ✅ Confirmed（轉述忠實） |
| 檢查方法（拇指在兩根鋼絲間靠近鉚接處下壓、翻面重複、確認兩側牢固）、有問題停用、任一門市退貨退款 | ✅ Confirmed |
| SIMOND 召回頁把五型號對到 Alpinism 11 cm／17 cm／5 入組、Vertika 11 cm／17 cm | ✅ Confirmed（召回頁 JS 資料：Alpinism 11 cm (4051175 / 8589547)、Alpinism 17 cm (4051176 / 8589548)、Pack of 5 Alpinism (4171656 / 8608405)、Vertika 11 cm (5499689 / 8935765)、Vertika 17 cm (5500194 / 8935909)） |

附註（不改稿）：SIMOND 自家召回頁寫的購買期間是 2022-01-01 至 **2026-07-23**，標檢局寫 07-22；文章引標檢局，照標檢局即可。公告另寫「數量：20件」「未接獲相關事故」，文章沒寫，不影響正確性。

### 其他宣稱

| 宣稱 | 來源 | 結論 |
|---|---|---|
| AAC：Red River Gorge，第一支 bolt 快扣下方鉤環把繩完全割斷、攀者墜地頭部受傷；Muir Valley 事後把鋁鉤環常駐快扣換成不鏽鋼 | AAC Accidents（2011）全文 | ✅（原文：「rope was completely severed by the lower carabiner」「sustained head injuries」「new stainless steel PermaDraws」） |
| Hotforge Hybrid 12／16 cm、99／104 g、USD 25.95（12 cm）、6 入 USD 149.95、上 keylock 下鋼絲 | BD 12 cm、16 cm 產品頁＋Shopify JSON；Quickpack 經 BD 站內搜尋 JSON | ✅ |
| Litewire 12／16 cm、73 g、USD 26.95、12 mm 扁帶 | BD 產品頁＋Shopify JSON | ✅ |
| Litewire「當天缺貨」 | BD Shopify JSON：兩個變體 `available: true`；頁面上的「Out of Stock」是按鈕模板文字，Hotforge（有貨）頁也有同一段 | 🔴 Contradicted → **已刪**（中英） |
| DMM Alpha Steel「當天缺貨／backordered」 | DMM 頁內 `variantsInventoryQuantity` 全部 ≥1、policy deny（可直接下單）；「is backordered」是 `class="backorder hidden"` 的隱藏模板 | 🔴 Contradicted → **已刪**（中英） |
| Djinn Axess 12／17／25 cm、107–123 g、USD 32.95、直門＋彎門 keylock | Petzl US 頁 | ✅ |
| Spirit Express 12／17／25 cm、92–107 g、USD 35.95 | Petzl US 頁 | ✅ |
| Ange Finesse 10／17 cm、66–81 g、USD 36.95 起、MonoFil 單線鋼絲＋Keylock | Petzl US 頁 | ✅ |
| Session USD 27.95；Astro 10／15／20 cm、USD 23.95（15 cm） | Wild Country US 頁（Session 27.95 是 12 cm，17 cm 為 29.95） | ✅ |
| Alpha Sport 12／18／25 cm、112–122 g、GBP 29.00 起 | DMM Shopify JSON＋頁面 | ✅ |
| Phantom Wire 12／18／25 cm、63–67 g、GBP 21.50 起、縮小凹口、11 mm | DMM 頁 | ✅ |
| Alpha Steel 151／156 g、GBP 20.50 起、原廠說適合第一支、crux、轉向 | DMM Shopify JSON 描述 | ✅ |
| Bulletproof 12／18 cm、重量原廠沒列、掛繩端鋼套 | Edelrid 頁（Weight 欄空白） | ✅ |
| Bulletproof REI USD 44.95–45.95 | Exa 讀到 REI 分類頁 USD 44.95；45.95 上限沒看到 | 🟡 Unverifiable（下限 44.95 有，上限沒找到） |
| OGL 2024：Spirit Express 總分最高、Hotforge Best Bang for the Buck、Litewire Best Overall Lightweight、Bulletproof Best for Durability；Hotforge 門彈簧較緊、扁帶不是給你抓的；Orbit Wire 定位器太笨重最不喜歡 | OGL Best Quickdraws（2024-11-01 更新）全文 | ✅ |
| OGL 選購指南：12／18 cm、短的常見、長的萬用較貴；鋼絲門較便宜稍輕、較少 flutter、凹口易卡；門型多半是個人偏好；溝槽多在前幾支、砂岩區或髒繩更快；曬白變硬的尼龍扁帶特別弱 | OGL buying advice 全文 | ✅ |
| Treeline 2026：Ange Finesse Best overall、Spirit Express Best for sport、Session Best for beginners、Astro Best for trad、Bulletproof Most durable；Spirit 掛 bolt 端鉤環活動度較差；UIAA 121／UIAA 104／EN 566、假鉤環 | Treeline 全文 | ✅ |
| Treeline 對 CAMP Photon：「掛繩端也比較鬆」 | Treeline 原文：「The sling end of the quickdraw was looser than most」——sling end 是掛 bolt 的那端；對掛繩端（rope end）講的是 keeper 不夠耐用 | 🔴 Contradicted → **已改**為「扁帶套住掛 bolt 鉤環的那端比較鬆」（中英） |
| Wild Country：一律同一顆鉤環掛 bolt、借人要講；bolt 刮出毛邊傷繩；有溝無銳邊可用、磨掉超過 20% 厚度要換 | Wild Country beta talks 全文 | ✅ |
| DAV 2010：bolt 端 keylock、繩端 wiregate 已成主流；頂級鉤環開門強度超過 9 kN | DAV PDF 原文「über neun Kilonewton」「Für die Hakenseite … Keylock-Schnapper ohne Nasen, auf der Seilseite Wiregate-Schnapper」 | ✅ |
| UIAA 121／EN 12275：T 型（directional）是快扣用 | UIAA 圖解 p.1「Type T (directional) Connector for Quickdraws」 | ✅（但見「需要人判斷」第 2 條） |

### 影片（URL、標題、頻道、上傳日由 yt-dlp metadata 核對；描述對字幕）

| 影片 | 核對 | 結論 |
|---|---|---|
| HowNOT2 Ts5bK_luHl8，start 60 | 1:03 起講鋼絲門＝門本身是彈簧、零件少、不易 flutter、開門強度「from say 26 … to eight」；2:23 有兩顆舊鉤環；16:26「this is just really fun entertainment」、19:39「not science」；說明欄有自家商店連結 | ✅ |
| Hard Is Easy 3pEvn4P1vj0，start 394（6:34） | 3:35 rubber keeper；6:34 長度、6:55「only 7 grams difference」；6:14 厚扁帶適合 projecting；10:27 偏好中等長度再延長；13:10 實心 vs 鋼絲、13:30 避開有勾鉤鼻；說明欄「Above links might be affiliate」 | ✅ |
| 同上，gate flutter 結論標成「13:10 起」 | 字幕：14:05 才開始講 gate flutter，「couldn't find a single case」在 15:34 | 🟠 時間碼不準 → **已改**為「14:05 起講 gate flutter，15:34 的結論」，鉤鼻提醒標 13:30（中英） |
| EpicTV I67kYoqmc8g，start 535（8:55） | 0:00 Chamonix 附近、「this isn't a sponsored video」、從 EpicTV 商店挑；8:55 抓扁帶掛繩、Hotforge 較細「cuts into your fingers a bit」、10:05 Alpha Sport「makes such a difference」；11:56 最愛 Proton、Djinn 約 12 歐很划算、Bulletproof 最貴適合反覆墜落處、Hotforge 好的全能款 | ✅ |
| Beor Ong pxjECLzUTGE，start 330（5:30） | 4:56 單繩距約 12 支；5:30 Hotforge（便宜、到處有、缺點大家都有）；5:48 Spirit 高階最划算；6:59–7:16 Bulletproof 不建議整組、第一支／crux／頂端；7:52 LiveWire 是他的首選；說明欄 EpicTV `?code=3dc8f7` 推薦碼、LiveWire「no longer in production」 | ✅ |
| Kellen Erickson 5alF0MA1yHk，start 22 | 0:03 兩季；1:11 有 10 支、上吊帶感覺不到重量；2:39 建議大顆；3:36 掛繩端鉤環會滑；5:02–5:21 後來判斷不是 string，是扁帶材料不夠；說明欄無贊助揭露 | ✅ |
| カモシカスポーツ tErqneRslbs，start 19 | 0:19 四類；1:14 雙實心耐用、2:11 推薦運攀、好握；2:51 鋼絲門輕、耐凍耐髒；鉤鼻被 bolt 卡在 4:03 之後（「2:51 起」涵蓋） | ✅ |
| カモシカスポーツ bPn1iFL4PXI（文字連結，2:11） | 2:11 bolt 端要固定、會刮傷，拿去掛繩傷繩；依顏色裝回在 3:10 | ✅（「2:11」是論點起點，顏色那句在 3:10，可接受） |
| HowNOT2 VS40w7ouVJM，start 179（2:59） | 2:59 第一次拉是鉤環先斷；3:36 再拉割斷繩；3:54 換新繩又割斷；6:03 都撐到 MBS；6:22 鋼鉤環較慢磨出溝、適合常下放的第一支；說明欄有 SHOP 連結 | 🔵 Misframed（原文只寫「繩被割斷、鉤環強度幾乎都還在」，漏了第一次是鉤環先斷）→ **已改**寫出三次拉的順序（中英） |
| EpicTV 8cpjGmAelZs（文字連結） | 1:12「a few different lengths … wind all over the place or perhaps through roofs … minimize rope drag」 | ✅ |
| 徐暘 OWRLyuZeAVc（文字連結，2020-10-22） | metadata 標題、頻道、日期相符；無字幕（未核對內容，文章也沒引內容） | ✅ |

### 小計

以表格列計（一列可能含多條數字）：Confirmed 32（BSMI／SIMOND 6、其他宣稱 17、影片與影片連結 9）；Outdated 1（Hard Is Easy 時間碼）；Unverifiable 1（Bulletproof REI 上限 45.95）；Contradicted 3（Litewire 缺貨、Alpha Steel 缺貨、Photon 鬆的那端）；Misframed 1（HowNOT2 溝槽測試）。

範圍聲明：本次只檢查了文中已提出的 38 列宣告，未評估文章對主題的覆蓋是否完整。已知待決（review-todo）：CAMP Orbit Wire 原廠頁讀不到、規格價格來自 REI，不重報。

## post-review

- frontmatter：title／date 2026-10-24／category climbing／tags 5 個（既有 tag）／lang／type guide／series 攀岩裝備（en：Climbing Gear）order 7 與 plan.md 一致。description 與 tldr 不重複。✅
- tldr 與正文：Hotforge 12 cm US$25.95、上 keylock 下鋼絲；Spirit／Djinn；Bulletproof 2–3 支；掛 bolt 端不掛繩；BSMI 日期與五個型號——逐項與正文一致。✅
- 結構：開頭兩段（是什麼、這篇回答什麼、連到岩館先鋒／戶外先鋒／鉤環）→ 召回警示 → 構造 → 四個判準（每節都有「今晚就能做的事」）→ 三張型號表＋沒收清單 → 影片 → 依情境 → 檢查與汰換（連 order 最後一篇 inspection-retirement）→ 4 題練習（details）→ 下一步（第 8 篇繩子）→ 延伸觀看 → 參考資料。✅
- 系列連結：下一步連 `/posts/climbing/2026-10-24-climbing-rope`（en `-en`），符合 plan.md order 8。文中沒有連上一篇 order 6 頭盔——範本與寫稿規格只要求「下一步」，不算缺。✅
- 中英對應：`check-lang-parity` OK；人工逐段對過數字、型號、影片 ID、起播秒數、站內連結，一致。✅
- 站內連結：全部 `/posts/climbing/<slug>`，英文版加 `-en`；`check:references` 無本篇錯誤。✅
- 拆分篇完整性（對照 `2026-10-19-climbing-rope-belay-device.md`「### 快扣」與 T 型段）：DAV 2010 段、HowNOT2 Ts5bK_luHl8（start 60，說明文字逐字帶過）、UIAA T 型、岩館先鋒／戶外先鋒連結、延伸觀看兩個頻道介紹、參考資料（UIAA、DAV、HowNOT2）都帶過來。原文的四題練習與 glossary 全是繩子／確保器，不屬快扣，正確地沒帶。✅
- 機械檢查：`check:tw` 0 blocking（「頭部」1 筆是解剖語境，保留）；`pnpm lint` 0；`check-youtube-embeds` 7 支、0 invalid fence（無 API key，只盤點）；`check-series-order` 的 4 個 blocking 都是舊合併文還在（order 2、3 重複），不是本篇。

### 需要人判斷

1. Bulletproof 的 REI 價格只看到 USD 44.95（REI 分類頁），文中 44.95–45.95 的上限找不到來源；建議改成「REI USD 44.95」或補 18 cm 頁面。
2. 「快扣上的兩個鉤環屬於 T 型」：UIAA 圖解只說 T 型是快扣用，市售快扣鉤環不少是以 B 型認證（未逐款查證）。這句沿用自原合併文；建議改成「UIAA 為快扣用鉤環另設 T 型」之類較窄的說法，由作者決定。
3. 練習題 2 的情境寫「SIMOND 鋼絲門快扣」，沒收清單也寫「鋼絲門款正在召回」；標檢局公告只寫「登山快扣」五個型號、瑕疵在鋼絲門鉚接處。意思沒錯，但「鋼絲門款」可能被讀成 SIMOND 所有鋼絲門快扣都在召回範圍；要不要改成「這五個型號」請作者定。
4. 「今晚就能做的事」第 4 節寫「三個強度數字」：UIAA 圖解對 T 型的橫向強度標「--」（不要求），有些快扣鉤環可能只有兩個數字有意義。影響小，是否改寫由作者定。

## post-polish

- `register-scan.sh`（修改後）：長句 4 句（61／68／64／69 字；兩句在延伸觀看頻道介紹，一句是連結串列，一句是 HowNOT2 影片導讀），佔比低於 10%，保留。審稿修改原本新增兩句 72–73 字長句，已斷句。
- 但書 10%；引述區塊 3（召回警示框，必要）；姓名當主詞 1；模板化轉折 0；一般英文術語 0。
- 數字密度 4–6 的段落 8 段：多是影片時間碼（讀者要用來跳轉）、型號清單（召回型號必須完整）與 7 g／12→17 cm 的比較，都是讀者做決定要用的數字，保留。
- `scan-ledger.sh`：0 命中。
- 人工回讀：開頭直接回答「要買哪一組」，台灣讀者位置靠標檢局召回與迪卡儂通路落地；語氣一致，沒有 memo 腔。

## 直接修改清單（中英同步）

1. 型號表 BD Litewire 價格欄刪「（當天缺貨）」／「(out of stock that day)」——BD 庫存 JSON 顯示有貨。
2. 型號表 DMM Alpha Steel 價格欄刪「（當天缺貨）」／「(backordered that day)」——DMM 庫存 JSON 顯示有貨。
3. 沒收清單 CAMP Photon：「掛繩端也比較鬆」→「扁帶套住掛 bolt 鉤環的那端比較鬆」；en「with a looser rope end」→「with the sling looser than most at the bolt end」。
4. 判準 2 gate flutter 段：時間碼「13:10 起」→「14:05 起講 gate flutter，15:34 的結論」，鉤鼻提醒補「13:30」；中文同時斷成三句。
5. 檢查與汰換 HowNOT2 段：補上第一次拉是鉤環先斷、之後兩次（第二次換新繩）才是繩被割斷、鉤環都撐到標示強度以上；中文斷句。

下一步（未完成前不能 commit）：作者看「需要人判斷」4 條；舊合併文刪除後重跑 `check-series-order`。
