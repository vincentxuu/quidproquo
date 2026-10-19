# 攀岩裝備系列研究（L 模組）

日期：2026-10-18
用途：`.work/series-plans/climbing-gear.md` 的來源底稿。範圍是「買、挑、檢查、汰換」，不寫確保與保護技術（已在 sport-trad-climbing 系列）。
不寫品牌型號推薦；只寫選購判準、標準數字、原廠汰換規則。

## 工具降級紀錄（toolDegradation）

- (1) Groundlane MCP：`web_search`／`web_fetch` 載入後回 `MCP server "claude.ai Groundlane" is not connected`。
- (2) Groundlane 直接 HTTP：`POST https://groundlane.vincent-xu-work.workers.dev/mcp` 回 HTTP 401（需授權）。
- (3) Keenable keyless search：可用，所有候選 URL 由此取得。
- 讀頁：r.jina.ai 先用，之後被 429 rate limit；改用 curl＋本地 HTML→文字轉換；JS 渲染頁（Petzl、UIAA PDF 連結）改用 Exa `web_fetch_exa`；firecrawl MCP 回 not connected；linkup 連線失敗。
- UIAA 標準圖解 PDF 是圖片，轉 PNG 後目視判讀（101、105、106、121）。

## 來源與讀取程度

✅＝讀過全文或該段原文；🟡＝只讀到摘要或部分；🔴＝沒讀到。

### 標準（UIAA／EN）
- ✅ UIAA Safety Standards 總表：https://www.theuiaa.org/safety/safety-standards/ （UIAA 自 1960 年從繩子開始訂標準；與 CEN 協調，部分 UIAA 加測，比 EN 嚴；列出 101 繩、105 吊帶、106 頭盔、121 鉤環、129 制動器）
- ✅ UIAA 101／EN 892 動力繩圖解（3 頁，目視）：https://www.theuiaa.org/documents/safety-standards/Pictorial_UIAA101%20Dynamic%20Ropes.pdf
- ✅ UIAA 105／EN 12277 吊帶圖解：https://www.theuiaa.org/documents/safety-standards/Pictorial_UIAA105%20Harnesses.pdf
- ✅ UIAA 106／EN 12492 頭盔圖解：https://www.theuiaa.org/documents/safety-standards/Pictorial_UIAA106%20Helmets.pdf
- ✅ UIAA 121／EN 12275 鉤環圖解（第 1 頁）：https://www.theuiaa.org/documents/safety-standards/Pictorial_UIAA121%20Connectors.pdf
- ✅ UIAA〈Safety standard for braking devices published〉2009-09-19（Exa 摘要含全文主要段落）：https://www.theuiaa.org/safety-standard-for-braking-devices-published/
- ✅ UIAA〈First braking devices receive Safety Label〉2011-02-01：https://www.theuiaa.org/first-braking-devices-receive-safety-label/
- 🟡 EN 15151-1／-2 的 8 種類型表：來自個人 wiki（zozlak.org，2024），非官方；標準本文付費。https://zozlak.org/wiki/doku.php?id=braking_devices ；標準目錄頁 https://standards.iteh.ai/catalog/standards/cen/0d20e07e-e066-4902-b6d7-ea7c05c72d90/en-15151-2-2012 只有題名。
- ✅ UIAA 防水繩標準（2014-02-26）：https://theuiaa.org/home/new-uiaa-standard-developed-for-water-repellant-ropes
- ✅ UIAA〈Ten things to consider when buying climbing gear〉2026-02-24 版：https://theuiaa.org/uiaa/uiaa-advice-ten-things-to-consider-when-buying-climbing-gear
- 🟡 Sterling〈An Overview on Drop Testing〉（只讀到前段）：https://sterlingrope.com/sterling-solid/sterling-r-d-report-an-overview-on-drop-testing

### 原廠：壽命與檢查
- ✅ Petzl FAQ〈What is the lifetime of my Petzl equipment?〉：https://www.petzl.com/INT/en/Sport/FAQ/what-is-the-lifetime-of-my-petzl-equipment
- ✅ Petzl FAQ（金屬壽命 2008 改為無限期）：https://www.petzl.com/INT/en/Sport/FAQ/My-metal-Petzl-product-39-s-Instructions-for-Use-indicate-that-is-has-a-10-year-lifespan-What-is-it-now-Is-its-lifespan-now-considered-to-be-indefinite
- ✅ Petzl〈How to inspect your climbing harness〉2018-01-24（14 點檢查）：https://www.petzl.com/INT/en/Sport/News/2018-1-24/How-to-inspect-your-climbing-harness
- ✅ Petzl〈Tips for protecting your equipment: Belay devices, descenders〉PDF（Exa 摘要含原文段）：https://products.papertrail.io/downloads/petzl/d08231b_entretien-assureurs-descendeurs_EN.pdf
- ✅ Petzl GRIGRI 檢查程序與使用說明（Exa 摘要含原文段）：https://www.petzl.com/sfc/servlet.shepherd/version/download/0686800000Q6ZvUAAV ；https://www.petzl.com/sfc/servlet.shepherd/version/download/068Tx000009YCjEIAW
- ✅ Black Diamond QC Lab〈Worn belay loops and retiring a harness〉：https://blackdiamondequipment.com/blogs/stories/qc-lab-worn-belay-loops-and-retiring-a-harness
- 🔴 Black Diamond QC Lab〈Dangers of rope-worn carabiners〉：https://blackdiamondequipment.com/en/experience-story?cid=qc-lab-dangers-of-rope-worn-carabiners — Jina 只回列表頁、curl 回列表頁、Exa 回列表頁、firecrawl not connected。內容改由 DAV 與 BMC 覆蓋（同一主題）。
- ✅ Mammut〈Ropes〉care instructions：https://mammut.com/us/en/support/product-support/care-instructions/ropes （使用頻率對壽命的表是圖片，三種工具都抓不到；表格內容改用 DAV 2010 轉載的「製造商」表）
- 🟡 Mammut Australia〈Care & Maintenance Ropes Part 2〉：https://mammut1862.com.au/blogs/news/care-maintenance-ropes （同一張表是圖片，未讀到數字）
- ✅ Mammut〈Climbing Helmets〉care instructions：https://mammut.com/us/en/support/product-support/care-instructions/climbing-helmets
- ✅ Edelrid〈How to wash and care for a climbing rope〉：https://edelrid.com/int-en/knowledge/knowledge-base/looking-after-your-climbing-rope
- ✅ Edelrid〈Climbing rope care: hazards every climber should know〉：https://edelrid.com/us-en/knowledge/knowledge-base/dangers-for-climbing-ropes
- ✅ Black Diamond〈How to Choose a Climbing Rope〉：https://blackdiamondequipment.com/blogs/stories/how-to-choose-a-climbing-rope
- 🟡 Climbing Technology PPE 定期檢查表（Exa 摘要；1 mm 刻痕門檻）：https://www.climbingtechnology.com/wp-content/uploads/2020/11/PRO24-2K117CTEN_rev-7_09-19.pdf

### 山岳協會安全研究
- ✅ DAV〈Ausrüstung aussortieren oder weiter verwenden?〉（DAV-Sicherheitsforschung）：https://www.alpenverein.de/artikel/nutzungsdauer-karabiner-seile-helme-klettersteigsets_a1acb469-ec21-4718-a487-9facc2f821d7
- ✅ DAV Panorama 5/2010〈Lebensdauer von Alpinausrüstung — Im Zweifel für den Zweifel〉PDF：https://sac-hoherrohn.ch/wp-content/uploads/2019/02/dav_lebensdauer-von-alpinausruestung.pdf
- ✅ DAV Panorama 4/2019〈Alterung von Bergsportausrüstung (1)〉PDF（內容與上面 alpenverein.de 文章相同）：https://www.dav-hameln.de/111%20-%20Sektion%20Hameln/Dokumente/PDF/DAV/Ausr%C3%BCstung/Panorama-4-2019-Ausr%C3%BCstungsalterung%20%281%29.pdf
- ✅ BMC〈The dangers of worn perma-draws〉（archive.org 2023-09-14 快照）：https://web.archive.org/web/20230914194425/https://www.thebmc.co.uk/the-dangers-of-worn-permadraws

### 攀岩鞋：研究與選購
- ✅ McHenry et al. 2015, *The Foot* 25(3):152–8, PMID 26261058（摘要）：https://pubmed.ncbi.nlm.nih.gov/26261058
- ✅ Buda et al. 2013, *JAPMA* 103(2):113–20, PMID 23536501（摘要）：https://pubmed.ncbi.nlm.nih.gov/23536501
- ✅ Killian et al. 1998, *JAPMA* 88(8):365–74, PMID 9735622（摘要）：https://pubmed.ncbi.nlm.nih.gov/9735622
- ✅ van der Putten & Snijders 2001, *Applied Ergonomics* 32(4):379–87, PMID 11461039（摘要）
- 🟡 Schöffl & Küpper 2013〈Feet injuries in rock climbers〉*World J Orthop*（讀到摘要與前兩節）：https://pmc.ncbi.nlm.nih.gov/articles/PMC3801241/
- 🔴 2025 西班牙觀察研究（pies de gato 尺寸與足部狀況）：https://scielo.isciii.es/scielo.php?pid=S2695-463X2025000200091&script=sci_arttext&tlng=en — 未開；🔴 2025 土耳其研究 dergipark：https://dergipark.org.tr/en/pub/cprr/article/1803129 — 未開。寫 order 1 前要補讀。
- ✅ REI〈How to Choose Rock Climbing Shoes〉：https://www.rei.com/learn/expert-advice/rock-shoes.html
- ✅ Climbing.com〈When Should You Resole Your Climbing Shoes?〉（Rock & Resole 創辦人 Eric Pauwels，轉載自 Matt Samet *Crag Survival Handbook* 2013）：https://climbing.com/gear/resole-rock-climbing-shoes

### 吊帶／頭盔選購
- ✅ REI〈How to Choose Climbing Harnesses〉2025-08-29 更新：https://www.rei.com/learn/expert-advice/climbing-harness.html
- 🟡 Climbing Anchors（澳洲零售）〈When To Replace A Climbing Helmet〉：https://www.climbinganchors.com.au/guides/when-to-replace-your-climbing-helmet （零售商，二手來源；只當檢查清單參考）

### 台灣來源
- ✅ Petzl 台灣官網〈如何挑選攀岩吊帶?〉2026-07-16：https://www.petzltw.com/pages/舒適的盪在空中指南_如何挑選攀岩吊帶
- ✅ 艾格探險〈攀岩新手必學－攀岩吊帶的穿著與挑選〉：https://www.adventuretaiwan.com/how-to-wear-climbing-harness/
- ✅ Climbing Ninjette 攀岩小妞〈攀岩鞋尺寸怎麼選〉2026-08-29：https://climbingninjette.com/2026/08/29/climbing-shoes-size/
- ✅ OUTSiDERS〈新手的第一雙攀岩鞋〉：https://www.outsiders.com.tw/post/17455 （含品牌業配；只取通則句）
- ✅ 朱威抱石台／Hanchor〈攀岩鞋怎麼照顧〉：https://tw.hanchor.com/pages/climb13
- ✅ 岩流工作室〈攀岩鞋維修價格與流程〉：https://boulderbug.com/pages/climbing-shoe-repair-pricing-process （報價用 TWD；工作室所在地頁面沒寫，🟡）
- 🟡 Threads @gumbybear.climb 攀岩鞋修補資訊（說明送國外原廠認證 resoler）：https://www.threads.com/@gumbybear.climb/post/DAEHmifSJTn — 只看到搜尋摘要
- ✅ 馬布谷〈什麼是動力繩？單繩、半繩、雙子繩〉：https://mabuvalley.com/blogs/戶外豆知識/認識動力繩

## 主要發現

### 1. 標準與標籤：買的時候看什麼
- 個人防護裝備（PPE）在歐盟要有 CE；UIAA Safety Label 是另一套，部分項目加測、比 EN 嚴（UIAA 總表）。DAV 名詞表也寫 UIAA「多半比 EN 要求高」。
- 對照：

| 裝備 | EN | UIAA | 圖解上的關鍵數字 |
|---|---|---|---|
| 動力繩 | EN 892 | 101 | 單繩：80 kg、首墜衝擊力 ≤12 kN、至少 5 次墜落不斷；半繩：55 kg、≤8 kN、≥5 次；雙子繩（雙股）80 kg、≤12 kN、≥12 次；靜態延伸（80 kg）單繩 ≤10%、半繩 ≤12%；首墜動態延伸 ≤40%；外皮滑移 ≤20 mm；繩端標示 1／½／∞ 與製造年 |
| 吊帶 | EN 12277 | 105 | 坐式吊帶 15 kN；垂降用的環 ≥15 kN；扣具滑移 ≤20 mm；所有吊帶標示製造年；UIAA 另要求可見承重縫線至少 50% 為對比色 |
| 頭盔 | EN 12492 | 106 | 5 kg 從 2 m 垂直落下，傳到頭模的力 EN ≤10 kN、UIAA ≤8 kN；前、側、後衝擊（5 kg、0.5 m、60°）同樣門檻；3 kg 錐體 1 m 穿刺不得碰頭模；下巴帶 500 N 不斷 |
| 鉤環 | EN 12275 | 121 | 類型：B 基本、H（HMS，確保用）、K 鐵索、Q 快扣環、T、X；開口寬度 K ≥21 mm、其他 ≥15 mm；開門力 ≤5 N 時門要保持關閉 |
| 制動器（確保器） | EN 15151-1（輔助制動）、EN 15151-2（手動） | 129（2009 發布，2011-07-01 生效） | UIAA 129 分手動、輔助鎖定、垂降、帶防恐慌四類；首批取得標籤的是 GRIGRI 2 與 BD ATC 系列（2011）；EN 15151 細分 8 型 🟡（非官方整理） |

- Petzl 吊帶認證寫法：台灣官網寫「CE 的 EN 12277 Type C（坐式），以及 UIAA 105」。
- 防水繩：UIAA Water Repellent 標準（2014）要求輕度磨耗後浸水 15 分鐘，吸水 ≤繩重 5%；未處理繩約 50%，標「dry」但處理不足的 20–40%。只做表面處理的繩過不了。
- 製造年：DAV 2010 寫「自 2007 年起產品上必須標示製造年」；UIAA 105 圖解也寫所有吊帶要標製造年。
- 動力繩的作用：先鋒墜落時靠可控延展吸收能量；低延展繩（台灣常稱靜力繩）不能承受先鋒墜落（馬布谷）。BD：單繩約 8.8–10.2 mm；半繩、雙子繩多小於 8 mm；靜力繩用於上升、拖吊。馬布谷：單／半／雙子的繩徑會重疊，「不能只看毫米數」，先看繩端標示。

### 2. 壽命：原廠的硬上限
- **Petzl**：塑膠、紡織品從製造日起最長 10 年；金屬無期限（2008 年從 10 年改為無期限，追溯適用）。退役條件：大墜落或大負荷、檢查不過或有疑慮、**不知道完整使用歷史**、過時。建議每 12 個月由合格人員做一次詳細檢查。
- **Black Diamond（吊帶說明書，QC Lab 引述）**：妥善保存 10 年以上就退役；正常使用與保養下，吊帶預期壽命**約三年**，視頻率與條件長短不一。退役徵兆：織帶破洞、縫線斷或嚴重磨損、扣具裂／腐蝕／毛邊／變形、織帶因 UV 褪色、經歷嚴重墜落即使沒外傷也可能該退役。退役時要破壞避免再用。不要自己縫、燒線頭、銼扣具。
- **DAV 2010**：所有紡織品（吊帶、扁帶、鐵索套組）原廠上限 10 年，即使從沒用過；岩館的快扣即使看不出損傷，最多 1 年。金屬多數原廠不設上限，少數寫 10 年。頭盔多數原廠寫 10 年，塑膠老化會降低吸能，私人使用也應遵守。
- **DAV 2010 轉載的繩子壽命表（標示為「製造商」）**：從未使用 最多 10 年；一年一兩次 最多 7 年；每月一次 最多 5 年；每月數次 最多 3 年；每週 最多 1 年；幾乎每天 不到 1 年。
- **Edelrid**：繩子最晚 10 年換；偶爾使用且妥善保存可用 3–6 年；經常使用、常墜落，一年後建議降級為頂繩專用。
- **Mammut 頭盔**：重度使用（常被刮、被石頭打）不到 1 年；輕度使用、妥善存放最多 10 年。重摔、接觸強酸、殼或內襯深刮痕／裂／凹、下巴帶或調整系統撕裂、扣具變形、無法清除的髒汙、過度使用→立即換。貼紙、油漆、黏膠也可能無聲地削弱頭盔。
- **Mammut 繩**：中段出現明顯變粗、變硬或特軟、外皮破到看見芯→退役；只在繩端→可切掉。彎環測試：壓一個環，有回彈就可用，環塌下去就不行。墜落係數超過 1.0 的墜落後繩子已受損。

### 3. 檢查與保養：各家一致的部分
- 繩：每次用前後整條過手（Mammut、Edelrid、DAV）；DAV「Knicktest」——兩指能輕易把彎折處完全壓扁、彎內不再留一個「眼」，外皮已失去保護功能。運攀繩繩端磨最兇，切掉可繼續用（DAV、Mammut、BD 建議買 80 m 預留切短）。
- 繩的大敵：酸（電池酸與其蒸氣，傷害看不見，接觸就換）、銳利岩角、繩與繩摩擦熔化（兩條繩穿同一個點、從扁帶頂端下放）、UV、沙與花崗岩結晶滲入芯、粉也會輕微降強度（Edelrid、DAV）。存放：乾、暗、涼，不要長放汽車後車廂（Mammut、Edelrid、DAV）。
- 洗繩：Mammut 可機洗 30°C 羊毛程式、溫和清潔劑；Edelrid 建議浴缸手洗，機洗用 30°C 羊毛程式**不脫水**。兩家都說平鋪陰乾、不曬、不吊、不烘。
- 標記：DAV／Mammut 都建議繩中點只用原廠許可墨水或 Edding 3000；膠帶、貼紙、一般麥克筆的化學成分可能傷紡織品；DAV 特別說吊帶繫繩點的耐磨保護層磨穿就退役，**不要用膠帶補**。
- 吊帶：Petzl 14 點檢查（使用歷史、序號與 CE 可讀、未超過 10 年、對照新品、織帶、對比色安全縫線、確保環、繫繩點保護層、扣具、穿法、泡棉、彈性帶、裝備環）。DAV：吊帶最常磨損的是腿環之間那段（Beinschlaufensteg）。
- 頭盔：DAV——EPS（保麗龍）頭盔殼上的小凹痕通常沒問題，只要內部泡棉沒壞、殼沒洞沒裂；EPS 有小裂就會影響吸能。硬殼頭盔較能承受落石與多次撞擊；EPS 單次撞擊吸能較好。頭盔是個人裝備中唯一明顯受 UV 影響的，變色是警訊；放在車內擋風玻璃下曬到變形就換。
- 確保器與鉤環（金屬）：
  - DAV：鋁比鋼不耐磨；沙或岩粉讓鋁件很快被繩磨出凹槽，凹槽邊緣變成銳邊，**已造成過斷繩事故**；鋁鉤環截面減少約 25% 要退役，鋼製下放環約 50%。管狀確保器的制動槽磨深，制動力明顯下降，對確保者手力要求變高；自動鎖定型（Autotube）的制動也受鉤環磨損影響。
  - Petzl：確保器本體出現銳邊，說明書規定退役；建議任何金屬件磨耗深度超過 1 mm 就退役；1 mm 內可用細砂紙把銳邊磨圓。GRIGRI 要檢查側板（磨穿有洞即退役）、凸輪、把手彈簧、繩道內無沙無油，並做功能測試。
  - BMC：岩場常駐快扣（perma-draw）下放時繩子固定摩擦同一處，形成銳邊凹槽，瑞士有攀登者因此斷繩撞地死亡；先掛自己的快扣、吊著檢查，再改掛常駐快扣。
  - DAV：鎖門鉤環的自動鎖可能磨到失效（ball-lock 變得像 twist-lock）→清潔潤滑或退役；**不要用 WD-40**（加速老化），用無酸油或矽基潤滑劑，擦掉多餘的油。鋁鉤環不要拿去架 slackline（反覆負荷降強度、外觀看不出）。
- 金屬掉地：DAV 2010 與 2019 都寫「掉落會產生看不見的髮絲裂紋」**這個說法無法證實**；掉落後看起來沒事通常就沒事（見衝突 2）。

### 4. 攀岩鞋：合腳、研究、換底
- 研究：
  - McHenry 2015：56 名攀爬一年以上的攀岩者中 55 人鞋子不合腳、過緊；91% 攀爬時腳痛；攀岩鞋比街鞋平均小近 4 個英國碼；程度越高越傾向更緊（p<0.001）。橫斷面、小樣本。
  - Buda 2013：144 人，86% 有足部病變；趾甲問題 65.3%、反覆腳踝扭傷 27.8%、跟骨後滑囊炎 19.4%；平均小 2.3 碼；男性、高筒鞋、高難度、比賽層級相關。
  - Killian 1998：104 人問卷，81% 曾有足踝疼痛或病變，作者歸因於穿比街鞋小的鞋。
  - Schöffl & Küpper 2013 回顧：緊鞋改變足部力學、前足壓力增加，造成甲下血腫、胼胝、疼痛，並有高比例拇趾外翻、拇趾僵直的報告。
  - van der Putten & Snijders 2001：設計研究，主張貼合足形的鞋可預防傷害，不是臨床試驗。
  - 證據等級：全是橫斷面或問卷，沒有前瞻研究證明「多緊會造成多少傷」。
- 選購判準（REI、Ninjette、Outsiders 交集）：
  - 鞋型：平底（neutral）→中度下彎（moderate）→侵略型（aggressive，大下彎、不對稱）。新手第一雙選平底、偏舒適；下彎鞋不適合塞裂隙與 smear（REI）。
  - 合腳：貼合但不痛到撐不完一次課；腳趾微彎頂到前緣但不折疊；腳跟不脫空；鞋面按下去沒有空洞（Ninjette）。下午或運動後試穿（腳會腫）。
  - 延展：無內襯皮革最多可撐開約一整號；有內襯皮革半號以下（REI）；合成纖維幾乎不撐（Ninjette）；延展多在寬度、不是長度。
  - 鞋帶型可微調、魔鬼氈方便岩館穿脫、套鞋最敏感（REI、Outsiders）。
  - 襪子：租鞋穿襪（衛生）；自己的鞋多數不穿；不要用厚襪填大鞋（Ninjette）。
  - 先租還是先買：Ninjette 建議爬不到 5 次先租，一週一次以上再買（業者部落格意見，非研究）。
- 換底（resole）：
  - Pauwels（Rock & Resole）：90% 磨耗在大拇趾區；出廠鞋底那裡約 4 mm，薄到像紙就送修；包邊（rand，約 2 mm）有洞要補鞋頭（toe cap），補鞋頭必須同時換半底；照顧好的性能鞋可換 3–4 次底；美國價格 US$62–92。
  - 岩流工作室：半底 NT$1,500／雙、全底 NT$2,000／雙；建議在鞋底磨薄、還沒磨穿到包邊前送修。
  - 朱威抱石台：一週 2–3 天，鞋約 8 個月到一年（個人經驗）。

### 5. 吊帶與頭盔選購
- 吊帶類型（REI）：運攀／室內（自動扣、2–4 個裝備環、腿環常不可調）；傳攀（可調腿環、≥4 裝備環、厚墊）；登山；冰攀。確保環是最強、唯一經負荷測試的點（REI 用語）。
- Petzl 台灣：腰帶在髖骨上方收到最緊，倒掛也不會脫出；腿環舒適服貼即可；裝備環數：室內上攀 2 個、戶外運攀單繩距約 4 個、傳攀多繩距 6 個；繫繩點兩個環都要穿過。
- 艾格探險：腰帶約與肚臍同高，身體與吊帶之間能平放一個手掌但無法翻轉；舊式扣具需反穿，扣具上有 Danger 字樣者要反扣。
- UIAA（2026 建議）：吊帶與頭盔的合身影響保護效果，能試就試；各品牌尺寸差很多，看原廠尺寸表。
- 頭盔：DAV——EPS 輕、單次撞擊吸能好，適合運攀；硬殼較耐落石與多次撞擊，適合傳統高山地形。戶外確保者也要戴（已在〈戶外確保〉）。

### 6. 確保器、鉤環與繩的選購
- 相容性：UIAA 2026 建議以「為 9–10 mm 設計的確保器配 11 mm 繩可能無法正常運作」為例；GRIGRI 說明書寫相容 8.5–11 mm，最佳 8.9–10.5 mm；新繩、表面處理、濕、結冰的繩會降低制動效果。
- 輔助制動：〈岩館上攀確保〉已介紹 DAV 建議輔助制動確保器；本系列只講「怎麼選與相容」。非官方整理指出 EN 15151 的鎖定測試是靜態懸吊（2 kN 一分鐘），不是接未監督墜落；所有防恐慌型說明書仍要求制動手不離繩 🟡。
- 繩長：BD——60 m 適合高山與長接近；70 m 是現在岩場與多繩距的標準；80 m 用在長路線或想之後切短。繩長與下放事故已在〈戶外確保〉。
- 繩徑：BD 把 ≥9.5 mm 歸為耐用的主力繩、9.4 左右為全能、8.8 以下為高性能輕量。
- 鉤環：確保用有鎖鉤環選 HMS（H 型）（UIAA 121 圖解）。

### 7. 二手與網購
- UIAA 2026：不認可二手攀岩裝備，**吊帶、頭盔、繩子特別不該買二手**；只在可信品牌與通路網購；價格過低的「認證」商品要警惕仿冒；買到先檢查，不能接近建議使用年限；記錄品牌、型號、序號、購買日、檢查日、使用紀錄。
- Petzl：不知道完整使用歷史就該退役——等於二手軟裝備直接不合格。

## 衝突（並列，不選邊）

1. **繩子壽命數字**：DAV 2010 轉載的製造商表（每週使用 ≤1 年、每月數次 ≤3 年、每月一次 ≤5 年）vs Edelrid（偶爾用 3–6 年；經常用且常墜落一年後降級頂繩，不是退役）。差在「每週用一年後是退役還是降級」。寫作時兩者並列，並強調實際以檢查結果為準。
2. **金屬掉地要不要退役**：DAV 兩篇都說「掉落產生髮絲裂紋」無法證實，看起來沒事通常就沒事；BD QC Lab 作者對掉過的鉤環採「有疑慮就退役」；Petzl 退役條件含「有任何疑慮」。並列。
3. **吊帶壽命**：BD 說明書「正常使用約三年」vs Petzl／DAV 只寫「最多 10 年」上限。不是真衝突（使用壽命 vs 最長壽命），但讀者常誤讀為「吊帶可以用 10 年」，要講清楚兩個概念（DAV 的 Lebensdauer／Gebrauchsdauer）。
4. **攀岩鞋要小幾號**：OUTSiDERS「比平常小半號至一號」vs Ninjette「不要用小兩號公式，以貼合為準」；研究實測平均小 2.3 碼（Buda，義大利）或近 4 個英國碼（McHenry，蘇格蘭）。並列，不給公式。
5. **吊帶腰帶位置**：Petzl 台灣「髖骨上方、收到最緊」vs 艾格探險「約與肚臍同高、可平放一個手掌」。兩者多半不矛盾（肚臍位置因人而異），寫作時以原廠說明書為準。
6. **洗繩方式**：Mammut 說可機洗；Edelrid 建議手洗，機洗不脫水。
7. **頭盔類型**：DAV 建議運攀選 EPS、傳統地形選硬殼；Climbing Anchors（零售）提醒硬殼較難看出內部損傷。並列。

## 台灣用語（寫作時採用）

| 英文 | 本站用語 | 備註 |
|---|---|---|
| climbing shoes | 攀岩鞋 | 口語「岩鞋」可在內文用 |
| resole / half sole / toe cap / rand | 換底／半底／補鞋頭／包邊 | 岩流工作室用法 |
| downturn / neutral / aggressive | 下彎／平底／侵略型 | 侵略型括號附 aggressive |
| harness | 吊帶 | Petzl 台灣、艾格探險皆用「吊帶」；「安全吊帶」偏工安 |
| belay loop / tie-in points / gear loop / leg loop | 確保環／繫繩點／裝備環／腿環 | Petzl 台灣用語 |
| helmet | 頭盔 | |
| dynamic rope / static rope | 動力繩／靜力繩（低延展繩） | 馬布谷 |
| single / half / twin rope | 單繩／半繩／雙子繩 | 馬布谷 |
| belay device / assisted braking | 確保器／輔助制動確保器 | 站內〈岩館上攀確保〉已定義 |
| locking carabiner / HMS | 有鎖鉤環／HMS 鉤環 | |
| quickdraw | 快扣 | |
| PPE | 個人防護裝備 | |
| dry treatment | 防水處理 | |
| fall factor | 墜落係數 | 站內〈建立固定點〉已用 |

## 待解問題（寫作前或需使用者決定）

1. 篇數：4 篇（把「怎麼看標籤、先買什麼、二手」併入第 1 篇鞋子）還是 5 篇（獨立 order 0 總覽）？規劃表先寫 5 篇。
2. 快扣、有鎖鉤環、粉袋、刷子放哪裡？規劃表放進 order 3（鉤環、快扣）與 order 0（購物清單）；也可以另開一篇。
3. 繩子篇要不要講「岩館自帶繩」？台灣岩館多半提供頂繩繩、先鋒是否要自備繩依館而異——沒查到各館規定，寫前要查 2–3 家代表岩館（原岩、小岩館、角）的規章。
4. 台灣有沒有針對攀岩 PPE 的法規或商品檢驗（BSMI）？沒查到，寫前要查；查不到就寫「台灣沒有專門要求，看 CE／UIAA 標示」並註明查證方式。
5. 西班牙 2025 與土耳其 2025 兩篇鞋子研究未讀，寫 order 1 前補讀。
6. BD〈rope-worn carabiners〉頁面三種工具都只回列表頁（⚪ 暫無法取得），內容由 DAV 與 BMC 覆蓋，不影響規劃。
7. EN 15151 八型分類目前只有非官方整理；寫 order 3 時要找原廠說明書上的型別標示（例如 Petzl 說明書）交叉確認，否則只寫「手動／輔助制動」兩大類。
